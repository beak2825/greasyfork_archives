// ==UserScript==
// @name         Resources all auto sender
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Resources all auto sender description
// @author       ME
// @match        https://*/game.php?*&screen=market&mode=call
// @icon         https://www.google.com/s2/favicons?sz=64&domain=divokekmeny.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491405/Resources%20all%20auto%20sender.user.js
// @updateURL https://update.greasyfork.org/scripts/491405/Resources%20all%20auto%20sender.meta.js
// ==/UserScript==

(function() {
    // Function to click the select-all checkbox
    function clickSelectAll() {
      const selectAllCheckbox = document.querySelector('input[name="select-all"]');
      if (selectAllCheckbox) {
        selectAllCheckbox.click();
        console.log('Clicked on select-all checkbox.');
      } else {
        console.error('select-all checkbox not found.');
      }
    }
    
    // Function to click the submit button
    function clickSubmitButton() {
      const submitButton = document.querySelector('input[type="submit"][value="Poslat suroviny"]');
      if (submitButton) {
        submitButton.click();
        console.log('Clicked on the submit button.');
      } else {
        console.error('Submit button not found.');
      }
    }
    
    // Function to reload the page
    function reloadPage() {
      console.log('Reloading page...');
      location.reload();
    }
    
    // Start the sequence with a 5-second wait
    setTimeout(() => {
      // Click the select-all checkbox
      clickSelectAll();
    
      // Wait 2 seconds, then click the submit button
      setTimeout(() => {
        clickSubmitButton();
    
        // Wait 10 minutes, then reload the page
        setTimeout(reloadPage, 10 * 60 * 1000); // 10 minutes in milliseconds
      }, 2000); // 2 seconds in milliseconds
    }, 5000); // 5 seconds in milliseconds
})();