// ==UserScript== 
// @name    	  wikifeet EU
// @description   Remove the annoying article 17 page that EU user see when clicking a picture.
// @version  	  1.0.5
// @author        Love4Arhc
// @namespace     https://greasyfork.org/en/users/903627
// @match         https://www.wikifeet.com/*
// @license       MIT License
// @compatible    firefox >=99
// @downloadURL https://update.greasyfork.org/scripts/443588/wikifeet%20EU.user.js
// @updateURL https://update.greasyfork.org/scripts/443588/wikifeet%20EU.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const urlParts = document.URL.split('/');
const buttons = document.getElementsByTagName('button');


function reWritePictureUrls() {

  const picDivs = document.getElementsByClassName('pic');
  if (picDivs.length > 0) {

    for (let i=0; i < picDivs.length; i++) {

      var pid = picDivs[i].children[1].innerText;
      if (pid === 'new') {
        pid = picDivs[i].children[2].innerText;  
      }

      picDivs[i].firstChild.removeAttribute('target');
      picDivs[i].firstChild.href = urlParts[3] + '#&gid=1&pid=' + pid;

    }

    if (document.cookie.length > 15) {
      buttons[3].addEventListener('click', reWritePictureUrls);
    }
    else {
      buttons[1].addEventListener('click', reWritePictureUrls);
    }
    
    buttons[2].addEventListener('click', reWritePictureUrls);
  }
}


function reWriteWallPictureUrls() {

  const wallThumbs = document.getElementsByClassName('thumb_wall');
  if (wallThumbs.length > 0) {

    for (let i=0; i < wallThumbs.length; i++) {
      
      let pid = wallThumbs[i].attributes.style.value.split('/')[3];
      
      if (typeof pid !== 'undefined') {
        
        pid.replace('.jpg)', '');
        
        wallThumbs[i].parentElement.removeAttribute('target');
        wallThumbs[i].parentElement.href = urlParts[3] + '#&gid=1&pid=' + pid;    
      }

    }

    document.addEventListener('scroll', reWriteWallPictureUrls);
  }
}

reWritePictureUrls();
reWriteWallPictureUrls();
