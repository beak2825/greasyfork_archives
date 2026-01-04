// ==UserScript==
// @name         b站首页推荐过滤
// @namespace    qwq0
// @version      0.2
// @description  过滤b站首页推荐的内容
// @author       qwq0
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490848/b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/490848/b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(async function ()
{
    'use strict';

    if (location.pathname != "/")
        return;

    /** @type {typeof fetch} */
    let oldFetch = window.fetch.bind(window);

    window.fetch = async (...param) =>
    {
        if (
            typeof(param[0]) == "string" &&
            (
                param[0].startsWith("https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd") ||
                param[0].startsWith("https://api.bilibili.com/x/web-interface/index/top/feed/rcmd") ||
                param[0].startsWith("//api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd") ||
                param[0].startsWith("//api.bilibili.com/x/web-interface/index/top/feed/rcmd")
            )
        )
        {
            let response = await oldFetch(...param);

            if (!response.ok)
                return response;

            try
            {
                let jsonText = await (response.clone()).text();
                /**
                 * @type {{
                 *  data: {
                 *      item: Array<{
                 *          goto: string
                 *      }>
                 *  }
                 * }}
                 */
                let dataObj = JSON.parse(jsonText);
                dataObj.data.item = dataObj.data.item.filter(o => o.goto != "ad");
                return Response.json(dataObj);
            }
            catch (err)
            {
                console.error("Filter agent error, fallen back to original data.", err);
                return response;
            }
        }
        return oldFetch(...param);
    };

})();