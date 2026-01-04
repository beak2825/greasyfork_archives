// ==UserScript==
// @name         Infinity Pool Drain
// @namespace primal.red
// @version      0.6
// @license MIT
// @description  Nuke All Infinity Pools by disabling forever-scrolling and recommendations!
// @match  https://*.reddit.com/*
// @match  https://*.facebook.com/*
// @match  https://*.fetlife.com/*
// @match  https://*.discord.com/*
// @match  https://*.youtube.com/*
// @match  https://*.twitter.com/*
// @match  https://*.linkedin.com/*
// @author       Leo Long
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451829/Infinity%20Pool%20Drain.user.js
// @updateURL https://update.greasyfork.org/scripts/451829/Infinity%20Pool%20Drain.meta.js
// ==/UserScript==
(function() {
  'use strict';
  window.onload = cleanup
  let previousUrl = "";

  const observer = new MutationObserver(() => {
    if (window.location.href !== previousUrl) {
      setTimeout(cleanup,2500);
      previousUrl = window.location.href;
    }
  });
  const config = { subtree: true, childList: true };

  observer.observe(document, config);

})();

function cleanup(){
    console.log('Infinity Pool Drained')
    if(document.URL.match('fetlife.com') != null){
    if( document.querySelectorAll('masonry-layout')[0] != null){
      document.querySelectorAll('masonry-layout')[0].style.visibility='hidden'
    }
    if( document.URL.match('fetlife.com/home$') != null && document.querySelectorAll('#stories-list')[0] != null){
      document.querySelectorAll('#stories-list')[0].style.visibility='hidden'
    }
    if( document.URL.match('\/groups\/') != null
        && document.URL.match('fetlife.com/.*posts.*') == null
        && document.querySelectorAll('main')[0]){
        document.querySelectorAll('main')[0].style.visibility='hidden'
    }
  }
  if(document.URL.match('discord.com') != null){
      if(document.URL.match( '@me') == null){
        window.location = 'https://discord.com/channels/@me'
      }
      document.querySelectorAll('[role=tree]')[0].style.visibility='hidden'
      document.querySelectorAll('[aria-label="Send a gift"]')[0].style.visibility='hidden'
  }
  if(document.URL.match('linkedin.com') != null){
      document.querySelectorAll('[aria-label="Main Feed"]')[0].style.visibility='hidden'
  }


  if(document.URL.match('facebook.com') != null){
    if(document.querySelectorAll('[role=main]')[0].previousElementSibling != null && document.URL.match('friends/') == null){
      document.querySelectorAll('[role=main]')[0].style.visibility='hidden'
    }
    setTimeout(function() {
      if(document.querySelectorAll('[role=feed]')[0] != null){
        document.querySelectorAll('[role=feed]')[0].style.visibility='hidden'
      }
      if(document.querySelectorAll('[role="feed"]')[1] != null){
        for ( let x of document.querySelectorAll('[role="feed"]')[1].childNodes.entries()){
            if(x[0] > 7){ x[1].style.visibility='hidden' }
        }
      }
      if(document.querySelectorAll('h2[dir="auto"]')[0] != null){
         for ( let x of document.querySelectorAll('h2[dir="auto"]')[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.childNodes.entries() ){
           if(x[0] > 7){ x[1].style.visibility='hidden' }
         }
      }
      if(document.querySelectorAll('#ssrb_composer_start')[0] != null){
        document.querySelectorAll('#ssrb_composer_start')[0].parentElement.style.visibility='hidden'
      }

    }, 5000);
  }
  if(document.URL.match('reddit.com') != null){
    if(document.querySelectorAll('.ListingLayout-outerContainer')[0] != null){
      document.querySelectorAll('.ListingLayout-outerContainer')[0].style.visibility='hidden'
    }
  }
 if(document.URL.match('twitter.com') != null){
    setTimeout(function() {
      if(document.URL.match( '\/explore$|\/search$') != null){
        window.location = 'https://twitter.com/messages'
      }
      if(document.URL.match('\/home$') != null && document.querySelectorAll('[role="region"]')[0] != null){
          console.log('timeout')
          document.querySelectorAll('[role="region"]')[0].style.visibility='hidden'
      }
      for ( let x of document.querySelectorAll('[data-testid="cellInnerDiv"]').entries()){
          if(x[0] > 7){ x[1].style.visibility='hidden' }
      }
      document.querySelectorAll('[data-testid="sidebarColumn"]')[0].style.visibility='hidden'
    }, 5000);
  }

  if(document.URL.match('youtube.com') != null){
    if(
      document.querySelectorAll('#primary.ytd-two-column-browse-results-renderer')[0] != null){
      document.querySelectorAll('#primary.ytd-two-column-browse-results-renderer')[0].style.visibility='hidden'
    }
    if(
      document.querySelectorAll('#primary.ytd-two-column-browse-results-renderer')[1] != null){
      document.querySelectorAll('#primary.ytd-two-column-browse-results-renderer')[1].style.visibility='hidden'
    }
    if( document.querySelectorAll('#guide-section-title')[0] != null){
      document.querySelectorAll('#guide-section-title')[0].style.visibility='hidden'
    }
    if(document.URL.match('www.youtube.com/watch') == null && document.querySelectorAll('#primary') != null){
      document.querySelectorAll('#primary')[0].style.visibility='hidden'
    }
    if(document.querySelectorAll('#items') != null){
      document.querySelectorAll('#items')[0].style.visibility='hidden'
    }
    if(document.querySelectorAll('#contents.ytd-item-section-renderer')[1] != null){
      document.querySelectorAll('#contents.ytd-item-section-renderer')[1].style.visibility='hidden'
    }
    if(document.querySelectorAll('.ytd-browse')[0] != null){
      document.querySelectorAll('.ytd-browse')[0].style.visibility='hidden'
    }

  }}
