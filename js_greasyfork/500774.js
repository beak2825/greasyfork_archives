// ==UserScript==
// @name         pter_solitary_seed
// @namespace    http://tampermonkey.net/
// @version      2024-07-16
// @description  Pter 高亮显示做种数小于6的官种和游戏种!
// @author       Qvixote
// @match        https://pterclub.com/officialgroup.php*
// @match        https://pterclub.com/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500774/pter_solitary_seed.user.js
// @updateURL https://update.greasyfork.org/scripts/500774/pter_solitary_seed.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll(".torrents>tbody>tr").forEach((i,index)=>{
    if (index >=1) {
        var countTag = i.querySelectorAll("td")[12].querySelector("a") || i.querySelectorAll("td")[12].querySelector("span")
        var count = countTag.innerHTML
        count = count - 0
        if (count <= 5 && count !== 0) {
            i.style.background="red"
            console.log("catch one!!!!")
        }
    }
})
})();