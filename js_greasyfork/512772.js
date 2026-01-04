// ==UserScript==
// @name         b站首页直播查看优化
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description   首页动态直播展示优化
// @author       口吃者
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512772/b%E7%AB%99%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%92%AD%E6%9F%A5%E7%9C%8B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/512772/b%E7%AB%99%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%92%AD%E6%9F%A5%E7%9C%8B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/* 
    1. 动态mouseenter状态时，重新请求获取一次数据，避免每次更新都需要点刷新
    2. 原先最大只可以显示5条，现在追加显示剩下的全部
*/
const live_up_list_url = "https://api.bilibili.com/x/polymer/web-dynamic/v1/live-up";
const ifLoadOk = false;
let currentIntervalId; // 用于存储当前的定时器 ID
let ups = [];
let singleUpHtmlTemplet;
class BiUp {
    constructor(face, isReserveRecall, link, mid, uname) {
        this.face = face;          // 用户头像链接
        this.isReserveRecall = isReserveRecall; // 是否保留召回标志，通常是一个布尔值
        this.link = link;          // 用户主页链接
        this.mid = mid;            // 用户ID
        this.uname = uname;        // 用户名
    }
    getDetails() {
        return `User Name: ${this.uname}, User ID: ${this.mid}, Link: ${this.link}`;
    }

    getLiveUpItemDom() {
        var htmlTemplet = singleUpHtmlTemplet;
        // 创建 DOMParser 对象
        const parser = new DOMParser();
        var doc = parser.parseFromString(htmlTemplet, 'text/html');
        //http -> https 防报错
        doc.querySelector("a").href = updateProtocol(this.link) + "?live_from=82002"; // 链接后还有 live_from 来源参数，可以不添加
        //图像 @84w_84裁剪成84*84像素
        doc.querySelector("picture :nth-child(1)").srcset = updateProtocol(this.face) + "@84w_84h.avif";
        doc.querySelector("picture :nth-child(2)").srcset = updateProtocol(this.face) + "@84w_84h.webp";
        doc.querySelector("picture :nth-child(3)").srcset = updateProtocol(this.face) + "@84w_84h";
        doc.querySelector(".up-name").textContent = this.uname;
        return doc;
    }

}
(function () {
    'use strict';
    ups = getLiveUpList();
    window.addEventListener("load", () => {
        loadLivingUp();
        //每次mouseenter 都重新加载一次
        let dynamicEle = document.querySelector("ul.right-entry > li:nth-child(4)");
        dynamicEle.addEventListener("mouseenter", function () {
            console.log("mouseenter--55");
            startChecking();
        });

        dynamicEle.addEventListener("mouseleave", function () {
            clearInterval(currentIntervalId);
        });
    });
    // console.log(ups);
    // Your code here...
})();
async function getLiveUpList() {
    // console.log(currentIntervalId);
    console.log("重新加载");
    let url = live_up_list_url;
    let ups = [];
    fetch(
        url,
        {
            method: 'GET',
            credentials: 'include', // 使得请求会发送 Cookie
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
        }
    ).then(response => response.json())
        .then(data => {
            if (data.code !== 0) {
                console.log("没有直播up");
                return;
            }
            const upData = data.data.items;
            upData.forEach(item => {
                let face = item.face;
                let isReserveRecall = item.is_reserve_recall;
                let link = item.link;
                let mid = item.mid;
                let uname = item.uname;
                let up = new BiUp(face, isReserveRecall, link, mid, uname);
                ups.push(up);
            });
            // console.log('Fetched UPS:', ups); // 检查是否正确填充了 ups
            return [...ups]; // 返回一个新数组，避免外部修改原数组
        }) // 打印解析后的数据
        .catch(error => console.error('Error:', error)); // 捕获任何发生的错误
    return ups;
}
function optimizeLiveUpList(ups) {
    const livingUpList = document.querySelector('.living-up-list');
    livingUpList.style.flexWrap = 'wrap'; // 使用属性方式设置样式，更高效
    livingUpList.innerHTML = '';

    // 检查ups是否为Promise
    if (ups instanceof Promise) {
        // 如果是Promise，解析后处理
        ups.then((array) => {
            renderItems(array);
        }).catch((error) => {
            console.error('An error occurred while fetching data:', error);
        });
    } else if (Array.isArray(ups)) {
        // 如果已经是数组，直接处理
        renderItems(ups);
    } else {
        console.error('ups must be an array or a Promise that resolves to an array.');
    }
}
async function loadLivingUp() {
    // 获取目标元素
    const target = document.querySelector('ul.right-entry > li:nth-child(4)');

    // 创建 mouseenter 事件
    const mouseEnterEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    // 触发 mouseenter 事件
    target.dispatchEvent(mouseEnterEvent);
    // 2024-12-26 这里获取单个直播up元素的html模板，根本解决bug
    await new Promise(resolve => setTimeout(resolve, 1000));
    const singleUpHtml = document.querySelector('.living-up-list>a:nth-child(1)');
    singleUpHtmlTemplet = singleUpHtml ?
        singleUpHtml.outerHTML :
        `
        <a data-v-e789ddd2="" class="up-item" target="_blank" data-mod="top_right_bar_window_dynamic" data-idx="content"
            data-ext="click" href="https://live.bilibili.com/21587367?live_from=82002" style="transform: translateX(0px);">
            <div data-v-e789ddd2="" class="up-avatar">
                <picture data-v-e789ddd2="" class="v-img up-avatar__img">
                    <source srcset="//i0.hdslb.com/bfs/face/57550946b06a4a9c24a70a1b7159c25ad7bdf383.jpg@84w_84h.avif"
                        type="image/avif">
                    <source srcset="//i0.hdslb.com/bfs/face/57550946b06a4a9c24a70a1b7159c25ad7bdf383.jpg@84w_84h.webp"
                        type="image/webp"><img
                        src="//i0.hdslb.com/bfs/face/57550946b06a4a9c24a70a1b7159c25ad7bdf383.jpg@84w_84h" alt="" loading="lazy"
                        onload="" onerror="typeof window.imgOnError === 'function' &amp;&amp; window.imgOnError(this)">
                </picture>
            </div>
            <div data-v-e789ddd2="">
                <div data-v-e789ddd2="" class="up-name">老蒋巨靠谱</div>
            </div>
        </a>
        `
    optimizeLiveUpList01(target);
}
async function optimizeLiveUpList01(target) {
    await new Promise(resolve => setTimeout(resolve, 100));
    // 创建 mouseleave 事件
    const mouseLeaveEvent = new MouseEvent('mouseleave', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    // 触发 mouseleave 事件，立即取消 mouseenter 状态
    target.dispatchEvent(mouseLeaveEvent);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (ups.length > 0) {
        optimizeLiveUpList(ups);
    }
}
function updateProtocol(url) {
    // 检查字符串是否以 "http:" 开头
    if (url.startsWith('http:')) {
        // 替换 "http:" 为 "https:"
        return url.replace('http:', 'https:');
    } else {
        // 如果不是以 "http:" 开头，则直接返回原字符串
        return url;
    }
}
async function startChecking() {
    if (currentIntervalId) {
        clearInterval(currentIntervalId); // 如果已经有定时器在运行，则先清除之前的定时器
    }

    currentIntervalId = setInterval(async () => {
        try {
            const ups = await getLiveUpList();//await已经解析promise为数组
            await new Promise(resolve => setTimeout(resolve, 500));//不加延迟同步不生效
            //   console.log("ups:", ups);
            //   console.log("ups.length:", ups.length);
            if (ups.length > 0) {
                clearInterval(currentIntervalId); // 清除定时器
                optimizeLiveUpList(ups); // 请求成功时运行优化函数
            }
        } catch (error) {
            console.error('Error checking live up list:', error);
        }
    }, 500); // 每隔 1 秒检查一次
}
// 抽离渲染逻辑到单独的函数
function renderItems(array) {
    let livingUpList = document.querySelector('.living-up-list');
    array.forEach((element, index) => {
        const linkElement = element.getLiveUpItemDom().querySelector('a');
        if (linkElement) {
            livingUpList.appendChild(linkElement);
        } else {
            console.warn(`Element at index ${index} does not contain an 'a' tag.`);
        }
    });
}