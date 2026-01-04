// ==UserScript==
// @name         WeMeStrongShare
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  微密圈快速分享【强制分享】
// @author       PWNINT32
// @match        https://web.weme.fun/*
// @icon         https://www.google.com/s2/favicons?domain=weme.link
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439271/WeMeStrongShare.user.js
// @updateURL https://update.greasyfork.org/scripts/439271/WeMeStrongShare.meta.js
// ==/UserScript==
function GetBodyJson(_body)// Convert body to json
{
    var _BodyObj = {};
    var _BodyArray = _body.split("&");
    _BodyArray.forEach((item)=>{item = item.trim().split("=");_BodyObj[item[0]]= item[1]})
    return _BodyObj;
}
function InjectIndex()
{
    if(location.href.includes("Login"))
    {
    var QR = document.querySelector("body > div > div.main > div.title > h4 > a:nth-child(3)");
    QR.href="#";
    var WECHAT = document.querySelector("body > div > div.main > div.more-login > a:nth-child(1)");
    WECHAT.href = "#";
    }
}
function LoadingDebugInfo()//加载调试信息
{
    console.warn("[*] 调试信息：脚本加载成功...");
    console.warn("[*] --------------------------");
    console.warn("[*] 欢迎使用本脚本：\n1.本脚本需要搭配工具使用，用于解析付费\VIP帖子\n   2.欢迎加入讨论圈：8390463，每日更新图包");
    console.warn("[*] --------------------------");
}
function GetJsonCookie()
{
    var CookieJar = document.cookie.split(";");
    var ReturnJson = {};
    CookieJar.forEach((item)=>
                      {
        var Result = item.trim().split("=");
        ReturnJson[Result[0]] = Result[1];
    });
    return ReturnJson;
}
function AddExtraInfo(CommunityUid)//为圈子主页添加额外按钮
{
    var MainBar = document.querySelector("body > div.container.body-content > div.main > div.community > div.right > div.right-bottom > div.community-detail > span.action-button");
    MainBar.innerHTML = '<span id="Extra_Uid">点击获取当前圈子的UID</span> <span id="GetCookie">点击获取登陆用户Cookie</span>'
    var CookieSpan = document.querySelector("#GetCookie");
    var GetUid = document.querySelector("#Extra_Uid");
    GetUid.onclick = ()=>{alert(`当前圈子的UID为：${CommunityUid}`)};
    CookieSpan.onclick = ()=>{
        if(GetJsonCookie()["ASP.NET_SessionId"]!=undefined)
        {
            alert(`您的Cookie为：${GetJsonCookie()["ASP.NET_SessionId"]}`);
        }
        else
        {
            alert("浏览器没有取消HttpOnly属性，无法获取登陆Cookie，请安装Cookie Manager解除HttpOnly限制后重试");
        }
    }
}
function GetFullCommunityPost()//更改请求参数获取单个用户全部帖子链接
{
    InjectIndex();
    ah.proxy({
        onRequest: (config, handler) => {
            handler.next(config);//固定写法
        },
        onError: (err, handler) => {
            handler.next(err)
        },
        onResponse: (response, handler) => {
            handler.next(response);
            Change2ShareButton();//等待网页响应完毕后再进行调用
            if(response.config.url.includes("ShareArticle"))
            {
                var ShortLink = JSON.parse(response.response)["data"]["WxUrl"];//获取分享短链
                CloseShareWindowAndGetShareLink(ShortLink);
                console.log("[*] 短链获取成功，内容为"+ShortLink);
            }
            else if(response.config.url.includes("GetCommunityInfo"))
            {
                var CommUid = pageObj.data.CommunityInfo.community.Id;
                AddExtraInfo(CommUid);
            }
        }
    })
}
function Change2ShareButton()
{
    var Action_ItemClass =  document.getElementsByClassName("action-item");
    var Action_ItemClass_Count = Action_ItemClass.length;
    for(var Index=0;Index<Action_ItemClass_Count;Index++)
    {
        var DataEventNum_Ban = "30";
        var DataEventNum_Share = "5";
        var CurrentButton_Type = Action_ItemClass[Index].getAttribute("data-event");
        if(CurrentButton_Type==DataEventNum_Ban)
        {
            Action_ItemClass[Index].setAttribute("data-event","5");
            Action_ItemClass[Index].textContent="获取分享链接";
        }
    }
}
function CloseShareWindowAndGetShareLink(ShareLinkText)//关闭分享成功弹窗，并获取短链内容
{
    var CloseButton = document.getElementById("btn-close");
    if(CloseButton!=undefined)
    {
        CloseButton.click()
        var SearchBox = document.evaluate('/html/body/nav/div/div[1]/form/input',document).iterateNext();
        SearchBox.value = ShareLinkText;//将短链移入到搜索框中
        SearchBox.select();
        document.execCommand('copy');
        var PostInputBox = document.evaluate('/html/body/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/textarea',document).iterateNext();
        PostInputBox.value = "链接已复制到剪贴板中，请直接在软件中粘贴！";

    }
}
GetFullCommunityPost();