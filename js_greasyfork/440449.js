// ==UserScript==
// @name         育碧账号注册
// @namespace    https://greasyfork.org/zh-CN/scripts/440449
// @version      1.2.0
// @description  育碧账号批量注册，需要手动勾选谷歌验证，控制台输出账号密码。
// @author       WAYI
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js
// @match        https://connect.ubisoft.com/create?appId=*&lang=zh-CN
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440449/%E8%82%B2%E7%A2%A7%E8%B4%A6%E5%8F%B7%E6%B3%A8%E5%86%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/440449/%E8%82%B2%E7%A2%A7%E8%B4%A6%E5%8F%B7%E6%B3%A8%E5%86%8C.meta.js
// ==/UserScript==

var form
var login_button
var captchaDom
var input
var totalAccount = ""

waitForKeyElements (
    "app-create-component",
    register
);

function register() {
    //去掉表单的提交和各种输入
    form = document.querySelector('.ng-pristine')
    login_button = document.querySelector('.btn-primary')
    captchaDom = document.querySelector("#recaptchaEnterpriseV2_HtmlElement")
    input = form.querySelectorAll(".ng-invalid")
    form.onsubmit = function () {
        return false
    }
    for (let i of input) {
        i.style.display = "none"
    }
    set_button_to_provide()
}

    function set_button_to_provide() {
        login_button.innerText = '已完成人机验证，请求注册'
        captchaDom.style.display = "block"
        login_button.onclick = provide_response
    }

    function set_button_to_wait() {
        login_button.innerText = '等待注册结果'
        login_button.onclick = null
    }

    function provide_response() {
        set_button_to_wait()
        let response_text = grecaptcha.enterprise.getResponse()
        let response_base = window.btoa("sitekey=6LduJzYaAAAAAIknGhNkgmUq9wMvkXPTLUmhSaYJ&token="+response_text);
        var sendBase = "cce="+response_base
        if (!response_text) {
            alert('获取失败，请确认已经完成了人机验证')
            set_button_to_provide()
            return
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://public-ubiservices.ubi.com/v3/users", true);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.setRequestHeader('ubi-appid', 'afb4b43c-f1f7-41b7-bcef-a635d8c83822');
        xhr.setRequestHeader('ubi-requestedplatformtype', 'uplay');
        xhr.setRequestHeader('ubi-challenge', sendBase);
        xhr.onload = function() {
            if (xhr.status == 200) {
                //根据服务器的响应内容格式处理响应结果
                if (xhr.getResponseHeader('content-type')=='application/json; charset=utf-8'){
                var result = JSON.parse(xhr.responseText);
                    grecaptcha.enterprise.reset()
                    set_button_to_provide()
                    totalAccount = totalAccount + "\n" + accountMail+" heybox2022"
                    console.log("本次累计账号："+totalAccount)
                } else {
                    console.log(result)  //输出错误信息
                }
            } else if (xhr.status == 429) {
                console.log("注册次数超过限制，请更换IP重试")
                grecaptcha.enterprise.reset()
                set_button_to_provide()
            }
        }
        let randstr = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        let mail = ["@live.com","@gmail.com","@outlook.com","@icloud.com","@yahoo.com","@163.com","@zoho.com","@qq.com","@hotmail.com"];
        function generateMixed(n) {
            var res = "";
            for(var i = 0; i < n ; i ++) {
                var id = Math.ceil(Math.random()*35);
                res += randstr[id];
            }
            return res;
        }
        var accountName = "HB-"+(generateMixed(6));
        var accountMail = accountName + mail[Math.ceil(Math.random()*8)]
        var sendData = {"email":"","confirmedEmail":"","firstName":null,"lastName":null,"nameOnPlatform":"","legalOptinsKey":"eyJ2dG91IjoiNC4wIiwidnBwIjoiNC4wIiwidnRvcyI6IjIuMSIsImx0b3UiOiJlbi1VUyIsImxwcCI6ImVuLVVTIiwibHRvcyI6ImVuLVVTIn0","isDateOfBirthApprox":false,"age":null,"dateOfBirth":"2002-08-03T00:00:00.00000Z","password":"heybox2022","country":"US","preferredLanguage":"zh"}
        sendData.email = accountMail;
        sendData.confirmedEmail = accountMail;
        sendData.nameOnPlatform = accountName;
        //将用户输入值序列化成字符串
        xhr.send(JSON.stringify(sendData));
    }