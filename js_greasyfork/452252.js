// ==UserScript==
// @name         Viewer on Rule34Paheal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a modal viewer to the main page. With infinity scroll.
// @author       Falaz
// @match        *://rule34.paheal.net/post/list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paheal.net
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452252/Viewer%20on%20Rule34Paheal.user.js
// @updateURL https://update.greasyfork.org/scripts/452252/Viewer%20on%20Rule34Paheal.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

class CssModal{
    constructor(){
        this.css = `
            ${document.debug?'img, video {filter: brightness(0.0);}':''}
            BODY, #header,FOOTER{
             background:#222!important
            }
            SECTION>H3,SECTION>.blockbody, .comment, .setupblock,#menuh a{
             background:#333!important;
             border: 1px solid #000!important;
            }
            #modal-container{
              width: 100%;
              height: 100%;
              position: fixed;
              display: block;
              background: #000000b0;
              z-index: 1;
            }
            .hidden{
              display: none!important;
            }
            #media-container{
               height:100%;
               justify-content: center;
               display: flex;
               align-items: center;
            }
            #modal-container #modal{
               width: 80%;
               height: 100%;
               display: flex;
               align-content: center;
               justify-content: center;
               align-items: center;
            }
            #modal-container #imgContainer{
              width: auto;
              height: auto;
              max-height: 100%;
            }
            #modal-container button {
              background: #40bf40;
              font-size: 14px;
              padding: 10px 15px;
              border: none;
              border-radius: 7px;
              font-weight: bold;
              position: absolute;
              right: 20%;
              z-index: 1;
            }
            #modal-container button:hover {
              background: #89e989;
            }
            #modal-container button:active{
              background: #2c892c;
            }
            #modal-container #close {
              top: 10px;
            }
            #modal-container #left{
              top: 46px;
            }
            #modal-container #right{
              top: 79px
            }
            #modal-container #loading{
              top: 120px;
              right: 20%;
              position: fixed;
            }
            #modal-container video, #modal-container .fluid_video_wrapper,.media-container{
              width: auto;
              height: auto;
              max-width: 95%;
              max-height: 95%;
              padding: 10px;
            }
            `;
        const cssTag = document.createElement('style');
        cssTag.innerHTML = this.css;
        document.head.prepend(cssTag);
    }
}
class Page{
    constructor(num,doc,_modal=null){
        this.num = num;
        this.document = doc;
        this.modal = _modal? _modal.addNewMedias(this.getElements()):new Modal(this.getElements());
    }
    getElements(){
        return this.document.querySelectorAll('.shm-image-list div')
    }
    addEventListenersToImages(elements = this.getElements()){
        for(const node of elements){
            node.addEventListener('click',e=>{
                e.preventDefault();
                console.log('click');
                this.modal.render(node.dataset.postId)
            });
        }
    }

}

class Modal{
    constructor(mediasNode){
        this.active = false;
        /**@type {Media} */
        this.medias = [];
        this.populateMedias(mediasNode);
        this.container = this.initEmptyContainer();
        this.renderedMedia = null;
        this.loading= this.container.querySelector('#loading');

    }
    initEmptyContainer(){
        const div = document.createElement('div');
        div.id = "modal-container";
        div.classList.add('hidden');
        const buttons = `<button id="close" onClick="document.modal.closeModal()">X</button><button id="left" onClick="document.modal.prevMedia()">&lt;</button><button id="right" onClick="document.modal.nextMedia()">&gt;</button>
        <img id="loading" class="hidden" src="https://samherbert.net/svg-loaders/svg-loaders/oval.svg">`
        div.innerHTML = `<div id="modal"><div>${buttons}</div><div id="media-container"></div></div>`
        document.body.prepend(div);
        return div;
    }
    createImageContainer(){
        this.container.querySelector('#media-container').innerHTML = `<img id="imgContainer"></img>`
    }
    createVideoContainer(){
        this.container.querySelector('#media-container').innerHTML = `<video id="videoContainer" controls loop autoplay ></video>`;
    }
    render(postId){
        const [media] = this.medias.filter(e=>e.index==postId)
        if(media){
            this.renderModal(media)
        }
    }
    renderModal(media){
        this.active = true;
        this.container.classList.remove('hidden');
        this.renderedMedia = media;
        if(media.type == 'video'){
            this.createVideoContainer();
            this.videoContainer = this.container.querySelector('#videoContainer');
            this.videoContainer.src = media.src;
            this.videoContainer.volume = 0;
            this.videoContainer.mute = document.debug;
            fluidPlayer(this.videoContainer,{layoutControls:{autoPlay:true, allowDownload:true,loop:true,doubleclickFullscreen:false, mute: document.debug, fillToContainer:true}})
        }else{
            this.createImageContainer();
            this.imgContainer = this.container.querySelector('#imgContainer');
            this.loading.classList.remove('hidden');

            this.imgContainer.src = media.src;
            this.imgContainer.onload = ()=>this.loading.classList.add('hidden');
        }
    }
    closeModal(){
        this.active = false;
        this.container.classList.add('hidden');
    }
    nextMedia(){
        const i = this.medias.indexOf(this.renderedMedia)
        if(i>this.medias.length-3){
            document.infinity.fillNextPage()
        }else{
            this.renderModal(this.medias[i+1])
        }
    }
    prevMedia(){
        const i = this.medias.indexOf(this.renderedMedia)
        if(i>0){
            this.renderModal(this.medias[i-1])
        }else{
            this.renderModal(this.medias[this.medias.length-1])
        }
    }
    populateMedias(mediasNode){
        for(const node of mediasNode){
            const media = new Media(
                node.querySelector('a:last-of-type').href,
                ['mp4','webm'].includes(node.dataset.ext)?'video':'image',
                node.dataset.ext,
                node.querySelector('img').src,
                node.dataset.postId
            )
            this.medias.push(media);
        }
    }
    addNewMedias(medias){
        this.populateMedias(medias);
        this.addNewMediasToCurrentPage(medias);
        return this;
    }
    addNewMediasToCurrentPage(medias){
        for(const node of medias){
            document.querySelector('.shm-image-list ').appendChild(node);
        }
    }
}
class Media{
    constructor(src, type,ext, thumb,index){
        this.src = src;
        this.type = type;
        this.ext = ext;
        this.thumb = thumb;
        this.index = index;
    }
}

class InfinityScroll{
    constructor(doc,page,modal){
        this.doc = doc;
        this.page = page;
        this.modal = modal;
        this.last = this.getLastNode(this.doc);
        this.next = this.getNextNode(this.doc);
        this.triggered = false;
    }
    getNextNode(doc){
        const [next] = Array.from(doc.querySelector('#paginator .blockbody').querySelectorAll('a')).filter(e=>e.text=='Next')
        return next;
    }
    getLastNode(doc){
        const [last] = Array.from(doc.querySelector('#paginator .blockbody').querySelectorAll('a')).filter(e=>e.text=='Last')
        return last;
    }
    async fillNextPage(){
        if(!this.triggered){
            this.triggered = true;
            const {page,pageDocument} = await this.getNextPage();
            this.page = new Page(page, pageDocument, this.modal);
            this.page.addEventListenersToImages(document.page.getElements());
            this.next = this.getNextNode(this.page.document);
        }
    }
    async getNextPage(){
        const nextNode = this.next;
        const page = nextNode.href.slice(-1);
        const response = await fetch(nextNode.href);
        if([200,201,202,204].includes(response.status)){
            const body = await response.text();
            const dp = new DOMParser();
            const pageDocument = dp.parseFromString(body, "text/html");
            this.triggered = false;
            return {page,pageDocument};
        }

    }
}

document.debug = false;
document.cssModal = null;
document.page = null;
document.modal = null;
document.init = ()=>{
    try{
        console.log('initialized');
        const fluidPlayer = document.createElement('script');
        fluidPlayer.src = "https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js"
        document.head.prepend(fluidPlayer);
        document.page.addEventListenersToImages();
        document.infinity = new InfinityScroll(document,document.page, document.modal);
        document.addEventListener("scroll", (e) => {
            const inner = window.innerHeight;
            /*             console.log({
                scrollY: window.scrollY,
                inner,
                scorllHeight: document.documentElement.scrollHeight,
                sum: window.scrollY + inner,
                comparative: document.documentElement.scrollHeight - inner
            }) */
            if (window.scrollY + inner >document.documentElement.scrollHeight - inner) {
                document.infinity.fillNextPage()
            }
        })
    }catch(e){
        console.error(e);
    }
}
(function() {
    try{
        const cssModal = new CssModal();
        document.cssModal = cssModal;
        document.page = new Page(1, document);
        document.modal = document.page.modal;
        //'use strict';
        //document.addEventListener('readystatechange', ()=>{
        window.addEventListener('load',()=>{
            document.init();
        })
    }catch(e){
        console.error(e);
    }
})();