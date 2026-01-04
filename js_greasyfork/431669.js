// ==UserScript==
// @name         Neopets: Shop Wizard refresher
// @author       Tombaugh Regio
// @version      1.0
// @description  Refreshes the Shop Wizard, and opens any links
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/shops/wizard.phtml
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/431669/Neopets%3A%20Shop%20Wizard%20refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/431669/Neopets%3A%20Shop%20Wizard%20refresher.meta.js
// ==/UserScript==

function searchShopWizard() {
  if (document.querySelector("#submit_wizard")) {
    //Refresh when the form is submitted
    const submitButton = document.querySelector("#submit_wizard")
    
    window.setTimeout(searchShopWizard, 1000)
  }
  
  if (document.querySelector(".wizard-results-grid")) {
    const resubmitButton = document.querySelector("#resubmitWizard")
    let shopsToVisit = []
    
    function getSearchResults() {
      
      function removeItems(maxItems) {
        for (const [i, item] of items.entries()) {
          if (i > maxItems) item.remove()
        }
      }
      
      const [header, ...items] = document
      .querySelector(".wizard-results-grid.wizard-results-grid-shop")
      .querySelectorAll("li")
      
      //Reset shops to visit
      shopsToVisit = []
      
      //Hide items above a certain length
      const maxItems = 5
      let isHidden = false
      if (items.length > maxItems) {
        removeItems(maxItems)
        isHidden = true
      }
      
      for (const item of items) {
        shopsToVisit.push(item.querySelector("a").href)
      }
      
      for (const link of shopsToVisit) {
          GM_openInTab(link)
        }      
      
      resubmitButton.click()
    }
    
    getSearchResults()
    
    //Refresh 360 times an hour
    window.setTimeout(searchShopWizard(), 10000 + Math.random() * 5000)
  }
}

searchShopWizard()

//Condenses the search header
GM_addStyle('#shopWizardFormResults .wizard-results-header, #shopWizardFormResults .wizard-results-text {display: block;}')