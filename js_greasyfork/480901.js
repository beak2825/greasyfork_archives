// ==UserScript==
// @name         Удаление разрывов абзаца для новелл на boosty
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Удаляет разрывы абзацев. Может задеть что-то лишнее на сайте, лучше исправьте матч для конкретного автора.
// @author       resursator
// @license      MIT
// @match        https://boosty.to/*/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boosty.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480901/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B0%D0%B7%D1%80%D1%8B%D0%B2%D0%BE%D0%B2%20%D0%B0%D0%B1%D0%B7%D0%B0%D1%86%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BD%D0%BE%D0%B2%D0%B5%D0%BB%D0%BB%20%D0%BD%D0%B0%20boosty.user.js
// @updateURL https://update.greasyfork.org/scripts/480901/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B0%D0%B7%D1%80%D1%8B%D0%B2%D0%BE%D0%B2%20%D0%B0%D0%B1%D0%B7%D0%B0%D1%86%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BD%D0%BE%D0%B2%D0%B5%D0%BB%D0%BB%20%D0%BD%D0%B0%20boosty.meta.js
// ==/UserScript==

(function(){
    var eles = document.querySelectorAll("br");

    for (let i=0; i<eles.length; i++){
        try{ // Avoid no-parent elements
            let new_html = eles[i].outerHTML.replaceAll("<br></br>", " ");
                new_html = new_html.replaceAll("<br>", " ");
            eles[i].outerHTML = new_html;
        }
        catch (e){}
    }
})();