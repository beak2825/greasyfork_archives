// ==UserScript==
// @name        Taringa V6
// @namespace   https://greasyfork.org/es/users/205385-xarkox
// @description Permite volver a Taringa V6
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @match       *://*.taringa.net/*
// @version     2.0.2
// @license     GPLv3
// @grant       none
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374643/Taringa%20V6.user.js
// @updateURL https://update.greasyfork.org/scripts/374643/Taringa%20V6.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var url_host = window.location.hostname;
var path = window.location.pathname;
var hash = window.location.hash;
var url_shouts = /^\/(global\/)?shouts$/;
var url_juegos = /^\/games$/;
var url_hashtag = /^\/search\/story/;
var url_perfil = /^\/[\w-]+$/;
var url_comunidad = /^\/[+][\w-]+$/;
var url_post_shout = /^\/[+]?[\w-]+\/[\w-]+$/;

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

function redirect(){
  if(path.match(url_shouts)){
    window.location.replace("https://classic.taringa.net/shouts");
  }
  else if(path.match(url_juegos)){
    window.location.replace("https://classic.taringa.net/juegos");
  }
  else if(path.match(url_hashtag)){
    window.location.replace("https://classic.taringa.net/hashtag/"+hash.replace("#",""));
  }
  else if(path.match(url_perfil)){
    window.location.replace("https://classic.taringa.net"+path);
  }  
  else if(path.match(url_comunidad)){
    var name=path.split("/").pop().replace("+","");
    
    $.get("https://beta.taringa.net/api/c/"+name+"/about", function(data){
      if(data.classic === undefined){
         window.location.replace("https://classic.taringa.net/posts/"+name);
      }
      else if(data.classic.type === "community"){
        $.get("https://api.taringa.net/community/view/"+data.classic.tid, function(data_classic){
          window.location.replace(data_classic.canonical);
        });
      }    
    }).fail(function(){
      window.location.replace("https://classic.taringa.net/");
    });
  }
  else if(path.match(url_post_shout)){
    var id=path.split("/").pop().split("_").pop();
    
    $.get("https://beta.taringa.net/api/story/"+id+"/summary", function(data){
      if(data.classic.type === "shout"){
        $.get("https://api.taringa.net/shout/view/hash/"+data.classic.tid, function(data_classic){
          window.location.replace(data_classic.canonical);
        });
      }
      else if(data.classic.type === "post"){
        $.get("https://api.taringa.net/post/view/"+data.classic.tid, function(data_classic){
          window.location.replace(data_classic.canonical);
        });
      }
      else if(data.classic.type === "topic"){
        $.get("https://api.taringa.net/topic/view/"+data.classic.tid, function(data_classic){
          window.location.replace(data_classic.canonical);
        });
      }
    }).fail(function(){
      window.location.replace("https://classic.taringa.net/");
    });
  }
  else{
    window.location.replace("https://classic.taringa.net/");
  }
}

function v6_links_fix(){
  $("a[href*='www.taringa.net']").attr("href", function(i, url){
    return url.replace("www.taringa.net", "classic.taringa.net");
  });
  
  $("form.nav-user__search.buscar").attr("action", "/search/");
  $("form[action='/buscar/mi/']").attr("action", "http://classic.taringa.net/buscar/mi/");
  $("form[action='/buscar/comunidades/']").attr("action", "http://classic.taringa.net/buscar/comunidades/");
}

function v6_gifs_posts(){

  $("div.main-content-post div.webm-js").each(function(i,obj) {
    var gif_url=$(obj).children("video[preload='none']").attr("poster");

    if(gif_url.includes(".gif")===true){
      gif_url=gif_url.split(".cover?",1);

      $(obj).after("<img class='imagen' src='"+gif_url+"' border='0'>");
      $(obj).remove();
    }
  });
}

function gifs_shouts(){

  $("div.shout-main-content > a > div.webm-js").each(function(i,obj) {
    var gif_url=$(obj).children("video[preload='none']").attr("poster");
      
    if(gif_url.includes(".gif")===true){
      gif_url=gif_url.split(".cover?",1);

      $(obj).after("<div class='shout-content--img'><img class='og-img' src='"+gif_url+"' border='0'></div>");
      $(obj).remove();     
    }
  });
}

function gifs_comentarios(){

  $("div.comment-content > div.webm-js").each(function(i,obj) {
    var gif_url=$(obj).children("video[preload='none']").attr("poster");

    if(gif_url.includes(".gif")===true){
      gif_url=gif_url.split(".cover?",1);

      $(obj).after("<img class='imagen' src='"+gif_url+"' border='0'>");
      $(obj).remove();
    }
  });
}

function v6_gifs_fix(){
  gifs_shouts();
  gifs_comentarios();

  onElementHeightChange(document.body, function(){setTimeout(v6_gifs_fix, 1000);});
}

function v6_cartel(){
  $("div#page > div.v6 > div[style='background: #FC6B00']").remove();
}

function taringa_v6(){
  if(url_host === "www.taringa.net"){
    redirect();
  }
  else if(url_host === "classic.taringa.net"){
    v6_cartel();
    v6_links_fix();
    v6_gifs_posts();
    v6_gifs_fix();
  }
}

function v6_dead(){
  window.location.replace("https://peluchan.ga");
}

$(function() {
  v6_dead();
});