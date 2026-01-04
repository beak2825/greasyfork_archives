// ==UserScript==
// @name        FootPrints.counter
// @version     1.0
// @include     https://support.iit.edu/*
// @namespace https://greasyfork.org/users/932694
// @description counter
// @downloadURL https://update.greasyfork.org/scripts/447473/FootPrintscounter.user.js
// @updateURL https://update.greasyfork.org/scripts/447473/FootPrintscounter.meta.js
// ==/UserScript==

//testing the push

(function() {
    'use strict';
    var intervalID = window.setInterval(
        refreshNewTickets,
        30000
    );

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    function isNewTicketsTab(){
        // get the selected tab element
        var tabSelector = document.querySelector(
            ".x-tab" +
            ".x-box-item" +
            ".x-tab-context" +
            ".x-tab-active"
        );
        return (
            tabSelector.text == "New Tickets Close Tab"
        )
    }

    function clickRefresh(){
        // get the refresh button element and
        // simulate click on it
        document.querySelector(
            ".x-btn-icon-el" +
            ".x-btn-icon-el-default-toolbar-small" +
            ".x-tbar-loading"
        ).click();
    }

    function UpdateTitleCount(count){
        // add the count to the title
        var title = document.title;
        if(hasWhiteSpace(document.title)){
            title = document.title.split(" ")[1]
        }
        document.title = count + " " + title;
    }

    function GetTicketCount(){
        // get the elements with class name
        const elements = document.querySelectorAll(
            '.x-grid-item-container'
        );
        var count = 0;
        // get the number of children from the 2nd element
        // find the number of child elements to it
        // FYI: 0th index is global tickets and 1st index is followups
        if (Array.from(elements).length > 2){
            count = Array.from(
                elements
            )[2].childElementCount;
        }
        return count;
    }

    function refreshNewTickets() {
        if(isNewTicketsTab()){
            clickRefresh();
            console.log("Refreshed");
            var count = GetTicketCount();
            UpdateTitleCount(count);
        }
    }

})();