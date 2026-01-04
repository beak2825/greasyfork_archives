// ==UserScript==
// @name         迅雷电影天堂磁力链批量下载
// @namespace    http://tampermonkey.net/
// @version      2024-09-29
// @description  迅雷电影天堂 | 详情页 | 磁力链列表上方标题行新增【批量下载磁力链】超链接
// @author       JoyofFire
// @match        https://www.xl720.com/thunder/*.html
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510713/%E8%BF%85%E9%9B%B7%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E7%A3%81%E5%8A%9B%E9%93%BE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/510713/%E8%BF%85%E9%9B%B7%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E7%A3%81%E5%8A%9B%E9%93%BE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = {
        title: ".entry-content > h2:last-of-type",
        anchor: "#zdownload .down_btn_cl a",
    };
    const values = {
        magnet_protocal: "magnet:",
        dl_btn_text: "> 批量下载磁力链 <",
        new_tab: "_blank",
    };

    const $ = (querySelectorAll) => (x) => [...querySelectorAll(x)];
    const dom$ = $(document.querySelectorAll.bind(document));
    const el$ = (el) => $(el.document.querySelectorAll.bind(el));

    const anchor_to_link = (a) => a.href;
    const is_magnet = (x) => `${x}`.startsWith(values.magnet_protocal);
    const anchors_to_links = (xs) => xs.map(anchor_to_link).filter(is_magnet);
    const text_to_blob = (x) => new Blob([x], { type: "text/plain" });

    const maybe_title = () => new Promise((resolve, reject) => {
        const matches = dom$(selectors.title);
        const _return = matches.length > 0 ? resolve : reject;
        _return(matches.at(-1));
    });

    const append_href_to_title = (url) => (title) => {
        const a = document.createElement("a");
        a.target = values.new_tab;
        a.textContent = values.dl_btn_text;
        a.href = url;
        title.append(a);
        return { title, url };
    };

    const handle_error = (error) => {
        if (!error) {
            alert("找不到标题行！无法添加按钮！");
            return;
        }
        console.error(error);
    };

    const main = () => {
        const anchors = dom$(selectors.anchor);
        const links = anchors_to_links(anchors);
        const links_text = links.join("\n");
        const text_blob = text_to_blob(links_text);
        const text_url = URL.createObjectURL(text_blob);

        maybe_title()
            .then(append_href_to_title(text_url))
            .then(console.info.bind(console))
            .catch(handle_error);
    };

    main();
})();