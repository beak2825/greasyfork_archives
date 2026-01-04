// ==UserScript==
// @name        消腾讯和飞书链接插入页
// @namespace   Violentmonkey Scripts
// @match       *://c.pc.qq.com/middlem.html*
// @match       *://c.pc.qq.com/middleb.html*
// @match       *://c.pc.qq.com/middlect.html*
// @match       *://c.pc.qq.com/ios.html*
// @match       *://security.feishu.cn/link/safety*
// @grant       none
// @version     1.4
// @author      Eric_Lian
// @description 自动跳转腾讯链接和飞书链接插入页
// @icon        https://3gimg.qq.com/tele_safe/static/tmp/ic_alert_blue.png
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/451017/%E6%B6%88%E8%85%BE%E8%AE%AF%E5%92%8C%E9%A3%9E%E4%B9%A6%E9%93%BE%E6%8E%A5%E6%8F%92%E5%85%A5%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/451017/%E6%B6%88%E8%85%BE%E8%AE%AF%E5%92%8C%E9%A3%9E%E4%B9%A6%E9%93%BE%E6%8E%A5%E6%8F%92%E5%85%A5%E9%A1%B5.meta.js
// ==/UserScript==
(function(){
    'use strict';

    function getParams(name){
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function getTarget() {
        const hostname = location.hostname;
        if (hostname == 'c.pc.qq.com') {
            return getParams('pfurl') ?? getParams('url');
        } else if (hostname == 'security.feishu.cn' ){
            return getParams('target');
        }
    }

    let target = getTarget();
    if (target) {
        if (target.indexOf(":/") < 0) {
          target = "http://" + target;
        }
        window.location.replace(target);
    }
})();
