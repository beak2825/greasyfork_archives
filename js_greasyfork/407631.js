// ==UserScript==
// @name         Instructions Please!!
// @namespace    https://greasyfork.org/en/scripts/407631-instructions-please
// @version      1.1.2
// @description  Gets things back to normal
// @author       Curtidawg
// @grant        GM_getValue // this will help prevent a bug in js
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/407631/Instructions%20Please%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/407631/Instructions%20Please%21%21.meta.js
// ==/UserScript==


let crowd =
       document.querySelector("body > crowd-entity-annotation").shadowRoot.querySelector("#wrapform").shadowRoot.querySelector("#react-mount-point > div > div > header > div.headerButtonsContainer > awsui-button > button") ;

  if (crowd){
      e.preventDefault();
      crowd.shadowRoot.querySelector(`[type='button']`).click();
    } else {
      e.preventDefault();
      document.querySelector(`[type='button']`).click();
    }