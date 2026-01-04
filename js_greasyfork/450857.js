// ==UserScript==
// @name         沙琪玛定制ATERNOS
// @namespace    http://tampermonkey.net/
// @version      1.36
// @description  ""
// @author       沙琪玛
// @match        https://aternos.org/sqm/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aternos.org
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/450857/%E6%B2%99%E7%90%AA%E7%8E%9B%E5%AE%9A%E5%88%B6ATERNOS.user.js
// @updateURL https://update.greasyfork.org/scripts/450857/%E6%B2%99%E7%90%AA%E7%8E%9B%E5%AE%9A%E5%88%B6ATERNOS.meta.js
// ==/UserScript==

(function() {
    //前置
    document.querySelector("title").textContent = 'ATERNOS - SQM定制控制台'
    document.querySelector("div.title-label").textContent = "SQM定制控制台"
    document.querySelector("body > div > div > div.body").style.height = (document.body.clientHeight - document.querySelector("div.title").clientHeight) + "px"
    document.querySelector("body > div > div > div.body").style.display = "flex"
    document.querySelector("body > div > div > div.body").style.flexDirection = "column"
    document.querySelector("body > div > div > div.body").style.justifyContent = "space-between"
    document.querySelector("body > div").style.alignItems = 'stretch'
    document.querySelector(".console").style.background = "#272727"
    document.querySelector("body").style.backgroundColor = "#272727"

    //window["AJAX_TOKEN"]=window['document']&&window["Map"][("p" + "r" + "ot" + "ot" + "ype")]&&window[["ut","meo","tTi","se"].reverse().join('')]?["owbYTXC","NIr","771K1kzP5","U"].map(s => s.split('').reverse().join('')).join(''):["ApzVaB","nbjT","bmlybY","u6MG"].join('');
    //密码加密JS
    $.ajax({
        type: "get",
        url: "/panel/js/md5/md5.min.js"
    });
    //发包
    function randomString(length) {
        return Array(length + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, length);
    }
    function generateAjaxToken(url) {
        var key = randomString(16);
        var value = randomString(16);

        document.cookie = "ATERNOS_SEC_" + key + "=" + value + ";path=" + url;

        return key + ":" + value;
    }
    function buildURL(url, data) {
        data.SEC = generateAjaxToken(url);
        data.TOKEN = AJAX_TOKEN;
        return url + "?" + $.param(data);
    }
    function aget(url, data, callback) {
        if (callback === undefined) {
            callback = data;
            data = {};
        }

        $.ajax({
            type: "get",
            url: buildURL(url, {}),
            success: callback,
            error: function(errorback) {ajaxError("get", url, errorback)}
        });
    }
    function apost(url, data, callback) {
        $.ajax({
            type: "post",
            data: data,
            url: buildURL(url, {}),
            success: callback,
            error: function(errorback) {ajaxError("post", url, errorback)}
        });
    }
    function ajaxError(type, url, errorback) {
        if (url == "/panel/ajax/status.php") {
            document.querySelector("div.title-label").textContent = "SQM定制控制台 — 未绑定"
        }
        if (SQMDEBUG) {
            if (url != "/panel/ajax/status.php") {
                out("AJAX错误 - 类型：" + type + ", URL：" + url)
            }
        }
    }

    var SQMDEBUG = false

    //自动开服状态
    var autoStartBool = GM_getValue("autoStartBoolGM")
    //自动开服循环
    var autoStartInterval = null

    function autoStartUpdate() {
        document.querySelector("body > div > div > div.body").style.height = (document.body.clientHeight - document.querySelector("div.title").clientHeight) + "px"
        if (autoStartBool) {
            //获取伺服器信息
            aget('/panel/ajax/status.php', function (data) {
                var serverStatus = JSON.parse(data)

                //如果为离线状态就自动启动（headstart态）
                if (serverStatus.class == 'offline') {
                    apost('/panel/ajax/start.php', {'headstart': 1, 'access-credits': 1})
                }

                //无人只剩十秒倒计时时自动重启伺服器（重启比关闭后开启的开机速度快）
                if (serverStatus.class == 'online' && serverStatus.countdown != null && serverStatus.countdown < 10) {
                    apost('/panel/ajax/restart.php')
                }

                if (SQMDEBUG) {
                    out("      状态：" + serverStatus.class + " 倒计时：" + serverStatus.countdown)
                    out("      离线：" + (serverStatus.class == 'offline') + " 十秒倒计时：" + (serverStatus.class == 'online' && serverStatus.countdown != null && serverStatus.countdown <= 10))
                    if (serverStatus.players > 0) out("      玩家人数：" + serverStatus.players + " 玩家列表" + serverStatus.playerlist)
                    out("")
                }
            })
        }
        aget('/panel/ajax/status.php', function (data) {var serverStatus = JSON.parse(data); document.querySelector("div.title-label").textContent = "SQM定制控制台 — " + serverStatus.label + ((serverStatus.class == 'online')? "（" + ((serverStatus.players > 0)? serverStatus.players + " / " + serverStatus.slots: serverStatus.countdown + "秒") + "）": "")})

    }

    //自初始化动开服按钮
    document.querySelector("div.title-buttons > a").remove()
    let autoStartBtn = document.createElement('a');
    autoStartBtn.id = "autoStart"
    autoStartBtn.className = 'close';
    autoStartBtn.style.backgroundColor = (autoStartBool)? "#1FD78D": ""
    document.querySelector("div.title-buttons").appendChild(autoStartBtn)
    $("#autoStart").append('<i class="fas fa-sync-alt" id="autoStartBtnIcon"></i>')
    document.querySelector("#autoStartBtnIcon").style.color = (autoStartBool)? "#FFFFFF": ""

    //自动开服按钮点击事件
    autoStartBtn.onclick = function() {
        //自动开服状态切换
        GM_setValue("autoStartBoolGM", !GM_getValue("autoStartBoolGM"))
        autoStartBool = GM_getValue("autoStartBoolGM")

        //自动开服按钮Style切换
        autoStartBtn.style.backgroundColor = (autoStartBool)? "#1FD78D": ""
        document.querySelector("#autoStartBtnIcon").style.color = (autoStartBool)? "#FFFFFF": ""

        if (SQMDEBUG) out("自动启动：" + autoStartBool + "\n ")
    }

    //劫持输入栏
    var sqmInput = document.querySelector("#in")
    sqmInput.id = "sqmInput"
    /*
    append = function(raw, delay) {
        if(delay === undefined) {
            delay = 0;
        }
        setTimeout(function(){
            $('#out').append(raw + "<br />");
        }, delay);
    }
*/

    //输入栏回车事件
    sqmInput.onkeyup = function(key){
        if(key.keyCode == 13) {
            var commando = sqmInput.value
            append('> <span class="yeah">'+htmlentities(commando)+'</span>');
            switch (commando.split(" ")[0]) {
                case "start":
                    aget('/panel/ajax/start.php', {'headstart': 1, 'access-credits': 1}, function(data) {out("正在启动")})
                break
                case "stop":
                    aget('/panel/ajax/stop.php', function(data) {out("正在停止")})
                break
                case "restart":
                    aget('/panel/ajax/stop.php', function(data) {out("正在重启")})
                break
                case "status":
                    aget('/panel/ajax/status.php', function(data) {out(JSON.stringify(JSON.parse(data)))})
                break
                case "player":
                    aget('/panel/ajax/status.php', function (data) {
                        var serverStatus = JSON.parse(data)
                        if (serverStatus.players > 0) {out("玩家人数：" + serverStatus.players + " 玩家列表：" + serverStatus.playerlist)} else {out("无玩家在线")}})
                break
                case "acc":
                    var accData = commando.split(" ")
                    if (accData[1] == "set") {
                        if (SQMDEBUG) out("账号为：" + accData[2] + " 密码为：" + accData[3])
                        apost('/panel/ajax/account/login.php', {user: accData[2], password: md5(String(accData[3]))}, function(data){
                            data = JSON.parse(data)
                            if (data.success) {
                                out("登入成功")
                            } else {
                                out("错误：" + data.error)
                            }
                        })
                    } else if (accData[1] == "unset") {
                        apost("/panel/ajax/account/logout.php")
                    }
                break
                case "server":
                    var svData = commando.split(" ")
                    if (svData[1] == "set") {
                        apost('/panel/ajax/friends/access.php', {id: svData[2]}, function (data) {
                            data = JSON.parse(data);
                            if (data.success) {
                                out("设置成功：" + svData[2])
                            } else {
                                out("无效的ID")
                            }
                        })
                    } else if (svData[1] == "unset") {
                        apost('/servers/')
                    }
                break
                case "debug":
                    var dbData = commando.split(" ")
                    var dbCheak = md5(dbData[2])
                    if (dbCheak == 'c51fc0f4cd342e1419e05e53e72d0018') {
                        SQMDEBUG = (dbData[1] == "true" || dbData[1] == "1")
                        out("DEBUG：" + SQMDEBUG)
                    } else {
                        out("凭证错误")
                    }

                break
            }
            sqmInput.value = ""
        }
    }

    window.setInterval(autoStartUpdate, 1000)
})();