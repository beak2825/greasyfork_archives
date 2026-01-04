// ==UserScript==
// @name         AssetStore Linkify
// @namespace    https://github.com/XpycT/
// @version      0.3.2
// @license      MIT
// @description  AssetStore Linkify is a user script for finding links in plain-text and converting them to HTML <a> tags.
// @homepageURL  https://github.com/XpycT/assetstore-linkify
// @supportURL   https://github.com/XpycT/assetstore-linkify/issues
// @author       XpycT
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.0.47/jquery.fancybox.min.js
// @resource     fontCss https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
// @match        *://forum.cgpersia.com/*
// @match        *://www.cgpeers.to/*
// @match        *://gfxpeers.net/*
// @match        *://leakforums.co/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @run-at       document-start
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAIAAADajyQQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTc1RUY1OEIxRUQ1MTFFNEJBMjNERUQ5QTNFNzNDMzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTc1RUY1OEMxRUQ1MTFFNEJBMjNERUQ5QTNFNzNDMzYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNzVFRjU4OTFFRDUxMUU0QkEyM0RFRDlBM0U3M0MzNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNzVFRjU4QTFFRDUxMUU0QkEyM0RFRDlBM0U3M0MzNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrgK2iMAAAaZSURBVHjaYlTSMWcY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
// @downloadURL https://update.greasyfork.org/scripts/31651/AssetStore%20Linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/31651/AssetStore%20Linkify.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $ = $ || window.$;

    const apis = {
        'head': 'https://www.assetstore.unity3d.com/api/en-US/head/package/',
        'content_overview': 'https://www.assetstore.unity3d.com/api/en-US/content/overview/',
        'price': 'https://www.assetstore.unity3d.com/api/en-US/content/price/'
    };

    /**
     * replace all assetstore text with link
     */
    function replaceTextLinks() {
        let urlRegex = /\b(https?:\/\/[^\s+\"\<\>]+)/ig;
        let snapTextElements = document.evaluate("//text()[not(ancestor::a) " +
            "and not(ancestor::script) and not(ancestor::style) and " +
            "contains(translate(., 'HTTP', 'http'), 'http') and contains(., 'assetstore.unity')]",
            document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = snapTextElements.snapshotLength - 1; i >= 0; i--) {
            let elmText = snapTextElements.snapshotItem(i);
            if (urlRegex.test(elmText.nodeValue)) {

                let elmSpan = document.createElement("div");
                elmSpan.className = "unitystore-holder";
                let sURLText = elmText.nodeValue;
                let latest = sURLText.split('/').pop().trim();
                elmSpan.dataset.id = Number.isInteger(latest) ? latest : latest.split('-').pop().trim();

                elmText.parentNode.replaceChild(elmSpan, elmText);
                urlRegex.lastIndex = 0;
                for (var match = null, lastLastIndex = 0;
                     (match = urlRegex.exec(sURLText));) {
                    elmSpan.appendChild(document.createTextNode(
                        sURLText.substring(lastLastIndex, match.index)));
                    let elmLink = document.createElement("a");
                    elmLink.className = "unitystore-link";
                    elmLink.setAttribute("href", match[0]);
                    elmLink.setAttribute("target", '_blank');
                    elmLink.appendChild(document.createTextNode(match[0]));
                    elmSpan.appendChild(elmLink);
                    lastLastIndex = urlRegex.lastIndex;
                }
                elmSpan.appendChild(document.createTextNode(
                    sURLText.substring(lastLastIndex)));
                elmSpan.normalize();
            }
        }
    }

    /**
     * prepare existing links for infobox
     */
    function appendToLinks() {
        let snapTextElements = document.evaluate("//a[contains(translate(@href, 'HTTP', 'http'), 'http') and contains(@href, 'assetstore.unity')]",
            document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = snapTextElements.snapshotLength - 1; i >= 0; i--) {
            let elmLink = snapTextElements.snapshotItem(i);
            let latest = $(elmLink).attr('href').split('/').pop().trim();
            let data_id = Number.isInteger(latest) ? latest : latest.split('-').pop().trim();
            $(elmLink).wrap(`<span class="unitystore-holder" data-id="${data_id}"></span>`);
            $(elmLink).addClass('unitystore-link');
        }
    }

    /**
     * add styles
     */
    function addStyles() {
        let fontCssSrc = GM_getResourceText("fontCss");
        fontCssSrc = fontCssSrc.replace(/\.\.\/fonts\/fontawesome-webfont/g, 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont');
        GM_addStyle(fontCssSrc);
        GM_addStyle(
            `@import url('//fonts.googleapis.com/css?family=Roboto:100,400');
            @charset "UTF-8";.fancybox-enabled{overflow:hidden}.fancybox-enabled body{overflow:visible;height:100%}.fancybox-container{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99993;-webkit-backface-visibility:hidden;backface-visibility:hidden}.fancybox-container~.fancybox-container{z-index:99992}.fancybox-bg{position:absolute;top:0;right:0;bottom:0;left:0;background:#0f0f11;opacity:0;transition-timing-function:cubic-bezier(.55,.06,.68,.19);-webkit-backface-visibility:hidden;backface-visibility:hidden}.fancybox-container--ready .fancybox-bg{opacity:.87;transition-timing-function:cubic-bezier(.22,.61,.36,1)}.fancybox-controls{position:absolute;top:0;left:0;right:0;text-align:center;opacity:0;z-index:99994;transition:opacity .2s;pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;direction:ltr}.fancybox-show-controls .fancybox-controls{opacity:1}.fancybox-infobar{display:none}.fancybox-show-infobar .fancybox-infobar{display:inline-block;pointer-events:all}.fancybox-infobar__body{display:inline-block;width:70px;line-height:44px;font-size:13px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;text-align:center;color:#ddd;background-color:rgba(30,30,30,.7);pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:subpixel-antialiased}.fancybox-buttons{position:absolute;top:0;right:0;display:none;pointer-events:all}.fancybox-show-buttons .fancybox-buttons{display:block}.fancybox-slider-wrap{overflow:hidden;direction:ltr}.fancybox-slider,.fancybox-slider-wrap{position:absolute;top:0;left:0;bottom:0;right:0;padding:0;margin:0;z-index:99993;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-tap-highlight-color:transparent}.fancybox-slide{position:absolute;top:0;left:0;width:100%;height:100%;margin:0;padding:0;overflow:auto;outline:none;white-space:normal;box-sizing:border-box;text-align:center;z-index:99994;-webkit-overflow-scrolling:touch}.fancybox-slide:before{content:"";height:100%;width:0}.fancybox-slide:before,.fancybox-slide>*{display:inline-block;vertical-align:middle}.fancybox-slide>*{position:relative;padding:24px;margin:44px 0;border-width:0;text-align:left;background-color:#fff;overflow:auto;box-sizing:border-box}.fancybox-slide--image{overflow:hidden}.fancybox-slide--image:before{display:none}.fancybox-content{display:inline-block;position:relative;margin:44px auto;padding:0;border:0;width:80%;height:calc(100% - 88px);vertical-align:middle;line-height:normal;text-align:left;white-space:normal;outline:none;font-size:16px;font-family:Arial,sans-serif;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-overflow-scrolling:touch}.fancybox-iframe{display:block;margin:0;padding:0;border:0;width:100%;height:100%;background:#fff}.fancybox-slide--video .fancybox-content,.fancybox-slide--video .fancybox-iframe{background:transparent}.fancybox-placeholder{z-index:99995;background:transparent;cursor:default;overflow:visible;-webkit-transform-origin:top left;transform-origin:top left;background-size:100% 100%;background-repeat:no-repeat;-webkit-backface-visibility:hidden;backface-visibility:hidden}.fancybox-image,.fancybox-placeholder,.fancybox-spaceball{position:absolute;top:0;left:0;margin:0;padding:0;border:0}.fancybox-image,.fancybox-spaceball{width:100%;height:100%;max-width:none;max-height:none;background:transparent;background-size:100% 100%}.fancybox-controls--canzoomOut .fancybox-placeholder{cursor:zoom-out}.fancybox-controls--canzoomIn .fancybox-placeholder{cursor:zoom-in}.fancybox-controls--canGrab .fancybox-placeholder{cursor:-webkit-grab;cursor:grab}.fancybox-controls--isGrabbing .fancybox-placeholder{cursor:-webkit-grabbing;cursor:grabbing}.fancybox-spaceball{z-index:1}.fancybox-tmp{position:absolute;top:-9999px;left:-9999px;visibility:hidden}.fancybox-error{position:absolute;margin:0;padding:40px;top:50%;left:50%;width:380px;max-width:100%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background:#fff;cursor:default}.fancybox-error p{margin:0;padding:0;color:#444;font:16px/20px Helvetica Neue,Helvetica,Arial,sans-serif}.fancybox-close-small{position:absolute;top:0;right:0;width:44px;height:44px;padding:0;margin:0;border:0;border-radius:0;outline:none;background:transparent;z-index:10;cursor:pointer}.fancybox-close-small:after{content:"×";position:absolute;top:5px;right:5px;width:30px;height:30px;font:20px/30px Arial,Helvetica Neue,Helvetica,sans-serif;color:#888;font-weight:300;text-align:center;border-radius:50%;border-width:0;background:#fff;transition:background .2s;box-sizing:border-box;z-index:2}.fancybox-close-small:focus:after{outline:1px dotted #888}.fancybox-slide--video .fancybox-close-small{top:-36px;right:-36px;background:transparent}.fancybox-close-small:hover:after{color:#555;background:#eee}.fancybox-caption-wrap{position:absolute;bottom:0;left:0;right:0;padding:60px 30px 0;z-index:99998;-webkit-backface-visibility:hidden;backface-visibility:hidden;box-sizing:border-box;background:linear-gradient(180deg,transparent 0,rgba(0,0,0,.1) 20%,rgba(0,0,0,.2) 40%,rgba(0,0,0,.6) 80%,rgba(0,0,0,.8));opacity:0;transition:opacity .2s;pointer-events:none}.fancybox-show-caption .fancybox-caption-wrap{opacity:1}.fancybox-caption{padding:30px 0;border-top:1px solid hsla(0,0%,100%,.4);font-size:14px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;color:#fff;line-height:20px;-webkit-text-size-adjust:none}.fancybox-caption a,.fancybox-caption button{pointer-events:all}.fancybox-caption a{color:#fff;text-decoration:underline}.fancybox-button{display:inline-block;position:relative;width:44px;height:44px;line-height:44px;margin:0;padding:0;border:0;border-radius:0;cursor:pointer;background:transparent;color:#fff;box-sizing:border-box;vertical-align:top;outline:none}.fancybox-button--disabled{cursor:default;pointer-events:none}.fancybox-button,.fancybox-infobar__body{background:rgba(30,30,30,.6)}.fancybox-button:hover{background:rgba(0,0,0,.8)}.fancybox-button:after,.fancybox-button:before{content:"";pointer-events:none;position:absolute;border-color:#fff;background-color:currentColor;color:currentColor;opacity:.9;box-sizing:border-box;display:inline-block}.fancybox-button--disabled:after,.fancybox-button--disabled:before{opacity:.5}.fancybox-button--left:after{left:20px;-webkit-transform:rotate(-135deg);transform:rotate(-135deg)}.fancybox-button--left:after,.fancybox-button--right:after{top:18px;width:6px;height:6px;background:transparent;border-top:2px solid currentColor;border-right:2px solid currentColor}.fancybox-button--right:after{right:20px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.fancybox-button--left{border-bottom-left-radius:5px}.fancybox-button--right{border-bottom-right-radius:5px}.fancybox-button--close{float:right}.fancybox-button--close:after,.fancybox-button--close:before{content:"";display:inline-block;position:absolute;height:2px;width:16px;top:calc(50% - 1px);left:calc(50% - 8px)}.fancybox-button--close:before{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.fancybox-button--close:after{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.fancybox-loading{border:6px solid hsla(0,0%,39%,.4);border-top:6px solid hsla(0,0%,100%,.6);border-radius:100%;height:50px;width:50px;-webkit-animation:a .8s infinite linear;animation:a .8s infinite linear;background:transparent;position:absolute;top:50%;left:50%;margin-top:-25px;margin-left:-25px;z-index:99999}@-webkit-keyframes a{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes a{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@media (max-width:800px){.fancybox-controls{text-align:left}.fancybox-button--left,.fancybox-button--right,.fancybox-buttons button:not(.fancybox-button--close){display:none!important}.fancybox-caption{padding:20px 0;margin:0}}.fancybox-button--fullscreen:before{width:15px;height:11px;left:15px;top:16px;border:2px solid;background:none}.fancybox-button--play:before{top:16px;left:18px;width:0;height:0;border-top:6px inset transparent;border-bottom:6px inset transparent;border-left:10px solid;border-radius:1px;background:transparent}.fancybox-button--pause:before{top:16px;left:18px;width:7px;height:11px;border-style:solid;border-width:0 2px;background:transparent}.fancybox-button--thumbs span{font-size:23px}.fancybox-button--thumbs:before{top:20px;left:21px;width:3px;height:3px;box-shadow:0 -4px 0,-4px -4px 0,4px -4px 0,inset 0 0 0 32px,-4px 0 0,4px 0 0,0 4px 0,-4px 4px 0,4px 4px 0}.fancybox-container--thumbs .fancybox-caption-wrap,.fancybox-container--thumbs .fancybox-controls,.fancybox-container--thumbs .fancybox-slider-wrap{right:220px}.fancybox-thumbs{position:absolute;top:0;right:0;bottom:0;left:auto;width:220px;margin:0;padding:5px 5px 0 0;background:#fff;z-index:99993;word-break:normal;-webkit-overflow-scrolling:touch;-webkit-tap-highlight-color:transparent;box-sizing:border-box}.fancybox-thumbs>ul{list-style:none;position:absolute;position:relative;width:100%;height:100%;margin:0;padding:0;overflow-x:hidden;overflow-y:auto;font-size:0}.fancybox-thumbs>ul>li{float:left;overflow:hidden;max-width:50%;padding:0;margin:0;width:105px;height:75px;position:relative;cursor:pointer;outline:none;border:5px solid #fff;border-top-width:0;border-right-width:0;-webkit-tap-highlight-color:transparent;-webkit-backface-visibility:hidden;backface-visibility:hidden;box-sizing:border-box}li.fancybox-thumbs-loading{background:rgba(0,0,0,.1)}.fancybox-thumbs>ul>li>img{position:absolute;top:0;left:0;min-width:100%;min-height:100%;max-width:none;max-height:none;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.fancybox-thumbs>ul>li:before{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:2px;border:4px solid #4ea7f9;z-index:99991;opacity:0;transition:all .2s cubic-bezier(.25,.46,.45,.94)}.fancybox-thumbs>ul>li.fancybox-thumbs-active:before{opacity:1}@media (max-width:800px){.fancybox-thumbs{display:none!important}.fancybox-container--thumbs .fancybox-caption-wrap,.fancybox-container--thumbs .fancybox-controls,.fancybox-container--thumbs .fancybox-slider-wrap{right:0}}
            .unitystore-holder{white-space:nowrap;}
            .unitystore-link {text-decoration: none; border-bottom: 1px dotted;}
            .unitystore-link:hover {border-bottom: 1px dotted rgba(0,0,0,0);}
            .unitystore-info-label {color: #2e2e2e; background: #8BC34A; padding: 2px 5px; border-radius: 3px; text-shadow: 1px 1px 0px white; position: relative; left: 5px; font-size: 0.8em;font-family:'Roboto',sans-serif; cursor: pointer;}
            .assetstore-shadow{z-index:999;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);}
            .assetstore-dialog.popup-holder{width:798px;height:385px;background:#222b37;position:fixed;top:calc(50% - 195px);left:calc(50% - 395px);z-index:1001;box-shadow:0 0 15px #000}
            .assetstore-dialog .popup-holder-close{position:absolute;top:0;right:0;z-index:50;width:30px;height:30px;line-height:30px;background:#222b37;border-radius:0;cursor:pointer;vertical-align:top;outline:0;padding:4px}
            .assetstore-dialog .popup-holder-content{padding:5px;position:relative;background-position:right;min-height:100%;-webkit-background-clip:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;background-repeat:no-repeat;box-sizing:border-box}
            .assetstore-dialog .popup-holder-main-info{position:absolute;top:0;bottom:0;left:0;width:250px;margin:0;overflow:auto;background-color:#222b37;padding:20px 15px 20px 20px}
            .assetstore-dialog .overview-text-overlay{color:#fff;font-family:'Roboto',sans-serif;font-size:12px}
            .assetstore-dialog .overview-text-overlay h1{font-family:'Roboto',sans-serif;font-size:28px;line-height:32px;font-weight:100;margin:0;overflow:hidden;text-overflow:ellipsis}
            .assetstore-dialog .overview-text-overlay .details-container{font-family:'Roboto',sans-serif;padding:0;position:relative;white-space:nowrap;font-size:16px;line-height:24px}
            .assetstore-dialog .overview-text-overlay .details-container .asset-rating.rated{font-size:12px;}
            .assetstore-dialog .overview-text-overlay .details-container .asset-rating.unrated{font-weight: 100; font-size: 12px;}
            .assetstore-dialog .overview-text-overlay .details-container .asset-price{margin-top:5px;font-weight:400;color:#8ac249}
            .assetstore-dialog .overview-text-overlay span{font-weight:100;display:block;overflow:hidden;text-overflow:ellipsis}
            .assetstore-dialog .overview-text-overlay .notes{margin:10px 0}
            .assetstore-dialog .overview-text-overlay .notes .min-unity-version,.assetstore-dialog .overview-text-overlay .notes .package-size,.assetstore-dialog .overview-text-overlay .notes .package-version{margin:5px;font-weight:400}
            .assetstore-dialog .overview-text-overlay .fulldescription{word-break:break-word;font-weight:300;line-height:16px}
            .assetstore-dialog .overview-text-overlay .fulldescription a{color:#fff;text-decoration:underline}
            .assetstore-dialog .overview-text-overlay .fulldescription strong{font-weight: 400;}
            .assetstore-dialog ::-webkit-scrollbar{width:6px;height:6px}
            .assetstore-dialog ::-webkit-scrollbar-button{width:0;height:0}
            .assetstore-dialog ::-webkit-scrollbar-thumb{background:#e1e1e1;border:0 none #fff;border-radius:0}
            .assetstore-dialog ::-webkit-scrollbar-thumb:hover{background:#fff}
            .assetstore-dialog ::-webkit-scrollbar-thumb:active{background:#000}
            .assetstore-dialog ::-webkit-scrollbar-track{background:#666;border:0 none #fff;border-radius:0}
            .assetstore-dialog ::-webkit-scrollbar-track:hover{background:#666}
            .assetstore-dialog ::-webkit-scrollbar-track:active{background:#333}
            .assetstore-dialog ::-webkit-scrollbar-corner{background:transparent}
            .assetstore-dialog .screen-holder{position:absolute;background:rgba(0,0,0,0.85);padding:5px;bottom:0;right:0}
            .assetstore-dialog .screen-holder img{width:140px;cursor:pointer;margin:0 3px;}`
        );
    }

    function addInfoLabel() {
        $('.unitystore-holder').each(function (el) {
            let small = $('<small/>').addClass('unitystore-info-label').html('Detail');
            small.unbind().on('click', function (e) {
                let $label = $(this);
                $label.html('Loading...');
                let id = $(this).parent().data('id');
                let info = {
                    header: null,
                    content: null,
                    price: null
                };
                // get headers
                GM_xmlhttpRequest({
                    method: "GET",
                    url: apis.head + id + '.json',
                    onload: function (response) {
                        try {
                            info.header = $.parseJSON(response.responseText);
                            // price
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: apis.price + id + '.json',
                                onload: function (response) {
                                    try {
                                        info.price = $.parseJSON(response.responseText);
                                        // content
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: apis.content_overview + id + '.json',
                                            onload: function (response) {
                                                try {
                                                    info.content = $.parseJSON(response.responseText);
                                                    $label.html('Detail');
                                                    createPopup(info);
                                                }
                                                catch (e) {
                                                    console.log('content request error');
                                                }
                                            }
                                        });
                                    }
                                    catch (e) {
                                        console.log('price request error');
                                    }
                                }
                            });
                        }
                        catch (e) {
                            console.log('header request error');
                        }
                    }
                });
            });
            $(this).append(small);
        });
    }

    function createPopup(info) {
        //console.log(info);
        let id = info.content.content.id;

        preload([info.content.content.keyimage.big]);

        // check for media gallery
        let screenshots = '';
        if (info.content.content.images.length > 0) {
            screenshots = '<div class="screen-holder">';
            for (let i = 0; i <= 2; i++) {
                if (info.content.content.images[i] !== undefined) {
                    let img = info.content.content.images[i];
                    preload([img.thumb]);
                    screenshots += `<a data-fancybox="gallery_${id}" href="${img.link}"><img src="${img.thumb}"></a>`;
                }
            }
            screenshots += '</div>';
            // load other images for gallery
            if (info.content.content.images.length > 3) {
                screenshots += '<div style="display:none;">';
                for (let i = 3; i < info.content.content.images.length; i++) {
                    let img = info.content.content.images[i];
                    preload([img.thumb]);
                    screenshots += `<a href="${img.link}" data-fancybox="gallery_${id}" data-thumb="${img.thumb}"></a>`;
                }
                screenshots += '</div>';
            }
        }

        let rating = '';
        let average = info.content.content.rating.average;
        if (average > 0) {
            let stars = '';
            for (let i = 0; i < average; i++) {
                stars += '<i class="fa fa-star" aria-hidden="true"></i>';
            }
            for (let i = average + 1; i <= 5; i++) {
                stars += '<i class="fa fa-star-o" aria-hidden="true"></i>';
            }
            rating = `${stars} (<i class="fa fa-user" aria-hidden="true"></i> ${info.content.content.rating.count})`;
        }

        let html = `
            <div class="assetstore-shadow"></div>
            <div class="assetstore-dialog popup-holder" style="display:none;">
                <div class="popup-holder-close"><svg width="30" height="30"><g stroke="rgb(160,160,160)" stroke-width="4"><line x1="5" y1="5" x2="25" y2="25"/><line x1="5" y1="25" x2="25" y2="5"/></g></svg></div>
                <div class="popup-holder-content" style="background-image: url(${info.content.content.keyimage.big});">
                    ${screenshots}
                </div>
                <div class="popup-holder-main-info">
                    <div class="overview-text-overlay">
                        <h1><a href="${info.content.content.short_url}" target="_blank" rel="nofollow">${info.header.result.title}</a></h1>
                        <div class="details-container">
                            <span class="asset-category">${info.header.result.category}</span>
                            <span class="asset-author"><a href="${info.content.content.publisher.url}" target="_blank" rel="nofollow">${info.header.result.publisher}</a></span>
                            <span class="asset-rating ${info.content.content.rating.count === null ? 'unrated' : 'rated'}">${info.content.content.rating.count === null ? 'Not enough ratings' : rating }</span>
                            <span class="asset-price">${info.price.price}</span>
                        </div>
                        <div class="notes">
                            <span class="package-version">Version: ${info.content.content.version} (${info.content.content.pubdate})</span>
                            <span class="package-size">Size: ${info.content.content.sizetext}</span>
                            <span class="min-unity-version">Requires Unity ${info.content.content.min_unity_version} or higher.</span>
                        </div>
                        <div class="fulldescription vscroll">${info.content.content.description}</div>
                    </div>
                </div>
            </div>`;

        let popup = $(html);
        $('.popup-holder-close', popup).on('click', function () {
            $('.assetstore-shadow').remove();
            $('.assetstore-dialog.popup-holder').remove();
        });
        $('.assetstore-dialog').remove();
        $('body').append(popup);

        $("[data-fancybox]").fancybox({
            youtube: {
                controls: 1,
                showinfo: 1,
                autoplay: 0
            },
            vimeo: {
                color: 'f00'
            }
        });

        setTimeout(function () {
            $('.assetstore-dialog').show();
        }, 100);
    }

    function preload(images) {
        $(images).each(function () {
            (new Image()).src = this;
        });
    }

    function init() {
        addStyles();
        appendToLinks();
        replaceTextLinks();
        addInfoLabel();
    }

    $(function () {
        init();
    });

})();
