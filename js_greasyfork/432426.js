// ==UserScript==
// @name         Vandal Unblocker
// @namespace    vandalunblocker
// @version      0.1
// @run-at       document-idle
// @description  Unblock users
// @author       unsigned char*
// @match        https://vandal.elespanol.com/foro/mensaje/*
// @icon         https://www.google.com/s2/favicons?domain=vandal.elespanol.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432426/Vandal%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/432426/Vandal%20Unblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const USER_NAMES = [
        'Luca Brasi',
    ];

    class Unblocker {
        constructor(users) {
            this._users = users;
        }

        getPost(username) {
            return window.jQuery(`.unpost:has("div.mensaje_usuario_login span[title^='${username} ']"),.unpost:has("div.mensaje_usuario_login a[title^='${username} ']")`);
        }

        unblockPost($post) {
            if (!$post || !$post.length) {
                return;
            }
            $post.find("div[id^=mensaje_texto_].nd").removeClass("nd");
            $post.find("div[id^=mostrar_]").addClass("nd");
        }

        doUnblock() {
            for (let username of this._users) {
                this.unblockPost(this.getPost(username));
            }
        }
    };

    (new Unblocker(USER_NAMES)).doUnblock();
})();