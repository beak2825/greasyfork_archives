// ==UserScript==
// @name         漫画模式
// @namespace    潭沛容
// @version      20230524
// @description  手机版页面进入漫画模式
// @author       潭沛容
// @license      MIT
// @match        https://m.xlsmh.com/manhua/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xlsmh.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/473488/%E6%BC%AB%E7%94%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/473488/%E6%BC%AB%E7%94%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
//修改配置
function SetConfig(Key, Value) {
    GM_setValue("Config:" + Key, Value);
}

//获取配置
function GetConfig(Key, Default) {
    return GM_getValue("Config:" + Key, Default);
}

//删除配置
function RemoveConfig(Key) {
    GM_deleteValue("Config:" + Key);
}

function EnterMangaMode() {
    SetConfig("模式", "漫画");
    location.reload();
}

function InitCSS() {
    GM_addStyle(`.TPRModeButton {
    height: 5rem;
    width: 100%;
    font-size: 2rem;
    margin-top: 3rem;
}

.TPRMangaHolder {
    position: absolute;
    top: 0;
    z-index: 2147483647;
}
.TPRActionHolder{
    display: flex;
    justify-content: space-around;
    font-size: 2rem;
}`);
}


function InitElement() {
    if (GetConfig("模式", "默认") === "默认") {
        let StartButton = GM_addElement(document.body, "button", {class: "TPRModeButton", textContent: "进入阅读模式"});
        document.body.prepend(StartButton);
        let EndButton = GM_addElement(document.body, "button", {class: "TPRModeButton", textContent: "进入阅读模式"});
        StartButton.onclick = EnterMangaMode;
        EndButton.onclick = EnterMangaMode;
    } else {
        let ImageList = document.querySelectorAll(".scroll-item img");
        let ImageSrc = [];
        ImageList.forEach(function (Element) {
            let Src = Element.getAttribute("data-src");
            ImageSrc.push(Src === null ? Element.src : Src);
        })
        console.log("图片列表", ImageSrc);
        let PrevSrc = document.querySelector(".beforeChapter").href;
        let NextSrc = document.querySelector(".afterChapter").href;
        let DirectorySrc = document.querySelector(".ChapterLestMune").href;
        console.log("上一章", PrevSrc, "下一章", NextSrc, "目录", DirectorySrc);
        document.body.innerHTML = "";
        let MangaHolder=GM_addElement(document.body, "div", {class: "TPRMangaHolder"});
        MangaHolder.ontouchstart=function (e) {
            e.stopPropagation();
        }
        ImageSrc.forEach(function (Element) {
            let MangaImage = GM_addElement(MangaHolder, "img", {src: Element});
        });
        let ActionHolder=GM_addElement(MangaHolder, "div", {class: "TPRActionHolder"});
        GM_addElement(ActionHolder, "a", {href: PrevSrc,textContent:"上一章"});
        GM_addElement(ActionHolder, "a", {href: DirectorySrc,textContent:"目录"});
        GM_addElement(ActionHolder, "a", {href: NextSrc,textContent:"下一章"});
        let ExitButton=GM_addElement(MangaHolder, "button", {class: "TPRModeButton", textContent: "退出阅读模式"});
        ExitButton.onclick=function () {
            RemoveConfig("模式");
            location.reload();
        }
    }
}

function Run() {
    InitCSS();
    InitElement();
}

Run();