// ==UserScript==
// @name        Messenger.com notification
// @namespace   Notifications
// @require http://code.jquery.com/jquery-latest.js
// @include     *://www.messenger.com/*
// @exclude     https://*/manifests/appCacheManifestHandler.ashx*
// @version     2
// @grant       none
// @description show notifications for every message on messenger.com (still very experimental)
// @downloadURL https://update.greasyfork.org/scripts/29752/Messengercom%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/29752/Messengercom%20notification.meta.js
// ==/UserScript==

(function () {
    
  window.last_baloons_count = 0;
  setInterval(function () {
    if ((conversation = anyNewEvents()) !== null) {
      showNotification("im",conversation);
    }
  }, 1000);


  function anyNewEvents () {
      var baloons_count = $('._1t_p').get().length;
      console.log('ballons_count',baloons_count);
      if (baloons_count != last_baloons_count) {
          last_baloons_count = baloons_count;
          console.log('New phrase!');
          last_conversation = $('._1t_p').last();
          conversation = extractMetadata(last_conversation);
          last_conversation_phrases = $(last_conversation).find('._3oh-');
          phrases = $(last_conversation_phrases).text();
          return conversation;
      } else {
          return null;
      }
  }
    
    function extractMetadata(baloon) {
        console.log('baloon',baloon);
        img = $(baloon).find('img');
        icon_url = img.attr('src');
        sender = img.attr('alt');
        if (sender == undefined) {
            gif_on_baloon = icon_url;
        }
        message = $(baloon).find('._3058._ui9._hh7._s1-._52mr').text();
        obj = {sender: sender, icon_url: icon_url, message: message, gif: gif_on_baloon };
        console.log('extracted info from baloon',obj);
        return obj;
    }

  function showNotification (type,conversation) {
      console.log('phrase',conversation);
    if (Notification.permission === 'granted') {
      createNotification(type,conversation);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === 'granted') {
          createNotification(type,conversation);
        }
      });
    }
  }

  function createNotification (type,conversation) {
    var options = {}, text;
    switch (type) {
    case 'email':
      text = 'You have got a new email!';
      options.icon = 'https://i.imgur.com/l2wPNdt.png';
      break;
    case 'im':
      text = 'You have got a new IM!';
      options.icon = 'https://i.imgur.com/cP3929u.png';
      break;
    case 'calendar':
      text = 'Calendar event reminder!';
      options.icon = 'https://i.imgur.com/LIgx1T9.png';
      break;
    default:
      text = 'Some system event!';
      options.icon = 'https://i.imgur.com/zDX7V1w.png';
      break;
    }
      
     if (conversation.gif) {
         options.icon = conversation.gif;
     } else {
         options.icon = conversation.icon_url;
     }
      
    options.title = conversation.sender;
    options.body = conversation.message;
 
    text = options.title;
    console.log('Notification', text, options);
    return new Notification(text, options);
  }
})();
