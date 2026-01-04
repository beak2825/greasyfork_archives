// ==UserScript==
// @name         Ecust_Vpn
// @namespace    https://github.com/Tony-tpc
// @version      2.1
// @description  skipping to sslvpn
// @author       Tonytpc
// @match        https://*.ecust.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @exclude      https://*.sslvpn.ecust.edu.cn:8118/*
// @exclude      https://sslvpn.ecust.edu.cn/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502948/Ecust_Vpn.user.js
// @updateURL https://update.greasyfork.org/scripts/502948/Ecust_Vpn.meta.js
// ==/UserScript==

(function () {

    var styles = `
    #myStyledButton {
        display:inline-block;
        flex:none;
        outline:0;
        cursor:pointer;
        color:#fff;
        font-weight:inherit;
        line-height:1.5;
        text-align:center;
        vertical-align:middle;
        background:0 0;
        border-radius:5px;
        border:1px solid;
        font-size: 1.0em;
        padding: .4em 1em;
        border-color: rgb(52, 152, 219);
        background-color: rgb(52, 152, 219);
        float: right;
        position: fixed;
        bottom: 0px;
        right: 5px;
        z-index: 1000;
    }
    `;
    document.body.insertBefore
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    var button = document.createElement('button');
    button.innerHTML = ' 校园VPN ';
    button.id = 'myStyledButton';

    // 设置按钮的点击事件
    button.onclick = convertUrl;
    document.body.appendChild(button);


    //此处基于https://www.ecustvr.top/vpn.html编写
    function convertUrl() {
        var inputUrl = window.location.href;
        var convertedUrl = "https://"; // 默认以https开头
        var isHttps = false; // 标记是否是https
        var isPort = false; // 标记是否存在端口号

        // 检查是否存在端口号
        if (inputUrl.match(/:\d+\//)) {
            isPort = true;
        }

        if (inputUrl === "") {
            convertedUrl += "请输入有效的URL";
        } else {
            var match = inputUrl.match(/^(https?:\/\/)?([^\/]+)(\/.*)?$/);
            if (match) {
                isHttps = match[1] === "https://"; // 判断是否是https
                var domain = match[2].replace(/[.:\/]/g, "-");
                var path = match[3] || "/";
                // 处理端口号
                if (!isHttps && inputUrl.match(/:\d+\//)) {
                    var port = inputUrl.match(/:(\d+)\//)[1];
                    path = path.replace(":" + port + "/", "-" + port + "-p");
                }

                convertedUrl += domain + (isPort ? "-p" : "") + (isHttps ? "-s" : "") + ".sslvpn.ecust.edu.cn:8118" + path;
            } else {
                convertedUrl += "请输入有效的URL";
            }
        }
        // 获取显示结果的元素
        window.location.href = convertedUrl;
    }

})();
