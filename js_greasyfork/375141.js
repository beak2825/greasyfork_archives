// ==UserScript==
// @name           Meat Specials
// @description    Fetch meat specials for the week
// @version        0.0.1
// @include        *?meatspecials
// @require        https://code.jquery.com/jquery-3.2.1.js
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/139930
// @downloadURL https://update.greasyfork.org/scripts/375141/Meat%20Specials.user.js
// @updateURL https://update.greasyfork.org/scripts/375141/Meat%20Specials.meta.js
// ==/UserScript==

var MadButcher = "Mad Butcher:\n\n";
var PakNSave = "\nPakNSave:\n\n";

(function CheckMadButcher() {
	GM_xmlhttpRequest({
		method: "POST",
		headers: {"Content-type" : "application/x-www-form-urlencoded"},
		url: "https://madbutcher.kiwi/specials/",
		onload: function(response) {
			var Titles = response.responseText.split("<h3>");
            var Specials = [];
            var Prices = [];

            for (var x in Titles) {
                if (Titles[x].split("</h3>")[1] == "") {
                    Specials.push(Titles[x].split("</h3>")[0].replace(/&#038;/g, "&"));
                }
                if ((x > 0) && (x < 4)) {
                    var px = response.responseText.split('<ins><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">&#36;</span>')[x];
                    Prices[x] = px.split("</span>")[0];
                    Prices[x] += px.split("</span>")[1].split("</ins>")[0];
                }
            }
            //ADD A LINEBREAK AFTER EACH ITEM
            for (x in Specials) {
                //(x + 1) == Specials.length ? MadButcher += Specials[x] : MadButcher += Specials[x] + "\n";
                MadButcher += Specials[x] + "  :  " + Prices[x * 1 + 1] + "\n";
            }
            CheckPakNSave();
        }
	});
})();

function CheckPakNSave() {
	GM_xmlhttpRequest({
		method: "POST",
		headers: {"Content-type" : "application/x-www-form-urlencoded"},
		url: "http://www.paknsave.co.nz/promotions-and-deals/",
		onload: function(response) {
            var Titles = response.responseText.split("self-clear divide-top");
            var Specials = [];
            for (var i = 1; i < Titles.length; i++) {
                for (var x in Titles[i].split("<h2>")) {
                    if (((Titles[i].split("<h2>")[x].split("</h2>")).length == 2) && ((Titles[i].split("<h2>")[x].split("</h2>"))[1].includes('class="subtitle"'))) {
                        Specials.push((Titles[i].split("<h2>")[x].split("</h2>"))[0]);
                    }
                }
            }
            for (i = 0; i < Specials.length - 1; i++) {
                PakNSave += Specials[i] + "\n";
            }
            PakNSave += Specials[Specials.length - 1]
            alert(MadButcher + PakNSave);
        }
	});
}

//https://shop.countdown.co.nz/shop/specials/meat-seafood/beef-veal/beef-mince
//https://shop.countdown.co.nz/shop/specials/meat-seafood/chicken-other-poultry/chicken-breast
//https://shop.countdown.co.nz/shop/specials/meat-seafood/beef-veal/beef-frying

function AlertSpecials() {
    alert(MadButcher);
}