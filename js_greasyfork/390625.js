// ==UserScript==
// @name         Modal Image in rule
// @namespace    http://tampermonkey.net/
// @version      6.4
// @description  Add a modal image and thumbnails vertical-carrousel to rule34
// @author       falaz
// @match        https://rule34.xxx/index.php?page=po*
// @icon         https://www.google.com/s2/favicons?domain=rule34.xxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390625/Modal%20Image%20in%20rule.user.js
// @updateURL https://update.greasyfork.org/scripts/390625/Modal%20Image%20in%20rule.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
// @ts-check
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
    this.medias = this.infinityScroll.getMedias(document, 0);
    this.thumbsGallery = new ThumbsGallery(this.medias);
    this.createModalNode(document, this.thumbsGallery.render());
    this.bodyParent = F.q('body');
    this.visible = false;
  }
createConfigBar(){
    return `<div id="menuModal" style="display: flex;">
    <div><input type="checkbox" id="night">Night Theme</div>
    <div><input type="checkbox" id="night">Only videos</div></div>`
}
  createModalNode(document, extraDiv=null) {
    const div = document.createElement("div");
    const css = document.createElement("style");
    div.innerHTML =
      `<div id="modal-container" style="display:none"><div id="modal"></div>${extraDiv?extraDiv:''}${this.createButtons()}</div>`;
    css.innerHTML =
      "#modal-container{background: #000000a8;width: 100%;height: 100%;position: fixed;z-index: 10;}" +
      "#modal{height: 90%;width: 80%;background: transparent;padding: 0% 5%;margin: 2% 5% 2% 0;position: fixed}" +
      "#modal img{width: auto;border: none;vertical-align: middle;height: 100%;margin: 0 auto;display:block;}" +
      "#modal video{width: 100%;height:100%}"+
      "#modal-container #thumbGallery{float:right;overflow-y: scroll;height: 900px;} #modal-container #thumbGallery ul{list-style:none}"+
      "#modal-container .gallery-item{cursor: pointer;}"+
      '#navigationModal{margin-bottom: 0px;font-size: 20px;color: white;display: flex;justify-content: center;bottom: 0px;width: 100%; position:absolute}'+
      '#navigationModal svg:hover g g {fill: white;}'+
      '.fluid_video_wrapper video{cursor:default!important}'+
      '@media (max-width: 1024px) {#thumbGallery {display: none;} #modal{width:100%;padding:0%;overflow-x:scroll}}';
    if(debug){
        css.innerHTML+= "img,video{filter:blur(30px)}";
    }
    document.body.prepend(div);
    document.head.prepend(css);
    this.modalContainer = F.q("#modal-container");
    this.modal = F.q("#modal");
    this.infinityScroll.nextPage =this.infinityScroll.getNextPageHref(document);
  }
  createButtons(){
    return `<div id="navigationModal"">
            <div onclick={document.modalObj.prevMedia()}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="52" height="52" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#1abc9c"><path d="M125.69231,19.84615h-79.38462c-14.54868,0 -26.46154,11.91286 -26.46154,26.46154v79.38462c0,14.54868 11.91286,26.46154 26.46154,26.46154h79.38462c14.54868,0 26.46154,-11.91286 26.46154,-26.46154v-79.38462c0,-14.54868 -11.91286,-26.46154 -26.46154,-26.46154zM112.46154,59.53846l-47.6256,26.46154l47.6256,26.46154v13.23077l-59.53846,-33.07692v-13.23077l59.53846,-33.07692z"></path></g></g></svg></div>
            <div onclick={document.modalObj.nextMedia()}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="52" height="52" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#1abc9c"><path d="M125.69231,19.84615h-79.38462c-14.54868,0 -26.46154,11.91286 -26.46154,26.46154v79.38462c0,14.54868 11.91286,26.46154 26.46154,26.46154h79.38462c14.54868,0 26.46154,-11.91286 26.46154,-26.46154v-79.38462c0,-14.54868 -11.91286,-26.46154 -26.46154,-26.46154zM119.07692,92.61538l-59.53846,33.07692v-13.23077l47.6256,-26.46154l-47.6256,-26.46154v-13.23077l59.53846,33.07692z"></path></g></g></svg></div>
            <div onclick={document.modalObj.close()}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g id="original-icon" fill="#1abc9c"><path d="M86,17.2c-37.9948,0 -68.8,30.8052 -68.8,68.8c0,37.9948 30.8052,68.8 68.8,68.8c37.9948,0 68.8,-30.8052 68.8,-68.8c0,-37.9948 -30.8052,-68.8 -68.8,-68.8zM112.9868,104.87987c2.24173,2.24173 2.24173,5.8652 0,8.10693c-1.118,1.118 -2.58573,1.67987 -4.05347,1.67987c-1.46773,0 -2.93547,-0.56187 -4.05347,-1.67987l-18.87987,-18.87987l-18.87987,18.87987c-1.118,1.118 -2.58573,1.67987 -4.05347,1.67987c-1.46773,0 -2.93547,-0.56187 -4.05347,-1.67987c-2.24173,-2.24173 -2.24173,-5.8652 0,-8.10693l18.87987,-18.87987l-18.87987,-18.87987c-2.24173,-2.24173 -2.24173,-5.8652 0,-8.10693c2.24173,-2.24173 5.8652,-2.24173 8.10693,0l18.87987,18.87987l18.87987,-18.87987c2.24173,-2.24173 5.8652,-2.24173 8.10693,0c2.24173,2.24173 2.24173,5.8652 0,8.10693l-18.87987,18.87987z"></path></g></g></svg></div>
            </div>`
  }
  /**
   * @param {Media} media
   */
  async render(media) {
    if (!this.modalContainer) {
      this.createModalNode(document,this.thumbsGallery.render());
    }
    if (media.src == "Retry") {
      await this.reloadMediaSrc(media);
    }
    if (media.type == "video") {
      this.modal.innerHTML = `<video src="${media.src}" ${debug?'':"autoplay"} controls loop id="modalVideo"></video>`;
      F.q('#modalVideo').volume = this.getCurrentVolume();
      F.q('#modalVideo').onvolumechange = e=>this.saveCurrentVolume(e.target.volume);
        fluidPlayer(document.querySelector('#modal video'),{
            layoutControls:{
                autoPlay:true,
                allowDownload:true,
                loop:true,
                fillToContainer: true
            }
        })
     F.q('#modal video').loop = true
    } else {
      this.modal.innerHTML = `<img src="${media.src}"/>`;
    }
    this.modalContainer.style.display = "block";
    this.visible = true;
    this.toggleBodyScroll(false);
    modalObj.scrollIntoCurrentMedia();
  }

  toggleBodyScroll(visible){
      this.bodyParent.style.overflow = visible?'inherit':'hidden';
  }

  getCurrentVolume(){
    return localStorage.volume? localStorage.volume: 0.0;
  }
  /**
   * Attach to event video.onvolumechange
   * @param {number} value
   */
  saveCurrentVolume(value){
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
      }else{
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
    } catch (e) {}
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
  goToMedia(index){
    if(index<this.medias.length-1){
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
  getCurrentMedia(){
    this.medias[this.pointer];
  }
  getCurrentThumb(){
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
  scrollIntoCurrentMedia(){
      c('fired')
    this.getCurrentThumb().scrollIntoView();
    this.thumbsGallery.scrollToThumb(modalObj.pointer)
  }
}
class Media {
  /**
   * @param {string} _page This is the page of the media. Not the real src.
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
    if (!this.nextPage) {
      // @ts-ignore
      this.nextPage = F.q('#paginator [alt="next"]').href;
    }
    const response = await fetch(this.nextPage);
    if([204,202,200,201].includes(response.status)){
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
    }else{
        await this.sleep(500);
        return await this.getNextPage();
    }
  }
  sleep(ms){
      return new Promise(resolve=>setTimeout(resolve,ms));
  }
  /**
   *
   * @param {Document} document
   * @param {number} pad The length of medias in the Modal Object
   * @returns {Media[]}
   */
  getMedias(document, pad) {
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
  clickFunction(element){
    element.addEventListener("click", (e) => {
        e.preventDefault();
        const index = e.target.dataset.index
          ? e.target.dataset.index
          : modalObj.pointer;
        modalObj.pointer = index;
        modalObj.render(modalObj.medias[index]);
      });
  }
}
class ThumbsGallery{
  /**
   * @param {Media[]} medias
   */
  constructor(medias){
    this.medias = medias;
  }
  /**
   * @param {number} index
   */
  scrollToThumb(index){
      F.q(`.gallery-item[data-index="${index}"]`).scrollIntoView();
  }
  /**
   * @param {Media[]} medias
   */
  updateMedias(medias){
    this.medias = medias;
    F.q('#thumbGallery').innerHTML = `<ul>${this.buildItems()}</ul>`;
  }
  render(){
    return `<div id="thumbGallery"><ul>${this.buildItems()}</ul></div>`
  }
  buildItems(){
    let li = ''
    this.medias.forEach((e,i)=>{
      li+=`<li class="gallery-item" data-index="${i}" onclick="{document.modalObj.goToMedia(${i})}","_blank")}">
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
const c = (...e)=>{
    if(debug){
        console.log(e);
    }
}

(function () {
  "use strict";
  modalObj = new Modal(document, dp);
    if(debug){document.title = 'New Tab'}
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
    if (!modalObj.visible){
      const inner = window.innerHeight;
      if (
        window.scrollY + inner >
        document.documentElement.scrollHeight - inner * 2
      ) {
        modalObj.getNextPage();
      }
    }else{
      e.preventDefault();
      modalObj.scrollIntoCurrentMedia();
    }
  });
})();
