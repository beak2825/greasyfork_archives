// ==UserScript==
// @name         直讀台灣蘋果日報 (porting from Firefox add-ons)
// @version      1.9.0
// @namespace    https://greasyfork.org/users/291985
// @match        *://*.appledaily.com/*
// @grant        none
// @description  從Firefox套件「直讀台灣蘋果日報」移植過來的
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/381838/%E7%9B%B4%E8%AE%80%E5%8F%B0%E7%81%A3%E8%98%8B%E6%9E%9C%E6%97%A5%E5%A0%B1%20%28porting%20from%20Firefox%20add-ons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381838/%E7%9B%B4%E8%AE%80%E5%8F%B0%E7%81%A3%E8%98%8B%E6%9E%9C%E6%97%A5%E5%A0%B1%20%28porting%20from%20Firefox%20add-ons%29.meta.js
// ==/UserScript==

var PRESERVE_IDS = [
    'playerVideo',
    'video_player'
];

var PRESERVE_CLASSES = [
    'ndAritcle_headPic',
    'ndArticle_margin',
    'mediabox',
    'article-content',
    'articulum'
];

var PRESERVED_DOM_ELEMENTS = {};

function reset_overflow_mobile()
{
    document.body.style.overflowY = 'auto';
    var page_role_elements = document.querySelectorAll('[data-role="page"]');
    for (var i = 0; i < page_role_elements.length; i++) {
        page_role_elements[i].style.overflowY = 'auto';
    }
}

function stop_secret_action_mobile()
{
    var rehide_interval = XPCNativeWrapper(
        window.wrappedJSObject['contentV']
    );
    if (typeof(rehide_interval) == 'number') {
        window.clearInterval(rehide_interval);
    }
}

function reveal_content_mobile()
{
    stop_secret_action_mobile();

    var ndgPayway = document.getElementsByClassName('ndgPayway');
    for (var i = 0; i < ndgPayway.length; i++) {
        ndgPayway[i].style.display = 'none';
    }

    // Apple daily sets a timeout to disable scrolling again.
    setTimeout(function(){
        reset_overflow_mobile();
    }, 2500);
}

var debug_div = document.createElement('div');
function debug(message)
{
    var debug_p = document.createElement('p');
    var debug_message = document.createTextNode(message);
    debug_p.appendChild(debug_message);
    debug_div.appendChild(debug_p);
}

function show_debug(element)
{
    element.appendChild(debug_div);
}

function reveal_video_desktop()
{
    var video_data_json = null;
    if (PRESERVED_DOM_ELEMENTS['video_player'] !== undefined) {
        video_data_json = PRESERVED_DOM_ELEMENTS['video_player'].childNodes[0].dataset['anvp'];
    } else if (PRESERVED_DOM_ELEMENTS['playerVideo'] !== undefined) {
        video_data_json = PRESERVED_DOM_ELEMENTS['playerVideo'].childNodes[0].lastChild.dataset['anvp'];
    }

    if (video_data_json === null) {
        return;
    }

    try {
        // Reconstruct video content
        var video_data = JSON.parse(video_data_json);

        var source = document.createElement("source");
        source.src = video_data['url'];
        source.type = 'video/mp4';

        var video = document.createElement('video');
        video.style.width = video_data['width'];
        video.style.height = video_data['height'];
        video.autoplay = false;
        video.controls = true;
        video.appendChild(source);
        video.load();

        // Restore video content
        var thoracis = document.querySelector('.thoracis');
        if (thoracis != null) {
            thoracis.appendChild(video);
            return;
        }

        var ndPaywall = document.querySelector('.ndPaywall');
        debug(ndPaywall.length);
        if (ndPaywall != null) {
            ndPaywall.parentNode.insertBefore(video, ndPaywall);
            return;
        }
    } catch (e) {
        ;
    }
}

function stop_secret_action_desktop(secret_element)
{
    var parent_element = secret_element.parentNode;
    var div_element = document.createElement('div');
    div_element.style.display = 'none';

    parent_element.replaceChild(div_element, secret_element);
    div_element.appendChild(secret_element);
}

function hide_secret_tag_in_destkop_article_element(article_element)
{
    var secret_element_tag_name_regex = /[a-zA-Z0-9]{33}-[a-zA-Z0-9]{32}/;
    var element_tag_list = article_element.getElementsByTagName("*");
    for (var i = 0; i < element_tag_list.length; i++) {
        var element = element_tag_list[i];
        if (element.tagName.search(secret_element_tag_name_regex) >= 0) {
            stop_secret_action_desktop(element);
            return article_element;
        }
    }
}

function reveal_article_desktop()
{
    try {
        if (PRESERVED_DOM_ELEMENTS['ndArticle_margin'] !== undefined) {
            // Find and hide the secret element in the content to bypass content re-hide
            var article_element = hide_secret_tag_in_destkop_article_element(
                PRESERVED_DOM_ELEMENTS['ndArticle_margin']
            );
            // Restore article content
            var ndArticle_content = document.getElementsByClassName('ndArticle_content')[0];
            ndArticle_content.insertBefore(article_element,
                                           ndArticle_content.childNodes[0]);
        } else if (PRESERVED_DOM_ELEMENTS['articulum'] !== undefined) {
            // Find and hide the secret element in the content to bypass content re-hide
            var article_element = hide_secret_tag_in_destkop_article_element(
                PRESERVED_DOM_ELEMENTS['articulum']
            );
            // Restore article content
            var abdominis = document.getElementsByClassName('abdominis')[0];
            var article = abdominis.getElementsByTagName('article')[0];
            abdominis.insertBefore(article_element, article.nextSibling);
        } else if (PRESERVED_DOM_ELEMENTS['article-content'] !== undefined) {
            // Find and hide the secret element in the content to bypass content re-hide
            var article_element = hide_secret_tag_in_destkop_article_element(
                PRESERVED_DOM_ELEMENTS['article-content']
            );
            // Restore article content
            var video_player_wrap_element = article_element.getElementsByClassName('video-player-wrap');
            for (var i = 0; i < video_player_wrap_element.length; i++) {
                video_player_wrap_element[i].style.display = 'none';
            }

            var ndPaywall = document.getElementsByClassName('ndPaywall')[0];
            ndPaywall.parentNode.insertBefore(article_element, ndPaywall.nextSibling);
        }
    } catch (e) {
        ;
    }
}

function reveal_content_desktop()
{
    var ndPaywall = document.getElementsByClassName('ndPaywall');
    for (var i = 0; i < ndPaywall.length; i++) {
        ndPaywall[i].style.display = 'none';
    }

    var ndPaywallVideo = document.getElementsByClassName('ndPaywallVideo');
    for (var i = 0; i < ndPaywallVideo.length; i++) {
        ndPaywallVideo[i].style.display = 'none';
    }

    // Restore deleted content
    reveal_video_desktop();
    reveal_article_desktop();

    // Restore article head picture
    var ndAritcle_headPic = PRESERVED_DOM_ELEMENTS['ndAritcle_headPic'];
    if(typeof(ndAritcle_headPic) != 'undefined' && ndAritcle_headPic != null)
    {
        var ndArticle_contentBox = document.getElementsByClassName('ndArticle_contentBox')[0];
        ndArticle_contentBox.insertBefore(ndAritcle_headPic,ndArticle_contentBox.childNodes[0]);
    }
}

function reveal_content()
{
    // Detect site mode.
    var isMobile = document.body.classList.contains("ui-mobile-viewport") ||
                    document.body.style.overflowY != '';

    if (isMobile) {
        reveal_content_mobile();
        return;
    }

    reveal_content_desktop();
}

document.addEventListener('readystatechange', (event) => {
    if (document.readyState == "complete") {
        reveal_content();
    }
})

function preserve_node(node)
{
    for (var i = 0; i < PRESERVE_IDS.length; i++) {
        var preserve_id = PRESERVE_IDS[i];
        if (node.id == preserve_id) {
            PRESERVED_DOM_ELEMENTS[preserve_id] = node.cloneNode(true);
            PRESERVED_DOM_ELEMENTS[preserve_id].style.display = 'block';
            PRESERVED_DOM_ELEMENTS[preserve_id].style.visibility = 'visible';
            return;
        }
    }

    for (var i = 0; i < PRESERVE_CLASSES.length; i++) {
        var preserve_class = PRESERVE_CLASSES[i];
        if (node.classList.contains(preserve_class)) {
            PRESERVED_DOM_ELEMENTS[preserve_class] = node.cloneNode(true);
            PRESERVED_DOM_ELEMENTS[preserve_class].style.display = 'block';
            PRESERVED_DOM_ELEMENTS[preserve_class].style.visibility = 'visible';
            return;
        }
    }
}

var config = {childList: true, subtree: true};
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type != 'childList') {
            return;
        }

        // Preserve content node
        for (var i = 0; i < mutation.removedNodes.length; i++) {
            preserve_node(mutation.removedNodes[i]);
        }
    });
})
observer.observe(document, config);
