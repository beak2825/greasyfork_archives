// ==UserScript==
// @name         新浪微博详情页简洁版
// @namespace    https://github.com/Jeffrey-deng/userscript
// @version      0.1
// @description  clean weibo detail page
// @author       Jeffrey.Deng
// @supportURL   https://imcoder.site/u/center/sendLetter?chatuid=1016726508048
// @homepageURL  https://imcoder.site
// @weibo        http://weibo.com/3983281402
// @match        https://weibo.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/404199/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E8%AF%A6%E6%83%85%E9%A1%B5%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/404199/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E8%AF%A6%E6%83%85%E9%A1%B5%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function() {

    const href = document.location.href;
    let switch_simple_weibo_style_id,
        styleElem;

    const addGlobalStyle = GM_addStyle || function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('html')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
        return style;
    };

    const switchSimpleWeiboStyle = function(on) { // 切换收藏时自动备份的设置值
        let saveValue = !!on;
        if (switch_simple_weibo_style_id) {
            GM_unregisterMenuCommand(switch_simple_weibo_style_id);
        }
        if (saveValue) {
            switch_simple_weibo_style_id = GM_registerMenuCommand('关闭简洁版样式', function() {
                switchSimpleWeiboStyle(false);
                // toastr.success("已关闭简洁版样式~");
            });
        } else {
            switch_simple_weibo_style_id = GM_registerMenuCommand('开启简洁版样式', function() {
                switchSimpleWeiboStyle(true);
                // toastr.success("已开启简洁版样式~");
            });
        }
        if (saveValue && !styleElem) {
            const main_width = 920, img_width = main_width - 100;
            styleElem = addGlobalStyle(
                '.B_page .WB_frame {' +
                '    width: ' + main_width + 'px!important;' +
                '}' +
                '.B_page .WB_frame #plc_main {' +
                '    width: ' + (main_width + 20) + 'px;!important;' +
                '}' +
                '.WB_frame_c {' +
                '    width: ' + main_width + 'px!important;' +
                '}' +
                '.WB_feed_v3 .WB_media_view, .WB_feed_v3 .WB_media_view .media_show_box li {' +
                '    width: ' + img_width + 'px!important;' +
                '}' +
                '.WB_feed_v3 .artwork_box {' +
                '    width: ' + img_width + 'px!important;' +
                '}' +
                '.WB_media_view .media_show_box img {' +
                '    width: ' + img_width + 'px!important;' +
                '    height: auto!important;' +
                '}' +
                '.WB_feed_v3 .WB_media_a_m1 .WB_video, .WB_feed_v3 .WB_media_a_m1 .WB_video_a {' +
                '    width: ' + img_width + 'px;!important;' +
                '    height: 600px;!important;' +
                '}' +
                '.WB_frame_b {' +
                '    display: none!important;' +
                '}' +
                '.PCD_mplayer {' +
                '    display: none!important;' +
                '}' +
                '.WB_webim {' +
                '    display: none!important;' +
                '}' +
                '.B_page a.W_gotop {' +
                '    margin-left: 520px;!important;' +
                '}'
            );
        } else if (!saveValue && styleElem) {
            styleElem.parentNode.removeChild(styleElem);
            styleElem = null;
            document.getElementById('Pl_Core_RecommendFeed__74').querySelector('div:nth-child(2)').style.width = '300px';
            document.getElementById('Pl_Core_RecommendFeed__74').querySelector('div.UI_scrollContainer > div').style.width = '317px';
        }
    }

    if (href.match(/^https:\/\/weibo\.com\/(?!u\/)\d{8,}\/(?!profile\/)\w{8,}\?.*$/)) {
            switchSimpleWeiboStyle(true);
    }

})();