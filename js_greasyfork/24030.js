// ==UserScript==
// @name        Lazyfoo Highlight code
// @namespace   lazyfoo
// @include     http://lazyfoo.net/tutorials/*
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/highlight.min.js
// @resource    highlightCss http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/styles/default.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @description Add code highlight to lazyfoo's code snippets in the tutorials section
// @downloadURL https://update.greasyfork.org/scripts/24030/Lazyfoo%20Highlight%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/24030/Lazyfoo%20Highlight%20code.meta.js
// ==/UserScript==

$.noConflict();

(function($) {
  var blocks = $('div.tutCode');
  
  if (blocks.length) {
    //@resource does not seem to be working
    $("head").append("<link id='highlightCss' href='http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/styles/default.min.css' type='text/css' rel='stylesheet' />");    

    blocks.each(function(i, block) {
      var $block = $(block);
      var code = $block.html();

      $block.html('<pre><code class="cpp">' + code + '</code></pre>');
    });

    $('code.cpp').each(function(i, code) {
      hljs.highlightBlock(code);
    });
  }
  
})(jQuery);