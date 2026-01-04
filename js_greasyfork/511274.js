// ==UserScript==
/*jshint esversion: 11 */
// @name         LineWorksRemoveIDTail
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  LineWorksのログイン画面へパスワードマネージャー等で入力した際の不要な@以降を自動的に削除します
// @author       mikan
// @match        https://auth.worksmobile.com/login/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worksmobile.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511274/LineWorksRemoveIDTail.user.js
// @updateURL https://update.greasyfork.org/scripts/511274/LineWorksRemoveIDTail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const input = document.querySelector('#user_id')
    input?.addEventListener('change',() => {
        input.value = input.value.replace(document.querySelector('#mail_domain')?.textContent,'')
    })
})();