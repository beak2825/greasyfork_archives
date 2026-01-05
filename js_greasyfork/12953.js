// ==UserScript==
// @name         Monospacer
// @version      0.2
// @description  Adds a button to make the xkcd forums posting box monospace
// @author       faubi
// @match        http://forums.xkcd.com/posting.php*
// @match        http://fora.xkcd.com/posting.php*
// @match        http://forums3.xkcd.com/posting.php*
// @match        http://echochamber.me/posting.php*
// @grant        none
// @namespace    FaubiScripts
// @downloadURL https://update.greasyfork.org/scripts/12953/Monospacer.user.js
// @updateURL https://update.greasyfork.org/scripts/12953/Monospacer.meta.js
// ==/UserScript==

var isMonospace = false;

button = document.createElement('input');
button.type = 'button';
button.classList.add('button2');
button.value = 'monospace';
button.title = 'Toggle monospace font';

postform = document.getElementById('postform');
postAction = postform.action;

function toggleMonospace() {
    isMonospace = !isMonospace;
    document.getElementById('message').style['font-family'] = isMonospace ? 'monospace' : '';
    if (isMonospace){
        postform.action = postAction + '&monospace=1';
    } else {
        postform.action = postAction;
    }
}

button.addEventListener('click', toggleMonospace);

if (document.location.search.indexOf('monospace=1') !== -1) {
    toggleMonospace();
}

document.getElementById('format-buttons').appendChild(button);

