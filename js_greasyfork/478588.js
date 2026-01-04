// ==UserScript==
// @name         Remove inaccessible fav
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      GPL
// @description  Remove fav directly
// @author       You
// @match        https://www.nodeseek.com/space/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nodeseek.com
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/478588/Remove%20inaccessible%20fav.user.js
// @updateURL https://update.greasyfork.org/scripts/478588/Remove%20inaccessible%20fav.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function prompt_removal(link, e) {
        if(!confirm('Do you want to remove this link?')) {
            // Continue visiting the link (but for what?)
            return;
        }

        //// remove the link {{

        // Sample: "https://www.nodeseek.com/post-16300-1";
        const match = link.href.match(/post-(\d+)-1/);
        const post_id = parseInt( match[1] );
        console.log(post_id); // eg. 16300

        fetch("https://www.nodeseek.com/api/statistics/collection", {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                postId: post_id,
                action: "remove"
            })
        }).then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))

        // }}

        e.preventDefault();
    }

      var links = document.querySelectorAll('.discussion-item');
      links.forEach( link => {
          link.addEventListener('click', (e) => prompt_removal(link, e));
      });

      alert('Clicking on links now offers options to remove them.');

})();