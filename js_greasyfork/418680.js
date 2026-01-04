// ==UserScript==
// @name         niconico click to play
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  ニコニコの画面をクリック、タップで再生停止
// @author       y_kahou
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// @noframes
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/419065-jquerytouchactionex/code/jQueryTouchActionEx.js?version=888835
// @require      https://greasyfork.org/scripts/419955-y-method/code/y_method.js?version=890440
// @downloadURL https://update.greasyfork.org/scripts/418680/niconico%20click%20to%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/418680/niconico%20click%20to%20play.meta.js
// ==/UserScript==
 
var $ = window.jQuery;
 
const OVER_LAYER = `
<div id="over-layer">
    <div id="play" class="controll-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 13.229 13.229">
            <path d="M13.23 6.615a6.615 6.615 0 0 1-6.615 6.614A6.615 6.615 0 0 1 0 6.615 6.615 6.615 0 0 1 6.615 0a6.615 6.615 0 0 1 6.614 6.615z"/>
            <path d="M10.054 6.615l-5.16 2.978V3.636z" fill="#fff"/>
        </svg>
    </div>
    <div id="pause" class="controll-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 13.229 13.229">
            <g transform="translate(0 -283.77)">
                <circle cx="6.615" cy="290.385" r="6.615"/>
                <path fill="#fff" d="M3.969 287.21h1.852v6.35H3.969zM7.408 287.21H9.26v6.35H7.408z"/>
            </g>
        </svg>
    </div>
</div>`
 
const __CSS__ = `
/* プレミアム催促 */
.PreVideoStartPremiumLinkContainer,
.PreVideoStartPremiumLinkOnEconomyTimeContainer,
.SeekBarHoverItem:not(.SeekBarTimeTip)
{
    display: none;
}
#over-layer {
    pointer-events: none;
    z-index: 51;
    position: absolute;
    width: 100%;
    height: 100%;
}
.controll-button {
    visibility: hidden;
    opacity: 0.8;
    width: 10%;
    height: 10%;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.controll-button.click {
    opacity: 0;
    transform: scale(2);
    transition: linear 500ms;
}`;
addStyle('nicoclick', __CSS__);
 
 
// 動画にフォーカスがない場合、スペースで自動で動画が見えるとこまでスクロールして再生/停止
$('html').on('keydown', e => {
    if (e.keyCode != 32)
        return
    e.preventDefault()
    var pos = $(".HeaderContainer-row").eq(1).position().top
    $(window).first().scrollTop(pos)
    $('.PlayerContainer').focus_()
    $('.PlayerPlayButton, .PlayerPauseButton').click_()
})
 
getVideo().then(v => {
    var video = v[0]
    
    $('.VideoSymbolContainer-canvas').doubletap()
    
    // 画面タッチクリックで再生停止
    .on('tap click', function(e) {
        $('.PlayerPlayButton, .PlayerPauseButton').click_()
    })
    
    // 画面の左右ダブルタップでスキップ
    .on('doubletap', function(e) {
        var lr = ($(this).width() / 2 < e.touches[0].pageX - $(this).offset().left)
        $(lr ? '.PlayerSeekForwardButton' : '.PlayerSeekBackwardButton').click_()
    })
    
    // フルスクリーン&コントローラ非表示時にホールドかパンでコントローラ表示
    .on('hold subfocus', function(e) {
        if ($('.is-fullscreen').length && !$('.is-fixedFullscreenController').length) {
            var container = $(this).parent()
            container.addClass('is-mouseMoving')
            clearTimeout($(this).data('focus_to'))
            var to = setTimeout(() => {
                container.removeClass('is-mouseMoving')
            }, 2000)
            $(this).data('focus_to', to)
        }
    })
    
    // 初回再生でアイコン追加
    $(video).on('play', function() {
        $('.InView.VideoContainer').append(OVER_LAYER)
        $(video).off('play')
    })
    // アイコン処理
    var pause_play = function(e) {
        if (e.type == 'keydown') { // 素のスペースキーのみ許容
            if (e.ctrlKey || e.shiftKey || e.altKey) return
            if (e.keyCode != 32) return
        }
        if (video.paused) {
            $('#pause').css('visibility', 'hidden' ).removeClass('click')
            $('#play' ).css('visibility', 'visible').addClass('click')
        } else {
            $('#pause').css('visibility', 'visible').addClass('click')
            $('#play' ).css('visibility', 'hidden' ).removeClass('click')
        }
    }
    $('.ControllerContainer-inner').on('click', '.PlayerPlayButton, .PlayerPauseButton', pause_play)
    $('.PlayerContainer').on('keydown', pause_play)
})
.catch(err => {
    console.error(err);
})