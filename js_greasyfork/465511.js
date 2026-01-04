// ==UserScript==
// @name         Magento 2 frontend
// @namespace    dedeman
// @version      1.6
// @description  cautare id produs si accesare pagina de editare
// @author       Dragos
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @match        https://www.dedeman.ro/*
// @exclude      https://www.dedeman.ro/admin/*
// @match        https://mcstaging.dedeman.ro/*
// @exclude      https://mcstaging.dedeman.ro/admin/*
// @match        https://mcstaging2.dedeman.ro/*
// @exclude      https://mcstaging2.dedeman.ro/admin/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        window.onurlchange
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/465511/Magento%202%20frontend.user.js
// @updateURL https://update.greasyfork.org/scripts/465511/Magento%202%20frontend.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    $(document).ready(function() {
        if (/(?:\?|&)nos\b/i.test(location.search)) {
            console.log('no status');
        }
        else {
            GM_addStyle('.sku.attribute.product, .form-address-head-customer-type {cursor: pointer;} .sku.attribute.product:hover, .form-address-head-customer-type:hover {text-decoration: underline;} .cart-item, .cart-item-dededeal {position: relative;} .container-item-dededeal .extra {font-size: 13px; } .container-item-dededeal .extra:last-of-type {margin-bottom: -16px;}');
            GM_addStyle(`.status {float: right; cursor: pointer;} .status:hover {text-decoration: underline;}`);
            $(document).on('mouseup touchstart', '.sku.attribute.product', function(e) {
                if (e.which == 2 || e.type == 'touchstart') {
                    var id = 0;
                    if ($('.price-box.price-final_price').data('product-id')) {
                        id = $('.price-box.price-final_price').data('product-id');
                        if (id) GM_openInTab(location.origin+'/admin/catalog/product/edit/id/'+id,{active: false, insert: false});
                        else alert('Nu am gasit id-ul produsului!');
                    }
                }
            });
            $('.set-store-form .custom-select.regions-wrapper li:contains("Sector 1")').text('București - Sector 1 (B5)');
            $('.set-store-form .custom-select.regions-wrapper li:contains("Sector 2")').text('București - Sector 2 (B3)');
            $('.set-store-form .custom-select.regions-wrapper li:contains("Sector 3")').text('București - Sector 3 (B4 + B6)');
            $('.set-store-form .custom-select.regions-wrapper li:contains("Sector 4")').text('București - Sector 4 (B1)');
            $('.set-store-form .custom-select.regions-wrapper li:contains("Sector 5")').text('București - Sector 5 (B1 + B7)');
            $('.set-store-form .custom-select.regions-wrapper li:contains("Sector 6")').text('București - Sector 6 (B2 + B7)');
            if (location.pathname.includes('/checkout/cart')) {
                GM_addStyle(`.pallet-header > h2 {cursor: pointer;} .pallet-header > h2:hover {text-decoration: underline;} .cart-item-dededeal-products .item-info-name .for-print-area {display: block !important; cursor: auto; user-select: text !important;}`);
                $(document).on('click', '.cart-item-dededeal-products .item-info-name .for-print-area', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                $(document).on('mouseup touchstart', '.pallet-header > h2', function(e) {
                    if (e.which == 2 || e.type == 'touchstart') {
                        $(this).fadeOut().fadeIn();
                        var text = $('script:contains(window.checkoutConfig)').text() || '';
                        var obj = {};
                        if (/window.checkoutConfig = [^]+?};/g.test(text)) {
                            obj = JSON.parse(/(?:window.checkoutConfig = )([^]+?})(?:;)/g.exec(text)[1]);
                            var name = $(this).closest('.pallet').find('.product-item:eq(0) .cart-item-right-title').text().trim();
                            console.log(name);
                            var pallet_id;
                            $.each(obj.quoteItemData, function(index, val) {
                                if (name == val.name) {
                                    pallet_id = val.pallet_id || 0;
                                    return false;
                                }
                            });
                            if (pallet_id) GM_openInTab(location.origin + '/admin/pallet/index/edit/id/' + pallet_id,{active: false, insert: false});
                            else alert('Nu am gasit id-ul paletului!');
                        }
                    }
                });
                $('.cart-item.pallet').each(function() {
                    var status = '-';
                    $(this).find('.product-item').each(function() {
                        if ($(this).data('status')) status = $(this).data('status');
                    });
                    $(this).find('.pallet-footer').append(`<div style="position: absolute; bottom: 0;">Status: ${status}</div>`);
                });
                $('.cart-item:not(.pallet)').each(function() {
                    var status = '-';
                    var sku = $(this).find('.cart-item-right-title').attr("href").split('/').slice(-1)[0] || '-';
                    if ($(this).data('status')) status = $(this).data('status');
                    $(this).append(`<div style="position: absolute; bottom: 0; display: flex; gap: 16px;" class="product-status"><div class="status" data-sku=${sku}>Status: ${status}</div></div>`);
                    var id = $(this).find('.action-towishlist').data('post').data.product || 0;
                    var link = 0;
                    if (id) link = location.origin+'/admin/catalog/product/edit/id/'+id;
                    if (link) $(this).find('.product-status').append(`<a href="${link}" target="_blank" style="color: #333;">Cod produs: ${sku}</a>`);
                    else $(this).find('.product-status').append(`<div>Cod produs: ${sku}</div>`);
                });
                $('.cart-item-dededeal-products > .item-info').each(function() {
                    var status = '-';
                    if ($(this).data('status')) status = $(this).data('status');
                    $(this).append(`<div style="margin-left: auto; text-align: right;">Status: ${status}</div>`);
                });
                $('.cart-item-dededeal').each(function() {
                    var status = '-';
                    if ($(this).data('status')) status = $(this).data('status');
                    $(this).find('.dededeal-footer').append(`<div style="position: absolute; bottom: 0;">Status: ${status}</div>`);
                });
            }
            else if (!location.pathname.includes('/review/customer') && !location.pathname.includes('/customer/account')) {
                GM_addStyle(`.title-dededeal {display: inline-block; cursor: pointer;} .title-dededeal:hover {text-decoration: underline;}`);
                $(document).on('mouseup touchstart', '.title-dededeal', function(e) {
                    if (e.which == 2 || e.type == 'touchstart') {
                        var id = $(this).closest('.dededeal-item').find('.dededeal-form > input[name="id"]').val() || 0;
                        if (id) GM_openInTab(location.origin+'/admin/dededeal/index/edit/id/'+id,{active: false, insert: false});
                        else alert('Nu am gasit id-ul dededeal-ului!');
                    }
                });
                var status = '-';
                if ($('.product.attribute.sku').data('status')) status = $('.product.attribute.sku').data('status');
                $('.product-store-selector-wrap').prepend(`<p class="status" data-sku="${$('.product.attribute.sku').text().replace('Cod produs:', '').trim()}" data-status="${status}">Status: ${status}</p>`);
                Date.prototype.addDays = function(days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                }
                //list status
                $(':not(#compare-items, .search-carousel div) > .product-item').each(function() {
                    var status = '-';
                    if ($(this).data('status')) status = $(this).data('status');
                    else if ($(this).find('.product-item-info').data('status')) status = $(this).find('.product-item-info').data('status');
                    var sku = $(this).closest('.product-item').find('form[data-role="tocart-form"]').data('product-sku');
                    if (/-/.test(sku)) $(this).append(`<div style="margin-bottom: -16px;" data-sku="${sku}" data-status="${status}">Status: ${status}&nbsp;</div>`);
                    else $(this).append(`<div class="status" style="margin-bottom: -16px;" data-sku="${sku}" data-status="${status}">Status: ${status}&nbsp;</div>`);
                });
                $('.container-dededeal').each(function() {
                    var id = $(this).closest('.dededeal-item').find('.dededeal-form > input[name="id"]').val() || 0;
                    $(this).attr('id', 'dededeal'+id);
                    if (id) {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: location.origin+'/admin/dededeal/index/edit/id/'+id,
                            onload: function(xhr) {
                                if (/(?:<script type="text\/x-magento-init">)({"\*": {"Magento_Ui\/js\/core\/app": {"types":{"dataSource":{[^]+?)(?:<\/script>)/gm.test(xhr.responseText)) {
                                    var obj = JSON.parse(/(?:<script type="text\/x-magento-init">)({"\*": {"Magento_Ui\/js\/core\/app": {"types":{"dataSource":{[^]+?)(?:<\/script>)/gm.exec(xhr.responseText)[1]);
                                    var products = obj["*"]["Magento_Ui/js/core/app"].components.coldo_dededeal_form.children.coldo_dededeal_form_data_source.config.data.links.associated;
                                    var dededeal = products[0].dededeal_id;
                                    $.each(products, function(index, value) {
                                        var product = $('#dededeal'+dededeal).find('.product-image-container-'+value.id).closest('.container-item-dededeal');
                                        var pret_redus;
                                        var pret_produs = product.find('.container-item-dededeal-price').text();
                                        if (product.find('.container-item-dededeal-price > .price-box > .special-price').length) pret_produs = product.find('.container-item-dededeal-price > .price-box > .special-price').text();
                                        pret_produs = Number(pret_produs.match(/\d+\.\d\d/)[0] || 0);
                                        if (pret_produs) {
                                            if (value.discount_type == 'no_reduction') pret_redus = 'Fara reducere!'
                                            else if (value.discount_type == 'price') pret_redus = Number(pret_produs - value.discount).toFixed(2) + ' lei';
                                            else if (value.discount_type == 'percent') {
                                                if (Number(value.discount)) pret_redus = Number(pret_produs - value.discount/100*pret_produs).toFixed(2) + ' lei';
                                                else pret_redus = 'Fara reducere!'
                                            }
                                            product.append(`<div class='extra'>Cod produs: ${value.sku}</div><div class='extra'>Pret redus: ${pret_redus}</div>`);
                                        }
                                    });
                                }
                            }
                        });
                    }
                    $(this).find('.price-container').append(`<div style="font-size: 14px;">Status: ${$(this).data('status') || '-'}</div>`);
                });
                $('.container-item-dededeal').each(function() {
                    var status = '-';
                    if ($(this).data('status')) status = $(this).data('status');
                    $(this).append(`<div class='extra'>Status: ${status}</div>`);
                });
                if (location.pathname.includes('sales/order/view/order_id')) {
                    console.log('sales');
                    GM_addStyle('h1.page-title {cursor: pointer;} h1.page-title:hover {text-decoration: underline;}');
                    $(document).on('mouseup touchstart', 'h1.page-title', function(e) {
                        if (e.which == 2 || e.type == 'touchstart') {
                            var id = location.href.match(/(?:view\/order_id\/)(\d+)/i)[1] || 0;
                            console.log(id);
                            if (id) GM_openInTab(location.origin+'/admin/sales/order/view/order_id/'+id,{active: false, insert: false});
                            else alert('Nu am gasit id-ul comenzii!');
                        }
                    });
                }
            }
        }
    });
})();