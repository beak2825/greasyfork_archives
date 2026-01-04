// ==UserScript==
// @name         youtube一键切换自动翻译的中文字幕
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @version      0.2.4
// @description  油管自动跳广告,自动打开翻译字幕,如果打开失败，请手动点击一下字幕按钮
// @author       wlpha
// @match        *://www.youtube.com/watch?v=*
// @match        *://www.youtube.com
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429003/youtube%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E7%9A%84%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429003/youtube%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E7%9A%84%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==


// 测试环境 - 全部通过
// 其他字幕 - https://www.youtube.com/watch?v=vf542A1poBs
// 中文字幕 - https://www.youtube.com/watch?v=kLNe5c5qGGA
// 台湾字幕 - https://www.youtube.com/watch?v=UXAdlaUhrlE
// 香港字幕 - https://www.youtube.com/watch?v=lN6OU04gqpU
// 英语字幕 - https://www.youtube.com/watch?v=pWDHeAQWKAA
// 其他自动生成字幕


(function() {
    'use strict';
    var lang = null;
    function i8nInit(){
        try{
            lang = document.querySelector('html').getAttribute('lang').trim();
        }catch(err){

        };
    }

    function tr(text) {
        switch(lang) {
            case 'zh-CN':
            case 'zh':
                return i8nZhHans(text);
            case 'zh-TW':
            case 'zh-HK':
                return i8nZhHant(text);
            case 'en-US':
            case 'en':
            case 'en-GB':
                return i8nEnUS(text);
            default:
                return text;
        }
    }

    function i8nZhHans(text) {
        switch(text){
            case '开启翻译字幕':
            case '关闭翻译字幕':
            case '字幕':
            case '添加字幕':
            case '关闭':
            case '中文':
            case '简体':
            case '繁体':
            case '台湾':
            case '香港':
            case '自动翻译':
            case '自动生成':
            default:
                break;
        }
        return text;
    }

    function i8nZhHant(text) {
        switch(text){
            case '开启翻译字幕':
                return '開啟翻譯字幕';
            case '关闭翻译字幕':
                return '關閉翻譯字幕';
            case '字幕':
                return '字幕';
            case '添加字幕':
                return '新增字幕';
            case '关闭':
                return '關閉';
            case '中文':
                return '中文';
            case '简体':
                return '簡體';
            case '繁体':
                return '繁體';
            case '台湾':
                return '台灣';
            case '香港':
                return '香港';
            case '自动翻译':
                return '自動翻譯';
            case '自动生成':
                return '自動產生'
            default:
                break;
        }
        return text;
    }

    function i8nEnUS(text) {
        switch(text){
            case '开启翻译字幕':
                return 'Turn on subtitles';
            case '关闭翻译字幕':
                return 'Turn off subtitles';
            case '字幕':
                return 'Subtitles/CC';
            case '添加字幕':
                return 'add subtitles/CC';
            case '关闭':
                return 'off';
            case '中文':
                return 'Chinese (Simplified)';
            case '简体':
                return 'Chinese (Simplified)';
            case '繁体':
                return 'Chinese (Traditional)';
            case '台湾':
                return 'Chinese (Taiwan)';
            case '香港':
                return 'Chinese (Hong Kong)';
            case '自动翻译':
                return 'Auto-translate';
            case '自动生成':
                return 'auto-generated'
            default:
                break;
        }
        return text;
    }

    function getAbsPosition(el){
        var el2 = el;
        var curtop = 0;
        var curleft = 0;
        if (document.getElementById || document.all) {
            do{
                curleft += el.offsetLeft-el.scrollLeft;
                curtop += el.offsetTop-el.scrollTop;
                el = el.offsetParent;
                el2 = el2.parentNode;
                while (el2 != el) {
                    curleft -= el2.scrollLeft;
                    curtop -= el2.scrollTop;
                    el2 = el2.parentNode;
                }
            } while (el.offsetParent);

        } else if (document.layers) {
            curtop += el.y;
            curleft += el.x;
        }
        return [curtop, curleft];
    };

    function getPlayer() {
        var player = document.querySelector('#ytd-player') || document.querySelector('#player');
        // 如果播放器的设置不在可视区域，就停止自动开启翻译
        var [x, y] = [0, 0]
        try {
            [x, y] = getAbsPosition(player);
        } catch(e) {
            return;
        }

        var visible_area = y + player.clientHeight - 250;
        if (document.scrollingElement.scrollTop > visible_area) {
            return null;
        }

        return player;
    }

    // 添加开关
    function InitTranslateButton(){
        var coltrol_place = document.querySelector('.ytp-chrome-controls .ytp-right-controls');
        if(coltrol_place && coltrol_place.querySelector('.plugins-trans-btn') == null) {
            var trans_coltrol_btn = document.createElement('button');
            trans_coltrol_btn.className = 'plugins-trans-btn';
            trans_coltrol_btn.style = 'position: relative;top: -36%; margin-right:10px; border-radius: 25px;border: none; opacity: 0.95; background-color: #fff; outline:none;';

            trans_coltrol_btn.onclick = function(){
                var trans_coltrol_state = window.localStorage.getItem('plugins-trans-state');
                if(trans_coltrol_state == 'on') {
                    window.localStorage.setItem('plugins-trans-state', 'off');
                    trans_coltrol_btn.innerText = tr('开启翻译字幕');
                    removeSubtitlesTrans();
                } else {
                    window.localStorage.setItem('plugins-trans-state', 'on');
                    trans_coltrol_btn.innerText = tr('关闭翻译字幕');
                }
            }

            if(isEnableTranslate()){
                trans_coltrol_btn.innerText = tr('关闭翻译字幕');
            } else {
                trans_coltrol_btn.innerText = tr('开启翻译字幕');
            }
            // 屏蔽youtube强行添加的事件
            trans_coltrol_btn.addEventListener = function() {};
            coltrol_place.prepend(trans_coltrol_btn);
        }
    }

    function isEnableTranslate(){
        var transState = window.localStorage.getItem('plugins-trans-state');
        return transState == 'on';
    }

    function hasOpenVideoSettings(){
        var menu = document.querySelector('.ytp-popup.ytp-settings-menu');
        return menu && menu.style.display != 'none';
    }

    function closeVideoSettingsPlace(){
        var menuPlace = document.querySelector('.ytp-settings-menu');
        var menuPlaceBtn = document.querySelector('.ytp-settings-button');
        if(menuPlace && menuPlace.style.display != 'none') {
            menuPlaceBtn.click();
        }
    }

    function openVideoSettingsPlace(callback){
        if(!hasOpenVideoSettings()) {
            var menuPlaceBtn = document.querySelector('.ytp-settings-button');
            if(menuPlaceBtn) {
                menuPlaceBtn.click();
                callback();
            }
        } else {
            callback();
        }
    }

    function hasVideoSubtitles(){
        var dom = document.querySelector('.ytp-subtitles-button.ytp-button');
        return dom != null && dom.style.display != 'none';
    }

    // 需要修改
    function openVideoSubtitles(){
        var settingsPlaceItems = document.querySelectorAll('.ytp-popup.ytp-settings-menu .ytp-menuitem');
        settingsPlaceItems.forEach(function(item) {
            if(item.innerText && item.innerText.indexOf(tr('字幕')) > -1 && item.innerText.indexOf(tr('添加字幕')) == -1) {
                item.click();
                return;
            }
        });

        // 内置简体字幕
        settingsPlaceItems.forEach(function(item) {
            if(item.innerText && item.innerText.indexOf(tr('简体')) > -1) {
                item.click();
                // 防止无限点击菜单
                setSubtitlesTrans('zh-Hans');
                closeVideoSettingsPlace();
                return;
            }
        });

        var curLnag = getSubtitlesTrans();
        if(curLnag == 'inner-Substitle') {
            // 如果没有简体字，就打开自动翻译
            settingsPlaceItems.forEach(function(item) {
                if(item.innerText && item.innerText.indexOf(tr('自动翻译')) > -1) {
                    item.click();
                    setSubtitlesTrans('inner-Substitle');
                    return;
                }
            });

        } else if(curLnag != 'zh-Hans') {
            // 如果没有就打开繁体字
            settingsPlaceItems.forEach(function(item) {
                if(item.innerText) {
                    ['繁体', '台湾', '香港', '中文'].forEach(function(langText) {
                        langText = tr(langText)
                        if(item.innerText.indexOf(langText) > -1) {
                            item.click();
                            setSubtitlesTrans('inner-Substitle');
                            closeVideoSettingsPlace();
                            return;
                        }
                    });
                }
            });

            var title = document.querySelector('.ytp-button.ytp-panel-title').innerText.trim();
            if(title.indexOf(tr('字幕')) >= -1) {
                // 没有中文相关字幕，就随便选一个字幕,然后才自动翻译
                settingsPlaceItems.forEach(function(item) {
                    if(item.innerText) {
                        var langText = item.innerText.trim();
                        if(langText.indexOf(tr('添加字幕')) == -1 && langText.indexOf(tr('关闭')) == -1) {
                            setSubtitlesTrans('inner-Substitle');
                            closeVideoSettingsPlace();
                            return;
                        }
                    }
                });

                settingsPlaceItems.forEach(function(item) {
                    if(item.innerText && item.innerText.indexOf(tr('自动生成')) > -1) {
                        item.click();
                        setSubtitlesTrans('inner-Substitle');
                        closeVideoSettingsPlace();
                        return;
                    }
                });
            }
        }
    }

    function displaySubtitles() {
        var subtitle = document.querySelector('.ytp-subtitles-button.ytp-button[aria-pressed="false"]');
        if(subtitle) {
            subtitle.click();
        }
    }

    function isSubtitlesTrans(){
        // curLang == 'zh-Hant'
        // 统一所有语言设置翻译为简体中文
        // en-UK: en-gb
        // en-US:  en
        // zh-CN zh-Hans zh-Hant
        return getSubtitlesTrans() == 'zh-Hans';
    }

    function removeSubtitlesTrans() {
        try {
            document.querySelector('.ytp-player-content').removeAttribute('translate-zh-hans');
        }catch(err) {

        }
    }

    function getSubtitlesTrans(){
        try {
            return document.querySelector('.ytp-player-content').getAttribute('translate-zh-hans');
        }catch(err) {
            return lang;
        }
    }

    function setSubtitlesTrans(lang) {
        document.querySelector('.ytp-player-content').setAttribute('translate-zh-hans', lang);
    }

    function openSubtitles(){

        if(hasVideoSubtitles()) {
            displaySubtitles();

            var isTrans = isSubtitlesTrans();
            console.log(isTrans);
            if(isTrans == false) {
                // 采用callback方式打开和关闭，防止settimeout导致的问题
                openVideoSettingsPlace(function() {
                    // 切换字幕
                    openVideoSubtitles();
                });
            }
        } else {
            try {
                // 防止切换视频过程，打开字幕，不关闭
                var title = document.querySelector('.ytp-button.ytp-panel-title').innerText.trim();
                if(title.indexOf(tr('字幕')) >= -1) {
                    closeVideoSettingsPlace();
                }
            }catch(err) {

            }
        }
    }

    function updateColtrolButtonState() {
        var transState = window.localStorage.getItem('plugins-trans-state');
        var transBtn = document.querySelector('.plugins-trans-btn')
        if(transBtn) {
            if(transState == 'on' && transBtn.innerText != tr('关闭翻译字幕')) {
                transBtn.innerText = tr('关闭翻译字幕');
            } else if(transState == 'off' && transBtn.innerText != tr('开启翻译字幕')) {
                transBtn.innerText = tr('开启翻译字幕');
            }
        }
    }

    function hidePageAds()
    {
        ['.video-ads', '#player-ads'].forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(elment){
                elment.style.display = 'none';
            });
        });
    }

    function isVideoAdsTime(){
        var ad = document.querySelector('.ad-showing');
        var skipAdButton = document.querySelector('.ytp-ad-skip-button');

        var volumeOpenState = document.querySelector("#ytp-svg-volume-animation-mask");
        var volumeButton = document.querySelector('.ytp-mute-button');
        // 判断有没有广告
        if(ad){
            // 关闭音量
            if(volumeOpenState && volumeButton)
            {
                volumeButton.click();
            }
        } else {
            // 正常视频，打开音量
            if(volumeOpenState == null && volumeButton){
                volumeButton.click();
            }
        }

        // 跳过广告
        if(skipAdButton)
        {
            skipAdButton.click();
        }
        return ad != null;
    }

    function main() {
        i8nInit();
        setInterval(
            function() {
                // 不显示错误信息
                try{
                    getPlayer() && (function(){
                        InitTranslateButton();
                        updateColtrolButtonState();
                        if(isEnableTranslate()){
                            hidePageAds();
                            if(!isVideoAdsTime()) {
                                openSubtitles();
                            }
                        }
                    })();
                }catch(err) {

                }
            },
            500
        )
    };
    main();

})();