// ==UserScript==
// @name         Clear Automatic Todos
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Clears any system created todos
// @author       You
// @match        https://my.serviceautopilot.com/TicketDetailList.aspx?Type=Todos
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413248/Clear%20Automatic%20Todos.user.js
// @updateURL https://update.greasyfork.org/scripts/413248/Clear%20Automatic%20Todos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
    docReady(function() {
        // DOM is loaded and ready for manipulation here
        document.getElementById("pageHeader").getElementsByClassName("title-with-buttons")[0].innerHTML += "<div class='title-button-panel'><div id='PageContent_ClearButton' style='display:;'><p class='AddButton'><!-- style='margin: 0 !important;'>--><a id='pageAddButton' href='javascript:void(0)'  border: none;'>Clear Automatic Todos</a></p></div></div>"
        document.getElementById("PageContent_ClearButton").onclick=function() {
            var i=0
            var y=0
            while (document.getElementById("ticketDetailList_detail_"+i)) {
                if(document.getElementById("ticketDetailList_note_"+i).textContent.substring(0, 69) == "*** This is an automatically generated email, please do not reply ***") {
                    completeTicketDetail(document.getElementById("ticketDetailList_detail_"+i));
                    y++
                }
                i++
            }
            alert("Cleared " +y+ " todos");
        }
    });

})();