// ==UserScript==
// @name         Twitch Chat in Jackbox.tv
// @version      1.0
// @description  adds the Twitch Chat in the jackbox games
// @author       Mranth0ny62
// @match        *://*.jackbox.tv/
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @namespace https://greasyfork.org/users/13403
// @downloadURL https://update.greasyfork.org/scripts/11090/Twitch%20Chat%20in%20Jackboxtv.user.js
// @updateURL https://update.greasyfork.org/scripts/11090/Twitch%20Chat%20in%20Jackboxtv.meta.js
// ==/UserScript==


$("head").append (
    '<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/le-frog/jquery-ui.min.css" rel="stylesheet" type="text/css">'
);

$("body").append("<div class='twitchChat'></div>");
$("body").append("<div class='openChat'>></div>");
$(".twitchChat").append("<div class='closeChat'>close the chat</div>");
$(".twitchChat").append("<input class='userInput' type='input' placeholder='streamer username goes here'></input>");
$(".twitchChat").append("<iframe class='chatFrame' src=''>please enter the name of teh streamer in the input box</iframe>");


var gameHeight = $(window).innerHeight();
var chatHeight = (gameHeight - ($(".userInput").outerHeight() + $(".closeChat").outerHeight()))-6;

var css = ".twitchChat {"                  +
    "position: absolute;"                  +
    "top: 0;"                              +
    "left: 0;"                             +
    "z-index: 999;"                        +
    "width: 275px;"                        +
    "height: "+gameHeight+"px;"            +
    "border-right: 1px solid black;"       +
    "}"                                    +
    ".closeChat {"                         +
    "width: 100%;"                         +
    "background-color: #F2F2F2;"           +
    "text-align: center;"                  +
    "padding: 5px 0;"                      +
    "cursor: pointer;"                     +
    "transition: background-color 0.25s;"  +
    "}"                                    +
    ".closeChat:hover {"                   +
    "background-color: #D6D6D6;"           +
    "cursor: pointer;"                     +
    "}"                                    +
    ".userInput {"                         +
    "width: 100%;"                         +
    "border: none;"                        +
    "text-align: center;"                  +
    "}"                                    +
    ".chatFrame {"                         +
    "display: block;"                      +
    "width: 100%;"                         +
    "height: "+chatHeight+"px;"            +
    "border: none;"                        +
    "}"                                    +
    ".openChat {"                          +
    "position: absolute;"                  +
    "display : none;"                      +
    "top: 0;"                              +
    "left: 0;"                             +
    "z-index: 999;"                        +
    "height: "+gameHeight+"px;"            +
    "width: 30px;"                         +
    "background-color: #F2F2F2;"           +
    "opacity: 0;"                          +
    "text-align: center;"                  +
    "line-height: "+gameHeight+"px;"       +
    "font-size: 28px;"                     +
    "transition: background-color 0.25s;"  +
    "}"                                    +
    ".openChat:hover {"                    +
    "background-color: #D6D6D6;"           +
    "cursor: pointer;"                     +
    "}"                                    ;
GM_addStyle(css);


$(".twitchChat").resizable({
    handles: 'e',
    minWidth: 250,
    start: function(event, ui) {
        $('iframe').css('pointer-events','none');
    },
    stop: function(event, ui) {
        $('iframe').css('pointer-events','auto');
    }
});


$(".userInput").keydown(function(e){
    if(e.which == 13) {
        nameInput = $(".userInput").val().toLowerCase();
        $(".chatFrame").attr("src", "http://www.twitch.tv/"+nameInput+"/chat?popup=");
    }
});

$(".closeChat").click(function(){
    $(".twitchChat").animate({
        left: -$(".twitchChat").width()
    }, 600, function() {
        showOpenChat();
        $(".twitchChat").css("display", "none");
    });
});

function showOpenChat() {
    $(".openChat").css("display", "block");
    $(".openChat").animate({
        opacity: "1"
    }, 250);
}

$(".openChat").click(function(){
    $(".openChat").animate({
        opacity: "0"
    }, 250, function() {
        $(".openChat").css("display", "none");
        slideInChat();
    });
});

function slideInChat() {
    $(".twitchChat").css("display", "block");
    $(".twitchChat").animate({
        left: 0
    }, 600);
}