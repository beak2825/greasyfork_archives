// ==UserScript==
// @name           使用阿里巴巴普惠体作为网页默认字体
// @description    网页字体替换为阿里巴巴普惠体(优先)或微软雅黑
// @include        *:*
// @author         xiaofeng
// @version        1.08
// @namespace https://greasyfork.org/users/704275
// @downloadURL https://update.greasyfork.org/scripts/415972/%E4%BD%BF%E7%94%A8%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E6%99%AE%E6%83%A0%E4%BD%93%E4%BD%9C%E4%B8%BA%E7%BD%91%E9%A1%B5%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/415972/%E4%BD%BF%E7%94%A8%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E6%99%AE%E6%83%A0%E4%BD%93%E4%BD%9C%E4%B8%BA%E7%BD%91%E9%A1%B5%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==
(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }

    addStyle('body,form,div,ul,ol,li,h1,h2,h3,h4,h5,h6,span,table,tr,th,td,p,input,dl,dt,dd,ul,ol,li,input,textarea,a,label,b {font-family : "阿里巴巴普惠体","Alibaba Sans","微软雅黑","Microsoft YaHei" !important;}');
})();