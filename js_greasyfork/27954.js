// ==UserScript==
// @name         Adminer Search
// @namespace    thetomcz.adminer.search
// @version      1.1
// @description  Search Adminer
// @author       TheTomCZ <hejl.tomas@gmail.com>
// @include        http://adminer.loc/*
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @homepage   https://greasyfork.org/en/scripts/27954
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27954/Adminer%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/27954/Adminer%20Search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.AdmS = {
    selected: null,
    input: null,
    position: null,
    
    search: function(text, e){
      if(AdmS.input.hasClass("found")){
        if(e.which != 8){
          e.preventDefault();
          return;
        }
        else {
          AdmS.input.val(AdmS.input.data("prefix"));
          text = AdmS.input.data("prefix");
        }
      }
      $("#content form tbody tr").hide().removeClass("selected");
      var $search = null;
      if(text){
        $search = $("#content form  tbody tr th").filter(function(index){
            return $(this).text().toLowerCase().indexOf(text.toLowerCase())>-1;
        });
      }
      else {
        $search = $("#content form  tbody tr th");
      }
      var $show = $search.parent("tr");
      AdmS.exact = false;
      if(text && $show.length){
        $show.each(function(){
          if(text == $(this).find("th").text()){
            AdmS.exact = $(this);
            AdmS.exact.addClass("selected");
          }
        });
      }
      $show.show();
      if($show.length==1){
        AdmS.selected = $show;
        $show.addClass("selected");
        AdmS.input.data("prefix", AdmS.input.val().slice(0, -1));
        AdmS.input.addClass("found").val( $.trim($show.find("th:nth(0)").text()) );
      }
      else {
        AdmS.selected = null;
        AdmS.input.removeClass("found");
      }
      
    },
		
    init: function(){
      if(AdmS.searchAllowed()){
        AdmS.initSearch();
      }
      if(AdmS.onTablePage()){
        AdmS.initSwitch();
      }
      if(AdmS.onListPage()){
        AdmS.initSwitch2();
      }
    },
    
    initSwitch: function(){
      console.log('init');
      $("body").on("keydown", function(e){
        console.log("down", e.keyCode);
        if (e.keyCode === 86) { //press v
          let $link = $("a:contains(Vypsat data)");
          if(!$link.length){
            $link = $("a:contains(Select data)");
          }
          if($link.length){
            location.href = $link.attr("href");
          }
        }  
      });
    },
    
    initSwitch2: function(){
      $("body").on("keydown", function(e){
        if (e.keyCode === 86) { //press v
          if( $("#fieldset-search").hasClass("hidden") )
            $("#fieldset-search").toggleClass("hidden").find("input").focus();
        }  
      });
    },
    
    initSearch: function(){
      $("#content form").before("Search: <input id='search' style='font-size: 30px' /><style>.selected{font-size: 20px; padding: 5px; background: rgba(255, 80, 80, 0.3);}.selected a{ color: yellow!important)} .found{background:yellow}</style>");
      AdmS.input = $("#search");
      AdmS.input.focus();
      AdmS.input.on("keypress keyup change",function(e){
        if(e.which == 13) {
          AdmS.submit();
        }
        else if(e.which == 38){
          AdmS.move(-1);
        }
        else if(e.which == 40){
          AdmS.move(1);
        }
        else {
          AdmS.search($(this).val(), e);
        }
      });
    },
    
    move: function(dir){
      $(".selected").removeClass("selected");
      if(!AdmS.exact){
        AdmS.exact = $("#content form tbody tr:visible:first");
        AdmS.exact.addClass("selected");
        return;
      }
      
      var $allVisible = $("#content form tbody tr:visible");
      var currentIndex = $allVisible.index(AdmS.exact);
      var newIndex = currentIndex + dir;
      console.log(currentIndex, newIndex);
      var $next = $allVisible[newIndex];
      AdmS.exact = $($next);
      if(AdmS.exact.length){
        AdmS.exact.addClass("selected");
      }
    },
    
    submit: function(){
      if(AdmS.selected){
        location.href = AdmS.selected.find("a").attr("href");
      }
      if(AdmS.exact){
        location.href = AdmS.exact.find("a").attr("href");
      }
    },
    
    searchAllowed: function(){
      var h2t = $("h2").text();
      if(h2t.indexOf("Database: ")>=0 || h2t.indexOf("Databáze: ")>=0){
        return true;
      }
      if(h2t=="Vybrat databázi" || h2t=="Select database"){
        return true;
      }
      return false;
    },
    
    onTablePage: function(){
      var h2t = $("h2").text();
      if(h2t.indexOf("Tabulka: ")>=0 || h2t.indexOf("Table: ")>=0){
        return true;
      }
      return false;
    },
    
    onListPage: function(){
      var h2t = $("h2").text();
      if(h2t.indexOf("Vypsat: ")>=0 || h2t.indexOf("Select: ")>=0){
        return true;
      }
      return false;
    }
    
  };

  AdmS.init();
})();