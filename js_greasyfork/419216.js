// ==UserScript==
// @name         xivanalysis zh action
// @namespace    https://xivanalysis.com/
// @version      0.3
// @description  Since the site admin won't take the advantage.
// @author       Bluefissure
// @match        https://xivanalysis.com/*
// @require      http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/419216/xivanalysis%20zh%20action.user.js
// @updateURL https://update.greasyfork.org/scripts/419216/xivanalysis%20zh%20action.meta.js
// ==/UserScript==

(function() {
    'use strict';
    xhook.before(function(request) {
        if(typeof request.url === 'string' && $("[class^='I18nMenu-module_container']").children().first()[0].childNodes[1].textContent === "简体中文"){
            request.url = request.url.replace("https://xivapi.com", "https://cafemaker.wakingsands.com").replace(/language=../,"language=zh");
        }
    });

})();