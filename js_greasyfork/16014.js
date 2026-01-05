// ==UserScript==
// @name        sonic adventure 2 best game of all time
// @namespace   easynam
// @description sonic adventure 2 is the best game of all time
// @include     http://www.metacritic.com/game/dreamcast/sonic-adventure-2
// @include     http://www.metacritic.com/game/gamecube/sonic-adventure-2-battle
// @include     https://www.metacritic.com/game/dreamcast/sonic-adventure-2
// @include     https://www.metacritic.com/game/gamecube/sonic-adventure-2-battle
// @version     2
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16014/sonic%20adventure%202%20best%20game%20of%20all%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/16014/sonic%20adventure%202%20best%20game%20of%20all%20time.meta.js
// ==/UserScript==
jq = $.noConflict(true);
jq(function(){
  jq(".metascore_w").removeClass("mixed negative").addClass("positive");
  jq(".metascore_w.xlarge > span").html(100);
  jq(".metascore_w.medium").html(100);        
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
    "forgettable" : "unforgettable"
  }
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  reviews = jq(".review_body");
  for (s in truth) {
    reviews.html(function(index,html){
		return html.replace(s,truth[s]);
	});
	reviews.html(function(index,html){
		return html.replace(capitalize(s),capitalize(truth[s]));
	});
	reviews.html(function(index,html){
		return html.replace(s.toUpperCase(),truth[s].toUpperCase());
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