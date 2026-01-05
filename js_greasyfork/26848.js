// ==UserScript==
// @name        Gmail - show full date and time in mail list
// @description Just show the full date and time on the list instead of only short date. Useful if you need to create a report and you base on your activity and it's timing. Or when you look at mails and want to find one visually by looking on times.
// @namespace   https://www.facebook.com/zbyszek.matuszewski
// @include     https://mail.google.com/mail/*
// @version     0.3.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26848/Gmail%20-%20show%20full%20date%20and%20time%20in%20mail%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/26848/Gmail%20-%20show%20full%20date%20and%20time%20in%20mail%20list.meta.js
// ==/UserScript==

(function() {
  window.setInterval(function() {
    var date_titles_main = Array.from(document.getElementsByClassName("xW xY"));
    var date_titles_thread = Array.from(document.getElementsByClassName("g3"));
    date_titles_main.forEach(function(element, index, array) {
      var elements = element.childNodes;
      var title = elements.length > 0 ? elements[0].title : false;
      if (title && elements[0].innerHTML != title) { elements[0].innerHTML = title; }
    });
    date_titles_thread.forEach(function(element, index, array) {
      if (element.title && element.innerHTML != element.title) { element.innerHTML = element.title; }
    });
    Array.from(document.getElementsByClassName("xX")).forEach(function(element, index, array) {
      element.style.width = '20ex';
    });
    Array.from(document.getElementsByClassName("xW")).forEach(function(element, index, array) {
      element.style['max-width'] = '145px';
      element.style['flex-basis'] = '145ex';
    });
  }, 2000);
})();