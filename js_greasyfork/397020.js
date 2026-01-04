// ==UserScript==
// @name         Zoom Record Downloader
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  On the zoom record page, after the page finished loading, there will be a "Right Click & Save as" shown on the top of the page. User can download the records.
// @author       Kiwi P
// @match        https://*.zoom.us/rec/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397020/Zoom%20Record%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/397020/Zoom%20Record%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = () =>{
    let url = document.getElementsByTagName('video')[0].getAttribute('src');

    var a = document.createElement('a');
    var div = document.createElement('div');

    a.setAttribute('href',url)

    a.innerText = "Right Click & Save As";

        a.style.color = "red";
        a.style.textAlign = "center";

        div.style.paddingTop = "12px";
        div.style.paddingBottom = "12px";
        div.style.background = "#eee";
        div.style.width = "100%";
        div.style.textAlign = "center";

        div.appendChild(a);

    document.getElementsByTagName('body')[0].insertBefore(div,document.getElementsByTagName('div')[0]);
    }
})();