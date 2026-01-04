// ==UserScript==
// @name         Nex介面美化
// @namespace    http://tampermonkey.net/
// @version      0.1.7.1
// @description  Nex介面美化、自定義
// @author       MirukuTEA
// @include      https://nex.starinc.xyz/*
// @exclude      https://nex.starinc.xyz/api/*
// @exclude      https://nex.starinc.xyz/assets/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407696/Nex%E4%BB%8B%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407696/Nex%E4%BB%8B%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

"use strict";

const DefaultHeroColor = [98, 0, 232];
const CSSVariable = (property, value) => document.documentElement.style.setProperty(property, value);
const IsMobileMode = () => window.innerWidth < 768;

//介面美化自定義相關參數
var BeautifySetting = {
    IndexNaviReverse: GM_getValue("IndexNaviReverse", false),
    DynamicColoredHeader: GM_getValue("DynamicColoredHeader", false),
    HeaderAutoHide: GM_getValue("HeaderAutoHide", false),
    BlurredBackgroundEnabled: GM_getValue("BlurredBackgroundEnabled", false),
    BackgroundTransparency: GM_getValue("BackgroundTransparency", 80),
    BackgroundImageUrl: GM_getValue("BackgroundImageUrl", ""),
    CustomFont: GM_getValue("CustomFont", ""),
    CustomFontCode: GM_getValue("CustomFontCode", ""),
    BlurRadius: GM_getValue("BlurRadius", 15),
    PostForceHide: GM_getValue("PostForceHide", false)
};

//功能相關參數
var FunctionSetting = {
    DiscussionLimit: GM_getValue("DiscussionLimit", false),
    UsernameHistoryQuickView: GM_getValue("UsernameHistoryQuickView", false),
    ComposerPreview: GM_getValue("ComposerPreview", false),
    BeautifyCSSEnabled: GM_getValue("BeautifyCSSEnabled", true),
    LazyLoad: GM_getValue("LazyLoad", false),
    ColoredMention: GM_getValue("ColoredMention", false)
};
const LoadedFunctionSetting = {
    ...FunctionSetting
};

var DiscussionOffset = 0;
var DiscussionEnd = false;
var DiscussionFirst = true;
var CurrentHeroColor = [98, 0, 232];

var PageChecker = null;
var NightModeChecker = null;

var PreviewChecker = null;
var PreviewSource = "";
var PreviewFlag = false;

if (LoadedFunctionSetting["LazyLoad"]) {
    var LazyLoader = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !!entry.target.getAttribute("data-src")) {
                entry.target.setAttribute("src", entry.target.getAttribute("data-src"));
                entry.target.removeAttribute("data-src");
                entry.target.classList.add("Loading");
                entry.target.onload = () => {
                    entry.target.classList.remove("Loading");
                };
                entry.target.onerror = () => {
                    console.log("圖片未載入");
                    entry.target.classList.remove("Loading");
                    entry.target.classList.add("Error");
                };
                LazyLoader.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "40% 0px 40% 0px"
    });
}

LoadStyle();
LoadBeautifySetting();

WaitForLoaded(0);

function WaitForLoaded(i) {
    if (typeof (app) !== "undefined" && app.forum) {
        if (LoadedFunctionSetting["BeautifyCSSEnabled"]) LoadImage(BeautifySetting["BackgroundImageUrl"]);
        AddSettingButton(); //載入完成後再加入設定選單按鈕

        if (Object.values(LoadedFunctionSetting).some(x => x === true)) {
            PageCheck(); //先執行一次PageCheck確保首次載入的頁面有套用到效果

            PageChecker = new MutationObserver(mr => {
                let records = Object.values(mr);
                if (records.length > 1 && !(records.length == 6 && records.some(x => x.target.classList.contains("Scrubber-description"))))
                    PageCheck();
            });
            PageChecker.observe(document.querySelector(".App-content"), {
                "childList": true,
                "subtree": true
            });

            //網站換成了另一種開關黑暗模式的方式
            NightModeCheck();
            NightModeChecker = new MutationObserver(_ => NightModeCheck());
            NightModeChecker.observe(document.querySelector("link[rel=stylesheet][class*=nightmode]"), {
                "attributes": true
            });
        }
    } else {
        //如果經過一分鐘未能正常進入則停止呼叫
        if (i < 120) setTimeout(() => WaitForLoaded(i + 1), 500);
    }
}

function NightModeCheck() {
    let mode = app.session.user ? app.session.user.preferences().fofNightMode : (parseInt(app.data['fof-nightmode.default_theme']) || 0)
    switch (mode) {
        case 0:
            document.body.classList.toggle("dark", window.matchMedia('(prefers-color-scheme: dark)').matches);
            break;
        case 1:
            document.body.classList.remove("dark");
            break;
        case 2:
            document.body.classList.add("dark");
            break;
    }
}

function PageCheck() {
    if (LoadedFunctionSetting["BeautifyCSSEnabled"]) ColoredHero();

    if (LoadedFunctionSetting["ComposerPreview"]) ComposerCheck();

    if (app.current.bodyClass === "App--index" || app.current.bodyClass === "App--discussion") {
        if (LoadedFunctionSetting["DiscussionLimit"]) DiscussionListLimit();
    }

    if (app.current.bodyClass === "App--discussion" || app.current.bodyClass === "App--user") {
        if (LoadedFunctionSetting["UsernameHistoryQuickView"]) AddUsernameHistoryButton();
        if (LoadedFunctionSetting["LazyLoad"]) LazyLoad();
        if (LoadedFunctionSetting["ColoredMention"]) ColoredMention();
    }

    if (app.current.bodyClass === "App--discussion") {
        if (LoadedFunctionSetting["BeautifyCSSEnabled"] && !IsMobileMode()) ScrubberMaxHeightCalc();
    }

    if (app.current.bodyClass === "App--index") {
        let query = app.cache.discussionList.props.params.q;
        if (!(query && (query.includes("is:ignored") || query.includes("is:ignoring"))))
            app.cache.discussionList.discussions.filter(x => x.data.attributes.subscription === "ignore").forEach(x => document.querySelector(`.DiscussionList-discussions > li[data-id="${x.data.id}"]`).style.display = "none");
    }
}


function ScrubberMaxHeightCalc() {
    let scrubber = document.querySelector(".Scrubber-scrollbar:not(.Fixed)");
    if (scrubber) {
        let contentMaxHeight = document.querySelector(".DiscussionPage-stream .PostStream").clientHeight;
        let navHeight = document.querySelector(".DiscussionPage-nav > ul").clientHeight - document.querySelector("li.item-scrubber").clientHeight;
        let newMaxHeight = contentMaxHeight - navHeight - 76;
        let finalCalcMaxHeight = newMaxHeight > 300 ? 300 : newMaxHeight < 38 ? 38 : newMaxHeight;
        scrubber.style.height = finalCalcMaxHeight + "px";
        scrubber.classList.add("Fixed");
    }
}

function LazyLoad() {
    document.querySelectorAll(`.CommentPost:not(.editing) .Post-body img:not(.emoji):not([src=""]):not(.Lazy)`).forEach(function (img) {
        img.setAttribute("data-src", img.src);
        img.removeAttribute("src");
        img.classList.add("Lazy");
        LazyLoader.observe(img);
    })
}

function ColoredHero() {
    let hero = document.querySelector(".Hero.TagHero--colored") || document.querySelector(".Hero.DiscussionHero--colored") || document.querySelector(".Hero.UserHero");
    if (hero) {
        //UserHero的顏色會比較晚才讀進來
        if (hero.style.backgroundColor === "") {
            setTimeout(() => {
                if (hero.style.backgroundColor) ColoredHero();
            }, 500);
            return;
        }

        let currentHeroColor = hero.style.backgroundColor.replace(/[^0-9,.]/g, "").split(",");

        if (hero.classList.contains("UserHero"))
            currentHeroColor = currentHeroColor.map(i => Math.round(parseFloat(i) * 0.65));

        if (CurrentHeroColor !== currentHeroColor) {
            CurrentHeroColor = currentHeroColor;
            CSSVariable("--colored-hero", currentHeroColor.join(", "));
        }
    } else {
        //如果頁面沒有出現Hero元素時，CurrentHeroColor會被設為日間模式預設的藍色
        if (CurrentHeroColor !== DefaultHeroColor) {
            CurrentHeroColor = DefaultHeroColor;
            CSSVariable("--colored-hero", DefaultHeroColor.join(", "));
        }
    }
}

function ColoredMention() {
    document.querySelectorAll(".CommentPost:not(.editing) .PostMention:not(.Colored)").forEach(function (postmention) {
        //還原包含emoji的名字（UserMetion由於本來就無法正常顯示所以就不做了...
        let username = postmention.childNodes.length > 1 ? Array.from(postmention.childNodes).map(x => x.nodeName == "IMG" ? x.alt : x.textContent).join("") : postmention.textContent;
        GetUserColor(username).then(x => {
            postmention.style.backgroundColor = x;
            postmention.classList.add("Colored");
        }).catch(x => console.log(x));

    })

    document.querySelectorAll(".CommentPost:not(.editing) .UserMention:not(.Colored)").forEach(function (usermention) {
        let username = usermention.textContent.slice(1);
        GetUserColor(username).then(x => {
            usermention.style.backgroundColor = x;
            usermention.classList.add("Colored");
        }).catch(x => console.log(x));
    })
}

async function GetUserColor(username) {
    let userdata = Object.values(app.store.data.users).find(x => x.data.attributes.username === username);

    return await new Promise((resolve, reject) => {
        if (userdata) {
            let color = userdata.color();
            if (color === "") { //如果回傳空白字串代表該使用者有設圖片頭貼，而顏色尚未從圖片生成
                setTimeout(function () {
                    if (userdata.avatarColor)
                        resolve(`rgb(${userdata.avatarColor.map(x => Math.round(x * 0.65)).join(", ")})`);
                    else
                        reject("顏色未產生");
                }, 500);
            } else {
                let colorArray = color.includes("#") ? color.match(/(?!#).{1,2}/g).map(x => Math.round(parseInt(x, 16) * 0.65)) : color.replace(/[^0-9,.]/g, "").split(",").map(x => Math.round(x * 0.65));
                resolve(`rgb(${colorArray.join(", ")})`);
            }
        } else {
            reject("使用者資料尚不存在");
        }
    })
}

//主題列表改以類似換頁的方式呈現
//目前已知問題：搜尋不會觸發頁數重置
function DiscussionListLimit() {
    let loadMore = document.querySelector(".DiscussionList-loadMore:not(.Limit)");
    if (loadMore) {
        loadMore.insertAdjacentHTML("beforeend", `<button id="button-prevpage" class="Button" type="button" title="上一頁"><span class="Button-label">上一頁</span></button><span id="span-page">第${DiscussionOffset + 1}頁</span><button id="button-nextpage" class="Button" type="button" title="下一頁"><span class="Button-label">下一頁</span></button>`);

        document.getElementById("button-nextpage").addEventListener("click", function () {
            if (!DiscussionEnd) {
                DiscussionOffset += 1;
                LoadDiscussions();
            }
        });
        document.getElementById("button-prevpage").addEventListener("click", function () {
            if (!DiscussionFirst) {
                DiscussionOffset -= 1;
                LoadDiscussions();
            }
        });

        if (app.previous && (app.current.bodyClass === "App--index" && app.previous.bodyClass !== "App--discussion")) {
            OffsetReset();
        }

        PageOffsetUpdate();
        loadMore.classList.add("Limit");
    }

    //按下重整按鈕後重置參數
    let refresh = document.querySelector(".item-refresh:not(.Limit)");
    if (refresh) {
        refresh.addEventListener("click", function () {
            OffsetReset();
            PageOffsetUpdate();
        }, true);
        refresh.classList.add("Limit");
    }
}

function LoadDiscussions() {
    if (app.current.bodyClass === "App--index")
        window.scrollTo(0, 0);
    app.cache.discussionList.discussions = [];
    app.cache.discussionList.loading = true;
    m.redraw();
    app.cache.discussionList.loadResults(DiscussionOffset * 20).then(function (x) {
        //如果載入沒東西就重整跳回第一頁
        if (x.payload.data.length == 0) {
            console.log("道生一，一生二，二生三，三生萬物");
            app.cache.discussionList.loading = false;
            OffsetReset();
            PageOffsetUpdate();
            app.cache.discussionList.refresh();
            return;
        }
        app.cache.discussionList.parseResults(x);
        DiscussionEnd = x.payload.links.next ? false : true;
        DiscussionFirst = x.payload.links.prev ? false : true;
        PageOffsetUpdate();
    });
}

function PageOffsetUpdate() {
    if (document.getElementById("button-nextpage")) document.getElementById("button-nextpage").disabled = !!DiscussionEnd;
    if (document.getElementById("button-prevpage")) document.getElementById("button-prevpage").disabled = !!DiscussionFirst;
    if (document.getElementById("span-page")) document.getElementById("span-page").textContent = `第${DiscussionOffset + 1}頁`;
}

function OffsetReset() {
    DiscussionOffset = 0;
    DiscussionEnd = false;
    DiscussionFirst = true;
}

function AddUsernameHistoryButton() {
    let postuser = document.querySelectorAll(".CommentPost:not(.editing) .PostUser:not(.History)");
    if (postuser.length > 0) {
        postuser.forEach(function (val) {
            let link = val.querySelector("h3 > a");
            let userid = link.getAttribute("href").slice("/u/".length);
            let historyNames = app.store.data.users[userid].data.attributes.usernameHistory;
            if (historyNames !== null) {
                //如果3天內有改名的會標記訊息
                if (Math.floor((Date.now() / 1000 - Object.values(historyNames[historyNames.length - 1])[0]) / (3600 * 24)) <= 3) {
                    val.classList.add("Recent");
                }
                link.insertAdjacentHTML("afterend", `<button type=button class="username-history fas fa-sort-down" data-toggle="dropdown"></button><ul class="Dropdown-menu dropdown-menu dropdown-history"></ul>`);
                val.querySelector(".username-history").addEventListener("click", function (e) {
                    let dropdown = e.target.nextElementSibling;
                    if (!dropdown.classList.contains("Loaded")) {
                        let currentUsername = app.store.data.users[userid].data.attributes.username;
                        dropdown.insertAdjacentHTML("beforeend", `<li><span>這位使用者曾使用過的名字：</span></li><ul>${historyNames.filter(x => Object.keys(x)[0] !== currentUsername).reverse().map(x => `<li><span>${Object.keys(x)[0]}</span></li>`).join("")}</ul>`);
                        dropdown.classList.add("Loaded");
                    }
                });
                val.querySelector(".dropdown-history").addEventListener("click", e => e.stopPropagation());
            }

            val.classList.add("History");
        });
    }
}

//貼文預覽
function ComposerCheck() {
    if (app.composer.component) {
        if (!document.getElementById("item-previewmodal")) {
            document.querySelector("#composer > .Composer").insertAdjacentHTML("afterbegin", `<div id="item-previewmodal"><h2>預覽</h2><div id="preview-postbody" class="Post-body"></div></div>`);
        }
        //每切換一次頁面時Composer裡的按鈕都會被洗掉...
        if (!document.getElementById("item-preview")) {
            document.querySelector("#composer > .Composer > .Composer-controls").insertAdjacentHTML("beforeend", `<li id="item-preview"><button title="預覽" class="Button Button--icon Button--link hasIcon" type="button" aria-label="預覽"><i class="icon far Button-icon"></i></button></li>`);

            document.querySelector("#item-preview > button").addEventListener("click", function () {
                PreviewFlag = !PreviewFlag;
                PreviewCheck(PreviewFlag);
                document.getElementById("composer").classList.toggle("HidePreview", !PreviewFlag);
                let icon = document.querySelector("#item-preview i.Button-icon");
                icon.classList.toggle("fa-eye-slash", !PreviewFlag);
                icon.classList.toggle("fa-eye", PreviewFlag);
            });
        }

        if (document.getElementById("item-previewmodal"))
            document.getElementById("composer").classList.toggle("HidePreview", !PreviewFlag);
        let icon = document.querySelector("#item-preview i.Button-icon");
        if (icon) {
            icon.classList.toggle("fa-eye-slash", !PreviewFlag);
            icon.classList.toggle("fa-eye", PreviewFlag);
        }
    } else {
        //關閉輸入框就停用預覽
        if (PreviewFlag) {
            PreviewFlag = false;
            PreviewCheck(PreviewFlag);
        }
    }
}

function PreviewCheck(flag) {
    let previewpostbody = document.getElementById("preview-postbody");
    if (flag) {
        console.log("開啟預覽");
        PreviewChecker = setInterval(function () {
            let maxHeight = window.innerHeight * 0.9 - parseFloat(document.querySelector("#composer > .Composer").style.height);
            document.getElementById("item-previewmodal").style.display = maxHeight < 100 ? "none" : "";
            document.getElementById("item-previewmodal").style.maxHeight = maxHeight + "px";

            if (app.composer.component && previewpostbody && PreviewSource !== app.composer.component.editor.value()) {
                PreviewSource = app.composer.component.editor.value();
                s9e.TextFormatter.preview(PreviewSource, previewpostbody);
            }
        }, IsMobileMode() ? 1000 : 200); //手機版預覽調整為一秒檢查一次
    } else {
        console.log("關閉預覽");
        //關閉時清空預覽的內容，防止在預覽內播放影片後關掉預覽仍繼續播放的現象
        PreviewSource = "";
        if (previewpostbody) {
            previewpostbody.innerHTML = "";
        }
        clearInterval(PreviewChecker);
        PreviewChecker = null;
    }
}

function Reverse(e) {
    document.querySelector(".App-content").classList.toggle("Reverse", e);
}

function Dynamic(e) {
    document.getElementById("app").classList.toggle("DynamicColored", e);
}

function AutoHide(e) {
    document.getElementById("app").classList.toggle("AutoHide", e);
}

function ForceHide(e) {
    document.getElementById("app").classList.toggle("ForceHide", e);
}

function BlurredBackground(e) {
    document.body.classList.toggle("Blurred", e);
    ToggleElement(document.getElementById("input-blurradius"), e);
};

function SetCustomFont(e) {
    document.body.classList.toggle("CustomFont", e);
    CSSVariable("--custom-font", `"${e}"`);
};

function SetCustomFontCode(e) {
    document.body.classList.toggle("CustomFontCode", e);
    CSSVariable("--custom-font-code", `"${e}"`);
};

function LoadImage(imagrUrl) {
    if (imagrUrl.toLowerCase().includes(".jpg") ||
        imagrUrl.toLowerCase().includes(".jpeg") ||
        imagrUrl.toLowerCase().includes(".png") ||
        imagrUrl.toLowerCase().includes(".gif")) {
        let BackgroundImage = new Image;
        BackgroundImage.src = imagrUrl;
        BackgroundImage.onerror = function () {
            console.log("圖片讀取錯誤");
            BeautifySetting["BackgroundImageUrl"] = "";
            GM_setValue("BackgroundImageUrl", "");
            SwitchBackgroundStyle(false);
        }
        BackgroundImage.onload = function () {
            SwitchBackgroundStyle(true);
        }
    } else {
        console.log("網址留白或非圖片，將使用純色背景");
        SwitchBackgroundStyle(false);
    }
}

function SwitchBackgroundStyle(flag) {
    document.body.style.backgroundImage = flag ? `url("${BeautifySetting["BackgroundImageUrl"]}")` : "";
    document.body.classList.toggle("HasImageBackground", flag);
    ToggleElement(document.getElementById("input-backgroundtransparency"), flag);
    ToggleElement(document.getElementById("button-blurredbackgroundenabled"), flag);
    ToggleElement(document.getElementById("input-blurradius"), flag && BeautifySetting["BlurredBackgroundEnabled"]);
}

function SetBackgroundTransparency(transparency) {
    if (!isNaN(parseFloat(transparency)) && isFinite(transparency)) {
        CSSVariable("--transparency", (transparency / 100).toFixed(2));
        SetBlurRadius(BeautifySetting["BlurRadius"])
    } else {
        console.log("不是數字");
    }
}

function SetBlurRadius(radius) {
    if (!isNaN(parseFloat(radius)) && isFinite(radius)) {
        CSSVariable("--blur-radius", BeautifySetting["BackgroundTransparency"] == 100 ? "0" : `${radius}px`);
    } else {
        console.log("不是數字");
    }
}

function AddSettingButton() {
    let headerControls = document.querySelector("#header-secondary .Header-controls");

    if (headerControls && !document.getElementById("item-customstyle")) {
        let ItemCustomStyle = `<li id="item-customstyle" class="item-session">
            <div class="ButtonGroup Dropdown dropdown NotificationsDropdown">
            <button class="Dropdown-toggle Button Button--flat" data-toggle="dropdown">
            <i class="icon fas fa-tshirt"></i>
            <span class="Button-label">自定義背景設定</span>
            </button>
            <ul id="dropdown-customstyle" class="Dropdown-menu dropdown-menu Dropdown-menu--right"></ul>
            </div>
            </li>`;

        headerControls.insertAdjacentHTML("beforeend", ItemCustomStyle);

        //防止點選完選項後就關閉選單
        document.getElementById("dropdown-customstyle").addEventListener("click", e => e.stopPropagation());

        AddSettingOptions();
    } else {
        setTimeout(() => AddSettingButton(), 200);
    }
}

//重新調整，部分選項改為用CSS隱藏
function AddSettingOptions() {
    if (FunctionSetting["BeautifyCSSEnabled"]) {
        CreateSwitchOption("PostForceHide", "強制隱藏無視的回文", ForceHide);
        CreateSwitchOption("HeaderAutoHide", "自動隱藏頂部導航列", AutoHide);
        CreateSwitchOption("IndexNaviReverse", "交換首頁節點選單的位置", Reverse);
        CreateSwitchOption("DynamicColoredHeader", "頂部導航列顏色變化", Dynamic);

        CreateSeparator();

        //如果瀏覽器不支援backdrop-filter屬性不加入選項
        if (CSS.supports("backdrop-filter:var(--blur-radius)")) {
            ToggleElement(CreateSwitchOption("BlurredBackgroundEnabled", "啟用毛玻璃效果", BlurredBackground), !!BeautifySetting["BackgroundImageUrl"]);
            ToggleElement(CreateInputOption("BlurRadius", "毛玻璃模糊程度", SetBlurRadius, "輸入範圍：2~20", true, 2, 20), BeautifySetting["BlurredBackgroundEnabled"] && !!BeautifySetting["BackgroundImageUrl"]);
        }
        CreateInputOption("BackgroundImageUrl", "背景圖片", LoadImage, "圖片網址");
        ToggleElement(CreateInputOption("BackgroundTransparency", "背景不透明度", SetBackgroundTransparency, "輸入範圍：50~100", true, 50, 100), !!BeautifySetting["BackgroundImageUrl"]);

        CreateSeparator();

        CreateInputOption("CustomFont", "自定義字體", SetCustomFont, "字體名字");
        CreateInputOption("CustomFontCode", "自定義程式碼字體", SetCustomFontCode, "字體名字（建議使用等寬字體）");

        CreateSeparator();

        document.getElementById("dropdown-customstyle").insertAdjacentHTML("beforeend", `<li id="item-customfunction"><button id="button-customfunction" class="hasIcon" type="button" title="顯示功能設定"><i class="icon fas fa-cog Button-icon"></i><span class="Button-label">功能設定</span></button></li>`);
        document.getElementById("button-customfunction").addEventListener("click", function () {
            document.getElementById("dropdown-customstyle").classList.toggle("function");
        })
    } else {
        document.getElementById("dropdown-customstyle").classList.add("function");
    }

    //功能設定選項

    CreateSeparator(true);

    CreateFunctionSwitchOption("BeautifyCSSEnabled", "啟用自定義介面美化");
    CreateFunctionSwitchOption("DiscussionLimit", "首頁文章列表換頁呈現");
    CreateFunctionSwitchOption("UsernameHistoryQuickView", "快速查看使用者歷史名字");
    CreateFunctionSwitchOption("ComposerPreview", "貼文預覽視窗");
    CreateFunctionSwitchOption("LazyLoad", "延遲載入文章內圖片");
    CreateFunctionSwitchOption("ColoredMention", "提及使用者按鈕上色");

    CreateSeparator(true);

    document.getElementById("dropdown-customstyle").insertAdjacentHTML("beforeend", `<li id="item-confirm" class="function"><button id="button-confirm" class="hasIcon" type="button" title="套用（重整頁面）"><span class="Button-label">套用（重整頁面）</span></button></li>`);
    document.getElementById("button-confirm").addEventListener("click", function () {
        Object.keys(FunctionSetting).forEach(x => GM_setValue(x, FunctionSetting[x]));
        location.reload();
    });
    ToggleElement(document.getElementById("button-confirm"), false);
}

function CreateInputOption(key, description, targetCall, placeholderDescription, isNumberInput = false, min = 0, max = 100) {
    let inputElement = `<input id="input-${key.toLowerCase()}" class="CustomFormControl" type="${isNumberInput ? "number" : "text" }" ${(isNumberInput ? `min="${min}" max="${max}"` : "")} placeholder="${placeholderDescription}"/>`;
    let option = `<li id="item-${key.toLowerCase()}" class="InputOption"><span>${description}</span>${inputElement}</li>`;
    document.getElementById("dropdown-customstyle").insertAdjacentHTML("beforeend", option);
    document.getElementById(`input-${key.toLowerCase()}`).value = BeautifySetting[key];
    document.getElementById(`input-${key.toLowerCase()}`).addEventListener("change", function () {
        if (isNumberInput) {
            this.value = this.value > max ? max : this.value < min ? min : Math.round(this.value);
        }
        BeautifySetting[key] = this.value;
        GM_setValue(key, BeautifySetting[key]);
        targetCall(BeautifySetting[key]);
    });

    return document.getElementById(`input-${key.toLowerCase()}`);
}

function CreateSwitchOption(key, description, targetCall) {
    let option = `<li id="item-${key.toLowerCase()}"><button id="button-${key.toLowerCase()}" class="hasIcon" type="button" title="${description}"><i class="icon fas fa-check Button-icon"></i><span class="Button-label">${description}</span></button></li>`;
    document.getElementById("dropdown-customstyle").insertAdjacentHTML("beforeend", option);
    document.getElementById(`button-${key.toLowerCase()}`).setAttribute("data-enable", !!BeautifySetting[key]);
    document.getElementById(`button-${key.toLowerCase()}`).addEventListener("click", function () {
        BeautifySetting[key] = !BeautifySetting[key];
        GM_setValue(key, BeautifySetting[key]);
        this.setAttribute("data-enable", BeautifySetting[key]);
        targetCall(BeautifySetting[key]);
    });

    return document.getElementById(`button-${key.toLowerCase()}`);
}

function CreateFunctionSwitchOption(key, description) {
    let option = `<li id="item-${key.toLowerCase()}" class="function"><button id="button-${key.toLowerCase()}" class="hasIcon" type="button" title="${description}"><i class="icon fas fa-check Button-icon"></i><span class="Button-label">${description}</span></button></li>`;
    document.getElementById("dropdown-customstyle").insertAdjacentHTML("beforeend", option);
    document.getElementById(`button-${key.toLowerCase()}`).setAttribute("data-enable", !!FunctionSetting[key]);
    document.getElementById(`button-${key.toLowerCase()}`).addEventListener("click", function () {
        FunctionSetting[key] = !FunctionSetting[key];
        this.setAttribute("data-enable", FunctionSetting[key]);
        ToggleElement(document.getElementById("button-confirm"), JSON.stringify(LoadedFunctionSetting) !== JSON.stringify(FunctionSetting));
    });

    return document.getElementById(`button-${key.toLowerCase()}`);
}

function CreateSeparator(flag = false) {
    document.getElementById("dropdown-customstyle").insertAdjacentHTML("beforeend", flag ? "<li class='Dropdown-separator function'></li>" : "<li class='Dropdown-separator'></li>");
}

function ToggleElement(element, flag) {
    if (element) element.disabled = !flag;
}

function LoadStyle() {
    //（CSS）腳本內用到的Class和ID
    let ScriptCSS = `:root{--colored-hero: 28, 93, 153;--transparency: 1;--blur-radius: 15px}.CustomFormControl{transition:linear all .2s;display:block;flex-basis:50%;min-width:200px;height:32px;padding:8px 5px;margin:2px 10px 2px 0;font-size:13px;line-height:13px;color:#000;background-color:transparent;border:1px rgba(0,0,0,.3);border-style:none none solid none}body.dark .CustomFormControl{color:#ddd}.CustomFormControl:focus{outline:none;background-color:#dae5f1}body.dark .CustomFormControl:focus{background-color:#101318}.InputOption{display:flex}.InputOption>span{align-items:center;flex-basis:50%;padding-right:3px !important}.InputOption>span::after{content:"：";text-align:right;float:right}#dropdown-customstyle{overflow-y:auto}#dropdown-customstyle button:disabled,#dropdown-customstyle input:disabled{color:#7d7d7d}#dropdown-customstyle button[data-enable=false]>i{display:none}@media(min-width: 768px){#dropdown-customstyle{width:350px;padding:8px 0 !important}}#dropdown-customstyle>li{animation:dropdown-fade-in .5s}#dropdown-customstyle:not(.function)>li.function:not(#item-customfunction),#dropdown-customstyle.function>li:not(.function):not(#item-customfunction){display:none}#button-customfunction>i{line-height:inherit;margin-top:0}@media(max-width: 767px){#button-customfunction>i,#button-customfunction>span{font-size:18px}}@media(min-width: 768px){#button-customfunction>i,#button-customfunction>span{font-size:16px}}@media(max-width: 767px){#button-confirm>span{font-size:18px}}@media(min-width: 768px){#button-confirm>span{font-size:16px}}@media(max-width: 767px){#item-headerautohide,#item-indexnavireverse,#item-blurredbackgroundenabled,#item-blurradius{display:none}}@media(min-width: 768px){.AutoHide::before{display:none}.AutoHide .App-header{transition:ease-out all .2s;background-color:rgba(255,255,255,.98)}body.dark .AutoHide .App-header{background-color:rgba(24,20,31,.98)}.AutoHide.DynamicColored .App-header{background-color:rgb(var(--colored-hero)) !important}.AutoHide.scrolled .App-header{top:-26px;opacity:0}.AutoHide.scrolled .App-header:hover{top:0;opacity:1;box-shadow:0 2px 6px rgba(0,0,0,.35)}.AutoHide .DiscussionPage-list{top:0;padding-top:52px;z-index:10}}.ForceHide .Post--hidden:not(.Post--by-actor){display:none}.DiscussionPage-discussion .Scrubber-bar{background-color:rgb(var(--colored-hero)) !important}@media(min-width: 768px){.DiscussionPage-discussion .item-controls .Button--primary{background-color:rgb(var(--colored-hero)) !important}}@media(min-width: 768px){.ScrubberHeightFixed>.Scrubber-scrollbar{max-height:calc(100% - 38px) !important}}.item-reply>button>i,.item-like>button>i{margin-right:3px}.PostUser.Index::before{content:attr(data-number) "樓";padding-right:8px}@media(max-width: 767px){.PostUser.Index{padding-left:40px;line-height:32px}.PostUser.Index .PostUser-avatar{position:absolute;top:-7px;left:0}.PostUser.Index .PostUser-badges{top:-18px}}.DynamicColored::before{transition:linear,background-color .2s;background-color:rgb(var(--colored-hero)) !important}@media(max-width: 767px){.DynamicColored .App-drawer{background-color:rgb(var(--colored-hero)) !important}.DynamicColored .App-titleControl{color:#fff !important}.DynamicColored .App-primaryControl>.Button,.DynamicColored .App-titleControl>.Button,.DynamicColored .Navigation>.Button{color:#fff !important}}.DynamicColored .App-header .Header-logo{filter:grayscale(100%) invert(1)}.DynamicColored .App-header .Button{background-color:transparent !important}.DynamicColored .App-header #home-link{color:#fff !important}.DynamicColored .App-header li>.Button,.DynamicColored .App-header div:not(.App-primaryControl)>.Button,.DynamicColored .App-header .FormControl,.DynamicColored .App-header .FormControl::placeholder,.DynamicColored .App-header .Search-input,.DynamicColored .App-header .Dropdown-toggle .Button-icon{color:#fff}.DynamicColored .App-header li>.Button:hover,.DynamicColored .App-header div:not(.App-primaryControl)>.Button:hover,.DynamicColored .App-header .FormControl{background-color:#00000024 !important}.DynamicColored .App-header li>.Button:active,.DynamicColored .App-header div:not(.App-primaryControl)>.Button:active,.DynamicColored .App-header .Button.active,.DynamicColored .App-header .FormControl:focus,.DynamicColored .App-header .open>.Dropdown-toggle.Button{background-color:#0000004d !important}body:not(.HasImageBackground) .DynamicColored.scrolled:before{box-shadow:none}.HasImageBackground{background-attachment:fixed !important;background-repeat:no-repeat !important;background-position:center !important;background-size:cover !important}.HasImageBackground #app{background-color:transparent}.HasImageBackground.touch{height:100vh}.HasImageBackground .Hero{transition:linear,background-color .2s;background-color:rgba(229, 236, 245, var(--transparency))}body.dark.HasImageBackground .Hero{background-color:rgba(27, 32, 40, var(--transparency))}.HasImageBackground .TagHero--colored,.HasImageBackground .DiscussionHero--colored,.HasImageBackground .UserHero{background-color:rgba(var(--colored-hero), var(--transparency)) !important}.HasImageBackground .UserHero:not([style*=background-image])>.darkenBackground{background-color:transparent !important}.HasImageBackground .IndexPage>div.container,.HasImageBackground .TagsPage>div.container,.HasImageBackground .UserPage>div.container,.HasImageBackground .DiscussionPage-discussion>div.container,.HasImageBackground .NotificationsPage{transition:linear,background-color .2s;background-color:rgba(255, 255, 255, var(--transparency))}body.dark.HasImageBackground .IndexPage>div.container,body.dark.HasImageBackground .TagsPage>div.container,body.dark.HasImageBackground .UserPage>div.container,body.dark.HasImageBackground .DiscussionPage-discussion>div.container,body.dark.HasImageBackground .NotificationsPage{background-color:rgba(23, 21, 30, var(--transparency))}@media(max-width: 767px){.HasImageBackground .IndexPage>div.container,.HasImageBackground .TagsPage>div.container,.HasImageBackground .UserPage>div.container,.HasImageBackground .DiscussionPage-discussion>div.container{padding-bottom:30px}}@media(min-width: 768px){.HasImageBackground .IndexPage>div.container,.HasImageBackground .TagsPage>div.container,.HasImageBackground .UserPage>div.container,.HasImageBackground .DiscussionPage-discussion>div.container{width:100%;margin:0;padding:0 65px 30px 65px}}@media(min-width: 768px){.HasImageBackground .App-content{border:none !important;position:relative;max-width:1200px;margin:20px auto 0 auto}.HasImageBackground .App-content header.Hero,.HasImageBackground .App-content div.UserHero{border-radius:20px 20px 0 0}.HasImageBackground .App-content .UserHero>.darkenBackground{border-radius:20px 20px 0 0}.HasImageBackground .App-content .IndexPage:not([class*=IndexPage--tag])>div.container,.HasImageBackground .App-content .TagsPage>div.container,.HasImageBackground .App-content .NotificationsPage{border-radius:20px}.HasImageBackground .App-content .IndexPage>div.container,.HasImageBackground .App-content .UserPage>div.container,.HasImageBackground .App-content .DiscussionPage-discussion>div.container{border-radius:0 0 20px 20px}}@supports(backdrop-filter: blur(var(--blur-radius))){@media(min-width: 768px){.HasImageBackground.Blurred .DiscussionPage-list{opacity:.99}.HasImageBackground.Blurred .IndexPage,.HasImageBackground.Blurred .UserPage,.HasImageBackground.Blurred .DiscussionPage,.HasImageBackground.Blurred .TagsPage,.HasImageBackground.Blurred .NotificationsPage{position:relative}.HasImageBackground.Blurred .IndexPage::before,.HasImageBackground.Blurred .UserPage::before,.HasImageBackground.Blurred .DiscussionPage::before,.HasImageBackground.Blurred .TagsPage::before,.HasImageBackground.Blurred .NotificationsPage::before{content:"";position:absolute;left:0;top:0;right:0;bottom:0;z-index:-1;backdrop-filter:blur(var(--blur-radius));border-radius:20px;box-shadow:0 0 20px 2px #000}}}@keyframes preview-fade-in{from{opacity:0}to{opacity:1}}#item-preview{position:absolute;z-index:10}@media(max-width: 767px){#item-preview{display:inline-block;top:0;right:35px}.Composer.normal #item-preview{display:none}}@media(min-width: 768px){#item-preview{top:0px;right:108px}.Composer.minimized #item-preview{right:35px}}#composer .Composer.fullScreen #item-preview{display:none}#item-previewmodal{position:fixed;bottom:100%;animation:preview-fade-in .2s;border-radius:20px;width:100%;height:auto;background-color:rgba(255,255,255,.95);box-shadow:0 0 20px 2px rgba(0,0,0,.35);margin-bottom:20px;display:flex;flex-direction:column}body.dark #item-previewmodal{background-color:#18141f}@media(max-width: 767px){#item-previewmodal{border-radius:0;left:0;right:0;bottom:40px}.Composer.normal #item-previewmodal{display:none}}.HidePreview #item-previewmodal{display:none}#item-previewmodal>h2{text-align:center;padding:10px;margin:0}#preview-postbody{margin-bottom:20px;padding:0 20px}@media(min-width: 992px){.Reverse .IndexPage .sideNavContainer,.Reverse .UserPage .sideNavContainer{flex-direction:row-reverse}.Reverse .IndexPage .sideNavContainer .IndexPage-nav,.Reverse .UserPage .sideNavContainer .UserPage-nav{margin-right:0;margin-left:50px}#app:not(.App--discussion) .Reverse .Composer:not(.fullScreen){margin-left:-20px;margin-right:220px}}.CustomFont{font-family:var(--custom-font)}.CustomFontCode .Post-body code{font-family:var(--custom-font-code)}.DiscussionList-loadMore.Limit .Button:not(#button-prevpage):not(#button-nextpage){display:none}.DiscussionList-loadMore.Limit button:disabled{visibility:hidden}#span-page{margin:0 10px;font-size:14px}.Post-body img.Lazy{transition:linear opacity 1s}.Post-body img.Lazy[data-src]{opacity:0;width:100px;height:100px;display:inline-block}.Post-body img.Lazy.Loading{opacity:.2}.Post-body img.Lazy.Error::before{content:"圖片未載入：" attr(src)}.UserMention.Colored,.PostMention.Colored{text-shadow:0 0 2px #000;color:#ddd}.username-history{border:none;background:none}.username-history:focus{outline:none}.Recent .username-history{color:#8bb631}.Recent .dropdown-history>li::before{content:"（這位使用者最近有更新過名字）";font-size:10px;color:#8bb631;padding:0 15px}.dropdown-history>li>span{font-size:14px}.dropdown-history>ul{max-height:200px;padding-left:30px;overflow-y:auto;list-style-type:disc;list-style-position:outside}body.dark .dropdown-history>ul{color:#ddd}.dropdown-history>ul>li{margin:2px}`;
    //（CSS）介面美化
    let BeautifyCSS = `@media(min-width: 768px){*{scrollbar-color:#7d7d7de6 #7d7d7d1a;scrollbar-width:thin}::-webkit-scrollbar{width:.8em;background-color:#7d7d7d33}::-webkit-scrollbar-thumb{background-color:#7d7d7d66}::-webkit-scrollbar-thumb:hover{background-color:#7d7d7d99}::-webkit-scrollbar-thumb:active{background-color:#7d7d7dcc}}.NotificationList-header h4,.NotificationList-header .Button-icon{font-size:18px}body.dark .NotificationList-header h4,body.dark .NotificationList-header .Button-icon{color:#fff}.NotificationList-header>.App-primaryControl>.Button{margin-top:-7px}.Hero h2{font-size:32px}@media(min-width: 768px){body.dark .App-drawer{background:transparent}}@media(min-width: 768px){.DiscussionList .DiscussionListItem{transition:linear transform .1s,background-color .3s,box-shadow .3s !important;border-radius:20px}.DiscussionList .DiscussionListItem:hover{box-shadow:0 0 20px -4px #766699 !important;z-index:10;transform:scale(1.02)}}@media(max-width: 991px)and (min-width: 768px){.sideNav::after{border-color:#1b2028}.sideNav .Dropdown--select .Dropdown-menu>li{margin-right:10px}}@media(max-width: 991px)and (min-width: 768px){.sideNav .Dropdown--select .Dropdown-menu>li>a{padding-right:15px}}@media(min-width: 768px){.sideNav .Dropdown--select .Dropdown-menu>li>a{padding-left:40px;transition:linear transform .1s,background-color .3s,box-shadow .3s !important;border-radius:20px}.sideNav .Dropdown--select .Dropdown-menu>li>a:hover{box-shadow:0 0 20px -4px #766699 !important;z-index:10;transform:scale(1.05)}}@media(max-width: 991px){body.dark .Dropdown-menu>li>a,body.dark .Dropdown-menu>li>button{background-color:transparent}}@keyframes dropdown-fade-in{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@media(min-width: 768px){.open .Dropdown-menu{animation:dropdown-fade-in .5s}}body.dark .TagLabel.colored .TagLabel-text{color:#fff !important}body.dark .DiscussionHero--colored a{color:#fff}.App-content{background-color:transparent !important}.TagHero{display:flex;justify-content:center;align-items:center}@media(max-width: 767px){.TagHero{height:120px}}@media(min-width: 768px){.TagHero{height:145px}}.Button-label .username{display:inline-block;max-width:450px;overflow:hidden;text-overflow:ellipsis}@media(max-width: 991px){.Button-label .username{max-width:200px}}@media(max-width: 767px){.UserHero .darkenBackground .container{padding-top:20px;height:inherit;display:flex;justify-content:center;align-items:center}}.NotificationGrid a{text-decoration:none}.NotificationGrid .username{padding-left:10px;line-height:48px}body.dark .NotificationGrid .username{color:#fff}#footer{width:auto !important}.App-header #home-link{transition:linear,font-size .2s;text-decoration:none;font-size:24px}body.dark .App-header #home-link{color:#fff}.App-header #home-link:hover{font-size:28px}.App-header .NotificationsDropdown-unread{background:red !important;color:#fff !important;box-shadow:none !important}body.dark .App-header .Button,body.dark .App-header .FormControl,body.dark .App-header .FormControl::placeholder,body.dark .App-header .Search-input,body.dark .App-header .Dropdown-toggle .Button-icon{color:#fff}body.dark .App-header .Button:hover{background-color:#2b2f35}.App-header .Button:active,.App-header .open>.Dropdown-toggle.Button{box-shadow:none}body.dark .App-header .Button:active,body.dark .App-header .open>.Dropdown-toggle.Button{background-color:#363144}@media(max-width: 991px)and (min-width: 768px){.App-header .Search.focused{margin-left:-280px}.App-header .Search.focused input,.App-header .Search.focused .Search-results{width:280px}}@media(max-width: 767px){body.dark .App-primaryControl>.Button,body.dark .Navigation>.Button,body.dark .App-titleControl{color:#fff !important}}.Dropdown-toggle.Button.Button--icon.Button--flat{background-color:transparent;box-shadow:none !important}body.dark .IndexPage .Button:not(.Button--flat),body.dark .Button--primary,body.dark .DiscussionListItem-title,body.dark .sideNav .Dropdown--select .Dropdown-menu>li:not(.active)>a,body.dark .DiscussionPage-nav .Button,body.dark .UserPage .Button:not(.Button--flat):not(.Button--link),body.dark .NotificationGrid td,body.dark .NotificationGrid th{color:#fff}button,a{transition:linear background-color .2s}.Navigation-back{transition:linear background-color .2s,border-radius .2s}.Navigation-pin{transition:linear background-color .2s,opacity .2s,margin-left .2s}@media(max-width: 767px){.DiscussionListItem-content:active{background-color:transparent}}.DiscussionList .DiscussionListItem:hover,.Button:hover,.Dropdown-menu>li>button:hover,.Dropdown-menu>li>a:hover,.Notification:hover,.sideNav .Dropdown--select .Dropdown-menu>li>a:hover{background-color:#eae4f6}body.dark .DiscussionList .DiscussionListItem:hover,body.dark .Button:hover,body.dark .Dropdown-menu>li>button:hover,body.dark .Dropdown-menu>li>a:hover,body.dark .Notification:hover,body.dark .sideNav .Dropdown--select .Dropdown-menu>li>a:hover{background-color:#2f2b3b}.DiscussionList .DiscussionListItem:active,.Button:active,.Dropdown-menu>li>button:active,.Dropdown-menu>li>a:active,.Notification:active,.sideNav .Dropdown--select .Dropdown-menu>li>a:active{background-color:#f0ecf9;box-shadow:none}body.dark .DiscussionList .DiscussionListItem:active,body.dark .Button:active,body.dark .Dropdown-menu>li>button:active,body.dark .Dropdown-menu>li>a:active,body.dark .Notification:active,body.dark .sideNav .Dropdown--select .Dropdown-menu>li>a:active{background-color:#363144}.open>.Dropdown-toggle.Button{background-color:#f0ecf9;box-shadow:none}body.dark .open>.Dropdown-toggle.Button{background-color:#42464b}.Button--primary:hover,body.dark .Button--primary:hover{background-color:#6a00ff}.Button--primary:active,body.dark .Button--primary:active{background-color:#7919ff}body.dark .App-header .Button:hover{background-color:#2f2b3b}body.dark .App-header .Button:active,body.dark .App-header .Button .open>.Dropdown-toggle.Button{background-color:#363144;box-shadow:none}@media(max-width: 767px){body.dark .App-titleControl>.Button{color:#fff !important}}.UserCard .Button{background-color:#0000001a !important}body.dark .UserCard .Button{color:#fff}.UserCard .Button:hover{background-color:#0000002e !important}.UserCard .Button:active,.UserCard .open>.Dropdown-toggle.Button{background-color:#00000052 !important}.Composer{box-shadow:0 0 20px 2px rgba(0,0,0,.35)}@media(min-width: 768px){.Composer{border-top-left-radius:20px;border-top-right-radius:20px}}body.dark .Composer .Button{color:#fff}.Composer.active:not(.fullScreen){box-shadow:0 0 20px 2px #6200e8 !important}@media(max-width: 767px){.Composer .ComposerBody-header>.item-title>h3{overflow:hidden;text-overflow:ellipsis}}@media(min-width: 768px){.Composer .ComposerBody-header{width:calc(100% - 130px)}.Composer .ComposerBody-header>li{display:block;float:left}.Composer .ComposerBody-header>.item-discussionTitle,.Composer .ComposerBody-header>.item-title{float:none;overflow:hidden}}.Composer .ComposerBody-header h3,.Composer .ComposerBody-header h3 a{font-size:16px !important;font-weight:500 !important}@media(min-width: 768px){body.dark .Composer .ComposerBody-header h3,body.dark .Composer .ComposerBody-header h3 a{color:#fff}}@media(max-width: 767px){.Composer .ComposerBody-header h3,.Composer .ComposerBody-header h3 a{color:#fff !important}}.DiscussionListItem-title{font-weight:500 !important}.DiscussionList:not(.DiscussionList--searchResults) .read .DiscussionListItem-title::before{content:"✓ "}.unread .DiscussionListItem-count{color:#766699}.DiscussionListItem-author>.Avatar{width:50px;height:50px;font-size:25px;line-height:50px}body:not(.dark) .DiscussionListItem-info{color:#7c7c7c}@media(max-width: 767px){.unread .DiscussionListItem-count{color:#fff !important}}@media(min-width: 768px){.IndexPage .DiscussionList-discussions>li{width:calc(100% / 2 - 10px)}.IndexPage .DiscussionList-discussions .DiscussionListItem{width:100%;padding-left:30px}.IndexPage .DiscussionList-discussions .DiscussionListItem-author{margin-left:-66px}}.DiscussionPage-list{overflow-x:hidden}.DiscussionPage-list .DiscussionListItem{min-height:70px;border-radius:0}.DiscussionPage-list .DiscussionListItem-main{padding-top:10px;padding-bottom:10px}.DiscussionPage-list .DiscussionListItem-title{max-width:95%;font-size:17px}.DiscussionPage-list .DiscussionListItem-author{margin-left:-58px;margin-top:9px}.DiscussionPage-list .DiscussionListItem-count{margin:0;padding:0;position:absolute;font-size:15px;width:40px;top:10px;right:13px}.PostsUserPage-list>li,.PostStream-item:not(:last-child){border-bottom:none !important}.Post-actions .item-reply>button::before{content:"";font-family:"font awesome 5 free";font-weight:900;margin-right:3px}.Post-actions .item-votes{padding-right:10px}.Post-actions .item-votes .CommentPost-votes{display:flex;align-items:center}.Post-actions .item-votes .CommentPost-votes .Post-vote{padding:8px;margin:0 !important}.Post-actions .item-votes .CommentPost-votes .Post-upvote[style^=color]{color:green !important}.Post-actions .item-votes .CommentPost-votes .Post-downvote[style^=color]{color:red !important}body.dark .PostMention,body.dark .UserMention{background:#2b2f35;color:#ddd}body.dark .PostsUserPage-discussion a,body.dark .Post-footer a{color:#667c99}body.dark .ReplyPlaceholder{border-color:transparent;transition:border-color .2s}body.dark .ReplyPlaceholder:hover{border-color:#1b2028}.CommentPost{margin-top:15px;margin-bottom:15px;padding-bottom:40px;border-radius:20px;background-color:#dbe5f2}body.dark .CommentPost{background-color:#1b1f28}@media(min-width: 768px){.CommentPost{max-width:max-content;min-width:330px}}.CommentPost .Post-actions{opacity:1 !important;position:absolute;margin-top:5px;right:10px;bottom:5px;width:-moz-fit-content;width:fit-content}.CommentPost .Post-actions>ul{font-size:14px;display:flex;justify-content:flex-start;align-items:center}.CommentPost .Post-footer{margin:0}.CommentPost:not(.LoadingPost):not(.editing)>div>div:not(.Post-body){display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;align-content:space-around;padding-top:10px;padding-bottom:10px;border-top:2px dashed #667c99}body.dark .CommentPost:not(.LoadingPost):not(.editing)>div>div:not(.Post-body){border-top:2px dashed #667c998c}.CommentPost:not(.LoadingPost):not(.editing)>div>div:not(.Post-body) h3{margin-top:0px;margin-left:5px;margin-bottom:5px;flex-basis:100%;font-size:22px}.CommentPost .PollOption{width:calc(50% - 10px);margin:5px;float:none !important;align-self:center}.CommentPost .PollOption .PollBar{transition:linear background .2s;margin:0;width:100%;float:none}.CommentPost .PollOption .PollBar:hover{transition:linear background .2s;background-color:#ffffff47}.CommentPost .PollOption .PollBar label:not(.checkbox):not(.PollAnswer){position:absolute;right:5px;bottom:11px}.CommentPost .PollOption .PollAnswer{display:block;margin-left:40px !important;max-width:75%}.CommentPost .PollOption .PollAnswer span{font-size:16px !important;padding-left:0 !important}.CommentPost .PublicPollButton{width:105px;margin:5px !important;align-self:center}.CommentPost .PollInfoText{font-size:14px;margin:10px !important}.Post-body span[data-s9e-mediaembed=youtube],.Post-body span[data-s9e-mediaembed=twitch],.Post-body span[data-s9e-mediaembed=dailymotion],.Post-body span[data-s9e-mediaembed=spotify],.Post-body iframe[data-s9e-mediaembed=soundcloud],.Post-body iframe[data-s9e-mediaembed=steamstore],.Post-body iframe[data-s9e-mediaembed=reddit],.Post-body iframe[data-s9e-mediaembed=instagram]{max-width:100% !important}.Post-body iframe[data-s9e-mediaembed=facebook]{background-color:#fff}@media(min-width: 768px){.Post-body span[data-s9e-mediaembed],.Post-body iframe[data-s9e-mediaembed]{width:800px !important}}.Post-body .uncited{background-color:#ffffff3d}body.dark .Post-body .uncited{background-color:#0000003d;border-top:2px dotted #0e1115;border-bottom:2px dotted #0e1115}.Post-body a{transition:linear border-bottom .2s;border-bottom:1px solid transparent}.Post--hidden{opacity:.5}.Post--hidden .Post-body,.Post--hidden .Post-footer,.Post--hidden h3 .Avatar,.Post--hidden .PostUser-badges{opacity:1}.Post--hidden:not(.revealContent) .Post-actions{display:none}.Post--hidden.revealContent{z-index:10}.Post-actions>ul{font-size:14px;display:flex;justify-content:flex-start;align-items:center}.Post-actions>ul>li>div>button{padding:10px 0}.Post-actions>ul>li>button,.Post-actions>ul>li>div>button{display:flex;justify-content:center;align-items:center;transition:linear background-color .2s;border-radius:20px;background-color:transparent}.Post-actions>ul>li>button:hover,.Post-actions>ul>li>div>button:hover{background-color:#c8d8ea !important}body.dark .Post-actions>ul>li>button:hover,body.dark .Post-actions>ul>li>div>button:hover{background-color:#2b2f35 !important}.Post-actions>ul>li>button:active,.Post-actions>ul>li>button:focus,.Post-actions>ul>li>div>button:active,.Post-actions>ul>li>div>button:focus{background-color:#b5cbe3 !important}body.dark .Post-actions>ul>li>button:active,body.dark .Post-actions>ul>li>button:focus,body.dark .Post-actions>ul>li>div>button:active,body.dark .Post-actions>ul>li>div>button:focus{background-color:#42464b !important}.PostsUserPage-list .Post{padding-top:20px}body.dark .hljs-comment,body.dark .hljs-meta{color:#969896}body.dark .hljs-keyword,body.dark .hljs-selector-tag,body.dark .hljs-type{color:#da4957}body.dark .hljs-tag{color:gray}body.dark .hljs-attr,body.dark .hljs-selector-attr,body.dark .hljs-selector-class,body.dark .hljs-selector-id,body.dark .hljs-selector-pseudo,body.dark .hljs-title{color:#8c69ce}body.dark .hljs-number{color:#07f}body.dark .hljs-string{color:#0878f7}#elevator-level{transition:linear background-color .2s;border:none;color:#668099;background-color:#e4edf6}body.dark #elevator-level{color:#fff;background-color:#1b2128}#elevator-level:focus{outline:none;background-color:#d2dfef}body.dark #elevator-level:focus{background-color:#101418}@media(min-width: 768px){.PostStream-item{position:relative}.PostStream-item .PostStream-PostFloor{position:absolute;left:10px;bottom:30px;z-index:1}}.darkenBackground{background-color:rgba(0,0,0,.35) !important}.UserPage .UserCard-info{font-size:14px}.UserPage .UserCard-avatar .Dropdown-toggle{transition:linear,all .2s}.UserCard--popover,.UserCard--popover>.darkenBackground{border-radius:20px;width:max-content !important}.UserCard--popover .container{display:flex;flex-direction:row-reverse;align-items:flex-start}.UserCard--popover .UserCard-controls{float:none;margin-left:10px}.UserCard--popover .UserCard-identity{font-size:24px}.UserCard--popover .UserCard-info{font-size:14px;margin-top:10px;display:flex;flex-direction:column}.Avatar{background-color:transparent}.UserCard-avatar>.Avatar{border:none;box-shadow:none;filter:drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));width:100px;height:100px;font-size:50px;line-height:100px}.UserCard-avatar>.Dropdown-toggle{margin:0}@media(max-width: 767px){.UserCard-avatar{margin:0 auto;width:100px}}body.dark .Post-header a{color:#fff}.UserCard,.UserCard a{color:#fff !important}@media(min-width: 768px){.Modal{min-width:750px}.Modal .Modal-content{border-radius:20px}.Modal h3{font-size:28px}}.VotesModal-list{display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center}.VotesModal-list>div{flex-basis:100%;font-size:20px;display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center}.VotesModal-list>div>h2,.VotesModal-list>legend{flex-basis:100%;font-size:20px}@media(min-width: 768px){.VotesModal-list>div>li,.VotesModal-list>li{width:calc(100%/3)}}@media(max-width: 767px){.VotesModal-list>div>li,.VotesModal-list>li{width:50%}}.VotesModal-list>div>li>a,.VotesModal-list>li>a{display:flex;align-items:center}.VotesModal-list>div>li>a>.Avatar,.VotesModal-list>li>a>.Avatar{width:50px;height:50px;font-size:25px;line-height:50px}.VotesModal-list>div>li>a>.username,.VotesModal-list>li>a>.username{margin-left:5px;width:60%;word-wrap:break-word}body.dark .VotesModal-list>div>li>a>.username,body.dark .VotesModal-list>li>a>.username,body.dark .VotesModal-list>div>h4[style]{color:#ddd !important}.PostLikesModal-list{flex-basis:100%;font-size:20px;display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center}@media(max-width: 767px){.PostLikesModal-list>li{width:50%}}@media(min-width: 768px){.PostLikesModal-list>li{width:calc(100%/3)}}.PostLikesModal-list>li>a{display:flex;align-items:center}.PostLikesModal-list>li>a>.Avatar{width:50px;height:50px;font-size:25px;line-height:50px}.PostLikesModal-list>li>a>.username{margin-left:5px;width:60%;word-wrap:break-word}body.dark .PostLikesModal-list>li>a>.username{color:#ddd !important}.FlagPostModal .checkbox strong{font-size:16px}body.dark .FlagPostModal .checkbox strong{color:#fff}.FlagPostModal .checkbox input[type=radio]{margin-top:7px}@media(min-width: 992px){.UserPage-nav{top:200px;position:sticky;height:fit-content}.UserPage-nav>ul{position:relative}}@media(min-width: 768px){#app{overflow-x:visible;max-width:100vw}.PostStream{display:flex;flex-direction:column}}.DiscussionPage-nav{border:none !important;z-index:1}@media(min-width: 768px){.DiscussionPage-nav{top:200px;position:sticky;height:fit-content}}@media(max-width: 767px){.DiscussionPage-nav>ul{display:flex}}@media(min-width: 768px){.DiscussionPage-nav>ul{position:relative}}@media(max-width: 767px){.DiscussionPage-nav .item-subscription{flex-basis:115px;min-width:115px}}.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow{transition:linear background .2s;color:#de8e00 !important;background:#fff2ae !important}.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow:hover,.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow:focus,.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow.focus{background-color:#ffee95 !important}.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow:active,.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow.active,.open>.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow.Dropdown-toggle{background-color:#ffea7b !important}.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow.disabled,.DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow[disabled],fieldset[disabled] .DiscussionPage-nav .item-subscription .SubscriptionMenu .SubscriptionMenu-button--follow{background:#fff2ae !important}.DiscussionPage-nav .Dropdown-menu{min-width:220px}@media(min-width: 768px){.PostStreamScrubber .Dropdown-menu,.Scrubber-handle{background-color:transparent !important}}`;

    GM_addStyle(ScriptCSS);
    if (LoadedFunctionSetting["BeautifyCSSEnabled"])
        GM_addStyle(BeautifyCSS);
}

function LoadBeautifySetting() {
    document.getElementById("app").classList.add("affix");
    if (LoadedFunctionSetting["BeautifyCSSEnabled"]) {
        SetCustomFont(BeautifySetting["CustomFont"]);
        SetCustomFontCode(BeautifySetting["CustomFontCode"]);
        Reverse(BeautifySetting["IndexNaviReverse"]);
        Dynamic(BeautifySetting["DynamicColoredHeader"]);
        SetBackgroundTransparency(BeautifySetting["BackgroundTransparency"]);
        BlurredBackground(BeautifySetting["BlurredBackgroundEnabled"]);
        AutoHide(BeautifySetting["HeaderAutoHide"]);
        ForceHide(BeautifySetting["PostForceHide"]);
    }
}