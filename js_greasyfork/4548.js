// ==UserScript==
// @name        Mail.Ru Links
// @namespace   mailru
// @description Восстанавливает обрезанные ссылки
// @include     *//*.mail.ru/*
// @version     0.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4548/MailRu%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/4548/MailRu%20Links.meta.js
// ==/UserScript==

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (string, position) {
        var lastIndex;
        position = position || this.length;
        position = position - string.length;
        lastIndex = this.lastIndexOf(string);
        return -1 != lastIndex && lastIndex == position;
    };
}

new function fix() {
  Array.forEach(document.querySelectorAll('a[target="_blank"]:not([fixed])'), function (link) {
    var linkText = link.textContent;
    if (linkText.endsWith('...') || linkText.endsWith('…')) {
     link.textContent = link.href;
    }
    link.setAttribute('fixed', 'true');
  });
  window.setTimeout(fix, 1000);
};
