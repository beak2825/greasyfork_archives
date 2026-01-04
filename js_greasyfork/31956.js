// ==UserScript==
// @name           Direct Torrent Link
// @name:ru        Прямые ссылки на торрент-файлы
// @description    Direct torrent links on small- and big-games.info
// @description:ru Прямые ссылки на торрент-файлы на small- and big-games.info
// @version        1.5.3
// @date           2018-09-08
// @author         Halibut
// @namespace      https://greasyfork.org/en/users/145947-halibut
// @homepageURL    https://greasyfork.org/en/scripts/31956-direct-torrent-link
// @supportURL     https://greasyfork.org/en/scripts/31956-direct-torrent-link/feedback
// @license        HUG-WARE
// @include        http://small-games.info/?go=game*
// @include        https://small-games.info/?go=game*
// @include        http://big-games.info/game/*
// @include        https://big-games.info/game/*
// @noframes
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/31956/Direct%20Torrent%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/31956/Direct%20Torrent%20Link.meta.js
// ==/UserScript==

/******************************************************************************
 * "THE HUG-WARE LICENSE" (Revision 2): As long as you retain this notice you *
 * can do whatever you want with this stuff. If we meet some day, and you     *
 * think this stuff is worth it, you can give me/us a hug.                    *
******************************************************************************/

((imgEn, imgRu, links, scrEl, nmEl, dlLnks, listener) => {
    "use strict";
    let createMissedTorrentLinks = true,
        // Set the value of this variable to "true", so that the script creates links to torrent files if they does not exists.
        // Such links will be highlighted with an orange border and can work only in some cases.
        // Установите значение для переменной "true", чтобы скрипт создавал ссылки на торрент-файлы при их отсутствие.
        // Такие ссылки будут выделены оранжевой границей и могут сработать лишь в некоторых случаях.
        addSearchLink = true;
        // Set the value of this variable to "true", so that the script create search link for game with MagnetDL.
        // Установите значение для переменной "true", чтобы скрипт создавал ссылку для поиска игры на MagnetDL.
    if (links && !!links.length)
        for (let link of links) {
            let img = link.getElementsByTagName("img")[0];
            img && (img.src = listener.isRu ? imgRu : imgEn);
            link.addEventListener("click", listener);
        }
    if (createMissedTorrentLinks && scrEl && (!(links && !!links.length) || !links.some(el => el.search.startsWith("?gid=")))) {
        let gid = scrEl.textContent.match(/\d+(?=(?:\s+)?\);)/)[0],
            el = dlLnks.insertBefore(document.createElement("div"), dlLnks.getElementsByTagName("div")[0]),
            tLink = el.appendChild(document.createElement("a")),
            img = tLink.appendChild(document.createElement("img"));
        el.align = "center";
        img.src = listener.isRu ? imgRu : imgEn;
        if (!document.title.includes("торрент")) {
            img.style.outline = "2px dashed orangered";
            img.title = listener.isRu
                ? "Для игры на этой странице торрент-файл отсутствовал, и эта ссылка была добавлена скриптом \"" + listener.locName + "\".\nОна может не сработать!"
                : "For the game on this page torrent file was not present, and this download link was added by the script \"" + listener.locName + "\".\nIt's may not work!";
        }
        tLink.href = "/getTorrents.php?gid=" + gid;
        tLink.addEventListener("click", listener);
    }
    if (addSearchLink) {
        let gameName = nmEl instanceof Element
                ? nmEl.textContent
                : document.title.split(/(?:\s+?(?:(?:(?:(?:v(?:ersion)?|demo|build|alpha|beta|update)?\s?[.-\d]+)|\[|\/).+)?\-\s+?(?:торрент,\s+?)?скачать)/i)[0],
            searchLink = dlLnks.insertBefore(document.createElement('a'), dlLnks.getElementsByTagName("div")[0]);
        searchLink.className = "fo-link";
        searchLink.href = "http://www.magnetdl.com/search/?q=" + gameName.replace(/\s/g, '+') + "&m=1/";
        searchLink.target = "_blank";
        searchLink.style.lineHeight = "3em";
        searchLink.textContent = listener.isRu
            ? "Искать \"" + gameName + "\" на \"MagnetDL\""
            : "Search for \"" + gameName + "\" with \"MagnetDL\"";
    }
})(
    "data:image/png;base64,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"
    , "data:image/png;base64,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"
    , [...document.getElementsByTagName("a")].filter(el => el.pathname == "/getTorrents.php")
    , [...document.getElementsByTagName("script")].find(el => el.textContent && el.textContent.includes("vkAsyncInit"))
    , document.getElementsByClassName("light")[0].nextElementSibling.nextElementSibling.firstChild
    , (document.getElementById("download_links") || document.getElementsByName("download_links")[0]).parentNode
    , {
        get win()  {
            delete this.win;
            return this.win = window.top
        }
        , get GMInfo() {
            delete this.GMInfo;
            return this.GMInfo = GM_info || GM && GM.info
        }
        , get isNewGM() {
            delete this.isNewGM;
            return this.isNewGM = !!(this.GMInfo && ((this.GMInfo.scriptHandler && this.GMInfo.scriptHandler == "Greasemonkey"
                                                      || this.GMInfo.uuid && this.GMInfo.uuid == "ba3fdd82-567b-40fc-b5f4-f6f8ba296904")
                                                     && this.GMInfo.version && parseInt(this.GMInfo.version) >= 4))
        }
        , get isRu() {
            delete this.isRu;
            return this.isRu = this.win.navigator.language.toLowerCase().includes("ru")
        }
        , get locName() {
            delete this.locName;
            return this.locName = this.isRu
                ? (this.GMInfo.localizedName || this.GMInfo.scriptMetaStr.match(/name:ru\s+(.+)/)[1])
                : this.GMInfo.script.name
        }
        , getDirectLink(aURL) {
            return new Promise((res, rej) => {
                if (this.isNewGM) {
                    // Yes, strange, but this code, with standard XMLHttpRequest and without using GM.xmlHttpRequest API, is work for cross origin requests in GM 4+
                    // Possibly some bug in GM, and this code is stooped working in newly versions of GM (because this is security hole),
                    // but I can't make work this script on FF57 with GM 4+ and with new GM.xmlHttpRequest API
                    const xhr = new XMLHttpRequest();
                    xhr.open("HEAD", aURL, true);
                    xhr.onload = (re, reURL) => {
                        if (!(xhr.readyState == 4 && xhr.status == 200))
                            return rej(xhr.statusText + " [" + re.type + ":" + xhr.status + "]");
                        try {
                            reURL = decodeURIComponent(xhr.responseURL).match(/https?:\/\/(small|big)-games\.info\/.+\.torrent/)[0]
                        }
                        catch(ex) {
                            rej(xhr.responseURL ? (this.isRu ? "Полученная ссылка: " : "Response URL is: ") + xhr.responseURL : ex)
                        }
                        res(reURL)
                    };
                    xhr.onerror = xhr.onabort = xhr.ontimeout = er => rej(xhr.statusText + " [" + er.type + ":" + xhr.status + "]");
                    xhr.send(null)
                }
                else {
                    GM_xmlhttpRequest({
                        method: "HEAD"
                        , url: aURL
                        , onload: (re, reURL) => {
                            if (!(re.readyState == 4 && re.status == 200))
                                return rej(re.statusText + " [" + re.status + "]");
                            try {
                                reURL = decodeURIComponent(re.finalUrl).match(/https?:\/\/(small|big)-games\.info\/.+\.torrent/)[0]
                            }
                            catch(ex) {
                                rej(re.finalUrl ? (this.isRu ? "Полученная ссылка: " : "Response URL is: ") + re.finalUrl : ex)
                            };
                            res(reURL)
                        }
                        , onabort: er => rej(er.statusText + " [" + er.status + "]")
                        , ontimeout: er => rej(er.statusText + " [" + er.status + "]")
                        , onerror: er => rej(er.statusText + " [" + er.status + "]")
                    })
                }
            })
        }
        , handleEvent(e) {
            if (e.button != 0) return;
            e.preventDefault(); e.stopPropagation();
            let link = e.target;
            while (link && link.localName != "a")
                link = link.parentNode;
            this.getDirectLink(link.href).then(
                reURL => reURL && (this.win.location.href = reURL)
                , error => this.win.alert("\"" + this.locName + "\":\n" +
                                          (this.isRu ? "Не удалось получить прямую ссылку!\n" : "Could not get a direct link!\n") + error)
            )
        }
    }
);