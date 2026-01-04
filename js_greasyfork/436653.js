// ==UserScript==
// @name         计算总学分
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  此脚本用来计算江西科技师范大学教务管理系统“学生学业情况查询”页面已经获得的学分；
// @author       MoMingLog
// @include      *//jwglxt.jxstnu.edu.cn/jwglxt/xsxy/xsxyqk_cxXsxyqkIndex.html*
// @include      *//172-18-4-223.vpn.jxstnu.edu.cn:8118/jwglxt/xsxy/xsxyqk_cxXsxyqkIndex.html*
// @icon         https://s4.ax1x.com/2021/12/07/o6DNOH.png
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/436653/%E8%AE%A1%E7%AE%97%E6%80%BB%E5%AD%A6%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/436653/%E8%AE%A1%E7%AE%97%E6%80%BB%E5%AD%A6%E5%88%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function expand() {
        /**
        * 一键展开
        */
        var expandList = document.querySelectorAll(".expandable-hitarea");
        for (var i = 0; i < expandList.length; i++) {
            var xf = expandList[i].click();
        }
    }
    function expandAll() {
        /**
        * 一键展开(全部)
        */
        expand();
        expandAndCollapMore();
    }
    function collap() {
        /**
        * 一键收拢
        */
        var collapList = document.querySelectorAll(".collapsable-hitarea");
        for (var i = 0; i < collapList.length; i++) {
            var xf = collapList[i].click();
        }

    }

    function expandAndCollapMore() {
        /**
        * 展开/收拢下拉列表
        */
        var moreList = document.querySelectorAll(".more");
        for (var i = 0; i < moreList.length; i++) {
            moreList[i].click();
        }
    }

    collap();
    function getRealScore() {
        /**
         * 获取实际学分
         */
        // 获取当前网页的域名
        var domain = window.location.host;
        var gnmkdm = $("#gnmkdmKey").attr("value");
        var su = $("#sessionUserKey").attr("value");
        var url = "http://" + domain + "/jwglxt/xsxy/xsxyqk_cxKczxAllIndex.html?doType=query&gnmkdm=" + gnmkdm + "&su=" + su + "&sf_request_type=ajax";
        var data = {
            "_search": false,
            "nd": new Date().getTime(),
            "queryModel.showCount": 15,
            "queryModel.currentPage": 1,
            "queryModel.sortName": "",
            "queryModel.sortOrder": "asc",
            "time": 0
        };
        var sum = 0;
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            async: false,
            success: function (data) {
                var realScore = data.items;
                realScore.forEach(element => {
                    var hdxf = parseFloat(element.hdxf);
                    sum += hdxf;
                });
            },
            error: function (data) {
            }
        });
        return sum;

    }
    var majorCategories = document.querySelectorAll('ul.treeview>li>ul>li>div.title>p.title1');
    var reg = /\s获得学分:([\.\d+]*)/;

    var majorScoreSum = 0;

    for (var i = 0; i < majorCategories.length; i++) {
        var majorCategorieStr = majorCategories[i].innerText;
        var majorScore = majorCategorieStr.match(reg)[1];
        majorScoreSum += parseFloat(majorScore);
    }

    var otherScoreTrs = document.querySelectorAll('#tbodyqtkcxfyq tr td[name="xf"]');

    var otherScoreSum = 0;

    for (var i2 = 0; i2 < otherScoreTrs.length; i2++) {
        var otherScore = otherScoreTrs[i2].innerText;
        otherScoreSum += parseFloat(otherScore);
    }

    var sumScore = majorScoreSum + otherScoreSum;
    var realScore = getRealScore();
    var alertBox = document.querySelector("#alertBox");
    var innerHtmlStr = `
 <div style="position: fixed; top:200px; right: 200px; z-index:999;" id="change">
    <table  cellspacing="1" cellpadding="4" border="0" align="center" >
            <tr>
                <td align="center" colspan="2" height="30px" style="font-size:18px"><b>学分情况</b></td>
            </tr>
            <tr style="background:#288ace55; color:white;border-radius: 60px; " height="30px">
                <th align="center" style="padding:15px 10px 15px 50px">主修课程学分</th>
                <td align="center">` + majorScoreSum + `</td>
            </tr>
            <tr style="background:#5500ff55;color:white" >
                <th align="center" style="padding:15px 10px 15px 50px">其他课程学分</th>
                <td align="center">` + otherScoreSum + `</td>
            </tr>
            <tr style="background:#ffea0055;color: black">
                <th align="center" style="padding:15px 10px 15px 50px">综合学分总和</th>
                <td align="center" style="color:red"><b>` + sumScore + `</b></td>
            </tr>
             <tr style="background:#ff0000;color: white">
                <th class="cat" align="center" style="padding:15px 10px 15px 50px">实际学分</th>
                <td class="cat" align="center" style="color:white"><b>` + realScore + `</b></td>
            </tr>
            <tr>
                <td >
                    <a id="expand_" style="display:block;padding:15px 10px 15px 50px; cursor:pointer" >一键展开</a>
                </td>
                <td >
                    <a id="expandAll_" style="display:block;padding:15px 10px 15px 50px; cursor:pointer;">一键展开(全部)</a>
                </td>
            </tr>
            <tr>
                <td>
                    <a id="expandAndCollapMore_" style="display:block;padding:15px 10px 15px 50px; cursor:pointer">下拉/上收</a>
                </td>
                <td>
                    <a id="collap_" style="display:block;padding:15px 10px 15px 50px; cursor:pointer">一键收拢(全部)</a>
                </td>
            </tr>
        </table>
 </div>
`;
    alertBox.innerHTML += innerHtmlStr;

    var expand_ = document.querySelector("#expand_");
    if (expand_) {
        expand_.addEventListener("click", expand, false);
    }

    var expandAll_ = document.querySelector("#expandAll_");
    if (expandAll_) {
        expandAll_.addEventListener("click", expandAll, false);
    }

    var expandAndCollapMore_ = document.querySelector("#expandAndCollapMore_");
    if (expandAndCollapMore_) {
        expandAndCollapMore_.addEventListener("click", expandAndCollapMore, false);
    }

    var collap_ = document.querySelector("#collap_");
    if (collap_) {
        collap_.addEventListener("click", collap, false);
    }

    // 设置cat的监听事件
    var cat = $(".cat");
    // 设置鼠标样式
    cat.css("cursor", "pointer");
    //  设置title
    cat.attr("title", "点击查看实际学分");
    cat.click(function () {
        var clj = $(".clj");
        clj.click();
    });

})();