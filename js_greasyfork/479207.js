// ==UserScript==
// @name         Sure usage bar graphs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  chart data usage for easy reading on the sure website
// @author       Scott Descombe
// @match        https://usage.sure.co.fk/cgi-bin/usage
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479207/Sure%20usage%20bar%20graphs.user.js
// @updateURL https://update.greasyfork.org/scripts/479207/Sure%20usage%20bar%20graphs.meta.js
// ==/UserScript==

(function() {
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function daysInThisMonth() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    }
    'use strict';

    const progress = document.createElement("div");
    progress.id = "myProgress";
    const bar = document.createElement("div");
    bar.id = "myBar";
    const label = document.createElement("p");
    label.innerHTML = "Percentage used";
    progress.appendChild(bar);
    const monthPassed = document.createElement("div");
    monthPassed.id = "myMonth";
    const days = document.createElement("div");
    days.id = "myDays";
    const label2 = document.createElement("p");
    label2.innerHTML = "Days passed";
    monthPassed.appendChild(days);

    const collection = document.getElementsByClassName("body-11n1");
    let text = collection[0].innerHTML;
    let start = text.indexOf("Used Quota")+11;
    collection[0].appendChild(label);
    collection[0].appendChild(progress);
    collection[0].appendChild(label2);
    collection[0].appendChild(monthPassed);

    let used = Number(text.substr(start,5));
    const date = new Date();
    let daysGone = (date.getDate()/daysInThisMonth())*100;
    let colour = '#04AA6D';
    if(daysGone > used) {
        colour = '#04AA6D';
    } else {
        colour = '#F05A3A';
    }

    addGlobalStyle('#myProgress {width: 100%; background-color: #ddd;} #myBar {width: '+used+'%; height: 30px; background-color: '+colour+';}');
    addGlobalStyle('#myMonth {width: 100%; background-color: #ddd;} #myDays {width: '+daysGone+'%; height: 30px; background-color: '+colour+';}');
})();