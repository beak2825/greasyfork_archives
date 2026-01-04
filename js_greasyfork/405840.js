// ==UserScript==
// @name Settings Wizard
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 2.0.2
// @author rafaelgssa
// @description Useful library for running a basic settings wizard.
// @match *://*/*
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js
// @require https://greasyfork.org/scripts/405831-monkey-storage/code/Monkey%20Storage.js
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// ==/UserScript==

/* global PersistentStorage, Utils */

/**
 * @typedef {Object} WizardSchema
 * @property {'string' | 'number' | 'multi'} type
 * @property {string} id
 * @property {string} message
 * @property {unknown} defaultValue
 * @property {number} [min] Only available for 'number' type.
 * @property {number} [max] Only available for 'number' type.
 * @property {WizardChoiceSchema[]} [choices] Only available for 'multi' type.
 *
 * @typedef {Object} WizardChoiceSchema
 * @property {string} id
 * @property {string} template
 * @property {unknown} value
 */

// eslint-disable-next-line
const SettingsWizard = (() => {
	let _id = '';

	let _name = '';

	let _schemas = /** @type {WizardSchema[]} */ ([]);

	/**
	 * Initializes the wizard.
	 * @param {string} id The ID to use for the wizard URL.
	 * @param {string} name The name to show in dialogs.
	 * @param {WizardSchema[]} schemas The schemas for the settings.
	 * @returns {Promise<void>}
	 */
	const init = (id, name, schemas) => {
		_id = id;
		_name = name;
		_schemas = schemas;
		return run();
	};

	/**
	 * Runs the wizard.
	 * @returns {Promise<void>}
	 */
	const run = async () => {
		if (window.location.search !== `?${_id}=wizard`) {
			return;
		}
		const mainTitle = `${_name} Wizard`;
		for (const schema of _schemas) {
			const value = _readValue(mainTitle, schema);
			PersistentStorage.setSetting(schema.id, value);
		}
		await PersistentStorage.saveSettings();
		window.alert(`${mainTitle}\n\nDone!`);
	};

	/**
	 * Reads a value in the wizard.
	 * @param {string} mainTitle
	 * @param {WizardSchema} schema
	 * @returns {unknown}
	 */
	const _readValue = (mainTitle, schema) => {
		const title = `${mainTitle}\n\n${schema.message}`;
		switch (schema.type) {
			case 'string':
				return _readStringValue(title);
			case 'number':
				return _readNumberValue(title, schema);
			case 'multi':
				return _readMultiValue(title, schema);
			// no default
		}
	};

	/**
	 * @param {string} title
	 * @returns {string}
	 */
	const _readStringValue = (title) => {
		const inputValue = window.prompt(`${title} Enter the string.`);
		return Utils.isSet(inputValue) ? inputValue : '';
	};

	/**
	 * @param {string} title
	 * @param {WizardSchema} schema
	 * @returns {number}
	 */
	const _readNumberValue = (title, schema) => {
		let value = 0.0;
		do {
			const inputValue = window.prompt(
				`${title} Enter the number from ${schema.min} to ${schema.max}.`
			);
			try {
				value = Utils.isSet(inputValue) ? parseFloat(inputValue) : 0.0;
				if (Number.isNaN(value)) {
					throw new Error('Invalid number');
				}
			} catch (err) {
				// Value is not a number, just ignore.
				value = 0.0;
			}
		} while (value < schema.min || value > schema.max);
		return value;
	};

	/**
	 * @param {string} title
	 * @param {WizardSchema} schema
	 * @returns {unknown}
	 */
	const _readMultiValue = (title, schema) => {
		let choice;
		const choiceList = schema.choices
			.map((schemaChoice) => schemaChoice.template.replace(/%/, schemaChoice.id))
			.join(' or ');
		do {
			const inputValue = window.prompt(`${title} Type ${choiceList}`);
			choice = schema.choices.find((schemaChoice) => schemaChoice.id === inputValue);
		} while (!Utils.isSet(choice));
		return choice.value;
	};

	return {
		init,
		run,
	};
})();
