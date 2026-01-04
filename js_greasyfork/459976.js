// ==UserScript==
// @namespace       https://dl.spiitland.xyz
// @name            Better SpiitLand
// @match           https://dl.spiitland.xyz/**
// @grant           none
// @version         1.0.1
// @author          Invincible812
// @description     Une version sympathique du site avec des tools sympa
// @icon            https://dl.spiitland.xyz/public/static/favicon.png?v=3.0.0
// @license         Tous droits réservés
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/459976/Better%20SpiitLand.user.js
// @updateURL https://update.greasyfork.org/scripts/459976/Better%20SpiitLand.meta.js
// ==/UserScript==


window.addEventListener('load', function () {
  function creation(){
      let id = document.getElementsByClassName('container')[0].children[0].children[0].children[5].children[0].textContent;
      let type = document.getElementsByClassName('container')[0].children[0].children[0].children[4].children[0].textContent;
      if (type=="series"){
        type="tv"
      }if(type=="movie"){
        type="movie"
      }
      document.getElementsByClassName('switch-container')[0].children[3].href='https://dl.spiitland.xyz/admin/tmdb?filter={"_ACTION":"filter","type":"' + type +'","bulk_ids":"' + id + '"}';
      document.getElementsByClassName('switch-container')[0].children[3].textContent="Créer la fiche";
  };

  function init_poster(){
    for(let i=1; i< document.getElementsByClassName('row row-cols-xl-4')[0].childElementCount;i++){
      document.getElementsByClassName('row row-cols-xl-4')[0].children[i].insertAdjacentHTML('afterbegin',`<button onclick="Copié !" class="btn-copy-prez ${i}">Copier Prez</button>`);
    };
  };

  function retour(place){
    place.insertAdjacentHTML('beforeend',`<br><br><a href="javascript:history.go(-1)" class="btn btn-theme btn-lg px-md-5 retour">Retour</a>`);
  }

  function voirtmdb(){
    let id = document.getElementsByClassName('container')[0].children[0].children[0].children[5].children[0].textContent;
    let type = document.getElementsByClassName('container')[0].children[0].children[0].children[4].children[0].textContent;
      if (type=="series"){
        type="tv"
      }if(type=="movie"){
        type="movie"
      }
    document.getElementsByClassName('form-group')[2].children[4].insertAdjacentHTML('beforeend',`<br><br><a href="https://www.themoviedb.org/${type}/${id}" class="btn btn-theme btn-lg px-md-5 retour">Voir sur TmDB</a>`);
  }

  function accesadmin(){
    let id = document.location.href.match(/-(\d+)$/)[1];
    let myURL = new URL(document.location.href).pathname.split('/');
    let categ = myURL[1];
    document.getElementsByClassName('detail-header d-flex align-items-center')[0].children[0].children[0].children[0].children[1].insertAdjacentHTML('afterend',`<td><div align="center">
    <a type="button" class="btn-svg editable mr-0" href="https://dl.spiitland.xyz/admin/${categ}/${id}">
    <svg class="icon" stroke-width="3">
    <use xlink:href="https://dl.spiitland.xyz/public/assets/img/sprite.svg#edit"></use></svg><span>Éditer</span></a></div></td>`);
    document.getElementsByClassName('nav-item dropdown')[1].children[1].children[2].insertAdjacentHTML('afterend',`<a href="https://dl.spiitland.xyz/admin/posters" class="all text-center">
                                Admin Posters</a>`)
  }

  function copy(box){
    let card = document.getElementsByClassName('row row-cols-xl-4')[0].children[box];
    let qualité = card.children[4].children[0].textContent;localStorage.setItem('qualité', qualité)
    let langue = card.children[5].children[0].textContent;localStorage.setItem('langue', langue)
    let hebergeur = card.children[6].children[0].textContent;localStorage.setItem('hebergeur', hebergeur)
    let codecvideo = card.children[7].children[0].textContent;localStorage.setItem('codecvideo', codecvideo)
    let codecaudio = card.children[8].children[0].textContent;localStorage.setItem('codecaudio', codecaudio)
    let taille = card.children[9].children[0].textContent;localStorage.setItem('taille', taille)
    let team = card.children[10].children[0].textContent;localStorage.setItem('team', team)
    let nfo = card.children[11].children[0].textContent;localStorage.setItem('nfo', nfo)
    let dl = card.children[12].children[0].textContent;localStorage.setItem('dl', dl)
  };

  function paste(box){
    let card = document.getElementsByClassName('row')[box];
    let boite = "";

    let qualité = localStorage.getItem('qualité');
    let langue = localStorage.getItem('langue');
    let hebergeur = localStorage.getItem('hebergeur');
    let codecvideo = localStorage.getItem('codecvideo');
    let codecaudio = localStorage.getItem('codecaudio');
    let taille = localStorage.getItem('taille');
    let team = localStorage.getItem('team');
    let nfo = localStorage.getItem('nfo');
    let dl = localStorage.getItem('dl');

    if(box=="1"){
      boite="";
    }if(box=="2"){
      boite="2"
    }if(box=="3"){
      boite="3"
    }

    const selectElement = document.querySelector('select[name="titledl' + boite + '"]');
    for (let a = 0; a < selectElement.options.length; a++) {
      if (selectElement.options[a].text === qualité) {
        selectElement.options[a].selected = true;
        break;
      }
    }

    document.querySelector('input[name="movie_download' + boite + '"]').value=dl;
    const selectElement1 = document.querySelector('select[name="hostlink' + boite + '"]');
    for (let b = 0; b < selectElement1.options.length; b++) {
      if (selectElement1.options[b].text === hebergeur) {
        selectElement1.options[b].selected = true;
        break;
      }
    }

    const selectElement2 = document.querySelector('select[name="linklang' + boite + '"]');
    for (let c = 0; c < selectElement2.options.length; c++) {
      if (selectElement2.options[c].text === langue) {
        selectElement2.options[c].selected = true;
        break;
      }
    }

    document.querySelector('input[name="release_team' + boite + '"]').value=team;

    const selectElement3 = document.querySelector('select[name="codec' + boite + '"]');
    for (let d = 0; d < selectElement3.options.length; d++) {
      if (selectElement3.options[d].text === codecvideo) {
        selectElement3.options[d].selected = true;
        break;
      }
    }

    const selectElement4 = document.querySelector('select[name="audiocodec' + boite + '"]');

    for (let e = 0; e < selectElement4.options.length; e++) {
      if (selectElement4.options[e].text === codecaudio) {
        selectElement4.options[e].selected = true;
        break;
      }
    }

    document.querySelector('input[name="poid' + boite + '"]').value=taille;

    const selectElement5 = document.querySelector('select[name="codec' + boite + '"]');
    for (let f = 0; f < selectElement5.options.length; f++) {
      if (selectElement5.options[f].text === codecvideo) {
        selectElement5.options[f].selected = true;
        break;
      }
    }
    document.querySelector('input[name="nfo' + boite + '"]').value=nfo;
  }

  if(document.location.href.includes('/admin/poster/')){
    creation();
    init_poster();
    voirtmdb()
    retour(document.getElementsByClassName('form-group')[2].children[4]);

    let _btn10 = document.getElementsByClassName('btn-copy-prez 1')[0];
    let _btn20 = document.getElementsByClassName('btn-copy-prez 2')[0];
    let _btn30 = document.getElementsByClassName('btn-copy-prez 3')[0];

    _btn10.addEventListener('click', function (e) {
      e.preventDefault();
      copy(1);
    });
    _btn20.addEventListener('click', function (e) {
      e.preventDefault();
      copy(2);
    });
    _btn30.addEventListener('click', function (e) {
      e.preventDefault();
      copy(3);
    });

  }

  if(document.location.href.includes('/admin/movie/')||document.location.href.includes('/admin/serie/')){
    document.querySelectorAll('.row')[1].insertAdjacentHTML('beforebegin',`<button onclick="Collé !" class="btn-paste-prez-un">Coller</button>`);
    document.querySelectorAll('.row')[2].insertAdjacentHTML('beforebegin',`<button onclick="Collé !" class="btn-paste-prez-deux">Coller</button>`);
    document.querySelectorAll('.row')[3].insertAdjacentHTML('beforebegin',`<button onclick="Collé !" class="btn-paste-prez-trois">Coller</button>`);
    let btn1 = document.getElementsByClassName('btn-paste-prez-un')[0];
    let btn2 = document.getElementsByClassName('btn-paste-prez-deux')[0];
    let btn3 = document.getElementsByClassName('btn-paste-prez-trois')[0];

    btn1.addEventListener('click', function (e) {
      e.preventDefault();
      paste(1);
    });
    btn2.addEventListener('click', function (e) {
      e.preventDefault();
      paste(2);
    });
    btn3.addEventListener('click', function (e) {
      e.preventDefault();
      paste(3);
    });
  }

  if(document.location.href.includes('/admin/collection/')||document.location.href.includes('/admin/movie/')||document.location.href.includes('/admin/serie/')){
     retour(document.getElementsByClassName('app-aside-right')[0]);
  }

  if(document.location.href.includes('/collection/')||document.location.href.includes('/movie/')||document.location.href.includes('/serie/')||document.location.href.includes('/show/')&&!document.location.href.includes('/admin')){
    accesadmin()
  }
});