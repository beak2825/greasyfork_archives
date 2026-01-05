// ==UserScript==
// @name        Wikipedia what redirects here
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @description Instead of just the "what links here" link, also include the one to the external tool that shows just redirects
// @include     http*://*wikipedia.org/wiki/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11696/Wikipedia%20what%20redirects%20here.user.js
// @updateURL https://update.greasyfork.org/scripts/11696/Wikipedia%20what%20redirects%20here.meta.js
// ==/UserScript==

var wlh = document.getElementById("t-whatlinkshere");
var page = document.getElementById("ca-nstab-main");
    page = page.children[0].children[0].getAttribute("href");
    page = page.substr(6);
var newTool = document.createElement("li");
    newTool.id = "t-whatredirectshere";
    newTool.innerHTML = '<a title="List of all links that redirect to this page" href="http://69.142.160.183/~dispenser/cgi-bin/rdcheck.py?page=' + page + '">What redirects here</a>';
wlh.parentNode.insertBefore(newTool, wlh);