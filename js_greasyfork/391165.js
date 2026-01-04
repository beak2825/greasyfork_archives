// ==UserScript==
// @name         Mypy-play.net keyboard shortcut 
// @version      0.0
// @description  Allow ctrl-enter to be shortcut for "Run" on mypy-play.net
// @match        https://mypy-play.net/*
// @grant        none
// @namespace https://greasyfork.org/users/2810
// @downloadURL https://update.greasyfork.org/scripts/391165/Mypy-playnet%20keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/391165/Mypy-playnet%20keyboard%20shortcut.meta.js
// ==/UserScript==
 
(function() {
    document.addEventListener('keydown', function(event){
        if(event.code=='Enter'&&
            !event.shiftKey&&!event.metaKey&&event.ctrlKey
        ){
            run.click()
        }
    })
})();
