// ==UserScript==
// @name        Slightly darken all website BG-color - Body/HTML #ccc
// @namespace   english
// @description Slightly darken all website BG-color - Body/HTML #ccc  build
// @include      http*://*
// @exclude      http*://*google.*/search?*
// @exclude      http*://*slack.com*
// @exclude      http*://*greasyfork.org*
// @exclude      http*://*mail.google.com*
// @exclude      http*://*panel.dreamhost.com*
// @exclude      http*://*reddit.com*
// @exclude      http*://*wikipedia.org*
// @exclude      http*://*stealth-servers.com.au*
// @exclude      http*://*keep.google.*
// @exclude      http*://*hangouts.google.*
// @exclude      *chrome/newtab?*
// @exclude      http*://*calendar.google.*/calendar*
// @exclude      http*://*contacts.google.*
// @exclude      http*://*jsfiddle.net*
// @exclude      *jsfiddle.net*
// @exclude      *fiddle.jshell.net* 
// @exclude      */wp-admin/* 
// @exclude      *voxcanvas* 


// @exclude      http*://*jtbtravel.com.au*

// @version     1.28
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371409/Slightly%20darken%20all%20website%20BG-color%20-%20BodyHTML%20ccc.user.js
// @updateURL https://update.greasyfork.org/scripts/371409/Slightly%20darken%20all%20website%20BG-color%20-%20BodyHTML%20ccc.meta.js
// ==/UserScript==


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '   body,html,html body{background:#ccc !important; background-color:#ccc !important;background-image:none important ; } html body.init{background:#2b2b2b  !important ;background-color:#2b2b2b  !important ;} /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}  ';
document.getElementsByTagName('head')[0].appendChild(style);

