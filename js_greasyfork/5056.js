// ==UserScript==
// @name        gh.de - Gesamtpreis
// @namespace   conquerist2@gmail.com
// @include     http://geizhals.de/?cat=*
// @include     https://geizhals.de/?cat=*
// @description gh.de - Gesamtpreis in Suchergebnissen
// @version     3.43
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5056/ghde%20-%20Gesamtpreis.user.js
// @updateURL https://update.greasyfork.org/scripts/5056/ghde%20-%20Gesamtpreis.meta.js
// ==/UserScript==
// 2020 09 06 v3.43 - update sorting to site changes
// 2020 09 06 v3.42 - update changelog
// 2020 09 06 v3.41 - limit URLs
// 2020 08 23 v3.4 - update to match changes in gh.de
// 2020 04 11 v3.3 - added fallback sorting if no unit price present
// 2020 04 11 v3.2 - fix for product variants
// 2020 02 16 v3.1 - fix for typo in class name
// 2019 10 19 v3.0 - update to new GM version and changes in gh.de
// 2018 07 28 v2.2 - update to match changes in gh.de
// 2017 05 14 v2.1 - https support
// 2016 02 28 v2.0 - Update to match changes in gh.de; support new mobile layout
// 2015 11 13 v1.10 - Fix for categories without unit prices
// 2015 11 04 v1.9 - Update to match changes in gh.de (e.g. gh_price class)
// 2015 07 20 v1.8 - Edit product url to use for shipping to Germany
// 2015 05 29 v1.7 - Don't edit product url
// 2015 05 24 v1.6 - Mark items from abroad without international shipping as NaN
// 2015 05 24 v1.5 - Better handling of item counts
// 2015 05 13 v1.4 - Support for CD / DVD item count
// 2014 10 14 v1.3 - Get sort order from drop-down box instead of url
// 2014 10 02 v1.2 - Fix for non-integer TB values
// 2014 10 02 v1.1 - Changed TB to GB to MB factor from 1024 to 1000

var products = document.querySelectorAll('div.productlist__product');
var numRows = products.length;
// button
var insertbefore = document.querySelector('div.sorting-paginator__wrapper');
btn = document.createElement('button');
btn.type = 'button';
btn.addEventListener('click', gesamtpreise, false);
btn.innerHTML = 'Gesamtpreise';
btn = insertbefore.parentNode.insertBefore(btn, insertbefore);

var mobileSortingButton = document.createElement('span');
mobileSortingButton.setAttribute('class','sorting__button');
mobileSortingButton.addEventListener('click', gesamtpreise, false);
mobileSortingButton.innerHTML = 'Gesamtpreise';
var mobileSortingButtonRow = document.createElement('div');
mobileSortingButtonRow.setAttribute('class','sorting');
var mobileSortingButtonWrap = document.querySelector('div.sorting-paginator__wrapper');
/* mobileSortingButtonWrap.appendChild(mobileSortingButtonRow);
  mobileSortingButtonRow.appendChild(mobileSortingButton); */

// Angebote aus EU
var euCheckbox = document.querySelector('li.fltrs_country span.country_select_item:last-child input');
if (!euCheckbox.checked) {
  euCheckbox.checked = true;
  euCheckbox.onclick.apply(euCheckbox);
}
  
// Gesamtpreise im Ergebnis
for (var i = 0; i < numRows; i++)
{
	products[i].querySelector('a.productlist__link').href += '&plz=&t=v&va=b&vl=de&v=e';
}

function gesamtpreise() {
  var numCompleted = 0;
  for (var i = 0; i < numRows; i++)
  {
    var productUrl = products[i].querySelector('a.productlist__link').href;
    // as inline function to remember the value of i
    (function (i) {
      GM.xmlHttpRequest({
        method: 'GET',
        url: productUrl,
        onload: function (response) {
          var responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
          console.log('hi from i='+i);
          var listPriceSpan = products[i].querySelector('div.productlist__price span.gh_price span.notrans');
          var listUnitPriceSpan = products[i].querySelector('div.productlist__price span.gh_pricePerUnit span.notrans');
          var price = responseXML.querySelector('div#lazy-list--offers span.gh_price').innerHTML;
          var noShipping = !(responseXML.querySelector('div#offer__price-0 div.offer__delivery-costs-calc-failed') == null);
          // calculate unit price
          console.log('noShipping: ' + noShipping);
          console.log('listPriceSpan: ' + listPriceSpan.innerHTML);
          console.log('price: ' + price);
          if (listUnitPriceSpan) {
            console.log('listUnitPriceSpan: ' + listUnitPriceSpan.innerHTML);
            var totalPrice = parseFloat(listPriceSpan.innerHTML.match(/[0-9]+,[0-9]*/)[0].replace(',', '.'));
            console.log('totalPrice: ' + totalPrice);
            var unitPriceOld = parseFloat(listUnitPriceSpan.innerHTML.match(/[0-9]+,[0-9]*/)[0].replace(',', '.'));
            console.log('unitPriceOld: ' + unitPriceOld);
            var units = totalPrice / unitPriceOld;
            console.log('units: ' + units);
            var unitPriceNew = price.replace(',', '.').replace('--', '0').replace('€ ','') / units;
            console.log('unitPriceNew: ' + unitPriceNew);
          }
          if (noShipping) {
            price = NaN;
            unitPriceNew = NaN;
          }
          listPriceSpan.innerHTML = price;
          if (listUnitPriceSpan) {
            listUnitPriceSpan.innerHTML = unitPriceNew.toFixed(3).toString().replace('.', ',');
          }
          //} else {
          //        span.innerHTML = 'N/A';
          //}
          // are we done yet?

          numCompleted += 1;
          sortButtonText(numCompleted + ' / ' + numRows);
          // sort 
          if (numCompleted == numRows) {
            sortButtonText('sorting...');
            var order = document.querySelector('div.sorting select').value;
            if (!order) {
              order = 'r';
            }
            if (order == '-p' || (order == '-r' && !listUnitPriceSpan)) {
              sortTable(products, valFunPrice, 1);
            } else if (order == 'p' || (order == 'r' && !listUnitPriceSpan)) {
              sortTable(products, valFunPrice, - 1);
            } else if (order == '-r') {
              sortTable(products, valFunUnitPrice, 1);
            } else if (order == 'r') {
              sortTable(products, valFunUnitPrice, - 1);
            }
            btn.innerHTML = 'Gesamtpreise';
            btn.disabled = true;
            mobileSortingButtonWrap.removeChild(mobileSortingButtonRow);
          }
        }
      });
    }) (i);
  }
}
// Sorting functions
// http://stackoverflow.com/questions/14267781/sorting-html-table-with-js

function valFunPrice(product) {
  return product.querySelector('div.productlist__price span.gh_price span.notrans').innerHTML.replace('--', '00').replace(/.*?([0-9]+),([0-9]{2}).*/, '$1.$2');
}
function valFunUnitPrice(product) {
  return product.querySelector('div.productlist__price span.gh_pricePerUnit span.notrans').innerHTML.replace(',', '.');
}
function sortTable(products, valFun, reverse) {
  var tb = products[0].parentNode, // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
  tr = Array.prototype.slice.call(products, 0), // put rows into array
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

function sortButtonText(buttonText) {
  btn.innerHTML = buttonText;
  mobileSortingButton.innerHTML = buttonText;
}