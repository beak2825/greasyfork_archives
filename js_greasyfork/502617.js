// ==UserScript==
// @name         Remove Favorite Hotkey
// @version      1
// @description  Allows you to press g (or another key) to remove favorites from the post page.
// @author       Yoboies
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @match        https://rule34.xxx/index.php?page=favorites&s=view&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @namespace https://greasyfork.org/users/1345312
// @downloadURL https://update.greasyfork.org/scripts/502617/Remove%20Favorite%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/502617/Remove%20Favorite%20Hotkey.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    if(location.href.indexOf('https://rule34.xxx/index.php?page=post') == 0){
        var hotkey = "KeyG";  //REPLACE WITH WHATEVER KEY WORKS FOR YOU

        document.addEventListener('keydown', keyPress);

        function keyPress(e) {
            if(e.code==hotkey){
                var oldURL = location.href;
                var newURL = oldURL.replace('page=post&s=view','page=favorites&s=delete');
                GM.setValue('id',Date.now() + '\n' + oldURL);
                document.location.href = newURL;
            }
        }

    } else if (location.href.indexOf('https://rule34.xxx/index.php?page=favorites') == 0){
        var ID = await GM.getValue('id', '');
        if(ID && Date.now() - ID.split('\n')[0] < 1*1000){
            ID = ID.split('\n')[1];
            document.location.href = ID;
        }
    }
})();