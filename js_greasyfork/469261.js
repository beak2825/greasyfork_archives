// ==UserScript==
// @name         9gag - unblock NSFW - posts & comments
// @namespace    https://github.com/Procyon-b
// @version      0.3
// @description  Display all NSFW media in posts and comments
// @author       Achernar
// @match        https://9gag.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469261/9gag%20-%20unblock%20NSFW%20-%20posts%20%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/469261/9gag%20-%20unblock%20NSFW%20-%20posts%20%20comments.meta.js
// ==/UserScript==

(function() {
"use strict";

var JP=JSON.parse;
JSON.parse=function(){
  var r=JP(...arguments);

  if (r && r.data && r.data.posts) {
    for (let v,k=0; v=r.data.posts[k]; k++) { v.nsfw=0; }
    }

  try{
    if (r.data.post) { r.data.post.nsfw=0; }
    }
  catch(e){}

  if (r && r.payload && r.payload.comments) {
    for (let v,k=0; v=r.payload.comments[k]; k++) {
      if (v.isSensitive) {
        v.isSensitive=0;
        }
      }
    }

  try{
    if (r.payload.parent) { r.payload.parent.isSensitive=0; }
    }
  catch(e){}

  return r;
}

})();