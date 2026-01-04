// ==UserScript==
// @name         大炮传奇
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       怪力灯泡
// @match        http://dpcq.nmb666.com/game/index.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397998/%E5%A4%A7%E7%82%AE%E4%BC%A0%E5%A5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/397998/%E5%A4%A7%E7%82%AE%E4%BC%A0%E5%A5%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zidongfuben;
    var zidongwakuang;
    window.fuben_zudui_team_zidong_check = function(){

        if($('#div_fuben_zidong_team')[0].innerText=="开启自动"){
            if($('#fuben_id').val()==""){
                alert("请输入副本ID");
                return;
            }
            zidongfuben = window.setInterval(function(){
                if(!$('#div_fuben_map_list').is(':hidden')){
                    fuben_create_fight_check($('#fuben_id').val());
                }
            },1000);
            zidongfuben;
            $('#div_fuben_zidong_team').html("<div id='div_fuben_zidong_team' class='div_fuben_team_css' style='float: right; '><button class='btn2' onclick='fuben_zudui_team_zidong_check();'>关闭自动</button></div>");
        }else{
            window.clearInterval(zidongfuben);
            $('#div_fuben_zidong_team').html("<div id='div_fuben_zidong_team' class='div_fuben_team_css' style='float: right; '><button class='btn2' onclick='fuben_zudui_team_zidong_check();'>开启自动</button></div>");
        }
    }

     window.zidong_wakuang_check = function(){

        if($('#div_zidong_wakuang')[0].innerText=="开启自动"){

            zidongwakuang = window.setInterval(function(){
                document.getElementById('btn_caikuang_wa_tiekuang').click();
            },334);
            zidongwakuang;
            $('#div_zidong_wakuang').html("<div id='div_zidong_wakuang' class='div_fuben_team_css' style='float: right; '><button class='btn2' onclick='zidong_wakuang_check();'>关闭自动</button></div>");
        }else{
            window.clearInterval(zidongwakuang);
            $('#div_zidong_wakuang').html("<div id='div_zidong_wakuang' class='div_fuben_team_css' style='float: right; '><button class='btn2' onclick='zidong_wakuang_check();'>开启自动</button></div>");
        }
    }

    var xs = window.setInterval(function(){
        if($('#div_fuben_zidong_team')[0]!=undefined){
            window.clearInterval(xs);
            return;
        }
        if(!$('#div_fuben_jiesan_team').is(':hidden')){
            $("#div_fuben_jiesan_team").after("<div style='float: left;'><div style='border: 1px solid #000; border-radius: 10px;'><div style='border: 2px solid #cc8e17; border-radius: 9px; background-color: #5c5140;'><div style='width: 150px; height: 40px; line-height: 40px; border: 1px solid #000;border-radius: 8px;'><input id='fuben_id' class='ipt_class' type='number' value=''></div></div></div></div>");
            $("#div_fuben_jiesan_team").after("<div id='div_fuben_zidong_team' class='div_fuben_team_css' style='float: right; '><button class='btn2' onclick='fuben_zudui_team_zidong_check();'>开启自动</button></div>");
        }
    },1000);

    var wk = window.setInterval(function(){
         if($('#div_zidong_wakuang')[0]!=undefined){
            window.clearInterval(wk);
            return;
        }
        if(!$('#btn_caikuang_lingqu_tiekuang').is(':hidden')){
            $("#btn_caikuang_lingqu_tiekuang").after("<div id='div_zidong_wakuang' class='div_fuben_team_css' style='float: right; '><button class='btn2' onclick='zidong_wakuang_check();'>开启自动</button></div>");
        }
    },1000);

    var url = location.href;
    console.log("[LoginOnlinePlugin "+curentTime()+"] "+url+" 防掉线外挂已启用！");

    function get(url){
        console.log("[LoginOnlinePlugin "+curentTime()+"] request url="+url);
        var xmlHttpReq = null;
        if (window.ActiveXObject){
            xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }else if (window.XMLHttpRequest){
            xmlHttpReq = new XMLHttpRequest();
        }
        xmlHttpReq.open("GET", url, true);
        xmlHttpReq.onreadystatechange = function(){
            if (xmlHttpReq.readyState == 4)
            {
                if (xmlHttpReq.status == 200)
                {
                    var result = xmlHttpReq.responseText;
                    console.log("[LoginOnlinePlugin "+curentTime()+"] 刷新成功！")
                }
            }
        };
        xmlHttpReq.send(null);
    }

    function curentTime()
    {
        return new Date().toLocaleString();
    }
    var interval = 1000 * 120; //刷新间隔
    var req = function(){get(url);}
    setInterval(req, interval);


})();