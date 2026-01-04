// ==UserScript==
// @name                New Wallhaven Enhance
// @description         Some Wallhaven Enhancements, based on Wallhaven Enhance

// @author              Gadgetsan
// @namespace           https://github.com/gadgetsan
// @homepageURL         https://github.com/gadgetsan
// @supportURL          https://github.com/gadgetsan
// @icon                https://alpha.wallhaven.cc/favicon.ico
// @license             GPL-3.0

// require             https://cdn.staticfile.org/lightgallery/1.6.12/css/lightgallery.min.css
// require             https://cdn.staticfile.org/lightgallery/1.6.12/js/lightgallery-all.min.js
// @include             https://wallhaven.cc/*
// @grant               none
// @run-at              document-end

// @date                05/02/2017
// @modified            2021-01-13
// @version             2.3
// @downloadURL https://update.greasyfork.org/scripts/420150/New%20Wallhaven%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/420150/New%20Wallhaven%20Enhance.meta.js
// ==/UserScript==


function forceDownload(url, fileName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

{
    class Pic {
        constructor(elem, wallhavenScript) {
            this.elem = elem;
            this.wallhavenScript = wallhavenScript;

            const $pic = $(elem);

            this.favs = parseInt( $pic.find('.wall-favs')[0].innerHTML );
            this.seen = $pic.find('figure').hasClass('thumb-seen');
            this.id = $pic.find('figure').data('wallpaper-id');
            this.isPNG = ($pic.find('span.png').length > 0);
            var flder = this.id.substring(0,2);

            this.picUrl = `https://w.wallhaven.cc/full/${flder}/wallhaven-${this.id}.jpg`;
            this.name = this.id +'.jpg';
            if(this.isPNG)
                this.picUrl = this.picUrl.replace('.jpg', '.png');
                this.name = this.name.replace('.jpg', '.png');
        }

        addDownload() {
            let dlDom = $(`<a class="jsDownload" href="javascript:;"> <i class="fa fa-fw fa-cloud-download"></i></a>`)[0];
            dlDom.onclick = this.download.bind(this);
            $(this.elem).find('.thumb-info').append(dlDom);
        }

        download() {
            let aDom = document.createElement('a');
            aDom.href = this.picUrl;
            aDom.target = '_blank';
            aDom.download = "download";
            forceDownload(this.picUrl, this.name);
            //aDom.click();
        }

        initGallery() {
            let $pic = $(this.elem).find('figure');

            $pic.data('data-src', this.picUrl)
                .data('data-sub-html-url', 'https://wallhaven.cc/w/'+this.id );

            $pic.click( this.showGallery );
        }

        showGallery(e) {
            return false;
        }
    }


    class WallhavenScript {
        constructor() {

            this.download = true;

            this.gallery = true;

            this.maxView = true;

            this.isLogined = ($('#userpanel > a > span.username').length > 0)
        }

        workList() {
            this.workListMain();
            new MutationObserver( this.workListMain.bind(this) ).observe(document.body, {
                attributes: false,
                childList: true,
                subtree: true
            });
        }

        workListMain() {
            let pics = this.getPics();
            let newPics = this.filterNewPics(pics);

            for(let pic of newPics) {
                if(this.download)
                    pic.addDownload();

                // Gallery
                if(this.gallery)
                    pic.initGallery();
            }

            this.pics = pics;
        }

        workSingle() {

            if(this.maxView) {
                $('#header, #searchbar').hide('fast');
                $('#showcase-sidebar').animate({top:0}, 'fast');
                $('#main').animate({borderTopWidth:0}, 'fast');
                $('#wallpaper').animate({maxWidth:'99%', maxHight:'99%'}, 'fast');
            }
        }

        getPics() {
            let elems = $('.thumb-listing-page li');
            let ret = [];

            for(let elem of elems)
                ret.push( new Pic(elem, this) );

            return ret;
        }

        filterNewPics(pics) {
            let ret = [];
            const oldElems = this.pics.map(pic=>pic.elem);

            return pics.filter( pic => {
                return (oldElems.indexOf(pic.elem) < 0);
            });
        }


        run() {
            if(location.pathname.indexOf('/w/')==0)
                return this.workSingle();


            this.pics = [];
            return this.workList();
        }

    }


    new WallhavenScript().run();

}

;(function(){

    const loadScript = () => {
        return new Promise(resolve => {
            var script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js';
            document.head.appendChild(script2);
            script2.onload = () => resolve();
        })
    }
    const loadStylesheet = () => {
        return new Promise(resolve => {
            var style1 = document.createElement('link');
            style1.rel = 'stylesheet';
            style1.href = 'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css';
            document.head.appendChild(style1);
            style1.onload = () => resolve();
        })
    }

    async function loadFancybox(params) {
        await loadScript();
        await loadStylesheet();
        return 'fancybox done.';
    }

    const callFancyBox = () => {
        loadFancybox().then(res => {
            let walllist = document.querySelectorAll('.thumbs-container ul li');

            for (const [key, element] of Object.entries(walllist)) {
                let preview = element.querySelector('.preview'),
                    thumbInfo = element.querySelector('.thumb-info span.png') ? 'png' : 'jpg';

                if(preview.getAttribute('data-href')) continue;
                // 5wq8x8
                let wallId = /wallhaven\.cc\/w\/(\w{6})/.exec(preview.href)[1];
                // https://w.wallhaven.cc/full/5w/wallhaven-5wq8x8.jpg
                let pathId = wallId.substring(0, 2);
                preview.setAttribute('data-href', preview.href);
                preview.setAttribute('data-fancybox', 'gallery');
                preview.href = `https://w.wallhaven.cc/full/${pathId}/wallhaven-${wallId}.${thumbInfo}`;
            }

            $('body').on('click', '[data-fancybox-download]', function(e) {
                var url = $(event.target).parent()[0].href;
                var fileName=url.substr(url.lastIndexOf('/') + 1);
                forceDownload(url, fileName.replace('wallhaven-', ''));
                event.preventDefault();
                //console.log();
                //window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(window.location.href)+"&t="+encodeURIComponent(document.title), '','left=0,top=0,width=600,height=300,menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
            });

            $('[data-fancybox="gallery"]').fancybox({
                // loop: true,
                buttons: [
                    "zoom",
                    "share",
                    "slideShow",
                    "fullScreen",
                    "download",
                    "thumbs",
                    "close"
                ],
                thumbs: {
                    autoStart: true
                }
            });
        })
    }

    callFancyBox();
    let observer = new MutationObserver(mutationRecords => {
        if(mutationRecords[0].addedNodes.length && mutationRecords[0].addedNodes[0].className == 'thumb-listing-page') {
            callFancyBox();
            console.log(mutationRecords);
        }
    });

    observer.observe(document.querySelector('.thumbs-container'), {
        childList: true,
        characterDataOldValue: true
    });

})()


//end userScript
