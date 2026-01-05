// ==UserScript==
// @name           400gb.com Ads Remover
// @description    Yes
// @version        0.1
// @author         halfcoder
// @namespace      http://github.com/halfcoder
// @include        http://www.400gb.com/file/*
// @downloadURL https://update.greasyfork.org/scripts/10163/400gbcom%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/10163/400gbcom%20Ads%20Remover.meta.js
// ==/UserScript==

setTimeout(function() {
    var script = document.createElement('script');
    script.id = '400gbadsremover';
    script.type = 'text/javascript';
    script.innerHTML = "(function($){console.log(\"400gb.com Ads Remover by halfcoder is running!\");$(\"body\").append(\"<div id=\\\"cproIframe7holder\\\"></div>\");})(jQuery);";
    document.head.appendChild(script);
}, 1000);