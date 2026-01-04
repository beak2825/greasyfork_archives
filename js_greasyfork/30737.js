// ==UserScript==
// @name         Pinterest
// @namespace    https://github.com/Kadauchi
// @version      1.0.8
// @description  Does things...
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://sofia.pinadmin.com/*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/30737/Pinterest.user.js
// @updateURL https://update.greasyfork.org/scripts/30737/Pinterest.meta.js
// ==/UserScript==

function relevance () {
  $(`[name="questionAnswers.q1"][value="1"]`).click();
  $(`[name="questionAnswers.q2"][value="4"]`).click();

  taskObserver.observe($(`[name="taskAssignmentId"]`)[0], { attributes: true, childList: true, characterData: true });
}

function keybinds () {
  $(document).keydown(function (event) {
	const key = event.key;

	const $radio = $(`[type="radio"]`);
	if (event.key.match(/1|A/i) && $radio[0]) {
	  $radio[0].click();
	  $(`[type="submit"]`).eq(0).click();
	}
	if (event.key.match(/2|s/i) && $radio[1]) {
	  $radio[1].click();
	  $(`[type="submit"]`).eq(0).click();
	}
	if (event.key.match(/3|d/i) && $radio[2]) {
	  $radio[2].click();
	  $(`[type="submit"]`).eq(0).click();
	}
  });
}

const appObserver = new MutationObserver(function (mutations) {
  $(`.navbar.navbar-default`).eq(0).hide();
  $(`.panel.panel-default`).eq(0).hide();
  $(`h5`).eq(0).hide();
  $(`h1`).css({fontSize: `10px`});

  if ($(`h1:contains(Rate How Relevant a Pin Is to a Topic)`).length > 0) {
	relevance();
  }
  else {
	keybinds();
  }
});

const taskObserver = new MutationObserver(function (mutations) {
  if ($(`h1:contains(Rate How Relevant a Pin Is to a Topic)`).length > 0) relevance();
});

appObserver.observe($(`#app`)[0], { attributes: true, childList: true, characterData: true });
