// ==UserScript==
// @name       Steam Sucks
// @namespace  http://lizzy.in
// @version    0.1
// @description  http://facepunch.com/showthread.php?t=1405898&p=45356500&viewfull=1#post45356500
// @match      https?://steamcommunity.com/
// @copyright  2012+, Lizzy, horsedrowner
// @downloadURL https://update.greasyfork.org/scripts/3887/Steam%20Sucks.user.js
// @updateURL https://update.greasyfork.org/scripts/3887/Steam%20Sucks.meta.js
// ==/UserScript==

const { Cc, Ci, Cr } = require('chrome');
var events = require('sdk/system/events');
var utils = require('sdk/url/utils');
var linkfilterPattern = /^https?:\/\/steamcommunity\.com\/linkfilter\/\?url=(.*)$/;

events.on('http-on-modify-request', function (event) {
    var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
    var url = event.subject.URI.spec;
    var match = url.match(linkfilterPattern);
    if (match) {
        var actualUrl = utils.newURI(match[1]);
        event.subject.redirectTo(actualUrl);
    }
}, true);