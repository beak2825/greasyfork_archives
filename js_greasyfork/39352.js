// ==UserScript==
// @name         WMT-AddPlanProductSelection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Added a plan to the 'product added to cart' modal
// @author       You
// @match        https://www.walmart.com/*
// @grant        none
// @locale en-us
// @downloadURL https://update.greasyfork.org/scripts/39352/WMT-AddPlanProductSelection.user.js
// @updateURL https://update.greasyfork.org/scripts/39352/WMT-AddPlanProductSelection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var addToCartBtn = document.querySelector('.prod-ProductCTA--primary.btn.btn-primary.btn-block');
    addToCartBtn.onclick = () => {
    	setTimeout( () =>{
		    var planOptions = document.querySelector('.Cart-Item-CarePlan--Options');
		    let asurionPlan = document.createElement('div');
			asurionPlan.innerHTML = `
				<div class="radio-accessible" data-automation-id="cart-item-0-care-plan-options-0" data-tl-id="radio-button">
				   <input type="radio" id="radio-0" name="item-warranties-a92c2862-db82-419f-b7a4-6b805a2099db" value="on">
				   <label for="radio-0">
				      <span aria-hidden="true">
				         <span>Protection on this and all future devices</span><!-- react-text: 851 --> (<!-- /react-text --><span>+<strong>$3/month</strong></span><!-- react-text: 853 -->)<!-- /react-text -->
				      </span>
				   </label>
				</div>`;
			let planFlyout = document.createElement('span');
			planFlyout.innerHTML = `
				<div class="flyout flyout-left flyout-align-null flyout-animate inline-block-xs help-flyout CarePlan-help">
				   <div class="flyout-backdrop"></div>
				   <span class="HelpFlyout-trigger flyout-trigger" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-label="More info" role="button"><i class="elc-icon elc-icon-help"></i></span>
				   <div class="flyout-modal flyout-basic flyout-modal-wide">
				      <p class="no-margin CarePlan-help-text copy-small"><span class="CarePlan-bubble-text">
				         Provides an ongoing care plan on this and all future purchases you buy on Walmart.com for a low monthly cost. Cancel any time.
				         </span>
				      </p>
				   </div>
				</div>`;
			planFlyout.onclick = (ev) => {
				planFlyout.firstChild.nextSibling.classList.toggle('active');
			};
			asurionPlan.querySelector('label').appendChild(planFlyout);
			planOptions.appendChild(asurionPlan);
	    }, 1500);
    };
})();