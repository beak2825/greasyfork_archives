// ==UserScript==
// @name         Watch Tiktok in fullscreen
// @name:fr      Regarder Tiktok en plein écran
// @include         *tiktok.com/*
// @version      0.8
// @description  Hide the comment section of all Tiktok videos so the videos will be full screen.
// @description:fr  Masque la section des commentaires de toutes les vidéos Tiktok afin que les vidéos soient en plein écran.
// @author       modmodmooood
// @match        https://www.tiktok.com
// @icon         https://www.google.com/s2/favicons?domain=https://www.tiktok.com/
// @grant        none
// @namespace https://tiktok.com/*
// @downloadURL https://update.greasyfork.org/scripts/430913/Watch%20Tiktok%20in%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/430913/Watch%20Tiktok%20in%20fullscreen.meta.js
// ==/UserScript==


(function() {

    var injected_code_04_1 = false;
   setInterval(() => {
       var element = document.getElementsByClassName("jsx-3748520549 user-info-container")[0]
//If it isn't "undefined" and it isn't "null", then it exists.
if(typeof(element) != 'undefined' && element != null && injected_code_04_1 === false){
  injected_code_04_1 = true;
 document.getElementsByClassName("jsx-3748520549 user-info-container")[0].innerHTML = `
      <br> <br>
      <a id="close_injected_comments"><h2>Fermer</h2></a>
      `+ document.getElementsByClassName("jsx-3748520549 user-info-container")[0].innerHTML;

    document.getElementById("close_injected_comments").onclick = function() {
document.getElementsByClassName('jsx-3748520549 content-container')[0].style.display='none';
};
}

       if(typeof(element) != 'undefined' && element != null){

       }
       else
       {
             injected_code_04_1 = false;
       }
  }, 1000);
})();