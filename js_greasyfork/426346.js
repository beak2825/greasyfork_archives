// ==UserScript==
// @name        piapro 連続再生
// @namespace   https://greasyfork.org/zh-CN/scripts/426346-piapro-%E9%80%A3%E7%B6%9A%E5%86%8D%E7%94%9F
// @match       https://piapro.jp/
// @grant       none
// @grant       GM_addStyle
// @version     1.1
// @author      neysummer2000
// @description 2021/5/12下午4:16:43
// @downloadURL https://update.greasyfork.org/scripts/426346/piapro%20%E9%80%A3%E7%B6%9A%E5%86%8D%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/426346/piapro%20%E9%80%A3%E7%B6%9A%E5%86%8D%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('._active{background-color: deepskyblue !important;}');


    var isPC = unsafeWindow.piapro_play_music == undefined;
    if (isPC) {
        unsafeWindow.piapro_play_music = function(contentId, createDate) {
            var prefix = contentId.substr(0, 2);
            var audio_src = 'https://cdn.piapro.jp/mp3_a/' + prefix + '/' + contentId + '_' + createDate + '_audition.mp3';
            if (unsafeWindow.audio == undefined) {
                unsafeWindow.audio = new Audio();
            }
            unsafeWindow.audio.src = audio_src;
            unsafeWindow.autoplay = true;
            console.log(audio_src)
            unsafeWindow.audio.play();
            registerEvent();
            setActive(document.querySelector('#_item_' + unsafeWindow.now_playing))
        }
        unsafeWindow.playCard = function(p1, contentId, createDate) {
            unsafeWindow.now_playing = contentId;
            unsafeWindow.piapro_play_music(contentId, createDate);
        }
    } else {
        var fun = unsafeWindow.piapro_play_music;
        unsafeWindow.piapro_play_music = function(contentId, createDate) {
            fun(contentId, createDate);
            setActive(document.getElementById('button_' + now_playing).parentElement.parentElement);
        }
        registerEvent();
    }


    function registerEvent() {
        var next, btnClass;
        unsafeWindow.audio.onended = function() {
            if (isPC) {
                next = document.querySelector('#_item_' + unsafeWindow.now_playing).nextElementSibling;
                btnClass = 'a';
            } else {
                var next = document.getElementById('button_' + now_playing).parentElement.parentElement.nextElementSibling;
                btnClass = '.btn_play';

            }
            if (next != undefined) {
                next.querySelector(btnClass).click();
            }
        }
    }

    function setActive(dom) {
        var actived = document.querySelector('._active');
        if (actived != undefined) {
            actived.classList.remove('_active');
        } else {
            unsafeWindow.audio.ontimeupdate = function() {
                if (this.currentTime > 0 && dom) document.title = '[' + parseInt(this.currentTime / this.duration * 100) + '%' + ']' + document.querySelector('._active').querySelector(isPC ? '.title' : '.over-txt').innerText;
            }
        }
        if (dom != undefined) {
            dom.classList.add('_active');
            document.title = dom.querySelector(isPC ? '.title' : '.over-txt').innerText;
        }
    }


})();