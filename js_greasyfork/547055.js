// ==UserScript==
// @name         Neopets - Karla's Grumpy/Wise Old King Autofill
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.1
// @description  Auto fill the joke/wisdom for old kings
// @author       Karla
// @match        *://*.neopets.com/medieval/grumpyking.phtml*
// @match        *://*.neopets.com/medieval/wiseking.phtml*
// @homepage     https://neopointskarla.com
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @downloadURL https://update.greasyfork.org/scripts/547055/Neopets%20-%20Karla%27s%20GrumpyWise%20Old%20King%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/547055/Neopets%20-%20Karla%27s%20GrumpyWise%20Old%20King%20Autofill.meta.js
// ==/UserScript==

const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

async function checkAvatar() {
    const yourAvatars = await fetch("https://www.neopets.com/settings/neoboards/", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,es;q=0.5",
            "cache-control": "no-cache",
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((res) => res.text());
    const parser = new DOMParser();
    const doc = parser.parseFromString(yourAvatars, "text/html");
    const avatars = Array.from(doc.querySelectorAll(".settings-avatars div")).map((el) => el.textContent);
    return avatars.indexOf('Blumaroo Court Jester') > -1;
}

(async function() {
    'use strict';

    // Your code here...
    if (document.querySelector('#qp1') && document.querySelector('#ap1')) { // grumpy
        if (await checkAvatar()) {
            for (let i = 1; i <= 10; i += 1) {
                document.querySelector(`#qp${i}`).selectedIndex = random_in_range(1, document.querySelectorAll(`#qp${i} option`).length - 1);
            }
        } else {
            document.querySelector(`#qp1`).selectedIndex = 3;
            document.querySelector(`#qp2`).selectedIndex = 8;
            document.querySelector(`#qp3`).selectedIndex = 6;
            document.querySelector(`#qp4`).selectedIndex = 1;
            document.querySelector(`#qp5`).selectedIndex = 39;
            document.querySelector(`#qp6`).selectedIndex = 118;
            document.querySelector(`#qp7`).selectedIndex = 1;
            document.querySelector(`#qp8`).selectedIndex = 32;
            document.querySelector(`#qp9`).selectedIndex = 1;
            document.querySelector(`#qp10`).selectedIndex = 143;
        }
        for (let i = 1; i <= 8; i += 1) {
            document.querySelector(`#ap${i}`).selectedIndex = random_in_range(1, document.querySelectorAll(`#ap${i} option`).length - 1);
        }
    } else if (document.querySelector('#qp1')) { // wise
        for (let i = 1; i <= 7; i += 1) {
            document.querySelector(`#qp${i}`).selectedIndex = random_in_range(1, document.querySelectorAll(`#qp${i} option`).length - 1);
        }
    }
})();