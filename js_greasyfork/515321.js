// ==UserScript==
// @name         丝瓜管理面板内部功能自定义
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  空闲时间随便写的，懒的去加其他东西，能用就行，不喜勿喷。
// @author       limm
// @match        http://111.180.189.184:65000/Main/Index
// @match        http://111.180.189.184:65000/PlayerOnline/CurrentPlayer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=189.213
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515321/%E4%B8%9D%E7%93%9C%E7%AE%A1%E7%90%86%E9%9D%A2%E6%9D%BF%E5%86%85%E9%83%A8%E5%8A%9F%E8%83%BD%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/515321/%E4%B8%9D%E7%93%9C%E7%AE%A1%E7%90%86%E9%9D%A2%E6%9D%BF%E5%86%85%E9%83%A8%E5%8A%9F%E8%83%BD%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==
window.onload =function() {
    'use strict';
    var opa= window.location.pathname;
    if(opa=="/Main/Index"){
        var b = document.getElementById("flexible");
        var a =document.createElement("button");
        var c = document.getElementsByClassName ("layui-tab")[0];
        c.style.marginLeft="80px";
        a.style.width="40px";
        a.style.height="100%";
        a.style.position="absolute";
        a.style.top="0";
        a.style.boxSizing="border-box";
        a.style.left="80px";
        a.textContent ="急急国王脚本支持";
        a.style.fontSize="10px";
        b.after(a);
    }else if(opa == "/PlayerOnline/CurrentPlayer"){
        var wq = document.getElementById("tankseed");
        var button =document.createElement("button");
        var button_q = document.createElement("button");
        var button_w = document.createElement("button");
        var button_u = document.createElement("button");
        var input =document.createElement("input");
        var input_1 =document.createElement("input");
        var input_0 = document.getElementById("AdminBroadcast");
        var button_1 =document.createElement("button");
        var senda=document.getElementById("send");
        var div_1 = document.createElement("div");
        var div_2 = document.getElementsByClassName('layui-fluid')[0];
        var div_1_button = document.createElement("button");
        div_1.style.width = "36rem";
        div_1.style.height = "35rem";
        div_1.style.backgroundColor = "rgb(252 252 252)";
        div_1.style.position = "fixed";
        div_1.style.zIndex = 100;
        div_1.style.top = "10%";
        div_1.style.right = "27%";
        div_1.style.boxShadow = "0px 0px 14px 1px";
        div_1.style.transition = "all 1s linear";
        div_1.style.display = "none";
        div_2.after(div_1);
        input.type="text";
        input_1.type="text";
        input.placeholder="发送次数";
        input_1.placeholder="发送间隔(秒)至少3秒";
        button_1.className="layui-btn layui-btn-primary layui-border-blue";
        button_1.innerText="重复发送";
        input_1.style.width="45%";
        input_1.style.height="2rem";
        input.style.width="45%";
        input.style.height="2rem";
        input_0.after(input);
        input_0.after(input_1);
        input_0.after(button_1);
        button_1.onclick = function(){
            var inputp = input.value;
            var inputpa = input_1.value;
            var inputpams =inputpa*1000;
            var namea = input_0.value;
            var liio = 0;
            if(inputpams<3){
                inputpams = 3;
            }
            var timep=setInterval(atime, inputpams);
            function atime(){
                input_0.value = "";
                input_0.value = namea;
                senda.click();
                liio++;
                if(liio==inputp){
                    input_0.value = "";
                    clearInterval(timep);
                }
            }
        }
        button_w.className = "layui-btn layuiadmin-btn-list layui-btn-sm";
        button_q.className = "layui-btn layuiadmin-btn-list layui-btn-sm";
        button.className ="layui-btn layuiadmin-btn-list layui-btn-sm";
        button_u.className = "layui-btn layuiadmin-btn-list layui-btn-sm";
        div_1_button.className = "layui-btn layuiadmin-btn-list layui-btn-sm";
        wq.after(button);
        button.after(button_q);
        button_q.after(button_w);
        button_w.after(button_u);
        button_u.after(div_1_button);
        button_u.innerText = "结束当前对局";
        var local = localStorage.getItem('1');
        if(local === null){
            localStorage.setItem('1', '关闭部署物限制');
            local = localStorage.getItem('1');
        }
        button_q.innerText = local;
        var local_2 = localStorage.getItem('3');
        if(local_2 === null){
            localStorage.setItem('3', '开启暖服');
            local_2 = localStorage.getItem('3');
        }
        button.innerText = local_2;
        var local_1 = localStorage.getItem('2');
        if(local_1 === null){
            localStorage.setItem('2', '设置服务器时间流速为1.4');
            local_1 = localStorage.getItem('2');
        }
        button_w.innerText= local_1;
        div_1_button.innerText = "计划执行";
        var kol = document.getElementById("SetCMD");
        var ska;
        var loaq;
        var zl;
        var lpaa;
        button.onclick = function(){
            var klapp = button.innerText;

            if(klapp === "开启暖服"){
                lpaa = "确定开启暖服?"
                var bool = confirm(lpaa);
                if(bool === true){
                    zl = ['AdminDisableVehicleClaiming 1','AdminForceAllRoleAvailability 1','AdminNoRespawnTimer 1','AdminDisableVehicleKitRequirement 1'];
                    localStorage.setItem('3', '关闭暖服');
                    button.innerText = "关闭暖服";
                }
            }
            if(klapp === "关闭暖服"){
                lpaa = "确定关闭暖服?"
                var bool_1 = confirm(lpaa);
                if(bool_1 === true){
                    zl = ['AdminDisableVehicleClaiming 0','AdminForceAllRoleAvailability 0','AdminNoRespawnTimer 0','AdminDisableVehicleKitRequirement 0'];
                    localStorage.setItem('3', '开启暖服');
                    button.innerText = "开启暖服";
                }
            }
            if(bool === true || bool_1 === true){
                kol.click();
                ska = document.getElementsByClassName ("layui-layer-input")[0];
                loaq = document.getElementsByClassName("layui-layer-btn0")[0];
                var ii=0
                var myTime=setInterval(time, 2000);
                function time(){
                    ska.value = zl[ii];
                    loaq.click();
                    //loaq_1.click();
                    ii++;
                    if(ii===4){
                        clearInterval(myTime);
                        ii=0;
                    }
                }
            }
        }
        button_u.onclick = function(){
            lpaa = "确定结束当局?";
            var bool = confirm(lpaa);
            if(bool === true){
                zl ="AdminEndMatch";
                lk();
            }
        }
        button_q.onclick = function(){
            var klapp = button_q.innerText;
            if(klapp === "关闭部署物限制"){
                lpaa = "确定取消部署物限制?"
                var bool = confirm(lpaa);
                if(bool === true){
                    zl = "AdminForceAllDeployableAvailability 1";
                    localStorage.setItem('1', '开启部署物限制');
                    button_q.innerText = "开启部署物限制";
                    lk();
                }
            }
            if(klapp === "开启部署物限制"){
                lpaa = "确定开启部署物限制?"
                var bool_1 = confirm(lpaa);
                if(bool_1 === true){
                    zl = "AdminForceAllDeployableAvailability 0";
                    localStorage.setItem('1', '关闭部署物限制');
                    button_q.innerText = "关闭部署物限制";
                    lk();
                }
            }
        }
        button_w.onclick = function(){
            var klapp = button_w.innerText;
            if(klapp === "设置服务器时间流速为1.4"){
                lpaa = "确定设置1.4变速?"
                var bool_1 = confirm(lpaa);
                if(bool_1 === true){
                    zl = "AdminSlomo 1.4";
                    localStorage.setItem('2', '设置服务器时间流速为1');
                    button_w.innerText = "设置服务器时间流速为1";
                    lk();
                }
            }
            if(klapp === "设置服务器时间流速为1"){
                lpaa = "确定设置服务器时间流速为1?"
                var bool = confirm(lpaa);
                if(bool === true){
                    zl = "AdminSlomo 1";
                    localStorage.setItem('2', '设置服务器时间流速为1.4');
                    button_w.innerText = "设置服务器时间流速为1.4";
                    lk();
                }
            }

        }
        function lk(){
            kol.click();
            ska = document.getElementsByClassName ("layui-layer-input")[0];
            loaq = document.getElementsByClassName("layui-layer-btn0")[0];
            ska.value = zl;
            loaq.click();

        }
        function asdtime(){
            var dataArray = ['急急国王','','',''];
            var data=['jijiguowang','','',''];
            var blockquote = document.querySelector('blockquote[class="layui-elem-quote"]');
            var spans = blockquote.getElementsByTagName('span');
            for (var i = 0; i < spans.length; i++) {
                var spanText =spans[i].innerText;
                if (data.includes(spanText)) {
                    var index = data.indexOf(spanText);
                    spans[i].innerText = dataArray[index];
                }
            }
        }
        window.setInterval(asdtime, 600);
    }
}();

