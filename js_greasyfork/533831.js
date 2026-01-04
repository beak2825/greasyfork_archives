// ==UserScript==
    // @name         AITL - Du premier coup !
    // @namespace    http://tampermonkey.net/
    // @version      1.3
    // @description  Preview de l'annonce AITL
    // @author       Laïn
    // @match        https://www.dreadcast.net/Main
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533831/AITL%20-%20Du%20premier%20coup%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/533831/AITL%20-%20Du%20premier%20coup%20%21.meta.js
    // ==/UserScript==
     
    (function () {
        'use strict';
     
        const previewWidth = '486.083px';
        const previewHeight = '265.45px';
        const baseFontSizeToUse = 16;
        const originalRemBaseSize = 12;
        const STORAGE_KEY = 'balisePreviewerContent';
        const UNDO_LIMIT = 5;
        const DEBOUNCE_MS = 500;
        const popupGradientStartColor = '#264761';
        const popupGradientEndColor = '#3ba8cc';
        const headerGradientStart = '#85d9f0';
        const headerGradientEnd = '#1c4e68';
        const headerTextColor = 'black';
        const buttonBackgroundColor = '#aae6fe';
        const buttonTextColor = 'black';
        const buttonHoverBorderColor = '#88cffc';
        const defaultTextColor = 'black';
        const defaultBackgroundColor = 'white';
        const popupTextColor = '#f0f0f0';
        const closeButtonColor = 'black';
        const closeButtonHoverColor = '#333';
        const placeholderTextColor = 'rgba(255, 255, 255, 0.7)';
     
        const annonceButtonSelector = 'div.menu[onclick*="showNewAnnonce()"]';
     
        // CSS updated: Removed max-width: 100% from .previewBox img
        const styles = `
                #balisePreviewPopup {
                    position: fixed; background: linear-gradient(to bottom right, ${popupGradientStartColor}, ${popupGradientEndColor});
                    color: ${popupTextColor}; font-family: "Trebuchet MS", Verdana, Arial, sans-serif; z-index: 1000001;
                    border: 1px solid #555; box-shadow: 0 5px 15px rgba(0,0,0,0.6); max-width: 90vw;
                    box-sizing: border-box; display: flex; flex-direction: column; border-radius: 5px;
                    overflow: hidden; opacity: 0; transition: opacity 0.2s ease-in;
                }
                #balisePreviewHeader {
                    background: linear-gradient(to right, ${headerGradientEnd}, ${headerGradientStart}); color: ${headerTextColor};
                    padding: 8px 15px; text-align: center; font-family: "Trebuchet MS", Verdana, Arial, sans-serif;
                    font-weight: bold; cursor: move; user-select: none; flex-shrink: 0; position: relative;
                    text-shadow: 0px 0px 3px rgba(180, 180, 180, 0.5); padding-right: 40px;
                }
                #balisePreviewContent {
                    padding: 15px; padding-top: 10px; display: flex; flex-direction: column; flex-grow: 1; min-height: 0;
                    transition: opacity 0.2s ease-in-out, max-height 0.2s ease-in-out, padding 0.2s ease-in-out, visibility 0.2s step-end;
                    max-height: 80vh; opacity: 1; visibility: visible;
                }
                #balisePreviewPopup.minimized #balisePreviewContent {
                     max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; overflow: hidden; visibility: hidden;
                     transition: opacity 0.2s ease-in-out, max-height 0.2s ease-in-out, padding 0.2s ease-in-out, visibility 0s linear 0.2s;
                }
                #balisePreviewPopup textarea {
                    width: 100%; min-height: 100px; font-size: 14px; margin-bottom: 10px; box-sizing: border-box;
                    flex-shrink: 0; border: 1px solid #ccc; border-radius: 3px; background-color: ${defaultBackgroundColor};
                    color: ${defaultTextColor}; padding: 5px;
                }
                #balisePreviewPopup textarea::placeholder { color: ${placeholderTextColor}; opacity: 1; font-style: italic; }
                #baliseButtons { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; flex-shrink: 0; }
                #baliseButtons button {
                    padding: 4px 8px; cursor: pointer; border: 1px solid #888; border-radius: 3px; font-size: 12px;
                    font-weight: bold; background-color: ${buttonBackgroundColor}; color: ${buttonTextColor};
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                }
                #baliseButtons button:hover { border-color: ${buttonHoverBorderColor}; box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); }
                #baliseButtons button.italic { font-style: italic; }
                #balisePreviewPopup .previewBox {
                    width: ${previewWidth}; max-width: 100%; height: ${previewHeight}; font-family: "Trebuchet MS", Verdana, Arial, sans-serif;
                    font-size: ${baseFontSizeToUse}px; line-height: normal; padding: 5px ${1.5 * originalRemBaseSize}px 5px 5px;
                    overflow: auto; box-sizing: border-box; border: 1px solid #ccc; word-wrap: break-word; flex-grow: 1;
                    min-height: 0; border-radius: 3px; background-color: ${defaultBackgroundColor}; color: ${defaultTextColor};
                }
                #balisePreviewClose {
                    position: absolute; top: 50%; transform: translateY(-50%); right: 15px; cursor: pointer;
                    font-weight: bold; font-size: 20px; color: ${closeButtonColor}; z-index: 10;
                    text-shadow: 1px 1px 2px rgba(255,255,255,0.5); transition: color 0.2s ease;
                }
                #balisePreviewClose:hover { color: ${closeButtonHoverColor}; }
                #balisePreviewPopup .previewBox b, #balisePreviewPopup .previewBox i,
                #balisePreviewPopup .previewBox div, #balisePreviewPopup .previewBox span:not([style*="color:"]) { color: ${defaultTextColor}; }
                #balisePreviewPopup .previewBox b { font-weight: bold; } #balisePreviewPopup .previewBox i { font-style: italic; }
                #balisePreviewPopup .previewBox img {
                    /* Removed max-width: 100%; */
                    /* Removed max-height: 100px; (removed in previous step) */
                    margin: 5px 0;
                    vertical-align: middle;
                    display: inline-block; /* Keeps image flow somewhat inline */
                }
                #balisePreviewPopup .previewBox .parsed-center { display: block; text-align: center; margin: 0.5em 0; }
                #balisePreviewPopup .previewBox .parsed-title { display: block; text-align: center; font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
            `;
     
        // parseBalises function remains the same
        function parseBalises(text) {
            text = text.replace(/</g, "<").replace(/>/g, ">");
            text = text.replace(/\n/g, '<br>');
            return text.replace(/\[titre\](.*?)\[\/titre\]/gis,'<div class="parsed-title">$1</div>').replace(/\[centrer\](.*?)\[\/centrer\]/gis,'<div class="parsed-center">$1</div>').replace(/\[couleur=([^\]]+?)\](.*?)\[\/couleur\]/gis,(m,c,t)=>{const s=String(c).trim().toLowerCase();let colorValue=s;if(/^#[0-9a-f]{3,6}$/.test(s)){colorValue=s.substring(1);}return /^[a-z]+$|^#[0-9a-f]{3,6}$|^[0-9a-f]{3,6}$|^rgb\s*\((\s*\d+\s*,){2}\s*\d+\s*\)$|^rgba\s*\((\s*\d+\s*,){3}\s*[\d\.]+\s*\)$/.test(s)?`<span style="color:${colorValue};">${t.replace(/<br>/g,'\n').replace(/\n/g,'<br>')}</span>`:`[Couleur invalide: ${c}]${t}[/couleur]`}).replace(/\[b\](.*?)\[\/b\]/gis,'<b>$1</b>').replace(/\[i\](.*?)\[\/i\]/gis,'<i>$1</i>').replace(/\[img=(.*?)\]/gis,(m,u)=>{const s=String(u).trim();return /^https?:\/\//i.test(s)?`<img src="${s}" alt="Image utilisateur">`:`[URL d'image invalide: ${u}]`});
        }
     
        // insertBalise function remains the same (with 'img' inserting tags and positioning cursor)
        function insertBalise(textarea, baliseType, saveHistoryCallback) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const selectedText = text.substring(start, end);
            let prefix = '', suffix = '', replacementText = '', finalCursorPos = start;
            const currentStateBeforeInsert = textarea.value;
     
            switch (baliseType) {
                case 'titre': prefix = '[titre]'; suffix = '[/titre]'; break;
                case 'centrer': prefix = '[centrer]'; suffix = '[/centrer]'; break;
                case 'couleur':
                    const color = prompt("Entrez une couleur (ex: red, #ff0000):", "");
                    if (color === null || color.trim() === "") return;
                    prefix = `[couleur=${color.trim()}]`; suffix = '[/couleur]'; break;
                case 'b': prefix = '[b]'; suffix = '[/b]'; break;
                case 'i': prefix = '[i]'; suffix = '[/i]'; break;
                case 'img':
                    prefix = '[img=';
                    suffix = ']';
                    replacementText = '';
                    finalCursorPos = start + prefix.length; // Position cursor after '='
                    textarea.value = text.substring(0, start) + prefix + suffix + text.substring(end);
                    textarea.focus();
                    textarea.setSelectionRange(finalCursorPos, finalCursorPos);
                    textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    if (saveHistoryCallback) {
                        saveHistoryCallback(currentStateBeforeInsert, textarea.value);
                    }
                    return;
                default: return;
            }
     
            // Logic for non-img tags
            if (selectedText) {
                replacementText = selectedText;
                finalCursorPos = start + prefix.length + replacementText.length + suffix.length;
            } else {
                replacementText = '';
                finalCursorPos = start + prefix.length; // Position cursor inside tags
            }
            let fullReplacement = prefix + replacementText + suffix;
            textarea.value = text.substring(0, start) + fullReplacement + text.substring(end);
            textarea.focus();
            textarea.setSelectionRange(finalCursorPos, finalCursorPos);
     
            textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            if (saveHistoryCallback) {
                saveHistoryCallback(currentStateBeforeInsert, textarea.value);
            }
        }
     
        // --- Rest of the script (createPopup, event listeners, observer etc.) remains unchanged ---
     
        let popupInstance = null; let styleTagInstance = null;
        let history = [];
        let redoHistory = [];
        let currentState = '';
        let debounceTimeout = null;
        let currentKeyListener = null;
     
        function createPopup() {
            if (document.getElementById('balisePreviewPopup')) { return; }
            if (popupInstance) popupInstance.remove(); if (styleTagInstance) styleTagInstance.remove();
     
            history = [];
            redoHistory = [];
            currentState = localStorage.getItem(STORAGE_KEY) || '';
            debounceTimeout = null;
            currentKeyListener = null;
     
            styleTagInstance = document.createElement('style'); styleTagInstance.id = 'balisePreviewStyle';
            styleTagInstance.textContent = styles; document.head.appendChild(styleTagInstance);
            popupInstance = document.createElement('div'); popupInstance.id = 'balisePreviewPopup';
            popupInstance.innerHTML = `
                <div id="balisePreviewHeader"> AITL du premier coup ! <div id="balisePreviewClose" title="Fermer l'aperçu (Échap)">✖</div> </div>
                <div id="balisePreviewContent"> <textarea placeholder="Entrez du texte avec des balises... Aperçu en direct ci-dessous !"></textarea> <div id="baliseButtons"> <button data-balise="b" title="[b]texte[/b]">G</button> <button data-balise="i" title="[i]texte[/i]" class="italic">I</button> <button data-balise="centrer" title="[centrer]texte[/centrer]">-c-</button> <button data-balise="couleur" title="[couleur=...]texte[/couleur]">Coul.</button> <button data-balise="titre" title="[titre]texte[/titre]">Titre</button> <button data-balise="img" title="[img=url]">[img=...]</button> </div> <div class="previewBox"></div> </div>`;
            document.body.appendChild(popupInstance);
     
            const header = popupInstance.querySelector('#balisePreviewHeader'); const content = popupInstance.querySelector('#balisePreviewContent');
            const closeBtn = popupInstance.querySelector('#balisePreviewClose'); const textarea = popupInstance.querySelector('textarea');
            const previewBox = popupInstance.querySelector('.previewBox'); const buttonContainer = popupInstance.querySelector('#baliseButtons');
     
            textarea.value = currentState;
     
            setTimeout(() => {
                 if (popupInstance && document.body.contains(popupInstance)) {
                     const popupWidth = popupInstance.offsetWidth; const popupHeight = popupInstance.offsetHeight;
                     const viewWidth = window.innerWidth; const viewHeight = window.innerHeight;
                     popupInstance.style.left = `${Math.max(0, (viewWidth - popupWidth) / 2)}px`;
                     popupInstance.style.top = `${Math.max(0, (viewHeight - popupHeight) / 2)}px`;
                     popupInstance.style.opacity = '1';
                }
            }, 10);
     
            const updatePreview = () => { const raw = textarea.value; const parsed = parseBalises(raw); previewBox.innerHTML = parsed; };
     
            const saveToHistory = (stateBeforeChange, stateAfterChange) => {
                if (stateBeforeChange === stateAfterChange) return;
     
                history.push(stateBeforeChange);
                if (history.length > UNDO_LIMIT) {
                    history.shift();
                }
                redoHistory = [];
                currentState = stateAfterChange;
                localStorage.setItem(STORAGE_KEY, currentState);
            };
     
            const undo = () => {
                if (history.length === 0) { return; }
                const previousState = history.pop();
                redoHistory.push(currentState);
                currentState = previousState;
                textarea.value = currentState;
                localStorage.setItem(STORAGE_KEY, currentState);
                updatePreview();
            };
     
            const redo = () => {
                if (redoHistory.length === 0) { return; }
                const nextState = redoHistory.pop();
                history.push(currentState);
                currentState = nextState;
                textarea.value = currentState;
                localStorage.setItem(STORAGE_KEY, currentState);
                updatePreview();
            };
     
            const closeFunction = () => {
                if (currentKeyListener) {
                    document.removeEventListener('keydown', currentKeyListener);
                    currentKeyListener = null;
                }
                document.removeEventListener('mousemove', dragMove); document.removeEventListener('mouseup', dragEnd);
                document.removeEventListener('mouseleave', dragEnd);
                if (popupInstance) { popupInstance.style.transition = 'opacity 0.2s ease-out'; popupInstance.style.opacity = '0'; }
                setTimeout(() => {
                    if (popupInstance) popupInstance.remove(); if (styleTagInstance) styleTagInstance.remove();
                    popupInstance = null; styleTagInstance = null;
                }, 200);
            };
     
            closeBtn.addEventListener('click', closeFunction);
     
            textarea.addEventListener('input', () => {
                const newValue = textarea.value;
                updatePreview();
                 localStorage.setItem(STORAGE_KEY, newValue);
     
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    if (newValue !== currentState) {
                         saveToHistory(currentState, newValue);
                    }
                }, DEBOUNCE_MS);
            });
     
     
            buttonContainer.addEventListener('click', (event) => {
                if (event.target.tagName === 'BUTTON') {
                    const baliseType = event.target.dataset.balise;
                    if (baliseType) {
                        clearTimeout(debounceTimeout);
                        insertBalise(textarea, baliseType, saveToHistory);
                    }
                }
            });
     
     
            header.addEventListener('dblclick', (e) => { if (e.target.closest('#balisePreviewClose')) return; popupInstance.classList.toggle('minimized'); });
     
            let isDragging = false; let initialX, initialY, offsetX, offsetY;
            function dragStart(e) {
                 if (e.target.closest('#balisePreviewClose')) return; isDragging = true;
                 initialX = e.pageX; initialY = e.pageY; const styles = window.getComputedStyle(popupInstance);
                 offsetX = parseFloat(styles.left) || 0; offsetY = parseFloat(styles.top) || 0;
                 popupInstance.style.cursor = 'grabbing'; popupInstance.style.transition = 'none';
                 if (content) content.style.transition = 'none'; document.addEventListener('mousemove', dragMove);
                 document.addEventListener('mouseup', dragEnd); document.addEventListener('mouseleave', dragEnd);
             }
            function dragMove(e) {
                 if (!isDragging) return; e.preventDefault(); const currentX = e.pageX; const currentY = e.pageY;
                 const dx = currentX - initialX; const dy = currentY - initialY; let newLeft = offsetX + dx; let newTop = offsetY + dy;
                 const popupWidth = popupInstance.offsetWidth; const popupHeight = popupInstance.offsetHeight;
                 newLeft = Math.max(0, Math.min(window.innerWidth - popupWidth, newLeft));
                 newTop = Math.max(0, Math.min(window.innerHeight - popupHeight, newTop));
                 popupInstance.style.left = `${newLeft}px`; popupInstance.style.top = `${newTop}px`;
             }
            function dragEnd() {
                 if (!isDragging) return; isDragging = false; popupInstance.style.cursor = '';
                 popupInstance.style.transition = ''; if (content) content.style.transition = '';
                 document.removeEventListener('mousemove', dragMove); document.removeEventListener('mouseup', dragEnd);
                 document.removeEventListener('mouseleave', dragEnd);
             }
            header.addEventListener('mousedown', dragStart);
     
            updatePreview();
            textarea.focus();
     
            currentKeyListener = (e) => {
                if (!popupInstance || !document.body.contains(popupInstance)) return;
     
                if (e.key === 'Escape') {
                     if (!popupInstance.classList.contains('minimized')) { closeFunction(); }
                     else { popupInstance.classList.remove('minimized'); }
                } else if (e.altKey && e.key.toLowerCase() === 'z') {
                     e.preventDefault();
                     undo();
                } else if (e.altKey && e.key.toLowerCase() === 'y') {
                     e.preventDefault();
                     redo();
                }
            };
            document.addEventListener('keydown', currentKeyListener);
     
        }
     
     
        document.addEventListener('keydown', function (e) {
            if (e.altKey && e.key.toLowerCase() === 'm') {
                e.preventDefault(); createPopup();
            }
        });
     
        function setupAnnonceButtonListener(button) {
            if (button.dataset.balisePreviewerAttached === 'true') return;
            button.addEventListener('click', function(event) {
                createPopup();
            }, false);
            button.dataset.balisePreviewerAttached = 'true';
        }
     
        let observer = new MutationObserver((mutationsList, obs) => {
            for(const mutation of mutationsList){if(mutation.type==='childList'){for(const node of mutation.addedNodes){if(node.nodeType===Node.ELEMENT_NODE){if(node.matches&&node.matches(annonceButtonSelector)&&!node.dataset.balisePreviewerAttached){setupAnnonceButtonListener(node);}const button=node.querySelector(annonceButtonSelector);if(button&&!button.dataset.balisePreviewerAttached){setupAnnonceButtonListener(button);}}}}}
            const annonceButton = document.querySelector(annonceButtonSelector); if (annonceButton && !annonceButton.dataset.balisePreviewerAttached) { setupAnnonceButtonListener(annonceButton); }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        const initialButton = document.querySelector(annonceButtonSelector);
        if (initialButton && !initialButton.dataset.balisePreviewerAttached) {
            setupAnnonceButtonListener(initialButton);
        }
     
    })();

