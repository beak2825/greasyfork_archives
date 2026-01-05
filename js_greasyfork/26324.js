// ==UserScript==
// @name         PTH hide forum posts
// @version      0.4
// @description  Add ability to hide forum posts
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/26324/PTH%20hide%20forum%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/26324/PTH%20hide%20forum%20posts.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  var script=document.createElement('script');
  script.src='https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js';
  document.body.appendChild(script);

  var hiddenPosts=getHiddenPosts();
  var forumHeads=document.getElementsByClassName('colhead_dark');
  for(var i=0; i<forumHeads.length; i++)
  {
    var f=forumHeads[i];
    var post_id=f.getElementsByTagName('a')[0].textContent;
    if(hiddenPosts.indexOf(post_id) != -1)
    {
      f.nextElementSibling.style.display='none';
      f.nextElementSibling.setAttribute('stayHidden', 'true');
    }
    f.addEventListener('click', toggleHide.bind(undefined, f), false);
  }
})();

function toggleHide(f, event)
{
  if(event.srcElement !== f.firstElementChild && event.target !== f.firstElementChild)
    return;
  var post_id=f.getElementsByTagName('a')[0].textContent;
  var hideable=f.nextElementSibling;
  if(hideable.style.display=='none')
  {
    removeHiddenPost(post_id);
    $(hideable).show("blind", { direction: "up" }, "slow");
    hideable.setAttribute('stayHidden', 'false');
  }
  else
  {
    addHiddenPost(post_id);
    $(hideable).hide("blind", { direction: "up" }, "slow");
    hideable.setAttribute('stayHidden', 'true');
  }
}

function getHiddenPosts()
{
  var h=window.localStorage.hiddenPosts;
  if(!h)
    h=[];
  else
    h=JSON.parse(h);

  return h;
}

function addHiddenPost(post_id)
{
  var h=getHiddenPosts();
  h.push(post_id);
  window.localStorage.hiddenPosts=JSON.stringify(h);
}

function removeHiddenPost(post_id)
{
  var h=getHiddenPosts();
  var index=h.indexOf(post_id);
  if(index != -1)
    h.splice(index, 1);
  window.localStorage.hiddenPosts=JSON.stringify(h);
}
