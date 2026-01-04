// ==UserScript==
// @name         直链跳
// @name:zh-CN   直链跳转
// @name:en      Direct link jump
// @author       loran
// @version      0.0.4
// @description  解决各社区超链接不能直接跳转问题！！！
// @description:zh-CN  解决各社区超链接不能直接跳转问题！！！
// @description:en  Solve the problem that hyperlinks in various communities cannot be directly redirected!!!
// @match        http://*/*
// @match        https://*/*
// @grant        unsafeWindow
// @license      MIT License
// @namespace loran
// @downloadURL https://update.greasyfork.org/scripts/485130/%E7%9B%B4%E9%93%BE%E8%B7%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/485130/%E7%9B%B4%E9%93%BE%E8%B7%B3.meta.js
// ==/UserScript==

(function () {
            "use strict";

            document.body.addEventListener('click', function () {
                // 兼容处理
                var targetElem = event.target || event.srcElement;
                // 判断是否匹配目标元素
                if (targetElem.nodeName.toLocaleLowerCase() === 'a') {
                    event.preventDefault();
                    let hrefs = String(targetElem.href);
                    //console.log(hrefs);
                    //console.log(decodeURIComponent(hrefs))
                    //console.log(decodeURIComponent(decodeURIComponent(hrefs)))
                    if (hrefs.includes("?")) {
                        let ishttp = hrefs.split('?')[1].includes('http');
                        if (!ishttp) {
                            window.open(hrefs);
                        } else {
                            let len=decodeURIComponent(hrefs).split('?')[1].split('://');
                            console.log(len)
                            let realLink= decodeURIComponent(hrefs).split('?')[1].split('://')[1];                           
                            window.open('http://'+realLink);
                        }
                    } else {
                        window.open(hrefs);
                    }

                }
            });
        })();