// ==UserScript==
// @name         Weekly Activity
// @namespace    Internal use
// @version      0.1
// @description  Keep you session active
// @author       YZ
// @match        http://app1.innovyze.com/releaseadmin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390272/Weekly%20Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/390272/Weekly%20Activity.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        const Http = new XMLHttpRequest();
        const url='http://app1.innovyze.com/releaseadmin/RunTask.asp';
        Http.open("GET", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            console.log(dateTime + ' session extended...')
        }
    }, 60000);
})();