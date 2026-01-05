// ==UserScript==
// @name        cmid auto login
// @namespace   cmid
// @description cm id spot
// @include     http://welcome.wifi.id/wifi.id/sekolah.cinderamata/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17625/cmid%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/17625/cmid%20auto%20login.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////////////////////////
//// memodifikasi script ini bebas dengan catatan tidak menghilangkan credit aslinya, trims. ////
//// ______________________________________________________________________________________  ////
////                      modifed By joesatch*                           ////
////////////////////////////////////////////////////////////////////////////////////////////////


//////// edit Username & Password @Wifi.id dibawah ini  /////////
var username = 'lpcm'; 
var password = '726282';

if (username == '1111111111')
{
  alert('Username dan Password @wifi.id belum ditetapkan,\n silahkan ubah terlebih dahulu scriptnya');
  return false;
}
else if (window.location.href.match('welcome.wifi.id/wifi.id/sekolah.cinderamata'))
{
  document.getElementById('user_id').value = username;
  document.getElementById('pass_id').value = password;
  setTimeout(function ()
  {
      $('#loginForm').submit();
    //document.forms['login-form'].submit();
  }, 100);
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//// memodifikasi script ini bebas dengan catatan tidak menghilangkan credit aslinya, trims. ////
//// ______________________________________________________________________________________  ////
////                      modifed By supri yatna => siapa sajah :*                           ////
////////////////////////////////////////////////////////////////////////////////////////////////