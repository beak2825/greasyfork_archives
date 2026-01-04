// ==UserScript==
// @name         三男で理牌
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ランダムコマンドを大きく表示して麻雀牌をソートする
// @author       sasakinchu
// @match        https://*.sannan.nl/**
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468878/%E4%B8%89%E7%94%B7%E3%81%A7%E7%90%86%E7%89%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/468878/%E4%B8%89%E7%94%B7%E3%81%A7%E7%90%86%E7%89%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 麻雀牌の絵文字の並び順
    const tileOrder = [
        '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏',
        '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡',
        '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘',
        '🀀', '🀁', '🀂', '🀃', '🀆', '🀅', '🀄',
    ];

    // 牌を大きく表示するスタイルを定義
    const tileStyle = `
        font-size: 40px;
        line-height: 1;
        vertical-align: middle;
    `;

    // 牌をソートして大きく表示する関数
    function sortAndEnlargeTiles() {
        const ddTags = document.getElementsByTagName('dd');

        for (let i = 0; i < ddTags.length; i++) {
            const ddTag = ddTags[i];
            const bTags = ddTag.getElementsByTagName('b');

            const tiles = [];
            for (let j = 0; j < bTags.length; j++) {
                const bTag = bTags[j];
                const tile = bTag.innerText.trim();
                tiles.push(tile);
            }

            tiles.sort((a, b) => {
                return tileOrder.indexOf(a) - tileOrder.indexOf(b);
            }); // 牌をソート

            for (let j = 0; j < bTags.length; j++) {
                const bTag = bTags[j];
                const tile = tiles[j];
                const enlargedHTML = `<span style="${tileStyle}">${tile}</span>`;
                bTag.innerHTML = enlargedHTML;
            }
        }
    }

    // 牌をソートして大きく表示
    sortAndEnlargeTiles();
})();
