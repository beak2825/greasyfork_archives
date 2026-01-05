// ==UserScript==
// @name        Appointment Home and Passport page auto submit
// @namespace   surajitbasak109@gmail.com
// @description Indian Visa Bangladesh Appointment Home and Passport auto page submit
// @include     http://indianvisa-bangladesh.nic.in/visa/Appointment_Home.jsp
// @include     http://indianvisa-bangladesh.nic.in/visa/Appointment_Passport.jsp
// @version     1.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/17507/Appointment%20Home%20and%20Passport%20page%20auto%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/17507/Appointment%20Home%20and%20Passport%20page%20auto%20submit.meta.js
// ==/UserScript==
$(document).ready(function() {
  fileno = 'BGDDV7FE9A16';
  birthdate = '06/09/1969';
  passport_no = 'BA0779920';
  ImgNum = '91x47f';
  
  if ($('#pia'))
    $('#pia').val('BGDD1');
  $('#fileno').val(fileno);
  if ($('#birthdate'))
    $('#birthdate').val(birthdate);
  if ($('#passport_no'))
    $('#passport_no').val(passport_no);
  $('#ImgNum').val(ImgNum);
  $('.btn.btn-primary').click();
});