// ==UserScript==
// @name         ATOMY.KR 海外信用卡訂購
// @namespace    https://greasyfork.org/scripts/450251
// @version      3.3.0-20220827
// @description  艾多美韓國海外信用卡訂購程式
// @homepageURL  https://greasyfork.org/users/694524
// @supportURL   https://www.facebook.com/profile.php?id=100005653172695
// @author       許宥彥
// @copyright    許宥彥
// @match        *://www.atomy.kr/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.atomy.kr&size=16
// @icon64       https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.atomy.kr&size=64
// @require      https://cdn.jsdelivr.net/npm/jquery@3
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @compatible   Chrome >=87 + Tampermonkey + Violentmonkeyend
// @compatible   Edge >=87 + Tampermonkey + Violentmonkey
// @compatible   Firefox >=45 + Tampermonkey + Violentmonkey
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/450251/ATOMYKR%20%E6%B5%B7%E5%A4%96%E4%BF%A1%E7%94%A8%E5%8D%A1%E8%A8%82%E8%B3%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/450251/ATOMYKR%20%E6%B5%B7%E5%A4%96%E4%BF%A1%E7%94%A8%E5%8D%A1%E8%A8%82%E8%B3%BC.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    var $ = unsafeWindow.jQuery;
    unsafeWindow.document.body.oncontextmenu = null;

    $("head").append('<link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma@5" rel="stylesheet" type="text/css">');

    // 自動訂購
    var auto_submit = 0;

    /* 虛擬帳號
    03 기업 中小企業銀行 | 07 수협 水協銀行 | 31 대구 大邱銀行 | 06 국민 國民銀行
    11 농협 農業協會 | 81 KEB하나 KEB韓亞銀行 | 20 우리 友利銀行 | 26 신한 新韓銀行
    39 경남 慶南銀行 | 71 우체국 韓國郵政 | 32 부산 釜山銀行 */
    var bank_id = GM_getValue("bank_id", "06");

    // 信用卡結帳資訊
    var card_no1 = GM_getValue("card_no1", "");
    var card_no4 = GM_getValue("card_no4", "");
    var card_check = GM_getValue("card_check", "");
    var card_owner = GM_getValue("card_owner", "");

    // 收件人資訊
    var revname = GM_getValue("revname", "이광호 SKB");
    var cellphone2 = GM_getValue("cellphone2", "7143");
    var cellphone3 = GM_getValue("cellphone3", "1974");

    // 一般會員購買配送地址資訊
    var quick_zip = GM_getValue("quick_zip", "14691");
    var quick_addr1 = GM_getValue("quick_addr1", "경기도 부천시 경인로 416-1 (소사본동, 디에이치웰카운티)");
    var quick_addr2 = GM_getValue("quick_addr2", "경인로416-1 1층상가희성무역");

    var lock = false;

    const delay = (s) => {
        return new Promise(function (resolve) {
            setTimeout(resolve, s);
        });
    };

    // 主程式
    const Main = async () => {
        if (lock) return;
        lock = true;
        while (true) {
            await delay(500);
            // 檢查購物金額
            if ($("#totSum2").text().length > 1) break;
        }
        // 填入訂購資訊
        await OrderData(); await delay(500);
        // 自動送出
        if (auto_submit) {
            check_submit();
        }
        lock = false;
    }

    const BypassAccount = () => {
        console.log('帳號限制破解 請聯絡 Line: sabpprook');
    }

    const BindCustomButton = async () => {
        var check_user = false;
        var bind_quickorder = false;
        var bind_utils = false;
        var bind_popup = false;

        var new_style = document.createElement('style');
        new_style.innerHTML = '.font-cht { font-family: "Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","HeitiSC","WenQuanYi Micro Hei",sans-serif; }';
        document.head.appendChild(new_style);

        while (true) {
            // 綁定快速結帳按鈕
            if (!bind_quickorder && $("#aQuickOrder1").length) {
                $("#aQuickOrder1").bind("click", Main);
                bind_quickorder = true;
            }
            if (!bind_utils && $(".utils-list").length) {
                $(".utils-list").append('<li><a href="#" id="utils-creditcard" class="font-cht">海外卡結帳</a></li>');
                $("#utils-creditcard").bind("click", StdPayConfigure);
                $(".utils-list").append('<li><a href="#" id="utils-address" class="font-cht">設定貨運行</a></li>');
                $("#utils-address").bind("click", AddressConfigure);
                bind_utils = true;
            }
            if (!bind_popup && $(".area-btn-popup").length) {
                $(".area-btn-popup").append('<a id="popup-address" class="btn-popup font-cht" style="height:120px">設定貨運行</a>');
                $("#popup-address").bind("click", AddressConfigure);
                $(".area-btn-popup").append('<a id="popup-creditcard" class="btn-popup font-cht" style="height:120px">海外卡結帳</a>');
                $("#popup-creditcard").bind("click", StdPayConfigure);
                $('.area-btn-popup')[0].style.setProperty('top', '8em')
                bind_popup = true;
            } else if (!$(".area-btn-popup").length) {
                $('<div class="area-btn-popup"></div>').insertAfter($("#footer"));
            }

            await delay(500);
        }
    }

    const OrderData = async () => {
        $("#tSendName").val(revname); await delay(50);
        $("#tRevUserName").val(revname); await delay(50);
        $("#tCellPhone2").val(cellphone2); await delay(50);
        $("#tCellPhone3").val(cellphone3); await delay(50);
        $("#tRevCellPhone2").val(cellphone2); await delay(50);
        $("#tRevCellPhone3").val(cellphone3); await delay(50);
        $("#tPhone2").val("0000"); await delay(50);
        $("#tPhone3").val("0000"); await delay(50);
        $("#tRevPhone2").val("0000"); await delay(50);
        $("#tRevPhone3").val("0000"); await delay(50);
        $("#tRevPostNo").val(quick_zip); await delay(50);
        $("#tRevAddr1").val(quick_addr1); await delay(50);
        $("#tRevAddr2").val(quick_addr2); await delay(50);

        // 當地貨運延遲確認
        $("#quickPost_60").prop("checked", false);
        unsafeWindow.quickPost6Flag = false;

        // 預設海外卡付款
        await UseGlobalCreditCard();

        $("#chkAgree").click(); await delay(50);
        $("#chkEduAgree").click(); await delay(50);
    }

    // 海外卡付款
    const UseGlobalCreditCard = async () => {
        $("#settleGubun16").prop("type", "radio"); await delay(50);
        $("#settleGubun16").prop('disabled', false); await delay(50);
        $("#settleGubun16").show(); await delay(50);
        $("#settleGubun16_input").show(); await delay(50);

        $("#paymentRadio3").click(); await delay(200);
        $("#settleGubun16_input").click(); await delay(200);

        document.getElementsByClassName("conts_pay")[0].scrollIntoView(false);
    }

    // 信用卡付款
    const UseCreditCard = async () => {
        $("#settleGubun4").prop("type", "radio"); await delay(50);
        $("#settleGubun4").prop('disabled', false); await delay(50);
        $("#settleGubun4").show(); await delay(50);
        $("#settleGubun4_input").show(); await delay(50);

        $("#paymentRadio3").click(); await delay(200);
        $("#settleGubun4_input").click(); await delay(200);
        $("[name='scard_no1']").val(card_no1); await delay(50);
        $("[name='scard_no4']").val(card_no4); await delay(50);
        $("[name='recog_no']").val(card_check); await delay(50);

        //$(".btnApprovalAmount").click(); await delay(200);
        var sum = $("#totSum2").text().replace(/,/g, "");
        $("input[name='settle_amt']").val(sum); await delay(50);

        document.getElementsByClassName("conts_pay")[0].scrollIntoView(false);
    }

    // 設定貨運行
    const AddressConfigure = async () => {
        await Swal.fire({
            title: '設定貨運行資料',
            confirmButtonText: '儲存',
            width: '50em',
            html: `
            <p class="font-cht">
            收件人/寄件人:<input id="swal2-revname" class="swal2-input font-cht" value="${revname}" style="width:12em" required><br>
            手機前 4 碼:<input id="swal2-cellphone2" class="swal2-input font-cht" value="${cellphone2}" maxlength="4" style="width:6em" required>
            手機後 4 碼:<input id="swal2-cellphone3" class="swal2-input font-cht" value="${cellphone3}" maxlength="4" style="width:6em" required><br>
            郵政區號:<input id="swal2-quick_zip" class="swal2-input font-cht" value="${quick_zip}" style="width:8em" required><br>
            地址1:<input id="swal2-quick_addr1" class="swal2-input font-cht" value="${quick_addr1}" style="width:30em" required><br>
            地址2:<input id="swal2-quick_addr2" class="swal2-input font-cht" value="${quick_addr2}" style="width:30em" required><br>
            虛擬帳號銀行: <select id="swal2-bank_id" class="swal2-select font-cht" style="width:14em;min-width:10%">
            <option class="font-cht" value="03">03 기업 中小企業銀行</option>
            <option class="font-cht" value="07">07 수협 水協銀行</option>
            <option class="font-cht" value="31">31 대구 大邱銀行</option>
            <option class="font-cht" value="06">06 국민 國民銀行</option>
            <option class="font-cht" value="11">11 농협 農業協會</option>
            <option class="font-cht" value="81">81 KEB하나 KEB韓亞銀行</option>
            <option class="font-cht" value="20">20 우리 友利銀行</option>
            <option class="font-cht" value="26">26 신한 新韓銀行</option>
            <option class="font-cht" value="39">39 경남 慶南銀行</option>
            <option class="font-cht" value="71">71 우체국 韓國郵政</option>
            <option class="font-cht" value="32">32 부산 釜山銀行</option></select></p>`,
            focusConfirm: false,
            didOpen: () => {
                Swal.getHtmlContainer().querySelector(`#swal2-bank_id option[value="${bank_id}"]`).selected = 'selected';
            },
            focusConfirm: false,
            preConfirm: () => {
                revname = document.getElementById('swal2-revname').value;
                cellphone2 = document.getElementById('swal2-cellphone2').value;
                cellphone3 = document.getElementById('swal2-cellphone3').value;
                quick_zip = document.getElementById('swal2-quick_zip').value;
                quick_addr1 = document.getElementById('swal2-quick_addr1').value;
                quick_addr2 = document.getElementById('swal2-quick_addr2').value;
                bank_id = document.getElementById('swal2-bank_id').value;
                if (revname && cellphone2 && cellphone3 &&
                    quick_zip && quick_addr1 && quick_addr2 && bank_id) {
                    GM_setValue("revname", revname);
                    GM_setValue("cellphone2", cellphone2);
                    GM_setValue("cellphone3", cellphone3);
                    GM_setValue("quick_zip", quick_zip);
                    GM_setValue("quick_addr1", quick_addr1);
                    GM_setValue("quick_addr2", quick_addr2);
                    GM_setValue("bank_id", bank_id);
                    Swal.fire('資料已儲存!', '', 'success');
                } else {
                    Swal.showValidationMessage('所有欄位需填入正確資料');
                }
            }
        })
    }

    const AutoSubmitPayload = async (param) => {
        var useBlank = true;
        if (!param) {
            let href = new URL(window.location.href);
            var payload = href.searchParams.get('payload');
            if (payload) {
                param = payload;
                useBlank = false;
            }
        }
        if (!param) return;

        try {
            var json = decodeURIComponent(escape(window.atob(param)));
            var stdpay = JSON.parse(json).jsonData;
            console.log(stdpay);
        }
        catch(err) {
            alert(err.message);
            return;
        }
        function createForm() {
            var form = document.createElement("form");
            form.method = "POST";
            form.action = "https://stdpay.inicis.com/payMain/pay";
            if (useBlank) {
                form.target = "_blank";
            }
            return form;
        }
        function addInput(parent, name, value) {
            var input = document.createElement("input");
            input.name = name;
            input.value = value;
            parent.appendChild(input);
        }
        var form = createForm();
        addInput(form, "version", stdpay.Version);
        addInput(form, "currency", stdpay.Currency);
        addInput(form, "mKey", stdpay.MKey);
        addInput(form, "mid", stdpay.MID);
        addInput(form, "oid", stdpay.OID);
        addInput(form, "price", stdpay.Price);
        addInput(form, "goodname", stdpay.GoodName);
        addInput(form, "buyername", stdpay.BuyerName);
        addInput(form, "buyertel", stdpay.BuyerTel);
        addInput(form, "buyeremail", stdpay.BuyerEmail);
        addInput(form, "timestamp", stdpay.Timestamp);
        addInput(form, "signature", stdpay.Signature);
        addInput(form, "returnUrl", stdpay.ReturnUrl);
        addInput(form, "closeUrl", stdpay.CloseUrl);
        addInput(form, "popupUrl", stdpay.PopupUrl);
        addInput(form, "gopaymethod", stdpay.GoPayMethod);
        addInput(form, "acceptmethod", stdpay.AcceptMethod);
        addInput(form, "Ini_SSGPAY_MDN", "");
        addInput(form, "quotabase", "2:3:4:5:6:7:8:9:11:12");
        addInput(form, "requestByJs", "true");
        document.body.appendChild(form);
        form.submit();
    }

    // 設定信用卡
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

    BypassAccount();
    BindCustomButton();
    AutoSubmitPayload();
    Main();
})();