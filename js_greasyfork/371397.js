// ==UserScript==
// @name        Theme Forest WP Theme Website Dark Theme Night Mode
// @namespace   english
// @description Theme Forest WP Theme Website Dark Theme Night Mode - currently undergoing build
// @include     http*://*themeforest.net*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371397/Theme%20Forest%20WP%20Theme%20Website%20Dark%20Theme%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/371397/Theme%20Forest%20WP%20Theme%20Website%20Dark%20Theme%20Night%20Mode.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                               .canvas__body {/*\n*/  /*\n*/    background: #656565;/*\n*/    color: #ccc;/*\n*/}.context-header {/*\n*/    background: #414141;/*\n*/    border-bottom: 1px solid #4d4d4d;/*\n*/ /*\n*/    color: #e4e4e4;/*\n*/}.breadcrumbs a:hover {/*\n*/   /*\n*/    color: #f0f0f0;/*\n*/}.breadcrumbs a {/*\n*/     color: #d5d5d5;/*\n*/   /*\n*/}.header-categories {/*\n*//*\n*/    background-color: #393939;/*\n*/    border-bottom: 1px solid #606060;/*\n*/    height: 48px;/*\n*/    color: #ccc;/*\n*//*\n*/}.header-categories__main-link, .header-categories__main-link--empty {/*\n*//*\n*/    /*\n*/    color: #d1d1d1;/*\n*/    /*\n*//*\n*/} /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}                               ';
document.getElementsByTagName('head')[0].appendChild(style);



