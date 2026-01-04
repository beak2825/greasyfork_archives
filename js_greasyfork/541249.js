// ==UserScript==
// @name              Qimao
// @version           2.0.+n.3
// @description       Qimao Novel Reading
// @author            Me
// @match             https://api-bc.wtzw.com/*
// @match             https://www.qimao.com/*
// @require           https://greasyfork.org/scripts/479459-cryptojs/code/CryptoJS-.js?version=1277994
// @require           https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license           MIT
// @grant             GM_xmlhttpRequest
// @grant             GM_addStyle
// @namespace https://greasyfork.org/users/682326
// @downloadURL https://update.greasyfork.org/scripts/541249/Qimao.user.js
// @updateURL https://update.greasyfork.org/scripts/541249/Qimao.meta.js
// ==/UserScript==

(function() {
    // Helper functions for MD5 hash
    var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return lResult ^ lX8 ^ lY8;
        }
    };

    var F = function(x, y, z) { return (x & y) | ((~x) & z); };
    var G = function(x, y, z) { return (x & z) | (y & (~z)); };
    var H = function(x, y, z) { return (x ^ y ^ z); };
    var I = function(x, y, z) { return (y ^ (x | (~z))); };

    var FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWordsTempOne = lMessageLength + 8;
        var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
        var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function(lValue) {
        var WordToHexValue = "",
            WordToHexValueTemp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };

    var uTF8Encode = function(string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    function md5(string) {
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        string = uTF8Encode(string);
        x = convertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }
        var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        return tempValue.toLowerCase();
    }

    async function decode(response) {
        let $ = response;
        let txt = CryptoJS.enc.Base64.parse($.data.content).toString();
        let iv = txt.slice(0, 32);
        let _content = await decrypt(txt.slice(32), iv).trim().replace(/\n/g, '<br>');
        return await _content;
    }

    const decrypt = function(data, iv) {
        let key = CryptoJS.enc.Hex.parse('32343263636238323330643730396531');
        iv = CryptoJS.enc.Hex.parse(iv);
        let HexStr = CryptoJS.enc.Hex.parse(data);
        let Base64Str = CryptoJS.enc.Base64.stringify(HexStr);
        let decrypted = CryptoJS.AES.decrypt(Base64Str, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    async function novel(murl, func) {
        const matchb = murl.match(/https:\/\/www\.qimao\.com\/shuku\/([0-9_]+)-([0-9]+)\//);
        const toparams = obj => Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');
        const sign_key = 'd3dGiJc651gSQ8w1';

        const params = {
            id: matchb[1],
            chapterId: matchb[2]
        };
        const paramSign = md5(Object.keys(params).sort().reduce((pre, n) => pre + n + '=' + params[n], '') + sign_key);
        params['sign'] = paramSign;

        const headers = {
            "app-version": "51110",
            "platform": "android",
            "reg": "0",
            "AUTHORIZATION": "",
            "application-id": "com.****.reader",
            "net-env": "1",
            "channel": "unknown",
            "qm-params": ""
        };
        const headersSign = md5(Object.keys(headers).sort().reduce((pre, n) => pre + n + '=' + headers[n], '') + sign_key);
        headers['sign'] = headersSign;

        const url = "https://api-ks.wtzw.com/api/v1/chapter/content?" + toparams(params);

        console.log(url, headers);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: headers,
                onload: async function(response) {
                    const data = JSON.parse(response.responseText);
                    const get = (await decode(data)).replace(/<br>/g, '\n');
                    await func(get);
                    resolve();
                },
                ontimeout: async function() {
                    return await func(murl, func = func);
                },
                onerror: async function(response) {
                    func('err');
                    throw new Error(JSON.stringify(response));
                    reject();
                }
            });
        });
    }

    const murl = window.location.href;

    const mode =
          /https:\/\/www\.qimao\.com\/shuku\/([0-9_]+)-([0-9]+)\//.test(murl) ? 'reader' :
    /https:\/\/www\.qimao\.com\/shuku\/([0-9_]+)\//.test(murl) ? 'page' : null;

    switch (mode) {
        case 'reader':
            GM_addStyle(`
                .reader-fixed-left li.go-back[data-v-b5fc2672] {
                    border-radius: 5px !important;
                    background-color: #f1e5af36 !important;
                }
                .reader-layout-theme[data-theme=default] .reader-fixed-left li.reader-guide[data-v-b5fc2672] {
                    margin-top: 0px !important;
                    background-color: #f1e5af36 !important;
                }
                .reader-header-con {
                    display: none !important;
                }
                #__layout div div.wrapper.reader.reader-layout-theme div.reader-header div.reader-header-con {
                    display: none !important;
                }
                .qm-fixed-right-item click reader-phone {
                    display: none !important;
                }
                .s-tit {
                    display: none !important;
                }
                .chapter-tips > * {
                    color: #66666647 !important;
                    text-align: left !important;
                }
                .chapter-title {
                    text-align: left !important;
                }
                .chapter-detail-wrap-info {
                    border-bottom: 1px solid #ddd !important;
                }
                .qm-fixed-right-link {
                    width: fit-content !important;
                }
                .qm-fixed-right.type-3 .qm-fixed-right-link[data-v-754474f8]:before {
                    width: 8px !important;
                }
                .qm-fixed-right[data-v-754474f8] {
                    left: 51% !important;
                }
                .i-arrow {
                    border-radius: 5px;
                }
                .reader-setting, .book-catalog {
                    border-radius: 10px !important;
                    outline: 2px solid #0000000a;
                }
                .reader-login-code {
                    display: none !important;
                }
                .show-part[data-v-10da8d56]:after {
                    display: none !important;
                }
                .chapter-detail-article p {
                    font-size: 18px;
                    text-indent: 2em;
                    line-height: 1.8;
                    padding: 13px 0;
                    user-select: text;
                }
                .article {
                    user-select: text;
                }
                body {
                    user-select: text;
                }
            `);
            novel(murl, func = (get) => {
                if (get === 'err') return;
                document.getElementsByClassName('chapter-detail-article')[0].innerHTML = '<p>' + get.replace(/\n/g, "</p><p>") + '</p>';
            });
            break;

        case 'page':
            async function startdownload() {
                GM_addStyle(`
        .tab-inner {
            display: none !important;
        }
    `);
                document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-body > div > div.qm-tab.type-2.normal > ul > li:nth-child(1) > div").click();
                await new Promise(resolve => setTimeout(resolve, 120));

                var content = '使用七猫全文在线免费读下载\n' +
                    ['title', 'tags-wrap', 'sub-title', 'statistics-wrap', 'update-info', 'book-introduction-item']
                .map(e => document.getElementsByClassName(e)[0].textContent + '\n')
                .join()
                .replace(/\n\s*(?!0\b)/g, '')
                .replace(/,/g, '\n');

                for (const e of ['title', 'tags-wrap', 'sub-title', 'statistics-wrap', 'update-info', 'book-introduction-item']) {
                    document.getElementsByClassName(e)[0].classList.add('succeed');
                    await new Promise(resolve => setTimeout(resolve, 120));
                }

                document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-body > div > div.qm-tab.type-2.normal > ul > li:nth-child(2) > div").click();
                await new Promise(resolve => setTimeout(resolve, 120));

                const elements = document.getElementsByClassName('qm-book-catalog-list-content')[0].children;

                let a, span;
                let startChapter = prompt("Nhập tên chương bạn muốn bắt đầu tải từ:", "1");
                let start = false;

                for (var i = 0; i < elements.length; i++) {
                    a = elements[i].querySelector('a');
                    span = a.querySelector('.txt');

                    // Kiểm tra nếu đã đến chương bắt đầu
                    if (span.innerText.includes(startChapter)) {
                        start = true;
                    }

                    // Nếu chưa đến chương bắt đầu, bỏ qua
                    if (!start) {
                        continue;
                    }

                    span.classList.add('processing');
                    content += '\n\n' + span.innerText + '\n';

                    await novel(a.href, func = (c) => {
                        span.classList.remove('processing');
                        if (c === 'err') {
                            span.classList.add('err');
                            content += '\nChương tiết sai lầm\n';
                        }
                        span.classList.add('succeed');
                        content += c;
                    });
                }

                const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                saveAs(blob, document.getElementsByClassName('title')[0].querySelector('span').innerText + ".txt");
            }


            GM_addStyle(`
                #__layout > div > div.wrapper > div > div > div > div.book-detail-header > div > div.book-information.clearfix.left > div.wrap-txt > div.btns-wrap.clearfix > div > div.qm-popper-title > span {
                    display: none !important;
                }
                .err {
                    background-color: pink;
                }
                .succeed {
                    background-color: #D2F9D1;
                    border-radius: 5px;
                }
                .processing {
                    background-color: navajowhite;
                    border-radius: 5px;
                }
                .qm-book-catalog-list-content li {
                    line-height: normal !important;
                    padding: 18px;
                }
                .qm-book-catalog-list-content li .txt {
                    width: auto !important;
                }
                .qm-book-catalog-list-content li .vip-icon {
                    float: right !important;
                    margin-top: 0px !important;
                }
            `);

            const menu = document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-header > div > div.book-information.clearfix.left > div.wrap-txt > div.btns-wrap.clearfix");
            const copy = document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-header > div > div.book-information.clearfix.left > div.wrap-txt > div.btns-wrap.clearfix > a.qm-btn.item.inline-block.default.large.radius");
            const btn = copy.cloneNode(true);
            menu.insertBefore(btn, copy.nextSibling);
            btn.innerText = 'Tải Text';
            btn.addEventListener('click', startdownload);
            break;
    }
})();
