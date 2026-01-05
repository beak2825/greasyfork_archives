// ==UserScript==
// @name         PCO People Changes
// @namespace    PCOPeopleChanges
// @include      https://people.planningcenteronline.*
// @author       Montana Selman
// @description  Enhancements to PCO People
// @version      0.1
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=49342
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/14444/PCO%20People%20Changes.user.js
// @updateURL https://update.greasyfork.org/scripts/14444/PCO%20People%20Changes.meta.js
// ==/UserScript==


/*--- ALL OF PEOPLE ---*/

/*--- LISTS CHANGES ---*/
    waitForKeyElements ("a[href='/lists/new']",addReportsBtn);
    function addReportsBtn (jNode) {jNode.before('<a class="btn btn--primary btn--outline btn--small palm-btn--full btn-item" href="/reports">Reports</a>');}

    waitForKeyElements ("a[data-modal-url='/reports/new']",addListsBtn);
    function addListsBtn (jNode) {jNode.before('<a class="btn btn--primary btn--outline btn--small palm-btn--full btn-item" href="/lists">Lists</a>');}

/*--- SPECIFIC LIST CHANGES ---*/
    waitForKeyElements ("a[title='Print List']",changePrintBtn);
    function changePrintBtn (jNode) {
        jNode.attr("title", "Report Export");
    }

    waitForKeyElements ("form[id='print_list']",changePrintModal);
    function changePrintModal (jNode) {$('h1.modal-title').text('Export to PDF or HTML');}
