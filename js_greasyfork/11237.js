// ==UserScript==
// @name             amazon.de - Mehrwertsteuer für Österreich
// @name:de          amazon.de - Mehrwertsteuer für Österreich
// @name:en          amazon.de - Mehrwertsteuer (VAT) for Austria
// @version          1.4
// @namespace        http://alphabeter.at/greasemonkey/
// @description      Ändert die Preise auf amazon.de auf die österreichische Mehrwertsteuer
// @description:de   Ändert die Preise auf amazon.de auf die österreichische Mehrwertsteuer
// @description:en   Calculates the correct Austrian tax (VAT) on amazon.de
// @grant            none
// @run-at           document-idle
// @include          *://*.amazon.de/*
// @include          *://amazon.de/*
// @exclude          */buy/*
// @icon             data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/11237/amazonde%20-%20Mehrwertsteuer%20f%C3%BCr%20%C3%96sterreich.user.js
// @updateURL https://update.greasyfork.org/scripts/11237/amazonde%20-%20Mehrwertsteuer%20f%C3%BCr%20%C3%96sterreich.meta.js
// ==/UserScript==



(function () {	

//elements, that get searched for prices: (small hack: sometimes there are two prices in <span>)
var amazonPriceElements = new Array("td", "font", "b", "span", "span");	

//VAT in percent
var mwst_de = 19;
var mwst_at = 20;
//different VAT in percent for books
var mwst_buch_de = 7;
var mwst_buch_at = 10;


//------------------------------------------------------

mwst_de = 1 + mwst_de/100.0;
mwst_at = 1 + mwst_at/100.0;
mwst_buch_de = 1 + mwst_buch_de/100.0;
mwst_buch_at = 1 + mwst_buch_at/100.0;

//search every element, where amazon shows its prices (usually <span> or <td>)
for (j = 0; j < amazonPriceElements.length; j++) 
{
	var possiblePriceElements = document.getElementsByTagName(amazonPriceElements[j]);
	for (i = 0; i < possiblePriceElements.length; i++) 
	{		
		var thisElement = possiblePriceElements[i];
		var thisHTML = thisElement.innerHTML;
		
		//search small nodes for prices
		if (thisHTML.length < 200 && thisHTML.indexOf('EUR')!= -1) 
		{
			thisHTML=thisHTML.replace("\n"," ").replace("\r"," ");
			var priceRegEx = /(.*)EUR\s*([0-9,.]+)(.*)/;
  			priceRegEx.exec(thisHTML);
  			
  			preHTML  = RegExp.$1;
  			postHTML = RegExp.$3;  			
  			oldPrice = RegExp.$2;
  			
  			//replace decimal point and 1000-sign
  			//convert to number  			
			oldPrice=parseFloat(oldPrice.replace(".","").replace(",","."));			
			
			if (isNaN(oldPrice)) continue;
			
      // calculate prices    
			newPrice1 = oldPrice / mwst_de * mwst_at;			
			newPrice1 = newPrice1.toFixed(2).replace(".",",");			
			newPrice2 = oldPrice / mwst_buch_de * mwst_buch_at;
			newPrice2 = newPrice2.toFixed(2).replace(".",",");
						
			thisElement.innerHTML=preHTML + "<span>&euro;"+newPrice1 + '</span><span style="color:#611;"> [Buch &euro;'+newPrice2 + "]</span>" +postHTML;
  		}
	}
}
})();
