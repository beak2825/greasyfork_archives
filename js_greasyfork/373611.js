// ==UserScript==
// @name         青空文庫表示制御
// @namespace    https://greasyfork.org/ja/users/219984-isari
// @version      0.1
// @description  青空文庫のフォントや文字サイズ、背景色を変えられるようにします
// @author       isari
// @license      MIT
// @match        https://www.aozora.gr.jp/cards/*/files/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://unpkg.com/huebee@1/dist/huebee.pkgd.min.js
// @resource     HueBeeCSS https://unpkg.com/huebee@1/dist/huebee.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/373611/%E9%9D%92%E7%A9%BA%E6%96%87%E5%BA%AB%E8%A1%A8%E7%A4%BA%E5%88%B6%E5%BE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/373611/%E9%9D%92%E7%A9%BA%E6%96%87%E5%BA%AB%E8%A1%A8%E7%A4%BA%E5%88%B6%E5%BE%A1.meta.js
// ==/UserScript==

$(function() {
    'use strict';

//  ここにフォント名を追加すればお好きなフォントをお使いいただけます。
    const FONTS = ['メイリオ', '游ゴシック', 'ヒラギノ角ゴ ProN', 'IPAゴシック', 'ＭＳ　Ｐゴシック', '游明朝', 'ヒラギノ明朝 ProN', 'IPA明朝', 'ＭＳ Ｐ明朝'];
//  好きな数値をセットすればお好きな文字サイズ・行間でお読み頂けます（左から大、中、小の値です）。
    const SIZES = ["large", "unset", "small"]
    const HEIGHTS = ["200%", "150%", "130%"]
//

    $('.main_text').before(`<select id="font"><option value="">--フォント--</option></select> <select id="font-size"><option value="">--文字サイズ--</option><option value=${SIZES[0]}>大</option><option value=${SIZES[1]}>中</option><option value=${SIZES[2]}>小</option></select> <select id="line-height"><option value="">--行間--</option><option value=${HEIGHTS[0]}>大</option><option value=${HEIGHTS[1]}>中</option><option value=${HEIGHTS[2]}>小</option></select> <input id="color" name="color" type="text" value="#FFFFFF">`);

    const $font = $('#font');
    for (let i = 0; i < FONTS.length; i++) {
        $font.append($('<option>').val(FONTS[i]).text(FONTS[i]));
    }
    $font.on('change', function() {
        const fontName = `"${$('option:selected').val()}"`;
        $('body').css('font-family', fontName);
    });

    const $fontSize = $('#font-size');
    $fontSize.on('change',function() {
        const size = $fontSize.val();
        $('body').css('font-size', size);
    });

    const $lineHeight = $('#line-height');
    $lineHeight.on('change', function(){
        const height = $lineHeight.val();
        $('div').css('line-height', height);
    });

    var css = GM_getResourceText("HueBeeCSS");
    GM_addStyle(css);
    const $color = $('#color')[0];
    const hueb = new Huebee( $color, {
        notation: 'hex',
        setBGColor: 'body'
    });
});