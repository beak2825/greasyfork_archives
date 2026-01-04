// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sss
// @author       You
// @match        https://sharesome.com/*/following/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sharesome.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452780/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/452780/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    async function main(){
        var all_btns = document.querySelectorAll("#followers-list button[title='Follow this user']")
        for (var x of Array.from(all_btns)){
            console.log(x)
            x.click()
            await sleep(250)
        }
        window.scrollTo(0, document.body.scrollHeight);
        await sleep(1000)
        main()
    }
    main()
    // Your code here...
})();