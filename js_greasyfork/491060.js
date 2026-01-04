// ==UserScript==
// @name               Kadokawa TW: Shows Book Walker Exclusive Expiry Date
// @name:zh-TW         台灣角川：顯示 Book Walker 獨佔結束日
// @description        Shows the estimated Book Walker exclusive expiry date for books at Kadokawa TW.
// @description:zh-TW  顯示台灣角川書本的 Book Walker 獨佔預計結束日。
// @icon               https://wsrv.nl/?url=https://img.shoplineapp.com/media/image_clips/655dc24c5782ce002011c5db/original.png?1700643404
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            3.1.3
// @license            MIT
// @match              https://www.kadokawa.com.tw/products/*
// @match              https://www.kadokawa.com.tw/*/products/*
// @run-at             document-end
// @grant              GM.xmlHttpRequest
// @connect            isbn.ncl.edu.tw
// @require            https://update.greasyfork.org/scripts/483122/1304475/style-shims.js
// @require            https://cdn.jsdelivr.net/npm/temporal-polyfill@0.2.3/global.min.js
// @supportURL         https://greasyfork.org/scripts/491060/feedback
// @downloadURL https://update.greasyfork.org/scripts/491060/Kadokawa%20TW%3A%20Shows%20Book%20Walker%20Exclusive%20Expiry%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/491060/Kadokawa%20TW%3A%20Shows%20Book%20Walker%20Exclusive%20Expiry%20Date.meta.js
// ==/UserScript==

GM.addStyle(`
    .ebook-exclusive.message .help
    {
        margin-left: 0.1em;
    }

    .ebook-exclusive.message .help a
    {
        text-decoration: underline;
        cursor: help;
    }

    .ebook-exclusive.message .help a:hover
    {
        color: #414180;
    }
`);

const ISBN_PATTERN = /ISBN：(\d{13}|[\dX]{10})/;
const DATE_PATTERN = /上市日期：(?:(?<year>\d{4})[-/](?<month>\d{2})[-/](?<day>\d{2}))/;
const TWO_WEEKS = Temporal.Duration.from({ weeks: 2 });

(async () =>
{
    const cookies = await getCookies();

    if (await isBook(getIsbn()))
    {
        const elements = document.querySelectorAll(".ProductDetail-description > :is(p, div)");
        for (const element of elements)
        {
            const matches = element.innerText.match(DATE_PATTERN);
            if (matches)
            {
                const release = Temporal.PlainDate.from(matches.groups);
                if (release && isRecentRelease(release))
                {
                    const expiry = release.add(TWO_WEEKS);
                    element.parentElement
                           .insertBefore(buildMessage(expiry), element.nextElementSibling);
                }
            }
        }

        const summary = document.querySelector(".Product-summary-block");
        if (summary?.childNodes)
        {
            for (const node of summary.childNodes)
            {
                if (node instanceof Text)
                {
                    const matches = node.data.match(DATE_PATTERN);
                    if (matches)
                    {
                        const release = Temporal.PlainDate.from(matches.groups);
                        if (release && isRecentRelease(release))
                        {
                            const expiry = release.add(TWO_WEEKS);
                            summary.insertBefore(buildMessage(expiry, { tag: "span", locale: "zh-TW", localeOptions: { year: "numeric", month: "2-digit", day: "2-digit" } }), node.nextSibling);
                            summary.insertBefore(document.createElement("br"), node.nextSibling);

                            break;
                        }
                    }
                }
            }
        }
    }

    function isBook(ian)
    {
        return new Promise((resolve, reject) =>
        {
            GM.xmlHttpRequest(
                {
                    url: "https://isbn.ncl.edu.tw/NEW_ISBNNet/H30_SearchBooks.php?Pact=DisplayAll4Simple",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Cookie": cookies,
                    },
                    data: `FO_SearchField0=ISBN&FO_SearchValue0=${ian}&FB_clicked=FB_%E9%96%8B%E5%A7%8B%E6%9F%A5%E8%A9%A2&FB_pageSID=Simple&FO_Match=2&FO_%E6%AF%8F%E9%A0%81%E7%AD%86%E6%95%B8=10&FO_%E7%9B%AE%E5%89%8D%E9%A0%81%E6%95%B8=1&FO_%E8%B3%87%E6%96%99%E6%8E%92%E5%BA%8F=PubMonth_Pre+DESC&FB_ListOri=`,
                    anonymous: true,
                    onload: (res) => { console.log(!res.responseText.includes("顯示查詢結果 ( 找到 0 筆 )")); resolve(!res.responseText.includes("顯示查詢結果 ( 找到 0 筆 )")); },
                    onerror: reject,
                });
        });
    }
})();

function getIsbn()
{
    const summary = document.querySelector(".Product-summary-block");
    if (summary?.childNodes)
    {
        for (const node of summary.childNodes)
        {
            if (node instanceof Text)
            {
                const matches = node.data.match(ISBN_PATTERN);
                if (matches)
                {
                    return matches[1];
                }
            }
        }
    }

    return location.pathname.split("/").at(-1);
}

function getCookies()
{
    return new Promise((resolve, reject) =>
    {
        GM.xmlHttpRequest(
            {
                url: "https://isbn.ncl.edu.tw/NEW_ISBNNet/",
                anonymous: true,
                onload: onLoad,
                onerror: reject,
            });

        function onLoad(res)
        {
            const cookies = res.responseHeaders
                .split("\r\n")
                .map((header) => [header.substring(0, header.indexOf(":")), header.substring(header.indexOf(":") + 1).trimLeft()])
                .filter((([name]) => (name.toLowerCase() === "set-cookie")))
                .map(([_, value]) => value.split(";")[0])
                .join(";");

            resolve(cookies);
        }
    });

}

function isRecentRelease(date)
{
    const now = Temporal.Now.plainDateISO();
    const duration = date.until(now);
    return (Temporal.Duration.compare(duration, "P3M", { relativeTo: now }) <= 0);
}

function buildMessage(expiry, options)
{
    const {
        tag = "p",
        locale,
        localeOptions,
    } = options ?? {};

    const message = document.createElement(tag);
    message.classList.add("ebook-exclusive", "message");

    const help = document.createElement("sup");
    help.classList.add("help");
    help.role = "presentation";

    const helpLink = document.createElement("a");
    helpLink.title = "幫助";
    helpLink.tabIndex = 0;
    helpLink.ariaLabel = "幫助";
    helpLink.addEventListener("click", (event) =>
    {
        event.preventDefault();
        alert("Book Walker 獨佔預計結束日僅供參考，結束日有可能較預期提前或延後，書本亦有可能不提供電子版。如有疑問，請聯繫台灣角川查詢。");
    });

    helpLink.append("(?)");
    help.append(helpLink);
    message.append("預計電子書獨佔結束", help, "：", locale ? expiry.toLocaleString(locale, localeOptions) : expiry.toString());

    return message;
}
