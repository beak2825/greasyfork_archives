
// ==UserScript==
// @name         JewelsTCfix
// @namespace  https://greasyfork.org/en/users/443644-julianne-mae
// @version      1.0
// @description  Anti Spam, Anti ghost-cams (a.k.a extra blacked out cam spots;) Enjoy! [[big thanks to JOJO & Pew]] 
// @author       Jewels.710, JoJo, Pew
// @match        https://tinychat.com/*
// @exclude      https://tinychat.com/*?1*
// @exclude      /.*tinychat\.com\/(settings|promote|gifts|subscription|coins|start|privacy\.|terms\.)([#\/].+)?/
// @downloadURL https://update.greasyfork.org/scripts/396306/JewelsTCfix.user.js
// @updateURL https://update.greasyfork.org/scripts/396306/JewelsTCfix.meta.js
// ==/UserScript==


var antiSpamBlobURL = URL.createObjectURL( new Blob([ '(',

function(){
	onmessage = function(e){
				setTimeout(function(){postMessage('antispam')}, 250);
			}
}
.toString(),

')()' ], { type: 'application/javascript' } ) );

var antiSpamWorker = new Worker( antiSpamBlobURL );

antiSpamWorker.onmessage = function(e){
    var webappOuter = document.querySelector("tinychat-webrtc-app");
    var webappElem = webappOuter.shadowRoot;
    var chatlogElem = webappElem.querySelector("tc-chatlog").shadowRoot;
    var chatMessages = chatlogElem.querySelector("#chat-wrapper").querySelector("#chat-position").querySelector("#chat").querySelector("#chat-content").children;
	var itemsToRemove = [];
    for(let item of chatMessages){
        try{
            var chatMessage = item.querySelector(".content").querySelector("tc-message-html").shadowRoot.querySelector("#html");
            if(chatMessage.innerHTML.length > 350 || chatMessage.innerHTML.search("\n\n\n") !== -1 || chatMessage.innerHTML.search("\n(\w)*\n(\w)*\n") !== -1 || chatMessage.innerHTML.search("\r(\w)*\r(\w)*\r") !== -1 || chatMessage.innerHTML.search("loser low iq") !== -1 || chatMessage.innerHTML.search("jUHULZEWAZHUR") !== -1 || chatMessage.innerHTML.search("MATCHINGSOX") !== -1 || chatMessage.innerHTML.search("HOOOOKAYYYYY") !== -1){
                //chatMessage.innerHTML = "--SPAM REMOVED--";
				//itemsToRemove.add(item);
				item.remove();
            }
           }
        catch(e)
        {}
    }
    setTimeout(function(){antiSpamWorker.postMessage('antispam')}, 250);
};

antiSpamWorker.postMessage('');

// ==/UserScript==
var blobURL = URL.createObjectURL( new Blob([ '(',

function(){
	onmessage = function(e){
				setTimeout(function(){postMessage('fuckTc')}, 500);
			}
}
.toString(),

')()' ], { type: 'application/javascript' } ) );

var worker = new Worker( blobURL );

worker.onmessage = function(e){
	try{
        var bodyElem = document.querySelector("body");
        var webappOuter = document.querySelector("tinychat-webrtc-app");
        var webappElem = webappOuter.shadowRoot;
        var videolistElem = webappElem.querySelector("tc-videolist").shadowRoot;
        var camQueryString = ".videos-items:last-child > .js-video";
        var camElems = videolistElem.querySelectorAll(camQueryString);

        camElems.forEach(function(item, index){
            var bluredShit = item.querySelector("tc-video-item").shadowRoot.querySelector(".video").querySelector(".blured");
            if(bluredShit !== null){
                bluredShit.remove();
            }
            item.querySelector("tc-video-item").shadowRoot.querySelector(".video").querySelector("div").querySelector("video").style.filter="none"
            if(item.querySelector("tc-video-item").shadowRoot.querySelector(".video").querySelector("div").querySelector('style') === null){
                var css = '.overlay{z-index:1;}.overlay:hover > .icon-visibility {left: 14px!important; top: 12px!important;}.overlay:hover > .icon-resize {top: 10px!important;}.overlay:hover > .icon-report {right: 12px!important;top: 14px!important;}.overlay:hover > .icon-context {bottom: 7px!important; right: 16px!important;}.overlay:hover > .icon-context {right: 7px!important; right: 14px!important;}.overlay:hover > .icon-volume {left: 14px!important; bottom: 7px!important;}.overlay > .icon-context:focus + .video-context.on-white-scroll{opacity: 100!important;visibility: visible!important;}';
                var style = document.createElement('style');
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                item.querySelector("tc-video-item").shadowRoot.querySelector(".video").querySelector("div").appendChild(style);
            }
        });
    } catch(e){}
    setTimeout(function(){worker.postMessage('TCISGHEY')}, 500);
};

worker.postMessage('LUL');
