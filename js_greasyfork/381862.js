// ==UserScript==
// @name         TwitchTV Never Autoplay
// @icon         https://www.twitch.tv/favicon.ico
// @namespace    https://github.com/nullannos/
// @version      0.1
// @description  Mainly targets the forced autoplay on the Twitch.tv homepage.
// @author       nullannos
// @match        *://www.twitch.tv/
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/381859-waitforkeyelements-by-brocka/code/WaitForKeyElements%20by%20BrockA.js?version=689364
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381862/TwitchTV%20Never%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/381862/TwitchTV%20Never%20Autoplay.meta.js
// ==/UserScript==

waitForKeyElements ('video[src]', replaceSrc);
waitForKeyElements ('.pl-error', replaceText);

function replaceSrc(){

    $("video").attr("src", "");

}

function replaceText() {

    $(".player-center-content").remove();
    var pcc = document.createElement("div");
    pcc.setAttribute("class","player-center-content");

    var p = document.createElement("p");
    p.textContent = ("Press Play to Watch");

    pcc.appendChild(p);

    $(".pl-error").append(pcc);

}