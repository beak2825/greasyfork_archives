// ==UserScript==
// @name         AO3 Floaty Comment Box (Responsive)
// @namespace    http://tampermonkey.net/
// @version      1.12.6
// @description  AO3 Floaty Comment Box (Responsive) is a userscript created to facilitate commenting on the fly while reading on archiveofourown - specifically for mobile browsing
// @author       Schildpath
// @match        http://archiveofourown.org/*
// @match        https://archiveofourown.org/*
// @match        http://www.archiveofourown.org/*
// @match        https://www.archiveofourown.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542872/AO3%20Floaty%20Comment%20Box%20%28Responsive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542872/AO3%20Floaty%20Comment%20Box%20%28Responsive%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants
    // ------------------------------------------------------------

    const floatyId = 'floaty-box';
    const quoteSetting = 'floaty-quote-format';
    const viewSetting = 'floaty-default-view';
    const storyKey = 'floaty-draft' + location.pathname;
    const quoteFormats = {
        "block": (text) => `<blockquote><em>${text.trim()}</em></blockquote>\n`,
        "inline": (text) => `<em>"${text.trim()}"</em>`
    };

    // Helper functions
    // ------------------------------------------------------------

    function getSetting(key, defaultValue) {
        return localStorage.getItem(key) ?? defaultValue;
    }

    function setSetting(key, value) {
        localStorage.setItem(key, value);
    }

    let scrollY = 0;

    function lockScroll() {
        scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100%';
        document.documentElement.style.overflow = 'hidden'; // <html>
    }

    function unlockScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
    }

    function isIOSSafari() {
        return (
            /iP(ad|hone|od)/.test(navigator.userAgent) &&
            /Safari/.test(navigator.userAgent) &&
            !/CriOS|FxiOS|OPiOS|EdgiOS/.test(navigator.userAgent)
        );
    }

    if (isIOSSafari()) {
        document.documentElement.classList.add('ios-safari');
    }


    // Create floaty box
    // ------------------------------------------------------------

    function createFloaty(commentBox) {

        // If floaty already exists, exit
        if (document.getElementById(floatyId)) return;

        // Global css/style
        // ------------------------------------------------------------

        const style = document.createElement('style');
        style.textContent = `
            #floaty-box-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                width: 100vw;
                height: 30%;
                z-index: 9997;
                display: none;
                flex-direction: column;
                background: inherit;
                font-family: inherit;
                font-size: 0.8em;
                color: inherit;
                box-shadow: 0 5px 10px rgba(0,0,0,0.5);
                overflow:hidden;
            }
            #floaty-header {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                align-content: stretch;
                gap: 0.3em;
                padding: .5em.9em;
                font-size: 1em;
            }
            #floaty-textarea {
                padding: .9em;
                font-size: 1em;
                font-family: inherit;
                color: inherit;
                background: inherit;
                border: none;
                resize: none;
                outline: none;
                width: 100%;
                flex: 1;
                min-height: 0;
                box-sizing: border-box;
            }
            .ios-safari #floaty-textarea {
                font-size: 16px;
            }
            #floaty-toggle {
                position: fixed;
                inset: .5em .5em auto auto;
                z-index: 9999;
                padding: 0.1em 0.4em;
                border-radius: 0.4em;
                font-family: inherit;
                font-size: 1.3em;
                color: inherit;
                opacity: .9;
                cursor: pointer;
                min-width: 20px;
                min-height: 20px;
            }
            #floaty-bg-container {
                position: fixed;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.5);
                width: 100vw;
                height: 100vh;
                display: none;
                z-index: 9998
            }
            #floaty-popup-container {
                position: fixed;
                display: flex;
                top: 50%;
                left: 0;
                transform: translate(0,-50%);
                margin: 0 1em;
                z-index: 9999;
                display: none;
                flex-direction: column;
                padding: .9em;
                gap: 0.5em;
                font-family: inherit;
                font-size: 0.8em;
                background: inherit;
                overflow-y: auto;
                border-top: 1px solid inherit;
                border-bottom: 1px solid inherit;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
            }
            #floaty-tips, #floaty-settings {
                display: none;
                max-height: 70vh;
                overflow-y: auto;
            }
            .floaty-btn {
                font-family: inherit;
                color: inherit;
                cursor: pointer;
                padding: 0.2em 0.4em;
                font-size: 1em;
                height: 17px;
                min-width: 17px;
            }
            .floaty-exit-btn {
                position: absolute;
                top: .9em;
                right: .9em;
                cursor: pointer;
            }
            #floaty-header-right {
                margin-left: auto;
                display: flex;
                gap: 0.3em;
                justify-content: flex-start;
                align-items: center;
                align-content: stretch;
            }
            #floaty-footer {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                align-content: stretch;
                gap: 0.5em;
                padding: .5em .9em;
                font-size: .8em;
                opacity: 1;
            }
            fieldset {
                border: none;
                box-shadow: none;
                padding: 0;
                padding-left: 1em;
                margin: 0;
            }
            #floaty-settings li, #floaty-settings hr, #floaty-settings p {
                padding: 0.3em 0;
            }
        `;
        document.head.appendChild(style);

        // Elements
        // ------------------------------------------------------------

        // TOGGLE BUTTON
        const toggleButton = document.createElement('button');
        toggleButton.id = 'floaty-toggle';
        toggleButton.innerHTML = '&#9997;';
        toggleButton.setAttribute('aria-label', 'Toggle Floaty Comment Box');
        toggleButton.onclick = () => {
            // Shows the floaty box when clicked
            showFloaty();
        };

        // CONTAINER
        const container = document.createElement('div');
        container.id = 'floaty-box-container';

        // HEADER
        const header = document.createElement('div');
        header.id = 'floaty-header';
        header.onclick = (e) => {
            // Collapse/expand on header click
            if (e.target === header) {
                textarea.style.display === 'none' ? uncollapseBtn.click() : collapseBtn.click();
            }
        };

        // TEXTAREA
        const textarea = document.createElement('textarea');
        textarea.id = 'floaty-textarea';
        textarea.placeholder = 'Work-in-progress review...';

        // FOOTER
        const footer = document.createElement('div');
        footer.id = 'floaty-footer';

        // CHARACTER COUNT
        const charCount = document.createElement('span');
        charCount.id = 'floaty-char-count';
        updateCharCount();

        // CLEAR BUTTON
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = '🗑️';
        clearBtn.setAttribute('aria-label', 'Clear Comment Box');
        clearBtn.classList.add('floaty-btn');
        clearBtn.onclick = () => {
            if (textarea.value.trim() === '') return; // Do nothing if already empty
            const confirmed = window.confirm('Are you sure you want to clear the comment box? Your draft will be lost.');
            if (confirmed) {
                textarea.value = '';
                commentBox.value = textarea.value
                updateCharCount();
            }
        };

        // POP UP CONTAINER
        const popupContainer = document.createElement('div');
        popupContainer.id = 'floaty-popup-container';
        popupContainer.onclick = (e) => {
            // Prevent click events from propagating to the background container
            e.stopPropagation();
        }

        // BG FOR POP UP CONTAINER
        const bgContainer = document.createElement('div');
        bgContainer.id = 'floaty-bg-container';
        bgContainer.onclick = () => {
            // Hide the popup and background when clicking outside
            closePopup();
        };

        // TIPS
        const tipsContainer = document.createElement('div');
        tipsContainer.id = 'floaty-tips';
        tipsContainer.innerHTML = `<h3>Suggestions for writing a comment:</h3>` +
            '<ul><li>💬 Quotes you liked (select text and click &#171; &#187; to include)</li>' +
            '<li>🎭 Scenes that you liked, or moved you, or surprised you</li>' +
            '<li>😭 What is your feeling at the end of the chapter?</li>' +
            '<li>👓 What are you most looking forward to next?</li>' +
            '<li>🔮 Do you have any predictions for the next chapters?</li>' +
            '<li>❓ Did this chapter give you any questions you can&#39;t wait to find out the answers to?</li>' +
            '<li>✨ Is there something unique about the story that you like?</li>' +
            '<li>🤹 Does the author have a style that really works for you?</li>' +
            '<li>🎤 Did the author leave any comments in the notes that said what they wanted feedback on?</li>' +
            '<li>🗣 Even if all you have are incoherent screams of delight, go for it.</li></ul>'
            ;

        // SETTINGS / ABOUT
        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'floaty-settings';
        settingsContainer.innerHTML = `
        <h3>About</h3>
        <p>AO3 Floaty Comment Box (Responsive) facilitates commenting while reading. It allows the user to copy paste favorite quotes, and write down feelings & thoughts on the fly.</p>
        <hr>
        <ul>
            <li>🔛 <strong>View:</strong> Toggle the floaty box on and off, or expand/collapse the box with the triangle buttons (▼▲) in the header bar.
                <fieldset>
                <label><input type="radio" name="default-view" value="toggle-button" checked> Toggle button visible by default</label><br>
                <label><input type="radio" name="default-view" value="header-bar"> Header bar visible by default</label>
                </fieldset>
            </li>
            <li>💬 <strong>Insert quotes:</strong> Select favorite quotes and use the &#171; &#187; button to insert them your comment. Choose how inserted text will be formatted:
                <fieldset>
                <label><input type="radio" name="quote-format" value="block" checked> Blockquote + italics</label><br>
                <label><input type="radio" name="quote-format" value="inline"> Inline + italics + quotation marks</label>
                </fieldset>
            </li>
            <li>👉 <strong>Navigate:</strong> Scroll down the real comment box with the downward arrow (&dArr;) and go back to your previous position with the upward arrow (&uArr;).</li>
            <li>🔄 <strong>Syncing:</strong> Everything that is typed in the floaty comment box will be automatically synced with the real comment box below the fic. Drafts will be remembered until the review is submitted.</li>
            <li>💌 <strong>Submitting:</strong> Your comment will only be submitted once you submit it in the the real comment form below.</li>
        </ul>
        <hr>
        <p>📞 <strong>Contact:</strong> <a href="https://greasyfork.org/en/scripts/542872-ao3-floaty-comment-box-responsive">Give feedback on GreasyFork</a> for questions or issues.</p>
        <p>&#169; AO3 Floaty Comment Box (Responsive) was directly inspired (with permission) by an AO3 userscript originally developed by <a href="https://ravenel.tumblr.com/post/156555172141/i-saw-this-post-by-astropixie-about-how-itd-be">ravenel</a>. See additional credit on GreasyFork.</p>
        `;
        settingsContainer.querySelectorAll('input[name="quote-format"]').forEach(radio => {
            radio.checked = (radio.value === getSetting(quoteSetting, 'block'));
        });
        settingsContainer.querySelectorAll('input[name="default-view"]').forEach(radio => {
            radio.checked = (radio.value === getSetting(viewSetting, 'toggle-button'));
        });
        settingsContainer.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.name === 'default-view') {
                    setSetting(viewSetting, e.target.value);
                } else if (e.target.name === 'quote-format') {
                    setSetting(quoteSetting, e.target.value);
                }
            });
        });

        // EXIT BUTTONS FOR POPUPS
        const exitTipsBtn = document.createElement('button');
        const exitSettingsBtn = document.createElement('button');
        [exitTipsBtn, exitSettingsBtn].forEach(btn => {
            btn.innerHTML = 'x';
            btn.className = 'floaty-exit-btn';
            btn.setAttribute('aria-label', 'Close Popup');
        });
        [exitSettingsBtn, exitTipsBtn].forEach(btn => {
            btn.onclick = () => closePopup();
        });

        // INSERT QUOTE BUTTON
        const insertBtn = document.createElement('button');
        if (window.innerWidth < 350) {
            insertBtn.innerHTML = '&#171; &#187;'; // Shorten for small screens
        } else {
            insertBtn.innerHTML = '&#171; quote &#187;'; // Full text for larger screens
        }

        // Insert quote logic
        let lastSelectedText = '';
        document.addEventListener('selectionchange', () => {
            // Save last selection, to make sure it's remembered even if IOS loses it
            lastSelectedText = window.getSelection().toString().trim();
        });
        insertBtn.addEventListener('click', (e) => {
            (e).preventDefault();
            // Gets selected text, formats it, and inserts it into the textarea
            const selected = lastSelectedText;
            if (selected) {
                const format = getSetting(quoteSetting, 'block'); // Default formatting is blockquote
                const formattedQuote = quoteFormats[format](selected) || quoteFormats['block'](selected);
                textarea.value += formattedQuote;
                commentBox.value = textarea.value; // Sync with real box
            }
            updateCharCount();
            saveToLocalStorage(textarea.value);
            if (textarea.style.display != 'none') textarea.focus();
        });
        insertBtn.setAttribute('aria-label', 'Insert Quote');

        // DOWN BUTTON
        const downBtn = document.createElement('button');
        downBtn.innerHTML = '&dArr;';
        downBtn.onclick = () => {
            // Scrolls down to the real comment box
            localStorage.setItem("floaty-scrollY", window.scrollY); // Save scroll position to local storage
            document.querySelector('textarea[name="comment[comment_content]"]').scrollIntoView();
        };
        downBtn.setAttribute('aria-label', 'Scroll Down to Comment Box');

        // UP BUTTON
        const upBtn = document.createElement('button');
        upBtn.innerHTML = '&uArr;';
        upBtn.onclick = () => {
            // Scrolls back to the previous position
            const prevScrollPosition = localStorage.getItem("floaty-scrollY");
            if (prevScrollPosition) {
                window.scrollTo(0, parseInt(prevScrollPosition));
            }
        };
        upBtn.setAttribute('aria-label', 'Scroll Up to Previous Position');

        // TIPS BUTTON
        const tipsBtn = document.createElement('button');
        tipsBtn.innerHTML = '&#128161;';
        tipsBtn.onclick = () => showPopup('tips');
        tipsBtn.setAttribute('aria-label', 'Show Tips for Writing Comments');

        // SETTINGS / ABOUT BUTTON
        const settingsBtn = document.createElement('button');
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.onclick = () => showPopup('settings');
        settingsBtn.setAttribute('aria-label', 'Show About and Settings');

        // RIGHT SIDE OF HEADER
        const headerRight = document.createElement('div');
        headerRight.id = 'floaty-header-right';

        // EXPAND BUTTON
        const expandBtn = document.createElement('button');
        expandBtn.innerHTML = '▼';
        expandBtn.onclick = () => showExpandedView();
        expandBtn.setAttribute('aria-label', 'Expand Comment Box to Full Height');

        // MINIMIZE BUTTON
        const minimizeBtn = document.createElement('button');
        minimizeBtn.innerHTML = '▲';
        minimizeBtn.onclick = () => showFloaty();
        minimizeBtn.setAttribute('aria-label', 'Minimize Comment Box');

        // COLLAPSE BUTTON
        const collapseBtn = document.createElement('button');
        collapseBtn.innerHTML = '▲';
        collapseBtn.onclick = () => showCollapsedView();
        collapseBtn.setAttribute('aria-label', 'Collapse Comment Box');

        // UNCOLLAPSE BUTTON
        const uncollapseBtn = document.createElement('button');
        uncollapseBtn.innerHTML = '▼';
        uncollapseBtn.onclick = () => showFloaty();
        uncollapseBtn.setAttribute('aria-label', 'Uncollapse Comment Box');

        // CLOSE BUTTON
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '❯❯';
        closeBtn.onclick = () => showToggleButton();
        closeBtn.setAttribute('aria-label', 'Close Comment Box');

        [insertBtn, downBtn, upBtn, tipsBtn, settingsBtn, expandBtn, minimizeBtn, collapseBtn, uncollapseBtn, closeBtn].forEach(btn => {
            btn.className = 'floaty-btn';
        });

        [minimizeBtn, uncollapseBtn].forEach(btn => {
            btn.style.display = 'none'; // Hide these by default
        });

        closeBtn.style.fontSize = '.8em';
        if (window.innerWidth > 768) {
            closeBtn.style.marginRight = '1.5em';
        }

        if (getSetting(viewSetting, 'toggle-button') === 'header-bar') {
            showCollapsedView();
        } else {
            showToggleButton();
        }

        header.append(insertBtn, downBtn, upBtn, tipsBtn, settingsBtn)
        headerRight.append(expandBtn, minimizeBtn, collapseBtn, uncollapseBtn, closeBtn);
        header.appendChild(headerRight);
        container.appendChild(header);
        container.appendChild(textarea);
        footer.appendChild(charCount);
        footer.appendChild(clearBtn);
        container.appendChild(footer);
        tipsContainer.appendChild(exitTipsBtn);
        settingsContainer.appendChild(exitSettingsBtn);
        popupContainer.appendChild(settingsContainer);
        popupContainer.appendChild(tipsContainer);
        document.body.appendChild(popupContainer);
        document.body.appendChild(bgContainer);
        document.body.appendChild(toggleButton);
        document.body.appendChild(container);

        // Helper functions for creating the floaty box
        // ------------------------------------------------------------

        function showToggleButton() {
            // Hide the floaty box & header, only show toggle button
            container.style.display = 'none';
            toggleButton.style.display = 'block';
            popupContainer.style.display = 'none';
            bgContainer.style.display = 'none';
        }

        function showFloaty() {
            // Minimize textarea to a default height
            container.style.display = 'flex';
            toggleButton.style.display = 'none';
            container.style.height = '30%';
            textarea.style.display = 'block';
            footer.style.display = 'flex';
            minimizeBtn.style.display = 'none';
            uncollapseBtn.style.display = 'none';
            expandBtn.style.display = 'block';
            collapseBtn.style.display = 'block';
        }

        function showCollapsedView() {
            // Collapse textarea so only header remains
            container.style.display = 'flex';
            container.style.height = '36px'; // Height of the header
            header.style.display = 'flex';
            textarea.style.display = 'none';
            footer.style.display = 'none';
            toggleButton.style.display = 'none';
            uncollapseBtn.style.display = 'block';
            minimizeBtn.style.display = 'none';
            expandBtn.style.display = 'none';
            collapseBtn.style.display = 'none';
        }

        function showExpandedView() {
            // Expand textarea to full height
            container.style.height = '100vh';
            uncollapseBtn.style.display = 'none';
            minimizeBtn.style.display = 'block';
            expandBtn.style.display = 'none';
            collapseBtn.style.display = 'none';
            textarea.style.display = 'block';
            footer.style.display = 'flex';
        }

        function showPopup(popupType) {
            bgContainer.style.display = 'block';
            popupContainer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (popupType === 'settings') {
                settingsContainer.style.display = 'block';
                tipsContainer.style.display = 'none';
            } else if (popupType === 'tips') {
                tipsContainer.style.display = 'block';
                settingsContainer.style.display = 'none';
            }
        }

        function closePopup() {
            bgContainer.style.display = 'none';
            popupContainer.style.display = 'none';
            tipsContainer.style.display = 'none';
            settingsContainer.style.display = 'none';
            document.body.style.overflow = '';
        }

        function updateCharCount() {
            const count = 10000 - textarea.value.length;
            charCount.textContent = `${count} characters left`;
            charCount.style.color = count < 0 ? 'red' : 'inherit';
        }

        // Syncing actions
        // ------------------------------------------------------------

        // Sync between floaty and real comment box
        textarea.addEventListener('input', () => {
            commentBox.value = textarea.value;
            updateCharCount();
            saveToLocalStorage(textarea.value);
        });
        commentBox.addEventListener('input', () => {
            if (commentBox.value !== textarea.value) {
                textarea.value = commentBox.value;
                updateCharCount();
                saveToLocalStorage(textarea.value);
            }
        });

        // Check whether there is a saved draft in local storage
        const savedDraft = localStorage.getItem(storyKey);
        if (savedDraft) {
            textarea.value = savedDraft;
            commentBox.value = savedDraft;
            updateCharCount();
        }

        // Automatically save comment draft to local storage
        let save;
        function saveToLocalStorage(value) {
            clearTimeout(save);
            save = setTimeout(() => {
                localStorage.setItem(storyKey, value);
            }, 500); // Saves to localstorage with .5s delay
        }

        // Detect when the comment form is submitted
        const commentForm = document.querySelector('form.new_comment, form.edit_comment');
        if (commentForm) {
            commentForm.addEventListener('submit', () => {
                if (textarea) textarea.value = ''; // Clear floaty box
                localStorage.removeItem(storyKey); // Clear the saved draft
            });
        }

        // Clear local storage draft after being cleared
        setInterval(() => {
            if (textarea.value === '' && commentBox.value === '') {
                localStorage.removeItem(storyKey);
            }
        }, 1000);

        // Unfocus the textarea on touch/scroll outside
        document.addEventListener('touchstart', (e) => {
            if (
                document.activeElement === textarea &&
                !container.contains(e.target)
            ) {
                textarea.blur();
            }
        }, { passive: true });
    }

    function waitForCommentBox() {
        // This script only applies to story pages where you can comment, which we need to check for
        const box = document.querySelector('textarea[name="comment[comment_content]"]');
        if (box) {
            createFloaty(box);
        } else {
            // Observe the document for changes to find the comment box
            const observer = new MutationObserver(() => {
                const found = document.querySelector('textarea[id^="comment_content"]');
                if (found) {
                    observer.disconnect();
                    createFloaty(found);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState !== 'loading') {
        waitForCommentBox();
    } else {
        window.addEventListener('DOMContentLoaded', waitForCommentBox);
    }
})();