// ==UserScript==
// @name        Cuberealm.io Wiki Search / Chat Selection
// @namespace   cooluser1481
// @match       https://cuberealm.io/*
// @version     1.0
// @author      cooluser1481
// @description [Outdated] An easy way to type a search into the Miraheze Cuberealm.io wiki, or just highlight text in chat
// @license     Do whatever you want, I don't care.
// @downloadURL https://update.greasyfork.org/scripts/543229/Cuberealmio%20Wiki%20Search%20%20Chat%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/543229/Cuberealmio%20Wiki%20Search%20%20Chat%20Selection.meta.js
// ==/UserScript==

/*
 *This script is safe for bookmarklets, console, or script manager.
 *All comments are ended, (except for the start,) making it easy to put as 1 line
 */


document.body.style.userSelect = "text"; /*allows chat to be selected/coppied*/
document.body.style.webkitUserSelect = "text"; /*for Safari*/

function se(d) {
    return d.selection ? d.selection.createRange().text : d.getSelection(); /*finds selection*/
}

var s = se(document); /*gets selection of document*/

document.addEventListener("keypress", function(event) {
    if (event.keyCode == 104) {
        /*key h pressed, this method avoids interference with cuberealm events*/
        for (var i = 0; i < frames.length && (s == null || s == ''); i++)
            s = se(frames[i].document);
        if (!s || s == '') s = prompt('What to search for:', ''); {
            /*If nothing is selected, ask what to search*/
            if (s !== null && s !== false && s !== '') {
                /*If answer is empty or cancled, ignore*/
                window.open('https://cuberealm.miraheze.org' + (s ? '/w/index.php?title=Special:Search&search=' + encodeURIComponent(s) : '')).focus(); /*open the wiki search page*/
            }
        }
    }
});