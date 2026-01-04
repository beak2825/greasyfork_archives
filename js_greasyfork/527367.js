// ==UserScript==
// @name         Workflowy Code to Fira Code
// @version      2025-02-18
// @description  Uses Fira Code (or the Nerd Font variant) for all inline code or code-block entries on Workflowy
// @author       5310
// @match        https://workflowy.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workflowy.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1436706
// @downloadURL https://update.greasyfork.org/scripts/527367/Workflowy%20Code%20to%20Fira%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/527367/Workflowy%20Code%20to%20Fira%20Code.meta.js
// ==/UserScript==

const addStyle = css => {
    var n = document.createElement('style')
    n.type = "text/css"
    n.innerHTML = css
    document.getElementsByTagName('head')[0].appendChild(n)
}

(function() {
    'use strict';
    addStyle(`
      .code-block > .name > .content, code {
        font-family: "FiraCode Nerd Font", "Fira Code", sans-serif !important;
      }
    `)
})();