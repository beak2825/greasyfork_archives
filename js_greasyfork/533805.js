// ==UserScript==
// @name         staging notes v1
// @namespace    http://tampermonkey.net/
// @version      1
// @description  暂存便签
// @author       yeeel
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533805/staging%20notes%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/533805/staging%20notes%20v1.meta.js
// ==/UserScript==

(function() {
'use strict';

// --- CSS with Container/Icon Box-Shadow Removed ---
GM_addStyle(`
    /* --- Base Wrapper --- */
    .goodnote-wrapper {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 2000; /* Low z-index */
    }

    /* --- Note Icon --- */
    .note-icon {
        display: flex; align-items: center; justify-content: center;
        position: fixed; z-index: 2002; /* Low z-index */
        pointer-events: auto; width: 24px; height: 24px; cursor: move;
        user-select: none; border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(200, 200, 200, 0.8);
        /* box-shadow: 0 2px 8px rgba(0,0,0,0.25); */ /* <-- REMOVED */
        opacity: 0.9;
        backdrop-filter: blur(10px);
        transition: transform 0.15s ease, background-color 0.2s ease, opacity 0.2s ease;
        transform: translate3d(0, 0, 0); will-change: transform;
    }
    .note-icon svg { width: 18px; height: 18px; fill: #333; }
    .note-icon:hover { opacity: 1; background-color: rgba(255, 255, 255, 0.9); transform: scale(1.1); }
    .note-icon:active { cursor: grabbing; transform: scale(0.95); }

    /* --- Note Container --- */
    .note-container {
        display: none; position: fixed; z-index: 2001; /* Low z-index */
        pointer-events: auto; color: #333; min-width: 380px; padding: 12px;
        border-radius: 8px; background: rgba(255, 255, 255, 0.95);
        border: 1px solid #bbb;
        /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); */ /* <-- REMOVED */
        backdrop-filter: blur(12px);
        /* NO Animation properties */
    }
    .note-container.active {
        /* Only display:block handled by JS */
    }

    /* --- Note Header --- */
    .note-header { display: flex; align-items: center; justify-content: flex-start; margin-bottom: 10px; gap: 10px; user-select: none; padding-left: 2px; }

    /* --- Action Buttons --- */
    .note-action-button, .pin-button { cursor: pointer; font-size: 20px; color: #555; padding: 3px; user-select: none; line-height: 1; transition: color 0.2s, transform 0.2s ease; }
    .note-action-button:hover, .pin-button:hover { color: #007aff; transform: scale(1.15); }
    .note-action-button:active, .pin-button:active { transform: scale(0.9); }
    .note-container.pinned .pin-button { color: #ff3b30; }
    .note-container.pinned .pin-button:hover { color: #ff6b6b; }

    /* --- Text Area --- */
    .note-textarea { display: block; margin-bottom: 0 !important; background: #ffffff; color:#1c1c1e; min-height: 250px; min-width: 350px; height: 280px; width: 100%; border: 1px solid #d1d1d6; border-radius: 6px; padding: 12px; font-size: 15px; resize: both; overflow: auto; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; word-break: break-word; text-align: left; outline: none; box-sizing: border-box; -webkit-overflow-scrolling: touch; }
    .note-textarea:focus { outline: none; border-color: #007aff; box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2); } /* Keep textarea focus shadow */
    .note-textarea a, .note-textarea a:visited { color: #007aff; text-decoration: underline; cursor: pointer; }
    .note-textarea a:hover { opacity: 0.7; }

    /* --- Selection Popup --- */
    #goodnote-selection-popup { position: absolute; background-color: #007aff; color: white; border: none; border-radius: 5px; padding: 5px 10px; font-size: 13px; cursor: pointer; z-index: 2003; box-shadow: 0 2px 5px rgba(0,0,0,0.2); opacity: 0; transform: translateY(5px); pointer-events: none; white-space: nowrap; transition: opacity 0.2s ease, transform 0.2s ease; display: none; /* Start hidden, JS will set display:block */ }
    #goodnote-selection-popup.visible { opacity: 1; transform: translateY(0); pointer-events: auto; display: block !important; } /* Use class again, JS sets this */


    /* --- Flash Message --- */
    #goodnote-message { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); padding: 10px 18px; border-radius: 6px; color: white; font-size: 14px; z-index: 2003; opacity: 0; transition: opacity 0.4s ease; pointer-events: none; text-align: center; background-color: rgba(40, 167, 69, 0.85); box-shadow: 0 3px 10px rgba(0,0,0,0.2); }
    #goodnote-message.error { background-color: rgba(220, 53, 69, 0.85); }
    #goodnote-message.visible { opacity: 1; }
`);

// --- Full JavaScript Code Below (Reverted Popup JS to use .visible class) ---
// PASTE THE FULL JS CODE HERE (from Final v3/v4, make sure popup logic uses .visible class again)
// ...

// --- DOM元素创建 (Create DOM Elements) ---
const wrapper = document.createElement('div');
wrapper.className = 'goodnote-wrapper';
if (document.body) { document.body.appendChild(wrapper); } else { document.addEventListener('DOMContentLoaded', () => document.body.appendChild(wrapper)); }
const noteIcon = document.createElement('div');
noteIcon.className = 'note-icon';
noteIcon.title = '打开/关闭笔记 (Ctrl+Shift+M)';
noteIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,10H19.5L14,4.5V10M5,3H15L21,9V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3M5,12V14H19V12H5M5,16V18H14V16H5Z"/></svg>`;
wrapper.appendChild(noteIcon);
const noteContainer = document.createElement('div');
noteContainer.className = 'note-container';
wrapper.appendChild(noteContainer);
const header = document.createElement('div');
header.className = 'note-header';
noteContainer.appendChild(header);
const pinButton = document.createElement('span');
pinButton.className = 'pin-button'; pinButton.textContent = '📌'; pinButton.title = '置顶/取消置顶笔记';
header.appendChild(pinButton);
const cutButton = document.createElement('span');
cutButton.className = 'note-action-button cut-button'; cutButton.textContent = '✂️'; cutButton.title = '剪切全部笔记内容 (Ctrl+Alt+P)';
header.appendChild(cutButton);
const copyButton = document.createElement('span');
copyButton.className = 'note-action-button copy-button'; copyButton.textContent = '📄'; copyButton.title = '复制全部笔记内容';
header.appendChild(copyButton);
const textarea = document.createElement('div');
textarea.className = 'note-textarea'; textarea.contentEditable = true; textarea.spellcheck = false;
textarea.setAttribute('placeholder', '在这里输入你的笔记...');
noteContainer.appendChild(textarea);
let selectionPopup = null;

// --- 存储键 (Storage Keys) ---
const storageKey = "goodnote_global_note_v3_final_v6"; // Use a new key
const positionKey = "goodnote_global_position_v3_final_v6";

// --- 核心功能函数 (Core Functions) ---
function linkify(text) { const urlRegex = /(https?:\/\/[^\s<>"'`]+)/g; return text.replace(urlRegex, (url) => { if (url.includes('</a>')) return url; return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="note-link">${url}</a>`; }); }
function saveNote() { const content = textarea.innerHTML; GM_setValue(storageKey, content); }
function loadNote() { const savedNote = GM_getValue(storageKey, ''); if (textarea.innerHTML !== savedNote) textarea.innerHTML = savedNote; }
function convertHtmlToPlainTextWithNewlines(html) { const tempDiv = document.createElement('div'); let processedHtml = html.replace(/<br\s*\/?>/gi, '\n'); tempDiv.innerHTML = processedHtml; let plainText = tempDiv.textContent || tempDiv.innerText || ""; return plainText.trim(); }

// --- 事件监听 (Event Listeners) ---
let saveTimeout; const SAVE_DELAY = 150;
textarea.addEventListener('input', () => { clearTimeout(saveTimeout); saveTimeout = setTimeout(saveNote, SAVE_DELAY); });
textarea.addEventListener('paste', (e) => { e.preventDefault(); const text = e.clipboardData.getData('text/plain'); if (!text) return; const textWithBreaks = text.replace(/\r\n|\n/g, '<br>'); const linkedText = linkify(textWithBreaks); document.execCommand('insertHTML', false, linkedText); textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); });
textarea.addEventListener('click', (e) => { if (e.target.tagName === 'A' && e.target.classList.contains('note-link')) { e.preventDefault(); window.open(e.target.href, '_blank', 'noopener,noreferrer'); } });

// --- Selection Handling (Using .visible class again) ---
function removeSelectionPopup() {
    if (selectionPopup && selectionPopup.parentNode) {
        selectionPopup.classList.remove('visible');
        // Allow animation to finish before removing
        setTimeout(() => {
            if (selectionPopup && selectionPopup.parentNode) {
                selectionPopup.parentNode.removeChild(selectionPopup);
            }
            selectionPopup = null;
        }, 250); // Match CSS transition duration
    }
     // Ensure variable is nulled even if removal is delayed
     if(selectionPopup && !selectionPopup.classList.contains('visible')) {
         selectionPopup = null;
     }
}
document.addEventListener('mouseup', (e) => {
    // console.log("Mouse Up Detected"); // Keep debug logs if needed
    if (noteContainer.contains(e.target) || noteIcon.contains(e.target) || (selectionPopup && selectionPopup.contains(e.target))) {
        // console.log("Mouse Up ignored (inside component)");
        return;
    }
    setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
            // console.log("No selection or collapsed, removing popup");
            removeSelectionPopup();
            return;
        }
        const selectedText = selection.toString().trim();
        // console.log("Selected Text:", selectedText);
        removeSelectionPopup(); // Remove any existing first

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            if (textarea.contains(range.commonAncestorContainer)) {
                 // console.log("Selection inside textarea, ignored");
                 return;
            }
            const rect = range.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0 && selectedText.length < 5) {
                // console.log("Selection too small or invisible, ignored");
                return;
            }

            // console.log("Creating Selection Popup");
            selectionPopup = document.createElement('button');
            selectionPopup.id = 'goodnote-selection-popup';
            selectionPopup.textContent = '➕';
            // Ensure it starts hidden if CSS relies on opacity/transform
            selectionPopup.style.display = 'none'; // Explicitly hide initially
            document.body.appendChild(selectionPopup);

            // Calculate position
            let popupTop = window.pageYOffset + rect.bottom + 8;
            let popupLeft = window.pageXOffset + rect.left + (rect.width / 2) - (selectionPopup.offsetWidth / 2);
            const popupWidth = selectionPopup.offsetWidth; const popupHeight = selectionPopup.offsetHeight;
            if (popupLeft + popupWidth > window.innerWidth - 10) popupLeft = window.innerWidth - popupWidth - 10;
            if (popupTop + popupHeight > window.innerHeight + window.pageYOffset - 10) popupTop = window.pageYOffset + rect.top - popupHeight - 8;
            popupLeft = Math.max(10 + window.pageXOffset, popupLeft);
            popupTop = Math.max(10 + window.pageYOffset, popupTop);
            // console.log("Popup Position:", {top: popupTop, left: popupLeft});

            selectionPopup.style.top = `${popupTop}px`;
            selectionPopup.style.left = `${popupLeft}px`;
            selectionPopup.style.display = ''; // Clear display style override

            // --- Use .visible class to trigger CSS animation ---
            // console.log("Adding .visible class to popup");
            requestAnimationFrame(() => { // Ensure element is ready for transition
                 selectionPopup.classList.add('visible');
            });
            // --- END CHANGE ---

            selectionPopup.addEventListener('click', function handleAddClick(event) {
                event.stopPropagation();
                // console.log("Add to Note Clicked");
                const currentContent = textarea.innerHTML.trim();
                const textToAdd = selectedText.replace(/\r\n|\n/g, '<br>');
                const linkedText = linkify(textToAdd);
                textarea.innerHTML += (currentContent ? '<br><br>' : '') + linkedText;
                saveNote();
                removeSelectionPopup();
                window.getSelection().removeAllRanges();
                flashMessage("已添加到笔记");
            });
        } else {
             // console.log("Selected text is empty after trim");
        }
    }, 100);
});
document.addEventListener('mousedown', (e) => { if (selectionPopup && !selectionPopup.contains(e.target)) { /* console.log("Mousedown outside popup, removing"); */ removeSelectionPopup(); } });


// --- UI Action Buttons & Flash Message ---
let messageTimeout;
function flashMessage(message, isError = false) { let msgDiv = document.getElementById('goodnote-message'); if (!msgDiv) { msgDiv = document.createElement('div'); msgDiv.id = 'goodnote-message'; if (document.body) document.body.appendChild(msgDiv); else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(msgDiv)); } msgDiv.textContent = message; msgDiv.classList.toggle('error', isError); msgDiv.classList.add('visible'); clearTimeout(messageTimeout); messageTimeout = setTimeout(() => { if (msgDiv) msgDiv.classList.remove('visible'); }, 2500); }
copyButton.addEventListener('click', (e) => { e.stopPropagation(); const htmlContent = textarea.innerHTML; const textToCopy = convertHtmlToPlainTextWithNewlines(htmlContent); if (textToCopy) { navigator.clipboard.writeText(textToCopy).then(() => flashMessage("笔记已复制!")).catch(err => { console.error('GoodNote: 复制失败', err); flashMessage("复制失败", true); }); } else { flashMessage("笔记为空", true); } });
cutButton.addEventListener('click', (e) => { e.stopPropagation(); performCutNoteAction(); });

// --- Drag Logic ---
let isDragging = false; let dragOffsetX, dragOffsetY;
function dragStart(e) { if (e.button === 0 && (e.target === noteIcon || noteIcon.contains(e.target))) { isDragging = true; const rect = noteIcon.getBoundingClientRect(); dragOffsetX = e.clientX - rect.left; dragOffsetY = e.clientY - rect.top; noteIcon.style.cursor = 'grabbing'; noteIcon.style.transition = 'none'; e.preventDefault(); } }
function drag(e) { if (isDragging) { let newX = e.clientX - dragOffsetX; let newY = e.clientY - dragOffsetY; const iconWidth = noteIcon.offsetWidth; const iconHeight = noteIcon.offsetHeight; newX = Math.max(0, Math.min(newX, window.innerWidth - iconWidth)); newY = Math.max(0, Math.min(newY, window.innerHeight - iconHeight)); noteIcon.style.left = `${newX}px`; noteIcon.style.top = `${newY}px`; noteIcon.style.right = ''; noteIcon.style.bottom = ''; } }
function dragEnd(e) { if (isDragging) { isDragging = false; noteIcon.style.cursor = 'move'; noteIcon.style.transition = 'transform 0.15s ease, background-color 0.2s ease, opacity 0.2s ease'; GM_setValue(positionKey, { top: noteIcon.style.top, left: noteIcon.style.left }); } }
noteIcon.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

// --- Load Icon Position ---
function loadIconPosition() { const savedPosition = GM_getValue(positionKey, null); if (savedPosition && typeof savedPosition.left === 'string' && typeof savedPosition.top === 'string') { noteIcon.style.left = savedPosition.left; noteIcon.style.top = savedPosition.top; noteIcon.style.right = ''; noteIcon.style.bottom = ''; } else { setDefaultIconPosition(); if (savedPosition) GM_setValue(positionKey, null); } }
function setDefaultIconPosition() { noteIcon.style.top = '20px'; noteIcon.style.right = '20px'; noteIcon.style.left = ''; noteIcon.style.bottom = ''; }

// --- Note Visibility Logic ---
let isVisible = false; let isPinned = false; let hoverTimeout;
pinButton.addEventListener('click', (e) => { e.stopPropagation(); isPinned = !isPinned; noteContainer.classList.toggle('pinned', isPinned); pinButton.title = isPinned ? '取消置顶笔记' : '置顶笔记'; if (isPinned) { flashMessage("笔记已置顶"); if (!isVisible) toggleNote(true); clearTimeout(hoverTimeout); } else { flashMessage("笔记已取消置顶"); handleMouseLeave(); } });

// --- Action Functions (Cut/Paste) ---
async function performCutNoteAction() { const htmlContent = textarea.innerHTML; const textToCopy = convertHtmlToPlainTextWithNewlines(htmlContent); if (textToCopy) { try { await navigator.clipboard.writeText(textToCopy); textarea.innerHTML = ''; saveNote(); flashMessage("笔记已剪切!"); return true; } catch (err) { console.error('GoodNote: 剪切失败', err); flashMessage("剪切失败", true); return false; } } else { flashMessage("笔记为空", true); return false; } }
async function performPasteAction() { const activeElement = document.activeElement; const isEditable = activeElement && (activeElement.isContentEditable || activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'); if (isEditable) { try { const text = await navigator.clipboard.readText(); if (!text) { flashMessage("剪贴板为空", true); return false; } if (activeElement.isContentEditable) { document.execCommand('insertText', false, text); if (activeElement === textarea) textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); } else { const start = activeElement.selectionStart; const end = activeElement.selectionEnd; const originalValue = activeElement.value; activeElement.value = originalValue.substring(0, start) + text + originalValue.substring(end); const newCursorPos = start + text.length; activeElement.selectionStart = newCursorPos; activeElement.selectionEnd = newCursorPos; activeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); } return true; } catch (err) { if (err.name === 'NotAllowedError') flashMessage('需要剪贴板读取权限', true); else { console.error('GoodNote: 粘贴失败', err); flashMessage('粘贴失败', true); } return false; } } else { flashMessage("当前光标位置不可粘贴", true); return false; } }

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', async (e) => { if (e.ctrlKey && e.altKey && e.key && e.key.toLowerCase() === 'p') { e.preventDefault(); performCutNoteAction(); return; } if (e.ctrlKey && e.altKey && e.key && e.key.toLowerCase() === 'o') { e.preventDefault(); performPasteAction(); return; } if (e.ctrlKey && e.altKey && e.key && e.key.toLowerCase() === 'v') { e.preventDefault(); try { const cutSuccess = await performCutNoteAction(); if (cutSuccess) await performPasteAction(); } catch (error) { console.error("GoodNote: Ctrl+Alt+V 操作失败:", error); flashMessage("剪切粘贴操作失败", true); } return; } if (e.key === 'Escape' && isVisible && !isPinned) { if (textarea.contains(document.activeElement)) { toggleNote(); e.preventDefault(); return; } const targetTagName = e.target.tagName; const isInputFocused = e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTagName); if (!isInputFocused && !selectionPopup) { toggleNote(); e.preventDefault(); return; } } const targetTagNameGlobal = e.target.tagName; if (!e.target.isContentEditable && !['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTagNameGlobal)) { const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform); if ((isMac ? e.metaKey : e.ctrlKey) && e.shiftKey && e.key && e.key.toLowerCase() === 'm') { e.preventDefault(); toggleNote(); return; } } });

// --- Icon Click/Hover/Leave Logic ---
noteIcon.addEventListener('click', (e) => { if (!isDragging && !isTouchDragging) toggleNote(); });
noteIcon.addEventListener('mouseenter', () => { clearTimeout(hoverTimeout); if (!isDragging && !isTouchDragging && !isVisible && !isPinned) toggleNote(true); });
function handleMouseLeave() { clearTimeout(hoverTimeout); if (isVisible && !isPinned) { hoverTimeout = setTimeout(() => { const activeElement = document.activeElement; if (!isVisible || isPinned || noteContainer.contains(activeElement)) return; if (!noteIcon.matches(':hover') && !noteContainer.matches(':hover')) toggleNote(); }, 600); } }
noteIcon.addEventListener('mouseleave', handleMouseLeave);
noteContainer.addEventListener('mouseleave', handleMouseLeave);
noteContainer.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
document.addEventListener('click', (e) => { if (isVisible && !isPinned && !noteContainer.contains(e.target) && !noteIcon.contains(e.target) && (!selectionPopup || !selectionPopup.contains(e.target))) { clearTimeout(hoverTimeout); toggleNote(); } }, true);

// --- Touch Drag Logic ---
let touchStartX, touchStartY, touchInitialX, touchInitialY; let isTouchDragging = false; let touchStartTime = 0; let touchMoveDistance = 0; let touchHasDragged = false;
noteIcon.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { const touch = e.touches[0]; isTouchDragging = true; isDragging = false; touchHasDragged = false; const rect = noteIcon.getBoundingClientRect(); touchStartX = touch.clientX; touchStartY = touch.clientY; touchInitialX = rect.left; touchInitialY = rect.top; touchStartTime = Date.now(); touchMoveDistance = 0; noteIcon.style.transition = 'none'; } }, { passive: true });
noteIcon.addEventListener('touchmove', (e) => { if (!isTouchDragging || e.touches.length !== 1) return; const touch = e.touches[0]; const dx = touch.clientX - touchStartX; const dy = touch.clientY - touchStartY; touchMoveDistance = Math.sqrt(dx * dx + dy * dy); if (touchMoveDistance > 10) { touchHasDragged = true; let newX = touchInitialX + dx; let newY = touchInitialY + dy; const iconWidth = noteIcon.offsetWidth; const iconHeight = noteIcon.offsetHeight; newX = Math.max(0, Math.min(newX, window.innerWidth - iconWidth)); newY = Math.max(0, Math.min(newY, window.innerHeight - iconHeight)); noteIcon.style.left = `${newX}px`; noteIcon.style.top = `${newY}px`; noteIcon.style.right = ''; noteIcon.style.bottom = ''; if (e.cancelable) e.preventDefault(); } }, { passive: false });
noteIcon.addEventListener('touchend', (e) => { if (!isTouchDragging) return; noteIcon.style.transition = 'transform 0.15s ease, background-color 0.2s ease, opacity 0.2s ease'; const duration = Date.now() - touchStartTime; if (touchHasDragged) { GM_setValue(positionKey, { top: noteIcon.style.top, left: noteIcon.style.left }); } else if (duration < 300) toggleNote(); isTouchDragging = false; touchHasDragged = false; });

// --- Polling Sync Logic ---
let pollingInterval = null; const POLLING_INTERVAL_MS = 800;
function checkAndUpdateNoteViaPolling() { if (document.activeElement !== textarea) { const storedNote = GM_getValue(storageKey, ''); if (textarea.innerHTML !== storedNote) textarea.innerHTML = storedNote; } }
function startPolling() { if (pollingInterval === null && !isVisible) { checkAndUpdateNoteViaPolling(); pollingInterval = setInterval(checkAndUpdateNoteViaPolling, POLLING_INTERVAL_MS); } }
function stopPolling() { if (pollingInterval !== null) { clearInterval(pollingInterval); pollingInterval = null; } }

// --- Modified toggleNote (No container animation at all) ---
function toggleNote(forceOpen = false) {
    const shouldBeVisible = forceOpen || !isVisible;
    if (shouldBeVisible) { // Opening
        if (isVisible && !forceOpen) return;
        stopPolling();
        const storedNoteBeforeShow = GM_getValue(storageKey, '');
        if (textarea.innerHTML !== storedNoteBeforeShow) textarea.innerHTML = storedNoteBeforeShow;
        const iconRect = noteIcon.getBoundingClientRect();
        const padding = 15;
        const containerStyle = getComputedStyle(noteContainer);
        const containerMinWidth = parseInt(containerStyle.minWidth) || 380;
        const containerMinHeight = 300;

        let left = iconRect.right + padding;
        let top = Math.max(padding, iconRect.top);
        if (left + containerMinWidth > window.innerWidth - padding) left = iconRect.left - containerMinWidth - padding;
        left = Math.max(padding, left);
        const estimatedHeight = Math.max(containerMinHeight, noteContainer.offsetHeight);
         if (top + estimatedHeight > window.innerHeight - padding) top = window.innerHeight - estimatedHeight - padding;
        top = Math.max(padding, top);
        noteContainer.style.top = `${top}px`;
        noteContainer.style.left = `${left}px`;

        noteContainer.style.display = 'block';
        noteContainer.classList.add('active');

        setTimeout(() => {
             if (!selectionPopup && noteContainer.classList.contains('active')) {
                 textarea.focus();
                 try { const range = document.createRange(); const sel = window.getSelection(); range.selectNodeContents(textarea); range.collapse(false); sel.removeAllRanges(); sel.addRange(range); }
                 catch(e) { console.warn("GoodNote: Setting cursor position failed.", e); }
             }
        }, 50);

        isVisible = true;
    } else { // Closing
        if (!isVisible || isPinned) return;
        noteContainer.style.display = 'none';
        noteContainer.classList.remove('active');
        isVisible = false;
        startPolling();
    }
}

// --- Initialization ---
console.log("GoodNote Final v6 Initializing...");
loadNote();
loadIconPosition();
startPolling();

})();
// --- END OF SCRIPT ---