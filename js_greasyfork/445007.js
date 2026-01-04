// ==UserScript==
// @name         超星字体解密
// @namespace    wyn665817@163.com
// @version      1.1.2
// @description  超星网页端字体解密，支持复制题目，兼容各类查题脚本
// @author       wyn665817
// @match        *://*.chaoxing.com/work/doHomeWorkNew*
// @match        *://*.chaoxing.com/mooc-ans/work/doHomeWorkNew*
// @match        *://*.edu.cn/work/doHomeWorkNew*
// @match        *://*.edu.cn/mooc-ans/work/doHomeWorkNew*
// @require      https://greasyfork.org/scripts/445293/code/TyprMd5.js
// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445007/%E8%B6%85%E6%98%9F%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/445007/%E8%B6%85%E6%98%9F%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery,
// 启用会导致暴力猴扩展报错
// Typr = Typr || window.Typr,
// 注释掉会导致油猴无法通过语法检测，但不影响使用
md5 = md5 || window.md5;

// 判断是否存在加密字体
var $tip = $('style:contains(font-cxsecret)');
if (!$tip.length) return;

// 解析font-cxsecret字体
var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
font = Typr.parse(base64ToUint8Array(font))[0];

// 匹配解密字体
var table = JSON.parse(GM_getResourceText('Table'));
var match = {};
for (var i = 19968; i < 40870; i++) { // 中文[19968, 40869]
    $tip = Typr.U.codeToGlyph(font, i);
    if (!$tip) continue;
    $tip = Typr.U.glyphToPath(font, $tip);
    $tip = md5(JSON.stringify($tip)).slice(24); // 8位即可区分
    match[i] = table[$tip];
}

// 替换加密字体
$('.font-cxsecret').html(function(index, html) {
    $.each(match, function(key, value) {
        key = String.fromCharCode(key);
        key = new RegExp(key, 'g');
        value = String.fromCharCode(value);
        html = html.replace(key, value);
    });
    return html;
}).removeClass('font-cxsecret'); // 移除字体加密

function base64ToUint8Array(base64) {
    var data = window.atob(base64);
    var buffer = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
    }
    return buffer;
}