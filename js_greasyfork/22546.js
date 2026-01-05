// ==UserScript==
// @name         Open Calls Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.0.91
// @description  lets users define their own colors for call
// @author       Tuval
// @match        http://c2w16154.itcs.hpicorp.net/HP/real-time-mtr/open/calls.php?queue%5B%5D=carecntr&queue%5B%5D=npi-cc&domain=IICC&subregion%5B%5D=ALL
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/22546/Open%20Calls%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/22546/Open%20Calls%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var rowColor = "";
    var rowCall = "";
    
//Defining the 'createCookie' function to create cookies and save the rowColor
    var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};

//Defining the function to getCookie to retrieve the stored cookie.
function getCookie(name) 
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

    //Defining the 'createClass' function to create new classes on whim
        function createClass(name,rules){
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if(!(style.sheet||{}).insertRule) 
        (style.styleSheet || style.sheet).addRule(name, rules);
    else
        style.sheet.insertRule(name+"{"+rules+"}",0);
}

//Defining the colors
    createClass('.purple',"background-color: #cc33ff");
    createClass('.orange',"background-color: #ff8000");
    createClass('.cyan',"background-color: #33ccff");
    createClass('.green',"background-color: #1aff1a");
    createClass('.yellow',"background-color: #c68c53");
    

//When clicking on any row in the open calls table, give it color according to the previous color.
 $("tr").click(function() {
            if ($(this).hasClass("yellow")) {
                $(this).toggleClass("yellow");
                $(this).toggleClass("purple");
            } else if ($(this).hasClass("purple")) {
                $(this).toggleClass("purple");
                $(this).toggleClass("orange");
            } else if ($(this).hasClass("orange")) {
                $(this).toggleClass("orange");
                $(this).toggleClass("cyan");
            } else if ($(this).hasClass("cyan")) {
                $(this).toggleClass("cyan");
                $(this).toggleClass("green");
            } else if ($(this).hasClass("green")) {
                $(this).toggleClass("green");
            } else {
                $(this).toggleClass("yellow");
            }
            rowColor = $(this).attr("class");
            rowCall = $('td:first',$(this)).text();
            createCookie(rowCall,rowColor);
});
        
//Load cookies on page refresh
        var callID;
        function get_rowColors () {
            $('table tbody tr').each(function() {
            callID = $('td:first-child', this).text();
            rowColor = getCookie(callID);
            $(this).closest("tr").toggleClass(rowColor);
            
            });
        }
        
        $(document).ready(function() {
            get_rowColors();
        });

})();