// ==UserScript==
// @name         Bonk.io Room hide function
// @namespace    http://tampermonkey.net/
// @version      69
// @description  Adds epic room hider
// @author       Silly One
// @license      MIT
// @match        https://*.bonk.io/*
// @match        https://*.bonkisback.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502383/Bonkio%20Room%20hide%20function.user.js
// @updateURL https://update.greasyfork.org/scripts/502383/Bonkio%20Room%20hide%20function.meta.js
// ==/UserScript==

function filterRooms(s) {
    s = s.toLowerCase();
    let matches = el => el.children[0].textContent.toLowerCase().includes(s);
    $('#roomlisttable tr').each((i, el) => {
        if (s === "") {
            el.hidden = false;
        } else {
            el.hidden = matches(el);
        }
    });
}
const inputBox = document.createElement('input');
inputBox.type = 'text';
inputBox.id = 'roomHideInputBox';
inputBox.placeholder = 'Vanish Rooms..';
inputBox.style.cssText = `
    float: right;
    padding: 2px 8px;
    margin: 5px 20px;
    border: 2px solid #006157;
    border-radius: 5px;
    font: large futurept_b1;
`;
const savedInput = localStorage.getItem('roomFilterInput');
if (savedInput) {
    inputBox.value = savedInput;
}
const topBar = document.getElementById('roomlisttopbar');
if (topBar) {topBar.appendChild(inputBox);}else{return;}

inputBox.addEventListener('keyup', ev => {
    filterRooms(ev.target.value);
    localStorage.setItem('roomFilterInput', ev.target.value);
});
const roomListObserver = new MutationObserver(() => {
    filterRooms(inputBox.value);
});
roomListObserver.observe(document.getElementById('roomlisttable'), {
    childList: true,
    subtree: true,
});
filterRooms(inputBox.value);
