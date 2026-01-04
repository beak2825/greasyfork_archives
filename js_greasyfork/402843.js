// ==UserScript==
// @name        Tumblr Backup - Tumblr 2 Tumbex
// @namespace   Nameless
// @run-at      document-start
// @match       *://*.tumblr.com/*
// @grant       none
// @version     2.0
// @author      K.D
// @description Archived Tumblr Blogs
// @downloadURL https://update.greasyfork.org/scripts/402843/Tumblr%20Backup%20-%20Tumblr%202%20Tumbex.user.js
// @updateURL https://update.greasyfork.org/scripts/402843/Tumblr%20Backup%20-%20Tumblr%202%20Tumbex.meta.js
// ==/UserScript==

let a= location.href;
    a= decodeURIComponent(a);
    b= location.protocol;
    c= location.hostname;
    d= a.replace(b,'');
    d= d.replace('.com','');    
    e= 'https://tumbex.com/';

if (a.includes('safe-mode?url=')) {
    a= a.split('?url=')[1];
    a= a.split('/')[2];
    a= a.replace ('.com','');
    location= e+a;
}

else if (c != 'www.tumblr.com') location= e+d;






