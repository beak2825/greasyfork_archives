// ==UserScript==
// @name        LeBonCoin PlusPlus
// @namespace   lbc
// @include     https://www.leboncoin.fr/locations/offres/*
// @include     https://www.leboncoin.fr/ventes_immobilieres/offres/*
// @version     1.1.3
// @grant       GM_xmlhttpRequest
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js

// @description lbc++
// @downloadURL https://update.greasyfork.org/scripts/23492/LeBonCoin%20PlusPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/23492/LeBonCoin%20PlusPlus.meta.js
// ==/UserScript==

this.$ = this.$$$ = jQuery.noConflict(true);


if($( "#searcharea option:selected" ).text().indexOf('Côte') !== -1) {
  var onlyAddInfo = true;
} else {
  var onlyAddInfo = false;
}

$(function() {
  console.log( "LBC++ loading..." );

  var googleApiKey = "AIzaSyCHSc3xuyTzEa2fJfspmoibJduKa1iNmVs";
  var destCity = ["Rue Dr Quignard, 21000 Dijon, France", "Z I Beaune Vignolles, 11 Rue Gaston Chevrolet, 21202 Beaune"];
  // http://atlas.cosmosia.com/
  var postalCodes = ["21121", "21120", "21240", "21370", "21380", "21490", "21850", "21800", "21560", "21110", "21600", "21300", "21910", "21220", "21160", "21410", "21640", "21540", "21470", "21310", "21270"];

  
  function getDistances(place, el, cityEl, dest, cityName) {
    // console.log("getting: "+ place.city);
    // transit: https://developers.google.com/maps/documentation/distance-matrix/intro?hl=fr#travel_modes
    var request = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+place.city+"&destinations="+dest+"&mode=driving&sensor=false&key="+googleApiKey;

    GM_xmlhttpRequest({
      method: "GET",
      url: request,
      onload: function(result) {
        var res = $.parseJSON(result.response);
        var status = res.rows[0].elements[0].status;

        if(status === "OK") {

          var duration = res.rows[0].elements[0].duration.text;
          var distance = res.rows[0].elements[0].distance.text;

          var infosAdd =  distance+ ', ' +duration;
          var pBlock = '<p class="item_supp">'+cityName+': '+infosAdd+'</p>';
          cityEl.after(pBlock);

        }
      }
    });
  }
  function parsePageDom() {
    var offers = $('.tabsContent ul li');
    $.each(offers, function(i, el){
      // add target blank to a link
      $(el).find('a').attr("target","_blank");
      // change pro/private container style
      var isProContainer = ($(el).find('.ispro').length !== 0);
      if(isProContainer) {
        $(el).css('opacity', '0.8').css('background', '#ddd');
      }
      if(!isProContainer && $(el).find('.lbcppheader').length === 0) {
        $(el).css('border', '1px solid #aaa');
      }
      // get city name to retrieve distance and duration
      var cityEl = $(el).find('.item_infos .item_supp:eq(1)');
      var cityTxt = $.trim(cityEl.text());
      var cityParsing = cityTxt.replace(/\r\n/g, "\n").split("\n");
      var place = { "city" : cityParsing[0], "departement" : cityParsing[cityParsing.length-1].trim() };
      getDistances(place, el, cityEl, destCity[0], "dijon");
      getDistances(place, el, cityEl, destCity[1], "beaune");
    });
  }


  // return container as dom el
  function cleanupPage() {
    $('body').find('.information-immo').empty();
    $('body').find('.pagination').empty();
    $('body').find('.tabsContent').empty();
    $('body').find('.tabsContent').append('<ul id="lbcpp"><li><a class="list_item clearfix lbcppheader"><section class="item_infos"><h2 class="item_title">LBC PP</h2></section></a></li></ul>');
    
    $('.grid-2-1:eq(1)').after('<br />'+postalCodes.join(", "));
    var container = $('body').find('.tabsContent ul');
    return container;
  }
  function getDomBlock(postalCodes, requestLink, numberOfEls)  {
    return '<li><a target="_blank" href="'+requestLink+'" class="list_item clearfix lbcppheader"><section class="item_infos"><h2 class="item_title">'+postalCodes.join(", ")+' - ('+numberOfEls+')</h2></section></a></li>';
  }
  // return requests as array
  function buildRequest() {
    var requests = [];
    var host = location.origin+location.pathname+'?location=';
    //var host = 'https://www.leboncoin.fr/ventes_immobilieres/offres/bourgogne/?location=';
    var pcString = 'Toutes%20les%20communes%20';
    var and = '%2C';
    // var closeReq = '&parrot=0&ret=1';
    var uriArguments = window.location.search.replace('?', '&');
    console.log(uriArguments);

    var PostalCodeBy3 = [];
    var pcList = JSON.stringify(postalCodes);
    var pcList = JSON.parse(pcList);
    while (pcList.length > 0) {
      var splittedPC = pcList.splice(0, 3);
      PostalCodeBy3.push(splittedPC);
    }

    for (var i = 0; i < PostalCodeBy3.length; i++) {
      var request = host;
      for (var j = 0; j < PostalCodeBy3[i].length; j++) {
        var pc = PostalCodeBy3[i][j];
        if (j !== PostalCodeBy3[i].length-1) {
          var str = pcString + pc + and;
          var request = request.concat(str);
        } else {
          var str = pcString + pc + uriArguments;
          var request = request.concat(str);
          requests.push({"request":request, "postalCodes": PostalCodeBy3[i]});
        }
      }
    }
    return requests;
}

  function requestPages(requests, container, i) {
    console.log("Requesting" +requests.length +" pages, with at least 3 postal codes...");

        // window.open(requests[i].request);
          console.log("["+i+"] - Requesting lbc page ("+requests[i].request+") with "+requests[i].postalCodes.length+" postal codes...");
          GM_xmlhttpRequest({
            method: "GET",
            url: requests[i].request,
            onload: function(result) {
              var els = $(result.response).find('.tabsContent ul li');
              container.append(getDomBlock(requests[i].postalCodes, requests[i].request, els.length));
              container.append(els);

              if(i === requests.length-1) {
                parsePageDom();
              }
            }
          });

  }


// Process...

var isPlaceFieldEmpty = $('.nude') === null || $('.location').length === 0;

console.log(onlyAddInfo)
if(isPlaceFieldEmpty && !onlyAddInfo) {
  var requests = buildRequest();
  var container = cleanupPage();

  setTimeout(function() {
    for(var i=0; i<requests.length; i++) {
      requestPages(requests, container, i);
    }
  }, 500);
} else {
  console.log('pc or city field not empty: aborting script loading...');
}

if(onlyAddInfo) {
  parsePageDom();
}

});
