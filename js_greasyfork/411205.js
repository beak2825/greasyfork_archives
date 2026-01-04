// ==UserScript==
// @name         日剧跑下载链接获取函数
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @include      *
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411205/%E6%97%A5%E5%89%A7%E8%B7%91%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%E5%87%BD%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/411205/%E6%97%A5%E5%89%A7%E8%B7%91%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%E5%87%BD%E6%95%B0.meta.js
// ==/UserScript==

// 貌似@match里只能填写有域名的url...(20-09-11)
(function() {
    'use strict';

    // 避免冲突
    jQuery.noConflict();

    // base64 decode utf8 string 的方法(仅作备忘)：
    // https://www.npmjs.com/package/js-base64#decode-vs-atob-and-encode-vs-btoa-
    // https://stackoverflow.com/a/30106551/1973891
    function b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    // 测试 Base64.decode 方法
    // const s = 'QUFlZDJrOi8vfGZpbGV8W+aooeiMg+enmOS5pl0uW1NVQlBJR11bSGlzaG8ubm8uS2FnYW1pLmVwMDFdLnJtdmJ8MTQ4ODQ1ODg1fGI2ZjYwZjVjMzdjYzlkOWQwMGI5ZGYyYzc2ZjM2ZWVlfC9aWg==';
    // console.log('s12312312313', Base64.decode(s));

    // 处理电驴、磁力、迅雷链接（迅雷链接会转换成真实地址）
    // text_el - 所有链接文字元素
    // text_call - 所有链接文字元素的回调方法
    // url_el - 所有链接元素
    // url_call - 所有链接元素的回调方法
    // is_reverse - 是否倒序
    window.handleDownLink = function(text_el, text_call, url_el, url_call, is_reverse) {
        const text_arr = [];
        const url_arr = [];
        const arr = [];

        if (typeof text_call !== 'function') {
            text_call = (el) => {
                return jQuery(el).text().trim();
            };
        }

        if (typeof url_call !== 'function') {
            url_call = (el) => {
                return jQuery(el).prop('href');
            };
        }

        $.each(text_el, function(i, el) {
            text_arr.push(text_call(jQuery(el)).trim());
        });
        $.each(url_el, function(i, el) {
            let url = url_call(jQuery(el)).trim();
            url = parseThunder(url);
            url_arr.push(url);
        })

        text_arr.forEach(function(el, i) {
            arr.push(`<a href="${url_arr[i]}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${el}</a>`);
        });
        if (is_reverse) {
            arr.reverse();
        }
        const result = arr.join("\n");
        copy(result);
        return result;
    };

    // 处理百度网盘链接（不考虑无提取码的百度网盘分享链接）
    // link - 为百度网盘链接
    // code - 为提取码
    window.handleBaiduDownLink = function(link, code) {
        let copy_text = `百度网盘链接：<a href="${link}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${link}</a>，提取码：${code}。`;
        // 调用chrome api拷贝的剪贴板
        copy(copy_text);
        return copy_text;
    };

    // 解析迅雷地址，使用Base64库(有时候仍会乱码)
    function parseThunder(url) {
        if (url.startsWith('thunder://')) {
            url = url.replace('thunder://', '');
            // 一定要用这个开源库的 Base64.decode 方法，直接用 js 自带的 atob 方法可能会解析出现乱码
            url = Base64.decode(url).replace(/^AA/, '').replace(/ZZ$/, '');
        }
        return url;
    }

    // 拼接下载地址，第一个参数是下载链接字符串(以换行分隔)或数组，第二个参数是文本字符串(以换行分隔)或数组
    window.joinDownLink = function (link_arr, text_arr, reverse) {
        link_arr = $.isArray(link_arr) ? link_arr : splitStr(link_arr);
        text_arr = $.isArray(text_arr) ? text_arr : splitStr(text_arr);
        let down_arr = [];
        link_arr.forEach(function (el, i) {
            down_arr.push(`<a href="${el}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text_arr[i]}</a>`);
        });
        if (reverse) {
            down_arr.reverse();
        }
        return down_arr.join("\n");
    };

    // 以换行符分隔字符串(并且过滤空值)
    function splitStr(str) {
        return str.split("\n").filter(arr_el => !!arr_el);
    }
})();