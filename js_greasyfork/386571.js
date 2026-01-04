// ==UserScript==
// @name     Vapes: Elego copy product
// @version  1.2
// @grant    none
// @require  https://code.jquery.com/jquery-3.3.1.min.js
// @match https://www.elegomall.com/*
// @namespace elegocopy
// @description Copy Elego product data to tab format
// @downloadURL https://update.greasyfork.org/scripts/386571/Vapes%3A%20Elego%20copy%20product.user.js
// @updateURL https://update.greasyfork.org/scripts/386571/Vapes%3A%20Elego%20copy%20product.meta.js
// ==/UserScript==

// Specter wrapper
if (window.location.href.indexOf('elegomall.com') > 1) {
  let params = {}

  const load = () => {
    runScript()
  }

  function mergeData(data) {
    var merged = '';
    var length = data.length;
    $(data).each(function(index) {
      var tab = '\u0009';
      merged = data.length === index+1 ? merged + data[index].trim() : merged + data[index].trim() + tab;
    })
    return merged;
  }

  function getData() {
    var data = [];
     // Pris, Artikelnummer, Benämning, Variant, URL
    data.push($('.details-price-left').first().children('span').eq(1).text().replace('$', ''));
    data.push($('.details-stock').clone().children().remove().end().text().trim().replace('SKU: ', ''));
    data.push($('.details-title').first().text());

      var variation = '';
      $('.details-color').each(function (index) {
          if ($(this).hasClass('details-quantity') || $(this).hasClass('details-ship')) { return false; }
          var key = $(this).find('.details-color-label').first().text();
          var val = $(this).find('.detailsActive').first().text();
          var final = key.trim() + ' ' + val.trim();
          if (index === 0) { variation = final; }
          if (index > 0) { variation += " / " + final; }
      })

    data.push(variation);
    data.push(window.location.href);
    return data;
  }

  // Run your functions below
  function runScript () {
    $('body').keydown(function(e) {  //keypress did not work with ESC;
      if (event.which == '192' || event.which == '220') {
        const el = document.createElement('textarea');
        el.value = mergeData(getData());
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    });
  }

  window.addEventListener('load', () => load(), true)
}
