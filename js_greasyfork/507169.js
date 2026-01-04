// ==UserScript==
// @name         自动关闭MissAv的广告
// @name:zh-TW   自动关闭MissAv的广告
// @name:ja      自动关闭MissAv的广告
// @name:ko      自动关闭MissAv的广告
// @name:ru      AutoCloseMissAvads
// @name:de      AutoCloseMissAvads
// @name:es      AutoCloseMissAvads
// @name:fr      AutoCloseMissAvads
// @name:it      AutoCloseMissAvads
// @name:en      AutoCloseMissAvads
// @description        自动关闭MissAv.com几乎所有的广告
// @description:en     Automatically turn off almost all ads on MissAv.com
// @description:zh-TW  自动关闭MissAv.com几乎所有的广告
// @description:ja     MissAv.com 上のほぼすべての広告を自動的に閉じる
// @description:ko     MissAv.com의 거의 모든 광고를 자동으로 닫습니다.
// @description:ru     Automatically turn off almost all ads on MissAv.com
// @description:de     Automatically turn off almost all ads on MissAv.com
// @description:es     Automatically turn off almost all ads on MissAv.com
// @description:fr     Automatically turn off almost all ads on MissAv.com
// @description:it     Automatically turn off almost all ads on MissAv.com

// @version      1.1.7
// @namespace    https://github.com/juzizhen/AutoCloseMissAvads
// @icon         data:image/x-icon;base64,AAABAAMAEBAAAAEAIABoBAAANgAAACAgAAABACAAKBEAAJ4EAAAwMAAAAQAgAGgmAADGFQAAKAAAABAAAAAgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHY/oxi2H6mIxi+9qNYvz6jWL8+oxi+9qLYfqYh2P6MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBm/wqMYfqbjmL+/Y5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v2MYfqbgGb/CgAAAAAAAAAAAAAAAIBm/wqMYvvBjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/4xi+8GAZv8KAAAAAAAAAACMYfqbjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jGH6mwAAAACHY/oxjmL+/Y5i/v+OYv7/jmL+/5Jo/v+ylf3/kGX+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v2HY/oxi2H6mI5i/v+OYv7/jmL+/45i/v+qi/v//////+vk/v+ri/3/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/i2H6mIxi+9qOYv7/jmL+/45i/v+OYv7/q4z7/////////////////9jK/f+bdP3/jmL+/45i/v+OYv7/jmL+/4xi+9qNYvz6jmL+/45i/v+OYv7/jmL+/6uM+///////////////////////+vj//7ed/f+OYv7/jmL+/45i/v+NYvz6jWL8+o5i/v+OYv7/jmL+/45i/v+rjPv///////////////////////n3/v+2mvz/jmL+/45i/v+OYv7/jWL8+oxi+9qOYv7/jmL+/45i/v+OYv7/q4z7/////////////////9fI/f+ac/3/jmL+/45i/v+OYv7/jmL+/4xi+9qLYfqYjmL+/45i/v+OYv7/jmL+/6qL+///////6uL+/6iI/f+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+LYfqYh2P6MY5i/v2OYv7/jmL+/45i/v+SaP7/sZP+/49k/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv79h2P6MQAAAACMYfqbjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i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/P+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/h2LuW4ti+Z6OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/yLb4/////////////////////////////f3//9PD/P+Ycvv/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+LYvmeimL2zY5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v/Itvj///////////////////////////////////////f1/v+/qPr/kWb+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/4pi9s2KYvfqjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/8i2+P/////////////////////////////////////////////////q4/3/q4z8/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/imL36o5h/f6OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/yLb4///////////////////////////////////////////////////////+/v//pob7/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYf3+jmH9/o5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v/Itvj///////////////////////////////////////////////////////38/v+kg/r/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45h/f6KYvfqjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/8i2+P/////////////////////////////////////////////////m3/z/p4f7/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/imL36opi9s2OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/yLb4////////////////////////////////////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3SYAAAAAAAAAAAAAAABtbdsHiWPzm45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/j2T+/6SD/P+oiPv/k2r9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/4lj85ttbdsHAAAAAAAAAACCZOYzjWL84o5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/uqL6//Tw/v/18f7/3NH6/6SE+f+PY/7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/41i/OKCZOYzAAAAAFVV/wOHY/R3jWL9+Y5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+RaPr/5Nz7//////////////////n3/v/Gsfr/m3T9/49j/f+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/41i/fmHY/R3VVX/A4Bj4xKKYvizjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////+/f//5dz9/7ui+/+Xb/z/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+KYvizgGPjEoNg6iWKYvfjjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6//////////////////////////////////r5/v/h2Pv/qIj8/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+KYvfjg2DqJYFi7FGOYv76jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6////////////////////////////////////////////+vn+/8m3+f+cd/z/j2T9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv76gWLsUYVi7oqOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6//////////////////////////////////////////////////79///o4fz/vab6/5hy+/+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/hWLuiohi9LaOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6////////////////////////////////////////////////////////////+/n+/+Xd+/+sjvr/j2T+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGL0tohi9NWOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////////////////////////////////////////////////////5+P3/zbv6/516/P+QZf7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGL01Yhh9fGOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6/////////////////////////////////////////////////////////////////////////////////+7o/v+2m/z/kGX+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGH18Y5i/v6OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////////////////////////////////////////////////////////////////////l3vv/mHH9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/o5i/v6OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////////////////////////////////////////////////////////////////////k3Pr/mHH9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/ohh9fGOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6/////////////////////////////////////////////////////////////////////////////v7//+ji/P+yl/r/kGX9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGH18Yhi9NWOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////////////////////////////////////////////////////49v3/xrT6/5p0/f+QZP3/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGL01Yhi9LaOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6////////////////////////////////////////////////////////////+vj+/+LZ/P+oifn/j2T+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGL0toVi7oqOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6//////////////////////////////////////////////////79///l3f3/uaD6/5Zu/P+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/hWLuioFi7FGOYv76jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6////////////////////////////////////////////+fn9/8Wx+/+bdf3/j2P+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv76gWLsUYNg6iWKYvfjjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6//////////////////////////////////n3/v/azvv/oYD6/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+KYvfjg2DqJYBj4xKKYvizjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////8+/7/49r8/7ab/P+Vbfz/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i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
// @match        *://missav.com/*
// @match        *://missav.ws/*
// @match        *://tsyndicate.com/*
// @author       juzizhen
// @license      GNU GPLv3
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/507169/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADMissAv%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/507169/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADMissAv%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("脚本：关闭MissAv的弹出页面 —— 开始执行 —— 发布者 —— juzizhen —— Github:https://github.com/juzizhen/AutoCloseMissAvAD")
    var websites = ["missav.com/pop", "tsyndicate.com/api", "missav.ws/pop"];
    var url = window.location.href;
    for (var i = 0; i < websites.length; i++) {
        var regex1 = new RegExp(websites[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // 转义特殊字符
        if (regex1.test(url)) {
            var userAgent = navigator.userAgent;
            if (userAgent.indexOf("Firefox") !== -1 || userAgent.indexOf("Chrome") !== -1) {
                window.location.href = "about:blank";
            } else {
                window.opener = null;
                window.open('', '_self');
            }
            window.close();
            break;
        }
    }

    function GMmenu() {

        // 初始化菜单状态
        let addDirectTo = GM_getValue("addDirectTo", true);
        let menuID1 = GM_registerMenuCommand(`${addDirectTo ? "[✔]" : "[✖]"}显示链接直达框`, directToMenu);

        function directToMenu() {
            // 切换状态
            addDirectTo = !addDirectTo;
            GM_setValue("addDirectTo", addDirectTo);

            // 注销旧菜单并注册新菜单
            GM_unregisterMenuCommand(menuID1);
            menuID1 = GM_registerMenuCommand(`${addDirectTo ? "[✔]" : "[✖]"}显示链接直达框`, directToMenu);

            // 执行不同的功能
            if (addDirectTo) {
                add_direct();
            } else {
                remove_direct();
            }
        }

        function add_direct() {
            // 添加链接直达输入框的逻辑
            CreateSearchBox();
            moveSearchBox();
        }

        function remove_direct() {
            // 移除链接直达输入框的逻辑
            var deleteSearchBox = document.getElementById("searchbox").remove();
        }

        // 初始状态下执行一次
        if (addDirectTo) {
            add_direct();
        }
    }

    //删除括号内容(用于粘贴来源)
    if (/\(.*?\)/.test(url) == true) {
        window.location.href = url.replace(/\(.*?\)/g, '');
    }

    GMmenu();
    // CreateSearchBox();
    // moveSearchBox();

    //创建一个编辑框用于快捷粘贴访问
    function CreateSearchBox() {
        // 创建一个新的 div 元素
        var newDiv = document.createElement("div");
        // 为 div 元素添加一些属性和内容
        newDiv.id = "searchbox";
        newDiv.style.width = "350px";
        newDiv.style.height = "35px";
        newDiv.style.position = "absolute";
        newDiv.style.top = "50px";
        newDiv.style.right = "5px";
        newDiv.style.zIndex = "1000";
        newDiv.style.backgroundColor = "#FFFFFF";
        newDiv.style.borderRadius = "25px";
        newDiv.style.overflow = "hidden";
        newDiv.style.borderStyle = "solid";
        newDiv.style.userSelect = "none";
        newDiv.style.cursor = "move"
        // 将新的 div 元素添加到 body 中
        document.body.appendChild(newDiv);

        // 创建一键粘贴按钮
        var onegobutton = document.createElement('button');
        // 设置一键按钮的属性
        onegobutton.type = 'button';
        onegobutton.innerHTML = '一键粘贴';
        onegobutton.style.width = '80px';
        onegobutton.style.height = '100%';
        onegobutton.style.borderRadius = '15px';
        newDiv.appendChild(onegobutton)

        // 创建输入框
        var searchboxinput = document.createElement('input');
        // 设置输入框的属性
        searchboxinput.type = 'text';
        searchboxinput.placeholder = '请输入视频编号';
        // 设置输入框的样式
        searchboxinput.style.width = '220px';
        searchboxinput.style.height = '100%';
        searchboxinput.style.backgroundColor = 'pink';
        searchboxinput.style.fontSize = '16px';
        searchboxinput.style.boxSizing = 'border-box';
        searchboxinput.style.borderRadius = '15px';
        // 将输入框添加到容器中
        newDiv.appendChild(searchboxinput);
        //创建按钮
        var searchboxbutton = document.createElement('Button');
        searchboxbutton.style.width = '50px';
        searchboxbutton.style.height = '100%';
        searchboxbutton.style.borderRadius = '15px';
        // 设置按钮的属性
        searchboxbutton.type = 'button';
        searchboxbutton.innerHTML = '确定';
        // 将按钮添加到容器中
        newDiv.appendChild(searchboxbutton);
        // 添加事件监听器
        searchboxinput.addEventListener('input', function (event) {
            console.log('');
        });
        searchboxbutton.addEventListener('click', function () {
            var recontent = searchboxinput.value
            if (/\(.*?\)/.test(recontent) == true) {
                searchboxinput.value = recontent.replace(/\(.*?\)/g, '');
            }
            if (searchboxinput.value.length > 0) {
                // 获取网站返回码
                fetch("/" + searchboxinput.value)
                    .then(response => {
                        if (response.ok) {
                            console.log('Success:', response.status);
                            window.location.href = "/" + searchboxinput.value;
                        } else {
                            console.log('Failed:', response.status);
                            alert('视频编号错误！请重新输入！');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('视频编号错误！请重新输入！！');
                    });

            }
        });
        // 获取剪切板内容
        onegobutton.addEventListener('click', function () {
            async function getClipboardText() {
                try {
                    const text = await navigator.clipboard.readText();
                    return text;
                } catch (error) {
                    console.error('Failed to read clipboard contents:', error);
                    alert("读取剪切板内容已被禁用，请重置权限后再次尝试！");
                    return null;
                }
            }
            getClipboardText().then(text => {
                if (text) {
                    searchboxinput.value = text;
                    searchboxbutton.click();
                }
            });
        })
        // 添加回车键监听器
        searchboxinput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                searchboxbutton.click();
            }
        });
    }

    // 设置搜索框可移动
    function moveSearchBox() {
        const SearchBox = document.getElementById('searchbox');

        SearchBox.addEventListener('mousedown', (event) => {
            let shiftX = event.clientX - SearchBox.getBoundingClientRect().left;
            let shiftY = event.clientY - SearchBox.getBoundingClientRect().top;
            function moveAt(pageX, pageY) {
                SearchBox.style.left = pageX - shiftX + 'px';
                SearchBox.style.top = pageY - shiftY + 'px';
            }
            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }
            document.addEventListener('mousemove', onMouseMove);
            SearchBox.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
                SearchBox.onmouseup = null;
            });
        });
        SearchBox.ondragstart = () => false;
    }

    window.onload = function () {
        //获取所有 class 仅为 mx-auto 的元素，遍历并删除这些元素
        const mxauto = document.querySelectorAll('.mx-auto:not([class*=" "])');
        mxauto.forEach(mxauto => { mxauto.remove(); });

        setTimeout(() => { //延迟2.5s自动点击Close AD以关闭广告
            const CloseADButton1 = document.getElementsByClassName("close-button--wsOv0");
            if (CloseADButton1.length > 0) {
                CloseADButton1[0].click();
            }
            const CloseADButton2 = document.getElementsByClassName("absolute top-1 right-1 p-0.5 bg-black rounded-lg opacity-70");
            if (CloseADButton2.length > 0) {
                CloseADButton2[0].click();
            }
        }, 2500);
    };
})();
