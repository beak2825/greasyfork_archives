// ==UserScript==
// @name         findthisplace checker
// @namespace    findthisplace
// @version      1.013
// @description  Check errors in coordinates
// @author       Anton
// @match        https://findthisplace.org/?maprange=*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382973/findthisplace%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/382973/findthisplace%20checker.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var $ = jQuery;
	
	var test = function() {
        var $scripts = $('script');
		var result = [];
        for (var x = 0; x < $scripts.length; x++) {
            var txt = $scripts[x].text;
            var idxInfo = txt.indexOf("var infowindows = [");
            if (idxInfo !== -1) {
                var idxLoc = txt.indexOf("];\n      var locations = [");
                var infoTxt = txt.substr(idxInfo, idxLoc - idxInfo + 1);
                window.eval(infoTxt); // infowindows
				if (typeof infowindows === 'undefined') {
					console.log('ERROR: eval in infowindows');
					return [];
				}
                
                idxLoc = txt.indexOf("var locations = [");
                var idxLocEnd = txt.indexOf("]", idxLoc);
                var locText = txt.substr(idxLoc, idxLocEnd);
                locText = locText.replace("{lat: , lng: }", "{lat: 666, lng: 666}");
                locText = locText.replace("lng: }", "lng: 666}");
                locText = locText.replace("{lat: ,", "{lat: 666,");
                window.eval(locText); // locations
				if (typeof locations === 'undefined') {
					console.log('ERROR: eval in locations');
					return [];
				}
                
                if (infowindows.length == locations.length) {
                    for (var i = 0; i < locations.length; i++) {
                        if (locations[i].lat == 0 || locations[i].lng == 0 || locations[i].lat == 666 || locations[i].lng == 666) {
                            result.push({info: infowindows[i], coord: locations[i]});
                        }
                    }
                } else {
                    console.log("info:", infowindows.length, "locations", locations.length);
                }
            }
        }
		return result;
	}
	
	var panel = function() {
		$('body').prepend($('<div id="checkererrors" style="display:none;z-index:2;position:fixed;left:2vw;top:2vh;width:96vw;height:96vh;background:azure;border:1px solid;overflow: auto;"></div>'));
		$('ul.nav.navbar-nav').append('<li><a href="#" onclick="findthisplaceShow()">Errors?</a></li>');
	}
	
	var showPanel = function() {
		info();
		$("#checkererrors").show();
	}
	
	var info = function() {
		var results = test();
		if (results.length > 0) {
			var $panel = $("#checkererrors");
			var errorLines = [];
			for (var i in results) {
				$panel.append('<div style="display:block;width:300px;height:300px;float:left;margin:10px;">' + results[i].info + "</div>");
				errorLines.push("[Lat: " + results[i].coord.lat + ", Lng: " + results[i].coord.lng + "] : " + $(results[i].info).find('a').attr('href'));
			}
			console.log('ERRORS:');
			console.log(errorLines);
		}
	}
	
	if (typeof unsafeWindow !== 'undefined') {
		unsafeWindow.findthisplaceInfo = info;
		unsafeWindow.findthisplaceShow = showPanel;
    }

	$(document).ready(function(){
		panel();
	});
})();