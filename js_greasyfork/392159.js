// ==UserScript==
// @name         Goatlings: Battle Again Button
// @version      0.1.0
// @description  Adds a "Battle Again" button into the Battle Center where appropriate
// @namespace    https://greasyfork.org/en/users/322117
// @author       Felix G. "Automalix"
// @include      http://www.goatlings.com/battle*
// @include      http://goatlings.com/battle*
// @include      http://www.goatlings.com/explore*
// @include      http://goatlings.com/explore*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/392159/Goatlings%3A%20Battle%20Again%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/392159/Goatlings%3A%20Battle%20Again%20Button.meta.js
// ==/UserScript==
(function(){
    "use strict";
    const getAuthToken = function() {
        let linkArr = document.links, urls = [];
        for (let anchors of linkArr) urls.push(anchors.href)
        let logout = urls.find(value => /\/login\/logout\/.{32}\//.test(value)),
            pos = logout.indexOf("logout");
        const TOKEN = logout.slice(pos + 7, pos + 39);
        return TOKEN;
    }
    /* The auth token is required for many features on the site.
    This is not saved anywhere except on the current page you are viewing. */
    const token = getAuthToken();
    let style = document.createElement("style")
    style.type = "text/css";
    style.innerHTML = `#battleAgain{
                           margin:0 auto;
                           text-align:center;
                       }
                       #battleAgainButton {
                           margin:20px auto 0 auto;
                       }
                       #battleEndLinks {
                           margin:20px auto 0 auto;
                       }`
    if(document.getElementsByTagName("head")[0]) document.getElementsByTagName("head")[0].appendChild(style)
    if (/\/battle\/over/.test(document.URL)){
        // Battle Again button implemented as well as new battle footer links for consistency.
        let existingButton = document.querySelector(`input[value="Battle Again"]`),
            battleParameters = sessionStorage.getItem("battleParameters") ? JSON.parse(sessionStorage.getItem("battleParameters")) : "",
            battleAgainButton = "";
        if (battleParameters){
            if(!existingButton){
                battleAgainButton = `
                <form action="${battleParameters.enemyURL}" method="post" accept-charset="utf-8" style="margin:0">
                    <input type="hidden" name="csrf_test_name" value="${token}">
                    <input type="hidden" name="petid" value="${battleParameters.petID}">
                    <input type="submit" name="s" value="Battle Again" id="battleAgainButton">
                </form>`
            } else battleAgainButton = "";
        } else battleAgainButton = `<div id="battleAgainButton"><a href="http://www.goatlings.com/explore/view">Continue Adventure</a></div>`;

        let battleAgainFooter = `<div id="battleAgain">
            ${battleAgainButton}
            <div id="battleEndLinks">
                <a href="http://www.goatlings.com/explore/view">Current Adventure</a> |
                <a href="http://www.goatlings.com/battle/train_challengers">Training Center</a> |
                <a href="http://www.goatlings.com/battle/challengers">Battle Center</a> |
                <a href="http://www.goatlings.com/fountain/">The Fountain</a> |
                <a href="http://www.goatlings.com/inventory/">Your Inventory</a>
            </div>
        </div>`;
        document.querySelector("#content > center > p").remove();
        document.querySelector("#content > center").insertAdjacentHTML('afterend', battleAgainFooter);
    }
    if(document.URL.includes('/explore/')) sessionStorage.removeItem("battleParameters") //delete storage of baddie ID because you can't repeat explore battles
})();