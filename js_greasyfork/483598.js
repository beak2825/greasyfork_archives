// ==UserScript==
// @name         超星考试题目查询
// @namespace    net.myitian.js.cx.exam
// @version      1.0
// @description  超星考试题目查询（仅查询，无自动答题功能），支持单题和整卷预览
// @author       Myitian
// @license      MIT
// @connect      api.muketool.com
// @connect      api2.muketool.com
// @match        https://mooc1.chaoxing.com/exam-ans/exam/test/reVersionTestStartNew?*
// @match        https://mooc1.chaoxing.com/exam-ans/mooc2/exam/preview?*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/483598/%E8%B6%85%E6%98%9F%E8%80%83%E8%AF%95%E9%A2%98%E7%9B%AE%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/483598/%E8%B6%85%E6%98%9F%E8%80%83%E8%AF%95%E9%A2%98%E7%9B%AE%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

async function query() {
    var questions = document.querySelectorAll(".mark_name>div");
    var ol = MainDiv.querySelector("#myt-result");
    ol.innerHTML = "";
    for (var question of questions)
    {
        var li = document.createElement("li");
        li.innerText = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: "https://api.muketool.com/cx/v2/query",
                method: "POST",
                data: `{"question":"${encodeURIComponent(question.innerText)}"}`,
                responseType: "json",
                headers: {
                    "Content-type": "application/json"
                },
                onload: (xhr) => {
                    resolve(xhr.response.data);
                }
            });
        })
        ol.appendChild(li);
    }
}

function f()
{
    console.log(query);
    query();
}

function main() {
    MainDiv.id = "myt-cx";
    MainDiv.className = "padlr24";
    MainDiv.innerHTML = `
<button id="myt-query">查询</button>
<div>
    <ol id="myt-result"></ol>
</div>
<style>
    #myt-cx>div {
        overflow: auto;
        height: 16em;
    }

    #myt-query {
        background: #3A8BFF;
        width: 4em;
        height: 2em;
        font-size: 14px;
        color: #fff;
        border: none;
    }

    #myt-query:hover {
        background: #5CA0FF;
    }

    #myt-query:active {
        background: #2F70CC;
    }

    #myt-result {
        list-style: revert;
        margin-top: 1em;
        line-height: 1.5;
        padding: revert;
    }

    #myt-result li {
        list-style: revert;
        word-break: break-all;
    }
</style>`;
    MainDiv.querySelector("#myt-query").addEventListener("click", f);
    document.querySelector(".marking_left_280").appendChild(MainDiv);
}

const MainDiv = document.createElement("div");
main();