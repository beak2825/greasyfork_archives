// ==UserScript==
// @name         b站回溯首页推荐换一换
// @namespace    qwq0
// @version      0.4
// @description  b站推荐换一换添加撤回按钮
// @author       qwq0
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488965/b%E7%AB%99%E5%9B%9E%E6%BA%AF%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E6%8D%A2%E4%B8%80%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/488965/b%E7%AB%99%E5%9B%9E%E6%BA%AF%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E6%8D%A2%E4%B8%80%E6%8D%A2.meta.js
// ==/UserScript==

(async function ()
{
    'use strict';

    if (location.pathname != "/")
        return;

    let history = [];
    let nowIndex = -1;

    let clickdButton = false;
    let clickdBacktrackButton = false;

    let oldFetch = window.fetch.bind(window);
    window.fetch = async (...param) =>
    {
        if (
            (clickdButton || clickdBacktrackButton) &&
            typeof (param[0]) == "string" &&
            (
                param[0].startsWith("https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd") ||
                param[0].startsWith("https://api.bilibili.com/x/web-interface/index/top/feed/rcmd") ||
                param[0].startsWith("//api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd") ||
                param[0].startsWith("//api.bilibili.com/x/web-interface/index/top/feed/rcmd")
            )
        )
        {
            if (clickdButton)
            {
                clickdButton = false;

                if (nowIndex < history.length - 1)
                {
                    nowIndex++;
                    if (nowIndex >= 1)
                        backtrackButton.style.display = "block";
                    return history[nowIndex].clone();
                }
                else
                {
                    if (nowIndex == -1)
                    { // 第一层点击按钮时尝试构造推荐响应
                        try
                        {
                            let feedCardList = document.querySelectorAll("main div.feed-card");
                            let cardDataList = [];
                            for (let o of feedCardList)
                            {
                                try
                                {
                                    let link = String(o.querySelectorAll(".bili-video-card__image--link")[0].href);
                                    let title = String(o.querySelectorAll(".bili-video-card__info--tit")[0].innerText);
                                    let cover = String(o.querySelectorAll("img")[0].src);
                                    // let bvInd = link.indexOf("/BV");
                                    // let bvid = link.slice(bvInd + 1);
                                    cardDataList.push({
                                        goto: "av",
                                        // bvid: bvid,
                                        uri: link,
                                        pic: cover,
                                        title: title
                                    });
                                }
                                catch (err)
                                { }
                            }
                            if (cardDataList.length == 0)
                                throw "Unable to extract element";
                            let dataObj = {
                                code: 0,
                                message: "0",
                                ttl: 1,
                                data: {
                                    item: cardDataList
                                }
                            };
                            // console.log("test", dataObj);
                            let response = new Response(JSON.stringify(dataObj), {});
                            history.push(response.clone());
                            nowIndex++;
                        }
                        catch (err)
                        {
                            console.error("build first rcmd failure:", err);
                        }
                    }
                    /**
                     * @type {Response}
                     */
                    let response = await oldFetch(...param);
                    history.push(response.clone());
                    nowIndex++;
                    if (nowIndex >= 1)
                        backtrackButton.style.display = "block";
                    // console.log(response.clone());
                    return response;
                }
            }
            else
            {
                clickdBacktrackButton = false;

                nowIndex--;
                if (nowIndex < 0)
                    nowIndex = 0;

                if (nowIndex == 0)
                    backtrackButton.style.display = "none";

                return history[nowIndex].clone();
            }
        }
        return oldFetch(...param);
    };

    function parseHtmlString(htmlString)
    {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = htmlString;
        return wrapper.firstChild;
    }

    let buttonRoll = await new Promise(resolve =>
    {
        let intervalId = setInterval(() =>
        {
            let buttonRoll = document.querySelectorAll(".feed-roll-btn")[0];
            if (buttonRoll != undefined)
            {
                resolve(buttonRoll);
                clearInterval(intervalId);
            }
        }, 150);
    });


    let refreshButton = buttonRoll.children[0];
    let backtrackButton = parseHtmlString(`<button style="margin-top: 10px;" class="primary-btn roll-btn"><span>回溯</span></button>`);
    buttonRoll.appendChild(backtrackButton);
    backtrackButton.style.display = "none";

    refreshButton.addEventListener("click", () =>
    {
        if (!clickdBacktrackButton)
            clickdButton = true;
    }, true);
    backtrackButton.addEventListener("click", () =>
    {
        clickdBacktrackButton = true;
        refreshButton.click();
    });
})();

