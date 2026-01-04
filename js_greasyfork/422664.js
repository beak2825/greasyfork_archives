// ==UserScript==
// @name         USDColumnYnab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agregua columna dolarizada del disponible.
// @author       Emiliano D.
// @match        https://app.youneedabudget.com/*
// @downloadURL https://update.greasyfork.org/scripts/422664/USDColumnYnab.user.js
// @updateURL https://update.greasyfork.org/scripts/422664/USDColumnYnab.meta.js
// ==/UserScript==
 
 
(function () {
  		var items = document.getElementsByClassName("budget-table-row");
  		for (i = 0; i < items.length; i++) {
		  var amount = document.getElementById(items[i].id).getElementsByClassName("budget-table-cell-available")[0].getElementsByTagName("span")[0].innerHTML;
		  var fix_amount = amount.replace(" ", "").replace("<bdi>$</bdi>", "").replace(".", "").replace(",", ".");
		  var dolar = document.getElementById(items[i].id).getElementsByClassName("tk-goal-table-cell")[0];
		  if (dolar) {
		  	dolar.innerHTML = "<div class='toolkit-target-goal-amount currency'>USD " + (parseFloat(fix_amount) / 150).toFixed(2) + "</div>";
		  }
		}
})();