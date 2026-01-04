// ==UserScript==
// @name         rate shower
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nowcoder.com通过率与通过人数切换
// @author       Ygy
// @match        https://ac.nowcoder.com/acm/contest/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nowcoder.com
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447352/rate%20shower.user.js
// @updateURL https://update.greasyfork.org/scripts/447352/rate%20shower.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(window).on('load',function () {
    let $tableHeadTrs = $(".table-hover>thead>tr>th")
    let $tableBodyTrs = $(".table-hover>tbody>tr")
    let $fixedMenu = $(".fixed-menu>ul")

    // $tableHead.append($('<th width="10%">通过率</th>'))

    let $a1 = $('<a id="a1" class="qq"></a>')
    $a1.css('background','url("")')
    // let $a1 = $('<a id="a1" class="qq" style="background: url("")"></a>')
    let $li1 = $('<li></li>').append($a1)
    $fixedMenu.append($li1)

    let flag = 1
    let columnIndex = 2
    let oriList = []
    let rateList = []


    //获取通过率列号
    columnIndex = getColumnIndex()

    console.log(columnIndex)


    //生成列表
    rateListGen(oriList, rateList)

    console.log(oriList)
    console.log(rateList)

    //绑定点击事件
    $("#a1").on('click', change)

    function change() {
        console.log("I'm clicked....")
        $tableBodyTrs.each(function (index, element) {
            let $tableBodyTds = $(element).children('td')
            // console.log($tableBodyTds[2].textContent)
            if (flag < 0) {
                $tableBodyTds[columnIndex].innerHTML = oriList[index]
            } else {
                $tableBodyTds[columnIndex].innerHTML = rateList[index]
            }
        })
        flag *= -1
    }


    //生成两列表，原始与计算后
    function rateListGen(li1, li2) {
        $tableBodyTrs.each(function (index, element) {
            let $tableBodyTds = $(element).children('td')
            // console.log($tableBodyTds[2].textContent)
            let str = $tableBodyTds[columnIndex].textContent
            li1.push(str)
            // console.log(toPercent(rateCal(str)))
            li2.push(toPercent(rateCal(str)))
        })
    }

    //计算比率
    function rateCal(str) {
        let nums = str.split('/');
        if (nums.length !== 2) return 'error!'
        let num1 = parseInt(nums[0])
        let num2 = parseInt(nums[1])
        if (num2 === 0) return 0
        else return num1 / num2
    }

    //转成百分数
    function toPercent(point) {
        let str = Number(point * 100).toFixed(2);
        str += "%";
        return str;
    }

    //获取通过率所在列
    function getColumnIndex() {
        let idx = 2
        $tableHeadTrs.each(function (index, element) {
            let str = element.innerText
            if ("通过率"===str){
                idx = index
                return false
            }
        })
        return idx
    }
});
    // Your code here...
})();