// ==UserScript==
// @name Persistent Storage
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 3.0.2
// @author rafaelgssa
// @description Useful library for dealing with the storage.
// @match *://*/*
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// ==/UserScript==

/* global Utils */

/**
 * @typedef {Record<string, unknown> & StorageValuesBase} StorageValues
 *
 * @typedef {Object} StorageValuesBase
 * @property {Record<string, unknown>} settings
 */

// eslint-disable-next-line
const PersistentStorage = (() => {
	let _id = '';

	const _defaultValues = /** @type {StorageValues} */ ({
		settings: {},
	});

	const _cache = /** @type {StorageValues} */ ({
		settings: {},
	});

	/**
	 * Initializes the storage.
	 * @param {string} id The ID to use for the local storage.
	 * @param {Partial<StorageValues>} [defaultValues] Any default values to set.
	 * @returns {Promise<void>}
	 */
	const init = (id, defaultValues) => {
		_id = id;
		if (defaultValues) {
			for (const [key, value] of Object.entries(defaultValues)) {
				setDefaultValue(key, value);
			}
		}
		return _updateCache('settings');
	};

	/**
	 * Sets a default value.
	 * @param {string} key The key of the default value to set.
	 * @param {unknown} value The default value to set.
	 */
	const setDefaultValue = (key, value) => {
		_defaultValues[key] = value;
	};

	/**
	 * Sets a value in the storage.
	 * @param {string} key The key of the value to set.
	 * @param {unknown} value The value to set.
	 * @returns {Promise<void>}
	 */
	const setValue = async (key, value) => {
		const stringifiedValue = JSON.stringify(value);
		await GM.setValue(key, stringifiedValue);
		_cache[key] = value;
	};

	/**
	 * Gets a value from the cache.
	 * @param {string} key The key of the value to get.
	 * @param {boolean} [updateCache] Whether to update the cache with the storage or not.
	 * @returns {Promise<unknown>} The value.
	 */
	const getValue = async (key, updateCache = false) => {
		if (!Utils.isSet(_cache[key]) || updateCache) {
			await _updateCache(key);
		}
		return _cache[key];
	};

	/**
	 * Updates a value in the cache with the storage.
	 * @param {string} key The key of the value to update.
	 * @returns {Promise<void>}
	 */
	const _updateCache = async (key) => {
		let value = await GM.getValue(key);
		if (typeof value === 'string') {
			try {
				value = JSON.parse(value);
			} catch (err) {
				// Value is already parsed, just ignore.
			}
		}
		_cache[key] = Utils.isSet(value) ? value : _defaultValues[key];
	};

	/**
	 * Deletes a value from the storage.
	 * @param {string} key The key of the value to delete.
	 * @returns {Promise<void>}
	 */
	const deleteValue = async (key) => {
		await GM.deleteValue(key);
		delete _cache[key];
	};

	/**
	 * Sets a value in the local storage.
	 * @param {string} key The key of the value to set.
	 * @param {unknown} value The value to set.
	 */
	const setLocalValue = (key, value) => {
		const stringifiedValue = JSON.stringify(value);
		window.localStorage.setItem(`${_id}_${key}`, stringifiedValue);
		_cache[key] = value;
	};

	/**
	 * Gets a value from the cache.
	 * @param {string} key The key of the value to get.
	 * @param {boolean} [updateCache] Whether to update the cache with the local storage or not.
	 * @returns {unknown} The value.
	 */
	const getLocalValue = (key, updateCache = false) => {
		if (!Utils.isSet(_cache[key]) || updateCache) {
			_updateLocalCache(key);
		}
		return _cache[key];
	};

	/**
	 * Updates a value in the cache with the local storage.
	 * @param {string} key The key of the value to update.
	 */
	const _updateLocalCache = (key) => {
		let value = window.localStorage.getItem(`${_id}_${key}`);
		if (typeof value === 'string') {
			try {
				value = JSON.parse(value);
			} catch (err) {
				// Value is already parsed, just ignore.
			}
		}
		_cache[key] = Utils.isSet(value) ? value : _defaultValues[key];
	};

	/**
	 * Deletes a value from the local storage.
	 * @param {string} key The key of the value to delete.
	 */
	const deleteLocalValue = (key) => {
		window.localStorage.removeItem(`${_id}_${key}`);
		delete _cache[key];
	};

	/**
	 * Sets a default setting.
	 * @param {string} key The key of the default setting to set.
	 * @param {unknown} setting The default setting to set.
	 */
	const setDefaultSetting = (key, setting) => {
		_defaultValues.settings[key] = setting;
	};

	/**
	 * Sets a setting in the cache.
	 * @param {string} key The key of the setting to set.
	 * @param {unknown} setting The setting to set.
	 */
	const setSetting = (key, setting) => {
		_cache.settings[key] = setting;
	};

	/**
	 * Gets a setting from the cache.
	 * @param {string} key The key of the setting to get.
	 * @param {boolean} [updateCache] Whether to update the settings cache with the storage or not.
	 * @returns {Promise<unknown>} The setting.
	 */
	const getSetting = async (key, updateCache = false) => {
		if (isSettingsEmpty() || !Utils.isSet(_cache.settings[key]) || updateCache) {
			await _updateCache('settings');
		}
		return _cache.settings[key];
	};

	/**
	 * Deletes a setting from the cache.
	 * @param {string} key The key of the setting to delete.
	 */
	const deleteSetting = (key) => {
		delete _cache.settings[key];
	};

	/**
	 * Saves the settings from the cache.
	 * @returns {Promise<void>}
	 */
	const saveSettings = () => {
		return setValue('settings', _cache.settings);
	};

	/**
	 * Checks if the settings cache is empty.
	 * @returns {boolean} Whether the settings cache is empty or not.
	 */
	const isSettingsEmpty = () => {
		return Object.keys(_cache.settings).length === 0;
	};

	return {
		init,
		setDefaultValue,
		setValue,
		getValue,
		deleteValue,
		setLocalValue,
		getLocalValue,
		deleteLocalValue,
		setDefaultSetting,
		setSetting,
		getSetting,
		deleteSetting,
		saveSettings,
		isSettingsEmpty,
	};
})();
