// ==UserScript==
// @name           WFMultiFleetBuilder
// @namespace      sk.seko
// @description    Builds specified number of fleets using "template"
// @include        http://*.war-facts.com/fleet_management.php*
// @version        2.0
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/378340/WFMultiFleetBuilder.user.js
// @updateURL https://update.greasyfork.org/scripts/378340/WFMultiFleetBuilder.meta.js
// ==/UserScript==

// 1.0 = Initial release
// 1.1  Changed UI integration
// 1.2  Fix for Firefox updates (grant none)
// 1.3  Fixed something
// 2.0  Fixed for new UI

// never create more than this number of fleets at once; be nice to the server!
var MAX_FLEETS = 200;


function startsWith(str, prefix) {
    if (!str) {
        return false;
    }
    return str.indexOf(prefix) == 0;
}


// pads string with leading zeroes
function pad0(str, len) {
  if (str && len) {
    str = str.toString();
    while (str.length < len) {
      str = '0' + str;
    }
  }
  return str;
}


// trims leading and trailing white chars
function trimSpaces(str) {
  return str ? str.replace(/^\s+/, '').replace(/\s+$/, '') : str;
}


function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function replaceString(s, number) {
  s = s.replace(/%0(\d+)n/g, function myReplace(str, $1) {return pad0(number, $1);})
  return s.replace(/%n/g, pad0(number, 2));
}


// sends 'create fleet' request
function requestCreate(fleetTemplate, number, onload) {
  // url : http://www.war-facts.com/fleet_management.php
  // params : design1=2292&design2=3563&flagship=3563&design3=3723&newname=abc&newfleet=Start+new+Fleet&colony=385&types=3
  var params = 'flagship=' + fleetTemplate.flagship;
  params += '&newname=' + replaceString(fleetTemplate.name, number)
  params += '&newfleet=Start+new+Fleet&types=0';
  params += '&colony=' + fleetTemplate.colony;
  //alert('Params: ' + params)
  GM_xmlhttpRequest({
    method: 'POST',
    url: 'http://'+window.location.hostname+'/fleet_management.php',
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/xml,text/xml,text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
        },
    data: params,
    onload: function(responseDetails) {onload(responseDetails, fleetTemplate, number, onload);}
  });
}


// sends 'add to fleet' request
function requestAdd(fleetId, fleetTemplate, number, onload) {
  var params = 'fleet=' + fleetId;
  params += '&addships=Add+to+fleet';
  params += '&colony=' + fleetTemplate.colony;
  for (var i = 1; i <= fleetTemplate.ships.length; ++i) {
    params += '&amount' + i + '=' + fleetTemplate.ships[i-1].shipCount;
    params += '&design' + i + '=' + fleetTemplate.ships[i-1].designId;
  }
  params += '&types=' + fleetTemplate.ships.length;
  //GM_log('requestAdd #' + number + ' params: ' + params);
  GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://'+window.location.hostname+'/fleet_management.php',
      headers: {
          'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
          'Accept': 'application/xml,text/xml,text/html',
          'Content-Type': 'application/x-www-form-urlencoded'
          },
      data: params,
      onload: function(responseDetails) {onload(responseDetails, fleetTemplate, number, onload);}
  });
}


// set fleet orders
function requestOrders(fleetId, fleetTemplate, number, onload, what) {
    //&fratConfirm=0&orders=Set+Orders&stanceindex=1&refuse=1&testbatt=0&aenemy=1&afaction=1
    var params = 'fleet=' + fleetId;
    if (what) {
        params += "&fratConfirm=0&orders=Set+Orders&stanceindex=1&refuse=1&testbatt=0&aenemy=1&afaction=1";
    } else {
        params += "&fratConfirm=0&orders=Set+Orders&stanceindex=5&refuse=1&testbatt=0&aenemy=0&afaction=0";
    }
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://'+window.location.hostname+'/fleet_navigation.php',
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/xml,text/xml,text/html',
            'Content-Type': 'application/x-www-form-urlencoded'
            },
        data: params,
        onload: function(responseDetails) {onload(responseDetails, fleetTemplate, number, onload);}
    });
}


function finishAll(fleetTemplate) {
  alert('All fleets created');
  window.location.replace('/fleet_management.php?colony=' + fleetTemplate.colony);
}


function templateFleets() {
  // parse fleet template ( the format is: "fleetCount designId [shipCount designId] ..." )
  var mfbTemplate = trimSpaces(document.getElementById('mfbTemplate').value);
  //GM_log('fleet template=' + mfbTemplate);
  if (!mfbTemplate || mfbTemplate=='') {
    alert('No fleet template specified!');
    return;
  }
  var tmpl = mfbTemplate.split(/[\s,]+/);
  if (tmpl.length < 2 || tmpl.length % 2 == 1) {
    alert('Wrong fleet template format!');
    return;
  }
  // create fleet template object
  var tmplObj = {};
  tmplObj.fleetCount = tmpl[0];
  if (tmplObj.fleetCount > MAX_FLEETS) {
    alert('Can\'t create more than ' + MAX_FLEETS + ' fleets at once!');
  }
  tmplObj.flagship = tmpl[1];
  tmplObj.ships = [];
  for (var i = 2; i < tmpl.length; i+=2) {
    ship = {};
    ship.shipCount = tmpl[i];
    ship.designId = tmpl[i+1];
    tmplObj.ships.push(ship);
  }
  tmplObj.colony = document.getElementsByName('colony')[0].value;
  tmplObj.name = document.getElementById('newname').value;
  requestCreate(tmplObj, tmplObj.fleetCount, function(responseDetails, fleetTemplate, number, onload) {
    var fleetParam = responseDetails.responseText.match(/fleet_navigation.php\?fleet=(\d+)>&lt;&lt Navigate Fleet/);
    if (fleetParam) {
	  if (fleetTemplate.ships.length <= 0) {
		if (number == 1) {
		  finishAll(fleetTemplate);
		}
	  } else {
        fname = fleetTemplate.name;
        //what = (!startsWith(fname, 'Probe-') && !startsWith(fname, 'Sur-') && !startsWith(fname, 'Survey-'));
        //requestOrders(fleetParam[1], fleetTemplate, number, function() {}, what);
        requestAdd(fleetParam[1], fleetTemplate, number, function() {
            //GM_log('fleet finished #' + number)
            if (number == 1) {
              finishAll(fleetTemplate);
            }
          });
	  }
    } else {
      alert('No fleet id found in response: ' + responseDetails.responseText);
    }
    if (number > 1) {
      requestCreate(fleetTemplate, number-1, onload);
    }
  });
}


// register callbacks and draw UI
function onMultiInit() {
  // is create button displayed?
  var createBtn = document.getElementById('newfleet');
  if (!createBtn) {
    // no button = no function
    return;
  }

  var row1 = document.createElement('tr');

  var col2 = document.createElement('td');
  col2.setAttribute('align', 'left');
  col2.setAttribute('class', 'padding5 highlight tbborder');
  col2.setAttribute('colspan', '4');
  var textField = document.createElement('input');
  textField.setAttribute('class', 'fullwidth darkinput');
  textField.setAttribute('id', 'mfbTemplate');
  textField.setAttribute('type','text');
  help='Fleet template\n\n'
  + 'Format: fleetCount flagshipDesignId [shipCount designId]...\n'
  + 'Example: "10 96 3 99" will create 10 fleets with flagship (of design 96) and 3 ships (of design 99)\n'
  + '\n'
  + 'Note: Use %n (or %02n, %03n etc) in fleet name for autonumbering (with padding).';
  textField.setAttribute('title',help);
  col2.appendChild(textField);
  row1.appendChild(col2);

  var col3 = document.createElement('td');
  col3.setAttribute('align', 'center');
  col3.setAttribute('class', 'padding5 highlight tbborder');
  var startBtn = document.createElement('input');
  startBtn.setAttribute('class', 'darkbutton');
  startBtn.setAttribute('type','button');
  startBtn.setAttribute('value','Start many Fleets');
  startBtn.setAttribute('title','Create number of fleets specified by Fleet template');
  startBtn.addEventListener('click', templateFleets, false);
  col3.appendChild(startBtn);
  row1.appendChild(col3);

  var col4 = document.createElement('td');
  col4.setAttribute('class', 'padding5 highlight tbborder');
  col4.setAttribute('align', 'center');
  col4.innerHTML = '<small>(see tooltips for help)</small>'
  col4.setAttribute('title','See tooltips for help');
  row1.appendChild(col4);

  insertAfter(row1, createBtn.parentNode.parentNode);
}


onMultiInit();
