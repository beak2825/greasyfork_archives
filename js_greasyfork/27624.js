// ==UserScript==
// @name        Ignore list
// @namespace   www.vault.cz
// @description nastavitelné skrývání příspěvků zvolených uživatelů na stoky.urza.cz
// @include     http://stoky.urza.cz/*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27624/Ignore%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/27624/Ignore%20list.meta.js
// ==/UserScript==


$(document).ready(function(){
  var names = [];
  if (localStorage.getItem("names") == null){
    localStorage.setItem("names", JSON.stringify(names));
  }
  else {
    names = JSON.parse(localStorage.getItem("names"));
  }
  
  $("#header").append("<button type='button' id='ignore' style='position: fixed; top: 10px; right: 15px; height: 25px; background: #ECECEC;'>Ignore list</button><div id='ignorelist' style='position: fixed; top: 40px; right: 15px; width: 200px; height: auto; padding: 5px 5px 15px 5px; background: #ECECEC; display: none;'><ul id='list' style='list-style-type: none; text-align: left; padding-left: 15px;'></ul><button type='button' id='add'>Přidat uživatele</button><input type='text' id='name' style='width: 75%; height: 20px; float: left; margin-top: 8px; display: none;'></input><button type='button' id='ok' style='width: 20%; height: 25px; float: right; margin-top: 8px; display: none;'>OK</button></div>");
  var list = $("#list");
  
  function fillList(){
    list.empty();
    for (var x = 0; x < names.length; x++){
      list.append("<li><span>" + names[x] + "</span>&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' class='remove' style='color: red; text-decoration: none; font-weight: bold;'>X</a></li>");
    }
  }
  
  function applyFilter(remName){
    $("span.commentHeaderItem").each(function(){
      for (var i = 0; i < names.length; i++){
        if($(this).text() == "Autor: "+names[i]){
          $(this).addClass("red");
          $(this).addClass("ignored");
          $(this).parents(".commentHeader").next(".commentBody").hide();
        }
      }
      if($(this).text() == "Autor: "+remName){
        $(this).removeAttr("style");
        $(this).removeClass("red");
        $(this).removeClass("yellow");
        $(this).removeClass("ignored");
        $(this).parents(".commentHeader").next(".commentBody").show();
      }
    });
    $(".red").css({"color":"red","cursor":"pointer"});
    $(".yellow").css({"color":"yellow","cursor":"pointer"});
  }
  
  fillList();
  applyFilter("");
  
  $("#ignore").click(function(){
    $("#ignorelist").slideToggle();
  });
  
  $("#add").click(function(){
    $("#name").toggle();
    $("#ok").toggle();
  });
  
  $("#ok").click(function(){
    if ($("#name").val() != ""){
      names.push($("#name").val());
      $("#name").val("");
      fillList();
      applyFilter("");
      localStorage.setItem("names", JSON.stringify(names));
    }
  });
  
  list.on("click", ".remove", function(){
    var remName = $(this).prev().text();
    names = $.grep(names, function(s){
      return s != remName;
    });
    fillList();
    applyFilter(remName);
    localStorage.setItem("names", JSON.stringify(names));
  });

  $(document).on("click",".ignored",function(){
    if($(this).hasClass("red")){
      $(this).removeClass("red");
      $(this).addClass("yellow");
    }
    else {
      $(this).removeClass("yellow");
      $(this).addClass("red");
    }
    $(".red").css({"color":"red","cursor":"pointer"});
    $(".yellow").css({"color":"yellow","cursor":"pointer"});
    $(this).parents(".commentHeader").next(".commentBody").toggle();  
  });    
});

