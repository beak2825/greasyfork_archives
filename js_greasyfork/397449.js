// ==UserScript==
// @name         e621 Thumbnail Enhancer 2
// @version      2.2
// @description  Resizes thumbnails on e621.net and replaces them with hi-rez version. Modified for the new site design sometime around 2020-03-06
// @author       justrunmyscripts
// @include      *://*e621.net*
// @grant        GM.xmlHttpRequest
// @namespace    https://sleazyfork.org/en/users/96703-justrunmyscripts
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397449/e621%20Thumbnail%20Enhancer%202.user.js
// @updateURL https://update.greasyfork.org/scripts/397449/e621%20Thumbnail%20Enhancer%202.meta.js
// ==/UserScript==


// original script creator https://greasyfork.org/de/users/398891
// to edit the size of the thumbnails, change the PICTURE_SIZE variable under

try {

  let PICTURE_SIZE = 24; // this number is in vw units (percent of screen width!)

  let postContainerIdentifier;
  const path = window.location.pathname;
  switch(true) {
    // case '/explore/posts/popular' === path:
    //   postContainerIdentifier = '#a-popular';
    //   break;
    // case /\/pools\/.*/.test(path):
    //   postContainerIdentifier = '#c-pools section:last-child';
    //   PICTURE_SIZE = 46;
    //   break;
    // case '/favorites' === path:
    //   postContainerIdentifier = '#posts .posts-container';
    //   break;
    default:
      postContainerIdentifier = '#posts .posts-container';
      break;
  }

  let sty =document.createElement("style");
  sty.innerHTML=[
    ""
    ,".thumbEnh_cont {"
    ,"    display: flex;"
    ,"    flex-flow: row wrap;"
    ,"    justify-content: space-between;"
    ,"    gap: 10px;"
    ,"}"
    ,".thumbEnh_cont img.thumbEnh_img {"
    ,"    max-height: 100%;"
    ,"    max-width: 100%;"
    ,"}"
    ,".thumbEnh_cont video.thumbEnh_video {"
    ,"    height: 100%;"
    ,"    width: 100%;"
    ,"}"
    ,".thumbEnh_cont article.thumbnail {"
    ,`    width: ${PICTURE_SIZE}vw !important;`
    ,`    max-width: unset;`
    ,"}"
    ,"article.thumbnail a {"
    ,"    max-width: fit-content;"
    ,"    max-height: fit-content;"
    ,"}"
  ].join("");
  document.head.appendChild(sty);


  /* Replace image thumbnails with higher resolution */
  class ImageFetcher {
    constructor (originalArticle) {
      this.parentArticle = originalArticle;
      this.originalImage = originalArticle.querySelector('img');
      this.origSrc = this.originalImage.src;
      this.originalImage.className = "thumbEnh_img";

      if (this.isWebm()) {
      	this.replaceImageWithVideo();
      }
      else if (this.isGif()){
        this.originalImage.src = this.getOrigFileURL();
      }
      else if (this.hasLargeFile()){
        this.originalImage.src = this.getLargeFileURL();
        this.originalImage.addEventListener('error', (() => {
        	this.originalImage.src = this.getOrigFileURL();
        }).bind(this));
      } else {
        this.originalImage.src = this.getOrigFileURL();
      }
    }

    hasLargeFile() {
      return !!this.getLargeFileURL();
    }

    isGif() {
      return !!this.getOrigFileURL().endsWith('.gif');
    }

    isWebm() {
      return !!this.getOrigFileURL().endsWith('.webm');
    }

    getLargeFileURL() {
      return this.parentArticle.getAttribute('data-large-url');
    }

    getOrigFileURL() {
      return this.parentArticle.getAttribute('data-file-url');
    }

    replaceImageWithVideo() {
      const video = document.createElement('video');
      video.setAttribute('controls', true);
      video.setAttribute('class', 'thumbEnh_video');
      video.setAttribute('src', this.getOrigFileURL());

    	const parent = this.originalImage.parentNode;
      parent.replaceChild(video, this.originalImage)
    }
  }

  const main = () => {
    let contDiv = document.querySelector(postContainerIdentifier);
    contDiv.className = "thumbEnh_cont";

    let arts = document.querySelectorAll('article.thumbnail');
    for (art of arts) {
      new ImageFetcher(art);
    }

    // remove extra sources, since we're just using the "high rez" version anyways!
    let sources = document.querySelectorAll('article.thumbnail source');
    for (source of sources) {
      let parent = source.parentNode;
      parent.removeChild(source);
    }
  };

  main();

} catch (e) {
  // due to the way greasemonkey 'traps' errors, it kinda hides where the problem is!
  // this is an attempt at "fixing" that
  console.error(e);
}