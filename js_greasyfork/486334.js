// ==UserScript==
// @name         ServiceNow - Go to Related Lists
// @version      0.0.1
// @description  Button to go directly to related lists
// @author       Matteo Lecca
// @match        *.service-now.com/*.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/users/1246673
// @downloadURL https://update.greasyfork.org/scripts/486334/ServiceNow%20-%20Go%20to%20Related%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/486334/ServiceNow%20-%20Go%20to%20Related%20Lists.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tableName = window.location.pathname.match(/\/(\w*)\.do/).pop();

    let elementId = tableName + '.form_scroll';

    if(!document.getElementById(elementId)) {
        return;
    }

    let relatedListNames = g_form.getRelatedListNames();

    if(relatedListNames.length == 0) {
        return;
    }

    let goToTabsButton = document.createElement('a');
    goToTabsButton.title = '[WK - SN] Go to related lists';
    goToTabsButton.href = '#tabs2_list';
    goToTabsButton.classList.add('btn', 'btn-danger', 'btn-ref', 'icon', 'icon-tab');
    goToTabsButton.style.cssText += 'position: fixed; right: 2em; top: 3.5em';

    document.getElementById(elementId).append(goToTabsButton);

})();