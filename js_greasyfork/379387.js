// ==UserScript==
// @name         巴哈姆特 - 發文回覆冷卻倒數
// @namespace    -
// @version      20220924.0
// @description  每次發文都要間隔一分鐘。然後巴哈又沒有提供原生的發文倒數...（假設冷卻時間爲 60 秒整、預留 3 秒緩衝）
// @author       LianSheng
// @include      https://forum.gamer.com.tw/B.php*
// @include      https://forum.gamer.com.tw/C.php*
// @include      https://forum.gamer.com.tw/Co.php*
// @include      https://forum.gamer.com.tw/post1.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/379387/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E7%99%BC%E6%96%87%E5%9B%9E%E8%A6%86%E5%86%B7%E5%8D%BB%E5%80%92%E6%95%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/379387/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E7%99%BC%E6%96%87%E5%9B%9E%E8%A6%86%E5%86%B7%E5%8D%BB%E5%80%92%E6%95%B8.meta.js
// ==/UserScript==

(function () {
    const DEBUG_MODE = GM_getValue("debug_mode", false);
    GM_registerMenuCommand(`${DEBUG_MODE ? "關閉" : "開啓"}測試模式（目前：${DEBUG_MODE ? "開啓" : "關閉"}）`, () => {
        GM_setValue('debug_mode', !DEBUG_MODE);
        location.reload();
    });

    let url = location.href;
    let hint = "發文冷卻中...";

    let css = `
[last-reply] {
    position: relative;
}
[last-reply]:hover::before {
    content: attr(last-reply);
    position: absolute;
    z-index: 2000;
    top: 46px;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 2px;
    background: #222;
    color: #fff;
    font-size: 16px;
    font-family: sans-serif;
    white-space: nowrap;
}
.tm_disabled {
    opacity: 0.5 !important;
}
`;

    if (!GM_getValue("lastreply")) {
        GM_setValue("lastreply", 0);
    }

    // 文章列表（發文）
    if (url.match("B.php")) {
        let post = document.querySelector("li.BH-menu-forumA-back > a");

        let id = setInterval(() => {
            let delta = cd();

            if (delta > 0) {
                post.addEventListener("click", disable);
                post.innerText = `${hint} ${delta} 秒`;
                post.classList.add("tm_disabled");
            } else {
                post.removeEventListener("click", disable);
                post.innerText = "發文";
                post.classList.remove("tm_disabled");
                clearInterval(id);
            }
        }, 100);
    }

    // 文章串（回覆）/ 特定樓層（回覆）
    if (url.match("C.php") || url.match("Co.php")) {
        // 20220914.0: 新版樓層回覆（複數個）
        let floor_new = document.querySelectorAll("section[id^='post_'] a.article-footer_right-btn");

        // 20220914.0: 新版上下滾時的導覽列
        let navup_new_a, navdown_new_a;
        if(url.match("C.php")) {
            navup_new_a = document.querySelector(".BH-menu-forumA-back a");
            navdown_new_a = document.querySelector(".c-menu__scrolldown a.btn-primary");
        }

        // 20220914.0: 因不確定是否有 A/B Test，底下暫時保留先前版本的元素
        // 上滾時的導覽列
        let navup_a = document.querySelector("i.BHicon-comment2.BH-lg");
        navup_a = navup_a ? navup_a.parentElement : null;
        let navup_block = navup_a ? navup_a.parentElement : null;
        // 樓層回覆（複數個）
        let floor = document.querySelectorAll("button.btn--sm.btn--normal");
        // 頁底快速回覆
        let foot_fast = document.querySelector("input[onclick*='quickPost']");
        foot_fast = foot_fast ? foot_fast : null;
        // 頁底打開完整編輯器、引言回覆
        let foot_full = document.querySelectorAll("div.option > div.toolbar > button[onclick*='gotoPostPage']");

        // 移除原生 title
        navup_a && navup_a.removeAttribute("title");
        foot_full && foot_full.forEach(e => e.removeAttribute("title"));
        navup_new_a && navup_new_a.removeAttribute("title");

        // 移除原生 onclick event handler
        // 該元素的觸發模式與其他不同，需特殊處理 (其他都是用 href，就這玩意用 onclick = =）
        floor_new && (floor_new.forEach(e => e.onclick = null));

        // 發文回覆倒數提示
        let id = setInterval(() => {
            let delta = cd();

            if (delta > 0) {
                navup_block && navup_block.addEventListener("click", disable);
                foot_fast && (foot_fast.disabled = true);
                foot_full && foot_full.forEach(e => e.disabled = true);
                floor && floor.forEach(e => {
                    e.disabled = true;
                    e.querySelector("span").innerText = `${hint} ${delta} 秒`;
                });
                navup_block && navup_block.setAttribute("last-reply", `${hint} ${delta} 秒`);
                foot_fast && (foot_fast.value = `${hint} ${delta} 秒`);
                foot_full && foot_full.forEach(e => e.setAttribute("last-reply", `${hint} ${delta} 秒`));

                floor_new && floor_new.forEach(e => {
                    let p = e.querySelector("p");
                    e.classList.add("tm_disabled");
                    p && (p.innerText = `${hint} ${delta} 秒`);
                });
                [navup_new_a, navdown_new_a].forEach(e => {
                    if (e) {
                        e.addEventListener("click", disable);
                        e.classList.add("tm_disabled");
                        e.innerText = `${hint} ${delta} 秒`;
                    }
                });
            } else {
                navup_block && navup_block.removeEventListener("click", disable);
                foot_fast && foot_fast.removeAttribute("disabled");
                foot_full && foot_full.forEach(e => e.removeAttribute("disabled"));
                floor && floor.forEach(e => {
                    e.removeAttribute("disabled");
                    e.querySelector("span").innerText = "回覆";
                });
                navup_block && navup_block.setAttribute("last-reply", `回覆此主題`);
                foot_fast && (foot_fast.value = "送出");
                foot_full && foot_full[0].setAttribute("last-reply", `使用完整編輯器`);
                foot_full && foot_full[1] && foot_full[1].setAttribute("last-reply", `引言回覆`);

                floor_new && floor_new.forEach(e => {
                    let p = e.querySelector("p");
                    e.onclick = Function(e.getAttribute("onclick"));
                    e.classList.remove("tm_disabled");
                    p && (p.innerText = "回覆");
                });
                [navup_new_a, navdown_new_a].forEach(e => {
                    if (e) {
                        e.removeEventListener("click", disable);
                        e.classList.remove("tm_disabled");
                        e.innerText = "回覆文章";
                    }
                });

                clearInterval(id);
            }
        }, 100);

        // 頁底快速回覆點擊事件
        foot_fast && foot_fast.addEventListener("click", () => {
            setTimeout(() => {
                let btn = document.querySelector("button[autofocus]");
                btn && btn.addEventListener("click", future63);
            }, 100);
        });

    }

    // 完整編輯頁
    if (url.match("post1.php")) {
        let type = new URL(location.href).searchParams.get("type");
        //（不含編輯既有文章）
        // 1 發文、2 回覆、3 編輯
        if (type != 3) {
            let post = document.querySelector("li.BH-menu__post__btn > a");
            post && post.addEventListener("click", () => {
                setTimeout(() => {
                    if (document.querySelector("button[autofocus]")) {
                        document.querySelector("button[autofocus]").addEventListener("click", future63);
                    }
                }, 100);
            });
        }
    }

    function disable(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    function future63() {
        return GM_setValue("lastreply", Date.now() + 63000);
    }

    if (DEBUG_MODE) {
        const page_init_time = Date.now() + 10000;
        function cd() {
            return parseInt((page_init_time - Date.now()) / 1000);
        }
    } else {
        function cd() {
            return parseInt((GM_getValue("lastreply") - Date.now()) / 1000);
        }
    }

    GM_addStyle(css);
})();