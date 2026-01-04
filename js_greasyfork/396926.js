// ==UserScript==
// @name         ZUA课表导出
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  导出郑州航院课程表为ics文件
// @author       yangwu
// @match        http://202.196.166.135/*
// @match        http://202.196.166.136/*
// @match        http://202.196.166.138/*
// @match        http://202.196.166.139/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396926/ZUA%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/396926/ZUA%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const CRLF = "\r\n"
    function time_Deal(a) {//时间处理
        var class_begin;
        var class_end;
        var week_begin;
        var week_end;
        var week_one;
        var class1;
        var week1;
        week_one = a[1];
        class1 = a.match(/第.*节{/)[0];
        week1 = a.match(/{第.*周/)[0];
        class_begin = class1.substring(1, class1.indexOf(","));
        class_end = class1.substring(class1.indexOf(",") + 1, class1.length - 2);
        week_begin = week1.substring(2, week1.indexOf("-"));
        week_end = week1.substring(week1.indexOf("-") + 1, week1.length - 1);
        a = new Array();
        a.push(week_one);
        a.push(class_begin);
        a.push(class_end);
        a.push(week_begin);
        a.push(week_end);
        return a;
    }//时间处理
    //***************************************
    function weekswitch(i) {
        switch (i) {
            case '日': i = 6;
                break;
            case '一': i = 0;
                break;
            case '二': i = 1;
                break;
            case '三': i = 2;
                break;
            case '四': i = 3;
                break;
            case '五': i = 4;
                break;
            case '六': i = 5;
                break;
        }
        return i;
    }
    function classEndSwitch(i) {
        switch (i) {
            case '1': i = '0845';
                break;
            case '2': i = '0940';
                break;
            case '3': i = '1045';
                break;
            case '4': i = '1140';
                break;
            case '5': i = '1515';
                break;
            case '6': i = '1610';
                break;
            case '7': i = '1715';
                break;
            case '8': i = '1810';
                break;
            case '9': i = '2015';
                break;
            case '10': i = '2110';
                break;
        }
        return i;
    }
    function classBeginSwitch(i) {
        switch (i) {
            case '1': i = '0800';
                break;
            case '2': i = '0855';
                break;
            case '3': i = '1000';
                break;
            case '4': i = '1055';
                break;
            case '5': i = '1430';
                break;
            case '6': i = '1525';
                break;
            case '7': i = '1630';
                break;
            case '8': i = '1725';
                break;
            case '9': i = '1930';
                break;
            case '10': i = '2025';
                break;
        }
        return i;
    }
    function data_get() {
        var iframe = window.top.document.getElementById('iframeautoheight');
        var ifdocument = iframe.contentWindow.document;
        var couse = ifdocument.getElementsByClassName("datelist ");
        var couses = new Array;
        for (var i = 0; i < couse[0].rows.length; i++) {
            couses[i] = new Array;
            for (var j = 0; j < 10; j++) {
                var info = couse[0].rows[i].cells[j].innerHTML;
                couses[i].push(info);
            }
        }
        var data = new Array;
        for (i = 0; i < couses.length; i++) {
            data[i] = new Array;
            data[i].push(couses[i][2]);//课程名称
            data[i].push(couses[i][5]);//教师
            data[i].push(couses[i][8]);//时间
            data[i].push(couses[i][9]);//地点
        }
        for (i = 1; i < data.length; i++) {
            data[i][0] = data[i][0].match(/>.*</)[0].substring(1, data[i][0].match(/>.*</)[0].length - 1);
            data[i][1] = data[i][1].match(/>.*</)[0].substring(1, data[i][1].match(/>.*</)[0].length - 1);
            data[i][2] = data[i][2].match(/>.*</)[0].substring(1, data[i][2].match(/>.*</)[0].length - 1);
        }
        return data
    }
    //数据获取
    //**************************************
    function classDorS(b) {
        if (b.indexOf(";") != -1) {//存在；即为多节课
            b = b.split(";")
        }
        return b;
    }//多节判断
    //*********************************************
    function dataDeal(a) {
        for (var i = 1; i < a.length; i++) {
            a[i][2] = classDorS(a[i][2]);
            a[i][3] = classDorS(a[i][3]);
            if (a[i][2].length < 5) {
                for (var j = 0; j < a[i][2].length; j++) {
                    a[i][2][j] = time_Deal(a[i][2][j]);
                }
            }
            else {
                a[i][2] = time_Deal(a[i][2]);
            }
        }
        return a;

    }
    function firstD(d) {
        var nian = d.split("-");
        var c = new Date();
        c.setFullYear(nian[0], nian[1] - 1, nian[2]);
        return c;
        console.log(c);
    }
    function kaishiriqi(a, b) {
        var c = new Date(firstD(b).getFullYear(),firstD(b).getMonth());
        c.setDate(firstD(b).getDate() + weekswitch(a[0]) + (a[3] - 1) * 7);
        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };

            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(
                        RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }

            return fmt;
        }
        c = c.format("yyyyMMdd");
        return c;
        console.log(c);
    }
    function genFinal(init) {
        var result = "";
        for (var i = 0; i < init.length; ++i) {
            var finalLine = "";
            var line = init[i];
            var len = line.length;
            if (len > 60) {
                var remain_len = len;
                var index = 0;
                while (remain_len > 0) {
                    for (var j = 0; j < index; ++j)
                        result += SPACE;
                    result += line.slice(0, 60);
                    line = line.slice(61);
                    remain_len -= 60;
                    index++;
                }
                line.slice(0, 60);
            }
            else
                finalLine = line;
            result += line + CRLF;
        }
        return result;
    }
    function icsdata(a, c) {
        var b = new Array;
        b.push("BEGIN:VCALENDAR");
        b.push("PRODID:-//TypeScript/Node.js//ZUA Course Exporter v1.0//CN");
        b.push("VERSION:2.0");
        for (var i = 1; i < a.length; i++) {
            if (a[i][2] != "") {
                if (a[i][2].length != 5) {
                    for (var j = 0; j < a[i][2].length; j++) {
                        b.push("BEGIN:VEVENT");
                        b.push("LOCATION:" + a[i][3][j]);
                        b.push("DTSTART;TZID='China Standard Time':" + kaishiriqi(a[i][2][j], c) + 'T' + classBeginSwitch(a[i][2][j][1]) + '00');
                        b.push("DTEND;TZID='China Standard Time':" + kaishiriqi(a[i][2][j], c) + 'T' + classEndSwitch(a[i][2][j][2]) + '00');
                        b.push("SUMMARY;LANGUAGE=zh-cn:" + a[i][0] + "(" + a[i][1] + ")");
                        if(a[i][2][j][4].search("单")!=-1||a[i][2][j][4].search("双")!=-1){
                            b.push("RRULE:FREQ=WEEKLY;COUNT="+((a[i][2][j][4].match(/\d+/i)-a[i][2][j][3])/2+1)+";INTERVAL=2")
                        }else if(a[i][2][j][4].search("单")==-1 && a[i][2][j][4].search("双")==-1){
                            b.push("RRULE:FREQ=WEEKLY;COUNT="+(a[i][2][j][4].match(/\d+/i)-a[i][2][j][3]+1))
                        }
                        b.push("END:VEVENT");
                    }
                }
                else {
                    b.push("BEGIN:VEVENT");
                    b.push("LOCATION:" + a[i][3]);
                    b.push("DTSTART;TZID='China Standard Time':" + kaishiriqi(a[i][2], c) + 'T' + classBeginSwitch(a[i][2][1]) + '00');
                    b.push("DTEND;TZID='China Standard Time':" + kaishiriqi(a[i][2], c) + 'T' + classEndSwitch(a[i][2][2]) + '00');
                    b.push("SUMMARY;LANGUAGE=zh-cn:" + a[i][0] + "(" + a[i][1] + ")");
                    if(a[i][2][4].search("单")!=-1||a[i][2][4].search("双")!=-1){
                        b.push("RRULE:FREQ=WEEKLY;COUNT="+((a[i][2][4].match(/\d+/i)-a[i][2][3])/2+1)+";INTERVAL=2")
                    }else if(a[i][2][4].search("单")==-1 && a[i][2][4].search("双")==-1){
                        b.push("RRULE:FREQ=WEEKLY;COUNT="+(a[i][2][4].match(/\d+/i)-a[i][2][3]+1))
                    }
                    b.push("END:VEVENT");
                }

            }

        }
        b.push("END:VCALENDAR");
        console.log(b);
        return b;
    }
    function danshuang(a){
        for(var i=1;i<a.length;i++){
            if(a[i][2].length!=5){
                for(var j=0;j<a[i][2].length;j++){
                    if(a[i][2][j][4].search("双")!=-1){
                        if(a[i][2][j][3]%2!=0){
                            a[i][2][j][3]=String(Number(a[i][2][j][3])+1);
                        }
                        if(Number(a[i][2][j][4].match(/\d+/i))%2!=0){
                            a[i][2][j][4]=a[i][2][j][4].replace(a[i][2][j][4].match(/\d+/i),Number(a[i][2][j][4].match(/\d+/i))-1);}
                    }
                    if(a[i][2][j][4].search("单")!=-1){
                        if(a[i][2][j][3]%2==0){
                            a[i][2][j][3]=String(Number(a[i][2][j][3])+1);
                        }
                        if(Number(a[i][2][j][4].match(/\d+/i))%2==0){
                            a[i][2][j][4]=a[i][2][j][4].replace(a[i][2][j][4].match(/\d+/i),Number(a[i][2][j][4].match(/\d+/i))-1);}
                    }
                }
            }else if(a[i][2][4].search("双")!=-1){
                if(a[i][2][3]%2!=0){
                    a[i][2][3]=String(Number(a[i][2][3])+1);
                }
                if(Number(a[i][2][4].match(/\d+/i))%2!=0){
                    a[i][2][4]=a[i][2][4].replace(a[i][2][4].match(/\d+/i),Number(a[i][2][4].match(/\d+/i))-1);}
            }else if(a[i][2][4].search("单")!=-1){
                if(a[i][2][3]%2==0){
                    a[i][2][3]=String(Number(a[i][2][3])+1);
                }
                if(Number(a[i][2][4].match(/\d+/i))%2==0){
                    a[i][2][4]=a[i][2][4].replace(a[i][2][4].match(/\d+/i),Number(a[i][2][4].match(/\d+/i))-1);}
        }}
        return a;
    }
    const PAGE = {
        "main": /xs_main.aspx/,
        "course_table": /xsxkqk.aspx/
    };
    const iframe = document.querySelector("#iframeautoheight");
    if (iframe) {
        iframe.addEventListener('load', function () {
            const content = iframe.contentDocument || iframe.contentWindow.document;
            const URL = content.location.href;
            if (PAGE["course_table"].test(URL)) {
                const inject_td = content.querySelector('.search_con');
                const inject_p = content.createElement("p");
                const export_span = content.createElement("span");
                const export_first_day = content.createElement('input');
                const export_btn = content.createElement('button');
                const dwn_anchor = content.createElement("a");
                dwn_anchor.innerHTML = "Download the .ics file";
                dwn_anchor.style.visibility = "hidden";
                inject_p.appendChild(export_span);
                inject_p.appendChild(export_first_day);
                inject_p.appendChild(export_btn);
                inject_p.appendChild(dwn_anchor);
                inject_td.appendChild(content.createElement("br"));
                inject_td.appendChild(inject_p);
                export_span.innerHTML = "   这个学期的第一个星期一是：";
                export_first_day.type = "date";
                export_first_day.value = "2020-02-24";
                export_btn.innerText = "导出课表";
                export_btn.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    var data_1 = data_get();
                    dataDeal(data_1);
                    data_1=danshuang(data_1);
                    console.log(data_1);
                    dwn_anchor.style.visibility = "visible";
                    var result = genFinal(icsdata(data_1, export_first_day.value));
                    var link = window.URL.createObjectURL(new Blob([result], {
                        type: "text/x-vCalendar"
                    }));
                    dwn_anchor.setAttribute("href", link);
                    dwn_anchor.setAttribute("download", "cal.ics");
                })
            }
        })
    }

    // Your code here...
})();