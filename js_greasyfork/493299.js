// ==UserScript==
// @name         Handy Stroke Adjuster
// @namespace    Spunkle
// @version      1.0
// @description  Allow easy adjusting of stroke length with the handy
// @author       Spunkle
// @match        https://handyfeeling.com/local-video
// @match        https://faptap.net/*
// @include      http*://*:9999*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=handyfeeling.com
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/493299/Handy%20Stroke%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/493299/Handy%20Stroke%20Adjuster.meta.js
// ==/UserScript==

var connectionKey = null;

var pending = false;

var currentMin = null;
var currentMax = null;

var adjustMin = false; // 0 = Max 1 = Min

function fetchConnectionKey(){
    if(connectionKey != null){
        return -1;
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: location.protocol + '//' + location.host + "/graphql",
        data: '{"operationName":"Configuration","variables":{},"query":"query Configuration {\\n  configuration {\\n' +
              '...ConfigData\\n}\\n}\\n\\nfragment ConfigData on ConfigResult {\\n    interface {\\n    ...ConfigInterfaceData\\n}' +
              '\\n}\\n\\nfragment ConfigInterfaceData on ConfigInterfaceResult {\\n  handyKey\\n}"}',
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response){try{connectionKey = JSON.parse(response.responseText).data.configuration.interface.handyKey;}catch{getConnectionKey(true);} setPendingFalse();}
    });
}

function getConnectionKey(manual = false){
    if(connectionKey != null){
        return connectionKey;
    }

    if(localStorage.getItem('handyStates') != null){ // handyFeeling
        connectionKey = JSON.parse(localStorage.getItem('handyStates'))[0].connectionKey;
        manual = true;
    }else if( localStorage.getItem('handy') != null){ // FapTap
        connectionKey = JSON.parse(localStorage.getItem('handy')).key;
        manual = true;
    }else if(location.href.indexOf(":9999/scenes") != -1){ // Stash
        fetchConnectionKey();
    }
    if(connectionKey == null && manual){
        connectionKey = prompt("Unable to find connection key. Please input it here.");
    }

    return connectionKey;
}

function getCurrentLimits(){
    if(pending){
        return -1;
    }

    if(currentMin == null || currentMax == null){
        pending = true;

        connectionKey = getConnectionKey();
        if(connectionKey == null){
            setTimeout(getCurrentLimits, 500);
            return -1;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.handyfeeling.com/api/handy/v2/slide",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "x-connection-key": connectionKey
            },
            onload: function(response){currentMin = JSON.parse(response.responseText).min; currentMax = JSON.parse(response.responseText).max; setPendingFalse();}
        });
    }
}

function onScroll(event) {
    if(currentMin == null || currentMax == null){
        getCurrentLimits();
        return -1;
    }

    if (event.deltaY >= 0) {
        if(adjustMin){
            currentMin -= 5;
        }else{
            currentMax -= 5;
        }
    }else if (event.deltaY < 0){
        if(adjustMin){
            currentMin += 5;
        }else{
            currentMax += 5;
        }
    }

    if ( currentMin > currentMax ){
        if(adjustMin){
            currentMax = currentMin;
        }else{
            currentMin = currentMax;
        }
    }

    if( currentMax < 0){
        currentMax = 0;
    }else if( currentMax > 100){
        currentMax = 100;
    }

    if( currentMin < 0){
        currentMin = 0;
    }else if( currentMin > 100){
        currentMin = 100;
    }

    setLimits(currentMin, currentMax);
}

function keyDown(event){
    if(event.metaKey){
        adjustMin = true;
    }
}

function keyUp(event){
    adjustMin = false;
}

function hideOverlay(){
    try{
        document.querySelector('#overlay').hidden = "true";
    }catch{
        return "";
    }
}

function createOverlay(text){
    var video;
    if(location.href.indexOf("faptap.net") != -1){
        video = document.querySelector('div.h-full');
    }else if(location.href.indexOf(":9999/scenes") != -1){
        video = document.querySelector("#VideoJsPlayer_html5_api");
    }else{ // Default of handyfeeling
        video = document.querySelector('div[class*=FadeIn');
    }

    if(video){
        video = video.parentNode;
        var overlayElement = document.createElement('div');
        overlayElement.setAttribute('id', 'overlay');
        overlayElement.style = "position: absolute;z-index: 999999999999999;left: 50%;transform: translateX(-50%); font-size: 2.5em; -webkit-text-stroke-width: 2px; -webkit-text-stroke-color: white;";
        overlayElement.innerHTML = "<h2></h2>";
        video.appendChild(overlayElement);
        show(text);
    }else{
        setTimeout(show, 500, text);
    }
}

function show(text){
    var overlay = document.querySelector('#overlay');
    if(!overlay){
        createOverlay(text);
    }else{
        overlay.childNodes[0].innerText = text;
        overlay.removeAttribute("hidden");
        setTimeout(hideOverlay, 1000);
    }
}

function setPendingFalse(){
    pending = false;
}

function setLimits(min, max){
    show(min + " - " + max);
    if(pending){
        return -1;
    }
    pending = true;

    GM_xmlhttpRequest({
        method: "PUT",
        url: "https://www.handyfeeling.com/api/handy/v2/slide",
        data: "{\"min\":" + min + ",\"max\":" + max + "}",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "x-connection-key": getConnectionKey()
        },
        onload: setPendingFalse
    });
}


if(location.href.indexOf("https://handyfeeling.com/local-video" != -1 || location.href.indexOf("https://faptap.net/v/") != -1 || location.href.indexOf(":9999/scenes") != -1)){
    document.addEventListener('wheel', onScroll, false);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    getCurrentLimits();
}