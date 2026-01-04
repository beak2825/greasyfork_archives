// ==UserScript==
// @name Multi-script Para TMO
// @namespace Mother Of Mangas
// @version 3.13
// @description Quiero Ver Mi MANGA!!!!
// @homepageURL      https://greasyfork.org/es/scripts/430361-multi-script-para-tmo
// @icon         https://zonatmo.com/favicon/android-chrome-192x192.png
// @author IRhoAias
// @connect        *
// @grant          GM.getResourceUrl
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceURL
// @license Copyright IRhoAias
// @match *://*lectortmo.com/*
// @match *://*visortmo.com/*
// @match *://*zonatmo.com/*
// @exclude *://*lectortmo.com/view_uploads/*
// @exclude *://*visortmo.com/view_uploads/*
// @exclude *://*zonatmo.com/view_uploads/*

// @match *://*/*

// @downloadURL https://update.greasyfork.org/scripts/430361/Multi-script%20Para%20TMO.user.js
// @updateURL https://update.greasyfork.org/scripts/430361/Multi-script%20Para%20TMO.meta.js
// ==/UserScript==

//PAGE

(function() {
    'use strict';

    var Regex12 = /\/[0-9a-zA-Z]{12}\//;
    var Regex32 = /\/[0-9a-zA-Z]{13,32}\//;
    var News = /\/news\//;
    var Juegos = /\/juegos\//;

    function extractUrl() {
        return window.location.href;
    }
    function extractPathname() {
        return window.location.pathname;
    }
    function isTMO() {
        const url = extractUrl();
        return url.includes('zonatmo.com');
    }
    function TMOUploads() {
        const url = extractUrl();
        return url.includes('zonatmo.com/view_uploads');
    }

    function CallBack() {
    const pathname = extractPathname();
    const matchesRegex12 = Regex12.test(pathname);
    const isNewsPath = News.test(pathname);
    const isNotTMO = !isTMO();
    const isNotUploads = !TMOUploads();

    if (matchesRegex12 && isNewsPath && isNotTMO && isNotUploads) {
        window.history.back();
    }
}


    function GamePath() {
        const pathname = extractPathname();
        if (Regex32.test(pathname) && Juegos.test(pathname) && !isTMO()) {
            location.href = location.href.replace(
                "juegostmo.com/juegos/",
                "zonatmo.com/viewer/"
            );
        }
    }

    function redirectTMO() {
        const url = extractUrl();
        const pathname = extractPathname();
        if (Regex32.test(pathname) && News.test(pathname) && !isTMO()) {
            location.href = location.href.replace(
                /\/news\/([^\/]+)\/cascade[0-9]*/,
                `/viewer/$1/cascade`
            ).replace(location.host, "zonatmo.com");
        }
    }

const CURRENT_VERSION = "3.13";
    const VERSION_URL = "https://raw.githubusercontent.com/IRhoAias/TMO-Script-Redirect-replace/refs/heads/main/version.json";

    function checkScriptVersion() {
        fetch(VERSION_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener la versión del script.");
                }
                return response.json();
            })
            .then(data => {
                const latestVersion = data.version;
                if (isOutdated(CURRENT_VERSION, latestVersion)) {
                    notifyUpdate(latestVersion);
                } else {
                    console.log("El script está actualizado.");
                }
            })
            .catch(error => {
                console.error("No se pudo verificar la versión del script:", error);
            });
    }

    function isOutdated(current, latest) {
        const currentParts = current.split('.').map(Number);
        const latestParts = latest.split('.').map(Number);

        for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
            const currentPart = currentParts[i] || 0;
            const latestPart = latestParts[i] || 0;
            if (currentPart < latestPart) return true;
            if (currentPart > latestPart) return false;
        }
        return false;
    }

    // Notificar de actualización
    function notifyUpdate(latestVersion) {
        alert(`¡Una nueva versión "Multi-script Para TMO" está disponible!\n\nVersión actual: ${CURRENT_VERSION}\nÚltima versión: ${latestVersion}\n\nPor favor, actualiza el script.`);
    }

    CallBack();
    GamePath();
    redirectTMO();

    if (isTMO()) {
        checkScriptVersion();
    }

})();

//✙[̲̅S][̲̅c][̲̅r][̲̅i][̲̅p][̲̅t]✙
//▢▇▇▇▇▇▇▇▇▇▇▇▇▇▇▢
//        　   　╭━╮╭━╮   ╭╮ ╱
//      　     　╰━┫╰━┫   ╰╯╱╭╮
//          　 　╰━╯╰━╯　  ╱ ╰╯
//　　　         COMPLETE



  document.addEventListener('keydown', logKey);
function logKey(e) {
    if (e.code === "ArrowRight") {
        const nextChapter = document.querySelector(".chapter-next a");
        if (nextChapter && nextChapter.href) {
            location.href = nextChapter.href;
        }
    }
    if (e.code === "ArrowLeft") {
        const prevChapter = document.querySelector(".chapter-prev a");
        if (prevChapter && prevChapter.href) {
            location.href = prevChapter.href;
        }
    }
}