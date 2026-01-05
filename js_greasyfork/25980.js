// ==UserScript==
// @name         Quickbuyers Inventory Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Analyse TF2 inventories on backpack.tf, cleaner.
// @author       MenghFacepalms
// @match        http://backpack.tf/profiles/*
// @match        https://backpack.tf/profiles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25980/Quickbuyers%20Inventory%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/25980/Quickbuyers%20Inventory%20Cleaner.meta.js
// ==/UserScript==

/// Constants ///
var refined_dollar_price = 0.07; // The $ price of 1 refined; variable if needed to be updated to your needs.
var key_metal_value = 29; // x Ref => 1 Key price currently; variable if needed to be updated to your needs.

/// Do not change anything below this ///

function cleaner() {
    var new_page = "<div class='backpack-page'><div class='page-number'><a class='label label-default uned'>Unpriced Items</a></div><ul class='item-list unpriced'></ul></div>";
    var new_page2 = "<div class='backpack-page'><div class='page-number'><a class='label label-default' id='ksed'>Killstreaked Items</a></div><ul class='item-list killstreaks'></ul></div>";
    var new_page3 = "<div class='backpack-page'><div class='page-number'><a class='label label-default' id='ksed'>Not for Sale, apparently...</a></div><ul class='item-list not-sale'></ul></div>";
    $('div#backpack.inventory').append(new_page).append(new_page2).append(new_page3);
    $('li.item:not([data-p_bptf]):not(.unpriced)').appendTo(".unpriced");
    $('li.item[data-ks_tier]:not(.killstreaks)').appendTo(".killstreaks");
    $('.notrade').addClass('hiding').hide();
    $('.spacer').addClass('hiding').hide();
    $('#filters>select.form-control:eq(1)>option').eq(1).attr('selected', true);
    $('i.fa.fa-tag').addClass('hiding').hide();
    $("li.item[data-tag_text*='Not for sale']").appendTo(".not-sale").hide();
    $("li.item[data-tag_text*='not for sale']").appendTo(".not-sale").hide();
    $("li.item[data-tag_text*='not selling']").appendTo(".not-sale").hide();

    var items = $('li.item:not(:hidden)');
    var count_item = items.length;
    document.getElementsByClassName('used-slots')[0].innerHTML = count_item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var total_key = 0;
    var total_ref = 0;
    for (i = 0; i < count_item; i++) {
        var curr_item = document.querySelectorAll('li.item:not(hiding)')[i];
        var curr_item_j = $('li.item:not(hiding)').eq(i);

        if (curr_item_j.parents('.killstreaks').length === 0) {
            if (curr_item_j.parents('.unpriced').length === 0) {
                if (curr_item.getAttribute('data-price') !== "0" && curr_item_j.has("span.tag.bottom-right").length > -1) {
                    if (curr_item.getAttribute('data-p_bptf').indexOf("key") == -1) {
                        if (curr_item.getAttribute('data-price') == 1) {
                            total_ref = total_ref + 1;
                            var ref_prop = 1 / key_metal_value;
                            total_key = total_key + ref_prop;
                            document.querySelectorAll('span.tag.bottom-right')[i].textContent = "1.00 ref";
                        } else {
                            var clean_price = curr_item.getAttribute('data-p_bptf');
                            var clean_price_ref = parseFloat(clean_price);
                            total_ref = total_ref + clean_price_ref;
                            clean_price = clean_price_ref / key_metal_value;
                            total_key = total_key + parseFloat(clean_price);
                            document.querySelectorAll('span.tag.bottom-right')[i].textContent = clean_price_ref.toFixed(2) + " ref";
                        }
                    } else {
                        var price = curr_item.getAttribute('data-p_bptf_all');
                        price = price.substring(0, price.indexOf(' '));
                        var price_ref = parseFloat(price.replace(/\,/g,''));
                        total_ref = total_ref + price_ref;
                        price = price_ref / key_metal_value;
                        total_key = total_key + price;
                        document.querySelectorAll('span.tag.bottom-right')[i].innerHTML = "";
                        document.querySelectorAll('span.tag.bottom-right')[i].textContent = price.toFixed(2) + " keys";
                    }
                }
            }
        }
        $('.inventory-statii > ul.stats > li').eq(4).html("<strong class='key_worth'>" + total_key.toFixed(2) + "</strong><small> Keys worth</small>");
        var total_dollar = Math.round(total_key * key_metal_value * refined_dollar_price * 100) / 100;
        document.getElementsByClassName('community-value')[0].innerHTML = total_dollar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementsByClassName('refined-value')[0].innerHTML = Math.round(total_ref).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

function count_ks() {
    var killstreak_count = $('ul.killstreaks > .item').length;
    var refined_value = document.getElementsByClassName('refined-value')[0].textContent;
    var total_dollar = document.getElementsByClassName('community-value')[0].textContent;
    var key_worth = document.getElementsByClassName('key_worth')[0].textContent;
    var total_ks_ref = 0;
    var total_ks_key = 0;
    for (j = 0; j < killstreak_count; j++) {
        var ks_item = document.querySelectorAll('ul.killstreaks > .item')[j];
        var ks_price = ks_item.getAttribute('data-price');
        ks_price = parseFloat(parseFloat(ks_price).toFixed(2));
        total_ks_ref = parseFloat(parseFloat(total_ks_ref + ks_price).toFixed(2));

        var ks_key_price = ks_price / key_metal_value;
        ks_key_price = parseFloat(ks_key_price.toFixed(2));
        total_ks_key = total_ks_key + ks_key_price;

        if (ks_price < key_metal_value) {
            document.querySelectorAll('ul.killstreaks > .item > span.tag.bottom-right')[j].innerHTML = ks_price.toFixed(2) + " ref";
        } else {
            document.querySelectorAll('ul.killstreaks > .item > span.tag.bottom-right')[j].innerHTML = ks_key_price.toFixed(2) + " keys";
        }
    }
    var total_ks_dollar = total_ks_ref * refined_dollar_price;
    refined_value = refined_value.replace(/\,/g,'');
    var final_refined = Math.round(parseFloat(refined_value) + total_ks_ref);
    var final_dollar = parseFloat(parseFloat(total_dollar) + parseFloat(total_ks_dollar)).toFixed(2);
    document.getElementsByClassName('refined-value')[0].textContent = final_refined.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementsByClassName('community-value')[0].textContent = final_dollar;
    document.getElementsByClassName('key_worth')[0].textContent = parseFloat(key_worth) + parseFloat(total_ks_key);
}

$(document).ready( function() {
    document.getElementsByClassName('metal-count')[0].innerHTML = document.getElementsByClassName('metal-count')[0].innerHTML.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var cleaner_butt = "<div id='qic' style='width: 140px; height: 34px; margin: 2px; background-color: white; border-radius: 5px; padding: 8px; text-align: center; border: 1px solid #ccc'>Turn on QIC</div>";
    $('#filters').append(cleaner_butt);

    $('#qic').one('click', function() {
        $('#qic').css('background-color','#628c2a');
        $('#qic').css('color','white');
        document.getElementById('qic').innerHTML = "You're good to go!";
        cleaner();

        $('#ksed').one('click', function() {
            $('#ksed').css('background-color', '#628c2a');
            count_ks();
        });

        $('.not-sale > li.item:hidden').show();
    });
});