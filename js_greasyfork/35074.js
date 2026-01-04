// ==UserScript==
// @author Frubi
// @version 1.1
// @name Tag Blocker
// @description Skips all uploads with blocked tags
// @description:de Überspring alle Uploads mit geblockten Tags
// @include *://pr0gramm.com/*
// @grant none
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/35074/Tag%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/35074/Tag%20Blocker.meta.js
// ==/UserScript==
// 

// To add more: simply put a comma behind the second last tag and paste your tag between ""
// Note: only 1 tag in a pair of ""
let tags = 
[
  "schmuserkadser",
  "big enough"
];

let a;
setInterval(function() 
  {
    a = document.getElementsByClassName('tag-link');
    let b = Math.min(5, a.length);
    tagLoop:
    for ( let i = 0 ; i < b ; i++ )
      {
          for ( let j = 0 ; j < tags.length ; j++)
          {
              if(a[i].text.toLowerCase().indexOf(tags[j]) !== -1)
              {
                $('.stream-next').click();
                break tagLoop;
              }
          }
        
      }
  }, 500);