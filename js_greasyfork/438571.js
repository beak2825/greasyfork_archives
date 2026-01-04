// ==UserScript==
// @name         bilibili 评论时间戳
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  先把评论加载出来，按t就能在评论区插入时间戳，并接着输入内容了。
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438571/bilibili%20%E8%AF%84%E8%AE%BA%E6%97%B6%E9%97%B4%E6%88%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/438571/bilibili%20%E8%AF%84%E8%AE%BA%E6%97%B6%E9%97%B4%E6%88%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clipboard = {
        data: '',
        intercept: false,
        hook: function(evt) {
            if (clipboard.intercept) {
                evt.preventDefault();
                evt.clipboardData.setData('text/plain', clipboard.data);
                alert('copy success');
                clipboard.intercept = false;
                clipboard.data = '';
            }
        }
    };

    window.addEventListener('copy', clipboard.hook);

    function copyComments() {
        const md = '[' + document.querySelectorAll('.video-title')[0].textContent + '](' + document.location.href + ')' + '<br>' + Array.from(document.querySelectorAll('.con')).filter(con=>con.querySelectorAll('.name')[0].getAttribute('data-usercard-mid') == document.querySelectorAll('.header-entry-mini')[0].href.split('/')[3]).reduce((previous,con)=>{
            let text = con.querySelectorAll('.text')[0].textContent;
            const seek = con.querySelectorAll('.video-seek')[0];
            if (seek) {
                const time = seek.textContent.trim();
                const deeplink = document.location.href + '?t=' + seek.getAttribute('data-time');
                text = text.replace(time, '[' + time + '](' + deeplink + ')')
            } else {
                text = '[](' + document.location.href + ')' + text
            }

            return previous + text + '<br>';
        }
        , '')
        clipboard.data = md;

        if (window.clipboardData) {
            window.clipboardData.setData('Text', clipboard.data);
        } else {
            clipboard.intercept = true;
            document.execCommand('copy');
        }
    }

    document.addEventListener('keypress', function(e) {
        console.log(e);
        if (e.keyCode === 116) {
            e.preventDefault();
            console.log(e.target.value);
            var time = document.querySelectorAll('.bpx-player-ctrl-time-current')[0].innerHTML;
            var comment = document.querySelectorAll('.ipt-txt')[0];
            comment.value = time + ' ';
            setTimeout(function() {
                comment.focus();
            }, 0);
            //comment.focus();
        } else if (e.keyCode === 99) {
            console.log(111);
            copyComments()
        }
    })
    // Your code here...
}
)();
