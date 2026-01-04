// ==UserScript==
// @name         Btn Remove Filled Requests
// @namespace    https://broadcasthe.net/
// @version      1
// @description  Remove Filled Requests in Btn
// @author       crazyssh
// @match        *://broadcasthe.net/requests.php
// @match        *://broadcasthe.net/requests.php?search*
// @match        *://broadcasthe.net/requests.php?page*
// @match        *://broadcasthe.net/requests.php?order*
// @icon         https://broadcasthe.net/favicon.ico
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/513751/Btn%20Remove%20Filled%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/513751/Btn%20Remove%20Filled%20Requests.meta.js
// ==/UserScript==

function watClr(bln) {
    return bln ? 'greenyellow' : 'red';
}

function wRemover(lst, tgl, btn, clicked) {
    btn.style.color = watClr(tgl);
    if (tgl) {
        for (const rwd of lst) {
            rwd.remove();
        }
    } else {
        if (clicked) {
            location.reload();
        }}
}

function stylerA(btn, man) {
    btn.textContent = "Hide Filled";
    btn.style.setProperty('background', 'url(images/pattern.png) repeat scroll 0 0 #1b1b1d', 'important');
    btn.style.border = '1px solid #666';
    btn.style.marginLeft = '6px';
    btn.style.fontSize = '11px';
    btn.style.padding = '2px 3px';
    man.parentNode.insertBefore(btn, man.nextSibling);
}

async function buttonator() {

    const subRows = Array.from(document.querySelectorAll(".rowa, .rowb")).filter(rOw => rOw.cells[4].innerText.trim() !== "No");

    let toggle = await GM.getValue("toggle");

    const bigSearchBar = document.querySelector("input[name='search']:last-of-type");
    const button = document.createElement('button');
    wRemover(subRows, toggle, button, false);
    stylerA(button, bigSearchBar);


    button.addEventListener('mouseover', function() {
        button.style.border = '1px solid #aaa';
    });

    button.addEventListener('mouseout', function() {
        button.style.border = '1px solid #666';
    });

    button.addEventListener('click', async function(event) {
        event.preventDefault();
        toggle = await GM.getValue("toggle");
        await GM.setValue("toggle", !toggle);
        wRemover(subRows, !toggle, button, true);
    });
}

(function() {
    'use strict';
    buttonator()
})();

