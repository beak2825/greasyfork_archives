// ==UserScript==
// @name         panda show jp title
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  panda.chaika.moe 默认显示日文标题
// @author       ayase
// @match        https://panda.chaika.moe/search/*
// @downloadURL https://update.greasyfork.org/scripts/432206/panda%20show%20jp%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/432206/panda%20show%20jp%20title.meta.js
// ==/UserScript==
(() => {
    // 并发数过高 服务器会返回 502
    const concurrency = 10;

    const main = async () => {
        if (!location.pathname.includes("search")) {
            return;
        }
        exactJp();

        const mode = getViewMode();
        // 不包含 view 字段 代表使用 extended
        // 会自动显示日文标题
        if (mode === "extended") {
            return;
        }
        // 列表 日文标题包含在属性中
        if (mode === "list") {
            for (const node of Array.from(
                document.querySelectorAll(".table [title]")
            )) {
                node.innerHTML = node.getAttribute("title");
            }
            return;
        }
        // cover 模式
        // 需要手动获得日文标题
        const works = [];
        const nodes = Array.from(document.querySelectorAll(".gallery"));
        for (const node of nodes) {
            const work = async () => {
                const url = node
                    .querySelector(".caption a:nth-child(3)")
                    .getAttribute("href");
                const resp = await fetch(url);
                if (resp.status !== 200) {
                    await work()
                    return
                }
                const data = await resp.json();
                const jpTitle = data["title_jpn"];
                if (jpTitle) {
                    node.querySelector(".cover-title").innerHTML = jpTitle;
                }
            }
            works.push(work);
        }
        while (works.length) {
            await Promise.all(works.splice(0, concurrency).map((f) => f()));
        }
    };

    /**
     *
     * @returns {string}
     */
    const getViewMode = () => {
        const nodes = Array.from(document.querySelectorAll(".active a"));
        for (const node of nodes) {
            const mode = node.textContent.trim();
            if (["list", "extended", "cover"].includes(mode)) {
                return mode;
            }
        }
    };

    /**
     * 只保留日语本
     */
    const exactJp = () => {
        const tags = ["-language:english", "-language:translated"];
        const query = decodeURIComponent(location.search);
        const newTags = [];
        for (const tag of tags) {
            if (!query.includes(tag)) {
                newTags.push(tag);
            }
        }
        if (newTags.length) {
            if (query.includes("tags")) {
                location.search = query.replace(
                    "tags=",
                    `tags=${newTags.join(",")},`
                );
            } else {
                location.search = `${query}&tags=${newTags.join(",")}`;
            }
        }
    };

    main();
})();

