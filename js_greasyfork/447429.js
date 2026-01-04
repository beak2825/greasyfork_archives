// ==UserScript==
// @name         Extreme Prez Tmdb
// @namespace    http://extreme-prez.net
// @version      0.7
// @description  Faites vos prez Extreme avec l'api Tmdb
// @author       Invincible812
// @match        http://extreme-prez.net:8080/*
// @icon         http://extreme-prez.net:8080/favicon.ico
// @grant        none
// @license      none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/447429/Extreme%20Prez%20Tmdb.user.js
// @updateURL https://update.greasyfork.org/scripts/447429/Extreme%20Prez%20Tmdb.meta.js
// ==/UserScript==

// ==Version==
// 0.5 -> Début de la version béta du script.
// 0.7 -> Correction de bugs & amélioration.
// ==/Version==



window.addEventListener('load', function() {
  if(document.location.pathname=="/"){
    document.getElementsByClassName('btn')[0].insertAdjacentHTML('afterend',`<a class="btn btn-large btn-success" href="/sheet/films/custom">Prez Films/Documentaires Tmdb</a>`)
    
    
  }
  if(document.location.pathname=="/sheet/films/custom"){
    document.getElementsByClassName('alert alert-info text-center')[0].insertAdjacentHTML('afterend',`<div class="text-center">Veuillez remplir avec l'id du film, pour créer la prez avec l'API de TmDB.<input type="text" name="tmdbid" id="tmdb_id" placeholder="Ex: 299536" style="width: 350px;" class="input"><input type="button" id="addidtoscript" value="Créer ma prez !"></div>`);
    let key = 'METTRE ICI VOTRE CLE API TMDB';
    function getapitmdb(id){
      $.ajax({
        type: "GET",
        url: 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + key + '&language=fr-FR&append_to_response=casts',
        data: "check",
        error: function (xhr, ajaxOptions, thrownError) {
          alert("Erreur, l'id n'existe pas. Merci de vérifier puis réssayer avec un bon id.")
        },
        success: function(data){
          document.body.getElementsByTagName("span")[1].childNodes[0].textContent ='';
          document.body.getElementsByTagName("span")[2].childNodes[0].textContent ='';
          document.body.getElementsByTagName("span")[3].childNodes[0].textContent ='';
          document.body.getElementsByTagName("span")[4].childNodes[0].textContent ='';
          document.body.getElementsByTagName("span")[5].childNodes[0].textContent ='';
          document.body.getElementsByTagName("span")[6].childNodes[0].textContent ='';
          document.body.getElementsByTagName("span")[7].childNodes[0].textContent ='';
          let realisateurs='';
          let acteurs='';
          let genres='';
          let pays='';
          if(data.overview===undefined){console.log("Pas de Synopsis pour l'id associé")}else{
          document.body.getElementsByTagName("blockquote")[0].childNodes[0].textContent = data.overview; // Synopsis
          }
          if(document.getElementsByTagName('small')[0]===undefined){
            document.body.getElementsByTagName("blockquote")[0].insertAdjacentHTML('beforeend','<small style="display: block;line-height: 1.428571429;color: #999999;">— Tmdb <a href="https://www.themoviedb.org/movie/${id}" title="Voir la source">voir la source</a></small>');
          }else{
            document.getElementsByTagName('small')[0].children[0].href='https://www.themoviedb.org/movie/' + id;
          }
          
          /*RÉALISATION*/
          
          if(data.casts.crew===undefined){console.log("Pas de Réalisateurs pour l'id associé")}else{
            for (var i = 0; i < data.casts.crew.length; i++) {
              if (data.casts.crew[i].job=='Director'){
                realisateurs=realisateurs+data.casts.crew[i].name + ',';
              }
            }  
            realisateurs=realisateurs.slice(0,-1);
            document.body.getElementsByTagName("span")[2].childNodes[0].textContent = realisateurs;
          }
          
          
          /*ACTEURS*/
          if(data.casts.cast===undefined){console.log("Pas d'Acteurs pour l'id associé")}else{
            for (var i = 0; i < 4; i++) {
              if (data.casts.cast[i].known_for_department=='Acting'){
                acteurs = acteurs + data.casts.cast[i].name + ',';
              }
            }
            acteurs=acteurs.slice(0,-1);
            document.body.getElementsByTagName("span")[3].childNodes[0].textContent = acteurs;
          }
          
          
          
          /*PAYS*/
          if(data.production_countries===undefined){console.log("Pas de Pays pour l'id associé")}else{
            if (data.production_countries.length>1){
              for (var i = 0; i < 2; i++) {
                pays = pays + data.production_countries[i].name + ',';
                console.log(data.production_countries)
              }
            }else{
             pays=data.production_countries[0].name;
            }
            document.body.getElementsByTagName("span")[6].childNodes[0].textContent = pays;
          }
          
          
          
          /*GENRES*/
          if(data.genres===undefined){null}else{
          if (data.genres.length>1){
            for (var i = 0; i < data.genres.length; i++) {
              genres=genres+data.genres[i].name + ',';
            }
            genres=genres.slice(0,-1);
            document.body.getElementsByTagName("span")[4].childNodes[0].textContent = genres;
          }
          }
          
          /*PRODUCTION*/
          if(data.production_companies===undefined){console.log("Pas de Production pour l'id associé")}else{
            if (data.production_companies.length>1){
              document.body.getElementsByTagName("span")[1].childNodes[0].textContent = data.release_date.substr(0,4) + ' par ' + data.production_companies[0].name; // Genre;
            }else{
             document.body.getElementsByTagName("span")[1].childNodes[0].textContent = data.release_date.substr(0,4) + ' par ' + data.production_companies[0].name; // Genre
          }
          }
          
          // DUREE
          if(data.runtime===undefined){console.log('Pas de durée pour cette id')}else{
            let duree=data.runtime;
            document.body.getElementsByTagName("span")[5].childNodes[0].textContent = duree + ' minutes'
          }
                    
          
          // DATE SORTIE
          if(data.release_date===undefined){console.log("Pas de date de sortie pour l'id associé")}else{
            var annee = data.release_date.substr(0,4);
            var mois = data.release_date.substr(5,2) ;
            var jour = data.release_date.substr(8,4) ;
            document.body.getElementsByTagName("span")[7].childNodes[0].textContent = jour + '/' + mois + '/' + annee; // Date de sortie
          }
            
            
            
          if(data.name===undefined){
            document.getElementsByTagName('h1')[0].textContent = data.original_title; // Titre (original)
          }else{
            if(data.original_titre===undefined){null}else{
            document.getElementsByTagName('h1')[0].textContent = data.name; // Titre (Français)
          }
        }}
      }); 
    };
    
    
    document.getElementById("addidtoscript").onclick = function() {
      var id = document.getElementById("tmdb_id").value
      getapitmdb(id)};
  };                    
});