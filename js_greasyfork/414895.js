// ==UserScript==
// @name         すっきりtwitter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Twitterの余計なものを隠します(未完)
// @author       y_kahou
// @match        https://twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/414895/%E3%81%99%E3%81%A3%E3%81%8D%E3%82%8Atwitter.user.js
// @updateURL https://update.greasyfork.org/scripts/414895/%E3%81%99%E3%81%A3%E3%81%8D%E3%82%8Atwitter.meta.js
// ==/UserScript==

var $ = window.jQuery;

// 先祖要素取得(idなしクラスも不定のtwitterは順番に遡るしかない)
$.fn.ancestor = function(generation = 1) {
    if (generation < 1) {
        return this;
    } else if (generation == 1) {
        return this.parent();
    } else {
        return this.parent().ancestor(generation - 1);
    }
}

function invertRgb(str_rgb) {
    var ary_rgb = str_rgb.match(/([0-9]+)/g);
    return 'rgb(' + ary_rgb.map(e => 255 - e).join(',') + ')';
}

function __css__() {/*
{* コメント *}
.rt-hide {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
}
.rt-modal {
    position: absolute;
    width: 400px;
    border-radius: 10px;
}
*/}
function addStyle() {
    var css = (__css__).toString()
        .match(/[^]*\/\*([^]*)\*\/\}$/)[1]
        .replace(/\{\*/g, '/*')
        .replace(/\*\}/g, '*/');
    
    // 非表示設定
    var hc = GM_getValue('hide_selector');
    if (Array.isArray(hc)) {
        hc.forEach((c) => {
            if (typeof c == 'string') css += `${c} { display: none; } `
        })
    }
    $('head').append(`<style id="mystyle" type="text/css">${css}</style>`)
}

function killObstruction(word) {
    const bar = ".r-1or9b2r";
    
    var obstruct = $(`span:contains("${word}")`).filter(function() {
        return $(this).text() === word;
    }).ancestor(5);
    if (!obstruct[0]) return;
    
    var dom = obstruct.prev().prev();
    var list = [dom[0]];
    for (var i = 0; i < 20; i++) {
        dom = $(dom).next();
        list.push(dom[0]);
        if (dom.find(bar)[0]) break;
    }
    if (list.length < 20) {
        list.forEach(dom => $(dom).hide());
    }
}


function observer() {
    $('html').off('DOMSubtreeModified propertychange');
    
    var rtText = $('span[data-testid="socialContext"]');
    rtText.each(function() {
        if ($(this).hasClass("hide")) return true;
        $(this).addClass("hide");
        
        var rtLine = $(this).ancestor(10);
        var menu = $('<div class="rt-hide"></div>');
        $(menu).insertAfter(rtLine);
        $(menu).next().hide();
        menu.ancestor(2).next('a').hide();
        
        var tweet = menu.ancestor(5);
        tweet.hover(
        (e) => { // hover
            $('div[id="layers"]').append('<div class="rt-modal"></div>');
            $('.rt-modal').append(tweet.clone())
            $('.rt-modal').find('div[data-testid="tweet"]').show();
            
            var pos_a = (window.outerHeight / 2) > e.clientY ? 'top' : 'bottom';
            var pos_b = (window.outerHeight / 2) > e.clientY ? e.pageY+10 : -e.pageY+10;
            $('.rt-modal').css({
                [pos_a]: `${pos_b}px`,
                'left': `${e.pageX-200}px`,
                'background': $('body').css('background-color'),
                'box-shadow': '0 0 14px 0 ' + invertRgb($('body').css('background-color'))
            });
        },
        (e) => { // out
            $('.rt-modal').remove();
        });
    });
    
    killObstruction("おすすめユーザー");
    killObstruction("おすすめトピック");
    
    // 一定間隔ごとしか動かないように
    setTimeout(function() {
        $('html').on('DOMSubtreeModified propertychange', observer);
    }, 1000);
}


(function() {
    'use strict';
    addStyle();
    observer();
})();