// ==UserScript==
// @name        chinanetAutoLoginPlus
// @namespace   llwxg2@gmail.com
// @include     https://wlan.ct10000.com/index.wlan
// @version     1.0
// @grant       none
// @description 打开chinanet页面后自动填写账号信息
// @downloadURL https://update.greasyfork.org/scripts/12600/chinanetAutoLoginPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/12600/chinanetAutoLoginPlus.meta.js
// ==/UserScript==
$(document).ready(function(){
  var otherUser = document.getElementById('otherUser');
  var otherUserPwd = document.getElementById('otherUserPwd');
  var regArea = document.getElementById('regArea');
  otherUser.value = 'hswl00001409';
  otherUserPwd.value = 'w625361';
  regArea.value = 'ah';
});