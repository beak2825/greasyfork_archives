// ==UserScript==
// @name        Add paste
// @namespace   national-lottery.co.uk
// @description Add paste to national lottery website sign in page
// @include     https://www.national-lottery.co.uk/sign-in
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5083/Add%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/5083/Add%20paste.meta.js
// ==/UserScript==

var $login_input = $('#form_password');

if ($login_input.length) {
  $login_input.hide();
  
  var $new_input = $('<input>');
  
  $new_input.attr({
    type: 'password',
    id: 'my_form_password',
    name: '',
    class: 'text',
    style: 'border: 1px solid blue'
  }).appendTo($login_input.parent());
  
  //for pasting event
  $new_input.on('keyup input', function(e) { 
    $login_input.val($(this).val());  
  });
  
}