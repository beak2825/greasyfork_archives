// ==UserScript==
// @name           Ma Bimbo Challenge Checker
// @author         tibs
// @description    Coche les bonnes cases
// @include        https://www.ma-bimbo.com/*
// @version        1.0.1
// @namespace      https://greasyfork.org/users/301278
// @downloadURL https://update.greasyfork.org/scripts/382957/Ma%20Bimbo%20Challenge%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/382957/Ma%20Bimbo%20Challenge%20Checker.meta.js
// ==/UserScript==

function checkAll() {
    const myBa = parseInt(document.getElementsByName('ba')[0].innerText.replace(/\s/g,''));

    const table = document.getElementsByTagName('table')[1];
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        const ba = parseInt(rows[i].cells[2].innerText.replace(/\s/g,''));
        if (ba < myBa) {
            rows[i].cells[3].children[0].checked = true;
        }
    }
    document.getElementById('to-challenge-table-content').classList.add('reduce');
    document.getElementById('challenge-all').style.display = 'inline';
}

function addButton() {
    if (!/#?\/modules\/challenge\/#?\/?$/.test(window.location)) {return;}
    const button = document.createElement('input');
    button.setAttribute('type', 'checkbox');
    button.setAttribute('title', 'Cocher intelligemment !');
    button.addEventListener('click', checkAll, false);

    document.getElementsByClassName('challengeTitle')[1].appendChild(button);
}

window.onload = function() {setTimeout(addButton, 1000);};
window.onhashchange = function() {setTimeout(addButton, 1000);};
