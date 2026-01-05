// ==UserScript==
// @name         ROBLOX Soundloader
// @namespace    RBLXSNDLDR
// @version      2.1
// @description  Download songs from ROBLOX!
// @author       SFOH
// @match        http://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10285/ROBLOX%20Soundloader.user.js
// @updateURL https://update.greasyfork.org/scripts/10285/ROBLOX%20Soundloader.meta.js
// ==/UserScript==

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
var isFirefox = typeof InstallTrigger !== 'undefined'; //just for robloxian4545 because he uses firefox like a CHUMP

function downloadURI(uri,name) { //allows user to download the asset
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    if(isChrome){
        alert("Warning! If the file doesn't play - it may be an .ogg! Try renaming it if it doesn't work.");
        link.click();
    } else {
        alert("Warning! You will have to press Ctrl+S to save this file! (try chrome?)");
        var event = document.createEvent("MouseEvents"); //stolen as fuck
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    };
};

function createDownloadBtn(pElement,type,uri){ //where pElement is the frame to add the button to
    if(type==="audio"){
        var b = document.createElement("input");
        b.setAttribute("class","downloadButton");
        b.setAttribute("type","image");
		b.setAttribute("src","http://vavvi.com/images/2015/06/a99x0ghdgnfv9ls16rww.png");
        b.setAttribute("style","background-position:0px 0px;display:inline-block;background:url(http://vavvi.com/images/2015/06/ncrr1l5xcu0qbyvwwzye.png) 0px 0px;border:0;margin:0;padding:0;cursor:pointer;color:transparent;position:relative;background-repeat:no-repeat;width:25px;height:25px;left:-25px;top:-25px;z-index:9");
        b.onclick=function(){
            downloadURI(uri,".mp3");
        }
        b.onmouseenter=function(){
            b.setAttribute("style","background-position:-25px 0px;display:inline-block;background:url(http://vavvi.com/images/2015/06/ncrr1l5xcu0qbyvwwzye.png) -25px 0px;border:0;margin:0;padding:0;cursor:pointer;color:transparent;position:relative;background-repeat:no-repeat;width:25px;height:25px;left:-25px;top:-25px;z-index:9")
        }
        b.onmouseleave=function(){
            b.setAttribute("style","background-position:0px 0px;display:inline-block;background:url(http://vavvi.com/images/2015/06/ncrr1l5xcu0qbyvwwzye.png) 0px 0px;border:0;margin:0;padding:0;cursor:pointer;color:transparent;position:relative;background-repeat:no-repeat;width:25px;height:25px;left:-25px;top:-25px;z-index:9")
        }
        pElement.appendChild(b);
    }
}

function assetPuller(){
    var objects = document.getElementsByClassName("MediaPlayerIcon Play");
    for(var i = 0;i < objects.length;i++){
        var playbutton = objects[i];
        var parent = playbutton.parentElement;
        var asseturi = playbutton.getAttribute("data-mediathumb-url");
        createDownloadBtn(parent,"audio",asseturi);
    }
}

function checkForUpdates(){
    if(!document.getElementsByClassName("downloadButton").length>0){
       assetPuller();
    }
}

setInterval(checkForUpdates,500)