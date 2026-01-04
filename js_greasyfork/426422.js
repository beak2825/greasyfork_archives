// ==UserScript==
// @name            mousewotest
// @namespace       mousewo
// @author          mousewo
// @description     这是个人测试用
// @match           *://music.app2watch.cn/*
// @match           *://m.12530.com:*/*
// @match           *://webpay.migu.cn:*/*
// @match           *://wsdkdl.migu.cn:*/*
// @version         1.0.11
// @downloadURL https://update.greasyfork.org/scripts/426422/mousewotest.user.js
// @updateURL https://update.greasyfork.org/scripts/426422/mousewotest.meta.js
// ==/UserScript==
(function () {
    'use strict';
console.log('###### run mousewo script #####');
 
})();

var _JSON = JSON.stringify;
JSON.stringify = function() {
	var ret = _JSON.apply(this, arguments);
	console.log('Binary: -> ' + ret + '\r\n');

	return ret;
};

var JSON_ = JSON.parse;
JSON.parse = function() {
	var ret = JSON_.apply(this, arguments);
	console.log('Binary: <- ' + arguments[0] + '\r\n');

	return ret;
};

