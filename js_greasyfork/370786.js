// ==UserScript==
// @name        X Marks the Scott - mobile theme
// @namespace   english
// @description XMarks the Scott - mobile theme collapse 
// @include     http*://*xmarksthescot.com*
// @version     1.8
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370786/X%20Marks%20the%20Scott%20-%20mobile%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/370786/X%20Marks%20the%20Scott%20-%20mobile%20theme.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 var style = document.createElement('style')    ;
style.type = 'text/css'    ;
style.innerHTML = '           /*\n*//*\n*/@media  (max-width: 900px) {/*\n*//*\n*//*\n*/body {font-size: 18px    !important  ;}/*\n*/.forumbit_post .foruminfo, .threadinfo{width:100%    !important  ;}/*\n*/.forumbit_post .foruminfo .forumdata , .threadinfo, .threadtitle, .threadmeta,.postrow{ /*\n*/font-size: 18px    !important  ;/*\n*/}/*\n*/ /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}         '   ;


//<meta name="viewport" content="width=device-width, initial-scale=1">


var meta = document.createElement('meta');
meta.httpEquiv = "X-UA-Compatible";
//meta.content = 'name="viewport" content="width=device-width, initial-scale=1"';
meta.name = 'viewport';
meta.content= 'width=device-width, initial-scale=1'; 


document.getElementsByTagName('head')[0].appendChild(style);
document.getElementsByTagName('head')[0].appendChild(meta);

