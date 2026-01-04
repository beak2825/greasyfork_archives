// ==UserScript==
// @name        Hack - hamrocsit.com
// @namespace   Violentmonkey Scripts
// @match       https://hamrocsit.com/*
// @grant       none
// @version     0.3
// @author      imxitiz
// @description 4/4/2023, 4:33:28 PM
// @license     GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/490813/Hack%20-%20hamrocsitcom.user.js
// @updateURL https://update.greasyfork.org/scripts/490813/Hack%20-%20hamrocsitcom.meta.js
// ==/UserScript==

try {
  // Check if tucsitnotes is defined before accessing its properties
  if (typeof tucsitnotes !== 'undefined') {
    tucsitnotes["hassubscription"] = "1";
    tucsitnotes["is_user_login"] = "1";
  }

  // Check if toggleTheme function exists before calling it
  if (typeof toggleTheme === 'function') {
    toggleTheme(1);
  }
} catch (e) {
  console.error("ERROR:::::", e);
}

// Check if .modal-dialog element exists before manipulating its style
var modalDialog = document.querySelector(".modal-dialog");
if (modalDialog) {
  modalDialog.style.cssText = "max-width:none; margin:20px";
}

// Check if .style-switcher element exists before manipulating its style
var styleSwitcher = document.querySelector(".style-switcher");
if (styleSwitcher) {
  styleSwitcher.style.display = "none";
}

// Check if .modal-dialog-scrollable element exists before manipulating its style
var modalDialogScrollable = document.querySelector(".modal-dialog-scrollable");
if (modalDialogScrollable) {
  modalDialogScrollable.style.height = "none";
}

// Check if any .course-single-tab .nav .nav-link elements exist before iterating and changing color
var navLinks = document.querySelectorAll(".course-single-tab .nav .nav-link");
if (navLinks.length > 0) {
  navLinks.forEach(link => link.style.color = "#00af92");
}

// Find and remove the element with class ".footer" within the "footer" element
var footerElement = document.querySelector("footer");
if (footerElement) {
  footerElement.remove();
}

// Create a style element
var styleElement = document.createElement("style");
// Set the CSS rules for hiding .modal-footer
styleElement.textContent = ".modal-footer { display: none !important; }";
// Append the style element to the document head
document.head.appendChild(styleElement);

// @media (min-width:576px) {

 // .modal-dialog {
 //  /*! max-width:var(--bs-modal-width); */
 //  /*! margin-right:auto; */
 //  /*! margin-left:auto */
 // }
// }
