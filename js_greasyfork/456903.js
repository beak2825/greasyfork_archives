// ==UserScript==
// @name         Valentine Script DL
// @version      0.3.2
// @description  Script pour DL depuis Valetine en anonyme
// @author       Invincible812
// @match        https://valentine.wtf/**
// @match        https://valentine.wtf/genre/nouveautes
// @icon         https://valentine.wtf/images/favicon.png
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/868328
// @downloadURL https://update.greasyfork.org/scripts/456903/Valentine%20Script%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/456903/Valentine%20Script%20DL.meta.js
// ==/UserScript==

window.addEventListener('load', function () {

  function recup_stockage() {
    return GM_getValue("id_dl_val") || [];
  }

  var dl = recup_stockage();

  if (document.getElementsByClassName('content-page')[0].childNodes[7] === undefined) {
    let long_ebooks = document.getElementsByClassName('content-page')[0].childNodes[5].childNodes[1].childElementCount;
    //console.log('dl', dl)
    for (var i = 0; i < long_ebooks; ++i) {
      let id = document.getElementsByClassName('content-page')[0].childNodes[5].children[0].children[i].children[0].attributes[3].textContent;
      if (dl.includes(id)) {
        document.getElementsByClassName('content-page')[0].childNodes[5].children[0].children[i].classList.add("downloaded");
      }
    }
  } else {
    let long_ebooks = document.getElementById('liste_ebooks').children[0].childElementCount;

    for (var i = 0; i < long_ebooks; ++i) {
      let id = document.getElementsByClassName('content-page')[0].childNodes[5].children[0].children[i].children[0].attributes[3].textContent;
      if (dl.includes(id)) {
        document.getElementsByClassName('content-page')[0].childNodes[5].children[0].children[i].classList.add("downloaded");
      }
    }
  }
});



$(document).on('click', 'div.eBookInfo', function (e) {
  //console.log('OK')
  e.preventDefault();
  let liendl = e.target.currentSrc;
  let id_book = liendl.match(/([0-9]{6})/);
  id_book = id_book[0];
  //console.log(id_book)
  liendl = liendl.replace(".jpg", ".epub");
  liendl = liendl.replace(".jpeg", ".epub");

  function lien_dispo() {
    if (typeof document.getElementById('DLlink').children[0] === 'undefined') {
      //console.log('indéfini');
    } else {
      //console.log('défini');
      //console.log(liendl);
      document.getElementById('DLlink').children[0].href = liendl;
      document.getElementsByClassName('row')[0].style.backgroundColor = "#038c11";

      //document.getElementById('DLlink').children[0].insertAdjacentHTML(`afterend`,`<a id="save_prez" class="ebo_id" title="IDd">${id_book}</a>`);
      //navigator.clipboard.writeText(id_book);
      // $(document).on('click', '#save_prez', function() {
      //   let title = document.querySelector('.boite-grise h3.bleuval a').textContent.trim();
      //   let title2 = "";
      //   if(document.querySelector('.boite-grise h3.bleuval a:nth-of-type(2)')!==null){
      //     title2 = document.querySelector('.boite-grise h3.bleuval a:nth-of-type(2)').textContent.trim().replace(':','-');
      //     title2 = " - " + title2;
      //   }
      //   let auteur = document.querySelector('.boite-grise h5').textContent.trim();
      //   let copy = title + title2 + ' - ' + auteur;
      //   navigator.clipboard.writeText(copy);
      // });
    }
  }

  function lien_nondispo() {
    if (typeof document.getElementById('DLlink').children[0] === 'undefined') {
      //console.log('indéfini');
    } else {
      //console.log('défini');
      document.getElementsByClassName('row')[0].style.backgroundColor = "#ff0000";
    }
  }

  function verif_fichier(liendl) {
    httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', liendl, true);
    httpRequest.onload = () => {
      if (httpRequest.readyState === httpRequest.DONE && httpRequest.status === 200) {
        setTimeout(lien_dispo, 2000);
      } else {
        setTimeout(lien_nondispo, 3000);
      }
    };
    httpRequest.send();

  } verif_fichier(liendl);


  $(document).on('click', document.getElementById('DLlink'), function () {
  //console.log("D'ACC");

  function add_stockage(id_stockage) {
    let stockage_add = GM_getValue("id_dl_val") || [];  // Initialiser comme un tableau vide si null
    //console.log("Stockage : " + stockage_add);

    if (!Array.isArray(stockage_add)) {
      stockage_add = [];  // S'assurer que stockage_add est un tableau
    }

    if (!stockage_add.includes(id_stockage)) {
      //console.log(id_stockage);
      stockage_add.push(id_stockage);
      GM_setValue('id_dl_val', stockage_add);  // Corriger l'espace dans la clé
      //console.log("L'id " + id_stockage + " à été ajouté au stockage");
    } else {
      //console.log("L'id " + id_stockage + " est déjà dans stockage");
    }
  }

  if (!document.getElementById('DLlink').children[0].href.includes('includes/telechargement.php?cle=')) {
    add_stockage(id_book);
  }
});

});
