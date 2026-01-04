// ==UserScript==
// @name           Amazon.co.jp内の商品リンクにsmid=AN1VRQENFRJN5を付ける
// @description    商品ページへ飛んだとき販売Amazon.co.jpが優先表示されます
// @namespace      https://greasyfork.org/ja/users/225728-nanashi
// @version        1.0.1
// @match          https://www.amazon.co.jp/*
// @grant          none
// @license        MIT
// @author         nanashi
// @downloadURL https://update.greasyfork.org/scripts/520469/Amazoncojp%E5%86%85%E3%81%AE%E5%95%86%E5%93%81%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%ABsmid%3DAN1VRQENFRJN5%E3%82%92%E4%BB%98%E3%81%91%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520469/Amazoncojp%E5%86%85%E3%81%AE%E5%95%86%E5%93%81%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%ABsmid%3DAN1VRQENFRJN5%E3%82%92%E4%BB%98%E3%81%91%E3%82%8B.meta.js
// ==/UserScript==

(()=>{
    'use strict';

    // mousedown時にリンクを書き換える（動的ページ更新に対応）
    window.addEventListener('mousedown', (event) => {
        let e = event.target;
        while(e && e.tagName != 'A') e = e.parentNode;
        if(!e) return true;
        let h = e.getAttribute('href'); // e.hrefで取得すると相対パスなどが絶対パスに変換されてしまうので注意
        if(!h) return true;
        if(h.indexOf('smid=AN1VRQENFRJN5') >= 0) return true;
        // hrefが'/'で始まるのは高い確率で商品リンクなので判定は緩め
        // hrefが絶対パスは厳しめに判定（拙作「Amazon.co.jpの商品ページに各種リンク追加」への誤爆を避けるためでもある）
        let isItemLink = false;
        if(h.match(/^\/(dp|[^\/]*\/dp|gp\/product)\/[a-zA-Z0-9_]{10}/i)){
            isItemLink = true;
        }else if(h.match(/^https:\/\/\www\.amazon\.co\.jp\/[^\/]*\/dp\/[a-zA-Z0-9_]{10}/i)){
            const c = e.getAttribute('class');
            if(c != null && c.indexOf('a-link') >= 0){
                isItemLink = true;
            }
        }
        if(isItemLink){
            const delim = (h.indexOf('?') > 0) ? '&' : '?';
            e.setAttribute('href', h + delim + 'smid=AN1VRQENFRJN5');
        }
        return true;
    }, false);
})();
