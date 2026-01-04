// ==UserScript==
// @name          WME HN Highlighter
// @description   A House Number script that highlights the native HN from white in yellow colour.
// @namespace     https://greasyfork.org/users/1087400-kid4rm90s
// @version       2025.12.27.01
// @include       /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @author        kid4rm90s
// @license       MIT
// @grant         GM_addStyle
// @grant         GM_xmlhttpRequest
// @connect       greasyfork.org
// @require      https://greasyfork.org/scripts/560385/code/WazeToastr.js
// @downloadURL https://update.greasyfork.org/scripts/525203/WME%20HN%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/525203/WME%20HN%20Highlighter.meta.js
// ==/UserScript==

/* global W */
/* global WazeToastr */

(function main() {
  'use strict';

  const updateMessage = '<strong>Fixed :</strong><br> - Temporary fix for alerts not displaying properly.';
  const scriptName = GM_info.script.name;
  const scriptVersion = GM_info.script.version;
  const downloadUrl = 'https://update.greasyfork.org/scripts/525203/WME%20HN%20Highlighter.user.js';
    const forumURL = 'https://greasyfork.org/scripts/525203-wme-hn-highlighter/feedback';

  console.log(`${scriptName}: Loading `);

    function scriptupdatemonitor() {
      if (WazeToastr?.Ready) {
        // Create and start the ScriptUpdateMonitor
        const updateMonitor = new WazeToastr.Alerts.ScriptUpdateMonitor(scriptName, scriptVersion, downloadUrl, GM_xmlhttpRequest);
        updateMonitor.start(2, true); // Check every 2 hours, check immediately

        // Show the update dialog for the current version
        WazeToastr.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl, forumURL);
      } else {
        setTimeout(scriptupdatemonitor, 250);
      }
    }
    scriptupdatemonitor();
  console.log(`${scriptName} initialized.`);
  // Initialize RHN once Waze has been loaded.
  function init() {
    console.log(`${scriptName} initializing.`);

    function applyStyles() {
      document.querySelectorAll('.house-numbers-layer .house-number .content .input-wrapper input').forEach((input) => {
        input.style.backgroundColor = '#07ff00'; // Bright Green
      });
      document.querySelectorAll('input[type=text],input[type=email],input[type=number],input[type=password],select,button,textarea,.form-control').forEach((input) => {
        input.style.Color = '#3d3d3d'; // black
      });
    }

    // Observe DOM changes to apply styles dynamically
    const styleObserver = new MutationObserver(applyStyles);
    styleObserver.observe(document.body, { childList: true, subtree: true });

    // Initial call to apply styles if elements already exist
    applyStyles();

    // Apply styles using GM_addStyle for better enforcement
    GM_addStyle(`
    /* Stronger selector for house number input in dark mode */
    [wz-theme="dark"] input[type="text"].custom-house-number-input {
      color: rgb(0, 0, 0) !important;
    }
    .custom-house-number-input {
      background-color: #07ff00 !important; /* Bright Green */
    }
    /* Fallback for any text input with custom class */
    input.custom-text-input {
      color: rgb(0, 0, 0) !important;
    }
    /* Add yellow background for house-number-marker only if not in dark mode */
    .house-number-marker {
      background-color: #FFFF00; /* Change to yellow */
    }
    `);

    function applyCustomClasses() {
      document.querySelectorAll('.house-number-marker').forEach((marker) => {
        marker.classList.add('custom-house-number-marker');
      });

      document.querySelectorAll('.house-numbers-layer .house-number .content .input-wrapper input').forEach((input) => {
        input.classList.add('custom-house-number-input');
      });

      document.querySelectorAll('input[type=text],input[type=email],input[type=number],input[type=password],select,button,textarea,.form-control').forEach((input) => {
        input.classList.add('custom-text-input');
      });
    }

    // Observe DOM changes to apply classes dynamically
    const classObserver = new MutationObserver(applyCustomClasses);
    classObserver.observe(document.body, { childList: true, subtree: true });

    // Initial call to apply classes if elements already exist
    applyCustomClasses();
    console.log(`${scriptName} styles and classes applied.`);
  }
})();
