// ==UserScript==
// @name         PHPBB Jumpboxchanger
// @namespace    http://openuserjs.org/users/ardiman
// @description  Changes Jumpbox in german firefox-forum. Unread will become red, unwished forums in BLACKLIST will become invisible.
// @description:de-DE Passt im deutschen Firefox-Forum die Box an, die bei Klick auf >Gehe zu< geöffnet wird. Ungelesene werden rot, unerwünschte Foren können per BLACKLIST ausgeblendet werden.
// @grant        none
// @homepage     https://github.com/ardiman/userscripts/tree/master/phpbbjumpboxchanger
// @icon         https://raw.githubusercontent.com/ardiman/userscripts/master/scriptlogo.gif
// @include      https://www.camp-firefox.de/forum/*
// @license      CC-BY-NC-SA-3.0; https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode
// @license      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/ardiman/userscripts/issues
// @version      1.0.4
// @date         2017-11-19
// @downloadURL https://update.greasyfork.org/scripts/17645/PHPBB%20Jumpboxchanger.user.js
// @updateURL https://update.greasyfork.org/scripts/17645/PHPBB%20Jumpboxchanger.meta.js
// ==/UserScript==

(function() {
   // Forentitel, die grundsätzlich nicht angezeigt werden sollen
   //var BLACKLIST = ["Firefox für Smart Devices (wie Smartphones, Tablets, Fernseher, IoT)","Firefox OS","Firefox für Android","Firefox für iOS"];
   // falls kein Ausblenden erwünscht, dann diese Zeile verwenden:
   var BLACKLIST =[];

   if (!document.getElementById('jumpbox'))
      return;
   var button = document.querySelector('#jumpbox > span');
   button.addEventListener('click', function() {
      var req = new XMLHttpRequest();
      req.open('GET', './index.php');
      req.responseType = 'document';
      req.onload = function() {
         if (req.status == 200)
            doJumpbox();
      };
      req.send();

      function doJumpbox() {
         // Ungelesene einfärben
         var A = req.responseXML.querySelectorAll('.forum_unread .forumtitle');
         for (var a of A) {
            var str = a.getAttribute('href');
            var a2 = document.querySelector('#jumpbox a[href="' + str + '"]');
            a2.style.color = 'red';
         };
         // zwischenzeitlich Gelesene wieder entfärben
         A = req.responseXML.querySelectorAll('.forum_read .forumtitle');
         for (var a of A) {
            var str = a.getAttribute('href');
            var a2 = document.querySelector('#jumpbox a[href="' + str + '"]');
            a2.style.color = 'rgb(16,82,137)';
         };
         // Blacklist abarbeiten
         var B = document.querySelectorAll('#jumpbox a');
         for (var b of B) {
            if (BLACKLIST.indexOf(b.innerHTML) !== -1) {
               b.parentElement.style.display = "none";
            }
         }
      };
   });

})();
