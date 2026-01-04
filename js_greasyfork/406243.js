// ==UserScript==
// @name         appledaily-zero
// @namespace    https://www.xmader.com/
// @version      1.19.0
// @description  蘋果新聞 零會員 | 免登記成為(壹)會員都可安心睇蘋果日報 | ported from https://github.com/QuentinFung/appledaily-unblock
// @author       QuentinFung, Xmader
// @match        *://*.appledaily.com/*
// @match        *://*.appledaily.com.hk/*
// @match        *://*.appledaily.com.tw/*
// @match        *://*.nextmedia.com/*
// @match        *://*.nextmag.com.tw/*
// @match        *://*.nextmgz.com/*
// @match        *://*.nextdigital.com.hk/*
// @match        *://*.applehealth.com.hk/*
// @match        *://*.applefruity.com/*
// @match        *://*.nextfilm.com.hk/*
// @license      MIT
// @copyright    Copyright (c) 2019-2020 QuentinFung, Xmader
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406243/appledaily-zero.user.js
// @updateURL https://update.greasyfork.org/scripts/406243/appledaily-zero.meta.js
// ==/UserScript==

(function overwrite(link) {
//if (link.href.indexOf('.js') < 0) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', link.href, false); // sync request
    xhr.onload = () => {
        var html = xhr.responseText;
        // HK, US
        html = html.replace('function uReadDisplayMsgBox(showdef){', 'function uReadDisplayMsgBox(showdef){}\nfunction xxx(showdef){');
        html = html.replace('function uReadDisplayMsgBox(showdef, atype){', 'function uReadDisplayMsgBox(showdef, atype){}\nfunction xxx(showdef, atype){');
        // HK mobile
        html = html.replace('function uReadPrompt(content,msgtype,vdoimg){', 'function uReadPrompt(content,msgtype,vdoimg){}\nfunction xxx(content,msgtype,vdoimg){');
        // TW
        html = html.replace('var effects = function(e,val){', 'var effects = function(e,val){$(".ndAritcle_headPic,.ndArticle_margin,.mediabox,#playerVideo,.articulum").show();};\nvar effectsx = function(e,val){');
        html = html.replace('.parent().remove();', '.parent();');
        html = html.replace('class="ndArticle_margin" style="display: none;"', 'class="ndArticle_margin"');
        // 04JUL2019
        html = html.replace(/visibility: hidden;/g, '');
        // nextmag
        html = html.replace('<div class="article-content">', '<div class="article-content" style="display:block!important">');
        // 果燃台
        if (link.href.substr(0, 49) == 'https://hk.feature.appledaily.com/goodestchannel/' || link.href.substr(0, 42) == 'https://hk.applefruity.com/goodestchannel/')
            html += "<script>function setBanPaidFalse(){if(document.querySelector('.videoPlayer')!=null && document.querySelector('.videoPlayer').__vue__.banPaid){document.querySelector('.videoPlayer').__vue__.banPaid = false;}} var r = setInterval(setBanPaidFalse, 1000);</script>";
        // 蘋果台
        if (link.href.substr(0, 43) == 'https://tw.feature.appledaily.com/applepie/')
            html += "<script>function setBanPaidFalse(){if(document.querySelector('.videoPlayer')!=null && document.querySelector('.videoPlayer').__vue__.banPaid){document.querySelector('.videoPlayer').__vue__.banPaid = false;}} var r = setInterval(setBanPaidFalse, 1000);</script>";
        // 飲食男女
        html = html.replace('function blockContent() {', 'function blockContent() {}\nfunction xxx() {');
        // 台灣會員專區
        html = html.replace(/hideContent:'nm-main-articles',/g, "hideContent:'nm-main-articlesxxx',");
        html = html.replace(".nm-main-articles {display:none;}", '');
        html = html.replace('id="video_player"', 'id="video_playerx"');
        html = html.replace('anvatoPlayerID = "video_player"', 'anvatoPlayerID = "video_playerx"');
        // 22JUL2019
        html = html.replace("anvpInstance.createInstance('video_player')", "anvpInstance.createInstance('video_playerx')");
        // 01SEP2019 蘋果馬網
        if (link.href.substr(0, 33) == 'https://racing.appledaily.com.hk/')
            html += "<style>html {overflow:initial!important;} .omo-blocking {display:none!important;}</style>";
        // 19SEP2019 nextplus
        html = html.replace("if(confirmSubscriptionOn() && (!anvp_omo_currentuser.isLoggedIn || !anvp_omo_userentitled)){", "if (false){");
        // 01OCT2019 TW, HK
        if (link.href.substr(0, 11) == 'https://tw.' || link.href.substr(0, 11) == 'https://hk.')
            html += "<style>#articleBody, .scroller-truncate {overflow-y:initial!important;max-height:initial!important;height: initial!important;} #articleOmo {display:none!important;}</style>";
        // 01OCT2019 Applehealth HK
        if (link.href.substr(0, 31) == 'https://www.applehealth.com.hk/')
            html += "<style>.article-container-block [id^=article] .col-lg-8 {overflow:initial!important;height:initial!important;} #contentblock-block {display:none!important;} .article-container-block [id^=article] .col-lg-8:before{background:none!important;}</style>";
        // 20DEC2019
        html += "<style>.paywall_fade {display: none;}</style>";
        // 17FEB2020 三餸一湯
        if (link.href.substr(0, 41) == 'https://hk.feature.appledaily.com/recipe/' || link.href.substr(0, 34) == 'https://hk.applefruity.com/recipe/')
            html = html.replace("var siteMode = 2;", "var siteMode = 0;");
        // 28MAR2020 果盤
        html = html.replace(/blockable blockable-meter/g, "");
        // 28MAR2020 果GYM
        html += "<style>div.flex.fixed.top-0.left-0.justify-center.items-center.w-screen.h-full.bg-translucent-black.z-10 {display: none!important;}</style>";
        // 28MAR2020 讀果, 動物蘋台, 蘋果寶庫
        if (link.href.indexOf('goodestzine') >= 0 || link.href.indexOf('petform') >= 0 || link.href.indexOf('archive') >= 0 || link.href.indexOf('us.appledaily.com/ebook') >= 0 || link.href.indexOf('tw.feature.appledaily.com/ebook') >= 0) {
            html = html.replace(/wasLoggedIn = false/g, 'wasLoggedIn = true');
            html = html.replace(/omoUserType = OMO_USER_TYPE.FREE/g, 'omoUserType = OMO_USER_TYPE.SUBSCRIBER');
            html = html.replace(/const/g, '//const');
            html = html.replace('<script type="text/javascript" src="https://static.omoplanet.com/WebSDK/v3.3.1/omo-sdk-3.3.1.min.js"></script>', '');
        }
        if (link.href.indexOf('tw.feature.appledaily.com/ebook') >= 0) {
            html = html.replace(/"acl":1/g, '"acl":-9');
            html = html.replace(/oldOmoUserType/g, 'oldOmoUserType1');
            html += '<script>document.cookie = "oldOmoUserType=2; path=/";setTimeout(function(){document.cookie = "oldOmoUserType=2; path=/";},1000);</script>';
        }
        // 28MAR2020 懶專家
        html = html.replace(/omoUserType:a/g, 'omoUserType:2');
        // 28MAR2020 囚牢之疆
        html = html.replace(/as-member-login/g, 'as-member-login1');
        // 28MAR2020 US
        if (link.href.substr(0, 11) == 'https://us.') {
            html += "<style>omo-paywall {display: none!important;} div.guest-user-hide {overflow: inherit!important;height: auto!important;}</style>";
            html = html.replace(/retrieveOMO/g, 'cracked');
        }
        // 28MAR2020 武漢肺炎
        if (link.href.indexOf('wars') >= 0) {
            html += "<style>.contentblock-block{display:none!important;}</style>";
            html += "<script>var override = setInterval(function(){$('#main_view').attr('id','main_view2');$('.content_block').removeClass('content_block').addClass('content_block2');},500); setTimeout(function(){clearInterval(override);$('.content_block2').removeClass('content_block2').addClass('content_block');},2000);</script>";
        }
        // 28MAR2020 蘋果地產
        if (link.href.indexOf('tw.feature.appledaily.com/house') >= 0) {
            html = html.replace(/MEMBERCONTENT/g, 'FREE');
            html = html.replace('class="paywallfix" style="display:none;"', '');
        }
        // 28MAR2020 只想旅行
        if (link.href.indexOf('tw.feature.appledaily.com/travelseed') >= 0) {
            html = html.replace('class="paywallfix"', '');
            html += "<style>#video-player-wrap{overflow: inherit!important;height: auto!important;}</style>";
        }

        document.open();
        document.write(html);
        document.close();
    };
    xhr.send();
//}
})(location);