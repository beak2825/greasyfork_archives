// ==UserScript==
// @name          New Filtered Netflix
// @namespace     http://www.netflix.com/
// @author        Nigel Fish | http://nigelfish.com/
// @license       Creative Commons BY-NC-SA
// @version       0.5
// @description   A replacement for the filtered Netflix of the past. I got around the now lack of Netflix API by checking the boxes that popup and looking for a rating, and then saving the info into localStorage. Thus, it will not filter things until you've hovered over them once.
// @homepage      https://github.com/dphrag/new-filtered-netflix
// @encoding      utf-8
// @match         http://*.netflix.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/4793/New%20Filtered%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/4793/New%20Filtered%20Netflix.meta.js
// ==/UserScript==

$(document).ready(function() {

  function hideThatTitleYo(title) {
    var selector = 'img[alt="' + title + '"]';
    $(selector).css({
      '-webkit-filter': 'grayscale(100%)',
      '-moz-filter': 'grayscale(100%)',
      '-o-filter': 'grayscale(100%)',
      '-ms-filter': 'grayscale(100%)',
      'filter': 'grayscale(100%)',
      'opacity': '0.4'
    });
  }

  var titles = JSON.parse(localStorage.getItem("filteredTitlesYo"));
  if (titles === null) {
    titles = {};
  } else {
    //loop and hide
    for (var key in titles) {
      hideThatTitleYo(key);
    }
  }
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

  // create an observer instance
  var observerBobMovie = new MutationObserver(function(mutations) {
    var bobContent = $('.bobContent');
    var bobTitle = bobContent.find('.bobMovieHeader .title').html();
    if (bobTitle != undefined) bobTitle = bobTitle.trim();
    //check if movie watched
    if (bobContent.find('.sbmfrt').length != 0) {
      //store locally that it was watched and shade image
      titles[bobTitle] = true;
      localStorage.setItem("filteredTitlesYo", JSON.stringify(titles));
      hideThatTitleYo(bobTitle);
    }
  });

  var observerBobContainer = new MutationObserver(function(mutations) {
    var bobContent = $('#bob');
    var bobTitle = bobContent.find('.bob-header .title').html();
    if (bobTitle != undefined) bobTitle = bobTitle.trim();
    //check if movie watched
    if (bobContent.find('.starbar').data('your-rating') != "") {
      //store locally that it was watched and shade image
      titles[bobTitle] = true;
      localStorage.setItem("filteredTitlesYo", JSON.stringify(titles));
      hideThatTitleYo(bobTitle);
    }
  });

  var observerGallery = new MutationObserver(function(mutations) {
    for (var key in titles) {
      hideThatTitleYo(key);
    }
  });

  // pass in the target node, as well as the observer options
  if ($('#BobMovie').length) observerBobMovie.observe(document.querySelector('#BobMovie'), {
    attributes: true
  });
  if ($('#bob-container').length) observerBobContainer.observe(document.querySelector('#bob-container'), {
    attributes: true,
    childList: true
  });

  //Also check for when new images appear and hide
  if ($('.gallery').length) observerGallery.observe(document.querySelector('.gallery'), {
    childList: true
  });

  if ($('#page-WiAgain').length) {
    //just add everything on this page
    $('img.boxShotImg').each(function(index) {
      var imgTitle = $(this).attr('alt').trim();
      titles[imgTitle] = true;
      hideThatTitleYo(imgTitle);
    });
    localStorage.setItem("filteredTitlesYo", JSON.stringify(titles));

  }

});