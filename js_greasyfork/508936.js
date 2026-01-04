// ==UserScript==
// @name         Pokemon Sleep Friend Code QR generator
// @namespace    https://github.com/tamutus
// @version      1.0
// @description  Clicking Pokemon Sleep friend codes on FCSwap now generates a QR code that you can scan in Pokemon Sleep.
// @author       Lavra Tamutus
// @match        https://www.fcswap.com/game/pokemon-sleep/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fcswap.com
// @license      GPL-3.0-or-greater
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508936/Pokemon%20Sleep%20Friend%20Code%20QR%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/508936/Pokemon%20Sleep%20Friend%20Code%20QR%20generator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const tds = document.querySelectorAll("td");
    tds.forEach(td => {
        td.onclick = function() {
            document.execCommand("copy");
            var td = this;
            var currentClass = this.className;

            if(!currentClass.includes("generated")){
                var img = document.createElement("img");
                var friendCode = td.innerText.replaceAll("-","");
                console.log(td);
                console.log(friendCode);
                img.src = `https://api.qrserver.com/v1/create-qr-code/?data=94jfutn${friendCode}&size=100x100`;
                img.style.display="block";
                img.style.margin="auto";
                this.appendChild(img);
            }

            this.className = 'copied generated';
            setTimeout(function() {
                td.className = 'generated';
            }, 1500)
            td.style.backgroundColor = "#3dba03";
        }

        td.addEventListener("copy", function(event) {
            event.preventDefault();
            if (event.clipboardData) {
                if(window.getSelection().toString() == "")
                {
                    event.clipboardData.setData("text/plain", td.textContent);
                }
                else
                {
                    event.clipboardData.setData("text/plain", window.getSelection());
                }
                console.log(event.clipboardData.getData("text"))
            }
        });
    });
})();