// ==UserScript==
// @name         上海千锋自动测评
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  上海千锋学员自动测评
// @author       breezeye
// @match        http://newstu.1000phone.net/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434533/%E4%B8%8A%E6%B5%B7%E5%8D%83%E9%94%8B%E8%87%AA%E5%8A%A8%E6%B5%8B%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/434533/%E4%B8%8A%E6%B5%B7%E5%8D%83%E9%94%8B%E8%87%AA%E5%8A%A8%E6%B5%8B%E8%AF%84.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const userSettings = {
        autoSubmit: true, // 每次是否自动提交, true为是，false为否
        textareaText: "非常好", // 特点或改进 填写的内容，默认为“非常好”
        option: 0, // 选择的选项，0-非常满意，1-满意，2-一般，3-不满意，默认为 0
        resDelayTime: 200, // 操作执行延时，默认每次操作前 等待200毫秒
        toggleDelayTime: 500, // 测评开始前延时，默认每次测评前 等待500毫秒
        selectDelayTime: 10 // 操作选项延时，默认每次选择前 等待10毫秒
        // 如正常操作后不执行脚本，请尝试调大以上延迟时间，并返回刷新网页重新进入测评
        // 如若觉得脚本执行速度慢，可自行减少以上延迟时间，自行测试是否正常运行
    };

    class AutoEvaluation {
        constructor(userSettings) {
            this.autoSubmit = userSettings.autoSubmit;
            this.textareaText = userSettings.textareaText;
            this.option = userSettings.option;
            this.resDelayTime = userSettings.resDelayTime;
            this.selectDelayTime = userSettings.selectDelayTime;
            this.toggleDelayTime = userSettings.toggleDelayTime;

            this.judgeUrlEvent();
        }

        judgeUrlEvent() {
            document.onclick = (event) => {
                const eve = event || window.event;
                const target = eve.target || eve.srcElement;
                if (target.innerHTML === "开始测评") {
                    this.setDelay(() => {
                        this.urlIsRight();
                    })
                }
            }
        }

        urlIsRight() {
            window.location.href.match(/comment/) ? this.run() : null;
        }

        run() {
            this.printLog("脚本开始执行", true);
            this.items = document.querySelectorAll(".el-card__body .content .tabs .list .item");
            this.pageIndex = 0;
            this.items.length ? this.scriptStart() : this.scriptFinish();
        }

        scriptStart() {
            this.setDelay(() => {
                this.updateData();
                this.setDelay(() => {
                    this.selectOptions();
                })
            }, this.toggleDelayTime)
        }

        updateData() {
            this.printLog("更新页面数据");
            this.radioGroups = document.querySelectorAll(".el-radio-group");
            this.textareas = document.querySelectorAll(".el-textarea__inner");
            this.button = document.querySelector(".el-card__body .content table tr:last-child td button");
            this.exit = document.querySelector(".router-link-active button");
            this.numberOfOptions = this.radioGroups.length + this.textareas.length;
        }

        setDelay(functionDelay, time) {
            clearTimeout(this.timeoutIndex);
            this.timeoutIndex = setTimeout(() => {
                functionDelay();
            }, time ? time : this.resDelayTime);
        }

        selectOptions() {
            this.printLog("开始自动填写");
            this.index = 0;
            clearInterval(this.intervalIndex);
            this.intervalIndex = setInterval(() => {
                this.index < this.radioGroups.length ? this.clickOption() : this.index < this.numberOfOptions ? this.writeText() : this.stopInterval();
                document.documentElement.scrollTop += 20;
            }, this.selectDelayTime);
        }

        clickOption() {
            this.radioGroups[this.index++].children[this.option].click();
        }

        writeText() {
            const input = this.textareas[this.index++ - this.radioGroups.length];
            input.focus();
            input.dispatchEvent(new CustomEvent('click'));
            input.dispatchEvent(new CustomEvent('focus'));
            input.dispatchEvent(new CustomEvent('compositionstart'));
            input.value = this.textareaText;
            input.dispatchEvent(new CustomEvent('input'));
            input.dispatchEvent(new CustomEvent('change'));
            input.dispatchEvent(new CustomEvent('blur'));
            input.dispatchEvent(new CustomEvent('compositionupdate'));
            input.dispatchEvent(new CustomEvent('compositionend'));
            input.dispatchEvent(new CustomEvent('click'));
            input.blur();
        }

        stopInterval() {
            this.printLog(`第${++this.pageIndex}次填写完毕`);
            this.setDelay(() => {
                this.clickEventCallback = this.submitEvent.bind(this);
                document.addEventListener("click", this.clickEventCallback);
                this.autoSubmit ? this.button.click() : this.printLog(`等待用户提交`);
            })
            clearInterval(this.intervalIndex);
        }

        submitEvent(event) {
            const eve = event || window.event;
            const target = eve.target || eve.srcElement;
            if (target.innerHTML === "提交问卷" && target.nodeName === "BUTTON") {
                this.printLog(`第${this.pageIndex}次测评提交`, true);
                this.pageIndex !== this.items.length ? this.scriptStart() : this.scriptFinish(this.items.length);
            } else if (target.innerHTML.includes("返回") && target === this.exit) {
                this.printLog("返回，脚本结束", true);
                clearInterval(this.intervalIndex);
            }
            document.removeEventListener("click", this.clickEventCallback);
        }

        scriptFinish(flag) {
            this.setDelay(() => {
                this.printLog(flag ? `本次共填写${flag}个测评页面，执行完毕` : "未发现测评，已结束", false, flag ? 32 : 37);
                flag && alert(`本次共填写${flag}个测评页面，执行完毕`);
            })
        }

        printLog(info, hrFlag = false, infoLen = 40) {
            const logInfo = new Array(infoLen);
            logInfo.splice(Math.ceil((infoLen - info.length) / 2), info.length, info);
            console.log(hrFlag ? `${logInfo.join('-')}\n${new Array(46).join('-')}` : logInfo.join('-'));
        }
    }

    new AutoEvaluation(userSettings);
})();