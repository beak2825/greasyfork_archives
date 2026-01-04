// ==UserScript==
// @name         HEU课表生成器
// @namespace    greasyfork.org/zh-CN/users/816568-chichow5
// @version      0.5
// @home-url     https://greasyfork.org/zh-CN/users/816568-chichow5
// @description  哈尔滨工程大学 / HEU course iCalendar generator/ HEU ics格式课表生成器
// @author       Chi Chow 201906
// @match        *://*.hrbeu.edu.cn/jsxsd/xskb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432589/HEU%E8%AF%BE%E8%A1%A8%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/432589/HEU%E8%AF%BE%E8%A1%A8%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==
 
'use strict';
 
var mp = [];
var courses = [];
var type;
var alarm = -1;
var reminder = -1;
var box;
var year, month, day;
 
class Course{
    constructor(raw, w, tweek){
        this.weekday = w
        this.name = raw[0]
        if(raw[1].endsWith('\(周\)')){
            this.teacher = raw[0]
            let t = raw[1].indexOf('-')
            if (t === -1){
                this.start_week = this.end_week = parseInt(raw[1])
            }else{
                this.start_week = parseInt(raw[1].substring(0, t))
                this.end_week = parseInt(raw[1].substring(t+1))
            }
            t = raw[2].substring(0, raw[2].length-2)
            this.start_time = parseInt(t.substring(1, 3))
            this.end_time = parseInt(t.substring(t.length-2))
            this.location = raw[3]
            this.flag = (this.start_time === this.end_time && this.start_time === 1);
            this.wasted = false;
        }
        else{
            this.teacher = raw[1]
            let t = tweek.indexOf('-')
            if (t === -1){
                this.start_week = this.end_week = parseInt(tweek)
            }else{
                this.start_week = parseInt(tweek.substring(0, t))
                this.end_week = parseInt(tweek.substring(t+1))
            }
            t = raw[3].substring(0, raw[3].length-2)
            this.start_time = parseInt(t.substring(1, 3))
            this.end_time = parseInt(t.substring(t.length-2))
            this.location = raw[4]
            this.flag = (this.start_time === this.end_time && this.start_time === 1);
            this.wasted = false;
        }
    }
 
    show(){
        return 'Week:' + this.weekday + '\n'
             + 'Name:' + this.name + '\n'
             + 'Teac:' + this.teacher + '\n'
             + 'Dura:' + this.start_week + '-' + this.end_week + '\n'
             + 'Time:' + this.start_time + '-' + this.end_time + '\n'
             + 'Loca:' + this.location + '\n';
    }
    generateEvent(){
        let result = ""
            + "BEGIN:VEVENT\r\n"
            + "CATEGORIES:课程\r\n";
        let det = 7 * this.start_week + this.weekday - 8;
 
        result += "DTSTART;TZID=Asia/Shanghai:" + mp[det]
            + getStartTime(type, this.start_time, this.end_time) + '\r\n';
        result += "DTEND;TZID=Asia/Shanghai:" + mp[det]
            + getEndTime(type, this.start_time, this.end_time) + '\r\n';
        //result += "UID:" + uuidv4()+'\r\n';
        //result += "DTSTAMP:20210919T111500Z\r\n"
        if (this.start_week != this.end_week){
            result += ""
                + "RRULE:FREQ=WEEKLY;WKST=MO;COUNT="
                + (this.end_week-this.start_week+1)
                + ";BYDAY=" + getWeekEn(this.weekday)+'\r\n';
        }
 
        result += ""
            + "DESCRIPTION:"+this.teacher+'\r\n'
            + "LOCATION:"+this.location+'\r\n'
            + "SUMMARY:"+this.name+'\r\n';
 
        result += ""
            + "SEQUENCE:0\r\n"
            + "TRANSP:OPAQUE\r\n";
        if (reminder != -1){
            result += ""
                + "BEGIN:VALARM\r\n"
                //+ "X-WR-ALARMUID:" + uuidv4()+'\r\n'
                + "TRIGGER:-PT" + reminder + "M\r\n"
                + "ACTION:DISPLAY\r\n"
                + "DESCRIPTION:" + this.location + " "+ this.name + "\r\n"
                + "END:VALARM\r\n";
        }
        if (alarm != -1){
            result += ""
                + "BEGIN:VALARM\r\n"
                + "TRIGGER:-PT" + alarm + "M\r\n"
                + "ACTION:AUDIO\r\n"
                + "END:VALARM\r\n"
        }
        result += "END:VEVENT\r\n";
        return result;
    }
 
}
 
 
UI();
 
function doit(){
    /*初始化重新读入*/
    alarm = -1;
    reminder = -1;
 
    let re = getParam();
 
    //console.log(alarm);
    if (re === false){
        console.log('param get error');
        return;
    }
    let ics = generateCalendar();
    let ele = document.createElement('a');
    ele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ics));
    ele.setAttribute('download', 'output.ics');
    ele.style.display = 'none';
    box.appendChild(ele);
 
    alert("课表不保证完全正确，请导入到新建的日历表中，便于管理");
    ele.click();
 
    box.removeChild(ele);
}
 
function UI(){
    if (document.getElementById('kbtable') == null) return;
    box = document.createElement('div');
    box.id = 'myAlertBox';
    box.innerHTML += '请输入当前学期第一周周一的年月日<br>'
                   + '<input type="number" placeholder="年" id="ig_year" style="width:110px;height:20px;">&nbsp;'
                   + '<input type="number" placeholder="月" max=12 min=1 id="ig_month" style="width:60px;height:20px;">&nbsp;'
                   + '<input type="number" placeholder="日" max=31 min=1 id="ig_day" style="width:60px;height:20px;">&nbsp;'
                   + '<br><div style="height:2px"></div>第3-4节课是否延后'
                   + '<select name="ig_type" id="ig_type" style="height:20px;">'
                       + '<option value>请选择</option>'
                       + '<option value="2">是</option>'
                       + '<option value="1">否</option>'
                   + '</select>'
                   + '<br><div style="height:2px"></div>添加闹钟&nbsp;&nbsp;'
                   + '<input type="checkbox" id="ig_alarm">&nbsp;&nbsp;'
                   + '<input type="number" id="ig_alarm_time" value="20" style="width:60px;height:20px;" min=0>&nbsp;分钟'
                   + '<br><div style="height:2px"></div>添加提醒&nbsp;&nbsp;'
                   + '<input type="checkbox" id="ig_reminder">&nbsp;&nbsp;'
                   + '<input type="number" id="ig_reminder_time" value="20" style="width:60px;height:20px;" min=0>&nbsp;分钟'
                   + '<br><button id="ig_do">生成</button>'
                   + '<br>*&nbsp;本脚本参考RFC关于iCalendar部分'
                   + '以及其他互联网文档，由于软件实现或者作者个人水平原因，<font color="red">提醒和闹钟不一定起作用</font>';
 
    box.style.cssText =
    ' background: white;     ' +
    ' border: 2px solid red; ' +
    ' padding: 4px;          ' +
    ' position: absolute;    ' +
    ' top: 90px; right: 8px;' +
    ' max-width: 300px;      ';
    //' font-size :16px        ';
    document.body.appendChild( box );
    document.getElementById("ig_do").addEventListener("click", doit, false);
}
 
function getParam(){
    year = document.getElementById("ig_year").value;
    month = document.getElementById("ig_month").value;
    day = document.getElementById("ig_day").value;
    let se = document.getElementById("ig_type").value;
    let ck_alarm = document.getElementById('ig_alarm');
    let ck_reminder = document.getElementById('ig_reminder');
    let t_alarm = document.getElementById('ig_alarm_time').value;
    let t_reminder = document.getElementById('ig_reminder_time').value;
    if (year === "" || month === "" || day === ""){
        alert('时间未设置！');
        return false;
    }
    year = year = parseInt(year);
    if (year <= 0){
        alert('年份超出范围！');
        return false;
    }
    month = month = parseInt(month);
    if (month <= 0 || month >= 13){
        alert('月份超出范围');
        return false;
    }
    day = day = parseInt(day);
    if (day <= 0 || day > daysOfMonth(month, year)){
        alert('日超出范围');
        return false;
    }
    if (se === ""){
        alert('未选择3-4节课是否延后！');
        return false;
    }
    type = parseInt(se);
    if (ck_alarm.checked){
        if (t_alarm === ""){
            alert("闹钟时间未设置！");
            return false;
        }
        alarm = parseInt(t_alarm);
        if (alarm < 0){
            alert("闹钟时间是负数！");
            return false;
        }
    }
    if (ck_reminder.checked){
        if (t_reminder === ""){
            alert("提醒时间未设置！");
            return false;
        }
        reminder = parseInt(t_reminder);
        if (reminder < 0){
            alert("提醒时间是负数！");
            return false;
        }
    }
    return true;
}
 
function generateCalendar(){
    for (let i = 0; i < 365; i ++){
        let t = year+"";
        t += (month<=9)?("0"):"";
        t += ""+month;
        t += (day<=9)?"0":"";
        t += ""+day;
        mp.push(t);
        day += 1;
        if (day-1 === daysOfMonth(year, month)){
            day = 1;
            month ++;
            if (month == 13){
                month = 1;
                year++;
            }
        }
    }
 
    var content = ""
                + "BEGIN:VCALENDAR\r\n"
                + "VERSION:2.0\r\n"
                + "PRODID:HEU iCalendar Gen. By Chi Chow\r\n"
                + "CALSCALE:GREGORIAN\r\n"
                + "METHOD:PUBLISH\r\n"
                + "X-WR-CALNAME:导出的课表\r\n"
                + "X-WR-TIMEZONE:Asia/Shanghai\r\n"
                + "BEGIN:VTIMEZONE\r\n"
                + "TZID:Asia/Shanghai\r\n"
                + "X-LIC-LOCATION:Asia/Shanghai\r\n"
                + "BEGIN:STANDARD\r\n"
                + "TZOFFSETFROM:+0800\r\n"
                + "TZOFFSETTO:+0800\r\n"
                + "TZNAME:CST\r\n"
                + "DTSTART:19700101T000000\r\n"
                + "END:STANDARD\r\n"
                + "END:VTIMEZONE\r\n";
 
    CourseFactory();
    let events = ""
    for (let i = 0; i < courses.length; i ++){
        if (courses[i].wasted) continue;
        events += courses[i].generateEvent();
    }
    content += events;
 
    content += "END:VCALENDAR\r\n";
    return content;
}
/**
 * 通过年月获取天数
 */
function daysOfMonth(year, month){
    switch(month){
        case 2:{
            let f = (year % 4 === 0);
            if (year % 100 === 0) f = false;
            if (year % 400 === 0) f = true;
            return f?29:28;
        }
        case 4:
        case 6:
        case 9:
        case 11: return 30;
        default: return 31;
    }
}
 
function CourseFactory(){
    let table = document.getElementById('kbtable');
    if (table == null) return;
    let items = table.getElementsByClassName('kbcontent');
    for (let i = 0; i < items.length; i ++){
        /*删除'<>'以及包含的htnl元素，和'&nbsp;'*/
        let c = items.item(i).innerHTML.replace(/(<\/?[^>]+(>|$)|&nbsp;)/g, "\n").split("\n");
        let res = []
        c.forEach(function(item, index, array){
            let d = item.trim()
            /*删除空行以及'------'分割行*/
            if (d.length > 0 && d.charAt(0) != '-') res.push(d)
        })
 
        for (let j = 0; j < res.length; j += 5){
            /*时间不连续，按','分割，生成多个Course对象*/
            let e = res[j+2].substring(0,res[j+2].length-3).split(',');
            for (let k = 0; k < e.length; k ++){
                let cours = new Course(res.slice(j, j+5), (i%7)+1, e[k]);
                if (cours.flag){
                    /*时间显示为[01节]*/
                    switch(Math.floor(i/7)+1){
                        case 1:cours.start_time=1;cours.end_time=2;break;
                        case 2:cours.start_time=3;cours.end_time=5;break;
                        case 3:cours.start_time=6;cours.end_time=7;break;
                        case 4:cours.start_time=8;cours.end_time=10;break;
                        case 5:cours.start_time=11;cours.end_time=13;break;
                    }
                    /*与已添加的项合并*/
                    for (let l = 0; l < courses.length; l ++){
                        if (cc(courses[l], cours) && courses[l].end_time+1 === cours.start_time){
                            cours.wasted = true;
                            courses[l].end_time = cours.end_time;
                            break;
                        }
                    }
                }
                if (!cours.wasted) courses.push(cours);
            }
        }
    }
    /*查重*/
    for (let i = 0; i < courses.length; i ++){
        if (courses[i].wasted){continue;}
        for (let j = i + 1; j < courses.length; j ++){
            if (courses[j].wasted){continue;}
            if (cc(courses[i],courses[j])
                && courses[i].start_time===courses[j].start_time
                && courses[i].end_time === courses[j].end_time){
                //console.log(courses[i].show());
                //console.log(courses[j].show());
                courses[j].wasted=true;
            }
        }
    }
}
 
function cc(c1, c2){
    return c1.weekday === c2.weekday
        && c1.name === c2.name
        && c1.teacher === c2.teacher
        && c1.start_week === c2.start_week
        && c1.end_week === c2.end_week
        && c1.location == c2.location;
}
 
function getStartTime(type, start, end){
    switch(start){
        case 1:return 'T080000';
        case 2:return 'T085000';
        case 3:return (type==2&&end==4)?'T102000':'T095500';
        case 4:return (type==2&&end==4)?'T111000':'T104500';
        case 5:return 'T113500';
        case 6:return 'T133000';
        case 7:return 'T142000';
        case 8:return 'T152500';
        case 9:return 'T161500';
        case 10:return 'T170500';
        case 11:return 'T183000';
        case 12:return 'T192000';
        case 13:return 'T201000';
    }
}
 
function getEndTime(type, start, end){
    switch(end){
        case 1:return 'T084500';
        case 2:return 'T093500';
        case 3:return (type==2)?'T110500':'T104000';
        case 4:return (type==2)?'T115500':'T113000';
        case 5:return 'T122000';
        case 6:return 'T141500';
        case 7:return 'T150500';
        case 8:return 'T161000';
        case 9:return 'T170000';
        case 10:return 'T175000';
        case 11:return 'T191500';
        case 12:return 'T200500';
        case 13:return 'T205500';
    }
}
 
function getWeekEn(w){
    switch(w){
        case 1: return 'MO'
        case 2: return 'TU'
        case 3: return 'WE'
        case 4: return 'TH'
        case 5: return 'FR'
        case 6: return 'SA'
        case 7: return 'SU'
    }
}