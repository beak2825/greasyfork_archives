// ==UserScript==
// @name         Gogoanime New UI
// @version      3.2.1
// @namespace    https://sharadcodes.github.io
// @author       sharadcodes
// @license      MIT
// @description  A new UI layout for Gogoanime
// @supportURL   https://github.com/sharadcodes/UserScripts/issues
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.io\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.vc\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.tv\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.in\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.se\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.sh\//
// @include      /^https?:\/\/(w+.?\.)?gogoanimes\.co\//
// @include      /^https?:\/\/(w+.?\.)?gogoanimes\.tv\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.video\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.so\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.wiki\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.is\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.film\//
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/436579/Gogoanime%20New%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/436579/Gogoanime%20New%20UI.meta.js
// ==/UserScript==

(function() {
  var JS_SCRIPTS = [
    'https://sharadcodes.github.io/UserScripts/gogoanime/new_UI/new_UI.js'
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
        }
      }
    );
  })
  console.log('GOGOanime new UI by sharadcodes')
})();