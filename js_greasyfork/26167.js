// ==UserScript==
// @name         Zoomit like you meanit.
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Try to zoom over the world!
// @author       You
// @match        http*://*/*.jpg
// @match        http*://*/*.jpeg
// @match        http*://*/*.png
// @match        http*://*/*.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26167/Zoomit%20like%20you%20meanit.user.js
// @updateURL https://update.greasyfork.org/scripts/26167/Zoomit%20like%20you%20meanit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zoomMultiplier = 0.1;
    var imageElementList = document.getElementsByTagName('img');
    var wWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    for (var i = 0; i < imageElementList.length; i++) {
        imageElementList[i].pressedDown = false;
        imageElementList[i].isZooming = false;
        imageElementList[i].addEventListener("mousedown", function(event){
            if(event.button === 2){
                this.pressedDown = true;
            }
            else{
                if(event.button === 0 && this.pressedDown){
                    /*var currentHeigthFull = this.heigth;
                    var currentWidthFull = this.width;
                    if ((wHeight - currentHeigthFull) >= (wWidth - currentWidthFull)){
                        var heightProportion = wHeight/currentHeigthFull;
                        this.heigth = currentHeigthFull * heightProportion;
                        this.width = currentWidthFull * heightProportion;
                    }
                    else {
                        var widthProportion = wWidth/currentWidthFull;
                        this.heigth = currentHeigthFull * widthProportion;
                        this.width = currentWidthFull * widthProportion;
                    }*/
                    event.preventDefault();
                    return false;
                }
                if(event.button === 1 && this.pressedDown){
                }
            }
        });
        imageElementList[i].addEventListener("contextmenu", function(event){
            this.pressedDown = false;
            if(this.isZooming){
                this.isZooming = false;
                event.preventDefault();
                return false;
            }
        });
        imageElementList[i].addEventListener("mousewheel", function(event){
            if(this.pressedDown){
                if(event.wheelDelta < 0){
                    var currentHeightIn = this.height;
                    var currentWidthIn = this.width;
                    var newHeightIn = currentHeightIn *= (1.0 + zoomMultiplier);
                    var newWidthIn = currentWidthIn *= (1.0 + zoomMultiplier);
                    this.height = newHeightIn;
                    this.width = newWidthIn;
                    this.isZooming = true;
                    event.preventDefault();
                    return false;
                }
                if(event.wheelDelta > 0){
                    var currentHeightOut = this.height;
                    var currentWidthOut = this.width;
                    var newHeightOut = currentHeightOut *= (1.0 - zoomMultiplier);
                    var newWidthOut = currentWidthOut *= (1.0 - zoomMultiplier);
                    this.height = newHeightOut;
                    this.width = newWidthOut;
                    this.isZooming = true;
                    event.preventDefault();
                    return false;
                }
            }
        });
    }
})();
