// ==UserScript==
// @name         clickprofit
// @namespace    none
// @version      0.2
// @description  https://www.youtube.com/channel/UCm2XoBbuIVSgMagy3Q01tSw
// @author       Laravandro
// @match        *://*/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/446081/clickprofit.user.js
// @updateURL https://update.greasyfork.org/scripts/446081/clickprofit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (document.location.href.includes('clickprofit') && document.location.href.includes('users')) {
        console.clear()
        if (document.querySelectorAll('.surfing__item')[0]) {
            let id = document.querySelectorAll('.surfing__item')[0].id.replace ( /[^\d.]/g, '' )
            console.log(id)
            fetch(`${location.origin}/surfing/add_view/` + id)
                .then((response) => {
                console.log(response)
                location.reload()
            })
        }
    }

})();
