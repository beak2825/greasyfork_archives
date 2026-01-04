// ==UserScript==
// @name         FV - Preview Vistas
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Preview vistas you don't own
// @author       msjanny
// @match        https://www.furvilla.com/forums/settings
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387679/FV%20-%20Preview%20Vistas.user.js
// @updateURL https://update.greasyfork.org/scripts/387679/FV%20-%20Preview%20Vistas.meta.js
// ==/UserScript==

(function() {
  'use strict';
  /* globals $:false */

  GM_addStyle(".thread-user-info {min-height: 700px;}\
               .well {margin-top: 20px;}\
               .museum {max-width: 100px; float: left; margin-right: 20px; text-align: center;}\
               .thread-user-info {background-position: center top; background-repeat: no-repeat;}\
               #found a {width: 92.8px; display: inline-block;}");

  function searchByID(item_id) {
    var url = "https://www.furvilla.com/museum/item/" + item_id;
    $.get(url, function( data ) {
      var result = $.parseHTML(data);
  
      var vistaName = $("h1", result).text().substring(7);
      var vistaDesc = $(".help-block i", result).text();
      var artist = vistaDesc.indexOf("#") !== -1 ? vistaDesc.split('#')[1].split(' ')[0] : "";
      var itemURL = $(".margin-2em img", result).attr("src");
      var vistaURL = "https://www.furvilla.com/img/vistas/" + itemURL.split('/')[6];

      //set vista
      $(".thread-user-info").css("background-image", "url(" + vistaURL + ")");

      //display info about vista
      if (artist) {
        $("#preview").html($(`<h2>Preview</h2><a href="${url}" class="museum"> <img src="${itemURL}"><br>${vistaName}</a><a href="https://www.furvilla.com/profile/${artist.replace(/\D/g,'')}">${vistaDesc}</a><div class="clearfix"></div>`));
        $("#preview").show();
      }
      else
        $("#preview").html($(`<h2>Preview</h2><a href="${url}" class="museum"> <img src="${itemURL}"><br>${vistaName}</a>
        ${vistaDesc}<div class="clearfix"></div>`));
        $("#preview").show();
    });
  }


  $(document).ready(function(){
    //add HTML elements
    $(".thread-user-post-middle").append($('<div class="well" id="vista-settings"><h2>Search Vistas</h2><div class="form-group row" style=" position: relative; "><div class="col-xs-4"><div class=""> <label for="item_name">Item Name </label></div><div class=""> <input class="form-control" name="item_name" type="text" id="item_name"></div></div><div class="col-xs-4"><div class=""> <label for="item_id">Item ID </label></div><div class=""> <input class="form-control" name="item_id" type="text" id="item_id"></div></div><input class="btn pull-right" id="search_vistas" type="submit" style=" bottom: 0; position: absolute; width: 30%; " value="Search"/></div></div><div class="well" id="found" style="display: none;"></div><div class="well" id="preview" style="display: none;"></div>'));
 
    //add functionality to search button
    $("#search_vistas").click(function() {
      //retrieve search values
      var item_id = $("#item_id").val();
      if (item_id) {
        $("#found").hide();
        searchByID(item_id);
      }
      else
      {
        var url = "https://www.furvilla.com/museum/items?&is_vista=1&name=" + $("#item_name").val();

        $.get(url, function( data ) {
          var result = $.parseHTML(data);
          var items = $(".inventory a", result);

          //clear display & list # of results found
          $("#found").empty();
          $("#found").append($(`<h2>${items.length} Result(s) - maximum 20</h2>`));

          items.each(function (i, v) {
            //replace hover with name of item, then remove .name
            var name = $(this).find(".name");
            $(this).find("img").attr("title", name.text());
            name.remove();
            //replace link with item ID
            var item_id = $(this).attr("href").split('/')[3];
            $(this).attr("href", "#" + item_id);
            $(this).click(function() {
              searchByID(item_id);
            });
            $("#found").append($(this));
            $("#found").show();
          });
        });
      }
    });
  });

})();