// ==UserScript==
// @name         pixiv小説表示制御
// @namespace    https://greasyfork.org/ja/users/219984-isari
// @version      0.1
// @description  pixiv小説ページのフォントや背景色、文字色を自由に変えられるようにします
// @author       isari
// @license      MIT
// @match        https://www.pixiv.net/novel/show.php?id=*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://unpkg.com/huebee@1/dist/huebee.pkgd.min.js
// @resource     HueBeeCSS https://unpkg.com/huebee@1/dist/huebee.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/373366/pixiv%E5%B0%8F%E8%AA%AC%E8%A1%A8%E7%A4%BA%E5%88%B6%E5%BE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/373366/pixiv%E5%B0%8F%E8%AA%AC%E8%A1%A8%E7%A4%BA%E5%88%B6%E5%BE%A1.meta.js
// ==/UserScript==

$(function() {
    'use strict';

//  ここにフォント名を追加すればお好きなフォントをお使いいただけます。
    const SANS_SERIF = ['メイリオ', '游ゴシック', 'ヒラギノ角ゴ ProN', 'IPAゴシック', 'ＭＳ　Ｐゴシック'];
    const SERIF = ['游明朝', 'ヒラギノ明朝 ProN', 'IPA明朝', 'ＭＳ Ｐ明朝'];
//

    $('.novel-tooltip.novel-tooltip-config').append('<fieldset class="novel-fonts"><legend>フォント</legend><select id="novel-font"></select></fieldset>');
    const $novelFont = $('#novel-font');

    const observer = new MutationObserver(function (MutationRecords, MutationObserver) {
        const controllerFont = document.querySelector('.controller-font');
        const fontFamily = controllerFont.getAttribute('data-font');
        $novelFont.empty();
        if (fontFamily === 'sans-serif') {
            for (let i = 0; i < SANS_SERIF.length; i++) {
                $novelFont.append($('<option>').val(SANS_SERIF[i]).text(SANS_SERIF[i]));
            }
        }else {
            for (let i = 0; i < SERIF.length; i++) {
                $novelFont.append($('<option>').val(SERIF[i]).text(SERIF[i]));
            }
        }
        $novelFont.on('change', function() {
            if (fontFamily === 'sans-serif') {
                const fontName = `"${$('option:selected').val()}", sans-serif`;
                $('.novel-content.novel-font-sans-serif .novel-body .novel-pages-wrapper .novel-pages').css('font-family', fontName);
            } else {
                const fontName = `"${$('option:selected').val()}", serif`;
                $('.novel-content.novel-font-serif .novel-body .novel-pages-wrapper .novel-pages').css('font-family', fontName);
            }
        });
    });

    observer.observe($('.controller-font').get(0), {
        attributes: true,
        attributeFilter: ['data-font']
    });

    var css = GM_getResourceText("HueBeeCSS");
    GM_addStyle(css);
    $('.novel-themes').after('<fieldset class="novel-colors"><legend>カスタムテーマ</legend><input id="bgcolor" name="bgcolor" type="text"></fieldset>');
    const $bgcolor = $('#bgcolor')[0];
    const huebeeBg = new Huebee( $bgcolor, {
        notation: 'hex',
        setBGColor: '.novel-pages-wrapper'
    });
});