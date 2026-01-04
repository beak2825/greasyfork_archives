// ==UserScript==
// @name         推特便携助手
// @namespace    http://tampermonkey.net/
// @version      27.1424
// @released     2025-10-29_11:45:29_093
// @description  在推文里插入按钮，点击按钮把推文ID发送到自己的服务端，对推文进行后续处理。（自行修改服务器地址）
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com/
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/481859/%E6%8E%A8%E7%89%B9%E4%BE%BF%E6%90%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481859/%E6%8E%A8%E7%89%B9%E4%BE%BF%E6%90%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var 域名="http://p1.policegg.asia"
域名="http://127.0.0.1"
const 推文ID正则 = /(\d{18,})/;
var mediacompleted = [];
var 服务器地址 = `${域名}:5005/tuite?password=guoxin`;
var 更新推特下载记录id地址 = `${域名}:5005/uptuiteid?password=guoxin`;
let longPressTimer;
创建样式()
function 创建样式() {
    if (!document.querySelector(".custom")) {
        const css = `

        [aria-labelledby="modal-header"] [aria-label="嵌入式视频"][data-testid="previewInterstitial"] {
            background: #040405;

        }
        [aria-label="嵌入式视频"] .r-4gszlv {
            background-size: auto 100%;
        }

        .svghover .go{
            stroke: #ff6f00;
            background-color: rgb(29 155 240 / 10%);
            border-radius: 50%;
        }
        .svghover2 .go{
            stroke: #ff6f00;
            background-color: rgb(29 155 240 / 10%);
            border-radius: 50%;
        }
        [state="eorro"] .go {
            stroke: #464646 !important;
        }
        [state="wait"] .go {
            stroke: #e5b800 !important;
        }
        [state="fail"] .go {
            stroke: #2C3227 !important;
        }
        [state="complete"] .go {
            stroke: #5CE500 !important;
        }
         [tubiao="复制图标"] .go:hover {

        }
        .svghover .go:active {
            stroke: blue;

            }
            .r-18kkkp6 {
              display: none;
          }
          .tmd-down.tmd-media.list {
            position: absolute;
            left: 0;
            padding: 0 12px 12px 12px;
            order: 99;
            color: white;
            cursor: pointer;
        }
        .tmd-down.tmd-media.like {
            cursor: pointer;
            display: flex;
            justify-content: center;
            flex: 0.5;
            flex-direction: column-reverse;
        }
        .tmd-down.tmd-media .背景 {
            border-radius: 24px;
            height: 80%;
            width: 80%;

            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-content: space-around;
            justify-content: center;
        }
        .tmd-down.tmd-media.download svg {
            width: 23px !important;
            height: 23px !important;
        }
        .tmd-down.tmd-media.download .背景:hover{
            background: #8ecdf780;
        }
        .list_sendmedia {
            position: absolute;
            right: 0;
            padding: 0 12px 12px 12px;
            order: 99;
            color: white;
            z-index: 1;
        }
        .tmd-down :hover {
            color: #ff9313;
        }
        .tmd-down svg {
            color: rgb(0, 120, 201);
        }
        .tmd-down svg:active {
            color: #017cb9;
        }
        .tmd-down.download g.download, .tmd-down.completed g.completed, .tmd-down.loading g.loading, .tmd-down.failed g.failed {
            display: unset;
        }
        .tmd-down g {
            display: none;
        }
        /* 将 transform-origin 设置为中心点 */
        .tmd-down.loading g.loading {
          transform-origin: center;
        }

        /* 定义旋转动画 */
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* 应用旋转动画到 .wait 元素 */
        .tmd-down.loading g.loading {
          animation: rotate 5s linear infinite;
        }
        .user{
            position: relative;
            height: 40px;
            padding: 0 10px 8px 10px;
        }
        .r-37j5jr{
            flex-direction: column;
        }

          `
        var style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        style.className = "custom";
        document.head.appendChild(style);
    }
}


(function () {
    'use strict';
    监测页面元素2();
    function 监测页面元素2() {
        const TMD = (function () {
            let lang, host, history, show_sensitive, is_tweetdeck;
            return {
                init: async function () {
                    let observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => this.detect(node))));
                    observer.observe(document.body, { childList: true, subtree: true });
                },
                detect: function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        处理函数(node);
                        if (node.querySelector('[data-testid="apple_sign_in_button"]')) {
                            设置登录cookie();
                        }
                        if (node.querySelector('[href="/login"]')) {
                            node.querySelector('[href="/login"]').click();
                        }
                        let listitems = node.tagName == 'LI' && node.getAttribute('role') == 'listitem' && [node] || node.tagName == 'DIV' && node.querySelectorAll('li[role="listitem"]');
                        if (listitems && listitems.length > 0) {
                            if (listitems[0]?.parentElement?.getAttribute('role') != 'list') {
                                this.addButtonToMedia2(listitems);
                            }
                        }
                    }
                },
                addButtonToMedia2: function (listitems) {
                    listitems.forEach(li => {
                        绑定按钮(li, '', true);
                    });
                },
            }
        })();
        TMD.init();
    }

    // 监测页面元素()
    function 监测页面元素() {
        var oldURL = document.URL;
        // 创建 Mutation Observer 实例
        var observer = new MutationObserver(function (mutationsList) {
            // console.log("蜀黍");
            for (var mutation of mutationsList) {
                // 遍历每个被添加的节点
                for (var addedNode of mutation.addedNodes) {
                    // 判断是否为元素节点
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        处理函数(addedNode)
                        if (addedNode.querySelector('[data-testid="apple_sign_in_button"]')) {
                            设置登录cookie()
                        }
                        if (addedNode.querySelector('[href="/login"]')) {
                            console.log(addedNode)
                            addedNode.querySelector('[href="/login"]').click();
                        }
                    }
                }
            }
        });
        // 监测整个文档树的变动
        observer.observe(document, { childList: true, subtree: true });
    }
    document.addEventListener('DOMContentLoaded', function () {
        console.log(document)
    })
    document.addEventListener('DOMContentLoaded', function () {
        console.log(document)
    });


    function 设置登录cookie() {
        var 注册 = document.querySelector('[aria-level="1"]');
        if (!注册) {
            return;
        }
        var 注册父元素 = 注册.parentElement;
        var 登录框高度 = 注册父元素.parentElement.parentElement.clientHeight - 注册父元素.parentElement.clientHeight;
        var 登录盒子 = document.createElement('div');
        登录盒子.style.height = 登录框高度 + 'px';
        登录盒子.style.top = 注册父元素.parentElement.clientHeight + 'px';
        登录盒子.style.width = 注册父元素.parentElement.clientWidth + 'px';
        登录盒子.style.position = 'absolute';
        登录盒子.style.background = 'white';
        登录盒子.style.display = 'none';
        注册父元素.parentElement.parentElement.appendChild(登录盒子)
        var 登录框 = document.createElement('textarea')
        登录框.style.height = 登录框高度 - 60 + 'px';
        console.log(注册父元素.parentElement, 注册父元素.parentElement.clientHeight + 'px')
        登录框.style.top = 注册父元素.parentElement.clientHeight + 'px';
        登录框.style.width = 注册父元素.parentElement.clientWidth - 8 + 'px';;
        登录框.className = '登录框';
        登录框.placeholder = '请在这里填写你的cookie';
        登录框.autocomplete = "off";
        登录框.spellcheck = false;
        登录盒子.appendChild(登录框);
        注册父元素.style.display = 'flex';
        注册父元素.style.flexDirection = 'row';
        注册.style.cursor = 'pointer';
        注册.style.background = 'rgb(196, 201, 204)';
        注册.style.padding = '0 5px';
        注册.style.borderRadius = '5px';
        注册.style.lineHeight = 注册.clientHeight + 'PX';
        var cookie登录 = document.createElement('h1');
        注册父元素.appendChild(cookie登录);
        cookie登录.className = 'cookie登录';
        cookie登录.textContent = 'cookie登录';
        cookie登录.style.height = 注册.clientHeight;
        cookie登录.style.margin = '0';
        cookie登录.style.background = 'rgb(196 201 204)';
        cookie登录.style.cursor = 'pointer';
        cookie登录.style.position = 'relative';
        cookie登录.style.padding = '0 5px';
        cookie登录.style.borderRadius = '5px';
        cookie登录.style.left = 注册父元素.clientWidth - 注册.clientWidth - cookie登录.clientWidth + 'px';
        var 登录按钮 = document.createElement('div');
        登录盒子.appendChild(登录按钮)
        登录按钮.className = '登录按钮';
        登录按钮.textContent = '登录按钮';
        登录按钮.style.width = '60px';
        登录按钮.style.height = '30px';
        登录按钮.style.background = 'rgb(196, 201, 204)';
        登录按钮.style.lineHeight = '30px';
        登录按钮.style.position = 'absolute';
        登录按钮.style.position = 'absolute';
        登录按钮.style.right = '0';
        登录按钮.style.padding = '0 5px';
        登录按钮.style.margin = '10px 0 0 0';
        登录按钮.style.borderRadius = '5px';
        登录按钮.style.cursor = 'pointer';
        注册.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            if (登录盒子.style.display === 'block') {
                登录盒子.style.display = 'none';
            }
        })
        cookie登录.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            if (登录盒子.style.display === 'none') {
                登录盒子.style.display = 'block';
            } else {
                登录盒子.style.display = 'none';
            }
        })
        登录按钮.addEventListener('click', function (event) {
            // 调用函数，并在请求完成后打印响应文本
            设置cookie(登录框.value)
            sendTwitterAPIRequest(function (responseText) {
                if (responseText === '403') {
                    alert('cookie错误')
                }
                var js = JSON.parse(responseText);
                if (js?.errors) {
                    var 错误内容 = js?.errors[0]?.message
                    if (错误内容) {
                        alert(错误内容)
                    }
                } else {
                    console.log(js, js.is_from_urt)
                    if (js.is_from_urt === true) {
                        location.href = 'https://x.com/'
                    }
                }
            });
        });

        function getCookieValue(cookieName) {
            var name = cookieName + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var cookieArray = decodedCookie.split(';');
            for (var i = 0; i < cookieArray.length; i++) {
                var cookie = cookieArray[i].trim();
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return "";
        }
        function sendTwitterAPIRequest(callback) {
            var xhr = new XMLHttpRequest();
            var url = "https://x.com/i/api/2/badge_count/badge_count.json?supports_ntab_urt=1";
            // 获取 ct0 的值作为 x-csrf-token
            var csrfToken = getCookieValue("ct0");

            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");

            // 设置 x-csrf-token 的值为 ct0 的值
            xhr.setRequestHeader("x-csrf-token", csrfToken);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // 将响应文本作为参数传递给回调函数
                        callback(xhr.responseText);
                    } else {
                        callback('403')
                    }
                }
            };

            xhr.send();
        }
    }

    function 设置cookie(cookieString) {
        // 设置导入cookie的域名
        var domain = ".x.com"; // 替换成你的域名
        // 将cookie字符串按分号和空格进行分割
        var cookieArray = cookieString.split(";");
        // 遍历每个cookie，设置其过期时间为一个月并导入到document.cookie中
        var expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i].split("=");
            var name = cookie[0];
            var value = cookie[1];
            document.cookie = name + "=" + value + "; expires=" + expirationDate.toUTCString() + "; path=/; domain=" + domain;
        }

    }
    function findParentWithDataE2EVid(element, findtext) {
        let currentElement = element;
        let maxTries = 14; // 最大遍历次数
        let attempts = 0;
        while (currentElement && !currentElement.getAttribute(findtext) && attempts < maxTries) {
            currentElement = currentElement.parentElement;
            // console.log(currentElement)
            attempts++;
        }
        return currentElement;
    }
    function findParentWithDataE2EVid2(element, findtext) {
        let currentElement = element;
        let maxTries = 14; // 最大遍历次数
        let attempts = 0;
        while (currentElement && !currentElement.querySelector(findtext) && attempts < maxTries) {
            currentElement = currentElement.parentElement;
            // console.log(currentElement)
            attempts++;
        }
        return currentElement;
    }
    function 处理函数(addedNode) {
        console.log(addedNode)
        if (addedNode.getAttribute('data-testid') === 'cellInnerDiv') {
            if (addedNode.parentElement.parentElement.parentElement.parentElement.getAttribute('data-viewportview') === "true") {
                let 聊天页 = addedNode.querySelector(" section > div > div > div:nth-child(2) > div ");
                if (聊天页) {
                    旋转(聊天页)
                }

            }
        }
        if (addedNode.querySelector('img') || addedNode.tagName === 'IMG' &addedNode.getAttribute('alt')!='嵌入式视频') {
            // console.log(addedNode, addedNode.innerHTML)
            if (addedNode.parentElement.getAttribute('aria-label') === '图像' & findParentWithDataE2EVid(addedNode, 'aria-labelledby')?.getAttribute('aria-labelledby') === 'modal-header') {
                console.log(addedNode)
                let 二级 = addedNode.parentElement.parentElement.parentElement.parentElement.parentElement;
                let modal = 二级.parentElement;
                图片增强(modal, 二级, addedNode);
            }
        }
        let dismiss = addedNode.querySelector('[role="list"]');
        if (dismiss) {
            // showToast('警察蜀黍')
            if (addedNode.querySelector('.lastScrollTop')) return;
            addedNode.classList.add('lastScrollTop')
            let aElement = addedNode.querySelector('[aria-label="上一张幻灯片"]');
            let bElement = addedNode.querySelector('[aria-label="下一张幻灯片"]');
            let lastScrollTop = 0;
            dismiss.addEventListener('scroll', function () {
                const st = scrollTarget.scrollTop;
                if (st < lastScrollTop) {
                    // 向上滚动
                    console.log('向上滚动');
                    aElement.addEventListener('click', function () {
                        console.log('点击了 A 元素');
                        // 这里添加点击 A 元素后的具体逻辑
                    });
                } else {
                    // 向下滚动
                    console.log('向下滚动');


                    bElement.addEventListener('click', function () {
                        console.log('点击了 B 元素');
                        // 这里添加点击 B 元素后的具体逻辑
                    });
                }
                lastScrollTop = st <= 0 ? 0 : st;
            });
        }
        let mod = document.querySelector('#modal-header .r-poiln3');
        if (mod) addid(mod);
        mod = document.querySelector('[role="main"] [role="tablist"]');
        if (mod) addid(mod);
        mod = document.querySelector('[data-testid="settings"]')?.parentElement?.parentElement;
        if (mod) addid(mod);
        hide(addedNode);
        var originalElement = document.querySelector('[data-testid="tweetButton"]');
        if (originalElement) {
            // 复制原始元素
            if (!document.querySelector('.远程回复')) {
                var clonedElement = originalElement.cloneNode(true); // 参数为true表示连同子元素一起复制
                originalElement.parentElement.appendChild(clonedElement)
                clonedElement.classList.add('远程回复');
                clonedElement.querySelectorAll('span')[1].textContent = '回复2'
                clonedElement.addEventListener('click', function (event) {
                    var rest_id = '';
                    var tweetText = document.querySelector('[data-testid="tweetText"]').textContent;
                    if (window.q_twitterjson2) {
                        var twitterid = window.q_twitterjson2?.data?.tweetResult?.result?.legacy?.conversation_id_str;
                        var full_text = window.q_twitterjson2?.data?.tweetResult?.result?.legacy?.full_text;
                        if (full_text?.includes(tweetText)) {
                            q_twitterid = twitterid;
                            rest_id = window.q_twitterjson2?.data?.tweetResult?.result?.rest_id;
                            console.log('回复id', window.q_twitterjson2)
                        }
                    }
                    //发送信息()
                    if (!rest_id) {
                        for (let i = 0; i < q_twitterjson.length; i++) {
                            var comment = q_twitterjson[i].data?.threaded_conversation_with_injections_v2?.instructions?.[0]?.entries;
                            for (let i2 = 0; i2 < comment.length; i2++) {
                                var full_text = comment[i2].content?.items?.[0]?.item?.itemContent?.tweet_results?.result?.legacy?.full_text;
                                console.log(full_text);
                                if (full_text?.includes(tweetText)) {
                                    q_twitterid = twitterid;
                                    rest_id = comment[i2].content?.items?.[0]?.item?.itemContent?.tweet_results?.result?.rest_id;

                                    console.log('回复id2', rest_id)
                                }
                            }
                        }
                    }
                    console.log(rest_id)
                });
            }
        }
        let 关注 = addedNode.querySelector('div[aria-label="私信"]');
        if (关注) {
            绑定按钮(关注.parentElement, true)
        }
        let userActions = addedNode.querySelector('[data-testid="userActions"]');
        if (userActions) {
            绑定按钮(userActions.parentElement, true)
        }
        document.querySelectorAll('[data-testid="userActions"]')
        let 书签 = addedNode.querySelectorAll('[data-testid="bookmark"]')
        if (书签.length > 0) {
            for (let index = 0; index < 书签.length; index++) {
                //console.log(书签[index].parentElement)
                书签[index].parentElement.remove();
            }
        }
        let 帖子分析 = addedNode.querySelectorAll('[aria-label]')
        if (帖子分析.length > 0) {
            for (let index = 0; index < 帖子分析.length; index++) {
                if (帖子分析[index].getAttribute('aria-label').includes('帖子分析')) {
                    //console.log(帖子分析[index].parentElement)
                    帖子分析[index].parentElement.remove();
                }

            }
        }
        var 推文元素 = addedNode.querySelector('[role="group"][aria-label*="喜欢"]');
        var sendmediaElement = addedNode.querySelector(".sendmedia");
        if (推文元素) {
            if (sendmediaElement === null) {
                绑定按钮(推文元素);
            }
        } else {
            let layers = addedNode.querySelector('[data-testid="FloatingActionButtonBase"]')
            if (layers) {
                // layers.remove()
                layers.style.display = "none";
            } else {
                var 推文元素 = addedNode.querySelector('[role="button"][aria-label*="喜欢"]');
                var sendmediaElement = addedNode.querySelector(".sendmedia");
                if (推文元素) {
                    if (sendmediaElement === null) {
                        绑定按钮(推文元素.parentElement?.parentElement);
                    }
                } else {
                    var 推文元素 = addedNode.querySelector('[role="group"] [aria-label*="喜欢"]');
                    var sendmediaElement = addedNode.querySelector(".sendmedia");
                    if (推文元素) {
                        if (sendmediaElement === null) {
                            绑定按钮(addedNode.querySelector('[role="group"] [aria-label*="喜欢"]').parentElement?.parentElement);
                        }
                    }
                }
            }
        }
        var imgElements = addedNode.querySelectorAll('img');
        监测img(imgElements);
    }

    function 监测img(imgElements) {
        imgElements.forEach(function (img) {
            img.addEventListener('error', function () {
                let re = img.getAttribute('retryCount');
                let retryCount;
                if (re) {

                    retryCount = parseInt(re) + 1;
                } else {
                    retryCount = 1;
                }
                if (retryCount < 4) {
                    this.src = this.src;
                }
                img.setAttribute("retryCount", retryCount);
                console.log('警察蜀黍', this.src)
            });
        });
    }
    function 旋转(聊天页) {
        document.querySelector('.Refresh')?.remove();
        document.querySelector('.Refresh.two')?.remove()
        let Refresh = document.createElement('div');
        聊天页.style.display='flex';
        聊天页.style.justifyContent='space-evenly';
        聊天页.style.flexDirection='row';
        Refresh.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
<path d="M12 21C16.9706 21 21 16.9706 21 12C21 9.69494 20.1334 7.59227 18.7083 6L16 3M12 3C7.02944 3 3 7.02944 3 12C3 14.3051 3.86656 16.4077 5.29168 18L8 21M21 3H16M16 3V8M3 21H8M8 21V16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
        Refresh.className = 'Refresh';
        let Refresh2 = Refresh.cloneNode(true);
        Refresh2.className = 'Refresh two';
        聊天页.appendChild(Refresh);
        聊天页.appendChild(Refresh2);
        let recordValue=0;
        let recordValue1 = 0;
        let recordValue2 = 0;
        let recordValue3 = 0;
        let recordValue4 = 0;
        let reindex=0;
        Refresh.addEventListener('mousedown', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handleLongPress();
        });
        Refresh.addEventListener('mouseup', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handleMouseUp()
        });
        Refresh2.addEventListener('mousedown', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handleLongPress(2)
        });
        Refresh2.addEventListener('mouseup', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handleMouseUp()
        });

        function handleLongPress(type) {
            let visibleimg = document.querySelector('li.visible img');
            if (visibleimg) {
                longPressTimer = setInterval(function () {
                    if (type === 2) {
                            recordValue[reindex] += 2;
                            if (recordValue[reindex] >= 360) {
                                recordValue[reindex] = 0
                            }
                    } else {
                            recordValue[reindex] -= 2;
                            if (recordValue[reindex] <= 0) {
                                recordValue[reindex] = 360
                            }
                        }
                    visibleimg.style.transform = `rotate(${recordValue[reindex]}deg)`;
                }, 50);
            }
        }

        function handleMouseUp() {
            clearInterval(longPressTimer);
        }
        let slides = document.querySelectorAll('[aria-labelledby="modal-header"] ul[role="list"] li');
        let 刷新=0;

        if (slides.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const slide = entry.target;

                    if (entry.isIntersecting) {
                        // 当幻灯片完全进入视口时，添加标记
                        slide.classList.add('visible');
                        reindex = Array.from(slides).indexOf(slide)+1;
                        console.log(`当前完全显示的幻灯片${reindex}:`, slide);
                        showToast(`当前展示图层${reindex}的幻灯片`,true,1000)
                        // document.querySelector('.Refresh')?.classList.remove('prohibit')
                        // document.querySelector('.Refresh.two')?.classList.remove('prohibit')
                    } else {
                        // 当幻灯片离开视口时，移除标记
                        slide.classList.remove('visible');

                    }
                });
            }, {
                threshold: 1.0 // 完全进入视口时触发
            });
            slides.forEach(slide => observer.observe(slide));
        }

        let css = `
        .Refresh{
        left: calc(50% - 135px);
        transform: translate(-50%);
        width: 56px;
        height: 56px;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,.15);
        border-radius: 13%;
        top: 5%;
        }
        .Refresh.two{
        left: calc(50% + 80px);
        }
        .Refresh.two svg{
        transform: scalex(-1);
        }
        .Refresh svg{
        width: 50px;
        height: 50px;
        }
        .Refresh svg path{
            stroke: black;
        }
        .Refresh.prohibit svg path{
            stroke: #c6c9c9;
        }
        `;

        if (document.querySelector('.xzimage')) {
            return;
        }
        var style = document.createElement('style');
        style.textContent = css;
        style.className = "xzimage";
        document.head.appendChild(style);
    }


    function 图片增强(modal, 二级, image) {
        //推特专用

        // 初始化翻转状态
        let translateX = 0;
        let zoomedImage = image;
        zoomedImage.classList.add('modal')
        if (!二级.querySelector('.flip')) {
            let flip = document.createElement('div');

            flip.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
    <path d="M10.7672 7.5431C11.0672 7.25744 11.0788 6.78271 10.7931 6.48276C10.5074 6.18281 10.0327 6.17123 9.73276 6.4569L10.7672 7.5431ZM4.48276 11.4569C4.18281 11.7426 4.17123 12.2173 4.4569 12.5172C4.74256 12.8172 5.21729 12.8288 5.51724 12.5431L4.48276 11.4569ZM5.51724 11.4569C5.21729 11.1712 4.74256 11.1828 4.4569 11.4828C4.17123 11.7827 4.18281 12.2574 4.48276 12.5431L5.51724 11.4569ZM9.73276 17.5431C10.0327 17.8288 10.5074 17.8172 10.7931 17.5172C11.0788 17.2173 11.0672 16.7426 10.7672 16.4569L9.73276 17.5431ZM5 11.25C4.58579 11.25 4.25 11.5858 4.25 12C4.25 12.4142 4.58579 12.75 5 12.75V11.25ZM19 12.75C19.4142 12.75 19.75 12.4142 19.75 12C19.75 11.5858 19.4142 11.25 19 11.25V12.75ZM9.73276 6.4569L4.48276 11.4569L5.51724 12.5431L10.7672 7.5431L9.73276 6.4569ZM4.48276 12.5431L9.73276 17.5431L10.7672 16.4569L5.51724 11.4569L4.48276 12.5431ZM5 12.75H19V11.25H5V12.75Z" fill="#000000"/>
    </svg>`;
            flip.className = 'flip';
            // // 添加翻转事件（通过按钮或其他方式触发）
            flip.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                flipImage();
            });

            let flip2 = flip.cloneNode(true);
            flip2.className = 'flip two';
            flip2.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                flipImage(2);
            });
            二级.appendChild(flip);
            二级.appendChild(flip2);

        }


        二级.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if(event.target.tagName==='IMG')return;
            let 关闭 = findParentWithDataE2EVid2(modal, '[aria-label="关闭"]');
            关闭?.querySelector('[aria-label="关闭"]').click();
        });
        zoom绑定(modal,zoomedImage);
        let imgjs = {};
        imgjs.initialWidth;
        imgjs.initialHeight;
        function zoom绑定(modal,c_zoomedImage){
            c_zoomedImage.onmousedown = function (event) {
                clearInterval(longPressTimer);
                dragMenu(this, event);
            };
            c_zoomedImage.addEventListener('dblclick', (event) => {
                event.preventDefault();
                event.stopPropagation();

                let 关闭 = findParentWithDataE2EVid2(modal, '[aria-label="关闭"]');
                关闭?.querySelector('[aria-label="关闭"]').click();
            });

            // 绑定图片加载完成事件
c_zoomedImage.addEventListener('load', (event) => {
    function checkImageWidth() {
        if (c_zoomedImage.width > 0) {
            c_zoomedImage.style.opacity = '1';
            c_zoomedImage.parentElement.querySelector('div').style.display = 'none';
            upPercentage(c_zoomedImage, modal);
        } else {
            requestAnimationFrame(checkImageWidth);
        }
    }
    checkImageWidth();
});



            c_zoomedImage.addEventListener('wheel', (event) => {
                if (imgjs.initialWidth === 0 || imgjs.initialHeight === 0) {
                    imgjs.initialWidth = c_zoomedImage.naturalWidth;
                    imgjs.initialHeight = c_zoomedImage.naturalHeight;
                }
                event.preventDefault();
                const delta = Math.sign(event.deltaY);
                const currentWidth = c_zoomedImage.getBoundingClientRect().width;
                const currentHeight = c_zoomedImage.getBoundingClientRect().height;
                c_zoomedImage.style.maxWidth = 'none';
                c_zoomedImage.style.maxHeight = 'none';
                const newWidth = currentWidth - delta * (currentWidth * 0.05);
                const newHeight = currentHeight - delta * (currentHeight * 0.05);
                if (translateX === 1 || translateX === 3) {
                    c_zoomedImage.style.width = `${newHeight}px`;
                    c_zoomedImage.style.height = `${newWidth}px`;
                } else {
                    c_zoomedImage.style.width = `${newWidth}px`;
                    c_zoomedImage.style.height = `${newHeight}px`;
                }
                if (modal.querySelector('[class="imKBMZPo"] span')) {
                    // modal.querySelector('[class="imKBMZPo"] span').textContent = `${zoomedImage.width} × ${zoomedImage.height}px`;
                    // 计算当前缩放比例
                    const scaleX = newWidth / imgjs.initialWidth;
                    const scaleY = newHeight / imgjs.initialHeight;
                    const scale = Math.min(scaleX, scaleY); // 假设宽高比例相同，选择最小值
                    // 计算缩放百分比
                    const zoomPercentage = Math.round(scale * 100);
                    // 更新显示缩放百分比
                    modal.querySelector('[class="imKBMZPo"] span').textContent = `${zoomPercentage}%`;
                    // modal.querySelector('.Current_size').textContent = `${zoomedImage.width} × ${zoomedImage.height}px`;
                }
            });
        }

        function upPercentage(c_zoomedImage, modal) {
            c_zoomedImage.parentElement.parentElement.parentElement.style.width='100%'
            // 获取图片的自然宽高（即图片本身的宽高）
            const naturalWidth = c_zoomedImage.naturalWidth;
            const naturalHeight = c_zoomedImage.naturalHeight;

            // 获取父级元素的宽度和高度
            const parentWidth = c_zoomedImage.parentElement.clientWidth;
            const parentHeight = c_zoomedImage.parentElement.clientHeight - 20;  // 高度减去20像素作为参考高度

            // 计算宽高比例
            const ratio = naturalWidth / naturalHeight;

            // 根据参考高度和宽高比例计算缩放后的宽度
            let scaledWidth = parentHeight * ratio;

            // 如果计算出的宽度超过父元素的宽度，限制宽度为父元素的宽度
            if (scaledWidth > parentWidth * 0.9) {
                scaledWidth = parentWidth * 0.9;
            }

            // 设置图片的宽度和高度，实现等比例缩放
            c_zoomedImage.style.width = scaledWidth + 'px';
            c_zoomedImage.style.height = parentHeight + 'px';

            // 计算图片水平方向的偏移量，使其居中显示
            const leftOffset = (parentWidth - scaledWidth) / 2;
            c_zoomedImage.style.left = leftOffset + 'px';
            c_zoomedImage.style.top = '10px';

            // 更新 imgjs 对象的初始宽高
            imgjs.initialWidth = c_zoomedImage.naturalWidth;
            imgjs.initialHeight = c_zoomedImage.naturalHeight;

            // 计算当前显示宽度的百分比
            const displayedWidth = c_zoomedImage.width;
            let widthPercentage = (displayedWidth / naturalWidth) * 100;

            // 更新显示缩放百分比
            if (modal.querySelector('[class="imKBMZPo"] span')) {
                modal.querySelector('[class="imKBMZPo"] span').textContent = `${widthPercentage.toFixed(2)}%`;
            }
        }

        function dragMenu(menuObj, e) {
            e = e ? e : window.event;
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') {
                return;
            }
            // menuObj.style.position='absolute';
            // menuObj.style.cursor='move';
            let dragData = {
                startX: e.clientX,
                startY: e.clientY,
                menuLeft: menuObj.offsetLeft, // 修改这里
                menuTop: menuObj.offsetTop // 修改这里
            };
            document.onmousemove = function (e) { try { dragMenu(menuObj, e); } catch (err) { } };
            document.onmouseup = function (e) { try { stopDrag(menuObj); } catch (err) { } };
            doane(e);
            function stopDrag(menuObj) {
                document.onmousemove = null;
                document.onmouseup = null;
            }
            function doane(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
            document.onmousemove = function (e) {
                let mouseX = e.clientX;
                let mouseY = e.clientY;
                let menuLeft = dragData.menuLeft + mouseX - dragData.startX;
                let menuTop = dragData.menuTop + mouseY - dragData.startY;
                menuObj.style.left = menuLeft + 'px';
                menuObj.style.top = menuTop + 'px';
                doane(e);
            }
        }
        function closeModal() {
            // 隐藏模态框，显示菜单按钮
            document.body.removeChild(modal);
            // const menuBtn = document.getElementById('menu-btn');
            // menuBtn.style.display = '';
            isModalOpen = false;
        }

        // 翻转函数
        function flipImage(type) {
            if (type === 2) {
                translateX -= 1;
                if (translateX === -1) {
                    translateX = 3;
                }
            } else {
                translateX += 1;
                if (translateX === 4) {
                    translateX = 0;
                }
            }

            // 如果translateX等于4，就重置为0
            if (translateX === 4 || translateX === -1) {
                translateX = 0;
            }
            if (translateX === 1) {
                zoomedImage.style.transform = `rotate(-90deg)`;

            } else {
                if (translateX === 2) {
                    zoomedImage.style.transform = `rotate(180deg)`;
                } else {
                    if (translateX === 3) {
                        zoomedImage.style.transform = `rotate(90deg)`;
                    } else {
                        if (translateX === 0) {
                            zoomedImage.style.transform = `rotate(0deg)`;
                        }
                    }
                }
            }

        }
        let css = `
        .flip{
        left: calc(50% - 56px);
        transform: translate(-50%);
        width: 56px;
        height: 56px;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,.15);
        border-radius: 13%;
        position: absolute;
        top: 5%;
        z-index: 11;
        }
        .flip.two{
        left: calc(50% + 56px);
        }
        .flip.two svg{
        transform: scale(-1);
        }
        .flip svg{
        width: 50px;
        height: 50px;
        }
        .flip svg path{
        fill:white;
        }
        `;

        if (document.querySelector('.enimage')) {
            return;
        }
        var style = document.createElement('style');
        style.textContent = css;
        style.className = "enimage";
        document.head.appendChild(style);
        // 或者使用键盘事件来进行翻转操作
        // zoomedImage.addEventListener('keydown', (event) => {
        //     if (event.key === 'f') { // 'h'键进行水平翻转
        //         flipImage();
        //     } else if (event.key === 'g') { // 'v'键进行垂直翻转
        //         flipImage();
        //     }
        // });
    }




    function 媒体查询(ID) {
        var mediajson = localStorage.getItem('mediacompleted');
        if (!mediajson) {
            mediajson = [];
        } else {
            mediajson = JSON.parse(mediajson);
        }
        return mediajson.includes(ID)
    }

    function 绑定下载按钮(媒体, 推文ID, 媒体列表) {
        //console.log('媒体', 媒体)
        if (!媒体.querySelector('.tmd-down.tmd-media ')) {
            var 下载 = document.createElement('div');
            下载.title = '下载';
            下载.innerHTML = 下载按钮SVG;
            媒体.appendChild(下载);
            var mediajson = localStorage.getItem('mediacompleted2');
            if (!mediajson) {
                mediajson = [];
            } else {
                mediajson = JSON.parse(mediajson);
            }
            mediajson.includes(推文ID) ? 下载.className = 'tmd-down tmd-media completed' : 下载.className = 'tmd-down tmd-media download';
            if (媒体列表) {
                下载.classList.add('list');
            } else {
                下载.classList.add('like');
            }
            下载.addEventListener('click', function (event) {
                event.stopPropagation(); // 阻止事件冒泡
                event.preventDefault(); // 阻止默认行为
                下载.classList.remove('download');
                下载.classList.add('loading');
                // console.log(媒体.querySelector('a').href)
                if (推文ID) {
                    fetchJson(推文ID, '推特推文信息', 下载)
                        .then(tweet => {
                            推特推文信息解读(推文ID, tweet, 下载);
                            //console.log(JSON.stringify(tweet)); // 在控制台打印获取到的 Tweet 数据
                        })
                        .catch(error => {
                            console.error(error); // 打印错误信息
                        });
                }


            })
        } else {
            console.log(媒体)
        }
    }

    function 绑定按钮(推文元素, user, 媒体列表) {
        if (推文元素.querySelector('.sendmedia')) {
            return;
        }

        var ID = 取ID(推文元素);
        var 完成状态 = 媒体查询(ID);
        if  (!完成状态) {
            if(location.href.indexOf('/likes') > -1) {
                showToast(ID + ' 未下载推文', 'error');
            }
        }
        // 添加鼠标动作的样式类
        if (媒体列表) {
            if (!推文元素.querySelector('.list_sendmedia')) {
                var svgElement3 = 发送按钮();
                推文元素.prepend(svgElement3);
                svgElement3.className = 'list_sendmedia';

                完成状态 ? svgElement3.setAttribute("state", "complete") : '';
                svgElement3.addEventListener("click", function (event) {
                    event.stopPropagation();
                    获取信息发送(svgElement3, ID);
                });
                svgElement3.addEventListener('mouseover', function () {
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    if (!isMobile) {
                        // 如果是移动设备，则不添加 svghover 类
                        svgElement3.classList.add('svghover');
                    }
                });
                svgElement3.addEventListener('mouseout', function () {
                    svgElement3.classList.remove('svghover');
                });
                绑定下载按钮(推文元素, ID, 媒体列表);
            }

        } else {

            var svgElement = 发送按钮();
            完成状态 ? svgElement.setAttribute("state", "complete") : '';
            推文元素.appendChild(svgElement);
            svgElement.addEventListener("click", function (event) {
                event.stopPropagation();
                获取信息发送(svgElement, ID, user);

            });
            svgElement.className = 'sendmedia';
            svgElement.addEventListener('mouseover', function () {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (!isMobile) {
                    // 如果是移动设备，则不添加 svghover 类
                    svgElement.classList.add('svghover');
                }
            });
            svgElement.addEventListener('mouseout', function () {
                svgElement.classList.remove('svghover');
            });

            if (!user) {
                绑定下载按钮(推文元素, ID, 媒体列表);
                var svgElement2 = svgElement.cloneNode(true)
                完成状态 ? svgElement2.setAttribute("state", "complete") : '';
                推文元素.prepend(svgElement2);
                svgElement2.addEventListener("click", function (event) {
                    event.stopPropagation();
                    获取信息发送(svgElement2, ID);
                });
                svgElement2.addEventListener('mouseover', function () {
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    if (!isMobile) {
                        // 如果是移动设备，则不添加 svghover 类
                        svgElement2.classList.add('svghover');
                    }
                });
                svgElement2.addEventListener('mouseout', function () {
                    svgElement2.classList.remove('svghover');
                });
            } else {
                svgElement.classList.add('user');
            }
        }

        function 取ID(推文元素) {

            var match = 推文元素.querySelectorAll('a')[0]?.getAttribute('href')?.match(推文ID正则);
            let extractedText;
            if (!match) {

                if (user) {
                    extractedText = 取推文userID(推文元素)
                } else {
                    extractedText = 取推文ID(推文元素);
                }
            } else {
                extractedText = match?.[1] || '';
            }

            if (!extractedText) {
                extractedText = location.href?.match(推文ID正则)?.[1] || '';
            }
            return extractedText;
        }
        function 获取信息发送(sendmediaElement, id, user) {

            if (id) {
                // console.log(id);
                sendmediaElement.setAttribute("state", "wait");
                if (user) {
                    发送信息('https://x.com/' + id, "用户ID", sendmediaElement);
                } else {
                    发送信息(id, "推文ID", sendmediaElement);
                }

            } else {
                showToast("未找到匹配的内容。", true);
                sendmediaElement.setAttribute("state", "error");
            }
        }

    }
    function 取推文userID(currentElement) {
        let a = 0;  // 初始化计数器
        let shouldBreak = false;
        while (currentElement && !shouldBreak) {
            let all_elements = Array.from(currentElement.querySelectorAll('a'));
            for (let index = 0; index < all_elements.length; index++) {
                let extractedText = all_elements[index].getAttribute('href')?.includes('photo');
                if (extractedText) {
                    let id = all_elements[index].getAttribute('href').match(推文ID正则)
                    if (id && id.length > 0) {
                    } else {
                        let userid = all_elements[index].getAttribute('href').match(/(\w{2,})\/photo/)
                        if (userid && userid.length > 0) {
                            console.log('用户ID', userid[1])
                            return userid[1];
                        }
                    }
                }
            }
            if (currentElement.getAttribute('data-testid') === 'cellInnerDiv') {
                // console.log('警察蜀黍2');
                shouldBreak = true;
                return;  // 返回 undefined
            }
            currentElement = currentElement.parentElement;
            a++;
            if (a === 3) {
                shouldBreak = true;
                return;  // 返回 undefined
            }

        }
    }


    function 取推文ID(currentElement) {
        let a = 0;  // 初始化计数器
        let shouldBreak = false;
        while (currentElement && !shouldBreak) {
            let f_id = currentElement.querySelector('[class="css-175oi2r r-14gqq1x"] a')?.href;
            if (f_id) {
                return f_id.match(推文ID正则)[1];
            }
            let all_elements = Array.from(currentElement.querySelectorAll('a'));
            for (let index = 0; index < all_elements.length; index++) {

                let extractedText = all_elements[index].getAttribute('href')?.match(推文ID正则);
                if (extractedText && extractedText.length > 0) {
                    //console.log('警察蜀黍1', extractedText, extractedText.length);
                    shouldBreak = true;
                    return extractedText[1];  // 返回推文 ID
                }
            }
            if (currentElement.getAttribute('data-testid') === 'cellInnerDiv') {
                //console.log('警察蜀黍2');
                shouldBreak = true;
                return;  // 返回 undefined
            }
            currentElement = currentElement.parentElement;
            a++;
            if (a === 15) {
                shouldBreak = true;
                return;  // 返回 undefined
            }
        }
    }

    function hide(ele) {
        let ele2 = ele.querySelectorAll('[role="button"]')
        ele2.forEach((ele3, index2) => {
            if (ele3.textContent === '显示') {
                ele3.click()
            }
        })
    }
    // let ce = document.querySelectorAll('[data-testid="cellInnerDiv"]');
    // ce.forEach((ele, index) => {
    //     let ele2 = ele.querySelectorAll('[role="button"]')
    //     ele2.forEach((ele3, index2) => {
    //         if (ele3.textContent === '显示') {
    //             ele3.click()
    //         }
    //     })
    // })


    // //无法使用跨域访问，即使服务端允许跨域，可能是因为网站需要科学上网的原因
    // function get(url, post, callback) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open(post ? 'POST' : 'GET', url, false);// 第三个参数设置为false表示同步请求
    //     xhr.withCredentials = true;
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4) {
    //             if (xhr.status === 200) {
    //                 callback(xhr.responseText);
    //             } else if (xhr.status === 404) {
    //                 showToast("资源未找到");
    //             } else if (xhr.status === 500) {
    //                 showToast("服务器内部错误");
    //             } else if (xhr.status === 0) {
    //                 showToast("连接错误");
    //             } else {
    //                 showToast("网络错误或其他错误");
    //             }
    //         }
    //     };
    //     if (post) {
    //         xhr.setRequestHeader('Content-Type', 'application/json');

    //         xhr.send(post);
    //     } else {
    //         xhr.send();
    //     }
    // }

    // function 发送信息(信息, 类型, 按钮) {
    //     let post = JSON.stringify(
    //         {
    //             蜀黍: 类型,
    //             警察: 信息
    //         })
    //     get(服务器地址, post, function (content) {
    //         console.log("请求完成", content);
    //         按钮.setAttribute("state", "complete");
    //         showToast(content, true);
    //     });
    // }
    function 发送信息(信息, 类型, 按钮) {
        // showToast(服务器地址)
        try {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 服务器地址,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },

                data: JSON.stringify([{"类型":类型,"ID":信息,"句柄":""}]),
                onload: function (response) {
                    console.log("请求完成", response.responseText);
                    if (!response.responseText) {
                        按钮.setAttribute("state", "fail");
                        response.responseText = 信息 + '--' + 类型;
                        showToast(response.responseText, false);
                    } else if (!response.status===200) {
                        按钮.setAttribute("state", "fail");
                        response.responseText = 信息 + '--' + 类型+'请求错误'+response.status;
                        showToast(response.responseText, false);
                    }
                    else {
                        try {
                            var JS = JSON.parse(response.responseText);
                            var 下载状况 = `用户《${JS.昵称}》_图片下载：成功${JS.图片.成功}失败${JS.图片.失败}重复${JS.图片.重复}，视频下载：成功${JS.视频.成功}失败${JS.视频.失败}重复${JS.视频.重复}`;
                            if (JS.图片.失败 === 0 && JS.视频.失败 === 0) {
                                添加成功下载文件(JS.推文ID);
                                按钮.setAttribute("state", "complete");
                                showToast(下载状况, true);
                            } else {
                                按钮.setAttribute("state", "fail");
                                showToast(response.responseText, true);
                            }

                        } catch (error) {
                            按钮.setAttribute("state", "fail");
                            showToast(response.responseText, true);
                            console.log(error);
                        }
                    }
                },
                onerror: function (error) {
                    console.error("请求失败", error);
                    showToast(信息 + '网络请求失败' + error.name + '-' + error.message, false);
                    按钮.setAttribute("state", "fail");
                }
            });
        }catch (error) {
            showToast(error.message)
        }
        // 发送跨域 POST 请求

    }

})();

function 发送按钮() {
    var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <g fill="none" stroke="rgb(0, 120, 201)" class="go">
        <path stroke-width="1.5" d="M23.324 5.709.329 11.747M15.27 18.599l8.145-13.088M.431 11.774l7.563 1.749"/>
        <path stroke-width=".8" d="M21.96 6.67 7.955 13.52"/>
        <path stroke-width="2.5" d="m15.421 18.294-4.983-3.153"/>
        <path stroke-width=".8" d="m10.45 15.066 13.176-9.699M7.186 20.564l.576-6.944"/>
        <path stroke-width="1.5" d="m10.46 15.033-3.194 5.789"/></g></svg>`;
    var svgElement = document.createElement('div');
    svgElement.style.fill = '#0078c9';
    svgElement.style.cursor = 'pointer';
    svgElement.style.alignItems = 'center';
    svgElement.style.display = 'flex';
    svgElement.style.justifyContent = 'center';
    svgElement.style.flexDirection = 'row';
    svgElement.style.flex = '1';
    svgElement.innerHTML += svg;
    return svgElement;
}

function addid(mod) {
    if (document.querySelector('.addid')) return;
    let bu = document.createElement('button');
    bu.setAttribute('style', 'width: 110px;height: 30px;margin: 0 10px 0 10px;border-radius: 10px;');
    bu.className = 'addid';
    bu.textContent = '获取ID信息'
    bu.addEventListener('click', function (event) {
        event.stopPropagation();
        event.preventDefault();
        GM_xmlhttpRequest({
            method: 'POST',
            url: 更新推特下载记录id地址,
            headers: {
                'Content-Type': 'application/json',
            },
            data: '警察蜀黍',
            onload: function (response) {

                if (!response.responseText) {

                } else {
                    try {
                        let js = JSON.parse(response.responseText);
                        showToast("请求完成" + js.length,);
                        localStorage.setItem('mediacompleted', response.responseText)
                    } catch (error) {
                        showToast(error.message);
                    }
                }
            },
            onerror: function (error) {
                showToast("请求失败", error);
            }
        });
    });
    mod.appendChild(bu);
}
function showToast(message, isError, time) {
    time = time ? time : 3000;

    // 创建新的提示框
    const toastContainer = document.createElement('div');

    // 设置样式属性
    toastContainer.style.position = 'fixed';
    toastContainer.style.justifyContent = 'center';
    toastContainer.style.top = '30%';
    toastContainer.style.left = '50%';
    toastContainer.style.width = '65vw';
    toastContainer.style.transform = 'translate(-50%, -50%)';
    toastContainer.style.display = 'flex';
    toastContainer.style.padding = '5px';
    toastContainer.style.fontSize = '20px';
    toastContainer.style.background = '#e7f4ff';
    toastContainer.style.zIndex = '99999';
    toastContainer.style.borderRadius = '15px';
    toastContainer.classList.add('PopupMessage'); // 设置 class 名称为 PopupMessage

    // 根据是否为错误提示框添加不同的样式
    if (isError) {
        toastContainer.classList.add('success');
        toastContainer.style.color = '#3fc91d';
    } else {
        toastContainer.classList.add('error');
        toastContainer.style.color = '#CC5500';
    }

    // 将提示框添加到页面中
    document.body.appendChild(toastContainer);

    // 获取页面高度的20vh
    const windowHeight = window.innerHeight;
    // 设置最低的高度。
    const height = windowHeight * 0.2;
    // 设置当前提示框的位置
    toastContainer.style.top = `${height}px`;

    // 在页面中插入新的信息
    const toast = document.createElement('div');
    // 使用 <br> 实现换行
    toast.innerHTML = String(message).replace(/\n/g, '<br>');
    toastContainer.appendChild(toast);

    // 获取所有的弹出信息元素，包括新添加的元素
    const popupMessages = document.querySelectorAll('.PopupMessage');

    // 调整所有提示框的位置
    let offset = 0;
    popupMessages.forEach(popup => {
        if (popup !== toastContainer) {
            popup.style.top = `${parseInt(popup.style.top) - toast.offsetHeight - 5}px`;
        }
        offset += popup.offsetHeight;
    });

    let timer;
    let remainingTime = time;

    const startCountdown = () => {
        timer = setTimeout(() => {
            toastContainer.classList.add('hide');
            // 过渡动画结束后移除提示框
            setTimeout(() => {
                toastContainer.parentNode.removeChild(toastContainer);
            }, 300);
        }, remainingTime);
    };

    startCountdown();

    // 添加鼠标进入和离开事件监听器
    toastContainer.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        remainingTime = remainingTime - (Date.now() - startCountdownTime);
    });

    toastContainer.addEventListener('mouseleave', () => {

        startCountdown();
    });

    const startCountdownTime = Date.now();
}

function dragMenu(menuObj, e) {
    e = e ? e : window.event;
    if (e.target !== menuObj) {
        return; // 如果点击的不是父元素本身，则不执行拖动操作
    }
    // || e.target.tagName === 'BUTTON' 判断是否为按钮元素
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
    }
    let dragData = {
        startX: e.clientX,
        startY: e.clientY,
        menuLeft: menuObj.offsetLeft,
        menuTop: menuObj.offsetTop
    };
    document.onmousemove = function (e) { try { dragMenu(menuObj, e); } catch (err) { } };
    document.onmouseup = function (e) { try { stopDrag(menuObj); } catch (err) { } };
    doane(e);
    function stopDrag(menuObj) {
        document.onmousemove = null;
        document.onmouseup = null;
    }
    function doane(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
    document.onmousemove = function (e) {
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        let menuLeft = dragData.menuLeft + mouseX - dragData.startX;
        let menuTop = dragData.menuTop + mouseY - dragData.startY;
        menuObj.style.left = menuLeft + 'px';
        menuObj.style.top = menuTop + 'px';
        doane(e);
    }
}

var 下载按钮SVG = `<div class='背景'><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">
<g class="download"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></g>
<g class="completed"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l3,4 q1,1 2,0 l8,-11" fill="none" stroke="#1DA1F2" stroke-width="2" stroke-linecap="round"></path></g>
<g class="loading"><circle cx="12" cy="12" r="10" fill="none" stroke="#1DA1F2" stroke-width="4" opacity="0.4"></circle><path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="#1DA1F2" stroke-width="4" stroke-linecap="round"></path></g>
<g class="failed"><circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8"></circle><path d="M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4" fill="#fff" stroke="none"></path></g>
</svg></div>`
function 备忘录() {
    let variables = {
        "focalTweetId": status_id,
        "with_rux_injections": false,
        "includePromotedContent": true,
        "withCommunity": true,
        "withQuickPromoteEligibilityTweetFields": true,
        "withBirdwatchNotes": true,
        "withVoice": true,
        "withV2Timeline": true
    };
    let features = {
        "rweb_lists_timeline_redesign_enabled": true,
        "responsive_web_graphql_exclude_directive_enabled": true,
        "decider_personalized_text": "enabled",
        "live_event_deduping_enabled": true,
        "decider_personalized_timeline_enabled": true,
        "user_display_name": "enabled",
        "dm_ctas_enabled": true,
        "push_state": "enabled",
        "new_browser_label": "enabled",
        "rweb_optimistically_logged_out": "enabled",
        "decider_personalized_search_enabled": true,
        "responsive_web_settings_page": "enabled",
        "explore_premium_tab_enabled": true,
        "dm_ctas_no_history_enabled": true,
        "graphql_vod_video_enabled": true,
        "decider_personalized_home_timeline_enabled": true,
        "high_contrast_mode": "enabled",
        "rweb_mobile_topbar_home_link": "enabled",
        "rweb_live_video_autoplay": "enabled",
        "rweb_live_video_prefetch": "enabled",
        "polls_universe_enabled": true,
        "rts_update": "enabled",
        "rweb_tweet_timeline_link": "enabled",
        "timeline_item_image_prefetching": "enabled",
        "moments_lohp_enabled": true,
        "moments_lohp_swipeable": true,
        "moments_verification_enabled": true,
        "moments_lohp_non_blocking": true,
        "decider_personalized_events_enabled": true,
        "decider_personalized_sports_enabled": true,
        "broadcast_page": "enabled",
        "rweb_unified_cards": "enabled",
        "rweb_unified_cards_test": "control",
        "direct_messages_card_poll_options": "enabled",
        "rweb_permutations": "enabled",
        "rweb_adaptive_web_prompt": "enabled",
        "rweb_release_notes": "enabled",
        "dark_mode": "enabled",
        "rweb_search_results_user_metrics": "enabled",
        "rweb_search_results_user_metrics_followers": "enabled",
        "rweb_search_results_user_metrics_following": "enabled",
        "rweb_search_results_user_metrics_tweets": "enabled",
        "rweb_search_results_user_metrics_favorites": "enabled",
        "rweb_search_results_user_metrics_moments": "enabled",
        "rweb_gdpr_interstitial": "enabled",
        "rweb_search_results_user_metrics_media": "enabled",
        "rweb_search_results_user_metrics_likes": "enabled",
        "rweb_search_results_user_metrics_lists": "enabled",
        "rweb_search_results_user_metrics_moments_video": "enabled",
        "rweb_search_results_user_metrics_moments_audio": "enabled",
        "explore_trends_setting": "enabled",
        "explore_trends_setting_social_context": "enabled",
        "rweb_sidebar_sync": "enabled",
        "rweb_all_categories": "enabled",
        "rweb_prefetch_home_timeline": "enabled",
        "rweb_twempiric_poll_options": "enabled"
    };
}

async function fetchJson(推特ID, 类型) {
    if (类型 === '推特推文信息') {
        var 推特推文信息 = `https://x.com/i/api/graphql/q2SYrdJX7r5Lf0e6sHuM9g/TweetDetail?variables=%7B%22focalTweetId%22%3A%22${推特ID}%22%2C%22referrer%22%3A%22home%22%2C%22controller_data%22%3A%22DAACDAABDAABCgABAIAAQkIDAAEKAAIAAAAAAAEgAAoACUuxSdlK%2FWNcCAALAAAAAA8ADAMAAAALAQADQkIAgAAAIAEKAA5HhMMR0YJKawoAEBZlvNeqhqk9AAAAAA%3D%3D%22%2C%22with_rux_injections%22%3Afalse%2C%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withBirdwatchNotes%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D&fieldToggles=%7B%22withArticleRichContentState%22%3Atrue%7D`;
        var url = 推特推文信息;
    } else {
        if (类型 === '推特用户媒体信息') {
            var 推特用户媒体信息 = `https://x.com/i/api/graphql/cEjpJXA15Ok78yO4TUQPeQ/UserMedia?variables=%7B%22userId%22%3A%22${推特ID}%22%2C%22count%22%3A20%2C%22cursor%22%3A%22${页码}%22%2C%22includePromotedContent%22%3Afalse%2C%22withClientEventToken%22%3Afalse%2C%22withBirdwatchNotes%22%3Afalse%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
            var url = 推特用户媒体信息;
        }
    }
    let cookies = getCookie();
    let headers = {
        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        'x-twitter-active-user': 'yes',
        'x-twitter-client-language': cookies.lang,
        'x-csrf-token': cookies.ct0
    };
    if (cookies.ct0.length == 32) headers['x-guest-token'] = cookies.gt;
    let tweet_detail = await fetch(url, { headers: headers }).then(result => result.json());
    // let tweet_entrie = tweet_detail.data.threaded_conversation_with_injections_v2.instructions[0].entries.find(n => n.entryId == `tweet-${推特ID}`);
    // let tweet_result = tweet_entrie.content.itemContent.tweet_results.result;
    return tweet_detail || '';
}

function getCookie() {
    let cookies = {};
    document.cookie.split(';').filter(n => n.indexOf('=') > 0).forEach(n => {
        n.replace(/^([^=]+)=(.+)$/, (match, name, value) => {
            cookies[name.trim()] = value.trim();
        });
    });
    return cookies;
}

function 推特推文信息解读(推文ID, tweet, 按钮) {
    var js = tweet;
    var 错误 = js.errors?.[0]?.message;
    if (错误) {
        console.log('报错', 错误)
        return '';
    }
    var 推文数 = js.data?.threaded_conversation_with_injections_v2?.instructions[0]?.entries?.length;
    var 类型 = -1;
    for (let i = 0; i <= 推文数; i++) {
        console.log('i', i)
        let ID = js.data?.threaded_conversation_with_injections_v2?.instructions?.[0]?.entries?.[i]?.entryId;;
        // console.log(ID)
        if (ID?.indexOf(推文ID) > -1) {
            console.log('贴文', ID, ID?.indexOf(推文ID))
            类型 = i;
            var 推文内容, 媒体内容, 文案, 账号名, 昵称, 发布时间, 媒体id, 媒体高度, 媒体宽度, 媒体尺寸, url数量, URL, 扩展名, 图片原url, 文件名, 文件id, 图片URL, filenameWithExtension;
            推文内容 = js.data?.threaded_conversation_with_injections_v2?.instructions?.[0]?.entries[i]?.content?.itemContent?.tweet_results?.result;
            媒体内容 = 推文内容?.legacy?.entities?.media;
            文案 = 移除链接(推文内容?.legacy?.full_text);
            账号名 = 推文内容.core?.user_results?.result?.legacy?.screen_name;
            昵称 = 推文内容?.core?.user_results?.result?.legacy?.name;
            发布时间 = 时间戳转时间(Date.parse(推文内容?.legacy?.created_at));
            for (let i2 = 0; i2 < 媒体内容.length; i2++) {
                console.log('媒体内容', 媒体内容.length);
                媒体id = 媒体内容[i2].media_key;
                if (媒体内容[i2].type === 'video') {
                    媒体高度 = 媒体内容[i2]?.original_info?.height;
                    媒体宽度 = 媒体内容[i2]?.original_info?.width;
                    媒体尺寸 = `${媒体宽度}x${媒体高度}`;
                    url数量 = 媒体内容[i2]?.video_info?.variants;
                    for (let i3 = 0; i3 < url数量.length; i3++) {
                        URL = url数量[i3].url;
                        if (URL.includes(媒体尺寸)) {
                            扩展名 = 'mp4';
                            filenameWithExtension = URL.split('/').pop(); // 获取 URL 中的最后一部分，即文件名带扩展名
                            [文件id] = filenameWithExtension.split('.');
                            console.log(URL);
                            break;
                        }
                    }
                } else {
                    if (媒体内容[i2].type === 'photo') {
                        图片原url = 媒体内容[i2].media_url_https;
                        // 使用正则表达式提取文件名和扩展名
                        filenameWithExtension = 图片原url.split('/').pop(); // 获取 URL 中的最后一部分，即文件名带扩展名
                        [文件id, 扩展名] = filenameWithExtension.split('.'); // 从文件名中分离扩展名
                        URL = `https://pbs.twimg.com/media/${文件id}?format=jpg&name=large`;
                    }
                }
                //https://video.twimg.com/ext_tw_video/1763177860607692800/pu/vid/avc1/720x1280/PcZA04gWsfyTmoi8.mp4?tag=12
                文件名 = `${昵称}----${账号名}----${文案}丨${文件id}----${媒体id}----${推文ID}.${扩展名}`;
                console.log(文件名, URL);
                //在这里下载文件，使用文件名和URL
                if (URL && 文件名) {
                    下载文件(URL, 文件名, 按钮, 推文ID);
                } else {
                    按钮.classList.remove('loading');
                    按钮.classList.add('failed');

                }

            }
        } else {
            // 如果有其他操作，可以在这里添加
        }

    }

}

function 下载文件(fileUrl, filename, button, 推文ID) {
    showToast("开始下载媒体信息", true);
    // 检查是否为手机浏览器
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
        showToast("检测为手机浏览器！")
        // 使用 GM_download 下载文件
        GM_download({
            url: fileUrl,                           // 下载文件的 URL 地址
            name: filename,                   // 不填则自动获取文件名
            saveAs: true,                         // 布尔值，显示"保存为"对话框
            onerror: function (error) {           // 如果下载最终出现错误，则要执行的回调
                console.log(error)
                showToast('文件下载出错：', false);
                button.classList.remove('loading');
                button.classList.add('failed');
            },
            onprogress: (pro) => {                // 如果此下载取得了一些进展，则要执行的回调
                console.log(pro.loaded)           // 文件加载量
                console.log(pro.totalSize)
            },
            ontimeout: () => {
                showToast('文件下载出错：', false);
                button.classList.remove('loading');
                button.classList.add('failed');
            },                  // 如果此下载由于超时而失败，则要执行的回调
            onload: () => {
                console.log('文件下载成功');
                showToast("文件预下载完成了", true);
                button.classList.remove('loading')
                button.classList.add('completed');
                添加成功下载文件2(推文ID);
            }                      // 如果此下载完成，则要执行的回调
        })
    } else {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (xhr.status === 200) {
                if (xhr.response.size > 0) {
                    showToast("文件预下载完成了", true);
                    var a = document.createElement('a');
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = filename;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    showToast("请选择保存位置，并保存文件", true)
                    a.click();
                    window.URL.revokeObjectURL(a.href);
                    document.body.removeChild(a);
                    button.classList.remove('loading')
                    button.classList.add('completed');
                    // 按钮.className += ' completed';
                    添加成功下载文件(推文ID);
                } else {
                    showToast("文件大小为 0", false);
                    button.classList.remove('loading');
                    button.classList.add('failed');
                    // 按钮.className += ' failed';
                }
            } else {
                showToast("请求失败", false);
                button.classList.remove('loading');
                button.classList.add('failed');
                // 按钮.className += ' failed';
            }
        };
        xhr.onerror = function () {
            showToast("请求失败", true);
            button.classList.remove('loading');
            button.classList.add('failed');
        };
        // 在桌面浏览器中使用 blob 下载
        xhr.open('GET', fileUrl, true);
        xhr.responseType = 'blob';
        xhr.send();
    }

    return false;
}

function 添加成功下载文件(推文ID) {
    var mediajson = localStorage.getItem('mediacompleted');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    mediajson.push(推文ID);
    localStorage.setItem('mediacompleted', JSON.stringify(mediajson));
}

function 添加成功下载文件2(推文ID) {
    var mediajson = localStorage.getItem('mediacompleted2');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    mediajson.push(推文ID);
    localStorage.setItem('mediacompleted2', JSON.stringify(mediajson));
}

function 移除链接(text) {
    // 使用正则表达式匹配链接并移除
    return text.replace(/https?:\/\/\S+/gi, '');
}

function 时间戳转时间(inputDate) {
    var date = new Date(inputDate);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);
    var milliseconds = ('00' + date.getMilliseconds()).slice(-3);
    var customFormat = `${year}${month}${day}_${hours}${minutes}${seconds}_${milliseconds}`;
    return customFormat;
}

监测页面请求();
function 监测页面请求() {
    // 定义需要排除的域名
    const excludeDomain = 'https://video.twimg.com/';

    // 保存原始的 XMLHttpRequest 对象
    var originalXhrOpen = XMLHttpRequest.prototype.open;
    var originalXhrSend = XMLHttpRequest.prototype.send;

    // 重写 XMLHttpRequest 的 open 方法
    XMLHttpRequest.prototype.open = function (method, url) {
        // 保存请求URL
        this.__url = url;
        // 调用原始的 open 方法
        originalXhrOpen.apply(this, arguments);
    };

    // 重写 XMLHttpRequest 的 send 方法
    XMLHttpRequest.prototype.send = function (data) {
        var xhr = this;
        // 监听请求完成事件
        xhr.addEventListener('load', function () {
            // 检查是否是需要排除的域名，如果是则不处理
            if (xhr.__url.startsWith(excludeDomain)) {
                return; // 跳过监测
            }

            try {
                数据判断(xhr.__url, xhr.responseText)
            } catch (error) {
                console.error('Error in 数据判断:', error);
            }
        });
        // 调用原始的 send 方法
        originalXhrSend.apply(this, arguments);
    };

    // 监听 fetch 请求
    if (window.fetch) {
        var originalFetch = window.fetch;
        window.fetch = function (url, options) {
            // 调用原始的 fetch 方法
            return originalFetch.apply(this, arguments)
                .then(function (response) {
                    // 检查是否是需要排除的域名，如果是则不处理
                    if (response.url.startsWith(excludeDomain)) {
                        return response; // 跳过监测，直接返回响应
                    }

                    return response.text().then(function (text) {
                        数据判断(response.url, text);
                        return new Response(text, response);
                    });
                });
        };
    }
}

function 去除特殊符(filename) {
    return filename.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '');
}

var q_twitterid = '';
window.q_twitterjson = [];
function 数据判断(url, responseText) {
    if (url.includes('api/graphql/89OGj-X6Vddr9EbuwIEmgg/TweetDetail')) {
        //console.log(url)
        var twitterid = url.match(/%22(\d+)%/)[1];
        if (q_twitterid != twitterid) {
            q_twitterid = twitterid;
            window.q_twitterjson = [];
            // showToast('id发生改变了哦')
        }
        window.q_twitterjson.push(JSON.parse(responseText))
        console.log(window.q_twitterjson);
    } else {
        if (url.includes('api/graphql/xBtHv5-Xsk268T5ng_OGNg/TweetResultByRestId')) {
            try {
                window.q_twitterjson2 = JSON.parse(responseText);
            } catch (error) { console.log(error) }
        }
    }
}
// 定义请求头
