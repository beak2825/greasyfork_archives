// ==UserScript==
// @name         Forum score spam
// @namespace    https://www.knightsradiant.pw/
// @version      0.1
// @description  Forum spam for a dumb audit system.
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @author       Talus
// @include      /(https:\/\/politicsandwar\.com\/nation\/id=.+&spam=true)|(https:\/\/www\.knightsradiant\.pw\/topic\/9767-audit-forum-score-spam\/page\/1\/)/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=knightsradiant.pw
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/440760/Forum%20score%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/440760/Forum%20score%20spam.meta.js
// ==/UserScript==

(async function() {
    let youTubeDict = {
        'nyanCat': 'QH2-TGUlwu4',
        'manaMana': 'QTXyXuqfBLA',
        'rickAstley': 'dQw4w9WgXcQ',
        'saxRoll': 'Tg4u7ko333U',
        'sandstorm': 'y6120QOlsfU',
        'myHeartFlute': 'X2WH8mHJnhM',
        'peanutButter': 'Z3ZAGBL6UBA',
        'pianoCat': 'J---aiyznGQ',
        'dramatic': 'y8Kyi0WNg40',
        'numa': 'KmtzQCSh6xk',
        'takeOnMe': 'djV11Xbc914',
        'kittyCatDance': 'SaA_cs4WZHM',
        'learnToMeow': 'sJk4NF1u4CI',
        'ppap': 'Ct6BUPvE2sM',
        'gangnam': '9bZkp7q19f0',
        'babyShark': 'XqZsoesa55w',
        'despacito': 'kJQP7kiw5Fk',
        'johnyJohny': '7GjOOyBoELw',
        'bathSong': 'WRVsOCh907o',
        'systemIsDown': 'JwZwkk7q25I',
        'rejected': 'W7JyjZI3LUM',
        'dementedCartoon': 'oBFKfgLf0LI',
        'yatta': 'rW6M8D41ZWU',
        'allYourBase': 'jQE66WA2s-A'
    };
    const nationId = 98616;

    var $;
    if (typeof $ == 'undefined') {
        $ = window.jQuery;
    }
    let spamUrl = 'https://www.knightsradiant.pw/topic/9767-audit-forum-score-spam/page/1/';
    function getRandomYouTubeHtml() {
        const keys = Object.keys(youTubeDict);
        const id = keys[Math.floor(Math.random() * keys.length)]
        return getYouTubeHtml(youTubeDict[id]);
    }
    function getYouTubeHtml(id) {
        return '<div class="ipsEmbeddedVideo" contenteditable="false"><div><iframe width="200" height="150" src="https://www.youtube.com/embed/'+id+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>'
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function delayedPost() {
        await sleep(1000);
        $('#cke_1_contents > div > p').replaceWith(getRandomYouTubeHtml());
        $('#check_auto_follow_toggle_wrapper').click();
        await sleep(500);
        $(":button:contains('Submit Reply')").click();
    }
    async function openSpamPage() {
        const height = 100;
        const width = 100;
        const top = window.innerHeight - height;
        const left = window.innerWidth - width;
        var customWindow = window.open(spamUrl, 'spam', 'popup=1, width='+width+', height='+height+', left='+left+', top='+top);
        do {
            await sleep(100);
        } while (customWindow === undefined);
        customWindow.blur();
        window.focus();
        await sleep(5000);
        customWindow.close();
    }
    switch (window.location.pathname) {
        case '/nation/id='+nationId+'&spam=true':
            openSpamPage();
            break;
        case '/topic/9767-audit-forum-score-spam/page/1/':
            delayedPost();
            break;
        default:
            close();
    }
})();
