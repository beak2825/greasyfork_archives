// ==UserScript==
// @name               Auto Dark Mode for pixiv
// @name:zh-TW         pixiv 自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://icons.duckduckgo.com/ip3/www.pixiv.net.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.1
// @license            MIT
// @match              https://www.pixiv.net/*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/459795/feedback
// @downloadURL https://update.greasyfork.org/scripts/459795/Auto%20Dark%20Mode%20for%20pixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/459795/Auto%20Dark%20Mode%20for%20pixiv.meta.js
// ==/UserScript==

if (document.querySelector("body > #root") !== null)
{
    localStorage.removeItem("theme");
}
else
{
    const MENU_ITEM_PATTERN = /(ダークテーマ|Dark Theme|다크 테마|夜间模式|夜間模式)/i;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    localStorage.setItem("theme", query.matches ? "dark" : "default");

    const observer = new MutationObserver((records) =>
    {
        for (const record of records)
        {
            for (const node of record.addedNodes)
            {
                if (node.id === "spa-contents")
                {
                    setTimeout(onAppLoaded, 1000, node);
                    observer.disconnect();
                }
            }
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });

    function onAppLoaded(app)
    {
        const menuButton = app.querySelector(".header > .left");

        query.addEventListener("change", updateTheme);
        updateTheme(query);

        function updateTheme({ matches: isDarkMode })
        {
            if (isDarkTheme() !== isDarkMode)
            {
                let observer;
                if (isMenuOpened())
                {
                    onMenuOpened(app.querySelector("#modal-mymenu"));
                }
                else
                {
                    observer = new MutationObserver((records) =>
                    {
                        for (const record of records)
                        {
                            for (const node of record.addedNodes)
                            {
                                if (node.id === "modal-mymenu")
                                {
                                    onMenuOpened(node);
                                    observer.disconnect();
                                }
                            }
                        }
                    });

                    observer.observe(app.querySelector(".close-mymenu").parentElement, { childList: true });
                    menuButton.click();
                }

                function onMenuOpened(menu)
                {
                    Array.from(menu.querySelectorAll(".wc-menu li"))
                         .find((item) => MENU_ITEM_PATTERN.test(item.textContent))
                         ?.querySelector("input[type=checkbox]")
                         .click();

                    if (observer)
                    {
                        app.querySelector(".close-mymenu").click();
                    }
                }
            }
        }
    }

    function isDarkTheme()
    {
        return document.body.classList.contains("dark");
    }

    function isMenuOpened()
    {
        return document.body.classList.contains("show-menu");
    }
}
