// ==UserScript==
// @name            HabrCacheEnhanced
// @description     Перенаправляет удалённые или скрытые в черновики записи с habr.com на зеркала Хабра. Redirects deleted or hidden posts from habr.com to Habr mirrors.
// @namespace       habrcache
// @version         20250125.3
// @author          dartraiden
// @match           https://habr.com/*
// @supportURL      https://github.com/dartraiden/HabrCacheEnhanced/issues
// @downloadURL https://update.greasyfork.org/scripts/10399/HabrCacheEnhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/10399/HabrCacheEnhanced.meta.js
// ==/UserScript==

setTimeout(function() {
    var error_code = document.querySelector(".tm-error-message__code");
    if(error_code && error_code.innerText == "403") {
        var id = document.location.href.replace(/^.*\/(\d+)\/?.+/, '$1');
        var body = document.querySelector(".tm-error-message__body");
        if(body){
            body.outerHTML += '<p>&bull; <a href="https://itnan.ru/post.php?c=1&p=' + id + '">ITnan</a></p><p>&bull; <a href="https://sohabr.net/habr/post/' + id + '/">СоХабр</a></p><p>&bull; <a href="https://savepearlharbor.com/?p=' + id + '">SavePearlHarbor</a></p>';
        }
    }
}, 500);