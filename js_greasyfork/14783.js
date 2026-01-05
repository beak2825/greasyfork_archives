// ==UserScript==
// @name         Reddit Inline Comments Viewer
// @namespace    http://reddit.com
// @version      0.16
// @description  View inline Reddit threads from the front page or any subreddit.
// @author       jaszhix
// @include      http*://www.reddit.com/*
// @exclude      http*://www.reddit.com/*/*/comments/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/14783/Reddit%20Inline%20Comments%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/14783/Reddit%20Inline%20Comments%20Viewer.meta.js
// ==/UserScript==
$(document).ready(function($){
  var login = false;
  if ($('form.logout>a').length > 0) {
    login = true;
  }
  $('div>div>ul>li:nth-child(1)>a').each(function(i) {
    var post = $(this).parents().eq(3);
    var toggleButton = $('<li class="site-viewer-' + i + '"><a href="#">view thread</a><li>');
    if (login) {
      toggleButton.insertAfter(post.find('ul>li:nth-child(5)'));
    } else {
      toggleButton.insertAfter(post.find('ul>li:nth-child(2)'));
    }
    var scrollToNextPost = function(){
      var nextI = ++i;
      $('.site-viewer-' + nextI).get(0).scrollIntoView();
    };
    var insertButton = function(){
      if (login) {
        $('<button class="inline-next-post" style="position: fixed; top: 95%; left: 85%;">Next Post</button>').insertAfter(post.find('ul>li:nth-child(6)'));
      } else {
        $('<button class="inline-next-post" style="position: fixed; top: 95%; left: 85%;">Next Post</button>').insertAfter(post.find('ul>li:nth-child(3)'));
      }
      post.find('.inline-next-post').click(function() {
        scrollToNextPost();
        post.find('button').hide();
      });
    };
    var toggleButtonLink = $('.site-viewer-' + i + '>a');
    var closeThread = function(){
      toggleButtonLink.text('view thread');
      post.find('div.commentarea').hide();
      post.find('button').hide();
    };
    var viewThread = function(){
      toggleButtonLink.text('close thread');
      post.find('button').show();
      post.find('div.commentarea').show();
    };
    $('.site-viewer-' + i).click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (toggleButtonLink.text() === 'close thread') {
        closeThread();
      } else {
        if (post.find('div.commentarea').length > 0) {
          viewThread();
        } else {
          toggleButtonLink.text('loading...');
          $('<iframe />').attr({
            'src': $(this).attr('href'),
            'frameborder': '0',
            'width': window.innerWidth / 1.2,
            'height': window.innerHeight
          }).appendTo(post);
          var iframe = post.find('iframe');
          iframe.hide();
          iframe.on('load', function() { 
            toggleButtonLink.text('close thread');
            if ($('.inline-next-post').length > 0) {
              $('.inline-next-post').hide();
            }
            insertButton();
            iframe.contents().find('div.commentarea').appendTo(post);
            iframe.remove();
            $('<li class="inline-close-thread"><a href="#">close thread</a><li>').appendTo(post.find('div.commentarea'));
            $('.inline-close-thread').click(function(e){
              e.preventDefault();
              e.stopPropagation();
              closeThread();
              $('.site-viewer-' + i).get(0).scrollIntoView();
            });
          });
        }
      }
    }.bind(this));
  });
});