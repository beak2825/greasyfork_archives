// ==UserScript==
// @name         UserScriptSelfAdaption
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  try to take over the world!该版本会自适应你的用户名等信息
// @author       You
// @match        http://kjgl.fzu.edu.cn/*
// @match        http://www.jessieback.top/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @connect      www.baidu.com
// @downloadURL https://update.greasyfork.org/scripts/477047/UserScriptSelfAdaption.user.js
// @updateURL https://update.greasyfork.org/scripts/477047/UserScriptSelfAdaption.meta.js
// ==/UserScript==
// connect 是允许跨域请求的域名
//grant 后面根据要请求的东西！
//userinfo内容可以在localStorage中查看
var userinfo = {"username":"","id":14454,"name":""}
var isTomorrow=1 //控制今天或者明天 明天是1
var selectSeat = "37364"
var backupSeat = ["37499", "37531", "37593"]//269 262
var captCount = 0
var captImgSrc = ""
var captTextSrc = ""
var captToken = ""
var captFinish = 0
var statusDisp = {}
var ccaptImg = {}
var ccaptText = {}
var count = 0
var bbutton = {}
function base64Enc(str) {
    //encrypt
    var wordArray = CryptoJS.enc.Utf8.parse(str);
    var base64 = CryptoJS.enc.Base64.stringify(wordArray);
    console.log('encrypted:', base64);
    return base64
}
function showMessage(message, type, time) {
    let str = ''
    time = time * 1000
    switch (type) {
        case 'success':
            str = '<div class="success-message" style="width: 300px;height: 40px;text-align: center;background-color:#daf5eb;;color: rgba(103,194,58,0.7);position: fixed;left: 50%;top: 5%;margin-left:-150px;margin-top:-20px;line-height: 40px;border-radius: 5px;z-index: 9999">\n' +
                '    <span class="mes-text">' + message + '</span></div>'
            break;
        case 'error':
            str = '<div class="error-message" style="width: 300px;height: 40px;text-align: center;background-color: #f5f0e5;color: rgba(238,99,99,0.8);position: fixed;left: 50%;top: 10%;line-height: 40px;margin-left:-150px;margin-top:-20px;border-radius: 5px;;z-index: 9999">\n' +
                '    <span class="mes-text">' + message + '</span></div>'
    }
    $('body').append(str)
    setTimeout(function () {
        $('.' + type + '-message').remove()
    }, time)
}
function show(message) {
    showMessage(message, "success", 2)
}
function decrypt(e) {
    var r = "server_date_time",
        i = "client_date_time";
    //e是那个numcode
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : r,
        n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : i,
        o = CryptoJS.enc.Utf8.parse(n),

        s = CryptoJS.enc.Utf8.parse(t),
        c = CryptoJS.AES.decrypt(e, s, {
            iv: o,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return CryptoJS.enc.Utf8.stringify(c).toString()
}
function getHmac(t) {
    var e = function () {
        for (var t = [], e = 0; e < 36; e++) t[e] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
        return t[14] = "4", t[19] = "0123456789abcdef".substr(3 & t[19] | 8, 1), t[8] = t[13] = t[18] = t[23] = "-", t.join("")
    }(),
        n = (new Date).getTime(),
        r = "seat::" + e + "::" + n + "::" + t.toUpperCase(),
        //备注：这里的t是GET或者POST
        o = decrypt(Global.NUMCODE);
    //cDf+jadFUWncEn536MXItw== 控制台直接获取的
    return {
        id: e,
        date: n,
        requestKey: CryptoJS.HmacSHA256(r, o).toString()
    }
}
function getTomorrow() {
    var date = new Date()
    date.setDate(date.getDate() + isTomorrow)
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    console.log(`tomorrow is ${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;

}
function captSend(ppos, ccaptToken, userToken, seat) {
    var sendHeader = getHmac("get")
    console.log("send Header" + sendHeader)
    console.log("sendHeader id " + sendHeader.id + " SendHeader key " + sendHeader.key)
    GM_xmlhttpRequest({
        method: "get",
        url: "http://kjgl.fzu.edu.cn/cap/checkCaptcha?a=" + ppos + "&token=" + ccaptToken + "&userId=" + userinfo.id + "&username=" + userinfo.username,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "user_ip": "1.1.1.1",
            "Authorization": userToken,
            "X-hmac-request-key": sendHeader.requestKey,
            "X-request-date": sendHeader.date,
            "X-request-id": sendHeader.id
        },

        onload: function (response) {
            console.log("CAPT SEND SUCCESS")
            console.log(response.response)
            let resp = JSON.parse(response.response)
            if (resp.status == "OK") {
                statusDisp.textContent = "验证通过"
                captFinish = 1
                if (captCount == 1) {
                    bookSend(ccaptToken, userToken, seat);
                }

            }
            else {
                console.log("CAPT CONFIRM FAIL")
                statusDisp.textContent = "验证失败"
                refreshCapt(ccaptText, ccaptImg, userToken)
            }
        },
        onerror: function (response) {
            console.log("请求失败");
        }
    });
}
//seat 37399
function bookSend(ccaptToken, token, seat) {
    var sendHeader = getHmac("post")
    console.log("send Header" + sendHeader)
    console.log("sendHeader id " + sendHeader.id + " SendHeader key " + sendHeader.requestKey)
    var form = new FormData()
    form.append("startTime", 510)
    form.append("endTime", 1350)
    form.append("seat", seat)
    form.append("date", getTomorrow())
    form.append("token", token)
    form.append("userId", userinfo.id)
    form.append("username", userinfo.username)
    form.append("authid", ccaptToken)
    $.ajax({
        url: "http://kjgl.fzu.edu.cn/rest/v2/freeBook",
        data: form,
        processData: false,
        contentType: false,
        type: "post",
        headers: {
            "user_ip": "1.1.1.1",
            "Authorization": token,
            "X-hmac-request-key": sendHeader.requestKey,
            "X-request-date": sendHeader.date,
            "X-request-id": sendHeader.id
        },
    }).done(function (data) {
        //这里应该是自动识别为json了 可以指定dataType参数
        console.log("BOOK SEND DATA " + JSON.stringify(data))
        if (data.status == "OK") {
            statusDisp.textContent = "选座成功"
        }
        else {
            statusDisp.textContent = "选座失败"
            bbutton.text = data.toString()
            showMessage(data.message, "error", 2)
            refreshCapt(ccaptText, ccaptImg, token)
            if (backupSeat.length != 0) {
                selectSeat = backupSeat[0]
                backupSeat.shift()
                statusDisp.textContent = "已换座"
            }
            //searchSeatAndReSelect(token)
        }
        captFinish = 0
    })
}
function getTimesForSeat(seat, token) {
    let sendHeader = getHmac("GET")
    let tomorrowDate = getTomorrow()
    console.log("sendHeader id " + sendHeader.id + " SendHeader key " + sendHeader.key)
    GM_xmlhttpRequest({
        method: "get",
        url: "http://kjgl.fzu.edu.cn/rest/v2/endTimesForSeat/" + seat + "/" + tomorrowDate + "/510?id=" + seat + "&date=+" + tomorrowDate + "+&start=510&token=" + localStorage.getItem("token"),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "user_ip": "1.1.1.1",
            "Authorization": token,
            "X-hmac-request-key": sendHeader.requestKey,
            "X-request-date": sendHeader.date,
            "X-request-id": sendHeader.id
        },

        onload: function (response) {
            console.log("REQUEST SUCCESS")
            console.log(response)
        },
        onerror: function (response) {
            console.log("请求失败");
        }
    });
}
function refreshCapt(captText, captImg, token) {
    let sendHeader = getHmac("POST")
    console.log("sendHeader id " + sendHeader.id + " SendHeader key " + sendHeader.key)
    GM_xmlhttpRequest({
        method: "post",
        url: "http://kjgl.fzu.edu.cn/cap/captcha/" + localStorage.getItem("token") + "?username=" + userinfo.username,
        data: {
            "username": userinfo.username
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "user_ip": "1.1.1.1",
            "Authorization": token,
            "X-hmac-request-key": sendHeader.requestKey,
            "X-request-date": sendHeader.date,
            "X-request-id": sendHeader.id
        },

        onload: function (response) {
            console.log("Refresh capt SUCCESS")
            captFinish = 0
            var captResp = JSON.parse(response.response)
            console.log(captResp)
            captImg.src = captResp.image
            captText.src = captResp.wordImage
            count = 0
            console.log("图片src已经载入")
            captToken = captResp.token
            captCount = captResp.wordCheckCount
            console.log(captCount)
        },
        onerror: function (response) {
            console.log("请求失败");
        }
    });
}
function searchSeatAndReSelect(token){
    let sendHeader = getHmac("GET")
    console.log("sendHeader id " + sendHeader.id + " SendHeader key " + sendHeader.key)
    GM_xmlhttpRequest({
        method: "get",
        url: "http://kjgl.fzu.edu.cn/rest/v2/searchSeats/"+getTomorrow()+"/510/1350?date="+getTomorrow()+"&begin=510&end=1350&batch=100&page=1&buildingId=1&token="+localStorage.getItem("token"),
       
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "user_ip": "1.1.1.1",
            "Authorization": token,
            "X-hmac-request-key": sendHeader.requestKey,
            "X-request-date": sendHeader.date,
            "X-request-id": sendHeader.id
        },

        onload: function (response) {
            console.log("SearchSeat SUCCESS")
            captFinish = 0
            var seatResp = JSON.parse(response.response)
            console.log(seatResp)
            var remain=seatResp.data.seats
            var temp2=[]
            for (var val in remain) {
                temp2.push(remain[val])
            }
            if(temp2.length==0){
                show("没有位置啦！！！")
            }
            else{
            let randomNum=Math.floor(Math.random()*10)%temp2.length
            selectSeat=temp2[randomNum].id;
            statusDisp.textContent="失败!切换至"+temp2[randomNum].name
            show("已经紧急切换座位！快点选座")
            }
            
        },
        onerror: function (response) {
            console.log("请求失败");
        }
    });
}
(function () {
    'use strict';
    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "点我执行显示窗口";
    button.style.width = "100px";
    button.style.height = "80px";
    button.style.align = "center";
    button.style.float = "left"
    button.style.position = "fixed"
    button.style.top = "20%"
    button.style.left = "20%"

    //绑定按键点击功能
    //var x=document.getElementsByClassName("seat-text")[0]
    var x = document.body
    console.log(x)
    x.append(button)
    bbutton = button
    let div = document.createElement("div");
    div.id = "TEST"
    div.style.float = "left"
    div.style.position = "absolute"
    div.style.top = "50%"
    div.style.left = "37%"
    div.style.display = "flex"
    div.innerHTML = ' <div id="myContainer" class="captcha-modal-container" style="width: 400px; height: 300px; padding: 0px 10px;"><div id="captModal" class="captcha-modal" style="height: 280px;"><div id="captTitle" class="captcha-modal-title" style="height: 50px; padding: 0px 10px;"><div id="captModalClick" class="captcha-modal-click">请依次点击<img id="captText" src="" class="captcha-text" style="width: 100px; height: 40px;"></div><div id="captStatus" style="width=100px;line-height:50px;font-size: 10px;text-align: center;">当前状态：未定状态</div> <img id="captRefresh" src="./static/img/refresh.png" class="refresh"></div> <div id="captModalContent" class="captcha-modal-content" style="height: 160px;"><img id="captImage" src="" style="width: 330px; height: 160px;"></div> <div id="captFooter" class="captcha-modal-footer"><div id="captCancel">取消</div> <div id="captConfirm">确定</div></div> </div></div>'
    //上面的必须保持一行 或者用反引号(ES6)
    document.body.append(div);
    button.onclick = function () {
        console.log('点击了按键');
        alert(localStorage.getItem("userInfo"))
        console.log(localStorage.getItem("userInfo"));
        //为所欲为 功能实现处
        captDIV.style.display = "block";
        return;
    };
    var token = localStorage.getItem("token")
    console.log("token get :" + token)
    userinfo = JSON.parse(localStorage.getItem("userInfo"))
    show(userinfo.id + " " + userinfo.username + " " + userinfo.name)
    console.log(userinfo.toString())
    var sendPos = []
    var sendPosEnc = ''
    var dotPos = { x: 0, y: 0 }
    var captDIV = document.getElementById("myContainer")
    var captText = document.getElementById("captText")
    //captText.src=....
    var captImg = document.getElementById("captImage")
    var captCancel = document.getElementById("captCancel")
    var captConfirm = document.getElementById("captConfirm")
    var captFooter = document.getElementById("captFooter")
    var captTitle = document.getElementById("captTitle")
    var captRefresh = document.getElementById("captRefresh")
    var thisCaptStatusDisp = document.getElementById("captStatus")
    statusDisp = thisCaptStatusDisp
    statusDisp.textContent = "初始化完毕" + getTomorrow()
    ccaptImg = captImg
    ccaptText = captText
    captRefresh.style.height = "50px"
    captRefresh.style.width = "50px"
    captTitle.style.display = "flex"
    captFooter.style = `display:flex;
    justify-content: space-evenly;
    width:330px;
    margin-top:10px;
    `
    captCancel.style = `  width: 50%; height: 30px; text-align: center; font-size: 20px; border: 3px solid black;background:white`;
    captConfirm.style = `
     color: white; width: 50%; height: 30px; text-align: center; font-size: 20px;background:RGB(68,135,240);border:3px solid RGB(68,135,240)`;
    captCancel.onclick = function () {
        captDIV.style.display = "none";
    }
    captConfirm.onclick = function () {
        token = localStorage.getItem("token")
        userinfo = JSON.parse(localStorage.getItem("userInfo"))
        if (captFinish == 0) {
            getTimesForSeat(selectSeat, localStorage.getItem("token"));//查询座位时间
            let sendHeader = getHmac("GET")
            console.log("send Header" + sendHeader)
            console.log("sendHeader id " + sendHeader.id + " SendHeader key " + sendHeader.key)
            GM_xmlhttpRequest({
                method: "post",
                url: "http://kjgl.fzu.edu.cn/cap/captcha/" + localStorage.getItem("token") + "?username=" + userinfo.username,
                data: {
                    "username": userinfo.username
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    "user_ip": "1.1.1.1",
                    "Authorization": token,
                    "X-hmac-request-key": sendHeader.requestKey,
                    "X-request-date": sendHeader.date,
                    "X-request-id": sendHeader.id
                },

                onload: function (response) {
                    console.log("REQUEST SUCCESS")
                    var captResp = JSON.parse(response.response)
                    console.log(captResp)
                    captImg.src = captResp.image
                    captText.src = captResp.wordImage
                    console.log("图片src已经载入")
                    statusDisp.textContent = "查座成功 " + captResp.wordCheckCount
                    captToken = captResp.token
                    captCount = captResp.wordCheckCount
                    console.log(captCount)
                },
                onerror: function (response) {
                    console.log("请求失败");
                }
            });
        }
        else {
            statusDisp.textContent = "正在抢座..."
            captFinish = 0
            bookSend(captToken, token, selectSeat);
        }

        // alert("你点击了确认按钮！");
    }
    captImg.onclick = function (event) {
        statusDisp.textContent = count + "点了" + getHmac("post").date
        count = count + 1
        if (count == 1) {
            dotPos.x = event.offsetX
            dotPos.y = event.offsetY
            sendPos.push(dotPos)
            console.log(sendPos)
            statusDisp.textContent = "点击1次" + dotPos.x + " " + dotPos.y
            dotPos = {}
            if (captCount == 1) {
                count = 0
                sendPosEnc = base64Enc(JSON.stringify(sendPos))
                captSend(sendPosEnc, captToken, localStorage.getItem("token"), selectSeat)
                sendPos = [] //必须初始化成数组不然出事
                sendPosEnc = ""
            }

        }
        else if (count == 2) {
            dotPos.x = event.offsetX
            dotPos.y = event.offsetY
            sendPos.push(dotPos)
            console.log(sendPos)
            count = 0
            sendPosEnc = base64Enc(JSON.stringify(sendPos))
            sendPos = []
            statusDisp.textContent = "2次" + dotPos.x + " " + dotPos.y
            dotPos = {}
            if (captCount == 2) {
                count = 0
                statusDisp.textContent = "准备发射"
                captSend(sendPosEnc, captToken, localStorage.getItem("token"), selectSeat)
                sendPosEnc = ""
            }
        }

    }
    captText.onclick = function () {
        console.log("count=0")
        statusDisp.textContent = getHmac("get").date
        count = 0
    }
    captRefresh.onclick = function (event) {
        token = localStorage.getItem("token")
        console.log("refresh...")
        showMessage("刷新中", "success", 2);
        refreshCapt(captText, captImg, token)
    }
})();
