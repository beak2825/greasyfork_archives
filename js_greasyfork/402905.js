// ==UserScript==
// @name         BLACK CAMS
// @namespace    .
// @version      1.1.1.1
// @description  BLACK CAM FIX
// @author       Auriel
// @match        https://tinychat.com/*
// @exclude      https://tinychat.com/*?1*
// @exclude      /.*tinychat\.com\/(settings|promote|gifts|subscription|coins|start|privacy\.|terms\.)([#\/].+)?/
// @downloadURL https://update.greasyfork.org/scripts/402905/BLACK%20CAMS.user.js
// @updateURL https://update.greasyfork.org/scripts/402905/BLACK%20CAMS.meta.js
// ==/UserScript==
var blobURL = URL.createObjectURL( new Blob([ '(',

function(){
	onmessage = function(e){
				setTimeout(function(){postMessage('BLACK CAM FIX')}, 500);
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
    setTimeout(function(){worker.postMessage('BLACK CAM FIX')}, 500);
};

worker.postMessage('BLACK CAM FIX');
