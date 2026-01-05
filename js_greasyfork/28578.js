// ==UserScript==
// @name Go Pusher
// @description Simplifies pushing the go button the the vend page gaiaonline
// @include *gaiaonline.com/*
// @require https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// @version 0.0.1.20170331135450
// @namespace https://greasyfork.org/users/109726
// @downloadURL https://update.greasyfork.org/scripts/28578/Go%20Pusher.user.js
// @updateURL https://update.greasyfork.org/scripts/28578/Go%20Pusher.meta.js
// ==/UserScript==

var makeSendLinkCallback = function(url) {
    return function() { window.location.href = url; };
};

Mousetrap.bind('v', makeSendLinkCallback('http://www.gaiaonline.com/marketplace/vendsearch/?sortBy=91&start=0'));
Mousetrap.bind('x', makeSendLinkCallback('http://www.gaiaonline.com/marketplace/mystore'));
Mousetrap.bind('s', makeSendLinkCallback('http://www.gaiaonline.com/marketplace/mystore/showinventory/DD'));
Mousetrap.bind('e', makeSendLinkCallback('http://www.gaiaonline.com/marketplace/vendsearch/20/?sortBy=91&start=3'));
Mousetrap.bind('d', makeSendLinkCallback('http://www.gaiaonline.com/marketplace/vendsearch/20/?sortBy=91&start=2'));
Mousetrap.bind('c', makeSendLinkCallback('http://www.gaiaonline.com/marketplace/vendsearch/20/?sortBy=91&start=1'));

sandbox.setTimeOut = function (callback, timeout, p1,p2,p3/*....*/){
    var args = Array.prototype.slice.call(arguments,2);
    return  sandbox.window.setTimeout(function(){
        return callback.apply(sandbox, args);
    } ,timeout);
}
