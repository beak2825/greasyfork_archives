// ==UserScript==
// @name                LINE Sticker Download
// @name:zh-CN          LINE Sticker Download
// @name:ja             LINE Sticker Download
// @namespace           https://veltlion.github.io/line-sticker-download
// @include             https://store.line.me/stickershop/product/*
// @include             https://store.line.me/emojishop/product/*
// @include             https://store.line.me/themeshop/product/*
// @icon                https://secure.gravatar.com/avatar/6b0d31e600391e6f15240323202f5482
// @version             1.10
// @description         Add download button for line sticker/emoji/theme store.
// @description:zh-CN   在 LINE STORE 的 Sticker/Emoji/Theme 页面添加下载按钮。
// @description:ja      LINE STORE にダウンロードボタンを追加する。
// @author              空
// @grant               GM_download
// @downloadURL https://update.greasyfork.org/scripts/39015/LINE%20Sticker%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/39015/LINE%20Sticker%20Download.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var path, id, btn, btn2, btnstr, btnstr2, link2, filename, link, lang;
    path = window.location.pathname;
    id = path.replace(/\/(emoji|sticker)shop\/product\/([a-f\d]+).*/, '$2');
    //var lang = navigator.language;
    lang = document.documentElement.lang;
    btnstr = 'Download';
    if (lang.indexOf('zh') > -1) btnstr = '下载';
    else if (lang.indexOf('ja') > -1) btnstr = 'ダウンロードする';
    if (path.indexOf('stickershop') > -1) {
        if ($('span').hasClass('MdIcoAni_b') || $('span').hasClass('MdIcoPlay_b') || $('span').hasClass('MdIcoSound_b') ||
            $('span').hasClass('MdIcoFlashAni_b') || $('span').hasClass('MdIcoFlash_b') || $('span').hasClass('MdIcoEffectSticker_b')) {
            link = 'https://stickershop.line-scdn.net/stickershop/v1/product/' + id + '/iphone/stickerpack@2x.zip';
        } else if ($('span').hasClass('MdIcoMessageSticker_b')) {
            link = 'https://stickershop.line-scdn.net/stickershop/v1/product/' + id + '/iphone/sticker_custom_plus_base@2x.zip';
        } else if ($('span').hasClass('MdIcoNameSticker_b')) {
            link = 'https://stickershop.line-scdn.net/stickershop/v1/product/' + id + '/iphone/sticker_name_base@2x.zip';
        } else {
            link = 'https://stickershop.line-scdn.net/stickershop/v1/product/' + id + '/iphone/stickers@2x.zip';
        }
    } else if (path.indexOf('emojishop') > -1) {
        if ($('span').hasClass('MdIcoPlay_b')) {
            link = "https://stickershop.line-scdn.net/sticonshop/v1/" + id + "/sticon/iphone/package_animation.zip";
        } else {
            link = "https://stickershop.line-scdn.net/sticonshop/v1/" + id + "/sticon/iphone/package.zip?v=1";
        }
    } else if (path.indexOf('themeshop') > -1) {
        id = $("div.mdCMN38Img>img").attr("src").replace(/https\:\/\/shop.line-scdn.net\/themeshop\/v1\/products\/(.+)\/WEBSTORE\/.+/, '$1');
        link = 'https://shop.line-scdn.net/themeshop/v1/products/' + id + '/ANDROID/theme.zip';
        link2 = 'https://shop.line-scdn.net/themeshop/v1/products/' + id + '/IOS/theme.zip';
        btnstr2 = btnstr + ' (iOS)';
        btnstr = btnstr + ' (Android)';
        btn2 = '<li style="list-style-type: none"><button class="MdBtn01P02" style="background: #00b84f" id="download2" >' + btnstr2 + '</button></li>';
        $('.mdCMN38Item01Ul').find('li:eq(1)').remove();
        $('.mdCMN38Item01Ul').append(btn2);
    }

    btn = '<li style="list-style-type: none"><button class="MdBtn01P02" style="background: #33b1ff" id="download" >' + btnstr + '</button></li>';

    $('.mdCMN38Item01Ul').find('li:eq(0)').remove();
    $('.mdCMN38Item01Ul').prepend(btn);

    if ($('div').hasClass('mdMN05Btn')) {
        $('.mdMN05Btn').prepend(btn2);
        $('.mdMN05Btn').prepend(btn);
    }

    filename = document.title.replace(/(.+) (-|–) .+/g, '$1');
    filename = filename.replace(/\"|\\|\/|\:|\*|\?|\<|\>|\|/g, "");
    var file = { url: link, name: filename + '.zip' };
    var file2 = {  url: link2, name: filename + ' (iOS).zip' };

    $('body').on('click', '#download2', function () { var result = GM_download(file2); });
    $('body').on('click', '#download', function () { var result = GM_download(file); });

}());