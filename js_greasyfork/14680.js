// ==UserScript==
// @name         Vulcun Loot Drop Bot
// @namespace    steamcommunity.com/id/49988/
// @version      3.0 Release
// @description  A simple bot made to AFK on Vulcun.com and still get items. Feel free to contribute.
// @author       Axolot
// @match        https://vulcun.com/user/lobby*
// @include      https://www.vulcun.com/user/lobby*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14680/Vulcun%20Loot%20Drop%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/14680/Vulcun%20Loot%20Drop%20Bot.meta.js
// ==/UserScript==

var botStatus = "0";
var intervalTimer;

var div = document.getElementById('v-navbar-collapse');
var chat = document.getElementById("chat");


var vidThumb = document.getElementsByTagName("div");
var navBarInstance = $('.navbar-left');
var favicon = $('link[rel="shortcut icon"]');

navBarInstance.append('<li><a href="#" class="header__item vu-load-page active" id="enterDrop" style="outline:none">Start Bot</a></li>');
navBarInstance.append('<li><a href="#" class="header__item vu-load-page active" id="removeChat" style="outline:none">Hide Chat</a></li>');
navBarInstance.append('<li><a href="#" class="header__item vu-load-page active" id="removeStream" style="outline:none">Hide Stream</a></li>');
navBarInstance.append('<li><a href="#" class="header__item vu-load-page active" id="donate" style="outline:none">Donate Skins</a></li>');


for (var k = 0; k < vidThumb.length; k++) {
    if (vidThumb[k].className == 'video-thumbnail-con hidden-xs hidden-sm') {
        vidThumb[k].parentNode.removeChild(vidThumb[k]);
    }
}

function enterContest() {
    $('#enter-lootdrop').each(function() {
        if($(this).attr('disabled') == 'disabled') {
            return;
        }
        this.click();
    });
}

$('#enterDrop').click(function(){ 
    if(botStatus == "0"){

        $("#enterDrop").text("Stop Bot");
        $("#enterDrop").css("color", "red");
        favicon.attr("href","https://i.imgur.com/eReTOTb.png");
        intervalTimer = setInterval(enterContest,25000);

        //Bot turned on : Alert user 
        //alert("Loot Bot ENABLED for " + streamTitle.innerHTML );
        document.title = $('#vu-current-channel-name').text();
        botStatus = "1";
    } 

    else if(botStatus == "1") {
        clearInterval(intervalTimer);
        $("#enterDrop").text("Start Bot");
        $("#enterDrop").css("color", "green");
        favicon.attr("href", "https://i.imgur.com/g9hW5rV.png");

        //Bot tuned off : Alert user
        //alert("Loot Bot DISABLED for " + streamTitle.innerHTML );
        botStatus = "0";
    }


});

$('#removeChat').click(function(){  
    chat.parentNode.removeChild(chat);
});

$('#removeStream').click(function(){  

    //stream.parentNode.removeChild(stream); -- Doesn't work on firefox (?)
    //stream.remove(); -- Doesn't work on firefox (?)

    document.getElementById("channel-player-container").remove();


    var betHead = document.getElementsByTagName("ul");
    var betBody = document.getElementsByTagName("div");

    for (var i = 0; i < betHead.length; i++) {
        if (betHead[i].className == 'nav nav-tabs live-panel__menu') {
            betHead[i].parentNode.removeChild(betHead[i]);
        }
    }

    for (var j = 0; j < betBody.length; j++ ) {
        if (betBody[j].className == 'live-panel__alerts') {
            betBody[j].parentNode.removeChild(betBody[j]);
        }
    }
});

$('#donate').click(function() {
    window.open("https://steamcommunity.com/tradeoffer/new/?partner=203555095&token=zQ366Ot4");
});