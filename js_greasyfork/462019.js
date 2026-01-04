// ==UserScript==
// @name        CFN Doc JSON Remover
// @namespace   https://github.com/pusi77
// @match       https://docs.aws.amazon.com/AWSCloudFormation/*
// @grant       none
// @version     1.1
// @author      pusi77
// @description Removes all JSON templates in Cloudformation Documentation
// @downloadURL https://update.greasyfork.org/scripts/462019/CFN%20Doc%20JSON%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/462019/CFN%20Doc%20JSON%20Remover.meta.js
// ==/UserScript==

window.addEventListener('load', async function() {
    console.log("Removing JSON templates...")
    try {
      let jsonElement = document.getElementById('JSON');
      while (jsonElement) {
        jsonElement.remove();
        jsonElement = document.getElementById('JSON');
      }
    } catch (error) {
      console.log("All JSON templates removed!")
    }
  
  }, false);
  
