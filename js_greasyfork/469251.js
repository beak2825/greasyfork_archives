// ==UserScript==
// @name         Raddle.me: Larger thumbnails; view without reload. REQUIRES SEPARATE USERSTYLE, see description!
// @namespace    https://raddle.me/
// @match        https://raddle.me/
// @match        https://raddle.me/f/*
// @grant        GM_xmlhttpRequest
// @version      1.1.5
// @author       hyacinth
// @homepageURL  https://raddle.me/f/lobby/161483
// @description  Roughly mimics the current Reddit UI, with large thumbnails, and opening posts without reloading the page. Requires the accompanying CSS at https://userstyles.world/style/10530/raddle-me-styles-for-larger-thumbnail-userscript
// @license      CC Zero (public domain)
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/469251/Raddleme%3A%20Larger%20thumbnails%3B%20view%20without%20reload%20REQUIRES%20SEPARATE%20USERSTYLE%2C%20see%20description%21.user.js
// @updateURL https://update.greasyfork.org/scripts/469251/Raddleme%3A%20Larger%20thumbnails%3B%20view%20without%20reload%20REQUIRES%20SEPARATE%20USERSTYLE%2C%20see%20description%21.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Make thumbnails larger
  $('.submission__inner').each(function(index, element) {
    let thumbnailElement = $(element).find('.submission__thumb');
    let thumbnail = thumbnailElement.attr('src');
    if (thumbnail) {
      let link = $(element).find('.submission__link');
      let postUrl = link.attr('href');
      let imageFilename = thumbnail.split('/').pop();
      let imageUrl = `https://raddle.me/submission_images/${imageFilename}`;
      $(element).find('.submission__header').after(`<a href="${postUrl}" target="_blank" class="postImageLink"><div class="postImageCard"><img src="${imageUrl}" alt="" loading="lazy"></div></a>`);
      thumbnailElement.addClass('displayNone');
      $(element).addClass('paddingLeft0');
    }
  });

  // Post overlay

  let body = $('body');

  let closeOverlay = function() {
    postOverlay.removeClass('postOverlayLoading');
    body.removeClass('postOverlayLoadingBody');
    $('.postOverlay').remove();
    body.removeClass('postOverlayOpen');
    $('html').scrollTop(body.attr('data-savedScrollPosition'));
    history.pushState({}, "", originalUrl);
  };

  // This closes the overlay when clicking outside of it.
  let clickHandler = function(event) {
    let clicked = $(event.target);
    let clickedArrowButton = clicked.is('main > nav a span.icon--circled');
    let clickedOutsideContent = clicked.is('body') || clicked.is('.site-content') || clicked.is('.postOverlay') || clickedArrowButton || clicked.is('main > nav > ul');
    if (clickedArrowButton) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (clickedOutsideContent && body.hasClass('postOverlayOpen')) {
      let post = $('.postOverlay');
      if (post.find('textarea').filter((index, element) => $(element).val()).length && !confirm('It looks like you have a draft comment, are you sure you would like to close the post? Your comment will not be saved.')) {
        return;
      }
      post.remove();
      $('.postOverlay').remove();
      body.removeClass('postOverlayOpen');
      $('html').scrollTop(body.attr('data-savedScrollPosition'));
      history.pushState({}, "", originalUrl);
    }
  };

  // Show the overlay
  let originalUrl = window.location.href;
  $('.submission:not(.submission--expanded) .submission__link, .submission:not(.submission--expanded) .submission__nav a, .submission:not(.submission--expanded) .postImageLink').on('click', function(event) {
    event.preventDefault();
    $('.postOverlay').remove();
    history.pushState({}, "", originalUrl);
    let link = $(event.target).parents('.submission').find('.submission__nav').find('a.text-sm');
    let postUrl = link.attr('href');
    let scrollPosition = $('html').scrollTop();
    body.attr('data-savedScrollPosition', scrollPosition);
    body.after(`<div class="postOverlay postOverlayLoading"><h1>Loading...</h1></div>`);
    let postOverlay = $('.postOverlay');
    postOverlay.on('click', clickHandler);
    body.addClass('postOverlayOpen postOverlayLoadingBody');
    // This is a userscript-specific function. It would need to use normal XMLHttpRequest if not running in a userscript.
    GM_xmlhttpRequest ({
      method: "GET",
      url:    postUrl,
      onload: function(result) {
        postOverlay.removeClass('postOverlayLoading');
        body.removeClass('postOverlayLoadingBody');
        history.pushState({}, "", postUrl);
        $('.postOverlayOpen').first()[0].scrollIntoView();
        window.scrollTo({
          top: $('.site-nav').first().height()
        });
        postOverlay.html(result.responseText);
      },
      onerror: closeOverlay,
      onabort: closeOverlay,
      ontimeout: closeOverlay
    });
  });
})();
