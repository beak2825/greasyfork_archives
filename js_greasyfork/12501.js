// ==UserScript==
// @name           [2015] elotrocoso
// @description    elotrocoso
// @description:en    elotrocoso
// @namespace      elotrocoso
// @version        1
// @include        http://*.ogame.*/game/index.php?page=overview*
// @include        http://*.ogame.*/game/index.php?page=resourceSettings*
// @downloadURL https://update.greasyfork.org/scripts/12501/%5B2015%5D%20elotrocoso.user.js
// @updateURL https://update.greasyfork.org/scripts/12501/%5B2015%5D%20elotrocoso.meta.js
// ==/UserScript==

var pages = new Array("overview", "resourceSettings");

var time = 60;

/* -- NO MODIFICAR BAJO ESTA LÍNEA -- */
var totalSeconds = Math.floor((Math.random()*10)+1) * time;
var planets = new Array();
var planetlinks = document.getElementById("rechts").getElementsByClassName("smallplanet");
if (planetlinks.length > 1) {
	var testlabelPlanet = 'planetlink active';
	var testlabelLune   = 'moonlink active';
	for (var i=0; i<planetlinks.length ; i++){	
    planets.push(planetlinks[i].innerHTML.split('moonlink')[0].split('&amp;cp=')[1].split('" title')[0]);
		if (planetlinks[i].innerHTML.indexOf('class="icon-moon"') > 0) {
			planets.push(planetlinks[i].innerHTML.split('moonlink')[1].split('&amp;cp=')[1].split('\">')[0].replace( /[^0-9-]/g, ""));
		}
	}
}
function ticker() { 
  if (totalSeconds <= 0) {
    var ranpla = Math.floor(Math.random() * planets.length);
    var ranpag = Math.floor(Math.random() * pages.length);
    window.location = 'index.php?page='+ pages[ranpag] +'&cp=' + planets[ranpla];
  }
  totalSeconds -= 1; 
  var seconds = totalSeconds;
  var minutes = Math.floor(seconds / 60);
  seconds -= minutes * (60);
  document.title = leadingZero(minutes) + ":" + leadingZero(seconds);
  window.setTimeout(ticker, 1000);
}
function leadingZero(t) {
  return (t < 10) ? "0" + t : + t;
}
window.setTimeout(ticker, 0);