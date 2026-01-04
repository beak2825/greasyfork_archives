// ==UserScript==
// @name         AutoClicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  One AutoClicker to rule them all. Place the class 'autoclick' on a clickable html element and run the script by pressing the button.
// @author       Michael Whitaker
// @match        http://localhost
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451646/AutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/451646/AutoClicker.meta.js
// ==/UserScript==

(function () {
  'use strict'
  var vm = {};
  vm.currentElement = null;
  
  window.addEventListener('load', () => {
    vm.addButton('Mikes auto click button', vm.clickOnElements)
  });

  vm.clicknthElement = function (index) {
    let elementsOnDom = document.getElementsByClassName('autoclick');
    let elementsArray = Array.from(elementsOnDom);
    let element = elementsArray[index];
    element.click();
  };
  
  vm.addButton = function (text, onclick) {
    let button = document.createElement('button');
    button.style.position = 'absolute';
    button.style.top = '7%';
    button.style.right = '4%';
    button.style.zIndex = 999;
    button.style.color = 'hotpink';

    // we should map an object to the style element
    button.innerHTML = text;
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);

    button.onclick = onclick;
    return button;
  }
  
  vm.clickOnElements = function () {
    vm.targetElementsLength = document.getElementsByClassName('autoclick').length;
    if (vm.targetElementsLength === 0) {
      return;
    }

    for (var i = 0; i < vm.targetElementsLength; i++) {
      setTimeout(function () {
        vm.clicknthElement(i);
      }, 200 * i);
    }
  }
}())
