// ==UserScript==
// @name                WME Color Highlights City
// @namespace           http://userscripts.org/users/419370
// @description         Adds colours to road segments to show their status
// @include             https://*.waze.com/editor*
// @include             https://*.waze.com/*/editor*
// @version             2.0.0.5
// @grant               GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/2515/WME%20Color%20Highlights%20City.user.js
// @updateURL https://update.greasyfork.org/scripts/2515/WME%20Color%20Highlights%20City.meta.js
// ==/UserScript==

/* == meine City-Erweiterung ================================================= */


var aNurl;
var aNstatus;
var aNcnt = 100;

var testGM_TM;
var getURL;
var isCRX = false;
var new_version;
var ldr_version = "2.0.0.5";

var hilici = new Object();
hilici.CityKnown = new Array();
hilici.CityUnknown = new Array();
hilici.CityInProgress = new Array();
hilici.CityUnknown = [];
hilici.CityKnown = [];
hilici.CityInProgress = [];
hilici.ldr = ldr_version;

var _HiLiCi = document.createElement('script');


function _aNchecksCity() {
  var cityName = "";
  var countryName = "";
  var countryName2 = [];
  var hStr = "";
  var status = 0;
  var i;

  unsafeWindow.hilici.ldr = ldr_version;
  hilici.CityInProgress   = unsafeWindow.hilici.CityInProgress;
  hilici.CityKnown        = unsafeWindow.hilici.CityKnown;
  hilici.CityUnknown      = unsafeWindow.hilici.CityUnknown;
  console_log(2, "HiLiCi: Cities in progress *: " + hilici.CityInProgress.length +
			  " / known : " + hilici.CityKnown.length +
			  " / unknown : " + hilici.CityUnknown.length);

  // Are there any cities?
  if (hilici.CityInProgress.length > 0) {
	var h = hilici.CityInProgress[0].split(",");
	cityName = h[0];
	countryName = h[1];
	countryName2 = countryName.split("_");
	console_log(2, "HiLiCi: found City: " + cityName + " / Country: " + countryName);
	hStr = '"' + cityName + '"';
	//console.log("HiLiCi: aNchecksCity (aN) ?: " + cityName + ", " + countryName);
	// Search on Web
	aNstatus = undefined;
	aNurl = "http://neumeister.bplaced.net/scripts/waze/"+countryName+".txt";
	var ret = GM_xmlhttpRequest({
	  method: "GET",
	  url: aNurl,
	  headers: {
	    "Accept": "text/xml"            // If not specified, browser defaults will be used.
	  },
	  //synchronous: true,
	  //timeout: 500,
	  onerror: function(response) {
	  	console.log("HiLiCi: aNchecksCity (aN): " + cityName +" error :/");
	  	i = hilici.CityInProgress.indexOf(cityName+","+countryName);
	  	console.log("HiLiCi: aNchecksCity (aN): i: " + i);
	  	hilici.CityInProgress.splice((i==-1)?0:i,1);
		status = 500;
	    },
	  onload: function(response) {
	    console.log("HiLiCi:" + hStr + " Position: " + response.responseText.indexOf(hStr) + " Status: " + response.status);
	    i = hilici.CityInProgress.indexOf(cityName+","+countryName);
	    //console.log("HiLiCi: aNchecksCity (aN): i: " + i);
	    unsafeWindow.hilici.CityInProgress.splice((i==-1)?0:i,1);

	    // country is missing
	    if (response.status == 404) {
	  	console.log("HiLiCi: aNchecksCity (aN): Country not found: " + countryName);
	  	// unsafeWindow.hilici.CityKnown.splice(0, 0, cityName+","+countryName);
		status = 404;
	    } else if (response.status != 200) {
	  	console.log("HiLiCi: aNchecksCity (aN): Status: " + response.status);
	  	//alert("HiLiCi: aNchecksCity (aN): Status: " + response.status + " " + countryName);
		status = response.status;
	  	return true;
	    }

		if (status != 404)
		{
		  // Search in all cities
		  if (response.responseText.indexOf(hStr) >= 0) {
		    if (unsafeWindow.hilici.CityKnown.indexOf(cityName+","+countryName) == -1) {
		  	  unsafeWindow.hilici.CityKnown.splice(0, 0, cityName+","+countryName); // City found
		    }
		    console.log("HiLiCi: aNchecksCity (aN): " + cityName + " found in " + countryName + " :)");
		    return true;
		  } else {
		    if (-1 == unsafeWindow.hilici.CityUnknown.indexOf(cityName+","+countryName)) {
		  	if (unsafeWindow.hilici.CityUnknown.indexOf(cityName+","+countryName) == -1) {
		  	  alert("Unknown City: " + cityName + " (" + countryName + ")");
		  	  unsafeWindow.hilici.CityUnknown.splice(0, 0, cityName+","+countryName); // Unknown City
		  	}
		  	console.log("HiLiCi: aNchecksCity (aN): " + cityName +" not found :(");
		    }
		    return false;
		  }
		}
		else
		{
		  return true;
		}
	  }
	});

	// der 2. Versuch ohne State im Country-Namen. ;-)
	aNstatus = undefined;
	aNurl  = "http://neumeister.bplaced.net/scripts/waze/"+countryName2[0]+".txt";
	ret = GM_xmlhttpRequest({
	  method: "GET",
	  url: aNurl,
	  headers: {
	    "Accept": "text/xml"            // If not specified, browser defaults will be used.
	  },
	  //synchronous: true,
	  //timeout: 500,
	  onerror: function(response) {
	  	console.log("HiLiCi: aNchecksCity (aN): " + cityName +" error :/");
	  	i = hilici.CityInProgress.indexOf(cityName+","+countryName);
	  	console.log("HiLiCi: aNchecksCity (aN): i: " + i);
	  	hilici.CityInProgress.splice((i==-1)?0:i,1);
		status = 500;
	    },
	  onload: function(response) {
	    console.log("HiLiCi:" + hStr + " Position: " + response.responseText.indexOf(hStr) + " Status: " + response.status);
	    i = hilici.CityInProgress.indexOf(cityName+","+countryName);
	    //console.log("HiLiCi: aNchecksCity (aN): i: " + i);
	    //unsafeWindow.hilici.CityInProgress.splice((i==-1)?0:i,1);

	    // country is missing
	    if (response.status == 404) {
	  	console.log("HiLiCi: aNchecksCity (aN): Country not found: " + countryName);
		if (unsafeWindow.hilici.CityKnown.indexOf(cityName+","+countryName) == -1) {
		  unsafeWindow.hilici.CityKnown.splice(0, 0, cityName+","+countryName); // City found
		}
	  	nsafeWindow.hilici.CityKnown.splice(0, 0, cityName+","+countryName);
		status = 404;
	  	return true;
	    }
	    if (response.status != 200) {
	  	console.log("HiLiCi: aNchecksCity (aN): Status: " + response.status);
		status = response.status;
	  	return true;
	    }

		// Search in all cities
		if (response.responseText.indexOf(hStr) >= 0) {
		  if ((x=unsafeWindow.hilici.CityKnown.indexOf(cityName+","+countryName)) == -1) {
			unsafeWindow.hilici.CityKnown.splice(0, 0, cityName+","+countryName); // City found
		  }
		  console.log("HiLiCi: aNchecksCity (aN): " + cityName +" found in " + countryName2[0] + " :)");
		  return true;
		} else {
		  if (-1 == unsafeWindow.hilici.CityUnknown.indexOf(cityName+","+countryName)) {
			if (unsafeWindow.hilici.CityUnknown.indexOf(cityName+","+countryName) == -1) {
			  alert("Unknown City: " + cityName + " (" + countryName + ")");
			  unsafeWindow.hilici.CityUnknown.splice(0, 0, cityName+","+countryName); // Unknown City
			}
			console.log("HiLiCi: aNchecksCity (aN): " + cityName +" not found :(");
		  }
		  return false;
		}
	  }
	});
  }
  return true;
}

function setNew() {
  new_version = "";
  var ret = GM_xmlhttpRequest({
    method: "GET",
    url: "http://neumeister.bplaced.net/scripts/waze/version.txt",
    headers: {
	  "Accept": "text/xml"            // If not specified, browser defaults will be used.
    },
	onerror: function(response) {
	  alert("\'versionb.txt\' not found");
	},
    onload: function(response) {
	  new_version= response.responseText;
	  unsafeWindow.hilici.new = new_version;
	}
  });
  unsafeWindow.hilici.new = new_version;
  unsafeWindow.hilici.ldr = ldr_version;
}

function init_script() {
  var ret = GM_xmlhttpRequest({
    method: "GET",
    url: "http://neumeister.bplaced.net/scripts/waze/hilici2.user.js",
    headers: {
	  "Accept": "text/xml"            // If not specified, browser defaults will be used.
    },
	onerror: function(response) {
	  alert("\'HiLiCi\' not loaded");
	},
    onload: function(response) {
	  _HiLiCi.text = response.responseText;
	  _HiLiCi.type = 'text/javascript';
	  _HiLiCi.async = false;
	  _HiLiCi.onload = function() {
        };
	  document.head.appendChild(_HiLiCi);

	  unsafeWindow.hilici.new = new_version;
	}
  });
}

window.setInterval(_aNchecksCity, 1601);
window.setTimeout(setNew, 800);
init_script();
