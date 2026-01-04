// ==UserScript==
// @name         9gag show video control
// @namespace    http://javalatte.xyz 
// @version      1.5.2
// @description  add video controls to 9gag gif and video post. Add volume slider on chrome browser
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @author       Akzn
// @match        https://9gag.com/*
// @downloadURL https://update.greasyfork.org/scripts/37353/9gag%20show%20video%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/37353/9gag%20show%20video%20control.meta.js
// ==/UserScript==

'use strict';
var timer;
var isChrome = !!window.chrome && !!window.chrome.webstore;
var isFirefox = (navigator.userAgent.indexOf("Firefox") != -1)? true : false;

//--- CSS styles
//--- Button autoplay
GM_addStyle (".gmPersistentButton {background: var(--palette-primary);position: fixed;bottom: 1em;right: 1em;z-index: 6666;border-radius: 18px;}.gmPersistentButton button {cursor: pointer;background: var(--palette-primary);color: white;font-size: 14px;font-style: normal;font-weight: 700;line-height: 20px;letter-spacing: 0em;bottom: 1em;right: 1em;z-index: 6666;padding: 1em;border: var(--palette-primary);border-radius: 18px;opacity: 0.8;}.gmPersistentButton:hover, .gmPersistentButton button:hover {background-color: var(--palette-primary-hover);}");

// Slider for chrome
if(isChrome==true){
    GM_addStyle (".div-slider {opacity: 0;text-align: center;padding-top: 5px;width: 29px;height: 120px;position: absolute;bottom: 50px;right: 24px;cursor: pointer;z-index: 99999;border-radius: 15px;background-color: rgba(0, 0, 0, 0.8);}");
    GM_addStyle(".volume-slider{-webkit-appearance: slider-vertical;width: 30px;height: 160px;position: absolute;top: 12px;right: 0px;cursor: pointer;z-index: 99999;height: 100px;width: 2px;margin: auto 13px;}");
 }

//--- Add the button.
$("body").append (
    '<div class="gmPersistentButton">'
  + '<button id="gmAutoplayVideoBtn">Init failed!</button></div>'
);

//--- Define and init the matching control object:
var btnControl  = new PersistentButton (
  "gmAutoplayVideoBtn",        //-- HTML id
  "StopContinueBtn",      //-- Storage label
  ["Autoplay Video : Off", "Autoplay Video : On"],   //-- Text that the button cycles through
  [false, true]           //-- Matching values for the button's states
);

//--- Activate the button click-handler.
$("#gmAutoplayVideoBtn").click ( function () {
    btnControl.SetNextValue ();
    var btnValue    = this.value;
    keepgoing       = btnValue
    
    _handlegmAutoplayVideoBtnClick(keepgoing)
} );

//--- Button object
function PersistentButton (htmlID, setValName, textArry, valueArry) {
  //--- Initialize the button to last stored value or default.
  var buttonValue     = valueArry[0];
  fetchValue ();
  storeValue ();      //-- Store, in case it wasn't already.
  setButtonTextAndVal ();

  //--- DONE with init.  Set click and keyboard listeners externally.

  //***** Public functions:
  this.Reset          = function () {
      buttonValue     = valueArry[0];
      storeValue ();
      setButtonTextAndVal ();
  };

  this.SetNextValue   = function () {
      var numValues   = valueArry.length;
      var valIndex    = 0;

      for (var J = numValues - 1;  J >= 0;  --J) {
          if (buttonValue == valueArry[J]) {
              valIndex    = J;
              break;
          }
      }
      valIndex++;
      if (valIndex >= numValues)
          valIndex    = 0;

      buttonValue     = valueArry[valIndex];

      storeValue ();
      setButtonTextAndVal ();
  };


  //***** Private functions:
  function fetchValue () {
      buttonValue     = GM_getValue (setValName, buttonValue);
  }

  function storeValue () {
      GM_setValue (setValName, buttonValue);
  }

  function setButtonTextAndVal () {
      var buttonText  = "*ERROR!*";

      for (var J = valueArry.length - 1;  J >= 0;  --J) {
          if (buttonValue == valueArry[J]) {
              buttonText  = textArry[J];
              break;
          }
      }

      var theBtn      = document.getElementById (htmlID);
      if (theBtn) {
          theBtn.textContent  = buttonText;
          theBtn.setAttribute ("value", buttonValue);
      }
      else
          alert ('Missing persistent button with ID: ' + htmlID + '!');
  }
}

//--- Video control
function addVideoControl(){
    var vids = document.getElementsByTagName('video');
    for( var i = 0; i < vids.length; i++ ){           
        var elem = vids.item(i);
        elem.setAttribute("preload","none")

        if(!elem.hasAttribute("controls")){
            //--- bind play button
            $(elem).bind('play', function (e) {
                isViewable = isElementXPercentInViewport(e.target,90)
                if (isViewable) {
                    e.target.setAttribute('pause','false')
                }
            });
            $(elem).bind('pause', function (e) {
                e.target.setAttribute('pause','true')
            });

            elem.setAttribute("controls", "");            
            elem.volume = 0.5;

            setVideoPlay(elem)

            // console.log('video controls added');
            
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

        if ($("#gmAutoplayVideoBtn").val() == "false") {
            // to handle 9gag very own autoplay js
            if(elem.getAttribute("pause")=='true'){
                elem.pause();
            } 
        }

        elem.addEventListener("click",handlePauseElem,false)
        if(elem.parentNode.querySelector('.presenting')){
            elem.parentNode.querySelector('.presenting').addEventListener("click",handlePausePlayButton,false)
        }
        if(elem.parentNode.parentNode.querySelector('.video-post')){
            elem.parentNode.parentNode.querySelector('.video-post').addEventListener("click",handlePauseBox,false)
        }

        if(elem.parentNode.parentNode.querySelector('.gif-post')){
            elem.parentNode.parentNode.querySelector('.gif-post').addEventListener("click",handlePauseBox,false)
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

function handlePauseBox(evt){
    var elem = evt.target;
    setVideoPlay(elem.getElementsByTagName('video')[0])
}

function handlePausePlayButton(evt){
    var elem = evt.target;
    setVideoPlay(elem.parentNode.parentNode.getElementsByTagName('video')[0])
}

function handlePauseElem(evt){
    var elem = evt.target;
    setVideoPlay(elem)
}

function setVideoPlay(elem,buttonStorageValue = null){
    if (buttonStorageValue == null) {
        if ($("#gmAutoplayVideoBtn").val() == "true") {
            elem.setAttribute("pause", "false");
        } else {
            if(elem.getAttribute("pause")=='true'){
                elem.setAttribute("pause", "false");
            } else {
                elem.setAttribute("pause", "true");
            }
        }
    } else {
        if (buttonStorageValue == 'false') {
            elem.setAttribute("pause", "true");
            elem.pause()
        } else if(buttonStorageValue == 'true'){
            elem.setAttribute("pause", "false");
            elem.play()
        }
    }
    
}

// TO check viewbility
const isElementXPercentInViewport = function(el, percentVisible) {
    let
      rect = el.getBoundingClientRect(),
      windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  
    return !(
      Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < percentVisible ||
      Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
    )
};

// handle toggle autoplay
function _handlegmAutoplayVideoBtnClick(value){
    var vids = document.getElementsByTagName('video');
    for( var i = 0; i < vids.length; i++ ){           
        var elem = vids.item(i);
        setVideoPlay(elem,value)
    }
    console.log('autoplay : '+value)
}

timer = setInterval(addVideoControl, 300);



