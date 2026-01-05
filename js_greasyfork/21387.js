// ==UserScript==
// @name        Add All linkedIn users (for older interface: new version available)
// @namespace   https://greasyfork.org/fr/users/11667-aymeric-maitre
// @description ajouter tout le monde sur linkedin et accepte tout le monde
// @include     http*://www.linkedin.com/*
// @version     5.0
// @grant       none
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAFXRFWHRDcmVhdGlvbiBUaW1lADYvMjQvMDn2wWvjAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M0BrLToAAAAY9QTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWJ+8Upq2DFJ4BklsVJu4CU1zCU5zTpWyV5+7DlN4B0twB0tvCU50C1mEC1+NDFF3DGWWDmSRD2iYEFV5EmuaE1d7FGeTFVp9FWGKFW2cGFyAGHCeGmCDG3OgHWKFHnWiIGSHIXikI2iLJHumJmuNKG6PKH2oK3CSK4CrLnSVLoOtL2iDMHaXMYavM3maNHOQNIixNXaUNnycN4uzOX6eOX+fOo21O3SLPIKiPY2yPY2zPZC3PoqtP4WkP42xQJO5QoinQ5W7RYuqRpi9SIOfSI+sSZu/S5KvS5OwTJ3BTpe6T6DDUYGXUpq2UqPFVZy5VabHV566WKjJWafHW4eaW6vLXaHAYa7NYqC+Yq3MY6LBZ6K9aq7Kbq3Hc7LMdJindbjTgbTLhL/VicDXi6u5j8TZornErL7GuMbNxdDVy9ng1dzg19fX2tra3Nzc3ODh3t7e5ubm6Ojo6urq7e3t7+/v8fHx9PT09vb2+fn5+/v7/f39/////8EcrgAAABN0Uk5TAAEFBgcSFxiGh4+a1Nra4+Pm6f7wNSIAAAFdSURBVDjLrZM7T8NAEIS/tTfOA0hogIqHgJKWv4BA8HNB/AsaKjoEgoKHCDKKbdZ3RxEHUHKWKJhmdJrRzu7enQC93gkxXJYlCCyfjjpJRPf2fvGB0D9b84WPGJJ+8nxeKNlqUUUTnHVXsyLleDAJIRRPuaZhDnW2fqNM62/sk78tFCk8iisBhjB8WUxxKN4DCBDp1KM4B5CPeHeRRlEsA7iLDoKhOA/wBKxjb9Dv5TVkK+mswtRwBFyxfQj5+KAPk4fXrDHU9azJGhPobAEs7ZUFUJPgzcxMRMTsVkQGIiIiumtm9jOFAG5Kk1t2BtBxTYSfN4wfGS7BwDV7WDBcw93W9IhHCfMGB+OGCfOrnm18xv5PhkjEN/t/iXDpz+X/JjzgEDYz2vF5r3hLW3XnUSYjazVojlIVibTowSpUSs1Eol8vhKoUSVLpdOMlQmXBKTRvqgUiItKqhhC+ALfVx6MKijHaAAAAAElFTkSuQmCC
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/21387/Add%20All%20linkedIn%20users%20%28for%20older%20interface%3A%20new%20version%20available%29.user.js
// @updateURL https://update.greasyfork.org/scripts/21387/Add%20All%20linkedIn%20users%20%28for%20older%20interface%3A%20new%20version%20available%29.meta.js
// ==/UserScript==
function setCookie(cname, cvalue, exmin) {
  var d = new Date();
  d.setTime(d.getTime() + (exmin * 60 * 1000));
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
}
function listCookies()
{
  if (document.cookie === '')
  return false;
  var theCookies = document.cookie.split('; ');
  return theCookies;
}
function Add_User()
{
  var myVar = setInterval(function() {
      console.log("Loop: ", i);

      if(i == 20)
      {
        console.log("-> close");
        window.location = 'https://www.linkedin.com/people/pymk';
        clearInterval(myVar);
      }
      else if(i == 15)
      {
        MyAdding();
        //alert("add");
        console.log("-> Add User");
      }
      else if (i >= 0 && i < 30)
      {
        console.log("-> Scrolling");
        $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
      }
      i++;
    }, 1500);
}
function MyAdding()
{
  var profils = document.querySelectorAll('button.bt-request-buffed');
  var invit = document.querySelectorAll('button.bt-invite-accept');
  for (var i = 0; i < profils.length; i++)
  profils[i].click();
  for (var j = 0; j < invit.length; j++)
  invit[j].click();
}
var style = '<style>\t\t\t\t\t.but{\t\t\t\t\t\tborder-radius: 0;\t\t\t\t\t\tbackground-color: #6587b9;\t\t\t\t\t\tborder: 1px solid #034ab4;\t\t\t\t\t\tcursor: pointer;\t\t\t\t\t\tcolor: #ffffff;\t\t\t\t\t\tfont-family: Arial;\t\t\t\t\t\tfont-size: 13px;\t\t\t\t\t\tfont-weight: bold;\t\t\t\t\t\tpadding: 11px 15px;\t\t\t\t\t\tmargin-left: 10px;\t\t\t\t\t\ttext-decoration: none;\t\t\t\t\t\ttext-align: center;\t\t\t\t\t}\t\t\t\t</style>'
;
var button = '<button class="but" id="Add_all">Lancer 1 fois</button>';
if (jQuery.inArray('AddAuto_coockie=true', listCookies()) >= 0)
var states = '✔';
 else
var states = '✗';
var i = 0;
var button2 = '<button class="but" id="Add_auto">Ajout automatique ' + states + '</button>';
$('h2.section-header').append(button);
$('h2.section-header').append(button2);
$(document).ready(function ()
{
  $('body').append(style);
  $('button#Add_all').click(function () {
    Add_User();
  });
  $('button#Add_auto').click(function () {
    if (states == '✗')
    {
      alert('Automate activer');
      setCookie('AddAuto_coockie', 'true', 80);
      Add_User();
    } 
    else
    {
      alert('Automate desactiver');
      document.cookie = 'AddAuto_coockie=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  });
  if (states == '✔')
  {
    Add_User();
  }
});
