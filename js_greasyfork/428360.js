// ==UserScript==
// @name        Display anime names under pictures
// @namespace   Violentmonkey Scripts
// @match       https://animebytes.tv/collage.php
// @match       https://animebytes.tv/
// @grant       none
// @version     1.2
// @author      Lukáš Kucharczyk
// @description Displays anime titles underneath posters on the collage page.
// @supportURL  https://git.kucharczyk.xyz/lukas/userscripts
// @downloadURL https://update.greasyfork.org/scripts/428360/Display%20anime%20names%20under%20pictures.user.js
// @updateURL https://update.greasyfork.org/scripts/428360/Display%20anime%20names%20under%20pictures.meta.js
// ==/UserScript==
let url_selectors = {
    "^(https?://)?animebytes.tv/?$": ".aot_inner",
    "^(https?://)?animebytes.tv/collage.php": "#collage_table tbody tr td"
}
let selectors_as_array = Object.entries(url_selectors)
let selector = selectors_as_array.filter(([key, value]) => {
    let regex = new RegExp(key)
    return regex.test(window.location)
})
let elements = document.querySelectorAll(selector[0][1])
elements.forEach((element) => {
    let anime_title = element.querySelector('a img').attributes['alt'].value
    let anime_title_div = document.createElement('div')
    anime_title_div.style = 'width: 125px; height: 50px;'
    element.appendChild(anime_title_div)
    anime_title_div.innerText = anime_title
})