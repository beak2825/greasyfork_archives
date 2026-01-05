// ==UserScript==
// @name        Dhaka-1
// @namespace   Old Captcha
// @description Code Shaban Ali
// @include     http://indianvisa-bangladesh.nic.in/visa/Appointment_Login.jsp
// @include     http://indianvisa-bangladesh.nic.in/visa/ProcessApptPwd.jsp
// @include     http://indianvisa-bangladesh.nic.in/visa/Appointment_Passport.jsp
// @include     http://indianvisa-bangladesh.nic.in/visa/ReprintAppt.jsp
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19156/Dhaka-1.user.js
// @updateURL https://update.greasyfork.org/scripts/19156/Dhaka-1.meta.js
// ==/UserScript==
javascript: var cap = document.getElementById('capt'),
cap_ch = document.querySelectorAll('a') [0];
cap.width = 155;
cap.height = 35;
cap.src = 'Rimage.jsp';
function refreshMyCaptcha() {
  try {
    var d = new Date();
    var n = d.getTime();
    document.getElementById('capt').src = 'Rimage.jsp?rand=' + n;
  } catch (e) {
    alert(e);
  }
  return false;
}
cap_ch.addEventListener('click', function () {
  refreshMyCaptcha();
})
var x = document.getElementsByClassName('cl') [2].innerHTML;
if (x.trim() == 'Applicant\'s Given Name') {
  document.getElementsByClassName('textBoxDashed app_field') [0].value = 'BIDHAN';
} else if (x.trim() == 'Birth Place') {
  document.getElementsByClassName('textBoxDashed app_field') [0].value = 'SATKHIRA';
} else if (x.trim() == 'Father\'s Name') {
  document.getElementsByClassName('textBoxDashed app_field') [0].value = 'NARAYANPALIT';
} else if (x.trim() == 'Mother\'s Name') {
  document.getElementsByClassName('textBoxDashed app_field') [0].value = 'ARCHONAPALIT';
}
var y = document.getElementsByClassName('cl') [3].innerHTML;
if (y.trim() == 'Applicant\'s Given Name') {
  document.getElementsByClassName('textBoxDashed app_field') [1].value = 'BIDHAN';
} else if (y.trim() == 'Birth Place') {
  document.getElementsByClassName('textBoxDashed app_field') [1].value = 'SATKHIRA';
} else if (y.trim() == 'Father\'s Name') {
  document.getElementsByClassName('textBoxDashed app_field') [1].value = 'NARAYANPALIT';
} else if (y.trim() == 'Mother\'s Name') {
  document.getElementsByClassName('textBoxDashed app_field') [1].value = 'ARCHONAPALIT';
}
