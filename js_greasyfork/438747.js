// ==UserScript==
// @name            Youtube - description on the right side above related videos
// @description     Description on the right side with avatar and channel name
// @namespace       https://greasyfork.org/en/users/758587-barn852
// @author          barn852
// @license         MIT
// @version         1.3
// @match           *://*.youtube.com/*
// @include         *://*.youtube.com/watch*
// @grant           none
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/438747/Youtube%20-%20description%20on%20the%20right%20side%20above%20related%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/438747/Youtube%20-%20description%20on%20the%20right%20side%20above%20related%20videos.meta.js
// ==/UserScript==


(function(){
    'use strict';

    const insert_right = () => document.querySelector('#secondary-inner').insertBefore(document.getElementById('meta-contents'),document.getElementById('related'));
 
    const observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if (mutation.type === 'childList'){
                mutation.addedNodes.forEach(function(node){ 

                  if (document.querySelector("#secondary-inner > #meta-contents")) { return } else { insert_right() };               

                });
            }
        });
    });

    observer.observe(document.body, {'childList': true, 'subtree' : true});

/*
// auto expand description   
  
    window.addEventListener('yt-page-data-updated', function () {

        var checkExist = setInterval(function() {
            var ytMeta = document.querySelector('#secondary-inner #more .more-button.ytd-video-secondary-info-renderer');
            if(ytMeta){
                (ytMeta).click();
                clearInterval(checkExist);
            }
        }, 500);

    });  
*/  
  
})()
