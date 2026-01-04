// ==UserScript==
// @name         Civitai Post Galery
// @description  Fit-to-screen image viewer for Civitai posts
// @author       yee7doom https://civitai.com/user/yee7doom Yee7doom@proton.me
// @license      MIT
// @version      1.0.4
// @grant        none
// @match        https://civitai.com/*
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/1344777
// @downloadURL https://update.greasyfork.org/scripts/502520/Civitai%20Post%20Galery.user.js
// @updateURL https://update.greasyfork.org/scripts/502520/Civitai%20Post%20Galery.meta.js
// ==/UserScript==

var keyForward = "x";
var keyBack = "z";
var keyDownload = "s";

function getWinSize() {
	var div = document.createElement('div');
	div.style.width = div.style.height = '100%';
	div.style.left = div.style.top = '0';
	div.style.position = 'fixed';
	document.body.appendChild(div);
	var s = {w: div.clientWidth, h: div.clientHeight};
	s.p = s.w*1000+s.h;
	document.body.removeChild(div);
	return s;
};

function downloadImg() {
  if (!curImg) { return; };

  let fileName = curImg.alt;
  fetch(curImg.src)
  .then(resp => resp.status === 200 ? resp.blob() : Promise.reject('something went wrong'))
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    delete a;
  });
};

function setFullscreen() {
  // replace image src with the full-sized version
  if ( curImg.src.search('width=700') != -1 ) {
  	curImg.style.border = "2px gray dashed";
  	curImg.onload = function() { onImgLoad(this) };
  	curImg.src = curImg.src.replace('width=700,','');
  };
  // fit image to screen
  let winSize = getWinSize();
  curItem.style.maxWidth = "none";
  curItem.style.width = "auto";
  curImg.style.maxWidth = `${winSize.w}px`;
  curImg.style.maxHeight = `${winSize.h}px`;
  // hide image buttons
  curItem.style.zIndex = "12";
  curImg.style.position = "relative";
  curImg.style.zIndex = "11";
  // show image buttons on mouse hover
  curItem.addEventListener('mouseenter', setFocus);
  curItem.addEventListener('mouseleave', removeFocus);
  // scroll to the image
  curItem.scrollIntoView({behavior: 'auto', block: 'center', inline: 'center'});

};

function onImgLoad(img) {
  img.style.border = "none";
  curItem.scrollIntoView({behavior: 'auto', block: 'center', inline: 'center'});
};

function removeFullscreen() {
  // revert to the default image appearance
  curItem.style.maxWidth = "700px";
  curImg.style.maxWidth = "700px";
  curImg.style.maxHeight = "none";
  curItem.style.zIndex = "0";
  curImg.style.zIndex = "0";
  // remove on mouse hover listeners
  curItem.removeEventListener('mouseenter', setFocus);
  curItem.removeEventListener('mouseleave', removeFocus);
};

function setFocus() {
  if (curImg) {
    curImg.style.zIndex = "0";
  };
};

function removeFocus() {
  if (curImg) {
    curImg.style.zIndex = "11";
  };
};

function scrollPost(value) {
  // remove fullscreen from current image
  if (curItem) {
    removeFullscreen();
  };

  // find all post image links
  let postLinks = [...scroller.getElementsByTagName('a')].filter((i) => i.getAttribute("href", '').startsWith('/images/'));
  if (postLinks.length == 0) { return; };

  // define next item
  let nextPos = curPos + value;
  if (postLinks[nextPos] == undefined) {
    nextPos = value > 0 ? 0 : postLinks.length-1;
  };

  // show the image
  curPos = nextPos;
  curItem = postLinks[curPos].parentNode; // the div image container with all the buttons
  curImg = postLinks[curPos].childNodes[0]; // the actual img element
  setFullscreen();
};

var scroller = undefined;
var curPos = -1;
var curItem = null;
var curImg = undefined;

function activate() {
  let header = document.getElementsByTagName('header')[0];
  let main = document.getElementsByTagName('main')[0];
  scroller = main.childNodes[1];

  // disable max width for the post contents
  scroller.childNodes[0].style.maxWidth = "none";
  scroller.childNodes[1].style.position = "fixed";

  // remove header and footer from their fixed positions
  main.firstChild.style.position = 'relative'; 
  main.insertBefore(header, main.firstChild);

  // bind the buttons
  document.onkeydown = function(e) {

    // skip if typing
    if (e.target.tagName == 'INPUT' && e.target.type == 'text' || e.target.tagName == 'TEXTAREA') { return; };

    switch (e.key) {
      case keyForward:
        scrollPost(1);
        break;
      case keyBack:
        scrollPost(-1);
        break;
      case keyDownload:
        downloadImg();
        break;
    };
  };
};

// watch the URL changes and reload the page if a post is being opened (otherwise it opens in an overlay mode)

let u = location.href;
new MutationObserver(() => u !== (u = location.href) && onUrlChange()).observe(document, {subtree: true, childList: true});

function onUrlChange() {
  if (location.pathname.match('/posts/[0-9]+$')) {
    console.log('processing', location.href);
    window.location.reload();
  };
};

if (location.pathname.match('/posts/[0-9]+$')) {
  activate();
};
