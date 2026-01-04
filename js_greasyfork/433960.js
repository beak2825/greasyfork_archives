// ==UserScript==
// @name        Google Fixed Tab Order (Oct. 2021)
// @namespace   google.com
// @description Stops google from reordering the tabs like wtf are you doing you piece of shit, stolen from https://greasyfork.org/en/scripts/18521-google-fixed-tab-order/code and updated for October 2021
// @include     https://www.google.com/search?*
// @include     https://www.google.com/webhp?*
// @version     3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/433960/Google%20Fixed%20Tab%20Order%20%28Oct%202021%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433960/Google%20Fixed%20Tab%20Order%20%28Oct%202021%29.meta.js
// ==/UserScript==

function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return [].filter.call(elements, function(element){
    return RegExp(text).test(element.textContent);
  });
}

function getTab(text) {
    let e = contains('.hdtb-mitem', text);
    if (e != undefined && e[0] != undefined)
        return e[0];
    e = contains('.NZmxZe', text);
    if (e != undefined && e[0] != undefined)
        return e[0];
    e = contains('[jscontroller="nabPbb"]', text);
    if (e != undefined && e[0] != undefined)
        return e[0];
}

function moveToFront(text) {
    var tab = getTab(text);
    if (tab == undefined)
        return;
    var newtab = tab.cloneNode(true);

    var wrapper = tab.parentElement;
    wrapper.removeChild(tab);
    wrapper.appendChild(newtab);
}

function removeTab(text) {
    getTab(text).style.display = 'none';
}

function fixTabs()
{
    moveToFront('Images');
    moveToFront('Videos');

    moveToFront('Maps');
    moveToFront('News');
    moveToFront('Books');
    moveToFront('Apps');
    moveToFront('Shopping');
    moveToFront('Flights');

    moveToFront('More');
}

(function() {
    fixTabs();
    // setInterval(fixTabs, 1000);
})();
