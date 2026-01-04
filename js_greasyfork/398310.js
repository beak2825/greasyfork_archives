// ==UserScript==
// @name         YouTube Faster Playback Speed Buttons
// @version      0.1
// @license MIT
// @description  Adds faster playback speed buttons to youtube player control bar with remember choice ability.
// @author       Cihan Tuncer
// @match        https://www.youtube.com/*
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/463229
// @downloadURL https://update.greasyfork.org/scripts/398310/YouTube%20Faster%20Playback%20Speed%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/398310/YouTube%20Faster%20Playback%20Speed%20Buttons.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var callCount=0;
var savedBtn=null;

var chnCurrSpeed="x1";

var btns=[];

var x100=makeBtn("x1","1x",1);
var x125=makeBtn("x125","1.25x",1.25);
var x150=makeBtn("x150","1.50x",1.50);
var x175=makeBtn("x175","1.75x",1.75);
var x200=makeBtn("x2","2x",2);

var remBtn= document.createElement("button");

remBtn.className = "ytp-button chn-button";
remBtn.style.top ="-14px";
remBtn.style.width ="12px";
remBtn.style.height ="12px";
remBtn.style.border ="2px solid white";
remBtn.style.borderRadius ="10px";
remBtn.style.opacity =".5";
remBtn.style.marginRight ="12px";
remBtn.style.position= "relative";
remBtn.title="Remember Playback Speed";


waitForTargetElement(

    function(te){

        var menuR=te.querySelector(".ytp-right-controls");

        if (typeof menuR !== 'undefined' && menuR !== null) {
            menuR.prepend(x200);
            menuR.prepend(x175);
            menuR.prepend(x150);
            menuR.prepend(x125);
            menuR.prepend(x100);
            menuR.prepend(remBtn);

            var autoSpeed = localStorage.getItem("chnAutoSpeed");
            var savedSpeed = localStorage.getItem("chnCurrSpeed") || "x1";


            if (autoSpeed==1) {
                savedBtn=document.querySelector("."+savedSpeed);
                savedBtn.click();
                remBtn.style.borderColor="#3ea6ff";
            }

            remBtn.onmouseover = function(){this.style.opacity=1;}
            remBtn.onmouseleave = function(){this.style.opacity=.5;}

            remBtn.onclick = function(){

                var autoSpeed = localStorage.getItem("chnAutoSpeed");

                if(autoSpeed == 1){
                    localStorage.setItem("chnAutoSpeed",0);
                    remBtn.style.borderColor="";
                }
                else{
                    localStorage.setItem("chnAutoSpeed",1);
                    remBtn.style.borderColor="#3ea6ff"
                }

            }

        }

    }

);


function makeBtn(classname,txt,val){

    txt = txt || "1x";
    val = val || 1;

    var btn = document.createElement("button");
    btn.className = "ytp-button chn-button "+classname;
    btn.style.top ="-13px";
    btn.style.width ="auto";
    btn.style.opacity =".5";
    btn.style.marginRight ="5px";
    btn.style.position= "relative";
    btn.innerHTML = txt;

    btns.push(btn);

    btn.onmouseover = function(){this.style.opacity=1;}
    btn.onmouseleave = function(){this.style.opacity=.5;}


    btn.onclick = function(){

       chnCurrSpeed=classname;
       localStorage.setItem("chnCurrSpeed",classname);
       setPlayerSpeed(val);
       resetBtns();
       this.style.fontWeight="800"
       this.style.color="#3ea6ff"
    }

    return btn;
}


function resetBtns(){

    var len = btns.length;

    for(var i=0; i<len; i++){

        btns[i].style.fontWeight="normal";
        btns[i].style.color="";

    }
}


/*
Functions taken from "YouTube custom speeds" script by Tom Saaleba
https://github.com/tomsaleeba
*/


function waitForTargetElement (callback) {
    callCount++;
    var strategies = [
        function ytdWatch() { return document.getElementsByTagName('ytd-watch')[0] },
        function playerContainer() { return document.getElementById('player-container') },
    ];
    var targetElement
    for (var i = 0; i < strategies.length; i++) {
        var currStrategy = strategies[i];
        targetElement = currStrategy();
        if (targetElement) {
            break;
        }
    }
    if (typeof targetElement !== 'undefined' && targetElement !== null) {
        callback(targetElement);
        return;
    }
    var waitMs = Math.max(10 * callCount, 2000);
    setTimeout(function () {
        waitForTargetElement(callback);
    }, waitMs);
}


function setPlayerSpeed(newSpeed) {
    document.getElementsByClassName('html5-main-video')[0].playbackRate = newSpeed;
}