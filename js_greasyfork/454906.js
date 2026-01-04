// ==UserScript==
// @name         顯示動畫瘋封面 & 視覺圖
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      1.2.2
// @description  在動畫瘋網站顯示該集封面 & 視覺圖
// @author       zica
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        GM_registerMenuCommand
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/454906/%E9%A1%AF%E7%A4%BA%E5%8B%95%E7%95%AB%E7%98%8B%E5%B0%81%E9%9D%A2%20%20%E8%A6%96%E8%A6%BA%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454906/%E9%A1%AF%E7%A4%BA%E5%8B%95%E7%95%AB%E7%98%8B%E5%B0%81%E9%9D%A2%20%20%E8%A6%96%E8%A6%BA%E5%9C%96.meta.js
// ==/UserScript==

(function () {
    "use strict";

    GM_registerMenuCommand("顯示大視覺圖", display_visual);

    // 把下面一行的兩個斜線刪掉並存檔，即可自動顯示大視覺圖
    // display_visual();

    // 顯示視覺圖
    function display_visual() {
        const visual = document.createElement("img");
        visual.src = get_visual_url();
        Object.assign(visual.style, {
            maxHeight: "40rem",
            float: "right",
            margin: "10px 10px auto 10px",
        });
        document.getElementsByClassName("anime-title")[0].prepend(visual);
        document.getElementsByClassName("anime-ad")[0].style.position =
            "static";
    }

    // 顯示封面
    const cover = document.createElement("img");
    Object.assign(cover.style, {
        width: "100%",
        maxWidth: "initial",
        height: "100%",
        objectFit: "contain",
    });
    let old_URL = undefined;
    const observer = new MutationObserver((records, observerInstance) => {
        const paid_or_age_restriction =
            document.getElementsByClassName("video-verify").length !== 0;
        const agreeScreen = paid_or_age_restriction
            ? document.getElementsByClassName("video-verify")[0]
            : document.getElementsByClassName("video-cover-ncc")[0];
        if (!agreeScreen || window.location.href === old_URL) {
            return;
        }
        old_URL = window.location.href;
        cover.src = get_cover_url();
        cover.onclick = () => {
            cover.remove();
            if (paid_or_age_restriction) {
                agreeScreen.style.display = "flex";
            } else {
                const agreeButton = document.getElementById("adult");
                agreeButton.click();
            }
        };
        agreeScreen.before(cover);
        agreeScreen.style.display = "none";
    });
    observer.observe(document.getElementById("video-container"), {
        childList: true,
        subtree: true,
    });

    function get_cover_url() {
        const accurate = document
            .getElementById("ani_video_html5_api")
            .getAttribute("poster");
        if (accurate.length !== 0) {
            return accurate;
        }
        return get_visual_url();
    }

    function get_visual_url() {
        return document.getElementsByName("thumbnail")[0].content;
    }
})();
