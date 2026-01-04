// ==UserScript==
// @name         $import
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  import npm package from jsdelivr to devtools
// @author       zhowiny
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npm.com
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/536564/%24import.user.js
// @updateURL https://update.greasyfork.org/scripts/536564/%24import.meta.js
// ==/UserScript==

async function waitUntil(condition, timeout) {
  return new Promise((resolve, reject) => {
    const t = Date.now();
    const raf = async () => {
      if (await condition()) {
        resolve();
      } else if (timeout > 0 && Date.now() - t > timeout) {
        reject({message: `timeout(${timeout})`});
      } else {
        requestAnimationFrame(raf);
      }
    }
    requestAnimationFrame(raf);
  });
}

async function importScript(pkgName, name = '__pkg') {
    if (window[name]) {
        console.warn('override variable: ${name}')
    }
    const s = document.createElement('script')
    s.type = 'module'
    s.defer = true
    s.innerText = `import pkg from "https://cdn.jsdelivr.net/npm/${pkgName}/+esm";window.${name} = pkg;`
    document.body.appendChild(s)
    await waitUntil(() => window[name])
};

(function() {
    'use strict';
    window.$import = importScript
})();