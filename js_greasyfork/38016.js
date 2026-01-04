// ==UserScript==
// @name Hijack Worker
// @version 0.2.0
// @description Hijack web workers in the browser to stop coin miner
// @homepageURL https://github.com/eight04/hijack-worker
// @supportURL https://github.com/eight04/hijack-worker/issues
// @license MIT
// @author eight04 <eight04@gmail.com>
// @include *
// @namespace eight04.blogspot.com
// @require https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/38016/Hijack%20Worker.user.js
// @updateURL https://update.greasyfork.org/scripts/38016/Hijack%20Worker.meta.js
// ==/UserScript==

/* global GM_config */

let blacklist = [];
let whitelist = [];

GM_config.setup({
	whitelist: {
		label: "Allowed URLs (regexp per line)",
		type: "textarea",
		default: ""
	},
	blacklist: {
		label: "Restricted URLs (regexp per line)",
		type: "textarea",
		default: ""
	}
}, () => {
	const config = GM_config.get();
	whitelist = getRxList(config.whitelist);
	blacklist = getRxList(config.blacklist);
});

function getRxList(text) {
  return text.trim().split(/\s*\n\s*/).filter(Boolean).map(p => new RegExp(p, "i"));
}

unsafeWindow.Worker = (Worker => {
	return class extends Worker {
		constructor(url, ...args) {
			if (!valid(url)) {
				throw new Error(`Worker is not allowed: ${url}`);
			}
      super(url, ...args);
		}
	};
})(unsafeWindow.Worker);

unsafeWindow.SharedWorker = (SharedWorker => {
	return class extends SharedWorker {
		constructor(url, ...args) {
			if (!valid(url)) {
				throw new Error(`SharedWorker is not allowed: ${url}`);
			}
      super(url, ...args);
		}
	};
})(unsafeWindow.SharedWorker);

const tempBlacklist = new Set;
const tempWhitelist = new Set;

function valid(url) {
  if (tempWhitelist.has(url)) {
    return true;
  }
  if (tempBlacklist.has(url)) {
    return false;
  }
  for (const rx of whitelist) {
    if (rx.test(url)) {
      tempWhitelist.add(url);
      return true;
    }
  }
  for (const rx of blacklist) {
    if (rx.test(url)) {
      tempBlacklist.add(url);
      return false;
    }
  }
  const message = `Do you want to allow web worker?
- from: ${location.href}
- target: ${url}`;
  console.log(message); // eslint-disable-line no-console
  if (confirm(message)) {
    tempWhitelist.add(url);
    return true;
  }
  tempBlacklist.add(url);
  return false;
}
