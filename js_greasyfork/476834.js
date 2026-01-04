// ==UserScript==
// @name             GreasyFork hide scripts for author or word
// @name:es            GreasyFork oculta scripts por autor o palabra
// @namespace    https://greasyfork.org/es/users/758165-alexito
// @description     Adds an X button at the top left in GreasyFork that hides scripts by author or word
// @match            https://greasyfork.org/*/scripts*
// @grant            none
// @version         1.1
// @author            AlExito
// @description:es   Agrega un boton X en la parte superior izquierda en GreasyFork que oculta scripts por autor o palabra
// @noframes
// @license        MIT   feel free to modify improve and share
// @downloadURL https://update.greasyfork.org/scripts/476834/GreasyFork%20hide%20scripts%20for%20author%20or%20word.user.js
// @updateURL https://update.greasyfork.org/scripts/476834/GreasyFork%20hide%20scripts%20for%20author%20or%20word.meta.js
// ==/UserScript==

 (function() {
    var buttonkill = document.createElement("div");
    buttonkill.setAttribute("style", "z-index:9999;position:fixed;top:1px;left:1px;background:#037;color:#fff; border:0px solid #fff;text-align:center;line-height:14px;width:14px;font-size:14px!important;cursor:default;");
    buttonkill.title="Remove scripts";
    buttonkill.append('X');
    buttonkill.onclick = function() {action()};
    document.body.append(buttonkill);

function action() {
    var scriptslist = /W0RD5|Bilibili|N4M35|lUSER69/i;
document.querySelectorAll("#browse-script-list > li").forEach(function(e){
   var elechild = e.innerText.split("\n");
          for ( i=0; i < elechild.length; i++){
              if(elechild[i].match(scriptslist)){
              e.remove();
     };
  };
});
};
})();