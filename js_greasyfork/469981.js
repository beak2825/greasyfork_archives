// ==UserScript==
// @name         SALE_AI_5
// @namespace    gx3000
// @version      0.0.17
// @description  for AIIM project
// @author       Pancras
// @run-at       document-start
// @match        http://*.gzqywlkj.com:90/*
// @match        http://web.zhsj.net.cn/*
// @match        http://web.sltech.net.cn/*
// @require     http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469981/SALE_AI_5.user.js
// @updateURL https://update.greasyfork.org/scripts/469981/SALE_AI_5.meta.js
// ==/UserScript==

var ailist = [];
var agentId = 0;
var start = false;
var refresh = true;
var bindACC = "";
var stamp = "";
var lsw = "1";
var auth_account;
var accID = 0;
const AI = "ai5";
const ver = "0.0.17";

(function($,window,document) {
    'use strict';
    var baseURL = "http://81.68.71.99:12009/";
    $.ajaxSettings.timeout='1000';
    if(AI!="dev")baseURL = "http://"+AI+".gx3000.com/";
    var token = localStorage.getItem("auth_token");
    try {
        $(document).ready(function(){
            if(localStorage.getItem("bindACC"))
                bindACC = localStorage.getItem("bindACC");
            if(localStorage.getItem("lsw"))
                lsw = localStorage.getItem("lsw")=="0"?"0":"1";
            let auth_tmp = localStorage.getItem("auth_account")
            let sig = "";
            if(auth_tmp){
                auth_account = JSON.parse(auth_tmp);
                sig = auth_account['accountId'];
                accID = auth_account['accountId'];
            }else{
                sig = "00";
            }
            if(localStorage.getItem("stamp")){
                stamp = localStorage.getItem("stamp");
            }else{
                stamp = Date.now()+(Math.floor(Math.random()*1000))+"0"+sig;
                localStorage.setItem("stamp",stamp);
            }

            setInterval(()=>{
                if(!start)return;
                if(refresh){
                    $('.user_active').click();
                }
                $.get(baseURL+"reply?token="+token+"&agentId="+agentId+"&accId="+accID,function(d,status){
                    if(d.code==1){
                        ailist = d.message
                        var div = $('div[role="listitem"]>.msg-line');
                        div.each(function(index,element){
                            //遍历ailist
                            for(let item in ailist){
                                if($(element).attr('id')=="userList_"+ailist[item]['botWxid']+"_"+ailist[item]['wxid']){
                                    $(element).find(".ivu-badge").find(".unhandler").remove();
                                    $(element).find(".ivu-badge").append("<span class='ivu-badge-count unhandler' style='right:30px'>人工</span>")
                                }
                            }
                        });
                    }
                });
            },3000)
            $('#app').append("<div id='show' style='position:absolute; top:0%; right: 0%;cursor:pointer; text-align:center; padding:5px 10px; background-color:green;opacity:0.7;border-radius:10px;color:white;'>控制台开关"+AI+ver+"</div>")
            $('#app').append("<div id='AIIM' style='position:absolute; top:35px; right: 0%; background-color:black;opacity:0.5; padding: 10px; border-radius:10px;'></div>")
            $('#AIIM').append("<div id='message' style='padding:5px 10px; color:white;'>正在启动...</div>")
            $('#AIIM').append("<div id='info' style='padding:5px 10px; color:white;'></div>")
            $('#AIIM').append("<div style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:yellow;opacity:0.7;border-radius:10px;color:black;'><select id='bindACC'></select></div>")
            $('#AIIM').append("<div id='ai' style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:green;opacity:0.7;border-radius:10px;color:white;'>AI/人工切换</div>")
            $('#AIIM').append("<div id='refresh' style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:red;opacity:0.7;border-radius:10px;color:white;'>停止刷新</div>")
            $('#AIIM').append("<div id='welcome' style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:green;opacity:0.7;border-radius:10px;color:white;'>发送开场词</div>")
            if(lsw=="1")
                $('#AIIM').append("<div id='link' style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:green;opacity:0.7;border-radius:10px;color:white;'>发送链接</div>")
            else
                $('#AIIM').append("<div id='link' style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:red;opacity:0.7;border-radius:10px;color:white;'>发送链接</div>")
            $('#AIIM').append("<div id='lsw' style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:green;opacity:0.7;border-radius:10px;color:white;'>链接开关</div>")
            $('#AIIM').append(AI+"_"+auth_account['accountId']+"_"+stamp)
            $('#show').unbind().on('click',function(){
                if($('#AIIM').css("visibility")=="visible")
                    $('#AIIM').css("visibility","hidden")
                else
                $('#AIIM').css("visibility","visible")
            });
            $('#refresh').unbind().on('click',function(){
                if(!refresh){
                    refresh = true;
                    $('#refresh').html("停止刷新")
                    $('#refresh').css("background-color","red");
                }else{
                    refresh = false;
                    $('#refresh').html("自动刷新")
                    $('#refresh').css("background-color","green");
                }
            });
            $("#bindACC").change(function(e){
                var checkText=$("#bindACC").val();
                if(checkText){
                    var pwd=prompt("请输入口令","");
                    localStorage.setItem("pwd",pwd);
                    bindACC = checkText
                    localStorage.setItem("bindACC",bindACC);
                }else{
                    bindACC = ""
                    localStorage.setItem("bindACC",bindACC);
                }
            })
            if(stamp=="")return;
            $.get(baseURL+"bind?token="+token+"&bind="+bindACC+"&stamp="+stamp+"&accId="+accID,function(d,status){
                if(d.code==1){
                    start = true;
                    agentId = d.agent;
                    $('#AIIM>#message').html("登录成功,Id:"+agentId);
                    $("#bindACC").empty();
                    $("#bindACC").append("<option value=''>未绑定</option>");
                    let ck = false;
                    for(let i in d.message){
                        if(d.message[i] == bindACC)ck = true;
                        $("#bindACC").append("<option value='"+d.message[i]+"'>"+d.message[i]+"</option>");
                    }
                    if(!ck)localStorage.removeItem("bindACC");
                    if(bindACC == ""){
                        $("#bindACC").val("未绑定")
                    }else{
                        $("#bindACC").val(bindACC)
                    }
                    $('#lsw').unbind().on('click',function(){
                        if(lsw=="0"){
                            lsw = "1"
                            $('#link').css("background-color","green")
                        }else{
                            lsw = "0"
                            $('#link').css("background-color","red")
                        }
                        localStorage.setItem("lsw",lsw);
                    })
                    $('#welcome').unbind().on('click',function(){
                        if(bindACC=="")return alert("未选择绑定账号，无法发送链接")
                        if($('.user_active').size()>0){
                            let v = $('.user_active').attr('id').split('_');
                            let botWxid = v[1] == "wxid" ? v[1]+"_"+v[2] : v[1];
                            let wxid = "";
                            if(v[1] == "wxid"){
                                for(let tmp in v){
                                    if(tmp>2){
                                        wxid += v[tmp]+"_"
                                    }
                                }
                            }else{
                                for(let tmp in v){
                                    if(tmp>1){
                                        wxid += v[tmp]+"_"
                                    }
                                }
                            }
                            wxid = wxid.substring(0, wxid.length - 1);
                            let groupName = "";
                            let nickName = "";
                            if($('#userList_'+botWxid+'_'+wxid).size()>0){
                                nickName = $('#userList_'+botWxid+'_'+wxid+" .user_name").text().trim();
                                groupName = $('#userList_'+botWxid+'_'+wxid+" .user_group").text().trim();
                            }
                            let pwd = localStorage.getItem("pwd")?localStorage.getItem("pwd"):""
                            $.post(baseURL+"sendman?token="+token,{
                                "botWxid":botWxid,
                                "contactId":wxid,
                                "agentId":agentId,
                                "bind":bindACC,
                                "stamp":stamp,
                                "accId":accID,
                                "nickName":nickName,
                                "groupName":groupName,
                                "lsw":lsw,
                                "type":"c",
                                "pwd":pwd
                            },function(data,status){
                                if(data.code == 1){
                                    $('#AIIM>#message').html(data.message);
                                    // window.location.reload();
                                }else{
                                    alert(data.message)
                                }
                            })
                        }else{
                            alert("请点击发送用户")
                        }
                    })
                    $('#link').unbind().on('click',function(){
                        if(lsw=="0")return alert("链接已禁用")
                        if(bindACC=="")return alert("未选择绑定账号，无法发送链接")
                        if($('.user_active').size()>0){
                            if (confirm("是否发送链接？")==true){ 
                                let v = $('.user_active').attr('id').split('_');
                                let botWxid = v[1] == "wxid" ? v[1]+"_"+v[2] : v[1];
                                let wxid = "";
                                if(v[1] == "wxid"){
                                    for(let tmp in v){
                                        if(tmp>2){
                                            wxid += v[tmp]+"_"
                                        }
                                    }
                                }else{
                                    for(let tmp in v){
                                        if(tmp>1){
                                            wxid += v[tmp]+"_"
                                        }
                                    }
                                }
                                wxid = wxid.substring(0, wxid.length - 1);
                                let groupName = "";
                                let nickName = "";
                                if($('#userList_'+botWxid+'_'+wxid).size()>0){
                                    nickName = $('#userList_'+botWxid+'_'+wxid+" .user_name").text().trim();
                                    groupName = $('#userList_'+botWxid+'_'+wxid+" .user_group").text().trim();
                                }
                                let pwd = localStorage.getItem("pwd")?localStorage.getItem("pwd"):"";
                                $.post(baseURL+"sendman?token="+token,{
                                    "botWxid":botWxid,
                                    "contactId":wxid,
                                    "agentId":agentId,
                                    "bind":bindACC,
                                    "stamp":stamp,
                                    "accId":accID,
                                    "nickName":nickName,
                                    "groupName":groupName,
                                    "lsw":lsw,
                                    "type":"l",
                                    "pwd":pwd
                                },function(data,status){
                                    if(data.code == 1){
                                        $('#AIIM>#message').html(data.message);
                                        // window.location.reload();
                                    }else{
                                        alert(data.message)
                                    }
                                })
                            }
                        }else{
                            alert("请点击发送用户")
                        }
                    })
                    $('#AIIM').unbind().on('click','#ai',function(){
                        if($('.user_active').find('.unhandler').size()>0){
                            $('.user_active').find('.unhandler').each(function(index,element){
                                let v = $(element).parent().parent().attr('id').split('_');
                                let botWxid = v[1] == "wxid" ? v[1]+"_"+v[2] : v[1];
                                let wxid = "";
                                if(v[1] == "wxid"){
                                    for(let tmp in v){
                                        if(tmp>2){
                                            wxid += v[tmp]+"_"
                                        }
                                    }
                                }else{
                                    for(let tmp in v){
                                        if(tmp>1){
                                            wxid += v[tmp]+"_"
                                        }
                                    }
                                }
                                wxid = wxid.substring(0, wxid.length - 1);
                                if(bindACC=="")alert("未选择绑定账号，无法发送链接")
                                let groupName = "";
                                let nickName = "";
                                if($('#userList_'+botWxid+'_'+wxid).size()>0){
                                    nickName = $('#userList_'+botWxid+'_'+wxid+" .user_name").text().trim();
                                    groupName = $('#userList_'+botWxid+'_'+wxid+" .user_group").text().trim();
                                }
                                let pwd = localStorage.getItem("pwd")?localStorage.getItem("pwd"):""
                                $.post(baseURL+"setai",{
                                    "botWxid":botWxid,
                                    "wxid":wxid,
                                    "token":token,
                                    "agentId":agentId,
                                    "bind":bindACC,
                                    "stamp":stamp,
                                    "accId":accID,
                                    "nickName":nickName,
                                    "groupName":groupName,
                                    "lsw":lsw,
                                    "ai":1,
                                    "pwd":pwd
                                },function(data,status){
                                    if(data.code == 1){
                                        $('#AIIM>#message').html(data.message);
                                        $(element).remove();
                                        // window.location.reload();
                                    }else{
                                        alert(data.message)
                                    }
                                })
                            })
                        }else{
                            if($('.user_active').size()>0){
                                let v = $('.user_active').attr('id').split('_');
                                let botWxid = v[1] == "wxid" ? v[1]+"_"+v[2] : v[1];
                                let wxid = "";
                                if(v[1] == "wxid"){
                                    for(let tmp in v){
                                        if(tmp>2){
                                            wxid += v[tmp]+"_"
                                        }
                                    }
                                }else{
                                    for(let tmp in v){
                                        if(tmp>1){
                                            wxid += v[tmp]+"_"
                                        }
                                    }
                                }
                                wxid = wxid.substring(0, wxid.length - 1);
                                let groupName = "";
                                let nickName = "";
                                if($('#userList_'+botWxid+'_'+wxid).size()>0){
                                    nickName = $('#userList_'+botWxid+'_'+wxid+" .user_name").text().trim();
                                    groupName = $('#userList_'+botWxid+'_'+wxid+" .user_group").text().trim();
                                }
                                let pwd = localStorage.getItem("pwd")?localStorage.getItem("pwd"):""
                                $.post(baseURL+"setai",{
                                    "botWxid":botWxid,
                                    "wxid":wxid,
                                    "token":token,
                                    "agentId":agentId,
                                    "bind":bindACC,
                                    "stamp":stamp,
                                    "accId":accID,
                                    "nickName":nickName,
                                    "groupName":groupName,
                                    "lsw":lsw,
                                    "ai":2,
                                    "pwd":pwd
                                },function(data,status){
                                    if(data.code == 1){
                                        $('#AIIM>#message').html(data.message);
                                        // window.location.reload();
                                    }else{
                                        alert(data.message)
                                    }
                                })
                            }else{
                                alert("请点击切换用户")
                            }
                        }
                        
                    });
                    setTimeout(()=>{
                        if(bindACC=="")return;
                        let pwd = localStorage.getItem("pwd")?localStorage.getItem("pwd"):""
                        $.get(baseURL+"contacts?token="+token+"&bind="+bindACC+"&stamp="+stamp+"&accId="+accID+"&agent="+agentId+"&lsw="+lsw+"&pwd="+pwd,function(d,status){
                            if(d.code==1){
                            }else{
                                alert(d.message)
                            }
                        });
                    },6000);
                }else{
                    agentId = 0;
                    $('#AIIM>#message').html(d.message);
                }
            })
            var OriginalWS = window.WebSocket;
            var initOWS = OriginalWS.apply.bind(OriginalWS);
            var wsListener = OriginalWS.prototype.addEventListener;
            wsListener = wsListener.call.bind(wsListener);
            function MyWS(url, opts) {
                var ws;
                if (this instanceof WebSocket) {
                    if (arguments.length === 1) {
                        ws = new OriginalWS(url);
                    } else if (arguments.length >= 2) {
                        ws = new OriginalWS(arguments[0],arguments[1]);
                    } else {
                        ws = new OriginalWS();
                    }
                } else {
                    ws = initOWS(this, arguments);
                }
                $('#AIIM>#info').html("等待消息")
                wsListener(ws, "message", function(event){
                    let orgdata;
                    try{
                        if(event.data.byteLength>100 && start){
                            var utf8 = new Uint8Array(event.data.slice(24));
                            var deCodeUtf = new TextDecoder()
                            var str = deCodeUtf.decode(utf8)
                            orgdata = str;
                            console.log(str)
                            if(str.substring(0,1)!="{"){
                                str = '{"'+str.substring(2);
                            }
                            var res = JSON.parse(str)
                            console.log(res.data)
                            // if(res.data['msgContent']){
                                if(bindACC=="")alert("未选择绑定账号，无法发送链接")
                                let pwd = localStorage.getItem("pwd")?localStorage.getItem("pwd"):"";
                                // $('#AIIM>#info').html(res.data['msgId']+"收到"+res.data['contactId']+"信息");
                                let groupName = "";
                                let nickName = "";
                                if($('#userList_'+res.data['botWxid']+'_'+res.data['contactId']).size()>0){
                                    nickName = $('#userList_'+res.data['botWxid']+'_'+res.data['contactId']+" .user_name").text().trim();
                                    groupName = $('#userList_'+res.data['botWxid']+'_'+res.data['contactId']+" .user_group").text().trim();
                                }
                                var da = {"accId":accID,"pwd":pwd,"stamp":stamp,"bind":bindACC,"agentId":agentId,"botWxid":res.data['botWxid'],"contactId":res.data['contactId'],"senderWxId":res.data['senderWxId'],"msgContent":res.data['msgContent'],"msgId":res.data['msgId'],"msgType":res.data['msgType'],"nickName":nickName,"groupName":groupName,"lsw":lsw}
                                $.ajax({
                                    url:baseURL+"msg?token="+token,
                                    type:"POST",
                                    timeout:1000,
                                    data:da,
                                    complete: function(xhr, status){
                                        if(xhr.responseText=="success" || xhr.responseText=="fail"){
                                        }else{
                                            $('#AIIM>#info').html("网络异常，重试信息,1");
                                            setTimeout(()=>{
                                                $.ajax({
                                                    url:baseURL+"msg?token="+token,
                                                    type:"POST",
                                                    timeout:1000,
                                                    data:da,
                                                    complete: function(xhr, status){
                                                        if(xhr.responseText=="success" || xhr.responseText=="fail"){
                                                        }else{
                                                            $('#AIIM>#info').html("网络异常，重试信息,2");
                                                            setTimeout(()=>{
                                                                $.ajax({
                                                                    url:baseURL+"msg?token="+token,
                                                                    type:"POST",
                                                                    timeout:1000,
                                                                    data:da,
                                                                    complete: function(xhr, status){
                                                                        if(xhr.responseText=="success" || xhr.responseText=="fail"){
                                                                        }else{
                                                                            $('#AIIM>#info').html("网络异常，重试失败");
                                                                            $.ajax({
                                                                                url:baseURL+"log",
                                                                                type:"POST",
                                                                                timeout:1000,
                                                                                data:{
                                                                                    data: accID+" :: "+JSON.stringify(da)
                                                                                },
                                                                                success: function(data){
                                                                                    console.log(data)
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            },1000);
                                                        }
                                                    }
                                                });
                                            },1000);
                                        }
                                    }
                                });
                            // }
                        }
                    }catch(e){
                        console.log("err",e)
                        $('#AIIM>#info').html(e.message);
                        var base = new Base64();
                        $.ajax({
                            url:baseURL+"log",
                            type:"POST",
                            timeout:1000,
                            data:{
                                data: e.message+" :: "+orgdata
                            },
                            success: function(data){
                                console.log(data)
                            }
                        });
                    }
                });
                return ws;
            }
            window.WebSocket = MyWS.bind();
            window.WebSocket.prototype = OriginalWS.prototype;
            window.WebSocket.prototype.constructor = window.WebSocket;
        });
    } catch (error) {
        console.error(error);
    }
})(jQuery,window,document);

const Base64 = function() {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
 
    this.decode = function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }
 
    var _utf8_encode = function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c <2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utfText += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
 
    // private method for UTF-8 decoding  
    var _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        while (i < utftext.length) {    
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c1 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;
            } else {
                c1 = utftext.charCodeAt(i + 1);
                c2 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;
            }
        }
        return string;
    }
}