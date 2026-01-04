// ==UserScript==
// @name        Gitlab expand all discussions
// @description Add a new button to expand all discussions
// @include     https://gitlab.*/*
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/4947
// @downloadURL https://update.greasyfork.org/scripts/372961/Gitlab%20expand%20all%20discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/372961/Gitlab%20expand%20all%20discussions.meta.js
// ==/UserScript==

// https://gitlab.com/gitlab-org/gitlab-ce/issues/19149#note_103194373

'use strict';

const intervalDelay = 1000;
const buttonDelay = 200;

const State = Object.freeze({
	EMPTY: 'EMPTY',
	SOME_CLOSE: 'SOME_CLOSE',
	NO_CLOSE: 'NO_CLOSE',
});

const textMap = Object.freeze({
	[State.SOME_CLOSE]: 'expand all discussions',
	[State.NO_CLOSE]: 'collapse all discussions',
});

(function ready() {
	const templateDiv = $('.line-resolve-all');

	if (!templateDiv.length)
	{
		setTimeout(ready, intervalDelay);
		return;
	}

	function getToggleState() {
		const all = $('.discussion-toggle-button');
		if (!all.length) return State.EMPTY;

		const closed = all.filter(':has(i.fa-chevron-down)');

		return closed.length ? State.SOME_CLOSE : State.NO_CLOSE;
	}

	function updateDiv(state) {
		if (!(state in State)) state = getToggleState();

		if (state === State.EMPTY) {
			newDiv.hide();
			return;
		}

		newDiv.find('.line-resolve-text > a').text(textMap[state]);
	}

	function updateDivDelay() {
		setTimeout(updateDiv, buttonDelay);
		setTimeout(updateDiv, buttonDelay * 2);
	}

	const newDiv = templateDiv.clone();

	newDiv.find('.is-disabled').remove();
	newDiv.find('.line-resolve-text').attr('type', 'button').text('').append('<a>')
	newDiv.click(() => {
		const state = getToggleState();
		let nextState;

		switch (state) {
			case State.SOME_CLOSE:
				$('.discussion-toggle-button:has(i.fa-chevron-down)').click();
				nextState = State.NO_CLOSE;
				break;
			case State.NO_CLOSE:
				$('.discussion-toggle-button').click();
				nextState = State.SOME_CLOSE;
				break;
		}

		updateDiv(nextState);
	});

	updateDiv();

	templateDiv.after(newDiv);

	$(document).on('click', 'button', updateDivDelay);

	// Should we add toggle button? seems not useful
})();
