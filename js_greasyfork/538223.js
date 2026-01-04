// ==UserScript==
// @name        Lamucal Premium - lamucal.com
// @namespace   https://github.com/Thibb1
// @match       https://lamucal.com/*
// @match       https://www.lamucal.com/*
// @grant       none
// @version     1.0
// @author      Thibb1
// @description Unlock premium features on Lamucal
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/538223/Lamucal%20Premium%20-%20lamucalcom.user.js
// @updateURL https://update.greasyfork.org/scripts/538223/Lamucal%20Premium%20-%20lamucalcom.meta.js
// ==/UserScript==

(function() {
    function getCookies() {
        return document.cookie.split('; ').reduce((cookies, cookie) => {
            const [name, value] = cookie.split('=');
            cookies[name] = value;
            return cookies;
        }, {});
    }

    function setCookie(name, value) {
        document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    }

    const cookies = getCookies();

    if (cookies['aiErp_is_all_vip'] !== undefined) {
        setCookie('aiErp_is_all_vip', '1');
    }
    if (cookies['aiErp_is_remover_vip'] !== undefined) {
        setCookie('aiErp_is_remover_vip', '1');
    }
    if (cookies['aiErp_is_tabs_vip'] !== undefined) {
        setCookie('aiErp_is_tabs_vip', '1');
    }
    if (cookies['aiErp_is_cover_vip'] !== undefined) {
        setCookie('aiErp_is_cover_vip', '1');
    }
})();