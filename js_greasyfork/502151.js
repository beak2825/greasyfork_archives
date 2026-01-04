// ==UserScript==
// @name         淘宝自动发送直播弹幕
// @namespace    http://tampermonkey.net/
// @description  淘宝自动发送直播弹幕, 刷屏和互动专用, 右上角插件菜单中启动
// @author       You
// @match        *://tbzb.taobao.com/live*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @noframes
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @license      MIT
// @version      1.0.0
// @downloadURL https://update.greasyfork.org/scripts/502151/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502151/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(() => {
    "use strict";
    function getListAndWeight(infoItems, weightArr = null) {
        const newWeightArr = [],
              newList = [];
        let flag = false;
        for (let i = 0; i < infoItems.length; i++) {
            const item = infoItems[i];
            let num = weightArr && weightArr.length > 0 ? weightArr[i] : 1;
            if (item && (item.includes("--") || item.includes("=>") || item.includes("=tmp>"))) {
                let arr;
                arr = item.split("=tmp>");
                if (arr.length === 1) arr = item.split("=>");
                if (arr.length === 1) arr = item.split("--");
                let curNum = +arr[1];
                if ((!curNum && curNum !== 0) || arr[1] === "") {
                    newWeightArr.push(num);
                    newList.push(item);
                    continue;
                }
                flag = true;
                newWeightArr.push(curNum);
                newList.push(arr[0]);
            } else {
                newWeightArr.push(num);
                newList.push(item);
            }
        }
        return flag ? { tagList: newList, weightArr: newWeightArr } : { tagList: newList, weightArr: new Array(newList.length).fill(1) };
    }

    function getRandomWeight(weightArr) {
        const num = (function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        })(1, weightArr.reduce((a, b) => parseInt(a) + parseInt(b), 0));
        let curSum = 0;
        for (let i = 0; i < weightArr.length; i++) {
            curSum += parseInt(weightArr[i]);
            if (num <= curSum) return i;
        }
        return 0;
    }

    const info = {
        data: {
            text: "",
            time: 5,
            stopTime: 30,
            baseText: "",
            baseTime: 5,
            baseStopTime: 30,
            curIndex: 0,
            startTime: 0,
        },
        keys: {
            text: "auto-send-dm_text",
            time: "auto-send-dm_time",
            stopTime: "auto-send-dm_stopTime",
        },
        txt: {
            textMin: "请设置自动发送的直播弹幕的内容\n默认: base\n当前: current",
            text: "请设置自动发送的直播弹幕的内容，当前: current\n    1.若每条弹幕用 ;; 分隔(两个分号,中英文字符都可以), 则每次将随机发送其中的一条弹幕\n    2.若每条弹幕用 == 分隔, 则依次发送每条弹幕\n    可在每条弹幕的后面通过 --N 的格式添加权重, 权重越高则越容易发送该条弹幕或重复次数越多(默认权重为1), 权重之和可以超过100.\n例如:\n    666;;赞--9;;好耶--90  表示发送666的概率为1%, 赞的概率9%, 好耶的概率90%\n    666==赞--10  表示发送1次666后发送10次赞",
            time: "请设置弹幕发送的间隔时间 (单位秒)\n默认: base\n当前: current",
            stopTime: "请设置运行时长(分钟), 0表示运行后不自动停止\n默认: base\n当前: current",
        },
        classList: {
            textarea: ".chatInputCenterTextarea--fdkDEhGQ",
        },
        doms: {},
        timerId: null,
    };

    function getDoms() {
        info.doms.textarea = document.querySelector(info.classList.textarea);
        console.log(info.doms.textarea);
    }

    function getSendText(str) {
        const newStr = str.replaceAll("；", ";");
        let arr = [],
            text = str;
        if (newStr.includes(";;")) {
            arr = newStr.split(";;");
            text = (function getRandomWeightItem(infoItems) {
                const result = getListAndWeight(infoItems);
                return result.tagList[getRandomWeight(result.weightArr)];
            })(arr);
        } else {
            arr = newStr.split("==");
            const obj = (function getOrderItem(infoItems, index = 0) {
                const result = getListAndWeight(infoItems),
                      oldArr = result.tagList,
                      sizeArr = result.weightArr,
                      len = sizeArr.reduce((a, b) => parseInt(a) + parseInt(b), 0),
                      curP = index + 1;
                let curRange = 0;
                for (let i = 0; i < oldArr.length; i++) {
                    curRange += parseInt(sizeArr[i]);
                    if (curP <= curRange) return { value: oldArr[i], length: len };
                }
                return { value: oldArr[0], length: len };
            })(arr, info.data.curIndex);
            info.data.curIndex = (info.data.curIndex + 1) % obj.length;
            text = obj.value;
        }
        return text;
    }

    function start() {
        stop();
        const sendDm = () => {
            if (!info.doms.textarea) {
                getDoms();
                if (!info.doms.textarea) {
                    console.log("文本框的dom获取失败");
                    clearInterval(info.timerId);
                    return;
                }
            }
            const sendText = getSendText(info.data.text);
            info.doms.textarea.value = sendText;
            var inputEvent = new Event('input', { bubbles: true });
            info.doms.textarea.dispatchEvent(inputEvent);
            info.doms.textarea.focus();
            var enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                keyCode: 13
            });
            info.doms.textarea.dispatchEvent(enterEvent);
            var enterReleaseEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                keyCode: 13
            });
            info.doms.textarea.dispatchEvent(enterReleaseEvent);
            console.log("发送弹幕:", sendText);
            if (info.data.stopTime !== 0) {
                if ((new Date().getTime() - info.data.startTime) / 1000 / 60 > info.data.stopTime) {
                    clearInterval(info.timerId);
                    GM_notification({
                        title: "结束运行",
                        text: `已运行${info.data.stopTime}分钟`,
                        timeout: 4500,
                    });
                    console.log("结束运行");
                }
            }
        };
        GM_notification({ text: "开始发送弹幕", timeout: 3500 });
        info.data.startTime = new Date().getTime();
        sendDm();
        info.timerId = setInterval(sendDm, 1000 * info.data.time);
    }

    function stop(isLog = false) {
        if (isLog) GM_notification({ text: "已停止发送弹幕", timeout: 3500 });
        if (info.timerId) clearInterval(info.timerId);
        info.data.curIndex = 0;
    }

    function setTextItem({ txt, base, key, isChangeTxt = true, verification = null } = {}) {
        let val = localStorage.getItem(key);
        if (val == null) {
            val = base;
            if (typeof base !== "string") base = JSON.stringify(base);
            localStorage.setItem(key, base);
        }
        if (isChangeTxt) txt = txt.replace("base", base).replace("current", val);
        let newVal = prompt(txt, val);
        if (newVal !== null) {
            if (typeof verification === "function") {
                newVal = verification(newVal, val);
                if (newVal === null) newVal = val;
            }
            if (newVal !== val) {
                if (typeof newVal !== "string") newVal = JSON.stringify(newVal);
                localStorage.setItem(key, newVal);
                return true;
            }
        }
        return false;
    }
    !(function main() {
        !(function getData() {
            (info.data.text =
             localStorage.getItem(info.keys.text) || info.data.baseText),
                (info.data.time =
                 localStorage.getItem(info.keys.time) || info.data.baseTime);
        })(),
            getDoms(),
            (function setMenu() {
            GM_registerMenuCommand("开始自动发送弹幕", () => {
                info.data.text
                    ? start()
                : (setTextItem({
                    txt: info.txt.textMin,
                    base: info.data.baseText,
                    key: info.keys.text,
                    verification: (newVal, val) =>
                    newVal
                    ? ((info.data.text = newVal), newVal)
                    : ((info.data.text = val), val),
                }),
                   info.data.text ? start() : stop());
            }),
                GM_registerMenuCommand("停止", () => {
                stop(!0);
            }),
                GM_registerMenuCommand("设置", () => {
                setTextItem({
                    txt: info.txt.text,
                    base: info.data.baseText,
                    key: info.keys.text,
                    verification: (newVal, val) =>
                    newVal
                    ? ((info.data.text = newVal), newVal)
                    : ((info.data.text = val), val),
                }),
                    setTextItem({
                    txt: info.txt.time,
                    base: info.data.baseTime,
                    key: info.keys.time,
                    verification: (newVal, val) =>
                    +newVal
                    ? ((info.data.time = newVal), newVal)
                    : ((info.data.time = val), val),
                }),
                    setTextItem({
                    txt: info.txt.stopTime,
                    base: info.data.baseStopTime,
                    key: info.keys.stopTime,
                    verification: (newVal, val) =>
                    +newVal < 0
                    ? ((info.data.stopTime = val), val)
                    : ((info.data.stopTime = newVal), newVal),
                });
            });
        })();
    })();
})();