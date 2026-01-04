// ==UserScript==
// @name         ahk_forum_fix
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adding back 'EXPAND VIEW' to code box; Fix Spoiler can't show/hide...
// @author       tmplinshi
// @match        https://autohotkey.com/boards/viewtopic.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374036/ahk_forum_fix.user.js
// @updateURL https://update.greasyfork.org/scripts/374036/ahk_forum_fix.meta.js
// ==/UserScript==

expand_code_init();
spoiler_init();


window.expandCode = function (e) {
    var c = e.parentNode.parentNode.getElementsByTagName('code')[0];
	if (c.style.maxHeight == 'none') {
		c.style.maxHeight = '200px';
		e.innerHTML = 'EXPAND VIEW';
	}
	else {
		c.style.maxHeight = 'none';
		e.innerHTML = 'COLLAPSE VIEW';
	}
}

window.spoiler_showHide = function (e) {
    var sw = ((e.getAttribute('value') == 'Show') ? 1 : 0);
    e.setAttribute('value', (sw ? 'Hide' : 'Show' ));

    //e.nextSibling.firstChild.setAttribute('style', (sw ? 'display:block;' : 'display:none;'));
    var c = e.parentNode.getElementsByClassName('bbc_spoiler_content')[0];
    c.setAttribute('style', (sw ? 'display:block;' : 'display:none;'));

    if (sw) {
        checkChildCodebox(e.nextSibling);
    }
}

function checkChildCodebox(e) {
    var boxes = e.getElementsByTagName('code');
	for (var i = 0; i < boxes.length; i++) {
		if (boxes[i].scrollHeight > boxes[i].offsetHeight + 1) {
            var tagP = (boxes[i].parentNode.tagName.toLowerCase() == 'pre' ? boxes[i].parentNode.previousSibling : boxes[i].previousSibling);
            var added = (tagP.innerHTML.indexOf('EXPAND') > 0)
            if (!added) {
                tagP.innerHTML += ' &middot; <a href="#" onclick="expandCode(this); return false;">EXPAND VIEW</a>';
            }
        }
	}
}

function expand_code_init() {
	var boxes = document.getElementsByTagName('code');
	for (var i = 0; i < boxes.length; i++) {
		if (boxes[i].scrollHeight > boxes[i].offsetHeight + 1) {
			var tagP = (boxes[i].parentNode.tagName.toLowerCase() == 'pre' ? boxes[i].parentNode.previousSibling : boxes[i].previousSibling);
            tagP.innerHTML += ' &middot; <a href="#" onclick="expandCode(this); return false;">EXPAND VIEW</a>';
        }
	}
}

function spoiler_init() {
	var btns = document.getElementsByClassName('post_spoiler_show');
	for (var i = 0; i < btns.length; i++) {
        /*
        if (btns[i].previousSibling.className == 'spoiler_title') {
            btns[i].setAttribute('onClick', 'spoiler_showHide(this);');
        }
        */
        btns[i].setAttribute('onClick', 'spoiler_showHide(this);');
	}
}