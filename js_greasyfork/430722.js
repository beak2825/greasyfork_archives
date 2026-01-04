// ==UserScript==
// @name        Neptunes Pride Dark Mode 
// @namespace   english
// @description Neptunes Pride Dark Mode - purple to blue black - Iron Helmet
// @include     http*://*np.ironhelmet.com*
// @version     1.3
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430722/Neptunes%20Pride%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/430722/Neptunes%20Pride%20Dark%20Mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '          /*\n*/.col_accent {/*\n*/    background-color: #2b2b2b;/*\n*/}/*\n*//*\n*/.col_base {/*\n*/    background-color: #191919;/*\n*/}/*\n*//*\n*/.side_menu_item_up {/*\n*/    background: #151515;/*\n*/}/*\n*//*\n*/.side_menu_item {/*\n*/    border-width: 0;/*\n*/    border-style: solid;/*\n*/    border-top-width: 1px;/*\n*/    border-top-color: #5d5d5d;/*\n*/}/*\n*//*\n*/.side_menu_item_hover       { background: #37383a; }/*\n*//*\n*/.button_up {/*\n*/    background: #000000;/*\n*/}/*\n*/.button_hover           { background: #004dad; }/*\n*//*\n*/.section_title {/*\n*/    color: #1aa5f7;/*\n*/}/*\n*/.player_cell {/*\n*/    border-bottom-color: #191919;/*\n*/}/*\n*//*\n*/a {/*\n*/    color: #00c4ff;/*\n*/}/*\n*//*\n*/.side_menu_item:focus {/*\n*/    background: #5980bb;/*\n*/    background: linear-gradient(to bottom, #1a2744 0%, #2c4273 45%, #2c4273 55%, #1a2944 100%);/*\n*/}/*\n*//*\n*/.drop_down {/*\n*/    background: #004dad;/*\n*/}/*\n*//*\n*/.tab_button {/*\n*/    background: #2c5c73;/*\n*/}/*\n*//*\n*/.tab_button_active {/*\n*/    background: #005080;/*\n*/}/*\n*//*\n*/.col_accent_light {/*\n*/    background-color: #005080;/*\n*/}/*\n*//*\n*/.star_directory tr:nth-child(even) {/*\n*/    background-color: #0f3458;/*\n*/}/*\n*//*\n*/.col_grey {/*\n*/    background-color: #001631;/*\n*/}/*\n*//*\n*/.help h1 { /*\n*/    color: #1aa5f7;/*\n*/}/*\n*/ .txt_em {/*\n*/    color: #7cd2d6; /*\n*/}.click_row_up {/*\n*/    background: #072954;/*\n*/}.click_row_hover {/*\n*/    background: #073b7d;/*\n*/}.combat_result tr {/*\n*/    background-color: #002461;/*\n*/}            ';

document.getElementsByTagName('head')[0].appendChild(style);
