// ==UserScript==
// @name         Selecteur de couleur
// @namespace    http://www.iraz.fr/*
// @version      1.1
// @description  Color Picker Iraz Modding
// @author       WeyZen
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21299/Selecteur%20de%20couleur.user.js
// @updateURL https://update.greasyfork.org/scripts/21299/Selecteur%20de%20couleur.meta.js
// ==/UserScript==
$('body').append('<script src="https://rawgit.com/maretdu93/Colora/master/jscolorazerty.js"></script>');

if(window.location.href.indexOf("draft") > -1){
    $('li.redactor_btn_container_fontfamily').after('<input class="jscolor {hash:true}{required:false}" onclick="$(this).select();" value="52B5EB" id="jscolorid" style="height:20px; width:59px;padding: inherit;font-size: 13px;">');
}
else {
    $('li.redactor_btn_container_fontfamily').after('<input class="jscolor {hash:true}{required:false}" onclick="$(this).select();" value="52B5EB" id="jscolorid" style="height:20px; width:59px;padding: inherit;">');
}

$(document).ready(function(){

        
       var   css = '.redactor_toolbar {font-style: normal;    font-size: 13px;    font-family: "Trebuchet MS",Verdana,Arial,Helvetica,sans-serif;    background: #f0f7fc url("styles/realitygaming/xenforo/gradients/form-button-white-25px.png") repeat-x top;    padding: 0 0 0 2px;    margin: 0;    border-bottom: 1px solid rgb(152,151,151);    border-bottom: 1px solid rgba(152,151,151,0.15);    _border-bottom: 1px solid rgb(152,151,151);    position: relative;    left: 0;    top: 0;    line-height: 0;    list-style: none;    overflow: hidden;}';
   
              

    $('head').append('<style>' + css + '</style>');
            });



