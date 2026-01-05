// ==UserScript==
// @name          Youtube Load All Comments
// @originalAuthor		  Flipperbw
// @EditedBy    ZELL
// @version       1.1.2
// @include       /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/
// @require        http://code.jquery.com/jquery-latest.min.js
// @description loads youtubers comments and expands them
// @namespace https://greasyfork.org/users/12403
// @downloadURL https://update.greasyfork.org/scripts/26703/Youtube%20Load%20All%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/26703/Youtube%20Load%20All%20Comments.meta.js
// ==/UserScript==

console.log('Youtube Load All Comments GM Script has loaded.');

var com_target = document.querySelector('#watch-discussion');
var load_all_clicked = false;
var discon = false;

var com_div = '<div id="load_all_comments" style="float: right; cursor: pointer"></div>';
var com_text = 'Show All';
var loading_text = '<span class="yt-spinner"><span class="yt-spinner-img yt-sprite" title="Loading icon"></span>Loading...</span>';
var all_com_div = $(com_div);
all_com_div.html(com_text);

var sep = $('<div style="float: right">&nbsp;|&nbsp;</div>');

var expand_div = '<div id="exp_all_comments" style="float: right; cursor: pointer"></div>';
var expand_text = 'Expand';
var expand_loading_text = '<span class="yt-spinner"><span class="yt-spinner-img yt-sprite" title="Loading icon"></span>Expanding...</span>';
var expand_com_div = $(expand_div);
expand_com_div.html(expand_text);

var clickon = function () {
    all_com_div.unbind("click");
    console.log('clicking');
    load_all_clicked = true;
    com_observer.disconnect();
    all_com_div.html(loading_text);
    all_com_div.click(clickoff);
    com_observer.observe(com_target, com_config);
    click_button();
};

var clickoff = function() {
    all_com_div.unbind("click");
    console.log('stopping clicking');
    com_observer.disconnect();
    all_com_div.html(com_text);
    all_com_div.click(clickon);
};

all_com_div.click(clickon);

expand_com_div.click(function() {
    com_observer.disconnect();
    expand_com_div.html(expand_loading_text);
    expand_all();
    expand_com_div.html(expand_text);
});

var com_observer = new MutationObserver(function(mutations) {
    var button_found = false;
    mutations.forEach(function(mutation) {
        var added_nodes = mutation.addedNodes;
        if (added_nodes && added_nodes.length && (added_nodes.length > 0)) {
            for (i = 0; i < added_nodes.length; ++i) {
                var n = added_nodes[i];
                if (n.id == 'comment-section-renderer') {
                    console.log('Adding all comments link...');
                    var comments_text = $('.comment-section-header-renderer');
                    if (comments_text) {
                        com_observer.disconnect();
                        comments_text.append(all_com_div);
                        comments_text.append(sep);
                        comments_text.append(expand_com_div);
                        console.log('Added links.');
                        com_observer.observe(com_target, com_config);
                    }
                    button_found = true;
                    break;
                }
                else if (n.type == 'button' && (n.className.indexOf('comment-section-renderer-paginator') > -1) && load_all_clicked) {
                    button_found = true;
                    click_button();
                    break;
                }
            }
        }
    });

    if (!button_found && load_all_clicked) {
        com_observer.disconnect();
        expand_all();
        console.log('Finished loading comments.');
        all_com_div.html(com_text);
    }
});

function expand_all() {
    
    console.log('Expanding all comments');
    var expanders = $('button.comment-replies-renderer-paginator');
    $.each(expanders, function(k,v) {
        v.click();
    });
	console.log('Showing Full comments');
	var expanders2 = $('div.read-more > button');
    $.each(expanders2, function(k,v) {
        v.click();
    });
    console.log('Finished expanding.');
}

function click_button() {
    var target = document.querySelector('button.comment-section-renderer-paginator');
    if (target) {
        target.click();
    }
    else {
        all_com_div.html(com_text);
    }
}

var com_config = { attributes: false, childList: true, characterData: false, subtree: true };

com_observer.observe(com_target, com_config);