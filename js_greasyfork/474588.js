// ==UserScript==
// @name         huangtui killer
// @namespace    http://twitter.com/
// @version      0.1
// @description  kill huangtui
// @author       Authority
// @match        https://twitter.com/*/status/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474588/huangtui%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/474588/huangtui%20killer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clean(){
        try{
            var posts = document.querySelectorAll('div[data-testid="cellInnerDiv"]');
            posts.forEach(function(post) {
                var users = post.querySelectorAll('div[data-testid="User-Name"]');
                if(users.length === 2){
                    var user1 = users[0].querySelector('div:nth-child(1)').textContent;
                    var user2 = users[1].querySelector('div:nth-child(1)').textContent;
                    if(user1 == user2){
                        post.style.display = 'none';
                    }
                }
            });
         } catch(e){
         }
    }
    setInterval(clean, 2000);
})();