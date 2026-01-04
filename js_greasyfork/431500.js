// ==UserScript==
// @name         CityU Check available seats of courses
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Constantly checking if seats is available in Master Class Schedule in a interval.
// @author       You
// @match        *://banweb.cityu.edu.hk/pls/PROD/hwscrssh_cityu.P_DispOneSection*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431500/CityU%20Check%20available%20seats%20of%20courses.user.js
// @updateURL https://update.greasyfork.org/scripts/431500/CityU%20Check%20available%20seats%20of%20courses.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    function sendMsg(title, content) {
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://www.pushplus.plus/send',
            data: 'token=390b65becbc344cfb33cb03963e0605c' +
                  '&template=txt' +
                  `&title=${title}`+
                  `&content=${content}`,
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(res){
                if(res.status === 200){
                    console.log('Msg Successfully Sent!')
                }else{
                    console.log('Msg Sending Failed!')
                    console.log(res)
                }
            },
            onerror : function(err){
                console.log('error')
                console.log(err)
            }
        });
    }

    function floatElement(eleToBeFloat, dragArea, allowDragOutOfBorder){
        allowDragOutOfBorder = allowDragOutOfBorder == void 0?false:allowDragOutOfBorder
        eleToBeFloat.style.position = "absolute"

        dragArea.onmousedown = function(e){
            var e = e || window.event
            var MouseX = e.clientX, MouseY = e.clientY //瀏覽器左上到鼠標位置的坐標
            //鼠標相對於eleToBeFloat的偏移量
            var relativeMouseX = MouseX - eleToBeFloat.offsetLeft
            var relativeMouseY = MouseY - eleToBeFloat.offsetTop

            var mouseMoveFunc = function(){
                var e = e || window.event
                //窗口相對於瀏覽器左上的偏移量
                var offsetX = (e.clientX - relativeMouseX)
                var offsetY = (e.clientY - relativeMouseY)

                if(e.clientX < 0 || e.clientY < 0) return false
                if(!allowDragOutOfBorder&&isEdgeReached(offsetX, offsetY)) return false
                eleToBeFloat.style.left = offsetX + "px"
                eleToBeFloat.style.top = offsetY + "px"
            }
            var mouseUpFunc = function(){
                document.removeEventListener('mousemove', mouseMoveFunc)
                document.removeEventListener('mouseup', mouseUpFunc)
            }

            document.addEventListener('mousemove', mouseMoveFunc)
            document.addEventListener('mouseup', mouseUpFunc)

            function isEdgeReached(offsetX, offsetY){
                var floatingWindowLeft = offsetX
                var floatingWindowTop = offsetY
                var floatingWindowRight = offsetX + eleToBeFloat.clientWidth
                var floatingWindowBottom = offsetY + eleToBeFloat.clientHeight

                if(floatingWindowTop <= 0 || floatingWindowLeft <= 0) return true
                else if(floatingWindowRight >= document.body.scrollWidth || floatingWindowBottom >= document.body.scrollHeight) return true
                else return false
                //PENDING 判斷是哪一條邊超過了邊界 找到它 然後把相應的Left/top設置成貼近那條邊的地方
            }

            return false
        }
    }

    var courseFound = false // Pass Args

    var addon = document.createElement('div');
    addon.innerHTML = `
<div class="addonBox" style="border: solid 1px rgb(238,238,238);position: absolute;width: 250px;border-radius: 15px;overflow: hidden;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Ubuntu&quot;, &quot;Helvetica Neue&quot;, sans-serif;z-index: 99999;background-color: white;top: -800px; left: 500px">
   <div class="addonTitle" style="background-color: #3c6478;text-align: center;color: white;padding: 6px 0px;">CityU Course Checker</div>
   <div class="addonBody1" style="padding: 10px 30px;text-align: center;">
      <div class="addonTips" style="font-size: larger;margin-bottom: 10px;">Input the CRN:</div>
      <input type="text" id="addonInput" style="border: none;border-bottom: solid 1px grey;height: 30px;font-size: 28px;width: 100%;outline: none;margin-bottom: 20px;text-align: center;">
      <div class="addonTips" style="font-size: larger;margin-bottom: 10px;">Companion Course:</div>
      <input type="text" id="addonInput2" style="border: none;border-bottom: solid 1px grey;height: 30px;font-size: 28px;width: 100%;outline: none;margin-bottom: 20px;text-align: center;">
      <div class="addonTips" style="font-size: larger;margin-bottom: 10px;">Checking Interval(in second)</div>
      <select class="addonSelect" style="margin-bottom: 10px;">
         <option value="5000">5s(Not recommend)</option>
         <option value="10000">10s</option>
         <option value="20000" selected>20s</option>
         <option value="60000">60s</option>
         <option value="300000">5Mins</option>
      </select>
      <br> <button id="addonSubmit" class="btn" style="padding: 10px 20px;border-radius: 15px;outline: none;border: none;">Check</button>
      <br> <button id="addonAutoReg" class="btn" style="padding: 10px 20px;border-radius: 15px;outline: none;border: none;margin-top: 10px;">Auto Reg</button>
   </div>
   <div class="addonBody2" style="padding: 10px 30px;display: none;text-align: center;">
      <div class="addonStatusIndicator" style="font-size: larger;margin-bottom: 10px;">Checking...</div>
      <button id="addonStop" class="btn" style="padding: 10px 20px;border-radius: 15px;outline: none;border: none;">Stop Checking</button>
   </div>
</div>
    `;
    document.body.appendChild(addon);

    floatElement(addon, document.getElementsByClassName("addonTitle")[0], true)

    var submitBtn = document.getElementById("addonSubmit");
    var autoRegBtn = document.getElementById("addonAutoReg");
    var stopBtn = document.getElementById("addonStop");
    var inputBox = document.getElementById("addonInput");
    var inputBox2 = document.getElementById("addonInput2");
    var statusIndicator = document.getElementsByClassName("addonStatusIndicator")[0];
    var addonBody1 = document.getElementsByClassName("addonBody1")[0];
    var addonBody2 = document.getElementsByClassName("addonBody2")[0];
    var addonSelect = document.getElementsByClassName("addonSelect")[0];
    var addonInterval;

    // Init
    var CRN = localStorage.getItem("addonCRN");
    var companyCRN = localStorage.getItem("companyCRN");
    if(CRN != void 0){
        inputBox.value = CRN;
        addonSelect.value = localStorage.getItem("addonInterval");
        hideBox();
        if (companyCRN != void 0) inputBox2.value = companyCRN;
    }
    // Init End

    autoRegBtn.onclick = () => {
        companyCRN = inputBox2.value;
        localStorage.setItem("addonAutoReg", "true");
        localStorage.setItem("companyCRN", inputBox2.value);
        console.log("Auto Reg Start")
        startCheck()
    }

    submitBtn.onclick = () => {
        localStorage.setItem("addonAutoReg", "false");
        startCheck()
    }

    stopBtn.onclick = () => {
        showBox();
        localStorage.setItem("addonAutoReg", "false");
        localStorage.removeItem('addonCRN');
        localStorage.removeItem('companyCRN');
        localStorage.removeItem('addonInterval');
        clearTimeout(addonInterval);
    }

    function startCheck() {
        CRN = inputBox.value;
        localStorage.setItem("addonCRN", inputBox.value);
        localStorage.setItem("addonInterval", addonSelect.value);
        hideBox();
    }

    function showBox(){
        addonBody1.style.display = "block";
        addonBody2.style.display = "none";
    }

    function hideBox(){

        var statusOfChecking = checkCourse(inputBox.value);

        if(statusOfChecking == "full"){
            addonBody2.style.display = "block";
            addonBody1.style.display = "none";
            statusIndicator.innerHTML = inputBox.value + " is now " + statusOfChecking + ",<br> reload in " + addonSelect.value/1000 + "s.";
            document.title = inputBox.value + " is now " + statusOfChecking;

            addonInterval = setTimeout(() => {
                location.reload();
            }, addonSelect.value) // time
        } else if(statusOfChecking == "notFull"){

            courseFound = true // Pass Args

            if (isAutoRegChekced()) {
                autoReg(localStorage.getItem('addonCRN'))
            }

            const availableMsg = inputBox.value + " is now available!!!"
            document.title = availableMsg
            GM_notification(availableMsg, availableMsg)
            sendMsg(availableMsg, "Yeaaa")
            //alert();
            return false;

        } else if(statusOfChecking == "notFound"){
            document.title = inputBox.value + " is not found."
            return false;
        }
    }

    function checkCourse(CRN){
        var returnVal;
        document.querySelectorAll("td").forEach(function(element){
            if(element.innerText == CRN){
                var parent2 = element.closest("tr")
                returnVal = parent2.children[6].innerText
            }
        })

        if(returnVal == "FULL" || returnVal == "Full"){
            return "full";
        } else if(returnVal != void 0){
            return "notFull"
        } else{
            return "notFound"
        }
    }

    function initRegFrame() {
        const regFrame = document.createElement("iframe")
        regFrame.src = "https://banweb.cityu.edu.hk/pls/PROD/bwskfreg.P_AltPin"
        regFrame.id = "regFrame"
        document.body.appendChild(regFrame)
        return regFrame
    }

    function autoReg(CRN) {
        function regFrameOnLoadFunc() {
            regFrame.removeEventListener('load', regFrameOnLoadFunc)
            setTimeout(function() {
                regFrame.contentWindow.document.getElementById("crn_id1").value = CRN
                regFrame.contentWindow.document.getElementById("crn_id2").value = companyCRN
                var submitRegBtn = regFrame.contentWindow.document.querySelector("input[name='REG_BTN'][value='Submit Changes']")
                submitRegBtn.click()
                localStorage.setItem("addonAutoReg", "false")
            }, 1000)
        }

        const regFrame = initRegFrame()
        regFrame.addEventListener('load', regFrameOnLoadFunc)
    }

    function isAutoRegChekced() {
        const isChecked = localStorage.getItem("addonAutoReg");
        if (isChecked == void 0 || isChecked == "false") return false;
        else return true;
    }

})();