// ==UserScript==
// @name         RSS Finder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  find rss feed url
// @author       You
// @match        *://*/*
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_notification
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/442216/RSS%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/442216/RSS%20Finder.meta.js
// ==/UserScript==

var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
}
loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*

          */
    });
    var head = document.querySelector('head')
    head.appendChild(style);
};
loadCss();
var feedList = [];
GM_registerMenuCommand("GET", function () {
     alert(feedList.join('\r\n'));
});
$(function () {
    $('link[rel=alternate]').each(function () {
        var href = $(this).attr('href');
        var regex = /(xml|feed|atom|rss)/gi;
        if(href.match(regex)){
            console.log('find path:'+href);
            var regexDomain = /^http/gi
                    if(href.match(regexDomain)){
feedList.push(href);
                    }else{
                        feedList.push((window.location.protocol + '//'+ window.location.host + ('/'
+href).replace('//','/')));

                    }
        }
    });
    console.log(feedList);
});
