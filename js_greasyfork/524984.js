// ==UserScript==
// @name         Abrir en panel lateral
// @namespace    http://tampermonkey.net/
// @version      2024-06-30-2319
// @description  Permite a los usuarios abrir la información de la carta en un panel lateral durante el uso de la búsqueda
// @author       CristianCG
// @license      MIT
// @match        https://www.cardmarket.com/*/*/Products/Singles
// @match        https://www.cardmarket.com/*/*/Products/Singles?*
// @match        https://www.cardmarket.com/*/*/Products/Singles/*
// @match        https://www.cardmarket.com/*/*/Products/Singles/*?*
// @match        https://www.cardmarket.com/*/*/Users/*/Offers/Singles
// @match        https://www.cardmarket.com/*/*/Users/*/Offers/Singles?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524984/Abrir%20en%20panel%20lateral.user.js
// @updateURL https://update.greasyfork.org/scripts/524984/Abrir%20en%20panel%20lateral.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let origin = window.location.origin;
    let rows = document.querySelectorAll(".container .table .table-body > .row");

    document.querySelector("body").insertAdjacentHTML( 'afterbegin', `<div id="loader-158424878484" style="background-color: #000000ee; position: fixed; right: 0; width: 50vw; height: 100vh;z-index: 2; display: none;"><span style="position: absolute;top: 55%;width: 100%;text-align: center;color: white;">Cargando</span></div>` );
    let loader = document.querySelector("#loader-158424878484");


    let addAddon = (row) => {
        if(!row) return;
        let a = row.querySelector(".col a[href]");
        let url = a.getAttribute("href");
        let div = document.createElement("div");
        div.classList.add("col-icon");
        let html = `<span class="open-in-right" tooltip="Abrir en panel lateral" href="${origin}${url}" style="cursor: pointer;">&#x21AA;</span>`;
        div.insertAdjacentHTML( 'afterbegin', html );
        row.prepend(div)

        div.querySelector("span").addEventListener('click', openInLateral);
    }

    let getIframe = () => {
        let iframe = document.querySelector("#iframe-158424878484");
        if(!iframe) {
            iframe = document.createElement("iframe");
            iframe.setAttribute("id","iframe-158424878484");

            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.paddingTop = "145px";
            iframe.style.height = "100vh";
            iframe.style.width = "50vw";;
            iframe.style.zIndex = "1";

            iframe.addEventListener('load', () => {
                let doc = iframe.contentWindow.document

                if(doc.querySelector(".main-wrapper"))
                   return;

                let style = document.createElement('style');
                style.innerHTML = `
                   body > .container {
                      padding-top: 0 !important;
                   }

                   .container > nav[aria-label="breadcrumb"] {
                      display: none;
                   }

                   `;
                doc.querySelector("head").prepend(style);

                let elements = doc.querySelectorAll("body > *");
                
                for(let i in elements) {
                    let e = elements[i];
                    if(!e.classList || !e.classList.contains("container")) {
                        try {
                            //e.remove();
                            e.style.display = "none";
                        } catch (ex) {
                            console.error(ex, e);
                        }
                    }
                }

                setTimeout(() => {
                    doc.querySelector(".container").style.paddingTop = "0";
                    loader.style.display = "none";
                }, 100);


            });

            document.querySelector("body").prepend(iframe);
        }
        return iframe;
    }

    let openInLateral = (ev) => {
        loader.style.display = "";
        let main = document.querySelector("body > main");
        main.style.width = "50vw";
        main.style.margin = 0;
        let src = ev.target.getAttribute("href");
        let iframe = getIframe();
        iframe.src = src;
    }



    for(let i in rows) {
        addAddon(rows[i]);
    }


})();