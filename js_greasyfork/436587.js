// ==UserScript==
// @name         【图灵】推特自动复制好友用户名
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  推特自动复制好友用户名   打开推特关注的好友页面 自动滚动到底加载所有好友   点击顶部新增的按钮自动随机 所有的好友 取其中5个 如果需要更多多随机几次即可
// @author       TolingSoft
// @match        *://twitter.com/*
// @match        *://twitter.com/intent/tweet*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436587/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91%E6%8E%A8%E7%89%B9%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E5%A5%BD%E5%8F%8B%E7%94%A8%E6%88%B7%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/436587/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91%E6%8E%A8%E7%89%B9%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E5%A5%BD%E5%8F%8B%E7%94%A8%E6%88%B7%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    (async function () {
        addOpenan();
        addcopy3an();
        //滚动处理
        var A = 999;
        var pagedown = setInterval(() => {
            // 判断是否是弹出窗口
            if (window.innerWidth == 800) {

                document.documentElement.scrollTop += A
                if (document.documentElement.scrollTop >= 99900) {
                    clearInterval(pagedown)
                    console.log("清空自动滚动");
                }
                console.log("顶部", document.documentElement.scrollTop);
            }
        }, 10);
        // //判断网页url包含?auto=true则处理
        // if (window.location.href.indexOf("?auto=true") != -1) {
        //     setTimeout(() => {
        //         console.log("自动复制");
        //         button.click()
        //     }, 5000);
        // }

        var clipboard = new ClipboardJS('.btn');

        clipboard.on('success', function (e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);

            e.clearSelection();

            // 判断是否是弹出窗口
            if (window.innerWidth == 800) {

                console.log("复制成了！自动关闭网页");
                window.close();
            }
        });

        clipboard.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });




    })();
    async function addcopy3an() {
        while (true) {

            if (!document.querySelector(".add3hy")) {
                var divs = await FindDoms("nav[role=navigation]");
                console.log("测试", divs);
                var dom = divs[1];
                // 在dom后面插入一个button
                //网址包含/followers
                if (window.location.href.indexOf("/followers") > -1) {
                    var button = document.createElement("button");
                    button.className = "add3hy";
                    button.innerHTML = "随机选择5个好友<br>(自动向下滚动加载 等待越久选择范围越广)";
                    button.style = `
                        border-radius: 9999px;
                        padding: 16px;
                        padding-right: 16px;
                        background-color: rgb(91 255 0);
                        border: none;
                        font-size: 16px;
                        font-weight: bold;
                        color: #000000;
                        `;
                    button.onclick = async function () {
                        await Get3();
                    }
                    dom.parentNode.insertBefore(button, dom);
                }
            }
            await Delay(1000);
        }
    }
    async function addOpenan() {
        while (true) {

            var dom = await FindDom("div[role=group]");
            if (dom) {
                if (!dom.querySelector(".addhylb")) {
                    //网址为 https://twitter.com/compose/tweet才处理
                    if (window.location.href.indexOf("/compose/tweet") != -1) {
                        var button = document.createElement("button");
                        button.className = "addhylb";
                        button.innerHTML = "打开好友列表页";
                        button.style = `
                            position: fixed;
                            border-radius: 9999px;
                            padding: 16px;
                            padding-right: 16px;
                            background-color: rgb(91 255 0);
                            border: none;
                            font-size: 18px;
                            font-weight: bold;
                            color: #000000;
                            `;
                        button.onclick = function () {
                            //打开一个弹窗 宽高为800*600
                            window.open("https://twitter.com/followers", "", "width=800,height=600");
                        }
                        dom.appendChild(button);
                    }
                }
            }
            await Delay(1000);
        }
    }

    async function Get3() {
        var html = document.querySelector("div[data-testid=primaryColumn]").innerHTML;
        console.log("html", html);
        //从html里面正则匹配出来@shzyjbrwry
        var reg = /@[a-zA-Z0-9_]+/g;
        var arr = html.match(reg);
        if (!arr || arr == null || arr == undefined || arr.length < 3) {
            //延迟1秒再执行
            await Delay(500)
            return await Get3();
        }

        //转换为数组 
        var arr2 = arr.map(function (item) {
            return item;
        });
        // 删除第一个元素
        arr2.shift();
        //去重
        var arr3 = Array.from(new Set(arr2));
        //随机选择3个
        var arr4 = arr3.sort(function () {
            return Math.random() - 0.5;
        }).slice(0, 5);
        console.log("arr4", arr4);
        //把选择的3个好友 空格隔开
        var str = arr4.join(" ");
        await Copy(str);
        //弹出div提示成功  3秒后消失
        var div = document.createElement("div");
        div.innerHTML = "复制成功";
        div.style.position = "fixed";
        div.style.top = "0";
        div.style.left = "0";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.background = "rgba(0,0,0,0.5)";
        div.style.color = "white";
        div.style.textAlign = "center";
        div.style.lineHeight = "100px";
        div.style.fontSize = "30px";
        div.style.zIndex = "9999";
        div.onclick = function () {
            div.remove();
        }
        document.body.appendChild(div);
        setTimeout(function () {
            document.body.removeChild(div);
        }, 1000);
    }
    //根据selector 查找dom 找到则点击 找不到递归查找
    async function FindDomClick(selector) {
        var dom = await FindDom(selector);
        if (dom) {
            console.log("元素点击了!", selector, dom);
            dom.click();
            return;
        }
        await Delay(500);
        await FindDomClick(selector);
    }

    //根据selector 查找dom
    async function FindDom(selector) {
        var dom = document.querySelector(selector);
        if (dom && dom != null && dom != undefined) {
            return dom;
        }
        await Delay(500);
        return await FindDom(selector);
    }
    //根据selector 查找doms
    async function FindDoms(selector) {
        var dom = document.querySelectorAll(selector);
        if (dom && dom != null && dom != undefined && dom.length > 0) {
            return dom;
        }
        await Delay(500);
        return await FindDoms(selector);
    }
    //延时
    function Delay(second) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(null);
            }, second);
        });
    }

    //复制
    async function Copy(value) {
        const otextarea = document.querySelector("#bar") ?? document.createElement('textarea')
        otextarea.id = "bar";
        otextarea.value = value;
        //显示到最顶部 宽高100*100
        otextarea.style.position = "fixed";
        otextarea.style.top = "0";
        otextarea.style.left = "0";
        otextarea.style.width = "100px";
        otextarea.style.height = "100px";
        otextarea.style.zIndex = "9999";
        document.body.appendChild(otextarea)


        const obutton = document.createElement('button')
        obutton.setAttribute('data-clipboard-target', '#bar')
        obutton.className = "btn"
        document.body.appendChild(obutton)

        obutton.click();

        document.body.removeChild(obutton)

    }
})();


