// ==UserScript==
// @name         AutoPlayNextEpisode
// @version      1.0.2
// @description  自動撥放下一集&紀錄觀看的動畫集數
// @author       Jay.Huang
// @match        https://v.myself-bbs.com/player/*
// @match        https://myself-bbs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myself-bbs.com
// @grant        none
// @license      MIT
// @namespace https://github.com/2jo4u4/MySelfRecorder.git
// @downloadURL https://update.greasyfork.org/scripts/500885/AutoPlayNextEpisode.user.js
// @updateURL https://update.greasyfork.org/scripts/500885/AutoPlayNextEpisode.meta.js
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const storeKeyWord = "recorder";
const storeFavorite = "favorite";
const favoriteIconHref = "https://cdn-icons-png.flaticon.com/512/2107/2107845.png";
const favoriteAddIconHref = "https://cdn-icons-png.flaticon.com/512/2001/2001314.png";
const favoriteRemoveIconHref = "https://cdn-icons-png.flaticon.com/512/2001/2001316.png";
const notFoundCoverImg = "https://cdn-icons-png.flaticon.com/512/7214/7214281.png";
const clearLogImg = "https://cdn-icons-png.flaticon.com/512/3602/3602056.png";
const PIPmode = true

var FavoriteBtnStatus;
(function (FavoriteBtnStatus) {
    FavoriteBtnStatus[FavoriteBtnStatus["\u672A\u52A0\u5165\u6700\u611B"] = 0] = "\u672A\u52A0\u5165\u6700\u611B";
    FavoriteBtnStatus[FavoriteBtnStatus["\u5DF2\u52A0\u5165\u6700\u611B"] = 1] = "\u5DF2\u52A0\u5165\u6700\u611B";
})(FavoriteBtnStatus || (FavoriteBtnStatus = {}));
function dalay() {
    return __awaiter(this, arguments, void 0, function* (timeout = 500) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    });
}
class VideoPlayManager {
    constructor() {
        // https://v.myself-bbs.com/player/AgADjw0AAmr7uVQ?totalEpisode=11&0=AgADjw0AAmr7uVQ&1=AgADuQ8AAhENCFU
        this.url = new URL(window.location.href);
        this.totalEpisode = Number(this.url.searchParams.get("totalEpisode") ?? "NaN");
        this.currEpisode = Number(this.url.searchParams.get("currEpisode") ?? "NaN");
        if(!isNaN(this.totalEpisode)) {
            this.from = this.url.searchParams.get('from') ?? null
            this.addCrtlBtn();
            document.body.onload = () => {
                this.getVideoPlay().then(videoEl => {
                    if (videoEl) {
                        console.log(videoEl, { PIPmode, requestPictureInPicture: Boolean(videoEl.requestPictureInPicture) })
                        if(PIPmode && videoEl.requestPictureInPicture) {
                            videoEl.addEventListener("play", ()=>{
                                videoEl.requestPictureInPicture().then(()=>{
                                    console.log("auto open pip mode");
                                })
                            })
                        }
                        videoEl.addEventListener("ended", () => {
                            this.changeEpisode(true);
                        });
                    }
                });
            }
        }
    }
    changeEpisode(next = true){
        const targetNumber = next ? this.currEpisode + 1 : this.currEpisode - 1
        const videoUrl = this.url.searchParams.get(targetNumber.toString()) ?? null
        if(videoUrl !== null) {
            window.location.href = this.getNextURL(videoUrl, targetNumber);
        } else {
            if(next) {
                alert("沒有下一集了，將返回列表。");
                 if(this.from) {
                     window.location.href = this.from
                 }
            }
            else {
                alert("找不到上一集。");
            }
        }
    }
    addCrtlBtn(){
        const prevBtn = document.createElement("div");
        prevBtn.onclick = () => {
            this.changeEpisode(false);
        }

        const nextBtn = document.createElement("div");
        nextBtn.onclick = () => {
            this.changeEpisode(true);
        }

        function addStyle(btn, type = "left"){
            btn.style.position = "fixed";
            btn.style.zIndex = "998";
            btn.style.top = "50%";
            btn.style[type] = "0px";
            btn.style.width = "24px";
            btn.style.height = "64px";
            btn.style.borderRadius = "12px";
            btn.style.border = "1px black solid";
            btn.style.backgroundColor = "white";
            btn.style.opacity = "0.3";
            btn.style.transition = "opacity 0.3s"
            btn.onmouseenter = () => {
                btn.style.opacity = "1";
            }
            btn.onmouseleave = () => {
                btn.style.opacity = "0.3";
            }
        }

        addStyle(prevBtn, "left");
        addStyle(nextBtn, "right");
        document.body.append(prevBtn, nextBtn)
    }
    getVideoPlay() {
        return __awaiter(this, arguments, void 0, function* (times = 5) {
            let video;
            let retry = 0;
            while (!Boolean(video) && retry <= times) {
                video = document.querySelector("video");
                yield dalay(1000);
                retry += 1;
            }
            return video;
        });
    }
    getNextURL(videoUrl, episodeNumber) {
        const nextUrl = new URL(videoUrl)
        nextUrl.search = this.url.search
        nextUrl.searchParams.set("currEpisode", episodeNumber)
        return nextUrl.toString();
    }
}
class AnimeManager {
    constructor() {
        this.favoriteList = Tools.getFavorite();
        this.createPositionEl();
        this.renderFavoriteListUI();
        // thread-47934-1-1.html
        if (/^\/thread/.test(window.location.pathname)) {
            this.page = "episode";
            this.animeCode = window.location.pathname.split("-")[1];
            this.recordList = Tools.getRecorder();
            this.episodeUrls = [];
            this.getElement().then(main => {
                if (main) {
                    this.mainEl = main;
                    this.animeName = this.getAnimeName();
                    this.anchorEls = Array.from(main.getElementsByClassName("various"));
                    this.anchorEls.forEach((tagA, index) => {
                        const url = this.getEpisodeUrlByElement(tagA);
                        this.enhanceAnchorEl(tagA, index);
                        if (url) {
                            this.episodeUrls.push(url);
                            this.addAutoBtnEachEpisode(tagA, url);
                        }
                    });
                    this.rerenderAnchorElHighight("render");
                    this.renderEpisodeUI();
                    this.renderCtrlFavoriteUI();
                }
                else {
                   console.warn("找不到動畫集數資訊");
                }
            });
        }
        else {
            this.page = "overview";
        }
        document.body.append(this.positionEl);
    }
    get currAnimeRecord() {
        return this.recordList[this.animeCode];
    }
    renderEpisodeUI() {
        const animeCode = this.animeCode;
        const container = document.querySelector(".fr.vodlist_index").children[0];
        container.style.position = "relative";
        // 添加清除按鈕
        container.appendChild(UIComponent.cleanWatchLogBtn(() => {
            const recorder = Tools.getRecorder();
            Tools.setRecorder(Object.assign(Object.assign({}, recorder), { [animeCode]: [] }));
            this.rerenderAnchorElHighight("clearAll");
        }));
    }
    // 添加觀看紀錄的高亮提示
    rerenderAnchorElHighight(type) {
        if (type === "clearAll") {
            this.anchorEls.forEach(el => {
                el.parentElement.parentElement.parentElement.style.backgroundColor = "unset";
            });
        }
        else if (type === "render" && this.currAnimeRecord && this.currAnimeRecord.length > 1) {
            const [recently, ...log] = this.currAnimeRecord;
            this.anchorEls[recently].parentElement.parentElement.parentElement.style.backgroundColor = "#ff000080";
            log.forEach(episodeIndex => {
                this.anchorEls[episodeIndex].parentElement.parentElement.parentElement.style.backgroundColor = "#ff000030";
            });
        }
    }
    getEpisodeUrlByElement(el) {
        return el.dataset.href || null;
    }
    addAutoBtnEachEpisode(el, url) {
        const span = document.createElement("span");
        span.innerText = "自動接續下集";
        span.style.cursor = "pointer";
        span.style.marginLeft = "4px";
        span.onclick = () => {
            this.gotoPlayPage(url);
        };
        el.parentElement.appendChild(span);
    }
    gotoPlayPage(targetUrl) {
        const totalEpisode = `totalEpisode=${this.episodeUrls.length}`;
        let keyValue = ""
        let currEpisode = 0
        this.episodeUrls.forEach((url, index) => {
            const episode = index + 1;
            if(targetUrl === url) {
                currEpisode = episode
            }
            keyValue += `&${episode}=${url}`;
        });
        const from = window.location.href;
        const url = `${targetUrl}?currEpisode=${currEpisode}&${totalEpisode}${keyValue}&from=${from}`;
        window.location.href = url;
    }
    getElement() {
        return __awaiter(this, arguments, void 0, function* (times = 5) {
            let main;
            let retry = 0;
            while (main === undefined && retry <= times) {
                main = document.getElementsByClassName("main_list")[0];
                yield dalay();
                retry += 1;
            }
            return main;
        });
    }
    enhanceAnchorEl(el, index) {
        const animeCode = this.animeCode;
        el.onclick = () => {
            const recorder = Tools.getRecorder();
            const newNumberList = Array.from(new Set(recorder[animeCode] ? [index, ...recorder[animeCode]] : [index]));
            Tools.setRecorder(Object.assign(Object.assign({}, recorder), { [animeCode]: newNumberList }));
            this.recordList = Tools.getRecorder();
            this.rerenderAnchorElHighight("render");
        };
    }
    getAnimeName() {
        var _a;
        const block = (((_a = document.querySelector("#pt .z")) === null || _a === void 0 ? void 0 : _a.lastElementChild) || null);
        if (block) {
            return block.innerText.replace(/【(\S|\s|0-9)*/, "");
        }
        else {
            return "";
        }
    }
    /** 建立主畫面定位按鈕元素 */
    createPositionEl() {
        // 定位主畫面的按鈕
        this.positionEl = document.createElement("div");
        this.positionEl.id = "positionEl";
        this.positionEl.style.position = "fixed";
        this.positionEl.style.display = "flex";
        this.positionEl.style.flexDirection = "row";
        this.positionEl.style.top = "20px";
        this.positionEl.style.left = "20px";
    }
    /** 我的最愛列表 */
    renderFavoriteListUI() {
        let favoritListFlag = false;
        // 父元素
        const container = document.createElement("div");
        container.id = "container";
        container.style.display = "flex";
        container.style.flexDirection = "row";
        container.style.marginRight = "4px";
        // 用於打開最愛列表的按鈕
        const favorite_btn = document.createElement("img");
        this.ctrlBtnStyle(favorite_btn);
        favorite_btn.src = favoriteIconHref;
        favorite_btn.title = "打開/關閉最愛列表";
        // 被打開的列表
        const favorite_list = document.createElement("div");
        favorite_list.style.maxHeight = "50vh";
        favorite_list.style.display = favoritListFlag ? "flex" : "none";
        favorite_list.style.flexDirection = "column";
        favorite_list.style.marginTop = "12px";
        favorite_list.style.padding = "12px";
        favorite_list.style.backdropFilter = "blur(20px)";
        favorite_list.style.borderRadius = "12px";
        favorite_list.style.overflow = "auto";
        favorite_list.style.position = "absolute";
        favorite_list.style.width = "max-content";
        favorite_list.style.top = "48px";
        // 用於顯示開動畫的 Cover 圖定位
        const coverImage = document.createElement("div");
        coverImage.style.marginTop = "12px";
        coverImage.style.position = "relative";
        const span = document.createElement("span");
        span.innerText = "暫無最愛";
        span.style.color = "darkorange";
        favorite_btn.onclick = () => {
            favoritListFlag = !favoritListFlag;
            favorite_list.style.display = favoritListFlag ? "flex" : "none";
            span.style.display = this.favoriteList.length === 0 ? "block" : "none";
        };
        this.favoriteList.forEach((item, index) => {
            const card = this.favoriteAnimeItem(coverImage, item, index !== 0 ? 12 : 0);
            favorite_list.append(card);
        });
        favorite_list.append(span);
        container.append(favorite_btn, coverImage, favorite_list);
        this.positionEl.append(container);
    }
    favoriteAnimeItem(coverImagePosition, v, marginTop = 0) {
        const { animecode, image, name, href } = v;
        const card = document.createElement("div");
        card.id = animecode;
        card.style.marginTop = `${marginTop}px`;
        card.style.maxWidth = "300px";
        const coverImage = document.createElement("img");
        coverImage.src = image;
        coverImage.style.position = "absolute";
        coverImage.style.top = "0";
        coverImage.style.left = "310px";
        coverImage.style.border = "6px solid white";
        coverImage.style.borderRadius = "12px";
        coverImage.style.boxShadow = "4px 6px 8px 6px #60606073";
        const link = document.createElement("a");
        link.href = href;
        link.style.color = "#fff";
        link.style.textShadow = "#000 0.1em 0.1em 0.2em";
        link.innerText = name;
        link.style.display = "flex";
        link.style.flexDirection = "column";
        link.onmouseenter = () => {
            coverImagePosition.append(coverImage);
        };
        link.onmouseleave = () => {
            coverImage.remove();
        };
        card.append(link);
        return card;
    }
    /** 加入最愛 / 移除最愛 */
    renderCtrlFavoriteUI() {
        let index = this.favoriteList.findIndex(({ animecode }) => animecode === this.animeCode);
        let isFavorite = index !== -1;
        const coverPicture = document.querySelector(".info_con .info_img_box img");
        const info = {
            name: this.animeName,
            image: (coverPicture === null || coverPicture === void 0 ? void 0 : coverPicture.src) || notFoundCoverImg,
            href: window.location.pathname,
            animecode: this.animeCode,
        };
        const ctrl_btn = document.createElement("img");
        this.ctrlBtnStyle(ctrl_btn);
        if (isFavorite) {
            ctrl_btn.src = favoriteRemoveIconHref;
            ctrl_btn.title = "移除最愛";
        }
        else {
            ctrl_btn.src = favoriteAddIconHref;
            ctrl_btn.title = "加入最愛";
        }
        ctrl_btn.addEventListener("click", () => {
            if (isFavorite) {
                // remove
                this.favoriteList.splice(index, 1);
                Tools.setFavorite(this.favoriteList);
                ctrl_btn.title = "加入最愛";
                ctrl_btn.src = favoriteAddIconHref;
            }
            else {
                // add
                this.favoriteList = [...this.favoriteList, info];
                Tools.setFavorite(this.favoriteList);
                ctrl_btn.title = "移除最愛";
                ctrl_btn.src = favoriteRemoveIconHref;
            }
            this.rerenderFavoriteListUI();
            isFavorite = !isFavorite;
        });
        this.positionEl.append(ctrl_btn);
    }
    rerenderFavoriteListUI() {
        const listContainer = this.positionEl.children[0];
        const ctrlBtn = this.positionEl.children[1];
        listContainer.remove();
        ctrlBtn.remove();
        this.renderFavoriteListUI();
        this.positionEl.append(ctrlBtn);
    }
    /** 主畫面顯示的按鈕樣式 */
    ctrlBtnStyle(el) {
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.padding = "12px";
        el.style.borderRadius = "12px";
        el.style.backdropFilter = "blur(20px)";
        el.style.cursor = "pointer";
        el.style.border = "3px solid rgb(130, 130, 130)";
    }
}
class Tools {
    static setFavorite(data) {
        window.localStorage.setItem(storeFavorite, JSON.stringify(data));
    }
    static getFavorite() {
        const str = window.localStorage.getItem(storeFavorite) || "[]";
        return JSON.parse(str);
    }
    static setRecorder(data) {
        window.localStorage.setItem(storeKeyWord, JSON.stringify(data));
    }
    static getRecorder() {
        const str = window.localStorage.getItem(storeKeyWord) || "{}";
        return JSON.parse(str);
    }
}
class NoticeUIChange {
}
class UIComponent {
    static cleanWatchLogBtn(clickCB) {
        const clearBtn = document.createElement("img");
        clearBtn.src = clearLogImg;
        clearBtn.style.position = "absolute";
        clearBtn.style.top = "6px";
        clearBtn.style.right = "6px";
        clearBtn.style.cursor = "pointer";
        clearBtn.style.width = "24px";
        clearBtn.style.height = "24px";
        clearBtn.alt = "清除觀看紀錄";
        clearBtn.title = "清除觀看紀錄";
        clearBtn.onclick = clickCB;
        // clearBtn.onclick = function () {
        //   const recorder = Tools.getRecorder();
        //   Tools.setRecorder({ ...recorder, [animeCode]: [] });
        //   mark([]);
        // };
        return clearBtn;
    }
    static ctrlFavoriteBtn(initType) {
        const btn = document.createElement("img");
        let isAlreadyAdd = initType === FavoriteBtnStatus.已加入最愛;
        const changeIcon_Remove = () => {
            btn.src = favoriteRemoveIconHref;
            btn.title = "移除最愛";
        };
        const changeIcon_Add = () => {
            btn.src = favoriteAddIconHref;
            btn.title = "加入最愛";
        };
        btn.style.marginRight = "4px";
        btn.style.width = "24px";
        btn.style.height = "24px";
        btn.style.padding = "12px";
        btn.style.borderRadius = "12px";
        btn.style.backdropFilter = "blur(20px)";
        btn.style.cursor = "pointer";
        btn.style.border = "3px solid rgb(130, 130, 130)";
        if (isAlreadyAdd) {
            changeIcon_Remove();
        }
        else {
            changeIcon_Add();
        }
        btn.addEventListener("click", () => {
            isAlreadyAdd = !isAlreadyAdd;
            if (isAlreadyAdd) {
                changeIcon_Remove();
            }
            else {
                changeIcon_Add();
            }
        });
    }
}
(function () {
    "use strict";
    const isVideoPlay = window.location.origin === "https://v.myself-bbs.com";
    if (isVideoPlay) {
        new VideoPlayManager();
    }
    else {
        new AnimeManager();
    }
})();