// ==UserScript==
// @name         niconico daily drawing link highlighter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description   ニコニコのデイリー福引リンクだけをハイライトする
// @author       Keisuke URAGO<bravo@resourcez.org>
// @match        https://blog.nicovideo.jp/niconews/category/ge_other/*
// @match       https://blog.nicovideo.jp/niconews/category/nicoad/*
// @icon         https://www.google.com/s2/favicons?domain=nicovideo.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507572/niconico%20daily%20drawing%20link%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/507572/niconico%20daily%20drawing%20link%20highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlight(container,what, bgcolor, color) {
        bgcolor = bgcolor ? bgcolor : "#0CC"
        color = color ? color : "#000"
        const content = container.innerHTML,
            pattern = new RegExp('(>[^<.]*)(' + what + ')([^<.]*)','g'),
            replaceWith = `$1<span style="background:${bgcolor}; color: ${color}">$2</span>$3`,
            highlighted = content.replace(pattern,replaceWith)
        return (container.innerHTML = highlighted) !== content
    }
    setTimeout(()=>{
        document.querySelectorAll('font').forEach(t=>{t.outerHTML=t.textContent})
        //console.log([...document.querySelectorAll('font')])
        highlight(document.querySelector('.contents'), 'デイリー', '#F00', '#FFF')
        highlight(document.querySelector('.contents'), 'クイズ')
        highlight(document.querySelector('.contents'), 'キャンペーン', '#090', '#FFF')
        highlight(document.querySelector('.contents'), '福引', '#00F', '#FFF')
        // highlight(document.querySelector('.contents'), '還元')
        Array.from(document.querySelectorAll('.l-main a')).map(a=>a.setAttribute('target', '_blank'))
    }, 300)

})();