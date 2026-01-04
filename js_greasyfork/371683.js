// ==UserScript==
// @name         mobile.lemonde.fr double columns curated
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Permet d'utiliser le site mobile.lemonde.fr sur grand écran, format double colonnes, sans pubs ni contenus premium aguicheurs. Nécessite un navigateur récent.
// @author       Jules Samuel Randolph
// @match        https://mobile.lemonde.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371683/mobilelemondefr%20double%20columns%20curated.user.js
// @updateURL https://update.greasyfork.org/scripts/371683/mobilelemondefr%20double%20columns%20curated.meta.js
// ==/UserScript==

(function(){
    const articles = Array.from(document.querySelectorAll('.co-thread > li:not([data-js])'))
    document.getElementsByTagName('main')[0].remove()
    document.getElementsByClassName('co-header__cta-container')[0].remove()
    const scripts = Array.from(document.getElementsByTagName('script'))
    const miscTexts = Array.from(document.querySelectorAll('[class^="cm-"]'))
    const ads = Array.from(document.getElementsByClassName('cm-ad-position'))
    const container = document.getElementsByClassName('ol-sticky-top__main-container')[0]
    const main = document.createElement('main')
    const ul = document.createElement('ul')
    const ulStyle = `
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: 28px;
        justify-content: center;
        max-width: 1280px;
        margin: auto;
    `
    articles.forEach((art) => ul.appendChild(art))
    main.appendChild(ul)
    container.appendChild(main)
    ul.style=ulStyle
    
    function remove(el) { el.remove() }
    Array.from(document.getElementsByClassName('ca-ico--premium-content')).forEach((el => el.parentNode.parentNode.parentNode.parentNode.remove()))
    miscTexts.forEach(remove)
    scripts.forEach(remove)
    ads.forEach(remove)    
})()