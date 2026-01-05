// ==UserScript==
// @name           Amazon - Big thumbnails in search results
// @description    Doubles the size of thumbnails on search result pages
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        1.0.0
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwklEQVQ4y5WTP2hTYRTFf0/zvanagEtDfOAmomCSTdCpeVtdNAaXrHYvGFx0E0FxMQ+3LA7BpU0HR6Gb/8gUBF8yGIT2PWtA83zaoQGPQ9KQv0Uv3OG7H/fcczj3IsmW9FTSrv49doc9tiXpEXCPsWi321SrVT53OliWxfW1NUqlEnPiCZLCcehGo6GTxigxleVyeR6TEEm98cqd9XUljFHedeX7/uh91nHmAfQsST1g+YhTGIYEQUAURfyMY2q1GvV6HYD+4eG0hGiGQavVUiaXm5GQMGYugxmAW8WiEsYok8spCAJVPO9YgBPTnI7oFgoFUqkUzWZz9BfH8awP0wwy2exoYt51JxypeN4CCb+DCRvTjqOEMUo7jiqep0KxqFXXVfw91B//hfRhY5AjF15dXObqFiTPc2zs3ISlc2An4dMDuK2hC3uvpZdI7zekOFi8wL/2pM6m9MOXNs9M7cGXOry7MZiUvAYrLpjTIMCyYH8H9rfhytag3n0Dl+9HlqQQWAGg24CPD+Hb9qCRYT/A0gXIPoN0HvpDN8ypr5akx8DdCa29FnTfQj8aICQvQXp14THZkp5LOviPcz4Y9th/AXFbL8bQrfwSAAAAAElFTkSuQmCC
// @icon64         data:image/png;base64,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
// @match          *://*.amazon.tld/s/*
// @grant          GM_addStyle
// @run-at         document-start
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js
// @require        https://greasyfork.org/scripts/7602-mutation-observer/code/mutation-observer.js
// @downloadURL https://update.greasyfork.org/scripts/11243/Amazon%20-%20Big%20thumbnails%20in%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/11243/Amazon%20-%20Big%20thumbnails%20in%20search%20results.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true */
/* global jQuery, GM_addStyle */

(function($) {
  'use strict';

  // --------------------------------------------------------------------

  function processSummary(summary, message, func) {
    try {
      if (typeof message === 'string') {
        console.log(message, summary.added.length)
      }
      else {
        func = message
      }
      
      func($(summary.added))
    }
    catch (ex) {
      console.error(ex)
    }
  }


  // --------------------------------------------------------------------

  let observer = new MutationSummary({
    callback(summaries) {
      processSummary(summaries[0], /* 'Found %d thumbnails', */ $images => {
        $images
          .removeAttr('width height')
          .attr('src', (i, src) => src.replace(/160_\.jpg/, '320_.jpg').replace(/190,246_\.jpg/, '247,320_.jpg'))
      })
    },
    queries: [
      { element: '.s-access-image' }
    ]
  })
  
  /* jshint newcap: false */  
  GM_addStyle(`
    .s-result-item img {
      height: 320px;
      width: auto;
      max-width: 320px;
    }
  `)

})(jQuery)

jQuery.noConflict()
