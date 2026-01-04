// ==UserScript==
// @name         知乎浏览体验优化
// @namespace    https://greasyfork.org/zh-CN/users/893587-limbopro
// @version      0.0.7
// @license      CC BY-NC-SA 4.0
// @description  优化PC端浏览未登录状态下浏览知乎体验：动态移除登录窗口、规避新标签页打开链接、首页登录页重定向至热门页面；
// @author       limbopro
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443993/%E7%9F%A5%E4%B9%8E%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443993/%E7%9F%A5%E4%B9%8E%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var zhihu_id = "zhihux"; // 定义一个 CSS ID
var zhihuAds = "div.css-1izy64v,[class='Card AppBanner'],.Footer,.Banner-link,div.Pc-word {display:none ! important; pointer-events: none !important;}"; // 广告样式优先级覆盖
buttonClick("[class='Button Modal-closeButton Button--plain']", 10); // 模拟点击行为
//buttonAppend("header[role='banner']", "清理中! ♻️", "undefined", "position:fixed; right:0px;", zhihu_id); // 在页面某个元素后面插入一个按钮
cssAdsRemove(zhihuAds, 100, "hloyx"); // 在 HTML HEAD 标签部分插入一个样式， 用以覆盖广告元素
rewriteToExplore(); // 若点击知乎首页按钮，则自动跳转到 Explore 页面 // 避免登录操作

/*
window.onload = hrefAttributeSet(500, zhihu_id); // 将所有属性为 _blank 的 a 标签，替换为 _self；避免点击当前页面内的链接在新标签页打开；
window.onload = addListener("a[class*='css-'],button[class='Button ContentItem-action Button--plain Button--withIcon Button--withLabel']", () => { hrefAttributeSet(500, zhihu_id) }); // 为热门页面的分类添加监听器，触发 hrefAttributeSet 动作；
// 循环监控整个页面可滚动高度 scrollHeight 是否变化
var body_scrollHeightCheck = setInterval(() => {
    var body_scrollHeight_then = document.body.scrollHeight;
    setTimeout(() => {
        var body_scrollHeight_now = document.body.scrollHeight;
        if (body_scrollHeight_now > body_scrollHeight_then) {
            hrefAttributeSet(500, zhihu_id);
        }
    }, 500);
}, 500);


// 循环监控答案页面可滚动高度 scrollHeight 是否变化
var comment_scrollHeightCheck = setInterval(() => {
    let comment = document.querySelectorAll("div.CommentListV2"); // div.CommentListV2 是相应触发按钮选择器
    if (comment.length > 0) {
        var comment_scrollHeight_then = comment[0].scrollHeight;
        setTimeout(() => {
            var comment_scrollHeight_now = comment[0].scrollHeight;
            if (comment_scrollHeight_now > comment_scrollHeight_then) {
                hrefAttributeSet(500, zhihu_id);
            }
        }, 500)
    }
}, 500)
*/

// 循环模拟模拟点击
function buttonClick(selector, times) {
    var initCount = 0;
    var loop = setInterval(() => {
        var ele = document.querySelectorAll(selector);
        if (ele.length > 0) {
            ele[0].click()
        }
        initCount += 1;
        if (initCount == times) {
            clearInterval(loop);
        }
    }, 0)
}

// 在页面动态插入按钮并赋予 onclick 属性
function buttonAppend(ele, text, onclick, position, id) {
    var button = document.createElement("button");
    button.innerHTML = text;
    button.setAttribute("onclick", onclick);
    button.setAttribute("id", id);
    var button_style_values = position + "padding: 6px 6px 6px 6px; display: inline-block; " +
        "font-size: 15px; color:white; z-index:114154; border-right: 6px solid #38a3fd !important; " +
        "border-left: #292f33 !important; border-top: #292f33 !important; " +
        "border-bottom: #292f33 !important; background: black; " +
        "border-radius: 0px 0px 0px 0px; margin-bottom: 10px; " +
        "font-weight: 800 !important; " +
        "text-align: right !important;"
    button.setAttribute("style", button_style_values);
    var here = document.querySelectorAll(ele);
    if (here.length > 0) {
        here[0].insertBefore(button, here[0].childNodes[3])
        //here[0].appendChild(button);
    }
}

// 动态创建引用内部资源 内嵌式样式 内嵌式脚本
function cssAdsRemove(newstyle, delaytime, id) {
    setTimeout(() => {
        var creatcss = document.createElement("style");
        creatcss.id = id;
        creatcss.innerHTML = newstyle;
        document.getElementsByTagName('head')[0].appendChild(creatcss)
    }, delaytime);
}

function rewriteToExplore() {
    let url = document.location.href;
    let cssSelector = "a[href='//www.zhihu.com/'],a[href='//www.zhihu.com'],a[href='https://www.zhihu.com']";
    let rewrite_url = "https://www.zhihu.com/knowledge-plan/hot-question/hot/0/hour";
    let reg = /^https:\/\/www.zhihu.com\/signin.*/gi;
    if (url.search(reg) !== -1) {
        window.location = rewrite_url;
    }

    setTimeout(() => { // 延时执行函数优化
        var ele = document.querySelectorAll(cssSelector)
        if (ele.length > 0) {
            let i;
            for (i = 0; i < ele.length; i++) {
                ele[i].href = rewrite_url;
            }
        }
    }, 300);
}

/*
function rewriteToExplore() { //跳转至热门话题 Explore 或 随机
    var url = document.location.href;
    var url_list = [
        "https://www.zhihu.com/knowledge-plan/hot-question/hot/",
    ]
    var rand = Math.floor(Math.random() * url_list.length);
    var url_random = url_list[rand];
    var reg = /^https:\/\/www.zhihu.com\/signin/gi;
    if (url.search(reg) !== -1) {
        window.location = url_random;
    }
}
*/

// 禁止新页面跳转另一种实现 循环
function hrefAttributeSet(time, id) {
    document.getElementById(id).style.background = "black";
    document.getElementById(id).innerHTML = "清理中! ♻️";
    setTimeout(() => {
        // 监控页面是否有新的 button
        let selector = "button[class*='Button PaginationButton']";
        let ele_button = document.querySelectorAll(selector);
        if (ele_button.length > 0) {
            window.onload = addListener(selector, () => { hrefAttributeSet(time, id) });
        }
        let times = 0;
        let loop = setInterval(() => {
            // 修改属性
            times += 1;
            let href = document.querySelectorAll("a");
            let i;
            for (i = 0; i < href.length; i++) {
                if (href[i].target == "_blank") {
                    href[i].setAttribute("target", "_self");
                }
            }
            let href_Length = document.querySelectorAll("a[target='_blank']").length;
            if (href_Length === 0 && times >= 2) {
                clearInterval(loop);
                if (document.getElementById(id)) {
                    document.getElementById(id).innerHTML = "100%! ♻️";
                    document.getElementById(id).style.background = "green";
                }
            }
        }, time)
    }, time)
}

/* 添加监听器 */
function addListener(selector, funx) {
    setTimeout(() => {
        var ele = document.querySelectorAll(selector);
        for (let index = 0; index < ele.length; index++) {
            ele[index].addEventListener("click", funx, false)
        }
    }, 1000)
}