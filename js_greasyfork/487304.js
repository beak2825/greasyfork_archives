// ==UserScript==
// @name               ESJ Zone: Unify Domain Names
// @name:zh-TW         ESJ Zone：統一域名
// @name:zh-CN         ESJ Zone：统一网域
// @description        Unify internal links to use the current mirror.
// @description:zh-TW  統一內部連結使用目前鏡像站點。
// @description:zh-CN  统一内部链接使用目前镜像站点。
// @icon               https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.1.0
// @license            MIT
// @match              https://www.esjzone.cc/*
// @match              https://www.esjzone.me/*
// @match              https://www.esjzone.one/*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/487304/feedback
// @downloadURL https://update.greasyfork.org/scripts/487304/ESJ%20Zone%3A%20Unify%20Domain%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/487304/ESJ%20Zone%3A%20Unify%20Domain%20Names.meta.js
// ==/UserScript==

(async function ()
{
    const WHITELISTED_HOSTNAMES = ["www.esjzone.cc", "www.esjzone.one", "www.esjzone.me"];

    function handleAnchor(anchor)
    {
        if (!anchor.href) { return false; }

        const url = new URL(anchor.href);
        if (!WHITELISTED_HOSTNAMES.includes(url.hostname)) { return false; }

        if (url.hostname !== location.hostname)
        {
            url.hostname = location.hostname;
            anchor.href = url.href;

            return true;
        }

        return false;
    }

    async function handleAnchorAsync(anchor)
    {
        return handleAnchor(anchor);
    }

    const results = await Promise.all(Array.from(document.getElementsByTagName("a")).map(handleAnchorAsync));
    console.debug(`Updated ${results.reduce((last, result) => (last + result), 0)} URL(s).`);
})();
