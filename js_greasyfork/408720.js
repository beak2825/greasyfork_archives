// ==UserScript==
// @name         自动填充Token
// @version      1.4
// @description  帮助添加Token，需要关闭验证码
// @note         v1.1 使用接口调用方式
// @note         v1.2 增加Change自动触发
// @note         v1.3 增加Web&App选择
// @note         v1.4 使用按钮点击登录
// @author       guohui
// @namespace    客服
// @icon         data:image/png;base64,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
// @match        */swagger/index.html*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/408720/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85Token.user.js
// @updateURL https://update.greasyfork.org/scripts/408720/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85Token.meta.js
// ==/UserScript==

; (() => {
    const interval= setInterval (() => {
        let authwrapper = document.getElementsByClassName("auth-wrapper")[0];
        if(authwrapper.getElementsByClassName("loginApp").length > 0 || authwrapper.getElementsByClassName("loginWeb").length > 0)
        {
            console.log(authwrapper.getElementsByClassName("loginApp"))
            console.log(authwrapper.getElementsByClassName("loginWeb"))
            return
        }
        //添加按钮
        var loginApp = document.createElement('input');
        loginApp.type = 'button';
        loginApp.value = "登录App";
        loginApp.className = "loginApp";
        loginApp.style.marginLeft = '8px';
        authwrapper.appendChild(loginApp);

        loginApp.onclick = function(){
            Login('App');
            return true;
        }

        var loginWeb = document.createElement('input');
        loginWeb.type = 'button';
        loginWeb.value = "登录Web";
        loginWeb.className = "loginWeb";
        loginWeb.style.marginLeft = '8px';
        authwrapper.appendChild(loginWeb);

        loginWeb.onclick = function(){
            Login('Web');
            return true;
        }
    },3000);

    function Login(LoginTerminal){
        var httpRequest1 = new XMLHttpRequest();//第一步：建立所需的对象
        httpRequest1.open('GET', '/api/Login/GetCurrentUser', true);//第二步：打开连接
        httpRequest1.send();
        httpRequest1.onreadystatechange = function () {
            if (httpRequest1.readyState == 4 && httpRequest1.status == 200) {
                var obj1 = JSON.parse(httpRequest1.responseText);
                console.log(obj1);
                if(obj1.Status == 401) {
                    if(LoginTerminal=='Web')
                    {
                        var httpRequest2 = new XMLHttpRequest();
                        httpRequest2.open('GET', '/api/Login/Login?LoginName=admin&LoginPass=111111', true);//第二步：打开连接
                        httpRequest2.send();//第三步：发送请求  将请求参数写在URL中
                        httpRequest2.onreadystatechange = function () {
                            if (httpRequest2.readyState == 4 && httpRequest2.status == 200) {
                                var obj2 =JSON.parse(httpRequest2.responseText);
                            }
                            console.log(obj2);
                            if (obj2.Status != 200)
                            { alert(obj2.Message); return; }
                            if(obj2.Data.token){
                                document.getElementsByClassName("authorize")[0].click();
                                const to1 = setTimeout(() => {
                                    if(document.getElementsByClassName(" modal-ux-content")[0].getElementsByTagName("input")[0] == undefined){
                                        document.getElementsByClassName("auth-btn-wrapper")[0].getElementsByTagName("button")[0].click();//logout
                                    }
                                    var input = document.getElementsByClassName(" modal-ux-content")[0].getElementsByTagName("input")[0];
                                    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
                                    setValue.call(input, "Bearer " + obj2.Data.token);//填充token
                                    var event = new Event('input', { bubbles: true });
                                    input.dispatchEvent(event);
                                    //                                     document.getElementsByClassName("auth-btn-wrapper")[0].getElementsByTagName("button")[0].click();
                                    //                                     document.getElementsByClassName("auth-btn-wrapper")[0].getElementsByTagName("button")[1].click();
                                    clearTimeout(to1)
                                    return;
                                },500);
                                return;
                            }
                        };
                    }
                    else if(LoginTerminal=='App')
                    {
                        var httpRequest3 = new XMLHttpRequest();
                        httpRequest3.open('GET', '/api/app/APPLogin/Login?LoginName=admin&LoginPass=111111', true);//第二步：打开连接
                        httpRequest3.send();//第三步：发送请求  将请求参数写在URL中
                        httpRequest3.onreadystatechange = function () {
                            if (httpRequest3.readyState == 4 && httpRequest3.status == 200) {
                                var obj2 =JSON.parse(httpRequest3.responseText);

                            }
                            console.log(obj2);
                            if (obj2.Status != 200)
                            { alert(obj2.Message); return; }
                            if(obj2.Data.token){
                                document.getElementsByClassName("authorize")[0].click();
                                const to1 = setTimeout(() => {
                                    if(document.getElementsByClassName(" modal-ux-content")[0].getElementsByTagName("input")[0] == undefined){
                                        document.getElementsByClassName("auth-btn-wrapper")[0].getElementsByTagName("button")[0].click();//logout
                                    }
                                    var input = document.getElementsByClassName(" modal-ux-content")[0].getElementsByTagName("input")[0];
                                    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
                                    setValue.call(input, "Bearer " + obj2.Data.token);//填充token
                                    var event = new Event('input', { bubbles: true });
                                    input.dispatchEvent(event);
                                    //                                     document.getElementsByClassName("auth-btn-wrapper")[0].getElementsByTagName("button")[0].click();
                                    clearTimeout(to1)
                                    return;
                                },500);
                                return;
                            }
                        };
                    }
                    else
                    {alert("错误错误！");}

                }
            }
        }
    };

})();
