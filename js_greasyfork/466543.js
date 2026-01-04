// ==UserScript==
// @name         9gag - Return dislike count
// @namespace    https://github.com/Procyon-b
// @version      0.5
// @description  Display the like and dislike counts next to the arrow buttons. Forces display of poster's name instead of section. Display account's age next to posts and comments
// @author       Achernar
// @match        https://9gag.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466543/9gag%20-%20Return%20dislike%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/466543/9gag%20-%20Return%20dislike%20count.meta.js
// ==/UserScript==

(function() {
"use strict";

// JSON.parse
var JP=JSON.parse;
JSON.parse=function(){
  var r=JP(...arguments);
  if (r && r.data && r.data.post && r.data.post.interests) {
    r.data.post.interests=[];
    addProf(r.data.post.creator);
    }
  if (r && r.data && r.data.posts) {
    for (let v,k=0; v=r.data.posts[k]; k++) {
      v.interests=[];    
      posts[v.id]={id: v.id, up: v.upVoteCount, down: v.downVoteCount};
      addProf(v.creator);
      }
    }
  try{
    if (r.data.items) {
      for (let v,k=0; v=r.data.items[k]; k++) {
        if (v.post) v.post.interests=[];
        }
      }
    }
  catch(e){}

  if (r && r.payload && r.payload.comments) {
    for (let v,k=0; v=r.payload.comments[k]; k++) {
      addProf(v.user);
      }
    }

  return r;
  }


var posts={}, done=false,
    prof={},
    ST, iST=`
._fixed._exists li::before,
._fixed._exists .post-vote__btn.upvote::before {
  content: var(--upvotes);
}
._fixed._exists li::after,
._fixed._exists .post-vote__btn.downvote::after {
  content: var(--downvotes);
}
._fixed._exists .post-vote__btn.upvote,
._fixed._exists .post-vote__btn.downvote {
  display: flex;
}
.post-award-users {
  display: none !important;
}

.ui-post-creator__creation::after,
.post-view-header__head::after,
.ui-comment-header__container .ui-comment-header__time::after {
  content: var(--profage);
  margin-left: 1em;
  color: var(--palette-text-normal);
  pointer-events: none;
}
.ui-comment-header__container a.ui-comment-header__time::after {
  position: absolute;
}
`;

function addProf(v) {
  if (v && !prof[v.username || v.displayName]) {
    prof[v.username || v.displayName]={v, id: v.accountId, creation: v.creationTs || v.timestamp || (v.userId && v.userId.substr(2,10)), fullName: v.fullName, username: v.username || v.displayName, approx: v.creationTs?0:1 }
    }
  }

function init() {
  if (done) return;
  else done=true;
  var obs = new MutationObserver(function(muts){
    var pt=null;
    for (let mut of muts) {
      if (mut.addedNodes.length) {
        if (mut.target != pt) {
          pt=mut.target;
          getBtnV(mut.target);
          }
        }
      }
    });
  obs.observe(document.body, {subtree: true, childList: true} );

  addSt();
  getBtnV();
  }

if (document.readyState != 'loading') init();
else {
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  }

function getBtnV(r=document) {
  var a=r.querySelectorAll(':first-child.btn-vote:not(._fixed), .post-vote:not(.fixed)');
  for (let n of a) {
    n.classList.add('_fixed');
    let p=n.closest('article');
    if (p) {
      let id= (p.id || '').split('-').pop();
      if (!id) { // mobile
        let e=p.querySelector(':scope > header > a[href^="/gag/"]');
        if (e) id=e.href.split('/').pop();
        }
      if (posts[id]) {
        n.classList.add('_exists');
        n.style='--upvotes: "'+posts[id].up+'"; --downvotes: "'+posts[id].down+'";';
        }
      }
    }
  
  a=r.querySelectorAll('.ui-post-creator__author:not(._fixed), .post-view-header__author:not(._fixed), .ui-comment-header__username:not(._fixed)');
  for (let n of a) {
    n.classList.add('_fixed');
    let id=n.href.split('/').pop();
    if (prof[id] && parseInt(prof[id].creation) ) {
      let d=parseInt( ( Date.now()/1000 - prof[id].creation ) /60/60/24 )
      n.parentNode.style='--profage: "('+(prof[id].approx?'~ ':'')+d+' days old)"';
      }
    }
  }

function addSt() {
  if (!iST) {
    return;
    }
  try {
    ST=document.createElement('style');
    document.documentElement.appendChild(ST);
    ST.textContent=iST;
    iST='';
  }catch(e){
    setTimeout(addSt,0); }
}


})();