// ==UserScript==
// @name        Proprietary Elements
// @namespace   https://github.com/c0des1ayr
// @match       *://*/*
// @grant       GM.addStyle
// @grant       GM.xmlHttpRequest
// @run-at      document-idle
// @version     1.0
// @author      c0des1ayer
// @license     MIT
// @connect     code.jquery.com
// @connect     gist.githubusercontent.com
// @antifeature This script loads the latest version of an external script directly, which may potentially become malicious in the future.
// @description Adds compatibility for the blink and marquee elements in the form of CSS 3 animations and JQuery.
// @downloadURL https://update.greasyfork.org/scripts/543557/Proprietary%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/543557/Proprietary%20Elements.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
(async function() {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function fetchAndExecuteScript(url, callback) {
      GM.xmlHttpRequest({
          method: 'GET',
          url: url,
          onload: (response) => {
              if (response.status >= 200 && response.status < 300) {
                  const scriptText = response.responseText;
                  const script = document.createElement('script');
                  script.textContent = scriptText;
                  document.head.appendChild(script);
                  console.log(`Successfully executed script from: ${url}`);
                  callback && callback();
              } else {
                  console.error(`Failed to load script: ${url}. Status: ${response.status}`);
              }
          },
          onerror: (err) => {
            console.error(`Error fetching script: ${url}`, err);
          }
      });
    }

    if (!window.JQuery) fetchAndExecuteScript('https://code.jquery.com/jquery-3.7.1.min.js');
    await delay(250);
    fetchAndExecuteScript('https://gist.githubusercontent.com/remy/2484402/raw/50eb9541d959c842b7ad4f3d7f7346a2f49ff8cb/gistfile1.js')

    GM.addStyle(`
      @keyframes blink {0% { opacity:1 } 75% { opacity:1 } 76% { opacity:0 } 100% { opacity:0 }}
      blink {animation:blink 0.75s ease-in infinite alternate!important;}
    `)
})();
