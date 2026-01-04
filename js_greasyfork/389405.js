// ==UserScript==
// @name         Almascript - Reports Interface
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.8.23.1
// @description  Add some buttons
// @author       Ryan Meyers
// @match        https://sges.getalma.com/reports*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389405/Almascript%20-%20Reports%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/389405/Almascript%20-%20Reports%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tabList = document.getElementsByClassName('sc-tabmenu')[0].children[0];
    // tabList.children[2].children[0].innerText = "ssde:students";

    for (var l of ['class','staff','parent','student']){
        var ss = tabList.children[2].cloneNode(true);
        if (document.location.pathname.split('/').pop() != l) {
            ss.classList.remove("pure-menu-selected");
        }
        ss.children[0].innerHTML = "<i class=\"fas fa-table\"></i> "+l;
        ss.children[0].href = "/reports/spreadsheets/"+l;
        tabList.insertBefore(ss, tabList.children[3]);
    }
    tabList.children[2].remove();
    tabList.children[1].remove();

    // Your code here...
})();