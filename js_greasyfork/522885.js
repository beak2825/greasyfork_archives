// ==UserScript==
// @name         自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  自动登录，退出脚本
// @author       lhq
// @match        https://voovmeeting.com/*
// @grant        GM_xmlhttpRequest
// @connect      159.75.172.230
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522885/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/522885/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

let timer = null;
const baseUrl = "http://159.75.172.230:8083/";
const centerPage = "https://voovmeeting.com/user-center/personal-information";
const meetingLoginPage = "https://voovmeeting.com/r";
let userId = "";
let user = null;

//获取页面类型
const pageType = () => {
    const regex = /https:\/\/voovmeeting\.com\/r\/\d+\//g;
    if (window.location.href === meetingLoginPage) {
        return "meetingLogin";
    } else if (regex.test(window.location.href)) {
        return "meeting";
    } else if (window.location.href === centerPage) {
        return "center";
    } else {
        return null;
    }
};

//另一种赋值
const setInputValue = (inputElement, key) => {
    Object.defineProperty(inputElement, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            this.dispatchEvent(new Event("input", { bubbles: true }));
        },
    });
    inputElement.value = key;
};

//触发输入框事件
const simulateInputEvent = (inputElement) => {
    const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
    });
    const changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
    });
    // 派发input事件
    inputElement.dispatchEvent(inputEvent);
    // 派发change事件
    inputElement.dispatchEvent(changeEvent);
};

//给输入框赋值
const simulateKeyboardInput = (inputElement, value) => {
    inputElement.value = "";
    simulateInputEvent(inputElement);
    const chars = value.split("");
    chars.forEach((char) => {
        const event = new KeyboardEvent("keypress", {
            bubbles: true,
            cancelable: true,
            charCode: char.charCodeAt(0),
        });
        // 模拟输入字符
        inputElement.value += char;
    });
    simulateInputEvent(inputElement);
};

//从cookie获取值
const getValueByCookie = (name) => {
    var cookieArray = document.cookie.split(";");
    var cookieMap = cookieArray.map(function (cookie) {
        var parts = cookie.split("=");
        return {
            key: parts[0].trim(),
            value: parts[1] ? parts[1].trim() : "",
        };
    });
    for (var i = 0; i < cookieMap.length; i++) {
        if (cookieMap[i].key === name) {
            return cookieMap[i].value;
        }
    }
    return null;
};

//加入会议按钮
const btnClick = () => {
    const button = document.querySelector(".join-form__button");
    if (button) button.click();
};

//编辑名称
const editName = (key) => {
    const button1 = document.querySelector(".eidtImg");
    if (button1) button1.click();
    setTimeout(() => {
        const input = document.querySelector("#tea-overlay-root input");
        setInputValue(input, key);
        const button2 = document.querySelector("#tea-overlay-root .confirm");
        if (button2) button2.click();
    }, 1000);
};

//设置登录页面的会议和昵称
const setValue = (val1, val2) => {
    const codeInput = document.querySelector(".join-form__code-item > input");
    if (codeInput) {
        simulateKeyboardInput(codeInput, val1);
    }
    const nicknameInput = document.querySelector(
        ".join-form__nickname-item > input"
    );
    if (nicknameInput) {
        simulateKeyboardInput(nicknameInput, val2);
    }
};

//离开会议
const leaveMeeting = () => {
    const leaveBtn = document.querySelector(".leave-control__btn");
    leaveBtn.click();
    setTimeout(() => {
        const btn = document.querySelector(
            "#tea-overlay-root .btn-list button:nth-of-type(2)"
        );
        if (btn) btn.click();
    }, 1000);
};

//加入会议
const joinMeeting = (meetingCode,personName) => {
    setValue(meetingCode, personName);
    setTimeout(() => {
        btnClick();
    },1000)
};

const getUserInfo = () => {
    const res = localStorage.getItem('persist:root')
    if(res) {
        const res1 = JSON.parse(res)?.userInfos
        if(res1) {
            return JSON.parse(res1)
        }
        return null
    }
    return null
}

//请求API
const requestApi = (userId) => {
    user = getUserInfo()
    const regex = /https?:\/\/voovmeeting\.com\/r\/(\d+)\//;
    const match = window.location.href.match(regex);
    let state = "0";
    if (pageType() == "meeting") {
        state = "3";
    } else {
        state = "1";
    }
    console.log(user)
    if (!user) {
        window.location.href = centerPage
        return
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: `${baseUrl}refreshUserState?appUid=${user.userid}&state=${state}&meetingCode=${match ? match[1] : ''}`,
        onload: function (response) {
            const res = response?.responseText ? JSON.parse(response.responseText) : null;
            console.log('------------------------------',user.nickName,res?.personName,res);
            if (res?.instruct === "join") {
                if (res.changeInnerNameFlag) {
                    if(user.nickName == res.personName) {
                        if (pageType() == "meetingLogin") {
                            joinMeeting(res.meetingCode, res.personName);
                        } else {
                            window.location.href = meetingLoginPage;
                        }
                    }else {
                        if (pageType() == "center") {
                            editName(res.personName);
                        } else {
                            window.location.href = centerPage;
                        }
                    }
                } else {
                    if (pageType() == "meetingLogin") {
                        joinMeeting(res.meetingCode, res.personName);
                    } else {
                        window.location.href = meetingLoginPage;
                    }
                }
            } else if (res?.instruct === "leave" && pageType() === "meeting") {
                leaveMeeting();
            }
        },
        onerror: function (response) {
            console.log("请求失败");
        },
    });
};

(function () {
    "use strict";
    setInterval(() => {
        requestApi();
        if (pageType() == "meetingLogin" || pageType() == "meeting") {
            const endDialog = document.querySelector("#tea-overlay-root button");
            if (endDialog) endDialog.click();
        }
    }, 5000);
})();