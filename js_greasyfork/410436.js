// ==UserScript==
// @name         DAB (Smartbroker) Refresh Timeout
// @version      1.2
// @description  Dieses Script verhindert den automatischen Logout im DAB (Smartbroker) Tradingcenter für x Minuten
//               ACHTUNG! Dadurch wird eine wichtige Sicherheitsfunktion ausgehebelt!!!!
//
//                             Ich übernehme
//               K E I N E R L E I     V E R A N T W O R T U N G
//                  für eventuelle Schäden jeglicher Art!!!!
//
// @author       Kratzerchen
// @include      https://b2b.dab-bank.de/Tradingcenter/*
// @include      https://b2b.dab-bank.de/smartbroker/*
// @grant        none
// @namespace https://greasyfork.org/users/684354
// @downloadURL https://update.greasyfork.org/scripts/410436/DAB%20%28Smartbroker%29%20Refresh%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/410436/DAB%20%28Smartbroker%29%20Refresh%20Timeout.meta.js
// ==/UserScript==

// Tabulatorbreite auf 4 stellen!

(function() {
	'use strict';

	var maxLoginTime	= 240;																				// Hier kann die maximale Loginzeit in Minuten festgelegt werden. Reset benötigt echten Seitenrefresh!
	var cdLimitMax		= 120;																				// Oberer Grenzwert in Sekunden. Frühstmöglicher Zeitpunkt zum Rücksetzten des 5 Minuten Timers
	var cdLimitMin		= 35;																				// Unterer Grenzwert in Sekunden. Minimalste erlaubte Restzeit des 5 Minuten Timers
	var logState		= false;																			// Hier kann die Textausgabe im Konsolenfenster aktiviert werden (true / false)var
	var cdLimit;																							// Zufällig ermittelter Wert zwischen [cdLimitMax] und [cdLimitMin].
																											// Unterschreitet der "5 Minuten Logout Countdown" diesen Wert wird dieser zurückgesetzt und ein neuer Zufallswert generiert.
																											// Durch die Verwendung von zufälligen Werten soll ein "natürlich" wirkendes Verhalten simuliert werden
	var checkInterval;																						// Variable zu speichern der Intervall ID. Wird benötigt um auf den gesetzten Intervall zugreifen zu können um ihn z.B zu löschen.
	var starttime = Date.now();																				// Die aktuelle Uhrzeit. Wird für die Überwachung der maximalen Loginzeit [maxLoginTime] benötigt
	var htmlElement = document.querySelector(".sessionTimer-countdown");									// In der Variable [htmlElement] wird der Knoten des HTML Elements, welches den 5 Minuten Timers enthält gespeichert

	maxLoginTime *= 60000;																					// [maxLoginTime] von Minuten in Millisekunden umrechnen
	if (htmlElement){																						// Wenn das HTML Element mit dem 5 Minuten Countdown existiert...  (Gibt es nicht auf jeder Seite! Z.B. Login/Logout Seite)
		var patchtDiv = document.createElement("div");														// Erzeuge ein neues Element und formatiere es mit den folgenden Styles
		patchtDiv.style.position ='absolute';
		patchtDiv.style.bottom = '0px';
		patchtDiv.style.right = '0px';
		patchtDiv.style.top = '0px';
		patchtDiv.style.left = '0px';
		patchtDiv.style.padding = '19px';
        patchtDiv.style.borderStyle = 'inherit inherit';
        patchtDiv.style.borderRadius = 'inherit';
		patchtDiv.style.textAlign = 'center';
		patchtDiv.style.zIndex = '1';
		patchtDiv.style.background = 'white';
		patchtDiv.style.fontSize = '20px';
		patchtDiv.innerHTML = 'Logout in <b id="newCD">00:00:00</b>';

		document.getElementById('sessionTimer').appendChild(patchtDiv);										// Füge dem HTML Element auf der Seite mit der ID 'sessionTimer' unser oben definieres Element als neues letztes Kindelement hinzu.
																											// Dieses 'übermalt' den originalen 5 Minuten Logout Timer.
		var newCD = document.getElementById('newCD');														// Speichere den HTML Knoten von unserem neuen <b>mm:ss</b> Tag um direkt auf die Timeranzeige zugreifen zu können
		var newCdInterval = setInterval(updateCD, 1000);													// Starte einen 1 Sekunden Intervall um den neuen Countdownzähler zu aktualisieren (Funktion 'updateCD')
		setValues();																						// führe die Funktion 'setValues()' aus.
	}																										// ansonsten mache nichts...  (if htmlElement)

	function setValues(){																					// Funktion 'setValues()' wird nach jedem Sart des Skripts sowie nach jedem Rücksetzen des 5 Minuten Countdowns ausgeführt
		cdLimit = Math.floor(Math.random() * (cdLimitMax - cdLimitMin + 1)) + cdLimitMin;					// Ermitteln der Zufallszahl zwischen [cdLimitMax] und [cdLimitMin]
		var checkIntervalMillis = Math.floor(Math.random() * 4000 + 1001);
        checkInterval = setInterval(checkOriginalTimer, checkIntervalMillis);								// Initialisieren und starten des Intervalls zum überpüfen des originalen 5 Minuten Logout Countdowns. (Funktion 'checkOriginalTimer')
																											// Wiederholrate ist zufällig zwischen 1000 und 5000 Millisekunden (damit nicht immer zur vollen Sekunde geklickt wird)
		if (logState){																						// Textausgabe in der Konsole wenn [logState] = true
			console.log("'checkInterval' Frequenz: ", checkIntervalMillis, "MilliSekunden");
			console.log("Countdown Limit: ", cdLimit, "Sekunden");
		}
	}																										// Ende der Funktion 'setValues()'

	function updateCD(){																					// Funktion zum akualieren des von uns eingefügten Logout Timers. Bei Ablauf erfolgt Logout!
		var millisPassed = Date.now() - starttime;															// vergangene Millisekunden seit Skriptstart
		var cdValue = maxLoginTime - millisPassed;															// Und deren Differenz zu [maxLoginTime]. [cdValue] ist somit die Restzeit
		newCD.innerHTML = leadingZero(cdValue/1000/60/60) + ":" + leadingZero((cdValue/1000/60)%60) + ":" + leadingZero(cdValue/1000%60);
																											// Die Resetzeit in Textformat 'hh:mm:ss' (mit führender Null wenn einstellig) umwandeln und die Coutdown-Anzeige aktualisieren
		if (cdValue <=0){																					// Wenn Maximale Loginzeit überschritten ([cdValue] ist 0 oder negativ)
			clearInterval(newCdInterval);																	// Lösche den 1 Sekunden Intervall
			clearInterval(checkInterval)																	// Lösche den Interval zum Resetten des originalen 5 Minuten Logout CD
			document.getElementById('login').firstElementChild.click();										// Dann klicke auf den Logout Link. Dieser ist das erste Kindelemet des HTML Elemets mit der ID 'Login'.
		}
	}

	function checkOriginalTimer(){																			// Die Funktion 'checkSessionTimerUpdate()' wird durch den in 'setValues()' gestarteten Intervall regelmäsßig ausgeführt

		var text = htmlElement.innerHTML;																	// Der Inhalt des HTML Elements, welches den Wert des "5 Minuten Logout Countdowns" enhält wird ausgelesen
		text.trim();																						// eventuelle Leerzeichen am Beginn und Ende des Textes werden abgeschnitten.
		if (text.length == 4){																				// Wenn der Text 4 Zeichen hat. (z.B: '1:35' {Minuten einstellig - Doppelpunkt - Sekunden zweistellig} sind 4 Zeichen.) Die Angabe '> 4 Minuten' wird somit ignoriert.
			var seconds = Number(text.slice(-2)) + Number(text.charAt(0)) * 60;								// Der Text wird in Sekunden umgewandelt (Die Sekunden aus den letzten beiden Zeichen addiert mit den Minuten * 60 aus Zeichen 1)
			if (logState){																					// Textausgabe in der Konsole wenn [logState] = true
				console.log("Restzeit original Contdown: ", seconds, "Sekunden. Limit bei " + cdLimit + " Sekunden.");
			}
			if (seconds < cdLimit){																			// Wenn die ausgelesene Restzeit in Sekunden des "5 Minuten Logout Countdowns" den in [cdLimit] gespeicherten Wert untersreitet....
				if (logState){																				// Textausgabe in der Konsole wenn [logState] = true
					console.log("Original Contdown ("+ seconds + ") kleiner als cdLimit (" + cdLimit +")  --> RESET");
				}
				clearInterval(checkInterval);																// Der Intervall, welcher in der Funktion  'setValues()' gestartet wurde, wird gelöscht.
				document.querySelector(".sessionTimer-refresh").click();									// Das '.click()' Event wird ausgelöst. Ziel ist der Refresh Button
				setValues();																				// ...dann starte die Funktion 'setValues()' und das Spiel beginnt von vorn ;-)
			}
		}
	}

	function leadingZero(value){																			// Funktion um einstelligen Zahlenwerten eine führende '0' zu verpassen
		return (value < 10 ? '0' : '' ) + parseInt(value);													// Rückgabe als Text und mit führender 0 falls [value] kleiner 10
	}
})();