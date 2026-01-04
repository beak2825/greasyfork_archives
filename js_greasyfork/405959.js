// ==UserScript==
// @name         网页禁止图片加载
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  ban image
// @match        https://*/*
// @match        http://*/*
// @author       ioiogoo
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/405959/%E7%BD%91%E9%A1%B5%E7%A6%81%E6%AD%A2%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/405959/%E7%BD%91%E9%A1%B5%E7%A6%81%E6%AD%A2%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cur_host = location.host;
    console.log("[tampermonkey]" + location.host)
    var urls_domain = GM_getValue("urls_domain");
    if (urls_domain == null){
        urls_domain = ["zhihu", "smzdm"];
    }
    // console.log(urls_domain)
    if (urls_domain.find(item => new RegExp(item).test(cur_host)) != null){
        $(function(){
            $('div img').hide(500);//移除所有在div中的图片
            $('canvas').hide(500);
            console.log("[tampermonkey]移除图片")


        })
    } else {
        // console.log(location.host)
        console.log("[tampermonkey]没有移除图片")
        // console.log(urls.find(re => re.test(location.host)))
    };



    try {
        console.log(location)
        GM_registerMenuCommand('显示图片', function() {
            urls_domain.splice(urls_domain.findIndex(item => new RegExp(item).test(cur_host)), 1);
            GM_setValue("urls_domain", urls_domain);
            $('div img').show(500);
            $('canvas').show(500);
        })

        GM_registerMenuCommand('隐藏图片', function () {
            if (cur_host.indexOf("qiyukf") > -1){
                urls_domain.push("smzdm");
            }
            urls_domain.push(cur_host);
            urls_domain = [...new Set(urls_domain)]
            GM_setValue("urls_domain", urls_domain);
            $('div img').hide(500);
            $('canvas').hide(500);
        });
        GM_registerMenuCommand('显示当前urls', function() {
            console.log("[tampermonkey]当前移除的url包含： " + urls_domain);
        })}
    catch (e) {
    }

    // Your code here...
})();