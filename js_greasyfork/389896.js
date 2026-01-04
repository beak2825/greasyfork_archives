// ==UserScript==
// @name         Search engine click helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto click test checkbox for search engine course.
// @match        *://boston.lti.cs.cmu.edu/classes/11-642/HW*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/389896/Search%20engine%20click%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/389896/Search%20engine%20click%20helper.meta.js
// ==/UserScript==
const styles = `
.fixedElement {
background-color: transparent;
position:fixed;
top:0;
right:0;
width:40vw;
z-index:100;
height:100px;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
window.addEventListener('load', function () {
    console.log("loaded");
    const forms = document.querySelectorAll("form");
    for (let f of forms) {
        f.setAttribute('target', '_blank');
    }
    const r = document.querySelectorAll("input[value*='Train']");
    const count = (r.length + 9) / 10;
    const div = document.createElement("div");
    div.classList.add("fixedElement");
    document.body.appendChild(div);
    console.log(count);
    for (let i = 1; i < count; i++) {
        let b = document.createElement("button");
        b.innerText = i;
        b.dataset.i = i;
        div.appendChild(b);
        b.onclick = function () {
            const i = b.dataset.i;
            for (let j = 0; j < r.length; j++) {
                r[j].checked = j >= 10 * (i - 1) && j < 10 * i;
            }
        };
    }
}, false);
