// ==UserScript==
// @name         Novelupdates Hiatus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moves novels with more than 50 chapters into active reading list, while chapters with less than 20 available chapters will be moved into haitus.
// @author       Luna
// @match        https://www.novelupdates.com/reading-list/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38271/Novelupdates%20Hiatus.user.js
// @updateURL https://update.greasyfork.org/scripts/38271/Novelupdates%20Hiatus.meta.js
// ==/UserScript==


var volume_conv = 30;
var currentList = document.getElementsByClassName('active')[0].innerText;
var a = document.getElementsByClassName("rl_links");

for (var i = 0; i < a.length; i ++) {
    var readC = convertChapToNumber(a[i].children[2].innerText);
    var latestC = convertChapToNumber(a[i].children[3].innerText);
    var diff = latestC - readC;
    if (currentList.indexOf("Hiatus") >= 0) {
        if (diff > 50) {
            a[i].children[0].children[1].checked=true;
        }
    } else if (currentList.indexOf("Reading") >= 0) {
        if (diff < 20) {
            a[i].children[0].children[1].checked=true;
        }
    }

}

function convertChapToNumber(txt) {
    txt = txt.replace(/ /g, '');
    var tmatch = '';
    if (txt.search(/^c\d+$/) >= 0) {
        tmatch = txt.match(/(\d+)/);
        return tmatch[0];
    } else if (txt.search(/^c\d+-\d+$/) >= 0){
        tmatch = txt.match(/(\d+)/);
        return tmatch[0];
    } else if (txt.search(/^c\d+part\d$/) >= 0){
        tmatch = txt.match(/(\d+)/);
        return tmatch[0];
    } else if (txt.search(/^v\d+c\d+$/) >= 0) {
        tmatch = txt.match(/(\d+)/g);
        return (tmatch[0]-1)*30 + parseInt(tmatch[1]);
    } else if (txt.search(/^v\d+c\d+-\d+$/) >= 0) {
        tmatch = txt.match(/^v(\d+)c(\d+)-\d+/);
        return (tmatch[1]-1)*30 + parseInt(tmatch[2]);
    }
}