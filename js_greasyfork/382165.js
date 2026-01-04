// ==UserScript==
// @name         Look for new One Piece issue
// @namespace    akagami_no_shankusu
// @version      0.1
// @description  new One Piece issue, look for 
// @author       akagami_no_shankusu
// @match        https://orojackson.com/forums/mangaspoilers/?prefix_id=19
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382165/Look%20for%20new%20One%20Piece%20issue.user.js
// @updateURL https://update.greasyfork.org/scripts/382165/Look%20for%20new%20One%20Piece%20issue.meta.js
// ==/UserScript==

window.f = function(){
    if (document.getElementsByClassName("listBlock main")[1].childNodes[1].childNodes[1].childNodes[1].className=="locked"){ // most recent spoilers thread is locked
		window.alert("New issue is up");
    }else{
        setTimeout((window.g = function(){window.location.reload(); window.f()}), 60000); // amount of time (in ms) to wait till trying again
    };
};

window.f();
