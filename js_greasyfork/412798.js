// ==UserScript==
// @name         河科大课表导出
// @namespace    木偶ll
// @version      1.2
// @description  进入教务网络管理系统点击退选即可导出指定格式课表
// @author       木偶ll
// @match        *.haust.edu.cn/wsxk/stu_txjg.aspx
// @home-url     https://greasyfork.org/zh-CN/scripts/412798
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/412798/%E6%B2%B3%E7%A7%91%E5%A4%A7%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/412798/%E6%B2%B3%E7%A7%91%E5%A4%A7%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var body1 = document.querySelector('body');
    body1.removeAttribute('onselectstart');
    body1.removeAttribute('oncontextmenu');
    body1.removeAttribute('ondragstart');
    body1.removeAttribute('onsource');
    var classKc = [];
    var classKcSimple = [];
    var courseTimeObj = { 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7' };
    var courseTimeArr = ['零', '一', '二', '三', '四', '五', '六', '日'];
    var kcName;
    var teacher;
    var kcAdress;
    var tables = document.querySelectorAll('table');
    var hang = tables[3].rows;
    var teacherStr;
    for (var i = 2, num = 0; i < hang.length; i++, num++) {

        kcAdress = hang[i].querySelectorAll('td')[10];
        if ((kcAdress.innerHTML.indexOf('在线课程') != -1) || kcAdress.innerHTML == '<br>') {
            continue;
        }

        kcName = hang[i].querySelector('#showD').textContent;

        var courseName = kcName.substring((kcName.indexOf(']') + 1), kcName.length);

        teacherStr = '';
        teacher = hang[i].querySelectorAll('td')[4].querySelectorAll('a');
        for (var k = 0; k < teacher.length; k++) {
            teacherStr += teacher[k].innerText + '/';
        }
        var teachers = teacherStr.substring(0, teacherStr.length - 1);


        var flag = 0;
        var zhoushuEnd = 0;
        var zhoushuStart = 0;
        for (var n = 0; n < (kcAdress.innerHTML.split('星期')).length - 1; n++) {

            flag = kcAdress.innerHTML.indexOf('星期', flag) + 2;
            var xqStr = kcAdress.innerHTML.substring(flag, flag + 1);

            var ksjsSrt = kcAdress.innerHTML.indexOf('[', flag) + 1;
            var ksjsSrtTemp = kcAdress.innerHTML.indexOf('-', flag) + 1;
            var jsjsSrt = kcAdress.innerHTML.indexOf('节', flag);
            var startTime = kcAdress.innerHTML.substring(ksjsSrt, ksjsSrt + 1);
            var endTime = kcAdress.innerHTML.substring(ksjsSrtTemp, jsjsSrt);

            var courseAdressStartFlag = kcAdress.innerHTML.indexOf('/', flag) + 1;
            var courseAdressEndFlag = kcAdress.innerHTML.indexOf('<br>', flag);
            var courseAdress = kcAdress.innerHTML.substring(courseAdressStartFlag, courseAdressEndFlag);


            zhoushuEnd = kcAdress.innerHTML.indexOf('周', zhoushuEnd + 1);
            zhoushuStart = kcAdress.innerHTML.indexOf('[', zhoushuEnd - 6) + 1;
            var zhoushu = kcAdress.innerHTML.substring(zhoushuStart, zhoushuEnd);


            classKc[num] = new kcFunction(courseName, courseTimeObj[xqStr], startTime, endTime, teachers, courseAdress, zhoushu);

            num++;
        }
        num--;

    }

    function kcFunction(kcmc, xingqi, ksjs, jsjs, laoshi, didian, zhoushu) {
        this.courseName = kcmc;
        this.week = xingqi;
        this.startTime = ksjs;
        this.endTime = jsjs;
        this.teachers = laoshi;
        this.courseAdress = didian;
        this.zhoushu = zhoushu;
    };

    function SimpleTimeTablee(kcmc, laoshi, xingqi, ksjs, jsjs, didian, zhoushu) {
        this.courseName = kcmc;
        this.teachers = laoshi;
        this.week = courseTimeArr[xingqi];
        this.classTime = ksjs + '-' + jsjs;
        this.courseAdress = didian;
        this.zhoushu = zhoushu;
    };

    for (let i = 0; i < classKc.length; i++) {
        classKcSimple[i] = new SimpleTimeTablee(classKc[i].courseName, classKc[i].teachers, classKc[i].week, classKc[i].startTime, classKc[i].endTime, classKc[i].courseAdress, classKc[i].zhoushu);
    }

    var divs = document.createElement("div");
    divs.style = 'text-align:center;background-color:#f4fffb';
    document.body.insertBefore(divs, document.querySelector('table'));

    var SimpleBtn = document.createElement("button");
    SimpleBtn.innerHTML = '导出Simple格式课表';
    SimpleBtn.addEventListener("click", SimpleExport);
    SimpleBtn.style = 'margin:0 auto;font-size:30px;color:red';
    SimpleBtn.style.height = '60px';
    SimpleBtn.style.width = '322px'
    document.querySelector('div').appendChild(SimpleBtn);

    var btn = document.createElement("button");
    btn.innerHTML = '导出WakeUp格式课表';
    btn.addEventListener("click", dataExport);
    btn.style = 'margin:0 auto;font-size:30px;color:red';
    btn.style.height = '60px';
    btn.style.width = '322px'

    document.querySelector('div').appendChild(btn);

    var strSimple = '';
    for (let i = 0; i < classKcSimple.length; i++) {
        for (let item in classKcSimple[i]) {
            strSimple += `${classKcSimple[i][item]},`;
        }
        strSimple = strSimple.substring(0, strSimple.length - 1) + '\n';
    }

    var str = '课程名称,星期,开始节数,结束节数,老师,地点,周数\n';
    for (let i = 0; i < classKc.length; i++) {
        for (let item in classKc[i]) {
            str += `${classKc[i][item]},`;
        }
        str = str.substring(0, str.length - 1) + '\n';
    }

    var myDate = new Date();
    var grade, fileName;
    if ((myDate.getMonth() + 1) >= 2 & (myDate.getMonth() + 1) <= 8) {
        grade = myDate.getFullYear() - document.querySelectorAll('table')[2].rows[0].innerText.substring(8, 12);
        fileName = '大' + courseTimeArr[grade] + '下学期课表'
    }
    else {
        grade = myDate.getFullYear() - document.querySelectorAll('table')[2].rows[0].innerText.substring(8, 12) + 1;
        fileName = '大' + courseTimeArr[grade] + '上学期课表'
    }

    function dataExport() {

        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);

        let link = document.createElement("a");
        link.href = uri;

        link.download = fileName + '.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function SimpleExport() {

        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(strSimple);

        let link = document.createElement("a");
        link.href = uri;

        link.download = fileName + '.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();