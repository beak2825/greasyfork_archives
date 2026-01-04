// ==UserScript==
// @name        Google Meet helper
// @namespace   Violentmonkey Scripts
// @match       https://meet.google.com/*
// @grant       none
// @version     1.3.03
// @author      Vanshaj Girotra, Will Sheppard
// @description  auto disable video, auto disable mute, and auto join -- in that order. Also switches account (defaults to primary)
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/407347/Google%20Meet%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/407347/Google%20Meet%20helper.meta.js
// ==/UserScript==

// Original:  https://github.com/vanshajg/scripts/tree/master/google-meet-helper
// Published: https://greasyfork.org/en/scripts/407347-google-meet-helper
// This fork: https://github.com/willsheppard/userscripts/blob/master/google-meet-helper.user.js

// change the default values here
const DISABLE_VIDEO = true;
const DISABLE_AUDIO = true;
const AUTO_JOIN = true;

// if your work email is not the first account (authuser = 0) change the authuser below
const ACCOUNT_SWITCH = {
  enable: false,
  authuser: 0
}

// ------------------------------

const findButtons = () => {
  console.debug("findButtons()");

  // Get a list of all the buttons
  const button_list = [];

  // For the "Allow microphone" and "Allow camera" buttons
  const node_list1 = document.getElementsByTagName('div');
  for (let i = 0; i < node_list1.length; i = i + 1) {
    if (node_list1[i].getAttribute('role') === 'button') {
      const button1 = node_list1[i];
      console.debug("Found div button. label = ["+button1.getAttribute('aria-label') + "], text = [" + button1.innerText + "]");
      button_list.push(button1);
    }
  }

  // For the "Join now" button
  const node_list2 = document.getElementsByTagName('button');
  for (let i = 0; i < node_list2.length; i = i + 1) {
    const button2 = node_list2[i];
    console.debug("Found button. label = ["+button2.getAttribute('aria-label') + "], text = [" + button2.innerText + "]");
    button_list.push(button2);
  }

  console.debug("button_list", button_list);

  // Get the specific buttons we need
  const button_map = {
    video: null,
    audio: null,
    join1: null,
    join2: null,
  }

  button_list.forEach(button => {
    const aria_label = button.getAttribute('aria-label')
    // Join and use a phone for audio
//    if (button.innerText === 'Join now')
    if (button.innerText === "phone_forwarded\nJoin and use a phone for audio")
      button_map.join1 = button;
    else if (button.innerText === 'Join now')
      button_map.join2 = button;
    else if (aria_label && ~aria_label.toLowerCase().indexOf('+ d'))
      button_map.audio = button;
    else if (aria_label && ~aria_label.toLowerCase().indexOf('+ e'))
      button_map.video = button;
  })
  console.debug("button_map", button_map);

  if (! button_map.video) { console.error("Failed to detect 'disable video' button"); }
  if (! button_map.audio) { console.error("Failed to detect 'disable audio' button"); }
  if (! button_map.join1)  { console.error("Failed to detect 'Join now' button 1"); }
  if (! button_map.join2)  { console.error("Failed to detect 'Join now' button 2"); }

  return button_map;
}


const clickButtons = () => {
  console.debug("clickButtons()");

  const button_map = findButtons();

  if (DISABLE_VIDEO && button_map.video) {
    console.debug("DISABLE_VIDEO");
    button_map.video.click();
  }

  if (DISABLE_AUDIO && button_map.audio) {
    console.debug("DISABLE_AUDIO");
    button_map.audio.click();
  }

  // join if audio and video buttons have been clicked, or not
  if (AUTO_JOIN && button_map.audio && button_map.video && button_map.join1 && button_map.join2) {
    console.debug("AUTO_JOIN");
    button_map.join1.click();
    button_map.join2.click();
  }

};

const checkLoad = () => {
  console.debug("checkLoad()");
  let loaded = true;

  // Not sure if this is still needed
  const divs = document.getElementsByTagName('div')
  for (let i=0;i<divs.length; i+=1) {
    if (divs[i].getAttribute('data-loadingmessage') === 'Loading...') { // :/
      loaded = false;
    }
  }

  // For some reason if join1 button doesn't exist, then join2 cannot be clicked
  const button_map = findButtons();
  if (! button_map.join1) {
    loaded = false;
  }

  return loaded
}



const checkButtonLoad = () => {
  console.debug("checkButtonLoad()");

  // Every half a second, check if important page elements have loaded
  const run_every_interval_tick_ms = 100;
  const run_after_wait_ms = 500;

  const interval_check = setInterval(() => {
    console.debug("setInterval() - checking if page has loaded");
    if (checkLoad()) {
      console.debug("setInterval() - yes, page has loaded, now run clickButtons() after " + run_after_wait_ms + "ms");
      clearInterval(interval_check);
      setTimeout(() => clickButtons(), run_after_wait_ms);
    };
  }, run_every_interval_tick_ms);

  // Give up if required page elements have not loaded after 5 seconds
  const keep_trying_for_ms = 5000;

  setTimeout(() => {
    console.debug("Giving up after " + keep_trying_for_ms + "ms");
    clearInterval(interval_check);
  }, keep_trying_for_ms);
}

const main = () => {
  console.debug("main()");
  window.removeEventListener('load', main);
  const params = new URLSearchParams(location.search);
  const authuser = params.get('authuser') || '0'
  if (ACCOUNT_SWITCH.enable && authuser != ACCOUNT_SWITCH.authuser) {
    params.set('authuser', ACCOUNT_SWITCH.authuser)
    window.location.search = params.toString()
  } else {
    checkButtonLoad()
  }
}

window.addEventListener('load', main);
