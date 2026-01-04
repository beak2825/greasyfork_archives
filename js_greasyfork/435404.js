// ==UserScript==
// @name         WaniKani Lesson User Synonyms 3
// @namespace    https://greasyfork.org/users/317813
// @version      1.9
// @description  Adds the section "User Synonyms" to WaniKani lessons.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/lesson/session
// @match        https://preview.wanikani.com/lesson/session
// @homepageURL  https://community.wanikani.com/t/54399
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1111117
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435404/WaniKani%20Lesson%20User%20Synonyms%203.user.js
// @updateURL https://update.greasyfork.org/scripts/435404/WaniKani%20Lesson%20User%20Synonyms%203.meta.js
// ==/UserScript==

(function() {
    "use strict";
	/* global WaniKani, wkof, wkItemInfo, $ */

	if (!window.wkof) {
		if (confirm(`WaniKani Lesson User Synonyms 3 script requires Wanikani Open Framework.\nShow installation instructions?`)) {
			location.href = `https://community.wanikani.com/t/28549`;
		}
		return;
	}

	addCss();
	wkof.include(`Apiv2`);
	wkItemInfo.on(`lesson,lessonQuiz`).under(`meaning`).notifyWhenVisible(addUserSynonymSection);

	async function downloadUserSynonyms(itemId) {
		await wkof.ready(`Apiv2`);
		let response = await wkof.Apiv2.fetch_endpoint(`study_materials`, {filters: {subject_ids: [itemId]}, disable_progress_dialog: true});
		return response.data[0]?.data.meaning_synonyms || [];
	}

	function uploadUserSynonyms(itemId, itemType, synonyms) {
		let data = {study_material: {subject_type: itemType, subject_id: itemId, meaning_synonyms: synonyms}};
		fetch(`/study_materials/${itemId}`, {
			method: `PUT`,
			headers: {
				"Content-Type": `application/json; charset=utf-8`,
				"X-CSRF-Token": document.querySelector(`meta[name=csrf-token]`).content
			},
			body: JSON.stringify(data)
		});
	}

	function updateUserSynonymsInLessonQueue(itemId, synonyms) {
		let activeQueue = $.jStorage.get(`l/activeQueue`);
		let item = activeQueue.find(a => a.id === itemId);
		if (!item) return;
		item.syn = synonyms;
		$.jStorage.set(`l/activeQueue`, activeQueue);
	}

	function addUserSynonymSection(injectorState) {
		injectorState.injector.appendSideInfo(`User Synonyms`, userSynonymSection(injectorState)).classList.add(`user-synonyms`);
	}

	function userSynonymSection(injectorState) {
		let blacklist = $.jStorage.get(injectorState.on === `lesson` ? `l/currentLesson` : `l/currentQuizItem`).auxiliary_meanings.filter(m => m.type === `blacklist`).map(m => m.meaning.toLowerCase());
		let ul = document.createElement(`ul`);
		insertUserSynonyms(ul, injectorState, blacklist);
		let addSynonym = document.createElement(`li`);
		addSynonym.title = `Add your own synonym`;
		addSynonym.classList.add(`user-synonyms-add-btn`);
		addSynonym.addEventListener(`click`, e => clickOnAddSynonym(e, injectorState, blacklist));
		ul.append(addSynonym);
		return ul;
	}

	async function insertUserSynonyms(ul, injectorState, blacklist) {
		let userSynonyms = await downloadUserSynonyms(injectorState.id);
		ul.prepend(...userSynonyms.map(u => createSynonymElement(u, injectorState, blacklist)));
		updateUserSynonymsInLessonQueue(injectorState.id, userSynonyms);
	}

	function createSynonymElement(synonym, injectorState, blacklist) {
		let li = document.createElement(`li`);
		li.title = `Click to remove synonym`;
		li.textContent = synonym;
		li.style.maxWidth = `100%`;
		li.style.overflowWrap = `break-word`;
		li.addEventListener(`click`, e => clickOnSynonym(e, injectorState));
		if (blacklist.includes(synonym.toLowerCase())) li.classList.add(`on-blacklist`);
		return li;
	}

	function clickOnSynonym(event, injectorState) {
		let parent = event.currentTarget.parentElement;
		event.currentTarget.remove();
		readUserSynonymsFromHtmlAndUploadThem(parent, injectorState);
	}

	function clickOnAddSynonym(event, injectorState, blacklist) {
		let li = document.createElement(`li`);
		let form = document.createElement(`form`);
		let input = document.createElement(`input`);
		let bSubmit = document.createElement(`button`);
		let bCancel = document.createElement(`button`);
		let icon = document.createElement(`i`);
		li.classList.add(`user-synonyms-add-form`);
		input.type = `text`;
		input.autocapitalize = `none`;
		input.autocomplete = `off`;
		input.autocorrect = `off`;
		input.spellcheck = `false`;
		input.maxLength = 64;
		bCancel.type = `button`;
		bSubmit.type = `submit`;
		bSubmit.textContent = `Add`;
		icon.classList.add(`fa`, `fa-times`);
		compatibilityModeFix(form, input, injectorState, blacklist);
		form.addEventListener(`submit`, e => submitSynonym(e, injectorState, blacklist));
		input.addEventListener(`keydown`, e => e.stopPropagation());
		bCancel.addEventListener(`click`, clickOnCancel);
		bCancel.append(icon);
		form.append(input, bSubmit, bCancel);
		li.append(form);
		event.currentTarget.before(li);
		input.focus();
	}

	function compatibilityModeFix(form, input, injectorState, blacklist) {
		if (!WaniKani.wanikani_compatibility_mode) return;
		let delaySubmit = false;
		form.addEventListener(`submit`, e => { if (delaySubmit) e.stopImmediatePropagation(); e.preventDefault(); delaySubmit = false; });
		input.addEventListener(`keydown`, e => { if (e.code === `Enter`) delaySubmit = true; });
		input.addEventListener(`keyup`, e => { if (e.code === `Enter`) addSynonym(e.currentTarget.parentElement, injectorState, blacklist); e.stopPropagation(); });
	}

	function clickOnCancel(event) {
		event.currentTarget.parentElement.parentElement.remove();
	}

	function submitSynonym(event, injectorState, blacklist) {
		addSynonym(event.currentTarget, injectorState, blacklist);
		event.preventDefault();
	}

	function addSynonym(form, injectorState, blacklist) {
		let synonym = form[0].value.trim();
		let ul = form.parentElement.parentElement;
		if (!synonym || readUserSynonymsFromHtml(ul).includes(synonym)) return;
		let synonymElement = createSynonymElement(synonym, injectorState, blacklist);
		form.parentElement.before(synonymElement);
		form.parentElement.remove();
		readUserSynonymsFromHtmlAndUploadThem(ul, injectorState);
	}

	function readUserSynonymsFromHtmlAndUploadThem(ul, injectorState) {
		let userSynonyms = readUserSynonymsFromHtml(ul);
		uploadUserSynonyms(injectorState.id, injectorState.type, userSynonyms);
		updateUserSynonymsInLessonQueue(injectorState.id, userSynonyms);
	}

	function readUserSynonymsFromHtml(ul) {
		return [...ul.children].filter(c => !c.classList.contains(`user-synonyms-add-btn`) && !c.classList.contains(`user-synonyms-add-form`)).map(c => c.textContent);
	}

	function addCss() {
		let style = document.createElement(`style`);
		style.textContent = `
			.user-synonyms ul {
				margin: 0;
				padding: 0
			}

			.user-synonyms ul li {
				display: inline-block;
				line-height: 1.5em
			}

			.user-synonyms ul li:not(.user-synonyms-add-btn):not(.user-synonyms-add-form) {
				cursor: pointer;
				vertical-align: middle
			}

			.user-synonyms ul li:not(.user-synonyms-add-btn):not(.user-synonyms-add-form):after {
				content: '\\f00d';
				margin-left: 0.5em;
				margin-right: 1.5em;
				padding: 0.15em 0.3em;
				color: #a2a2a2;
				background-color: #eee;
				font-size: 0.5em;
				font-family: FontAwesome;
				-webkit-border-radius: 3px;
				-moz-border-radius: 3px;
				border-radius: 3px;
				-webkit-transition: background-color 0.3s linear, color 0.3s linear;
				-moz-transition: background-color 0.3s linear, color 0.3s linear;
				-o-transition: background-color 0.3s linear, color 0.3s linear;
				transition: background-color 0.3s linear, color 0.3s linear;
				vertical-align: middle
			}

			.user-synonyms ul li:not(.user-synonyms-add-btn):not(.user-synonyms-add-form):hover:after {
				background-color: #f03;
				color: #fff
			}

			.user-synonyms ul li.user-synonyms-add-btn {
				cursor: pointer;
				display: block;
				font-size: 0.75em;
				margin-top: 0.25em
			}

			.user-synonyms ul li.user-synonyms-add-btn:after {
				content: ''
			}

			.user-synonyms ul li.user-synonyms-add-btn:before {
				content: '+ ADD SYNONYM';
				margin-right: 0.5em;
				padding: 0.15em 0.3em;
				background-color: #eee;
				color: #a2a2a2;
				-webkit-transition: background-color 0.3s linear, color 0.3s linear;
				-moz-transition: background-color 0.3s linear, color 0.3s linear;
				-o-transition: background-color 0.3s linear, color 0.3s linear;
				transition: background-color 0.3s linear, color 0.3s linear;
				-webkit-border-radius: 3px;
				-moz-border-radius: 3px;
				border-radius: 3px
			}

			.user-synonyms ul li.user-synonyms-add-btn:hover:before {
				background-color: #a2a2a2;
				color: #fff
			}

			.user-synonyms ul li.user-synonyms-add-form {
				display: block
			}

			.user-synonyms ul li.user-synonyms-add-form form {
				display: block;
				margin: 0;
				padding: 0
			}

			.user-synonyms ul li.user-synonyms-add-form form input,.user-synonyms ul li.user-synonyms-add-form form button {
				line-height: 1em
			}

			.user-synonyms ul li.user-synonyms-add-form form input {
				outline: none;
				display: block;
				width: 100%;
				margin: 0;
				padding: 0;
				border: 0;
				border-bottom: 1px solid #a2a2a2
			}

			.user-synonyms ul li.user-synonyms-add-form form button {
				outline: none;
				background-color: #eee;
				color: #a2a2a2;
				font-size: 0.75em;
				border: none;
				-webkit-transition: background-color 0.3s linear, color 0.3s linear;
				-moz-transition: background-color 0.3s linear, color 0.3s linear;
				-o-transition: background-color 0.3s linear, color 0.3s linear;
				transition: background-color 0.3s linear, color 0.3s linear;
				-webkit-border-radius: 3px;
				-moz-border-radius: 3px;
				border-radius: 3px
			}

			.user-synonyms ul li.user-synonyms-add-form form button:hover {
				background-color: #a2a2a2;
				color: #fff
			}

			.user-synonyms ul li.user-synonyms-add-form form button:disabled {
				cursor: default;
				background-color: red;
				color: #fff
			}

			.user-synonyms ul li.user-synonyms-add-form form button[type=button] {
				margin-left: 0.25em;
				padding-left: 0.3em;
				padding-right: 0.3em
			}

			.user-synonyms ul li.user-synonyms-add-form form button[type=button]:hover {
				background-color: red;
				color: #fff
			}

			.user-synonyms .user-synonyms-add-form + .user-synonyms-add-btn {
				display: none
			}

			.item-info-injector.user-synonyms li + li + li + li + li + li + li + li + * {
				display: none
			}

			.user-synonyms .on-blacklist {
				color: red
			}
		`; // except for the last three rules, the CSS is copied from the WK review page.
		document.head.appendChild(style);
	}
})();
