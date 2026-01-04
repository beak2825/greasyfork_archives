// ==UserScript==
// @author         lubitel1997
// @name           Wikimapia recover
// @version        2.0.1
// @date           2019-11-15
// @description    Исправление ошибки с загрузкой фотографий / Photo upload bug fix
// @include        http://wikimapia.org/*
// @include        http://wikimapia.org:80/*
// @namespace lubitel1997
// @downloadURL https://update.greasyfork.org/scripts/381156/Wikimapia%20recover.user.js
// @updateURL https://update.greasyfork.org/scripts/381156/Wikimapia%20recover.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function() {
let elem = document.getElementById('add-photo-button');
elem.dataset.url = elem.dataset.url.replace('https', 'http');
}, false);