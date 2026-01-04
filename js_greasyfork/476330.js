// ==UserScript==
// @name        ER4U Scripts
// @namespace   Violentmonkey Scripts
// @match       https://er4uenterpriseplus.in/er4u/jeshmargin/*
// @match       https://er4uenterpriseplus.in/er4u/jeshmargin/sale_*
// @match       https://er4uenterpriseplus.in/er4u/jeshmargin/report_*.php
// @grant       none
// @version     1.2
// @author      Jery
// @license     MIT
// @description 27/9/2023, 3:35:46 pm
// @downloadURL https://update.greasyfork.org/scripts/476330/ER4U%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/476330/ER4U%20Scripts.meta.js
// ==/UserScript==
(function() {
    'use strict';

	// Press 'Esc' to click close buttons
	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape') {
			let closeBtn = document.querySelector('#cboxClose');
			if (closeBtn) {
				closeBtn.click();
			} else {
				console.log("Element with id 'cboxClose' not found");
			}
		}
	});
  
  // Remove Store report button from top bar
  document.querySelector('a[href="report_purchase.php"]').parentNode.parentElement.parentElement.remove();


if (window.location.href.includes("sale_"))
{
	// Override distracting alerts with a neat toast
	window.confirm = function ( text ) { showToast('Confirm: \n' + text, 4000); return true; };
	// window.alert = function ( text ) { showToast('Confirm: \n' + text, 4000); return true; };

	// Auto Confirm on removing customer
	let removeCustomerBtn = document.querySelector(".fa.fa-close");
	removeCustomerBtn.addEventListener('click', function() {
        setTimeout(function() {
			let confirmBtn = document.querySelector("div.jconfirm-buttons > button:nth-child(1)")
            confirmBtn.click();
        }, 300);
    });

	// Auto set membership to true for customers
	let observer = new MutationObserver((mutationList, observer) => {
		mutationList.forEach(mutation => {
			let newValue = mutation.target.value;
			if (newValue !="XXXXXXXXXX" && newValue !="")
				setTimeout(function() {document.querySelector("#member_shipstus").value = 'Yes';}, 500);
		});
	});
	observer.observe(document.querySelector("#mobno"), { attributes: true });

	// Auto close sale log screen
	setTimeout(function() {document.querySelector("#cboxClose").click()}, 1000);

	// Make redemtion last option in tender
	let tenderArea = document.querySelector('div.tender_wrapper div.content.cs-field');
	let memberCardArea = document.querySelector("div.content.mt1-20.new-scr-css > div.CSSTableGenerator");
	let memberCard = memberCardArea.querySelector('.memcard_tbl');
	let redemptionArea = tenderArea.children[1];
	memberCardArea.removeChild(memberCard);
	redemptionArea.prepend(memberCard);
	tenderArea.removeChild(redemptionArea);
	tenderArea.appendChild(redemptionArea);
}
else if (window.location.href.includes("report_"))
{
	// Highlight credit sales in sales report.
	document.querySelectorAll("#example1 > tbody:nth-child(2) > tr").forEach(it => {
		if (it.innerText.includes('Credit'))
			it.style.backgroundColor = '#f2f2f2 !important';
	});
}
else if (window.location.href.includes("purchase_"))
{
  document.addEventListener('click', function(event) {
    if (event.target.matches('[name="totpurrate-[]"]')) {
      let row = event.target.parentNode.parentNode;
      let netPurRateBtn = row.querySelector('[name="totpurrate-[]"]');
      let totQtyBtn = row.querySelector('[name="netqty-[]"]');
      let purRateBtn = row.querySelector('[name="purprice-[]"]');

      console.log(netPurRateBtn)
      console.log(totQtyBtn)
      console.log(purRateBtn)

      let totRate = prompt(`Quantity = ${totQtyBtn.value}\nEnter Net Purchase Rate.`, totQtyBtn.value);
      netPurRateBtn.value = totRate;
      purRateBtn.value = (totRate / totQtyBtn.value).toFixed(3);
    }
  });
}


	/***************************************************************
	 * Display a simple toast message on the top right of the screen
	 ***************************************************************/
	function showToast(message, timeout=3000) {
		var x = document.createElement("div");
		x.innerHTML = message;
		x.style.color = "#000";
		x.style.backgroundColor = "#fdba2f";
		x.style.borderRadius = "10px";
		x.style.padding = "10px";
		x.style.position = "fixed";
		x.style.top = "5px";
		x.style.right = "5px";
		x.style.fontSize = "large";
		x.style.fontWeight = "bold";
		x.style.zIndex = "10000";
		x.style.display = "block";
		x.style.borderColor = "#565e64";
		x.style.transition = "right 2s ease-in-out";
		document.body.appendChild(x);

		setTimeout(function () {
			x.style.right = "-1000px";
		}, timeout-1000);

		setTimeout(function () {
			x.style.display = "none";
			document.body.removeChild(x);
		}, timeout);
	}
})();