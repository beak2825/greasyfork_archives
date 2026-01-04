// ==UserScript==
// @name         获取B站视频封面
// @namespace    https://greasyfork.org/zh-CN/users/1325297-3plus10i
// @version      1.1
// @description  在视频标题下方显示一个按钮，点击可以查看视频封面
// @author       yjy
// @license      CC
// @match        https://www.bilibili.com/*
// @grant        unsafeWindow
// @icon
// @downloadURL https://update.greasyfork.org/scripts/504399/%E8%8E%B7%E5%8F%96B%E7%AB%99%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/504399/%E8%8E%B7%E5%8F%96B%E7%AB%99%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==
(function () {
    if (unsafeWindow.location.href.includes("www.bilibili.com")) {
        function main() {
            const data = unsafeWindow.__INITIAL_STATE__.videoData;
            if (data.aid) {
                const cover = data.pic.substring(data.pic.indexOf(":") + 1);
                const container = document.querySelector(".video-info-detail-content");
                if (!container) return setTimeout(main, 1500);

                if (document.querySelector(".get-cover")) {
                    // 直接修改链接为cover，不用重新创建div
                    const linkDiv = document.querySelector(".get-cover");
                    const anchor = linkDiv.childNodes[1];
                    // 移除原来的监听器
                    const newAnchor = anchor.cloneNode(true);
                    anchor.parentNode.replaceChild(newAnchor, anchor);
                    newAnchor.addEventListener("click", function () {
                        window.open(cover);
                    });
                    return;
                }
                const linkDiv = unsafeWindow.document.createElement("div");
                const originalDiv = document.querySelector(".view.item");
                if (originalDiv) {
                    for (let attr of originalDiv.attributes) {
                        linkDiv.setAttribute(attr.name, attr.value);
                    }
                } else {
                    linkDiv.className = "view item";
                    linkDiv.style.display = "inline-flex";
                }
                linkDiv.className += " get-cover";

                // 添加图标
                const svgcode = `<svg class="view-icon" width="20" height="20" viewBox="2 2 22 22" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.08337 9.06038C8.61047 9.06038 8.22712 9.44373 8.22712 9.91663C8.22712 10.3895 8.61047 10.7729 9.08337 10.7729C9.55626 10.7729 9.93962 10.3895 9.93962 9.91663C9.93962 9.44373 9.55626 9.06038 9.08337 9.06038ZM7.02295 9.91663C7.02295 8.77868 7.94543 7.8562 9.08337 7.8562C10.2213 7.8562 11.1438 8.77868 11.1438 9.91663C11.1438 11.0545 10.2213 11.977 9.08337 11.977C7.94543 11.977 7.02295 11.0545 7.02295 9.91663Z" fill="currentColor"></path>
                <path d="M12.0001 6.16467C9.90156 6.16467 8.06925 6.27142 6.77582 6.37631C5.87692 6.44921 5.18017 7.1359 5.10008 8.02675C5.00514 9.0828 4.91675 10.4755 4.91675 11.998C4.91675 13.5206 5.00514 14.9132 5.10008 15.9693C5.18017 16.8601 5.87692 17.5468 6.77582 17.6197C8.06925 17.7246 9.90156 17.8314 12.0001 17.8314C14.0988 17.8314 15.9312 17.7245 17.2247 17.6197C18.1235 17.5468 18.8201 16.8603 18.9002 15.9697C18.9951 14.9141 19.0834 13.5217 19.0834 11.998C19.0834 10.4743 18.9951 9.08194 18.9002 8.02634C18.8201 7.13571 18.1235 6.44923 17.2247 6.37634C15.9312 6.27145 14.0988 6.16467 12.0001 6.16467ZM6.67479 5.13041C7.99368 5.02346 9.86056 4.91467 12.0001 4.91467C14.1398 4.91467 16.0068 5.02347 17.3257 5.13043C18.8235 5.25191 20.0099 6.41029 20.1452 7.91441C20.2425 8.99705 20.3334 10.428 20.3334 11.998C20.3334 13.568 20.2425 14.999 20.1452 16.0816C20.0099 17.5857 18.8235 18.7441 17.3257 18.8656C16.0068 18.9725 14.1398 19.0814 12.0001 19.0814C9.86056 19.0814 7.99368 18.9725 6.67479 18.8656C5.1768 18.7441 3.99034 17.5855 3.85511 16.0812C3.75773 14.9981 3.66675 13.567 3.66675 11.998C3.66675 10.429 3.75773 8.99786 3.85511 7.91482C3.99034 6.41056 5.1768 5.25188 6.67479 5.13041Z" fill="currentColor"></path>
                <path d="M15.2187 13.2943C14.877 12.9525 14.323 12.9525 13.9812 13.2942L12.2876 14.9879C11.576 15.6995 10.4221 15.6992 9.71083 14.9872C9.42926 14.7054 8.97247 14.7052 8.69073 14.987L7.44192 16.2356C7.19783 16.4796 6.80209 16.4796 6.55803 16.2355C6.31397 15.9915 6.31399 15.5957 6.55808 15.3516L7.80691 14.103C8.57698 13.333 9.82553 13.3334 10.5952 14.1038C10.8184 14.3272 11.1804 14.3273 11.4037 14.104L13.0973 12.4104C13.9272 11.5805 15.2728 11.5805 16.1027 12.4105L17.442 13.75C17.686 13.9941 17.686 14.3898 17.4419 14.6339C17.1978 14.878 16.8021 14.878 16.558 14.6338L15.2187 13.2943Z" fill="currentColor"></path>
                </svg>`;

                const anchor = document.createElement("div");
                anchor.className = "view-text";
                anchor.textContent = "查看封面";
                anchor.style.color = "inherit";
                anchor.style.cursor = "pointer";
                anchor.addEventListener("click", function () {
                    window.open(cover);
                });

                linkDiv.innerHTML = svgcode;
                linkDiv.appendChild(anchor);
                container.append(linkDiv);
                // console.log(`封面地址: ${cover}`);
            }
        }

        // 页面加载完成后运行 main 函数
        setTimeout(main, 1500);

        // 获取 URL 中的 BV 号
        function getBVId() {
            const url = window.location.href;
            const match = url.match(/(BV\w{10})/);
            return match ? match[1] : null;
        }

        let currentBVId = getBVId();

        // 定时检查 URL 中的 BV 号是否发生变化
        setInterval(() => {
            const newBVId = getBVId();
            if (newBVId !== currentBVId) {
                currentBVId = newBVId;
                setTimeout(main, 1500);
            }
        }, 1000);
    }
})();
