// ==UserScript==
// @name            Youtube - toggle related (original)
// @namespace       -
// @author          barn852
// @license         MIT
// @version         1.3
// @match           *://*.youtube.com/*
// @grant           none
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at          document-end
// @noframes
// @description Youtube toggle related section 1.0
// @downloadURL https://update.greasyfork.org/scripts/449962/Youtube%20-%20toggle%20related%20%28original%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449962/Youtube%20-%20toggle%20related%20%28original%29.meta.js
// ==/UserScript==

(function(){
  'use strict';
  console.log('X');
  let target = document.querySelectorAll('body')[0];
  let options = {'childList': true, 'subtree' : true};
    $('yt-formatted-string.more-button.style-scope.ytd-video-secondary-info-renderer').hide();

  function callback(observer, node){
    if (node.nodeName.toLowerCase() == '#related'){
      $('#related').hide();
    }
  }

  let observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
      if (mutation.type === 'childList'){
        mutation.addedNodes.forEach(function(node){
          callback(observer, node);
        });
      }
    });
  });

  let button = document.createElement('button');
      button.innerHTML = '<svg width="24" height="24" viewBox="0 0 22 22"><g fill="currentColor"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></g></svg>';
      button.style = ` background: transparent; border: 0; color: var(--yt-spec-icon-active-other); outline: 0; cursor: pointer; padding-left: 24px; padding-right: 24px; `;

  let hide = false;

    button.onclick = ()=>{
    hide = !hide;
    if (hide){
      if ($('#related')[0])
        $('#related').hide()
      else
        observer.observe(target, options);

      console.log(`hide`);
    }
    else{
      observer.disconnect();
      console.log(`show`);

      $('#related').show();
    }
  }

//  button.click();

  let waitButton = setInterval(() => {
      if ($('#end').length) {
         clearInterval(waitButton);

         let menu = $('#end')[0];
           menu.insertBefore(button, menu.lastElementChild);

                      }
  }, 500);

  console.log('inserted');

} )()