// ==UserScript==
// @name         EXBetterMulti-Page
// @namespace    https://greasyfork.org/zh-CN/users/453092
// @require      http://code.jquery.com/jquery-latest.js
// @version      0.60
// @description  Better Multi-Page
// @author       ikarosf
// @match        https://exhentai.org/mpv/*
// @match        https://e-hentai.org/mpv/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/419563/EXBetterMulti-Page.user.js
// @updateURL https://update.greasyfork.org/scripts/419563/EXBetterMulti-Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pagenumdiv= document.createElement('div');
    var isShowPagenum=GM_getValue('isShowPagenum',false)
    var loadoffset;
    var isLongpreload=GM_getValue('isLongpreload',false)
    if(isLongpreload){
        loadoffset = 300000;
    }else{
        loadoffset = 30000;
    }

    var isAutoResize;
    isAutoResize=GM_getValue('isAutoResize',true)

    do_mousescroll = function(c, a) {
        a = a ? a : window.event;
        var b = (a.detail ? a.detail * -1 : a.wheelDelta / 40) * 80;
        scroll_relative(c, b);
        cancelEvent(a)
    }

    preload_generic = function(c, j, d) {
        var f = c.scrollTop;
        var b = f + c.offsetHeight;
        var a = j == "image";
        for (var g = 1; g <= pagecount; g++) {
            var e = document.getElementById(j + "_" + g);
            var k = e.offsetTop;
            var h = k + e.offsetHeight;
            if ((e.style.visibility == "hidden") && (h >= f) && (k <= b + d + loadoffset)) { //预加载高度
                if (a) {
                    load_image(g)
                } else {
                    load_thumb(g)
                }
                e.style.visibility = "visible"
            } else {
                if (e.style.visibility == "visible") {
                    if ((h < f - 10000) || (k > b + 10000)) {
                        e.innerHTML = "";
                        e.style.visibility = "hidden"
                    }
                    if (a && (h >= f + 100) && (k <= f + 100)) {
                        currentpage = g
                        pagenumdiv.innerText = currentpage + "/" + pagecount;
                    }
                }
            }
        }
    }

    rescale_image = function(c, b) {
        if(isAutoResize){
            var i = Math.max(700, window.innerWidth - (hide_thumbbar ? 5 : 230));
            var h = parseInt(imagelist[c - 1].xres);
            var a = parseInt(imagelist[c - 1].yres);
            var d = h;
            var g = a;
            if (always_scale || (d > i)) {
                g = Math.round(g * i / d);
                d = i
            }
            var e = 0;
            if (b.offsetTop + b.offsetHeight < pane_images.scrollTop) {
                var f = parseInt(b.style.height.replace(/px/, ""));
                e += f - g
            }
            var hh = window.innerHeight;
            var ww = window.innerWidth - (hide_thumbbar ? 5 : 230);
            if(hh<ww){
                b.style.width = "";
                b.style.height = hh + "px";
                document.getElementById("image_" + c).style.height = (hh + 24) + "px";
            }else{
                //b.style.width = g + "px";
                //b.style.height = "";
                b.style.width = d + "px";
                b.style.height = g + "px";
                document.getElementById("image_" + c).style.height = (g + 24) + "px";
            }

            return {
                view_height: g,
                scroll_offset: e
            }
        }else{
            var i = Math.max(700, window.innerWidth - (hide_thumbbar ? 5 : 230));
            var h = parseInt(imagelist[c - 1].xres);
            var a = parseInt(imagelist[c - 1].yres);
            var d = h;
            var g = a;
            if (always_scale || (d > i)) {
                g = Math.round(g * i / d);
                d = i
            }
            var e = 0;
            if (b.offsetTop + b.offsetHeight < pane_images.scrollTop) {
                var f = parseInt(b.style.height.replace(/px/, ""));
                e += f - g
            }
            b.style.width = d + "px";
            b.style.height = g + "px";
            document.getElementById("image_" + c).style.height = (g + 24) + "px";
            return {
                view_height: g,
                scroll_offset: e
            }
        }
    }

    var imagebords=document.getElementsByClassName("mi0");
    for (var i of imagebords){
        i.style.margin = '0';
    }

    //--------------------------------------------------增加页码
    pagenumdiv.style.setProperty('position', "fixed");
    pagenumdiv.style.setProperty('bottom', "5px");
    pagenumdiv.style.setProperty('right', "15px");
    pagenumdiv.style.setProperty('font-size', "15pt");
    pagenumdiv.style.setProperty('z-index', "3");
    pagenumdiv.style.setProperty('background-color', "#34353b");


    if(isShowPagenum)
        $("#bar2").append(pagenumdiv);





    //-------------------------------------------------------------


    GM_registerMenuCommand("（开/关）超长画廊预加载",function(){
        isLongpreload = !isLongpreload;
        GM_setValue('isLongpreload', isLongpreload);
        console.log('isLongpreload:' + isLongpreload);
        GM_notification('你已【'+(isLongpreload?'开':'关')+'】超长画廊预加载');
            if(isLongpreload){
                loadoffset = 300000;
            }else{
                loadoffset = 30000;
            }
    });
    GM_registerMenuCommand("（开/关）图片尺寸修改",function(){
        isAutoResize = !isAutoResize;
        GM_setValue('isAutoResize', isAutoResize);
        console.log('isAutoResize:' + isAutoResize);
        GM_notification('你已【'+(isAutoResize?'开':'关')+'】图片尺寸修改');
    });
    GM_registerMenuCommand("（开/关）页码显示",function(){
        isShowPagenum = !isShowPagenum;
        GM_setValue('isShowPagenum', isShowPagenum);
        console.log('isShowPagenum:' + isShowPagenum);
        GM_notification('你已【'+(isShowPagenum?'开':'关')+'】页码显示，刷新后生效');
    });

})();