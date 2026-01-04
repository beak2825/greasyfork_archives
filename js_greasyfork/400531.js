// ==UserScript==
// @name         Twitch Clip Creation Volume
// @description  Sets the volume of the video player on Twitch's clip creation page to the stored value, same as how the clip playback page
// @namespace    vaindil
// @version      1.0.2
// @author       vaindil
// @include      https://clips.twitch.tv/create
// @include      https://clips.twitch.tv/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400531/Twitch%20Clip%20Creation%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/400531/Twitch%20Clip%20Creation%20Volume.meta.js
// ==/UserScript==

const obs = new MutationObserver((mutations, me) => {
  const slider = document.querySelector('[id^="player-volume-slider"]');
  if (slider == null) {
    return;
  }

  let volume = localStorage.getItem('volume');
  volume = volume ? volume : '0.5';

  setNativeValue(slider, volume);
  slider.dispatchEvent(new Event('input', { bubbles: true }));

  obs.disconnect();
});

obs.observe(document, {
  childList: true,
  subtree: true
});

function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
}