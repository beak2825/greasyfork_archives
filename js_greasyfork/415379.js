// ==UserScript==
// @name         无忌摄影论坛外链复原脚本
// @namespace    https://forum.xitek.com/
// @version      0.4
// @description  无忌论坛最近很多外链被转义无法正常访问，不少图床图片也因为转义显示异常，通过3行js代码进行恢复处理
// @author       老鼠不相往来
// @match        *://*.xitek.com/thread*
// @match        *://*.xitek.com/*viewthread*
// @match        *://*.xitek.com/*tid=*
// @grant        none
// @require        https://cdn.bootcdn.net/ajax/libs/Base64/1.1.0/base64.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/415379/%E6%97%A0%E5%BF%8C%E6%91%84%E5%BD%B1%E8%AE%BA%E5%9D%9B%E5%A4%96%E9%93%BE%E5%A4%8D%E5%8E%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415379/%E6%97%A0%E5%BF%8C%E6%91%84%E5%BD%B1%E8%AE%BA%E5%9D%9B%E5%A4%96%E9%93%BE%E5%A4%8D%E5%8E%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var els = document.getElementsByClassName('t_f');//查找帖子节点
    [].forEach.call(els, function (el) {//遍历帖子节点
        [].forEach.call(el.childNodes, function (son) {//遍历帖子节点的子节点
            //console.log(Object.prototype.toString.call(son));
            if (son instanceof Text) {//纯文本节点中可能存在外链域名替换，进行文本替换修正
                son.data = son.data.replaceAll('·', '.');
            } else if (son instanceof HTMLImageElement) {//图片节点中可能存在外链域名替换，图片源进行替换修正
                son.src = son.attributes.src.value.replaceAll('·', '.');
            } else if (son instanceof HTMLAnchorElement) {//跳转节点中可能存在外链域名替换，进行内容替换修正
                var link = son.href.match("/link/\\?url=(.*)");//判断是否是编码过的外链跳转，如果是进行外链反编码
                if (link) {
                    son.href = atob(link[1]);
                }
                son.innerHTML = son.innerHTML.replaceAll('·', '.');
            };
        });
    });
})();