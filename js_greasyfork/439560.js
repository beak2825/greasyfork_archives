// ==UserScript==
// @name         Twitterシンプル検索
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  検索用のモーダルを実装します
// @author       y_kahou
// @license      MIT
// @match        https://twitter.com/*
// @noframes
// @require      https://greasyfork.org/scripts/439492-twiiterhelper/code/TwiiterHelper.js?version=1226868
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js
// @resource     bootstrap https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/439560/Twitter%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E6%A4%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/439560/Twitter%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E6%A4%9C%E7%B4%A2.meta.js
// ==/UserScript==

var $ = window.jQuery;
GM_addStyle(GM_getResourceText("bootstrap"));
GM_addStyle(`
[data-testid="AppTabBar_SimpleSearch"]:hover > div,
.append-menu:hover
{
    background: rgba(128, 128, 128, 0.2);
}
body.modal-open {
    padding-right: 0!important;
    overflow: visible!important;
    position: static!important;
}
.modal-item {
    margin-bottom: 10px;
}
#ft > div {
    width: 40%;
    margin-right: 10%;
}
#reaction > div {
    width: 30%;
    margin-right: 3%;
}

#searchModal {
    pointer-events: none;
    position: fixed;
    top: 0; left: 0;
    z-index: 1001;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
    transition: 0.2s;
}
#modalBack {
    position: fixed;
    top: 0; left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    transition: 0.2s;
    background: rgba(0, 0, 0, 0.4);
}
.remove {
    opacity: 0;
}
.hide {
    visibility: hidden;
}
#searchModal.remove {
    transform: translateY(-50px);
}
#searchModal svg {
    width: 14px;
}
`);

const P_SCH = '<path d="m21.53 20.47-3.66-3.66A8.98 8.98 0 0 0 20 11a9 9 0 1 0-9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66a.746.746 0 0 0 1.06 0 .747.747 0 0 0 .002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"/><path d="M11 6.086a.12.12 0 0 0-.108.066L9.474 9.025l-3.17.461a.12.12 0 0 0-.068.205l2.296 2.237-.543 3.16a.12.12 0 0 0 .176.127L11 13.722l2.836 1.493a.12.12 0 0 0 .175-.127l-.542-3.16 2.296-2.236a.12.12 0 0 0-.068-.204l-3.17-.461-1.419-2.875A.12.12 0 0 0 11 6.086z"/>';
const I_REP = '<svg viewBox="0 0 24 24"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>';
const I_RET = '<svg viewBox="0 0 24 24"><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>';
const I_FAV = '<svg viewBox="0 0 24 24"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>';


class SearchModal
{
    constructor() {
        const TextField = (id, text, antiPattern, type="text") => `
        <div class="input-group text-field" id="${id}">
            <span class="input-group-text">${text}</span>
            <input type="${type}" class="form-control" data-antipattern="${antiPattern}">
        </div>`

        const ToggleField = (id, tgl, text) => `
        <input type="checkbox" class="btn-check" id="${id}" data-tgl="${tgl}">
        <label class="btn btn-outline-primary" for="${id}">${text}</label>`

        const DateTimeField = (id, text) => `
        <div class="input-group mb-3 datetime" id="${id}">
            <span class="input-group-text">${text}</span>
            <input type="date" class="form-control">
            <button class="btn btn-outline-secondary">X</button>
            <input type="time" step="1" class="form-control">
            <button class="btn btn-outline-secondary">X</button>
        </div>`

        const modal = $(`
        <div id="modalBack" class="hide remove"></div>
        <div id="searchModal" class="hide remove">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">検索</h5>
                    <button type="button" class="btn-close" aria-label="Close"></button>
                    <input type="hidden" id="tweet-id">
                </div>
                <div class="modal-body">
                    <div class="modal-item d-flex mb-3" id="ft">
                        ${TextField('from', 'from', '[^A-Za-z0-9_]')}
                        ${TextField('to'  , 'to'  , '[^A-Za-z0-9_]')}
                    </div>

                    <h6>日時</h6>
                    <div class="modal-item" id="datetime">
                        ${DateTimeField('since', '開始')}
                        ${DateTimeField('until', '終了')}
                    </div>

                    <h6>フィルター</h6>
                    <div class="modal-item">
                        ${ToggleField('t01', 'filter:images', '画像')}
                        ${ToggleField('t02', 'filter:videos', '動画')}
                        ${ToggleField('t03', 'filter:links', 'リンク')}
                    </div>

                    <h6>リアクション下限</h6>
                    <div class="modal-item d-flex" id="reaction">
                        ${TextField('min_replies',  I_REP, '[^0-9]', 'number')}
                        ${TextField('min_retweets', I_RET, '[^0-9]', 'number')}
                        ${TextField('min_faves',    I_FAV, '[^0-9]', 'number')}
                    </div>

                    <h6>エクストラ</h6>
                    <div class="modal-item">
                        ${ToggleField('t11', 'include:nativeretweets', 'RTを含む')}
                        ${ToggleField('t12', 'filter:replies', '返信のみ')}
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="検索文" id="search">
                        <button class="btn btn-primary" type="button" id="search-exec">検索</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
        `);
        $('#search-exec', modal).on('click', e => {
            const text = $('#search')[0].value.replace(/#/g, '%23');
            const url = 'https://twitter.com/search?q=' + text + '&f=live'
            window.open(url, '_brank')
        })
        // 手入力時に各inputへ反映
        $('#search', modal).on('keyup', e => {
            const text = e.target.value;

            // トグル
            $('.modal-item .btn-check').each((i,e) => {
                e.checked = (text.indexOf(e.dataset.tgl) != -1)
            })
            // テキスト
            $('.text-field').each((i,e) => {
                const m = text.match(new RegExp(`${e.id}:(\\w+)`))
                $('input', e)[0].value = m ? m[1]: '';
                $('span',  e).toggleClass('btn-primary', !!m)
            })
            // 日時
            $('.datetime').each((i,e) => {
                let m = text.match(new RegExp(`${e.id}:(\\d{4}-\\d{2}-\\d{2})_?(\\d{2}:\\d{2}:\\d{2})?`))
                $('input[type="date"]', e)[0].value = m ? m[1] : ''
                $('input[type="time"]', e)[0].value = m ? m[2] : ''
                $('span:eq(0)', e).toggleClass('btn-primary', !!m)
            })
        })
        // トグル
        $('.modal-item .btn-check', modal).on('change', e => {
            const tgl = e.target.dataset.tgl
            let text = $('#search').val();
            $('#search')[0].value = e.target.checked
                ? text + ' ' + tgl
                : text.replace(new RegExp(' ?' + tgl), '')
        })
        // テキスト
        $('.text-field input', modal).on('keyup', e => {
            const id = e.currentTarget.parentNode.id
            const rxp = new RegExp(` ?${id}:(\\w+)`)
            let val = $(e.target).val()
            let text = $('#search').val()

            let $cpt = $(`#${id} span`)
            $cpt.removeClass('btn-primary btn-danger')
            if ( val.match(new RegExp(e.currentTarget.dataset.antipattern)) ) {
                $cpt.addClass('btn-danger')
            } else if (val) {
                $cpt.addClass('btn-primary')
                $('#search')[0].value = !text.match(rxp)
                    ? `${text} ${id}:${val}`
                    : text.replace(rxp, ` ${id}:${val}`)
            } else {
                $('#search')[0].value = text.replace(rxp, '')
            }
        })
        // 日時
        $('.datetime input', modal).on('change', e => {
            function getDT(parent) {
                let date = $('input[type="date"]', parent).val();
                let time = $('input[type="time"]', parent).val();
                if (!date) return null;
                return time ? (date + '_' + time + '_JST') : date;
            }
            const $parent = $(e.target).parent()
            const id = $parent.attr('id')
            const dt = getDT($parent)
            const rxp = new RegExp(` ?${id}:[\\d-_:]+(JST)?`)
            let text = $('#search').val();

            $(`#${id} > span:eq(0)`).toggleClass('btn-primary', !!dt)
            if (!dt) {
                $('#search')[0].value = text.replace(rxp, '')
            }
            else {
                $('#search')[0].value = !text.match(rxp)
                    ? `${text} ${id}:${dt}`
                    : text.replace(rxp, ` ${id}:${dt}`)
            }
        })
        $('#datetime button', modal).on('click', e => {
            $(e.target).prev().val(null);
            $('#datetime input').trigger('change')
        })
        $('.btn-close', modal).on('click', e => this.hide())

        $('body').append(modal);
        $('#modalBack').on('click', e => this.hide())
    }

    val(value) {
        $('#searchModal #search').val(value);
        $('#searchModal #search').trigger('keyup');
    }
    // Bootstrapの表示を使うとトップに移動するバグがあるので自力で表示
    show() {
        $('#searchModal, #modalBack').removeClass('hide remove');
    }
    hide() {
        $('#searchModal, #modalBack').addClass('remove')
        .on('transitionend', e => {
            $(e.currentTarget).addClass('hide').off('transitionend');
        })
    }
}
const modal = new SearchModal();


function addSearchMenuItem() {
    let $mainMenu = $('nav[aria-label="メインメニュー"]')
    let $temp = $mainMenu.children('a:eq(-2)').clone(false)
    $temp.removeAttr('href')
    $temp.attr('aria-label', '検索')
    $temp.attr('data-testid', 'AppTabBar_SimpleSearch')
    $temp.find('svg').html(P_SCH)
    $temp.find('span').text( ($('span', $mainMenu).length != 0) ? '検索' : '' )
    $temp.on('click', () => modal.show())
    $mainMenu.children('a:eq(0)').after($temp)
}
function addAppendMenuItem() {
    const $menu = $('[role="menu"]');
    if ($menu.length && $('div:not([class]) span:contains("ダイレクトメッセージで送信")', $menu).length) {
        const $item = $('[role="menuitem"]', $menu).eq(-1).clone(true)
        $item.addClass('append-menu')
        $item.find('svg').html(P_SCH)
        $item.find('span').text('前後1日のツイートを検索')
        $item.on('click', e => {
            const tid = $('#searchModal #tweet-id').val();
            const article = $(`[href$="${tid}"]`).closest('article')[0];
            const uid = Twitter.getUserId(article)
            const dt = Twitter.getDateTime(article)
            let since = new Date(dt.getTime()); since.setDate(since.getDate() - 1);
            let until = new Date(dt.getTime()); until.setDate(until.getDate() + 1);
            document.elementFromPoint(15, 15).click(); // メニューを閉じるためにクリック
            modal.val(`from:${uid} since:${Twitter.timeToString(since)} until:${Twitter.timeToString(until)}`);
            modal.show();
        })
        $('[role="menuitem"]', $menu).parent().append($item)
    }
}

new MutationObserver(() => {
    if ($('[data-testid="AppTabBar_SimpleSearch"]').length == 0) {
        addSearchMenuItem();
    }
    if ($('.append-menu').length == 0) {
        addAppendMenuItem();
    }

    // シェアボタンにtweetIdを設定
    $('[aria-label="ポストを共有"]:not([data-tid])').each((i,e) => {
        let article = e.closest('article');
        e.dataset.tid = Twitter.getTweetId(article);
        $(e).parent().on('click', e2 => {
            $('#searchModal #tweet-id').val(e2.currentTarget.firstChild.dataset.tid);
        })
    })
})
.observe(document.body, { childList: true, subtree: true ,attributes: true, characterData:true })

window.onresize = function() {
    $('[data-testid="AppTabBar_SimpleSearch"]').remove()
    addSearchMenuItem();
}
