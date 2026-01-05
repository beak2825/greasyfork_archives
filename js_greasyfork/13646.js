// ==UserScript==
// @name Redmine Submit Guard
// @description:en Avoid submit by enter key.
// @version 0.1
// @namespace http://twitter.com/foldrr/
// @require   http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @match     http://*/redmine/projects/*/issues/new
// @match     http://*/redmine/issues/*
// @description Avoid submit by enter key.
// @downloadURL https://update.greasyfork.org/scripts/13646/Redmine%20Submit%20Guard.user.js
// @updateURL https://update.greasyfork.org/scripts/13646/Redmine%20Submit%20Guard.meta.js
// ==/UserScript==

(function(){
    $('input').keypress(function(ev){
        if(ev.keyCode === 10 || ev.keyCode === 13){
            if(Event.element(ev).id == 'q') return true;
            if($('#issue_subject').val().trim()     === ''){ $('#issue_subject').focus();     return false; }
            if($('#issue_description').val().trim() === ''){ $('#issue_description').focus(); return false; }
            return false;
        }
        return true;
    });
})();
