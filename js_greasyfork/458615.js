// ==UserScript==
// @name               琉璃神社_仿站判断
// @name:zh-CN         琉璃神社_仿站判断
// @name:en-US         HACG_Phishing detect
// @description        通过检测网站标题、域名和特征元素特征判断站点真伪。
// @version            1.0.6
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              *://*/*
// @exclude            https://greasyfork.org/zh-CN/scripts/458615*
// @connect            acg.gy
// @grant              GM_xmlhttpRequest
// @grant              GM_setValue
// @grant              GM_getValue
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/458615/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE_%E4%BB%BF%E7%AB%99%E5%88%A4%E6%96%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/458615/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE_%E4%BB%BF%E7%AB%99%E5%88%A4%E6%96%AD.meta.js
// ==/UserScript==

'use strict';

// 定义页面域名(host)、页面路径(path)和网页标题(title)变量，快捷元素选择($(元素定位符))函数
let host = location.host,
    path = location.pathname,
    title = document.title,
    $ = ele => document.querySelector(ele);

// 或未定义最后更新(lastUpdate)或超过三小时未更新，就更新对应数值
if(!GM_getValue('lastUpdate') || new Date().getTime() >= (GM_getValue('lastUpdate') + 10800000)) {
    GM_setValue('lastUpdate', new Date().getTime());
    //GM_setValue('official', 'https://hacg.sbs');
    GM_xmlhttpRequest({
        url: "https://acg.gy",
        onload: resp => {
            // 当正确加载，就存储最新域名
            (resp.status === 200) ? GM_setValue('official', `${resp.responseText.split(`<a href="`)[1].split(`">`)[0]}`) : '' ;
        }
    });
};

// 判断是否含有琉璃神社类似元素
if(host.match(/(llss|liuli|hacg)/) || title.match(/(琉璃|神社)./)) {
    // 如果域名中包含 (llss|liuli|hacg) 或网站标题中包含 (琉璃|神社).
    if(path === '/' && $('#top_logo img') && $('#top_logo img').alt !== '请注意旋转的logo内部英文字母应该是HACG.ME 英文圆环有空隙就是假的琉璃神社' || /^\/wp\//.test(path) && $('#site-title, .site-title') && $('#site-title, .site-title').textContent !== '琉璃神社 ★ HACG.me') {
        // 如果是首页、存在徽标且徽标中的图像文本描述不正确或，如果不是首页存在页眉且页眉中的标题文本描述不正确，就访问正版
        open(`${GM_getValue('official')}/wp`, "_self");
    }else if(!host.match(GM_getValue('official').split('https://')[1]) && title.match('琉璃神社')) {
        // 如果不是最新域名且网站标题中包含“琉璃神社”，就弹出提示框，如果选择是就访问正版
        if (window.confirm('检测到网站标题中包含“琉璃神社”，是否尝试访问原站最新域名？')) {
            open(`${GM_getValue('official')}/wp`, "_self");
        };
    }
}