// ==UserScript==
// @name         Sticky Video (with toggle)
// @name:es      Anclar Vídeo (con interruptor)
// @name:ja      動画を固定（スイッチ付き）
// @name:eo      Fiksi Videon (kun ŝaltilo)
// @namespace    https://github.com/JapanYoshi
// @version      0.1
// @description  Sticks YouTube videos on the top.
// @description:es Fija vídeos en YouTube en la parte superior.
// @description:ja 左上にYouTubeの動画を固定します。
// @description:eo Fiksas videojn supre-maldekstre.
// @author       JapanYoshi
// @match        https://www.youtube.com/watch?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30805/Sticky%20Video%20%28with%20toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30805/Sticky%20Video%20%28with%20toggle%29.meta.js
// ==/UserScript==

var toggleButton = document.createElement('SPAN');
toggleButton.innerHTML= '<input type="button" id="toggle-button" style="position:fixed;right:0px;top:50px;z-index:100;"/>';
var container = document.getElementById('page');
container.appendChild(toggleButton);
document.getElementById('toggle-button').addEventListener("click", toggleSticky);

var onLabel = "Stick";
var offLabel = "Unstick";

function addCss(cssString) {
    var head = document.
    getElementsByTagName('head')[0];
    if (head === false) {
        return;
    }
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}

addCss(
    "#player{z-index:2000000000 !important}.sticky #movie_player:not(.ytp-fullscreen){position:fixed;width:inherit;height:inherit;left:0px;top:0px}.sticky #theater-background{width:auto}.sticky #movie_player:hover{-webkit-transform:none}.sticky #player .player-api{position:fixed;top:0;left:0;background:none}.sticky #player{z-index:2000000000 !important}.sticky #masthead-positioner{z-index:1999999999 !important}.sticky #masthead-positioner:hover{z-index:2000000001 !important}.sticky #sb-wrapper{transform:translateX(-48px) translateY(-12px)}.sticky .sb-card-arrow,.sb-card-body-arrow{display:none}.sticky #watch7-sidebar{margin-top:0px}"
);

function toggleSticky() {
    var page = document.getElementById('page-container');
    if (page.classList.contains("sticky")) {
        page.classList.remove("sticky");
        document.getElementById('toggle-button').value = onLabel;
    } else {
        page.classList.add("sticky");
        document.getElementById('toggle-button').value = offLabel;
    }
}

toggleSticky();