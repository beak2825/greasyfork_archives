// ==UserScript==
// @name        Animated GIFs and Emojis on hover - slack.com
// @description Enables animations on hover if you disable "Allow animated images and emoji" from Slack's accessibility settings / 2022-03-02
// @namespace   Rebane
// @match       https://app.slack.com/client/*
// @grant       none
// @version     1.1
// @author      Rebane
// @license     Unlicense; https://unlicense.org/
// @downloadURL https://update.greasyfork.org/scripts/440811/Animated%20GIFs%20and%20Emojis%20on%20hover%20-%20slackcom.user.js
// @updateURL https://update.greasyfork.org/scripts/440811/Animated%20GIFs%20and%20Emojis%20on%20hover%20-%20slackcom.meta.js
// ==/UserScript==

/* Handle animating GIFs when hovering over GIF message attachments. */
document.addEventListener('mouseover', (event) => {
  if (!event.target?.classList.contains("c-message_attachment__image"))
    return;
  if (!event.target.style.backgroundImage.includes(".gu&"))
    return;
  event.target.classList.add("user-activate-animated");
  if (!event.target.dataset?.originalSrc)
    event.target.dataset.originalSrc = event.target.style.backgroundImage;
  event.target.style.backgroundImage = `${event.target.style.backgroundImage.replaceAll(".gu&","&")}, ${event.target.style.backgroundImage}`;
});

document.addEventListener('mouseout', (event) => {
  if (!event.target?.classList.contains("user-activate-animated"))
    return;
  event.target.classList.remove("user-activate-animated");
  event.target.style.backgroundImage = event.target.dataset.originalSrc;
});

/* Handle animating emoji when hovering over a message or the emoji picker. */
document.addEventListener('mouseover', (event) => {
  event.composedPath()
    .filter((elem) => { return elem?.classList?.contains("c-message_kit__message") || elem?.classList?.contains("p-emoji_picker") })
    .forEach((emojiParent) => {
      emojiParent.querySelectorAll("img.c-emoji, .c-emoji > img").forEach((emoji) => {
        if (!emoji.src.endsWith(".gif") || !emoji.src.includes("&o1=gu"))
          return;
        if (!emoji.dataset?.originalSrc)
          emoji.dataset.originalSrc = emoji.src;
        emoji.classList.add("user-activate-animated-emoji");
        emoji.src = emoji.src.replace("&o1=gu","");
      });
      emojiParent.addEventListener('mouseleave', () => {
        emojiParent.querySelectorAll(".user-activate-animated-emoji").forEach((emoji) => {
          emoji.classList.remove("user-activate-animated-emoji");
          emoji.src = emoji.dataset.originalSrc;
        });
      });
    });
});
