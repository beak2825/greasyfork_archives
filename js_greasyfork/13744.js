// ==UserScript==
// @name        WaniKani Post Search Direct Link
// @namespace   rfindley
// @description Adds direct links to Post Search results to go directly to post, instead of topic.
// @version     1.0.3
// @include     https://www.wanikani.com/*
// @exclude     https://www.wanikani.com/lesson*
// @exclude     https://www.wanikani.com/review*
// @copyright   2015+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13744/WaniKani%20Post%20Search%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/13744/WaniKani%20Post%20Search%20Direct%20Link.meta.js
// ==/UserScript==

wkgotopost = {};

(function(gobj) {
    if (typeof $ === 'undefined') return;

    var observer;

    //-------------------------------------------------------------------
    // Process a clicked link
    //-------------------------------------------------------------------
    function link_clicked(e) {
        e.preventDefault();
        var target = $(e.target);
        var post = target.closest('tr[id^="post"]');
        var pid = post.attr('id');
        target.html('one moment...');

        var base_url = target.closest('.related-topic').find('a:nth(0)').attr('href');
        var pdate = (new Date(post.find('.timeago:nth(0)').attr('datetime'))).getTime();
        var first_page = 1;
        var last_page = 1;
        var max_depth = 14;

        function find_post(pgnum) {
            var pgurl = base_url+'/page/'+pgnum;
            $.get(pgurl, function(page){
                var pg = $(page);
                if (pgnum == 1) {
                    var last_elem = pg.find('.multi-page li:last a');
                    if (last_elem.length > 0)
                        last_page = Number(last_elem.attr('href').split('/').pop());
                    gobj.last_page = last_page;
                }
                if (pg.find('tr[id="'+pid+'"]').length > 0) {
                    target.off('click');
                    target.attr('href', pgurl+'#'+pid);
                    target.html('click to go');
                } else {
                    if (pgnum != 1) {
                        var sdate = (new Date(pg.find('tr[id^="post"] .timeago:first-child').slice(-1).attr('datetime'))).getTime();
                        if (pdate < sdate)
                            last_page = pgnum-1;
                        else
                            first_page = pgnum+1;
                    }
                    if (max_depth-- > 0)
                        find_post(Math.ceil((first_page+last_page)/2));
                    else
                        console.log('Oops.. too many searches!');
                }
            });
        }
        find_post(1);
    }

    //-------------------------------------------------------------------
    // Process DOM changes due to search, adding link to each post.
    //-------------------------------------------------------------------
    function search_mutation(mutation_list) {
        for (var m_idx = 0; m_idx < mutation_list.length; m_idx++) {
            var added_nodes = mutation_list[m_idx].addedNodes;
            for (var n_idx = 0; n_idx < added_nodes.length; n_idx++) {
                var addition = $(added_nodes[n_idx]);
                if (!addition.hasClass('forum')) continue;
                $('<span class="gotopost">(<a href="javascript(void);">get link</a>)</span>').insertAfter(addition.find('tr[id^="post"] .related-topic>a'));
                addition.find('.gotopost a').on('click', link_clicked);
            }
        }
    }

    //-------------------------------------------------------------------
    // Add a <style> section to the document.
    //-------------------------------------------------------------------
    function addStyle(aCss) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }

    //-------------------------------------------------------------------
    // Startup. Runs at document 'load' event.
    //-------------------------------------------------------------------
    function startup() {
        var elem = $('.search-results')[0];
        if (elem === undefined) return;
        addStyle('.gotopost {margin-left:10px;font-size:smaller;} .gotopost a {text-decoration:underline;}');
        observer = new MutationObserver(search_mutation);
        observer.observe(elem, {
            subtree: true,
            childList: true
        });
    }

    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener("load", startup);

})(wkgotopost);
