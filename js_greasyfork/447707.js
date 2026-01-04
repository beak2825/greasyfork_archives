// ==UserScript==
// @name         必应bing网页版去广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  必应bing网页版去广告, 简单版.
// @license      MIT
// @author       bode135
// @match        *://*.bing.com/*
// @icon         https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F10%2F90%2F5656f59a1dc741d.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659661198&t=1f75b04aee9a54c5fa7ed67ef0cb8b7d
// @grant        none
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/447707/%E5%BF%85%E5%BA%94bing%E7%BD%91%E9%A1%B5%E7%89%88%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/447707/%E5%BF%85%E5%BA%94bing%E7%BD%91%E9%A1%B5%E7%89%88%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 运行间隔
    var RUNNING_INTERVAL = 0.1 * 1000;

    // 最大运行时间
    var MAX_RUNNING_TIME = 10 * 1000;

    function x1(xpath) {
        // 用xpath定位一个元素
        var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        return result.iterateNext();
    }

    function x0(xpath) {
        // 返回用xpath定位的结果, 也就是所有元素
        var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

        return result
    }

    function xx(xpath) {
        var ret = []
        var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        for (var i = 0; i < result.snapshotLength; i++){
            var elem = result.snapshotItem(i);
            ret.push(elem);
        }
        return ret;
    }

    function has_ad_generated_by_pseudo_css_class(elem, pseudoElt)
    {
        // 检测elem是否含有css伪类生成的广告
        pseudoElt = pseudoElt?pseudoElt:":before";

        var beforeStyle = window.getComputedStyle(elem, pseudoElt);
        var beforeContent = beforeStyle.content;

        // bing广告的标识是一张base64编码的图片, 转换为字符串后匹配特征即可
        var ret = beforeContent.indexOf("data:image") != -1 ? 1 : 0;
        return ret;
    }

    // 是否已经关闭了广告
    var is_closed_advertises = false;

    // Your code here...
    function close_ad()
    {
        // var elems = x1("//h2/a");
        var _temp_elems = [];
        //console.log("~~~ 开始关闭广告!");

        // 判断是否成功关闭一个以上的广告, 避免有时候加载大于渲染速度, 导致关闭失败.
        var close_flag = false;

        var xpath = "//h2/a/parent::*/following-sibling::div[@class='b_caption']/p";
        var elems = xx(xpath);
        for(var i = 0; i < elems.length; i++)
        {
            var e = elems[i];
            var flag = has_ad_generated_by_pseudo_css_class(e);
            if (flag)
            {
                // alert(flag);
                e.parentNode.parentNode.style.display = "none";
                close_flag = true;
            }
        }

         if (close_flag)
         {
             console.log("成功关闭左标签广告!");
             // alert("close_flag!");
         }
        else
        {
            // 这里关闭另一种类型的[板块状]广告
            var elem2 = x1("//li[@class='b_ad b_adTop']");
            if (elem2)
            {
                elem2.remove();
                console.log("[顶部广告板块]关闭成功.");
                close_flag = true;
            }
            elem2 = x1("//li[@class='b_ad b_adBottom']");
            if (elem2)
            {
                elem2.remove();
                console.log("[底部广告板块]关闭成功.");
                close_flag = true;
            }

            elem2 = x1("//li[@class='b_ad']");
            if (elem2)
            {
                elem2.remove();
                console.log("[灰色广告背景板]关闭成功.");
                close_flag = true;
            }
        }

        is_closed_advertises = close_flag;
        return close_flag;
    }

    //var close_flag = close_ad();
    //setTimeout(close_ad, 500);

    var startTime = new Date().getTime();
    function run_func_until_success(func, max_running_time=20 * 1000)
    {
        //var success_flag = false;
        //var success_flag = func();
        if(new Date().getTime() - startTime > max_running_time || is_closed_advertises)
        {
            clearInterval(interval_handle);
            if (is_closed_advertises)
            {
                console.log("~~~ bing去广告: 成功结束脚本!");
            }
            else
            {
                console.log("*** bing去广告: 脚本已达到最大运行时间!");
            }
            // 最后再尝试关闭一次, 避免有时候加载太慢
            setTimeout(func, 500);
        }
        else
        {
            //func();

            // 保证脚本加载速度慢于dom的加载速度
            setTimeout(func, RUNNING_INTERVAL);
            // console.log("--------- run_func_until_success ! is_closed_advertises:", is_closed_advertises);
        }
    }
    //var interval_handle = setInterval(close_ad, RUNNING_INTERVAL);
    var interval_handle = setInterval(function(){run_func_until_success(close_ad, MAX_RUNNING_TIME)}, RUNNING_INTERVAL);
})();