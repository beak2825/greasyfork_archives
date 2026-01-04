// ==UserScript==
// @name         完善供应商
// @namespace    http://tampermonkey.net/
// @version      2024-10-24
// @description  try to take over the world!
// @author       OLAF
// @match         *://*/*
// @exclude      http://*fromways*
// @exclude      https://*fromways*
// @exclude      http://*gys.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/513510/%E5%AE%8C%E5%96%84%E4%BE%9B%E5%BA%94%E5%95%86.user.js
// @updateURL https://update.greasyfork.org/scripts/513510/%E5%AE%8C%E5%96%84%E4%BE%9B%E5%BA%94%E5%95%86.meta.js
// ==/UserScript==

(function() {

'use strict';

window.addEventListener("load", function () {
const supplierFormHTML = `
<div id="supplier_content"
     style="position: fixed;right: 10px;top:15%;border-radius: 12px;background-color: #ffffff;padding: 16px;z-index: 99999;--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);
    --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);">

    <div id="supplier_more" style="font-size:16px;width: 32px;height: 32px;background-color: #93c5fd;border-radius: 50%;justify-content:center;align-items:center;color: #ffffff;cursor: pointer;display: none"> <</div>

    <form name="supplier_info_form" style="width: 450px;">

        <div style="margin-bottom: 20px;justify-content:space-between;align-items: center;display: flex">
            <h1 style="font-weight: 600; font-size: 24px;line-height: 24px;">
                完善供应商信息</h1>
            <div id="supplier_less" style="font-size:16px;width: 32px;height: 32px;background-color: #93c5fd;border-radius: 50%;display: flex;justify-content:center;align-items:center;color: #ffffff;cursor: pointer">>
            </div>
        </div>


        <label style="display: block;margin-bottom: 8px;">
                <textarea rows="3" name="supplier_main_product" placeholder="主营产品"
                          style="height:auto; width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></textarea>
        </label>

        <label style="display: block;margin-bottom: 8px;">
                <textarea rows="2" name="supplier_description" placeholder="1. 公司背景：介绍公司成立时间、地点、行业和历史发展"
                          style="height:auto;width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></textarea>
        </label>
        <label style="display: block;margin-bottom: 8px;">
                <textarea rows="2" name="supplier_products_services" placeholder="2. 产品与服务：主要产品或服务类型及其应用领域，突出其特色和优势"
                          style="height:auto;width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></textarea>
        </label>
        <label style="display: block;margin-bottom: 8px;">
                <textarea rows="2" name="supplier_market" placeholder="3. 市场定位：说明目标市场和客户群体，以及与竞争对手的区别"
                          style="height:auto;width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></textarea>
        </label>
        <label style="display: block;margin-bottom: 8px;">
                <textarea rows="2" name="supplier_compete" placeholder="4. 核心竞争力：强调公司的技术实力、专业团队、行业经验等"
                          style="height:auto;width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></textarea>
        </label>

        <label style="display: block;margin-bottom: 8px;">
                <textarea rows="2" name="supplier_quality" placeholder="5. 证书与荣誉: 列出行业认证、奖项等，提升可信度"
                          style="height:auto;width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></textarea>
        </label>

        <label style="display: block;margin-bottom: 8px;">
            <input name="supplier_phone" placeholder="手机号码" type="tel"
                   style="width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></input>
        </label>

        <label style="display: block;margin-bottom: 8px;">
            <input name="supplier_email" placeholder="邮箱" type="email"
                   style="width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></input>
        </label>

        <label style="display: block;margin-bottom: 8px;">
            <input name="supplier_website" placeholder="网址" type="text"
                   style="width: 100%; border: 1px solid #cbd5e1; border-radius:6px;padding:10px;appearance: none;letter-spacing: .025em;outline: 2px solid transparent;outline-offset: 2px;"></input>
        </label>

        <label style="display: block;">
            <span id="supplier_tip" style="font-size: 12px;margin-bottom: 8px;"></span>
        </label>

        <button style="margin-top:8px;background-color:#005BFF;color:#ffffff;display: inline-flex;cursor: pointer;align-items: center;justify-content: center;border-radius: 6px;padding: 6px 12px;text-align: center;
    letter-spacing: .025em;border: 1px solid white">
            提交
        </button>
    </form>
</div>
`


$('body').append(supplierFormHTML);

console.log("hello world")

$(document).on('click', '#supplier_less', function () {
$("#supplier_more").css('display', 'flex')
$("form[name='supplier_info_form']").css('display', 'none')
})
$(document).on('click', '#supplier_more', function () {
$("#supplier_more").css('display', 'none')
$("form[name='supplier_info_form']").css('display', 'block')
})

let cookie_prefix = window.location.hostname

$("textarea[name='supplier_main_product']").val($.cookie(cookie_prefix + 'main_product') || '');
$("textarea[name='supplier_description']").val($.cookie(cookie_prefix + 'description') || '');
$("textarea[name='supplier_products_services']").val($.cookie(cookie_prefix + 'products_services') || '');
$("textarea[name='supplier_market']").val($.cookie(cookie_prefix + 'market') || '');
$("textarea[name='supplier_compete']").val($.cookie(cookie_prefix + 'compete') || '');
$("textarea[name='supplier_quality']").val($.cookie(cookie_prefix + 'quality') || '');
$("input[name='supplier_phone']").val($.cookie(cookie_prefix + 'phone') || '');
$("input[name='supplier_email']").val($.cookie(cookie_prefix + 'email') || '');
$("input[name='supplier_website']").val(window.location.origin)

$(document).on('blur', "textarea[name='supplier_main_product']", function () {
let new_val = get_xpath_text($(this).val().trim())
$(this).val(new_val)
setCookie('main_product', new_val)
})

$(document).on('blur', "textarea[name='supplier_description']", function () {
let new_val = get_xpath_text($(this).val().trim())
$(this).val(new_val)
setCookie('description', new_val)
})

$(document).on('blur', "textarea[name='supplier_products_services']", function () {
let new_val = get_xpath_text($(this).val().trim())
$(this).val(new_val)
setCookie('products_services', new_val)
})

$(document).on('blur', "textarea[name='supplier_market']", function () {
let new_val = get_xpath_text($(this).val().trim())
$(this).val(new_val)
setCookie('market', new_val)
})

$(document).on('blur', "textarea[name='supplier_compete']", function () {
let new_val = get_xpath_text($(this).val().trim())
$(this).val(new_val)
setCookie('compete', new_val)
})

$(document).on('blur', "textarea[name='supplier_quality']", function () {
let new_val = get_xpath_text($(this).val().trim())
$(this).val(new_val)
setCookie('quality', new_val)
})

$(document).on('blur', "input[name='supplier_email']", function () {
let new_val = get_xpath_text($(this).val().trim())
$(this).val(new_val)
setCookie('email', new_val)
})

$(document).on('blur', "input[name='supplier_phone']", function () {
let new_val = get_xpath_text($(this).val().trim())
$(this).val(new_val)
setCookie('phone', new_val)
})


function get_xpath_text(xpath) {
// 判断是否以'/'开头
if (xpath.startsWith('/')) {
let allText = '';
const xpathResult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (let i = 0; i < xpathResult.snapshotLength; i++) {
const node = xpathResult.snapshotItem(i);
allText += node.textContent.trim().replace(/\s+/g, ',') + ' ';
}
return allText;
}
return xpath;
}

function setCookie(key, value) {
const expires = new Date();
expires.setTime(expires.getTime() + 12 * 60 * 60 * 1000);
$.cookie(window.location.hostname + '' + key, value, {path: '/', expires: expires});
}


$(document).on("submit", "form[name='supplier_info_form']", function (n) {
n.preventDefault();

let main_product = $("textarea[name='supplier_main_product']").val()
let description = $("textarea[name='supplier_description']").val()
let products_services = $("textarea[name='supplier_products_services']").val()
let market = $("textarea[name='supplier_market']").val()
let compete = $("textarea[name='supplier_compete']").val()
let quality = $("textarea[name='supplier_quality']").val()
let phone = $("input[name='supplier_phone']").val();
let email = $("input[name='supplier_email']").val();
let website = $("input[name='supplier_website']").val()

GM_xmlhttpRequest({
method: "PUT",
url: "http://www.gys.com/api-supplier",
data: JSON.stringify({
'main_product': main_product,
'description': description,
'products_services':products_services,
'market':market,
'compete':compete,
'quality':quality,
'phone': phone,
'email': email,
'url': website,
}),
headers: {
"Content-Type": "application/json" // 设置请求内容类型为 JSON
},
onload: function (response) {
const data = JSON.parse(response.responseText);
$("#supplier_tip").html(data.msg);
if (data.status) {
$("#supplier_tip").css('color', '#22c55e');
$("textarea[name='supplier_main_product']").val('')
$("textarea[name='supplier_description']").val('')
$("textarea[name='supplier_products_services']").val('')
$("textarea[name='supplier_market']").val('')
$("textarea[name='supplier_compete']").val('')
$("textarea[name='supplier_quality']").val('')
$("input[name='supplier_phone']").val('');
$("input[name='supplier_email']").val('');
$.removeCookie(cookie_prefix + 'main_product', {path: '/'});
$.removeCookie(cookie_prefix + 'description', {path: '/'});
$.removeCookie(cookie_prefix + 'products_services', {path: '/'});
$.removeCookie(cookie_prefix + 'market', {path: '/'});
$.removeCookie(cookie_prefix + 'compete', {path: '/'});
$.removeCookie(cookie_prefix + 'quality', {path: '/'});
$.removeCookie(cookie_prefix + 'email', {path: '/'});
$.removeCookie(cookie_prefix + 'phone', {path: '/'});
} else {
$("#supplier_tip").css('color', '#DC3545');
}
},
onerror: function (error) {
console.error("请求错误:", error);
$("#supplier_tip").html("请求失败，请重试。").css('color', '#DC3545');
}
});


});
})
})();