// ==UserScript==
// @name         ☄️拷贝漫画增强1☄️
// @namespace    http://tampermonkey.net/
// @version      4.3.7
// @description  拷贝漫画去广告🚫，对日漫版漫画页进行增强：并排布局📖、图片高度自适应↕️、辅助翻页↔️、页码显示⏱、侧边目录栏📑、暗夜模式🌙，请设置即时注入模式以避免页面闪烁⚠️
// @author       CY
// @match        *://copymanga.com/*
// @match        *://*.copymanga.com/*
// @match        *://*.copymanga.org/*
// @match        *://*.copymanga.net/*
// @match        *://*.copymanga.info/*
// @match        *://*.copymanga.site/*
// @match        *://*.copymanga.tv/*
// @match        *://*.mangacopy.com/*
// @match        *://copymanga.com/*
// @match        *://copymanga.org/*
// @match        *://copymanga.net/*
// @match        *://copymanga.info/*
// @match        *://copymanga.site/*
// @match        *://copymanga.tv/*
// @match        *://mangacopy.com/*
// @license      GNU General Public License v3.0 or later
// @resource     animate_css https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css
// @resource     element_css https://unpkg.com/element-ui@2.15.0/lib/theme-chalk/index.css
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.js
// @require      https://unpkg.com/element-ui@2.15.0/lib/index.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/517098/%E2%98%84%EF%B8%8F%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E5%A2%9E%E5%BC%BA1%E2%98%84%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/517098/%E2%98%84%EF%B8%8F%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E5%A2%9E%E5%BC%BA1%E2%98%84%EF%B8%8F.meta.js
// ==/UserScript==
function hiddenCursor(body) {
    // 隐藏鼠标
    originalCursor = body.css('cursor');
    body.css({'cursor': 'none'});
}

function showCursor(body) {
    body.css({'cursor': originalCursor});
}

function msgTips(msg, type) {
    if (type === undefined) type = 'info'
    toastr[type](msg);
}

function checkFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

let upLoopIndex = 0;
let downLoopIndex = 0;
let info_app;

function checkDownUp(type, index, func) {
    if (type === 0 && downLoopIndex === index) {
        func();
    } else if (type === 1 && upLoopIndex === index) {
        func();
    }
}

function scoll(type, func, time = 300) {
    var index = 0;
    if (type === 0) {
        index = ++downLoopIndex;
        setTimeout(function () {
            checkDownUp(0, index, func);
        }, time);
    } else if (type === 1) {
        index = ++upLoopIndex;
        setTimeout(function () {
            checkDownUp(1, index, func);
        }, time);
    }
}

function fireKeyEvent(el, evtType, keyCode, ctrlKey = false) {
    let evtObj;
    if (document.createEvent) {
        if (window.KeyEvent) {//firefox 浏览器下模拟事件
            evtObj = document.createEvent('KeyEvents');
            evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
        } else {//chrome 浏览器下模拟事件
            el.focus();
            evtObj = new KeyboardEvent(evtType, {
                keyCode: keyCode,
                location: 0,
                repeat: false,
                isComposing: false
            });

            if (ctrlKey) {
                if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                    Object.defineProperty(evtObj, "ctrlKey", {value: true});
                } else {
                    evtObj.ctrlKey = true;
                }
            }
        }
        el.dispatchEvent(evtObj);

    } else if (document.createEventObject) {//IE 浏览器下模拟事件
        evtObj = document.createEventObject();
        evtObj.keyCode = keyCode
        el.fireEvent('on' + evtType, evtObj);
    }
}

let originalCursor = 'auto';
let changeCursorType = true;
let img_id = 0;
let skip_null_img_map = new Map();
let scrollDown = function () {
};
let scrollUp = function () {
};
$(document).ready(function () {
    //设置 toastr 显示配置
    toastr.options = {
        closeButton: false,
        debug: false,
        progressBar: false,
//        positionClass: "toast-top-center",
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    let bodyDom = $('body');
    if ($('.comicContent').length > 0) {
        msgTips('检测到漫画内容页', 'info');
        document.onfullscreenchange = function (event) {
            console.log("FULL SCREEN CHANGE")
            if (document.fullscreenElement) {
                GM_setValue('copymanga.com_fullScreenType', true);
            } else {
                GM_setValue('copymanga.com_fullScreenType', false);
            }
        };
        if (GM_getValue('copymanga.com_fullScreenType', false) === true) {
            setTimeout(function () {
                msgTips('记忆全屏状态', 'info');
                document.documentElement.requestFullscreen();
            }, 1500);
        }
        hiddenCursor(bodyDom);
        window.addEventListener("mousemove", function () {
            if (changeCursorType) {
                changeCursorType = false;
                showCursor(bodyDom);
                scoll(1, function () {
                    hiddenCursor(bodyDom);
                    changeCursorType = true;
                }, 500);
            }
        }, true);
    }

});

function flushImageId() {
    let $img = $('.comicContent ul img');
    let count_lm = $($('.comicCount')[0]);
    let count_1 = count_lm.html();
    count_lm.parent().hide();
    let count_2 = $img.length;
    if (count_2 > count_1) {
        count_1 = count_2;
    }
    window.g_max_pic_count = count_1 ? count_1 : count_2;
    info_app.pic_count = count_1 ? count_1 : count_2;
    $.each($img, function (index) {
        this.setAttribute('id', 'img_' + (index + 1));
    });
    $('.comicContent-list').removeClass('comicContent-list');
}

function initStyle() {
    GM_addStyle('.comicContent-list{width:100% !important;}')
    //固定header
    GM_addStyle('.header{position:unset !important;}')
    //去除footer
    GM_addStyle('.footer{display:none !important;}')
    //文字居中
    GM_addStyle('body{text-align:center !important;font-size:12px !important;line-height: normal !important;}')
    //图片居中
    GM_addStyle('ul{padding:0px !important;}')
    //body全屏
    GM_addStyle('body{height:unset !important;}')
    //修改滚动条样式
    GM_addStyle('::-webkit-scrollbar {width: 4px;height: 0px;}')
    GM_addStyle('::-webkit-scrollbar-thumb {background-color: rgb(48,48,48);border-radius: 2px;}')
    //修改element-ui样式
    GM_addStyle('.el-menu{border-right:0px !important;}')
    GM_addStyle('.el-drawer__wrapper{width:20%;}')
    GM_addStyle('.el-drawer{background:transparent !important;}')
    GM_addStyle('.el-drawer__body{background:rgba(0,0,0,.8) !important;overflow-y: auto}')
    //去除图片边框
    GM_addStyle('.comicContent{margin-top:20px;user-select: none;}')
    GM_addStyle('.comicContent img{margin-bottom: 50px !important;width:unset !important;}')
    //漫画双页排布
    GM_addStyle('.page_double .comicContent ul{justify-content:center;flex-direction: row-reverse;display: flex;flex-wrap: wrap;}')
    GM_addStyle('.page_double .comicContent img{height:100vh !important;}')
    GM_addStyle('.comicContent-image-list{width:unset !important;}')
    //引入css
    const animate_css = GM_getResourceText("animate_css");
    const element_css = GM_getResourceText("element_css");
    //const toastr_css = GM_getResourceText("toastr_css");
    const toastr_css = '.toast-title{font-weight:700}.toast-message{-ms-word-wrap:break-word;word-wrap:break-word}.toast-message a,.toast-message label{color:#FFF}.toast-message a:hover{color:#CCC;text-decoration:none}.toast-close-button{position:relative;right:-.3em;top:-.3em;float:right;font-size:20px;font-weight:700;color:#FFF;-webkit-text-shadow:0 1px 0 #fff;text-shadow:0 1px 0 #fff;opacity:.8;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80);filter:alpha(opacity=80);line-height:1}.toast-close-button:focus,.toast-close-button:hover{color:#000;text-decoration:none;cursor:pointer;opacity:.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter:alpha(opacity=40)}.rtl .toast-close-button{left:-.3em;float:left;right:.3em}button.toast-close-button{padding:0;cursor:pointer;background:0 0;border:0;-webkit-appearance:none}.toast-top-center{top:0;right:0;width:100%}.toast-bottom-center{bottom:0;right:0;width:100%}.toast-top-full-width{top:0;right:0;width:100%}.toast-bottom-full-width{bottom:0;right:0;width:100%}.toast-top-left{top:12px;left:12px}.toast-top-right{top:12px;right:12px}.toast-bottom-right{right:12px;bottom:12px}.toast-bottom-left{bottom:12px;left:12px}#toast-container{position:fixed;z-index:999999;pointer-events:none}#toast-container *{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}#toast-container>div{position:relative;pointer-events:auto;overflow:hidden;margin:0 0 6px;padding:15px 15px 15px 50px;width:300px;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;background-position:15px center;background-repeat:no-repeat;-moz-box-shadow:0 0 12px #999;-webkit-box-shadow:0 0 12px #999;box-shadow:0 0 12px #999;color:#FFF;opacity:.8;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80);filter:alpha(opacity=80)}#toast-container>div.rtl{direction:rtl;padding:15px 50px 15px 15px;background-position:right 15px center}#toast-container>div:hover{-moz-box-shadow:0 0 12px #000;-webkit-box-shadow:0 0 12px #000;box-shadow:0 0 12px #000;opacity:1;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);filter:alpha(opacity=100);cursor:pointer}#toast-container>.toast-info{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=)!important}#toast-container>.toast-error{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=)!important}#toast-container>.toast-success{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==)!important}#toast-container>.toast-warning{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=)!important}#toast-container.toast-bottom-center>div,#toast-container.toast-top-center>div{width:300px;margin-left:auto;margin-right:auto}#toast-container.toast-bottom-full-width>div,#toast-container.toast-top-full-width>div{width:96%;margin-left:auto;margin-right:auto}.toast{background-color:#030303}.toast-success{background-color:#51A351}.toast-error{background-color:#BD362F}.toast-info{background-color:#2F96B4}.toast-warning{background-color:#F89406}.toast-progress{position:absolute;left:0;bottom:0;height:4px;background-color:#000;opacity:.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter:alpha(opacity=40)}@media all and (max-width:240px){#toast-container>div{padding:8px 8px 8px 50px;width:11em}#toast-container>div.rtl{padding:8px 50px 8px 8px}#toast-container .toast-close-button{right:-.2em;top:-.2em}#toast-container .rtl .toast-close-button{left:-.2em;right:.2em}}@media all and (min-width:241px) and (max-width:480px){#toast-container>div{padding:8px 8px 8px 50px;width:18em}#toast-container>div.rtl{padding:8px 50px 8px 8px}#toast-container .toast-close-button{right:-.2em;top:-.2em}#toast-container .rtl .toast-close-button{left:-.2em;right:.2em}}@media all and (min-width:481px) and (max-width:768px){#toast-container>div{padding:15px 15px 15px 50px;width:25em}#toast-container>div.rtl{padding:15px 50px 15px 15px}}';
    GM_addStyle(animate_css);
    GM_addStyle(element_css);
    GM_addStyle(toastr_css);
    GM_addStyle(':root{--animate-duration:500ms;}')
    //更改跨页
    GM_addStyle('.skip{display:none !important;}')
    //日间模式
    GM_addStyle("body{background:#edecea !important;}")
    //夜间模式
    GM_addStyle("html{background:transparent !important;}")
    GM_addStyle(".dark_mode body{background:#212121 !important;}")
    //读取cookie
    if ($.cookie('dark_mode') === undefined) {
        $.cookie('dark_mode', true, {expires: 999999, path: '/'});
    }
    if ($.cookie('page_double') === undefined) {
        $.cookie('page_double', true, {expires: 999999, path: '/'});
    }
    if ($.cookie('auto_skip') === undefined) {
        $.cookie('auto_skip', false, {expires: 999999, path: '/'});
    }
}

function getImgId() {
    if (!img_id) {
        img_id=1;
        flushImageId(info_app);
        imageTop(img_id);
    }
    return img_id;
}

function skip(image_id = 0) {
    let skip_null_img_el = $('<img />');
    let skip_null_img_li = $('<li></li>');
    let this_image_id = image_id > 0 ? image_id : getImgId();
    if (img_id % 2 === 0) {
        this_image_id = img_id - 1;
    }
    if (this_image_id <= 0) {
        this_image_id = 1;
    }
    let this_image = $('#img_' + this_image_id);
    let css_object = {
        width: this_image.parent().css('width'),
        height: '100vh',
    };
    let img_id_map_index_key = '';
    while (!img_id_map_index_key) {
        img_id_map_index_key = Math.random().toString(36).slice(-8);
    }
    skip_null_img_el.addClass('nullImagePlaceholder').attr('data-img-id-map-index-key', img_id_map_index_key).css(css_object);
    skip_null_img_li.css(css_object);
    skip_null_img_li.append(skip_null_img_el);
    this_image.parent().before(skip_null_img_li);
    if (!img_id) {
        img_id = 1;
    } else {
        img_id++;
    }
    let skip_null_img = {
        null_img: skip_null_img_el,
        null_img_li: skip_null_img_li,
        this_image: this_image,
        interval: setInterval(function() {
            if(skip_null_img!==null && skip_null_img.this_image.parent().css('width') !== skip_null_img.null_img.css('width')) {
                skip_null_img.null_img.css({
                    width: skip_null_img.this_image.parent().css('width'),
                });
                skip_null_img.null_img_li.css({
                    width: skip_null_img.this_image.parent().css('width'),
                });
            }
        }, 1000)
    };
    skip_null_img_map.set(img_id_map_index_key, skip_null_img);

    flushImageId(info_app);
    imageTop();
}

function skipClean(this_image_clean = false) {
    msgTips('开始清除占位图片', 'info');
    if (this_image_clean) {
        let this_img_id = getImgId();
        let this_img_el = $('#img_'+ this_img_id);
        while (!this_img_el.hasClass('nullImagePlaceholder')){
            this_img_id -= 1;
            if (this_img_id <= 0) {
                msgTips('前面没有占位图片了', 'warning');
                return;
            }
            this_img_el = $('#img_'+ this_img_id);
        }
        let map_key = this_img_el.attr('data-img-id-map-index-key');
        let img_object = skip_null_img_map.get(map_key);
        if (typeof img_object !== 'undefined') {
            clearInterval(img_object.interval);
            img_object.null_img_li.remove();
            img_id--;
        }
        skip_null_img_map.delete(map_key);
        msgTips('清除单张占位图片成功', 'success');
    } else {
        if (skip_null_img_map.size <= 0) {
            msgTips('没有占位图片', 'warning');
            return;
        }
        skip_null_img_map.forEach(function (img_object, key) {
            if (typeof img_object !== 'undefined') {
                clearInterval(img_object.interval);
                img_object.null_img_li.remove();
                img_id--;
            }
            skip_null_img_map.delete(key);
        });
        msgTips('清除全部占位图片成功', 'success');
    }
    flushImageId(info_app);
}

function imageTop(img_id_bak = 0, time=500) {
    if (img_id !== (window.g_max_pic_count + 1)) {
        $("html").stop();
    }
    info_app.img_id = img_id;

    let img_id_key = "#img_" + img_id;
    if ($(img_id_key).offset()) {
        $("html").animate({scrollTop: $(img_id_key).offset().top}, time);
    } else {
        flushImageId(info_app);
        if ($(img_id_key).offset()) {
            $("html").animate({scrollTop: $(img_id_key).offset().top}, time);
        } else {
            if (img_id_bak > 0) {
                img_id = img_id_bak;
                info_app.img_id = img_id_bak;
            }
            return false;
        }
    }
    return true;
}

(function () {
    'use strict';
    //去广告
    GM_addStyle('*[style*="position: relative;"]{display:none !important;}')
    GM_addStyle('.header-jum{display:none !important;}')
    GM_addStyle('.comicContainerAds{display:none !important;}')
    //漫画页检测
    if (location.href.indexOf("chapter") >= 0) {
        initStyle();
        let dark_mode = $.cookie('dark_mode') === 'true';
        let page_double = $.cookie('page_double') === 'true';
        let auto_skip = $.cookie('auto_skip') === 'true';
        //暗夜模式
        if (dark_mode) {
            $('html').addClass('dark_mode');
        } else {
            $('html').removeClass('dark_mode');
        }
        //双页显示
        if (page_double) {
            $('html').addClass('page_double');
        } else {
            $('html').removeClass('page_double');
        }
        let middle = 0;
        let ch_id = 0;
        //延迟加载
        $(function delay() {
            //$('.comicContent-list').removeClass('comicContent-list');
            //计算页数
            if (typeof (g_max_pic_count) == 'undefined') {
                window.el = $('<iframe src="' + $('.list a').attr('href') + '" style="display:none;"></iframe>');
                $('body').append(window.el);
                var count_lm = $($('.comicCount')[0]);
                var count_1 = count_lm.html();
                count_lm.parent().hide();
                window.g_max_pic_count = count_1 ? count_1 : 3;
            }
            setTimeout(function() {
                //自动跨页
                if (auto_skip) {
                    flushImageId();
                    skip(1);
                    msgTips('自动跨页 - 开启', 'info');
                } else {
                    msgTips('自动跨页 - 关闭', 'info');
                }
            }, 1000);
            //去除憨批类
            $('.comicContent-image-all').removeClass('comicContent-image-all');
            $('.container').removeClass('container');
            $('.comicContent-image-1').removeClass('comicContent-image-1');
            $('.comicContent-image-2').removeClass('comicContent-image-2');
            $('.comicContent-image-3').removeClass('comicContent-image-3');
            $('.comic-size-1').removeClass('comic-size-1');
            $('.comic-size-2').removeClass('comic-size-2');
            $('.comic-size-3').removeClass('comic-size-3');
            //添加图片id
            info_app && flushImageId(info_app);
            //预加载图片
            $('.comicContent img').addClass('lazypreload');
            //去除原来的jquery事件
            jQuery = unsafeWindow['jQuery'];
            jQuery("body").off("keydown");
            jQuery(".inner_img a").off("click");
            //上下方向键滚动页面，左右方向键切换章节
            scrollUp = function () {
                let img_id_bak = img_id;
                if (middle == 0 || img_id == g_max_pic_count + 1) {
                    if (img_id >= 1) {
                        if ($("#img_" + img_id).length > 0 && $("#img_" + (img_id - 1)).length > 0 && $("#img_" + img_id).offset().top == $("#img_" + (img_id - 1)).offset().top) {
                            img_id -= 2;
                        } else {
                            img_id -= 1;
                        }
                    }
                }
                middle = 0;
                if (!imageTop(img_id_bak)) {
                    msgTips('这是第一页', 'warning');
                }
            }
            scrollDown = function () {
                let img_id_bak = img_id;
                if (img_id <= window.g_max_pic_count) {
                    let image_string = "#img_" + img_id;
                    let image_next_string = "#img_" + (img_id + 1);
                    if ($(image_string).length > 0 && $(image_next_string).length > 0 && $(image_string).offset() && $(image_string).offset().top === $(image_next_string).offset().top) {
                        img_id += 2;
                    } else {
                        img_id += 1;
                    }
                }
                middle = 0;
                if (!imageTop(img_id_bak)) {
                    msgTips('这是最后一页了', 'warning');
                }
            }

            function goAhead() {
                msgTips('下一章', 'success');

                let location_new = $('.footer>div:nth-child(4) a').attr("href");
                if (location_new.indexOf("chapter") >= 0) {
                    location.href = location_new;
                } else {
                    msgTips('这是最后一章了', 'error');
                }
            }

            function goBack() {
                msgTips('上一页', 'success');

                let location_new = $('.footer>div:nth-child(2) a').attr("href");
                if (location_new.indexOf("chapter") >= 0) {
                    location.href = location_new;
                }
            }


            $(".comicContent").click(function (event) {
                event.stopPropagation();
                if (document.fullscreenElement) {
                    scrollDown();
                    return;
                }
                if (event.clientY > $(window).height() / 2) {
                    // fireKeyEvent(document.getElementsByTagName('body')[0], 'keydown', 40);
                    scrollDown();
                } else {
                    scrollUp();
                }
                return false;
            });
            $("body").keydown(function (event) {
                console.log(event);

                if (event.ctrlKey || event.metaKey) {
                    return true;
                }

                switch (event.keyCode) {
                    case 38:
                        scrollUp();
                        break;
                    case 32:
                    case 40:
                        scrollDown();
                        break;
                    case 37:
                        goBack();
                        break;
                    case 39:
                        goAhead();
                        break;
                    case 13:
                    case 70:
                        checkFullScreen();
                        break;
                    case 67:
                    case 96:
                    case 97:
                        info_app.switch_skip();
                        break;
                    case 88:
                        skipClean();
                        break;
                    case 90:
                        skipClean(true);
                        break;
                    case 76:
                        info_app.collect();
                        break;
                    case 84:
                       info_app.switch_hide_time();
                       break;
                    case 84:
                        info_app.collection_status_emoji_flash();
                        break;
                    case 71:
                        info_app.switch_flash_good_css();
                        break;
                    default:
                        return true;
                }
                return false;
            });
            document.onmousedown = function (event) {
                // 鼠标键位监听
                if (document.fullscreenElement) {
                    var b_code = event.button;
                    if (b_code == 1 || b_code == 3 || b_code == 4) {
                        if (b_code == 1) {
                            info_app.switch_skip();
                        }

                        if (b_code == 4) {
                            goAhead();
                        }

                        if (b_code == 3) {
                            goBack();
                        }

                        return false;
                    }
                }
            }
            // 拦截右键
            document.oncontextmenu = function (event) {
                if (document.fullscreenElement) {
                    event.preventDefault();
                    scrollUp();
                }
            }
            // 禁用鼠标滚轮
            window.addEventListener('mousewheel', function (event) {
                if (document.fullscreenElement) {
                    scoll(0, function () {
                        msgTips('全屏状态禁用滚动', 'error');
                    });

                    event = event || window.event;
                    if (event.preventDefault) {
                        // Firefox
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        // IE
                        event.cancelBubble = true;
                        event.returnValue = false;
                    }
                    return false;
                }
            }, {passive: false});
            //resize事件触发图片和浏览器对齐
            $(window).resize(function () {
                imageTop(img_id, 0);
            })
            window.addEventListener('mousewheel', function () {
                middle = 1;
                setTimeout(function () {
                    for (var i = 0; i < 2; i++) {
                        if ((img_id == g_max_pic_count + 1 && pageYOffset < $("#img_" + g_max_pic_count).offset().top + $("#img_" + g_max_pic_count).height()) ||
                            ($("#img_" + img_id).length > 0 && pageYOffset < $("#img_" + img_id).offset().top))
                            img_id -= 1;
                        if ((img_id == g_max_pic_count && pageYOffset > $("#img_" + g_max_pic_count).offset().top + $("#img_" + g_max_pic_count).height()) ||
                            ($("#img_" + (img_id + 1)).length > 0 && pageYOffset > $("#img_" + (img_id + 1)).offset().top))
                            img_id += 1;
                        info_app.img_id = img_id;
                    }
                }, 100);
            })
            //添加右下角菜单
            let info = `
<div id="info" @mouseover="show=1" @mouseleave="show=0">
<transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
<template v-if="show"><div id="info_page" class="info_item" @click="switch_page" style="cursor:pointer;">{{message_page}}</div></template></transition>
<transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
<template v-if="show"><div id="info_skip" class="info_item" @click="switch_auto_skip" style="cursor:pointer;">{{message_auto_skip}}</div></template></transition>
<template v-if="show"><div id="info_skip" class="info_item" @click="switch_skip" style="cursor:pointer;">{{message_skip}}</div></template></transition>
<transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
<template v-if="show"><div id="info_switch" class="info_item" @click="switch_night" style="cursor:pointer;">{{message_switch}}</div></template></transition>
<template><div id="info_count" class="info_item"><span v-bind:class="{hide: collection_emoji_div_hide, collection_status_emoji: collection_status_emoji, goodman:(flash_good_css && collection_status)}">{{collection_status_emoji}}</span>{{message_count}}</div>
<div class="info_item time_class" v-bind:class="{hide: time_div_hide, goodman:flash_good_css}">{{time_str}}</div></template>
</div>`;
            let $info = $(info);
            $("body").append($info);
            let info_style = `
#info {
bottom: 2%;
right: 2%;
padding: 5px 5px;
background: rgba(48,48,48,.7) !important;
position: fixed;
color: rgba(255,255,255,.7);
border-radius: 3px;
}
.collection_status_emoji{
margin-right: 20px;
margin-left: -5px;
}
.time_class{
color: #06dfebd9;
}
.info_item{
padding:5px 0px;
width:120px;
}
.goodman{
-webkit-mask-image: linear-gradient(to right, red, orange, yellow, green, cyan, blue, purple);
background-image: linear-gradient(to right, red, orange, yellow, green, yellow, orange, red, orange, yellow, green, yellow, orange, red);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
-webkit-background-size: 200% 100%;
animation: bgp 5s infinite linear;
}
.hide {
display: none;
}
@-webkit-keyframes bgp {
0%  { background-position: 0 0;}
100% { background-position: -100% 0;}
}`;
            GM_addStyle(info_style);
            //vue绑定右下角菜单
            info_app = new Vue({
                el: '#info',
                data: {
                    dark: dark_mode,
                    page: page_double,
                    show: 0,
                    img_id: img_id,
                    auto_skip: auto_skip,
                    skip: 0,
                    insert_image_id: '',
                    pic_count: 0,
                    prev_html_string_data: null,
                    collection_status: null,
                    time_str: "",
                    time_div_hide: true,
                    collection_emoji_div_hide: true,
                    flash_good_css: false,
                    http_token: null,
                },
                computed: {
                    message_switch: function () {
                        return this.dark ? '☀️日间模式' : '🌙夜间模式'
                    },
                    message_page: function () {
                        return this.page ? '1️⃣单页排布' : '2️⃣双页排布'
                    },
                    message_auto_skip: function () {
                        return this.auto_skip ? '☣️关闭自动跨页' : '☣️开启自动跨页';
                    },
                    message_skip: function () {
                        return '📖更改跨页'
                    },
                    message_count: function () {
                        return this.img_id + '/' + this.pic_count
                    },
                    collection_status_emoji: function () {
                        if (this.collection_status === null) {
                            return '';
                        }
                        return this.collection_status ? "🌟" : "☆"
                    },
                },
                methods: {
                    switch_night: function () {
                        this.dark = !this.dark
                        $.cookie('dark_mode', this.dark, {expires: 999999, path: '/'});
                        if (this.dark) {
                            $('html').addClass('dark_mode');
                        } else {
                            $('html').removeClass('dark_mode');
                        }
                    },
                    switch_auto_skip: function () {
                        if (this.auto_skip) {
                            msgTips('关闭☣️自动更改跨页', 'success');
                        } else {
                            msgTips('开启☣️自动更改跨页', 'success');
                        }
                        this.auto_skip = !this.auto_skip;
                        $.cookie('auto_skip', this.auto_skip, {expires: 999999, path: '/'});
                    },
                    switch_skip: function () {
                        skip();
                        msgTips('📖更改跨页', 'success');
                    },
                    switch_hide_time: function () {
                        this.time_div_hide = !this.time_div_hide;
                        $.cookie('right_bottom_time_switch', this.time_div_hide, {expires: 999999, path: '/'});
                    },
                    switch_flash_good_css: function () {
                        this.flash_good_css = !this.flash_good_css;
                        $.cookie('flash_good_css', this.flash_good_css, {expires: 999999, path: '/'});
                    },
                    switch_page: function () {
                        this.page = !this.page
                        $.cookie('page_double', this.page, {expires: 999999, path: '/'});
                        if (this.page) {
                            $('html').addClass('page_double');
                        } else {
                            $('html').removeClass('page_double');
                        }
                        $("html").animate({scrollTop: $("#img_" + img_id).offset().top}, 0);
                    },
                    request: function (opt) {
                        var url = opt.url;
                        var type = opt.type;
                        var data = opt.data;
                        var success = opt.success;
                        var error = opt.error;
                        var headers = opt.headers;
                        var request = new XMLHttpRequest();
                        request.open(type, url, true);
                        var headerName = [];
                        var headerText = [];

                        for (var i in headers) {
                            headerName.push(i);
                            headerText.push(headers[i]);
                        }

                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

                        request.withCredentials = true; //加入这个携带cookie

                        for (var _i = 0; _i < headerText.length; _i++) {
                            request.setRequestHeader(headerName[_i], headerText[_i]);
                        }

                        var fromStr = '';

                        for (var _i2 in data) {
                            fromStr += _i2 + '=' + data[_i2] + "&";
                        }

                        fromStr = fromStr.substr(0, fromStr.length - 1);

                        if (type === 'POST') {
                            if (data) {
                                request.send(fromStr);
                            } else {
                                request.send(null);
                            }
                        } else if (type === 'GET') {
                            request.send(null);
                        }

                        request.onreadystatechange = function (ev) {
                            if (request.readyState == 4) {
                                if (request.status == 200) {
                                    var res = JSON.parse(request.response);
                                    success(res);
                                } else {
                                    var json = JSON.parse(request.response);
                                    error(json);
                                    msgTips(json.message, "error");
                                }
                            }
                        };
                    },
                    getPrev: function (func) {
                        if (info_app.prev_html_string_data === null) {
                            var href_url = $('.comicContent-prev.list a[href]').attr('href');
                            if (href_url !== undefined && href_url !== '') {
                                $.get(href_url, function (res) {
                                    info_app.prev_html_string_data = res;
                                    func(info_app.prev_html_string_data);
                                })
                                return;
                            }
                            msgTips('当前漫画目录页面地址解析失败', 'error');
                            return;
                        }
                        func(info_app.prev_html_string_data);
                    },
                    collect: function () {
                        this.getPrev(function (prev_string_data) {
                            if (info_app.collection_status === null) {
                                info_app.collection_status = (/加入書架/.exec(prev_string_data) === null);
                            }
                            var checkResult = !(info_app.collection_status);
                            var execResult = /collect\(\'([\S]+)\'\)/.exec(prev_string_data);
                            if (execResult !== null && execResult.length > 1) {
                                var cartoonId = execResult[1];
                                var token = info_app.getToken();
                                var wantToCollect = checkResult ? "1" : "0";

                                if (token) {
                                    info_app.request({
                                        type: "POST",
                                        url: API_URL + "/api/v2/web/collect",
                                        headers: {
                                            "Authorization": "Token " + token + ""
                                        },
                                        data: {
                                            comic_id: cartoonId,
                                            is_collect: wantToCollect
                                        },
                                        success: function success(res) {
                                            if (checkResult) {
                                                info_app.collection_status = true;
                                                msgTips('加入书架成功', 'success');
                                            } else {
                                                info_app.collection_status = false;
                                                msgTips('取消收藏成功', 'success');
                                            }
                                        },
                                        error: function error(res) {
                                        }
                                    });
                                } else {
                                    info_app.collection_emoji_div_hide = true;
                                    // msgTips('请在登录之后进行操作', 'error');
                                }
                            } else {
                                msgTips('提取漫画ID失败', 'error');
                            }
                        });
                    },
                    getToken: function () {
                        if (this.http_token === null) {
                            var strCookie = document.cookie; //将多cookie切割为多个名/值对

                            var arrCookie = strCookie.split("; ");

                            for (var i = 0; i < arrCookie.length; i++) {
                                var arr = arrCookie[i].split("=");

                                if ("token" == arr[0]) {
                                    this.http_token = arr[1];
                                    return this.http_token;
                                }
                            }
                            this.http_token = false;
                        }

                        return this.http_token;
                    },

                },
                mounted () {
                    setTimeout(function () {
                        getImgId();

                        if (info_app.getToken()) {
                            info_app.collection_emoji_div_hide = false;
                        }

                        var right_bottom_time_switch = $.cookie('right_bottom_time_switch');
                        var flash_good_css = $.cookie('flash_good_css');
                        if (right_bottom_time_switch !== undefined) {
                            info_app.time_div_hide = right_bottom_time_switch === 'true';
                        }
                        if (flash_good_css !== undefined) {
                            info_app.flash_good_css = flash_good_css === 'true';
                        }

                        info_app.getPrev(function (prev_string_data) {
                            info_app.collection_status = (/加入書架/.exec(prev_string_data) === null);
                            msgTips('获取到当前漫画的收藏状态', 'success');
                        });
                    }, 1000);
                    setInterval(function () {
                        var now = new Date();
                        var hh = now.getHours();
                        var mm = now.getMinutes();
                        var ss = now.getSeconds();
                        info_app.time_str = (hh<10?"0"+hh:hh)+ " : "+ (mm<10?"0"+mm:mm)+ " : "+ (ss<10?"0"+ ss: ss);
                    }, 1000);
                },
            })
            //添加侧边目录栏
            let sidebar = `
<div id="sidebar" @mouseleave="drawer=false">
<div id="toggle" @mouseover="drawer=true" style="top:0px;left:0px;height:100vh;width:20vw;position: fixed;"></div>
<el-drawer
title="我是标题"
:size="size"
:modal="modal"
:visible="drawer"
:with-header="false"
:direction="direction"
@open="handleOpen">
<el-menu background-color="transparent"
text-color="#fff"
active-text-color="#ffd04b"
@select="handleSelect">
<template v-for="(item, index) in items">
<el-menu-item v-bind:index="index">{{item.title}}</el-menu-item>
</template>
</el-menu>
</el-drawer>
</div>`
            let $sidebar = $(sidebar);
            $("body").append($sidebar);
            //vue绑定侧边目录栏
            var sidebar_app = new Vue({
                el: '#sidebar',
                data: {
                    drawer: false,
                    size: '100%',
                    modal: false,
                    direction: 'ltr',
                    items: [],
                },
                methods: {
                    handleSelect(key) {
                        location.href = this.items[key].href;
                    },
                    handleOpen() {
                        setTimeout(function () {
                            if ($('.el-menu>li:nth-child(' + (ch_id - 1) + ')').offset()) {
                                $('.el-drawer__body').animate({scrollTop: 0}, 0);
                                $('.el-drawer__body').animate({scrollTop: $('.el-menu>li:nth-child(' + (ch_id - 1) + ')').offset().top - $('.el-drawer__body').offset().top}, 0);
                            }
                        }, 0)
                    },
                }
            })

            //加载目录
            function menu() {
                let $border = $('#default全部 ul:first-child a', el.contents());
                if ($border.length == 0) {
                    setTimeout(menu, 100);
                    return;
                }
                $.each($border, function (index) {
                    if (location.href.indexOf(this.href) >= 0) {
                        ch_id = index;
                        GM_addStyle('.el-menu>li:nth-child(' + (ch_id + 1) + '){background:rgba(255,165,0,.5) !important}')
                    }
                    sidebar_app.items.push({
                        title: this.text,
                        href: this.href,
                    })
                })
            }

            menu();
        })
    }
})();
