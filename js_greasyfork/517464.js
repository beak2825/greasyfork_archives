// ==UserScript==
// @name         豆瓣小组轻量版（只保留看帖和看评论功能）
// @namespace    https://greasyfork.org/zh-CN/scripts/517464
// @version      2024-11-18
// @description  豆瓣小组只保留基本的查看帖子和查看评论功能，无需在新窗口打开(上班时可以把窗口缩小了看，这样就不会引起注意了)
// @author       ihtmlcss.com
// @match        https://www.douban.com/group/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517464/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E8%BD%BB%E9%87%8F%E7%89%88%EF%BC%88%E5%8F%AA%E4%BF%9D%E7%95%99%E7%9C%8B%E5%B8%96%E5%92%8C%E7%9C%8B%E8%AF%84%E8%AE%BA%E5%8A%9F%E8%83%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/517464/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E8%BD%BB%E9%87%8F%E7%89%88%EF%BC%88%E5%8F%AA%E4%BF%9D%E7%95%99%E7%9C%8B%E5%B8%96%E5%92%8C%E7%9C%8B%E8%AF%84%E8%AE%BA%E5%8A%9F%E8%83%BD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = document.title[0];
    document.querySelector("#wrapper").style.width = "100%";
    document.querySelector(".aside")?.remove();
    document.body.style.width = "100%";
    document.querySelector(".article").style.width = "100%";
    document.querySelector(".article").style.boxSizing = "border-box";
    document.querySelector(".article").style.padding = "10px";
    document.getElementById("db-nav-group")?.remove();
    document.getElementById("content")?.querySelector("h1")?.remove();
    document.querySelector(".group-board")?.remove();
    document.getElementById("db-global-nav")?.remove();
    document.getElementById("footer")?.remove();
    document.getElementById("group-info")?.remove();
    document.getElementById("group-new-topic-bar")?.remove();

    const doumail = document.createElement("div");
    doumail.id = "top-nav-doumail-link";
    doumail.innerHTML = "<em></em>";
    doumail.style.display = "none";
    document.body.appendChild(doumail);

    document.querySelectorAll(".article table.olt>tbody>tr>td[nowrap='nowrap']").forEach(item => {
        item.remove();
    })
    document.querySelector(".article table.olt>tbody>tr.th")?.querySelectorAll("td").forEach((item, index) => {
        if(index > 0) {
            item.remove();
        }
    })

    document.querySelectorAll(".td-subject>a.title, .article td.title>a").forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            fetch(item.href)
                .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.text();
            })
                .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const title = doc.title;
                const content = doc.querySelectorAll(".topic-richtext")[0];
                const viewBox = document.createElement("div");
                viewBox.style.position = "fixed";
                viewBox.style.backgroundColor = "#fff";
                viewBox.style.padding = "30px";
                viewBox.style.top = "10%";
                viewBox.style.left = "50%";
                viewBox.style.transform = "translateX(-50%)";
                viewBox.style.width = "80%";
                viewBox.style.maxWidth = "600px";
                viewBox.style.maxHeight = "80%";
                viewBox.style.overflowY = "scroll";
                viewBox.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)";
                viewBox.style.zIndex = "1001";
                content.querySelectorAll('img').forEach(img => {
                    img.style.maxWidth = "20%";
                    img.style.height = "auto";
                    img.style.margin = "auto";
                    img.style.display = "block";
                    img.style.cursor = "pointer";
                    img.addEventListener("click", () => {
                       if(img.style.maxWidth === "100%") {
                           img.style.maxWidth = "20%";
                       } else {
                           img.style.maxWidth = "100%";
                       }
                    })
                });

                const titleEl = document.createElement("h2");
                titleEl.innerHTML = title;
                viewBox.appendChild(titleEl);
                viewBox.appendChild(content);
                document.body.appendChild(viewBox);
                const replys = doc.querySelectorAll(".reply-doc").forEach(item => {
                    item.querySelector(".operation-div").remove();
                    const replyAuth = item.querySelector(".bg-img-green>h4>a").innerText;
                    const replyContent = item.querySelector(".markdown").innerText;
                    item.querySelector(".bg-img-green").remove();
                    const replyBox = document.createElement("div");
                    replyBox.style.color = "#7e7e7e";
                    replyBox.style.margin = "10px auto";
                    replyBox.style.padding = "10px 0 0 0";
                    replyBox.style.borderTop = "1px solid #dedede";
                    replyBox.innerHTML = `<b>${replyAuth}：</b>${replyContent}`;
                    viewBox.appendChild(replyBox);
                });
                const overlay = document.createElement('div');
                overlay.style.position = "fixed";
                overlay.style.top = "0";
                overlay.style.left = "0";
                overlay.style.width = "100%";
                overlay.style.height = "100%";
                overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                overlay.style.zIndex = "1000";
                document.body.dataset.saveScrollTop = document.documentElement.scrollTop;
                document.body.style.overflowY = "hidden";

                overlay.addEventListener("click", () => {
                    viewBox.remove();
                    overlay.remove();
                    document.body.style.overflowY = "auto";
                    window.scrollTo({
                        top: Number(document.body.dataset.saveScrollTop),
                        behavior: "smooth"
                    });
                })
                document.body.appendChild(overlay);
            })
                .catch(error => {
            });

        })
    })

})();