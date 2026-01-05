// ==UserScript==
// @name        Dragorson
// @namespace   drag0r.lantrededragor
// @description Petit dragon dans le coin
// @version     3.1
// @grant       none
// @include     http://*
// @downloadURL https://update.greasyfork.org/scripts/26851/Dragorson.user.js
// @updateURL https://update.greasyfork.org/scripts/26851/Dragorson.meta.js
// ==/UserScript==

if (top.location == self.document.location) {
  window.onload = function () {
    var pause = false;
    var bloqueCacheDragorson = false;
    document.body.insertAdjacentHTML('beforeend', '<img src=http://lantrededragor.online.fr/dragorson/respiration/1.svg style="position:fixed; bottom:0; right:0; z-index: 999999999999999999; max-width: 200px; border:0;transition: all .4s;" id="dragorson" />');
    //http://lantrededragor.online.fr/image_forum/Pixel_larp_dragor.png
    anime_respiration();
    document.querySelector("#dragorson").addEventListener('mouseover',function(){
      if (!bloqueCacheDragorson) {
         document.querySelector("#dragorson").style.display = 'none';                                                   
         setTimeout(function(){
           document.querySelector("#dragorson").style.display = 'block'; 
         }, 5000);//fin settimeout                                  
      }
    },false);

    var tabtouche = [];
    var kodeskeysHide = "72,73,68,69";
    var kodeskeysShow = "83,72,79,87";
    var kodeskeysFeu = "70,69,85";
    var kodeskeysPauline = "80,65,85,76,73,78,69";
    var kodeskeysDodo = "84,82"; //tr
    var kodeskeysKlingon = "75,76,73,78,71,79,78";
    var kodeskeysDrAg0r = "68,82,16,65,71,96,82";
    var kodeskeysDraghor = "68,82,65,52,71,72,79,16,72";
    var kodeskeysDragor = "68,82,65,71,79,82";
    var kodeskeysDr0r = "68,82,96,82";
    var kodeskeysDragon = "68,82,65,71,79,78";
    var kodeskeysPyromane = "80,89,82,79,77,65,78,69";
    var kodeskeysGoldrag = "71,79,76,68,82,65,71";

    window.addEventListener("keydown", function(e){
      tabtouche.push( e.keyCode );
      if (tabtouche.length > 10) {
        tabtouche.shift();
      }
      if ( tabtouche.toString().indexOf( kodeskeysHide ) >= 0 )
      {
        document.querySelector("#dragorson").style.display = 'none';
        bloqueCacheDragorson = true;
        tabtouche = new Array();
      }
      if ( tabtouche.toString().indexOf( kodeskeysShow ) >= 0 )
      {
        document.querySelector("#dragorson").style.display = 'block';
        bloqueCacheDragorson = false;
        tabtouche = new Array();
      }
      if ( (tabtouche.toString().indexOf( kodeskeysFeu ) >= 0) || (tabtouche.toString().indexOf( kodeskeysPyromane ) >= 0) )
      {
        tabtouche = new Array();
        anime_feu();
      }
      if ( tabtouche.toString().indexOf( kodeskeysPauline ) >= 0 )
      {
        tabtouche = new Array();
        anime_coeur();
      }
      if ( tabtouche.toString().indexOf( kodeskeysDodo ) >= 0 )
      {
        tabtouche = new Array();
        anime_dodo();
      }
      if ( tabtouche.toString().indexOf( kodeskeysKlingon ) >= 0 )
      {
        tabtouche = new Array();
        anime_klingon();
      }
      if ( (tabtouche.toString().indexOf( kodeskeysDrAg0r ) >= 0) || (tabtouche.toString().indexOf( kodeskeysDraghor ) >= 0) || (tabtouche.toString().indexOf( kodeskeysDragor ) >= 0) || (tabtouche.toString().indexOf( kodeskeysDr0r ) >= 0) || (tabtouche.toString().indexOf( kodeskeysDragon ) >= 0) || (tabtouche.toString().indexOf( kodeskeysGoldrag ) >= 0) ) 
      {
        tabtouche = new Array();
        anime_DrAg0r();
      }
    }, true);


    function anime_respiration() {
      document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/1.svg';
      setTimeout(function() {
        document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/2.svg';
      }, 500); //fin setTimeout
      setTimeout(function() {
        document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/3.svg';
      }, 1000); //fin setTimeout
      setTimeout(function() {
        document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/2.svg';
      }, 1500); //fin setTimeout
      setInterval(function() {
        if(!pause) {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/1.svg';
          setTimeout(function() {
            if(!pause) {
              document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/2.svg';
            }
          }, 500); //fin setTimeout
          setTimeout(function() {
            if(!pause) {
              document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/3.svg';
            }
          }, 1000); //fin setTimeout
          setTimeout(function() {
            if(!pause) {
              document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/2.svg';
            }
          }, 1500); //fin setTimeout
        }
      }, 2000); //fin setInterval
    }

    function anime_feu() {
      if (!pause) {
        pause = true;
        var delai = 500;
        var intervalle = 200;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/1.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/2.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/4.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/5.svg';
        }, delai); //fin setTimeout
        intervalle = 300;
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/6.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/7.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/8.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/7.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/8.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/7.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/8.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/6.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/5.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/4.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/9.svg';
        }, delai); //fin setTimeout
        intervalle = 200;
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/10.svg';
          pause = false;
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/feu/1.svg';
        }, delai); //fin setTimeout
      } //fin if !pause
    }

    function anime_coeur() {
      if (!pause) {
        pause = true;
        var delai = 500;
        var intervalle = 200;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/1.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/4.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/6.svg';
        }, delai); //fin setTimeout
        intervalle = 500;
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/7.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/6.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/7.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/6.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/7.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/6.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/7.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/6.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/7.svg';
        }, delai); //fin setTimeout
        intervalle = 200;
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/8.svg';
          pause = false;
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/1.svg';
        }, delai); //fin setTimeout
      } //fin if !pause
    }


    function anime_dodo() {
      if (!pause) {
        pause = true;
        var delai = 500;
        var intervalle = 200;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/1.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
        }, delai); //fin setTimeout
        intervalle = 1000;
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/3.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
          pause = false; /* sur l'avant dernière image */
        }, delai); //fin setTimeout
        intervalle = 200;
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/4.svg';
          pause = false; /* sur l'avant dernière image */
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/respiration/1.svg';
        }, delai); //fin setTimeout
      } //fin if !pause
    }

    function anime_klingon() {
      if (!pause) {
        pause = true;
        var delai = 500;
        var intervalle = 200;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/klingon/1.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/klingon/2.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/klingon/3.svg';
        }, delai); //fin setTimeout
        intervalle = 3000;
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/klingon/4.svg';
        }, delai); //fin setTimeout
        intervalle = 200;
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/klingon/5.svg';
          pause = false; /* sur l'avant dernière image */
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/klingon/1.svg';
        }, delai); //fin setTimeout
      } //fin if !pause
    }

    function anime_DrAg0r() {
      var delai = 300;
      if(document.querySelector("#tactical_nuclear_medfan_warlord")) {
        document.querySelector("#tactical_nuclear_medfan_warlord").remove();
      }
      document.body.insertAdjacentHTML('beforeend', '<img src=http://lantrededragor.online.fr/image_forum/Pixel_larp_dragor.png style="position:fixed; top:0; right:0; z-index: 999999999999999999; border:0;transition: all .7s;" id="tactical_nuclear_medfan_warlord" />');
      setTimeout(function() {
        document.querySelector("#tactical_nuclear_medfan_warlord").style.right = '150px';
        document.querySelector("#tactical_nuclear_medfan_warlord").style.top = (window.innerHeight-57)+'px';
      }, delai); //fin setTimeout
    }

    function anime_exemple() {
      if (!pause) {
        pause = true;
        var delai = 500;
        var intervalle = 200;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/1.svg';
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/coeur/8.svg';
          pause = false; /* sur l'avant dernière image */
        }, delai); //fin setTimeout
        delai += intervalle;
        setTimeout(function() {
          document.querySelector("#dragorson").src='http://lantrededragor.online.fr/dragorson/dodo/2.svg';
        }, delai); //fin setTimeout
      } //fin if !pause
    }
	};
}