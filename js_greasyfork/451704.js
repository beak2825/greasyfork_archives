// ==UserScript==
// @name Old Navy Sale Show Percent With Filtering
// @version 1.1
// @description Shows Sale Percent Per Item With Filtering
// @author JasonC
// @match https://oldnavy.gapcanada.ca/*
// @grant none
// @namespace https://greasyfork.org/users/165799
// @downloadURL https://update.greasyfork.org/scripts/451704/Old%20Navy%20Sale%20Show%20Percent%20With%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/451704/Old%20Navy%20Sale%20Show%20Percent%20With%20Filtering.meta.js
// ==/UserScript==
function DoStuff()
{
	var filterpercent = prompt("Filter Sale?");
	filterpercent = parseInt(filterpercent);
	var products = document.getElementsByClassName("category-page-1ohx80u");
	for(var i=0;i<products.length;i++){
		var pricetag = products[i].getElementsByClassName("product-card-price");
		if (pricetag.length > 0){
			pricetag = pricetag[0];
        }
		else{
			continue;
        }
		var nowprice = 0;
		var wasprice = 0;
		var elems = pricetag.getElementsByTagName("*");
		for(var j=0;j<elems.length;j++){
			var lbl = elems[j].getAttribute("aria-label");
			if (lbl != null && lbl.indexOf("Was ") == 0 && lbl.indexOf("$") != -1){
				wasprice = parseFloat(lbl.substr(lbl.indexOf("$")+1));
			}
			else if (lbl != null && lbl.indexOf("Now ") == 0 && lbl.indexOf("$") != -1){
				nowprice = parseFloat(lbl.substr(lbl.indexOf("$")+1));
			}
		}
		var percent = parseInt(100-nowprice/wasprice*100);
		if (filterpercent != null && !isNaN(filterpercent) && (isNaN(percent) || percent < filterpercent)){
			products[i].parentElement.removeChild(products[i]);
			i--;
			continue;
		}
		pricetag.appendChild(document.createTextNode(percent + "% OFF"));
	}
}
(function() {
    var MainBtn = document.createElement('INPUT');
    MainBtn.type = 'button';
    MainBtn.style.position = 'fixed';
    MainBtn.style.top = '10px';
    MainBtn.style.left = '10px';
    MainBtn.value = 'SHOW SALE';
    MainBtn.onclick = function() {
        DoStuff();
    };
    document.body.appendChild(MainBtn);
})();