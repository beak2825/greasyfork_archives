// ==UserScript==
// @name         NetMusicTime
// @namespace    https://github.com/Cacivy/utils/blob/master/GreasyFork/NetMusicTime.js
// @version      0.2
// @description  查看网易云音乐歌单总时间
// @author       Cacivy
// @match        http://music.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24773/NetMusicTime.user.js
// @updateURL https://update.greasyfork.org/scripts/24773/NetMusicTime.meta.js
// ==/UserScript==

(function() {
    'use strict';

        var _trs = document.querySelectorAll('.m-table tbody tr');
        if (_trs && _trs.length) {
            var times = [];
             Array.prototype.forEach.call(_trs, function(_tr) {
                var _span = _tr.children[2].children[0];
                var time = _span.innerText;
                times.push(time);
            })
            if (times.length) {
                var h=0, m=0, s=0;
                times.forEach(function(x) {
                    var arr = x.split(':');
                    var minute = parseInt(arr[0]);
                    var second = parseInt(arr[1]);
                    m += minute;
                    s += second;
                    if (s >= 60) {
                        m++;
                        s-=60;
                    }
                    if (m >= 60) {
                        h++;
                        m-=60;
                    }
                });
            var text = h+':'+m+':'+s;
            console.log('Time: '+text);
            var _span = document.getElementsByClassName('s-fc4')[0];
            _span.innerText = _span.innerText  + ' ('+text+')';
    }
}
})();