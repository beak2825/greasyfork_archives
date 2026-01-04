// ==UserScript==
// @name         Grade Release Notifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check Grade Release in 5m interval
// @author       You
// @match        https://banweb.cityu.edu.hk/pls/PROD/hwsrcrtr_cityu.sw_print_stud_grade2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.hk
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/449569/Grade%20Release%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/449569/Grade%20Release%20Notifier.meta.js
// ==/UserScript==

(function() {

    window.addEventListener('load', ()=>{
        initElements();
        initVars();
        autoStart();
        floatElement(floatBox, dragArea, true);

        toggleBtn.onclick = function() {
            toggleBtnTextToggle();
            if (isOn) {
                startIntv();
            } else {
                clearInterval(checkIntv);
                refreshTime(0);
            }
        }

    })


    var isOn;
    var timeRemaining;
    var floatBox;
    var dragArea;
    var toggleBtn;
    var min;
    var sec;
    var timeIntv;
    var checkIntv;

    function startIntv() {
        timeRemaining = timeIntv;
        checkIntv = setInterval(()=>{
            if (timeRemaining >= 0) {
                refreshTime(--timeRemaining);
            } else {
                if (!isInProgress()) {
                    clearInterval(checkIntv);
                    toggleBtnTextToggle();
                    sendMsg("Grade has already been released!", "Go and Check it in the Syetem now!");
                } else {
                    location.reload();
                }
            }
        }, 1000);
    }

    function autoStart(){
        const isAlreadyOn = localStorage.getItem("addonNotifierOn");
        if (isAlreadyOn == "false") return;
        toggleBtnTextToggle();
        startIntv();
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

    function toggleBtnTextToggle() {
        if (isOn)  toggleBtn.innerHTML = "Off";
        else       toggleBtn.innerHTML = "On";
        isOn = !isOn;
        localStorage.setItem("addonNotifierOn", isOn);
    }

    function refreshTime(totalSec) {
        var calcMin = Math.floor(totalSec/60);
        var calcSec = totalSec % 60;

        min.innerHTML = calcMin;
        sec.innerHTML = calcSec;
    }

    function isInProgress() {
        for(item of document.querySelectorAll("font")){
            if(item.innerHTML == "In Progress") return true;
        }
        return false;
    }

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

    function initVars () {
        timeIntv = 300;
        isOn = false;
        timeRemaining = 0;
        floatBox = document.querySelector("#addonFloatBox");
        dragArea = document.querySelector("#addonDragArea");
        toggleBtn = document.querySelector("#addonStateToggle");
        min = document.querySelector(".minLeft");
        sec = document.querySelector(".secLeft");
    }

    function initElements() {
        var theStyle = document.createElement("style");
        theStyle.innerHTML = CSScode;
        document.head.appendChild(theStyle);

        var notifierBox = document.createElement("div");
        notifierBox.innerHTML = HTMLcode;
        document.body.appendChild(notifierBox);
    }


    const HTMLcode = `

            <div class="floatBox" id="addonFloatBox">
                <div class="dragArea" id="addonDragArea">Grade Notifier</div>
                <div class="innerArea">
                    <div class="stateToggle" id="addonStateToggle">Off</div>
                    <div class="timeBox">
                        <div class="timeBoxTitle">Next Check In:</div>
                        <div class="timeBox">
                            <span class="minLeft">5</span><span class="timeText">Mins, </span>
                            <span class="secLeft">00</span><span class="timeText">Secs</span>
                        </div>

                    </div>
                </div>
            </div>

        `;

    const CSScode = `

        :root {
            --innerPadding: 20px;
            --borderRadius: 10px;
        }

        .floatBox {
            border: 1px solid rgb(198, 198, 198);
            position: absolute;
            border-radius: var(--borderRadius);
            background-color: rgb(251, 251, 251);
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            user-select: none;
        }

        .dragArea {
            background-color: rgb(164, 132, 132);
            padding: calc(var(--innerPadding)/4) var(--innerPadding);
            color: white;
            cursor: pointer;
        }

        .innerArea {
            padding: var(--innerPadding);
        }

        .stateToggle {
            background-color: rgb(225, 225, 225);
            border-radius: var(--borderRadius);
            padding: calc(var(--innerPadding)/6);
            cursor: pointer;
            margin-bottom: 10px;
        }

        .stateToggle:active {
            background-color: rgb(200, 200, 200);
        }

        .timeBoxTitle, .timeText {
            font-size: 13px;
        }

        .minLeft, .secLeft {
            font-size: 18px;
        }

        `;

})();