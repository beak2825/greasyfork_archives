// ==UserScript==
// @name         Mailman Moderation Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  discard messages by subject filter
// @author       Ray Castro
// @license      MIT
// @match        https://*/*mailman/admindb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437162/Mailman%20Moderation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/437162/Mailman%20Moderation%20Helper.meta.js
// ==/UserScript==

var discardByPattern = function() {
'use strict';
var term = window.prompt("Selection term regex:");
var cnt = 0;
term = new RegExp(term);
document.querySelectorAll ("form > table > tbody > tr").forEach(function(r) {
    var subjects = [].filter.call(r.querySelectorAll("form table table table table tr"), row => row.textContent.includes('Subject:'));
    var sub = subjects.find(row => term.exec(row.getElementsByTagName("td")[2].textContent));
    if (sub) {
      var button = r.querySelector("input[value='3']"); // 3=Discard
      button.checked = true;
      sub = sub.getElementsByTagName("td")[2].textContent;
      console.log(sub, "-", button.name);
      ++cnt;
    };
});
window.alert("Selected "+cnt+" messages.");
return true;
};

(function() {
'use strict';
    var a = document.createElement("a");
    a.innerHTML="Discard messages by subject pattern.";
    a.onclick = discardByPattern;
    a.href="javascript:true";
    var form = document.querySelector("form");
    form.parentNode.insertBefore(a, form);
})();