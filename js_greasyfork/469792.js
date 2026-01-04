// ==UserScript==
// @name         YOPU helper
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  A script for printing scores and playing scores on Yupu.co
// @author       ChenMo
// @Github       https://github.com/Chenmo1212/Yopu-Helper
// @match        https://yopu.co/view/*
// @icon         data:image/png;base64,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
// @run-at       document-end
// @grant        none
// @require      https://unpkg.com/print-js@1.6.0/dist/print.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469792/YOPU%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/469792/YOPU%20helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Package print function
  const print = {
    chordScore: (printPage) => {
      printPage.setAttribute('id', 'print-content');
      printPage.style.height = 'auto';

      // Add padding to prevent unprinted content
      const tempPaddingDiv = document.createElement("div");
      tempPaddingDiv.style.height = "500px";
      printPage.append(tempPaddingDiv);

      printJS({ printable: 'print-content', type: 'html', header: 'PrintJS - Form Element Selection' });

      setTimeout(() => {
        tempPaddingDiv.remove();
      }, 3000);
    },
    tablature: (printPage) => {
      alert("Please refresh the page after printing.");

      const elementsToRemove = ['header', '.side', '.player-panel', '.print-sheet'];
      elementsToRemove.forEach((el) => {
        const element = document.querySelector(el);
        if (element) {
          element.remove();
        }
      });

      const noPrintElements = document.querySelectorAll(".no-print");
      noPrintElements.forEach((el) => {
        el.classList.remove("no-print");
        el.classList.add("print");
      });

      const body = document.body;
      body.style.width = "100%";
      body.style.padding = "0";
      body.style.overflow = "auto";

      printPage.style.overflow = "auto";

      const main = document.querySelector(".main");
      main.style.width = "100%";
      main.style.height = "100%";
      main.style.overflow = "auto";

      const layout = document.querySelector(".layout");
      layout.style.margin = "0";
      layout.style.width = "auto";

      window.print();
    }
  };

  // clear all timers
  const clearAllTimer = () => {
    const latestTid = setTimeout(() => {});

    for (let i = 0; i <= latestTid; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
  };

  // Handling function for clicking the print button
  const handlePrintBtnClick = () => {
    const printPage = document.querySelector(".at-surface");
    const sheetContainer = document.querySelector(".sheet-container");

    if (!printPage) {
      print.tablature(sheetContainer);
    } else {
      print.chordScore(printPage);
    }
  };

  window.onload = () => {
    const btnGroup = document.querySelector('.control');
    const originPlayBtn = document.querySelector(".accent");

    // Handling function for clicking the play button
    const handlePlayBtnClick = () => {
      originPlayBtn.click();

      setTimeout(() => {
        clearAllTimer();
      }, 3000);
    };

    // Create a print button
    const newPrintBtn = document.createElement("div");
    newPrintBtn.className = "button-container svelte-8xk2fn";
    newPrintBtn.innerHTML = `<button size='big' theme='white' type='button' class='svelte-14csrjh block'>🖨️ &nbsp; Print</button>`;
    btnGroup.append(newPrintBtn);
    newPrintBtn.onclick = handlePrintBtnClick;

    // Create play button
    const newPlayBtn = document.createElement("div");
    newPlayBtn.className = "button-container svelte-120uqgv";
    newPlayBtn.innerHTML = `<button size='big' theme='white' type='button' class='svelte-14csrjh block'>🎵 &nbsp; Play</button>`;
    btnGroup.append(newPlayBtn);
    newPlayBtn.onclick = handlePlayBtnClick;
  }
})();