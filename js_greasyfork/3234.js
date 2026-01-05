// ==UserScript==
// @name        AutoCerclePin
// @namespace   InGame
// @include     http://www.dreadcast.net/Forum/*-cercle-*
// @include     https://www.dreadcast.eu/Forum/*-cercle-*
// @version     1.011
// @grant       none
// @description Permet d'épingler deux sujets spécifiquement nommés dans les cercles
// @downloadURL https://update.greasyfork.org/scripts/3234/AutoCerclePin.user.js
// @updateURL https://update.greasyfork.org/scripts/3234/AutoCerclePin.meta.js
// ==/UserScript==
(function () {
  $("#header_forum p:first").text("Amélioré par SIF.");
  var auth = localStorage.getItem("SIF_Circle'Pin");
  if (auth != null && auth == 'on')
  {
    var list = document.getElementById('liste_sujets');
    var log = null,
    readFirst = null;
    for (var i = 0; i < list.children.length; ++i) {
      var name = $(list.children[i]).find('.nom_sujet').text();
      if (name === '***[MLOG] Actualités')
      log = list.children[i];
       else if (name === '***[A LIRE EN PREMIER]')
      readFirst = list.children[i];
       else if (name === '***[Index]')
      index = list.children[i];
    }
    if (log != null || readFirst != null || index != null)
    {
      if (index != null)
      {
        $(index).css('background-color', '#D3CEB1');
        list.removeChild(index);
        list.insertBefore(index, list.children[0]);
      }
      if (log != null)
      {
        $(log).css('background-color', '#D3CEB1');
        list.removeChild(log);
        list.insertBefore(log, list.children[0]);
      }
      if (readFirst != null)
      {
        $(readFirst).css('background-color', '#D3CEB1');
        list.removeChild(readFirst);
        list.insertBefore(readFirst, list.children[0]);
      }
    }
  }
  else
    {
         var invalid = document.createElement('div');
        invalid.id = "invalid";
        document.body.appendChild(invalid);
        $('#invalid').css('positions','absolute').css('width','80%').css('height','800px').css('left','10%').css('top','100px').css('background-color','transparent').css('z-index','-999999999');   

        var invalidbloc = document.createElement('div');
        invalidbloc.id = "invalidbloc";
        invalid.appendChild(invalidbloc);
        $('#invalidbloc').css('padding-top','10%').css('color','#C03000').css('text-align','center').css('font-size','30px');  
        $('#invalidbloc').html("<b>Ceci n'est pas une copie autorisée.</b>");

        var tetedemort = document.createElement('img');
        tetedemort.id = "tetedemort";
        invalid.appendChild(tetedemort);
        tetedemort.src = "http://nsa33.casimages.com/img/2013/10/23/131023015240409310.png";
        $('#tetedemort').css('width','16%').css('padding-top','30px').css('padding-left','42%');

        var supprMess = document.createElement('div');
        supprMess.id = "supprMess";
        invalid.appendChild(supprMess);
        $('#supprMess').css('padding-top','30px').css('color','#FFF').css('text-align','center').css('font-size','20px');  
        $('#supprMess').text("Suppression définitive de vos accès à ce cercle.");

        var loader = document.createElement('img');
        loader.id = "loader";
        invalid.appendChild(loader);
        loader.src = "https://www.jamaicavacation.com/wp-content/plugins/getaquote/images/animated_progress_bar.gif";
        $('#loader').css('width','30%').css('padding-top','20px').css('padding-left','35%');

        var thanx = document.createElement('div');
        thanx.id = "thanx";
        invalid.appendChild(thanx);
        $('#thanx').css('padding-top','40px').css('color','#AF5D00').css('text-align','center').css('font-size','30px');  
        $('#thanx').html("Cordialement, <br/>SIF.");
        $('#invalid').css('background-color','#000000').css('z-index','999999999');
    }
}) ();
