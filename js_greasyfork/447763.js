// ==UserScript==
// @name         徐工院webvpn跳转
// @namespace    https://github.com/023se/webvpn-convert-xzit/
// @version      0.1
// @description  网址转换小工具，将普通网页通过徐工院的webvpn打开，或者将通过徐工院webvpn打开的网页变为普通网页
// @author       023se
// @match        *://*/*
// @icon         http://www.xzit.edu.cn/_upload/tpl/02/73/627/template627/images/16.ico

// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/core.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/enc-base64.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/md5.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/evpkdf.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/cipher-core.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/aes.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/pad-pkcs7.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/mode-ecb.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/enc-utf8.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/enc-hex.min.js

// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/447763/%E5%BE%90%E5%B7%A5%E9%99%A2webvpn%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/447763/%E5%BE%90%E5%B7%A5%E9%99%A2webvpn%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let hop = function (target = '') {
    } //跳转函数
    let hint = ''; //提示信息
    let baseUrl = "https://webvpn.xzit.edu.cn:10443/"

    let key = CryptoJS.enc.Utf8.parse("CASB2021EnLink!!");//秘钥,Utf8字节数组
    let iv = CryptoJS.enc.Utf8.parse("CASB2021EnLink!!");

    function encrypt(url) {
        // 加密
        let urlData = CryptoJS.enc.Utf8.parse(url);
        let encrypted = CryptoJS.AES.encrypt(urlData, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        let resultUrl = encrypted.ciphertext.toString();//加密后的数据
        return resultUrl
    }

    function decrypt(path) {
        let pathList = path.split('/')
        let protocol = pathList[1]
        let encryptUrl = pathList[2].replace('webvpn', '')

        let encryptedHexStr = CryptoJS.enc.Hex.parse(encryptUrl);
        let urlData = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        var decrypted = CryptoJS.AES.decrypt(urlData, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);//解密后的数据
        let host = decryptedStr.toString();
        let rawPathname = pathList.slice(3).join('/')
        let rawUrl = `${protocol}://${host}/${rawPathname}`
        return rawUrl
    }

    if (window.location.host === "webvpn.xzit.edu.cn") {
        hint = '本页面无法进行跳转'
        hop = function (target = '') {
        }
    } else if (window.location.host === "webvpn.xzit.edu.cn:10443") {
        hint = '不通过徐工院webvpn打开'
        hop = function (target) {
            let decryptUrl = decrypt(window.location.pathname)

            let rawUrl = window.location.href.replace(
                `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
                decryptUrl
            )
            window.open(rawUrl, target);
        }
    } else {
        hint = '通过徐工院webvpn打开'
        hop = function (target) {
            let encryptUrl = encrypt(window.location.host)
            let vpnUrl = baseUrl + window.location.href.replace('://', '/').replace(window.location.host, `webvpn${encryptUrl}`)
            window.open(vpnUrl, target);
        }
    }
    GM_registerMenuCommand(`${hint}（当前窗口）`, () => {
        hop("_self") //'_self' '_blank' 可选
    });
    GM_registerMenuCommand(`${hint}（新窗口）`, () => {
        hop("_blank") //'_self' '_blank' 可选
    });
})();