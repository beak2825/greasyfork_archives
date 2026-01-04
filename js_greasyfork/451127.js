// ==UserScript==
// @name         西大课表转ics
// @namespace    https://lers.top
// @version      1.1
// @description  西南大学课程表转.ics
// @author       Lers梦魔
// @match        http://jw-swu-edu-cn.sangfor.vpn.swu.edu.cn:8118/jwglxt/kbcx/*
// @match        http://jw.swu.edu.cn/jwglxt/kbcx/*
// @icon         https://img.afqaq.com/images/2022/03/14/favicon-32x32.png
// @license BSD
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/451127/%E8%A5%BF%E5%A4%A7%E8%AF%BE%E8%A1%A8%E8%BD%ACics.user.js
// @updateURL https://update.greasyfork.org/scripts/451127/%E8%A5%BF%E5%A4%A7%E8%AF%BE%E8%A1%A8%E8%BD%ACics.meta.js
// ==/UserScript==

//---------------------------------静态配置------------------------------------------
// 学期第一周星期一
var TERM_START = "2022-09-05"
// ics文件开头
const ICS_Start = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//lers梦魔//SWU Ics Exporter v1.1//CN\n"
// ics文件时区
const ICS_Timezone1 = "BEGIN:VTIMEZONE\nTZID:Asia/Shanghai\n"
const ICS_Timezone2 = "LAST-MODIFIED:20220816T024022Z\nTZURL:http://tzurl.org/zoneinfo-outlook/Asia/Shanghai\nX-LIC-LOCATION:Asia/Shanghai\n"
const ICS_Timezone3 = "BEGIN:STANDARD\nTZNAME:CST\nTZOFFSETFROM:+0800\nTZOFFSETTO:+0800\nDTSTART:19700101T000000\nEND:STANDARD\nEND:VTIMEZONE\n"
// ics文件结尾
const ICS_End = "END:VCALENDAR"
// 课程时间安排
const Timetable = {
  // 节数:[开始时间,结束时间]
  "1": ["08:00", "08:45"],
  "2": ["08:55", "09:40"],
  "3": ["10:00", "10:45"],
  "4": ["10:55", "11:40"],
  "5": ["12:10", "12:55"],
  "6": ["13:05", "13:50"],
  "7": ["14:00", "14:45"],
  "8": ["14:55", "15:40"],
  "9": ["15:50", "16:35"],
  "10": ["16:55", "17:40"],
  "11": ["17:50", "18:35"],
  "12": ["19:20", "20:05"],
  "13": ["20:15", "21:00"],
  "14": ["21:10", "21:55"]
}
// 总周数
const TOTALWEEK = 20

//---------------------------------全局变量------------------------------------------
// 课表解析载体
var TABLE = {
  "termStart": "", // 学期第一天星期一
  "termEnd": "", // 学期最后一天
  "kbList": []
}
//---------------------------------ics生成函数---------------------------------------
class ICS {
  constructor() {
    this.table = TABLE // 解析后课表内容
    this.dtstamp = TABLE.termStart + "T063157z\n"
    this.ICS = ""
  }
  format_Class (element) {
    var body = "BEGIN:VEVENT\nDTSTAMP:" + this.dtstamp
    body += "UID:" + element.UID + "\n"
    body += "SUMMARY:" + element.SUMMARY + "\n"
    body += "DTSTART;TZID=" + element.DTSTART + "\n"
    body += "DTEND;TZID=" + element.DTEND + "\n"
    if (element.FREQ != "x") {
      body += "RRULE:FREQ=" + element.FREQ + ";UNTIL=" + element.UNTIL + ";INTERVAL=" + element.INTERVAL + "\n"
    }
    body += "LOCATION:" + element.LOCATION + "\n"
    body += "DESCRIPTION:" + element.DESCRIPTION1 + "\n"
    body += "BEGIN:VALARM\nACTION:DISPLAY\nTRIGGER;RELATED=START:-PT20M\n"
    body += "DESCRIPTION:" + element.DESCRIPTION2 + "\n"
    body += "END:VALARM\nEND:VEVENT\n"
    return body
  }
  init_ICS () {
    this.ICS += ICS_Start + ICS_Timezone1 + ICS_Timezone2 + ICS_Timezone3
    this.table.kbList.forEach(element => {
      this.ICS += this.format_Class(element)
    })
    this.ICS += ICS_End
  }
  // 下载函数
  download_ICS (fileName, content) {
    var aTag = document.createElement('a')
    var blob = new Blob([content])
    aTag.download = fileName
    aTag.href = URL.createObjectURL(blob)
    aTag.click()
    URL.revokeObjectURL(blob)
  }

}

//---------------------------------工具函数------------------------------------------
// hook函数
function addXMLRequestCallback (callback) {
  var oldSend, i
  if (XMLHttpRequest.callbacks) {
    //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
    XMLHttpRequest.callbacks.push(callback)
  } else {
    XMLHttpRequest.callbacks = [callback]
    //如果不存在则在xmlhttprequest函数下创建一个回调列表
    oldSend = XMLHttpRequest.prototype.send
    //获取旧xml的send函数，并对其进行劫持
    XMLHttpRequest.prototype.send = function () {
      for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
        XMLHttpRequest.callbacks[i](this)
      }
      //循环回调xml内的回调函数
      oldSend.apply(this, arguments)
      //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
    }
  }
}
// 课表信息解析函数
function timetableFormat (table) {
  TABLE.termStart = dateLater(TERM_START, 0)
  TABLE.termEnd = dateLater(TERM_START, TOTALWEEK * 7)
  var data = JSON.parse(table).kbList
  // console.log(data)
  var freq, interval, until, dtstart1, dtstart2, dtend1, dtend2
  TABLE.kbList = []
  data.forEach(element => {
    var pushs = function (tar) {
      if (tar.zcd.includes("-")) {
        freq = tar.zcd.split('周')[0].split('-')
        // 单双周判断
        if (tar.zcd.includes("单")) {
          interval = 2
        }
        else if (tar.zcd.includes("双")) {
          interval = 2
        }
        else {
          interval = 1
        }
        dtend1 = dtstart1 = dateLater(TERM_START, ((freq[0] - 1) * 7) + parseInt(element.xqj - 1))
        until = dateLater(TERM_START, ((freq[1] - 1) * 7) + parseInt(element.xqj)) + "T120000Z"
        freq = "WEEKLY"
      }
      else {
        freq = "x"
        interval = 0
        dtend1 = dtstart1 = dateLater(TERM_START, tar.xqj - 1 + (tar.zcd.replace("周", "") - 1) * 7)
        console.log(dtend1)
        until = dateLater(TERM_START, parseInt(tar.xqj) + parseInt(tar.zcd.replace("周", "")) - 1) * 7 + "T120000Z"
      }
      // 课程时间生成
      if (tar.jcs.includes('-')) {
        dtstart2 = Timetable[tar.jcs.split('-')[0]][0].replace(':', '')
        dtend2 = Timetable[tar.jcs.split('-')[1]][1].replace(':', '')
      }
      else {
        dtstart2 = Timetable[tar.jcs][0].replace(':', '')
        dtend2 = Timetable[tar.jcs][1].replace(':', '')
      }
      TABLE.kbList.push(
        {
          "SUMMARY": tar.kcmc,
          "FREQ": freq,
          "UNTIL": until,
          "INTERVAL": interval,
          "DTSTART": "Asia/Shanghai:" + dtstart1 + "T" + dtstart2 + "00",
          "DTEND": "Asia/Shanghai:" + dtend1 + "T" + dtend2 + "00",
          "UID": uuid(),
          "DESCRIPTION1": "第" + tar.jc + "\\n" + tar.xqmc + " " + tar.cdmc + "\\n" + element.xm,
          "DESCRIPTION2": tar.kcmc + "@" + tar.xqmc + " " + tar.cdmc,
          "LOCATION": tar.xqmc + " " + tar.cdmc + " " + tar.xm
        }
      )
    }
    if (element.zcd.includes(",")) {
      var tmp = element
      var zcd = tmp.zcd.split(',')
      zcd.forEach(tar => {
        tmp.zcd = tar
        pushs(tmp)
      })
    }
    else {
      pushs(element)
    }
  })
}
// UUID生成函数
function uuid () {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + "-" + S4() + "-LersNightmare-" + S4() + "-" + S4() + S4() + S4())
}
// 计算n天后日期(传入 2022-09-05,5)
function dateLater (datatemp, days) {
  days = parseInt(days)
  let nowTime = strToDate(datatemp) //当前时间戳
  let futureTime = Math.abs(nowTime) + (days * 24 * 60 * 60 * 1000) //days天后的时间戳
  let futureDate = new Date(futureTime)
  let year = futureDate.getFullYear()
  let month = futureDate.getMonth() + 1
  if (month < 10) month = "0" + month
  let date = futureDate.getDate()
  if (date < 10) date = "0" + date
  return (year.toString() + month.toString() + date.toString())
}
// 将yyy-MM-dd格式的字符串转换为日期
function strToDate (datestr) {
  var dateStr = datestr.replace(/-/g, "/")//现将yyyy-MM-dd类型转换为yyyy/MM/dd
  var dateTime = Date.parse(dateStr)//将日期字符串转换为表示日期的秒数
  //注意：Date.parse(dateStr)默认情况下只能转换：月/日/年 格式的字符串，但是经测试年/月/日格式的字符串也能被解析
  var data = new Date(dateTime)//将日期秒数转换为日期格式
  return data
}
// 添加下载按键和日期选择器函数
function addDownload (xhr) {
  var addComp = function () {
    // 下载按钮
    let btn = document.createElement("button")
    btn.innerHTML = "下载ICS"//innerText也可以,区别是innerText不会解析html
    btn.id = "lers_btn"
    btn.className = "btn btn-default btn-primary bigger-120 glyphicon glyphicon-arrow-down"
    btn.onclick = function () {
      timetableFormat(xhr.responseText) // 解析
      var ics = new ICS()
      ics.init_ICS()
      ics.download_ICS("timetable.ics", ics.ICS)
    }
    // 日期选择器
    let Datepicker = document.createElement("input")
    Datepicker.type = "date"
    Datepicker.value = TERM_START
    Datepicker.id = "lers_DatePicker"
    Datepicker.className = "btn bigger-120 btn-success"
    Datepicker.onchange = function () {
      TERM_START = document.getElementById("lers_DatePicker").value
    }
    document.getElementById("tb").prepend(btn)
    document.getElementById("tb").prepend(Datepicker)
  }
  if (document.getElementById("lers_btn")) {
    document.getElementById("lers_btn").remove()
    document.getElementById("lers_DatePicker").remove()
    addComp()
  }
  else {
    addComp()
  }
}
//----------------------------------流程------------------------------------------
//加载脚本时就启动函数开始监听
(function () {
  'use strict'
  addXMLRequestCallback(function (xhr) {
    //调用劫持函数，填入一个function的回调函数
    //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
    xhr.addEventListener("load", function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (xhr.responseURL.indexOf("xskbcx_cxXsgrkb.html?gnmkdm=N253508") >= 0) { // url中包含固定字符串
          // hook xhr请求成功
          console.log("执行")
          addDownload(xhr)
        }
      }
    })
  })
})()
