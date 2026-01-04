// ==UserScript==
// @name         click x button to remove a post for PC and mobile tumblr
// @description  点击x按钮移除一个tumblr帖子
// @version      0.1
// @include      http://*.tumblr.com/*
// @include      https://*.tumblr.com/*
// @author       yechenyin
// @namespace    https://greasyfork.org/users/3586-yechenyin
// @require  	   https://code.jquery.com/jquery-1.11.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/40443/click%20x%20button%20to%20remove%20a%20post%20for%20PC%20and%20mobile%20tumblr.user.js
// @updateURL https://update.greasyfork.org/scripts/40443/click%20x%20button%20to%20remove%20a%20post%20for%20PC%20and%20mobile%20tumblr.meta.js
// ==/UserScript==

jQuery.fn.inserted = function(action) {
  var selector = this.selector;
  if ($(selector).length > 0) {
    console.log($(selector).length + ' ' + selector + " is loaded at begin");
    action.call($(selector));
  }
  var reaction = function(records) {
    records.map(function(record) {
      if (record.target !== document.body && $(record.target).find(selector).length) {
        if (record.target.id)
          console.log('#' + record.target.id + ' which contains ' + selector + ' is loaded');
        else if (record.target.className)
          console.log('#' + record.target.className + ' which contains ' + selector + ' is loaded');
        else
          console.log('#' + record.target.tagName + ' which contains ' + selector + ' is loaded');
        //if (trigger_once)
        //observer.disconnect();
        action.call($(record.target).find(selector));
      }
    });
  };

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  if (MutationObserver) {
    var observer = new MutationObserver(reaction);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    //setInterval(reaction, 100);
  }
};

if ($('body').hasClass('is_mobile')) {
$('head').append($('<style>', {
  class: 'close_button_css',
  text: `
            .post-close:before {
                content: "\\EA1E";
                font-family: tumblr-icons,Blank;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
                font-style: normal;
                font-variant: normal;
                font-weight: 400;
                text-decoration: none;
                text-transform: none;
            }.post-close {
                position: absolute;
                top: 10px;
                right: 14px;
                opacity: 0.3;
                width: 20px;
                height: 20px;
                font-size: 24px;
                line-height: 1;
                overflow: hidden;
                text-decoration: none;
            }
              `
}));

  $('.mh_post_page').inserted(function() {
    $(this).find(".mh_post_head").append($('<a class="post-close"></a>').click(function() {
        $(this).parent().parent().remove();
    }));
  });
} else {
$('head').append($('<style>', {
  class: 'close_button_css',
  text: `
            .post-close:before {
                content: "\\EA1E";
                font-family: tumblr-icons,Blank;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
                font-style: normal;
                font-variant: normal;
                font-weight: 400;
                text-decoration: none;
                text-transform: none;
            }.post-close {
                position: absolute;
                top: -2px;
                right: 10px;
                opacity: 0.3;
                width: 20px;
                height: 20px;
                font-size: 20px;
                line-height: 1;
                overflow: hidden;
                text-decoration: none;
            }
              `
}));

  $(".post_wrapper, .post_container").inserted(function() {
    $(this).find(".post_header").append($('<a class="post-close"></a>').click(function() {
        $(this).parent().parent().parent().parent().remove();
    }));
  });
}
