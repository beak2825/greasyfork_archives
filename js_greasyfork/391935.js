// ==UserScript==
// @name        Inject Google Translate Widget
// @description Userscript version of "Google Translate This" from https://github.com/andreicristianpetcu/google_translate_this for Tampermonkey or Violentmonkey. v0.5 2019-11-06
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     0.5
// @copyright   Copyright 2019 Jefferson Scher. Mostly Copyright 2019 Andrei Cristian Petcu.
// @license     GPL-3.0
// @match       http*://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/391935/Inject%20Google%20Translate%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/391935/Inject%20Google%20Translate%20Widget.meta.js
// ==/UserScript==

var injectedStatus = false, hostarray = [];

function injectGoogleTranslateWidget(){
  if (window.self !== window.top) return; // Not in frames
  if (injectedStatus !== false) return; // Not if already injected
  
  // From: https://github.com/andreicristianpetcu/google_translate_this/blob/master/scripts/inject_google_translate_content.js as of Sept. 8, 2019 (last line omitted)
  var gtdiv = document.createElement("div");
  gtdiv.setAttribute("id", "google_translate_element");
  gtdiv.style.display="none";
  document.body.appendChild(gtdiv);

  var googleTranslateElementInitCode = "function(){ \
    new google.translate.TranslateElement({pageLanguage: 'auto', autoDisplay: true}, 'google_translate_element'); \
    setTimeout(function(){ \
      var iframe = document.getElementsByClassName('goog-te-banner-frame')[0]; \
      var iframeDocument = iframe.contentDocument || iframe.contentWindow.document; \
      iframeDocument.getElementsByClassName('goog-te-button')[0].children[0].children[0].click(); \
    }, 1000); \
  }";

  var globalFunctionScript = document.createElement('script');
  globalFunctionScript.text = "googleTranslateElementInit = " + googleTranslateElementInitCode;
  globalFunctionScript.type = "text/javascript";
  document.getElementsByTagName('head')[0].appendChild(globalFunctionScript);

  var bg_script = document.createElement('script');
  bg_script.type = "text/javascript";
  bg_script.src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.getElementsByTagName('head')[0].appendChild(bg_script);
  
  injectedStatus = true; // not detecting whether it failed due to CSP
}

function addHost(){
  hostarray.push(location.hostname);
  GM_setValue("autoinjecthosts", JSON.stringify(hostarray));
  if (injectedStatus == false) injectGoogleTranslateWidget;
}

function removeHost(){
  var index = hostarray.indexOf(location.hostname);
  if (index > -1){
    hostarray.splice(index, 1);
    GM_setValue("autoinjecthosts", JSON.stringify(hostarray));
  }
}

// This should work in Violentmonkey and Tampermonkey, but unfortunately not Greasemonkey.
try {
  hostarray = JSON.parse(GM_getValue("autoinjecthosts", "[]"));
  if (hostarray.includes(location.hostname)){ // auto-inject
    if (injectedStatus == false) window.setTimeout(injectGoogleTranslateWidget, 100);
    GM_registerMenuCommand("Stop Auto-Injecting Widget", removeHost);
  } else { // on-demand
    GM_registerMenuCommand("Inject Google Translate Widget", injectGoogleTranslateWidget);
    GM_registerMenuCommand("Auto-Inject on " + location.hostname, addHost);    
  }
} catch (err) {
  console.log('Error adding Inject Google Translate Widget menu items: ' + err.message);
}
