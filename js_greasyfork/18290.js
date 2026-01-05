// ==UserScript==
// @name        gleam.io finder
// @namespace   https://greasyfork.org/users/726
// @description gleam.io
// @author      Deparsoul
// @include     https://www.reddit.com/search*
// @include     https://steamcn.com/f319-1
// @icon        https://gleam.io/favicon.ico
// @version     20170101
// @run-at      document-end
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/18290/gleamio%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/18290/gleamio%20finder.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

setTimeout(function(){
    location.reload();
}, 100*1000);

(function($, href){

    var visits = 0;

    function log(msg){
        console.log('%c [gleam.io finder] ', 'background:linear-gradient(to right,#f36a22,#f3852f,#f2c32e,#cbdc38,#b5d66d,#69c5e4,#6d9fd5)', msg);
    }

    function queue_get(){
        var queue = JSON.parse(GM_getValue('queue', '[]'));
        var url = false;
        log('queue length: '+queue.length);
        if(queue.length>0){
            url = queue.shift();log('get from queue: '+url);
            GM_setValue('queue', JSON.stringify(queue));
        }
        return url;
    }
    function queue_add(url){
        var queue = JSON.parse(GM_getValue('queue', '[]'));
        queue.push(url);log('add to queue: '+url);
        GM_setValue('queue', JSON.stringify(queue));
    }

    function gleam(href){
        if(!href)
            return;
        href = href.replace(/gleam\.io\/rewards\/([^-]{5})-/g, "gleam.io/$1/");
        var id = href.match(/gleam\.io\/([^\/]+)\//);
        if(!(id&&id[1]))
            return;
        id = id[1];
        id = 'G-'+id;
        var status = GM_getValue(id, 'N');
        if(status=='V'){
            log(id+' already visited');
            return;
        }
        if(visits<1){
            log(id+' open');
            window.open(href);
            ++visits;
            GM_setValue(id, 'V');
        }else if(status=='N'){
            queue_add(href);
            GM_setValue(id, 'Q');
        }
    }

    log(new Date().toLocaleString());
    gleam(queue_get());

    if(href.match(/www\.reddit\.com\/search.*gleam/)){
        //https://www.reddit.com/search?q=site%3Agleam.io+subreddit%3A%28FreeGamesOnSteam+OR+FreeGames+OR+FreeGameFindings%29&sort=new&restrict_sr=&t=day
        $('a.search-link[href^="https://gleam.io/"]').each(function(){
            gleam($(this).attr('href'));
        });
    }else if(href == 'https://steamcn.com/f319-1'){
        var last = GM_getValue('last_tid', 177000);
        //last = 177000;
        var max = last;
        $('#threadlisttableid>tbody>tr>th>a.s.xst').each(function(){
            var thread = $(this).attr('href');
            var tid = parseInt(thread.match(/t(\d+)/)[1]);
            if(tid<=last)
                return;
            if(tid>max)
                max = tid;
            log('check t'+tid);
            $.get(thread, function(html){
                var reg = /https:\/\/gleam\.io\/[^\/]+\//g;
                var match = reg.exec(html);
                while (match != null) {
                    gleam(match[0]+'-')
                    match = reg.exec(html);
                }
            });
        });
        log('last_tid = '+max);
        GM_setValue('last_tid', max);
    }

})(jQuery, location.href);