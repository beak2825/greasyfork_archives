// ==UserScript==
// @name        fake yswebview jssdk
// @namespace   fake yswebview jssdk
// @match       *://*/tvapp/*
// @match       *://*/webapp/*
// @match       *://*.laofa.com/h5/*
// @grant       none
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @version     1.0.7
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/512252
// @run-at       document-start
// @license MIT
// @description  fake yswebview jssdk 2024/10/10 17:12:01
// @downloadURL https://update.greasyfork.org/scripts/512252/fake%20yswebview%20jssdk.user.js
// @updateURL https://update.greasyfork.org/scripts/512252/fake%20yswebview%20jssdk.meta.js
// ==/UserScript==

var qs = new URLSearchParams(location.search.substr(1));

var FLAVOR = GM_getValue('__FAKE_YSWEBVIEW_JSSDK__FLAVOR') || 'slide';
var UID = GM_getValue('__FAKE_YSWEBVIEW_JSSDK__UNIQUE_ID') || '7914d5bcd361662a0b6bdebb24d4e76b';

if (qs.get('aid')) {
	FLAVOR = qs.get('aid').split('.').pop() || FLAVOR;
	GM_setValue('__FAKE_YSWEBVIEW_JSSDK__FLAVOR', FLAVOR);
}
if (qs.get('uid')) {
	UID = qs.get('uid');
	GM_setValue('__FAKE_YSWEBVIEW_JSSDK__UNIQUE_ID', UID);
}

// ===============================================================================================

ys = {};
// FLAVOR 渠道标识
ys.FLAVOR = FLAVOR;
// ys.FLAVOR = 'slide';
// ys.FLAVOR = 'dashboard';
// ys.FLAVOR = 'jiuyetong';


// UID
ys.UNIQUE_ID = UID;

console.warn(`[fake yswebview jssdk]`);
console.log(`FLAVOR: ${ ys.FLAVOR }`);
console.log(`UNIQUE_ID: ${ ys.UNIQUE_ID }`);
console.log(`\n`);



ys.MANUFACTURER = 'vivo';
ys.BRAND = 'vivo';
ys.MODEL = 'V1824A';
ys.UI_MODE = 'NORMAL';
ys.TV = false;

// 通知栏高度
ys.statusBarHeight = 0;

// 导航栏高度
ys.navigationBarHeight = 0;

ys.getInfo=function(cb) {
	var info = {
		"MOCK": true,
		"BUILD_ENV": "prod",
		"BUILD_DATE": "2025/1/2 15:56:39",
		"RELEASE_TIME": "2024/12/31 18:14:39",
		"UNIQUE_ID": ys.UNIQUE_ID,
		"PACKAGE_NAME": ys.APPLICATION_ID,
		"VERSION": "1.1.1",
		"VERSION_NAME": "1.1",
		"VERSION_CODE": 1,
		"ANDROID_ID": "dfd7538d7a506538",
		"UNIQUE_ID_RAW": "slide_dfd7538d7a506538_4137975808_vivo_V1824A_V1824A_vivo_V1824A_star2qltechn_qcom",
		"APPLICATION_ID": "com.ysinc.webapp.slide",
		"FLAVOR": "slide",
		"RELEASE_TYPE": "release",
		"MEMORY_TOTAL": 4137975808,
		"BUILD_SERIAL": "unknown",
		"BUILD_MANUFACTURER": ys.MANUFACTURER,
		"BUILD_PRODUCT": "V1824A",
		"BUILD_MODEL": ys.MODEL,
		"BUILD_BRAND": ys.BRAND,
		"BUILD_BOARD": "V1824A",
		"BUILD_DISPLAY": "PQ3B.190801.01311438 release-keys",
		"BUILD_DEVICE": "star2qltechn",
		"BUILD_HARDWARE": "qcom",
		"BUILD_ID": "PQ3B.190801.01311438",
		"BUILD_TYPE": "user",
		"BUILD_TAGS": "release-keys",
		"BUILD_TIME": 1706683100000,
		"BUILD_USER": "build",
		"BUILD_VERSION": "9",
		"BUILD_VERSION_SDK": 28,
		"BUILD_VERSION_CODENAME": "REL",
		"DISPLAY_widthPixels": 1920,
		"DISPLAY_heightPixels": 1080,
		"DISPLAY_density": 1.75,
		"DISPLAY_densityDpi": 280,
		"DISPLAY_screenWidth": 1097,
		"DISPLAY_screenHeight": 617,
		"UI_MODE": ys.UI_MODE,
		"UI_MODE_TYPE": 1,
		"UI_MODE_TYPE_TELEVISION": ys.TV,
		"MAC": "00:DB:B5:94:F1:C7",
		"IP": "172.16.1.15",
		"LAN_IP": "172.16.1.15"
	}
	cb(info);
};
ys.APPLICATION_ID = 'com.ysinc.webapp.'+ ys.FLAVOR;

ys.sp = {
	getString: function(key) {},
	putString: function(key, value) {},
	getBoolean: function(key) {},
	putBoolean: function(key, value) {},
	getLong: function(key) {},
	putLong: function(key, value) {},
	getInt: function(key) {},
	putInt: function(key, value) {},
	remove: function(key) {},
	clear: function() {},
}

ys.getHardwareInfo = function(cb) { cb({ "MOCK": true }); };
ys.getCpuInfo = function(cb) { cb({ "MOCK": true }); };
ys.getCpuInfoRaw = function(cb) { cb({ "MOCK": true }); };
ys.getMemoryInfo = function(cb) { cb({ "MOCK": true }); };
ys.getMemorySize = function(cb) { cb({ "MOCK": true }); };
ys.canGoBack = function(cb) { cb({ "MOCK": true }); };
ys.canGoBackOrForward = function(cb) { cb({ "MOCK": true }); };
ys.getItem = function(key) { };
ys.setItem = function(key, value) {
	alert(`setItem\n\nkey: ${ key }\n\nvalue: ${ value }`);
};
ys.removeItem = function(key) { };
ys.clearItem = function(cb) { cb({ "MOCK": true }); };

ys.__getItem = function() { };
ys.__setItem = function() { };
ys.__removeItem = function() { };
ys.__clearItem = function() { };
ys.setUserAgent = function() { };
ys.__getInfo = function() { };
ys.__getHardwareInfo = function() { };
ys.__getCpuInfoRaw = function() { };
ys.__getCpuInfo = function() { };
ys.__getMemoryInfo = function() { };
ys.__getMemorySize = function() { };
ys.__canGoBack = function() { };
ys.__canGoBackOrForward = function() { };
ys.goForward = function() { };
ys.goBack = function() { };
ys.reload = function() { };
ys.reloadUrl = function() { };
ys.clearHistory = function() { };
ys.clearCache = function() { };
ys.clearCookie = function() { };
ys.clearFormData = function() { };
ys.clearSslPreferences = function() { };
ys.clearAll = function() { };
ys.reset = function() { };
ys.getUrl = function() { };
ys.loadUrl = function(url) {
	if (confirm(`“确定”跳转到: ${ url }`)) {
		location.href = url;
	}
};
ys.redirectUrl = function(url) {
	if (confirm(`“确定”跳转到: ${ url }`)) {
		location.replace(url);
	}
};
ys.startDefender = function() { };
ys.stopDefender = function() { };
ys.loadDefender = function() { };
ys.setDefender = function() { };
ys.getDefender = function() { };
ys.removeDefender = function() { };
ys.useDefender = function() { };
ys.loadData = function() { };
ys.GoBackward = function() { history.back(); };
ys.GoForward = function() { };
ys.GoReload = function() { location.reload(); };
ys.GoHome = function() { history.back(); };
ys.GoExit = function() { };
ys.__AppKeydown = function() { };
ys.useKeydown = function() { };
ys.canUseKeydown = function() { return false };
ys.__AppKeyup = function() { };
ys.useKeyup = function() { };
ys.canUseKeyup = function() { return false };
ys.toast = function(msg) { alert(msg); };
ys.showConfig = function() { };
ys.resetConfig = function() { };
ys.home = function() { };
ys.destroy = function() { };
ys.finish = function() { };
ys.exit = function() { };
ys.moveTaskToBack = function() { };
ys.openURL = function() { };
ys.openApp = function() { };
ys.setStatusBarDarkMode = function() { };
ys.setStatusBarLightMode = function() { };
ys.setStatusBarMode = function() { };
ys.getStatusBarMode = function() { return 'light' };
ys.getStatusBarHeight = function() { return ys.statusBarHeight };
ys.showStatusBar = function() { };
ys.hideStatusBar = function() { };
ys.isDarkMode = function() { return false };
ys.getNavigationBarHeight = function() { return ys.navigationBarHeight };
ys.showWebViewNavbar = function() { };
ys.hideWebViewNavbar = function() { };
ys.useWebViewNavbar = function() { };
ys.useWebViewNavbarEvent = function() { };
ys.setWebViewNavbarEnabled = function() { };
ys.setWebViewNavbarUrl = function() { };
ys.getWebViewNavbarUrl = function() { };
ys.setWebViewNavbarPos = function() { };
ys.useScreenSaver = function() { };
ys.useScreenSaverEvent = function() { };
ys.setScreenSaverUrl = function() { };
ys.getScreenSaverUrl = function() { };
ys.removeScreenSaverUrl = function() { };
ys.setScreenOrientation = function() { };
ys.setOrientation = function() { };
ys.setAccelerometerRotation = function() { };
ys.setUserRotation = function() { };
ys.requestPermissions = function() { };
ys.setFocusable = function() { };
ys.setAppBackUrl = function() { };
ys.removeAppBackUrl = function() { };
ys.setAppExitUrl = function() { };
ys.removeAppExitUrl = function() { };
ys.useAppExitTip = function() { };
ys.GoSetting = function() { };
ys.getUiModeType = function() { return 1 };
ys.isTV = function() { return false };

var style = document.createElement('style');
style.type='text/css';
style.textContent = `
:root{
	--safe-area-inset-top: ${ ys.statusBarHeight }px;
	--safe-area-inset-bottom: ${ ys.navigationBarHeight }px;
	--statusbar-height: ${ ys.statusBarHeight }px;
	--status-bar-height: ${ ys.navigationBarHeight }px;
	--navigationbar-height: ${ ys.statusBarHeight }px;
	--navigation-bar-height: ${ ys.navigationBarHeight }px;
}

/*
html{word-break: break-all;}
*/
`;
document.head.appendChild(style);

/*
window.top.__USER_AGENT__ = 'Mozilla/5.0 (Linux; Android 9; V1824A Build/PQ3B.190801.01311438; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Safari/537.36 yswebview/1.1.1 yswebapp/1.1.1_c4ff119967e8f4af8d2dd2199179e7ad_(vivo V1824A V1824A; PQ3B.190801.01311438) slidewebapp/1.1.1 slidewebapp_uid/c4ff119967e8f4af8d2dd2199179e7ad';
var script_dms = document.createElement('script');
script_dms.src = 'https://webdaily.yunsheng.cn/dms/static/js/event.js?_';
document.head.appendChild(script_dms);
*/

ys.isReady = false;

window.top.ys = ys;

var isReady = false;
function ready() {
	if (isReady) return;
	isReady = true;
	var jsEvent = new CustomEvent('AppReady');
	window.dispatchEvent(jsEvent);
	document.dispatchEvent(jsEvent);
}

setTimeout(ready, 1500);

document.addEventListener('DOMContentLoaded', function() {
	setTimeout(ready, 500);
	setTimeout(ready, 1500);
});

