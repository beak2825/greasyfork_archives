// ==UserScript==
// @name         jira复制
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  在jira上复制id和标题，另外还可以复制评论中的文字
// @author       Kovan
// @match        http://*/browse/INOR*
// @icon         https://www.google.com/s2/favicons?domain=192.168.0.1
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485554/jira%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/485554/jira%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList, observer) => {
        const targetButton = document.querySelector('button#kk-copy-button');
        if(!targetButton){
            var elem;
            var keyVal;
            var targetNodes;
            var t_res_message;
            // 然后页面开始加上自定义元素
            let kk_copy_btn_style = document.createElement('style');
            kk_copy_btn_style.innerHTML = `
                  #kk-copy-button {
                    position: relative;
                    z-index: 9999;
                    height: 34px;
                    width: 90px;
                    background-color: #dfe1e5;
                    color: #172b4d;
                    border: none;
                    border-radius: 5px;
                    margin: 0 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight:400;
                    cursor:pointer;
                    transition: background-color 0.5s, color 0.5s; /* 添加过渡效果，0.5秒的过渡时间 */
                  }
                  #kk-copy-button:hover {
                    background-color: #b3b6bb; /* hover时的背景颜色 */
                    color: #172b4d; /* hover时的文字颜色 */
                  }
                `;
            document.head.appendChild(kk_copy_btn_style);

            // 先确定页面元素加载出了
            elem = document.getElementById("summary-val");
            keyVal = document.getElementById("key-val");
            targetNodes = document.querySelectorAll('.action-body');
            t_res_message = document.getElementsByClassName('message-container');

            // 如果元素都存在
            if (elem && keyVal && targetNodes && ((t_res_message.length == 0 && targetNodes.length > 0) || (t_res_message.length > 0))) {
                // 在标题后增加复制按钮
                var kk_copy_btn = document.createElement("button");
                kk_copy_btn.id = 'kk-copy-button';
                kk_copy_btn.textContent = "COPY";
                kk_copy_btn.setAttribute("title", "点击复制问题和ID");
                kk_copy_btn.addEventListener('click', () => {
                    // 复制文本
                    var textToCopy = keyVal.innerText + elem.innerText;
                    GM_setClipboard(textToCopy);
                    showNotification(' 文本已成功复制 ');
                    setTimeout(() => {
                        document.body.removeChild(notificationDiv);// Hide the notification after 3 seconds
                    }, 1500);
                });
                elem.after(kk_copy_btn);

                // 在每条评论后添加复制按钮
                targetNodes.forEach(function(targetNode, index) {
                    const newButton = document.createElement('button');
                    newButton.textContent = '复制评论';
                    newButton.setAttribute("name", "kk-response-btn");
                    newButton.style.position = "absolute";
                    newButton.style.display = "block";
                    newButton.style.top = "1px";
                    newButton.style.right = "4px";
                    newButton.style.cursor = 'pointer';
                    targetNode.parentNode.insertBefore(newButton, targetNode);
                    newButton.addEventListener('click', function() {
                        // 复制文本
                        let textToCopy = targetNode.innerText;
                        textToCopy = textToCopy.replace(/\n\n|\r\n\r\n/g, '\n');
                        GM_setClipboard(textToCopy);
                        showNotification(' 文本已成功复制 ');
                        setTimeout(() => {
                            document.body.removeChild(notificationDiv);// Hide the notification after 3 seconds
                        }, 1500);
                    });
                });
                console.log("已添加copy按钮");

                let notificationDiv; // Declare notificationDiv globally
                function showNotification(message) {
                    notificationDiv = document.createElement('div');
                    notificationDiv.textContent = message;
                    notificationDiv.style.position = 'fixed';
                    notificationDiv.style.top = '20px';
                    notificationDiv.style.left = '50%';
                    notificationDiv.style.transform = 'translateX(-50%)';
                    notificationDiv.style.padding = '10px';
                    notificationDiv.style.background = 'rgb(76 175 80 / 67%)';
                    notificationDiv.style.color = 'white';
                    notificationDiv.style.borderRadius = '5px';
                    notificationDiv.style.zIndex = '9999';
                    notificationDiv.style.pointerEvents = 'none'; // Disable pointer events for the notification
                    notificationDiv.setAttribute('tabindex', '-1'); // Make the div non-focusable
                    notificationDiv.style.outline = 'none'; // Remove visible outline
                    document.body.appendChild(notificationDiv);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();