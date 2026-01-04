// ==UserScript==
// @name         Idlescape Max Button on Item Dialog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button "Set to max" to the inventory item dialog
// @author       WilliW
// @match        https://idlescape.com/game
// @icon         https://no-fun.de/images/max.png
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443753/Idlescape%20Max%20Button%20on%20Item%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/443753/Idlescape%20Max%20Button%20on%20Item%20Dialog.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  "use strict";

  const BUTTON_TEXT = "Set to max";

  let observer = new MutationObserver(onMutation);
  observer.observe(document.body, { childList: true, subtree: true });

  /**
   * Callback to inspect modifications of the DOM tree.
   */
  function onMutation(mutations) {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.matches("div.sell-item-dialog")
        ) {
          let bdiv = node.querySelector("div.item-dialogue-button-div");
          if (bdiv) {
            addMaxButton(node, bdiv);
          }
        }
      }

      // need to remove the button for the confirmation dialog
      for (let node of mutation.removedNodes) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.matches("div.item-input")
        ) {
          let innerDiv = mutation.target.parentNode.querySelector(".maxbutton");
          if (innerDiv) {
            let outerDiv = innerDiv.parentElement;
            outerDiv.parentElement.removeChild(outerDiv);
          }
        }
      }
    }
  }

  /**
   * Adds a max button at the top of the button div on the sell dialog.
   *
   * @param dialog the sell dialog div
   * @param bdiv the button div
   */
  function addMaxButton(dialog, bdiv) {
    let outerDiv = document.createElement("div");
    let innerDiv = document.createElement("div");
    outerDiv.appendChild(innerDiv);
    innerDiv.setAttribute("variant", "contained");
    innerDiv.setAttribute("color", "secondary");
    innerDiv.setAttribute(
      "class",
      "item-dialogue-button idlescape-button idlescape-button-green maxbutton"
    );
    innerDiv.appendChild(document.createTextNode(BUTTON_TEXT));
    innerDiv.addEventListener("click", function () {
      setMaxValue(dialog);
    });
    bdiv.prepend(outerDiv);
  }

  /**
   * Sets the maximum value into the numeric text field next to the slider
   * and triggers the update of the controlling ReactJS instance.
   *
   * @param dialog the sell dialog div
   */
  function setMaxValue(dialog) {
    let textfield = dialog.querySelector(".item-input-text");
    if (textfield) {
      let input = textfield.querySelector("input");
      if (input) {
        setReactNativeValue(input, input.getAttribute("max"));
      }
    }
  }

  /*
   * Posts an input event such that ReactJS updates the internal state.
   * Credit to https://github.com/daelidle/ISscripts
   *
   * @param element the input element
   * @param value the new value
   */
  function setReactNativeValue(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event("input", { target: element, bubbles: true });
    // React 15
    event.simulated = true;
    // React 16
    let tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
  }
})();
