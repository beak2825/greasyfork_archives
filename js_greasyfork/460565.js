// ==UserScript==
// @name         Fap sites images lazy load & lightbox
// @namespace    https://gist.github.com/iChickn/6f270b0a9854e87bf297246c728fb877/raw
// @version      0.0.9
// @description  Fapello, Fapachi sites images lazy load & lightbox
// @author       [K]
// @match        https://fapello.com/*
// @match        https://fapachi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fapello.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.13.0/simple-lightbox.jquery.js
// @resource     LIGHTBOX_CSS https://raw.githubusercontent.com/andreknieriem/simplelightbox/master/dist/simple-lightbox.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460565/Fap%20sites%20images%20lazy%20load%20%20lightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/460565/Fap%20sites%20images%20lazy%20load%20%20lightbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const lightboxCss = GM_getResourceText("LIGHTBOX_CSS");
    GM_addStyle(lightboxCss);

    const default_option = {
        sourceAttr: "data-src",
        overlay: true,
        overlayOpacity: 0.7,
        spinner: true,
        nav: true,
        navText: ["&lsaquo;", "&rsaquo;"],
        captions: false,
        captionSelector: function () { return '';},
        close: true,
        closeText: "&times;",
        swipeClose: true,
        showCounter: true,
        fileExt: "png|jpg|jpeg|gif|webp",
        animationSlide: true,
        animationSpeed: 50,
        preloading: true,
        enableKeyboard: true,
        loop: true,
        rel: false,
        docClose: true,
        swipeTolerance: 50,
        className: "simple-lightbox",
        widthRatio: 1,
        heightRatio: 1,
        scaleImageToRatio: false,
        disableRightClick: false,
        disableScroll: true,
        alertError: true,
        alertErrorMessage: "Image not found, next image will be loaded",
        additionalHtml: false,
        history: true,
        throttleInterval: 0,
        doubleTapZoom: 2,
        maxZoom: 10,
        htmlClass: "has-lightbox",
        rtl: false,
        fixedClass: "sl-fixed",
        fadeSpeed: 100,
        uniqueImages: true,
        focus: true,
        scrollZoom: true,
        scrollZoomFactor: 0.5,
        download: false
    };

    var _divs = [];
    var _imgs = [];
    var _model;
    var _max;
    var _data_max;
    var _img_class = "";
    var _div1_class = "";
    var _div2_class = "";
    var $content;
    const is_fapachi = location.host === 'fapachi.com';
    const is_fapello = location.host === 'fapello.com';

    if (is_fapachi) {
        let _href = $(".container .model-media-prew > a").first().attr("href");
        if (!_href) return;
        _model = _href.split("/")[1];
        _max = _href.split("/")[3];
        _div1_class = `col-6 col-md-4 my-2 model-media-prew`;
        _img_class = "lazyload";

        $content = $(".container > .row:nth-child(2)");

        $(".next-page-btn").remove();

        $(document).off('click', '**');
    } else if (is_fapello) {
        let _href = $("#content > div > a").first().attr("href");
        if (!_href) return;
        _model = _href.split("/")[3];
        _max = _href.split("/")[4];
        if (!_max) return;
        _img_class = "w-full h-full absolute object-cover inset-0 lazyload";
        // _div1_class = `col-6 col-md-4 my-2 model-media-prew`;
        _div1_class = `max-w-full lg:h-64 h-40 rounded-md relative overflow-hidden uk-transition-toggle`;

        $content = $("#content");

        $("#showmore").remove();
        $("#next_page").remove();

        $(window).off('scroll', '**');
        scrollMore = () => {};
    } else {
        return;
    }

    $content.empty();
    _data_max = parseInt(_max);

    // add images to main container
    for (; _data_max > 0; _data_max--) {
        let _padded = _data_max.toString().padStart(Math.max(_max.length, 4), '0');
        let _in_range = Math.floor(_data_max / 1000) + 1;
        let _img_src;

        if (is_fapachi) {
            _img_src = `${location.origin}/models/${_model[0]}/${_model[1]}/${_model}/${_in_range}/full/${_model}_${_padded}.jpeg`;
        } else if (is_fapello) {
            _img_src = `${location.origin}/content/${_model[0]}/${_model[1]}/${_model}/${_in_range}000/${_model}_${_padded}.jpg`;
        }


        let _img = document.createElement("img");
        _img_class && (_img.className = _img_class);
        // _img.loading = "lazy";
        // _img.src = _img_src;
        _img.setAttribute('data-src', _img_src);
        _imgs.push(_img);

        let _div2;
        if (is_fapello) {
            _div2 = document.createElement("div");
            _div2.className = _div2_class;
            _div2.appendChild(_img);

            // _img.className = _div2_class;
        }


        let _a = document.createElement("a");
        // https://fapello.com/alina-becker/5163/
        // https://fapachi.com/misswarmj-10/media/0293
        if (is_fapachi) {
            _a.href = `${location.origin}/${_model}/media/${_padded}/`;
        } else if (is_fapello) {
            _a.href = `${location.origin}/${_model}/${_data_max}/`;
        }
        
        _a.appendChild(is_fapello ? _img : _img);


        let _div = document.createElement("div");
        _div.className = _div1_class;
        _div.appendChild(_a);

        _divs.push(_div);
    }

    $content.append(_divs);

    $(_imgs).simpleLightbox(default_option);
})();