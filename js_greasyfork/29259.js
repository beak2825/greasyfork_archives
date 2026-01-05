// ==UserScript==
// @name         Leitstellenspiel.de - CZ
// @namespace    https://greasyfork.org/cs/scripts/29258-leitstellenspiel-de-%C4%8Cesk%C3%BD-%C5%99eklad
// @version      0.04
// @description  Beta verze českého překladu do hry leitstellenspiel.de
// @author       Martin Tesař
// @include      *://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29259/Leitstellenspielde%20-%20CZ.user.js
// @updateURL https://update.greasyfork.org/scripts/29259/Leitstellenspielde%20-%20CZ.meta.js
// ==/UserScript==

(function() {

var replacements, regex, key, textnodes, node, s;

 

replacements = {

    //věty
    "Ein Fahrzeug hat einen Sprechwunsch!" : "Vozidlo má požadavek!",
    "Einsatzbereit auf Wache" : "Připraveno na základně!",
    "Beim Einsatzort" : "Na místě události",
    "Auf Anfahrt" : "Na cestě",
    "Es sind keine Funksprüche eingegangen." : "Žádné radiové zprávy",
    "Fahrzeuge auf Anofahrt" : "Jednotky na cestě",
    "Deine Negabenrate an den Verband" : "Váš příspěvěk do alianční kasy",
    "Kein Bereitstellungsraum gefunden" : "Žádné plochy nenalezeny",
    "Zusätzlich benötigte Fahrzeuge" : "Potřebné jednotky",
    
    
    
    //detail mise
    "Hilfe zu diesem Einsatz" : "Požadavky na misi",
    
    //požadavky mise
    "Credits im Durchschnitt" : "Průměrná odměna",
    "Vorraussetzung an Feuerwachen" : "Potřebný počet požárních stanic",
    "Ausbreitungsmöglichkeiten" : "Možnosti rozšíření",
    "Maximale Entfernung von den Fahrzeugen" : "Maximální vzdálenost vozidel",
    "Vorraussetzung an Rettungswachen" : "Potřebný počet stanic záchranné služby",
    "Fachrichtung für Patienten" : "Specializace pro pacienta",
    "Mindest Patientenanzahl" : "Minimální počet pacientů",
    "Benötigte Streifenwagen" : "Potřebný počet policejních vozidel",
    "Vorraussetzung an Polizeiwachen" : "Potřebný počet policejních stanic",
    "Streifenwagen Anforderungswahrscheinlichkeit" : "Pravděpodobnost požadavku policejního vozu",
    "Benötigte Löschfahrzeuge" : "Potřebný počet hasičských vozidel (CAS)",
    "Wahrscheinlichkeit das ein Patient transportiert werden muss" : "Pravděpodobnost, že bude potřeba pacienta transportovat do nemocnice",

    //mise

    "Mülleimerbrand": "Požár odpadkového koše",
    "Containerbrand" : "Požár kontejneru",
    "Brennender PKW" : "Požár automobilu",
    "Motorrad-Brand" : "Požár motocyklu",
    "Brennendes Gras" : "Požár trávy",
    "Zimmerbrand" : "Požár místnosti",
    "Gartenlaubenbrand" : "Požár zahradního altánu",
    "Brennendes Laub" : "Požár listí",
    "Sperrmüllbrand" : "Požár odpadu",
    "Strohballen Brand" : "Požár balíků slámy",
    "Traktor Brand" : "Požár traktoru",
    "Brennende Telefonzelle" : "Požár telefonní budky",
    "Baum auf Straße" : "Strom na ulici",
    "Brennender LKW" : "Požár nákladního vozu",
    "Kleiner Feldbrand" : "Menší požár pole",
    "Kleiner Waldbrand" : "Malý lesní požár",
    "Wohnwagenbrand" : "Požár karavanu",
    "Brand in Briefkasten" : "Požár poštovní schránky",
    "Brennendes Gebüsch" : "Požár křoví",
    "Brennender Anhänger" : "Požár přívěsu",
    "Kellerbrand" : "Požár v suterénu",
    "Schornsteinbrand" : "Požár komínu",
    "Dachstuhlbrand" : "Požár střechy",
    "Fettbrand in Pommesbude" : "Hořící olej (tuk) v rychlém občerstvení",
    "Brennendes Bus-Häuschen" : "Požár autobusové zastávky",
    "Verkehrsunfall" : "Dopravní nehoda",
    "Brand im Supermarkt" : "Požár v supermarketu",
    "Auffahrunfall" : "Srážka - dopravní nehoda",
    "Garagenbrand" : "Požár garáže",
    "Maschinenbrand" : "Požár stroje",
    "Große Ölspur" : "Velká olejová skvrna",
    "Auslaufende Betriebsstoffe" : "Únik provozních kapalin",
    "Kaminbrand" : "Požár krbu",
    "Mähdrescher Brand" : "Požár kombajnu",
    "Feuer im Krankenhaus" : "Požár v nemocnici",
    "Brennender Güterwaggon" : "Požár nákladního vagónu",
    "Tankstellenbrand" : "Požár čerpací stanice",
    "Alkoholintoxikation" : "Otrava alkoholem",
    "Nasenbluten unstillbar" : "Krvácení z nosu",
    "Herzinfarkt" : "Infarkt",
    "akuter Asthma-Anfall" : "Akutní astmatický záchvat",
    "Krampfanfall" : "Záchvat",
    "Fieber" : "Horečka",
    "Gestürzte Person" : "Bezvládný člověk",
    "Brand in Werkstatt" : "Požár v dílně",
    "Brand auf Weihnachtsmarkt" : "Požár na vánočních trhu",
    "Verkehrsunfall durch Glatteis" : "Dopravní nehoda na náledí",
    "Brennender Tannenbaum" : "Požár vánočního stromu",
    "Gestürzter Fußgänger" : "Pád chodce",
    "Gestürzter Radfahrer" : "Pád cyklisty",
    "Ladendiebstahl" : "Krádež",
    "Parkendes Auto gerammt" : "Náraz do zaparkovaného auta",
    "Metalldiebstahl" : "Krádež kovu",
    "Taschendiebstahl" : "Kapesní krádež",
    "Notebook aus Schule entwendet" : "Krádež laptopu ve škole",
    "Personalienaufnahme von Schwarzfahrer" : "Černý pasažér",
    "Bewusstloser Kranführer" : "Jeřábník v bezvědomí",
    "Schlägerei" : "Hádka (rvačka)",
    "Randalierende Person" : "Výtržnictví",
    "Küchenbrand" : "Požár v kuchyni",
    "Person hinter Tür" : "Bezvládná osoba za dveřmi",
    "Kleintier in Not" : "Malé zvíře v nouzi",
    "Verletzte Person auf Baugerüst" : "Zraněná osoba na lešení",
    "Rauchentwicklung in Museum" : "Kouř v muzeu",
    "Einbruch in Keller" : "Vloupání do sklepa",
    "Einbruch in Wohnung" : "Vloupání do bytu",
    "Gefahrgut-LKW verunglückt" : "Nehoda kamionu s nebezpečným nákladem",
    "Brennende Lok" : "Požár lokomotivy",
    "Sachbeschädigung" : "Škody na majetku",
    "Sporthallenbrand" : "Požár sportovní haly",
    "Kleinflugzeug abgestürzt" : "Havárie malého letadla",
    "Brennender Bollerwagen" : "Požár cisterny",
    "LKW Auffahrunfall" : "Nehoda kamionu",
    "Ruhestörung" : "Rušení nočního klidu",
    "Keller unter Wasser" : "Vytopený sklep",
    "Schlaganfall" : "Mrtvice",
    "Brennender Bus" : "Požár autobusu",
    "Kleine Ölspur" : "Malý únik oleje",
    "Negedehnte Ölspur" : "Protáhlá olejová skvrna",
    "Feuer in Schnellrestaurant" : "Požár v restauraci rychlého občerstvení",
    "Aufgerissener Öltank" : "Protržená olejová nádrž",
    "Anogefahrene Person" : "Kolize s osobou",
    "Feuer in Einfamilienhaus" : "Požár rodinného domu",
    "Massenschlägerei" : "Hromadná rvačka",
    "Schwangere in Notsituation" : "Těhotná žena v nouzi",
    "Beginnende Geburt" : "Začínající porod",
    "Vaginale Blutung" : "Krvání z pochvy",
    "Brennende Vogelscheuche" : "Hořící strašák",
    "Brennendes Kürbisfeld" : "Požár pole s dýněmi",
    "Kürbissuppe übergekocht" : "Otrava dýňovou polévkou",
    "Hexe hängt in Baum" : "Čarodějnice visící na stromě",
    "Zombiebiss" : "Kousnutí od zombie",
    "Kürbisse geklaut" : "Krádež dýně",
    "Frankenstein gesichtet" : "Spatřen Frankenstein",
    "Süßigkeitendiebstahl" : "Krádež cukroví",
    "LKW umgestürzt" : "Převrácený kamion",
    "Motorradunfall" : "Nehoda motocyklu",
    "Brennender Adventskranz" : "Požár adventního věnce",
    "Rangelei auf Weihnachtsmarkt" : "Rvačka na vánočním trhu",
    "Mittlerer Feldbrand" : "Středně velký požár pole",
    "Großer Feldbrand" : "Velký požár pole",
    "Großer Waldbrand" : "Velký lesní požár",
    "Großfeuer im Wald" : "Velký požár v lese",
    "Flächenbrand" : "Rozlehlý požár",
    "Feuer auf Balkon" : "Požár na balkoně",
    "Brennende Papiercontainer" : "Požár kontejneru na papír",
    "Brennende Hecke" : "Požár živého plotu",
    "Trunkenheitsfahrt" : "Opilý řidič",
    "Brennendes Reetdachhaus" : "Požár doškové chalupy",
    "Ampelausfall" : "Porucha semaforu",
    "Pannenfahrzeug" : "Odtažení vozidla",
    "Hausfriedensbruch" : "Porušování domovní svobody",
    "Raub" : "Loupež",
    "Häusliche Gewalt" : "Domácí násilí",
    "Hilflose Person" : "Bezmocná osoba",
    "Akuter Harnstau" : "Akutní močový zánět",
    "Harnleiter Blutung" : "Krvácení z močovodu",
    "Herzrhythmusstörungen" : "Akutní arytmie",
    "Tiefgarage unter Wasser" : "Vytopená garáž",
    "Äste auf Fahrbahn" : "Větve na silnici",
    "Umherfliegendes Baumaterial" : "Uvolněný stavební materál",
    "Baum auf PKW" : "Pád stromu na auto",
    "Baum auf Dach" : "Pád stromu na střechu",
    "Kopfplatzwunde" : "Tržné rány na hlavě",
    "Gehirnerschütterung" : "Otřes mozku",
    "Fassadenteile drohen zu fallen" : "Hrozící pád kusů omítky",
    "Beschädigter Dachbereich" : "Poškozená střecha",
    "Baum auf Gleisen" : "Strom na kolejích",
    "Parkdeck voll Wasser gelaufen" : "Parkoviště pod vodou",
    "Straße unter Wasser" : "Zatopená silnice",
    "Erdrutsch" : "Sesuv půdy",
    "LKW in Hauswand" : "Náraz kamionu do zdi domu",
    "Eingestürztes Wohnhaus" : "Zřícení domu",
    "Schädelverletzung" : "Poranění hlavy",
    "Wirbelsäulenverletzung" : "Poškození míchy",
    "Sturz aus Höhe" : "Pád z výšky",
    "Sonnenstich" : "Úžeh",
    "Hitzschlag" : "Úpal",
    "Lagerhallenbrand" : "Požár skladu",
    "Feuer im Lagerraum" : "Požár ve skladu",
    "Personenkontrolle" : "Bezpečnostní kotrola osoby",
    "Verkehrsbehinderung" : "Dopravní zácpa",
    "Diebstahl aus Kfz" : "Krádež motorového vozidla",
    "Baum auf Radweg" : "Strom na cyklostezce",
    "Brennende Trafostation" : "Požár trafostanice",
    "Person unter Baum eingeklemmt" : "Osoba uvězněná pod stromem",
    "Schwerpunkteinsatz Verkehrsüberwachung" : "Monitoring provozu",
    "Jugendschutzkontrolle in Diskothek" : "Kontrola alkoholu v nočním klubu",
    "Geländedurchsuchung nach Beweismittel" : "Hledání důkazů v terénu",
    "Geplante Razzia" : "Policejní razie",
    "Fußball Bundesliga-Spiel" : "Fotbalové utkání",
    "Diebstahl auf Weihnachtsmarkt" : "Krádež na vánočním trhu",
    "Brennende Weihnachtsmarktbude" : "Požár vánočního stánku",
    "Scheunenbrand" : "Požár stodoly",
    "Feuer auf Bauernhof - Mittel" : "Požár na farmě středního rozsahu",
    "Feuer auf Bauernhof - Groß" : "Požár na farmě velkého rozsahu",
    "Leck in Chemikalientank" : "Únik chemikálií ze zásobníku",
    "Fahrraddiebstahl" : "Krádež bicyklu",
    "Unfall mit Motorsäge" : "Nehoda s motorovou pilou",
    "Unterzuckerung" : "Hypoglykémie",
    "Akute Bauchschmerzen" : "Akutní bolest břicha",
    "Gasexplosion" : "Výbuch plynu",
    "Bürobrand" : "Požár kanceláře",
    "Chlorgasaustritt" : "Únik plynného chlóru",
    "Brandsicherheitswache bei Volksfest" : "Požární zabezpeční na festivalu",
    "Brandsicherheitswachdienst im Theater" : "Hlídka požární bezpečnosti v divadle",
    "Dorf/Stadtfest" : "Obecní/městská slavnost",
    "Volkslauf" : "Lidový běh",
    "Anogemeldete Demonstration" : "Nahlášená demonstrace",
    "Absicherung Musikumzug" : "Doprovod hudebního průvodu",
    
    
    
    //POI
    "See" : "Vodní plocha",
    "POI-Check" : "Kontrola POI",
    
    
    

    
 //ostatní

    "Feuerwachen" : "Požární stanice",
    "Feuerwache" : "Požární stanice",
    "Polizeiwachen" : "Policejní stanice",
    "Polizeiwache" : "Policejní stanice",
    "Rettungswachen" : "Stanice záchranné služby",
    "Rettungswache" : "Stanice záchranné služby",
    "Details" : "Detaily",
    "Einzeltransaktionen" : "Jednotlivé zásahy",
    "Übersicht" : "Přehled",
    "Kommentare" : "Komentáře",
    "Tageszusammenfassung" : "Denní přehled",
    "Dein Kommentar" : "Váš komentář",
    "Anozahl" : "Počet",
    "Weiter" : "Další",
    "HLF" : "Technická CAS (HL F)",
    "Brandmeldeanlage" : "EPS",
    "Negaben" : "Výdaje",
    "Einnahmen" : "Příjmy",
    "Zurück" : "Zpět",
    "Summe" : "Souhrn",
    "Fahrzeugtyp" : "Typ vozidla",
    "Verschieben" : "Přestěhovat",
    "Rückalarmieren" : "Odvolat",
    "Alarmieren" : "Vyslat",
    "FMS" : "Status vozidla",
    "Max. Personenzahl" : "Max. počet posádky",
    "Verletzte" : "Zranění",
    "Personen im Fahrzeug" : "Osoby ve vozidle",
    "Aktueller Einsatz" : "Aktuální mise",
    "Laufleistung gesamt" : "Ujetý počet kilometrů",
    "Fahrzeuge an der Einsatzstelle" : "Vozidla na místě",
    "Fahrzeuge auf Anfahrt" : "Vozidla na cestě",
    "Freie Fahrzeuge" : "Volná vozidla",
    "Credits" : "Kredity",
    "Coins" : "Mince",
    "Fahrzeuge ausgeblendet" : "Vozidla skryty",
    "Einsätze" : "Události",
    "Aus" : "Ne",
    "An" : "Ano",
    "Sprechwunsch" : "Požadavek",
    "Funksprüche" : "Rádiové zprávy",
    "Nachricht" : "Zpráva",
    "Feuerwehrleute" : "Hasiči",
    "Rettungsdienstler" : "Zdravotníci",
    "Polizisten" : "Policisté",
    "Wache" : "Stanice",
    "Statistiken" : "Statistiky",
    "Personalzuweisung" : "Přidělení zaměstnanců",
    "Fahrzeug" : "Vozidlo",
    "Anokunft" : "Příjezd",
    "Einsatz" : "Událost",
    "Besatzung" : "Posádka",
    "Besitzer" : "Vlastník",
    "Entfernung" : "Vzdálenost",
    "LF" : "CAS",
    "FW Anodere" : "Hasiči - ostatní",
    "Rettung" : "ZZS",
    "Polizei" : "Policie",
    "Mitglieder" : "Členové",
    "News" : "Novinky",
    "Verband anzeigen" : "Ukaž alianci",
    "Lehrgänge" : "Kurzy",
    "Bereitstellungsräume" : "Shromažďovací plochy",
    "Verbandskasse" : "Alianční pokladna",
    "Name" : "Jméno",
    "Beschreibung" : "Popis",
    "Gebäude gebaut" : "Postavená budova",
    "Wache erweitert" : "Rozšíření stanice",
    "Einnahmen-Protokoll" : "Přehled příjmů",
    "Täglich" : "Týdenní",
    "Monatlich" : "Měsíční",
    "Regeln" : "Pravidla",
    "Gebäude" : "Budovy",
    "Bewerbung" : "Přihlášky",
    "Verbandsliste" : "Seznam aliancí",
    "Verbandsfinder" : "Hledač aliancí",
    "Vorstellungstext" : "Úvodní text",
    
    "Icon" : "Ikona",
    "Benötigte" : "Potřeba",
    "Löschfahrzeuge" : "Požární vozidla",
    "Maximale Patientenanzahl" : "Maximální počet pacientů",
    "Anoforderungswahrscheinlichkeit" : "pravděpodobnost požadavku",
    "Wert" : "Hodnota",
    "Restzeit" : "Zbývá",
    
    
    
    

    
    
    
    
    
    
};

regex = {};

for (key in replacements) {

regex[key] = new RegExp(key, 'g');

}

 

textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

 

for (var i = 0; i < textnodes.snapshotLength; i++) {

node = textnodes.snapshotItem(i);

s = node.data;

for (key in replacements) {

s = s.replace(regex[key], replacements[key]);

}

node.data = s;

}

 

})();