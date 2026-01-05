// ==UserScript==
// @name         PTH Freeze Avatars
// @version      0.3
// @description  Freeze the animated avatars on PTH
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25750/PTH%20Freeze%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/25750/PTH%20Freeze%20Avatars.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var avatars=document.getElementsByClassName('avatar');
  for(var i=0; i<avatars.length; i++)
  {
    var av=avatars[i];
    var avatar=av.getElementsByTagName('img')[0];
    if(avatar.src.match(/.gif$/))
    {
      var c = document.createElement('canvas');
      var w = c.width = parseInt(getComputedStyle(avatar).width);
      var h = c.height = parseInt(getComputedStyle(avatar).height);
      avatar.parentNode.replaceChild(c, avatar);
      var img=document.createElement('img');
      img.src=avatar.src;
      img.setAttribute('style', 'max-height: 400px;');
      img.onload=draw.bind(undefined, c, img, w, h);
    }
  }
})();

function draw(canvas, img, w, h)
{
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
}
