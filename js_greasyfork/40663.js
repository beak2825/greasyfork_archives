// ==UserScript==
// @name         LaTostadora - More Items (create posters, cushions & more)
// @namespace    https://github.com/XXLuigiMario
// @version      0.3
// @description  This scripts allows you to create additional items in any LaTostadora domain.
// @author       XXLuigiMario
// @license      Unlicense (http://unlicense.org/)
// @include      *://www.latostadora.com/*
// @include      *://www.tostadora.co.uk/*
// @include      *://www.tostadora.com/*
// @include      *://www.tostadora.de/*
// @include      *://www.tostadora.fr/*
// @include      *://www.tostadora.it/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40663/LaTostadora%20-%20More%20Items%20%28create%20posters%2C%20cushions%20%20more%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40663/LaTostadora%20-%20More%20Items%20%28create%20posters%2C%20cushions%20%20more%29.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var covers = [ "L", "M", "N" ];

var models = {
  D:
  {
	  de_DE: "HORIZONTALER PLAKAT",
	  es_ES: "PÓSTER HORIZONTAL",
	  en_US: "HORIZONTAL POSTER",
	  fr_FR: "AFFICHE HORIZONTALE",
	  it_IT: "POSTER ORIZZONTALE",
  },
  E:
  {
	  de_DE: "VERTIKALES PLAKAT",
	  es_ES: "PÓSTER VERTICAL",
	  en_US: "VERTICAL POSTER",
	  fr_FR: "AFFICHE VERTICAL",
	  it_IT: "POSTER VERTICALE",
  },
  F:
  {
	  de_DE: "QUADRATISCHES PLAKAT",
	  es_ES: "PÓSTER CUADRADO",
	  en_US: "SQUARE POSTER",
	  fr_FR: "AFFICHE CARRÉ",
	  it_IT: "POSTER QUADRATO",
  },
  I:
  {
	  de_DE: "KISSENBEZUG",
	  es_ES: "FUNDA DE COJÍN",
	  en_US: "CUSHION COVER",
	  fr_FR: "HOUSSE DE COUSSIN",
	  it_IT: "FODERA CUSCINO",
  }
};

(function() {
    'use strict';

    var ipDiv = $("div").find("[data-product='IP']").children(":first");
    if (ipDiv == null) {
        return;
    }
    var str = ipDiv.find(".available_colors_pers").first().text();
	for (var i in covers) {
		ipDiv.append(createDiv("F_" + covers[i] + "1", str));
	}

    var locale = $("script[src^='/locale/']").attr('src').split('/')[2];
    if (locale == "en_GB") {
        locale = "en_US";
    }
    var liDiv = $("div").find("[data-product='LI']").children(":first");
    if (liDiv == null) {
        return;
    }
    for (var key in models) {
        liDiv.find('.clearfix').remove();
        liDiv.append(createDiv("D_" + key + "1", models[key][locale]));
    }
})();

function createDiv(modelName, str) {
    return '<div class="item col-xs-3" data-model="' + modelName + '"><div class="thumb"><img src="/img/models_imgs/thumbs/' + modelName + '.png" width="80"></div><div class="available_colors_pers">' + str + '</div></div>';
}