// ==UserScript==
// @name         Recruiting & Talents Main page
// @namespace    http://tampermonkey.net/
// @version      2024-11-10
// @description  try to take over the world!
// @author       Dan is gay
// @match        https://www.lordswm.com/home.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/516455/Recruiting%20%20Talents%20Main%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/516455/Recruiting%20%20Talents%20Main%20page.meta.js
// ==/UserScript==

(function() {
    GM_addStyle (`
.iframeStyle { height:600px; width:749px; border:none; margin: 0; padding:0; }
.iframeStyle {
    }
.iframeContainerStyle {display: block; width:1500px; position:webkit-center}
`)
    function removeHeaders(){
        let headerSelectors = ["#hwm_header","#new_header","#main_top_table"]
        let iframes = Array.from(document.querySelectorAll('iframe'))
        for (let iframeIndex in iframes){
            for (let index in headerSelectors){
                let header = iframes[iframeIndex].contentDocument.querySelector(headerSelectors[index])
                if (header !== null){
                    header.remove()
                }
            }
        }

    }
    let links = ["https://www.lordswm.com/army.php", "https://www.lordswm.com/skillwheel.php", "https://www.lordswm.com/inventory.php", "https://www.lordswm.com/castle.php?change_faction_dialog=1"]

    let divEle = document.createElement('center')
    divEle.className = 'iframeContainerStyle'

    for (let link in links){
        let iframeEle = document.createElement('iframe')
        iframeEle.className = "iframeStyle"
        iframeEle.src = links[link]
        divEle.append(iframeEle)

    }
    document.body.append(divEle)

    let runs = 0
    let timer = setInterval(function(){
        // Have some code to do something
        runs++
        removeHeaders()
        if(runs>10){
            clearInterval(timer)
        }
    },1000);

})();