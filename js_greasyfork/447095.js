
// ==UserScript==
// @name         妖火插件
// @namespace    https://yaohuo.me/
// @version      0.22
// @description  妖火网回复增强
// @author       外卖不用券(id:23825)
// @match        https://yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @grant        unsafeWindow
// @license      MIT
// @author       北行(id:3321)
 
// @202003132234在0.21基础添加了将普通文本替换成链接的功能(使用了一个其他作者的脚本)
// @author       北行(id:3321)
 
// @downloadURL https://update.greasyfork.org/scripts/447095/%E5%A6%96%E7%81%AB%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447095/%E5%A6%96%E7%81%AB%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
;
console.log("妖火网分享你我！");
const FORE_COLORS = {
    '会员红': '#ff00c0',
    '妖火蓝': '#3d68a8',
    '论坛绿': '#21b273'
};
const ADD_UBB = {
    '超链接': '[url=]  [/url]',
    '加粗':'[b]  [/b]',
    '斜体':'[i]  [/i]',
    '下划线':'[u]  [/u]',
    '删除线':'[strike]  [/strike]'
};
/* 表单对象序列化 */
function stringify(obj, sep, eq) {
    sep = sep || '&';
    eq = eq || '=';
    let str = "";
    for (var k in obj) {
        str += k + eq + unescape(obj[k]) + sep;
    }
    return str.slice(0, -1);
};
 
/* POST表单封装 */
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: stringify(data)
    });
    return response;
}