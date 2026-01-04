// ==UserScript==
// @name                Healthy Hentai
// @name:zh-CN          Healthy Hentai
// @description         Remove Bloody Galleries In hitomi
// @description:zh-CN   移除 hitomi 中含有血腥标签的图集
// @version             0.1.0
// @author              jferroal
// @license             GPL-3.0
// @include             https://hitomi.la/*
// @run-at              document-idle
// @namespace           https://greasyfork.org/users/34556
// @downloadURL https://update.greasyfork.org/scripts/383575/Healthy%20Hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/383575/Healthy%20Hentai.meta.js
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  function hideGalleryContainTags(galleries, tags = ['guro', 'blood']) {
    galleries.forEach((node) => {
      const galleryTags = Array.from(node.querySelectorAll('.relatedtags > ul > li')).map((e) => e.innerText);
      if (galleryTags.some((gt) => tags.some((t) => (new RegExp(t, 'gi')).test(gt)))) {
        node.style.display = 'none';
      }
    });
  }

  function startCheck() {
    let tryTimes = 0;
    let checkInterval = setInterval(() => {
      const galleries = Array.from(document.querySelectorAll('.gallery-content > div'));
      if (!galleries.length) {
        tryTimes += 1;
      }
      if (tryTimes > 20 || galleries.length) {
        hideGalleryContainTags(galleries);
        clearInterval(checkInterval);
        checkInterval = null;
      }
    }, 500);
  }

  // listen page button click
  window.addEventListener('click', startCheck);
  // window.addEventListener('scroll', startCheck);
  startCheck();
})();
},{}]},{},[1]);
