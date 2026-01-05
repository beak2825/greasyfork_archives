// ==UserScript==
// @name         DealeXtreme Currency Calculator
// @description  Calculate prices in any currency you want
// @version      1.0.18
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM+0NaXJqx6zzbAsusyvKrnLrSS6xKIGvtK3QnDp251cyqsf38amG+Xn2ZgzAAAAAAAAAADUukuhv5sA/9zIa5TGphGFw6EEiuDOeyLgznwb3st2HNW+T1a6kwC00rdDaeDPfWq9mADowqAG4fTu0DfZxWJ4sIMA/9O5Srz28dcIyaodr8SiB60AAAAAAAAAAAAAAADx6scBzbAudsCdAMjRt0Bt4M54ZsWjEdPBngHmwZ4A4da+WZkAAAAAAAAAAMmqIH3DoQV8AAAAAAAAAAAAAAAAAAAAAAAAAADEogp9uZIAmefZlzfaxGCpuI8A/8SjCuvs4asrAAAAAAAAAADHpxW0wp8EtePTiQcAAAAAAAAAAObZlxbOsjSSvJYAyt7KdGbYwll4v5oA9MmqHrTGphDixKINwNrHZx8AAAAAyqsescalD8HYwl2t18FYrNfAVazMsCu5v5oAxt3KbmLh0ICrvZgA/86yNcDi04YE3st0U76ZAP/Lrib/8Oe+RNS8TInOszWUzbEwqM2xLqnOsjGpyq0kpNS8THfv57wy0rlDq8uvM8Pq3KE4AAAAAAAAAADTu0qax6gVxufZmmMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD//wAA//8AAP//AAADOAAAPZkAAD7DAAD/RwAAPMMAAAEZAAADOQAA//8AAP//AAD//wAA//8AAA==
// @include      http://dx.com/*
// @include      https://dx.com/*
// @include      http://*.dx.com/*
// @include      https://*.dx.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/13667
// @downloadURL https://update.greasyfork.org/scripts/11252/DealeXtreme%20Currency%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/11252/DealeXtreme%20Currency%20Calculator.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

function fetchCurrencyData() {
  GM_setValue('update_time', d.getTime().toString());
  GM_xmlhttpRequest({
    method: "GET",
    url: "http://api.fixer.io/latest?symbols=" + currency_from + "," + currency_to,
    onload: function(response) {
      console.debug(response);
      obj = JSON && JSON.parse(response.responseText) || $.parseJSON(response.responseText);
      console.debug(obj);
      if(currency_from == "EUR")
        obj.rates[currency_from] = 1;
      if(currency_to == "EUR")
        obj.rates[currency_to] = 1;
      if(!obj.rates[currency_from] || !obj.rates[currency_to]) {
        alert("Error fetching currency data. \r\n\r\nError: " + obj.err);
        return;
      }
      rate = parseFloat((parseFloat(obj.rates[currency_to]) / parseFloat(obj.rates[currency_from])).toFixed(5));
      GM_setValue("rate", rate.toString());
      if(update_notify) {
        alert("Exchange Rate Updated: " + currency_from + " = " + rate + " " + currency_to);
      }
      doCalc();
    },
    onerror: function(responseDetails) {
      if(update_notify) {
        alert("Error fetching currency data");
      }
    }
  });
}

function updateSetting(s, d) {
  if(d) {
    GM_setValue(s, (eval(s)^true));
  } else {
    var newSetting = prompt("Enter new value", eval(s));
    if (newSetting === '' || newSetting === null) {
      alert("Invalid value. Please try again.");
      return;
    }
    if (typeof(newSetting) == "string")
      newSetting = newSetting.toUpperCase();
    GM_setValue(s, newSetting);
  }
  GM_setValue('update_time', 0);
  var r = confirm(s + ' set to ' + newSetting + '\n\nReload page?');
  if (r == true) {
    window.location.reload();
  }
}

function addMenu() {
  GM_registerMenuCommand("Search Symbol [" + search_string + "]", function(){updateSetting('search_string')});
  GM_registerMenuCommand("From Currency [" + currency_from + "]", function(){updateSetting('currency_from')});
  GM_registerMenuCommand("To Currency [" + currency_to + "]", function(){updateSetting('currency_to')});
  GM_registerMenuCommand("Exchange Rate Update (Hours) [" + update_interval + "]", function(){updateSetting('update_interval')});
  GM_registerMenuCommand("Update Notification [" + update_notify + "]", function(){updateSetting('update_notify', true)});
  GM_registerMenuCommand("Update Rate Now [" + rate + "]", function(){fetchCurrencyData()});
}

var d = new Date();
var today = d.getTime();

var update_time = parseInt(GM_getValue('update_time', 0));
var update_interval = parseInt(GM_getValue('update_interval', 24));
var update_notify = parseInt(GM_getValue('update_notify', 1));
var search_string = GM_getValue('search_string', '$');
var currency_from = GM_getValue('currency_from', 'USD');
var currency_to = GM_getValue('currency_to', 'SEK');
var rate = parseFloat(GM_getValue('rate', 6.5));

addMenu();

if((today - update_time) > (update_interval * 3600000)) {
  fetchCurrencyData();
} else {
  doCalc();
}

function doCalc() {
  jQuery("#price,.price,.total").not(".calcDone").each(function(){
    var calc = '';
    if(this.id=='price') {
      var x = parseFloat(jQuery(this).text().replace(",","."));
      x = x * parseFloat(rate);
      x = Math.round(x*Math.pow(10,2))/Math.pow(10,2);
      calc = currency_to + x;
    } else {
      for (var i=1; i < jQuery(this).text().split(search_string).length; i++) {
        var x = parseFloat(jQuery(this).text().split(search_string)[i].replace(",","."));
        x = x * parseFloat(rate);
        x = Math.round(x*Math.pow(10,2))/Math.pow(10,2);
        if((jQuery(this).children('del').text().length > 0) && (i == 1)) {
          calc = '<del>' + currency_to + x + '</del> ';
        } else {
          calc = calc + currency_to + x + ' ';
        }
      }
    }
    jQuery(this).css("height", "auto").addClass("calcDone").append("<br/>" + calc);
  });
  jQuery(".subtotal,.ship_fee,.grand_total").not(":has(span)").each(function(){
    var calc = '';
    for (var i=1; i < jQuery(this).text().split(search_string).length; i++) {
      var x = parseFloat(jQuery(this).text().split(search_string)[i].replace(",","."));
      x = x * parseFloat(rate);
      x = Math.round(x*Math.pow(10,2))/Math.pow(10,2);
      calc = calc + currency_to + x + ' ';
    }
    jQuery(this).css("height", "auto").append("<br/><span>" + calc + "</span>");
  });
  var timeControl = setTimeout(doCalc, 500);
}