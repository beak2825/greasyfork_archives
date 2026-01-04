// ==UserScript==
// @name         Teams Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      2025-04-23
// @description  Export and clean Microsoft Teams chat transcripts and enhance the UI
// @author       You
// @match        https://teams.microsoft.com/v2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537462/Teams%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/537462/Teams%20Chat%20Exporter.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const KEY_THRESHOLD_MS = 300;
    const BANNER_ID = 'teams-chat-banner';
    let mutationObserver = null;
    let collectedNodes = [];
    let resetTimer = null;
    let pressCount = 0;
    let lastDialogId = 0;

    /** Show a fixed red banner at the bottom **/
    function showBanner() {
        if (document.getElementById(BANNER_ID)) return;
        const banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.textContent = 'Observing – scroll through chat to gather messages. Press Shift Shift Shift to stop gathering';
        Object.assign(banner.style, {
            position: 'fixed', bottom: '0', left: '0', width: '100%',
            background: 'red', color: 'white', textAlign: 'center',
            padding: '8px', fontFamily: 'Arial,sans-serif', zIndex: '9999'
        });
        document.body.appendChild(banner);
    }

    /** Remove the observation banner **/
    function removeBanner() {
        const banner = document.getElementById(BANNER_ID);
        if (banner) banner.remove();
    }

    /** Watch for N rapid key presses **/
    const watchKeyCombo = (keyName, callback) => {
        document.addEventListener('keydown', event => {
            if (!event.key.startsWith(keyName)) return;
            pressCount++;
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => pressCount = 0, KEY_THRESHOLD_MS);
            if (pressCount >= 3) { pressCount = 0; callback(); }
        });
    };

    // Bind triple-Shift and triple-Control
    watchKeyCombo('Shift', () => toggleGathering(true));
    watchKeyCombo('Control', () => toggleGathering(false));

    /** Toggle gathering mode **/
    const toggleGathering = observe => {
        if (mutationObserver) stopGathering(); else startGathering(observe);
    };

    /** Start collecting messages **/
    function startGathering(observeChanges) {
        collectedNodes = [];
        gatherCurrentMessages();
        if (!observeChanges) { stopGathering(); return; }
        showBanner();
        const target = document.getElementById('chat-pane-list');
        if (!target) { console.error('Target #chat-pane-list not found'); return; }
        mutationObserver = new MutationObserver(muts => {
            if (muts.some(m => m.type === 'childList' || m.type === 'characterData'))
                gatherCurrentMessages();
        });
        mutationObserver.observe(target, { childList: true, subtree: true, characterData: true });
        console.log('Started gathering (observe)', observeChanges);
    }

    /** Stop collecting and export transcript **/
    function stopGathering() {
        removeBanner();
        if (mutationObserver) { mutationObserver.disconnect(); mutationObserver = null; }
        console.log('Stopped gathering, total:', collectedNodes.length);
        try {
            const nodes = filterAndSort(collectedNodes);
            const html = buildTranscript(nodes);
            openTranscriptWindow(html);
        } catch (e) {
            console.error('Error exporting transcript', e);
        }
        collectedNodes = [];
    }

    /** Gather current children of chat pane **/
    function gatherCurrentMessages() {
        const list = document.getElementById('chat-pane-list');
        if (list) collectedNodes.push(...Array.from(list.children));
    }

    /** Filter duplicates, remove GIFs, sort by ID **/
    function filterAndSort(nodes) {
        const map = new Map();
        nodes.forEach(n => {
            const msg = n.querySelector('[id^="message-body-"]');
            if (msg && !n.querySelector('[aria-label="Animated GIF"]')) {
                const id = parseInt(msg.id.replace('message-body-', ''), 10);
                if (!map.has(id)) map.set(id, n);
            }
        });
        return Array.from(map.entries())
            .sort((a,b) => a[0]-b[0])
            .map(entry => entry[1]);
    }

    /** Replace <img> emojis using alt/text **/
    function replaceEmojiImages(node) {
        node.querySelectorAll('img[itemtype*="Emoji"]').forEach(img => {
            const span = document.createElement('span');
            span.innerText = img.alt || '';
            img.parentNode.replaceChild(span, img);
        });
    }

 /** Build HTML transcript **/
function buildTranscript(nodes) {
    let lastAuthor = '', lastDate = null;
    return nodes.map(n => {
        replaceEmojiImages(n);
        const authorEl = n.querySelector('[data-tid="message-author-name"]');
        const timeEl = n.querySelector('[id^="timestamp-"]');
        const bodyEl = n.querySelector('[id^="message-body-"] [id^="content-"]');
        if (!authorEl || !timeEl || !bodyEl) return '';
        const author = authorEl.innerText.trim();
        const ts = new Date(timeEl.getAttribute('datetime'));
        const tsStr = ts.toLocaleString().replace(/:([0-9]{2})(?= )/, '');
        const date = tsStr.split(',')[0];
        const newDay = lastDate && ts.getDate() !== lastDate.getDate();
        let header = '';
        if (author !== lastAuthor) header = `<hr/><b>${author}</b> [${tsStr}]:<br/>`;
        else if (newDay) header = `<div style="text-align:center;"><hr/>${date}<hr/></div>`;
        lastAuthor = author; lastDate = ts;

        // Select all divs with aria-label containing "Mention" in bodyEl
        const mentionDivs = bodyEl.querySelectorAll('div[aria-label*="Mention"]');

        // Loop through the NodeList and replace each div with its corresponding span
        mentionDivs.forEach(div => {
            console.log(`Replacing div: `, div); // Debug log for divs being replaced
            const span = document.createElement('span');

            // Copy over necessary attributes from the div to the span
            span.innerHTML = div.innerHTML; // Copy the inner content
            span.className = div.className; // Copy the class names

            // Insert the span into the div's parent and remove the div
            div.parentNode.insertBefore(span, div);
            div.parentNode.removeChild(div);
        });

        // Handle quoted reply replacements
        const quotedReplies = bodyEl.querySelectorAll('div[data-track-module-name="messageQuotedReply"]');
        quotedReplies.forEach(div => {
            const blockquote = document.createElement('blockquote');
            blockquote.innerHTML = div.innerHTML; // Copy the inner content
            blockquote.className = div.className; // Copy the class names
            div.parentNode.insertBefore(blockquote, div);
            div.parentNode.removeChild(div);
        });


        console.log(`Body HTML after replacement is: `, bodyEl.innerHTML); // Debug log for updated body HTML

        // Generate the updated body HTML
        const updatedBodyHtml = bodyEl.innerHTML;

        return `<div class="message">${header}<section>${updatedBodyHtml}</section></div>`;
    }).join('');
}

    /** Open transcript in new window **/
    function openTranscriptWindow(content) {
        lastDialogId++;
        const dialog = document.createElement('dialog');
        dialog.style.width = '80vw';
        dialog.style.height = '80vh';
        dialog.style.overflow = 'auto';
        dialog.style.padding = '20px';

        // Create content for the dialog
        const dialogContent = `
  <style>
    #transcript {
      font-family: Arial, sans-serif;
      margin: 2em;
    }
    section {
      padding-left: 1em;
      border-left: 1px solid #ccc;
    }
    hr {
      border: none;
      border-top: 1px solid #ccc;
      margin: 1em 0;
    }
    .closeDialog {position: absolute; top:-50px; left:50%; transform:translateX(-50%);}

div[aria-label*="Mention"] {
  display: inline;
  font-weight: bold;
}
  </style>
  <div id='transcript'>
  ${content}
  <button class='closeDialog' id="closeDialog-${lastDialogId}">Close</button>
  </div>
    `;

        // Set the inner HTML of the dialog
        dialog.innerHTML = dialogContent;

        // Append dialog to the body
        document.body.appendChild(dialog);

        // Open the dialog
        dialog.showModal();

        // Add an event listener to the close button
        document.getElementById(`closeDialog-${lastDialogId}`).addEventListener('click', () => {
            dialog.close();
        });
    }

    /** Live-page formatting: wrap galleries, emojis, code blocks **/
    function formatMessages() {
        const sections = document.querySelectorAll('.message section');
        sections.forEach(section => {
            // link gallery images
            section.querySelectorAll('img[data-gallery-src]').forEach(img => {
                const link = document.createElement('a');
                link.href = img.getAttribute('data-gallery-src'); link.target = '_blank';
                img.replaceWith(link); link.appendChild(img);
            });
            // convert emojis
            section.querySelectorAll('img[alt]').forEach(img => {
                const alt = img.alt.trim();
                if (/^(?:\p{Emoji}|[\u203C-\u3299\uD83C\uD000-\uD83F\uDC00-\uDFFF])+/u.test(alt)) {
                    const span = document.createElement('span'); span.innerText = alt;
                    img.replaceWith(span);
                }
            });
            // structure first span
            const firstSpan = section.querySelector('div > div > div div:first-child span:first-child');
            if (firstSpan) {
                const strong = document.createElement('strong'); strong.textContent = firstSpan.textContent;
                firstSpan.textContent = ''; firstSpan.appendChild(strong);
            }
            // add nbsp and breaks
            section.querySelectorAll('div > div > div div:first-child span').forEach(span => span.innerHTML += '&nbsp;&nbsp;');
            const firstDiv = section.querySelector('div > div > div div:first-child');
            if (firstDiv) firstDiv.innerHTML += '<br><br>';
            // replace parent div with blockquote
            const parentDiv = section.querySelector('div > div > div');
            if (parentDiv) {
                const bq = document.createElement('blockquote');
                while (parentDiv.firstChild) bq.appendChild(parentDiv.firstChild);
                parentDiv.replaceWith(bq);
            }
        });
    }
    formatMessages();

    /** Convert all page images to base64 **/
    async function replaceImagesWithBase64() {
        const imgs = document.querySelectorAll('img');
        for (const img of imgs) {
            try {
                const res = await fetch(img.src);
                const blob = await res.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    const newImg = document.createElement('img');
                    newImg.src = reader.result; newImg.alt = img.alt;
                    img.replaceWith(newImg);
                };
                reader.readAsDataURL(blob);
            } catch (e) {
                console.error('Image base64 error', e);
            }
        }
    }
    replaceImagesWithBase64();
})();
