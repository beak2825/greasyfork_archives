// ==UserScript==
// @name         Fastzone imageUrl fixer
// @namespace    https://www.facebook.com/KoiosYu/
// @version      0.1.1
// @description  Fix the fastzone image url bug. 
// @author       Yu Jia
// @match        https://fastzone.org/forum.php?mod=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22027/Fastzone%20imageUrl%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/22027/Fastzone%20imageUrl%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    url_fix();
})();

function url_fix() {
    var datas = document.getElementsByTagName("img");
    for(var key in datas) {
        var str = datas[key];
        if(str.src.match(/get_image/gi))
        {
            document.getElementsByTagName("img")[key].src = str.src.replace("https://fastzone.org/get_image.php?url=","");
        }
    }}