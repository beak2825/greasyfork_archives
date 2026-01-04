// ==UserScript==
// @name         MoneyZ Bypass
// @name:en      MoneyZ Bypass
// @namespace    https://ryzhpolsos.ru
// @version      0.1
// @description  Обход сократителя ссылок MoneyZ
// @description:en  MoneyZ link shortener bypass
// @author       ryzhpolsos
// @match        https://moneyz.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moneyz.fun
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538069/MoneyZ%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/538069/MoneyZ%20Bypass.meta.js
// ==/UserScript==

(async function(){
    let w = window.unsafeWindow?window.unsafeWindow:window;
    if(w != w.top) return;

    if(confirm('Open full link?')){
        w.$.ajax({
            type: 'post',
            url: w.domen+'/action.php',
            data: {
                lsdofu: w.$('#page_link_key').val()
            },
            success: (r)=>{
                location.replace(JSON.parse(r).link_full_val);
            }
        });
        w.notify_up = ()=>{};
    }
})();