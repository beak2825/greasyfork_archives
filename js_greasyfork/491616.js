// ==UserScript==
// @name         pwdhash
// @namespace    http://tampermonkey.net/
// @version      2024-04-04
// @description  根据域名对密码哈希
// @author       borstan
// @match        http*://*/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/artDialog/7.0.0/dialog.js
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/491616/pwdhash.user.js
// @updateURL https://update.greasyfork.org/scripts/491616/pwdhash.meta.js
// ==/UserScript==

// 将本内容直接复制粘贴到油猴中即可使用.
(function () {
    'use strict';
    // 目标日期(yyyy,mth,dd,hh,mm,ss)，月份从0开始[0,11]，手动修改为实际日期即可
    let hostname = getHost();
    var chrsz = 8;
    var b64pad = "";
    // 缓存记住密码的key
    const cacheKeyNameForPwd = "pwh_rememberPwd";

    /**
    * 自定义设置菜单功能
    */
    function customSetting() {
        // 如果已经弹出了，则直接跳过，不再重复弹出
        if ($("#pwh_dialog_div").length > 0) {
            return;
        }
        let contentHtml = "<div id='pwh_dialog_div'>\n" +
            "    <p>密码：<input type='text' maxlength=60 id='pwh_target_name'/>\n" +
            "    <p>哈希后密码：<input type='text' id='pwh_target_pwd'/></p>\n" +
            "</div>";
        let pwh_dialog = dialog({
            title: 'pwdHash',
            quickClose: true, // 点击空白处快速关闭
            fixed: true,
            content: contentHtml
        });
        // 缓存有值时，进行回写
        if (GM_getValue(cacheKeyNameForPwd)) {
            $("#pwh_target_name").val(GM_getValue(cacheKeyNameForPwd));
        }
        
        // 弹框
        pwh_dialog.show();

        // 获取倒计时名称
        $("#pwh_target_name").on("blur", function () {
            if ($(this).val() && $(this).val().trim().length > 0) {
                // 将用户设置的倒计时名称缓存起来，下次打开浏览器，以及新开其它页面都能看到最新设置的值。
                GM_setValue(cacheKeyNameForPwd, $(this).val().trim());
                $("#pwh_target_pwd").val(getHashedPassword($(this).val().trim(), hostname));
            }
        })
    }


    // 获取[展示位置]
    $("input[name='pwh_show_position']").on("change", function () {
        console.log($(this).val());
    });




    //获取域名
    function getHost() {
        var domain = window.location.hostname//先获取当前访问的全域名
        return domain;
    }


    function getHashedPassword(password, realm) {
        var hash = b64_hmac_md5(password, realm);
        var size = 15;
        var nonalphanumeric = password.match(/\W/) == null;
        var result = applyConstraints(hash, size, nonalphanumeric);
        return result;
    }

    function applyConstraints(hash, size, nonalphanumeric) {
        var startingSize = size - 4;  // Leave room for some extra characters
        var result = hash.substring(0, startingSize);
        var extras = hash.substring(startingSize).split('');

        function nextExtra() { return extras.length ? extras.shift().charCodeAt(0) : 0; }
        function nextExtraChar() { return String.fromCharCode(nextExtra()); }
        function between(min, interval, offset) { return min + offset % interval; }
        function nextBetween(base, interval) {
            return String.fromCharCode(between(base.charCodeAt(0), interval, nextExtra()));
        }
        function contains(regex) { return result.match(regex); }
        // Add the extra characters
        result += (contains(/[A-Z]/) ? nextExtraChar() : nextBetween('A', 26));
        result += (contains(/[a-z]/) ? nextExtraChar() : nextBetween('a', 26));
        result += (contains(/[0-9]/) ? nextExtraChar() : nextBetween('0', 10));
        result += (contains(/\W/) && nonalphanumeric ? nextExtraChar() : '+');
        while (contains(/\W/) && !nonalphanumeric) {
            result = result.replace(/\W/, nextBetween('A', 26));
        }

        // Rotate the result to make it harder to guess the inserted locations
        result = result.split('');
        return result.join('');
    }




    function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
    function binl2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
                | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
                | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }
    function core_hmac_md5(key, data) {
        var bkey = str2binl(key);
        if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    }
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }
    function core_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);

    }
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    $(function () {
        // 页面不是被其它页面 iframe 嵌入时才进行添加
        if (self == top) {
            // 自定义功能菜单
            GM_registerMenuCommand("开始使用pwdHash", customSetting);
        }
    });



})();