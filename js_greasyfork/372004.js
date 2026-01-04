// ==UserScript==
// @name         atcoder submitter module
// @namespace    https://github.com/keidaroo/AtcoderSubmitter_Easymode
// @version      0.1
// @description  plugin for atcoder submitter
// @author       keidaroo
// @match        https://beta.atcoder.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372004/atcoder%20submitter%20module.user.js
// @updateURL https://update.greasyfork.org/scripts/372004/atcoder%20submitter%20module.meta.js
// ==/UserScript==

(function() {
var url=window.location.href;

if (url.indexOf('/tasks/') == -1 || url.split('/').lenth<7) {
return;
}

var contestID = url.split('/')[4];
var problemID = url.split('/')[6];

var xhr = new XMLHttpRequest();

xhr.open('POST', 'http://localhost:8080/');
xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
xhr.send("contestID="+contestID+"&problemID="+problemID);

})();