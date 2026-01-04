// ==UserScript==
// @name        Google Short URL goo.gl Dark Night Mode Theme 
// @namespace   english
// @description Google Short URL goo.gl  Dark Night Mode Theme - currently undergoing build
// @include     http*://*goo.gl*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371957/Google%20Short%20URL%20googl%20Dark%20Night%20Mode%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371957/Google%20Short%20URL%20googl%20Dark%20Night%20Mode%20Theme.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                                body, html, html body {/*\n*/    background: #444 !important;/*\n*/    background-color: #444 !important;/*\n*/    background-image: none important;/*\n*/}.footer { /*\n*/    background-color: #222; /*\n*/}.gb_ce {/*\n*/    background-color: #444 !important ;/*\n*/ /*\n*/}.gb_he { /*\n*/    color: #fff !important ;/*\n*/}.gb_Ta svg, .gb_lc svg {/*\n*/    color: white !important ;/*\n*/ /*\n*/}.shorten.content .announcement {       color: #e6e6e6;    background-color: #544708; }/*\n*//*\n*/.modal .container {/*\n*/     /*\n*/    background-color: #4c4c4c;/*\n*/ /*\n*/}.modal.shorten-result .content .preview {/*\n*/   /*\n*/    background-color: #ffffff00;/*\n*/   /*\n*/}.modal .title {/*\n*/    /*\n*/    color: #f1f1f1;/*\n*/}.modal .title button {/*\n*/    color: #ececec;/*\n*/ /*\n*/} .mdl-data-table {/*\n*/   /*\n*/    background-color: #424242;/*\n*/}.shorten.content table thead, .shorten.content table tfoot {/*\n*/    background-color: #737373;/*\n*/    /*\n*/}.mdl-data-table th {/*\n*/   /*\n*/    color: rgba(255, 255, 255, 0.78);/*\n*/    /*\n*/}.mdl-data-table tbody tr:hover {/*\n*/    background-color: #5d5d5d;/*\n*/}body a {/*\n*/    color: #beeaff;/*\n*/} html , html body{/*\n*/   /*\n*/    color: #fff  !important ;/*\n*/} .analytics.header {/*\n*/       color: #adadad;/*\n*/    background-color: #212121;/*\n*/}.analytics.content .chart {/*\n*/ /*\n*/    filter: invert(80%)hue-rotate(180deg)contrast(130%)saturate(90%);/*\n*/}.analytics.announcement .innerbox {/*\n*/    /*\n*/    color: #c3c3c3 !important ;/*\n*/    background-color: #544e31 !important ;/*\n*/  /*\n*/} .shorten.content .download {/*\n*/   /*\n*/    color: #6ed0ff; /*\n*/}.mdl-button--icon {/*\n*/  /*\n*/    color: #eee !important ;/*\n*/}     ';
document.getElementsByTagName('head')[0].appendChild(style);



