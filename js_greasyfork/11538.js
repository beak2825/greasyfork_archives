// ==UserScript==
// @name          GisMeteo_face_mod
// @namespace     https://greasyfork.org
// @description   Модификация вида сайта GisMeteo.
// @author        ALeXkRU
// @license       CC BY-SA
// @homepage      https://greasyfork.org/ru/scripts/11538-gismeteo-face-mod
// @icon          http://www.refropkb.ru/Images/gismeteo11.png
// @run-at        document-start
// @include       /^https?://(www|beta)\.gismeteo\./
// @version       0.20240721121214
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11538/GisMeteo_face_mod.user.js
// @updateURL https://update.greasyfork.org/scripts/11538/GisMeteo_face_mod.meta.js
// ==/UserScript==

(function () {
    (function() {var css = "";
		css += ["@namespace url(http://www.w3.org/1999/xhtml);",
				"",
				"/* модификация вида */"
		].join("\n");
if (false || (new RegExp("^https?:\/\/(www|beta)\.gismeteo\.")).test(document.location.href)){
			css += [
		 // !! правка структуры from Ru-Board
				" #canvas,.cleft{width: 988px !important;}#weather-maps,#map-view,#weather-old,#weather-busy{width: 986px !important;}#weather-cities,#weather-weekly,#weather-daily,#weather-hourly,#geomagnetic{width: 738px !important;}#weather-news{width: 362px !important;}.wtab{width: 228px !important;}.wtabs .wttr{left: 224px !important;}.wbfull tbody th{width: 85px !important;}.wdata thead th,.wdata tbody th{text-align: center !important;}.workday,tbody tr .weekend{width: 40px !important;}.wbshort .wbday{left: 450px !important;}.wbshort .wbnight{left: 70px !important;}.rframe{background-color: rgba(255,255,255,0.4) !important;}.wsection, .wbshort, .wbfull, .rfc{background: transparent !important;}.wbshort: hover{background-color: rgb(255,255,225) !important;}body,.content{background: url(https://www.refropkb.ru/Images/685414393.jpg) !important;background-attachment: fixed !important;}#weather-maps .fcontent{height: 280px !important;}#weather-maps li{width: 108px !important;} .wsection table{width: 690px !important;}",
				" #logo, .soft-promo, #soft-promo {display:none !important;}",
		// !!?		" #graph{float:none !important;}", //проверить
				" div#post-container,div#pre-container,.soft-promo{background:url(\"\")!important;}",
				" td.content.editor{background:url(\"\")!important;} ",
				" div.map.lazyload{background-image:url(\"\")!important;}",
		// !! оставим меню: снежинки вырезать, на бету сходить
				" #header{height: 32px !important;}",
				" #header.fcontent{height: 26px !important;}",
				" #menu{top: 0px !important;}",
				" .flakesnow{left: 0px !important;}",
				" #weather-top{height: 0px !important; padding: 0px !important;}",
				" div.cright>div#information.rframe{display: none !important;}",
				" div.c-right>div#information.rframe{display: none !important;}",
				" div.c-right>div#weather-right.rframe{display: none !important;}",
				" div.c-right>div#weather-gis-news-alter{display: none !important;}",
				" div#informer.rframe{display: none !important;}",
				" div.newstape__feed{display: none !important;}",
				" #information, #informer, .instagramteaser, #weather-lb-content.fcontent, #weather-lb.rframe, .newsadvert{display: none !important;}",
				" #traffim-widget-169.section, #weather-rbkua .fcontent, #w-hor.rframe, .navteaser, #rbc .rframe, .rframe#weather-left, .adsbygoogle {display: none !important;}",
		//	!!	" section.content>.wrap>[class]>[class]>o-9imj.column-wrap{display: none !important;}",
				" li#tourism_button{display: none !important;}"
			].join("\n");}
		if (typeof GM_addStyle != "undefined") {
			GM_addStyle(css);
		} else if (typeof PRO_addStyle != "undefined") {
			PRO_addStyle(css);
		} else if (typeof addStyle != "undefined") {
			addStyle(css);
		} else {
			var node = document.createElement("style");
			node.type = "text/css";
			node.appendChild(document.createTextNode(css));
			var heads = document.getElementsByTagName("head");
			if (heads.length > 0) {
				heads[0].appendChild(node);
			} else {
				// no head yet, stick it whereever
				document.documentElement.appendChild(node);
			}
		}
	}());
//  Удаляет рекламу из gismeteo
	(function(){
		var lct = location.href;
		if(lct.match(/^https?:\/\/(.*\.)?gismeteo\./)) {
			var removeA = function() {
				var s = document.querySelectorAll('yatag,#yandex_ad_horiz,#ad-left,#ad-lb-content,#ad-right.rframe,#rbc,.cright,.media_top,#soft-promo,.soft-promo,.soft-promo-wrap,#yandex_ad,div#informer.rframe,.rframe.awad,#ad-lb.rframe,[id*=yandex],#weather-news,#bottom_shadow,a#logo,#smi2,[id*=MarketGid],.news_frame,.media_left,.media_content,.media_frame,#counter,#adfox_catfish,[id*=banner],iframe,#soft-promo.soft-promo,div.media_middle,div.media-frame,#ad-top,#rek-top,[id*=AdFox],[id^=rek-],#weather-lb.rframe,#weather-left.rframe,#weather-top,[class^=text_ad],[class^=textAd],[class^=text-ad],[class^=ad-],[class*=pub_300x250],[class^=soc2],[class^=social-],div[class*=side___i],div.ad.ad_240x400,.itemAd,div[class=box__i],[class^=plista],div.side,div.side>noindex>div.extra,div[class=right_col_1]>div[class*=__frame]>div[id^=y],div[class=__frame]>div[id^=y],[id^=adfox],[id^=google_],a#aw0,[id^=yandex_],div.cright>div#information.rframe,div.c-right>div#information.rframe,div.c-right>div#weather-right.rframe,div.c-right>div#weather-gis-news-alter,.newstape__feed,#information,#informer,.instagramteaser,[data-type=rbc],[href*=\"type=news_type\"],#weather-lb-content.fcontent,.newsadvert,[href*=\"gismeteo\.ru\/ref/\"],.section-rss-by-column.section-rss.section > .feed ');
				for (var l = 0; l < s.length; l++) {
					if(s[l].parentNode) s[l].parentNode.removeChild(s[l]);
				}
			};
			(function(s){
				var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
				if (s) (new MutationObserver(removeA)).observe(s,{childList:true});
			})(document.querySelector('.measure'));
			// Google Chrome trick: sometimes the script is executed after that DOMContentLoaded was triggered, in this case we directly run our code
			if (document.readyState == "complete") {
				removeA();
				console.log('Page ads class removed.');
			} else {
				window.addEventListener('DOMContentLoaded', removeA);
				console.log('Page ads class removed.');
			}
		}
	}());
}());