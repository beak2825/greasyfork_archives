// ==UserScript==
// @name         太原教师全员研修平台
// @namespace    http://tampermonkey.net/zzzzzzys_太原教师全员研修平台
// @version      1.0.1
// @description  太原教师全员研修平台，可快速完成视频
// @author       zzzzzzys
// @match        https://gdyx.bnu.edu.cn/*
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/526442/%E5%A4%AA%E5%8E%9F%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/526442/%E5%A4%AA%E5%8E%9F%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
(function () {
    const originalXHR = unsafeWindow.XMLHttpRequest;
    let allTime=null
    unsafeWindow.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        // 重写 open 方法，记录请求信息
        xhr.open = function(method, url) {
            this._method = method;
            this._url = url;
            if(this._url.includes("getVideoTime")) {
                // console.log("getVideoTime arguments:",arguments);
                let data = arguments[1];
                data=data.split('?')[1]
                const params = {};
                data.split('&').forEach(param  => {
                    const [key, value] = param.split('=');
                    // Step 3: 自动类型转换
                    params[key] = isNaN(value) ? value : Number(value);
                });

                this.allTime=params.allTime
                allTime=params.allTime
                console.log(allTime);
            }
            return originalOpen.apply(this, arguments);
        };

        // 重写 send 方法，监听响应
        xhr.send = function(body) {
            this.addEventListener('readystatechange', function() {
                if(this._url.includes("getVideoTime")){
                    if (this.readyState === 4) { // 请求完成
                        // 1. 获取原始响应
                        const originalResponse = this.response;
                        /*
                        * {
                                "status": "10000",
                                "videoTime": 0,
                                "maxVideoTime": 0,
                                "isFinish": 0
                            }
                        * */
                        // 2. 修改响应数据（示例：篡改JSON内容）
                        /*try {
                            const modifiedData = JSON.parse(originalResponse);
                            // modifiedData.someField = "篡改后的值"; // 自定义修改逻辑
                            if(modifiedData?.isFinish === 0){
                                console.log("未完成！源：",modifiedData);
                                modifiedData.videoTime=this.allTime-1
                                if(modifiedData.maxVideoTime <= this.allTime){
                                    modifiedData.maxVideoTime=modifiedData.videoTime
                                }
                                console.log("修改后：",modifiedData)
                            }

                            // 3. 通过劫持 response 属性返回篡改后的数据
                            Object.defineProperty(this, 'response', {
                                value: JSON.stringify(modifiedData),
                                writable: false
                            });
                            Object.defineProperty(this, 'responseText', {
                                value: JSON.stringify(modifiedData),
                                writable: false
                            });
                        }catch(e){}*/


                    }
                }
            });
            return originalSend.apply(this, arguments);
        };

        return xhr;
    };
    let reqObj={
        videoTime:{
            url:"https://gdyx.bnu.edu.cn/api-web/evaluation/videoTime",
            method:"GET",
            data:{
                roomId: "",
                userId: "",
                videoTime: 0,
                allTime: 0,
            },
            res:{

            }
        }
    }
    GM_addStyle(`.button-3 {
              position: fixed;  
              appearance: none;
              background-color: #ed5822;
              border: 1px solid rgba(27, 31, 35, .15);
              border-radius: 6px;
              box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
              box-sizing: border-box;
              color: #ffffff;
              cursor: pointer;
              display: inline-block;
              font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              padding: 6px 16px;
              left: 20px;
              top: 300px;
              text-align: center;
              text-decoration: none;
              user-select: none;
              -webkit-user-select: none;
              touch-action: manipulation;
              vertical-align: middle;
              white-space: nowrap;
              z-index: 2147483647;
            }
  
            .button-3:focus:not(:focus-visible):not(.focus-visible) {
              box-shadow: none;
              outline: none;
            }
  
            .button-3:hover {
              background-color: #2c974b;
            }
  
            .button-3:focus {
              box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
              outline: none;
            }
  
            .button-3:disabled {
              background-color: #94d3a2;
              border-color: rgba(27, 31, 35, .1);
              color: rgba(255, 255, 255, .8);
              cursor: default;
            }
  
            .button-3:active {
              background-color: #298e46;
              box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
            }`)
    let div = document.createElement('div');
    div.innerHTML = `<div style="left: 10px;top: 280px;" id="my1" class="button-3" >2222</div>
                    `
    document.body.appendChild(div);
    const button = document.getElementById('my1');
    let isProcessing = false;
    button.addEventListener("click", async () => {
        if (isProcessing) {
            Swal.fire({
                title: "操作进行中",
                text: "正在刷课中，请勿重复点击！",
                icon: "warning",
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "知道了"
            });
            return;
        }
        try {
            isProcessing = true; // 标记开始处理
            button.disabled = true; // 禁用按钮
            button.textContent = "刷课进行中..."; // 修改按钮文字

            /*if(new Date() > new Date("2025/2/10 20:")) {
                throw Error('未授权的脚本！！')
            }*/
            const hashParams = unsafeWindow.location.hash.split('?')[1];
            const params = new URLSearchParams(hashParams);
            const roomId = params.get('roomId');
            if(!roomId){
                throw Error("can't get room id!");
            }
            console.log(roomId);
            const userId=localStorage.getItem("userId");
            const data={
                ...reqObj.videoTime.data
            }
            data.roomId=roomId
            data.userId=userId
            data.allTime=allTime || Math.round(document.querySelector('video').duration)
            data.videoTime=data.allTime
            console.log("update:",data)
            let res = await fetch(reqObj.videoTime.url+'?'+new URLSearchParams(data), {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "userid": `${userId}`
                },
                "referrer": "https://gdyx.bnu.edu.cn/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "omit"
            });
            if (res.ok){
                res = await res.json()
                console.log(res)
                if(res.status!=="10000"){
                    throw Error(res)
                }
            }else {
                throw Error("fetch error with:"+res)
            }

            if (Swal) {
                Swal.fire({
                    title: "刷课成功！",
                    html: `
            <div style="text-align: left; max-height: 60vh; overflow-y: auto;">
                ${res.toString()}
          </div>
        `,
                    icon: 'success',
                    confirmButtonColor: "#FF4DAFFF",
                    // cancelButtonText: "取消，等会刷新",
                    // 作者：zzzzzzys
                    // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
                    // 搬运可耻
                    confirmButtonText: "立即刷新",

                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload()
                    }
                });
            }
        } catch (e) {
            console.error(e)
            if (Swal) {
                Swal.fire({
                    title: "失败！",
                    text: e.toString(),
                    icon: 'error',
                    // showCancelButton: true,
                    confirmButtonColor: "#FF4DAFFF",
                    // cancelButtonText: "取消，等会刷新",
                    confirmButtonText: "确定",

                }).then((result) => {
                    if (result.isConfirmed) {

                    }
                });
            }
        }finally {
            setTimeout(()=>{
                isProcessing = false; // 重置处理状态
                button.disabled = false; // 恢复按钮
                button.textContent = "2222"; // 恢复按钮文字
            },1000)
        }


    })
})()