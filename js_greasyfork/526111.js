// ==UserScript==
// @name         自动获取CK并上传ql
// @namespace    响应网址
// @version      1.3
// @description  自动获取展示，5秒后关闭,同步上传后台
// @match        https://www.bilibili.com/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.cookie
// @license MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/526111/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96CK%E5%B9%B6%E4%B8%8A%E4%BC%A0ql.user.js
// @updateURL https://update.greasyfork.org/scripts/526111/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96CK%E5%B9%B6%E4%B8%8A%E4%BC%A0ql.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.addEventListener('load', function() {
        console.log('启动脚本');
        var day = new Date().getDate()
        var pass = false
        if (pass===false) {
            if(GM_getValue('runTime') == undefined){
                GM_setValue('runTime',day )
            }else {
                var gday = GM_getValue('runTime')
                if (gday === day ){
                    console.log('今日已运行，退出');
                    return
                }
            }
        }

        var u = 'http://47.117.144.123:15700'
        let ac_time_value = window.localStorage.getItem("ac_time_value")

        let token = ""
        function linkQl(){
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url:u+"/open/auth/token?client_secret=W-in68hDxf_hWKFnUcEOd2rD&client_id=dA9a0_-6IQ-t",
                    method :"GET",
                    headers: {
                    },
                    onload:function(response){
                        //console.log(response)

                        try {
                            const res = JSON.parse(response.responseText);
                            //console.log('bili_get_dynamic_check', res);
                            token = res.data.token
                            resolve(res.data.token); // 解析成功，返回 Token
                        } catch (error) {
                            console.error("JSON 解析失败:", error);
                            reject(error); // 解析失败，返回错误
                        }
                    },
                    onerror: function (error) {
                        console.error("请求失败:", error);
                        reject(error); // 请求失败，返回错误
                    }
                });
                 })
        }

        let idq = 0
        let remarksq = ""

        function getEnv(cookieValue){
             return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({

                    url:u+"/open/envs?searchValue=BILIBILI_COOKIES",
                    method :"GET",
                    headers: {
                        'Authorization': 'Bearer '+token,
                    },
                    onload:function(response){
                        //console.log("Token3:", token);

                        const res = JSON.parse(response.responseText)
                        const dataArray = res.data;

                        const numberPart2 = cookieValue.match(/DedeUserID=(\d+)/)[1];
                        if (dataArray && dataArray.length > 0) {
                            // 遍历数组，筛选符合条件的项
                            for (const item of dataArray) {
                                const name = item.name;
                                const remarks = item.remarks;
                                const id = item.id;

                                // 判断条件：name为BILIBILI_COOKIES且remarks包含_
                                if (name === 'BILIBILI_COOKIES' && remarks.includes('_')) {
                                    const parts = remarks.split('_');
                                    const numberPart1 = parts[0]; // 获取分割后的第一个部分

                                    if (numberPart2.length == 0){
                                        console.log('匹配错误');
                                        continue
                                    }
                                    if (numberPart1 === numberPart2) {
                                        idq=id
                                        remarksq=remarks
                                        resolve(response.responseText);
                                        return
                                        console.log("lll",numberPart1,numberPart2,numberPart1 == numberPart2);

                                    }
                                }
                            };
                        } else {
                            console.log('没有数据');
                        }
                        idq = -1
                        resolve(response.responseText);

                    }
                });
             })
        }

        function postEnv(cookieValue){
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url:u+"/open/envs",
                    method :"POST",
                    data:`[
  {
    "value": "${cookieValue}",
    "name": "BILIBILI_COOKIES",
    "remarks": "_${ac_time_value}"
  }
]`,
                    headers: {
                        'Authorization': 'Bearer '+token,
                    },
                    onload:function(response){
                        console.log('postEnv完毕，不知道有没有错误');
                        resolve(response.responseText);
                    },
                    onerror: function (error) {
                        console.error("请求失败:", error);
                        reject(error); // 请求失败，返回错误
                    }
                });
            })
        }

        function putEnv(id,r,cookieValue){
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url:u+"/open/envs",
                    method :"PUT",
                    data:`{
  "value":"${cookieValue}",
  "name": "BILIBILI_COOKIES",
  "remarks":  "${r}_${ac_time_value}",
  "id": ${id}
}`,
                    headers: {
                        'Authorization': 'Bearer '+token,
                        "content-type": "application/json",
                    },
                    onload:function(response){
                        // console.log(`{
//  "value":"${cookieValue}",
//  "name":"BILIBILI_COOKIES",
//  "remarks":"${r}_${ac_time_value}?",
//  "id":${id}
//}`);
                        GM_setValue('runTime',day )
                        console.log('putEnv完毕，不知道有没有错误。设置day为',day);
                        resolve(response.responseText);
                    },
                    onerror: function (error) {
                        console.error("请求失败:", error);
                        reject(error); // 请求失败，返回错误
                    }
                });
            })
        }

        (async () => {
            const cookies = await GM.cookie.list({ });
            let cookieValue = ""
            for (const item of cookies) {
                cookieValue += item.name + "=" + item.value + "; ";
            }
            console.log(cookieValue)
            if (!cookieValue.includes("DedeUserID") || !cookieValue.includes("SESSDATA") || !cookieValue.includes("bili_jct")) {
                return;
            }


            // 现在 cookieValue 已经定义，可以继续后面的操作
            const tokens = await linkQl();
            //console.log("Token1:", tokens);
            const tokenw = await getEnv(cookieValue);
            //console.log("Token:", tokenw);

            if (idq == -1) {
                const t1 = await postEnv(cookieValue);
                console.log("t1",t1);
            } else {
                let idsr = remarksq;
                const idss = idsr.split('_');
                if (idss.length == 3) {
                    idsr = idss.slice(0, 2).join('_');
                }

                const t2 = await putEnv(idq,idsr,cookieValue);

                //console.log("t2",t2);
            }
        })();
        function showAlertBox() {
            let alertBox = document.createElement('div');
            var message = document.cookie;
            GM_setClipboard(message, 'text');
            alertBox.textContent = "更新CK成功：\n" + message + "\n" +ac_time_value ;
            alertBox.style.position = 'fixed';
            alertBox.style.top = '90%';
            alertBox.style.left = '50%';
            alertBox.style.transform = 'translate(-50%, -50%)';
            alertBox.style.background = 'white';
            alertBox.style.padding = '10px';
            alertBox.style.zIndex = '9999';
            alertBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            alertBox.style.fontSize = '12px';
            document.body.appendChild(alertBox);
            setTimeout(function() {
                alertBox.remove();
            }, 5000);
                    setTimeout(()=>{
        console.log("inside timeout");
    },5000);
        }

        // showAlertBox();
    });
})();