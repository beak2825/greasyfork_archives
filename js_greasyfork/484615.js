// ==UserScript==
// @name         ServiceNow - Update Ticket Number
// @version      0.0.5
// @description  Replace the number input field with a link to the current ticket
// @author       Matteo Lecca
// @match        *.service-now.com*/incident.do*
// @match        *.service-now.com*/sc_request.do*
// @match        *.service-now.com*/sc_req_item.do*
// @match        *.service-now.com*/sc_task.do*
// @match        *.service-now.com*/problem.do*
// @match        *.service-now.com*/change_request.do*
// @match        *.service-now.com*/rm_story.do*
// @match        *.service-now.com*/rm_enhancement.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/users/1246673
// @downloadURL https://update.greasyfork.org/scripts/484615/ServiceNow%20-%20Update%20Ticket%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/484615/ServiceNow%20-%20Update%20Ticket%20Number.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tableName = window.location.pathname.match(/\/(\w*)\.do/).pop();

    let elementId = tableName + '.number';

    if(!document.getElementById(elementId)) {
        return;
    }

    if(document.getElementById('sys_readonly.' + elementId)) {
        elementId = 'sys_readonly.' + elementId;
    }

    let numberInput = document.getElementById(elementId);
    let numberLink = document.createElement('a');
    numberLink.innerText = numberInput.value;
    numberLink.title = '[WK - SN] Convert Number in link';
    numberLink.href = '#';
    numberLink.addEventListener('click', () => copyToClipboard('https://' + window.location.hostname + '/nav_to.do?uri=' + tableName + '.do?sys_id=' + g_form.getUniqueValue()));

    numberInput.replaceWith(numberLink);

    let numberCopy = document.createElement('i');
    numberCopy.style.marginLeft = '0.5em';
    numberCopy.className = 'icon-copy';
    numberCopy.title = '[WK - SN] Copy Number';
    numberCopy.addEventListener('click', () => copyToClipboard(numberInput.value));

    numberLink.parentNode.append(numberCopy);
})();