// ==UserScript==
// @name         WhatsApp - Next Message Suggestor
// @namespace    fiverr.com/web_coder_nsd
// @version      1.2
// @description  Suggests 3-4 next message replies in WhatsApp Web using Gemini AI, based on the last 30 messages in the active conversation. Suggestions appear as buttons above the chat input and are sent on click.
// @author       noushadBug
// @license      MIT
// @match        https://web.whatsapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/540051/WhatsApp%20-%20Next%20Message%20Suggestor.user.js
// @updateURL https://update.greasyfork.org/scripts/540051/WhatsApp%20-%20Next%20Message%20Suggestor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Selectors & IDs ---
    const S = { bubbles: 'div.message-in, div.message-out', text: 'span.selectable-text span', footer: 'footer', input: 'footer div[contenteditable="true"]', app: '#app' }, WRAPPER_ID = 'gemini-suggest-wrapper', SUGGEST_BTN_ID = 'gemini-main-suggest-btn', BUILD_BTN_ID = 'gemini-build-btn';

    // --- Gemini API ---
    class Gemini {
        constructor() { this.base = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'; }
        async key() {
            let k = localStorage.getItem('gemini_api_key');
            if (!k) { k = prompt('Enter your Gemini API key:'); if (k) localStorage.setItem('gemini_api_key', k); else throw new Error('Gemini API key required'); }
            return k;
        }
        async ask(prompt) {
            const url = `${this.base}?key=${await this.key()}`;
            return new Promise((res, rej) => {
                GM_xmlhttpRequest({
                    method: 'POST', url,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
                    onload: r => { try { const d = JSON.parse(r.responseText); res(d.candidates?.[0]?.content?.parts?.[0]?.text || '[No response text]'); } catch (e) { rej(e); } },
                    onerror: () => rej(new Error('Network error'))
                });
            });
        }
    }
    const gemini = new Gemini();

    // --- Helpers ---
    const getLastMsgs = n => Array.from(document.querySelectorAll(S.bubbles)).slice(-n).map(node => {
        const textNodes = node.querySelectorAll(S.text);
        const texts = Array.from(textNodes).map(t => t.innerText).filter(Boolean);
        if (!texts.length) return null;
        const isMe = node.classList.contains('message-out');
        let time = node.querySelector('div [role="button"] span')?.textContent.trim() || '';
        return texts.map(text => ({ sender: isMe ? 'Me' : 'Sender', text, time }));
    }).flat().filter(Boolean);

    const writeTextToWhatsApp = (text, triggerEnter = false) => {
        const inputDiv = document.querySelector('footer div[contenteditable="true"][data-lexical-editor="true"]');
        if (!inputDiv) return console.error('WhatsApp input box not found.');
        inputDiv.focus();
        inputDiv.innerHTML = '<p><br></p>';
        document.execCommand('insertText', false, text);
        inputDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
        inputDiv.dispatchEvent(new InputEvent('input', { bubbles: true }));
        inputDiv.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
        if (triggerEnter && text.trim()) {
            inputDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            inputDiv.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            setTimeout(() => writeTextToWhatsApp('', true), 300);
        }
    };

    const showBtns = suggestions => {
        const wrapper = document.getElementById(WRAPPER_ID);
        if (!wrapper) return;
        let c = document.getElementById('gemini-suggestion-container');
        if (c) c.remove();
        c = document.createElement('div');
        c.id = 'gemini-suggestion-container';
        c.style = 'display:flex;gap:8px;margin:8px 0;';
        suggestions.forEach(s => {
            const btnContainer = document.createElement('div');
            btnContainer.style = 'border-radius: 6px;border: 1px solid rgb(204, 204, 204);box-shadow:0 0 8px 1px rgb(46 122 69 / 70%);display:flex;align-items:center;gap:4px;margin-bottom:4px;';
            const b = document.createElement('button');
            b.textContent = s;
            b.style = 'padding:6px 12px;color:#e6f2ff;cursor:pointer;position:relative;display:inline-flex;align-items:center;';
            b.onclick = () => writeTextToWhatsApp(s, true);
            btnContainer.appendChild(b);
            c.appendChild(btnContainer);
        });
        wrapper.appendChild(c);
    };

    const buildPrompt = msgObjs => {
        let conversation = msgObjs.map(m => `${m.sender} [${m.time}]: ${m.text}`).join('\n');
        let timeInstruction = '', now = new Date(), lastMsg = msgObjs[msgObjs.length - 1], lastTime = lastMsg?.time;
        // Parse last message time and compare to now
        const parseTime = t => { const match = t.match(/(\d{1,2}):(\d{2}) ?([AP]M)?/i); if (!match) return null; let h = parseInt(match[1], 10), m = parseInt(match[2], 10); if (match[3]) { if (match[3].toUpperCase() === 'PM' && h < 12) h += 12; if (match[3].toUpperCase() === 'AM' && h === 12) h = 0; } return h * 60 + m; };
        let diff = null;
        if (lastTime) {
            let t2 = parseTime(lastTime), tNow = now.getHours() * 60 + now.getMinutes();
            if (t2 !== null) {
                diff = tNow - t2; if (diff < 0) diff += 24 * 60;
                if (diff > 60) timeInstruction += `It has been a long time (${diff} minutes) since the last message. Consider if the previous topic is finished, and whether to start a new topic, greet with Salam, or follow up on something older.`;
                else if (diff > 10) timeInstruction += `There was a pause (${diff} minutes) since the last message. Consider if the topic is finished or if you want to follow up or start a new topic with Salam.`;
            }
        }
        // Also check last two messages for topic change
        if (msgObjs.length > 1) {
            const t1 = parseTime(msgObjs[msgObjs.length - 2].time), t2 = parseTime(msgObjs[msgObjs.length - 1].time);
            if (t1 !== null && t2 !== null) {
                let d = t2 - t1; if (d < 0) d += 24 * 60;
                if (d > 60) timeInstruction += ` The last message was sent after a long gap (${d} minutes) between messages. If appropriate, acknowledge the delay or respond accordingly.`;
                else if (d > 10) timeInstruction += ` There was a noticeable pause (${d} minutes) before the last message. Consider this in your reply.`;
            }
        }
        return `Given the following WhatsApp conversation, you are 'Me'. Suggest 4 possible next replies that you (as 'Me') would send, as concise, friendly, and context-aware messages.\n\nRules:\n- ONLY suggest replies that 'Me' would send next. NEVER suggest a reply that the Sender would say.\n- Be extremely careful to understand who said what.\n- If the last message contains 'insha'Allah' (or similar), suggest a reply with 'insha'Allah'.\n- If the last message contains 'alhamdulillah' or something nice, suggest a reply with 'alhamdulillah' or 'mashaAllah'.\n- If the last message uses 'আপনি', reply using 'আপনি'. If it uses 'তুমি', reply using 'তুমি'.\n- Pay close attention to who said what and the timing of each message.\n- If there has been a long pause or the topic seems finished, you may start or end with Salam, or follow up on something older.\n${timeInstruction ? '- ' + timeInstruction + '\n' : ''}Conversation:\n${conversation}\n\nReply suggestions: Return a JSON array of 4 strings, each string being a suggested reply that 'Me' would send next. Example: [\"Sure, I'll get back to you soon.\", \"Can you clarify your last point?\", ...]`;
    };

    // --- AI Suggestion Logic ---
    async function suggestNext() {
        try {
            const msgObjs = getLastMsgs(30);
            if (!msgObjs.length) return;
            const prompt = buildPrompt(msgObjs);
            console.log('[Gemini Prompt]', prompt);
            const out = await gemini.ask(prompt);
            console.log('[Gemini Raw Output]', out);
            let suggestions = [];
            try { suggestions = JSON.parse(out); if (!Array.isArray(suggestions)) throw new Error('Not an array'); }
            catch { const match = out.match(/\[(.*)\]/s); if (match) { try { suggestions = JSON.parse(match[0]); } catch { } } if (!Array.isArray(suggestions)) { suggestions = out.split(/---+/).map(s => s.trim()).filter(Boolean).slice(0, 4); } }
            if (suggestions.length) showBtns(suggestions);
        } catch (e) { alert('Gemini API error: ' + (e.message || e)); console.error('Gemini API error:', e); }
    }

    // --- Modal for Build Message ---
    function showBuildModal(onSubmit) {
        document.getElementById('gemini-build-modal')?.remove();
        const modalBg = document.createElement('div');
        modalBg.id = 'gemini-build-modal';
        // Theme-based, blurred background
        modalBg.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;display:flex;align-items:center;justify-content:center;animation:gemini-fadein-bg 0.2s;backdrop-filter:blur(6px);background:var(--wa-modal-bg,rgba(0,0,0,0.18));';
        const waBg = getComputedStyle(document.body).getPropertyValue('--background-default') || '';
        if (waBg) modalBg.style.background = waBg + 'cc';
        else modalBg.style.background = 'rgba(0,0,0,0.18)';
        const modal = document.createElement('div');
        modal.style = 'background:#2f3237;padding:28px 24px 20px 24px;border-radius:14px;box-shadow:0 8px 32px 0 rgba(0,0,0,0.18);min-width:320px;max-width:90vw;display:flex;flex-direction:column;align-items:center;animation:gemini-popin 0.25s;';
        modal.innerHTML = `<div style="font-size:1.2em;font-weight:600;margin-bottom:12px;">Build a Message</div><input id="gemini-build-input" type="text" placeholder="Describe your intent or message..." style="width:100%;padding:8px 12px;font-size:1em;border-radius:6px;border:1px solid #ccc;margin-bottom:16px;outline:none;transition:border 0.2s;" autofocus /><div style="display:flex;gap:12px;justify-content:center;width:100%;"><button id="gemini-build-cancel" style="padding:7px 18px;border-radius:6px;border:none;background:#eee;color:#333;font-weight:500;cursor:pointer;transition:background 0.2s;">Cancel</button><button id="gemini-build-submit" style="padding:7px 18px;border-radius:6px;border:none;background:#28a745;color:#fff;font-weight:600;cursor:pointer;transition:background 0.2s;">Build</button></div><style>@keyframes gemini-popin {0%{transform:scale(0.8);opacity:0;}100%{transform:scale(1);opacity:1;}}@keyframes gemini-fadein-bg {0%{opacity:0;}100%{opacity:1;}}#gemini-build-modal input:focus {border:1.5px solid #28a745;}#gemini-build-modal button:hover {background:#d4f5d4;}#gemini-build-submit:active {background:#218838;}#gemini-build-cancel:active {background:#ccc;}</style>`;
        modalBg.appendChild(modal);
        document.body.appendChild(modalBg);
        const input = modal.querySelector('#gemini-build-input'), close = () => modalBg.remove();
        modal.querySelector('#gemini-build-cancel').onclick = close;
        modal.querySelector('#gemini-build-submit').onclick = () => { const val = input.value.trim(); if (val) { close(); onSubmit(val); } else input.focus(); };
        input.addEventListener('keydown', e => { if (e.key === 'Enter') modal.querySelector('#gemini-build-submit').click(); if (e.key === 'Escape') close(); });
        setTimeout(() => input.focus(), 100);
    }

    // --- UI Buttons ---
    function ensureSuggestBtn(wrapper) {
        let btn = document.getElementById(SUGGEST_BTN_ID);
        if (!btn) {
            btn = document.createElement('button');
            btn.id = SUGGEST_BTN_ID;
            btn.textContent = '🔄';
            btn.title = 'Suggest Next Messages';
            btn.style = 'padding:6px 8px;border-radius:6px;border:1px solid #007bff;background:#d0e6ff;cursor:pointer;';
            btn.onclick = suggestNext;
            wrapper.insertBefore(btn, wrapper.firstChild);
        }
    }
    function ensureBuildBtn(wrapper) {
        let btn = document.getElementById(BUILD_BTN_ID);
        if (!btn) {
            btn = document.createElement('button');
            btn.id = BUILD_BTN_ID;
            btn.textContent = '✏️';
            btn.title = 'Build Message';
            btn.style = 'padding:6px 8px;border-radius:6px;border:1px solid #28a745;background:#eaffea;cursor:pointer;font-weight:bold;margin-right:20px;';
            btn.onclick = () => showBuildModal(async userInstruction => {
                const msgObjs = getLastMsgs(30);
                const prompt = `Given the following WhatsApp conversation, generate a single, human-like, context-aware reply in the same style as previous messages.\n\nConversation:\n${msgObjs.map(m => `${m.sender} [${m.time}]: ${m.text}`).join('\n')}\n\nInstruction: ${userInstruction}\n\nReply: (Return only the reply as a string, no JSON, no explanation)`;
                console.log('[Gemini Build Prompt]', prompt);
                try { const out = await gemini.ask(prompt); writeTextToWhatsApp(out.trim(), false); } catch (e) { alert('Gemini API error: ' + (e.message || e)); console.error('Gemini API error:', e); }
            });
            wrapper.insertBefore(btn, wrapper.firstChild ? wrapper.firstChild.nextSibling : null);
        }
    }
    function renderUI() {
        const footer = document.querySelector(S.footer);
        if (!footer) return;
        let wrapper = document.getElementById(WRAPPER_ID);
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = WRAPPER_ID;
            wrapper.style = 'display:flex;align-items:center;gap:8px;margin:0px 0px 8px 0px;justify-content:center;';
            footer.appendChild(wrapper);
        }
        ensureSuggestBtn(wrapper);
        ensureBuildBtn(wrapper);
    }

    // --- Chat Change Observer ---
    const obs = new MutationObserver(() => setTimeout(renderUI, 500));
    let lastChatId = null;
    function getCurrentChatId() {
        const chatListIDs = document.querySelectorAll('[data-id]');
        var lastDataId = chatListIDs[chatListIDs.length - 1];
        return lastDataId ? lastDataId.getAttribute('data-id') : null;
    }
    function observeChatChange() {
        setInterval(() => {
            const chatId = getCurrentChatId();
            if (chatId && chatId !== lastChatId) {
                lastChatId = chatId;
                const c = document.getElementById('gemini-suggestion-container');
                if (c) c.remove();
                suggestNext();
            }
        }, 1000);
    }

    // --- Main ---
    function main() {
        const app = document.querySelector(S.app);
        if (!app) return setTimeout(main, 1000);
        obs.observe(app, { childList: true, subtree: true });
        renderUI();
        observeChatChange();
    }
    main();
})();