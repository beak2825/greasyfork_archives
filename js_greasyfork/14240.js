// ==UserScript==
// @name        Hide BPL Trolls and other junk
// @namespace   ffmike
// @description Cleanup new BPL
// @grant       none
// @include     https://bplight.wpengine.com/*
// @include     https://backpackinglight.com/*
// @include     http://backpackinglight.com/*
// @version     8
// @domain      www.backpackinglight.com
// @license     CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/14240/Hide%20BPL%20Trolls%20and%20other%20junk.user.js
// @updateURL https://update.greasyfork.org/scripts/14240/Hide%20BPL%20Trolls%20and%20other%20junk.meta.js
// ==/UserScript==

// In part shamelessly based on https://greasyfork.org/en/scripts/48-maximumpc-troll-remover/code
$(function () {
    // Utility function to inject global CSS into HEAD tag
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) { return; }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
  
    // Emulate the GM_*value APIs - see https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js
    const __GM_STORAGE_PREFIX = [
       '', GM_info.script.namespace, GM_info.script.name, ''].join('***');

    function GM_deleteValue(aKey) {
     'use strict';
     localStorage.removeItem(__GM_STORAGE_PREFIX + aKey);
    }

    function GM_getValue(aKey, aDefault) {
     'use strict';
     let val = localStorage.getItem(__GM_STORAGE_PREFIX + aKey)
     if (null === val && 'undefined' != typeof aDefault) return aDefault;
     return val;
    }

    function GM_listValues() {
     'use strict';
     let prefixLen = __GM_STORAGE_PREFIX.length;
     let values = [];
     let i = 0;
     for (let i = 0; i < localStorage.length; i++) {
       let k = localStorage.key(i);
       if (k.substr(0, prefixLen) === __GM_STORAGE_PREFIX) {
         values.push(k.substr(prefixLen));
       }
     }
     return values;
    }

    function GM_setValue(aKey, aVal) {
     'use strict';
     localStorage.setItem(__GM_STORAGE_PREFIX + aKey, aVal);
    }

    function GM_getResourceURL(aName) {
     'use strict';
     return 'greasemonkey-script:' + GM_info.uuid + '/' + aName;
    }
    
    // Hide various clutter, including the subscription blocks and forum instructions
    $("#text-28").hide();      // Newsletter signup
    $("#text-29").hide();      // Footer subscription link
    $("#text-32").hide();      // How the forums work
    $("#text-34").hide();      // Sidebar subscription link
    $("#menu-item-15").hide(); // Menu subscription link
    $(".bbp-header").hide();   // Forum header
    $(".bbp-footer").hide();   // Forum footer
  
    // Hide the 'related posts' display
    addGlobalStyle('div.zem_rp_content { display: none ! important; }');
    
    // Smaller darker fonts and generally condensed presentation
    addGlobalStyle("body, #bbpress-forums, #bbpress-forums .bbp-reply-content, #bbpress-forums .bbp-reply-content p {font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-weight: 400 !important; font-size: 11px !important; color: black !important; line-height: 1.25 !important; }")
    addGlobalStyle("article.forum h1.entry-title, article.topic h1.entry-title, article.reply h1.entry-title, article.bp_members h1.entry-title {font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-size: 18px !important;color: black !important;}");
    addGlobalStyle('h1 {margin-bottom: 6px; }');
    addGlobalStyle('.entry-content code {color: black !important; }');
    addGlobalStyle('.entry-content a {color: black !important; }');
    addGlobalStyle('.entry-content a.bbp-topic-permalink {font-weight: 600 !important; }');
    addGlobalStyle('.bbp-reply-author {font-size: 8px !important; padding-bottom: 2px !important; }');
    addGlobalStyle('.bbp-reply-content {padding-bottom: 0px !important; }');
    addGlobalStyle('.bbp-author-role {font-size: 8px !important; }');
    addGlobalStyle('.bbp-user-nicename {margin-bottom: 0px !important; }');
    addGlobalStyle('.entry {margin-bottom: 2px !important; }');
    addGlobalStyle('.entry-content ol, .entry-content p, .entry-content ul, .quote-caption {margin-bottom: 3px !important;}');
    addGlobalStyle('#bbpress-forums li.bbp-body ul.forum, #bbpress-forums li.bbp-body ul.topic {padding: 2px !important;}');
    addGlobalStyle('#bbpress-forums ul.bbp-replies {font-size: 11px !important; }');
    addGlobalStyle('#bbpress-forums a.bbp-reply-permalink {margin-top: 0px !important; }');
    
    // Indent paragraphs in forums (so you can still see them with all the extra spacing stripped out)
    addGlobalStyle('.bbp-reply-content p {text-indent: 15px !important;}');
    
    // Hide uselessly small avatars on topic list
    addGlobalStyle('.bbp-topic-started-by .bbp-author-avatar, .bbp-topic-freshness-author .bbp-author-avatar {display: none !important; }');

    // Make links visible
    addGlobalStyle('a {border-bottom: .0625rem solid skyblue !important; }');

    // Much less subtle even/odd row highlighting
    addGlobalStyle('#bbpress-forums div.odd, #bbpress-forums ul.odd {background-color: rgba(83, 207, 75, 0.27) !important}');
    
    // Style for stale topic marking (see below)
    addGlobalStyle('#bbpress-forums ul.stale {background-color: rgba(185, 207, 75, 0.28) !important}');
    
    // Hide the WordPress minibar
    $('#wpadminbar').hide();

    // Get rid of some wasted space
    addGlobalStyle('html {margin-top: 0px !important; }');
    addGlobalStyle('.site-container {margin-top: 0px !important; padding-top: 2px !important; }');
    addGlobalStyle('.site-inner {padding-top: 0px !important;}');

    // Move and shrink the navigation. Best on wide screens.
    addGlobalStyle('.nav-primary {position: absolute !important; top: 0px !important; left: 0px !important;}');
    addGlobalStyle('.nav-secondary {position:absolute !important; top: 33px !important;}');
    addGlobalStyle('.genesis-nav-menu {font-size: 9px !important; }');
    addGlobalStyle('.genesis-nav-menu a {padding: 7px !important; }');
    $('.nav-menu-bpl-logo-type-bold').html('BPL');
    $('.nav-menu-bpl-logo-type-ultralight').hide();
    addGlobalStyle('span.insider-icon::before {padding-bottom: 0px !important; margin-top: -2px !important; }');
    
    // Get rid of the Gear Deals link and the horrible spinning icon with it
    $('#menu-item-3367769').hide();
    
    // Hide breadcrumbs 
    $('.bbp-breadcrumb').hide();
    
    // Shrink avatars in forums
    forumAvatars = $('.avatar-80');
    faLength = forumAvatars.length;
    for(var i=0; i<faLength; i++) {
        forumAvatars[i].setAttribute("height", "20");
        forumAvatars[i].setAttribute("width", "20");
    }
        
    // Hide forums from main page
    // Right now hiding Gear Swap posts
    $(".bbp-topic-started-in a").each(function(index, value){
       if(value.href == 'https://backpackinglight.com/forums/forum/commerce/gear-swap/') {
           $(this).closest('.topic').hide();
       }    
    });
    
    // Hide all content from known trolls
    // If there are users you don't ever want to see posts from, add their handles to this list
    //var trollList = ["tipiwalter",
    //              "rosyfinch",
    //              "redmonk"
    //             ];
    var trollList = [];
    var trollLength = trollList.length;
    var userName, ref;
        
    // Look at all the author links on the page and hide the ones from known trolls
    $(".bbp-reply-author a.bbp-author-name").each(function(index, value) 
    {
        ref = value.href;
        var pieces = ref.split('/');
        userName = pieces[pieces.length - 2];
        for(var i=0; i<trollLength; i++) 
        {
            if(userName == trollList[i])
            {
                // console.log('Hiding post from ' + userName);
                // Hide the actual post, if any (won't be any on forum index)
                var replyDiv = $(this).closest('.reply')
                replyDiv.hide();
                // Note on the post header what was just hidden.
                var replyHeaderDiv = replyDiv.prev();
                var domHeader = replyHeaderDiv.get(0);
                // If we didn't get a header, then we must be on original post in the thread
                if(typeof domHeader === 'undefined') {
                   replyDiv = $(this).closest('.topic')
                   replyDiv.hide();
                   // Note on the post header what was just hidden.
                   replyHeaderDiv = replyDiv.prev();
                   domHeader = replyHeaderDiv.get(0);
                } 
                // Clicking header alternately reveals and hides post, in case you're feeling masochistic
                domHeader.setAttribute('onclick', '$(this).next().toggle();');
                var replyDateSpan = replyHeaderDiv.children('.bbp-meta').children('.bbp-reply-post-date');
                var existingDate = replyDateSpan.html();
                replyDateSpan.html(existingDate + ' - Hidden post from ' + userName);
                
                break;
            }
        }
     });

    // Add styling to topics with no new content since last visit
    // If we're on a forum index, should be able to grab the forum ID
    if ($('ul.bbp-topics').length > 0) {
        forum_id = $('ul.bbp-topics')[0].id;

       // Figure out where we were the last time we were on this topic page
       var last_most_recent_reply = GM_getValue(forum_id + 'most_recent_reply', 0);
       // console.log(last_most_recent_reply);
    
       var most_recent_parts;
       var most_recent_reply;
       if ($('li.bbp-topic-freshness a').length > 0) {
          topic_links = $('li.bbp-topic-freshness > a');
          // If on forum index, save most recent reply ID
          // NOTE: Unfortunately we can't get the reply ID of a topic with no replies yet
          for(var i=0; i<topic_links.length; i++) {
             most_recent_parts = topic_links[i].href.split('-');
             most_recent_reply = most_recent_parts[most_recent_parts.length - 1];
             if (!isNaN(parseInt(most_recent_reply))) {
                // console.log('setting ' + most_recent_reply);
                GM_setValue(forum_id + 'most_recent_reply', parseInt(most_recent_reply));
                break;
             }
          }
        
          // Now set styling on the topics with no new replies
          for(var i=0; i<topic_links.length; i++) {
             most_recent_parts = topic_links[i].href.split('-');
             most_recent_reply = most_recent_parts[most_recent_parts.length - 1];
             if (!isNaN(parseInt(most_recent_reply))) {
                if(parseInt(most_recent_reply) <= last_most_recent_reply) {
                   topic = topic_links[i].closest('.topic');
                   domTopic = document.getElementById(topic.id);
                   current_class = domTopic.getAttribute('class')
                   domTopic.setAttribute('class', current_class + ' stale');
               }
             }
          }
       }    
    }
    
});