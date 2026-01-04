// ==UserScript==
// @name        allow_paste_in_browser_without_interaction
// @namespace   Violentmonkey Scripts
// @include     *
// @grant       none
// @version     0.0.1
// @author      liudonghua123
// @license MIT
// @description 10/26/2023, 4:16:51 PM
// @downloadURL https://update.greasyfork.org/scripts/478299/allow_paste_in_browser_without_interaction.user.js
// @updateURL https://update.greasyfork.org/scripts/478299/allow_paste_in_browser_without_interaction.meta.js
// ==/UserScript==

(function allow_paste_in_browser_without_interaction() {

    // https://superuser.com/questions/919625/how-to-paste-text-into-input-fields-that-block-it
    const forceBrowserDefault = function(e){
        e.stopImmediatePropagation();
        return true;
    };
  
    document.addEventListener('copy', forceBrowserDefault, true);
    document.addEventListener('cut', forceBrowserDefault, true);
    document.addEventListener('paste', forceBrowserDefault, true);
})();