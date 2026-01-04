// ==UserScript==
// @name        BepisDB卡片下载器
// @namespace   蒋晓楠
// @version     20230820
// @description 自动下载BepisDB的卡片
// @author      蒋晓楠
// @license     MIT
// @match       https://db.bepis.moe/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=bepis.moe
// @grant GM_notification
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @grant GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/473482/BepisDB%E5%8D%A1%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/473482/BepisDB%E5%8D%A1%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
//下载间隔,单位毫秒
const DOWNLOAD_INTERVAL_PER_CARD = 500;//下载每个卡片的间隔,设置太短会出问题
const DOWNLOAD_INTERVAL_PER_PAGE = 3000;//下载每个页面的间隔,设置太短会出问题
//下载状态
const DOWNLOAD_STATUS_STOP = 0;//停止
const DOWNLOAD_STATUS_RUN = 1;//正在下载
//修改配置
function SetConfig(Key, Value) {
    GM_setValue("Config:" + Key, Value);
}

//获取配置
function GetConfig(Key, Default) {
    return GM_getValue("Config:" + Key, Default);
}

//提醒
function Tips(Message) {
    GM_notification({title: "BepisDB卡片下载器", text: Message, timeout: 3000});
}

//获取下载状态
function GetDownloadStatus() {
    return GetConfig("DownloadStatus", DOWNLOAD_STATUS_STOP);
}

//设置下载状态
function SetDownloadStatus(Status) {
    SetConfig("DownloadStatus", Status);
}

//获取当前页码
function GetNowPageNumber() {
    let Element = document.querySelector(".page-item.active .page-link");
    if (Element === null) {
        return -1;
    } else {
        return parseInt(Element.textContent);
    }
}

function DownloadCard() {
    let NowPageNumber = GetNowPageNumber();
    if (NowPageNumber === -1) {
        SetDownloadStatus(DOWNLOAD_STATUS_STOP);
        Tips("当前可能不是卡片列表页面,无法下载");
    } else {
        console.log("开始下载");
        SetDownloadStatus(DOWNLOAD_STATUS_RUN);
        console.log(`当前是第${NowPageNumber}页`);
        let Lists = document.querySelectorAll(".card-block .logo .btn-primary");
        for (let i = 0; i < Lists.length; i++) {
            let Card = Lists[i];
            setTimeout(function () {
                console.log("下载" + Card.href);
                GM_openInTab(Card.href);
                if (i + 1 === Lists.length) {
                    if (NowPageNumber > 1) {
                        console.log("当前页面下载完成");
                        let PreviousPageLink = document.querySelector(".page-item.active").previousElementSibling.querySelector("a").href;
                        console.log(PreviousPageLink)
                        setTimeout(function () {
                            location.href = PreviousPageLink;
                        }, DOWNLOAD_INTERVAL_PER_PAGE);
                    } else {
                        SetDownloadStatus(DOWNLOAD_STATUS_STOP);
                        Tips("全部下载完成");
                    }
                }
            }, i * DOWNLOAD_INTERVAL_PER_CARD);
        }
    }
}

function InitUI() {
    GM_registerMenuCommand(GetDownloadStatus() === DOWNLOAD_STATUS_STOP ? "开始下载" : "停止下载", function () {
        let DownloadStatus = GetDownloadStatus();
        if (DownloadStatus === DOWNLOAD_STATUS_STOP) {
            DownloadCard();
        } else {
            SetDownloadStatus(DOWNLOAD_STATUS_STOP);
        }
    });
}

function Run() {
    InitUI();
    if (GetDownloadStatus() === DOWNLOAD_STATUS_RUN) {
        DownloadCard();
    }
}

Run();