// ==UserScript==
// @name        pc 微信跳转页面直接打开
// @namespace   https://greasyfork.org/zh-CN
// @version     2016.12.09
// @author      wangruijie
// @description pc上从微信打开taobao等页面 还要手动复制粘贴，表示不爽
// @include     https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate*
// @grant       none
// @require http://cdn.bootcss.com/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25532/pc%20%E5%BE%AE%E4%BF%A1%E8%B7%B3%E8%BD%AC%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/25532/pc%20%E5%BE%AE%E4%BF%A1%E8%B7%B3%E8%BD%AC%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

function run ()
{
    $url = $('div .url').text();
    console.info($url);
    window.location.href= $url;
}

run();