// ==UserScript==
// @name         JD_Cookie
// @version      0.1
// @description  自动更新青龙面板环境变量
// @author       Chea
// @match        https://plogin.m.jd.com/login/login*
// @match        https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @connect      修改为你的青龙面板地址（示例：192.168.1.1）
// @namespace https://greasyfork.org/users/1255180
// @downloadURL https://update.greasyfork.org/scripts/486069/JD_Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/486069/JD_Cookie.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const URL_HOST = "修改为你的青龙面板地址（示例：http://192.168.1.1:5700）"
    const Client_ID = "青龙面板获取"
    const Client_Secret = "青龙面板获取"

    const ENV_NAME = "JD_COOKIE"

    let url = window.location.href;
    console.log(url);
    if (url.indexOf("index.action?resourceValue=bean") !== -1 ) {
        let ready = setInterval(function () {
            var JD_cookie = "";
            GM_cookie.list({}, function(cookies, error) {
                if (!error) {
                    console.log("成功");
                    for (let i=0; i<cookies.length; i++){
                        if (cookies[i].name == "pt_key" || cookies[i].name == "pt_pin"){
                            JD_cookie += cookies[i].name + "=" + cookies[i].value + ";"
                        }
                    }
                    if (JD_cookie != "") {
                        console.log(JD_cookie);
                        clearInterval(ready);//停止定时器
                        get_token(JD_cookie);
                    }
                } else {
                    console.error("错误");
                    console.error(error);
                }
            });
            clearInterval(ready);//停止定时器
        }, 1000);
    }



    //封装GM_xmlhttpRequest ---start---
    async function GM_fetch(details) {
        return new Promise((resolve, reject) =>{
            switch (details.responseType){
                case "stream":
                    details.onloadstart = (res)=>{
                        resolve(res)
                    }
                    break;
                default:
                    details.onload = (res)=>{
                        resolve(res)
                    };
            }

            details.onerror = (res)=>{
                reject(res)
            };
            details.ontimeout = (res)=>{
                reject(res)
            };
            details.onabort = (res)=>{
                reject(res)
            };

            //中断支持
            if(details.responseType === "stream"){
                GM_xmlhttpRequest(details)
            }else{
                GM_xmlhttpRequest(details)
            }

        });
    }

    function GM_httpRequest(details, callBack, errorCallback, timeoutCallback, abortCallback){
        if(callBack){
            switch (details.responseType){
                case "stream":
                    details.onloadstart = callBack;
                    break;
                default:
                    details.onload = callBack
            }
        }
        if(errorCallback){
            details.onerror = errorCallback;
        }
        if(timeoutCallback){
            details.ontimeout = timeoutCallback;
        }
        if(abortCallback){
            details.onabort = abortCallback;
        }
        console.log(details)
        //中断支持
        if(details.responseType === "stream"){
            GM_xmlhttpRequest(details)
        }else{
            GM_xmlhttpRequest(details)
        }
    }
    //封装GM_xmlhttpRequest ---end---


    async function get_token(JD_cookie){
        let rr = await GM_fetch({
            method: "GET",
            url: URL_HOST + "/open/auth/token?client_id=" + Client_ID + "&client_secret=" + Client_Secret,
            headers: {
                "content-type": "application/json",
            }
        });
        if (rr.status == 200) {
            let ql_token = JSON.parse(rr.responseText).data.token;
            console.log(ql_token);
            let res = await GM_fetch({
                method: "GET",
                url: URL_HOST + "/open/envs?searchValue="+ENV_NAME,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer "+ql_token,
                }
            });
            if (res.status == 200) {
                let id = JSON.parse(res.responseText).data[0].id;
                console.log("id=" + id);
                let ress = await GM_fetch({
                    method: "PUT",
                    url: URL_HOST + "/open/envs",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer "+ql_token,
                    },
                    data:JSON.stringify({"id":id, "name":ENV_NAME, "value":JD_cookie})
                });
                if (ress.status == 200) {
                    console.log(JSON.parse(ress.responseText).code)
                } else {
                    console.log(ress)
                }
            }
        }
    }

})();