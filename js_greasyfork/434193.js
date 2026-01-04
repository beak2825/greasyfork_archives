// ==UserScript==
// @name         Pocket Direct Link
// @name:ja      Pocket Direct Link
// @version      1.1
// @description  access the article directly in Pocket.
// @description:ja Pocketで記事に直接アクセス
// @author       ぬ
// @match        https://getpocket.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/83168
// @downloadURL https://update.greasyfork.org/scripts/434193/Pocket%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/434193/Pocket%20Direct%20Link.meta.js
// ==/UserScript==

$(function(){

    var wait = setInterval(function(){

        $('article').each(function(){

            var text = $(this).text();
            var link = $(this).find(".publisher").attr('href');
            $(this).find("a").attr({"href": link,"target":"_blank","class":"DirectLink"});
            //alert(link);
        });

    },1000);

})(jQuery);