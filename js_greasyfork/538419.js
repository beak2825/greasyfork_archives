// ==UserScript==
// @name         Magento 2 frontend for ME
// @namespace    dedeman
// @version      1.5
// @description  cautare id produs si accesare pagina de editare
// @author       Dragos
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @match        https://www.dedeman.ro/*
// @exclude      https://www.dedeman.ro/admin/*
// @match        https://staging.dedeman.ro/*
// @exclude      https://staging.dedeman.ro/admin/*
// @match        https://staging2.dedeman.ro/*
// @exclude      https://staging2.dedeman.ro/admin/*
// @match        https://securepay-uat.ing.ro/mpi_uat/merchants/*
// @match        https://securepay.ing.ro/mpi/merchants/*
// @match        https://*.btrl.ro/payment/merchants/*
// @match        https://secure.euplatesc.ro/tdsprocess/checkout_plus_av.php*
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
// @connect      dedeman.ro
// @downloadURL https://update.greasyfork.org/scripts/538419/Magento%202%20frontend%20for%20ME.user.js
// @updateURL https://update.greasyfork.org/scripts/538419/Magento%202%20frontend%20for%20ME.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    function config() {
        let api_key = prompt(`Magento 2 API Key - ${location.hostname}:`, GM_getValue(`api_key_${location.hostname}`));
        if (api_key !== null) GM_setValue(`api_key_${location.hostname}`, api_key);
        let tip = 'live';
        if (location.hostname == 'staging.dedeman.ro' || location.hostname == 'staging2.dedeman.ro') tip = 'stage';
        while (true) {
            let appliv_api_key = prompt(`AppLiv API Key ${tip}:`, GM_getValue(`appliv_api_key_${tip}`));
            if (appliv_api_key) {
                GM_setValue(`appliv_api_key_${tip}`, appliv_api_key);
                break;
            }
        }
    }
    GM_registerMenuCommand('Configurare script', function () {
        config();
    });
    GM_addStyle('.sku.attribute.product, .form-address-head-customer-type {cursor: pointer;} .sku.attribute.product:hover, .form-address-head-customer-type:hover {text-decoration: underline;} .cart-item, .cart-item-dededeal {position: relative;} .container-item-dededeal .extra {font-size: 13px; } .container-item-dededeal .extra:last-of-type {margin-bottom: -16px;} .leaflet-popup {-webkit-font-smoothing: subpixel-antialiased;}');
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function get_volume_weight(volum, um_volum) {
        var conversie = 0;
        if (um_volum == 'CCM') conversie = 1;
        else if (um_volum == 'CD3') conversie = 1000;
        else if (um_volum == 'M3') conversie = 1000000;
        else if (um_volum == 'MM3') conversie = 0.001;
        else if (um_volum == 'L') conversie = 1000;
        else if (um_volum == 'HL') conversie = 100000;
        else if (um_volum == 'ML') conversie = 1;
        if (conversie) {
            if (!isNaN(volum)) return Number((volum*conversie/6000).toFixed(2));
            else return false;
        }
        else return false;
    }
    function shipping_tax(data) {
        let tip = 'live';
        let url = 'https://appliv.dedeman.ro/api/shipping_tax';
        if (location.hostname == 'staging.dedeman.ro' || location.hostname == 'staging2.dedeman.ro') {
            tip = 'stage';
            url = 'https://appliv-stage.dedeman.ro/api/shipping_tax';
        }
        if (!GM_getValue(`appliv_api_key_${tip}`)) config();
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "x-api-key": GM_getValue(`appliv_api_key_${tip}`)
            },
            onload: function(xhr) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
                if (response.detail) alert(response.detail);
                else {
                    var metode = [];
                    for (var i = 0; i < response.length; i++) {
                        var cost = response[i].price;
                        if (response[i].delivery_method == 'dedemanheavyfleet') cost = response[i].price + (response[i].services[0]?.price || 0);
                        metode.push(response[i].delivery_method + ' / ' + response[i].status + ' / min-max: ' + response[i].min_delivery_time + '-' + response[i].max_delivery_time + ' zile / min-max total: '+ response[i].min_total_delivery_time + '-' + response[i].max_total_delivery_time +' zile / ' + cost + ' lei');
                    }
                    alert(metode.join('\n'));
                }
            },
            onerror: function(e) {
                alert('AppLiv error!');
                console.log(e);
            },
            timeout: 20000,
            ontimeout: function() {
                alert('AppLiv timeout!');
            }
        });
    }
    function link_comanda(element) {
        var data = element.html();
        var ols = data.match(/(OL[A-Z\d]{0,2}?1D\d{5,7}(?:-\d{1,2})?)/g);
        ols = [...new Set(ols)]; //remove duplicates
        $.each(ols, function(i, ol) {
            data = data.replace(new RegExp(ol, 'gm'),`<span class="link_ol" data-ol="${ol}">${ol}</span>`);
        });
        element.html(data);
    }
    $(document).ready(function() {
        if (/(?:\?|&)nos\b/i.test(location.search)) {
            console.log('no status');
        }
        else {
            if (location.hostname.includes('dedeman.ro')) {
                GM_addStyle(`.status {float: right; cursor: pointer;} .my-sku {cursor: pointer;} .status:hover, .my-sku:hover {text-decoration: underline;}`);
                $(document).on('mouseup touchstart', '.product.attribute.sku, .my-sku', function(e) {
                    if (e.which == 2 || e.type == 'touchstart') {
                        var sku = $(this).find('span').text()?.replace(' #', '') || 0;
                        if (sku) GM_openInTab(location.origin+'/admin/catalog/product/edit/sku/'+sku,{active: false, insert: false});
                        else alert('Nu am gasit codul produsului!');
                    }
                });
                function get_pack_status(items) {
                    var status = '-';
                    var courier = ['CLO', 'CO', 'CL', 'CCAO', 'ECD'];
                    var fleet = ['FLM', 'FM', 'FCAM', 'FL', 'EFD'];
                    var all_status = ['CLOM', 'CLO', 'CLM', 'COM', 'CO', 'CL', 'CCAO', 'FLM', 'FM', 'FCAM', 'FL', 'EC', 'ECFD', 'ECD', 'EFD', 'COMANDA', 'FIZIC', 'IT', 'I'];
                    var indisponibile = ['COMANDA', 'FIZIC', 'IT', 'I'];
                    if (items.length > 1) {
                        var all_ec = 1;
                        var EC = 0;
                        var ECFD = 0;
                        var C = 0;
                        var F = 0;
                        var indis = 0;
                        var temp_status = -1;
                        $.each(items, function(index, value) {
                            console.log(value);
                            if (value == "EC") EC = 1;
                            else all_ec = 0;
                            if (value == "ECFD") ECFD = 1;
                            if (courier.includes(value)) C = 1;
                            else if (fleet.includes(value)) F = 1;
                            else if (indisponibile.includes(value)) indis = 1;
                            if (all_status.indexOf(value) > temp_status) temp_status = all_status.indexOf(value);
                        });
                        console.log('all_ec', all_ec, 'EC', EC, 'ECFD', ECFD, 'C', C, 'F', F, 'indis', indis);
                        if (all_ec && EC) status = 'EC';
                        else if (EC) status = 'I';
                        else if (C && F) status = 'I';
                        else if (C && ECFD && !indis) status = 'ECD';
                        else if (F && ECFD && !indis) status = 'EFD';
                        else if (temp_status >= 0) status = all_status[temp_status];
                    }
                    else if (items.length == 1) status = items[0];
                    return status;
                }
                function display_status(obj, status, type) {
                    if (type == 'alert') alert(status);
                    else {
                        var color = 'green';
                        if (obj.data('status') !== status) {
                            color = 'red';
                            console.log(`Status Magento: ${obj.data('status')} --- Status calculat: ${status}`);
                            console.log(obj);
                        }
                        obj.attr('title', 'Status calculat: '+status).css('color', color);
                    }
                }
                function calc_status(obj, type) {
                    var store = getCookie('source_code') || 'BCT2';
                    var sku = obj.data('sku') || '';
                    console.log(sku);
                    if (/-/.test(sku) && type == 'alert') {
                        console.log('bundle');
                        var items = [];
                        $('.fieldset-bundle-options li.product-item').each(function() {
                            var status = $(this).data('status') || '-';
                            items.push(status);
                        });
                        alert('Status pachet: ' + get_pack_status(items));
                    }
                    else if (/^\d+$/.test(sku)) {
                        if (type == 'alert') obj.fadeOut().fadeIn();
                        if (!GM_getValue(`api_key_${location.hostname}`)) config();
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: location.origin+`/rest/V1/products/${sku}?rnd=` + new Date().getTime(),
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Authorization": "Bearer "+ GM_getValue(`api_key_${location.hostname}`) || ''
                            },
                            anonymous: true,
                            onload: function(xhr) {
                                var response = JSON.parse(xhr.responseText);
                                var depozit_online = 'LOGI';
                                var depozit_furnizor = 'ECOM';
                                var web_status, available_online, restrict_shipping, restrict_shipping_methods, stock_limit, supply_blocked, is_dropshipping, status_ERP_default, status_ERP_magazin, status_ERP_Online, status_ERP_DROP, stoc_Online, stoc_magazin, stoc_DROP, logi_Online, logi_magazin, stoc_logi_Online, stoc_logi_magazin;
                                is_dropshipping = 'NULL';
                                if (response.message) alert(response.message);
                                else if (response.custom_attributes) {
                                    $.each(response.custom_attributes, function(index, value) {
                                        if (value.attribute_code == 'web_status') web_status = Number(value.value) || 0;
                                        else if (value.attribute_code == 'available_online') available_online = Number(value.value) || 0;
                                        else if (value.attribute_code == 'restrict_shipping') restrict_shipping = value.value;
                                        else if (value.attribute_code == 'restrict_shipping_methods') restrict_shipping_methods = value.value;
                                        else if (value.attribute_code == 'stock_limit') stock_limit = value.value;
                                        else if (value.attribute_code == 'supply_blocked') supply_blocked = value.value;
                                        else if (value.attribute_code == 'is_dropshipping') is_dropshipping = value.value;
                                    });
                                    if (response.extension_attributes.source_attributes) {
                                        $.each(response.extension_attributes.source_attributes, function(index, value) {
                                            if (value.source_code == 'default') status_ERP_default = value.erp_status;
                                            else if (value.source_code == depozit_online) {
                                                status_ERP_Online = value.erp_status;
                                                logi_Online = value.logistic_source;
                                            }
                                            else if (value.source_code == store) {
                                                status_ERP_magazin = value.erp_status;
                                                logi_magazin = value.logistic_source;
                                            }
                                            else if (value.source_code == depozit_furnizor) status_ERP_DROP = value.erp_status;
                                        });
                                    }
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: location.origin+`/rest/V1/inventory/source-items?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=${sku}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&rnd=` + new Date().getTime(),
                                        headers: {
                                            "Accept": "application/json",
                                            "Content-Type": "application/json",
                                            "Authorization": "Bearer "+ GM_getValue(`api_key_${location.hostname}`) || ''
                                        },
                                        anonymous: true,
                                        onload: function(xhr) {
                                            var response = JSON.parse(xhr.responseText);
                                            if (response.items) {
                                                $.each(response.items, function(index, value) {
                                                    if (value.source_code == depozit_online) stoc_Online = value.quantity;
                                                    else if (value.source_code == store) stoc_magazin = value.quantity;
                                                    else if (value.source_code == depozit_furnizor) stoc_DROP = value.quantity;
                                                    if (value.source_code == logi_Online) stoc_logi_Online = value.quantity;
                                                    if (value.source_code == logi_magazin) stoc_logi_magazin = value.quantity;
                                                });
                                                if (!status_ERP_Online) status_ERP_Online = status_ERP_default;
                                                if (!status_ERP_magazin) status_ERP_magazin = status_ERP_default;
                                                if (!status_ERP_DROP) status_ERP_DROP = status_ERP_default;
                                                if (type == 'alert') {
                                                    console.log(`
  sku: ${sku}
  magazin curent: ${store}
  web_status: ${web_status}
  available_online: ${available_online || 'NULL'}
  restrict_shipping: ${restrict_shipping}
  restrict_shipping_methods: ${restrict_shipping_methods}
  stock_limit: ${stock_limit}
  status_ERP_default: ${status_ERP_default}
  status_ERP_depozit_online: ${status_ERP_Online}
  status_ERP_magazin: ${status_ERP_magazin}
  status_ERP_depozit_furnizor: ${status_ERP_DROP}
  stoc_depozit_online: ${stoc_Online}
  stoc_magazin: ${stoc_magazin}
  stoc_depozit_furnizor: ${stoc_DROP}
  logi_depozit_online: ${logi_Online}
  logi_magazin: ${logi_magazin}
  stoc_logi_depozit_online: ${stoc_logi_Online}
  stoc_logi_magazin: ${stoc_logi_magazin}
  is_dropshipping: ${is_dropshipping}
  supply_blocked: ${supply_blocked}
                                              `);
                                                }
                                                var restrictie_curier = (restrict_shipping == 1 && (/\bcourier\b/.test(restrict_shipping_methods) || (/dpd/.test(restrict_shipping_methods) && /fancourier/.test(restrict_shipping_methods) && /gls/.test(restrict_shipping_methods))));
                                                var status;
                                                //CLOM
                                                if ((/S|T/.test(status_ERP_Online) && /S|T/.test(status_ERP_magazin)) && !restrictie_curier
                                                    && stoc_Online >= 1 && stoc_magazin >= stock_limit && stoc_logi_Online >= stock_limit
                                                    && web_status != 0 && available_online !== 0) status = 'CLOM';
                                                //CLO
                                                else if ((/S|T/.test(status_ERP_Online)) && !restrictie_curier
                                                         && stoc_Online >= 1 && stoc_logi_Online >= stock_limit
                                                         && web_status != 0 && available_online !== 0) status = 'CLO';
                                                //COM
                                                else if ((/S|T|L/.test(status_ERP_Online) && /S|T|L/.test(status_ERP_magazin)) && !restrictie_curier
                                                         && stoc_Online >= 1 && stoc_magazin >= stock_limit
                                                         && web_status != 0 && available_online !== 0) status = 'COM';
                                                //CO
                                                else if ((/S|T|L/.test(status_ERP_Online)) && !restrictie_curier
                                                         && stoc_Online >= 1
                                                         && web_status != 0 && available_online !== 0) status = 'CO';
                                                //FLM
                                                else if ((/S|T/.test(status_ERP_magazin))
                                                         && stoc_magazin >= stock_limit && stoc_logi_magazin >= stock_limit
                                                         && web_status != 0 && available_online !== 0) status = 'FLM';
                                                //FM
                                                else if ((/S|T|L/.test(status_ERP_magazin))
                                                         && stoc_magazin >= stock_limit
                                                         && web_status != 0 && available_online !== 0) status = 'FM';
                                                //CL
                                                else if ((/S|T|P/.test(status_ERP_Online)) && !restrictie_curier
                                                         && stoc_logi_Online >= stock_limit
                                                         && web_status != 0 && available_online !== 0) status = 'CL';
                                                //FL
                                                else if ((/S|T|P/.test(status_ERP_magazin))
                                                         && stoc_logi_magazin >= stock_limit
                                                         && web_status != 0 && available_online != 0) status = 'FL';
                                                //E
                                                else if (status_ERP_DROP == 'E' || status_ERP_Online == 'E' || status_ERP_magazin == 'E') {
                                                    GM_xmlhttpRequest({
                                                        method: "GET",
                                                        url: location.origin+`/admin/mui/index/render/?namespace=product_suppliers_listing&sku=${sku}&isAjax=true`,
                                                        headers: {"Accept": "application/json"},
                                                        onload: function(xhr) {
                                                            try {
                                                                var response = JSON.parse(xhr.responseText);
                                                                console.log(response);
                                                                if (response.items) {
                                                                    var furnizor_activ = 0;
                                                                    $.each(response.items, function( index, value ) {
                                                                        if (value.sku == sku && value.active == '1') {
                                                                            furnizor_activ = 1;
                                                                            return;
                                                                        }
                                                                    });
                                                                    //EC
                                                                    if ((/E/.test(status_ERP_DROP)) && !restrictie_curier
                                                                        && stoc_DROP >= stock_limit
                                                                        && web_status != 0 && (is_dropshipping == '1') && furnizor_activ == 1 && supply_blocked !== '03') status = 'EC';
                                                                    //ECFD
                                                                    else if ((/E/.test(status_ERP_Online) && /E/.test(status_ERP_magazin)) && !restrictie_curier
                                                                             && stoc_DROP >= stock_limit
                                                                             && web_status != 0 && is_dropshipping !== '1' && furnizor_activ == 1 && supply_blocked !== '03') status = 'ECFD';
                                                                    //ECD
                                                                    else if (/E/.test(status_ERP_Online) && !restrictie_curier
                                                                             && stoc_DROP >= stock_limit
                                                                             && web_status != 0 && is_dropshipping !== '1' && furnizor_activ == 1 && supply_blocked !== '03') status = 'ECD';
                                                                    //EFD
                                                                    else if (/E/.test(status_ERP_magazin)
                                                                             && stoc_DROP >= stock_limit
                                                                             && web_status != 0 && is_dropshipping !== '1' && furnizor_activ == 1 && supply_blocked !== '03') status = 'EFD';
                                                                    //COMANDA
                                                                    else if ((/E/.test(status_ERP_magazin)
                                                                              && stoc_DROP >= stock_limit
                                                                              && web_status != 0 && is_dropshipping !== '1' && furnizor_activ == 1)
                                                                             ||
                                                                             (/C/.test(status_ERP_magazin) && web_status !== 0 && supply_blocked !== '03')
                                                                             ||
                                                                             (/P/.test(status_ERP_magazin) && stoc_logi_magazin >= stock_limit && web_status != 0 && available_online !== 0)) status = 'COMANDA';
                                                                    //IT
                                                                    else if (/S|T|E|P/.test(status_ERP_magazin) || /S|T|E|P/.test(status_ERP_Online)
                                                                             &&
                                                                             (stoc_DROP < stock_limit || web_status == 0)) status = 'IT';
                                                                    //I
                                                                    else if (/L|R|Z|N/.test(status_ERP_magazin)) status = 'I';
                                                                    else status = 'I99';
                                                                    if (status) display_status(obj, status, type);
                                                                }
                                                                else console.log('Nu am gasit furnizorul produsului!');
                                                            }
                                                            catch(err){
                                                                console.log(err);
                                                            }
                                                        }
                                                    });
                                                }
                                                //COMANDA
                                                else if ((/C/.test(status_ERP_magazin) && web_status !== 0 && supply_blocked !== '03')
                                                         ||
                                                         (/P/.test(status_ERP_magazin) && stoc_logi_magazin >= stock_limit && web_status != 0 && available_online !== 0)) status = 'COMANDA';
                                                //FIZIC
                                                else if ((/S|T/.test(status_ERP_magazin)
                                                          && stoc_magazin >= stock_limit
                                                          && web_status !== 0 && available_online == 0)
                                                         ||
                                                         (/L/.test(status_ERP_magazin)
                                                          && stoc_magazin >= stock_limit
                                                          && web_status !== 0)) status = 'FIZIC';
                                                //IT
                                                else if (/S|T|P/.test(status_ERP_magazin)
                                                         &&
                                                         (stoc_magazin < stock_limit || web_status == 0)) status = 'IT';
                                                //I
                                                else if (/L|R|Z|N/.test(status_ERP_magazin)) status = 'I';
                                                else status = 'I99';
                                                if (status) display_status(obj, status, type);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                $(document).on('click', '.status', function() {
                    console.log('click status');
                    calc_status($(this), 'alert');
                });
                $(document).on('mouseup touchstart', '.form-address-head-customer-type', function(e) {
                    if (e.which == 2 || e.type == 'touchstart') {
                        $('.address-form-wrapper #pfa_name').val('Test PFA');
                        $('.address-form-wrapper #company').val('Test SRL');
                        $('.address-form-wrapper #customer_cif').val('108');
                        $('.address-form-wrapper #firstname').val('Test-a');
                        $('.address-form-wrapper #lastname').val('Test-b');
                        let email = `test_${new Date().toLocaleString('ro').replace(/, |:|\./g, '_')}@devd.ro`;
                        $('.address-form-wrapper #address-email:not(:disabled)').val(email);
                        $('.address-form-wrapper #repeat-address-email:not(:disabled)').val(email);
                        $('.address-form-wrapper #telephone').val('0700000000');
                        var loc = getCookie('customer_city') || 0;
                        var jud = getCookie('customer_region_id') || 0;
                        var callback = function(mutationsList, observer) {
                            console.log('change');
                            if (loc) {
                                if ($(`.address-form-wrapper .custom-select.cities-wrapper li[data-city-name="${loc}"]`).length) $(`.address-form-wrapper .custom-select.cities-wrapper li[data-city-name="${loc}"]`).click();
                            }
                            else if ($('.address-form-wrapper .custom-select.cities-wrapper li[data-city-id="3317"]').length) $('.address-form-wrapper .custom-select.cities-wrapper li[data-city-id="3317"]').click();
                            observer.disconnect();
                            $('.address-form-wrapper #street_1').val('Asdf');
                            $('.address-form-wrapper #select-street-1').val('Asdf');
                        };
                        var observer = new MutationObserver(callback);
                        observer.observe($('.address-form-wrapper .custom-select.cities-wrapper > .content > ul')[0], {attributes: false, childList: true, subtree: false});
                        if (jud) $(`.address-form-wrapper .custom-select.regions-wrapper li[data-value="${jud}"]`).click();
                        else $('.address-form-wrapper .custom-select.regions-wrapper li[data-value="285"]').click();
                        $('.address-form-wrapper #street_number').val('1');
                        $('.address-form-wrapper #address-newsletter-check').prop('checked', true);
                    }
                });
                $(document).on('mousedown touchstart', '.address-form-wrapper button.save', function(e) {
                    $('.custom-select.streets-wrapper.hide').val('');
                    $('.address-form-wrapper #street_1.hide').val('');
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
                    $(document).on('mouseup touchstart', '.cart-section-subtotal > ul > li > .label-cost:contains("Subtotal")', function(e) {
                        if (e.which == 2 || e.type == 'touchstart') {
                            var text = $('script:contains(window.checkoutConfig)').text() || '';
                            var obj = {};
                            if (/window.checkoutConfig = [^]+?};/g.test(text)) {
                                obj = JSON.parse(/(?:window.checkoutConfig = )([^]+?})(?:;)/g.exec(text)[1]);
                                console.log(obj);
                                console.log(obj.quoteItemData);
                                var cart = $(this).closest('.cart-section').data('cart-type');
                                console.log(cart);
                                var value = 0;
                                var weight = 0;
                                value = Number($(this).closest('.cart-section-subtotal').find('li:contains("Cost produse") > .cost').text().replace('lei', '').trim());
                                console.log(value);
                                var product_names = [];
                                $(this).closest('.cart-section').find('.cart-item-right-title').each(function() {
                                    product_names.push($(this).text().trim());
                                });
                                $(this).closest('.cart-section').find('.cart-item-dededeal-products .product-image-photo').each(function() {
                                    product_names.push($(this).attr('alt'));
                                });
                                var pallets = 0;
                                console.log(product_names);
                                var locker = 1;
                                var cargo = 0;
                                var products = [];
                                $.each(product_names, function(index, value) {
                                    $.each(obj.quoteItemData, function(index, val) {
                                        if (val.name == value) {
                                            console.log(weight);
                                                console.log(val.weight, val.qty, Number(val.weight * val.qty));
                                            if (cart == 'fleet_reservation') {
                                                if (val.product.is_heavy_product == '1') {
                                                    pallets = pallets + Math.trunc(((val.qty - val.product.min_qty_for_pallet)/val.product.max_qty_for_pallet)+1);
                                                }
                                                if (val.product.is_volumetric == '1' && val.qty > val.product.qty_req_volumetric) {
                                                    weight = weight + Number(val.qty) * get_volume_weight(Number(val.product.volume), val.product.unit_volume);
                                                }
                                                else weight = weight + Number(val.weight * val.qty);
                                            }
                                            else weight = weight + Number(val.weight * val.qty);
                                            if (Number(val.product.restrict_shipping) && val.product.restrict_shipping_methods.includes("locker")) locker = 0;
                                            else products.push({length: val.product.length, width: val.product.width, height: val.product.height, quantity: val.qty});
                                            if (val.product.is_cargo_product == "1") cargo = 1;
                                            return false;
                                        }
                                    });
                                });
                                console.log('paleti ', pallets);
                                console.log('products', products);
                                weight = weight.toFixed(2);
                                console.log(weight);
                                var store = getCookie('source_code');
                                var loc = $('.btn-store-selector-text > .semibold').text().split(',')[0];
                                var jud = $('.btn-store-selector-text > .semibold').text().split(',')[1].trim();
                                var methods = ["dedemanfleet", "courier"];
                                if (cargo) methods = ["dedemanfleet", "cargo", "courier"];
                                if (cart == 'fleet_reservation') {
                                    if (pallets) methods = ["dedemanheavyfleet"];
                                    else methods = ["dedemanfleet"];
                                }
                                else if (cart == 'courier_general') {
                                    if (cargo) methods = ["cargo", "courier"];
                                    else methods = ["courier"];
                                }
                                if (locker) methods.push('locker');
                                methods.push('flatrate');
                                let warehesouses = (prompt('Warehouses', 'LOGI, CONS, LG01') || '').trim();
                                console.log(warehesouses);
                                warehesouses = warehesouses.split(',').map(item => item.trim());
                                console.log(warehesouses);
                                var data = {
                                    delivery_methods: methods,
                                    weight: weight,
                                    value: value,
                                    store: store,
                                    county: jud,
                                    locality: loc,
                                    street: loc,
                                    pallets: pallets,
                                    products: products,
                                    warehouses: warehesouses
                                };
                                console.log(data);
                                shipping_tax(data);
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
                        $(this).find('.product-status').append(`<div class="my-sku">Cod produs: <span>${sku}</span></div>`);
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
                else if (location.pathname.includes('checkout/success') || location.pathname.includes('checkout/express/success')) {
                    GM_addStyle(`#order-no:hover {text-decoration: underline; cursor: pointer;}`);
                    console.log('success');
                    $('#order-no').on('mouseup', function(e) {
                        if (e.button < 2) {
                            let obj = $(this);
                            obj.fadeOut().fadeIn();
                            let ols = obj.text().trim().split(', ');
                            console.log(ols);
                            $.each(ols, function(i, value) {
                                GM_openInTab(location.origin+'/admin/sales/order/view/increment_id/'+value, {active: !e.button, insert: false});
                            });
                        }
                    });
                }
                else if (!location.pathname.includes('/review/customer') && !location.pathname.includes('/customer/account')) {
                    //count products in page
                    if ($('.products.wrapper.grid.products-grid').length) {
                        var count = $('.item.product.product-item').length || 0;
                        var text = count + ' produse afișate în această pagină';
                        if (count === 1) text = '1 produs afișat în această pagină';
                        else if (count > 19) text = count + ' de produse afișate în această pagină';
                        $('.products.wrapper.grid.products-grid').prepend(`<span style="position: absolute;right: 20px;top: -20px;">${text} </span>`);
                        //log skus
                        let skus = [];
                        $('.item.product.product-item').each(function() {
                            skus.push($(this).find('form').data('product-sku'));
                        });
                        // console.log(skus.join('\n'));
                    }
                    GM_addStyle(`.title-dededeal {display: inline-block; cursor: pointer;} .title-dededeal:hover {text-decoration: underline;}`);
                    $(document).on('mouseup touchstart', '.title-dededeal', function(e) {
                        if (e.which == 2 || e.type == 'touchstart') {
                            var id = $(this).closest('.dededeal-item').find('.dededeal-form > input[name="id"]').val() || 0;
                            if (id) GM_openInTab(location.origin+'/admin/dededeal/index/edit/id/'+id,{active: false, insert: false});
                            else alert('Nu am gasit id-ul dededeal-ului!');
                        }
                    });
                    $(document).on('mouseup touchstart', '.page-title-wrapper.product > .page-title', function(e) {
                        if (e.which == 2 || e.type == 'touchstart') {
                            $(this).fadeOut().fadeIn();
                            var sku = $('.product-add-form > form').data('product-sku');
                            function listener(e) {
                                e.clipboardData.setData("text/html", `<!--my html--><a href=${location.origin+location.pathname} target="_blank">${sku}</a>`);
                                e.clipboardData.setData("text/plain", sku);
                                e.preventDefault();
                            }
                            document.addEventListener("copy", listener);
                            document.execCommand("copy");
                            document.removeEventListener("copy", listener);
                        }
                    });
                    $(document).on('mouseup touchstart', '.online-availability .title', function(e) {
                        if (e.which == 2 || e.type == 'touchstart') {
                            $('.online-availability .product-availability-box .info-text:nth-of-type(2)').each(function() {
                                calc_working_days(this);
                            });
                            var store = getCookie('source_code');
                            console.log(store);
                            var loc = $('.btn-store-selector-text > .semibold').text().split(',')[0];
                            var jud = $('.btn-store-selector-text > .semibold').text().split(',')[1].trim();
                            console.log(loc, jud);
                            var price = $('.product-info-price span[data-price-type=finalPrice]').data('price-amount') || 0;
                            console.log(price);
                            var sku = $('.product-add-form > form').data('product-sku');
                            console.log(sku);
                            var qty = Number($('#qty')[0].min);
                            console.log(qty);
                            var status = $('.product.attribute.sku').data('status');
                            console.log(status);
                            if (sku) {
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: location.origin+`/rest/V1/products/${sku}?rnd=` + new Date().getTime(),
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json",
                                        "Authorization": "Bearer "+ GM_getValue(`api_key_${location.hostname}`) || ''
                                    },
                                    anonymous: true,
                                    onload: function(xhr) {
                                        var response = JSON.parse(xhr.responseText);
                                        console.log(response);
                                        let weight = 0;
                                        let length = 0;
                                        let width = 0;
                                        let height = 0;
                                        let restrict_shipping = 0;
                                        let restrict_shipping_methods = '';
                                        let warehouses = [];
                                        let is_cargo_product = 0;
                                        let is_volumetric = 0;
                                        let qty_req_volumetric = 0;
                                        let volume = 0;
                                        let unit_volume = '';
                                        var courier = ['CLO', 'CO', 'CL', 'CCAO', 'ECD', 'EC'];
                                        var courier_fleet = ['CLOM', 'CLM', 'COM', 'ECFD'];
                                        var delivery_methods = ["dedemanfleet"];
                                        if (courier.includes(status)) {
                                            if (is_cargo_product == '1') delivery_methods = ["cargo", "courier"];
                                            else delivery_methods = ["courier", "locker"];
                                            store = 'LOGI';
                                        }
                                        else if (courier_fleet.includes(status)) {
                                            if (is_cargo_product == '1') delivery_methods = ["dedemanfleet", "cargo", "courier"];
                                            else delivery_methods = ["dedemanfleet", "courier", "locker"];
                                        }
                                        if (response) {
                                            weight = qty * response.weight;
                                            if (response.custom_attributes) {
                                                $.each(response.custom_attributes, function(index, value) {
                                                    if (value.attribute_code == 'length') length = Number(value.value) || 0;
                                                    else if (value.attribute_code == 'width') width = Number(value.value) || 0;
                                                    else if (value.attribute_code == 'height') height = Number(value.value) || 0;
                                                    else if (value.attribute_code == 'restrict_shipping') restrict_shipping = Number(value.value) || 0;
                                                    else if (value.attribute_code == 'restrict_shipping_methods') restrict_shipping_methods = value.value;
                                                    else if (value.attribute_code == 'is_cargo_product') is_cargo_product = value.value;
                                                    else if (value.attribute_code == 'is_volumetric') is_volumetric = value.value;
                                                    else if (value.attribute_code == 'qty_req_volumetric') qty_req_volumetric = value.value;
                                                    else if (value.attribute_code == 'volume') volume = Number(value.value) || 0;
                                                    else if (value.attribute_code == 'unit_volume') unit_volume = value.value;
                                                });
                                            }
                                            if (is_volumetric && qty > qty_req_volumetric) weight = qty * get_volume_weight(volume, unit_volume);
                                            if (response.extension_attributes.source_attributes && /^FL$|^CL$/.test(status)) {
                                                $.each(response.extension_attributes.source_attributes, function(index, value) {
                                                    if (value.source_code == store) {
                                                        warehouses.push(value.logistic_source);
                                                        return false;
                                                    }
                                                });
                                            }
                                            console.log(warehouses);
                                            var data = {
                                                delivery_methods: delivery_methods,
                                                weight: weight,
                                                value: price * qty,
                                                store: store,
                                                county: jud,
                                                locality: loc,
                                                street: loc,
                                                pallets: 0,
                                                products: [{length: length, width: width, height: height, quantity: qty}],
                                                warehouses: warehouses
                                            };
                                            if (restrict_shipping == 1 && /\blocker\b/.test(restrict_shipping_methods)) data.excluded_delivery_methods = ["locker"];
                                            console.log(data);
                                            shipping_tax(data);
                                        }
                                    }
                                });
                            }
                        }
                    });
                    $(document).on('mouseup touchstart', '.online-availability .product-availability-box .info-text:nth-of-type(2)', function(e) {
                        if (e.which == 2 || e.type == 'touchstart') {
                            calc_working_days(this);
                        }
                    });
                    function getBusinessDatesCount(startDate, endDate) {
                        let count = 0;
                        const curDate = new Date(startDate.getTime());
                        while (curDate <= endDate) {
                            const dayOfWeek = curDate.getDay();
                            if(dayOfWeek !== 0 && dayOfWeek !== 6) count++;
                            curDate.setDate(curDate.getDate() + 1);
                        }
                        return count;
                    }
                    function calc_working_days(elem) {
                        var min = elem.childNodes[1].data.split(' și ')[0].trim();
                        var max = elem.childNodes[1].data.split(' și ')[1].trim();
                        function convert_date(date) {
                            var months = {
                                ian:"01",
                                feb:"02",
                                mar:"03",
                                apr:"04",
                                mai:"05",
                                iun:"06",
                                iul:"07",
                                aug:"08",
                                sept:"09",
                                oct:"10",
                                nov:"11",
                                dec:"12"
                            }
                            var day = date.split(' ')[0];
                            var month = months[date.split(' ')[1]];
                            var year = new Date().getFullYear();
                            return month+'/'+day+'/'+year;
                        }
                        var numOfDaysMin = getBusinessDatesCount(new Date(), new Date(convert_date(min)));
                        var numOfDaysMax = getBusinessDatesCount(new Date(), new Date(convert_date(max)));
                        if (!$(elem).find('.no_of_days').length) $(elem).append(`<span class="no_of_days"> (${numOfDaysMin}-${numOfDaysMax} zile lucratoare)</span>`);
                    }
                    var status = '-';
                    if ($('.product.attribute.sku').data('status')) status = $('.product.attribute.sku').data('status');
                    $('.product-store-selector-wrap').prepend(`<p class="status" data-sku="${$('.product.attribute.sku > span').text().replace(' #', '')}" data-status="${status}">Status: ${status}</p>`);
                    if ($('p.status').length) calc_status($('p.status'), 'append');
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
                    $('div.status').each(function() {
                        //if (!$(this).attr('data-sku').includes('-')) calc_status($(this), 'append');
                    });
                    $('.container-dededeal').each(function() {
                        var id = $(this).closest('.dededeal-item').find('.dededeal-form > input[name="id"]').val() || 0;
                        $(this).attr('id', 'dededeal'+id);
                        console.log('dededeal id ' + id);
                        if (id) {
                            console.log('make request to obtain dededeal info');
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: location.origin+'/admin/dededeal/index/edit/id/'+id,
                                onload: function(xhr) {
                                    if (/(?:<script type="text\/x-magento-init">)({"\*": {"Magento_Ui\/js\/core\/app": {"types":{"dataSource":{[^]+?)(?:<\/script>)/gm.test(xhr.responseText)) {
                                        var obj = JSON.parse(/(?:<script type="text\/x-magento-init">)({"\*": {"Magento_Ui\/js\/core\/app": {"types":{"dataSource":{[^]+?)(?:<\/script>)/gm.exec(xhr.responseText)[1]);
                                        var products = obj["*"]["Magento_Ui/js/core/app"].components.coldo_dededeal_form.children.coldo_dededeal_form_data_source.config.data.links.associated;
                                        var dededeal = products[0].dededeal_id;
                                        console.log('am obtinut informatiile despre dededeal');
                                        console.log(dededeal);
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
                                    else console.log('nu am obtinut informatiile despre dededeal');
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
                else if (location.pathname.includes('customer/account/edit')) {
                    console.log('customer edit');
                    GM_addStyle('h1.page-title {cursor: pointer;} h1.page-title:hover {text-decoration: underline;}');
                    $(document).on('auxclick touchstart', 'h1.page-title', function(e) {
                        if (e.which == 2 || e.type == 'touchstart') {
                            var details = JSON.parse(localStorage.getItem('mage-cache-storage'));
                            console.log(details.customer.id);
                            if (details.customer.id) GM_openInTab(location.origin+'/admin/customer/index/edit/id/'+details.customer.id,{active: false, insert: false});
                            else alert('Nu am gasit id-ul clientului!');
                        }
                    });
                }
            }
            else if (location.hostname.includes('ing.ro') || location.hostname.includes('btrl.ro') || location.hostname.includes('secure.euplatesc.ro')) {
                GM_addStyle(`#description:hover, .link_ol:hover {text-decoration: underline; cursor: pointer;}`);
                if (location.hostname == 'secure.euplatesc.ro') {
                    link_comanda($('.col-md-6.padding0:first-of-type'));
                    $('#timer').after(`<div class="col-md-6"><div class="form-group"><label class="nfbsize" for="card_list">Alege un card: </label><select class="form-control" id="card_list" name="card_list">
										<option></option>
                    <optgroup label="Visa">
					<option value="4111111111111111" data-nume="Authentication failed">4111111111111111 - Authentication failed</option>
                    <option value="4444333322221111" data-nume="Not sufficient funds">4444333322221111 - Not sufficient funds</option>
                    <option value="4000020000000000" data-nume="Transaction declined">4000020000000000 - Transaction declined</option>
                    <option value="4400000000000008" data-nume="Expired card">4400000000000008 - Expired card</option>
                    <option value="4607000000000009" data-nume="Invalid response">4607000000000009 - Invalid response</option>
                    <option value="4000640000000005" data-nume="Approved">4000640000000005 - Approved</option>
                    </optgroup>
                    <optgroup label="Mastercard">
					<option value="5454545454545454" data-nume="Authentication failed">5454545454545454 - Authentication failed</option>
                    <option value="5555555555554444" data-nume="Not sufficient funds">5555555555554444 - Not sufficient funds</option>
                    <option value="2222400010000008" data-nume="Transaction declined">2222400010000008 - Transaction declined</option>
                    <option value="2222400030000004" data-nume="Expired card">2222400030000004 - Expired card</option>
                    <option value="5100060000000002" data-nume="Invalid response">5100060000000002 - Invalid response</option>
                    <option value="5500000000000004" data-nume="Approved">5500000000000004 - Approved</option>
                    </optgroup>
                    </select></div></div>`);
                    $('#card_list').on("change", function() {
                        console.log($(this));
                        $('#card').val($(this).val())[0].dispatchEvent(new Event("keyup"));
                        $('#card')[0].dispatchEvent(new Event("blur"));
                        $('#name_on_card').val($(this).find(':selected').data('nume'));
                        let month_options = $("#exp_month > option:gt(0)");
                        month_options[Math.floor(Math.random() * month_options.length)].selected = true;
                        let year_options = $("#exp_year > option:gt(1)");
                        year_options[Math.floor(Math.random() * year_options.length)].selected = true;
                        $('#cvv2').val(Math.floor(Math.random()*(999-100+1)+100));
                    });
                    $('#consent').prop('checked', true);
                }
                else if (location.hostname.includes('ing.ro')) {
                    $('.form-container:not(#googlepay-button, #googlepay-button-text) > .text-enter-card-info').after(`<div class="container-input-fullwidth"><label for="card_list" class="label-form-details">Alege un card: </label><select class="select-control input-fullwidth-form-details" id="card_list" name="card_list">
					<option></option>
                    <option value="4662861127535322" data-nume="ING VISA" data-exp_year="2027" data-exp_month="02" data-cvv="342">4662861127535322 | 02/2027 | Visa</option>
                    <option value="4662861320103092" data-nume="ING VISA" data-exp_year="2028" data-exp_month="10" data-cvv="598">4662861320103092 | 10/2028 | Visa</option>
                    <option value="5204740000001002" data-nume="ING Mastercard" data-exp_year="2025" data-exp_month="12" data-cvv="100">5204740000001002 | 12/2025 | Mastercard</option>
                    <option value="4111111111111111" data-nume="ING Inexistent" data-exp_year="2028" data-exp_month="12" data-cvv="100">4111111111111111 | 12/2028 | Inexistent</option>
                    </select></div>`);
                    $('#card_list').on("change", function() {
                        console.log($(this));
                        $('#iPAN').val($(this).val());
                        $('#iTEXT').val($(this).find(':selected').data('nume'));
                        $('#month').val($(this).find(':selected').data('exp_month'));
                        $('#year').val($(this).find(':selected').data('exp_year'));
                        $('#iCVC').val($(this).find(':selected').data('cvv')).attr('type', 'text')[0].dispatchEvent(new Event("keyup"));
                    });
                }
                else if (location.hostname.includes('btrl.ro')) {
                    $('.form-number.form-detail').prepend(`<div class="form-number form-detail"><div class="label" style="display: block;"><span>Alege un card:</span><select class="select-control input-fullwidth-form-details" id="card_list" name="card_list" style="display: block; background-color: #fafafa; border: 1px solid #e7e7e7; border-radius: 12px; height: 58px; width: 100%; padding-left: 16px; font-size: 16px;" placeholder="Alege un card">
					<option></option>
                    <option value="5299 1210 3975 7714" data-nume="Card test BT" data-expiry="09/29" data-cvv="064">5299121039757714 | 09/2029 | OK</option>
                    <option value="5299 1210 3975 7714" data-nume="Card test BT" data-expiry="10/30" data-cvv="064">5299121039757714 | 10/2030 | Data expirare eronata</option>
                    <option value="5299 1210 3975 7714" data-nume="Card test BT" data-expiry="09/29" data-cvv="111">5299121039757714 | 09/2029 | CVV invalid</option>
                    <option value="4111 1111 1111 1111" data-nume="Visa Inexistent" data-expiry="12/28" data-cvv="100">4111111111111111 | 12/2028 | Inexistent</option>
                    </select></div>`);
                    $('#card_list').on("change", function() {
                        console.log($(this));
                        $('#panInputLabel > input').val($(this).val())[0].dispatchEvent(new Event("input"));
                        $('#cardholderInputLabel > input').val($(this).find(':selected').data('nume'));
                        $('#expiryInputLabel > input').val($(this).find(':selected').data('expiry'));
                        $('#cvvInputLabel > input').val($(this).find(':selected').data('cvv')).attr('type', 'text');
                    });
                }
                $('#description, .link_ol').on('auxclick', function(e) {
                    if (e.button < 2) {
                        let obj = $(this);
                        obj.fadeOut().fadeIn();
                        let ol = obj.text().replace('Comanda ','').trim();
                        console.log(ol);
                        let origin = 'https://staging.dedeman.ro';
                        if (location.hostname == 'securepay.ing.ro' || location.hostname == 'ecclients.btrl.ro') origin = 'https://www.dedeman.ro';
                        else if (location.hostname == 'secure.euplatesc.ro') origin = $('#merchant_id .glyphicon').attr('onclick').split(`','`)[1] || 'https://staging.dedeman.ro';
                        GM_openInTab(origin+'/admin/sales/order/view/increment_id/'+ol, {active: !e.button, insert: false});
                    }
                });
            }
        }
    });
})();