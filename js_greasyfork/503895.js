// ==UserScript==
// @name         Remoção banners DIO
// @namespace    http://tampermonkey.net/
// @version      2024-08-16
// @description  Já estou te pagando cara
// @author       gitlab.com/joao620
// @license      GNU AGPLv3 
// @match        https://web.dio.me/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dio.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503895/Remo%C3%A7%C3%A3o%20banners%20DIO.user.js
// @updateURL https://update.greasyfork.org/scripts/503895/Remo%C3%A7%C3%A3o%20banners%20DIO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ehBanner(node){
        if(!(node instanceof HTMLElement)) return

        const linkDoBanner = node.querySelector('section>div>a')
        if(!linkDoBanner) return false

        const textoLink = linkDoBanner.text.toLowerCase()
        if(textoLink != "descubra a oferta") return false

        return node
    }

    let retiradoBannerTopo = false
    const saiFooter = new MutationObserver(function(mutations) {
        const banners = mutations
            .map(m => m.addedNodes)
            .reduce((acc, x) => acc.concat(Array(...x)), []) //flattenn
            .filter(ehBanner)

        if(!retiradoBannerTopo){
            let possivelBannerTopo = banners.find(e => e.id == "banner")
            if(possivelBannerTopo) {
                saiFooter.disconnect()
                saiFooter.observe(document.querySelector('#root'),
                       {childList: true, subtree: false});
                //recrio o observer, mas agora sem ouvir todas as mudaças no #root, só os na raizes, que é onde o footer aparece

                let retiradoBannerTopo = true
            }
        }

        banners.forEach(e => { e.style.display = 'none' })
    })

    saiFooter.observe(document.querySelector('#root'),
        {childList: true, subtree: true});
})();