// ==UserScript==
// @name               FkGFW富国服墙
// @namespace          https://www.cnblogs.com/chary
// @version            0.0.1
// @author             CharyGao
// @description        FkGFW only supports the latest chrome and Tm;啥都不服只扶墙;
// @icon               https://img.icons8.com/ios-filled/100/000000/firewall.png
// @include            https://io.freess.info*
// @include            https://*.ishadowx.*
// @require            https://bundle.run/jsqr@1.3.1
// @require            https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/core.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/enc-base64.min.js
// @run-at             document-end
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_setClipboard
// @grant              unsafeWindow
// @grant              window.close
// @grant              window.focus
// @grant              GM_xmlhttpRequest
// @grant              GM_openInTab
// @grant              GM_registerMenuCommand
// @grant              GM_addStyle
// @grant              GM_download
// @downloadURL https://update.greasyfork.org/scripts/404409/FkGFW%E5%AF%8C%E5%9B%BD%E6%9C%8D%E5%A2%99.user.js
// @updateURL https://update.greasyfork.org/scripts/404409/FkGFW%E5%AF%8C%E5%9B%BD%E6%9C%8D%E5%A2%99.meta.js
// ==/UserScript==

(function () {
    'use strict'; //启用严格模式

    //<editor-fold desc="0.Log">
    const myLog = new class {
        _logCount = 0;

        log(param1, param2) {
            param1 = param1 ? param1 : "";
            param2 = param2 ? param2 : "";
            // noinspection JSUnresolvedFunction
            console.log(`#${this._logCount++}ADown:`, param1, param2);
        }
    }
    //</editor-fold>

    //<editor-fold desc="1.Ui">
    const floatTaiChi = new class {
        constructor() {
            //<editor-fold desc="setUi Class Style">
            // noinspection JSUnresolvedFunction,CssUnusedSymbol
            GM_addStyle(// language=CSS
                    `.aside-nav {
                        position: fixed;
                        top: 50px;
                        left: 50px;
                        z-index: 9999999 !important;
                        width: 260px;
                        height: 260px;
                        filter: url(#goo);
                        user-select: none;
                        opacity: .75;
                    }

                    .bounceInUp {
                        animation-name: bounceInUp;
                        animation-delay: 1s;
                    }

                    .animated {
                        animation-duration: 1s;
                        animation-fill-mode: both;
                    }

                    .aside-nav .aside-menu {
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: red 2px double;
                        background: #07A7E1;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        text-align: center;
                        line-height: 49px;
                        font-size: 20px;
                        z-index: 1;
                        /*cursor: move;*/
                    }

                    .aside-nav .menu-item {
                        position: absolute;
                        width: 60px;
                        height: 60px;
                        background-color: #ff7676;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        line-height: 60px;
                        text-align: center;
                        border-radius: 50%;
                        text-decoration: none;
                        color: #fff;
                        transition: background .5s, transform .6s;
                        font-size: 14px;
                        box-sizing: border-box;
                    }

                    .aside-nav .menu-item:hover {
                        background: #a9c734;
                    }

                    .aside-nav .menu-line {
                        line-height: 59px;
                    }

                    .aside-nav:hover {
                        opacity: 1;
                    }

                    .aside-nav:hover .aside-menu {
                        animation: jello 1s;
                    }

                    .aside-nav:hover .menu-1 {
                        transform: translate3d(0, -135%, 0) rotateZ(0deg);
                    }

                    .aside-nav:hover .menu-2 {
                        transform: translate3d(-100%, -100%, 10px) rotateZ(-45deg);
                    }

                    .aside-nav:hover .menu-3 {
                        transform: translate3d(-135%, 0, 0) rotateZ(-90deg);
                    }

                    .aside-nav:hover .menu-4 {
                        transform: translate3d(-100%, 100%, 10px) rotateZ(-135deg);
                    }

                    .aside-nav:hover .menu-5 {
                        transform: translate3d(0%, 135%, 0) rotateZ(180deg);
                    }

                    .aside-nav:hover .menu-6 {
                        transform: translate3d(100%, 100%, 10px) rotateZ(135deg);
                    }

                    .aside-nav:hover .menu-7 {
                        transform: translate3d(135%, 0, 0) rotateZ(90deg);
                    }

                    .aside-nav:hover .menu-8 {
                        transform: translate3d(100%, -100%, 10px) rotateZ(45deg);
                    }

                    @keyframes jello {
                        from, 11.1%, to {
                            transform: none;
                        }
                        22.2% {
                            transform: skewX(-12.5deg) skewY(-12.5deg);
                        }
                        33.3% {
                            transform: skewX(6.25deg) skewY(6.25deg);
                        }
                        44.4% {
                            transform: skewX(-3.125deg) skewY(-3.125deg);
                        }
                        55.5% {
                            transform: skewX(1.5625deg) skewY(1.5625deg);
                        }
                        66.6% {
                            transform: skewX(-.78125deg) skewY(-.78125deg);
                        }
                        77.7% {
                            transform: skewX(0.390625deg) skewY(0.390625deg);
                        }
                        88.8% {
                            transform: skewX(-.1953125deg) skewY(-.1953125deg);
                        }
                    }

                    @keyframes bounceInUp {
                        from, 60%, 75%, 90%, to {
                            animation-timing-function: cubic-bezier(0.215, .61, .355, 1);
                        }
                        from {
                            opacity: 0;
                            transform: translate3d(0, 800px, 0);
                        }
                        60% {
                            opacity: 1;
                            transform: translate3d(0, -20px, 0);
                        }
                        75% {
                            transform: translate3d(0, 10px, 0);
                        }
                        90% {
                            transform: translate3d(0, -5px, 0);
                        }
                        to {
                            transform: translate3d(0, 0, 0);
                        }
                    }
                `)
            ;
            //</editor-fold>

            let sideGodDownTagNavDiv = document.createElement("div");
            sideGodDownTagNavDiv.className = "aside-nav bounceInUp animated";
            // language=HTML
            sideGodDownTagNavDiv.innerHTML =
                    `<label class="aside-menu" id="god_down_label">👇</label>
            <span class="menu-item menu-line menu-1" id="god_down_span_1">①☰乾</span>
            <span class="menu-item menu-line menu-2" id="god_down_span_2">②☱兑</span>
            <span class="menu-item menu-line menu-3" id="god_down_span_3">③☲离</span>
            <span class="menu-item menu-line menu-4" id="god_down_span_4">④☳震</span>
            <span class="menu-item menu-line menu-5" id="god_down_span_5">⑤☷坤</span>
            <span class="menu-item menu-line menu-6" id="god_down_span_6">⑥☶艮</span>
            <span class="menu-item menu-line menu-7" id="god_down_span_7">⑦☵坎</span>
            <span class="menu-item menu-line menu-8" id="god_down_span_8">⑧☴巽</span>`;
            document.body.append(sideGodDownTagNavDiv);

            let drag = {
                offsetLeft: null,
                offsetTop: null,
                isDown: false,
            }
            sideGodDownTagNavDiv.addEventListener("mousedown", ev => {
                drag.offsetLeft = ev.clientX - sideGodDownTagNavDiv.offsetLeft;
                drag.offsetTop = ev.clientY - sideGodDownTagNavDiv.offsetTop;
                drag.isDown = true;
            })

            sideGodDownTagNavDiv.addEventListener("mousemove", ev => {

                if (ev.clientX < 50 || ev.clientX > window.innerWidth - 50
                    || ev.clientY < 50 || ev.clientY > window.innerHeight - 50
                    || drag.isDown === false) {
                    return;
                }

                let newOffsetLeft = ev.clientX - drag.offsetLeft;
                let newOffsetTop = ev.clientY - drag.offsetTop;

                sideGodDownTagNavDiv.style.left = `${newOffsetLeft}px`;
                sideGodDownTagNavDiv.style.top = `${newOffsetTop}px`;
            })

            sideGodDownTagNavDiv.addEventListener("mouseup", () => {
                drag.isDown = false;
            });
            // noinspection JSUnusedGlobalSymbols
            this.godDownLabel = document.getElementById("god_down_label");
            // noinspection JSUnusedGlobalSymbols
            this.godDownSpan1 = document.getElementById("god_down_span_1");
            // noinspection JSUnusedGlobalSymbols
            this.godDownSpan2 = document.getElementById("god_down_span_2");
            // noinspection JSUnusedGlobalSymbols
            this.godDownSpan3 = document.getElementById("god_down_span_3");
            // noinspection JSUnusedGlobalSymbols
            this.godDownSpan4 = document.getElementById("god_down_span_4");
            // noinspection JSUnusedGlobalSymbols
            this.godDownSpan5 = document.getElementById("god_down_span_5");
            // noinspection JSUnusedGlobalSymbols
            this.godDownSpan6 = document.getElementById("god_down_span_6");
            // noinspection JSUnusedGlobalSymbols
            this.godDownSpan7 = document.getElementById("god_down_span_7");
            // noinspection JSUnusedGlobalSymbols
            this.godDownSpan8 = document.getElementById("god_down_span_8");
        }
    };

    const subTextArea = new class {
        constructor() {
            let textContainer = document.createElement("div");
            textContainer.id = "god_down_text_div";
            // language=HTML
            textContainer.innerHTML = `
                <div style="white-space: nowrap; width: calc(100% - 10px); position: fixed; top: 50%;left: 0; 
margin: 2px; height: calc(50% - 50px); background: black; color: lawngreen; resize: none; border: 3px solid green; overflow: scroll;z-index: 99;">
                    <textarea id="god_down_textarea"
                              style=" width: 100%; height: 100%;display: none;color: green; background: black; border: red 1px dashed;"></textarea>
                    <ol id="god_down_links_node" style="display: none"></ol>
                </div>`;
            document.body.appendChild(textContainer);
            this.textContainer = textContainer;
            this.textContainerTextarea = document.getElementById("god_down_textarea");
            this.textContainerLinksNode = document.getElementById("god_down_links_node");
            this.count = 0;
            textContainer.hidden = true;
        }
    }

    const showTips = new class {
        constructor() {
            //<editor-fold desc="setUi Class Style - https://animista.net/">
            // noinspection JSUnresolvedFunction,CssUnusedSymbol
            GM_addStyle(// language=CSS
                    `div#god_down_show_tips {
                        top: 20px;
                        left: 20px;
                        position: fixed;
                        padding: 3px 5px;
                        background: powderblue;
                        border: red 3px groove;
                        box-shadow: 0 0 10px 10px brown;
                        border-radius: 10px;
                        opacity: 0;
                        font-size: 12px;
                        margin: 0;
                        text-align: center;
                        width: 350px;
                        height: auto;
                        color: darkblue;
                        z-index: 9999;
                    }
                    .slide-in-and-out-blurred-top {
                        animation-name: slide-in-blurred-top, slide-out-blurred-top;
                        animation-duration: 0.6s, 0.45s;
                        animation-delay: 0s, 1.6s;
                        animation-iteration-count: 1, 1;
                        animation-direction: normal, normal;
                        animation-timing-function: cubic-bezier(0.230, 1.000, 0.320, 1.000), cubic-bezier(0.755, 0.050, 0.855, 0.060);
                        animation-fill-mode: forwards, forwards; /*both, both;*/
                    }
                    .slide-in-blurred-top {
                        animation: slide-in-blurred-top 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
                    }
                    @keyframes slide-in-blurred-top {
                        0% {
                            transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
                            transform-origin: 50% 0;
                            filter: blur(40px);
                            opacity: 0;
                        }
                        100% {
                            transform: translateY(0) scaleY(1) scaleX(1);
                            transform-origin: 50% 50%;
                            filter: blur(0);
                            opacity: 1;
                        }
                    }
                    .slide-out-blurred-top {
                        animation: slide-out-blurred-top 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
                    }
                    @keyframes slide-out-blurred-top {
                        0% {
                            transform: translateY(0) scaleY(1) scaleX(1);
                            transform-origin: 50% 0;
                            filter: blur(0);
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(-1000px) scaleY(2) scaleX(0.2);
                            transform-origin: 50% 0;
                            filter: blur(40px);
                            opacity: 0;
                        }
                    }`);
            //</editor-fold>
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;

            this.htmlTipsDivElement = document.createElement("div");
            this.htmlTipsDivElement.id = "god_down_show_tips";
            this.htmlTipsDivElement.innerText = "god_down加载完成!";
            document.body.appendChild(this.htmlTipsDivElement);
            this.htmlTipsDivElement.style.top = ((this.windowHeight / 2) - 25) + "px";
            let halfDivWith = document.querySelector("#god_down_show_tips").offsetWidth / 2;
            this.htmlTipsDivElement.style.left = ((this.windowWidth / 2) - halfDivWith) + "px";
            this.htmlTipsDivElement.className = "slide-in-and-out-blurred-top";
            this.htmlTipsDivElement.addEventListener("animationend", (animationEvent) => {
                // myLog.log(animationEvent.animationName);
                if (animationEvent.animationName === "slide-out-blurred-top") {
                    this.htmlTipsDivElement.classList.remove("slide-in-and-out-blurred-top");
                }
            });
        }

        show(content, height, time_s) {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;

            this.htmlTipsDivElement.innerText = content;
            this.htmlTipsDivElement.style.animationDelay = "0s, " + (time_s + 0.6) + "s";
            let halfDivWith = document.querySelector("#god_down_show_tips").offsetWidth / 2;
            this.htmlTipsDivElement.style.top = ((this.windowHeight / 2) - (height / 2)) + "px";
            this.htmlTipsDivElement.style.left = ((this.windowWidth / 2) - halfDivWith) + "px";
            this.htmlTipsDivElement.className = "slide-in-and-out-blurred-top";
        }
    }
    //</editor-fold>

    //<editor-fold desc="3.入口">
    setTimeout(function () {
        try {
            if (location.href.startsWith("https://io.freess.info")) {
                floatTaiChi.godDownLabel.addEventListener("click",//https://io.freess.info/
                    () => subTextArea.textContainer.hidden = !subTextArea.textContainer.hidden);
                floatTaiChi.godDownSpan1.innerText = "获取";
                subTextArea.textContainerTextarea.style.display = "block";
                floatTaiChi.godDownSpan1.addEventListener("click", freeSsInfoGet);
            } else if (location.href.startsWith("https://my.ishadowx.biz")) {
                floatTaiChi.godDownLabel.addEventListener("click",//https://io.freess.info/
                    () => subTextArea.textContainer.hidden = !subTextArea.textContainer.hidden);
                floatTaiChi.godDownSpan1.innerText = "获取";
                subTextArea.textContainerTextarea.style.display = "block";
                floatTaiChi.godDownSpan1.addEventListener("click", iShadowXGet);
            } else myLog.log("没解析成功!");
            myLog.log("GodDown加载完成~");
        } catch (e) {
            myLog.log('err:', e);
        }
    }, 2000); //页面加载完成后延时2秒执行
    //</editor-fold>

    //<editor-fold desc="4.https://io.freess.info/">
    function freeSsInfoGet() {

        let freeSsInfoGetHeader = new Headers({
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Host": "io.freess.info",
            "DNT": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
        });

        // noinspection JSUnresolvedFunction
        GM_xmlhttpRequest(
            {
                method: "GET",
                headers: freeSsInfoGetHeader,
                url: "https://io.freess.info/",
                timeout: 5000,
                // responseType: "string",//one of arraybuffer, blob, json
                onload: (freeSsInfoGetResponse) => {
                    if (freeSsInfoGetResponse.status !== 200) {
                        throw `1.页面获取 error htmlResponse.status != 200:${freeSsInfoGetResponse}`;
                    }
                    // myLog.log(freeSsInfoGetResponse.responseXML);
                    let matchedGroups = freeSsInfoGetResponse.responseText.match(/href="(data:image\/png;base64,.*?)"/img);
                    for (const src of matchedGroups) {
                        let dataSrc = src.match(/href="(data:image\/png;base64,.*?)"/im)[1];
                        myLog.log(dataSrc);

                        const image = new Image();
                        image.src = dataSrc;
                        image.onload = function () {
                            const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
                            canvas.width = image.width;
                            canvas.height = image.height;
                            context.drawImage(image, 0, 0);

                            document.body.prepend(canvas);

                            try {
                                const imageData = context.getImageData(0, 0, image.width, image.height);
                                // myLog.log(imageData.data);
                                // noinspection JSUnresolvedFunction
                                const qrCode = jsqr(imageData.data, imageData.width, imageData.height);
                                const {data} = qrCode;

                                myLog.log(data);
                                subTextArea.textContainerTextarea.value += data + "\n";
                                subTextArea.count++;

                                if (matchedGroups.length <= subTextArea.count) {
                                    subTextArea.textContainer.hidden = false;
                                    // noinspection JSUnresolvedFunction
                                    GM_setClipboard(subTextArea.textContainerTextarea.value, {
                                        type: 'text',
                                        mimetype: 'text/plain'
                                    });
                                    showTips.show("复制完成!", 50, 3);
                                }


                            } catch (e) {
                                myLog.log(e);
                            }
                        };

                    }


                },
                onerror: (exception) => {
                    myLog.log(`onerror:${exception}`);
                },
                ontimeout: (exception) => {
                    myLog.log(`ontimeout:${exception}`);
                },
            }
        );
    }

    //</editor-fold>

    function iShadowXGet() {
        let v2Groups = document.querySelectorAll("div.v2 span.copybtn");
        for (const item of v2Groups) {
            let dataV2 = item.getAttribute("data-clipboard-text");
            myLog.log(dataV2);
            subTextArea.textContainerTextarea.value += dataV2;
            subTextArea.count++;
            // if (v2Groups.length <= subTextArea.count) {
            //     subTextArea.textContainer.hidden = false;
            //     // noinspection JSUnresolvedFunction
            //     GM_setClipboard(subTextArea.textContainerTextarea.value, {
            //         type: 'text',
            //         mimetype: 'text/plain'
            //     });
            //     showTips.show("复制完成!", 50, 3);
            // }
        }

        let protocol = "origin";//协议
        let obfuscation = "plain";//混淆
        let group = "IShadowX";
        let groupUrlEncodedBase64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(group));
        let elementNodeListOfH4Groups = document.querySelectorAll("div.portfolio-items > div > div.portfolio-item > div.hover-bg > div.hover-text");
        elementNodeListOfH4Groups.forEach(divPicItem => {
            let ipNode = divPicItem.querySelector("h4 > span[id^='ip']");//服务器ip
            let portNode = divPicItem.querySelector("h4 > span[id^='port']");//服务器端口
            let passwordNode = divPicItem.querySelector("h4 > span[id^='pw']");//密码
            let methodNode = divPicItem.querySelector("h4:nth-last-child(2)");//加密
            if (ipNode && portNode && passwordNode && methodNode) {
                let ip = ipNode.innerText.trim();//服务器ip
                let port = portNode.innerText.trim();//服务器端口
                let password = passwordNode.innerText.trim();//密码
                let method = methodNode.innerText.trim().substring(7);//加密

                let passwordUrlEncodedBase64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password));
                let allString = `${ip}:${port}:${protocol}:${method}:${obfuscation}:${passwordUrlEncodedBase64}/?obfsparam=&remarks=&group=${groupUrlEncodedBase64}`;
                let allBase64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(allString));

                subTextArea.textContainerTextarea.value += `ssr://${allBase64}\n`;
                subTextArea.count++;
                if (elementNodeListOfH4Groups.length <= subTextArea.count) {
                    subTextArea.textContainer.hidden = false;
                    // noinspection JSUnresolvedFunction
                    GM_setClipboard(subTextArea.textContainerTextarea.value, {
                        type: 'text',
                        mimetype: 'text/plain'
                    });
                    showTips.show("复制完成!", 50, 3);
                }
            } else {
                myLog.log("中间三个非ssr跳过!");
            }


        });

    }

})();