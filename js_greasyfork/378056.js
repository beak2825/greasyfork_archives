// ==UserScript==
// @name         Steam Group Mod
// @namespace    http://fl0x.xyz
// @version      1.1
// @description  Steam Group Auto Moderator!
// @author       fl0x
// @match        https://steamcommunity.com/groups/*/membersManage/*
// @run-at       document-idle
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/378056/Steam%20Group%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/378056/Steam%20Group%20Mod.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

window.confirm = function (e) {return true;};

var buttons = $('img[onclick^="ManageMembers_ToggleRank"]');
var url = window.location.href;
var pageNum = Number(url.split('=')[1]);

for(var i = 0; i <= buttons.length; i++) {
    buttons[i].click();
    setTimeout(() => {
        window.location.href = url.split('=')[0] + "=" + Number(pageNum + 1);
    }, 37000);
}