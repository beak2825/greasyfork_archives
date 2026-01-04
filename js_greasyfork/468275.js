// ==UserScript==
// @name         匿名聊天网自动脚本
// @version      1.0
// @description  ssby匿名聊天网自动脚本
// @author       逢春
// @match http*://*.shushubuyue.net*
// @match http*://*.shushubuyue.com*
// @match http*://*.pingzishuo.com*
// @license      MIT
// @namespace https://greasyfork.org/users/1092876
// @downloadURL https://update.greasyfork.org/scripts/468275/%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9%E7%BD%91%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468275/%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9%E7%BD%91%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    const operateBox = document.createElement("div");
  operateBox.style.cssText =
    "position: absolute;z-index: 99999;right: 0;top: 0;margin: 10px 10px 0 0;width: 180px;height: 100px;border-radius: 5px;background-color:rgba(0,0,0,.3);box-shadow: 0 0 3px;display: flex;justify-content: space-evenly;align-items: center;flex-direction: column;";
  operateBox.innerHTML = `
  <div style="height: 20px;width: 100%;font-size: 15px;color: white;display: flex;justify-content: center;align-items: baseline;">自动发送：
  <input style="visibility: inherit;display: block;" type="radio" name="kk" id="0" value="on"> <label for="0">on</label>
  <input style="visibility: inherit;display: block;margin-left: 10px;" type="radio" name="kk" id="1" value="off" checked> <label for="1">off</label></div>
  </div>
  <div>
  <div style="height: 20px;width: 100%;font-size: 15px;color: white;display: flex;justify-content: center;align-items: baseline;">连续匹配：
  <input style="visibility: inherit;display: block;" type="radio" name="ss" id="0" value="on"> <label for="0">on</label>
  <input style="visibility: inherit;display: block;margin-left: 10px;" type="radio" name="ss" id="1" value="off" checked> <label for="1">off</label></div>
  </div>
    <div style= "text-align:center"><input style = "width:95%;" type = "text" id = "msgg" name = "msgg" /></div>
    <div style="height: 20px;width: 100%;font-size: 15px;color: white;display: flex;justify-content: center;align-items: baseline;">地区筛选<input style="width:50%;margin-left:10px;color: black" type = "text" id = "dqsx" name = "dqsx" /></div>`;
  document.body.appendChild(operateBox);
	'use strict';
	function leave() {
		var leftButton = document.querySelector("a.button-link.chat-control");
		if (leftButton) leftButton.click()
		var leftSecondButton = document.querySelector(
			"span.actions-modal-button.actions-modal-button-bold.color-danger")
		if (leftSecondButton) leftSecondButton.click()
		var restartButton = document.querySelector("span.chat-control")
		if (restartButton && restartButton.innerText) {
			if (typeof restartButton.innerText == "string" && restartButton.innerText == "离开") {
				restartButton.click()
				setTimeout(function() {
					restartButton.click()
				}, 500)
			} else if (typeof restartButton.innerText == "string" && restartButton.innerText == "重新开始") {
				restartButton.click()
			} else {
				console.log("error restartButton")
			}
		}
	}

	function init() {
		setInterval(() => {
			var tab = document.querySelector("#partnerInfoText")
            var dqsx = document.querySelector('input[name="dqsx"]').value;
			if (tab) var tabText = tab.innerText
            //alert(dqsx+":"+tabText+":"+tabText.indexOf(dqsx))
			if (tabText && typeof tabText == 'string' && tabText.indexOf("女生") != -1) {
				//女生
                if (dqsx != "" && tabText.indexOf(dqsx) == -1) {
				//地区
				leave()
                }
				var restartButton = document.querySelector("span.chat-control")
				var ss = document.querySelector('input[name="ss"]:checked').value;
                if(ss=="on"){
                	if (restartButton && restartButton.innerText) {
						if (typeof restartButton.innerText == "string" && restartButton.innerText == "离开") {
                        	document.querySelector('input[name="kk"]:checked').value = "on";
							restartButton.click()
							setTimeout(function() {
							restartButton.click()
							}, 500)
						} else if (typeof restartButton.innerText == "string" && restartButton.innerText == "重新开始") {
                        	document.querySelector('input[name="kk"]:checked').value = "on";
							restartButton.click()
						} else {
							//console.log("error restartButton")
						}
					}
                }
                var msgg = document.querySelector('input[name="msgg"]').value;
                var ooo = document.querySelector("#msgInput").value;
                var kk = document.querySelector('input[name="kk"]:checked').value;
                if(ooo=="" && kk == "on"){
                   //ooo = document.querySelector("#msgInput").value = msgg;
                   document.querySelector("#msgInput").focus();
                   document.execCommand('selectAll', false, null);
                   document.execCommand('insertText', false, msgg);

                }
                if(ooo!=""&&kk=="on"){
                    document.querySelector("a.msg-send").click();
                    document.querySelector('input[name="kk"]:checked').value = "off";
                    document.querySelector("#msgInput").focus();
                }
			}

			if (tabText && typeof tabText == 'string' && tabText.indexOf("男生") != -1) {
				//男生
				leave()

			}

		}, 1000)
	}
	setTimeout(init, 5000)
})();
