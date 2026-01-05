// ==UserScript==
// @name        Neopets bad word checker
// @namespace   neonazis
// @include     http://www.neopets.com/neoboards/topic.phtml*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-1.11.0.min.js
// @description:en Notifies you when you enter a "bad" word on the neoboards.
// @description Notifies you when you enter a "bad" word on the neoboards.
// @downloadURL https://update.greasyfork.org/scripts/10196/Neopets%20bad%20word%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/10196/Neopets%20bad%20word%20checker.meta.js
// ==/UserScript==

var naughtyWords = ["shit", "fuck", "cunt", "crack", "weed", "uncle", "nigger", "death", "kill", "cum", "rape", "semen", "anal", "screw",
                    "meth", "snatch", "ass", "gay", "cock", "hole", "nuts", "meth", "ball", "stupid as", "bad as", "my space", "do it", 
                    "expression", "pen", "bad", "hit", "religion", "sex", "drunk", "makeup", "text", "shindig", "stick", "itching",
                    "lesbian", "lezzie", "naked", "piss", "queer", "schlong", "suck", "tampon", "tit", "vagina", "idiot", "tag", "hooters",
                    "google", "myspace", "tumblr", "twitter", "youtube"];
var currentNaughtyWords = [];
$(document).ready(function(){
  $("form[name='message_form'] > table > tbody > tr:nth-of-type(2)").after("<tr><td id='censorcheck' style='text-align: center; color: #FF0000;' colspan='2'></td></tr>");
  $("#censorcheck").html("&nbsp;");
}); 

function checkWords() {
  message = $("form[name='message_form'] textarea").val();
  currentNaughtyWords.length = 0;
  for (i = 0; i < naughtyWords.length; i++) {
    if (message.toLowerCase().indexOf(naughtyWords[i]) >= 0) {
       currentNaughtyWords.push(naughtyWords[i]);
    }
  }
  if (currentNaughtyWords.length > 0) {
    $("#censorcheck").text("Naughty words found: " + currentNaughtyWords);
  } else {
    $("#censorcheck").html("&nbsp;");
  }
}

var scheduleCheck = window.setInterval(function() {
  checkWords()
}, 1000);