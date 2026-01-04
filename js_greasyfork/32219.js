// ==UserScript==
// @name Cubecraft Report Statistics
// @namespace Landviz' scripts
// @grant none
// @match https://www.cubecraft.net/
// @match https://www.cubecraft.net/forums/
// @description Script 1/3 reporting statistics menu
// @version 0.0.1.20170811195651
// @downloadURL https://update.greasyfork.org/scripts/32219/Cubecraft%20Report%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/32219/Cubecraft%20Report%20Statistics.meta.js
// ==/UserScript==

function getCookie(cname) { // A function to eaasily check cookies
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var updateTime = 30; // Time before the report stats try to update again in minutes

var reportsOpen = Number(getCookie('openReports'));

if(reportsOpen > 9) {
    reportsOpen = "9+";
}

if(getCookie('handledReports') != "") {
    var date = new Date();
    var time = date.getTime();
    document.querySelector('.styliumMainSidebar').innerHTML += '<div class="section widget_ForumStats" id="widget_4"><div class="secondaryContent statsList" style="background:#ffffff;"><h3>Reporting Statistics</h3><div class="pairsJustified">    <dl class="discussionCount"><dt>Successful reports:</dt><dd>' + getCookie('handledReports') + '</dd></dl><dl class="messageCount"><dt>Open reports:</dt><dd>' + reportsOpen + '</dd></dl><dl class="mostCount"><dt>Last update:</dt><dd>' + timeConverter(getCookie('updateTime')/1000) + '</dd></dl><dl><dd><a href="https://reports.cubecraft.net/report?refresh" target="_blank" onclick="setTimeout(function(){ location.reload(); }, 3000);">Update now</a></dd></dl></div></div></div>';
    var timeDifference = time - getCookie('updateTime');
    var updateTimeConv = updateTime*60*1000;
    if(timeDifference > updateTimeConv) {
        updateStats();
    }
    setInterval(function() {
        if(!document.hasFocus()) {
            location.reload();
        }
    }, 300000);
} else {
    updateStats();
}

function timeConverter(UNIX_timestamp){ // Unix to normal time
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    if(hour < 10) {
        hour = "0" + hour;
    }
    var min = a.getMinutes();
    if(min < 10) {
        min = "0" + min;
    }
    var sec = a.getSeconds();
    if(sec < 10) {
        sec = "0" + sec;
    }
    var time = hour + ':' + min + ':' + sec + ', ' + month + ' ' + date;
    return time;
}

function updateStats() {
    window.open('https://reports.cubecraft.net/report?refresh', '_blank');
    setTimeout(function(){ location.reload(); }, 3000);
}