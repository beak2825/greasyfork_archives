// ==UserScript==
// @name         Filmix Upgrade
// @name:uk      Filmix Upgrade
// @namespace    http://tampermonkey.net/
// @version      0.154
// @description  small update for Filmix. Remove Ad blocks, remove "disable adblock" message, hide info, scale video frame size.
// @description:uk невелике оновлення для Filmix
// @author       Ant1gon
// @match        *://filmix.ac/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420057/Filmix%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/420057/Filmix%20Upgrade.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = _ => {
        resizePlayer();
        addShowInfoButton();
        let timerId = setInterval(removeElements, 1500);
        setTimeout(() => { clearInterval(timerId); }, 6000);
    }
})();

function resizePlayer() {
    if (document.querySelector('.players') != null) {
        document.querySelector('.players').style.width = "auto";
        document.querySelector('.players').style.height = "auto";
    };
    if (document.querySelector('#player') != null) { document.querySelector('#player').style.width = "auto" };
}

function addShowInfoButton() {
    let moreInfoLangs = {
        en: "Show info",
        uk: "Показати інформацію",
        ru: "Показать информацию"
    }
    let userLang = navigator.language || navigator.userLanguage || "en";
    var buttonEl = document.createElement("input");
    buttonEl.value = Object.keys(moreInfoLangs).includes(userLang)? moreInfoLangs[userLang] :  moreInfoLangs["en"];
    buttonEl.type = "button";
    buttonEl.style.height = "34px";
    buttonEl.style.marginLeft = "15px";
    buttonEl.className = "m-button";
    buttonEl.addEventListener("click", _ => {
        let x = document.querySelector(".fullstory");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    });

    if (document.querySelector(".hidden-block") == null) {
        let hidBlock = document.createElement("div");
        hidBlock.className = "hidden-block";
        document.querySelector(".player-title").parentElement.appendChild(hidBlock);
    }

    document.querySelector(".hidden-block").appendChild(buttonEl);
}

function removeElements(argument) {
    document.querySelectorAll("pjsdiv").forEach(e => {
        if (e.innerText.indexOf("Просмотр без ограничений доступен с отключенным AdBlock!") !== -1) {
            if (e.id != 'oframeplayer') {
                e.remove();
            }
        }
    })
    let selectorsToRemove = ['.mgbox', '.fullstory', '.information', '.frames', '.aside-wrap', '.player-title'];
    selectorsToRemove.forEach(e => {
        if (document.querySelector(e) != null && e != '.aside-wrap') {
            document.querySelector(e).style.display = "none";
        } else {
            if (document.querySelector('.aside-wrap') != null) {
                document.querySelector('.aside-wrap').parentNode.style.display = "none";
            };
        }
    });
    let selectorsToWidth100 = ['.content', '.player-item'];
    selectorsToWidth100.forEach(e => {
        if (document.querySelector(e) != null) { document.querySelector(e).style.width = '100%' };
    });
    document.querySelectorAll(".information.warning").forEach(e => {
        e.remove();
    })
    // body...
}