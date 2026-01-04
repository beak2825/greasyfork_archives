// ==UserScript==
// @name         Scorable follower count [neocities.org]
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  See approximate "scorable follower count", which is the count that's used in site top
// @author       https://neocities.org/site/dimden
// @match        https://neocities.org/site/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neocities.org
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492925/Scorable%20follower%20count%20%5Bneocitiesorg%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/492925/Scorable%20follower%20count%20%5Bneocitiesorg%5D.meta.js
// ==/UserScript==

(async () => {
    let style = document.createElement('style');
    style.innerHTML = `.col.col-50.profile-info { width: 64% !important }`;
    document.head.append(style);

    let site = location.pathname.split('/').slice(-1)[0];
    async function getFollowings() {
        const followerPage = await fetch(`https://neocities.org/site/${site}/follows`).then(res => res.text());
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(followerPage, "text/html");
            return Array.from(doc.querySelectorAll('.username > a')).map(u => u.innerText.replace(/\n/g, '').trim()).filter(u => !u.includes('/'));
        } catch(e) {
            console.error('error getting follows', e);
            console.log(followerPage);
        }
        return [];
    }
    let followings = (await getFollowings()).length;
    let followers = parseInt(document.getElementsByClassName('stats')[0].children[1].children[0].innerText.replace(/,/g, ''));
    let stats = document.getElementsByClassName('stats')[0];
    let div = document.createElement('div');
    div.className = 'stat';
    div.innerHTML = `
    <strong>${followers - followings}</strong>
    <span>Score</span>
`;
    document.getElementsByClassName('stats')[0].children[1].after(div);

})();