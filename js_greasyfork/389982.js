// ==UserScript==
// @name         微博手机端网页跳转PC端
// @name:zh      微博手机端网页跳转PC端
// @name:en      WeiboPcGo
// @version      0.1
// @description  jump weibo photo page to weibo pc page.
// @description:zh  jump weibo photo page to weibo pc page.
// @description:en  jump weibo photo page to weibo pc page.
// @author       Jeffrey.deng
// @supportURL   https://imcoder.site/u/center/sendLetter?chatuid=1016726508048
// @match        https://m.weibo.cn/detail/*
// @match        https://m.weibo.cn/status/*
// @grant        none
// @namespace https://greasyfork.org/users/129338
// @downloadURL https://update.greasyfork.org/scripts/389982/%E5%BE%AE%E5%8D%9A%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%BD%91%E9%A1%B5%E8%B7%B3%E8%BD%ACPC%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/389982/%E5%BE%AE%E5%8D%9A%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%BD%91%E9%A1%B5%E8%B7%B3%E8%BD%ACPC%E7%AB%AF.meta.js
// ==/UserScript==

// @blog        https://imcoder.site

(function() {
    'use strict';

    var WeiboUtil = {
        // 62进制字典
        str62keys: [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
        ],
    };

    /**
     * 62进制值转换为10进制
     * @param {String} str62 62进制值
     * @return {String} 10进制值
     */
    WeiboUtil.str62to10 = function(str62) {
        var i10 = 0;
        for (var i = 0; i < str62.length; i++)
        {
            var n = str62.length - i - 1;
            var s = str62[i];
            i10 += this.str62keys.indexOf(s) * Math.pow(62, n);
        }
        return i10;
    };

    /**
     * 10进制值转换为62进制
     * @param {String} int10 10进制值
     * @return {String} 62进制值
     */
    WeiboUtil.int10to62 = function(int10) {
        var s62 = '';
        var r = 0;
        while (int10 != 0 && s62.length < 100) {
            r = int10 % 62;
            s62 = this.str62keys[r] + s62;
            int10 = Math.floor(int10 / 62);
        }
        return s62;
    };

    /**
     * URL字符转换为mid
     * @param {String} url 微博URL字符，如 "wr4mOFqpbO"
     * @return {String} 微博mid，如 "201110410216293360"
     */
    WeiboUtil.url2mid = function(url) {
        var mid = '';

        for (var i = url.length - 4; i > -4; i = i - 4) //从最后往前以4字节为一组读取URL字符
        {
            var offset1 = i < 0 ? 0 : i;
            var offset2 = i + 4;
            var str = url.substring(offset1, offset2);

            str = this.str62to10(str);
            if (offset1 > 0) { //若不是第一组，则不足7位补0
                while (str.length < 7)
                {
                    str = '0' + str;
                }
            }

            mid = str + mid;
        }

        return mid;
    };

    /**
     * mid转换为URL字符
     * @param {String} mid 微博mid，如 "201110410216293360"
     * @return {String} 微博URL字符，如 "wr4mOFqpbO"
     */
    WeiboUtil.mid2url = function(mid) {
        if(!mid) {
            return mid;
        }
        mid = String(mid); //mid数值较大，必须为字符串！
        if(!/^\d+$/.test(mid)){ return mid; }
        var url = '';

        for (var i = mid.length - 7; i > -7; i = i - 7) //从最后往前以7字节为一组读取mid
        {
            var offset1 = i < 0 ? 0 : i;
            var offset2 = i + 7;
            var num = mid.substring(offset1, offset2);

            num = this.int10to62(num);
            url = num + url;
        }

        return url;
    };

    try {
        const html = document.documentElement.innerHTML
        const mid = html.match(/"mid":\s"(.*?)"/)[1]
        const uid = html.match(/https:\/\/m\.weibo\.cn\/u\/(.*?)\?/)[1];
        var id = "";
        if (document.location.href.match(/^.*m\.weibo\.cn\/(status|detail)\/(\w+)\??.*$/i) && !/^\d+$/.test(RegExp.$2)) {
            id = RegExp.$2;
        } else {
            id = WeiboUtil.mid2url(mid);
        }
        const href = `https://weibo.com/${uid}/${id}`
        const div = document.createElement('div')
        div.innerHTML = `<a style="z-index:999;border-radius:25px;font-size:14px;position:fixed;top:15px;right:25px;padding:15px 25px;background-color:#222;color:#fff;text-align:center;" href="${href}">跳转 PC 版本</a>`
        document.body.appendChild(div)
    } catch (e) {
        console.log('[WeiboPcGo] 解析 id 失败', e)
    }
})();