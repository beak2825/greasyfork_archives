// ==UserScript==
// @name         InoReader - Twitter/IG Widgets
// @version      1.0.2
// @description  Turn twitter and instragram blockquotes in posts into widgets.
// @grant        unsafeWindow
// @include      http*://*.inoreader.com/*
// @require      https://greasyfork.org/scripts/31694-ondom/code/OnDom.js
// @namespace    https://greasyfork.org/users/316912
// @downloadURL https://update.greasyfork.org/scripts/387394/InoReader%20-%20TwitterIG%20Widgets.user.js
// @updateURL https://update.greasyfork.org/scripts/387394/InoReader%20-%20TwitterIG%20Widgets.meta.js
// ==/UserScript==

(function(){

  'use strict';
  
  onDom('.article_content', replaceTwitter);

  function replaceTwitter(element) {

    let $ = unsafeWindow.jQuery;
    let $this = $(element);
    
    let tweets = $this.find('blockquote a[href*="twitter.com"]').closest("blockquote");
    
    if( tweets.length !== 0 ) {
      tweets.addClass("twitter-tweet");
      $.getScript("https://platform.twitter.com/widgets.js");
    }
    
    let grams = $this.find('blockquote a[href*="instagram.com"]').closest("blockquote");
    
    if( grams.length !== 0 ) {
      grams.addClass("instagram-media");
      $.getScript("https://www.instagram.com/embed.js");
    }    
  }

})();