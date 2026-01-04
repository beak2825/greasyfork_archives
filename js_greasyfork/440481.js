// ==UserScript==
// @name        voat.xyz posts expander
// @namespace   Violentmonkey Scripts
// @match       https://www.voat.xyz/*
// @match       https://www.talk.lol/*
// @grant       GM_registerMenuCommand
// @version     1.0
// @license     The Unlicense
// @author      ImpatientImport
// @description Expands all posts (some limitations) on voat.xyz by clicking on the menu command.
// @downloadURL https://update.greasyfork.org/scripts/440481/voatxyz%20posts%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/440481/voatxyz%20posts%20expander.meta.js
// ==/UserScript==

var image_embed_elems = [];
var video_embed_elems = [];
var all_post_elems = [];

var post_ids = [];

const expandbtn_id_template = "expandbutton_";
const post_containers1 = document.getElementsByClassName("post-container");
const post_containers2 = document.getElementsByClassName("post-container2");

var postContainers = []
  .concat(Array.from(post_containers1))
  .concat(Array.from(post_containers2));

function expand_all_posts(){
  for (var post = 0; post<post_ids.length; post++){
    var expand_button_id = expandbtn_id_template + post_ids[post];
    var expand_btn = document.getElementById(expand_button_id);
    console.log(expand_btn);
    
    if(expand_btn != null){
      expand_btn.click();
    }
  }
}

(function(){
  'use strict';
  
  for (var i=0; i<postContainers.length; i++)
  {
    var unedited_post_id = postContainers[i].id;
    post_ids.push( unedited_post_id.split('_')[1] );
  }
  
  GM_registerMenuCommand("Expand all posts", expand_all_posts);
  
})();