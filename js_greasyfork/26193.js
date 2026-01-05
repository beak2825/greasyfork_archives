// ==UserScript==
// @name        Apollo Custom users
// @namespace   by Mirai
// @description Substitute reality with your own.
// @include     https://apollo.rip/forums.php?action=viewthread*
// @include     https://apollo.rip/forums.php?page*
// @include     https://apollo.rip/comments.php?*
// @include     https://apollo.rip/torrents.php?*
// @include     https://passtheheadphones.me/forums.php?action=viewthread*
// @include     https://passtheheadphones.me/forums.php?page*
// @include     https://passtheheadphones.me/comments.php?*
// @include     https://passtheheadphones.me/torrents.php?*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26193/Apollo%20Custom%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/26193/Apollo%20Custom%20users.meta.js
// ==/UserScript==

function init() {
  var obj,
  Users = [
    {
      'id': '',
      'avatar': '',
      'title': ''
    },
    {
      'id': '18167',
      'avatar': 'https://vgy.me/eDjMJK.png',
      'title': 'Example'
    }
  ];
  function getUserPosts(userID) {
    var userPost = $('.colhead_dark a[href$=' + userID + ']');
    return userPost;
  }
  function setAvatar(userID, customAvatar) {
    var parent = getUserPosts(userID);
    var userAvatar = parent.closest('tbody').find('.avatar div img');
    userAvatar.attr('src', customAvatar);
  }
  function setTitle(userID, customTitle) {
    var parent = getUserPosts(userID);
    console.log(parent);
    var userTitle = parent.closest('tbody').find('.user_title');
    var container = '<span class="user_title"></span>';
    var titleLocation = parent.closest('tbody').find('.time');
    if (userTitle.length === 0) {
      titleLocation.before(container);
      userTitle = parent.closest('tbody').find('.user_title');
      userTitle.text(customTitle);
    } else {
      userTitle.text(customTitle);
      return userTitle;
    }
  }
  function customizeUsers(obj) {
    var id = obj.id,
    avatar = obj.avatar,
    title = obj.title;
    if (avatar.length > 0) {
      setAvatar(id, avatar);
    }
    if (title.length > 0) {
      setTitle(id, title);
    }
  }

  for (obj = 0; obj < Users.length; obj++) {
    customizeUsers(Users[obj]);
  }
}

if(document.readyState === 'complete') init();
else document.addEventListener('DOMContentLoaded',  init, false);