// ==UserScript==
// @name         竞彩胜率计算器
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  用于彩客网-混合竞彩足球玩法的数据辅助统计, 用于彩客网-混合竞彩足球玩法的数据辅助统计，该脚本实现了以下功能： 1. 右边展示出了当天比赛结果的数据统计 2. 日期下拉框在原有的基础上展示了32天的日期选项，可以很方便的查看历史数据。 3. 计算除了每场比赛赔率对应的胜平负概率，统计累加概率和，判断是否有超过100% . 比赛交流请加微信：helloworld116133
// @author       hinjin@innben.com
// @license      MIT
// @include      https://www.310win.com/buy/JingCaiHunhe.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=310win.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481360/%E7%AB%9E%E5%BD%A9%E8%83%9C%E7%8E%87%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/481360/%E7%AB%9E%E5%BD%A9%E8%83%9C%E7%8E%87%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let flag = false;

    function setOps(){
        setTimeout(() => {
            let count = 0;
            if (!flag) {
                let ops = document.querySelectorAll('.op');
                let total = 0;
                ops.forEach((ele,index) => {
                    let html = ele.innerHTML;
                    if (!ele.innerHTML) {
                        count ++;
                        return true;
                    }
                    let newHtml = html.replace(/(\d{1,2}\.\d{2})/g, ($0, $1) => {
                        let number = +(90 / $1).toFixed(2);
                        if (Infinity == number) debugger
                        total += number;
                        return `${$1}<br>${number}%`;
                    });
                    ele.innerHTML = newHtml;
                    if ((index + 1) % 3 == 0) {
                        let td = ele.parentNode.querySelectorAll('td')[6];
                        td.innerHTML = td.innerHTML.replace(/(\d-\d)/g, ($0, $1) => `${$1}<br>${total.toFixed(2)}%`);
                        total = 0;
                    }
                });
                if (count <= ops.length) flag = true;
                else return setOps();
            }
        }, 500);
    }

    // 填充下拉选项
    function fillOption(){
        let now = new Date();
        let current = location.href.indexOf('date=') > -1 ? location.href.replace(/^.+date=/, '') : `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`;
        let tdRadio2 = document.querySelector('.tdRadio2');
        let selects = tdRadio2.querySelectorAll('select');
        let select = selects[selects.length - 1];
        select.innerHTML = '';
        let today = current ? new Date(current) : now;

        if (today.getTime() < now.getTime()) {
            today.setMonth(today.getMonth() + 1);
            today.setDate(1);
        }

        let yearMonth = `${today.getFullYear()}-${today.getMonth() + 1}-`;
        let day = today.getDate();
        let stop = false;
        while(day >= 0){
            if (day == 0) {
                yearMonth = `${today.getFullYear()}-${today.getMonth() + 1}-`;
                day = today.getDate();
                stop = true;
            }
            if (today.getTime() > now.getTime()) {
                day--;
                today = new Date(today.getTime() - 86400000);
                continue;
            };

            let newDate = yearMonth + day;
            let option = document.createElement('option');
            option.value = newDate;
            option.text = newDate;
            if (current == newDate) option.selected = true;
            select.appendChild(option);

            if (stop && (today.getMonth() != new Date(current).getMonth()) ) break;

            day--;
            today = new Date(today.getTime() - 86400000);
        }
    }

    // 统计每天比赛结果的分布
    function statistic(){
        let bonuses = document.querySelectorAll('.bonus');
        let datas = {
            ['盘路']: {
                '上盘': [],
                '走水': [],
                '下盘': []
            },
            ['胜平负']: {},
            ['让球-1']: {},
            ['让球+1']: {},
            ['让球-2']: {},
            ['让球+2']: {},
            ['让球-3']: {},
            ['让球+3']: {},
            ['半全场']: {},
            ['进球数']: {},
        };
        bonuses.forEach(item => {
            let parent = item.parentNode;
            let key = parent.firstChild.textContent;
            if (parent.className == 'hunhe_2') key = '比分';
            if (!datas[key]) datas[key] = {};
            let result = item.firstChild.textContent;
            if (!datas[key][result]) datas[key][result] = [];
            if (key.indexOf('-') > -1 && result == '胜') datas['盘路']['上盘'].push(item.childNodes[2].textContent);
            if (key.indexOf('+') > -1 && result == '负') datas['盘路']['上盘'].push(item.childNodes[2].textContent);
            if (key.indexOf('+') > -1 && result == '胜') datas['盘路']['下盘'].push(item.childNodes[2].textContent);
            if (key.indexOf('-') > -1 && result == '负') datas['盘路']['下盘'].push(item.childNodes[2].textContent);
            if (key.indexOf('+') > -1 && result == '平') datas['盘路']['走水'].push(item.childNodes[2].textContent);
            if (key.indexOf('-') > -1 && result == '平') datas['盘路']['走水'].push(item.childNodes[2].textContent);
            datas[key][result].push(item.childNodes[2].textContent);
        });

        console.log({datas});

        let count = {};
        let avg = {};

        let html = ``;

        let index = 0;
        for (let key in datas) {
            count[key] = Object.values(datas[key]).reduce((total, item) => total + item.length, 0);
            html += `<div style="">`;
            html += `<h2 class="sctitle2" style="margin-top:-1px;"><span style="display:inline-block;background-color: #4469B2;border-radius: 50%;width: 20px;height: 20px;color: #fff;text-align: center;vertical-align: middle;line-height: 20px;margin: 6px;font-weight: bold;">${++index}</span><b>${key}</b></h2>`;
            if (!avg[key]) avg[key] = {};
            html += `<div class="td_div2"><table style="display: flex;align-items: center;overflow: auto;padding: 6px; text-align: center;">`;
            html += `<tr><th>结果</th><th>次数</th><th>占比</th><th>平均sp</th></tr>`;

            let max = Object.values(datas[key]).sort((a,b) => b.length - a.length)[0];
            for (let k in datas[key]) {
                avg[key][k] = datas[key][k].length ? (datas[key][k].reduce((total, sp) => total + +sp, 0) / datas[key][k].length).toFixed(2) : 0;
                html += `<tr style="${max.length == datas[key][k].length ? 'color: red;' : ''}"><td class="tdtitle2">${k}</td><td>${datas[key][k].length}</td><td>${datas[key][k].length ? (datas[key][k].length / count[key] * 100).toFixed(2) : 0}%</td><td>${avg[key][k]}</td></tr>`;
            }
            html += `</table></div>`;
            html += `</div>`;
        }

        let screenWidth = document.querySelector('#new_mbt').offsetWidth;
        let containerWidth = document.querySelector('#tz_jm').offsetWidth;
        let newElement = document.createElement('div');
        newElement.style.cssText = `position: absolute;right: 0;top: 80px;width: ${(screenWidth - containerWidth) / 2 - 5}px;`;
        newElement.id = 'result-statistic';
        newElement.innerHTML = html;
        document.body.appendChild(newElement);
        //document.querySelector('.tdRadio2').parentNode.insertBefore(newElement,document.querySelector('.tdRadio2').nextSibling);
    }

    function onLoad(){
        setOps();
        statistic();
        fillOption();
    }
    window.addEventListener('load', onLoad);
})();