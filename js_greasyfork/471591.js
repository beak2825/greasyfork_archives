// ==UserScript==
// @name         Chollometro - Bloqueo de tiendas
// @version      1.02
// @description  Bloqueador de tiendas en chollometro.com
// @author       Seralfa
// @match        https://www.chollometro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chollometro.com
// @run-at       document-end
// @grant GM_getValue
// @grant GM_setValue
// @namespace https://greasyfork.org/users/1134773
// @downloadURL https://update.greasyfork.org/scripts/471591/Chollometro%20-%20Bloqueo%20de%20tiendas.user.js
// @updateURL https://update.greasyfork.org/scripts/471591/Chollometro%20-%20Bloqueo%20de%20tiendas.meta.js
// ==/UserScript==

setInterval(function(){
    var Tiendas = GM_getValue("ListaTiendas", null).split(';');
    var Oferta = new Set([
        document.getElementsByClassName('overflow--wrap-off text--b text--color-brandPrimary link'),
        document.getElementsByClassName('overflow--wrap-off text--b text--color-greyShade link'),
    ]);
    Oferta.forEach(elements => {
        for (var i = 0; i < elements.length; i++) {
            for (var j = 0; j < Tiendas.length; j++) {
                if (elements[i].innerHTML.trim() == Tiendas[j]) {
                    var Anuncio = elements[i].parentNode.parentNode.parentNode.parentNode
                    Anuncio.parentNode.removeChild(Anuncio);
                }
            }
        }
    });
}, 1000)
window.addEventListener("load", function(event){
    var buttonpos = document.getElementsByClassName('lbox--v-9 vue-rendered')[0]
    var nb1 = document.createElement("div");
    nb1.setAttribute('class', 'navDropDown space--ml-2');
    var nb2 = document.createElement("button");
    nb2.setAttribute('type', 'button');
    nb2.setAttribute('class', 'navDropDown-trigger overflow--visible button button--shape-circle button--type-primary button--mode-white button--square');
    nb2.setAttribute('data-t-click', 'ga');
    nb2.setAttribute('data-t', 'msgDropdown');
    nb2.onclick = function () {
        var PromptTiendas = prompt("Añadir cada tienda separada con ; y sin espacios (Tienda1;Tienda2;Tienda3...)",GM_getValue("ListaTiendas", null));
        if (PromptTiendas === null) {
            return;
        }
        GM_setValue("ListaTiendas", PromptTiendas);
    };
    var nb3 = document.createElement("svg");
    nb3.setAttribute('width', '22');
    nb3.setAttribute('height', '22');
    nb3.setAttribute('class', 'icon icon--gear');
    var nb4 = document.createElement("use");
    nb4.innerHTML = "&#9940;";
    nb3.appendChild(nb4);
    nb2.appendChild(nb3);
    nb1.appendChild(nb2);
    buttonpos.insertBefore(nb1, buttonpos.firstChild);
});