// ==UserScript==
// @name         liveworksheets hack (Fixed)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Liveworksheets cheat by iron web10
// @author       iron web10
// @match        https://*.liveworksheets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=liveworksheets.com
// @grant        none
// @license      iron web10
// @downloadURL https://update.greasyfork.org/scripts/468351/liveworksheets%20hack%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468351/liveworksheets%20hack%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

   
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.backgroundColor = '#f0f0f0';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '5px';
    menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    menu.style.padding = '10px';
    menu.style.zIndex = 9999;
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.fontSize = '14px';

    const executeButton = document.createElement('button');
    executeButton.textContent = 'Auto Solver';
    executeButton.style.backgroundColor = '#4CAF50';
    executeButton.style.color = 'white';
    executeButton.style.border = 'none';
    executeButton.style.borderRadius = '5px';
    executeButton.style.padding = '5px 10px';
    executeButton.style.cursor = 'pointer';
    executeButton.style.marginBottom = '5px';

    executeButton.onmouseover = function() {
        executeButton.style.backgroundColor = '#45a049';
    };
    executeButton.onmouseout = function() {
        executeButton.style.backgroundColor = '#4CAF50';
    };

   
    executeButton.onclick = async function() {
        try {
            // Execute the script only when clicking the button
            await makeAlert();
            alert("Solved successfully.");
        } catch (error) {
            console.error('Error executing the script:', error);
            alert('An error occurred while executing the script. Check the console for more details.');
        }
    };


    const minimizeButton = document.createElement('button');
    minimizeButton.textContent = 'Minimize';
    minimizeButton.style.backgroundColor = '#007BFF';
    minimizeButton.style.color = 'white';
    minimizeButton.style.border = 'none';
    minimizeButton.style.borderRadius = '5px';
    minimizeButton.style.padding = '5px 10px';
    minimizeButton.style.cursor = 'pointer';

  
    minimizeButton.onmouseover = function() {
        minimizeButton.style.backgroundColor = '#0056b3';
    };
    minimizeButton.onmouseout = function() {
        minimizeButton.style.backgroundColor = '#007BFF';
    };


    minimizeButton.onclick = function() {
        if (menu.style.height === '0px' || menu.style.height === '') {
            menu.style.height = 'auto';
            minimizeButton.textContent = 'Minimize';
        } else {
            menu.style.height = '0px';
            minimizeButton.textContent = 'Show';
        }
    };


    async function makeAlert() {
        (() => {
  console.clear();
  console.log('%cLIVEWORKSHEETS AUTO-FILL - MADE BY IRON WEB10', 'color:#00ff88;font-size:20px;font-weight:bold');

  let answers = [];
  const scripts = document.querySelectorAll('script[type="application/json"]');
  for (const s of scripts) {
    try {
      const json = JSON.parse(s.textContent);
      if (json?.worksheet?.json) {
        answers = JSON.parse(json.worksheet.json);
        break;
      }
    } catch (e) {}
  }

  if (answers.length === 0) {
    alert('Error: No answers found. Please reload the page.');
    return;
  }

  console.log(`Loaded ${answers.length} correct answers`);

  const elements = document.querySelectorAll('#worksheet-preview-elements > *');

  function saveAnswer(index, value) {
    if (window.Worksheet?.setAnswer) window.Worksheet.setAnswer(index, value);
    if (window.drupalSettings?.worksheet?.setAnswer) drupalSettings.worksheet.setAnswer(index, value);
    if (window.Worksheet?.saveAnswer) window.Worksheet.saveAnswer(index, value);
    
    const event = new CustomEvent('worksheet-answer-saved', { detail: { index, answer: value } });
    document.dispatchEvent(event);
  }

  function fillTextField(el, answerValue, index, attempt = 1) {
    el.focus();
    
    if (el.hasAttribute('contenteditable')) {
      el.textContent = answerValue;
      el.innerHTML = answerValue;
    } else {
      el.value = answerValue;
    }
    
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, answerValue);

    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: answerValue }));
    el.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertText', data: answerValue }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
    
    if (el.hasAttribute('contenteditable')) {
      el.textContent = answerValue;
    } else {
      el.value = answerValue;
    }
    
    el.classList.add('answered');
    el.classList.remove('!bg-red-900', '!border-gray-605');
    
    saveAnswer(index, answerValue);
    el.blur();

    setTimeout(() => {
      const currentValue = el.hasAttribute('contenteditable') ? el.textContent : el.value;
      const isEmpty = !currentValue || currentValue.trim() === '';
      const hasError = el.classList.contains('!bg-red-900');
      
      if ((isEmpty || hasError) && attempt < 3) {
        console.log(`Retry text field [${index}]: attempt ${attempt + 1}`);
        fillTextField(el, answerValue, index, attempt + 1);
      } else if (isEmpty || hasError) {
        console.log(`Failed text field [${index}] after 3 attempts`);
      } else {
        console.log(`Text [${index}]: "${answerValue}" - OK`);
      }
    }, 100);
  }

  function clickSelector(el, index, attempt = 1) {
    el.classList.add('worksheet-select-div-selected', 'answered');
    saveAnswer(index, 'yes');
    
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
    setTimeout(() => {
      el.click();
    }, 50);

    setTimeout(() => {
      const isSelected = el.classList.contains('worksheet-select-div-selected');
      
      if (!isSelected && attempt < 3) {
        console.log(`Retry selector [${index}]: attempt ${attempt + 1}`);
        clickSelector(el, index, attempt + 1);
      } else if (!isSelected) {
        console.log(`Failed selector [${index}] after 3 attempts`);
      } else {
        console.log(`YES [${index}] - OK`);
      }
    }, 100);
  }

  let delay = 0;
  let yesCount = 0;
  let noCount = 0;
  let textCount = 0;

  elements.forEach((el, i) => {
    const correct = answers[i];
    if (!correct) return;

    const answerValue = correct[0];

    setTimeout(() => {
      if (el.hasAttribute('contenteditable') || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        fillTextField(el, answerValue, i);
        textCount++;
      }
      else if (el.classList.contains('worksheet-select-div')) {
        if (answerValue === 'select:yes') {
          clickSelector(el, i);
          yesCount++;
        } 
        else if (answerValue === 'select:no') {
          el.classList.add('answered');
          saveAnswer(i, 'no');
          noCount++;
          console.log(`NO [${i}] - Skipped (correct)`);
        }
      }
    }, delay);

    delay += 1;
  });

  setTimeout(() => {
    answers.forEach((a, i) => {
      const v = a[0];
      if (v === 'select:yes') saveAnswer(i, 'yes');
      else if (v === 'select:no') saveAnswer(i, 'no');
      else saveAnswer(i, v);
    });

    const visualYes = document.querySelectorAll('.worksheet-select-div-selected').length;

    console.log('\n%cFINAL SUMMARY', 'color:cyan;font-size:16px;font-weight:bold');
    console.log(`Total answers saved: ${answers.length}`);
    console.log(`YES marked: ${yesCount} (visual: ${visualYes})`);
    console.log(`NO ignored: ${noCount}`);
    console.log(`Text completed: ${textCount}`);
    
    if (visualYes === yesCount) {
      console.log('%cPERFECT! All YES selectors are correct', 'color:lime;font-size:18px;font-weight:bold');
      alert('✅ WORKSHEET 100% COMPLETED!\n\nClick "Finish" to get 100/100');
    } else {
      console.log(`%cWarning: ${Math.abs(visualYes - yesCount)} selectors have issues`, 'color:orange;font-size:14px');
      alert(`⚠️ Almost ready\n\nExpected YES: ${yesCount}\nVisual YES: ${visualYes}\n\nCheck console for details`);
    }
  }, delay + 100);

})()
    }

    
    menu.appendChild(executeButton);
    menu.appendChild(minimizeButton);
    document.body.appendChild(menu);

    
    alert("Cheat by iron web10");
     alert("discord.gg/3A9TmDH56N");
})();
