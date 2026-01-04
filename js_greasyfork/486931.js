// ==UserScript==
// @name		FrankerFaceZ
// @namespace	FrankerFaceZ
//
// @version		1.59.2
//
// @description	FrankerFaceZ gives Twitch users custom chat emotes and introduces new features to improve the viewing experience.
// @homepageURL	https://www.frankerfacez.com/
// @icon		https://cdn.frankerfacez.com/script/icon32.png
// @icon64		https://cdn.frankerfacez.com/script/icon64.png
//
// @include		http://twitch.tv/*
// @include		https://twitch.tv/*
// @include		http://*.twitch.tv/*
// @include		https://*.twitch.tv/*
//
// @exclude		http://api.twitch.tv/*
// @exclude		https://api.twitch.tv/*
//
// @grant		unsafeWindow
// @grant		GM.setValue
// @grant		GM.getValue
// @grant		GM.getValues
// @grant		GM.deleteValue
// @grant		GM.deleteValues
// @grant		GM.listValues
// @grant		GM_addValueChangeListener
// @grant		GM_removeValueChangeListener
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/486931/FrankerFaceZ.user.js
// @updateURL https://update.greasyfork.org/scripts/486931/FrankerFaceZ.meta.js
// ==/UserScript==

function ffz_provider_init() {

	if ('wrappedJSObject' in window) {
		console.warn('FFZ: Firefox xray vision isolation detected. Settings provider will not be registered.');
		return;
	}

	try {
		if (typeof GM.listValues !== 'function')
			return;
	} catch(err) {
		console.warn('FFZ: Unable to access user-script storage API. Settings provider will not be registered.');
		return;
	}

	let providers;
	try {
		providers = unsafeWindow.ffz_providers = unsafeWindow.ffz_providers || [];
	} catch(err) {
		console.warn('FFZ: Unable to access unsafeWindow. Settings provider will not be registered.');
		return;
	}

	providers.push(evt => {
		class UserScriptProvider extends evt.Provider {
			static priority = 20;
			static title = 'User-Script Storage';
			static description = 'User-script managers provider a mechanism for user-scripts to store data.';

			static supported() {
				return true;
			}

			static crossOrigin() {
				return true;
			}

			static hasContent() {
				const IGNORE_CONTENT_KEYS = evt.IGNORE_CONTENT_KEYS || [];
				return GM.listValues().then(arr => Array.isArray(arr) && arr.filter(x => x !== '--sync--' && ! IGNORE_CONTENT_KEYS.includes(x)).length > 0);
			}

			constructor(manager) {
				super(manager);

				this._cached = new Map;
				this.loadAllValues();

				this._boundHandleMessage = this.handleMessage.bind(this);
				this._handler_id = GM_addValueChangeListener('--sync--', this._boundHandleMessage);
			}

			broadcastTransfer() {
				this.broadcast({type: 'change-provider'});
			}

			removeListeners() {
				if ( this._handler_id != null ) {
					GM_removeValueChangeListener(this._handler_id);
					this._boundHandleMessage = this._handler_id = null;
				}
			}

			disableEvents() {
				this.removeListeners();
				this.broadcast = () => {};
				this.emit = () => {};
			}

			destroy() {
				this.disable();
				this._cached.clear();
			}

			disable() {
				this.removeListeners();
				this.disabled = true;
			}

			flush() { /* no-op */ }

			broadcast(msg) {
				if ( this._handler_id != null )
					GM.setValue('--sync--', {...msg, t: Date.now()});
			}

			awaitReady() {
				if ( this.ready )
					return Promise.resolve();
				else if ( ! this._ready_promise )
					this._ready_promise = new Promise(resolve => {
						this._resolve_ready = resolve;
					});
				return this._ready_promise;
			}

			async loadAllValues() {
				const keys = await GM.listValues();
				const stuff = await GM.getValues(keys);
				for(const [key,val] of Object.entries(stuff)) {
					if (key !== '--sync--')
						this._cached.set(key, val);
				}

				this.ready = true;
				if ( this._resolve_ready ) {
					this._resolve_ready();
					this._resolve_ready = null;
				}
			}

			async handleMessage(k, old, event, remote) {
				if ( this.disabled || ! event || ! remote )
					return;

				const {type, key} = event;
				this.manager.log.debug('storage broadcast event', type, key);

				if ( type === 'change-provider') {
					this.manager.log.info('Received notice of changed settings provider.');
					this.emit('change-provider');
					this.disable();
					this.disableEvents();

				} else if ( type === 'set' ) {
					const val = await GM.getValue(key);
					this._cached.set(key, val);
					this.emit('changed', key, val, false);

				} else if ( type === 'delete' ) {
					this._cached.delete(key);
					this.emit('changed', key, undefined, true);

				} else if ( type === 'clear' ) {
					const old_keys = Array.from(this._cached.keys());
					this._cached.clear();
					for(const key of old_keys)
						this.emit('changed', key, undefined, true);
				}
			}

			get(key, default_value) {
				return this._cached.has(key) ? this._cached.get(key) : default_value;
			}

			set(key, value) {
				if ( this.disabled )
					return;

				if ( value === undefined ) {
					if ( this.has(key) )
						this.delete(key);
					return;
				}

				this._cached.set(key, value);
				GM.setValue(key, value)
					.then(() => this.broadcast({type: 'set', key}))
					.catch(err => {
						if ( this.manager )
							this.manager.log.error(`An error occurred while trying to save a value to user-script storage for key "${key}"`);
					});

				this.emit('set', key, value, false);
			}

			delete(key) {
				if ( this.disabled )
					return;

				this._cached.delete(key);
				GM.deleteValue(key)
					.then(() => this.broadcast({type: 'delete', key}));
				this.emit('set', key, undefined, true);
			}

			has(key) {
				return this._cached.has(key);
			}

			keys() {
				return this._cached.keys();
			}

			clear() {
				if ( this.disabled )
					return;

				const old_cache = this._cached;
				this._cached = new Map;

				for(const key of old_cache.keys()) {
					GM.deleteValue(key);
					this.emit('changed', key, undefined, true);
				}

				this.broadcast({type: 'clear'});
			}

			entries() {
				return this._cached.entries();
			}

			get size() {
				return this._cached.size;
			}
		}

		evt.registerProvider('userscript', UserScriptProvider);
	});

}

async function ffz_init() {
	const script = document.createElement('script');

	script.id = 'ffz_script';
	script.type = 'text/javascript';
	script.src = `//cdn2.frankerfacez.com/script/script.min.js?_=${Date.now()}`;

	if ( localStorage.ffzDebugMode == 'true' ) {
		// Developer Mode is enabled. But is the server running? Check before
		// we include the script, otherwise someone could break their
		// experience and not be able to recover.
		let resp;
		try {
			resp = await fetch('//localhost:8000/dev_server').then(r => r.ok ? r.json() : null).catch(() => null);
		} catch(err) { resp = null; }

		if ( resp ) {
			console.log(`FFZ: Development Server is present. Version ${resp.version} running from: ${resp.path}`);
			script.src = `//localhost:8000/script/script.js?_=${Date.now()}`;
			document.body.classList.add('ffz-dev');
		} else
			console.log('FFZ: Development Server is not present. Using CDN.');
	}

	ffz_provider_init();
	document.head.appendChild(script);
}

async function ffz_extension_check() {
	try {
		const ffz = unsafeWindow.ffz;
		const FFZ = unsafeWindow.FrankerFaceZ;
		if ( ! ffz || ! FFZ?.utilities?.constants?.EXTENSION )
			return;

		const provider = await ffz.resolve('settings').awaitProvider();
		const last = provider.get('us-extension-warning', 0);

		if ( last && Date.now() - last < 1000 * 60 * 60 * 24 * 30 )
			return; // Don't show the warning more than once a month.

		provider.set('us-extension-warning', Date.now());

		ffz.resolve('site.menu_button').addToast({
			icon: 'ffz-i-zreknarf',
			title: 'User-Script Conflict',
			title_i18n: 'user-script.conflict.title',
			text: 'You have both the FrankerFaceZ browser extension and user-script installed. You should disable the browser extension to avoid conflicts and ensure you always receive the latest version of FFZ.',
			text_i18n: 'user-script.conflict.text',
		});

	} catch(err) {
		console.error(err);
		/* no-op */
	}
}

ffz_init();
setTimeout(ffz_extension_check, 5000);
