// ==UserScript==
// @name         dアニメストア便利化
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  dアニメストアを少し使いやすくします
// @author       y_kahou
// @match        https://animestore.docomo.ne.jp/*
// @grant        GM_addStyle
// @noframes
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414008/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E4%BE%BF%E5%88%A9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/414008/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E4%BE%BF%E5%88%A9%E5%8C%96.meta.js
// ==/UserScript==

var $ = window.jQuery;

GM_addStyle(`
button.seek90Button {
    color: white;
    height: 44px;
    margin: 5px 3px;
}
.seek90Button span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.seek90Button svg {
    fill: white;
}
.back .seek90Button svg {
    transform: scale(-1, 1);
}

section:hover .open-btn {
    visibility: visible;
}
.open-btn {
    visibility: hidden;
    cursor: pointer;
    position: absolute!important;
    width: 50%;
    height: 100%;
    z-index: 100;
    display: grid!important;
    justify-content: center;
    align-items: center;
}
.open-btn:hover {
    background: #00000040;
}
.open-btn.in {
    transform: translateX(100%);
}
.open-btn svg {
    width: 50px;
    background: #fff7;
    border-radius: 10px;
}
`);

const OPEN_IN = `
<svg viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
</svg>`;
const OPEN_OUT = `
<svg viewBox="0 0 24 24">
<path d="M0 0h24v24H0z" fill="none"/>
<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
</svg>`;
function VIDEO_URL(partId) {
    return `https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=${partId}`;
}

(function() {
    'use strict';

    const path = window.location.pathname.replace('/animestore/', '')
    console.log(path);

    $('.itemModuleIn').each((i, e) => {
        const $a = $(e).find('a:eq(0)')
        let onclick = $a.attr('onclick');
        let href = VIDEO_URL(onclick.match(/\d+/)[0]);
        $a
        .prepend(`<a class="open-btn in" title="タブで開く" href="${href}" target="_blank">${OPEN_IN}</a>`)
        .prepend(`<a class="open-btn out" title="ウインドウで開く" onclick='${onclick}'>${OPEN_OUT}</a>`)
        $a.find('i').remove();
        $a.children().unwrap();
    })


    // タグ検索ページ
    if (path == "tag_sel_pc") {
        $('h2').each((i, e) => {
            // 親要素クリックで子要素を表示
            $(e).on('click', (e) => {
                $(e.target).next().toggle();
            });
            $(e).css({'cursor': 'pointer'});

            var ul = $(e).next();
            ul.css({'display': 'none'});
            // 並べ替え
            ul.find('li').get()
                .map((e) => { return { dom: e, value: $(e).find('div').text() } })
                .sort((a, b) => { return a.value < b.value ? 1 : -1; })
                .forEach((v) => $(ul).append(v.dom))
        });
    }
    // 探すページ
    else if (path == "CF/search_index") {
        // タグ一覧へのリンク追加
        $('ul.searchBtnGroup.clearfix').append(`
        <li id="tag">
            <a class="line2" href="/animestore/tag_sel_pc" style="background-color: #2fb6ff;">
                <span class="ui-clamp webkit2LineClamp">タグ一覧</span>
                <i class="icon iconCircleArrowBrownRight"></i>
            </a>
        </li>`);
    }
    // 詳細ページ
    else if (path == "ci_pc") {
        function inject($modal) {
            $modal.find('.playerContainer > div').css({
                'display': 'flex',
                'margin-bottom': '30px',
            })
            let partId = location.href.match(/partId=(\d+)/)[1];
            $modal.find('.list').find('a').text('ウインドウで開く')
            $modal.find('.list').after(`
            <div id="openIn" class="list">
                <a href="${VIDEO_URL(partId)}" class="normal" data-bitrate="4" target="_blank">タブで開く</a>
            </div>
            `);
        }
        new MutationObserver(records => {
            if ($('modal').length && !$('modal #openIn').length) inject($('modal'));
        })
        .observe(document.body, { childList: true, subtree: true })
    }
    // 再生ウインドウ
    else if (path == "sc_d_pc") {

        // 再生ウインドウのタイトルを変更
        window.onload = function() {
            const onchange = function() {
                console.log('タイトル更新');
                let t1 = $('.backInfoTxt1').text(), // アニメタイトル
                    t2 = $('.backInfoTxt2').text(), // 話数
                    t3 = $('.backInfoTxt3').text(); // サブタイ
                $('title').text(`${t1} ${t2} ${t3}`);
            }
            onchange();
            $('.backInfoTxt3').on('DOMSubtreeModified propertychange', onchange);

            const seek90 = `<button class="seek90Button">
                <span>90</span>
                <svg width="44" height="44" viewBox="0 0 26.458 26.458">
                <path d="M13.209 2.646A10.583 10.583 0 002.646 13.229a10.583 10.583 0 0010.583 10.583A10.583 10.583 0 0023.812 13.23H21.82a8.59 8.59 0 01-8.591 8.591 8.59 8.59 0 01-8.591-8.591 8.59 8.59 0 018.591-8.591V2.646a10.583 10.583 0 00-.02 0z"></path>
                <path d="M19.693 3.72l-6.464 2.811V.91z"></path>
                </svg>
            </button>`;
            let seek = (e,s) => {$('video')[0].currentTime += s; e.preventDefault()}
            $(seek90).on('click touchstart', e => seek(e, 90)).appendTo('.skip .popupButtonWrap');
            $(seek90).on('click touchstart', e => seek(e,-90)).appendTo('.back .popupButtonWrap');

            $(document.body).on('keyup', e => {
                if (!event.ctrlKey)
                    return;
                if (e.keyCode == 37) seek(e, -90);
                if (e.keyCode == 39) seek(e, 90);
            })
        }
    }
})();