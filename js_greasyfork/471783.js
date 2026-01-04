// ==UserScript==
// @name               Masiro: Blurs NSFW Covers
// @name:zh-TW         真白萌：模糊 R17 封面
// @name:zh-CN         真白萌：模糊 R17 封面
// @description        Blurs the covers of NSFW novels on Masiro.
// @description:zh-TW  模糊真白萌 R17 小說的封面。
// @description:zh-CN  模糊真白萌 R17 小说的封面。
// @icon               https://icons.duckduckgo.com/ip3/masiro.me.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.4.0
// @license            MIT
// @match              https://masiro.me/admin
// @match              https://masiro.me/admin/
// @match              https://masiro.me/admin/novels
// @match              https://masiro.me/admin/novels?*
// @match              https://masiro.me/admin/novelIndex
// @match              https://masiro.me/admin/novelIndex?*
// @run-at             document-idle
// @grant              GM.getValue
// @grant              GM.setValue
// @grant              GM.deleteValue
// @grant              GM.listValues
// @grant              GM.registerMenuCommand
// @grant              GM.setClipboard
// @require            https://update.greasyfork.org/scripts/483122/1304475/style-shims.js
// @require            https://update.greasyfork.org/scripts/487244/1326878/gm-import-export.js
// @require            https://unpkg.com/typesafe-i18n@5.26.2/dist/i18n.object.min.js
// @require            https://update.greasyfork.org/scripts/482358/1296680/sleep.js
// @require            https://update.greasyfork.org/scripts/482311/1296481/queue.js
// @supportURL         https://greasyfork.org/scripts/471783/feedback
// @downloadURL https://update.greasyfork.org/scripts/471783/Masiro%3A%20Blurs%20NSFW%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/471783/Masiro%3A%20Blurs%20NSFW%20Covers.meta.js
// ==/UserScript==

const LL = (function()
{
    const translations =
    {
        "en": {
            COMMAND: {
                IMPORT: "Import Novels Data Cache",
                EXPORT: "Export Cached Novels Data",
            },
            ERROR: {
                MALFORMED_JSON: "Malformed JSON data. Import failed.",
                UNKNOWN_ERROR: "Imported failed: {0}",
            },
            MESSAGE: {
                IMPORT_PROMPT: "Please provide JSON-formatted novels data cache:",
                IMPORT_FINISHED: "Import finished.",
                EXPORT_FINISHED: "Exported novels data cache to the clipboard.",
            },
        },
        "zh-Hant": {
            COMMAND: {
                IMPORT: "匯入小說資料快取",
                EXPORT: "匯出小說資料快取",
            },
            ERROR: {
                MALFORMED_JSON: "JSON 資料格式錯誤，匯入失敗。",
                UNKNOWN_ERROR: "匯入失敗：{0}",
            },
            MESSAGE: {
                IMPORT_PROMPT: "請提供 JSON 格式的小說資料快取：",
                IMPORT_FINISHED: "匯入完成。",
                EXPORT_FINISHED: "已匯出小說資料快取到剪貼簿。",
            },
        },
        "zh-Hans": {
            COMMAND: {
                IMPORT: "导入小说数据缓存",
                EXPORT: "导出小说数据缓存",
            },
            ERROR: {
                MALFORMED_JSON: "JSON 数据格式错误，导入失败。",
                UNKNOWN_ERROR: "导入失败：{0}",
            },
            MESSAGE: {
                IMPORT_PROMPT: "请提供 JSON 格式的小说数据缓存：",
                IMPORT_FINISHED: "导入完成。",
                EXPORT_FINISHED: "已导出小说数据缓存到剪贴板。",
            },
        },
    };

    let locale = "en";
    for (const language of navigator.languages.map((language) => new Intl.Locale(language).minimize()))
    {
        if (language.language === "zh")
        {
            locale = `zh-${language.maximize().script}`;
            break;
        }
        else if (language.baseName in Object.keys(translations))
        {
            locale = language.baseName;
            break;
        }
    }

    return i18nObject(locale, translations[locale]);
})();

GM.addStyle(`
    .updateCards > a.nsfw .updateImg, .layui-card.nsfw .n-img
    {
        filter: blur(var(--nsfw-blur-radius, 7.5px));
        transition: filter var(--nsfw-transition-duration, 0.3s);
    }

    .updateCards > a.nsfw:hover .updateImg, .updateCards > a.nsfw:focus-within .updateImg,
    .layui-card.nsfw:hover .n-img, .layui-card.nsfw:focus-within .n-img
    {
        filter: blur(0px);
    }
`);

if (GM.registerMenuCommand)
{
    GM.registerMenuCommand(LL.COMMAND.IMPORT(), () =>
    {
        setTimeout(async () =>
        {
            const cache = prompt(LL.MESSAGE.IMPORT_PROMPT(), "{}");
            if (cache)
            {
                try
                {
                    await GM.importValues(JSON.parse(cache));
                    alert(LL.MESSAGE.IMPORT_FINISHED());
                }
                catch (e)
                {
                    if (e instanceof SyntaxError)
                    {
                        console.error(e);
                        alert(LL.ERROR.MALFORMED_JSON());
                    }
                    else
                    {
                        console.error(e);
                        alert(LL.ERROR.UNKNOWN_ERROR(e?.message));
                    }
                }
            }
        }, 0);
    });

    GM.registerMenuCommand(LL.COMMAND.EXPORT(), () =>
    {
        setTimeout(async () =>
        {
            const cache = await GM.exportValues();
            GM.setClipboard(JSON.stringify(cache));

            alert(LL.MESSAGE.EXPORT_FINISHED());
        }, 0);
    });
}

const pathname = location.pathname;
if ((pathname === "/admin") || (pathname === "/admin/"))
{
    const queue = new Queue({ autostart: true, concurrency: 4 });

    const observer = new MutationObserver((records) =>
    {
        for (const record of records)
        {
            if (record.target.classList.contains("updateCards"))
            {
                for (const node of record.addedNodes)
                {
                    queue.push(async () =>
                    {
                        if (await isNsfw(node.href))
                        {
                            node.classList.add("nsfw");
                        }
                    });
                }
            }
        }
    });

    observer.observe(document.querySelector(".fl"), { subtree: true, childList: true });

    async function isNsfw(url)
    {
        const novelId = new URL(url).searchParams.get("novel_id");
        {
            const isNsfw = await GM.getValue(novelId);
            if (typeof isNsfw === "boolean") { return isNsfw; }
        }

        try
        {
            const response = await fetch(url);
            if (response.status === 200)
            {
                const html = await response.text();
                const parser = new DOMParser();
                const page = parser.parseFromString(html, "text/html");

                const isNsfw = Array.prototype.map.call(page.querySelectorAll(".tags .label"), (element) => element.innerText)
                                              .includes("R17");

                GM.setValue(novelId, isNsfw);
                return isNsfw;
            }
            else if (response.status === 429)
            {
                const resetTime = Number.parseInt(response.headers.get("x-ratelimit-reset"));
                await sleep((resetTime - Math.ceil(Date.now() / 1000) + 10) * 1000);
                return isNsfw(url);
            }
        }
        catch (e)
        {
            console.error(e);
        }

        return false;
    }
}
else
{
    const observer = new MutationObserver((records) =>
    {
        for (const record of records)
        {
            for (const node of record.addedNodes)
            {
                if ((node instanceof HTMLElement) && node.classList.contains("layui-card"))
                {
                    const isNsfw = Array.prototype.map.call(node.querySelectorAll(".tags > .tag"), (element) => element.innerText).includes("R17");
                    if (isNsfw) { node.classList.add("nsfw"); }

                    const url = new URL(node.querySelector(".glass + a").href);
                    GM.setValue(url.searchParams.get("novel_id"), isNsfw);
                }
            }
        }
    });

    observer.observe(document.querySelector(".n-leg"), { childList: true });
}
