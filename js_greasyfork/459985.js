// ==UserScript==
// @name        allow_copy_and_selection
// @namespace   Violentmonkey Scripts
// @include     *
// @grant       none
// @version     0.0.1
// @author      liudonghua123
// @license MIT
// @description 5/25/2021, 1:16:51 PM
// @downloadURL https://update.greasyfork.org/scripts/459985/allow_copy_and_selection.user.js
// @updateURL https://update.greasyfork.org/scripts/459985/allow_copy_and_selection.meta.js
// ==/UserScript==

(function allow_copy_and_selection() {
  // document.body.oncopy=document.body.onselectstart=document.body.oncontextmenu=() => true;
  [
    'oncopy',
    'onselectstart',
    'oncontextmenu',
  ].forEach(event => {
    console.info(`config document.body.${event} = () => true`)
    document.body[event] = () => true;
  })
})();