// ==UserScript==
// @name            Youtube - toggle related button
// @description     Creates a button on the top header to show/hide related section
// @namespace       https://greasyfork.org/en/users/758587-barn852
// @version         3.0.1
// @author          barn852
// @license         MIT
// @match           *://*.youtube.com/*
// @include         *://*.youtube.com/watch*
// @grant           none
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at          document-end 
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/429371/Youtube%20-%20toggle%20related%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/429371/Youtube%20-%20toggle%20related%20button.meta.js
// ==/UserScript==

(function(){
  'use strict';
 
  const callback = () => $('#related').hide();
  
      const observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if (mutation.type === 'childList'){
                mutation.addedNodes.forEach(function(node){
                    callback();
                });
            }
        });
    });

  observer.observe(document.body, {'childList': true, 'subtree' : true});

  let target = document.querySelectorAll('body')[0];
  let options = {'childList': true, 'subtree' : true};
    
  let button = document.createElement('button');
      button.innerHTML = '<svg width="24" height="24" viewBox="0 0 22 22"><g fill="currentColor"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></g></svg>';
      button.style = ` background: transparent; border: 0; color: rgb(96,96,96); outline: 0; cursor: pointer; padding-left: 24px; padding-right: 24px; `;

  let hide = true;
  
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
  
  let waitButton = setInterval(() => {
      if ($('#end').length) {
         clearInterval(waitButton);
        
         let menu = $('#end')[0];
           menu.insertBefore(button, menu.lastElementChild); 

                      }
  }, 500);
  
  console.log('inserted');

} )()