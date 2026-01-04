// ==UserScript==
// @name         9gag frihed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  skru ned for det lort
// @author       Nikolaj Møller
// @match        https://9gag.com/*
// @icon         https://www.google.com/s2/favicons?domain=9gag.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438993/9gag%20frihed.user.js
// @updateURL https://update.greasyfork.org/scripts/438993/9gag%20frihed.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var timer;
     var isChrome = !!window.chrome && !!window.chrome.webstore;

     if(isChrome==true){
        GM_addStyle (".div-slider {opacity: 0;text-align: center;padding-top: 5px;width: 29px;height: 120px;position: absolute;bottom: 50px;right: 24px;cursor: pointer;z-index: 99999;border-radius: 15px;background-color: rgba(0, 0, 0, 0.8);}");
        GM_addStyle(".volume-slider{-webkit-appearance: slider-vertical;width: 30px;height: 160px;position: absolute;top: 12px;right: 0px;cursor: pointer;z-index: 99999;height: 100px;width: 2px;margin: auto 13px;}");
     }

    function addVideoControl(){
        var vids = document.getElementsByTagName('video');
        for( var i = 0; i < vids.length; i++ ){
            var elem = vids.item(i);
            if(!elem.hasAttribute("controls")){
                elem.setAttribute("controls", "");
                elem.volume = 0.5;
                console.log('video controls added');

                //add volume slider to chrome video. Why tf chrome dev removed their dafault slider
                if((elem.parentNode.parentNode.getElementsByClassName('video-post').length>0) && (isChrome == true)){
                    var slider = document.createElement("div");
                    slider.setAttribute("class",'div-slider');

                    slider.innerHTML = '<input id="vol-control" class="volume-slider" type="range" min="0" max="1" step="0.1"></input>';

                    elem.parentNode.insertBefore(slider, elem.parentNode.parentNode.nextSibling);

                    var nSlider = elem.parentNode.parentNode.parentNode.getElementsByTagName('input');
                    nSlider[0].addEventListener("input",setVolume,false);
                    nSlider[0].addEventListener("change",setVolume,false);
                    nSlider[0].elem = elem;
                    nSlider[0].value = elem.volume;


                    elem.slider = nSlider[0];
                    elem.addEventListener("mouseover",sliderIn,false);
                    elem.addEventListener("mouseout",sliderOut,false);

                    nSlider[0].slider = nSlider[0];
                    nSlider[0].addEventListener("mouseover",sliderIn,false);
                    nSlider[0].addEventListener("mouseout",sliderOut,false);
                }
            }
        }
    }

    function sliderIn(evt){
        evt.target.slider.parentNode.style.opacity = 1;
    }

    function sliderOut(evt){
        evt.target.slider.parentNode.style.opacity = 0;
    }

    function setVolume(evt){
        var elem = evt.target.elem;
        elem.volume = evt.target.value;
        elem.muted = false;
    }

    timer = setInterval(addVideoControl, 1000);
})();