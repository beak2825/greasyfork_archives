// ==UserScript==
// @name        Darkino NFO Maker
// @match       https://catalogue.darkino*.*/*
// @match       https://1fichier.com/**
// @version     1.38
// @author      Invincible812
// @description Script pour faire des NFO sur Darkino
// @namespace   https://www.serveurperso.com
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js
// @grant       GM.xmlHttpRequest
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/483389/Darkino%20NFO%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/483389/Darkino%20NFO%20Maker.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
if (true) {
  console.log('[NFO MAKER] Start');
  if (document.location.pathname.includes('liens-manager-add')) {
    document.getElementsByClassName('fi-fo-field-wrp-helper-text text-sm text-gray-500')[2].hidden="true";
    document.getElementsByTagName('textarea')[0].style.height = '200px';
    document.getElementsByTagName('textarea')[1].style.height = '500px';
    if (document.getElementsByClassName('text-sm font-medium leading-6 text-gray-950 dark:text-white')[4].textContent.includes('Saison')) {
        console.log('[NFO MAKER] Série');
       document.getElementsByClassName('flex items-center justify-between gap-x-3')[7].insertAdjacentHTML('afterbegin', `<b id="b_nfo" class="btn btn-link" title="Ajout du NFO">Gên le NFO</b>`);
    } else {
      console.log('[NFO MAKER] Pas série');
      document.getElementsByClassName('flex items-center justify-between gap-x-3')[5].insertAdjacentHTML('beforeend', `<b id="b_nfo" class="btn btn-link" title="Ajout du NFO">Gên le NFO</b>`)
    }
    document.getElementById("b_nfo").onclick = function () {
      console.log('[NFO MAKER] Bouton cliqué');
      if (document.getElementsByTagName('textarea')[0].value.includes('https://1fichier.com/')) {
        let id = document.body.getElementsByTagName('textarea')[0].value.match(/\?(.*)/)[1].match(/[a-zA-Z0-9]+/g).join('');
        var xhr = GM.xmlHttpRequest({
          method: "GET",
          url: "https://www.serveurperso.com/stats/mediainfoshort2.php?filecode=" + id,
          onload: function (response) {
            if(response.response=="1fichier filecode error"){
              document.getElementsByClassName("btn btn-link")[0].style.color="orange";
            } else {
              navigator.clipboard.writeText(response.response);
              document.getElementsByClassName("btn btn-link")[0].style.color="green";
            }
          }
        });
        document.getElementsByClassName('grid flex-1 auto-cols-fr gap-y-8')[0].insertAdjacentHTML('afterend','<img id="frame" width="300" height="150" src="" style="width: 50%" title="Cliquer pour changer !" />');
        let frameid = $("#frame");
        function frame() {
          let seconds = Math.floor(Math.random() * (300 - 100)) + 100;
          frameid.attr("src", "https://www.serveurperso.com/stats/frame2.php?filecode=" + id + "&seconds=" + seconds);
        }
        frame();
        frameid.click(frame);
       }
     }
  }
}
});
