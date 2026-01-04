   // ==UserScript==
   // @name         nav_list
   // @namespace    http://tampermonkey.net/
   // @version      0.0.1
   // @description  nav数据
   // @author       lsmhq
   // @license      MIT
   // ==/UserScript== 

   (function () {
    'use strict';
    let questAddress = [
         'wizard101-magical-trivia',
         'wizard101-adventuring-trivia',
         'wizard101-conjuring-trivia',
         'wizard101-marleybone-trivia',
         'wizard101-mystical-trivia',
         'wizard101-spellbinding-trivia',
         'wizard101-spells-trivia',
         'pirate101-valencia-trivia',
         'wizard101-wizard-city-trivia',
         'wizard101-zafaria-trivia',
    ]    
    window.questAddress = questAddress
})();