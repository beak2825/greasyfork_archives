// ==UserScript==
// @name        世界弹射物语-磁场 我不想登录
// @description 懒得登录
// @namespace   世界弹射物语-磁场 我不想登录
// @match       https://www.gamer.cn/sjtswy*
// @grant       none
// @version     1.0
// @author      KUMA
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/455132/%E4%B8%96%E7%95%8C%E5%BC%B9%E5%B0%84%E7%89%A9%E8%AF%AD-%E7%A3%81%E5%9C%BA%20%E6%88%91%E4%B8%8D%E6%83%B3%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/455132/%E4%B8%96%E7%95%8C%E5%BC%B9%E5%B0%84%E7%89%A9%E8%AF%AD-%E7%A3%81%E5%9C%BA%20%E6%88%91%E4%B8%8D%E6%83%B3%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


var style = document.createElement('style');
style.id = 'kuma_style';
style.type = 'text/css';
style.innerHTML = `
.lookbox.act .showlogin {
    display: none !important;
}
.pageCent .index-p-lf .detilbox .article-content {
    max-height: none !important;
}
`;
document.getElementsByTagName('head')[0].appendChild(style);