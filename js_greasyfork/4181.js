//
// ==UserScript==
// @name          Toggle Passwords
// @namespace     http://jaron.nl/
// @description   Places an eye-icon at the right side of every password field. Clicking this icon toggles the display of all passwords between •••• and text.(submitting a form will allways revert the fields to type=password, to make sure no auto-completion information is stored for these fields by your browser.)
// @version 2.0.6
// @include       *
// @exclude       
// @downloadURL https://update.greasyfork.org/scripts/4181/Toggle%20Passwords.user.js
// @updateURL https://update.greasyfork.org/scripts/4181/Toggle%20Passwords.meta.js
// ==/UserScript==
(() => {
	const hideIconUrl = 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60"><path d="M45 15c-2.8 0-5.3.8-7.6 2.1 1.3 1.1 2.1 2.7 2.1 4.5 0 3.2-2.6 5.8-5.8 5.8-1.2 0-2.4-.4-3.3-1-.2 1.1-.4 2.3-.4 3.6 0 8.3 6.7 15 15 15s15-6.7 15-15-6.7-15-15-15z"/><g stroke="black" stroke-width="7" stroke-miterlimit="10"><path fill="none" stroke-linecap="round" d="M5 55L85 5"/><path d="M85 30S67.1 55 45 55 5 30 5 30 22.9 5 45 5s40 25 40 25z" fill="none"/></g></svg>';
	const showIconUrl = 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60"><style></style><g id="Layer_4"><path d="M85 30S67.1 55 45 55 5 30 5 30 22.9 5 45 5s40 25 40 25z" fill="none" stroke="black" stroke-width="7" stroke-miterlimit="10"/><path d="M45 15c-2.8 0-5.3.8-7.6 2.1 1.3 1.1 2.1 2.7 2.1 4.5 0 3.2-2.6 5.8-5.8 5.8-1.2 0-2.4-.4-3.3-1-.2 1.1-.4 2.3-.4 3.6 0 8.3 6.7 15 15 15s15-6.7 15-15-6.7-15-15-15z"/></g></svg>'
	const css = `
		.tggl-pw {
			--icon-width: 18px;
			--icon-height: calc(2 * var(--icon-width) / 3);
			--pd-v: 10px;
			--pd-h: 15px;

			position: relative;
			display: inline-block;
			border-radius: 5px;
			background: white;
			vertical-align: middle;
		}

		.tggl-pw__btn {
			--hide-icon: url('${hideIconUrl}');

			--show-icon: url('${showIconUrl}');

			position: absolute;
			z-index: 1;
			top: 50%;
			right: 5px;
			width: 100%;
			height: 100%;
			border: none;
			border-radius: 3px;
			padding: var(--pd-v) var(--pd-h);
			width: 0;
			height: 0;
			transform: translateY(-50%);
			cursor: pointer;
			background: var(--show-icon) center center no-repeat;
			background-size: var(--icon-width) var(--icon-height);
			background-color: white;
			opacity: 0.5;
			transition: opacity 0.3s ease-in-out;
		}

		.tggl-pw__btn:hover,
		.tggl-pw__btn:focus {
			opacity: 0.8;
		}

		.tggl-pw__btn:hover {
			outline: none;
		}

		.tggl-pw__btn--hide {
			background-image: var(--hide-icon);
		}
	`;

	let pwFields = [];
	let allToggleBtns = [];
	let stylesAdded = false;
	const attributes = {
		id: 'data-toggl-pw-id',
		form: 'data-toggl-pw-form'
	};

	/**
	* add a toggle to a password field
	* @returns {undefined}
	*/
	const addToggle = function(pwField) {
		const span = document.createElement('span');
		const btn = document.createElement('button');
		const id = Math.floor(1000000 * Math.random());
		pwField.setAttribute(attributes.id, id);
		span.classList.add('tggl-pw');
		btn.classList.add('tggl-pw__btn');
		btn.type = 'button';
		btn.title = 'toggle all password fields';
		btn.setAttribute(attributes.id, id);
		btn.tabIndex = -1;
		span.appendChild(btn);
		btn.addEventListener('click', toggleAllFields);
		pwField.after(span);
		allToggleBtns.push(btn);
	};

	/**
	* toggle all password fields
	* @returns {undefined}
	*/
	const toggleAllFields = function(e) {
		let newType;
		const tgtId = e.target.getAttribute(attributes.id);
		pwFields.forEach((pwField) => {
			if (!newType) {
				// when we get to first field; this will determine all field's new type
				newType = (pwField.type === 'password') ? 'text' : 'password';
			}
			pwField.type = newType;

			allToggleBtns.forEach((btn) => {
				if (pwField.type === 'password') {
					btn.classList.remove('tggl-pw__btn--hide');
				} else {
					btn.classList.add('tggl-pw__btn--hide');
				}
			});

		});
		if (newType === 'text') {
			document.querySelector(`[data-toggl-pw-id="${tgtId}"]`).select();
		}
	};
	
	

	/**
	* reset all password fields to type password
	* @returns {undefined}
	*/
	const resetAllPwFields = function(e) {
		pwFields.forEach(pwField => { pwField.type = 'password'; })
	};
	

	/**
	* initialize
	* @returns {undefined}
	*/
	const init = function(isFirstRun = true) {
		pwFields = document.querySelectorAll(`input[type='password']`) ;
		if (pwFields.length > 0) {
			pwFields.forEach((pwField) => {
				if (pwField.getAttribute(attributes.id) === null) {
					// on second run, only add new fields
					addToggle(pwField);
					const currForm = pwField.closest('form');
					if (currForm && currForm.getAttribute(attributes.form) !== 'true') {
						currForm.addEventListener('submit', resetAllPwFields);
						currForm.setAttribute(attributes.form, true);
					}
				}
			});

			if (!stylesAdded) {
				// don't add styles again on second run if they had already been added on first run
				const styles = document.createElement('style');
				styles.innerHTML = css;
				document.querySelector('head').appendChild(styles);
				stylesAdded = true;
			}
		}

		if (isFirstRun) {
			// sometimes password field get inserted by script, so they may not yet be present yet. re-run init again in 1000ms to catch those cases too
			setTimeout(() => { init(false); }, 1000);
		}
	};
	

	init();
})();