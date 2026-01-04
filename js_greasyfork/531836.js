// ==UserScript==
// @name         POE Trade Improvements
// @namespace    Kylixen
// @version      2025-01-27
// @description  Improvements to the trade site. Adds a button for "add resistances" and "add attributes" to create stat weight groups
// @author       Kylixen
// @match        https://www.pathofexile.com/trade2/search/poe2/Standard
// @match        https://www.pathofexile.com/trade2/search/poe2/Standard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/531836/POE%20Trade%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/531836/POE%20Trade%20Improvements.meta.js
// ==/UserScript==

// debugger;

var typingSpeed = 100; // milliseconds per character
async function simulateTyping(element, text, delay = 100) {
  let index = 0;

  function fireEvent(eventType, key) {
    const event = new KeyboardEvent(eventType, {
      key: key,
      code: key.charCodeAt(0),
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }

  function fireInputEvent() {
    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(inputEvent);
  }

  function fireChangeEvent() {
    const inputEvent = new InputEvent("change", {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(inputEvent);
  }

  async function typeNextChar() {
    if (index < text.length) {
      const char = text[index];
      fireEvent("keydown", char);
      fireEvent("keypress", char);

      if (element.isContentEditable) {
        element.textContent += char;
      } else {
        element.value += char;
      }

      fireInputEvent();
      fireEvent("keyup", char);

      index++;
      await setTimeout(null, delay)
      await typeNextChar();
    } else {
      fireChangeEvent();
    }
  }

  await typeNextChar();
}

function errorOnUndef(f, errorMessage) {
  return function (...args) { 
    var res = f(...args)
    if(res === undefined)
      throw errorMessage
    return res;
  }
}

function errorHandled(f) {
  return function(...args) {
    try {
      return f(...args);
    } catch(error) {
      console.error(error);
    }
  }
}

function asyncErrorOnUndef(f, errorMessage) {
  return async function (...args) { 
    var res = await f(...args)
    if(res === undefined)
      throw errorMessage
    return res;
  }
}

function asyncErrorHandled(f) {
  return async function(...args) {
    try {
      return await f(...args);
    } catch(error) {
      console.error(error);
    }
  }
}

function first(iterable) {
  if(!iterable || iterable.length == 0)
    return undefined;
  return iterable[0];
}

function last(iterable) {
  if(!iterable || iterable.length == 0)
    return undefined; 
  return iterable[iterable.length -1 ];
}

const getAddStatGroupDiv = errorOnUndef(function() {
  return document.querySelector(".filter-group-select")
}, "Couldn't find the +Add Stat Group <div>");

async function addNewStatGroup(statGroupType) {

  var divAddStatGroup = getAddStatGroupDiv();

  var options = Array.from(divAddStatGroup.querySelectorAll("li>span") || []);

  if(!options)
    throw "Couldn't find options in Add Stat Group div";

  var groupMatch = new RegExp(`^\s*${statGroupType}\s*$`, "i");

  var option = first(options.filter(function(opt) {
    if(groupMatch.test(opt.textContent))
      return true;
    return false;
  }))

  if(!option)
    throw "Couldn't find the stat group type " + statGroupType;

  option.click();

  await setTimeout(null, 3);

  return last(document.querySelectorAll("div.filter-group"));
};

const addWeightedResistances = asyncErrorHandled(async function() {

  // Add the new panel
  const statGroupDiv = await addNewStatGroup("weighted sum v2");

  // type "resistance" into the input so we get all the elements we need)
  const statFilterDiv = last(document.querySelectorAll("div.filter-select-mutate"));
  const statInput = statFilterDiv.querySelector("input");

  statInput.focus();
  await simulateTyping(statInput, "resistance", 0);

  // click all the resistances
  statFilterDiv.querySelectorAll("span.multiselect__option").forEach((optionSpan) => {
    if(!((optionSpan.textContent || "").match(/^(explicit|implicit) #% to (Cold|Fire|Lightning|Chaos|All Elemental) resistances?$/i)))
      return;
    console.debug(optionSpan.textContent);
    optionSpan.click();
  });

  await setTimeout(null, 6);

  // Set the weight for all/chaos
  statGroupDiv.querySelectorAll("span.filter-body:has(.weight)").forEach(async (optionSpan) => {
    if((optionSpan.innerText || "").match(/All Elemental/i)) {
      const weightInput = optionSpan.querySelector("input.weight");
      weightInput.focus();
      await simulateTyping(weightInput, "3", 0);
      await setTimeout(null, 6);
      weightInput.blur();
    }
  });
});

const addWeightedAttributes = asyncErrorHandled(async function() {

  // Add the new panel
  const statGroupDiv = await addNewStatGroup("weighted sum v2");

  // type "resistance" into the input so we get all the elements we need)
  const statFilterDiv = last(document.querySelectorAll("div.filter-select-mutate"));
  const statInput = statFilterDiv.querySelector("input");

  // statInput.focus();
  // await simulateTyping(statInput, "resistance", 0);

  // click all the resistances
  statFilterDiv.querySelectorAll("span.multiselect__option").forEach((optionSpan) => {
    if(!((optionSpan.textContent || "").match(/^(explicit|implicit) #% to (Cold|Fire|Lightning|Chaos|All Elemental) resistances?$/i)))
      return;
    console.debug(optionSpan.textContent);
    optionSpan.click();
  });

  await setTimeout(null, 6);

  // Set the weight for all/chaos
  statGroupDiv.querySelectorAll("span.filter-body:has(.weight)").forEach(async (optionSpan) => {
    if((optionSpan.innerText || "").match(/All Elemental/i)) {
      const weightInput = optionSpan.querySelector("input.weight");
      weightInput.focus();
      await simulateTyping(weightInput, "3", 0);
      await setTimeout(null, 6);
      weightInput.blur();
    }
  });

});
;
function addResistancesClick() {
  addWeightedResistances();
  // Clean up button
}

function addAttributesClick() {
  addWeightedAttributes();
  // Clean up button
}

function waitFor(waitForFunction, successCallback) {
  (new MutationObserver(function (changes, observer) {
    if (!waitForFunction())
      return;
    observer.disconnect();
    successCallback();
  })).observe(document, { childList: true, subtree: true });
}

(function () {
  'use strict';
  (new MutationObserver(function (changes, observer) {
    if (!document.querySelector('.filter-group-select'))
      return;
    observer.disconnect();
    onLoad();
  })).observe(document, { childList: true, subtree: true });

  function onLoad() {
    const searchDiv = document.querySelector("div.search-advanced-pane");
    const newElement = document.createElement('div');
    newElement.className = "filter-group expanded";
    newElement.innerHTML = `
    <div class="filter-group-body">
      <button id='add-resistance-button' type="button" class='btn search-btn' onclick='addResistancesClick()'>
          <span>Add Resistances</span>
      </button>
      <button id='add-attributes-button' type="button" class='btn search-btn' onclick='addAttributesClick()'>
          <span>Add Attributes</span>
      </button>
    </div>
    `;
    searchDiv.prepend(newElement);
  }
})();

window.addResistancesClick = addResistancesClick;
window.addAttributesClick = addAttributesClick;

window.ky = {
  addResistancesClick,
  addWeightedResistances,
  addWeightedAttributes,
  addNewStatGroup,
  simulateTyping,
  last,
  first,
}