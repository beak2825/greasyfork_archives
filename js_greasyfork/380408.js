// ==UserScript==
// @name           HB Partner 链接自动提示及清除
// @description    发现网页中存在疑似 HB Partner 链接时自动弹窗提示，点击不在白名单中的 Partner 链接进入 HB 后自动清除网址尾巴并删除相关 cookie，更多请详见说明。
// @match          *://*.humblebundle.com/*
// @match          *://keylol.com/t*
// @match          *://keylol.com/forum.php?mod=viewthread&tid=*
// @match          *://yxdzqb.com/*
// @author         Kazma Zhang
// @copyright      Kazma Zhang
// @version        1.3.1
// @licence        AGPL v3
// @grant          none
// @namespace      https://greasyfork.org/zh-CN/users/280819-kzpic
// @downloadURL https://update.greasyfork.org/scripts/380408/HB%20Partner%20%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%8F%90%E7%A4%BA%E5%8F%8A%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/380408/HB%20Partner%20%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%8F%90%E7%A4%BA%E5%8F%8A%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

//目前仅匹配 hb（功能需要）、steamcn 和一个未做任何提示且隐藏了 Partner 链接的网站
//如需增减请按格式调整头部的 @match 字段，为 * 则匹配所有网站，注意删除 *://*.humblebundle.com/* 后自动清除功能将失效

(function(){

    //白名单：默认为空，如需忽略某些 Partner 的自动提醒和清除，请在下一行的引号内输入 Partner 名称，如需定义多个，请按此格式输入（数量不限）：var white = ["abc", "def", "ghi"];
    var white = [""];

    //启用提醒：启用提醒功能
    var Warning = 1;

    //启用清除：启用清除功能
    var Clean = 1;

    //提醒原则：默认为 0，表示仅当网页中存在以链接形式出现或被隐藏的 Partner 链接时提醒，如需在任何时候都提醒，请更改为 1
    var WarningAll = 0;

    if (Warning == 1) {
        //获取 body 代码
        var str = document.body.innerHTML;
        var reg = "";
        //匹配规则，前者为 html 标签中的链接，后者为全部链接
        WarningAll == 0 ? reg = /<[^<>]*humblebundle\.com[^\'\"<>]*\?partner=[^<>]*>/g : reg = /humblebundle\.com[^\'\"<>]*\?partner=/g;
        //如匹配则提醒
        if (str.match(reg)) {
            alert("注意：此页面疑似包含 HB Partner 链接！\r\n如需查找请按 F12 或右键审查元素搜索“?partner=”。");
        }
    }

    if (Clean == 1) {
        //判断当前网站为 www.humblebundle.com
        if (window.location.host.indexOf("www.humblebundle.com") != -1) {
            //判断网址是否包含尾巴及尾巴是否不在白名单中
            if (window.location.search.indexOf("?partner=") != -1 && white.indexOf(window.location.search.replace("?partner=", "")) == -1) {
                //匹配则跳转到正常链接
                location.replace(window.location.origin + window.location.pathname);
            } else {
                //获取站点 cookie，不会上传请放心
                var strcookie = document.cookie;
                //拆分 cookie 为名/值对
                var arrcookie = strcookie.split("; ");
                //遍历 cookie 数组
                for(var i=0; i < arrcookie.length; i++) {
                    //拆分每对
                    var arr = arrcookie[i].split("=");
                    //如匹配则清除
                    if(arr[0] == "partner_id") {
                        if (white.indexOf(arr[1]) == -1) {
                            var date=new Date();
                            date.setTime(date.getTime() - 10000);
                            document.cookie = "partner_id=;domain=.humblebundle.com;expire=" + date.toGMTString() + ";path=/;";
                        }
                    }
                }
            }
        }
    }
}) ()