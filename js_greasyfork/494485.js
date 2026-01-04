// ==UserScript==
// @name               MooReader: Enable Selecting and Copying
// @name:zh-TW         MooReader：啟用選擇和複製
// @description        Allows selecting and copying of texts and images on MooReader.
// @description:zh-TW  允許在 MooReader 上選擇和複製文字和圖像。
// @icon               https://icons.duckduckgo.com/ip3/reader.readmoo.com.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.1.0
// @license            MIT
// @match              https://reader.readmoo.com/reader/index.html
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/494485/feedback
// @downloadURL https://update.greasyfork.org/scripts/494485/MooReader%3A%20Enable%20Selecting%20and%20Copying.user.js
// @updateURL https://update.greasyfork.org/scripts/494485/MooReader%3A%20Enable%20Selecting%20and%20Copying.meta.js
// ==/UserScript==

GM.addStyle = function GM_addStyle(css, target)
{
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.textContent = css;

    if (!target) { target = document.head ?? document.documentElement; }
    return target.appendChild(style);
}

const EVENTS_BLACKLIST = new Set(["contextmenu", "copy", "mousedown"]);

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
            if ((node instanceof HTMLElement) && node.classList.contains("book-frame"))
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
            const iframe = node.querySelector("iframe");
            if (iframe)
            {
                iframe.addEventListener("load", () =>
                {
                    iframe.contentWindow.EventTarget.prototype.addEventListener = new Proxy(
                        iframe.contentWindow.EventTarget.prototype.addEventListener,
                        {
                            apply: function(target, thisArg, args)
                            {
                                let type, handler;
                                try
                                {
                                    type = String(args[0]);
                                    handler = String(args[1]);
                                } catch(ex) {}

                                if (type === "mouseup")
                                {
                                    const handler = args[1];
                                    function onMouseUp(event)
                                    {
                                        if (event.button !== 2)
                                        {
                                            handler.call(this, event);
                                        }
                                    }

                                    args[1] = onMouseUp;
                                    return target.apply(thisArg, args);
                                }
                                else if (!EVENTS_BLACKLIST.has(type))
                                {
                                    return target.apply(thisArg, args);
                                }
                            },
                        });

                    Object.defineProperty(iframe.contentDocument.body, "onmousedown", { get: () => null, set: () => {} });
                });
            }
        }
    }
});

observer.observe(document.getElementById("app-container"), { subtree: true, childList: true });
