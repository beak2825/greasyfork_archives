// ==UserScript==
// @name         Js Data Collector
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Collect the data from Jeevan saathi site
// @author       You
// @match        https://www.jeevansathi.com/profile/viewprofile.php*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/378330/Js%20Data%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/378330/Js%20Data%20Collector.meta.js
// ==/UserScript==

$(document).ready(function() { 
    'use strict';

//    '<li id="DATA" tabindex="1" class="ml27"><a class="disp_b cursp" onclick="javascript:logOutCheck("/help/index",1); return true;">DATA</a></li>';

    var addon_button = document.createElement("a");
    addon_button.setAttribute("class", "disp_b cursp");
//    addon_button.setAttribute("onclick", "javascript:CollectData()")
    addon_button.innerHTML = 'DATA';

    var list_button = document.createElement("li");
//    list_button.setAttribute("id", "DATA");
    list_button.setAttribute("tabindex", "1");
//    list_button.setAttribute("class", "ml27");
    list_button.appendChild(addon_button);

    var top_bar = document.getElementsByClassName("topnavbar listnone fontlig f14 fl pt23")[0];
    top_bar.appendChild(list_button);

    addon_button.onclick = CollectData;

    function CollectData ()
    {
        var ref_no = document.getElementsByClassName("fl fontlig color11 fullwid")[0].textContent;
        var basic = document.getElementsByClassName("pos-rel mt10 color11 fontlig pos-rel textTru")[0].textContent;
        var bir_det = document.getElementsByClassName("bg-white noMultiSelect  mb15 prfwid12 fontlig")[0].textContent;

        console.log("\n");
        console.log(ref_no);
        console.log("\n---------------------");
        console.log(basic);
        console.log("\n---------------------");
        console.log(bir_det);
        console.log("\n---------------------");
    }
});