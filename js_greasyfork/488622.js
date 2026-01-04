// ==UserScript==
// @name         ColaManga 瀏覽增強
// @name:zh-TW   ColaManga 瀏覽增強
// @name:zh-CN   ColaManga 浏览增强
// @name:en      ColaManga Browsing Enhance
// @version      2025.09.21-Beta
// @author       Canaan HS
// @description       隱藏廣告內容，提昇瀏覽體驗。自訂背景顏色，圖片大小調整。當圖片載入失敗時，自動重新載入圖片。提供熱鍵功能：[← 上一頁]、[下一頁 →]、[↑ 自動上滾動]、[↓ 自動下滾動]。當用戶滾動到頁面底部時，自動跳轉到下一頁。
// @description:zh-TW 隱藏廣告內容，提昇瀏覽體驗。自訂背景顏色，圖片大小調整。當圖片載入失敗時，自動重新載入圖片。提供熱鍵功能：[← 上一頁]、[下一頁 →]、[↑ 自動上滾動]、[↓ 自動下滾動]。當用戶滾動到頁面底部時，自動跳轉到下一頁。
// @description:zh-CN 隐藏广告内容，提昇浏览体验。自定义背景颜色，调整图片大小。当图片载入失败时，自动重新载入图片。提供快捷键功能：[← 上一页]、[下一页 →]、[↑ 自动上滚动]、[↓ 自动下滚动]。当用户滚动到页面底部时，自动跳转到下一页。
// @description:en    Hide advertisement content, enhance browsing experience. Customize background color, adjust image size. Automatically reload images when they fail to load. Provide shortcut key functionalities: [← Previous Page], [Next Page →], [↑ Auto Scroll Up], [↓ Auto Scroll Down]. Automatically jump to the next page when users scroll to the bottom of the page.

// @match        *://www.colamanga.com/manga-*/
// @match        *://www.colamanga.com/manga-*/*/*.html
// @icon         https://www.colamanga.com/favicon.png

// @license      MPL-2.0
// @namespace    https://greasyfork.org/users/989635
// @supportURL   https://github.com/Canaan-HS/MonkeyScript/issues

// @require      https://update.greasyfork.org/scripts/487608/1661432/SyntaxLite_min.js

// @grant        GM_setValue
// @grant        GM_getValue

// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/488622/ColaManga%20%E7%80%8F%E8%A6%BD%E5%A2%9E%E5%BC%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/488622/ColaManga%20%E7%80%8F%E8%A6%BD%E5%A2%9E%E5%BC%B7.meta.js
// ==/UserScript==

(function () {
    /* 臨時的自定義 (當 Enable = false 時, 其餘的設置將無效) */
    const Config = {
        BGColor: {
            Enable: true,
            Color: "#595959",
        },
        AutoTurnPage: { // 自動翻頁
            Enable: true,
            Mode: 3, // 1 = 快速 | 2 = 一般無盡 | 3 = 優化無盡
        },
        RegisterHotkey: { // 快捷功能
            Enable: true,
            Function: { // 移動端不適用以下配置
                TurnPage: true, // 翻頁
                AutoScroll: true, // 自動滾動
                KeepScroll: true, // 換頁繼續滾動
                ManualScroll: false, // 手動滾動啟用時, 將會變成點擊一次, 根據視點翻一頁 且 自動滾動會無效
            }
        }
    };
    const Control = {
        ScrollPixels: 2,
        WaitPicture: 1e3,
        BlockListener: new Set(["auxclick", "mousedown", "pointerup", "pointerdown", "dState", "touchstart", "unhandledrejection"]),
        IdList: {
            Title: "CME_Title",
            Iframe: "CME_Iframe",
            Block: "CME_Block-Ads",
            Menu: "CME_Menu-Style",
            Image: "CME_Image-Style",
            Scroll: "CME_Scroll-Hidden",
            ChildS: "CME_Child-Scroll-Hidden"
        }
    };
    const Param = {
        Body: null,
        ContentsPage: null,
        HomePage: null,
        PreviousLink: null,
        NextLink: null,
        MangaList: null,
        BottomStrip: null,
        Up_scroll: false,
        Down_scroll: false,
        IsFinalPage: false,
        IsMangaPage: Lib.$url.endsWith("html"),
        IsMainPage: window.self === window.parent
    };
    (async () => {
        if (!Param.IsMangaPage) return;
        Lib.addStyle(`
        html {pointer-events: none !important;}
        div[style*='position'] {display: none !important;}
        .mh_wrap a,
        .mh_readend a,
        span.mh_btn:not(.contact),
        #${Control.IdList.Iframe} {
            pointer-events: auto !important;
        }
    `, Control.IdList.Block);
        const OriginListener = EventTarget.prototype.addEventListener;
        const Block = Control.BlockListener;
        EventTarget.prototype.addEventListener = new Proxy(OriginListener, {
            apply(target, thisArg, args) {
                const [type, listener, options] = args;
                if (Block.has(type)) return;
                return target.apply(thisArg, args);
            }
        });
        const iframe = `iframe:not(#${Control.IdList.Iframe})`;
        const AdCleanup = () => {
            Lib.$qa(iframe).forEach(ad => ad.remove());
            Lib.body?.$qa("script").forEach(ad => ad.remove());
            requestIdleCallback(AdCleanup, {
                timeout: 300
            });
        };
        AdCleanup();
    })();
    const Tools = (() => {
        const idWhiteList = new Set(Object.values(Control.IdList));
        const storage = (key, value = null) => {
            return value != null ? Lib.session(key, {
                value: value
            }) : Lib.session(key);
        };
        const topDetected = Lib.$throttle(() => {
            Param.Up_scroll = Lib.sY == 0 ? (storage("scroll", false), false) : true;
        }, 1e3);
        const isTheBottom = () => Lib.sY + Lib.iH >= document.documentElement.scrollHeight;
        const detectSkip = Config.RegisterHotkey.Function.KeepScroll && Config.AutoTurnPage.Mode === 1;
        const bottomDetected = Lib.$throttle(() => {
            if (detectSkip) return;
            Param.Down_scroll = isTheBottom() ? (storage("scroll", false), false) : true;
        }, 1e3);
        return {
            storage: storage,
            getSet: () => {
                return Lib.getV("Style", {
                    BG_Color: "#595959",
                    Img_Bw: "auto",
                    Img_Mw: "100%"
                });
            },
            getNodes(root) {
                const nodes = [];
                function task(root2) {
                    const tree = document.createTreeWalker(root2, NodeFilter.SHOW_ELEMENT, {
                        acceptNode: node => {
                            if (idWhiteList.has(node.id)) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    });
                    while (tree.nextNode()) {
                        nodes.push(tree.currentNode);
                    }
                }
                task(root.head);
                task(root.body);
                return nodes;
            },
            autoScroll(move) {
                requestAnimationFrame(() => {
                    if (Param.Up_scroll && move < 0) {
                        window.scrollBy(0, move);
                        topDetected();
                        this.autoScroll(move);
                    } else if (Param.Down_scroll && move > 0) {
                        window.scrollBy(0, move);
                        bottomDetected();
                        this.autoScroll(move);
                    }
                });
            },
            manualScroll(move) {
                window.scrollBy({
                    left: 0,
                    top: move,
                    behavior: "smooth"
                });
            },
            isFinalPage(link) {
                Param.IsFinalPage = link.startsWith("javascript");
                return Param.IsFinalPage;
            },
            visibleObjects: object => object.filter(img => img.height > 0 || img.src),
            lastObject: object => {
                const len = object.length;
                if (len <= 5) return object[0];
                if (len <= 10) return object.at(-2) ?? object[0];
                return object.at(-3) ?? object[0];
            },
            detectionValue(object) {
                return this.visibleObjects(object).length >= Math.floor(object.length * .5);
            }
        };
    })();
    const Style = (() => {
        const $Set = Tools.getSet();
        return {
            async backgroundStyle(Color = Config.BGColor.Color) {
                Param.Body.style.cssText = `
                background: ${Color} !important;
            `;
                document.documentElement.style.cssText = `
                overflow: visible !important;
            `;
            },
            async pictureStyle() {
                if (Lib.platform === "Desktop") {
                    Lib.addStyle(`
                    .mh_comicpic img {
                        margin: auto;
                        display: block;
                        cursor: pointer;
                        vertical-align: top;
                        width: ${$Set.Img_Bw};
                        max-width: ${$Set.Img_Mw};
                    }
                `, Control.IdList.Image);
                }
                setTimeout(() => {
                    const click = new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true
                    });
                    const observer = new IntersectionObserver(observed => {
                        observed.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.dispatchEvent(click);
                            }
                        });
                    }, {
                        threshold: .3
                    });
                    Param.MangaList.$qa("span.mh_btn:not(.contact):not(.read_page_link)").forEach(reloadBtn => observer.observe(reloadBtn));
                }, Control.WaitPicture);
            },
            async menuStyle() { }
        };
    })();
    const Hotkey = async () => {
        let jumpState = false;
        if (Lib.platform === "Desktop") {
            const {
                TurnPage,
                AutoScroll,
                KeepScroll,
                ManualScroll
            } = Config.RegisterHotkey.Function;
            if (Param.IsMainPage && KeepScroll && AutoScroll && !ManualScroll) {
                Param.Down_scroll = Tools.storage("scroll");
                Param.Down_scroll && Tools.autoScroll(Control.ScrollPixels);
            }
            const UP_ScrollSpeed = -Control.ScrollPixels;
            const CanScroll = AutoScroll || ManualScroll;
            Lib.onEvent(window, "keydown", event => {
                const key = event.key;
                if (key === "ArrowLeft" && TurnPage && !jumpState) {
                    event.stopImmediatePropagation();
                    jumpState = !Tools.isFinalPage(Param.PreviousLink);
                    location.assign(Param.PreviousLink);
                } else if (key === "ArrowRight" && TurnPage && !jumpState) {
                    event.stopImmediatePropagation();
                    jumpState = !Tools.isFinalPage(Param.NextLink);
                    location.assign(Param.NextLink);
                } else if (key === "ArrowUp" && CanScroll) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    if (ManualScroll) {
                        Tools.manualScroll(-Lib.iH);
                    } else {
                        if (Param.Up_scroll) {
                            Param.Up_scroll = false;
                        } else if (!Param.Up_scroll || Param.Down_scroll) {
                            Param.Down_scroll = false;
                            Param.Up_scroll = true;
                            Tools.autoScroll(UP_ScrollSpeed);
                        }
                    }
                } else if (key === "ArrowDown" && CanScroll) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    if (ManualScroll) {
                        Tools.manualScroll(Lib.iH);
                    } else {
                        if (Param.Down_scroll) {
                            Param.Down_scroll = false;
                            Tools.storage("scroll", false);
                        } else if (Param.Up_scroll || !Param.Down_scroll) {
                            Param.Up_scroll = false;
                            Param.Down_scroll = true;
                            Tools.storage("scroll", true);
                            Tools.autoScroll(Control.ScrollPixels);
                        }
                    }
                }
            }, {
                capture: true
            });
        } else if (Lib.platform === "Mobile") {
            let startX, startY, moveX, moveY;
            const sidelineX = Lib.iW * .3;
            const sidelineY = Lib.iH / 4 * .3;
            Lib.onEvent(window, "touchstart", event => {
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
            }, {
                passive: true
            });
            Lib.onEvent(window, "touchmove", Lib.$debounce(event => {
                moveY = event.touches[0].clientY - startY;
                if (Math.abs(moveY) < sidelineY) {
                    moveX = event.touches[0].clientX - startX;
                    if (moveX > sidelineX && !jumpState) {
                        jumpState = !Tools.isFinalPage(Param.PreviousLink);
                        location.assign(Param.PreviousLink);
                    } else if (moveX < -sidelineX && !jumpState) {
                        jumpState = !Tools.isFinalPage(Param.NextLink);
                        location.assign(Param.NextLink);
                    }
                }
            }, 60), {
                passive: true
            });
        }
    };
    const PageTurn = async () => {
        const turnMode = Config.AutoTurnPage.Mode;
        const optimized = turnMode === 3;
        async function unlimited() {
            Lib.addStyle(`
            .mh_wrap, .mh_readend, .mh_footpager,
            .fed-foot-info, #imgvalidation2022 {display: none;}
            body {
                margin: 0;
                padding: 0;
            }
            #${Control.IdList.Iframe} {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 110vh;
                border: none;
            }
        `, Control.IdList.Scroll);
            const stylelRules = Lib.$q(`#${Control.IdList.Scroll}`).sheet.cssRules;
            if (Param.IsMainPage) {
                let size = 0;
                Lib.onEvent(window, "message", event => {
                    const data = event.data;
                    if (data && data.length > 0) {
                        const {
                            Title,
                            PreviousUrl,
                            CurrentUrl,
                            NextUrl,
                            Resize,
                            SizeSet,
                            SizeRecord
                        } = data[0];
                        if (Resize) {
                            if (size > SizeRecord) size -= SizeRecord;
                            size += Resize;
                            stylelRules[2].style.height = `${size}px`;
                        } else if (SizeSet) stylelRules[2].style.height = `${SizeSet}px`; else if (Title && NextUrl && PreviousUrl && CurrentUrl) {
                            document.title = Title;
                            Param.NextLink = NextUrl;
                            Param.PreviousLink = PreviousUrl;
                            history.pushState(null, null, CurrentUrl);
                        }
                    }
                });
            } else {
                Lib.addStyle(`
                html {
                    overflow: hidden !important;
                    overflow-x: hidden !important;
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                html::-webkit-scrollbar {
                    display: none !important;
                }
            `, Control.IdList.ChildS);
                let mainWindow = window;
                Lib.onEvent(window, "message", event => {
                    while (mainWindow.parent !== mainWindow) {
                        mainWindow = mainWindow.parent;
                    }
                    mainWindow.postMessage(event.data, Lib.$origin);
                });
            }
            const iframe = Lib.createElement("iframe", {
                id: Control.IdList.Iframe,
                src: Param.NextLink
            });
            (async () => {
                let img, Observer, quantity = 0;
                const observerNext = new IntersectionObserver(observed => {
                    observed.forEach(entry => {
                        const rect = entry.boundingClientRect;
                        const isPastTarget = rect.bottom < 0;
                        const isIntersecting = entry.isIntersecting;
                        if ((isIntersecting || isPastTarget) && Tools.detectionValue(img)) {
                            observerNext.disconnect();
                            Observer.disconnect();
                            turnPage();
                        }
                    });
                }, {
                    threshold: [0, .1, .5],
                    rootMargin: "0px 0px 200px 0px"
                });
                setTimeout(() => {
                    img = Param.MangaList.$qa("img");
                    if (img.length <= 5) {
                        turnPage();
                        return;
                    }
                    const lastImg = Tools.lastObject(Tools.visibleObjects(img));
                    lastImg instanceof Element && observerNext.observe(lastImg);
                    Lib.$observer(Param.MangaList, () => {
                        const visible = Tools.visibleObjects(img);
                        const vlen = visible.length;
                        if (vlen > quantity) {
                            quantity = vlen;
                            const lastImg2 = Tools.lastObject(visible);
                            if (lastImg2 instanceof Element) {
                                observerNext.disconnect();
                                observerNext.observe(lastImg2);
                            }
                        }
                    }, {
                        debounce: 100,
                        attributeFilter: ["src"]
                    }, observer => {
                        Observer = observer.ob;
                    });
                }, Control.WaitPicture);
            })();
            let turned = false;
            function turnPage() {
                if (turned) return;
                turned = true;
                let currentHeight = 0;
                const resizeObserver = new ResizeObserver(() => {
                    if (!Param.MangaList.isConnected) {
                        resizeObserver.disconnect();
                        return;
                    }
                    const newHeight = Param.MangaList.offsetHeight;
                    if (newHeight > currentHeight) {
                        window.parent.postMessage([{
                            Resize: newHeight,
                            SizeRecord: currentHeight
                        }], Lib.$origin);
                        currentHeight = newHeight;
                    }
                });
                if (Tools.isFinalPage(Param.NextLink)) {
                    if (optimized) {
                        window.parent.postMessage([{
                            SizeSet: Param.MangaList.offsetHeight + 245
                        }], Lib.$origin);
                    }
                    stylelRules[0].style.display = "block";
                    return;
                }
                waitLoad();
                Param.Body.appendChild(iframe);
                resizeObserver.observe(Param.MangaList);
                function waitLoad() {
                    let iframeWindow, currentUrl, content, allImg;
                    const failed = () => {
                        iframe.offAll();
                        iframe.src = "";
                        setTimeout(() => {
                            iframe.src = Param.NextLink;
                            waitLoad();
                        });
                    };
                    const success = () => {
                        iframe.offAll();
                        iframeWindow = iframe.contentWindow;
                        currentUrl = iframeWindow.location.href;
                        if (currentUrl !== Param.NextLink) {
                            failed();
                            return;
                        }
                        content = iframeWindow.document;
                        content.body.style.overflow = "hidden";
                        Lib.log(currentUrl, {
                            group: "無盡翻頁"
                        });
                        allImg = content.$qa("#mangalist img");
                        const urlUpdate = new IntersectionObserver(observed => {
                            observed.forEach(entry => {
                                if (entry.isIntersecting) {
                                    urlUpdate.disconnect();
                                    const PageLink = content.body.$qa("div.mh_readend ul a");
                                    window.parent.postMessage([{
                                        Title: content.title,
                                        CurrentUrl: currentUrl,
                                        PreviousUrl: PageLink[0]?.href,
                                        NextUrl: PageLink[2]?.href
                                    }], Lib.$origin);
                                }
                            });
                        }, {
                            threshold: 0
                        });
                        allImg.forEach(img => urlUpdate.observe(img));
                        if (optimized) {
                            Lib.$q("title").id = Control.IdList.Title;
                            const adapt = Lib.platform === "Desktop" ? .5 : .7;
                            const releaseMemory = new IntersectionObserver(observed => {
                                observed.forEach(entry => {
                                    if (entry.isIntersecting) {
                                        const targetImg = entry.target;
                                        const ratio = Math.min(adapt, Lib.iH * adapt / targetImg.clientHeight);
                                        if (entry.intersectionRatio >= ratio) {
                                            releaseMemory.disconnect();
                                            Tools.getNodes(document).forEach(node => {
                                                node.remove();
                                            });
                                            targetImg.scrollIntoView();
                                        }
                                    }
                                });
                            }, {
                                threshold: [0, .5, 1]
                            });
                            allImg.forEach(img => releaseMemory.observe(img));
                        }
                    };
                    iframe.on("load", success);
                    iframe.on("error", failed);
                }
            }
        }
        switch (turnMode) {
            case 2:
            case 3:
                unlimited();
                break;

            default:
                setTimeout(() => {
                    const img = Param.MangaList.$qa("img");
                    if (!Tools.isFinalPage(Param.NextLink)) {
                        const observerNext = new IntersectionObserver(observed => {
                            observed.forEach(entry => {
                                if (entry.isIntersecting && Tools.detectionValue(img)) {
                                    observerNext.disconnect();
                                    location.assign(Param.NextLink);
                                }
                            });
                        }, {
                            threshold: 1
                        });
                        observerNext.observe(Param.BottomStrip);
                    }
                }, Control.WaitPicture);
        }
    };
    function Main(raf = void 0) {
        async function mangaPageInit(callback) {
            Lib.waitEl(["body", "div.mh_readtitle", "div.mh_headpager", "div.mh_readend", "#mangalist"], null, {
                raf: raf,
                throttle: 30,
                timeout: 10,
                visibility: Param.IsMainPage,
                timeoutResult: true
            }).then(([Body, Title, HeadPager, Readend, Manga]) => {
                Param.Body = Body;
                const HomeLink = Title.$qa("a");
                Param.ContentsPage = HomeLink[0].href;
                Param.HomePage = HomeLink[1].href;
                try {
                    const PageLink = Readend.$qa("ul a");
                    Param.PreviousLink = PageLink[0].href;
                    Param.NextLink = PageLink[2].href;
                } catch {
                    const PageLink = HeadPager.$qa("a.mh_btn:not(.mh_bgcolor)");
                    Param.PreviousLink = PageLink[0].href;
                    Param.NextLink = PageLink[1].href;
                }
                Param.MangaList = Manga;
                Param.BottomStrip = Readend.$q(".endtip2");
                if ([Param.Body, Param.ContentsPage, Param.HomePage, Param.PreviousLink, Param.NextLink, Param.MangaList, Param.BottomStrip].every(Check => Check)) callback(true); else callback(false);
            });
        }
        async function contentsPageInit() {
            Lib.waitEl([".all_data_list", ".website-display-all"], ([list, display]) => {
                if (list.style.height === "auto") return;
                display.click();
            }, {
                raf: raf
            });
        }
        try {
            if (Param.IsMangaPage) {
                mangaPageInit(state => {
                    if (state) {
                        Style.pictureStyle();
                        Config.BGColor.Enable && Style.backgroundStyle();
                        Config.AutoTurnPage.Enable && PageTurn();
                        Config.RegisterHotkey.Enable && Hotkey();
                    } else {
                        Lib.log("Manga Page Init Error").error;
                        setTimeout(() => Main(true), 1e3);
                    }
                });
            } else contentsPageInit();
        } catch (error) {
            Lib.log(error).error;
        }
    }
    Main();
})();