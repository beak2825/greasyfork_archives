// ==UserScript==
// @name        Google Fixed Tab Order (2023-08)
// @namespace   google.com
// @description Stops google from reordering the tabs like wtf are you doing you piece of shit, shamefully copied from https://greasyfork.org/en/scripts/18521-google-fixed-tab-order/code and updated for June 2023
// @include     https://www.google.*/search?*
// @include     https://www.google.*/webhp?*
// @version     3.3
// @grant       none
// @author      cabtv
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/468819/Google%20Fixed%20Tab%20Order%20%282023-08%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468819/Google%20Fixed%20Tab%20Order%20%282023-08%29.meta.js
// ==/UserScript==

function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return [].filter.call(elements, function(element){
    return RegExp(text).test(element.textContent);
  });
}

function getTab(text) {

    let magicString;

    // yeah, that should work but it doesn't
    magicString = document.querySelector('[role="navigation"] [role="navigation"] > div > div > div');
    if ( !magicString ) return undefined;
    magicString = magicString.getAttribute('jscontroller')

    //magicString = 'fcDBE';

    let e = contains('[jscontroller="' + magicString + '"] > a', text);
    if (e != undefined && e[0] != undefined)
        return [e[0], e[0]];
    e = contains('[jscontroller="' + magicString + '"] div', text);
    if (e != undefined && e[0] != undefined)
        return [e[0].querySelector('a'), e[0]];
}

function moveToFront(text) {
    var tab = getTab(text);
    if (tab == undefined)
        return;
    var newtab = tab[0].cloneNode(true);

    var wrapper = tab[1].parentElement;
    wrapper.removeChild(tab[1]);
    wrapper.prepend(newtab);
}

function removeTab(text) {
    getTab(text).style.display = 'none';
}

var isDone = 0 // stopper flag. we unbind the event, but before we can do that, it already is fired 4 times, so this additional flag makes sure we only fix tabs once
function fixTabs()
{
    if (isDone) return isDone = 1;

    moveToFront('Maps');
    moveToFront('Videos');
    moveToFront('Images');
/*
    moveToFront('News');
    moveToFront('Books');
    moveToFront('Apps');
    moveToFront('Shopping');
    moveToFront('Flights');
    moveToFront('GitHub');
    moveToFront('Examples');

    moveToFront('More');
    */
}

function delegate(el, evt, sel, handler) {
    el.addEventListener(evt, function(event) {
        var t = event.target;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, event);
            }
            t = t.parentNode;
        }
    });
}

(function() {
    delegate(document.getElementById('cnt'), "DOMNodeInserted", 'div > [role=navigation]', function(event) {
        var elem = document.getElementById('cnt');
        elem.replaceWith(elem.cloneNode(true)); // cheap way of removing all events. otherwise moveToFront would cause this event to trigger again
        setTimeout(fixTabs, 50); // sadly, when firing right away, the tabs elements have not been yet inserted fully
    });
})();
