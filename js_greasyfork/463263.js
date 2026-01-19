// ==UserScript==
// @name         Magento 2 admin
// @namespace    dedeman
// @version      4.24
// @description  all
// @author       Dragos
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @match        https://www.dedeman.ro/admin*
// @match        https://staging.dedeman.ro/admin*
// @match        https://staging2.dedeman.ro/admin*
// @match        https://bie2.dedeman.ro/*
// @match        https://manager.euplatesc.ro/v3/*
// @match        https://admin.mobilpay.ro/*purchase/admin/*
// @match        https://admin.netopia-payments.com/*
// @match        https://securepay.ing.ro/consola/index.jsp*
// @match        https://ecclients-sandbox.btrl.ro/console/index.html*
// @match        https://ecclients.btrl.ro/console/index.html*
// @match        http*://dedeweb.dedeman.ro/*
// @match        http*://angajat.dedeman.ro/*
// @match        https://portal.dedeman.ro/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mailcheck/1.1.2/mailcheck.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/trumbowyg.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/plugins/cleanpaste/trumbowyg.cleanpaste.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/plugins/colors/trumbowyg.colors.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/plugins/fontsize/trumbowyg.fontsize.min.js
// @resource     confirm_css https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.css
// @resource     trumbowyg_css https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/ui/trumbowyg.min.css
// @resource     trumbowyg_colors_css https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/plugins/colors/ui/trumbowyg.colors.min.css
// @resource     trumbowyg_icons https://www.dedeman.ro/media/wysiwyg/ICONS/trumbowyg-icons.svg
// @resource     hint https://cdnjs.cloudflare.com/ajax/libs/hint.css/2.7.0/hint.min.css
// @grant        GM_getResourceText
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        window.onurlchange
// @grant        window.close
// @connect      dedeman.ro
// @connect      api.dpd.ro
// @connect      api.fancourier.ro
// @connect      api.mygls.ro
// @connect      urgentcargus.azure-api.net
// @connect      webservicesp.anaf.ro
// @connect      bnr.ro
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/463263/Magento%202%20admin.user.js
// @updateURL https://update.greasyfork.org/scripts/463263/Magento%202%20admin.meta.js
// ==/UserScript==
/* global $ */
/* global Mailcheck */
/* global eo_mid_change */
/* global order */
/* global submitAndReloadArea */
/* global addBySku */
/* global Application */
/* global load_trans_list */

(function() {
    'use strict';
    if (/(?:\?|&)nos\b/i.test(location.search)) {
        console.log('no script');
    }
    else {
        const OL_PATTERN = '(OL[A-Z\\d]{0,2}?1D\\d{5,7}(?:-\\d{1,2})?)';
        const regExOLTest  = new RegExp(OL_PATTERN);
        const regExOLMatch = new RegExp(OL_PATTERN, 'g');
        let regExPayments = /\b[A-Z0-9]{40}\b|\b\d{7,}:c\b|\b[a-z0-9-]{36}\b/g;
        let regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        let regex_multiple_emails = /^((([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))(; ?)?)*$/i;
        let regExDPD = /\b8\d{10}\b/g;
        let regExFAN = /\b\d{13}\b/g;
        let regExGLS = /\b62\d{8}\b/g;
        let regExCargus = /\b(10\d{8}|37\d{7})\b/g;
        let op_users = ['dragos.nechita', 'daniel', 'marcel.banu', 'anamaria.mirza', 'oana.nechita', 'florina.hornea'];
        let retur_users = ['dragos.nechita', 'daniel', 'marcel.banu', 'anamaria.mirza', 'oana.nechita', 'florina.hornea'];
        let judete = {
            "Alba": {id: 278, nume: "Alba"},
            "Arad": {id: 279, nume: "Arad"},
            "Arges": {id: 280, nume: "Argeş"},
            "Bacau": {id: 281, nume: "Bacău"},
            "Bihor": {id: 282, nume: "Bihor"},
            "Bistrita-Nasaud": {id: 283, nume: "Bistriţa-Năsăud"},
            "Botosani": {id: 284, nume: "Botoşani"},
            "Braila": {id: 286, nume: "Brăila"},
            "Brasov": {id: 285, nume: "Braşov"},
            "Bucuresti - Sector 1": {id: 287, nume: "Bucureşti - Sector 1"},
            "Bucuresti - Sector 2": {id: 485, nume: "Bucureşti - Sector 2"},
            "Bucuresti - Sector 3": {id: 486, nume: "Bucureşti - Sector 3"},
            "Bucuresti - Sector 4": {id: 487, nume: "Bucureşti - Sector 4"},
            "Bucuresti - Sector 5": {id: 488, nume: "Bucureşti - Sector 5"},
            "Bucuresti - Sector 6": {id: 489, nume: "Bucureşti - Sector 6"},
            "Buzau": {id: 288, nume: "Buzău"},
            "Calarasi": {id: 290, nume: "Călăraşi"},
            "Caras-Severin": {id: 289, nume: "Caraş-Severin"},
            "Cluj": {id: 291, nume: "Cluj"},
            "Constanta": {id: 292, nume: "Constanţa"},
            "Covasna": {id: 293, nume: "Covasna"},
            "Dambovita": {id: 294, nume: "Dâmboviţa"},
            "Dolj": {id: 295, nume: "Dolj"},
            "Galati": {id: 296, nume: "Galaţi"},
            "Giurgiu": {id: 297, nume: "Giurgiu"},
            "Gorj": {id: 298, nume: "Gorj"},
            "Harghita": {id: 299, nume: "Harghita"},
            "Hunedoara": {id: 300, nume: "Hunedoara"},
            "Ialomita": {id: 301, nume: "Ialomiţa"},
            "Iasi": {id: 302, nume: "Iaşi"},
            "Ilfov": {id: 303, nume: "Ilfov"},
            "Maramures": {id: 304, nume: "Maramureş"},
            "Mehedinti": {id: 305, nume: "Mehedinţi"},
            "Mures": {id: 306, nume: "Mureş"},
            "Neamt": {id: 307, nume: "Neamţ"},
            "Olt": {id: 308, nume: "Olt"},
            "Prahova": {id: 309, nume: "Prahova"},
            "Salaj": {id: 311, nume: "Sălaj"},
            "Satu-Mare": {id: 310, nume: "Satu-Mare"},
            "Sibiu": {id: 312, nume: "Sibiu"},
            "Suceava": {id: 313, nume: "Suceava"},
            "Teleorman": {id: 314, nume: "Teleorman"},
            "Timis": {id: 315, nume: "Timiş"},
            "Tulcea": {id: 316, nume: "Tulcea"},
            "Valcea": {id: 318, nume: "Vâlcea"},
            "Vaslui": {id: 317, nume: "Vaslui"},
            "Vrancea": {id: 319, nume: "Vrancea"}
        }
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
        let return_arrow = `url(&quot;data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' xml:space='preserve'%3E%3Cmetadata%3E Svg Vector Icons : http://www.onlinewebfonts.com/icon %3C/metadata%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cpath d='M564.4,929.5L138.9,503.9h279.3c5.6-42.1,13.8-164-61.7-257.7c-66.7-82.8-182.1-124.7-342.9-124.7L10,83.4c2.7-0.5,68.3-13,159.7-13c192.9,0,518,56.8,551.9,433.5H990L564.4,929.5z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)`
        Mailcheck.defaultDomains.push('gmail.hu', 'yahoo.ro');
        Mailcheck.defaultTopLevelDomains.push('ro');
        let ru_index = Mailcheck.defaultTopLevelDomains.indexOf('ru');
        if (ru_index >= 0) Mailcheck.defaultTopLevelDomains.splice(ru_index, 1);
        function config(type, url) {
            if (type == 'all' || type == 'magento') {
                let hostname = location.hostname;
                if (!location.hostname.includes('dedeman.ro'))  hostname = 'www.dedeman.ro';
                while (true) {
                    let api_key = prompt(`Magento 2 API Key - ${hostname}:`, GM_getValue(`api_key_${hostname}`));
                    if (api_key) {
                        GM_setValue(`api_key_${hostname}`, api_key);
                        break;
                    }
                }
            }
            if (type == 'all' || type == 'appliv') {
                var base_url = 'https://appliv.dedeman.ro/api/';
                var tip = ' - live:';
                if (url) base_url = url;
                if (!base_url.includes('https://appliv.dedeman.ro')) tip = ' - stage:';
                while (true) {
                    let appliv_api_key = prompt('AppLiv API Key'+tip, GM_getValue(`appliv_api_key_${base_url}`));
                    if (appliv_api_key) {
                        GM_setValue(`appliv_api_key_${base_url}`, appliv_api_key);
                        break;
                    }
                }
            }
            if (type == 'all' || type == 'bie1') {
                while (true) {
                    let bie1_api_key = prompt('Bie1 API Key:', GM_getValue('bie1_api_key'));
                    if (bie1_api_key) {
                        GM_setValue('bie1_api_key', bie1_api_key);
                        break;
                    }
                }
            }
            if (type == 'all' || type == 'sap') {
                while (true) {
                    let sap_api_key = prompt('SAP API Key:', GM_getValue('sap_api_key'));
                    if (sap_api_key) {
                        GM_setValue('sap_api_key', sap_api_key);
                        break;
                    }
                }
            }
            // if (type == 'all' || type == 'ing') {
            //     while (true) {
            //         let ing_username = prompt('ING Username:', GM_getValue('ing_username'));
            //         if (ing_username) {
            //             GM_setValue('ing_username', ing_username);
            //             break;
            //         }
            //     }
            //     while (true) {
            //         let ing_password = prompt('ING Password:', GM_getValue('ing_password'));
            //         if (ing_password) {
            //             GM_setValue('ing_password', ing_password);
            //             break;
            //         }
            //     }
            // }
            if (type == 'all' || type == 'gls') {
                while (true) {
                    let gls_username = prompt('GLS Username:', GM_getValue('gls_username'));
                    if (gls_username) {
                        GM_setValue('gls_username', gls_username);
                        break;
                    }
                }
                while (true) {
                    let gls_password = prompt('GLS Password:', GM_getValue('gls_password'));
                    if (gls_password) {
                        GM_setValue('gls_password', gls_password);
                        break;
                    }
                }
            }
            if (type == 'all' || type == 'cargus') {
                while (true) {
                    let cargus_username = prompt('Cargus Username:', GM_getValue('cargus_username'));
                    if (cargus_username) {
                        GM_setValue('cargus_username', cargus_username);
                        break;
                    }
                }
                while (true) {
                    let cargus_password = prompt('Cargus Password:', GM_getValue('cargus_password'));
                    if (cargus_password) {
                        GM_setValue('cargus_password', cargus_password);
                        break;
                    }
                }
                while (true) {
                    let cargus_subscription_key = prompt('Cargus Subscription key:', GM_getValue('cargus_subscription_key'));
                    if (cargus_subscription_key) {
                        GM_setValue('cargus_subscription_key', cargus_subscription_key);
                        break;
                    }
                }
            }
            if (type == 'all' || type == 'dpd') {
                while (true) {
                    let dpd_username = prompt('DPD Username:', GM_getValue('dpd_username'));
                    if (dpd_username) {
                        GM_setValue('dpd_username', dpd_username);
                        break;
                    }
                }
                while (true) {
                    let dpd_password = prompt('DPD Password:', GM_getValue('dpd_password'));
                    if (dpd_password) {
                        GM_setValue('dpd_password', dpd_password);
                        break;
                    }
                }
            }
            if (type == 'all' || type == 'fan') {
                while (true) {
                    let fan_username = prompt('FAN Username:', GM_getValue('fan_username'));
                    if (fan_username) {
                        GM_setValue('fan_username', fan_username);
                        break;
                    }
                }
                while (true) {
                    let fan_password = prompt('FAN Password:', GM_getValue('fan_password'));
                    if (fan_password) {
                        GM_setValue('fan_password', fan_password);
                        break;
                    }
                }
            }
            if (type == 'all' || type == 'phone') {
                while (true) {
                    let phone = prompt('Numarul tau de telefon:', GM_getValue('phone'));
                    if(/^07\d{8}$/.test(phone)) {
                        GM_setValue('phone', phone);
                        break;
                    } else {
                        alert("Numarul de telefon nu este valid!");
                    }
                }
            }
            if (type == 'all' || type == 'email') {
                while (true) {
                    let email = prompt('Adresa ta de e-mail:', GM_getValue('email'));
                    if(regex_email.test(email)) {
                        GM_setValue('email', email);
                        break;
                    } else {
                        alert("Adresa de e-mail nu este valida!");
                    }
                }
            }
        }
        GM_registerMenuCommand('Configurare script', function () {
            config('all');
        });
        function getCookie(name) {
            let cookie = {};
            document.cookie.split(';').forEach(function(el) {
                let [k,v] = el.split('=');
                cookie[k.trim()] = v;
            })
            return cookie[name];
        }
        function reset_awb_regex_index() {
            regExDPD.lastIndex = 0;
            regExFAN.lastIndex = 0;
            regExGLS.lastIndex = 0;
            regExCargus.lastIndex = 0;
        }
        function get_awbs() {
            let awbs = [];
            $('.note-list-comment').each(function() {
                var text = $(this).html();
                reset_awb_regex_index();
                if (/awb|dpd/gmi.test(text) && regExDPD.test(text)) awbs = awbs.concat(text.match(regExDPD));
                if (/awb|fan/gmi.test(text) && regExFAN.test(text)) awbs = awbs.concat(text.match(regExFAN));
                if (/awb|gls/gmi.test(text) && regExGLS.test(text)) awbs = awbs.concat(text.match(regExGLS));
                //if (/awb|cargus/gmi.test(text) && regExCargus.test(text)) awbs = awbs.concat(text.match(regExCargus));
            });
            awbs = [...new Set(awbs)]; //remove duplicates
            return awbs;
        }
        function get_shipping_type(text_livrare) {
            let tip_livrare = '';
            if (/flota/gmi.test(text_livrare)) tip_livrare = 'Flota Dedeman';
            else if (/programat/gmi.test(text_livrare)) tip_livrare = 'Livrare programata';
            else if (/voluminoase/gmi.test(text_livrare)) tip_livrare = 'Transport marfuri voluminoase';
            else if (/grele/gmi.test(text_livrare)) tip_livrare = 'Transport materiale grele';
            else if (/locker/gmi.test(text_livrare)) tip_livrare = 'Ridicare de la locker';
            else if (/rezervare|ridicare/gmi.test(text_livrare)) tip_livrare = 'Ridicare din magazin';
            else if (/fan/gmi.test(text_livrare)) tip_livrare = 'Curier - FAN';
            else if (/dpd/gmi.test(text_livrare)) tip_livrare = 'Curier - DPD';
            else if (/cargus/gmi.test(text_livrare)) tip_livrare = 'Curier - Cargus';
            else if (/gls/gmi.test(text_livrare)) tip_livrare = 'Curier - GLS';
            else if (/co?urier/gmi.test(text_livrare)) tip_livrare = 'Curier';
            return tip_livrare;
        }
        function copy_text(plain, rich) {
            try {
                //varianta noua
                // var rich_text = '<!--my html-->'+rich;
                // var clipboardItem = new ClipboardItem({
                //     "text/plain": new Blob([plain], {type: "text/plain"}),
                //     "text/html": new Blob([rich_text], {type: "text/html"})
                // });
                // navigator.clipboard.write([clipboardItem]).then(() => {},
                //                                                 () => {//not ok
                //     //alert('Nu se poate seta continutul in clipboard!\nVerifica permisiunile din browser!');
                //     GM_setClipboard(rich_text, 'html');
                // });
                //varianta veche
                function listener(e) {
                    e.clipboardData.setData("text/html", `<!--my html-->${rich}`);
                    e.clipboardData.setData("text/plain", plain);
                    e.preventDefault();
                }
                document.addEventListener("copy", listener);
                document.execCommand("copy");
                document.removeEventListener("copy", listener);
            }
            catch (e) {
                if (e.message.includes('ClipboardItem is not defined') && /firefox|fxios/gi.test(navigator.userAgent)) {
                    alert('Pentru a putea seta continutul in clipboard trebuie sa accesezi "about:config" si sa setezi "dom.events.asyncClipboard.clipboardItem" pe true!');
                }
                else alert('A aparut o eroare la setarea continutului in clipboard!');
            }
        }
        function create_transaction_details_table(data) {
            const fields = [
                ["Nr. tranzactie:", "orderNumber"],
                ["Data tranzactie:", "orderDate"],
                ["Suma:", "amount"],
                ["Descriere:", "description"],
                ["ID tranzactie:", "transactionId"],
                ["Stare tranzactie:", "status"]
            ];
            const rows = fields.map(([label, key]) => {
                const value = data[key];
                if (!value) return "";
                const labelStyle = "display:inline-block;width:120px;font-weight:bold;vertical-align:top;";
                let valueStyle = key === "description" ? "display:inline-block;max-width:calc(100% - 130px);vertical-align:top;word-break:break-word;" : "";
                if (key === "amount" || key === "status") valueStyle += "color:blue;";
                return `<div><span style="${labelStyle}">${label}</span><span style="${valueStyle}">${value}</span></div>`;
            });
            let procesator = '';
            if (data.procesator) procesator = ` class="${data.procesator}"`;
            return `<div${procesator}>${rows.join("")}</div>`;
        }
        function create_sent_link_text(data) {
            return `<div>Am trimis link de plata in ${data.procesator} (valabil ${data.days})${data.rate}</div><div>Descrierea comenzii: ${data.description}</div><div>Suma de plata: ${data.amount} RON</div><div>Cand avem confirmarea tranzactiei, editez comanda.</div>`;
        }
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
        function btrl_request(params) {
            console.log(params);
            let start = new Date();
            return new Promise(function(resolve, reject) {
                let data = '';
                if (params.future) data = `future=${params.future}`;
                else if (params.orderNumber) data = `page=1&start=0&limit=400&fromDate=${params.fromDate}%2000%3A00%3A00%2B0300&toDate=${params.toDate}%2000%3A00%3A00%2B0300&dateMode=CREATION_DATE&orderNum=${params.orderNumber}&orderStateStr=&paymentWayStr=&terminalId=&mdOrder=&referenceNumber=&approvalCode=&actionCode=&pan=&cardholderName=&ip=&textfield-1216-inputEl=&bankName=&notLikeBankName=false&textfield-1226-inputEl=&bankCountryName=&notLikeBankCountry=false&textfield-1236-inputEl=&payerCountryName=&notLikePayerCountry=false&minAmount=0.00&maxAmount=0.00&merchantsStr=&login=login&textfield-1248-inputEl=&submerchantsStr=&sublogin=login&textfield-1257-inputEl=&merchantUrl=&customerEmail=&customerPhone=&columnOrder=orderNumber&columnOrder=transDate&columnOrder=ip&columnOrder=depositFlag&columnOrder=mdOrder&columnOrder=paymentState&columnOrder=merchantFullName&columnOrder=submerchantLogin&columnOrder=orderDescription&columnOrder=paymentDate&columnOrder=amount&columnOrder=currency&columnOrder=approvedAmount&columnOrder=depositedAmount&columnOrder=refundedAmount&columnOrder=fraudWeight&columnOrder=paymentWay&columnOrder=cardholderName&columnOrder=pan&columnOrder=expiry&columnOrder=paymentSystem&columnOrder=product&columnOrder=bankName&columnOrder=panCountryCode&columnOrder=ipCountryCode&columnOrder=customerEmail&columnOrder=customerPhone&columnOrder=actionCode&columnOrder=approvalCode&columnOrder=authCode&columnOrder=referenceNumber&columnOrder=terminalId&columnOrder=processingId&columnOrder=transactionDesc&columnOrder=eci&columnOrder=installment&columnOrder=recurrentId&columnOrder=orderParamsAsString&timeZone=Europe%2FBucharest`
                console.log(data);
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: location.origin + '/console/mvc/transaction',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    data: data,
                    onload: function(xhr) {
                        log_request_time(start, new Date(), 'btrl_request');
                        console.log(xhr);
                        if (xhr.status == 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                console.log(response);
                                resolve(response);
                            }
                            catch(e) {
                                reject(e);
                            }
                        }
                        else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                    },
                    onerror: function(err) {
                        reject(err);
                    },
                    timeout: 60000,
                    ontimeout: function(e) {
                        reject('Timeout BTRL!');
                    }
                });
            });
        }
        function mobilpay_request(params) {
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: params.method,
                    url: 'https://admin.netopia-payments.com/'+params.api_url,
                    headers: {"Content-Type": "application/json"},
                    ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                    onload: function(xhr) {
                        console.log(xhr);
                        if (xhr.status == 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                console.log(response);
                                resolve(response);
                            }
                            catch(e) {
                                reject(e);
                            }
                        }
                        else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                    },
                    onerror: function(err) {
                        reject(err);
                    },
                    timeout: 60000,
                    ontimeout: function(e) {
                        reject('Timeout API!');
                    }
                });
            });
        }
        function gls_request(params) {
            let start = new Date();
            return new Promise(function(resolve, reject) {
                if (!GM_getValue('gls_username') || !GM_getValue('gls_password')) config('gls');
                var data = {Username: GM_getValue('gls_username'), Password: JSON.parse(GM_getValue('gls_password')), ...params.data};
                console.log(data);
                GM_xmlhttpRequest({
                    method: params.method,
                    url: 'https://api.mygls.ro/ParcelService.svc/json/'+params.api_url,
                    headers: {"Content-Type": "application/json"},
                    data: JSON.stringify(data),
                    onload: function(xhr) {
                        log_request_time(start, new Date(), 'gls_request');
                        console.log(xhr);
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
                    onerror: function(err) {
                        reject(err);
                    },
                    timeout: 60000,
                    ontimeout: function(e) {
                        reject('Timeout GLS!');
                    }
                });
            });
        }
        function dpd_request(params) {
            let start = new Date();
            return new Promise(function(resolve, reject) {
                if (!GM_getValue('dpd_username') || !GM_getValue('dpd_password')) config('dpd');
                var headers = {};
                var get_params = '';
                if (params.method === 'GET') get_params = `?user_name=${GM_getValue('dpd_username')}&password=${GM_getValue('dpd_password')}` + (params.get_params || '');
                else {
                    params.data = {userName: GM_getValue('dpd_username'), password: GM_getValue('dpd_password'), ...params.data};
                    headers = {"Content-Type": "application/json"};
                }
                var response_Type = '';
                if (params.api_url.includes('print')) response_Type = 'blob';
                GM_xmlhttpRequest({
                    method: params.method,
                    url: 'https://api.dpd.ro/v1/'+params.api_url+get_params,
                    headers: headers,
                    responseType: response_Type,
                    ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                    onload: function(xhr) {
                        log_request_time(start, new Date(), 'dpd_request');
                        console.log(xhr);
                        if (xhr.status == 200) {
                            if (response_Type == 'blob') resolve(xhr.response);
                            else {
                                try {
                                    var response = JSON.parse(xhr.responseText);
                                    resolve(response);
                                }
                                catch(e) {
                                    reject(e);
                                }
                            }
                        }
                        else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                    },
                    onerror: function(err) {
                        reject(err);
                    },
                    timeout: 60000,
                    ontimeout: function(e) {
                        reject('Timeout DPD!');
                    }
                });
            });
        }
        function cargus_login() {
            return new Promise(function(resolve, reject) {
                if (new Date().toLocaleDateString('ro') !== GM_getValue('cargus_token_last_refresh') || !GM_getValue('cargus_token')) {//login request
                    if (!GM_getValue('cargus_username') || !GM_getValue('cargus_password') || !GM_getValue('cargus_subscription_key')) config('cargus');
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://urgentcargus.azure-api.net/api/LoginUser`,
                        headers: {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": GM_getValue('cargus_subscription_key')},
                        data: JSON.stringify({UserName: GM_getValue('cargus_username'), Password: GM_getValue('cargus_password')}),
                        onload: function(xhr) {
                            if (xhr.status == 200) {
                                try {
                                    var response = JSON.parse(xhr.responseText);
                                    GM_setValue('cargus_token_last_refresh', new Date().toLocaleDateString('ro'));
                                    GM_setValue('cargus_token', response);
                                    resolve('ok');
                                }
                                catch(e) {
                                    reject(e);
                                }
                            }
                            else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                        },
                        onerror: function(err) {
                            reject(err);
                        },
                        timeout: 10000,
                        ontimeout: function(e) {
                            reject('Timeout Cargus!');
                        }
                    });
                }
                else resolve('ok'); //no login required
            });
        }
        function cargus_request(params) {
            let start = new Date();
            return new Promise(function(resolve, reject) {
                cargus_login().then(function() {
                    var wait = 1000;
                    var no_of_retries = 30;
                    var request_number = 0;
                    function request() {
                        GM_xmlhttpRequest({
                            method: params.method,
                            url: 'https://urgentcargus.azure-api.net/api/'+params.api_url,
                            headers: {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": GM_getValue('cargus_subscription_key'), "Authorization": "Bearer " + GM_getValue('cargus_token')},
                            ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                            onload: function(xhr) {
                                log_request_time(start, new Date(), 'cargus_request');
                                console.log(xhr);
                                if (xhr.status == 200) {
                                    try {
                                        var response = JSON.parse(xhr.responseText);
                                        console.log(response);
                                        resolve(response);
                                    }
                                    catch(e) {
                                        reject(e);
                                    }
                                }
                                else if (xhr.status == 429) { //Too Many Requests
                                    request_number++;
                                    console.log('request number ' + request_number);
                                    if (request_number <= no_of_retries) {
                                        console.log(`Wait ${wait} ms and retry`);
                                        setTimeout(function() { request(); }, wait);
                                    }
                                    else {
                                        console.log('Max requests number reached, reject!');
                                        reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                                    }
                                }
                                else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                            },
                            onerror: function(err) {
                                reject(err);
                            },
                            timeout: 60000,
                            ontimeout: function(e) {
                                reject('Timeout Cargus!');
                            }
                        });
                    }
                    request();
                }).catch(function(e) {
                    reject(e);
                });
            });
        }
        function fan_login() {
            return new Promise(function(resolve, reject) {
                if (new Date().toLocaleDateString('ro') !== GM_getValue('fan_token_last_refresh') || !GM_getValue('fan_token')) {//login request
                    if (!GM_getValue('fan_username') || !GM_getValue('fan_password')) config('fan');
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://api.fancourier.ro/login`,
                        headers: {"Content-Type": "application/json"},
                        data: JSON.stringify({username: GM_getValue('fan_username'), password: GM_getValue('fan_password')}),
                        onload: function(xhr) {
                            if (xhr.status == 200) {
                                try {
                                    var response = JSON.parse(xhr.responseText);
                                    GM_setValue('fan_token_last_refresh', new Date().toLocaleDateString('ro'));
                                    GM_setValue('fan_token', response.data.token);
                                    resolve('ok');
                                }
                                catch(e) {
                                    reject(e);
                                }
                            }
                            else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                        },
                        onerror: function(err) {
                            reject(err);
                        },
                        timeout: 60000,
                        ontimeout: function(e) {
                            reject('Timeout FAN!');
                        }
                    });
                }
                else resolve('ok'); //no login required
            });
        }
        function fan_request(params) {
            let start = new Date();
            return new Promise(function(resolve, reject) {
                var retry_login = 0;
                function make_request() {
                    fan_login().then(function() {
                        GM_xmlhttpRequest({
                            method: params.method,
                            url: 'https://api.fancourier.ro/'+params.api_url,
                            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + GM_getValue('fan_token')},
                            ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                            onload: function(xhr) {
                                log_request_time(start, new Date(), 'fan_request');
                                if (xhr.status == 200) {
                                    try {
                                        var response = JSON.parse(xhr.responseText);
                                        console.log(response);
                                        resolve(response);
                                    }
                                    catch(e) {
                                        reject(e);
                                    }
                                }
                                else if (xhr.status = 401 && retry_login <= 5) {
                                    GM_deleteValue('fan_token_last_refresh');
                                    retry_login++;
                                    make_request();
                                }
                                else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                            },
                            onerror: function(err) {
                                reject(err);
                            },
                            timeout: 60000,
                            ontimeout: function(e) {
                                reject('Timeout FAN!');
                            }
                        });
                    }).catch(function(e) {
                        reject(e);
                    });
                }
                make_request();
            });
        }
        function get_available_installments(bank, ammount) {
            var installments = JSON.parse(GM_getValue('installments') || '{}');
            var available_installments = [];
            if (installments[bank]) {
                $.each(installments[bank], function(i,value) {
                    if (ammount >= Number(value.lower_limit) && ammount < Number(value.upper_limit)) {
                        available_installments = value.installments.split(',');
                        return false;
                    }
                });
                return available_installments;
            }
            else return available_installments;
        }
        function sap_request(params) {
            let start = new Date();
            console.log(params);
            return new Promise(function(resolve, reject) {
                if (!GM_getValue(`sap_api_key`)) config('sap');
                let rnd = (params.url.includes('?') ? '&' : '?') + 'rnd='+new Date().getTime();
                GM_xmlhttpRequest({
                    method: params.method,
                    url: 'https://dev-ecom.dedeman.ro/sappo/RESTAdapter/'+params.url+rnd,
                    headers: {"Authorization": "Basic "+GM_getValue(`sap_api_key`)},
                    ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                    onload: function(xhr) {
                        console.log(xhr);
                        log_request_time(start, new Date(), 'sap_request');
                        if (xhr.status == 200) {
                            try {
                                let response;
                                if (params.response_type === 'xml') response = $.parseXML(xhr.responseText);
                                else response = JSON.parse(xhr.responseText);
                                console.log(response);
                                resolve(response);
                            }
                            catch(e) {
                                reject(e);
                            }
                        }
                        else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                    },
                    onerror: function(err) {
                        reject(err);
                    },
                    timeout: 60000,
                    ontimeout: function(e) {
                        reject('Timeout api SAP!');
                    }
                });
            });
        }
        function bie_request(params) {
            let start = new Date();
            console.log(params);
            return new Promise(function(resolve, reject) {
                if (params.url.includes('op-manager') && !GM_getValue(`bie1_op_api_key`)) config_op('token');
                else if (!params.url.includes('op-manager') && !GM_getValue(`bie1_api_key`)) config('bie1');
                var api_key = GM_getValue(`bie1_api_key`);
                if (params.url.includes('op-manager')) api_key = GM_getValue(`bie1_op_api_key`);
                GM_xmlhttpRequest({
                    method: params.method,
                    url: 'https://bie.dedeman.ro/reports/api'+params.url,
                    headers: {"Authorization": "Bearer "+api_key},
                    ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                    onload: function(xhr) {
                        log_request_time(start, new Date(), 'bie1_request');
                        if (xhr.status == 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                console.log(response);
                                resolve(response);
                            }
                            catch(e) {
                                reject(e);
                            }
                        }
                        else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                    },
                    onerror: function(err) {
                        reject(err);
                    },
                    timeout: 60000,
                    ontimeout: function(e) {
                        reject('Timeout bie!');
                    }
                });
            });
        }
        function bie2_session_request(params) {
            let start = new Date();
            console.log(params);
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: params.method,
                    url: 'https://bie2.dedeman.ro/api/'+params.url,
                    headers: {"Authorization": "Bearer "+getCookie('live_auth_token')},
                    ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                    onload: function(xhr) {
                        log_request_time(start, new Date(), 'bie2_request');
                        if (xhr.status == 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                console.log(response);
                                resolve(response);
                            }
                            catch(e) {
                                reject(e);
                            }
                        }
                        else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                    },
                    onerror: function(err) {
                        reject(err);
                    },
                    timeout: 60000,
                    ontimeout: function(e) {
                        reject('Timeout bie2!');
                    }
                });
            });
        }
        function log_request_time(start, end, request) {
            let time = end-start;
            if (time > 1000) console.log((time/1000).toFixed(2) + ' s - ' + request);
            else console.log(time + ' ms - ' + request);
        }
        function xapi_request(params) {
            let start = new Date();
            return new Promise(function(resolve, reject) {
                var url = `${location.origin}/xapi/order/soap?${params.params}&rnd=${new Date().getTime()}`;
                GM_xmlhttpRequest({
                    method: params.method,
                    url: url,
                    headers: {
                        "Accept": "application/xml",
                        "Content-Type": "application/xml",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    onload: function(xhr) {
                        console.log(xhr);
                        log_request_time(start, new Date(), 'xapi_request');
                        if (xhr.status == 200) resolve(xhr.responseText);
                        else reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                    },
                    onerror: function(e) {
                        reject(e);
                    },
                    timeout: 30000,
                    ontimeout: function() {
                        reject('Timeout!');
                    }
                });
            });
        }
        function magento_mui_request(params) {
            let start = new Date();
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
                        console.log(xhr);
                        log_request_time(start, new Date(), 'magento_mui_request');
                        if (xhr.status == 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                console.log(response);
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
                    }
                });
            });
        }
        function magento_request(params) {
            let start = new Date();
            return new Promise(function(resolve, reject) {
                var hostname = params.hostname || location.hostname;
                var origin = params.origin || location.origin;
                if (!GM_getValue(`api_key_${hostname}`)) config('magento');
                var url = origin+params.api_url;
                if (!url.includes('?')) url += '?';
                var search = '';
                if (params.search_field) search = `searchCriteria[filter_groups][0][filters][0][field]=${params.search_field}&searchCriteria[filter_groups][0][filters][0][value]=${params.search_values.join(',')}&searchCriteria[filter_groups][0][filters][0][condition_type]=${params.condition_type}`;
                var return_fields = '';
                if (params.return_fields && search) return_fields = `&fields=items[${params.return_fields}]`;
                else if (params.return_fields) return_fields = `&fields=${params.return_fields}`;
                var sort_field = '';
                if (params.sort_field) sort_field = `&searchCriteria[sortOrders][0][field]=${params.sort_field}`;
                var sort_direction = '';
                if (params.sort_direction) sort_direction = `&searchCriteria[sortOrders][0][direction]=${params.sort_direction}`;
                url += search+return_fields+sort_field+sort_direction+'&rnd='+new Date().getTime();
                GM_xmlhttpRequest({
                    method: params.method || 'GET',
                    url: url,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+ GM_getValue(`api_key_${hostname}`) || ''
                    },
                    ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                    onload: function(xhr) {
                        log_request_time(start, new Date(), 'magento_request');
                        if (xhr.status == 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                console.log(response);
                                resolve(response);
                            }
                            catch(e) {
                                console.log(xhr);
                                reject(e);
                            }
                        }
                        else {
                            console.log(xhr);
                            try {
                                var response = JSON.parse(xhr.responseText);
                                if (response.message) reject('Status '+xhr.status+' | ' + response.message);
                                else reject('Status '+xhr.status);
                            }
                            catch(e) {
                                reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                            }
                        }
                    },
                    onerror: function(e) {
                        reject(e);
                    }
                });
            });
        }
        function appliv_request(params) {
            console.log(params);
            let start = new Date();
            return new Promise(function(resolve, reject) {
                var base_url = 'https://appliv-stage.dedeman.ro/api/';
                if (location.hostname == 'www.dedeman.ro' || location.hostname == 'bie2.dedeman.ro') base_url = 'https://appliv.dedeman.ro/api/';
                if (!GM_getValue(`appliv_api_key_${base_url}`)) config('appliv', base_url);
                var response_Type = '';
                if (params.url.includes('awb_print')) response_Type = 'blob';
                GM_xmlhttpRequest({
                    method: params.method,
                    url: base_url + params.url,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "x-api-key": GM_getValue(`appliv_api_key_${base_url}`) || ''
                    },
                    responseType: response_Type,
                    ...(params.data ? {data: JSON.stringify(params.data)} : {}),
                    onload: function(xhr) {
                        log_request_time(start, new Date(), 'appliv_request');
                        console.log(xhr);
                        if (xhr.status == 200) {
                            if (response_Type == 'blob') resolve(xhr.response);
                            else if (params.method == 'DELETE') resolve();
                            else {
                                try {
                                    var response = JSON.parse(xhr.responseText);
                                    resolve(response);
                                }
                                catch(e) {
                                    reject(e);
                                }
                            }
                        }
                        else {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                if (response.detail) reject('Status '+xhr.status+' | ' + response.detail);
                                else if (response.message) reject('Status '+xhr.status+' | ' + response.message);
                                else if (response.error) reject('Status '+xhr.status+' | ' + response.error);
                                else reject('Status '+xhr.status);
                            }
                            catch(e) {
                                reject('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                            }
                        }
                    },
                    onerror: function(e) {
                        reject(e);
                    },
                    timeout: 60000,
                    ontimeout: function() {
                        reject('Timeout AppLiv!');
                    }
                });
            });
        }
        function search_open_magento_order(nrOL, active, obj) {
            // obj.animate({opacity: 0}, 200, function() {$(this).css('visibility', 'hidden');});
            // magento_request({api_url:'/rest/V1/orders', search_field: 'increment_id', search_values:[nrOL], condition_type: 'eq', return_fields: 'entity_id,increment_id', origin: 'https://www.dedeman.ro', hostname: 'www.dedeman.ro'}).then(function(response) {
            //     obj.css('visibility', 'visible').animate({opacity: 1}, 200);
            //     if (response.items) GM_openInTab(`https://www.dedeman.ro/admin/sales/order/view/order_id/${response.items[0].entity_id}/`,{active: active, insert: false});
            //     else alert('Nu am gasit id-ul comenzii!');
            // }).catch(function(e) {
            //     obj.css('visibility', 'visible').animate({opacity: 1}, 200);
            //     alert(e);
            // });
            obj.fadeOut().fadeIn();
            let magento_base_url = 'https://www.dedeman.ro';
            if (location.hostname.includes('sandbox')) magento_base_url = 'https://staging.dedeman.ro';
            GM_openInTab(`${magento_base_url}/admin/sales/order/view/increment_id/${nrOL}/`,{active: active, insert: false});
        }
        function get_um(um_details, um, qty) {
            if (um_details[um]) return ((qty === 1) ? um_details[um].singular || um : um_details[um].plural || um);
            else return um;
        }
        function link_comanda(element) {
            var data = element.html();
            var ols = data.match(regExOLMatch);
            ols = [...new Set(ols)]; //remove duplicates
            $.each(ols, function(i, ol) {
                data = data.replace(new RegExp(ol, 'gm'),`<span class="link_ol" data-ol="${ol}">${ol}</span>`);
            });
            element.html(data);
        }
        function links_status(linkuri) {
            bie_request({url:'/payment-links/list', method: 'POST', data: Object.keys(linkuri)}).then(function(response) {
                var linkuri_ok = response.body || [];
                let hint_position = 'hint--top';
                if (location.hostname.includes('dedeman') && Object.values(linkuri)[0].elem.closest('td').is('td:last-of-type')) hint_position = 'hint--top-left';
                for (const [link, details] of Object.entries(linkuri)) {
                    var tooltip_title = '';
                    var obj = details.elem;
                    if (details.approved) {
                        var ok = 0;
                        for (var i = 0; i < linkuri_ok.length; i++) {
                            if (link == linkuri_ok[i].link) {
                                //link found
                                ok = 1;
                                obj.addClass('succes');
                                tooltip_title = 'Rezolvat de '+linkuri_ok[i].user+'!\nMarchează ca nerezolvat!';
                                break;
                            }
                        }
                        if (!ok) {
                            obj.addClass('danger');
                            tooltip_title = 'Marchează ca rezolvat!';
                        }
                        obj.find('.toggle-status-wrapper').remove();
                        obj.append(`<div class="toggle-status-wrapper"><div class="toggle-status ${hint_position} hint--rounded" data-link="${link}" aria-label="${tooltip_title}"></div></div>`);
                    }
                    else {
                        obj.find('.toggle-status-wrapper').remove();
                        obj.addClass('info').append(`<div class="toggle-status-wrapper"></div>`);
                    }
                }
                if (location.hostname.includes('mobilpay')) $('.info, .danger, .succes').eq(0).find('.toggle-status').removeClass('hint--top').addClass('hint--bottom');
            }).catch(function(e) { console.log(e); });
        }
        function toggle_link_status() {
            //--- toggle status eo
            $(document).on('click', '.toggle-status',function() {
                let link = $(this).data('link');
                let element = $(this);
                let parent_elem = $(this).closest('.danger, .succes');
                element.hide();
                if (parent_elem.attr('class').includes('succes')) {
                    console.log('remove from db ' + link);
                    bie_request({url:'/payment-links/'+link, method: 'DELETE'}).then(function(response) {
                        if (response.code == 200) {
                            if (response.error) alert('A fost marcat deja ca nerezolvat!');
                            parent_elem.removeClass('succes').addClass('danger');
                            element.attr('aria-label', 'Marchează ca rezolvat!');
                        }
                        else alert(response.error);
                        element.show();
                    }).catch(function(e) {
                        element.show();
                        alert(e);
                    });
                }
                else {
                    console.log('write to db ' + link);
                    if (!GM_getValue('email')) config('email');
                    let user = GM_getValue('email') || '';
                    bie_request({url:'/payment-links', method: 'POST', data: {link: link, user: user}}).then(function(response) {
                        if (response.code == 200) {
                            parent_elem.removeClass('danger').addClass('succes');
                            let title = `Rezolvat de ${user}!\nMarchează ca nerezolvat!`;
                            if (response.error) {
                                alert('A fost marcat deja ca rezolvat de '+response.error+'!');
                                title = 'Rezolvat de '+response.error+'!\nMarchează ca nerezolvat!';
                            }
                            element.attr('aria-label', title);
                        }
                        else alert(response.error);
                        element.show();
                    }).catch(function(e) {
                        element.show();
                        alert(e);
                    });
                }
            });
        }
        function write_transaction_return(link) {
            if (!GM_getValue('email')) config('email');
            let increment = 0;
            let stop = 10;
            make_request();
            function make_request() {
                let new_link = link + ':' + increment;
                console.log(new_link);
                bie_request({url:'/payment-links', method: 'POST', data: {link: new_link, user: GM_getValue('email')}}).then(function(response) {
                    if (response.code == 200) {
                        if (response.error) {
                            console.log('exist, retry with another increment');
                            increment++;
                            if (increment < stop) make_request();
                        }
                        else console.log('return transaction write = success');
                    }
                    else alert('Nu am putut salva utilizatorul care a efectuat returnarea!\n' + response.error);
                }).catch(function(e) {
                    alert('Nu am putut salva utilizatorul care a efectuat returnarea!\n' + e);
                });
            }
        }
        GM_addStyle(`
    .suggestion {
        background: #ff00003b;
        margin-top: 6px;
        border-radius: 4px;
        line-height: 1.36;
        padding: 6px 30px 6px 10px;
        display: none;
        position: relative;
    }
    .suggestion > a {
        white-space: nowrap;
        color: #007bdb;
        cursor: pointer;
    }
    .suggestion > a:hover {
        color: #007bdb;
        text-decoration: underline;
    }
    .suggestion div.closeIcon {
        height: 16px;
        width: 16px;
        position: absolute;
        top: 8px;
        right: 6px;
        cursor: pointer;
        opacity: .6;
        text-align: center;
        font-size: 27px!important;
        line-height: 14px!important;
        z-index: 1;
        overflow: hidden;
    }
    .suggestion div.closeIcon:hover {
        opacity: 1;
    }
    `);
        $(document).on('click', '.suggestion .closeIcon', function() {
            $(this).closest('.suggestion').slideUp();
        });
        $(document).on('click', '.suggestion a', function() {
            var elem_id = $(this).data('input_id');
            $(elem_id).val($(this).data('value'));
            $(this).closest('.suggestion').slideUp();
        });
        $(document).on('click auxclick', '.link_ol', function(e) {
            if (e.button < 2) {
                var nrOL = $(this).text();
                search_open_magento_order(nrOL, !e.button, $(this));
            }
        });
        function config_op(type) {
            if (type == 'all' || type == 'token') {
                while (true) {
                    let bie1_op_api_key = prompt('OP API Key:', GM_getValue('bie1_op_api_key'));
                    if (bie1_op_api_key) {
                        GM_setValue('bie1_op_api_key', bie1_op_api_key);
                        break;
                    }
                }
            }
            if (type == 'all' || type == 'email') {
                while (true) {
                    let email = prompt('Trimite e-mailul de returnare OP către:\n* Valorile multiple trebuie separate prin ";"', GM_getValue('email_return_op'));
                    if (regex_multiple_emails.test(email) && email.length) {
                        GM_setValue('email_return_op', email);
                        break;
                    } else alert("Adresa de e-mail nu este valida!");
                }
                while (true) {
                    let cc_email = prompt('Trimite o copie a e-mailului de returnare OP către:\n* Valorile multiple trebuie separate prin ";"\n* Câmpul este opțional', GM_getValue('cc_email_return_op'));
                    if (regex_multiple_emails.test(cc_email)) {
                        GM_setValue('cc_email_return_op', cc_email);
                        break;
                    } else alert("Adresa de e-mail nu este valida!");
                }
            }
        }
        if (window.location.href.includes('dedeman.ro/admin')) {
            $(document).on('mouseup', 'input[type=number]', function(e) {e.stopPropagation();}); //chrome step loop fix
            function awb_last_status(params) {
                return new Promise((resolve) => {
                    var statuses = {};
                    var start = 0;
                    if (params.curier == 'DPD') {
                        get_dpd_status();
                        function get_dpd_status() {
                            const chunk = params.awbs.slice(start, start + params.page_size);
                            var parcels = [];
                            for (const val of chunk) parcels.push({"id": val});
                            dpd_request({api_url:'track', method: 'POST', data: {lastOperationOnly:true, parcels: parcels}}).then(function(response) {
                                if (response.parcels) {
                                    $.each(response.parcels, function(i, value) {
                                        let last_status = value.operations[0];
                                        let status_text = get_dpd_status_text(last_status);
                                        statuses[value.parcelId] = status_text;
                                    });
                                }
                                start = start + params.page_size;
                                if (start <= params.awbs.length) get_dpd_status();
                                else resolve(statuses);
                            }).catch(function(e) {
                                console.log(e);
                                start = start + params.page_size;
                                if (start <= params.awbs.length) get_dpd_status();
                                else resolve(statuses);
                            });
                        }
                    }
                    else if (params.curier == 'FAN') {
                        get_fan_status();
                        function get_fan_status() {
                            const chunk = params.awbs.slice(start, start + params.page_size);
                            fan_request({api_url:'reports/awb/tracking?clientId=227407&language=ro&awb[]='+chunk.join('&awb[]='), method: 'GET'}).then(function(response) {
                                if (response.data) {
                                    $.each(Object.values(response.data), function(i, value) {
                                        if (value.awbNumber) {
                                            let status_text = get_fan_last_status_text(value);
                                            statuses[value.awbNumber] = status_text;
                                        }
                                    });
                                }
                                start = start + params.page_size;
                                if (start <= params.awbs.length) get_fan_status();
                                else resolve(statuses);
                            }).catch(function(e) {
                                console.log(e);
                                start = start + params.page_size;
                                if (start <= params.awbs.length) get_fan_status();
                                else resolve(statuses);
                            });
                        }
                    }
                });
            }
            function get_dpd_status_text(status) {
                let time = new Date(status.dateTime);
                let place = "";
                let description = "";
                let awb_retur = "";
                let awb_redirectionare = "";
                place = ((status.place) ? ' ' + status.place : '');
                description = status.description;
                if (status.operationCode == 115) { //redirectionat
                    awb_redirectionare = ((status.redirectShipmentId) ? status.redirectShipmentId : '');
                }
                else if (status.operationCode == 124) { //retur livrat la expeditor
                    awb_retur = ((status.returnShipmentId) ? status.returnShipmentId : '');
                    if (awb_retur) description = `Retur livrat la expeditor cu awb <a href="https://tracking.dpd.ro/?shipmentNumber=${awb_retur}" target="_blank">${awb_retur}</a>`;
                    else description = "Retur livrat la expeditor";
                }
                else if (status.operationCode == 111) { //retur catre expeditor
                    awb_retur = ((status.returnShipmentId) ? status.returnShipmentId : '');
                    if (awb_retur) description = `Retur catre expeditor cu awb <a href="https://tracking.dpd.ro/?shipmentNumber=${awb_retur}" target="_blank">${awb_retur}</a>`;
                    else description = "Retur catre expeditor";
                }
                var destinatar = ((status.consignee) ? ' Destinatar: ' + status.consignee : '');
                var comment = '';
                var operation_codes = [148, 111, 134, 124];
                if (operation_codes.indexOf(status.operationCode) == -1) comment = ((status.comment) ? '<br>' + status.comment : '');
                return time.toLocaleString('ro-RO') + ' ' + description + destinatar + place + comment;
            }
            function get_fan_last_status_text(awb) {
                if (awb.message) return 'AWB-ul a fost inregistrat de catre clientul expeditor.';
                else {
                    let last_status = awb.events.slice(-1)[0];
                    let time = new Date(last_status.date);
                    let place = ((last_status.location) ? ' | ' + last_status.location : '');
                    let description = last_status.name || '';
                    let awb_retur = awb.returnAwbNumber || 0;
                    let text_awb_retur = '';
                    if (awb_retur) text_awb_retur = ` | AWB retur: <a href="https://www.fancourier.ro/awb.php?xawb=${awb_retur}" target="_blank">${awb_retur}</a>`;
                    let awb_redirectionare = awb.redirectionAwbNumber || 0;
                    let text_awb_redirectionare = '';
                    if (awb_redirectionare) text_awb_redirectionare = ` | AWB redirectionare: <a href="https://www.fancourier.ro/awb.php?xawb=${awb_redirectionare}" target="_blank">${awb_redirectionare}</a>`;
                    let confirmation = ((awb.confirmation.name) ? ' | Confirmare: ' + awb.confirmation.name : '');
                    return time.toLocaleString('ro-RO') + ' ' + description + ' ' + place + confirmation + text_awb_retur + text_awb_redirectionare;
                }
            }
            function get_cargus_last_status_text(awb) {
                let last_status = awb.Event.slice(-1)[0];
                let time = new Date(last_status.Date);
                let place = ((last_status.LocalityName) ? ' | ' + last_status.LocalityName : '');
                let description = last_status.Description || '';
                let awb_retur = awb.ResponseCode || 0;
                let text_awb_retur = '';
                if (awb_retur) text_awb_retur = ` | AWB retur/redirectionare: <a href="https://www.cargus.ro/personal/urmareste-coletul/?tracking_number=${awb_retur}" target="_blank">${awb_retur}</a>`;
                let confirmation = ((awb.ConfirmationName) ? ' | Confirmare: ' + awb.ConfirmationName : '');
                return time.toLocaleString('ro-RO') + ' ' + description + ' ' + place + confirmation + text_awb_retur;
            }
            function get_gls_last_status_text(awb_details) {
                let awb = awb_details[0];
                let retur = awb_details.find(x => x.StatusCode === '23');
                let livrat_retur = '';
                if (awb.StatusCode == '05' && retur) livrat_retur = 'Retur - ';
                let time = awb.StatusDate.replace(/\/Date\(|\)\//g,'');
                let ms = Number(time.slice(0,13));
                let offset = time.slice(-5);
                time = new Date(ms).toLocaleString('ro', { timeZone: offset });
                let place = ((awb.DepotCity) ? ' | ' + awb.DepotCity : '');
                let description = ((awb.StatusDescription) ? (livrat_retur + awb.StatusDescription) : '');
                let status_info = ((awb.StatusInfo) ? ' | ' + awb.StatusInfo : '');
                return time + ' ' + description + ' ' + place + status_info;
            }
            waitForElm('.admin-user-account-text').then((elm) => {
                if (op_users.includes(elm.text())) {
                    $('li[data-ui-id=menu-magento-sales-sales-operation] > .submenu > ul').append('<li class="level-2"><a href="/admin/sales/creditmemo/?script=op"><span>OP-uri comenzi</span></a></li>');
                    GM_registerMenuCommand('Configurare pentru OP-uri', function () {
                        config_op('all');
                    });
                }
                $('li[data-ui-id=menu-magento-sales-sales-operation] > .submenu > ul').append('<li class="level-2"><a href="/admin/sales/creditmemo/?script=comenzi-curier"><span>Comenzi curier</span></a></li>');
            });
            window.addEventListener('load', function() {
                var favicon = document.querySelector('link[rel="icon"]');
                var color = '007bdb';
                if (location.hostname === 'www.dedeman.ro') color = 'fa0f00';
                else if (location.hostname === 'staging2.dedeman.ro') color = '00a307';
                favicon.href = `data:image/svg+xml,%3Csvg data-name='Layer 1' version='1.1' viewBox='0 0 240 234' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23${color};%7D.cls-2%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Crect class='cls-1' width='240' height='234' rx='42.5'/%3E%3Cpath class='cls-2' d='m186.62 175.95h-28.506a6.2432 6.2432 0 0 1-5.8465-3.7691l-30.947-72.359a1.3637 1.3637 0 0 0-2.6114-0.034l-19.286 45.943a1.6348 1.6348 0 0 0 1.5066 2.2694h21.199a3.2696 3.2696 0 0 1 3.0105 1.9941l9.2814 20.655a3.8125 3.8125 0 0 1-3.5078 5.3018h-77.176a3.5183 3.5183 0 0 1-3.2129-4.9044l49.09-116.9a6.639 6.639 0 0 1 6.2323-4.1438h28.314a6.6281 6.6281 0 0 1 6.2329 4.1438l49.429 116.9a3.5172 3.5172 0 0 1-3.2018 4.9044z' data-name='256'/%3E%3C/svg%3E%0A`;
                var favicon2 = document.querySelector('link[rel="shortcut icon"]');
                favicon2.parentNode.removeChild(favicon2);
            }, false);
            window.addEventListener("DOMContentLoaded", (event) => {
                if (document.querySelector('.page-actions')) GM_addStyle(`.sticky-header {top: 42px !important;}`);
                else GM_addStyle(`.sticky-header {top: 0 !important;}`);
            });
            var statusi = {
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
            var trumbowyg_config = {
                btns: [['viewHTML'], ['fontsize', 'strong', 'em', 'underline'], ['foreColor', 'backColor'], ['link'], ['removeformat']],
                linkTargets: ['_blank', '_self'],
                autogrow: true,
                plugins: {
                    colors: {
                        colorList: ['0000ff', 'ff0000', '008000', 'ffff00', 'ff00ff', 'ffffff', '000000'],
                        allowCustomForeColor: true,
                        allowCustomBackColor: true
                    }
                },
                semantic: {
                    'div': 'div' // Editor does nothing on div tags now
                }
            }
            var magento_style_added = 0;
            function add_style() {
                if (!magento_style_added) {
                    GM_addStyle(GM_getResourceText("confirm_css"));
                    GM_addStyle('.jconfirm-api_facturare {font-family: Arial; font-size: 14px; font-weight: 500; font-style: normal;} .jconfirm-api_facturare .jconfirm-content-pane {max-height: calc(100vh - 160px) !important; overscroll-behavior: contain; overflow-y: auto !important;} .jconfirm-api_facturare .jconfirm-box {width: max-content; min-width: 400px; max-width: 95vw;} .jconfirm-api_facturare .jconfirm-title-c {font-size: 18px !important; margin-bottom: 14px; cursor: move !important; padding-bottom: 0 !important; margin-right: 20px;}');
                    GM_addStyle('.jconfirm-awb {font-family: Arial; font-size: 14px; font-weight: 500; font-style: normal;} .jconfirm-awb .jconfirm-content-pane {max-height: calc(100vh - 180px) !important; overscroll-behavior: contain;} .jconfirm-awb .jconfirm-holder {padding: 20px !important;} .jconfirm-awb .jconfirm-box {width: max-content; min-width: 400px; max-width: 800px;} .jconfirm-awb .jconfirm-title-c {font-size: 18px !important; margin-bottom: 14px; cursor: move !important; padding-bottom: 0 !important; margin-right: 20px;} .jconfirm-awb .my-input {padding: 4px; margin: 4px 0;}');
                    GM_addStyle(`#raspuns_api_facturare {font-size:14px;border-collapse: separate; border-spacing: 0;width:100%;padding: 1px;} #raspuns_api_facturare td, #raspuns_api_facturare th{padding:8px;vertical-align: middle;} #raspuns_api_facturare tbody:nth-child(odd) {background-color:#f2f2f2;} #raspuns_api_facturare tbody:hover{background-color:#fcf5dd;} #raspuns_api_facturare th{padding-top:12px;padding-bottom:12px;text-align:left;background-color:#6f8992;color:white;} #raspuns_api_facturare .tbl-current {background-color: #dff0d8 !important;}
                #raspuns_api_facturare th {
                    border-top: 1px solid #f5720b;
                    border-bottom: 1px solid #f5720b;
                    border-right: 1px solid #f5720b;
                }
                #raspuns_api_facturare td {
                    border-bottom: 1px solid #f5720b;
                    border-right: 1px solid #f5720b;
                }
                #raspuns_api_facturare tbody:first-child > tr > td {
                    border-top: 1px solid #f5720b;
                }
                #raspuns_api_facturare th:first-child,
                #raspuns_api_facturare tbody > tr:first-child > td:first-child {
                    border-left: 1px solid #f5720b;
                }
                #raspuns_api_facturare thead th {
                    position: sticky;
                    top: 0;
                }
                .button-switch {
                    text-decoration: underline;
                    cursor: pointer;
                }
                .button-switch:hover {
                    color: blue;
                }
                `);
                    GM_addStyle('.jconfirm-lista_comenzi {font-family: Arial; font-size: 14px; font-weight: 500; font-style: normal;} .jconfirm-lista_comenzi .jconfirm-content-pane {max-height: calc(100vh - 160px) !important; overscroll-behavior: contain; overflow-y: auto !important;} .jconfirm-lista_comenzi .jconfirm-box {width: max-content; min-width: 400px; max-width: 95vw;} .jconfirm-lista_comenzi .jconfirm-title-c {font-size: 16px !important; margin-right: 20px; cursor: move !important;} .jconfirm-lista_comenzi .jconfirm-box div.jconfirm-content-pane .jconfirm-content {overflow: unset;}');
                    GM_addStyle('.jconfirm-cost_livrare {font-family: Arial; font-size: 14px; font-weight: 500; font-style: normal;} .jconfirm-cost_livrare .jconfirm-content-pane {max-height: calc(100vh - 160px) !important; overscroll-behavior: contain; overflow-x: auto !important;} .jconfirm-cost_livrare .jconfirm-box {width: max-content; min-width: 400px; max-width: 95vw;} .jconfirm-cost_livrare .jconfirm-title-c {font-size: 16px !important; margin-right: 20px; cursor: move !important;} .jconfirm-cost_livrare .jconfirm-box div.jconfirm-content-pane .jconfirm-content {overflow: unset;}');
                    GM_addStyle('.jconfirm-stoc_comanda {font-family: Arial; font-size: 14px; font-weight: 500; font-style: normal;} .jconfirm-stoc_comanda .jconfirm-content-pane {max-height: calc(100vh - 160px) !important; overscroll-behavior: contain; overflow-x: auto !important;} .jconfirm-stoc_comanda .jconfirm-box {width: max-content; min-width: 600px; max-width: 98vw;} .jconfirm-stoc_comanda .jconfirm-title-c {font-size: 16px !important; margin-right: 20px; cursor: move !important;} .jconfirm-stoc_comanda .jconfirm-box div.jconfirm-content-pane .jconfirm-content {overflow: unset;} .jconfirm-stoc_comanda .jconfirm-box div.jconfirm-content-pane {margin-top: 14px;}');
                    GM_addStyle('.jconfirm-my_alert .jconfirm-box {width: fit-content;} .jconfirm-new_email .jconfirm-box {width: 500px;} .jconfirm .jconfirm-box div.jconfirm-closeIcon {height: 16px; width: 16px; overflow: hidden;}');
                    GM_addStyle('.jconfirm-my_confirm .jconfirm-box {width: fit-content;} .jconfirm-my_confirm .jconfirm-buttons{display: flex; width: 100%; justify-content: space-between; float: unset !important;} .jconfirm-my_confirm .jconfirm-content {margin-top: 14px;} .jconfirm-my_confirm .jconfirm-title-c {font-size: 18px !important; margin-right: 20px; cursor: move !important;}');
                    GM_addStyle(`
                .loader {
                    border-radius: 50%;
                    border-left: 3px solid #007bdb;
                    border-top: 3px solid #007bdb;
                    border-right: 3px solid #007bdb;
                    border-bottom: 3px solid #f3f3f3;
                    -webkit-animation: spin 2s linear infinite;
                    animation: spin 2s linear infinite;
                    width: 20px;
                    height: 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .my-stripped > tbody > tr:nth-child(even) {
                    background: #f1f1f1;
                }
                .my-stripped > tbody > tr:hover {
                    background-image: linear-gradient(rgb(0 0 0/15%) 0 0);
                }
                `);
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
                #comenzi a:visited { color: #f5720b; }
                `);
                    GM_addStyle(`
                .rate {width:100%; border: 2px solid #f5720b;}
                .rate:nth-of-type(n+2) {margin-top: 10px;}
                .rate td, .rate th {padding:6px; border: 1px solid #f5720b; text-align: center;}
                .rate th{background-color:#43a0de; color:white; font-weight: normal;}
                .rate tr > th:first-of-type {width: 240px; text-align: left;}
                .rate a {color: white;}
                #info_curier {width:100%; border: 2px solid #f5720b;}
                #info_curier td, #info_curier th {padding:6px; border: 1px solid #f5720b; text-align: center;}
                #info_curier th{background-color:#43a0de; color:white; font-weight: normal;}
                `);
                    GM_addStyle(`
                #stocuri {border-collapse: separate; border-spacing: 0;width:100%;}
                #stocuri td, #stocuri th{padding:6px;}
                #stocuri thead th{padding-top:10px;padding-bottom:10px;text-align:left;background-color:#43a0de;color:white; z-index: 1;}
                #stocuri tbody tr:last-child td {
                    border-bottom: 2px solid #f5720b !important;
                }
                #stocuri thead tr:first-child th {
                    border-top: 2px solid #f5720b !important;
                    line-height: 16px;
                    height: 38px;
                }
                #stocuri td:last-child, #stocuri th:last-child {
                    border-right: 2px solid #f5720b !important;
                }
                #stocuri td:first-child, #stocuri th:first-child {
                    border-left: 2px solid #f5720b !important;
                    position: sticky;
                    left: 0;
                }
                #stocuri > thead > tr > th:nth-of-type(1) {
                    position: sticky;
                    left: 0;
                    z-index: 2;
                }
                #stocuri thead tr:first-child th {
                    border-top: thin solid #f5720b;
                    border-bottom: thin solid #f5720b;
                    border-right: thin solid #f5720b;
                }
                #stocuri td, #stocuri th {
                    border-bottom: thin solid #f5720b;
                    border-right: thin solid #f5720b;
                    font-weight: normal;
                }
                #stocuri thead th:first-child,
                #stocuri tbody th:first-child,
                #stocuri thead td:first-child {
                    border-left: thin solid #f5720b;
                }
                #stocuri thead tr:nth-child(1) th {
                    position: sticky;
                    top: 0;
                }
                #stocuri thead tr:nth-child(2) th {
                    position: sticky;
                    top: 38px;
                }
                #stocuri {
                    padding: 0 1px 1px 0;
                }
                #stocuri td:first-child, #stocuri thead tr:first-child th {
                    white-space: nowrap;
                }
                #stocuri th div {
                    -webkit-line-clamp: 2;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                #stocuri .danger {
                    background-color: #f2dede;
                }
                #stocuri .active {
                    background-color: #f5f5f5;
                }
                #stocuri .info {
                    background-color: #d9edf7;
                }
                #stocuri .current_store {
                    color: blue;
                    font-weight: bold;
                }
                #stocuri > tbody > tr > td:first-child:hover {z-index:3;}
                #stocuri .highlight {background-image: linear-gradient(rgb(0 0 0/20%) 0 0); cursor: pointer;}
                #stocuri .first {background-color: #c0e3b2;}
                #stocuri .second {background-color: #eadc07;}
                #stocuri .hint--top {display: table-cell;}
                #stocuri a.change_qty {color: #fff;}
                `);
                    GM_addStyle(`
                #costuri {border-collapse: separate; border-spacing: 0;width:100%;}
                #costuri td, #costuri th{padding:6px;}
                #costuri th{padding-top:10px;padding-bottom:10spx;text-align:left;background-color:#43a0de;color:white; z-index: 1; line-height: 26px;}
                #costuri tbody:nth-child(odd) {background-color:#f2f2f2;}
                #costuri tbody:hover{background-color:#fcf5dd;}
                #costuri .cost_curent {font-weight: bold; color: #43a0de;}
                #costuri .tbl-current {background-color: #0bc9f566 !important;}
                #costuri .tbl-current:hover {background-color: #0bc9f5b0 !important;}
                #costuri th {
                    border-top: 1px solid #f5720b;
                    border-bottom: 1px solid #f5720b;
                    border-right: 1px solid #f5720b;
                }
                #costuri td {
                    border-bottom: 1px solid #f5720b;
                    border-right: 1px solid #f5720b;
                }
                #costuri th:first-child,
                #costuri td:first-child {
                    border-left: 1px solid #f5720b;
                }
                #costuri thead tr:nth-child(1) th {
                    position: sticky;
                    top: 0;
                }
                #costuri thead tr:nth-child(2) th {
                    position: sticky;
                    top: 37px;
                }
                #costuri {
                    padding: 0 1px 1px 0;
                }
                #costuri .hint--top {
                    display: table-cell;
                }
                `);
                    magento_style_added = 1;
                }
            }
            var tari = {
                AF: "Afganistan",
                ZA: "Africa de Sud",
                AL: "Albania",
                DZ: "Algeria",
                AD: "Andorra",
                AO: "Angola",
                AI: "Anguilla",
                AQ: "Antarctica",
                AG: "Antigua și Barbuda",
                SA: "Arabia Saudită",
                AR: "Argentina",
                AM: "Armenia",
                AW: "Aruba",
                AU: "Australia",
                AT: "Austria",
                AZ: "Azerbaidjan",
                BS: "Bahamas",
                BH: "Bahrain",
                BD: "Bangladesh",
                BB: "Barbados",
                BY: "Belarus",
                BE: "Belgia",
                BZ: "Belize",
                BJ: "Benin",
                BM: "Bermuda",
                BT: "Bhutan",
                BO: "Bolivia",
                BA: "Bosnia și Herțegovina",
                BW: "Botswana",
                BR: "Brazilia",
                BN: "Brunei",
                BG: "Bulgaria",
                BF: "Burkina Faso",
                BI: "Burundi",
                KH: "Cambodgia",
                CM: "Camerun",
                CA: "Canada",
                CV: "Capul Verde",
                CZ: "Cehia",
                CL: "Chile",
                CN: "China",
                TD: "Ciad",
                CY: "Cipru",
                CO: "Columbia",
                KM: "Comore",
                CG: "Congo - Brazzaville",
                CD: "Congo - Kinshasa",
                KP: "Coreea de Nord",
                KR: "Coreea de Sud",
                CR: "Costa Rica",
                HR: "Croația",
                CU: "Cuba",
                CI: "Côte d’Ivoire",
                DK: "Danemarca",
                DJ: "Djibouti",
                DM: "Dominica",
                EC: "Ecuador",
                EG: "Egipt",
                SV: "El Salvador",
                CH: "Elveția",
                AE: "Emiratele Arabe Unite",
                ER: "Eritreea",
                EE: "Estonia",
                SZ: "Eswatini",
                ET: "Etiopia",
                FJ: "Fiji",
                PH: "Filipine",
                FI: "Finlanda",
                FR: "Franța",
                GA: "Gabon",
                GM: "Gambia",
                GE: "Georgia",
                GS: "Georgia de Sud și Insulele Sandwich de Sud",
                DE: "Germania",
                GH: "Ghana",
                GI: "Gibraltar",
                GR: "Grecia",
                GD: "Grenada",
                GL: "Groenlanda",
                GP: "Guadelupa",
                GU: "Guam",
                GT: "Guatemala",
                GG: "Guernsey",
                GN: "Guineea",
                GQ: "Guineea Ecuatorială",
                GW: "Guineea-Bissau",
                GY: "Guyana",
                GF: "Guyana Franceză",
                HT: "Haiti",
                HN: "Honduras",
                IN: "India",
                ID: "Indonezia",
                BV: "Insula Bouvet",
                CX: "Insula Christmas",
                HM: "Insula Heard și Insulele McDonald",
                IM: "Insula Man",
                NF: "Insula Norfolk",
                KY: "Insulele Cayman",
                CC: "Insulele Cocos (Keeling)",
                CK: "Insulele Cook",
                FK: "Insulele Falkland",
                FO: "Insulele Feroe",
                MP: "Insulele Mariane de Nord",
                MH: "Insulele Marshall",
                PN: "Insulele Pitcairn",
                SB: "Insulele Solomon",
                TC: "Insulele Turks și Caicos",
                VI: "Insulele Virgine Americane",
                VG: "Insulele Virgine Britanice",
                AX: "Insulele Åland",
                UM: "Insulele Îndepărtate ale S.U.A.",
                JO: "Iordania",
                IQ: "Irak",
                IR: "Iran",
                IE: "Irlanda",
                IS: "Islanda",
                IL: "Israel",
                IT: "Italia",
                JM: "Jamaica",
                JP: "Japonia",
                JE: "Jersey",
                KZ: "Kazahstan",
                KE: "Kenya",
                KI: "Kiribati",
                KW: "Kuweit",
                KG: "Kârgâzstan",
                LA: "Laos",
                LS: "Lesotho",
                LV: "Letonia",
                LB: "Liban",
                LR: "Liberia",
                LY: "Libia",
                LI: "Liechtenstein",
                LT: "Lituania",
                LU: "Luxemburg",
                MK: "Macedonia de Nord",
                MG: "Madagascar",
                MW: "Malawi",
                MY: "Malaysia",
                MV: "Maldive",
                ML: "Mali",
                MT: "Malta",
                MA: "Maroc",
                MQ: "Martinica",
                MR: "Mauritania",
                MU: "Mauritius",
                YT: "Mayotte",
                MX: "Mexic",
                FM: "Micronezia",
                MC: "Monaco",
                MN: "Mongolia",
                MS: "Montserrat",
                MZ: "Mozambic",
                ME: "Muntenegru",
                MM: "Myanmar (Birmania)",
                NA: "Namibia",
                NR: "Nauru",
                NP: "Nepal",
                NI: "Nicaragua",
                NE: "Niger",
                NG: "Nigeria",
                NU: "Niue",
                NO: "Norvegia",
                NC: "Noua Caledonie",
                NZ: "Noua Zeelandă",
                OM: "Oman",
                PK: "Pakistan",
                PW: "Palau",
                PA: "Panama",
                PG: "Papua-Noua Guinee",
                PY: "Paraguay",
                PE: "Peru",
                PF: "Polinezia Franceză",
                PL: "Polonia",
                PT: "Portugalia",
                PR: "Puerto Rico",
                QA: "Qatar",
                HK: "R.A.S. Hong Kong, China",
                MO: "R.A.S. Macao, China",
                GB: "Regatul Unit",
                CF: "Republica Centrafricană",
                DO: "Republica Dominicană",
                MD: "Republica Moldova",
                RO: "România",
                RU: "Rusia",
                RW: "Rwanda",
                RE: "Réunion",
                EH: "Sahara Occidentală",
                KN: "Saint Kitts și Nevis",
                VC: "Saint Vincent și Grenadinele",
                BL: "Saint-Barthélemy",
                PM: "Saint-Pierre și Miquelon",
                WS: "Samoa",
                AS: "Samoa Americană",
                SM: "San Marino",
                SN: "Senegal",
                RS: "Serbia",
                SC: "Seychelles",
                SH: "Sfânta Elena",
                LC: "Sfânta Lucia",
                MF: "Sfântul Martin",
                SL: "Sierra Leone",
                SG: "Singapore",
                SY: "Siria",
                SK: "Slovacia",
                SI: "Slovenia",
                SO: "Somalia",
                ES: "Spania",
                LK: "Sri Lanka",
                US: "Statele Unite ale Americii",
                VA: "Statul Cetății Vaticanului",
                SD: "Sudan",
                SE: "Suedia",
                SR: "Suriname",
                SJ: "Svalbard și Jan Mayen",
                ST: "São Tomé și Príncipe",
                TJ: "Tadjikistan",
                TW: "Taiwan",
                TZ: "Tanzania",
                TF: "Teritoriile Australe și Antarctice Franceze",
                PS: "Teritoriile Palestiniene",
                IO: "Teritoriul Britanic din Oceanul Indian",
                TH: "Thailanda",
                TL: "Timor-Leste",
                TG: "Togo",
                TK: "Tokelau",
                TO: "Tonga",
                TT: "Trinidad și Tobago",
                TN: "Tunisia",
                TR: "Turcia",
                TM: "Turkmenistan",
                TV: "Tuvalu",
                UA: "Ucraina",
                UG: "Uganda",
                HU: "Ungaria",
                UY: "Uruguay",
                UZ: "Uzbekistan",
                VU: "Vanuatu",
                VE: "Venezuela",
                VN: "Vietnam",
                WF: "Wallis și Futuna",
                YE: "Yemen",
                ZM: "Zambia",
                ZW: "Zimbabwe",
                NL: "Țările de Jos (Olanda)"
            }
            function get_search_select_options(data) {
                var options = '';
                if (data == 'tari') {
                    for (const [key, value] of Object.entries(tari)) {
                        options += `<li class="admin__action-multiselect-menu-inner-item _root">
                    <div class="action-menu-item _last" data-id="${key}" data-nume="${value}">
                    <label class="admin__action-multiselect-label">
                    <span>${value}</span><div class="my-search-text">${key}|${value}|${value.normalize('NFD').replace(/\p{Diacritic}/gu, '')}</div>
                    </label>
                    </div>
                    </li>`;
                    }
                }
                else if (data == 'regions') {
                    for (const [judet, value] of Object.entries(judete)) {
                        options += `<li class="admin__action-multiselect-menu-inner-item _root">
                    <div class="action-menu-item _last" data-id="${value.id}" data-nume-alternativ="${judet}" data-nume="${value.nume}">
                    <label class="admin__action-multiselect-label">
                    <span>${value.nume}</span><div class="my-search-text">${judet}|${value.nume}</div>
                    </label>
                    </div>
                    </li>`;
                    }
                }
                else {
                    $.each(data.cities, function(i, value) {
                        options += `<li class="admin__action-multiselect-menu-inner-item _root">
                    <div class="action-menu-item _last" data-nume="${value.name}">
                    <label class="admin__action-multiselect-label">
                    <span>${value.name}</span><div class="my-search-text">${value.name}</div>
                    </label>
                    </div>
                    </li>`;
                    });
                }
                return options;
            }
            function get_search_select_text(clasa, options) {
                return `<div class="admin__action-multiselect-wrap action-select-wrap my-search-select ${clasa}">
            <div class="action-select admin__action-multiselect">
            <div class="admin__action-multiselect-text my-value"></div>
            </div>
            <div class="action-menu">
            <div class="admin__action-multiselect-search-wrap">
            <input class="admin__control-text admin__action-multiselect-search my-select-search" type="text">
            <label class="admin__action-multiselect-search-label"></label>
            </div>
            <ul class="admin__action-multiselect-menu-inner _root">
            ${options}
            </ul>
            </div>
            </div>`;
            }
            function search_select_actions() {
                GM_addStyle(`
            .my-search-select .admin__action-multiselect-search-wrap {
                border-bottom: none;
            }
            .my-search-select .action-menu-item:hover {
                background-color: #e3e3e3;
            }
            .disabled {
                cursor: default;
                opacity: .5;
                pointer-events: none;
            }
            .d-none, .my-search-text {display: none;}
            `);
                $(document).on('keyup', '.my-search-select .my-select-search', function() {
                    let text = $(this).val();
                    $(this).closest('.action-select-wrap').find('.admin__action-multiselect-menu-inner-item').removeClass('d-none');
                    $(this).closest('.action-select-wrap').find(`.action-menu .my-search-text:not(:icontains("${text}"))`).closest('li').addClass('d-none');
                });
                $(document).on('click', function(event) {
                    if(!$(event.target).closest('.my-search-select').length) $('._active').removeClass('_active');
                });
                $(document).on('click', '.my-search-select > .action-select', function() {
                    if ($(this).hasClass('_active')) $('._active').removeClass('_active');
                    else {
                        $('._active').removeClass('_active');
                        $(this).addClass('_active');
                        $(this).parent().addClass('_active');
                        $(this).parent().find('.action-menu').addClass('_active');
                    }
                    $(this).parent().find('.my-select-search').show().removeAttr('aria-required').focus();
                });
                $(document).on('click', '.my-search-select .action-menu-item', function() {
                    $(this).closest('ul').find('._selected').removeClass('_selected');
                    $(this).addClass('_selected');
                    $(this).closest('.action-select-wrap').find('.my-value').html($(this).data('nume')).change();
                    $(this).closest('.action-select-wrap').find('.action-select').click();
                });
            }
            GM_addStyle(`
        .notices-wrapper {
            min-height: unset !important;
        }
        #system_messages, .message.message-notice.notice {
            display: none;
        }
        .message-error {
            margin-bottom: 6px;
            padding: 8px 8px 8px 50px;
        }
        #messages {
            margin-bottom: 6px;
        }
        .page-header {
            padding: 0 3rem !important;
        }
        h1 {
            font-size: 2.2rem !important;
        }
        button {
            font-size: 14px !important;
            line-height: 20px !important;
            border: 0px !important;
        }
        button:hover, .actions-split:hover, .actions-split:focus, .actions-split:active, button.primary:active, button.primary:focus, button.action-secondary:active, button.action-secondary:focus {
            box-shadow: none !important;
        }
        .title {
            font-size: 16px !important;
        }
        .sticky-header {
            padding-top: 16px;
        }
        .page-main-actions .page-actions._fixed .page-actions-inner:before {
            font-size: 20px !important;
        }
        .page-main-actions .page-actions .page-actions-inner {
            width: 100%;
        }
        .page-main-actions .page-actions._fixed {
            padding: 0 32px;
        }
        .page-actions .page-actions-buttons > button:hover {
            background-image: linear-gradient(rgb(0 0 0/10%) 0 0);
        }
        .page-actions .page-actions-buttons > button {
            margin: 0 !important;
        }
        .page-main-actions {
            padding: 0 !important;
        }
        .sticky-header .admin__data-grid-wrap {
            padding: 0;
        }
        .page-actions .actions-split {
            margin-left: 0 !important;
        }
        .admin__menu [class*='level-']:not(.level-0) a {
            padding: 6px 1.5rem !important;
        }
        .admin__menu .level-0>.submenu {
            max-height: 100vh !important;
            height: 100vh !important;
        }
        .admin__menu .level-0>.submenu>ul[role='menu'] {
            min-height: 0;
        }
        #menu-magento-marketplace-partners {
            display: none;
        }
        .admin__page-nav-link {
            padding: 6px 0 6px 10px !important;
        }
        .admin__page-nav-title {
            padding: 6px 10px !important;
        }
        .admin__page-nav-title._collapsible:after {
            top: 10px !important;
        }
        .currency:before {
            content:"\\00a0";
        }
        .price {
            white-space: nowrap;
        }
        .data-table .product-sku-block, .data-table .bundle-product-sku {cursor: pointer; display: inline-block;}
        .data-table .product-sku-block > br {display: none;}
        .data-table .product-sku-block:hover, .data-table .bundle-product-sku:hover {text-decoration: underline;}
        #order-items > span {
            display: block;
        }
        .modal-popup .action-close {
            padding: 1rem !important;
        }
        .modal-footer {padding-top: 0 !important;}
        .do_action {
            float: right;
            cursor: pointer;
        }
        .awb_status {
            display: flex;
            gap: 6px;
        }
        .awb_status > span:first-child {
            font-weight: bold;
            white-space: nowrap;
        }
        .awb_status .awb {
            cursor: pointer;
        }
        .awb_status .awb:hover {
            text-decoration: underline;
        }
        .d-none {display: none !important;}
        .selectmenu-items li:last-child .selectmenu-item-action {
            padding: 10px;
            width: fit-content;
        }
        .order-billing-address address > a {
            display: none;
            user-select: none;
            margin-left: 10px;
        }
        .order-billing-address address:hover > a {
            display: inline-block;
        }
        `);
            if (!$('#login-form').length) {
                $.expr[':'].icontains = function(a, i, m) {
                    var regex = new RegExp(m[3],'gi');
                    return regex.test($(a).html())
                };
                //table row middle click
                $(document).on('auxclick', "table:not('.order-account-information-table') tbody > tr", function (event) {
                    if (event.button !== 1) return;
                    // dacă s-a dat click pe <a> sau într-un <a>, lăsăm browserul să se ocupe
                    if ($(event.target).closest('a').length) return;
                    let link = '';
                    // link din title (dacă este URL valid) sau fallback: primul <a> din rând
                    if (this.title && /^(https?:)?\/\//i.test(this.title)) link = this.title;
                    else {
                        const a = $(this).find('a[href]').first();
                        if (a.length) link = a.attr('href');
                    }
                    if (!link) return;
                    // Ctrl + middle click => background | middle click simplu => tab activ
                    GM_openInTab(link, {active: !event.ctrlKey, insert: false});
                    event.preventDefault();
                    event.stopPropagation();
                });

                function add_custom_search(by, placeholder) {
                    $('.data-grid-search-control-wrap').hide().after(`<div class="data-grid-search-control-wrap"><input class="admin__control-text data-grid-search-control" type="text" id="my_custom_search" data-search_by="${by}" placeholder="${placeholder}"><button id="my_custom_search_button" class="action-submit" type="button"></button></div>`).remove();
                }
                $(document).on('click keypress', '#my_custom_search, #my_custom_search_button', function(e) {
                    if (e.which == 13 || (e.type == "click" && e.target.id == 'my_custom_search_button')) {
                        var val = $('#my_custom_search').val();
                        var search_by = $('#my_custom_search').data('search_by');
                        if (val.length > 0) {
                            $('.admin__data-grid-filters-wrap input[name="'+search_by+'"]').val(val);
                            $('.admin__data-grid-filters-wrap input[name="'+search_by+'"]')[0].dispatchEvent(new Event("change"));
                            $('.admin__data-grid-filters-wrap .action-secondary').click();
                        }
                    }
                });
                //Open product edit page
                $(document).on('auxclick', '.data-table .product-sku-block, .data-table .bundle-product-sku', function(e) {
                    if (e.button === 1) {
                        const sku = $(this).text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim();
                        if (sku) {
                            $(this).fadeOut().fadeIn();
                            GM_openInTab(location.origin+`/admin/catalog/product/edit/sku/${sku}/`,{active: false, insert: false});
                        }
                        else alert('Nu am gasit codul produsului!');
                    }
                });
                function um_refresh() {
                    var um_form_key = localStorage.getItem('um_form_key') || '';
                    var um = JSON.parse(localStorage.getItem('um') || '{}');
                    if ($('input[name=form_key]').val() !== um_form_key || Object.keys(um).length === 0) {
                        magento_mui_request({namespace:'unit_measurement_listing&filters[type]=base'}).then(function(response) {
                            if (response.items.length) {
                                $.each(response.items, function(i, value) {
                                    um[value.unit] = {singular: value.singular, plural: value.plural};
                                });
                                localStorage.setItem('um', JSON.stringify(um));
                                localStorage.setItem('um_form_key', $('input[name=form_key]').val());
                            }
                        }).catch(function(e) {
                            console.log(e);
                        });
                    }
                }
                //paste text on tbw
                $(document).on('paste', '.trumbowyg-editor', function(e) {
                    e.preventDefault();
                    var text = e.originalEvent.clipboardData.getData('text');
                    var html = e.originalEvent.clipboardData.getData('text/html');
                    console.log(html);
                    if (/<!--my html-->/.test(html)) {
                        text = html.replace(/^<html>\r?\n?<body>\r?\n?<!--StartFragment--><!--my html-->(?:<html><head><\/head><body>)?|(?:<\/body><\/html>)?<!--EndFragment-->\r?\n?<\/body>\r?\n?<\/html>$/g, '');
                        console.log(text);
                        if (/<\/(?:blockquote|table|div)>$/.test(text)) {
                            var new_line = '<p><br></p>';
                            if (navigator.userAgent.match(/firefox|fxios/i)) new_line = '<p></p>';
                            text = text + new_line;
                            console.log(text);
                        }
                    }
                    document.execCommand('insertHTML', false, text);
                });
                function ontbwpaste(elem) {
                    console.log('ontbwpaste');
                    if (/<\/(?:blockquote|table|div)>$/.test(elem.trumbowyg('html'))) {
                        if (navigator.userAgent.match(/firefox|fxios/i)) document.execCommand('insertHTML', false, '<p></p>');
                        else {
                            elem.trumbowyg('html', elem.trumbowyg('html') + '<p><br></p>');
                            let editor = elem.siblings('.trumbowyg-editor-box').find('.trumbowyg-editor')[0];
                            editor.focus();
                            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                                var range = document.createRange();
                                range.selectNodeContents(editor);
                                range.collapse(false);
                                var sel = window.getSelection();
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }
                    }
                }
                function add_trumbowyg_style() {
                    GM_addStyle(`
                ${GM_getResourceText("trumbowyg_css")}
                ${GM_getResourceText("trumbowyg_colors_css")}
                .trumbowyg-button-pane {
                    background: #f1f1f1;
                    border-bottom: none;
                    z-index: 1;
                }
                .trumbowyg-button-pane::after, .trumbowyg-button-pane::before, .trumbowyg-button-pane .trumbowyg-button-group::after {
                    background: #ccc !important;
                }
                .trumbowyg-dropdown button:focus, .trumbowyg-dropdown button:hover {
                    background: #f1f1f1;
                }
                .trumbowyg-box .trumbowyg-editor {
                    min-height: 150px;
                    height: fit-content;
                    padding: 10px;
                }
                .trumbowyg-box {
                    border: 1px solid #ccc;
                    transition: border-color .1s linear;
                    min-height: unset;
                }
                .trumbowyg-box:has(.trumbowyg-editor:focus) {
                    border: 1px solid #007bdb;
                }
                .trumbowyg-box:hover {
                    border: 1px solid #878787;
                }
                .trumbowyg-createLink-dropdown-button, .trumbowyg-unlink-dropdown-button  {
                    display: flex !important;
                    align-items: center !important;
                }
                .trumbowyg-box.trumbowyg-editor-hidden .trumbowyg-textarea {
                    -webkit-box-flex: unset;
                    -webkit-flex: unset;
                    -moz-box-flex: unset;
                    -ms-flex: unset;
                    flex: unset;
                }`);
                    $('body').append(`<div id="trumbowyg-icons" style="display: none;">${GM_getResourceText("trumbowyg_icons")}</div>`);
                }
                GM_addStyle(GM_getResourceText('hint') + `[class*=hint--]:after {font-weight: normal; font-size: 13px; line-height: 16px; white-space: pre-line; width: max-content; transition: 0.15s ease-in-out;}  [class*=hint--]:before {transition: 0.15s ease-in-out;}`);
                if (location.href.includes('/admin/sales/order/view/order_id/') || location.href.includes('/sales/order/view/increment_id/')) {
                    console.log('view order');
                    if (location.href.includes('/sales/order/view/increment_id/')) {
                        waitForElm('input[name=order_id]').then((elm) => {
                            window.history.pushState(null,document.title,location.origin + '/admin/sales/order/view/order_id/' + elm.val());
                        });
                    }
                    function get_products_details() {
                        console.log('get prod details');
                        var details = {};
                        var sku_order = [];
                        var sku, denumire, status, cantitate, pret;
                        $('.edit-order-table > tbody').each(function() {
                            sku = $(this).find('.product-sku-block').text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                            if (!sku.includes('-')) {
                                cantitate = Number($(this).find('.qty-table > tbody > tr:first-of-type > td').data('qty') || $(this).find('.qty-table > tbody > tr:first-of-type > td').text().trim());
                                denumire = $(this).find('.product-title').text();
                                status = $(this).find('.col-status').text().trim();
                                pret = Number($(this).find('.col-price .price').text().replace('lei','').trim() || 0);
                                if (details[sku]) {
                                    var total_anterior = details[sku].cantitate * details[sku].pret;
                                    var total_curent = cantitate * pret;
                                    cantitate = details[sku].cantitate + cantitate;
                                    pret = Number(((total_anterior + total_curent) / cantitate).toFixed(2));
                                }
                                details[sku] = {cantitate: cantitate, pret: pret, denumire: denumire, status: status};
                                if (!sku_order.includes(sku)) sku_order.push(sku);
                            }
                            else {
                                details.bundle = 1;
                                details[sku] = {};
                                $(this).find('> tr:gt(0)').each(function() {
                                    sku = $(this).find('.bundle-product-sku').text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                                    cantitate = Number($(this).find('.qty-table > tbody > tr:first-of-type > td').data('qty') || $(this).find('.qty-table > tbody > tr:first-of-type > td').text().trim());
                                    denumire = $(this).find('.option-value').text();
                                    status = $(this).find('.col-status').text().trim();
                                    pret = Number($(this).find('.col-price .price').text().replace('lei','').trim() || 0);
                                    if (details[sku]) {
                                        var total_anterior = details[sku].cantitate * details[sku].pret;
                                        var total_curent = cantitate * pret;
                                        cantitate = details[sku].cantitate + cantitate;
                                        pret = Number(((total_anterior + total_curent) / cantitate).toFixed(2));
                                    }
                                    details[sku] = {cantitate: cantitate, pret: pret, denumire: denumire, status: status};
                                    if (!sku_order.includes(sku)) sku_order.push(sku);
                                });
                            }
                        });
                        details.sku_order = sku_order;
                        return details;
                    }
                    GM_addStyle(`
                h1.page-title, .nrOL {cursor: pointer; display: inline-block;} h1.page-title:hover, .nrOL:hover {text-decoration: underline;}
                .page-main-actions .page-actions._fixed .page-actions-inner:before {display: none;} .page-actions .nrOL {display: none;} .page-actions._fixed .nrOL {display: inline-block !important; font-size: 22px; line-height: 39px;} a {cursor: pointer;} .edit-email {height: 19px; cursor: pointer; float: right; transition: color ease-in-out .15s; display: none;} .edit-email:hover {color: #007bdb;} .order-account-information-table > tbody > tr:nth-of-type(2):hover .edit-email {display: inline-block;}
                .my-input {
                    border: 1px solid grey;
                    width: 100%;
                    transition: border-color ease-in-out .25s;
                    border-radius: 4px;
                }
                .my-input:focus {
                    border: 1px solid #007bdb;
                }
                .my-input:invalid {
                    border: 1px solid red;
                }
                thead .col-ordered-qty > .hint--left {
                    cursor: pointer;
                    text-decoration: underline;
                }
                thead .col-ordered-qty > .hint--left:hover {
                    color: #007bdb;
                }
                .disabled {
                    cursor: default;
                    opacity: .5;
                    pointer-events: none;
                }
                #mybutton, #add_payment_link, #order_creditmemo {
                    display: none;
                }
                #order_edit, #order_edit-lock {
                    order: 10;
                }
                #move_order, #move_order-lock {
                    order: 9;
                }
                #order_cancel, #order_cancel-lock {
                    order: 8;
                }

                :root {
                    --menu-top: 124px;
                }
                .page-layout-admin-2columns-left .page-columns .side-col {
                    width: 200px !important;
                    position: sticky;
                    top: var(--menu-top);
                    z-index: 10;
                }
                .page-columns .main-col {
                    width: calc(100% - 250px) !important;
                }
                .edit-order-comments .note-list {
                    width: calc(100vw - 380px) !important;
                }
                .edit-order-comments .note-list {
                    font-size: 13px !important;
                    white-space: pre-line;
                }
                .note-list-status {
                    font-weight: bold;
                }
                .edit-order-comments .note-list-item {
                    border-top: 1px solid #ccc;
                    padding-top: 4px;
                }
                .edit-order-comments .note-list-comment {
                    margin: 6px 0 16px 0 !important;
                }
                #guest_to_customer {
                    display: none;
                }
                .admin__page-section {
                    margin-bottom: 14px !important;
                }
                .edit-order-table {
                    margin-bottom: 0 !important;
                }
                .edit-order-table .col-subtotal,
                .edit-order-table .col-tax-amount,
                .edit-order-table .col-tax-percent,
                .edit-order-table .col-discont {
                    display: none;
                }
                #order_invoice,
                #sales_order_view_tabs_order_invoices,
                #sales_order_view_tabs_order_creditmemos,
                #sales_order_view_tabs_order_shipments,
                #sales_order_view_tabs_order_history,
                .order-gift-options {
                    display: none;
                }
                .edit-order-table > tbody.even {
                    background: #f1f1f1;
                }
                .edit-order-table > thead > tr > th:first-child, .edit-order-table > tbody > tr > td:first-child {
                    padding-left: 15px !important;
                }
                .order-payment-currency {display: none;}
                .tree-source-scope .field-store_label, .move_order .admin__field-control {
                    margin: 0 !important;
                }
                .edit-order-table .col-product > a {margin-left: 16px; white-space: nowrap;}
                .select_number {text-align: right !important;}
                .select_number > .number {margin-bottom: 10px;}
                .select_number > .number.active {cursor: pointer;}
                .select_number input {width: 16px; height: 16px;}
                .select_number label {padding: 0 !important;}
                .select_number label:before {margin: 0 !important;}
                .copy_all, .copy_msg {margin-left: 10px; cursor: pointer; display:none; float:right;}
                .note-list > li:hover .copy_all, .note-list > li:hover .copy_msg {display: inline-block;}
                .dropdown.comments {
                    position: relative;
                    display: inline-block;
                    margin-left: 10px;
                    float: right;
                    cursor: pointer;
                    height: 22px;
                }
                .dropdown-content {
                    display: none;
                    position: absolute;
                    background-color: #f1f1f1;
                    white-space: nowrap;
                    overflow: auto;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.4);
                    z-index: 100;
                }
                .dropdown-content.comments {
                    top: 22px;
                }
                .dropdown-content.left-menu {
                    top: 0;
                    left: 190px;
                }
                .dropdown-content span {
                    color: black;
                    padding: 5px 10px;
                    text-decoration: none;
                    display: block;
                    line-height: 20px;
                }
                .dropdown-content span:hover {background-color: #ddd;}
                .dropdown:hover > .dropdown-content {display: block;}

                #history_form label[for=history_comment] {
                    display: inline-block;
                }
                #judet:invalid, #localitate:invalid {
                    border-color: red;
                }
                .col-ordered-qty {white-space: nowrap;}
                #history-submit-file {float: right;}
                #eventform input {height: 23px;}
                .my-search-text {display: none;}
                #missing-products-block, #merchandise-acquisition-block {z-index: 11;}
                /* Chrome, Safari, Edge, Opera */
                .no-arrows::-webkit-outer-spin-button,
                .no-arrows::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                /* Firefox */
                .no-arrows {
                    -moz-appearance: textfield;
                }
                .order-addresses .admin__page-section-content .title:hover {cursor: pointer; text-decoration: underline;}
                .order-view-multishipping .data-table > tbody > tr > th {display: none;}
                .super-highlight {
    font-size: 34px;
    font-weight: bold;
    text-transform: uppercase;
    color: red;
    /*animation: pulse-color 1s infinite, blink-opacity 0.5s infinite;*/
    animation: blink 1s step-start infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
                `);
                    add_trumbowyg_style();
                    //set fixed side actions
                    var r = document.querySelector(':root');
                    function set_css_var() {
                        if (window.scrollY > 60) $('.page-actions:not(._fixed)').addClass('_fixed');
                        if (document.querySelector('.page-actions._fixed')) {
                            r.style.setProperty('--menu-top', (document.querySelector('.page-actions._fixed').offsetHeight + 10) + 'px');
                            window.removeEventListener('scroll', set_css_var);
                        }
                    }
                    window.addEventListener("resize", add_scroll_event);
                    function add_scroll_event() {
                        window.addEventListener('scroll', set_css_var);
                    }
                    add_scroll_event();
                    //Copy order link
                    $(document).on('auxclick', 'h1.page-title, .nrOL', function(e) {
                        if (e.button === 1) {
                            var nrOL = $(this).text().replace('#','');
                            var text = `<a href="${location.href}" target="_blank">${nrOL}</a>`;
                            $(this).fadeOut().fadeIn();
                            copy_text(nrOL, text);
                        }
                    });
                    function installments_refresh() {
                        var installments = JSON.parse(GM_getValue('installments') || '{}');
                        if ($('input[name=form_key]').val() !== GM_getValue('installments_session') || Object.keys(installments).length === 0) {
                            console.log('installments refresh');
                            magento_mui_request({namespace:'installments_limit_list&sorting[field]=lower_limit&sorting[direction]=asc'}).then(function(response) {
                                if (response.items.length) {
                                    installments = {};
                                    $.each(response.items, function(i, value) {
                                        if (installments[value.payment_method]) installments[value.payment_method] = [...installments[value.payment_method], {lower_limit: value.lower_limit, upper_limit: value.upper_limit, installments: value.installments}];
                                        else installments[value.payment_method] = [{lower_limit: value.lower_limit, upper_limit: value.upper_limit, installments: value.installments}];
                                    });
                                    GM_setValue('installments', JSON.stringify(installments));
                                    GM_setValue('installments_session', '');
                                    GM_setValue('installments_session', $('input[name=form_key]').val());
                                }
                            }).catch(function(e) {
                                console.log(e);
                            });
                        }
                        else {
                            GM_setValue('installments_session', '');
                            GM_setValue('installments_session', $('input[name=form_key]').val());
                        }
                    }
                    var store_list_form_key, store_list;
                    let mantis_store_list = JSON.parse(localStorage.getItem('mantis_store_list') || '[]');
                    function store_list_refresh() {
                        store_list_form_key = localStorage.getItem('store_list_form_key') || '';
                        store_list = JSON.parse(localStorage.getItem('store_list') || '{}');
                        if ($('input[name=form_key]').val() !== store_list_form_key || Object.keys(store_list).length === 0) {
                            console.log('store list refresh');
                            magento_request({api_url:'/rest/V1/inventory/sources'}).then(function(response) {
                                if (response.items.length) {
                                    store_list = {};
                                    mantis_store_list = [];
                                    $.each(response.items, function(i, value) {
                                        if (value.extension_attributes.increment_prefix && value.extension_attributes.source_type !== 3 && value.enabled) {
                                            let name = value.name;
                                            if (/BCT\d/.test(value.source_code)) name = name.replace(/ \(.+?\)/,'').replace('Bucuresti', 'Bucuresti ' + value.source_code.match(/BCT(\d)/)[1] + ' - ');
                                            store_list[value.extension_attributes.increment_prefix] = {name: name, source_code: value.source_code, address: value.extension_attributes.short_address};
                                            if (value.extension_attributes.nav_location) mantis_store_list.push('OL'+value.extension_attributes.increment_prefix);
                                        }
                                    });
                                    localStorage.setItem('store_list', JSON.stringify(store_list));
                                    localStorage.setItem('mantis_store_list', JSON.stringify(mantis_store_list));
                                    localStorage.setItem('store_list_form_key', $('input[name=form_key]').val());
                                }
                            }).catch(function(e) {
                                alert(e);
                            });
                        }
                    }
                    waitForElm('.page-actions-inner').then((elm) => {
                        elm.prepend(`<div class="nrOL">${elm.data('title')}</div>`);
                    });
                    var modals_change = 1;
                    $(document).on('click auxclick', '#order_edit-lock, #move_order-lock, #order_cancel-lock, #order_reorder-lock,#generate_awb-lock, #billing-address-edit-lock, #shipping-address-edit-lock, #euplatesc-lock, #mobilpay-lock, #ing_webpay-lock, #create_order-lock, #awb_manual-lock', function(event) {
                        if (event.button === 0 || event.button === 1) {
                            if (/order_edit|move_order/.test($(this).attr('id')) && /Cererea de creditare a fost confirmata/gi.test($('.order-payment-method .order-payment-method-details').html())) {
                                let action = 'editată';
                                if (/move_order/.test($(this).attr('id'))) action = 'mutată';
                                if (!confirm(`⚠️ Atenție!\n\nComanda este achitată prin credit bancar și nu ar trebui ${action}!\n\nEști sigur că vrei să continui?`)) return false;
                            }
                            if (/order_edit|move_order|order_reorder|create_order/.test($(this).attr('id')) && GM_getValue('order_in_edit')) {
                                if (!confirm('⚠️ Atenție!\n\nAi deja o comandă în editare!\n\nEști sigur că vrei să continui?')) return false;
                            }
                            var obj = $(this);
                            obj.addClass('disabled');
                            var target_elem = obj.data('target-element');
                            var email = $('.order-account-information-table > tbody > tr:nth-of-type(2) > td > a').text();
                            var user = $('.admin-user-account-text').text();
                            bie_request({url:'/user-actions', method: 'POST', data: {entity_id: email, user: user}}).then(function(response) {
                                if (response.body) {
                                    //exist, add error
                                    var mesaj = `Pentru clientul cu adresa de e-mail ${email} face deja o acțiune <b>${response.body.user}</b>!`;
                                    if ($('#messages').length) $('#messages').html(`<div class="messages"><div class="message message-error error">${mesaj}<a class="do_action">Ignoră și continuă!</a></div></div>`);
                                    else $('.page-main-actions').after(`<div class="messages"><div class="message message-error error">${mesaj}<a class="do_action">Ignoră și continuă!</a></div></div>`);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    $('.do_action').click(function() {
                                        $('#messages').html('');
                                        obj.removeClass('disabled');
                                        $(target_elem)[0].dispatchEvent(new MouseEvent(event.type, {button: event.button}));
                                    });
                                }
                                else {
                                    obj.removeClass('disabled');
                                    $(target_elem)[0].dispatchEvent(new MouseEvent(event.type, {button: event.button}));
                                }
                            }).catch(function(e) {
                                obj.removeClass('disabled');
                                $(target_elem)[0].dispatchEvent(new MouseEvent(event.type, {button: event.button}));
                            });
                            if (/move_order/.test(target_elem)) setTimeout(function() {$('#search_store').trigger('focus');}, 1200);
                            if (/order_edit|move_order|order_cancel|generate_awb/.test(target_elem) && modals_change) {
                                modals_change = 0;
                                GM_addStyle(`.modal-popup .modal-inner-wrap {max-width: 600px;}
                            .modal-inner-wrap:has(#popup-modal-move-order) .admin__fieldset > .admin__field > .admin__field-control {width: 100% !important;}
                            .modal-popup .modal-footer > button:not(.my-button) {display: none;}
                            #order-edit-submit, #order-cancel-submit, #order-move-submit, #generate-awb-submit, #popup-modal-move-order #source-code {display: none !important;}
                            .modal-popup #cancel_form {display: flex; flex-direction: column; gap: 10px;} .modal-popup #edit-comment, .modal-popup #cancel-comment {width: 100% !important; margin-top: 4px;}
                            `);
                                waitForElm('.modal-popup:has(#order-edit-submit)').then((elm) => {
                                    elm.find('#edit-comment').before(`<select class="select" id="edit_comment" style="float:right;">
                                    <option></option>
                                    <option value="Eliminare produs(e)">Eliminare produs(e)</option>
                                    <option value="Adaugare produs(e)">Adaugare produs(e)</option>
                                    <option value="Inlocuire produs(e)">Inlocuire produs(e)</option>
                                    <option value="Modificare cantitate">Modificare cantitate</option>
                                    </select>`);
                                    $('.modal-popup:has(#order-edit-submit) .modal-footer').append(`<button class="my-button" type="button" id="editeaza_comanda"><span>Editeaza comanda</span></button>`);
                                    $('#editeaza_comanda').click(function(e) {
                                        let comment = $('#edit-comment').val().trim() || '';
                                        let status = $('#edit-status').val() || '';
                                        if (!status) alert('Statusul este obligatoriu!');
                                        else if (!comment) alert('Comentariul este obligatoriu!');
                                        else {
                                            let order_id = $('input[name=order_id]').val() || '';
                                            if (order_id) {
                                                let url = `${location.origin}/admin/sales/order_edit/start/order_id/${order_id}/edit_status/${status}/comment/${comment}`;
                                                if (confirm('Ești sigur? Această comandă va fi anulată și va fi creată una nouă.')) {
                                                    $(this).addClass('disabled');
                                                    window.location.href = url;
                                                }
                                            }
                                            else alert('Nu am găsit id-ul comenzii!');
                                        }
                                    });
                                    $('#edit_comment').on('change', function() {
                                        $(this).siblings('#edit-comment').val($(this).val());
                                    });
                                });
                                waitForElm('.modal-popup:has(#order-cancel-submit)').then((elm) => {
                                    $('.modal-popup:has(#order-cancel-submit) .modal-footer').append(`<button class="my-button" type="button" id="anuleaza_comanda"><span>Anuleaza comanda</span></button>`);
                                    $('#anuleaza_comanda').click(function() {
                                        $(this).closest('.modal-popup').find('#order-cancel-submit').first().click();
                                    });
                                });
                                waitForElm('.modal-popup:has(#popup-modal-move-order)').then((elm) => {
                                    var text = '<div class="admin__fieldset tree-source-scope move_order">';
                                    var sorted_store_list = [];
                                    elm.find('#source-code > option').each(function() {
                                        let store_name = $(this).text();
                                        let source_code = $(this).val();
                                        if (/BCT\d/.test(source_code)) store_name = store_name.replace(/ \(.+?\)/,'').replace('Bucuresti', 'Bucuresti ' + source_code.match(/BCT(\d)/)[1] + ' - ');
                                        sorted_store_list.push([source_code, store_name]);
                                    });
                                    sorted_store_list.sort(function(a, b) {
                                        return a[1].localeCompare(b[1]);
                                    });
                                    $.each(sorted_store_list, function(i, value) {
                                        text += `<div class="admin__field field-store_label"><div class="admin__field-control"><div class="nested"><div class="admin__field admin__field-option"><input name="move_order_source" type="radio" value="${value[0]}" id="source_${value[0]}" class="admin__control-radio"><label class="admin__field-label" for="source_${value[0]}" title="${value[0]}">${value[1]}</label></div></div></div></div>`;
                                    });
                                    text += '</div>';
                                    $('#popup-modal-move-order').append(text);
                                    $('#popup-modal-move-order').closest('.modal-popup').find('.modal-title').append('<input class="admin__control-text" type="text" id="search_store" placeholder="Cauta magazinul">');
                                    $('.move_order input').on('change', function() {
                                        let order_id = $('input[name=order_id]').val() || '';
                                        let source_code = $(this).val();
                                        if (order_id) {
                                            let url = `${location.origin}/admin/sales/order_edit/start/order_id/${order_id}/source_code/${source_code}`;
                                            setTimeout(function() {
                                                if (confirm('Ești sigur? Această comandă va fi anulată și va fi creată una nouă.')) {
                                                    $('#popup-modal-move-order').addClass('disabled');
                                                    window.location.href = url;
                                                }
                                            }, 200);
                                        }
                                        else alert('Nu am găsit id-ul comenzii!');
                                    });
                                    $('#search_store').on('keyup', function() {
                                        let text = $(this).val();
                                        if (text == '' || text.length == 0) $('#popup-modal-move-order .field-store_label.d-none').removeClass('d-none');
                                        else {
                                            $('#popup-modal-move-order .field-store_label').addClass('d-none');
                                            $('#popup-modal-move-order .field-store_label:icontains("' + text + '")').removeClass('d-none');
                                        }
                                    });
                                });
                                waitForElm('.modal-popup:has(#popup-modal-generate-awb)').then((elm) => {
                                    $('.modal-popup:has(#popup-modal-generate-awb) .modal-footer').append(`<button class="my-button" type="button" id="genereaza_awb"><span>Genereaza AWB</span></button>`);
                                    $('#genereaza_awb').click(function() { $(this).addClass('disabled').closest('.modal-inner-wrap').find('#generate-awb-submit').first().click();});
                                });
                            }
                        }
                    });
                    $(document).on('mouseup', '.order-addresses .admin__page-section-content .title', function(event) {
                        if (event.button === 0 || event.button === 1) {
                            var link = $(this);
                            link.animate({opacity: 0}, 200, function() {$(this).css('visibility', 'hidden');});
                            store_list_refresh();
                            var store = $('h1.page-title').text().replace('#','').slice(2,4);
                            if (store && store_list[store]) {
                                var adr = $(this).closest('.admin__page-section-item').find('address');
                                var loc = adr.html().split("<br>")[2].split(",")[0].trim().replace(/ /g,"+");
                                var jud = adr.html().split("<br>")[2].split(",")[1].trim().replace(/ /g,"+");
                                var adresa_magazin = store_list[store].address.replace(/ /g,"+");
                                var address_id = $(this).closest('.admin__page-section-item-title').find('.actions > a:nth-of-type(1)').attr('href').replace(/\/$/,'').split('/').slice(-1)[0];
                                var url_maps = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=Dedeman,+${adresa_magazin}&destination=${loc},+${jud}`;
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: location.origin + '/admin/sales/order/address/address_id/' + address_id,
                                    onload: function(xhr) {
                                        link.css('visibility', 'visible').animate({opacity: 1}, 200);
                                        if (xhr.status === 200) {
                                            if (/<form id="edit_form"[^]+?<\/form>/gmi.test(xhr.responseText)) {
                                                var form = $($.parseHTML(xhr.responseText.match(/<form id="edit_form"[^]+?<\/form>/gmi)[0]));
                                                jud = form.find('#region').val();
                                                loc = form.find('#city').val();
                                                var str = form.find('#street0').val() || '';
                                                var str_no = form.find('#street_number').val() || '';
                                                GM_openInTab(`https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=Dedeman,+${adresa_magazin}&destination=strada+${str}+${str_no},+${loc},+${jud}`, {active: !event.button, insert: false});
                                            }
                                            else GM_openInTab(url_maps, {active: !event.button, insert: false});
                                        }
                                        else GM_openInTab(url_maps, {active: !event.button, insert: false});
                                    },
                                    onerror: function() {
                                        link.css('visibility', 'visible').animate({opacity: 1}, 200);
                                        GM_openInTab(url_maps, {active: !event.button, insert: false});
                                    },
                                    timeout: 10000,
                                    ontimeout: function() {
                                        link.css('visibility', 'visible').animate({opacity: 1}, 200);
                                        GM_openInTab(url_maps, {active: !event.button, insert: false});
                                    }
                                });
                            }
                            else alert('Nu am gasit adresa magazinului!');
                        }
                    });
                    $(document).on('click', '.modal-inner-wrap .action-close', function() {
                        var email = $('.order-account-information-table > tbody > tr:nth-of-type(2) > td > a').text();
                        bie_request({url:'/user-actions/'+email, method: 'DELETE'}).then(function(response) {}).catch(function(e) {});
                    });
                    $(document).on('mouseenter', '#order_edit, #move_order, #order_cancel, #order_reorder, #generate_awb, #euplatesc, #mobilpay, #ing_webpay, #awb_manual', function() {
                        $(this).after($(this).clone().attr('id', $(this).attr('id')+'-lock').attr('data-target-element', '#'+$(this).attr('id'))).hide();
                    });
                    $(document).one('mouseenter', '.order-shipping-address .actions > a', function() {
                        $(this).attr('id', 'shipping-address-edit').after($(this).clone().attr('id', 'shipping-address-edit-lock').attr('data-target-element', '#shipping-address-edit').removeAttr('href')).hide();
                    });
                    $(document).one('mouseenter', '.order-billing-address .actions > a', function() {
                        $(this).attr('id', 'billing-address-edit').after($(this).clone().attr('id', 'billing-address-edit-lock').attr('data-target-element', '#billing-address-edit').removeAttr('href')).hide();
                    });
                    $(document).on('mouseenter', '#order_history_block .order-history-comments-actions .action-secondary.action-save.scalable.action-default:not(#trimite_comentariu)', function() {
                        $(this).after($(this).clone().attr('id', 'trimite_comentariu')).remove();
                    });
                    $(document).one('mouseenter', '#create_order', function() {
                        $(this).after($(this).clone().attr('id', $(this).attr('id')+'-lock').attr('data-target-element', '#'+$(this).attr('id')).removeAttr('href')).hide();
                    });
                    $(document).on('click', '#missing-products-block .save, #merchandise-acquisition-block .save', function() {
                        waitForElm($(this).closest('.message-popup:hidden')).then((elm) => {
                            $('#history_comment').trumbowyg('html', $('#history_comment').val());
                        });
                    });
                    var status_curent = '';
                    waitForElm('.order-history-comments-actions').then((elm) => {
                        status_curent = $('#history_status').val();
                        if (sessionStorage.getItem('history_comment')) {
                            $('#history_comment').val(sessionStorage.getItem('history_comment'));
                            $('#history_comment').trumbowyg('html', sessionStorage.getItem('history_comment'));
                            sessionStorage.removeItem('history_comment');
                        }
                        $('.order-history-comments-options input').each(function() {
                            let value = sessionStorage.getItem($(this).attr('id')) || '';
                            if (value) {
                                $(this).prop('checked', (value.toLowerCase() === 'true'));
                                sessionStorage.removeItem($(this).attr('id'));
                            }
                        });
                    });
                    $(document).on('click', '#trimite_comentariu', function() {
                        $(this).addClass('disabled');
                        send_comment();
                    });
                    function send_comment() {
                        var orderId = $("input[name='order_id']").val();
                        var no_of_comments = $('.note-list > li').length;
                        var status_nou = $('#history_status').val();
                        magento_request({api_url:`/rest/V1/orders/${orderId}/statuses`}).then(function(response) {
                            if (response) {
                                var status_db = response;
                                if (status_curent == status_db) {
                                    my_submit_and_reload();
                                }
                                else {
                                    add_style();
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
                            else {
                                my_submit_and_reload();
                            }
                        }).catch(function(e) {
                            my_submit_and_reload();
                        });
                        function my_submit_and_reload() {
                            waitForElm('body > .loading-mask:visible').then((elm) => {
                                waitForElm('body > .loading-mask:hidden').then((elm) => {
                                    if ($('.note-list > li').length == no_of_comments) $('#trimite_comentariu').removeClass('disabled');
                                    else if (status_curent !== status_nou) {
                                        $('body > .loading-mask').show();
                                        location.reload();
                                    }
                                    else comments_actions();
                                });
                            });
                            $('#history_comment').val($('#history_comment').val().replace(/(?:<p><br><\/p>)+$/g,''));
                            submitAndReloadArea($('#order_history_block').parent()[0], `${location.origin}/admin/sales/order/addComment/order_id/${orderId}/administrator/1/`);
                        }
                    }
                    $(document).on('click', '#order_edit-lock, #move_order-lock, #order_reorder-lock, #create_order, #create_order-lock', function() {
                        console.log('submit click');
                        var order_details = {};
                        if ($(this).attr('id') == 'order_edit-lock') order_details = {edit_status: $('#edit-status').val(), edit_comment: $('#edit-comment').val()};
                        var produse = get_products_details();
                        console.log(produse);
                        if (produse.bundle) {
                            let current_orderId = $("input[name='order_id']").val();
                            magento_request({api_url:`/rest/V1/orders/${current_orderId}/`, return_fields: 'items[sku,price]'}).then(function(response) {
                                if (response) {
                                    $.each(response.items, function(i, value) {
                                        if (value.sku.includes('-')) produse[value.sku] = {pret: value.price};
                                    });
                                    if (order_details.produse) {
                                        order_details.produse = produse;
                                        sessionStorage.setItem('order_details', JSON.stringify(order_details));
                                    }
                                }
                            }).catch(function(e) {
                                console.log(e);
                            });
                        }
                        var plata = $('.order-payment-method-title').text().trim();
                        var tip_plata = '—';
                        var id_metoda_plata = '';
                        if (/card|ipay|google|apple/gi.test(plata)) {
                            tip_plata = 'Card bancar';
                            id_metoda_plata = 'adminpayment';
                        }
                        else if (/credit|BT Direct/gi.test(plata)) {
                            tip_plata = 'Credit BT Direct';
                            id_metoda_plata = 'adminpayment';
                        }
                        else if (/ramburs|plat[aă] la livrare/gi.test(plata)) {
                            tip_plata = 'Plată la livrare';
                            id_metoda_plata = 'cashondelivery';
                        }
                        else if (/transfer/gi.test(plata)) {
                            tip_plata = 'Transfer bancar';
                            id_metoda_plata = 'banktransfer';
                        }
                        var comanda_achitata = 0;
                        var cod_plata = '';
                        if (id_metoda_plata == 'adminpayment') {
                            cod_plata = ($('.order-payment-method .order-payment-method-details').html() || '').replace(/<p><strong>Detalii plata:(?:&nbsp;| )*<\/strong><\/p>/g,'').trim();
                            if (/Nu există|RESPINS|UNPAID|nu a fost aprobat/i.test(cod_plata)) cod_plata = '';
                            else if (/ipay|transilvania|star/gi.test(plata) && /[a-z0-9-]{36}/.test(cod_plata)) cod_plata = `<div class="BTRL">${cod_plata}</div>`;
                            else if (/smart|direct/gi.test(plata)) cod_plata = `<div class="smart-bt">${cod_plata}</div>`;
                            else cod_plata = `<div>${cod_plata}</div>`;
                            regExPayments.lastIndex = 0;
                            if ((!regExPayments.test(cod_plata) && !/Cererea de creditare a fost confirmata/gi.test(cod_plata)) && $('#order_history_block .note-list-status:contains(Comanda confirmata)').length) {
                                $('#order_history_block .note-list-item:has(.note-list-status:contains(Comanda confirmata)) > .note-list-comment, #order_history_block .note-list-item:has(.note-list-status:contains(Card - In asteptare confirmare)) > .note-list-comment').each(function() {
                                    var text = $(this).html().replace(/\[AUTOMAT\]|\[CRON\]/g, '').replace(/<br> (?:Email-ul de informare a fost trimis catre:|A fost trimisa notificare pentru comanda catre) .+?@dedeman\.ro/g,'').trim();
                                    regExPayments.lastIndex = 0;
                                    if (regExPayments.test(text) || /Pe tranzacția cu ID tranzacție: \d+ s-a operat capturarea sumei de \d+(\.\d+)? lei de pe cardul clientului\.|Tranzactia [A-Z0-9]{40} APROBATA de euplatesc\.ro/g.test(text)) {
                                        cod_plata = text;
                                        comanda_achitata = 1;
                                        return false;
                                    }
                                });
                            }
                            else if ($('#order_history_block .note-list-status:contains(Comanda confirmata)').length) comanda_achitata = 1;
                        }
                        else if (id_metoda_plata == 'banktransfer') {
                            if ($('#order_history_block .note-list-item:has(.note-list-status:contains(OP - Plata confirmata))').length) {
                                comanda_achitata = 2;
                                cod_plata = $('#order_history_block .note-list-item:has(.note-list-status:contains(OP - Plata confirmata)) > .note-list-comment').first().html().replace(/<br> (?:Email-ul de informare a fost trimis catre:|A fost trimisa notificare pentru comanda catre) .+?@dedeman\.ro/g,'').trim();
                            }
                        }
                        var tip_livrare = '';
                        var text_livrare = $('.order-shipping-method > .admin__page-section-item-content').text();
                        tip_livrare = get_shipping_type(text_livrare);
                        var cost_livrare = Number($('.order-shipping-method > .admin__page-section-item-content .price').text().replace(/ |lei/g,'') || 0);
                        var total_comanda = Number($('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,''));
                        var observatii = '';
                        $('.note-list-item > .note-list-comment > div:contains(OBSERVATII CLIENT)').each(function () {
                            observatii += this.outerHTML;
                        });
                        if (!/edit|move/.test($(this).attr('id'))) {
                            comanda_achitata = 0;
                            cod_plata = '';
                        }
                        var E_alert = 0;
                        if (/edit/.test($(this).attr('id'))) E_alert = 1;
                        order_details = {...order_details, tip_plata: tip_plata, cod_plata: cod_plata, comanda_achitata: comanda_achitata, id_metoda_plata: id_metoda_plata, tip_livrare: tip_livrare, cost_livrare: cost_livrare, total_comanda: total_comanda, produse: produse, observatii: observatii, E_alert: E_alert};
                        if (/create_order/.test($(this).attr('id'))) {
                            let shipping_id = $('.order-shipping-address > .admin__page-section-item-title > .actions > a:first-child').attr('href').replace(/\/$/,'').split('/').slice(-1)[0];
                            let billing_id = $('.order-billing-address > .admin__page-section-item-title > .actions > a:first-child').attr('href').replace(/\/$/,'').split('/').slice(-1)[0];
                            let email = $(this).data('email') || 0;
                            order_details = {...order_details, shipping_id: shipping_id, billing_id: billing_id, email: email};
                        }
                        console.log(order_details);
                        sessionStorage.setItem('order_details', JSON.stringify(order_details));
                    });
                    //de returnat
                    window.addEventListener('load', function() {
                        waitForElm('.order-history-comments-actions > button').then((elm) => {
                            var de_returnat = sessionStorage.getItem('de_returnat');
                            if (de_returnat) {
                                var orderId = $("input[name='order_id']").val();
                                if (de_returnat == '1') de_returnat += ' leu';
                                else de_returnat += ' lei';
                                var mesaj = '<span style="color: blue;">de returnat '+de_returnat+'</span>';
                                if (/transfer/gi.test($('.order-payment-method-title').text())) mesaj = '<span style="color: blue;">de returnat prin OP '+de_returnat+'</span>';
                                $('#history_comment').val(mesaj);
                                $('#history_admin_notify').prop('checked', true);
                                $('#order_history_block')[0].scrollIntoView();
                                var comments = $('.order-comments-history .note-list > .note-list-item').length;
                                console.log('comments = ' + comments);
                                var comments_callback = function(mutationsList, observer) {
                                    if ($('.order-comments-history .note-list > .note-list-item').length > comments) {
                                        console.log('new comments = ' + $('.order-comments-history .note-list > .note-list-item').length);
                                        sessionStorage.removeItem('de_returnat');
                                        comments_observer.disconnect();
                                        comments_actions();
                                    }
                                };
                                var comments_observer = new MutationObserver(comments_callback);
                                comments_observer.observe($('.order-comments-history')[0], { attributes: false, childList: true, subtree: false });
                                submit_comment();
                                function submit_comment() {
                                    try {
                                        // waitForElm('body > .loading-mask:visible').then((elm) => {
                                        //     waitForElm('body > .loading-mask:hidden').then((elm) => {
                                        //         comments_actions();
                                        //         sessionStorage.removeItem('de_returnat');
                                        //         $('#order_history_block')[0].scrollIntoView();
                                        //     });
                                        // });
                                        submitAndReloadArea($('#order_history_block').parent()[0], `${location.origin}/admin/sales/order/addComment/order_id/${orderId}/administrator/1/`);

                                    }
                                    catch(e) {
                                        if (e.message.includes('submitAndReloadArea is not defined')) {
                                            //use worker to make setTimeout run in background tab
                                            var blob = new Blob([`setTimeout(function() { postMessage(''); }, 500);`]);
                                            var worker = new Worker(window.URL.createObjectURL(blob));
                                            worker.onmessage = function() { submit_comment(); }
                                        }
                                    }
                                }
                            }
                        });
                    });
                    //comments actions
                    $(document).on('click', '.copy_all, .copy_msg', function() {
                        let text;
                        if (this.className == 'copy_all') {
                            let li = $(this).closest('li');
                            text = '<blockquote><div>' + li.find('> .note-list-date').text().trim() + ' | ' + li.find('> .note-list-time').text().trim() + ' | <strong>' + li.find('> .note-list-status').text().trim() + '</strong>';
                            li.find('> .note-list-customer').each(function() {
                                text += ' | ' + $(this)[0].firstChild.textContent.trim() + ' <strong>'+ $(this).find('span').text().trim() + '</strong>';
                            });
                            text += '</div><div>' + li.find('> .note-list-comment').html().trim() + '</div></blockquote>';
                            $(this).closest('li').fadeOut().fadeIn();
                        }
                        else {
                            text = $(this).siblings('.note-list-comment').html().replace(/<br> (?:Email-ul de informare a fost trimis catre:|A fost trimisa notificare pentru comanda catre) .+?@dedeman\.ro/g,'').trim();
                            $(this).siblings('.note-list-comment').fadeOut().fadeIn();
                            $(this).fadeOut().fadeIn(function () {$(this).removeAttr('style')});
                        }
                        copy_text(text, text);
                    });
                    function comments_actions() {
                        let nrOL = $('h1.page-title').text().replace('#','');
                        $('#history_comment').trumbowyg(trumbowyg_config).on('tbwpaste', function() { ontbwpaste($(this)) });
                        $('.note-list > .note-list-item > .note-list-comment').before('<span class="copy_all">Copy All</span><span class="copy_msg">Copy Msg</span>');
                        var mesaje_recom = '<div class="dropdown comments"><span>Mesaje CVP</span><div class="dropdown-content comments">';
                        if (!/OLEC|OL39/.test(nrOL)) mesaje_recom += `<span class="mesaje_recom">Verifica stoc</span>`;
                        if (/transfer/gi.test($('.order-payment-method-title').text()) && !/anulata/gi.test($('#order_status').text())) mesaje_recom += `<span class="mesaje_recom">Achitata OP</span>`;
                        else if (/card|apple|google/gi.test($('.order-payment-method-title').text()) && !/anulata/gi.test($('#order_status').text())) mesaje_recom += `<span class="mesaje_recom">Achitata link</span>`;
                        var livrare = $('.order-shipping-method > .admin__page-section-item-content').text();
                        if (/co?urier|dpd|fan|gls/gi.test(livrare) && !/anulata/gi.test($('#order_status').text())) mesaje_recom += `<span class="mesaje_recom">Preluare curier</span>`;
                        else if (/flota|transport/gi.test(livrare) && /facturata/gi.test($('#order_status').text())) mesaje_recom += `<span class="mesaje_recom">Confirmare livrare</span>`;
                        else if (/ridicare/gi.test(livrare) && /facturata/gi.test($('#order_status').text())) mesaje_recom += `<span class="mesaje_recom">Confirmare ridicare marfa</span>`;
                        //dropshipping
                        if (E) {
                            mesaje_recom += `<span class="mesaje_recom">DS - anulata furnizor</span>`;
                            if (!/OLEC/.test(nrOL)) mesaje_recom += `<span class="mesaje_recom">E – livrat in magazin</span>`;
                            if (!/OLEC/.test(nrOL)) mesaje_recom += `<span class="mesaje_recom">TL - eronat in CO</span>`;
                            if (!/OLEC|OL39/.test(nrOL)) {
                                mesaje_recom += `<span class="mesaje_recom">Furnizori XD</span>`;
                                mesaje_recom += `<span class="mesaje_recom">Refuz anulare - FNZ Intern</span>`;
                                mesaje_recom += `<span class="mesaje_recom">Refuz anulare - FNZ Extern</span>`;
                            }
                            if (/OL39/.test(nrOL)) {
                                mesaje_recom += `<span class="mesaje_recom fara_notificare">Update furnizor</span>`;
                                mesaje_recom += `<span class="mesaje_recom fara_notificare">Stadiu livrare fz</span>`;
                                mesaje_recom += `<span class="mesaje_recom fara_notificare">Receptie</span>`;
                            }
                            else if (/OLEC/.test(nrOL)) {
                                mesaje_recom += `<span class="mesaje_recom fara_notificare">Urgentare predare fz</span>`;
                                mesaje_recom += `<span class="mesaje_recom fara_notificare">Urgentare livrare</span>`;
                                mesaje_recom += `<span class="mesaje_recom fara_notificare">Urgentare ridicare</span>`;
                            }
                        }
                        mesaje_recom += `</div></div>`;
                        var mesaje_client = `<div class="dropdown comments"><span>Mesaje client</span><div class="dropdown-content comments">`;
                        mesaje_client += `<span class="mesaje_client">Informatii modificate</span>`;
                        if (/anulata/gi.test($('#order_status').text())) mesaje_client += '<span class="mesaje_client">Comanda anulata</span>';
                        else if (!/anulata|finalizata/gi.test($('#order_status').text()) && /co?urier|dpd|fan|gls/gi.test(livrare)) {
                            mesaje_client += '<span class="mesaje_client">Numar de telefon</span>';
                            mesaje_client += '<span class="mesaje_client">Adresa de livrare</span>';
                            mesaje_client += '<span class="mesaje_client">TL depasit</span>';
                            if (/fan/gi.test(livrare)) mesaje_client += '<span class="mesaje_client">Ridicare sediu FAN</span>';
                            if (/fanbox/gi.test(livrare)) {
                                mesaje_client += '<span class="mesaje_client">Locker FAN - depasit</span>';
                                mesaje_client += '<span class="mesaje_client">Locker FAN - plin</span>';
                                mesaje_client += '<span class="mesaje_client">Locker FAN - livrat</span>';
                            }
                            if (/GLS Locker/gi.test(livrare)) mesaje_client += '<span class="mesaje_client">Locker GLS - livrat</span>';
                        }
                        mesaje_client += '</div></div>';
                        var op_actions = '';
                        if (/transfer/gi.test($('.order-payment-method-title').text()) && op_users.includes($('.admin-user-account-text').text())) op_actions = `<div id="get_op" style="float: right; cursor: pointer; margin-left: 10px;">Preia încasare</div>`;
                        var retur_actions = '';
                        if (/card|apple|google/gi.test($('.order-payment-method-title').text()) && retur_users.includes($('.admin-user-account-text').text())) retur_actions = `<div class="dropdown comments"><span>Retur tranzactie</span><div class="dropdown-content comments retur">
                        <span class="retur" data-tip-returnare="totala" data-procesator="ING WebPay">Retur total ING</span>
                        <span class="retur" data-tip-returnare="partiala" data-procesator="ING WebPay">Retur partial ING</span>
                        <span class="retur" data-tip-returnare="totala" data-procesator="EuPlatesc">Retur total EuPlatesc</span>
                        <span class="retur" data-tip-returnare="partiala" data-procesator="EuPlatesc">Retur partial EuPlatesc</span>
                        <span class="retur" data-tip-returnare="totala" data-procesator="MobilPay">Retur total Mobilpay</span>
                        <span class="retur" data-tip-returnare="partiala" data-procesator="MobilPay">Retur partial Mobilpay</span>
                        <span class="retur" data-tip-returnare="totala" data-procesator="BT iPay">Retur total BT iPay</span>
                        <span class="retur" data-tip-returnare="partiala" data-procesator="BT iPay">Retur partial BT iPay</span>
                        </div></div>`;
                        $('#history_form label[for=history_comment]').after(mesaje_recom + mesaje_client + op_actions + retur_actions);
                        //add order history status
                        if (!/anulata|blocata/gi.test($('#order_status').text())) {
                            if ($('#history_status').val() != 'pending_payment' && $('#history_status').val() != 'probleme_card' && $('#history_status').val() != 'pending_client') {
                                if (/card|google|apple|credit/gi.test($('.order-payment-method-title').text())) add_order_status('pending_payment', 'Card - In asteptare confirmare - Script');
                                if ($('#history_status').val() == 'confirmata') add_order_status('alocata', 'Comanda alocata - Script');
                                else if ($('.note-list-status:contains("Comanda alocata")').length) {
                                    if (/transfer/gi.test($('.order-payment-method-title').text())) {
                                        add_order_status('plata_op_confirmata', 'OP - Plata confirmata - Script');
                                        add_order_status('confirmare_plata', 'In asteptare - Confirmare plata - Script');
                                    }
                                    add_order_status('confirmata', 'Comanda confirmata - Script');
                                    var tip_livrare = '';
                                    var text_livrare = $('.order-shipping-method .admin__page-section-item-content').text();
                                    if (/flota|voluminoase|grele/gmi.test(text_livrare)) tip_livrare = 'livrare_flota_ddm';
                                    else if (/rezervare|ridicare/gmi.test(text_livrare)) tip_livrare = 'livrare_magazin';
                                    else if (/dpd|fan|cargus|gls|co?urier/gmi.test(text_livrare)) tip_livrare = 'livrare_curier';
                                    if (tip_livrare) add_order_status(tip_livrare, 'Pregatire marfa - Script');
                                    add_order_status('comanda_facturata', 'Comanda facturata - Script');
                                    add_order_status('comanda_finalizata', 'Comanda finalizata - Script');
                                }
                                add_order_status('confirmata', 'Comanda confirmata - Script');
                            }
                            else add_order_status('confirmata', 'Comanda confirmata - Script');
                            add_order_status('anulata_comanda_refacuta', 'Anulata - Comanda refacuta - Script');
                            add_order_status('anulata_date_invalide', 'Anulata - Date incomplete - Script');
                        }
                        if (!/blocata/gi.test($('#order_status').text())) add_order_status('comanda_finalizata', 'Comanda finalizata - Script');
                    }
                    function add_order_status(status, status_text) {
                        if ( $("#history_status option[value='"+status+"']").length == 0 ) {
                            $("#history_status").append('<option value="'+status+'">'+status_text+'</option>');
                        }
                    }
                    var detalii_op = JSON.parse(getCookie('incasare') || '{}');
                    $(document).on('click', '#get_op', function() {
                        $(this).fadeOut().fadeIn();
                        get_op();
                    });
                    function get_op() {
                        detalii_op = JSON.parse(getCookie('incasare') || '{}');
                        $('#mesaje_op').remove();
                        if (detalii_op.op) {
                            $('#history_form > .admin__field:eq(1)').append(`<div id="mesaje_op" style="color: red;"></div>`);
                            var text = '<div style="color: blue;">'+detalii_op.op+'</div>';
                            $('#history_comment').val(text);
                            $('#history_comment').trumbowyg('html', text);
                            var total_comanda = Number($('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,''));
                            if (detalii_op.suma - total_comanda > 1) $('#mesaje_op').append('<div>Achitat in plus '+(detalii_op.suma - total_comanda).toLocaleString('ro-RO', {maximumFractionDigits: 2})+' lei!</div>');
                            else if (total_comanda - detalii_op.suma > 1) $('#mesaje_op').append('<div>Achitat mai putin cu '+(total_comanda - detalii_op.suma).toLocaleString('ro-RO', {maximumFractionDigits: 2})+' lei!</div>');
                            if ($('#order_status').text() == 'In asteptare - Confirmare plata' || $('#order_status').text() == 'OP platit - neconfirmat de Contabilitate') {
                                if (!$("#history_status option[value='plata_op_confirmata']").length) {
                                    $("#history_status").append('<option value="plata_op_confirmata">OP - Plata confirmata - Script</option>');
                                }
                                $('#history_status').val('plata_op_confirmata');
                            }
                            else $('#mesaje_op').append('<div>Conform status, plata nu poate fi confirmata!</div>');
                            var cif_comanda = ($('.order-billing-address em').text() || '0').trim();
                            if (/^(?:ro {0,})?\d+$/gi.test(cif_comanda)) cif_comanda = cif_comanda.match(/\d+/)[0];
                            var cif_incasare = '0';
                            var op_for_cif = detalii_op.op.replace(/ /g,'');
                            if (/CODFISC(R|RO)?\d{2,}/gmi.test(op_for_cif)) {
                                cif_incasare = /CODFISC(R|RO)?\d{2,}/gmi.exec(op_for_cif)[0].replace(/[A-Z]/gi,'');
                                if (cif_incasare == '2816464') cif_incasare = '0';
                            }
                            if (cif_comanda !== cif_incasare) $('#mesaje_op').append(`<div>CIF comanda (${cif_comanda}) diferit de CIF incasare (${cif_incasare})!</div>`);
                            if ($('#mesaje_op').children().length == 0) $('#mesaje_op').append('<div style="color:green;">Plata poate fi confirmata!</div>');
                        }

                    }
                    $(document).on('click', '.mesaje_client, .mesaje_recom', function() {
                        var obj_parent = $(this).parent();
                        obj_parent.fadeOut(100);
                        setTimeout(function() {obj_parent.removeAttr('style')}, 200);
                        var text = '';
                        console.log(this.className);
                        if (this.className == 'mesaje_client') {
                            var nrOL = $('h1.page-title').text().replace('#','');
                            if ($(this).text() == "Informatii modificate") {
                                text = 'Informatiile din comanda au fost modificate conform solicitarii.';
                                if (nrOL) text = `Informatiile din comanda online cu numarul ${nrOL} au fost modificate conform solicitarii.`;
                            }
                            else if ($(this).text() == "Comanda anulata") {
                                text = 'Ca urmare a solicitarii dumneavoastra, comanda online a fost anulata.';
                                if (nrOL) text = `Ca urmare a solicitarii dumneavoastra, comanda online cu numarul ${nrOL} a fost anulata.`;
                            }
                            else if ($(this).text() == "Numar de telefon") text = 'Curierul a incercat sa va livreze coletul dar nu a reusit, statusul actual al AWB-ului fiind: „Destinatar absent, NU RASPUNDE”. Va rugam sa verificati daca numarul de telefon din comanda este corect/complet.';
                            else if ($(this).text() == "Adresa de livrare") text = 'Curierul a incercat sa va livreze coletul dar nu a reusit, statusul actual al AWB-ului fiind „Adresa gresita”. Va rugam sa verificati daca adresa de livrare si numarul de telefon din comanda sunt corecte/complete.';
                            else if ($(this).text() == "TL depasit") text = 'Iti multumim pentru interesul acordat produselor si serviciilor oferite de catre compania Dedeman. Intelegem cat de important este sa primesti produsul comandat la timp si regretam orice neplaceri cauzate de aceasta intarziere. Te asiguram ca facem tot posibilul pentru a finaliza procesarea comenzii tale si ca aceasta va fi livrata cat de curand posibil. Iti multumim pentru intelegere!';
                            else if ($(this).text() == "Ridicare sediu FAN") text = 'Curierul a incercat sa iti livreze coletul, dar nu a reusit. Expedierea ta este pregatita pentru a fi ridicata din sediul Fan Courier. In cazul in care nu ai solicitat ridicarea din oficiul Fan Courier, te rugam sa ne comunici pentru a putea cere firmei de curierat o noua livrare in adresa.';
                            else if ($(this).text() == "Locker FAN - depasit") text = 'Dorim sa te informam ca cei de la FAN Courier ne-au transmis o semnalare in care specifica faptul ca expeditia ta poate fi ridicata din sediul FAN Courier (motiv: dimensiune caseta FANBox depasita). Pentru a solicita livrarea la adresa mentionata folosita la plasarea comenzii online te rugam sa ne contactezi.';
                            else if ($(this).text() == "Locker FAN - plin") text = 'Dorim sa te informam ca cei de la FAN Courier ne-au transmis o semnalare in care specifica faptul ca expeditia ta poate fi ridicata din sediul FAN Courier (motiv: Fanbox plin). Pentru a solicita livrarea la adresa mentionata folosita la plasarea comenzii online te rugam sa ne contactezi.';
                            else if ($(this).text() == "Locker FAN - livrat" || $(this).text() == "Locker GLS - livrat") {
                                let locker_name = $('.order-shipping-method > .admin__page-section-item-content > strong > div:nth-of-type(1)').text() || '';
                                if (locker_name) locker_name = ` (${locker_name})`;
                                let courier_name = 'FAN Courier';
                                if ($(this).text() == "Locker GLS - livrat") courier_name = 'GLS';
                                let awbs = get_awbs();
                                let livrat_locker_date;
                                $.each(awbs, function(i, awb) {
                                    if (sessionStorage.getItem(awb)) {
                                        var detalii_awb = JSON.parse(sessionStorage.getItem(awb));
                                        console.log(detalii_awb);
                                        if (detalii_awb) {
                                            if (regExFAN.test(awb)) {
                                                const obj = detalii_awb.data[0];
                                                const event_livrat_locker = obj.events?.filter(e => e.id === "S46")?.pop();
                                                if (event_livrat_locker) {
                                                    livrat_locker_date = new Date(event_livrat_locker.date).toLocaleString('ro');
                                                    return false;
                                                }
                                            }
                                            else if (regExGLS.test(awb)) {
                                                const event_livrat_locker = detalii_awb.ParcelStatusList?.filter(e => e.StatusCode === "54")?.pop(); // ia ultimul event
                                                if (event_livrat_locker) {
                                                    let time = event_livrat_locker.StatusDate.replace(/\/Date\(|\)\//g,'');
                                                    let ms = Number(time.slice(0,13));
                                                    let offset = time.slice(-5);
                                                    livrat_locker_date = new Date(ms).toLocaleString('ro', { timeZone: offset });
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                });
                                let livrat_locker_text = livrat_locker_date ? ` Coletul a fost livrat in locker inca din data de ${livrat_locker_date}.` : '';
                                text = `Dorim sa te anuntam faptul ca cei de la firma de curierat ${courier_name} ne-au transmis ca expeditia ta poate fi ridicata din locker-ul ales la plasarea comenzii online${locker_name}.${livrat_locker_text}`;
                            }
                        }
                        else if (/mesaje_recom/.test(this.className)) {
                            if ($(this).text() == "Verifica stoc") {
                                if ($('.edit-order-table > tbody').length > 1) text = 'Va rog sa verificati daca aveti produsele in stoc pentru a putea trimite link-ul de plata! In caz contrar, va rog sa informati clientul.<br>\nMultumesc!';
                                else text = 'Va rog sa verificati daca aveti produsul in stoc pentru a putea trimite link-ul de plata! In caz contrar, va rog sa informati clientul.<br>\nMultumesc!';
                            }
                            else if ($(this).text() == "Achitata link") text = 'Comanda este achitata, se poate procesa. Multumesc!';
                            else if ($(this).text() == "Achitata OP") text = '<span style="color: red;">Va rog sa anuntati cand se poate confirma incasarea, comanda este achitata deja!<br>\nMultumesc!</span>';
                            else if ($(this).text() == "Preluare curier") text = 'Va rog sa va asigurati ca astazi, sau cel tarziu maine, acest colet este preluat de curier.<br>\nMultumesc!';
                            else if ($(this).text() == "Confirmare livrare") text = 'Va rog sa ne confirmati daca aceasta comanda a fost livrata (complet) la adresa clientului.<br>\nDaca da, va rog sa finalizati comanda.<br>\nMultumesc!';
                            else if ($(this).text() == "Confirmare ridicare marfa") text = 'Va rog sa ne confirmati daca aceasta comanda a fost ridicata de catre client.<br>\nDaca da, va rog sa finalizati comanda.<br>\nMultumesc!';
                            else if ($(this).text() == "DS - anulata furnizor") {
                                if (E == 1) text = 'S-a solicitat anularea comenzii de la furnizor, pentru produsul cu status E.<br>\nO zi buna!';
                                else text = 'S-a solicitat anularea comenzii de la furnizor, pentru produsele cu status E.<br>\nO zi buna!';
                            }
                            else if ($(this).text() == "E – livrat in magazin") {
                                if (E == 1) text = 'Produsul cu status E a ajuns in stoc. Va rog sa procesati comanda cu prioritate.<br>\nMultumesc!';
                                else text = 'Toate produsele cu status E au ajuns in stoc. Va rog sa procesati comanda cu prioritate.<br>\nMultumesc!';
                            }
                            else if ($(this).text() == "TL - eronat in CO") {
                                if (/ridicare/gi.test($('.order-shipping-method > .admin__page-section-item-content').text())) text = 'Din cauza unei erori de sistem, termenul de ridicare marfa din comanda a fost calculat gresit.<br>\nTermenul de ridicare marfa corect este de X zile lucratoare.<br>\nVa rog sa verificati cu clientul daca este de acord sa astepte aprovizionarea.<br>\nMultumesc!';
                                else text = 'Din cauza unei erori de sistem, termenul de livrare din comanda a fost calculat gresit.<br>\nTermenul de livrare corect este de X zile lucratoare.<br>\nVa rog sa verificati cu clientul daca este de acord sa astepte aprovizionarea.<br>\nMultumesc!';
                            }
                            else if ($(this).text() == "Furnizori XD") text = 'Conform celor transmise de catre furnizor, comanda pentru produsul cu status E a fost livrata in Logistica.<br>\nRugam ca seful de raion sa ia legatura cu Logistica pentru urmarirea livrarii comenzii la magazin.<br>\nDaca survine vreo intarziere, va rugam sa informati clientul.<br>\nMultumesc!';
                            else if ($(this).text() == "Refuz anulare - FNZ Intern") text = 'Comanda furnizor (produse status E) nu a putut fi anulata.<br>\nSe recomanda pastrarea produsului la raion, sau returul produsului inapoi la furnizor.<br>\nMultumesc!';
                            else if ($(this).text() == "Refuz anulare - FNZ Extern") text = 'Comanda furnizor (produse status E) nu a putut fi anulata.<br>\nPentru produsele cu status E livrate de catre furnizorii externi, nu se poate efectua returul acestora. Produsele se scot la vanzare pe raion.<br>\nMultumesc!';
                            else if ($(this).text() == "Update furnizor") text = '<b>UPDATE FURNIZOR</b>: ""';
                            else if ($(this).text() == "Stadiu livrare fz") text = 'Am solicitat furnizorului informatii despre stadiul de livrare al produsului catre depozitul online. Dupa ce primim raspuns, vom informa clientul.';
                            else if ($(this).text() == "Receptie") text = 'Produsul a fost livrat in depozitul online. Am rugat colegii din receptie sa faca intrarea produsului in sistem pentru a factura comanda online cat mai rapid.';
                            else if ($(this).text() == "Urgentare predare fz") text = 'Am solicitat furnizorului urgentarea predarii coletului firmei de curierat.';
                            else if ($(this).text() == "Urgentare livrare") text = 'Am solicitat firmei de curierat urgentarea livrarii coletului in adresa clientului.';
                            else if ($(this).text() == "Urgentare ridicare") text = 'Am solicitat firmei de curierat urgentarea ridicarii coletului din depozitul furnizorului.';
                        }
                        if (text) {
                            $('#history_comment').trumbowyg('html', text);
                            $('.order-history-comments-options input:checked').prop('checked', false);
                            if (this.className == 'mesaje_client') $('#history_notify').prop('checked', true);
                            else if (this.className == 'mesaje_recom') $('#history_recom_notify').prop('checked', true);
                        }
                    });
                    var E = 0;
                    $(document).ready(function() {
                        //stilizare plata credit
                        if (/smart|direct/gi.test($('.order-payment-method-title').text()) && location.hostname === 'www.dedeman.ro') $('.order-payment-method-title').addClass('super-highlight');
                        //de verificat anularea comenzii anterioare
                        let previous_order_details = JSON.parse(sessionStorage.getItem('de_verificat_anularea_comenzii') || '{}');
                        console.log(previous_order_details);
                        if (previous_order_details.orderId) {
                            magento_request({api_url:`/rest/V1/orders/${previous_order_details.orderId}/statuses`}).then(function(status_comanda) {
                                if (status_comanda && !/anulata/gi.test(status_comanda)) {
                                    add_style();
                                    $.alert({
                                        title: 'Comanda initiala nu a fost anulata!',
                                        content: '',
                                        type: 'red',
                                        theme: 'light,my_alert'
                                    });
                                }
                            }).catch(function(e) {console.log(e);});
                            sessionStorage.removeItem('de_verificat_anularea_comenzii');
                        }
                        var nrOL = $('h1.page-title').text().replace('#','');
                        if (nrOL == detalii_op.nr_ol) get_op();
                        $(document).on('click', '#trimite_comentariu', function() {
                            if ($('#history_status').val() == 'plata_op_confirmata') {
                                document.cookie = "incasare=0; domain=dedeman.ro; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                                document.cookie = `incasare_ok={"op_id":"${detalii_op.op_id}", "data":{"status":"success","order":"${nrOL}"}}; domain=dedeman.ro; path=/`;
                            }
                        });
                        $('.order-view-account-information .order-information span.title > span').html($('.order-view-account-information .order-information span.title > span').html().replace('de confirmare a comenzii ', '').replace('Email-ul', 'E-mailul'));
                        var raw_content = '',
                            pretty_content = '',
                            raspuns_api_facturare = {};
                        function formatXml(xml) {
                            xml = xml.replace(/(\r\n|\n|\r)/gm, " ").replace(/>\s+</g,'><');
                            const PADDING = ' '.repeat(4);
                            const reg = /(>)(<)(\/*)/g;
                            let pad = 0;
                            xml = xml.replace(reg, '$1\r\n$2$3');
                            return xml.split('\r\n').map((node, index) => {
                                let indent = 0;
                                if (node.match(/.+<\/\w[^>]*>$/)) indent = 0;
                                else if (node.match(/^<\/\w/) && pad > 0) pad -= 1;
                                else if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent = 1;
                                else indent = 0;
                                pad += indent;
                                return PADDING.repeat(pad - indent) + node;
                            }).join('\r\n');
                        }
                        $('#sales_order_view_tabs > ul').append('<li class="admin__page-nav-item ui-state-default ui-corner-top"><a id="verifica_api_facturare" style="cursor: pointer;" class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Verifica API facturare M2</span></a></li>');
                        let segment = nrOL.substring(0, 4);
                        if (mantis_store_list.includes(segment)) $('#sales_order_view_tabs > ul').append('<li class="admin__page-nav-item ui-state-default ui-corner-top"><a id="verifica_status_facturare" style="cursor: pointer;" class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Verifica status facturare LS</span></a></li>');
                        $(document).on('mouseup', '#verifica_status_facturare',function(event) {
                            add_style();
                            if (event.button === 0 || event.button === 1) {
                                let LS_url = 'dws/nav/ordv3/prod';
                                if (!/www\.dedeman\.ro/.test(location.href)) LS_url = 'dws/nav/ordv3/test';
                                let raspuns_LS = $.confirm({
                                    columnClass: '',
                                    title: `Verificare status facturare - ${nrOL}`,
                                    content: 'Loading...',
                                    type: 'blue',
                                    closeIcon: true,
                                    buttons:false,
                                    theme: 'light, my_confirm',
                                    onOpenBefore: function () {
                                        raspuns_LS.showLoading();
                                        sap_request({url:`${LS_url}?doc=${nrOL}&action=read`, method: 'GET'}).then(function(response) {
                                            let content;
                                            let log;
                                            if (response.error) {
                                                content = 'Comanda nu a fost inserata in LS Retail pentru a fi facturata!';
                                                raspuns_LS.buttons.SendToLS.show();
                                            }
                                            else if (response.Read_Result.MagentoOrderList.Invoice_No) {
                                                content = `Comanda are emisa factura cu numarul <b id="invoice_number">${response.Read_Result.MagentoOrderList.Invoice_No}</b> in data de ${new Date(response.Read_Result.MagentoOrderList.Processing_DateTime).toLocaleString('ro')}!`;
                                                if ($(`.note-list-comment:contains("[AUTOMAT] Comanda a fost facturata. Numar referinta: ${response.Read_Result.MagentoOrderList.Invoice_No}")`).length == 0) raspuns_LS.buttons.SaveInvoice.show();
                                            }
                                            else if (response.Read_Result.MagentoOrderList.Processed) {
                                                log = response.Read_Result.MagentoOrderList.Log_Message || '';
                                                if (log) log = '<br>Mesaj LS: '+log;
                                                content = `Comanda apare ca fiind procesata de LS in data de ${new Date(response.Read_Result.MagentoOrderList.Processing_DateTime).toLocaleString('ro')} dar nu exista o factura emisa!${log}`;
                                            }
                                            else {
                                                log = response.Read_Result.MagentoOrderList.Log_Message || '';
                                                if (log) log = '<br>Mesaj LS: '+log;
                                                content = `Comanda a fost inserata in LS Retail dar nu a fost facturata inca!${log}`;
                                            }
                                            raspuns_LS.setContent(content);
                                            raspuns_LS.hideLoading();
                                        }).catch(function(e) {
                                            raspuns_LS.setContent(e);
                                        });
                                    },
                                    buttons: {
                                        SaveInvoice: {
                                            text: "Asociaza factura",
                                            btnClass: 'btn-blue',
                                            isHidden: true,
                                            action: function () {
                                                let invoice_number = this.$content.find('#invoice_number').text();
                                                if (invoice_number) {
                                                    raspuns_LS.showLoading();
                                                    sap_request({url:`dws/nav/factura/prod/?doc=${invoice_number}&type=invoice`, method: 'GET'}).then(function(response) {
                                                        if (response.efactura) {
                                                            if (nrOL == response.efactura.Magento_No) {
                                                                xapi_request({params: `nr_comanda_online=${nrOL}&doc=${invoice_number}`, method: 'POST'}).then(function(response) {
                                                                    try {
                                                                        var xml = response,
                                                                            xmlDoc = $.parseXML(xml),
                                                                            $xml = $(xmlDoc);
                                                                        if ($xml.find("SUCCESS_MESSAGE").length) {
                                                                            $.alert({
                                                                                title: '',
                                                                                content: 'Factura a fost asociata cu succes!',
                                                                                type: 'green',
                                                                                theme: 'light,my_alert',
                                                                                onDestroy: function () {
                                                                                    raspuns_LS.close();
                                                                                    location.reload();
                                                                                }
                                                                            });
                                                                        }
                                                                        else if ($xml.find("ERROR_MESSAGE").length) {
                                                                            $.alert({
                                                                                title: 'Eroare!',
                                                                                content: $xml.find("ERROR_MESSAGE").html(),
                                                                                type: 'red',
                                                                                theme: 'light,my_alert',
                                                                                onDestroy: function () {
                                                                                    raspuns_LS.close();
                                                                                    location.reload();
                                                                                }
                                                                            });
                                                                        }
                                                                    } catch(err) {
                                                                        $.alert({
                                                                            title: 'Eroare!',
                                                                            content: err,
                                                                            type: 'red',
                                                                            theme: 'light,my_alert',
                                                                            onDestroy: function () {raspuns_LS.close();}
                                                                        });
                                                                    }
                                                                }).catch(function(e) {
                                                                    $.alert({
                                                                        title: 'Eroare!',
                                                                        content: e,
                                                                        type: 'red',
                                                                        theme: 'light,my_alert',
                                                                        onDestroy: function () {raspuns_LS.close();}
                                                                    });
                                                                });
                                                            }
                                                            else {
                                                                $.alert({
                                                                    title: 'Factura nu este pentru aceasta comanda!',
                                                                    content: '',
                                                                    type: 'red',
                                                                    theme: 'light,my_alert',
                                                                    onDestroy: function () {raspuns_LS.close();}
                                                                });
                                                            }
                                                        }
                                                        else if (response.error.message) {
                                                            $.alert({
                                                                title: 'Eroare!',
                                                                content: response.error.message,
                                                                type: 'red',
                                                                theme: 'light,my_alert',
                                                                onDestroy: function () {raspuns_LS.close();}
                                                            });
                                                        }
                                                    }).catch(function(e) {
                                                        $.alert({
                                                            title: 'Eroare!',
                                                            content: e,
                                                            type: 'red',
                                                            theme: 'light,my_alert',
                                                            onDestroy: function () {raspuns_LS.close();}
                                                        });
                                                    });
                                                    return false;
                                                }
                                                else {
                                                    $.alert({
                                                        title: 'Eroare!',
                                                        content: 'Nu am gasit numarul facturii!',
                                                        type: 'red',
                                                        theme: 'light,my_alert',
                                                        onDestroy: function () {raspuns_LS.close();}
                                                    });
                                                }
                                            }
                                        },
                                        SendToLS: {
                                            text: "Insereaza comanda in LS",
                                            btnClass: 'btn-blue',
                                            isHidden: true,
                                            action: function () {
                                                raspuns_LS.showLoading();
                                                sap_request({url:`${LS_url}?doc=${nrOL}&action=create`, method: 'GET'}).then(function(response) {
                                                    if (response.error?.message) {
                                                        $.alert({
                                                            title: 'Eroare!',
                                                            content: response.error.message,
                                                            type: 'red',
                                                            theme: 'light,my_alert',
                                                            onDestroy: function () {raspuns_LS.close();}
                                                        });
                                                    }
                                                    else {
                                                        $.alert({
                                                            title: '',
                                                            content: 'Comanda a fost inserata in LS cu succes!',
                                                            type: 'green',
                                                            theme: 'light,my_alert',
                                                            onDestroy: function () {raspuns_LS.close();}
                                                        });
                                                    }
                                                }).catch(function(e) {
                                                    $.alert({
                                                        title: 'Eroare!',
                                                        content: e,
                                                        type: 'red',
                                                        theme: 'light,my_alert',
                                                        onDestroy: function () {raspuns_LS.close();}
                                                    });
                                                });
                                                return false;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                        $(document).on('click', '.button-switch',function() {
                            if ($(this).html() == 'Varianta RAW') {
                                $(this).html('Varianta pretty');
                                var raw_content_escaped = (formatXml(raw_content)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');
                                raspuns_api_facturare.setContent(raw_content_escaped);
                            }
                            else {
                                $(this).html('Varianta RAW');
                                raspuns_api_facturare.setContent(pretty_content);
                            }
                        });
                        $(document).on('mouseup', '#verifica_api_facturare',function(event) {
                            add_style();
                            if (event.button === 0 || event.button === 1) {
                                var params = 'nr_comanda_online=' + nrOL;
                                if (event.button == 1) params+= '&bypass_order_status=true';
                                raspuns_api_facturare = $.confirm({
                                    columnClass: '',
                                    title: 'Raspuns API facturare',
                                    content: `<div style="padding: 10px;font-size: 14px;">Loading...</div>`,
                                    type: 'blue',
                                    closeIcon: true,
                                    buttons:false,
                                    theme: 'light,api_facturare'
                                });
                                raw_content = '';
                                pretty_content = '';
                                xapi_request({params: params, method: 'GET'}).then(function(response) {
                                    raw_content = response;
                                    if (raw_content !== 'An error has occurred, please try again later') {
                                        try {
                                            var xml = response,
                                                xmlDoc = $.parseXML(xml),
                                                $xml = $(xmlDoc);
                                            if ($xml.find("HEADER").length) {
                                                var header = $xml.find("HEADER");
                                                pretty_content = '<table id="raspuns_api_facturare">';
                                                header.children().each(function() {
                                                    pretty_content += '<tbody><tr><td>' + this.nodeName + '</td><td>' + this.textContent + '</td></tr></tbody>';
                                                });
                                                pretty_content += '</table>';
                                                if ($xml.find("item").length) {
                                                    pretty_content += '<table id="raspuns_api_facturare"><tbody class="tbl-current"><tr><td>LINE</td><td>SKU</td><td>PRODUCT_DESCRIPTION</td><td>UNIT</td><td>PRICE_UNIT</td><td>QUANTITY</td><td>TOTAL</td></tr></tbody>';
                                                    var items = $xml.find("item");
                                                    $.each(items, function(i, elem) {
                                                        pretty_content += '<tbody><tr><td>' + $(elem).find('LINE_NUMBER').text() + '</td><td>' + $(elem).find('SAP_PRODUCT_CODE').text() + '</td><td>' + $(elem).find('PRODUCT_DESCRIPTION').text() + '</td><td>' + $(elem).find('UNITS').text() + '</td><td>' + Number($(elem).find('PRICE_UNIT').text()).toLocaleString('ro-RO') + '</td><td>' + Number($(elem).find('QUANTITY').text()).toLocaleString('ro-RO') + '</td><td>' + Number($(elem).find('TOT_W_AD_W_VAT').text()).toLocaleString('ro-RO') + '</td></tr></tbody>';
                                                    });
                                                    pretty_content += '</table>';
                                                }
                                            }
                                            else if ($xml.find("ERROR_MESSAGE").length) {
                                                pretty_content = '<div style="padding: 10px;font-size: 14px;"><span style="color: red;">Eroare: </span>' + $xml.find("ERROR_MESSAGE").text() + '</div>';
                                            }
                                        }
                                        catch(err) {
                                            pretty_content = '<div style="padding: 10px;font-size: 14px;"><span style="color: red;">Eroare: </span>XML invalid</div>';
                                        }
                                    }
                                    if (pretty_content) {
                                        raspuns_api_facturare.setContent(pretty_content);
                                        raspuns_api_facturare.setTitle('Raspuns API facturare | <span class="button-switch">Varianta RAW</span>');
                                    }
                                    else {
                                        raspuns_api_facturare.setContent(raw_content);
                                    }
                                }).catch(function(e) {
                                    raspuns_api_facturare.setContent(`<div style="padding: 10px;font-size: 14px;">${e}</div>`);
                                });
                            }
                        });
                        $('.edit-order-table > tbody > tr > .col-status').each(function() {
                            if ($(this).text().trim() == 'E') E = E + 1;
                        });
                        if (E) {
                            $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="search_drop"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Cauta comanda dropshipping</span></a></li>`);
                            $('#search_drop').on('mouseup', function(event) {
                                if (event.button === 0 || event.button === 1) GM_openInTab('https://bie2.dedeman.ro/aplicatii/comenzi-dropshipping?incrementId='+$('h1.page-title').text().replace('#',''),{active: !event.button, insert: false});
                            });
                        }
                        comments_actions();
                        $('address').each(function() {
                            let phone = $(this).find('i');
                            if (/^\d{10}$/.test(phone.text())) phone.html(phone.text().replace(/(\d{4})(\d{3})(\d{3})/g, '<span>$1</span><span style="margin-left: 6px;">$2</span><span style="margin-left: 6px;">$3</span>'));
                        });
                        $('.order-billing-address em').after('<a id="cif_anaf">CIF ANAF</a><a id="cif_mfinante">CIF mFinante</a><a id="cif_ERP">CIF ERP</a>');
                        $('#cif_mfinante').on('mouseup', function(e) {
                            if (e.button === 0 || e.button === 1) {
                                var cif = $('.order-billing-address em').text().trim();
                                if (/^(?:ro {0,})?\d+$/gi.test(cif)) {
                                    cif = cif.match(/\d+/)[0];
                                    GM_openInTab('https://mfinante.gov.ro/apps/infocodfiscal.html?cod='+cif,{active: !e.button, insert: false});
                                }
                                else alert('CIF-ul nu poate fi cautat pe mfinante deoarece nu are atributul fiscal "RO"!');
                            }
                        });
                        var raspuns_anaf, raspuns_erp;
                        $('#cif_anaf').click(function() {
                            add_style();
                            var cif = $('.order-billing-address em').text().trim();
                            get_cif_anaf(cif);
                        });
                        function get_cif_anaf(cif) {
                            raspuns_anaf = $.confirm({
                                columnClass: '',
                                title: `Verificare CIF <a id="new_cif_anaf" class="hint--bottom hint--rounded" aria-label="Click pentru a modifica CIF-ul!">${cif}</a> - ANAF`,
                                content: 'Loading...',
                                type: 'blue',
                                closeIcon: true,
                                buttons:false,
                                theme: 'light,lista_comenzi',
                                onOpenBefore: function () {
                                    if (/^(?:ro {0,})?\d+$/gi.test(cif)) {
                                        cif = cif.match(/\d+/)[0];
                                        var date = new Date().toISOString().slice(0,10);
                                        GM_xmlhttpRequest({
                                            method: "POST",
                                            url: "https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva",
                                            headers: {"Content-Type": "application/json"},
                                            data: `[{"cui": "${cif}", "data": "${date}"}]`,
                                            onload: function(xhr) {
                                                if (xhr.status == 200) {
                                                    try {
                                                        var response = JSON.parse(xhr.responseText);
                                                        if (response) {
                                                            response = response.found;
                                                            var content = '';
                                                            if (response.length) {
                                                                content = '<table id="comenzi"><tr><th>Denumire</th><th>CIF</th><th>Nr. reg. com.</th><th>Adresa</th><th>Platitor TVA</th><th>Stare inregistrare</th></tr>';
                                                                $.each(response, function(i) {
                                                                    var tva = 'NU';
                                                                    if (response[i].inregistrare_scop_Tva.scpTVA) tva = 'DA';
                                                                    content += '<tr><td>'+response[i].date_generale.denumire+'</td><td>'+response[i].date_generale.cui+'</td><td>'+(response[i].date_generale.nrRegCom || '-')+'</td><td>'+response[i].date_generale.adresa+'</td><td>'+tva+'</td><td>'+response[i].date_generale.stare_inregistrare+'</td></tr>';
                                                                });
                                                                content += '</table>';
                                                            }
                                                            else content = 'CIF-ul nu a fost gasit la ANAF!';
                                                            raspuns_anaf.setContent(content);
                                                        }
                                                        else raspuns_anaf.setContent('Am primit eroare de la serverul ANAF!');
                                                    }
                                                    catch(e) {
                                                        raspuns_anaf.setContent(e);
                                                    }
                                                }
                                                else if (xhr.status == 404) raspuns_anaf.setContent('CIF-ul nu a fost gasit la ANAF!');
                                                else raspuns_anaf.setContent('Am primit eroare de la serverul ANAF!');
                                            },
                                            onerror: function() {
                                                raspuns_anaf.setContent('Am primit eroare de la serverul ANAF!');
                                            },
                                            timeout: 10000,
                                            ontimeout: function() {
                                                raspuns_anaf.setContent('Nu am primit raspuns de la serverul ANAF!');
                                            }
                                        });
                                    }
                                    else raspuns_anaf.setContent(`CIF-ul ${cif} nu poate fi verificat la ANAF!`);
                                }
                            });
                        }
                        $(document).on('click', '#new_cif_anaf, #new_cif_erp', function() {
                            var new_cif = (prompt('Introdu noul CIF:') || '').trim().toUpperCase();
                            if (new_cif) {
                                if ($(this).attr('id') == 'new_cif_anaf') {
                                    raspuns_anaf.close();
                                    get_cif_anaf(new_cif);
                                }
                                else if ($(this).attr('id') == 'new_cif_erp') {
                                    raspuns_erp.close();
                                    get_cif_erp(new_cif);
                                }
                            }
                        });
                        $('#cif_ERP').click(function() {
                            add_style();
                            var cif = $('.order-billing-address em').text().trim().toUpperCase();
                            get_cif_erp(cif);
                        });
                        function get_cif_erp(cif) {
                            raspuns_erp = $.confirm({
                                columnClass: '',
                                title: `Verificare CIF <a id="new_cif_erp" class="hint--bottom hint--rounded" aria-label="Click pentru a modifica CIF-ul!">${cif}</a> - ERP`,
                                content: 'Loading...',
                                type: 'blue',
                                closeIcon: true,
                                buttons:false,
                                theme: 'light,lista_comenzi',
                                onOpenBefore: function () {
                                    sap_request({url:`dws/erp/bp/prod?body={"INPUT": {"TAX": "${cif}"}}`, method: 'GET'}).then(function(response) {
                                        var content = '';
                                        var header = response.OUTPUT.HEADER;
                                        if (header.CUSTOMER_NUMBER) {
                                            content = '<table id="comenzi"><tr><th>Cod client</th><th>Denumire</th><th>CIF</th><th>Nr. reg. com.</th><th>Adresa</th><th>Platitor TVA</th><th>Grup clienti</th><th>Blocat</th></tr>';
                                            var tva = 'NU';
                                            if (header.TAX_NUMBER_1 == header.VAT_REGISTRATION_NUMBER) tva = 'DA';
                                            content += '<tr><td>'+header.CUSTOMER_NUMBER+'</td><td>'+header.NUME1+'</td><td>'+header.TAX_NUMBER_1+'</td><td>'+(header.REGCOM || '-')+'</td><td>'+header.ADDRESS+', '+header.CITY+', '+header.REGIO_TEXT+'</td><td>'+tva+'</td><td>'+header.CUSTOMER_GROUP+'</td><td>'+(header.BLOCAT ? 'DA' : 'NU')+'</td></tr>';
                                            content += '</table>';
                                        }
                                        else if (response.OUTPUT.MESAJ) content = response.OUTPUT.MESAJ;
                                        else content = 'Nu am primit codul de client din SAP!';
                                        raspuns_erp.setContent(content);
                                    }).catch(function(e) {
                                        raspuns_erp.setContent(e);
                                    });
                                }
                            });
                        }
                        $(document).on('click', '.order-billing-address .actions > a', function() {
                            if (event.button === 0 || event.button === 1) {
                                let payment = $('.order-payment-method-title').text();
                                let total_comanda = Number($('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,''));
                                if (/ramburs|plat[aă] la livrare/gi.test(payment) && total_comanda >= 5000) {
                                    sessionStorage.setItem('block_pj', 'Atentie!\nTotalul comenzii este mai mare de 5.000 lei iar facturarea nu poate fi pe PJ/PFA/ONG!');
                                }
                                else if (/credit online/gi.test(payment)) {
                                    sessionStorage.setItem('block_pj', 'Atentie!\nMetoda de plata a comenzii este prin credit bancar iar facturarea nu poate fi pe PJ/PFA/ONG!');
                                }
                                else sessionStorage.removeItem('block_pj');
                            }
                        });
                        $('.edit-order-table > thead > tr').prepend(`<th class="select_number"><div><input type="checkbox" class="admin__control-checkbox" checked><label class="admin__field-label"></label></div></th>`);
                        var clasa = 'number';
                        if (/OL26/.test($('h1.page-title').text())) clasa += ' active hint--rounded hint--right';
                        $('.edit-order-table > tbody > tr').each(function() {
                            if ($(this).index() == 0) $(this).prepend(`<td class="select_number"><div class="${clasa}" aria-label="Click pentru a copia informatiile pentru raport!">${$(this).parent().index()}.</div><div><input type="checkbox" class="admin__control-checkbox" checked><label class="admin__field-label"></label></div></td>`);
                            else $(this).prepend(`<td></td>`);
                        });
                        $('.edit-order-table thead th.col-product').append('<a id="search_frontend">Cauta produsele pe site</a><a id="adauga_produse">Adauga produsele selectate la comanda noua</a>');
                        $('thead .select_number input').click(function() {
                            $('tbody .select_number input').prop('checked', this.checked);
                        });
                        $('.number.active').click(function() {
                            let obj = $(this);
                            obj.animate({opacity: 0}, 200, function() {$(this).css('visibility', 'hidden');});
                            var total_comanda = Number($('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,''));
                            var nrOL = $('h1.page-title').text().replace('#','');
                            var denumire_produs = $(this).closest('tr').find('.col-product .product-title').text().trim();
                            var sku = $(this).closest('tr').find('.col-product .product-sku-block').text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim();
                            var pret = 0;
                            if (sku.includes('-')) {
                                $(this).closest('tbody').find('> tr:gt(0)').each(function() {
                                    let pret_produs_bundle = Number($(this).closest('tbody').find('.col-price .price').text().replace('lei','').trim() || 0);
                                    pret = pret + pret_produs_bundle;
                                });
                                GM_setClipboard(sku+"\t"+denumire_produs+"\t"+pret+"\t0\t0\t"+nrOL+"\t"+total_comanda);
                                obj.css('visibility', 'visible').animate({opacity: 1}, 200);
                            }
                            else {
                                pret = Number($(this).closest('tr').find('.col-price .price').text().replace('lei','').trim() || 0);
                                var stoc_scriptic = 0;
                                magento_request({api_url:'/rest/V1/inventory/source-items', search_field: 'sku', search_values: [sku], condition_type: 'eq'}).then(function(response) {
                                    if (response.items) {
                                        $.each(response.items, function(i, value) {
                                            if (value.source_code === 'BAC1') {
                                                stoc_scriptic = value.quantity;
                                                return false;
                                            }
                                        });
                                    }
                                    GM_setClipboard(sku+"\t"+denumire_produs+"\t"+pret+"\t"+stoc_scriptic+"\t0\t"+nrOL+"\t"+total_comanda);
                                    obj.css('visibility', 'visible').animate({opacity: 1}, 200);
                                }).catch(function(e) {
                                    GM_setClipboard(sku+"\t"+denumire_produs+"\t"+pret+"\t"+stoc_scriptic+"\t0\t"+nrOL+"\t"+total_comanda);
                                    obj.css('visibility', 'visible').animate({opacity: 1}, 200);
                                });
                            }
                        });
                        $('#search_frontend').on('mouseup', function(event) {
                            if (event.button === 0 || event.button === 1) {
                                var codes = [];
                                $('tbody .select_number input:checked').each(function() {
                                    codes.push($(this).closest('tbody').find('.product-sku-block').text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim());
                                });
                                if (codes.length) {
                                    var link = location.origin+ '/catalogsearch/result/v2?q='+codes.join('+');
                                    GM_openInTab(link,{active: !event.button, insert: false});
                                }
                                else alert('Nu am gasit produse selectate!');
                            }
                        });
                        $('#adauga_produse').on('mouseup', function(event) {
                            if (event.button === 0 || event.button === 1) {
                                $(this).fadeOut().fadeIn();
                                var produse = {};
                                $('tbody .select_number input:checked').each(function() {
                                    let sku = $(this).closest('tbody').find('.product-sku-block').text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                                    if (!sku.includes('-')) {
                                        let cantitate = Number($(this).closest('tbody').find('.qty-table > tbody > tr:first-of-type > td').data('qty') || $(this).closest('tbody').find('.qty-table > tbody > tr:first-of-type > td').text().trim());
                                        let pret = Number($(this).closest('tbody').find('.col-price .price').text().replace('lei','').trim() || 0);
                                        if (produse[sku]) {
                                            var total_anterior = produse[sku].cantitate * produse[sku].pret;
                                            var total_curent = cantitate * pret;
                                            cantitate = produse[sku].cantitate + cantitate;
                                            pret = Number(((total_anterior + total_curent) / cantitate).toFixed(2));
                                        }
                                        produse[sku] = {cantitate: cantitate, pret: pret};
                                    }
                                    else {
                                        $(this).closest('tbody').find('> tr:gt(0)').each(function() {
                                            let sku = $(this).find('.bundle-product-sku').text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                                            let cantitate = Number($(this).find('.qty-table > tbody > tr:first-of-type > td').data('qty') || $(this).find('.qty-table > tbody > tr:first-of-type > td').text().trim());
                                            let pret = Number($(this).find('.col-price .price').text().replace('lei','').trim() || 0);
                                            if (produse[sku]) {
                                                var total_anterior = produse[sku].cantitate * produse[sku].pret;
                                                var total_curent = cantitate * pret;
                                                cantitate = produse[sku].cantitate + cantitate;
                                                pret = Number(((total_anterior + total_curent) / cantitate).toFixed(2));
                                            }
                                            produse[sku] = {cantitate: cantitate, pret: pret};
                                        });
                                    }
                                });
                                if (Object.keys(produse).length) GM_setValue('coduri_produse', produse);
                                else alert('Nu am gasit produse selectate!');
                            }
                        });
                        //awb tracking ------------------------------------------------------------------------------------------------------------------------
                        if (/co?urier|dpd|fan|cargus|gls|flota/gi.test($('.order-shipping-method > .admin__page-section-item-content').text())) {
                            $(document).on('click', '.awb', function() {
                                add_style();
                                var awb = $(this).text();
                                if (sessionStorage.getItem(awb)) {
                                    var detalii_awb = JSON.parse(sessionStorage.getItem(awb));
                                    var title = `Detalii AWB <span style="color: #007bdb;cursor: default;user-select: all;">${awb}</span>`;
                                    var content = '<table id="comenzi" class="my-stripped"><thead><tr><th>Data</th><th>Status</th><th>Localitate</th></tr></thead><tbody>';
                                    if ($(this).data('curier') == 'FAN') {
                                        if (detalii_awb.data[0]?.confirmation?.name) title += ' | Confirmare: ' + detalii_awb.data[0].confirmation.name;
                                        if (detalii_awb.data[0].events?.length) {
                                            $.each(detalii_awb.data[0].events, function(i, value) {
                                                content += `<tr><td>${new Date(value.date).toLocaleString('ro-RO')}</td><td>${value.name}</td><td>${value.location}</td></tr>`;
                                            });
                                        }
                                        else content += `<tr><td colspan="3">AWB-ul a fost inregistrat de catre clientul expeditor</td></tr>`;
                                    }
                                    else if ($(this).data('curier') == 'DPD') {
                                        $.each(detalii_awb.parcels[0].operations, function(i, value) {
                                            content += `<tr><td>${new Date(value.dateTime).toLocaleString('ro-RO')}</td><td>${value.description}${(value.comment) ? '<br>' + value.comment : ''}${(value.consignee) ? '<br>Destinatar: ' + value.consignee : ''}</td><td>${value.place || ''}</td></tr>`;
                                        });
                                    }
                                    else if ($(this).data('curier') == 'GLS') {
                                        $.each(detalii_awb.ParcelStatusList, function(i, value) {
                                            let time = value.StatusDate.replace(/\/Date\(|\)\//g,'');
                                            let ms = Number(time.slice(0,13));
                                            let offset = time.slice(-5);
                                            time = new Date(ms).toLocaleString('ro', { timeZone: offset });
                                            content += `<tr><td>${time}</td><td>${value.StatusDescription}${value.StatusInfo ? ' | ' + value.StatusInfo : ''}</td><td>${value.DepotCity || ''}</td></tr>`;
                                        });
                                    }
                                    else if ($(this).data('curier') == 'Cargus') {
                                        if (detalii_awb.ConfirmationName) title += ' | Confirmare: ' + detalii_awb.ConfirmationName;
                                        $.each(detalii_awb.Event, function(i, value) {
                                            content += `<tr><td>${new Date(value.Date).toLocaleString('ro-RO')}</td><td>${value.Description}</td><td>${value.LocalityName}</td></tr>`;
                                        });
                                    }
                                    content += '</tbody></table>';
                                    $.confirm({
                                        columnClass: '',
                                        title: title,
                                        content: content,
                                        type: 'blue',
                                        closeIcon: true,
                                        buttons:false,
                                        theme: 'light,lista_comenzi'
                                    });
                                }
                            });
                            var awbs = get_awbs();
                            console.log(awbs);
                            $.each(awbs, function(i, awb) {
                                awb_status(awb);
                            });
                            function awb_status(awb) {
                                var text = 'Nu sunt informatii disponibile!';
                                reset_awb_regex_index();
                                if (regExDPD.test(awb)) { //DPD
                                    dpd_request({api_url:'track', method: 'POST', data: {parcels: [{id: awb}]}}).then(function(response) {
                                        if (response.parcels[0].operations.length) {
                                            let last_status = response.parcels[0].operations.slice(-1)[0];
                                            text = get_dpd_status_text(last_status);
                                            append_status(awb, text, 'DPD');
                                            if (last_status.redirectShipmentId) awb_status(last_status.redirectShipmentId);
                                            else if (last_status.returnShipmentId) awb_status(last_status.returnShipmentId);
                                            sessionStorage.setItem(awb, JSON.stringify(response));
                                        }
                                    }).catch(function(e) {
                                        append_status(awb, e, 'DPD');
                                    });
                                }
                                else if (regExGLS.test(awb)) { //GLS
                                    gls_request({api_url:'GetParcelStatuses', method: 'POST', data: {ParcelNumber: awb, ReturnPOD: false, LanguageIsoCode: "RO"}}).then(function(response) {
                                        console.log(response);
                                        if (response.ParcelStatusList.length) {
                                            let awb_details = response.ParcelStatusList;
                                            text = get_gls_last_status_text(awb_details);
                                            append_status(awb, text, 'GLS');
                                            response.ParcelStatusList.reverse();
                                            sessionStorage.setItem(awb, JSON.stringify(response));
                                        }
                                        else if (response.GetParcelStatusErrors.length) append_status(awb, response.GetParcelStatusErrors[0].ErrorDescription, 'GLS');
                                    }).catch(function(e) {
                                        append_status(awb, e, 'GLS');
                                    });
                                }
                                else if (regExCargus.test(awb)) { //Cargus
                                    cargus_request({api_url:`AwbTrace/GetAwbTraceOneRequest?barCode=[${awb}]`, method: 'GET'}).then(function(response) {
                                        if (response.length) {
                                            let awb_details = response[0];
                                            text = get_cargus_last_status_text(awb_details);
                                            append_status(awb, text, 'Cargus');
                                            if (awb_details.ResponseCode) awb_status(awb_details.ResponseCode);
                                            sessionStorage.setItem(awb, JSON.stringify(awb_details));
                                        }
                                        else append_status(awb, 'Nu am primit statusul de la Cargus!', 'Cargus');
                                    }).catch(function(e) {
                                        append_status(awb, e, 'Cargus');
                                    });
                                }
                                else if (regExFAN.test(awb)) { //FAN
                                    fan_request({api_url:'reports/awb/tracking?clientId=227407&language=ro&awb[]='+awb, method: 'GET'}).then(function(response) {
                                        if (response.data) {
                                            let awb_details = response.data[0];
                                            text = get_fan_last_status_text(awb_details);
                                            append_status(awb, text, 'FAN');
                                            if (awb_details.redirectionAwbNumber) awb_status(awb_details.redirectionAwbNumber);
                                            else if (awb_details.returnAwbNumber) awb_status(awb_details.returnAwbNumber);
                                            sessionStorage.setItem(awb, JSON.stringify(response));
                                        }
                                    }).catch(function(e) {
                                        append_status(awb, e, 'FAN');
                                    });
                                }
                            }
                            function append_status(awb, status, curier) {
                                if (!$(`.order-shipping-method .awb[data-awb=${awb}]`).length) $('.order-shipping-method').append(`<div class="awb_status"><span>AWB ${curier} <span class="awb" data-curier="${curier}" data-awb="${awb}">${awb}</span>:</span><span>${status}</span></div>`);
                            }
                        }
                        //search payment ---------------------------------------------------------------------------------------------------------------------------------
                        if (/card|ipay|credit|google|apple/gi.test($('.order-payment-method-title').text())) {
                            let payment_details = ($('.order-payment-method-details').html() || '').replace(/<p><strong>Detalii plata:(?:&nbsp;| )*<\/strong><\/p>/g,'').trim();
                            let payment_method_title = $('.order-payment-method-title').text();
                            if (/aprobat|confirmat/gi.test(payment_details) || /admin/.test(payment_method_title)) $('.order-payment-method .admin__page-section-item-title').append('<a id="copy_payment" style="margin-left: 0.5rem; float: right; line-height: 24px;">Copy</a>');
                            $('#copy_payment').click(function() {
                                $(this).fadeOut().fadeIn();
                                $('.order-payment-method-details').fadeOut().fadeIn();
                                if (/ipay|transilvania|star/gi.test(payment_method_title) && /[a-z0-9-]{36}/.test(payment_details)) payment_details = `<div class="BTRL">${payment_details}</div>`;
                                else if (/smart|direct/gi.test(payment_method_title)) payment_details = `<div class="smart-bt">${payment_details}</div>`;
                                else payment_details = `<div>${payment_details}</div>`;
                                copy_text(payment_details, payment_details);
                            });
                            if (!/smart|direct/gi.test(payment_method_title)) $('.order-payment-method .admin__page-section-item-title').append('<div class="actions"><a id="payment_search">Cauta plata</a></div>');
                            let info = [];
                            $('#payment_search').on('click auxclick', function(event) {
                                if (event.button === 0 || event.button === 1) {
                                    $(this).fadeOut().fadeIn();
                                    GM_setValue('admin_user', $('.admin-user-account-text').text());
                                    if ($('input[name=form_key]').val() !== GM_getValue('transactions_session')) {
                                        //delete transactions info
                                        GM_deleteValue('info_retur');
                                        GM_setValue('transactions_session', $('input[name=form_key]').val());
                                    }
                                    var euplatesc = 0;
                                    var mobilpay = 0;
                                    var ing = 0;
                                    var btipay = 0;
                                    var text = $('.order-payment-method .order-payment-method-details').html() || '';
                                    if ($('#order_history_block .note-list-status:contains(Comanda confirmata)').length) {
                                        $('#order_history_block .note-list-item:has(.note-list-status:contains(Comanda confirmata)) > .note-list-comment, #order_history_block .note-list-item:has(.note-list-status:contains(Card - In asteptare confirmare)) > .note-list-comment').each(function() {
                                            var text_comm = $(this).html().replace(/\[AUTOMAT\]/g, '').trim();
                                            regExPayments.lastIndex = 0;
                                            if (regExPayments.test(text_comm)) text += text_comm;
                                        });
                                    }
                                    regExPayments.lastIndex = 0;
                                    info = text.match(regExPayments);
                                    console.log(text);
                                    console.log(info);
                                    info = [...new Set(info)]; //remove duplicates
                                    if (info.length > 0) {
                                        for (var i = 0; i < info.length; i++) {
                                            let link;
                                            if (/[A-Z0-9]{40}/.test(info[i])) {
                                                link = "https://manager.euplatesc.ro/v3/?search="+info[i];
                                                euplatesc++;
                                            }
                                            else if (/[a-z0-9-]{36}/.test(info[i])) {
                                                if (/ipay|transilvania|star/i.test($('.order-payment-method-title').text()) || $(`.BTRL:contains(${info[i]})`).length) {
                                                    let btrl_base_url = 'https://ecclients-sandbox.btrl.ro';
                                                    if (location.hostname == 'www.dedeman.ro') btrl_base_url = 'https://ecclients.btrl.ro';
                                                    link = `${btrl_base_url}/console/index.html#orders/${info[i]}/details`;
                                                    btipay++;
                                                }
                                                else {
                                                    link = `https://securepay.ing.ro/consola/index.jsp#orders/${info[i]}/details`;
                                                    ing++;
                                                }
                                            }
                                            else if (/\d{7,}:c/.test(info[i])) {
                                                var id_tranzactie = info[i].replace(':c','');
                                                info[i] = id_tranzactie;
                                                //link = "https://admin.netopia-payments.com/card?transaction_id="+id_tranzactie;
                                                link = "https://admin.mobilpay.ro/purchase/admin/index?id_tranzactie="+id_tranzactie;
                                                mobilpay++;
                                            }
                                            if (link) GM_openInTab(link, {active: !event.button, insert: false});
                                        }
                                        var suma_comanda = Number($('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,''));
                                        var retur = 0;
                                        var all_ret = {};
                                        var reg = /\[AUTOMAT\] Pe comanda s-a procesat retur, (\d+(?:\.\d+)?) lei\. Numar referinta: /;
                                        $('.note-list-comment:contains("[AUTOMAT] Pe comanda s-a procesat retur,")').each(function() {
                                            if ($(this).parent().find('.note-list-customer:contains(Administrator)').length === 0 && reg.test($(this).text())) {
                                                var match = $(this).text().match(reg);
                                                all_ret[match[2]] = Number(match[1]);
                                            }
                                        });
                                        Object.entries(all_ret).forEach(([key, value]) => {
                                            retur = retur + value;
                                        });
                                        retur = Number(retur.toFixed(2));
                                        var info_retur = GM_getValue('info_retur') || {};
                                        info_retur.suma_comanda = suma_comanda;
                                        info_retur.valoare_retur = retur;
                                        GM_setValue('info_retur', info_retur);
                                        if (info.length === 1) {
                                            if (ing) $('.dropdown-content.retur').html('<span class="retur" data-tip-returnare="XXXXX" data-procesator="ING WebPay">Retur ING</span>');
                                            else if (euplatesc) $('.dropdown-content.retur').html('<span class="retur" data-tip-returnare="XXXXX" data-procesator="EuPlatesc">Retur EuPlatesc</span>');
                                            else if (mobilpay) $('.dropdown-content.retur').html('<span class="retur" data-tip-returnare="XXXXX" data-procesator="MobilPay">Retur MobilPay</span>');
                                            else if (btipay) $('.dropdown-content.retur').html('<span class="retur" data-tip-returnare="XXXXX" data-procesator="BT iPay">Retur BT iPay</span>');
                                        }
                                        else {
                                            if (!ing) $('.retur[data-procesator="ING WebPay"]').remove();
                                            if (!euplatesc) $('.retur[data-procesator="EuPlatesc"]').remove();
                                            if (!mobilpay) $('.retur[data-procesator="MobilPay"]').remove();
                                            if (!btipay) $('.retur[data-procesator="BT iPay"]').remove();
                                        }
                                    }
                                    else {
                                        var title = $('.order-payment-method-title').text();
                                        var nrOL = $('h1.page-title').text().replace('#','');
                                        var email = $('.order-account-information-table > tbody > tr:nth-of-type(2) > td > a').text();
                                        var link = '';
                                        const months = {
                                            "ian.": "1",
                                            "feb.": "2",
                                            "mar.": "3",
                                            "apr.": "4",
                                            "mai": "5",
                                            "iun.": "6",
                                            "iul.": "7",
                                            "aug.": "8",
                                            "sept.": "9",
                                            "oct.": "10",
                                            "nov.": "11",
                                            "dec.": "12"
                                        };
                                        const data_text = $('.order-information-table > tbody > tr:first-of-type > td').text();
                                        let date;
                                        if (/AM|PM/.test(data_text)) date = new Date(data_text);
                                        else {
                                            const date_parts = data_text.replace(',','').split(' ');
                                            date = new Date(date_parts[2]+'-'+months[date_parts[1]]+'-'+date_parts[0]+' '+date_parts[3]);
                                        }
                                        date.setDate(date.getDate() - 1);
                                        var from_date = date.toISOString().slice(0,10);
                                        date.setDate(date.getDate() + 8);
                                        var to_date = date.toISOString().slice(0,10);
                                        if (/garanti|avantaj/gi.test(title)) {
                                            //link = 'https://admin.netopia-payments.com/card?order_no='+nrOL+'&from_date='+from_date+'&to_date='+to_date;
                                            link = 'https://admin.mobilpay.ro/purchase/admin/index?id_tranzactie='+nrOL;
                                        }
                                        else if (/ipay|transilvania|star/gi.test(title)) {
                                            let btrl_base_url = 'https://ecclients-sandbox.btrl.ro';
                                            if (location.hostname == 'www.dedeman.ro') btrl_base_url = 'https://ecclients.btrl.ro';
                                            link = btrl_base_url+'/console/index.html?email='+encodeURIComponent(email)+'&nrOL='+nrOL+'&from_date='+from_date+'&to_date='+to_date+'#orders';
                                        }
                                        else if (/raiffeisen|google|apple/gi.test(title)) {
                                            link = "https://manager.euplatesc.ro/v3/?search="+nrOL;
                                        }
                                        else if (/integral/gi.test(title)) {
                                            link = 'https://securepay.ing.ro/consola/index.jsp?reconciliation_id='+nrOL+'&from_date='+from_date+'&to_date='+to_date+'#orders';
                                        }
                                        if (link) {
                                            GM_openInTab(link,{active: !event.button, insert: false});
                                        }
                                    }
                                }
                            });
                            var delete_transaction_info = 0;
                            var copy_comment_retur = 0;
                            var show_alert = 1;
                            $(document).on('click', '.dropdown-content > .retur', function() {
                                console.log(info);
                                var obj_parent = $(this).parent();
                                obj_parent.fadeOut(100);
                                setTimeout(function() {obj_parent.removeAttr('style')}, 200);
                                var nrOL = $('h1.page-title').text().replace('#','');
                                var suma = 'XXXXX';
                                var rrn = '';
                                var tip_returnare = $(this).data('tip-returnare');
                                if (tip_returnare === 'totala') suma = $('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,'');
                                var procesator = $(this).data('procesator');
                                var info_retur = GM_getValue('info_retur') || {};
                                $.each(info, function (index, tranzactie) {
                                    if (info_retur[tranzactie]) {
                                        suma = info_retur[tranzactie].suma_returnata;
                                        rrn = info_retur[tranzactie].rrn;
                                        tip_returnare = info_retur[tranzactie].tip_returnare;
                                        delete_transaction_info = tranzactie;
                                        return false;
                                    }
                                });
                                if (!delete_transaction_info && show_alert) {
                                    alert ('Sigur a fost returnata tranzactia? Nu am gasit suma returnata!');
                                    show_alert = 0;
                                }
                                var zile_retur = 10;
                                if (procesator === "ING WebPay" || procesator === "BT iPay") zile_retur = 7;
                                if (suma != "XXXXX") suma = (Number(suma)).toLocaleString('ro-RO');
                                if (rrn) rrn = ' referitoare la tranzactia cu RRN: '+rrn;
                                var mesaj_retur = `Prin intermediul procesatorului de carduri ${procesator}, am operat returnarea ${tip_returnare} a tranzactiei pentru comanda ${nrOL}. Suma de ${suma} lei va fi returnata in contul tau de card intr-un interval de pana la ${zile_retur} zile lucratoare. Daca dupa acest interval, plata nu s-a operat in contul tau, te rugam sa te adresezi bancii emitente a cardului, apeland numarul de telefon inscriptionat pe spatele cardului si sa soliciti informatii suplimentare${rrn}.`;
                                $('#history_comment').trumbowyg('html', mesaj_retur);
                                $('.order-history-comments-options input:checked').prop('checked', false);
                                $('#history_notify').prop('checked', true);
                                copy_comment_retur = 1;
                            });
                            $(document).on('click', '#trimite_comentariu', function() {
                                if (delete_transaction_info) {
                                    var info_retur = GM_getValue('info_retur') || {};
                                    delete info_retur[delete_transaction_info]
                                    GM_setValue('info_retur', info_retur);
                                    delete_transaction_info = 0;
                                }
                                if (copy_comment_retur) {
                                    copy_comment_retur = 0;
                                    var text = $('#history_comment').val();
                                    copy_text(text, text);
                                }
                            });
                        }
                        //change e-mail ----------------------------------------------------------------------------------------------------------
                        if (!$('.order-account-information-table > tbody > tr:nth-of-type(1) > td > a').length) {
                            var edit_svg = `<span class="edit-email hint--top hint--rounded" aria-label="Modifica adresa de e-mail"><svg class="edit-email" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span>`;
                            $('.order-account-information-table > tbody > tr> th:contains(Email)').append(edit_svg);
                            $(document).on('keyup', '#new_email', function() {
                                $(this).mailcheck({
                                    suggested: function(element, suggestion) {
                                        element.next('.suggestion').html(`Ai vrut sa scrii <b>${suggestion.full}</b>? <a data-value="${suggestion.full}" data-input_id="#new_email">Da, corecteaza!</a> <div class="closeIcon">×</div>`).slideDown();
                                    },
                                    empty: function(element) {
                                        element.next('.suggestion').slideUp();
                                    }
                                });
                            });
                            $("span.edit-email").on("click", function(e) {
                                add_style();
                                var old_email = $('.order-account-information-table > tbody > tr:nth-of-type(2) > td > a').text();
                                var change_email = $.confirm({
                                    columnClass: '',
                                    title: `Modifica adresa de e-mail de pe comanda`,
                                    content: `<div class="form-group">
                                <label for="new_email">E-mail: </label><input id="new_email" type="email" class="admin__control-text my-input" value="${old_email}" required="true" spellcheck="false">
                                <div class="suggestion"></div></div>`,
                                    type: 'blue',
                                    closeIcon: true,
                                    buttons: {
                                        Save: {
                                            text: "Salveaza",
                                            btnClass: 'btn-blue',
                                            action: function () {
                                                var new_email = this.$content.find('#new_email').val().trim();
                                                if (this.$content.find('.my-input:invalid').length || this.$content.find('.suggestion:visible').length) {
                                                    $.alert({
                                                        title: '',
                                                        content: 'Completeaza o adresa de e-mail corecta!',
                                                        type: 'red',
                                                        theme: 'light,my_alert'
                                                    });
                                                    return false;
                                                }
                                                else if (new_email == old_email) {
                                                    $.alert({
                                                        title: '',
                                                        content: 'Completeaza o adresa de e-mail diferita de cea veche!',
                                                        type: 'red',
                                                        theme: 'light,my_alert'
                                                    });
                                                    return false;
                                                }
                                                else {
                                                    change_email.showLoading({disableButtons: true});
                                                    var user = $('.admin-user-account-text').text();
                                                    var order_id = $("input[name='order_id']").val();
                                                    if (order_id) {
                                                        magento_request({api_url:`/rest/V1/orders/${order_id}/statuses`}).then(function(response) {
                                                            if (response) {
                                                                var status_comanda = response;
                                                                var comment = `<div class="message message-warning warning"><b>Atentie!</b> Adresa de e-mail asociata comenzii a fost modificata din <b>${old_email}</b> in <b>${new_email}</b>, de utilizatorul ${user}.</div>`;
                                                                var data = {
                                                                    "entity": {
                                                                        "entity_id": order_id,
                                                                        "customer_email": new_email,
                                                                        "status": status_comanda,
                                                                        "status_histories": [
                                                                            {
                                                                                "comment": comment,
                                                                                "is_customer_notified": 0,
                                                                                "is_visible_on_front": 0,
                                                                                "status": status_comanda
                                                                            }
                                                                        ]
                                                                    }
                                                                };
                                                                console.log(data);
                                                                GM_xmlhttpRequest({
                                                                    method: "POST",
                                                                    url: location.origin+`/rest/V1/orders/`,
                                                                    headers: {
                                                                        "Accept": "application/json",
                                                                        "Content-Type": "application/json",
                                                                        "Authorization": "Bearer "+ GM_getValue(`api_key_${location.hostname}`) || ''
                                                                    },
                                                                    data: JSON.stringify(data),
                                                                    onload: function(xhr) {
                                                                        if (xhr.status == 200) {
                                                                            location.reload();
                                                                        }
                                                                        else {
                                                                            $.alert({
                                                                                title: 'Eroare!',
                                                                                content: xhr.responseText,
                                                                                type: 'red',
                                                                                theme: 'light,my_alert',
                                                                                onDestroy: function () {change_email.hideLoading({enableButtons: true});}
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                $.alert({
                                                                    title: 'Eroare!',
                                                                    content: 'Nu am identificat statusul comenzii!',
                                                                    type: 'red',
                                                                    theme: 'light,my_alert',
                                                                    onDestroy: function () {change_email.hideLoading({enableButtons: true});}
                                                                });
                                                            }
                                                        }).catch(function(e) {
                                                            $.alert({
                                                                title: 'Eroare!',
                                                                content: e,
                                                                type: 'red',
                                                                theme: 'light,my_alert',
                                                                onDestroy: function () {change_email.hideLoading({enableButtons: true});}
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        $.alert({
                                                            title: 'Eroare!',
                                                            content: 'Nu am identificat id-ul comenzii!',
                                                            type: 'red',
                                                            theme: 'light,my_alert',
                                                            onDestroy: function () {change_email.hideLoading({enableButtons: true});}
                                                        });
                                                    }
                                                    return false;
                                                }
                                            }
                                        },
                                        Cancel: {
                                            text: "Anuleaza"
                                        }
                                    },
                                    theme: 'light,new_email',
                                    onOpen: function () {
                                        this.$content.find('#new_email').trigger('keyup');
                                    }
                                });
                            });
                        }
                        //Cauta UM -------------------------------------------------------------------------------------------------------------------
                        $('thead .col-ordered-qty > span').attr('aria-label', 'Click pentru a cauta unitatile de masura!').addClass('hint--left hint--rounded');
                        $(document).one('click', 'thead .col-ordered-qty > span', function() {
                            $(this).fadeOut().fadeIn().removeClass();
                            um_refresh();
                            var products = [];
                            $('.edit-order-table .product-sku-block, .edit-order-table .bundle-product-sku').each(function() {
                                var sku = $(this).text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                                if (sku && !products.includes(sku) && !sku.includes('-')) products.push(sku);
                            });
                            if (products.length) {
                                magento_request({api_url:`/rest/V1/products`, search_field: 'sku', search_values: products, condition_type: 'in', return_fields: 'sku,custom_attributes[base_unit,sale_unit,sale_coefficient]'}).then(function(response) {
                                    if (response.items) {
                                        var um = {};
                                        var um_details = JSON.parse(localStorage.getItem('um') || '{}');
                                        $.each(response.items, function(i, value) {
                                            var sku = value.sku;
                                            var base_unit, sale_unit, sale_coefficient;
                                            $.each(value.custom_attributes, function(j, val) {
                                                if (val.attribute_code == 'base_unit') base_unit = val.value;
                                                else if (val.attribute_code == 'sale_unit') sale_unit = val.value;
                                                else if (val.attribute_code == 'sale_coefficient') sale_coefficient = val.value;
                                            });
                                            um[sku] = {base_unit: base_unit, sale_unit: sale_unit, sale_coefficient: sale_coefficient}
                                        });
                                        $('.edit-order-table .product-sku-block, .edit-order-table .bundle-product-sku').each(function() {
                                            var sku = $(this).text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                                            if (sku && um[sku]) {
                                                var qty_tr = $(this).closest('tr').find('.col-ordered-qty > .qty-table > tbody > tr:nth-of-type(1)');
                                                qty_tr.find('th').remove();
                                                var qty = Number(qty_tr.find('td').text() || 0);
                                                var sale_coefficient = Number(um[sku].sale_coefficient) || 0;
                                                var cantitate_alternativa = Number((qty/sale_coefficient).toFixed(4)) || 0;
                                                if (um[sku].base_unit == um[sku].sale_unit) qty_tr.find('td').attr('colspan', '2').attr('data-qty', qty).append(' '+get_um(um_details,um[sku].base_unit, qty));
                                                else {
                                                    if (qty && sale_coefficient) qty_tr.find('td').attr('colspan', '2').attr('data-qty', qty).append(` ${get_um(um_details,um[sku].base_unit, qty)}<br>(${cantitate_alternativa} ${get_um(um_details,um[sku].sale_unit, cantitate_alternativa)})`).attr('aria-label', `1 ${get_um(um_details,um[sku].sale_unit, 1)} = ${sale_coefficient} ${get_um(um_details,um[sku].base_unit, sale_coefficient)}`).addClass('hint--top hint--rounded');
                                                }
                                            }
                                        });
                                    }
                                }).catch(function(e) {
                                    alert(e);
                                });
                            }
                            else alert('Nu am gasit produse!');
                        });
                        //Search orders -------------------------------------------------------------------------------------------------------------------
                        $('.order-account-information-table tbody').append(`<tr><th><a id="comenzi_client">Comenzi client</a></th><td class="create_order"></td></tr>`);
                        $('#comenzi_client').on('click', function() {
                            store_list_refresh();
                            var email = $('.order-account-information-table > tbody > tr:nth-of-type(2) > td').text().trim();
                            var customer_id = ($('.order-account-information > .admin__page-section-item-title > .actions > a').attr('href') || '').replace(/\/$/,'').split('/').slice(-1)[0] || 0;
                            var current_orderId = $("input[name='order_id']").val();
                            if (customer_id) comenzi_client({customer_id: customer_id, current_orderId: current_orderId});
                            else if (email != 'faraemail@dedeman.ro') comenzi_client({email: email, current_orderId: current_orderId});
                            else alert(`Nu se cauta comenzi cu adresa de e-mail "faraemail@dedeman.ro"!`);
                        });
                        function comenzi_client(params) {
                            add_style();
                            let title, search_field, search_value;
                            if (params.email) {
                                title = `Comenzi plasate de clientul cu adresa de e-mail <span style="color: #007bdb;">${params.email}</span>`;
                                search_field = 'customer_email';
                                search_value = encodeURIComponent(params.email);
                            }
                            else {
                                title = `Comenzi plasate de clientul cu ID <span style="color: #007bdb;">${params.customer_id}</span>`;
                                search_field = 'customer_id';
                                search_value = encodeURIComponent(params.customer_id);
                            }
                            var raspuns_api = $.confirm({
                                columnClass: '',
                                title: title,
                                content: `Loading...`,
                                type: 'blue',
                                closeIcon: true,
                                buttons:false,
                                theme: 'light,lista_comenzi'
                            });
                            magento_request({api_url:'/rest/V1/orders', search_field: search_field, search_values:[search_value], condition_type: 'eq', return_fields: 'entity_id,increment_id,created_at,status,payment,shipping_description,shipping_amount,grand_total', sort_field: 'created_at', sort_direction: 'DESC'}).then(function(response) {
                                if (response.items) {
                                    var content = '<table id="comenzi"><thead><tr><th>Comanda</th><th>Data</th><th>Magazin</th><th>Status</th><th>Metoda de plata</th><th>Metoda de livrare</th><th>Cost livrare</th><th>Total comanda</th></tr></thead><tbody>';
                                    $.each(response.items, function(i, value) {
                                        var comanda = `<a href="${location.origin}/admin/sales/order/view/order_id/${value.entity_id}/" target="_blank">${value.increment_id}</a>`;
                                        var data = new Date(value.created_at.replace(/-/g,'/') + ' UTC');
                                        data = data.toLocaleDateString('ro-RO')+' '+data.toLocaleTimeString('ro-RO');
                                        var store_no = value.increment_id.substring(2, 4) || 0;
                                        var magazin = '';
                                        if (store_list[store_no]) magazin = store_list[store_no].name;
                                        var status = statusi[value.status] || value.status;
                                        var plata = metode_plata[value.payment.method] || value.payment.method;
                                        var metoda_livrare = value.shipping_description;
                                        if (metoda_livrare.split(' - ').length > 1 && metoda_livrare.split(' - ')[1].includes(metoda_livrare.split(' - ')[0])) metoda_livrare = metoda_livrare.replace(metoda_livrare.split(' - ')[0] + ' - ', '');
                                        var cost_livrare = Number(value.shipping_amount.toFixed(2)).toLocaleString('ro-RO') + ' lei';
                                        var total_comanda = Number(value.grand_total.toFixed(2)).toLocaleString('ro-RO') + ' lei';
                                        if (value.entity_id == params.current_orderId) content += '<tr class="tbl-info">';
                                        else if (/anulata/gi.test(status)) content += '<tr class="tbl-danger">';
                                        else if (/comanda finalizata/gi.test(status)) content += '<tr class="tbl-success">';
                                        else content += '<tr class="tbl-active">';
                                        content += '<td>'+comanda+'</td><td>'+data+'</td><td>'+magazin+'</td><td>'+status+'</td><td>'+plata+'</td><td>'+metoda_livrare+'</td><td>'+cost_livrare+'</td><td>'+total_comanda+'</td></tr>';
                                    });
                                    content += '</tbody></table>';
                                    raspuns_api.setContent(content);
                                    raspuns_api.setTitle(`${title} (${response.items.length})`);
                                }
                                else if (response.message) raspuns_api.setContent(response.message);
                                else raspuns_api.setContent('Nu am gasit comenzi!');
                            }).catch(function(e) {
                                raspuns_api.setContent(e);
                            });
                        }
                        //create order for client
                        if ($('.order-account-information > .admin__page-section-item-title > .actions > a').length) {
                            let id_client = $('.order-account-information > .admin__page-section-item-title > .actions > a').attr('href').replace(/\/$/,'').split('/').slice(-1)[0];
                            $('.create_order').html(`<a id="create_order" href="${location.origin}/admin/sales/order_create/start/customer_id/${id_client}/" target="_self">Creeaza comanda</a>`);
                        }
                        else {
                            let email = $('.order-account-information-table > tbody > tr:nth-of-type(2) > td').text().trim();
                            magento_request({api_url:'/rest/V1/customers/search', search_field: 'email', search_values:[encodeURIComponent(email)], condition_type: 'eq', return_fields: 'id,email,confirmation'}).then(function(response) {
                                if (response.items && !response.items[0].confirmation) {
                                    $('.create_order').html(`<a id="create_order" href="${location.origin}/admin/sales/order_create/start/customer_id/${response.items[0].id}/" target="_self">Creeaza comanda</a>`);
                                    let nume_client = $('.order-account-information-table > tbody > tr:first-child > td').text().trim();
                                    $('.order-account-information-table > tbody > tr:first-child > td').html(`<a href="${location.origin}/admin/customer/index/edit/id/${response.items[0].id}/" target="_blank"><span>${nume_client}</span></a>`);
                                }
                                else {
                                    $('.create_order').html(`<a id="create_order" href="${location.origin}/admin/sales/order_create/start/customer_id/guest/" data-email="${email}" target="_self">Creeaza comanda</a>`);
                                }
                            }).catch(function(e) {
                                $('.create_order').html(`<a id="create_order" href="${location.origin}/admin/sales/order_create/start/customer_id/guest/" data-email="${email}" target="_self">Creeaza comanda</a>`);
                            });
                        }
                        //link de plata -------------------------------------------------------------------------------------------------------------------
                        $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="mobilpay"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Link de plata MobilPay</span></a></li>`);
                        $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="euplatesc"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Link de plata EuPlatesc</span></a></li>`);
                        $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="ing_webpay"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Link de plata ING / BT</span></a></li>`);
                        $('#euplatesc, #mobilpay, #ing_webpay').on('click auxclick', function(event) {
                            if (event.button === 0 || event.button === 1) {
                                installments_refresh();
                                var nrOL = $('h1.page-title').text().replace('#','');
                                var tel = $('.order-billing-address > address > i').text();
                                var total = Number($('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,""));
                                var taxa_ramburs = Number(($('.order-subtotal-table > tbody > tr:contains(Cost procesare plat) > td .price').text() || '0').replace(/ |lei/g,""));
                                if (total && taxa_ramburs) total = (total - taxa_ramburs).toFixed(2);
                                var firstName = $('.order-billing-address > address > b:eq(0)').text().toUpperCase().replace(/'/g," ");
                                var lastName = $('.order-billing-address > address > b:eq(1)').text().toUpperCase().replace(/'/g," ");
                                var email = $('.order-account-information-table > tbody > tr:nth-of-type(2) > td > a').text();
                                var id = $(this).attr('id');
                                var link = '';
                                if (id == 'euplatesc') {
                                    link = `https://manager.euplatesc.ro/v3/?pagina=link&nrOL=${nrOL}&total=${total}&firstName=${firstName}&lastName=${lastName}&email=${encodeURIComponent(email)}&phone=${tel}`;
                                }
                                else if (id == 'mobilpay') {
                                    var payment_method;
                                    var payment_method_title = $('.order-payment-method-title').text().trim();
                                    if (/CardAvantaj/gi.test(payment_method_title)) payment_method = 'crediteurope';
                                    else if (/Garanti/gi.test(payment_method_title)) payment_method = 'garantib';
                                    // link = `https://admin.netopia-payments.com/dev/link2pay?nrOL=${nrOL}&total=${total}&email=${encodeURIComponent(email)}&phone=${tel}`;
                                    link = `https://admin.mobilpay.ro/ro/purchase/admin/add-payment-link?nrOL=${nrOL}&total=${total}&email=${encodeURIComponent(email)}&phone=${tel}`;
                                    if (payment_method) link += '&payment_method='+payment_method;
                                }
                                else if (id == 'ing_webpay') {
                                    var order_id = $("input[name='order_id']").val();
                                    let payment = 'm2ingwebpay';
                                    if (/ipay|transilvania|star/gi.test($('.order-payment-method-title').text())) payment = 'btipay';
                                    link = `${location.origin}/admin/payment_link/listing/new?order_id=${order_id}&total=${total}&payment=${payment}`;
                                }
                                GM_openInTab(link,{active: !event.button, insert: false});
                            }
                        });
                        //stoc comanda -------------------------------------------------------------------------------------------------------------------
                        $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="stoc_comanda"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Stoc comanda</span></a></li>`);
                        $(document).on('mouseover', '#stocuri tbody td', function() {
                            if ($(this).index() > 0) {
                                $(this).addClass('highlight');
                                $(this).closest('tr').find('td:eq(0)').addClass('highlight');
                                $(this).closest('table').find(`th:nth-of-type(${$(this).index()+1})`).addClass('highlight');
                            }
                            else $(this).closest('tr').find('td').addClass('highlight');
                        });
                        $(document).on('mouseout', '#stocuri tbody td', function() {
                            if ($(this).index() > 0) {
                                $(this).removeClass('highlight');
                                $(this).closest('tr').find('td:eq(0)').removeClass('highlight');
                                $(this).closest('table').find(`th:nth-of-type(${$(this).index()+1})`).removeClass('highlight');
                            }
                            else $(this).closest('tr').find('td').removeClass('highlight');
                        });
                        $(document).on('auxclick', '#stocuri .highlight', function(event) {
                            if (event.button === 1) {
                                var produse = [];
                                var cantitati = {};
                                if ($(this).index() > 0) {
                                    let sku = $(`#stocuri thead tr:first-child th:nth-of-type(${$(this).index()+1})`).data('sku');
                                    let qty = $(`#stocuri thead tr:first-child th:nth-of-type(${$(this).index()+1})`).data('qty');
                                    produse.push(sku);
                                    cantitati[sku] = qty;
                                }
                                else {
                                    $('#stocuri thead tr:first-child th:nth-of-type(n+2)').each(function() {
                                        produse.push($(this).data('sku'));
                                        cantitati[$(this).data('sku')] = $(this).data('qty');
                                    });
                                }
                                var magazin = $(this).closest('tr').find('td:eq(0)').attr('id');
                                document.cookie = `magazin=${magazin}; domain=dedeman.ro; path=/`;
                                document.cookie = `produse=${JSON.stringify(produse)}; domain=dedeman.ro; path=/`;
                                document.cookie = `cantitati=${JSON.stringify(cantitati)}; domain=dedeman.ro; path=/`;
                                document.cookie = `submit=1; domain=dedeman.ro; path=/`;
                                GM_openInTab('https://dedeweb.dedeman.ro/#/stocks',{active: true, insert: false});
                            }
                        });
                        $('#stoc_comanda').on('click', function() {
                            add_style();
                            store_list_refresh();
                            var nr_magazin = $('h1.page-title').text().replace('#','').substring(2, 4) || 0;
                            var detalii_produse = get_products_details();
                            var produse_sortate = detalii_produse.sku_order;
                            console.log(detalii_produse);
                            if (produse_sortate.length) {
                                var stoc_comanda = $.confirm({
                                    columnClass: '',
                                    title: '',
                                    content: 'Loading...',
                                    type: 'blue',
                                    closeIcon: true,
                                    buttons:false,
                                    theme: 'light,stoc_comanda'
                                });
                                function get_stock_info() {
                                    magento_request({api_url:'/rest/V1/inventory/source-items', search_field: 'sku', search_values: produse_sortate, condition_type: 'in'}).then(function(response) {
                                        if (response.items) {
                                            var stocuri = {};
                                            var stores = [];
                                            if (Object.keys(store_list).length) {
                                                for (const store in store_list) {
                                                    stores.push(store_list[store].source_code);
                                                }
                                            }
                                            $.each(response.items, function(i, value) {
                                                if (stores.indexOf(value.source_code) >= 0) stocuri[value.sku] = {...stocuri[value.sku], [value.source_code]: value.quantity}
                                            });
                                            if (Object.keys(stocuri).length) {
                                                for (var sku in stocuri) {
                                                    var values = Object.values(stocuri[sku]);
                                                    values = [...new Set(values)];
                                                    values.sort(function(a, b) { return b - a; });
                                                    if (values[0]) stocuri[sku].first = values[0];
                                                    if (values[1]) stocuri[sku].second = values[1];
                                                }
                                            }
                                            console.log(stocuri);
                                            var content = '<div class="admin__field admin__field-option" style="padding: 0;height: 16px;position: fixed;top: 12px;margin-left: 8px;"><input name="magazin_curent" type="checkbox" id="magazin_curent" class="admin__control-checkbox" value="1"><label class="admin__field-label" for="magazin_curent">Stoc pe magazinul curent</label></div><div class="admin__field admin__field-option" style="padding: 0;height: 16px;position: fixed;top: 12px;margin: 0 0 0 224px;"><input name="magazin_drop" type="checkbox" id="magazin_drop" class="admin__control-checkbox" value="1"><label class="admin__field-label" for="magazin_drop">Stoc dropshipping</label></div><div class="admin__field admin__field-option" style="padding: 0;height: 16px;position: fixed;top: 12px;margin: 0 0 0 380px;"><a class="change_qty">Adauga produs nou</a></div>';
                                            content += '<table id="stocuri"><thead>';
                                            var row1 = '<tr><th><div class="admin__field admin__field-option" style="padding: 0;height: 16px;"><input name="doar_cu_stoc" type="checkbox" id="doar_cu_stoc" class="admin__control-checkbox" value="1"><label class="admin__field-label" for="doar_cu_stoc" style="color: white;">Doar magazine cu stoc</label></div></th>';
                                            var row2 = '<tr><th><input class="admin__control-text " type="text" id="my_store_search" placeholder="Filtreaza tabel"></th>';
                                            $.each(produse_sortate, function(i, value) {
                                                row1 += `<th data-sku="${value}" data-qty="${detalii_produse[value].cantitate}">${value} | <a class="change_qty" title="Schimba cantitatea">${detalii_produse[value].cantitate}</a></th>`;
                                                row2 += `<th><div title="${detalii_produse[value].denumire}">${detalii_produse[value].denumire}<div></th>`;
                                            });
                                            content += row1 + '</tr>';
                                            content += row2 + '</tr>';
                                            content += '</thead><tbody>';
                                            if (Object.keys(store_list).length) {
                                                var sorted_store_list = [];
                                                for (const store in store_list) {
                                                    sorted_store_list.push([store, store_list[store]]);
                                                }
                                                sorted_store_list.sort(function(a, b) {
                                                    return a[1].name.localeCompare(b[1].name);
                                                });
                                                $.each(sorted_store_list, function(i, value) {
                                                    var row_content = '';
                                                    var row_class = '';
                                                    $.each(produse_sortate, function(i, sku) {
                                                        var clasa = '';
                                                        var stoc = 0;
                                                        var first = 0;
                                                        var second = 0;
                                                        if (stocuri[sku]) {
                                                            if (stocuri[sku][value[1].source_code]) stoc = stocuri[sku][value[1].source_code];
                                                            first = stocuri[sku].first || 0;
                                                            second = stocuri[sku].second || 0;
                                                        }
                                                        if (stoc < detalii_produse[sku].cantitate) {
                                                            clasa = 'danger';
                                                            row_class = 'danger';
                                                        }
                                                        else if (stoc == detalii_produse[sku].cantitate) {
                                                            clasa = 'active';
                                                            if (row_class == 'info' || !row_class) row_class = 'active';
                                                        }
                                                        else if (stoc > detalii_produse[sku].cantitate) {
                                                            if (stoc == first) clasa = 'first';
                                                            else if (stoc == second) clasa = 'second';
                                                            else clasa = 'info';
                                                            if (!row_class) row_class = 'info';
                                                        }
                                                        row_content += `<td class="${clasa}">${stoc}</td>`;
                                                    });
                                                    if (value[0] == nr_magazin) row_class += ' current_store';
                                                    content += `<tr><td class="${row_class} hint--top hint--rounded" id="${value[1].source_code}" aria-label="Dedeman ${value[0]} | ${value[1].source_code}">${value[1].name}<div class="my-search-text">${value[0]}|${value[1].source_code}|${value[1].name}</div></td>${row_content}</tr>`;
                                                });
                                                content += '</tbody></table>';
                                                stoc_comanda.setContent(content);
                                                $('.change_qty').click(function() {
                                                    var qty = $(this).closest('th').data('qty') || 0;
                                                    var sku = ($(this).closest('th').data('sku') || '').toString();;
                                                    var content = `<label for="new_qty">Cantitate noua pentru ${sku}: </label><input type="number" min="0" step="0.0001" id="new_qty" class="my-input no-arrows" value="${qty}" required="true" title="Cantitate 0 pentru a sterge produsul" style="max-width: 100px;">`;
                                                    if (!sku) content = `<div style="max-width: 210px; margin-bottom:10px;"><label for="new_sku">Adauga produs nou: </label><input type="number" min="1000000" max="9999999" id="new_sku" class="my-input no-arrows" required="true"></div>
                                                    <div style="max-width: 210px;"><label for="new_qty">Cantitate pentru produsul nou: </label><input type="number" min="0.0001" step="0.0001" id="new_qty" class="my-input no-arrows" value="1" required="true"></div>`;
                                                    var add_new_product = $.confirm({
                                                        title: '',
                                                        content: content,
                                                        type: 'blue',
                                                        theme: 'light,my_confirm',
                                                        closeIcon: true,
                                                        buttons: {
                                                            OK: {
                                                                text: "OK",
                                                                btnClass: 'btn-blue',
                                                                action: function () {
                                                                    if (this.$content.find('.my-input:invalid').length == 0) {
                                                                        var new_qty = Number(this.$content.find('#new_qty').val());
                                                                        var new_sku = (this.$content.find('#new_sku').val() || '').toString();
                                                                        if (sku) {
                                                                            if (new_qty) detalii_produse[sku].cantitate = new_qty;
                                                                            else {
                                                                                console.log('delete');
                                                                                console.log(sku);
                                                                                console.log(produse_sortate);
                                                                                console.log(produse_sortate.indexOf(sku));
                                                                                delete detalii_produse[sku];
                                                                                produse_sortate.splice(produse_sortate.indexOf(sku), 1);
                                                                            }
                                                                            stoc_comanda.setContent('Loading...');
                                                                            get_stock_info();
                                                                        }
                                                                        else {
                                                                            if (detalii_produse[new_sku]) {
                                                                                alert('Produsul exista deja in tabel!');
                                                                                return false;
                                                                            }
                                                                            else {
                                                                                add_new_product.showLoading();
                                                                                magento_request({api_url:`/rest/V1/products/${new_sku}/`, return_fields: 'sku,name'}).then(function(response) {
                                                                                    if (response.sku) {
                                                                                        add_new_product.close();
                                                                                        detalii_produse[new_sku] = {cantitate: new_qty, denumire: response.name};
                                                                                        produse_sortate.push(new_sku);
                                                                                        stoc_comanda.setContent('Loading...');
                                                                                        get_stock_info();
                                                                                    }
                                                                                    else {
                                                                                        alert('Nu am gasit id-ul produsului!');
                                                                                        add_new_product.hideLoading();
                                                                                    }
                                                                                }).catch(function(e) {
                                                                                    alert(e);
                                                                                    add_new_product.hideLoading();
                                                                                });
                                                                                return false;
                                                                            }
                                                                        }
                                                                    }
                                                                    else return false;
                                                                }
                                                            }
                                                        },
                                                        onOpen: function () {
                                                            console.log('select');
                                                            console.log(this.$content.find('.my-input').first());
                                                            this.$content.find('.my-input').first().select();
                                                        }
                                                    });
                                                });
                                            }
                                            else stoc_comanda.setContent('Nu am gasit lista de magazine, incearca din nou!');
                                        }
                                        else if (response.message) stoc_comanda.setContent(response.message);
                                        else stoc_comanda.setContent('Nu am gasit informatii!');
                                    }).catch(function(e) {
                                        stoc_comanda.setContent(e);
                                    });
                                }
                                get_stock_info();
                            }
                        });
                        $(document).on('keyup', '#my_store_search', function() {
                            let text = $(this).val();
                            $('#stocuri > tbody > tr').removeClass('d-none');
                            $(`#stocuri > tbody > tr .my-search-text:not(:icontains("${text}"))`).closest('tr').addClass('d-none');
                        });
                        $(document).on('change', '#doar_cu_stoc', function() {
                            $('#stocuri > tbody > tr').show();
                            if ($(this).prop('checked')) $('#stocuri > tbody > tr > td.danger:first-child').closest('tr').hide();
                            else $('#stocuri > tbody > tr > td.danger:first-child').closest('tr').show();
                            $('#magazin_curent, #magazin_drop').prop('checked', false);
                        });
                        $(document).on('change', '#magazin_curent', function() {
                            $('#doar_cu_stoc').prop('checked', false);
                            $('#my_store_search').val('').trigger('keyup');
                            if ($(this).prop('checked')) {
                                $('#stocuri > tbody > tr').hide();
                                if ($('#magazin_drop').prop('checked')) $('#stocuri > tbody > tr > td#ECOM').closest('tr').show();
                                $('#stocuri > tbody > tr > td.current_store').closest('tr').show();
                            }
                            else {
                                $('#stocuri > tbody > tr').show();
                                if ($('#magazin_drop').prop('checked')) $('#magazin_drop').change();
                            }
                        });
                        $(document).on('change', '#magazin_drop', function() {
                            $('#doar_cu_stoc').prop('checked', false);
                            $('#my_store_search').val('').trigger('keyup');
                            if ($(this).prop('checked')) {
                                $('#stocuri > tbody > tr').hide();
                                if ($('#magazin_curent').prop('checked')) $('#stocuri > tbody > tr > td.current_store').closest('tr').show();
                                $('#stocuri > tbody > tr > td#ECOM').closest('tr').show();
                            }
                            else {
                                $('#stocuri > tbody > tr').show();
                                if ($('#magazin_curent').prop('checked')) $('#magazin_curent').change();
                            }
                        });
                        //stoc logistica -------------------------------------------------------------------------------------------------------------------
                        $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="stoc_logi"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Stoc logistica</span></a></li>`);
                        $('#stoc_logi').on('click', function() {
                            add_style();
                            var detalii_produse = get_products_details();
                            var produse_sortate = detalii_produse.sku_order;
                            console.log(detalii_produse);
                            if (produse_sortate.length) {
                                var stoc_logi = $.confirm({
                                    columnClass: '',
                                    title: '',
                                    content: 'Loading...',
                                    type: 'blue',
                                    closeIcon: true,
                                    buttons:false,
                                    theme: 'light,stoc_comanda'
                                });
                                let logistics = {cons: "CONS - Techirghiol", logi: "LOGI - Bacau Online", lg01: "LG01 - Pantelimon", lg02: "LG02 - Oradea", lg03: "LG03 - Turda", lg04: "LG04 - Bacau"};
                                let stocuri = {};
                                GM_setValue('sap_requests_done', 0);
                                GM_deleteValue('sap_request_error');
                                var sap_requests_done_listenerId = GM_addValueChangeListener("sap_requests_done", function(key, oldValue, newValue, remote) {
                                    if (newValue == Object.keys(logistics).length) {
                                        GM_removeValueChangeListener(sap_requests_done_listenerId);
                                        GM_deleteValue('sap_requests_done');
                                        if (GM_getValue('sap_request_error')) {
                                            console.log(GM_getValue('sap_request_error'));
                                            alert('Eroare API SAP!\n'+GM_getValue('sap_request_error'));
                                            stoc_logi.close();
                                        }
                                        else {
                                            if (Object.keys(stocuri).length) {
                                                for (var sku in stocuri) {
                                                    var values = Object.values(stocuri[sku]);
                                                    values = [...new Set(values)];
                                                    values.sort(function(a, b) { return b - a; });
                                                    if (values[0]) stocuri[sku].first = values[0];
                                                    if (values[1]) stocuri[sku].second = values[1];
                                                }
                                            }
                                            console.log(stocuri);
                                            let content = '<table id="stocuri"><thead>';
                                            var row1 = '<tr><th><div class="admin__field admin__field-option" style="padding: 0;height: 16px;"><input name="doar_cu_stoc" type="checkbox" id="doar_cu_stoc" class="admin__control-checkbox" value="1"><label class="admin__field-label" for="doar_cu_stoc" style="color: white;">Doar magazine cu stoc</label></div></th>';
                                            var row2 = '<tr><th><input class="admin__control-text " type="text" id="my_store_search" placeholder="Filtreaza tabel"></th>';
                                            $.each(produse_sortate, function(i, value) {
                                                row1 += `<th data-sku="${value}" data-qty="${detalii_produse[value].cantitate}">${value} | ${detalii_produse[value].cantitate}</th>`;
                                                row2 += `<th><div title="${detalii_produse[value].denumire}">${detalii_produse[value].denumire}<div></th>`;
                                            });
                                            content += row1 + '</tr>';
                                            content += row2 + '</tr>';
                                            content += '</thead><tbody>';
                                            $.each(Object.keys(logistics), function(i, logi) {
                                                var row_content = '';
                                                var row_class = '';
                                                $.each(produse_sortate, function(i, sku) {
                                                    var clasa = '';
                                                    var stoc = 0;
                                                    var first = 0;
                                                    var second = 0;
                                                    if (stocuri[sku]) {
                                                        if (stocuri[sku][logi]) stoc = stocuri[sku][logi];
                                                        first = stocuri[sku].first || 0;
                                                        second = stocuri[sku].second || 0;
                                                    }
                                                    if (stoc < detalii_produse[sku].cantitate) {
                                                        clasa = 'danger';
                                                        row_class = 'danger';
                                                    }
                                                    else if (stoc == detalii_produse[sku].cantitate) {
                                                        clasa = 'active';
                                                        if (row_class == 'info' || !row_class) row_class = 'active';
                                                    }
                                                    else if (stoc > detalii_produse[sku].cantitate) {
                                                        if (stoc == first) clasa = 'first';
                                                        else if (stoc == second) clasa = 'second';
                                                        else clasa = 'info';
                                                        if (!row_class) row_class = 'info';
                                                    }
                                                    row_content += `<td class="${clasa}">${stoc}</td>`;
                                                });
                                                content += `<tr><td class="${row_class}" id="${logistics[logi].split(' ')[0]}">${logistics[logi]}<div class="my-search-text">${logistics[logi]}</div></td>${row_content}</tr>`;
                                            });
                                            content += '</tbody></table>';
                                            stoc_logi.setContent(content);
                                        }
                                    }
                                });
                                $.each(Object.keys(logistics), function(i, logi) {
                                    sap_request({url:`dws/wms/cl/stock/?type=stock&cl=${logi}&code=${produse_sortate.join(',')}`, method: 'GET', response_type: 'xml'}).then(function(response) {
                                        const WSStock = response.querySelector("WSStock");
                                        if (WSStock) {
                                            const nodes = WSStock.childNodes;
                                            for (let i = 0; i < nodes.length; i++) {
                                                const node = nodes[i];
                                                if (node.nodeType === 1) {
                                                    let sku = node.children[0].textContent;
                                                    let qty = Number(node.children[1].textContent);
                                                    stocuri[sku] = {...stocuri[sku], [logi]: qty}
                                                }
                                            }
                                        }
                                        GM_setValue('sap_requests_done', GM_getValue('sap_requests_done')+1);
                                    }).catch(function(e) {
                                        GM_setValue('sap_requests_done', GM_getValue('sap_requests_done')+1);
                                        GM_setValue('sap_request_error', e);
                                    });
                                });
                            }
                        });
                        //Restrictii livrare ----------------------------------------------------------------------
                        $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="restrictii_livrare"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Restrictii livrare</span></a></li>`);
                        $('#restrictii_livrare').on('click auxclick', function(event) {
                            if (event.button === 0 || event.button === 1) {
                                var products = [];
                                $('.edit-order-table .product-sku-block, .edit-order-table .bundle-product-sku').each(function() {
                                    var sku = $(this).text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                                    if (sku && !products.includes(sku) && !sku.includes('-')) products.push(sku);
                                });
                                if (products.length) GM_openInTab('https://bie2.dedeman.ro/raport/restrictii-livrare?products='+products.join(','),{active: !event.button, insert: false});
                            }
                        });
                        //Asociere factura ----------------------------------------------------------------------
                        $('#sales_order_view_tabs > ul > li#sales_order_view_tabs_custom_tabs').after(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="asociaza_factura"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Asociaza factura</span></a></li>`);
                        $('#asociaza_factura').on('click auxclick', function(event) {
                            if (event.button === 0 || event.button === 1) {
                                var nr_factura = (prompt('Introdu numarul facturii:') || '').trim();
                                console.log(nr_factura);
                                if (nr_factura) {
                                    sap_request({url:`dws/nav/factura/prod/?doc=${nr_factura}&type=invoice`, method: 'GET'}).then(function(response) {
                                        var nrOL = $('h1.page-title').text().replace('#','');
                                        if (response.efactura) {
                                            if (nrOL == response.efactura.Magento_No) {
                                                var params_retur = '';
                                                if (response.efactura.Sale_Is_Return_Sale) params_retur = '&retur=1&valoare='+Math.abs(response.efactura.Gross_Amount);
                                                xapi_request({params: `nr_comanda_online=${nrOL}&doc=${nr_factura}${params_retur}`, method: 'POST'}).then(function(response) {
                                                    try {
                                                        var xml = response,
                                                            xmlDoc = $.parseXML(xml),
                                                            $xml = $(xmlDoc);
                                                        if ($xml.find("SUCCESS_MESSAGE").length) alert('Factura a fost asociata cu succes!');
                                                        else if ($xml.find("ERROR_MESSAGE").length) alert($xml.find("ERROR_MESSAGE").html());
                                                        location.reload();
                                                    } catch(err) {
                                                        alert(err);
                                                    }
                                                }).catch(function(e) {
                                                    alert(e);
                                                });
                                            }
                                            else alert('Factura nu este pentru aceasta comanda!');
                                        }
                                        else if (response.error.message) alert(response.error.message);
                                    }).catch(function(e) {
                                        alert(e);
                                    });
                                }
                            }
                        });
                        //Text OP EURO ----------------------------------------------------------------------
                        if (/transfer/gi.test($('.order-payment-method-title').text())) {
                            $('#sales_order_view_tabs > ul > li#sales_order_view_tabs_custom_tabs').after(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="text_euro"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Text plata in EURO</span></a></li>`);
                            $('#text_euro').on('click auxclick', function(event) {
                                if (event.button === 0 || event.button === 1) {
                                    $(this).fadeOut().fadeIn();
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: 'https://www.bnr.ro/nbrfxrates.xml',
                                        onload: function(xhr) {
                                            try {
                                                var xml = xhr.responseText,
                                                    xmlDoc = $.parseXML(xml),
                                                    $xml = $(xmlDoc);
                                                var euro = Number($xml.find('Body > Cube > Rate[currency="EUR"]').html() || 0);
                                                var data_curs_valutar = new Date($xml.find('Header > PublishingDate').html()).toLocaleDateString('ro');
                                                var today = new Date().toLocaleDateString('ro');
                                                var publish_date_text = '';
                                                if (today !== data_curs_valutar) publish_date_text = ` în data de ${data_curs_valutar}`;
                                                if (euro) {
                                                    var nrOL = $('h1.page-title').text().replace('#','');
                                                    var total_comanda = Number($('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,''));
                                                    var suma_euro = Number((total_comanda/euro).toFixed(2)).toLocaleString('ro');
                                                    total_comanda = total_comanda.toLocaleString('ro');
                                                    euro = euro.toLocaleString('ro', {maximumFractionDigits: 4});
                                                    var text = `<p>Pentru a achita contravaloarea comenzii ${nrOL}, va trebui să faceți conversia din euro în lei la cursul valutar din ziua în care dumneavoastră efectuați plata, la care adăugați taxele aferente transferului sumei în contul nostru (taxele sunt stabilite de banca la care dumneavoastră aveți contul deschis).</p>\n<p>De exemplu, la cursul zilei de azi, ${today}, publicat de către <a href="https://www.cursbnr.ro/" target="_blank">BNR</a>${publish_date_text}, 1 euro = ${euro} lei iar valoarea comenzii plasate este de ${total_comanda} lei. Dumneavoastră va trebui să achitați ${total_comanda} / ${euro} = <strong>${suma_euro} euro</strong> + taxele aferente transferului de bani emise de bancă (pe care noi nu le cunoaștem, diferă la fiecare bancă în parte), în contul destinat exclusiv plăților în euro din bănci externe: <strong>RO75 BACX 0000 0030 1487 1002</strong>, cod SWIFT <strong>BACXROBU</strong>, deschis la banca UniCredit Bank SA.</p>`;
                                                    $('#history_comment').val(text);
                                                    $('#history_comment').trumbowyg('html', text);
                                                    $('#history_notify').prop('checked', true);
                                                    $('.order-comments-history')[0].scrollIntoView();
                                                }
                                            }
                                            catch(err) {
                                                alert(err);
                                            }
                                        },
                                        onerror: function() {
                                            alert('Eroare api BNR!');
                                        },
                                        timeout: 10000,
                                        ontimeout: function() {
                                            alert('Timeout api BNR!');
                                        }
                                    });
                                }
                            });
                        }
                        //Rate disponibile ----------------------------------------------------------
                        $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="rate_disponibile"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Rate disponibile</span></a></li>`);
                        $('#rate_disponibile').on('click auxclick', function(event) {
                            if (event.button === 0 || event.button === 1) {
                                add_style();
                                var total = Number($('.order-subtotal-table > tfoot > .col-0 > td .price').text().replace(/ |lei/g,""));
                                var taxa_ramburs = Number(($('.order-subtotal-table > tbody > tr:contains(Cost procesare plat) > td .price').text() || '0').replace(/ |lei/g,""));
                                if (total && taxa_ramburs) total = total - taxa_ramburs;
                                var rate_disponibile = $.confirm({
                                    columnClass: '',
                                    title: `Rate disponibile pentru aceasta comanda • ${total.toLocaleString('ro')} lei | <a href="https://www.dedeman.ro/ro/servicii-si-facilitati/modalitati-de-plata/plata-comenzi-online" target="_blank">Vezi pe site</a>`,
                                    content: `Loading...`,
                                    type: 'blue',
                                    closeIcon: true,
                                    buttons: false,
                                    theme: 'light,lista_comenzi',
                                    onOpenBefore: function () {
                                        var installments_listenerId = GM_addValueChangeListener("installments_session", function(key, oldValue, newValue, remote) {
                                            GM_removeValueChangeListener(installments_listenerId);
                                            var rate = JSON.parse(GM_getValue('installments') || '{}');
                                            var content = '';
                                            if (Object.keys(rate).length) {
                                                $.each(Object.keys(rate), function(i, key) {
                                                    if (key !== 'netopia') {
                                                        var row1 = '', row2 = '';
                                                        $.each(rate[key], function(i, values) {
                                                            if (values.upper_limit == '99999999.99') row1 += `<th>>= ${Number(values.lower_limit).toLocaleString('ro')} lei</th>`;
                                                            else row1 += `<th>${Number(values.lower_limit).toLocaleString('ro')} lei - ${Number(values.upper_limit).toLocaleString('ro')} lei</th>`;
                                                            if (total >= Number(values.lower_limit) && total < Number(values.upper_limit)) row2 += `<td style="background: #a0f0b4">${values.installments.replace(/,/g,', ')} rate</td>`;
                                                            else row2 += `<td>${values.installments.replace(/,/g,', ')} rate</td>`;
                                                        });
                                                        content += `<table class="rate"><tr><th rowspan="2">${metode_plata[key]}</th>${row1}</tr>
                                                    <tr>${row2}</tr></table>`;
                                                    }
                                                });
                                                rate_disponibile.setContent(content);
                                            }
                                            else rate_disponibile.setContent('Nu exista rate definite in config!');
                                        });
                                        installments_refresh();
                                    }
                                });
                            }
                        });
                        //AWB manual ------------------------------------------------------------------------
                        var shipping_method_text = $('.order-shipping-method > .admin__page-section-item-content').text();
                        var shipping_cost = Number($('.order-shipping-method > .admin__page-section-item-content .price').text().replace(/ |lei/g,'') || 0);
                        if (/dpd|fan|cargus|gls|co?urier/gi.test(shipping_method_text) || (/flota/gi.test(shipping_method_text) && shipping_cost)) {
                            GM_registerMenuCommand('Configurare e-mail curieri', function () {
                                config_email();
                            });
                            function config_email() {
                                var emails = [{value: "dpd_to", label: "DPD To:"}, {value: "dpd_cc", label: "DPD Cc:"},
                                              {value: "fan_to", label: "FAN To:"}, {value: "fan_cc", label: "FAN Cc:"},
                                              {value: "gls_to", label: "GLS To:"}, {value: "gls_cc", label: "GLS Cc:"}];
                                $.each(emails, function(i,v) {
                                    while (true) {
                                        let info_text = '\n* Valorile multiple trebuie separate prin ";"';
                                        var len = 0;
                                        if (v.value.includes('to')) len = 1;
                                        else info_text += '\n* Câmpul este opțional';
                                        let email = prompt(v.label+info_text, GM_getValue(v.value));
                                        if (regex_multiple_emails.test(email) && email.length >= len) {
                                            GM_setValue(v.value, email);
                                            break;
                                        } else alert("Adresa de e-mail nu este valida!");
                                    }
                                });
                            }
                            $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="email_curier"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor dropdown"><span>E-mail curier</span><div class="dropdown-content left-menu"><span class="urgentare-ridicare">Urgentare ridicare</span><span class="urgentare-livrare">Urgentare livrare</span><span class="returnare">Retur</span></div></a></li>`);
                            $(document).on('click', '#email_curier .dropdown-content > span', function(event) {
                                event.preventDefault();
                                store_list_refresh();
                                var obj_parent = $(this).parent();
                                obj_parent.fadeOut(100);
                                setTimeout(function() {obj_parent.removeAttr('style')}, 200);
                                var awbs = get_awbs();
                                var action = this.className;
                                if (awbs.length == 1) compose_email_curier(awbs[0], action);
                                else {
                                    add_style();
                                    if (awbs.length == 0) {
                                        $.alert({
                                            title: '',
                                            content: 'Nu am identificat niciun AWB!',
                                            type: 'red',
                                            theme: 'light,my_alert'
                                        });
                                    }
                                    else {
                                        var content = '<div>Alege un AWB:</div>';
                                        $.each(awbs, function(i,awb) {
                                            content += `<div><input name="awb_radio" id="awb_${awb}" type="radio" value="${awb}" style="margin-right: 6px;">
                                        <label for="awb_${awb}">${awb}</label></div>`;
                                        });
                                        var choose_awb = $.confirm({
                                            title: '',
                                            content: content,
                                            type: 'blue',
                                            theme: 'light,my_confirm',
                                            closeIcon: true,
                                            buttons: {
                                                Save: {
                                                    text: "Alege AWB",
                                                    btnClass: 'btn-blue',
                                                    action: function () {
                                                        compose_email_curier(choose_awb.$content.find('input:checked').val(), action);
                                                    }
                                                }
                                            },
                                            onOpenBefore: function () {
                                                choose_awb.buttons.Save.disable();
                                                choose_awb.$content.find('input').one('change', function() {
                                                    choose_awb.buttons.Save.enable();
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                            function compose_email_curier(nrAWB, tip) {
                                var to, cc;
                                if (!GM_getValue('fan_to') || !GM_getValue('dpd_to') || !GM_getValue('gls_to')) config_email();
                                reset_awb_regex_index();
                                if (regExDPD.test(nrAWB)) { //DPD
                                    to = GM_getValue('dpd_to') || '';
                                    cc = GM_getValue('dpd_cc') || '';
                                }
                                else if (regExGLS.test(nrAWB)) { //GLS
                                    to = GM_getValue('gls_to') || '';
                                    cc = GM_getValue('gls_cc') || '';
                                }
                                else if (regExFAN.test(nrAWB)) { //FAN
                                    to = GM_getValue('fan_to') || '';
                                    cc = GM_getValue('fan_cc') || '';
                                }
                                var subject, body;
                                var nrOL = $('h1.page-title').text().replace('#','');
                                if (tip == "urgentare-livrare") {
                                    var address_obj = $('.order-shipping-address > .admin__page-section-item-content');
                                    var adr_livrare = address_obj.find('b:eq(0)').text() +' ' + address_obj.find('b:eq(1)').text() + '\n'+address_obj.html().split('<br>')[1].trim()+', '+address_obj.html().split('<br>')[2].replace(', România', '').trim()+'\nTelefon: '+address_obj.find('i').text().replace(/(\d{4})(\d{3})(\d{3})/,"$1 $2 $3");
                                    subject = `Urgentare livrare ${nrOL} AWB ${nrAWB}`;
                                    body	= `Buna ziua,\n\nVa rog sa urgentati trimiterea ${nrOL} AWB ${nrAWB}, destinatar:\n${adr_livrare}\n\nVa rog sa contactati destinatarul si sa-i comunicati data si ora de livrare.\n\nMultumesc,`;
                                }
                                else if (tip == "urgentare-ridicare") {
                                    var store_no = nrOL.replace('OL','').split('1D')[0] || 0;
                                    var magazin, adresa_magazin;
                                    if (store_list[store_no]) {
                                        magazin = store_list[store_no].name;
                                        adresa_magazin = store_list[store_no].address;
                                    }
                                    subject = `Urgentare ridicare ${nrOL} AWB ${nrAWB}`;
                                    if (store_no == '30' || store_no == 'EC' || !magazin) body	= `Buna ziua,\n\nVa rog sa urgentati ridicarea comenzii ${nrOL}, AWB ${nrAWB}.\n\nMultumesc,`;
                                    else body	= `Buna ziua,\n\nVa rog sa urgentati ridicarea comenzii ${nrOL} AWB ${nrAWB}, din magazinul Dedeman ${magazin} (${adresa_magazin}), departament transport.\n\nComanda de curier este generata din aplicatie.\n\nMultumesc,`;
                                }
                                else if (tip == "returnare") {
                                    subject = `Retur la expeditor ${nrOL} AWB ${nrAWB}`;
                                    body	= `Buna ziua,\n\nVa rog sa procesati retur la expeditor ${nrOL} AWB ${nrAWB}.\nClientul a fost contactat si nu mai doreste comanda.\n\nMultumesc,`;
                                }
                                subject = encodeURIComponent(subject);
                                body = encodeURIComponent(body);
                                subject = subject.replace(/ /g,"%20");
                                body = body.replace(/ /g,"%20").replace(/\r\n|\n|\r/g,"%0D%0A");
                                if (cc) cc = 'cc='+cc+'&';
                                var txt = 'mailto:'+to+'?'+cc+'subject='+subject+'&body='+body;
                                window.location.href = txt;
                            }
                            $('#sales_order_view_tabs > ul').append(`<li class="admin__page-nav-item ui-state-default ui-corner-top" id="awb_manual"><a class="admin__page-nav-link tab-item-link ui-tabs-anchor"><span>Genereaza AWB</span></a></li>`);
                            $('#awb_manual').on('click auxclick', function(event) {
                                if (event.button === 0 || event.button === 1) {
                                    add_style();
                                    store_list_refresh();
                                    var awb = $.confirm({
                                        title: 'Genereaza AWB',
                                        content: `<table style="width: 100%;"><tbody>
                                    <tr><td width="200px">Curier</td><td><select class="my-input" id="curier" required="true"><option value="">Alege curierul...</option><option value="dpd">DPD</option><option value="dpd_cargo">DPD Cargo</option><option value="fancourier">FAN</option><option value="gls">GLS</option></select></td></tr>
                                    <tr><td>Numar comanda</td><td><input type="text" id="nrOL" class="my-input" required="true"></td></tr>
                                    <tr><td>Magazin</td><td><input type="text" id="magazin" class="my-input" required="true" disabled></td></tr>
                                    <tr style="display: none;"><td>Furnizor</td><td><select class="my-input" id="furnizor"><option value="">Alege furnizorul...</option></select></td></tr>
                                    <tr><td>Nume</td><td><input type="text" id="nume" class="my-input" required="true"></td></tr>
                                    <tr><td>Telefon</td><td><input type="tel" id="telefon" class="my-input" pattern="0[0-9]{9}" required="true"></td></tr>
                                    <tr><td>E-mail</td><td><input type="email" id="email" class="my-input"></td></tr>
                                    <tr><td>Judet</td><td><input type="text" id="judet" class="my-input" required="true"></td></tr>
                                    <tr><td>Localitate</td><td><input type="text" id="localitate" class="my-input" required="true"></td></tr>
                                    <tr><td>Strada</td><td><input type="text" id="strada" class="my-input" required="true"></td></tr>
                                    <tr><td>Numar</td><td><input type="text" id="numar" class="my-input" required="true"></td></tr>
                                    <tr><td>Detalii adresa</td><td><input type="text" id="detalii_adresa" class="my-input"></td></tr>
                                    <tr><td>Ramburs</td><td><input type="number" id="cod" class="my-input" min="0" step="0.01"></td></tr>
                                    <tr><td>Valoare declarata</td><td><input type="number" id="declared_value" min="0" step="0.01" class="my-input"></td></tr>
                                    <tr><td>Greutate</td><td><input type="number" id="greutate" min="0.01" max="10000" step="0.01" class="my-input" required="true" value="0"></td></tr>
                                    <tr><td>Numar colete</td><td><input type="number" min="1" max="30" step="1" id="my_parcels" class="my-input" value="1" required="true"></td></tr>
                                    <tr><td>SWAP</td><td><input type="checkbox" id="my_swap" style="margin: 4px 0; height: 20px; width: 20px;"></td></tr>
                                    <tr class="swap_details"><td>SWAP - Numar colete</td><td><input type="number" min="1" max="10" step="1" id="my_swap_parcels" class="my-input" value="1" required="true"></td></tr>
                                    <tr class="swap_details"><td>SWAP - Valoare declarata</td><td><input type="number" id="my_swap_declared_value" min="0" step="0.01" class="my-input" required="true"></td></tr>
                                    <tr class="swap_details"><td>SWAP - Fragil</td><td><input type="checkbox" id="my_swap_fragile" style="margin: 4px 0; height: 20px; width: 20px;"></td></tr>
                                    </tbody></table>`,
                                        type: 'blue',
                                        closeIcon: true,
                                        theme: 'light,awb',
                                        buttons: {
                                            Save: {
                                                text: "Genereaza AWB",
                                                btnClass: 'btn-blue',
                                                action: function () {
                                                    if (this.$content.find('.my-input:enabled:invalid').length) {
                                                        $.alert({
                                                            title: '',
                                                            content: 'Completeaza toate informatiile!',
                                                            type: 'red',
                                                            theme: 'light,my_alert'
                                                        });
                                                        return false;
                                                    }
                                                    else {
                                                        awb.showLoading();
                                                        awb_appliv();
                                                        return false;
                                                    }
                                                }
                                            }
                                        },
                                        onOpenBefore: function () {
                                            awb.showLoading();
                                            var parcels_obj = this.$content.find('#my_parcels');
                                            var courier_obj = this.$content.find('#curier');
                                            var swap_obj = this.$content.find('#my_swap');
                                            courier_obj.on('change', function() {
                                                swap_obj.prop('disabled', false);
                                                console.log($(this).val());
                                                if ($(this).val() == 'fancourier') parcels_obj.attr('max',30);
                                                else if (/dpd/.test($(this).val())) parcels_obj.attr('max',10);
                                                else if ($(this).val() == 'gls') parcels_obj.attr('max',99);
                                                else if ($(this).val() == 'locker') swap_obj.prop('disabled', true).prop('checked', false);
                                                swap_obj.change();
                                            });
                                            this.$content.find('.swap_details').hide();
                                            this.$content.find('.swap_details input').prop("disabled", true);
                                            swap_obj.on('change', function() {
                                                if ($(this).prop('checked') && /dpd/.test(courier_obj.val())) {
                                                    $('.swap_details').show();
                                                    $('.swap_details input').prop("disabled", false);
                                                }
                                                else {
                                                    $('.swap_details').hide();
                                                    $('.swap_details input').prop("disabled", true);
                                                }
                                                if ($(this).prop('checked')) {
                                                    if (!/-SWAP/.test(awb.$content.find('#nrOL').val())) awb.$content.find('#nrOL').val(awb.$content.find('#nrOL').val() + '-SWAP');
                                                }
                                                else awb.$content.find('#nrOL').val(awb.$content.find('#nrOL').val().replace('-SWAP', ''));
                                            });
                                            var text_livrare = $('.order-shipping-method > .admin__page-section-item-content').text();
                                            var curier = '';
                                            let locker = $('.order-shipping-method > .admin__page-section-item-content > strong > div:nth-of-type(1)').text() || '';
                                            console.log(locker);
                                            if (/locker/gmi.test(text_livrare)) curier = 'locker';
                                            else if (/fan/gmi.test(text_livrare)) curier = 'fancourier';
                                            else if (/dpd cargo/gmi.test(text_livrare)) curier = 'dpd_cargo';
                                            else if (/dpd/gmi.test(text_livrare)) curier = 'dpd';
                                            else if (/gls/gmi.test(text_livrare)) curier = 'gls';
                                            courier_obj.val(curier).change();
                                            var current_orderId = $("input[name='order_id']").val() || 0;
                                            console.log(get_products_details());
                                            magento_request({api_url:`/rest/V1/orders/${current_orderId}/`, return_fields: 'entity_id,increment_id,subtotal,grand_total,weight,items[sku,product_type],customer_email,payment[method],extension_attributes[shipping_assignments[shipping[address[entity_id]]]]'}).then(function(response) {
                                                if (response) {
                                                    $('#nrOL').val(response.increment_id);
                                                    var store_no = response.increment_id.replace('OL','').split('1D')[0] || 0;
                                                    if (store_list[store_no]) {
                                                        $('#magazin').val(store_list[store_no].name).attr('data-source_code', store_list[store_no].source_code);
                                                    }
                                                    $('#greutate').val(Number(response.weight.toFixed(2)));
                                                    $('#email').val(response.customer_email);
                                                    $('#declared_value, #my_swap_declared_value').val(Number(response.subtotal.toFixed(2)));
                                                    if (response.payment.method == 'cashondelivery') $('#cod').val(Number(response.grand_total.toFixed(2)));
                                                    var address_id = response.extension_attributes.shipping_assignments[0].shipping.address.entity_id;
                                                    GM_xmlhttpRequest({
                                                        method: "GET",
                                                        url: location.origin + '/admin/sales/order/address/address_id/' + address_id,
                                                        onload: function(xhr) {
                                                            if (xhr.status === 200) {
                                                                if (/<form id="edit_form"[^]+?<\/form>/gmi.test(xhr.responseText)) {
                                                                    var form = $($.parseHTML(xhr.responseText.match(/<form id="edit_form"[^]+?<\/form>/gmi)[0]));
                                                                    var type = form.find('#customer_type').val();
                                                                    var nume = '';
                                                                    if (type == '1') nume = form.find('#firstname').val() + ' ' + form.find('#lastname').val();
                                                                    else if (type == '2') nume = form.find('#company').val();
                                                                    else if (type == '3') nume = form.find('#pfa_name').val();
                                                                    awb.$content.find('#nume').val(nume);
                                                                    awb.$content.find('#telefon').val(form.find('#telephone').val());
                                                                    awb.$content.find('#judet').val(form.find('#region').val());
                                                                    awb.$content.find('#localitate').val(form.find('#city').val());
                                                                    awb.$content.find('#strada').val(form.find('#street0').val());
                                                                    awb.$content.find('#numar').val(form.find('#street_number').val());
                                                                    var detalii = [];
                                                                    if (form.find('#block_number').val().trim()) detalii.push('Bl. '+form.find('#block_number').val().trim());
                                                                    if (form.find('#stair').val().trim()) detalii.push('Sc. '+form.find('#stair').val().trim());
                                                                    if (form.find('#apartment').val().trim()) detalii.push('Ap. '+form.find('#apartment').val().trim());
                                                                    awb.$content.find('#detalii_adresa').val(detalii.join(', '));
                                                                    if (store_list[store_no].source_code == 'ECOM') {
                                                                        var furnizori = [];
                                                                        var detalii_furnizori = {};
                                                                        var produse = [];
                                                                        $.each(response.items, function(i,v) {
                                                                            if (v.product_type == 'simple' && !produse.includes(v.sku)) produse.push(v.sku)
                                                                        });
                                                                        GM_setValue('suppliers_done', 0);
                                                                        var suppliers_listenerId = GM_addValueChangeListener("suppliers_done", function(key, oldValue, newValue, remote) {
                                                                            if (newValue == produse.length) {
                                                                                GM_removeValueChangeListener(suppliers_listenerId);
                                                                                GM_deleteValue('suppliers_done');
                                                                                furnizori = furnizori.reduce((a, b) => a.filter(c => b.includes(c)));
                                                                                GM_setValue('supplier_names_done', 0);
                                                                                var supplier_names_listenerId = GM_addValueChangeListener("supplier_names_done", function(key, oldValue, newValue, remote) {
                                                                                    if (newValue == furnizori.length) {
                                                                                        GM_removeValueChangeListener(supplier_names_listenerId);
                                                                                        GM_deleteValue('supplier_names_done');
                                                                                        $.each(furnizori, function(i,sap_code) {
                                                                                            var selected = '';
                                                                                            if (detalii_furnizori[sap_code].active == '1') selected = ' selected';
                                                                                            var name = sap_code;
                                                                                            if (detalii_furnizori[sap_code].name) name = detalii_furnizori[sap_code].name;
                                                                                            awb.$content.find('#furnizor').append(`<option value="${sap_code}"${selected}>${name}</option>`);
                                                                                        });
                                                                                        awb.$content.find('#furnizor').attr('required', true);
                                                                                        awb.$content.find('#furnizor').closest('tr').show();
                                                                                        awb.hideLoading();
                                                                                    }
                                                                                });
                                                                                $.each(furnizori, function(i,sap_code) {
                                                                                    magento_mui_request({namespace:`suppliers_listing&filters[sap_code]=${sap_code}`}).then(function(response) {
                                                                                        if (response.items.length) {
                                                                                            $.each(response.items, function(index, value) {
                                                                                                if (value.sap_code == sap_code) {
                                                                                                    detalii_furnizori[value.sap_code].name = value.name;
                                                                                                    return false;
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                        GM_setValue('supplier_names_done', GM_getValue('supplier_names_done') + 1);
                                                                                    }).catch(function(e) {
                                                                                        GM_setValue('supplier_names_done', GM_getValue('supplier_names_done') + 1);
                                                                                        console.log(e);
                                                                                    });
                                                                                });
                                                                            }
                                                                        });
                                                                        $.each(produse, function(i,sku) {
                                                                            magento_mui_request({namespace:`product_suppliers_listing&sku=${sku}`}).then(function(response) {
                                                                                let furnizori_produs = [];
                                                                                if (response.items.length) {
                                                                                    $.each(response.items, function(index, value) {
                                                                                        furnizori_produs.push(value.supplier_sap_code);
                                                                                        detalii_furnizori[value.supplier_sap_code] = {active: value.active};
                                                                                    });
                                                                                    furnizori.push(furnizori_produs);
                                                                                }
                                                                                GM_setValue('suppliers_done', GM_getValue('suppliers_done') + 1);
                                                                            }).catch(function(e) {
                                                                                GM_removeValueChangeListener(suppliers_listenerId);
                                                                                GM_deleteValue('suppliers_done');
                                                                                console.log(e);
                                                                                awb.setContent('Nu am putut prelua informatille despre furnizor!');
                                                                                awb.buttons.Save.hide();
                                                                                awb.hideLoading();
                                                                            });
                                                                        });
                                                                    }
                                                                    else awb.hideLoading();
                                                                }
                                                                else {
                                                                    awb.setContent('Nu am putut prelua informatille de livrare!');
                                                                    awb.buttons.Save.hide();
                                                                    awb.hideLoading();
                                                                }
                                                            }
                                                            else {
                                                                awb.setContent('Status '+xhr.status+' - '+xhr.statusText || xhr.responseText);
                                                                awb.buttons.Save.hide();
                                                                awb.hideLoading();
                                                            }
                                                        }
                                                    });
                                                }
                                            }).catch(function(e) {
                                                awb.setContent(e);
                                                awb.buttons.Save.hide();
                                                awb.hideLoading();
                                            });
                                        }
                                    });
                                    function awb_appliv() {
                                        console.log('create awb');
                                        var furnizor = '';
                                        var magazin = awb.$content.find('#magazin').data('source_code');
                                        if (magazin == 'ECOM') {
                                            magazin = '';
                                            furnizor = awb.$content.find('#furnizor').val();
                                        }
                                        var data = {
                                            "delivery_methods": [awb.$content.find('#curier').val().replace('_cargo','')],
                                            "recipient": {
                                                "name": awb.$content.find('#nume').val(),
                                                "phone": awb.$content.find('#telefon').val(),
                                                "email": awb.$content.find('#email').val(),
                                                "county": awb.$content.find('#judet').val(),
                                                "locality": awb.$content.find('#localitate').val(),
                                                "street": awb.$content.find('#strada').val(),
                                                "number": awb.$content.find('#numar').val(),
                                                "address": awb.$content.find('#detalii_adresa').val()
                                            },
                                            "weight": awb.$content.find('#greutate').val(),
                                            "cod": awb.$content.find('#cod').val() || 0,
                                            "declared_value": awb.$content.find('#declared_value').val() || 0,
                                            "store": magazin,
                                            "supplier": furnizor,
                                            "parcels": awb.$content.find('#my_parcels').val(),
                                            "fragile": 1,
                                            "reference": awb.$content.find('#nrOL').val(),
                                            "swap": awb.$content.find('#my_swap').prop('checked'),
                                        };
                                        if (data.swap) {
                                            let swap_data = {"swap_data": {
                                                "parcels_count": awb.$content.find('#my_swap_parcels').val(),
                                                "val_decl": awb.$content.find('#my_swap_declared_value').val(),
                                                "fragile": awb.$content.find('#my_swap_fragile').prop('checked')
                                            }
                                                            };
                                            data = {...data, ...swap_data};
                                        }
                                        if (awb.$content.find('#curier').val().includes('cargo')) {
                                            let cargo = {"cargo": true};
                                            data = {...data, ...cargo};
                                        }
                                        console.log(data);
                                        let swap_text = '';
                                        if (awb.$content.find('#my_swap').prop('checked')) swap_text = 'cu SWAP ';
                                        appliv_request({url:'awb', method: 'POST', data: data}).then(function(response) {
                                            var mesaj = `A fost creat AWB-ul ${swap_text}<a href="${response.tracking_url || ''}" target="_blank">${response.code}</a> in AppLiv, pentru curierul ${$('#curier').find('option:selected').text()}`;
                                            awb.close();
                                            write_msg(mesaj, 1);
                                        }).catch(function(e) {
                                            $.alert({
                                                title: 'Eroare appliv!',
                                                content: e,
                                                type: 'red',
                                                theme: 'light,my_alert',
                                                onDestroy: function () {awb.hideLoading();}
                                            });
                                            return false;
                                        });
                                    }
                                }
                            });
                            $(document).on('click', '.note-list-comment a[href^="https://tracking.dpd.ro/"], .note-list-comment a[href^="https://www.fancourier.ro/awb.php"], .note-list-comment a[href^="https://gls-group.com/RO/ro/urmarire-colet"]', function(e) {
                                e.preventDefault();
                                var awb = $(this).text();
                                var url = $(this).attr('href');
                                var curier = '';
                                var id = 0;
                                if (/\d+/.test(awb)) {
                                    add_style();
                                    var awb_act = $.confirm({
                                        title: '',
                                        content: '',
                                        type: 'blue',
                                        closeIcon: true,
                                        theme: 'light,my_confirm',
                                        buttons: {
                                            Print: {
                                                text: "Printeaza AWB",
                                                btnClass: 'btn-blue',
                                                action: function () {
                                                    awb_act.showLoading();
                                                    if (curier !== 'dpd') {
                                                        appliv_request({url:'awb_print/'+id, method: 'GET'}).then(function(response) {
                                                            var blob = new Blob([response], { type: 'application/pdf' });
                                                            var link = document.createElement('a');
                                                            link.href = window.URL.createObjectURL(blob);
                                                            link.download = 'AWB '+awb+' - '+nrOL+'.pdf';
                                                            awb_act.close();
                                                            link.click();
                                                        }).catch(function(e) {
                                                            $.alert({
                                                                title: 'Eroare appliv!',
                                                                content: e,
                                                                type: 'red',
                                                                theme: 'light,my_alert',
                                                                onDestroy: function () {awb_act.hideLoading();}
                                                            });
                                                            return false;
                                                        });
                                                    }
                                                    else {
                                                        var parcels = [];
                                                        dpd_request({api_url:'shipment/info', method: 'GET', get_params: `&shipmentIds=${awb}`}).then(function(response) {
                                                            console.log(response);
                                                            if (response.shipments.length) {
                                                                $.each(response.shipments, function(index, value) {
                                                                    if (value.id == awb) {
                                                                        $.each(value.content.parcels, function(index, value) {
                                                                            parcels.push(value.id);
                                                                        });
                                                                        dpd_request({api_url:'print', method: 'GET', get_params: `&additionalWaybillSenderCopy=NONE&paperSize=A6&parcels=${parcels.join('|')}`}).then(function(response) {
                                                                            var blob = new Blob([response], { type: 'application/pdf' });
                                                                            var link = document.createElement('a');
                                                                            link.href = window.URL.createObjectURL(blob);
                                                                            link.download = 'AWB '+awb+' - '+nrOL+'.pdf';
                                                                            awb_act.close();
                                                                            link.click();
                                                                        }).catch(function(e) {
                                                                            $.alert({
                                                                                title: 'Eroare DPD!',
                                                                                content: e,
                                                                                type: 'red',
                                                                                theme: 'light,my_alert',
                                                                                onDestroy: function () {awb_act.hideLoading();}
                                                                            });
                                                                            return false;
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                if (response.error) {
                                                                    $.alert({
                                                                        title: 'Eroare DPD!',
                                                                        content: response.error.message,
                                                                        type: 'red',
                                                                        theme: 'light,my_alert',
                                                                        onDestroy: function () {awb_act.hideLoading();}
                                                                    });
                                                                    return false;
                                                                }
                                                                else {
                                                                    $.alert({
                                                                        title: 'Eroare DPD!',
                                                                        content: '',
                                                                        type: 'red',
                                                                        theme: 'light,my_alert',
                                                                        onDestroy: function () {awb_act.hideLoading();}
                                                                    });
                                                                    return false;
                                                                }
                                                            }

                                                        }).catch(function(e) {
                                                            $.alert({
                                                                title: 'Eroare DPD!',
                                                                content: e,
                                                                type: 'red',
                                                                theme: 'light,my_alert',
                                                                onDestroy: function () {awb_act.hideLoading();}
                                                            });
                                                            return false;
                                                        });
                                                    }
                                                    return false;
                                                }
                                            },
                                            Update: {
                                                text: "Modifica nr. colete",
                                                btnClass: 'btn-purple',
                                                action: function () {
                                                    awb_act.showLoading();
                                                    var parcels = 0;
                                                    $.confirm({
                                                        title: '',
                                                        content: `<label for="new_parcels">Numar colete:</label><input type="number" min="1" max="10" step="1" id="new_parcels" class="my-input" value="0" required="true">`,
                                                        type: 'blue',
                                                        theme: 'light,my_confirm',
                                                        closeIcon: true,
                                                        buttons: {
                                                            OK: {
                                                                text: "OK",
                                                                btnClass: 'btn-blue',
                                                                action: function () {
                                                                    if (this.$content.find('.my-input:invalid').length == 0) {
                                                                        parcels = this.$content.find('#new_parcels').val();
                                                                        dpd_request({api_url:'shipment/update/properties', method: 'POST', data: {id: awb,
                                                                                                                                                  properties:{parcelsCount:parcels}}}).then(function(response) {
                                                                            if (response.id) {
                                                                                $.alert({
                                                                                    title: '',
                                                                                    content: 'AWB-ul a fost actualizat!',
                                                                                    type: 'green',
                                                                                    theme: 'light,my_alert',
                                                                                    onDestroy: function () {awb_act.hideLoading();}
                                                                                });
                                                                            }
                                                                            else {
                                                                                if (response.error) {
                                                                                    $.alert({
                                                                                        title: 'Eroare DPD!',
                                                                                        content: response.error.message,
                                                                                        type: 'red',
                                                                                        theme: 'light,my_alert',
                                                                                        onDestroy: function () {awb_act.hideLoading();}
                                                                                    });
                                                                                    return false;
                                                                                }
                                                                                else {
                                                                                    $.alert({
                                                                                        title: 'Eroare DPD!',
                                                                                        content: '',
                                                                                        type: 'red',
                                                                                        theme: 'light,my_alert',
                                                                                        onDestroy: function () {awb_act.hideLoading();}
                                                                                    });
                                                                                    return false;
                                                                                }
                                                                            }

                                                                        }).catch(function(e) {
                                                                            $.alert({
                                                                                title: 'Eroare DPD!',
                                                                                content: e,
                                                                                type: 'red',
                                                                                theme: 'light,my_alert',
                                                                                onDestroy: function () {awb_act.hideLoading();}
                                                                            });
                                                                            return false;
                                                                        });
                                                                    }
                                                                    else {
                                                                        $.alert({
                                                                            title: '',
                                                                            content: 'Completeaza numarul de colete!',
                                                                            type: 'red',
                                                                            theme: 'light,my_alert'
                                                                        });
                                                                        return false;
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        onDestroy: function () {awb_act.hideLoading();}
                                                    });
                                                    return false;
                                                }
                                            },
                                            Delete: {
                                                text: "Sterge AWB",
                                                btnClass: 'btn-red',
                                                action: function () {
                                                    awb_act.showLoading();
                                                    appliv_request({url:'awb/'+id, method: 'DELETE'}).then(function(response) {
                                                        awb_act.close();
                                                        $.alert({
                                                            title: 'AWB-ul a fost sters!',
                                                            content: '',
                                                            type: 'green',
                                                            theme: 'light,my_alert'
                                                        });
                                                    }).catch(function(e) {
                                                        $.alert({
                                                            title: 'Eroare appliv!',
                                                            content: e,
                                                            type: 'red',
                                                            theme: 'light,my_alert',
                                                            onDestroy: function () {awb_act.hideLoading();}
                                                        });
                                                        return false;
                                                    });
                                                    return false;
                                                }
                                            }
                                        },
                                        onOpenBefore: function () {
                                            awb_act.showLoading();
                                            appliv_request({url:'awb_track', method: 'POST', data: {codes: [awb]}}).then(function(response) {
                                                if (response.length) {
                                                    id = response[0].id;
                                                    curier = response[0].delivery_method;
                                                    awb_act.setContent(`AWB <a href="${url}" target="_blank">${awb}</a>`);
                                                    if (curier !== 'dpd') awb_act.$$Update.hide();
                                                }
                                                else {
                                                    awb_act.setContent(`AWB-ul <a href="${url}" target="_blank">${awb}</a> nu exista in AppLiv!`);
                                                    awb_act.$btnc.hide();
                                                }
                                                awb_act.hideLoading();
                                            }).catch(function(e) {
                                                $.alert({
                                                    title: 'Eroare appliv!',
                                                    content: e,
                                                    type: 'red',
                                                    theme: 'light,my_alert',
                                                    onDestroy: function () {awb_act.close();}
                                                });
                                            });
                                        }
                                    });
                                }
                                else alert('Nu am gasit awb-ul!');
                            });
                        }
                        function write_msg(text, submit) {
                            $('#order_history_block')[0].scrollIntoView();
                            $('#history_comment').trumbowyg('html', text);
                            $('.order-history-comments-options input:checked').prop('checked', false);
                            if (submit) send_comment();
                        }
                        //Zile deservite DPD -------------------------------------------------------------------------------------------------------------------
                        if (/dpd/gi.test($('.order-shipping-method > .admin__page-section-item-content').text())) {
                            $('.order-shipping-method > .admin__page-section-item-title').append(`<a id="info_livrare" style="margin-left: 0.5rem; float: right; line-height: 24px;">Zile deservite DPD</a>`);
                            $('#info_livrare').click(function() {
                                add_style();
                                var adr = $('.order-shipping-address > address').html();
                                var loc = adr.split('<br>')[2].split(',')[0].trim().toUpperCase();
                                var jud = adr.split('<br>')[2].split(',')[1].trim().toUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
                                var loc_copy = loc.replace(/\d/g, '').replace(/-/g, ' ').trim().split(' ')[0];
                                var comuna = '';
                                var loc_fara_comuna = '';
                                if (/\(.+\)/.test(loc)) {
                                    comuna = loc.match(/\(.+\)/)[0].replace(/\(|\)|-| /g,'');
                                    loc_fara_comuna = loc.replace(/\(.+\)|-| /g,'');
                                }
                                var jud_copy = jud.replace(/ - sector \d/i,'').replace(/-/g, ' ').split(' ')[0];
                                var zile_livrare = $.confirm({
                                    columnClass: '',
                                    title: `Livrare prin DPD in <span style="color: #007bdb;">${loc}, ${jud}</span>`,
                                    content: `Loading...`,
                                    type: 'blue',
                                    closeIcon: true,
                                    buttons: false,
                                    theme: 'light,lista_comenzi',
                                    onOpenBefore: function () {
                                        dpd_request({api_url:`location/site/`, method: 'GET', get_params: `&countryId=642&name=${loc_copy}&region=${jud_copy}`}).then(function(response) {
                                            var content ='';
                                            if (response.error) content = 'Eroare DPD!<br>'+response.error.message;
                                            else if (response.sites) {
                                                response = response.sites;
                                                for (var i=0; i<response.length; i++) {
                                                    if (response[i].region.replace(/-| /g, '') == jud.replace(/ - sector \d|-| /gi, '') && response[i].name.replace(/-| /g, '') == loc.replace(/-| /g, '')) {
                                                        //found
                                                        content = `<table id="info_curier"><tr><th rowspan="2">Judet</th><th rowspan="2">Localitate</th><th colspan="7">Zile deservite</th></tr><tr><th>Luni</th><th>Marti</th><th>Miercuri</th><th>Joi</th><th>Vineri</th><th>Sambata</th><th>Duminica</th></tr><tr><td>${response[i].region}</td><td>${response[i].name}</td>`;
                                                        $.each(response[i].servingDays.split(''), function(i, v) {
                                                            if (v === '1') content += `<td><span style="color:green; font-size: 18px;">&#10003;</span></td>`;
                                                            else content += `<td><span style="color:red; font-size: 18px;">&#10007;</span></td>`;
                                                        });
                                                        content += '</tr></table>';
                                                        break;
                                                    }
                                                    else if (comuna && response[i].municipality.replace(/-| /g, '').includes(comuna) && response[i].region.replace(/-| /g, '') == jud.replace(/ - sector \d|-| /gi, '') && response[i].name.replace(/-| /g, '') == loc_fara_comuna) {
                                                        //found
                                                        content = `<table id="info_curier"><tr><th rowspan="2">Judet</th><th rowspan="2">Localitate</th><th colspan="7">Zile deservite</th></tr><tr><th>Luni</th><th>Marti</th><th>Miercuri</th><th>Joi</th><th>Vineri</th><th>Sambata</th><th>Duminica</th></tr><tr><td>${response[i].region}</td><td>${response[i].name} (${response[i].municipality})</td>`;
                                                        $.each(response[i].servingDays.split(''), function(i, v) {
                                                            if (v === '1') content += `<td><span style="color:green; font-size: 18px;">&#10003;</span></td>`;
                                                            else content += `<td><span style="color:red; font-size: 18px;">&#10007;</span></td>`;
                                                        });
                                                        content += '</tr></table>';
                                                        break;
                                                    }
                                                }
                                                if (!content) content = 'Nu am gasit <span style="color: blue;">'+loc+', '+jud+'</span> in nomenclatorul DPD!';
                                            }
                                            else content = 'Nu am gasit <span style="color: blue;">'+loc+', '+jud+'</span> in nomenclatorul DPD!';
                                            zile_livrare.setContent(content);
                                        }).catch(function(e) {
                                            zile_livrare.setContent(e);
                                        });
                                    }
                                });
                            });
                        }
                        //Cost livrare -------------------------------------------------------------------------------------------------------------------
                        $('.order-shipping-address > .admin__page-section-item-title').append(`<a id="cost_livrare" style="margin-left: 0.5rem; float: right; line-height: 24px;">Cost livrare</a>`);
                        $('#cost_livrare').click(function() {
                            add_style();
                            current_orderId = $("input[name='order_id']").val();
                            raspuns_api = $.confirm({
                                columnClass: '',
                                title: `Cost livrare`,
                                content: `Loading...`,
                                type: 'blue',
                                closeIcon: true,
                                buttons: false,
                                theme: 'light,cost_livrare',
                            });
                            store_list_refresh();
                            get_shipping_cost();
                        });
                    });
                    var datalist = '';
                    for (const [judet, value] of Object.entries(judete)) {
                        datalist += `<option value="${judet}" data-id="${value.id}">`;
                    }
                    $(document).on('click', '.adresa_livrare', function() {
                        $.confirm({
                            columnClass: '',
                            title: `Alege alta adresa de livrare`,
                            content: `
                        <div class="admin__form-field"><label class="admin__form-field-label" for="judet">Judet</label>
                        <div class="admin__form-field-control"><input class="admin__control-text" type="text" name="judet" id="judet" list="lista_judete" pattern="^(${Object.keys(judete).join('|')})$" required></div>
                        <datalist id="lista_judete">${datalist}</datalist></div>
                        <div class="admin__form-field" style="margin-top: 10px;"><label class="admin__form-field-label" for="localitate">Localitate</label>
                        <div class="admin__form-field-control"><input class="admin__control-text" type="text" name="localitate" id="localitate" list="lista_localitati" required></div><datalist id="lista_localitati"></datalist></div>
                        `,
                            type: 'blue',
                            closeIcon: true,
                            buttons: {
                                Save: {
                                    text: "Salveaza",
                                    btnClass: 'btn-blue',
                                    action: function () {
                                        if ($('#localitate').is(':valid') && $('#judet').is(':valid')) {
                                            raspuns_api.setContent('<div></div>');
                                            raspuns_api.showLoading();
                                            get_shipping_cost(judete[$('#judet').val()].nume, $('#localitate').val());
                                        }
                                        else return false;
                                    }
                                }
                            },
                            theme: 'light,cost_livrare'
                        });
                    });
                    $(document).on('change', '#judet', function() {
                        $('#localitate').addClass('disabled').val('');
                        if ($(this).is(':valid')) {
                            var judet_selectat = $('datalist#lista_judete').find('option[value="' + $('#judet').val() + '"]');
                            if (judet_selectat.length) {
                                var id_judet = judet_selectat.data('id');
                                if (id_judet) {
                                    magento_request({api_url:'/rest/all/V1/city?regionId='+id_judet}).then(function(response) {
                                        console.log(response);
                                        if (response.cities.length) {
                                            var lista_localitati_datalist = '';
                                            var lista_localitati_pattern = [];
                                            $.each(response.cities, function(i, value) {
                                                lista_localitati_datalist += `<option value="${value.name}">`;
                                                lista_localitati_pattern.push(value.name);
                                            });
                                            $('datalist#lista_localitati').html(lista_localitati_datalist);
                                            $('#localitate').attr('pattern', `^(${lista_localitati_pattern.join('|').replace(/\(/g, '\\\(').replace(/\)/g, '\\\)')})$`);
                                            $('#localitate').removeClass('disabled');
                                        }
                                    }).catch(function(e) {
                                        alert(e);
                                    });
                                }
                            }
                        }
                    });
                    var current_orderId, raspuns_api, restrictie_curier = 0;
                    function get_shipping_cost(jud, loc) {
                        magento_request({api_url:`/rest/V1/orders/${current_orderId}/`, return_fields: 'entity_id,increment_id,base_subtotal,weight,extension_attributes[shipping_assignments],items'}).then(function(response) {
                            if (response) {
                                var increment_id = response.increment_id;
                                var store_no = increment_id.replace('OL','').split('1D')[0] || 0;
                                var magazin_curent = '';
                                if (store_list[store_no]) magazin_curent = store_list[store_no].source_code;
                                var judet = jud || response.extension_attributes.shipping_assignments[0].shipping.address.region;
                                var localitate = loc || response.extension_attributes.shipping_assignments[0].shipping.address.city;
                                console.log(judet, localitate);
                                magento_mui_request({namespace:`coldo_dedefleet_fleetrates_listing&filters[name]=${judet}&filters[city]=${localitate}`}).then(function(response_zone) {
                                    if (response_zone.items) {
                                        var costuri = [];
                                        $.each(response_zone.items, function(index, value) {
                                            if (value.name.toLowerCase() == judet.toLowerCase() && value.city.toLowerCase() == localitate.toLowerCase()) costuri.push({area: value.price_area, store_sap_code: value.source_code, price_dedemanfleet: Number(value.transport_cost) || 0});
                                        });
                                        if (costuri) {
                                            costuri.sort(function(left, right) {
                                                var area_order = left.area.localeCompare(right.area);
                                                var source_order = left.store_sap_code.localeCompare(right.store_sap_code);
                                                return area_order || source_order;
                                            });
                                        }
                                        console.log(costuri);
                                        var content = '';
                                        var title = '';
                                        var total_comanda = Number(response.base_subtotal.toFixed(2));
                                        //var greutate_comanda = response.weight;
                                        var greutate_comanda = 0;
                                        var produse = [];
                                        var cantitati = {};
                                        $.each(response.items, function(index, value) {
                                            if (value.product_type === 'simple') {
                                                if (!produse.includes(value.sku)) produse.push(value.sku);
                                                cantitati[value.sku] = (cantitati[value.sku] || 0) + value.qty_ordered;
                                            }
                                        });
                                        if (produse.length) {
                                            //get products details -------------------------------------------------------------------------------------------------------------------
                                            magento_request({api_url:`/rest/V1/products/`, search_field: 'sku', search_values: produse, condition_type: 'in', return_fields: 'sku,weight,custom_attributes[is_heavy_product,qty_to_use_heavy_fleet,min_qty_for_pallet,max_qty_for_pallet,is_volumetric,qty_req_volumetric,volume,unit_volume,restrict_shipping,restrict_shipping_methods]'}).then(function(response) {
                                                var heavy_fleet = 0, paleti = 0, greutate_volumetrica_fan = 0;
                                                $.each(response.items, function(i, val) {
                                                    var is_volumetric, qty_req_volumetric, is_heavy_product, qty_to_use_heavy_fleet, volum, um_volum, min_qty_for_pallet, max_qty_for_pallet, restrict_shipping, restrict_shipping_methods;
                                                    $.each(val.custom_attributes, function(index, value) {
                                                        if (value.attribute_code == 'is_heavy_product') is_heavy_product = Number(value.value);
                                                        else if (value.attribute_code == 'qty_to_use_heavy_fleet') qty_to_use_heavy_fleet = Number(value.value);
                                                        else if (value.attribute_code == 'min_qty_for_pallet') min_qty_for_pallet = Number(value.value);
                                                        else if (value.attribute_code == 'max_qty_for_pallet') max_qty_for_pallet = Number(value.value);
                                                        else if (value.attribute_code == 'is_volumetric') is_volumetric = Number(value.value);
                                                        else if (value.attribute_code == 'qty_req_volumetric') qty_req_volumetric = Number(value.value);
                                                        else if (value.attribute_code == 'volume') volum = Number(value.value);
                                                        else if (value.attribute_code == 'unit_volume') um_volum = value.value;
                                                        else if (value.attribute_code == 'restrict_shipping') restrict_shipping = value.value;
                                                        else if (value.attribute_code == 'restrict_shipping_methods') restrict_shipping_methods = value.value;
                                                    });
                                                    let greutate_volumetrica = get_volume_weight(volum, um_volum);
                                                    greutate_volumetrica_fan = greutate_volumetrica_fan + (greutate_volumetrica[6000] || 0) * cantitati[val.sku];
                                                    if (is_volumetric && cantitati[val.sku] > qty_req_volumetric) greutate_comanda = greutate_comanda + cantitati[val.sku] * greutate_volumetrica[6000];
                                                    else greutate_comanda = greutate_comanda + cantitati[val.sku] * val.weight;
                                                    if (is_heavy_product && cantitati[val.sku] >= qty_to_use_heavy_fleet) {
                                                        heavy_fleet = 1;
                                                        paleti = paleti + Math.trunc(((cantitati[val.sku] - min_qty_for_pallet)/max_qty_for_pallet)+1);
                                                    }
                                                    if (restrict_shipping == 1 && (/courier/.test(restrict_shipping_methods) || (/^(?=.*dpd)(?=.*fancourier)(?=.*gls)/.test(restrict_shipping_methods)))) restrictie_curier = 1;
                                                });
                                                if (heavy_fleet) {
                                                    var transport = 'Transport materiale grele';
                                                    $.alert({
                                                        title: '<span style="font-size: 30px;color: red;margin-right: 10px;">⚠</span><span style="font-size: 20px; line-height: 26px;">Atenție!</span>',
                                                        content: 'Pentru această comandă se aplică <span style="color: red;font-weight: bold;">' + transport + '</span>!',
                                                        type: 'red',
                                                        theme: 'light,my_alert'
                                                    });
                                                }
                                                title = `Cost livrare în <a class="adresa_livrare hint--bottom hint--rounded" aria-label="Click pentru a modifica adresa de livrare!" data-judet="${judet}" data-localitate="${localitate}">${localitate}, ${judet}</a> pentru ${increment_id} | ${total_comanda.toLocaleString('ro-RO', {maximumFractionDigits: 2})} lei, greutate ${greutate_comanda.toLocaleString('ro-RO', {maximumFractionDigits: 2})} kg`;
                                                if (heavy_fleet == 1) {
                                                    if (paleti == 1) title += `, 1 palet `;
                                                    else title += `, ${paleti} paleți `;
                                                }
                                                else if (greutate_volumetrica_fan) title += `, greutate volumetrică ${greutate_volumetrica_fan.toLocaleString('ro-RO', {maximumFractionDigits: 2})} kg `;
                                                title += `<span id="cost_curier"></span>`;
                                                raspuns_api.setTitle(title);
                                                var data = {
                                                    "delivery_methods": ["courier"],
                                                    "weight": greutate_comanda,
                                                    "value": total_comanda,
                                                    "store": "LOGI",
                                                    "county": judet,
                                                    "locality": localitate,
                                                    "street": localitate,
                                                    "pallets": 0
                                                };
                                                get_appliv_cost(data, $('#cost_curier'));
                                                if (!costuri) {
                                                    raspuns_api.setContent(`Nu există magazine care să livreze în ${localitate}, ${judet}!`);
                                                    return false;
                                                }
                                                content = '<table id="costuri"><thead><tr><th>Magazin</th><th>Zona</th><th style="white-space: nowrap;">Flota Standard</th>';
                                                if (heavy_fleet) content += '<th style="white-space: nowrap;">Transport materiale grele</th>';
                                                content += '</tr></thead>';
                                                if (costuri.length) {
                                                    $.each(costuri, function(j, cost) {
                                                        var magazin = cost.store_sap_code;
                                                        var nume_magazin = magazin;
                                                        var zona = cost.area;
                                                        const store = Object.values(store_list).find((element) => element.source_code == magazin);
                                                        if (store) nume_magazin = store.name;
                                                        if (magazin == magazin_curent) content += '<tbody class="tbl-current">';
                                                        else content += '<tbody>';
                                                        content += `<tr data-cod_magazin="${magazin}"><td class="hint--top hint--rounded" aria-label="${magazin}">${nume_magazin}</td><td>${zona}</td><td class="cost_curent dedemanfleet"><div class="loader"></div></td>`;
                                                        if (heavy_fleet) content += `<td class="cost_curent dedemanheavyfleet"><div class="loader"></div></td>`;
                                                        content += '</tr></tbody>';
                                                    });
                                                }
                                                else content += `<tbody><tr><td colspan="20">Nu sunt magazine care sa livreze in aceasta adresa!</td></tr></tbody>`;
                                                content += '</table>';
                                                raspuns_api.setContent(content);
                                                raspuns_api.hideLoading();
                                                var methods = ["dedemanfleet"];
                                                if (heavy_fleet) methods = ["dedemanfleet", "dedemanheavyfleet"];
                                                $('#costuri tbody > tr').each(function() {
                                                    var data = {
                                                        "delivery_methods": methods,
                                                        "weight": greutate_comanda,
                                                        "value": total_comanda,
                                                        "store": $(this).data('cod_magazin'),
                                                        "county": judet,
                                                        "locality": localitate,
                                                        "street": localitate,
                                                        "pallets": paleti
                                                    };
                                                    get_appliv_cost(data, $(this));
                                                });
                                            }).catch(function(e) {
                                                raspuns_api.setContent(e);
                                            });
                                        }
                                    }
                                }).catch(function(e) {
                                    raspuns_api.setContent(e);
                                });
                            }
                            else if (response.message) raspuns_api.setContent(response.message);
                            else raspuns_api.setContent('Nu am gasit detaliile comenzi!');
                        }).catch(function(e) {
                            raspuns_api.setContent(e);
                        });
                    }
                    function get_appliv_cost(data, obj) {
                        console.log(data);
                        appliv_request({url:'shipping_tax', method: 'POST', data: data}).then(function(response) {
                            console.log(response);
                            if (obj.attr('id') == 'cost_curier') {
                                let cost_curier = '-';
                                if (response[0].status) cost_curier = response[0].price.toLocaleString('ro-RO') + ' lei';
                                var text = ' | Cost livrare curier: <span style="cursor: default; user-select: all;">' + cost_curier + '</span>';
                                var clasa = '';
                                if (restrictie_curier) {
                                    text += `<span style="color: red;">*</span>`;
                                    clasa = 'hint--bottom hint--rounded';
                                }
                                obj.html(text).addClass(clasa).attr('aria-label','Comanda are restrictie la livrarea prin curier!');
                            }
                            else {
                                $.each(response, function(i, value) {
                                    let cost = '-';
                                    if (value.status) cost = (value.price + (value.services[0]?.price || 0)).toLocaleString('ro-RO') + ' lei';
                                    obj.find(`.${value.delivery_method}`).html(cost);
                                });
                            }
                        }).catch(function(e) {
                            if (obj.attr('id') !== 'cost_curier') obj.find('.cost_curent').html('Eroare AppLiv!');
                            console.log(e);
                        });
                    }
                }
                else if (location.href.includes('/admin/swap/order/view/id/')) {
                    console.log('view swap order');
                    GM_addStyle('h1.page-title {cursor: pointer; display: inline-block;} h1.page-title:hover {text-decoration: underline;}');
                    //Copy order link
                    $(document).on('auxclick', 'h1.page-title', function(e) {
                        if (e.button === 1) {
                            var nrOL = $(this).text().replace('Comanda Swap #','');
                            var text = `<a href="${location.href}" target="_blank">${nrOL}</a>`;
                            $(this).fadeOut().fadeIn();
                            copy_text(nrOL, text);
                        }
                    });
                }
                else if (location.href.includes('/admin/sales/order/address/address_id/')) {
                    if (sessionStorage.getItem('block_pj')) {
                        $(document).ready(function() {
                            waitForElm('#customer_type').then((elm) => {
                                elm.on('change', function() {
                                    if (elm.val() !== '1') alert(sessionStorage.getItem('block_pj'));
                                }).change();
                            });
                        });
                    }
                    search_select_actions();
                    GM_addStyle(`#region_id, select#city {display: none !important;}`);
                    waitForElm('#city').then((elm) => {
                        var country = $('#country_id').val();
                        var region = $('#region').val();
                        var city = $('#city').val();
                        var region_options = get_search_select_options('regions');
                        $('#region').after(get_search_select_text('my-region', region_options)).hide();
                        $(document).on('change', '.my-region .my-value', function() {
                            $('.my-city').addClass('disabled').find('.my-value').html('');
                            var id_judet = $(this).closest('.my-region').find('._selected').data('id') || 0;
                            var nume_judet = $(this).closest('.my-region').find('._selected').data('nume') || '';
                            if (id_judet) {
                                $(this).closest('form').find('#region_id').val(id_judet).trigger("change");
                                $(this).closest('form').find('#region').val(nume_judet);
                                magento_request({api_url:'/rest/all/V1/city?regionId='+id_judet}).then(function(response) {
                                    if (response.cities.length) {
                                        var lista_localitati = get_search_select_options(response);
                                        $('.my-city .admin__action-multiselect-menu-inner').html(lista_localitati);
                                        $('.my-city .my-select-search').val('');
                                        $('.my-city').removeClass('disabled');
                                        if (city) {
                                            $(`.my-city .action-menu-item[data-nume="${city}"]`).addClass('_selected');
                                            $('.my-city .my-value').html(city).change();
                                            city = 0;
                                        }
                                    }
                                }).catch(function(e) {
                                    alert(e);
                                });
                            }
                        });
                        $(`.my-region .action-menu-item[data-nume="${region}"]`).addClass('_selected');
                        $('.my-region .my-value').html(region).change();
                        $('#city').after(get_search_select_text('my-city', ''));
                        $(document).on('change', '.my-city .my-value', function() {
                            var new_city = $(this).closest('.my-city').find('._selected').data('nume') || '';
                            $(this).closest('form').find('input[name=city]').val(new_city).trigger("change");
                            $(this).closest('form').find('#city').val(new_city).trigger("change");
                        });
                        $('#country_id').on('change', function() {
                            if ($(this).val() === 'RO') {
                                $('.my-region, .my-city').show();
                                $(this).closest('form').find('input[name=city]').hide();
                                if (!$('.my-city .admin__action-multiselect-search').length) $('.my-city .admin__action-multiselect-search-wrap').prepend('<input class="admin__control-text admin__action-multiselect-search" type="text" name="my-city-search">');
                            }
                            else {
                                $('.my-region, .my-city').hide();
                                $('.my-city .admin__action-multiselect-search').remove();
                            }
                        }).change();
                        for (const [key, value] of Object.entries(tari)) {
                            if ( $(`#country_id option[value=${key}]`).length == 0 ) {
                                $('#country_id').append(`<option value="${key}">${value}</option>`);
                            }
                        }
                        var country_options = get_search_select_options('tari');
                        $('#country_id').after(get_search_select_text('my-country', country_options)).hide();
                        $(`.my-country .action-menu-item[data-id="${country}"]`).addClass('_selected');
                        $('.my-country .my-value').html($(`.my-country .action-menu-item[data-id="${country}"]`).data('nume') || '');
                        $(document).on('change', '.my-country .my-value', function() {
                            var new_country_id = $(this).closest('.my-country').find('._selected').data('id') || '';
                            $('#country_id').val(new_country_id)[0].dispatchEvent(new Event('change', { bubbles: true }));
                        });
                    });
                }
                else if (location.href.includes('/admin/sales/order_edit') || location.href.includes('/admin/sales/order_create')) {
                    console.log('order edit/create');
                    GM_setValue('order_in_edit',1);
                    window.addEventListener('beforeunload', function (e) { GM_deleteValue('order_in_edit'); });
                    add_style();
                    um_refresh();
                    GM_addStyle(`
                    .discount_blocked {color: red; user-select: none;}
                #order-coupons,
                #order-items_grid > p,
                section.order-gift-options
                {
                    display: none;
                }
                .custom-price-block {
                    white-space: nowrap;
                }
                .col-discount, .col-row-total, .col-row-subtotal, tfoot > tr > .col-price:nth-of-type(n+5) {
                    display: none;
                }
                .order-discounts, .order-discounts > button {
                    margin-top: 0 !important;
                }
                .admin__page-section {
                    margin-bottom: 14px !important;
                }
                .order-tables tbody tr .col-product > span[id^=order_item] {
                    display: block;
                }
                .order-details .admin__field-option .admin__field-label {
                    display: inline-block !important;
                }
                /* Chrome, Safari, Edge, Opera */
                .item-qty::-webkit-outer-spin-button,
                .item-qty::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                /* Firefox */
                .item-qty {
                    -moz-appearance: textfield;
                }
                .numeric-change {
                    position: absolute;
                    line-height: 16px;
                    font-size: 16px;
                    cursor: pointer;
                    user-select: none;
                    -moz-user-select: none;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                }
                .numeric-change.arrow-down {
                    bottom: 0;
                }
                .numeric-change.arrow-up:hover, .numeric-change.arrow-down:hover {
                    color: #eb5202;
                }
                .item-qty {
                    padding-right: 0 !important;
                    width: 100% !important;
                }
                .col-qty {
                    min-width: 170px;
                    width: 170px;
                }
                .admin__order-shipment-methods-options-list input {
                    line-height: 14px;
                    height: 19px;
                    font-weight: normal;
                    width: 90px;
                }
                .admin__order-shipment-methods-options-list button {
                    margin-left: 5px !important;
                    height: 20px !important;
                    line-height: 20px !important;
                    font-size: 14px !important;
                    padding: 0 10px;
                }
                .order-sidebar {
                    display: none;
                    width: 330px !important;
                }
                .order-sidebar .admin__page-nav-title {margin-bottom: 10px;}
                .order-sidebar > div {width: 100%; line-height: 22px; display: flex; gap: 6px;}
                .order-sidebar > div > span:last-of-type {margin-left: auto;}
                .order-sidebar > div span:first-of-type {font-weight: bold;}
                .tree-source-scope .field-store_label {
                    margin: 0 !important;
                }
                .order-details {
                    width: calc(100% - 350px) !important;
                }
                #order-message {
                    width: calc(100% - 350px);
                    float: right;
                }
                .old_price {
                    float: right;
                    margin-top: 10px;
                    color: red;
                    user-select: none;
                }
                #payment_form_cashondelivery, #payment_form_banktransfer {
                    display: none;
                }
                #payment_form_adminpayment > li::marker {
                    content: '';
                }
                #payment_form_adminpayment > li {
                    margin-top: 6px;
                }
                .shipping-price-error-message, #submit_order_top_button, .admin__order-shipment-methods-title {
                    display: none !important;
                }
                .admin__order-shipment-methods-options {
                    margin-bottom: 10px !important;
                }
                #order-comment {
                    height: 120px;
                }
                #order-items .actions {display: flex;}
                #order-items #add_products {order: 10;}
                #order-items .action-add:not(#add_products) {order: 9;}
                #order-items #adauga_produse {order: 8;}
                #order-items #add_from_pdf {order: 7;}
                #order-items #delete_all {order: 6;}
                #order-items .actions.update.actions-update {display: none;}
                #order-additional_area .col-qty input {
                    width: auto;
                }
                #sku_table td.hint--top {display: table-cell;}
                #greutate_comanda {float: right;}
                #order-items_grid > .admin__table-primary tr:nth-of-type(1) > th:first-child, #order-items_grid > .admin__table-primary tr:nth-of-type(1) > td:first-child {
                    padding-left: 0;
                    padding-right: 0;
                    text-align: right;
                }
                .col-qty label.mage-error {
                    position: absolute;
                    top: 34px;
                }
                dl.admin__order-shipment-methods {display: grid;}
                dd:has(#s_method_dedemanfleetfix_dedemanfleetfix) {order: 0;}
                dd:has(#s_method_dpdfix_dpdfix) {order: 1;}
                dd:has(#s_method_fancourierfix_fancourierfix) {order: 2;}
                dd:has(#s_method_cargusfix_cargusfix) {order: 3;}
                dd:has(#s_method_glsfix_glsfix) {order: 4;}
                dd:has(#s_method_courier_courier) {order: 5;}
                dd:has(#s_method_locker_locker) {order: 6;}
                dd:has(#s_method_dedemanfleet_dedemanfleet) {order: 7;}
                dd:has(#s_method_dedemanscheduleddelivery_dedemanscheduleddelivery) {order: 8;}
                dd:has(#s_method_flatrate_flatrate) {order: 9;}
                `);
                    add_trumbowyg_style();
                    $(document).ready(function() {
                        console.log('ready');
                        waitForElm('#order-source-selector').then((elm) => {
                            $('#order-source-selector input[id^=source_BCT]').each(function() {
                                let source = $(this).attr('id');
                                let label = $(this).next('label').text().replace(/ \(.+?\)/,'').replace('Bucuresti', 'Bucuresti ' + source.match(/BCT(\d)/)[1] + ' - ');
                                $(this).next('label').html(label);
                            });
                            $('#order-source-selector .tree-source-scope .field-store_label').sort(function(a, b) {
                                return $(a).text().localeCompare($(b).text());
                            }).appendTo('#order-source-selector .tree-source-scope');
                            $('#order-source-selector > .admin__page-section-title > .title').css({'float': 'unset', 'margin-right': '10px'}).after('<input class="admin__control-text" type="text" id="search_store" placeholder="Cauta magazinul">');
                            $('#search_store').trigger('focus').on('keyup', function() {
                                let text = $(this).val();
                                if (text == '' || text.length == 0) $('#order-source-selector .field-store_label.d-none').removeClass('d-none');
                                else {
                                    $('#order-source-selector .field-store_label').addClass('d-none');
                                    $('#order-source-selector .field-store_label:icontains("' + text + '")').removeClass('d-none');
                                }
                            });
                            setTimeout(function() {$('#search_store').trigger('focus');}, 1200);
                        });
                        waitForElm('.order-details:visible').then((elm) => {
                            if ($('.loading-mask').length) {
                                waitForElm('.loading-mask:hidden').then((elm) => {
                                    make_actions();
                                });
                            }
                            else make_actions();
                            function make_actions() {
                                console.log('make actions');
                                var order_id = 0;
                                var text = $('script:contains(deleteConfirm)').text() || '';
                                if (/(?:sales\/order\/view\/order_id\/)(\d+)/gm.test(text)) order_id = /(?:sales\/order\/view\/order_id\/)(\d+)/gm.exec($('script:contains(deleteConfirm)').text())[1];
                                var id_cos = location.hash.replace('#id_cos=','') || 0;
                                if (id_cos) sessionStorage.setItem('order_details', getCookie(`comanda_noua_${id_cos}`) || '{}');
                                var order_details = JSON.parse(sessionStorage.getItem('order_details') || '{}');
                                console.log(order_details);
                                let banat = 0;
                                var diferenta = 0;
                                if (order_details.comanda_achitata == 2 && order_details.cod_plata) $('textarea#order-comment').val(order_details.cod_plata);
                                if (order_details.comanda_achitata == 0 && order_details.id_metoda_plata == 'adminpayment') {
                                    console.log('verific daca este banat');
                                    let email = $('#email').val();
                                    magento_mui_request({namespace:`ban_listing&filters[email]=${email}`}).then(function(response) {
                                        const banat_obj = response.items.find(e => e.email === email);
                                        if (banat_obj) {
                                            banat = 1;
                                            console.log('este banat');
                                        }
                                        else console.log('nu este banat');
                                    }).catch(function(e) {
                                        console.log(e);
                                    });
                                }
                                if (order_details.total_comanda) {
                                    var info = '';
                                    if ($('.admin-user-account-text').html().includes('nechita') && order_details.tip_plata == 'Card bancar') info = `<div><span>Comanda achitata:</span><span>${order_details.comanda_achitata == 1 ? 'Da' : 'Nu'}</span></div>`;
                                    var text_sidebar = `<div class="admin__page-nav-title"><strong>Informatii comanda initiala</strong></div>
                                <div><span>Tip livrare:</span><span>${order_details.tip_livrare}</span></div>
                                <div><span>Cost livrare:</span><span>${order_details.cost_livrare} lei</span></div>
                                <div><span>Tip plata:</span><span>${order_details.tip_plata}</span></div>${info}
                                <div><span>Total comanda initiala:</span><span>${order_details.total_comanda} lei</span></div>
                                <div><span id="text_diferenta">Diferenta comanda:</span><span id="diferenta" style="cursor: pointer;">—</span></div>
                                `;
                                    $('.page-create-order').append(`<div class="order-sidebar custom" style="padding: 10px; position: fixed; top: 110px; display: block; color: #41362f;">${text_sidebar}</div>`);
                                    calculDiferente();
                                    $('#diferenta').click(function() {
                                        $(this).fadeOut().fadeIn();
                                        let text = $(this).text().replace(/ le[iu]/, '');
                                        copy_text(text, text);
                                    });
                                    if (order_details.observatii) $('textarea#order-comment').val(order_details.observatii);
                                    $('textarea#order-comment').trumbowyg(trumbowyg_config).on('tbwpaste', function() { ontbwpaste($(this)) });
                                }
                                else $('.order-details').attr('style', 'width: 100% !important');
                                if ($('#order-billing_method').length) {
                                    add_trumbowyg();
                                    var payment_callback = function(mutationsList, observer) {
                                        if ($('.adminpayment-instructions-content > textarea:enabled').length) {
                                            add_trumbowyg();
                                        }
                                    };
                                    var payment_observer = new MutationObserver(payment_callback);
                                    payment_observer.observe($('#order-billing_method')[0], { attributes: false, childList: true, subtree: false });
                                }
                                function add_trumbowyg() {
                                    $('.adminpayment-instructions-content > textarea').attr('id', 'payment_details').removeAttr('disabled').trumbowyg(trumbowyg_config)
                                        .on('tbwchange', function() { order_details.cod_plata = $(this).val(); set_payment_ids();})
                                        .on('tbwpaste', function() { ontbwpaste($(this)) });
                                }
                                //add services
                                $('#order-additional_area .actions').prepend(`
                            <select class="admin__control-select" id="add_services">
                            <option value="">Adauga servicii</option>
                            <option value="9501240">Transport standard zona A</option>
                            <option value="9501241">Transport standard zona B</option>
                            <option value="9501242">Transport standard zona C</option>
                            <option value="9501243">Transport standard zona D</option>
                            <option value="9501248">Transport materiale grele zona A</option>
                            <option value="9501249">Transport materiale grele zona B</option>
                            <option value="9501250">Transport materiale grele zona C</option>
                            <option value="9501251">Transport materiale grele zona D</option>
                            <option value="9501252">Descarcare palet cu lift/macara</option>
                            <option value="9500111">Transport marfa</option>
                            <option value="9200524">Palet returnabil Euro 120 X 80</option>
                            <option value="9200525">Palet returnabil Non-Euro 120 X 80</option>
                            </select>`);
                                $('#add_services').on('change', function() {
                                    $('#sku_table > tbody').append(`<tr><td class="col-sku hint--top hint--rounded" aria-label="${$(this).find('option:selected').text()}" ><input type="text" name="sku" class="admin__control-text" value="${$(this).val()}" readonly></td><td class="col-qty hint--top hint--rounded" aria-label="${$(this).find('option:selected').text()}"><div class="input-box"><input type="text" value="1" name="qty" class="qty admin__control-text"></div></td><td class="col-actions last"><span class="hint--top hint--rounded" aria-label="Sterge - ${$(this).find('option:selected').text()}"><button type="button" class="action-default scalable action-delete admin-checkout-sku-delete-button"></button></span></td></tr>`);
                                    $(this).val('');
                                });
                                $(document).on('click', '.admin-checkout-sku-delete-button', function() { $(this).closest('tr').remove() });
                                function set_payment_ids() {
                                    let text = $('#payment_form_adminpayment textarea').val() || '';
                                    console.log(text);
                                    regExPayments.lastIndex = 0;
                                    let info = text.match(regExPayments);
                                    info = [...new Set(info)]; //remove duplicates
                                    $('#payment_id').val(info.join(' + '));
                                }
                                function calculDiferente() {
                                    if ($('#grand-total .admin__total-amount').length) {
                                        var total_curent = Number($('#grand-total  .admin__total-amount').text().replace(/ |lei/g,'') || 0);
                                        diferenta = Number((order_details.total_comanda-total_curent).toFixed(2));
                                        var dif_color = 'inherit';
                                        var lei = ' lei';
                                        var text_diferenta = '';
                                        if (Math.abs(diferenta) == 1) lei = ' leu';
                                        if (diferenta > 0) {
                                            text_diferenta = "Comanda este mai mica cu:";
                                            dif_color = 'green';
                                        }
                                        else if (diferenta < 0) {
                                            text_diferenta = "Comanda este mai mare cu:";
                                            dif_color = 'red';
                                        }
                                        else if (diferenta == 0) {
                                            text_diferenta = "Diferenta comanda:";
                                        }
                                        $('#text_diferenta').html(text_diferenta).closest('div').css('color',dif_color);
                                        $('#diferenta').html(Math.abs(diferenta) + lei);
                                    }
                                    if ($('#payment_form_adminpayment textarea').length && order_details.cod_plata && order_details.comanda_achitata !== 2) {
                                        if (!/<p><br><\/p>$/.test(order_details.cod_plata)) {
                                            if (navigator.userAgent.match(/firefox|fxios/i)) order_details.cod_plata += '<p></p>';
                                            else order_details.cod_plata += '<p><br></p>';
                                        }
                                        $('#payment_form_adminpayment textarea').val(order_details.cod_plata);
                                        $('#payment_details').trumbowyg('html', order_details.cod_plata);
                                        set_payment_ids();
                                    }
                                    if (order_details) {
                                        $('.admin__order-shipment-methods .admin__field-label input[id$=-shipping-price]').val(order_details.cost_livrare);
                                    }
                                }
                                // --------- order totals observer ---------
                                var totals_callback = function(mutationsList, observer) {
                                    calculDiferente();
                                    $('#remove-payment-fee').removeAttr('onclick');
                                    $('#order-totals .actions button.save').after($('#order-totals .actions button.save').clone().attr('id', 'submit_order_button_new').removeAttr('backend-button-widget-hook-id data-ui-id').removeClass('primary').addClass('secondary')).attr('id', 'submit_order_button_old').hide();
                                };
                                var totals_observer = new MutationObserver(totals_callback);
                                totals_observer.observe($('#order-totals')[0], { attributes: false, childList: true, subtree: false });
                                $('#order-totals .actions button.save').after($('#order-totals .actions button.save').clone().attr('id', 'submit_order_button_new').removeAttr('backend-button-widget-hook-id data-ui-id').removeClass('primary').addClass('secondary')).attr('id', 'submit_order_button_old').hide();
                                $('#remove-payment-fee').removeAttr('onclick');
                                $(document).on('change', '#remove-payment-fee', function() {order.removePaymentFee(this.checked); calculDiferente();});
                                // --------- products observer ---------
                                var um_details = JSON.parse(localStorage.getItem('um') || '{}');
                                var products_callback = function(mutationsList, observer) {
                                    if ($('#order-items .data-table').length) {
                                        make_order_items_actions();
                                    }
                                };
                                var products_observer = new MutationObserver(products_callback);
                                if ($('#order-items').length) {
                                    products_observer.observe($('#order-items')[0], { attributes: false, childList: true, subtree: false });
                                    make_order_items_actions();
                                }
                                function conversion_text(elem) {
                                    var qty = Number(elem.val()) || 0;
                                    elem.siblings('.admin__addon-suffix').html(get_um(um_details, elem.data('base_unit'), qty));
                                    if (elem.closest('td').find('.conversion').length) {
                                        var conversion = elem.closest('td').find('.conversion');
                                        var cantitate_alternativa = Number((qty/elem.attr('step')).toFixed(4));
                                        conversion.find('.cantitate').html(qty);
                                        conversion.find('.um_cantitate').html(get_um(um_details, elem.data('base_unit'), qty));
                                        conversion.find('.cantitate_alternativa').html(cantitate_alternativa);
                                        conversion.find('.um_cantitate_alternativa').html(get_um(um_details, elem.data('sale_unit'), cantitate_alternativa));
                                    }
                                }
                                $(document).on("change keyup", '.col-qty input', function() {
                                    conversion_text($(this));
                                    if ($(this).hasClass('changed') && $(this).val() == $(this).data('initial_value')) $(this).removeClass('changed');
                                    else $(this).addClass('changed');
                                });
                                $(document).on('click', '.numeric-change.arrow-down', function() {
                                    var input = $(this).closest('td').find('input');
                                    input[0].stepDown();
                                    input.change();
                                });
                                $(document).on('click', '.numeric-change.arrow-up', function() {
                                    var input = $(this).closest('td').find('input');
                                    input[0].stepUp();
                                    input.change();
                                });
                                $(document).on('click', '.custom-price-block > .admin__control-checkbox', function() {
                                    if (this.checked && $(this).closest('tr').find('.old_price').length) $(this).closest('td').find('.item-price').val($(this).closest('tr').find('.old_price').data('old-price'));
                                });
                                $(document).on('change', '#payment_form_adminpayment textarea', function() {
                                    console.log('payment change');
                                    if ($(this).val()) order_details.cod_plata = $(this).val();
                                    set_payment_ids();
                                });
                                $(document).on('click', '#reset_order_top_button', function() {
                                    sessionStorage.removeItem('de_verificat_anularea_comenzii');
                                    sessionStorage.removeItem('de_returnat');
                                });
                                $(document).on('keyup', '#email', function() {
                                    $(this).mailcheck({
                                        suggested: function(element, suggestion) {
                                            element.next('.suggestion').html(`Ai vrut sa scrii <b>${suggestion.full}</b>? <a data-value="${suggestion.full}" data-input_id="#email">Da, corecteaza!</a> <div class="closeIcon">×</div>`).slideDown();
                                        },
                                        empty: function(element) {
                                            element.next('.suggestion').slideUp();
                                        }
                                    });
                                });
                                $('#email').attr('type', 'email').after('<div class="suggestion"></div>').trigger('keyup');
                                if (order_details.email) $('#email').val(order_details.email).trigger('keyup');
                                if (order_details.billing_address) $('#order-addresses > .admin__page-section-title').append(`<button id="adauga_adrese" class="action-secondary" type="button" style="float: right;"><span>Adauga adrese</span></button>`);
                                $('#adauga_adrese').click(function() {
                                    if (order_details.billing_address) {
                                        if (EqualObj(order_details.billing_address, order_details.shipping_address) || !order_details.shipping_address.firstname) {
                                            order.shippingAsBilling = true;
                                            $('#order-shipping_same_as_billing').prop('checked', true)[0].dispatchEvent(new Event('change', { bubbles: true }));
                                            $('.order-shipping-address input:not(#order-shipping_same_as_billing), .order-shipping-address select').attr('disabled', true);
                                            order.fillAddressFields('order\u002Dbilling_address_fields', order_details.billing_address);
                                        }
                                        else {
                                            order.shippingAsBilling = false;
                                            $('#order-shipping_same_as_billing').prop('checked', false);
                                            $('.order-shipping-address input:disabled, .order-shipping-address select:disabled').removeAttr('disabled');
                                            order.fillAddressFields('order\u002Dshipping_address_fields', order_details.shipping_address);
                                            order.fillAddressFields('order\u002Dbilling_address_fields', order_details.billing_address);
                                        }
                                    }
                                });
                                if (order_details.billing_id) {
                                    var billing_details = {};
                                    var shipping_details = {};
                                    get_address_details(order_details.billing_id).then(function(response) {
                                        billing_details = response;
                                        get_address_details(order_details.shipping_id).then(function(response) {
                                            shipping_details = response;
                                            if (EqualObj(billing_details, shipping_details)) {
                                                order.shippingAsBilling = true;
                                                $('#order-shipping_same_as_billing').attr('checked', true);
                                                $('.order-shipping-address input:not(#order-shipping_same_as_billing), .order-shipping-address select').attr('disabled', true);
                                                order.fillAddressFields('order\u002Dbilling_address_fields', billing_details);
                                            }
                                            else {
                                                order.shippingAsBilling = false;
                                                $('#order-shipping_same_as_billing').attr('checked', false);
                                                $('.order-shipping-address input:disabled, .order-shipping-address select:disabled').removeAttr('disabled');
                                                order.fillAddressFields('order\u002Dshipping_address_fields', shipping_details);
                                                order.fillAddressFields('order\u002Dbilling_address_fields', billing_details);
                                            }
                                        }).catch(function(e) {});
                                    }).catch(function(e) {});
                                }
                                function EqualObj(object1, object2) {
                                    const keys1 = Object.keys(object1);
                                    const keys2 = Object.keys(object2);
                                    if (keys1.length !== keys2.length) return false;
                                    for (let key of keys1) {
                                        if (object1[key] !== object2[key] && key !== 'address_type') return false;
                                    }
                                    return true;
                                }
                                function get_address_details(id) {
                                    return new Promise(function(resolve, reject) {
                                        var details = {};
                                        GM_xmlhttpRequest({
                                            method: 'GET',
                                            url: location.origin+'/admin/sales/order/address/address_id/'+id,
                                            onload: function(xhr) {
                                                if (/<form id="edit_form" class="admin__fieldset" method="post"[^]+<\/form>/gm.test(xhr.responseText)) {
                                                    var form = $($.parseHTML(/<form id="edit_form" class="admin__fieldset" method="post"[^]+<\/form>/gm.exec(xhr.responseText)[0]));
                                                    form.find('input, select').each(function() {
                                                        let id = $(this).attr('id') || 0;
                                                        if (id == 'street0') id = 'street';
                                                        if (id) details = {...details, [id]: $(this).val()};
                                                    });
                                                    let region_id = /(?:\$\("region_id"\)\.setAttribute\("defaultValue", ")(\d+)(?:"\);)/gm.exec(xhr.responseText)[1];
                                                    details.region_id = region_id;
                                                    delete details.address_type;
                                                    resolve(details);
                                                }
                                            },
                                            onerror: function(err) {
                                                reject(err);
                                            },
                                            timeout: 30000,
                                            ontimeout: function(e) {
                                                reject('Timeout!');
                                            }
                                        });
                                    });
                                }
                                //relock email
                                let email = $('#email').val();
                                let user = $('.admin-user-account-text').text();
                                setInterval(function() {
                                    if (email && user) {
                                        bie_request({url:'/user-actions', method: 'POST', data: {entity_id: email, user: user}}).then(function(response) {}).catch(function(e) {});
                                    }
                                }, 1000*60);
                                $(document).on('click', '.admin__payment-methods .admin__field-option > input[type=radio]', function() {
                                    verifica_plata();
                                });
                                function verifica_plata() {
                                    let checked = $('.admin__payment-methods .admin__field-option > input[type=radio]:checked');
                                    if (checked.val() && checked.val() !== order_details.id_metoda_plata && order_details.id_metoda_plata) {
                                        checked.siblings('.admin__field-label').css("color", "red");
                                        $('.admin__payment-methods .admin__field-option > input[type=radio]:not(:checked)').siblings('.admin__field-label').css("color", "inherit");
                                        if (order_details.comanda_achitata) {
                                            $.alert({
                                                title: '',
                                                content: '<span style="font-size: 24px;color: #eb6556;">&#9888;</span> Esti sigur ca doresti sa schimbi metoda de plata? Comanda initiala este achitata deja!',
                                                type: 'red',
                                                theme: 'light,my_alert'
                                            });
                                        }
                                    }
                                    else $('.admin__payment-methods .admin__field-option > input[type=radio]').siblings('.admin__field-label').css("color", "inherit");
                                    if (checked.val() === 'cashondelivery' && banat) {
                                        $.alert({
                                            title: '',
                                            content: '<span style="font-size: 24px;color: #eb6556;">&#9888;</span> Clientul este banat!',
                                            type: 'red',
                                            theme: 'light,my_alert'
                                        });
                                    }
                                }
                                verifica_plata();
                                $(document).on('mousedown','.shipping-refresh-button', function(event) {
                                    if (event.button === 0) {
                                        $(this).removeAttr('onclick');
                                        order.updateShipping($(this).closest('li').find('> input[name="order[shipping_method]"]').val());
                                    }
                                });
                                $(document).on('click auxclick','#submit_order_button_new', function(event) {
                                    console.log('click submit');
                                    if (event.button === 0 || event.button === 1) {
                                        $('#submit_order_button_new').addClass('disabled');
                                        if ($('#order-items_grid input.changed').length) {
                                            $.confirm({
                                                title: '',
                                                content: '<span style="font-size: 24px;color: #eb6556;">&#9888;</span> Ai facut schimbari la produse si nu le-ai actualizat!<br>Continui cu plasarea comenzii?',
                                                type: 'red',
                                                buttons: {
                                                    nu: {
                                                        action: function () {
                                                            $('#submit_order_button_new').removeClass('disabled');
                                                        }
                                                    },
                                                    da: {
                                                        action: function () {
                                                            $('#order-items_grid input.changed').removeClass('changed');
                                                            $('#submit_order_button_new').trigger(event);
                                                        }
                                                    }
                                                },
                                                theme: 'light,my_confirm',
                                                onDestroy: function () {
                                                    if ($('#order-items_grid input.changed').length) $('#order-items_grid input.changed')[0].focus();
                                                }
                                            });
                                        }
                                        else if ($('.suggestion:visible').length) {
                                            $.alert({
                                                title: '',
                                                content: '<span style="font-size: 24px;color: #eb6556;">&#9888;</span> Adresa de e-mail nu este corecta!',
                                                type: 'red',
                                                theme: 'light,my_alert',
                                                onDestroy: function () {
                                                    $('#submit_order_button_new').removeClass('disabled');
                                                    $('#email')[0].focus();
                                                }
                                            });
                                        }
                                        else if ($('#p_method_adminpayment').is(":checked")) {
                                            $('#payment_form_adminpayment textarea').val($('#payment_form_adminpayment textarea').val().replace(/(?:<p><br><\/p>)+$/g,''));
                                            $('#payment_form_adminpayment textarea')[0].dispatchEvent(new Event("change"));
                                            waitForElm('.loading-mask:visible').then((elm) => {
                                                waitForElm('.loading-mask:hidden').then((elm) => {
                                                    var detalii_plata = $('#payment_form_adminpayment textarea').val() || '';
                                                    if (!detalii_plata) {
                                                        $.confirm({
                                                            title: '',
                                                            content: '<span style="font-size: 24px;color: #eb6556;">&#9888;</span> Nu exista detalii de plata! Continui cu plasarea comenzii?',
                                                            type: 'red',
                                                            buttons: {
                                                                nu: {
                                                                    action: function () { $('#submit_order_button_new').removeClass('disabled'); }
                                                                },
                                                                da: {
                                                                    action: function () { submit_order_button_action(); }
                                                                }
                                                            },
                                                            theme: 'light,my_confirm'
                                                        });
                                                    }
                                                    else submit_order_button_action();
                                                });
                                            });
                                        }
                                        else submit_order_button_action();
                                    }
                                });
                                function submit_order_button_action() {
                                    if (order_details.comanda_achitata && diferenta > 0) {
                                        $.confirm({
                                            title: '<span style="font-size: 30px;color: #eb6556;">&#9888;</span> Trebuie returnata suma de '+diferenta+' lei?',
                                            content: '',
                                            type: 'red',
                                            buttons: {
                                                nu: {
                                                    text: "Nu",
                                                    btnClass: 'btn-purple',
                                                    action: function () {
                                                        sessionStorage.removeItem('de_returnat');
                                                        order_submit(order_id);
                                                    }
                                                },
                                                cancel: {
                                                    text: "Anuleaza",
                                                    btnClass: 'btn-red',
                                                    action: function () {
                                                        //close
                                                        $('#submit_order_button_new').removeClass('disabled');
                                                    }
                                                },
                                                da: {
                                                    text: "Da",
                                                    btnClass: 'btn-blue',
                                                    action: function () {
                                                        sessionStorage.setItem('de_returnat', diferenta);
                                                        order_submit(order_id);
                                                    }
                                                }
                                            },
                                            theme: 'light,my_confirm'
                                        });
                                    }
                                    else order_submit(order_id);
                                }
                                $(document).on('click', '.do_action', function() {
                                    if (!$(this).parent().text().includes('Stocul comandat depaseste')) {
                                        $(this).closest('tbody').find('.col-qty input').removeAttr('step').addClass('no-step');
                                        $(this).closest('tbody').find('.col-qty label.mage-error').remove();
                                    }
                                    $(this).closest('tr').remove();
                                });
                                function order_submit(orderId) {
                                    if (orderId) {
                                        let verificare_anulare = {orderId: orderId};
                                        if (order_details.edit_status && order_details.edit_comment) verificare_anulare = {...verificare_anulare, edit_status: order_details.edit_status, edit_comment: order_details.edit_comment};
                                        sessionStorage.setItem('de_verificat_anularea_comenzii', JSON.stringify(verificare_anulare));
                                        magento_request({api_url:`/rest/V1/orders/${orderId}/statuses`}).then(function(response) {
                                            if (response) {
                                                var status_comanda = response;
                                                if (/anulata|finalizata/gi.test(status_comanda)) {
                                                    var status = 'anulata';
                                                    if (/finalizata/gi.test(status_comanda)) status = 'finalizata';
                                                    $.confirm({
                                                        title:  `<span style="font-size: 24px;color: #eb6556;">&#9888;</span> Comanda initiala este ${status}! Continui cu plasarea comenzii?`,
                                                        content: '',
                                                        type: 'red',
                                                        buttons: {
                                                            nu: {
                                                                action: function () {
                                                                    $('#submit_order_button_new').removeClass('disabled');
                                                                    sessionStorage.removeItem('de_verificat_anularea_comenzii');
                                                                    sessionStorage.removeItem('de_returnat');
                                                                }
                                                            },
                                                            da: {
                                                                action: function () { $('#submit_order_button_old').click(); }
                                                            }
                                                        },
                                                        theme: 'light,my_confirm'
                                                    });
                                                }
                                                else $('#submit_order_button_old').click();
                                            }
                                            else $('#submit_order_button_old').click();
                                        }).catch(function(e) {
                                            $('#submit_order_button_old').click();
                                        });
                                    }
                                    else $('#submit_order_button_old').click();
                                }
                                function make_order_items_actions() {
                                    $('#greutate_comanda').remove();
                                    $('#order-items_grid > .data-table > thead > tr').prepend('<th></th>');
                                    $('#order-items_grid > .data-table > tfoot > tr').prepend('<td></td>');
                                    $('#order-items_grid > .data-table > tbody').each(function() {
                                        $(this).find('tr:nth-of-type(1)').prepend(`<td>${$(this).index() - 1}.</td>`);
                                    });
                                    $('#order-items_grid .message-notice').append('<a class="do_action">Ignoră și continuă!</a>');
                                    //auto click on searched value
                                    if ($('#sales_order_create_search_grid').length) {
                                        var search_grid_callback = function(mutationsList, observer) {
                                            var sku = $('#sales_order_create_search_grid_filter_sku').val();
                                            if (sku && !sku.includes('-')) {
                                                $('#sales_order_create_search_grid_table tbody .col-sku').each(function() {
                                                    if (sku == $(this).text() && $(this).closest('tr').find('input.checkbox:not(:checked)').length) {
                                                        $(this).closest('tr').click();
                                                        $(this).closest('tr').find('input.qty').select();
                                                    }
                                                });
                                            }
                                        };
                                        var search_grid_observer = new MutationObserver(search_grid_callback);
                                        search_grid_observer.observe($('#sales_order_create_search_grid')[0], { attributes: false, childList: true, subtree: false });
                                    }
                                    $('#order-items .admin__page-section-title .actions').prepend('<button id="delete_all" class="action-primary" type="button"><span>Delete All</span></button><button id="adauga_produse" class="action-secondary" type="button"><span>Add saved products</span></button><button id="add_from_pdf" class="action-secondary" type="button"><span>Add products from PDF</span></button>');
                                    $('#delete_all').click(function() {
                                        $('.data-table tr > .col-actions > select').val('remove');
                                    });
                                    $('#adauga_produse').click(function() {
                                        if (GM_getValue('coduri_produse')) {
                                            add_products(GM_getValue('coduri_produse'));
                                            GM_deleteValue('coduri_produse');
                                        }
                                        else if (id_cos) add_products(order_details.produse);
                                        else alert('Nu sunt produse selectate!');
                                    });
                                    $('#add_from_pdf').click(function() {
                                        var text = prompt("Introdu textul din pdf");
                                        if (text != null) {
                                            var products = {};
                                            var cod, cantitate, pret;
                                            var regex = /(?:^| )(\d{7}) [^]+? ((?:\d{1,3}(?:\.\d{3})*|(?:\d+))(?:\,\d{2,})) ((?:\d{1,3}(?:\.\d{3})*|(?:\d+))(?:\,\d{2}))/g;
                                            var match;
                                            while ((match = regex.exec(text)) !== null) {
                                                cod = match[1];
                                                cantitate = match[2].replace(/\./,'').replace(',','.');
                                                pret = match[3].replace(/\./,'').replace(',','.');
                                                products[sku] = {pret: pret, cantitate: cantitate};
                                            }
                                            if (Object.keys(products).length) add_products(products);
                                            else alert('Nu am identificat produse!');
                                        }
                                    });
                                    function add_products(produse) {
                                        Object.entries(produse).forEach(([sku, value]) => {
                                            $('#sku_table > tbody').append(`<tr><td class="col-sku"><input type="text" name="sku" class="admin__control-text" value="${sku}"></td><td class="col-qty"><div class="input-box"><input type="text" value="${value.cantitate}" name="qty" class="qty admin__control-text"></div></td><td class="col-actions last"></td></tr>`);
                                            order_details.produse = {...order_details.produse, [sku]: value};
                                        });
                                        sessionStorage.setItem('order_details', JSON.stringify(order_details));
                                        addBySku.submitSkuForm();
                                    }
                                    if (id_cos) alert('Pentru a adauga produsele pe comanda trebuie sa dai click pe butonul "Add saved products"!');
                                    var cantitati = {};
                                    $('#order-items .product-sku-block').each(function() {
                                        var sku = $(this).text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                                        //verify prices
                                        if (order_details.produse && sku && order_details.produse[sku] && Number($(this).closest('tr').find('.col-price:has(.item-price) > .price').text().replace(/ |lei/g, '')) !== order_details.produse[sku].pret) {
                                            $(this).after(`<span class="old_price" data-old-price="${order_details.produse[sku].pret}">Pret initial: ${order_details.produse[sku].pret} lei</span>`);
                                        }
                                        var qty = Number($(this).closest('tr').find('.col-qty input').val());
                                        if (cantitati[sku]) qty = cantitati[sku] + qty;
                                        cantitati[sku] = qty;
                                    });
                                    console.log(cantitati);
                                    if (Object.keys(cantitati).length) {
                                        //status E alert
                                        if (order_details.E_alert) {
                                            Object.entries(order_details.produse).forEach(([sku, value]) => {
                                                if (value.status == 'E') {
                                                    var new_qty = cantitati[sku] || 0;
                                                    if (new_qty < order_details.produse[sku].cantitate && !order_details.produse[sku].alerted) {
                                                        alert(`Produsul ${sku} are status E si ai micsorat cantitatea cu ${order_details.produse[sku].cantitate - new_qty}. Trebuie trimis e-mail catre furnizor!`);
                                                        order_details.produse[sku].alerted = 1;
                                                    }
                                                }
                                            });
                                        }
                                        //add um
                                        magento_request({api_url:`/rest/V1/products/`, search_field: 'sku', search_values: Object.keys(cantitati), condition_type: 'in', return_fields: 'sku,weight,custom_attributes[base_unit,sale_unit,sale_coefficient,volume,unit_volume,discount_blocked]'}).then(function(response) {
                                            if (response.items) {
                                                var um = {};
                                                var greutati_produse = {};
                                                var discount_blocked = [];
                                                $.each(response.items, function(i, value) {
                                                    var sku = value.sku;
                                                    var attrs = {};
                                                    $.each(value.custom_attributes, function(j, val) {
                                                        attrs[val.attribute_code] = val.value;
                                                    });
                                                    var base_unit = attrs.base_unit || null;
                                                    var sale_unit = attrs.sale_unit || null;
                                                    var sale_coefficient = attrs.sale_coefficient || null;
                                                    var volume = attrs.volume ? Number(attrs.volume) : null;
                                                    var unit_volume = attrs.unit_volume || null;
                                                    um[sku] = {base_unit: base_unit, sale_unit: sale_unit, sale_coefficient: sale_coefficient};
                                                    if (sku.includes('-')) greutati_produse.bundle = 1;
                                                    else greutati_produse[sku] = {volume: volume, unit_volume: unit_volume, weight: value.weight, qty: cantitati[sku]};
                                                    if (attrs.discount_blocked == "1") discount_blocked.push(sku);
                                                });
                                                $('#order-items .product-sku-block').each(function() {
                                                    if (!$(this).closest('tr').find('.numeric-change').length) {
                                                        var sku = $(this).text().replace(/sku:|Unitate de înmagazinare:/gi,'').trim() || 0;
                                                        if (sku && discount_blocked.includes(sku)) $(this).after('<span class="discount_blocked" title="Blocat la discount!"> #</span>');
                                                        if (sku && um[sku]) {
                                                            var input = $(this).closest('tr').find('.col-qty input');
                                                            var sale_coefficient = Number(um[sku].sale_coefficient);
                                                            var qty = Number(input.val() || 0);
                                                            input.attr('type', 'number').attr('min', '0').attr('step', sale_coefficient).attr('id', input.attr('name')).attr('data-base_unit', um[sku].base_unit).attr('data-sale_unit', um[sku].sale_unit).attr('data-initial_value', input.val()).wrap(`<div style="position: relative;"><div class="admin__control-addon"></div></div>`);
                                                            input.after(`<label class="admin__addon-suffix" for="${input.attr('name')}"><span>${get_um(um_details, um[sku].base_unit, qty)}</span></label>`);
                                                            if (input.hasClass('no-step')) input.removeAttr('step');
                                                            input.closest('.admin__control-addon').after(`<span class="numeric-change arrow-up">▲</span><span class="numeric-change arrow-down">▼</span>`);
                                                            if (um[sku].base_unit !== um[sku].sale_unit && um[sku].base_unit && um[sku].sale_unit && sale_coefficient) {
                                                                if (qty) {
                                                                    var cantitate_alternativa = Number((qty/sale_coefficient).toFixed(4));
                                                                    $(this).closest('tr').find('.col-qty').append(`<div class="conversion hint--top hint--rounded" style="position: absolute;" aria-label="1 ${get_um(um_details, um[sku].sale_unit, 1)} = ${sale_coefficient} ${get_um(um_details, um[sku].base_unit, sale_coefficient)}"><span class="cantitate">${qty}</span> <span class="um_cantitate">${get_um(um_details, um[sku].base_unit, qty)}</span> = <span class="cantitate_alternativa">${cantitate_alternativa}</span> <span class="um_cantitate_alternativa">${get_um(um_details, um[sku].sale_unit, cantitate_alternativa)}</span></div>`);
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                                var greutate = 0, greutate_volumetrica_dpd = 0, greutate_volumetrica_fan = 0;
                                                var text_greutate = '';
                                                if (greutati_produse.bundle) text_greutate = 'Comanda conține produse bundle și nu pot calcula greutatea!';
                                                else {
                                                    console.log(greutati_produse);
                                                    Object.entries(greutati_produse).forEach(([sku, value]) => {
                                                        greutate = greutate + value.qty * value.weight;
                                                        let greutate_volumetrica = get_volume_weight(value.volume, value.unit_volume);
                                                        greutate_volumetrica_dpd = greutate_volumetrica_dpd + (greutate_volumetrica[5000] || 0) * value.qty;
                                                        greutate_volumetrica_fan = greutate_volumetrica_fan + (greutate_volumetrica[6000] || 0) * value.qty;
                                                    });
                                                    text_greutate = `Greutate fizică: ${greutate.toLocaleString('ro-RO', {maximumFractionDigits: 2})} kg | Greutate volumetrică: ${greutate_volumetrica_fan.toLocaleString('ro-RO', {maximumFractionDigits: 2})} kg`;
                                                }
                                                $('#order-methods > .admin__page-section-title').append(`<span id="greutate_comanda">${text_greutate}</span>`);
                                            }
                                        }).catch(function(e) {
                                            console.log(e);
                                        });
                                    }
                                    else console.log('Nu am gasit produse!');
                                }
                            }
                        });
                    });
                }
                else if (location.pathname.replace(/\/$/,'') == '/admin/sales/order') {
                    waitForElm('.data-grid-search-control-wrap').then((elm) => {
                        add_custom_search('increment_id', 'Search by order number');
                    });
                }
                else if (location.pathname.replace(/\/$/,'') == '/admin/catalog/product') {
                    waitForElm('.data-grid-search-control-wrap').then((elm) => {
                        add_custom_search('sku', 'Search by sku');
                    });
                }
                else if (location.pathname.replace(/\/$/,'') == '/admin/customer/index') {
                    waitForElm('.data-grid-search-control-wrap').then((elm) => {
                        add_custom_search('email', 'Search by email');
                    });
                }
                else if (location.pathname.replace(/\/$/,'') == '/admin/sales/creditmemo') {
                    var urlParams = new URLSearchParams(location.search);
                    if (urlParams.get('script') == 'op') {
                        //OP-uri comenzi ----------------------
                        waitForElm('.admin-user-account-text').then((elm) => {
                            if (op_users.includes(elm.text())) {
                                var regex_suma_op = /\d{1,3}(\.?\d{3})?(\,\d{1,2})? RON$/;
                                document.title = "OP-uri comenzi";
                                $('h1.page-title').html('OP-uri comenzi');
                                GM_addStyle(`
                            .my-header {display: flex; gap: 16px; margin-bottom: 16px;}
                            #data_OP, #cauta_OP, #salveaza_OP {min-width: fit-content;}
                            #adauga_OP {width: 100%}
                            a {cursor: pointer;}
                            a.no_href {color: #eb5202;}
                            .danger > td {background-color: #f2dede;}
                            .danger:hover > td {background-color: #ebcccc !important;}
                            .success > td {background-color: #dff0d8;}
                            .success:hover > td {background-color: #d0e9c6 !important;}
                            .op-actions {height: 20px; width: 20px; cursor: pointer; transition: color ease-in-out .15s;}
                            .op-actions:hover {color: #007bdb !important;}
                            .op-actions-wrap {
                                display: flex;
                                gap: 6px;
                                width: 98px;
                                flex-wrap: wrap;
                            }
                            #tabel_opuri th {
                                position: sticky;
                                top: -1px;
                                z-index: 1;
                            }
                            #tabel_opuri {border-collapse: separate;}
                            `);
                                var date = new Date().toISOString().slice(0,10);
                                waitForElm('#anchor-content').then((elm) => {
                                    elm.html(`<div class="page-main-actions"></div>
                                <div class="op-content">
                                <div class="my-header">
                                <input class="admin__control-text" type="date" id="data_OP" value="${date}" max="${date}">
                                <button id="cauta_OP" type="button" class="action-default scalable action-secondary">Caută OP-uri</button>
                                <input class="admin__control-text" type="text" id="adauga_OP" placeholder="OP-uri noi">
                                <button id="salveaza_OP" type="button" class="action-default scalable action-primary">Adaugă OP-uri noi</button>
                                </div>
                                <div class="my-loading admin__data-grid-loading-mask" style="display: none; position: fixed;">
                                <div class="spinner"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                                </div>
                                <table id='tabel_opuri' class="data-grid">
                                <thead><tr><th class="data-grid-th">Nr. crt.</th><th class="data-grid-th detalii_opuri">Incasare</th><th class="data-grid-th">Suma</th><th class="data-grid-th">Comanda</th><th class="data-grid-th">Actiuni</th></tr></thead>
                                <tbody><tr class="data-grid-tr-no-data"><td colspan="5">Nu am găsit informații!</td></tr></tbody>
                                </table>
                                </div>`);
                                    $('#cauta_OP').click(function() {
                                        if ($('#data_OP').val()) search_OP($('#data_OP').val(), 0);
                                        else alert('Data nu este corecta!');
                                    }).click();
                                });
                                function search_OP(data, rulaj_creditor) {
                                    $('.my-loading').show();
                                    bie_request({url:'/op-manager/'+data, method: 'GET'}).then(function(response) {
                                        var suma_totala = 0;
                                        if (response.body.length) {
                                            //add rows
                                            var tbody = '';
                                            $.each(response.body, function(i, value) {
                                                var op = value.description;
                                                var suma = '0';
                                                if (regex_suma_op.test(op)) suma = regex_suma_op.exec(op)[0];
                                                suma = Number(suma.replace(/ RON|\./g,'').replace(',','.'));
                                                suma_totala = suma_totala + suma;
                                                var tooltip_title = 'Marchează ca rezolvat';
                                                if (value.status == 'success') tooltip_title = 'Marchează ca nerezolvat';
                                                tbody += `<tr class="${value.status}">
                                            <td>${i+1}.</td>
                                            <td class="op" id="${value.entity_id}">${op}</td>
                                            <td nowrap class="suma" data-suma="${suma}">${suma.toLocaleString('ro')} lei</td>
                                            <td class="ol ${value.order_refference}"><a class="nr_ol no_href" target="_blank">${value.order_refference}</a><div class="status_ol"></div></td>
                                            <td><div class="op-actions-wrap">
                                            <span class="edit_order_number op-actions hint--top-left hint--rounded" aria-label="Modifică numărul comenzii"><svg width="20" height="20" version="1.1" viewBox="0 0 5.2917 5.2917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width=".4"><path d="m2.388 0.75009h-1.6716a0.47759 0.47494 0 0 0-0.47759 0.47494v3.3246a0.47759 0.47494 0 0 0 0.47759 0.47494h3.3432a0.47759 0.47494 0 0 0 0.47759-0.47494v-1.6623"/><path d="m4.179 0.39389a0.50657 0.50375 0 0 1 0.71639 0.71241l-2.2686 2.256-0.95519 0.23747 0.2388-0.94988z"/></g></svg>
                                            </span>
                                            <span class="return_op op-actions hint--top-left hint--rounded" aria-label="Returnează încasarea"><svg width="20" height="20" version="1.1" viewBox="0 0 5.2917 5.2917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.26458 0 0 .26458 -.52917 -.52917)"><path d="m11.125 12.925v-1.8652q-1.0339 0.38966-1.0339 1.2054 0 0.50396 1.0339 0.65983zm0.9248 1.0963v2.7017q0.55072-0.18704 0.9196-0.55072 0.41044-0.41564 0.41044-0.89882 0-0.90402-1.33-1.2521zm0-4.9877v0.87804h0.02078q0.49877 0 1.1378 0.17145 0.83648 0.22341 0.83648 0.57151 0 0.4572-0.4624 0.4572-0.20782 0-0.73257-0.10911-0.51955-0.1143-0.80011-0.10911v2.1146q1.1482 0.10392 1.7976 0.75335 0.59229 0.60268 0.59229 1.4547 0 1.0443-0.72218 1.7301-0.63905 0.60268-1.6678 0.79491v1.382q0 0.20262-0.13508 0.33251-0.12989 0.13508-0.33251 0.13508-0.4572 0-0.4572-0.4572v-1.3249q-2.5354-0.03637-2.5354-1.3145 0-0.4676 0.43123-0.4676 0.24419 0 0.4676 0.19223 0.33251 0.28575 0.50396 0.37408 0.41564 0.20782 1.1326 0.23899v-2.9459h-0.04156q-0.8053-0.03118-1.3924-0.39486-0.72737-0.44681-0.72737-1.2417 0-0.71178 0.66502-1.3404 0.61307-0.5819 1.4963-0.84687v-0.99754q0-0.20262 0.13508-0.33771 0.14028-0.13508 0.3429-0.13508 0.44681 0 0.44681 0.44162z" stroke-width="0" fill="currentColor" aria-label="$"/><g transform="matrix(33.333 0 0 33.333 -388.34 -388.09)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width=".04"><path d="m11.845 12.28h0.27114c0.09369 0 0.16974-0.09835 0.16974-0.21951 0-0.12116-0.07605-0.21951-0.16974-0.21951h-0.37309" stroke-miterlimit="10"/><path d="m11.821 11.952-0.08652-0.1126 0.08652-0.11189"/></g></g></svg>
                                            </span>
                                            <span class="delete_op op-actions hint--top-left hint--rounded" aria-label="Șterge încasarea"><svg width="20" height="20" version="1.1" viewBox="0 0 5.2917 5.2917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.26458 0 0 .26458 -.52917 -.52917)" fill="none"><g transform="matrix(1.0307 0 0 1.0321 -.36812 -.37292)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5118"><path d="m9.7636 11.006v5.9638"/><path d="m14.236 11.006v5.9638"/><path d="m3.0543 7.0301h17.891"/><path d="m5.2907 7.0301h13.419v10.934c0 1.6469-1.5019 2.9819-3.3546 2.9819h-6.7093c-1.8527 0-3.3547-1.335-3.3547-2.9819z"/><path d="m8.6454 5.0422c0-1.0979 1.0013-1.9879 2.2364-1.9879h2.2364c1.2352 0 2.2364 0.89003 2.2364 1.9879v1.9879h-6.7093z"/></g></g></svg>
                                            </span>
                                            <span class="status_op op-actions hint--top-left hint--rounded" aria-label="${tooltip_title}"><svg width="20" height="20" version="1.1" viewBox="0 -.5 .525 .525" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.025 0 0 .02625 -4.475 -11)" fill-rule="evenodd"><g transform="translate(56,160)" fill="none" stroke="currentColor" stroke-linecap="round"><path d="m127.35 247.87 4.5938 3.2813c0.59008 0.42139 1.4214 0.33854 1.9071-0.19l9.0088-9.8055" stroke-width="2.0802"/><path d="m132.46 242.74h-6.7326a1.9236 1.8333 0 0 0-1.9236 1.8333v12.833a1.9236 1.8333 0 0 0 1.9236 1.8333h13.465a1.9236 1.8333 0 0 0 1.9236-1.8333v-6.4165" stroke-linejoin="round" stroke-width="1.5772"/></g></g></svg>
                                            </span>
                                            <span class="search_cif op-actions hint--top-left hint--rounded" aria-label="Caută comenzi după CIF"><svg width="20" height="20" version="1.1" viewBox="0 0 5.2917 5.2917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.26458 0 0 .26458 -.52917 -.52917)" fill="none"><path d="m16.672 16.641 4.3275 4.3588m-2-10c0 4.4183-3.5817 8-8 8-4.4183 0-8-3.5817-8-8 0-4.4183 3.5817-8 8-8 4.4183 0 8 3.5817 8 8z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5118"/><path d="m9.7479 11.801q0 0.26931-0.13465 0.58479-0.13081 0.31163-0.41551 0.61556-0.2847 0.30009-0.72714 0.4886-0.44244 0.18852-1.0311 0.18852-0.44628 0-0.81178-0.08464-0.36549-0.084641-0.66558-0.26162-0.29624-0.18082-0.54631-0.47322-0.22314-0.26546-0.38088-0.59248-0.15774-0.33087-0.23853-0.70405-0.076946-0.37319-0.076946-0.79254 0-0.68097 0.19621-1.2196 0.20006-0.53862 0.5694-0.9195 0.36934-0.38473 0.86564-0.58479 0.4963-0.20006 1.058-0.20006 0.68482 0 1.2196 0.27316 0.53477 0.27316 0.81947 0.67712 0.2847 0.40012 0.2847 0.75791 0 0.19621-0.1385 0.34626-0.1385 0.15004-0.33471 0.15004-0.21929 0-0.33087-0.10388-0.10772-0.10388-0.24238-0.3578-0.22314-0.41935-0.52708-0.62711-0.30009-0.20775-0.74253-0.20775-0.70405 0-1.1234 0.53477-0.41551 0.53477-0.41551 1.5197 0 0.65788 0.18467 1.0965 0.18467 0.43474 0.52323 0.65019 0.33856 0.21545 0.79254 0.21545 0.49245 0 0.83101-0.24238 0.34241-0.24623 0.51554-0.71944 0.073098-0.22314 0.18082-0.36164 0.10772-0.14235 0.34626-0.14235 0.20391 0 0.3501 0.14235 0.1462 0.14235 0.1462 0.35395zm1.0734 1.1811v-4.4436q0-0.34626 0.15774-0.51938 0.15774-0.17313 0.40781-0.17313 0.25777 0 0.41551 0.17313 0.16159 0.16928 0.16159 0.51938v4.4436q0 0.3501-0.16159 0.52323-0.15774 0.17313-0.41551 0.17313-0.24623 0-0.40781-0.17313-0.15774-0.17698-0.15774-0.52323zm5.7902-4.1589h-2.2507v1.4427h1.8813q0.26162 0 0.38858 0.11927 0.13081 0.11542 0.13081 0.31163 0 0.19621-0.13081 0.31163-0.13081 0.11542-0.38858 0.11542h-1.8813v1.8582q0 0.35395-0.16158 0.52708-0.15774 0.16928-0.40781 0.16928-0.25392 0-0.41551-0.17313-0.15774-0.17313-0.15774-0.52323v-4.3397q0-0.24623 0.0731-0.40012 0.0731-0.15774 0.22699-0.22699 0.15774-0.073098 0.40012-0.073098h2.6931q0.27316 0 0.40396 0.12311 0.13466 0.11927 0.13466 0.31548 0 0.20006-0.13466 0.32317-0.13081 0.11927-0.40396 0.11927z" fill="currentColor" stroke-width=".99266" aria-label="CIF"/></g></svg>
                                            </span>
                                            <span class="search_suma op-actions hint--top-left hint--rounded" aria-label="Caută comenzi după sumă"><svg width="20" height="20" version="1.1" viewBox="0 0 5.2917 5.2917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.26458 0 0 .26458 -.52917 -.52917)" fill="none"><path d="m16.672 16.641 4.3275 4.3588m-2-10c0 4.4183-3.5817 8-8 8-4.4183 0-8-3.5817-8-8 0-4.4183 3.5817-8 8-8 4.4183 0 8 3.5817 8 8z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5118"/><path d="m10.773 9.5792v-2.1035q-1.166 0.43945-1.166 1.3594 0 0.56836 1.166 0.74414zm1.043 1.2363v3.0469q0.62109-0.21094 1.0371-0.62109 0.46289-0.46875 0.46289-1.0137 0-1.0195-1.5-1.4121zm0-5.625v0.99023h0.02344q0.5625 0 1.2832 0.19336 0.94336 0.25195 0.94336 0.64453 0 0.51562-0.52148 0.51562-0.23438 0-0.82617-0.12305-0.58594-0.12891-0.90234-0.12305v2.3848q1.2949 0.11719 2.0273 0.84961 0.66797 0.67969 0.66797 1.6406 0 1.1777-0.81445 1.9512-0.7207 0.67969-1.8809 0.89648v1.5586q0 0.22852-0.15234 0.375-0.14648 0.15234-0.375 0.15234-0.51562 0-0.51562-0.51562v-1.4941q-2.8594-0.04102-2.8594-1.4824 0-0.52734 0.48633-0.52734 0.27539 0 0.52734 0.2168 0.375 0.32226 0.56836 0.42188 0.46875 0.23438 1.2773 0.26953v-3.3223h-0.04687q-0.90821-0.035156-1.5703-0.44531-0.82031-0.50391-0.82031-1.4004 0-0.80273 0.75-1.5117 0.69141-0.65625 1.6875-0.95508v-1.125q0-0.22852 0.15234-0.38086 0.1582-0.15234 0.38672-0.15234 0.50391 0 0.50391 0.49805z" fill="currentColor" stroke-width="1.5118" aria-label="$"/></g></svg>
                                            </span>
                                            <span class="copy_op op-actions hint--top-left hint--rounded" aria-label="Copie încasarea"><svg width="20" height="20" version="1.1" viewBox="0 0 5.2917 5.2917" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.26458 0 0 .26458 -.52917 -.52917)" fill="none"><path d="m2.9785 15.609v-10.826c0-0.99649 0.95037-1.8043 2.1227-1.8043h10.614m-6.3681 18.043h9.5522c1.1724 0 2.1227-0.80778 2.1227-1.8043v-10.826c0-0.99649-0.95033-1.8043-2.1227-1.8043h-9.5522c-1.1723 0-2.1227 0.80781-2.1227 1.8043v10.826c0 0.99651 0.95037 1.8043 2.1227 1.8043z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5118"/></g></svg>
                                            </span>
                                            </div></td>
                                            </tr>`;
                                            });
                                            suma_totala = Number(suma_totala.toFixed(2));
                                            $('#tabel_opuri tbody').html(tbody);
                                            $('.detalii_opuri').html(`Incasari in data de <span id="data_opuri">${new Date(data).toLocaleDateString('ro')}</span>: <span id="nr_opuri">${response.body.length}</span> | Suma totala: <span id="suma_totala" data-suma="${suma_totala}">${suma_totala.toLocaleString('ro')}</span> lei`);
                                            if (rulaj_creditor > 0 && rulaj_creditor !== suma_totala) alert('Suma totala din PDF nu este egala cu suma totala din raport.\nVerifica daca s-au procesat corect incasarile!');
                                            generate_links();
                                        }
                                        else {
                                            $('#tabel_opuri tbody').html(`<tr class="data-grid-tr-no-data"><td colspan="5">Nu am găsit informații!</td></tr>`);
                                            $('.detalii_opuri').html(`Incasari in data de <span id="data_opuri">${new Date(data).toLocaleDateString('ro')}</span>: <span id="nr_opuri">${response.body.length}</span> | Suma totala: <span id="suma_totala" data-suma="${suma_totala}">${suma_totala.toLocaleString('ro')}</span> lei`);
                                            $('.my-loading').hide();
                                        }
                                    }).catch(function(e) {
                                        $('#tabel_opuri tbody').html(`<tr class="data-grid-tr-no-data"><td colspan="5">${e}</td></tr>`);
                                        $('.detalii_opuri').html('Incasare');
                                        $('.my-loading').hide();
                                    });
                                }
                                function generate_links() {
                                    var comenzi = [];
                                    $('.nr_ol').each(function() {
                                        if (regExOLTest.test($(this).text())) comenzi.push($(this).text());
                                    });
                                    if (comenzi.length) {
                                        magento_request({api_url:'/rest/V1/orders', search_field: 'increment_id', search_values: comenzi, condition_type: 'in', return_fields: 'entity_id,increment_id,status'}).then(function(response) {
                                            if (response.items) {
                                                $.each(response.items, function(i, value) {
                                                    $('.'+value.increment_id+' > .nr_ol').attr('href', location.origin+'/admin/sales/order/view/order_id/'+value.entity_id).removeClass('no_href');
                                                    $('.'+value.increment_id+' > .status_ol').html(statusi[value.status] || value.status);
                                                });
                                            }
                                            $('.my-loading').hide();
                                        }).catch(function(e) {
                                            $('.my-loading').hide();
                                            alert('Nu am putut prelua id-urile comenzilor!\n'+e);
                                        });
                                    }
                                    else $('.my-loading').hide();
                                }
                                function change_op(params) {
                                    console.log(params);
                                    $('.my-loading').show();
                                    bie_request({url:'/op-manager/'+params.op_id, method: 'PATCH', data: params.data}).then(function(response) {
                                        console.log('done patch');
                                        if (params.data.order) $('.op#'+params.op_id).closest('tr').find('.ol').attr('class', 'ol '+params.data.order).html(`<a class="nr_ol no_href" target="_blank">${params.data.order}</a><div class="status_ol"></div>`);
                                        if (params.data.status) {
                                            $('.op#'+params.op_id).closest('tr').attr('class', params.data.status);
                                            var tooltip_title = 'Marchează ca rezolvat';
                                            if (params.data.status == 'success') tooltip_title = 'Marchează ca nerezolvat';
                                            $('.op#'+params.op_id).closest('tr').find('.status_op').attr('aria-label', tooltip_title);
                                        }
                                        if (params.data.order) generate_links();
                                        else $('.my-loading').hide();
                                    }).catch(function(e) {
                                        $('.my-loading').hide();
                                        alert('Nu am putut salva informațiile!\n'+e);
                                    });
                                }
                                $(document).on('click', '.edit_order_number', function() {
                                    let new_number = (prompt('Noul număr de comandă:') || '').trim();
                                    if (regExOLTest.test(new_number.toUpperCase())) new_number = regExOLTest.exec(new_number.toUpperCase())[0];
                                    if (new_number) change_op({op_id: $(this).closest('tr').find('.op').attr('id'), data: {order: new_number}});
                                });
                                $(document).on('click', '.return_op', function() {
                                    $(this).fadeOut().fadeIn();
                                    if (!GM_getValue('email_return_op')) config_op('email');
                                    var dedeman_iban = 'RO76RNCB0279014382090139';
                                    var tr = $(this).closest('tr');
                                    var IBAN = 'XXXXXXXXXXXXXXXXXXXXXXXX';
                                    var op_for_iban = '';
                                    var op = tr.find('.op').text() || '';
                                    var re = new RegExp(dedeman_iban,"g");
                                    op_for_iban = op.replace(/ /g,'').replace(re,'');
                                    if (/RO\d\d[A-Z]{4}[A-Z0-9]{16}/.test(op_for_iban)) {
                                        IBAN = /RO\d\d[A-Z]{4}[A-Z0-9]{16}/.exec(op_for_iban)[0].replace(/(.{4})(.{4})(.{4})(.{4})(.{4})(.{4})/,"$1 $2 $3 $4 $5 $6");
                                    }
                                    var nrOL = tr.find('.nr_ol').text() || '';
                                    var suma = tr.find('.suma').text() || '';
                                    var subject = 'Restituire bani '+nrOL;
                                    var text = `Buna ziua,<br><br>Va rog sa restituiti suma de ${suma}, comanda online ${nrOL}, in contul <b>${IBAN}</b>. Incasarea apare in extrasul BCR online din data de ${$('#data_opuri').text()}:<br><span style="color: blue;">${op}</span>.<br><br>Multumesc,`;
                                    copy_text(text, text);
                                    subject = encodeURIComponent(subject);
                                    subject = subject.replace(/ /g,"%20");
                                    location.href = 'mailto:'+GM_getValue('email_return_op')+'?subject='+subject+'&cc='+GM_getValue('cc_email_return_op');
                                });
                                $(document).on('click', '.delete_op', function() {
                                    console.log('delete op');
                                    var to
                                    var row = $(this).closest('tr');
                                    $('.my-loading').show();
                                    var row = $(this).closest('tr');
                                    var done = 0;
                                    bie_request({url:'/op-manager/'+row.find('.op').attr('id'), method: 'DELETE'}).then(function(response) {
                                        console.log('done delete');
                                        row.children('td').animate({ padding: 0 }).wrapInner('<div />').children().slideUp(function() {
                                            done++;
                                            if (done === 1) {
                                                var suma = row.find('.suma').data('suma');
                                                var suma_totala = $('#suma_totala').data('suma');
                                                suma_totala = Number((suma_totala - suma).toFixed(2));
                                                row.remove();
                                                $('#nr_opuri').html($('#tabel_opuri > tbody > tr').length);
                                                $('#suma_totala').html(suma_totala.toLocaleString('ro-RO')).data('suma', suma_totala);
                                                $('#tabel_opuri > tbody > tr').each(function() {
                                                    $(this).find('td:eq(0)').html(($(this).index() + 1)+'.');
                                                });
                                                $('.my-loading').hide();
                                            }
                                        });
                                    }).catch(function(e) {
                                        $('.my-loading').hide();
                                        alert('Nu am putut șterge încasarea!\n'+e);
                                    });
                                });
                                $(document).on('click', '.status_op', function() {
                                    console.log('status op');
                                    var new_status = 'success';
                                    if ($(this).closest('tr')[0].className == 'success') new_status = 'danger';
                                    change_op({op_id: $(this).closest('tr').find('.op').attr('id'), data: {status: new_status}});
                                });
                                $(document).on('click', '.search_cif', function() {
                                    var op = $(this).closest('tr').find('.op').text();
                                    var cif_incasare = 0;
                                    var op_for_cif = op.replace(/ /g,'');
                                    if (/CODFISC(R|RO)?\d{2,}/gmi.test(op_for_cif)) {
                                        cif_incasare = /CODFISC(R|RO)?\d{2,}/gmi.exec(op_for_cif)[0].replace(/[A-Z]/gi,'');
                                        if (cif_incasare == '2816464') cif_incasare = 0;
                                    }
                                    if (cif_incasare) {
                                        GM_openInTab('https://bie2.dedeman.ro/raport/identificare-comanda?company='+cif_incasare,{active: true, insert: false});
                                        var evt = $.Event("mouseup", {button: 1});
                                        $(this).closest('tr').find('.set_op').trigger(evt);
                                    }
                                    else alert('Nu am găsit CIF în această încasare!');
                                });
                                $(document).on('click', '.search_suma', function() {
                                    var suma = $(this).closest('tr').find('.suma').data('suma') || 0;
                                    if (suma) {
                                        GM_openInTab(`https://bie2.dedeman.ro/raport/identificare-comanda?valueFrom=${suma - 0.01}&valueTo=${suma + 0.01}`,{active: true, insert: false});
                                        var evt = $.Event("mouseup", {button: 1});
                                        $(this).closest('tr').find('.set_op').trigger(evt);
                                    }
                                    else alert('Nu am găsit suma în această încasare!');
                                });
                                $(document).on('click', '.copy_op', function() {
                                    $(this).fadeOut().fadeIn();
                                    var op = $(this).closest('tr').find('.op').text();
                                    var nrOL = $(this).closest('tr').find('.nr_ol').text();
                                    var text = '<span style="color: black;">'+nrOL+' - </span><span style="color: blue;">'+op+'</span>';
                                    copy_text(nrOL+' - '+op, text);
                                });
                                $(document).on("click","#salveaza_OP",function() {
                                    $('.my-loading').show();
                                    var opuri_salvate = [];
                                    var copie_salvate = [];
                                    var opuri_noi = [];
                                    var opuri_noi_append = [];
                                    var rulaj_creditor = 0;
                                    var data = $('#data_OP').val();
                                    if ($('#data_OP').val() && $('#adauga_OP').val()) {
                                        var opuri = $('#adauga_OP').val().replace(/"|'|;/g," ");
                                        $('#adauga_OP').val('');
                                        let matchPerioada = opuri.match(/pe perioada:\s*(\d{2})-(\d{2})-(\d{4})\s*-\s*(\d{2})-(\d{2})-(\d{4})\s+EXTRAS DE CONT/);
                                        if (matchPerioada) {
                                            const dataStart = `${matchPerioada[3]}-${matchPerioada[2]}-${matchPerioada[1]}`; // yyyy-mm-dd
                                            const dataEnd   = `${matchPerioada[6]}-${matchPerioada[5]}-${matchPerioada[4]}`; // yyyy-mm-dd
                                            if (dataStart === dataEnd) data = dataStart;
                                        }
                                        opuri = opuri.replace(/\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}[\s\S]*? Debit Data Valorii Credit Document Tranzactii finalizate:/g,'').replace(/\d{2}-\d{2}-\d{4} \d{2}:\d{2} EXTRAS DE CONT Nr. \d+ din data: \d{2}-\d{2}-\d{4} pe perioada: \d{2}-\d{2}-\d{4} - \d{2}-\d{2}-\d{4}/g, '');
                                        let regex = /\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}(?:(?!virare solduri)[\s\S])*? 0,00 \d{1,3}(?:\.\d{3})*,\d{2}/g;
                                        let match;
                                        while ((match = regex.exec(opuri)) !== null) {
                                            opuri_noi.push(match[0].replace(' 0,00', '') + ' RON');
                                        }
                                        let match_rulaj_total = opuri.match(/Tranzactii finalizate:\s+[\d\.,]+\s+([\d\.,]+)\s+Sold contabil final:/);
                                        if (match_rulaj_total) rulaj_creditor = Number(match_rulaj_total[1].replace(/\./g,'').replace(',','.'));
                                    }
                                    if (opuri_noi.length) {
                                        bie_request({url:'/op-manager/'+data, method: 'GET'}).then(function(response) {
                                            $.each(response.body, function(index, value) {
                                                opuri_salvate.push(value.description);
                                            });
                                            $.each(opuri_salvate, function(index, value) {
                                                copie_salvate.push(value.replace(/ |\r|\n/gm,""));
                                            });
                                            $.each(opuri_noi, function(index, value) {
                                                if (!copie_salvate.includes(value.replace(/ |\r|\n/gm,""))) {
                                                    var nrOL = "not found";
                                                    var op = value.toUpperCase().replace(/ |\r|\n/gmi,"").replace(/O/gmi,"0").replace(/0L/gmi,"OL").replace(/I/gmi,"1");
                                                    if (regExOLTest.test(op)) nrOL = regExOLTest.exec(op)[0];
                                                    opuri_noi_append.push({op_date: data, order: nrOL, description: value, status: "danger"});
                                                }
                                            });
                                            if (opuri_noi_append.length) {
                                                bie_request({url:'/op-manager/'+data, method: 'POST', data: opuri_noi_append}).then(function(response) {
                                                    search_OP(data, rulaj_creditor);
                                                }).catch(function(e) {
                                                    $('.my-loading').hide();
                                                    alert('Nu am putut adăuga încasările!\n'+e);
                                                });
                                            }
                                            else {
                                                alert('Nu există încasări noi!');
                                                search_OP(data, rulaj_creditor);
                                            }
                                        }).catch(function(e) {
                                            $('.my-loading').hide();
                                            alert('Nu am putut adăuga încasările!\n'+e);
                                        });
                                    }
                                    else {
                                        $('.my-loading').hide();
                                        alert('Nu am găsit încasări!');
                                    }
                                });
                                $(document).on('click auxclick', '.nr_ol',function(event) {
                                    if (event.button === 0 || event.button === 1) {
                                        $(this).fadeOut().fadeIn();
                                        var detalii_incasare = {};
                                        detalii_incasare.op = $(this).closest('tr').find('.op').text();
                                        detalii_incasare.op_id = $(this).closest('tr').find('.op').attr('id');
                                        detalii_incasare.suma = $(this).closest('tr').find('.suma').data('suma');
                                        detalii_incasare.nr_ol = $(this).text();
                                        document.cookie = `incasare=${JSON.stringify(detalii_incasare)}; domain=dedeman.ro; path=/`;
                                    }
                                });
                                document.addEventListener('visibilitychange', function() {
                                    if (!document.hidden) {
                                        var detalii_incasare_ok = JSON.parse(getCookie('incasare_ok') || '{}');
                                        console.log(detalii_incasare_ok);
                                        if (detalii_incasare_ok.op_id) {
                                            if ($('.op#'+detalii_incasare_ok.op_id).length) {
                                                change_op({op_id: detalii_incasare_ok.op_id, data: detalii_incasare_ok.data});
                                                document.cookie = "incasare_ok=0; domain=dedeman.ro; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                    else if (urlParams.get('script') == 'comenzi-curier') {
                        //Comenzi livrare curier ----------------------
                        console.log('comenzi curier');
                        GM_addStyle(`
                    .my-header {display: flex; gap: 16px; margin-bottom: 16px; justify-content: space-between;}
                    .danger > td {background-color: #f2dede;}
                    .danger:hover > td {background-color: #ebcccc !important;}
                    .success > td {background-color: #dff0d8;}
                    .success:hover > td {background-color: #d0e9c6 !important;}
                    .info > td {background-color: #d9edf7;}
                    .info:hover > td {background-color: #c4e3f3 !important;}
                    .my-header label {margin-right: 10px;}
                    .my-header input:invalid {border-color: red;}
                    #tabel_comenzi th {
                        position: sticky;
                        top: -1px;
                        z-index: 1;
                    }
                    #tabel_comenzi {border-collapse: separate;}
                    .my-nowrap {white-space: nowrap;}
                    .page-title-wrapper {
                        display: flex;
                        gap: 16px;
                    }
                    .my-header input, .my-header select {height: 32px;}
                    .filter-table {cursor: pointer;}
                    .d-none {display: none;}
                    #statistica label::before {
                        margin-right: 4px;
                    }
                    #statistica {
                        margin-bottom: 10px;
                    }
                    #tabel_comenzi a:visited {color: #e39e22;}
                    `);
                        waitForElm('#anchor-content').then((elm) => {
                            document.title = "Comenzi curier";
                            $('h1.page-title').html('Comenzi curier');
                            var d = new Date();
                            var today = d.toISOString().slice(0,10);
                            d.setDate(d.getDate() - 1);
                            var yesterday = d.toISOString().slice(0,10);
                            elm.html(`<div class="page-main-actions"></div>
                        <div><div class="my-header">
                        <div><label for="from_date">De la:</label><input class="admin__control-text" type="date" id="from_date" value="" max="${today}"></div>
                        <div><label for="to_date">Până la:</label><input class="admin__control-text" type="date" id="to_date" value="${yesterday}" max="${today}"></div>
                        <div><label for="orders_type">Tip comenzi:</label><select class="admin__control-select" id="orders_type"><option value="magazin">Magazine fizice</option><option value="drop">Dropshipping</option></select></div>
                        <div><label for="courier_type">Curier:</label><select class="admin__control-select" id="courier_type"><option value="all">Toti curierii</option><option value="dpd">DPD</option><option value="fan">FAN</option><option value="gls">GLS</option><option value="locker">Locker</option></select></div>
                        <button id="search_orders" type="button" class="action-default scalable action-primary">Caută comenzi</button><button id="export" type="button" class="action-default scalable action-secondary">Copie tabel</button>
                        </div>
                        <div class="my-loading admin__data-grid-loading-mask" style="display: none; position: fixed;">
                        <div class="spinner"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                        </div><div id="statistica"></div>
                        <div style="overflow: auto;"><table id='tabel_comenzi' class="data-grid"><thead><tr><th class="data-grid-th">Comandă</th><th class="data-grid-th">Dată plasare</th><th class="data-grid-th">Dată actualizare</th><th class="data-grid-th">Magazin</th><th class="data-grid-th">Status</th><th class="data-grid-th">Livrare</th><th class="data-grid-th">Plată</th><th class="data-grid-th">Cost livrare</th><th class="data-grid-th">Total</th><th class="data-grid-th">Nr. AWB</th><th class="data-grid-th">Status AWB</th></tr></thead><tbody><tr class="data-grid-tr-no-data"><td colspan="100">Nu am găsit informații!</td></tr></tbody></table></div></div>`);
                            $('#export').click(function() {
                                if ($('#tabel_comenzi > tbody > tr:not(.data-grid-tr-no-data)').length) {
                                    $(this).fadeOut(function() {
                                        var table = $.parseHTML($('#tabel_comenzi')[0].outerHTML);
                                        $(table).find('.d-none').remove();
                                        $(table).find('thead > tr > th:last-of-type').html('Data status AWB').after('<th>Status AWB</th>');
                                        $(table).find('tbody > tr > td:last-of-type').each(function() {
                                            let text = $(this).html();
                                            $(this).html(text.substring(0,20).replace(',', '')).after(`<td>${text.substring(23) || '-'}</td>`);
                                        });
                                        var text = $(table)[0].outerHTML.replace(/<br>/g,' ');
                                        copy_text(text, text);
                                    }).fadeIn();
                                }
                            });
                            $(document).on('change', '.filter-table', function() {
                                $(`#tabel_comenzi .${$(this).data('type')}`).toggleClass('d-none');
                            });
                            $('#search_orders').click(function() {
                                console.log('search orders');
                                if (!$('.my-header input:invalid').length) {
                                    $('.my-loading').show();
                                    var query;
                                    var date_from = '';
                                    if ($('#from_date').val()) date_from = '&filters[created_at][from]=' + new Date($('#from_date').val()).toLocaleDateString('ro');
                                    var date_to = '';
                                    if ($('#to_date').val()) date_to = '&filters[created_at][to]=' + new Date($('#to_date').val()).toLocaleDateString('ro');
                                    if ($('#orders_type').val() == 'magazin') query = `sales_order_grid&filters[status][]=comanda_facturata&filters[status][]=comanda_expediata${date_from+date_to}&sorting[field]=created_at&sorting[direction]=desc`;
                                    else if ($('#orders_type').val() == 'drop')query = `sales_order_grid&filters[status][]=livrare_curier&filters[source_code][]=ECOM${date_from+date_to}&sorting[field]=created_at&sorting[direction]=desc`;
                                    if ($('#courier_type').val() == 'all') query += `&filters[shipping_method][]=glsfix_glsfix&filters[shipping_method][]=dpdfix_dpdfix&filters[shipping_method][]=fancourierfix_fancourierfix&filters[shipping_method][]=courier_courier&filters[shipping_method][]=locker_locker`;
                                    else if ($('#courier_type').val() == 'dpd') query += `&filters[shipping_method][]=dpdfix_dpdfix&filters[shipping_method][]=dpd_dpd`;
                                    else if ($('#courier_type').val() == 'fan') query += `&filters[shipping_method][]=fancourierfix_fancourierfix&filters[shipping_method][]=fancourier_fancourier`;
                                    else if ($('#courier_type').val() == 'gls') query += `&filters[shipping_method][]=glsfix_glsfix&filters[shipping_method][]=gls_gls`;
                                    else if ($('#courier_type').val() == 'locker') query += `&filters[shipping_method][]=locker_locker`;
                                    console.log(query);
                                    magento_mui_request({namespace: query}).then(function(response) {
                                        var tbody = '';
                                        var ols = [];
                                        var dateTo = 0;
                                        let response_items = response.items;
                                        if ($('#to_date').val()) dateTo = new Date($('#to_date').val() + ' 23:59:59').getTime();
                                        response_items.sort(function(a, b) {
                                            return b.updated_at.localeCompare(a.updated_at);
                                        });
                                        $.each(response_items, function(i, value) {
                                            if (new Date(value.updated_at+'+00').getTime() <= dateTo || dateTo == 0) {
                                                ols.push(value.increment_id);
                                                tbody += `<tr id="${value.increment_id}" class="no-awb"><td class="nr_ol"><a href="${value.actions.view.href}" target=_blank>${value.increment_id}</a></td><td>${new Date(value.created_at).toLocaleString('ro')}</td><td>${new Date(value.updated_at+'+00').toLocaleString('ro')}</td><td>${value.source_code}</td><td>${value.status}</td><td>${value.shipping_information}</td><td>${value.payment_method}</td><td class="my-nowrap">${value.shipping_and_handling}</td><td class="my-nowrap">${value.grand_total}</td><td class="nr-awb">Fara awb</td><td class="status-awb">-</td></tr>`;
                                            }
                                        });
                                        if (ols.length) {
                                            $('#tabel_comenzi > tbody').html(tbody);
                                            var start = 0;
                                            var page_size = 500;
                                            var appliv_tracking_response = [];
                                            var appliv_error = 0;
                                            get_appliv_awbs();
                                            function get_appliv_awbs() {
                                                const chunk = ols.slice(start, start + page_size);
                                                appliv_request({url:'awb_track', method: 'POST', data: {references: chunk}}).then(function(response_appliv) {
                                                    console.log(response_appliv);
                                                    appliv_tracking_response.push(...response_appliv);
                                                    start = start + page_size;
                                                    if (start < ols.length) get_appliv_awbs();
                                                    else write_awbs(appliv_error);
                                                }).catch(function(e) {
                                                    console.log(e);
                                                    appliv_error = e;
                                                    start = start + page_size;
                                                    if (start < ols.length) get_appliv_awbs();
                                                    else write_awbs(appliv_error);
                                                });
                                            }
                                            function write_awbs(error) {
                                                var awbs = {};
                                                if (error) alert('Eroare appliv!\n'+error);
                                                $.each(appliv_tracking_response, function(i, value) {
                                                    $(`#${value.reference} > .nr-awb`).html(value.code);
                                                    $(`#${value.reference} > .status-awb`).html(value.courier_status_description);
                                                    var clasa = 'info';
                                                    if (value.tracking_status == 0) clasa = 'danger';
                                                    else if (value.tracking_status == 10) clasa = 'success';
                                                    $(`#${value.reference}`).attr('class', clasa);
                                                    awbs[value.delivery_method] = [...awbs[value.delivery_method] || [], value.code]
                                                });
                                                console.log(awbs);
                                                var total = $('#tabel_comenzi > tbody > tr').length;
                                                var livrate = $('#tabel_comenzi .success').length;
                                                var returnate = $('#tabel_comenzi .danger').length;
                                                var in_livrare = $('#tabel_comenzi .info').length;
                                                var fara_awb = $('#tabel_comenzi .no-awb').length;
                                                $('#statistica').html(`${total} ${total == 1 ? 'comandă' : 'comenzi'}, din care <span><input type="checkbox" id="in_livrare" data-type="info" class="admin__control-checkbox filter-table" checked><label for="in_livrare" title="Click pentru a ascunde/afișa aceste comenzi">${in_livrare} ${in_livrare == 1 ? 'comandă' : 'comenzi'} în livrare</label></span>, <span><input type="checkbox" id="livrate" data-type="success" class="admin__control-checkbox filter-table" checked><label for="livrate" title="Click pentru a ascunde/afișa aceste comenzi">${livrate} ${livrate == 1 ? 'comandă livrată' : 'comenzi livrate'}</label></span>, <span><input type="checkbox" id="returnate" data-type="danger" class="admin__control-checkbox filter-table" checked><label for="returnate" title="Click pentru a ascunde/afișa aceste comenzi">${returnate} ${returnate == 1 ? 'comandă returnată' : 'comenzi returnate'}</label></span>, <span><input type="checkbox" id="fara_awb" data-type="no-awb" class="admin__control-checkbox filter-table" checked><label for="fara_awb" title="Click pentru a ascunde/afișa aceste comenzi">${fara_awb} ${fara_awb == 1 ? 'comandă' : 'comenzi'} fără AWB</label></span>`);
                                                $('.my-loading').hide();
                                            }
                                        }
                                        else {
                                            $('#tabel_comenzi > tbody').html('<tr class="data-grid-tr-no-data"><td colspan="100">Nu am găsit comenzi!</td></tr>');
                                            $('#statistica').html('');
                                            $('.my-loading').hide();
                                        }
                                    }).catch(function(e) {
                                        console.log(e);
                                        alert('Eroare API Magento!\n'+e);
                                        $('.my-loading').hide();
                                    });
                                }
                            });
                        });
                    }
                }
                else if (location.pathname.includes('/customer/index/edit/id/')) {

                    $(document).on('mouseenter', '#order', function() {
                        $(this).after($(this).clone().attr('id', $(this).attr('id')+'-lock').attr('data-target-element', '#'+$(this).attr('id'))).hide();
                    });
                    $(document).on('click auxclick', '#order-lock', function(event) {
                        if (event.button === 0 || event.button === 1) {
                            if (GM_getValue('order_in_edit')) {
                                if (!confirm('Ai deja o comanda in editare! Continui?')) return false;
                            }
                            var obj = $(this);
                            obj.addClass('disabled');
                            var target_elem = obj.data('target-element');
                            $('#tab_customer').parent().click();
                            $('#tab_customer_edit_tab_view_content').parent().click();
                            waitForElm('input[name="customer[email]"]').then((elm) => {
                                var email = $('input[name="customer[email]"]').val();
                                var user = $('.admin-user-account-text').text();
                                bie_request({url:'/user-actions', method: 'POST', data: {entity_id: email, user: user}}).then(function(response) {
                                    if (response.body) {
                                        //exist, add error
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        var mesaj = `Pentru clientul cu adresa de e-mail ${email} face deja o acțiune <b>${response.body.user}</b>!`;
                                        if ($('#messages').length) $('#messages').html(`<div class="messages"><div class="message message-error error">${mesaj}<a class="do_action">Ignoră și continuă!</a></div></div>`);
                                        else $('.page-main-actions').after(`<div class="messages"><div class="message message-error error">${mesaj}<a class="do_action">Ignoră și continuă!</a></div></div>`);
                                        $('.do_action').click(function() {
                                            $('#messages').html('');
                                            obj.removeClass('disabled');
                                            $(target_elem)[0].dispatchEvent(new MouseEvent('click', {button: event.button}));
                                        });
                                    }
                                    else {
                                        obj.removeClass('disabled');
                                        $(target_elem)[0].dispatchEvent(new MouseEvent('click', {button: event.button}));
                                    }
                                }).catch(function(e) {
                                    obj.removeClass('disabled');
                                    $(target_elem)[0].dispatchEvent(new MouseEvent('click', {button: event.button}));
                                });
                            });
                        }
                    });
                    $(document).ready(function() {
                        waitForElm('div[data-index="customer"] input[name="customer[verified_phone_number]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Se sincronizeaza din Gigya!');
                        });
                        waitForElm('div[data-index="customer"] input[name="customer[unverified_phone_number]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Se sincronizeaza din Gigya!');
                        });
                        waitForElm('div[data-index="customer"] input[name="customer[firstname]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Se sincronizeaza din Gigya!');
                        });
                        waitForElm('div[data-index="customer"] input[name="customer[lastname]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Se sincronizeaza din Gigya!');
                        });
                        waitForElm('div[data-index="customer"] input[name="customer[email]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Se sincronizeaza din Gigya!');
                        });
                        waitForElm('div[data-index="customer"] select[name="customer[is_confirmed]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Se sincronizeaza din Gigya!');
                        });
                        waitForElm('div[data-index="customer"] input[name="customer[gigya_account_enriched]"]').then((elm) => {
                            elm.attr('disabled', true);
                        });
                        waitForElm('div[data-index="customer"] input[name="customer[new_password]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Nu se poate seta parola in M2!');
                        });
                        waitForElm('div[data-index="customer"] input[name="customer[generate_password]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Nu se poate seta parola in M2!');
                        });
                        waitForElm('div[data-index="customer"] select[name="customer[gigya_subscribe]"]').then((elm) => {
                            elm.attr('disabled', true).attr('title', 'Este un atribut din Gigya, nu are relevanta in M2!');
                        });
                        $('.page-actions #back').after('<button id="open_gigya_page" type="button" class="action- scalable"><span>Acceseaza in Gigya</span></button>');
                        $('#open_gigya_page').on('click', function() {
                            $('#tab_customer').parent()[0].dispatchEvent(new MouseEvent("click", {button: 0}));
                            waitForElm('input[name="customer[gigya_uid]"]').then((elm) => {
                                let gigya_url = 'https://console.gigya.com/#/33480622/4_1Im-fB17dOvkajB5qpaXzg/dashboard/profiles/user-details/uid/';
                                if (location.hostname == 'staging.dedeman.ro') gigya_url = 'https://console.gigya.com/#/33480622/4_9nluZod0q-ToZIlFA5GDNA/dashboard/profiles/user-details/uid/';
                                else if (location.hostname == 'staging2.dedeman.ro') gigya_url = 'https://console.gigya.com/#/33480622/4_SqRo6LfWEo8osmJ3z-0qaQ/dashboard/profiles/user-details/uid/';
                                let gigya_uid = elm.val();
                                if (gigya_uid) GM_openInTab(gigya_url + gigya_uid,{active: true, insert: false});
                                else alert('Nu am identificat "Gigya uid"!');
                            });
                        });
                    });
                }
                else if (location.href.includes('admin/catalog/product/edit/id')) {
                    GM_addStyle(`
                .entry-edit.form-inline {display: grid;}
                [data-index="product-details"] {order: -100;}
                [data-index="sources"] {order: -90;}
                [data-index="source_attributes"] {order: -80;}
                [data-index="product_suppliers"] {order: -70;}
                [data-index="suppliers"] {order: -60;}
                [data-index="shopwide"] {order: -50;}
                [data-index="sales-coefficients-and-unit"] {order: -40;}
                [data-index="transport-materiale-grele"] {order: -38;}
                [data-index="delivery-volumetric"] {order: -36;}
                [data-index="stock-la-nivel-de-site"] {order: -30;}
                [data-index="garantie-suplimentara"] {order: 100;}
                [data-index="eticheta-cadou"] {order: 101;}
                [data-index="importanta"] {order: 102;}
                [data-index="campaign"] {order: 103;}
                [data-index="product.form.configurable.matrix.content"] {order: 200;}
                `);
                    GM_addStyle(`thead th { cursor: pointer; } .tablesearch.data-grid {border: 1px solid #d6d6d6;} .tablesearch-input {max-width: 300px;} .scroll_top_table {cursor: pointer; margin-top: 10px; display: inline-block;} .scroll_top_table:hover {text-decoration: underline;} .enable-edit:hover {text-decoration: underline;}`);
                    $(document).ready(function() {
                        $('.page-actions #back').after('<button id="open_frontend_page" type="button" class="action- scalable"><span>Acceseaza in frontend</span></button><button id="open_frontend_page_friendly" type="button" class="action- scalable"><span>Acceseaza in frontend - url friendly</span></button>');
                        $('#open_frontend_page').click(function() {
                            var id = location.href.match(/(?:edit\/id\/)(\d+)/i)[1];
                            var link = location.origin + '/catalog/product/view/id/' + id;
                            GM_openInTab(link,{active: true, insert: false});
                        });
                        $('#open_frontend_page_friendly').click(function() {
                            var sku = $('input[name="product[sku]"]').val();
                            magento_request({api_url:`/rest/V1/products/${sku}/`, return_fields: 'sku,custom_attributes[url_key]'}).then(function(response) {
                                if (response) {
                                    Object.values(response.custom_attributes).forEach(val => {
                                        var link = location.origin +'/'+ val.value;
                                        GM_openInTab(link,{active: true, insert: false});
                                    });
                                }
                                else alert('Nu am gasit id-ul produsului!');
                            }).catch(function(e) {
                                alert(e);
                            });
                        });
                        waitForElm('div[data-index="assigned_sources"] table.admin__dynamic-rows').then((elm) => {
                            table_search($('div[data-index="assigned_sources"] table.admin__dynamic-rows'));
                            elm.find('th:contains(Cantitate)').addClass('enable-edit').attr('title', 'Middle click pentru a activa editarea cantitatii!');
                        });
                        $(document).one('auxclick', '.enable-edit', function(e) {
                            $(this).removeClass('enable-edit').removeAttr('title');
                            if ($(this).closest('table').find('select:disabled').length) {
                                $('button[data-index="advanced_inventory_button"]').click();
                                waitForElm('.product_form_product_form_advanced_inventory_modal').then((elm) => {
                                    elm.find('input[name="product[stock_data][use_config_manage_stock]"]').click();
                                    elm.find('select[name="product[stock_data][manage_stock]"]').val('1')[0].dispatchEvent(new Event("change"));
                                    elm.find('button.action-primary').click();
                                });
                            }
                        });
                        function table_search(table) {
                            var table_id = 'table_'+Math.floor((Math.random() * 1000000000000) + 1);
                            table.attr('id', table_id).addClass('tablesearch');
                            table.closest('.admin__field-control').find('.admin__control-table-pagination').prepend(`<input class="admin__control-text tablesearch-input" type="text" data-tablesearch-table="#${table_id}" placeholder="Search in table"><span class="result_count" style="margin-left: 16px;"></span>`);
                            var select = table.closest('.admin__field-control').find('.admin__control-table-pagination .admin__control-select');
                            select.val('100');
                            select[0].dispatchEvent(new Event("change"));
                            table.after('<div class="scroll_top_table">Scroll to top of table</div>');
                        }
                        $(document).on('click', '.scroll_top_table', function(e) {
                            $(this).closest('.fieldset-wrapper')[0].scrollIntoView();
                        });
                        $(document).one('click', 'div[data-index="source_attributes"]', function(e) {
                            waitForElm('div[data-index="source_attributes"] table.admin__dynamic-rows').then((elm) => {
                                table_search($('div[data-index="source_attributes"] table.admin__dynamic-rows'));
                            });
                        });
                        $(document).one('click', 'div[data-index="suppliers"]', function(e) {
                            waitForElm('div[data-index="suppliers"] table.data-grid tr td:nth-of-type(1) > .data-grid-cell-content').then((elm) => {
                                elm.each(function() {
                                    get_supplier_name($(this));
                                });
                            });
                        });
                        function get_supplier_name(obj) {
                            var sap_code = obj.text() || '';
                            if (sap_code) {
                                magento_mui_request({namespace:`suppliers_listing&filters[sap_code]=${sap_code}`}).then(function(response) {
                                    if (response.items.length) {
                                        $.each(response.items, function(index, value) {
                                            if (value.sap_code == sap_code) {
                                                obj.html(sap_code + ' | ' + value.name);
                                                return false;
                                            }
                                        });
                                    }
                                }).catch(function(e) {
                                    console.log(e);
                                });
                            }
                        }
                        $('body').on('keyup', '.tablesearch-input', function() {
                            tableSearch(this);
                        });
                        $(document).one('click', 'div[data-index="sales-coefficients-and-unit"]', function(e) {
                            waitForElm('input[name="product[volume]"]').then((elm) => {
                                function calc() {
                                    var um_volum = $('input[name="product[unit_volume]"]').val() || 0;
                                    var volum = $('input[name="product[volume]"]').val() || 0;
                                    if (volum && um_volum) {
                                        var greutate_volumetrica = get_volume_weight(volum, um_volum);
                                        var text_greutate_volumetrica = '';
                                        if (greutate_volumetrica.error) text_greutate_volumetrica = greutate_volumetrica.error;
                                        else text_greutate_volumetrica = greutate_volumetrica[6000].toLocaleString('ro-RO', {maximumFractionDigits: 2}) + ' kg';
                                        if ($('.greutate_volumetrica').length) $('.greutate_volumetrica').html(text_greutate_volumetrica);
                                        else $('input[name="product[volume]"]').closest('div').find('.admin__field-note').append('<span class="greutate_volumetrica" style="margin-left: 16px; font-weight: bold;">'+text_greutate_volumetrica+'</span>');
                                    }
                                    else $('.greutate_volumetrica').remove();
                                }
                                calc();
                                $(document).on('keyup', 'input[name="product[volume]"], input[name="product[unit_volume]"]', function() {
                                    calc();
                                });
                            });
                        });
                        $(document).one('click', 'div[data-index="shopwide"]', function(e) {
                            waitForElm('select[name="product[restrict_shipping_methods]"]').then((elm) => {
                                elm.attr('size', elm[0].options.length);
                                elm.find('option[value*=fix]').append(' - cost fix');
                            });
                        });
                    });
                }
                else if (location.href.includes('/admin/user/edit/user_id') || location.href.includes('/admin/user/new')) {
                    waitForElm('#user_current_user_verification_fieldset').then((elm) => {
                        elm.insertBefore($('#user_base_fieldset'));
                        $('#user_expires_at').attr('autocomplete', 'off');
                        $('#user_expires_at').attr('disabled', true);
                        $('#user_expires_at').val('');
                        $('#user_is_active').val('1');
                        $('#user_password').attr('autocomplete', 'new-password').val('');
                        $('#user_confirmation').attr('autocomplete', 'new-password').val('');
                        $('#user_current_password').attr('autocomplete', 'current-password');
                        $('#user_username').attr('autocomplete', 'new-username');
                        $('#user_username').closest('.admin__field').insertBefore($('#user_password').closest('.admin__field'));
                    });
                }
                else if (location.href.includes('admin/system_account/index')) {
                    waitForElm('#current_user_verification_fieldset').then((elm) => {
                        elm.insertBefore($('#base_fieldset'));
                        $('#password').attr('autocomplete', 'new-password').val('');
                        $('#confirmation').attr('autocomplete', 'new-password').val('');
                        $('#current_password').attr('autocomplete', 'current-password');
                    });
                }
                else if (location.href.includes('/admin/ban/order/customerban/order_id/')) {
                    $(document).ready(function() {
                        $('.legend.admin__legend').append(`<a id="date_fictive" style="cursor: pointer; float: right; font-size: 1.7rem; padding: 7px 0 10px; display: inline-block;">Date fictive</a>`);
                        $('#date_fictive').one('click', function() {
                            $(this).fadeOut();
                            let domain = $('#ban_email').val().split('@')[1];
                            if (Mailcheck.defaultDomains.indexOf(domain) > 0) alert(`Nu ar trebui sa banezi domeniul "${domain}"!`);
                            else {
                                if (domain) $('#ban_email').val(domain);
                                $('#ban_email').removeAttr('readonly');
                                $('#ban_note').val('date fictive');
                                $('#ban_ban_type_id').val('1');
                            }
                        });
                    });
                }
                else if (location.href.includes('/admin/pallet/index/edit/id') || location.href.includes('/admin/dededeal/index/edit/id')) {
                    GM_addStyle(`td[data-index="id"] span {cursor: pointer;} td[data-index="id"] span:hover {text-decoration: underline;} .danger {color: red !important;}`);
                    $(document).on('auxclick', 'td[data-index="id"] span', function(e) {
                        if (e.button === 1) {
                            var id = $(this).text().trim() || 0;
                            $(this).fadeOut().fadeIn();
                            if (id) GM_openInTab(location.origin + '/admin/catalog/product/edit/id/' + id,{active: false, insert: false});
                        }
                    });
                    function check() {
                        $('tbody td[data-index="sku"].danger').removeClass('danger');
                        $('tbody td[data-index="sku"]:not(.danger)').each(function() {
                            var sku = $(this).find('span[data-index="sku"]').text().trim();
                            if ($('tbody td[data-index="sku"]:not(.danger):contains('+sku+')').length > 1) $('tbody td[data-index="sku"]:not(.danger):contains('+sku+')').addClass('danger');
                        });
                        var produse_duplicat = $('td.danger').length;
                        if ($('.result_count').length) $('.result_count').html(produse_duplicat + ' randuri dublate');
                        else $('.admin__field:nth-of-type(4) .admin__control-table-wrapper').closest('.admin__field-control').find('.admin__control-table-pagination').prepend(`<span class="result_count" style="margin-left: 16px;">${produse_duplicat} randuri dublate</span>`);
                    }
                    waitForElm('.admin__field:nth-of-type(4) .admin__control-table-wrapper').then((elm) => {
                        var select = $('div._no-header.admin__field-wide.admin__field:nth-of-type(4) > .admin__field-control > .admin__control-table-pagination > .admin__data-grid-pager-wrap > .admin__control-select');
                        select.val('500');
                        select[0].dispatchEvent(new Event("change"));
                        var callback = function(mutationsList, observer) {
                            if ($('.admin__field:nth-of-type(4) .admin__control-table-wrapper .admin__data-grid-loading-mask').length == 0) {
                                setTimeout(function() {
                                    check();
                                }, 1000);
                            }
                        };
                        var observer = new MutationObserver(callback);
                        observer.observe($('.admin__field:nth-of-type(4) .admin__control-table-wrapper')[0], { attributes: true, childList: true, subtree: false });
                    });
                }
                else if (location.href.includes('/admin/user_role/editrole/rid')) {
                    $(document).ready(function() {
                        $('legend:contains(Roles Resources)').append(`<a id="copy" style="cursor: pointer; margin-left: 10px">Copy</a><a id="paste" style="cursor: pointer; margin-left: 10px">Paste</a>`);
                        $('#copy').click(function() {
                            $(this).fadeOut().fadeIn();
                            var selected = [];
                            $('#role-edit-form input[name="resource[]"]').each(function() {
                                selected.push($(this).val());
                            });
                            GM_setValue('user_role_settings', JSON.stringify(selected));
                        });
                        $('#paste').click(function() {
                            $(this).fadeOut().fadeIn();
                            if (GM_getValue('user_role_settings')) {
                                var selected = JSON.parse(GM_getValue('user_role_settings'));
                                $('#role-edit-form input[name="resource[]"]').remove();
                                $('.jstree-container-ul a.jstree-clicked').removeClass('jstree-clicked');
                                var inputs = '';
                                $.each(selected, function(i, val) {
                                    inputs += `<input type="hidden" name="resource[]" value="${val}">`;
                                    $(`.jstree-container-ul li[id="${val}"] > a`).addClass('jstree-clicked');
                                });
                                $('#role-edit-form').append(inputs);
                                GM_deleteValue('user_role_settings');
                            }
                            else alert('Nu am gasit informatii salvate!');
                        });
                    });
                }
                else if (location.href.includes('admin/payment_link/listing/new')) {
                    console.log('add payment link');
                    GM_addStyle(`input:invalid {border-color: red !important;}`);
                    var urlParams = new URLSearchParams(location.search);
                    $(document).on('keyup', '#email', function() {
                        $(this).mailcheck({
                            suggested: function(element, suggestion) {
                                element.next('.suggestion').html(`Ai vrut sa scrii <b>${suggestion.full}</b>? <a data-value="${suggestion.full}" data-input_id="#email">Da, corecteaza!</a> <div class="closeIcon">×</div>`).slideDown();
                            },
                            empty: function(element) {
                                element.next('.suggestion').slideUp();
                            }
                        });
                    });
                    waitForElm('select[name="general[expiration]"]').then((elm) => {
                        $('input[name="general[customer_email]"]').attr('id', 'email').attr('type', 'email').after('<div class="suggestion"></div>').trigger('keyup');
                        $('input[name="general[payment_amount]"]').attr('type', 'number').attr('step', '0.01').attr('min', '0.01');
                    });
                    function add_details() {
                        console.log('add details');
                        waitForElm('.loading-mask:hidden').then((elm) => {
                            $('#detalii_link').remove();
                            $('textarea[name="general[details]"]').val('');
                            if (urlParams.get('total')) $('input[name="general[payment_amount]"]').val(urlParams.get('total'))[0].dispatchEvent(new Event("change"));
                            if (urlParams.get('payment')) $('select[name="general[payment_method]"]').val(urlParams.get('payment'))[0].dispatchEvent(new Event("change"));
                            let increment_id = $('input[name="general[increment_id]"]').val() || '';
                            if (increment_id) {
                                $('textarea[name="general[details]"]').before(`<select class="admin__control-select" id="detalii_link" style="margin-bottom: 6px;">
                        <option value="contravaloare ${increment_id}">contravaloare ${increment_id}</option>
                        <option value="contravaloare livrare curier ${increment_id}">contravaloare livrare curier ${increment_id}</option>
                        <option value="contravaloare livrare flota Dedeman standard ${increment_id}">contravaloare livrare flota Dedeman standard ${increment_id}</option>
                        <option value="contravaloare livrare Gold ${increment_id}">contravaloare livrare Gold ${increment_id}</option>
                        <option value="contravaloare diferenta inlocuire produse ${increment_id}">contravaloare diferenta inlocuire produse ${increment_id}</option>
                        <option value="contravaloare diferenta adaugare produse ${increment_id}">contravaloare diferenta adaugare produse ${increment_id}</option>
                        </select>`);
                                $('#detalii_link').change();
                            }
                        });
                    }
                    add_details();
                    $(document).on('change', '#detalii_link', function() {
                        $('textarea[name="general[details]"]').val($(this).val())[0].dispatchEvent(new Event("change"));
                    });
                    $(document).on('change', 'input[name="general[increment_id]"]', function(e) {
                        add_details();
                    });
                    $(document).on('click', '#save', function(e) {
                        let procesator = 'ING WebPay';
                        if ($('select[name="general[payment_method]"]').val() === 'btipay') procesator = 'BT iPay';
                        let expiry_days = Number($('select[name="general[expiration]"]').val());
                        let expiry_days_text = expiry_days === 1 ? `1 zi` : `${expiry_days} zile`;
                        let text = create_sent_link_text({procesator: procesator, days: expiry_days_text, description: $('textarea[name="general[details]"]').val(), amount: $('input[name="general[payment_amount]"]').val(), rate: ''});
                        sessionStorage.setItem('text_link_de_plata', text);
                        copy_text(text, text);
                    });
                }
                else if (location.href.includes('admin/payment_link/listing')) {
                    GM_addStyle (`a[href*="sales/order/view/order_id/"] {white-space: nowrap;} .link_ol {cursor: pointer; text-decoration: underline;} .link_ol:hover {color:green;} .toggle-status {cursor: pointer; background-repeat: no-repeat; margin-left: 5px; background-image: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 24 24' id='Layer_1' version='1.0' viewBox='0 0 24 24' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpolyline clip-rule='evenodd' fill='none' fill-rule='evenodd' id='Done__x2014__Displayed_on_the_left_side_of_a_contextual_action_bar__x28_CAB_x29__to_allow_the_user_to_dismiss_it._2_' points=' 21.2,5.6 11.2,15.2 6.8,10.8 ' stroke='%23000000' stroke-miterlimit='10' stroke-width='2'/%3E%3Cpath d='M19.9,13c-0.5,3.9-3.9,7-7.9,7c-4.4,0-8-3.6-8-8c0-4.4,3.6-8,8-8c1.4,0,2.7,0.4,3.9,1l1.5-1.5C15.8,2.6,14,2,12,2 C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10c5.2,0,9.4-3.9,9.9-9H19.9z'/%3E%3C/svg%3E"); height: 20px; width: 20px; float: right; position: absolute; right: -16px; top: 0;} td:has(.succes) {background-color: #28a745 !important;} td:has(.danger) {background-color: #FFC107 !important;} td:has(.info) {background-color: #ff6776 !important;} a[href*="btrl.ro"], a[href*="ing.ro"] {color: #303030;} .info, .danger, .succes {text-align: left; position: relative; overflow: unset; margin-right: 14px; white-space: nowrap;} td:has(a[href*="ing.ro"]) {min-width: 126px;}`);
                    console.log('payment link listing');
                    toggle_link_status();
                    waitForElm('.message-success:contains(Added new payment link successfully), .message-success:contains(Link de plată adăugat cu succes)').then((elm) => {
                        console.log(elm);
                        let new_html = `Link-ul de plata a fost trimis cu succes! Textul pentru comanda se afla deja in clipboard.`;
                        let saved_text = sessionStorage.getItem('text_link_de_plata') || '';
                        if (saved_text) {
                            new_html += `<a class="copy_text_again" style="float: right; cursor: pointer;">Copie mesaj</a>`;
                            $(document).on('click', '.copy_text_again', function() {
                                $(this).fadeOut().fadeIn();
                                copy_text(saved_text, saved_text);
                            });
                        }
                        elm.find('div').html(new_html);
                    });
                    function make_table_actions() {
                        var linkuri = {};
                        $('a[data-orderstatus]').each(function() {
                            let transaction = $(this).text() || '';
                            let procesator = 'ING:';
                            if (/btrl\.ro/.test(this.href)) procesator = 'BTRL:';
                            if (transaction) {
                                let link = procesator+transaction;
                                let elem = $(this).parent();
                                if ($(this).data('orderstatus') == 2) linkuri[link] = {elem: elem, approved: 1};
                                else linkuri[link] = {elem: elem, approved: 0};
                            }
                        });
                        if (Object.keys(linkuri).length) {
                            links_status(linkuri);
                        }
                    }
                    (function(open) {
                        XMLHttpRequest.prototype.open = function() {
                            this.addEventListener("readystatechange", function() {
                                if (this.responseURL.includes('admin/mui/index/render/?namespace=payment_link_list') && this.readyState == 4) {
                                    console.log('xhr intercept');
                                    let response = JSON.parse(this.responseText);
                                    console.log(response);
                                    let last_id = response.items.slice(-1)[0].id || 0;
                                    console.log(last_id);
                                    if (last_id) {
                                        console.log('wait');
                                        waitForElm(`.data-grid > tbody > tr:last-of-type > td > .data-grid-cell-content:contains(${last_id})`).then((elm) => {
                                            console.log('loading done');
                                            console.log(elm);
                                            setTimeout(function() {
                                                if (!$('.danger, .info, .succes').length) {
                                                    console.log('make actions by request');
                                                    make_table_actions();
                                                }
                                            }, 500);
                                        });
                                    }
                                }
                            }, false);
                            open.apply(this, arguments);
                        };
                    })(XMLHttpRequest.prototype.open);
                    waitForElm('#container .admin__data-grid-loading-mask').then((elm) => {
                        console.log('found loader');
                        var loader_callback = function(mutationsList, observer) {
                            if (elm.is(":hidden")) {
                                console.log('loader hided');
                                setTimeout(function() {
                                    if (!$('.danger, .info, .succes').length) {
                                        console.log('make actions by loader');
                                        make_table_actions();
                                    }
                                }, 550);
                            }
                            else {
                                $('.toggle-status-wrapper').remove();
                                $('.danger, .info, .succes').removeClass('danger info succes');
                            }
                        };
                        var loader_observer = new MutationObserver(loader_callback);
                        loader_observer.observe(elm[0], { attributes: true, childList: false, subtree: false });
                    });
                }
                else if (location.href.includes('admin/rma/edit/id/')) {
                    console.log('rma page');
                    GM_addStyle(`
                h1.page-title {cursor: pointer; display: inline-block;} h1.page-title:hover {text-decoration: underline;}`);
                    $(document).on('auxclick', 'h1.page-title', function(e) {
                        if (e.button === 1) {
                            var nrRMA = $(this).text().replace('#','');
                            var text = `<a href="${location.href}" target="_blank">${nrRMA}</a>`;
                            $(this).fadeOut().fadeIn();
                            copy_text(nrRMA, text);
                        }
                    });
                }
            }
            // Search the table //
            function tableSearch(input) {
                var text = $(input).val();
                var table = $(input).attr('data-tablesearch-table');
                var count = $(input).siblings('.result_count');
                if (text == '' || text.length == 0) {
                    $(table).find('tbody tr').removeClass('d-none');
                }
                else {
                    $(table).find('tbody tr').addClass('d-none');
                    $(table).find('tbody td:nth-of-type(1):icontains("' + text + '")').closest('tr').removeClass('d-none');
                }
                var len = $(table).find('tbody > tr:visible').length;
                if (len == 1) count.html('1 rand');
                else count.html(len + ' randuri');
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
                    if (!isNaN(volum)) return {5000: Number((volum*conversie/5000).toFixed(2)), 6000: Number((volum*conversie/6000).toFixed(2))};
                    else return {error: volum+' nu este un numar valid!'};
                }
                else return {error: 'Nu pot face conversia unitatii de masura a volumului!'};
            }
        }
        else if (window.location.host == 'manager.euplatesc.ro') {
            if ((window.location.href == 'https://manager.euplatesc.ro/v3/index.php') && sessionStorage.getItem('link')) {
                window.location.replace(sessionStorage.getItem('link'));
                sessionStorage.removeItem('link');
            }
            else {
                GM_addStyle (`.link_ol {cursor: pointer; text-decoration: underline;} .link_ol:hover {color:green;} .pagination {cursor: pointer;}.table {color: #000;}.table-hover tbody tr:hover { color:#000;} .toggle-status-wrapper {height: 20px;} .toggle-status {cursor: pointer; background-repeat: no-repeat; margin-left: 5px; background-image: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 24 24' id='Layer_1' version='1.0' viewBox='0 0 24 24' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpolyline clip-rule='evenodd' fill='none' fill-rule='evenodd' id='Done__x2014__Displayed_on_the_left_side_of_a_contextual_action_bar__x28_CAB_x29__to_allow_the_user_to_dismiss_it._2_' points=' 21.2,5.6 11.2,15.2 6.8,10.8 ' stroke='%23000000' stroke-miterlimit='10' stroke-width='2'/%3E%3Cpath d='M19.9,13c-0.5,3.9-3.9,7-7.9,7c-4.4,0-8-3.6-8-8c0-4.4,3.6-8,8-8c1.4,0,2.7,0.4,3.9,1l1.5-1.5C15.8,2.6,14,2,12,2 C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10c5.2,0,9.4-3.9,9.9-9H19.9z'/%3E%3C/svg%3E"); height: 20px; width: 20px; float: right;} .succes {background-color: #28a745 !important;} .danger {background-color: #FFC107 !important;} .info {background-color: #DC3545 !important;} .captcha-refresh > span {margin: 0 !important;} input[id^=refund_amount]:invalid {border-color: red; box-shadow: 0 0 0 .2rem rgba(255, 0, 0, 0.25);}`);
                GM_addStyle(GM_getResourceText('hint') + `[class*=hint--]:after {font-size: 13px; line-height: 16px; white-space: pre-line; width: max-content; transition: 0.15s ease-in-out;}  [class*=hint--]:before {transition: 0.15s ease-in-out;}`);
                window.addEventListener("DOMContentLoaded", (event) => {
                    var action = 1;
                    var urlParams = new URLSearchParams(location.search);
                    if ($('.login-panel').length && /link|search/.test(location.search)) sessionStorage.setItem('link', location.href);
                    else if ($('#container').length) {
                        var container_callback = function(mutationsList, container_observer) {
                            console.log('container change');
                            if ($('#container > .row').length || $('#container > img').length) {
                                console.log('page content loaded');
                                if ($('#emailorders').length) {
                                    console.log('pagina link');
                                    GM_addStyle(`.form-control:invalid {border-color: red; box-shadow: 0 0 0 .2rem rgba(255, 0, 0, 0.25);}`);
                                    var text = '';
                                    if (urlParams.get('pagina') == "link") {
                                        if (urlParams.get('total')) $('#order_amount').val(urlParams.get('total'));
                                        if (urlParams.get('nrOL')) $('#order_desc').val("Contravaloare "+urlParams.get('nrOL'));
                                        if (urlParams.get('lastName')) $('#order_clname').val(urlParams.get('lastName'));
                                        if (urlParams.get('firstName')) $('#order_cfname').val(urlParams.get('firstName'));
                                        if (urlParams.get('email')) $('#order_cemail').val(urlParams.get('email'));
                                        if (urlParams.get('phone')) $('#order_phone').val(urlParams.get('phone'));
                                        window.history.pushState('',document.title,'https://manager.euplatesc.ro/v3/');
                                    }
                                    if (!GM_getValue('phone')) config('phone');
                                    var telefon = GM_getValue('phone') || '';
                                    if (!GM_getValue('email')) config('email');
                                    var email = GM_getValue('email') || '';
                                    if ($('#account_used option[value="44841001093"]').length) $('#account_used').val('44841001093');
                                    $('#order_aphone').val(telefon);
                                    $('#order_aemail').val(email);
                                    $('#order_valability').val(3);
                                    $('#order_number').attr('disabled', '');
                                    $('#order_amount').attr('min', '0.01');
                                    var submit = 0;
                                    $('.input-group-append.mpc').on('click', function() {
                                        var interval = setInterval(SetEO,100);
                                        function SetEO() {
                                            if ($('#order_number').val()) {
                                                clearInterval(interval);
                                                $('#order_number').val('EO'+$('#order_number').val().replace('EO',''));
                                                if (submit) {
                                                    submit = 0;
                                                    $('#emailorders #send-button').click();
                                                    waitForElm('.jconfirm-type-green .jconfirm-title:contains(Succes)').then((elm) => {
                                                        copy_text(text, text);
                                                        $('.jconfirm-type-green .jconfirm-buttons').prepend('<button id="copy_text" type="button" class="btn btn-blue">Mesaj comanda</button>');
                                                        $('#copy_text').click(function() {
                                                            $(this).fadeOut().fadeIn();
                                                            copy_text(text, text);
                                                        });
                                                    });
                                                }
                                            }
                                        }
                                    });
                                    $('.input-group-append.mpc').click();
                                    if ($('#account_used option[value="44841001093"]').length) $('#account_used').val('44841001093');
                                    $(document).one('change', '#order_installments', function() {
                                        get_default_installments();
                                        eo_mid_change();//populate order_installments_val
                                    });
                                    $('#emailorders #send-button').hide().after('<span id="new_submit" class="btn btn-success px-5">Trimite</span>');
                                    $('#new_submit').click(function() {
                                        if ($('#emailorders input:invalid').length) {
                                            alert('Formularul contine erori!');
                                            $('#emailorders input:invalid')[0].trigger('focus');
                                        }
                                        else if ($('.suggestion:visible').length) {
                                            alert('Adresa de e-mail nu este corecta!');
                                            $('#order_cemail')[0].trigger('focus');
                                        }
                                        else {
                                            $('#order_number').val('');
                                            submit = 1;
                                            $('.input-group-append.mpc').click();
                                        }
                                    });
                                    var default_installments = {};
                                    $('#order_amount').on('change', function(e) {
                                        set_installments();
                                    });
                                    $('#account_used').on('change', function(e) {
                                        get_default_installments();
                                    });
                                    function get_default_installments() {
                                        $('#order_installments_val').html('');
                                        default_installments = {};
                                        waitForElm('#order_installments_val > option:not([value="all"])').then((elm) => {
                                            $('#order_installments_val > option').each(function() {
                                                default_installments[$(this).val()] = $(this).html();
                                            });
                                            set_installments();
                                        });
                                    }
                                    function set_installments() {
                                        var bt = get_available_installments('btipay', $('#order_amount').val() || 0);
                                        var rzb = get_available_installments('eprate_raiffeisen', $('#order_amount').val() || 0);
                                        var options_html = '<option value="all">Toate</option>';
                                        $.each(Object.keys(default_installments), function(i, value) {
                                            if (value !== 'all') {
                                                var method = value.split('-');
                                                if ((method[0] == 'btrl' && bt.includes(method[1])) || (method[0] == 'rzb' && rzb.includes(method[1]))) options_html += `<option value="${value}">${default_installments[value]}</option>`;
                                            }
                                        });
                                        $('#order_installments_val').html(options_html);
                                    }
                                    $(document).on('click', '#emailorders #send-button', function() {
                                        var valabilitate = $('#order_valability option:selected').text().toLowerCase().replace('nelimitată','nelimitat');
                                        var descriere = $('#order_number').val() + ' - ' + ($('#order_desc').val() || 'XXXXX');
                                        var suma = $('#order_amount').val() || 'XXXXX';
                                        var rate = '';
                                        if ($('#order_installments_val:visible').length) {
                                            var rate_selectate = $('#order_installments_val').val();
                                            if (rate_selectate == 'all') rate = ' - toate ratele disponibile';
                                            else rate = ' - ' + rate_selectate.split('-')[1] + ' rate ' + (rate_selectate.split('-')[0]).replace('btrl', 'BT').replace('rzb', 'Raiffeisen').replace('bcr', 'BCR');
                                        }
                                        text = create_sent_link_text({procesator: 'EuPlatesc', days: valabilitate, description: descriere, amount: suma, rate: rate});
                                    });
                                    $(document).on('keyup', '#order_cemail', function() {
                                        $(this).mailcheck({
                                            suggested: function(element, suggestion) {
                                                element.next('.suggestion').html(`Ai vrut sa scrii <b>${suggestion.full}</b>? <a data-value="${suggestion.full}" data-input_id="#order_cemail">Da, corecteaza!</a> <div class="closeIcon">×</div>`).slideDown();
                                            },
                                            empty: function(element) {
                                                element.next('.suggestion').slideUp();
                                            }
                                        });
                                    });
                                    $('#order_cemail').attr('type', 'email').after('<div class="suggestion"></div>').trigger('keyup');
                                    $('#order_amount').on('paste', function(e) {
                                        e.preventDefault();
                                        var pastedText = '';
                                        pastedText = e.originalEvent.clipboardData.getData('text');
                                        pastedText = pastedText.replace(/lei/gi,'').trim();
                                        if (pastedText) {
                                            if (/^(\d{1,3}(\.\d{3})*|(\d+))(\,\d{1,2})?$/g.test(pastedText)) pastedText = pastedText.replace(/\./g,'').replace(',','.');
                                            $('#order_amount').val(pastedText).change();
                                        }
                                    });
                                }
                                else if (urlParams.get('pagina') == "link" && action) {
                                    action = 0;
                                    $('.submenu-item:contains("Link de plată prin email")').click();
                                }
                                else if (urlParams.get('search') && action) {
                                    console.log('search');
                                    action = 0;
                                    $('#search').val(urlParams.get('search')).change();
                                    setTimeout(function() {
                                        $('.mpc.search-bar-icon.fa-search.fa').click();
                                    }, 100);
                                    window.history.pushState('',document.title,location.origin+location.pathname);
                                }
                                else if ($('.card-header > span:contains("Listă tranzacții")').length) {
                                    console.log('transactions loaded');
                                    toggle_link_status();
                                    $('.card-body > .row.mb-lg-3:eq(0)').append('<div style="margin-top:28px;" class="text-left col-lg-3 text-center mb-sm-2 mb-2"><button id="show_eo" class="btn btn-success"><i class="fa fa-search"></i> <span>Afișează link-uri de plată</span></button></div>');
                                    $('.card-body > .row.mb-lg-3:eq(0) > .offset-xl-2.offset-lg-2').removeClass('offset-xl-2 offset-lg-2');
                                    $('.card-body > .row.mb-lg-3:eq(0) > .col-xl-2.col-lg-2').removeClass('col-xl-2 col-lg-2').addClass('col-xl-3 col-lg-3');
                                    $('#show_eo').click(function() {
                                        $('#querytype').val('none').change();
                                        $('#interval').val('last2d').change();
                                        $('#mid').val('all');
                                        $('#type').val('email');
                                        load_trans_list('0'); //euplatesc function
                                    });
                                    if (show_trans) {
                                        show_trans = 0;
                                        $('#show_eo').click();
                                    }
                                    var trans_config = { attributes: false, childList: true, subtree: false };
                                    var trans_callback = function(mutationsList, trans_observer) {
                                        if ($('#transactions-container > tr').length > 1) {
                                            console.log('transactions change');
                                            // --- EO color
                                            var linkuri = {};
                                            $('#transactions-container > tr > td:nth-of-type(4):contains("EO")').each(function() {
                                                $(this).removeClass().html($(this).text());
                                                var titlu = $(this).text().trim();
                                                var data = new Date($(this).prev().prev().html().replace(/<br ?\/?>/g, " ")).getTime();
                                                if (/EO\d+/.test(titlu)) {
                                                    if ($(this).prev().find('.text-success').length) linkuri[data+':'+titlu] = {elem: $(this), approved: 1};
                                                    else linkuri[data+':'+titlu] = {elem: $(this), approved: 0};
                                                }
                                            });
                                            if (Object.keys(linkuri).length) {
                                                links_status(linkuri);
                                            }
                                            //--- OL link
                                            $('#transactions-container > tr > td:nth-of-type(4) > span').each(function() {
                                                link_comanda($(this));
                                            });
                                        }
                                    }
                                    var trans_observer = new MutationObserver(trans_callback);
                                    trans_observer.observe($('#transactions-container')[0], trans_config);
                                }
                            }
                        };
                        var container_observer = new MutationObserver(container_callback);
                        container_observer.observe($('#container')[0], { attributes: false, childList: true, subtree: false });
                        console.log('container observe');
                        //--- copy transaction details + add order link
                        GM_addStyle ('.copy_tran_details {cursor: pointer; text-decoration: underline;} .copy_tran_details:hover {text-decoration: underline; color: green;}');
                        $(document).on("click", "#transactions-container .fa-caret-square-down", function() {
                            let next_row = $(this).closest('tr').next();
                            let refunded = $(this).closest('tr').find('.fa-undo.fa:not(.button-refund)').length || 0;
                            let id_comanda_index = $('thead > tr > th:contains(ID comand)').index();
                            let transaction = 'retur_EuPlatesc:' + $(this).closest('tr').find('td:eq('+id_comanda_index+')').text().trim();
                            if (!next_row.find('.loaded').length) {
                                var next_row_index = next_row.index();
                                waitForElm('#transactions-container > tr:eq('+next_row_index+') > td > .loaded').then((elm) => {
                                    console.log('transaction details loaded');
                                    next_row.find('.card-header:eq(0)').html('<span class="copy_tran_details"><span class="fa fa-shopping-cart"></span><span style="margin-left: 5px;">Detalii tranzacție</span></span>');
                                    link_comanda(next_row.find('.card > .py-2.m-0.row > div.col-8:nth-of-type(2)'));
                                    if (refunded) {
                                        console.log('refunded');
                                        let links = [];
                                        for (let i=0; i<10; i++) links.push(transaction+':'+i);
                                        bie_request({url:'/payment-links/list', method: 'POST', data: links}).then(function(response) {
                                            $.each(response.body, function(i, info_retur) {
                                                $('.d-flex.pb-4.col-6 > .flex-fill.card > .p-0.card-body > .row.m-0.py-2.w-100').append(`<div class="col-8">${info_retur.user}</div><div class="col-4 text-center">${info_retur.created_at}</div><div class="col-12"><hr></div>`);
                                            });
                                        }).catch(function(e) {
                                            alert(e);
                                        });
                                    }
                                });
                            }
                        });
                        $(document).on("click", ".copy_tran_details", function() {
                            let transaction_details = {};
                            var index_rrn = $('thead > tr > th:contains(RRN)').index();
                            transaction_details.orderNumber = $(this).closest('tr').prev().find('td:eq(3)').text();
                            transaction_details.orderDate = new Date($(this).closest('.card').find('.row > div:contains(Dată autorizare:)').next().text()).toLocaleString('ro');
                            transaction_details.amount = $(this).closest('.card').find('.row > div:contains(Suma:)').next().text().trim().replace(',','');
                            transaction_details.description = $(this).closest('.card').find('.row > div:contains(Descriere:)').next().text().replace('EO - ','');
                            transaction_details.rrn = $(this).closest('tr').prev().find('td:eq('+index_rrn+')').text().trim();
                            transaction_details.status = $(this).closest('.card').find('.row > div:contains(Stare autorizare:)').next().text().trim();
                            transaction_details.transactionId = $(this).closest('.card').find('.row > div:contains(EPID:)').next().text().trim();
                            let text = create_transaction_details_table(transaction_details);
                            $(this).fadeOut().fadeIn();
                            copy_text(text, text);
                        });
                        var show_trans = 0;
                        $(document).on('click', '#main-menu > .menu:nth-of-type(2)', function() {
                            show_trans = 1;
                        });
                        $(document).on('click', '.button-refund', function() {
                            let suma_totala = Number($(this).closest('tr').find('td[id^=tran-amount]').text()?.trim()?.replace(/RON|,/g,''));
                            var rrn_index = $('thead > tr > th:contains(RRN)').index();
                            var rrn = $(this).closest('tr').find('td:eq('+rrn_index+')').text().trim() || '';
                            var tranzactie = '';
                            var id_comanda_index = $('thead > tr > th:contains(ID comand)').index();
                            var id_comanda = $(this).closest('tr').find('td:eq('+id_comanda_index+')').text().trim();
                            if (/EO\d+/.test(id_comanda)) {
                                tranzactie = id_comanda;
                                return_info();
                            }
                            else {
                                var next_row = $(this).closest('tr').next();
                                if (!next_row.find('.loaded').length) {
                                    $(this).closest('tr').find('.fa-caret-square-down').click();
                                    var next_row_index = next_row.index();
                                    var config = { attributes: false, childList: true, subtree: true };
                                    var callback = function(mutationsList, observer) {
                                        observer.disconnect();
                                        tranzactie = next_row.find('.card > .row > div:contains(EPID:)').next().text().trim();
                                        return_info();
                                    };
                                    var observer = new MutationObserver(callback);
                                    observer.observe($('#transactions-container > tr:eq('+next_row_index+') > td')[0], config);
                                }
                                else {
                                    tranzactie = next_row.find('.card > .row > div:contains(EPID:)').next().text().trim();
                                    return_info();
                                }
                            }
                            function return_info() {
                                console.log(tranzactie);
                                waitForElm('.jconfirm-open').then((elm) => {
                                    let input_suma = null;
                                    if (elm.find('input[id^=refund_amount]').length) {
                                        input_suma = elm.find('input[id^=refund_amount]');
                                        input_suma.attr('type', 'number').attr('step', '0.01').attr('min', '0').attr('max', suma_totala);
                                        input_suma.closest('.jconfirm-box').css('width','fit-content');
                                        var info_retur = GM_getValue('info_retur') || {};
                                        console.log(GM_getValue('info_retur'));
                                        if (info_retur.suma_comanda) {
                                            var suma_retur_1 = Number((input_suma.val()-info_retur.suma_comanda).toFixed(2));
                                            if (suma_retur_1 > 0) {
                                                input_suma.closest('.jconfirm-content').prepend(`<table style="width: 375px;font-weight: bold;margin-bottom: 15px;"><tr><td>Suma incasata - suma comanda:<br>${Number(input_suma.val())} - ${Number(info_retur.suma_comanda)}</td><td><span id="set_return_value_1" style="cursor: pointer;background-repeat: no-repeat;background-position-x: right;padding-right: 24px;background-image: ${return_arrow};">${suma_retur_1} lei</span></td></tr></table>`);
                                                $('#set_return_value_1').click(function () {input_suma.val(suma_retur_1.toFixed(2));});
                                            }
                                        }
                                        if (info_retur.valoare_retur) {
                                            var suma_retur_2 = Number(info_retur.valoare_retur);
                                            input_suma.closest('.jconfirm-content').prepend(`<table style="width: 375px;font-weight: bold;margin-bottom: 15px;"><tr><td>Suma returnata pe comanda:</td><td><span id="set_return_value_2" style="cursor: pointer;background-repeat: no-repeat;background-position-x: right;padding-right: 24px;background-image: ${return_arrow};">${suma_retur_2} lei</span></td></tr></table>`);
                                            $('#set_return_value_2').click(function () {input_suma.val(suma_retur_2.toFixed(2));});
                                        }
                                    }
                                    elm.find('.jconfirm-content input[id^=refund_reason]').val('Retur');
                                    elm.find('.jconfirm-buttons > button:contains(Da)').on('click', function () {
                                        let suma_retur = suma_totala;
                                        if (input_suma.length) {
                                            input_suma.val(Number(input_suma.val().trim().replace(",",".").replace(/\u202c|\u202d/g,"")).toFixed(2));
                                            suma_retur = Number(input_suma.val());
                                        }
                                        let tip_returnare = 'totala';
                                        if (suma_totala !== suma_retur) tip_returnare = 'partiala';
                                        if (tranzactie) {
                                            info_retur = GM_getValue('info_retur') || {};
                                            info_retur[tranzactie] = {suma_returnata: suma_retur, rrn: rrn, tip_returnare: tip_returnare};
                                            GM_setValue('info_retur', info_retur);
                                            write_transaction_return('retur_EuPlatesc:'+id_comanda);
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        }
        else if (window.location.host == "admin.mobilpay.ro") {
            let urlParams = new URLSearchParams(location.search);
            if (location.pathname.includes('add-payment-link')) {
                var e_mail;
                waitForElm('#add_prdName_formText').then((elm) => {
                    if (urlParams.get('nrOL')) {
                        $('#add_prdName_formText').val(urlParams.get('nrOL'));
                        $('#add_prdDescription_formTextarea').val('Contravaloare '+urlParams.get('nrOL'));
                    }
                    if (urlParams.get('total')) $('#add_prdPrice_formText').val(urlParams.get('total'));
                    $('#add_prdPrice_formText').attr('type', 'number').attr('step', '0.01').attr('min', '0.01');
                    $('input[name="add[prdCurrency]"]').val('RON');
                    $('#add_prdCurrency_formSelect').val('Lei');
                    $('input[name="add[prdCatId]"]').val(15);
                    $('#add_prdCatId_formSelect').val('Comert electronic').removeClass('x-form-empty-field');
                    var ExpirationDate = new Date();
                    ExpirationDate.setDate(ExpirationDate.getDate() + 3);
                    ExpirationDate = ExpirationDate.toLocaleDateString('de-DE');
                    $('#add_prdaExpirationDate_dateField').val(ExpirationDate);
                    if (urlParams.get('email')) e_mail = urlParams.get('email');
                });
                $(document).on('click', '#add_doAdd_formSubmit', function() {
                    waitForElm('#submit_formSubmit').then((elm) => {
                        $(".x-tool-close").click(function() { window.close(); });
                        var link_exp = $('#add_prdaExpirationDate_dateField').val().split('.');
                        link_exp = link_exp[1]+'/'+link_exp[0]+'/'+link_exp[2];
                        var date1 = new Date();
                        var date2 = new Date(link_exp);
                        var timeDiff = date2.getTime() - date1.getTime();
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        diffDays = diffDays === 1 ? `1 zi` : `${diffDays} zile`;
                        $('#phone_formText').val(urlParams.get('telefon') || '');
                        var button_mesaj_comanda = '<table id="copy_text" class="x-btn x-btn-noicon" style="width: 120px;" cellspacing="0"><tbody class="x-btn-small x-btn-icon-small-left"><tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr><tr><td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em class="" unselectable="on"><button type="button" class=" x-btn-text">Mesaj comanda</button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr><tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr></tbody></table>';
                        var button_send_mail = '<table id="send_mail" class="x-btn x-btn-noicon" style="width: 120px; margin-left: 3px;" cellspacing="0"><tbody class="x-btn-small x-btn-icon-small-left"><tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr><tr><td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em class="" unselectable="on"><button type="button" class=" x-btn-text">Trimite-l pe email</button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr><tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr></tbody></table>';
                        $('#submit_formSubmit').closest('.x-toolbar-right').prev().html('<table><tr><td>'+button_mesaj_comanda +'</td><td>'+ button_send_mail+'</td></tr></table>');
                        $('#submit_formSubmit').css('width','120px');
                        $("#copy_text, #send_mail").hover(function() { $(this).addClass("x-btn-over"); }, function () { $(this).removeClass("x-btn-over"); });
                        $("#copy_text").click(function() {
                            let text = create_sent_link_text({procesator: 'MobilPay', days: diffDays, description: $('#add_prdDescription_formTextarea').val(), amount: $('#add_prdPrice_formText').val(), rate: ''});
                            $(this).fadeOut().fadeIn();
                            copy_text(text, text);
                        });
                        $("#send_mail").click(function() {
                            var to, bcc, subject, body;
                            var text_rate = '';
                            var rate = get_available_installments(urlParams.get('payment_method') || 'crediteurope', $('#add_prdPrice_formText').val());
                            if (rate.length && rate[0] !== '0') text_rate = '\r\nRate disponibile: '+rate.join(', ') + ' rate';
                            to 		= e_mail || '';
                            bcc 	= 'webmaster@dedeman.ro;';
                            subject = 'DEDEMAN SRL - Link de plata Mobilpay - '+urlParams.get('nrOL') || '';
                            body	= `Buna ziua,\r\n\r\nPentru a finaliza tranzactia dvs. la www.dedeman.ro va rugam sa mergeti la adresa de mai jos:\r\n\r\n${$('h3 > input').val()}\r\n\r\nPlata poate fi efectuata online cu carduri Visa/Visa Electron/Mastercard/Maestro in maximum ${diffDays}.\r\nVa multumim ca ati ales Dedeman!\r\n\r\nDaca aveti intrebari suplimentare despre comanda, va rugam sa contactati DEDEMAN SRL la telefon 0234 525 525 sau email suportclienti@dedeman.ro.\r\nIn cazul unor situatii deosebite puteti contacta si MobilPay.ro, la support@mobilpay.ro.\r\n****************************************************************************\r\nDetaliile tranzactiei:\r\nComerciant: www.dedeman.ro\r\nDescrierea comenzii: ${$('#add_prdDescription_formTextarea').val()}\r\nSuma de plata: ${$('#add_prdPrice_formText').val()} lei${text_rate}\r\n****************************************************************************\r\nCu respect,\r\nMobilPay Team - behalf of www.dedeman.ro`;
                            subject = encodeURIComponent(subject);
                            body = encodeURIComponent(body);
                            subject = subject.replace(/ /g,"%20");
                            body = body.replace(/ /g,"%20");
                            body = body.replace(/\r\n|\n|\r/g,"%0D%0A");
                            location.href = 'mailto:'+to+'?bcc='+bcc+'&subject='+subject+'&body='+body+'&Content-Type=text/html';
                        });
                    });
                });
            }
            else {
                GM_addStyle (`.link_ol {cursor: pointer; text-decoration: underline;} .link_ol:hover {color:green;} .toggle-status-wrapper {height: 20px;} .toggle-status {cursor: pointer; background-repeat: no-repeat; margin-left: 5px; background-image: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 24 24' id='Layer_1' version='1.0' viewBox='0 0 24 24' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpolyline clip-rule='evenodd' fill='none' fill-rule='evenodd' id='Done__x2014__Displayed_on_the_left_side_of_a_contextual_action_bar__x28_CAB_x29__to_allow_the_user_to_dismiss_it._2_' points=' 21.2,5.6 11.2,15.2 6.8,10.8 ' stroke='%23000000' stroke-miterlimit='10' stroke-width='2'/%3E%3Cpath d='M19.9,13c-0.5,3.9-3.9,7-7.9,7c-4.4,0-8-3.6-8-8c0-4.4,3.6-8,8-8c1.4,0,2.7,0.4,3.9,1l1.5-1.5C15.8,2.6,14,2,12,2 C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10c5.2,0,9.4-3.9,9.9-9H19.9z'/%3E%3C/svg%3E"); height: 20px; width: 20px; float: right;} .succes {background-color: #28a745 !important;} .danger {background-color: #FFC107 !important;} .info {background-color: #DC3545 !important;} .x-grid3-col {color: black !important;}`);
                GM_addStyle(GM_getResourceText('hint') + `[class*=hint--]:after {font-size: 13px; line-height: 16px; white-space: pre-line; width: max-content; transition: 0.15s ease-in-out;}  [class*=hint--]:before {transition: 0.15s ease-in-out;}`);
                if ((urlParams.get('id_tranzactie') || '').includes('OL')) {
                    waitForElm('#card_cmtExternalId_formText').then((elm) => {
                        $('#cardFilterForm .x-tool-toggle').click();
                        $('#card_cmtExternalId_formText').val(urlParams.get('id_tranzactie'));
                        $('#card_oonStatus_formSelect').val('Oricare').prev().val('-1');
                        $('#card_paramDatetime_advancedDateField').val('Oricand');
                        $('#card_doFilter_formSubmit').click();
                        window.history.pushState('',document.title,location.origin + location.pathname);
                    });
                }
                else if (urlParams.get('id_tranzactie')) {
                    waitForElm('#details0').then((elm) => {
                        Application.Purchase.Grid.carddetails("details",urlParams.get('id_tranzactie'));
                        add_copy_html_button(urlParams.get('id_tranzactie'));
                        waitForElm('#wPurchaseDetails .x-tool-close').then((elm) => {
                            $('#wPurchaseDetails .x-tool-close').click(function() {
                                window.history.pushState('',document.title,location.origin + location.pathname);
                            });
                        });
                    });
                }
                if (location.pathname.includes('purchase/admin/index')) {
                    //returnare tranzactie
                    let rrn = 'negasit';
                    let nr_card = 'negasit';
                    function add_details_button() {
                        if ($('.success.last.span-5').length && $('#detalii_tranzactie').length == 0) {
                            var detalii_tranzactie_btn = $('#confirmPurchase').clone().attr('id', 'detalii_tranzactie');
                            detalii_tranzactie_btn.find('button').html('Detalii tranzactie');
                            detalii_tranzactie_btn.appendTo($('#actionsPurchase'));
                            $("li[id^=prcDetailsTabs__ext] a").removeAttr('href');
                            $('#detalii_tranzactie').click(function() {
                                $(this).fadeOut();
                                if ($('#purchaseLogsListingEditorGrid .x-grid3-row-table').length) get_rrn_pan_details();
                                else {
                                    $("li[id^=prcDetailsTabs__ext]:eq(1) .x-tab-strip-text").trigger("click");
                                    waitForElm('#purchaseLogsListingEditorGrid .x-grid3-row-table').then((elm) => {
                                        $("li[id^=prcDetailsTabs__ext]:eq(0) .x-tab-strip-text").trigger("click");
                                        get_rrn_pan_details();
                                    });
                                }
                            });
                            $('#detalii_tranzactie').mouseenter(function() {$(this).addClass('x-btn-over');}).mouseleave(function() {$(this).removeClass('x-btn-over');});
                        }
                    }
                    function get_rrn_pan_details() {
                        var text = $('.x-grid3-row-table div:contains("rrn")').text() || '';
                        if (/<rrn>(\d{12})<\/rrn>/gm.test(text)) {
                            rrn = /<rrn>(\d{12})<\/rrn>/gm.exec(text)[1];
                        }
                        if (/<pan_masked>(\d{6}\*{4}\d{4})<\/pan_masked>/gm.test(text)) {
                            nr_card = /<pan_masked>(\d{6}\*{4}\d{4})<\/pan_masked>/gm.exec(text)[1];
                        }
                        $('#detalii_tranzactie').parent().append('<table style="margin-top: 10px;width: 100%;font-weight: bold;"><tbody><tr><td>Numar card:</td><td>'+nr_card+'</td></tr><tr><td>RRN:</td><td>'+rrn+'</td></tr></tbody></table>');
                    }
                    var transaction_details;
                    $(document).on("click",".gridZoom",function() {
                        transaction_details = $(this).attr('onclick').replace(/javascript:return Application.Purchase.Grid.carddetails\("details","|"\)/g,"");
                        waitForElm('#confirmPurchase button').then((elm) => {
                            add_copy_html_button(transaction_details);
                            add_details_button();
                        });
                    });
                    let urlParams = new URLSearchParams(location.search);
                    if (urlParams.get('id_tranzactie')) {
                        transaction_details = urlParams.get('id_tranzactie');
                        waitForElm('#confirmPurchase button').then((elm) => {
                            add_copy_html_button(transaction_details);
                            add_details_button();
                        });
                    }
                    $(document).on('click','#doCredit',function() {
                        rrn = '';
                        $('#detalii_tranzactie').click();
                        waitForElm('#actionAmount_formText').then((elm) => {
                            var suma_incasata = Number($('#actionAmount_formText').val());
                            var info_retur = GM_getValue('info_retur') || {};
                            if (info_retur.suma_comanda) {
                                var suma_retur_1 = Number((suma_incasata-info_retur.suma_comanda).toFixed(2));
                                if (suma_retur_1 > 0) {
                                    $('#doAction').prepend(`<div style="height: 20px;"><span style="padding-left: 5px;">Suma incasata - suma comanda: ${suma_incasata} - ${Number(info_retur.suma_comanda)} =&nbsp;</span><span id="set_return_value_1" style="font-weight: bold; font-size: 12px; cursor: pointer;background-repeat: no-repeat;background-position-x: right;padding-right: 20px;background-image: url(&quot;data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' fill='green' xml:space='preserve'%3E%3Cmetadata%3E Svg Vector Icons : http://www.onlinewebfonts.com/icon %3C/metadata%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cpath d='M564.4,929.5L138.9,503.9h279.3c5.6-42.1,13.8-164-61.7-257.7c-66.7-82.8-182.1-124.7-342.9-124.7L10,83.4c2.7-0.5,68.3-13,159.7-13c192.9,0,518,56.8,551.9,433.5H990L564.4,929.5z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);">${suma_retur_1} lei</span></div>`);
                                    $('#set_return_value_1').click(function () {$('#actionAmount_formText').val(suma_retur_1.toFixed(2));});
                                }
                            }
                            if (info_retur.valoare_retur) {
                                var suma_retur_2 = Number(info_retur.valoare_retur);
                                $('#doAction').prepend(`<div style="height: 20px;"><span style="padding-left: 5px;">Suma returnata pe comanda:</span><span id="set_return_value_2" style="font-weight: bold; font-size: 12px; cursor: pointer;background-repeat: no-repeat;background-position-x: right;padding-right: 20px;background-image: url(&quot;data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1000 1000' enable-background='new 0 0 1000 1000' fill='green' xml:space='preserve'%3E%3Cmetadata%3E Svg Vector Icons : http://www.onlinewebfonts.com/icon %3C/metadata%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cpath d='M564.4,929.5L138.9,503.9h279.3c5.6-42.1,13.8-164-61.7-257.7c-66.7-82.8-182.1-124.7-342.9-124.7L10,83.4c2.7-0.5,68.3-13,159.7-13c192.9,0,518,56.8,551.9,433.5H990L564.4,929.5z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"> ${suma_retur_2} lei</span></div>`);
                                $('#set_return_value_2').click(function () {$('#actionAmount_formText').val(suma_retur_2.toFixed(2));});
                            }
                            $('#doCredit_formButton').on('click', function () {
                                var suma_returnata = Number($('#actionAmount_formText').val());
                                var tip_returnare = 'partiala';
                                if (suma_returnata == suma_incasata) tip_returnare = 'totala';
                                info_retur = GM_getValue('info_retur') || {};
                                info_retur[transaction_details] = {suma_returnata: suma_returnata, rrn: rrn, tip_returnare: tip_returnare};
                                GM_setValue('info_retur', info_retur);
                                write_transaction_return('retur_MobilPay:'+transaction_details);
                            });
                        });
                    });
                    //link_ol
                    waitForElm('#details0').then((elm) => {
                        make_transactions_actions();
                        toggle_link_status();
                        $('#purchaseIndexTabs__allTab').after('<li id="link_plata"><a class="x-tab-right"><em class="x-tab-left"><span class="x-tab-strip-inner"><span class="x-tab-strip-text " style="color: red;">Link-uri de plata</span></span></em></a></li>');
                        $('#link_plata').click(function() {
                            $('#card_oonStatus_formSelect').val('Oricare').prev().val('-1');
                            //$('#card_cmtExternalId_formText').val('_');
                            $('#card_prcDestSac_formSelect').val('default-Dedeman').prev().val('14844');
                            $('#card_doFilter_formSubmit').click();
                        });
                        var transactions_callback = function(mutationsList, observer) {
                            if (!$('#purchaseCardListingEditorGrid .x-mask-loading').length) make_transactions_actions();
                        };
                        var transactions_observer = new MutationObserver(transactions_callback);
                        transactions_observer.observe($('#purchaseCardListingEditorGrid > .x-panel-bwrap')[0], { attributes: false, childList: true, subtree: false });
                    });
                    function make_transactions_actions() {
                        let descriere_index = $('thead > tr > .x-grid3-cell:contains(Descriere)').index();
                        let id_tranzactie_index = $('thead > tr > .x-grid3-cell:contains("ID tranzactie")').index();
                        let stare_tranzactie_index = $('thead > tr > .x-grid3-cell:contains("Stare tranzactie")').index();
                        $(`tbody > tr > .x-grid3-td-${descriere_index} > div, tbody > tr > .x-grid3-td-${id_tranzactie_index} > div`).each(function() {
                            link_comanda($(this));
                        });
                        // --- EO color
                        var months = {
                            "ian.": "1",
                            "feb.": "2",
                            "mar.": "3",
                            "apr.": "4",
                            "mai": "5",
                            "iun.": "6",
                            "iul.": "7",
                            "aug.": "8",
                            "sept.": "9",
                            "oct.": "10",
                            "nov.": "11",
                            "dec.": "12"
                        }
                        var linkuri = {};
                        $('.x-grid3-row').each(function() {
                            var obj = $(this).find(`.x-grid3-td-${id_tranzactie_index}`);
                            if (/\d+_\d+_\d+/g.test(obj.text())) {
                                obj.find('div').html(obj.text());
                                let titlu = obj.text();
                                let approved = 0;
                                if (/Platita/gi.test($(this).find(`.x-grid3-td-${stare_tranzactie_index} > div`).text())) approved = 1;
                                linkuri[titlu] = {elem: obj, approved: approved};
                            }
                        });
                        if (Object.keys(linkuri).length) {
                            links_status(linkuri);
                        }
                    }
                }
                function add_copy_html_button(details) {
                    if ($('.success.last.span-5').length && !$('#copy').length) {
                        var copy_btn = $('#confirmPurchase').clone().attr('id', 'copy');
                        copy_btn.find('button').html('Copy HTML');
                        copy_btn.appendTo($('#actionsPurchase'));
                        $('#copy').click(function() {
                            if ($('#purchaseDetails > .span-10 > dl > dd').length) {
                                let transaction_details = {};
                                transaction_details.orderNumber = $('#purchaseDetails > .span-10 > dl > dd > div:nth-of-type(6)').text().trim();
                                transaction_details.orderDate = new Date($('#purchaseDetails > .span-10 > dl > dd > div:nth-of-type(8)').text().trim()).toLocaleString('ro');
                                transaction_details.amount = $('#purchaseDetails > .span-10 > dl > dd > div:nth-of-type(3)').text().trim();
                                transaction_details.status = $('.success.last.span-5').text().replace('Stare tranzactie', '').trim();
                                transaction_details.transactionId = details+':c';
                                let text = create_transaction_details_table(transaction_details);
                                $(this).fadeOut().fadeIn();
                                copy_text(text, text);
                            }
                        });
                        $('#copy').mouseenter(function() {$(this).addClass('x-btn-over');}).mouseleave(function() {$(this).removeClass('x-btn-over');});
                    }
                    else if ($('.notice.last.span-5:contains("Creditata")').length) {
                        $('#doCredit').html($('#doCredit').html().replace('x-btn-noicon', 'x-btn-noicon x-btn-disabled').replace('Crediteaza', 'Creditata deja')).attr('id', 'doCredit_copy');
                        let transaction = 'retur_MobilPay:' + details;
                        let links = [];
                        for (let i=0; i<10; i++) links.push(transaction+':'+i);
                        console.log(links);
                        bie_request({url:'/payment-links/list', method: 'POST', data: links}).then(function(response) {
                            let return_info = [];
                            $.each(response.body, function(i, info_retur) {
                                return_info.push(info_retur.user + ' | ' + new Date(info_retur.created_at).toLocaleString('ro'));
                            });
                            if (return_info.length) {
                                let tooltip_title = return_info.join('\n');
                                $('.notice.last.span-5:contains("Creditata")').addClass('hint--bottom-right hint--rounded').attr('aria-label', tooltip_title);
                            }
                        }).catch(function(e) {
                            alert(e);
                        });
                    }
                }
            }
        }
        else if (window.location.host == "admin.netopia-payments.com") {
            console.log('mobilpay');
            GM_addStyle(`
    .form-group label {
        font-size: 14px;
        line-height: 14px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        font-weight: 400;
        padding-bottom: 6px;
        display: inline-block;
    }
    .my-input {
        width: 100%;
        padding: 8px 14px;
        border: 1px solid rgba(0, 0, 0, 0.23);
        border-radius: 4px;
        color: rgb(33, 33, 33);
        font-size: 14px;
        line-height: 14px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        font-weight: 400;
        outline: none;
        min-height: 36px;
        transition: border-color ease-in-out .25s;
    }
    .my-input:hover {
        border-color: rgb(33, 33, 33);
    }
    .my-input:focus, .my-input:active {
        border-color: rgb(20, 73, 158);
    }
    .my-input:invalid {
        border-color: red;
    }
    .my-submit-button {
        display: inline-flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        position: relative;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
        outline: 0px;
        border: 0px;
        margin: 0px;
        cursor: pointer;
        user-select: none;
        vertical-align: middle;
        appearance: none;
        text-decoration: none;
        color: rgb(255, 255, 255);
        font-size: 14px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        font-weight: 500;
        line-height: 1.75;
        text-transform: uppercase;
        min-width: 64px;
        padding: 6px 16px;
        border-radius: 4px;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
        text-wrap: nowrap;
    }
    .my-submit-button.blue {
        background-color: rgb(20, 73, 158);
    }
    .my-submit-button.green {
        background-color: rgb(31, 170, 0);
    }
    .my-submit-button.gray {
        background-color: rgb(155, 155, 155);
    }
    .my-submit-button.blue:hover {
        text-decoration: none;
        background-color: rgb(0, 35, 111);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
    }
    .my-submit-button.green:hover {
        text-decoration: none;
        background-color: rgb(23 122 1);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
    }
        .my-submit-button.gray:hover {
        text-decoration: none;
        background-color: rgb(100, 100, 100);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
    }
    .NavFooter-appBar {
        display: none !important;
    }
    #app > div > main {
        margin-bottom: 0 !important;
    }
    .DesktopTable-tableWrapper {
        height: calc(100vh - 244px) !important;
    }
    .DesktopTable-root {
        max-height: unset !important;
        overflow: hidden;
    }
    .my-table {
        display: table;
        width: 100%;
        border-collapse: separate;
        border-spacing: 0px;
    }
    .my-table th {
        color: rgb(33, 33, 33);
        font-size: 12px;
        letter-spacing: -0.04px;
        line-height: 26px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        font-weight: 550;
        display: table-cell;
        vertical-align: inherit;
        border-bottom: 1px solid rgb(252, 252, 252);
        padding: 8px;
        position: sticky;
        top: 0px;
        z-index: 2;
        background-color: rgb(244, 246, 248);
        text-align: left;
    }
    .my-table td {
        color: rgb(33, 33, 33) !important;
        font-size: 12px;
        letter-spacing: -0.04px;
        line-height: 18px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        font-weight: 400;
        display: table-cell;
        vertical-align: inherit;
        border-bottom: 1px solid rgb(252, 252, 252);
        padding: 8px;
    }
    .my-table tbody > tr:nth-child(even) {background-color: #f4f6f8;}
    .my-table tr:hover > td {background-image: linear-gradient(rgb(0 0 0/5%) 0 0);}
    .right {
        text-align: right !important;
    }
    .my-progress-wrap {
        position: relative;
        overflow: hidden;
        display: block;
        height: 4px;
        z-index: 0;
        background-color: rgb(165, 185, 218);
    }
    .my-progress-bar1 {
        position: absolute;
        left: 0px;
        bottom: 0px;
        top: 0px;
        transition: transform 0.2s linear 0s;
        transform-origin: left center;
        background-color: rgb(20, 73, 158);
        width: auto;
        animation: 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) 0s infinite normal none running animation-ozg7p2;
    }
    .my-progress-bar2 {
        position: absolute;
        left: 0px;
        bottom: 0px;
        top: 0px;
        transition: transform 0.2s linear 0s;
        transform-origin: left center;
        background-color: rgb(20, 73, 158);
        width: auto;
        animation: 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite normal none running animation-19gglwu;
    }
    .disabled {
        cursor: default;
        opacity: .5;
        pointer-events: none;
    }
    .my-transaction-details {
        display: inline-flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        position: relative;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
        background-color: transparent;
        outline: 0px;
        border: 0px;
        margin: 0px;
        cursor: pointer;
        user-select: none;
        vertical-align: middle;
        appearance: none;
        text-decoration: none;
        text-align: center;
        flex: 0 0 auto;
        border-radius: 50%;
        overflow: visible;
        color: rgba(0, 0, 0, 0.54);
        transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        padding: 5px;
        font-size: 1.125rem;
    }
    .my-transaction-details:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
    .my-search-icon {
        user-select: none;
        width: 1em;
        height: 1em;
        display: inline-block;
        fill: currentcolor;
        flex-shrink: 0;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-size: 1.5rem;
    }
    .transaction-status {
        margin: 0px;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.33px;
        line-height: 13px;
        text-transform: uppercase;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        padding: 3px 6px;
        display: table-caption;
    }
    .approved {
        border: 1px solid rgb(67, 160, 71);
        color: rgb(67, 160, 71);
    }
    .canceled {
        border: 1px solid rgb(229, 57, 53);
        color: rgb(229, 57, 53);
    }
    .link_ol {cursor: pointer; text-decoration: underline;}
    .link_ol:hover {color:green;}
    .toggle-status-wrapper {height: 20px;} .toggle-status {cursor: pointer; background-repeat: no-repeat; margin-left: 5px; background-image: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 24 24' id='Layer_1' version='1.0' viewBox='0 0 24 24' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpolyline clip-rule='evenodd' fill='none' fill-rule='evenodd' id='Done__x2014__Displayed_on_the_left_side_of_a_contextual_action_bar__x28_CAB_x29__to_allow_the_user_to_dismiss_it._2_' points=' 21.2,5.6 11.2,15.2 6.8,10.8 ' stroke='%23000000' stroke-miterlimit='10' stroke-width='2'/%3E%3Cpath d='M19.9,13c-0.5,3.9-3.9,7-7.9,7c-4.4,0-8-3.6-8-8c0-4.4,3.6-8,8-8c1.4,0,2.7,0.4,3.9,1l1.5-1.5C15.8,2.6,14,2,12,2 C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10c5.2,0,9.4-3.9,9.9-9H19.9z'/%3E%3C/svg%3E"); height: 20px; width: 20px; float: right;}
    .succes {background-color: #28a745 !important;}
    .danger {background-color: #FFC107 !important;}
    .info {background-color: #DC3545 !important;}
    .succes > div, .info > div, .danger > div {float: right;}
    .my-title {
        font-weight: bold;
        padding-bottom: 6px;
        display: inline-block;
    }
    .my-content {
        font-size: 14px;
    }
    .my-content td:nth-of-type(1){
        padding-right: 8px;
    }
    .return_table {
        width: 375px;
        font-weight: normal;
        margin-bottom: 15px;
        font-family: 'Roboto';
        font-size: 17px;
    }
    .return_label {
        font-weight: normal;
        font-family: 'Roboto';
        font-size: 17px;
    }
    `);
            GM_addStyle(GM_getResourceText('hint') + `[class*=hint--]:after {font-size: 13px; line-height: 16px; white-space: pre-line; width: max-content; transition: 0.15s ease-in-out;}  [class*=hint--]:before {transition: 0.15s ease-in-out;}`);
            GM_addStyle(GM_getResourceText("confirm_css"));
            GM_addStyle ('.jconfirm .jconfirm-box {width: max-content; min-width: 400px; max-width: 90vw;} .jconfirm .jconfirm-buttons{display: flex; width: 100%; justify-content: space-between; float: unset !important;} .jconfirm-content {margin-top: 12px; font-size: 18px;} .jconfirm .jconfirm-box div.jconfirm-closeIcon {height: 16px; width: 16px; overflow: hidden;}');
            toggle_link_status();
            function make_transactions_actions() {
                $('.link_comanda').each(function() {
                    $(this).removeClass('link_comanda');
                    link_comanda($(this));
                });
                // --- EO color
                var linkuri = {};
                $('.link_de_plata').each(function() {
                    $(this).removeClass('link_de_plata');
                    if ($(this).data('transaction_status') == 'approved') linkuri[$(this).data('link_de_plata')] = {elem: $(this), approved: 1};
                    else linkuri[$(this).data('link_de_plata')] = {elem: $(this), approved: 0};
                });
                if (Object.keys(linkuri).length) {
                    links_status(linkuri);
                }
            }
            var search_icon_svg = `<svg class="my-search-icon" focusable="false" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>`;
            var progress_bar = `<span class="my-progress-wrap"><span class="my-progress-bar1"></span><span class="my-progress-bar2"></span></span>`;
            let payment_statuses = {
                "-2": {label: "Oricare", status: "canceled"},
                "1": {label: "Iniţiată", status: "canceled"},
                "2": {label: "Deschisă", status: "canceled"},
                "3": {label: "Plătită", status: "approved"},
                "4": {label: "Anulată", status: "canceled"},
                "5": {label: "Confirmată", status: "approved"},
                "8": {label: "Creditată", status: "approved"},
                "9": {label: "Chargeback inițiat", status: "canceled"},
                "10": {label: "Chargeback pierdut", status: "canceled"},
                "11": {label: "Eroare", status: "canceled"},
                "12": {label: "Respinsă", status: "canceled"},
                "13": {label: "Fraudă", status: "canceled"},
                "15": {label: "În așteptare", status: "canceled"},
                "15": {label: "Intreruptă 3DSecure", status: "canceled"},
                "16": {label: "Chargeback în așteptare", status: "canceled"},
                "18": {label: "În verificare", status: "canceled"},
                "23": {label: "Expirată", status: "canceled"},
                "24": {label: "Plăți acceptate", status: "approved"}
            };
            var visited = [];
            if (window.onurlchange === null) window.addEventListener('urlchange', (info) => mobilpay_actions());
            mobilpay_actions();
            function mobilpay_actions() {
                console.log('define mp actions');
                console.log(location.pathname);
                let urlParams = new URLSearchParams(location.search);
                if (location.pathname == '/card') {
                    console.log('pagina card');
                    console.log(visited.includes(location.pathname));
                    var transactions_loaded = 0;
                    var transactions_to_load = 0;
                    function search_transactions(offset) {
                        if (!$('#my_filter_form .my-input:invalid').length) {
                            console.log('search request');
                            $('.my-submit-button').addClass('disabled');
                            var data = {};
                            if (offset) {
                                data = JSON.parse(sessionStorage.getItem('transactions_loaded') || {});
                                data.offset = offset;
                                $('#my-table-wrapper tbody').append(`<tr><td colspan="7">${progress_bar}</td></tr>`);
                                $('#my-table-wrapper').scrollTop($('#my-table-wrapper').prop('scrollHeight'));
                            }
                            else {
                                $('#my-table-wrapper tbody').html(`<tr><td colspan="7">${progress_bar}</td></tr>`);
                                data = {
                                    "date":{
                                        "start": $('#start_date').val()+'T00:00:00.000+00:00',
                                        "end": $('#end_date').val()+'T23:59:59.999+00:00'
                                    },
                                    "status": Number($('#order_status').val()),
                                    "email": $('#email').val(),
                                    "minAmount": Number($('#minAmount').val()),
                                    "maxAmount": Number($('#maxAmount').val()),
                                    "posId": Number($('#pos_id').val()),
                                    "count":50,
                                    "offset":offset
                                };
                            }
                            if ($('#order_no').val()) data.merchantId = $('#order_no').val();
                            console.log(data);
                            mobilpay_request({api_url:'/api/order/list/card', method: 'POST', data: data}).then(function(response) {
                                sessionStorage.setItem('transactions_loaded', JSON.stringify(data));
                                var content = '';
                                if (response.count) {
                                    $.each(response.items, function(index, value) {
                                        var clasa = '';
                                        var link_de_plata = '';
                                        if (value.merchantId.includes('_')) {
                                            clasa = 'link_de_plata';
                                            link_de_plata = value.merchantId;
                                        }
                                        content += `<tr><td><button class="my-transaction-details hint--top-right hint--rounded" type="button" data-transaction="${value.orderId}" aria-label="Detalii tranzacție">${search_icon_svg}</button></td><td><span class="transaction-status ${payment_statuses[value.status].status}">${payment_statuses[value.status].label}</span></td><td class="link_comanda">${value.description}</td><td class="link_comanda ${clasa}" data-link_de_plata="${link_de_plata}" data-transaction_status="${payment_statuses[value.status].status}">${value.merchantId}</td><td class="right">${value.amount.toLocaleString('ro')} ${value.currency}</td><td>${value.firstName || ''} ${value.lastName || ''}</td><td>${new Date(value.dateModified).toLocaleString('ro').replace(',','')}</td></tr>`;
                                    });
                                    transactions_loaded = transactions_loaded + response.items.length;
                                    transactions_to_load = response.count - transactions_loaded
                                    if (!transactions_to_load) content += `<tr><td colspan="7" style="font-size: 14px;">Nu mai există rezultate!</td><tr>`;
                                }
                                else content = '<tr><td colspan="7" style="font-size: 16px; text-align: center; padding: 16px;">Nu am găsit tranzacții!</td><tr>';
                                if (offset) {
                                    $('#my-table-wrapper tbody').find('.my-progress-wrap').closest('tr').remove();
                                    $('#my-table-wrapper tbody').append(content);
                                }
                                else $('#my-table-wrapper tbody').html(content);
                                $('.my-submit-button').removeClass('disabled');
                                make_transactions_actions();
                            }).catch(function(e) {
                                console.log(e);
                                $('#my-table-wrapper tbody').html(`<tr><td colspan="7" style="font-size: 16px; text-align: center; padding: 16px;">${e}</td><tr>`);
                                $('.my-submit-button').removeClass('disabled');
                            });
                        }
                    }
                    function show_transaction_details(transaction_id) {
                        var transaction_details = $.confirm({
                            columnClass: '',
                            title: '',
                            content: `<table class="my-table" id="transaction_details">
                    <thead><tr><th colspan="2">Detalii tranzacție</th><th colspan="2">Detalii client</th></tr></thead>
                    <tbody><tr><td colspan="4">${progress_bar}</td></tr></tbody></table>`,
                            type: 'blue',
                            closeIcon: true,
                            buttons: false,
                            theme: 'light',
                            onOpen: function () {
                                get_transaction_details(transaction_id);
                            },
                            onDestroy: function () {
                                if (urlParams.get('transaction_id')) {
                                    urlParams.delete('transaction_id');
                                    window.history.pushState('',document.title,location.origin+location.pathname);
                                    search_transactions(0);
                                }
                            }
                        });
                    }
                    async function get_transaction_details(transaction_id) {
                        let content = $(`
        <table class="my-table" id="transaction_details" data-transaction_id="${transaction_id}">
            <thead>
                <tr><th colspan="2">Detalii tranzacție</th><th colspan="2">Detalii client</th></tr>
            </thead>
            <tbody>
                <tr><td>Stare</td><td class="stare">—</td><td>Nume</td><td class="nume">—</td></tr>
                <tr><td>Preț</td><td class="pret">—</td><td>Prenume</td><td class="prenume">—</td></tr>
                <tr><td class="label_suma_finala">Sumă finală</td><td class="suma_finala">—</td><td>Telefon</td><td class="telefon">—</td></tr>
                <tr><td>Rate</td><td class="rate">—</td><td>E-mail</td><td class="email">—</td></tr>
                <tr><td>RRN</td><td class="rrn">—</td><td></td><td></td></tr>
                <tr><td>ID tranzacție</td><td class="tranzactie">—</td><td></td><td></td></tr>
                <tr><td>Detalii tranzacție</td><td class="detalii_tranzactie">—</td><td></td><td></td></tr>
                <tr><td>Mesaj procesator</td><td class="mesaj_procesator">—</td><td></td><td></td></tr>
                <tr><td>Data inițierii</td><td class="data_initierii">—</td><td></td><td></td></tr>
                <tr>
                    <td>Data modificării</td><td class="data_modificarii">—</td>
                    <td><button id="crediteaza" class="my-submit-button blue" type="button" style="line-height: unset;">Creditează</button></td>
                    <td><button id="copy_details" class="my-submit-button green" type="button" style="line-height: unset;">Copie detalii</button></td>
                </tr>
            </tbody>
        </table>
    `);

                        try {
                            // rulează ambele requesturi în paralel
                            const [response_transaction, response_client] = await Promise.all([
                                mobilpay_request({
                                    api_url: 'api/order/details',
                                    method: 'POST',
                                    data: { id: Number(transaction_id), reload: true }
                                }),
                                mobilpay_request({
                                    api_url: 'api/order/person-details',
                                    method: 'POST',
                                    data: { id: Number(transaction_id) }
                                })
                            ]);

                            // --- Populez datele tranzacției ---
                            content.find('.stare').html(
                                `<span class="transaction-status ${payment_statuses[response_transaction.status].status}">
                ${payment_statuses[response_transaction.status].label}
             </span>`
                            );
                            content.find('.pret')
                                .html(`${response_transaction.amount.toLocaleString('ro')} ${response_transaction.currency}`)
                                .attr('data-suma', response_transaction.amount);
                            content.find('.label_suma_finala').html(
                                response_transaction.status == 8 ? 'Sumă creditată' : 'Sumă finală'
                            );
                            content.find('.suma_finala')
                                .html(`${response_transaction.purchases[0].amount.toLocaleString('ro')} ${response_transaction.currency}`);
                            content.find('.rate').html(response_transaction.installments);
                            content.find('.rrn').html(response_transaction.purchases[0].refNumber || '—');
                            content.find('.tranzactie').html(response_transaction.merchantID);
                            content.find('.detalii_tranzactie').html(response_transaction.description);
                            content.find('.mesaj_procesator').html(response_transaction.purchases[0].response || '—');
                            content.find('.data_initierii').html(new Date(response_transaction.dateCreated).toLocaleString('ro').replace(',', ''));
                            content.find('.data_modificarii').html(new Date(response_transaction.dateModified).toLocaleString('ro').replace(',', ''));

                            // --- Condiții pentru butoane ---
                            if (
                                response_transaction.status == 8 ||
                                payment_statuses[response_transaction.status].status == 'canceled' ||
                                !retur_users.includes(GM_getValue('admin_user') || 'necunoscut')
                            ) {
                                content.find('#crediteaza').addClass('disabled');
                            }
                            if (payment_statuses[response_transaction.status].status == 'canceled') {
                                content.find('#copy_details').addClass('disabled');
                            }

                            // --- Populez datele clientului ---
                            content.find('.nume').html(response_client.billing.firstName || '—');
                            content.find('.prenume').html(response_client.billing.lastName || '—');
                            content.find('.telefon').html(response_client.billing.phone || '—');
                            content.find('.email').html(response_client.billing.email || '—');

                            // --- Actualizez tabelul final ---
                            link_comanda(content.find('.tranzactie'));
                            link_comanda(content.find('.detalii_tranzactie'));
                            $('#transaction_details > tbody').html(content.find('tbody').html());
                            $('#transaction_details').attr('data-transaction_id', transaction_id);

                        } catch (err) {
                            $('#transaction_details > tbody').html(`<tr><td colspan="4">${err}</td></tr>`);
                            console.error(err);
                        }
                    }

                    waitForElm('form:has(.FiltersContainer-expandedButton)').then((elm) => {
                        if (!$('#my_filter_form').length && location.pathname == '/card') {
                            var start_date = new Date();
                            start_date.setDate(start_date.getDate() - 3);
                            var end_date = new Date();
                            start_date = start_date.toISOString().slice(0,10);
                            end_date = end_date.toISOString().slice(0,10);
                            var status_options = '';
                            for (const [key, value] of Object.entries(payment_statuses)) {
                                status_options += `<option value="${key}">${value.label}</option>`;
                            }
                            elm.hide().after(`<form autocomplete="off" style="display: flex;flex-direction: column;gap: 16px; padding: 8px;" id="my_filter_form">
                    <div class="form-group" style="display: flex;gap: 16px; align-items: flex-end;">
                    <div style="width: 130px;"><label for="start_date">De la data</label><input id="start_date" name="start_date" type="date" class="my-input" value="${start_date}" max="${end_date}" required></div>
                    <div style="width: 130px;"><label for="end_date">Până la data</label><input id="end_date" name="end_date" type="date" class="my-input" value="${end_date}" max="${end_date}" required></div>
                    <div><label for="order_no">Număr comandă</label><input id="order_no" name="order_no" type="text" class="my-input"></div>
                    <div>
                    <label for="order_status">Status tranzacție</label>
                    <select id="order_status" class="my-input" required="true">${status_options}</select>
                    </div>
                    <div><label for="email">E-mail</label><input id="email" name="email" type="email" class="my-input"></div>
                    <div style="max-width: 130px;"><label for="minAmount">Suma minimă</label><input id="minAmount" name="minAmount" type="number" class="my-input" min="0" step="0.01"></div>
                    <div style="max-width: 130px;"><label for="maxAmount">Suma maximă</label><input id="maxAmount" name="maxAmount" type="number" class="my-input" min="0" step="0.01"></div>
                    <div style="max-width: 150px;">
                    <label for="pos_id">Cont comerciant</label>
                    <select id="pos_id" class="my-input" required="true"><option value="0">Toate</option><option value="14844" selected="true">Linkuri de plată</option><option value="13552">Dedeman</option></select>
                    </div>
                    <div><button id="my_search" class="my-submit-button blue" type="button">Caută</button></div>
                    </div>
                    </div>
                    </form>`);
                            $('#order_status').val('-2');
                            $('#table-wrapper').hide().after(`<div id="my-table-wrapper" class="DesktopTable-tableWrapper">
                    <table class="my-table">
                    <thead><tr><th width="74px">Acțiuni</th><th>Stare</th><th>Descriere</th><th>ID plată</th><th class="right">Sumă</th><th>Client</th><th width="150px">Data tranzacției</th></tr></thead>
                    <tbody></tbody></table></div>`);
                            if (urlParams.get('order_no')) {
                                $('#order_no').val(urlParams.get('order_no'));
                                if (urlParams.get('from_date')) $('#start_date').val(urlParams.get('from_date'));
                                if (urlParams.get('to_date') && new Date(urlParams.get('to_date')) < new Date()) $('#end_date').val(urlParams.get('to_date'));
                                search_transactions(0);
                                window.history.pushState('',document.title,location.origin+location.pathname);
                            }
                            else if (urlParams.get('transaction_id')) {
                                show_transaction_details(urlParams.get('transaction_id'));
                            }
                            else search_transactions(0);
                            $('#my-table-wrapper').on('scroll', function() {
                                if (this.scrollHeight - this.scrollTop - this.clientHeight < 1) {
                                    if (!$('.my-progress-wrap').length && transactions_to_load) {
                                        search_transactions(transactions_loaded);
                                    }
                                }
                            });
                        }
                    });
                    if (!visited.includes(location.pathname)) {
                        console.log('define on document actions');
                        $(document).on('click', '#my_search', function() {
                            transactions_loaded = 0;
                            transactions_to_load = 0;
                            search_transactions(0);
                        });
                        $(document).on('keypress', '#my_filter_form input', function(e) {
                            if (e.key === 'Enter') $('#my_search:not(.disabled)').click();
                        });
                        $(document).on('click', '.my-transaction-details', function() {
                            show_transaction_details($(this).data('transaction'));
                        });
                        $(document).on('click', '#copy_details', function() {
                            $(this).fadeOut().fadeIn();
                            console.log('click');
                            let transaction_details = {};
                            transaction_details.orderNumber = $('#transaction_details .tranzactie').text();
                            transaction_details.orderDate = $('#transaction_details .data_initierii').text();
                            transaction_details.amount = $('#transaction_details .pret').text();
                            transaction_details.status = $('#transaction_details .transaction-status').text();
                            transaction_details.transactionId = $('#transaction_details').data('transaction_id')+':c';
                            let text = create_transaction_details_table(transaction_details);
                            copy_text(text, text);
                        });
                        $(document).on('click', '#crediteaza', function() {
                            $(this).fadeOut().fadeIn();
                            console.log('click crediteaza');
                            var suma_incasata = Number($('#transaction_details .pret').data('suma'));
                            console.log(suma_incasata);
                            var content = '';
                            var info_retur = GM_getValue('info_retur') || {};
                            console.log(GM_getValue('info_retur'));
                            if (info_retur.suma_comanda) {
                                var suma_retur_1 = Number((suma_incasata-info_retur.suma_comanda).toFixed(2));
                                if (suma_retur_1 > 0) {
                                    content += `<table class="return_table"><tr><td>Suma incasata - suma comanda:<br>${Number(suma_incasata)} - ${Number(info_retur.suma_comanda)}</td><td><span class="set_return_value" data-value="${suma_retur_1}" style="cursor: pointer;background-repeat: no-repeat;background-position-x: right;padding-right: 24px;background-image: ${return_arrow};">${suma_retur_1} lei</span></td></tr></table>`;
                                }
                            }
                            if (info_retur.valoare_retur) {
                                var suma_retur_2 = Number(info_retur.valoare_retur);
                                content += `<table class="return_table"><tr><td>Suma returnata pe comanda:</td><td><span class="set_return_value" data-value="${suma_retur_2}" style="cursor: pointer;background-repeat: no-repeat;background-position-x: right;padding-right: 24px;background-image: ${return_arrow};">${suma_retur_2} lei</span></td></tr></table>`;
                            }
                            content += `<div><label for="retur_tranzactie" class="return_label">Suma de returnat:</label><input id="retur_tranzactie" name="retur_tranzactie" type="number" class="my-input" min="0" step="0.01" max="${suma_incasata}" value="${suma_incasata}"></div>`;
                            var transaction_return = $.confirm({
                                columnClass: '',
                                title: '<span style="font-size: 20px;">Esti sigur ca vrei sa returnezi tranzactia?</span>',
                                content: content,
                                type: 'red',
                                closeIcon: false,
                                buttons: {
                                    da: {
                                        btnClass: 'btn-blue',
                                        action: function () {
                                            if ($('#retur_tranzactie:valid').length) {
                                                console.log('retur request');
                                                transaction_return.showLoading();
                                                var transaction_id = Number($('#transaction_details').data('transaction_id'));
                                                var suma = Number($('#retur_tranzactie').val());
                                                console.log(suma,transaction_id);
                                                mobilpay_request({api_url:'api/order/operation', method: 'POST', data: {"id":transaction_id,"amount":suma,"action":5}}).then(function(response_retur) {
                                                    console.log(response_retur);
                                                    $.alert({
                                                        title: '',
                                                        content: 'Tranzactia a fost returnata cu succes!',
                                                        type: 'green',
                                                        onDestroy: function () {
                                                            var rrn = $('#transaction_details .rrn').text();
                                                            var tip_returnare = 'partiala';
                                                            if (suma_incasata == suma) tip_returnare = 'totala';
                                                            if (transaction_id) {
                                                                info_retur = GM_getValue('info_retur') || {};
                                                                info_retur[transaction_id] = {suma_returnata: suma, rrn: rrn, tip_returnare: tip_returnare};
                                                                GM_setValue('info_retur', info_retur);
                                                            }
                                                            $('#transaction_details > tbody').html(`<tr><td colspan="4">${progress_bar}</td></tr></tbody>`);
                                                            get_transaction_details(transaction_id);
                                                            transaction_return.close();
                                                        }
                                                    });
                                                }).catch(function(e) {
                                                    $.alert({
                                                        title: 'Tranzactia nu a putut fi returnata!',
                                                        content: e,
                                                        type: 'red',
                                                        onDestroy: function () {transaction_return.close();}
                                                    });
                                                });
                                                return false;
                                            }
                                            else {
                                                $.alert({
                                                    title: '',
                                                    content: 'Suma nu este corecta!',
                                                    type: 'red'
                                                });
                                                return false;
                                            }
                                        }
                                    },
                                    nu: {
                                        action: function () {
                                            //close
                                        }
                                    }
                                }
                            });
                        });
                        $(document).on('click', '.set_return_value', function () {$('#retur_tranzactie').val($(this).data('value'));});
                    }
                }
                else if (location.pathname == '/dev/link2pay') {
                    if (!visited.includes(location.pathname)) {
                        console.log('define on document actions');
                        $(document).on('click', '.MuiGrid2-root.MuiGrid2-container button', function() {
                            waitForElm('.Link2PayForm-dialog').then((form) => {
                                console.log('form loaded');
                                if (!$('#my_payment_link_form').length) {
                                    form.closest('.MuiDialog-paperFullWidth').attr("style", "max-width:800px");
                                    form.hide().after(`<form autocomplete="off" style="display: flex;flex-direction: column;gap: 16px;" id="my_payment_link_form">
                    <div class="form-group"><label for="order_no">Număr comandă</label><input id="order_no" name="order_no" type="text" class="my-input" placeholder="Număr comandă" required="true" minlength="5"></div>
                    <div class="form-group"><label for="order_details">Detalii comandă</label><textarea type="text" class="my-input" id="order_details" rows="3" minlength="5" maxlength="250" placeholder="Detalii comandă" required="true" style="resize: vertical;"></textarea></div>
                    <div class="form-group" style="display: flex;gap: 16px; align-items: flex-end;">
                    <div>
                    <label for="order_amount">Suma de plată</label>
                    <input type="number" step="0.01" min="0.01" class="my-input" id="order_amount" placeholder="Suma de plată" required="true">
                    </div>
                    <div>
                    <label for="order_curr">Moneda</label>
                    <select id="order_curr" class="my-input" required="true"><option value="RON">RON</option><option value="EUR">EUR</option><option value="USD">USD</option><option value="GBP">GBP</option></select>
                    </div>
                    <div>
                    <label for="order_language">Limba</label>
                    <select id="order_language" class="my-input" required="true">
                    <option value="ro">Română</option>
                    <option value="en">Engleză</option>
                    <option value="it">Italiană</option>
                    <option value="es">Spaniolă</option>
                    <option value="hu">Maghiară</option>
                    <option value="bg">Bulgară</option>
                    </select>
                    </div>
                    <div>
                    <label for="order_valability">Valabilitate</label>
                    <select id="order_valability" class="my-input" required="true">
                    <option value="1">1 zi</option>
                    <option value="2">2 zile</option>
                    <option value="3" selected>3 zile</option>
                    <option value="4">4 zile</option>
                    <option value="5">5 zile</option>
                    <option value="6">6 zile</option>
                    <option value="7">7 zile</option>
                    <option value="8">8 zile</option>
                    <option value="9">9 zile</option>
                    <option value="10">10 zile</option>
                    <option value="15">15 zile</option>
                    <option value="20">20 zile</option>
                    <option value="30">30 zile</option>
                    <option value="60">60 zile</option>
                    <option value="90">90 zile</option>
                    <option value="120">120 zile</option>
                    </select>
                    </div>
                    </div>
                    <div class="form-group" style="display: flex;gap: 16px;align-items: flex-end;justify-content: flex-end;">
                    <button class="my-submit-button gray" type="button">ANULEAZĂ</button><button class="my-submit-button blue" type="button">Trimite</button>
                    </div>
                    </form>`);
                                    if (urlParams.get('nrOL')) {
                                        $('#order_no').val(urlParams.get('nrOL'));
                                        $('#order_details').val('Contravaloare ' + urlParams.get('nrOL'));
                                    }
                                    if (urlParams.get('total')) $('#order_amount').val(urlParams.get('total'));
                                    $('.my-submit-button.gray').click(function () {
                                        form.find('.MuiButton-colorInherit').click();
                                    });
                                    $('.my-submit-button.blue').click(async function () {
                                        if ($(this).data('processing')) return;
                                        $(this).data('processing', true);
                                        try {
                                            if ($('#my_payment_link_form .my-input:invalid').length) {
                                                console.log('Formular invalid — nu trimit');
                                                return;
                                            }
                                            const siteKey = '6Lcin_QlAAAAAL8wbnBm_unfCEvVKbnkeCq-POZ-';
                                            if (typeof grecaptcha === 'undefined' || typeof grecaptcha.ready !== 'function') {
                                                // injectez scriptul (dacă e deja încărcat, acesta va fi ignorat de browser)
                                                await new Promise((resolve, reject) => {
                                                    const s = document.createElement('script');
                                                    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
                                                    s.async = true;
                                                    s.onload = () => resolve();
                                                    s.onerror = () => reject(new Error('Failed to load grecaptcha script'));
                                                    document.head.appendChild(s);
                                                });
                                            }
                                            // așteaptă grecaptcha.ready
                                            await new Promise((res) => grecaptcha.ready(res));
                                            // obținem tokenul
                                            let token;
                                            try {
                                                token = await grecaptcha.execute(siteKey, { action: 'submit' });
                                            } catch (e) {
                                                console.error('grecaptcha.execute failed', e);
                                                throw new Error('Nu s-a putut obține tokenul reCAPTCHA');
                                            }
                                            var data = {
                                                fixedPrice: true,
                                                posID: 14844,
                                                name: $('#order_no').val(),
                                                category: 7,
                                                description: $('#order_details').val(),
                                                amount: Number($('#order_amount').val()),
                                                currency: $('#order_curr').val(),
                                                language: $('#order_language').val(),
                                                data: { captcha: token }
                                            };
                                            let expiry_days = Number($('#order_valability').val());
                                            let expiry_days_text = expiry_days === 1 ? `1 zi` : `${expiry_days} zile`;
                                            if (expiry_days) {
                                                var expiry_date = new Date();
                                                expiry_date.setDate(expiry_date.getDate() + expiry_days);
                                                data.expirationDate = expiry_date.toISOString().slice(0, 10) + 'T00:00:00.000Z';
                                            }
                                            $('.my-submit-button.gray').click();
                                            var payment_link = $.confirm({
                                                columnClass: '',
                                                title: ``,
                                                content: `Loading...`,
                                                type: 'blue',
                                                closeIcon: false,
                                                buttons: {
                                                    Send: {
                                                        text: "Trimite e-mail",
                                                        btnClass: 'btn-blue',
                                                        action: function() {
                                                            var to, bcc, subject, body;
                                                            var text_rate = '';
                                                            var rate = get_available_installments(urlParams.get('payment_method') || 'crediteurope', data.amount);
                                                            console.log('rate', rate);
                                                            if (rate.length && rate[0] !== '0') text_rate = '\r\nRate disponibile: '+rate.join(', ') + ' rate';
                                                            to 		= urlParams.get('email') || '';
                                                            bcc 	= 'webmaster@dedeman.ro;';
                                                            subject = 'DEDEMAN SRL - Link de plata Mobilpay - ' + data.name;
                                                            body	= `Buna ziua,\r\n\r\nPentru a finaliza tranzactia dvs. la www.dedeman.ro va rugam sa mergeti la adresa de mai jos:\r\n\r\n${$('#payment_link').text()}\r\n\r\nPlata poate fi efectuata online cu carduri Visa/Visa Electron/Mastercard/Maestro in maximum ${expiry_days_text}.\r\nVa multumim ca ati ales Dedeman!\r\n\r\nDaca aveti intrebari suplimentare despre comanda, va rugam sa contactati DEDEMAN SRL la telefon 0234 525 525 sau email suportclienti@dedeman.ro.\r\nIn cazul unor situatii deosebite puteti contacta si MobilPay.ro, la support@mobilpay.ro.\r\n****************************************************************************\r\nDetaliile tranzactiei:\r\nComerciant: www.dedeman.ro\r\nDescrierea comenzii: ${data.description}\r\nSuma de plata: ${data.amount} lei${text_rate}\r\n****************************************************************************\r\nCu respect,\r\nMobilPay Team - behalf of www.dedeman.ro`;
                                                            subject = encodeURIComponent(subject);
                                                            body = encodeURIComponent(body);
                                                            subject = subject.replace(/ /g,"%20");
                                                            body = body.replace(/ /g,"%20");
                                                            body = body.replace(/\r\n|\n|\r/g,"%0D%0A");
                                                            location.href = 'mailto:'+to+'?bcc='+bcc+'&subject='+subject+'&body='+body+'&Content-Type=text/html';
                                                            return false;
                                                        }
                                                    },
                                                    Copy: {
                                                        text: "Mesaj comanda",
                                                        btnClass: 'btn-purple',
                                                        action: function() {
                                                            let text = create_sent_link_text({procesator: 'MobilPay', days: expiry_days_text, description: data.description, amount: data.amount, rate: ''});
                                                            payment_link.$$Copy.fadeOut().fadeIn();
                                                            copy_text(text, text);
                                                            return false;
                                                        }
                                                    },
                                                    OK: {
                                                        text: "Închide",
                                                        action: function() {
                                                            window.history.pushState('',document.title,location.origin+location.pathname);
                                                        }
                                                    }
                                                },
                                                theme: 'light',
                                                onOpenBefore: function () {
                                                    payment_link.showLoading({ disableButtons: true });
                                                },
                                                onOpen: function () {
                                                    mobilpay_request({ api_url: 'api/product/insert/prda', method: 'POST', data: data })
                                                        .then(function (response) {
                                                        payment_link.setContent(`<div id="payment_link">${response.code}</div>`);
                                                        payment_link.hideLoading({ enableButtons: true });
                                                    }).catch(function (e) {
                                                        payment_link.setContent(e);
                                                        payment_link.$$Send && payment_link.$$Send.hide();
                                                        payment_link.$$Copy && payment_link.$$Copy.hide();
                                                        payment_link.hideLoading({ enableButtons: true });
                                                    });
                                                }
                                            });

                                        } catch (err) {
                                            console.error('Eroare in flow:', err);
                                            alert('A apărut o eroare: ' + err.message);
                                        } finally {
                                            $(this).data('processing', false);
                                        }
                                    });
                                }
                            });
                        });
                    }
                    console.log('link de plata');
                    if (urlParams.get('nrOL')) {
                        waitForElm('.MuiGrid2-root.MuiGrid2-container button').then((elm) => {
                            elm.click();
                        });
                    }
                }
                if (!visited.includes(location.pathname)) visited.push(location.pathname);
            }
        }
        else if (window.location.hostname == "securepay.ing.ro" || window.location.hostname == "ecclients-sandbox.btrl.ro" || window.location.hostname == "ecclients.btrl.ro") {
            let procesator = 'ING';
            let url = sessionStorage.getItem('link') || '';
            if (/btrl\.ro/.test(location.hostname)) procesator = 'BTRL';
            let urlParams = new URLSearchParams(location.search);
            if (location.hash.includes('/details') || urlParams.get('reconciliation_id') || urlParams.get('email')) {
                sessionStorage.setItem('link', location.href);
                url = location.href;
                $(document).one('click', '.loginPanelButton', function() {
                    waitForElm('.toolbarLogoutButton:visible').then((elm) => {
                        sessionStorage.removeItem('link');
                        window.location.replace(url);
                    });
                });
            }
            else if (!location.hash && url) {
                sessionStorage.removeItem('link');
                window.location.replace(url);
            }
            if (location.hash == '#orders' && (urlParams.get('reconciliation_id') || urlParams.get('email')) && urlParams.get('from_date') && urlParams.get('to_date')) {
                console.log('search');
                waitForElm('.ordersSearchFormPeriodFieldset:visible').then((elm) => {
                    $('.ordersSearchFormPeriodFieldset input[name=fromDate]').val(urlParams.get('from_date'));
                    if (new Date(urlParams.get('to_date')) < new Date()) $('.ordersSearchFormPeriodFieldset input[name=toDate]').val(urlParams.get('to_date'));
                    if (procesator == 'ING') $('.ordersSearchFormParamsFieldset input[name=reconciliationId]').val(urlParams.get('reconciliation_id'));
                    else $('.ordersSearchFormPayerContactFieldset input[name=customerEmail]').val(urlParams.get('email'));
                    $('.ordersSearchForm .ordersSearchFormSearchButton').click();
                    if (procesator == 'ING') window.history.pushState('',document.title,location.origin+'/consola/index.jsp#orders');
                    else {
                        window.history.pushState('',document.title,location.origin+'/console/index.html#orders');
                        sessionStorage.removeItem('link');
                        if (urlParams.get('nrOL')) {
                            waitForElm('#ordersGrid-body .x-grid-table .x-grid-cell-first a').then((elm) => {
                                $(`#ordersGrid-body .x-grid-table .x-grid-cell .x-grid-cell-inner:contains(${urlParams.get('nrOL')})`).css('background', 'yellow');
                            });
                        }
                    }
                });
            }
            else if (location.hash.includes('/details')) {
                console.log('details');
                GM_addStyle(`.link_ol, .ordersDetailsPaymentlinkedTransactionOrderIdField .x-form-display-field {cursor: pointer; text-decoration: underline;} .link_ol:hover, .ordersDetailsPaymentlinkedTransactionOrderIdField .x-form-display-field:hover {color:green;} .ordersDetailsTopToolbarShopingCartButton {display: none !important;}`);
                GM_addStyle(GM_getResourceText('hint') + `[class*=hint--]:after {font-size: 13px; line-height: 16px; white-space: pre-line; width: max-content; transition: 0.15s ease-in-out;}  [class*=hint--]:before {transition: 0.15s ease-in-out;}`);
                function add_transaction_color_link() {
                    if ($('.ordersDetailsMainInfoFieldsetOrderNumberField .x-form-display-field').text()) {
                        //---Status color
                        var status = $('.ordersDetailsMainInfoFieldsetPaymentStateField .x-form-display-field');
                        if (status.text() == 'Deposited') status.css({"background-color": "green", "color": "white", "padding":"2px 10px"});
                        else status.css({"background-color": "red", "color": "white", "padding":"2px 10px"});
                        //---OL link
                        link_comanda($('.ordersDetailsMainInfoFieldsetOrderDescriptionField .x-form-display-field'));
                        if (/reversed|refunded/i.test(status.text())) {
                            let transaction = `retur_${procesator}:` + $('.ordersDetailsMainInfoFieldsetMdOrderField .x-form-display-field').text();
                            console.log(transaction);
                            let links = [];
                            for (let i=0; i<10; i++) links.push(transaction+':'+i);
                            console.log(links);
                            bie_request({url:'/payment-links/list', method: 'POST', data: links}).then(function(response) {
                                let return_info = [];
                                $.each(response.body, function(i, info_retur) {
                                    return_info.push(info_retur.user + ' | ' + new Date(info_retur.created_at).toLocaleString('ro'));
                                });
                                if (return_info.length) {
                                    let tooltip_title = return_info.join('\n');
                                    status.addClass('hint--top hint--rounded').attr('aria-label', tooltip_title);
                                }
                            }).catch(function(e) {
                                alert(e);
                            });
                        }
                    }
                }
                $(document).on('click auxclick', '.ordersDetailsPaymentlinkedTransactionOrderIdField .x-form-display-field', function(event) {
                    if (event.button < 2) {
                        let obj = $(this);
                        obj.fadeOut();
                        let orderNumber = $(this).text();
                        let fromDate = $('.ordersDetailsPaymentFieldsetDateField input').val().slice(0,10);
                        let toDate = new Date(fromDate);
                        toDate.setDate(toDate.getDate() + 1);
                        toDate = toDate.toISOString().slice(0,10);
                        btrl_request({orderNumber: orderNumber, fromDate: fromDate, toDate: toDate}).then(function(response) {
                            setTimeout(function() {
                                btrl_request({future: response.future}).then(function(response) {
                                    $.each(response.data, function(index, value) {
                                        if (value.orderNumber == orderNumber) {
                                            GM_openInTab(location.origin+'/console/index.html#orders/'+value.mdOrder+'/details', {active: !event.button, insert: false});
                                            obj.fadeIn();
                                            return false;
                                        }
                                    });
                                }).catch(function(e) { alert(e); obj.fadeIn();});
                            }, 1000);
                        }).catch(function(e) { alert(e); obj.fadeIn();});
                    }
                });
                waitForElm('.ordersDetailsMainInfoFieldsetMdOrderField .x-form-display-field:contains(-)').then((elm) => {
                    //---status color + OL link
                    add_transaction_color_link();
                    //---add copy details button
                    $('.ordersDetailsTopToolbarRefundButton').after(`<div id="copy" style="border-width: 1px; left: 400px; top: 0px; margin: 0px;" class="x-btn x-box-item x-toolbar-item x-btn-default-toolbar-small x-icon-text-left x-btn-icon-text-left x-btn-default-toolbar-small-icon-text-left"><button type="button" class="x-btn-center" hidefocus="true" role="button" style="height: 18px;"><span style="padding: 0px 10px; font-size: 11px;">Copy transaction details</span></button></div>`);
                    $('#copy').mouseenter(function() { $(this).addClass('x-over x-btn-over x-btn-default-toolbar-small-over over'); }).mouseleave(function() { $(this).removeClass('x-over x-btn-over x-btn-default-toolbar-small-over over'); });
                    $("#copy").click(function() {
                        if ($('.ordersDetailsMainInfoFieldsetPaymentStateField .x-form-display-field').text() !== "Deposited") alert('Atentie!\nTranzactia nu are status "Deposited".');
                        let transaction_details = {procesator: procesator};
                        transaction_details.orderNumber = $('.ordersDetailsMainInfoFieldsetOrderNumberField .x-form-display-field').text();
                        transaction_details.orderDate = new Date($('.ordersDetailsPaymentFieldsetDateField input').val()).toLocaleString('ro');
                        transaction_details.amount = (Number($('.ordersDetailsMainInfoFieldsetAmountField .x-form-display-field').text().replace(/,/g,''))).toLocaleString('ro-RO') + ' ' + $('input[name="currency"]').val().replace(/\(|\)/g,'');
                        transaction_details.description = $('.ordersDetailsMainInfoFieldsetOrderDescriptionField .x-form-display-field').text();
                        transaction_details.status = $('.ordersDetailsMainInfoFieldsetPaymentStateField .x-form-display-field').text();
                        transaction_details.transactionId = $('.ordersDetailsMainInfoFieldsetMdOrderField .x-form-display-field').text();
                        let text = create_transaction_details_table(transaction_details);
                        $('#copy').fadeOut().fadeIn();
                        copy_text(text, text);
                    });
                });
                //----returnare tranzactie
                function lock(arg) {
                    if (!GM_getValue('email')) config('email');
                    bie_request({url:'/user-actions', method: 'POST', data: {entity_id: arg.Id, user: GM_getValue('email')}}).then(function(response) {
                        if (response.body) {
                            //exist, add error
                            GM_addStyle(GM_getResourceText("confirm_css"));
                            GM_addStyle('.jconfirm-my_alert .jconfirm-box {width: fit-content;} .jconfirm-new_email .jconfirm-box {width: 500px;} .jconfirm .jconfirm-box div.jconfirm-closeIcon {height: 16px; width: 16px; overflow: hidden;}');
                            var mesaj = 'Aceasta tranzactie a fost deja preluata de <span style="color: blue;">'+response.body.user+'</span> pentru a fi returnata!';
                            $.alert({
                                title: '',
                                content: `<span style="font-size: 30px;color: red;margin-right: 10px;">⚠</span><span style="font-size: 16px; line-height: 26px;">${mesaj}</span>`,
                                type: 'red',
                                theme: 'light,my_alert'
                            });
                        }
                        else do_return_action();
                    }).catch(function(e) {
                        do_return_action();
                    });
                    function do_return_action() {
                        if (arg.target == 'reverse') {
                            $('.ordersDetailsTopToolbarReverseButton').click();
                        }
                        else if (arg.target == 'refund') {
                            $('.ordersDetailsTopToolbarRefundButton').click();
                        }
                    }
                }
                waitForElm('.ordersDetailsTopToolbarRefundButton').then((elm) => {
                    var trans_config = { attributes: false, childList: true, subtree: true};
                    var trans_callback = function(mutationsList, trans_observer) {
                        if ($('.ordersDetailsMainInfoFieldsetOrderNumberField .x-form-display-field').text()) {
                            trans_observer.disconnect();
                            var pan = $('.ordersDetailsFraudFieldsetPanField .x-form-item-body').text();
                            if (pan == '557444**0375') alert('Atentie!\nAcest client este fictiv iar tranzactia trebuie returnata in termen de 14 zile!');
                        }
                    }
                    var trans_observer = new MutationObserver(trans_callback);
                    trans_observer.observe($('.ordersDetailsMainInfoFieldsetOrderNumberField')[0], trans_config);
                    var refund_config = { attributes: true, childList: true, subtree: false};
                    var refund_callback = function(mutationsList, refund_observer) {
                        if ($('.ordersDetailsTopToolbarRefundButton:not(.x-disabled)').length) {
                            refund_observer.disconnect();
                            $('.ordersDetailsTopToolbarRefundButton').after($('.ordersDetailsTopToolbarRefundButton').clone().attr('id', 'refund-lock').removeClass('ordersDetailsTopToolbarRefundButton')).hide();
                            $(document).on('mouseenter', '#refund-lock:not(.x-disabled)', function() { $(this).addClass('x-over x-btn-over x-btn-default-toolbar-small-over over'); }).on('mouseleave', '#refund-lock', function() { $(this).removeClass('x-over x-btn-over x-btn-default-toolbar-small-over over'); });
                            $(document).on('click', '#refund-lock:not(.x-disabled)', function(event) {
                                $(this).addClass('x-item-disabled x-disabled x-btn-disabled');
                                var id = $('.ordersDetailsMainInfoFieldsetMdOrderField .x-form-display-field').text();
                                lock({Id:id, target: 'refund'});
                            });
                        }
                    }
                    var refund_observer = new MutationObserver(refund_callback);
                    refund_observer.observe($('.ordersDetailsTopToolbarRefundButton')[0], refund_config);
                    var reverse_config = { attributes: true, childList: false, subtree: false};
                    var reverse_callback = function(mutationsList, reverse_observer) {
                        if ($('.ordersDetailsTopToolbarReverseButton:not(.x-disabled)').length) {
                            reverse_observer.disconnect();
                            $('.ordersDetailsTopToolbarReverseButton').after($('.ordersDetailsTopToolbarReverseButton').clone().attr('id', 'reverse-lock').removeClass('ordersDetailsTopToolbarReverseButton')).hide();
                            $(document).on('mouseenter', '#reverse-lock:not(.x-disabled)', function() { $(this).addClass('x-over x-btn-over x-btn-default-toolbar-small-over over'); }).on('mouseleave', '#reverse-lock', function() { $(this).removeClass('x-over x-btn-over x-btn-default-toolbar-small-over over'); });
                            $(document).on('click', '#reverse-lock:not(.x-disabled)', function(event) {
                                $(this).addClass('x-item-disabled x-disabled x-btn-disabled');
                                var id = $('.ordersDetailsMainInfoFieldsetMdOrderField .x-form-display-field').text();
                                lock({Id:id, target: 'reverse', event:event});
                            });
                        }
                    }
                    var reverse_observer = new MutationObserver(reverse_callback);
                    reverse_observer.observe($('.ordersDetailsTopToolbarReverseButton')[0], reverse_config);
                });
                $(document).on('click', '.ordersDetailsTopToolbarReverseButton', function(event) {
                    var rrn = $('.ordersDetailsResultFieldsetReferenceNumberField .x-form-display-field').text();
                    var suma_incasata = Number($('.ordersDetailsMainInfoFieldsetAmountField .x-form-display-field').text().replace(/,/g,'') || '0');
                    var refunded = Number($('.ordersDetailsPaymentFieldsetRefundAmountField .x-form-display-field').text().replace(/,/g,'') || '0');
                    var tranzactie = $('.ordersDetailsMainInfoFieldsetMdOrderField .x-form-display-field').text();
                    var status = $('.ordersDetailsMainInfoFieldsetPaymentStateField .x-form-display-field').text();
                    waitForElm('div[id^="messagebox-"]').then((elm) => {
                        $('div[id^="messagebox-"] div[id^="button"]:contains("Yes")').on('click', function() {
                            var info_retur = GM_getValue('info_retur') || {};
                            info_retur[tranzactie] = {suma_returnata: suma_incasata, rrn: rrn, tip_returnare: 'totala'};
                            GM_setValue('info_retur', info_retur);
                            write_transaction_return(`retur_${procesator}:`+tranzactie);
                            observe_transaction_changes(rrn, refunded, tranzactie, status);
                        });
                    });
                });
                $(document).on('click', '.ordersDetailsTopToolbarRefundButton', function() {
                    var rrn = $('.ordersDetailsResultFieldsetReferenceNumberField .x-form-display-field').text();
                    var suma_incasata = Number($('.ordersDetailsMainInfoFieldsetAmountField .x-form-display-field').text().replace(/,/g,'') || '0');
                    var refunded = Number($('.ordersDetailsPaymentFieldsetRefundAmountField .x-form-display-field').text().replace(/,/g,'') || '0');
                    var tranzactie = $('.ordersDetailsMainInfoFieldsetMdOrderField .x-form-display-field').text();
                    var status = $('.ordersDetailsMainInfoFieldsetPaymentStateField .x-form-display-field').text();
                    waitForElm('div[id^="refundWindow"]').then((elm) => {
                        $('div[id^="refundWindow"] input').val((suma_incasata - refunded).toFixed(2))[0].dispatchEvent(new Event("change"));
                        var info_retur = GM_getValue('info_retur') || {};
                        console.log(GM_getValue('info_retur'));
                        if (info_retur.suma_comanda) {
                            var suma_retur_1 = Number((suma_incasata-info_retur.suma_comanda).toFixed(2));
                            if (suma_retur_1 > 0) {
                                $('div[id^="refundWindow"] table:eq(0)').before(`<table style="margin-bottom: 10px;"><tr><td>Suma incasata - suma comanda:</td></tr><tr><td>${suma_incasata} - ${Number(info_retur.suma_comanda)} = <span id="set_return_value_1" style="font-weight: bold;cursor: pointer;background-repeat: no-repeat;background-position-x: right;padding-right: 24px;background-image: ${return_arrow};">${suma_retur_1} lei</span></td></tr></table>`);
                                $('#set_return_value_1').click(function () { $('div[id^="refundWindow"] input').val(suma_retur_1.toFixed(2))[0].dispatchEvent(new Event("change"));});
                            }
                        }
                        if (info_retur.valoare_retur) {
                            var suma_retur_2 = Number(info_retur.valoare_retur);
                            if (suma_retur_2 > 0) {
                                $('div[id^="refundWindow"] table:eq(0)').before(`<table style="margin-bottom: 10px;"><tr><td>Suma returnata pe comanda:&nbsp;</td><td><span id="set_return_value_2" style="font-weight: bold;cursor: pointer;background-repeat: no-repeat;background-position-x: right;padding-right: 24px;background-image: ${return_arrow};">${suma_retur_2} lei</span></td></tr></table>`);
                                $('#set_return_value_2').click(function () { $('div[id^="refundWindow"] input').val(suma_retur_2.toFixed(2))[0].dispatchEvent(new Event("change"));});
                            }
                        }
                        var ok_button = $('div[id^="refundWindow"] div[id^="button"]:contains("OK")');
                        ok_button.after(ok_button.clone().attr('id', 'refund-ok-new').removeClass('x-btn-default-small-disabled')).hide();
                        $('#refund-ok-new button').removeAttr('disabled');
                        if (ok_button.length) {
                            var ok_config = { attributes: true, childList: false, subtree: false};
                            var ok_callback = function(mutationsList, ok_observer) {
                                console.log('ok_button changed');
                                if (ok_button.hasClass('x-item-disabled x-disabled x-btn-disabled')) $('#refund-ok-new').addClass('x-item-disabled x-disabled x-btn-disabled');
                                else $('#refund-ok-new').removeClass('x-item-disabled x-disabled x-btn-disabled');
                            }
                            var ok_observer = new MutationObserver(ok_callback);
                            ok_observer.observe(ok_button[0], ok_config);
                        }
                        $(document).one('click', '#refund-ok-new:not(.x-disabled)', function () {
                            console.log('click');
                            $(this).addClass('x-item-disabled x-disabled x-btn-disabled');
                            ok_button.click();
                            var suma_returnata = Number($('div[id^="refundWindow"] input').val().replace(/,/g,''));
                            var tip_returnare = 'partiala';
                            if (suma_returnata == suma_incasata) tip_returnare = 'totala';
                            info_retur = GM_getValue('info_retur') || {};
                            info_retur[tranzactie] = {suma_returnata: suma_returnata, rrn: rrn, tip_returnare: tip_returnare};
                            GM_setValue('info_retur', info_retur);
                            write_transaction_return(`retur_${procesator}:`+tranzactie);
                            observe_transaction_changes(rrn, refunded, tranzactie, status);
                        });
                    });
                });
                function observe_transaction_changes(rrn, refunded, tranzactie, status) {
                    var trans_config = { attributes: false, childList: true, subtree: true};
                    var trans_callback = function(mutationsList, trans_observer) {
                        console.log('details changed');
                        if ($('.ordersDetailsPaymentFieldsetRefundAmountField .x-form-display-field').text()) {
                            console.log('refund/reverse ok');
                            trans_observer.disconnect();
                            let new_refunded = $('.ordersDetailsPaymentFieldsetRefundAmountField .x-form-display-field').text().replace(/,/g,'') || 0;
                            let new_rrn = $('.ordersDetailsResultFieldsetReferenceNumberField .x-form-display-field').text();
                            let new_status = $('.ordersDetailsMainInfoFieldsetPaymentStateField .x-form-display-field').text();
                            if (rrn != new_rrn) {
                                let info_retur = GM_getValue('info_retur') || {};
                                if (info_retur[tranzactie]) {
                                    info_retur[tranzactie].rrn = new_rrn;
                                    GM_setValue('info_retur', info_retur);
                                }
                            }
                            if (refunded != new_refunded || status != new_status) {
                                add_transaction_color_link();
                            }
                        }
                    }
                    var trans_observer = new MutationObserver(trans_callback);
                    trans_observer.observe($('.ordersDetailsMainInfoFieldsetOrderNumberField')[0], trans_config);
                }
            }
        }
        else if (window.location.href.includes('dedeweb.dedeman.ro/#/stocks')) {
            GM_addStyle ('.v-data-table-header > tr > th {white-space: nowrap;}');
            if (getCookie('submit') == '1') {
                try {
                    var stores = JSON.parse(localStorage.getItem('options-store?inactives=true') || '{}');
                    var logistics = JSON.parse(localStorage.getItem('options-logistics') || '{}');
                    let magazine = stores.data.concat(logistics.data);
                    var magazin_sap = getCookie('magazin') || '';
                    if (magazine.length && magazin_sap) {
                        var magazin_dedeweb = '';
                        $.each(magazine, function(index, value) {
                            if (value.WERKS == magazin_sap) {
                                magazin_dedeweb = value.COD;
                                return false;
                            }
                        });
                        localStorage.setItem('stock-filters','{"store":"'+magazin_dedeweb+'","name":null,"code":'+getCookie('produse')+',"ean":null,"group":null,"provider":null,"status":["S","C","P","L","T","E","N","Z","R","D"]}');
                    }
                    waitForElm('.primary.v-btn').then((elm) => {
                        elm.click();
                        document.cookie = "submit=0; domain=dedeman.ro; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                        waitForElm('.v-main .v-card.mt-3 .v-data-table__wrapper > table > tbody tr:not(.v-data-table__empty-wrapper)').then((elm) => {
                            var cantitati = getCookie('cantitati');
                            var index_cod = $('.v-main .v-card.mt-3 .v-data-table__wrapper thead > tr > th').filter(function() {
                                return $(this).text().trim() === "COD";
                            }).index() + 1;
                            $('.v-main .v-card.mt-3 .v-data-table__wrapper thead > tr > th.active.asc:nth-of-type('+index_cod+')').click();
                            waitForElm('.v-main .v-card.mt-3 .v-data-table__wrapper thead > tr > th.active.desc:nth-of-type('+index_cod+')').then((elm) => { elm.click(); });
                            if (cantitati) {
                                cantitati = JSON.parse(getCookie('cantitati'));
                                var index_stoc = $('.v-main .v-card.mt-3 .v-data-table__wrapper thead > tr > th').filter(function() {
                                    return $(this).text().trim() === "STOC";
                                }).index() + 1;
                                $('.v-main .v-card.mt-3 .v-data-table__wrapper tbody > tr').each(function() {
                                    var sku = $(this).find('td:nth-of-type('+index_cod+')').text().trim();
                                    var stoc_td = $(this).find('td:nth-of-type('+index_stoc+')');
                                    var stoc = Number(stoc_td.text().trim().replace(/\./g,'').replace(',', '.'));
                                    if (cantitati[sku]) {
                                        var cantitate = Number(cantitati[sku]);
                                        if (stoc > cantitate) stoc_td.find('.v-chip').removeClass().addClass('v-chip theme--dark v-size--default green');
                                        else if (stoc == cantitate) stoc_td.find('.v-chip').removeClass().addClass('v-chip theme--dark v-size--default gray');
                                        else if (stoc < cantitate) stoc_td.find('.v-chip').removeClass().addClass('v-chip theme--dark v-size--default red');
                                        stoc_td.find('.v-chip').attr('title', 'Cantitate necesara: '+cantitate);
                                    }
                                });
                            }
                        });
                    });
                }
                catch(e) {}
            }
            waitForElm('.v-dialog__content--active .v-card__actions > button:contains(Ramai logat)').then((elm) => { location.reload(); });
        }
        else if (window.location.href.includes('bie2.dedeman.ro')) {
            console.log('bie2');
            window.addEventListener('load', function() {
                var favicon = document.querySelector('link[href="/favicon.ico"]');
                favicon.href = `data:image/svg+xml,%3Csvg width='256' height='256' preserveAspectRatio='xMidYMid' version='1.0' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='matrix(1.0258 0 0 1 -3.2621 0)' fill='%23e39e22'%3E%3Cpath d='m154.79 78.172c-0.10552 0.09354-0.18466 5.3943-0.18466 11.786 0 8.5748 0.0791 11.662 0.31656 11.942 0.47484 0.56126 65.871 0.53008 66.056-0.0312 0.0528-0.21826-2.084-5.6749-4.7748-12.161l-4.8803-11.755h-28.2c-15.485 0-28.253 0.09354-28.332 0.21827z'/%3E%3Cpath d='m3.18 128.16v49.89h43.211c47.537 0 44.899 0.0935 48.117-1.9332 1.6883-1.0602 4.1417-3.96 4.9331-5.7997 1.4773-3.4611 1.4773-3.617 1.4773-17.368 0-12.566 0-12.815-0.60674-14.905-1.2662-4.303-4.3527-7.8888-7.9932-9.2608l-1.9257-0.74834 1.2399-0.37417c3.1656-0.93543 6.4631-4.0847 7.9404-7.5458 1.3454-3.1493 1.4773-4.5524 1.4773-16.9 0-12.285-0.1319-13.813-1.4509-16.9-1.5037-3.5235-4.2472-6.2362-7.4392-7.4211-1.6883-0.62362-2.4006-0.62362-45.347-0.62362h-43.633zm78.349-29.684c0.50122 0.28063 1.1871 0.99779 1.5037 1.5902 0.58036 1.029 0.60674 1.3096 0.60674 7.8264s-0.02638 6.7975-0.60674 7.8264c-1.2926 2.3074 1.0552 2.1515-32.421 2.1515h-30.021v-19.956h30.021c28.016 0 30.047 0.03118 30.917 0.56126zm0.2638 40.504c0.3957 0.28062 1.0024 1.029 1.2926 1.6526 0.50122 1.0913 0.55398 1.6526 0.55398 7.6394 0 7.2028-0.15828 8.0759-1.7147 9.1984-0.84416 0.62362-1.2399 0.62362-31.102 0.62362h-30.232v-19.644h30.232c27.699 0 30.284 0.0312 30.97 0.53008z'/%3E%3Cpath d='m117.93 128.16v49.89h20.049v-99.779h-20.049z'/%3E%3Cpath d='m154.79 116.21c-0.10552 0.0935-0.18466 5.3943-0.18466 11.786 0 8.5748 0.0791 11.662 0.31656 11.942 0.23742 0.28063 9.7079 0.37417 41.021 0.37417 37.064 0 40.731-0.0312 40.889-0.4989 0.10552-0.31181-1.7411-5.0201-4.7484-12.161l-4.9067-11.662h-36.114c-19.864 0-36.193 0.0936-36.273 0.21827z'/%3E%3Cpath d='m155 154.75c-0.0791 0.18709-0.10552 5.4879-0.0791 11.755l0.0791 11.381 48.882 0.0935c26.855 0.0312 33.301 0 48.856-0.0624 0.0624-2.5e-4 -2.1895-5.3943-4.8539-11.849l-4.8803-11.724h-43.949c-34.98 0-43.976 0.0935-44.055 0.40535z'/%3E%3C/g%3E%3C/svg%3E%0A`;
            }, false);
            const domains = [
                "gmail.com",
                "yahoo.com",
                "hotmail.com",
                "aol.com",
                "hotmail.co.uk",
                "hotmail.fr",
                "msn.com",
                "yahoo.fr",
                "wanadoo.fr",
                "orange.fr",
                "comcast.net",
                "yahoo.co.uk",
                "yahoo.com.br",
                "yahoo.co.in",
                "live.com",
                "rediffmail.com",
                "free.fr",
                "gmx.de",
                "web.de",
                "yandex.ru",
                "ymail.com",
                "libero.it",
                "outlook.com",
                "uol.com.br",
                "bol.com.br",
                "mail.ru",
                "cox.net",
                "hotmail.it",
                "sbcglobal.net",
                "sfr.fr",
                "live.fr",
                "verizon.net",
                "live.co.uk",
                "googlemail.com",
                "yahoo.es",
                "ig.com.br",
                "live.nl",
                "bigpond.com",
                "terra.com.br",
                "yahoo.it",
                "neuf.fr",
                "yahoo.de",
                "alice.it",
                "rocketmail.com",
                "att.net",
                "laposte.net",
                "facebook.com",
                "bellsouth.net",
                "yahoo.in",
                "hotmail.es",
                "charter.net",
                "yahoo.ca",
                "yahoo.com.au",
                "rambler.ru",
                "hotmail.de",
                "tiscali.it",
                "shaw.ca",
                "yahoo.co.jp",
                "sky.com",
                "earthlink.net",
                "optonline.net",
                "freenet.de",
                "t-online.de",
                "aliceadsl.fr",
                "virgilio.it",
                "home.nl",
                "qq.com",
                "telenet.be",
                "me.com",
                "yahoo.com.ar",
                "tiscali.co.uk",
                "yahoo.com.mx",
                "voila.fr",
                "gmx.net",
                "mail.com",
                "planet.nl",
                "tin.it",
                "live.it",
                "ntlworld.com",
                "arcor.de",
                "yahoo.co.id",
                "frontiernet.net",
                "hetnet.nl",
                "live.com.au",
                "yahoo.com.sg",
                "zonnet.nl",
                "club-internet.fr",
                "juno.com",
                "optusnet.com.au",
                "blueyonder.co.uk",
                "bluewin.ch",
                "skynet.be",
                "sympatico.ca",
                "windstream.net",
                "mac.com",
                "centurytel.net",
                "chello.nl",
                "live.ca",
                "aim.com",
                "bigpond.net.au",
                "icloud.com",
                "freemail",
                "live.be",
                "gmx.ch",
                "gmx.com",
                "gmx.fr",
                "appleid.com",
                "yandex.com",
                "yahoo.ie",
                "yahoo.co.nz",
                "mailbox.hu",
                "proton.me"
            ];
            waitForElm('.q-item__section > .q-item__label:contains(Comenzi)').then((elm) => {
                elm.closest('.q-expansion-item__container').find('.q-expansion-item__content').prepend(`<div class="menu-item"><a class="q-item q-item-type row no-wrap q-item--dense q-item--dark q-item--clickable q-link cursor-pointer q-focusable q-hoverable normal-item" href="/raport/identificare-comanda?script=procesare-comenzi" id="procesare_comenzi"><div class="q-focus-helper" tabindex="-1"></div>Script - Procesare comenzi</a></div>`).prepend(`<div class="menu-item"><a class="q-item q-item-type row no-wrap q-item--dense q-item--dark q-item--clickable q-link cursor-pointer q-focusable q-hoverable normal-item" href="/raport/identificare-comanda?script=comenzi-curier" id="comenzi_curier"><div class="q-focus-helper" tabindex="-1"></div>Script - Comenzi curier</a></div>`).prepend(`<div class="menu-item"><a class="q-item q-item-type row no-wrap q-item--dense q-item--dark q-item--clickable q-link cursor-pointer q-focusable q-hoverable normal-item" href="/raport/identificare-comanda?script=comenzi-fictive" id=comenzi_fictive><div class="q-focus-helper" tabindex="-1"></div>Script - Comenzi fictive</a></div>`);
            });
            window.navigation.addEventListener("navigate", (event) => {
                if (event.navigationType == 'push') make_actions_bie2(event.destination.url);
            });
            var visited = [];
            function make_actions_bie2(url) {
                console.log('make actions bie2');
                $(document.body).attr('data-url', url);
                var urlParams = new URLSearchParams(location.search);
                if (url.includes('raport/identificare-comanda')) {
                    console.log('raport/identificare-comanda');
                    GM_addStyle(`
            .my-input {
                width: 100%;
                padding: 0 8px;
                border: 2px solid rgba(0, 0, 0, 0.23);
                border-radius: 4px;
                color: rgb(33, 33, 33);
                line-height: 14px;
                outline: none;
                transition: border-color ease-in-out .25s;
                height: 34px;
            }
            .my-input:invalid {
                border-color: red;
            }
            .my-submit-button {
                -webkit-tap-highlight-color: transparent;
                outline: 0px;
                border: 2px solid rgba(0, 0, 0, 0.23);
                margin: 0px;
                cursor: pointer;
                user-select: none;
                vertical-align: middle;
                appearance: none;
                text-decoration: none;
                font-size: 14px;
                text-transform: uppercase;
                min-width: 64px;
                padding: 0px 16px;
                border-radius: 4px;
                transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
                text-wrap: nowrap;
                height: 34px;
            }
            .my-submit-button:hover {
                background-color: #d0d0d0;
            }
            .graph-loading[data-v-1c68973a] {
                position: fixed;
                float: left;
                top: 50%;
                left: 50%;
                height: 110px;
                padding: 0 0 0 15px !important;
                width: 180px;
                margin-top: -50px;
                margin-left: -70px;
                border-left: 1px solid #fff;
                border-bottom: 1px solid #fff;
                box-sizing: border-box;
                border-radius: 0 !important;
            }
            .my-sticky-header thead tr:first-child th {
                font-weight: bold;
                top: 0;
                position: sticky;
                z-index: 1;
                background: #f1f1f1;
            }
            .my-table a {
                color: #000;
            }
            .my-table a:hover, #statistica a:hover {
                color: #1d84c0;
            }
            .my-table .success {
                background: #C5E1A5;
            }
            .my-table .danger {
                background: #ffabab;
            }
            .my-table .info {
                background: #d9edf7;
            }
            .my-nowrap {
                white-space: nowrap;
            }
            .my-container {
                padding-right: 0 !important;
            }
            .disabled {
                cursor: default;
                opacity: .5;
                pointer-events: none;
            }
            #statistica > span {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            #statistica {
                padding: 0 8px;
            }
            #statistica label {
                cursor: pointer;
            }
            #statistica a {
                cursor: pointer;
                float: right;

            }
            .filter-table {cursor: pointer;}
            .d-none {display: none;}
            td a:visited {color: #e39e22 !important;}
            `);
                    console.log(urlParams.get('script'));
                    if (urlParams.get('script') == 'comenzi-curier') {
                        console.log('comenzi curier');
                        waitForElm('.q-toolbar .q-btn[aria-label=Menu]').then((elm) => {
                            elm.click();
                        });
                        waitForElm('a.active-item[href="/raport/identificare-comanda"]').then((elm) => {
                            elm.after(elm.clone().removeClass('active-item')).hide();
                            $('#comenzi_curier').addClass('active-item');
                            elm.parents('.q-expansion-item__content').show();
                            elm.parents('.q-expansion-item').removeClass('q-expansion-item--collapsed').addClass('q-expansion-item--expanded');
                            $('.q-expansion-item--expanded > .q-expansion-item__container > .q-item > .q-item__section > .q-icon').addClass('q-expansion-item__toggle-icon--rotated');
                        });
                        waitForElm('.q-form.filters').then((elm) => {
                            elm.closest('aside').remove();
                            $('.q-page-container').addClass('my-container');
                            var d = new Date();
                            var today = d.toISOString().slice(0,10);
                            d.setDate(d.getDate() - 1);
                            var yesterday = d.toISOString().slice(0,10);
                            $('.q-card__section .q-pl-sm').html('Script - Comenzi curier').after(`<div style="font-size: 14px; font-weight: normal; line-height: 18px; display: flex; gap: 16px; align-items: flex-end;"><div style="width: 130px;"><label for="start_date">De la data</label><input id="start_date" name="start_date" type="date" class="my-input" max="${today}"></div><div style="width: 130px;"><label for="end_date">Până la data</label><input id="end_date" name="end_date" type="date" class="my-input" value="${yesterday}" max="${today}"></div><div style="width: 150px;"><label for="orders_type">Tip comenzi</label><select class="my-input" id="orders_type"><option value="magazin">Magazine fizice</option><option value="drop">Dropshipping</option></select></div><div style="width: 90px;"><label for="courier">Curier</label><select class="my-input" id="courier" required="true"><option value='["dpd","fan","gls"]'>Toti</option><option value='["dpd"]'>DPD</option><option value='["fan"]'>FAN</option><option value='["gls"]'>GLS</option></select></div><div><button id="my_search" class="my-submit-button" type="button">Caută</button></div></div>`);
                            $(document).on('click', '#export', function() {
                                if ($('#tabel_comenzi > tbody > tr:not(.data-grid-tr-no-data)').length) {
                                    $(this).fadeOut(function() {
                                        var table = $.parseHTML($('#tabel_comenzi')[0].outerHTML);
                                        $(table).find('.d-none').remove();
                                        $(table).find('thead > tr > th:last-of-type').html('Data status AWB').after('<th>Status AWB</th>');
                                        $(table).find('tbody > tr > td:last-of-type').each(function() {
                                            let text = $(this).html();
                                            $(this).html(text.substring(0,20).replace(',', '')).after(`<td>${text.substring(23) || '-'}</td>`);
                                        });
                                        var text = $(table)[0].outerHTML.replace(/<br>/g,' ');
                                        copy_text(text, text);
                                    }).fadeIn();
                                }
                            });
                            $(document).on('change', '.filter-table', function() {
                                $(`#tabel_comenzi .${$(this).data('type')}`).toggleClass('d-none');
                            });
                            $('#my_search').click(function() {
                                console.log('search');
                                if (!$('.my-input:invalid').length) {
                                    $('#my_search').addClass('disabled');
                                    var data = {filters:{shipping: JSON.parse($('#courier').val())}};
                                    if ($('#start_date').val()) data.filters.dateFrom = $('#start_date').val();
                                    if ($('#end_date').val()) data.filters.dateTo = $('#end_date').val();
                                    if ($('#orders_type').val() == 'magazin') data.filters.status = ["comanda_facturata", "comanda_expediata"];
                                    else {
                                        data.filters.status = ["livrare_curier"];
                                        data.filters.stores = ["ECOM"];
                                    }
                                    $('.report-content > .content').html(`<div data-v-1c68973a="" class="graph-loading"><div data-v-1c68973a="" class="graph-loading-1"></div><div data-v-1c68973a="" class="graph-loading-2"></div><div data-v-1c68973a="" class="graph-loading-3"></div><div data-v-1c68973a="" class="graph-loading-4"></div><div data-v-1c68973a="" class="graph-loading-5"></div></div>`);
                                    bie2_session_request({url:'reports/identificare-comanda/data', method: 'POST', data: data}).then(function(response) {
                                        var content = '<div class="q-table__container q-table--cell-separator column q-table__card my-sticky-header"><div id="statistica"></div><div class="q-table__middle q-virtual-scroll q-virtual-scroll--vertical scroll" style="max-height: calc(100vh - 210px);"><table id="tabel_comenzi" class="q-table my-table"><thead><tr><th>Comanda</th><th>Data plasare</th><th>Status</th><th>Metoda livrare</th><th>Metoda plata</th><th>Cost livrare</th><th>Total</th><th>Nr. AWB</th><th>Status AWB</th></tr></thead><tbody>';
                                        response.content.data.shift(); //remove header
                                        var ols = [];
                                        var details = {};
                                        $.each(response.content.data, function(index, value) {
                                            var increment_id = value[0].value;
                                            var comanda = `<a href="${value[0].url}" target="_blank">${increment_id}</a>`;
                                            var data = new Date(value[1]).toLocaleString('ro');
                                            var status = value[2];
                                            var livrare = value[3];
                                            var plata = value[4];
                                            var cost_livrare = Number(value[5]).toLocaleString('ro') + ' lei';
                                            var total = Number(value[6]).toLocaleString('ro') + ' lei';
                                            ols.push(increment_id);
                                            details[increment_id] = {comanda: comanda, data: data, status: status, livrare: livrare, plata: plata, cost_livrare: cost_livrare, total: total, awb: "Fara AWB", status_awb: "-", clasa: "no-awb"};
                                        });
                                        if (ols.length) {
                                            var start = 0;
                                            var page_size = 500;
                                            var appliv_tracking_response = [];
                                            var appliv_error = 0;
                                            get_appliv_awbs();
                                            function get_appliv_awbs() {
                                                const chunk = ols.slice(start, start + page_size);
                                                appliv_request({url:'awb_track', method: 'POST', data: {references: chunk}}).then(function(response_appliv) {
                                                    console.log(response_appliv);
                                                    appliv_tracking_response.push(...response_appliv);
                                                    start = start + page_size;
                                                    if (start < ols.length) get_appliv_awbs();
                                                    else write_awbs(appliv_error);
                                                }).catch(function(e) {
                                                    console.log(e);
                                                    appliv_error = e;
                                                    start = start + page_size;
                                                    if (start < ols.length) get_appliv_awbs();
                                                    else write_awbs(appliv_error);
                                                });
                                            }
                                            function write_awbs(error) {
                                                if (error) alert('Eroare appliv!\n'+error);
                                                $.each(appliv_tracking_response, function(i, value) {
                                                    details[value.reference].awb = value.code;
                                                    details[value.reference].status_awb = value.courier_status_description;
                                                    var clasa = 'info';
                                                    if (value.tracking_status == 0) clasa = 'danger';
                                                    else if (value.tracking_status == 10) clasa = 'success';
                                                    details[value.reference].clasa = clasa;
                                                });
                                                console.log(details);
                                                Object.entries(details).forEach(([key, value]) => {
                                                    content += `<tr id="${key}" class="${value.clasa}"><td class="nr_ol my-nowrap">${value.comanda}</td><td>${value.data}</td><td>${value.status}</td><td>${value.livrare}</td><td>${value.plata}</td><td class="my-nowrap">${value.cost_livrare}</td><td class="my-nowrap">${value.total}</td><td class="nr-awb">${value.awb}</td><td class="status-awb">${value.status_awb}</td></tr>`;
                                                });
                                                content += '</tbody></table></div></div>';
                                                $('.report-content > .content').html(content);
                                                $('#my_search').removeClass('disabled');
                                                var total = $('#tabel_comenzi > tbody > tr').length;
                                                var livrate = $('#tabel_comenzi .success').length;
                                                var returnate = $('#tabel_comenzi .danger').length;
                                                var in_livrare = $('#tabel_comenzi .info').length;
                                                var fara_awb = $('#tabel_comenzi .no-awb').length;
                                                $('#statistica').html(`${total} ${total == 1 ? 'comandă' : 'comenzi'}, din care <span><input type="checkbox" id="in_livrare" data-type="info" class="filter-table" checked><label for="in_livrare" title="Click pentru a ascunde/afișa aceste comenzi">${in_livrare} ${in_livrare == 1 ? 'comandă' : 'comenzi'} în livrare</label></span>, <span><input type="checkbox" id="livrate" data-type="success" class="filter-table" checked><label for="livrate" title="Click pentru a ascunde/afișa aceste comenzi">${livrate} ${livrate == 1 ? 'comandă livrată' : 'comenzi livrate'}</label></span>, <span><input type="checkbox" id="returnate" data-type="danger" class="filter-table" checked><label for="returnate" title="Click pentru a ascunde/afișa aceste comenzi">${returnate} ${returnate == 1 ? 'comandă returnată' : 'comenzi returnate'}</label></span>, <span><input type="checkbox" id="fara_awb" data-type="no-awb" class="filter-table" checked><label for="fara_awb" title="Click pentru a ascunde/afișa aceste comenzi">${fara_awb} ${fara_awb == 1 ? 'comandă' : 'comenzi'} fără AWB</label></span><a id="export">Copie tabel</a>`);
                                            }
                                        }
                                        else {
                                            content += `<tr><td colspan="10">Nu exista comenzi!</td></tr>`;
                                            content += '</tbody></table></div></div>';
                                            $('.report-content > .content').html(content);
                                            $('#my_search').removeClass('disabled');
                                        }
                                    }).catch(function(e) {
                                        $('.report-content > .content').html(e);
                                        $('#my_search').removeClass('disabled');
                                    });
                                }
                            });
                        });
                    }
                    else if (urlParams.get('script') == 'comenzi-fictive') {
                        console.log('fictive');
                        waitForElm('.q-toolbar .q-btn[aria-label=Menu]').then((elm) => {
                            elm.click();
                        });
                        waitForElm('a.active-item[href="/raport/identificare-comanda"]').then((elm) => {
                            elm.after(elm.clone().removeClass('active-item')).hide();
                            $('#comenzi_fictive').addClass('active-item');
                            elm.parents('.q-expansion-item__content').show();
                            elm.parents('.q-expansion-item').removeClass('q-expansion-item--collapsed').addClass('q-expansion-item--expanded');
                            $('.q-expansion-item--expanded > .q-expansion-item__container > .q-item > .q-item__section > .q-icon').addClass('q-expansion-item__toggle-icon--rotated');
                        });
                        waitForElm('.q-form.filters').then((elm) => {
                            elm.closest('aside').remove();
                            $('.q-page-container').addClass('my-container');
                            var today = new Date().toISOString().slice(0,10);
                            $('.q-card__section .q-pl-sm').html('Script - Comenzi fictive').after(`<div style="font-size: 14px; font-weight: normal; line-height: 18px; display: flex; gap: 16px; align-items: flex-end;"><div style="width: 130px;"><label for="start_date">De la data</label><input id="start_date" name="start_date" type="date" class="my-input" value="${today}" max="${today}" required="true"></div><div style="width: 130px;"><label for="end_date">Până la data</label><input id="end_date" name="end_date" type="date" class="my-input" value="" max="${today}"></div><div><button id="my_search" class="my-submit-button" type="button">Caută</button></div></div>`);
                            $('#my_search').click(function() {
                                console.log('search');
                                if (!$('.my-input:invalid').length) {
                                    $('#my_search').addClass('disabled');
                                    var data = {filters:{dateFrom: $('#start_date').val(), device: ["2"]}};
                                    if ($('#end_date').val()) data.filters.dateTo = $('#end_date').val();
                                    $('.report-content > .content').html(`<div data-v-1c68973a="" class="graph-loading"><div data-v-1c68973a="" class="graph-loading-1"></div><div data-v-1c68973a="" class="graph-loading-2"></div><div data-v-1c68973a="" class="graph-loading-3"></div><div data-v-1c68973a="" class="graph-loading-4"></div><div data-v-1c68973a="" class="graph-loading-5"></div></div>`);
                                    bie2_session_request({url:'reports/identificare-comanda/data', method: 'POST', data: data}).then(function(response) {
                                        var content = '<div class="q-table__container q-table--cell-separator column q-table__card my-sticky-header"><div class="q-table__middle q-virtual-scroll q-virtual-scroll--vertical scroll" style="max-height: calc(100vh - 188px);"><table class="q-table my-table"><thead><tr><th>Comanda</th><th>Data plasare</th><th>Status</th><th>Metoda livrare</th><th>Metoda plata</th><th>Client</th><th>E-mail</th></tr></thead><tbody>';
                                        response.content.data.shift(); //remove header
                                        var regex = new RegExp(domains.join('|').replace(/\./g,'\\\.'), 'i');
                                        var rows = 0;
                                        $.each(response.content.data, function(index, value) {
                                            var comanda = `<a href="${value[0].url}" target="_blank">${value[0].value}</a>`;
                                            var data = new Date(value[1]).toLocaleString('ro');
                                            var status = value[2];
                                            var livrare = value[3];
                                            var plata = value[4];
                                            var client = value[7];
                                            var email = value[8];
                                            var pj = value[9].trim();
                                            if (/\.ro$/gi.test(email) || regex.test(email) || pj.length > 0 || (/ing|card|rate/gi.test(plata) && !/^Card |Comanda noua|anulata/gi.test(status))) {
                                                //safe
                                            }
                                            else {
                                                rows++;
                                                var clasa = '';
                                                if (/anulata/gi.test(status)) clasa = 'success';
                                                content += `<tr><td>${comanda}</td><td>${data}</td><td class="${clasa}">${status}</td><td>${livrare}</td><td>${plata}</td><td>${client}</td><td>${email}</td></tr>`;
                                            }
                                        });
                                        if (!rows) content += `<tr><td colspan="7">Nu exista posibile comenzi fictive!</td></tr>`;
                                        content += '</tbody></table></div></div>';
                                        $('.report-content > .content').html(content);
                                        $('#my_search').removeClass('disabled');
                                    }).catch(function(e) {
                                        $('.report-content > .content').html(e);
                                        $('#my_search').removeClass('disabled');
                                    });
                                }
                            }).click();
                        });
                    }
                    else if (urlParams.get('script') == 'procesare-comenzi') {
                        console.log('procesare comenzi');
                        var prag_timp_procesare = 120;
                        var store_list_last_refresh = localStorage.getItem('store_list_last_refresh') || '';
                        var store_list = JSON.parse(localStorage.getItem('store_list') || '{}');
                        if (new Date().toLocaleDateString('ro') !== store_list_last_refresh || Object.keys(store_list).length === 0) {
                            console.log('store list refresh');
                            magento_request({api_url:'/rest/V1/inventory/sources', origin: 'https://www.dedeman.ro', hostname: 'www.dedeman.ro'}).then(function(response) {
                                if (response.items.length) {
                                    store_list = {};
                                    $.each(response.items, function(i, value) {
                                        if (value.extension_attributes.source_type !== 3 && value.enabled) {
                                            let name = value.name;
                                            if (/BCT\d/.test(value.source_code)) name = name.replace(/ \(.+?\)/,'').replace('Bucuresti', 'Bucuresti ' + value.source_code.match(/BCT(\d)/)[1] + ' - ');
                                            store_list[value.source_code] = {
                                                name: name,
                                                RECOM_schedule: {
                                                    Monday: value.extension_attributes.recom_schedule_monday_friday,
                                                    Tuesday: value.extension_attributes.recom_schedule_monday_friday,
                                                    Wednesday: value.extension_attributes.recom_schedule_monday_friday,
                                                    Thursday: value.extension_attributes.recom_schedule_monday_friday,
                                                    Friday: value.extension_attributes.recom_schedule_monday_friday,
                                                    Saturday: value.extension_attributes.recom_schedule_saturday,
                                                    Sunday: value.extension_attributes.recom_schedule_sunday
                                                },
                                                Store_schedule: {
                                                    Monday: value.extension_attributes.schedule_monday,
                                                    Tuesday: value.extension_attributes.schedule_tuesday,
                                                    Wednesday: value.extension_attributes.schedule_wednesday,
                                                    Thursday: value.extension_attributes.schedule_thursday,
                                                    Friday: value.extension_attributes.schedule_friday,
                                                    Saturday: value.extension_attributes.schedule_saturday,
                                                    Sunday: value.extension_attributes.schedule_sunday
                                                }
                                            };
                                        }
                                    });
                                    localStorage.setItem('store_list', JSON.stringify(store_list));
                                    localStorage.setItem('store_list_last_refresh', new Date().toLocaleDateString('ro'));
                                }
                            }).catch(function(e) {
                                alert(e);
                            });
                        }
                        function date_diff_indays(date1, date2) {
                            var dt1 = new Date(date1);
                            var dt2 = new Date(date2);
                            return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
                        }
                        waitForElm('.q-toolbar .q-btn[aria-label=Menu]').then((elm) => {
                            elm.click();
                        });
                        waitForElm('a.active-item[href="/raport/identificare-comanda"]').then((elm) => {
                            console.log(elm);
                            elm.after(elm.clone().removeClass('active-item')).hide();
                            $('#procesare_comenzi').addClass('active-item');
                            elm.parents('.q-expansion-item__content').show();
                            elm.parents('.q-expansion-item').removeClass('q-expansion-item--collapsed').addClass('q-expansion-item--expanded');
                            $('.q-expansion-item--expanded > .q-expansion-item__container > .q-item > .q-item__section > .q-icon').addClass('q-expansion-item__toggle-icon--rotated');
                        });
                        waitForElm('.q-form.filters').then((elm) => {
                            elm.closest('aside').remove();
                            $('.q-page-container').addClass('my-container');
                            var today = new Date().toISOString().slice(0,10);
                            var store_options = '';
                            Object.entries(store_list).forEach(([key, value]) => {
                                store_options += `<option value="${key}">${value.name}</option>`;
                            });
                            $('.q-card__section .q-pl-sm').html('Script - Procesare comenzi').after(`<div style="font-size: 14px; font-weight: normal; line-height: 18px; display: flex; gap: 16px; align-items: flex-end;"><div style="width: 130px;"><label for="start_date">De la data</label><input id="start_date" name="start_date" type="date" class="my-input" value="${today}" max="${today}" required="true"></div><div style="width: 130px;"><label for="end_date">Până la data</label><input id="end_date" name="end_date" type="date" class="my-input" value="" max="${today}"></div><div><label for="magazin">Magazin</label><select id="magazin" name="magazin" class="my-input" required="true">${store_options}</select></div><div><label for="tip_flux">Tip flux</label><select id="tip_flux" name="tip_flux" class="my-input" required="true"><option value="nou" selected>Nou</option><option value="vechi">Vechi</option></select></div><div><button id="my_search" class="my-submit-button" type="button">Caută</button></div></div>`);
                            var options = $('#magazin option');
                            options.detach().sort(function(a,b) {
                                var at = $(a).text();
                                var bt = $(b).text();
                                return (at > bt)?1:((at < bt)?-1:0);
                            });
                            options.appendTo('#magazin');
                            $('#magazin').prepend('<option selected></option>');
                            $('#my_search').click(function() {
                                console.log('search');
                                if (!$('.my-input:invalid').length) {
                                    $('#my_search').addClass('disabled');
                                    let store = $('#magazin').val();
                                    var data = {filters:{dateFrom: $('#start_date').val(), stores: [store]}};
                                    if ($('#end_date').val()) data.filters.dateTo = $('#end_date').val();
                                    $('.report-content > .content').html(`<div data-v-1c68973a="" class="graph-loading"><div data-v-1c68973a="" class="graph-loading-1"></div><div data-v-1c68973a="" class="graph-loading-2"></div><div data-v-1c68973a="" class="graph-loading-3"></div><div data-v-1c68973a="" class="graph-loading-4"></div><div data-v-1c68973a="" class="graph-loading-5"></div></div>`);
                                    bie2_session_request({url:'reports/identificare-comanda/data', method: 'POST', data: data}).then(function(response_bie) {
                                        var content = '<div class="q-table__container q-table--cell-separator column q-table__card my-sticky-header"><div class="q-table__middle q-virtual-scroll q-virtual-scroll--vertical scroll" style="max-height: calc(100vh - 188px);"><table class="q-table my-table"><thead><tr><th>Comanda</th><th>Data plasare</th><th>Status</th><th>Metoda plata</th><th>Data "confirmata"</th><th>Data "produse lipsa"</th><th>Data "achizitie_marfa"</th><th>Data "facturata"</th><th>Data "in asteptare plata"</th><th>Data "op plata confirmata"</th><th>Data "finalizata / anulata"</th><th>Data de final folosita</th><th class="my-nowrap">Status</th></tr></thead><tbody>';
                                        response_bie.content.data.shift(); //remove header
                                        if (response_bie.content.data.length) {
                                            var orders = {};
                                            $.each(response_bie.content.data, function(index, value) {
                                                orders[value[0].value] = {url: value[0].url, data_plasare: value[1], status: value[2], plata: value[4]}
                                            });
                                            console.log(orders);
                                            magento_request({api_url:'/rest/V1/orders', search_field: 'increment_id', search_values: Object.keys(orders), condition_type: 'in', return_fields: 'increment_id,status_histories[created_at,status]', origin: 'https://www.dedeman.ro', hostname: 'www.dedeman.ro'}).then(function(response) {
                                                if (response.items.length) {
                                                    console.log(response);
                                                    $.each(response.items, function(i, value) {
                                                        var confirmata, produse_lipsa, achizitie_marfa, facturata, asteptare_plata, op_plata_confirmata, finalizata_anulata;
                                                        var comentarii = value.status_histories || [];
                                                        comentarii.reverse();
                                                        $.each(comentarii, function(i, detalii) {
                                                            if (detalii.status) {
                                                                if (detalii.status == 'confirmata' && !confirmata) confirmata = detalii.created_at + '+00:00';
                                                                else if (detalii.status == 'confirmare_plata' && !asteptare_plata) asteptare_plata = detalii.created_at + '+00:00';
                                                                else if (detalii.status == 'plata_op_confirmata') op_plata_confirmata = detalii.created_at + '+00:00';
                                                                else if (detalii.status == 'comanda_facturata' && !facturata) facturata = detalii.created_at + '+00:00';
                                                                else if (detalii.status == 'produse_lipsa' && !produse_lipsa) produse_lipsa = detalii.created_at + '+00:00';
                                                                else if (detalii.status == 'achizitie_marfa' && !achizitie_marfa) achizitie_marfa = detalii.created_at + '+00:00';
                                                                else if ((detalii.status == 'comanda_finalizata' || detalii.status.includes('anulata') || detalii.status.includes('canceled')) && !finalizata_anulata) finalizata_anulata = detalii.created_at + '+00:00';
                                                            }
                                                        });
                                                        orders[value.increment_id] = {...orders[value.increment_id],
                                                                                      confirmata: confirmata || '',
                                                                                      produse_lipsa: produse_lipsa || '',
                                                                                      achizitie_marfa: achizitie_marfa || '',
                                                                                      facturata: facturata || '',
                                                                                      asteptare_plata: asteptare_plata || '',
                                                                                      op_plata_confirmata: op_plata_confirmata || '',
                                                                                      finalizata_anulata: finalizata_anulata || ''
                                                                                     };
                                                    });
                                                    console.log(orders);
                                                    $.each(response_bie.content.data, function(index, value) {
                                                        var ol = value[0].value;
                                                        var detalii = orders[ol];
                                                        content += `<tr><td><a href="${detalii.url}" target="_blank">${ol}</a></td><td>${new Date(detalii.data_plasare).toLocaleString('ro')}</td><td>${detalii.status}</td><td>${detalii.plata}</td><td>${detalii.confirmata ? new Date(detalii.confirmata).toLocaleString('ro') : ''}</td><td>${detalii.produse_lipsa ? new Date(detalii.produse_lipsa).toLocaleString('ro') : ''}</td><td>${detalii.achizitie_marfa ? new Date(detalii.achizitie_marfa).toLocaleString('ro') : ''}</td><td>${detalii.facturata ? new Date(detalii.facturata).toLocaleString('ro') : ''}</td><td>${detalii.asteptare_plata ? new Date(detalii.asteptare_plata).toLocaleString('ro') : ''}</td><td>${detalii.op_plata_confirmata ? new Date(detalii.op_plata_confirmata).toLocaleString('ro') : ''}</td><td>${detalii.finalizata_anulata ? new Date(detalii.finalizata_anulata).toLocaleString('ro') : ''}</td><td></td><td class="my-nowrap"></td></tr>`;
                                                    });
                                                    content += `</tbody></table></div></div>`;
                                                    $('.report-content > .content').html(content);
                                                    $('#my_search').removeClass('disabled');
                                                    //calc times
                                                    var timpi_de_procesare = [];
                                                    function addDays(date, days) {
                                                        var result = new Date(date);
                                                        if (days) {
                                                            result.setDate(result.getDate() + days);
                                                            result.setHours(0,0,0,0);
                                                        }
                                                        return result;
                                                    }
                                                    function get_date_from_string(data_string) {
                                                        var data;
                                                        if (/\d\d\.\d\d\.\d\d\d\d, \d\d:\d\d:\d\d/g.test(data_string)) {
                                                            var data_status = data_string.split(', ')[0];
                                                            data = new Date(data_status.split('.')[2] + '/' + data_status.split('.')[1] + '/' + data_status.split('.')[0] + ' ' + data_string.split(' ')[1]);
                                                            return data;
                                                        }
                                                        else return 0;
                                                    }
                                                    function parseSchedule(schedule, hoursToSubtract) {
                                                        const match = schedule.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
                                                        if (!match) return { start: '', end: '' };
                                                        const start = match[1];
                                                        const end = match[2];
                                                        let [hour, minute] = end.split(':').map(Number);
                                                        hour -= hoursToSubtract;
                                                        const newEnd = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                                        return { start: start, end: newEnd };
                                                    }
                                                    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                                    var cvp_start = {};
                                                    var cvp_end = {};
                                                    if (store_list[store]) {
                                                        let key = "Store_schedule";
                                                        let hoursToSubtract = 1;
                                                        if ($('#tip_flux').val() === 'vechi') {
                                                            key = "RECOM_schedule";
                                                            hoursToSubtract = 0;
                                                        }
                                                        days.forEach(day => {
                                                            const { start, end } = parseSchedule(store_list[store][key][day], hoursToSubtract);
                                                            cvp_start[day] = start;
                                                            cvp_end[day] = end;
                                                        });
                                                        console.log(cvp_start);
                                                        console.log(cvp_end);
                                                    }
                                                    $('.my-table > tbody > tr').each(function() {
                                                        var status = '';
                                                        var ol = $(this).find('td:nth-of-type(1)').text();
                                                        var data_confirmata = get_date_from_string($(this).find('td:nth-of-type(5)').text());
                                                        var data_produse_lipsa = get_date_from_string($(this).find('td:nth-of-type(6)').text());
                                                        var data_achizitie_marfa = get_date_from_string($(this).find('td:nth-of-type(7)').text());
                                                        var data_facturata = get_date_from_string($(this).find('td:nth-of-type(8)').text());
                                                        var data_finalizata_anulata = get_date_from_string($(this).find('td:nth-of-type(11)').text());
                                                        var data_final = 0;
                                                        if (data_produse_lipsa) data_final = data_produse_lipsa;
                                                        else if (data_achizitie_marfa && !data_produse_lipsa) data_final = 0;
                                                        else if (data_facturata) data_final = data_facturata;
                                                        else if (data_finalizata_anulata) data_final = data_finalizata_anulata;
                                                        else data_final = get_date_from_string(new Date().toLocaleString('ro-RO'));
                                                        if (data_final) $(this).find('td:nth-of-type(12)').html(data_final.toLocaleString('ro-RO'));
                                                        var total_minutes = 0;
                                                        var ok = 1;
                                                        if (data_confirmata && data_final) {
                                                            var no_of_days = date_diff_indays(data_confirmata, data_final);
                                                            for (let i=0; i<=no_of_days; i++) {
                                                                var data_start = addDays(data_confirmata, i);
                                                                if (data_start.getDate() == data_final.getDate()) calc_minutes(data_start, data_final, 'add');
                                                                else {
                                                                    var data_final2 = new Date(data_start);
                                                                    data_final2.setHours(23,59,59,999);
                                                                    calc_minutes(data_start, data_final2, 'add');
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            status = 'Nu se poate calcula!';
                                                            ok = 0;
                                                            console.log('nu am putut calcula timpul de procesare', ol);
                                                        }
                                                        function calc_minutes(date_start, date_end, type) {
                                                            if (cvp_start[days[date_start.getDay()]].length) {
                                                                var cvp_start_date = new Date (date_start);
                                                                cvp_start_date.setHours(cvp_start[days[date_start.getDay()]].split(':')[0],cvp_start[days[date_start.getDay()]].split(':')[1],0,0);
                                                                var cvp_end_date = new Date (date_end);
                                                                cvp_end_date.setHours(cvp_end[days[date_end.getDay()]].split(':')[0],cvp_end[days[date_end.getDay()]].split(':')[1],0,0);
                                                                var start = new Date (date_start);
                                                                var end = new Date (date_end);
                                                                if (date_start > cvp_end_date) console.log('data start este dupa finalizarea programului - 0 ore');
                                                                else {
                                                                    if (date_start < cvp_start_date) start = new Date (cvp_start_date);
                                                                    if (date_end > cvp_end_date) end = new Date (cvp_end_date);
                                                                    //var minutes = Math.round((end-start)/(1000*60));
                                                                    var minutes = Number(((end-start)/(1000*60)).toFixed(2));
                                                                    if (type == 'add' && minutes > 0) total_minutes = total_minutes + minutes;
                                                                    else if (type == 'substract') total_minutes = total_minutes - minutes;
                                                                }
                                                            }
                                                            else console.log('cvp nu lucreaza in ', date_start.toLocaleDateString("ro-RO"));
                                                        }
                                                        var asteptare_confirmare_plata = get_date_from_string($(this).find('td:nth-of-type(9)').text());
                                                        var OP_plata_confirmata = get_date_from_string($(this).find('td:nth-of-type(10)').text());
                                                        if (!OP_plata_confirmata) OP_plata_confirmata = data_final;
                                                        if (asteptare_confirmare_plata && OP_plata_confirmata && data_confirmata && asteptare_confirmare_plata > data_confirmata) {
                                                            var no_of_days_wait = date_diff_indays(asteptare_confirmare_plata, OP_plata_confirmata);
                                                            for (let i=0; i<=no_of_days_wait; i++) {
                                                                var data_start_wait = addDays(asteptare_confirmare_plata, i);
                                                                if (data_start_wait.getDate() == OP_plata_confirmata.getDate()) calc_minutes(data_start_wait, OP_plata_confirmata,'substract');
                                                                else {
                                                                    var data_final_wait = new Date(data_start_wait);
                                                                    data_final_wait.setHours(23,59,59,999);
                                                                    calc_minutes(data_start_wait, data_final_wait,'substract');
                                                                }
                                                            }
                                                        }
                                                        else console.log('nu este timp de asteptare a platii pentru '+ol);
                                                        var hours = Math.floor(total_minutes / 60);
                                                        var ore_text = ' ore';
                                                        if (hours == 1) ore_text = ' ora';
                                                        var minutes = (total_minutes % 60).toLocaleString('en', {maximumFractionDigits: 2});
                                                        var minute_text = ' minute';
                                                        if (minutes == '1') minute_text = ' minut';
                                                        var clasa = 'info';
                                                        if (ok) {
                                                            status = total_minutes.toLocaleString('en', {maximumFractionDigits: 2})+' minute<br>('+hours+ore_text+' si '+minutes+minute_text+')';
                                                            if (total_minutes > prag_timp_procesare) clasa = 'danger';
                                                            else if (total_minutes == 0) clasa = 'info';
                                                            else clasa = 'success';
                                                            timpi_de_procesare.push(total_minutes);
                                                        }
                                                        $(this).find('td:nth-of-type(13)').html(status).addClass(clasa);
                                                    });
                                                    var timp_mediu = 0;
                                                    var sum = 0;
                                                    timpi_de_procesare = timpi_de_procesare.filter(n => n !== 0); //elimin timpii = 0
                                                    $.each(timpi_de_procesare, function(index, value) {
                                                        sum = sum + value;
                                                    });
                                                    timp_mediu = Math.round(sum/timpi_de_procesare.length);
                                                    var hours = 0;
                                                    var mins = 0;
                                                    if (timp_mediu) {
                                                        hours = Math.floor(timp_mediu / 60);
                                                        mins = timp_mediu % 60;
                                                    }
                                                    var ore_text = ' ore';
                                                    if (hours == 1) ore_text = ' ora';
                                                    var nr_comenzi_eligibile = $('.my-table .danger, .my-table .success').length;
                                                    var nr_comenzi_totale = $('.my-table tbody > tr').length;
                                                    var nr_comenzi_intarziate = $('.my-table .danger').length;
                                                    $('.my-table > thead > tr > th:last-of-type').html(nr_comenzi_totale+' comenzi totale<br>'+nr_comenzi_eligibile+' comenzi eligibile<br>'+hours+ore_text+' si '+mins+' minute<br>'+nr_comenzi_intarziate+' intarziate');
                                                    var intarziate = [];
                                                    $('.my-table .danger').each(function() {
                                                        intarziate.push($(this).closest('tr').find('td:eq(0)').text());
                                                    });
                                                    console.log(intarziate.join(','));
                                                }
                                            }).catch(function(e) {
                                                $('.report-content > .content').html(e);
                                                $('#my_search').removeClass('disabled');
                                            });
                                        }
                                        else {
                                            content += `<tr><td colspan="7">Nu exista comenzi!</td></tr></tbody></table></div></div>`;
                                            $('.report-content > .content').html(content);
                                            $('#my_search').removeClass('disabled');
                                        }
                                    }).catch(function(e) {
                                        $('.report-content > .content').html(e);
                                        $('#my_search').removeClass('disabled');
                                    });
                                }
                            });
                        });
                    }
                    else {
                        waitForElm('input[name=order]').then((elm) => {
                            elm.addClass('text-uppercase');
                            elm.on('change', function () {
                                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                                nativeInputValueSetter.call(this, this.value.toUpperCase());
                                this.dispatchEvent(new Event("input", { bubbles: true }));
                            });
                        });
                    }
                }
                else if (url.includes('bie2.dedeman.ro/aplicatii/comenzi-dropshipping')) {
                    if (urlParams.get('incrementId')) {
                        waitForElm('input[name=incrementId]').then((elm) => {
                            elm.val(urlParams.get('incrementId')).closest('label').addClass('q-field--float');
                            elm.val(urlParams.get('incrementId'))[0].dispatchEvent(new Event('input', { bubbles: true }));
                            $('select[name=allOrders]').parent().click();
                            waitForElm('#q-portal--menu--1 .q-item__label:contains(Da)').then((option) => {
                                option.click();
                                elm.closest('form').find('button[type=submit]').click();
                                setTimeout(function(){
                                    $('.filter-drawer').removeClass('expanded').parent().removeClass('q-drawer--standard').addClass('q-drawer--mini').css('width', '30px');
                                }, 500);
                            });
                        });
                    }
                }
                else if (url.includes('bie2.dedeman.ro/raport/identificare-cos') && !visited.includes(url)) {
                    console.log('identificare cos');
                    GM_addStyle(`
                    body[data-url*=identificare-cos] .q-table tr td:first-child > a {cursor: pointer;}
                    body[data-url*=identificare-cos] .q-table tr td:first-child > a:hover {color: #1d84c0;}
                    `);
                    $(document).on('click auxclick', 'body[data-url*=identificare-cos] .q-table tr td:first-child > a', function(event) {
                        if (event.button === 0 || event.button === 1) GM_openInTab(location.origin+'/raport/detalii-cos?id='+$(this).text(),{active: !event.button, insert: false});
                    });
                }
                else if (url.includes('bie2.dedeman.ro/raport/detalii-cos') && !visited.includes(url)) {
                    console.log('detalii cos');
                    GM_addStyle(`
                    .disabled {
                        opacity: .7;
                        pointer-events: none;
                    }`);
                    var id_cos = 0;
                    var response_bie;
                    (function() {
                        var origOpen = XMLHttpRequest.prototype.open;
                        XMLHttpRequest.prototype.open = function() {
                            this.addEventListener('load', function() {
                                if (this.responseURL.includes('api/reports/detalii-cos/data')) {
                                    console.log('done get data');
                                    id_cos = $('.q-form.filters input[name=id]').val();
                                    console.log(id_cos);
                                    response_bie = JSON.parse(this.responseText);
                                    response_bie = response_bie.content.data;
                                    console.log(response_bie);
                                    if (!$('#create_order').length) {
                                        waitForElm('.q-card__section > .text-h6 > .q-card__actions').then((elm) => {
                                            var button = `<div class="q-card__actions justify-start q-card__actions--horiz row q-pa-none"><button id="create_order" class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable" type="button"><span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><span class="block">Creeaza comanda</span></span></button></div>`;
                                            elm.after(button).remove();
                                            $('#create_order').click(function() {
                                                if (id_cos) {
                                                    $('#create_order').addClass('disabled');
                                                    magento_request({api_url:'/rest/all/V1/carts/'+id_cos, origin: 'https://www.dedeman.ro', hostname: 'www.dedeman.ro'}).then(function(response) {
                                                        console.log(response);
                                                        if (!response.reserved_order_id) {
                                                            var id_client = 'guest';
                                                            if (response.customer.id) id_client = response.customer.id;
                                                            var order_details = {};
                                                            var plata = response_bie[1][response_bie[0].indexOf('value')];
                                                            var tip_plata = '—';
                                                            var id_metoda_plata = '';
                                                            if (/card|apple|google/gi.test(plata)) {
                                                                tip_plata = 'Card bancar';
                                                                id_metoda_plata = 'adminpayment';
                                                            }
                                                            else if (/ramburs|plat[aă] la livrare/gi.test(plata)) {
                                                                tip_plata = 'Plată la livrare';
                                                                id_metoda_plata = 'cashondelivery';
                                                            }
                                                            else if (/transfer/gi.test(plata)) {
                                                                tip_plata = 'Transfer bancar';
                                                                id_metoda_plata = 'banktransfer';
                                                            }
                                                            console.log(tip_plata);
                                                            var tip_livrare = '—';
                                                            var text_livrare = response_bie[1][response_bie[0].indexOf('shipping_description')];
                                                            tip_livrare = get_shipping_type(text_livrare);
                                                            var cost_livrare = Number(response_bie[1][response_bie[0].indexOf('shipping_amount')] || 0);
                                                            var total_comanda = Number(Number(response_bie[1][response_bie[0].indexOf('grand_total')]).toFixed(2));
                                                            var produse = {};
                                                            var sku, cantitate, pret;
                                                            $.each(response.extension_attributes.shipping_assignments[0].items, function(index, value) {
                                                                sku = value.sku;
                                                                if (!sku.includes('-')) {
                                                                    cantitate = value.qty;
                                                                    pret = value.price;
                                                                    if (produse[sku]) {
                                                                        var total_anterior = produse[sku].cantitate * produse[sku].pret;
                                                                        var total_curent = cantitate * pret;
                                                                        cantitate = produse[sku].cantitate + cantitate;
                                                                        pret = Number(((total_anterior + total_curent) / cantitate).toFixed(2));
                                                                    }
                                                                    produse[sku] = {cantitate: cantitate, pret: pret};
                                                                }
                                                            });
                                                            var email = id_client == 'guest' ? response.billing_address.email : '';
                                                            var address = response.billing_address;
                                                            var billing_address = {
                                                                firstname:  address.firstname,
                                                                lastname:  address.lastname,
                                                                telephone:  address.telephone,
                                                                country_id:  address.country_id,
                                                                region:  address.region,
                                                                region_id:  address.region_id,
                                                                city:  address.city,
                                                                street:  address.street[0],
                                                                company: address.company
                                                            };
                                                            $.each(address.custom_attributes, function(index, value) {
                                                                billing_address[value.attribute_code] = value.value;
                                                            });
                                                            delete billing_address.address_type;
                                                            if (response.extension_attributes) address = response.extension_attributes.shipping_assignments[0].shipping.address;
                                                            var shipping_address = {
                                                                firstname:  address.firstname,
                                                                lastname:  address.lastname,
                                                                telephone:  address.telephone,
                                                                country_id:  address.country_id,
                                                                region:  address.region,
                                                                region_id:  address.region_id,
                                                                city:  address.city,
                                                                street:  address.street[0],
                                                                company: address.company
                                                            };
                                                            $.each(address.custom_attributes, function(index, value) {
                                                                shipping_address[value.attribute_code] = value.value;
                                                            });
                                                            delete shipping_address.address_type;
                                                            order_details = {tip_plata: tip_plata, cod_plata: '', comanda_achitata: 0, id_metoda_plata: id_metoda_plata, tip_livrare: tip_livrare, cost_livrare: cost_livrare, total_comanda: total_comanda, produse: produse, billing_address: billing_address, shipping_address: shipping_address, email: email};
                                                            console.log(order_details);
                                                            document.cookie = `comanda_noua_${id_cos}=${JSON.stringify(order_details)}; domain=dedeman.ro; path=/`;
                                                            $('#create_order').removeClass('disabled');
                                                            GM_openInTab(`https://www.dedeman.ro/admin/sales/order_create/start/customer_id/${id_client}/#id_cos=${id_cos}`, {active: true, insert: false});
                                                        }
                                                        else {
                                                            alert('Pentru acest cos exista deja comanda '+response.reserved_order_id);
                                                            $('#create_order').removeClass('disabled');
                                                        }
                                                    }).catch(function(e) {
                                                        alert(e);
                                                        $('#create_order').removeClass('disabled');
                                                    });
                                                }
                                                else alert('Nu am găsit id-ul coșului!');
                                            });
                                        });
                                    }
                                }
                            });
                            origOpen.apply(this, arguments);
                        };
                    })();
                }
                if (!visited.includes(url)) visited.push(url);
            }
            make_actions_bie2(location.href);
        }
        else if (window.location.href.includes('angajat.dedeman.ro')) {
            console.log('angajat');
            window.navigation.addEventListener("navigate", (event) => {
                if (event.navigationType == 'push') make_actions_angajat(event.destination.url);
            });
            function make_actions_angajat(url) {
                console.log('make actions angajat');
                if (url.includes('autentificare')) {
                    console.log('login');
                    waitForElm('#app .login-form').then((elm) => {
                        var urlParams = new URLSearchParams(location.search);
                        if (urlParams.get('redirect') == 'bie' && urlParams.get('name')) sessionStorage.setItem('redirect', decodeURIComponent(location.search.replace('?redirect=bie&name=','')));
                        if (GM_getValue('angajat_username')) $('#dedeman_username').val(GM_getValue('angajat_username'))[0].dispatchEvent(new Event('input', { bubbles: true }));
                        if (GM_getValue('angajat_password')) $('#dedeman_password').val(GM_getValue('angajat_password'))[0].dispatchEvent(new Event('input', { bubbles: true }));
                        if ($('#dedeman_username').val() && $('#dedeman_password').val()) {
                            $('#remember_me').prop('checked', true)[0].dispatchEvent(new Event('change', { bubbles: true }));
                            setTimeout(function(){$('form.login-form button[type=submit]').click();}, 500);
                        }
                    });
                }
                else if (url.includes('acasa') && sessionStorage.getItem('redirect')) {
                    console.log('redirect');
                    window.location = 'https://bie2.dedeman.ro'+sessionStorage.getItem('redirect');
                    sessionStorage.removeItem('redirect');
                }
            }
            make_actions_angajat(location.href);
        }
        else if (window.location.href.includes('portal.dedeman.ro')) {
            console.log('portal');
            GM_addStyle(`
            .py-6:nth-of-type(1) .grid > div:nth-of-type(1) .text-base {display: inline-block;}
            .py-6:nth-of-type(1) .grid > div:nth-of-type(1) .text-base:hover {cursor: pointer; text-decoration: underline;}
            `);
            $(document).on('click auxclick', '.py-6:nth-of-type(1) .grid > div:nth-of-type(1) .text-base', function(e) {
                if (e.button < 2) {
                    let nrOL = $(this).text();
                    if (regExOLTest.test(nrOL)) search_open_magento_order(nrOL, !e.button, $(this));
                }
            });
        }
    }

})();