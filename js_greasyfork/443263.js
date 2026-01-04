// ==UserScript==
// @name         Font Sparrowsome
// @namespace    https://github.com/mroqueda/font-sparrowsome/
// @version      1.2
// @description  Oups, Font Awesome leaked
// @author       mroqueda
// @match        https://fontawesome.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fontawesome.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443263/Font%20Sparrowsome.user.js
// @updateURL https://update.greasyfork.org/scripts/443263/Font%20Sparrowsome.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getIconInfos = ()=>({
        family : (new URL(document.location)).searchParams.get("f"),
        style : (new URL(document.location)).searchParams.get("s"),
        icon : document.location.pathname.split('/').slice(-1)[0]
    })


    const updateOrInsertIcon = (infos)=>{
        if(!document.getElementById('sparrowButton')){
            var buttonsContainer = document.querySelector('.icon-actions')
            var button = `<a href="https://google.fr" id="sparrowButton" target="_blank"><button class="position-relative icon-action-svg-download" style="top: calc(var(--button-box-shadow-width) * -1);"><i class="fa-regular fa-face-smirking fa-2x"></i></button></a>`
            buttonsContainer.innerHTML = button + buttonsContainer.innerHTML
        }
        var element = document.getElementById('sparrowButton')
        var dlLink = [
            document.querySelectorAll('link[href^="https://site-assets.fontawesome.com/"]')[0].getAttribute('href').split('/').slice(0,-2).join('/'),
            "svgs",
            infos.family != "classic" ? infos.family+'-'+infos.style : infos.style,
            infos.icon+'.svg'
        ].join('/')
        element.href = dlLink
    }

    var lastLoadedIcon = null

    window.addEventListener("load", function(event) {

        setInterval(()=>{
            if(!lastLoadedIcon || JSON.stringify(lastLoadedIcon) != JSON.stringify(getIconInfos())){
                lastLoadedIcon = getIconInfos()
            }

            updateOrInsertIcon(getIconInfos())
        }, 100)
    })


})();