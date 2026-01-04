// ==UserScript==
// @name        Editor per crm
// @description un Editor per crm
// @author Maxeo | maxeo.net
// @include     http://crm.maxsystem.it/preventivi_e_chiusure/stampa/*
// @version     1.1.2
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.user.js
// @icon        https://www.maxeo.net/imgs/icon/android-chrome-192x192.png
// @grant       none
// @namespace https://greasyfork.org/users/88678
// @downloadURL https://update.greasyfork.org/scripts/37535/Editor%20per%20crm.user.js
// @updateURL https://update.greasyfork.org/scripts/37535/Editor%20per%20crm.meta.js
// ==/UserScript==

$(document).ready(function(){
  $('body').append('<img id="editorButtonMTX" src="http://svgur.com/i/1xn.svg" style="height: 60px;position: fixed;top:20px;right: 20px; cursor: pointer;"><style media="print">#editorButtonMTX{display:none;}</style>')
//    $('body').append('<style>#editorButtonMTX{display:none;}</style>')
  
  $('#editorButtonMTX').click(function(){
    $(this).remove()
    $('body').attr('contenteditable','true')
  })
})
//