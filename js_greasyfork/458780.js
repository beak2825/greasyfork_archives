// ==UserScript==
// @name         Security Web for sploop.io!
// @namespace    https://greasyfork.org/en/users/198860-flarez-gaming
// @version      0.3
// @description  Increase cybersecurity in every way: force HTTPS, filter out bad urls, scams, malware, shock sites, etc.
// @author       sad boy.mp
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js

// @downloadURL https://update.greasyfork.org/scripts/458780/Security%20Web%20for%20sploopio%21.user.js
// @updateURL https://update.greasyfork.org/scripts/458780/Security%20Web%20for%20sploopio%21.meta.js
// ==/UserScript==

//this script contine security and subscribe my chanell im so close to 60 subs sad boy(sploop.io)

if (window.location.protocol != "https:") window.location.protocol = "https:";

var xml;
var arr = ["https://cdn.glitch.com/94b7438a-e136-41db-80b8-a78ea1a6e027%2Fdomain%20list.txt?v=1592968773112"]; //cached blocklist from http://mirror1.malwaredomains.com/files/domains.txt
xml = new XMLHttpRequest(); xml.open("GET", arr[0], true); xml.send();
var resp = xml.responseText.split("\n");
resp.shift();resp.shift();resp.shift();resp.shift();
resp = resp.map((e)=>{return e.slice(2, (e).slice(2, -1).indexOf("	") + 2)});
//resp = resp.concat(["www.google.com"]); was for testing malicious domains

if (resp.includes(location.hostname)) {
    unsafeWindow.onbeforeunload = null;
    window.location = "https://blank.org";
};
