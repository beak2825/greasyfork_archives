// ==UserScript==
// @name         隐藏 Wikiwand 中的多余元素及添加跳转 Youtube 与 Bilibili 的按钮
// @name:en      Hide Superfluous Elements in Wikiwand & Add search button to Youtube and Bilibili
// @namespace    Black Rabbit
// @author       Black Rabbit
// @version      0.1.4
// @description  删除 Wikiwand 中的多余元素，在工具栏添加跳转 Youtube 和 Bilibili 的按钮。可根据你的网络状态自行调整脚本头部的重复超时值。可自定义要显示的按钮类型。
// @description:en  Hide Superfluous Elements in Wikiwand, in toolbar add a button that jump to Youtube and Bilibili. Custom the repeating timeout value in the head of the script according your network state. Custom the button type.
// @match        *://www.wikiwand.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikiwand.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477110/%E9%9A%90%E8%97%8F%20Wikiwand%20%E4%B8%AD%E7%9A%84%E5%A4%9A%E4%BD%99%E5%85%83%E7%B4%A0%E5%8F%8A%E6%B7%BB%E5%8A%A0%E8%B7%B3%E8%BD%AC%20Youtube%20%E4%B8%8E%20Bilibili%20%E7%9A%84%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/477110/%E9%9A%90%E8%97%8F%20Wikiwand%20%E4%B8%AD%E7%9A%84%E5%A4%9A%E4%BD%99%E5%85%83%E7%B4%A0%E5%8F%8A%E6%B7%BB%E5%8A%A0%E8%B7%B3%E8%BD%AC%20Youtube%20%E4%B8%8E%20Bilibili%20%E7%9A%84%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

var timeout = 2000; // repeat hiding behaviour for 2000 ms
var videotype = 2; // 0 for only Youtube, 1 for only Bilibili, 2 for both of them
var itv;
var already = false;
var title;
var parent;

function runScript() {
    if (window.location.href.includes("www.wikiwand.com")) {
        if (window.location.pathname === '/' && !already) {
            itv = setInterval(homepage,50);
            console.log("start interval: homepage");
            already = true;
        } else if (!already) {
            itv = setInterval(dtpage,50);
            console.log("start interval: dtpage");
            already = true;
        }
        setTimeout (function () {
            if (already){
                clearInterval (itv);
                console.log("stop interval");
                already = false;
            }
        }, timeout);
    }
}

// first run
runScript();

// run when head changed
var observer = new MutationObserver(function(mutations) {
    for (var mutation of mutations) {
        if (mutation.type === 'childList') { // || mutation.type === 'attributes' mutation.type === 'childList'
            runScript();
        }
    }
});
var targetNode = document.head;
var config = { childList: true, subtree: true}; // , attributes: true, subtree: true
observer.observe(targetNode, config);

// run when backward or forward
window.onpopstate = function (event) { //.onpopstate
    if (window.location.href.includes("www.wikiwand.com")) {
        if (window.location.pathname === '/') {
            // 如果路径是根目录
            itv = setInterval(homepage,50);
            console.log("start interval: homepage");
        } else {
            // 如果路径是其他
            itv = setInterval(dtpage,50);
            console.log("start interval: dtpage");
        }
        setTimeout (function () {
            clearInterval (itv);
            console.log("stop interval");
        }, timeout);
    }
};

// detail page
function dtpage() {
    var elements = document.querySelectorAll('[class^="navbar_install__"]');
    for (var e of elements) {
        e.style.display = "none";
    }
    var footers = document.querySelectorAll('[class^="footer_wrapper__"]');
    for (var e of footers) {
        e.style.display = "none";
    }
    // get title for searching
    var titles = document.querySelectorAll('h1.section-h');
    for (var e of titles) {
        title = e.textContent;
    }
    // get parent for injecting
    //parent = document.querySelector('use[href="/images/icons.svg#icon-lang"]').parentElement.parentElement;
    parent = document.querySelector('ul.navbar_icons__2bQ22 > :nth-child(5)');
    // add video button
    add();
}

// home page
function homepage() {
    var buttons = document.querySelectorAll('[class^="navbar_button__"]');
    for (var e of buttons) {
        e.style.display = "none";
    }
    var footers = document.querySelectorAll('[class^="footer_wrapper__"]');
    for (var e of footers) {
        e.style.display = "none";
    }
    var sticky = document.querySelectorAll('[class*="navbar_sticky__"]');
    for (var e of sticky) {
        e.style.display = "none";
    }
    var hero_stores = document.querySelectorAll('[class*="hero_stores__"]');
    for (var e of hero_stores) {
        e.style.display = "none";
    }
    var hero_videoWrapper = document.querySelectorAll('[class*="hero_videoWrapper__"]');
    for (var e of hero_videoWrapper) {
        e.style.display = "none";
    }
    var themes_wrapper = document.querySelectorAll('[class*="themes_wrapper__"]');
    for (var e of themes_wrapper) {
        e.style.display = "none";
    }
    var try_wrapper = document.querySelectorAll('[class*="try_wrapper__"]');
    for (var e of try_wrapper) {
        e.style.display = "none";
    }
    var listen_wrapper = document.querySelectorAll('[class*="listen_wrapper__"]');
    for (var e of listen_wrapper) {
        e.style.display = "none";
    }
    var features_wrapper = document.querySelectorAll('[class*="features_wrapper__"]');
    for (var e of features_wrapper) {
        e.style.display = "none";
    }
    var summaries_wrapper = document.querySelectorAll('[class*="summaries_wrapper__"]');
    for (var e of summaries_wrapper) {
        e.style.display = "none";
    }
    var support_wrapper = document.querySelectorAll('[class*="support_wrapper__"]');
    for (var e of support_wrapper) {
        e.style.display = "none";
    }
    var mobile_wrapper = document.querySelectorAll('[class*="mobile_wrapper__"]');
    for (var e of mobile_wrapper) {
        e.style.display = "none";
    }
    var bling_wrapper = document.querySelectorAll('[class*="bling_wrapper__"]');
    for (var e of bling_wrapper) {
        e.style.display = "none";
    }
    var underline_underline = document.querySelectorAll('[class*="underline_underline__"]');
    for (var e of underline_underline) {
        e.style.display = "none";
    }
}

// function addbutton() {
//     // https://www.youtube.com/results?search_query=
//     setTimeout(function(){console.log(title);},2000);
//     setTimeout(function(){console.log(parent);},2000);
// }

var added = false;
function add() {
    if (title && parent && !added) {
        console.log("title and parent appeared !!!!! button added !!!");
        added = true;
        if (videotype === 0){
            youtubeBtn();
        }
        else if (videotype === 1){
            bilibiliBtn();
        }
        else if (videotype === 2){
            bilibiliBtn();
            youtubeBtn();
        }
        function youtubeBtn() {
            var li = document.createElement('li');
            li.className = 'navbar_item__8AUpD youtube-button';
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('t', '1696956270714');
            svg.setAttribute('class', 'icon');
            svg.setAttribute('viewBox', '-88 -88 1200 1200');
            svg.setAttribute('version', '1.1');
            svg.setAttribute('p-id', '10969');
            svg.setAttribute('width', '38');
            svg.setAttribute('height', '38');
            svg.setAttribute('fill', 'currentcolor');
            svg.innerHTML = '<path d="M992 268.8s0-3.2 0 0c-12.8-54.4-54.4-96-105.6-112-73.6-16-342.4-19.2-374.4-19.2s-300.8 0-374.4 22.4C83.2 172.8 44.8 214.4 32 268.8c-12.8 76.8-19.2 153.6-19.2 230.4 0 76.8 6.4 156.8 22.4 236.8 12.8 51.2 54.4 89.6 105.6 105.6 70.4 19.2 339.2 19.2 371.2 19.2s300.8 0 374.4-22.4c51.2-16 92.8-57.6 105.6-112 12.8-76.8 19.2-153.6 19.2-230.4 3.2-73.6-3.2-150.4-19.2-227.2z m-60.8 448c-6.4 28.8-32 54.4-60.8 60.8-57.6 16-278.4 19.2-358.4 19.2s-300.8-3.2-358.4-19.2c-28.8-6.4-51.2-32-60.8-57.6-12.8-73.6-19.2-147.2-19.2-220.8 0-73.6 6.4-147.2 19.2-217.6 6.4-28.8 32-54.4 60.8-60.8 57.6-16 278.4-19.2 358.4-19.2s300.8 3.2 358.4 16c28.8 9.6 51.2 32 60.8 60.8 12.8 73.6 19.2 147.2 19.2 220.8 0 76.8-6.4 147.2-19.2 217.6z m-252.8-243.2l-246.4-140.8c-9.6-6.4-22.4-6.4-32 0-9.6 6.4-16 19.2-16 28.8V640c0 12.8 6.4 22.4 16 28.8 6.4 3.2 9.6 3.2 16 3.2s9.6 0 16-3.2l246.4-140.8c9.6-6.4 16-16 16-28.8s-6.4-19.2-16-25.6zM448 585.6V416l147.2 83.2-147.2 86.4z" p-id="7708"></path>';
            li.appendChild(svg);
            function openYoutube() {
                window.open("https://www.youtube.com/results?search_query=" + title);
            }
            li.addEventListener('click', openYoutube);
            parent.insertAdjacentElement('afterend', li);
        }

        function bilibiliBtn() {
            var li2 = document.createElement('li');
            li2.className = 'navbar_item__8AUpD bilibili-button';
            var svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg2.setAttribute('t', '1698482736673');
            svg2.setAttribute('class', 'icon');
            svg2.setAttribute('viewBox', '-88 -88 1200 1200');
            svg2.setAttribute('version', '1.1');
            svg2.setAttribute('p-id', '15432');
            svg2.setAttribute('width', '39');
            svg2.setAttribute('height', '39');
            svg2.setAttribute('fill', 'currentcolor');
            svg2.innerHTML = '<path d="M461.2096 711.8336c-10.9056 0-21.8112-2.816-31.7952-8.4992-20.4288-11.5712-32.6144-32.512-32.6144-56.0128V451.84c0-23.5008 12.1856-44.4416 32.6144-56.0128s44.6464-11.3152 64.8192 0.7168l163.6352 97.7408c19.6608 11.7248 31.3856 32.4096 31.3856 55.296 0 22.8864-11.7248 43.5712-31.3856 55.296l-163.6352 97.7408c-10.2912 6.144-21.6576 9.216-33.024 9.216z m0.0512-263.0144c-0.4096 0-0.9216 0.1024-1.4848 0.4608-1.4848 0.8704-1.4848 1.9968-1.4848 2.56v195.4816c0 0.5632 0 1.7408 1.4848 2.56 1.4848 0.8704 2.5088 0.256 2.9696-0.0512l163.6352-97.7408c0.4096-0.256 1.4336-0.8704 1.4336-2.56 0-1.6896-1.024-2.304-1.4336-2.56L462.6944 449.28c-0.256-0.1536-0.768-0.4608-1.4336-0.4608z" p-id="26218"></path><path d="M767.1296 227.0208h-95.744l68.7104-63.4368a30.78656 30.78656 0 0 0 1.7408-43.4176 30.74048 30.74048 0 0 0-43.4176-1.7408l-117.5552 108.5952H473.5488L355.9936 118.4256a30.6944 30.6944 0 0 0-43.4176 1.7408 30.6944 30.6944 0 0 0 1.7408 43.4176l68.7104 63.4368H268.8c-92.3648 0-167.5264 75.1616-167.5264 167.5264v330.5984c0 92.3648 75.1616 167.5264 167.5264 167.5264h498.3296c92.3648 0 167.5264-75.1616 167.5264-167.5264V394.5472c0-92.3648-75.1616-167.5264-167.5264-167.5264z m106.0864 498.1248c0 58.5216-47.616 106.0864-106.0864 106.0864H268.8c-58.5216 0-106.0864-47.616-106.0864-106.0864V394.5472c0-58.5216 47.616-106.0864 106.0864-106.0864h498.3296c58.5216 0 106.0864 47.616 106.0864 106.0864v330.5984z" p-id="26219"></path>';
            li2.appendChild(svg2);
            function openBilibili() {
                window.open("https://search.bilibili.com/video?keyword=" + title);
            }
            li2.addEventListener('click', openBilibili);
            parent.insertAdjacentElement('afterend', li2);
        }

    }
}

//addbutton();