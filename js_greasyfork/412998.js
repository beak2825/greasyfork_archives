// ==UserScript==
// @name         台灣艾多美後台快速出入庫
// @namespace    sabpprook
// @version      1.4.1
// @description  快速掃讀訂單商品，完成出入庫
// @author       sabpprook
// @match        http://125.227.226.152:8080/POS/*
// @match        http://125.227.226.152:8080/POS/OrderOut2.aspx
// @match        http://125.227.226.152:8080/POS/OrderWholeIn2.aspx
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/412998/%E5%8F%B0%E7%81%A3%E8%89%BE%E5%A4%9A%E7%BE%8E%E5%BE%8C%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%87%BA%E5%85%A5%E5%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/412998/%E5%8F%B0%E7%81%A3%E8%89%BE%E5%A4%9A%E7%BE%8E%E5%BE%8C%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%87%BA%E5%85%A5%E5%BA%AB.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 公告
    var logout = $("#Logout_Button");
    if (logout.length) {
        let dt = moment().format("YYYY/MM/DD");
        if (GM_getValue('datetime') != dt) {
            let str = '';
            await $.get("https://gist.githubusercontent.com/sabpprook/9ca7642424a01c446fcc46b072575ee8/raw/motd.txt?" + Date.now(), function(data) {
                str = data;
            });
            await Swal.fire({
                html: str,
                icon: 'info',
                timer: 10000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function(result) {
                GM_setValue('datetime', dt);
            });
        }
    }

    // 入庫
    var SN = $("#ContentPlaceHolder1_SN");
    var PN = $("#ContentPlaceHolder1_PN");
    var MinusQ = $("#ContentPlaceHolder1_MinusQ");
    if (SN.length && SN.val()) {
        if (PN.val() == '') {
            await Swal.fire({
                html: '確認整批入庫該出貨單號?',
                icon: 'warning',
                position: 'top',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function(result) {
                GM_setValue('SN', result.value ? SN.val() : '');
            });
        }
        if (MinusQ.prop('checked')) {
            GM_setValue('SN', '');
        }
        if (SN.val() != GM_getValue('SN')) {
            return;
        }

        let code = $("#ContentPlaceHolder1_PB");
        let quntity = $("#ContentPlaceHolder1_PQ");
        let table = $("#ContentPlaceHolder1_GridView1").children().children().next();
        for(let i=0; i<table.length; i++) {
            let barcode = table[i].children[3].innerText;
            let count = table[i].children[8].innerText;
            if (count > 0) {
                quntity.val(count);
                code.val(barcode);
                code.change();
                return;
            }
        }
    }

    // 出庫
    var CN = $("#ContentPlaceHolder1_CN");
    if (CN.length && CN.val()) {
        let code = $("#ContentPlaceHolder1_PB");
        let quntity = $("#ContentPlaceHolder1_PQ");
        let table = $("#ContentPlaceHolder1_GridView1").children().children().next();
        for(let i=0; i<table.length; i++) {
            let barcode = table[i].children[1].innerText;
            let count = table[i].children[7].innerText;
            if (count > 0) {
                quntity.val(count);
                code.val(barcode);
                code.change();
                return;
            }
        }
    }
    // Ver 1.4.1
})();