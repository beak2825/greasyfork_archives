// ==UserScript==
// @name Headfi-addon
// @description .
// @namespace none
// @include http://www.head-fi.org/*
// @grant none
// @require http://code.jquery.com/jquery-1.6.4.js
// @version 0.0.3
// @downloadURL https://update.greasyfork.org/scripts/16639/Headfi-addon.user.js
// @updateURL https://update.greasyfork.org/scripts/16639/Headfi-addon.meta.js
// ==/UserScript==


      /*----ONE-CLICK LOG-IN   --  THE CODE FOR THE CLASSIC LOG-IN BUTTON IS IN THE CSS SCRIPTS----*/
(function () {
  if ($('.profile a') .attr('href') == '/join') {
    var loginForm = $('<form/>', {
      method: 'POST',
      action: '/login'
    });
    var lastLoc = localStorage.getItem('ocnlastlocation');
    lastLoc = lastLoc === null ? 'http://head-fi.org' : lastLoc.indexOf('head-fi.org' > - 1) ? lastLoc : 'http://head-fi.org';
    var oldUrlInput = $('<input/>', {
      type: 'hidden',
      name: 'oldurl',
      value: lastLoc
    });
    var usernameInput = $('<input/>', {
      type: 'text',
      name: 'username',
      placeholder: 'Username or Email',
      css: {
        'display': 'inline-bloc',
        'width': '123px',
        'padding': '3px',
        'font-size': '8pt',
      }
    });
    var passwordInput = $('<input/>', {
      type: 'password',
      name: 'password',
      placeholder: 'Password',
      css: {
        'display': 'inline-bloc',
        'width': '123px',
        'padding': '3px',
        'margin-left': '4px',
        'font-size': '8pt',
      }
    });
    var rememberMeInput = $('<input/>', {
      type: 'checkbox',
      id: 'rememberme',
      name: 'rememberme',
      checked: 'checked',
      css: {
        'display': 'block',
        'margin-left': '279px',
        'margin-top': '4px'
      }
    });
    var rememberMeLabel = $('<label/>', {
      text: 'Remember Me',
      css: {
        'color': '#A7A7A7',
        'display': 'block',
        'margin-top': '-15px',
        'margin-left': '180px',
        'font-size': '8pt',
      }
    });
  
    rememberMeLabel.attr('for', 'rememberme');
    var submitButton = $('<button/>', {
      type: 'submit',
      name: 'Login',
      /*----text: "Log In", --- You need this if you want to use this One-Click Log-In code all by itself-----*/
      css: {
        'margin-left': '4px',
      }
    });
    var loginContainer = $('<div/>');
    loginForm.append(usernameInput);
    loginForm.append(passwordInput);
    loginForm.append(oldUrlInput);
    loginForm.append(submitButton);
    loginForm.append(rememberMeInput);
    loginForm.append(rememberMeLabel);
    loginContainer.append(loginForm);
    loginContainer.append($('<a/>', {
      href: '/users/lost_password',
      text: 'Forgot Password?',
      css: {
        'display': 'block',
        'margin-top': '-15px',
        'width': '120px',
        'font-size': '8pt',
      }
    }));
    $('#sidebar') .prepend(loginContainer);
  } else {
    localStorage.setItem('ocnlastlocation', window.location);
  }
 
/*----Replace low res avatar with high res version-----*/  
  var highres = $('.ui-header-fixed li.profile .user-avatar img') .attr('src') .replace('32x32px', '900x900px');
  $('.ui-header-fixed li.profile .user-avatar img') .attr('src', highres);

  

  /*----PUT "View All Drafts" ON YOUR PROFILE MENU-----*/
  $('<li/>') .append($('<a/>', {
    text: 'View All Drafts',
    href: 'http://www.head-fi.org/draft'
  })) .insertAfter($('.profile .menu .threads-started'));
  
  
  
   /*-----PUT "Edit Signature" ON YOUR PROFILE MENU-----*/
  var userData = $('.profile .user-avatar a') .attr('href') .split('/');
  var userId = userData[2];
  var userName = userData[3];
  var plText = '';
  var plUrl = '';
  plText = 'Edit Signature'.replace('{{username}}', userName) .replace('{{userid}}', userId);
  plUrl = 'http://www.head-fi.org/users/signature/edit_signature/user_id/{{userid}}'.replace('{{username}}', userName) .replace('{{userid}}', userId);
  $('<li/>') .append($('<a/>', {
    text: plText,
    href: plUrl,
    target: '_self'
  })) .insertBefore($('.profile .menu .prefs'));
  
  
  
  /*-----CORRECT THE CAPITALIZATION OF YOUR USERNAME ON YOUR PROFILE MENU-----*/
  $('.profile .menu .username a') .text($('#loggedin-username') .text());
  
  
  
  /*-----CHANGE "Logout" ON PROFILE MENU TO "Log Out"-----*/
  $('.profile .menu .logout a') .text('Log Out');
  
  this.setHighlight = function() {
   smUtils.addClass(self.o,'highlight');
   self.o.scrollIntoView (); 
   scrollElmVert(self.o,-90);
  }
  
  /*-----LINKIFY THE LAST BREADCRUMB AT THE TOP OF THE PAGE (directly underneath the navbar)-----*/
  var last = $('#bc .last');
  var metaUrl = $('meta[property="og:url"]') .attr('content');
  $('<a/>', {
    href: metaUrl,
    text: last.html()
  }) .insertBefore(last);
  last.remove();


  
   /*-----PUT "Private Messages" AND "Subscriptions" ON THE NAVBAR   ---   ALL OF THE FORMATTING AND STYLING IS IN THE "Theme Option" SCRIPTS-----*/
  
  
  var privateMessagesCount = $('.messages .notification-counter') .first() .text() .replace(/s+/, '');
  var subscriptionsCount = $('.subscriptions .notification-counter') .first() .text() .replace(/s+/, '');
  var notificationModule = $('<li/>', {
    class: 'jncontainer',
  });
  var msgText = privateMessagesCount == 1 ? 'New Message ' : privateMessagesCount < 1 ? 'Private Messages ' : 'New Messages ';
  var messagesContainer = $('<a/>', {
    href: 'http://www.head-fi.org/messages',
    text: msgText,
    class: 'jlink',
  });
  var messagesCounter = $('<span/>', {
    text: privateMessagesCount,
    class: 'jcounter'
  });
  var subsContainer = $('<a/>', {
    href: 'http://www.head-fi.org/users/subscriptions/',
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

/*-----Autoscroll PM threads to the  latest message-----*/

if(window.location.href.indexOf("/messages/messages") > -1)
{$(window).bind('load', function () { 
  $(window).scrollTop($('div.conversation:nth-last-child(2)').offset().top - 51);
});
    
}