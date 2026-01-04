// ==UserScript==
// @name         Canvas Text Intercepter - Diep.io
// @version      1.0.0
// @description  Intercepts canvas drawing methods to change the text
// @author       Mega_Mewthree's Diep Background script, edited by Excigma
// @namespace    https://greasyfork.org/users/416480
// @run-at       document-start
// @match        https://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408256/Canvas%20Text%20Intercepter%20-%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/408256/Canvas%20Text%20Intercepter%20-%20Diepio.meta.js
// ==/UserScript==


const fakeScore = "453,345,345";

// Things are hardcoded but eh. This wasn't meant to be public or user friendly
function changeText(args) {
	if (args[0] == "0") {
		args[0] = fakeScore;
	} else if (args[0] == "//") {
		args[0] = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA?";
	} else if (args[0].match(/Tank/i)) {
		args[0] = args[0].replace("Tank", "Excigma");
	} else if (args[0] == "1") {
		args[0] = "45";
	} else if (args[0].match(/[0-9]{2}\.[0-9] FPS/i)) {
		args[0] = "93453.6 FPS";
	} else if (args[0].match(/[0-9]{2}\.[0-9] ms/i)) {
		args[0] = "8457923844573589347057274356342893485283792274097349685276957623852384572894759283647587238579872983457982734589792862857092545798.5 ms vultr-sydney";
	}
	return args;
}




const _fillText = CanvasRenderingContext2D.prototype.fillText;
const _strokeText = CanvasRenderingContext2D.prototype.strokeText;
const _measureText = CanvasRenderingContext2D.prototype.measureText;

const _alert = window.alert;
const _toString = Function.prototype.toString;

const fillText = function () { return _fillText.apply(this, changeText(arguments)); };
const strokeText = function () { return _strokeText.apply(this, changeText(arguments)); };
const measureText = function () { return _measureText.apply(this, changeText(arguments)); };

const alert = function () { return _alert.call(this, "Reload the page."); };
const toString = function () {
	if (this == CanvasRenderingContext2D.prototype.fillText) return _toString.call(_fillText);
	if (this == CanvasRenderingContext2D.prototype.measureText) return _toString.call(_measureText);
	if (this == CanvasRenderingContext2D.prototype.strokeText) return _toString.call(_strokeText);
	if (this == window.alert) return _toString.call(_alert);
	if (this == Function.prototype.toString) return _toString.call(_toString);
	return _toString.call(this);
};

measureText.__proto__ = _measureText.prototype;
measureText.prototype = _measureText.prototype;
fillText.__proto__ = _fillText.prototype;
fillText.prototype = _fillText.prototype;
strokeText.__proto__ = _strokeText.prototype;
strokeText.prototype = _strokeText.prototype;

CanvasRenderingContext2D.prototype.measureText = measureText;
CanvasRenderingContext2D.prototype.fillText = fillText;
CanvasRenderingContext2D.prototype.strokeText = strokeText;

window.alert = alert;
Function.prototype.toString = toString;
toString.__proto__ = _toString.prototype;
toString.prototype = _toString.prototype;
