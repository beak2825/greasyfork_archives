// ==UserScript==
// @name         HIT Export Mod for HIT Catcher
// @namespace    https://gist.github.com/Kadauchi
// @version      1.0.4
// @description  Adds panda and once links to HIT exports
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://turkerhub.com/threads/*
// @include      http://www.mturkcrowd.com/threads/*
// @downloadURL https://update.greasyfork.org/scripts/29037/HIT%20Export%20Mod%20for%20HIT%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/29037/HIT%20Export%20Mod%20for%20HIT%20Catcher.meta.js
// ==/UserScript==

const extId = `iglbakfobmoijpbigmlfklckogbefnlf`;

function addButtons (elem) {
  const key = elem.querySelector(`a[href^="https://www.mturk.com/mturk/preview?groupId="]`).getAttribute(`href`).match(/roupId=(.*)/)[1];

  elem.insertAdjacentHTML(
    `afterbegin`,
    `<div>
      <button data-key="${key}" type="button" class="button primary HIT-Catcher-Panda">Panda</button>
      <button data-key="${key}" type="button" class="button primary HIT-Catcher-Once">Once</button>
    </div>`
  );
}

function sendToHC (once, hitSetId) {
  chrome.runtime.sendMessage(extId, {
    type: `hitCatcherAddWatcher`,
    message: {
      nickname: null,
      once: once,
      sound: true,
      requesterName: null,
      requesterId: null,
      title: null,
      hitSetId: hitSetId,
      reward: null,
      assignmentDuration: null,
      hitRequirements: null,
      hitAutoAppDelay: null
    }
  });
}

function nom (elem) {
  if (document.URL.match(`turkerhub`)) {
    const post = elem.closest(`li[id^="post-"]`);
    const postId = post.id.match(/[0-9]+/)[0];
    const quoted = elem.closest(`.quoteContainer`);
    const xfToken = document.querySelector(`input[name=_xfToken]`).value;

    if (quoted) {
      const post = quoted.previousElementSibling.querySelector(`.AttributionLink`).getAttribute(`href`).match(/[0-9]+/)[0];
      $.post(`https://turkerhub.com/posts/${post}/rate`, {rating: `15`, _xfToken: xfToken});
    }
    else {
      $.post(`https://turkerhub.com/posts/${postId}/rate`, {rating: `15`, _xfToken: xfToken});
    }
  }
}

for (let elem of document.getElementsByClassName(`ctaBbcodeTable`)) {
  if (elem.querySelector(`a[href^="https://www.mturk.com/mturk/preview?groupId="]`)) addButtons(elem);
}

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const added = mutation.addedNodes[i];

      for (let elem of added.getElementsByClassName(`ctaBbcodeTable`)) {
        if (elem.querySelector(`a[href^="https://www.mturk.com/mturk/preview?groupId="]`)) addButtons(elem);
      }
    }
  });
});

observer.observe(document.getElementById(`messageList`), {childList: true});

document.addEventListener(`click`, function (event) {
  const elem = event.target;

  if (elem.matches(`.HIT-Catcher-Panda`)) {
    sendToHC(false, elem.dataset.key);
    nom(elem);
  }
  if (elem.matches(`.HIT-Catcher-Once`)) {
    sendToHC(true, elem.dataset.key);
    nom(elem);
  }
});