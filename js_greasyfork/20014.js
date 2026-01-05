// ==UserScript==
// @name                Overwatch BattleTags in forum
// @description         Add BattleTags directly on forum posts
// @description:en      Add BattleTags directly on forum posts
// @description:fr      Ajoute les BattleTags directement sur les posts du forum Overwatch
// @author              Glaived
// @namespace           battle.net
// @include             /battle\.net/forums/(.+)/overwatch/topic/.+/
// @version             0.5dev-preview
// @license             Creative Commons BY-NC-SA
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/20014/Overwatch%20BattleTags%20in%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/20014/Overwatch%20BattleTags%20in%20forum.meta.js
// ==/UserScript==
langi18n = {
	"en-us": {"career": "Career"},
	"en-gb": {"career": "Career"},
	"fr-fr": {"career": "Carrière"},
	"it-it": {"career": "Carriera"},
	"es-mx": {"career": "Carrera"},
	"es-es": {"career": "Carrera"},
	"pt-br": {"career": "Carreira"},
	"de-de": {"career": "Karriere"},
	"pl-pl": {"career": "Kariera"},
	"ru-ru": {"career": "карьера"},
};

var simple = ["fr", "it", "de", "pl", "ru"];

$("body").prepend("<style>\
.obt-script-armory{\
	display: block;\
	font-size: 0.8125rem;\
	width: auto;\
}\
.obt-script-armory img{\
	vertical-align: middle;\
	height: 18px;\
}\
</style>");

function i18nReturn(lang, key){
	if(lang in langi18n && $.inArray(key, langi18n[lang]))
		return langi18n[lang][key];
	else
		return langi18n["en-us"][key];
}

$(document).ready(function(){
	var infoFromUrl = window.location.href.match(/https?:\/\/(.+)\.battle\.net\/forums\/(.+)\/overwatch\/topic/i);

	$(".Topic-content .Author-details").each(function(k, v){
		var region = infoFromUrl[1];
		var lang = infoFromUrl[2];
		var user = $(this).find(".Author-name").text().trim();
		var id = $(this).find("a.Author-posts").attr("href").match(/([0-9]{4})$/);

		if($.inArray(lang, simple) !== -1){
			langUrl = lang+"-"+lang;
		}else if(lang == "en"){
			langUrl = lang+"-"+region;
		}else{
			$.each(langi18n, function(k, v){
				var split = k.split("-");
				if(split[0] == lang){
					langUrl = lang+"-"+split[1];
				}
			});
		}

		if(id !== null && id.length > 1){
			id = id[1];
			var bnet = user+"#"+id;

			$(this).find(".Author-name").each(function(){
				if($(this).text().trim() == user){
					$(this).html(user+"<span style=\"color: rgba(255, 255, 255, 0.5)\">#"+id+"</span>");

					$(this).append("<span class=\"obt-script-armory\"><a target=\"_blank\" href=\"https://playoverwatch.com/"+langUrl+"/search?q="+encodeURIComponent(bnet)+"\"><img src=\"http://i.imgur.com/NmxLnsT.png\" /> "+i18nReturn(langUrl, "career")+"</a></span>");
				}
			});
		}
	});
});