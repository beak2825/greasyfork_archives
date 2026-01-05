// ==UserScript==
// @name         Gab.ai Mentions Notifications
// @namespace    https://www.ekkooff.com/
// @version      1.1
// @description  Additional notifications count just for mentions.
// @author       Kevin Roberts (@echo)
// @match        https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24668/Gabai%20Mentions%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/24668/Gabai%20Mentions%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';


      var init = function () {

      if(!window.hasOwnProperty('$')||!window.hasOwnProperty('Pusher')) {
          setTimeout(init,500);
          return;
      }

      var mentions = $('<span id="notificationmentions" style="background:#55aa22;left:120px;" class="hidden">0</span>');

      var reset = function() {
          mentions.text('0');
          mentions.addClass('hidden');
      };

      var oldXHR = window.XMLHttpRequest;
      function newXHR() {
          var realXHR = new oldXHR();
          realXHR.addEventListener("readystatechange", function() {
              if(realXHR.readyState==4 && realXHR.status==200){
                  if(realXHR.responseURL.startsWith('https://gab.ai/api/notifications')) {
                      reset();
                  }
              }
          }, false);
          return realXHR;
      }
      window.XMLHttpRequest = newXHR;

      var timeout;
      var times = 0;

      var bind = function() {
        if(Pusher.instances[0]===undefined) {
          times++;
          if(times <= 3) {
            timeout = setTimeout(bind, 500);
          } else {
            console.log('Could not bind to notifications, giving up.');
          }
        }

        Pusher.instances[0].bind_all(function(eventName,data) {
          console.log(data.message);
          if(data.message && data.message.endsWith("mentioned you in a post.")) {
            if($('#notificationmentions').length===0) {
              $('.notification-count').append(mentions);
            }
            var count = parseInt(mentions.text());
            count++;
            mentions.text(count);
            mentions.removeClass('hidden');
          }
        });
      };

      timeout = setTimeout(bind, 500);
    };

     window.addEventListener('load',init,false);
})();