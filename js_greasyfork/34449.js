// ==UserScript==
// @name         php.net 隐藏 UserNotes
// @namespace    phpNetHideUserNoteByConte
// @version      0.2
// @description  php.net 隐藏 user note
// @author       Conte
// @match        http://php.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34449/phpnet%20%E9%9A%90%E8%97%8F%20UserNotes.user.js
// @updateURL https://update.greasyfork.org/scripts/34449/phpnet%20%E9%9A%90%E8%97%8F%20UserNotes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // hide user notes
    var usernotes = document.getElementById('usernotes');
    if(!usernotes) return false;
    usernotes.setAttribute('style','display:none');

    // create button
    var newLi = document.createElement("li");
    var newA = document.createElement("a");
    newA.setAttribute('id','noteStatus');
    var newContent = document.createTextNode("ShowUserNote");
    newLi.appendChild(newA);
    newA.appendChild(newContent);
    document.getElementsByClassName('nav')[0].append(newLi);
    // listener
    newA.addEventListener('click',function (e){
        var usernotes = document.getElementById('usernotes');
        var disStatus = usernotes.getAttribute('style');
        var noteStatus = e.target;
        if(disStatus == 'display:none'){
            noteStatus.innerHTML = 'HideUserNote';
            usernotes.setAttribute('style','display:block !important');
        } else {
            noteStatus.innerHTML = 'ShowUserNote';
            usernotes.setAttribute('style','display:none');
        }
    });
})();