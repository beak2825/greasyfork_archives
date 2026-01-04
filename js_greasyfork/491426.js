// ==UserScript==
// @name         Magento 2 SSC
// @namespace    dedeman
// @version      1.1
// @description  all
// @author       Dragos
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @match        https://www.dedeman.ro/admin/sales/order/view/order_id/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.js
// @resource     confirm_css https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.css
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      dedeman.ro
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/491426/Magento%202%20SSC.user.js
// @updateURL https://update.greasyfork.org/scripts/491426/Magento%202%20SSC.meta.js
// ==/UserScript==
/* global $ */
/* global submitAndReloadArea */

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("confirm_css"));
    var status_curent = '';
    $(document).ready(function() {
        status_curent = $('#history_status').val();
        if (sessionStorage.getItem('history_comment')) {
            $('#history_comment').val(sessionStorage.getItem('history_comment'));
            sessionStorage.removeItem('history_comment');
        }
        $('.order-history-comments-options input').each(function() {
            let value = sessionStorage.getItem($(this).attr('id')) || '';
            if (value) {
                $(this).prop('checked', (value.toLowerCase() === 'true'));
                sessionStorage.removeItem($(this).attr('id'));
            }
        });
        $('.order-account-information > .admin__page-section-item-title > .actions').hide().after(`<a id="comenzi_client" style="float: right;line-height: 24px;margin-right: 10px;cursor: pointer;">Comenzi client</a>`);
        $('#comenzi_client').on('click', function() {
            GM_addStyle('.jconfirm-lista_comenzi {font-family: Arial; font-size: 14px; font-weight: 500; font-style: normal;} .jconfirm-lista_comenzi .jconfirm-content-pane {max-height: calc(100vh - 160px) !important; overscroll-behavior: contain;} .jconfirm-lista_comenzi .jconfirm-box {width: max-content; min-width: 400px; max-width: 95vw;} .jconfirm-lista_comenzi .jconfirm-title-c {font-size: 16px !important; margin-right: 20px; cursor: move !important;} .jconfirm-lista_comenzi .jconfirm-box div.jconfirm-content-pane .jconfirm-content {overflow: unset;}');
            let metode_plata = {
                ingpay: "Plată integrală - ING WebPay",
                m2ingwebpay: "Plată integrală - ING WebPay",
                ep_initialize: "Plată integrală - EuPlatesc",
                eppay: "Plată integrală - EuPlatesc",
                eprate_bcr: "Plată în rate - BCR",
                eprate_raiffeisen: "Plată în rate - Raiffeisen",
                eprate_bt: "Plată în rate - BT",
                banktransfer: "Transfer bancar (Ordin de plată)",
                checkmo: "Transfer bancar (Ordin de plată)",
                garantib: "Plată în rate - Garanti Bank (Bonus Card)",
                mobilpay_cc: "Plată în rate - Garanti Bank (Bonus Card)",
                crediteurope: "Plată în rate - Nexent Bank (CardAvantaj)",
                mobilpay_cardavantaj: "Plată în rate - Nexent Bank (CardAvantaj)",
                cashondelivery: "Plată la livrare",
                netopia: "Plată integrală - MobilPay",
                mobilpay_card: "Plată integrală - MobilPay",
                adminpayment: "Plată online prin card - Admin",
                btipay: "Plată în rate sau integrală - BT iPay",
                btdirect: "Credit prin BT Direct",
                gpay: "Google pay",
                apay: "Apple pay"
            };
            let statusi = {
                "received": "Received",
                "comanda_facturata": "Comanda facturata",
                "comanda_expediata": "Comanda expediata",
                "raspuns_client": "In asteptare raspuns client",
                "tranzactie_aprobata": "Tranzactie aprobata",
                "achizitie_marfa": "Achizitie marfa",
                "livrare_flota_ddm": "Pregatire marfa in vederea livrarii cu Flota Dedeman",
                "livrare_volumetric": "Transport marfuri voluminoase",
                "pregatire_marfa": "Pregatire marfa",
                "processing": "In procesare",
                "confirmare_plata": "In asteptare - Confirmare plata",
                "alocata": "Comanda alocata",
                "contact_client_produs_lipsa": "Contact client - Produs lipsa",
                "livrare_magazin": "Pregatire marfa in vederea ridicarii din magazin",
                "marfa_pregatita": "Toata marfa e pregatita",
                "probleme_aprovizionare": "CRM - Probleme aprovizionare",
                "produse_lipsa": "Produse lipsa",
                "confirmare_livrare": "CRM - Confirmare livrare",
                "confirmare_tranzactie": "In asteptare confirmare tranzactie",
                "contact_probleme_aprovizionare": "Contact client - Probleme aprovizionare",
                "livrare_curier": "Pregatire marfa in vederea livrarii prin curier",
                "plata_op_neconfirmata": "OP platit - neconfirmat de Contabilitate",
                "pending_payment": "Card - In asteptare confirmare",
                "fraud": "Plata suspecta (frauda)",
                "payment_review": "Card - Verificare plata",
                "probleme_card": "Card – probleme plata",
                "confirmata": "Comanda confirmata",
                "pending": "Comanda noua",
                "pending_client": "Card - in asteptare raspuns client",
                "verificare_client": "CRM - Verificare date client",
                "holded": "Blocata",
                "comanda_finalizata": "Comanda finalizata (livrata)",
                "complete": "Comanda finalizata",
                "comanda_finalizata_magazin": "Comanda finalizata - Facturata in magazin",
                "closed": "Comanda Inchisa",
                "anulata_termen_depasit": "Anulata - Termen livrare depasit",
                "anulata_tranzactie_respinsa": "Anulata - Tranzactie respinsa",
                "anulata_clientul_nu_raspunde": "Anulata - Clientul nu raspunde",
                "anulata_date_invalide": "Anulata - Date incomplete",
                "anulata_livrare_partiala": "Anulata - Livrare partiala acceptata",
                "anulata_plata_invalida": "Anulata - Probleme card",
                "anulata_renuntare": "Anulata - Produse lipsa",
                "anulata_transferata": "Anulata - Comanda transferata",
                "canceled": "Anulata - La cererea clientului",
                "tranzactie_respinsa": "Tranzactie respinsa",
                "anulata_colet_deteriorat": "Anulata - Colet deteriorat de curier",
                "anulata_facturata_magazin": "Anulata - Facturata in magazin",
                "anulata_modificare_plata": "Anulata - Modificare modalitate plata/livrare",
                "anulata_produse_alternative": "Anulata - Produse alternative acceptate",
                "anulata_tentativa_frauda": "Anulata - Tentativa de frauda",
                "anulata_transferata_magazin": "Anulata - Transferata in magazin",
                "rejected": "Rejected",
                "anulata_alte_produse": "Anulata - Clientul a ales alt(e) produs(e)",
                "anulata_comanda_refacuta": "Anulata - Comanda refacuta",
                "anulata_la_cerere": "Anulata - Comanda anulata de catre client",
                "anulata_neridicata": "Anulata - Clientul renunta la comanda",
                "anulata_refuz_livrare": "Anulata - Clientul refuza comanda",
                "comanda_platita": "OP - Comanda platita",
                "plata_op_confirmata": "OP - Plata confirmata",
                "livrare_pe_luna": "Metoda livrare netratata"
            };
            GM_addStyle(`#comenzi {border-collapse: separate; border-spacing: 0;width:100%;} #comenzi td, #comenzi th{padding:6px;} #comenzi th{padding-top:10px;padding-bottom:10px;text-align:left;background-color:#43a0de;color:white;}.tbl-info {background-color: #0bc9f566 !important;}.tbl-info:hover {background-color: #0bc9f5b0 !important;}.tbl-danger {background-color: #f2dede;}.tbl-danger:hover {background-color: #ebcccc;}.tbl-success {background-color: #dff0d8;}.tbl-success:hover {background-color: #d0e9c6;}.tbl-active {background-color: #f5f5f5;}.tbl-active:hover {background-color: #e8e8e8;}
                #comenzi th {
                    border-top: 1px solid #f5720b;
                    border-bottom: 1px solid #f5720b;
                    border-right: 1px solid #f5720b;
                }
                #comenzi td {
                    border-bottom: 1px solid #f5720b;
                    border-right: 1px solid #f5720b;
                }
                #comenzi th:first-child,
                #comenzi td:first-child {
                    border-left: 1px solid #f5720b;
                }
                #comenzi thead th {
                    position: sticky;
                    position: -webkit-sticky;
                    top: 0;
                }
                #comenzi td:nth-of-type(1), #comenzi td:nth-of-type(2), #comenzi td:nth-of-type(7), #comenzi td:nth-of-type(8) {
                    white-space: nowrap;
                }
                #comenzi {
                    padding: 0 1px 1px 0;
                }
                `);
            var email = $('.order-account-information-table > tbody > tr:nth-of-type(2) > td').text().trim();
            var current_orderId = $("input[name='order_id']").val();
            if (email != 'faraemail@dedeman.ro') {
                var raspuns_api = $.confirm({
                    columnClass: '',
                    title: `Comenzi plasate cu adresa de e-mail <span style="color: #007bdb;">${email}</span>`,
                    content: `Loading...`,
                    type: 'blue',
                    closeIcon: true,
                    buttons:false,
                    theme: 'light,lista_comenzi'
                });
                magento_mui_request({namespace:`sales_order_grid&filters[customer_email]=${encodeURIComponent(email)}&sorting[field]=created_at&sorting[direction]=desc`}).then(function(response) {
                    if (response.items) {
                        var no_of_orders = 0;
                        var content = '<table id="comenzi"><thead><tr><th>Comanda</th><th>Data</th><th>Magazin</th><th>Status</th><th>Metoda de plata</th><th>Metoda de livrare</th><th>Cost livrare</th><th>Total comanda</th></tr></thead><tbody>';
                        $.each(response.items, function(i, value) {
                            if (value.customer_email == email) {
                                no_of_orders++;
                                var comanda = `<a href="${value.actions.view.href}" target="_blank">${value.increment_id}</a>`;
                                var data = new Date(value.created_at.replace(/-/g,'/'));
                                data = data.toLocaleDateString('ro-RO')+' '+data.toLocaleTimeString('ro-RO');
                                var magazin = value.source_code;
                                var status = statusi[value.status] || value.status;
                                var plata = metode_plata[value.payment_method] || value.payment_method;
                                var metoda_livrare = value.shipping_information;
                                var cost_livrare = value.shipping_and_handling;
                                var total_comanda = value.grand_total;
                                if (value.entity_id == current_orderId) content += '<tr class="tbl-info">';
                                else if (/anulata/gi.test(status)) content += '<tr class="tbl-danger">';
                                else if (/comanda finalizata/gi.test(status)) content += '<tr class="tbl-success">';
                                else content += '<tr class="tbl-active">';
                                content += '<td>'+comanda+'</td><td>'+data+'</td><td>'+magazin+'</td><td>'+status+'</td><td>'+plata+'</td><td>'+metoda_livrare+'</td><td>'+cost_livrare+'</td><td>'+total_comanda+'</td></tr>';
                            }
                        });
                        content += '</tbody></table>';
                        if (no_of_orders) raspuns_api.setContent(content);
                        else raspuns_api.setContent('Nu am gasit comenzi!');
                        raspuns_api.setTitle(`Comenzi plasate cu adresa de e-mail <span style="color: #007bdb;">${email}</span> (${no_of_orders})`);
                    }
                    else raspuns_api.setContent('Nu am gasit comenzi!');
                }).catch(function(e) {
                    raspuns_api.setContent(e);
                });
            }
            else alert(`Nu se cauta comenzi cu adresa de e-mail "faraemail@dedeman.ro"!`);
        });
    });
    $(document).on('mouseenter', '#order_history_block .order-history-comments-actions .action-secondary.action-save.scalable.action-default:not(#trimite_comentariu)', function() {
        $(this).after($(this).clone().attr('id', 'trimite_comentariu')).remove();
    });
    $(document).on('click', '#trimite_comentariu', function() {
        $(this).addClass('disabled');
        var orderId = $("input[name='order_id']").val();
        var no_of_comments = $('.note-list > li').length;
        var status_nou = $('#history_status').val();
        GM_xmlhttpRequest({
            method: "GET",
            url: location.origin+'/admin/sales/order/view/order_id/'+orderId,
            onload: function(xhr) {
                if (xhr.status === 200) {
                    if (/<select name="history\[status\]" id="history_status" [^]+?<\/select>/gmi.test(xhr.responseText)) {
                        var select = $($.parseHTML(xhr.responseText.match(/<select name="history\[status\]" id="history_status" [^]+?<\/select>/gmi)[0]));
                        var status_db = select.val();
                        if (status_curent == status_db) {
                            my_submit_and_reload();
                        }
                        else {
                            GM_addStyle('.jconfirm-my_confirm .jconfirm-box {width: fit-content;} .jconfirm-my_confirm .jconfirm-buttons{display: flex; width: 100%; justify-content: space-between; float: unset !important;} .jconfirm-my_confirm .jconfirm-content {margin-top: 14px;}');
                            $.confirm({
                                title: '<span style="font-size: 30px;color: #eb6556;">&#9888;</span> Status schimbat!',
                                content: `Statusul comenzii s-a schimbat din "<b>${status_curent}</b>" în "<b>${status_db}</b>" de când a fost deschisă.<br><br><div style="text-align: center;">Dorești să reîncarci pagina?</div>`,
                                type: 'red',
                                buttons: {
                                    nu: {
                                        action: function () {
                                            //close
                                        }
                                    },
                                    da: {
                                        btnClass: 'btn-blue',
                                        action: function () {
                                            sessionStorage.setItem('history_comment', $('#history_comment').val());
                                            $('.order-history-comments-options input').each(function() {
                                                sessionStorage.setItem($(this).attr('id'), $(this).prop('checked'));
                                            });
                                            location.reload();
                                        }
                                    }
                                },
                                theme: 'light,my_confirm'
                            });
                        }
                    }
                    else my_submit_and_reload();
                }
                else my_submit_and_reload();
            },
            onerror: function(e) { my_submit_and_reload(); },
            timeout: 30000,
            ontimeout: function() { my_submit_and_reload(); }
        });
        function my_submit_and_reload() {
            waitForElm('body > .loading-mask:visible').then((elm) => {
                waitForElm('body > .loading-mask:hidden').then((elm) => {
                    if ($('.note-list > li').length == no_of_comments) $('#trimite_comentariu').removeClass('disabled');
                    else if (status_curent !== status_nou) {
                        $('body > .loading-mask').show();
                        location.reload();
                    }
                });
            });
            submitAndReloadArea($('#order_history_block').parent()[0], `${location.origin}/admin/sales/order/addComment/order_id/${orderId}/administrator/1/`);
        }
    });
    function waitForElm(selector) {
        return new Promise(resolve => {
            if ($(selector).length) {
                return resolve($(selector));
            }
            const observer = new MutationObserver(mutations => {
                if ($(selector).length) {
                    resolve($(selector));
                    observer.disconnect();
                }
            });
            var attributes_state = false;
            if (/visible|hidden/.test(selector)) attributes_state = true;
            observer.observe(document.body, {attributes: attributes_state, childList: true, subtree: true});
        });
    }
    function magento_mui_request(params) {
        return new Promise(function(resolve, reject) {
            var url = location.origin+'/admin/mui/index/render/?namespace=' + params.namespace + '&paging[pageSize]=5000&isAjax=true&rnd='+new Date().getTime();
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                onload: function(xhr) {
                    if (xhr.status == 200) {
                        try {
                            var response = JSON.parse(xhr.responseText);
                            resolve(response);
                        }
                        catch(e) {
                            reject(e);
                        }
                    }
                    else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                },
                onerror: function(e) {
                    reject(e);
                },
                timeout: 60000,
                ontimeout: function() {reject('Timeout API Magento!'); }
            });
        });
    }
})();