// ==UserScript==
// @name        Mainchan image expander
// @namespace   Violentmonkey Scripts
// @match       https://mainchan.com/*
// @grant       GM_registerMenuCommand
// @version     1.0
// @license     The Unlicense
// @author      ImpatientImport
// @description Expands all image posts on mainchan.com by clicking on the menu command.
// @downloadURL https://update.greasyfork.org/scripts/458975/Mainchan%20image%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/458975/Mainchan%20image%20expander.meta.js
// ==/UserScript==

const expand_buttons = document.getElementsByClassName("post-expand");

function expand_all_posts(){
  var imageArray = [];

  for (var i = 0; i<expand_buttons.length; i++)
  {
    imageArray.push(expand_buttons[i]);
  }

  for (var post = 0; post<imageArray.length; post++){

    if(imageArray[post] != null){
      imageArray[post].click();
    }
  }
}

(function(){
  'use strict';

  GM_registerMenuCommand("Expand all posts", expand_all_posts);

})();