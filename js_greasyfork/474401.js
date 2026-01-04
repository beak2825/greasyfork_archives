// ==UserScript==
// @name         草榴下载文学区小说
// @namespace    蒋晓楠
// @version      20231220
// @description  可以下载草榴文学区小说
// @author       潭沛容
// @license      MIT
// @match        https://t66y.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t66y.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/474401/%E8%8D%89%E6%A6%B4%E4%B8%8B%E8%BD%BD%E6%96%87%E5%AD%A6%E5%8C%BA%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/474401/%E8%8D%89%E6%A6%B4%E4%B8%8B%E8%BD%BD%E6%96%87%E5%AD%A6%E5%8C%BA%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==
const STATUS_IDLE = 0, STATUS_WORK = 1;

function GetStatus() {
    return GM_getValue("Status", STATUS_IDLE);
}

function SetStatus(Status) {
    GM_setValue("Status", Status);
}

function SetTitle(Title) {
    GM_setValue("Title", Title);
}

function GetTitle(Name) {
    return GM_getValue("Title");
}

function DownloadFile(Name, Data) {
    let TextFile = document.createElement("a");
    TextFile.download = Name + ".txt";
    TextFile.href = URL.createObjectURL(new Blob([Data]));
    TextFile.click();
}

function IsFirstPage() {
    return document.querySelector(".pages a").href === "javascript:#";
}

function IsLastPage() {
    return document.querySelector(".pages #last").href === "javascript:#";
}

function GetNextPageUrl() {
    return document.querySelector(".pages #last").previousElementSibling.href;
}

function GetContent() {
    return GM_getValue("Content", "");
}

function ClearContent() {
    GM_setValue("Content", "");
}

function AppendContent(Content) {
    GM_setValue("Content", GetContent() + Content);
}

function Run() {
    if (GetStatus() === STATUS_WORK) {
        //第一页的中间页禁用
        if (Object.fromEntries((new URL(location.href)).searchParams).page !== "1") {
            console.log()
            if (IsFirstPage()) {
                //移除内容的点赞按钮
                document.querySelector(".t_like").remove();
                SetTitle(document.querySelector(".tiptop~h4").textContent);
            }
            let Content = "";
            document.querySelectorAll(".t2").forEach((Element) => {
                let NowPosterUrl = Element.querySelector(".tiptop a:nth-child(2)").href;
                if (Object.fromEntries((new URL(NowPosterUrl)).searchParams).uid === authorid.toString()) {
                    Content += Element.querySelector(".tpc_content").innerText;
                }
            });
            AppendContent(Content);
            if (IsLastPage()) {
                DownloadFile(GetTitle(), GetContent());
                SetStatus(STATUS_IDLE);
            } else {
                location.href = GetNextPageUrl();
            }
        }
    } else {
        GM_registerMenuCommand("输入帖子ID", () => {
            SetStatus(STATUS_WORK);
            ClearContent();
            let Id = prompt("ID");
            location.href = `https://t66y.com/read.php?tid=${Id}&page=1`;
        });
    }
}

Run();