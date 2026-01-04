// ==UserScript==
// @name         aliexpress-autoselect
// @author       Vlad Topan (vtopan-gmail)
// @version      0.1
// @include      http*://*aliexpress.com/*
// @description  Show bulk price on aliexpress
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/90402
// @downloadURL https://update.greasyfork.org/scripts/39437/aliexpress-autoselect.user.js
// @updateURL https://update.greasyfork.org/scripts/39437/aliexpress-autoselect.meta.js
// ==/UserScript==

(function() {
    DOLLAR = 3.78;

    console.log('Running aliexpress-autoselect...');

    function wait_and_click(o) {
        $(o).find('a')[0].click();
        //update_price();
    }

    function update_price() {
        var v = Number(/[.\d]+/.exec($('span#j-total-price-value').html()));
        r = v * DOLLAR;
        var pp = r / Number($('#j-p-quantity-input').val());
        $('#price_in_ron').html('(RON: ' + r.toFixed(1) + '; ' + pp.toFixed(1) + '/buc)');
    }

    $('div#j-product-info-sku ul').each(function() {
        setTimeout(wait_and_click, 2000, this);
    });

    setTimeout(function() {
        $('.p-available-stock').parent().append('<span id="quant_buttons" style="font-size:12pt;font-weight:bold;cursor:pointer;"></span>');
        var v = [5, 7, 10, 20, 25, 30, 40, 50];
        $.each(v, function(i){
            $('#quant_buttons').append('<span style="border:1px solid #888;margin:2px;" onclick="$(\'#j-p-quantity-input\').val('+(v[i]-1)+');$(\'.p-quantity-increase\')[0].click();">&nbsp;' + v[i] + '&nbsp;</span>');
        });
        $('#j-p-quantity-input').val('9');
        $('span#j-total-price-value').parent().append('<span id="price_in_ron" style="font-weight:bold;font-size:14pt;color:blue;">...</span>');
        $('span#j-total-price-value').on('DOMSubtreeModified', update_price);
        $('.p-quantity-increase')[0].click();
    }, 1000);

    console.log('Done with aliexpress-autoselect.');
})();
