// ==UserScript==
// @name         Discord Anonymise
// @namespace    YGe7foucg9
// @version      1.0.2
// @description  Makes Discord names anonymous only on your screen (e.g. [2240] Anonymous)
// @author       YGe7foucg9
// @match        *discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396849/Discord%20Anonymise.user.js
// @updateURL https://update.greasyfork.org/scripts/396849/Discord%20Anonymise.meta.js
// ==/UserScript==

(function() {
    'use strict';

var username = document.getElementsByClassName("username-1A8OIy");
var userAvatar = document.getElementsByClassName("avatar-1BDn8e");
var userMention = document.getElementsByClassName("mention wrapper-3WhCwL mention interactive");
var joined = document.getElementsByClassName("content-2M3n_H");
var imgUrl;

function refreshData()
{
for (var i = 0; i < username.length; i++) {
    imgUrl = document.getElementsByClassName("avatar-1BDn8e clickable-1bVtEA")[i].src.split('/').slice(-2)[0].substring(14);
    username[i].textContent = "[" + imgUrl + "] Anonymous";
    userAvatar[i].style.visibility = "hidden";
}
for (var u= 0; u < userMention.length; u++) {
    userMention[u].textContent = "@Anonymous";
}
for (var j= 0; j < joined.length; j++) {
    joined[j].getElementsByClassName("anchor-3Z-8Bb anchorUnderlineOnHover-2ESHQB")[0].textContent = "Anonymous";
    if (joined[j].getElementsByClassName("anchor-3Z-8Bb anchorUnderlineOnHover-2ESHQB").length > 1) {
        joined[j].getElementsByClassName("anchor-3Z-8Bb anchorUnderlineOnHover-2ESHQB")[1].textContent = "Anonymous";
    }
}
    setTimeout(refreshData, 16);
}
refreshData();
})();