// ==UserScript==
// @name         mtslink space2mic
// @namespace    https://ryzhpolsos.ru/
// @version      0.1
// @description  Добавляет на MTS Link возможность включать звук, пока нажата клавиша "Пробел"
// @author       ryzhpolsos
// @match        https://my.mts-link.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mts-link.ru
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538066/mtslink%20space2mic.user.js
// @updateURL https://update.greasyfork.org/scripts/538066/mtslink%20space2mic.meta.js
// ==/UserScript==

(async function(){
    function waitFor(selector){
        return new Promise(res=>{
            let el = document.querySelector(selector);

            if(el){
                res(el);
            }else{
                setTimeout(()=>waitFor(selector).then(e=>res(e)), 100);
            }
        });
    }

    const button = await waitFor('button[data-testid="VCSControlButton.Microfone.Button"]');

    window.addEventListener('keydown', e=>{
        if(e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.contentEditable == 'true') return;
        if(e.code == 'Space' && button.querySelector('.icon_mic-off')){
            button.click();
        }
    });

    window.addEventListener('keyup', e=>{
        if(e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.contentEditable == 'true') return;
        if(e.code == 'Space' && button.querySelector('.icon_mic-on')){
            button.click();
        }
    });
})();