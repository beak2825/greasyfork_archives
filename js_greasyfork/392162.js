// ==UserScript==
// @name        1Peluchinga - Dome Peluchon Dome
// @namespace   https://greasyfork.org/es/users/205385-xarkox
// @description Doma a usuarios molestos
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @match       *://*.1peluchinga.com/*
// @version     1.0.6
// @license     GPLv3
// @icon        http://rebrand.ly/dome
// @grant       none
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392162/1Peluchinga%20-%20Dome%20Peluchon%20Dome.user.js
// @updateURL https://update.greasyfork.org/scripts/392162/1Peluchinga%20-%20Dome%20Peluchon%20Dome.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
 
var url_perfil = /^\/user\/.+$/;
var url_home = /^\/(topten|momento|recientes)?$/;
var url_config = /^\/configuracion$/;
var path = window.location.pathname;
var domados = [];
var links = [];
var posts = [];

function onElementHeightChange(elm, callback){
	var lastHeight = elm.clientHeight, newHeight;
	(function run(){
		newHeight = elm.clientHeight;
		if( lastHeight != newHeight )
			callback();
		lastHeight = newHeight;

		if( elm.onElementHeightChangeTimer )
			clearTimeout(elm.onElementHeightChangeTimer);

		elm.onElementHeightChangeTimer = setTimeout(run, 200);
	})();
}

function cuevas(){
  $("div.container-top-cuevas > div.row > div.publication-item-content > div.well > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href').substr(6);
    user[i]=decodeURIComponent(user[i]);
    user[i]=user[i].toLowerCase();
    
    if(domados.includes(user[i])){
      $(obj).parent().parent().remove();
    }
  });
}

function pubs_comentarios(){
  $("div.container-contenido-publicacion > div.comentarios-publicacion > div.box-content > div.publication-item > div.publication-item-content > p > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href').substr(6);
    user[i]=decodeURIComponent(user[i]);
    user[i]=user[i].toLowerCase();
    
    if(domados.includes(user[i])){
      $(obj).parent().parent().parent().remove();
    }
  });
}

function pubs(){
  $("div#cuadro > div.publication-item-content > div.well > a.pub-name-nick, div.col-sm-5 > div.publication-item-content > div.well > a.pub-name-nick, div.col-xs-12 > div.price-block > div.publication-item-content > div.well > a.pub-name-nick, div.col-sm-12 > div.row > div.publication-item-content > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).first().attr('href').substr(6);
    user[i]=decodeURIComponent(user[i]);
    user[i]=user[i].toLowerCase();
    
    if(domados.includes(user[i])){
      $(obj).parent().parent().remove();
    }
  });
}

function viral(){
  $("div.container-momento > div.row > div.col-sm-4 > div.col-xs-12 > div > div.publication-item-content > div.well > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href').substr(6);
    user[i]=decodeURIComponent(user[i]);
    user[i]=user[i].toLowerCase();

    if(domados.includes(user[i])){
      $(obj).parent().parent().remove();
    }
  });
}

function destacado(){
  $("div.box-post > div.media > a.pull-left").each(function(i,obj) {
    p=$(obj).attr('href');

    for(var j=0; j < posts.length; j++){ 
      if(p == posts[j]){
        $(obj).parent().parent().remove();
      }
    }
  });
}

function ascenso(){
  $("div.container-fluid > div.row > div.contenedor-explored > section#pinBoot > article.white-panel > a > img.imagen-explored").each(function(i,obj) {
    p=$(obj).parent().attr('href');

    for(var j=0; j < posts.length; j++){ 
      if(p == posts[j]){
        $(obj).parent().parent().remove();
      }
    }
  });
}

function reciente(){
  $("div.container-recientes > div.row > div.col-sm-8 > div.box-post > div.media > a.pull-left").each(function(i,obj) {
    p=$(obj).attr('href');
    
    for(var j=0; j < posts.length; j++){ 
      if(p == posts[j]){
        $(obj).parent().parent().remove();
      }
    }
  });
  
  $("div.container-recientes > div.row > div.col-sm-2 > div.publi-fondo > div.media > div.col-sm-12 > div.row > div.publication-item-content > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href').substr(6);
    user[i]=decodeURIComponent(user[i]);
    user[i]=user[i].toLowerCase();

    if(domados.includes(user[i])){
      $(obj).parent().parent().remove();
    }
  });
}

function respuestas(){
  $("div.comentarios-container > div.box-content > div.publication-item > div.publication-item-content > p > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href').substr(6);
    user[i]=decodeURIComponent(user[i]);
    user[i]=user[i].toLowerCase();
    
    if(domados.includes(user[i])){
      $(obj).parent().parent().parent().remove();
    }   
  });
}

function comentarios(){
  $("div.box-content > div.publication-item > div.comentarioPost > div.publication-item-cntent > p > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href').substr(6);
    user[i]=decodeURIComponent(user[i]);
    user[i]=user[i].toLowerCase();

    if(domados.includes(user[i])){
      $(obj).parent().parent().parent().parent().remove();
    }
  });
}

function get_posts(link){
  $.ajax({async: true,url: link}).done(function(result){
    $(result).find("div.box-post > div.media > a.pull-left").each(function(j,obj) {
      posts.push($(obj).attr("href"));
    });
  });
}

function posts_domados(){
  if(path.match(url_home)){
    for(var i=0; i < domados.length; i++){
      link_posts="/post/"+encodeURIComponent(domados[i]);
      get_posts(link_posts);
    }
    
    if($.active > 0){
      $(document).ajaxStop(function(){
        localStorage.setItem("cache_posts", JSON.stringify(posts));
      });
      
      $(document).ajaxError(function(){
        carga_posts();
      });
    }
    else{
      localStorage.setItem("cache_posts", JSON.stringify(posts));
    }
  }
  else{
    carga_posts();
  }
}

function clean_cache(){
  domados.length = 0;
  localStorage.removeItem("domados_cache");
  posts.length = 0;
  localStorage.removeItem("cache_posts");  
}

function guarda_domados(){
  domados = [...new Set(domados)];
  localStorage.setItem("domados_cache", JSON.stringify(domados));
  carga_domados();
}

function carga_domados(){
  if(localStorage.getItem("domados_cache") !== null){
    domados = JSON.parse(localStorage.getItem("domados_cache"));
  }
  else{
    clean_cache();
  }
}

function carga_posts(){
  if(localStorage.getItem("cache_posts") !== null){
    posts = JSON.parse(localStorage.getItem("cache_posts"));
  }
}

function carga_lista(){
  var lista = [];
  
  for(var i=0; i < domados.length; i++){
    lista += domados[i]+"\n";
  }
  $("textarea#lista_domados").val(lista);
}

function config(){
  if(path.match(url_config)){
    var txtlist;
    var avatar=$("ul.navbar-right > li.dropdown > a.dropdown-toggle").text();
    avatar = avatar.trim();
    
    $("div.box-form").append("<br/><h2>Usuarios Domados</h2><textarea id='lista_domados' name=domados rows='10' cols='25'style='margin-bottom: 10px'></textarea><br/><button id='domalos' class='btn btn-success' style='background-color:red !important'>Domalos</button>");
    
    carga_lista();
    
    $("button#domalos").click(function(){
      txtlist = $("textarea#lista_domados").val();
      txtlist = txtlist.toLowerCase();
      domados = txtlist.split('\n');
      domados = domados.filter(Boolean);

      if(domados.length > 0){
        guarda_domados();
      }
      else{
        clean_cache();
      }
      
      alert("Dome "+avatar+" dome");
      carga_lista();
    });
  }
}

function perfil(){
  if(path.match(url_perfil)){
    var user = $("div.profile-box > div.name-surname > span.nickname").text();
    user = user.trim();
    user = user.toLowerCase();

    if(domados.includes(user)){
      $("div.buttons-following").append("<button id='desdomar' class='btn btn-success' style='background-color:red !important;margin-left:5px !important'>Desdomar</button>");
      $("button#desdomar").click(function(){
        carga_domados();
        if(domados.indexOf(user) !== -1){
          domados.splice(domados.indexOf(user),1);
        }
        guarda_domados();
        alert("Así no te lo vas a coger");
        $("button#desdomar").remove();
        perfil();
      });
    }
    else{
      $("div.buttons-following").append("<button id='domar' class='btn btn-success' style='background-color:red !important;margin-left:5px !important'>Domar</button>");
      $("button#domar").click(function(){
        carga_domados();
        domados.push(user);
        guarda_domados();
        alert("Domado, humillado e infinitamente ultrajado");
        $("button#domar").remove();
        perfil();
      });
    }
  }
}

function intervalo(){
  var t_actual = Date.now();
  var t_anterior;
  var periodo;
  
  if(localStorage.getItem("cache_timespan") === null){
    t_anterior=0;
    localStorage.setItem("cache_timespan", JSON.stringify(t_actual));
  }
  else{
    t_anterior = JSON.parse(localStorage.getItem("cache_timespan"));
  }
  
  periodo=t_actual-t_anterior;

  if(periodo > 60000){    
    localStorage.setItem("cache_timespan", JSON.stringify(t_actual));
    return true;
  }
  else{
    return false;
  }
}

function home(){
  if(path.match(url_home)){
    destacado();
    ascenso();
    reciente();
    viral();
  }
  
  comentarios();
  respuestas();
  cuevas();
}

function mip(){
  pubs();
  pubs_comentarios();
}

function main(){
  if($.active > 0){
    $(document).ajaxStop(function(){
      home();
      mip();
    });  
  }
  else{
    home();
    mip();
  }

  onElementHeightChange(document.body, function(){setTimeout(main, 2000);});
}

$(function() {
  carga_domados();
  config();
  perfil();
  if(intervalo()==true){
    posts_domados();
  }
  else{
    carga_posts();
  }
  main();
});