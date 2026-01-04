// ==UserScript==
// @name         Show All NSFW Covers Cuddly Octopus
// @version      2024-07-07
// @namespace    TyMcCuddly
// @description  Show the R18 covers for some covers that are disabled outside of Japan.
// @author       TyMc
// @license      MIT
// @match        https://cuddlyoctopus.com/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cuddlyoctopus.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/507178/Show%20All%20NSFW%20Covers%20Cuddly%20Octopus.user.js
// @updateURL https://update.greasyfork.org/scripts/507178/Show%20All%20NSFW%20Covers%20Cuddly%20Octopus.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function getCookieValue(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function nextVariant(letter) {
        let charCode = letter.charCodeAt(0);
        return String.fromCharCode(charCode + 1);
    }

    let cookie = getCookieValue("sfw_version");
    let showNSFW = cookie == 0;

    if (!showNSFW) return;

    let nsfwElement = document.querySelector("input[name=attribute_pa_variant][value*=r18]")
    let nsfwAlreadyShown = nsfwElement !== null && nsfwElement !== undefined;

    if (nsfwAlreadyShown) return;

    let variantsTableRow = document.querySelector("tr.attribute-pa_variant td.value")
    let product = document.querySelector(".variations_form.cart");
    let variantsInformation = product.attributes['data-product_variations'].value;
    let variants = JSON.parse(variantsInformation);
    let product_id = product.attributes["data-product_id"].value;

    let r18Variants = variants.filter((e) => {return !e.attributes.attribute_pa_variant.includes("aa");})
    let variant_version = r18Variants.length > 1 ? "a" : "";

    for(let i = 0; i < r18Variants.length; ++i){
          const div = document.createElement('div');

        let variant_value = r18Variants[i].attributes.attribute_pa_variant
        if (variant_value == "") {
            variant_value = `r18${variant_version}`
        }

        div.innerHTML = `
<input type="radio" name="attribute_pa_variant" value="${variant_value}" id="pa_variant_v_${variant_value}${product_id}">
<label for="pa_variant_v_${variant_value}${product_id}"><span>R-18 ${variant_value}</span></label>
  `;

        variantsTableRow.appendChild(div);
        console.log(`Added variant to list ${variant_value}: ${r18Variants[i]}`);

        variant_version = nextVariant(variant_version);
    }
})();