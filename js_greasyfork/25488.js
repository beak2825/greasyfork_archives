// ==UserScript==
// @name         网易云音乐不间断播放
// @namespace    moe.jixun
// @version      1.1
// @description  网易云音乐有时候会莫名其妙暂停，启用此插件后在发现暂停按钮后将自动点击。
// @author       Jixun
// @include      http://music.163.com/
// @include      http://music.163.com/#*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/25488/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8D%E9%97%B4%E6%96%AD%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/25488/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8D%E9%97%B4%E6%96%AD%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded', function() {
    'use strict';

    function $ (s) {
        return document.querySelector(s);
    }

    function $$ (tag, style, content) {
        var e = document.createElement(tag);
        if (style) e.style.cssText = style;
        if (!(content instanceof Array)) content = [ content ];

        content.forEach(function (content) {
            if (!content || typeof(content) == 'string')
                content = document.createTextNode(content || '');

            e.appendChild(content);
        });

        return e;
    }

    let checkbox;
    let app;

    app = $$('div', "color: wheat; position: absolute; right: 34px; top: 9px;",
             $$('label', "display: block; width: 5em;",
                [
                    checkbox = $$('input'),
                    $$('span', "padding-left: .5em; margin-top: -1px; position: absolute;", "不间断")
                ]
             )
          );
    checkbox.type = 'checkbox';
    app.onclick =
        e => e.stopPropagation();

    $('.play').appendChild(app);

    setInterval(x => {
        if (checkbox.checked) {
            let playBtn = $('.ply.j-flag:not(.pas)');
            // 检查播放按钮是否被暂停。
            if (playBtn) {
                playBtn.click();
            } else if ($('.btn.f-tdn.f-alpha.z-load')) {
                // 检测进度拉条是不是也在载入状态，如果是，模拟点击暂停，在下次检测按下播放。
                $('.ply.j-flag').click();
            }
        }
    }, 5000);
}, false);