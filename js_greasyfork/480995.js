// ==UserScript==
// @name         Civitai艺姬
// @namespace    https://greasyfork.org/zh-CN/scripts/480995-civitai%E8%89%BA%E5%A7%AC
// @version      1.6.2
// @description  将c站模型下载到诗悦艺姬
// @author       小白哒哒哒
// @match        https://civitai.com/*
// @match        https://civitai.tech/*
// @grant        GM_notification
// @grant        window.onurlchange
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/480995/Civitai%E8%89%BA%E5%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/480995/Civitai%E8%89%BA%E5%A7%AC.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 将中国镜像站的顶部标签隐藏
    const hideBar = ()=>{
        // 获取 id 为 "_next" 的元素
        const nextElement = document.getElementById('__next');

        // 找到前一个兄弟元素
        const previousSibling = nextElement.previousElementSibling;

        // 确保前一个兄弟元素存在
        if (previousSibling) {
            // 在这里使用前一个兄弟元素
            previousSibling.style.display = 'none'
        } else {
            console.log('没有前一个兄弟元素');
        }
    }

    // 显示提示信息
    const showToast = (message, type = "info") => {
        const toastContainer = document.createElement("div");
        toastContainer.setAttribute('id', 'toastContainerSy');
        GM_addStyle(`
            #toastContainerSy{
                position:fixed;
                top:71px;
                right:13px;
                padding:10px 91px 10px 30px;
                margin:10px;
                border-radius:4px;
                z-index:9999;
                color:white;
                backdrop-filter:blur(5px);
            }
        `)
        toastContainer.innerText = message

        if(type=='info'){
            toastContainer.style.background = "rgb(185 103 36 / 42%)";
        }else if(type=='success'){
            toastContainer.style.background = "rgb(26 173 25 / 42%)";
        }else if(type=='warning'){
            toastContainer.style.background = "rgb(255 128 58 / 42%)";
        }else if(type=='error'){
            toastContainer.style.background = "rgb(201 26 0 / 42%)";
        }

        document.body.appendChild(toastContainer);

        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    };

    //收藏模型
    const collectModel = async (username,href)=>{
        const collectBtn = document.getElementById('collectBtn')
        try {
            // 发送下载请求
            const response = await fetch(
                "https://192.168.30.178:5556/collect_model",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        href: href,
                        'user_name': username,
                    }),
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                if(responseData.status=="success"){
                    showToast('收藏成功！', 'success');
                    collectBtn.textContent = '已收藏'
                    collectBtn.style.backgroundColor = 'rgb(28 129 128)'
                }else{
                    collectBtn.textContent = "收藏模型";
                    collectBtn.style.backgroundColor = '#ff2c2ceb'
                    showToast(responseData.message,'error')
                }
            } else {
                console.error("Failed to send data");
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    }

    const initCollectBtn = async (singleButton)=>{
        // 找到自己创建的下载按钮
        const myBtn = document.getElementById('myBtn')
        // 在自己的按钮后面新增一个收藏按钮
        const collectBtn = document.createElement('button')
        collectBtn.setAttribute('id','collectBtn')
        collectBtn.textContent = "收藏模型";
        GM_addStyle(`
                #collectBtn{
                    height:36px;
                    outline:none;
                    border:none;
                    border-radius:4px;
                    font-weight:600;
                    font-size:14px;
                    padding:0px 18px;
                    box-sizing:border-box;
                    line-height:1;
                    user-select:none;
                    flex:1 1 0%;
                    white-space:nowrap;
                    background-color:#ff2c2ceb;
                    cursor:pointer;
                }
        `)
        // 判断是否收藏了

        let yj_name = GM_getValue('yj-name')
        const href = singleButton.getAttribute("href");
        const obj = await isColect(yj_name,href)
        if(obj.status=='success'){
            collectBtn.textContent = '已收藏'
            collectBtn.style.backgroundColor = 'rgb(28 129 128)'
            collectBtn.addEventListener("click",()=>{});
        }else{
            collectBtn.textContent = "收藏模型";
            collectBtn.style.backgroundColor = '#ff2c2ceb'
            collectBtn.addEventListener("click",()=>collectModel(yj_name,href));
        }
        myBtn.parentNode.insertBefore(
            collectBtn,
            myBtn.nextSibling
        );
    }

    const isColect = async (user_name,href)=>{
        try {
            // 发送下载请求
            const response = await fetch(
                "https://192.168.30.178:5556/check_collected_model",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        href: href,
                        'user_name': user_name,
                    }),
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                // if(responseData.status=="success"){
                //     showToast('收藏成功！', 'success');
                //     collectBtn.textContent = '已收藏'
                //     collectBtn.style.backgroundColor = 'rgb(28 129 128)'
                // }else{
                //     collectBtn.textContent = "收藏模型";
                //     collectBtn.style.backgroundColor = '#ff2c2ceb'
                //     showToast(responseData.message,'error')
                // }
                return responseData
            } else {
                console.error("Failed to send data");
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    }

    //获取下载进度
    const getDownloadProgress = async (taskId,singleButton) => {
        try {
            const responseDown = await fetch(
                "https://192.168.30.178:5556/get_download_progress",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ task_id: taskId }),
                }
            );
            if (responseDown.ok) {
                const responseData = await responseDown.json();
                const status = responseData.status.status
                const myBtn = document.getElementById('myBtn')
                let ts
                if(status == 'pending'){
                    ts = setTimeout(async()=>await getDownloadProgress(taskId,singleButton),3000)
                    myBtn.textContent = '准备下载'
                    myBtn.addEventListener("click", ()=>{});
                }else if(status == 'downloading model'){
                    ts = setTimeout(async()=>await getDownloadProgress(taskId,singleButton),3000)
                    myBtn.textContent = '正在下载 '+responseData.status.progress
                    myBtn.style.backgroundColor = 'rgba(47, 158, 68, 0.2)'
                    myBtn.addEventListener("click", ()=>{});
                }else if(status == 'download completed'){
                    myBtn.textContent = '下载完成'
                    myBtn.style.backgroundColor = 'rgb(26, 173, 25)'
                    showToast('下载完成', 'success');
                    myBtn.addEventListener("click", ()=>{});
                    GM_notification({text:'下载完成！',title:'成功'})
                    clearTimeout(ts)
                    initCollectBtn(singleButton)
                }else if(status == 'file already exists'){
                    myBtn.textContent = '已存在'
                    myBtn.style.backgroundColor = 'rgb(255 128 58)'
                    showToast('文件已存在', 'warning');
                    myBtn.addEventListener("click", ()=>{});
                    GM_notification({text:'文件已存在',title:'警告'})
                }else if(status == 'error'){
                    myBtn.textContent = '需要权限'
                    myBtn.style.backgroundColor = 'rgb(201 26 0)'
                    showToast('需要权限，请联系管理员下载！', 'error');
                    myBtn.addEventListener("click", ()=>{});
                    GM_notification({text:'需要权限，请联系管理员下载！',title:'错误'})
                }else{
                    myBtn.textContent = '下载失败'
                    myBtn.style.backgroundColor = 'rgb(201 26 0)'
                    showToast('下载失败，请重试！', 'error');
                    GM_notification({text:'下载失败，请重试！',title:'错误'})
                    throw new Error('下载失败')
                }
            } else {
                console.error("Failed to send data");
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    // 按钮点击事件----发送下载信息
    const sendModelInfo = async (singleButton) => {
        const myBtn = document.getElementById('myBtn')
        myBtn.style.backgroundColor = "#b96724eb";
        const href = singleButton.getAttribute("href");
        const imgList = Array.from(document.querySelectorAll(".mantine-7aj0so")).map((v) => v.getAttribute("src"))[0];
        const nameEnd = document.querySelector('.mantine-Group-root.mantine-1l2lr7a>.mantine-Group-root.mantine-1u5ck20>.mantine-Text-root.mantine-w3eg8i').innerText;
        const type = document.querySelector('.mantine-Badge-root.mantine-1cvam8p>.mantine-h9iq4m.mantine-Badge-inner').innerText;
        const baseModel = document.querySelector(".mantine-1avyp1d>.mantine-1avyp1d>.mantine-Text-root.mantine-ljqvxq").innerText;
        try {
            // 发送下载请求
            const response = await fetch(
                "https://192.168.30.178:5556/add_model",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        href: href,
                        image: imgList,
                        nameEnd:nameEnd,
                        type:type,
                        baseModel:baseModel
                    }),
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                const taskId = responseData.task_id;
                if (taskId) {
                    await getDownloadProgress(taskId,singleButton);
                }
            } else {
                console.error("Failed to send data");
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    // 获取位置并新建下载按钮（初始化）
    const initDownloadBtn = (status) => {
        const type = document.querySelector('.mantine-Badge-root.mantine-1cvam8p>.mantine-h9iq4m.mantine-Badge-inner').innerText;
        if (['LORA','VAE','CHECKPOINT'].includes(type.split(' ')[0])) {
            // Find the button with class starting with 'mantine-UnstyledButton-root mantine-Button-root'
            const button = document.querySelectorAll(
                '[class^="mantine-UnstyledButton-root mantine-Button-root"]'
            );
            let singleButton = Array.from(button).filter(
                (v) =>
                    v.className.split(" ").some((v1) => v1.match(/mantine-/)) &&
                    v.parentElement.className.match(
                        /mantine-Group-root mantine-*/
                    ) &&
                    v.tagName == "A" &&
                    v.getAttribute("href").match(/download/)
            )[0];
            console.log(singleButton);

            // Check if the button exists
            if (!singleButton) {
                console.log("Button not found");
                return;
            }

            const newButton = document.createElement("button");
            newButton.textContent = "发送到艺姬";
            newButton.setAttribute("id", "myBtn");
            GM_addStyle(`
                #myBtn{
                    height:36px;
                    outline:none;
                    border:none;
                    border-radius:4px;
                    font-weight:600;
                    font-size:14px;
                    padding:0px 18px;
                    box-sizing:border-box;
                    line-height:1;
                    user-select:none;
                    flex:1 1 0%;
                    white-space:nowrap;
                    background-color:#b96724eb;
                    cursor:pointer;
                }
            `)

            // Append the new button after the current button
            singleButton.parentNode.insertBefore(
                newButton,
                singleButton.nextSibling
            );

            if(status.status == 'not found'){
                newButton.textContent = "发送到艺姬";
                // 按钮添加点击事件
                newButton.addEventListener("click", () =>
                    sendModelInfo(singleButton)
                );
            }else if(status.status == 'download completed'){
                newButton.textContent = "已存在";
                newButton.addEventListener("click", ()=>{});
                initCollectBtn(singleButton)
            }else{
                newButton.textContent = '正在下载 '+status.data.progress
                newButton.style.backgroundColor = 'rgba(47, 158, 68, 0.2)'
                newButton.addEventListener("click", ()=>{});
                getTaskByTaskId(status.task_id,singleButton)
            }
        }
    };

    const getTaskByTaskId = async(taskId,singleButton)=>{
        await getDownloadProgress(taskId,singleButton)
    }

    // 获取定位并创建一个下载列表展示按钮（初始化）
    const initDownloadListBtn = () => {
        const button = document.querySelector('.mantine-Group-root.mantine-1eod8xg>.mantine-Group-root.mantine-tz4v6p');
        if (!button) {
            console.log("Button not found");
            return;
        }
        const newButton = document.createElement("button");
        newButton.textContent = "下载列表";
        newButton.setAttribute('id','downloadBtnSy')

        GM_addStyle(`
            #downloadBtnSy{
                height:38px;
                outline:none;
                border:none;
                border-radius:22px;
                font-weight:600;
                font-size:14px;
                padding:0px 18px;
                box-sizing:border-box;
                line-height:1;
                user-select:none;
                flex:1 1 0%;
                white-space:nowrap;
                background-color:rgb(30 54 38);
                cursor:pointer;
            }
        `);

        // 按钮添加点击事件
        newButton.addEventListener("click", openDownloadList);
        // Append the new button after the current button
        button.parentNode.insertBefore(newButton, button);
    }

    //获取下载进度列表
    const getTaskList = async ()=>{
        try {
            // 发送下载请求
            const response = await fetch(
                "https://192.168.30.178:5556/get_all_downloads",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                return Object.values(responseData)
            } else {
                console.error("Failed to send data");
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    }

    // 更新下载列表
    const updateDownloadModal = async()=>{
        const download_ul = document.getElementById('download_list_ul')
        download_ul.innerHTML = ''
        let list = await getTaskList()
        // 向下载列表添加 HTML 内容
        let str = ''
        list.forEach(v=>(
            str+=`<li style='display: flex;align-items: center;justify-content: space-evenly;gap: 34px;padding: 0px 25px;margin:10px 0px;color:black;font-size:18px;'>
                        <span style='white-space:nowrap;width:155px;overflow:hidden;text-overflow:ellipsis;'>${v.model}</span>
                        <progress value="${v.progress?v.progress.split('%')[0]:100}" max="100" style='flex:1;width:169px'></progress>
                        <span>${v.progress?v.progress:'100%'}</span>
                    </li>`
        ))
        download_ul.innerHTML = `
                    ${str}
        `;
    }

    // 打开下载列表
    const openDownloadList = async() => {
        //获取下载进度
        let list = await getTaskList()
        console.log(list)
        const downloadList = document.createElement("div");
        downloadList.setAttribute('id','downloadList')
        // 向下载列表添加 HTML 内容
        let str = ''
        list.forEach(v=>(
            str+=`<li style='display: flex;align-items: center;justify-content: space-evenly;gap: 34px;padding: 0px 25px;margin:10px 0px;color:black;font-size:18px;'>
                        <span style='white-space:nowrap;width:155px;overflow:hidden;text-overflow:ellipsis;'>${v.model}</span>
                        <progress value="${v.progress?v.progress.split('%')[0]:100}" max="100" style='flex:1;width:169px'></progress>
                        <span>${v.progress?v.progress:'100%'}</span>
                    </li>`
        ))
        downloadList.innerHTML = `
            <div style="padding: 0px 20px 20px 20px;">
                <div style='display:flex;justify-content:space-between;position: sticky;top: 0px;left: 0px;height: 49px;background: white;align-items: center;'>
                    <h2 style='padding:0;margin:0; font-size:18px;color:black;'>下载列表</h2>
                    <button id="closeDownloadList" style='width:50px;height:33px;'>关闭</button>
                </div>
                <ul id='download_list_ul' style='list-style:none;margin:0;margin-top:20px;padding:0;'>
                    ${str}
                </ul>
            </div>
        `;
        // 为下载列表添加样式
        GM_addStyle(`
            #downloadList {
                position: fixed;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                width:540px;
                height:500px;
                overflow-y: auto;
                z-index: 9999;
            }
        `);
        // 将下载列表添加到 body 中
        document.body.appendChild(downloadList);
        let timer = setInterval(()=>{
            updateDownloadModal()
        },3000)
        // 为关闭下载列表的按钮添加点击事件监听器
        const closeDownloadListButton = document.getElementById('closeDownloadList');
        closeDownloadListButton.addEventListener('click', () => {
            downloadList.remove();
            clearInterval(timer)
        });
    }

    // 初始化界面的下载按钮还是收藏按钮
    const initModel = async ()=>{
        const button = document.querySelectorAll(
            '[class^="mantine-UnstyledButton-root mantine-Button-root"]'
        );
        let singleButton = Array.from(button).filter(
            (v) =>
                v.className.split(" ").some((v1) => v1.match(/mantine-/)) &&
                v.parentElement.className.match(
                    /mantine-Group-root mantine-*/
                ) &&
                v.tagName == "A" &&
                v.getAttribute("href").match(/download/)
        )[0];
        const href = singleButton.getAttribute("href");
        try {
            // 发送下载请求
            const response = await fetch(
                "https://192.168.30.178:5556/get_download_status_by_href",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        href: href,
                    }),
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                return responseData;
                // return Object.values(responseData)
            } else {
                console.error("Failed to send data");
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    }

    async function mounted() {
        GM_registerMenuCommand("清除登录状态", function(event) {
            GM_setValue('yj-name','')
            const currentURL = window.location.href;
            window.location.href = currentURL
          }, {
            title:'点击清除姓名',
            autoClose: true
          })
        // 输入框
        let name_in_tam = GM_getValue('yj-name')
        if(!name_in_tam){
            let name = prompt('请输入使用者完整工号，如syxxxx')
            GM_setValue('yj-name',name)
        }
        if(GM_getValue('yj-name')){
            const currentURL = window.location.href;
            // 隐藏顶部广告
            hideBar();
            // 初始化下载展示进度按钮
            initDownloadListBtn();
            if (currentURL.match(/https:\/\/civitai.tech\/models\//) ||currentURL.match(/https:\/\/civitai.com\/models\//)) {
                let obj = await initModel();
                // 初始化下载按钮
                initDownloadBtn(obj);
            }
        }
    }

    // Run the function when the DOM is ready
    if (window.onurlchange === null) {
        // feature is supported
        window.addEventListener('urlchange',()=>{
            const currentURL = window.location.href;
            window.location.href = currentURL
        });
    }
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        mounted();
    } else {
        window.addEventListener("DOMContentLoaded", mounted);
    }
})();