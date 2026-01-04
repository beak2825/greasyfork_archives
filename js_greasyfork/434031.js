// ==UserScript==
// @name         [outdated] Fitgirl repacks bigger images/center-alignment and widescreen optimization
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.7.2
// @description  bigger images/center-alignment and widescreen optimization
// @author       Alistair1231
// @match        https://fitgirl-repacks.site/*
// @icon         https://icons.duckduckgo.com/ip2/fitgirl-repacks.site.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434031/%5Boutdated%5D%20Fitgirl%20repacks%20bigger%20imagescenter-alignment%20and%20widescreen%20optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/434031/%5Boutdated%5D%20Fitgirl%20repacks%20bigger%20imagescenter-alignment%20and%20widescreen%20optimization.meta.js
// ==/UserScript==
// https://openuserjs.org/scripts/Alistair1231/Fitgirl_repacks_bigger_imagescenter-alignment_and_widescreen_optimization

// https://draeton.github.io/javascript/library/2011/09/11/check-if-image-exists-javascript.html
{
  var checkImageErrors = {};
  function checkImage(url, success, failure) {
    var img = new Image(),    // the
      loaded = false,
      errored = false;
    img.onload = function () {
      if (loaded)
        return;
      loaded = true;
      if (success && success.call)
        success.call(img);
    };
    img.onerror = function () {
      if (errored) {
        return;
      }
      checkImageErrors[url] = errored = true;
      if (failure && failure.call) {
        failure.call(img);
      }
    };
    if (checkImageErrors[url]) {
      img.onerror.call(img);
      return;
    }

    img.src = url;
    if (img.complete) {
      img.onload.call(img);
    }
  }
}
////////////////


function makeSiteWide() {
  // make more space on the site
  const site = document.querySelector(".site");
  site.style.maxWidth = "100%";
  site.style.margin = "auto";

  const entryContent = document.querySelectorAll(".entry-content");
  entryContent.forEach(content => {
    content.style.maxWidth = "100%";
  });

  const masthead = document.getElementById("masthead");
  masthead.style.maxWidth = "100%"; // search bar
}

function removeLinkFromImage(image) {
  if (image.tagName != "IMG") return;
  link = image.parentNode;
  if (link.tagName != "A") return;
  link.parentNode.insertBefore(image, link)
  link.parentNode.removeChild(link);
}

function createTwoColumnCss() {
  const twoColumnStyle = document.createElement('style');
  twoColumnStyle.textContent = `
    /* Define the two-column layout for articles */
    .two-column {
      display: flex;
      flex-wrap: wrap;
    }
  
    .two-column article {
      width: 50%;
      box-sizing: border-box;
      padding: 0 10px;
    }
  `;

  // Append the twoColumnStyle element to the document head
  document.head.appendChild(twoColumnStyle);
}

function applyTwoColumnLayout() {
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const articles = document.querySelectorAll('div#content > article');
  const articlesParent = document.querySelector('div#content');

  if (windowWidth >= 2200) {
    // Add CSS classes to articles for two-column layout
    articlesParent.classList.add('two-column');
    articles.forEach(article => {
      article.classList.add('two-column');
    });
  } else {
    // Remove CSS classes for two-column layout
    articlesParent.classList.remove('two-column');
    articles.forEach(article => {
      article.classList.remove('two-column');
    });
  }
}

function centerAlignImages() {
  // image align center
  const coverImage = document.querySelectorAll("article .entry-content p:first-of-type img:first-of-type");

  coverImage.forEach(image => {
    removeLinkFromImage(image);
    image.classList.remove("alignleft");
    image.classList.add("aligncenter");
    image.parentNode.style.display = "contents";
  });

  // align torrentInfo stats images
  const torrentInfoImages = document.querySelectorAll(".entry-content ul li img:not(.wplp-lazy)");
  torrentInfoImages.forEach(image => {
    image.classList.remove("alignleft");
    image.classList.add("aligncenter");
  });
}

function centerAlignText() {
  const articles = document.querySelectorAll("article");
  articles.forEach(article => {
    article.style.textAlign = "center";
  });
}

function increaseScreenshotSize() {
  const h3Images = document.querySelectorAll("article .entry-content h3:not(:first-of-type)+p img"); //screenshots
  h3Images.forEach(element => {
    if (!element.flag) {
      // preview images
      element.style.width = "30%";
      const imageUrl = element.src.replace(/(.*)\.240p\.jpg$/, "$1");
      const imageUrlAlt = element.src.replace(/(.*)\.240p\.jpg$/, "$1.1080p.jpg");
      removeLinkFromImage(element);
      checkImage(imageUrl, () => { element.src = imageUrl; }, () => { element.src = imageUrlAlt; });

      element.flag = 1;
    }
  });
}

function increaseCoverImageSize() {
    const coverImages = document.querySelectorAll("article .entry-content p:first-of-type img"); //cover images
  coverImages.forEach(element => {
    if (!element.flag) {
      // cover images
      element.width *= 2.5;
      element.height *= 2.5;
    }
    element.flag = 1;
  });
}

(function () {
  "use strict";

  createTwoColumnCss();
  applyTwoColumnLayout();
  // Call the function on window resize
  window.addEventListener('resize', applyTwoColumnLayout);

  makeSiteWide();
  centerAlignImages();
  centerAlignText();

  increaseScreenshotSize();
  increaseCoverImageSize();

})();
