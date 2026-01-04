// ==UserScript==
// @name         考勤时长统计
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://ehr.zbj.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373612/%E8%80%83%E5%8B%A4%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/373612/%E8%80%83%E5%8B%A4%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    var allTime = 0;
    function Day(date, first, last, parent, rowspan) {
        this.date = date;
        this.first = first;
        this.last = last;
        this.parent = parent;
        this.rowspan = rowspan;

        // excute date
        let dates = date.split('/');
        this.year = +dates[0];
        this.month = +dates[1] - 1;
        this.day = +dates[2];

    }
    Day.prototype.isNormal = function() {
        let td = document.createElement('td');
        td.style.color = "red";
        td.style.border = '1px solid';
        td.rowSpan = this.rowspan;
        if (!this.first || !this.last) {
            td.innerHTML = '只打了一次卡';
            this.parent.append(td);
            return;
        }

        let last = sepTime(this.last);
        let first = sepTime(this.first);
        let duration = new Date(this.year, this.month, this.day, last.hour, last.second) - new Date(this.year, this.month, this.day, first.hour, first.second);  //毫秒数
        allTime += duration /(60*60*1000)
        if (duration < (9*60*60*1000)) {
            // 早退
            td.innerHTML = '早退/旷工';
            this.parent.append(td);
            return;
        }
        td.style.color = "green";
        td.innerHTML = '正常 + 时长' + duration/(60*60*1000)  + '小时';
        this.parent.append(td);
    }
    function sepTime(timeString) {
        let times = timeString.split(':');
        let hour = +times[0];
        let second = +times[1];
        return {
            hour,
            second
        }
    }

    function getData() {
        // 控制台上要审查元素后才能获取该dom, 原因不明。
        var homeTable = document.getElementById('SG_ABS_EMP_DATA$scroll$0');
        var targetTable = homeTable.querySelectorAll('.PSLEVEL1GRID')[0];
        var targetTableTr = targetTable.querySelectorAll('tr');

        let targetTableTrs = Array.from(targetTableTr);
        let originData = [];
        let datas = [];

        targetTableTrs.forEach(tr => {
            let tds = tr.querySelectorAll('td');
            if(!tds.length) {
                return false;
            }
            let date,
                time;
            date = tds[1].querySelectorAll('span')[0].innerHTML;
            time = tds[2].querySelectorAll('span')[0].innerHTML;
            originData.push({
                parent: tr,
                date,
                time
            });
        });

        // 组合数据 生成day实例， 并判断
        originData.forEach(item => {
            let dateObj = datas.find(o => {
                return item.date == o.date;
            });

            if(dateObj) {
                if(item.time > dateObj.first || item.time > dateObj.last) {
                    dateObj.last = item.time;
                } else if(item.time < dateObj.first) {
                    dateObj.first = item.time;
                }
                dateObj.rowspan++;
            } else {
                item.first = item.time;
                item.rowspan = 1;
                datas.push(item);
            }
        });
        datas.useLength = 0;
        datas.forEach(day => {
            if (day.last) {
                datas.useLength++;
            }
            let dayInstance = new Day(day.date, day.first, day.last, day.parent, day.rowspan);
            dayInstance.isNormal();
        });
        var av = document.createElement('div');
        av.innerHTML = '日均时长：' + allTime/datas.useLength;
        var all = document.createElement('div');
        all.innerHTML = ' 总时长：' + allTime;
        document.body.appendChild(av);
        document.body.appendChild(all);

    }
    getData();
})();