// ==UserScript==
// @name         dpl
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       You
// @match        http://123.58.243.43/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/39338/dpl.user.js
// @updateURL https://update.greasyfork.org/scripts/39338/dpl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var html="用户名：<input type='text' id='username' value='dongpeilong'><br/>"+
             "密　码：<input type='password' id='password' value='xinbo1234'><br/>"+
             "设备ID：<input type='text' id='deviceId' value='36851d0af5cb5c287d5fd916ea4ceb419'><p/>"+
             "经　度：<input type='text' id='longitude' value=''><br/>"+
             "纬　度：<input type='text' id='latitude' value=''><br/>"+
             "地　址：<input type='text' id='place' value=''><br/>"+
             "备　注：<input type='text' id='note' value=''><br/>"+
             "<input type='button' id='clockinBtn' value='打卡'><p/>"+
             "预置地址：<select id='presetPlace'>"+
             "<option></option>"+
             "<option longitude='112.43507704109796' latitude='34.676096690419341' note='洛阳中心医院' place='河南省洛阳市西工区唐宫西路'>洛阳市中心医院-北门</option>"+
             "<option longitude='112.45769146873146' latitude='34.62854250890327' note='洛阳办公室' place='河南省洛阳市洛龙区政和路18'>洛阳新奥华油燃气有限公司</option>"+
             "<option longitude='112.48122034387215' latitude='34.70504712378683' note='洛阳三院' place='龙泉三街坊158号'>洛阳市第三人民医院</option>"+
             "</select><br>"+
             "<a href='http://api.map.baidu.com/lbsapi/getpoint/index.html' target='_blank'>拾取坐标</a>";
    $("body").html(html);

    $("#presetPlace").on("change",function(){
        var option=$(this).find("option:selected");
        $("#longitude").val(option.attr("longitude"));
        $("#latitude").val(option.attr("latitude"));
        $("#place").val(option.attr("place"));
        $("#note").val(option.attr("note"));
    });

    $("#clockinBtn").on("click",function(){
        loginClickin($("#deviceId").val(),$("#username").val(),$("#password").val());
    });

    function loginClickin(deviceId,username,password){
        GM_xmlhttpRequest({//登录
            method: "POST",
            url:"http://api-icome.enncloud.cn/licensor/login",
            headers: {
                "ticket": "",
                "Content-Type": "application/json; charset=UTF-8",
                "User-Agent":"Dalvik/2.1.0 (Linux; U; Android 8.0.0;HONOR;BKL-AL20)"
            },
            responseType:"json",
            data:JSON.stringify({"deviceId":deviceId,"password":password,"userAgent":"3/1.4.4;Android 8.0.0;HONOR;BKL-AL20","username":username}),
            onload: function(response) {
                if(response.status==200){
                    var obj = JSON.parse(response.responseText);
                    if(obj.errno==0){
                        console.log("eName:"+obj.data.employee.eName+", ticket:"+obj.data.ticket);
                        clickin(obj.data.ticket,$("#longitude").val(),$("#latitude").val(),$("#place").val(),$("#note").val());
                    }else{
                        alert(obj.error);
                    }
                }else{
                    alert("status:"+response.status+", responseText:"+response.responseText);
                }
            }
        });
    }

    function clickin(ticket,longitude,latitude,place,note){
        var data={"shift":2,"longitude":longitude,"latitude":latitude,"result":"外出打卡","place":place};
        if(note!=""){
            data.note=note;
        }

        GM_xmlhttpRequest({//打卡
            method: "POST",
            url:"http://123.58.243.43/attendance/record",
            headers: {
                "ticket": ticket,
                "User-Agent":"Mozilla/5.0 (Linux; Android 8.0.0; BKL-AL20 Build/HUAWEIBKL-AL20; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36 3/1.4.4;Android 8.0.0;HONOR;BKL-AL20",                
                "Content-Type": "application/json; charset=UTF-8",
                "Referer": "http://123.58.243.43/attendance/?toolbar=0&ticket="+ticket
            },
            data:JSON.stringify(data),
            onload: function(response) {
                if(response.status==200){
                    var obj = JSON.parse(response.responseText);
                    if(obj.id&&obj.eId){
                        alert(obj.time+" 打卡成功");
                    }else{
                        alert("打卡失败");
                    }
                }else{
                    alert("status:"+response.status+", responseText:"+response.responseText);
                }
            }
        });
    }
})();