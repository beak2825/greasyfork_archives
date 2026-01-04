// ==UserScript==
// @name         Xossip.com -> Xossip.rocks
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        http://www.xossip.rocks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31860/Xossipcom%20-%3E%20Xossiprocks.user.js
// @updateURL https://update.greasyfork.org/scripts/31860/Xossipcom%20-%3E%20Xossiprocks.meta.js
// ==/UserScript==
this.$ = window.jQuery.noConflict(true);
$(document).ready(function(){
    var links = $('a[href^="https://www.xossip.com"],a[href^="https://xossip.com"]');
    $(links).attr('href',function(){
        var tmp = $(this).attr('href');
        tmp = tmp.replace('https://www.xossip.com','http://www.xossip.rocks');
        tmp = tmp.replace('https://xossip.com','http://www.xossip.rocks');
        console.log(tmp);
        return tmp;
    });
    var links2 = $('a[href^="xossip.com"],a[href^="www.xossip.com"],a[href^="http://xossip.com"],a[href^="http://www.xossip.com"]');
    $(links2).attr('href',function(){
        var tmp = $(this).attr('href');
        tmp = tmp.replace('xossip.com','xossip.rocks');
        console.log(tmp);
        return tmp;
    });
});