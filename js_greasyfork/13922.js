// ==UserScript==
// @name        IngressBuilderRevenue
// @namespace   notableTieView
// @description Add a tool to compute the number of fields, links, points, that a player can get from a particular area.
// @include     https://www.ingress.com/
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13922/IngressBuilderRevenue.user.js
// @updateURL https://update.greasyfork.org/scripts/13922/IngressBuilderRevenue.meta.js
// ==/UserScript==

// add functions and variable that are to be available on the page
function wrapper() {
  window.toggleDisplay = function (selector) {
    item = $(selector);
    if (item.hasClass('invisible')) {
      item.removeClass('invisible');
    } else {
      item.addClass('invisible');
    }
  };
  window.addCommas = function(nStr) {
    nStr += '';
	  x = nStr.split('.');
	  x1 = x[0];
	  x2 = x.length > 1 ? '.' + x[1] : '';
	  var rgx = /(\d+)(\d{3})/;
	  while (rgx.test(x1)) {
		  x1 = x1.replace(rgx, '$1' + ',' + '$2');
	  }
	  return x1 + x2;
  };
  window.addLineData = function(selector, num, ap) {
    rowTds=$(selector);
    rowTds.eq(1).text(addCommas(num));
    rowTds.eq(2).text(addCommas(ap));
  };
  window.computeStatistics = function() {
    portals=parseInt($('#numPortals').val());
    portalsOnKonvexHull=parseInt($('#numBorder').val());
    if (isNaN(portals) || isNaN(portalsOnKonvexHull)) {
      alert("Please enter valid numbers.");
      return;
    }
    numFields=2*portals - portalsOnKonvexHull -2;
		numLinks = 3*portals -portalsOnKonvexHull -3;
		numResos = 8*portals;
		numMods = 2*portals;
    apFields=numFields*1250;
		apMods = numMods*150;
    apResos = numResos*125+portals*(500+250);
    apLinks = numLinks*313;
    sum=apFields+apMods+apResos+apLinks;
    addLineData('#ingressMods td', numMods, apMods);
    addLineData('#ingressResos td', numResos, apResos);
    addLineData('#ingressFields td', numFields, apFields);
    addLineData('#ingressLinks td', numLinks, apLinks);
    addLineData('#ingressSum td', '', sum);
  };
  // ...
}
var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + wrapper + ')();'));
(document.body || document.head || document.documentElement).appendChild(script);
function addGlobalStyle(css) {
  var head,
  style;
  head = document.getElementsByTagName('head') [0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}
addGlobalStyle('.invisible { display:none !important; }');
addGlobalStyle('#compute {\
  background-color: rgba(31,31,31,0.9);\
  color: rgb(17, 236, 247);\
  z-index: 100;\
  height: 320px;\
  margin-top: 100px;\
  left:50%;\
  width: 340px;\
  margin-left: -170px;\
  position:fixed;\
  padding:10px;\
  border-width: 1px;\
  border-style: solid;\
  font-family: coda_regular,sans-serif;\
}');
addGlobalStyle('#revenueButton,#intelButton {\
  font-size: 16px;\
  margin: 0.75em 0px;\
  padding: 0.7em 1em;\
  position: relative;\
  cursor: pointer;\
  font-weight: 700;\
  border-width: 1px;\
  border-style: solid;\
  font-family: sans-serif;\
  text-decoration: none;\
  z-index:999;\
  position:fixed;\
  right:10px;\
  background-color: #11ECf7;\
  color: black;\
}');

addGlobalStyle('#intelButton {\
margin-top:3.75em;\
}');


addGlobalStyle('.ingressAP {\
  text-align:right;\
}');

addGlobalStyle('.ingressCount {\
  text-align:right;\
}');

addGlobalStyle('#numPortals, #numBorder {\
width:50px;\
margin-right:10px;\
}');

addGlobalStyle('#builderHeading {\
font-size:2.3em;\
}');

addGlobalStyle('#revenueTable {\
width: 80%;\
margin-left: 5%;\
border-spacing: 20px 0px;\
table-layout: fixed;\
}');

addGlobalStyle('th {\
text-align:left;\
}');


$('body').append('  <a id="revenueButton" onclick="toggleDisplay(\'#compute\')">Compute Area AP</a>');
$('body').append('  <a id="intelButton" href="/intel">Intel</a>');

$('body').append('\
  <div id="compute" class="invisible">\
    <div id="builderHeading">Builder Revenue</div>\
    <p>Enter the number of portals in the area and the number of portals (thereof) which form the border (all other portals are inside the polygon they form).</p>\
    <p>\
      <label>Portals:</label>\
      <input type="number" id="numPortals"/>\
      <label>Border:</label>\
      <input type="number" id="numBorder"/>\
      <button type="button" id="computeButton" onclick="computeStatistics()">Compute</button>\
    </p>\
    <table id="revenueTable">\
      <tr>\
        <th class="ingressEntity">Entity</th><th class="ingressCount">Number</th><th class="ingressAP">AP</th>\
      </tr>\
      <tr id="ingressResos">\
        <td class="ingressEntity">Resos</td><td class="ingressCount">0</td><td class="ingressAP">0</td>\
      </tr>\
      <tr id="ingressLinks">\
        <td class="ingressEntity">Links</td><td class="ingressCount">0</td><td class="ingressAP">0</td>\
      </tr>\
      <tr id="ingressFields">\
        <td class="ingressEntity">Fields</td><td class="ingressCount">0</td><td class="ingressAP">0</td>\
      </tr>\
      <tr id="ingressMods">\
        <td class="ingressEntity">Mods</td><td class="ingressCount">0</td><td class="ingressAP">0</td>\
      </tr>\
      <tr id="ingressSum">\
        <td class="ingressEntity">Total</td><td class="ingressCount">0</td><td class="ingressAP">0</td>\
      </tr>\
    </table>\
  </div>'
);
