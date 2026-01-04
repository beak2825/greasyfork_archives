// ==UserScript==
// @name         自動簡轉繁
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/397201/%E8%87%AA%E5%8B%95%E7%B0%A1%E8%BD%89%E7%B9%81.user.js
// @updateURL https://update.greasyfork.org/scripts/397201/%E8%87%AA%E5%8B%95%E7%B0%A1%E8%BD%89%E7%B9%81.meta.js
// ==/UserScript==

function sc2tc() {
    function init() {
        document.getElementById("StranLink").style="display:none;";
        job = setInterval(StranBody, 1000);
    }
    var remoteScript = document.createElement('script');
    remoteScript.src = 'https://admin-ll55.github.io/sc2tc/locale.simplified.min.js?ts='+(+new Date());
    remoteScript.onload = init;
    document.body.appendChild(remoteScript);
}
function add2matchlist () {
    if (domain_list.indexOf(domain) == -1) {
        domain_list.push(domain);
        GM_setValue("domain_list", JSON.stringify(domain_list));
        sc2tc();
        console.log(JSON.parse(GM_getValue("domain_list")))
    }
}
function removefrommatchlist () {
    var index = domain_list.indexOf(domain);
    if (index != -1) {
        domain_list.splice(index, 1);
        GM_setValue("domain_list", JSON.stringify(domain_list));
        clearInterval(job);
        document.querySelector("a[name='StranLink']").remove();
        console.log(JSON.parse(GM_getValue("domain_list")))
    }
}
var domain = window.location.href.match(/\/\/(.*?)\//)[1];
var domain_list = GM_getValue("domain_list");
if (domain_list) {
    domain_list = JSON.parse(domain_list);
}
else {
    domain_list = [];
}
console.log(domain_list);
GM_registerMenuCommand ("Add "+domain+" to match list", add2matchlist, "A");
GM_registerMenuCommand ("Remove "+domain+" from match list", removefrommatchlist, "R");

var job;
if (domain_list.indexOf(domain) != -1) {
    sc2tc();
}
