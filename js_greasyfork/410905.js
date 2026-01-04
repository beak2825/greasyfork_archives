// ==UserScript==
// @name        gh.de - Mehrere Artikel
// @namespace   conquerist2@gmail.com
// @include     /^https?://geizhals\.de/[^?].*$/
// @description gh.de - Gesamtpreis für mehr als nur ein Stück berechnen
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/410905/ghde%20-%20Mehrere%20Artikel.user.js
// @updateURL https://update.greasyfork.org/scripts/410905/ghde%20-%20Mehrere%20Artikel.meta.js
// ==/UserScript==
// 2024 04 01 v1.2 - update to site html
// 2020 09 07 v1.1 - better handling of AJAX / lazy load for >30 offers
// 2020 09 06 v1.0 - initial version

parentUl = document.querySelector('div.variant__content__offersfilter__column ul');

qttyLi = document.createElement('li');
qttyLi.classList.add('gh_afilterbox_sec');
qttyLi.classList.add('gh_afilterbox_sec_qtty');
qttyLi = parentUl.appendChild(qttyLi);

qttyHeading = document.createElement('h3');
qttyHeading.classList.add('gh_afilterbox_h');
qttyHeading.innerHTML = 'Anzahl ';
qttyHeading = qttyLi.appendChild(qttyHeading);

qttyInput = document.createElement('input');
qttyInput.classList.add('gh_input_txt');
qttyInput.setAttribute('value','1');
qttyInput.addEventListener("change", anzahlPreise); 
qttyInput = qttyLi.appendChild(qttyInput);

inclShippingButton = document.querySelector('input#offerfilter-shipping');
inclShippingButton.click();
inclShippingButton.checked = true;

/* loadMoreOffersButton = document.querySelector('.button--load-more-offers');
  
window.addEventListener('load', function() {
  if(loadMoreOffersButton && !loadMoreOffersButton.hasAttribute('disabled'))
  {
    loadMoreOffersButton.click();
  }
}, false); */



function anzahlPreise()
{
  
  offers = document.querySelectorAll('div.offer');
  numRows = offers.length;
  for (i = 0; i < numRows; i++)
  {
    if(offers[i].classList.contains('offer--hint'))
    {
    	continue; 
    }
    if(!offers[i].querySelector('nobr.mg_stueckpreis'))
    {
      haendlerName = offers[i].querySelector('div.merchant__logo-caption').textContent;
    	console.log('i: ' + i + 'numRows: ' + numRows + '; Haendler: ' + haendlerName);
      stueckpreisInsertDiv = offers[i].querySelector('div.offer__delivery-costs');
      stueckpreisInsertDiv.appendChild(document.createElement('br'));
      stueckpreisInsertDiv.appendChild(document.createElement('br'));
      stueckpreisNobr = stueckpreisInsertDiv.appendChild(document.createElement('nobr'));
      stueckpreisNobr.classList.add('mg_stueckpreis');
  	}
  }

	anzahl = qttyInput.value;
  console.log('Anzahl: ' + qttyInput.value);
  console.log('numRows: ' + numRows);
  
  hintReached = false;
  for (i = 0; i < numRows; i++)
  {
    if(offers[i].classList.contains('offer--hint') || hintReached)
    {
    	hintReached = true;
      offers[i].classList.add('mg_no_shipping');
      continue; 
    }
    haendlerName = offers[i].querySelector('div.merchant__logo-caption').textContent;
    console.log('i: ' + i + '; Haendler: ' + haendlerName);
    
  	preisSpans = offers[i].querySelectorAll('div.offer__price span.gh_price');
    gesamtpreisSpan = preisSpans[0]; 
    preisSpan = preisSpans[1]; 
    versandSpan = preisSpans[preisSpans.length - 1];
    console.log('i: ' + i + '; preisSpan: ' + preisSpan.innerHTML + '; versandSpan: ' + versandSpan.innerHTML);
    
    preis = parseFloat(preisSpan.innerHTML.match(/[0-9]+,[0-9]*/)[0].replace(',', '.'));
    versand = parseFloat(versandSpan.innerHTML.match(/[0-9]+,[0-9]*/)[0].replace(',', '.'));
    console.log('i: ' + i + '; preis: ' + preis + '; versand: ' + versand);
    
    gesamtpreis = preis * anzahl + versand;
    stueckpreis = gesamtpreis / anzahl;
    console.log('i: ' + i + '; gesamtpreis: ' + anzahl + '*' + preis + '+' + versand + '=' + gesamtpreis);
    
    preisSpan.innerHTML = anzahl + 'x €' + preis.toFixed(2).toString().replace('.', ',');
    gesamtpreisSpan.innerHTML = '€ ' + gesamtpreis.toFixed(2).toString().replace('.', ',');
    
    stueckpreisNobr = offers[i].querySelector('nobr.mg_stueckpreis');
    stueckpreisNobr.innerHTML = 'effektiv: € ' + stueckpreis.toFixed(2).toString().replace('.', ',') + ' je';
    
  }
  sortTable(offers, valFunPrice, -1);
}

// Sorting functions
// http://stackoverflow.com/questions/14267781/sorting-html-table-with-js

function valFunPrice(product) {
	if(product.classList.contains('mg_no_shipping'))
	{
  	return NaN; 
	}
  return product.querySelector('div.offer__price span.gh_price').innerHTML.replace('--', '00').replace(/.*?([0-9]+),([0-9]{2}).*/, '$1.$2');
}
function sortTable(offers, valFun, reverse) {
  var tb = offers[0].parentNode, // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
  tr = Array.prototype.slice.call(offers, 0), // put rows into array
  i;
  reverse = - (( + reverse) || - 1);
  tr = tr.sort(function (aParam, bParam) { // sort rows
    a = valFun(aParam);
    b = valFun(bParam);
    if (!isFinite(a) && !isFinite(b)) {
      return 0;
    }
    if (!isFinite(a)) { // NaN (keine Lieferkosten) ans Ende
      return 1;
    }
    if (!isFinite(b)) {
      return -1;
    }
    return reverse * (a - b);
  }
  );
  for (i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
}