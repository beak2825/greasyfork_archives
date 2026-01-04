// ==UserScript==
// @name         WMT Add WarrantyOnProductPage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.walmart.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39204/WMT%20Add%20WarrantyOnProductPage.user.js
// @updateURL https://update.greasyfork.org/scripts/39204/WMT%20Add%20WarrantyOnProductPage.meta.js
// ==/UserScript==

(function() {
    'use strict';

if (document.querySelector('.CarePlan,prod-PaddingTop--s')) {
	var asurionPlan = document.createElement('div');
	asurionPlan.innerHTML =
	`<div class="CarePlan-option CarePlan-font asurion">
		<span tabindex="0" role="link" aria-label="Add 4-Year TV Protection $30" class="CarePlan-add CarePlan-link">
			<i class="elc-icon font-bold elc-icon-16 elc-icon-add"></i>
		</span>
		<span class="CarePlan-description">
				<!-- react-text: 567 -->Add <!-- /react-text -->
			<span class="font-semibold CarePlan-margin-right">
				<em>
					Anything Coverage
				</em>
			</span>for only
			<span class="Price-currency">$</span><span class="Price-characteristic">3</span><span class="Price-mark">.</span><span class="Price-mantissa">00 monthly</span></span></span></span>
	</div>`;
	var planFlyout = document.createElement('span');
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
	planFlyout.onclick = () => {
			planFlyout.firstChild.nextSibling.classList.toggle('active');};
	asurionPlan.firstChild.appendChild(planFlyout);
	var carePlanContainer = document.querySelector('.CarePlan,prod-PaddingTop--s');
	carePlanContainer.appendChild(asurionPlan);
}


})();