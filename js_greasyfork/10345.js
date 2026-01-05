// ==UserScript==
// @name         March of History - New Chat option
// @version      0.10
// @description  This script add some option to March of History's chat
// @author       Gohan89
// @match        http://www.marchofhistory.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/12186
// @downloadURL https://update.greasyfork.org/scripts/10345/March%20of%20History%20-%20New%20Chat%20option.user.js
// @updateURL https://update.greasyfork.org/scripts/10345/March%20of%20History%20-%20New%20Chat%20option.meta.js
// ==/UserScript==

var title = document.title;
var excludedchat=new Array("Public");
var num=0;
function checkForChanges()
{
    var numchat=0;
    $('.chatNouveauMessage').each(function(){
        var name=$(this).children("a").html();
        if(excludedchat.indexOf(name)==-1) numchat++;
    });
    if(num!=numchat){
        $("#numNewChat").children("a").html(numchat);
        num=numchat;
    }
    document.title="("+numchat+") "+title;

    setTimeout(checkForChanges, 500);
}

$(document).ready(function() {
    $(".chatListeOption").before("<li class='chatListeOption chatListeNumber ui-state-default ui-corner-top' role='tab' tabindex='-1' aria-selected='false' id='numNewChat'><a class='chatLienOption ui-tabs-anchor' role='presentation' tabindex='-1'>0</a></li>");
    $("#chat_onglets").css("display","Block").css("width","90%").css("overflow","auto");
    $(".chatListeOption").css("position","absolute").css("right","0px");
    $(".chatListeNumber").css("right","30px");
    checkForChanges();
});