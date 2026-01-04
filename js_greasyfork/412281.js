// ==UserScript==
// @name        东大健康打卡
// @namespace   Violentmonkey Scripts
// @include      *://*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant GM_registerMenuCommand
// @version     2.2
// @author      Leger
// @description NEU东北大学每日健康打卡工具，一键即可完成体温和行程的上报。
// @downloadURL https://update.greasyfork.org/scripts/412281/%E4%B8%9C%E5%A4%A7%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/412281/%E4%B8%9C%E5%A4%A7%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==
$(function(){
    function getToken(time){
        let token="";
        if(time==4)$.ajax({
            url:"https://e-report.neu.edu.cn/mobile/notes/create",
            type: "GET",
            async:false,
            success:function(data,status){
                if(status="success"){
                    let matchArr=data.match(/(?<=<meta name="csrf-token" content=").*?(?=">)/);
                    if(!!matchArr){
                        token=matchArr[0];
                    }
                    else alert("token匹配失败");

                }
                else alert("token获取失败");
            }
        })
        else $.ajax({
            url:"https://e-report.neu.edu.cn/inspection/items/"+time+"/records/create",
            type: "GET",
            async:false,
            success:function(data,status){
                if(status="success"){
                    let matchArr=data.match(/(?<=<meta name="csrf-token" content=").*?(?=">)/);
                    if(!!matchArr){
                        token=matchArr[0];
                    }
                    else alert("token匹配失败");

                }
                else alert("token获取失败");
            }
        })
        return token;
    }
    function getInfo(){
        let info;
        $.ajax({
            url:"https://e-report.neu.edu.cn/mobile/notes/create",
            type: "GET",
            async:false,
            success:function(data,status){
                if(status="success"){
                    let matchArr=data.match(/(?<=<script>([\n]|.)*?\$\.getJSON\(").*?(?="\))/);
                    if(!!matchArr){
                        let infoUrl=matchArr[0].replaceAll("\\","");
                        $.ajax({
                            url:infoUrl,
                            type:"GET",
                            async:false,
                            contentType:"json",
                            success:function (resp){
                                info=resp;
                            }
                        })
                    }
                    else alert("token匹配失败");

                }
                else alert("token获取失败");
            }
        })
        return info;
    }
    function reportTem(time,token){
        let num=Math.floor((Math.random()*8))*0.1+36;
        data={
            temperature:num,
            suspicious_respiratory_symptoms:"0",
            _token:token
        }

        $.post("https://e-report.neu.edu.cn/inspection/items/"+time+"/records",data,(resp,status)=>{
            if (status=="success"){
                if(+time<3)
                    report(+time+1);
                else
                    reportItin();
            }
            else alert("体温上报失败");
        })
    }
    function report(time){
        let token=getToken(time);
        reportTem(time,token);
    }
    function reportItin(){
        let info=getInfo();
        let data={
            "_token": getToken(4),
            "jibenxinxi_shifoubenrenshangbao": "1",
            "profile": {
                "xuegonghao": info.data.xuegonghao,
                "xingming": info.data.xingming,
                "suoshubanji": info.data.suoshubanji
            },
            "jiankangxinxi_muqianshentizhuangkuang": "正常",
            "xingchengxinxi_weizhishifouyoubianhua": "0",
            "cross_city": "无",
            "qitashixiang_qitaxuyaoshuomingdeshixiang": "",
            "credits": "3",
            "bmap_position": "",
            "bmap_position_latitude": "",
            "bmap_position_longitude": "",
            "bmap_position_address": "",
            "bmap_position_status": "",
            "ProvinceCode": "",
            "CityCode": "",
            "travels": []
        }
        $.post("https://e-report.neu.edu.cn/api/notes",data,function (resp,status){
            if(status=="success"){
                location.replace("https://e-report.neu.edu.cn/inspection/items");
            }
        })
    }
    if(location.href=="https://e-report.neu.edu.cn/inspection/items/1/records/create"){
        report(1);
    }

    if(location.href=="https://e-report.neu.edu.cn/inspection/items"){
        if($("img.success").length==3&&$("img.successImg").length==1)
            alert("健康上报成功！\n(提交的是前一天的数据，行程如有变化请手动提交)");
        else alert("呜呜~上报失败了");
    }

    if(location.href=="https://e-report.neu.edu.cn/notes/create"){
        if(confirm("是否注销登录？"))
            $("#logout-form").submit();
    }

    function daka(){
        window.open("https://e-report.neu.edu.cn/inspection/items/1/records/create")
    }
    GM_registerMenuCommand("一键打卡", daka);

    function zhuxiao(){
        window.open("https://e-report.neu.edu.cn/notes/create")
    }
    GM_registerMenuCommand("注销登录", zhuxiao);

})



