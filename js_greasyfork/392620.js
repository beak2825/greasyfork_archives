// ==UserScript==
// @name         stackoverflow show user reputation in comments
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description   stackoverflow stackexchange show user reputation in comments
// @author        批小将
// @match         https://*.stackexchange.com/*
// @match         https://stackoverflow.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/392620/stackoverflow%20show%20user%20reputation%20in%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/392620/stackoverflow%20show%20user%20reputation%20in%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timeout = 1000; //you can customize this timeout based on your ajax network speed
    let repTemplate = `<span class="reputation-score" title="reputation score " dir="ltr">&nbsp;&nbsp;&nbsp;%reputation%</span>`;

    function getRep(userReputations){
        for(let i = 0; i < userReputations.length; i++){
            let rep = userReputations[i].title.split(' ')[0];
            let repHtml = repTemplate.replace('%reputation%', rep);
            userReputations[i].parentNode.insertAdjacentHTML('beforeend', repHtml);
        }
    }

    let showMoreCommentsElements = document.querySelectorAll('a.js-show-link.comments-link');
    for(let i = 0; i < showMoreCommentsElements.length; i++){
        showMoreCommentsElements[i].addEventListener('click', function(event){
            setTimeout(function(){
                let users = event.target.parentNode.parentNode.querySelectorAll('span.comment-copy + div > a');
                getRep(users);
            }, timeout);//timeout variable is used here.
        });
    }

    function main(){
        let allUsers = document.querySelectorAll('a.comment-user');
        getRep(allUsers);
    }

    main();


})();