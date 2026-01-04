// ==UserScript==
// @name         HentaiCookie2QRCode
// @name:zh-CN   E站Cookie二维码生成器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert your e(x)hentai cookie to QRCode.
// @description:zh-cn  将E站Cookie转换为二维码。
// @author       pboymt
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js
// @require      https://cdn.jsdelivr.net/npm/qrcode_js@1.0.0/qrcode.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/394585/HentaiCookie2QRCode.user.js
// @updateURL https://update.greasyfork.org/scripts/394585/HentaiCookie2QRCode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    GM_addStyle('#login_qrcode img { width: 100%; height: 100% }');

    let openQRCode = false;

    const ipb_member_id = Cookies.get("ipb_member_id") || '';
    const ipb_pass_hash = Cookies.get("ipb_pass_hash") || '';
    const igneous = Cookies.get("igneous") || '';

    const floatMenu = document.createElement('div');
    const floatButton = document.createElement('div');
    const floatQRCode = document.createElement('div');

    floatMenu.style.display = 'flex';
    floatMenu.style.flexDirection = 'row';
    floatMenu.style.position = 'fixed';
    floatMenu.style.right = '0';
    floatMenu.style.bottom = '10%';
    floatMenu.style.justifyContent = 'flex-end';
    floatMenu.style.zIndex = '9999';
    floatMenu.style.transform = 'translateX(8rem)';
    floatMenu.style.transitionDuration = '.3s';

    floatButton.style.display = 'flex';
    floatButton.style.flex = 'none';
    floatButton.style.width = '1rem';
    floatButton.style.height = '8rem';
    floatButton.style.backgroundColor = 'rgba(255,255,255,0.2)';
    floatButton.style.border = '#555 solid 1px';
    floatButton.style.borderRight = 'none';
    floatButton.style.textAlign = 'center';
    floatButton.style.alignItems = 'center';
    floatButton.style.justifyContent = 'center';
    floatButton.innerText = '<';

    floatQRCode.id = 'login_qrcode';
    floatQRCode.style.display = 'flex';
    floatQRCode.style.position = 'relative';
    floatQRCode.style.flex = 'none';
    floatQRCode.style.height = '8rem';
    floatQRCode.style.width = '8rem';
    floatQRCode.style.overflow = 'hidden';
    floatQRCode.style.backgroundColor = 'rgba(255,255,255,0.2)';
    floatQRCode.style.borderTop = '#555 solid 1px';
    floatQRCode.style.borderBottom = '#555 solid 1px';


    floatMenu.appendChild(floatButton);
    floatMenu.appendChild(floatQRCode);

    document.body.appendChild(floatMenu);

    floatMenu.addEventListener('click', () => {
        openQRCode = !openQRCode;
        if (openQRCode) {
            floatButton.innerText = '>';
            floatMenu.style.transform = 'translateX(0)';
        } else {
            floatButton.innerText = '<';
            floatMenu.style.transform = 'translateX(8rem)';
        }
    });

    new QRCode(floatQRCode, {
        text: JSON.stringify({
            ipb_member_id,
            ipb_pass_hash,
            igneous
        }),
        width: 256,
        height: 256
    });


})();
