// ==UserScript==
// @name         marleyspoon no added gluten 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove all recipes unless there is `no added gluten` in recipe tags
// @license      none
// @author       Something begins
// @match        https://marleyspoon.com/menu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marleyspoon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474843/marleyspoon%20no%20added%20gluten.user.js
// @updateURL https://update.greasyfork.org/scripts/474843/marleyspoon%20no%20added%20gluten.meta.js
// ==/UserScript==
const containerSelector = ".menu-page__recipe";
const recipeAttributeSelector = ".recipe-attributes__label";
const neededString = "no added gluten";
const refreshRate_ms = 500;

function main(){
    const toRemove = [];
    for (const container of document.querySelectorAll(containerSelector)){
        const li_attrs = container.querySelectorAll(recipeAttributeSelector);
        const filteredLength = Array.from(li_attrs).filter(li => {return li.textContent.toLowerCase().includes(neededString)}).length;
        if (!filteredLength){
            toRemove.push(container);
        }
    }
    for (const ele of toRemove) ele.remove();
}
setInterval(main, refreshRate_ms);

