// ==UserScript==
// @name         Nouveaux posts & threads
// @namespace    https://realitygaming.fr
// @version      1.0
// @description  Script permettant d'actualiter automatiquement la page des discussions sans réponses
// @author       Rivals
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24775/Nouveaux%20posts%20%20threads.user.js
// @updateURL https://update.greasyfork.org/scripts/24775/Nouveaux%20posts%20%20threads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
     $(document).ready(function(){
         if($('.find_new_posts').length >= 1)
         {
             setInterval(function(){
                 $('.discussionList').load('https://realitygaming.fr/find-new/posts .discussionList');
                 console.info('News posts loaded');
             }, 30000);
         }
    
         if($('.unanswered_threads').length >= 1)
         {
             setInterval(function(){
                 $('.discussionList').load('https://realitygaming.fr/sans-reponses/threads .discussionList');      
                 console.info('News threads loaded');
             }, 30000);
         }
     });
})();