// ==UserScript==
// @name         Jenkins Local Time
// @namespace    http://[insert namespace]
// @version      0.1
// @description  Jenkins Local Time Formatter
// @license      MIT
// @author       You
// @match        http://[insert your jenkins domain here]/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12904/Jenkins%20Local%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/12904/Jenkins%20Local%20Time.meta.js
// ==/UserScript==

var elements = document.getElementsByClassName('pane build-details');
for(var i = 0; i < elements.length; ++i) {
    var e = elements[i];
    var t = parseInt(e.getAttribute('time'));
    var d = new Date(t);
    
    var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    e.children[0].innerText = d.toLocaleString();
}

var e = document.getElementsByClassName('build-caption page-headline');
if(e.length)
{
    var value = e[0].childNodes[1].nodeValue;
    var matches = new RegExp("([^\(]+\\()([^\)]+)(.*)").exec(value);
    var d = new Date(Date.parse(matches[2] + " UTC"));
    e[0].childNodes[1].nodeValue = matches[1] + d.toLocaleString() + matches[3];
}

var e = document.getElementsBySelector("#footer");
if(e.length == 2)
{
    var span = e[1].children[0];
    var value = span.childNodes[2].nodeValue;
    var matches = new RegExp("([^@]+ @ )([^\n\r]+)(.*)").exec(value);
    var d = new Date(Date.parse(matches[2]));
    span.childNodes[2].nodeValue = matches[1] + d.toLocaleString() + matches[3];   
}

var e = document.getElementsByClassName('page_generated');
if(e.length == 1)
{
    var value = e[0].innerText;
    var matches = new RegExp("(Page generated: )(.*)").exec(value);
    var d = new Date(Date.parse(matches[2] + " UTC"));
    e[0].innerText = matches[1] + d.toLocaleString();
}