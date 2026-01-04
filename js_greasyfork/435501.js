// ==UserScript==
// @name         pixiv fav hide
// @namespace    https://hisaruki.ml/
// @version      3.1
// @description  pixivの一覧ページで既にお気に入りに入っている作品のサムネを表示しない
// @author       hisaruki
// @match        https://www.pixiv.net/*
// @icon         https://www.pixiv.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435501/pixiv%20fav%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/435501/pixiv%20fav%20hide.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let go = 1;
    setInterval(function(){
        document.querySelectorAll('.bXjFLc').forEach(el => {
            //el.closest("[type=illust]").closest("li").style.opacity = 0.2;
            let li = el.closest("[type=illust]").closest("li");
            if(li){
                if(go === 1){
                    li.style.display = "none";
                }else{
                    li.style.display = "block";
                }
            }
        });
    }, 500);
    document.addEventListener("keyup", function(e) {
        if(e.code == "KeyV"){
            go *= -1;
            console.log(go);
        }
    });
    // Your code here...
})();