// ==UserScript==
// @name         自动登录+自动搜索+自动提取案件号问题描述
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://125.47.41.166:8080/eGovaMISV14/main.htm
// @match        http://16.99.4.160/*
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386944/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%2B%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%2B%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%E6%A1%88%E4%BB%B6%E5%8F%B7%E9%97%AE%E9%A2%98%E6%8F%8F%E8%BF%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/386944/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%2B%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%2B%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%E6%A1%88%E4%BB%B6%E5%8F%B7%E9%97%AE%E9%A2%98%E6%8F%8F%E8%BF%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setTimeout(function(){ $("input#mis-login-user-name").val("道路绿化处"),$(".login-submit-img").click(),$(".bizbase-recbox-splitter-spe").click(),console.log("1登陆成功1"); }, 3000);
    function add_tasknum_event_desc(){
        var all_road_name=$("div.slick-cell.l4.r4.selected").html();
        var tasknum=$("div.slick-cell.l3.r3.selected").html();
        var time=$("div.slick-cell.l6.r6.selected").html();
        var pizhuantime=$("div.slick-cell.l2.r2.selected").html();
        var jiezhitime=$("div.slick-cell.l5.r5.selected").html();
        var all_road_name_split=all_road_name.split('，');
        console.log(all_road_name_split[0]);//获取的路名
        //window.open("https://ditu.amap.com/search?query="+all_road_name_split[0]+"&city=410100&geoobj=113.608586%7C34.763607%7C113.623864%7C34.770464&zoom=17");//高德
        //window.open("http://map.baidu.com/?newmap=1&s=con%26wd%3D"+all_road_name_split[0]+"%26c%3D268&from=alamap&tpl=mapdots");//百度
        $("#myid").each(function(){
            //$(this).attr("value","任务号："+tasknum+"——————"+"案件描述："+all_road_name+"——————"+"剩余时间："+"【！*"+time+"*！】"+"——————"+"【截止时间】："+jiezhitime+"——————"+"批转时间："+pizhuantime);//对myid赋value值
            $(this).attr("value","任务号："+tasknum+"——————"+"案件描述："+all_road_name+"——————"+"【截止时间】："+"【！*"+jiezhitime+"*！】");//对myid赋value值
        });
        GM_addStyle("input[type='checkbox'] {zoom: 160%;}");
    }
    function map_search(){
        var roadname=$("div.slick-cell.l4.r4.selected").html();
        var roadname_split=roadname.split('，');
        console.log(roadname_split[0]);//获取的路名
        window.open("https://ditu.amap.com/search?query="+roadname_split[0]+"&city=410100&geoobj=113.608586%7C34.763607%7C113.623864%7C34.770464&zoom=17");//高德
        window.open("http://map.baidu.com/?newmap=1&s=con%26wd%3D"+roadname_split[0]+"%26c%3D268&from=alamap&tpl=mapdots");//百度
    }
    setTimeout(function(){
        $(".slick-viewport").dblclick(function(){
            map_search();
            console.log("shuangji");
        }),console.log("map_search")
    }, 10000);
    setTimeout(function(){
        $(".slick-viewport").click(function(){
            console.log("123")
            if($("#myid").length > 0) {
                add_tasknum_event_desc();
            }else{
              $(".bizbase-recbox-list-search-content").before("<input type='text' id='myid' value='' onfocus='this.select()' onmouseover='this.focus()' />");//创建可复制的案件号+问题描述的input
                add_tasknum_event_desc();
            }
        }),console.log("add_tasknum_event_desc")} , 10000);

    var clipboard = new ClipboardJS('.bizbase-recbox-detail-info-content', {
        target: function() {
            console.log("zzzzz");
            return document.querySelector('.bizbase-recbox-list-media-show-container');
        }
    });

    var clipboard = new ClipboardJS('.bizbase-recbox-detail-process-info', {
        target: function() {
            console.log("zzzzz");
            return document.querySelector('.bizbase-recbox-list-media-show-container');
        }
    });

    var clipboard = new ClipboardJS('.app-tabs-head', {
        target: function() {
            console.log("zzzzz");
            return document.querySelector('#myid');
        }
    });
})();