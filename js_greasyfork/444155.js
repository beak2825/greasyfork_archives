// ==UserScript==
// @name         js-storeData
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  轻量级原生js本地数据存储管理工具(可选localstorage或GM油猴API)
// @author       tutu辣么可爱(greasyfork) IcedWatermelonJuice(github)
// @dayr         2022.4.29 GMT+0800 (中国标准时间)
// @license      MIT License
// @note         相关参考信息请前往greasyfork仓库或github仓库
// @note         greasyfork仓库:https://greasyfork.org/zh-CN/scripts/444155-js-storedata
// @note         github仓库:https://github.com/IcedWatermelonJuice/js-storeData
// ==/UserScript==
var storeDataJS = function(dataKey, defaultData, isGM = false) {
	var defaultGM = function() {
		console.log("未获得GM油猴API，请确认是否已授权");
		return null;
	}
	this.check = function(data) {
		try {
			data = JSON.stringify(data);
			data = JSON.parse(data);
			if (data && typeof data === "object") {
				return true
			} else {
				return false
			}
		} catch (e) {
			return false
		}
	}
	this.dataKey = dataKey;
	this.defaultData = this.check(defaultData) ? defaultData : {};
	this.isGM = isGM;
	this.data = {};
	this.defaultGet = function(key) {
		return isGM ? (typeof GM_getValue === "function" ? GM_getValue(key) : defaultFn(key)) : localStorage
			.getItem(key)
	}
	this.defaultSet = function(key, val) {
		return isGM ? (typeof GM_setValue === "function" ? GM_setValue(key, val) : defaultFn(key, val)) :
			localStorage.setItem(key, val)
	}
	this.defaultRemove = function(key) {
		return isGM ? (typeof GM_deleteValue === "function" ? GM_deleteValue(key) : defaultFn(key)) :
			localStorage.removeItem(key)
	}
	this.save = function() {
		if (this.check(this.data)) {
			this.defaultSet(this.dataKey, JSON.stringify(this.data))
		} else {
			console.log("保存失败！待保存数据损坏")
		}
	}
	this.init = function() {
		let data = this.defaultGet(this.dataKey);
		try {
			data = data ? JSON.parse(data) : {};
		} catch (e) {
			data = {}
		}
		data = {
			...this.defaultData,
			...data
		};
		this.data = data;
	}
	this.remove = function() {
		this.defaultRemove(this.dataKey);
	}
	this.init();
}
storeDataJS.prototype = {
	copy: function(data) {
		return JSON.parse(JSON.stringify(data));
	},
	get: function(key, isDefault = false) {
		let data = this.copy(isDefault ? this.defaultData : this.data);
		return key ? data[key] : data;
	},
	set: function(key, val, isSave = false) {
		if (val !== undefined && val !== null) {
			this.data[key] = val;
		} else if (this.check(key)) {
			this.data = key;
		}
		if (isSave) {
			this.save();
		}
	},
	reset: function(isSave = false) {
		let data = this.get(null, true);
		this.set(data, null, isSave);
	},
	delete: function(key, isSave = false) {
		delete this.data[key];
		if (isSave) {
			this.save();
		}
	}
}
