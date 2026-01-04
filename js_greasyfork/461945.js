// ==UserScript==
// @name        知乎网页端图片加载助手
// @version     v0.1
// @description 当加载超时或失败时自动尝试重加载知乎网页端图片。
// @match       *://*.zhihu.com/*
// @run-at      document-start
// @license     MIT
// @namespace   https://gist.github.com/guiqiqi/48114e118a8bf79f9baf57b7ccbe6434
// @downloadURL https://update.greasyfork.org/scripts/461945/%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461945/%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", function() {
    'use strict';
    const Timeout = 10000;
    const nodes = [
        "pic1.zhimg.com", "pic2.zhimg.com", 
        "pic3.zhimg.com", "pic4.zhimg.com"
    ];
    let count = 0;
    const observers = [];
    const images = document.querySelectorAll("img.lazy");
    console.log("获取到图片集合");
    // 在底栏中显示重加载数量
    function indicate(reloaded) {
        const indicator = document.getElementById("reload-indicator");
        indicator.textContent = reloaded;
    }
    // 从数组中选择一个随机值
    function choice(xs) {
        return xs[Math.floor(Math.random() * xs.length)];
    }
    // 替换无法加载的 url 到其余的 CDN 节点
    function reload(image) {
        const url = new URL(image.src);
        url.host = choice(nodes.filter((host) => {return host != url.host}));
        failed(image);
        loaded(image);
        indicate(++count);
        image.src = url.toString();
    }
    // 监听图片的懒加载事件
    function listen(image) {
        const binding = {};
        const observer = new MutationObserver(function(mutations) {
            loading(mutations[0].target);
        });
        binding[image.getAttribute("data-actualsrc")] = observer;
        observer.observe(image, {
            attributes: true, 
            attributeFilter: ["src"]
        });
        observers.push(binding);
    }
    // 图片加载错误事件
    function failed(image) {
        image.addEventListener("error", function (event) {
            const old = event.target.src;
            reload(event.target);
            console.log(`图片 ${old} 加载失败 - 替换为 ${event.target.src} 重新加载`);
        });
    }
    // 图片加载超时事件
    function timeout(image) {
        if (image.complete) {
            return;
        }
        const old = image.src;
        reload(image);
        console.log(`图片 ${old} 加载超时 - 替换为 ${image.src} 重新加载`);
    }
    // 图片开始加载事件
    function loading(image) {
        console.log(`图片 ${image.src} 开始加载`);
        setTimeout(function () {
            timeout(image);
        }, Timeout);
    }
    // 图片加载成功事件
    function loaded(image) {
        image.addEventListener("load", function (event) {
            console.log(`图片 ${event.target.src} 加载成功`);
        });
    }
    // 给所有的图片绑定事件
    images.forEach(listen);
    images.forEach(failed);
    images.forEach(loaded);
    // 添加 indicator 在右下角
    const corner = document.getElementsByClassName("CornerAnimayedFlex");
    if (corner.length) {
        console.log("添加指示器");
        const button = document.createElement("button");
        button.classList.add("Button");
        button.classList.add("Button--plain");
        button.style.width = "40px";
        button.style.height = "40px";
        button.style.cursor = "default";
        const indicator = document.createElement("span");
        indicator.setAttribute("id", "reload-indicator");
        button.appendChild(indicator);
        corner[0].style.height = "92px";
        corner[0].prepend(button);
    }
});