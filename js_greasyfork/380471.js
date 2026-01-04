// ==UserScript==
// @name         唱吧音乐下载
// @namespace    https://raw.githubusercontent.com/UndCover/js4monkey/master/scripts/%E5%94%B1%E5%90%A7%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.js
// @supportURL   https://github.com/UndCover/js4monkey
// @homepage     https://greasyfork.org/zh-CN/scripts/380471
// @version      1.01
// @icon         https://changba.com/favicon.ico
// @description  唱吧音乐、MV下载
// @author       UndCover
// @match        *://changba.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380471/%E5%94%B1%E5%90%A7%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/380471/%E5%94%B1%E5%90%A7%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Base64
    var l = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    function o(A) {
        var z, y, w, u;
        var x, t, v;
        t = A.length;
        x = 0;
        v = "";
        while (x < t) {
            do {
                z = l[A.charCodeAt(x++) & 255]
            } while (x < t && z == -1);
            if (z == -1) {
                break
            }
            do {
                y = l[A.charCodeAt(x++) & 255]
            } while (x < t && y == -1);
            if (y == -1) {
                break
            }
            v += String.fromCharCode((z << 2) | ((y & 48) >> 4));
            do {
                w = A.charCodeAt(x++) & 255;
                if (w == 61) {
                    return v
                }
                w = l[w]
            } while (x < t && w == -1);
            if (w == -1) {
                break
            }
            v += String.fromCharCode(((y & 15) << 4) | ((w & 60) >> 2));
            do {
                u = A.charCodeAt(x++) & 255;
                if (u == 61) {
                    return v
                }
                u = l[u]
            } while (x < t && u == -1);
            if (u == -1) {
                break
            }
            v += String.fromCharCode(((w & 3) << 6) | u)
        }
        return v
    }
    //Base64 end

    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    function IsPC2(){
        var system = {
            win: false,
            mac: false,
            xll: false,
            ipad:false
        };
        //检测平台
        var p = navigator.platform;

        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;

        if (system.win || system.mac || system.xll ||system.ipad) {
            platform = 1;
            return true;
        } else {
            platform = 0;
            return false;
        }
    }
    if(IsPC()){
        console.log("======================PC=====================")
        // 1. reset width
        $('span.info').css('width','60px')
        // 2. get link
        var _src = "#";
        var _player=document.getElementById("audio")
        if(_player){
            _src = _player.src;
        }else{
            var vUrl = jplayer.video_url
            _src=o(vUrl);
        }
        console.log(_src)
        var newElement = "<span class='download' data-status='0'><em><a href='"+_src+"'>下载</a></em></span>"
        $("span.fav").after(newElement);
    }else{
        console.log("====================MOBILE===================")
        var _mplayer=$("audio#audio")
        if(!_mplayer){
            _mplayer=$("video#video")
        }

        if(_mplayer){
            var _msrc = _mplayer.attr("src")
            console.log(_msrc)
            // <div class="user-title">
            var newElement="<span class='download listen-num ' style='border: solid red 1px;'><em><a href='"+_msrc+"' style='color: red;'>下载</a></em></span>"
            $("div.user-title").after(newElement);
        }else{
            console.log("==============================ERROR========================")
        }
    }
})();