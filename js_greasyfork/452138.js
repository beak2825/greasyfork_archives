// ==UserScript==
// @name         K更改版面
// @namespace    komica_htm
// @version      1.0.1
// @description  改的更像論壇界面，隱藏掉回覆區
// @author       Covenant
// @match        https://*.komica1.org/*/*
// @exclude      https://*.komica1.org/*/pixmicat.php*
// @match        https://*.komica2.net/*/*
// @exclude      https://*.komica2.net/*/pixmicat.php*
// @match        https://*.komica.org/*/*
// @exclude      https://*.komica.org/*/pixmicat.php*
// @icon         https://www.komica1.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452138/K%E6%9B%B4%E6%94%B9%E7%89%88%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/452138/K%E6%9B%B4%E6%94%B9%E7%89%88%E9%9D%A2.meta.js
// ==/UserScript==
function main_01(){
    let thread=document.querySelectorAll('#threads>div.thread');//記錄顯示的回覆數量
    for(let i = 0; i < thread.length; i++){
        let reply_count=0;
        for(let j = 0; j < thread[i].children.length; j++){
            if(thread[i].children[j].classList.contains("reply")){
                reply_count++;
            }
        }
        let div_count=document.createElement('div');
        div_count.classList.add("post");
        div_count.innerText=reply_count;
        thread[i].insertBefore(div_count,thread[i].querySelectorAll('hr')[0]);
    }
    let reply=document.querySelectorAll('div>div.reply');//移除回覆
    for(let i = 0; i < reply.length; i++){
        reply[i].style.display="none";
    }
    let rlink=document.querySelectorAll('span.rlink>a');
    for(let i = 0; i < rlink.length; i++){
        rlink[i].textContent=rlink[i].textContent.replace(/回應/i, '查看');
    }
}
(function() {
    'use strict';
    main_01();
})();