// ==UserScript==
// @name         内网系统验证码自动识别脚本V4.3
// @description  内网系统验证码自动识别脚本，后台自行部署django和ddddocr库
// @license      haige
// @namespace    https://*
// @version      4.3
// @author       haige
// @match        http://10.44.1.41:8080/web/
// @match        http://10.44.2.240:8080/web/
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @resource     cktools https://greasyfork.org/scripts/429720-cktools/code/CKTools.js?version=1034581
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @nocompat     Chrome
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/477612/%E5%86%85%E7%BD%91%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E8%84%9A%E6%9C%ACV43.user.js
// @updateURL https://update.greasyfork.org/scripts/477612/%E5%86%85%E7%BD%91%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E8%84%9A%E6%9C%ACV43.meta.js
// ==/UserScript==


(function () {
    "use strict";
    let requestUrl = "http://10.44.96.60:8000";


    console.log('脚本已加载！！！')
    window.addEventListener('popstate', function () {
        console.log('路径发生变化:', window.location.pathname, window.location.hash);
        if (window.location.hash !== '#/login') {
            console.log("删除div");
            document.getElementById("floatingRadioGroup").remove();

        } else {
            console.log('hash——login等于login')
            var buttonGroupHTML = `
            <div id="floatingRadioGroup" role="group" aria-label="Basic radio toggle button group" style="position: fixed; top: 10px; right: 30px; z-index: 9999;border:solid 1px #278aff;height: 35px;width: 280px;display: flex;justify-content: center;align-items: center">
                <input type="radio" value="0" class=e-control e-btn e-lib denglu" name="btnradio" id="btnradio0" autocomplete="off" checked>
                <label class="btn btn-outline-primary" for="btnradio0">默认不填</label>
                
                <input type="radio" value="ysbzgly" class=e-control e-btn e-lib denglu" name="btnradio" id="btnradio1" autocomplete="off">
                <label class="btn btn-outline-primary" for="btnradio1">ysbzgly</label>

                <input type="radio" value="admin" e-btn e-lib denglu" name="btnradio" id="btnradio2" autocomplete="off">
                <label class="btn btn-outline-primary" for="btnradio2">admin</label>
            </div>
        `;
            document.body.insertAdjacentHTML('afterbegin', buttonGroupHTML);
            // 获取所有单选按钮
            const radios = document.querySelectorAll('input[type="radio"]');

            // 遍历每个单选按钮并添加 change 事件监听器,点击后运行
            radios.forEach(radio => {
                radio.addEventListener('change', function () {
                    //获取值
                    console.log("运行验证码识别脚本：", this.value);
                    testXpath(this.value)
                });
            });
       
        }
    });


    function testXpath(value) {
        'use strict';
        console.log("测试开始");


        const prefix = 'blob:http://10.44.1.41:8080/'; // 根据需要调整前缀
        const imgElements = document.querySelectorAll('img');
        // console.log(imgElements);
        imgElements.forEach(img => {
            // console.log(img);
            // console.log(img.src);
            // console.log(img.src.includes(prefix));
            if (img.src.includes(prefix)) {
                console.log('New src:', img.src);
                log(img, value)
            }
        });
    }

    //运行函数
    function log(img_ele, value) {

        console.log("开始处理数据：");
        var element;
        var imgData, response;
        var name = '';

        element = getElementByXpath("/html/body/div[2]/div[1]/div[2]/div/div/div[1]/div[2]/button/text()");
        // console.log(element);
        name = element.textContent
            .replace(/^\s\s*/, "")
            .replace(/\s\s*$/, "");

        console.log(img_ele.src);
        //图片转换base64
        imgData = getCode(img_ele);
        console.log("图片长度：" + imgData.length);
        //发送请求
        reqobj(name, imgData, value);
    }

    //封装xpath
    function getElementByXpath(xpath) {
        var element = document.evaluate(xpath, document).iterateNext();
        return element;
    }

    //获取code数据
    function getCode(img) {
        var imgBase64;
        // console.log(img);
        imgBase64 = ConversionBase(img).toDataURL("image/png");
        var pastDate = "img=" + encodeURIComponent(imgBase64.replace(/.*,/, "").trim());
        return pastDate;
    }

    function ConversionBase(img) {
        // img = document.querySelector(img);
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        // console.log(canvas)
        return canvas;
    }

    //填写内容
    function write(data) {
        var selector;
        console.log("开始填写验证码：");
        selector = document.querySelector.bind(document);
        let uname = selector("div#login_main > div > form > div:nth-of-type(1) > div > div > input");
        let upswd = selector("div#login_main > div > form > div:nth-of-type(2) > div > div > input");
        let yanzhengma = selector("div#login_main > div > form > div:nth-of-type(3) > div > div > input");
        uname.value = data.uname; // 输入的内容
        upswd.value = data.upswd; // 输入的内容
        yanzhengma.value = data.data; // 输入的内容
        var event = new Event("input", {
            bubbles: true, cancelable: true,
        });
        uname.dispatchEvent(event);
        upswd.dispatchEvent(event);
        yanzhengma.dispatchEvent(event);
    }

    function reqobj(name, img, value) {
        var url = requestUrl + "/code";
        var Results;
        console.log("开始识别验证码");
        GM_xmlhttpRequest({
            url: url, method: "POST", headers: {
                "Content-Type": "application/x-www-form-urlencoded", path: window.location.href,
            }, data: img + "&name=" + name + "&value=" + value, responseType: "json", onload: (obj) => {
                var data = obj.response;
                console.log(data);

                if (data.code === 200) {
                    console.log("请求成功！");
                    write(data);
                } else {
                    console.log("请求错误！");
                }
            }, onerror: (err) => {
                console.log(err);
            },
        });
    }
})();
