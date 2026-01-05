// ==UserScript==
// @name        Hammerfest Game Options
// @namespace   hammerfest
// @description Adds a convenient way to change Hammerfest game options for the tutorial.
// @include     http*://www.hammerfest.es/try.html*
// @include     http*://www.hammerfest.fr/try.html*
// @include     http*://www.hfest.net/try.html*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @author      SoKeT
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/28877/Hammerfest%20Game%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/28877/Hammerfest%20Game%20Options.meta.js
// ==/UserScript==

var locale = location.hostname.split(".").reverse()[0];
var modes = {
  "mirror": {
    "es": "Espejo",
    "fr": "Miroir",
    "net": "Mirror"
  },
  "nightmare": {
    "es": "Pesadilla",
    "fr": "Cauchemar",
    "net": "Nightmare"
  },
  "ninja": {
    "es": "Ninjutsu",
    "fr": "Ninjutsu",
    "net": "Ninjutsu"
  },
  "bombexpert": {
    "es": "Explosivos inestables",
    "fr": "Explosifs instables",
    "net": "Unstable explosives"
  },
  "boost": {
    "es": "Tornado",
    "fr": "Tornade",
    "net": "Tornado"
  }
}

var confirm = {
  "es": "Confirmar",
  "fr": "Confirmer",
  "net": "Confirm"
}

var margin = "";

if ($(".trymight").length) {
  margin = "<br><br><br><br>";
}

$(".game").after(margin + '<center><div class="game-options"><label><input value="mirror" type="checkbox"> ' + modes.mirror[locale] + ' </label><label><input value="nightmare" type="checkbox"> ' + modes.nightmare[locale] + ' </label><label><input value="ninja" type="checkbox"> ' + modes.ninja[locale] + ' </label><label><input value="bombexpert" type="checkbox"> ' + modes.bombexpert[locale] + ' </label><label><input value="boost" type="checkbox"> ' + modes.boost[locale] + ' </label><button class="submit-options">' + confirm[locale] + '</button></div></center>');

var $submit = $(".submit-options");
var $game = $("#game");
var src = $game.attr("src");
var flashvars = $game.attr("flashvars");
var options = "";

var css = {
  "display": "block",
  "margin-top": "10px",
  "width": "80px",
  "cursor": "pointer",
  "padding": "2px 3px",
  "font-weight": "bold",
  "color": "white",
  "background-color": "#b89bde",
  "border-top": "1px solid #a389c5",
  "border-left": "1px solid #a389c5",
  "border-bottom": "1px solid #8263a5",
  "border-right": "1px solid #8263a5"
}

var hover = {
  "background-color": "#ad8fcf",
  "border-top": "1px solid #8263a5",
  "border-left": "1px solid #8263a5",
  "border-bottom": "1px solid #a389c5",
  "border-right": "1px solid #a389c5"
}

$.each(css, function(property, value) {
    $submit.css(property, value);
  });

function hoverIn() {
  $.each(hover, function(property, value) {
    $submit.css(property, value);
  });
}

function hoverOut() {
  $.each(css, function(property, value) {
    $submit.css(property, value);
  });
}

$submit.hover(hoverIn, hoverOut);

$submit.on("click", function() {
  var $checked = $('.game-options input:checked');
  
  if ($checked.length) {
    $checked.each(function() {
      options += $(this).val() + ",";
    });
  
    options = options.substring(0, options.length - 1);
  
    $game.attr("flashvars", flashvars + "&$options=" + options);
    $game.attr("src", src);
  
    $(".game-options").find("input").each(function() {
      $(this).prop("disabled", true);
    }); 
    
    $submit.remove();
  }
});