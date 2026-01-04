// ==UserScript==
// @name         文字数カウンター(Feederチャット)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Feederチャットの投稿内容入力欄に文字数カウンターを追加します。
// @author       You
// @match        *.x-feeder.info/*/
// @exclude      *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406439/%E6%96%87%E5%AD%97%E6%95%B0%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406439/%E6%96%87%E5%AD%97%E6%95%B0%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const setCounter = h => {
        const textLength = $(`#${newActiveForm}`).val().length;
        textLength > 1000 ? h.html(`<b style="color:red;">制限を${textLength - 1000}文字オーバーしています</b>`) : h.html(`残り<b>${1000 - textLength}</b>文字`);
    }
    const h = $("<div>").appendTo(".category_options_frame").eq(0);
    setCounter(h);
    $(`#${newActiveForm}`).change(() => setCounter(h));
    $("#input_type").click(() => {
        setCounter(h);
        $(`#${newActiveForm}`).change(() => setCounter(h));
    });
    $("#post_btn").click(() => setCounter(h))
})();