// ==UserScript==
// @name         一企一策自动继续播放脚本
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  实现一企一策学习视频的可选择倍速播放且自动点击防挂机窗口的'确定'按钮
// @author       小成成
// @match        https://app.hrss.xm.gov.cn/px/Pages/*
// @match        https://yqyc.fjylzbrt.com:8090/px/Pages/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422636/%E4%B8%80%E4%BC%81%E4%B8%80%E7%AD%96%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/422636/%E4%B8%80%E4%BC%81%E4%B8%80%E7%AD%96%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ask_permission = false;
    var play_finish = false;
    var button_added = false;
    setTimeout(function()
	{
        if(document.getElementsByTagName("video")[0] != undefined)
        {
            if(ask_permission == false)
            {
                Notification.requestPermission();
                ask_permission = true;
            }
            if(button_added == false)
            {
                var speed_option = document.createElement("SELECT");
                var lable = document.createElement("INPUT");
                /*
                *desc 根据不同浏览器给元素添加事件
                *parma object obj(要添加事件的对象)
                *parma string eventname(要添加的事件名)
                *parma string callback(回调函数名)
                *return void
                */
                var addEvent = function( obj, eventname, callback ){
                    //其他浏览器
                    if(window.addEventListener){
                        obj.addEventListener( eventname, callback, false );
                    }
                    //ie
                    else{
                        obj.attachEvent( 'on'+eventname, callback );
                    }
                    return;
                }
                var mychange = function( var1,var2 ){
                    if(document.getElementById("divVideoMain") != undefined)
                    {
                        document.getElementsByTagName("video")[0].playbackRate=speed_option.value;
                    }
                    alert('已调整倍速为：'+speed_option.value+'倍速');
                    //alert('当前选中项的值为:'+speed_option.value+' 当前选中项的文字描述为:'+speed_option.options[speed_option.selectedIndex].text);
                    //alert(var1+var2);
                }
                //speed_option.style.height = "30px";
                speed_option.style.width = "75px";
                speed_option.style.align = "center";
                speed_option.style.marginLeft = "10px";
                speed_option.style.marginBottom = "10px";
                speed_option.style.background = "#b46300";
                speed_option.style.border = "1px solid " + "#b46300";//52
                speed_option.style.color = "white";
                var opt = new Option("X1.0",1);
                speed_option.options.add(opt);
                opt = new Option("X1.5",1.5);
                speed_option.options.add(opt);
                opt = new Option("X2.0",2);
                speed_option.options.add(opt);
                opt = new Option("X3.0",3);
                speed_option.options.add(opt);
                opt = new Option("X5.0",5);
                speed_option.options.add(opt);
                opt = new Option("X10.0",10);
                speed_option.options.add(opt);
                opt = new Option("X16.0",16);
                speed_option.options.add(opt);
                lable.style.width = "120px";
                lable.style.align = "center";
                lable.style.marginLeft = "30px";
                lable.style.marginBottom = "10px";
                lable.style.background = "#b46300";
                lable.style.border = "1px solid " + "#b46300";//52
                lable.style.color = "white";
                lable.setAttribute("value", "选择播放速率:");
                if(document.getElementById("divVideoMain") != undefined)
                {
                    button_added = true;
                    document.getElementsByTagName("video")[0].muted = true;
                    document.getElementsByTagName("video")[0].play();
                    document.getElementsByTagName("video")[0].playbackRate=1;
                    var x = document.getElementById("divVideoMain");
                    addEvent( speed_option, 'change', function(){mychange('添加change事件,','并且能传参')} );
                    x.appendChild(lable);
                    x.appendChild(speed_option);
                }
            }
            setInterval(function ()
                        {
                var ti = document.getElementsByTagName("video")[0].duration-document.getElementsByTagName("video")[0].currentTime
                if(ti == 0 && play_finish == false)
                {
                    play_finish = true;
                    Notification.requestPermission().then(function(permission) {
                        if(permission == 'granted') {
                            var mynotification = new Notification("播放结束！请手动选择下一个视频！", {
                                body: "by william"
                            });
                            mynotification.onclick = function() {
                                alert(content)
                                mynotification.close();
                            }
                        }
                    });
                }
                //console.log(ti)
                if(ti !=0 && document.querySelector(".layui-layer-btn0") != undefined)
                {
                    console.log("close dialog automatically!!!")
                    setTimeout(function(){document.querySelector(".layui-layer-btn0").click()},1000);
                    //window.close();
                    //setTimeout(function(){window.location.reload();},7000);
                }
            }, 5000);//设置5秒循环判断是否学完是否检测挂机
        }
    }, 1000);
})();