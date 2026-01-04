// ==UserScript==
// @name         链接转换为图片浏览器
// @namespace    Thomaskara
// @run-at       document-end
// @version      0.9.2
// @description  在指定网页（请手动将@match后的链接修改为想要的）将所有指向图片的链接中的图片显示出来，并打开图片浏览器。另外，还额外对图片多的页面进行了优化。添加了视频预览支持。
// @author       Thomas Kara
// @match        http*://*debian10/S4f_/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js
// @resource     IMPORTED_CSS https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/426378/%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/426378/%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%99%A8.meta.js
// ==/UserScript==


// Get source code by https://robwu.nl/crxviewer/?crx=https://....

(function() {
    'use strict';
    // img-inspector
    // https://chrome.google.com/webstore/detail/img-inspector/hpogobkggapdhmfnamfnhmchcbmehokb
    // (scripts/content_script.js)
    GM_addStyle ( `
.imginspector_image {
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.33);
    cursor: pointer;
    max-height: 10vh;
    max-width: 20vh;
    max-width: 20%;
}

.imginspector_compact {
    max-width: 200px;
    max-height: 200px;
}

.imginspector_imagesonly {
    margin: 5px;
    float: left;
}

#imginspector_imgoverlay {
    position: fixed !important;
    left: 0px !important;
    top: 0px !important;
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(0, 0, 0, 0.8) !important;
    z-index: 99999990 !important;
}


#imginspector_image {
    display: block;
    left: 50%;
    top: 50%;
    position: absolute;
    background-color: black;
    border: 1px solid black;
    -webkit-box-shadow: 0px 0px 12px #000 !important;
}
    ` );

    function getLinkExtension(a) {
        var b = null;
        if (null != a) {
            a = a.toLowerCase();
            var c = a.lastIndexOf(".");
            0 < c && (b = a.substring(c + 1))
        }
        return b
    }

    function isImageLink(uri) {
        var img_exts = "bmp jpg jpeg jfif tif tiff png gif webp apng avif svg ico".split(" ");
        return uri && ((img_exts.indexOf(getLinkExtension(uri)) >= 0 ? true : false) || (uri.indexOf('imgur') > 0));
    }

    function isVideoLink(uri){
        var vid_exts = "mp4 ogg webm".split(" ");
        return uri && ((vid_exts.indexOf(getLinkExtension(uri)) >= 0 ? true : false));
    }

    function getImageLink(uri) {
        return uri + (uri.indexOf('imgur') > 0?".jpg":"");
    }

    function getPureLink(uri){
        var pure=new URL(uri);
        pure.password='';
        pure.username='';
        return pure.href;
    }

    var lnk_list = document.querySelectorAll('a');
    var className = "imginspector_image";
    // Inline images
    for (var ii in lnk_list) {
        var lnk = lnk_list[ii];
        if (lnk.classList&&!lnk.classList.contains("imginspector_done")) {
            lnk.href = getPureLink(lnk.href);
            if (isImageLink(lnk.href)) {
                var img = document.createElement('img');
                img.setAttribute('src', getImageLink(lnk.href));
                img.setAttribute('class', className);
                img.setAttribute('loading', 'lazy');
                img.setAttribute('title', lnk.href+" 点击打开图片浏览器");
                img.addEventListener('click', jumpto, false);
                //lnk.appendChild(img);
                lnk.parentElement.insertBefore(img, lnk);
            } else if (isVideoLink(lnk.href)) {
                var vid = document.createElement('video');
                vid.setAttribute('preload', "metadata");
                vid.setAttribute('height', "200");
                vid.setAttribute('width', "300");
                vid.setAttribute('controls', 'controls');
                vid.innerHTML = '<source src="'+getImageLink(lnk.href)+'#t=8" type="video/mp4">'
                lnk.parentElement.insertBefore(vid, lnk);
            }
            lnk.classList.add("imginspector_done");
        }
    }

    // Slideshow
    // https://chrome.google.com/webstore/detail/slideshow/dhfkiofcnkapfpcpcpaindoikmimefnc
    // (injected.js)
    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));

    var instance;
    var images = [];
    function jumpto(){
        var url=this.getAttribute('src');
        slideshow(url);
    }

    function getImgIndex(url, i){
        if (!url)
            return 0;
        if (i)
            return i.indexOf(getImgTag(url));
        else
            return images.indexOf(getImgTag(url));
    }

    function getImgTag(url){
        return "<img src=\"" + url + "\" style=\"background: #222; max-height: 100vh; max-width: 100%; width: 100vw; height: 98vh; display: inline-block; object-fit: contain;\" />";
    }

    function distinct(arr) {
        return arr.filter(onlyUnique);
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function initSlider(){
        //var urls = [];
        for (var i of $("img")) {
            //urls.push(i.src);
            images.push(getImgTag(i.src));
        }

        if (images.length<1000)
            images = distinct(images);
    }

    function slideshow(url){
        var fastImages=[];
        if (images.length==0)
            initSlider();
        if (images.length>250){
            var imgIndex=getImgIndex(url);
            var fastI, fastJ;
            if (imgIndex<100){
                fastI=0;
                fastJ=100;
            } else if (imgIndex>images.length-50){
                fastI=images.length-100;
                fastJ=images.length;
            } else {
                fastI=imgIndex-50;
                fastJ=imgIndex+50;
            }
            fastImages=images.slice(fastI,fastJ);
            console.log("slideshow [" + (imgIndex+1) + "]: " + (fastI+1) + ' - ' + fastJ + ' [' + images.length + ']');
            fastopen(url, fastImages);
        } else {
            var e = document.createElement('style');
            e.innerHTML = ".fancybox-content {padding: 0;}";
            document.body.appendChild(e);
            fancyopen(url, images);
        }
    }

    function fancyopen(url, images, other_window){
        description('fancyopen start', other_window);
        instance=(other_window?other_window:window).jQuery.fancybox.open(images, {
            toolbar: true,
            smallBtn: false,
            modal: false,
            idleTime: 300,
            hideOnOverlayClick: true,
            titlePosition: 'outside',
            enableEscapeButton: true,
            //animationDuration: 50,
            beforeClose: other_window?function act(){other_window.close()}:undefined,
            animationEffect: false,
            transitionDuration: 50,
            type: 'image',
        }, url?getImgIndex(url,images):0);
        description('fancyopen done', other_window);
    }

    function description(s, other_window){
        var w=(other_window?other_window:window);
        w.document.getElementsByTagName('div')[0].innerHTML='[load] '+s;
    }

    function fastopen(url, images){
        var win = window.open(".");
        win.document.write("<html><head></head><body><div>loading...0</div></body></html>");

        var e = document.createElement('script');
        e.async = false;
        e.src = "https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js";
        win.document.head.appendChild(e);

        e = document.createElement('script');
        e.async = false;
        e.src = "https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js";
        win.document.head.appendChild(e);

        e.addEventListener('load', function act(){fancyopen(url, images, win)});

        e = document.createElement('link');
        e.rel = "stylesheet";
        e.href = "https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css";
        win.document.body.appendChild(e);

        e = document.createElement('style');
        e.innerHTML = ".fancybox-content {padding: 0;}";
        win.document.body.appendChild(e);
        description('fastopen done', win);
    }
})();