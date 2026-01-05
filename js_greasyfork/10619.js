// ==UserScript==
// @name         Kong Time
// @namespace    http://alphaoverall.com
// @version      0.2
// @description  Keeps track of how much time you've spent on Kong today
// @author       AlphaOverall
// @include        http://www.kongregate.com/*
// @downloadURL https://update.greasyfork.org/scripts/10619/Kong%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/10619/Kong%20Time.meta.js
// ==/UserScript==
var then;
var ref;
function updateTime() {
    try {
        var now = new Date();
        if (Math.floor(((now-ref)/1000)) > 120) { 
            localStorage.setItem("kongRef", new Date());
            localStorage.setItem("kongThen", new Date());
            then = new Date(localStorage.getItem("kongThen"));
        }
        ref = new Date(localStorage.getItem("kongRef"));
        if (then === null) { then = new Date(localStorage.getItem("kongThen"));}
        var timeui = document.getElementById("timeui");
        var diff = now-then;
        var diffHrs = Math.floor((diff % 86400000) / 3600000);
        var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
        timeui.innerHTML = 
            "<h2>Hey, "+active_user.username()+". You've been online for "+diffHrs+"h"+diffMins+"m "+ 
            "<img id=\"resetKongTimeImg\" style=\"width:2%; cursor:pointer;\" onclick='localStorage.setItem(\"kongThen\", new Date()); localStorage.removeItem(\"kongTotal\");' " +
            "src=\"http://icons.iconarchive.com/icons/icons8/windows-8/256/Very-Basic-Refresh-icon.png\"/></h2>";
        localStorage.setItem("kongRef", now);
    }
    catch (ex) { console.log(ex); init();}
}  
function init() {
    try {
        if (localStorage.getItem("kongThen") === null) { localStorage.setItem("kongThen", new Date());}
        then = new Date(localStorage.getItem("kongThen"));
        if (localStorage.getItem("kongRef") === null) { localStorage.setItem("kongRef", new Date());}
        ref = new Date(localStorage.getItem("kongRef"));
        var timeui = document.createElement("div");
        timeui.id = "timeui";
        timeui.className = "sitemessage";
        timeui.innerHTML = "<h2>Hey, "+active_user.username()+"</h2>";
        var global = document.getElementById("global");
        global.appendChild(timeui);
        var go = setInterval(updateTime, 1000);
    } catch (ex) { console.log(ex);}
} init();