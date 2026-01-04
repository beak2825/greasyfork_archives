// ==UserScript==
// @name        jp 获取商品信息
// @namespace   Violentmonkey Scripts
// @match       https://jp.mercari.com/*
// @grant       none
// @version     1.0
// @author      youngyy
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @description 定时获取任务，进行数据截图
// @downloadURL https://update.greasyfork.org/scripts/503954/jp%20%E8%8E%B7%E5%8F%96%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/503954/jp%20%E8%8E%B7%E5%8F%96%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==


(function () {
    'use strict';
    // key
    let baseUrlKey = "jp_api";
    let nameKey = "jp_name";
    let shopListKey = "jp_list";
    // 任务 定时队列
    let task = null
    /**
     * 获取表单存储
     * @param key key
     * @returns {string}
     */
    const getStorage = (key) => {
        let item = GM_getValue(key, "");
        if (!item) {
            winMsg("请先设置表单", key, "storage")
            throw new Error("请先设置表单")
        }
        return item
    }
    /**
     * 弹窗
     * @param text 文本
     * @param title 标题
     * @param tag 标签
     */
    const winMsg = (text, title, tag) => {
        GM_notification({
            "text": text,
            "title": title,
            "tag": tag
        })
    }
    /**
     * 发送请求
     * @param url url
     * @param data
     * @param module 模块
     * @param callback  回调
     */
    const sendReq = (url, data, module, callback) => {
        GM_xmlhttpRequest({
            url: url,
            method: "POST",
            headers: {"Content-Type": "application/json;charset=UTF-8","Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjc3NzYwMDAwMDAsImlhdCI6MTcyMTU2NzAwMiwiaWQiOiIxMDA0NiIsInV1aWQiOiJneGU2NGk4dS14NmNoLWEzMnotYnVpMi14YTl0dTQwajlmODEifQ.zp140ldv13iKM-obiE99sIz5K4FEhcJqbveXzxaXez0"},
            data: JSON.stringify(data),
            onload: (response) => {
                winMsg(`请求成功：${response.finalUrl}\n返回结果：${response.responseText}`, module, "api")
                console.log(`请求成功：${response.finalUrl}\n返回结果：${response.responseText}`);
                callback(response.responseText)
            },
            onerror: function (response) {
                console.error('An error occurred:', response.status, response.statusText);
                winMsg("请求失败", module, "api")
            }
        })
    }

    /**
     * 定时查询任务
     */
    const getItem = () => {
        // task = setInterval(() => { {"device":getStorage(nameKey)}
        sendReq("https://testapi.happygoodsbuy.com//dq/v1/dev/task/get", {device: getStorage(nameKey)}, "定时查询任务", (data) => {
            console.log("获取任务", data) // {"msg":"","data":{"Id":45,"Taskurl":"m66888198695","Orderid":"28","ExecDeviceName":"xxxxxx"},"code":9000}
            let jj = JSON.parse(data)
            if(jj.code != 9000){
                return
            }
            let value = GM_getValue(shopListKey, []);
            value.push(jj.data)
            GM_setValue(shopListKey, value)
            // 打开新窗口
            GM_openInTab(`https://jp.mercari.com/item/${jj.data.Taskurl}`)
            // 当前页面打开 https://jp.mercari.com
            // window.location.href = `https://jp.mercari.com/item/${jj.data.Taskurl}`

        })
        // }, 5000)
    }

    /**
     * 定时查找按钮
     */
    const getStatus = () => {

        setTimeout(()=>{
            let content = document.querySelector("#item-info > section:nth-child(1) > div:nth-child(5) > div button");
            if(!content){
                return
            }
            if(content?.textContent === '購入手続きへ'){
                // 购买
                content.click()
            }
            if(content?.textContent === '売り切れました'){
                // 售出
                // 获取商品ID
                var url = window.location.href;
                var lastPart = url.substring(url.lastIndexOf('/') + 1);

                // 获取对应taskId
                let value = GM_getValue(shopListKey, []);
                value.forEach(item => {
                    if(item.Taskurl === lastPart){
                        sendReq("https://testapi.happygoodsbuy.com/dq/v1/dev/update/status", {
                            "task_id":item.Id,
                            "task_status":6 //11：余额不足   6：执行失败订单异常已被购买
                        }, "商品已售完", (data) => {
                            console.log("商品已售完", data)
                        })
                        winMsg("商品已售完", "商品已售完", "商品已售完")
                    }
                })
            }
        },3000)
    }



        // 弹窗 显示表单，有后台地址与设备名称
    const showForm = () => {
        // 创建弹窗
        const popup = document.createElement('div');
        popup.id = 'popupForm';
        popup.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; background-color: rgba(0, 0, 0, 0.8); z-index: 9999;color: white;';
        document.body.appendChild(popup);

        // 将表单添加至弹窗
        const div = document.createElement('div');
        div.innerHTML = `
            <label for="api">后台地址:</label>
            <input type="text" id="jp_api" name="后台地址" value="${GM_getValue(baseUrlKey) || ''}"><br>
            <label for="name">设备名称:</label>
            <input type="text" id="jp_name" name="设备名称" value="${GM_getValue(nameKey) || ''}"><br>
            <button id="online">设置并上线</button>
            <button id="offline">下线</button>
        `;
        popup.appendChild(div);
        document.getElementById('online').addEventListener('click', () => {
            // 验证输入是否为网址
            let jp_api = document.querySelector("#jp_api");
            let jp_name = document.querySelector("#jp_name");
            if (!jp_api.value.match(/^https?:\/\//)) {
                winMsg("请输入正确的网址", "", "baseForm")
                return;
            }
            GM_setValue(baseUrlKey, jp_api.value)
            GM_setValue(nameKey, jp_name.value)
            winMsg("设置成功", "设备信息", "baseForm")
            // 设置在线
            sendReq("https://testapi.happygoodsbuy.com/dq/v1/dev/online", {device: getStorage(nameKey)}, "设备上线", (data) => {
                console.log("设备上线", data)
                // 发送设备在线状态
                getItem()
            })
        })
        document.getElementById('offline').addEventListener('click', () => {
            // 设置离线
            sendReq("https://testapi.happygoodsbuy.com/dq/v1/dev/offline", {device: getStorage(nameKey)}, "设备离线", (data) => {
                console.log("设备离线", data)
                clearInterval(task)
            })
        })
    }

    // 页面右下角添加按钮 控制弹窗是否显示
    const addButton = () => {
        const btn = document.createElement('button');
        btn.textContent = '显示表单';
        btn.style.cssText = 'position: fixed; bottom: 10px; right: 10px;';
        btn.addEventListener('click', () => {
            const form = document.getElementById('popupForm');
            if (form) {
                form.remove();
                btn.textContent = '显示表单';
            } else {
                showForm();
                btn.textContent = '关闭表单';
            }
        });
        document.body.appendChild(btn);
    }

    const uploadImage = (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'screenshot.png');
        formData.append('order_id', "22");
        formData.append('pic_type', "5");

        GM_xmlhttpRequest({
            url: "https://api.happygoodsbuy.com/dq/v1/upload/pic",
            method: "POST",
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk0OTk1NTE3ODMsImlhdCI6MTcyMzU1MTc4MywiaWQiOiIxMDAwMSIsInV1aWQiOiI4YTNjN2ZmYS1kY2I4LTRkOTAtOTVkYi1lM2UwMGUzOGIxOTAifQ.JuNM4lT-Yf19ixsCGwwi4KnspOqmsEEa1vmjMnT-pLw",
            },
            data: formData,
            onload: (response) => {
                winMsg("上传成功", "上传", "upload")
                console.log('Response received:', response);
            },
            onerror: function (response) {
                winMsg("上传失败", "上传", "upload")
                console.error('An error occurred:', response.status, response.statusText);
            }
        })
    }
    // 图片转换
    // setTimeout(() => {
    //     const div = document.querySelector('.sc-1c0d10c9-1.bKxkuv');
    //     if (!div) {
    //         return
    //     }
    //     html2canvas(div, {allowTaint: true, useCORS: true,})
    //         .then(canvas => {
    //             document.body.appendChild(canvas)
    //
    //             canvas.toBlob((blob) => {
    //                 uploadImage(blob);
    //             }, 'image/png');
    //
    //             // var a = document.createElement('a');
    //             // a.href = canvas.toDataURL("image/png");
    //             // a.download = 'exported-image.png';
    //             // a.click();
    //         });
    // }, 3000)


    // 按钮初始化
    addButton()
    getStatus()

})();