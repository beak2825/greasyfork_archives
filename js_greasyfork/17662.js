// ==UserScript==
// @name         Xtube Enhancer - Animated Thumbnails, Inline Video Loading, and Sponsor/Premium-Free Videos
// @description  Animates thumbnails, inlines video loading, and cleans up sponsored content
// @namespace    xtube
// @version      1.0.1
// @include      http*://www.xtube.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash-compat/3.10.1/lodash.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/17662/Xtube%20Enhancer%20-%20Animated%20Thumbnails%2C%20Inline%20Video%20Loading%2C%20and%20SponsorPremium-Free%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/17662/Xtube%20Enhancer%20-%20Animated%20Thumbnails%2C%20Inline%20Video%20Loading%2C%20and%20SponsorPremium-Free%20Videos.meta.js
// ==/UserScript==
$(document).ready(function() {
  $('div.advertisement').remove();
  $('a.clearfix').remove();
  $('li.pull-right').remove();
  $('h2.h1').remove();
  $('section.overviewPage>div:nth-child(5)').remove();
  // Remove premium content in index.
  $('div.col-xs-24>ul>li').each(function() {
    if ($(this).find('article>a>span>span').text() === 'Premium') {
      $(this).remove();
    }
  });
  // Remove sponsored content in index.
  $('section.overviewPage>div>ul>li').each(function() {
    if ($(this).find('article>dl>dd>a').text() === 'xtube_sponsor') {
      $(this).remove();
    }
  });
  // Remove sponsored content in search results.
  $('section.row>div>div>ul>li').each(function() {
    if ($(this).find('article>dl>dd>a').text() === 'xtube_sponsor') {
      $(this).remove();
    }
  });
  // Remove premium content below query index.
  $('div.mainContent>ul>li').each(function() {
    if ($(this).find('article>a>span>span').text() === 'Premium' || $(this).find('article>a>div>span>span').text() === 'Premium') {
      $(this).remove();
    }
  });
  // Remove sponsored content beside video player.
  var relatedVideos = null;
  $('div#related_videos>div').each(function() {
    relatedVideos = $(this).text().split(' ');
    for (var i = relatedVideos.length - 1; i >= 0; i--) {
      if (relatedVideos[i] === '0:15') {
        $(this).prev().remove();
        $(this).remove();
      }
    }
  });
  // Remove sponsored content below video player.
  $('div#watchPageLeft>div>div').each(function() {
    if ($(this).find('a>span:nth-child(3)').text() === '0:15') {
      $(this).remove();
    }
  });
  // Remove sponsored content in full related videos view.
  $('div.Card-list>article').each(function() {
    if ($(this).find('div>div>div:nth-child(3)').text() === '0:15') {
      $(this).remove();
    }
  });
  // New sponsored content formatting
  $('#mainSection > section > div > ul > li').each(function() {
    if ($(this).find('article > a:nth-child(1) > div > span.metaInfo > span.premiumLabel').text().includes('Premium')) {
      $(this).remove();
    }
  });
  $('#mainSection > section > div > div > ul > li').each(function() {
    if ($(this).find('article > a.userLink.ellipsis').text().includes('xtube_sponsor')) {
      $(this).remove();
    }
  });
  $('#mainSection > section > div.mainContent > ul > li').each(function() {
    if ($(this).find('article > a.userLink.ellipsis').text().includes('xtube_sponsor')) {
      $(this).remove();
    }
  });
  $('#mainSection > section > div > div > ul > li').each(function() {
    if ($(this).find('article > a > div > span.metaInfo > span').text().includes('Premium')) {
      $(this).remove();
    }
  });
  $('#mainSection > div > div > section.cntPanel > article.box.contentInfo.hasButtonFooter').insertAfter('#mainSection > div > div > section.cntPanel > div.playerWrapper.videoWrapper');
  var cleanVidPage = function() {
    $('#mainSection > div > aside > div.cntPanel').remove();
    $('#mainSection > div > div > section.cntPanel > div.ujbf8hlZW8DTpdFW4aoF.onderSellamPlayer').remove();
  };
  cleanVidPage();
  var animateThumbnails = function(selector){
    var content = $(selector);
    if (content.length > 0) {
      content.each(function(i, el) {
        var clone = $(el).clone();
        clone.insertBefore($(el));
        $(el).hide();
        var animation = [];
        var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg'];
        var src = $(this).attr('src').split('/');
        if (_.last(src).length <= 6) {
          var src3 = _.without(src, _.last(src));
          var imgSrc = src3.join('/') + '/';
          for (var z = 0; z < images.length; z++) {
            animation.push(imgSrc + images[z]);
          }
          var n = -1;
          var animate = function() {
            clone.attr({
              src: animation[++n]
            });
            if (n === 14) {
              n = -1;
            }
            setTimeout(animate, 500);
          }.bind(this);
          animate();
        }
      });
    }
  };

    // Animate thumbnails
  _.delay(function() {
    animateThumbnails('div.mainContent>ul>li>article>a>div>div>img');
    animateThumbnails('[id*="vid_id_"]');
    animateThumbnails('[id*="2_frame"]> a > img');
    animateThumbnails('#tabMorefromthisuser > ul > li > article > a > div > div > img');
    animateThumbnails('#mainSection > div > div > div > ul > li > article > a > div > div > img');
    animateThumbnails('#contentVideos > div > div > ul > li > article > a > div > div.imageWrapper.video > img');
  }, 2000);
  var related = $('#tabMorefromthisuser > ul > li > article > a');
  var more = $('#mainSection > div > div > div > ul > li > article > a');
  var inlineVids = function(opt) {
    if (opt.length > 0) {
      opt.each(function(i, el) {
        $(el).click(function(e) {
          e.preventDefault();
          var vid = $('#mainSection > div > div > section.cntPanel > div.playerWrapper.videoWrapper');
          var pageLeftClone = $('#mainSection > div > div > div').clone();
          vid.empty();
          $('<iframe />').attr({
            'src': $(el).attr('href'),
            'frameborder': '0',
            'width': window.innerWidth / 1.2,
            'height': window.innerHeight
          }).appendTo(vid);
          var iframe = vid.find('iframe');
          iframe.hide();
          iframe.on('load', function() {
            iframe.contents().find('#mainSection > div > div > section.cntPanel > div.playerWrapper.videoWrapper').appendTo(vid);
            pageLeftClone.children().appendTo('#mainSection > div > div > div');
            iframe.contents().find('#mainSection > div > aside > div > div').children().appendTo('#mainSection > div > aside > div > div');
            iframe.remove();
            inlineVids($('#tabMorefromthisuser > ul > li > article > a'));
            inlineVids($('#mainSection > div > div > div > ul > li > article > a'));
            animateThumbnails('#tabMorefromthisuser > ul > li > article > a > div > div > img');
            animateThumbnails('#mainSection > div > div > div > ul > li > article > a > div > div > img');
            cleanVidPage();
          });
        });
      });
    }
    
  };
  inlineVids(related);
  inlineVids(more);
});
