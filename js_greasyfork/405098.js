// ==UserScript==
// @name         废柴视频网显示下载链接
// @namespace    https://sleazyfork.org/zh-CN/users/193133-pana
// @version      3.1.9
// @description  显示下载链接，修改下载视频按钮，允许直接播放VIP视频，移除播放器界面上多余的元素，允许下载高清视频，顺便去广告
// @author       pana
// @include      http*://*1fcw.me/*
// @include      /fcww\d+\.com/
// @connect      feic55.com
// @license      MIT License
// @grant        GM_xmlhttpRequest
// @note         地址发布页: https://www.ebay.com/usr/fcpor0
// @downloadURL https://update.greasyfork.org/scripts/405098/%E5%BA%9F%E6%9F%B4%E8%A7%86%E9%A2%91%E7%BD%91%E6%98%BE%E7%A4%BA%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/405098/%E5%BA%9F%E6%9F%B4%E8%A7%86%E9%A2%91%E7%BD%91%E6%98%BE%E7%A4%BA%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const AD_RUL_REG = /[\d]+\.com/i;
    const PRO_VIDEO_ID = location.pathname.replace(/\/videos\/(\d+)\/.*/, "$1");
    const STYLE_VALUE = `
        #kt_player > a {
            z-index: -1 !important;
        }
        div.info div, .avatar, .block-user, .added-by {
            display: block !important;
        }
        .fp-poster img {
            left: 0px !important;
        }
        .a[href="//vkspalyer.com"] {
            display: none !important;
        }
    `;
    function create_Video_Player(videos_link, preview_value) {
        $('.player-holder').html('<div class="player-wrap" style="width: 100%; height: 0; padding-bottom: 46.258503401361%"><div id="kt_player"></div></div><script type="text/javascript" src="/player/kt_player.js?v=4.0.4"></script>');
        var flashvars = {
            video_id: PRO_VIDEO_ID,
            license_code: '$382903112632644',
            lrc: '41256868',
            rnd: new Date().getTime(),
            video_url: videos_link.replace(/\/\?(download)?.*/, '/'),
            video_url_hd: '1',
            postfix: '.mp4',
            preview_url: preview_value,
            skin: 'youtube_mod.css',
            logo_position: '0,0',
            logo_anchor: 'topleft',
            bt: '3',
            volume: '1',
            preload: 'metadata',
            hide_controlbar: '0',
            hide_style: 'fade',
            related_src: '/related_videos_html/' + PRO_VIDEO_ID + '/',
            embed: '1'
        };
        var params = {
            allowfullscreen: 'true',
            allowscriptaccess: 'always'
        };
        kt_player('kt_player', '/player/kt_player.swf?v=4.04', '100%', '100%', flashvars, params);
    }
    function bytes_To_Size(bytes) {
        if (bytes === 0) {
            return '0 B';
        }
        let b = 1024;
        let sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(b));
        let num = bytes / Math.pow(b, i);
        return num.toFixed(2) + ' ' + sizes[i];
    }
    function create_Hd_Video_Download_Btn(hd_link, video_ext) {
        let hd_details = {
            'method': 'HEAD',
            'url': hd_link,
            'onload': function(res) {
                if (res.responseHeaders) {
                    let bytes = /content-length:\s*(\d+)/i.exec(res.responseHeaders)[1];
                    let size_str = bytes_To_Size(Number(bytes));
                    let btn = document.createElement('a');
                    btn.href = hd_link;
                    btn.target = '_self';
                    btn.innerText = '720P: ' + video_ext + ', ' + size_str;
                    btn.title = '下载高清视频';
                    $('div.info div:last').append(btn);
                }
            },
            'onerror': function() {
                console.error('高清视频链接失败!');
            }
        };
        GM_xmlhttpRequest(hd_details);
    }
    function init() {
        let style_dom = document.createElement('style');
        style_dom.type = 'text/css';
        style_dom.innerHTML = STYLE_VALUE;
        document.body.appendChild(style_dom);
        $('div#layui-layer1').remove();
        $('div#layui-layer-shade1').remove();
        if ($('div.content').length > 1) {
            $('div.content:eq(0)').remove();
        }
        $('div.list-videos div.item a img.thumb.lazy-load').each(function () {
            this.src = $(this).attr('data-original');
        });
        $('div.list-videos:first div.item:lt(2)').each(function () {
            if (AD_RUL_REG.test($(this).find('a').attr('title'))) {
                $(this).remove();
            }
        });
        $('span.dmcenterb').remove();
        $('div.all960').remove();
        $('.block-video .opt').remove();
        $('#pop').remove();
        let videos_link = $('div.info div.item:last a').attr('href');
        if (videos_link) {
            $('a.toggle-button:contains("下载视频")').removeAttr('onclick').attr('href', videos_link);
            if ($('.no-player').length === 1) {
                create_Video_Player(videos_link, $('.no-player > img').attr('src'));
            }
            let details = {
                'method': 'HEAD',
                'url': videos_link,
                'onload': function(res) {
                    console.info(res.finalUrl);
                    if (res.finalUrl && res.responseHeaders) {
                        let ext = /content-type:\s*video\/(\w+)/i.exec(res.responseHeaders)[1];
                        let ext_reg = new RegExp('(\\.' + ext + ')', 'gi');
                        let hd_link = res.finalUrl.replace(ext_reg, '_720p' + '$1');
                        create_Hd_Video_Download_Btn(hd_link, ext);
                    }
                },
                'onerror': function() {
                    console.error('链接失败!');
                }
            };
            GM_xmlhttpRequest(details);
        }
        $('#kt_player > a').remove();
        $('#kt_player a.fp-brand').remove();
        $('#kt_player a.fp-settings').remove();
        $('.block-screenshots span.item img').each(function () {
            let img_src = $(this).attr('data-original');
            $(this).unwrap();
            $(this).wrap('<a class="item" rel="screenshots" data-fancybox-type="image" href="' + img_src + '"></a>');
        });
        $('cloudflare-app').remove();
        try {
            let observer = new MutationObserver(function () {
                $('cloudflare-app').remove();
            });
            let listener_container = document.querySelector("body");
            let option = {
                'childList': true,
                'subtree': true
            };
            observer.observe(listener_container, option);
        } catch (e) {
            console.log(e);
        }
    }
    init();
})();
