// ==UserScript==
// @name        Reddit Table Sort
// @author      sharadcodes
// @version     1.0.3
// @namespace   https://sharadcodes.github.io
// @supportURL  https://github.com/sharadcodes/UserScripts/issues
// @match       *://*reddit.com/*
// @include     https://*.reddit.com/*
// @include     https://reddit.com/*
// @description Makes all the tables sortable
// @license     MIT
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/436646/Reddit%20Table%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/436646/Reddit%20Table%20Sort.meta.js
// ==/UserScript==


window.onload = function() {
  var JS_SCRIPTS = [
    'https://sharadcodes.github.io/UserScripts/COMMON/js/libs/sortable.js'
  ]
  
  JS_SCRIPTS.forEach(function(js_script) {
    GM_xmlhttpRequest(
      {
        method: 'GET',
        url: js_script + '?time=' + Date.now(),
        onload: function(response) {
          var custom_js_script = document.createElement('script'); 
          custom_js_script.textContent = response.responseText
          document.head.appendChild(custom_js_script);
          document.querySelectorAll('table').forEach(function(table) {
            table.setAttribute('data-sortable','');
            table.querySelector('thead').style.cursor = 'pointer';
            Sortable.init();
          })
        }
      }
    );
  })
}