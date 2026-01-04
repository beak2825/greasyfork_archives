// ==UserScript==
// @name         直播吧NBA录像-页面美化
// @namespace    https://www.zhibo8.cc/nba/luxiang.htm
// @version      1.0
// @description  直播吧NBA录像-页面美化.
// @author       jyking
// @match        *://www.zhibo8.cc/nba/luxiang.htm
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393668/%E7%9B%B4%E6%92%AD%E5%90%A7NBA%E5%BD%95%E5%83%8F-%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/393668/%E7%9B%B4%E6%92%AD%E5%90%A7NBA%E5%BD%95%E5%83%8F-%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 引入CSS方法
    let $ = window.jquery = window.$
    function appendCss(url) {
        $('head').append($('<link rel="stylesheet" href="' + url + '">'));
    }
    function appendJs(url) {
        $("body").append($('<script type="text/javascript" src="' + url +'"></script>'));
    }

    function loader() {
        appendJs("https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js")
    }

    // 获取比赛数据
    let boxArr = []
    let $dataBoxArr = $("div#body > #left > .box").slice(0,2)
    $dataBoxArr.map(function(){
        let box = {};
        let dateWeekArr = []

        // 获取日期
        let $tmpDateWeek = $(this).find(".titlebar h2")
        if ($tmpDateWeek.length <= 0){
            return false
        }
        dateWeekArr = $tmpDateWeek.html().split(" ")
        box.date = dateWeekArr[0]
        box.week = dateWeekArr[1]
        box.content = []

        if ($(this).find(".content b").length <=0) {
            console.log("本日暂无比赛录像")
            boxArr.push(box)
            return false
        }
        // 获取队伍及链接
        let $tmpTeam = $(this).find(".content b")
        $tmpTeam.map(function(){
            let teamvs = {}
            let tmpNames = $(this).html().split(" ")[0].split("vs")
            let tmpHref = "https://www.zhibo8.cc/" + $(this).find("a").attr("href")
            teamvs.tesm1 = tmpNames[0]
            teamvs.tesm2 = tmpNames[1]
            teamvs.url = tmpHref
            box.content.push(teamvs)
        })

        boxArr.push(box)
    })

    console.log(boxArr)

})();