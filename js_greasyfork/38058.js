// ==UserScript==
// @name The West -  Change of interface
// @namespace https://greasyfork.org/es/scripts/38058-the-west-change-of-interface
// @author HALCON DE ORO
// @description Change of interface to be able to have more scripts
// @include https://*.the-west.*/game.php*
// @version 1.3
// @downloadURL https://update.greasyfork.org/scripts/38058/The%20West%20-%20%20Change%20of%20interface.user.js
// @updateURL https://update.greasyfork.org/scripts/38058/The%20West%20-%20%20Change%20of%20interface.meta.js
// ==/UserScript==
(function (func) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + func.toString() + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function () {

//Cambio en la interfaz para que entren mas scripts.
  $('div#ui_bottomright').css({
            'right': '55px'
          }); 
  $('div#ui_right').css({
            'right': '35px'
          });
  $('#westforts_link_div').css({
            'right': '40px'
          });
  $('div#ui_menubar').css({
            'bottom': '110px'
          });
  $('div#buffbars').css({
            'right': '35px'
          });
  
//Para guardar el boton de los scripts en opciones
  $(document).ready(function()
 {
 var newfunction = String(EscapeWindow.open);
 newfunction = 'EscapeWindow.open='+newfunction+';';
 newfunction = newfunction.replace(/\.setSize\(240\,290\)/g, ".setSize(240, 326)");
 newfunction = newfunction.replace(/window\.open\(Game\.forumURL,'wnd'\+\(new Date\)\.getTime\(\)\);/g, "(window.open(Game.forumURL, 'wnd' + new Date).getTime());}],['Script', function() {TheWestApi.open();");
 eval(newfunction);
 window.setTimeout("$('#ui_scripts').css({'display' : 'none'});", 10000);
 });

});