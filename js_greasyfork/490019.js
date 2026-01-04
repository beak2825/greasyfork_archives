// ==UserScript==
// @name         CuddlyOctopus Add Missing R18 Buttons
// @namespace    https://midokuni.com/
// @version      2024.03.16.3
// @description  Adds Missing R18 Buttons to the Cuddly Octopus Dakimakura Version Previews
// @author       Midokuni
// @match        http*://cuddlyoctopus.com/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cuddlyoctopus.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490019/CuddlyOctopus%20Add%20Missing%20R18%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/490019/CuddlyOctopus%20Add%20Missing%20R18%20Buttons.meta.js
// ==/UserScript==

(function() {
	function htmlDecode(input) {
		var doc = new DOMParser().parseFromString(input, "text/html");
		return doc.documentElement.textContent;
	}

	let buttons = document.getElementsByName("attribute_pa_variant");
	buttons = [].slice.call(buttons, 0);
	let r18 = buttons.filter(b => !b.disabled && (b.id.indexOf("_v_r18") >= 0))
	if (r18.length > 0) return;
	const forms = JSON.parse(htmlDecode(document.getElementsByClassName("variations_form")[0].dataset.product_variations));
	let r18forms = forms.filter(f => f.attributes.attribute_pa_variant.indexOf("r18") >= 0);
	let aaforms = forms.filter(f => f.attributes.attribute_pa_variant.indexOf("aa") >= 0);
	const template = buttons.filter(b => (b.id.indexOf("_v_aa") >= 0))[0];
	const aa = forms.filter(f => f.attributes.attribute_pa_variant == template.value)[0].attributes.attribute_pa_variant;
	for (const toAdd of r18forms) {
		let holder = document.createElement("div");
		const r18rep = toAdd.attributes.attribute_pa_variant;
		holder.innerHTML = template.parentElement.innerHTML.replaceAll(aa, r18rep).replaceAll("All Ages","R-18");
		holder.getElementsByTagName("input")[0].checked=false;
		holder.getElementsByTagName("input")[0].disabled=false;
		holder.getElementsByTagName("input")[0].removeAttribute("checked");
		template.parentElement.parentElement.appendChild(holder);
	}
})();