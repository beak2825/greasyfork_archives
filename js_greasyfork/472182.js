// ==UserScript==
// @name         Cascadr slideshow
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  slideshow functionality.
// @author       jerryhopper
// @match        https://cascadr.co/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/472182/Cascadr%20slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/472182/Cascadr%20slideshow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rightButton = "#root > div > div.AppZoom > div.AppZoomMoveContainer.AppZoomMoveContainerRight > div > a > div > div";
    const leftButton = "#root > div > div.AppZoom > div.AppZoomMoveContainer.AppZoomMoveContainerLeft > div > a > div > div";

    window.direction="forward";
    window.interval=3000;

    function clickNext() {
        try {
            document.querySelector(rightButton).click();
        } catch (error) {
            window.direction = "backward"
        }
    }
    function clickPrevious() {
        try {
            document.querySelector(leftButton).click()
        } catch (error) {
            window.direction = "forward"
        }
    }

    function stop() {
        clearInterval(window.myInterval);
    }
    function changeSlide(){
        if (window.direction == "backward"){
            clickPrevious();
        }else{
            clickNext();
        }
    }


    function myTimer() {
        window.myInterval = setInterval(start, window.interval);

    }


    function start(){
        //console.log("start");
        var appzoom = document.getElementsByClassName('AppZoom')
        if(appzoom.length == 0){
            console.log("Stopped direction:"+window.direction);
        }else{
            console.log("Slideshow direction:"+window.direction);
            changeSlide();
        }
    }

    document.addEventListener('click', function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            text = target.textContent || target.innerText;
        if (e.srcElement.className=="ImageImage"){
            console.log("startslideshow?!");
            myTimer();
        }else if(e.srcElement.className=="ActionButton AppZoomMoveRight"){
            //console.log(">");
            window.direction="forward";
        }else if(e.srcElement.className=="ActionButton AppZoomMoveLeft"){
            //console.log("<");
            window.direction="backward";
        }else if (e.target.tagName=="IMG"){
            console.log("stopping interval..");
            stop();
        }else if ((e.target.tagName=="DIV") && (e.srcElement.className!="ActionButtonImage") ){
            console.log(e.srcElement.className);
            console.log("stopping interval..");
            stop();
        }
    }, false);


})();