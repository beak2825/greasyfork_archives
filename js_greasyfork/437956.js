// ==UserScript==
// @name        Add 'My Posts' Button
// @namespace   http://skyscrapercity.com/
// @version     0.1
// @description Adds 'my posts in this thread' button to the header.
// @author      mck
// @match       https://www.skyscrapercity.com/threads/*
// @grant       none
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/437956/Add%20%27My%20Posts%27%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/437956/Add%20%27My%20Posts%27%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // find user
    let user = document.querySelector('.p-header .p-navgroup .avatar[data-user-id]');
    
    if(user === null || user === undefined) {
        return;
    }
    
    // find thread header
    let header = document.querySelector('.california-header-nav .california-additional-header .button-group');
    
    // make button
    let path = window.location.pathname.split('/').filter(Boolean).slice(0,2).join('/');
    let query = window.location.search.split;
    let uID = user.dataset['userId'];
    
    query['u'] = uID;
    query = new URLSearchParams(query);
    
    let button = document.createElement('a');
    button.href = '/' + path + '?' + query.toString();
    button.classList.add('button', 'button--alt');
    button.innerHTML = 'My posts';
    
    header.prepend(button);
})();