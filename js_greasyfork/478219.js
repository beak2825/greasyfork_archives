// ==UserScript==
// @name         智慧用电智能系统
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  智慧用电
// @author       ldt
// @include      *://www.0531yun.com/ksh.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478219/%E6%99%BA%E6%85%A7%E7%94%A8%E7%94%B5%E6%99%BA%E8%83%BD%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/478219/%E6%99%BA%E6%85%A7%E7%94%A8%E7%94%B5%E6%99%BA%E8%83%BD%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 增加自定义样式
    // GM_addStyle function is not existed in chrome 27
    var ws = new WebSocket("wss://7835-117-10-147-70.ngrok-free.app/device-messages/AB3441163");
    var dataSource = {}
    ws.onopen = function(){
        //当WebSocket创建成功时，触发onopen事件
        console.log("webSocket启动成功")
    }
    ws.onmessage = function(e){
        //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
        dataSource = JSON.parse(e.data)
        updateHtml()
        updateEquipDataTemp()
        updateEquipDataCurrent()
        updateEquipDataVoltage()
        updateEquipDataHigh()
        updateEquipDataPower()
        console.log(dataSource, '接收的数据')

    }
    ws.onclose = function(e){
        //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
        console.log("close");
    }
    ws.onerror = function(e){
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log('error', e);
    }

    // 上半部分
    var updateHtml = function (){
        var baojing = document.getElementById("baojing")
        var youguzhang = document.getElementById("youguzhang")
        var xiaoyin = document.getElementById("xiaoyin")
        var bjText = document.getElementById("bjText")
        var ygzText = document.getElementById("ygzText")
        var xyText = document.getElementById("xyText")
        var bjClass = baojing.getAttribute("class")
        var ygzClass = youguzhang.getAttribute("class")
        var xyClass = xiaoyin.getAttribute("class")
        if(baojing){
            bjClass = bjClass.replace("img-activate","other")
            baojing.setAttribute("class",bjClass)
        }
        if(youguzhang){
            ygzClass = ygzClass.replace("img-activate","other")
            youguzhang.setAttribute("class",ygzClass)
        }
        if(xiaoyin){
            xyClass = xyClass.replace("img-activate","other")
            xiaoyin.setAttribute("class",xyClass)
        }
        bjText.style.color = "rgba(255, 255, 255, 1)"
        ygzText.style.color = "rgba(255, 255, 255, 1)"
        xyText.style.color = "rgba(255, 255, 255, 1)"
        baojing.src = "https://file.ha-iot.com/zhanban/images/切图/智慧用电/报警.png"
        youguzhang.src = "https://file.ha-iot.com/zhanban/images/切图/智慧用电/故障.png"
        xiaoyin.src = "https://file.ha-iot.com/zhanban/images/切图/智慧用电/消音.png"
        if(dataSource.deviceType == "electric-monitor(4G)"){
           if (dataSource.msgContent == "报警") {
              if(baojing){
                 bjClass = bjClass.replace("other","img-activate")
                 baojing.setAttribute("class",bjClass)
                 baojing.src = "https://file.ha-iot.com/zhanban/images/切图/智慧用电/报警1.png"
                 bjText.style.color = "rgba(247, 107, 95, 1)"
              }
           } else if (dataSource.msgContent == "有故障") {
              if(youguzhang){
                 ygzClass = ygzClass.replace("other","img-activate")
                 youguzhang.setAttribute("class",ygzClass)
                 youguzhang.src = "https://file.ha-iot.com/zhanban/images/切图/智慧用电/故障1.png"
                 ygzText.style.color = "rgba(247, 107, 95, 1)"
              }
           } else if (dataSource.msgContent == "消音") {
              if(xiaoyin){
                 xyClass = xyClass.replace("other","img-activate")
                 xiaoyin.setAttribute("class",xyClass)
                 xiaoyin.src = "https://file.ha-iot.com/zhanban/images/切图/智慧用电/消音1.png"
                 xyText.style.color = "rgba(247, 107, 95, 11)"
              }
           }
        }
    }
    // 下半部分
    // 温度
    var updateEquipDataTemp = function (){
        var refTemperature1 = document.getElementById("refTemperature1")
        var refTemperature2 = document.getElementById("refTemperature2")
        var refTemperature3 = document.getElementById("refTemperature3")
        var refResidualCurrent = document.getElementById("refResidualCurrent")

        if(dataSource.deviceType == "electric-monitor(4G)"){
            var electricWsData = dataSource?.attributeAndValue
            if(electricWsData?.temperature1 && electricWsData?.temperature1 != 'undefined'){
                if(refTemperature1){
                    refTemperature1.innerHTML = electricWsData?.temperature1  + '℃'
                }
            }else if(electricWsData?.temperature2 && electricWsData?.temperature2 != 'undefined'){
                if(refTemperature2){
                    refTemperature2.innerHTML = electricWsData?.temperature2  + '℃'
                }
            }else if(electricWsData?.temperature3 && electricWsData?.temperature3 != 'undefined'){
                if(refTemperature3){
                    refTemperature3.innerHTML = electricWsData?.temperature3  + '℃'
                }
            }else if(electricWsData?.residualCurrent && electricWsData?.residualCurrent != 'undefined'){
                if(refResidualCurrent){
                    refResidualCurrent.innerHTML = electricWsData?.residualCurrent  + 'mA'
                }
            }
        }
    }
    // 相电流
    var updateEquipDataCurrent = function (){
        var refAPhaseCurrent = document.getElementById("refAPhaseCurrent")
        var refBPhaseCurrent = document.getElementById("refBPhaseCurrent")
        var refChaseCurrent = document.getElementById("refChaseCurrent")

        if(dataSource.deviceType == "electric-monitor(4G)"){
            var electricWsData = dataSource?.attributeAndValue
            if(electricWsData['aPhaseCurrent'] && electricWsData['aPhaseCurrent'] != 'undefined'){
                if(refAPhaseCurrent){
                    refAPhaseCurrent.innerHTML = electricWsData['aPhaseCurrent'] + 'A'
                }
            }else if(electricWsData['bPhaseCurrent'] && electricWsData['bPhaseCurrent'] != 'undefined'){
                if(refBPhaseCurrent){
                    refBPhaseCurrent.innerHTML = electricWsData['bPhaseCurrent'] + 'A'
                }
            }else if(electricWsData['cPhaseCurrent'] && electricWsData['cPhaseCurrent'] != 'undefined'){
                if(refChaseCurrent){
                    refChaseCurrent.innerHTML = electricWsData['cPhaseCurrent'] + 'A'
                }
            }
        }
    }
    // 相电压
    var updateEquipDataVoltage = function (){
        var refAPhaseVoltage = document.getElementById("refAPhaseVoltage")
        var refBPhaseVoltage = document.getElementById("refBPhaseVoltage")
        var refCPhaseVoltage = document.getElementById("refCPhaseVoltage")

        if(dataSource.deviceType == "electric-monitor(4G)"){
            var electricWsData = dataSource?.attributeAndValue
            if(electricWsData['aPhaseVoltage'] && electricWsData['aPhaseVoltage'] != 'undefined'){
                if(refAPhaseVoltage){
                    refAPhaseVoltage.innerHTML = electricWsData['aPhaseVoltage'] + 'V'
                }
            }else if(electricWsData['bPhaseVoltage'] && electricWsData['bPhaseVoltage'] != 'undefined'){
                if(refBPhaseVoltage){
                    refBPhaseVoltage.innerHTML = electricWsData['bPhaseVoltage'] + 'V'
                }
            }else if(electricWsData['cPhaseVoltage'] && electricWsData['cPhaseVoltage'] != 'undefined'){
                if(refCPhaseVoltage){
                    refCPhaseVoltage.innerHTML = electricWsData['cPhaseVoltage'] + 'V'
                }
            }
        }
    }
    // 电量
    var updateEquipDataHigh = function (){
        var refActivePowerHigh = document.getElementById("refActivePowerHigh")
        if(dataSource.deviceType == "electric-monitor(4G)"){
            var electricWsData = dataSource?.attributeAndValue
            if(electricWsData['activePowerHigh'] && electricWsData['activePowerHigh'] != 'undefined'){
                if(refActivePowerHigh){
                    refActivePowerHigh.innerHTML = electricWsData['activePowerHigh']
                }
            }
        }
    }
    //  参考功率
    var updateEquipDataPower = function (){
        var refActivePower = document.getElementById("refActivePower")
        var refReactivePower = document.getElementById("refReactivePower")
        var refInspectPower = document.getElementById("refInspectPower")
        var refPowerFactor = document.getElementById("refPowerFactor")
        if(dataSource.deviceType == "electric-monitor(4G)"){
            var electricWsData = dataSource?.attributeAndValue
            if(electricWsData['activePower'] && electricWsData['activePower'] != 'undefined'){
                if(refActivePower){
                    refActivePower.innerHTML = electricWsData['activePower'] + 'KW'
                }
            }
            if(electricWsData['reactivePower'] && electricWsData['reactivePower'] != 'undefined'){
                if(refReactivePower){
                    refReactivePower.innerHTML = electricWsData['reactivePower'] + 'KVr'
                }
            }
            if(electricWsData['inspectPower'] && electricWsData['inspectPower'] != 'undefined'){
                if(refInspectPower){
                    refInspectPower.innerHTML = electricWsData['inspectPower'] + 'KVA'
                }
            }
            if(electricWsData['powerFactor'] && electricWsData['powerFactor'] != 'undefined'){
                if(refPowerFactor){
                    refPowerFactor.innerHTML = electricWsData['powerFactor']
                }
            }
        }
    }
    // 样式
    var a =  function (css) {
        var style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(style);
    };
    var GM_addStyle = GM_addStyle || function (css) {
        var style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(style);
    };
GM_addStyle("\
.ksh_right .ksh_right_sheb_list .sheb_list {\
display: none;\
}\
");
GM_addStyle("\
.ksh_right .ksh_right_search {\
display: none;\
}\
");
GM_addStyle("\
.ksh_right .ksh_right_sheb_list .imgBox {\
width: 40px;\
}\
");
GM_addStyle("\
.ksh_right .ksh_right_sheb_list .f1-item-img {\
width: 40px;\
height: 40px;\
position: relative;\
}\
");
GM_addStyle("\
.ksh_right .ksh_right_sheb_list .imgBox .imgCard {\
display: block;\
width: 40px;\
height: 40px;\
}\
");
GM_addStyle("\
.img-activate {\
position: absolute;\
animation: img-size 1s linear infinite;\
}\
");
GM_addStyle("\
.other {\
background: color;\
}\
");
GM_addStyle("\
@keyframes img-size {\
0% {\
height: 20px;\
width: 20px;\
top: 20px;\
left: 20px;\
}\
100% {\
height: 60px;\
width: 60px;\
top: 0;\
left: 0;\
}\
}\
");
GM_addStyle("\
.ksh_right .ksh_right_sheb_list .imgBox .imgText {\
width: 100%;\
text-align: center;\
color: #fff;\
font-size: 14px;\
}\
");
// 详情
GM_addStyle("\
.equipMonitor {\
padding:0 5px;\
font-size: 12px;\
color: #fff;\
display: flex;\
flex-wrap: wrap;\
justify-content: space-between;\
min-width:430px;\
}\
");
GM_addStyle("\
.equipItem {\
margin-top: 50px;\
padding-top: 8px;\
width: 138px;\
height: 80px;\
box-shadow: 0 0 75px 2px rgba(16, 103, 203, 0.3333333333) inset;\
border-radius: 5px;\
");
GM_addStyle("\
.content-box {\
display: flex;\
justify-content: left;\
flex-wrap: wrap;\
");
GM_addStyle("\
.content-item {\
width: 50%;\
margin-top: 10px;\
box-sizing: border-box;\
padding: 0 3px;\
");
GM_addStyle("\
.item-child {\
display: flex;\
justify-content: left;\
align-items: center;\
");
GM_addStyle("\
.item-child-value {\
width: 50px;\
overflow: hidden;\
white-space: nowrap;\
text-overflow: ellipsis;\
text-align: right\
");

    var sheblist=document.getElementsByClassName("ksh_right_sheb_list");
    var shebtitle=document.getElementsByTagName("h3");
    shebtitle[3].innerText = "智慧用电系统远程监控"
    sheblist[0].insertAdjacentHTML('beforeend',
                                   '<div style="display:flex;justify-content:space-around;border-bottom: 1px dashed rgb(41, 153, 255);padding: 20px 0;min-width:430px;">'+
                                   '<div class="imgBox">'+
                                   '<div class="f1-item-img">'+
                                   '<img id="baojing" class="imgCard other" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/报警.png"></img>'+
                                   '</div>'+
                                   '<div id="bjText" class="imgText">报警</div>'+
                                   '</div>'+
                                   '<div class="imgBox">'+
                                   '<div class="f1-item-img">'+
                                   '<img id="youguzhang" class="imgCard other" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/故障.png"></img>'+
                                   '</div>'+
                                   '<div id="ygzText" class="imgText">故障</div>'+
                                   '</div>'+
                                   '<div class="imgBox">'+
                                   '<div class="f1-item-img">'+
                                   '<img id="xiaoyin" class="imgCard other" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/消音.png"></img>'+
                                   '</div>'+
                                   '<div id="xyText" class="imgText">消音</div>'+
                                   '</div>'+
                                   '<div class="imgBox">'+
                                   '<img class="imgCard" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/运行.png"></img>'+
                                   '<div class="imgText">运行</div>'+
                                   '</div>'+
                                   '<div class="imgBox">'+
                                   '<img class="imgCard" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/网络.png"></img>'+
                                   '<div class="imgText">网络</div>'+
                                   '</div>'+
                                   '</div>'+
                                   '<div class="equipMonitor">'+
                                      '<div class="equipItem">'+
                                         '<div style="display: flex; justify-content: center; align-items: center">'+
                                            '<div style="width: 18px; height: 18px;">'+
                                               '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/wendu.png" alt="">'+
                                            '</div>'+
                                            '<div style="margin-left: 8px">'+
                                               '剩余电流/温度'+
                                            '</div>'+
                                         '</div>'+
                                         '<div class="content-box">'+
                                            '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dian1.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refTemperature1" class="item-child-value">'+
                                                    '0℃'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dian2.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refTemperature2" class="item-child-value">'+
                                                    '0℃'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dian3.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refTemperature3" class="item-child-value">'+
                                                    '0℃'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dian4.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refResidualCurrent" class="item-child-value">'+
                                                    '0mA'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                        '</div>'+
                                      '</div>'+
                                      '<div class="equipItem">'+
                                         '<div style="display: flex; justify-content: center; align-items: center">'+
                                            '<div style="width: 18px; height: 18px;">'+
                                               '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianliu.png" alt="">'+
                                            '</div>'+
                                            '<div style="margin-left: 8px">'+
                                               '相电流'+
                                            '</div>'+
                                         '</div>'+
                                         '<div class="content-box">'+
                                            '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianA.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refAPhaseCurrent" class="item-child-value">'+
                                                    '0A'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianB.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refBPhaseCurrent" class="item-child-value">'+
                                                    '0A'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianC.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refChaseCurrent" class="item-child-value">'+
                                                    '0A'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                        '</div>'+
                                      '</div>'+
                                      '<div class="equipItem">'+
                                         '<div style="display: flex; justify-content: center; align-items: center">'+
                                            '<div style="width: 18px; height: 18px;">'+
                                               '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianya.png" alt="">'+
                                            '</div>'+
                                            '<div style="margin-left: 8px">'+
                                               '相电压'+
                                            '</div>'+
                                         '</div>'+
                                         '<div class="content-box">'+
                                            '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianA.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refAPhaseVoltage" class="item-child-value">'+
                                                    '0V'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianB.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refBPhaseVoltage" class="item-child-value">'+
                                                    '0V'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianC.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refCPhaseVoltage" class="item-child-value">'+
                                                    '0V'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                        '</div>'+
                                      '</div>'+
                                      '<div class="equipItem">'+
                                         '<div style="display: flex; justify-content: center; align-items: center">'+
                                            '<div style="width: 18px; height: 18px;">'+
                                               '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianliang.png" alt="">'+
                                            '</div>'+
                                            '<div style="margin-left: 8px">'+
                                               '电量'+
                                            '</div>'+
                                         '</div>'+
                                         '<div style="padding: 15px 10px 0;text-align: center; margin-left: 5px; overflow: hidden;white-space: nowrap; text-overflow: ellipsis">'+
                                            '<span id="refActivePowerHigh" style="color: #04F0F2; font-weight: bold; font-size: 18px"> 0.00 </span> kWh '+
                                         '</div>'+
                                      '</div>'+
                                      '<div class="equipItem">'+
                                         '<div style="display: flex; justify-content: center; align-items: center">'+
                                            '<div style="width: 18px; height: 18px;">'+
                                               '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/gonglv.png" alt="">'+
                                            '</div>'+
                                            '<div style="margin-left: 8px">'+
                                               '参考功率'+
                                            '</div>'+
                                         '</div>'+
                                         '<div class="content-box">'+
                                            '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianP.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refActivePower" class="item-child-value">'+
                                                    '0KW'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianQ.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refReactivePower" class="item-child-value">'+
                                                    '0KVr'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianS.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refInspectPower" class="item-child-value">'+
                                                    '0KVA'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                           '<div class="content-item">'+
                                              '<div class="item-child">'+
                                                 '<div style="width: 15px; height: 15px;">'+
                                                    '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/dianO.png" alt="">'+
                                                 '</div>'+
                                                 '<div id="refPowerFactor" class="item-child-value">'+
                                                    '0'+
                                                 '</div>'+
                                              '</div>'+
                                           '</div>'+
                                        '</div>'+
                                      '</div>'+
                                      '<div class="equipItem">'+
                                         '<div style="display: flex; justify-content: center; align-items: center">'+
                                            '<div style="width: 18px; height: 18px;">'+
                                               '<img style="display: block; width: 100%" src="https://file.ha-iot.com/zhanban/images/切图/智慧用电/xianwen.png" alt="">'+
                                            '</div>'+
                                            '<div style="margin-left: 8px">'+
                                               '线温'+
                                            '</div>'+
                                         '</div>'+
                                         '<div style="padding: 15px 10px 0;text-align: center; margin-left: 5px; overflow: hidden;white-space: nowrap; text-overflow: ellipsis">'+
                                            '<span style="color: #04F0F2; font-weight: bold; font-size: 18px"> 0.00 </span> ℃ '+
                                         '</div>'+
                                      '</div>'+
                                   '</div>'
                                  );
})();