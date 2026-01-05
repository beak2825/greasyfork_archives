// ==UserScript==
// @name           Lib Export Holder
// @author         Jixun
// @description    Hold the exports inside the variable.
// @version        1.0
// @copyright      2014+, Jixun
// ==/UserScript==

var exports = {};

// TODO: Logic of callbacks?
var require = function (name) {
    return exports[name];
};