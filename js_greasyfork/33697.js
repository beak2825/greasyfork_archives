// ==UserScript==
// @name         NegaPlus
// @namespace    Edited version of Dualplus by Leone
// @version      0.1
// @description  try to take over the world!
// @author       Leone
// @match        http://dual-agar.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33697/NegaPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/33697/NegaPlus.meta.js
// ==/UserScript==


window.onload = function() {

    $("img.top_image").replaceWith('<img.top_image><a href="https://imgur.com/r6UE5RV"><img src="https://i.imgur.com/r6UE5RV.png" title="source: imgur.com" /></a></img.top_image>');
    $("div#divTeamText").replaceWith('<input type="text" id="team_name" class="form-control" placeholder="㉰" maxlength="10">');
    $("img#preview-img.preview-img").replaceWith('<img class="preview-img" id="preview-img" src="http://agar-network.com/skins/ring.png">');
    $("img#preview-img2.preview-img").replaceWith('<img class="preview-img" id="preview-img2" src="http://agar-network.com/skins/ring.png">');



}