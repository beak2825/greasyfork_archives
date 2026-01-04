// ==UserScript==
// @name         iListTech
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Alex Rak
// @grant        none
// @match        *
// @description The most powerful seller focused features you can add to your site
// @downloadURL https://update.greasyfork.org/scripts/459384/iListTech.user.js
// @updateURL https://update.greasyfork.org/scripts/459384/iListTech.meta.js
// ==/UserScript==

'use strict';
function load_homeValuation(e) {
    var domain = "ilist"; //REPLACE 'ilist' with your ilisttech's website name.

    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4_OTImVAkDJeZbdsD6_o4mb2rQylNvD8&libraries=places&callback=initAutocomplete";
    document.head.appendChild(script);
    var divContent = "<div id=\"ilist-content\" class='m-t-1 p-b-3' hidden><div class=\"container\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"row\"><div class=\"col-md-9 form-group\"><input id=\"txt-search-sell\" class=\"form-control form-control-md\" type=\"text\" placeholder=\"Enter Your Address\" aria-label=\"Enter Your Address\" autocomplete=\"new-password\"></div><div class=\"col-md-3 form-group\"><input id=\"txt-search-sell-unit-no\" class=\"form-control form-control-md\" type=\"text\" placeholder=\"Unit #\" aria-label=\"Unit\" autocomplete=\"new-password\"></div></div><form id=\"ilist-valuation-form\" action=\"https://{your-domain}.ilisttech.com/Valuate/EmbedValuate\" method=\"post\"><input type=\"hidden\" name=\"street\" id=\"street\"><input type=\"hidden\" name=\"route\" id=\"route\"><input type=\"hidden\" name=\"locality\" id=\"locality\"><input type=\"hidden\" name=\"state\" id=\"state\"><input type=\"hidden\" name=\"zip\" id=\"zip\"><input type=\"hidden\" name=\"unitNo\" id=\"unitNo\"><button type=\"submit\" style=\"display: none; width: 100%\" class=\"btn u-btn-orange g-rounded-10\" id=\"button-get-home-value\">Get My Home Value!</button><div id=\"processing-message\" class=\"g-py-13 h6 alert g-bg-blue g-color-white g-mt-0\" style=\"display: none; width: 100%\"><i class=\"fa fa-spinner fa-spin g-mr-5\"></i> Calculating Home Value...</div></form></div><div class=\"col-md-5\"></div></div></div></div></div></div>"
    divContent = divContent.replace("{your-domain}", domain);
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', "https://ilist.co/assets/style/embedded.css");
    document.head.appendChild(link);
    var kvCore = document.querySelectorAll('[href="/seller/valuation/"]');
    if (kvCore.length > 0) {
        kvCore[0].setAttribute("href", "/resources/selling-options");
        const title = document.querySelector(".cover-title-inner");
        const container = document.querySelector("div.content div.container");
        const searchbar = document.getElementById("horizontal-search");
        if (searchbar != null) {
            searchbar.hidden = true;

            var html = '<div class="row" style="margin-top:30px;" id="button-section"><div class="col-md-1"></div><div class="col-md-3"><button id="btn-buy" style="background-color: white" type="button" class="btn btn-white btn-block"><i class="fa fa-money g-color-black" aria-hidden="true"></i>Buying a Home</button></div><div class="col-md-4"></div><div class="col-md-3"><button id="btn-sell" type="button" style="background-color: white" class="btn btn-white btn-block"><i class="fa fa-home g-color-black" aria-hidden="true"></i>Selling a Home</button></div><div class="col-md-1"></div></div>';
            title.insertAdjacentHTML("afterend", html)
            const buttonSection = document.getElementById("button-section");
            buttonSection.insertAdjacentHTML("afterend", divContent)

            const btnBuy = document.getElementById("btn-buy");
            const btnSell = document.getElementById("btn-sell");
            const content = document.getElementById("ilist-content");

            btnBuy.addEventListener('click', () => {
                searchbar.hidden = false;
                content.hidden = true;
                btnBuy.classList.add("btn-primary");
                btnSell.classList.remove("btn-primary");
            });

            btnSell.addEventListener('click', () => {
                content.hidden = false;
                searchbar.hidden = true;
                btnSell.classList.add("btn-primary");
                btnBuy.classList.remove("btn-primary");
            });
        }
}
}

var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name',
    sublocality_level_1: 'long_name'
};

function initAutocomplete() {
    document.getElementById("button-get-home-value").onclick = onBtnClick;

    var autocompleteInput = document.getElementById("txt-search-sell");

    var observerHack = new MutationObserver(function () {
        observerHack.disconnect();
        document.getElementById("txt-search-sell").setAttribute("autocomplete", "new-password");
    });

    observerHack.observe(autocompleteInput, {
        attributes: true,
        attributeFilter: ['autocomplete']
    });

    autocomplete = new google.maps.places.Autocomplete((document.getElementById('txt-search-sell')), { types: ['geocode'] });
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    var place = autocomplete.getPlace();

    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        var val = place.address_components[i][componentForm[addressType]];
        if (componentForm[addressType] && addressType == "street_number") {
            document.getElementById("street").value = val;
        }
        if (componentForm[addressType] && addressType == "route") {
            document.getElementById("route").value = val;
        }
        if (componentForm[addressType] && (addressType == "locality" || addressType == "sublocality_level_1")) {
            document.getElementById("locality").value = val;
        }
        if (componentForm[addressType] && addressType == "administrative_area_level_1") {
            document.getElementById("state").value = val;
        }
        if (componentForm[addressType] && addressType == "postal_code") {
            document.getElementById("zip").value = val;
        }
    }
    document.getElementById("button-get-home-value").style.display = "";

}

function onBtnClick(e) {
    document.getElementById("button-get-home-value").setAttribute("disabled", "disabled");
    document.getElementById("processing-message").style.display = "";
    document.getElementById("unitNo").value = document.getElementById("txt-search-sell-unit-no").value;
    document.getElementById("ilist-valuation-form").submit();
}
load_homeValuation();