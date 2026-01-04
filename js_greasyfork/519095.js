// ==UserScript==
// @name         Hide Wikipedia Title
// @name:zh-CN   隐藏维基百科标题
// @name:en      Hide Wikipedia Title
// @name:es      Ocultar título de Wikipedia
// @name:fr      Masquer le titre de Wikipédia
// @name:de      Wikipedia-Titel ausblenden
// @name:ja      ウィキペディアのタイトルを非表示
// @name:ko      위키피디아 제목 숨기기
// @name:ru      Скрыть заголовок Wikipedia
// @namespace    http://tampermonkey.net/
// @version      2024.11.28
// @description  Hide Wikipedia title bar
// @description:zh-CN  隐藏维基百科的标题栏
// @description:en     Hide Wikipedia title bar
// @description:es     Ocultar la barra de título de Wikipedia
// @description:fr     Masquer la barre de titre de Wikipédia
// @description:de     Wikipedia-Titelleiste ausblenden
// @description:ja     Wikipediaのタイトルバーを非表示にする
// @description:ko     위키피디아 제목 표시줄 숨기기
// @description:ru     Скрыть заголовок Википедии
// @author       Myth
// @match        https://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519095/Hide%20Wikipedia%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/519095/Hide%20Wikipedia%20Title.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.getElementsByClassName('vector-sticky-header-context-bar-primary')[0].style.display = 'none'
})();