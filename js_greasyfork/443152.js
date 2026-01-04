// ==UserScript==
// @name         Beautify scrollbar
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adjust the scroll bar of the web page to make it more beautiful
// @author       luosansui
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443152/Beautify%20scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/443152/Beautify%20scrollbar.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    'use strict';
    //if(self !== top)return
    document.head.insertAdjacentHTML('beforeend',`<style>
        *::-webkit-scrollbar {
            width: 16px;
            height: 16px;
        }
        *::-webkit-scrollbar-button, *::-webkit-scrollbar-corner {
            display: none;
        }
        *::-webkit-scrollbar-thumb {
            background-color: #909090;
            border-radius: 50px;
            background-clip: padding-box;
            border: 4px solid transparent;
        }
        *::-webkit-scrollbar-thumb:hover {
            background-color: #606060;
            border: 3px solid transparent;
        }
        
        @supports not selector(::-webkit-scrollbar) {
            @supports (scrollbar-width: thin) {
                * {
                    scrollbar-width: thin;
                }
            }
            @supports (scrollbar-color: #909090 transparent) {
                * {
                    scrollbar-color: #909090 transparent;
                }
            }
        }
    </style>`)
})();