// ==UserScript==
// @name        SeLoger plusplus
// @namespace   sl_pp
// @include     https://www.seloger.com/*
// @version     1.0
// @grant       GM.xmlHttpRequest 
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @description sl++

// @downloadURL https://update.greasyfork.org/scripts/369456/SeLoger%20plusplus.user.js
// @updateURL https://update.greasyfork.org/scripts/369456/SeLoger%20plusplus.meta.js
// ==/UserScript==

this.$ = this.$$$ = jQuery.noConflict(true);


// if($( "#searcharea option:selected" ).text().indexOf('Côte') !== -1) {
//   var onlyAddInfo = true;
// } else {
//   var onlyAddInfo = false;
// }

$(function () {
  console.log("LBC++ loading...");

  var googleApiKey = "AIzaSyCHSc3xuyTzEa2fJfspmoibJduKa1iNmVs";
  var destCity = ["3 rue du docteur quignard, 21000, DIJON, France", ""];
  // http://atlas.cosmosia.com/
  var postalCodes = ["21121", "21120", "21240", "21370", "21380", "21490", "21850", "21800", "21560", "21110", "21600", "21300", "21910", "21220", "21160", "21410", "21640", "21540", "21470", "21310", "21270"];


  function getDistances(place, el, cityEl, dest, cityName) {
    console.log("place.city: "+ place.city);
    console.log("dest: "+ dest);
    // transit: https://developers.google.com/maps/documentation/distance-matrix/intro?hl=fr#travel_modes
    var request = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=21 "+place.city+"&destinations="+dest+"&mode=driving&sensor=false&key="+googleApiKey;
    console.log(`request: `, request);

    GM.xmlHttpRequest ({
      method: "GET",
      url: request,
      onload: function(result) {
        console.log(`result: `, result);
        var res = $.parseJSON(result.response);
        
        var status = res.rows[0].elements[0].status;

        if(status === "OK") {

          var duration = res.rows[0].elements[0].duration.text;
          var distance = res.rows[0].elements[0].distance.text;

          var infosAdd =  distance+ ', ' +duration;
          console.log(`infosAdd: `, infosAdd);
          var pBlock = '<p class="item_supp">'+cityName+': '+infosAdd+'</p><p><a href="https://www.google.fr/maps/dir/'+ dest +'/21 '+ place.city +'/" target="_blank">map</a></p>';
          cityEl.after(pBlock);
        }
        else {
          var pBlock = '<p class="item_supp">'+cityName+': NOT FOUND (<a href="'+request+'">gmaps link</a>)</p>';
          cityEl.after(pBlock);
        }
      }
    });
  }

  function parsePageDom() {
    var offers = $('.liste_resultat .c-pa-list')
    console.log(`offers: `, offers);
    $.each(offers, function(i, el){
      var cityEl = $(el).find('.c-pa-city');
      var cityTxt = $.trim(cityEl.text());
      var cityParsing = cityTxt.replace(/\r\n/g, "\n").split("\n");
      console.log(`GETTING cityEl: `, cityTxt);
      console.log(`GETTING cityEl: `, cityParsing);
      var place = { "city" : cityParsing[0]};
      getDistances(place, el, cityEl, destCity[0], "Travail");
    });
  }

  parsePageDom()

});