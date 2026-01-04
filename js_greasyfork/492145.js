// ==UserScript==
// @name         中软作业考试自动答题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动选择页面中的某个选项
// @author       Your Name
// @match        https://online.zretc.net/course/student/study/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492145/%E4%B8%AD%E8%BD%AF%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/492145/%E4%B8%AD%E8%BD%AF%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==



function requests(zretcToken,homeworkId){
  // API的URL
const api_url = `https://api.zretc.net/homework/homeworks/${homeworkId}/detail-objective-list`;

// 假设您已经有了一个有效的Zretc-Token
//zretcToken = 'db3c62eb-607b-43b4-8a6c-640f98e14b2d'; // 请替换为您的实际令牌

// 创建一个包含自定义请求头的对象
const customHeaders = {
    // 'Accept': 'application/json, text/plain, */*',
    // 'Accept-Encoding': 'gzip, deflate, br, zstd',
    // 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    // 'Connection': 'keep-alive',
    // 'Host': 'api.zretc.net',
    // 'Origin': 'https://online.zretc.net',
    // 'Referer': 'https://online.zretc.net/',
    // 'Sec-Fetch-Dest': 'empty',
    // 'Sec-Fetch-Mode': 'cors',
    // 'Sec-Fetch-Site': 'same-site',
    // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    // 'X-Locale': 'zh_CN',
    // 'X-Requested-With': 'XMLHttpRequest',
    // 'async': 'true',
    // 'crossDomain': 'true',
    // 'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    // 'sec-ch-ua-mobile': '?0',
    // 'sec-ch-ua-platform': '"Windows"',
    // 'withCredentials': 'true',
    'Zretc-Token': zretcToken // 添加Zretc-Token请求头
};
var ins = {
    A:0,
    B:1,
    C:2,
    D:3
}
// 发起GET请求
fetch(api_url, {
    method: 'GET',
    headers: customHeaders
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        //console.log(data); // 打印解析后的数据
        console.log("开始打印试题信息")
        console.log(data.data.contentObjDTOList)
        var obj = data.data.contentObjDTOList;
        //bt(data.data.contentObjDTOList)
        if(document.querySelectorAll("span.item")!=null){
            var spans = document.querySelectorAll("span.item");
            console.log(spans)
        let flag = 0;
        var j = 0;
        for (let key in obj) {
            let arrs = obj[key].answer.split("")
            for(let i=0;i<arrs.length;i++){
                //console.log("i的值是"+i)
                //console.log("本题一共要点"+arrs.length)
                console.log(arrs[i])
                //console.log(spans[flag+ins[arrs[i]]])
                //console.log(flag)
                //console.log(spans[ins[arrs[i]]])
                //console.log("开始第"+j+"次点击")
                spans[flag+ins[arrs[i]]].click()
                //console.log("第"+j+"次点击 点击成功")
                j++
            }
            //console.log("开始下一题")
            //console.log(arrs)
            //console.log("ans is    "+obj[key].answer)
            //spans[flag+ins[obj[key].answer]].click();
            //console.log("几个选项????"+obj[key].questionOptions.lenth)
            flag+=obj[key].questionOptions.length;
        }
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}



(function() {
    'use strict';

    // 创建一个新的div元素作为容器
    let container = document.createElement('div');
    container.style.position = 'absolute'; // 绝对位置
    container.style.padding = '10px'; // 添加一些内边距
    container.style.backgroundColor = 'white'; // 设置背景颜色
    container.style.border = '1px solid black'; // 添加边框
    container.style.zIndex = '10000'; // 设置较高的层级以确保显示在顶部
    container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; // 添加阴影效果

    // 使容器可拖动
    let dragging = false;
    let dragStartX, dragStartY;
    const handleMouseDown = function(e) {
        dragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        container.style.cursor = 'grabbing';
    };
    const handleMouseMove = function(e) {
        if (!dragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        const newX = container.offsetLeft + dx;
        const newY = container.offsetTop + dy;
        container.style.left = newX + 'px';
        container.style.top = newY + 'px';
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    };
    const handleMouseUp = function() {
        dragging = false;
        container.style.cursor = 'grab';
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 创建Zretc-Token输入框
    const zretcTokenInput = document.createElement('input');
    zretcTokenInput.type = 'text';
    zretcTokenInput.placeholder = '请输入Zretc-Token';
    zretcTokenInput.style.width = '200px'; // 设置输入框宽度

    // 创建homeworkId输入框
    const homeworkIdInput = document.createElement('input');
    homeworkIdInput.type = 'text';
    homeworkIdInput.placeholder = '请输入homeworkId';
    homeworkIdInput.style.width = '200px'; // 设置输入框宽度

    // 创建一个按钮
    const button = document.createElement('button');
    button.textContent = '输出';
    button.onclick = function() {
        const zretcToken = zretcTokenInput.value;
        const homeworkId = homeworkIdInput.value;
        console.log('Zretc-Token:', zretcToken);
        console.log('homeworkId:', homeworkId);
        requests(zretcToken,homeworkId);

    };

    // 将输入框和按钮添加到容器中
    container.appendChild(zretcTokenInput);
    container.appendChild(homeworkIdInput);
    container.appendChild(button);

    // 将容器添加到body元素中，并设置初始位置
    document.body.appendChild(container);
    window.addEventListener('load', function() {
        container.style.left = (window.innerWidth / 2 - 100) + 'px'; // 初始位置在屏幕中央偏左
        container.style.top = (window.innerHeight / 2 - 50) + 'px'; // 初始位置在屏幕中央偏上
    });
})();
