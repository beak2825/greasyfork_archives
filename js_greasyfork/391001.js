// ==UserScript==
// @name        1Peluchinga - Virgoneitor Domado
// @namespace   https://greasyfork.org/es/users/205385-xarkox
// @description Elimina el spam del virgoneitor
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @match       *://*.1peluchinga.com/*
// @version     3.2.4
// @license     GPLv3
// @icon        http://rebrand.ly/virgoneitor
// @grant       none
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/391001/1Peluchinga%20-%20Virgoneitor%20Domado.user.js
// @updateURL https://update.greasyfork.org/scripts/391001/1Peluchinga%20-%20Virgoneitor%20Domado.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var virgo_perfil = /^\/user\/[\w\s-]*([V|v][-|_]*[I|i|1|l][-|_]*[R|r][-|_]*[G|g][-|_]*[O|o|0]?[\w-]*[N|n][-|_]*[E|e|3][-|_]*[I|i|1][-|_]*[T|t][-|_]*[O|o|0][-|_]*[R|r])|([N|n][-|_]*[E|e|3][-|_]*[I|i|1][-|_]*[T|t][-|_]*[O|o|0][-|_]*[R|r][\w-]*[V|v][-|_]*[I|i|1|l][-|_]*[R|r][-|_]*[G|g][-|_]*[O|o|0]?)[\w\s-]*/;
var url_home = /^\/(topten|momento|recientes)?$/;
var path = window.location.pathname;
var nombre_perfil = [];
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
    user[i]=$(obj).attr('href');
    
    for(var j=0; j < nombre_perfil.length; j++){ 
      if(user[i].match(nombre_perfil[j])){
        $(obj).parent().parent().remove();
      }
    }
    
    if(user[i].match(virgo_perfil)){
      $(obj).parent().parent().remove();
    }
  });
}

function pubs_comentarios(){
  $("div.container-contenido-publicacion > div.comentarios-publicacion > div.box-content > div.publication-item > div.publication-item-content > p > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href');
    
    for(var j=0; j < nombre_perfil.length; j++){ 
      if(user[i].match(nombre_perfil[j])){
        $(obj).parent().parent().parent().remove();
      }
    }
    
    if(user[i].match(virgo_perfil)){
      $(obj).parent().parent().parent().remove();
    }
  });
}

function pubs(){
  $("div#cuadro > div.publication-item-content > div.well > a.pub-name-nick, div.col-sm-5 > div.publication-item-content > div.well > a.pub-name-nick, div.col-xs-12 > div.price-block > div.publication-item-content > div.well > a.pub-name-nick, div.col-sm-12 > div.row > div.publication-item-content > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).first().attr('href');
    
    for(var j=0; j < nombre_perfil.length; j++){ 
      if(user[i].match(nombre_perfil[j])){
        $(obj).parent().parent().remove();
      }
    }
    
    if(user[i].match(virgo_perfil)){
      $(obj).parent().parent().remove();
    }
  });
}

function viral(){
  $("div.container-momento > div.row > div.col-sm-4 > div.col-xs-12 > div > div.publication-item-content > div.well > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href');
    
    for(var j=0; j < nombre_perfil.length; j++){ 
      if(user[i].match(nombre_perfil[j])){
        $(obj).parent().parent().remove();
      }
    }
    
    if(user[i].match(virgo_perfil)){
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
    user[i]=$(obj).attr('href');
    
    for(var j=0; j < nombre_perfil.length; j++){     
      if(user[i].match(nombre_perfil[j])){
        $(obj).parent().parent().remove();
      }
    }
    
    if(user[i].match(virgo_perfil)){
      $(obj).parent().parent().remove();
    }
  });
}

function respuestas(){
  $("div.comentarios-container > div.box-content > div.publication-item > div.publication-item-content > p > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href');
    
    for(var j=0; j < nombre_perfil.length; j++){     
      if(user[i].match(nombre_perfil[j])){
        $(obj).parent().parent().parent().remove();
      }
    }
    
    if(user[i].match(virgo_perfil)){
      $(obj).parent().parent().parent().remove();
    }
  });
}

function comentarios(){
  $("div.box-content > div.publication-item > div.comentarioPost > div.publication-item-cntent > p > a.pub-name-nick").each(function(i,obj) {
    var user = [];
    user[i]=$(obj).attr('href');

    for(var j=0; j < nombre_perfil.length; j++){     
      if(user[i].match(nombre_perfil[j])){
        $(obj).parent().parent().parent().parent().remove();
      }
    }
    
    if(user[i].match(virgo_perfil)){
      $(obj).parent().parent().parent().parent().remove();
    }
  });
}

function get_clones(){
  var link="https://api.codetabs.com/v1/proxy?quest=https://rebrand.ly/virgoclones";
  var dump;
  var clones = [];
  var link_posts;
   
  $.ajax({async: true,type: 'GET',url: link}).done(function(result){
    dump=result;
    clones=dump.split(/\r\n|\r|\n/);

    for(var i=0; i < clones.length; i++){
      nombre_perfil.push("/user/"+clones[i]);
      link_posts="https://1peluchinga.com/post/"+clones[i];
      get_posts(link_posts);
    }
  });
}

function get_posts(link){
  if(path.match(url_home)){
    $.ajax({async: true,url: link}).done(function(result){
      $(result).find("div.box-post > div.media > a.pull-left").each(function(j,obj) {
        posts.push($(obj).attr("href"));
      });
    });
  }
}

function get_perfil(link){
  var link_posts;
  var nick;
  
  $.ajax({async: true,url: link}).done(function(result){
    nick=$(result).find("div.box-default > div.container-contenido-publicacion > div.publication-item-content-publicacion > p > a.pub-name-nick").attr("href");
    
    if(typeof nick !== "undefined"){
      nombre_perfil.push(nick);
      link_posts="https://1peluchinga.com/post/"+nick.substr(6);
      get_posts(link_posts);
    }
  });
}

function perfil_actual(){
  var links=["https://1peluchinga.com/publicacion/comentario/46090","https://1peluchinga.com/publicacion/comentario/41989","https://1peluchinga.com/publicacion/comentario/46481","https://1peluchinga.com/publicacion/comentario/41964","https://1peluchinga.com/publicacion/comentario/46832","https://1peluchinga.com/publicacion/comentario/47404","https://1peluchinga.com/publicacion/comentario/48124"];

  if(path.match(url_home)==null){
    cache_posts();
  }
  
  for(var i=0; i < links.length; i++){ 
    get_perfil(links[i]);
  }
  
  get_clones();

  if($.active > 0){
    $(document).ajaxStop(function(){
      if(nombre_perfil.length > 0){
        localStorage.setItem("cache_perfil", JSON.stringify(nombre_perfil));
        if(posts.length > 0){
          localStorage.setItem("cache_postsvirgo", JSON.stringify(posts));
        }
      }
      else{
        clean_cache();
      }      
    });  
    
    $(document).ajaxError(function(){
      get_cache();
    });
  }
  else{
    if(nombre_perfil.length > 0){
      localStorage.setItem("cache_perfil", JSON.stringify(nombre_perfil));
      if(posts.length > 0){
        localStorage.setItem("cache_postsvirgo", JSON.stringify(posts));
      }
    }
    else{
      clean_cache();
    }
  }
}

function clean_cache(){
  nombre_perfil.length = 0;
  localStorage.removeItem("cache_perfil");
  posts.length = 0;
  localStorage.removeItem("cache_postsvirgo");  
}

function cache_posts(){
  if(localStorage.getItem("cache_postsvirgo") !== null){
    posts = JSON.parse(localStorage.getItem("cache_postsvirgo"));
  } 
}

function get_cache(){
  if(localStorage.getItem("cache_perfil") !== null){
    nombre_perfil = JSON.parse(localStorage.getItem("cache_perfil"));
  
    cache_posts();
  }
}

function intervalo(){
  var t_actual = Date.now();
  var t_anterior;
  var periodo;
  
  if(localStorage.getItem("cache_time") === null){
    t_anterior=0;
    localStorage.setItem("cache_time", JSON.stringify(t_actual));
  }
  else{
    t_anterior = JSON.parse(localStorage.getItem("cache_time"));
  }
  
  periodo=t_actual-t_anterior;

  if(periodo > 60000){  
    localStorage.setItem("cache_time", JSON.stringify(t_actual));
    return true;
  }
  else{
    return false;
  }
}

function home(){
  comentarios();
  respuestas();
  viral();
  destacado();
  ascenso();
  reciente();
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

$(function(){
  if(intervalo()==true){
    perfil_actual();
  }
  else{
    get_cache();
  }
  main();
});