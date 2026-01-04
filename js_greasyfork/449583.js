/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               ConfigManager
// @namespace          ConfigManager
// @version            0.8.2
// @description        ConfigManager: Manage(Get, set and update) your config with config path simply with a ruleset!
// @author             PY-DNG
// @license            GPL-v3
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// ==/UserScript==

function ConfigManager(Ruleset, storage={}) {
	const CM = this;
	const _GM_setValue = storage?.GM_setValue || GM_setValue || Err('ConfigManager: could not find GM_setValue');
	const _GM_getValue = storage?.GM_getValue || GM_getValue || Err('ConfigManager: could not find GM_getValue');
	const _GM_listValues = storage?.GM_listValues || GM_listValues || Err('ConfigManager: could not find GM_listValues');
	const _GM_deleteValue = storage?.GM_deleteValue || GM_deleteValue || Err('ConfigManager: could not find GM_deleteValue');
	const ConfigBase = new Proxy({}, {
		get: function(target, property, reciever) {
			return _GM_getValue(property);
		},
		set: function(target, property, value, reciever) {
			return (_GM_setValue(property, value), true);
		},
		has: function(target, property) {
			return _GM_listValues().includes(property);
		}
	});

	CM.getConfig = getConfig;
	CM.setConfig = setConfig;
	CM.updateConfig = updateConfig;
	CM.updateAllConfigs = updateAllConfigs;
	CM.updateGlobal = updateGlobal;
	CM.getConfigVersion = getConfigVersion;
	CM.setDefaults = setDefaults;
	CM.readPath = readPath;
	CM.pathExists = pathExists;
	CM.mergePath = mergePath;
	CM.getBaseName = getBaseName;
	CM.makeSubStorage = makeSubStorage;
	CM.Config = new Proxy({}, {
		get: function(target, property, reciever) {
			return makeProxy(getConfig(property), [property]);

			function makeProxy(config, path, base) {
				return isObject(config) ? new Proxy(config, {
					get: function(target, property, reciever) {
						const newPath = [...path, property];
						return makeProxy(inProto(target, property) ? target[property] : getConfig(newPath), [...path, property]);
					},
					set: function(target, property, value, reciever) {
						return (setConfig([...path, property], value), true);
					},
					deleteProperty: function(target, property) {
						const parent = getConfig(path);
						delete parent[property];
						setConfig(path, parent);
						return true;
					}
				}) : config;

				function inProto(obj, prop) {
					return prop in obj && !obj.hasOwnProperty(prop);
				}
			}
		},
		set: function(target, property, value, reciever) {
			return (_GM_setValue(property, value), true);
		},
		has: function(target, property) {
			return _GM_listValues().includes(property);
		},
		deleteProperty: function(target, property) {
			return (_GM_deleteValue(property), true);
		}
	});
	Object.freeze(CM);

	// Get config value from path (e.g. 'Users/username/' or ['Users', 12345])
	function getConfig(path) {
		// Split path
		path = arrPath(path);

		// Init config if need
		if (!(path[0] in ConfigBase)) {
			ConfigBase[path[0]] = Ruleset.defaultValues[path[0]];
		}

		// Get config by path
		const target = path.pop();
		const config = readPath(ConfigBase, path);
		return config[target];
	}

	// Set config value to path
	function setConfig(path, value) {
		path = arrPath(path);
		const target = path.pop();

		// Init config if need
		if (path.length && !(path[0] in ConfigBase)) {
			ConfigBase[path[0]] = Ruleset.defaultValues[path[0]];
		}

		if (path.length > 0) {
			const basekey = path.shift();
			const baseobj = ConfigBase[basekey];
			let config = readPath(baseobj, path);
			if (isObject(config)) {
				config[target] = value;
				ConfigBase[basekey] = baseobj;
			} else {
				Err('Attempt to set a property to a non-object value');
			}
		} else {
			const verKey = Ruleset['version-key'];
			const oldConfig = ConfigBase[target];
			if (isObject(value)) {
				hasProp(value, verKey) && (hasProp(oldConfig, verKey) ? value[verKey] !== oldConfig[verKey] : true) &&
					Err('Shouldn\'t manually set config version to a version number differs from current version number');
				value[verKey] = ConfigBase[target][verKey];
			}
			ConfigBase[target] = value;
		}
	}

	function updateConfig(basename) {
		let updated = false;

		// Get updaters and config
		const updaters = Ruleset.updaters.hasOwnProperty(basename) ? Ruleset.updaters[basename] : [];
		const verKey = Ruleset['version-key'];
		let config = getConfig(basename);

		// Valid check
		if ([verKey, ...(Ruleset.ignores || [])].includes(basename)) {
			return false;
		}
		if (!updaters.length) {
			return save();
		}

		// Update
		for (let i = (config[verKey] || 0); i < updaters.length; i++) {
			const updater = updaters[i];
			config = updater.call(CM, config);
			updated = true;
		}

		// Set version and save
		return save();

		function save() {
			isObject(config) && (config[verKey] = updaters.length);
			ConfigBase[basename] = config;
			return updated;
		}
	}

	function updateAllConfigs() {
		const keys = _GM_listValues();
		keys.forEach((key) => (updateConfig(key)));
	}

	function updateGlobal() {
		let updated = false;

		const updaters = Ruleset.globalUpdaters || [];
		const verKey = Ruleset['version-key'];
		if (!updaters.length) {
			return save();
		}
		const config = _GM_listValues().reduce((obj, key) => Object.assign(obj, { [key]: _GM_getValue(key) }), {});

		// Update
		for (let i = (config[verKey] || 0); i < updaters.length; i++) {
			const updater = updaters[i];
			config = updater.call(CM, config);
			updated = true;
		}

		// Set version and save
		return save();

		function save() {
			config[verKey] = updaters.length;
			Object.keys(config).forEach(key => _GM_setValue(key, config[key]));
			return updated;
		}
	}

	function getConfigVersion(basename=null) {
		const verKey = Ruleset['version-key'];
		return (basename ? ConfigBase[basename] : ConfigBase)[verKey] || 0;
	}

	function setDefaults() {
		for (const [key, val] of Object.entries(Ruleset.defaultValues)) {
			!(key in ConfigBase) && (ConfigBase[key] = val);
		}
	}

	function makeSubStorage(path) {
		path = arrPath(path);
		return {
			GM_setValue: function(key, value) {
				setConfig([...path, key], value);
			},
			GM_getValue: function(key, defaultValue) {
				const val = getConfig([...path, key]);
				return typeof val === 'undefined' ? defaultValue : val;
			},
			GM_listValues: function() {
				return Object.keys(getConfig(path));
			},
			GM_deleteValue: function(key) {
				const parent = getConfig(path);
				delete parent[key];
				setConfig(path, parent);
			}
		}
	}

	function readPath(obj, path) {
		path = arrPath(path);
		while (path.length > 0) {
			const key = path.shift();
			if (isObject(obj) && hasProp(obj, key)) {
				obj = obj[key];
			} else {
				Err('Attempt to read a property that is not exist (reading "' + key + '" in path "' + path + '")');
			}
		}
		return obj;
	}

	function pathExists(obj, path) {
		path = arrPath(path);
		while (path.length > 0) {
			const key = path.shift();
			if (isObject(obj) && hasProp(obj, key)) {
				obj = obj[key];
			} else {
				return false;
			}
		}
		return true;
	}

	function mergePath() {
		return Array.from(arguments).join('/');
	}

	function getBaseName(path) {
		return arrPath(path)[0];
	}

	function getPathWithoutBase(path) {
		const p = arrPath(path);
		p.shift();
		return p;
	}

	function arrPath(strpath) {
		return Array.isArray(strpath) ? [...strpath] : strpath.replace(/^\//, '').replace(/\/$/, '').split('/');
	}

	function isObject(obj) {
		return typeof obj === 'object' && obj !== null;
	}

	function hasProp(obj, prop) {
		return obj === ConfigBase ? prop in obj : obj.hasOwnProperty(prop);
	}

	// type: [Error, TypeError]
	function Err(msg, type=0) {
		throw new [Error, TypeError][type](msg);
	}
}