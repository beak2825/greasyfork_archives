// ==UserScript==
// @name         Bonk1 Room search function
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Adds epic room search back
// @author       Das_Unterstrich
// @match        bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415822/Bonk1%20Room%20search%20function.user.js
// @updateURL https://update.greasyfork.org/scripts/415822/Bonk1%20Room%20search%20function.meta.js
// ==/UserScript==

function filterRooms(s) {
    s = s.toLowerCase();
    let matches = el => el.children[0].textContent.toLowerCase().includes(s);
    $('#roomlisttable tr').each((i, el) => {
        el.hidden = !matches(el)
    });
};
inp = `<input type="text" id="roomSearchInputBox" placeholder="Search Rooms.." style="
    float: right;
    padding: 2px 8px;
    margin: 5px 20px;
    border: 2px solid #006157;
    border-radius: 5px;
    font: large futurept_b1;
">`;
$('#roomlisttopbar').append(inp);
$('#roomSearchInputBox').keyup( ev => filterRooms(ev.target.value) );