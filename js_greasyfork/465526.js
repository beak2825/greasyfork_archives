// ==UserScript==
// @name         BingChat QuickPrompt
// @version      1.0
// @description  Instantly prompts BingChat based on the provided query in URL search params. For instance, https://www.bing.com/chat?prompt="Who is Harry Potter" will instantly prompt BingChat.
// @match        https://www.bing.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1071946
// @downloadURL https://update.greasyfork.org/scripts/465526/BingChat%20QuickPrompt.user.js
// @updateURL https://update.greasyfork.org/scripts/465526/BingChat%20QuickPrompt.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("BingChat QuickPrompt: Activated");

  var queryString = window.location.search;
  // Create a URLSearchParams object
  var urlParams = new URLSearchParams(queryString);

  // Get the value of the prompt parameter
  var promptValue = urlParams.get("prompt");

  // Remove the quotation marks from the value
  promptValue = promptValue.replace(/"/g, "");

  function retry(fn, attempts, delay) {
    if (attempts === undefined) attempts = 10;
    if (delay === undefined) delay = 500;
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var context = this;
      var i = 0;
      var retryFn = function () {
        try {
          fn.apply(context, args); // delegate
        } catch (e) {
          if (i < attempts) setTimeout(retryFn, delay);
          else throw e;
        }
        i++;
      };
      retryFn();
    };
  }
  // Define a function that changes the maxlength attribute
  function prompt() {
    function simulateTyping(string, element) {
      // loop through each character in the string
      for (var i = 0; i < string.length; i++) {
        // create a keydown event with the character as the key property
        var event = new KeyboardEvent("keydown", { key: string[i] });
        // dispatch the event on the element
        element.dispatchEvent(event);
      }
    }

    var element =
      document.getElementsByClassName("cib-serp-main")[0].shadowRoot;
    var element2 = element.getElementById("cib-action-bar-main").shadowRoot;
    var root = element2.querySelector(".root");
    root.setAttribute("has-text", "");
    var searchbox = root.querySelector(".text-area");
    var controlSubmit = root.querySelector(".control.submit");
    controlSubmit.style.display = "block";
    var button = root.querySelector(".button.primary");

    // Set the maxlength attribute to 9999999
    searchbox.setAttribute("maxlength", "9999999");

    // Set the value of the searchbox to the promptValue
    searchbox.value = promptValue;
    // Trigger change event
    var changeEvent = document.createEvent("Events");
    changeEvent.initEvent("change", true, true);
    searchbox.dispatchEvent(changeEvent);

    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initMouseEvent(
      "click",
      true,
      true,
      window,
      0,
      1,
      1,
      1,
      1,
      false,
      false,
      false,
      false,
      0,
      null
    );

    // Trigger a click event on the button
    button.dispatchEvent(clickEvent);
  }
  // Create a retried version of the function
  var retried = retry(prompt);
  // Call the retried function
  retried();
})();
