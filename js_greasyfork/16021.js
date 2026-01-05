// ==UserScript==
// @name        game review positivity
// @namespace   easynam
// @description i love videogames, all videogames are good
// @include     http://www.metacritic.com/**
// @version     1
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16021/game%20review%20positivity.user.js
// @updateURL https://update.greasyfork.org/scripts/16021/game%20review%20positivity.meta.js
// ==/UserScript==
jq = $.noConflict(true);
jq(function(){
  jq(".metascore_w").removeClass("mixed negative").addClass("positive");
  jq(".metascore_w.xlarge > span").html(100);
  jq(".metascore_w.medium").html(100);
  jq(".metascore_w.small").html(100);
  jq(".metascore_w.user").html(10);
  truth = {
    "sucks" : "rules",
    "annoy" : "delight",
    "limited" : "excellent",
    "unsatisfying" : "excellent",
    "but lacks" : "really captures",
    "not enough" : "enough",
    "although" : "",
    "avoid" : "must buy",
    "worst" : "best",
    "not the best" : "the best",
    "plot hole" : "exciting twist",
    "not bad" : "great",
    "bad" : "great",
    "forgettable" : "unforgettable",
    "poor" : "rich",
    "broken" : "fixed",
    "horrible" : "wonderful",
    "awful" : "damn brilliant",
    "mindless" : "brilliant",
    "sub-?par" : "above par",
    "interns" : "game development geniuses",
    "hack job" : "masterpiece",
    "does not( even)? deserve" : "deserves",
    "bland" : "exciting",
    "disappointment" : "good game",
    "dull" : "beautiful",
    "not " : "",
    "terrible" : "perfect",
    "travesty" : "masterpiece",
    "(piece of )?garbage" : "brilliant",
    "lackluster" : "well-made",
    "upsetting" : "delighting",
    "for shame" : "bravo",
    "crude" : "brilliant",
    "wasting" : "spending",
    "don'?t like" : "love",
    " a(?= [aeiou])" : " an",
    " an(?= [^aeiou])" : " a"
  }
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  reviews = jq(".review_body");
  for (s in truth) {
    reviews.html(function(index,html){
		return html.replace(new RegExp(s,"g"),truth[s]);
	});
	reviews.html(function(index,html){
		return html.replace(new RegExp(capitalize(s),"g"),capitalize(truth[s]));
	});
	reviews.html(function(index,html){
		return html.replace(new RegExp(s.toUpperCase(),"g"),truth[s].toUpperCase());
	});
  }

  jq(".distribution.positive").parent().css("width", "100%");
  jq(".distribution.positive").each(function(i,e) {
  	jq(e).parent().children(".count").html(jq(e).html().replace(" out of ",""));
  })
  jq(".distribution.mixed, .distribution.negative").parent().css("width", "0%");
  jq(".distribution.mixed, .distribution.negative").parent().children(".count").html(0);

  jq(".ranking_title > a, .ranking_wrap > .ranking_title").html(function(index,html){
		return html.replace(/#\d*/g,"#1").replace(/\d{4}/g,"All Time");
	});
  jq(".desc").html("Universal acclaim");
});