// ==UserScript==
// @name         Andon Tweaker
// @namespace    andon
// @version      0.3.2
// @description  Andon tweaker
// @author       yaxinliu
// @match        *://andon.woa.com/ticket/detail/*
// @match        *://andon.cloud.tencent.com/ticket/detail/*
// @icon         https://ticket1000-1253841380.file.myqcloud.com/favicon%28andon2019-7-29%29.ico
// @grant        none
// @run-at       document-idle
// @license      Private
// @downloadURL https://update.greasyfork.org/scripts/397181/Andon%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/397181/Andon%20Tweaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 右侧小工具优化
    addCSS(`
    /* 滚动优化 */
    html {
        scroll-behavior: smooth;
    }
    /* 隐藏右侧工具栏 */
    .page-panel-main .responsive-width-container {
        transition: padding 0.3s ease 0s;
    }
    /* 左侧导航栏隐藏按钮样式 */
    .el-aside .switch-btn {
        cursor: pointer !important;
    }
    aside.el-aside {
        transition: width 0.3s ease 0s;
    }
    .reply-to-customer-editor.ticket-external-reply {
        "float": "left",
        "margin": "0 10px 10px 0",
        "box-shadow": "red 0px 0px 3px 0px",
        "border": "none"
    }

    #timeLines {
        overflow-y: hidden !important;
        max-height: inherit !important;
    }

    .fixed-box {
        right: 5px !important;
        bottom: 20% !important;
    }
    .fixed-box > .box {
        width: 30px !important;
        height: 45px !important;
    }
    .fixed-box .box+.box {
        margin-top: 10px !important;
    }
    .fixed-box > .box > div {
        height: 30px !important;
        width: 30px !important;
        line-height: 31px !important;
        background-size: 30px 30px !important;
        user-select: none;
    }
    /* 隐藏客户按钮 */
    .fixed-box > .box:nth-child(4) {
        display: none;
    }
    .smarty-bot .smarty-img {
        transform: scale(0.8) !important;
        margin-bottom: 3px !important;
        background-position-x: -1px !important;
    }
    /*智能客服*/
    .at-smarty-bot {
        width: 30px !important;
        height: 30px !important;
    }
    .fixed-box .box .el-icon-ali-copy-url {
        line-height: 30px !important;
    }
    .extend-pickup-pictures,
    .extend-rightbar,
    .scroll-to-top,
    .scroll-to-bottom {
        font-size: 30px;
        background-color: #006eff;
        color: #fff;
        transition: transform 0.3s ease 0s;
    }
    .extend-rightbar:hover {
        transform: rotate(90deg);
    }
    `);
    waitForElements([".at-smarty-bot", ".el-icon-ali-copy-url", ".responsive-width-right.responsive-width-column"], function() {
        // 替换提示文字
        let tipWordElems = document.querySelectorAll(".fixed-box .box > span");
        let wordsMap = {
            "一键拉群": "拉群",
            "智能客服": "客服",
            "万能链接": "链接"
        }
        tipWordElems.forEach(function(elem) {
            let w = wordsMap[elem.innerText];
            if (w) {
                elem.innerText = w;
            }
        });

        let attr = document.querySelector(".fixed-box .box").attributes[0].nodeName
        let fixedBoxElem = document.querySelector(".fixed-box");
        
        let mainContainer = document.querySelector(".page-panel-main .responsive-width-container");
        let rightSidebar = document.querySelector(".responsive-width-right.responsive-width-column");
        let rawRSidebarWidth = getStyle(rightSidebar, "width");
        let rawRSidebarHeight = getStyle(rightSidebar, "height");
        let rawMainRPadding = getStyle(mainContainer, "paddingRight");
        // 添加控制右侧工具栏的图标
        let toolboxManager = createElementFromHTML(`
        <div class="box" ${attr}>
            <div ${attr} title="展开/收起右侧工具栏" class="extend-rightbar el-icon-s-tools"></div>
            <span ${attr}>侧栏</span>
        </div>
        `);
        // 初始化为隐藏
        setStyle(rightSidebar, {
            "width": "0px",
            "height": "0px",
        })
        setStyle(mainContainer, {
            "paddingRight": "0px",
        })
        toolboxManager.onclick = function(e) {
            var width = "0px";
            var height = "0px";
            var paddingRight = "0px";
            if (getStyle(rightSidebar, "width") == "0px") {
                // 展开
                width = rawRSidebarWidth;
                height = rawRSidebarHeight;
                paddingRight = rawMainRPadding;
            }
            setStyle(rightSidebar, {
                "width": width,
                "height": height,
            })
            setStyle(mainContainer, {
                "paddingRight": paddingRight,
            })
        }
        fixedBoxElem.prepend(toolboxManager);

        // 添加一个显示图片的按钮
        let pickupPicElem = createElementFromHTML(`
        <div class="box" ${attr}>
            <div ${attr} title="展开/收起所有图片" class="extend-pickup-pictures el-icon-circle-plus-outline"></div>
            <span ${attr}>展图</span>
        </div>
        `);
        pickupPicElem.onclick = function(e) {
            let btn = document.querySelector(".el-button.el-button--default");
            fireEvent(btn, "click");

            let iconElem = btn.querySelector(".el-icon-plus,.el-icon-minus");
            let innerDiv = pickupPicElem.querySelector("div");
            if (iconElem.classList.contains("el-icon-plus")) {
                // 已经展开所有图片
                pickupPicElem.querySelector("span").innerText = "收图";
                innerDiv.classList.remove("el-icon-circle-plus-outline");
                innerDiv.classList.add("el-icon-remove-outline");
            } else {
                // 已经收起所有图片了
                pickupPicElem.querySelector("span").innerText = "展图";
                innerDiv.classList.remove("el-icon-remove-outline");
                innerDiv.classList.add("el-icon-circle-plus-outline");
            }
        }
        fixedBoxElem.appendChild(pickupPicElem);

        // 添加一个回到页面顶部和底部的按钮
        let scrollToTop = createElementFromHTML(`
        <div class="box" ${attr}>
            <div ${attr} title="回到页面顶部" class="scroll-to-top el-icon-caret-top"></div>
            <span ${attr}>顶部</span>
        </div>
        `)
        fixedBoxElem.prepend(scrollToTop)
        let scrollToBottom = createElementFromHTML(`
        <div class="box" ${attr}>
            <div ${attr} title="回到页面底部" class="scroll-to-bottom el-icon-caret-bottom"></div>
            <span ${attr}>底部</span>
        </div>
        `)
        fixedBoxElem.append(scrollToBottom)
        scrollToTop.onclick = scrollToBottom.onclick = function(e) {
            if (e.target.classList.contains("scroll-to-bottom")) {
                window.scrollTo(0, document.body.scrollHeight)
            } else {
                window.scrollTo(0, 0);
            }

        }
    });

    // 一些无关紧要的小动画
    addCSS(`
    `)

    function waitForElements(selector, callback)
    {
        let selectors = [selector];
        if (selector instanceof Array) {
            selectors = selector;
        }
        var elems = document.querySelectorAll(selectors);
        var timmer = null;

        if (elems.length != selectors.length) {
            // wait for all elements ready
            timmer = setInterval(() => {
                log("checking elements ready...");
                elems = document.querySelectorAll(selectors);
                if (elems.length == selectors.length) {
                    // element found
                    if (timmer) {
                        clearInterval(timmer)
                    }
                    callback();
                }
            }, 300);
        } else {
            callback();
        }
    }

    function getStyle(dom, property)
    {
        let styles = getComputedStyle(dom);
        let value = styles[property];
        if (value === undefined) {
            return null;
        }
        return value;
    }

    function setStyle(dom, property, value)
    {
        if (dom instanceof NodeList) {
            dom.forEach(function(elem) {
                _setStyleSingle(elem, property, value);
            });
            return;
        }
        _setStyleSingle(dom, property, value);
    }

    function addCSS(cssContent)
    {
        let styleElem = document.createElement("style");
        styleElem.innerHTML = cssContent;
        document.querySelector("body").appendChild(styleElem);
    }

    function _setStyleSingle(dom, property, value) {
        if (typeof property == "string") {
            dom.style[property] = value;
        } else {
            for (var k in property) {
                dom.style[k] = property[k];
            }
        }
    }

    function clearInlineStyle(dom, property)
    {
        if (property instanceof Array) {
            let properties = property;
        } else {
            let properties = [property];
        }

        properties.forEach(function(item) {

        });
    }

    function fireEvent(el, etype){
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            let evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    function log(msg)
    {
        console.info(msg);
    }
})();
