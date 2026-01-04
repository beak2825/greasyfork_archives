// ==UserScript==
// @name        https://www.soccer24.com/
// @namespace   https://www.soccer24.com/
// @description My script
// @include     https://www.soccer24.com/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38731/https%3Awwwsoccer24com.user.js
// @updateURL https://update.greasyfork.org/scripts/38731/https%3Awwwsoccer24com.meta.js
// ==/UserScript==

if (window.location.href == "https://www.soccer24.com/") {
 window.setTimeout(function() {
  
  var leagues = $(".soccer");
  var desiredLeagues = [];
  var desiredLeaguesNames = [
    { country: "ENGLAND: ", league: "Premier League" },
    { country: "ENGLAND: ", league: "Championship" },
    { country: "ENGLAND: ", league: "Championship - Play Offs" },
    { country: "ENGLAND: ", league: "League One" },
    { country: "ENGLAND: ", league: "League One - Play Offs" },
    { country: "ENGLAND: ", league: "League Two" },
    { country: "ENGLAND: ", league: "League Two - Play Offs" },
    { country: "SPAIN: ", league: "LaLiga" },
    { country: "SPAIN: ", league: "LaLiga2" },
    { country: "SPAIN: ", league: "LaLiga2 - Promotion - Play Offs" },
    { country: "GERMANY: ", league: "Bundesliga" },
    { country: "GERMANY: ", league: "Bundesliga - Relegation" },
    { country: "GERMANY: ", league: "2. Bundesliga" },
    { country: "GERMANY: ", league: "2. Bundesliga - Relegation" },
    { country: "ITALY: ", league: "Serie A" },
    { country: "ITALY: ", league: "Serie B" },
    { country: "ITALY: ", league: "Serie B - Play Offs" },
    { country: "FRANCE: ", league: "Ligue 1" },
    { country: "FRANCE: ", league: "Ligue 1 - Relegation" },
    { country: "FRANCE: ", league: "Ligue 2" },
    { country: "FRANCE: ", league: "Ligue 2 - Relegation" },
    { country: "NETHERLANDS: ", league: "Eredivisie" },
    { country: "NETHERLANDS: ", league: "Eredivisie - Relegation" },
    { country: "NETHERLANDS: ", league: "Eredivisie - Europa League - Play Offs" },
    { country: "PORTUGAL: ", league: "Primeira Liga" },
    { country: "SCOTLAND: ", league: "Premiership" },
    { country: "SCOTLAND: ", league: "Premiership - Relegation Group" },
    { country: "SCOTLAND: ", league: "Premiership - Championship Group" },
    { country: "SCOTLAND: ", league: "Premiership - Relegation" },
    { country: "AUSTRALIA: ", league: "A-League" },
    { country: "AUSTRALIA: ", league: "A-League - Play Offs" },
    { country: "POLAND: ", league: "Ekstraklasa" },
    { country: "POLAND: ", league: "Ekstraklasa - Relegation Group" },
    { country: "POLAND: ", league: "Ekstraklasa - Championship Group" },
    { country: "RUSSIA: ", league: "Premier League" },
    { country: "RUSSIA: ", league: "Premier League - Relegation" },
    { country: "DENMARK: ", league: "Superliga" },
    { country: "DENMARK: ", league: "Superliga - Relegation Group" },
    { country: "DENMARK: ", league: "Superliga - Championship Group" },
    { country: "DENMARK: ", league: "Superliga - Relegation - Play Offs" },
    { country: "DENMARK: ", league: "Superliga - Europa League - Play Offs" },
    { country: "SWITZERLAND: ", league: "Super League" },
    { country: "AUSTRIA: ", league: "Tipico Bundesliga" },
    { country: "TURKEY: ", league: "Super Lig" },
    { country: "BELGIUM: ", league: "Jupiler League" },
    { country: "BELGIUM: ", league: "Jupiler League - Championship Group" },
    { country: "BELGIUM: ", league: "Jupiler League - Europa League Group" },
    { country: "BELGIUM: ", league: "Jupiler League - Europa League - Play Offs" },
    { country: "GREECE: ", league: "Super League" },
    { country: "GREECE: ", league: "Super League - Play Offs" },
    { country: "URUGUAY: ", league: "Primera Division" },
    { country: "URUGUAY: ", league: "Primera Division - Apertura" },
    { country: "URUGUAY: ", league: "Primera Division - Clausura" },
    { country: "URUGUAY: ", league: "Primera Division - Play Offs" },
    { country: "URUGUAY: ", league: "Primera Division - Torneo Intermedio" },
    { country: "URUGUAY: ", league: "Primera Division - Torneo Intermedio - Play Offs" },
    { country: "URUGUAY: ", league: "Primera Division - Relegation" },
    { country: "MEXICO: ", league: "Primera Division" },
    { country: "MEXICO: ", league: "Primera Division - Apertura" },
    { country: "MEXICO: ", league: "Primera Division - Apertura - Play Offs" },
    { country: "MEXICO: ", league: "Primera Division - Clausura" },
    { country: "MEXICO: ", league: "Primera Division - Clausura - Play Offs" },
    { country: "SWEDEN: ", league: "Allsvenskan" },
    { country: "SWEDEN: ", league: "Allsvenskan - Relegation" },
    { country: "NORWAY: ", league: "Eliteserien" },
    { country: "NORWAY: ", league: "Eliteserien - Relegation" },
    { country: "IRELAND: ", league: "Premier Division" },
    { country: "JAPAN: ", league: "J-League" },
    { country: "BRAZIL: ", league: "Serie A" },
    { country: "CHINA: ", league: "Super League" },
    { country: "ARGENTINA: ", league: "Superliga" },
    { country: "EUROPE: ", league: "Champions League - Qualification" },
    { country: "EUROPE: ", league: "Champions League - Group Stage" },
    { country: "EUROPE: ", league: "Champions League - Play Offs" },
    { country: "EUROPE: ", league: "Europa League - Qualification" },
    { country: "EUROPE: ", league: "Europa League - Group Stage" },
    { country: "EUROPE: ", league: "Europa League - Play Offs" },
    { country: "WORLD: ", league: "Club Friendly" }
  ];
  for (var i = 0; i < desiredLeaguesNames.length; i++) {
    $.each(leagues, function() {
      if ( ($(this).find( ".country_part" ).html() == desiredLeaguesNames[i].country) &&
           ($(this).find( ".tournament_part" ).html() == desiredLeaguesNames[i].league) ) {
        desiredLeagues.push(this);
      }
    });
  }
  
  var leaguesHTML = "";
  $.each(desiredLeagues, function() {
    $(this).find(".league").css("background-color", "red");
    $(this).find(".league").removeClass("primary-top");
    leaguesHTML += this.outerHTML;
  });
  
  var stripe = '<hr style="border: 10px solid blue;">';
  
  leaguesHTML += stripe;
  
  var tableMain = $(".table-main").html();
  $(".table-main").html(leaguesHTML + tableMain);
  
  console.log(desiredLeagues);
  
 }, 2000);
}