// ==UserScript==
// @name         Extención de fundicion para Time Saver
// @namespace    https://greasyfork.org/users/904482
// @version      0.1.0
// @description  Funde todos los objetos del inventario seleccionado
// @author       lpachecob
// @grant        none
// @match        *.gladiatus.gameforge.com/game/index.php?mod=forge&submod=smeltery*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444263/Extenci%C3%B3n%20de%20fundicion%20para%20Time%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/444263/Extenci%C3%B3n%20de%20fundicion%20para%20Time%20Saver.meta.js
// ==/UserScript==

window.addEventListener("load", ()=>{
    let inventario = document.getElementsByClassName("smelter-actions")[0];
    let btnFundicion = document.getElementsByClassName("awesome-button")[20];
    let items = document.getElementsByClassName("ui-draggable")
    inventario.insertAdjacentHTML('beforeend', `
         <button
              class="awesome-button"
              type="button"
              id="FundirTodo">
              Fundir Todo
         </button>
    `)
    let btnFundirTodo = document.getElementById("FundirTodo");
    btnFundirTodo.addEventListener("click",()=>{
        btnFundicion.click();
    for (let index = 9; index < items.length; index++) {
        items[index].click();
    }
    });
})
