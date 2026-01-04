// ==UserScript==
// @name         RED: Freeze Animated Avatars
// @version      0.2.1
// @description  Pauses all those pesky animated avatars. Doesn't work for double-avatars.
// @author       mrpoot
// @match        https://redacted.sh/*
// @run-at       document-end
// @namespace    https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/374798/RED%3A%20Freeze%20Animated%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/374798/RED%3A%20Freeze%20Animated%20Avatars.meta.js
// ==/UserScript==

// Pausing method shamelessly ripped off of Chameleon's script here:
// https://greasyfork.org/en/scripts/25750-pth-freeze-avatars/code

(() => {
  const avatars = document.querySelectorAll('.avatar img, .box_image_avatar img');

  const process = (img) => {
    const { complete, parentNode, width, height, src } = img;

    const imageURL = src.includes('redacted.sh/image.php?')
      ? decodeURIComponent(src.match(/[?&]i=([^&]+)/)[0].replace(/\+/g, ' '))
      : src;

    if (!/\.gif(?:\?.+)?(?:#.+)?$/.test(imageURL)) {
      return;
    }

    if (!complete) {
      img.addEventListener('load', () => process(img));
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    parentNode.insertBefore(canvas, img);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    parentNode.removeChild(img);
  };

  [...avatars].forEach(process);
})();