// ==UserScript==
// @name         电影天堂跳转豆瓣搜索
// @match        *://www.dytt8.net/*
// @match        *://www.ygdy8.com/*
// @match        *://www.dydytt.net/*
// @match        *://www.6v520.com/*
// @match        *://www.6v520.net/*
// @match        *://www.meijutt.tv/*
// @namespace    http://mdkml.cn
// @version      1.0
// @description  在电影天堂、阳光电影、6v电影网、美剧天堂等网站搜到的影片，可以快捷的跳转到豆瓣搜索页面、跳转到下载地址。查看评分、评论、演员信息等
// @author       MDKML
// @icon         http://mdkml.cn/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428129/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E8%B7%B3%E8%BD%AC%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/428129/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E8%B7%B3%E8%BD%AC%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var div = document.createElement('div')
    div.id = 'search-app-box'
    div.style = "position: fixed; top: 120px; left: 20px; font-size: 12px;background-color: #fff;border-radius: 10px;z-index: 9999999999999999;"
    document.body.insertAdjacentElement("afterBegin", div);

    var h = document.getElementsByTagName("H1")
    if (!h || !h[0]) {
        return;
    }
    var name = h[0].innerText;
    if (name.includes("《")) {
        name = name.split("《")[1]
    }
    if (name.includes("》")) {
        name = name.split("》")[0]
    }
    if (name.includes("/")) {
        name = name.split("/")[0]
    }
    let dbss = document.createElement('a')
    dbss.innerText = "豆瓣搜索"
    var style = "display: block;padding:10px;font-size: 18px; font-weight: bold;color:#072;cursor:pointer;border-radius: 25px;text-decoration:none;"
    dbss.style = style
    // 鼠标移入移除效果，相当于hover
    dbss.onmouseenter = function () {
        this.style = style + "color: #ffffff; background-color: #0084ff;box-shadow:0 0 0 10000px rgba(0,0,0,0.3);";
    }
    dbss.onmouseleave = function () {
        this.style = style + "color: #072;";
    }
    dbss.onclick = function () {
        window.open("https://search.douban.com/movie/subject_search?search_text=" + encodeURI(name));
    }
    let xzdz = document.createElement('a')
    xzdz.innerText = "下载地址"
    xzdz.style = style
    // 鼠标移入移除效果，相当于hover
    xzdz.onmouseenter = function () {
        this.style = style + "color: #ffffff; background-color: #0084ff;box-shadow:0 0 0 10000px rgba(0,0,0,0.3);";
    }
    xzdz.onmouseleave = function () {
        this.style = style + "color: #072;";
    }
    xzdz.onclick = function () {
        var targetOffset = null
        var currentURL = window.location.href;
        if (currentURL.includes('6v520')) {
            targetOffset = getEleOffsetTopByText('span', '下载地址');
        }
        if (currentURL.includes('meijutt')) {
            targetOffset = document.getElementsByClassName("o_list_cn_r")[0].offsetTop;
        }
        if (currentURL.includes('dydytt') || currentURL.includes('dytt8') || currentURL.includes('ygdy8')) {
            targetOffset = getEleOffsetTopByText('font', '温馨提示');
        }
        if (targetOffset) {
            targetOffset -= 200;
            smoothScrollTo(targetOffset, 500);
        }

    }
    div.appendChild(dbss)
    div.appendChild(xzdz)

    h[0].appendChild(div);
    // Your code here...
})();

/**
 * 通过元素内容获取顶部偏移像素
 * @param 元素标签
 * @param 元素内容
 * @return 顶部偏移像素
 * @author mdkml
 * @date  2024/9/28 20:17
 */
function getEleOffsetTopByText(ele, text) {
    // 获取所有的span元素
    var spans = document.querySelectorAll(ele);

    // 遍历所有span元素
    for (var i = 0; i < spans.length; i++) {
        // 检查span元素的文本内容是否包含指定的文本
        if (spans[i].textContent.includes(text)) {
            // 如果包含，返回该元素的offsetTop值
            return spans[i].offsetTop;

            // 注意：如果页面中有多个span包含相同的文本，这里只会返回第一个找到的元素的offsetTop。
            // 如果需要处理所有匹配的元素，可以在这里稍作修改。
        }
    }

    // 如果没有找到匹配的span元素，返回null或者一个默认值
    return -1;
}

/**
 * 通过元素内容获取顶部偏移像素
 * @param 元素内容
 * @return 顶部偏移像素
 * @author mdkml
 * @date  2024/9/28 20:03
 */
function getSpanOffsetTopByText(text) {
    // 获取所有的span元素
    var spans = document.querySelectorAll('span');

    // 遍历所有span元素
    for (var i = 0; i < spans.length; i++) {
        // 检查span元素的文本内容是否包含指定的文本
        if (spans[i].textContent.includes(text)) {
            // 如果包含，返回该元素的offsetTop值
            return spans[i].offsetTop;

            // 注意：如果页面中有多个span包含相同的文本，这里只会返回第一个找到的元素的offsetTop。
            // 如果需要处理所有匹配的元素，可以在这里稍作修改。
        }
    }

    // 如果没有找到匹配的span元素，返回null或者一个默认值
    return -1;
}

/**
 * 缓慢滚动页面
 * @param 滚动结束位置
 * @param 滚动时间
 * @author mdkml
 * @date  2024/9/28 20:02
 */
function smoothScrollTo(targetOffset, duration) {
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
    const element = window; // 滚动的是整个窗口

    // 滚动函数
    function scroll() {
        const time = 'now' in window.performance ? performance.now() : new Date().getTime();
        const timeElapsed = time - startTime;

        // 计算当前应该滚动的位置
        const run = easeInOutQuad(timeElapsed, 0, targetOffset, duration);
        element.scrollTo(0, Math.round(run));

        // 如果滚动未完成，则继续请求动画帧
        if (timeElapsed < duration) requestAnimationFrame(scroll);
    }

    // 缓动函数，这里使用二次方缓入缓出（easeInOutQuad）
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // 开始滚动
    scroll();
}

