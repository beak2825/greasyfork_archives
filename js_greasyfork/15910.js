// ==UserScript==
// @name            Rohlik.cz - mnozstvi zbozi na sklade
// @description:cs  Přidá pole s množstvím zboží na skladě.
// @namespace       monnef.tk
// @include         https://www.rohlik.cz/*
// @version         1
// @grant           GM_addStyle
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at          document-start
// @description Přidá pole s množstvím zboží na skladě.
// @downloadURL https://update.greasyfork.org/scripts/15910/Rohlikcz%20-%20mnozstvi%20zbozi%20na%20sklade.user.js
// @updateURL https://update.greasyfork.org/scripts/15910/Rohlikcz%20-%20mnozstvi%20zbozi%20na%20sklade.meta.js
// ==/UserScript==

var $ = jQuery.noConflict(true);
var FORM_PATTY = /^frm-product-\d+-basketForm$/;
var STORE_ATTR = 'data-max-amount';
var CRAWL_TAG = 'monnef_store_amount_tag';
var LOG_TAG = '[RczMZnS]'

function log(msg) {
  console.log(LOG_TAG + ' ' + msg);
}

function process(elem) {
  elem = $(elem);
  $('form', elem)
    .filter(function () {
      var formElem = $(this);
      return !formElem.data(CRAWL_TAG) && FORM_PATTY.test($(this).attr('id'));
    })
    .each(function () {
      var formElem = $(this);
      $('input', formElem).each(function () {
        var inputElem = $(this);
        var storeAmount = inputElem.attr(STORE_ATTR);
        if (storeAmount) {
          formElem.data(CRAWL_TAG, true);
          var storeCountElem = $('<div/>')
            .addClass('monnef-store-amount')
            .text(storeAmount)
            .attr('title', 'Skladem je ' + storeAmount + ' kusů.' + '\nSkript vám vytvořil monnef.');
          formElem.append(storeCountElem);
        }
      })
    })
  ;
}

log('Skript "Rohlik.cz - mnozstvi zbozi na sklade" od monnef startuje')

document.addEventListener('DOMSubtreeModified', function (ev) {
  setTimeout(function () { process(ev.target); }, 50);
}, false);

GM_addStyle(`
.monnef-store-amount {
  position: absolute;
  bottom: -0.7em;
  left: 3.4em;
  padding: 0.1em;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 0.3em;
  width: 2em;
  text-align: center;
  cursor: default;
}
`);
