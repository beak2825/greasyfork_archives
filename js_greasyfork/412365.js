// ==UserScript==
// @name         fmh img cache
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  图片缓存、加速
// @author       FuMan
// @match        *://m.fmhuaaa.net/manhua/*/*.html
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      fmimg.tk
// @webRequest   [{"selector":"*/b.js","action":"cancel"}]
// @downloadURL https://update.greasyfork.org/scripts/412365/fmh%20img%20cache.user.js
// @updateURL https://update.greasyfork.org/scripts/412365/fmh%20img%20cache.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let url = 'https://fmimg.tk'
    window.addEventListener('DOMContentLoaded', function () {
        change_nofind();
        try {
            b();
        }
        catch (e) {
            console.log(e);
        }
        if (unsafeWindow.imgurl) {
            let img = new Image();
            img.src = url + '/get_img?url=' + unsafeWindow.imgurl;
            img.style = 'display: none';
            document.body.appendChild(img);
        }
        if (unsafeWindow.nexturl && unsafeWindow.nexturl.slice(-1) !== '#') {
            let img = new Image();
            img.src = url + '/get_img?url=' + unsafeWindow.nexturl;
            img.style = 'display: none';
            document.body.appendChild(img);
        }
    }, false);
    function change_nofind() {
        if (unsafeWindow.nofind) {
            unsafeWindow.nofind = nofind;
        }
        else {
            setTimeout(change_nofind, 10);
        }
    }
    function nofind() {
        let img = document.getElementById('bigpic');
        img.onerror = null;
        img.src = url + '/get_img?url=' + unsafeWindow.imgurl;
    }
    function b() {
        unsafeWindow.servername = unsafeWindow.getCookie('servername')
        if (unsafeWindow.servername == 9) {
            unsafeWindow.imgurl = "http://cn.xzglasses.com:50800" + unsafeWindow.imgurl;
            unsafeWindow.nexturl = "http://cn.xzglasses.com:50800" + unsafeWindow.nexturl;
        }
        else if (unsafeWindow.servername == 1) {
            unsafeWindow.imgurl = "http://pic2.fumanhua.net" + unsafeWindow.imgurl;
            unsafeWindow.nexturl = "http://pic2.fumanhua.net" + unsafeWindow.nexturl;
        } else if (unsafeWindow.servername == 2) {
            unsafeWindow.imgurl = "http://pic2.fumanhua.net" + unsafeWindow.imgurl;
            unsafeWindow.nexturl = "http://pic2.fumanhua.net" + unsafeWindow.nexturl;
        } else if (unsafeWindow.servername == 3) {
            unsafeWindow.imgurl = "http://pic.fumanhua.net" + unsafeWindow.imgurl;
            unsafeWindow.nexturl = "http://pic.fumanhua.net" + unsafeWindow.nexturl;
        }
        document.getElementById("bigpic").src = unsafeWindow.imgurl;
    }
})();