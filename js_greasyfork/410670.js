// ==UserScript==
// @name         B站视频截图
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  视频一键截图,提取封面
// @license      MIT
// @author       Bleu_Bleine
// @match        https://www.bilibili.com/*
// @match        https://live.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/410670/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/410670/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.append(`
    Element.prototype._attachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function() {
        return this._attachShadow({mode: 'open'});
    } `);
    (document.head || document.documentElement).appendChild(script);

    var timeFormat = function(currentTime) {
        currentTime = parseInt(currentTime);
        var timeStr = '00_00';
        if(currentTime > 0) {
            var sec = currentTime % 60 <= 9 ? '0'+currentTime % 60 : currentTime % 60;
            var min = Math.floor(currentTime / 60) <= 9 ? '0'+Math.floor(currentTime / 60) : Math.floor(currentTime / 60);
            timeStr = min+'_'+sec;
        }
        return timeStr;
    }

    var onVideoCut = async function() {
        if(typeof player !=='undefined') {
            let videoTime = timeFormat(player.getCurrentTime());
            let imgUrl = await player.readFrameAsDataURL();
            downloadImg(imgUrl,videoTime);
            return;
        }
        if(typeof livePlayer !=='undefined') {
            let video = livePlayer.getVideoEl()
            let videoTime = timeFormat(video.currentTime);
            let imgUrl = livePlayer.capturePic();
            downloadImg(imgUrl,videoTime);
            return;
        }
        var video;
        var videos = $('video').length ? $('video') : $('bwp-video');
        $.each(videos,(i,v) => {
            if(v.currentSrc) video = v;
        });
        if(!video){
            var iframe = document.getElementsByTagName('iframe')[0];
            video = iframe.contentWindow.document.getElementsByTagName('video')[0];
        }
        if(!video) return;
        var canvas = document.createElement('canvas');
        if($('#videoCut').length > 0){
            canvas = document.getElementById('videoCut');
        } else{
            canvas.setAttribute('id','videoCut');
            $('body').append(canvas);
        }
        canvas.setAttribute('width',video.videoWidth);
        canvas.setAttribute('height',video.videoHeight);
        canvas.style.display = 'none';
        var base64;
        if(video.shadowRoot) { //兼容 Microsoft Edge
            base64 = $(video.shadowRoot.lastChild).find('canvas')[0].toDataURL('image/jpeg');
        }else {
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight);
            base64 = canvas.toDataURL('image/jpeg');
        }
        var videoTime = timeFormat(video.currentTime);
        var imgUrl = base64;
        downloadImg(base64,videoTime);
    }

    function downloadImg(imgUrl,videoTime) {
        var eleLink = document.createElement('a');
        var videoTitle = $('#viewbox_report > h1.video-title,.live-skin-main-text,.media-wrapper > h1').attr('title');
        if(!videoTitle) videoTitle = document.title.replace(/-(?:番剧|电影|电视剧|国创)(-全集)?-高清(?:正版|独家)在线观看-bilibili-哔哩哔哩/,'');
        if($('#player-title').length > 0) videoTitle = videoTitle+' '+$('#player-title').text()
        eleLink.download = videoTitle+'_'+videoTime;
        eleLink.href = imgUrl;
        eleLink.click();
        window.URL.revokeObjectURL(eleLink.href);
    }

    async function getCover(bvCode) {
        let data = await $.getJSON('https://api.bilibili.com/x/web-interface/view?bvid='+bvCode)
        if(data && data.code == 0) {
            let url = data.data.pic.replace('http://','https://');
            let response = await fetch(url);
            let blob = await response.blob();
            let imgUrl = window.URL.createObjectURL(blob);
            downloadImg(imgUrl,'封面');
        }
    }

    let keyDownListener = function(e) {if(e.code == 'KeyS' && $(':focus').length == 0) onVideoCut();}
    function shortKeyOn(on) {
        if(on) {
            window.addEventListener('keydown', keyDownListener);
        }else {
            window.removeEventListener('keydown', keyDownListener);
        }
    }

    $(function(){
        var styleEl = document.createElement('style');
        document.head.appendChild(styleEl);
        var styleSheet = styleEl.sheet;
        styleSheet.insertRule('.progress-shadow-show .bilibili-player-video-wrap .top-wrap-cut {visibility: hidden;opacity: 0;}',0);
        styleSheet.insertRule('.video-control-show .bilibili-player-video-wrap .top-wrap-cut {visibility: visible;opacity: 1;}',0);

        var url = window.location.href;
        var bvCode = url.match(/BV[a-zA-Z0-9]+/);
        var useShortKey = true;
        const myCookie = GM_getValue('BZSPJTSK');
        if(myCookie && myCookie == 'off') {
            useShortKey = false;
        }
        shortKeyOn(useShortKey);
        if(url.indexOf('live.bilibili.com') !== -1) {
            setTimeout(function() {
                $('.icon-left-part').append(`<span id='videoCutBtn' title="按S键快速截图" style="margin-left: 6px;cursor: pointer;fill: var(--text4);" class="live-skin-main-text"><svg height="20" version="1.1" viewBox="0 -4 24 24" width="20" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M8,4 C8,1.8 6.2,0 4,0 C1.8,0 0,1.8 0,4 C0,6.2 1.8,8 4,8 C4.6,8 5.1,7.9 5.6,7.6 L8,10 L5.6,12.4 C5.1,12.1 4.6,12 4,12 C1.8,12 0,13.8 0,16 C0,18.2 1.8,20 4,20 C6.2,20 8,18.2 8,16 C8,15.4 7.9,14.9 7.6,14.4 L10,12 L17,19 L21,19 L7.6,5.6 C7.9,5.1 8,4.6 8,4 L8,4 Z M4,6 C2.9,6 2,5.1 2,4 C2,2.9 2.9,2 4,2 C5.1,2 6,2.9 6,4 C6,5.1 5.1,6 4,6 L4,6 Z M4,18 C2.9,18 2,17.1 2,16 C2,14.9 2.9,14 4,14 C5.1,14 6,14.9 6,16 C6,17.1 5.1,18 4,18 L4,18 Z M10,9.5 C10.3,9.5 10.5,9.7 10.5,10 C10.5,10.3 10.3,10.5 10,10.5 C9.7,10.5 9.5,10.3 9.5,10 C9.5,9.7 9.7,9.5 10,9.5 L10,9.5 Z M21,1 L17,1 L11,7 L13,9 L21,1 L21,1 Z"/></svg></span>`);
            },2000);
        }else if(url.indexOf('bangumi') !== -1) {
            setTimeout(function() {
                $('.bpx-player-top-title').after(`<div id='videoCutBtn' title="按S键快速截图" class="top-wrap-cut" style='pointer-events: all;cursor: pointer; margin: 18px 12px 0;;width: 72px;color: #fff;background-color: rgba(0,0,0,.4);line-height: 24px;border-radius: 12px;text-align: center;opacity: 1;-webkit-transition: opacity .2s ease-in-out;transition: opacity .2s ease-in-out;'>截图</div>`);
                $('.bpx-player-top-title').after(`<div id='shortKey' title="是否启用快捷键" class="top-wrap-cut" style='pointer-events: all;cursor: pointer; margin: 18px 0 0;width: 132px;color: #fff;background-color: rgba(0,0,0,.4);line-height: 24px;border-radius: 12px;text-align: center;opacity: 1;-webkit-transition: opacity .2s ease-in-out;transition: opacity .2s ease-in-out;'>快捷键：${useShortKey ? '开':'关'}</div>`);
            },1000);
        }else {
            $('#bilibili-player').prepend(`<button id='videoCutBtn' title="按S键快速截图" style='position: absolute;top:0;right: -26px;display:flex;align-items: center;justify-content: center;padding-left: 4px;width: 30px;color: #fff;border: none;background-color: #ff85ad;height: 24px;border-radius: 4px;cursor: pointer;'><svg height="16px" version="1.1" viewBox="0 0 23 20" width="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M8,4 C8,1.8 6.2,0 4,0 C1.8,0 0,1.8 0,4 C0,6.2 1.8,8 4,8 C4.6,8 5.1,7.9 5.6,7.6 L8,10 L5.6,12.4 C5.1,12.1 4.6,12 4,12 C1.8,12 0,13.8 0,16 C0,18.2 1.8,20 4,20 C6.2,20 8,18.2 8,16 C8,15.4 7.9,14.9 7.6,14.4 L10,12 L17,19 L21,19 L7.6,5.6 C7.9,5.1 8,4.6 8,4 L8,4 Z M4,6 C2.9,6 2,5.1 2,4 C2,2.9 2.9,2 4,2 C5.1,2 6,2.9 6,4 C6,5.1 5.1,6 4,6 L4,6 Z M4,18 C2.9,18 2,17.1 2,16 C2,14.9 2.9,14 4,14 C5.1,14 6,14.9 6,16 C6,17.1 5.1,18 4,18 L4,18 Z M10,9.5 C10.3,9.5 10.5,9.7 10.5,10 C10.5,10.3 10.3,10.5 10,10.5 C9.7,10.5 9.5,10.3 9.5,10 C9.5,9.7 9.7,9.5 10,9.5 L10,9.5 Z M21,1 L17,1 L11,7 L13,9 L21,1 L21,1 Z"/></svg></button>`);
            if(bvCode) {
                $('#bilibili-player').prepend(`<button id='getCoverBtn' title="获取当前视频封面" style='position: absolute;top: 30px;right: -26px;display:flex;align-items: center;justify-content: center;padding-left: 4px;width: 30px;color: #fff;border: none;background-color: #ff85ad;height: 24px;border-radius: 4px;cursor: pointer;'><svg height="16px" version="1.1" width="16px" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0Zm3,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H19a3,3,0,0,1,3,3Z"/><path class="cls-1" d="M7,10A3,3,0,1,0,4,7,3,3,0,0,0,7,10ZM7,6A1,1,0,1,1,6,7,1,1,0,0,1,7,6Z"/><path class="cls-1" d="M16.707,10.293a.956.956,0,0,0-.74-.293,1.006,1.006,0,0,0-.72.341L12.217,13.8l-2.51-2.511a1,1,0,0,0-1.414,0l-4,4a1,1,0,1,0,1.414,1.414L9,13.414l1.9,1.9L8.247,18.341a1,1,0,0,0,1.506,1.318l3.218-3.678.006,0,.007-.011,3.065-3.5,2.244,2.244a1,1,0,0,0,1.414-1.414Z"/></svg></button>`);
            }
            $('#bilibili-player').prepend(`<button id='shortKey' title="是否启用快捷键" style='position: absolute;top: 60px;right: -26px;display:flex;align-items: center;justify-content: center;padding-left: 4px;width: 30px;color: #fff;border: none;background-color: ${useShortKey ? '#ff85ad' : '#999'};height: 24px;border-radius: 4px;cursor: pointer;'><svg fill="#fff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M16.25 20.4995C16.6642 20.4995 17 20.8353 17 21.2495C17 21.6292 16.7179 21.943 16.3518 21.9927L16.25 21.9995H7.75001C7.3358 21.9995 7.00001 21.6637 7.00001 21.2495C7.00001 20.8698 7.28217 20.556 7.64824 20.5064L7.75001 20.4995H16.25ZM11.0066 2.3707C11.7 1.89152 12.6414 1.97711 13.2369 2.57346L13.3444 2.69124L21.2094 12.1292C21.4714 12.4437 21.615 12.8401 21.615 13.2495C21.615 14.1677 20.9079 14.9207 20.0085 14.9937L19.865 14.9995H16.999L17 17.2495C17 18.1167 16.3693 18.8365 15.5416 18.9753L15.3935 18.9937L15.25 18.9995H8.75001C7.83184 18.9995 7.07882 18.2924 7.00581 17.393L7.00001 17.2495L6.99901 14.9995H4.13505C3.84263 14.9995 3.55682 14.9263 3.30276 14.7889L3.15433 14.6989L3.01473 14.5939C2.3135 14.0095 2.18506 12.9928 2.69419 12.2561L2.79067 12.1292L10.6556 2.69124L10.7626 2.57413L10.8797 2.46718L11.0066 2.3707ZM12.1921 3.65152C12.1184 3.56313 11.9967 3.53845 11.8967 3.58383L11.84 3.61951L11.808 3.65152L3.943 13.0895C3.85461 13.1955 3.86894 13.3532 3.97501 13.4416C4.00496 13.4665 4.04011 13.484 4.07755 13.4928L4.13505 13.4995H7.75001C8.12971 13.4995 8.4435 13.7817 8.49317 14.1477L8.50001 14.2495V17.2495C8.50001 17.3679 8.58225 17.467 8.69269 17.4929L8.75001 17.4995H15.25C15.3684 17.4995 15.4675 17.4173 15.4934 17.3068L15.5 17.2495V14.2495C15.5 13.8698 15.7822 13.556 16.1482 13.5064L16.25 13.4995H19.865C20.003 13.4995 20.115 13.3876 20.115 13.2495C20.115 13.2105 20.1059 13.1724 20.0887 13.1379L20.057 13.0895L12.1921 3.65152Z"/></svg></button>`);
        }
        $('body').on('click','#videoCutBtn',function() {onVideoCut();});
        $('body').on('click','#getCoverBtn',function() {getCover(bvCode[0]);});
        $('body').on('click','#shortKey',function() {
            useShortKey = !useShortKey;
            shortKeyOn(useShortKey);
            $('#bilibili-player > #shortKey').css('background-color',useShortKey ? '#ff85ad' : '#999');
            $('#shortKey.top-wrap-cut').text(`快捷键：${useShortKey ? '开':'关'}`);
            GM_setValue('BZSPJTSK',useShortKey ? 'on' : 'off');
        });
    });
})();