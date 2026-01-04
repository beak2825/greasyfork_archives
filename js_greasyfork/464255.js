// ==UserScript==
// @name        淘实惠京东跳转
// @description  淘实惠插件京东跳转
// @version      1.0.1
// @author       三胖
// @namespace    https://greasyfork.org/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @match        http://www.joyj.com/jd_coupon_item.php?type=zhekou&key=*
// @downloadURL https://update.greasyfork.org/scripts/464255/%E6%B7%98%E5%AE%9E%E6%83%A0%E4%BA%AC%E4%B8%9C%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464255/%E6%B7%98%E5%AE%9E%E6%83%A0%E4%BA%AC%E4%B8%9C%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    function main() {
        gotoWeb(); // 跳转网页
    }

    /**
     * 全局变量
     */
    var currentURL = window.location.href; // 获取当前网页地址
    var xx = getUrlParam('id');
    var url = "https://item.jd.com/"+xx+".html"; // 预定义跳转网页

    gotoWeb = function () {
        /** 定义拦截网页 */
        var urls = {
            "googleHelpURLs": [
                "www.joyj.com/jd_coupon_item.php"
            ]
        };
        /** 拦截网站并跳转 */
        var googleHelpURLs = GM_getValue("googleHelpURLs") === undefined ? urls.googleHelpURLs : $.merge(GM_getValue("googleHelpURLs"), urls.googleHelpURLs);
        for (var i = 0; i < googleHelpURLs.length; i++) { if (currentURL.indexOf(googleHelpURLs[i]) != -1) { window.location.href = url; return; } }
    };

      function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        }


    /**
     * 加载完所有数据后进入主函数
     */
    if (true) main();
})();