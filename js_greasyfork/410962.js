// ==UserScript==
// @name        New script - reactjs.org
// @namespace   Violentmonkey Scripts
// @match       https://reactjs.org/
// @grant       none
// @version     1.0
// @author      -
// @description 9/7/2020, 3:03:49 PM
// @downloadURL https://update.greasyfork.org/scripts/410962/New%20script%20-%20reactjsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/410962/New%20script%20-%20reactjsorg.meta.js
// ==/UserScript==

setInterval(() => {

  const $BLMdiv = document.querySelector(".css-f5odvb");
  if(/^Black/.test($BLMdiv.innerText)){
    $BLMdiv.innerHTML = $BLMdiv.innerHTML.replace("Black", "All Black");
    $BLMdiv.removeChild($BLMdiv.querySelector("a"))
  }
}, [1000])