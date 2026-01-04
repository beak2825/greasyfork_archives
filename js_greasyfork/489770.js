// ==UserScript==
// @name         fullscreen-key
// @version      0.1.0
// @description  space key to enter and exit fullscreen
// @author       dragonish
// @namespace    https://github.com/dragonish
// @license      GNU General Public License v3.0 or later
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489770/fullscreen-key.user.js
// @updateURL https://update.greasyfork.org/scripts/489770/fullscreen-key.meta.js
// ==/UserScript==

(function () {
  const FormControl = ['BUTTON', 'FIELDSET', 'FORM', 'INPUT', 'LABEL', 'LEGEND', 'OPTION', 'SELECT', 'TEXTAREA'];
  function isFormControl(ele) {
    if (ele) {
      return FormControl.includes(ele.tagName);
    }
    return false;
  }
  document.body.addEventListener('keypress', evt => {
    if (!isFormControl(evt.target)) {
      if (evt.key === ' ') {
        evt.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(err => {
            console.info('[fullscreen-key]: browser unable to exit fullscreen.');
            console.error(err);
          });
        } else {
          document.documentElement.requestFullscreen().catch(err => {
            console.info('[fullscreen-key]: browser unable to enter fullscreen.');
            console.error(err);
          });
        }
      }
    }
  });
})();