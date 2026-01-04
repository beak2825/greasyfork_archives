// ==UserScript==
// @name         批量发猫粮
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  pter 批量发邀请
// @author       ccf2012
// @icon         https://www.google.com/s2/favicons?domain=pterclub.com
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        GM.xmlHttpRequest
// @match        https://*.pterclub.com/mybonus.php

// @downloadURL https://update.greasyfork.org/scripts/445225/%E6%89%B9%E9%87%8F%E5%8F%91%E7%8C%AB%E7%B2%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/445225/%E6%89%B9%E9%87%8F%E5%8F%91%E7%8C%AB%E7%B2%AE.meta.js
// ==/UserScript==
let detected;
let sendedPointsAmount;
let sentBonusCount;
let bonusList = [];
let sendPointsResult = {};

function addBatchBonusBlock() {
    var bonusInput = $("#giftcustom");
    var bonusRow = bonusInput.parent().parent().parent();
    // var bonusRow = $('tr:contains("Bonus")')
    // var bonusRow = document.querySelector("#outer > table > tbody > tr:nth-child(1) > td > table:nth-child(2) > tbody > tr:nth-child(1) > td > form > table > tbody > tr:nth-child(2)")
    console.log(bonusRow);
    // var bonusInput = bonusRow.find('input')

    var batchBonusBlock = `
    <tr><td>** </td><td>
      <div>
      <b>批量发猫粮</b><p>
      一行一份输入：用户名, 猫粮数量, 赠言。以逗号(,)，空格或冒号(:)分隔， 如 abc, 30000, Thanks
      </div>
 
      <div style="display: flex;">
        <textarea id="account-input"  name="account-input" rows="12" cols="50"></textarea>
        <div style="display: flex; flex-direction: column; margin-left: 10px; flex: 1 1 0%;">
          <div>
            <div style="font-size: 1.2em; color: #d32f2f;">
              检测到 <span id="account-num">0</span> 个帐号:</div>
            <div id="account-list"></div>
          </div>
    </div>
        </td><td>

    <div style="display: flex;">
        <div style="margin-top: 20px;">
          <div style="font-size: 1.2em; color: #d32f2f;">发魔结果:</div>
          <div id="send-points-result"></div>
        </div>
        </div>
        <br>
        </td><td>
        <div style="margin-left: 20px">
        <button type="button" id="btn-bonusdetect" style="margin-left: 5px;padding: 5px 10px;">
        检测
      </button>
      <br>
      <br>
        
        <button type="button" id="btn-batchbonus" style="margin-left: 5px;padding: 5px 10px;">
          批量发猫粮
        </button>
      </div>
  
      </td></tr>
      `;
    bonusRow.after(batchBonusBlock);
}


var showSendPointsResult = () => {
    var resultHtml = '<ul style="padding-left: 0;">';
    for (let account in sendPointsResult) {
        let accountResult = sendPointsResult[account];
        let info = accountResult["info"];
        let successText = `发送 ${accountResult["sendedPoints"]}`;
        let accountResultEle = `<li>
            ${account}: ${info === "OK" ? successText : info}
            </li>`;
        resultHtml += accountResultEle;
    }
    resultHtml += "</ul>";
    $("#send-points-result").html(resultHtml);
};


var sendBonus = (account, points, msg) => {
    var url = `https://${window.location.host}/mybonus.php?action=exchange`
    // hdsky: option 10
    // keepfrds: option 7
    var option = 13
    if (/pterclub/.test(window.location.href)) {
        option = 13
    } else {
        option = 10
    }
    var data = `username=${account}&bonusgift=${points}&message=${msg}&option=${option}&submit=赠送`
    // var data = `username=GG123456&bonusgift=1000&message=test1000&option=7&submit=赠送`
    // console.log('url: ', url)
    // console.log('data: ', data)

    GM.xmlHttpRequest({
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
        onload: response => {
            console.log(`send to ${account}: ${points}, msg: ${msg}:`, response)
            // console.log('response: ', response.response)
            // console.log(`sendPointsResult ${account}: `, sendPointsResult[account])
            
            if (response.responseText.indexOf('不存在') !== -1) {
                sendPointsResult[account]['info'] = '帐号不存在！'
                sendedPointsAmount += 1
            } else if (response.responseText.indexOf('猫粮必须比接受方的多') !== -1) {
                sendPointsResult[account]['info'] = '猫粮多'
                sendedPointsAmount += 1
            } 
            else if (response.responseText.indexOf('错误') == -1) {
                sendPointsResult[account]['sendedPoints'] += points
                if (
                    sendPointsResult[account]['sendedPoints'] ===
                    sendPointsResult[account]['targetPoints']
                ) {
                    sendPointsResult[account]['info'] = 'OK'
                    sendedPointsAmount += 1
                }
            }
            else {
                let responseHTML = document.createElement('html');
                responseHTML.innerHTML = response.response;
                let ERROR = responseHTML.querySelector('#outer > table > tbody > tr > td > table > tbody > tr > td').textContent;
                // var error = document.querySelector(config[window.location.origin].message).closest('td'), 'span', {});
                sendPointsResult[account]['info'] = ERROR ;
                sendedPointsAmount += 1
            }
            // console.log(`sendPointsResult ${account}: `, sendPointsResult[account])
            if (sendedPointsAmount === bonusList.length) {
                showSendPointsResult()
            }
        },
    })
}

var onClickBonusAccountCheck = () => {
    var accountInput = $("#account-input").val();

    $("#bonus-result").text("");
    bonusList = [];
    sendedPointsAmount = 0


    $("#send-points-result").text("");
    sendPointsResult = {};
    sentBonusCount = 0;
    bonusList = []

    var bonusInputList = [];
    accountInput
        .split("\n")
        .map((s) => s.trim())
        .forEach((s) => {
            let re = /(\w+)\s*[,:\s]+\s*(\d+)([,:\s]+(\w*))?/;
            let m = s.match(re);
            if (m) {
                let bonusMsg = '';
                if (m[4]){
                    console.log("MSG=" + m[4])
                    bonusMsg = m[4];
                }
                bonusInputList.push({ user: m[1], amount: parseInt(m[2]), msg: bonusMsg });
            } else {
                console.log("not match" + s);
            }
        });

    bonusList = bonusInputList.reduce((acc, curr) => {
        let item = acc.find((item) => item.user === curr.user);

        if (item) {
            item.amount += curr.amount;
        } else {
            acc.push(curr);
        }

        return acc;
    }, []);

    $("#account-num").text(bonusList.length);
    $("#account-list")
        .text("")
        .append(bonusList.map((s) => `<li>${s.user}: ${s.amount}</li>`).join(""));

    detected = true;
};

var onClickBatchBonus = () => {
    if (!detected) {
        alert("请先点击检测按钮，确认帐号和数量！");
        return;
    }
    detected = false;

    if (!bonusList.length) {
        alert("未检测到任何发猫粮条目！");
        return;
    }
    var commonMsg = $('#outer input[name=message]').val()
    // var message = document.querySelector('#outer input[name=message]');
    sendedPointsAmount = 0

    bonusList.forEach((item) => {
        sendPointsResult[item.user] = {};
        sendPointsResult[item.user]["targetPoints"] = item.amount;
        sendPointsResult[item.user]["sendedPoints"] = 0;
        sendPointsResult[item.user]["info"] = "";

        let msg = commonMsg;
        if (item.msg){
            msg = item.msg
        }
        console.log(item)
        let amountLeft = item.amount
        const step = 10000
        while (amountLeft > step && sendPointsResult[item.user]['info'] == '') {
            sendBonus(item.user, step, msg)
            amountLeft -= step
        }
        if (amountLeft && sendPointsResult[item.user]['info'] == '') {
            sendBonus(item.user, amountLeft, msg)
        }

        // sendBonus(account.user, account.amount, msg);
    });
};

// ============= main ==================

(function () {
    "use strict";

    if (/mybonus\.php/.test(window.location.href)) {
        addBatchBonusBlock();
        var btnBonusDetect = $("#btn-bonusdetect");
        var btnBatchBonus = $("#btn-batchbonus");
        btnBonusDetect.click(() => onClickBonusAccountCheck());
        btnBatchBonus.click(() => onClickBatchBonus());
    }
})();
