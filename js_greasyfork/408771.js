// ==UserScript==
// @name        MangaNato (Formerly Manganelo) Scripts (Next/Prev Chapter & Image Resize)
// @namespace   ew0345
// @match       *://*manganato.*/*/*
// @match       *://*manganelo.*/*/*
// @match       *://*natomanga.*/*/*
// @grant       none
// @version     1.5.4
// @author      ew0345, Qther
// @description Allows L/R arrow key navigation between chapters, reize chapter images using / key & allows for adding manga to be automatically resize with ].
// @icon        https://manganato.com/favicon-96x96.png
// @downloadURL https://update.greasyfork.org/scripts/408771/MangaNato%20%28Formerly%20Manganelo%29%20Scripts%20%28NextPrev%20Chapter%20%20Image%20Resize%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408771/MangaNato%20%28Formerly%20Manganelo%29%20Scripts%20%28NextPrev%20Chapter%20%20Image%20Resize%29.meta.js
// ==/UserScript==

var chapterImages = ['.container-chapter-reader img'];
var chapterButtons = ['.navi-change-chapter-btn-prev', '.navi-change-chapter-btn-next', '.btn-navigation-chap .next', '.btn-navigation-chap .back'];
var widthPercent = 100;
var mangaId = {};
var mangaIdMatch = false;


function checkMangaIds() {
    mangaId = JSON.parse(localStorage.getItem("__mangas")) || {};

    if (Object.keys(mangaId).length === 0) {
        Object.assign(mangaId, {mangas: {}});
        localStorage.setItem("__mangas", JSON.stringify(mangaId));
    }

    for (var i = 0; i < Object.keys(mangaId["mangas"]).length; i++) {
        if (document.location.toString().indexOf(Object.keys(mangaId["mangas"])[i]) >= 0) {
            console.log("%cFound match for manga with id: "+Object.keys(mangaId["mangas"])[i], "color:#00FF00");
            widthPercent = parseInt(Object.values(mangaId["mangas"])[i]);
        } else {
            console.log("%cFailed match for: "+Object.keys(mangaId["mangas"])[i], "color:#ff0000");
        }
    }
    if (widthPercent != 100) {
        resize();

    }
}

function userAddManga() {
    var mangaName = prompt("Copy and paste 'manga-######' or the manga name (with dashes) from webpage URL");
    var mangaSize = prompt("Percent to resize to");
    mangaName = mangaName.valueOf().toLowerCase();
    mangaSize = parseInt(mangaSize);

    Object.assign(mangaId.mangas, {[mangaName]: mangaSize});
    localStorage.setItem("__mangas", JSON.stringify(mangaId));

    checkMangaIds();
}

function resize() {
    if (widthPercent == 0 || widthPercent == 100) {
        var inp = prompt('Image Width / %\n\'autoh\' to fit images to page height,\n\'autow\' to fit images to page width.');
        widthPercent = inp.valueOf().toLowerCase();
    }

    if (widthPercent === "autow" || widthPercent === "w" || widthPercent === "fitw") {
        var pageWidth = document.body.clientWidth;

        for (var i = 0; i < document.querySelectorAll(chapterImages).length; i++) {
            document.querySelectorAll(chapterImages)[i].style.width = pageWidth / document.querySelectorAll(chapterImages)[i].width * 100 + '%';
        }
    } else if (widthPercent === "autoh" || widthPercent === "h" || widthPercent === "fith" || widthPercent === "4koma") {
        var pageWidth = document.body.clientWidth;
        var pageHeight = window.height;

        for (var i = 0; i < document.querySelectorAll(chapterImages).length; i++) {
            document.querySelectorAll(chapterImages)[i].style.width = pageWidth / document.querySelectorAll(chapterImages)[i].width * 100 + '%';
            document.querySelectorAll(chapterImages)[i].style.width = pageHeight / document.querySelectorAll(chapterImages)[i].height * 100 + '%';
        }
    } else if (widthPercent === 0) {
        return;
    } else {
        for (var i = 0; i < document.querySelectorAll(chapterImages).length; i++) {
            document.querySelectorAll(chapterImages)[i].style.width = widthPercent + '%';
        }
    }
    widthPercent = 100;
}

window.onkeydown = function(e) {
    switch (e.key) {
        case "ArrowLeft":
            if (document.location.toString().indexOf("natomanga") || document.location.toString().indexOf("manganato.gg") >= 0) {
                document.querySelectorAll(chapterButtons[2]).length > 0 ? document.location = document.querySelectorAll(chapterButtons[2])[0].href : console.error('Already on first chapter.');
            } else {
                document.querySelectorAll(chapterButtons[0]).length > 0 ? document.location = document.querySelectorAll(chapterButtons[0])[0].href : console.error('Already on first chapter.');
            }
           break;
        case "ArrowRight":
            if (document.location.toString().indexOf("natomanga") || document.location.toString().indexOf("manganato.gg") >= 0) {
                document.querySelectorAll(chapterButtons[3]).length > 0 ? document.location = document.querySelectorAll(chapterButtons[3])[0].href : console.error('Already on last chapter');
            } else {
                document.querySelectorAll(chapterButtons[1]).length > 0 ? document.location = document.querySelectorAll(chapterButtons[1])[0].href : console.error('Already on last chapter');
            }
           break;
        case "ArrowUp":
            resize();
            break;
        case "]":
            userAddManga();
            break;
        default:
            break;
    }
}

if (document.readyState !== 'loading') {
    setTimeout(checkMangaIds, 0);
} else {
    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(checkMangaIds, 0);
    });
}