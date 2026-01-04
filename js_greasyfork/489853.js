// ==UserScript==
// @name        Show information tooltips on various sites
// @namespace   Violentmonkey Scripts
// @include      *://*/*
// // @match       https://portal.azure.com/*
// // @match       https://portal.azure.com/*//
// @grant       none
// @version     1.0
// @author      chaoscreater
// @description 1/16/2024, 8:12:42 PM
// @downloadURL https://update.greasyfork.org/scripts/489853/Show%20information%20tooltips%20on%20various%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/489853/Show%20information%20tooltips%20on%20various%20sites.meta.js
// ==/UserScript==
 
 
 
 
(function()
{
	'use strict';
 
	var reminderDiv = document.createElement('div');
	var site = location.hostname;
	var contentHTML = '';
 
  // testing
  var site = window.location.href;
 
  var DisplayPopup = false;
  var Delay_Load = false;
 
  if (site.includes('dev.azure.com') || site.includes('xxxxxxxxxxxxxx.atlassian.net/wiki/')) {
      var DisplayPopup = true;
 
      contentHTML = '<a href="https://xxxxxxxxxx.sharepoint.com/:x:/r/sites/msteams_07b25e_347786/_layouts/15/Doc.aspx?sourcedoc=%xxxxxxxxxxxxxxxxxx%7D&file=Application%20portfolio%20inventory.xlsx&action=default&mobileredirect=true&DefaultItemOpen=1">Application Portfolio Inventory</a> <br><br>' +
                    '<strong>IFRS</strong> - xxxxxxxxxxxxxxxxxx (technology platform) <br><br>';
  }
 
 
  else if (site.includes('duckduckgo.com') || site.includes('www.google.com/search')) {
      var DisplayPopup = true;
 
 
      contentHTML = '<strong>Enhanced word highlight userscript hotkeys</strong><br><br>' +
                    '<strong>N</strong> : Next word occurrence<br><br>' +
                    '<strong>SHIFT + N</strong> : Previous word occurence<br><br>' +
                    '<strong>ALT + /</strong> : Add keywords<br>' +
                    '<strong>CTRL + ALT + /</strong> : Disable highlight<br><br>' +
                    '<strong>ALT + -</strong> : Edit highlight<br><br>' +
                    '<strong>R</strong> : Refresh highlight<br><br>';
  }
 
 
 
 
 
 
 
 
	// Version 2
 
	function createPopup()
  {
    if (DisplayPopup === true)
    {
 
      var reminderDiv = document.createElement('div');
      reminderDiv.id = 'yourPopupId';
 
      var dragHandle = document.createElement('div');
      dragHandle.style.height = '20px';
      dragHandle.style.backgroundColor = '#ccc';
      dragHandle.style.cursor = 'move';
      dragHandle.innerHTML = 'Drag here';
      dragHandle.style.textAlign = 'center';
      reminderDiv.appendChild(dragHandle);
 
      var toggleButton = document.createElement('button');
      toggleButton.innerHTML = 'Show / Hide';
      toggleButton.style.marginTop = '10px';
      toggleButton.style.marginBottom = '10px';
      reminderDiv.appendChild(toggleButton);
 
      var contentDiv = document.createElement('div');
 
      /*
      if (!site.toLowerCase().includes('temu.com/nz/bgt_orders.html') && !site.toLowerCase().includes('temu.com/bgt_orders.html')) {
        contentHTML += '<br><br> <a href="https://www.cheapies.nz/deals/longrunning">Long running deals</a> <br><br> <a href="https://www.cheapies.nz/forum">Forum</a> <br><br>';
      }
      */
 
      contentDiv.innerHTML = contentHTML;
      reminderDiv.appendChild(contentDiv);
 
      reminderDiv.style.position = 'fixed';
      reminderDiv.style.padding = '10px 10px 0px 10px';
      reminderDiv.style.backgroundColor = 'cyan';
      reminderDiv.style.border = '2px solid black';
      reminderDiv.style.zIndex = '10000';
      reminderDiv.style.width = localStorage.getItem('popupWidth_' + window.location.origin) || '290px';
      reminderDiv.style.maxWidth = '500px';
      reminderDiv.style.wordWrap = 'break-word';
      reminderDiv.style.resize = 'both';
      reminderDiv.style.overflow = 'auto';
      reminderDiv.style.top = localStorage.getItem('popupTop_' + window.location.origin) || '50%';
      reminderDiv.style.left = localStorage.getItem('popupLeft_' + window.location.origin) || '10px';
 
      // Check if isContentVisible is not found in local storage, default to true
      var isContentVisible = localStorage.getItem('isContentVisible_' + window.location.origin);
      if (isContentVisible === null) {
        isContentVisible = true;
      } else {
        isContentVisible = isContentVisible === 'true';
      }
 
      if (!isContentVisible) {
        contentDiv.style.display = 'none';
        reminderDiv.style.height = 'auto';
        localStorage.setItem('popupOriginalWidth_' + window.location.origin, reminderDiv.style.width);
        dragHandle.style.width = toggleButton.offsetWidth + 'px';
        reminderDiv.style.width = 'auto';
        dragHandle.style.width = '';
      }
 
      toggleButton.addEventListener('click', function () {
        isContentVisible = !isContentVisible;
        localStorage.setItem('isContentVisible_' + window.location.origin, isContentVisible);
 
        if (!isContentVisible) {
        contentDiv.style.display = 'none';
        reminderDiv.style.height = 'auto';
        localStorage.setItem('popupOriginalWidth_' + window.location.origin, reminderDiv.style.width);
        dragHandle.style.width = toggleButton.offsetWidth + 'px';
        reminderDiv.style.width = 'auto';
        } else {
        contentDiv.style.display = 'block';
        reminderDiv.style.height = 'auto';
        reminderDiv.style.width = localStorage.getItem('popupOriginalWidth_' + window.location.origin);
        dragHandle.style.width = '';
        }
      });
 
      dragHandle.addEventListener('mousedown', function (e) {
        var offsetX = e.clientX - parseInt(window.getComputedStyle(reminderDiv).left);
        var offsetY = e.clientY - parseInt(window.getComputedStyle(reminderDiv).top);
 
        function mouseMoveHandler(e) {
        reminderDiv.style.top = (e.clientY - offsetY) + 'px';
        reminderDiv.style.left = (e.clientX - offsetX) + 'px';
        }
 
        function mouseUpHandler() {
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        localStorage.setItem('popupTop_' + window.location.origin, reminderDiv.style.top);
        localStorage.setItem('popupLeft_' + window.location.origin, reminderDiv.style.left);
        }
 
        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
      });
 
      document.body.appendChild(reminderDiv);
 
      // Calculate maximum allowable top and left positions
      var maxTop = window.innerHeight - reminderDiv.offsetHeight;
      var maxLeft = window.innerWidth - reminderDiv.offsetWidth;
 
      var storedTop = parseInt(localStorage.getItem('popupTop_' + window.location.origin)) || 0;
      var storedLeft = parseInt(localStorage.getItem('popupLeft_' + window.location.origin)) || 0;
 
      reminderDiv.style.top = Math.min(Math.max(storedTop, 0), maxTop) + 'px';
      reminderDiv.style.left = Math.min(Math.max(storedLeft, 0), maxLeft) + 'px';
 
 
      reminderDiv.addEventListener('mousemove', function () {
        if (isContentVisible) {
        localStorage.setItem('popupWidth_' + window.location.origin, reminderDiv.style.width);
        localStorage.setItem('popupHeight_' + window.location.origin, reminderDiv.style.height);
        }
      });
    }
  }
 
 
 
	function displayPopup() {
 
    if (DisplayPopup === true)
    {
      var existingPopup = document.getElementById('yourPopupId');
      if (!existingPopup) {
        createPopup();
      } else {
        var popupTop = localStorage.getItem('popupTop_' + window.location.origin) || '50%';
        var popupLeft = localStorage.getItem('popupLeft_' + window.location.origin) || '10px';
        var popupWidth = localStorage.getItem('popupWidth_' + window.location.origin) || '290px';
        var popupHeight = localStorage.getItem('popupHeight_' + window.location.origin) || 'auto';
 
        var maxTop = window.innerHeight - existingPopup.offsetHeight;
        var maxLeft = window.innerWidth - existingPopup.offsetWidth;
 
        var storedTop = parseInt(localStorage.getItem('popupTop_' + window.location.origin)) || 0;
        var storedLeft = parseInt(localStorage.getItem('popupLeft_' + window.location.origin)) || 0;
 
        existingPopup.style.top = Math.min(Math.max(storedTop, 0), maxTop) + 'px';
        existingPopup.style.left = Math.min(Math.max(storedLeft, 0), maxLeft) + 'px';
 
 
        //existingPopup.style.top = popupTop;
        //existingPopup.style.left = popupLeft;
        existingPopup.style.width = popupWidth;
        existingPopup.style.height = popupHeight;
      }
	  }
  }
 
 
 
  if (DisplayPopup === true) {
      if (Delay_Load === true) {
          setTimeout(function() {
              // Your logic to check if popup should be displayed
              if (DisplayPopup === true) {
                  if (!sessionStorage.getItem('popupCreated')) {
                      displayPopup();
                      sessionStorage.setItem('popupCreated', 'true');
                  }
 
                  window.addEventListener('beforeunload', function() {
                      sessionStorage.removeItem('popupCreated');
                  });
              }
          }, 2000); // Wait for 2 seconds before executing
      } else {
          // Your logic to check if popup should be displayed without delay
          if (!sessionStorage.getItem('popupCreated')) {
              displayPopup();
              sessionStorage.setItem('popupCreated', 'true');
          }
 
          window.addEventListener('beforeunload', function() {
              sessionStorage.removeItem('popupCreated');
          });
      }
  }
 
 
 
 
})();