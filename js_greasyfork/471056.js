// ==UserScript==
// @name         LigaImprover
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Makes LigaMagic slightly more usable
// @author       Proto
// @match        https://www.ligamagic.com.br/*
// @match        https://www.ligamagic.com.br
// @match        https://ligamagic.com.br
// @match        ligamagic.com.br
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ligamagic.com.br
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471056/LigaImprover.user.js
// @updateURL https://update.greasyfork.org/scripts/471056/LigaImprover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('LigaImprover activated');


    function findInParents(element, selector, depth=10){
        var parentElement = element;
        for (var i = depth; i > 0; i--) {
            if(parentElement.matches(selector)){
                return parentElement;
            }
            parentElement = parentElement.parentElement;
        }
        return null;
    }

    async function getStoreDetails(url){
        const response = await fetch(`https://www.ligamagic.com.br/${url}`, {
            "credentials": "include",
            "headers": {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            // "body": `opc=getStoreData&id=${storeId}&origin=desktop&tcg=1`,
            "method": "GET",
            "mode": "cors"
        });

        const responseText = await response.text();

        if(response.ok) return responseText;
        return null;
    }

    function getStoreUrl(detailsHTML){
        var resp = detailsHTML.match(/<a class="color-1" href="(https?:\/\/.+\/\?view\=ecom\/item\&card\=\d+&tcg=\d+)\&utm_source\=liga\&utm_medium\=site\&utm_campaign\=comparadorMagic">clique aqui<\/a>/i);
        if(resp === null){
            resp = detailsHTML.match(/\.\.\/(\?view=ecom\/item&card=\d+&tcg=\d+&id=\d+)&utm_source=liga&utm_medium=site&utm_campaign=comparadorMagic/i);
            if(resp === null) return null;
            try{
                resp = resp[1].replace('..', 'https://www.ligamagic.com.br');
            }catch(e){
                console.warning(resp);
                return null;
            }
            return resp;
        }
        return resp[1];
    }

    async function replaceGotoUrl(gotoElement){
        const href = gotoElement.getAttribute('href');
        if(href.indexOf('view=leilao') > -1) return;
        const detailsHTML = await getStoreDetails(href);
        const newUrl = getStoreUrl(detailsHTML);
        if(newUrl === null){
            console.log(gotoElement);
            return;
        }
        gotoElement.setAttribute('href', newUrl);
        gotoElement.parentElement.setAttribute('onclick', '() => console.log("no GA for you!");');
    }

    window.setInterval(()=>{

        var cookie = '';
        var cookieName = '';
        for(const coo of document.cookie.split(';')){
            cookie = coo.trim();
            cookieName = cookie.split('=')[0].trim();
            if(cookieName.match('/^APPprA.*/g') ||
               cookieName.match('/^APPprB.*/g') ||
               cookieName.match('/^APPprC.*/g') ||
               cookieName.match('/^APPprD.*/g') ||
               cookieName.match('/^_dc_gtm_.*/g') ||
               cookieName == '_ga' ||
               cookieName == '_gads' ||
               cookieName == '_gid' ||
               cookieName == '_gat'
               ){
                document.cookie = cookieName + '= Max-Age=-99999999;';
            }

        }
        document.cookie = 'stopHomeVideo = 1;max-age=31536000;';
        document.cookie = 'cookiehub = 1;max-age=31536000;';
        document.cookie = 'cookiehub_ca = 1;max-age=31536000;';
        document.cardsHomeApp = 'cardsHomeApp = 1;max-age=31536000;';
    }, 1000);


    if(window.location.href.indexOf('view=colecao')) return;
    setTimeout(async () => {
        const removableIds = ['#toPopup', '#backgroundPopup', '#lgpd-cookie'];
        for(const id of removableIds){
            try{document.querySelector(id).remove();}catch(e){}
        }

        const removableClasses = ['.hm-news-ad', '.exibeDesktop645', '.exibeMobile645'];
        for(const cla of removableClasses){
            try{
                for(const element of document.querySelectorAll(cla)){
                    element.remove();
                }
            }catch(e){}
        }

        for(const element of document.querySelectorAll('.goto')){
            replaceGotoUrl(element);
        }

    }, 500);


})();