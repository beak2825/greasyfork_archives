// ==UserScript==
// @name         mostra nascondi password figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      0.1
// @description  comandi dal menu per mostrare nascondere password
// @author       figuccio
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/475838/mostra%20nascondi%20password%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/475838/mostra%20nascondi%20password%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;
    function initMenu(){
    if($('input[type=password]').length>0){
    GM_registerMenuCommand('Mostra password', () => {
    $('input[type=password]').attr("type", "1");
            });
    GM_registerMenuCommand('Nascondi password', () => {
    $('input[type=1]').attr("type", "password");
            });
        }

    }

    initMenu();

})();