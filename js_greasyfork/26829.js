// ==UserScript==
// @name        Add All linkedIn users (for 2017 version)
// @namespace   https://greasyfork.org/fr/users/11667-aymeric-maitre
// @description ajouter tout le monde sur linkedin et accepte tout le monde
// @include     http*://*linkedin.com/mynetwork*
// @version     1.1.0
// @grant       none
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAFXRFWHRDcmVhdGlvbiBUaW1lADYvMjQvMDn2wWvjAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M0BrLToAAAAY9QTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWJ+8Upq2DFJ4BklsVJu4CU1zCU5zTpWyV5+7DlN4B0twB0tvCU50C1mEC1+NDFF3DGWWDmSRD2iYEFV5EmuaE1d7FGeTFVp9FWGKFW2cGFyAGHCeGmCDG3OgHWKFHnWiIGSHIXikI2iLJHumJmuNKG6PKH2oK3CSK4CrLnSVLoOtL2iDMHaXMYavM3maNHOQNIixNXaUNnycN4uzOX6eOX+fOo21O3SLPIKiPY2yPY2zPZC3PoqtP4WkP42xQJO5QoinQ5W7RYuqRpi9SIOfSI+sSZu/S5KvS5OwTJ3BTpe6T6DDUYGXUpq2UqPFVZy5VabHV566WKjJWafHW4eaW6vLXaHAYa7NYqC+Yq3MY6LBZ6K9aq7Kbq3Hc7LMdJindbjTgbTLhL/VicDXi6u5j8TZornErL7GuMbNxdDVy9ng1dzg19fX2tra3Nzc3ODh3t7e5ubm6Ojo6urq7e3t7+/v8fHx9PT09vb2+fn5+/v7/f39/////8EcrgAAABN0Uk5TAAEFBgcSFxiGh4+a1Nra4+Pm6f7wNSIAAAFdSURBVDjLrZM7T8NAEIS/tTfOA0hogIqHgJKWv4BA8HNB/AsaKjoEgoKHCDKKbdZ3RxEHUHKWKJhmdJrRzu7enQC93gkxXJYlCCyfjjpJRPf2fvGB0D9b84WPGJJ+8nxeKNlqUUUTnHVXsyLleDAJIRRPuaZhDnW2fqNM62/sk78tFCk8iisBhjB8WUxxKN4DCBDp1KM4B5CPeHeRRlEsA7iLDoKhOA/wBKxjb9Dv5TVkK+mswtRwBFyxfQj5+KAPk4fXrDHU9azJGhPobAEs7ZUFUJPgzcxMRMTsVkQGIiIiumtm9jOFAG5Kk1t2BtBxTYSfN4wfGS7BwDV7WDBcw93W9IhHCfMGB+OGCfOrnm18xv5PhkjEN/t/iXDpz+X/JjzgEDYz2vF5r3hLW3XnUSYjazVojlIVibTowSpUSs1Eol8vhKoUSVLpdOMlQmXBKTRvqgUiItKqhhC+ALfVx6MKijHaAAAAAElFTkSuQmCC
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/26829/Add%20All%20linkedIn%20users%20%28for%202017%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26829/Add%20All%20linkedIn%20users%20%28for%202017%20version%29.meta.js
// ==/UserScript==

var profils = [];
var i = 0;

function $_GET(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function Add_User()
{
  profils = document.querySelectorAll('div.mn-pymk-list__action-container > .button-secondary-small');
  for (var i = 0; i < profils.length; i++)
    profils[i].click();
  window.open("https://www.linkedin.com/mynetwork/?BotMe=true", '_blank');
}

if ($_GET('BotMe') != null)
{
  $(document).ready(function ()
  {
    var myVar = setInterval(function() {
      console.log("Loop: ", i);

      if(i == 35)
      {
        clearInterval(myVar);
        console.log("-> close");
        window.close();
      }
      else if(i == 30)
      {
        Add_User();
        console.log("-> Add User");
      }
      else if (i >= 0 && i < 30)
      {
        console.log("-> Scrolling");
        $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
      }
      i++;
    }, 2000);
  });
}
else
{
	console.log($_GET('BotMe'));
  if (confirm("Enable Wilou's LinkedIn bot ?"))
    window.open("https://www.linkedin.com/mynetwork/?BotMe=true", '_blank');
}