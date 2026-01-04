// ==UserScript==
// @name         优化北理工成绩列表显示
// @namespace    https://blog.csdn.net/c20180630
// @version      1.3.2
// @description  脚本适用于北京理工大学教务系统成绩查询界面（支持校内访问、webvpn访问），调整成绩查询后表格的显示，并且能自动计算平均学分绩。
// @author       XiaoZheng2003
// @match        https://webvpn.bit.edu.cn/http/77726476706e69737468656265737421fae04c8f69326144300d8db9d6562d/jsxsd/kscj/cjcx_list
// @match        https://jwms.bit.edu.cn/jsxsd/kscj/cjcx_list
// @match        http://jwms.bit.edu.cn/jsxsd/kscj/cjcx_list
// @icon         https://www.bit.edu.cn/images/gb20190805/logo_01.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456009/%E4%BC%98%E5%8C%96%E5%8C%97%E7%90%86%E5%B7%A5%E6%88%90%E7%BB%A9%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/456009/%E4%BC%98%E5%8C%96%E5%8C%97%E7%90%86%E5%B7%A5%E6%88%90%E7%BB%A9%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //调整表格列宽
    var w = [-1, -1, -1, 300, 80, 80, -1, -1, 100, 100, 100, 140, 160, -1, -1, 100];
    var obj = document.getElementsByClassName("Nsb_r_list_thb");
    var i;
    for (i = 0; i < 16; i++) {
        if (w[i] !== -1) {
            obj[i].style = "width:" + w[i] + "px";
        }
    }

    //规范表格代码
    var table = document.getElementById('dataList');
    table.innerHTML = table.innerHTML.replace('tbody', 'thead').replace('</tr>', '</tr></thead><tbody>').replaceAll('align="left"','');

    //计算平均学分绩
    var scoreSum = 0;
    var creditSum = 0;
    var failedCredit = 0;
    var n = table.rows.length;
    for (i = 1; i < n; i++) {
        var score = document.querySelector('#dataList > tbody > tr:nth-child(' + i + ') > td:nth-child(5)').innerText=
                    document.querySelector('#dataList > tbody > tr:nth-child(' + i + ') > td:nth-child(5) > a').innerText;
        if(score == "优秀") score = 95;
        else if(score == "良好") score = 85;
        else if(score == "中等") score = 75;
        else if(score == "及格") score = 65;
        else if(score == "不及格") score = 0;
        else score = Number(score);
        var credit = Number(document.querySelector('#dataList > tbody > tr:nth-child(' + i + ') > td:nth-child(7)').innerText);
        scoreSum += score * credit;
        creditSum += credit;
        if (score < 60) failedCredit += credit;
    }
    var gpa = scoreSum / creditSum;
    console.log('总学分=' + creditSum);
    console.log('挂科学分=' + failedCredit);
    console.log('平均学分绩=' + gpa);
    alert("当前页面已获得学分：" + (creditSum - failedCredit) + "\n当前页面平均学分绩：" + gpa.toFixed(6));
    document.querySelector('body > div > strong').innerText = "当前页面已获得学分：" + (creditSum - failedCredit)
        + "                         当前页面平均学分绩：" + gpa.toFixed(6);

    //点击表头按列进行排序
    const order = {
        init(param) {
            const that = this;
            const table = param.el;
            if (!table) return;
            // TODO: 获取tbody节点
            const tbody = table.getElementsByTagName('tbody')[0];
            console.log(tbody);
            // TODO: 获取所有th节点，并将其转为数组
            const ths = Array.prototype.slice.call(table.getElementsByTagName('th'))
            // TODO: 获取所有tr节点，并将其转为数组
            const trs = Array.prototype.slice.call(table.getElementsByTagName('tr'))
            const list = this.getBodyList(trs.slice(1));

            ths.forEach((th, index) => {
                // TODO: 请为th绑定点击事件
                th.addEventListener('click', () => {
                    // TODO: 判断当前数据是否为升序
                    const isAsc = this.isAsc(list, index);
                    // TODO: 如果当前为升序，则将list降序排序；如果当前为降序，则将list升序排序；
                    if (isAsc) {
                        list.sort((a, b) => this.compareValues(b.value[index], a.value[index]));
                    } else {
                        list.sort((a, b) => this.compareValues(a.value[index], b.value[index]));
                    }
                    // TODO: 将排序后的list重新插入tbody中
                    let htmlstr = '';
                    for (let i = 0; i < list.length; i++) {
                        let str = '';
                        for (let j = 0; j < list[i].value.length; j++) {
                            str += `<td>${list[i].value[j]}</td>`;
                        }
                        htmlstr += "<tr>" + str + "</tr>";
                    }
                    tbody.innerHTML = htmlstr;
                });
            });
        },
        getBodyList(trs) {
            return trs.map((tr, index) => {
                // TODO: 获取tr的所有td节点，并将其转为数组
                const tds = Array.prototype.slice.call(tr.children)
                // TODO: 将td的内容转为字符串
                const val = tds.map(td => td.innerHTML);
                return { tr: tr, value: val };
            });
        },
        isAsc(list, index) {
            // TODO: 判断list的value中第index个值是否为升序排列
            for (let i = 1; i < list.length; i++) {
                if (this.compareValues(list[i].value[index], list[i - 1].value[index]) < 0) {
                    return false;
                }
            }
            return true;
        },
        compareValues(value1, value2) {
            // 比较两个值的大小，支持字符串和数字比较
            const num1 = parseFloat(value1);
            const num2 = parseFloat(value2);
            if (!isNaN(num1) && !isNaN(num2) && !value1.includes("-") && !value2.includes("-")) {
                return num1 - num2;
            } else {
                return value1.toString().localeCompare(value2.toString());
            }
        }
    };

    order.init({
        // TODO: 获取table节点
        el: table
    });
})();