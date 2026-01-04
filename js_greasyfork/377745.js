// ==UserScript==
// @name         SteamTV shit remover
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove all useless blocks from steam.tv stream page
// @author       VirusAlex
// @match        https://steam.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377745/SteamTV%20shit%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/377745/SteamTV%20shit%20remover.meta.js
// ==/UserScript==

function removeShit(){
    $( ".chatModalCover" ).remove();
    $( ".BroadcastChatDivider" ).remove();
    $( ".BroadcastChatDiv" ).remove();
    $( ".BroadcastDetailsSection" ).remove();
    $( ".BroadcastTabHeaderContainer" ).remove();
    $( ".ChatTabs" ).remove();
    $("div.BroadcastContainerSectionVideoContainer").removeClass("BroadcastContainerSectionVideoContainer")
    $('div[class^="main_SteamPageHeader_"]').children().eq(4).remove();
    $('div[class^="main_SteamPageHeader_"]').children().eq(2).remove();
    $('div[class^="main_SteamPageHeader_"]').children().eq(1).remove();
    $('div[class^="main_SteamPageHeader_"]').children().eq(0).remove();
    $('div[class^="main_SteamPageHeader_"]').removeAttr('class');
    setTimeout(reloadPage, 600000); //10 minutes
}

function reloadPage(){
    location.reload(true);
}

setTimeout(removeShit, 6000);
