// ==UserScript==
// @name              自动跳过视频广告
// @namespace
// @version           1.2.1
// @description       自用脚本, 自动跳过视频广告, 当前支持 腾讯, 爱奇艺(体育), 优酷, 搜狐, 芒果tv, pptv, 央视视频
// @author            daniel
// @icon              data:image/png;base64,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
// @namespace
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @match             https://xbeibeix.com/api/bilibili/biliplayer/*
// @match             *://v.qq.com/x/cover/*
// @match             *://m.v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://m.v.qq.com/x/page/*
// @match             *://m.v.qq.com/*
// @match             *://www.iqiyi.com/v*
// @match             *://m.iqiyi.com/*
// @match             *://www.iqiyi.com/*
// @match             *://m.iqiyi.com/kszt/*
// @match             *://www.iqiyi.com/kszt/*
// @match             *://sports.iqiyi.com/*
// @match             *://v.youku.com/v_show/*
// @match             *://m.youku.com/alipay_video/*
// @match             *://w.mgtv.com/b/*
// @match             *://m.mgtv.com/b/*
// @match             *://www.mgtv.com/b/*
// @match             *://tv.sohu.com/v/*
// @match             *://m.tv.sohu.com/v/*
// @match             *://film.sohu.com/album/*
// @match             *://m.film.sohu.com/album/*
// @match             *://www.le.com/ptv/vplay/*
// @match             *://m.le.com/ptv/vplay/*
// @match             *://v.pptv.com/show/*
// @match             *://m.pptv.com/show/*
// @match             *://vip.pptv.com/show/*
// @match             *://tv.cctv.com/live/*
// @license           GPL License
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/415875/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/415875/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $ = $ || window.$;
    var host = location.host

    function generic() {
        setInterval(() => {
            let $ad = $('body').find('video')
            if ($ad) {
                if ($ad.get()) {
                    let videos = $ad.get()
                    // console.log(videos.length)
                    for (let video of videos) {
                        let srcVal = $(video).attr('src')
                        // console.log(srcVal)
                        if (srcVal && !srcVal.startsWith('blob:')) {
                            video.currentTime = 1000
                        }
                    }
                }
            }
        }, 1000)
    }

    switch (host) {
        case 'www.iqiyi.com':  // 爱奇艺
            setInterval(() => {
                var skip_guanggao = document.getElementsByClassName("skippable-after")[0]
                if (skip_guanggao) {
                    // 防止无限弹窗, 具体弹窗原因还没找到...
                    if (skip_guanggao.href === 'javascript:;' && skip_guanggao.style.display === 'none') {
                        skip_guanggao.click()
                    }
                }
            }, 1000)
            break

        case 'sports.iqiyi.com':  // 爱奇艺体育, 最近看温网的时候加的:)
            setInterval(() => {
                let container = document.getElementById('engine-container');
                let ads = document.getElementsByTagName('video')
                if (ads && container
                    && container.style['pointer-events'] === 'auto'
                    && container.style['cursor'] === 'pointer') {
                    for (let video of ads) {
                        video.currentTime = 1000
                    }
                }
            }, 1000)
            break

        case 'v.qq.com':  // 腾讯视频
            generic()
            break

        case 'v.youku.com':  // 优酷视频
            generic();
            break

        case 'www.mgtv.com':   // 芒果tv
            generic()
            break

        case 'tv.sohu.com':  // 搜狐视频
            generic()
            break

        case 'v.pptv.com':  // pptv
            generic()
            break

        case 'tv.cctv.com':  // 央视视频看奥运, 中国队加油!
            setInterval(() => {
                let container = document.getElementById('ticktack_player');
                if (container) {
                    // 存在广告
                    let ads = document.getElementsByTagName('video');
                    if (ads) {
                        for (let video of ads) {
                            video.currentTime = 1000
                        }
                    }
                }
            }, 1000)
            break


    }

})();
