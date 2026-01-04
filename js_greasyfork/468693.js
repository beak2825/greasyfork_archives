// ==UserScript==
// @name         Fitgirl [ Youtube Preview ]
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      3.6
// @description  adds YouTube Gameplay, YouTube Review and Engine links below video game titles, easily watch a video or review of the game before playing it
// @include      https://fitgirl-repacks.site/*
// @include      https://duckduckgo.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=fitgirl-repacks.site
// @downloadURL https://update.greasyfork.org/scripts/468693/Fitgirl%20%5B%20Youtube%20Preview%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/468693/Fitgirl%20%5B%20Youtube%20Preview%20%5D.meta.js
// ==/UserScript==
/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){

    function videoize(){
        $('.nframe').remove() 
        $('br').remove() 
        $('article').each(function(index, value) {
            var x = $(this).find('.entry-title')
            var x2 = $(x).text()

            var regex1 = /^(.*?)(?=\s+–)/;
            var regex2 = /^(.*?)(?=\s+\+)/;
            var result = x2.match(regex1);

            if(result === null){
                result = x2.match(regex2);
                if(result === null){
                    console.log('result1='+result)
                    var x3 = encodeURIComponent(x2)
                    } else {
                        result = result[1];
                        console.log('result2='+result)
                        x3 = encodeURIComponent(result)
                    }
            } else {
                result = result[1];
                console.log('result3='+result)
                x3 = encodeURIComponent(result)
            }


            $('<br>').insertAfter(x)
            var urlish3 = 'https://duckduckgo.com/?hps=1&q=%21+site%3Asteamdb.info+' + x3
            $('<br><span class="entry-meta"><span class="tag-links"><a rel="tag" class="nframe" href=' + urlish3 + '>[ Engine ]</div>').addClass('a').insertAfter(x)
            var urlish2 = 'https://duckduckgo.com/?hps=1&q=%21+site%3Ayoutube.com+' + x3 + '+review+video+game'
            $('<br><span class="entry-meta"><span class="tag-links"><a rel="tag" class="nframe" href=' + urlish2 + '>[ YouTube Review ]</div>').addClass('a').insertAfter(x)
            var urlish = 'https://duckduckgo.com/?hps=1&q=%21+site%3Ayoutube.com+' + x3 + '+gameplay+video+game'
            $('<span class="entry-meta"><span class="tag-links"><a rel="tag" class="nframe" href=' + urlish + '>[ YouTube Gameplay ]</div>').addClass('a').insertAfter(x)


            $(".nframe").click(function (e) {
                e.preventDefault();
                var url = $(this).attr("href");
                console.log('url='+url)
                var width = screen.width * 0.75;
                var height = screen.height * 0.75;
                var left = (screen.width - width) / 2;
                var top = (screen.height - height) / 2;
                var params = 'width=' + width + ', height=' + height;
                params += ', top=' + top + ', left=' + left;
                params += ', directories=no';
                params += ', location=no';
                params += ', menubar=no';
                params += ', resizable=yes';
                params += ', scrollbars=no';
                params += ', status=no';
                params += ', toolbar=no';
                var newwin = window.open(url, 'subpop', params);
                if (window.focus) {
                    newwin.focus()
                }
                return false;
            })
        });
    }

    videoize()
    //setInterval(videoize, 2000)

    var str = document.title
    const regex = /^! site:youtube\.com/;
    const regex2 = /^! site:steamdb\.info/;


    if(window.location.host=='duckduckgo.com'){
        setInterval(function(){
            $("#search_form > div > div > div > div > div > button").click()
        }, 1000);
    }  

})(jQuery);