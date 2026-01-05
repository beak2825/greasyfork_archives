// ==UserScript==
// @name        Solarized theme for www.marxists.org
// @description Will prevent sore eyes because of inappropriate colors on pages with text.
// @namespace   maoistscripter
// @version     1
// @grant       none
// @include https://www.marxists.org/*.htm
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/14563/Solarized%20theme%20for%20wwwmarxistsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/14563/Solarized%20theme%20for%20wwwmarxistsorg.meta.js
// ==/UserScript==
$(function()
{
  if ($("link[href='../../../css/works-rd.css']").length)
  {
    $('head').append('<style>body { background : #EEE8D5; color: black } h1, h2, h3, h4 { color:#4D7448; font-family:Arial; } p { color:#313F41; font-family:Arial; }</style>');
  }

});
