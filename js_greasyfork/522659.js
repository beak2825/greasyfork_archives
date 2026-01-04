// ==UserScript==
// @name        Bugzilla - Merge Comments
// @description Merge comments by the same user on several Bugzilla 5.0.4 instance, merge "Updated" / auxiliary changes by the same user on Mozilla Bugzilla.
// @namespace   RainSlide
// @author      RainSlide
// @license     AGPL-3.0-or-later
// @version     1.1
// @icon        https://www.bugzilla.org/assets/favicon/favicon.ico
// @match       https://bugzilla.mozilla.org/show_bug.cgi?*
// @match       https://bugzilla.redhat.com/show_bug.cgi?*
// @match       https://bugs.kde.org/show_bug.cgi?*
// @grant       none
// @inject-into content
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/522659/Bugzilla%20-%20Merge%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/522659/Bugzilla%20-%20Merge%20Comments.meta.js
// ==/UserScript==

"use strict";

const $ = (tagName, ...props) => Object.assign(
	document.createElement(tagName), ...props
);

// "move" an id, from an element, to another element
const moveId = (from, to) => {
	const id = from.id;
	from.removeAttribute("id");
	to.id = id;
};

if (location.hostname !== "bugzilla.mozilla.org") {
// Bugzilla 5.0.4; they are easier to deal with

let css = `.bz_comment_text > .bz_comment_number,
.bz_comment_text > .bz_comment_time {
	float: right;
	white-space: normal;
}
.bz_comment_text > .bz_comment_time {
	font-family: monospace;
}
.bz_comment_text:not(:hover):not(:target) > .bz_comment_time {
	opacity: .5;
}
.bz_comment:target,
.bz_comment_text:target {
	outline: 2px solid #006cbf;
}
.bz_comment_text:target {
	outline-offset: 2px;
	z-index: 1;
}`;

if (location.hostname === "bugzilla.redhat.com") css += `
.bz_comment_text:not(:last-child) { border-bottom: 1px solid; }
.bz_comment_text:target { outline-offset: 6px; }`;

document.head.append($("style", { textContent: css }));

// groups of continuous comments by the same user
const groups = [];

let currentUser = null;
document.querySelectorAll(".bz_first_comment ~ .bz_comment").forEach(comment => {

	// get & check user vcard element
	const user = comment.querySelector(":scope .bz_comment_user > .vcard");
	if (user === null) {
		throw new TypeError('Element ".bz_comment .bz_comment_user > .vcard" not found!');
	}

	// check if is the same user
	if (user.textContent !== currentUser) {
		// different user, set currentUser, add a new group directly
		currentUser = user.textContent;
		groups.push([comment]);
	} else {
		// same user, push to current group
		groups.at(-1).push(comment);
	}
});

const prepareText = comment => {

	// get & check .bz_comment_text
	const text   = comment.querySelector(":scope .bz_comment_text");
	if (text === null) {
		throw new TypeError('Element ".bz_comment .bz_comment_text" not found!');
	}

	// prepend metadata elements (.bz_comment_number, .bz_comment_time)
	// into .bz_comment_text if they exist
	text.prepend(
		...["number", "time"]
		.map(name => comment.querySelector(`:scope .bz_comment_${name}`))
		.filter(element => element)
	);

	return text;
};

groups.forEach(group => {
	if (group.length < 2) return;

	const first = group[0];
	prepareText(first);

	// starts from 1 to skip the first comment
	for (let i = 1; i < group.length; i++) {
		const comment = group[i];
		const text = prepareText(comment);
		moveId(comment, text);
		first.append(text);
		comment.remove();
	}
});



} else {

// bugzilla.mozilla.org

const css = `.activity .changes-container {
	display: flex;
	align-items: center;
}
.activity .changes-separator {
	display: inline-block;
	transform: scaleY(2.5);
	white-space: pre;
}
.activity .change-name,
.activity .change-time {
	font-size: var(--font-size-medium);
}
.changes-container:target,
.change:target {
	outline: 2px solid var(--focused-control-border-color);
}`;

document.head.append($("style", { textContent: css }));

// Continuous groups of:
// 1. auxiliary .change-set (.change-set with no comment text, id starts with "a")
// 2. by the same author
const aGroups = [];

let currentAuthor = null;
let newGroup = true;
document.querySelectorAll("#main-inner > .change-set").forEach(changeSet => {

	// check if is auxiliary change set
	if (changeSet.id[0] !== "a") {
		// no, no longer continuous, add a new group for next auxiliary change set
		newGroup = true;
		return;
	}

	// get & check author vcard element
	const author = changeSet.querySelector(":scope .change-author > .vcard");
	if (author === null) {
		throw new TypeError('Element ".change-set .change-author > .vcard" not found!');
	}

	// check if is the same author
	if (author.textContent !== currentAuthor) {
		// different author, set currentAuthor, add a new group directly
		currentAuthor = author.textContent;
		aGroups.push([changeSet]);
		newGroup = false;
	} else if (!newGroup) {
		// same author, push to current group
		aGroups.at(-1).push(changeSet);
	} else {
		// same author, add a new group
		aGroups.push([changeSet]);
		newGroup = false;
	}

});

// append .change to .activity, create container if needed
const appendChanges = (changeSet, activity, isFirst) => {

	// get & check .change element(s)
	const changes = changeSet.querySelectorAll(":scope > .activity > .change");
	if (changes.length === 0) {
		throw new TypeError('Element(s) ".change-set > .activity > .change" not found!');
	}

	// get name & time
	const tr = changeSet.querySelector(
		':scope > .change > .change-head > tbody > tr[id^="ar-a"]:nth-of-type(2)'
	);
	const td = tr?.querySelector(":scope > td:only-child");

	// move name & time into .change or .changes-container, append .changes-container
	if (tr && td) {
		if (changes.length > 1) {
			// a group of .change, create container for nameTime & themselves
			const container = $("div", { className: "changes-container" });
			const group     = $("div", { className: "changes" });
			const nameTime  = $("div", { id: tr.id });
			const separator = $("span", { className: "changes-separator", textContent: "| " });
			nameTime.append(...td.childNodes, separator);
			group.append(...changes);
			container.append(nameTime, group);
			tr.remove();

			// appending .changes-container

			// "move" an id onto another existing element might mess up the :target highlight,
			// so skip that for the first
			if (!isFirst) {
				moveId(changeSet, container);
			}
			// but, first .changes-container needs append!
			activity.append(container);

			return;

		} else {
			// only one .change, don't create container, just move nameTime to changes[0]
			const nameTime = $("span", { id: tr.id });
			nameTime.append(...td.childNodes, "| ");
			changes[0].prepend(nameTime);
			tr.remove();

			// no return here, append in if (!isFirst) ... below
		}
	}

	// appending .change / a group of .change

	// first doesn't need move id, see before;
	// first .change is already in .activity, doesn't need append either.
	if (!isFirst) {
		moveId(changeSet, changes[0]);
		activity.append(...changes);
	}

};

// merge the .change of each aGroup into the first .change-set with appendChanges()
aGroups.forEach(group => {
	if (group.length < 2) return;

	const first = group[0];
	const activity = first.querySelector(":scope > .activity");
	appendChanges(first, activity, true);

	// starts from 1 to skip the first change set
	for (let i = 1; i < group.length; i++) {
		appendChanges(group[i], activity);
		group[i].remove();
	}
});

}
