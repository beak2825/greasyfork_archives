// ==UserScript==
// @name         Study Trainning Tools
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  自动播放网页中的视频，并自动播放下一个视频。仅供学习使用。禁止用于不合法目的，不承担连带责任。
// @author       bucishan
// @match        https://study.gsedu.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAABN9JREFUSEudln9MVWUYx7/ve37cnwjxQ0N0AgpjohkLlq00qBDt18q5Vk3w4nLljPpTuFHCqKtprTZT52xd0a3ldP7YajEooblS52w1lUlokANSIEDh/jr3nPPmey73wuFSYe92t3vf+zzP533e5/uc5xDMcOWtrs5UdfoJYcgjAup/a/J8NUNXkP8yXLTKve2uUd2cFB2L5qqwWYG+QQHtXQJ37WaUVl5rer/t3+L8IySn1O0CgXfFg2FsftGPwrywKY4vSPDF1zbsOWqHTnBQIHr91aYd3dPBpoVET79t4xhefawLxJEOFhgCsSUbMZgyCiJYYvFc21Px0yW5W6B6yXSgOEhOmds7f7buOlB9G9lztYmgcoL5kJoCpoVAxvcbvE4cbrJOCzJB+BUtnKd6P3ePIiM1AriXtfuYHbuP2rs7mz1Zk/3MkFVudqRhBAW56r3ENtm+/uEsnP5ZrrvW7KmP/hGD5JTWtG58NlhcXeH73wDuOHSHYvmmZNO1GZBFq2uLE21q65l9w7BZmAnSO0Bx/oqMtcXBGe1zo11fOnDgpLWts2V7Cf9tQHixK58JuGrK47Mor09Ez4CA1s+GTJDx+zf2M9J08wEGBZRsuS9Wmwhklbvr5I7hzMVZ8cXmmfAVF2iAGvCHF5v7J0p7+b1EXOy0lPBGNSDLnq9hvzT+ZTqNdr0dTAlCmL8QxJmIyTD+PQqdahcN8ukRO/YctxsCIFy2y5eGvYfevW2CMCUEKEEDwFe0Nsb3QYqqdX5jf6pdNMiNWw48VRWpC+H1cK0JuNwbIvVgYT+IZJ9WYefbJfT2C3EiiBlrCiDICKsSAiELCjdajboQ/gjZut5X99pzAYDpYL6bINYUQJx4bMxU08bjRk6AP2SHpgl4qNKCzmYPMSDvbPDVuZ4OgI1cB0mYBzZ2E8QxGxBtpvjH26zImK1hXpoWJwSMZ6EpGo60pRh+DQdFfvAsoyZb1vm9b7/kBzQVEERAVwEqxkl2zaNPQKZBXLgaRseNQeRm9IDSkGE3Mqri9EUHluYuxitPOqDoVmzyXEHvrdFKwhuxrDDY+vFbQchKj3FNxBIp9uTlOZyPreX5IFIS2NgFEDEF8LXidjgTstoOSbJAdBQA1AkmpoLIaTjxXQdq9l4+RvjEs8qk6+zePlBRhmwhiKY+FVK9PhuQ0wHdDygDYOE+EGoF9HHRWHKN/uYAbnPomz/xgffXuljHN1aPuJbk2iCwICQLIInmJqve50RdZREkSxKI7gejdhDRYZa96gOUbhB7Ppj/Clw7NZy/1FdpQHg26Wnoaqz1I8kpGY6UMIjEByqKoETHiR9kOJwrUFYQAKwLIpmo/ZGA48EhZ4Jas4zrHFNTUeg6E1FX9ChcAA/kaN5dbwaRmihCDN+CKs0B1UPQaUTO+0+JeGNtGeziMIizCEyJTFsOiWWlDIAIs1DR0IFzl/siHT853+jY/agqgJUFDBJTY4CoXe3+ZGytWIL7k0KANXvCPfiHUQe/noHNO9v5NZ3rbPE8wg3ixu/4q88G/obywsoQSos05MwnxgiQZUAAxakfKX7vW4Al2clYlptgyLqrX8K3Z+/g+PcduDssph9aUyXLYZpGi0HxOHSWCUIyAfAPX92MkSRKGNVBKAHTANYCQsYYoY1TX5H+BpEqGrrEuMUHAAAAAElFTkSuQmCC
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511959/Study%20Trainning%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/511959/Study%20Trainning%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let kpointId, trainingId;

    // 初始化工具
    // 校验是否为指定画面
    function InitTools() {
        // 要检测的链接
        const url = window.location.href;

        // 定义正则表达式
        const regex = new RegExp(
            '^https://study.gsedu.cn/#/jspx/video\\?' +
            'kpointId=[^&]+&' +  // kpointId 参数及其值
            'sourceId=[^&]+&' +  // sourceId 参数及其值
            'trainingId=[^&]+&' +  // trainingId 参数及其值
            'fileUrl=[^&]*&' +  // fileUrl 参数及其值（可选）
            'fileType=video&' +  // fileType 参数及其值
            'docName=.*$'  // docName 参数及其值
        );

        // 检测链接是否匹配
        if (regex.test(url)) {
            console.log('检测url有效！');
            // 使用正则表达式匹配 kpointId 和 trainingId
            const matchKpointId = url.match(/kpointId=([^&]+)/);
            const matchTrainingId = url.match(/trainingId=([^&]+)/);

            if (matchKpointId && matchKpointId[1]) {
                kpointId = decodeURIComponent(matchKpointId[1]);
            } else {
                console.log('kpointId not found in the URL');
                return false;
            }

            if (matchTrainingId && matchTrainingId[1]) {
                trainingId = decodeURIComponent(matchTrainingId[1]);
            } else {
                console.log('trainingId not found in the URL');
                return false;
            }

            console.log('kpointId:', kpointId); // 输出: 2f8ad8b06ae446da62a467735084eac
            console.log('trainingId:', trainingId); // 输出: e527c2d3644473a96f865b4ca226a77

            // 开始观察整个文档的变化
            observer.observe(document, { childList: true, subtree: true });

            // 对于已存在的视频元素
            document.querySelectorAll('video').forEach(setupAutoPlay);

            // 显示Training 视频列表
            setTimeout(function() {
                getTrainingList(trainingId);
            }, 5000);
        } else {
            console.log('检测url无效！');
        }
    }

    // 获取当前站点的所有 cookie
    function getCookies() {
        const cookies = document.cookie.split('; ');
        const cookieObj = {};

        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            cookieObj[name] = decodeURIComponent(value);
        }
        return cookieObj;
    }

    // 获取网站请求头信息
    function getHeaders() {
        // 获取cookie 数据并格式化
        const cookie_data = document.cookie
        const siteCookies = getCookies();

        // 如果你需要特定的 cookie，可以直接访问
        const Authorization = siteCookies['Admin-Token'];

        // 定义请求头
        const headers = {
            // 'Accept': 'application/json, text/plain, */*',
            // 'Accept-Encoding': 'gzip, deflate, br, zstd',
            // 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Authorization': Authorization,
            // 'Connection': 'keep-alive',
            'Cookie': cookie_data,
            'Host': 'study.gsedu.cn',
            'Referer': 'https://study.gsedu.cn/',
            // 'Sec-Fetch-Dest': 'empty',
            // 'Sec-Fetch-Mode': 'cors',
            // 'Sec-Fetch-Site': 'same-origin',
            // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
            // 'sec-ch-ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            // 'sec-ch-ua-mobile': '?0',
            // 'sec-ch-ua-platform': 'Windows'
        };
        return headers;
    }

    // 递归函数用于遍历并筛选数据
    function filterData(data, result = []) {
        if (Array.isArray(data)) {
            for (let item of data) {
                if (item.subkpointList) {
                    filterData(item.subkpointList, result);
                } else if (item.fileType === 'video' && item.percent !== 1.0) {
                    result.push(item);
                }
            }
        }
        return result;
    }

    // 将清洗的数据转换成指定格式
    // {name:name1,kpointId:kpointId1,url:url1}
    function transformData(data) {
        return data.map(item => ({
            name: item.name,
            kpointId: item.id,
            url: `https://study.gsedu.cn/#/jspx/video?kpointId=${item.id}&sourceId=${item.sourceId}&trainingId=${item.trainingId}&fileUrl=${encodeURIComponent(item.fileUrl)}&fileType=video&docName=${encodeURIComponent(item.name)}`
        }));
    }

    // 在页面上显示数据列表
    function showTrainingList(data){
        // 创建浮动 div
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'floatingDiv';
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.top = '50%';
        floatingDiv.style.right = '10px';
        floatingDiv.style.transform = 'translateY(-50%)';
        floatingDiv.style.backgroundColor = '#f9f9f9';
        floatingDiv.style.border = '1px solid #ccc';
        floatingDiv.style.padding = '10px';
        floatingDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        floatingDiv.style.width = '200px';
        floatingDiv.style.maxHeight = '500px';
        floatingDiv.style.overflowY = 'auto'; // 设置 overflow-y 为 auto
        floatingDiv.style.zIndex = '1000'; // 确保浮动 div 在其他内容之上

        // 创建无序列表
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';
        let count = 0
        // 循环添加列表项
        data.forEach(item => {
            count+=1;
            const li = document.createElement('li');
            //li.innerHTML = `<a target="_self" href="${item.url}"><strong> ${count} </strong> ${item.name}</a>`;
            li.innerHTML = `<strong> ${count} </strong> ${item.name}`;
            li.style.padding = '5px 0';
            li.style.borderBottom = '1px solid #eee';
            if(kpointId == item.kpointId){
                li.style.color = '#ff3333';
            }
            ul.appendChild(li);
        });

        // 将无序列表添加到浮动 div
        floatingDiv.appendChild(ul);

        // 将浮动 div 添加到 body
        document.body.appendChild(floatingDiv);
    }

    // 显示提示信息
    function showPlayTips(message,delay=5000,isAutoHide=true) {
        // 创建提示信息条
        const infoBar = document.createElement('div');
        infoBar.id = 'infoBar';
        infoBar.style.position = 'fixed';
        infoBar.style.top = '0';
        infoBar.style.left = '0';
        infoBar.style.width = '100%';
        infoBar.style.height = '80px';
        infoBar.style.backgroundColor = '#00d3ff24';
        infoBar.style.color = '#000';
        infoBar.style.padding = '20px';
        infoBar.style.boxSizing = 'border-box'; // 确保 padding 不会增加元素的高度
        infoBar.style.zIndex = '1000'; // 确保提示信息条在其他内容之上
        infoBar.style.textAlign = 'center';
        infoBar.style.fontSize = '25px';
        infoBar.textContent = message;

        // 将提示信息条添加到 body
        document.body.appendChild(infoBar);

        if(isAutoHide == true){
            // 设置定时器，在 5 秒后移除提示信息条
            setTimeout(() => {
                infoBar.remove();
            }, delay); // 5000 毫秒 = 5 秒
        }
    }

    //此处用于处理课程数据
    function getTrainingList(trainingId = '',isJump = false){
        if(trainingId == '') return "";

        // 定义请求的 URL
        const url = `https://study.gsedu.cn/api/apii/management/training_kpoint/list?trainingId=${trainingId}`;

        // 定义请求头
        const headers = getHeaders();

        // 发送 GET 请求
        fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => {
            // 检查响应是否成功
            if (!response.ok) {
                console.log('请求training数据失败！');
                showPlayTips("请求training数据失败！",0,false);
            }
            // 解析 JSON 数据
            return response.json();
        })
            .then(data => {
            // 处理返回的数据
            // 调用函数并获取结果
            const filteredData = filterData(data.data);

            // 调用函数并获取结果
            const transformedData = transformData(filteredData);

            // 输出结果
            console.log(transformedData);

            // 判断是否为链接跳转
            if(isJump == true){
                if(transformedData.length > 0 && kpointId != transformedData[0].kpointId){
                    // window.location.href = transformedData[0].url;
                    window.location.assign(transformedData[0].url);
                    window.location.reload(true);
                }
            }else{
                showTrainingList(transformedData);
            }
        })
            .catch(error => {
            // 处理错误
            showPlayTips(error,0,false);
            console.error('There has been a problem with your fetch operation:', error);
        });
    }

    // 定义一个函数来设置视频自动播放
    function setupAutoPlay(video) {
        video.autoplay = true;
        video.muted = true;  // 如果需要静音播放，可以取消这行的注释
        video.loop = false;

         // 标记用户是否手动暂停了视频
        let isManuallyPaused = false;

        // 检测是否存在此元素
        if(document.querySelector('div.prism-play-btn')){
            // 排除视频窗口原生按钮点击
            document.querySelector('div.prism-play-btn').addEventListener('click', () => {
                isManuallyPaused = true;
            });
            document.querySelector('div.prism-big-play-btn').addEventListener('click', () => {
                isManuallyPaused = true;
            });
        }

        // 监听用户的暂停操作
        video.addEventListener('click', () => {
            if (video.paused) {
                isManuallyPaused = true;
                video.play();
                console.log('通过Click播放');
            } else {
                isManuallyPaused = true;
                video.pause();
                console.log('通过Click暂停');
            }
        });

        // 监听键盘空格键暂停/播放
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault(); // 防止页面滚动
                if (video.paused) {
                    isManuallyPaused = true;
                    video.play();
                    console.log('通过Space播放');
                } else {
                    isManuallyPaused = true;
                    video.pause();
                    console.log('通过Space暂停');
                }
            }
        });

        // 添加 ended 事件监听器
        video.addEventListener('ended', function() {
            // 重置标记
            isManuallyPaused = true;

            console.log("Video has ended: " + video.src);
            // 在这里可以添加额外的逻辑，例如重新播放或播放下一个视频

            // 在 10 秒后执行一个匿名函数
            showPlayTips('当前视频播放完毕，10 秒后自动播放下一个视频',10000,false);
            setTimeout(function() {
                // 发送fatch请求训练列表数据
                getTrainingList(trainingId,true);
            }, 10000);

        });

        // 监听视频的 pause 事件
        video.addEventListener('pause', () => {
            if (!isManuallyPaused &&video.ended != true) {
                // 如果不是用户手动暂停的，自动恢复播放
                video.play();
                isManuallyPaused = false;
                console.log('恢复播放');
            }
        });
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                console.log('页面visibilitychange');
                if (video.paused) {
                    isManuallyPaused = false;
                    video.play();
                    console.log('通过Visibilitychange播放');
                }
            }
        });

        if (video.paused) {
            video.play();
        }
    }

    // 监听 DOM 变化以处理动态加载的视频
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'VIDEO') {
                    setupAutoPlay(node);
                } else if (node.querySelectorAll) {  // 检查是否有子 <video> 元素
                    node.querySelectorAll('video').forEach(setupAutoPlay);
                }
            });
        });
    });


    // 初始化工具
    InitTools();

})();