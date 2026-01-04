// ==UserScript==
// @name         Manga Page Auto Clicker
// @name:zh-CN   漫画网站点击后自动翻页
// @version      0.3
// @description  Once you click a manga page to turn next/prev page, the script helps to auto click with a specified time interval, so you can keep hands free to read manga.
// @description:zh-CN 在阅读漫画时，只需点击一次翻页，即可让脚本实现自动翻页，解放你的双手。
// @author       ignor
// @match        http*://*/*
// @grant        none
// @namespace https://greasyfork.org/users/421507
// @downloadURL https://update.greasyfork.org/scripts/393886/Manga%20Page%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/393886/Manga%20Page%20Auto%20Clicker.meta.js
// ==/UserScript==

(function() {
    var acInitializer = setInterval(function () {
        if (document.getElementById("auto-click-div") === null) {
            run();
            clearInterval(acInitializer);
        }
    }, 1000);

    function run() {
        var curTask;
        var acMouseX;
        var acMouseY;

        function mouseTrigger(e) {
            if (e.pageX < 300 && e.pageY - window.pageYOffset < 50) {
                return;
            }
            if (curTask && curTask.isRunning) {
                curTask.kill();
                refreshUI();
            } else {
                acMouseX = e.pageX - window.pageXOffset;
                acMouseY = e.pageY - window.pageYOffset;
                curTask = new CountDownTask(getAcInterval() , refreshUI, autoClick);
                curTask.start();
            }
        }

        function autoClick() {
            var element = document.elementFromPoint(acMouseX, acMouseY);
            var ev = document.createEvent("MouseEvent");
            ev.initMouseEvent(
                "click",
                true /* bubble */, true /* cancelable */,
                window, null,
                acMouseX, acMouseY, acMouseX, acMouseY, /* coordinates */
                false, false, false, false, /* modifier keys */
                0 /*left*/, null
            );
            element.dispatchEvent(ev);
            curTask = new CountDownTask(getAcInterval(), refreshUI, autoClick);
            curTask.start();
        }

        function keyTrigger(e) {
            if (curTask && curTask.isRunning) {
                if (e.ctrlKey) {
                    curTask.pause();
                    refreshUI();
                } else if (e.keyCode === 27) {
                    curTask.kill();
                    refreshUI();
                } else {
                    curTask.restart();
                }
            }
        }

        document.body.addEventListener("keydown", keyTrigger);
        document.body.addEventListener("mousedown", mouseTrigger);

        ///////////////////////////UI/////////////////////////////////
        var acStyle = document.createElement('style');
        acStyle.type = 'text/css';
        acStyle.innerHTML = "#auto-click-div {position: fixed; left: 0; top: 0; z-index: 99999} #auto-click-input {transform: scaleX(0);opacity: 0;transition: opacity .25s, transform .25s;transform-origin: 0 0;} #auto-click-input.show {transform: scaleX(1);opacity: 1;}";
        document.getElementsByTagName('head').item(0).appendChild(acStyle);

        var acDiv = document.createElement("div");
        acDiv.id = "auto-click-div";
        var acButton = document.createElement("input");
        acButton.id = "auto-click-button";
        acButton.setAttribute("type", "button");
        acButton.value = "set interval";
        var acInput = document.createElement("input");
        acInput.id = "auto-click-input";
        acInput.setAttribute("type", "number");
        acInput.setAttribute("min", "1");
        acInput.setAttribute("max", "999");
        acDiv.appendChild(acButton);
        acDiv.appendChild(acInput);
        document.body.appendChild(acDiv);

        document.getElementById('auto-click-button').onclick = function() {
            var clzList = document.getElementById('auto-click-input').classList;
            curTask && curTask.kill();
            if (clzList.contains("show")) {
                this.value = "set interval";
                clzList.remove("show");
                var inputVal = parseInt(document.getElementById('auto-click-input').value);
                if (inputVal > 1 && inputVal < 999) {
                    setAcInterval(inputVal);
                }
            } else {
                this.value = "OK";
                clzList.add("show");
                document.getElementById('auto-click-input').value = getAcInterval();
            }
        };

        function refreshUI() {
            if (curTask && curTask.isRunning) {
                if (curTask.paused) {
                    document.getElementById("auto-click-button").value = "paused..." + curTask.timeLeft + "s";
                    document.body.style.cursor = "";
                } else {
                    document.getElementById("auto-click-button").value = "playing..." + curTask.timeLeft + "s";
                    document.body.style.cursor = "wait";
                }
            } else {
                document.getElementById("auto-click-button").value = "set interval";
                document.body.style.cursor = "";
            }
        }

        //////////////////////////timer///////////////////////////////////
        function CountDownTask(interVal, eachDo, endDo) {
            this.timeLeft = interVal - 1;
            this.eachDo = eachDo;
            this.endDo = endDo;
            this.intervalNum = 0;
            this.isRunning = false;
            this.paused = false;
        }

        CountDownTask.prototype.start = function() {
            var that = this;
            that.isRunning = true;
            doOnce();
            that.intervalNum = setInterval(doOnce, 1000);

            function doOnce() {
                if (that.paused) {
                    return;
                }
                if (that.timeLeft >= 0) {
                    that.eachDo();
                    that.timeLeft -= 1;
                } else {
                    clearInterval(that.intervalNum);
                    that.endDo();
                    that.isRunning = false;
                }
            }
        };

        CountDownTask.prototype.restart = function() {
            this.kill();
            this.timeLeft = getAcInterval() - 1;
            this.start();
        };

        CountDownTask.prototype.pause = function() {
            this.paused = !this.paused;
        };

        CountDownTask.prototype.kill = function() {
            clearInterval(this.intervalNum);
            this.isRunning = false;
        };

        function getAcInterval() {
            var interval = parseInt(localStorage.getItem("auto-click-interval"));
            return interval > 1 ? interval : 30;
        }

        function setAcInterval(interval) {
            localStorage.setItem("auto-click-interval", interval.toString());
        }
    }
})();