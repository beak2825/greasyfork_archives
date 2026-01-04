// ==UserScript==
// @name         Discord - Idle Champions #combinations Chest-Code-Copy
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Copy-Link for the Chest-Code in the official Idle Champions discord channel #combinations
// @author       Verjigorm
// @match        *://discord.com/channels/*
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/438987/Discord%20-%20Idle%20Champions%20combinations%20Chest-Code-Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/438987/Discord%20-%20Idle%20Champions%20combinations%20Chest-Code-Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const channelUrl = "https://discord.com/channels/357247482247380994/358044869685673985";
    const timeout = 1000;

    function check() {
        setTimeout(check, timeout);

        //check url, @match does not work correctly when you switch channels
        if ( location.href !== channelUrl ) {
            return;
        }

        document.querySelectorAll('ol li div.markup-eYLPri.messageContent-2t3eCI').forEach(async function doIt(element) {
            let messageID = element.id;
            if (await GM.getValue(messageID)){
                return;
            }

            let id = 'copy_' + messageID;

            if(!document.querySelector('#' + id) && !element.parentNode.className.startsWith('threadMessageAccessoryPreview')) {
                let codeToCopy = element.textContent.split('\n')[0]
                if(codeToCopy && codeToCopy.length >= 12 && codeToCopy.length <= 20) {
                    let btn = document.createElement("button");
                    btn.setAttribute('id', id);
                    btn.textContent = "Copy Code to Clipboard";
                    btn.onclick = () => {
                        navigator.clipboard.writeText(codeToCopy);
                        GM.setValue(messageID, messageID);
                        btn.nextSibling.remove();
                        btn.remove();

                        //give a like
                        document.querySelector('#' + messageID.replace('content', 'reactions') + ' div.reactionInner-9eVHJa').click();

                        return false;
                    };

                    element.prepend(btn); //add button

                    btn.after(document.createElement("br")); //add a simple line break
                }
            }

        });
    };

    check();

})();