// ==UserScript==
// @name               Dark Theme Stackoverflow
// @name:en            Dark Theme Stackoverflow
// @name:zh-CN         Dark Theme Stackoverflow
// @name:zh-TW         Dark Theme Stackoverflow
// @name:id            Dark Theme Stackoverflow
// @name:ja            Dark Theme Stackoverflow
// @name:ko            Dark Theme Stackoverflow
// @name:fr            Dark Theme Stackoverflow
// @name:es            Dark Theme Stackoverflow
// @name:de            Dark Theme Stackoverflow
// @name:ru            Dark Theme Stackoverflow
// @description        Apply Stack Overflow dark theme without login
// @description:en     Apply Stack Overflow dark theme without login
// @description:zh-CN  在未登录的情况下应用 Stack Overflow 暗黑主题
// @description:zh-TW  在未登入的情況下套用 Stack Overflow 深色主題
// @description:id     Terapkan tema gelap Stack Overflow tanpa login
// @description:ja     ログインせずに Stack Overflow のダークテーマを適用します
// @description:ko     로그인하지 않고 Stack Overflow 다크 테마를 적용합니다
// @description:fr     Appliquez le thème sombre de Stack Overflow sans vous connecter
// @description:es     Aplica el tema oscuro de Stack Overflow sin iniciar sesión
// @description:de     Wendet das Dark Theme von Stack Overflow ohne Anmeldung an
// @description:ru     Применяет тёмную тему Stack Overflow без входа в систему
// @version            0.3
// @run-at             document-start
// @match              https://*.stackoverflow.com/*
// @icon               https://stackoverflow.com/favicon.ico
// @author             Fznhq
// @namespace          https://github.com/fznhq
// @homepageURL        https://github.com/fznhq/userscript-collection
// @homepage           https://github.com/fznhq/userscript-collection
// @license            GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/480700/Dark%20Theme%20Stackoverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/480700/Dark%20Theme%20Stackoverflow.meta.js
// ==/UserScript==

(function () {
    "use strict";

    new MutationObserver((_, observer) => {
        if (document.body) {
            observer.disconnect();
            document.body.classList.add("theme-dark");
        }
    }).observe(document, { subtree: true, childList: true });
})();
