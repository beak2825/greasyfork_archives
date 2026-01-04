// ==UserScript==
// @name         Feeder - URL確認画面をスキップ
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  外部サイトへ移動する際のURL確認画面をスキップするスクリプトです。
// @author       You
// @match        *.x-feeder.info/jump.php?url=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417896/Feeder%20-%20URL%E7%A2%BA%E8%AA%8D%E7%94%BB%E9%9D%A2%E3%82%92%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/417896/Feeder%20-%20URL%E7%A2%BA%E8%AA%8D%E7%94%BB%E9%9D%A2%E3%82%92%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*-------------------------------------------------- カスタマイズ領域 --------------------------------------------------*/
    // スキップを許可する部屋のIDを入力
    // {all}を入力すると全ての部屋でスキップ
    var allowRoomIds = [
        "{all}"
    ];
    // スキップを許可する移動先のURLのプロトコルを入力
    var allowProtocols = [
        "http",
        "https"
    ];
    // スキップを許可しない移動先のサイトのドメインを入力
    // 例: example.com
    var denyDomains = [];
    // スキップを許可しない移動先のURLを入力
    // 例: http://example.com/?foo=bar&hoge=hoge
    var denyURLs = [];
    /*------------------------------------------------------------------------------------------------------------------*/
    var refRoomId = document.referrer.match(/^https?:\/\/www[0-9]+\.x-feeder\.info\/([^\/]+)/)[1],
        a = document.querySelector("a");
    if (allowRoomIds.indexOf(refRoomId) !== -1 || allowRoomIds.indexOf("{all}") !== -1 && // 許可されている部屋、もしくは{all}が入力されているかどうか
        allowProtocols.indexOf(a.href.match(/^[^:]+/)[0]) !== -1 && // 移動先のURLのプロトコルが許可されているプロトコルかどうか
        denyDomains.indexOf(a.href.replace(/^.+?\/\/|\/.*$/g, "")) === -1 && // 移動先のサイトのドメインが許可されていないかどうか
        denyURLs.indexOf(a.href) === -1) a.click(); // 移動先のURLが許可されていないかどうか
})();