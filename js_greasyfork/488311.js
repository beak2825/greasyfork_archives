// ==UserScript==
// @name         GPT4_NEW
// @namespace    http://tampermonkey.net/
// @version      2.7
// @license      MIT
// @description  MyGPT4
// @author       GX
// @match        *.chatshare.biz/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant       unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/488311/GPT4_NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/488311/GPT4_NEW.meta.js
// ==/UserScript==

let myInterval;
let searchInterval;
let loginBtn;


const DEBUG = false;
let baseUrl = 'https://gxx.cool:9000/api';
if (DEBUG) {
    baseUrl = 'http://localhost:9000/api'
}

(function () {
    if (location.pathname === "/") {
        setTimeout(checkToken, 5000)
        myInterval = setInterval(checkToken, 1000 * 60 * 3)
        if (location.search.indexOf("model=gpt-4") === -1) {
            location.search = '?model=gpt-4'
        }
    } else if (location.pathname === '/chatgpt/index') {
        location.href = 'https://' + window.location.host + '/chatgpt/login'
    }
    searchInterval = setInterval(() => {
        if (!loginBtn) {
            loginBtn = document.getElementById("submitBtn");
        } else {
            clearInterval(searchInterval)
            loginBtn.onclick = function (e) {
                e.preventDefault()
                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;
                const xhr = new XMLHttpRequest();
                xhr.open('POST', baseUrl + '/login?' + new Date().getTime(), true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    username: username,
                    password: password,
                    host: window.location.host
                }));
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        const resp = JSON.parse(xhr.responseText);
                        if (xhr.status === 200) {
                            if (resp.status === 'success') {
                                localStorage.setItem('gxToken', resp.token)
                                localStorage.setItem('username', resp.username)
                                localStorage.setItem('userToken', resp.userToken)
                                localStorage.setItem('accessTokenShare', resp.accessToken)
                                localStorage.setItem('freq', resp.freq)
                                localStorage.setItem('count', resp.count)
                                localStorage.setItem('expireTime', resp.expireTime)
                                location.href = 'https://' + window.location.host + '/chatgpt/CarList'
                            } else {
                                alert('登录失败')
                            }
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: resp.message,
                                heightAuto: false,
                            });
                        }
                    }
                }
            }
        }
    }, 500)

    let oldFilter = Array.prototype.filter;
    Array.prototype.filter = function () {
        let cardList = oldFilter.apply(this, arguments);
        cardList.sort((a, b) => {
            return a.currentCount - b.currentCount
        })
        return cardList
    }

    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
        var realXHR = new oldXHR();

        realXHR.open = function () {
            if(arguments[1].indexOf("logintoken")!==-1){
                arguments[1]=baseUrl+"/myLoginToken"
            }
            return oldXHR.prototype.open.apply(realXHR, arguments);
        };

        realXHR.send = function (data) {
            try {
                let jsonData = JSON.parse(data)
                if(jsonData.page){
                    let page = jsonData.page
                    jsonData.page = 5 - page
                }else if(jsonData.usertoken){
                    jsonData.host = location.host
                }
                data = JSON.stringify(jsonData)
            } catch (e) {
                console.log("error",e)
            }

            return oldXHR.prototype.send.apply(realXHR, arguments);
        };
        var originalOnReadyStateChange = realXHR.onreadystatechange;
        realXHR.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200 && this.responseText.indexOf("userToken")!==-1) {
                try {
                    var jsonData = JSON.parse(this.responseText);
                    const accessToken = jsonData.accessToken
                    const cookie = jsonData.cookie
                    document.cookie = cookie
                    document.cookie = "accessTokenShare="+accessToken+"; Path=/;"
                    if(accessToken && accessToken != localStorage.getItem('accessTokenShare')){
                        localStorage.setItem('accessTokenShare', accessToken)
                    }
                    this.responseText = JSON.stringify(jsonData);
                } catch (e) {
                    console.error('Error parsing JSON!');
                }
            }
            if (originalOnReadyStateChange) {
                return originalOnReadyStateChange.apply(this, arguments);
            }
        };


        return realXHR;
    }

    unsafeWindow.XMLHttpRequest = newXHR;

    GM_addStyle(`.el-footer {
        display: none;
        }
        `)
})();


function checkToken() {
    const token = localStorage.getItem('gxToken')
    const username = localStorage.getItem('username')
    if (!token || !username) {
        location.href = 'https://' + window.location.host + '/list#/'
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', baseUrl + '/myCheckToken', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        token: token,
        username: localStorage.getItem('username'),
        host: window.location.host
    }));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                localStorage.clear()
                localStorage.clear()
                clearInterval(myInterval)
                location.href = 'https://' + window.location.host + '/list#/'
            }
        }
    }
}