// ==UserScript==
// @name         Shanbay Without Arrow Key
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  use only x & c to traverse the word list!
// @author       BoYanZh
// @match        https://web.shanbay.com/wordsweb/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419538/Shanbay%20Without%20Arrow%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/419538/Shanbay%20Without%20Arrow%20Key.meta.js
// ==/UserScript==

(function () {
    'use strict';
    try {
        document.onkeydown = (event) => {
            let key = event.key;
            if (key == "c" || key == "/") {
                if (document.getElementsByClassName("row").length == 0) {
                    document.dispatchEvent(new KeyboardEvent('keydown', {
                        key: "1",
                    }));
                } else {
                    var elm = document.querySelector("#root > div > div > div > div");
                    elm.childNodes[1].click();
                }
            } else if (key == "x" || key == ".") {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: "2",
                }));
            } else if (key == "z" || key == ",") {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: "9",
                }));
            }
        }
    } catch (e) {
        console.log(e);
    }
})();