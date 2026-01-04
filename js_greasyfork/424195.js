// ==UserScript==
// @name        AMZ Auto AddCart Generator
// @match       https://www.amazon.*/
// @grant       GM.notification
// @version     0.4
// @author      @smesutt
// @description Kodun Dağıtımı Ücretsizdir. Ancak Dağılım için Bilgi Dönüşünüzü Rica Ederim.
// @run-at      document-end
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js
// @include     *//*amazon.*/*
// @namespace https://greasyfork.org/users/752721
// @downloadURL https://update.greasyfork.org/scripts/424195/AMZ%20Auto%20AddCart%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/424195/AMZ%20Auto%20AddCart%20Generator.meta.js
// ==/UserScript==

/**
 * This script adds a few links to each amazon product page:
 * 1. A direct (clean) link to the product page which can be used e.g. to share (copy & paste)
 *    a product page without session information etc.:
 *      http://amazon.[TLD]/dp/[ASIN]

 **/
(function () {
    
    // config
    var SHOW_LINK_ICON = 1; // toggle link fav icons
    var LINK_STYLE = "font-weight: bold; font-style: italic;";

    // not all pages have fav icons so the following currently makes no sense
    var SHOW_LINK_TEXT = 1; // toggle link text

    if (! $('input#ASIN:first').length) {
        return; // this doesn't seem to be a product page
    }

    // get the ASIN (product id)
    var asin = $('input#ASIN:first').val();

    // get top level domain (the simple way)
    var tld = document.domain.split('.').pop();
    if ([ 'au', 'br', 'mx' , 'tr' ].indexOf(tld) > -1) { // add .com to some domaains
        tld = 'com.'+tld;
    } else if ([ 'uk', 'jp' ].indexOf(tld) > -1) { // add .co to others
        tld = 'co.'+tld;
    }

    // create all new links
        
    // direct link
    var link1url = '';
    var link1 = '';
    if (tld != undefined) { // add only if TLD was identified
        var tooltip = (tld == 'de' ? 'Direkter und sauberer Produktlink.' : 'Direct and clean product link.');
        link1url = 'http://amazon.' + tld + '/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=ndrim-21';
        link1 = (SHOW_LINK_ICON ? '<img src="http://www.amazon.'+tld+'/favicon.ico" border="0" align="absmiddle" width="16" height="16" />&nbsp;' : '')
                + '<a target="_blank" href="http://amazon.' + tld + '/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=ndrim-21" style="color: #e47911;' + LINK_STYLE + '" title="' + tooltip + '">'
                + (SHOW_LINK_TEXT ? (tld == 'de' ? 'Sepet' : 'Cart') : '')
                + '</a> / ';
    }
    // Türkiye Sepet Script    
    var link2url = 'https://www.amazon.com.tr/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=ndrim-21';
    //var link2 = (SHOW_LINK_ICON ? '<img src="http://www.bayrak.com/favicon.ico" border="0" align="absmiddle" width="16" height="16" />&nbsp;' : '')
    var link2 = '<a target="_blank" href="' + link2url + '" style="color: #ab4545;' + LINK_STYLE + '">'
                + (SHOW_LINK_TEXT ? 'TR' : 'TR') + '</a> / ';
  
      // Almanya Sepet Script 
    var link3url = 'https://www.amazon.de/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=ndrim-21';
    var link3 = '<a target="_blank" href="' + link3url + '" style="color:  #d608b7;' + LINK_STYLE + '">'
                + (SHOW_LINK_TEXT ? 'DE' : 'DE') + '</a> / ';
  
    // Fransa Sepet Script 
    var link4url = 'https://www.amazon.fr/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=ndrim0d-21';
    var link4 = '<a target="_blank" href="' + link4url + '" style="color:  #106bcc;' + LINK_STYLE + '">'
                + (SHOW_LINK_TEXT ? 'FR' : 'FR') + '</a> / ';
  
    // İtalya Sepet Script 
    var link5url = 'https://www.amazon.it/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=ndrim01-21';
    var link5 = '<a target="_blank" href="' + link5url + '" style="color:  #228b22;' + LINK_STYLE + '">'
                + (SHOW_LINK_TEXT ? 'IT' : 'IT') + '</a> / ';

    // İspanya Sepet Script 
    var link6url = 'https://www.amazon.es/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=ndrim-21';
    var link6 = '<a target="_blank" href="' + link6url + '" style="color:  #ff3819;' + LINK_STYLE + '">'
                + (SHOW_LINK_TEXT ? 'ES' : 'ES') + '</a> / ';
  
    // İngiltere Sepet Script 
    var link7url = 'https://www.amazon.co.uk/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=sicakfirsatci-21';
    var link7 = '<a target="_blank" href="' + link7url + '" style="color:  #0a07c1;' + LINK_STYLE + '">'
                + (SHOW_LINK_TEXT ? 'UK' : 'UK') + '</a> / ';

    // Amerika Sepet Script 
    var link8url = 'https://www.amazon.com/gp/aws/cart/add.html?ASIN.1=' + asin + '&Quantity.1=1?tag=sicakfirsatci-21';
    var link8 = '<a target="_blank" href="' + link8url + '" style="color:  #106bcc;' + LINK_STYLE + '">'
                + (SHOW_LINK_TEXT ? 'COM' : 'COM') + '</a> / ';

  
    // add the links as new table row below the price information
    $('table.product > tbody:last > tr:last, table.a-lineitem > tbody:last > tr:last').after('<tr><td></td><td>'+link1+link2+link3+link4+link5+link6+link7+link8+'</td></tr>');

})();