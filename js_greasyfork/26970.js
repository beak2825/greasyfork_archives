// ==UserScript==
// @name         PSO2攻略Wiki コメントページ詳細
// @description コメントページにコメント数や流速を表示します
// @namespace    https://github.com/unarist/
// @version      0.2
// @author       unarist
// @match        http://pso2.swiki.jp/index.php?Comments%2F*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26970/PSO2%E6%94%BB%E7%95%A5Wiki%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8%E8%A9%B3%E7%B4%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/26970/PSO2%E6%94%BB%E7%95%A5Wiki%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8%E8%A9%B3%E7%B4%B0.meta.js
// ==/UserScript==

var container = $('<div>').insertAfter('#page_title');

$('<p>').text(
    'tree: ' + $('.list1 > li').length + ' ' +
    'node: ' + $('.list1 li').length
).appendTo(container);

var comments = $('.comment_date').map(function(){
    return Date.parse($(this).text().match(/.+\d/));
}).toArray();

comments.sort(function(a, b) {
    return a - b;
});
comments.reverse();

var fmt_dur = function(sec) {
    var fmt = function(div) { return Math.round(sec / div); };
    if(sec <= 60)
        return fmt(1) + '秒';
    else if (sec <= 3600)
        return fmt(60) + '分';
    else if (sec <= 24 * 3600)
        return fmt(3600) + '時間';
    else
        return fmt(24 * 3600) + '日';
};

var speed = function(count) {
    var real_count = Math.min(count, comments.length);
    var target_time = comments[real_count - 1];
    var dur_sec = (Date.now() - target_time) / 1000;
    return fmt_dur(dur_sec) + '前 (' + Math.round(real_count / dur_sec * 3600) + ' res/h)';
};

$('<p>').text(
    'last100: ' + speed(100) + ' ' +
    'last500: ' + speed(500) + ' ' +
    'all: ' + speed(comments.length)
).appendTo(container);