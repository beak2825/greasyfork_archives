// ==UserScript==
// @name        تخطي المؤقت وتحميل الصفحه تلقائياً 
// @homepage     https://x.com/pzll0
// @version      1.0
// @description     تخطي المؤقت وتحميل صفحة الحلقة/المسلسل تلقائيًا لموقع قصة عشق
// @author       Mjeed
// @match        https://arabtalking.com/*
// @grant        none
// @license      Personal Use Only - Modification Restricted to Author
// @namespace https://greasyfork.org/users/1311929
// @downloadURL https://update.greasyfork.org/scripts/496978/%D8%AA%D8%AE%D8%B7%D9%8A%20%D8%A7%D9%84%D9%85%D8%A4%D9%82%D8%AA%20%D9%88%D8%AA%D8%AD%D9%85%D9%8A%D9%84%20%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D9%87%20%D8%AA%D9%84%D9%82%D8%A7%D8%A6%D9%8A%D8%A7%D9%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496978/%D8%AA%D8%AE%D8%B7%D9%8A%20%D8%A7%D9%84%D9%85%D8%A4%D9%82%D8%AA%20%D9%88%D8%AA%D8%AD%D9%85%D9%8A%D9%84%20%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D9%87%20%D8%AA%D9%84%D9%82%D8%A7%D8%A6%D9%8A%D8%A7%D9%8B.meta.js
// ==/UserScript==


(function () {
  "use strict";

  const secondsWait = document.getElementById("secondsWait");
  const myLink = document.getElementById("myLink");
  const goUrl = document.getElementById("goUrl");

  if (secondsWait) {
    secondsWait.remove();
  }
  if (myLink) {
    myLink.style.display = "block";
    myLink.href = myUrl;
    myLink.innerHTML = "اضغط هنا لمشاهدة الحلقة";
  }
  if (goUrl) {
    goUrl.innerHTML = "شكراً لك. اضغط على الزر لمشاهدة الحلقة الآن";
  }
  window.location.href = myUrl;
})();