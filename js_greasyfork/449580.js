/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               LocalCDN
// @namespace          LocalCDN
// @version            0.1.1
// @description        LocalCDN: Webresource manager to request and cache web resources, aiming to make web requests faster and more reliable.
// @author             PY-DNG
// @license            GPL-v3
// @grant              none
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_xmlhttpRequest
// ==/UserScript==




// Loads web resources and saves them to GM-storage
// Tries to load web resources from GM-storage in subsequent calls
// Updates resources every $(this.expire) hours, or use $(this.refresh) function to update all resources instantly
// Dependencies: GM_getValue(), GM_setValue(), requestText(), AsyncManager()
function LocalCDN(expire=72) {
	// Arguments: level=LogLevel.Info, logContent, asObject=false
	// Needs one call "DoLog();" to get it initialized before using it!
	function DoLog() {
		// Get window
		const win = (typeof(unsafeWindow) === 'object' && unsafeWindow !== null) ? unsafeWindow : window;

		// Global log levels set
		win.LogLevel = {
			None: 0,
			Error: 1,
			Success: 2,
			Warning: 3,
			Info: 4,
		}
		win.LogLevelMap = {};
		win.LogLevelMap[LogLevel.None] = {
			prefix: '',
			color: 'color:#ffffff'
		}
		win.LogLevelMap[LogLevel.Error] = {
			prefix: '[Error]',
			color: 'color:#ff0000'
		}
		win.LogLevelMap[LogLevel.Success] = {
			prefix: '[Success]',
			color: 'color:#00aa00'
		}
		win.LogLevelMap[LogLevel.Warning] = {
			prefix: '[Warning]',
			color: 'color:#ffa500'
		}
		win.LogLevelMap[LogLevel.Info] = {
			prefix: '[Info]',
			color: 'color:#888888'
		}
		win.LogLevelMap[LogLevel.Elements] = {
			prefix: '[Elements]',
			color: 'color:#000000'
		}

		// Current log level
		DoLog.logLevel = win.isPY_DNG ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

		// Log counter
		DoLog.logCount === undefined && (DoLog.logCount = 0);

		// Get args
		let level, logContent, asObject;
		switch (arguments.length) {
			case 1:
				level = LogLevel.Info;
				logContent = arguments[0];
				asObject = false;
				break;
			case 2:
				level = arguments[0];
				logContent = arguments[1];
				asObject = false;
				break;
			case 3:
				level = arguments[0];
				logContent = arguments[1];
				asObject = arguments[2];
				break;
			default:
				level = LogLevel.Info;
				logContent = 'DoLog initialized.';
				asObject = false;
				break;
		}

		// Log when log level permits
		if (level <= DoLog.logLevel) {
			let msg = '%c' + LogLevelMap[level].prefix;
			let subst = LogLevelMap[level].color;

			if (asObject) {
				msg += ' %o';
			} else {
				switch (typeof(logContent)) {
					case 'string':
						msg += ' %s';
						break;
					case 'number':
						msg += ' %d';
						break;
					case 'object':
						msg += ' %o';
						break;
				}
			}

			if (++DoLog.logCount > 512) {
				console.clear();
				DoLog.logCount = 0;
			}
			console.log(msg, subst, logContent);
		}
	}
	DoLog();

	const LC = this;
	const _GM_getValue = GM_getValue;
	const _GM_setValue = GM_setValue;

	const KEY_LOCALCDN = 'LOCAL-CDN';
	const KEY_LOCALCDN_VERSION = 'version';
	const VALUE_LOCALCDN_VERSION = '0.3';

	// Default expire time (by hour)
	LC.expire = expire;

	// Try to get resource content from loaclCDN first, if failed/timeout, request from web && save to LocalCDN
	// Accepts callback only: onload & onfail(optional)
	// Returns true if got from LocalCDN, false if got from web
	LC.get = function(url, onload, args=[], onfail=function(){}) {
		const CDN = _GM_getValue(KEY_LOCALCDN, {});
		const resource = CDN[url];
		const time = (new Date()).getTime();

		if (resource && resource.content !== null && !expired(time, resource.time)) {
			onload.apply(null, [resource.content].concat(args));
			return true;
		} else {
			LC.request(url, _onload, [], onfail);
			return false;
		}

		function _onload(content) {
			onload.apply(null, [content].concat(args));
		}
	}

	// Generate resource obj and set to CDN[url]
	// Returns resource obj
	// Provide content means load success, provide null as content means load failed
	LC.set = function(url, content) {
		const CDN = _GM_getValue(KEY_LOCALCDN, {});
		const time = (new Date()).getTime();
		const resource = {
			url: url,
			time: time,
			content: content,
			success: content !== null ? (CDN[url] ? CDN[url].success + 1 : 1) : (CDN[url] ? CDN[url].success : 0),
			fail: content === null ? (CDN[url] ? CDN[url].fail + 1 : 1) : (CDN[url] ? CDN[url].fail : 0),
		};
		CDN[url] = resource;
		_GM_setValue(KEY_LOCALCDN, CDN);
		return resource;
	}

	// Delete one resource from LocalCDN
	LC.delete = function(url) {
		const CDN = _GM_getValue(KEY_LOCALCDN, {});
		if (!CDN[url]) {
			return false;
		} else {
			delete CDN[url];
			_GM_setValue(KEY_LOCALCDN, CDN);
			return true;
		}
	}

	// Delete all resources in LocalCDN
	LC.clear = function() {
		_GM_setValue(KEY_LOCALCDN, {});
		upgradeConfig();
	}

	// List all resource saved in LocalCDN
	LC.list = function() {
		const CDN = _GM_getValue(KEY_LOCALCDN, {});
		const urls = LC.listurls();
		return LC.listurls().map((url) => (CDN[url]));
	}

	// List all resource's url saved in LocalCDN
	LC.listurls = function() {
		return Object.keys(_GM_getValue(KEY_LOCALCDN, {})).filter((url) => (url !== KEY_LOCALCDN_VERSION));
	}

	// Request content from web and save it to CDN[url]
	// Accepts callbacks only: onload & onfail(optional)
	LC.request = function(url, onload, args=[], onfail=function(){}) {
		const CDN = _GM_getValue(KEY_LOCALCDN, {});
		requestText(url, _onload, [], _onfail);

		function _onload(content) {
			LC.set(url, content);
			onload.apply(null, [content].concat(args));
		}

		function _onfail() {
			LC.set(url, null);
			onfail(url);
		}
	}

	// Re-request all resources in CDN instantly, ignoring LC.expire
	LC.refresh = function(callback, args=[]) {
		const urls = LC.listurls();

		const AM = new AsyncManager();
		AM.onfinish = function() {
			callback.apply(null, [].concat(args))
		};

		for (const url of urls) {
			AM.add();
			LC.request(url, function() {
				AM.finish();
			});
		}

		AM.finishEvent = true;
	}

	// Sort src && srcset, to get a best request sorting
	LC.sort = function(srcset) {
		const CDN = _GM_getValue(KEY_LOCALCDN, {});
		const result = {srclist: [], lists: []};
		const lists = result.lists;
		const srclist = result.srclist;
		const suc_rec = lists[0] = []; // Recent successes take second (not expired yet)
		const suc_old = lists[1] = []; // Old successes take third
		const fails   = lists[2] = []; // Fails & unused take the last place
		const time = (new Date()).getTime();

		// Make lists
		for (const s of srcset) {
			const resource = CDN[s];
			if (resource && resource.content !== null) {
				if (!expired(resource.time, time)) {
					suc_rec.push(s);
				} else {
					suc_old.push(s);
				}
			} else {
				fails.push(s);
			}
		}

		// Sort lists
		// Recently successed: Choose most recent ones
		suc_rec.sort((res1, res2) => (res2.time - res1.time));
		// Successed long ago or failed: Sort by success rate & tried time
		[suc_old, fails].forEach((arr) => (arr.sort(sorting)));

		// Push all resources into seclist
		[suc_rec, suc_old, fails].forEach((arr) => (arr.forEach((res) => (srclist.push(res)))));

		return result;

		function sorting(res1, res2) {
			const sucRate1 = (res1.success+1) / (res1.fail+1);
			const sucRate2 = (res2.success+1) / (res2.fail+1);

			if (sucRate1 !== sucRate2) {
				// Success rate: high to low
				return sucRate2 - sucRate1;
			} else {
				// Tried time: less to more
				// Less tried time means newer added source
				return (res1.success+res1.fail) - (res2.success+res2.fail);
			}
		}
	}

	function upgradeConfig() {
		const CDN = _GM_getValue(KEY_LOCALCDN, {});
		switch(CDN[KEY_LOCALCDN_VERSION]) {
			case undefined:
				init();
				break;
			case '0.1':
				v01_To_v02();
				logUpgrade();
				break;
			case '0.2':
				v01_To_v02();
				v02_To_v03();
				logUpgrade();
				break;
			case VALUE_LOCALCDN_VERSION:
				DoLog('LocalCDN is in latest version.');
				break;
			default:
				DoLog(LogLevel.Error, 'LocalCDN.upgradeConfig: Invalid config version({V}) for LocalCDN. '.replace('{V}', CDN[KEY_LOCALCDN_VERSION]));
		}
		CDN[KEY_LOCALCDN_VERSION] = VALUE_LOCALCDN_VERSION;
		_GM_setValue(KEY_LOCALCDN, CDN);

		function logUpgrade() {
			DoLog(LogLevel.Success, 'LocalCDN successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', CDN[KEY_LOCALCDN_VERSION]).replaceAll('{V2}', VALUE_LOCALCDN_VERSION));
		}

		function init() {
			// Nothing to do here
		}

		function v01_To_v02() {
			const urls = LC.listurls();
			for (const url of urls) {
				if (url === KEY_LOCALCDN_VERSION) {continue;}
				CDN[url] = {
					url: url,
					time: 0,
					content: CDN[url]
				};
			}
		}

		function v02_To_v03() {
			const urls = LC.listurls();
			for (const url of urls) {
				CDN[url].success = CDN[url].fail = 0;
			}
		}
	}

	function clearExpired() {
		const resources = LC.list();
		const time = (new Date()).getTime();

		for (const resource of resources) {
			expired(resource.time, time) && LC.delete(resource.url);
		}
	}

	function expired(t1, t2) {
		return (t1 - t2) > (LC.expire * 60 * 60 * 1000);
	}

	upgradeConfig();
	clearExpired();


	function requestText(url, callback, args=[], onfail=function(){}) {
		GM_xmlhttpRequest({
			method:       'GET',
			url:          url,
			responseType: 'text',
			timeout:      45*1000,
			onload:       function(response) {
				const text = response.responseText;
				const argvs = [text].concat(args);
				callback.apply(null, argvs);
			},
			onerror:      onfail,
			ontimeout:    onfail,
			onabort:      onfail,
		})
	}

	function AsyncManager() {
		const AM = this;

		// Ongoing xhr count
		this.taskCount = 0;

		// Whether generate finish events
		let finishEvent = false;
		Object.defineProperty(this, 'finishEvent', {
			configurable: true,
			enumerable: true,
			get: () => (finishEvent),
			set: (b) => {
				finishEvent = b;
				b && AM.taskCount === 0 && AM.onfinish && AM.onfinish();
			}
		});

		// Add one task
		this.add = () => (++AM.taskCount);

		// Finish one task
		this.finish = () => ((--AM.taskCount === 0 && AM.finishEvent && AM.onfinish && AM.onfinish(), AM.taskCount));
	}
}


