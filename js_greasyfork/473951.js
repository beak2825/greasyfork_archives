// ==UserScript==
// @name         Content Editor
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Press CTRL + SHIFT + E to enable editing mode, this will allow you to edit any text of a website. Press CTRL + SHIFT + E again to turn it off.
// @author       Aadoxide
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/Aadoxide/pecnol/main/pencil.gif
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473951/Content%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/473951/Content%20Editor.meta.js
// ==/UserScript==

// i made this for my timepass just so you know.

(function() {
    'use strict';

    var notification = true; // optional
    let contentEditingEnabled = false;

    if (notification) {
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.shiftKey && event.key === 'E') { // you can change the keybind if you want 👍
                event.preventDefault();
                contentEditingEnabled = !contentEditingEnabled;
                document.body.contentEditable = contentEditingEnabled;
                showNotification(`Editing Mode ${contentEditingEnabled ? 'Enabled' : 'Disabled'}`);
            }
        });
    }

    function showNotification(message) {
        const notificationElement = document.createElement('div');
        notificationElement.textContent = message;
        notificationElement.style.position = 'fixed';
        notificationElement.style.top = '10px';
        notificationElement.style.right = '10px';
        notificationElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notificationElement.style.color = 'white';
        notificationElement.style.padding = '10px';
        notificationElement.style.borderRadius = '5px';
        notificationElement.style.zIndex = '9999';

        document.body.appendChild(notificationElement);

        setTimeout(() => {
            document.body.removeChild(notificationElement);
        }, 2000); // duration of the notification (2 seconds)
    }
})();