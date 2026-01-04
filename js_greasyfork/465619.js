// ==UserScript==
// @name MonkeyType AutoTyper Bot
// @author longkidkoolstar
// @description A Bot that automatically types for you in MokeyType.
// @icon https://th.bing.com/th/id/R.c8397fb766c4397fea8a8b499c15a453?rik=aROX42RoH7HhXw&pid=ImgRaw&r=0
// @version 2.1
// @match *://monkeytype.com/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/1000020
// @downloadURL https://update.greasyfork.org/scripts/465619/MonkeyType%20AutoTyper%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/465619/MonkeyType%20AutoTyper%20Bot.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function () {
    "use strict";
  
    // Minimum and maximum delay (ms)
    let MIN_DELAY = 100;
    let MAX_DELAY = 333;
    const TOGGLE_KEY = "ArrowRight";
    const log = console.log;
  
    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  
    let toggle = false;
    function canType() {
      const typingTest = document.getElementById("typingTest");
      const isHidden = typingTest.classList.contains("hidden");
      if (isHidden) toggle = false;
      return toggle && !isHidden;
    }
  
    function getNextCharacter() {
      const currentWord = document.querySelector(".word.active");
      for (const letter of currentWord.children) {
        if (letter.className === "") return letter.textContent;
      }
      return " ";
    }
  
    const InputEvents = {};
    function pressKey(key) {
      const wordsInput = document.getElementById("wordsInput");
      const KeyboardEvent = Object.assign({}, DEFAULT_INPUT_OPTIONS, {
        target: wordsInput,
        data: key,
      });
      const InputEvent = Object.assign({}, DEFAULT_KEY_OPTIONS, {
        target: wordsInput,
        key: key,
      });
  
      wordsInput.value += key;
      InputEvents.beforeinput(InputEvent);
      InputEvents.input(InputEvent);
      InputEvents.keyup(KeyboardEvent);
    }
  
    function typeCharacter() {
        if (!canType()) {
          log("STOPPED TYPING TEST");
          return;
        }
      
        const nextChar = getNextCharacter();
        let delay;
      
        // Check which section is currently displayed
        const basicSection = document.getElementById("basicSection");
        if (basicSection.style.display === "") { // Basic section is displayed
          delay = 60000 / (document.getElementById("wpmSlider").value * 5);
        } else { // Advanced section is displayed
          delay = random(MIN_DELAY, MAX_DELAY);
        }
      
        const accuracy = document.getElementById("accuracySlider").value;
      
        // introduce some random errors
        if (Math.random() > accuracy) {
          // skip this character
          setTimeout(typeCharacter, delay);
          return;
        } else if (Math.random() > accuracy) {
          // repeat this character
          pressKey(nextChar);
        } else if (Math.random() > accuracy) {
          // insert a random incorrect character
          const adjacentKey = getAdjacentKey(nextChar);
          pressKey(adjacentKey);
        }
      
        // press the next character
        pressKey(nextChar);
      
        // introduce a pause between words
        if (nextChar === " ") {
          const pauseDelay = document.getElementById("pauseDelaySlider").value;
          setTimeout(typeCharacter, pauseDelay);
        } else {
          setTimeout(typeCharacter, delay);
        }
      }
      
      function getAdjacentKey(key) {
        // Define the adjacent keys for each key
        const adjacentKeys = {
          "q": ["w", "a"],
          "w": ["q", "e", "a", "s"],
          "e": ["w", "r", "s", "d"],
          "r": ["e", "t", "d", "f"],
          "t": ["r", "y", "f", "g"],
          "y": ["t", "u", "g", "h"],
          "u": ["y", "i", "h", "j"],
          "i": ["u", "o", "j", "k"],
          "o": ["i", "p", "k", "l"],
          "p": ["o", "l"],
          "a": ["q", "w", "s", "z"],
          "s": ["w", "e", "a", "d", "z", "x"],
          "d": ["e", "r", "s", "f", "x", "c"],
          "f": ["r", "t", "d", "g", "c", "v"],
          "g": ["t", "y", "f", "h", "v", "b"],
          "h": ["y", "u", "g", "j", "b", "n"],
          "j": ["u", "i", "h", "k", "n", "m"],
          "k": ["i", "o", "j", "l", "m"],
          "l": ["o", "p", "k"],
          "z": ["a", "s", "x"],
          "x": ["s", "d", "z", "c"],
          "c": ["d", "f", "x", "v"],
          "v": ["f", "g", "c", "b"],
          "b": ["g", "h", "v", "n"],
          "n": ["h", "j", "b", "m"],
          "m": ["j", "k", "n"]
        };
      
        // Handle space character separately
        if (key === " ") {
          return " ";
        }
      
        // Get the adjacent keys for the given key
        const keys = adjacentKeys[key.toLowerCase()];
      
        // Randomly select an adjacent key
        const randomIndex = Math.floor(Math.random() * keys.length);
        return keys[randomIndex];
      }
      
    window.addEventListener("keydown", function (event) {
      if (event.code === TOGGLE_KEY) {
        event.preventDefault();
  
        if (event.repeat) return;
        toggle = !toggle;
        if (toggle) {
          log("STARTED TYPING TEST");
          typeCharacter();
        }
      }
    });
  
    // Intercept when JQuery attached an addEventListener to the Input element
    function hook(element) {
      element.addEventListener = new Proxy(element.addEventListener, {
        apply(target, _this, args) {
          const [type, listener, ...options] = args;
          if (_this.id === "wordsInput") {
            InputEvents[type] = listener;
          }
          return target.apply(_this, args);
        },
      });
    }
    hook(HTMLInputElement.prototype);
  
    const DEFAULT_KEY_OPTIONS = {
      key: "",
      code: "",
      keyCode: 0,
      which: 0,
      isTrusted: true,
      altKey: false,
      bubbles: true,
      cancelBubble: false,
      cancelable: true,
      charCode: 0,
      composed: true,
      ctrlKey: false,
      currentTarget: null,
      defaultPrevented: false,
      detail: 0,
      eventPhase: 0,
      isComposing: false,
      location: 0,
      metaKey: false,
      path: null,
      repeat: false,
      returnValue: true,
      shiftKey: false,
      srcElement: null,
      target: null,
      timeStamp: 6338.5,
      type: "",
      view: window,
    };
  
    const DEFAULT_INPUT_OPTIONS = {
      isTrusted: true,
      bubbles: true,
      cancelBubble: false,
      cancelable: false,
      composed: true,
      data: "",
      dataTransfer: null,
      defaultPrevented: false,
      detail: 0,
      eventPhase: 0,
      inputType: "insertText",
      isComposing: false,
      path: null,
      returnValue: true,
      sourceCapabilities: null,
      srcElement: null,
      target: null,
      currentTarget: null,
      timeStamp: 11543,
      type: "input",
      view: null,
      which: 0,
    };
  
   // Add GUI to change min and max delay
  const gui = document.createElement("div");
  gui.style.position = "fixed";
  gui.style.bottom = "30%";
  gui.style.right = "0";
  gui.style.transform = "translateY(50%)";
  gui.style.padding = "5px";
  gui.style.background = "rgba(0, 0, 0, 0.6)";
  gui.style.color = "white";
  gui.style.fontFamily = "sans-serif";
  gui.style.fontSize = "12px";
  gui.style.zIndex = "9999"; // set z-index to a high value
  gui.innerHTML = `
    <div style="display: flex; flex-direction: column;">
      <div style="margin-bottom: 10px;">
        <button id="resetButton">Reset to Default</button>
      </div>
    <div style="display: flex; flex-direction: column;">
      <div style="margin-bottom: 10px;">
        <button id="basicButton">Basic</button>
        <button id="advancedButton">Advanced</button>
      </div>
      <div id="basicSection">
        <div style="margin-bottom: 5px;">
          WPM: <input type="range" id="wpmSlider" value="50" min="10" max="100" step="5" style="width: 100px;">
          <span id="wpmValue">50</span>
        </div>
      </div>
      <div id="advancedSection" style="display: none;">
        <div style="margin-bottom: 5px;">
          Min Delay: <input type="range" id="minDelaySlider" value="${MIN_DELAY}" min="0" max="1000" step="10" style="width: 100px;">
          <span id="minDelayValue">${MIN_DELAY}ms</span>
        </div>
        <div style="margin-bottom: 5px;">
          Max Delay: <input type="range" id="maxDelaySlider" value="${MAX_DELAY}" min="0" max="1000" step="10" style="width: 100px;">
          <span id="maxDelayValue">${MAX_DELAY}ms</span>
        </div>
        <div>
          Pause Delay: <input type="range" id="pauseDelaySlider" value="${MAX_DELAY}" min="0" max="1000" step="10" style="width: 100px;">
          <span id="pauseDelayValue">${MAX_DELAY}ms</span>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 5px;">
    Accuracy: <input type="range" id="accuracySlider" value="0.1" min="0" max="1" step="0.01" style="width: 100px;">
    <span id="accuracyValue">0.1</span>
  </div>
  `;
  document.body.appendChild(gui);
  
  // Add event listeners to toggle the visibility of each section
  const basicButton = document.getElementById("basicButton");
  const basicSection = document.getElementById("basicSection");
  basicButton.addEventListener("click", function() {
    basicSection.style.display = "";
    advancedSection.style.display = "none";
  });
  
  const advancedButton = document.getElementById("advancedButton");
  const advancedSection = document.getElementById("advancedSection");
  advancedButton.addEventListener("click", function() {
    basicSection.style.display = "none";
    advancedSection.style.display = "";
  });
  
  // Add event listeners to the sliders
  const wpmSlider = document.getElementById("wpmSlider");
  const wpmValue = document.getElementById("wpmValue");
  wpmSlider.addEventListener("input", function() {
    wpmValue.textContent = wpmSlider.value;
  });
  
  const minDelaySlider = document.getElementById("minDelaySlider");
  const minDelayValue = document.getElementById("minDelayValue");
  minDelaySlider.addEventListener("input", function() {
    MIN_DELAY = parseInt(minDelaySlider.value);
    minDelayValue.textContent = `${MIN_DELAY}ms`;
  });
  
  const maxDelaySlider = document.getElementById("maxDelaySlider");
  const maxDelayValue = document.getElementById("maxDelayValue");
  maxDelaySlider.addEventListener("input", function() {
    MAX_DELAY = parseInt(maxDelaySlider.value);
    maxDelayValue.textContent = `${MAX_DELAY}ms`;
  });
  
  const pauseDelaySlider = document.getElementById("pauseDelaySlider");
  const pauseDelayValue = document.getElementById("pauseDelayValue");
  pauseDelaySlider.addEventListener("input", function() {
    pauseDelayValue.textContent = `${pauseDelaySlider.value}ms`;
  });
  
      const accuracySlider = document.getElementById("accuracySlider");
  const accuracyValue = document.getElementById("accuracyValue");
  accuracySlider.addEventListener("input", function() {
    accuracyValue.textContent = accuracySlider.value;
  });
      const resetButton = document.getElementById("resetButton");
  
  resetButton.addEventListener("click", function() {
    wpmSlider.value = 40;
    minDelaySlider.value = 100;
    maxDelaySlider.value = 333;
    pauseDelaySlider.value = 100;
    accuracySlider.value = 95;
  
    wpmValue.textContent = wpmSlider.value;
    minDelayValue.textContent = `${minDelaySlider.value}ms`;
    maxDelayValue.textContent = `${maxDelaySlider.value}ms`;
    pauseDelayValue.textContent = `${pauseDelaySlider.value}ms`;
    accuracyValue.textContent = accuracySlider.value;
  
    // Save default values to localStorage
    localStorage.setItem('wpmSliderValue', wpmSlider.value);
    localStorage.setItem('minDelaySliderValue', minDelaySlider.value);
    localStorage.setItem('maxDelaySliderValue', maxDelaySlider.value);
    localStorage.setItem('pauseDelaySliderValue', pauseDelaySlider.value);
    localStorage.setItem('accuracySliderValue', accuracySlider.value);
  });
  
      function saveSliderValues() {
    localStorage.setItem('wpmSliderValue', wpmSlider.value);
    localStorage.setItem('minDelaySliderValue', minDelaySlider.value);
    localStorage.setItem('maxDelaySliderValue', maxDelaySlider.value);
    localStorage.setItem('pauseDelaySliderValue', pauseDelaySlider.value);
    localStorage.setItem('accuracySliderValue', accuracySlider.value);
  }
      wpmSlider.addEventListener('input', function() {
    wpmValue.textContent = wpmSlider.value;
    saveSliderValues();
  });
  
  minDelaySlider.addEventListener('input', function() {
    MIN_DELAY = parseInt(minDelaySlider.value);
    minDelayValue.textContent = `${MIN_DELAY}ms`;
    saveSliderValues();
  });
  
  maxDelaySlider.addEventListener('input', function() {
    MAX_DELAY = parseInt(maxDelaySlider.value);
    maxDelayValue.textContent = `${MAX_DELAY}ms`;
    saveSliderValues();
  });
  
  pauseDelaySlider.addEventListener('input', function() {
    pauseDelayValue.textContent = `${pauseDelaySlider.value}ms`;
    saveSliderValues();
  });
  
  accuracySlider.addEventListener('input', function() {
    accuracyValue.textContent = accuracySlider.value;
    saveSliderValues();
  });
      // Retrieve slider values from localStorage
  if (localStorage.getItem('wpmSliderValue')) {
    wpmSlider.value = localStorage.getItem('wpmSliderValue');
    wpmValue.textContent = wpmSlider.value;
  }
  
  if (localStorage.getItem('minDelaySliderValue')) {
    minDelaySlider.value = localStorage.getItem('minDelaySliderValue');
    MIN_DELAY = parseInt(minDelaySlider.value);
    minDelayValue.textContent = `${MIN_DELAY}ms`;
  }
  
  if (localStorage.getItem('maxDelaySliderValue')) {
    maxDelaySlider.value = localStorage.getItem('maxDelaySliderValue');
    MAX_DELAY = parseInt(maxDelaySlider.value);
    maxDelayValue.textContent = `${MAX_DELAY}ms`;
  }
  
  if (localStorage.getItem('pauseDelaySliderValue')) {
    pauseDelaySlider.value = localStorage.getItem('pauseDelaySliderValue');
    pauseDelayValue.textContent = `${pauseDelaySlider.value}ms`;
  }
  
  if (localStorage.getItem('accuracySliderValue')) {
    accuracySlider.value = localStorage.getItem('accuracySliderValue');
    accuracyValue.textContent = accuracySlider.value;
  }
  
  })();
  