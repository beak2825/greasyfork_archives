// ==UserScript==
// @name         乱数ジェネレーター(Feederチャット)
// @author       初投稿です。
// @namespace    https://www.x-feeder.info/
// @version      0.4
// @description  ボタンを押すと乱数を作成してくれるスクリプトです。
// @match        *.x-feeder.info/*/
// @match        *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://greasyfork.org/scripts/387509-yaju1919-library/code/yaju1919_library.js?version=724212
// @require      https://greasyfork.org/scripts/388005-managed-extensions/code/Managed_Extensions.js?version=720959
// @downloadURL https://update.greasyfork.org/scripts/388690/%E4%B9%B1%E6%95%B0%E3%82%B8%E3%82%A7%E3%83%8D%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/388690/%E4%B9%B1%E6%95%B0%E3%82%B8%E3%82%A7%E3%83%8D%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const yaju1919 = yaju1919_library;
    let input_a, input_b, result, flag_auto, g_say;
    const main = () => {
        let min = input_a();
        let max = input_b();
        if(min > max){
            const copy = max;
            max = min;
            min = copy;
        }
        let r = Math.floor(Math.random()*(max-min+1)+min);
        result.text(r);
        if(flag_auto()) g_say(r);
    };
    const setConfig = say => {
        g_say = say;
        const h = $("<div>");
        const h2 = $("<div>").appendTo(h);
        input_a = yaju1919.appendInputNumber(h2,{
            title: "範囲",
            placeholder: "最小値",
            value: 1,
            int: true,
            save: "a",
            enter: main
        });
        h2.append(" ～ ");
        input_b = yaju1919.appendInputNumber(h2,{
            placeholder: "最大値",
            value: 100,
            int: true,
            save: "b",
            enter: main
        });
        $("<button>",{text:"乱数生成"}).appendTo(h2).click(main);
        $("<button>",{text:"コピー"}).appendTo(h).click(()=>yaju1919.copy(result.text()));
        flag_auto = yaju1919.appendCheckButton(h,{
            title:"自動投稿",
            value: false,
            save: "auto",
        });
        result = $("<div>").appendTo(h);
        return h;
    };
    win.Managed_Extensions["乱数ジェネレーター"] = {
        config: setConfig,
    };
})();