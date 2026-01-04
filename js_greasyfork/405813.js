// ==UserScript==
// @name Utils
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 2.2.2
// @author rafaelgssa
// @description Useful library with JavaScript utilities.
// @match *://*/*
// ==/UserScript==

/**
 * @typedef {'m' | 'h' | 'd' | 'w' | 'M' | 'y'} TimeUnit 'm' for minutes, 'h' for hours, 'd' for days, 'w' for weeks, 'M' for months and 'y' for years
 */

// eslint-disable-next-line
const Utils = (() => {
	const ONE_SECOND_IN_MILLI = 1000;
	const ONE_MINUTE_IN_MILLI = ONE_SECOND_IN_MILLI * 60;
	const ONE_HOUR_IN_MILLI = ONE_MINUTE_IN_MILLI * 60;
	const ONE_DAY_IN_MILLI = ONE_HOUR_IN_MILLI * 24;
	const ONE_WEEK_IN_MILLI = ONE_DAY_IN_MILLI * 7;
	const ONE_MONTH_IN_MILLI = ONE_DAY_IN_MILLI * 30;

	/**
	 * Returns the plural form of a word if a number is different than 1, or the singular form otherwise.
	 * @param {string | [string, string]} wordOrPair If a word is provided, it is used as the singular form and the plural form is created by adding an 's' to the end of it. If a pair of words is provided, the first word is used as the singular form and the second word is used as the plural form.
	 * @param {number} n The number to use as reference.
	 * @param {boolean} doPrepend If true, the number is prepended to the output. Defaults to false.
	 * @returns {string} The word in the correct form, based on the number.
	 *
	 * @example
	 * Utils.getPlural('parent', 0); // 'parents'
	 * Utils.getPlural('parent', 1); // 'parent'
	 * Utils.getPlural('parent', 2); // 'parents'
	 * Utils.getPlural('parent', 0, true); // '0 parents'
	 * Utils.getPlural('parent', 1, true); // '1 parent'
	 * Utils.getPlural('parent', 2, true); // '2 parents'
	 * Utils.getPlural(['child', 'children'], 0); // 'children'
	 * Utils.getPlural(['child', 'children'], 1); // 'child'
	 * Utils.getPlural(['child', 'children'], 2); // 'children'
	 * Utils.getPlural(['child', 'children'], 0, true); // '0 children'
	 * Utils.getPlural(['child', 'children'], 1, true); // '1 child'
	 * Utils.getPlural(['child', 'children'], 2, true); // '2 children'
	 */
	const getPlural = (wordOrPair, n, doPrepend = false) => {
		let form;
		if (n === 1) {
			form = Array.isArray(wordOrPair) ? wordOrPair[0] : wordOrPair;
		} else {
			form = Array.isArray(wordOrPair) ? wordOrPair[1] : `${wordOrPair}s`;
		}
		return doPrepend ? `${n} ${form}` : form;
	};

	/**
	 * Returns a relative time string for a UNIX time.
	 * @param {number} unix The UNIX time.
	 * @param {TimeUnit} unit The unit to use. Defaults to 'y'.
	 * @returns {string} The relative time string.
	 */
	const getRelativeTimeFromUnix = (unix, unit = 'y') => {
		const now = Date.now() / 1e3;
		const minutes = Math.round(Math.abs(now - unix) / 60);
		return getRelativeTimeFromMinutes(minutes, unit);
	};

	/**
	 * Returns a relative time string for a number of minutes.
	 * @param {number} minutes The number of minutes.
	 * @param {TimeUnit} unit The unit to use. Defaults to 'y'.
	 * @returns {string} The relative time string.
	 *
	 * @example
	 * Utils.getRelativeTimeFromMinutes(30); // '30 minutes'
	 * Utils.getRelativeTimeFromMinutes(60); // 'about 1 hour'
	 * Utils.getRelativeTimeFromMinutes(60, 'm'); // '60 minutes'
	 * Utils.getRelativeTimeFromMinutes(60 * 24); // 'about 1 day'
	 * Utils.getRelativeTimeFromMinutes(60 * 24, 'h'); // 'about 24 hours'
	 * Utils.getRelativeTimeFromMinutes(60 * 24 * 7); // 'about 1 week'
	 * Utils.getRelativeTimeFromMinutes(60 * 24 * 7, 'd'); // 'about 7 days'
	 * Utils.getRelativeTimeFromMinutes(60 * 24 * 30); // 'about 1 month'
	 * Utils.getRelativeTimeFromMinutes(60 * 24 * 30, 'w'); // 'about 4 weeks'
	 * Utils.getRelativeTimeFromMinutes(60 * 24 * 30 * 12); // 'about 1 year'
	 * Utils.getRelativeTimeFromMinutes(60 * 24 * 30 * 12, 'M'); // 'about 12 months'
	 */
	const getRelativeTimeFromMinutes = (minutes, unit = 'y') => {
		if (minutes < 60 || unit === 'm') {
			return getPlural('minute', minutes, true);
		}
		const hours = Math.round(minutes / 60);
		if (hours < 24 || unit === 'h') {
			return `about ${getPlural('hour', hours, true)}`;
		}
		const days = Math.round(hours / 24);
		if (days < 7 || unit === 'd') {
			return `about ${getPlural('day', days, true)}`;
		}
		const weeks = Math.round(days / 7);
		if (weeks < 4 || unit === 'w') {
			return `about ${getPlural('week', weeks, true)}`;
		}
		const months = Math.round(days / 30);
		if (months < 12 || unit === 'M') {
			return `about ${getPlural('month', months, true)}`;
		}
		const years = Math.round(months / 12);
		return `about ${getPlural('year', years, true)}`;
	};

	/**
	 * Returns a date string in the 'yyyy-MM-dd hh:mm:ss UTC' format.
	 * @param {Date} date The date to format.
	 * @returns {string} The formatted date string.
	 */
	const getUtcString = (date) => {
		const isoString = date.toISOString(); // yyyy-MM-ddThh:mm:ss.sssZ
		return `${isoString.replace('T', ' ').slice(0, -5)} UTC`;
	};

	/**
	 * Checks if a value is set.
	 * @template T
	 * @param {T} value The value to check.
	 * @returns {value is NonNullable<T>} Whether the value is set or not.
	 */
	const isSet = (value) => {
		return typeof value !== 'undefined' && value !== null;
	};

	/**
	 * Sleeps for a number of seconds.
	 * @param {number} seconds How many seconds to sleep for.
	 * @returns {Promise<void>}
	 */
	const sleep = (seconds) => {
		return new Promise((resolve) => window.setTimeout(resolve, seconds * ONE_SECOND_IN_MILLI));
	};

	return {
		ONE_SECOND_IN_MILLI,
		ONE_MINUTE_IN_MILLI,
		ONE_HOUR_IN_MILLI,
		ONE_DAY_IN_MILLI,
		ONE_WEEK_IN_MILLI,
		ONE_MONTH_IN_MILLI,
		getPlural,
		getRelativeTimeFromUnix,
		getRelativeTimeFromMinutes,
		getUtcString,
		isSet,
		sleep,
	};
})();
