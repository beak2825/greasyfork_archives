// ==UserScript==
// @name            Open Links in NEW BACKGROUND Tab
// @author          Jerry
// @description     Open links (esp. from different domains) in NEW BACKGROUND tab with normal left click
// @grant           GM_openInTab
// @include         http*://*
// @namespace       https://greasyfork.org/users/28298
// @run-at          document-start
// @version         1.2
// @license         GNU GPLv3
// @homepage        https://greasyfork.org/en/scripts/457107/versions/new
// @downloadURL https://update.greasyfork.org/scripts/457107/Open%20Links%20in%20NEW%20BACKGROUND%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/457107/Open%20Links%20in%20NEW%20BACKGROUND%20Tab.meta.js
// ==/UserScript==


// source:
// https://greasyfork.org/en/scripts/20694-all-links-open-all-in-new-background-tab/code
// https://greasyfork.org/en/scripts/12367-open-links-in-new-tab/code

attachHandler([].slice.call(document.getElementsByTagName('a')));

setMutationHandler(document, 'a', function(nodes) {
    attachHandler(nodes);
    return true;
});


// Not use anymore, has been fixed by cond2 below
// https://stackoverflow.com/a/26269087/2292993
// ugly fix duckduckgo rightside bar search results
// // document.addEventListener ("DOMContentLoaded", FnReady);
// window.addEventListener ("load", FnReady);
// function FnReady () {
//     if (location.href.startsWith('https://duckduckgo.com')) {
//         var nodes = document.getElementsByTagName('a');
//         for (var i=0; i<nodes.length; i++) {
//             var node = nodes[i];
//             if (node.className.includes("js-about-item")) {
//                 node.replaceWith(node.cloneNode(true));
//             }
//         }
//     }
// }

function attachHandler(nodes) {
    nodes.forEach(function(node) {
        // href will be auto expanded with window.location.origin, such as href="#" --> "https://example.com/#"
        var cond = (node.target != '_blank') && (node.href) && (!node.href.includes("javascript:")) && (!node.href.startsWith(window.location.origin));
        // Exclusion list from modification by this script to prevent malfunction of the original website:
        cond = cond && (node.className!="search-engine-a");         // search-engine-a: more compatible with Search Engine Switcher script
        cond = cond && (!node.className.includes("s-topbar--item"));  // stackoverflow
        cond = cond && (!location.href.startsWith("https://app.raindrop.io"));
        cond = cond && (!location.href.startsWith("https://portal.discover.com"));
        cond = cond && (!node.href.startsWith("https://accounts.google.com")); // gdrive
        cond = cond && (!node.href.startsWith("https://identity.walmart.com")); // walmart login
        cond = cond && (!new URL(node.href).hostname.endsWith("fidelity.com")); // fidelity website
        cond = cond && (!node.href.startsWith("https://ttp.cbp.dhs.gov"));
        if ( cond ) {
            node.onclick = clickHandler;
            node.addEventListener('click', clickHandler);

        }
        // to avoid circular loop (that I do not fully understand how it would happen)
        cond2 = cond && (!node.hasAttribute('processed'));
        // ddg right sidebar search result or image search result
        cond2 = cond2 && ( node.className.includes("js-about-item") || (cond && location.href.startsWith("https://duckduckgo.com") && location.href.includes("&ia=images"))  );
        if ( cond2 ) {
            node.setAttribute("processed", "true");
            node.replaceWith(node.cloneNode(true));
        }
    });
}

/*
https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
MouseEvent.buttons
0: No button or un-initialized
1: Primary button (usually the left button)
2: Secondary button (usually the right button)
4: Auxiliary button (usually the mouse wheel button or middle button)
8: 4th button (typically the "Browser Back" button)
16 : 5th button (typically the "Browser Forward" button)

https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
KeyboardEvent.metaKey
e.metaKey

https://stackoverflow.com/a/35936912/2292993
e is short for event
the element on which you clicked (event.target)

https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
The stopPropagation() method of the Event interface prevents further propagation of the current event in the capturing and bubbling phases. It does not, however, prevent any default behaviors from occurring; for instance, clicks on links are still processed. If you want to stop those behaviors, see the preventDefault() method. It also does not prevent immediate propagation to other event-handlers. If you want to stop those, see stopImmediatePropagation().
*/
function clickHandler(e) {
    if (e.button > 1)
        return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // GM_openInTab(this.href, e.button || e.ctrlKey);
    GM_openInTab(this.href, true); // open in background
}




// https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// ==UserScript==
// @name          setMutationHandler
// @description   MutationObserver wrapper to wait for the specified CSS selector
// @namespace     wOxxOm.scripts
// @author        wOxxOm
// @grant         none
// @version       3.0.2
// ==/UserScript==

function setMutationHandler(target, selector, handler, options) {
// or    setMutationHandler(selector, handler, options) {
// or    setMutationHandler(options) {
    if (typeof arguments[0] == 'string') {
        options = arguments[2] || {};
        handler = arguments[1];
        selector = arguments[0];
        target = document;
    } else if (arguments.length == 1 && target && typeof target.handler == 'function') {
        options = arguments[0];
        handler = options.handler;
        selector = options.selector;
        target = options.target || document;
    } else if (!(target instanceof Node)) {
        throw 'Bad params for setMutationHandler.\n' +
            'A: [optional Node] target, [String] selector, [Function] handler, [optional Object] options\n' +
            'B: [Object] options\n' +
            'Options: target, selector, handler, processExisting, childList, attributes, characterData, subtree, attributeOldValue, characterDataOldValue, attributeFilter';
    } else
        options = options || {};

    if (options.processExisting && target.querySelector(selector))
        handler.call(null, Array.prototype.slice.call(target.querySelectorAll(selector)));
    if (!options.attributes && !options.characterData && !options.childList && options.subtree === undefined)
        options.childList = options.subtree = true;

    var cb;
    if (/^#[\w\d-]+$/.test(selector)) {
        selector = selector.substr(1);
        cb = MOhandlerForId;
    } else {
        cb = MOhandler;
    }
    var observer = new MutationObserver(cb);
    observer.observe(target, options || {subtree:true, childList:true});
    return observer;

    function MOhandler(mutations) {
        if (mutations.length > 100 && !document.querySelector(selector))
            return;
        var found = [];
        for (var i=0, m; (m = mutations[i++]); ) {
            switch (m.type) {
                case 'childList':
                    var nodes = m.addedNodes, nl = nodes.length;
                    var textNodesOnly = true;
                    for (var j=0; j < nl; j++) {
                        var n = nodes[j];
                        textNodesOnly &= n.nodeType == 3; // TEXT_NODE
                        if (n.nodeType != 1) // ELEMENT_NODE
                            continue;
                        if (n.matches(selector))
                            found.push(n);
                        else if (n.querySelector(selector)) {
                            n = n.querySelectorAll(selector);
                            if (n.length < 1000)
                                found.push.apply(found, n);
                            else
                                found = found.concat(found.slice.call(n));
                        }
                    }
                    if (textNodesOnly && m.target.matches(selector))
                        found.push(m.target);
                    break;
                case 'attributes':
                    if (m.target.matches(selector))
                        found.push(m.target);
                    break;
                case 'characterData':
                    if (m.target.parentNode && m.target.parentNode.matches(selector))
                        found.push(m.target.parentNode);
                    break;
            }
        }
        if (!found.length)
            return;
        if (handler.call(observer, found) === false)
            observer.disconnect();
    }

    function MOhandlerForId(mutations) {
        var el = document.getElementById(selector);
        if (el && target.contains(el))
            if (handler.call(observer, [el]) === false)
                observer.disconnect();
    }
}

