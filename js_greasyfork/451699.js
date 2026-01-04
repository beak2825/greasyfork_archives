// ==UserScript==
// @name         Bunnyfap Redgifs Fix
// @namespace    http://tampermonkey.net/
// @version      2
// @description  it finally fucking works!
// @author       Entinator with hints from Ember
// @match        https://bunnyfap.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451699/Bunnyfap%20Redgifs%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/451699/Bunnyfap%20Redgifs%20Fix.meta.js
// ==/UserScript==

var run = 0;
var runningName = null;
var vidName = null;
var videoObj;

const callback = (mutationList, observer) => {
    if(run == 0){
        run = 1; //console.log("ping");
        setTimeout(() => {swapper();}, 300);
        setTimeout(() => {run = 0; /*console.log("pong");*/}, 500);
    }
};

const observer = new MutationObserver(callback);
observer.observe(document.querySelector('body'), { subtree: true, childList: true, attributes: true, attributeOldValue: true });

function swapper(){
    var Obj1 = document.querySelectorAll("div[class*='v-window-item child']"); //select all elements
    var Obj2;
    for(var i = 0; i < Obj1.length; i++){
        if(!(Obj1[i].outerHTML.includes("display: none"))){ //pick the currently visible
            Obj2 = Obj1[i];
        }
    }

    if(typeof Obj2 !== 'undefined' || Obj2 != null) {
        videoObj = Obj2.querySelectorAll("video[src*='.gfycat.com'], video[src*='.redgifs.com']")[0]; // get video element| Note: some of the gfycat vids seem to work for some reason
        if(typeof videoObj !== 'undefined' || videoObj != null) {
            vidName = videoObj.id.match(/([A-Z])\w+/)[0];
            //console.log("Video Name " + vidName);
            if(runningName != vidName){
                document.querySelectorAll("div[class*='v-window__container']")[0].parentNode.insertAdjacentHTML('afterbegin', "<iframe class='insertedFrame' src='https://redgifs.com/ifr/" + vidName + "' frameborder='0' scrolling='no' allowfullscreen width='100%' height='100%' style='position:absolute; top:0; left:0; display: none;'></iframe>");
                runningName = vidName;
            }
        }else{vidName = null;}
    }
}

window.addEventListener('message', function (e) {
    const data = e.data;
    videoObj.src = data;
});

var intervalIdiframe = window.setInterval(function(){
    if(videoObj && videoObj.duration > 0){
        while(document.getElementsByClassName('insertedFrame')[0]){
            document.getElementsByClassName('insertedFrame')[0].remove();
        }
    }
}, 1000);