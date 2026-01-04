// ==UserScript==
// @name         Florr.io map
// @name:ru      Florr.io карта
// @name:uk      Florr.io карта
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Add custom map to florr.io
// @description:ru  Добавляет карту для florr.io
// @description:uk  Додає карту для florr.io
// @author       You
// @match        https://florr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459269/Florrio%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/459269/Florrio%20map.meta.js
// ==/UserScript==

$(`
<div id="florr-map">
    <img src="https://media.discordapp.net/attachments/668939882416308274/1103484180945436682/Map_21_-_May_3.png?width=680&height=676" class="map-image">
</div>
<div id="florr-map-big">
    <img src="https://media.discordapp.net/attachments/668939882416308274/1103484180945436682/Map_21_-_May_3.png?width=680&height=676" class="map-image">
</div>
<style>
#florr-map {
    width: 150px;
    height: 150px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 10px;
    border: 3px solid #000;
    border-radius: 5px;
    opacity: 0.7;
    background: #000;
    transition: all 0.3s ease-out;
}
#florr-map-big {
    width: 800px;
    height: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border: 3px solid #000;
    border-radius: 5px;
    opacity: 0.9;
    background: #000;
    display: none;
}
.map-image {
    width: inherit;
    height: inherit;
}
.map-full, .map-full-hover {
    width: 300px !important;
    height: 300px !important;
    opacity: 1 !important;
}
.active-map {
    transform: none;
}
.hidden-map {
    transform: translate(105%, 105%);
}
</style>
`).appendTo(document.body);

let florrMap     = $("#florr-map"),
    florrMapBig  = $("#florr-map-big");

document.addEventListener("keyup", (e) => {
    if (e.code === "KeyN") florrMap.toggleClass("active-map").toggleClass("hidden-map");
    if (e.code === "KeyB") florrMap.toggleClass("map-full");
});
florrMap.click(() => florrMapBig.toggle());
florrMap.hover(() => florrMap.addClass("map-full-hover"), () => florrMap.removeClass("map-full-hover"));
florrMapBig.click(() => florrMapBig.toggle());