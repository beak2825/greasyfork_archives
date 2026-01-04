// ==UserScript==
// @name               Kobo Web Reader: Enable Selecting and Copying
// @name:zh-TW         Kobo Web Reader：啟用選擇和複製
// @description        Allows selecting and copying of texts and images on the Kobo Web Reader.
// @description:zh-TW  允許在 Kobo Web Reader 上選擇和複製文字和圖像。
// @icon               https://icons.duckduckgo.com/ip3/www.kobo.com.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              https://readingservices.kobo.com/ReadNow/*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/494393/feedback
// @downloadURL https://update.greasyfork.org/scripts/494393/Kobo%20Web%20Reader%3A%20Enable%20Selecting%20and%20Copying.user.js
// @updateURL https://update.greasyfork.org/scripts/494393/Kobo%20Web%20Reader%3A%20Enable%20Selecting%20and%20Copying.meta.js
// ==/UserScript==

GM.addStyle = function GM_addStyle(css, target)
{
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.textContent = css;

    if (!target) { target = document.head ?? document.documentElement; }
    return target.appendChild(style);
}

GM.addStyle(`
    body, .wr__wrapper
    {
        user-select: revert !important;
        touch-action: revert !important;
    }
`);

const EVENTS_BLACKLIST = new Set(["contextmenu"]);

EventTarget.prototype.addEventListener = new Proxy(
    EventTarget.prototype.addEventListener,
    {
        apply: function(target, thisArg, args)
        {
            let type, handler;
            try
            {
                type = String(args[0]);
                handler = String(args[1]);
            } catch(ex) {}

            if (!EVENTS_BLACKLIST.has(type))
            {
                return target.apply(thisArg, args);
            }
        },
    });

const observer = new MutationObserver((records) =>
{
    for (const record of records)
    {
        for (const node of record.addedNodes)
        {
            if ((node instanceof HTMLElement) && node.classList.contains("ReadingItem"))
            {
                pageObserver.observe(node, { childList: true });
            }
        }
    }
});

const pageObserver = new MutationObserver((records) =>
{
    for (const record of records)
    {
        for (const node of record.addedNodes)
        {
            if (node instanceof HTMLIFrameElement)
            {
                node.addEventListener("load", () =>
                {
                    GM.addStyle(`
                        html, html *
                        {
                            user-select: revert !important;
                            touch-action: revert !important;
                        }

                        svg[width="100%"][height="100%"]
                        {
                            display: none;
                        }
                    `, node.contentDocument.head);

                    node.contentWindow.EventTarget.prototype.addEventListener = new Proxy(
                        node.contentWindow.EventTarget.prototype.addEventListener,
                        {
                            apply: function(target, thisArg, args)
                            {
                                let type, handler;
                                try
                                {
                                    type = String(args[0]);
                                    handler = String(args[1]);
                                } catch(ex) {}

                                if (!EVENTS_BLACKLIST.has(type))
                                {
                                    return target.apply(thisArg, args);
                                }
                            },
                        });
                });
            }
        }
    }
});

observer.observe(document.getElementById("root"), { subtree: true, childList: true });
