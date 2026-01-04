// ==UserScript==
// @name               Redirect YouTube Shorts
// @name:en            Redirect YouTube Shorts
// @name:id            Redirect YouTube Shorts
// @name:zh-CN         Redirect YouTube Shorts
// @name:zh-TW         Redirect YouTube Shorts
// @name:ja            Redirect YouTube Shorts
// @name:ko            Redirect YouTube Shorts
// @name:fr            Redirect YouTube Shorts
// @name:es            Redirect YouTube Shorts
// @name:de            Redirect YouTube Shorts
// @name:ru            Redirect YouTube Shorts
// @description        Seamlessly redirect YouTube Shorts to the regular video player without reloading the page
// @description:en     Seamlessly redirect YouTube Shorts to the regular video player without reloading the page
// @description:id     Alihkan YouTube Shorts secara otomatis ke pemutar video biasa tanpa perlu memuat ulang halaman
// @description:zh-CN  自动将 YouTube Shorts 无缝跳转到普通视频播放器，无需刷新页面
// @description:zh-TW  自動將 YouTube Shorts 無縫跳轉到一般影片播放器，無需重新整理頁面
// @description:ja     ページを再読み込みせずに YouTube Shorts を通常の動画プレーヤーで自動再生します
// @description:ko     페이지 새로고침 없이 YouTube 쇼츠를 일반 동영상 플레이어로 자동 전환합니다
// @description:fr     Redirige automatiquement les YouTube Shorts vers le lecteur classique, sans rechargement de la page
// @description:es     Redirige automáticamente YouTube Shorts al reproductor normal sin recargar la página
// @description:de     Leitet YouTube Shorts automatisch zum normalen Videoplayer um, ohne die Seite neu zu laden
// @description:ru     Автоматически перенаправляет YouTube Shorts в обычный видеоплеер без перезагрузки страницы
// @version            3.0.0
// @run-at             document-start
// @inject-into        page
// @match              https://www.youtube.com/*
// @match              https://m.youtube.com/*
// @exclude            https://*.youtube.com/live_chat*
// @exclude            https://*.youtube.com/embed*
// @exclude            https://*.youtube.com/tv*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author             Fznhq
// @namespace          https://github.com/fznhq
// @homepageURL        https://github.com/fznhq/userscript-collection
// @homepage           https://github.com/fznhq/userscript-collection
// @compatible         firefox
// @compatible         chrome
// @compatible         safari
// @compatible         opera
// @compatible         edge
// @license            GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/538083/Redirect%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/538083/Redirect%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function () {
    if (location.pathname.startsWith("/shorts")) {
        return location.replace(location.href.replace("/shorts/", "/watch?v="));
    }

    const isMobile = location.host === "m.youtube.com";
    const shortsIdRegex = /shorts\/([^#&?]*)/;
    const anchor = document.createElement("a");

    /**
     * @param {object} obj
     * @param {string} target
     * @param {any} [value]
     * @param {boolean} [parent]
     * @returns {any}
     */
    function dig(obj, target, value, parent, _parent_obj) {
        if (!obj || typeof obj !== "object") return;

        if (target in obj) {
            if (value ? obj[target] === value : !dig(obj[target], target)) {
                const output = (parent && _parent_obj) || obj;
                if (!parent || output.reelWatchEndpoint) return output;
            }
        }

        for (const k in obj) {
            const result = dig(obj[k], target, value, parent, obj);
            if (result !== undefined) return result;
        }
    }

    /**
     * @param {HTMLAnchorElement} element
     * @param {string} id
     * @returns {object | undefined}
     */
    function findData(element, id) {
        while (element && element.tagName !== "YTD-APP") {
            const data = dig(element.data, "videoId", id, true);
            if (data) return data;
            element = element.parentElement;
        }
    }

    /**
     * @param {object} data
     * @param {string} id
     */
    function replaceState(data, id) {
        if (data && data.reelWatchEndpoint.videoId) {
            const metadata = dig(data, "url");
            metadata.url = "/watch?v=" + id;
            metadata.webPageType = "WEB_PAGE_TYPE_WATCH";
            data.watchEndpoint = { videoId: id };
            data.reelWatchEndpoint = {};
        }
    }

    /**
     * @param {string} id
     */
    function redirectShorts(id) {
        for (const element of document.querySelectorAll(`a[href*="${id}"]`)) {
            element.href = "/watch?v=" + id;
            replaceState(findData(element, id), id);
        }
    }

    /**F
     * @param {string} url
     */
    function redirectShortsMobile(url) {
        document.body.append(anchor);
        anchor.href = url.replace("/shorts/", "/watch?v=");
        anchor.click();
        anchor.remove();
    }

    function handleShorts(/** @type {MouseEvent} */ ev) {
        const shorts = ev.target.closest?.("a[href^='/shorts/']");

        if (shorts) {
            if (isMobile) {
                ev.preventDefault();
                ev.stopPropagation();
                redirectShortsMobile(shorts.href);
            } else {
                redirectShorts(shorts.href.match(shortsIdRegex)[1]);
            }
        }
    }

    function NavigationHandler(/** @type {CustomEvent} */ ev) {
        const endpoint = ev.detail.endpoint;
        const id = endpoint?.reelWatchEndpoint?.videoId;

        if (id) {
            const target = document.querySelector("a[href='/']");
            if (target && target.data) {
                replaceState(endpoint, id);
                const originalState = target.data;
                target.data = endpoint;
                target.click();
                target.data = originalState;
            }
        }
    }

    window.addEventListener("yt-navigate-start", NavigationHandler, true);
    window.addEventListener("click", handleShorts, true);
    if (!isMobile) window.addEventListener("mouseover", handleShorts, true);
})();
