// ==UserScript==
// @name         BT - show links instead of clickbait titles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       johnnie johansen
// @match        https://www.bt.dk/*/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/396631/BT%20-%20show%20links%20instead%20of%20clickbait%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/396631/BT%20-%20show%20links%20instead%20of%20clickbait%20titles.meta.js
// ==/UserScript==

var $ = window.$;

$(document).ready(function(){
    run();
    function run(){
        var links = '';

        $('article').each(function(){
            let href = $(this).find('a').attr('href');
            $(this).hide();
            let title = href.replace('https://', "")
            .replace('www.','')
            .replace('bt.dk/', '')
            .replace('/', ': ');

            links = links + "<p style='display:block;width:100%;border-left:3px solid #f0f;background:#222;'>"
                + "<a style='font-size:22px;color:#FFF;display:block;padding:5px;' href=" + href + ">" + title + "</a>"
                + "<p>";
        });
        $('.aptoma-box').html(links);
    };
});
