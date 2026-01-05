	
 
// ==UserScript==
// @name Youtube auto Proxfree
// @description this script automatically redirects youtube to a proxy.
//
// @include http://www.youtube.com/watch?*
// @include https://www.youtube.com/watch?*
// @include http://*.youtube.com/watch?*
// @include https://*.youtube.com/watch?*
// @version 0.0.1.20140607005814
// @namespace https://greasyfork.org/users/2561
// @downloadURL https://update.greasyfork.org/scripts/2217/Youtube%20auto%20Proxfree.user.js
// @updateURL https://update.greasyfork.org/scripts/2217/Youtube%20auto%20Proxfree.meta.js
// ==/UserScript==
GM_xmlhttpRequest({
method: 'POST',
url: 'http://eu.proxfree.com/request.php?do=go',
data: 'get=' + encodeURIComponent(window.location.href),
headers: {
'User-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0',
'Accept': 'application/xml,text/xml',
"Content-Type": "application/x-www-form-urlencoded"
},
onload: function(responseDetails) {
var res = responseDetails.responseText;
var premalinks = res.match(/(http:\/\/eu\.proxfree\.com\/permalink\.php\?.*\);)/im);
window.location = premalinks[0];
}
});