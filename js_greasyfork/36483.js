// ==UserScript==
// @name         4chan Anti-cancer
// @namespace    http://4chan.org/
// @version      0.1
// @description  Fixes the shady cancer Hiroshimoot added to 4chan on 18/12/2017.
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @include      http://sys.4chan.org/*
// @include      https://sys.4chan.org/*
// @include      http://www.4chan.org/*
// @include      https://www.4chan.org/*
// @include      http://i.4cdn.org/*
// @include      https://i.4cdn.org/*
// @include      http://is.4chan.org/*
// @include      https://is.4chan.org/*
// @include      http://is2.4chan.org/*
// @include      https://is2.4chan.org/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/36483/4chan%20Anti-cancer.user.js
// @updateURL https://update.greasyfork.org/scripts/36483/4chan%20Anti-cancer.meta.js
// ==/UserScript==
var match = '(function(){var f="to",n="U",u="pper",r="C",t="ase",o="substr"';
window.addEventListener('beforescriptexecute', function(e) {
    if(e.target.textContent.startsWith(match)){
        e.stopPropagation();
        e.preventDefault();
        console.log("Cancer averted.");
    }
}, true);