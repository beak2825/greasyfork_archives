// ==UserScript==
// @name            Weibo Big Picture (新浪微博查看大图)
// @namespace       https://github.com/adelabs
// @description     New buttons for opening full sized pictures in new background tabs. Add "href" attributes to "Full size"/"查看大图"/"查看大圖" anchors so that you can mid-click or right-click them with more options.
// @version         4.6
// @license         GPL version 3
// @include         *://weibo.com/*
// @require         http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant           GM_openInTab
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/2121/Weibo%20Big%20Picture%20%28%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E6%9F%A5%E7%9C%8B%E5%A4%A7%E5%9B%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2121/Weibo%20Big%20Picture%20%28%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E6%9F%A5%E7%9C%8B%E5%A4%A7%E5%9B%BE%29.meta.js
// ==/UserScript==

/*
 *
 * Download
 *  https://github.com/adelabs/user.js/raw/master/weibo_big_picture.user.js
 * GitHub
 *  https://github.com/adelabs/user.js/blob/master/weibo_big_picture.user.js
 * Greasy Fork
 *  https://greasyfork.org/en/scripts/2121
 */

function initialize() {
    console.log('initialize', location.href);
    if ($('.WB_feed:not(.adelabs)').length == 0) { return false; }
    // Observe post list loading
    $('.WB_feed').each(function(i, o){
        console.log('observe', o);
        $(o).addClass('adelabs');
        var observer = new MutationObserver(function(mutations) {
            console.log('mutation', o);
            run();
        });
        observer.observe(o, {childList: true});
    });
    // Launch!
    run();
    return true;
}

var href = '';
setInterval(function() {
    if (location.href != href) {
        if (initialize()) {
            href = location.href;
        }
    }
}, 1000);

function run() {
    console.log('run');
    // Create open-in-background buttons for thumbnails.
    $('ul.WB_media_a:not(.adelabs)').each(function(i, list){
        $(list).addClass('adelabs');
        // Get one href for each thumbnail.
        var hrefs = [];
        $(list).find(
                     'li[action-type="feed_list_media_img"] > img' + // single pic
                     ',' +
                     'li[action-type="fl_pics"] > img' + // multiple pic
                     '').each(function(){
            hrefs.push(get_href_from_bigcursor($(this)));
        });
        // One button for each thumbnail.
        for (var i=0; i<hrefs.length; ++i) {
            var button = create_button((i+1).toString(), [hrefs[i]]);
            $(list).before(button).before(' ');
        }
        // One extra button for all.
        if (hrefs.length > 1) {
            var button = create_button('all', hrefs);
            $(list).before(button);
        }
    });
    
    // Observe all "Full size" anchors and create buttons for them.
    $('div.WB_expand_media_box:not(.adelabs)').each(function(i, expand){
        $(expand).addClass('adelabs');
        // Each time a mid sized pic is expanded,
        var observer_for_expand = new MutationObserver(function(mutations) {
            // for its "Full size" anchor,
            $(expand).find('a[action-type="widget_photoview"]').each(function(i, show_big){
                // set its href and add a new button
                function update(show_big) {
                    href = get_href_from_show_big(show_big);
                    if (show_big.attr('href') == href) { return; }
                    show_big.attr('href', href);
                    show_big.parent().find('a.adelabs').remove();
                    var button = create_button('Open', [href]);
                    show_big.after(button);
                    button.hide().show(50);
                }
                update($(show_big));
                // Observe it and update it again when it changes.
                var observer_for_show_big = new MutationObserver(function(mutations) {
                    update($(show_big));
                });
                observer_for_show_big.observe(show_big, {attributes:true, 
                                                         attributeFilter: ['action-data']});
            });
        });
        observer_for_expand.observe(expand, {childList: true});
    });
}

// Create a button which opens `hrefs` in backgroud tabs when clicked.
function create_button(text, hrefs) {
    var a = $('<a class="S_txt1 adelabs"><em class="W_new_count">' + text + '</em></a>');
    return a.click(function(e){
        for (var i=0; i<hrefs.length; ++i) {
            GM_openInTab(hrefs[i], true);
        }
    });
}
function get_href_from_show_big(show_big) {
    var action_data = $(show_big).attr('action-data');
    var pid = action_data.replace(/.*\bpid=(\w+).*/, '$1');
    var href = '//ww3.sinaimg.cn/large/' + pid;
    return href;
}
function get_href_from_bigcursor(bigcursor) {
    var src = bigcursor.attr('src');
    var basename = src.replace(/.*\//, '');
    var href = '//ww3.sinaimg.cn/large/' + basename;
    return href;
}
