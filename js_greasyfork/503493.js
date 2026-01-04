// ==UserScript==
// @name          AI Studio Prompts Auto-Configure
// @namespace    http://tampermonkey.net/
// @version      2024-04-08
// @description  Configures AI Studio Prompts settings automatically
// @author       Mahesh324
// @match        https://aistudio.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503493/AI%20Studio%20Prompts%20Auto-Configure.user.js
// @updateURL https://update.greasyfork.org/scripts/503493/AI%20Studio%20Prompts%20Auto-Configure.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function updateSlider(value) {
    const sliderInput = document.querySelector('input[matsliderthumb]');
    if (sliderInput) {
      sliderInput.value = value;

      const inputEvent = new Event('input', { bubbles: true });
      sliderInput.dispatchEvent(inputEvent);

      const activeFill = document.querySelector('.mdc-slider__track--active_fill');
      const visualThumb = document.querySelector('.mat-mdc-slider-visual-thumb');

      if (activeFill) {
        const fillPercentage = (value / 2) * 100;
        activeFill.style.transform = `scaleX(${fillPercentage / 100})`;
      }

      if (visualThumb) {
        const thumbPosition = (value / 2) * sliderInput.offsetWidth;
        visualThumb.style.transform = `translateX(${thumbPosition}px)`;
      }

      const numericInput = document.querySelector('.slider-input[type="number"]');
      if (numericInput) {
        numericInput.value = value;
      }
    } else {
      console.error('Slider input not found.');
    }
  }

  // Function to open the safety settings dialog
  function openSafetyDialog() {
    const safetyButton = document.querySelector('.edit-safety-button');
    if (safetyButton) {
      safetyButton.click();
    } else {
      console.error('Safety button not found');
    }
  }

  // Function to set safety sliders to -4 (Block none)
  function setSliderValues() {
    const safetySliders = document.querySelectorAll('.run-safety-settings .mat-mdc-slider input[type="range"]');
    safetySliders.forEach(slider => {
      slider.value = -4;
      const event = new Event('input', { bubbles: true });
      slider.dispatchEvent(event);
    });
  }

  // Function to update visual elements
  function updateVisualElements() {
    const safetySettings = document.querySelector('.run-safety-settings');
    if (!safetySettings) return;

    const activeFills = safetySettings.querySelectorAll('.mdc-slider__track--active_fill');
    const visualThumbs = safetySettings.querySelectorAll('.mat-mdc-slider-visual-thumb');

    activeFills.forEach(fill => {
      fill.style.transform = 'scaleX(0.0206897)';
    });

    visualThumbs.forEach(thumb => {
      thumb.style.transform = 'translateX(3px)';
    });

    const selectionTexts = safetySettings.querySelectorAll('.current-selection-text');
    selectionTexts.forEach(text => {
      text.textContent = 'Block none';
    });
  }

  // Main function to execute safety settings steps
  function setSafetyToNone() {
    openSafetyDialog();

    setTimeout(() => {
      setSliderValues();
      updateVisualElements();
      console.log('Safety settings updated to "Block none"');

      // 5. Close the dialog (find the close button)
      let closeButton = document.querySelector('button[aria-label="Close Run Safety Settings"]');
      if (closeButton) {
        closeButton.click();
      }
    }, 1000);
  }


  // Wait for the page to load
  window.addEventListener('load', function() {
    setTimeout(function() {
      // 1. Set Safety Settings
      setSafetyToNone();

      // 2. Set Temperature
      updateSlider(1.85);

      // 3. Set System Instructions
      let systemInstructions = document.querySelector('textarea[placeholder="Optional tone and style instructions for the model"]');
      if (systemInstructions) {
        systemInstructions.value = "Be very specific and never miss even a single detail while answering to increase the accuracy.";
        systemInstructions.dispatchEvent(new Event('input'));
      } else {
        console.error('System instructions textarea not found!');
      }

      // 4. Enable Code Execution
      let codeExecutionToggle = document.querySelector('#mat-mdc-slide-toggle-2-button');
      if (codeExecutionToggle) {
        codeExecutionToggle.click();
      }

    }, 2000); // 2-second delay
  });
})();


// MIT License

// Copyright (c) [Year] [Your Name]

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.