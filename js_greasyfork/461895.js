// ==UserScript==
// @name 叔叔不约-匿名聊天-自动点击匹配-电脑手机都能用
// @version 2.2
// @match http*://*.shushubuyue.net*
// @match http*://*.shushubuyue.com*
// @match http*://*.pingzishuo.com*
// @icon https://www.shushubuyue.com/favicon.ico

// @namespace https://greasyfork.org/zh-CN/scripts/461895
// @description 叔叔不约-匿名聊天，自动点击匹配，一直匹配到目标性别停止，电脑手机都能用
// @downloadURL https://update.greasyfork.org/scripts/461895/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6-%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8C%B9%E9%85%8D-%E7%94%B5%E8%84%91%E6%89%8B%E6%9C%BA%E9%83%BD%E8%83%BD%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461895/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6-%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8C%B9%E9%85%8D-%E7%94%B5%E8%84%91%E6%89%8B%E6%9C%BA%E9%83%BD%E8%83%BD%E7%94%A8.meta.js
// ==/UserScript==

(function () {
  const operateBox = document.createElement("div");
  operateBox.style.cssText =
    "position: absolute;z-index: 99999;right: 0;top: 0;margin: 10px 10px 0 0;width: 180px;height: 80px;border-radius: 5px;background-color:rgba(0,0,0,.3);box-shadow: 0 0 3px;display: flex;justify-content: space-evenly;align-items: center;flex-direction: column;";
  operateBox.innerHTML = `<div style="height: 20px;width: 100%;font-size: 15px;color: white;display: flex;justify-content: center;align-items: baseline;"> <input style="visibility: inherit;display: block;" type="radio" name="sex" id="0" value="男生"> <label for="0">男</label> <input style="visibility: inherit;display: block;margin-left: 10px;" type="radio" name="sex" id="1" value="女生" checked> <label for="1">女</label> </div> <div style="height: 25px;width: 100%;display: flex;justify-content: space-evenly;"> <button id='operateBegin' style='height: 25px;line-height: 25px;width: 60px;font-size: 15px;color: white;border: none;border-radius: 5px;background-color: rgb(254,83,81);'>开始</button> <button id='operatePause' style='height: 25px;line-height: 25px;width: 60px;font-size: 15px;color: white;border: none;border-radius: 5px;background-color: rgb(148,148,151);' disabled>暂停</button> </div> <span id="operateTip" style="color: white;font-size: 15px;font-weight: 400;">已准备就绪</span> `;
  document.body.appendChild(operateBox);

  const begin = document.querySelector("#operateBegin");
  const pause = document.querySelector("#operatePause");
  const tip = document.querySelector("#operateTip");
  let sex = document.querySelector('input[name="sex"]:checked').value;
  let flag = 0

  function exitMatch() {
    const restartButton = document.querySelector("span.chat-control");
    if (!restartButton || !restartButton.innerText) {
      if(!flag && document.querySelector("#partnerInfoText").innerText.includes(sex)){
          tip.innerText = "匹配成功";
          pauseMatch();
          vibration([300, 300,300, 300]);
          autoSend("哈喽")
      }
      flag++
      //console.log("error restartButton");
      return;
    }

    if (restartButton.innerText === "离开") {
      flag = 0;
      tip.innerText = "自动匹配中...";
      restartButton.click();
      setTimeout(() => document.querySelector("#operateTip").innerText.includes("暂停") && restartButton.click(), 1000);
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
  function beginMatch() {
    sex = document.querySelector('input[name="sex"]:checked').value;
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
        if (tabText.includes(sex)) {
          exitMatch();
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
        document.querySelector("#msgInput").focus();
        document.querySelector("#msgInput").value = message;
        setTimeout(() => {
            document.querySelector("a.msg-send").click();
        }, 1000);
    }

  // 点击开始匹配
  begin.addEventListener("click", beginMatch);
  // 点击暂停匹配
  pause.addEventListener("click", pauseMatch);
})();