// ==UserScript==
// @name         Roarer Glass
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  Give Roarer Glass UI
// @author       JoshAtticus
// @match        https://mybearworld.github.io/roarer/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485804/Roarer%20Glass.user.js
// @updateURL https://update.greasyfork.org/scripts/485804/Roarer%20Glass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const mainOpacity = 0.3; // Adjust the main opacity value from 0.0 to 1
    const blur = '10px'; // Adjust the blur value as per your preference
    const backgroundImage = 'https://i.ibb.co/s2JWJnR/Dark.png'; // Adjust the background image URL

    const repliesOpacity = mainOpacity + 0.1; // Opacity for replies div DO NOT EDIT
    const emojiPickerOpacity = mainOpacity - mainOpacity; // Opacity for emoji picker div DO NOT EDIT

    const style = document.createElement('style');
    style.innerHTML = `
        body {
            background-image: url('${backgroundImage}');
            background-repeat: no-repeat;
            background-size: cover;
            background-attachment: fixed;
            overflow: visible !important;
        }

        .group.flex.rounded-xl.bg-accent.text-accent-text.flex-col.px-2.py-1, /* Posts & Inbox Messages */
        button.rounded-xl.bg-accent.px-2.py-1.text-accent-text, /* Send, Create Group and a few other buttons */
        #radix-1, /* Emoji Picker */

        a.block.w-full.rounded-xl.bg-accent.px-2.py-1.text-left.text-accent-text, /* Groups */
        a.flex.items-center.rounded-xl.bg-accent.px-2.py-1.text-accent-text, /* Groups Buttons */
        div.flex.w-full.items-center.gap-2.rounded-xl.bg-accent.px-2.py-1.text-accent-text, /* Groups Members list */

        button.flex.items-center.rounded-xl.bg-accent.px-2.py-1.text-accent-text, /* Emoji Picker button */

        textarea.w-full.resize-none.rounded-lg.border-2.border-accent.bg-transparent.px-2.py-1, /* Home & Groups post content text box */
        input.w-full.rounded-lg.border-2.border-accent.bg-transparent.px-2.py-1, /* All other text boxes */

        select.rounded-xl.bg-accent.px-2.py-1.text-accent-text, /* Settings Language Selector */
        button.rounded-xl.bg-accent.p-2.aria-selected\\:border-2.aria-selected\\:border-green-500, /* Settings PFP backgrounds */

        button.w-full.rounded-xl.bg-accent.py-1.text-accent-text, /* Long buttons */

        li.ToastRoot.flex.gap-2.rounded-xl.bg-slate-800.px-2.py-1.text-accent-text.shadow-lg /* DM Notifications */{
            background-color: rgba(0, 0, 0, ${mainOpacity});
            backdrop-filter: blur(${blur});
            border: none;
            box-shadow: none;
        }

        div.group.flex.rounded-xl.bg-accent.text-accent-text.gap-2.border-none.italic.text-text.opacity-40 /* Replies */ {
            background-color: rgba(0, 0, 0, ${repliesOpacity});
        }

        emoji-picker {
          --background: rgba(0, 0, 0, ${emojiPickerOpacity});
          --backdrop-filter: blur(${blur});
          --border: none;
          --box-shadow: none;
        }
    `;
    document.head.appendChild(style);
})();
