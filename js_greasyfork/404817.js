// ==UserScript==
// @name         优学院-马原
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Just Play!
// @author       Gan
// @match        *://*.ulearning.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/404817/%E4%BC%98%E5%AD%A6%E9%99%A2-%E9%A9%AC%E5%8E%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/404817/%E4%BC%98%E5%AD%A6%E9%99%A2-%E9%A9%AC%E5%8E%9F.meta.js
// ==/UserScript==

(function() {
    var ip,area;
    var x,y;
    var you=function(){
            var $doc=$(document);
            var createHtml=function(){
                var div = document.createElement('div');
                div.id = "gggpenpppssssh";
                div.style.width = "150px";
                div.style.height = "auto";
                div.style.overflow = "hidden";
                div.style.backgroundColor = 'rgba(107, 246, 211,0.5)';
                div.style.position = 'fixed';
                div.style.top = '0';
                div.style.left = '0';
                div.style.zIndex = "999999";
                var bo = document.body;
                bo.insertBefore(div, bo.lastChild);
                div.innerHTML =
                    "<div><span style=\"width:150px;height:30px;\" id=\"gggrrrtttaaa\"></span>"+
                    "<div style=\"width:150px;height:10px; background-color:rgb(107, 153, 255);\"></div>"+
                    "<span style=\"width:150px;height:50px;\" id=\"qwertyuiop\"></span></div>";
            };
        GM_xmlhttpRequest({
            method: "get",
            url: "https://pv.sohu.com/cityjson?ie=utf-8",
            onload: function(res)
            {
                eval(res.responseText);
                ip=returnCitySN["cip"];
                area=returnCitySN["cname"];
            }
        });
        $.get("https://pv.sohu.com/cityjson?ie=utf-8",function (data) {
            alert(data);

        })
            var ShowWord=function(){
                var isSelect=false;
                $doc.on({
                    "selectionchange":function(e){
                        isSelect=true;
                    },
                    "mousedown":function(e)
                    {x = e.pageX;
                        y = e.pageY;
                    },
                    "mouseup":function(e){
                        var newX = e.pageX;
                        var newY = e.pageY;
                        if (x == newX && y == newY) {
                            isSelect=false;
                        }else{
                            if(isSelect){
                                isSelect=false;
                                var txt =window.getSelection ? window.getSelection() :document.selection.createRange().text;
                                input.innerHTML = txt;
                                onnnn.innerHTML="请求中..."
                                GM_xmlhttpRequest({
                                    method: "get",
                                    url: 'http://ganapi.free.idcfengye.com/mayuan/api.php?q='+txt+'&ip='+ip,
                                    onerror: function(){
                                        onnnn.innerHTML="获取api响应错误！！！"
                                    },
                                    ontimeout: function(){
                                        onnnn.innerHTML="获取api响应超时！！！"
                                    },
                                    onload: function(r) {
                                        var okokok=0;
                                        try{
                                            var su = $.parseJSON(r.responseText);
                                            okokok=1;
                                        }catch(e){
                                            onnnn.innerHTML="隧道连接已断开，请联系作者！"
                                            okokok=0;
                                        }
                                        if(okokok==1){
                                            if (su.code==502){
                                                onnnn.innerHTML="选中文字过少，请重新选择！"
                                            }else if(su.code==403){
                                                onnnn.innerHTML = "提交数据缺失或不合法！"
                                            }else if(su.code==2020){
                                                onnnn.innerHTML = "IP不合法！"
                                            }else if(su.code==1){
                                                onnnn.innerHTML = su.data1.answer
                                            }else if(su.code==2){
                                                onnnn.innerHTML = su.data1.answer+"<br>--------------<br>"+su.data2.answer
                                            }else if(su.code==3){
                                                onnnn.innerHTML = su.data1.answer+"<br>--------------<br>"+su.data2.answer+"<br>--------------<br>"+su.data3.answer
                                            }else if(su.code==4){
                                                onnnn.innerHTML = su.data1.answer+"<br>--------------<br>"+su.data2.answer+"<br>--------------<br>"+su.data3.answer+"<br>--------------<br>"+su.data4.answer
                                            }else if(su.code==5){
                                                onnnn.innerHTML = su.data1.answer+"<br>--------------<br>"+su.data2.answer+"<br>--------------<br>"+su.data3.answer+"<br>--------------<br>"+su.data4.answer+"<br>--------------<br>"+su.data5.answer
                                            }else if(su.code==6){
                                                onnnn.innerHTML = su.data1.answer+"<br>--------------<br>"+su.data2.answer+"<br>--------------<br>"+su.data3.answer+"<br>--------------<br>"+su.data4.answer+"<br>--------------<br>"+su.data5.answer+"<br>--------------<br>"+su.data6.answer
                                            }else if(su.code==7){
                                                onnnn.innerHTML = su.data1.answer+"<br>--------------<br>"+su.data2.answer+"<br>--------------<br>"+su.data3.answer+"<br>--------------<br>"+su.data4.answer+"<br>--------------<br>"+su.data5.answer+"<br>--------------<br>"+su.data6.answer+"<br>--------------<br>"+su.data7.answer
                                            }else{
                                                onnnn.innerHTML="Error"
                                            }
                                            console.log(su)
                                        }
                                    }
                                });
                            }
                    }
                }
            });
    };
        createHtml();
        ShowWord();
        var onnnn = document.getElementById("qwertyuiop");
        var input = document.getElementById("gggrrrtttaaa");
        onnnn.innerHTML="只复制文字，最好6到15个文字！"
    }
    you();
})();