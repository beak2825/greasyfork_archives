// ==UserScript==
// @name               Youtube 封面
// @name:en            Youtube Cover
// @name:zh-CN         Youtube 封面
// @namespace          http://tampermonkey.net/
// @version            1.4.7
// @description        獲取影片封面！
// @description:en     Get the cover of youtube video！
// @description:zh-CN  获取视频封面！
// @author             Anong0u0
// @match              *://*.youtube.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @noframes
// @license            MIT License
// @downloadURL https://update.greasyfork.org/scripts/420140/Youtube%20%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/420140/Youtube%20%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==


const delay = (ms = 0) => new Promise((r)=>{setTimeout(r, ms)})

const waitElementLoad = (elementSelector, selectCount = 1, tryTimes = 1, interval = 0) =>
{
    return new Promise(async (resolve, reject)=>
    {
        let t = 1, result;
        while(true)
        {
            if(selectCount != 1) {if((result = document.querySelectorAll(elementSelector)).length >= selectCount) break;}
            else {if(result = document.querySelector(elementSelector)) break;}

            if(tryTimes>0 && ++t>tryTimes) return reject(new Error("Wait Timeout"));
            await delay(interval);
        }
        resolve(result);
    })
}

if (window.trustedTypes)
{
    const policy = trustedTypes.createPolicy("ytCover", {createHTML: (string) => string,});
    Node.prototype.setHTML = function (html) {this.innerHTML = policy.createHTML(html)}
}
else Node.prototype.setHTML = function (html) {this.innerHTML = html}

Node.prototype.getXY = function ()
{
    let x = 0, y = 0, element = this;
    while (element)
    {
        x += element.offsetLeft - element.scrollLeft + element.clientLeft;
        y += element.offsetTop - element.scrollLeft + element.clientTop;
        element = element.offsetParent;
    }
    return {X: x, Y: y}
}

const checkImg = async (url) => await fetch(url, { method: "HEAD" })
                                    .then(response => response.ok)
                                    .catch(() => false)


const main = () =>
{
    const div = document.createElement("div");
    div.style.marginLeft = "3em";
    div.setHTML(`

    <!-- css -->
    <style>
        #masthead-container { z-index: 3000 !important; }

        #ytCover {
            text-decoration: none;
            font-size: 2em;
            font-weight: bold;
            font-family: Roboto, Arial, sans-serif;
            color: var(--yt-spec-text-primary);
        }

        .list {
            background-color: var(--yt-spec-brand-background-primary);
            border: 1px solid var(--yt-spec-10-percent-layer);
            padding: 0.5em 0;
            position: fixed;
            z-index: 114514;
            max-height: 40em;
            font-size: 10px
        }

        .linkBtn {
            text-decoration: none;
        }

        .list-item {
            text-align: center;
            font-size: 1.5em;
            color: var(--yt-spec-text-primary);
            background-color: var(--yt-spec-brand-background-primary);
            height: 2.5em;
            line-height: 2.5em;
        }
        .list-item:hover {
            background: #AAA;
            box-shadow: 0 4px 5px rgba(0, 0, 0, 0.2);
        }

        .slide {
            cursor: default
        }

        img#preview {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2999;
            max-width: 100vw;
            max-height: 65vh;
            min-width: 40vw;
            border: 3px solid #FFF;
        }

        .list > button {
            border: none;
            padding: unset;
            width: inherit;
            cursor: pointer;
        }

    </style>

    <!-- html -->
    <div>
        <div class="slide" id="ytCover"></div>

        <div class="list" id="ytListHead" style="border-top: none; top: 4.8em; left: 19em;" hidden>

            <div class="list-item slide">1280x720+
                <div class="list" style="border-left: none; width: 11.5em" hidden>
                    <a class="linkBtn" imgTag="maxresdefault"><div class="list-item">maxresdefault</div></a>
                    <a class="linkBtn" imgTag="maxres1"><div class="list-item">maxres1</div></a>
                    <a class="linkBtn" imgTag="maxres2"><div class="list-item">maxres2</div></a>
                    <a class="linkBtn" imgTag="maxres3"><div class="list-item">maxres3</div></a>
                </div>
            </div>

            <div class="list-item slide">640x480
                <div class="list" style="border-left: none; width: 8.5em" hidden>
                    <a class="linkBtn" imgTag="sddefault"><div class="list-item">sddefault</div></a>
                    <a class="linkBtn" imgTag="sd1"><div class="list-item">sd1</div></a>
                    <a class="linkBtn" imgTag="sd2"><div class="list-item">sd2</div></a>
                    <a class="linkBtn" imgTag="sd3"><div class="list-item">sd3</div></a>
                </div>
            </div>

            <div class="list-item slide">480x360
                <div class="list" style="border-left: none; width: 8.5em" hidden>
                    <a class="linkBtn" imgTag="hqdefault"><div class="list-item">hqdefault</div></a>
                    <a class="linkBtn" imgTag="hq1"><div class="list-item">hq1</div></a>
                    <a class="linkBtn" imgTag="hq2"><div class="list-item">hq2</div></a>
                    <a class="linkBtn" imgTag="hq3"><div class="list-item">hq3</div></a>
                </div>
            </div>

            <div class="list-item slide">320x180
                <div class="list" style="border-left: none; width: 8.5em" hidden>
                    <a class="linkBtn" imgTag="mqdefault"><div class="list-item">mqdefault</div></a>
                    <a class="linkBtn" imgTag="mq1"><div class="list-item">mq1</div></a>
                    <a class="linkBtn" imgTag="mq2"><div class="list-item">mq2</div></a>
                    <a class="linkBtn" imgTag="mq3"><div class="list-item">mq3</div></a>
                </div>
            </div>

            <div class="list-item slide">120x90
                <div class="list" style="border-left: none; width: 6.5em" hidden>
                    <a class="linkBtn" imgTag="default"><div class="list-item">default</div></a>
                    <a class="linkBtn" imgTag="1"><div class="list-item">1</div></a>
                    <a class="linkBtn" imgTag="2"><div class="list-item">2</div></a>
                    <a class="linkBtn" imgTag="3"><div class="list-item">3</div></a>
                </div>
            </div>

            <button class="list-item">: <span id="previewSpan" style="font-weight: bold;">On</span></button>
        </div>
    </div>`)
    const insertDiv = () =>
    {
        if (GM_getValue("switchButton")) document.querySelector("#end").insertAdjacentElement("afterbegin", div);
        else document.querySelector("#start").append(div);
    }
    insertDiv();

    const ytC = document.querySelector("#ytCover");
    const ytLH = document.querySelector("#ytListHead");
    const Lang = { cover: {en:"Cover", tc:"封面", sc:"封面"},
               preview: {en:"Preview", tc:"圖片預覽", sc:"图片预览"},
                    on: {en:"On", tc:"開", sc:"开"},
                   off: {en:"Off", tc:"關", sc:"关"},
          switchButton: {en:"Switch Button Position", tc:"切換按鈕位置", sc:"切换按钮位置"}};
    const usedLang = document.documentElement.lang.match(/zh/i) ?
                        (document.documentElement.lang.match(/cn/i) ? "sc":"tc") : "en"

    GM_registerMenuCommand(Lang.switchButton[usedLang], () =>
    {
        GM_setValue("switchButton", !GM_getValue("switchButton"));
        insertDiv();
    });


    ytC.innerText = Lang.cover[usedLang];
    ytLH.style.width = usedLang=="en"?"10em":"10.4em";

    window.onresize = () =>
    {
        ytLH.style.left = (ytC.getXY().X/10-1)+"em";
        if(window.innerWidth<1350)
        {
            if(window.innerWidth>850)div.style.margin = `0 ${3*((window.innerWidth-500)/850)}em`;
            else div.style.margin = "0 1em";
        }
        else
        {div.style.margin = "0 3em"}
    }

    document.querySelectorAll(".list > .slide").forEach((e)=>
    {
        const list = e.querySelector(".list");
        e.onmouseenter = () =>
        {
            list.style.top = (e.getXY().Y/10-0.5)+"em";
            list.style.left = parseFloat(ytLH.style.left) + parseFloat(ytLH.style.width) + "em";
            list.hidden = false;
        };
        e.onmouseleave = () => {list.hidden = true}
    });

    const preview = document.createElement("img");
    preview.id = "preview";
    preview.hidden = true;
    document.body.append(preview);

    const Btns = document.querySelectorAll(".linkBtn");
    Btns.forEach((e)=>
    {
        e.onmouseenter = () =>
        {
            if(!GM_getValue("previewOn")) return;
            preview.hidden = false;
            preview.src = e.href;
        };
        e.onmouseleave = () => {preview.hidden = true}
        e.target="_blank";
    });

    const previewBtn = document.querySelector(".list > button");
    previewBtn.setHTML(Lang.preview[usedLang] + previewBtn.innerHTML);
    const previewSpan = document.querySelector("#previewSpan");
    const previewBtnChange = () =>
    {
        if (GM_getValue("previewOn"))
        {
            previewSpan.style.color = "green";
            previewSpan.innerText = Lang.on[usedLang];
        }
        else
        {
            previewSpan.style.color = "red";
            previewSpan.innerText = Lang.off[usedLang];
        }
    };
    previewBtn.onclick = () =>
    {
        GM_setValue("previewOn", !GM_getValue("previewOn"));
        previewBtnChange();
    }
    previewBtnChange();


    let hide;
    ytC.onmouseenter = () =>
    {
        hide = false;
        ytLH.hidden = false;
        window.onresize();
    };
    ytC.onmouseleave = () =>
    {
        hide = true;
        delay(500).then(()=>{ytLH.hidden = hide});
    };
    ytLH.onmouseenter = () =>
    {
        hide = false;
    };
    ytLH.onmouseleave = () =>
    {
        hide = true;
        delay(200).then(()=>{ytLH.hidden = hide});
    };

    let oldHref;
    const onPageUpdate = () =>
    {
        if (oldHref == location.href) return
        oldHref = location.href

        console.log("[Youtube Cover] detect page updated")

        const video_id = location.href.match(/(?<=v=)[^&]{11}|(?<=\/shorts\/).{11}/);
        ytC.hidden = !video_id;
        if (!video_id) return;

        document.querySelectorAll(".list-item > .list").forEach((e)=>
        {
            e.parentNode.hidden = true;
            e.querySelectorAll(".linkBtn").forEach((forEachBtn)=>
            {
                const imgSizeSpec = forEachBtn.getAttribute("imgTag") ?? forEachBtn.innerText
                checkImg(`https://i.ytimg.com/vi/${video_id}/${imgSizeSpec}.jpg`).then((notHide)=>
                {
                    forEachBtn.hidden = !notHide;
                    if(notHide) e.parentNode.hidden = false;
                });
                forEachBtn.href = `https://i.ytimg.com/vi/${video_id}/${imgSizeSpec}.jpg`
            });
        });
    }

    document.addEventListener("yt-rendererstamper-finished", onPageUpdate)
    document.addEventListener("yt-page-type-changed", onPageUpdate)
    document.addEventListener("yt-navigate-start", onPageUpdate)
    waitElementLoad("yt-page-navigation-progress",1,20,250)
        .then((e)=>{new MutationObserver(onPageUpdate).observe(e, {attributes: true})})

    console.log("[Youtube Cover] done");
}

console.log("[Youtube Cover] loading");
waitElementLoad("#start", 1, 10, 300).then(main)





