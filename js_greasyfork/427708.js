// ==UserScript==
// @name         bbcollab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bot
// @author       Moi
// @match        https://eu.bbcollab.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427708/bbcollab.user.js
// @updateURL https://update.greasyfork.org/scripts/427708/bbcollab.meta.js
// ==/UserScript==

(function() {
    'use strict';
        checkMessage();
        function checkMessage() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://jellycheat.com/bbcollab/get_message.php?remove', true);
            xhr.responseType = 'text';
            xhr.onload = function () {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        if (xhr.responseText != "") {
                            console.log("Nouveau message : " + xhr.responseText);
                            document.getElementsByClassName("ql-editor")[0].getElementsByTagName("p")[0].innerHTML = xhr.responseText;
                            setTimeout(function() {document.getElementsByClassName("chat-input")[0].getElementsByTagName("button")[4].click();}, 200);
                        }
                    }
                }
                setTimeout(checkMessage, 200);
            };
            xhr.send(null);

        }

})();