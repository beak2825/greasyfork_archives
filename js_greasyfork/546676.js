// ==UserScript==
// @name        Bigger increments for cropping images
// @namespace   Violentmonkey Scripts
// @match       https://rateyourmusic.com/admin/imaq/crop*
// @grant       none
// @license     MIT
// @version     1.2
// @author      AnotherBubblebath
// @description Do you hate having to click hundreds of times just to crop a single image?
// @downloadURL https://update.greasyfork.org/scripts/546676/Bigger%20increments%20for%20cropping%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/546676/Bigger%20increments%20for%20cropping%20images.meta.js
// ==/UserScript==

var topBar = document.querySelectorAll('#controlbara > input');
var bottomBar = document.querySelectorAll('#controlbarb > input');

const backgroundObserver = new MutationObserver(background => {
  if (document.querySelector("#body").style.backgroundColor == 'black'){
    document.querySelector('#controlbara').style.color = 'white';
    document.querySelector('#controlbarb').style.color = 'white';
  }
  else{
    document.querySelector('#controlbara').style.color = 'black';
    document.querySelector('#controlbarb').style.color = 'black';
  }
});

backgroundObserver.observe(document.querySelector("#body"), { childList: true, attributes: true});
document.querySelector("#body").style.backgroundColor = 'black';

function setTrimLeft(){

  var trimFiftyLeft = document.createElement('input');
  trimFiftyLeft.value = '-50';
  setInputFunctionality(trimFiftyLeft, 50, 'left', 0);

  var trimTenLeft = document.createElement('input');
  trimTenLeft.value = '-10';
  setInputFunctionality(trimTenLeft, 10, 'left', 0);

  var addFiftyLeft = document.createElement('input');
  addFiftyLeft.value = '+50';
  setInputFunctionality(addFiftyLeft, -50, 'left', 1);

  var addTenLeft = document.createElement('input');
  addTenLeft.value = '+10';
  setInputFunctionality(addTenLeft, -10, 'left', 1);
}

function setTrimRight(){
  var trimFiftyRight = document.createElement('input');
  trimFiftyRight.value = '-50';
  setInputFunctionality(trimFiftyRight, 50, 'right', 3);

  var trimTenRight = document.createElement('input');
  trimTenRight.value = '-10';
  setInputFunctionality(trimTenRight, 10, 'right', 3);

  var addFiftyRight = document.createElement('input');
  addFiftyRight.value = '+50';
  setInputFunctionality(addFiftyRight, -50, 'right', 4);

  var addTenRight = document.createElement('input');
  addTenRight.value = '+10';
  setInputFunctionality(addTenRight, -10, 'right', 4);
}

function setTrimTop(){
  var trimFiftyTop = document.createElement('input');
  trimFiftyTop.value = '-50';
  setInputFunctionality(trimFiftyTop, 50, 'top', 6);

  var trimTenTop = document.createElement('input');
  trimTenTop.value = '-10';
  setInputFunctionality(trimTenTop, 10, 'top', 6);

  var addFiftyTop = document.createElement('input');
  addFiftyTop.value = '+50';
  setInputFunctionality(addFiftyTop, -50, 'top', 7);

  var addTenTop = document.createElement('input');
  addTenTop.value = '+10';
  setInputFunctionality(addTenTop, -10, 'top', 7);
}

function setTrimBottom(){
  var trimFiftyBottom = document.createElement('input');
  trimFiftyBottom.value = '-50';
  setInputFunctionality(trimFiftyBottom, 50, 'bottom', 9);

  var trimTenBottom = document.createElement('input');
  trimTenBottom.value = '-10';
  setInputFunctionality(trimTenBottom, 10, 'bottom', 9);

  var addFiftyBottom = document.createElement('input');
  addFiftyBottom.value = '+50';
  setInputFunctionality(addFiftyBottom, -50, 'bottom', 10);

  var addTenBottom = document.createElement('input');
  addTenBottom.value = '+10';
  setInputFunctionality(addTenBottom, -10, 'bottom', 10);
}

setTrimLeft();
setTrimRight();
setTrimTop();
setTrimBottom();

function setInputFunctionality(input, trimValue, trimType, locationNumber){
  if (input != null){
    input.type = 'button'
    setInputOnClick(input, trimValue, trimType);
    input.style.margin = '3px';
    topBar[locationNumber].after(input)

    let inputCopy = input.cloneNode(true);
    setInputOnClick(inputCopy, trimValue, trimType);
    bottomBar[locationNumber].after(inputCopy)
  }
}

function setInputOnClick(input, trimValue, trimType){
  if (trimType == 'top'){
    input.onclick = function () {
      unsafeWindow.trimTop(trimValue)
    }
  }
  else if  (trimType == 'bottom'){
    input.onclick = function () {
      unsafeWindow.trimBottom(trimValue)
    }
  }
  else if (trimType == 'left'){
    input.onclick = function () {
      unsafeWindow.trimLeft(trimValue)
    }
  }
  else if (trimType == 'right'){
    input.onclick = function () {
      unsafeWindow.trimRight(trimValue)
    }
  }
  else{
    console.log('trimType isn\'t a valid value');
  }
}