// ==UserScript==
// @name         工单助手
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  try to take over the world!
// @author       moyo
// @match         http://omms.chinatowercom.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423897/%E5%B7%A5%E5%8D%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/423897/%E5%B7%A5%E5%8D%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //初始化
    init()
    //数据存储
    var toggleFlag = false


    function init(){

        var app = document.getElementById("app")
        var button = document.createElement("div")
        button.setAttribute("id","button")
        button.style.cssText = "width: 55px;height:40px;position: fixed;top: 50%; left:-40px; cursor: pointer;"

        var start = document.createElement("div")
        start.style.cssText = "width:40px;color: #e2ddd3;line-height: 40px; background: black;float:left;text-align: center;"
        start.setAttribute("id","start")
        start.innerText = "开始"

        var slider = document.createElement("div")
        slider.style.cssText = "width:15px;height:40px;background:#889eef;float:left;"

        button.appendChild(start)
        button.appendChild(slider)
        app.appendChild(button)

        slider.addEventListener("click", toggle)
        start.addEventListener("click", analysis)
    }
    //请求数据
    function analysis(){
        //综合查询iframe
        var contentIframe = document.getElementsByTagName("iframe")[1].contentWindow.document
        //表格tr集合
        var main = contentIframe.getElementById("listForm:billListTable:tb").rows
        var urlList = []
        var baseUrl = "http://"+window.location.host + "/billDeal/monitoring/detail/monBillDetail.xhtml?billIdParam="
        var idList = []

        for(var i =0;i< main.length;i++){
            var openStr = main[i].querySelectorAll("td")[2].querySelector("center>a").href
            var reg = /[0-9]{10}/
            var openId =reg.exec(openStr)[0]
            urlList[i]= baseUrl+openId
            idList[i] = openId
        }
        Promise.all(
            urlList.map(url=>
                        fetch(url).then(res=>res.text())
                       )
        ).then(text=>{
            view(read(text,idList))
        })
    }

    function read(text,idList){
        var data = []
        for (var i =0;i<text.length;i++){
            data[i] = readDetail(text[i],idList[i])
        }
        return data;
    }

    function readDetail(data, openId){
        var alarmObj = {}//alarmObj 告警对象 {告警名称：[发生时间，恢复时间]}
        var actionObj = {} //aciontObj 动作列表对象 {时间搓：动作名称}
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html")
        //工单编号
        var id = doc.getElementById("billFormDetail").querySelectorAll("table")[0].querySelectorAll("tr")[1].querySelectorAll("td")[0].innerHTML.trim()
        //告警信息列表
        var alarmArray = doc.getElementById("billFormDetail:warnDataTable:tb").querySelectorAll("tr");

        alarmArray.forEach(el=>{
            var sTime = new Date(el.querySelectorAll("td")[3].innerHTML).getTime()
            var eTimeStr = el.querySelectorAll("td")[5].querySelector("span").innerHTML
            var eTime = eTime ? "" : new Date(eTimeStr).getTime()
            var alarmName = el.querySelectorAll("td")[0].innerHTML
            if(alarmName == "交流输入停电告警" || alarmName == "直流输入断电告警"){
                var devName = el.querySelectorAll("td")[1].querySelector("a").innerHTML
                var devFlag = devName.indexOf("开关")
                alarmName = devFlag != -1 ? "交流输入停电告警-开关" : "交流输入停电告警-断电"
            }
            alarmObj[alarmName] =[sTime,eTime]
        });


        //操作动作列表
        var actionArray = doc.getElementById("billFormDetail:baListForm:billActionItems:tb").querySelectorAll("tr")
        actionArray.forEach(el=>{
            var time = new Date(el.querySelectorAll("td")[4].innerHTML).getTime()
            var actionEl = el.querySelectorAll("td")[2].querySelector("div") ? el.querySelectorAll("td")[2].querySelector("div") : el.querySelectorAll("td")[2]
            actionObj[time] = actionEl.innerHTML
        })

        //操作描述
        var abnormalFlag = false
        actionArray.forEach(el=>{
            var actionDsc = el.querySelectorAll("td")[3].innerHTML
            if( actionDsc.indexOf("整流模块") != -1 ){
                abnormalFlag = true
            }
        })

        //处理对象
        var orderReal = {id, "alarm": alarmObj, "action": actionObj, openId, abnormalFlag}

        //执行相应动作 ing:发电工单 end:已归档工单 off:停电工单
        if(Object.values(actionObj).indexOf("回单(归档)") != -1){
            return end(orderReal)
        } else if(Object.values(actionObj).indexOf("开始发电") != -1){
            return ing(orderReal)
        }else {
            return off(orderReal)
        }

    }
    //停电工单处理
    function off(orderReal) {
        //告警—动作
        var {alarm,action} = orderReal
        //停电时间
        var powerOffTime = ""
        //停电恢复时间
        var powerOnTime = ""
        //是否需要督办
        var needDo = false
        var reason = ""
        if (alarm.hasOwnProperty("交流输入停电告警-开关")) {
            powerOffTime = alarm["交流输入停电告警-开关"][0]
            powerOnTime = alarm["交流输入停电告警-开关"][1]
        } else {
            powerOffTime = alarm["交流输入停电告警-断电"][0]
            powerOnTime = alarm["交流输入停电告警-断电"][1]
        }
        //是否断站退服
        var outLine = false
        if (alarm.hasOwnProperty("FSU离线")) {
            var flag = alarm["FSU离线"][1]
            outLine = flag ? false : true
        }


        //最后一次督办时间
        var lastDoTime = ""
        for (var k in action) {
            if (action[k] == "催办") {
                lastDoTime = k
            }
        }

        if ( !powerOnTime & outLine == false) {//停电且未退服
            var now = new Date().getTime()
            var dis = 0
            //停电未督办过，2小时前要求督办
            if (lastDoTime == "") {
                dis = (now - powerOffTime) / 3600000
                needDo = dis > 2 ? true : false
                dis > 2?reason += "停电请第一次督办" : ""

            } else {
                //督办过，间隔两小时督办
                dis = (now - lastDoTime) / 3600000
                needDo = dis > 1.5 ? true : false
                dis > 1.5 ? reason += "停电中请二次督办" : ""
            }
        }

        if (powerOnTime != 0 & outLine == true) {
            needDo = true
            reason += "停电离线中"
        }
        orderReal.reason = reason
        orderReal.needDo = needDo
        return orderReal
    }

    //发电工单处理
    function ing(orderReal) {
        //告警--动作---是否发电源模块
        var {alarm,action,abnormalFlag} = orderReal

        //是否需要督办,原因,最后一次督办时间
        var needDo = false
        var reason = ""
        var lastDoTime = ""
        var electricTime =""
        //最后一次督办时间 和发电开始时间

        for (var k in action) {

            if (action[k]== "催办") {
                lastDoTime = k
            }
            if (action[k]== "开始发电") {
                electricTime = k
            }
        }
        //停电时间
        var powerOffTime = ""
        //停电恢复时间
        var powerOnTime = false

        if (alarm.hasOwnProperty("交流输入停电告警-开关")) {
            powerOffTime = alarm["交流输入停电告警-开关"][0]
            powerOnTime = alarm["交流输入停电告警-开关"][1]
        } else {
            powerOffTime = alarm["交流输入停电告警-断电"][0]
            powerOnTime = alarm["交流输入停电告警-断电"][1]
        }
        //是否离线
        var outLine = false
        if (alarm.hasOwnProperty("FSU离线")) {
            var lineFlag = alarm["FSU离线"][1]
            outLine = lineFlag ? false : true
        }

        //是否退服
        var outService = false
        if (alarm.hasOwnProperty("一级低压脱离告警")) {
            var serviceFlag = alarm["一级低压脱离告警"][1]
            outService = serviceFlag ? false : true
        }

        //发电是否正常  1、发模块 true | ... =
        var powerFlag = abnormalFlag | !isNaN(powerOnTime)


        //没有退服和离线且发电正常
        if(outLine ==false & outService == false & powerFlag){
            if(lastDoTime == ""){
                needDo = true;
                reason += "发电正常需要督办1次"
            }
        }else{
            if(lastDoTime == ""){
                needDo = true;
                reason += "发电不正常请督办"
            }else{
                var now = new Date().getTime()
                var dis = (now - lastDoTime) / 3600000
                needDo = dis > 0.5 ? true : false
                dis > 0.5 ? reason += "发电不正常请督办" :""
            }
        }
        orderReal.reason = reason
        orderReal.needDo = needDo
        return orderReal
    }

    //已归档不做处理
    function end(orderReal){
        orderReal.reason = "已归档"
        orderReal.needDo = false
        return orderReal
    }
    //创建视图
    function view(data){
        var ele = document.getElementById("app")
        var slot = document.getElementById("slot")
        slot ? ele.removeChild(slot):""

        //创建容器
        var container = document.createElement("div")
        container.style.cssText = "width: 350px;height: 450px;position: fixed;bottom: 0px;right: 0px;border: 2px dotted rgb(247 10 19);background-color: rgb(173 212 199 / 86%);overflow-y: scroll;"
        container.setAttribute('id','slot')
        //创建标题
        var title = document.createElement("h3")
        title.style.cssText = "margin: 0px; text-align: center; height: 35px; line-height: 35px;"
        title.innerText = "待督办工单-v2.9"
        container.appendChild(title)

        //创建内容
        var filtered = data.filter(need => need.needDo == true)
        if (filtered.length > 0) {
            var ul = document.createElement("ul")
            var li = ""
            filtered.forEach(el => {
                li += `<li style="">
                    <a style="width:200px; text-align:center" target="_blank" href="http://${window.location.host}/billDeal/monitoring/detail/monBillDetail.xhtml?billIdParam=${el.openId}">${el.id}</a>
                    <span style="width:150px; text-align:center">${el.reason}</span>
                </li>`
            })
            ul.style.cssText = "list-style:none;margin:0;padding:0;text-algin:center;"
            ul.innerHTML = li
            container.appendChild(ul)
        }else{
            var content = document.createElement("div")
            content.innerText = "暂无需要催办工单，注意观察，此工具仅为辅助！！！"
            content.style.color="red"
            container.appendChild(content)
        }
ele.appendChild(container)
}
//左侧插件显隐
function toggle(){
    var slider = document.getElementById("button")
    slider.style.left = toggleFlag ? "-40px" : "0"
    toggleFlag = !toggleFlag
}
})();