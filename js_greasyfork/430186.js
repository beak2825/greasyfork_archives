// ==UserScript==
// @name         AC-baidu：百度必应搜索结果优化
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @author       myaijarvis
// @description  百度必应搜索结果优化：标红百度搜索中CSDN的下载、社区、聚合搜索 | 阿里云、腾讯云、华为云等网站的聚合搜索
// @icon         https://www.baidu.com/favicon.ico
// @match        https://www.baidu.com/s?*
// @match        https://cn.bing.com/search?*
// @require		 http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/430186/AC-baidu%EF%BC%9A%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430186/AC-baidu%EF%BC%9A%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

const url = window.location.href;

(function () {
    "use strict";
    //debugger;
    // 百度搜索
    if (url.match(/baidu\.com\/s?/)) {
        // 找出百度搜索结果中csdn的下载项、聚合搜索，并标红显示
        // 在油猴插件《AC-baidu-重定向优化百度搜狗谷歌必应搜索_favicon_双列》渲染后执行
        setTimeout(resultOptimized, 1000); //第一次进入搜索界面

        // 点击搜索触发函数
        $("#su").click(function () {
            // 在搜索界面按下搜索按钮
            setTimeout(resultOptimized, 1000);
            //console.log("点击了搜索");
        });

        // 监听滚轮 配合AC重定向脚本翻页使用
        $(window).scroll(function () {
            //为了保证兼容性，这里取两个值，哪个有值取哪一个 scrollTop就是触发滚轮事件时滚轮的高度
            let scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 100) {
                //搜索翻页
                resultOptimized();
            }
            //console.log("滚动距离" + scrollTop);
        });
    }
    // 必应搜索 支持国内版和国际版
    if (url.match(/cn\.bing\.com\/search?/)) {
        // 在油猴插件《AC-baidu-重定向优化百度搜狗谷歌必应搜索_favicon_双列》渲染后执行
        setTimeout(resultOptimizedBing, 1000); //第一次进入搜索界面

        // 点击搜索触发函数
        $("#sb_form_go").click(function () {
            // 在搜索界面按下搜索按钮
            setTimeout(resultOptimizedBing, 1000);
            //console.log("点击了搜索");
        });

        // 监听滚轮 配合AC重定向脚本翻页使用
        $(window).scroll(function () {
            //为了保证兼容性，这里取两个值，哪个有值取哪一个 scrollTop就是触发滚轮事件时滚轮的高度
            let scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 100) {
                //搜索翻页
                resultOptimizedBing();
            }
            //console.log("滚动距离" + scrollTop);
        });
    }

})();

const url_arr = [
    "download.csdn", // CSDN下载
    "iteye.com/resource", // CSDN下载
    "csdn.net/tags", // CSDN聚合搜索
    "bbs.csdn.net", // CSDN社区
    "csdn.net/gather", // CSDN聚合搜索 https://www.csdn.net/gather_22/MtjaUg5sODM4MjgtYmxvZwO0O0OO0O0O.html
    "help.aliyun.com", // 阿里云聚合搜索 https://help.aliyun.com/wordpower/6127209-1.html https://developer.aliyun.com/askzt/10237805.html
    "developer.aliyun.com/wordpower", // 阿里云聚合搜索 https://help.aliyun.com/wordpower/6127209-1.html
    "developer.aliyun.com/askzt", // 阿里云聚合搜索 https://developer.aliyun.com/askzt/10237805.html
    "developer.aliyun.com/articlezt", // 阿里云聚合搜索 https://developer.aliyun.com/articlezt/8629130-1.html
    "cloud.tencent.com/developer/information/", // 腾讯云聚合搜索 https://cloud.tencent.com/developer/information/html%E7%AE%80%E5%8D%95%E5%BC%B9%E5%87%BA%E6%A1%86
    "blog.51cto.com/topic/", // 51CTO博客聚合搜索 https://blog.51cto.com/topic/youhoujiaobencss.html
    "huaweicloud.com/theme/", // 华为云聚合搜索 https://www.huaweicloud.com/theme/881818-2-H
    "itdaan.com/tag/", // 开发者知识库聚合搜索 https://www.itdaan.com/tag/%E6%96%B9%E6%B3%95/java.html
    "itdaan.com/keywords/",// 开发者知识库聚合搜索 https://www.itdaan.com/keywords/java.html
    "recomm.cnblogs.com/blogpost/", // 博客园聚合搜索 https://recomm.cnblogs.com/blogpost/5681713
    "javashuo.com/search/", // JavaShuo http://www.javashuo.com/search/gorsdn
    "xinnet.com/xinzhi/tags", // 新网聚合搜索 https://www.xinnet.com/xinzhi/tags/501018.html
    "mip.xinnet.com/mip/tags", // 新网聚合搜索 https://mip.xinnet.com/mip/tags/650675.html
    "icode9.com/tags", // icode9聚合搜索 https://www.icode9.com/tags-%E4%B8%83%E6%AE%B5-0.html
    "pianshen.com/article", // 程序员大本营 https://www.pianshen.com/article/7115762035/
    "javashuo.com/relative/", // JavaShuo http://www.javashuo.com/relative/p-nxlyczsd-bq.html
    "bbsmax.com/topic/", // bbsmax  https://www.bbsmax.com/topic/%E4%BB%A3%E7%A0%81%E5%A4%A7%E5%85%A82%E7%BA%AA%E5%BF%B5%E7%89%88pdf/
    "shuzhiduo.com/topic/" // 术之多 https://www.shuzhiduo.com/topic/fastapi-%E8%BF%94%E5%9B%9E%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%BC%E5%BC%8Fresponse/
];
const tip="不要点这个，浪费时间！";
// 百度搜索结果优化
function resultOptimized() {
    //debugger; //开启调试
    let $blocks = $(".result.c-container h3");
    if($blocks.length==0){
        console.log(`未能正确获取到搜索结果项，请到脚本反馈区反馈一下 https://greasyfork.org/zh-CN/scripts/430186-ac-baidu-%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%BC%98%E5%8C%96/feedback`)
        return;
    }
    $blocks.each(function (index, item) {
        let href = $(this).children("a").attr("href") || "";
        if(href==""){
            return;
        }
        for (const url_item of url_arr) {
            if (href.includes(url_item)) {
                $(this).css("background", "rgb(0,196,255,0.5)");
                if(!$(this).text().includes(tip))
                    $(this).append(`<span style="color:black;font-size: 18px;font-weight:bold;padding-left:30px;">${tip}</span>`);
                // console.log(`============标红了第${index + 1}个=>${href}`);
            }
        }
    });
}
// 必应搜索结果优化
function resultOptimizedBing() {
    //debugger; //开启调试
    let $blocks = $("#b_results  .b_algo");
    if($blocks.length==0){
        console.log(`未能正确获取到搜索结果项，请到脚本反馈区反馈一下 https://greasyfork.org/zh-CN/scripts/430186-ac-baidu-%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%BC%98%E5%8C%96/feedback`)
        return;
    }
    $blocks.each(function (index, item) {
        let href = $(this).find("h2 a").attr("href") || "";
        if(href==""){
            return;
        }
        let $h2=$(this).find("h2");
        for (const url_item of url_arr) {
            if (href.includes(url_item)) {
                $(this).find(".b_title").css("background", "rgb(0,196,255,0.5)");
                if(!$h2.text().includes(tip))
                    $h2.append(`<span style="color:black;font-size: 18px;font-weight:bold;padding-left:30px;">${tip}</span>`);
                // console.log(`============标红了第${index + 1}个=>${href}`);
            }
        }
    });
}
