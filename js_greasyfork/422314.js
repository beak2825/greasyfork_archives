// ==UserScript==
// @name         Pixiv simpler
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ピクシブの表示とかをいくらかシンプルにします
// @author       y_kahou
// @match        https://www.pixiv.net/*
// @grant        none
// @noframes
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/419955-y-method/code/y_method.js?version=890440
// @downloadURL https://update.greasyfork.org/scripts/422314/Pixiv%20simpler.user.js
// @updateURL https://update.greasyfork.org/scripts/422314/Pixiv%20simpler.meta.js
// ==/UserScript==

var $ = window.jQuery;

const __CSS__ = `
/* ブックマーク後の広告とか */
.sc-185y4-0.eFqYrE,
.sc-1yvhotl-1.bEDiSv,
.sc-1k7ijbl-0.kJMlkT
{
    display: none;
}

/* 関連サービス削除 */
.rmdopf-0.kBlNos {
    display: none;
}
/* 関連サービス幅 削除 */
.sc-4nj1pr-3.iwONkn {
    gap: 0px;
}
/* プレミア無料体験削除 */
.sc-4nj1pr-5.jqJjEB {
    display: none;
}
/* 検索欄左寄せ(ダークモード対応) */
.sc-4nj1pr-0.bZtZIE,
.sc-4nj1pr-0.gRbSeX {
    grid-template-columns: 1fr minmax(0px, 528px) 10fr;
}

/* 追加メニュー用 */
.simpler.menu a {
    display: inline-block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
}
.simpler.menu a:hover {
    text-decoration: underline;
}

/* メインで見ている画像以外のブクマボタン */
.other-bookmark {
    pointer-events: none;
}


/* 一覧を画面幅に広げる */
section ul.fit-width {
    display: flex;
    position: absolute;
    width: 90vw;
    left: 5vw;
    margin-top: 100px;
}

`;
addStyle('simpler', __CSS__);

const keyPrevNext = function(e) {
    if (!$(document.body).hasClass('viewer-open')) {
        if (e.keyCode == 37 && $('.key-prev').length) $('.key-prev')[0].click()
        if (e.keyCode == 39 && $('.key-next').length) $('.key-next')[0].click()
    }
}

const menu = '.sc-4nj1pr-4.iUIuEb'
new MutationObserver(async (records) => {
    
    // 追加されていなかったら
    if (!$('.simpler', menu).length) {
        $('div:eq(2)', menu) // 作品投稿ボタンの後ろに追加
            .after(`<div class="simpler menu"><a href="/dashboard/works">作品管理</a></div>`).next()
            .after(`<div class="simpler menu"><a href="/bookmark.php">ブックマーク</a></div>`).next()
        
        // 追加した件数分セル数を追加
        let def = 5;
        $(menu).css('grid-template-columns', `repeat(${def + 2}, auto)`)
    }
    // 一覧
    if (location.pathname.endsWith('artworks')) {
        // 幅設定
        if (!$('section ul.fit-width').length) {
            $('section ul').addClass('fit-width')
        }
        // 左右キー押下で前/次ページ
        $(document.body).off('keyup', keyPrevNext)
        $(document.body).on('keyup', keyPrevNext)
        if ($('.xhhh7v-0').length) {
            $('.xhhh7v-0 a:eq(0)').addClass('key-prev')
            $('.xhhh7v-0 a:eq(-1)').addClass('key-next')
        } else {
            $('._1zRQ9vu a:eq(0)').addClass('key-prev')
            $('._1zRQ9vu a:eq(-1)').addClass('key-next')
        }
    }
    
    // メイン以外すべてのブクマボタンにclass設定
    for (let b of document.querySelectorAll('div:not(.other-bookmark) > .iPGEIN:not(.gtm-main-bookmark)')) {
        b.parentNode.classList.add('other-bookmark')
    }
    
    // マウスオーバーでタイトルチップ表示
    for (let d of document.querySelectorAll('.iasfms-3:not([title])')) {
        let img = d.querySelector('img');
        if (img) {
            let title = img.getAttribute('alt');
            d.setAttribute('title', title);
        }
    }
    
}).observe(document.body, { childList:true, subtree: true })
