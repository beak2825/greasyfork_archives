// ==UserScript==
// @name Put right-aligned links to Private Messages and Subscriptions on the navbar (white bubbles)
// @description White notification bubbles. See "Author's Description" to see what else this gives you!
// @namespace none
// @include http://www.overclock.net/*
// @version Version 1.0
// @grant none
// @require http://code.jquery.com/jquery-1.6.4.js
// @downloadURL https://update.greasyfork.org/scripts/14803/Put%20right-aligned%20links%20to%20Private%20Messages%20and%20Subscriptions%20on%20the%20navbar%20%28white%20bubbles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/14803/Put%20right-aligned%20links%20to%20Private%20Messages%20and%20Subscriptions%20on%20the%20navbar%20%28white%20bubbles%29.meta.js
// ==/UserScript==
  
(function () {
  
  /*----PUT "View All Drafts" ON YOUR PROFILE MENU-----*/
  $('<li/>') .append($('<a/>', {
    text: 'View All Drafts',
    href: 'http://www.overclock.net/draft'
  })) .insertBefore($('.profile .menu .prefs'));
  
  
   /*-----PUT "Edit Signature" ON YOUR PROFILE MENU-----*/
  var userData = $('.profile .user-avatar a') .attr('href') .split('/');
  var userId = userData[2];
  var userName = userData[3];
  var plText = '';
  var plUrl = '';
  plText = 'Edit Signature'.replace('{{username}}', userName) .replace('{{userid}}', userId);
  plUrl = 'http://www.overclock.net/users/signature/edit_signature/user_id/{{userid}}'.replace('{{username}}', userName) .replace('{{userid}}', userId);
  $('<li/>') .append($('<a/>', {
    text: plText,
    href: plUrl,
    target: '_self'
  })) .insertAfter($('.profile .menu .threads-started'));
   /*-----HIGH-RESOLUTION AVATAR ON THE NAVBAR-----*/
  var highres = $('.ui-header-fixed li.profile .user-avatar img') .attr('src') .replace('32x32px-LL', '120x120px-LS');
  $('.ui-header-fixed li.profile .user-avatar img') .attr('src', highres);

  
  /*-----CORRECT THE CAPITALIZATION OF YOUR USERNAME ON YOUR PROFILE MENU-----*/
  $('.profile .menu .username a') .text($('#loggedin-username') .text());
  
    /*-----CHANGE "Logout" ON PROFILE MENU TO "Log Out"-----*/
  $('.profile .menu .logout a') .text('Log Out');

   /*-----PUT "Private Messages" AND "Subscriptions" ON THE NAVBAR-----*/
$("<style type='text/css'>.jlink { font-size: 12px; display: block !important; height: 18px !important; color: #FFFFFF !important; text-align: right !important; } .jncontainer { position: absolute; right: 48px; display: inline-block; top: 27px; width: 124px; } .jcounter { background-color: #FFFFFF; color: #000000; font-weight: bold;  display: inline-block; height: 15px; min-width: 18px; text-align: center; font-size: 10px; line-height: 14px; border-radius: 2px; margin-right: 5px; font-family: Verdana; .jpadder { display: inline-block; height: 15px; min-width: 18px; text-align: center; font-size: 10px; line-height: 14px; border-radius: 2px; margin-right: 5px; background-color: transparent; font-family: Verdana; } .jpadder, .jcounter { float: right !important; margin-top: 0px; margin-left: 3px; text-indent: -1px; } .fixed-scroll-breakpoint .jncontainer { top: 8px; } .ui-header-fixed li.profile .user-avatar .notification-counter, .ui-header-fixed ul#main-nav li.messages, .ui-header-fixed ul#main-nav li.subscriptions { display:none; } .search-bar-outer, .ui-header-fixed ul#main-nav .search > a { right:165px !important; } </style>").appendTo("head");
  
  var privateMessagesCount = $('.messages .notification-counter') .first() .text() .replace(/s+/, '');
  var subscriptionsCount = $('.subscriptions .notification-counter') .first() .text() .replace(/s+/, '');
  var notificationModule = $('<li/>', {
    class: 'jncontainer',
  });
  var msgText = privateMessagesCount == 1 ? 'New Message ' : privateMessagesCount < 1 ? 'Private Messages ' : 'New Messages ';
  var messagesContainer = $('<a/>', {
    href: 'http://www.overclock.net/messages',
    text: msgText,
    class: 'jlink',
  });
  var messagesCounter = $('<span/>', {
    text: privateMessagesCount,
    class: 'jcounter'
  });
  var subsContainer = $('<a/>', {
    href: 'http://www.overclock.net/users/subscriptions/',
    text: 'Subscriptions',
    class: 'jlink',
  });
  var subsCounter = $('<span/>', {
    text: subscriptionsCount,
    class: 'jcounter'
  });
  if (privateMessagesCount > 0) messagesContainer.append(messagesCounter);
   else messagesContainer.append($('<span/>', {
    class: 'jpadder',
    text: ''
  }));
  if (subscriptionsCount > 0) subsContainer.append(subsCounter);
   else subsContainer.append($('<span/>', {
    class: 'jpadder',
    text: ''
  }));
  notificationModule.append(messagesContainer);
  notificationModule.append(subsContainer);
  notificationModule.insertBefore($('#main-nav .profile'));
}) ();
