// ==UserScript==
// @name         郑州轻工业大学打卡脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  需要先自己在电脑上手动打卡一次，后续自动打卡。
// @author       Troublemaker
// @match        https://webvpn.zzuli.edu.cn/http/*/cas/login?service=*
// @match        http://kys.zzuli.edu.cn/cas/login*
// @match        https://kys.zzuli.edu.cn/cas/login*
// @match        https://msg.zzuli.edu.cn/xsc/week?spm=*
// @match        https://msg.zzuli.edu.cn/xsc/view*
// @match        https://msg.zzuli.edu.cn/morn/view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zzuli.edu.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/449424/%E9%83%91%E5%B7%9E%E8%BD%BB%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%89%93%E5%8D%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/449424/%E9%83%91%E5%B7%9E%E8%BD%BB%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%89%93%E5%8D%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// -------------------------------------------------------------------------------------
// common
function containKey(key) {
    return window.location.href.indexOf(key) !== -1
}

function getGM_Info(key) {
    return GM_getValue(key);
}

function deleteGM_Info(key) {
    GM_deleteValue(key);
}

// -------------------------------------------------------------------------------------
// 1、自动登录
let loginKey = 'zzuliLoginKey';

// 插入Html
function insertHtmlInLogin() {
    let location = document.getElementsByClassName('qy-login-top')[0];
    let divElement = document.createElement('div');
    divElement.innerHTML = '<div class="login-outer">\n' +
        '        <p>输入这里！！！！</p>\n' +
        '        <div class="login-inner">\n' +
        '            <label id="login-username">账号: <input type="text"></label>\n' +
        '            <br>\n' +
        '            <label id="login-password">密码: <input type="text"></label>\n' +
        '        </div>\n' +
        '        <button><a href="#">️✔️</a></button>\n' +
        '    </div>';
    location.appendChild(divElement);
}

// 添加CSS
function addCSSInLogin() {
    let CSS = '        .login-outer {\n' +
        '            width: 300px;\n' +
        '            height: 110px;\n' +
        '            background-color: #bfa;\n' +
        '            border: 1px black solid;\n' +
        '            font-size: 14px;\n' +
        '            font-weight: 700;\n' +
        '            color: rgb(2, 122, 212);\n' +
        '            font-family: "Microsoft soft", serif;\n' +
        '            float: right;\n' +
        '        }\n' +
        '\n' +
        '        .login-inner {\n' +
        '            width: 161px;\n' +
        '            margin: 0 auto;\n' +
        '        }\n' +
        '\n' +
        '        .login-outer input {\n' +
        '            outline-style: none;\n' +
        '            border: 1px solid #ccc;\n' +
        '            border-radius: 3px;\n' +
        '            padding: 2px 2px;\n' +
        '            width: 110px;\n' +
        '            text-align: center;\n' +
        '        }\n' +
        '\n' +
        '        .login-outer button {\n' +
        '            padding: 0;\n' +
        '            background-color: transparent;\n' +
        '            border: none;\n' +
        '        }\n' +
        '\n' +
        '        .login-outer a {\n' +
        '            text-decoration: none;\n' +
        '            color: rgb(2, 122, 212);\n' +
        '        }\n';
    GM_addStyle(CSS);
}

// 绑定单击事件
function btnOnClickInLogin() {
        let btn = document.querySelector('.login-outer a');
        btn.onclick = function () {
            // 获取输入框的信息
            let username = document.getElementById('login-username').firstElementChild.value;
            let password = document.getElementById('login-password').firstElementChild.value;
            let loginInfo = JSON.stringify({
                username,
                password
            })
            GM_setValue(loginKey, loginInfo);
            fillLoginInfo(loginInfo);
        }
}

// 填充并登录
function fillLoginInfo(key) {
    let obj = JSON.parse(key);
    let username = obj.username;
    let password = obj.password;
    let usernameElement = document.querySelector("#username");
    let passwordElement = document.querySelector("#password");
    let btn = document.querySelector("#psd > div.text-center > input.qy-log-btn.is-on");
    usernameElement.value = username;
    passwordElement.value = password;
    btn.click();
}

function login() {
    // deleteGM_Info(loginKey);
    let loginInfo = getGM_Info(loginKey);
    if (!loginInfo) {
        insertHtmlInLogin();
        addCSSInLogin();
        btnOnClickInLogin();
    } else
        fillLoginInfo(loginInfo);
}

// -------------------------------------------------------------------------------------
// 2、点击打卡按钮,跳转打卡界面
function clickBtn() {
    let btn = document.querySelector("body > div.wj-btn > a");
    btn.display = 'block';
    btn.click();
}

// -------------------------------------------------------------------------------------
// 3、居家打卡 or 学校打卡
let homeDataKey = 'homeDataKey';
let schoolDataKey = 'schoolDataKey';

// 插入Html
function insertHtmlInData() {
    let location = document.getElementsByClassName('h4')[0];
    let divElement = document.createElement('div');
    divElement.innerHTML = '<div class="location-outer">\n' +
        '    <div class="location-inner">\n' +
        '        <p>请如实填写定位地址!!!</p>\n' +
        '        <label id="location-province">\n' +
        '            省: &nbsp;<input type="text">\n' +
        '        </label>\n' +
        '        <br>\n' +
        '        <label id="location-city">\n' +
        '            市: &nbsp;<input type="text">\n' +
        '        </label>\n' +
        '        <br>\n' +
        '        <label id="location-district">\n' +
        '            县区: <input type="text">\n' +
        '        </label>\n' +
        '        <br>\n' +
        '        <label id="location-address">\n' +
        '            地址: <input type="text">\n' +
        '        </label>\n' +
        '        <br>\n' +
        '        <label id="location-lat">\n' +
        '            纬度: <input type="text">\n' +
        '        </label>\n' +
        '        <br>\n' +
        '        <label id="location-lon">\n' +
        '            经度: <input type="text">\n' +
        '        </label>\n' +
        '        <label>\n' +
        '            地址转经纬度: <a href="https://map.jiqrxx.com/jingweidu/" target="_blank">地球在线</a>\n' +
        '        </label>\n' +
        '        <button><a href="#">️✔️</a></button>\n' +
        '    </div>\n' +
        '</div>\n';
    location.appendChild(divElement);
}

// 添加CSS
function addCSSInData() {
    let CSS = '        .location-outer {\n' +
        '            border: 1px black solid;\n' +
        '            background-color: #bfa;\n' +
        '            font-size: 14px;\n' +
        '            font-weight: 700;\n' +
        '            color: rgb(2, 122, 212);\n' +
        '            font-family: "Microsoft soft", serif;\n' +
        '            position: absolute;\n' +
        '            left: 1289px;\n' +
        '            top: 0;\n' +
        '            z-index: 999;\n' +
        '        }\n' +
        '\n' +
        '        .location-inner {\n' +
        '            width: 220px;\n' +
        '            margin: 0 4px;\n' +
        '        }\n' +
        '\n' +
        '        .location-inner a{\n' +
        '            text-decoration: none;\n' +
        '            margin-left: 10px;\n' +
        '        }\n' +
        '\n' +
        '        .location-inner button{\n' +
        '            padding: 0;\n' +
        '            background-color: transparent;\n' +
        '            border: none;\n' +
        '        }';
    GM_addStyle(CSS);
}

// 绑定单击事件
function btnOnClickInData(key) {
    let btn = document.querySelector('.location-inner button');
    btn.onclick = function () {
        let province = document.getElementById('location-province').firstElementChild.value;
        let city = document.getElementById('location-city').firstElementChild.value;
        let district = document.getElementById('location-district').firstElementChild.value;
        let address = document.getElementById('location-address').firstElementChild.value;
        address = province + city + district + address;
        let lat = document.getElementById('location-lat').firstElementChild.value;
        let lon = document.getElementById('location-lon').firstElementChild.value;
        let clockInDataInfo = JSON.stringify({
            province, city, district, address, lat, lon
        })
        GM_setValue(key, clockInDataInfo);
        fillClockInData(clockInDataInfo);
        alert(clockInDataInfo)
        confirm('请完成后续内容填写，第一次提交后即可自动打卡。');
    }
}

// 填充打卡数据
function fillClockInData(object) {
    let vue = document.querySelector('#app').__vue__;
    let obj = JSON.parse(object);
    vue.lat = obj.lat;
    vue.lon = obj.lon;
    vue.gcj_lat = obj.lat;
    vue.gcj_lon = obj.lon;
    vue.jz_address = obj.address;
    vue.jz_province = obj.province;
    vue.jz_city = obj.city;
    vue.jz_district = obj.district;
    vue.jz_sfyz = '是';
}

// 提交
function subMit() {
    let vue = document.querySelector('#app').__vue__;
    setTimeout(function () {
        vue.doSubmit();
        setTimeout(function () {
                document.querySelector("body > div.van-dialog > div.van-hairline--top.van-dialog__footer.van-dialog__footer--buttons > button.van-button.van-button--default.van-button--large.van-dialog__confirm.van-hairline--left")
                    .click();
                document.querySelector("body > div.van-dialog > div.van-hairline--top.van-dialog__footer.van-dialog__footer--buttons > button.van-button.van-button--default.van-button--large.van-dialog__cancel")
                    .click();
        }, 300)
    }, 2000);
}

function ClockIn(key) {
    // deleteGM_Info(key);
    let clockInDataInfo = getGM_Info(key);
    if (!clockInDataInfo) {
        insertHtmlInData();
        addCSSInData();
        btnOnClickInData(key);
    } else {
        fillClockInData(clockInDataInfo);
        subMit();
    }
}

(function () {
    if (containKey('cas/login')) {
        login();
    } else if (containKey('spm')) {
        clickBtn();
    } else if (containKey('xsc/view')) {
        ClockIn(homeDataKey)
    } else if (containKey('morn/view')) {
        ClockIn(schoolDataKey)
    }
})();