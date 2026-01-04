// ==UserScript==
// @name         ATOMY.KR Order Script
// @namespace    https://greasyfork.org/scripts/439885
// @version      2.6.2-20220222
// @description  韓國艾多美訂購程式
// @homepageURL  https://greasyfork.org/users/694524
// @supportURL   https://www.facebook.com/profile.php?id=100005653172695
// @author       許宥彥
// @copyright    許宥彥
// @match        *://www.atomy.kr/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.atomy.kr&size=16
// @icon64       https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.atomy.kr&size=64
// @require      https://cdn.jsdelivr.net/npm/jquery@3
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/jquery-contextmenu@2
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @compatible   Chrome >=87 + Tampermonkey + Violentmonkeyend
// @compatible   Edge >=87 + Tampermonkey + Violentmonkey
// @compatible   Firefox >=45 + Tampermonkey + Violentmonkey
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/439885/ATOMYKR%20Order%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/439885/ATOMYKR%20Order%20Script.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    var $ = window.jQuery;

    unsafeWindow.document.body.oncontextmenu = null;
    $("head").append('<link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma@5" rel="stylesheet" type="text/css">');
    $("head").append('<link href="https://cdn.jsdelivr.net/npm/jquery-contextmenu@2/dist/jquery.contextMenu.min.css" rel="stylesheet" type="text/css">');

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
            // 檢查購物清單
            if (typeof getPaymentCartList === 'undefined') continue;
            var cartList = getPaymentCartList();
            if (cartList.length > 0) break;
        }
        // 填入訂購資訊
        await OrderData(); await delay(500);
        // 自動送出
        if (auto_submit) {
            check_submit();
        }
        lock = false;
    }

    const BindCustomButton = async () => {
        var check_user = false;
        var bind_context_menu = false;
        var bind_quickorder = false;
        var bind_utils = false;
        var bind_popup = false;

        var new_style = document.createElement('style');
        new_style.innerHTML = '.font-cht { font-family: "Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","HeitiSC","WenQuanYi Micro Hei",sans-serif; }';
        document.head.appendChild(new_style);

        while (true) {
            // 自動新增使用者
            if (!check_user) {
                var user_btn = document.getElementsByClassName('btnCP user')[0];
                if (user_btn) {
                    var name = user_btn.firstElementChild.textContent;
                    var id = user_btn.firstElementChild.nextSibling.dataset.userId;
                    var auth = await cookieStore.get('.ASPXAUTH').then(c => { if (c) return c.value; });
                    var dt = new Date(Date.now());
                    if (auth) {
                        var users = GM_getValue("users", []);
                        var found = false;
                        for (var i = 0; i < users.length; i++) {
                            if (users[i].name.indexOf(id) !== -1) {
                                users[i].name = `${id} ${name} (${dt.toLocaleString()})`;
                                users[i].auth = auth;
                                found = true;
                            }
                        }
                        if (!found) {
                            users.push({ 'name': `${id} ${name} (${dt.toLocaleString()})`, 'auth': auth });
                        }
                        GM_setValue("users", users);
                    }
                } else {
                    console.error('no user login');
                }
                check_user = true;
            }
            if (!bind_context_menu) {
                $.contextMenu({
                    selector: '#container',
                    items: {
                        "address": { name: "設定貨運行", icon: "edit", callback: AddressConfigure },
                        "creditcard": { name: "設定信用卡", icon: "edit", callback: CreditCardConfigure },
                        "switchuser": { name: "切換使用者", icon: "copy", callback: SwitchUser },
                    }
                });
                bind_context_menu = true;
            }
            // 綁定快速結帳按鈕
            if (!bind_quickorder && $("#aQuickOrder1").length) {
                $("#aQuickOrder1").bind("click", Main);
                bind_quickorder = true;
            }
            if (!bind_utils && $(".utils-list").length) {
                $(".utils-list").append('<li><a href="#" id="utils-switchuser" class="font-cht">切換使用者</a></li>');
                $("#utils-switchuser").bind("click", SwitchUser);
                $(".utils-list").append('<li><a href="#" id="utils-creditcard" class="font-cht">設定信用卡</a></li>');
                $("#utils-creditcard").bind("click", CreditCardConfigure);
                $(".utils-list").append('<li><a href="#" id="utils-address" class="font-cht">設定貨運行</a></li>');
                $("#utils-address").bind("click", AddressConfigure);
                bind_utils = true;
            }
            if (!bind_popup && $(".area-btn-popup").length) {
                $(".area-btn-popup").append('<a id="popup-address" class="btn-popup font-cht" style="height:120px">設定貨運行</a>');
                $("#popup-address").bind("click", AddressConfigure);
                $(".area-btn-popup").append('<a id="popup-creditcard" class="btn-popup font-cht" style="height:120px">設定信用卡</a>');
                $("#popup-creditcard").bind("click", CreditCardConfigure);
                $(".area-btn-popup").append('<a id="popup-switchuser" class="btn-popup font-cht" style="height:120px">切換使用者</a>');
                $("#popup-switchuser").bind("click", SwitchUser);
                $('.area-btn-popup')[0].style.setProperty('top', '8em')
                bind_popup = true;
            } else if (!$(".area-btn-popup").length) {
                var footer = document.getElementById('footer');
                var div = document.createElement('div');
                div.classList.add('area-btn-popup');
                footer.parentElement.insertBefore(div, footer.nextSibling);
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

        // 預設虛擬帳號付款
        await UseVirtualAccount();

        $("#chkAgree").click(); await delay(50);
        $("#chkEduAgree").click(); await delay(50);

        // 添加付款方式 (虛擬帳號-信用卡)
        $(".priceView").append(`<p class="pbLink" id="payMethod">
        <button id="payCreditCard" class="btnWrite3 mcolor fs19 pl10r45 w166 font-cht" style="color:#663399">虛擬帳號</button>
        <button id="payVirtualAccount" class="btnBlue3 fs19 pl12r45 w166 font-cht" style="background:#663399">信用卡</button>`);
        $("#paymentBtnArea").css("margin", "60px 0 0 0");
        $("#payCreditCard").bind("click", UseVirtualAccount);
        $("#payVirtualAccount").bind("click", UseCreditCard);
    }

    // 虛擬帳號付款
    const UseVirtualAccount = async () => {
        $("#settleGubun2").prop("type", "radio"); await delay(50);
        $("#settleGubun2").prop('disabled', false); await delay(50);
        $("#settleGubun2").show(); await delay(50);
        $("#settleGubun2_input").show(); await delay(50);

        document.getElementById("paymentRadio4").click(); await delay(200);
        document.getElementById("settleGubun2_input").click(); await delay(200);

        $("#sBank").val(bank_id).change(); await delay(50);
        $("#tVirCellPhone2").val(cellphone2); await delay(50);
        $("#tVirCellPhone3").val(cellphone3); await delay(50);

        document.getElementsByClassName("conts_pay")[0].scrollIntoView(false);
    }

    // 信用卡付款
    const UseCreditCard = async () => {
        $("#settleGubun4").prop("type", "radio"); await delay(50);
        $("#settleGubun4").prop('disabled', false); await delay(50);
        $("#settleGubun4").show(); await delay(50);
        $("#settleGubun4_input").show(); await delay(50);

        document.getElementById("paymentRadio3").click(); await delay(200);
        document.getElementById("settleGubun4_input").click(); await delay(200);
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

    // 設定信用卡
    const CreditCardConfigure = async () => {
        await Swal.fire({
            title: '設定信用卡資料',
            confirmButtonText: '儲存',
            width: '50em',
            html: `
            卡號前 4 碼:<input id="swal2-card_no1" class="swal2-input font-cht" value="${card_no1}" style="width:5em" required>
            卡號後 4 碼:<input id="swal2-card_no4" class="swal2-input font-cht" value="${card_no4}" style="width:5em" required><br>
            持有人: <input id="swal2-card_owner" class="swal2-input font-cht" value="${card_owner}" style="width:12em" required>
            檢查碼:<input id="swal2-card_check" class="swal2-input font-cht" value="${card_check}" style="width:5em" required>`,
            focusConfirm: false,
            preConfirm: () => {
                card_no1 = document.getElementById('swal2-card_no1').value;
                card_no4 = document.getElementById('swal2-card_no4').value;
                card_check = document.getElementById('swal2-card_check').value;
                card_owner = document.getElementById('swal2-card_owner').value;
                if (card_no1 && card_no4 && card_check && card_owner) {
                    GM_setValue("card_no1", card_no1);
                    GM_setValue("card_no4", card_no4);
                    GM_setValue("card_check", card_check);
                    GM_setValue("card_owner", card_owner);
                    Swal.fire('資料已儲存!', '', 'success');
                } else {
                    Swal.showValidationMessage('所有欄位需填入正確資料');
                }
            }
        })
    }

    // 切換使用者
    const SwitchUser = async () => {
        await Swal.fire({
            title: '使用者',
            width: '40em',
            showConfirmButton: false,
            html: `
            <button type="button" id="swal2-switchuser-clear" class="swal2-cancel swal2-styled font-cht">清除所有使用者</button><br><br>
            <p id="swal2-switchuser-user" class="font-cht" style="font-size:1.5em;color:#30a0c0"></p><br>
            <p class="font-cht" style="color:#06b872">Cookie 有效期限為一個小時</p>
            <select id="swal2-switchuser-userid" class="swal2-select font-cht" style="width:24em;min-width:10%"></select>
            `,
            didOpen: async () => {
                var btn_clear = document.getElementById('swal2-switchuser-clear');
                var select_userid = document.getElementById('swal2-switchuser-userid');

                btn_clear.addEventListener("click", async () => {
                    GM_setValue("users", []);
                    await cookieStore.getAll().then(i => i.forEach(async c => await cookieStore.set({ name: c.name, value: null, path: c.path, domain: c.domain, expires: 0 })));
                    unsafeWindow.location.reload();
                });

                select_userid.addEventListener("change", async () => {
                    var auth = document.getElementById('swal2-switchuser-userid').value;
                    if (auth) {
                        await cookieStore.getAll().then(i => i.forEach(async c => await cookieStore.set({ name: c.name, value: null, path: c.path, domain: c.domain, expires: 0 })));
                        await cookieStore.set({ name: '.ASPXAUTH', value: auth, expires: Date.now() + 60 * 60 * 1000 });
                        await cookieStore.set({ name: 'mainNotictPopupView', value: 'done' });
                        unsafeWindow.location.reload();
                    }
                });

                var user_btn = document.getElementsByClassName('btnCP user')[0];
                if (user_btn) {
                    var name = user_btn.firstElementChild.textContent;
                    var id = user_btn.firstElementChild.nextSibling.dataset.userId;
                    document.getElementById('swal2-switchuser-user').innerText = `目前登入: ${name} (${id})`;
                }

                select_userid.appendChild(document.createElement('option'));
                var users = GM_getValue("users", []);
                for (var i = 0; i < users.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = users[i].auth;
                    opt.className = 'font-cht';
                    opt.innerHTML = users[i].name;
                    select_userid.appendChild(opt);
                }
                var auth = await cookieStore.get('.ASPXAUTH').then(c => { if (c) return c.value; });
                if (!auth) {
                    Swal.showValidationMessage('Cookie: \'.ASPXAUTH\' 不存在，或為 HTTPOnly 屬性<br>請先登出或登入使用者，否則將無法切換使用者');
                }

                $("#swal2-switchuser-userid").focus()
            }
        })
    }

    BindCustomButton();
    Main();
})();