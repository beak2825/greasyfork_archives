// ==UserScript==
// @namespace          https://github.com/inchei
// @icon               http://s1.music.126.net/style/favicon.ico
// @author             inchei
// @version            0.1
// @license            GPL 3.0

// @name               网易云音乐专辑封面旋转
// @name:zh-cn         网易云音乐专辑封面旋转
// @name:en            163 music rotating cover

// @description       使网易云音乐播放时的专辑封面旋转
// @description:zh-cn 使网易云音乐播放时的专辑封面旋转
// @description:en    rotate the cover when playing

// @include            /https?://music.163.com/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/387183/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%93%E8%BE%91%E5%B0%81%E9%9D%A2%E6%97%8B%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/387183/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%93%E8%BE%91%E5%B0%81%E9%9D%A2%E6%97%8B%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ifPlaying;
    const key = document.querySelector('.ply.j-flag');

    let css = document.createElement('STYLE');
    css.setAttribute('type', 'text/css');
    css.innerHTML = `
    .u-cover-6.rotating {
        -webkit-animation:rotate 10s infinite linear;
    }
    @-webkit-keyframes rotate{
        0%{
            -webkit-transform:rotate(0deg);
        }
        100%{
            -webkit-transform:rotate(360deg);
        }
    }`;
    document.querySelector('head').appendChild(css);

    setInterval(() => {
        if(document.querySelector('.g-iframe')) {
            main();
            window.clearInterval();
        }
    }, 500);

    function main() {
        function innermain() {
            ifPlaying = document.querySelector('.ply.j-flag.pas');
            if (ifPlaying) {
                document.querySelector('.g-iframe').contentWindow.document.querySelector('.u-cover-6').classList.add('rotating');
             } else {
                document.querySelector('.g-iframe').contentWindow.document.querySelector('.u-cover-6').classList.remove('rotating');
            }
        }
        innermain();
        key.addEventListener('click', innermain());
    }
})();