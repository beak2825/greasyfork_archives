// ==UserScript==
// @name         CurseTweaks
// @version      9.0
// @description  Automatically applies the filters set in the Mods search to the mod's 'Download' button. The goal is to make downloads easier, taking the user to all the files compatible with the version of the Game he wants to play.
// @icon         https://www.google.com/s2/favicons?domain=curseforge.com
// @author       Diegiwg
// @exclude      https://www.curseforge.com/*/*/*/download/*
// @exclude      https://www.curseforge.com/*/*/*/files/*
// @match        https://www.curseforge.com/*/*?*
// @match        https://www.curseforge.com/*/*/*/download
// @run-at       document-start
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/45177
// @downloadURL https://update.greasyfork.org/scripts/410040/CurseTweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/410040/CurseTweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

var filterID; var checkURL = window.location.pathname;
var down = checkURL.split('/')[4]; var urlALL = window.location.href; var index = urlALL.split('?')[0];
var game = urlALL.split('/')[3]; var type = urlALL.split('/')[4]; var mod = urlALL.split('/')[5];
	
if (down==='download'){
    function cookieREAD(cookieNAME) { var cname = ' ' + cookieNAME + '='; var cookies = document.cookie; if (cookies.indexOf(cname) == -1) { return filterID; } cookies = cookies.substr(cookies.indexOf(cname), cookies.length); if (cookies.indexOf(';') != -1) { cookies = cookies.substr(0, cookies.indexOf(';')); } cookies = cookies.split('=')[1]; return decodeURI(cookies);}
    window.location.href = ("https://www.curseforge.com/" + game + "/" + type + "/" + mod + "/files/all?filter-game-version=" + cookieREAD('curseFilter'));
};

setTimeout(function() {
    filterID = urlALL.split('=')[1];
    var data = new Date(9999,1,2);
    var finalDATA = data.toGMTString();
    document.cookie = 'curseFilter='+ filterID + '; expires=' + finalDATA + '; path=/';
}, (1 * 3000));

})();
