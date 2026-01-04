// ==UserScript==
// @name         看盘软件
// @namespace    看盘软件
// @version      0.1
// @description  try to take over the world!
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/js-sha256/0.9.0/sha256.min.js
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423418/%E7%9C%8B%E7%9B%98%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/423418/%E7%9C%8B%E7%9B%98%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    #bitcoke {position:fixed;right:20px;bottom:20px;padding:20px;background:#4e6ef2;min-width:140px;border-radius:10px;z-index:9999;text-align:left;}
    #bitcoke > div {padding: 5px 10px;color: #fff;}
    `)

    var list = ["BTCUSD", "ETCUSD", "ETHUSD"]



    $(function(){
        var show = 1
        $('body').append("<div id='bitcoke'></div>")
        $('#bitcoke').on('dblclick',function(){
          if(show){
            $('#bitcoke').css("width","auto")
          }else{
            $('#bitcoke').css("width","20px")
          }
        })
        for(let item of list){
            ws(item)
        }
        login()
    })

    function ws(coin) {
        if(!$("#"+coin+"").attr("data")) {
            $("#bitcoke").append("<div id='"+coin+"' data='"+coin+"'>"+coin+":数据查询中</div>")
        }
        var w = new WebSocket("wss://api.bitcoke.com/ws/market");
        w.onopen = function () {
            console.log('连接上了')
            w.send('{"op":"subscribe", "channel":"/api/index/price", "key":"'+coin+'"}')
        }
        w.onmessage = function(res){
            let data = JSON.parse(res.data)
            var kan = {}
            if(data.key) {
                kan[data.key] = data.value
                $("#"+coin+"").html(coin + ":" + Number(data.value.toString().match(/^\d+(?:\.\d{0,2})?/)))
            }
        }
    }


    function login() {
        var unique_txt = "TX20200317-133934-511@123"
        var uid = '33735964'
        var password = '5dd5b6f5ae5325add86876d32ac8a67d4bc5de94'
        var secret = 'JQemEGWOp8yVXPLMQMkR9iJznUsQ53K1dtfSN8l6lrmbuK7Y'
        var key = 'eRuHAkf_M55GkJ8kZEbR1_tw'
        var expire = new Date().getTime() + 10
        var uri = "/api/trade/positionUpdate"
        var sig = sign(uri, expire)

        var w = new WebSocket("wss://api.bitcoke.com/ws/trade");
        w.onopen = function() {
            console.log("登录连接中....")
        }
        w.onmessage = function(res) {
            var data = JSON.parse(res.data)
            if (data.event == 'state') {
                console.log("连接成功")
                w.send(`{"op":"login", "user":"${uid}", "password":"${password}", "txId":"${unique_txt}"}`)
            }
            if (data.event == 'login' && data.txId == unique_txt) {
                console.log("登录成功")
                heartbeat()
                w.send(`{"apiKey": "${key}","signature": "${sig}","expires": "${expire}","op": "subscribe","channel": "${uri}"}`)
            }
            if(data.event == '/api/trade/positionUpdate') {
                if (data.position) {
                    var txt = ''
                    if(data.position.side = 'Short') {
                        txt = '做空'
                    } else {
                        txt = '做多'
                    }
                    txt+=  data.position.symbol + "盈利:"
                    var yl = Number(data.position.urPnL.toString().match(/^\d+(?:\.\d{0,2})?/));
                    if(!$("#"+data.position.currency+"-currency").attr("data")) {
                        $("#bitcoke").append("<div id='"+data.position.currency+"-currency' data='"+data.position.currency+"-currency'>"+txt+" " + yl + " " +data.position.currency+"</div>")
                    }else {
                        $("#"+data.position.currency+"-currency").html(txt+" " + yl +" "+ data.position.currency)
                    }
                }

            }
        }
        function heartbeat() {
            setInterval(() => {
                w.send(`{"op":"heartbeat", "user":"${uid}","txId":"${unique_txt}"}`)
            }, 1000);
        }

        function sign(url, exprie) {
            return sha256(secret+"GET"+url+exprie)
        }
    }
})();