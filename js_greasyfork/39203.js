// ==UserScript==
// @name         WMT-AddPlanInCart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.walmart.com/*
// @grant        none
// @locale en-us
// @downloadURL https://update.greasyfork.org/scripts/39203/WMT-AddPlanInCart.user.js
// @updateURL https://update.greasyfork.org/scripts/39203/WMT-AddPlanInCart.meta.js
// ==/UserScript==

(function(modalOuter) {
    'use strict';
    setTimeout(() =>
    {
    var cartItems = document.querySelectorAll('.Cart-Item-CarePlan.Cart-Item-CarePlan-NoCarePlan');
    console.log(cartItems);
    cartItems.forEach(
        (el) => {
        	console.log('help!');
            let asurionPlan = document.createElement('div');
			asurionPlan.innerHTML = `
				<div class="radio-accessible" data-automation-id="cart-item-0-care-plan-options-1" data-tl-id="radio-button">
				   <input type="radio" id="radio-1" name="item-warranties-a92c2862-db82-419f-b7a4-6b805a2099db" value="on">
				   <label for="radio-1">
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
			el.querySelector('form').appendChild(asurionPlan);
        }
    );
    }, 2000);

})(document.querySelector('.modal_outer'));