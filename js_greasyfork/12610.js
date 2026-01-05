// ==UserScript==
// @name        Minecraftforum Enhancements PM Avatar fix
// @namespace   ff-sollace
// @description A simple fix for avatars being low a resolution and thust 'fuzzy' on minecraftforum's PMs whilst using MinecraftForum Enhancements.
// @include     http://www.minecraftforum.net/*
// @include     http://www.minecraftforum.net/*
// @version     1.1.3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/12610/Minecraftforum%20Enhancements%20PM%20Avatar%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/12610/Minecraftforum%20Enhancements%20PM%20Avatar%20fix.meta.js
// ==/UserScript==

(function() {
  if (document.location.href.match(/http(s|)\:\/\/www\.minecraftforum\.net\/private-messages/)) {
    var __ajax = $.ajax
    $.ajax = function () {
      try {
        var __success = arguments[0].success;
        arguments[0].success = function() {
          __success.apply(this, arguments);
          try {
            fixAvatars();
          } catch (e) {alert('Failure in Minecraftforum Enhancements! ' + e);}
        };
      } catch (e) {alert('Failure in Minecraftforum Enhancements! ' + e);}
      __ajax.apply(this, arguments);
    }
    
    fixAvatars();
  }

  if ($('.netbar-user.netbar-right').length) {
    $('.netbar-user.netbar-right img').each(function() {
      var me = $(this);
      var src = me.attr('src');
      if (src.match(/\/64\/64\/|&s=64/g)) {
        me.attr('src',src.replace(/\/64\/64\//g,'/140/140/').replace(/&s=64/g,'&s=140'));
      }
    });
  }
  
  function fixAvatars() {
    $('.avatar-55 img').each(function() {
      var me = $(this);
      var src = me.attr('src');
      if (src.match(/\/55\/55\/|&s=55/g)) {
        me.attr('src',src.replace(/\/55\/55\//g,'/140/140/').replace(/&s=55/g,'&s=140'));
      }
    });
  }
})();