// ==UserScript==
// @name         WSHookUP_SALE
// @namespace    gx3000
// @version      0.0.2
// @description  for AIIM project
// @author       Pancras
// @run-at       document-start
// @match        http://*.gzqywlkj.com:90/*
// @match        http://web.zhsj.net.cn/*
// @require     http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467582/WSHookUP_SALE.user.js
// @updateURL https://update.greasyfork.org/scripts/467582/WSHookUP_SALE.meta.js
// ==/UserScript==

var ailist = [];
var agentId = 0;
var start = false;
var refresh = true;
(function($,window,document) {
    'use strict';
    var baseURL = "http://81.68.71.99:12003/";
    var token = localStorage.getItem("auth_token");
    try {
        $(document).ready(function(){
            setInterval(()=>{
                if(!start)return;
                if(refresh){
                    $('.user_active').click();
                }
                $.get(baseURL+"reply?token="+token+"&agentId="+agentId,function(d,status){
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
            },6000)
            $('#app').append("<div id='AIIM' style='position:absolute; top:5%; right: 10%; background-color:black;opacity:0.7; padding: 10px; border-radius:10px;'></div>")
            $('#AIIM').append("<div id='message' style='padding:5px 10px; color:white;'>正在启动...</div>")
            $('#AIIM').append("<div id='info' style='padding:5px 10px; color:white;'></div>")
            $('#AIIM').append("<div id='ai' style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:green;opacity:0.7;border-radius:10px;color:white;'>转AI回复</div>")
            $('#AIIM').append("<div id='refresh' style='cursor:pointer; text-align:center; padding:5px 10px; margin: 10px; background-color:red;opacity:0.7;border-radius:10px;color:white;'>停止刷新</div>")
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
            setTimeout(()=>{
                $.get(baseURL+"contacts?token="+token,function(d,status){
                    if(d.code==1){
                        start = true;
                        $('#AIIM>#message').html("登录成功,id"+d.message);
                        agentId = d.message;
                        $('#AIIM').unbind().on('click','#ai',function(){
                            if($('.user_active').find('.unhandler').size()>0){
                                $('.user_active').find('.unhandler').each(function(index,element){
                                    console.log($(element).parent().parent().attr('id'))
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
                                    $.post(baseURL+"setai",{
                                        "botWxid":botWxid,
                                        "wxid":wxid,
                                        "token":token,
                                        "agentId":agentId
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
                                alert("请先点击已转人工的用户")
                            }
                            
                        });
                    }else{
                        agentId = 0;
                        $('#AIIM>#message').html(d.message);
                    }
                });
            },5000);
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
                            if(res.data['msgContent']){
                                $('#AIIM>#info').html(res.data['msgId']+"收到"+res.data['contactId']+"信息");
                                var da = {"agentId":agentId,"botWxid":res.data['botWxid'],"contactId":res.data['contactId'],"senderWxId":res.data['senderWxId'],"msgContent":res.data['msgContent'],"msgId":res.data['msgId'],"msgType":res.data['msgType']}
                                $.ajax({
                                    url:baseURL+"msg?token="+token,
                                    type:"POST",
                                    data:da,
                                    success: function(data){
                                        console.log(data)
                                    }
                                });
                            }
                        }
                    }catch(e){
                        console.log("err",e)
                        $('#AIIM>#info').html(e.message);
                        var base = new Base64();
                        $.ajax({
                            url:baseURL+"log",
                            type:"POST",
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