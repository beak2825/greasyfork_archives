// ==UserScript==
// @name     Pogdesign links to rarbg
// @description Add links to rarbg search page (sorted by seed) on every episode
// @version  1
// @grant    none
// @match    https://www.pogdesign.co.uk/cat/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @namespace https://greasyfork.org/users/583371
// @downloadURL https://update.greasyfork.org/scripts/405036/Pogdesign%20links%20to%20rarbg.user.js
// @updateURL https://update.greasyfork.org/scripts/405036/Pogdesign%20links%20to%20rarbg.meta.js
// ==/UserScript==

$('.ep span p').each(function(iIndex, oElem){
	var $Elem = $(oElem).css('position', 'relative');
  var $Links = $Elem.find('a');
  var sSeriesName = $Links.eq(0).text();
  var sSeriesEp = $Links.eq(1).text();
  var $Img = $('<img>', {alt:'Rarbg', src:' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABR1BMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/1OlVdMlVf8lff8l0lNS0yek1X78/ar+qv+m/yelKar90itT0//9KdL+UqtTp6f9VdL/f3/Rff79qislVf79/lMm0v990islVdLQ/X7SftNRKaqoqVZ8qSp8qSpQfP4o1VZRKX5+qtNQKKnRqf6oVNXRKap+qtMkKKmoKH19qdJ/09PQ1Sn+qtL8AH1UAFVVfdJTJ1N8VKl8KH1WUn7Sfqr8ACj9VaooAFT8AFUq0v8np6fTJydS/ydTf3+nJ1NTU1N99yrtlAAAAK3RSTlMBH3uHhWclObvxfQVx7433Kf2BXyG1B/vr+eFdRcnR2VUvmaWjoTcLp58DpphvfgAAAAFiS0dEAIgFHUgAAAAHdElNRQfkBB4TChWNFWQQAAAA3ElEQVQY02NgYGRiZgEBVjYGMGDn0IYCTi5ukAAPr46uHhDoG+ho80EEDI2MjcDAhF8ALGBqbGZuampgZqxvwQoRsLS00ha01rPUsxaCCNjYAAVs7WzsLYShAg6Opk7OLq5unCIQARcXdw8PT09HbRaILU5e3j6+3t5etpxsEAE/f/8A7QD/wCBtUTGwQHBIaJh2eERIaABYDw9vZFR0jDh/bFx8dIK2MDdQIDEpKVmCSTIhJSk1TUqaQUY2PSMzS46BTzs7IzNHXoGBQVFJWUVVjUFdSENFWVNNCwBwOyleAw22CwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNC0zMFQxOToxMDoyMSswMDowMIkoCAMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDQtMzBUMTk6MTA6MjArMDA6MDBeArsLAAAAAElFTkSuQmCC'});
  var $Link = $('<a>', {href:'https://proxyrarbg.org/torrents.php?search='+sSeriesName+'+'+sSeriesEp+'&order=seeders&by=DESC', target:'_blank', style:'position:absolute;bottom:0;right:0;'});
  $Elem.append($Link.append($Img));
});