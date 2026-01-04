// ==UserScript==
// @name         Google Block Website Results
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Adds the option to hide search results from the google search. A new block icon is visible next to the search result. When clicked you are promted to confirm the blocking of the domain. The amount of search results will not be adjusted, so if you block all websites on page 1, then page 1 will be empty. You can remove websites right now only by editing the script storage,
// @author       LostFelix
// @license      MIT
// @match        https://www.google.com/search*
// @match        https://www.google.de/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521675/Google%20Block%20Website%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/521675/Google%20Block%20Website%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let domainsToBlock = [];
    init();
    function init(){
        domainsToBlock = GM_getValue('domainsToBlock',[]);
        nuke();
        setInterval(nuke,1000);
    }
    function nuke(force = false){
        let search = document.querySelector('#search');
        if(!search){ return; }

        if(force){
            search.querySelectorAll('.MjjYud .A6K0A .Ww4FFb a[jsname="UWckNb"][data-nuked]').forEach((el) => {
                delete el.dataset.nuked;
            });
        }
        search.querySelectorAll('.MjjYud .A6K0A .Ww4FFb a[jsname="UWckNb"]:not([data-nuked])').forEach((el) => {
            if(el.classList.length > 0){
                return;
            }
            domainsToBlock.forEach( (domain) => {
                if(el.href.includes(domain)){
                    let parent = getListElParentTop(el);
                    parent.style.opacity = 0.5;
                    parent.style.transform = "scale(0.75)";
                    parent.style.transformOrigin = "top left";
                    parent.style.height = parent.getBoundingClientRect().height +"px";
                    parent.style.display = "none";
                }
            });
            addBlockButton(el);
            el.dataset.nuked = "1";
        });
    }
    function addBlockButton(link){
        const el = getListElParentTop(link).querySelector('.D6lY4c');
        if(el.querySelector('.nuke-button')){
            return;
        };
        el.style.position = "relative";
        let btn = document.createElement('button');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" style="fill: red; height: 14px; width: 14px; margin: auto;" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>';
        btn.classList.add('nuke-button');
        btn.style.background = "transparent";
        btn.style.border = 0;
        btn.style.cursor = "pointer";
        btn.style.height = "100%";
        btn.style.padding = 0;
        btn.style.margin = "0 3px";
        btn.style.display = "inline-block";
        btn.addEventListener('click',(e) => {
            e.stopPropagation(); e.preventDefault();
            let href = link.href;
            let domain = href.replace(/^http.*\/\//,'').replace(/\/.*/,'');
            if(!domainsToBlock.includes(domain)){
                if(window.confirm("Do you want to block: "+domain)){
                    domainsToBlock.push(domain);
                    GM_setValue('domainsToBlock',domainsToBlock);
                    nuke(true)
                }
            }
        });
        el.appendChild(btn);
    }
    function getListElParentTop(el){
        let parent = el.parentElement;
        let target = null
        while(parent){
            if(parent.classList.contains('MjjYud')){
                if(parent.parentElement.classList.contains('hlcw0c')){
                    target = parent.parentElement;
                }else{
                    target = parent;
                }
                parent = null;
            }else{
                parent = parent.parentElement;
            }
        }
        return target;
    }

})();