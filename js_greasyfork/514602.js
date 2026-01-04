// ==UserScript==
// @name 叔叔不约自动匹配
// @version 2.9
// @match http*://*.shushubuyue.net*
// @match http*://*.shushubuyue.com*
// @match http*://*.pingzishuo.com*
// @icon https://www.shushubuyue.com/favicon.ico
// @license MIT
// @namespace https://greasyfork.org/zh-CN/script/514602
// @description 叔叔不约-匿名聊天，自动点击匹配，一直匹配到目标性别与省份停止，电脑手机都能用
// @downloadURL https://update.greasyfork.org/scripts/514602/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/514602/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(function () {
  const operateBox = document.createElement("div");
  //插入的文本块的格式与内容等
  operateBox.style.cssText =
    "position: absolute;z-index: 99999;right: 0;top: 0;margin: 150px 50px 0 0;width: 180px;height: 120px;border-radius: 5px;background-color:rgba(0,0,0,.3);box-shadow: 0 0 3px;display: flex;justify-content: space-evenly;align-items: center;flex-direction: column;";
  operateBox.innerHTML = `<div style="height: 20px;width: 100%;font-size: 15px;color: white;display: flex;justify-content: center;align-items: baseline;"> <input style="visibility: inherit;display: block;" type="radio" name="sex" id="0" value="男生"> <label for="0">男</label> <input style="visibility: inherit;display: block;margin-left: 10px;" type="radio" name="sex" id="1" value="女生" checked> <label for="1">女</label> <input style="visibility: inherit;display: block;margin-left: 25px;height: 20px;width: 70px;color: red" type="text" name="province" id="2" value="江苏" maxlength="4"> </div> <div><input id='sendText' style="height: 20px;line-height: 20px;width: 120px;font-size: 15px;color: blue;border: none;border-radius: 5px;background-color: rgb(240,240,240);" type="text" name="sendText" value="可以月吗" maxlength="20"></div> <div style="height: 25px;width: 100%;display: flex;justify-content: space-evenly;"> <button id='operateBegin' style='height: 25px;line-height: 25px;width: 60px;font-size: 15px;color: white;border: none;border-radius: 5px;background-color: rgb(254,83,81);'>开始</button> <button id='operatePause' style='height: 25px;line-height: 25px;width: 60px;font-size: 15px;color: white;border: none;border-radius: 5px;background-color: rgb(148,148,151);' disabled>暂停</button> </div> <span id="operateTip" style="color: white;font-size: 15px;font-weight: 400;">已准备就绪</span> `;
  document.body.appendChild(operateBox);

  const begin = document.querySelector("#operateBegin");
  const pause = document.querySelector("#operatePause");
  const tip = document.querySelector("#operateTip");
  let sex = document.querySelector('input[name="sex"]:checked').value;
  let province = document.querySelector('input[name="province"').value;// 获取消息框内的省份信息
  let sendText = document.querySelector('input[name="sendText"]').value;//获取消息框内需要发送的消息
  let flag = 0

  //暂停后的行为动作
  function exitMatch() {
    const restartButton = document.querySelector("span.chat-control");
    if (!restartButton || !restartButton.innerText) {
        // 符合条件的性别与省份就发送消息
      if(!flag && document.querySelector("#partnerInfoText").innerText.includes(sex) && document.querySelector('#partnerInfoText').innerText.includes(province)){
          tip.innerText = "匹配成功";
          //pauseMatch();
          check();
          vibration([300, 300,300, 300]);
          sendText = document.querySelector('input[name="sendText"]').value;//获取消息框内需要发送的消息
          autoSend(sendText)
      }
      flag++
      //console.log("error restartButton");
      return;
    }

    if (restartButton.innerText === "离开") {
      flag = 0;
      tip.innerText = "自动匹配中...";
      restartButton.click();
      setTimeout(() => document.querySelector("#operateTip").innerText.includes("暂停") && restartButton.click(), 2000);
    } else if (restartButton.innerText === "重新开始") {
      flag = 0;
      tip.innerText = "自动匹配中...";
      restartButton.click();
    } else {
      console.log("leave error restartButton");
    }
  }

  function leave() {
    const leftButton = document.querySelector("a.button-link.chat-control");
    if (leftButton) leftButton.click();

    const leftSecondButton = document.querySelector(
      "span.actions-modal-button.actions-modal-button-bold.color-danger"
    );
    if (leftSecondButton) leftSecondButton.click();

    exitMatch();
  }

  let timer = null

  //开始匹配且符合条件就暂停
  function beginMatch() {
    sex = document.querySelector('input[name="sex"]:checked').value;//获取性别
    province = document.querySelector('input[name="province"]').value;//获取省份
    tip.innerText = "自动匹配中...";
    clearInterval(timer);
    document.querySelectorAll('input[name="sex"]').forEach(input => {
        input.disabled = true;
    });
    begin.disabled = true;
    pause.disabled = false;
    timer = setInterval(() => {
      const tab = document.querySelector("#partnerInfoText");
      if (tab) {
        const tabText = tab.innerText;
          //如果用户信息栏符合性别与省份就暂停并调用暂停后行为的函数
        if (tabText.includes(sex) && tabText.includes(province)) {
            exitMatch();
            setInterval(check, 3000);
        } else {
          leave();
        }
      }
    }, 1000);
  }

  function pauseMatch() {
    tip.innerText = "已暂停";
    clearInterval(timer);
    document.querySelectorAll('input[name="sex"]').forEach(input => {
        input.disabled = false;
    });
    begin.disabled = false;
    pause.disabled = true;
  }


    // 手机振动
	function vibration(time) {
		navigator.vibrate = navigator.vibrate ||
			navigator.webkitVibrate ||
      		navigator.mozVibrate ||
			navigator.msVibrate;
		navigator.vibrate(time);
	}

    // 发送消息
    function autoSend(message){
        const sendButton = document.querySelector("a.button-link.msg-send");
        const msgInput = document.querySelector("#msgInput");
        msgInput.focus();
        msgInput.value = message;
        msgInput.dispatchEvent(new Event('input'));
        msgInput.dispatchEvent(new Event('change'));
        setTimeout(() => {
            //document.querySelector("a.msg-send").click();
            sendButton.click()
        }, 500);
    }

    function leaveabcd() {
        const restartButton2 = document.querySelector("span.chat-control");
        if (restartButton2 && restartButton2.innerText) {
            if (restartButton2.innerText === "离开") {
                restartButton2.click();
                setTimeout(() => restartButton2.click(), 500);
            } else if (restartButton2.innerText === "重新开始") {
                restartButton2.click();
            }
        }
    }

    function check() {
        if(tip.innerText != "已暂停"){
            leaveabcd();
        }
    }


  // 点击开始匹配
  begin.addEventListener("click", beginMatch);
  // 点击暂停匹配
  pause.addEventListener("click", pauseMatch);
})();