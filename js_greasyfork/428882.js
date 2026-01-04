// ==UserScript==
// @name        Twitter Widget Fixer for TT1069
// @namespace   https://greasyfork.org/users/790126-erohmst
// @version     0.1.1
// @description Fix Twitter widgets on TT1069 which are not working
// @author      erohmst
// @match       *://www.tt1069.com/bbs/thread-*
// @match       *://www.tt1069.com/bbs/forum.php*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/428882/Twitter%20Widget%20Fixer%20for%20TT1069.user.js
// @updateURL https://update.greasyfork.org/scripts/428882/Twitter%20Widget%20Fixer%20for%20TT1069.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const widgetScript = document.createElement('script');
  widgetScript.src = 'https://platform.twitter.com/widgets.js';
  widgetScript.async = true;
  widgetScript.charset = 'utf-8';
  document.head.append(widgetScript);
  
  const embeds = document.querySelectorAll('iframe[src^="https://twitter.com/i/videos/tweet/"]');
  for(const emb of embeds) {
    const tweetId = emb.src.replace('https://twitter.com/i/videos/tweet/', '');
    emb.insertAdjacentHTML('beforebegin', '<blockquote class="twitter-tweet"><a href="https://twitter.com/i/status/'
                           + tweetId + '?ref_src=twsrc%5Etfw"></a></blockquote>');
    emb.remove();
  }
})();