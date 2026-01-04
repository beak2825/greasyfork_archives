// ==UserScript==
// @name        gurochan - image hover
// @match       https://boards.guro.cx/*
// @grant       none
// @version     1.0
// @author      -
// @grant       GM_addStyle
// @description Image hover for gurochan
// @namespace https://greasyfork.org/users/1292388
// @downloadURL https://update.greasyfork.org/scripts/493319/gurochan%20-%20image%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/493319/gurochan%20-%20image%20hover.meta.js
// ==/UserScript==

let img = document.createElement('img')
img.id = 'hoverImage'

document['body'].append(img)

document.addEventListener('mouseover', function(event) {
  if (event.target.classList.contains('post-image')) {
    document.getElementById('hoverImage').classList.add('active');
    img.src = event.target.parentNode.href
  }
});

document.addEventListener('mouseout', function(event) {
  if (event.target.classList.contains('post-image')) {
    document.getElementById('hoverImage').classList.remove('active');
    img.src = ''
  }
});


document.addEventListener('mousemove', (e) => {
  const targetX = e.clientX+20
  const targetY = e.clientY/2
  const scrollbarWidth = 18

  if (targetX + img.offsetWidth > (window.innerWidth - scrollbarWidth)) {
    img.style.left = (window.innerWidth - img.offsetWidth - scrollbarWidth) + 'px';
  }
  else {
    img.style.left = targetX + 'px';
  }

  if (targetY + img.offsetHeight > window.innerHeight) {
    img.style.top = (window.innerHeight - img.offsetHeight) + 'px';
  }
  else {
    img.style.top = targetY + 'px';
  }
});

GM_addStyle(`

  #hoverImage {
    position: fixed;
    pointer-events: none;
    max-width: 100vw;
    max-height: 100vh;
    z-index: 1000;
  }

  #hoverImage:not(.active) {
    display: none;
  }

`)