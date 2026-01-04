// ==UserScript==
// @name         桌面动画助手
// @namespace    https://saltzmanalaric.github.io
// @version      1.5.4
// @description  Desk animate helper!
// @author       Saltzman
// @license      MIT
// @date         2019-11-14
// @modified     2019-12-17
// @exclude      *://greasyfork.org*
// @exclude      *://github.com*
// @exclude      *://*.github.io*
// @match        *://**/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant	     GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @icon         https://saltzmanalaric.github.io/favicon.ico
// @require      https://cdn.jsdelivr.net/gh/SaltzmanAlaric/weekly@v1.0.6/lib/L2Dwidget.min.js
// @require      https://cdn.jsdelivr.net/gh/SaltzmanAlaric/weekly@v1.0.6/lib/L2Dwidget.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/392403/%E6%A1%8C%E9%9D%A2%E5%8A%A8%E7%94%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/392403/%E6%A1%8C%E9%9D%A2%E5%8A%A8%E7%94%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var version = "1.5.4";

     var models = [
        {model:"chitose", height:212},
        {model:"haruto", height:220},
        {model:"hibiki", height:400},
        {model:"hijiki", height:200},
        {model:"izumi", height:206},
        {model:"koharu", height:220},
        {model:"miku", height:250},
        {model:"nico", height:190},
        {model:"nipsilon", height:180},
        {model:"nito", height:190},
        {model:"shizuku", height:342},
        {model:"tororo", height:200},
        {model:"tsumiki", height:280},
        {model:"unitychan", height:190},
        {model:"wanko", height:180},
        {model:"z16", height:300}
    ];

    var settings = window.localStorage.getItem("live2dSettings-"+version);
    var settingsObj = {model:-1, location:'right',dialog:true,hide:false}
    if (settings == null) {
        settings = JSON.stringify(settingsObj);
    } else {
        settingsObj=JSON.parse(settings);
    }
    window.localStorage.setItem("live2dSettings-"+version, settings);

    function getChoosed(name){
        for(var i=0;i<document.getElementsByName(name).length;i++){
            if (document.getElementsByName(name)[i].checked){
                return i;
            }
        }
        return null;
    }
    // 保存配置
    function saveSettings() {
        settingsObj.model= getChoosed("live2d-model")-1;
        settingsObj.location= ["right","top","left"][getChoosed("live2d-location")];
        settingsObj.dialog= getChoosed("live2d-dialog")==0;
        settingsObj.hide= getChoosed("live2d-hide")==0;
        settings = JSON.stringify(settingsObj);
        window.localStorage.setItem("live2dSettings-"+version, settings);
        window.location.reload();
    }

    //添加CSS的代码--copy的
    function addStyle(css) {
        let pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" must="false" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        return document.insertBefore(pi, document.documentElement);
    }
    /*自定义css效果*/
    //addStyle("#live2d-settings-container{background-color: transparent;display:none;}\n#live2d-settings input[type='radio'] {border: 1px solid #B4B4B4;padding: 1px;margin: 3px;width: 13px;height: 13px;}\nfieldset#deskAnimate{border:2px groove #ccc;-moz-border-radius:3px;border-radius:3px;padding:4px 9px 6px 9px;margin:2px;display:block;width:auto;height:auto}\n#live2d-settings{padding:10px;position: fixed;top: 0.5vw;right: 1vw;z-index: 999999;text-align:left;background-color: white;}\n.settings-btn{background-color: #479D18;color: #FFF;font-size: 18px;font-weight: bold;margin: 10px 20px 12px 0;min-width: 120px;position:relative;float: left;box-shadow: inset 0 10px 5px white;border: 1px solid #ccc;border-radius: 3px;padding: 2px 3px;cursor: pointer;width: 50px;}");

    var fmtDate = function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var date = now.getDate();
        var week = "星期" + ["日","一","二","三","四","五","六"][now.getDay()];
        return "今天是"+year+"年"+("0"+month).slice(-2)+"月"+ ("0"+date).slice(-2)+"日（"+ week + "）";
    }

    var titleEle = document.getElementsByTagName("title")[0];
    var title= titleEle? titleEle.innerText : window.location.href;
    var temptitle= " " + title+" | ";
    var length=title.length;
    // title跑马灯
    var move = function() {
        if (length <20 || !titleEle) {//title大于20个字符执行
            return;
        }
        temptitle=temptitle.concat(temptitle.charAt(0));
        length=temptitle.length;
        temptitle=temptitle.substring(1,length);
        titleEle.innerText = temptitle;
    }
    var timer = setInterval(move, 300);
    document.addEventListener('visibilitychange', function(){
        if(document.visibilityState=='hidden'){
            window.clearInterval(timer);
            titleEle.innerText = title;
        }else{
             timer = window.setInterval(move, 300);
        }
    });

     // 如果不存在的话，那么自己创建一个-copy from superPreload
    if (document.body != null && document.querySelector("#live2d-settings") == null) {
        let settings = window.localStorage.getItem("live2dSettings");
        let Container = document.createElement('div');
        Container.setAttribute("style","background-color: transparent;display:none;");
        Container.id = "live2d-settings-container";
        var content= "<div id='live2d-settings' style='padding:10px;position: fixed;top: 0.5vw;right: 1vw;z-index: 999999;text-align:left;background-color: white;'><fieldset id='deskAnimate' style='border:2px groove #ccc;-moz-border-radius:3px;border-radius:3px;padding:4px 9px 6px 9px;margin:2px;display:block;width:auto;height:auto'><legend><a target='_blank' href='https://greasyfork.org/zh-CN/scripts/392403' style='color: red;' title='桌面动画助手相关设置'>桌面动画助手设置V" + version+"</a></legend>\n";
        content +="<table><tr><td>model类型：</td><td><input name='live2d-model' value='-1' "+ (settingsObj.model==-1? "checked" : "")+" type='radio'>随机</td></tr>";
        for(var i=0;i<models.length;i++) {
            content += "<tr><td><input name='live2d-model' value='"+i+"' "+(settingsObj.model==i? "checked" : "")+" type='radio'>"+models[i].model+"</td>";
            if (i+1<models.length) {
                content += "<td><input name='live2d-model' value='"+(i+1)+"' " +(settingsObj.model==i+1? "checked" : "")+" type='radio'>"+models[i+1].model+"</td>"
            }
            content += "</tr>";
            i++;
        }
        content += "</table><hr/><div>位置： <input name='live2d-location' value='right' "+(settingsObj.location=='right'? "checked" : "")+" type='radio'>右下 <input name='live2d-location' value='top'  "+(settingsObj.location=='top'? "checked" : "")+" type='radio'>左上 <input name='live2d-location' value='left'  "+(settingsObj.location=='left'? "checked" : "")+" type='radio'>左下</div>";
        content += "<hr/><div>对话： <input name='live2d-dialog' value=true "+(settingsObj.dialog? "checked" : "")+" type='radio'>有&emsp; <input name='live2d-dialog' value=false "+(settingsObj.dialog? "" : "checked")+" type='radio'>无</div>";
        content += "<hr/><div>是否隐藏： <input name='live2d-hide' value=true "+(settingsObj.hide? "checked" : "")+" type='radio'>是<input name='live2d-hide' value=false "+(settingsObj.hide? "" : "checked")+" type='radio'>否";
        content += "<hr/><div><a style='color:red;' target='_blank' href='https://greasyfork.org/zh-CN/forum/post/discussion?script=392403'>联系作者,提建议,寻求帮助,脚本定制点我</a></div>";
        content += "<div><button class='settings-btn' style='background-color: #479D18;color: #FFF;font-size: 18px;font-weight: bold;margin: 10px 20px 12px 0;min-width: 120px;position:relative;float: left;box-shadow: inset 0 10px 5px white;border: 1px solid #ccc;border-radius: 3px;padding: 2px 3px;cursor: pointer;width: 50px;float: left;' onclick='document.querySelector(\"#live2d-settings-container\").style.display = \"none\";'> 取消 </button><button id='live2d-saveBtn' class='settings-btn' style='background-color: #479D18;color: #FFF;font-size: 18px;font-weight: bold;margin: 10px 20px 12px 0;min-width: 120px;position:relative;float: left;box-shadow: inset 0 10px 5px white;border: 1px solid #ccc;border-radius: 3px;padding: 2px 3px;cursor: pointer;width: 50px;float: right;'> 保存 </button></div>";
        content += "</fieldset></div>";
        Container.innerHTML = content;
        try {
            document.body.appendChild(Container);
        } catch (e) {
            console.log(e);
        }
        try {
             document.querySelector("#live2d-saveBtn").addEventListener("click",function(){ saveSettings()});
         } catch (e) {}
    } // end if

     try {
         GM_registerMenuCommand('live2d配置', function () {
             document.querySelector("#live2d-settings-container").style.display = 'block';
         });
     } catch (e) {}





var r = settingsObj.model == -1 ? parseInt(Math.random() * models.length) : settingsObj.model;
    //r=10;
    if (!document.getElementById("live2d-widget") && !settingsObj.hide) {
        setTimeout(function() {
            L2Dwidget.init({
                "model": {
                    "jsonPath": "https://unpkg.com/live2d-widget-model-" + models[r].model + "@1.0.5/assets/"+ models[r].model + ".model.json",
                    "scale": 1
                },
                "display": {
                    "superSample": 2,
                    "width": 180,
                    "height": models[r].height,
                    "position": settingsObj.location,
                    "hOffset": 30,
                    "vOffset": 0
                },
                "mobile": {
                    "show": false,
                    "scale": 0.5
                },
                "react": {
                    "opacityDefault": 0.7,
                    "opacityOnHover": 0.2
                },
                "dialog": {
                    // 开启对话框
                    enable: settingsObj.dialog,
                    script: {
                        // 每空闲 10 秒钟，显示一条一言
                        'every idle 10s': '$hitokoto$',
                        // 当触摸到角色身体
                        'tap body': fmtDate(),
                        // 当触摸到角色头部
                        'tap face': '你正在浏览【'+title+"】"
                    }
                }
            });//end init
        }, 3000);
        setTimeout(function() {
            var widgetEle = document.getElementById("live2d-widget");
            widgetEle.style.pointerEvents = "auto";
            widgetEle.onmousedown = function(ev){
                var oevent = ev || event;
                var distanceX = oevent.clientX - widgetEle.offsetLeft;
                var distanceY = oevent.clientY - widgetEle.offsetTop;
                document.onmousemove = function(ev){
                    var oevent = ev || event;
                    var dx = oevent.clientX - distanceX;
                    var dy = oevent.clientY - distanceY;
                    if (dx < window.innerWidth-180 && dx >= 0) {
                        widgetEle.style.left = dx + 'px';
                    }
                    if (dy < window.innerHeight-models[r].height && dy >= 0) {
                        widgetEle.style.top = dy + 'px';
                    }
                };
                document.onmouseup = function(){
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        }, 5000);
    } // end if

})();
