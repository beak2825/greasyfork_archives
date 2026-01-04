// ==UserScript==
// @name        Different strokes frame fix
// @namespace   Violentmonkey Scripts
// @match       http*://*differentstrokes.xyz/*
// @grant       GM_addStyle
// @version     1.21
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @license     MIT
// @author      -
// @description Prevents overlap by showing the painting above the frame on Different Strokes website. Also makes it so paintings without the buttons underneath line up correctly.
// @downloadURL https://update.greasyfork.org/scripts/460679/Different%20strokes%20frame%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/460679/Different%20strokes%20frame%20fix.meta.js
// ==/UserScript==
GM_addStyle(`
  .frame {
    z-index: 1;
  }
.painting {
    z-index: 2;
    border: 2px solid black;
  }
`);
const target = document.getElementById('__nuxt');
const config = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver((mutationList, observer) => {
  for(const mutation of mutationList){
    if (mutation.type === 'childList') {
      if(mutation.addedNodes[0] && mutation.addedNodes[0].className === 'gallery'){
        console.log('GALLERY FOUND')
        $('.paintingelement').each((i, pel) => {
          let p = $(pel);
          let children = p.children(".switcher");
          if(children.length === 0) {
            p.append(
              `<div class="switcher" style="height: 78.25px;width: 200px;margin-top: 0.5rem;"></div>`
            )
          }
        });
      }
      
    }
  }
})
observer.observe(target, config);
