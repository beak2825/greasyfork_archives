// ==UserScript==
// @name         Voca Test Cheat Mode7
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  allzol
// @author       You
// @match        https://chamstudyland.com/vokok/desktop/login.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chamstudyland.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479378/Voca%20Test%20Cheat%20Mode7.user.js
// @updateURL https://update.greasyfork.org/scripts/479378/Voca%20Test%20Cheat%20Mode7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function login1() {
        var id = $("#id").val();
  var pw = $("#pw").val();

  $.get('../../cham_admin/cham_login_check.php?id='+id+'&pass='+pw, function(result){
    if(result=="<"){
      alert("아이디와 비밀번호를 다시 확인해주세요.");
    }else if(false){
      alert(result.slice(4));
    }else{
      var current_url = document.location.href;
      if(current_url.includes("develop")){
        $.post('../lib/update_data.php?type=login_develop&config='+id, function(result){});
      }else{
        $.post('../lib/update_data.php?type=login&config='+id, function(result){});
      }
      // if(id='tony8795') id='yyyy';
      // alert(url);
      $.get('../lib/set_login_session.php?user_id='+id, function(result){
        location.href = url;
      });
    }
  }, 'text');
    }
    window.login = login1;
})();