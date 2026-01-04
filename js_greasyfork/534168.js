// ==UserScript==
// @name         模糊处理Bangumi的评论/讨论/吐槽
// @namespace    http://tampermonkey.net/
// @version      2025-04-26
// @description  模糊处理Bangumi的评论 讨论 吐槽
// @author       You
// @match        https://bangumi.tv/subject/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bangumi.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534168/%E6%A8%A1%E7%B3%8A%E5%A4%84%E7%90%86Bangumi%E7%9A%84%E8%AF%84%E8%AE%BA%E8%AE%A8%E8%AE%BA%E5%90%90%E6%A7%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/534168/%E6%A8%A1%E7%B3%8A%E5%A4%84%E7%90%86Bangumi%E7%9A%84%E8%AF%84%E8%AE%BA%E8%AE%A8%E8%AE%BA%E5%90%90%E6%A7%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*
    let secTab = document.querySelector(".SidePanel .secTab");

    if (secTab) {
        // 跳过没有加入收藏列表的条目
        return;

    }
*/

/*
    let status = {
        do: false,
        wish: false,
        collect: false,
        on_hold: false,
        dropped: false
    }

    let text = document.querySelector(".SidePanel .interest_now").textContent;

    if (text.includes("在")) {
        status.do = true;
    } else if (text.includes("想")) {
        status.wish = true;
    } else if (text.includes("过")) {
        status.collect = true;
    } else if (text.includes("搁置")) {
        status.on_hold = true;
    } else if (text.includes("抛弃")) {
        status.dropped = true;
    }

    let type = document.querySelector("#navMenuNeue .focus.chl").href.split("/")[3];

    if (!status.do || (type != "anime" && type != "game")) {
        // 只处理动画和游戏，并且只针对“在看”/“在玩”状态进行防剧透
        return;
    }
*/
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .blur_button {
            position: fixed;
            right: 10px;
            top: 60%;
            transform: translateY(-50%);
            background-color: #fefefe;
            color: black;
            border-radius: 20px;
            padding: 4px 14px;
            transition: background-color 0.3s, color 0.3s;
            border: 1px solid lightgray;
        }
        .blur_button:hover {
            background-color: #72acde;
            color: white;
        }
        @media (max-width: 1200px) {
            .blur_button {
                display: none;
            }
        }
        @media (min-width: 1500px) {
            .blur_button {
                right: 100px;
            }
        }
        .blur_item {
            filter: blur(0px);
        }
    `;
    document.head.appendChild(style);

    let sections = document.querySelectorAll(".subject_section");
/*
    let subject_id = window.location.pathname.split("/").pop();
    let isBlurred = status.do;
    if (localStorage.getItem(`bgm_blur_subject_${subject_id}`) === null) {
        localStorage.setItem(`bgm_blur_subject_${subject_id}`, true);
    } else {
        isBlurred = localStorage.getItem(`bgm_blur_subject_${subject_id}`).trim() === "true";
    }
*/
    let isBlurred = true;
    sections.forEach(section => {
        if (section.querySelector(".subtitle").textContent == "评论") {
            console.log("评论")
            let blogs = section.querySelectorAll("#entry_list .item");
            blogs.forEach(blog => {
                blog.classList.add("blur_item");
                if (isBlurred) {
                    blog.style.filter = "blur(10px)";
                }
                blog.addEventListener('click', function () {
                    blog.style.filter = "blur(0px)";
                });
            });
        } else if (section.querySelector(".subtitle").textContent == "讨论版") {
            console.log("讨论版")
            let topics = section.querySelectorAll(".topic_list tr:not(:last-child)");
            topics.forEach(topic => {
                topic.classList.add("blur_item");
                if (isBlurred) {
                    topic.style.filter = "blur(10px)";
                }
                topic.addEventListener('click', function () {
                    topic.style.filter = "blur(0px)";
                });
            });
        } else if (section.querySelector(".subtitle").textContent == "吐槽箱") {
            // 这个选择器左侧有遮挡，更换上一层
            // let comments = section.querySelectorAll("#comment_box .text_container");
            console.log("吐槽箱")
            let comments = section.querySelectorAll("#comment_box .item");
            comments.forEach(comment => {
                comment.classList.add("blur_item");
                if (isBlurred) {
                    comment.style.filter = "blur(10px)";
                }
                comment.addEventListener('click', function () {
                    comment.style.filter = "blur(0px)";
                });
            });
        }
    });

    let btn = document.createElement("button");
    btn.textContent = isBlurred ? "就看就看！" : "完前不看。";
    btn.classList.add("blur_button");

    btn.addEventListener("click", function () {
        let blurredElements = document.querySelectorAll(".blur_item");
        blurredElements.forEach(element => {
            if (isBlurred) {
                // 移除模糊效果
                element.style.filter = "blur(0px)";
                btn.textContent = "完前不看。";
            } else {
                // 恢复模糊效果
                element.style.filter = "blur(10px)";
                btn.textContent = "就看就看！";
            }
        });
        isBlurred = !isBlurred;

//        localStorage.setItem(`bgm_blur_subject_${subject_id}`, isBlurred);
    });

    document.body.appendChild(btn);
})();