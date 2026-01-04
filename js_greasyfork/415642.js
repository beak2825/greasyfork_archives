// ==UserScript==
// @name         Tweetdeck media zoom
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  タブレット専用にモーダルの画像を広げて表示
// @author       y_kahou
// @match        https://tweetdeck.twitter.com
// @grant        none
// @noframes
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/419955-y-method/code/y_method.js?version=890440
// @require      https://greasyfork.org/scripts/419065-jquerytouchactionex/code/jQueryTouchActionEx.js?version=894972
// @downloadURL https://update.greasyfork.org/scripts/415642/Tweetdeck%20media%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/415642/Tweetdeck%20media%20zoom.meta.js
// ==/UserScript==

var $ = window.jQuery;

const __CSS__ = `
.med-origlink { display: none!important; }
.med-flaglink { display: none!important; }

html      div.med-embeditem,
html.dark div.med-embeditem {
    top: 0;
    bottom: 0;
    border-radius: 14px;
}
html      div.med-tray,
html.dark div.med-tray {
    padding-bottom: 0px;
}
html      div.med-tweet,
html.dark div.med-tweet {
    border-bottom-right-radius: inherit;
    border-bottom-left-radius: inherit;
    background: rgb(0, 0, 0, 0.8);
    right: 0px;
    left: 0px;
    bottom: 0px;
    transition: 0.5s;
}
.hide {
    opacity: 0;
}

html      .js-med-tweet .item-box,
html.dark .js-med-tweet .item-box {
    padding-left: 100px;
    padding-right: 100px;
}
html      .js-med-tweet .account-link,
html.dark .js-med-tweet .account-link {
    flex: none;
}
html      .js-med-tweet .account-link > .nbfc,
html.dark .js-med-tweet .account-link > .nbfc {
    display: inline-block;
}
html      .js-med-tweet time,
html.dark .js-med-tweet time {
    position: absolute;
    right: 100px;
}
`;

(function() {
    'use strict';
    addStyle('mediazoom', __CSS__);
    addStyle('pre-font', `pre { white-space: pre-wrap; font-family: ${$('html').css('font-family')} !important; }`)
    
    $('html').on('keydown', e => { if (e.keyCode == 32 || e.keyCode == 13) $('#open-modal').empty().hide(); })
    
    var controll = function(modal) {
        
        // モーダルのツイート文も改行されたものにする
        var p = $('p', modal)[0]
        $(p).replaceWith(`<pre>${$(p).html()}</pre>`);
        
        // 画像ダブルタップクリックでオリジナル表示に変更
        // (取得できないことが多かったのでできるまでトライ)
        let iv = setInterval(() => {
            let img = $('.med-link', modal)
            if (img.length) {
                img.doubletap().attr('dhref', img.attr('href'))
                .removeAttr('href')
                .on('doubletap dblclick', e => window.open(img.attr('dhref')) )
                .on('tap', e => e.stopPropagation())
                clearInterval(iv)
            }
        }, 500)
        
        // 動画は画面タップで再生停止
        var video = $('video', modal)
        if (video.length) {
            video.on('touchstart', function(e) {
                if (this.paused) this.play();
                else this.pause();
            })
        }
        
        // 余白シングルタップでツイート文表示切替
        var edge = $('.l-table', modal)
        edge.tap().on('tap click', e => {
            $('.med-tweet').toggleClass('hide')
        })
        // 左右スワイプで次/前の画像、上下スワイプで閉じる
        edge.swipe_way().on("swipeup swipedown swipeleft swiperight", e => {
            switch(e.type) {
            case 'swipeup':
            case 'swipedown': $(modal).empty().hide(); break;
            case 'swipeleft': $('.mdl-media-next', modal)[0].click(); break;
            case 'swiperight': $('.mdl-media-prev', modal)[0].click(); break; }
        });
        
        // 完全表示されるまでpointer-eventsをnoneのままにする
        var tweet = $('.med-tweet', modal)
        tweet.on('transitionend', function(e) {
            var pe = $(e.target).hasClass('hide') ? 'none' : 'auto'
            tweet.css({'pointer-events': pe})
        })
        
        // ツイート文の左右端余白タップでツイート文非表示(一応クリックでも可)
        $('.med-tweet', modal).on('touchstart click', function(e) {
            var tgl = false
            var x = (e.type == 'click') ? e.pageX : e.touches[0].pageX
            var y = (e.type == 'click') ? e.pageY : e.touches[0].pageY
            
            // 左余白座標
            var of = $(this).offset()
            var rect = {
                top    : of.top,
                left   : of.left,
                right  : of.left + 100,
                hit: (x, y) => (rect.top <= y && y <= rect.bottom && rect.left <= x && x <= rect.right)
            }
            rect.bottom = of.top + $(this).height()
            tgl |= rect.hit(x, y)
            
            // 右余白座標
            rect.right = rect.left + $(this).width()
            rect.left = rect.right - 100;
            tgl |= rect.hit(x, y)
            
            if (tgl) {
                $('.med-tweet').toggleClass('hide')
                e.preventDefault();
            }
        })
    }
    var iv = setInterval(function() {
        var modal = $('#open-modal')[0];
        if (modal) {
            clearInterval(iv);
            
            $(modal).on('DOMSubtreeModified propertychange', function(e) {
                
                // modalの変更検知で最後の方に追加される.media-img OR videoが生成されたら1回だけ動かす
                if ($('.media-img, video', modal).length && !$(modal).children('div').data('done')) {
                    $(modal).children('div').data('done', true)
                    controll(modal);
                }
            })
        }
    }, 500)
})();