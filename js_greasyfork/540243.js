// ==UserScript==
// @name        FrogTube YouTube
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      SneakySquid
// @description Blocks the distracting youtube site by completely frogifying the youtube experience.
// @downloadURL https://update.greasyfork.org/scripts/540243/FrogTube%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/540243/FrogTube%20YouTube.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const frogImages = [
    'https://images.pexels.com/photos/35669/hyla-meridionalis-the-frog-amphibians.jpg?cs=srgb&dl=pexels-pixabay-35669.jpg&fm=jpg'
    ,'https://images.pexels.com/photos/70083/frog-macro-amphibian-green-70083.jpeg',
    'https://images.pexels.com/photos/2631482/pexels-photo-2631482.jpeg?cs=srgb&dl=pexels-couleur-2631482.jpg&fm=jpg',
    'https://images.pexels.com/photos/63650/frog-toad-eyes-animal-63650.jpeg?cs=srgb&dl=pexels-pixabay-63650.jpg&fm=jpg',
    'https://images.pexels.com/photos/13801172/pexels-photo-13801172.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/23645284/pexels-photo-23645284.jpeg?cs=srgb&dl=pexels-alejandro-orozco-211352387-23645284.jpg&fm=jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbacq0DjQ6T-EUkyB6Q_lbRR32DycakHPHDg&s',
    'https://images.pexels.com/photos/122430/frog-water-frog-animal-green-122430.jpeg?cs=srgb&dl=pexels-pixabay-122430.jpg&fm=jpg',
    'https://images.pexels.com/photos/3656636/pexels-photo-3656636.jpeg?cs=srgb&dl=pexels-lucioarantesph-3656636.jpg&fm=jpg',
    'https://images.pexels.com/photos/14355607/pexels-photo-14355607.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/16673609/pexels-photo-16673609/free-photo-of-blue-poison-dart-frogs.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UJaggqNbPnQaJnYPvLOOK0BW7gHfqPQAXA&s',
    'https://images.pexels.com/photos/20898083/pexels-photo-20898083/free-photo-of-frog-head-in-water.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/30984271/pexels-photo-30984271/free-photo-of-green-tree-frog-on-mossy-branch-in-france.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/8807478/pexels-photo-8807478.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  ];

  const titles1 = [
    "cute moment: ",
    "adorable sighting: ",
    "you won't beleive that ",
    "this was epic: ",
    "photographer captures moment when ",
    "incredible footage of ",
    "amazing video of ",
    "incredible sighting of ",
    "incredible moment: ",
  ];
  const titles2 = [
    "a frog",
    "a toad",
    "a tree frog",
    "a poison dart frog",
    "a green frog",
    "a red-eyed tree frog",
    "a blue poison dart frog",
    "a golden poison dart frog",
    "a common frog",
    "a bullfrog",
    "a leopard frog",
    "a wood frog",
    "a green tree frog",
  ];
  const titles3 = [
    "was caught",
    "was seen",
    "was found",
    "was reported",
    "was spotted",
    "was filmed",
    "was reported",

  ];
  const titles4 = [
    " in the wild",
    " in its natural habitat",
    " in a pond",
    " in a garden",
    " in a rainforest",
    " in a backyard",
    " in a park",
    " in a swamp",
    " in a river",
    " in a lake",
    " in a forest",
  ];

  const titles5 = [
    "eating a bug",
    "jumping into a pond",
    "hopping around",
    "sitting on a leaf",
    "catching a fly",
    "sitting on a lily pad",
    "relaxing on a rock",
    "chilling on a branch",
    "doing froggy things",
    "hiding in the grass",
  ]

  function getRandomImage() {
    return frogImages[Math.floor(Math.random() * frogImages.length)];
  }

  function generateRandomTitle() {
    const part1 = titles1[Math.floor(Math.random() * titles1.length)];
    const part2 = titles2[Math.floor(Math.random() * titles2.length)];
    const part3 = titles3[Math.floor(Math.random() * titles3.length)];
    const part4 = titles4[Math.floor(Math.random() * titles4.length)];
    const part5 = titles5[Math.floor(Math.random() * titles5.length)];
    return `${part1}${part2} ${part3}${part4} ${part5}`;
  }

  const names = [
    "Frog spotter",
    "Toad Tracker",
    "Amphibian Observer",
    "Frog Enthusiast",
    "The Daily Croak",
    "Frog News",
  ];

  function getRandomName() {
    return names[Math.floor(Math.random() * names.length)];
  }

  function replaceChannelNames() {
    const channels = document.querySelectorAll('ytd-channel-name a, .ytd-channel-name a, ytd-video-renderer ytd-channel-name, ytd-video-owner-renderer a');
    channels.forEach(el => {
      if (!el || el.dataset.frogified === "true") return;
      el.textContent = getRandomName();
      el.dataset.frogified = "true";
    });
  }

  function replaceLogoText() {
    const logoText = document.querySelector('yt-formatted-string#logo-text, #logo a span, #logo a');
    if (logoText && !logoText.dataset.frogified) {
      logoText.textContent = "FrogTube";
      logoText.dataset.frogified = "true";
    }
  }

  function applyFrogImage(img) {
    if (!img || img.dataset.frogified === "true") return;
    const newSrc = getRandomImage();
    img.src = newSrc;
    img.dataset.frogified = "true";

    const observer = new MutationObserver(() => {
      if (img.src !== newSrc) {
        img.src = newSrc;
      }
    });

    observer.observe(img, {
      attributes: true,
      attributeFilter: ['src']
    });
  }

  function applyFrogTitle(el) {
    if (!el || el.dataset.frogified === "true") return;
    el.textContent = generateRandomTitle();
    el.dataset.frogified = "true";
  }

  function frogification() {
    const allImgs = document.querySelectorAll('img.yt-core-image, ytd-thumbnail img');
    allImgs.forEach(applyFrogImage);

    const ytShadows = document.querySelectorAll('yt-img-shadow:not(.frogified)');
    ytShadows.forEach(shadow => {
      const innerImg = shadow.querySelector('img');
      if (innerImg) applyFrogImage(innerImg);
      shadow.classList.add('frogified');
    });

    const thumbs = document.querySelectorAll('ytd-thumbnail:not(.frogified), #thumbnail:not(.frogified)');
    thumbs.forEach(thumb => {
      const bgImg = getRandomImage();
      thumb.style.backgroundImage = `url("${bgImg}")`;
      thumb.style.backgroundSize = 'cover';
      thumb.style.backgroundPosition = 'center';
      thumb.classList.add('frogified');
    });

    const titles = document.querySelectorAll('#video-title, a.yt-simple-endpoint.style-scope.ytd-video-renderer');
    titles.forEach(applyFrogTitle);

    replaceChannelNames();
    replaceLogoText();
  }

  setTimeout(() => {
    frogification();

    const observer = new MutationObserver(() => {
      frogification();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setInterval(frogification, 3000);
  }, 2000);
})();