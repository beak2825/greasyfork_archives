// ==UserScript==
// @name         爱奇艺自动脚本
// @license      GPL-3.0-only
// @namespace    http://tampermonkey.net/
// @description  爱奇艺清流下载的自动化
// @author       TSCats
// @version      1.1.2
// @match        *://116.211.227.43/*
// @match        *://iqiyi.joyutech.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/494991/%E7%88%B1%E5%A5%87%E8%89%BA%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/494991/%E7%88%B1%E5%A5%87%E8%89%BA%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const baseUrl = "http://127.0.0.1:3001"
    let btnIndex = 0;
    let host = window.location.host;
    let urlParamsObject = {};
    let isIndexPage = false;
    let isVideoPage = false;
    let isStartAuto = false;
    let isAutoEnd = false;
    let isBetterUrl = false;

    let downloadMergeSwitch = true;
    let downloadTsSwitch = true;
    // 中国移动
    let isChinaMobile = false;
    // 中国电信
    let isChinaTelecom = false;
    // 公网访问
    let isPublic = false;

    let videoEle = null;
    // 播放倍速
    let playbackRate = 8;

    let timer = {
        timer1:null
    };
    let xlsxData = null;

    if(host === "iqiyi.joyutech.com:8104"){
        isIndexPage = true;
    }

    if(host === "116.211.227.43"){
        isVideoPage = true;
    }

    window.location.search
        .substring(1) // 去掉开头的问号
        .split('&') // 分割成键值对数组
        .forEach(function(pair) {
            var keyValue = pair.split('=');
            urlParamsObject[keyValue[0]] = decodeURIComponent(keyValue[1]); // 解码并存储到对象中
        });


        // index页面-------
        function createBtn(){
            let box = document.createElement("div");

            let htmlStr = `
    <div style="z-index: 1000; background: white; width: 800px; height: 200px; padding: 24px; color: #5e6d82; box-shadow: rgba(232, 237, 250, 0.6) 0px 0px 8px 0px, rgba(232, 237, 250, 0.5) 0px 2px 4px 0px; position: fixed; top: 365px; left: 50%; transform: translate(-50%, 0px);">
        <div>
            1.选择网络
            <button id="updateBtn5">电信网络（一命呜呼了）</button>
            <button id="updateBtn6">移动新网络</button>
            <button id="updateBtn7">新公网</button>
        </div>
        <div style="width: 1px;height: 1px;padding: 10px 0;"></div>
        <div>
            2.上传xlsx数据或者在中间填入数据
            <input id="uploadInput" type="file" name="file" accept=".xlsx,.xls" id="fileInput" style="display: none;">
            <button id="uploadButton">上传文件</button>
        </div>
        <div style="width: 1px;height: 1px;padding: 10px 0;"></div>
        <div>
            3.点击开始自动化
            <button id="startButton">点击开始自动化</button>
        </div>
        <div style="width: 90%;height: 1px;background-color: #dcdfe6;margin: 10px 0;"></div>
        <div>
            插件更新
            <button id="monkeyUp1">更新自动化插件</button>
            <button id="monkeyUp2">更新下载插件</button>
        </div>
    </div>`;

            box.innerHTML = htmlStr;
            document.body.appendChild(box);

        // 电信网络按钮
        let updateBtn5 = document.getElementById('updateBtn5');
        NomlClass(updateBtn5);
        updateBtn5.onclick = function () {
            updateNetwork('ChinaTelecom');
        }
        // 移动网络按钮
        let updateBtn6 = document.getElementById('updateBtn6');
        NomlClass(updateBtn6);
        updateBtn6.onclick = function () {
            updateNetwork('ChinaMobile');
        }
        
        // 公网网络按钮
        let updateBtn7 = document.getElementById('updateBtn7');
        NomlClass(updateBtn7);
        updateBtn7.onclick = function () {
            updateNetwork('Public');
        }
        
        // 上传按钮
        let uploadInput = document.getElementById('uploadInput');
        let uploadButton = document.getElementById('uploadButton');
        NomlClass(uploadButton);
        uploadButton.addEventListener('click', function() {
            // 点击按钮时，触发文件输入字段的点击事件
            uploadInput.click();
        });

        uploadInput.addEventListener('change', function() {
            // 选择文件后，可以在这里添加文件检查逻辑
            if (this.files && this.files[0]) {
                // 这里可以添加文件类型或大小的检查
                const formData = new FormData();
                formData.append('file', this.files[0]); // 添加文件到FormData对象
    
                // 使用fetch API发送文件到服务器
                fetch(baseUrl+'/analysisXlsx', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    xlsxData = data.data;
                    // 这里可以添加上传成功后的操作
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // 这里可以添加上传失败后的操作
                });
            }
        });

        // 自动化按钮
        let startButton = document.getElementById('startButton');
        NomlClass(startButton);
        startButton.onclick = function(){
            if(isStartAuto){
                alert('已经开始自动化了，请勿重复点击');
                return;
            }
            startToAuto();
        
            NomlClass(startButton,'#67c23a');
        }

        // 更新更新自动化插件
        let monkeyUp1 = document.getElementById('monkeyUp1');
        NomlClass(monkeyUp1);
        monkeyUp1.onclick = function () {
            window.open('https://greasyfork.org/zh-CN/scripts/494991-%E7%88%B1%E5%A5%87%E8%89%BA%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC','_blank');
        }

        // 更新下载插件
        let monkeyUp2 = document.getElementById('monkeyUp2');
        NomlClass(monkeyUp2);
        monkeyUp2.onclick = function () {
            window.open('https://greasyfork.org/zh-CN/scripts/494992-%E7%88%B1%E5%A5%87%E8%89%BA%E6%B8%85%E6%B5%81%E4%B8%8B%E8%BD%BD','_blank');
        }


        }

        function updateNetwork(str){
            let updateBtn5 = document.getElementById('updateBtn5');
            let updateBtn6 = document.getElementById('updateBtn6');
            let updateBtn7 = document.getElementById('updateBtn7');
            if (str === 'ChinaTelecom'){
                isChinaTelecom = true;
                isChinaMobile = false;
                isPublic = false;
                // updateBtn5.style.background = 'green';
                // updateBtn6.style.background = 'red';
                // updateBtn7.style.background = 'red';
                NomlClass(updateBtn5,'#67c23a');
                NomlClass(updateBtn6,'#f56c6c');
                NomlClass(updateBtn7,'#f56c6c');
            }else if (str === 'ChinaMobile'){
                isChinaMobile = true;
                isChinaTelecom = false;
                isPublic = false;
                // updateBtn5.style.background = 'red';
                // updateBtn6.style.background = 'green';
                // updateBtn7.style.background = 'red';
                NomlClass(updateBtn5,'#f56c6c');
                NomlClass(updateBtn6,'#67c23a');
                NomlClass(updateBtn7,'#f56c6c');
            }else if (str === 'Public'){
                isPublic = true;
                isChinaMobile = false;
                isChinaTelecom = false;
                // updateBtn5.style.background = 'red';
                // updateBtn6.style.background = 'red';
                // updateBtn7.style.background = 'green';
                NomlClass(updateBtn5,'#f56c6c');
                NomlClass(updateBtn6,'#f56c6c');
                NomlClass(updateBtn7,'#67c23a');
            }
        }

        // 第一次进入开始后就自动点击第一次
        function firstClick (){
            setTimeout(() => {
                toClickBtn();
            }, 5000);
        }

        function toClickBtn() {
            let has = false;
            let btns = document.getElementsByTagName('button');
            btnIndex++;
            for(let i=0;i<btns.length;i++){
                if(btns[i].children.length <= 0){
                    continue;
                }
                console.log(btns[i].children[0].innerHTML,btnIndex);
                let str = btns[i].children[0].innerHTML;
                if (str === (btnIndex+'')){
                    btns[i].click();
                    has = true;
                    break;
                }
            }
            if(!has){
                isAutoEnd = true;
                alert('是不是没有准备好，或者已经所有节目跑完了');
            }
        }

        function setIndexEvent(){
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') {
                    if(!isStartAuto)return;
                    if(isAutoEnd){
                        return;
                    }
                    console.log('回到index页面，执行按钮');
                    setTimeout(() => {
                        toClickBtn();
                    }, 3000);
                } else {
                    console.log('页面变为不可见，可能是用户切换到了其他标签页或最小化了浏览器');
                }
            });
        }


        function betterStr(b){

            // 办公室电信网络（不行了）
            // http://192.168.1.192
            // 办公室移动网络（新的事1.192，  旧的是，3.6）
            // http://192.168.1.192
            // 固定ip，可公网访问（新的是120.196.79.237， 旧的是120.236.117.120）
            // http://120.196.79.237:18080
            var a = 'http://192.168.3.6/sde/iqiyi/video';
            if (isPublic){
                a = 'http://120.196.79.237:18080/sde/iqiyi/video';
            }else if (isChinaTelecom){
                // 不用了
                a = 'http://192.168.1.192/sde/iqiyi/video';
            }else if (isChinaMobile){
                a = 'http://192.168.1.192/sde/iqiyi/video';
            }
            // 从b中提取hash值用于创建新的目录和文件名
            var hash = b.split('_')[1]; // 移除".tar"得到hash值
            var a1 = b.split('/');
            a1.pop();
            var a2 = a1.join('/');
            // console.log(a2)
            // 构建c字符串
            var c = a + a2 + '/' + hash + '/' + hash + ".m3u8";

            return c;
        }

        function updateInput(){
            let textarea = document.getElementsByTagName('textarea')[0];
            let value = textarea.value;
            if (xlsxData){
                xlsxData.forEach(item=>{
                    if (!item.download)return;
                    value += (item.download+'\n');
                });
            }
            value = value.replace(/[\r\n]+/g, '');
            let arr = value.split('.tar');
            let str = '';
            arr.forEach((item)=>{
                if(!item)return;
                str += (betterStr(item)+'\n');
            });
            textarea.value = str;
            // 这里是为了触发vue的双向绑定，不然他不会更新数据
            var event = new Event('input', { bubbles: true }); // 创建input事件
            textarea.dispatchEvent(event); // 触发事件
            isBetterUrl = true;
        }

        function clickMore(){
            let btns = document.getElementsByTagName('button');
            for(let i=0;i<btns.length;i++){
                if(btns[i].children.length <= 0){
                    continue;
                }

                let str = btns[i].children[0].innerHTML;
                if (str === ('批量播控地址播放')){
                    btns[i].click();
                    break;
                }
            }
            // 批量播控地址播放
        }


        function NomlClass (ele,color){
            color = color || '#409eff';
            ele.style.padding = '9px 15px';
            ele.style.backgroundColor = color;
            ele.style.border = `1px solid ${color}`;
            ele.style.outline = 'none';
            ele.style.color = 'white';
            ele.style.borderRadius = '3px';
        }

        function indexPageToDo (){
            if(!isBetterUrl){
                updateInput();
                clickMore();
            }
            firstClick();
            setIndexEvent();
        }


        // video页面-------


        // 设置videos事件
        function setVideoEvnet() {
            // 如果视频1分钟都不出来就直接关掉，进行下一个
            timer.timer1 = setTimeout(() => {
                window.close();
            }, 60000);
            videoEle = document.getElementsByTagName('video')[0];
            // 检查视频是否已加载元数据，因为duration属性在元数据加载完毕后才可用
            videoEle.addEventListener('loadedmetadata', function() {
                videoEle.muted = true;
                clearTimeout(timer.timer1);
                // videoEle.playbackRate = playbackRate;
                setTimeout(() => {
                    videoEle.play();
                    checkVideoState();
                }, 2000);
            });
        }

        async function getDownloadState(cb){
            fetch(baseUrl+'/downloadState')
                .then(response => {
                    return response.json(); // 假设响应内容是JSON格式
                })
                .then(data => {
                    cb&&cb(data);
                });
        }

        async function getDownloadSwitch(cb){
            fetch(baseUrl+'/getDownloadSwitch')
                .then(response => {
                    return response.json(); // 假设响应内容是JSON格式
                })
                .then(data => {
                    cb&&cb(data);
                });
        }

        // 检查播放状态
        function checkVideoState (){
            setInterval(() => {
                getDownloadSwitch((switchData)=>{
                    // console.log('switchData',switchData);
                    downloadMergeSwitch = switchData.downloadMergeSwitch;
                    downloadTsSwitch = switchData.downloadTsSwitch;
                    getDownloadState(function(res){
                        console.log('res',res,{downloadMergeSwitch,downloadTsSwitch});
                        if(downloadMergeSwitch === res.downloadState&&downloadTsSwitch === res.downloadTsState){
                            window.close();
                        }
                    });
                });
                // if(videoEle.ended){
                //     setTimeout(() => {
                //         window.close();
                //     }, 3000);
                // }
            }, 3000);
        }

        function videoPageToDo (){
            console.log('播放页喔');
            setVideoEvnet();
            // checkVideoState();
        }

        function updateDownloadSwitch(val){
            fetch(baseUrl+'/setDownloadSwitch', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    downloadMergeSwitch,
                    downloadTsSwitch
                })
              })
              .then(response => response.json())
              .then(data => console.log('Success:', data))
              .catch((error) => console.error('Error:', error));
        }

        // 开始自动化
        function startToAuto() {
            console.log('开始自动化');
            isStartAuto = true;
            if(isIndexPage){
                indexPageToDo();
            }else if(isVideoPage){
                videoPageToDo();
            }
        }

        if(isIndexPage){
            createBtn();
            updateNetwork('ChinaMobile');
            document.getElementById('updateBtn5').style.display = 'none';
        }else if(isVideoPage){
            console.log('准备--');
            startToAuto();
        }


})();
