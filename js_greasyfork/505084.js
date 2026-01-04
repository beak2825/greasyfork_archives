// ==UserScript==
// @name         CBDS
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license MIT
// @description  屏蔽百度搜索中的广告类、添加 “屏蔽” 来屏蔽该网站、结果链接均为 直链、屏蔽右边杂项。
// @author       Kros
// @match        https://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/505084/CBDS.user.js
// @updateURL https://update.greasyfork.org/scripts/505084/CBDS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {


        // ----- ----- 添加样式
        function TJ_YnSi() {
            // 添加样式
            let hd = document.head;

            // 创建 style
            let style = document.createElement("style");
            style.id = "CBDS";
            hd.appendChild(style);
            let sty = document.getElementById("CBDS");
            sty.innerHTML += '\n.pbs{ background-color: #333333; color: #ffffff; width: auto; height: 20px; line-height: 20px; text-align: center; font-size: 12px; padding: 0 10px; border-radius: 10px; position: absolute; top: 10px; right: 10px; z-index: 10; cursor: not-allowed; } \n';

            sty.innerHTML += `#container{ width: 100vw !important; padding: 0px !important; margin-left: 0 !important; }\n`;
            sty.innerHTML += `#sx, #content_left, #xg{ padding: 0px !important; }\n`;
            sty.innerHTML += `@media (max-width: 1000px){\n#sx, #content_left, #rs_new{ width: 80% !important; margin-left: calc((100vw - 80%) / 2) !important; }\n}\n`;
            sty.innerHTML += `@media (min-width: 1001px){\n#sx, #content_left, #rs_new{ width: 800px !important; margin-left: calc((100vw - 800px) / 2) !important; }\n}\n`;
            /* background-image: linear-gradient(to right, #ed765e 0%, #ed765e 80%, #fea858 100%); */
            sty.innerHTML += `#content_left>div{ background-color: #ffffff; width: calc(100% - 40px); padding: 20px; border: solid 1px #333333; border-radius: 10px; position: relative; }\n`;
        }







        function cad() {
            let z = document.getElementById("content_left");
            let c = z.children;
            // 获取 直链
            for (let i = 0; i < c.length; i++) {
                let yl = c[i].getAttribute("mu");
                if (!yl) c[i].remove();
            }
        }

        function pgbt() {
            let p = document.getElementById("page");
            let p1 = p.children[0];
            let pa = p1.children;
            for (let i = 0; i < pa.length; i++) {
                pa[i].onclick = function () {
                    console.log("AD click");
                    closeAD();
                }
            }
        }

        
        // ----- ----- 删除加载广告
        function closeAD() {
            

            // 给检索工具添加id及样式
            let sx = document.getElementById("container").querySelector("div");
            sx.id = "sx";

            let lastTime = performance.now();
            let interval = 10; // 1秒的时间间隔
            let numTime = 0;

            function checkElement() {
                const now = performance.now();
                const elapsed = now - lastTime;

                if (elapsed >= interval) {
                    // 重置计时器
                    lastTime = now;
                    cad();

                    // 如果页面已经加载完成，‌停止检查
                    if (document.readyState === 'complete') {
                        if (numTime == 300) {
                            console.log("AD is close");
                            return;
                        }
                        numTime++;
                    }

                    // 否则，‌继续下一轮检查
                    requestAnimationFrame(checkElement);

                } else {
                    // 如果还没有到1秒，‌再次调用requestAnimationFrame
                    requestAnimationFrame(checkElement);
                }
            }

            // 开始第一轮检查
            requestAnimationFrame(checkElement);
        }






        // 获取body元素
        var targetNode = document.body;

        // 配置观察选项
        var config = {
            attributes: true, // 监听属性变化
            childList: true, // 监听子节点变化
            subtree: true, // 监听所有下级节点变化
            characterData: true, // 监听节点内容或节点文本的变动
            attributeOldValue: true, // 监听属性变化前的旧值
            characterDataOldValue: true // 监听节点内容或节点文本变化前的旧值
        };

        // 当观察到变化时执行的回调函数
        var callback = function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    // ----- ----- 删除 右边
                    let yb = document.getElementById("content_right");
                    if (yb) yb.remove();
                    pgbt();
                    TJ_YnSi();
                    BL_jeGo();
                }
            }
        };

        // 创建一个观察器实例并传入回调函数
        var observer = new MutationObserver(callback);

        // 使用上面的配置开始观察目标节点
        observer.observe(targetNode, config);

        // 随后，‌body的任何变化都会触发callback函数
        // 例如：‌document.body.appendChild(newElement); 或 document.body.textContent = '新的内容';

        // 当不再需要监听变化时，‌可以停止观察
        // observer.disconnect();










        // ----- ----- 遍历结果
        function BL_jeGo() {
            /* 获取结果框 */
            let z = document.getElementById("content_left");
            let c = z.children;

            // 遍历className
            for (let i = 0; i < c.length; i++) {

                // 获取 直链
                let yl = c[i].getAttribute("mu");
                // 判断是否存在原链地址
                if (yl) {
                    let h3 = c[i].querySelector("h3");
                    // 判断是否存在标题
                    if (h3) {
                        let a = h3.firstChild;
                        if (a) {
                            a.setAttribute("href", yl);
                            // 底名 直链
                            let m = c[i].getElementsByClassName("c-color-gray")[0];
                            if (m) {
                                m.parentNode.setAttribute("href", yl);
                            }
                        }


                        // 添加 屏蔽 按钮
                        let d = document.createElement("div");
                        d.className = "pbs";
                        d.removeAttribute("data-tools");
                        d.removeAttribute("aria-hidden");
                        d.innerText = "屏 蔽";

                        // 点击事件
                        d.onclick = () => {
                            console.log("OK");
                        };

                        // 添加元素
                        c[i].appendChild(d);
                    }
                }
            }
        }




        // ----- ----- 添加界面
        var cbds = {
            // 按钮
            an: function () {
                let form = document.getElementById("form");
                let p = form.parentNode;
                let d = document.createElement("div");
                d.id = "cbds_N";
                d.innerText = "CBDS";
                d.onclick = function () {
                    let j = document.getElementById("cbds_J");
                    j.style.display = "block";
                };
                let s = document.getElementById("CBDS");
                s.innerHTML += '\n#cbds_N{ background-color: #333333; color: #ffffff; width: 36px; height: 36px; line-height: 36px; text-align: center; font-size: 12px; border-radius: 50%; margin-top: 15px; margin-left: 30px; float: left; cursor: not-allowed; } \n';

                p.appendChild(d);
            },

            // 界面
            jm: function () {
                // 创建界面
                let j = document.createElement("div");
                j.id = "cbds_J";
                j.style.display = "none";

                // 标题
                let b = document.createElement("div");
                b.id = "cbds_B";
                b.innerText = "C B D S";

                // 列表
                let u = document.createElement("ul");
                u.id = "cbds_U";

                // 项
                let l = document.createElement("li");
                l.className = "cbds_L";
                l.innerText = "第一条";

                // 按钮
                let s = document.createElement("div");
                s.id = "cbds_S";
                s.innerText = "保 存";
                s.onclick = function () {
                    j.style.display = "none";
                };

                // ----- 合成
                u.appendChild(l);
                j.appendChild(b);
                j.appendChild(u);
                j.appendChild(s);


                // ----- 加载样式
                let st = document.getElementById("CBDS");
                function css() {
                    st.innerHTML += '\n#cbds_J{ background-color: #ffffff; width: 200px; height: auto; overflow: hidden; border: solid #000000 1px; border-radius: 10px; position: fixed; top: 0; right: 0; z-index: 500; user-select: none; } \n';
                    st.innerHTML += '\n#cbds_B{ background-color: #333333; color: #ffffff; width: 100%; height: 30px; line-height: 30px; text-align: center; font-size: 20px; } \n';
                    st.innerHTML += '\n#cbds_U{ width: 100%; height: 200px; } \n';
                    st.innerHTML += '\n.cbds_L{ width: 180px; height: 30px; line-height: 30px; border-bottom: solid #888888 1px; padding: 0 10px; } \n';
                    st.innerHTML += '\n#cbds_S{ background-color: #333333; color: #ffffff; width: 100%; height: 30px; line-height: 30px; text-align: center; font-size: 20px; } \n';
                }
                css();


                // 加载界面
                document.body.appendChild(j);
            }
        };
        cbds.an();
        cbds.jm();

    });
})();