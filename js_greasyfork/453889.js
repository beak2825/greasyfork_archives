// ==UserScript==
// @name         Force HKU CSE booking System-badminton
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the HKU! In HKU, the CSE facilities for individuals have 7 days limits. Too lazy to get up in 630 for booking.
// @author       fm
// @match        https://bs.cse.hku.hk/ihpbooking/servlet/IHP_Booking/booking1
// @match        https://bs.cse.hku.hk/ihpbooking/servlet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hku.hk
// @grant        none
// @license      license
// @downloadURL https://update.greasyfork.org/scripts/453889/Force%20HKU%20CSE%20booking%20System-badminton.user.js
// @updateURL https://update.greasyfork.org/scripts/453889/Force%20HKU%20CSE%20booking%20System-badminton.meta.js
// ==/UserScript==

(function() {
    'use strict';
	console.log('Testing');

    //如果是选择界面，强行打开 individual
    var ui_selection = document.querySelector("body > form > table > tbody > tr:nth-child(6) > td:nth-child(1) > b"); //.textContent.includes("Start Time")
    if(ui_selection){
        var newHTML= document.createElement('div');
        newHTML.innerHTML= '<input type="radio" name="user_group" value="I" onclick=getAllowedTime("I")> Force Individual';
        var group_input= document.querySelector("body > form > table > tbody > tr:nth-child(4) > td:nth-child(2)");
        if(group_input){
            group_input.appendChild(newHTML);
        }
    }

    //强行打开所有的A标签，随时book；
    var pos_venue = document.querySelector("body > form:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(1)");
//    if(document.querySelector("body > form:nth-child(3) > input[type=hidden]:nth-child(5)").getAttribute("value")=="Badminton::1"){
//    if(document.querySelector("body > form:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(1)").textConent.includes("Please select a venue")){
//    if(document.querySelector("body > form:nth-child(3) > input[type=hidden]:nth-child(8)").getAttribute("value")=="Badminton::1"){
    if(pos_venue.textContent.includes("Please select a venue")){
    //if(document.querySelector("body > form:nth-child(3) > table").textContent.includes("Badminton")){
        // alert("仅做交流，勿违法");
        var t = document.querySelector("body > table:nth-child(6) > tbody > tr > td:nth-child(2) > table");//:nth-child(2)
        var trs = t.getElementsByTagName("tr");
        var tds = null;
        for (var i=0; i<trs.length; i++)
        {
            tds = trs[i].getElementsByTagName("td");
            for(var n=0; n<tds.length;n++)
            {
                let court = trs[0].getElementsByTagName("td")[n].textContent;
                var ele1 = tds[0].textContent;
                var ele1_0 = ele1.split(" - ")[0];
                if(tds[n].textContent.includes("A")){
//                    tds[n].style.background = 'red';
                    tds[n].innerHTML="";
                    var newlinkA= document.createElement('div');
                    if(ele1_0.length==4) ele1_0 = "0"+ele1_0;
                    newlinkA.innerHTML='<a href ="javascript:bookThisSlot(\''+ele1_0+'\',\''+court+'\','+n+')">A </a>';
                    tds[n].appendChild(newlinkA);
                }
            }
        }
    }

})();