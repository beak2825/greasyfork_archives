// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-07
// @description  Grafana helper
// @author       You
// @match        https://metrics.bigo.sg/d/MtrHmnvHk/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bigo.sg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523191/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/523191/New%20Userscript.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var cssText = ".modal{display:none;position:fixed;z-index:999;left:0;top:0;width:100%;height:100%;max-width:100%;margin-right:0px;background-color:rgba(0, 0, 0, 0.4);padding-top:60px}.modal-content{background-color:#fefefe;margin:5% auto;padding:0px;border:1px solid #888;width:85%;height:80%;margin-right:0px}.close{color:rgb(0 0 0);float:left;font-size:28px;font-weight:bold;margin-left:15px}.close:hover,.close:focus{color:black;text-decoration:none;cursor:pointer}"
    var style = document.createElement("style");
    style.type = "text/css";
    style.textContent = cssText;
    document.getElementsByTagName("HEAD").item(0).appendChild(style);

    var boarddiv = "<div id='myModal' class='modal'><div class='modal-content'><span class='close'>&times;</span><iframe id='modalIframe' width='100%' height='100%'></iframe></div></div>";
    $(document.body).append(boarddiv);

    window.onload = function() {
        const intervalId = setInterval(function() {
            const links = document.querySelectorAll('a');
            links.forEach(link => {
                const linkText = link.textContent.trim();
                if (linkText.endsWith('监控')) {
                    // 阻止默认行为（跳转）
                    const modal = document.getElementById("myModal");
                    const iframe = document.getElementById("modalIframe");
                    const closeBtn = document.getElementsByClassName("close")[0];

                    // 点击关闭按钮时关闭弹框
                    closeBtn.onclick = function() {
                        modal.style.display = "none";
                    }

                    // 如果点击弹框外部区域也关闭弹框
                    window.onclick = function(event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    }

                    link.addEventListener('click',
                    function(event) {
                        event.preventDefault();
                        //alert('链接地址： ' + link.href);
                        // 获取链接的URL
                        const url = link.href;

                        const regex = /([?&])var-[^=]+=\.\*(?=&|#|$)/g;
                        let newUrl = url.replace(regex, (match, separator) => {
                            return separator === "?" ? "?" : ""; // 如果是第一个参数，保留 "?"
                        });

                        // 通用替换方法，处理所有形如 "变量名=值1,值2,值3" 的部分
                        let updatedUrl = newUrl.replace(/([^&=]+)=([^&]+)/g, (match, variable, values) => {
                            // 分割逗号并重新拼接为 "变量名=值1&变量名=值2..."
                            if (values.includes(',')) {
                                return '';
                            }
                            return match; // 如果没有逗号，则保持不变
                        });

                        // 将 URL 赋值给 iframe 的 src 属性
                        iframe.src = updatedUrl;

                        // 显示弹框
                        modal.style.display = "block";
                    });
                    //clearInterval(intervalId);

                }
            });
        },
        1000);
    };

})();