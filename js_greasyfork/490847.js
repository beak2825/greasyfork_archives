// ==UserScript==
// @name         b站缩短分享链接
// @namespace    qwq0
// @version      0.1
// @description  b站缩短剪贴板分享链接
// @author       qwq0
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490847/b%E7%AB%99%E7%BC%A9%E7%9F%AD%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/490847/b%E7%AB%99%E7%BC%A9%E7%9F%AD%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function ()
{
    "use strict";

    /** @type {typeof navigator.clipboard.writeText} */
    let oldClipboardWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);

    navigator.clipboard.writeText = async (...param) =>
    {
        let newClipText = String(param[0]);
        let urlRegex = /(http|https|ftp):\/\/[\w\-]+(\.[\w\-]+)*([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g;
        let regexExec = null;
        let clipText = "";
        let lastIndex = 0;
        while ((regexExec = urlRegex.exec(newClipText)) != null)
        {
            let url = regexExec[0];
            let urlObj = new URL(url);
            clipText += newClipText.slice(lastIndex, regexExec.index);
            if (urlObj.hostname == "www.bilibili.com" && urlObj.pathname.startsWith("/video/"))
            {
                let bvId = (urlObj.pathname.at(-1) == "/" ? urlObj.pathname.slice(7, -1) : urlObj.pathname.slice(7));
                let addition = [];
                urlObj.search.slice(1).split("&").forEach(o =>
                {
                    if (o.startsWith("p="))
                        addition.push(o);
                });

                if (addition.length == 0)
                    clipText += "https://b23.tv/" + bvId;
                else
                    clipText += "https://www.bilibili.com/video/" + bvId + "?" + addition.join("&");
            }
            else
            {
                clipText += url;
            }
            lastIndex = urlRegex.lastIndex;
        }
        clipText += newClipText.slice(lastIndex);
        await oldClipboardWriteText(clipText);
        return;
    };

})();