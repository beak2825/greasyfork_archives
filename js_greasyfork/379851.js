// ==UserScript==
// @name         リサーチパネル（動画無視ボタン）
// @namespace    research-panel
// @version      0.1
// @description  カスみたいな金で動画を見せられるこちらの身にもなってみろ
// @author       nikukoppun
// @include      http://rsch.jp/*
// @include      https://rsch.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379851/%E3%83%AA%E3%82%B5%E3%83%BC%E3%83%81%E3%83%91%E3%83%8D%E3%83%AB%EF%BC%88%E5%8B%95%E7%94%BB%E7%84%A1%E8%A6%96%E3%83%9C%E3%82%BF%E3%83%B3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/379851/%E3%83%AA%E3%82%B5%E3%83%BC%E3%83%81%E3%83%91%E3%83%8D%E3%83%AB%EF%BC%88%E5%8B%95%E7%94%BB%E7%84%A1%E8%A6%96%E3%83%9C%E3%82%BF%E3%83%B3%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptHtml = '<script>\
        function gotoNextIgnoreVideo() {\
            document.formQ["next_button"].value = "val";\
            document.formQ.submit();\
        }\
        </script>';
    let buttonHtml = "\
        <div style='margin-top: 1rem;'>\
            <span style='cursor: pointer; border: 1px solid gray; padding: 0.5rem; background-color: #ffdfdf; width: 121px; height: 28px;' onclick='gotoNextIgnoreVideo(); return false;'>動画を無視して次に進む</span>\
        </div>";
    $("#progressbar").before(scriptHtml + buttonHtml);
})();
