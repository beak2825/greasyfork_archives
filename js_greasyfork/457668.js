// ==UserScript==
// @name Fatal Model Premium
// @description Remove fatal model premium paywalls
// @description:pt-br Remove filtros de pagamento impostos pelo site.
// @match *://*.fatalmodel.com/*
// @license MIT
// @version 0.0.1.20230105043125
// @namespace https://greasyfork.org/users/1007129
// @downloadURL https://update.greasyfork.org/scripts/457668/Fatal%20Model%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/457668/Fatal%20Model%20Premium.meta.js
// ==/UserScript==
function clearCrop() {
    const nodes = document.querySelectorAll('.grid-gallery__post.grid-gallery__post--cropped');
    nodes.forEach((node) => {
        node.classList.remove('grid-gallery__post--cropped');
    });
}

function clearAdds() {
    const nodes = document.querySelectorAll('.item-card-v2.not-allowed')
    nodes.forEach((node) => {
        node.classList.remove('not-allowed');
    })
}
function clearPhotos() {
    const nodes = document.querySelectorAll('.grid-gallery__post.grid-gallery__post--premium');
    nodes.forEach((node) => {
        node.classList.remove('grid-gallery__post--premium');
    });
}

function clearPhoto() {
    const nodes = document.querySelectorAll('.alert-premium-media');
    nodes.forEach((node) => {
        node.remove();
    })
}

function removePhotoBlur() {
    const nodes = document.querySelectorAll('.view-media__container--premium-blur');
    nodes.forEach((node)=>{
        node.classList.remove('view-media__container--premium-blur')
    })
}

function removeReviewBlur () {
    const nodes = document.querySelectorAll('.review-banner__wrapper')
    nodes.forEach((node)=>{
        node.remove()
    })
    const blur = document.querySelectorAll('.review-banner__bg.bg-review-section-mobile')
    blur.forEach((node) => {
        node.style.filter="none";
    })
}

function clearComparation() {
    document.querySelectorAll('.view-media__container--blur').forEach((node) => {
      node.classList.remove('view-media__container--blur');  
    })
    document.querySelectorAll('.no-comparison-media').forEach((node)=>{
      node.remove();  
    })
    document.querySelectorAll('.grid-gallery__post--blur').forEach((node) => {
      node.classList.remove('grid-gallery__post--blur');  
    })
}

(function () {
   'use strict';
    const runAsync = () => {clearAdds();clearPhotos();clearCrop();clearPhoto();removePhotoBlur();removeReviewBlur();clearComparation();}
    setInterval(runAsync, 500);
}());



