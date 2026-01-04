// ==UserScript==
// @name         IThome Fix
// @namespace    http://your-namespace.com
// @version      3.3
// @description  去除「IT之家」博客版信息流广告
// @author       https://blog.tongmingzhi.com
// @match        https://www.ithome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481998/IThome%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/481998/IThome%20Fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to set rounded images with proportional height and a border
  function setRoundedImages() {
    var images = document.querySelectorAll('img');
    images.forEach(function(image) {
      if (image.width >= 30) {
        image.parentElement.style.border = 'none';
        image.style.borderRadius = '12px';
        image.style.border = '2px solid #CCC';

        if (image.height > 150) {
          image.style.borderRadius = '12px';
          image.style.border = '2px solid #CCC';
          image.style.display = 'inline';
          image.style.maxWidth = '400px';
          image.style.height = 'auto';
          image.style.objectFit = 'cover';
          image.style.overflow = 'hidden';
        }
      }
    });
  }

  // Function to set rounded corners for comments
  function setRounded() {
    var roundeds = document.querySelectorAll(
      '.comm_list ul.list li.entry ul.reply, ' +
      '.content .post_content blockquote, ' +
      '.add_comm input#btnComment' +
      '.card, span.card'
    );
    roundeds.forEach(function (rounded) {
      rounded.style.borderRadius = '12px';
    });

    var addCommElements = document.querySelectorAll('.add_comm');
    addCommElements.forEach(function (addCommElement) {
      addCommElement.style.borderRadius = '0px 0px 12px 12px';
    });

    var Cards = document.querySelectorAll('.card, span.card');
    Cards.forEach(function (card) {
      card.style.transform = 'scale(0.8)';
    });

    var Videos = document.querySelectorAll('.ithome_super_player');
    Videos.forEach(function (Video) {
     Video.style.border = '2px solid #CCC !important';
     Video.style.borderRadius = '12px';
     Video.style.marginLeft = 'auto';
     Video.style.marginRight = 'auto';
     Video.style.width = '400px';
     Video.style.height = 'atuo';
});

  }

  // Function to remove ads
  function removeAds() {
    document.querySelectorAll(
      'div.bb.clearfix > div.fl > ul.bl > li'
    ).forEach(function(element) {
      if (element.querySelector('div.c > div.m:empty')) {
        element.remove();
      }
    });
  }

  // Function to observe DOM changes
  function observeDOM() {
    var targetNode = document.body;
    var config = { childList: true, subtree: true };

    var callback = function(mutationsList, observer) {
      for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
          setRoundedImages();
          setRounded();
          removeAds();
        }
      }
    };

    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    return observer;
  }

  function checkDOMChanges() {
    var observer = observeDOM();

    var interval = setInterval(function() {
      setRoundedImages();
      setRounded();
      removeAds();
    }, 20);

    return interval;
  }

  window.addEventListener('load', function() {
    setRoundedImages();
    setRounded();
    removeAds();

    var intervalID = checkDOMChanges();

    setTimeout(function() {
      clearInterval(intervalID);
    }, 60000);
  });
})();