// ==UserScript==
// @name         Monika - TMDB,MAL,BGM链接智能粘贴
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  TMDB，MAL，BGM链接任意复制，种子发布页粘贴时只保留数字id号
// @homepage     https://wwww.xioxix.com/
// @author       Timozaici
// @match        https://monikadesign.uk/upload/*
// @icon         https://monikadesign.uk/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478202/Monika%20-%20TMDB%2CMAL%2CBGM%E9%93%BE%E6%8E%A5%E6%99%BA%E8%83%BD%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/478202/Monika%20-%20TMDB%2CMAL%2CBGM%E9%93%BE%E6%8E%A5%E6%99%BA%E8%83%BD%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractField(inputBox, regex) {
        inputBox.addEventListener('paste', function(e) {
            e.preventDefault(); // 阻止默认粘贴行为
            var clipboardData = e.clipboardData.getData('text');
            var match = regex.exec(clipboardData);
            if (match && match[1]) {
                inputBox.value = match[1];
            }
        });
    }

    var tmdb_idInput = document.getElementById("tmdb_id");
    if (tmdb_idInput) {
        extractField(tmdb_idInput, /https:\/\/www.themoviedb.org\/(?:movie|tv)\/(\d+)/);
    }

    var mal_idInput = document.getElementById("mal_id");
    if (mal_idInput) {
        extractField(mal_idInput, /https:\/\/myanimelist.net\/(?:anime|manga)\/(\d+)/);
    }

    var bgm_idInput = document.getElementById("bgm_id");
    if (bgm_idInput) {
        extractField(bgm_idInput, /https:\/\/(?:bangumi\.tv|bgm\.tv)\/subject\/(\d+)/);
    }
})();