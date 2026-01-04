// ==UserScript==
// @name         ServiceNow - Nav Header additional functions
// @version      0.0.6
// @description  Add functions to Nav Header
// @author       Matteo Lecca
// @match        *.service-now.com/*.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/users/1246673
// @downloadURL https://update.greasyfork.org/scripts/486333/ServiceNow%20-%20Nav%20Header%20additional%20functions.user.js
// @updateURL https://update.greasyfork.org/scripts/486333/ServiceNow%20-%20Nav%20Header%20additional%20functions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let navHeader = document.querySelector('.navbar-header');

    if(!navHeader) {
        return;
    }

    if(typeof g_form == 'undefined') {
        return;
    }

    let tableName = window.location.pathname.match(/\/(\w*)\.do/).pop();
    let recordId = g_form.getUniqueValue();
    
    let listButton = document.createElement('a');
    listButton.title = '[WK - SN] Open List';
    listButton.href = '/' + tableName + '_list.do';
    listButton.classList.add('btn', 'btn-icon', 'navbar-btn', 'icon', 'icon-list');

    let versionsButton = document.createElement('a');
    versionsButton.title = '[WK - SN] Open Versions';
    versionsButton.href = '/sys_update_version_list.do?sysparm_query=name=' + tableName + '_' + recordId;
    versionsButton.classList.add('btn', 'btn-icon', 'navbar-btn', 'icon', 'icon-folder');

    let copySysIdButton = document.createElement('a');
    copySysIdButton.title = '[WK - SN] Copy sys_id';
    copySysIdButton.classList.add('btn', 'btn-icon', 'navbar-btn', 'icon', 'icon-new-ticket');
    copySysIdButton.addEventListener('click', () => copyToClipboard(recordId));

    let historyListButton = document.createElement('a');
    historyListButton.title = '[WK - SN] Open History List';
    historyListButton.classList.add('btn', 'btn-icon', 'navbar-btn', 'icon', 'icon-book-open');
    historyListButton.addEventListener('click', () => showHistoryList());
    
    let xmlViewButton = document.createElement('a');
    xmlViewButton.title = '[WK - SN] Open XML View';
    xmlViewButton.classList.add('btn', 'btn-icon', 'navbar-btn', 'icon', 'icon-form');
    xmlViewButton.addEventListener('click', () => xmlView(tableName, recordId));

    navHeader.append(listButton);
    navHeader.append(versionsButton);
    navHeader.append(copySysIdButton);
    navHeader.append(historyListButton);
    navHeader.append(xmlViewButton);

})();