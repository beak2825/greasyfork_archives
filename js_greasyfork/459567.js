// ==UserScript==
// @name        Remote Upload Upto to Upto/1F/Multi
// @description Téléverse un fichier depuis Uptobox vers l'API de MultiUp lorsque l'on clique sur un bouton "Remote" (utilisant la fonction "remote upload")
// @match       https://uptobox.com/**
// @version     2.0
// @author      Invincible812
// @grant       GM.xmlHttpRequest
// @grant       GM_getValue
// @namespace https://greasyfork.org/users/868328
// @downloadURL https://update.greasyfork.org/scripts/459567/Remote%20Upload%20Upto%20to%20Upto1FMulti.user.js
// @updateURL https://update.greasyfork.org/scripts/459567/Remote%20Upload%20Upto%20to%20Upto1FMulti.meta.js
// ==/UserScript==



(function() {
  if(window.location.href!=="https://uptobox.com/my_files#//"){
  let liendl = document.getElementsByClassName('big-button-green reset-a mt-1 mb-4')[0].href
  liendl = liendl.replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%20','.').replace('%2C','.').replace('%27','.').replace('%27','.')
  console.log(liendl)
  document.getElementsByClassName('flex grow-1 column')[0].insertAdjacentHTML('afterbegin',`<textarea id="linkk" name="linkks" rows="3" cols="10"></textarea>`)
  document.getElementById('linkk').value = liendl

  document.getElementsByClassName('flex grow-1 column')[0].insertAdjacentHTML('afterbegin',`<button id="remote_unf" class="btn btn-success" type="button">Remote 1F</button>`);
  document.getElementsByClassName('flex grow-1 column')[0].insertAdjacentHTML('afterbegin',`<button id="remote_upto" class="btn btn-success" type="button">Remote Upto</button>`);
  document.getElementsByClassName('flex grow-1 column')[0].insertAdjacentHTML('afterbegin',`<button id="remote_multi" class="btn btn-success" type="button">Remote Multi</button>`);
  document.getElementById("remote_unf").onclick = function() {
      liendl = document.getElementById('linkk').value
      GM.xmlHttpRequest({ // 1F
      method: "POST",
      dataType: "json",
      url: `https://multiup.org/api/remote-upload?username=${GM_getValue("MULTIUP_unf_user")}&password=${GM_getValue("MULTIUP_unf_pass")}&link=${liendl}`,
      onload: function(response){let repjson = JSON.parse(response.response);if(repjson.error=="success"){document.getElementsByTagName('button')[2].style.backgroundColor='green'}else{document.getElementsByTagName('button')[2].style.backgroundColor='red'}},
    });
  }
  document.getElementById("remote_upto").onclick = function() {
    liendl = document.getElementById('linkk').value
      GM.xmlHttpRequest({ // Upto
      method: "POST",
      dataType: "json",
      url: `&link=${liendl}`,
      onload: function(response){let repjson = JSON.parse(response.response);if(repjson.error=="success"){document.getElementsByTagName('button')[1].style.backgroundColor='green'}else{document.getElementsByTagName('button')[1].style.backgroundColor='red'}},
    });
  }
  document.getElementById("remote_multi").onclick = function() {
    liendl = document.getElementById('linkk').value
      GM.xmlHttpRequest({ // Multi
      method: "POST",
      dataType: "json",
      url: `https://multiup.org/api/remote-upload?username=${GM_getValue("MULTIUP_multi_user")}&password=${GM_getValue("MULTIUP_multi_pass")}&link=${liendl}`,
      onload: function(response){let repjson = JSON.parse(response.response);if(repjson.error=="success"){document.getElementsByTagName('button')[0].style.backgroundColor='green'}else{document.getElementsByTagName('button')[0].style.backgroundColor='red'}},
    });
  }
  }
})();

window.addEventListener('load', function() {
if(location.href.includes('/my_files#//')){
  for(let i=0; i<document.getElementsByClassName('btn-wrapper').length; i++){
    document.getElementsByClassName('btn-wrapper')[i].insertAdjacentHTML('afterbegin',`<div class="cell-padding btn dl bounce-click"><div class="" style="opacity: 0;"></div><i class="fal fa-link"></i></div>`)
  }
}
})
