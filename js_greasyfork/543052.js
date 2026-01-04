// ==UserScript==
// @name         Battle Cats Wiki - Strategy Summarizer
// @namespace    https://battlecats.miraheze.org/
// @version      1.0
// @description  Summarizes strategy sections using AI and shows cat recommendations
// @author       ProfessionalScriptKiddie
// @license      MIT
// @match        https://battlecats.miraheze.org/wiki/*
// @icon         https://files.catbox.moe/7srjk6.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543052/Battle%20Cats%20Wiki%20-%20Strategy%20Summarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/543052/Battle%20Cats%20Wiki%20-%20Strategy%20Summarizer.meta.js
// ==/UserScript==

function waitForStrategySection(callback) {
    const check = () => {
        const el = document.querySelector('.citizen-section#citizen-section-2');
        if (el) {
            callback();
            return true;
        }
        return false;
    };

    if (check()) return;

    const observer = new MutationObserver(() => {
        if (check()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        if (!check()) observer.disconnect();
    }, 5000);
}

function renderMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^[•\-\*] (.*?)$/gm, '<li style="margin: 4px 0; color: #fff; list-style-type: none; position: relative; padding-left: 20px;">$1</li>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*?)$/gm, '<h3 style="color: #4a9eff; margin: 12px 0 8px 0; font-size: 16px;">$1</h3>')
        .replace(/^## (.*?)$/gm, '<h2 style="color: #4a9eff; margin: 16px 0 12px 0; font-size: 18px;">$1</h2>')
        .replace(/^# (.*?)$/gm, '<h1 style="color: #4a9eff; margin: 20px 0 16px 0; font-size: 20px;">$1</h1>')
        .replace(/(<li.*?<\/li>(?:\s*<li.*?<\/li>)*)/gs, '<ul style="margin: 8px 0; padding-left: 0; list-style: none;">$1</ul>')
        .replace(/^\d+\. (.*?)$/gm, '<li style="margin: 4px 0; color: #fff;">$1</li>')
        .replace(/(<li.*?<\/li>(?:\s*<li.*?<\/li>)*)/gs, '<ol style="margin: 8px 0; padding-left: 20px;">$1</ol>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/<li style="margin: 4px 0; color: #fff; list-style-type: none; position: relative; padding-left: 20px;">/g, 
                '<li style="margin: 4px 0; color: #fff; list-style-type: none; position: relative; padding-left: 20px;">' +
                '<span style="position: absolute; left: 0; color: #4a9eff; font-weight: bold;">•</span>');
}

async function summarizeWithGemini(text, apiKey) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Please summarize this Battle Cats strategy guide. Focus on:
1. What cats/units to bring (be specific about names)
2. Key tactics and timing
3. Important warnings or things to avoid
4. Overall difficulty level

Keep it concise but actionable. Use bullet points for clarity.

Strategy text:
${text}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500
                }
            }),
            onload: function(response) {
                try {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                            resolve(data.candidates[0].content.parts[0].text);
                        } else {
                            reject(new Error('Invalid response format from Gemini API'));
                        }
                    } else {
                        const error = JSON.parse(response.responseText);
                        reject(new Error(error.error?.message || `API Error: ${response.status}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${e.message}`));
                }
            },
            onerror: function(error) {
                reject(new Error(`Request failed: ${error.error || 'Network error'}`));
            },
            ontimeout: function() {
                reject(new Error('Request timed out'));
            },
            timeout: 30000
        });
    });
}

function createApiKeyModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: #2a2a2a;
        padding: 24px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        color: #fff;
        border: 2px solid #555;
    `;

    content.innerHTML = `
        <h2 style="margin: 0 0 16px 0; color: #fff;">🤖 Setup AI Strategy Summarizer</h2>
        <p style="margin-bottom: 16px; color: #ccc; line-height: 1.5;">
            To get AI-powered strategy summaries, you'll need a free Google Gemini API key:
        </p>
        <ol style="color: #ccc; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #4a9eff;">aistudio.google.com/app/apikey</a></li>
            <li>Sign in with your Google account</li>
            <li>Click "Create API Key" (free tier included)</li>
            <li>Copy the key and paste it below</li>
        </ol>
        <p style="margin-bottom: 12px; color: #ffeb3b; font-size: 14px;">
            ⚠️ Your API key is stored locally and only used for Gemini requests
        </p>
        <input type="password" id="api-key-input" placeholder="AIza..." style="
            width: 100%;
            padding: 12px;
            margin-bottom: 16px;
            background: #333;
            border: 1px solid #555;
            border-radius: 6px;
            color: #fff;
            font-family: monospace;
            box-sizing: border-box;
        ">
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="cancel-btn" style="
                padding: 8px 16px;
                background: #555;
                border: none;
                border-radius: 6px;
                color: #fff;
                cursor: pointer;
                transition: background 0.2s;
            ">Skip (use basic mode)</button>
            <button id="save-btn" style="
                padding: 8px 16px;
                background: #4a9eff;
                border: none;
                border-radius: 6px;
                color: #fff;
                cursor: pointer;
                transition: background 0.2s;
            ">Save & Continue</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    return new Promise((resolve) => {
        const input = content.querySelector('#api-key-input');
        const saveBtn = content.querySelector('#save-btn');
        const cancelBtn = content.querySelector('#cancel-btn');

        saveBtn.addEventListener('mouseenter', () => saveBtn.style.background = '#357abd');
        saveBtn.addEventListener('mouseleave', () => saveBtn.style.background = '#4a9eff');
        cancelBtn.addEventListener('mouseenter', () => cancelBtn.style.background = '#666');
        cancelBtn.addEventListener('mouseleave', () => cancelBtn.style.background = '#555');

        saveBtn.addEventListener('click', () => {
            const key = input.value.trim();
            if (key && key.startsWith('AIza')) {
                GM_setValue('gemini_api_key', key);
                modal.remove();
                resolve(key);
            } else {
                input.style.borderColor = '#ff4444';
                input.placeholder = 'Please enter a valid Gemini API key (starts with AIza)';
            }
        });

        cancelBtn.addEventListener('click', () => {
            modal.remove();
            resolve(null);
        });

        input.addEventListener('input', () => {
            input.style.borderColor = '#555';
        });
    });
}

waitForStrategySection(async () => {
    const strategySection = document.querySelector('.citizen-section#citizen-section-2');
    if (!strategySection) return;

    let apiKey = GM_getValue('gemini_api_key', '');
    
    if (!apiKey) {
        apiKey = await createApiKeyModal();
    }

    const strategyText = strategySection.innerText.trim();
    
    const hasStrategyContent = strategyText.length > 50;
    
    const catLinks = Array.from(strategySection.querySelectorAll('a'))
        .filter(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            return (href && href.includes('Cat')) || text.endsWith('Cat');
        })
        .map(link => ({
            text: link.textContent.trim(),
            href: link.href
        }))
        .filter((link, index, self) => 
            index === self.findIndex(l => l.text === link.text)
        );

    const popup = document.createElement('div');
    popup.id = 'strategy-popup';
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        min-width: 300px;
        max-height: 500px;
        min-height: 200px;
        background: #2a2a2a;
        border: 2px solid #555;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
        transition: opacity 0.3s ease;
        resize: both;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        background: #444;
        padding: 12px 16px;
        border-bottom: 1px solid #555;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    const title = document.createElement('h3');
    title.innerHTML = apiKey ? '🤖 AI Strategy Summary' : '🐱 What to bring?';
    title.style.cssText = `
        margin: 0;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
    `;

    const headerButtons = document.createElement('div');
    headerButtons.style.cssText = 'display: flex; gap: 8px; align-items: center;';

    const settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'Change API Key';
    settingsBtn.style.cssText = `
        background: none; border: none; color: #ccc; font-size: 16px; cursor: pointer;
        padding: 4px; border-radius: 4px; transition: background 0.2s;
    `;
    settingsBtn.addEventListener('click', async () => {
        const newKey = await createApiKeyModal();
        if (newKey !== null) {
            location.reload();
        }
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        background: none; border: none; color: #ccc; font-size: 20px; cursor: pointer;
        padding: 0; width: 24px; height: 24px; display: flex; align-items: center;
        justify-content: center; border-radius: 50%; transition: background 0.2s, color 0.2s;
    `;

    [settingsBtn, closeBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#555';
            btn.style.color = '#fff';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'none';
            btn.style.color = '#ccc';
        });
    });

    closeBtn.addEventListener('click', () => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 300);
    });

    headerButtons.appendChild(settingsBtn);
    headerButtons.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(headerButtons);

    const content = document.createElement('div');
    content.style.cssText = `
        max-height: calc(100% - 50px);
        overflow-y: auto;
        padding: 16px;
        color: #fff;
        line-height: 1.5;
    `;

    if (apiKey && hasStrategyContent && strategyText) {
        content.innerHTML = '<div style="text-align: center; padding: 20px; color: #ccc;">🤖 Generating AI summary...</div>';
        
        try {
            const summary = await summarizeWithGemini(strategyText, apiKey);
            const renderedSummary = renderMarkdown(summary);
            content.innerHTML = `<div>${renderedSummary}</div>`;
            
            if (catLinks.length > 0) {
                const linksSection = document.createElement('div');
                linksSection.style.cssText = 'margin-top: 20px; padding-top: 16px; border-top: 1px solid #555;';
                linksSection.innerHTML = '<h4 style="margin: 0 0 8px 0; color: #4a9eff;">🔗 Quick Cat Links:</h4>';
                
                catLinks.forEach(catLink => {
                    const linkElement = document.createElement('a');
                    linkElement.href = catLink.href;
                    linkElement.textContent = catLink.text;
                    linkElement.style.cssText = `
                        display: inline-block; margin: 4px 8px 4px 0; padding: 4px 8px;
                        background: #333; color: #fff; text-decoration: none; border-radius: 4px;
                        font-size: 12px; border: 1px solid #555; transition: all 0.2s ease;
                    `;
                    linkElement.addEventListener('mouseenter', () => {
                        linkElement.style.background = '#444';
                        linkElement.style.borderColor = '#666';
                    });
                    linkElement.addEventListener('mouseleave', () => {
                        linkElement.style.background = '#333';
                        linkElement.style.borderColor = '#555';
                    });
                    linksSection.appendChild(linkElement);
                });
                content.appendChild(linksSection);
            }
        } catch (error) {
            content.innerHTML = `
                <div style="color: #ff6b6b; margin-bottom: 12px;">❌ AI Summary failed: ${error.message}</div>
                <div style="color: #ccc; margin-bottom: 16px;">Falling back to basic mode...</div>
            `;
            
            if (catLinks.length > 0) {
                catLinks.forEach(catLink => {
                    const linkElement = document.createElement('a');
                    linkElement.href = catLink.href;
                    linkElement.textContent = catLink.text;
                    linkElement.style.cssText = `
                        display: block; padding: 8px 12px; margin: 4px 0; background: #333;
                        color: #fff; text-decoration: none; border-radius: 4px; border: 1px solid #555;
                        transition: all 0.2s ease; font-size: 14px;
                    `;
                    linkElement.addEventListener('mouseenter', () => {
                        linkElement.style.background = '#444';
                        linkElement.style.transform = 'translateX(2px)';
                    });
                    linkElement.addEventListener('mouseleave', () => {
                        linkElement.style.background = '#333';
                        linkElement.style.transform = 'translateX(0)';
                    });
                    content.appendChild(linkElement);
                });
            } else {
                content.innerHTML += '<div style="color: #999; text-align: center; padding: 20px; font-style: italic;">📝 There is no strategy guide for this page yet.</div>';
            }
        }
    } else {
        if (catLinks.length > 0) {
            catLinks.forEach(catLink => {
                const linkElement = document.createElement('a');
                linkElement.href = catLink.href;
                linkElement.textContent = catLink.text;
                linkElement.style.cssText = `
                    display: block; padding: 8px 12px; margin: 4px 0; background: #333;
                    color: #fff; text-decoration: none; border-radius: 4px; border: 1px solid #555;
                    transition: all 0.2s ease; font-size: 14px;
                `;
                linkElement.addEventListener('mouseenter', () => {
                    linkElement.style.background = '#444';
                    linkElement.style.transform = 'translateX(2px)';
                });
                linkElement.addEventListener('mouseleave', () => {
                    linkElement.style.background = '#333';
                    linkElement.style.transform = 'translateX(0)';
                });
                content.appendChild(linkElement);
            });
        } else {
            content.innerHTML = '<div style="color: #999; text-align: center; padding: 20px; font-style: italic;">📝 There is no strategy guide for this page yet.</div>';
        }
    }

    popup.appendChild(header);
    popup.appendChild(content);
    document.body.appendChild(popup);

    popup.style.opacity = '0';
    setTimeout(() => popup.style.opacity = '1', 100);

    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    header.addEventListener('mousedown', (e) => {
        if (e.target === settingsBtn || e.target === closeBtn) return;
        isDragging = true;
        dragOffset.x = e.clientX - popup.offsetLeft;
        dragOffset.y = e.clientY - popup.offsetTop;
        header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            popup.style.left = (e.clientX - dragOffset.x) + 'px';
            popup.style.top = (e.clientY - dragOffset.y) + 'px';
            popup.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'grab';
    });

    header.style.cursor = 'grab';
});