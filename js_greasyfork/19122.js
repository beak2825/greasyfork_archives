// ==UserScript==
// @name                WME Google POI verifier
// @name:cs             WME Kontrola Google POI
// @version             1.51
// @description         Verify Waze landmarks linked to Google POI
// @description:cs      Kontroluje landmarky ve Waze nalinkované na Google POI
// @author              Kebb01
// @include	            https://www.waze.com/editor/*
// @include	            https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @include             https://beta.waze.com/*/editor/*
// @namespace           https://greasyfork.org/cs/scripts/19122-wme-google-poi-verifier
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/19122/WME%20Google%20POI%20verifier.user.js
// @updateURL https://update.greasyfork.org/scripts/19122/WME%20Google%20POI%20verifier.meta.js
// ==/UserScript==

function gpoi_bootstrap()
{
	var bGreasemonkeyServiceDefined = false;

	try
	{
		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)
		{
			bGreasemonkeyServiceDefined = true;
		}
	}
	catch (err)
	{
		//Ignore.
	}
	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined)
	{
		unsafeWindow = ( function ()
						{
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute ('onclick', 'return window;');
			return dummyElem.onclick ();
		} ) ();
	}
	/* begin running the code! */
	console.log("GPOI: GPOI bootstrap init");
	coolscript_init();
}

// =========
function coolscript_init()
{
	function gpoiFunc(){
		function readTextFile(file, callback) {
			var rawFile = new XMLHttpRequest();
			rawFile.overrideMimeType("text/plain");
			rawFile.open("GET", file, true);
			rawFile.onreadystatechange = function() {
				if (rawFile.readyState === 4 && rawFile.status == "200") {
					callback(rawFile.responseText);
				}
			};
			rawFile.send(null);
		}
		setInterval(function(){ gpoiRun(); }, 3000);

		function gpoiRun() {

			var gLoop = 0;
			var gUrlArray = [];
			var gCodeArray = [];
			var gpoiDataArray = [];
			var gLinkArray = [];
			var hostName = window.location.hostname;
			var neKat = ["FOREST_GROVE", "RIVER_STREAM"];
			var neKatCount = neKat.length;

			var missingGPOI = " MISSING LINKED GOOGLE MAP POI ";
			console.log("missingGPOI = " + missingGPOI);

			function GPOICreateElement () {
				var element = document.createElement("div");
				element.style.color = '#FF0000';
				element.style.fontWeight = "bold";
				element.appendChild(document.createTextNode(missingGPOI));
				var missingGPOIs = document.getElementsByClassName("form-group")[12].appendChild(element);
			}

			var gpoiCount = document.getElementsByClassName("select2-chosen");
			gpoiCount = gpoiCount.length;

			var jeTamText = document.getElementsByClassName("form-group")[12].innerText;

			var place = W.selectionManager.selectedItems[0].model;
			var kat = W.selectionManager.selectedItems[0].model.attributes.categories;
			console.log("neKat = " + neKat + ", kat = " + kat);

			// tu jsem skončil
			if (place.type === "venue") {
				if (kat != "FOREST_GROVE" || kat != "RIVER_STREAM") {
					if (jeTamText.includes("LINKED")) {
					} else {

						if (gpoiCount === 0) {
							GPOICreateElement();
						}
					}
				}
			}



			for (i = 0; i < gpoiCount; i++) {
				var gCode = document.getElementsByClassName("placeId")[i].innerHTML;
				gCodeArray.push(gCode); // kódy WME
			}

			for (x = 0; x < gpoiCount; x++) {
				var gpoiData = "https://" + hostName + "/maps/api/place/details/json?placeid=" + gCodeArray[x] + "&key=AIzaSyBIfV0EMXrTDjrvD92QX5bBiyFmBbT-W8E";
				gpoiDataArray.push(gpoiData); /// linky k json datům
			}

			for (y = 0; y < gpoiCount; y++) {
				readTextFile(gpoiDataArray[y], function(text){
					var data = JSON.parse(text);
					console.log("gpoiData = " + gpoiData);
					var url = data.result.url;
					gUrlArray.push(url);

					for (y1 = 0; y1 < gpoiCount; y1++) {
						// var gLink = '<a href = "' + gUrlArray[y1] + '" target = "_blank">' + gCodeArray[y1] + '</a>';
						var gLink = '<a href = "' + gUrlArray[y1] + '" target = "_blank">' + "» GoogleMap POI #" + [y1+1] + '</a>';
						gLinkArray.push(gLink);
					}
					if (gpoiCount == 1) {
						for (z = 0; z < gpoiCount; z++) {
							document.getElementsByClassName("placeId")[z].innerHTML = gLinkArray[z];
						}
					}
					if (gpoiCount > 1) {
						for (z = gpoiCount; z < gpoiCount+gpoiCount; z++) {
							document.getElementsByClassName("placeId")[z-gpoiCount].innerHTML = gLinkArray[z];
						}
					}
				});
			}
		}
	}
	gpoiFunc();
}

// then at the end of your script, call the bootstrap to get things started
gpoi_bootstrap();