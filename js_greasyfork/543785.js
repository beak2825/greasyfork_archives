// ==UserScript==
// @name         Slowly Export
// @namespace    Violentmonkey Scripts
// @version      1.0
// @license      GPLv3
// @author       HUM4N_F1L3.json
// @description  Saves letters as MD files. Scroll to the first letter. An export works from the opened letter to the most recent one.
// @match        https://web.slowly.app/friend/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slowly.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543785/Slowly%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/543785/Slowly%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WAIT_AFTER_CLICK = 1200;
    const WAIT_AFTER_LOAD = 800;

    let isExporting = false;
    let lastLetterId = '';
    let letters = [];
    let user1 = null;
    let user2 = null;

    // Check if we are on a specific letter page (not the conversation list)
    function isLetterPage() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        return pathParts.length === 3 && pathParts[0] === 'friend';
    }

    // Extract all relevant data from the current letter, including attachments, stamp, avatar
    function getLetterData() {
        const footer = document.querySelector('.modal-footer .media-body');
        let sender = '', date = '', geo = '', avatarUrl = '', avatarAlt = '', avatarFilename = '';
        if (footer) {
            sender = footer.querySelector('h5')?.innerText.trim() || '';
            const p = footer.querySelector('p');
            if (p) {
                const parts = p.innerHTML.split('<br>');
                if (parts.length > 0) date = parts[0].replace(/<[^>]+>/g, '').trim();
                if (parts.length > 1) geo = parts[1].replace(/<[^>]+>/g, '').trim();
            }
            // Avatar
            const avatarImg = footer.parentElement.querySelector('img.avatar-border, img.rounded-circle');
            if (avatarImg) {
                avatarUrl = avatarImg.src;
                avatarAlt = avatarImg.alt || '';
                avatarFilename = avatarUrl.split('/').pop().split('?')[0];
                if (!avatarFilename) avatarFilename = 'avatar_' + Math.random().toString(36).slice(2) + '.png';
            }
        }
        let letterText = '';
        const textNode = document.querySelector('.modal-body .pre-wrap.mb-3');
        if (textNode) letterText = textNode.innerText.trim();
        let stampUrl = '', stampAlt = '', stampFilename = '';
        const stampImg = document.querySelector('img.stamp');
        if (stampImg) {
            stampUrl = stampImg.src;
            stampAlt = stampImg.alt || '';
            stampFilename = stampUrl.split('/').pop().split('?')[0];
            if (!stampFilename) stampFilename = 'stamp_' + Math.random().toString(36).slice(2) + '.png';
        }
        // Collect all image attachments
        const attachments = [];
        document.querySelectorAll('.slider img').forEach(img => {
            const url = img.src;
            let filename = url.split('/').pop().split('?')[0];
            if (!filename) filename = 'attachment_' + Math.random().toString(36).slice(2) + '.jpg';
            attachments.push({
                url,
                alt: img.alt || '',
                filename
            });
        });
        return { sender, date, geo, letterText, stampUrl, stampAlt, stampFilename, attachments, avatarUrl, avatarAlt, avatarFilename };
    }

    // Generate a unique ID for the current letter (used to detect page changes)
    function getCurrentLetterId() {
        const data = getLetterData();
        return (data.date || '') + '|' + (data.letterText || '');
    }

    // Generate the Markdown content for a letter, with avatar left, stamp right, attachments at the bottom
    function makeMarkdown({ sender, date, geo, letterText, stampFilename, stampAlt, attachments, avatarFilename, avatarAlt }) {
        // Avatar left (only local)
        let avatarBlock = '';
        if (avatarFilename) {
            avatarBlock = `<img src="images/avatars/${avatarFilename}" alt="${avatarAlt || ''}" width="60" height="60" style="margin-right:20px;flex-shrink:0;border-radius:50%;margin-top: 25px;">`;
        }
        // Stamp right (only local)
        let stampBlock = '';
        if (stampFilename) {
            stampBlock = `<img src="images/stamps/${stampFilename}" alt="${stampAlt || ''}" width="100" height="100" style="margin-left:20px;flex-shrink:0;">`;
        }
        // Header flex block
        let headerBlock;
        if (avatarBlock || stampBlock) {
            headerBlock = `<div style="display:flex;align-items:flex-start;justify-content:space-between;">
  <div style="display:flex;align-items:flex-start;">
    ${avatarBlock}
    <div>
      <h1 style="margin-bottom:0;">Letter from ${sender || 'Unknown'}</h1>
      <div><strong>Date:</strong> ${date || 'Unknown'}</div>
      <div><strong>Location:</strong> ${geo || 'Unknown'}</div>
    </div>
  </div>
  ${stampBlock}
</div>`;
        } else {
            headerBlock = `# Letter from ${sender || 'Unknown'}
**Date:** ${date || 'Unknown'}
**Location:** ${geo || 'Unknown'}`;
        }

        // Attachments block at the bottom
        let attachmentsBlock = '';
        if (attachments && attachments.length) {
            attachmentsBlock = '\n\n---\n\n**Attachments:**\n\n' +
                attachments.map(att =>
                    `<img src="images/attachments/${att.filename}" alt="${att.alt}" style="max-width:400px;max-height:400px;">`
                ).join('\n') + '\n';
        }

        return (
`${headerBlock}


${letterText || ''}${attachmentsBlock}`
        );
    }

    // Click the "next letter" button (chevron-left icon)
    function clickNextLetterButton() {
        const nextBtn = Array.from(document.querySelectorAll('a.no-underline.link'))
            .find(a => a.querySelector('i.icon-chevron-left'));
        if (nextBtn) {
            nextBtn.click();
            return true;
        }
        return false;
    }

    // Wait for the next letter to load (by checking for a change in letter ID)
    function waitForNextLetter() {
        return new Promise(resolve => {
            const prevId = lastLetterId;
            const check = () => {
                const newId = getCurrentLetterId();
                if (newId && newId !== prevId) {
                    resolve();
                } else {
                    setTimeout(check, 300);
                }
            };
            setTimeout(check, WAIT_AFTER_CLICK);
        });
    }

    // Main export loop: save current letter, go to next, repeat, then save ZIP
    async function exportAndNext() {
        if (isExporting) return;
        isExporting = true;

        const data = getLetterData();
        if (!data.letterText) {
            alert('Could not find letter text! Stopped.');
            isExporting = false;
            return;
        }

        // Determine user1 and user2
        if (!user1) user1 = data.sender;
        if (!user2 && data.sender !== user1) user2 = data.sender;

        // Save both content and all images for this letter
        letters.push({
            content: makeMarkdown(data),
            attachments: data.attachments,
            stampUrl: data.stampUrl,
            stampFilename: data.stampFilename,
            avatarUrl: data.avatarUrl,
            avatarFilename: data.avatarFilename
        });

        lastLetterId = getCurrentLetterId();

        if (clickNextLetterButton()) {
            await waitForNextLetter();
            setTimeout(() => {
                isExporting = false;
                exportAndNext();
            }, WAIT_AFTER_LOAD);
        } else {
            // All letters exported, create ZIP
            saveZip();
            isExporting = false;
        }
    }

    // Create and download the ZIP archive with all letters, attachments, stamps, avatars
    async function saveZip() {
        const zip = new JSZip();
        // Add all images to images/attachments, images/stamps, images/avatars
        const imagesFolder = zip.folder('images');
        const attachmentsFolder = imagesFolder.folder('attachments');
        const stampsFolder = imagesFolder.folder('stamps');
        const avatarsFolder = imagesFolder.folder('avatars');
        // Collect all unique images
        const allAttachments = [];
        const allStamps = [];
        const allAvatars = [];
        letters.forEach(letter => {
            if (letter.attachments) {
                letter.attachments.forEach(att => {
                    if (!allAttachments.find(a => a.url === att.url)) {
                        allAttachments.push(att);
                    }
                });
            }
            if (letter.stampUrl && letter.stampFilename) {
                if (!allStamps.find(s => s.url === letter.stampUrl)) {
                    allStamps.push({ url: letter.stampUrl, filename: letter.stampFilename });
                }
            }
            if (letter.avatarUrl && letter.avatarFilename) {
                if (!allAvatars.find(a => a.url === letter.avatarUrl)) {
                    allAvatars.push({ url: letter.avatarUrl, filename: letter.avatarFilename });
                }
            }
        });

        // Download and add each attachment
        for (const att of allAttachments) {
            try {
                const response = await fetch(att.url);
                const blob = await response.blob();
                await attachmentsFolder.file(att.filename, blob);
            } catch (e) {
                console.error('Failed to fetch attachment:', att.url, e);
            }
        }

        // Download and add each stamp
        for (const s of allStamps) {
            try {
                const response = await fetch(s.url);
                const blob = await response.blob();
                await stampsFolder.file(s.filename, blob);
            } catch (e) {
                console.error('Failed to fetch stamp:', s.url, e);
            }
        }

        // Download and add each avatar
        for (const a of allAvatars) {
            try {
                const response = await fetch(a.url);
                const blob = await response.blob();
                await avatarsFolder.file(a.filename, blob);
            } catch (e) {
                console.error('Failed to fetch avatar:', a.url, e);
            }
        }

        // Add letters
        letters.forEach((letter, i) => {
            zip.file(`${i + 1}.md`, letter.content);
        });

        // Archive name
        let name1 = user1 || 'User1';
        let name2 = user2 || 'User2';
        name1 = name1.replace(/[\\/:*?"<>|]/g, '_');
        name2 = name2.replace(/[\\/:*?"<>|]/g, '_');
        const zipName = `${name1}_and_${name2}'s_Correspondence.zip`;

        zip.generateAsync({ type: "blob" }).then(function(content) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = zipName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
            }, 100);
        });
    }

    // Add or remove the export button depending on the current page
    function addOrRemoveButton() {
        const btnId = 'slowly-md-export-all-btn';
        const oldBtn = document.getElementById(btnId);
        if (isLetterPage()) {
            if (!oldBtn) {
                const btn = document.createElement('button');
                btn.id = btnId;
                const icon = document.createElement('i');
                icon.className = 'icon-download';
                icon.style.marginRight = '10px';
                btn.appendChild(icon);
                btn.appendChild(document.createTextNode('Export'));
                btn.style.position = 'fixed';
                btn.style.top = '150px';
                btn.style.right = '30px';
                btn.style.zIndex = 1019;
                btn.style.borderRadius = '999px';
                btn.style.paddingLeft = '30px';
                btn.style.paddingRight = '30px';
                btn.style.fontSize = '18px';
                btn.style.boxShadow = '0 1rem 3rem rgba(0, 0, 0, .175)';
                btn.style.padding = '.5rem 1rem';
                btn.style.backgroundColor = '#ffc300';
                btn.style.borderColor = '#ffc300';
                btn.style.color = '#212529';
                btn.style.border = '1px solid #ffc300';
                btn.style.transition = 'color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out';
                btn.style.cursor = 'pointer';
                btn.onclick = () => {
                    isExporting = false;
                    lastLetterId = '';
                    letters = [];
                    user1 = null;
                    user2 = null;
                    exportAndNext();
                };
                document.body.appendChild(btn);
            }
        } else {
            if (oldBtn) oldBtn.remove();
        }
    }

    // Initial check on page load
    setTimeout(addOrRemoveButton, 1000);

    // Watch for DOM changes (SPA navigation)
    const observer = new MutationObserver(() => {
        addOrRemoveButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also check for URL changes (as a fallback)
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            addOrRemoveButton();
        }
    }, 500);
})();