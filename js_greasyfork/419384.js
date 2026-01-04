// ==UserScript==
// @name         Replace 'npm i' with 'yarn add' in npmjs.com
// @namespace    https://www.npmjs.com/
// @version      0.1
// @description  Replace 'npm i' with 'yarn add' in npmjs.com, 
// @author       You
// @match        https://www.npmjs.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419384/Replace%20%27npm%20i%27%20with%20%27yarn%20add%27%20in%20npmjscom.user.js
// @updateURL https://update.greasyfork.org/scripts/419384/Replace%20%27npm%20i%27%20with%20%27yarn%20add%27%20in%20npmjscom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let element = document.querySelector('code[title="Copy Command to Clipboard"] span');
    element.innerHTML = element.innerHTML.replace('npm i','yarn add')
})();