// ==UserScript==
// @name         exif파일명자동체크
// @namespace    https://arca.live/b/aiart/write
// @version      0.3
// @description  단 3줄이었던 코드
// @author       You
// @license MIT
// @match        https://arca.live/b/aiart/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @require    http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/452763/exif%ED%8C%8C%EC%9D%BC%EB%AA%85%EC%9E%90%EB%8F%99%EC%B2%B4%ED%81%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/452763/exif%ED%8C%8C%EC%9D%BC%EB%AA%85%EC%9E%90%EB%8F%99%EC%B2%B4%ED%81%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        console.log('on');
        var e = document.getElementById('imagesMultiUpload-1');
        var observer = new MutationObserver(function (event) {
            console.log('check');
            $("#saveExif").prop("checked", true);
            $("#saveFilename").prop("checked", true);
        })
        observer.observe(e, {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false
        })
    }, 500);
})();