// ==UserScript==
// @name         网易云网页音频下载
// @namespace    http://tampermonkey.net/
// @version      2025-04-18
// @description  从网易云网页上下载m4a音频文件，但音质较差。在点击播放后右侧会出现一个按钮，点击进入新页面下载。
// @author       https://github.com/madderscientist
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533227/%E7%BD%91%E6%98%93%E4%BA%91%E7%BD%91%E9%A1%B5%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/533227/%E7%BD%91%E6%98%93%E4%BA%91%E7%BD%91%E9%A1%B5%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查当前网页的 URL 是否包含 daolnwod name 和 src 参数
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('daolnwod')) {
        let name = urlParams.get('name');
        let src = urlParams.get('src');
        if (!(name && src)) throw new Error("缺少name和src属性");

        // 对内容解码，比如空格的&nbsp;替换为' '
        const decodeDiv = document.createElement('div');
        const decodeHTML = (str) => {
            decodeDiv.innerHTML = str;
            let decodedString = decodeDiv.textContent || decodeDiv.innerText;
            return decodedString;
        }
        name = decodeHTML(name);
        src = decodeHTML(src);

        document.body.innerHTML = `<h1>下载${name}中，请稍等……</h1>`;

        // 用fetch才能修改文件名。直接点击的话文件名不对的
        fetch(src).then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.blob();
        }).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }).catch(error => {
            alert("下载失败", error);
        });
        return; // 直接返回，不再注入后面的代码
    }

    // 判断当前网页是否是 music.163.com
    if (!window.location.hostname.includes('music.163.com')) return;

    // 经测试网易云音乐使用的是document.createElement("audio")，且创建于网页加载时【另外一种方法是new Audio()】
    // 下面对其进行注入，以获取audio对象 为了赶在最前面执行，所以使用document-start
    console.log("网易云音乐注入");
    function getAudioName(mode = 0b11) {
        // 获取网易云音乐的音频名称
        const as = document.querySelector('.play').querySelectorAll('a');
        switch (mode) {
            case 0b11:
                return `${as[1].innerText} - ${as[0].innerText}`;
            case 0b10:
                return as[1].innerText;
            case 0b01:
                return as[0].innerText;
            default:
                return "download"
        }
    }

    let btn = null;
    function createAudioBtn(HTMLaudio) {
        if (btn) return;
        btn = document.createElement('button');
        btn.innerText = '下载音频';
        btn.id = 'hacker';
        document.body.appendChild(btn);
        btn.audio = HTMLaudio;
        btn.addEventListener('click', function () {
            const audioSrc = this.audio.src;
            if (audioSrc) {
                // 从音频源中提取文件后缀
                const audioExtension = audioSrc.split('.').pop().split('?')[0];
                if (!audioExtension || audioExtension.length > 4) audioExtension = 'mp3';
                const filename = `${getAudioName()}.${audioExtension}`;
                console.log("音频地址:", audioSrc, "音频名称:", filename);
                // 获取根域名 一般含有music，所以匹配的域名加入了music
                const urlObj = new URL(audioSrc);
                const rootDomainWithProtocol = `${urlObj.protocol}//${urlObj.hostname}`;
                // 在新标签页中访问根域名，并传参 用daolnwod标识
                const newTabUrl = `${rootDomainWithProtocol}?daolnwod&name=${encodeURIComponent(filename)}&src=${encodeURIComponent(audioSrc)}`;
                window.open(newTabUrl, '_blank');
            } else {
                alert('音频源未找到');
            }
        });
    }

    // 保存原始的 document.createElement 方法
    const originalCreateElement = document.createElement;
    // 钩子函数
    document.createElement = function (tagName, ...args) {
        // 调用原始的 createElement 方法
        const element = originalCreateElement.call(document, tagName, ...args);
        // 如果创建的是 <audio> 元素，执行自定义处理逻辑
        if (tagName.toLowerCase() === "audio") {
            console.log('<audio> 元素被创建，正在执行自定义钩子函数');
            element.addEventListener('loadeddata', function () {
                console.log('检测到音频加载', 'audio loadeddata', element.src);
                createAudioBtn(element);
            });
        }
        return element;
    };

    // 定义悬浮窗样式
    var style = document.createElement('style');
    style.innerHTML = `#hacker {
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background-color: red;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        z-index: 114514;
        border-radius: 8px 0 0 8px;
    }`;
    document.head.appendChild(style);
})();