// ==UserScript==
// @name     LugatimSpecialChar
// @version  1.5
// @grant    none
// @namespace lugatim
// @include  https://lugatim.com/*
// @description Lugatim Special Character
// @downloadURL https://update.greasyfork.org/scripts/395281/LugatimSpecialChar.user.js
// @updateURL https://update.greasyfork.org/scripts/395281/LugatimSpecialChar.meta.js
// ==/UserScript==

function addButton(letter) {
  // Some vars
  var classnameInputThing = "rbt-input-main";
  var classnameToAddButtonTo = "col";

  //Creates the Buttonf frist
  var element = document.createElement("ding");

  element.type = "button";
  element.value = letter;
  element.name = letter;
  element.textContent = letter;
  element.style.color = "white";

  element.classList.add("btn-info");
  element.classList.add("btn");
  element.classList.add("btn-small");

  element.style.padding = "25px";

  // On click action of the button
  element.onclick = function () {
    var inputField = document.getElementsByClassName(classnameInputThing)[0];
    var tempVal = inputField.value;

    var newVal = tempVal + letter;
    document.getElementsByClassName(classnameInputThing)[0].value = newVal;
    inputField.focus();

    //React input bar workaround
    let input = document.getElementsByClassName(classnameInputThing)[0];
    let lastValue = input.value;
    input.value = newVal;
    let event = new Event("input", { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = input._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
  };

  // Add button to screen
  var SearchbarDiv = document.getElementsByClassName(classnameToAddButtonTo)[0];
  SearchbarDiv.appendChild(element);
}

document.addEventListener("DOMContentLoaded", (event) => {
  addButton("ç");
  addButton("ı");
  addButton("ğ");
  addButton("ö");
  addButton("ş");
  addButton("ü");
  addButton("â");

  document.getElementsByClassName("rbt-input-main")[0].select(); //Visit website and always be ready to type
  document.getElementsByClassName("rbt-input-main")[0].focus(); //Visit website and always be ready to type
});
