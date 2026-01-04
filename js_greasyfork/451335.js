// ==UserScript==
// @name         Portal Carteira de investimentos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Melhorias para o site Carteira de investimentos
// @author       @josias-soares
// @match        https://admin.carteiradeinvestimentos.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=carteiradeinvestimentos.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451335/Portal%20Carteira%20de%20investimentos.user.js
// @updateURL https://update.greasyfork.org/scripts/451335/Portal%20Carteira%20de%20investimentos.meta.js
// ==/UserScript==

    function removeElementsByClass(className){
        const elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    function renameElementsByClass(className, newClassName){
        document.querySelectorAll(className).forEach(elem => {
            elem.classList.remove('blocked-div');
        });
    }


    setTimeout(function(){
        removeElementsByClass("pro-functionality ng-star-inserted")
    }, 5000);

    setTimeout(function(){
        renameElementsByClass(".blocked-div")
    }, 6000);

