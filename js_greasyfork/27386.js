// ==UserScript==
// @name        Linkify user remarks
// @namespace   https://linux.org.ru/userscripts
// @description Add spoiler functionality
// @include     https://www.linux.org.ru/*
// @version     0.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27386/Linkify%20user%20remarks.user.js
// @updateURL https://update.greasyfork.org/scripts/27386/Linkify%20user%20remarks.meta.js
// ==/UserScript==

const URL_REGEX = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/gi
const URL_REPLACEMENT = '<a href="$&">$&</a>'

for (let remark of document.getElementsByClassName('user-remark')) {
  remark.innerHTML = remark.firstChild.nodeValue.replace(URL_REGEX, URL_REPLACEMENT)
}