// ==UserScript==
// @name        civitai.com fast react
// @namespace   Violentmonkey Scripts
// @match       https://civitai.com/images
// @match       https://civitai.com/images/*
// @match       https://civitai.com/posts/*
// @match       https://civitai.com/search/images
// @match       https://civitai.com/user/*
// @match       https://civitai.com/models/*/*
// @grant       none
// @version     1.2
// @author      tryitandsee
// @license     MIT
// @description Fast keyboard 1-4 emoji reactions for civitai.com instead of clicking the buttons. First press will expand the reaction toolbar. Subsequent presses will add a reaction with the matching emoji from left to right (thumbs up 👍, heart ❤️, tears 😂, crying 😢). Shift + number (!@#$) to remove reaction. Make sure your mouse is over the image you want to react to.
// @downloadURL https://update.greasyfork.org/scripts/487203/civitaicom%20fast%20react.user.js
// @updateURL https://update.greasyfork.org/scripts/487203/civitaicom%20fast%20react.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/487203-civitai-com-fast-react


const ACTIVE_CLASS = 'mantine-c49ihw';  // found on the BUTTON on /images

// Should I use elementFromPoint or keep track of IMG tags as the mouseenter/mouseexit them?
// mousemove seems inefficient but it works and works with infinite scroll
let mouseX, mouseY;
document.addEventListener('mousemove', function(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
});


function getControls(img) {
  if (location.pathname.startsWith('/models/')) {
    if (img.parentElement.classList.contains('mantine-AspectRatio-root')) {
      return img.parentElement.parentElement.parentElement.parentElement.nextElementSibling;

    }
    return img.parentElement.nextElementSibling;
  }
  return img.nextElementSibling.querySelector('button[data-button="true"]')?.parentElement;
}

const allowedKeys = ['1', '2', '3', '4', '!', '@', '#', '$'];

document.addEventListener('keydown', function(event) {
  if (!allowedKeys.includes(event.key)) {
    return;
  }

  let btnIdx = allowedKeys.indexOf(event.key);
  let shift = false;
  if (btnIdx > 3) {
    btnIdx -= 4;
    shift = true;
  }
  console.log('ZZ key pressed shift?', btnIdx, shift)

  const $img = document.elementFromPoint(mouseX, mouseY);

  // Check if the found element is an <img> tag
  if ($img.tagName.toLowerCase() === 'img') {
    console.log('ZZ Found <img> tag:', $img);
  } else {
    console.error('ZZ No <img> tag found under the cursor.', $img);
    return;
  }

  const $toolbar = getControls($img);
  console.log('ZZ Found $toolbar', $toolbar)
  if (!$toolbar) {
    console.warn('ZZ post instead of image, nothing to do...', $img)
    return;
  }

  let $btnToPress;
  if ($toolbar.firstElementChild.textContent === '') {
    if ($toolbar.childNodes.length != 6) {
      // For posts, it's an info button instead of a toolbar, but click on it anyways because it's a noop
      // FIXME: sometimes there is no expand and the first button is the thumbsup
      $toolbar.firstElementChild.click();
      // console.log('ZZ is this expand button?', $toolbar.firstElementChild.textContent)
      return;
    }

    $btnToPress = $toolbar.childNodes[btnIdx + 1];
  } else {
    // The first button was not an expand button
    $btnToPress = $toolbar.childNodes[btnIdx];
  }
  const btnIsActive = $btnToPress.classList.contains(ACTIVE_CLASS)
  if (shift === btnIsActive) {
    $btnToPress.click();
  }

});