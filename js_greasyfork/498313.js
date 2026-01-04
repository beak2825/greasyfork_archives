// ==UserScript==
// @name         CoomerBtn
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  Adds a small button next to username handles on Onlyfans and Fansly that points to that users profile at Coomer.su
// @author       You
// @match        https://onlyfans.com/*
// @match        https://fansly.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coomer.su
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498313/CoomerBtn.user.js
// @updateURL https://update.greasyfork.org/scripts/498313/CoomerBtn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(location.host !== 'onlyfans.com' && location.host !== 'fansly.com') return;

    const ofUsernameSelector = '.g-user-username';
    const fanslyUsernameSelector = 'span.user-name';
    const selector = location.host === 'onlyfans.com' ? ofUsernameSelector : fanslyUsernameSelector
    const baseURL = location.host === 'onlyfans.com' ? 'https://coomer.su/onlyfans/user/' : 'https://coomer.su/fansly/user/';
    const fanslyUIDCache = [];

    const addButton = async el => {
        if(el.querySelector('.coomer-btn')) return;

        const img = document.createElement('img');
        img.setAttribute('src', 'https://coomer.su/favicon.ico');
        img.height = 20;
        img.width = 20;

        const link = document.createElement('a');
        link.setAttribute('class', 'coomer-btn');
        link.appendChild(img);
        el.appendChild(link);

        let username = el.textContent.trim().slice(1).toLowerCase();

        if(location.host === 'fansly.com'){
            try{
                username = await getFanslyUID(username);
            }catch(err) {
                console.error('CoomerBtn', err); // will still fall back to the username, although coomer.su will likely 404.
            }
        }

        link.setAttribute('href', baseURL + username);
    }

    const getFanslyUID = async username => {
        const cached = fanslyUIDCache.find(user => user.username === username);

        if(cached){
            return cached.uid;
        }

        const res = await fetch('https://apiv3.fansly.com/api/v1/account?usernames=' + username + '&ngsw-bypass=true');
        const json = await res.json();

        console.log(json);

        const uid = json.response[0].id
        fanslyUIDCache.push({username, uid})

        return uid;
    }

    const observer = new MutationObserver(muts => {
        muts.forEach(mut => {
            if(mut.target.matches(selector)){
                addButton(mut.target);
            }

            mut.addedNodes && mut.addedNodes.forEach(node => {
                if(node.matches && node.matches(selector))
                    addButton(node)
                else{
                    if(node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE) return;
                    const final = node.querySelectorAll(selector);
                    final.forEach(child => addButton(child));
                }
            });
        })
    });



    observer.observe(document, {childList: true, subtree: true});
})();