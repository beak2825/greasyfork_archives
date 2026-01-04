// ==UserScript==
// @name        skype group name/icon-url
// @namespace   https://github.com/waricoma/skype-group-name-icon-url
// @description taking it
// @include     https://*.skype.com/*
// @version     1
// @grant       none
// @compatible  chrome
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424109/skype%20group%20nameicon-url.user.js
// @updateURL https://update.greasyfork.org/scripts/424109/skype%20group%20nameicon-url.meta.js
// ==/UserScript==

const sleep = async (msec) => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(); }, msec);
  });
};

$(async ($) => {
  while ($('body > div.app-container > div > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div > div > div > div.rxCustomScroll.rxCustomScrollV.active > div.scrollViewport.scrollViewportV > div > div:nth-child(1) > div > div:nth-child(3) > div').length === 0) {
    await sleep(100);
  }

  const groupInfo = $('body > div.app-container > div > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div > div > div > div.rxCustomScroll.rxCustomScrollV.active > div.scrollViewport.scrollViewportV > div > div:nth-child(1) > div > div:nth-child(3) > div');

  groupInfo.click(() => {
    const groupName = groupInfo.find('div > div > div:eq(1)').attr('data-text-as-pseudo-element');
    const groupIcon = groupInfo.parent().parent().find('div:eq(2) > button > div:eq(0) > div > div > div').css('background-image');

    alert(`GroupName=${groupName} GroupIcon=${groupIcon === 'none' ? 'none' : groupIcon.split('"')[1]}`);
  });
});
