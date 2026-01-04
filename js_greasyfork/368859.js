// ==UserScript==
// @name         Chat log
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Dismayed that the Torn chat saves only the 40 most recent chats? No problem, this script saves your chat logs for local download in a jiffy :)
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/368859/Chat%20log.user.js
// @updateURL https://update.greasyfork.org/scripts/368859/Chat%20log.meta.js
// ==/UserScript==

/*
 * LIBRARIES
 */

// :acp - A Class Prefix is a jQuery library for adding a class prefix selector.
$(function(){
    $.expr[":"].acp = function(elem, index, m){
          var regString = '\\b' + m[3];
          var reg = new RegExp(regString, "g");
          return elem.className.match(reg);
    };
});

// Check if current tab is active
var myInterval, hid = "visible";

(function() {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = {
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
            };

        evt = evt || window.event;
        if (evt.type in evtMap) {
            hid = evtMap[evt.type];
        } else {
            hid = this[hidden] ? "hidden" : "visible";
        }

        if(hid == "visible") {
            myInterval = setInterval(chatRead,10000);
        }
        else {
            clearInterval(myInterval);
        }
    }
})();

/*
 * LIBRARIES END
 */

// Cleans set variables.
// Warning: you will lose all chat logs on the use of this function
function chatflush() {
    GM_setValue ("Chats", "{}");
    clearInterval(myInterval);
    location.reload();
}

var dirtyChats = ["Global", "Trade", "Jail", "Hospital", "Traveling", "People", ""];
// Reads the chats and processes them
function chatRead() {
    if(hid == "visible" && $('div:acp("chat-active")').length > 0) {
        try {
            var Chats = GM_getValue ("Chats", "");
            var chatObj;
            if ( ! Chats) {
                GM_setValue ("Chats", "{}");
                chatObj = {};
            }
            else {
                try {
                    chatObj = JSON.parse(Chats);
                } catch(ex) {
                    GM_setValue ("Chats", "{}");
                    chatObj = {};
                }
            }

            $('div:acp("chat-active")').each(function(index) {
                var chatTitle = $( this ).find(':acp("chat-box-title")').attr("title");
                if(dirtyChats.indexOf(chatTitle) < 0 && chatTitle !== "") {
                    var lastChat = "none";
                    if(chatObj.hasOwnProperty(chatTitle)) {
                        var messages = chatObj[chatTitle];
                        lastChat = messages[messages.length - 1];
                    }
                    else {
                        chatObj[chatTitle] = [];
                    }

                    var chatText, chatArray = [];
                    $( this ).find(':acp("overview") > :acp("message")').each(function( jndex ) {
                        chatText = $( this ).text();
                        chatArray.push(chatText);
                        if(chatText == lastChat) {
                            chatArray = [];
                        }
                    });
                    chatObj[chatTitle] = chatObj[chatTitle].concat(chatArray);
                    var chatStr = JSON.stringify(chatObj);
                    //console.info(chatStr);
                    GM_setValue ("Chats", chatStr);
                }
            });
        } catch(ex) {
            console.log(ex);
        }
    }
}

// Check if it is the "chatlog page".
if(window.location.href == "https://www.torn.com/chatlog" || window.location.href == "https://www.torn.com/chatlogs") {
    try {
        $("body").html("Loading chats..");
        var Chats = GM_getValue ("Chats", "");
        var chatObj;
        if ( ! Chats) {
            GM_setValue ("Chats", "{}");
            chatObj = {};
        }
        else if(Chats == "{}") {
            chatObj = {};
        }
        else {
            try {
                chatObj = JSON.parse(Chats);
            } catch(ex) {
                GM_setValue ("Chats", "{}");
                chatObj = {};
            }
        }
        // Generating zip relies on external JS libraries.
        $.when(
            $.getScript( "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js" ),
            $.getScript( "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js" ),
            $.Deferred(function( deferred ){
                $( deferred.resolve );
            })
        ).always(function(){
            var encodedChat, chatFileName, elem = "", chatNames = [];
            var nozip = false;
            try {
                var zipChat = new JSZip();
            } catch(ex) {
                console.info("JS libraries probably need to updated.");
                nozip = true;
            }
            for(var chatName in chatObj) {
                chatNames.push(chatName);
                encodedChat = chatObj[chatName].join("\r\n");
                chatFileName = chatName +".txt";
                elem += '<li><a href="data:text/plain;charset=utf-8,' + encodeURIComponent(encodedChat) +'" download="'+ chatFileName +'">'+ chatName +'</a>  <span>×</span></li>';
                if(!nozip) {
                    zipChat.file(chatFileName, encodedChat);
                }
            }

            GM_addStyle("h1,h6{font-weight:400;line-height:1.1;text-align:center !important}p,ul{margin:0 0 1.4em}body{all:initial;margin:2rem .5rem;background-color:#c4c8cc;color:#404448;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif !important;font-size:16px !important;line-height:1.4rem !important}*,::after,::before{box-sizing:border-box}h1{margin:0 0 1rem;font-size: 32px !important}h6{margin:0 0 1.5rem}ul{padding:0 0 0 1.15em;list-style-type:square}.card{margin:0 auto 2rem;padding:1rem;min-width:10rem;max-width:20rem;background-color:#fff;word-wrap:break-word;box-shadow:0 .0625em .1875em 0 rgba(0,0,0,.1),0 .5em 0 -.25em #f2f2f2,0 .5em .1875em -.25em rgba(0,0,0,.1),0 1em 0 -.5em #e6e6e6,0 1em .1875em -.5em rgba(0,0,0,.1)}.card.card-dark,.card.card-primary{color:#fff}.card.card-primary{cursor:pointer;background-color:tomato;text-shadow:0 .0625em 0 rgba(0,0,0,.25);box-shadow:0 .0625em .1875em 0 rgba(0,0,0,.1),0 .5em 0 -.25em #f25e43,0 .5em .1875em -.25em rgba(0,0,0,.1),0 1em 0 -.5em #e65940,0 1em .1875em -.5em rgba(0,0,0,.1)}.card.card-secondary{background-color:#47e3ff;box-shadow:0 .0625em .1875em 0 rgba(0,0,0,.1),0 .5em 0 -.25em #43d8f2,0 .5em .1875em -.25em rgba(0,0,0,.1),0 1em 0 -.5em #40cce6,0 1em .1875em -.5em rgba(0,0,0,.1)}.card.card-dark{background-color:#404040;box-shadow:0 .0625em .1875em 0 rgba(0,0,0,.1),0 .5em 0 -.25em #3d3d3d,0 .5em .1875em -.25em rgba(0,0,0,.1),0 1em 0 -.5em #3a3a3a,0 1em .1875em -.5em rgba(0,0,0,.1)}.card>:last-child{margin-bottom:0}li:hover{color:#111}li>span{color:#d3d3d3;margin-right:.5rem;float:right}li>span:hover{color:#ed6868;cursor:pointer}a{color:inherit;text-decoration:inherit}");
            $("body").html('<h1>Chat logs</h1><h6>by LordBusiness</h6><div class="card"><p>Click on the name of the chat to download and press the X to delete.</p><p>So, these are your chat logs.</p><ul>'+ elem +'</ul><p id="ziparent">To download all chats as zip, click <u id="zipclick">here</u>.</div><div class="card card-primary"><p>Click here to delete all logs.</p></div><div class="card card-dark"><p>It\'s a good idea to delete your chats every 2-4 weeks. If you don\'t clear your chats, your browser may start to become slow and laggy.</p><p>This script was built by <a href="https://www.torn.com/profiles.php?XID=2052465">LordBusiness</a> and commissioned by <a href="https://www.torn.com/profiles.php?XID=1785428">Td3h</a>.</p></div>');
            document.title = "Chat log";
            $(".card-primary").click(chatflush);
            $("span").one('click', function() {
                var chatdelName = $( this ).parent().children("a").text();
                delete chatObj[chatdelName];
                $( this ).parent().fadeOut();
                var chatStr = JSON.stringify(chatObj);
                //console.info(chatStr);
                GM_setValue ("Chats", chatStr);
            });
            $("#zipclick").css("cursor", "pointer");
            $("#zipclick").one('click', function() {
                if(!nozip) {
                    $("#ziparent").html("Generating...");
                    var currentdate = new Date();
                    var zipName = "Chatlog" + currentdate.getDate() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear() + "" + currentdate.getHours() + currentdate.getMinutes() + ".zip";
                    zipChat.generateAsync({type:"blob"})
                        .then(function(content) {
                        saveAs(content, zipName);
                    });
                    $("#ziparent").fadeOut();
                } else {
                    $("#ziparent").html("Failed.");
                }
            });
        });
    } catch(ex) {
        console.log(ex);
    }
}
else {
    // Reads chats every 10 seconds.
    myInterval = setInterval(chatRead,10000);
}
