// ==UserScript==
// @name         Pikpak开发者工具【By纸鸢花的花语】
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  111
// @author       纸鸢花的花语,vvbbnn00
// @icon         https://pic.imgdb.cn/item/66669cd95e6d1bfa05eb991b.jpg
// @grant        none
// @match        *://mypikpak.com/*
// @match        *://pikpak.me/*
// @match        *://mypikpak.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js

// @downloadURL https://update.greasyfork.org/scripts/528872/Pikpak%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%E3%80%90By%E7%BA%B8%E9%B8%A2%E8%8A%B1%E7%9A%84%E8%8A%B1%E8%AF%AD%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/528872/Pikpak%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%E3%80%90By%E7%BA%B8%E9%B8%A2%E8%8A%B1%E7%9A%84%E8%8A%B1%E8%AF%AD%E3%80%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function update_post_data(id, value) {
        let box = document.getElementById(id);
        if (box) {
            box.setAttribute("value", value);
            box.innerHTML = "Yes";
        }
    }

    // 生成不含破折号的UUID
    function generateDeviceId() {
        let device_id = uuidv4().replace(/-/g, '');
        return device_id;
    }

    // UUID生成函数
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0;
            let v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Sign值算法
    function getSign(beginStr, salts) {
        let hexStr = beginStr;
        for (let i = 0; i < salts.length; i++) {
            hexStr = CryptoJS.MD5(hexStr + salts[i].salt).toString()
        }
        return hexStr;
    }
    function generateUppercaseLetter(timestamp) {
        let remainder = timestamp % 26;

        let letter = String.fromCharCode(65 + remainder);

        return letter;
    }
    function check_sign() {
        let timestamp = Date.now()
        let date = new Date(timestamp);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        let roundedTimestamp = date.getTime();
        let key_sign = generateUppercaseLetter(roundedTimestamp) + getSign(String(roundedTimestamp), config_info.extension.salts.default).slice(0, 9)
        let inputElement = document.getElementById("input_str");
        let inputValue = inputElement.value;
        localStorage.setItem("pk_key", inputValue);
        return getSign(key_sign, config_info.extension.salts.default) == getSign(inputValue, config_info.extension.salts.default)
    }
    function deleteAllCookies() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    function saveSelection() {
        localStorage.setItem('platform', platformSelect.value);
        localStorage.setItem('version', versionSelect.value);
    }

    // 页面加载时恢复选择
    function restoreSelection() {
        const platform = current_config_platform
        const version = current_config_version
        if (platform && version) {

            if (platform) {
                platformSelect.value = platform;
                platformSelect.dispatchEvent(new Event('change')); // 触发更新
            }
            if (version) {
                setTimeout(() => {
                    versionSelect.value = version;
                }, 50); // 等待 DOM 更新后再设置值
            }
        }
    }
    // 导入菜单栏样式
    function insertStyle() {
        const qStyle = document.createElement("style");
        qStyle.setAttribute("type", "text/css");
        qStyle.innerHTML = `
.kite-flex {
        display: flex;
        width: 100%;
    }

    .kite-flex>select,
    .kite-flex>button {
        flex: 1;
        height: 40px;
        z-index: 1001;
    }
    .kite-flex>select {
        padding: 10px;
    }

    .kite-input {
        padding: 10px;
        border: 2px solid black;
        border-radius: 4px;
        width: 100%;
        z-index: 1001;
    }

    .kite-btn {
        padding: 5px 15px;
        border: unset;
        border-radius: 5px;
        color: #212121;
        z-index: 0;
        background: #e8e8e8;
        position: relative;
        transition: all 250ms;
        overflow: hidden;
    }

    .kite-btn::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        border-radius: 5px;
        background-color: #212121;
        z-index: -1;
        transition: all 250ms
    }

    .kite-btn:hover {
        color: #e8e8e8;
    }

    .kite-btn:hover::before {
        width: 100%;
    }

    .folder-navigator {
        overflow: visible !important;
    }

    /* Popover 容器 */
    .popover {
        position: relative;
        display: block;
    }

    /* Popover 内容框 */
    .popover-content {
        max-width: 350px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        position: absolute;
        background-color: #fff;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 10px;
        color: #303133;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
        z-index: 1000;
    }



    /* Popover 箭头 */
    .popover-content::before {
        content: "";
        position: absolute;
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: #fff transparent transparent transparent;
    }


    /* Popover 触发元素 */
    .popover:hover .popover-content {
        opacity: 1;
        visibility: visible;
    }

    .popover-content>div {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        word-wrap: break-word;
        margin: 5px 0;
    }
`
        let headNode = document.querySelector('head');
        headNode.appendChild(qStyle);
    }

    function insertMenu() {
        // 创建小菜单盒子
        let qBox = document.createElement("li");
        qBox.id = "qBox";
        qBox.innerHTML = `
    <div class="popover">
        <button class="kite-btn">开发者工具</button>

        <div class="popover-content">
            <div>PikPak开发者工具-v1.1.0 [B站：纸鸢花的花语]</div>
            <div>
                <input class="kite-input" type="text" name="" id="input_str" placeholder="请输入脚本密钥...">
            </div>
            <div class="kite-flex">
                <select id="kite-platform">
                    <option value="android">安卓端</option>
                    <option value="web">网页端</option>
                </select>
                <div style="flex:0.1"></div>
                <select id="kite-version">
                    <option value="">请选择版本</option>
                </select>
            </div>
            <div class="kite-flex">
                <button id="account_btn" class="kite-btn">
                    账号令牌信息
                </button>
            </div>
            <div id="alert_box">
                脚本仅供交流学习，为防止倒卖，脚本密钥可在
                <a href="https://kiteyuan.info/">kiteyuan.info</a>直接获取。
            </div>
        </div>
    </div>
`
        let parentElement = document.querySelector('#app > div.layout > div.main > div > div.all.file-explorer > div.grid.file-explorer-header > div > div:nth-child(1) > nav > ol.real');
        if (parentElement) {
            // 将新子标签添加到父元素中
            parentElement.appendChild(qBox);
            if (localStorage.getItem("pk_key")) {
                let inputElement = document.getElementById("input_str");
                inputElement.value = localStorage.getItem("pk_key")
            }
        } else {
            // 如果未找到，延迟 500 毫秒后再次尝试
            console.log("尝试")
            setTimeout(insertMenu, 1000);
        }
    }
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('复制成功');
            })
            .catch(err => {
                console.error('复制失败:', err);
            });
    }
    function tokenCopy() {
        const copy_device_id = document.getElementById("device_id").getAttribute('value');
        const copy_client_id = document.getElementById("client_id").getAttribute('value');
        const copy_captcha_token = document.getElementById("captcha_token").getAttribute('value');
        const copy_access_token = document.getElementById("access_token").getAttribute('value');
        const copy_user_id = document.getElementById("user_id").getAttribute('value');
        const copy_refresh_token = localStorage.getItem("kite_refresh_token")
        const account_info = {
            "device_id": copy_device_id,
            "client_id": copy_client_id,
            "captcha_token": copy_captcha_token,
            "access_token": copy_access_token,
            "user_id": copy_user_id,
            "refresh_token": copy_refresh_token
        }
        copyToClipboard(JSON.stringify(account_info))
        alert("账号令牌已复制至剪切板")
    }
    const config_info = {
        "android": {
            "name": "安卓端",
            "client_id": "YNxT9w7GMdWvEOKa",
            "client_secret": "dbw2OtmVEeuUvIptb1Coyg",
            "package_name": "com.pikcloud.pikpak",
            "salts": {
                "1.42.6": [{ 'alg': 'md5', 'salt': 'frupTFdxwcJ5mcL3R8' }, { 'alg': 'md5', 'salt': 'jB496fSFfbWLhWyqV' }, { 'alg': 'md5', 'salt': 'xYLtzn8LT5h3KbAalCjc/Wf' }, { 'alg': 'md5', 'salt': 'PSHSbm1SlxbvkwNk4mZrJhBZ1vsHCtEdm3tsRiy1IPUnqi1FNB5a2F' }, { 'alg': 'md5', 'salt': 'SX/WvPCRzgkLIp99gDnLaCs0jGn2+urx7vz/' }, { 'alg': 'md5', 'salt': 'OGdm+dgLk5EpK4O1nDB+Z4l' }, { 'alg': 'md5', 'salt': 'nwtOQpz2xFLIE3EmrDwMKe/Vlw2ubhRcnS2R23bwx9wMh+C3Sg' }, { 'alg': 'md5', 'salt': 'FI/9X9jbnTLa61RHprndT0GkVs18Chd' }],
                "1.41.0": [{ 'alg': 'md5', 'salt': 'Wcpe+bWhLidcpKx+NbicS9tmSq8RbVTFk6Arf' }, { 'alg': 'md5', 'salt': '/WcDjchZab' }, { 'alg': 'md5', 'salt': 'YWRJGUPI/lD' }, { 'alg': 'md5', 'salt': 'R' }, { 'alg': 'md5', 'salt': '9Kba0Nkh7vz5CGWxgFCyqJ/BdjnJIx8KU5r/WTR6Ae' }, { 'alg': 'md5', 'salt': 'tmUQGnovPWmNvB0UAQbDZnJMg57jGzUv7' }, { 'alg': 'md5', 'salt': 'sPsOQdEqCp19PUDMYfg1//' }, { 'alg': 'md5', 'salt': 'mvhuvTJROSortMaGzK5rZi209sBTZq+WitI' }, { 'alg': 'md5', 'salt': 'Qox5BNaQfdishhmAKGr' }, { 'alg': 'md5', 'salt': 'R2JW9N8bRUEizf+pkWg/o9iJKG34bdpSjEe' }, { 'alg': 'md5', 'salt': 'FvDT' }],
                "1.40.0": [{ 'alg': 'md5', 'salt': 'MNn/o2kDbAdap6iyA62c31+odfAXm' }, { 'alg': 'md5', 'salt': 'GU2DNPxJQz8Zd/HZhKe+Vpr3nydASi' }, { 'alg': 'md5', 'salt': 'Mr' }, { 'alg': 'md5', 'salt': '9yuMfCUj3370cqowx0iLT4WI' }, { 'alg': 'md5', 'salt': 'sEtFM' }, { 'alg': 'md5', 'salt': '57O4iXpaXLGJ5CuIXlKWm' }, { 'alg': 'md5', 'salt': 'jIPlqvJR/1fNI3v4IvFcRv2IlzSuUc' }, { 'alg': 'md5', 'salt': 'p0u2aV' }, { 'alg': 'md5', 'salt': 'AnHbAEWs+4ggDbg37bbpULXK2NFyFHSE' }, { 'alg': 'md5', 'salt': 'X3v/UHqblw2VHjeCJHamvXyB' }, { 'alg': 'md5', 'salt': 'Lxe9yYKLa7JBTw3AKivrzs+CqdGO39K' }, { 'alg': 'md5', 'salt': 'lkz8Q4viV1+U' }, { 'alg': 'md5', 'salt': 'VH2I' }],
                "1.39.0": [{ 'alg': 'md5', 'salt': 'e1d0IwHdz+CJLzskoFto8SSKobPWMwcz' }, { 'alg': 'md5', 'salt': 'wUU7Rz/wpuHy' }, { 'alg': 'md5', 'salt': 'dye78dKP7wgEFMebN/Z11VVPAAtueAVR3TcMFZPCO0F9mBQqbk/qpHy9Yqr0no' }, { 'alg': 'md5', 'salt': 'Cpx1E/O+bo+vTguIiLosm3zR9Y1N' }, { 'alg': 'md5', 'salt': 'uqyFMWT5R6TxXji2DhHxlNYY3' }, { 'alg': 'md5', 'salt': '7afNTr/GwzoNJCLXJVm+nEMBa2w8PiwBfm' }, { 'alg': 'md5', 'salt': 'glbIrXW34T5ceIBUhsAOzT1R0XSHnTwv1mqtg1r' }, { 'alg': 'md5', 'salt': 'l' }, { 'alg': 'md5', 'salt': '51sgGDapT73pQMI664' }],
                "1.38.0": [{ 'alg': 'md5', 'salt': 'Z1GUH9FPdd2uR48' }, { 'alg': 'md5', 'salt': 'W4At8CN00YeICfrhKye' }, { 'alg': 'md5', 'salt': 'WbsJsexMTIj+qjuVNkTZUJxqUkdf' }, { 'alg': 'md5', 'salt': 'O56bcWMoHaTXey5QnzKXDUETeaVSD' }, { 'alg': 'md5', 'salt': 'nAN3jBriy8/PXGAdsn3yPMU' }, { 'alg': 'md5', 'salt': '+OQEioNECNf9UdRe' }, { 'alg': 'md5', 'salt': '2BTBxZ3IbPnkrrfd/' }, { 'alg': 'md5', 'salt': 'gBip5AYtm53' }, { 'alg': 'md5', 'salt': '9FMyrvjZFZJT5Y+b1NeSYfs5' }, { 'alg': 'md5', 'salt': '0cIBtEVWYCKdIOlOXnTJPhLGU/y5' }, { 'alg': 'md5', 'salt': '92j4I+ZiMyxFx6Q' }, { 'alg': 'md5', 'salt': 'xNFN9RnUlu218s' }, { 'alg': 'md5', 'salt': 'UZcnnQ2nkaY0S' }]
            }
        },
        "web": {
            "name": "网页端",
            "client_id": "YUMx5nI8ZU8Ap8pm",
            "package_name": "mypikpak.com",
            "salts": {
                "2.0.0": [{ alg: "md5", salt: "C9qPpZLN8ucRTaTiUMWYS9cQvWOE" }, { alg: "md5", salt: "+r6CQVxjzJV6LCV" }, { alg: "md5", salt: "F" }, { alg: "md5", salt: "pFJRC" }, { alg: "md5", salt: "9WXYIDGrwTCz2OiVlgZa90qpECPD6olt" }, { alg: "md5", salt: "/750aCr4lm/Sly/c" }, { alg: "md5", salt: "RB+DT/gZCrbV" }, { alg: "md5", salt: "" }, { alg: "md5", salt: "CyLsf7hdkIRxRm215hl" }, { alg: "md5", salt: "7xHvLi2tOYP0Y92b" }, { alg: "md5", salt: "ZGTXXxu8E/MIWaEDB+Sm/" }, { alg: "md5", salt: "1UI3" }, { alg: "md5", salt: "E7fP5Pfijd+7K+t6Tg/NhuLq0eEUVChpJSkrKxpO" }, { alg: "md5", salt: "ihtqpG6FMt65+Xk+tWUH2" }, { alg: "md5", salt: "NhXXU9rg4XXdzo7u5o" }],
            }
        },
        "web_init": {
            "name": "初始化",
            "client_id": "YUMx5nI8ZU8Ap8pm",
            "package_name": "drive.mypikpak.com",
            "salts": {
                "2.0.0": [{ alg: "md5", salt: "fyZ4+p77W1U4zcWBUwefAIFhFxvADWtT1wzolCxhg9q7etmGUjXr" }, { alg: "md5", salt: "uSUX02HYJ1IkyLdhINEFcCf7l2" }, { alg: "md5", salt: "iWt97bqD/qvjIaPXB2Ja5rsBWtQtBZZmaHH2rMR41" }, { alg: "md5", salt: "3binT1s/5a1pu3fGsN" }, { alg: "md5", salt: "8YCCU+AIr7pg+yd7CkQEY16lDMwi8Rh4WNp5" }, { alg: "md5", salt: "DYS3StqnAEKdGddRP8CJrxUSFh" }, { alg: "md5", salt: "crquW+4" }, { alg: "md5", salt: "ryKqvW9B9hly+JAymXCIfag5Z" }, { alg: "md5", salt: "Hr08T/NDTX1oSJfHk90c" }, { alg: "md5", salt: "i" }]
            }

        },
        "extension": {
            "name": "扩展端",
            "client_id": "Ypcug64Odf8hwuKB",
            "package_name": "",
            "salts": {
                "default": [{ 'alg': "md5", 'salt': "q7" }, { 'alg': "md5", 'salt': "nrlBCFrnAOq+8a2iR0a" }, { 'alg': "md5", 'salt': "yM" }, { 'alg': "md5", 'salt': "EZUpsmzmxJJfUId3sKh/ymbP71" }, { 'alg': "md5", 'salt': "smYiKZVU27IGA6TSZDQ0Yxh6bqGd85FxSb2y+Zd8" }, { 'alg': "md5", 'salt': "LJ+exEg8YOnbXcSvz4V" }, { 'alg': "md5", 'salt': "rTMBTsUDCY8ZNY0aPJyh6yXJODA0pumb" }, { 'alg': "md5", 'salt': "f1txyY7vIhV" }, { 'alg': "md5", 'salt': "zB/wIIhoDt3jh" }, { 'alg': "md5", 'salt': "giAZb" }, { 'alg': "md5", 'salt': "qDydUse4d3XiIKT0jGqjXMq4tR6BPPM9jUGTu+I" }, { 'alg': "md5", 'salt': "Yg9PJEV+27Y+i" }, { 'alg': "md5", 'salt': "JZkNO5s2XfrlneBOsR7uv" }, { 'alg': "md5", 'salt': "lF0O88rW" }],
            }
        }
    }
    let dataBox = document.createElement("div");
    dataBox.innerHTML = `<div style="display: none;">
        <hr style="margin: 0;">
            <div style="margin: 5px 0;">
                设备信息：
                <b style="color: red;" id="device_id">None</b>
                <b style="color: red;" id="client_id">None</b>
                <b style="color: red;" id="captcha_token">None</b>
                <b style="color: red;" id="refresh_token">None</b>
                <b style="color: red;" id="access_token">None</b>
                <b style="color: red;" id="user_id">None</b>
            </div>
        </div>`
    document.body.insertBefore(dataBox, document.body.firstElementChild);
    let RandomDeviceId;
    let inputKey = "";
    if (localStorage.getItem("random_device_id")) {
        RandomDeviceId = localStorage.getItem("random_device_id")
    } else {
        RandomDeviceId = generateDeviceId();
        localStorage.setItem("random_device_id", RandomDeviceId);
    }
    if (localStorage.getItem("pk_key")) {
        inputKey = localStorage.getItem("pk_key")
    }
    insertStyle();

    let platformSelect, versionSelect

    // 监听网页加载完毕后开始尝试插入标签
    window.addEventListener('load', function () {
        insertMenu();
        let inputElement = document.getElementById("input_str");
        inputElement.value = inputKey
        // 获取下拉框元素
        platformSelect = document.getElementById('kite-platform');
        versionSelect = document.getElementById('kite-version');

        if (!platformSelect || !versionSelect) {
            console.warn("找不到 platform 或 version 下拉框");
            return;
        }

        // 解析 config_info 为平台-版本映射
        const versionMap = {};
        for (const platform in config_info) {
            versionMap[platform] = Object.keys(config_info[platform].salts);
        }

        // 监听 platform 变化，更新 version
        platformSelect.addEventListener('change', function () {
            const selectedPlatform = platformSelect.value;
            versionSelect.innerHTML = '<option value="">请选择版本</option>';

            if (selectedPlatform && versionMap[selectedPlatform]) {
                versionMap[selectedPlatform].forEach(version => {
                    const option = document.createElement('option');
                    option.value = version;
                    option.innerText = version;
                    versionSelect.appendChild(option);
                });
            }

            // 重置 version 选择，并保存 platform
            versionSelect.value = '';
        });

        // 监听 version 变化，保存选择
        versionSelect.addEventListener('change', saveSelection);
        restoreSelection();
    });


    // 定义 key 与处理函数的映射
    const keyHandlers = {
        'x-device-id': (value) => {
            // 生成新的 device_id 并替换
            update_post_data("device_id", RandomDeviceId);
            return RandomDeviceId;
        },
        'x-client-id': (value) => {
            update_post_data("client_id", value);
        },
        'Authorization': (value) => {
            update_post_data("access_token", value);
        },
        'x-captcha-token': (value) => {
            update_post_data("captcha_token", value);
        },
        'x-device-sign': (value) => {
            return "wdi10." + RandomDeviceId + "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
        }
        // 可以根据需要添加更多的 key 和对应的处理函数
    };


    let current_config_platform = localStorage.hasOwnProperty("platform") ? localStorage.getItem("platform") : "android"
    let current_config_version = localStorage.hasOwnProperty("version") ? localStorage.getItem("version") : "1.42.6"
    console.log(current_config_platform, current_config_version)
    const current_config_info = config_info[current_config_platform]
    const originalFetch = window.fetch;
    document.body.addEventListener("click", function (event) {
        if (event.target.id === "account_btn") {
            tokenCopy()
        }
    });
    window.fetch = async function (...args) {
        const request = args[0] instanceof Request ? args[0] : new Request(...args);
        const contentType = request.headers.get('Content-Type');
        let requestBody;

        if (contentType && contentType.includes('application/json')) {
            try {
                requestBody = await request.clone().json();
            } catch (e) {
                console.error("Failed to parse JSON request body:", e);
                requestBody = null;
            }
        }

        if (request.url.includes('area_accessible')) {
            return Promise.reject(new Error("Request blocked by script"));
        }

        if (request.url.includes('activation-code') && !(await check_sign())) {
            return new Response(JSON.stringify({
                "error": "no_valid_user",
                "error_description": "脚本密钥无效或已过期，请在kiteyuan.info获取最新密钥。",
                "result": "REJECTED"
            }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }

        if (request.url.includes('revoke')) {
            RandomDeviceId = generateDeviceId();
            localStorage.setItem("random_device_id", RandomDeviceId);
            deleteAllCookies();
        }

        if (requestBody) {
            if (request.url.includes('signin') || request.url.includes('verify') || request.url.includes('verification') || request.url.includes('token')) {
                if (requestBody.client_id) requestBody.client_id = current_config_info.client_id;
            } else if (request.url.includes('signup')) {
                if (requestBody.client_id) requestBody.client_id = current_config_info.client_id;
                if (current_config_platform == "android") requestBody.client_secret = current_config_info.client_secret;
            } else if (request.url.includes('/v1/shield/captcha/init')) {
                if (requestBody.device_id) requestBody.device_id = RandomDeviceId;
                if (requestBody.client_id) requestBody.client_id = current_config_info.client_id;
                if (requestBody.meta) {
                    let salts, sign_flag;
                    if (requestBody.meta.package_name == "mypikpak.com") {
                        requestBody.meta.package_name = current_config_info.package_name
                        requestBody.meta.client_version = current_config_version
                        console.log("version:",current_config_version)
                        salts = current_config_info.salts[current_config_version]
                        sign_flag = true
                    } else if (requestBody.meta.package_name == "drive.mypikpak.com") {
                        requestBody.client_id = "YUMx5nI8ZU8Ap8pm"
                        salts = config_info.web_init.salts['2.0.0']
                        sign_flag = true
                    }
                    if (sign_flag == true) {
                        let bfstr = requestBody.client_id + requestBody.meta.client_version + requestBody.meta.package_name + RandomDeviceId + requestBody.meta.timestamp
                        requestBody.meta.captcha_sign = "1." + getSign(bfstr, salts);
                    }
                }
            }
        }


        const newHeaders = new Headers(request.headers);
        Object.keys(keyHandlers).forEach(key => {
            const value = request.headers.get(key);
            if (value) {
                const newValue = keyHandlers[key](value);
                if (newValue) newHeaders.set(key, newValue);
            }
        });

        const newRequest = new Request(request.url, {
            method: request.method,
            headers: newHeaders,
            body: contentType && contentType.includes('application/json') && requestBody ? JSON.stringify(requestBody) : request.body,
            credentials: request.credentials,
            mode: request.mode
        });

        const response = await originalFetch.call(this, newRequest);
        const clonedResponse = response.clone();

        clonedResponse.json().then(data => {
            if (data && data.sub) {
                update_post_data("user_id", data.sub);
            }
            if (data && data.refresh_token) {
                update_post_data("refresh_token", data.refresh_token);
                localStorage.setItem("kite_refresh_token", data.refresh_token)
            }
        }).catch(e => console.error('Failed to parse JSON:', e));

        return response;
    };
})();