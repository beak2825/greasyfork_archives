// ==UserScript==
// @name         Internetwache Polizei Berlin
// @namespace    HpREhpM90rayQjUWLzE_9YDQ37Zf3aJGsyoGogys
// @version      1.3
// @description  Unterstützt beim Ausfüllen der Formulare der Internetwache der Polizei Berlin im Pfad "Anzeige anderer Art". Die zusätzlichen Buttons werden im blauen Bereich rechts angeboten und sind hoffentlich selbsterklärend. Features: Schnelle Bearbeitung des Datums, Eingabe der Uhrzeit, Speicherung von Orten und persönlichen Daten, damit man sie nicht jedesmal neu eingeben muss. Benutzung ohne jede Gewähr.
// @author       Andreas Hoffmann
// @match        https://www.internetwache-polizei-berlin.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/371481/Internetwache%20Polizei%20Berlin.user.js
// @updateURL https://update.greasyfork.org/scripts/371481/Internetwache%20Polizei%20Berlin.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var $ = window.$;
	$(function () {
		switch (location.pathname) {
			case "/index_start.html":
            case "/index_back.html":
				var btnOther = $("<button>Anzeige anderer Art</button>");
				$("#polizei_rightbox").empty().append(btnOther);
				btnOther.click(function () {
					var btn = $(":contains('eine Anzeige erstatten / einen Nachtrag senden')");
					if (btn.length === 0) {
						alert("Button nicht gefunden.");
					} else {
						GM_setValue("nextAction", "AnzeigeAndererArt");
						btn.click();
					}
				});
				break;
			case "/index_1.html":
				var action = GM_getValue("nextAction");
				GM_deleteValue("nextAction");
				switch (action) {
					case "AnzeigeAndererArt":
						var btn = $(":contains('Anzeigen anderer Art')");
						if (btn.length === 0) {
							alert("Button nicht gefunden");
						} else {
							btn.click();
						}
						break;
				}
				break;
			case "/index_15.html":
				window.setInterval(checkDiv, 100);
				break;
			case "/index_pruefen.html":
				var text = $("p:contains('Unter der Vorgangsnummer')").children("span").text();
				GM_setClipboard(text);
				console.log("Copied to clipboard: " + text);
				break;
		}
	});
	var currentDiv = null;
	var divs = ["d_1", "d_15000", "d_15001", "d_100", "d_101", "d_1000"];
	var locations = GM_getValue("locations");
	if (locations == null) {
		locations = [];
	}
	var actionContainer = null;
	var locationButtonsContainer;
	function checkDiv() {
		var divNow = null;
		for (var i = 0; i < divs.length; i++) {
			if ($("#" + divs[i]).css("display") === "block") {
				divNow = divs[i];
			}
		}
		if (divNow !== currentDiv) {
			currentDiv = divNow;
			switch (divNow) {
				case "d_1":
					initActionContainer();
					if (GM_getValue("d_1-ConfirmAutomatically")) {
						$("#zustimmung").prop("checked", true);
						$("#weiterButton_1").click();
					} else {
                        var btnAutoConfirm = $("<button>Immer bestätigen</button>");
                        actionContainer.append(btnAutoConfirm.click(function () {
                            if (confirm("Damit werden Kenntnisnahme und Zustimmung immer automatisch erteilt. Möchtest Du das wirklich?")) {
                                btnAutoConfirm.prop("disabled", true);
                                GM_setValue("d_1-ConfirmAutomatically", true);
                            }
                        }));
                        actionContainer.append($("<button>Zustimmen und weiter</button>").click(function () {
                            $("#zustimmung").prop("checked", true);
                            $("#weiterButton_1").click();
                        }));
                    }
					break;
				case "d_15000":
					initActionContainer();
					$("#f_1501").val(toGermanDate(new Date()));
					$("#f_1503").val(toGermanDate(new Date()));
					actionContainer.append($("<button>D-</button>").click(editDate.bind(null, -1)));
					actionContainer.append($("<button>D+</button>").click(editDate.bind(null, +1)));
					actionContainer.append("<br />");
					actionContainer.append($("<button>Uhrzeit</button>").click(function () {
						$("#f_1502,#f_1504").val(prompt("Wann genau fand der Vorfall statt?", $("#f1502").val()));
					}));
					actionContainer.append("<br />");
					locationButtonsContainer = $("<div></div>");
					actionContainer.append(locationButtonsContainer);
					renderLocationButtons(locations);
					actionContainer.append($("<button>Ort speichern</button>").click(storeLocation));
					actionContainer.append("<br />");
					actionContainer.append($("<button>Weiter</button>").click(function () { $("#weiterButton_15000").click(); }));
					break;
				case "d_15001":
					initActionContainer();
					actionContainer.append($("<button>Weiter</button>").click(function () { $("#weiterButton_15001").click(); }));
					break;
				case "d_100":
					initActionContainer();
					var personalDetails = GM_getValue("personalDetails");
					if (personalDetails != null) {
						$("#f_1_s").val(personalDetails.gender);
						$("#f_3").val(personalDetails.forename);
						$("#f_2").val(personalDetails.surname);
						$("#f_4").val(personalDetails.dateOfBirth);
						$("#f_5").val(personalDetails.locationOfBirth);
						$("#f_6_s").val(personalDetails.nationality);
						$("#f_7").val(personalDetails.street);
						$("#f_8").val(personalDetails.number);
						$("#f_9").val(personalDetails.postalCode);
						$("#f_10").val(personalDetails.city);
						$("#f_11_s").val(personalDetails.country);
					}
					actionContainer.append($("<button>Weiter</button>").click(function () {
						storePersonalDetails();
						$("#weiterButton_100").click();
					}));
					$("#weiterButton_100").click(function () { storePersonalDetails(); });
					break;
				case "d_101":
					initActionContainer();
					var contactInfo = GM_getValue("contactInfo");
					if (contactInfo != null) {
						$("#f_12").val(contactInfo.landline);
						$("#f_13").val(contactInfo.mobile);
						$("#f_14").val(contactInfo.mail);
					}
					actionContainer.append($("<button>Weiter</button>").click(function () {
						storeContactInfo();
						$("#weiterButton_101").click();
					}));
					$("#weiterButton_101").click(function () { storeContactInfo(); });
					break;
				case "d_1000":
					initActionContainer();
					actionContainer.append($("<button>Absenden</button>").click(function () { $("#absendenButton").click(); }));
					break;
			}
		}
		function renderLocationButtons(locations) {
			locationButtonsContainer.empty();
			for (var i = 0; i < locations.length; i++) {
				var location = locations[i];
				locationButtonsContainer.append($("<button>" + location.name + "</button>").click(fillLocation.bind(null, location)));
				locationButtonsContainer.append("&nbsp;");
				locationButtonsContainer.append($("<button>X</button>").click(deleteLocation.bind(null, location)));
				locationButtonsContainer.append("<br />");
			}
		}
		function fillLocation(location) {
			$("#f_1505").val(location.street);
			$("#f_1506").val(location.number);
			$("#f_1507").val(location.postalCode);
			$("#f_1508").val(location.location);
			$("#f_1509_s").val(location.country);
			$("#f_1510").val(location.locationDetails);
			$("#f_1517_s").val(location.locationType);
		}
		function deleteLocation(location) {
			locations = locations.filter(function (l) { return l !== location; });
			GM_setValue("locations", locations);
			renderLocationButtons(locations);
		}
		function storeLocation() {
			var name = window.prompt("Bitte gib einen Namen für den Ort an", "");
			if (name != null && name.trim() !== "") {
				var location = {
					name: name,
					street: $("#f_1505").val(),
					number: $("#f_1506").val(),
					postalCode: $("#f_1507").val(),
					location: $("#f_1508").val(),
					locationDetails: $("#f_1510").val(),
					country: $("#f_1509_s").val(),
					locationType: $("#f_1517_s").val()
				};
				locations.push(location);
				locations.sort(function (a, b) { return a.name.toUpperCase().localeCompare(b.name.toUpperCase()); });
				GM_setValue("locations", locations);
				renderLocationButtons(locations);
			}
		}
		function storePersonalDetails() {
			GM_setValue("personalDetails", {
				gender: $("#f_1_s").val(),
				forename: $("#f_3").val(),
				surname: $("#f_2").val(),
				dateOfBirth: $("#f_4").val(),
				locationOfBirth: $("#f_5").val(),
				nationality: $("#f_6_s").val(),
				street: $("#f_7").val(),
				number: $("#f_8").val(),
				postalCode: $("#f_9").val(),
				city: $("#f_10").val(),
				country: $("#f_11_s").val()
			});
		}
		function storeContactInfo() {
			GM_setValue("contactInfo", {
				landline: $("#f_12").val(),
				mobile: $("#f_13").val(),
				mail: $("#f_14").val()
			});
		}
		function editDate(increment) {
			var s = $("#f_1501").val();
			var d = parseGermanDate(s);
			d.setDate(d.getDate() + increment);
			$("#f_1501").val(toGermanDate(d));
			$("#f_1503").val(toGermanDate(d));
		}
		function initActionContainer() {
			if (actionContainer == null) {
				actionContainer = $("<div></div>");
				$("#polizei_rightbox").prepend(actionContainer);
			}
			actionContainer.empty();
		}

		function toGermanDate(d) {
			return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
		}

		function parseGermanDate(s) {
			return new Date(parseInt(s.substr(6), 10), parseInt(s.substr(3, 2), 10) - 1, parseInt(s.substr(0, 2), 10));
		}
	}
})();