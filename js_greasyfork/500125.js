// ==UserScript==
// @name         Modal Image in rule(rule34图片查看器 水果玉米版)
// @namespace    http://tampermonkey.net/
// @version      20250119
// @description  Add a modal image and thumbnails vertical-carrousel to rule34, add functions of  drag img and resize img, rule34图片查看器, 修改版
// @author       falaz, hzx
// @match        https://rule34.xxx/index.php?page=po*
// @icon         https://www.google.com/s2/favicons?domain=rule34.xxx
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500125/Modal%20Image%20in%20rule%28rule34%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8%20%E6%B0%B4%E6%9E%9C%E7%8E%89%E7%B1%B3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500125/Modal%20Image%20in%20rule%28rule34%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8%20%E6%B0%B4%E6%9E%9C%E7%8E%89%E7%B1%B3%E7%89%88%29.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
// @ts-check
// original author is falaz, hzx just add functions original https://sleazyfork.org/en/scripts/390625-modal-image-in-rule\

/**
 * get file name from url
 * input: 'https://wimg.rule34.xxx//samples/2749/sample_ee25a33b3079953bab541bce5724694c.jpg?11795365'
 * output: 'sample_ee25a33b3079953bab541bce5724694c.jpg'
 * @param url
 * @returns {string}
 */
function getFileNameFromURL(url) {
    // 检查是否包含问号并去掉?及其后面的内容
    // Check if the URL contains a question mark and remove '?' And what follows
    let cleanedUrl = url.includes('?') ? url.split('?')[0] : url;

    // 获取最后一个斜杠后的内容
    // Gets the content after the last slash
    let fileName = cleanedUrl.substring(cleanedUrl.lastIndexOf('/') + 1);

    return fileName;
}
class Falaz {
    /**
     * Like querySelector, but small
     * @param {String} selector
     * @param {Element|Document} element
     * @returns {HTMLElement}
     */
    q(selector, element = document) {
        return element.querySelector(selector);
    }

    /**
     * Like querySelectorAll, but small
     * @param {String} selector
     * @param {Element|Document} element
     * @returns
     */
    qa(selector, element = document) {
        return element.querySelectorAll(selector);
    }
}

class Modal {
    constructor(document, dp) {
        this.pointer = 0;
        this.dp = dp;
        this.infinityScroll = new InfinityScroll(document, dp);
        /**
         * @property {Media[]} medias
         */
        // media 构造参数传递页面的src, 就可以解析出图片的真实地址
        // getMedias
        this.medias = this.infinityScroll.getMedias(document, 0);
        this.thumbsGallery = new ThumbsGallery(this.medias);
        this.createModalNode(document, this.thumbsGallery.render());
        this.bodyParent = F.q('body');
        this.visible = false;
    }

    createConfigBar() {
        return `<div id="menuModal" style="display: flex;">
    <div><input type="checkbox" id="night">Night Theme</div>
    <div><input type="checkbox" id="night">Only videos</div></div>`
    }

    createModalNode(document, extraDiv = null) {
        const div = document.createElement("div");
        const css = document.createElement("style");
        div.innerHTML =
            `<div id="modal-container" style="display:none"><div id="modal"></div>${extraDiv ? extraDiv : ''}${this.createButtons()}</div>`;
        css.innerHTML =
            ".content {display: flex; flex-wrap: wrap; gap: 5px;}" +
            "span[data-nosnippet] {display: none;}" +
            "#modal-container{background: #000000a8;width: 100%;height: 100%;position: fixed;z-index: 10;}" +
            "#modal{height: 90%;width: 80%;background: transparent;padding: 0% 5%;margin: 2% 5% 2% 0;position: fixed}" +
            "#modal img{width: auto;border: none;vertical-align: middle;height: 100%;margin: 0 auto;display:block;}" +
            "#modal video{width: 100%;height:100%}" +
            "#modal-container #thumbGallery{float:right;overflow-y: scroll;height: 900px;} #modal-container #thumbGallery ul{list-style:none}" +
            "#modal-container .gallery-item{cursor: pointer;}" +
            '#navigationModal{margin-bottom: 0px;font-size: 20px;color: white;display: flex;justify-content: center;bottom: 0px;width: 100%; position:absolute}' +
            '#navigationModal svg:hover g g {fill: white;}' +
            '.fluid_video_wrapper video{cursor:default!important}' +
            '@media (max-width: 1024px) {#thumbGallery {display: none;} #modal{width:100%;padding:0%;overflow-x:scroll}}' +
            '#modal-container  button {border-radius: 25px; border: none; background: #1abc9c; margin-left: 10px}';
        if (debug) {
            css.innerHTML += "img,video{filter:blur(30px)}";
        }
        document.body.prepend(div);
        document.head.prepend(css);
        this.modalContainer = F.q("#modal-container");
        this.modal = F.q("#modal");

        this.infinityScroll.nextPage = this.infinityScroll.getNextPageHref(document);
    }

    /**
     * [important] 创建按钮, 添加功能
     * [important] Create buttons & add functionality
     * @returns {string}
     */
    createButtons() {
        return `<div id="navigationModal"">
            <div onclick="document.modalObj.prevMedia()"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="52" height="52" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#1abc9c"><path d="M125.69231,19.84615h-79.38462c-14.54868,0 -26.46154,11.91286 -26.46154,26.46154v79.38462c0,14.54868 11.91286,26.46154 26.46154,26.46154h79.38462c14.54868,0 26.46154,-11.91286 26.46154,-26.46154v-79.38462c0,-14.54868 -11.91286,-26.46154 -26.46154,-26.46154zM112.46154,59.53846l-47.6256,26.46154l47.6256,26.46154v13.23077l-59.53846,-33.07692v-13.23077l59.53846,-33.07692z"></path></g></g></svg></div>
            <div onclick="document.modalObj.nextMedia()"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="52" height="52" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#1abc9c"><path d="M125.69231,19.84615h-79.38462c-14.54868,0 -26.46154,11.91286 -26.46154,26.46154v79.38462c0,14.54868 11.91286,26.46154 26.46154,26.46154h79.38462c14.54868,0 26.46154,-11.91286 26.46154,-26.46154v-79.38462c0,-14.54868 -11.91286,-26.46154 -26.46154,-26.46154zM119.07692,92.61538l-59.53846,33.07692v-13.23077l47.6256,-26.46154l-47.6256,-26.46154v-13.23077l59.53846,33.07692z"></path></g></g></svg></div>
            <div onclick="document.modalObj.close()"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g id="original-icon" fill="#1abc9c"><path d="M86,17.2c-37.9948,0 -68.8,30.8052 -68.8,68.8c0,37.9948 30.8052,68.8 68.8,68.8c37.9948,0 68.8,-30.8052 68.8,-68.8c0,-37.9948 -30.8052,-68.8 -68.8,-68.8zM112.9868,104.87987c2.24173,2.24173 2.24173,5.8652 0,8.10693c-1.118,1.118 -2.58573,1.67987 -4.05347,1.67987c-1.46773,0 -2.93547,-0.56187 -4.05347,-1.67987l-18.87987,-18.87987l-18.87987,18.87987c-1.118,1.118 -2.58573,1.67987 -4.05347,1.67987c-1.46773,0 -2.93547,-0.56187 -4.05347,-1.67987c-2.24173,-2.24173 -2.24173,-5.8652 0,-8.10693l18.87987,-18.87987l-18.87987,-18.87987c-2.24173,-2.24173 -2.24173,-5.8652 0,-8.10693c2.24173,-2.24173 5.8652,-2.24173 8.10693,0l18.87987,18.87987l18.87987,-18.87987c2.24173,-2.24173 5.8652,-2.24173 8.10693,0c2.24173,2.24173 2.24173,5.8652 0,8.10693l-18.87987,18.87987z"></path></g></g></svg></div>
           <button onclick="document.modalObj.resetImage()"> 还原<br/>(reset) </button>
            <button onclick="document.modalObj.download()"> 下载<br/>(download) </button>
            <button onclick="document.modalObj.favorite()"> 收藏<br/>(favorite) </button>
           </div>`
    }

    /**
     * @param {Media} media
     */
    async render(media) {
        if (!this.modalContainer) {
            this.createModalNode(document, this.thumbsGallery.render());
        }
        if (media.src == "Retry") {
            await this.reloadMediaSrc(media);
        }
        if (media.type == "video") {
            this.modal.innerHTML = `<video src="${media.src}" ${debug ? '' : "autoplay"} controls loop id="modalVideo"></video>`;
            F.q('#modalVideo').volume = this.getCurrentVolume();
            F.q('#modalVideo').onvolumechange = e => this.saveCurrentVolume(e.target.volume);
            fluidPlayer(document.querySelector('#modal video'), {
                layoutControls: {
                    autoPlay: true,
                    allowDownload: true,
                    loop: true,
                    fillToContainer: true
                }
            })
            F.q('#modal video').loop = true
        } else {
            this.modal.innerHTML = `<img src="${media.src}"/>`;

            /**
             * hzx 修改开始
             * hzx modification BEGIN
             *
             * 添加图片的拖拽和滚轮缩放功能
             * Add drag-and-drop and scroll zoom functions for images
             *
             * Button 的 onclick 事件处理函数的实现: 复位, 下载, 添加到收藏
             * Implementation of onclick event handler for Button: reset, download, add to favorites
             */
            this.innerImg = F.q("img", this.modal);
            let img = this.innerImg;
            let scale = 1;
            let originX = 0;
            let originY = 0;
            let isDragging = false;
            let startX, startY;

            img.addEventListener('wheel', (event) => {
                event.preventDefault();

                const rect = img.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;

                const delta = Math.sign(event.deltaY) * -0.1;
                const newScale = Math.min(Math.max(0.5, scale + delta), 3);

                originX = (originX - offsetX) * (newScale / scale) + offsetX;
                originY = (originY - offsetY) * (newScale / scale) + offsetY;

                scale = newScale;

                img.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
            });

            img.addEventListener('mousedown', (event) => {
                event.preventDefault();
                isDragging = true;
                startX = event.clientX;
                startY = event.clientY;
                img.style.cursor = 'grabbing';
            });

            window.addEventListener('mouseup', () => {
                event.preventDefault();
                isDragging = false;
                img.style.cursor = 'grab';
            });

            window.addEventListener('mousemove', (event) => {
                event.preventDefault();
                if (!isDragging) return;

                const dx = event.clientX - startX;
                const dy = event.clientY - startY;

                originX += dx;
                originY += dy;

                startX = event.clientX;
                startY = event.clientY;

                img.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
            });

            this.resetImage = function () {
                scale = 1;
                originX = 0;
                originY = 0;
                img.style.transform = `translate(0, 0) scale(${scale})`;
            }


            // hzx 修改结束
            // hzx modification END
        }
        this.modalContainer.style.display = "block";
        this.visible = true;
        this.toggleBodyScroll(false);
        modalObj.scrollIntoCurrentMedia();
    }

    /**
     * hzx 修改开始
     * 收藏, 下载功能
     * hzx modification BEGIN
     */
    favorite() {
        function apiAddFav(id) {
            return fetch(`https://rule34.xxx/public/addfav.php?id=${id}`);
        }

        async function addFav(id) {
            let resp = await apiAddFav(id);
            let content = await resp.text();


            debugger;
            if (content !== '') {
                showToast("[Success] 收藏成功");
            } else {
                showToast("[fail] 收藏失败");
            }
        }

        /**
         * input: http://www.xxx.com?123333
         * output: 123333
         * @param url
         * @returns {*|null}
         */
        function getUrlId(url) {
            const parts = url.split('?');
            return parts.length > 1 ? parts[1] : null;
        }

        addFav(getUrlId(this.medias[this.pointer].src));
    }

    /**
     * 2025/01/19:
     * [bug fix] 修复无法下载视频的bug
     * [bug fix] Fixed a bug where videos could not be downloaded
     */
    download() {
        showToast("下载开始, 请等待\ndownload begin, plz wait")
        let src = this.medias[this.pointer].src;
        GM_download({url: src, name: getFileNameFromURL(src)});
    }

    // hzx 修改结束
    // hzx modification END

    toggleBodyScroll(visible) {
        this.bodyParent.style.overflow = visible ? 'inherit' : 'hidden';
    }

    getCurrentVolume() {
        return localStorage.volume ? localStorage.volume : 0.0;
    }

    /**
     * Attach to event video.onvolumechange
     * @param {number} value
     */
    saveCurrentVolume(value) {
        localStorage.volume = value;
    }

    async getNextPage() {
        if (!this.infinityScroll.nextSended) {
            this.infinityScroll.nextSended = true;
            const docResponse = await this.infinityScroll.getNextPage();
            if (docResponse) {
                const medias = this.infinityScroll.getMedias(
                    docResponse,
                    this.medias.length
                );
                this.addMedias(medias);
                this.infinityScroll.nextSended = false;
            } else {
                c('The page requested is on the medias');
            }
        }
    }

    close() {
        if (!this.modalContainer) {
            this.createModalNode(document);
        }
        try {
            this.modal.querySelector("video").pause();
        } catch (e) {
        }
        this.modalContainer.style.display = "none";
        this.toggleBodyScroll(true);
        this.visible = false;
    }

    nextMedia() {
        if (this.pointer < this.medias.length - 1) {
            this.pointer++;
            this.render(this.medias[this.pointer]);
        } else {
            this.getNextPage();
            this.pointer++;
            this.render(this.medias[this.pointer]);
        }
    }

    goToMedia(index) {
        if (index < this.medias.length - 1) {
            this.pointer = index;
            this.render(this.medias[index])
        }
    }

    prevMedia() {
        if (this.pointer > 0) {
            this.pointer--;
            this.render(this.medias[this.pointer]);
        } else {
            console.error("Reach the start of the medias");
        }
    }

    getCurrentMedia() {
        this.medias[this.pointer];
    }

    getCurrentThumb() {
        return F.q(`span [data-index="${this.pointer}"]`).parentElement
    }

    /**
     *
     * @param {Media[]} medias
     */
    addMedias(medias) {
        const mediasTemp = [...this.medias, ...medias];
        // @ts-ignore
        this.medias = mediasTemp;
        this.thumbsGallery.updateMedias(mediasTemp);
    }

    async reloadMediaSrcFromMedias(index) {
        await this.medias[index].reloadSrc();
    }

    async reloadMediaSrc(media) {
        await media.reloadSrc();
    }

    scrollIntoCurrentMedia() {
        c('fired')
        this.getCurrentThumb().scrollIntoView();
        this.thumbsGallery.scrollToThumb(modalObj.pointer)
    }
}

// 获取页面图片的真实地址, 并保存
class Media {
    /**
     * @param {string} _page This is the page of the media. Not the real image src.
     * @param {string} _type
     * @param {string} _thumb
     */
    constructor(_page, _type, _thumb, dp) {
        this.page = _page;
        this.type = _type;
        this.thumb = _thumb;
        this.dp = dp;
        this.getSrc().then((src) => {
            this.src = src;
        });
    }

    async getSrc() {
        const response = await fetch(this.page);
        if ([202, 200].includes(response.status)) {
            const body = await response.text();
            const dp = new DOMParser();
            const pageDocument = dp.parseFromString(body, "text/html");
            const video = F.q("video source", pageDocument);
            const image = F.q(".flexi img", pageDocument);
            if (video) {
                this.type = "video";
                // @ts-ignore
                return video.src;
            } else {
                this.type = "image";
                // @ts-ignore
                return image.src;
            }
        } else {
            return "Retry";
        }
    }

    async reloadSrc() {
        this.src = await this.getSrc();
    }
}

// 实现无线滚动
class InfinityScroll {
    /**
     * @param {Document} document
     * @param {DOMParser} _dp
     */
    constructor(document, _dp) {
        this.nextSended = false;
        this.pagesParsed = [this.getPageNumber(document)];
        this.nextPage = this.getNextPageHref(document);
        this.dp = _dp;
    }

    /**
     * @param {Document} doc
     */
    getPageNumber(doc) {
        // get current page number from one page
        return parseInt(doc.querySelector("#paginator div b").innerHTML);
    }

    /**
     * @param {Document} doc
     */
    getNextPageHref(doc) {
        const nextNode = doc.querySelector('#paginator [alt="next"]');
        // @ts-ignore
        return nextNode ? nextNode.href : null;
    }

    async getNextPage() {
        c("getNextPage");
        if (this.nextPage === null) {
            // @ts-ignore
            this.nextPage = F.q('#paginator [alt="next"]').href;
        }
        const response = await fetch(this.nextPage);
        if ([204, 202, 200, 201].includes(response.status)) {
            const body = await response.text();
            const dp = new DOMParser();
            const pageDocument = dp.parseFromString(body, "text/html");
            const pageNum = this.getPageNumber(pageDocument);
            this.nextPage = this.getNextPageHref(pageDocument);
            if (!this.pagesParsed.includes(pageNum)) { // remove the page allready parsed
                this.pagesParsed.push(pageNum);
                return pageDocument;
            } else {
                return false;
            }
        } else {
            await this.sleep(500);
            return await this.getNextPage();
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 获取所有缩略图, 并设置onclick事件
     * Gets all the thumbnail elements and sets the onclick event
     * @param {Document} document
     * @param {number} pad The length of medias in the Modal Object
     * @returns {Media[]}
     */
    getMedias(document, pad) {
        // .thumb 作为类名通常是指 "thumbnail"（缩略图）的简称
        const thumbsNode = F.qa("#content .thumb", document);
        const medias = [];
        const nodes = [];
        //const pad = this.medias? this.medias.length : 0;
        for (let i = 0; i < thumbsNode.length; i++) {
            const node = thumbsNode[i];
            /**
             * @type {HTMLImageElement} img
             */
                // @ts-ignore
            const img = F.q("img", node);
            const title = img.title;
            const anchor = node.querySelector("a");
            const media = new Media(
                anchor.href,
                /animated|video/.test(title) ? "video" : "image",
                img.src,
                this.dp
            );
            anchor.dataset.index = (i + pad).toString();
            img.dataset.index = (i + pad).toString();
            //node.dataset.index = (i+pad).toString();
            medias.push(media);
            nodes.push(node);
        }
        this.addElementsToCurrentContentView(nodes); // async
        return medias;
    }

    async addElementsToCurrentContentView(nodes) {
        for (const node of nodes) {
            this.clickFunction(node);
            F.q(".content").insertBefore(node, F.q("#paginator"));
        }
    }

    clickFunction(element) {
        /**
         * hzx 修改开始
         * hzx modification BEGIN
         *
         * 2025/01/19:
         * [bug fix] 多音频, 关闭视频后, 仍有音频的问题
         * [bug fix] fix multiple audio problem
         */
        element.onclick = (e) => {
            e.preventDefault();
            const index = e.target.dataset.index
                ? e.target.dataset.index
                : modalObj.pointer;
            modalObj.pointer = index;
            modalObj.render(modalObj.medias[index]);
        };
        // hzx 修改结束
        // hzx modification END
    }
}

class ThumbsGallery {
    /**
     * @param {Media[]} medias
     */
    constructor(medias) {
        this.medias = medias;
    }

    /**
     * @param {number} index
     */
    scrollToThumb(index) {
        F.q(`.gallery-item[data-index="${index}"]`).scrollIntoView();
    }

    /**
     * @param {Media[]} medias
     */
    updateMedias(medias) {
        this.medias = medias;
        F.q('#thumbGallery').innerHTML = `<ul>${this.buildItems()}</ul>`;
    }

    render() {
        return `<div id="thumbGallery"><ul>${this.buildItems()}</ul></div>`
    }

    buildItems() {
        let li = ''
        this.medias.forEach((e, i) => {
            li += `<li class="gallery-item" data-index="${i}" onclick="{document.modalObj.goToMedia(${i})}","_blank")}">
            <img src="${e.thumb}"\\>
          </li>`
        })
        return li;
    }

}

const dp = new DOMParser();
const F = new Falaz();
let modalObj;
const loadingSVG = "https://samherbert.net/svg-loaders/svg-loaders/puff.svg";
const debug = false;
const c = (...e) => {
    if (debug) {
        console.log(e);
    }
}

(function () {
    "use strict";
    modalObj = new Modal(document, dp);
    if (debug) {
        document.title = 'New Tab'
    }
    // @ts-ignore
    document.modalObj = modalObj;
    F.qa(".content .thumb").forEach((element) => {
        modalObj.infinityScroll.clickFunction(element);
    });
    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowRight") {
            modalObj.nextMedia();
            modalObj.scrollIntoCurrentMedia();
        } else if (e.key == "ArrowLeft") {
            modalObj.prevMedia();
            modalObj.scrollIntoCurrentMedia();
        } else if (e.key == "Escape") {
            modalObj.close();
        }
    });
    // @ts-ignore
    document.addEventListener("scroll", (e) => {
        if (!modalObj.visible) {
            const inner = window.innerHeight;
            if (
                window.scrollY + inner >
                document.documentElement.scrollHeight - inner * 2
            ) {
                modalObj.getNextPage();
            }
        } else {
            e.preventDefault();
            modalObj.scrollIntoCurrentMedia();
        }
    });

    // queryAsync(".awesomplete input").then(inputEl => {
    //     if (!inputEl.value.includes("-ai_generated")) {
    //         setTimeout(() => {
    //             inputEl.value = inputEl.value += " -ai_generated";
    //             queryAsync("input[type=submit]").then(btnEl => btnEl.click());
    //         }, 500);
    //     }
    // });

})();

/**
 * 类似于querySelector, 但是异步, 并且不会报错, 不会导致脚本停止执行
 * like querySelector, but async, and never throw error to causes the script to stop executing
 * @param selector
 *  选择器, 和querySelector的参数一致
 *  selector, same to the param of querySelector
 * @param timeout
 *  timeout 为-1时 无限查询并等待
 *  If timeout is -1, query indefinitely and wait
 * @param onError
 *  回调函数, 在查找不到时执行
 *  callback function, it will be called when the query fails
 * @param isBlocking
 *  在查询失败时, 是否保持Promise为pending状态, 默认为false
 *  whether to keep the Promise in pending state when a query fails. The default is false
 * @returns {Promise<unknown>}
 */
function queryAsync(selector, timeout = 1000, onError = null, isBlocking = false) {
    let errEl = document.body.errEl;

    if (errEl === undefined) {
        errEl = document.createElement('div');
        errEl.classList.add('no-found');
        errEl.remove = () => {};

        document.body.errEl = errEl;
    }


    // 这里不用reject是担心脚本报错后, 终止运行
    // We don't use reject because it will throw error and case the script to stop executing
    return new Promise((resolve) => {
        const startTime = Date.now();

        function check() {
            const ele = document.querySelector(selector);
            if (ele !== null) {
                resolve(ele); // 找到元素，结束 Promise
                return;
            }
            if (timeout !== -1 && Date.now() - startTime > timeout) {
                if (onError !== null) {
                    onError();
                }
                if (!isBlocking) {
                    resolve(errEl);
                }
                console.warn(`$Q_Async: Timeout: Cannot find element for selector "${selector}"`);
                return;
            }

            setTimeout(check, 100);
        }

        check();
    });
}

function showToast(message) {
    let toast = document.body.toast;

    if (toast === undefined) {
        toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '55vh';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.padding = '10px 20px';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.borderRadius = '5px';
        toast.style.fontSize = '14px';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.5s ease';
        toast.style.visibility = 'hidden';
        document.body.appendChild(toast);
        document.body.toast = toast;
    }
    toast.innerText = message;

    // 显示 toast
    toast.style.opacity = '1';
    toast.style.visibility = 'visible';

    // 3秒后隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.visibility = 'hidden';
    }, 3000);
}


