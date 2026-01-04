// ==UserScript==
// @name         你画我猜【摸鱼派聊天室版】
// @namespace    http://xiyoudongwu.com/
// @version      1.1.3
// @description  使用摸鱼派聊天室的画板来实现你画我猜游戏
// @license      MIT
// @author       W
// @match        https://fishpi.cn/cr
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishpi.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499638/%E4%BD%A0%E7%94%BB%E6%88%91%E7%8C%9C%E3%80%90%E6%91%B8%E9%B1%BC%E6%B4%BE%E8%81%8A%E5%A4%A9%E5%AE%A4%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/499638/%E4%BD%A0%E7%94%BB%E6%88%91%E7%8C%9C%E3%80%90%E6%91%B8%E9%B1%BC%E6%B4%BE%E8%81%8A%E5%A4%A9%E5%AE%A4%E7%89%88%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isJoin = false;
    //心跳id
    let pongId;
    var ws;
    // 悬浮
    var pg;

    const sbtn = ChatRoom.send;

    const sbca = ChatRoom.submitCharacter;
    const client = thisClient;

    var nhwc = document.createElement("button");
    nhwc.id = "nhwc";
    nhwc.textContent = "加入你画我猜";
    nhwc.className = "button";
    nhwc.setAttribute('style', 'margin-right:5px');
    nhwc.onclick = function (){
        if(isJoin){
            ws.close();
            nhwc.textContent = "加入你画我猜";
            isJoin = false;
            ChatRoom.clearCharacter('paintCanvas');
            $("#paintCanvas").removeAttr("style")
            // 去掉我想画按钮
            $("#wxh").remove()
            // 去掉设置题目按钮
            $("#sda").remove()
            // 去掉设置提示按钮
            $("#sts").remove()
            // 去掉提示
            $("#tsmsg").remove()
            // 去掉悬浮球
            pg.remove();
            // 还原提交画布
            ChatRoom.submitCharacter = sbca;
            tm = "";
            $("#paintContent").slideUp(500)
            thisClient = client;
        }else{
            thisClient = "Other/你画我猜";
            /** 加个悬浮窗 */
            pg = document.createElement("div");
            pg.id = "drawMsg";
            pg.setAttribute("style", "left:30px;top:60px;height:80px;width:160px;border-radius: 40px;background-color: #ededed; position: fixed;z-index:1026" )
            pg.innerHTML = "<div id='rs' style='width:100%;height:30px;display:grid;place-items:center'></div><div id='drawer' style='width:100%;height:50px;display:grid;place-items:center'><p style='font-weight: bolder;' id = 'drawerName'></p><p id='drawerStatus'></p></div>"
            document.body.insertBefore(pg, document.body.firstChild);
            pg.onmousedown = t=>{
                let n = t.clientX - pg.offsetLeft, a = t.clientY - pg.offsetTop, i, l;
                document.onmousemove = function(t) {
                    var e = t.clientX - n,
                        c = t.clientY - a;
                    pg.style.left = e+"px";
                    pg.style.top = c+"px";
                }
                document.onmouseup = function(t) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }

            var wssUrl = 'wss://xiyoudongwu.com/draw/ws/message?uid=' + Label.currentUser;

            // 创建一个新的WebSocket Secure连接
            ws = new WebSocket(wssUrl);

            // 连接打开时的处理
            ws.onopen = function(event) {
                console.log('WSS连接已打开');
                nhwc.textContent = "退出你画我猜";
                isJoin = true;
                ChatRoom.send = function (){
                    isJoin?ws.send(ChatRoom.editor.getValue().replaceAll('\n','')):"";
                    sbtn();
                }
                ChatRoom.submitCharacter = function(e) {
                    var t;
                    0 !== linesArray.length ? (e = function(e) {
                        var e = e.split(",")
                        , t = e[0].match(/:(.*?);/)[1]
                        , a = atob(e[1])
                        , n = a.length
                        , o = new Uint8Array(n);
                        for (; n--; )
                            o[n] = a.charCodeAt(n);
                        return new Blob([o],{
                            type: t
                        })
                    }(document.getElementById(e).toDataURL()),
                                               (t = new FormData).append("file[]", e),
                                               $.ajax({
                        url: Label.servePath + "/upload",
                        type: "POST",
                        cache: !1,
                        data: t,
                        processData: !1,
                        contentType: !1,
                        success: function(e) {
                            e = e.data.succMap.blob;
                            ChatRoom.editor.setValue((tm == "" ? "" : ("### 题目："+ tm + "\n\n\n"))  + (tsstr == "" ? "" : ("#### 提示：【"+tsstr+"】\n\n\n")) + "![你画我猜](" + e + ")"),
                                ChatRoom.editor.focus(),
                                ChatRoom.clearCharacter("paintCanvas")
                            ChatRoom.send()
                        },
                        error: function(e) {}
                    }),
                                               linesArray = [],
                                               $(window).scrollTop(0)) : alert("画布为空，无法提交！")
                }
                // 你可以在这里发送初始消息
                // ws.send('Hello Server!');
                pongId = setInterval(function(){
                    ws.send("ping");
                },30000)
            };

            // 接收到消息时的处理
            ws.onmessage = function(event) {
                if(event.data.indexOf("当前在线人数")>=0 ){
                    //$("#chatContentTip").addClass("error").html("<ul><li>" + event.data + "</li></ul>")
                    document.getElementById("rs").innerHTML = event.data.replaceAll("当前在线","你画我猜");
                }else if("quit" == event.data){
                    ChatRoom.clearCharacter('paintCanvas');
                    tsElement.innerHTML = ""
                }else if("clear" == event.data){
                    ChatRoom.clearCharacter('paintCanvas')
                }else if("pong" == event.data){
                    //接收到心跳反馈
                }
                else{
                    let msg = JSON.parse(event.data);
                    if("status" == msg.type){
                        document.getElementById("drawerName").innerHTML = msg.user;
                        document.getElementById("drawerStatus").innerHTML = msg.status;
                        tsElement.innerHTML = "提示："+ msg.tips.toString();
                        if("等待画家..."==msg.status){
                            tjwxh();
                            // 去掉设置题目按钮
                            $("#sda").remove()
                            // 去掉设置提示按钮
                            $("#sts").remove()
                        }else{
                            tsstr = msg.tips.toString();
                            // 去掉我想画按钮
                            $("#wxh").remove()
                            if("确认题目..." == msg.status){
                                tm = "";
                            }
                            if(msg.user == Label.currentUser){
                                document.getElementById("drawerName").innerHTML = tm;
                            }
                        }
                    }else if("points" == msg.type){
                        let points = msg.data;
                        for(let i = 0; i < points.length; i++){
                            let point = JSON.parse(points[i]);
                            if("moveTo" == point.type){
                                ctx.strokeStyle = point.color;
                                ctx.fillStyle = point.color;
                                ctx.shadowColor = point.color;
                                ctx.beginPath();
                                ctx.moveTo(point.x, point.y);
                            }else if("lineTo" == point.type){
                                ctx.lineTo(point.x, point.y);
                                ctx.stroke();
                            }else if("changeWidth" == point.type){
                                ctx.lineWidth = point.lineWidth;
                            }else if("clearTs" == point.type){
                                tsElement.innerHTML = ""
                            }
                        }
                    }else if("password" == msg.type){
                        const oc = ws.onclose;
                        const om = ws.onmessage;
                        const oo = ws.onopen;
                        ws.close();
                        ws = new WebSocket(wssUrl+"&password="+msg.data);
                        ws.onmessage = om;
                        ws.onclose = oc;
                        ws.onopen = oo;
                        tjsda();
                    }else if("error" == msg.type){
                        $("#chatContentTip").addClass("error").html("<ul><li>" + msg.msg + "</li></ul>")
                    }else if("winner" == msg.type){
                        ChatRoom.submitCharacter('paintCanvas')
                        ws.send('clear')
                        sendRed ('specify',32,1,msg.data+'，你画我猜奖金！',[msg.data])
                        sendMsg('# 恭喜【@'+msg.data+' 】回答正确。\n\n\n>  -- [我画你猜1.1.3](https://fishpi.cn/article/1719802311065)')
                    }
                }
            };

            // 连接关闭时的处理
            ws.onclose = function(event) {
                clearInterval(pongId)
                if (event.wasClean) {
                    console.log('WSS连接已正常关闭');
                } else {
                    console.log('WSS连接异常关闭');
                    setTimeout(function() {
                        ws = new WebSocket(wssUrl);
                    }, 3000);
                }
            };

            // 连接发生错误时的处理
            ws.onerror = function(error) {
                console.log('WSS连接发生错误: ', error);
            };

            var tsElement = document.createElement("div");
            tsElement.id = "tsmsg";
            tsElement.setAttribute("style", "width: 80%;margin:auto;font-size: large; color: red; font-weight: bold;");
            tsElement.textContent = ""
            $("#paintContent")[0].children[0].appendChild(tsElement);

            // 把画布提出来
            $("#paintCanvas").css("position","fixed");
            $("#paintCanvas").css("right","10px");
            $("#paintCanvas").css("bottom","10px");
            $("#paintCanvas").css("z-index","1025");

            tjwxh();
        }
    }
    $("#paintContent")[0].children[2].appendChild(nhwc);

    function tjwxh(){
        if($("#wxh").length == 0){
            // 添加申请作画按钮
            var wxh = document.createElement("button");
            wxh.id = "wxh";
            wxh.textContent = "我想画";
            wxh.className = "button";
            wxh.setAttribute('style', 'margin-right:5px');
            wxh.onclick = function (){
                ws.send("getPassword")
            }
            $("#paintContent")[0].children[2].appendChild(wxh);
        }
    }
    var tm = "";

    var tsstr = "";

    // 设置题目按钮
    function tjsda(){
        if($("#sda").length == 0){
            // 添加申请作画按钮
            var sda = document.createElement("button");
            sda.id = "sda";
            sda.textContent = "设置题目";
            sda.className = "button";
            sda.setAttribute('style', 'margin-right:5px');
            sda.onclick = function (){
                let a = ChatRoom.editor.getValue().replaceAll('\n','');
                if(a){
                    ws.send(JSON.stringify({'type':'setAnswer','answer':a}))
                    ChatRoom.editor.setValue("")
                    ChatRoom.clearCharacter('paintCanvas');
                    tm = a;
                    $("#chatContentTip").html('')
                    sda.remove();
                    tjts();
                }else{
                    $("#chatContentTip").addClass("error").html("<ul><li>题目不可为空</li></ul>")
                }
            }
            $("#paintContent")[0].children[2].appendChild(sda);
        }
    }

    // 设置提示按钮
    function tjts(){
        if($("#sts").length == 0){
            // 添加申请作画按钮
            var sts = document.createElement("button");
            sts.id = "sts";
            sts.textContent = "添加提示";
            sts.className = "button";
            sts.setAttribute('style', 'margin-right:5px');
            sts.onclick = function (){

                let a = ChatRoom.editor.getValue().replaceAll('\n','');
                if(a){
                    ws.send(JSON.stringify({'type':'setTs','ts':a}))
                    ChatRoom.editor.setValue("")
                }
            }
            $("#paintContent")[0].children[2].appendChild(sts);
        }
    }


    setTimeout(function(){
        ChatRoom.clearCharacter = function(e) {
            e = document.getElementById(e).getContext("2d");
            e.clearRect(0, 0, e.canvas.width, e.canvas.height),
                linesArray = [];

            isJoin ? ws.send('clear'):""
        }
        ChatRoom.changeWidth = function(e) {
            ctx.lineWidth = e
            isJoin ? ws.send(JSON.stringify({"type":"changeWidth","lineWidth":ctx.lineWidth})):""
        }
        ChatRoom.revokeChatacter = function(e) {
            isJoin ? ws.send('clear'):"";
            0 < linesArray.length && (ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),
                                      linesArray.pop(),
                                      linesArray.forEach(t=>{
                ChatRoom.changeColor(t.color),
                    ChatRoom.changeWidth(t.width),
                    ctx.beginPath(),
                    ctx.moveTo(t.point[0].x, t.point[0].y);
                isJoin ? ws.send(JSON.stringify({"type":"moveTo","color":ctx.fillStyle,"lineWidth":ctx.lineWidth,"x":t.point[0].x, "y":t.point[0].y})):"";
                for (let e = 1; e < t.point.length; e++){
                    ctx.lineTo(t.point[e].x, t.point[e].y);
                    isJoin ? ws.send(JSON.stringify({"type":"lineTo","color":ctx.fillStyle,"lineWidth":ctx.lineWidth,"x":t.point[e].x, "y":t.point[e].y})):"";
                    ctx.stroke()
                }
            }
                                                        ))
        },
            el.onmousedown = function(e) {
            pointsArray = [],
                isClick = isDrawing = !0,
                ctx.beginPath(),
                x = e.clientX - e.target.offsetLeft + $(window).scrollLeft(),
                y = e.clientY - e.target.offsetTop + $(window).scrollTop(),
                pointsArray.push({
                x: x,
                y: y
            }),
                isJoin ? ws.send(JSON.stringify({"type":"moveTo","color":ctx.fillStyle,"lineWidth":ctx.lineWidth,"x":x, "y":y})):"",
                ctx.moveTo(x, y)
        }
            ,
            el.onmousemove = function(e) {
            isDrawing && (isClick = !1,
                          x = e.clientX - e.target.offsetLeft + $(window).scrollLeft(),
                          y = e.clientY - e.target.offsetTop + $(window).scrollTop(),
                          pointsArray.push({
                x: x,
                y: y
            }),
                          ctx.lineTo(x, y),
                          isJoin ? ws.send(JSON.stringify({"type":"lineTo","color":ctx.fillStyle,"lineWidth":ctx.lineWidth,"x":x, "y":y})):"",
                          ctx.stroke())
        }
            ,
            el.onmouseup = function() {
            linesArray.push({
                point: pointsArray,
                color: ctx.fillStyle,
                width: ctx.lineWidth
            }),
                isClick && (ctx.lineTo(x, y),
                            ctx.stroke()),
                isDrawing = !1
        }
            ,
            el.addEventListener("touchstart", function(e) {
            isClick = !0,
                pointsArray = [],
                ctx.beginPath(),
                x = e.changedTouches[0].pageX - e.target.offsetLeft,
                y = e.changedTouches[0].pageY - e.target.offsetTop,
                pointsArray.push({
                x: x,
                y: y
            }),
                ctx.moveTo(x, y)
        }, !1),
            el.addEventListener("touchmove", function(e) {
            isClick = !1,
                e.preventDefault(),
                x = e.changedTouches[0].pageX - e.target.offsetLeft,
                y = e.changedTouches[0].pageY - e.target.offsetTop,
                pointsArray.push({
                x: x,
                y: y
            }),
                ctx.lineTo(x, y),
                ctx.stroke()
        }, !1),
            el.addEventListener("touchend", function(e) {
            isClick && (ctx.lineTo(x, y),
                        ctx.stroke()),
                linesArray.push({
                point: pointsArray,
                color: ctx.fillStyle,
                width: ctx.lineWidth
            })
        }, !1)
    },1000)

    function sendMsg(msg){
        $.ajax({
            url: Label.servePath + '/chat-room/send',
            type: 'POST',
            cache: false,
            data: JSON.stringify({ "content": msg, "client": "Other/你画我猜" }),
            success: function (res) {
                if (0 !== res.code) {
                    $('#chatContentTip').addClass('error').html('<ul><li>' + res.msg + '</li></ul>')
                }
            },
            error: function (res) {
                $('#chatContentTip').addClass('error').html('<ul><li>' + res.statusText + '</li></ul>')
            }
        })
    }
    function transfer(username,amount,memo){
        $.ajax({
            url: Label.servePath + '/point/transfer',
            type: 'POST',
            cache: false,
            data: JSON.stringify({ "userName": username, "amount": amount, "memo":memo }),
            success: function (res) {
                if (0 !== res.code) {
                    $('#chatContentTip').addClass('error').html('<ul><li>' + res.msg + '</li></ul>')
                }
            },
            error: function (res) {
                $('#chatContentTip').addClass('error').html('<ul><li>' + res.statusText + '</li></ul>')
            }
        })
    }
    function sendRed (type,money,count,msg,recivers,gesture) {
        if (type === '' || type === null || type === undefined) {
            type = "random";
        }
        if (recivers === undefined) {
            recivers = []
        }
        if (recivers.length == 0 && type === 'specify') {
            $('#chatContentTip').addClass('error').html('<ul><li>请选择红包发送对象</li></ul>')
        }
        if (msg === '') {
            msg = '摸鱼者，事竟成！';
        }
        let content;
        if (type !== "rockPaperScissors") {
            content = {
                type: type,
                money: money,
                count: count,
                msg: msg,
                recivers: recivers
            }
        } else {
            content = {
                type: type,
                money: money,
                count: count,
                msg: msg,
                recivers: recivers,
                gesture: gesture
            }
        }
        let requestJSONObject = {
            client: "Other/你画我猜",
            content: "[redpacket]" + JSON.stringify(content) + "[/redpacket]",
        }
        $.ajax({
            url: Label.servePath + '/chat-room/send',
            type: 'POST',
            cache: false,
            data: JSON.stringify(requestJSONObject),
            success: function (result) {
                if (0 !== result.code) {
                    $('#chatContentTip').addClass('error').html('<ul><li>' + result.msg + '</li></ul>')
                }
            },
            error: function (result) {
                $('#chatContentTip').addClass('error').html('<ul><li>' + result.statusText + '</li></ul>')
            }
        })
        return;
    }
    // Your code here...
})();