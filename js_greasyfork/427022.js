// ==UserScript==
// @name         Rainforest Unified Script
// @namespace    http://tampermonkey.net/
// @version      0.44
// @description  Functional RF UI
// @author       Paul Sweeney Jr., Alexis Ramirez S. and PedroSalvarezo
// @match        https://tester.rainforestqa.com/tester/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427022/Rainforest%20Unified%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/427022/Rainforest%20Unified%20Script.meta.js
// ==/UserScript==

(function() {

// ****************  CONFIGURE THE LOCATION AND SIZE OF THE INTERFASE:  ****************//
    var sideColumn = true; // set to false for instruction at TOP (yes/no on bottom)
    var colSize = { instruction: "25%", terminal: "75%" }; // for sideColumn in percent (20% + 80% = 100%)
    var location = { instruction: "right", terminal: "left" }; // set location (left/right)
    var font = { family: "verdana", size: "20px" }; // your preferred font and size
// ***************  CONFIGURE THE FONT COLOR OF THE CLOCK:  ***************//
// ****************         DEFAULT COLOR: BLACK           ****************//
// * change this value to true if you want the clock fonts to be white:    //
    var font_white = false;
//*************************************************************************//

    window.toggleUIState = false;

    var divForButtons = document.createElement('div');
    divForButtons.style.position = "fixed";
    divForButtons.style.zIndex = 1000000;
    divForButtons.style.right = 0;
    divForButtons.style.top = 0;

    var uiButton = document.createElement('button');
    uiButton.innerHTML = "UI";

    var stepsNumberSpan = document.createElement('span');
    stepsNumberSpan.id = "lastStep";
    stepsNumberSpan.style.backgroundColor = "#175617";
    stepsNumberSpan.style.color = "white";

    divForButtons.appendChild(stepsNumberSpan);
    divForButtons.appendChild(uiButton);

    function updateUI(t) {

        var job = document.querySelector('div[class*="assignment_job"]');
        var vm = document.querySelector('div[class*="terminal_mainWrapper"]');
        var instruction = document.querySelector('div[class*="instructions_instructionsWrapper"]');
        var steps = document.querySelector('div[class*="steps_steps"]');


        if (sideColumn) {
          job.style.float = t ? location.instruction : "";
          job.style.width = t ? colSize.instruction : "";

          vm.style.float = t ? location.terminal : "";
          vm.style.width = t ? colSize.terminal : "";

          steps.id = t? "notflex" : "";
        }

        instruction.id = t? "notflex" : "";

        var stepNumbers = document.querySelectorAll('div[class*="steps_stepHolder"] > div');
        var lastNumber = stepNumbers[stepNumbers.length - 1].innerHTML;
        document.querySelector('#lastStep').innerHTML = "Last Step: " + lastNumber;
    }

    function switchUI(e) {
        window.toggleUIState = !window.toggleUIState;
        updateUI(window.toggleUIState);
        toolBar = document.querySelector("div.terminal_toolbar_3Z6dn");
        if (toolBar) {
            StartScript()
        };

    }

    // Startup default layout after 2 seconds
    setTimeout(function() {
        window.toggleUIState = !window.toggleUIState;
        updateUI(window.toggleUIState);
        document.body.appendChild(divForButtons);
    }, 2000);

    uiButton.onclick = switchUI;
    document.body.appendChild(divForButtons);

    var style = document.createElement('style'); // to break-word for url copy
    style.innerHTML = `
      div[class*='instructions_main']{
        word-wrap: break-word;
      }
      span[class*='clickToCopy_holder']{
        word-wrap: break-word; width:100%
        font-family: ${font.family};
        font-size: ${font.size};
      }
      div[class*="instructions_instructionsWrapper"]#notflex {
        display:block;
        font-family: ${font.family};
        font-size: ${font.size};
      }
      div[class*="steps_steps"]#notflex {
        display:block;
        padding-left: 0px;
      }
      div[class*="ReactModal__Content ReactModal__Content--after-open"] {
        resize: both;
        overflow: auto;
      }
      .dots {
        position: absolute;
        background: yellow;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
      }
      .overlay {
        margin: 0px;
        width: 0%;
        height: 100%;
        position: absolute;
        z-index: 2000000;
        right: 0;
        top: 0;
        overflow-x: hidden;
        background: rgba(0, 0, 0, 0.3);
      }
      .Cbtn {
        position: absolute;
        top: 0.5%;
        left: 0.5%;
        font-family: ${font.family};
        font-size: ${font.size};
      }
      .misc_textarea_1yrFf {
        resize: both;
        overflow: auto;
      }
      `;

    document.body.insertBefore(style, document.body.firstChild);

     //Draggable Report

function dragElement(elmnt) {
  var pos1 = null, pos2 = null, pos3 = null, pos4 = null;

  if (document.querySelector('div[class*="reportModal_title_2EiTk"]')) {
    document.querySelector('div[class*="reportModal_title_2EiTk"]').onmousedown = dragMouseDown;
      elmnt.style.bottom = 'auto';
      elmnt.style.right = 'auto';
  } else {
    document.querySelector('small[class*="inlineScreenshot_hint_9kYtM"]').onmousedown = dragMouseDown;
      elmnt.style.bottom = 'initial';
      elmnt.style.right = 'auto';
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.screenY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.screenY;
    pos3 = e.clientX;
    pos4 = e.screenY;
    // set the element's new position:
      if (document.querySelector('div[class*="reportModal_title_2EiTk"]')) {
         elmnt.style.top = (elmnt.offsetTop + pos4 + 300)/2 + "px";
         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      } else if (document.querySelector('small[class*="inlineScreenshot_hint_9kYtM"]')) {
         elmnt.style.top = (elmnt.offsetTop + pos4 - 100)/2 + "px";
         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

    // Clock and CLick history

    var minG = 0; var segG = 0; var minL = 0; var segL = 0; var clickCount = 0; var counterM = 0
    var tim;
    var tbox; var wObserver; var stpwrapper;
    var chronoG; var chronoL; var clickCounter; var clickOverlay; var closeBtn; var dots;
    var page; var instxt; var previnst = ''; var toolBar; var spacer

    function updateChrono(){

      addStuff()

      if(minG == 80) chronoG.style.color = "red";
      segG++; segL++;
      if(segG == 60){
        minG++;
        segG = 0;
      }
      if(segL == 60){
        minL++;
        segL = 0;
      }
        // Pop-ups and Overlays selection and modifications
      if(document.querySelector('div[class*="ReactModal__Content ReactModal__Content--after-open"]')){
        var elment = document.querySelector('div[class*="ReactModal__Content ReactModal__Content--after-open"]')
        var overlay = document.querySelector('div[class*="ReactModal__Overlay ReactModal__Overlay--after-open"]')
        overlay.style.backgroundColor = "rgb(100 100 100 / 0%)"
        elment.style.border = "thick solid #3b3b3b"

        if(document.querySelector('div[class*="reportModal_title_2EiTk"]')){
             var title = document.querySelector('div[class*="reportModal_title_2EiTk"]')
             title.style.backgroundColor = "#199ad9"
        }
        if(document.querySelector('small[class*="inlineScreenshot_hint_9kYtM"]')){
            var title2 = document.querySelector('small[class*="inlineScreenshot_hint_9kYtM"]')
            title2.style.backgroundColor = "#199ad9"
        }
        if (elment.style.left == "10%") {
            elment.style.left = "35%";
        }
        dragElement(elment)
      }
      chronoG.textContent = ' Test: ' + String(minG).padStart(2,'0') + ':' + String(segG).padStart(2,'0');
      chronoL.textContent = ' Step: ' + String(minL).padStart(2,'0') + ':' + String(segL).padStart(2,'0');
      clickCounter.textContent = '🖱️: ' + clickCount;
    }

    function wrapperobs(){
      instxt = stpwrapper.querySelector('#currentStep');
      if(instxt){
        if(instxt.textContent != previnst){
          previnst = instxt.textContent;
          minL = 0;
          segL = 0;
          while (clickCount>0) {
            dots = document.querySelector('div[class*="dots"]');
            dots.remove();
            clickCount = clickCount - 1;
          }
        }
      }
      else chronoG.textContent = "didn't find the currrent step.";
    }

    var openOverlay = function(){
        clickOverlay.style.width = "100%";
    };

    var closeOverlay = function(){
        clickOverlay.style.width = "0%";
    };

    function printMousePos(e) {
        var topLoc = e.pageY - 5;
        var leftLoc = e.pageX - 5;
        clickCount += 1;
        var point = document.createElement('div');
        point.textContent = clickCount;
        point.style.top = topLoc + 'px';
        point.style.left = leftLoc + 'px';
        point.classList.add("dots");
        clickOverlay.appendChild(point);
    }

    var audio = new Audio('https://www.myinstants.com/media/sounds/alarm_clock.mp3');
    var timerCDiv = document.createElement('div');
    var timerC = document.createElement('spam');
    timerCDiv.style.textAlign = "center";
    timerCDiv.style.position = "absolute";
    timerCDiv.style.zIndex= "1999999";
    if(font_white) timerCDiv.style.color = "white";
    timerCDiv.style.right = '23%';

    var minCD = 4
    var segCD = 0
    var din

    function myStopFunction() {
        clearInterval(din);
        segCD = 0
        minCD = 4
        timerC.textContent = '  ' + String(minCD).padStart(2,'0') + ':' + String(segCD).padStart(2,'0');
        playBtn.disabled = false;
    }

    function myStartFunction() {
        din = setInterval(updateCountDown, 1000);
        playBtn.disabled = true;
    }


    function updateCountDown(){
        if ((segCD<=0 && minCD<=0) || (minCD<0)) {
            myStopFunction()
            audio.play()
            return;
        }
        segCD--;
        if(segCD <= 0){
              minCD--;
              segCD = 59;
        }
      timerC.textContent = '  ' + String(minCD).padStart(2,'0') + ':' + String(segCD).padStart(2,'0');
    }

    var plusBtn = document.createElement('button');
    var minusBtn = document.createElement('button');
    var playBtn = document.createElement('button');
    var stopBtn = document.createElement('button');
    playBtn.textContent = "▶";
    stopBtn.textContent = "■";
    minusBtn.textContent = "-";
    plusBtn.textContent = "+";
    playBtn.onclick = myStartFunction;
    stopBtn.onclick = myStopFunction;
    minusBtn.onclick = lessMin;
    plusBtn.onclick = moreMin;

    function moreMin() {
        minCD++;
        timerC.textContent = '  ' + String(minCD).padStart(2,'0') + ':' + String(segCD).padStart(2,'0');
    }

    function lessMin() {
        minCD--;
        timerC.textContent = '  ' + String(minCD).padStart(2,'0') + ':' + String(segCD).padStart(2,'0');
    }



    clickOverlay = document.createElement('div');
    clickOverlay.classList.add("overlay");
    document.body.appendChild(clickOverlay);
    closeBtn = document.createElement('button');
    closeBtn.textContent = "X";
    closeBtn.classList.add("Cbtn");
    closeBtn.addEventListener('click', closeOverlay);
    clickOverlay.appendChild(closeBtn);


    clickCounter = document.createElement('a');
    clickCounter.addEventListener('click', openOverlay);
    tbox = document.createElement('div');
    tbox.id = "tbox";
    chronoG = document.createElement('spam');
    chronoL = document.createElement('spam');
    tbox.style.textAlign = "center";
    tbox.style.position = "absolute";
    tbox.style.zIndex= "1999999";
    if(font_white) tbox.style.color = "white";
    tbox.style.left = '15%';
    spacer = document.createElement('span');
    spacer.textContent = "  ";
    tbox.appendChild(clickCounter);
    tbox.appendChild(spacer);
    tbox.appendChild(chronoG);
    tbox.appendChild(spacer);
    tbox.appendChild(chronoL);


    timerCDiv.appendChild(playBtn);
    timerCDiv.appendChild(stopBtn);
    timerCDiv.appendChild(plusBtn);
    timerCDiv.appendChild(minusBtn);
    timerCDiv.appendChild(spacer);
    timerCDiv.appendChild(timerC);


    function addStuff() {
        toolBar = document.querySelector("div.terminal_toolbar_3Z6dn")
      if (toolBar){
          toolBar.appendChild(tbox);
          toolBar.appendChild(timerCDiv);
                  }
      timerC.textContent = String(minCD).padStart(2,'0') + ':' + String(segCD).padStart(2,'0');
      var vm = document.querySelector('div[class*="terminal_trackingContainer"]');
        if (vm){
            vm.onclick = printMousePos;
            }
    };

    function StartScript(){
      addStuff()
      page = document.querySelector('#page');
        if(page){
          var pobs = new MutationObserver(function(){
            stpwrapper = page.querySelector('#stepHolder');
            if(stpwrapper){
              wrapperobs();
              wObserver = new MutationObserver(wrapperobs);
              wObserver.observe(stpwrapper, {subtree: true, childList: true, characterData: true});
              tim = setInterval(updateChrono, 1000);
              this.disconnect();
            }
          });
          pobs.observe(page, {subtree: true, childList: true});
        }
    };

    StartScript();

})();