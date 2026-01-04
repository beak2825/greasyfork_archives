// ==UserScript==
// @name        静岡市道路通行規制情報 ボタン
// @namespace   http://tampermonkey.net/
// @version     1.82
// @description Wazeエディターからイベントページへリダイレクトするためのボタンを追加します。
// @author      Aoi
// @match       https://www.waze.com/ja/editor?*
// @grant       none
// @icon        https://t.pimg.jp/097/310/958/1/97310958.jpg
// @downloadURL https://update.greasyfork.org/scripts/497211/%E9%9D%99%E5%B2%A1%E5%B8%82%E9%81%93%E8%B7%AF%E9%80%9A%E8%A1%8C%E8%A6%8F%E5%88%B6%E6%83%85%E5%A0%B1%20%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/497211/%E9%9D%99%E5%B2%A1%E5%B8%82%E9%81%93%E8%B7%AF%E9%80%9A%E8%A1%8C%E8%A6%8F%E5%88%B6%E6%83%85%E5%A0%B1%20%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初期位置を設定
    const defaultPositions = {
        button1: { top: '410px', right: '12px' },
        button2: { top: '460px', right: '12px' }
    };

    // 位置をlocalStorageから取得、なければ初期位置を使用
    const storedPositions = JSON.parse(localStorage.getItem('shizuokaButtonPositions')) || defaultPositions;

    // ボタンを作成する関数
    function createButton(iconUrl, storedPosition, onClickUrl) {
        var button = document.createElement('button');
        var icon = document.createElement('img');
        icon.src = iconUrl;
        icon.style.width = '24px';
        icon.style.height = '24px';
        icon.style.verticalAlign = 'middle';
        icon.style.backgroundColor = 'transparent';

        button.appendChild(icon);
        button.style.position = 'fixed';
        button.style.top = storedPosition.top;
        button.style.right = storedPosition.right;
        button.style.left = storedPosition.left || 'auto';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.onclick = function() {
            window.open(onClickUrl, '_blank');
        };

        button.onmousedown = function(event) {
            event.preventDefault();
            let shiftX = event.clientX - button.getBoundingClientRect().left;
            let shiftY = event.clientY - button.getBoundingClientRect().top;

            document.onmousemove = function(event) {
                button.style.right = 'auto';
                button.style.left = event.pageX - shiftX + 'px';
                button.style.top = event.pageY - shiftY + 'px';
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;

                storedPositions[button.id] = {
                    top: button.style.top,
                    right: button.style.right,
                    left: button.style.left
                };
                localStorage.setItem('shizuokaButtonPositions', JSON.stringify(storedPositions));
            };
        };

        button.ondragstart = function() {
            return false;
        };

        document.body.appendChild(button);
        return button;
    }

    // ボタン1を作成
    var button1 = createButton(
        'https://t.pimg.jp/097/310/958/1/97310958.jpg',
        storedPositions.button1,
        'https://shizuokashi-road.appspot.com/index_pub.html'
    );
    button1.id = 'button1';

    // ボタン2を作成
    var button2 = createButton(
        'https://www.nga.gr.jp/item/material/image/group/2/shizuoka_kensyo.gif',
        storedPositions.button2,
        'http://douro.pref.shizuoka.jp/kisei/program/map/index.php?extents=15254937.514763,4068280.5711561,15499444.035227,4229593.9213296&area_id=0&menu=01'
    );
    button2.id = 'button2';
})();
