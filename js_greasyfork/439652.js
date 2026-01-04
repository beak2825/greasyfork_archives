// ==UserScript==
// @name         WorkPad integration for gMail
// @description  Add WorkPad sidebar into gMail.
// @namespace    joh-tw
// @author       JOH
// @version      1.00
// @license      Copyleft (Ɔ) GPLv3
// @noframes
// @grant        none
// @match        https://mail.google.com/mail/*
// @downloadURL https://update.greasyfork.org/scripts/439652/WorkPad%20integration%20for%20gMail.user.js
// @updateURL https://update.greasyfork.org/scripts/439652/WorkPad%20integration%20for%20gMail.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function log(msg) {
    console.log(msg);
  }

  function existEl(selectorEl) {
    var el = document.querySelector(selectorEl);
    return (typeof(el) != 'undefined' && el != null);
  }

  function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild; // Change this to div.childNodes to support multiple top-level nodes
  }

  var waitingForPage = 0;
  function waitPageReady() {
    var newBtnExist = existEl('.aic');    
    if (newBtnExist) {
      doOnPageReady();
      return;
    }

    if (waitingForPage < 30 ) { // wait for 15 ses (30*500ms) for page load
      waitingForPage++;
      setTimeout(waitPageReady, 500);
    }
  }
  
  function addWorkPadSidebar() {   
    var iFrameStr = '';
    iFrameStr += '<div id="workpad" style="width: 400px;height: 100%;position: absolute;z-index: 6;top: 0px;left: 0px;background-color: #eeeeee;">';
    iFrameStr += '<iframe style="width:100%;height:100%;border: none;" src="https://workpad.talentwork.cz?release=2022-02-07"></iframe>';
    iFrameStr += '</div>';    
    document.body.appendChild( createElementFromHTML(iFrameStr) );
    
    var mailEl = document.querySelector("body > div > div.nH > div.nH");
    mailEl.style.paddingLeft = "400px";
    
  }


  // global variables --------------------------------------------------------------------------
    // var globalVarName = ...;
  // ----------------------------------------------------------------------------


  // Start the script
  function doOnPageReady() {
    addWorkPadSidebar();
  }
  waitPageReady();

})();
