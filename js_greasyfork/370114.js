// ==UserScript==
// @name Facebook icon replacer
// @description Brings back Messenger 1.0 emojis
// @description:en Brings back Messenger 1.0 emojis
// @namespace fbicons
// @include /facebook/
// @version 0.3.4
// @downloadURL https://update.greasyfork.org/scripts/370114/Facebook%20icon%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/370114/Facebook%20icon%20replacer.meta.js
// ==/UserScript==

const substitutes = [
  { from: [':/', ':\\\\', ':\\', '😕'], to: "https://emojipedia-us.s3.amazonaws.com/thumbs/160/facebook/65/confused-face_1f615.png" },
  { from: [':)', ':]', '🙂'], to: "https://emojipedia-us.s3.amazonaws.com/thumbs/160/facebook/65/slightly-smiling-face_1f642.png" },
  { from: [':|', '😐'], to: "https://emojipedia-us.s3.amazonaws.com/thumbs/160/facebook/65/neutral-face_1f610.png" },
  { from: [':O', ':o', '😮'], to: "https://emojipedia-us.s3.amazonaws.com/thumbs/160/facebook/65/face-with-open-mouth_1f62e.png" },
  { from: [':D', '😀'], to: "https://emojipedia-us.s3.amazonaws.com/thumbs/160/facebook/65/grinning-face_1f600.png" },
  { from: ['👃'], to: "https://emojipedia-us.s3.amazonaws.com/thumbs/160/facebook/65/nose_1f443.png" },
  { from: ['😱'], to: "https://emojipedia-us.s3.amazonaws.com/thumbs/160/facebook/65/face-screaming-in-fear_1f631.png" }
]

const swap = () => substitutes.forEach((subsitiution) => {
  if (subsitiution.from) subsitiution.from.forEach(altText => {
    document.querySelectorAll(`img[alt='${altText}']`).forEach(image => image.src=subsitiution.to);
    document.querySelectorAll(`div[aria-label='${altText}'] img`).forEach(image => image.src=subsitiution.to);
  });
});


setInterval(swap, 500); 