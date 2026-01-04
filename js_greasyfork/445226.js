// ==UserScript==
// @name         管理批量发邀请/魔力
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @description  pter 管理批量发邀请/魔力
// @author       yigezhanghao, ccf2012
// @icon         https://www.google.com/s2/favicons?domain=pterclub.com
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        GM.xmlHttpRequest
// @match        https://*.pterclub.com/invite.php?id=*
// @match        file:///*amountbonus.php*
// @match        https://*.pterclub.com/amountbonus.php
 
// @downloadURL https://update.greasyfork.org/scripts/445226/%E7%AE%A1%E7%90%86%E6%89%B9%E9%87%8F%E5%8F%91%E9%82%80%E8%AF%B7%E9%AD%94%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/445226/%E7%AE%A1%E7%90%86%E6%89%B9%E9%87%8F%E5%8F%91%E9%82%80%E8%AF%B7%E9%AD%94%E5%8A%9B.meta.js
// ==/UserScript==
var oriInviteMsgInput;
var oriInviteMsgRow;
var detectBtn;
var inviteBtn;
var mailList = [];
var detected;
var inviteResult;
var singleInviteBtn;
var sendedMailAmount;
var sendPointsResult;
var sentBonusCount;
var bonusList = [];
 
function addInviteBox() {
  var usernameInputRow = $('tr:contains("用户名"):last');
  // var originput = document.getElementsByName("target_username")[0]
  var mailInputRow = $('tr:contains("邮箱地址"):last');
  var oriInviteBtn = $('input[value="邀请"]');
  var oriMailInput = mailInputRow.find("input");
  oriMailInput.after(oriInviteBtn);
  oriInviteBtn.after("<br>");
  document.getElementById("if_confimed").checked = true;
 
  var batchInvite = `
    <tr><td>批量发邀<br>邮箱地址/账号</td><td>
    <div>
      一行一个，输入以逗号(,)，空格或冒号(:)分隔的 用户名和邮箱, 如 abc, abc@usa.net
    </div>
    
    <div style="display: flex;">
      <textarea id="mail-input"  name="mail-input" rows="12" cols="50"></textarea>
  
      <div style="display: flex; flex-direction: column; margin-left: 50px; flex: 1 1 0%;">
        <div>
          <div style="font-size: 1.2em; color: #d32f2f;">
            检测到 <span id="mail-num">0</span> 个邮箱:</div>
          <div id="mail-list"></div>
        </div>
  
        <div style="margin-top: 20px;">
          <div style="font-size: 1.2em; color: #d32f2f;">邀请结果:</div>
          <div id="invite-result"></div>
        </div>
      </div>
 
    </div>
    <br>
 
    <div style="margin-left: 150px">
    <button type="button" id="btn-detect" style="padding: 5px 10px;">
    检测
  </button>
  
  <button type="button" id="btn-invite" style="margin-left: 10px;padding: 5px 10px;">
    批量发邀请
  </button>
  </div>
    </td></tr>
    `;
 
  // oriMailInput.after(replacedArea)
  mailInputRow.after(batchInvite);
 
  // second row, invite msg
  oriInviteMsgInput = $("textarea:last");
  oriInviteMsgInput.attr("id", "invite-msg");
  oriInviteMsgRow = oriInviteMsgInput.closest("tr");
  oriInviteMsgRow.find("td:first").text("邀请留言");
  // oriInviteMsgInput = $('#invite-msg')


  detectBtn = $("#btn-detect");
  inviteBtn = $("#btn-invite");
 
  mailList = [];
  detected = false;
  inviteResult = {};
  sendedMailAmount = 0;
}
 
// new invite
function showInviteResult() {
  console.log("inviteResult:", inviteResult);
  var resultHtml = "";
  for (var mail in inviteResult) {
    var mailResult = `<li>${mail}: ${inviteResult[mail]}</li>`;
    resultHtml += mailResult;
  }
  $("#invite-result").append(resultHtml);
}
 
function sendInvite(url, tusername, mail, msg, comment) {
  var data = `target_username=${tusername}&email=${mail}&comment=${comment}&body=${encodeURIComponent(
    msg
  )}`;
  // console.log('url: ', url)
  // console.log('data: ', data)
 
  GM.xmlHttpRequest({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
    onload: (response) => {
      console.log("response:", response);
      sendedMailAmount += 1;
      if (response.status !== 200) {
        inviteResult[mail] = "发送失败！";
      } else if ( response.responseText ) {
        if (response.responseText.indexOf("已经在使用") !== -1){
          inviteResult[mail] = "失败！此邮箱已经在使用！";
        }
        else if (response.responseText.indexOf("上限") !== -1) {
          inviteResult[mail] = "失败！系统达到上限！";
        }
        else if (response.responseText.indexOf("邀请失败") !== -1) {
          var responseHTML = document.createElement('html');
          responseHTML.innerHTML = response.response;
          var errorMsg = responseHTML.querySelector("#outer > table.main > tbody > tr > td > table > tbody > tr > td").textContent;
          inviteResult[mail] = "失败！" + errorMsg;
        }
        else if (response.responseText.indexOf("对不起") !== -1 || response.responseText.indexOf("错误") !== -1) {
          inviteResult[mail] = "失败！发生错误了！";
        }
        else {
          inviteResult[mail] = "OK";
        }
      }
      else {
        inviteResult[mail] = "OK";
      }
 
      if (sendedMailAmount === mailList.length) {
        showInviteResult();
      }
    },
  });
}
 
// invite button
var onClickInvite = () => {
  if (!detected) {
    alert("请先点击检测按钮，确认邮箱！");
    // onClickDetect()
    return;
  }
  detected = false;
 
  if (!mailList.length) {
    alert("未检测到任何邮箱！");
    return;
  }
 
  var searchParams = new URLSearchParams(window.location.search);
  var id = searchParams.get("id");
  var inviteUrl = `https://${window.location.host}/takeinvite.php?id=${id}`;
 
  var msg = oriInviteMsgInput.val();
  var comment = $('textarea[name="comment"]').val();
 
  mailList.forEach((userpair) => {
    sendInvite(inviteUrl, userpair[0], userpair[1], msg, comment);
  });
};
 
var showSendPointsResult = () => {
  console.log("showSendPointsResult:", sendPointsResult);
  var resultHtml = "";
  for (var account in sendPointsResult) {
    var accountResult = sendPointsResult[account];
    var info = accountResult["info"];
    var successText = `成功发送 ${accountResult["sendedPoints"]}`;
    var accountResultEle = `<li>
          ${account}: ${info === "OK" ? successText : info}
          </li>`;
    resultHtml += accountResultEle;
  }
  $("#send-points-result").html(resultHtml);
};
 
// detect button
var onClickDetect = () => {
  var input = $("#mail-input").val();
 
  $("#invite-result").text("");
  inviteResult = {};
  sendedMailAmount = 0;
  mailList = [];
 
  input
    .split("\n")
    .map((s) => s.trim())
    .forEach((s) => {
      var re = /([\w\.]+?\w)\s*[,:\s]+\s*([\w\.]+@(\w+\.)?\w+\.\w+)[,:\s]*(\w+)?/;
      var m = s.match(re);
      if (m) {
        mailList.push([m[1], m[2], m[4]]);
      } else {
        console.log(s);
        // s !== '' && accountList.push(s)
      }
    });
 
  // remove duplicate
  mailList = Array.from(new Set(mailList));
 
  $("#mail-num").text(mailList.length);
  $("#mail-list")
    .text("")
    .append(mailList.map((s) => `<li>${s}</li>`).join(""));
 
  detected = true;
};
 
// ============= sendbous ==================
 
var sendBonus = (account, points, msg) => {
  var url = `https://${window.location.host}/amountbonus.php`;
 
  var data = `username=${account}&seedbonus=${points}&ext_msg=${msg}&submit=Okay`;
  // console.log("data: ", data);
 
  GM.xmlHttpRequest({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
    onload: (response) => {
      console.log(`send to ${account}: ${points}, msg: ${msg}:`, response);
      // console.log('response: ', response.response)
      // console.log(`sendPointsResult ${account}: `, sendPointsResult[account])
      sentBonusCount += 1;
      if (response.responseText.indexOf("不存在") !== -1) {
        sendPointsResult[account]["info"] = "用户不存在！";
      } else if (response.responseText.indexOf("考核中") !== -1) {
        sendPointsResult[account]["info"] = "考核中！";
      } else if (response.responseText.indexOf("Error") != -1) {
        // sendPointsResult[account]['sendedPoints'] += points
        sendPointsResult[account]["info"] = "出现错误！";
      } else {
        sendPointsResult[account]["info"] = "OK";
      }
 
      if (sentBonusCount === bonusList.length) {
        showSendPointsResult();
      }
    },
  });
};
 
function addBatchBonusBlock() {
  var origOkayBtn = $('input[value="Okay"]');
  var bonusInput = $("#giftcustom");
  bonusInput.after(origOkayBtn);
  var bonusRow = bonusInput.parent().parent();
  // var bonusRow = $('tr:contains("Bonus")')
  // var bonusRow = document.querySelector("#outer > table > tbody > tr:nth-child(1) > td > table:nth-child(2) > tbody > tr:nth-child(1) > td > form > table > tbody > tr:nth-child(2)")
  console.log(bonusRow);
  // var bonusInput = bonusRow.find('input')
 
  var batchBonusUserList = `
    <tr><td>批量发猫粮</td><td>
    <div>
    输入用户名和猫粮数量, 一行一对，以逗号(,)，空格或冒号(:)分隔， 如 abc, 30000
    </div>
    
    <div style="display: flex;">
      <textarea id="account-input"  name="account-input" rows="12" cols="50"></textarea>
      <div style="display: flex; flex-direction: column; margin-left: 50px; flex: 1 1 0%;">
        <div>
          <div style="font-size: 1.2em; color: #d32f2f;">
            检测到 <span id="account-num">0</span> 个帐号:</div>
          <div id="account-list"></div>
        </div>
      <div style="margin-top: 20px;">
        <div style="font-size: 1.2em; color: #d32f2f;">发魔结果:</div>
        <div id="send-points-result"></div>
      </div>
      </div>
      </div>
      <br>
 
      <div style="margin-left: 150px">
      <button type="button" id="btn-bonusdetect" style="padding: 5px 10px;">
      检测
    </button>
      
      <button type="button" id="btn-batchbonus" style="margin-left: 10px;padding: 5px 10px;">
        批量发猫粮
      </button>
    </div>
 
    </td></tr>
    `;
  bonusRow.after(batchBonusUserList);
}
 
var onClickBonusAccountCheck = () => {
  var accountInput = $("#account-input").val();
 
  $("#bonus-result").text("");
  bonusList = [];
 
  $("#send-points-result").text("");
  sendPointsResult = {};
  sentBonusCount = 0;
  bonusList = []
 
  var bonusInputList = [];
  accountInput
    .split("\n")
    .map((s) => s.trim())
    .forEach((s) => {
      var re = /(\w+)\s*[,:\s]+\s*(\d+)/;
      var m = s.match(re);
      if (m) {
        bonusInputList.push({ user: m[1], amount: parseInt(m[2]) });
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
  var msg = $("#ext_msg").val();
 
  bonusList.forEach((account) => {
    sendPointsResult[account.user] = {};
    sendPointsResult[account.user]["targetPoints"] = account.user;
    sendPointsResult[account.user]["sendedPoints"] = account.amount;
    sendPointsResult[account.user]["info"] = "";
 
    sendBonus(account.user, account.amount, msg);
  });
};
 
// ============= main ==================
 
(function () {
  "use strict";
 
  // new invite
  if (/invite.php\?id=\d+&type=new/.test(window.location.href)) {
    addInviteBox();
    detectBtn.click(() => onClickDetect());
    inviteBtn.click(() => onClickInvite());
  }
  if (/amountbonus\.php/.test(window.location.href)) {
    addBatchBonusBlock();
    var btnBonusDetect = $("#btn-bonusdetect");
    var btnBatchBonus = $("#btn-batchbonus");
    btnBonusDetect.click(() => onClickBonusAccountCheck());
    btnBatchBonus.click(() => onClickBatchBonus());
  }
})();