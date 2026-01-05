// ==UserScript==
// @name                Tumblr Reblog Fix Two
// @namespace           http://wolfspirals.tumblr.com/
// @author              gracefulally
// @version             0.8.1
// @description         Fixes reblogs to allow them to be edited (for September 2015 update)
// @include             *://www.tumblr.com/*
// @grant               none
// @copyright           2013+, Allyson Moisan
// @license             MIT License
// @supportURL          http://wolfspirals.tumblr.com/ask
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=wolfspirals@gmail.com&item_name=Greasy+Fork+donation
// @contributionAmount  $5.00
// @downloadURL https://update.greasyfork.org/scripts/12164/Tumblr%20Reblog%20Fix%20Two.user.js
// @updateURL https://update.greasyfork.org/scripts/12164/Tumblr%20Reblog%20Fix%20Two.meta.js
// ==/UserScript==

(function(){
    function RunInPage(func) {
        var s = document.createElement("script"); 
        s.textContent = "(" + func + ")();"; 
        document.body.appendChild(s);
        setTimeout(function(){document.body.removeChild(s);}, 0);
    }

    RunInPage(function(){
        var $ = jQuery;
        Tumblr.Events.listenTo(Tumblr.Events, 'postForms:opened', function(){
            var reblogs = $(".post-form .reblog-list .reblog-list-item"), doneclass = "reblogs_processed", pieces = [], result = "";
            if((reblogs.length > 0) && !(reblogs.hasClass(doneclass))) {
                reblogs.addClass(doneclass);
                var title = reblogs.find('.reblog-title');
                $(title).css("margin", "10px").css("color", "#444");
                $('.post-form--header').append(title);
                reblogs.each(function(i,v){
                    pieces.push({
                        content: $(this).find(".reblog-content").html(),
                        name: $(this).find(".reblog-tumblelog-name").text(),
                        url: $(this).find(".reblog-tumblelog-name").attr("href")
                    });
                });
                $(pieces).each(function(i,v) {
                    var reblog_content = this.content.replace("tmblr-truncated read_more_container", "");
                    if((reblog_content.length === 0) || (this.content.indexOf("</blockquote>", reblog_content.length - 13) !== -1)) {
                        result = reblog_content;
                    } else {
                        result = "<p><a class='tumblr_blog' href='" + this.url + "'>" + this.name + "</a>:</p><blockquote>" + result + reblog_content + "</blockquote>";
                    }
                });
                $(".post-form .editor-richtext").html(result + $(".post-form .editor-richtext").html());
                $(".btn-remove-trail .icon").click();
                $(".control-reblog-trail").hide();
            }
        });
    });
})();