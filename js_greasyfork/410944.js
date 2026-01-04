// ==UserScript==
// @name        去你的辣鸡后台
// @namespace    sunchaolive.github.io/pk
// @version      0.1.17
// @description  这后台我真吐了
// @author       ChaoChao
// @match        http://*.imobile-ent.com:8988/D9OPPlatsystem/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410944/%E5%8E%BB%E4%BD%A0%E7%9A%84%E8%BE%A3%E9%B8%A1%E5%90%8E%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/410944/%E5%8E%BB%E4%BD%A0%E7%9A%84%E8%BE%A3%E9%B8%A1%E5%90%8E%E5%8F%B0.meta.js
// ==/UserScript==

function addElementDiv() {
    if(!alreadyExist){
        var parent = document.getElementById("inputparam.param3_msg");
        var div = document.createElement("div");

        //------------设置 div 属性，如 id
        div.setAttribute("id", "newDiv");

        //------------先把需要的东西都加上去。。。
        div.innerHTML = "<input type=\"button\" id=\"ARButton\" style=\"color:blue;height:30px;width:200px;\" value=\"累计充值内容填充\">\n  <input type=\"button\" id=\"OBButton\" style=\"color:blue;height:30px;width:100px;\" value=\"OB奖励\"> <input type=\"button\" id=\"DiscordButton\" style=\"color:blue;height:30px;width:150px;\" value=\"宣传Discord\"> <input type=\"button\" id=\"SMButton\" style=\"color:blue;height:30px;width:200px;\" value=\"合服补偿\">\n";
        parent.appendChild(div);


        //------------然后设置点击之后干啥

        //1.发送累充奖励，那么多档位，奖励还变化，懒得搞了
        var ARbuttonObj = document.getElementById("ARButton");
        ARbuttonObj.onclick=function ARContent(){
            document.getElementById("inputparam.param1").value="Accumulative Recharge Rewards";
            document.getElementById("inputparam.param2").value="Here are the accululative recharge rewards for you, please receive ASAP.";
            SendNowById();
        }

        //2.发送OB奖励
        var OBButtonObj = document.getElementById("OBButton");
        OBButtonObj.onclick=function OBContent(){
            document.getElementById("inputparam.param1").value="OB Weekly Rewards";
            document.getElementById("inputparam.param2").value="Here are your OB Weekly Rewards, keep on good work.";
            document.getElementById("inputparam.param3").value="1-20020001-2000,1-21030001-50";
            SendNowById();
        }

        //3.发送Discord奖励
        var DiscordButtonObj = document.getElementById("DiscordButton");
        DiscordButtonObj.onclick=function DiscordContent(){
            document.getElementById("inputparam.param1").value="Discord Invitation";
            document.getElementById("inputparam.param2").value="We've launched Official Discord Server, please tap the button in the mail and join us! You can chat freely here and win special rewards! <link~~tiaozhuan_mail~~https://discord.gg/FpQrhCX>";
            document.getElementById("inputparam.param3").value="1-11402005-1";
            SendNowAllServers();
        }


          //4.发送合服奖励
        var SMButtonObj = document.getElementById("SMButton");
        SMButtonObj.onclick=function SMContent(){
            document.getElementById("inputparam.param1").value="Server Merge Compensation";
            document.getElementById("inputparam.param2").value="Here are your server merge compensations, please receive ASAP. If you have suggestions please contact us on Discord!  <link~~tiaozhuan_mail~~https://discord.gg/FpQrhCX>";
            document.getElementById("inputparam.param3").value="1-12018034-1";
            SendNowAllServers();
        }
        alreadyExist=true;
    };
}

function SendNowById(){
    var TargetObj = document.getElementById("inputdata.optype");
    for (var i = 0; i < TargetObj.options.length; i++){
        if (TargetObj.options[i].value == 3){
            TargetObj.options[i].selected = true;
            break;
        }
    }


    var TimeObj = document.getElementById("inputdata.optime");
    for (i = 0; i < TimeObj.options.length; i++){
        if (TimeObj.options[i].value == 1){
            TimeObj.options[i].selected = true;
            break;
        }


        var SendNowObj = document.getElementById("inputdata.donowflg");
        SendNowObj.checked=true;

        var IDInputObj = document.getElementById("inputdata.roleidlist");
        IDInputObj.removeAttribute("readonly");
    }
};

function SendNowAllServers(){
    var TargetObj = document.getElementById("inputdata.optype");
    for (var i = 0; i < TargetObj.options.length; i++){
        if (TargetObj.options[i].value == 1){
            TargetObj.options[i].selected = true;
            break;
        }
    }


    var TimeObj = document.getElementById("inputdata.optime");
    for (i = 0; i < TimeObj.options.length; i++){
        if (TimeObj.options[i].value == 1){
            TimeObj.options[i].selected = true;
            break;
        }


        var SendNowObj = document.getElementById("inputdata.donowflg");
        SendNowObj.checked=true;
        var IDInputObj = document.getElementById("inputdata.roleidlist");
        IDInputObj.setAttribute("readonly");
    }
};

var alreadyExist=false;

//-----------网页加载的时候就安排上，免得后面加载不出来心烦，这垃圾后台

//-----------发完邮件按钮没了你说气人不
onscroll=addElementDiv();

