// ==UserScript==
// @name         自由帳カスタムデザイン(Feederチャット)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Feederチャットの自由帳のデザインをカスタムできるスクリプトです。
// @author       You
// @match        *.x-feeder.info/*/
// @exclude      *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405313/%E8%87%AA%E7%94%B1%E5%B8%B3%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405313/%E8%87%AA%E7%94%B1%E5%B8%B3%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*------------------------- カスタマイズ領域 -------------------------*/
    const textColor = "lightgreen"; // 文字色
    const luminousColor = "lime"; // 光色
    const backgroundColor = "#2F3136"; // 背景色
    const headlineColor = "black"; // 自由帳の見出しの色
    const buttonColor = "gray"; // ボタンの背景色
    const inputAreaColor = "black"; // 入力欄の背景色
    /*--------------------------------------------------------------------*/
    const setCSS = () => {
        const elm = $("#sub_note_frame");
        elm.css({
            "color": textColor,
            "text-shadow": `0 0 10px ${luminousColor},0 0 15px ${luminousColor}`,
            "background": backgroundColor,
        });
        elm.find("h2").css("background", headlineColor);
        elm.find("button").css({
            "font-weight": "bold",
            "color": textColor,
            "text-shadow": `0 0 10px ${luminousColor},0 0 15px ${luminousColor}`,
            "background": buttonColor,
            "border-style": "none",
            "border-radius": "5px",
        });
        const css = {
            "color": textColor,
            "text-shadow": `0 0 10px ${luminousColor},0 0 15px ${luminousColor}`,
            "background": inputAreaColor,
        };
        elm.find("input").css(css);
        elm.find("textarea").css(css);
    }
    const clickEvent = () => {
        const elm = $("#sub_note_frame");
        elm.children().click(() => {
            setTimeout(() => {
                setCSS();
                clickEvent();
            }, 500);
        });
    }
    $("#sub_note_icn").click(() => {
        setTimeout(() => {
            clickEvent();
            setCSS();
        }, 500);
    });
    if ($("#sub_note_frame").length !== 0) {
        clickEvent();
        setCSS();
    }
})();