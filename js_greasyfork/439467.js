/*jshint esversion: 8, multistr: true */
/* globals toggleButtonTopPlayerTotalChanged, OLCore, OLSettings, unsafeWindow */

// ==UserScript==
// @name           OLi18n
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.2.2
// @license        LGPLv3
// @description    Onlineliga internationalization
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/439467/OLi18n.user.js
// @updateURL https://update.greasyfork.org/scripts/439467/OLi18n.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 24.01.2022 Release
 * 0.1.1 29.03.2022 change name properties
 * 0.1.2 30.05.2022 lang as parameter for tbtext
 * 0.1.3 03.06.2022 Liveticker translation
 * 0.1.4 25.06.2022 properties for squad export
 *                  new translations
 * 0.1.5 02.07.2022 bugfix translation
 * 0.1.6 13.07.2022 new translations, bugfix properties object
 * 0.1.7 10.08.2022 new translations
 * 0.1.8 29.10.2022 new translations
 * 0.1.9 02.11.2022 new translations
 * 0.1.10 27.03.2023 new translations
 * 0.1.11 23.08.2023 new translations
 * 0.2.0 20.11.2024 OL 2.0
 * 0.2.1 15.12.2024 new translations
 * 0.2.2 19.12.2024 new translations
 ********************************************/
(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;
    const OLi18n = {};

    const bodyLocaleInfo = $("body").eq(0).attr("data-localeinfo");
    const localeInfo = window.olLocaleInfo || ( bodyLocaleInfo ? JSON.parse(bodyLocaleInfo) : {});

    const tmpHost = location.host.split(".");
    OLi18n.topLevelDomain = tmpHost.splice(2).join(".") || "de";
    OLi18n.tld = OLi18n.topLevelDomain.toLowerCase();
    switch(OLi18n.tld){
        case "de":
            OLi18n.lang = "de-DE";
            OLi18n.decimalSeparator = localeInfo.decimalPoint || ",";
            OLi18n.groupSeparator = localeInfo.thousandSep || ".";
            OLi18n.currency = localeInfo.currencySymbolLong || "EUR";
            OLi18n.currencySymbol = localeInfo.currencySymbol || "\u20ac";
            OLi18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 1;
            OLi18n.KnutEdelbertId = 19787;
            OLi18n.loaderImage = `/imgs/loading-${OLi18n.tld}.gif`;
            break;
        case "at":
            OLi18n.lang = "de-AT";
            OLi18n.decimalSeparator = localeInfo.decimalPoint || ",";
            OLi18n.groupSeparator = localeInfo.thousandSep || ".";
            OLi18n.currency = localeInfo.currencySymbolLong || "EUR";
            OLi18n.currencySymbol = localeInfo.currencySymbol || "\u20ac";
            OLi18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 0;
            OLi18n.KnutEdelbertId = 7586;
            OLi18n.loaderImage = `/imgs/loading-${OLi18n.tld}.gif`;
            break;
        case "ch":
            OLi18n.lang = "de-CH";
            OLi18n.decimalSeparator = localeInfo.decimalPoint || ".";
            OLi18n.groupSeparator = localeInfo.thousandSep || ",";
            OLi18n.currency = localeInfo.currencySymbolLong || "CHF";
            OLi18n.currencySymbol = localeInfo.currencySymbol || "CHF";
            OLi18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 1;
            OLi18n.KnutEdelbertId = 8729;
            OLi18n.loaderImage = `/imgs/loading-${OLi18n.tld}.gif`;
            break;
        case "co.uk":
            OLi18n.lang = "en-GB";
            OLi18n.decimalSeparator = localeInfo.decimalPoint || ".";
            OLi18n.groupSeparator = localeInfo.thousandSep || ",";
            OLi18n.currency = localeInfo.currencySymbolLong || "GBP";
            OLi18n.currencySymbol = localeInfo.currencySymbol || "\u00a3";
            OLi18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 1;
            OLi18n.KnutEdelbertId = 32;
            OLi18n.loaderImage = `/imgs/loading-gb.gif`;
            break;
        default:
            OLi18n.lang = "de-DE";
            OLi18n.decimalSeparator = localeInfo.decimalPoint || ",";
            OLi18n.groupSeparator = localeInfo.thousandSep || ".";
            OLi18n.currency = localeInfo.currencySymbolLong || "EUR";
            OLi18n.currencySymbol = localeInfo.currencySymbol || "\u20ac";
            OLi18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 1;
            OLi18n.KnutEdelbertId = 19787;
            OLi18n.loaderImage = `/imgs/loading-${OLi18n.tld}.gif`;
    }
    OLi18n.numberFormat = new Intl.NumberFormat(OLi18n.lang);
    OLi18n.currencyFormat = new Intl.NumberFormat(OLi18n.lang, { style: 'currency', currency: OLi18n.currency });
    OLi18n.shortLang = OLi18n.lang.substr(0,2);

    OLi18n.Dict = {};
    OLi18n.Dict["(Baukosten, Betriebskosten)"] = {'en':'(construction costs, operating costs)'};
    OLi18n.Dict["(G/GR/R)"] = {'en':'(Y/YR/R)'};
    OLi18n.Dict["3-4-3 Dreierkette (offensiv)"] = {'en':'3-4-3 Three-man backfield (offensive)'};
    OLi18n.Dict["3-5-2 Dreierkette, Kompaktes Mittelfeld"] = {'en':'3-5-2 Three-man backfield, compact midfield'};
    OLi18n.Dict["343"] = {'en':'343'};
    OLi18n.Dict["352"] = {'en':'352'};
    OLi18n.Dict["4-1-4-1 Defensiv, Konter"] = {'en':'4-1-4-1 Defensive, Counterattack'};
    OLi18n.Dict["4-1-5-0 Falsche Neun"] = {'en':'4-1-5-0 False Nine'};
    OLi18n.Dict["4-2-3-1 Defensiv, Konter"] = {'en':'4-2-3-1 Defensive, Counterattack'};
    OLi18n.Dict["4-2-3-1 Kontrollierte Offensive"] = {'en':'4-2-3-1 Controlled offense'};
    OLi18n.Dict["4-2-4-0 Falsche Neun"] = {'en':'4-2-4-0 False Nine'};
    OLi18n.Dict["4-3-3 Halb offensiv, Konter"] = {'en':'4-3-3 Half offensive, counter'};
    OLi18n.Dict["4-3-3 Offensiv"] = {'en':'4-3-3 Offensive'};
    OLi18n.Dict["4-4-2 Flach"] = {'en':'4-4-2 Flat'};
    OLi18n.Dict["4-4-2 Flügel"] = {'en':'4-4-2 Wings'};
    OLi18n.Dict["4-4-2 Raute"] = {'en':'4-4-2 Diamond'};
    OLi18n.Dict["4141DK"] = {'en':'4141DK'};
    OLi18n.Dict["4150"] = {'en':'4150'};
    OLi18n.Dict["4231DK"] = {'en':'4231DC'};
    OLi18n.Dict["4231KO"] = {'en':'4231CO'};
    OLi18n.Dict["4240"] = {'en':'4240'};
    OLi18n.Dict["433HO"] = {'en':'433HO'};
    OLi18n.Dict["433O"] = {'en':'433O'};
    OLi18n.Dict["442Fla"] = {'en':'442F'};
    OLi18n.Dict["442Flü"] = {'en':'442W'};
    OLi18n.Dict["442R"] = {'en':'442H'};
    OLi18n.Dict["Abfindung/ Vertragsauflösung"] = {'en':'Severance pay/ Termination of contract'};
    OLi18n.Dict["Ablösesumme"] = {'en': 'Transfer fee'};
    OLi18n.Dict["Ablösesumme Spielertransfer:"] = {'en':'Transfer fee player transfer'};
    OLi18n.Dict["ABPFIFF"] = {'en':'FINAL WHISTLE'};
    OLi18n.Dict["Aktuellen Eintrag löschen"] = {'en':'Delete current entry'};
    OLi18n.Dict["Aktuelles Gehalt"] = {'en': 'Last salary'};
    OLi18n.Dict["Aktuelles Team"] = {'en': 'Current Team'};
    OLi18n.Dict["Alle Einträge löschen"] = {'en':'Delete all entries'};
    OLi18n.Dict["Alle gespeicherten Einstellungen löschen"] = {'en':'Delete all saved settings'};
    OLi18n.Dict["Alle gespeicherten Einstellungen löschen?"] = {'en':'Delete all saved settings?'};
    OLi18n.Dict["Alle Zeilen anzeigen (beendet den Ticker)"] = {'en':'Show all lines (ends the ticker)'};
    OLi18n.Dict["Alt"] = {'en':'Alt'};
    OLi18n.Dict["Alter"] = {'en': 'Age'};
    OLi18n.Dict["Alter Aufstellung"] = {'en': 'Age lineup'};
    OLi18n.Dict["Alter bei Aufstellung anzeigen"] = {'en':'Show age at lineup'};
    OLi18n.Dict["An/Abpiff"] = {'en':'Kick-off/final whistle'};
    OLi18n.Dict["ANPFIFF"] = {'en':'KICK-OFF'};
    OLi18n.Dict["Angebote"] = {'en': 'Offers'};
    OLi18n.Dict["Angebots-ID"] = {'en': 'Offer-ID'};
    OLi18n.Dict["Angebotsdetails in Zwischenablage kopieren&#010;Strg halten für Gebotsdetails&#010;Shift halten für Überschriften"] = {'en':'Copy offer data to clipboard&#010;Hold ctrl for bid details &#010;Hold shift for headline'};
    OLi18n.Dict["Anteil"] = {'en':'Share'};
    OLi18n.Dict["Antrittsprämie"] = {'en':'Inaugural bonus'};
    OLi18n.Dict["Anzahl Teams"] = {'en':'Teams total'};
    OLi18n.Dict["Anzeige der Auslastung bei der Stadionübersicht"] = {'en':'Shows the utilisation of each stadium part in the overview'};
    OLi18n.Dict["Anzeige der geschätzten Dispo-Zuteilung zur nächsten Sommerpause"] = {'en':'Shows the estimated overdraft credit of the next summer break'};
    OLi18n.Dict["Anzeige des Spielerstatus ([L][F]) bei mobiler Aufstellungsansicht"] = {'en':'Shows playerstate ([L][F]) on mobile lineup view'};
    OLi18n.Dict["Aufstellung"] = {'en': 'Lineup'};
    OLi18n.Dict["Athletik"] = {'en':'Athleticism'};
    OLi18n.Dict["Attribute"] = {'en':'Attribute'};
    OLi18n.Dict["Attributreihenfolge kommasepariert"] = {'en':'Order of attributes (comma separated)'};
    OLi18n.Dict["Attributreihenfolge"] = {'en':'Order of attributes'};
    OLi18n.Dict["Aufstiegsprämie"] = {'en':'Promotion bonus'};
    OLi18n.Dict["Auswahl"] = {'en':'Selection'};
    OLi18n.Dict["Auswahl neu laden"] = {'en':'Reload selection'};
    OLi18n.Dict["Auswechslung"] = {'en':'Substitution'};
    OLi18n.Dict["AV"] = {'en':'FB'};
    OLi18n.Dict["Ballbesitz (Gegner)"] = {'en': 'Possession (Opp.)'};
    OLi18n.Dict["Ballbesitz"] = {'en': 'Possession'};
    OLi18n.Dict["BALLBESITZ"] = {'en':'BALL POSSESION'};
    OLi18n.Dict["Beendete Angebote"] = {'en': 'Ended offers'};
    OLi18n.Dict["Beobachtungsliste"] = {'en': 'Watchlist'};
    OLi18n.Dict["Bitte Match-IDs kommasepariert eingeben."] = {'en':'Please enter match-IDs separated by commas'};
    OLi18n.Dict["Bitte User-IDs kommasepariert eingeben."] = {'en':'Please enter user-IDs separated by commas'};
    OLi18n.Dict["Darkmode (experimentell)"] = {'en':'Darkmode (experimentally)'};
    OLi18n.Dict["Darkmode"] = {'en':'Darkmode'};
    OLi18n.Dict["Daten in die Zwischenablage kopieren"] = {'en':'Copy data to clipboard'};
    OLi18n.Dict["Daten in die Zwischenablage kopiert"] = {'en':'Data copied to clipboard'};
    OLi18n.Dict["Deutsch"] = {'en':'German'};
    OLi18n.Dict["Dezimaltrennzeichen (Export)"] = {'en': 'Decimal separator (export)'};
    OLi18n.Dict["Dezimaltrennzeichen für Datenexport"] = {'en': 'Decimal separator for data export'};
    OLi18n.Dict["Die 1. Halbzeit wird präsentiert von"] = {'en':'The 1st half is presented by'};
    OLi18n.Dict["Die erste Linie markiert den Meister und die zweite Linie die Abstiegsplätze."] = {'en':'First line marks the Champion, second line the relegation spots.'};
    OLi18n.Dict["Die erste Linie markiert den Meister und die zweite Linie weitere <b>eventuelle</b> Aufstiegs-/Qualifikationsplätze.<br/>Die tatsächliche Anzahl der Aufstiegs-/Qualifikationsplätze kann abweichen."] = {'en':'First line marks the Champion and the second line <b>possible</b> promotion/qualification spots.<br/> Promotion/qualification spots may vary.'};
    OLi18n.Dict["Die erste Linie markiert den Meister, die zweite Linie einen weiteren <b>eventuellen</b> Aufstiegsplatz und die dritte Linie die Abstiegsplätze.<br/>Die tatsächliche Anzahl der Aufstiegssplätze kann abweichen."] = {'en':'First line marks the Champion, second line <b>possible</b> promotion and the third line the relegation spots. <br/> Promotion spots may vary.'};
    OLi18n.Dict["Die erste Linie markiert den Meister, die zweite Linie einen weiteren Aufstiegsplatz und die dritte Linie die Abstiegsplätze."] = {'en':'First line marks the Champion, second line promotion and the third line the relegation spots.'};
    OLi18n.Dict["Die erste Linie markiert den Meister, die zweite Linie weitere <b>eventuelle</b> Aufstiegs-/Qualifikationsplätze und die dritte Linie die Abstiegsplätze.<br/>Die tatsächliche Anzahl der Aufstiegs-/Qualifikationsplätze kann abweichen."] = {'en':'First line marks the Champion, second line <b>possible</b> promotion/qualification spots and the third line the relegation spots. <br/> Promotion/qualification spots may vary.'};
    OLi18n.Dict["Diff."] = {'en':'Diff.'};
    OLi18n.Dict["Dispo Tipp"] = {'en':'Overdraft guess'};
    OLi18n.Dict["Dispo"] = {'en':'Overdraft'};
    OLi18n.Dict["Dispo-Daten in die Zwischenablage kopieren"] = {'en':'Copy overdraft data to clipboard'};
    OLi18n.Dict["DM"] = {'en':'DM'};
    OLi18n.Dict["Durchschnitt Friendly"] = {'en':'Friendly average'};
    OLi18n.Dict["Durchschnitt Liga"] = {'en':'League average'};
    OLi18n.Dict["Eckball"] = {'en':'Corner'};
    OLi18n.Dict["Eckbälle (Gegner)"] = {'en': 'Corner (Opp.)'};
    OLi18n.Dict["Eckbälle"] = {'en': 'Corner'};
    OLi18n.Dict["ECKBÄLLE"] = {'en':'CORNER KICKS'};
    OLi18n.Dict["Effizienz"] = {'en':'Efficiency'};
    OLi18n.Dict["Eingesetzte Feldspieler (15'+)"] = {'en':'Field players w/ appearance (15\'+)'};
    OLi18n.Dict["Einheitlicher Stadiondaten-Export"] = {'en':'Uniform stadium export'};
    OLi18n.Dict["Einkaufspreis"] = {'en':'Purchase price'};
    OLi18n.Dict["Einnahmen Gesamt"] = {'en':'Total revenue'};
    OLi18n.Dict["Einnahmen"] = {'en':'Income'};
    OLi18n.Dict["Einsatzzeit"] = {'en':'Operating Time'};
    OLi18n.Dict["Einstellungen für den Kaderexport"] = {'en':'Squad export settings'};
    OLi18n.Dict["Einstellungen für den Kaderexport&#010;(Strg/Alt halten für alternative Einstellungen)"] = {'en':'Squad export settings&#010;(hold ctrl/alt for alternative settings)'};
    OLi18n.Dict["Einstellungen"] = {'en':'Settings'};
    OLi18n.Dict["Einstellungen speichern"] = {'en':'Save current settings'};
    OLi18n.Dict["Einwechslung"] = {'en':'In'};
    OLi18n.Dict["EK-Preis"] = {'en':'PP'};
    OLi18n.Dict["ELFMETER FÜR"] = {'en':'PENALTY FOR'};
    OLi18n.Dict["Elfmeter"] = {'en':'Penalty'};
    OLi18n.Dict["Enddatum"] = {'en':'End date'};
    OLi18n.Dict["Englisch"] = {'en':'English'};
    OLi18n.Dict["Erweiterung"] = {'en':'Extension'};
    OLi18n.Dict["Erweiterter Stadiondaten-Export"] = {'en': 'Extended stadium data export'};
    OLi18n.Dict["Export für Kaderbewertung"] = {'en':'Export player data'};
    OLi18n.Dict["Export für Kaderbewertung&#010;Shift halten für Überschriften&#010;(Strg/Alt halten für alternative Einstellungen)"] = {'en':'Export player data&#010;Hold shift for headline&#010;(hold ctrl/alt for alternative settings)'};
    OLi18n.Dict["FAZIT"] = {'en':'CONCLUSION'};
    OLi18n.Dict["Fähigkeiten"] = {'en':'Abilitys'};
    OLi18n.Dict["Fazit"] = {'en':'Conclusion'};
    OLi18n.Dict["Feldspieler Fitness"] = {'en':'Field players fitness'};
    OLi18n.Dict["Feldspieler ohne Einsatz (< 15')"] = {'en':'Field players w/o appearance (< 15\')'};
    OLi18n.Dict["Feldspieler"] = {'en':'Field players'};
    OLi18n.Dict["Filter neu laden"] = {'en':'Reload filter'};
    OLi18n.Dict["Filter speichern"] = {'en':'Save filter'};
    OLi18n.Dict["Filter"] = {'en':'Filter'};
    OLi18n.Dict["Fitness bei Aufstellung"] = {'en':'Fitness on lineup'};
    OLi18n.Dict["Fitness"] = {'en':'Fitness'};
    OLi18n.Dict["Fitnessanzeige in der Spielerliste (Aufstellung)"] = {'en':'Shows Fitness in player list (Lineup)'};
    OLi18n.Dict["Fitnessfilter Trainingsgruppen"] = {'en':'Fitness filter'};
    OLi18n.Dict["Fitnesswert für Filter bei Trainingsgruppen"] = {'en':'Fitness value for traininggroups filter'};
    OLi18n.Dict["Form"] = {'en':'Form'};
    OLi18n.Dict["Format für den Kaderexport"] = {'en':'Squad export format'};
    OLi18n.Dict["Formation"] = {'en':'Formation'};
    OLi18n.Dict["Formationswechsel"] = {'en':'Formation change'};
    OLi18n.Dict["FOUL UND ELFMETER FÜR"] = {'en':'FOUL AND PENALTY FOR'};
    OLi18n.Dict["Freie Wochen in Zwischenablage kopieren"] = {'en':'Copy free weeks to clipboard'};
    OLi18n.Dict["Freistoß"] = {'en':'Free kick'};
    OLi18n.Dict["Freundschaftsspiel"] = {'en':'Friendly match'};
    OLi18n.Dict["Friendly (Min)"] = {'en':'Friendly (Min)'};
    OLi18n.Dict["FRIENDLY AKTUELL"] = {'en':'CURRENT FRIENDLY'};
    OLi18n.Dict["Friendly"] = {'en':'Friendly'};
    OLi18n.Dict["Friendly Angebote"] = {'en': 'Friendly offers'};
    OLi18n.Dict["Fuss"] = {'en':'Kicking'};
    OLi18n.Dict["Fuß"] = {'en': 'Kicking'};
    OLi18n.Dict["für ([^,]*)$"] = {'en':"for ([^,]*)$"};
    OLi18n.Dict["für"] = {'en':"for"};
    OLi18n.Dict["Gebote"] = {'en': 'Bids'};
    OLi18n.Dict["Geburtstag"] = {'en': 'Birthday'};
    OLi18n.Dict["Gegner"] = {'en': 'Opponent'};
    OLi18n.Dict["Gehalt"] = {'en':'Salary'};
    OLi18n.Dict["Gehaltsempfehlung"] = {'en': 'Salary recommendation'};
    OLi18n.Dict["Gelb"] = {'en':'Yellow'};
    OLi18n.Dict["Gelb-Rot"] = {'en':'Yellow-Red'};
    OLi18n.Dict["Gelb/Rot"] = {'en':'Yellow/Red'};
    OLi18n.Dict["Gelbe Karte"] = {'en':'Yellow card'};
    OLi18n.Dict["Gelbrote Karte"] = {'en':'Yellow-Red card'};
    OLi18n.Dict["Genaue Skillwerte"] = {'en':'Accurate skill values'};
    OLi18n.Dict["Ges %"] = {'en':'% Tot'};
    OLi18n.Dict["Ges"] = {'en':'Tot'};
    OLi18n.Dict["Gesamt"] = {'en':'Total'};
    OLi18n.Dict["Gesamtstärke"] = {'en': 'Total strength'};
    OLi18n.Dict["Gewicht"] = {'en': 'Weight'};
    OLi18n.Dict["Grösse"] = {'en': 'Height'};
    OLi18n.Dict["Größe"] = {'en': 'Height'};
    OLi18n.Dict["Gute Torchance"] = {'en':"Good scoring chance"};
    OLi18n.Dict["HALBZEIT"] = {'en':'HALF-TIME'};
    OLi18n.Dict["Hauptsponsor"] = {'en':'Main sponsor'};
    OLi18n.Dict["Heimatverein"] = {'en':'Boyhood club'};
    OLi18n.Dict["Höher"] = {'en':'higher'};
    OLi18n.Dict["Intensität"] = {'en':'Intensity'};
    OLi18n.Dict["IV"] = {'en':'CB'};
    OLi18n.Dict["Jahresgehalt"] = {'en':'Annual salary'};
    OLi18n.Dict["Jugendspieler verstecken"] = {'en':'Hide acadamy players'};
    OLi18n.Dict["Kaderexport"] = {'en':'Squad export'};
    OLi18n.Dict["KARTEN"] = {'en':'CARDS'};
    OLi18n.Dict["Keine Spielerdaten gefunden"] = {'en':'No player data found'};
    OLi18n.Dict["Klick für Changelog"] = {'en':'Click for changelog'};
    OLi18n.Dict["Klick für Hilfe"] = {'en':'Click for help'};
    OLi18n.Dict["Knuts Dispo-Tipp am <u>Ende</u> der Saison"] = {'en':'Knut\'s overdraft guess for season\'s <u>end</u>'};
    OLi18n.Dict["Kommentar"] = {'en':'Comment'};
    OLi18n.Dict["Kondition"] = {'en':'Endurance'};
    OLi18n.Dict["Konferenz konnte nicht geladen werden. Keine Spiele ausgewählt."] = {'en':'Conference could not be loaded. No games selected.'};
    OLi18n.Dict["Konferenz starten"] = {'en':'Start Conference'};
    OLi18n.Dict["Konto"] = {'en':'Balance'};
    OLi18n.Dict["Koordinationsübungen"] = {'en':'Coordination exercises'};
    OLi18n.Dict["Kopfball"] = {'en':'Header'};
    OLi18n.Dict["Kumulierte Einarbeitung"] = {'en':'Accumulated incorporation'};
    OLi18n.Dict["L-Wert berechnen"] = {'en':'Calculate L-Value'};
    OLi18n.Dict["L-Wert"] = {'en':'L-Value'};
    OLi18n.Dict["Lade Daten"] = {'en':'Loading data'};
    OLi18n.Dict["Langsamer"] = {'en':'Slower'};
    OLi18n.Dict["Lauter"] = {'en':'Volume up'};
    OLi18n.Dict["LAV"] = {'en':'LFB'};
    OLi18n.Dict["LDM"] = {'en':'LDM'};
    OLi18n.Dict["Leiser"] = {'en':'Volume down'};
    OLi18n.Dict["Leistungsstand"] = {'en':'Performance'};
    OLi18n.Dict["Leistungszentrum"] = {'en':'youth academy'};
    OLi18n.Dict["Libero"] = {'en':'Sweeper'};
    OLi18n.Dict["liegt in der Zukunft und wird aus der Konferenz entfernt"] = {'en':'is in the future and will be removed from the conference'};
    OLi18n.Dict["Liga (Gegner)"] = {'en': 'League (Opp.)'};
    OLi18n.Dict["LIGA AKTUELL"] = {'en':'CURRENT LEAGUE'};
    OLi18n.Dict["Liga wählen"] = {'en':'Select league'};
    OLi18n.Dict["Liga"] = {'en':'League'};
    OLi18n.Dict["Liga-Level"] = {'en':'League level'};
    OLi18n.Dict["Ligaspiel (Min)"] = {'en':'Matchtime (Min)'};
    OLi18n.Dict["Ligaspiel"] = {'en':'League match'};
    OLi18n.Dict["Ligavermarktung"] = {'en':'League marketing'};
    OLi18n.Dict["Linie"] = {'en':'Reflexes'};
    OLi18n.Dict["Linker Fuß"] = {'en':'Left Foot','de-CH':'Linker Fuss'};
    OLi18n.Dict["Links: MW Friendly/&Oslash; MW Ligaspiele&#010;Rechts (in Klammern): MW Friendly/&Oslash; (MW Ligaspiele + MW Ligaaufstellung*)&#010;&#010;* aktive Aufstellung, wenn &quot;Friendly Startaufstellung&quot; nicht aktiv ist"] = {'en':"Left: MV Friendly/&Oslash; MV league matches&#010;Right (in brackets): MV Friendly/&Oslash; (MV league matches + MV league starting lineup*)&#010;&#010;* active lineup, if &quot;Friendly starting lineup&quot; is not active"}
    OLi18n.Dict["LIV"] = {'en':'LCB'};
    OLi18n.Dict["Liveticker Steuerung ein-/ausblenden"] = {'en':'Show/hide settings panel'};
    OLi18n.Dict["Logen"] = {'en':'Boxes'};
    OLi18n.Dict["LOM"] = {'en':'LAM'};
    OLi18n.Dict["LST"] = {'en':'LFW'};
    OLi18n.Dict["Mannschaft"] = {'en':'Team'};
    OLi18n.Dict["Mannschaftseinstellungen"] = {'en': 'Team settings'};
    OLi18n.Dict["Marktwert Aufstellung zu Marktwert Ligaaufstellungen (+ aktuelle Ligaaufstellung) (L-Wert)"] = {'en':'Market value lineup / market value league lineups (+ act. league lineup) (L-Value)'};
    OLi18n.Dict["Marktwert Friendly Aufstellung zu Marktwert Ligaaufstellungen (+ aktuelle Ligaaufstellung) (L-Wert)"] = {'en':'Market value lineup / market value league lineups (+ act. league lineup) (L-Value)'};
    OLi18n.Dict["Marktwert"] = {'en':'Market value'};
    OLi18n.Dict["Match-IDs (STRG: User-IDs) eingeben"] = {'en':'Enter match-IDs (hold CTRL: user-IDs)'};
    OLi18n.Dict["Maximal 9 IDs möglich"] = {'en':'Max 9 IDs allowed'};
    OLi18n.Dict["Meisterprämie"] = {'en':'Championship bonus'};
    OLi18n.Dict["Mindestablöse"] = {'en': 'Min. transfer fee'};
    OLi18n.Dict["Minute"] = {'en':'minute'};
    OLi18n.Dict["mit Aufstiegsprämie"] = {'en':'with promotion bonus'};
    OLi18n.Dict["MW Aufstellung zu MW Kader"] = {'en':'MV lineup / MV squad'};
    OLi18n.Dict["MW Aufstellung zu MW Top 11 (nach MW)"] = {'en':'MV lineup / MV Top 11'};
    OLi18n.Dict["MW Aufstellung"] = {'en':'MV lineup'};
    OLi18n.Dict["N"] = {'en':'L'};
    OLi18n.Dict["Nachwuchs"] = {'en': 'Academy'};
    OLi18n.Dict["Nachwuchszentrum"] = {'en':'Youth academy'};
    OLi18n.Dict["Name"] = {'en':'Name'};
    OLi18n.Dict["Nationalität"] = {'en':'Nationality'};
    OLi18n.Dict["neuer L-Wert ab Saison 18"] = {'en':'new L-Value from season 18'};
    OLi18n.Dict["neues Gehalt"] = {'en': 'new salary'};
    OLi18n.Dict["Nicht-Abstiegsprämie"] = {'en':'Non-relegation bonus'};
    OLi18n.Dict["NLZ Spieler verdecken und Attribute auf Knopfdruck nach und nach einblenden"] = {'en':'Hides acadamey players in order to reveal each attribute separately'};
    OLi18n.Dict["Normal (ohne Icon)"] = {'en':'Default (without icon)'};
    OLi18n.Dict["Nächste Zeile (pausiert den Ticker)"] = {'en':'Next line (puts the ticker on hold)'};
    OLi18n.Dict["Nächsten Spieler aufdecken"] = {'en':'Reveal next player '};
    OLi18n.Dict["Nächster Gegner (Liga)"] = {'en':'Next opponent (League)'};
    OLi18n.Dict["Nächster Gegner"] = {'en':'Next opponent'};
    OLi18n.Dict["NÄCHSTES FRIENDLY"] = {'en':'NEXT FRIENDLY'};
    OLi18n.Dict["NÄCHSTES LIGASPIEL"] = {'en':'NEXT LEAGUE GAME'};
    OLi18n.Dict["Ohne Gewähr"] = {'en':'No guarantee'};
    OLi18n.Dict["OM"] = {'en':'AM'};
    OLi18n.Dict["Ort"] = {'en': 'Place'};
    OLi18n.Dict["Pause"] = {'en':'Pause'};
    OLi18n.Dict["Pkt."] = {'en':'Pts.'};
    OLi18n.Dict["Platz (Gegner)"] = {'en':'Rank (Opp.)'};
    OLi18n.Dict["Platz"] = {'en':'Rank'};
    OLi18n.Dict["Platzierung"] = {'en':'Placement'};
    OLi18n.Dict["Platzierung"] = {'en':'Ranking'};
    OLi18n.Dict["Platzierungsprämie"] = {'en':'Placement bonus'};
    OLi18n.Dict["Pop"] = {'en':'Pop'};
    OLi18n.Dict["Popularität"] = {'en':'Popularity'};
    OLi18n.Dict["Position 1"] = {'en':'Position 1'};
    OLi18n.Dict["Position 2"] = {'en':'Position 2'};
    OLi18n.Dict["Position 3"] = {'en':'Position 3'};
    OLi18n.Dict["Position"] = {'en':'Position'};
    OLi18n.Dict["Positionsreihenfolge kommasepariert"] = {'en':'Order of positions (comma separated)'};
    OLi18n.Dict["Positionsreihenfolge"] = {'en':'Order of positions'};
    OLi18n.Dict["Prämie-Saison"] = {'en':'Season Bonus'};
    OLi18n.Dict["Prämien Kalkulieren"] = {'en':'Calculate bonus'};
    OLi18n.Dict["quali."] = {'en':'quali.'};
    OLi18n.Dict["Quicklinks"] = {'en': 'Quicklinks'};
    OLi18n.Dict["Rauslaufen / 1 zu 1"] = {'en':'One on One'};
    OLi18n.Dict["Rauslaufen"] = {'en':'One on One'};
    OLi18n.Dict["RAV"] = {'en':'RFB'};
    OLi18n.Dict["RDM"] = {'en':'RDM'};
    OLi18n.Dict["Rechter Fuß"] = {'en':'players','de-CH':'Rechter Fuss'};
    OLi18n.Dict["Regeneration"] = {'en':'Regeneration'};
    OLi18n.Dict["RIV"] = {'en':'RCB'};
    OLi18n.Dict["ROM"] = {'en':'RAM'};
    OLi18n.Dict["Rot"] = {'en':'Red'};
    OLi18n.Dict["Rote Karte"] = {'en':'Red card'};
    OLi18n.Dict["RST"] = {'en':'RFW'};
    OLi18n.Dict["S"] = {'en':'W'};
    OLi18n.Dict["Saison"] = {'en':'Season'};
    OLi18n.Dict["Schneller"] = {'en':'Faster'};
    OLi18n.Dict["Schnelligkeit"] = {'en':'Speed'};
    OLi18n.Dict["Schnellkraft"] = {'en':'Speed'};
    OLi18n.Dict["Schusskraft"] = {'en':'Shooting power'};
    OLi18n.Dict["Schusstechnik"] = {'en':'Shooting'};
    OLi18n.Dict["Schusstraining"] = {'en':'Shooting training'};
    OLi18n.Dict["Shift halten für Kopfzeile, Strg für Zusatzdaten"] = {'en':'Press and hold shift for headline, ctrl for extended data'};
    OLi18n.Dict["Siege"] = {'en':'Victories'};
    OLi18n.Dict["Siegprämie"] = {'en':'Victory bonus'};
    OLi18n.Dict["Skillwerte mit Nachkommastellen exportieren"] = {'en':'Export skill values with decimals'};
    OLi18n.Dict["Sommerpause"] = {'en':'Summerbreak'};
    OLi18n.Dict["Sonstiges"] = {'en':'Other'};
    OLi18n.Dict["Sortierung Auswechslung"] = {'en':'Substitution order'};
    OLi18n.Dict["Sortierung der Spieler nach Nachname (Listen/Dropdowns)"] = {'en':'Sort players by surname (lists/dropdowns)'};
    OLi18n.Dict["Sortierung der Spieler nach Nachname bei Aufstellung/Training/Einstellungen (Listen/Dropdowns)"] = {'en':'Sort players by surname for lineup/training/settings (lists/dropdowns)'};
    OLi18n.Dict["Sortierung Nachname"] = {'en':'Surname order'};
    OLi18n.Dict["Sortierung/Hervorhebung der Spieler im Dropdown bei der Auswechslungs-Einstellung"] = {'en':'Sort/Highlight players in dropdowns for substitution settings'};
    OLi18n.Dict["SP"] = {'en':'SB'};
    OLi18n.Dict["Speichern"] = {'en':'Save'};
    OLi18n.Dict["Spiel nicht gefunden"] = {'en':'Match not found'};
    OLi18n.Dict["Spiel"] = {'en':'Match'};
    OLi18n.Dict["SPIELBERICHT"] = {'en':'MATCH REPORT'};
    OLi18n.Dict["Spiele/Tore"] = {'en':'Games/Goals'};
    OLi18n.Dict["Spieler erneut anbieten"] = {'en':'Reoffer player'};
    OLi18n.Dict["Spieler in neuem Tab öffnen"] = {'en':'Open player in new tab'};
    OLi18n.Dict["Spieler nicht auswählbar (schon angeboten/nicht mehr im Kader)"] = {'en':'Player not available (already offered/no longer in the squad)'};
    OLi18n.Dict["Spieler raus"] = {'en':'Players out'};
    OLi18n.Dict["Spieler rein"] = {'en':'Players in'};
    OLi18n.Dict["Spieler"] = {'en':'players'};
    OLi18n.Dict["Spieler-ID"] = {'en':'Player ID'};
    OLi18n.Dict["Spieler-ID"] = {'en':'Player-ID'};
    OLi18n.Dict["Spielerdaten in die Zwischenablage kopiert"] = {'en':'Player data copied to clipboard'};
    OLi18n.Dict["Spielerdaten in Zwischenablage kopieren (Shift halten für Überschriften)"] = {'en':'Copy player data to clipboard (press and hold shift for headline)'};
    OLi18n.Dict["Spielergehälter"] = {'en':'Player salaries'};
    OLi18n.Dict["Spielername"] = {'en': 'Player name'};
    OLi18n.Dict["Spielerstatus mobil"] = {'en':'Mobile playerstate'};
    OLi18n.Dict["Spieleröffnung"] = {'en':'Build-up'};
    OLi18n.Dict["Spielformen 5-5 bis 10-10"] = {'en':'Forms of play 5-5 to 10-10'};
    OLi18n.Dict["Spielformen bis 4-4"] = {'en':'Forms of play up to 4-4'};
    OLi18n.Dict["Spielstatistik in Zwischenablage kopieren (Shift halten für Überschriften)"] = {'en': 'Copy statistics to clipboard (Hold shift for headlines)'};
    OLi18n.Dict["Spielstatistik: Separierung der Torchancen nach Torschüssen und guten Torchancen"] = {'en':'Seperate scoring chances from attempts on/off target'};
    OLi18n.Dict["Spieltag"] = {'en':'Matchday'};
    OLi18n.Dict["Spieltyp"] = {'en': 'Matchtype'};
    OLi18n.Dict["Sponsor Vorfälligkeitsentschädigungen"] = {'en':'Sponsor early prepayment penalties'};
    OLi18n.Dict["Sponsor erneuern"] = {'en': 'Renew sponsor'};
    OLi18n.Dict["Sponsoren-Rechner"] = {'en':'Bonus calculator'};
    OLi18n.Dict["Sponsoring"] = {'en': 'Sponsoring'};
    OLi18n.Dict["Sprachausgabe aktivieren"] = {'en':'Activate voice output'};
    OLi18n.Dict["Sprachausgabe deaktivieren"] = {'en':'Deactivate voice output'};
    OLi18n.Dict["Sprachausgabe"] = {'en':'Voice output'};
    OLi18n.Dict["Sprache für Toolbox Features"] = {'en':'Language for toolbox features'};
    OLi18n.Dict["Sprache"] = {'en':'Language'};
    OLi18n.Dict["Sprechgeschwindigkeit"] = {'en':'Voice speed'};
    OLi18n.Dict["ST"] = {'en':'FW'};
    OLi18n.Dict["ST(L)"] = {'en':'FW(L)'};
    OLi18n.Dict["ST(R)"] = {'en':'FW(R)'};
    OLi18n.Dict["Stabilisationstraining"] = {'en':'Stabilization training'};
    OLi18n.Dict["Stadion - Einnahmen aus Ticketverkäufen"] = {'en':'Stadium - revenue from ticket sales'};
    OLi18n.Dict["Stadion Beleihung"] = {'en':'Stadium loan'};
    OLi18n.Dict["Stadion Leihkosten temporäre Tribünen"] = {'en':'Stadium rental costs temporary stands'};
    OLi18n.Dict["Stadion"] = {'en':'Stadium'};
    OLi18n.Dict["Stadion Einstellungen"] = {'en': 'Stadium settings'};
    OLi18n.Dict["Stadionauslastung"] = {'en':'Stadium utilisation'};
    OLi18n.Dict["Stadioneinnahmen: Auswärtsspiel (Friendly)"] = {'en':'Stadium revenue: Away (Friendly)'};
    OLi18n.Dict["Stadioneinnahmen: Heimspiel (Friendly)"] = {'en':'Stadium revenue: Home (Friendly)'};
    OLi18n.Dict["Stadionvermarktung"] = {'en':'Stadium marketing'};
    OLi18n.Dict["Standardsituationen"] = {'en':'Set pieces'};
    OLi18n.Dict["Stimme"] = {'en':'Voice'};
    OLi18n.Dict["Stimmlage"] = {'en':'Voice pitch'};
    OLi18n.Dict["Strafraum"] = {'en':'Penalty area'};
    OLi18n.Dict["Strg"] = {'en':'Ctrl'};
    OLi18n.Dict["Summe Punkte"] = {'en':'Points total'};
    OLi18n.Dict["System (Gegner)"] = {'en': 'System (Opp.)'};
    OLi18n.Dict["System"] = {'en': 'System'};
    OLi18n.Dict["Taktik"] = {'en':'Tactics'};
    OLi18n.Dict["Taktikverst."] = {'en':'Tactics'};
    OLi18n.Dict["Taktikverständnis"] = {'en':'Tactical understanding'};
    OLi18n.Dict["Talent"] = {'en':'Talent'};
    OLi18n.Dict["Talent ermittelt"] = {'en': 'Talent determined'};
    OLi18n.Dict["Technik"] = {'en':'Technique'};
    OLi18n.Dict["Ticker-Geschwindigkeit (Zeichen pro Sekunde)"] = {'en':'Ticker speed (chars per second)'};
    OLi18n.Dict["Tiefer"] = {'en':'deeper'};
    OLi18n.Dict["Toolbox Sprache"] = {'en':'Toolbox language'};
    OLi18n.Dict["Torchance"] = {'en':"Scoring chance"};
    OLi18n.Dict["Torchancen (Gegner)"] = {'en': 'Chances (Opp.)'};
    OLi18n.Dict["Torchancen"] = {'en': 'Chances'};
    OLi18n.Dict["TORCHANCEN"] = {'en':'SCORING CHANCES'};
    OLi18n.Dict["Tore (Gegner)"] = {'en': 'Goals (Opp.)'};
    OLi18n.Dict["TORE"] = {'en':'GOALS'};
    OLi18n.Dict["Tore"] = {'en':'Goals'};
    OLi18n.Dict["Torschüsse (Gegner)"] = {'en': 'Shots (Opp.)'};
    OLi18n.Dict["Torschüsse"] = {'en': 'Shots'};
    OLi18n.Dict["TORSCHÜSSE"] = {'en':'SHOTS ON/OFF TARGET'};
    OLi18n.Dict["Torwarttraining"] = {'en':'Goalkeeper training'};
    OLi18n.Dict["Trainer / Assistenten / Trainingsplätze"] = {'en':'Coaches / Assistants / Training grounds'};
    OLi18n.Dict["Training"] = {'en': 'Training'};
    OLi18n.Dict["Training (Ja/Nein)"] = {'en':'Training (y/n)'};
    OLi18n.Dict["Trainingsgruppen-Filter"] = {'en':'Traininggroups filter'};
    OLi18n.Dict["Trainingsintensität nach iT-System von Rot / Verletzungsgefahr"] = {'en':'Training intensity according to the iT system of Rot / risk of injury'};
    OLi18n.Dict["Trainingsspiel"] = {'en':'Practice match'};
    OLi18n.Dict["Transferausgaben"] = {'en':'Transfer expenses'};
    OLi18n.Dict["Transfererlöse"] = {'en':'Transfer income'};
    OLi18n.Dict["Transferlisten-Manager"] = {'en':'Transferlist manager'};
    OLi18n.Dict["TW"] = {'en':'GK'};
    OLi18n.Dict["Typ"] = {'en':'Type'};
    OLi18n.Dict["U"] = {'en':'D'};
    OLi18n.Dict["Ungültiges Format für IDs"] = {'en':'Invalid ID format'};
    OLi18n.Dict["Untermenü Direktlinks"] = {'en':'Submenu direct links'};
    OLi18n.Dict["Vereinslos"] = {'en':'Free Agent'};
    OLi18n.Dict["Verl"] = {'en':'Inj'};
    OLi18n.Dict["Verletzung"] = {'en':'Injury'};
    OLi18n.Dict["Verletzungsgefahr"] = {'en':'Risk of injury'};
    OLi18n.Dict["Vertragsdaten kopieren&#010;Shift halten für Überschriften"] = {'en':'Copy contract data&#010;Hold shift for headlines'};
    OLi18n.Dict["Vertragslaufzeit"] = {'en': 'Contract period'};
    OLi18n.Dict["Verträge"] = {'en': 'Contracts'};
    OLi18n.Dict["Veräußerung Leistungszentrum"] = {'en':'Sale of Young Talent Center'};
    OLi18n.Dict["Veräußerung Trainingsgelände"] = {'en':'Sale of training ground'};
    OLi18n.Dict["VORBERICHT"] = {'en':'PRELIMINARY REPORT'};
    OLi18n.Dict["Vorbericht"] = {'en':'Preliminary report'};
    OLi18n.Dict["vorher"] = {'en':'former'};
    OLi18n.Dict["Vorl."] = {'en':'Ass.'};
    OLi18n.Dict["Vorlagen"] = {'en':'Assists'};
    OLi18n.Dict["Wenn aktiviert, werden beim Stadiondaten-Export die Daten von Friendly und Ligaspielen im selben Format ausgegeben."] = {'en':'Uniform data structure for stadium export (league/friendly)'};
    OLi18n.Dict["Wenn aktiviert, werden beim Stadiondaten-Export erweiterte Daten ausgegeben"] = {'en': 'Extended stadium data export'};
    OLi18n.Dict["Werte werden untereinander geschrieben"] = {'en':'Export values vertically'};
    OLi18n.Dict["Winterpause"] = {'en':'Winterbreak'};
    OLi18n.Dict["Wirklich ALLE ALLE gespeicherten Einstellungen löschen?"] = {'en':'Really delete ALL ALL saved settings?'};
    OLi18n.Dict["wird noch ermittelt"] = {'en':'to be determined'};
    OLi18n.Dict["Woche"] = {'en':'Week'};
    OLi18n.Dict["Woche "] = {'en':'Week '};
    OLi18n.Dict["WP"] = {'en':'WB'};
    OLi18n.Dict["ZB"] = {'en':'SA'};
    OLi18n.Dict["ZDM"] = {'en':'CDM'};
    OLi18n.Dict["ZDM(L)"] = {'en':'CDM(L)'};
    OLi18n.Dict["ZDM(R)"] = {'en':'CDM(R)'};
    OLi18n.Dict["Zeilendarstellung"] = {'en':'Export in rows'};
    OLi18n.Dict["ZIV"] = {'en':'CCB'};
    OLi18n.Dict["ZOM"] = {'en':'CAM'};
    OLi18n.Dict["ZOM(L)"] = {'en':'CAM(L)'};
    OLi18n.Dict["ZOM(R)"] = {'en':'CAM(R)'};
    OLi18n.Dict["Zusätzliche Filter für die Trainingsgruppen"] = {'en':'Additional filter for traininggroups'};
    OLi18n.Dict["Zustand"] = {'en':'Condition'};
    OLi18n.Dict["Zweikampf (Gegner)"] = {'en': 'Duel (Opp.)'};
    OLi18n.Dict["Zweikampf"] = {'en':'Duel'};
    OLi18n.Dict["ZWEIKÄMPFE"] = {'en':'BATTLES WON'};
    OLi18n.Dict["\"echte\" Torchancen anzeigen"] = {'en':'Show "real" scoring chances'};
    OLi18n.Dict["^Gute Torchance für (.*)$"] = {'en':"^Good scoring chance for (.*)$"};
    OLi18n.Dict["^To+r für ([^,]*),"] = {'en':"^Go+al for ([^,]*),"};
    OLi18n.Dict["Änderungen erst nach Neuladen wirksam"] = {'en':'Changes may only take effect after reloading'};
    OLi18n.Dict["Überziehungslimit"] = {'en':'Overdraft facility'};
    OLi18n.Dict["Ø-Note"] = {'en':'Ø Rating'};
    OLi18n.Dict["Ø-Gesamt"] = {'en':'Ø-Total'};

    OLi18n.getPosVal = function(pos, lang){
        if (!pos){
            return null;
        }
        lang = lang || (OLSettings ? OLSettings.get("ToolboxLanguage", OLi18n.shortLang) : OLi18n.shortLang);
        const posKey = Object.keys(OLCore.Base.pos2val).find(key => OLi18n.tbtext(key, lang) === pos.toUpperCase());
        return posKey ? OLCore.Base.pos2val[posKey]: null;
    };

    OLi18n.ExportProps = {
        0: {'de':'TO', 'en':'TO', 'TW': true, 'FS': true},
        1: {'de':'LI', 'en':'RE', 'TW': true, 'FS': false},
        2: {'de':'SR', 'en':'PA', 'TW': true, 'FS': false},
        3: {'de':'RL', 'en':'OO', 'TW': true, 'FS': false},
        4: {'de':'SO', 'en':'BU', 'TW': true, 'FS': false},
        5: {'de':'FU', 'en':'KI', 'TW': true, 'FS': false},
        6: {'de':'LB', 'en':'SW', 'TW': true, 'FS': false},
        7: {'de':'GS', 'en':'SD', 'TW': false, 'FS': true},
        8: {'de':'AT', 'en':'AT', 'TW': false, 'FS': true},
        9: {'de':'KO', 'en':'ED', 'TW': false, 'FS': true},
        14: {'de':'KB', 'en':'HE', 'TW': false, 'FS': true},
        15: {'de':'ZK', 'en':'DU', 'TW': false, 'FS': true},
        16: {'de':'TE', 'en':'TE', 'TW': false, 'FS': true},
        17: {'de':'LF', 'en':'LF', 'TW': false, 'FS': true},
        18: {'de':'RF', 'en':'RF', 'TW': false, 'FS': true},
        19: {'de':'SK', 'en':'SP', 'TW': false, 'FS': true},
        20: {'de':'ST', 'en':'SH', 'TW': false, 'FS': true},
        21: {'de':'TV', 'en':'TU', 'TW': false, 'FS': true},
        24: {'de':'AL', 'en':'AG', 'TW': true, 'FS': true},
        25: {'de':'NA', 'en':'NA', 'TW': true, 'FS': true},
        27: {'de':'GR', 'en':'HT', 'TW': true, 'FS': true},
        28: {'de':'FT', 'en':'FT', 'TW': true, 'FS': true},
        35: {'de':'GW', 'en':'WT', 'TW': true, 'FS': true},
        37: {'de':'GB', 'en':'BD', 'TW': true, 'FS': true},
        38: {'de':'MW', 'en':'MV', 'TW': true, 'FS': true},
        39: {'de':'TA', 'en':'TA', 'TW': true, 'FS': true},

        101: {'de':'LIu', 'en':'REu', 'TW': true, 'FS': false},
        102: {'de':'SRu', 'en':'PAu', 'TW': true, 'FS': false},
        103: {'de':'RLu', 'en':'OOu', 'TW': true, 'FS': false},
        104: {'de':'SOu', 'en':'BUu', 'TW': true, 'FS': false},
        105: {'de':'FUu', 'en':'KIu', 'TW': true, 'FS': false},
        106: {'de':'LBu', 'en':'SWu', 'TW': true, 'FS': false},
        107: {'de':'GSu', 'en':'SDu', 'TW': false, 'FS': true},
        108: {'de':'ATu', 'en':'ATu', 'TW': false, 'FS': true},
        109: {'de':'KOu', 'en':'EDu', 'TW': false, 'FS': true},
        114: {'de':'KBu', 'en':'HEu', 'TW': false, 'FS': true},
        115: {'de':'ZKu', 'en':'DUu', 'TW': false, 'FS': true},
        116: {'de':'TEu', 'en':'TEu', 'TW': false, 'FS': true},
        117: {'de':'LFu', 'en':'LFu', 'TW': false, 'FS': true},
        118: {'de':'RFu', 'en':'RFu', 'TW': false, 'FS': true},
        119: {'de':'SKu', 'en':'SPu', 'TW': false, 'FS': true},
        120: {'de':'STu', 'en':'SHu', 'TW': false, 'FS': true},
        121: {'de':'TVu', 'en':'TUu', 'TW': false, 'FS': true},

        200: {'de':'NM', 'en':'NM', 'nam': 'Name', 'TW': true, 'FS': true},
        201: {'de':'P1', 'en':'P1', 'nam': 'Position 1', 'TW': true, 'FS': true},
        202: {'de':'P2', 'en':'P2', 'nam': 'Position 2', 'TW': true, 'FS': true},
        203: {'de':'P3', 'en':'P3', 'nam': 'Position 3', 'TW': true, 'FS': true},
        204: {'de':'FM', 'en':'FM', 'nam': 'Form', 'TW': true, 'FS': true},
        205: {'de':'EZ', 'en':'MT', 'nam': 'Ligaspiel (Min)', 'TW': true, 'FS': true},
        206: {'de':'FR', 'en':'FR', 'nam': 'Friendly (Min)', 'TW': true, 'FS': true},
        207: {'de':'LS', 'en':'PF', 'nam': 'Leistungsstand', 'TW': true, 'FS': true},
        208: {'de':'TR', 'en':'TR', 'nam': 'Training (Ja/Nein)', 'TW': true, 'FS': true},
        210: {'de':'ID', 'en':'ID', 'nam': 'Spieler-ID', 'TW': true, 'FS': true},
        211: {'de':'WO', 'en':'WK', 'nam': 'Woche', 'TW': true, 'FS': true},
        212: {'de':'SP', 'en':'MD', 'nam': 'Spieltag', 'TW': true, 'FS': true},
        213: {'de':'SA', 'en':'SA', 'nam': 'Saison', 'TW': true, 'FS': true},
        214: {'de':'DN', 'en':'AR', 'nam': 'Ø-Note', 'TW': true, 'FS': true}
    };

    OLi18n.propName = function(id, lang){
        lang = lang || (OLSettings ? OLSettings.get("ToolboxLanguage", OLi18n.shortLang) : OLi18n.shortLang);
        const prop = OLi18n.ExportProps[id];
        if (!prop){
            return null;
        }
        if (prop.nam){
            return OLi18n.tbtext(prop.nam, lang);
        }
        if (id < 100){
            return OLi18n.prop(id, lang);
        }
        if (id > 100 && id < 200){
            return OLi18n.prop(id-100, lang) + " (Ups)";
        }
        return null;
    }

    OLi18n.propExp = function(id, lang){
        lang = lang || (OLSettings ? OLSettings.get("ToolboxLanguage", OLi18n.shortLang) : OLi18n.shortLang);
        if (!OLi18n.ExportProps[id]){
            return null;
        }
        return OLi18n.ExportProps[id][lang] || OLi18n.ExportProps[id][lang.substr(0,2)] || null;
    };

    OLi18n.propExpId = function(prop, lang){
        if (!prop){
            return null;
        }
        lang = lang || (OLSettings ? OLSettings.get("ToolboxLanguage", OLi18n.shortLang) : OLi18n.shortLang);
        if (lang.length > 2){
            lang = lang.substr(0,2);
        }
        return Object.keys(OLi18n.ExportProps).find(key => (OLi18n.ExportProps[key][lang] && OLi18n.ExportProps[key][lang].toLowerCase() === prop.toLowerCase()));
    };

    OLi18n.Properties = {
        0: {'de': 'Ø-Gesamt','en': 'Ø-Total'},
        1: {'de': 'Linie','en': 'Reflexes'},
        2: {'de': 'Strafraum','en': 'Penalty Area'},
        3: {'de': 'Rauslaufen', 'de2': 'Rauslaufen / 1 zu 1', 'en': 'One on One'},
        4: {'de': 'Spieleröffnung','en': 'Build-up'},
        5: {'de': 'Fuss','en': 'Kicking'},
        6: {'de': 'Libero','en': 'Sweeper'},
        7: {'de': 'Schnelligkeit','en': 'Speed'},
        8: {'de': 'Athletik','en': 'Athleticism'},
        9: {'de': 'Kondition','en': 'Endurance'},
        14: {'de': 'Kopfball','en': 'Header'},
        15: {'de': 'Zweikampf','en': 'Duel'},
        16: {'de': 'Technik','en': 'Technique'},
        17: {'de': 'Linker Fuß','en':'Left foot','de-CH':'Linker Fuss'},
        18: {'de': 'Rechter Fuß','en':'Right foot','de-CH':'Rechter Fuss'},
        19: {'de': 'Schusskraft','en': 'Shooting Power'},
        20: {'de': 'Schusstechnik','en': 'Shooting'},
        21: {'de': 'Taktikverst.', 'de2': 'Taktikverständnis', 'en': 'Tactics', 'en2': 'Tactical understanding'},
        24: {'de': 'Alter','en': 'Age'},
        25: {'de': 'Nationalität','en': 'Nationality'},
        27: {'de': 'Größe','en': 'Height'},
        28: {'de': 'Fitness','en': 'Fitness'},
        35: {'de': 'Gewicht','en': 'Weight'},
        37: {'de': 'Geburtstag','en': 'Birthday'},
        38: {'de': 'Marktwert','en': 'Market value'},
        39: {'de': 'Talent','en': 'Talent'}
    };

    OLi18n.text = function(text, lang){
        lang = lang || OLi18n.lang;
        if (!OLi18n.Dict[text]){
            console.warn("Missing Translation", `"${text}"`);
            console.warn(`OLi18n.Dict["${text}"] = {'en': '${text}'};`);
            return text;
        }
        return OLi18n.Dict[text][lang] || OLi18n.Dict[text][lang.substr(0,2)] || text;
    };

    OLi18n.tbtext = function(text, lang){
        lang = lang || (window.OLSettings ? OLSettings.get("ToolboxLanguage", OLi18n.shortLang) : OLi18n.shortLang);
        if (!OLi18n.Dict[text]){
            console.warn("Missing Translation", `"${text}"`);
            console.warn(`OLi18n.Dict["${text}"] = {'en': '${text}'};`);
            return text;
        }
        return OLi18n.Dict[text][lang] || OLi18n.Dict[text][lang.substr(0,2)] || text;
    };

    OLi18n.tbstext = function(text){
        const langFrom = OLi18n.shortLang;
        const langTo = OLSettings.get("ToolboxLanguage", OLi18n.shortLang);
        if (langFrom === langTo) {
            return text;
        }
        if (langFrom === OLCore.Base.sysLang){
            if (!OLi18n.Dict[text]){
                console.warn("Missing Translation", `"${text}"`);
                return text;
            }
            return OLi18n.Dict[text][langTo] || text;
        } else {
            const dict = Object.keys(OLi18n.Dict).find(key => OLi18n.Dict[key][langFrom] === text);
            return dict ? (OLi18n.Dict[dict][langTo] || dict) : text;
        }
        return text;
    };

    OLi18n.translate = function(text, langFrom, langTo){
        langFrom = langFrom || OLi18n.lang;
        langTo = langTo || OLSettings.get("ToolboxLanguage", OLi18n.shortLang);
        if (langFrom.length > 2){
            langFrom = langFrom.substr(0,2);
        }
        const dict = Object.keys(OLi18n.Dict).find(key => OLi18n.Dict[key][langFrom] === text || OLi18n.Dict[key][langFrom+'2'] === text);
        if (dict){
            return OLi18n.Dict[dict][langTo] || dict;
        }
        return text;
    };

    OLi18n.tbNum = function(num, opt){
        opt = opt || {};
        const decimal = OLSettings.get("ToolboxDecimal", OLi18n.decimalSeparator);
        const numberFormat = new Intl.NumberFormat(decimal === "." ? "en-US" : "de-DE", opt);
        return numberFormat.format(num);
    };

    OLi18n.prop = function(id, lang){
        lang = lang || (OLSettings ? OLSettings.get("ToolboxLanguage", OLi18n.shortLang) : OLi18n.shortLang);
        if (!OLi18n.Properties[id]){
            return null;
        }
        if (lang.length > 2){
            lang = lang.substr(0,2);
        }
        return OLi18n.Properties[id][lang] || null;
    };

    OLi18n.propId = function(prop, lang){
        if (!prop){
            return null;
        }
        return Object.keys(OLi18n.Properties).find(function(key){
            if (lang){
                return OLi18n.Properties[key][lang] && OLi18n.Properties[key][lang].toLowerCase() === prop.toLowerCase();
            }
            if (OLi18n.Properties[key][OLi18n.lang] && OLi18n.Properties[key][OLi18n.lang].toLowerCase() === prop.toLowerCase()){
                return true;
            }
            if (OLi18n.Properties[key][OLi18n.shortLang] && OLi18n.Properties[key][OLi18n.shortLang].toLowerCase() === prop.toLowerCase()){
                return true;
            }
            for (const k of Object.keys(OLi18n.Properties[key]).filter(pk => pk.startsWith(OLi18n.shortLang))){
                if (OLi18n.Properties[key][k] && OLi18n.Properties[key][k].toLowerCase() === prop.toLowerCase()){
                    return true;
                }
            }
            return false;
        });
    };

    window.OLi18n = OLi18n;

})();