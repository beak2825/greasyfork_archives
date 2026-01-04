// ==UserScript==
// @name         ATOMY.KR 2023 信用卡訂購
// @namespace    https://greasyfork.org/scripts/457589
// @version      1.1.3-20230606
// @description  艾多美韓國訂購程式 2023 新版
// @homepageURL  https://greasyfork.org/users/694524
// @supportURL   https://www.facebook.com/profile.php?id=100005653172695
// @source       https://gist.github.com/sabpprook/4f3deff643f7c48e1355171dacc34c5a
// @author       許宥彥
// @copyright    許宥彥
// @match        *://atomy.com/*
// @match        *://shop.atomy.com/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://shop.atomy.com&size=16
// @icon64       https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://shop.atomy.com&size=64
// @require      https://cdn.jsdelivr.net/npm/jquery@3
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @compatible   Chrome >=87 + Tampermonkey + Violentmonkeyend
// @compatible   Edge >=87 + Tampermonkey + Violentmonkey
// @compatible   Firefox >=45 + Tampermonkey + Violentmonkey
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/457589/ATOMYKR%202023%20%E4%BF%A1%E7%94%A8%E5%8D%A1%E8%A8%82%E8%B3%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/457589/ATOMYKR%202023%20%E4%BF%A1%E7%94%A8%E5%8D%A1%E8%A8%82%E8%B3%BC.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    GM_addElement('link', { href: 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma@5/bulma.min.css', rel: 'stylesheet' });
    GM_addElement('link', { href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400&display=swap', rel: 'stylesheet' });
    GM_addStyle('* { font-family: "Noto Sans TC" !important; }');

    const $ = window.jQuery;
    const Swal = window.Sweetalert2;

    // 付款方式
    var checkout_type = GM_getValue("checkout_type", "overseas");

    // 收件人資訊
    var sendname = GM_getValue("sendname", "SSS075");
    var revname = GM_getValue("revname", "FUSHENG");
    var cellphone = GM_getValue("cellphone", "01071431974");
    var phone = GM_getValue("phone", "0200000000");

    // 一般會員購買配送地址資訊
    var quick_zip = GM_getValue("quick_zip", "14691");
    var quick_addr1 = GM_getValue("quick_addr1", "경기도 부천시 경인로 416-1");
    var quick_addr2 = GM_getValue("quick_addr2", "경인로416-1 1층상가희성무역");

    var address = [
        {
            "name": "台北KK",
            "phone": "0200000000",
            "cellphone": "01071431974",
            "zipcode": "14691",
            "addr1": "경기도 부천시 경인로 416-1",
            "addr2": "경인로416-1 1층상가희성무역"
        },
        {
            "name": "高雄齊納福",
            "phone": "0200000000",
            "cellphone": "01098468066",
            "zipcode": "04570",
            "addr1": "서울특별시 중구 다산로 274",
            "addr2": "(흥인동) 우일타운806호"
        }
    ];

    const delay = (s) => {
        return new Promise(function (resolve) {
            setTimeout(resolve, s);
        });
    };

    const setValue = (selector, value) => {
        if (selector.length == 0) return;
        if (typeof value === "boolean") {
            let e = new InputEvent("change");
            selector.prop('checked', value);
            selector[0].dispatchEvent(e);
        }
        if (typeof value === "string") {
            let e = new InputEvent("input");
            selector.val(value);
            selector[0].dispatchEvent(e);
        }
    }

    // 主程式
    const Main = async () => { while (true) {
        console.log('wait checkout...'); await delay(2000);

        // 檢查購物項目
        if ($(".order-info").children().length < 1) {
            var new_address = false;
            var is_prepay = false;
            continue
        }

        let cellphone = $(".contact .phone") ? $(".contact .phone").text().replaceAll('-', '') : cellphone;
        let phone = $(".contact .tel") ? $(".contact .tel").text().replaceAll('-', '') : phone;

        // Korean
        setValue($("input[name='이름']"), sendname);
        setValue($("input[name='휴대폰번호']"), cellphone);
        setValue($("input[name='일반전화번호']"), phone);

        // English
        setValue($("input[name='Name']"), sendname);
        setValue($("input[name='Mobile']"), cellphone);
        setValue($("input[name='Phone']"), phone);

        // 檢查付款方式
        if (checkout_type == "overseas" && $("#CREDIT").length > 0) {
            // 選擇信用卡類別
            if (!$("#CREDIT").parent().hasClass("active")) {
                $("#CREDIT").click(); await delay(1000);
                console.log('choose credit card method');
            }
            let select = $('#option-1[name="cardSelect"]');
            // 選擇海外信用卡
            if (select.length > 0 && !select.get(0).checked) {
                select.click(); await delay(1000);
                console.log('choose overseas card');
            }
        }

        // 檢查付款方式
        if (checkout_type == "prepay" && $("#PREPAY").length > 0) {
            // 選擇預付卡類別
            if (!$("#PREPAY").parent().hasClass("active")) {
                $("#PREPAY").click(); await delay(1000);
                is_prepay = false;
                console.log('choose PREPAY [1/2]');
            }
            let select = $('#PREPAY_CREDIT[value="PREPAY_CREDIT"]');
            // 選擇預付信用卡
            if (select.length > 0 && !select.get(0).checked) {
                select.click(); await delay(1000);
                console.log('choose PREPAY [2/2]');
            }
            if (select.get(0).checked && !is_prepay)
            {
                let cardInfo = GM_getValue("prepay_info", "").split(',');
                setValue($('input[name="card1"]'), cardInfo[0]);
                setValue($('input[name="card4"]'), cardInfo[1]);
                setValue($('input[name="approvalNumber"]'), cardInfo[2]);
                setValue($('input[class="ice_survey_input"]'), cardInfo[3]);
                setValue($('input[name="approvalAmount"]'), cardInfo[4]);
                var totalPrice = $('div[class="format-price"] > strong').text();
                totalPrice = totalPrice.replaceAll(',', '');
                setValue($('input[name="amount"]'), totalPrice);
                is_prepay = true;
                console.log('PREPAY data filled!');
            }
        }

        if ($(".add-address").length > 0) {
            if (new_address) {
                $(".add-address .form-address").prepend('<div class="row address-list"></div>');
                address.forEach((obj) => {
                    $(".add-address .form-address .address-list").append(`<div style="width: 8rem;"><button type="button" class="${obj.name}">${obj.name}</button></div>`);
                    $(`.add-address .form-address .${obj.name}`).on("click", () => { SetAddress(obj.name) });
                })

                SetAddress();
                new_address = false;
            }
        }
        else {
            new_address = true;
        }
    }}

    const SetAddress = async (opt) => {
        var obj = address.find(x => x.name == opt);

        if (obj) {
            phone = obj.phone;
            cellphone = obj.cellphone;
            quick_zip = obj.zipcode;
            quick_addr1 = obj.addr1;
            quick_addr2 = obj.addr2;
        }

        // Korean
        setValue($("input[name='받으시는분']"), revname);
        setValue($('input[placeholder="우편번호"]'), quick_zip);
        setValue($('input[name="주소"]'), quick_addr1);
        setValue($("input[name='상세 주소']"), quick_addr2);

        // English
        setValue($("input[name='Recipient']"), revname);
        setValue($("input[name='Mobile number']"), cellphone);
        setValue($("input[name='Tel']"), phone);
        setValue($('input[placeholder="Postal code"]'), quick_zip);
        setValue($('input[name="Address"]'), quick_addr1);
        setValue($("input[name='Detailed address']"), quick_addr2);

        setValue($('input[name="default"]'), true);
    }

    const BindCustomButton = async () => {
        while (true) {
            if ($(".swiper-wrapper").children().length > 5 && $("#floating-address").length == 0) {
                $(".floating-wrap").prepend('<div class="btn" data-v-768f5c2d=""><a id="floating-address" title="設定貨運資料" class="btn-chatbot" data-v-768f5c2d="">設定貨運資料</a></div>');
                //$(".floating-wrap").prepend('<div class="btn" data-v-768f5c2d=""><a id="inicis-pay" title="海外卡結帳" class="btn-chatbot" data-v-768f5c2d="">海外卡結帳</a></div>');
                $("#floating-address").bind("click", AddressConfigure);
                //$("#inicis-pay").bind("click", StdPayConfigure);
            }
            await delay(500);
        }
    }

    // 設定貨運行
    const AddressConfigure = () => {
        Swal.fire({
            title: '設定貨運資料',
            confirmButtonText: '儲存',
            width: '50em',
            html: `
            <p class="font-cht">
            付款方式:
            <select id="swal2-checkout-type" class="swal2-select" required>
            <option value="overseas">海外信用卡</option>
            <option value="prepay">預付款信用卡</option></select><br>
            寄件人:<input id="swal2-sendname" class="swal2-input font-cht" value="${GM_getValue("sendname", "")}" style="width:12em" required><br>
            收件人:<input id="swal2-revname" class="swal2-input font-cht" value="${GM_getValue("revname", "")}" style="width:12em" required><br>
            手機:<input id="swal2-cellphone" class="swal2-input font-cht" value="${GM_getValue("cellphone", "")}" maxlength="11" style="width:10em" required>
            電話:<input id="swal2-phone" class="swal2-input font-cht" value="${GM_getValue("phone", "")}" maxlength="11" style="width:10em" required><br>
            郵政區號:<input id="swal2-quick_zip" class="swal2-input font-cht" value="${GM_getValue("quick_zip", "")}" style="width:8em" required><br>
            地址1:<input id="swal2-quick_addr1" class="swal2-input font-cht" value="${GM_getValue("quick_addr1", "")}" style="width:30em" required><br>
            地址2:<input id="swal2-quick_addr2" class="swal2-input font-cht" value="${GM_getValue("quick_addr2", "")}" style="width:30em" required><br>`,
            focusConfirm: false,
            preConfirm: () => {
                checkout_type = document.getElementById('swal2-checkout-type').value;
                sendname = document.getElementById('swal2-sendname').value;
                revname = document.getElementById('swal2-revname').value;
                cellphone = document.getElementById('swal2-cellphone').value;
                phone = document.getElementById('swal2-phone').value;
                quick_zip = document.getElementById('swal2-quick_zip').value;
                quick_addr1 = document.getElementById('swal2-quick_addr1').value;
                quick_addr2 = document.getElementById('swal2-quick_addr2').value;
                if (checkout_type && sendname && revname && cellphone && phone &&
                    quick_zip && quick_addr1 && quick_addr2) {
                    GM_setValue("checkout_type", checkout_type);
                    GM_setValue("prepay_info", GM_getValue("prepay_info", ""));
                    GM_setValue("sendname", sendname);
                    GM_setValue("revname", revname);
                    GM_setValue("cellphone", cellphone);
                    GM_setValue("phone", phone);
                    GM_setValue("quick_zip", quick_zip);
                    GM_setValue("quick_addr1", quick_addr1);
                    GM_setValue("quick_addr2", quick_addr2);
                    Swal.fire('資料已儲存!', '', 'success');
                } else {
                    Swal.showValidationMessage('所有欄位需填入正確資料');
                }
            }
        })
    }

    const AutoSubmitPayload = async (param) => {
        try {
            var json = decodeURIComponent(window.atob(param));
            console.log(json);
            var stdpay = JSON.parse(json);
        }
        catch(err) {
            alert(err.message);
            return;
        }
        function createForm() {
            var form = document.createElement("form");
            form.method = "POST";
            form.action = "https://stdpay.inicis.com/payMain/pay";
            form.target = "_blank";
            return form;
        }
        function addInput(parent, name, value) {
            var input = document.createElement("input");
            input.name = name;
            input.value = value;
            parent.appendChild(input);
        }
        var form = createForm();
        addInput(form, "version", stdpay.version);
        addInput(form, "mid", stdpay.mid);
        addInput(form, "oid", stdpay.oid);
        addInput(form, "price", stdpay.price);
        addInput(form, "timestamp", stdpay.timestamp);
        addInput(form, "signature", stdpay.signature);
        addInput(form, "mKey", stdpay.mKey);
        addInput(form, "currency", stdpay.currency);
        addInput(form, "goodname", stdpay.goodname);
        addInput(form, "buyername", stdpay.buyername);
        addInput(form, "buyertel", stdpay.buyertel);
        addInput(form, "buyeremail", stdpay.buyeremail);
        addInput(form, "returnUrl", stdpay.returnUrl);
        addInput(form, "closeUrl", stdpay.closeUrl);
        addInput(form, "gopaymethod", stdpay.gopaymethod);
        addInput(form, "acceptmethod", stdpay.acceptmethod);
        addInput(form, "Ini_SSGPAY_MDN", stdpay.Ini_SSGPAY_MDN);
        addInput(form, "requestByJs", stdpay.requestByJs);
        document.body.appendChild(form);
        form.submit();
    }

    const StdPayConfigure = async () => {
        await Swal.fire({
            title: '海外卡結帳',
            confirmButtonText: '送出',
            width: '50em',
            html: `<textarea id="swal2-stdpay-json" class="swal2-input font-cht" style="width:30em;height:30em"></textarea><br>`,
            didOpen: () => {
                navigator.clipboard.readText().then(
                    (clipText) => { Swal.getHtmlContainer().querySelector(`#swal2-stdpay-json`).value = clipText }
                );
            },
            focusConfirm: false,
            preConfirm: () => {
                var payload = document.getElementById('swal2-stdpay-json').value;
                AutoSubmitPayload(payload);
            }
        })
    }

    BindCustomButton();
    Main();
})();