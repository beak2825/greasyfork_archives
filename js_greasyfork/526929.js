// ==UserScript==
// @name         Torn OC Slackers Spammer
// @namespace    https://www.torn.com/
// @version      1.9
// @description  Adds mail icons for slackers & working paste icons inside messages
// @author       LOKaa [2834316]
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/messages.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526929/Torn%20OC%20Slackers%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/526929/Torn%20OC%20Slackers%20Spammer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addMailIcons() {
        const slackerList = document.querySelectorAll('#factions > div.category-wrap.OC2-memberViewer.m-top10 > div.cont-gray.OC2-memberTable > ul > li');

        slackerList.forEach(li => {
            const profileLink = li.querySelector('div.OC2-tableCell.OC2-tableMember > a');
            if (!profileLink) return;

            const profileURL = profileLink.getAttribute('href');
            const match = profileURL.match(/XID=(\d+)/);
            if (!match) return;

            const userID = match[1];
            const messageURL = `https://www.torn.com/messages.php#/p=compose&XID=${userID}`;

            const mailIcon = document.createElement('a');
            mailIcon.href = messageURL;
            mailIcon.target = '_blank';
            mailIcon.innerHTML = '📩'; // Mail emoji as an icon
            mailIcon.style.marginLeft = '5px';
            mailIcon.style.fontSize = '14px';
            mailIcon.style.cursor = 'pointer';

            profileLink.parentElement.appendChild(mailIcon);
        });
    }

    function addPasteIcons() {
        const interval = setInterval(() => {
            const container = document.querySelector('#editor-form > div.form-title-input-text.b-top.right');
            if (!container) return;

            // Prevent duplicate icons
            if (document.getElementById('paste-subject-icon') || document.getElementById('paste-message-icon')) {
                clearInterval(interval);
                return;
            }

            // Create "Paste Subject" icon using your specific selector
            const pasteSubjectIcon = document.createElement('span');
            pasteSubjectIcon.id = 'paste-subject-icon';
            pasteSubjectIcon.innerHTML = '📝'; // Notepad emoji
            pasteSubjectIcon.style.marginLeft = '8px';
            pasteSubjectIcon.style.fontSize = '16px';
            pasteSubjectIcon.style.cursor = 'pointer';
            pasteSubjectIcon.title = "Paste Subject";

            pasteSubjectIcon.onclick = function() {
                const subjectInput = document.querySelector('#editor-form > div:nth-child(2) > input');
                if (subjectInput) {
                    subjectInput.value = "**MUST READ** You're not in an OC Team";
                    subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            };

            // Create "Paste Content" icon
            const pasteContentIcon = document.createElement('span');
            pasteContentIcon.id = 'paste-message-icon';
            pasteContentIcon.innerHTML = '📋'; // Clipboard emoji
            pasteContentIcon.style.marginLeft = '8px';
            pasteContentIcon.style.fontSize = '16px';
            pasteContentIcon.style.cursor = 'pointer';
            pasteContentIcon.title = "Paste Content";

            pasteContentIcon.onclick = function() {
                const editor = document.querySelector('#mce_0');
                if (editor) {
                    editor.focus();
                    document.execCommand("insertHTML", false,
                        `Hey, if you have received this newsletter then it means you're currently not in an organized crime team, so please join a team ASAP.<br><br>

                        If you don't know what to do exactly and which team suits you, please read below.<br><br>

                        <b>We now have a cool guide for Organized Crimes 2.0:</b> <a href="/forums.php#p=threads&f=999&t=16445453&b=1&a=29865" i-data="i_583_331_167_20">Please Read it Here</a><br><br>

                        And you can join a team from here: <a href="/factions.php?step=your#/tab=crimes" i-data="i_458_396_143_20">Click Here&nbsp;</a>
<br>
<br>

                        That's all, Thanks!
                    `);
                }
            };

            // Append icons to the container
            container.appendChild(pasteSubjectIcon);
            container.appendChild(pasteContentIcon);

            clearInterval(interval); // Stop checking once icons are added
        }, 500);
    }

    if (window.location.href.includes("factions.php?step=your")) {
        setTimeout(addMailIcons, 2000);
    } else {
        addPasteIcons();
    }
})();
