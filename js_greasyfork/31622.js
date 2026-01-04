// ==UserScript==
// @name         autoFillTac
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world! FY
// @author       Kriz
// @copyright    2017+ krzysztof4IT
// @match        https://tac.trecom.pl/mcd-serwis/*
// @require 	 https://code.jquery.com/jquery-1.12.4.js
// @require 	 https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31622/autoFillTac.user.js
// @updateURL https://update.greasyfork.org/scripts/31622/autoFillTac.meta.js
// ==/UserScript==
jQuery(function($) { 
	// database
	$( function() {
	    var availableTags = [
		  "COD: nie wyświetlają się zamówienia",
		  "COD: brak obrazu",
	      "CFM: Brak aktualizacji w SMS. Data: ",
	      "CFM: brak PP w SMS",
	      "RFM: Brak aktualizacji. Data: ",
	      "SMS: błędne hasło lub id konta",
	      "SMS: zawieszony program",
	      "SMS: General Waystation Error",
	      "SMS: Nie można zainicjować aktualizacji",
		  "SMS: nie odpowiada podczas logowania ",
		  "MyStore: Brak danych w raporcie - ",
		  "Brak płatności IKO w restauracji",
	      "Presenter: brak obrazu",
		  "Presenter: brak dotyku",
	      "Mini-ORB : brak obrazu",
		  "Mini-ORB : brak dotyku",
	      "Brak miejsca na dysku Backoffice",
		  "Ogólny błąd podczas otwarcia POS",
	      "Krytyczny błąd drukarki na kasie ",
	      "Zawieszony kiosk ",
	      "Zawieszone zamówienia na MFY",
		  "Tapety lunchowe na kioskach",
		  "Tapety śniadaniowe na kioskach",
	      "Query Timeout Expired przy wczytywaniu paragonu",
		  "POS is Closed na kasie ",
		  "MyStore jeszcze nie gotowy: Background Service nie jest dostępny",
		  "Nie działa strona internetowa: strefa McD",
		  "Błąd Windows Delay na ",
		  "Rozkalibrowana kasa ",
		  "Brak kasetek w SMS",
		  "Nie działa czytnik kodów przy mni-ORB",
		  "Kioski restartują się po nabiciu kuponu",
		  "Produkcja Offline ",
		  "SMS: Błędna procedura procedura, program nie możne być wykonany",
		  "Zablokowane konto ",
		  "POS is Offline ",
		  "Wyłączony VXL",
		  "Nie można zalogować kiosku ",
		  "Nieprawidłowa cena sałatki na kasach 3,80 a powinno by 4,00",
		  "Nieaktualne hasło na wyświetlacz ",
		  "RFM: Nieprawidłowa nazwa na produktów na monitorze ",
		  "Na kioskach dostępna jest opcja personalizacji BigMac ",
		  "Zablokowane konto staff ",
		  "Zamienione monitory BEV ",
		  "Signa: Nie można wystawić korekty - istnieje co najmniej jedna kopia robocza ",
		  "Nieaktualne tapety na kioskach ",
		  "Zamknięcie POS: Nie zaleziono żadnych paczek dla restauracji ",
		  "Zablokowane konto wAmenu",
		  "Zawieszone urządzenia w rest.",
		  "Nie uruchamia się ",
		  "Błąd transmisji w WebLogu  ",
		  "No connection Waystayion podczas otwarcia POS ",
		  "Zablokowana kasa 6 - produkt jest nieaktywny ",
		  "Signa: Połączenie z bazą SQL nie zostało nawiązane"
		  
	    ];
	    $("#title").autocomplete({
	    	source: availableTags
	    });

	});
});