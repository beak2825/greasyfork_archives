// ==UserScript==
// @name         Xkcd Forums Edit Highlighter
// @version      0.1
// @description  Highlights posts edited after date
// @author       faubi
// @match        http://forums.xkcd.com/viewtopic.php*
// @match        http://fora.xkcd.com/viewtopic.php*
// @match        http://forums3.xkcd.com/viewtopic.php*
// @match        http://echochamber.me/viewtopic.php*
// @namespace    FaubiScripts
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12957/Xkcd%20Forums%20Edit%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/12957/Xkcd%20Forums%20Edit%20Highlighter.meta.js
// ==/UserScript==

div = document.createElement('div');
div.style['margin-left'] = '30px';
div.style['margin-top'] = '3px';
div.style.float = 'left';

label = document.createElement('span');
label.textContent = 'Highlight new edits: ';
div.appendChild(label);

date = document.createElement('input');
date.type = 'date';
date.valueAsDate = Date.now();
div.appendChild(date);

button = document.createElement('input');
button.type = 'button';
button.value = 'Highlight';
button.addEventListener('click', function() {
    if (!date.valueAsDate) {
        return;
    }
    console.log('j');
    notices = document.getElementsByClassName('notice');
    for(var i=0;i<notices.length;i++) {
        var notice = notices[i];
        var post = notice.parentNode.parentNode.parentNode;
        if (new Date(/on (.*) [A-Z]{3},/.exec(notice.textContent)[1]) > date.valueAsDate) {
            post.style['background-color']='#2E7';
        } else {
            post.style['background-color']='';
        }
    }
});
button.classList.add('button2');
button.style['font-size'] = '1em';
div.appendChild(button);



search = document.getElementsByClassName('search-box')[0];
search.parentNode.insertBefore(div, search.nextSibling);