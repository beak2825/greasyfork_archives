// ==UserScript==
// @name			Jalup NEXT TTS Audio
// @namespace		nelemnaru
// @include		https://jalupnext.com/*
// @version		1.3
// @description	Play TTS audio of KK readings and JI definitions
// @grant		none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28535/Jalup%20NEXT%20TTS%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/28535/Jalup%20NEXT%20TTS%20Audio.meta.js
// ==/UserScript==

// Add ResponsiveVoice.JS Text-To-Speech (TTS) script
var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://code.responsivevoice.org/responsivevoice.js";
document.getElementsByTagName("head")[0].appendChild(s);

var overlay, overlaycard, oldoverlaycard, review, oldreview, study, oldstudy, deck, olddeck;
var regExp = /\(([^)]+)\)/;

// The TTS uses a differrent reading from the Japanese keyword for these kanji. Intonation may not be accurate. Checked up tp KK - 480.
var kanjiReadingExceptions = "力凡巾午日仇中仏内未巨央札世民奴外江年名毎灯弛宇尖充匠朴庇町 274旬 356呂臣 361妥芳究 374判 382克岐 420君 421把寿社 441我希辛邦肝 467炎昏 471者的枢";

var tts = function(textToSpeak) {
	responsiveVoice.speak(textToSpeak, "Japanese Female");
}

var checkcard = function(cardtype, n){
	//console.log("cardtype", cardtype);
	
	for (let i = 0; i < n; i++) {
	
	// Kanji Kingdom card
	if ( $(cardtype+"__front .card-position").eq(i).text().trim().indexOf("KK") != -1 ) {
		
		kanji = $(".card-explanation__english").eq(i).text();
		
		// Link kanji to Jisho.org
		$(".card-explanation__english").eq(i).wrapInner(
			$("<a></a>", { href: "http://jisho.org/search/"+kanji+"%20%23kanji", target: "_blank", style: "color:inherit; text-decoration:inherit;"})
		);
		
		// Parse reading
		if ( kanjiReadingExceptions.match(kanji) == null ) {
			reading = regExp.exec( $(cardtype+"__front > .card-sentence").eq(i).html() )[1].split(".");
			if (reading.length == 2) {
				ttstext = kanji + reading[1];
				$(".card-explanation__english").eq(i).append(
					$("<span></span>").css("opacity", "0.2").text(reading[1])
				);
			} else ttstext = kanji;
		} else ttstext = regExp.exec( $(cardtype+"__front > .card-sentence").eq(i).html() )[1].replace(/\./g, "");
		
		// Add audio icon
		$(cardtype+"__back > .card-explanation__japanese").eq(i).prepend($("<span>?</span>")
			.addClass("ttsicon")
			.attr("title", ttstext)
			.css("cursor", "pointer").css("-moz-user-select", "none")
			.click(function(){
				tts( this.title );
			}));
		if (n == 1) $(".ttsicon").eq(0).click();
	}
	
	// Jalup Intermediate card
	if ( $(cardtype+"__front .card-position").eq(i).text().trim().indexOf("JI") != -1 ) {
		
		var cardexplanation = $(cardtype+"__back >> .card-explanation__english").eq(i);
		
		var word = cardexplanation.html().split('：')[0]
		cardexplanation.html("<a href='http://jisho.org/search/"+ word + "' target='_blank' style='color:inherit; text-decoration:inherit;'>"
			+ word + "</a>：" + cardexplanation.html().split('：')[1]);
		
		// Parse text for symbols; checked up to JI - 100
		ttstext = cardexplanation.text()
			//.split('：')[1]
			.replace(/=/g, "") //JI6
			.replace(/>/g, "") //JI6
			.replace(/"/g, "") //JI8
			//.replace(/＝/g, "") //JI27,28
			//.replace(/\//g, "") //JI63,64
			;
		
		// Add audio icon
		$("<span>?</span>")
			.addClass("ttsicon")
			.attr("title", ttstext)
			.css("cursor", "pointer").css("-moz-user-select", "none")
			.prependTo( $(cardtype+"__back > .card-explanation__japanese").eq(i) )
			.click(function(){
				tts( this.title );
			});
			
		if (n == 1 && cardtype == ".card") $(".ttsicon").eq(0).click();
		
		if ((n == 1 && $(".rubyicon").length > 0) && (cardtype == ".review-card" || cardtype == ".study-card")) {
			$(".audio-button").one("click", function(){
					$("rt").hide();
			});
		}
		
		// When sentence audio button clicked, stop if playing, then play from beginning
/*		$(".audio-button").click(function(){
			// Stop audio in this line
			this.click();
		})
*/
	}
	
	}
	
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	var observer = new MutationObserver(function(mutations){
		mutations.forEach(function(mutation) {
			//console.log(mutation.type);
			
			overlay = $(".card-overlay__background").length;
			review = $(".review-card__back").length;
			study = $(".study-card__front .card-position").eq(0).text().trim();
			deck = $(".card__front .card-position").eq(0).text().trim();
			
			//console.log("overlay", overlay, "| overlaycard", overlaycard, "   oldoverlaycard", oldoverlaycard);
			//console.log("review", review, "   old review", oldreview, "| study", study, "   old study", oldstudy);
			
			
			if ( overlay ) {
				overlaycard = $(".card__front .card-position").eq(0).text().trim();
				if ( overlaycard != oldoverlaycard ) {
					checkcard(".card", 1);
				}
			} else overlaycard = "";
			oldoverlaycard = overlaycard;
			
			if ( review && review != oldreview ) {
				checkcard(".review-card",1);
			}
			oldreview = review;
			
			if ( study != "" && study != oldstudy ) {
				checkcard(".study-card",1);
			}
			oldstudy = study;
			
			if ( !overlay && deck != "" && deck != olddeck) {
				checkcard(".card", $(".card__front .card-position").length);
				olddeck = deck;
			}
			
		});
	});

var target = $("#app");
var config = { attributes: false, childList: true, characterData: true, subtree: true };

observer.observe(target[0], config);

console.log("TTS Audio observer started");