// ==UserScript==
// @name         云班课互评满分   
// @version      1.0
// @description  云班课作业互评自动评满分
// @author       zzy
// @compatible   Chrome
// @match        *://www.mosoteach.cn/*
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/769762
// @downloadURL https://update.greasyfork.org/scripts/426139/%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%BA%92%E8%AF%84%E6%BB%A1%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/426139/%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%BA%92%E8%AF%84%E6%BB%A1%E5%88%86.meta.js
// ==/UserScript==
 
var _self = unsafeWindow,
    $ = _self.jQuery || top.jQuery,
    type = getQueryVariable("m");
 
(function() {
    // console.log(type);
    // 判断是那种互评
    if (type == false) {
        console.log("无m参数");
    } else if (type == "homework_result_list") {
        console.log("一般、组间互评");
        groupOutPingfen();
    } else if (type == "team_inter_appraise") {
        console.log("组内互评");
        groupInPingfen();
    } else {
        console.log("其他类型暂不支持");
    };
})();
 
// 解析url参数
function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
};
 
// 组内互评
function groupInPingfen() {
    $('document').ready( function () {
        alert("请点击确定开始自动评分");
        var list = document.querySelectorAll("tbody > tr > td.my-appraise-score");
        var total = list.length;
        var i = 0;
        let t = setInterval( function() {
            doInPingfen(list[i]);
            i++;
            if (i == total) {
                clearInterval(t);
                console.log("全部完成");
            };
        },3000);
    });
};
 
// 组内互评操作
function doInPingfen(one) {
    var name = one.querySelector('i').getAttribute('data-title');
    console.log('开始给' + name + '评分')
    try{
        var s = one.innerText;
        if ( s == "请评分" ){
            one.querySelector('i').click()
            setTimeout( function() {
                document.querySelector('body > div.item-score-box.team-inter-score-box > div.score-points-item.cl > ul > li:nth-child(1)').click()
                document.querySelector('#score').click()
                console.log('此同学评分完成！')
            },2000);
        } else {
            console.log('重复评分，跳过');
        };
    } catch (e) {
        console.log(e)
    };
};
 
 
// 一般、组间互评
function groupOutPingfen(){
    $('document').ready( function () {
         var todo =document.querySelector("#cc-main > div:nth-child(4) > div:nth-child(3) > div.quota");
        if (todo !=null)
        {
             alert("动动你的小手点击确定开始互评啦 ");
                    var list = document.querySelectorAll('.homework-item');
        var total = list.length - 1;
        var i = 1;
        let t = setInterval( function () {
            console.log("共计:" + total + "个，开始评分：第" + i + "个");
            var one = list[i];
            // 开始操作
            doOutPingfen(one);
            i++;
            if ( i == total+1) {
                // 清除Interval的定时器
                clearInterval(t);
                console.log("全部完成");
                alert("呼，累够呛，评完了，嘻嘻！");
            };
        },3000);
        }
        else
        {
             alert("已经互评完了，好耶！");
        }
    });
};
 
// 一般、组间互评操作
function doOutPingfen(one) {
    try{
        var s = one.querySelector("div.appraised-box.cl > div > span.user-current-score").textContent;
 
        if ( s == "请评分" ) {
            one.querySelector("div > span.appraise-button.appraised-button-enable").click()
            console.log("选中评分");
            let a = setInterval( function () {
                var list =one.querySelectorAll('div.item-score-box > div.score-points-item.cl > ul > li:nth-child(1)');
                var i;
                for(i=0;i<list.length;i++)
                {
                    list[i].click();
                }
                console.log("选中分数");
                one.querySelector('#score').click();
                console.log("评分完成");
                // 清除Interval的定时器
                clearInterval(a);
            },3000);
        } else {
            console.log("重复评分，跳过！")
        };
        return;
    } catch(e) {
        console.log("可能是没有提交。" + e);
        return;
    };
};