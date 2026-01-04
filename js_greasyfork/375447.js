// ==UserScript==
// @name                虾米新旧版切换
// @namespace           http://www.xiami.com/
// @version             0.1
// @author              yelo <zhihuzeye@gmail.com>
// @homepage            https://gist.github.com/imyelo/98ec319fc72574f46f089777fc8a23f6
// @match               https://www.xiami.com/*
// @require             https://unpkg.com/js-cookie@2.2.0/src/js.cookie.js
// @grant               GM_notification
// @grant               GM_registerMenuCommand
// @description:zh-cn   使用菜单切换新旧版虾米
// @description 使用菜单切换新旧版虾米
// @downloadURL https://update.greasyfork.org/scripts/375447/%E8%99%BE%E7%B1%B3%E6%96%B0%E6%97%A7%E7%89%88%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/375447/%E8%99%BE%E7%B1%B3%E6%96%B0%E6%97%A7%E7%89%88%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    var Cookies = window.Cookies

    var COOKIE = {
        LEGACY: {
            NAME: 'xm_expect_legacy',
            VALUE: '1',
        },
    }

    function isLegacy () {
        return Cookies.get(COOKIE.LEGACY.NAME) === COOKIE.LEGACY.VALUE
    }

    function useLegacy () {
        if (isLegacy()) {
            return
        }
        Cookies.set(COOKIE.LEGACY.NAME, COOKIE.LEGACY.VALUE)
        GM_notification('已切换至旧版虾米')
        window.location.reload()
    }

    function useLatest () {
        if (!isLegacy()) {
            return
        }
        Cookies.remove(COOKIE.LEGACY.NAME)
        GM_notification('已切换至新版虾米')
        window.location.reload()
    }

    GM_registerMenuCommand('使用旧版虾米', useLegacy)
    GM_registerMenuCommand('使用新版虾米', useLatest)
})();
