// ==UserScript==
// @name         Checkbox Checker
// @namespace    onemillioncheckboxeschecker
// @version      0.5 (final)
// @description  checkboxes??
// @author       (anyone)
// @license      MIT
// @match        https://onemillioncheckboxes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499072/Checkbox%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/499072/Checkbox%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetDomain = 'onemillioncheckboxes.com';
    const currentDomain = window.location.hostname;
    let maxChecksPerSecond = currentDomain.includes(targetDomain) ? 6 : Infinity; // infinity lol
    const htmlDesign = `
        <div id="checkboxSelectorContainer" style="position: fixed; top: 10px; right: 10px; z-index: 1000; background-color: white; padding: 10px; border: 1px solid #000;">
            <button id="toggleSelectionButton">Toggle Selection Mode</button>
            <br>
            <div id="radioButtonsContainer" style="display: none;">
                <input type="radio" id="check" name="selectionMode" value="check" checked>
                <label for="check">Check</label>
                <br>
                <input type="radio" id="uncheck" name="selectionMode" value="uncheck">
                <label for="uncheck">Uncheck</label>
                <br>
                <input type="radio" id="invert" name="selectionMode" value="invert">
                <label for="invert">Invert</label>
            </div>
        </div>
        <div id="overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: transparent; pointer-events: none;"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', htmlDesign);
    let isDrawing=false;let startX,startY;const selectionBox=document.createElement('div');const overlay=document.getElementById('overlay');let queuedCheckboxes=[];selectionBox.style.position='absolute';selectionBox.style.border='2px dashed #000';selectionBox.style.backgroundColor='rgba(0, 0, 0, 0.1)';selectionBox.style.pointerEvents='none';selectionBox.style.display='none';
    document.body.appendChild(selectionBox);
    function startDrawing(e) {isDrawing=true;startX=e.clientX+window.scrollX;startY=e.clientY+window.scrollY;selectionBox.style.left=`${startX}px`;selectionBox.style.top=`${startY}px`;selectionBox.style.width='0px';selectionBox.style.height='0px';selectionBox.style.display='block';}
    function drawBox(e){if(!isDrawing)return;const currentX=e.clientX+window.scrollX;const currentY=e.clientY+window.scrollY;selectionBox.style.left=`${Math.min(startX, currentX)}px`;selectionBox.style.top=`${Math.min(startY, currentY)}px`;selectionBox.style.width=`${Math.abs(currentX - startX)}px`;selectionBox.style.height=`${Math.abs(currentY - startY)}px`}
    function endDrawing(e){if(!isDrawing)return;isDrawing=!1;const endX=e.clientX+window.scrollX;const endY=e.clientY+window.scrollY;selectionBox.style.display='none';const checkboxes=document.querySelectorAll('input[type=checkbox]');const mode=document.querySelector('input[name="selectionMode"]:checked').value;checkboxes.forEach(checkbox=>{const rect=checkbox.getBoundingClientRect();const checkboxLeft=rect.left+window.scrollX;const checkboxTop=rect.top+window.scrollY;const checkboxRight=rect.right+window.scrollX;const checkboxBottom=rect.bottom+window.scrollY;if(checkboxLeft>=Math.min(startX,endX)&&checkboxRight<=Math.max(startX,endX)&&checkboxTop>=Math.min(startY,endY)&&checkboxBottom<=Math.max(startY,endY)){const isChecked=checkbox.checked;if((mode==='check'&&!isChecked)||(mode==='uncheck'&&isChecked)||mode==='invert'){queuedCheckboxes.push({checkbox,mode})}}});overlay.style.pointerEvents='none'}
    function processQueuedCheckboxes(){if(queuedCheckboxes.length===0)return;const{checkbox,mode}=queuedCheckboxes.shift();if(mode==='check'&&!checkbox.checked){checkbox.click()}else if(mode==='uncheck'&&checkbox.checked){checkbox.click()}else if(mode==='invert'){checkbox.click()}}
    function enableBoxSelection(){overlay.style.pointerEvents='auto';document.addEventListener('mousedown',startDrawing);document.addEventListener('mousemove',drawBox);document.addEventListener('mouseup',endDrawing)}
    function disableBoxSelection(){overlay.style.pointerEvents='none';document.removeEventListener('mousedown',startDrawing);document.removeEventListener('mousemove',drawBox);document.removeEventListener('mouseup',endDrawing)}
    let selectionMode=!1;const radioButtonsContainer=document.getElementById('radioButtonsContainer');const toggleButton=document.getElementById('toggleSelectionButton');toggleButton.addEventListener('click',()=>{selectionMode=!selectionMode;if(selectionMode){enableBoxSelection();toggleButton.textContent='Disable Selection Mode';radioButtonsContainer.style.display='block'}else{disableBoxSelection();toggleButton.textContent='Enable Selection Mode';radioButtonsContainer.style.display='none'}})
    setInterval(processQueuedCheckboxes, 1000 / maxChecksPerSecond);
})();