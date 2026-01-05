// ==UserScript==
// @name         Windows 10 search workaround
// @namespace    http://onthisphone.tumblr.com
// @version      1.1
// @description  A script that works around the search engine limit for windows 10 start menu searches.
// @author       Jenna G
// @match        https://www.bing.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/11268/Windows%2010%20search%20workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/11268/Windows%2010%20search%20workaround.meta.js
// ==/UserScript==

document.location.href = "https://www.google.se/search?ie=UTF-8&q=" + document.location.href.split("?")[1].split("&")[0].split("=")[1] + "&gws_rd=cr,ssl&ei=E4W2VcKSM8r9ywOg_p-oDA";
//alert(document.location.href.split("?")[1].split("&")[0].split("=")[1]);
