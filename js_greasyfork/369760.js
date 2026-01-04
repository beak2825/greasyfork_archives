// ==UserScript==
// @name         Eventernote 参加回数表示
// @namespace    https://www.eventernote.com/
// @version      0.2.2
// @description  Eventer Note のお気に入り声優/アーティストにイベント参加回数を表示させる
// @author       4y4m3
// @match        https://www.eventernote.com/users*
// @exclude      https://www.eventernote.com/users/*/following
// @exclude      https://www.eventernote.com/users/*/follower
// @icon         https://www.google.com/s2/favicons?domain=eventernote.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369760/Eventernote%20%E5%8F%82%E5%8A%A0%E5%9B%9E%E6%95%B0%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/369760/Eventernote%20%E5%8F%82%E5%8A%A0%E5%9B%9E%E6%95%B0%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    var v = document.querySelectorAll('.gb_actors_list, .gb_listview')[0].getElementsByTagName('li');
    for (var i = 0; i < v.length; i++) {
        var n = v[i].className.replace(/.*c(\d+).*/, '$1');
        v[i].getElementsByTagName('a')[0].textContent += '(' + n + ')'
    }
})();