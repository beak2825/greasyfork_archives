// ==UserScript==
// @name         WaniKani Quick Type
// @namespace    wkquicktype
// @description  Speed up your your lessons: Check and accept answers for meanings after a minimal amount of typed characters.
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @version      1.1.1
// @author       polysoda
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-end
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.6.1/toastify.min.js
// @downloadURL https://update.greasyfork.org/scripts/498665/WaniKani%20Quick%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/498665/WaniKani%20Quick%20Type.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(async function (wkof) {
  'use strict';

  if (!wkof) {
    alert("WK Autocomplete requires Wanikani Open Framework." +
      "You will now be forwarded to installation instructions.");
    window.location.href = "https://community.wanikani.com/t/" +
      "instructions-installing-wanikani-open-framework/28549";
    return;
  } else {
    wkof.include('Menu, Settings');
    wkof.ready('Menu, Settings')
      .then(load_settings)
      .then(install_menu)
  }
  const scriptId = "wanikaniQuickType";
  const wkofScriptId = "wkofs_" + scriptId;
  let inputClass = ".quiz-input__input";
  const enterEvent = new KeyboardEvent("keydown", {
    key: "Enter",
    code: "Enter",
    which: 13,
    keyCode: 13,
    bubbles: true,
    cancelable: true,
  });
  let id;
  let lessonType = null;
  let essentialMeanings;
  let details;
  let inputElement;
  let inputButton;
  // settings vars
  let maxMeaningsCount = 8;
  let maxCharCount = 3;
  let enableToast = true;
  let toastLocation = "Top";
  let useSpaceEscape = true;
  let countdownCreated = false;
  let countdownTimer = null;

  // load assets (toastify css)
  const toastCss = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';
  let promises = [];
  promises[0] = wkof.load_css(toastCss, true /* use_cache */);
  Promise.all(promises);

  window.addEventListener("willShowNextQuestion", (e) => {
    console.log("Event:  willShowNextQuestion");
      if (countdownTimer !== null){
        countdownTimer.style.display = 'none';
      }
      setTimeout(main, 1000);
  });

  function handleKeyDown(event) {
      // Keys to BLOCK (modifiers, navigation, function keys)
      const blockedKeys = [
          'Shift', 'Control', 'Alt', 'Meta', 'OS', // Modifiers
          'Enter', 'Tab', 'Escape', 'CapsLock', 
          'ArrowUp', 'ArrowDown', 'Home', 'End', 
          'PageUp', 'PageDown', 'Insert', 'ContextMenu',
          'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
      ];

      // Skip if:
      // 1. Blocked key is pressed
      const isBlockedKey = blockedKeys.includes(event.key);

      if (isBlockedKey) return;
      setTimeout(() => {
          let inputValue = inputElement.value.trim();
          if (!useSpaceEscape) {
              inputValue = inputValue.replace(/^\s?/, '');
          }

          if (lessonType === "reading") {
              if (details.readings.includes(inputValue)) {
                 handleSubmit(event);
              }
          } else {
              if (essentialMeanings.includes(inputValue)) {
                 handleSubmit(event);
              } else if (inputValue.length >= maxCharCount) {
                  const essentialMeaning = getMatchingMeaning(inputValue, essentialMeanings);
                  if (essentialMeaning) {
                      inputElement.value = essentialMeaning;
                      if (enableToast) {
                          showToast(`👍 ${inputValue} → ${essentialMeaning}`);
                      }
                      handleSubmit(event);
                  }
              }
          }
      }, 100);
  }

  function handleSubmit(event){
      event.preventDefault();
      //log in value
      inputButton.click();
      //submit value
      setTimeout(function(){
        inputButton.click();
      },100);
  }

  function main (){
    inputButton = document.querySelector(".quiz-input__submit-button");
    inputElement = document.querySelector(".quiz-input__input");
    setEssentialMeanings();

    if (inputElement === null) return;
    createCountdown();
    inputElement.addEventListener('keydown', handleKeyDown);
  }

  function createCountdown() {
      if(countdownCreated) return;
      countdownCreated = true;
      const container = document.querySelector('.quiz-input__input-container');
      const input = container.querySelector('.quiz-input__input');

      // Create countdown timer element
      countdownTimer = document.createElement('div');
      countdownTimer.className = 'countdown-timer';
      countdownTimer.style.display = 'none'; // Initially hidden

      // Append countdown timer to container
      container.appendChild(countdownTimer);

      // Get the computed styles of the input field
      const inputStyle = window.getComputedStyle(input);
      const inputHeight = input.offsetHeight;
      const inputPaddingTop = parseFloat(inputStyle.paddingTop) + parseFloat(inputStyle.paddingBottom);
      const inputPaddingLeft = parseFloat(inputStyle.paddingLeft);

      // Calculate the top and left positions based on input's height and padding
      const containerPaddingTop = parseFloat(window.getComputedStyle(container).paddingTop);
      const topPosition = containerPaddingTop + input.offsetTop;

      // Set a variable offset for the left position
      const leftOffset = 10; // You can change this value as needed
      const leftPosition = leftOffset + inputPaddingLeft + 'px';

      // Apply CSS styles dynamically via JavaScript
      Object.assign(countdownTimer.style, {
        position: 'absolute',
        left: leftPosition,
        top: `${topPosition}px`,
        width: '40px',
        height: `${inputHeight - inputPaddingTop}px`,
        lineHeight: `${inputHeight - inputPaddingTop}px`,
      });

      // Initialize countdown
      let countDown = 3;
      let timeLeft = countDown; // 3 seconds countdown

      // Function to update countdown
      function updateCountdown() {
        const typedCharacters = input.value.length;

        // Show countdown only after the first character is entered
        console.log(lessonType);
        if (input.value[0] !== ' ' && lessonType !== 'reading') {
          countdownTimer.style.display = 'flex'; // Show countdown timer
          const remainingCharacters = Math.max(typedCharacters, 0); // Subtract 1 to account for the first character
          timeLeft = Math.max(3 - remainingCharacters, 0);
          countdownTimer.textContent = timeLeft;

          // Show shaking animation with red background if more than 3 characters
          /*
          if (typedCharacters >= countDown) {
            countdownTimer.classList.add('shake');
            countdownTimer.style.backgroundColor = 'red';
          } else {
            countdownTimer.classList.remove('shake');
            countdownTimer.style.backgroundColor = 'green';
          }
          */
        } else {
          countdownTimer.style.display = 'none'; // Hide countdown timer
        }
      }

      // Add event listeners for typing and keyup
      input.addEventListener('input', updateCountdown);
      input.addEventListener('keydown', () => {
        countdownTimer.classList.add('scale-down');
      });
      input.addEventListener('keyup', () => {
        countdownTimer.classList.remove('scale-down');
        countdownTimer.classList.add('scale-up');
        setTimeout(() => countdownTimer.classList.remove('scale-up'), 200); // Remove bounce effect after animation
      });
    }

    function extractQuizDetails() {
        // Step 1: Extract `data-subject-id`, `category`, and `questionType` from the label element
        const label = document.querySelector('label[data-subject-id]');
        const subjectId = label ? label.getAttribute('data-subject-id') : null;

        if (!subjectId) {
            return { subjectId: null, category: null, questionType: null, meanings: null };
        }

        const categoryElement = label.querySelector('span[data-quiz-input-target="category"]');
        const questionTypeElement = label.querySelector('span[data-quiz-input-target="questionType"]');
        const category = categoryElement ? categoryElement.textContent : null;
        const questionType = questionTypeElement ? questionTypeElement.textContent : null;

        // Step 2: Parse JSON data from the script tag
        const script = document.querySelector('script[data-quiz-queue-target="subjects"]');
        let subjects = [];
        if (script) {
            try {
                subjects = JSON.parse(script.textContent);
            } catch (e) {
                console.error('Error parsing JSON from script tag:', e);
            }
        }

        // Step 3: Find the subject object matching the extracted `data-subject-id`
        const subject = subjects.find(subject => subject.id === parseInt(subjectId));
        console.log(subjects);
        console.log(subject);

        // Step 4: Extract the meanings array from the subject object
        const meanings = subject ? subject.meanings : null;
        const readings = subject?.readings
            .filter(({ kind }) => kind === "primary" || kind === "alternative")
            .map(({ text }) => text)
            ?.flatMap(text => {
              if (text.endsWith("ん")) {
                const modified = text.slice(0, -1) + "n";
                return [text, modified];
              }
              return [text];
            }) ?? null;
        console.log(readings);

        return {
            subjectId: subjectId,
            category: category,
            questionType: questionType,
            meanings: meanings,
            readings: readings
        };
    }
  
  function setEssentialMeanings() {
    details = extractQuizDetails()
    id = details.subjectId;
    const synonyms = getSynonymsById(id);
    const meanings = details.meanings;
    lessonType = details.questionType;
    essentialMeanings = combineArrays(synonyms, meanings, maxMeaningsCount);
  }

  function setEssentialReadings(id){

  }

  function getMatchingMeaning(prefix, stringArray) {
    if (stringArray == null || prefix == null) {
      return null;
    }

    function normalizeUmlauts(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/ä/g, 'ae')
            .replace(/ü/g, 'ue')
            .replace(/ö/g, 'oe')
            .replace(/ß/g, 'ss')
            .toLowerCase();
    }

      // Safely normalize prefix
      const normalizedPrefix = normalizeUmlauts(prefix);

      for (let item of stringArray) {
          const normalizedItem = normalizeUmlauts(item);
          if (normalizedItem.startsWith(normalizedPrefix)) {
              return item;
          }
      }
    return null;
  }

  function getSynonymsById(id) {
    const scriptTag = document.querySelector('script[data-quiz-user-synonyms-target="synonyms"]');
    if (scriptTag) {
      const synonymsData = JSON.parse(scriptTag.textContent);
      return synonymsData[id] || [];
    } else {
      console.error('Script tag with the specified type and data attribute was not found.');
      return [];
    }
  }

  function combineArrays(array1, array2, x) {
    const firstPart = array1.slice(0, x);
    const secondPart = array2.slice(0, x);
    const combinedArray = [...firstPart, ...secondPart];
    return combinedArray;
  }

  function showToast(text) {
    toastLocation = toastLocation.toLowerCase();
    Toastify({
      text: text,
      duration: 2000,
      close: false,
      gravity: toastLocation, // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(339deg, rgba(0,185,155,1) 0%, rgba(23,218,157,1) 100%)",
        fontSize: "12px",
        fontWeight: "bold",
        borderRadius: "8px",
        color: "#fff"
      }
    }).showToast();
  }

  appendStyleElem();
  function appendStyleElem() {
    const styleElem = document.createElement("style");
    styleElem.innerHTML = `
      .demo-style {
      }
      `;
    document.head.append(styleElem);
  }

  // ––––––– Settings ––––––– //
  // This function is called when the Settings module is ready to use.
  function load_settings() {
    let defaults = {
      maxMeaningsCount: 8,
      maxCharCount: 3
    };
    wkof.Settings.load('wanikaniQuickType', defaults)
      .then(update_settings);
  }

  // Add settings menu to the menu
  function install_menu() {
    let config = {
      name: 'wanikaniQuickType',
      submenu: 'Settings',
      title: 'Quick Type',
      on_click: open_settings
    };
    wkof.Menu.insert_script_link(config);
  }

  // Define settings menu layout
  function open_settings(items) {
    let config = {
      script_id: scriptId,
      title: 'Quick Type',
      on_save: update_settings,
      on_close: update_settings,
      content: {
        maxCharCount: {
          type: 'number',
          label: "Character count",
          hover_tip: "The amount of typed characters after which the check of the meanings is started.",
          default: 3,
          min: 1,
          max: 10
        },
        maxMeaningsCount: {
          type: 'number',
          label: "Meanings count",
          hover_tip: "The count of synonyms and meanings items to include in check of the meanings",
          default: 8,
          min: 1,
          max: 8
        },
        useSpaceEscape: {
          type: 'checkbox',
          label:          "Disable with leading space",
          hover_tip:      "Type a space charakter at the beginning to temporarily disable Quick Type",
          default:        true
        },
        enableToast: {
          type: 'checkbox',
          label:          "Enable notification",
          hover_tip:      "A quick info will be shown with the matched meaning based on the short input.",
          default:        true
        },
        toastLocation: {
          type: 'dropdown',
          label:          "Notifiocation location",
          hover_tip:      "The location of the info toast.",
          default:        "Top",
          content: {
              top: "Top",
              bottom: "Bottom",
          }
        }
        }
    }
    let dialog = new wkof.Settings(config);
    dialog.open();
  }

  function update_settings(settings) {
    maxMeaningsCount = settings.maxMeaningsCount;
    maxCharCount = settings.maxCharCount;
    enableToast = settings.enableToast;
    toastLocation = settings.toastLocation;
    useSpaceEscape = settings.useSpaceEscape;
    wkof.Settings.save("wanikaniQuickType");
  }
  const dialog = `
    #wkof_ds div.ui-dialog[aria-describedby="${wkofScriptId}"]
  `;
  const css = `
    /* quick type styles */
 .countdown-timer {
  background-color: green;
  color: white;
  text-align: center;
  border-radius: 10px;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease; /* Smooth transition for scaling */
}

.countdown-timer::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px dashed white; /* White dashed border */
  border-radius: 10px;
  z-index: 2;
}

@keyframes scaleDown {
  0% { transform: scale(1); }
  100% { transform: scale(0.9); }
}

@keyframes scaleUp {
  0% { transform: scale(0.9); }

  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.scale-down {
  animation: scaleDown 0.07s forwards;
}

.scale-up {
  animation: scaleUp 0.14s ease;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s infinite;
}

    ${dialog}{
      background-color: #fff;
      background-image: none!important;
      border-radius: 12px!important;
      padding: 8px;
      width: 456px;
    }

    ${dialog} .ui-widget-header {
        border: none;
        background: none;
        color: #222222;
    }
    ${dialog} .ui-widget-header .ui-dialog-title{
        font-size: 24px;
        line-height: 32px;
        padding: 8px;
    }
    ${dialog} .left{
      width: 196px;
    }

    ${dialog} form label {
        text-align: left;
        opacity: .72;
    }
    ${dialog} form .row {
        margin-bottom: 8px;
    }
    ${dialog} input[type="checkbox"] {
      width: 24px;
      margin-left: 0;
    }
    ${dialog} .ui-dialog-titlebar {
      margin-bottom: 8px;
    }
    ${dialog} button.ui-dialog-titlebar-close,
    ${dialog} button.ui-dialog-titlebar-close .ui-button-icon{
      padding: 0;
      background: none;
      border: none;
      text-indent: 0;
      width: 40px;
      height: 40px;
      border-radius: 40px;
    }
    ${dialog} button.ui-dialog-titlebar-close{
        position: absolute;
        top: 8px;
        right: -2px;
    }
    ${dialog} button.ui-dialog-titlebar-close .ui-button-icon{
      position: absolute;
      top: 10px;
      left: 0;
      margin-top: 0;
      margin-left: 0;
      overflow: visible;
    }
    ${dialog} button.ui-dialog-titlebar-close:hover{
      background: #f1f1f1;
    }
    ${dialog} button.ui-dialog-titlebar-close {
    text-indent: -9999px;
    }
    ${dialog} button.ui-dialog-titlebar-close .ui-button-icon:after{
      font-size: 20px;
      line-height: 20px;
      content: "✕";
    }
    ${dialog} button.ui-dialog-titlebar-close .ui-button-icon-space{
      display: none;
    }

    ${dialog} .ui-dialog-buttonset {
      order: revert;
      display: flex;
    }
    ${dialog} .ui-dialog-buttonset button{
      text-shadow: none;
      padding: 8px 28px;
      font-size: 14px;
      display: flex;
      border-radius: 8px;
    }
    ${dialog} .ui-dialog-buttonset button:first-child{
      color: #fff;
      border: var(--color-radical);
      background: var(--color-radical);
      padding: 8px 32px;
    }
    ${dialog} .ui-dialog-buttonset button:after {
        content: ' ';
        position: absolute;
        border-radius: 8px;
        width: 100%;
        height:100%;
        top:0;
        left:0;
        background:rgba(0,0,0,0.04);
        opacity: 0;
        transition: all .2s;
        -webkit-transition: all .2s;
    }
    ${dialog} .ui-dialog-buttonset button:hover:after {
        opacity: 1;
    }
    ${dialog} .ui-dialog-buttonset button:first-child:hover:after {
        background:rgba(0,0,0,0.06);
    }
    ${dialog} .ui-dialog-buttonset button:nth-child(2){
      border: 1px solid #ddd;
      background: none;
      color: #333;
      order: -1;
      margin-right:8px;
    }
    ${dialog} .ui-dialog-buttonpane {
        border-top: none;
        padding: 16px 0 8px 0;
    }
  `;

  function appendCssToHead(cssString) {
    const styleElement = document.createElement('style');
    styleElement.textContent = cssString;

    const headElement = document.head || document.getElementsByTagName('head')[0];
    headElement.appendChild(styleElement);
  }

  appendCssToHead(css);


})(window.wkof);