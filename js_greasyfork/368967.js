// ==UserScript==
// @name         Facebook Friends Requests Reject
// @namespace    https://fb.com/trunghieuth10
// @version      0.1
// @description  try to take over the world!
// @match        https://m.facebook.com/friends/center/requests*
// @match        https://www.facebook.com/friends/requests*
// @author       TrunghieuTH10
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368967/Facebook%20Friends%20Requests%20Reject.user.js
// @updateURL https://update.greasyfork.org/scripts/368967/Facebook%20Friends%20Requests%20Reject.meta.js
// ==/UserScript==

// @match        https://m.facebook.com/friends/center/requests/?mff_nav=1
var allElems = document.getElementsByClassName('_54k8 _52jg _56bs _26vk _56b_ _5uc3 _3cqr _56bt');
for (var j = 0; j < allElems.length; j++) {
    allElems[j].click();
};

// @match        https://m.facebook.com/friends/center/requests/outgoing/?_rdr#friends_center_main
var outgoing = document.getElementsByClassName('_42ft _4jy0 _4jy3 _517h _51sy');
for (var k = 0; k < outgoing.length; k++) {
    outgoing[k].click();
};

// @match        https://www.facebook.com/friends/requests
var allElem = document.getElementsByClassName('pam uiBoxLightblue _5cz uiMorePagerPrimary');
for (var i = 0; i < allElem.length; i++) {
    allElem[i].click();
};
var inputs = document.getElementsByClassName('_54k8 _52jg _56bs _26vk _56bt');
for(var h=0; h<inputs.length;h++) {
    inputs[h].click();
};
location.reload();