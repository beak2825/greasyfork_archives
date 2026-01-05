// ==UserScript==//
// @name        No Dick-Pics Reddit /r/gonewild
// @description No Dick-Pics in /r/gonewild
// @version     1.3
// @include     https://www.reddit.com/r/gonewild/*
// @run-at      document-start
// @require     https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @namespace https://greasyfork.org/users/14346
// @downloadURL https://update.greasyfork.org/scripts/25019/No%20Dick-Pics%20Reddit%20rgonewild.user.js
// @updateURL https://update.greasyfork.org/scripts/25019/No%20Dick-Pics%20Reddit%20rgonewild.meta.js
// ==/UserScript==

// process the already loaded portion of the page
process(document.querySelectorAll(
    'a.title'
));

// process the stuff loaded from now on
setMutationHandler(
    document,
    'a.title',
    process
);

function process(nodes) {
    for (var i=0, n; (n=nodes[i++]); ) {
        if (n.textContent.match(/^(?!(.*)?(\[|\(|\{)([0-9]{2}? ?(,|-|\/)? ?)?f(emale)?( ?(,|-|\/)? ?[0-9]{2}?)?(\}|\)|\]))(.*)?(\[|\(|\{)([0-9]{2}? ?(,|-|\/)? ?)?(m( ?(,|-|\/|4)? ?m(.*)?|e|y|an|en|ales?| ?(,|-|\/)? ?4f(.*)?)?)( ?(,|-|\/)? ?[0-9]{2}?)?(\}|\)|\])(?!(.*)?(\[|\(|\{)([0-9]{2}? ?(,|-|\/)? ?)?f(emale)?( ?(,|-|\/)? ?[0-9]{2}?)?(\}|\)|\]))(.*)?$/i)) {
            (n.closest('.thing') || n.parentNode).remove();
        }
        if (n.textContent.match(/(\[|\(|\{)([0-9]{2}? ?(,|-|\/)? ?)?(t|cd|\?)( ?(,|-|\/)? ?[0-9]{2}?)?(\}|\)|\])/i)) {
            (n.closest('.thing') || n.parentNode).remove();
        }
        if (n.textContent.match(/(\[|\(|\{).*(,|-|\/| ) ?[0-9]{2}? ?(,|-|\/)? ?(t|cd|\?) ?(,|-|\/)? ?[0-9]{2}?(\}|\)|\])/i)) {
            (n.closest('.thing') || n.parentNode).remove();
        }
        if (n.textContent.match(/(\[|\(|\{)[0-9]{2}? ?(,|-|\/)? ?(t|cd|\?) ?(,|-|\/)? ?[0-9]{2}?(,|-|\/| ).*(\}|\)|\])/i)) {
            (n.closest('.thing') || n.parentNode).remove();
        }
    }
}