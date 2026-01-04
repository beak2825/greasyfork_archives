// ==UserScript==
// @name     Marketplace Helper
// @version  1.6
// @grant    none
// @include  *://*.ogame.gameforge.com/*=marketplace*
// @namespace https://greasyfork.org/users/406969
// @description Berechnet die Ressource zu Ressource Handelskurse auf dem Marktplatz
// @downloadURL https://update.greasyfork.org/scripts/393011/Marketplace%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/393011/Marketplace%20Helper.meta.js
// ==/UserScript==

var counter = 0;
var ress_array = ["metal", "crystal", "deuterium"];
var SHORT_SCALE = ['', 'k', 'M', 'B', 'T', 'Q'];

function beautify(number) {
    var exp = Math.floor((Math.floor(number).toString().length - 1) / 3);
    var rounded = number / Math.pow(10, (exp * 3));
    return rounded.toFixed(2) + SHORT_SCALE[exp];
}

function updateMarket(){
  var offers = window.document.getElementsByClassName("info");
  var left_thumbnails = window.document.getElementsByClassName("col left");
  var right_thumbnails = window.document.getElementsByClassName("col right");

  for(var i = 0; i < offers.length; i+=2){
    var left_summary = offers[i].innerText.split("\n");
    var right_summary = offers[i+1].innerText.split("\n");

    var left_amount = parseInt(offers[i].innerText.split("\n")[1].replace(/\./g, ""));
    var right_amount = parseInt(offers[i+1].innerText.split("\n")[1].replace(/\./g, ""));

    var left_type = "";
    var right_type = "";

    if(window.document.getElementsByClassName("tabs")[0].children[1].classList.contains("active")){
      	right_amount *= 0.9;
        left_type = left_thumbnails[i / 2].children[0].classList[3];
        right_type = right_thumbnails[i / 2].children[0].classList[3];
    }else{
      	left_type = left_thumbnails[i / 2].children[0].children[0].classList[3];
      	right_type = right_thumbnails[i / 2].children[0].children[0].classList[3];
    }

    var text = "<h3>" + left_summary[0] + "</h3>\n" + left_summary[1] + " (" + left_summary[2] + ")<h3 style='max-width: 300px !important;'>";

    text += "Kurs (" + left_summary[0] +":" + right_summary[0] + ") = ";

    if(ress_array.indexOf(left_type) != -1 && ress_array.indexOf(left_type) < ress_array.indexOf(right_type)){
        text += beautify(left_amount / right_amount) + ":1";
    }else{
        text += "1:" + beautify(right_amount / left_amount);
    }
    text += "</h3>";
    offers[i].innerHTML = text;
  }
}


var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == "attributes") {
      if(mutation.target.style.display == "none"){
        updateMarket();
      }
    }
  });
});

observer.observe(window.document.getElementsByClassName("og-loading")[0], {
  attributes: true
});