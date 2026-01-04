/*jshint esversion: 10, multistr: true */
/* globals OLCore, olAnchorNavigation, OLi18n */

// ==UserScript==
// @name:en        Onlineliga Liveticker intl
// @name           Onlineliga Liveticker intl
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.6.1
// @license        LGPLv3
// @description:en Pseudo live ticker for www.onlineliga.de (OFA)
// @description    Pseudo-Liveticker für www.onlineliga.de (OFA)
// @author         KnutEdelbert
// @match          https://www.onlineliga.de/*
// @match          https://www.onlineliga.at/*
// @match          https://www.onlineliga.ch/*
// @match          https://www.onlineleague.co.uk/*
// @require        https://greasyfork.org/scripts/439467-oli18n/code/OLi18n.user.js
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_info
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/458697/Onlineliga%20Liveticker%20intl.user.js
// @updateURL https://update.greasyfork.org/scripts/458697/Onlineliga%20Liveticker%20intl.meta.js
// ==/UserScript==

/*********************************************
 * 0.2.1 02.06.2020 Release
 * 0.2.2 12.07.2020 Support for mobile css
 * 0.3.0 29.10.2020 UI for ticker controls (speed/manual mode)
                    Persists speed value with TM internal functions
 * 0.3.1 30.10.2020 Bugfix for manual mode,
                    Code clean ups,
                    GM_addStyle
 * 0.3.2 05.11.2020 Blurring the news headlines
 * 0.3.3 29.12.2020 Bugfix liveticker for playoffs
                    Hide table of actual matchday
 * 0.3.4 31.12.2020 Hide Spoiler (headlines, text, icons)
                    Bugfix playoffs
 * 0.3.5 03.01.2021 Bugfix Spoiler in mobile view
                    Bugfix Spoiler toggling
                    Show Spoilers from previous line when showing next line.
 * 0.4.0 27.01.2021 Speech mode
                    Settings panel
                    font awesome icons
                    hide action indicators on No-Spoiler-Mode
                    more spoiler texts
 * 0.4.1 01.02.2021 support for de-*languages for voice output
                    set rate and pitch for voice output
 * 0.4.2 02.02.2021 Bugfix Spoiler on speech mode
 * 0.4.3 02.02.2021 Fix for numbers on speech mode
 * 0.4.4            more spoiler texts
                    show text on speech mode after voice out
 * 0.5.0 21.03.2021 add conference mode
                    showAllLines async
                    separate End-Button to avoid unintentional press
 * 0.5.1 31.03.2021 filter line catergories
 * 0.5.2 04.04.2021 show load screen earlier
                    abort on preview
                    disabling internal cache per flag
                    show submenu on conference end
                    don't show conference checkboxes on previews
                    User ID Input with right-Click (Mac Support)
 * 0.5.3 19.04.2021 Hotfix: Conference won't start during breaks
 * 0.5.4 06.05.2021 Show Livetable on league conference
 * 0.5.5 23.05.2021 Bugfix Livetable inactive teams, former seasons
 * 0.5.6 24.05.2021 Bugfix Livetable first league
 * 0.5.7 24.05.2021 add support for ch/at
 * 0.5.8 27.07.2021 add more spoiler texts
 * 0.5.9 13.11.2021 Bugfix goal recognition
                    more spoiler texts
 * 0.5.10 30.12.2021 Bugfix inactive Users
                     more spoiler texts
 * 0.5.11 02.02.2022 Bugfix OLCore lib
 * 0.5.12 27.05.2022 Bugfix Livetable
 * 0.5.13 29.05.2022 Bugfix Livetable
 * 0.5.14 07.06.2022 Hotfix new page navigation
 * 0.5.15 08.06.2022 Hotfix new page navigation
 * 0.6.0  10.06.2022 i18n support
 * 0.6.1  07.02.2023 minor bugfixes
 *********************************************/
(function() {
    'use strict';

    // variables
    const $ = unsafeWindow.jQuery;

    const confMatchCacheEnabled = 0;
    let run = false;
    let queueIndex = 0;
    let trQueue = [];
    let tableBody;
    let nextLineHandle;
    let stopWatch;
    let elapsedTime = 0;
    let isPaused = false;
    let liquid_funds;
    const global_result = {};
    let last_tr;
    let last_corner_tr;
    let speechCanceled = false;
    let speechUtt = null;
    let speechOutput = false;
    let confMatches;
    let seasonNumber;
    let seasonWeek;
    let actualMatchDay;
    let rawMatchDay;
    let confWaitDialog;
    const conferenceData = {};
    let liveTable;
    //let text2Speech = false;

    const speechSynth = window.speechSynthesis;
    let speechVoices;
    let tickerEnd = false;

    //deface funds at the start
    addGlobalStyle('.ol-nav-liquid-funds { display: none }', 'liveticker_funds');
    addGlobalStyle('#headlineNewsFull .ol-news-headline { color: transparent !important;  text-shadow: 0 0 25px #FFF; }', 'liveticker_news1');
    addGlobalStyle('#headlineNewsFull .ol-news-headline::selection { color: transparent !important;  text-shadow: 0 0 25px #FFF; }', 'liveticker_news2');
    addGlobalStyle('#headlineNewsFull .ol-news-subheadline  { color: transparent !important;  text-shadow: 0 0 15px #FFF; }', 'liveticker_news3');
    addGlobalStyle('#headlineNewsFull .ol-news-subheadline::selection  { color: transparent !important;  text-shadow: 0 0 15px #FFF; }', 'liveticker_news4');
    addGlobalStyle('.ol-page-content-wrapper.ol-page-content-bg .ol-news-headline.ol-medium { color: transparent !important;  text-shadow: 0 0 18px #000; }', 'liveticker_news5');
    addGlobalStyle('.ol-page-content-wrapper.ol-page-content-bg .ol-news-headline.ol-medium::selection { color: transparent !important;  text-shadow: 0 0 18px #000; }', 'liveticker_news6');
    addGlobalStyle('.ol-page-content-wrapper.ol-page-content-bg .ol-news-subheadline.ol-medium { color: transparent !important;  text-shadow: 0 0 12px #000; }', 'liveticker_news7');
    addGlobalStyle('.ol-page-content-wrapper.ol-page-content-bg .ol-news-subheadline.ol-medium::selection { color: transparent !important;  text-shadow: 0 0 12px #000; }', 'liveticker_news8');

    /*************** Initialize ********************/

    //Preliminary report delay (ms)
    const default_prelim_report_delay = 3000;

    // interval (ms) for lines without text
    const default_baseTime = 1000;

    // Speed of the ticker (chars per second)
    // sets the interval until the next line will be shown.
    // + = faster, - = slower;
    // a speed of 50 means, after a line with a text of 50 chars the next line will appear after one second.
    const default_tickerSpeed = 50;

    //visibility of the conrol panel
    const default_control_panel_display = 'inline-block';

    //value array for tickerSpeed
    const speedSteps = [5,10,20,30,40,50,60,80,100,125,150,175,200,250,300,350,400,500,600,800,1000];

    const speechRateSteps = [0.1,0.2,0.3,0.5,0.7,0.9,1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.7,2.0,2.5,3.0,4.0,5.0,7.0,9.9];
    const speechRateMaxStep = speechRateSteps.length - 1;

    // load variables from GM store
    let prelim_report_delay = GM_getValue('liveTicker_prelim_report_delay') || default_prelim_report_delay;
    let baseTime = GM_getValue('liveTicker_baseTime') || default_baseTime;
    let tickerSpeed = GM_getValue('liveTicker_tickerSpeed') || default_tickerSpeed;
    let ctrlPanelDisplay = GM_getValue('liveTicker_ctrlPanelDisplay') || default_control_panel_display;
    let showSpoilerCheck = GM_getValue('liveTicker_showSpoilerCheck') !== false;
    let speechLang = GM_getValue('liveTicker_speechLang') || '';
    let tickerLanguage = GM_getValue('liveTicker_language') || OLi18n.lang.substring(0,2);
    let speechRate = GM_getValue('liveTicker_speechRate') || 9; // 0- Index of speechRateSteps
    let speechVolume = 1.0; // GM_getValue('liveTicker_speechVolume') || 1.0; // 0 - 1.0
    let speechPitch = GM_getValue('liveTicker_speechPitch') || 1.0; // 0 - 2.0
    let filterTrTypes = GM_getValue('liveTicker_filterTrTypes') || '[]';
    let hiddenTrTypes = JSON.parse(filterTrTypes);

    const t = function(str) {
      return OLi18n.text(str, tickerLanguage);
    };
    const tt = function(str) {
      return OLi18n.tbtext(str, tickerLanguage);
    };

    const failChances = ["Abschluss ist ihm misslungen", "geht in Richtung Tribüne", "muss man diesen Abschluss auch halten", "trudelt eher aufs Tor", "verdient das Prädikat \"verkorkst\"","am Ende fehlt aber doch ein ganzes Stück", "bei diesem Abschluss fehlte das letzte Quäntchen Präzision und Glück","bringt nichts ein","da muss er mehr draus machen","damit stellt man einen Keeper nicht vor Probleme","denn ein gefährlicher Abschluss sieht anders aus","der natürlich kein Problem hat, den Schuss zu entschärfen","der war nicht gut,","deutlich am Tor vorbei","deutlich ins Toraus","fliegt deutlich am Kasten","fliegt deutlich über den Kasten","fliegt gut zehn Meter über den Kasten","fliegt gute zwei Meter neben dem Pfosten ins Toraus","fliegt weit über das Tor","fliegt weit über den Kasten","fliegt zehn Meter am Tor","gar keine Probleme und kann ihn locker festhalten","geht deutlich über den Kasten","geht meterweit übers Tor","geht weit am Kasten vorbei","geht weit am Tor vorbei","gehört in die Kategorie \"völlig misslungen\"","hat er nicht richtig getroffen","ist ein dankbarer Abschluss für Keeper","ist komplett verkorkst","ist ungefährlich","ist viel zu unplatziert","ist völlig misslungen","ist völlig ungefährlich","ist völlig verkorkst","ist völlig verzogen","ist zu unpräzise","kann das auch nichts werden","kann das einfach nichts werden","kann das gar nichts werden","kann das nichts werden","kann den Ball ohne große Mühe festhalten","kann er aber besser","kann er besser","kann er definitiv besser","kann er deutlich besser","kann es nicht funktionieren","Kein guter Abschluss","Kein guter Versuch, viel zu unplatziert","Kein wirklich gefährlicher Abschluss","Keine allzu große Gefahr","Keine Gefahr","keine Gefahr","keine große Mühe die Kugel zu entschärfen","kommt als halbhoher Ball mitten auf den Keeper","kommt aus der Kategorie \"dankbar für den Torwart\"","kommt nicht wirklich gefährlich auf das Tor","kommt viel zu langsam aufs Tor","letztlich total misslungen","misslingt ihm völlig","mit so einem Abschluss kann es nichts werden mit dem Tor","Muss er aber auch, denn ein gefährlicher Abschluss sieht anders aus","Mühelos kann der Keeper","nach dem Abschluss schüttelt der Schütze","nicht richtig getroffen","rauscht meilenweit am Ziel vorbei","Richtig gefährlich war dieser Abschluss aber auch nicht","sah eher nach Eckfahnenzielschießen aus:","Schwacher Abschluss","segelt fast zehn Meter am Tor vorbei","segelt weit über die Latte","So geht es nicht","stellt sich als ungefährlich heraus","Torgefahr sieht anders aus","trifft den Ball nicht gut","trifft die Kugel völlig falsch","Uli Hoeneß Gedächtnis-Abschluss","Und dann so etwas, beim Schuss scheitert er kläglich","unmittelbar nach dem Abschluss geht ein enttäuschtes Raunen durch die Zuschauer","verkorkster Abschluss","verzieht er","völlig falsch getroffen","war aber mal gar nichts","war dann doch eher kläglich","war gar nichts","war ja mal überhaupt nichts","war kein guter Abschluss","war nichts","war überhaupt nichts","was war das denn?","Was war denn da los?","wenn wir ehrlich sind, muss er diesen Schuss auch halten","wird das nichts"];

    const spoilerPattern = [
        /^\s*([^!]+ baut seinen Vorsprung auf drei Treffer aus - und wir befinden uns noch im ersten Abschnitt! )/,
        /^\s*([^!]+ erhöht den Vorsprung auf ein halbes Dutzend! )/,
        /^\s*([^!]+ erzielt den Führungstreffer - und das zu einem perfekten Zeitpunkt! )/,
        /^\s*([^!]+ geht kurz vor dem Halbzeitpfiff in Führung! )/,
        /^\s*([^!]+ geht wieder in Führung! )/,
        /^\s*([^!]+ hat noch nicht genug und baut die Führung aus! )/,
        /^\s*([^!]+ holt sich die Führung zurück! )/,
        /^\s*([^!]+ ist erneut erfolgreich und liegt jetzt mit komfortablen drei Treffern vorne! )/,
        /^\s*([^!]+ ist nicht zu bremsen! )/,
        /^\s*([^!]+ ist heute in Torlaune! )/,
        /^\s*([^!]+ ist wieder vorne! )/,
        /^\s*([^!]+ ist wieder auf Siegkurs! )/,
        /^\s*([^!]+ kann nicht mithalten und [^!]+ baut seine Führung auf [^!]+ Tore aus! )/,
        /^\s*([^!]+ kennt keine Gnade! )/,
        /^\s*([^!]+ lässt den Ausgleich nicht auf sich sitzen und erzielt die erneute Führung! )/,
        /^\s*([^!]+ liegt vorne! Und einen besseren Zeitpunkt für einen Führungstreffer als direkt vor dem Halbzeitpfiff gibt es wohl nicht. )/,
        /^\s*([^!]+ macht den Sack endgültig zu! )/,
        /^\s*([^!]+ schlägt prompt zurück! )/,
        /^\s*([^!]+ stellt die Führung wieder her! )/,
        /^\s*([^!]+ trifft erneut und bastelt am Kantersieg! )/,
        /^\s*([^!]+ trifft zur Führung! Und das zu einem psychologisch wertvollen Zeitpunkt, nämlich direkt vor der Halbzeit! )/,
        /^\s*([^!]+ trifft zur Vorentscheidung! )/,
        /^\s*([^!]+ tut etwas Gutes für sein Torverhältnis! )/,
        /^\s*(Ausgleich in Unterzahl! )/,
        /^\s*(Auweia! Jetzt kommt es aber ziemlich dicke für [^!]+! )/,
        /^\s*(Da fällt der Anschlusstreffer! )/,
        /^\s*(Da hat die Halbzeitansprache wohl gefruchtet, unmittelbar nach Wiederanpfiff das Tor! )/,
        /^\s*(Da ist das Anschlusstor! )/,
        /^\s*(Da ist das nächste Tor für [^!]+! )/,
        /^\s*(Da ist der Anschluss! )/,
        /^\s*(Da ist die erneute Führung! )/,
        /^\s*(Das dürfte es für [^!]+ gewesen sein - [^!]+ baut die Führung aus! )/,
        /^\s*(Das dürfte es gewesen sein: [^!]+ baut die Führung aus! )/,
        /^\s*(Das Führungstor für [^!]+ - so kurz vor dem Pausentee! )/,
        /^\s*(Das geht doch gut los hier! [^!]+ geht früh mit 1:0 in Führung! )/,
        /^\s*(Das ging zu schnell für [^!]+! )/,
        /^\s*(Das war dann wohl die Entscheidung! )/,
        /^\s*(Das war's! [^!]+ trifft und entscheidet die Partie damit wohl für sich! )/,
        /^\s*(Der Angreifer von [^!]+ findet sich erneut im Anstoßkreis wieder - [^!]+ erzielt den nächsten Treffer! )/,
        /^\s*(Der Ball landet schon wieder im Netz - und erneut darf [^!]+ jubeln! )/,
        /^\s*(Der Ball zappelt erneut im Netz von [^!]+ - [^!]+ baut seine Führung auf \w+ Treffer aus! )/,
        /^\s*(Der Einwechselspieler trifft! )/,
        /^\s*(Der Joker sticht! )/,
        /^\s*(Der nächste Treffer! [^!]+ baut seinen Vorsprung aus! )/,
        /^\s*(Der nächste Treffer! [^!]+ tut etwas Gutes für sein Torverhältnis! )/,
        /^\s*(Der nächste Treffer! )/,
        /^\s*(Die Antwort von [^!]+ ließ nicht lange auf sich warten! )/,
        /^\s*(Die Aufholjagd trägt Früchte! )/,
        /^\s*(Die Führung hielt nicht lange! Hier ist schon der Ausgleich! )/,
        /^\s*(Die Klatsche für [^:]+ wird immer schlimmer: )/,
        /^\s*(Diese Einwechslung war eine gute Idee! Der Joker sticht! )/,
        /^\s*(Direkt nach der Pause das Tor! )/,
        /^\s*(Direkt nach Wiederanpfiff das Tor! )/,
        /^\s*(Doch noch die Führung kurz vor der Halbzeit für [^!]+! )/,
        /^\s*(Furioser Beginn! [^!]+ erzielt das frühe Führungstor! )/,
        /^\s*(Führungstreffer für [^!]+! Schon wieder!)/,
        /^\s*(Führung für [^!]+ - so kurz vor Schluss!)/,
        /^\s*(Für [^!]+ geht das hier alles zu schnell: [^!]+ erzielt den nächsten Treffer! )/,
        /^\s*(Game over! [^!]+ baut die Führung aus und wird sich die drei Punkte jetzt wohl kaum noch nehmen lassen! )/,
        /^\s*(Gute Einwechslung! Der Joker sticht! )/,
        /^\s*(Hier gibt es kein langsames Abtasten: [^!]+ trifft zur frühen Führung! )/,
        /^\s*(Ist das die Vorentscheidung? Wahrscheinlich schon! )/,
        /^\s*(Ja, das war's dann wohl hier! )/,
        /^\s*(Jetzt droht die berühmte "Klatsche"! )/,
        /^\s*(Jetzt ist das halbe Dutzend voll! )/,
        /^\s*(Jetzt sind sie bei einem halben Dutzend Tore Vorsprung! )/,
        /^\s*(Kalte Dusche für die Mannschaft [^!]+: Kurz vor dem Halbzeitpfiff kassieren sie noch den Ausgleich! )/,
        /^\s*(Kaum hat der Schiedsrichter die Begegnung wieder angepfiffen, zappelt der Ball schon im Netz! )/,
        /^\s*(Lange muss man hier nicht auf den nächsten Treffer warten: [^!]+ baut seinen Vorsprung aus! )/,
        /^\s*(Mit dieser Einwechslung beweist der Coach ein glückliches Händchen! )/,
        /^\s*(Mit der Einwechslung hat der Coach alles richtig gemacht! )/,
        /^\s*(Oje! [^!]+ zeigt keine Gnade! )/,
        /^\s*(Okay, das war es dann wohl! )/,
        /^\s*(Schon wieder der Joker! )/,
        /^\s*(Schon wieder trifft ein Spieler von [^!]+! )/,
        /^\s*(Sie holen auf! )/,
        /^\s*(Sein dritter Treffer! Hut ab! )/,
        /^\s*(Sie kommen wieder näher! )/,
        /^\s*(Sie schließen auf: )/,
        /^\s*(So kann [^!]+ den Schaden aber nicht begrenzen! )/,
        /^\s*(So schnell kann das gehen! [^!]+ erzielt früh das 1:0! )/,
        /^\s*(Spektakulär! [^!]+ gelingt hier der Ausgleich kurz vor Schluss! )/,
        /^\s*(Tooor! [^!]+ macht den Deckel drauf! )/,
        /^\s*(Tooor!! [^!]+ trifft tatsächlich noch in den letzten Sekunden zum Ausgleich! )/,
        /^\s*(Tooor!! Damit hatten wohl nicht mehr viele gerechnet: [^!]+ gelingt kurz vor Schluss der Ausgleich! )/,
        /^\s*(Und [^!]+ geht doch noch spät in Führung! )/,
        /^\s*(Und [^!]+ schafft schon wieder die Führung! )/,
        /^\s*(Und [^!]+ trifft schon wieder! [.*] baut seine Führung noch in der ersten Halbzeit auf drei Tore aus! )/,
        /^\s*(Und aus der Traum vom Ausgleich! [^!]+ macht den berühmten Sack zu! )/,
        /^\s*(Und da ist auch schon der Ausgleich! )/,
        /^\s*(Und da ist das Anschlusstor! )/,
        /^\s*(Und da ist der Ausgleich noch vor der Pause! )/,
        /^\s*(Und da ist der späte Führungstreffer für [^!]+! )/,
        /^\s*(Und da ist ein Jokertor! )/,
        /^\s*(Und da ist Treffer Nummer \w+! )/,
        /^\s*(Und da klingelt's schon wieder! )/,
        /^\s*(Und da klingelt es doch noch spät im Kasten von [^!]+! )/,
        /^\s*(Und da zappelt der Ball schon im Netz! )/,
        /^\s*(Und dann doch noch die Führung kurz vor der Halbzeit! )/,
        /^\s*(Und dann schafft [^!]+ wieder die Führung! )/,
        /^\s*(Und das nächste Tor! )/,
        /^\s*(Und das ist ein Jokertor! )/,
        /^\s*(Und der Joker trifft! )/,
        /^\s*(Und kurz vor dem Pausenpfiff wird hier wieder alles auf Anfang gestellt, [^!]+ gleicht aus! )/,
        /^\s*(Und direkt vor der Pause fällt der Führungstreffer für [^!]+! Sie kommen wieder näher! )/,
        /^\s*(Und es klingelt schon wieder! )/,
        /^\s*(Und praktisch im Gegenzug klingelt's auf der anderen Seite! )/,
        /^\s*(Und schon [^!]+ der Ball im Netz! [^!]+ mit dem schnellen Führungstreffer! )/,
        /^\s*(Und schon [^!]+ der Ball im Netz! )/,
        /^\s*(Und schon gibt [^!]+ die Führung wieder aus der Hand! )/,
        /^\s*(Und schon sind sie wieder dran: )/,
        /^\s*(Und schon wieder klingelt es! Das war wohl die Vorentscheidung! )/,
        /^\s*(Und schon ist die Führung von [^!]+ wieder \w+! )/,
        /^\s*(Und schon sind sie wieder dran: )/,
        /^\s*(Und sie erhöhen schon wieder! )/,
        /^\s*(Und sie schließen die Lücke! )/,
        /^\s*(Und sie schließen wieder auf: )/,
        /^\s*(Und wieder ist er drin! [^!]+ zeigt sich heute torhungrig! )/,
        /^\s*(Und wieder macht der Joker ein Tor! )/,
        /^\s*(Und wieder muss der Keeper von [^!]+ hinter sich greifen! )/,
        /^\s*(Unfassbar! [^!]+ netzt kurz vor Schluss tatsächlich noch zur Führung ein! )/,
        /^\s*(Unmittelbar nach der Pause zappelt der Ball im Netz! )/,
        /^\s*(Viele Zuschauer sind noch nicht wieder an ihrem Platz angekommen, da zappelt der Ball schon im Netz von [^!]+! )/,
        /^\s*(Vorentscheidung! [^!]+ baut seine Führung weiter aus! )/,
        /^\s*(Wahnsinn! Da ist noch der Ausgleich! )/,
        /^\s*(War das die Vorentscheidung? Wahrscheinlich schon! )/,
        /^\s*(Was für ein Start in die Partie: [^!]+ liegt ganz früh vorne! )/,
        /^\s*(Wenn das mal nicht die Vorentscheidung war! )/,
        /^\s*(Wer hier zu spät kommt, verpasst was: [^!]+ mit dem Blitzstart! )/,
        /^\s*(Wieder der Joker! )/,
        /^\s*(Wieder ist der Ball drin! [^!]+ schenkt die Führung direkt wieder her!)/,
        /^\s*(Wieder jubelt [^!]+!)/,
        /^\s*(Zu einem psychologisch wertvollen Zeitpunkt, nämlich unmittelbar vor der Pause, trifft [^!]+ hier zur Führung! )/
    ];

    const tactic_report_pattern = [
        'Das Team lässt nun wieder eine Balance zwischen Defensive und Offensive erkennen',
        '"Angriff ist die beste Verteidigung"',
        'geht nun mehr Risiko ein und setzt zum Sturmlauf an',
        'ist nun sehr weit vorgerückt',
        'Jetzt treffen zwei Philosophien aufeinander',
        'Beide Mannschaften gehen auf totalen Angriff über!',
        'steht nun knapp hinter der Mittellinie',
        'Volle Power - volle Offensive!',
        'wirft nun alles nach vorne',
        'Voller Fokus auf die Offensive',
        'man will anscheinend das Ergebnis halten',
        '"rührt Beton an"',
        'haben sich jetzt weit zurückgezogen',
        'Für sie scheint die Zeit der Sondertaktik vorbei zu sein',
        'Sie stellen auf "totalen Angriff" um!',
        'Beide Mannschaften nun mit voller Offensive!',
        'Ein Abwehrriegel folgt dem nächsten'
    ];

    const form_report_pattern = [
        'gelingt heute aber auch wirklich gar nichts.',
        'Es läuft gefühlt alles über ihn!',
        'Kaum gewonnene Zweikämpfe und das als Verteidiger!',
        'zu oft hat er das Nachsehen!',
        'Der Defensiv-Akteur gewinnt einfach zu wenige Zweikämpfe...',
        'Er verliert die Mehrzahl der Zweikämpfe!',
        'Der Junge gewinnt heute so gut wie keinen Zweikampf',
        'Der Junge hat bislang fast alle seiner Zweikämpfe gewonnen!',
        'Ihm gelingt heute einfach fast alles...',
        'dem gelingt nichts bislang!',
        'Dem gelingt fast alles!',
        'Dem Spieler gelingt hier und heute fast alles',
        'Ihm gelingt fast alles',
        'Er ist an praktisch jeder Offensivaktion beteiligt!',
        'Klasse Spiel bislang vom Offensivspieler!',
        'Er verliert die Mehrzahl aller Zweikämpfe um den Ball!'
    ];

    /************* Class declarations *****************/

    class OLTable{

        constructor(rows, matchesId, matchDay){
            const that = this;
            const confTeams = [];
            const matchIds = {};
            that.teamObject = {};
            that.table = [];
            that.matches = {};
            let ord = 0;
            for (const mid of matchesId){
                that.matches[mid[0]] = {"home": mid[1].id, "away": mid[2].id};
                matchIds[mid[1].id] = mid[0];
                matchIds[mid[2].id] = mid[0];
                confTeams.push(mid[1].id);
                confTeams.push(mid[2].id);
            }
            rows.each(function(i,tr){
                const teamIdStr = OLCore.convertNumber($(tr).find("span.ol-team-name, span.ol-team-name-inactive").attr("onclick"), true);
                const rowMatch = tr.innerText.replace(/[\n ]{2,}/g,'\t').replace("\tNEU","").replace("\tNEW","").match(/^\t(\d*)\.*\t([^\t]+)\t(\d+)\t(\d+)\t(\d+)\t(\d+)\t(\d+) : (\d+)\t(-?\d+)\t(\d+)\t$/);
                if (rowMatch){
                    const teamId = parseInt(teamIdStr, 10);
                    ord = parseInt(rowMatch[1], 10) || ord;
                    const rowObject = {
                        "teamName" : rowMatch[2],
                        "teamId": teamId,
                        "matchNum" : matchDay === 1 ? 0 : parseInt(rowMatch[3], 10),
                        "win" : matchDay === 1 ? 0 : parseInt(rowMatch[4], 10),
                        "draw" : matchDay === 1 ? 0 : parseInt(rowMatch[5], 10),
                        "loss" : matchDay === 1 ? 0 : parseInt(rowMatch[6], 10),
                        "newwin" : matchDay === 1 ? 0 : parseInt(rowMatch[4], 10),
                        "newdraw" : matchDay === 1 ? 0 : parseInt(rowMatch[5], 10),
                        "newloss" : matchDay === 1 ? 0 : parseInt(rowMatch[6], 10),
                        "goal0" : matchDay === 1 ? 0 : parseInt(rowMatch[7], 10),
                        "goal1" : matchDay === 1 ? 0 : parseInt(rowMatch[8], 10),
                        "newgoal0" : matchDay === 1 ? 0 : parseInt(rowMatch[7], 10),
                        "newgoal1" : matchDay === 1 ? 0 : parseInt(rowMatch[8], 10),
                        "diff" : matchDay === 1 ? 0 : parseInt(rowMatch[9], 10),
                        "points" : matchDay === 1 ? 0 : parseInt(rowMatch[10], 10),
                        "newpoints" : matchDay === 1 ? 0 : parseInt(rowMatch[10], 10),
                        "ord" : matchDay === 1 ? 1 : ord,
                        "cssClass" : "livetable_inactive",
                        "matchId" : matchIds[teamId]
                    };
                    that.teamObject[teamId] = rowObject;
                    that.table.push(rowObject);
                }
            });
            that.initPopup();
            that.livetable();
        }

        startMatch(matchId){
            const homeObj = this.teamObject[this.matches[matchId].home];
            const awayObj = this.teamObject[this.matches[matchId].away];
            homeObj.cssClass = "livetable_active";
            awayObj.cssClass = "livetable_active";
            this.setResultString(matchId, "0:0");
        }

        endMatch(matchId){
            const homeObj = this.teamObject[this.matches[matchId].home];
            const awayObj = this.teamObject[this.matches[matchId].away];
            homeObj.cssClass = "livetable_inactive";
            awayObj.cssClass = "livetable_inactive";
            this.livetable(homeObj.teamId, awayObj.teamId);
        }

        setGlobalResult(result, init){
            this.setResultString(result.matchId, result.result, init);
        }

        setResultString(matchId, result, init){
            const resMatch = result.match(/^\s*(\d+)\s*:\s*(\d+)\s*$/);
            if (resMatch){
                const homeGoals = parseInt(resMatch[1],10);
                const awayGoals = parseInt(resMatch[2],10);
                this.setResult(matchId, homeGoals, awayGoals, init);
            }
        }

        setResult(matchId, homeGoals, awayGoals, init){
            const matchPoints = homeGoals > awayGoals ? [3,0] : (homeGoals < awayGoals ? [0,3] : [1,1]);
            const homeObj = this.teamObject[this.matches[matchId].home];
            const awayObj = this.teamObject[this.matches[matchId].away];

            homeObj.newgoal0 = homeObj.goal0 + homeGoals;
            homeObj.newgoal1 = homeObj.goal1 + awayGoals;
            homeObj.diff = homeObj.newgoal0 - homeObj.newgoal1;
            homeObj.newpoints = homeObj.points + matchPoints[0];
            homeObj.newwin = homeObj.win + matchPoints[0] === 3 ? 1 : 0;
            homeObj.newdraw = homeObj.draw + matchPoints[0] === 1 ? 1 : 0;
            homeObj.newloss = homeObj.loss + matchPoints[0] === 0 ? 1 : 0;

            awayObj.newgoal0 = awayObj.goal0 + awayGoals;
            awayObj.newgoal1 = awayObj.goal1 + homeGoals;
            awayObj.diff = awayObj.newgoal0 - awayObj.newgoal1;
            awayObj.newpoints = awayObj.points + matchPoints[1];
            awayObj.newwin = awayObj.win + matchPoints[1] === 3 ? 1 : 0;
            awayObj.newdraw = awayObj.draw + matchPoints[1] === 1 ? 1 : 0;
            awayObj.newloss = awayObj.loss + matchPoints[1] === 0 ? 1 : 0;

            if (!init) {
                this.livetable(this.matches[matchId].home, this.matches[matchId].away);
            }
        }

        sortTable(){
            this.table.sort(
                (a, b) => (
                    b.newpoints - a.newpoints ||
                    b.diff - a.diff ||
                    b.newgoal0 - a.newgoal0
                )
            );
        }

        initPopup(){
            $("body").append(`<div id="livetable_popup" style="display:none;position:absolute;top:400px;left:50px;z-index:9999;box-shadow: 6px 6px 5px #888888;border-radius:6px;border:1px solid #4f4f4f;">
<div id="livetable_popup_bar" style="padding-top:2px;font-size:18px;font-weight:bold;width:100%;background-color:#5e8daa;position:relative;top:0;border-radius:6px 6px 0 0; vertical-align:middle; text-align:center;height:30px;color:white;cursor:move;">
Blitztabelle<span id="livetable_btn_close" style="float:right;padding-right:6px;padding-top:3px;cursor:pointer" class="fa fa-close"></span></div>
<table id="livetable_table"><thead><tr><th /><th>Pl.</th><th>${tt("Mannschaft")}</th><th>${tt("Diff.")}</th><th>${tt("Pkt.")}</th></tr></thead><tbody></tbody></table></div>`);
            const offset = { x: 0, y: 0 };
            const popup = document.getElementById("livetable_popup");
            const popup_bar = document.getElementById("livetable_popup_bar");
            const btn_close = document.getElementById("livetable_btn_close");

            popup_bar.addEventListener('mousedown', mouseDown, false);
            window.addEventListener('mouseup', mouseUp, false);

            function mouseUp()
            {
                window.removeEventListener('mousemove', popupMove, true);
            }

            function mouseDown(e){
                offset.x = e.clientX - popup.offsetLeft;
                offset.y = e.clientY - popup.offsetTop;
                window.addEventListener('mousemove', popupMove, true);
            }

            function popupMove(e){
                popup.style.position = 'absolute';
                var top = e.clientY - offset.y;
                var left = e.clientX - offset.x;
                popup.style.top = top + 'px';
                popup.style.left = left + 'px';
            }
            //-- / let the popup make draggable & movable.

            window.onkeydown = function(e){
                if(e.keyCode == 27){ // if ESC key pressed
                    btn_close.click(e);
                }
            };

            btn_close.onclick = function(e){
                popup.style.display = "none";
            };


        }

        livetable(home, away){
            $("table#livetable_table > tbody").children().remove();
            this.sortTable();
            const len = this.table.length;
            let ord = 0;
            let lastOrd = {p: -1, d: 0, g: 0};
            let highlightClass = "";
            for (let i = 0; i < len; i++){
                const row = this.table[i];
                highlightClass = "";
                if (row.teamId === home || row.teamId === away){
                    highlightClass = " blitztabelle_highlight_active";
                } else if(i%2 === 0) {
                    highlightClass = " blitztabelle_highlight_even";
                }
                let ordString = "";
                if (!(row.newpoints === lastOrd.p && row.diff === lastOrd.d && row.newgoal0 === lastOrd.g)){
                    ord = i+1;
                    ordString = ord.toString() + ".";
                }
                const ordSign = ord < row.ord ? "&#9650;" : (ord > row.ord ? "&#9660;" : "&#9724;");
                const ordColor = ord < row.ord ? "green" : (ord > row.ord ? "red" : "black");
                $("table#livetable_table > tbody").append(`<tr class="${row.cssClass}${highlightClass}"><td style="color:${ordColor};">${ordSign}</td><td>${ordString}</td><td>${row.teamName}</td><td>${(row.diff > 0 ? '+': '') + row.diff}</td><td>${row.newpoints}</td></tr>`);
                lastOrd = {p: row.newpoints, d: row.diff, g: row.newgoal0};
            }
            const popup = $("div#livetable_popup");
            popup.show();
        }

    }

    /************* Functions declarations *************/

    // injects css styles to the page
    function addGlobalStyle(css, id) {
        let head, style;
        if ($("#"+id).length) {
            return;
        }
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        if(id){ style.id = id; }
        head.appendChild(style);
    }

    // deface mobile scores
    function defaceMobileScores(){
        if (!run) {
            $('div.mobile-matchday-table-result').append('<div class="mobile-matchdaytable-result liveticker_mobile_score">X : X</div>');
            $('div.mobile-matchday-table-result').append('<div class="mobile-matchdaytable-halftime-result liveticker_mobile_score_halftime">( X : X )</div>');
        } else {
            $('div.liveticker_mobile_score').remove();
            $('div.liveticker_mobile_score_halftime').remove();
        }
    }

    function hideSpoiler(){
        //hide headlines and symbols
        for (const trItem of trQueue){
            if (!trItem.final && !trItem.halftime && !trItem.tr.parentNode){
                $(trItem.tr).find('div.ol-match-result-icon').addClass('liveticker_hideSpoiler');
                $(trItem.tr).find('div.ol-match-report-text-statistic').addClass('liveticker_hideSpoiler');
                $(trItem.tr).find('div.ol-match-report-text-statistic-goal').addClass('liveticker_hideSpoiler');
                $(trItem.tr).find('div.match-corners-sponsor').addClass('liveticker_hideSpoiler');
                $(trItem.tr).find('div.ol-match-report-text-statistic-goal').addClass('liveticker_hideSpoiler');
                $(trItem.tr).find('td.match-corners-sponsors').addClass('liveticker_hideSpoiler');
                $(trItem.tr).find('td.sameTeam').addClass('liveticker_hideSpoiler');
                $(trItem.tr).find('div.sameTeam').addClass('liveticker_hideSpoiler');
            }
        }
    }

    function showSpoiler(){
        $('.liveticker_hideSpoiler').removeClass('liveticker_hideSpoiler');
        for (const trItem of trQueue){
            $(trItem.tr).find('.liveticker_hideSpoiler').removeClass('liveticker_hideSpoiler');
        }
    }

    function parseTicker(tBody, withoutPrelim, matchId){
        let arr;
        const cornerSwaps = [];
        let cornerTickerText;
        let cornerTr;
        let cornerMinute;
        let isPreliminary = false;
        const linesArray = [];

        tBody = tBody || tableBody;
        matchId = matchId || '';

        // swap lines in array
        function swap(input, index_A, index_B) {
            const temp = input[index_A];
            input[index_A] = input[index_B];
            input[index_B] = temp;
        }

        //detach ticker lines
        arr = $.makeArray($("tr",tBody).detach());

        //rearrange corner lines for correct display
        arr.forEach(function(tr, index){
            if($(tr).find('td.match-corners-sponsors').length){
                cornerSwaps.push([index,index+2]);
            }
        });
        cornerSwaps.forEach(function(sw){
            swap(arr,sw[0],sw[1]);
        });

        //show ticker div
        $('style#liveticker_matchContent').remove();
        //show scoreboard with initial score
        $('div.matchScore').text('0 : 0');
        $('style#liveticker_matchScore').remove();

        let tickerMinute = 0;
        let conferenceOrder = 0;
        let iconTD;

        // loop over the lines and calculate the time, the line is shown before displaing the next line
        arr.forEach(function(tr, index){

            let textLen = 0;

            //wrap spoiler text for hiding
            function spoilerText(text){
                const rgx = /^\s*<span>/;
                let stripSpan = false;
                if (text.match(rgx)){
                    stripSpan = true;
                }
                if (stripSpan){
                    text = text.replace(/^\s*<span>/,"");
                }
                for (const p of spoilerPattern){
                    if (text.match(p)){
                        text = text.replace(p, "<span class=\"liveticker_hideSpoiler\">$1</span>");
                        break;
                    }
                }
                if (stripSpan){
                    text = "<span>" + text;
                }
                return '<span class="liveticker_typewriter">' + text + '</span>';
            }

            // gets the minute value of a ticker lin
            function getTickerMinute(tr){
                let minute;
                let overTime;

                const minuteSpan = $(tr).find('td.matchresult-time > span.ol-match-report-minute');
                const overtimeTd = $(tr).find('td.matchresult-overtime');
                if (minuteSpan.length > 0){
                    minute = parseInt(minuteSpan[0].innerText, 10);
                }
                if (overtimeTd.length > 0 && $.trim(overtimeTd[0].innerText).length > 0){
                    overTime = parseInt($.trim(overtimeTd[0].innerText), 10);
                }
                return minute + (overTime > 0 ? overTime : 0);
            }

            // gets the text of a ticker line
            function getTickerText(tr, trim){
                let text;
                const contentDiv = $(tr).find('div.ol-match-report-text');
                if (contentDiv && contentDiv[0] && contentDiv[0].innerText){
                    const tickerTextSpan = $(contentDiv).find('span.ol-match-report-text');
                    if (tickerTextSpan && tickerTextSpan[0] && tickerTextSpan[0].innerHTML){
                        text = tickerTextSpan[0].innerHTML;
                        tickerTextSpan.html(spoilerText(text));
                    }
                    text = contentDiv[0].innerText;
                    if (trim) { return $.trim(text); }
                    return text;
                }
                return null;
            }

            // gets the headline of a ticker line
            function getTickerHeadline(tr, trim){
                const headline = $(tr).find(".ol-match-report-text-statistic");
                if (headline && headline[0] && headline[0].innerText){
                    const text = headline[0].innerText;
                    if (trim) { return $.trim(text); }
                    return text;
                }
                return null;
            }

            // gets the headline of a ticker line with a goal
            function getGoalHeadline(tr, trim){
                const headline = $(tr).find(".ol-match-report-text-statistic-goal");
                if (headline && headline[0] && headline[0].innerText){
                    const text = headline[0].innerText;
                    if (trim) { return $.trim(text); }
                    return text;
                }
                return null;
            }

            /*
              WHISTLE
              SCORING_CHANCE
              GOAL
              FAZIT
              YELLOWREDCARD
              REDCARD
              INJURY
              PENALTYGOAL
              PENALTY_MISS
              PRE_PENALTY
              TAKTIK_MATCHREPORT
              SUBSTITUTION

              FREEKICK
              CORNERSPONSOR
              CORNER
              STADIUMINFO
              REPORT
              YELLOWCARD
              DEFAULT

              */
            function getTrIconText(tr, minute){
                const iconDiv = $(tr).find("td:nth-child(4) > div[class*='icon-icon_']");
                let iconType = "DEFAULT";
                if (iconDiv.length > 0){
                    const classAttr = iconDiv.attr("class");
                    const m = classAttr.match(/\bicon-icon_([^\s]*)\b/);
                    if (m.length > 1){
                        iconType = m[1].toUpperCase();
                    }
                }
                const descrSpan = $(tr).find("td:nth-child(1) > span.ol-match-report-minute:nth-child(1)");
                if (descrSpan.length > 0){
                    const descr = descrSpan.text().trim().toUpperCase();
                    if (descr === "FAZIT"){
                        iconType = "FAZIT";
                    }
                }
                return iconType;
            }

            const resultText = getGoalHeadline(tr, true);
            const headline = getTickerHeadline(tr, true);
            const trTickerMinute = getTickerMinute(tr);
            let trType = getTrIconText(tr);
            const trText = getTickerText(tr, true);

            if (trTickerMinute > tickerMinute || trType === "FAZIT"){
                conferenceOrder++;
            }
            tickerMinute = trTickerMinute || tickerMinute;

            if (matchId && confMatches){
                if (trType === "STADIUMINFO"){
                    iconTD = $(tr).find("td.sameTeam");
                }
                if (tickerMinute > 0) {
                    $(tr).find("td.sameTeam").remove();
                }
            }

            if (trText && trType === "SCORING_CHANCE" && failChances.some(fc => trText.includes(fc))){
                trType = "FAIL_CHANCE";
            }

            /*
            if (trType === "REPORT" && tactic_report_pattern.some(v => trText.includes(v))) {
                trType = "REPORT_TACTIC";
            }
            */

            if (headline && (headline.toUpperCase().startsWith(t("FOUL UND ELFMETER FÜR")) || headline.toUpperCase().startsWith(t("ELFMETER FÜR")))){
                trType = "PRE_PENALTY";
            }

            const trObj = {"tr":tr, "resultText":resultText, "headline":headline, "minute": tickerMinute, "conferenceOrder" : conferenceOrder, "matchId": matchId, "type": trType};

            // the first match line (preliminary report ends)
            if (isPreliminary && ($(tr).find('div.icon-icon_stadiuminfo').length || tr.innerText.indexOf(t('Die 1. Halbzeit wird präsentiert von')) > 0)){
                isPreliminary = false;
            }

            if (tickerMinute === 1 && headline && headline.toUpperCase() === t("ANPFIFF")){
                trObj.start = true;
            }
            if (headline && headline.toUpperCase() === t("ABPFIFF")){
                trObj.final = true;
            }
            if (headline && headline.toUpperCase() === t("HALBZEIT")){
                trObj.halftime = true;
            }

            let trClass = `liveticker_trtype_${trType}`;

            if (tr.style.display === 'none') {
                // hidden lines with no delay
                trObj.delay = 0;
                trObj.type = "HIDDEN";
                //linesArray.push({"tr":tr, "delay":0, "resultText":resultText, "headline":headline, "minute": tickerMinute, "conferenceOrder" : conferenceOrder, "matchId": matchId, "type": "HIDDEN"});
            } else if ($(tr).hasClass('sponsored-corner')){
                // corner line with text
                // corner line with content has no delay to the next line
                // because the sponsored line must be displayed immediately after
                cornerTickerText = trText;
                cornerMinute = tickerMinute;
                cornerTr = tr;
                trObj.delay = 0;
                //linesArray.push({"tr":tr, "delay":0, "resultText":resultText, "headline":headline, "minute": tickerMinute, "conferenceOrder" : conferenceOrder, "matchId": matchId, "type": trType});
            } else if ($(tr).find('td.match-corners-sponsors').length){
                // corner line without text/only "presented by"
                // sponsored corner line gets the text length of the corner line text
                if (tickerMinute > 0 && iconTD){
                    const iconCornerTD = iconTD.clone();
                    iconCornerTD.attr("rowspan", "2");
                    iconCornerTD.appendTo(tr);
                }
                trObj.text = cornerTickerText;
                trObj.textLen = cornerTickerText.length;
                trObj.minute = cornerMinute;
                trObj.ttsTr = cornerTr;
                trObj.type = "CORNERSPONSOR";
                trObj.trType = "CORNER";
                trClass = "liveticker_trtype_CORNER";
                //linesArray.push({"tr":tr, "text" : cornerTickerText , "textLen" : cornerTickerText.length, "resultText":resultText, "headline":headline, "minute": cornerMinute, "conferenceOrder" : conferenceOrder, "ttsTr": cornerTr, "matchId": matchId, "type": "CORNERSPONSOR"});
            } else if ($(tr).find(`td.conclusion > span:contains('${t("VORBERICHT")}')`).length){
                // append first preliminary report line immediately
                trObj.minute = -1;
                trObj.delay = 0;
                trObj.type = "PRELIM";
                //if (!withoutPrelim) {
                //    linesArray.push({"tr":tr, "delay":0, "minute": -1, "conferenceOrder" : conferenceOrder, "matchId": matchId, "type": "PRELIM"});
                //}
                //$(tBody).append(tr);
                isPreliminary = true;
            } else if (isPreliminary){
                // append preliminary report lines immediately
                trObj.minute = -1;
                trObj.delay = 0;
                trObj.type = "PRELIM";
                //if (!withoutPrelim) {
                //    linesArray.push({"tr":tr, "delay":0, "minute": -1, "conferenceOrder" : conferenceOrder, "matchId": matchId, "type": "PRELIM"});
                //}
                //$(tBody).append(tr);
            } else { // "normal" text lines
                //calculate delay for the next line:
                if (tickerMinute > 0 && iconTD){
                    iconTD.clone().appendTo(tr);
                }
                const tickerText = trText;
                if (tickerText){
                    // use "normal" text-length
                    textLen = tickerText.length;
                } else {
                    // use default delay
                    textLen = default_tickerSpeed;
                }
                trObj.text = tickerText;
                trObj.textLen = textLen;
                trObj.ttsTr = tr;
                //set new time for the next line
                //linesArray.push({"tr":tr, "text" : tickerText , "textLen" : textLen, "resultText":resultText, "headline":headline, "minute": tickerMinute, "conferenceOrder" : conferenceOrder, "ttsTr": tr, "matchId": matchId, "type": trType});
            }
            $(trObj.tr).addClass(trClass);
            $(trObj.tr).addClass(`Minute${tickerMinute}`);
            if (!isPreliminary || !withoutPrelim){
                linesArray.push(trObj);
            }
        });

        return linesArray;
    }

    function zahlwort(zahl, lang) {

        lang = lang || tickerLanguage;

        if (lang === "de") {

            const sonderzahlen = [];
            sonderzahlen[11] = 'elf';
            sonderzahlen[12] = 'zwölf';
            sonderzahlen[16] = 'sechzehn';
            sonderzahlen[17] = 'siebzehn';

            const zahlen = [];
            zahlen[1] = 'ein';
            zahlen[2] = 'zwei';
            zahlen[3] = 'drei';
            zahlen[4] = 'vier';
            zahlen[5] = 'fünf';
            zahlen[6] = 'sechs';
            zahlen[7] = 'sieben';
            zahlen[8] = 'acht';
            zahlen[9] = 'neun';
            zahlen[10] = 'zehn';
            zahlen[20] = 'zwanzig';
            zahlen[30] = 'dreißig';
            zahlen[40] = 'vierzig';
            zahlen[50] = 'fünfzig';
            zahlen[60] = 'sechzig';
            zahlen[70] = 'siebzig';
            zahlen[80] = 'achtzig';
            zahlen[90] = 'neunzig';

            const einheiten = ['','tausend','Million','Milliarde','Billion'];
            let trennschritte = 1000;
            let zahlinworten = "";

            if(zahl===0) {
                zahlinworten = "null";
            }

            const zahl_len = Math.ceil((Math.floor(Math.log10(zahl))+1) / 3);

            for(let i=0;i< zahl_len;i++) {
                if(i>einheiten.length-1) {
                    return null;
                }
                const zahlenblock = (i === 0? zahl % trennschritte : ((zahl % trennschritte) - (zahl % (trennschritte / 1000))) / (trennschritte / 1000));
                const einer = zahlenblock % 10;
                const zehn = zahlenblock % 100;
                const hunderter = (zahlenblock - (zahlenblock % 100)) / 100;
                const einheitenendung = einheiten[i].substr(einheiten[i].length-1,1);

                if(zahlenblock>0) {
                    if(zahlenblock>1 && einheitenendung === "n") {
                        zahlinworten = " " + einheiten[i] + "en " + zahlinworten;
                    } else if(zahlenblock>1 && einheitenendung === "e") {
                        zahlinworten = " " + einheiten[i] + "n " + zahlinworten;
                    } else if(zahlenblock>0 && i===1) {
                        zahlinworten = einheiten[i] + zahlinworten;
                    } else {
                        zahlinworten = " " + einheiten[i] + " " + zahlinworten;
                    }
                }

                if(zehn>0) {
                    if(zehn===1 && i===0) {
                        zahlinworten = "eins" + zahlinworten;
                    } else if(zehn===1 && i===1) {
                        zahlinworten = "ein" + zahlinworten;
                    } else if(zehn===1 && i>1) {
                        zahlinworten = "eine" + zahlinworten;
                    } else if(sonderzahlen[zehn]) {
                        zahlinworten = sonderzahlen[zehn] + zahlinworten;
                    } else {
                        if(zehn>9) {
                            zahlinworten = zahlen[zehn-einer] + zahlinworten;
                        }
                        if(zehn>20 && einer>0) {
                            zahlinworten = "und" + zahlinworten;
                        }
                        if(einer>0) {
                            zahlinworten = zahlen[einer] + zahlinworten;
                        }
                    }
                }

                if(hunderter>0) {
                    zahlinworten = zahlen[hunderter] + "hundert" + zahlinworten;
                }
                trennschritte *= 1000;
            }
            return zahlinworten.trim();
        }
        if (lang === 'en') {
            const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
            const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

            const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/;

            const getLT20 = (n) => a[Number(n)];
            const getGT20 = (n) => b[n[0]] + ' ' + a[n[1]];

            function numWords (input) {
                const num = Number(input);
                if (isNaN(num)) return '';
                if (num === 0) return 'zero';

                const numStr = num.toString();
                if (numStr.length > 9) {
                    throw new Error('overflow'); // Does not support converting more than 9 digits yet
                }

                const [, n1, n2, n3, n4, n5] = ('000000000' + numStr).substr(-9).match(regex); // left pad zeros

                let str = '';
                str += n1 != 0 ? (getLT20(n1) || getGT20(n1)) + 'crore ' : '';
                str += n2 != 0 ? (getLT20(n2) || getGT20(n2)) + 'lakh ' : '';
                str += n3 != 0 ? (getLT20(n3) || getGT20(n3)) + 'thousand ' : '';
                str += n4 != 0 ? getLT20(n4) + 'hundred ' : '';
                str += n5 != 0 && str != '' ? 'and ' : '';
                str += n5 != 0 ? (getLT20(n5) || getGT20(n5)) : '';

                return str.trim();
            }

            return numWords(zahl);
        }
    }

    function minuteToText(minute){

        const lang = tickerLanguage;

        function m2t(m){
            return m < 20 ? zahlwort(m) + "te" : zahlwort(m) + "ste";
        }

        function replaceWithOrdinalVariant(match, numberWord) {
            return ordinalLessThanThirteen[numberWord];
        }

        function makeOrdinal(words) {
            // Ends with *00 (100, 1000, etc.) or *teen (13, 14, 15, 16, 17, 18, 19)
            if (ENDS_WITH_DOUBLE_ZERO_PATTERN.test(words) || ENDS_WITH_TEEN_PATTERN.test(words)) {
                return words + 'th';
            }
            // Ends with *y (20, 30, 40, 50, 60, 70, 80, 90)
            else if (ENDS_WITH_Y_PATTERN.test(words)) {
                return words.replace(ENDS_WITH_Y_PATTERN, 'ieth');
            }
            // Ends with one through twelve
            else if (ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN.test(words)) {
                return words.replace(ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN, replaceWithOrdinalVariant);
            }
            return words;
        }

        function toWordsOrdinal(number) {
            const words = zahlwort(number);
            return makeOrdinal(words);
        }

        if (lang === 'de') {

            switch(minute){
                case 1:
                    return "erste";
                case 2:
                    return "zweite";
                case 3:
                    return "dritte";
                case 7:
                    return "siebte";
                case 8:
                    return "achte";
                default:
                    return m2t(minute);
            }
        }

        if (lang === 'en') {

            const ENDS_WITH_DOUBLE_ZERO_PATTERN = /(hundred|thousand|(m|b|tr|quadr)illion)$/;
            const ENDS_WITH_TEEN_PATTERN = /teen$/;
            const ENDS_WITH_Y_PATTERN = /y$/;
            const ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN = /(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/;
            const ordinalLessThanThirteen = {
                zero: 'zeroth',
                one: 'first',
                two: 'second',
                three: 'third',
                four: 'fourth',
                five: 'fifth',
                six: 'sixth',
                seven: 'seventh',
                eight: 'eighth',
                nine: 'ninth',
                ten: 'tenth',
                eleven: 'eleventh',
                twelve: 'twelfth'
            };

            return toWordsOrdinal(minute);

        }
    }

    //removes spoiler from ticker text
    function spoilerText2Speech(text){
        for (const p of spoilerPattern){
            if (text.match(p)){
                text = text.replace(p, "");
                return text;
            }
        }
        return text;
    }

    function makeNumberWord(m){
        return zahlwort(parseInt(m,10));
    }

    //returns the ticker text without spoiler
    function getSpeechText(tr, minute){
        let text;
        if (!tr){
            return null;
        }
        const contentDiv = $(tr).find('div.ol-match-report-text');
        if (contentDiv && contentDiv[0] && contentDiv[0].innerText){
            const tickerTextSpan = $(contentDiv).find('span.ol-match-report-text');
            if (tickerTextSpan && tickerTextSpan[0]){
                text = tickerTextSpan[0].innerText;
                text = text.replace(/ [-–] /g,', ');
                if (minute > 0){
                    text = minuteToText(minute) + ' ' + tt("Minute") + ': ' + text;
                }
                return spoilerText2Speech(text).replace(/(\d+)\.(?=\d{3}(\D|$))/g, "$1").replace(/\d+/g, makeNumberWord);
            }
        }
        return null;
    }

    function decativateSpeech(pause){
        speechCanceled = true;
        speechOutput = false;
        if (speechSynth.cancel) { speechSynth.cancel();}
        $('#liveticker_IconSpeech').show();
        $('#liveticker_IconNoSpeech').hide();
        if (!pause){
            if (!isPaused) tickerPause(true);
        }
    }

    // pauses the ticker
    function tickerPause(speechActivate){
        const icnPlay = $("#liveticker_IconPlay");
        const icnPause = $("#liveticker_IconPause");
        clearTimeout(nextLineHandle);
        icnPlay[0].style.display = 'inline-block';
        icnPause[0].style.display = 'none';
        icnPlay[0].parentNode.title = 'Play';
        isPaused = true;
        if (!speechActivate){
            elapsedTime = Date.now() - stopWatch;
            if (speechOutput){
                decativateSpeech(true);
            }
        }
    }

    // enqueue next ticker line with the given time delay
    function queueNextLineAll(){
        setTimeout(function(){
            showNextLineAll();
        }, 0);
    }

    // displays the next ticker line
    function showNextLineAll(){
        if (queueIndex === trQueue.length) {
            return;
        }
        const time = showLine(queueIndex++);
        if (time < 0) {
            return;
        }
        queueNextLineAll();
    }

    // ends the ticker and show all ticker lines
    function showAllLines(){
        showNextLineAll();
    }

    // returns the "reading time" of a ticker line based on the text length and tickerSpeed
    function getRowTime(index){
        if (index < 0){
            return prelim_report_delay;
        }
        const trItem = trQueue[index];
        if (hiddenTrTypes.includes(trItem.trType || trItem.type)){
            return 0;
        }
        const rowTime = (trItem.textLen ? Math.round((trItem.textLen/parseInt($("#inpLivetickerSpeed").val(), 10)) * baseTime) : trItem.delay || 0);
        return rowTime;
    }

    // displays the ticker line with the given index
    function showLine(index){

        const trItem = trQueue[index];

        if (index >= trQueue.length) {
            return -1;
        }

        const matchId = trItem.matchId;
        const rowTime = getRowTime(index);

        if ($(".liveticker_scoreboard_table td").length && rowTime > 0){
            $(".liveticker_scoreboard_table td").removeClass("liveticker_highlight");
            $(`td#td${matchId}`).addClass("liveticker_highlight");
        }

        function displayLine(itm){
            const tr = itm.tr;
            const matchId = itm.matchId;

            $(tableBody).prepend(tr);
            if (index === trQueue.length-1 || ($(tr).is(':visible') && !$(tr).find('td.match-corners-sponsors').length)){
                if (last_corner_tr){
                    $(last_corner_tr).find('.liveticker_hideSpoiler').removeClass('liveticker_hideSpoiler');
                    last_corner_tr = undefined;
                }
                $(last_tr).find('.liveticker_hideSpoiler').removeClass('liveticker_hideSpoiler');
            }
            if ($(tr).hasClass('sponsored-corner')){
                last_corner_tr = tr;
            }

            if (global_result.result && !showSpoilerCheck){
                const resultMatchId = global_result.matchId || '';
                if (liveTable) {
                    liveTable.setGlobalResult(global_result);
                }
                $(`div#matchScore${global_result.matchId || ''}`).text(global_result.result);
                $(`div#matchScore${global_result.matchId || ''}`).effect("pulsate", {}, 1000);
                global_result.result = undefined;
                global_result.matchId = '';
            }
            if (itm.resultText){
                // display goals on scoreboards
                const result = itm.resultText.match(/(\d+\s*:\s*\d+)/g);
                if (result && result[0]){
                    global_result.result = result[0].replace(":"," : ");
                    if (matchId > 0) {
                        global_result.matchId = matchId;
                    }
                    if (showSpoilerCheck){
                        if (liveTable) {
                            liveTable.setGlobalResult(global_result);
                        }
                        $(`div#matchScore${global_result.matchId || ''}`).text(global_result.result);
                        $(`div#matchScore${global_result.matchId || ''}`).effect("pulsate", {}, 1000);
                    }
                }
            }
            if (itm.start){
                if (liveTable){
                    liveTable.startMatch(matchId);
                }
            }
            if (itm.halftime){
                // show intermediate score on halftime
                $('style#liveticker_intermediateScore').remove();
                if (matchId > 0) {
                    $(`div#intermediateScore${matchId}`).show();
                }
            }
            if (itm.final){
                if (liveTable){
                    liveTable.endMatch(matchId);
                }
                $(`td#td${matchId}`).addClass("liveticker_endgame");
            }
            if ($(tr).is(':visible')) {
                last_tr = tr;
            }
            if (index === trQueue.length-1){
                //on last line
                //show results on matchday table (remove previously created style tag)
                $('style#liveticker_mobile-matchdaytable-halftime-result').remove();
                $('style#liveticker_mobile-matchdaytable-result').remove();
                $('style#liveticker_resultscell').remove();
                $('style#liveticker_matchtable').remove();
                $('style#liveticker_news1').remove();
                $('style#liveticker_news2').remove();
                $('style#liveticker_news3').remove();
                $('style#liveticker_news4').remove();
                $('style#liveticker_news5').remove();
                $('style#liveticker_news6').remove();
                $('style#liveticker_news7').remove();
                $('style#liveticker_news8').remove();
                $('style#liveticker_playoff_results').remove();
                $('td.sameTeam').show();
                //$("div.ol-navbar-subnav-collapse-nav-container").show();
                //show correct bank balance
                $('div#navLeagueInfo').find('.ol-nav-liquid-funds').text(liquid_funds);
                run = true;
                return -1;
            }
            elapsedTime = 0;
        }

        if (speechOutput){
            const speechText = getSpeechText(trItem.ttsTr, trItem.minute);
            if (speechText){
                const voice = speechVoices.find(v => v.name === $('#liveticker_selVoices').val());
                const ssu = new SpeechSynthesisUtterance();
                if (voice === undefined) {
                    ssu.lang = 'de-DE';
                } else {
                    ssu.voice = voice;
                }
                ssu.text = speechText;
                ssu.onend = function(){
                    displayLine(trItem);
                    if (!speechCanceled) {
                        showNextLine();
                    }
                    if (tickerEnd){
                        tickerPause();
                        showAllLines();
                        tickerEnd = false;
                    }
                };
                ssu.rate = speechRateSteps[speechRate] || 1.0;
                ssu.pitch = speechPitch;
                ssu.volume = speechVolume;
                speechUtt = ssu;
                speechSynth.speak(ssu);
            } else {
                displayLine(trItem);
                showNextLine();
            }
        } else {
            displayLine(trItem);
        }

        return rowTime;
    }

    // enqueue next ticker line with the given time delay
    function queueNextLine(time){
        time = (time < 0 ? 0 : time);
        nextLineHandle = setTimeout(function(){
            showNextLine();
        }, time);
    }

    // displays the next ticker line
    function showNextLine(manual){
        const time = showLine(queueIndex++);
        if (manual || speechOutput || time < 0) {
            return time;
        }
        queueNextLine(time - elapsedTime);
        stopWatch = Date.now();
        return time;
    }

    function hideTrTypes(){
        for (const htt of hiddenTrTypes){
            if ($(`style#liveticker_trtypestyle_${htt}`).length === 0){
                addGlobalStyle(`tr.liveticker_trtype_${htt} {display: none;}`, `liveticker_trtypestyle_${htt}`);
                $(`input#liveticker_filter_${htt}`).prop('checked', false);
            }
        }
    }

    function createControls(){

        showSpoilerCheck = GM_getValue('liveTicker_showSpoilerCheck') !== false;

        function getVoices() {
            return new Promise(function(resolve, reject) {
                let voices = speechSynth.getVoices();
                if (voices.length) {
                    resolve(voices.filter(v => v.lang.substring(0,2) === tickerLanguage));
                    return;
                }
                speechSynthesis.onvoiceschanged = function() {
                    voices = speechSynthesis.getVoices();
                    resolve(voices.filter(v => v.lang.substring(0,2) === tickerLanguage));
                };
            });
        }

        function setTickerCSS(){

            //hide results in matchday table
            addGlobalStyle('.results-cell { display: none }', 'liveticker_resultscell');
            addGlobalStyle('div.mobile-matchdaytable-result:first-of-type { display:none }', 'liveticker_mobile-matchdaytable-result');
            addGlobalStyle('div.mobile-matchdaytable-halftime-result:nth-of-type(2) { display:none }', 'liveticker_mobile-matchdaytable-halftime-result');

            //hide results of playoff matches
            addGlobalStyle('td.ol-font-highlight:nth-child(7) { color:transparent }', 'liveticker_playoff_results');

            //hide div for ticker temporarily to avoid a short view until the lines are detached
            addGlobalStyle('div#matchContent { display: none }', 'liveticker_matchContent');

            //hide scoreboard temporarily to avoid a short view until the lines are detached
            addGlobalStyle('div.matchScore { display: none }', 'liveticker_matchScore');

            //hide intermediate scoreboard until halftime
            addGlobalStyle('div.intermediateScore { display: none }', 'liveticker_intermediateScore');

            //hide matchday table
            addGlobalStyle('div#ol-table-content { display: none }', 'liveticker_matchtable');

            $('td.sameTeam').hide();

        }

        // returns the closest discrete value from the tickerspeed array for the given value
        function getClosestSpeedIndex(value){
            var closest = speedSteps.reduce(function(prev, curr) {
                return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
            });
            return speedSteps.indexOf(closest);
        }

        // sets the speed for the ticker
        function setTickerSpeed(value){
            tickerSpeed = value;
            $("#inpLivetickerSpeed").val(tickerSpeed);
            GM_setValue('liveTicker_tickerSpeed',tickerSpeed);
            if (isPaused) {
                return;
            }
            clearTimeout(nextLineHandle);
            elapsedTime = Date.now() - stopWatch;
            queueNextLine(getRowTime(queueIndex-1)-elapsedTime);
        }

        // pauses the ticker an show next line immediatly
        function evt_tickerNext(){
            if (speechSynth.cancel) {speechSynth.cancel();}
            if (speechOutput){
                return;
            }
            tickerPause();
            let time = showNextLine(true);
            while (time === 0){
                time = showNextLine(true);
            }
        }

        function activateSpeech(){
            speechCanceled = false;
            speechOutput = true;
            if (!isPaused) tickerPause(true);
            let time = showNextLine();
            while (time === 0){
                time = showNextLine();
            }
            $('#liveticker_IconSpeech').hide();
            $('#liveticker_IconNoSpeech').show();
        }

        // pauses the ticker an show next line immediatly
        function evt_toggleSpeech(){
            if (!speechOutput) {
                activateSpeech();
            } else {
                decativateSpeech();
            }
        }

        // pauses the ticker an show all lines immediatly
        function evt_tickerEnd(){
            tickerEnd = true;
            if (speechOutput && speechSynth.cancel) {
                speechCanceled = true;
                speechOutput = false;
                speechSynth.cancel();
                //window.setTimeout(function(){
                //}, );
            } else {
                tickerPause();
                showAllLines();
                tickerEnd = false;
            }
        }

        // decrease the speed by one step
        function evt_tickerSlower(){
            const speedIndex = Math.max(getClosestSpeedIndex(tickerSpeed) - 1, 0);
            $("#inpLivetickerSlider").val(speedIndex);
            setTickerSpeed(speedSteps[speedIndex] || 50);
        }

        // increase the speed by one step
        function evt_tickerFaster(){
            const speedIndex = Math.min(getClosestSpeedIndex(tickerSpeed) + 1, speedSteps.length - 1);
            $("#inpLivetickerSlider").val(speedIndex);
            setTickerSpeed(speedSteps[speedIndex] || 50);
        }

        // continues the ticker
        function tickerPlay(){
            const icnPlay = $("#liveticker_IconPlay");
            const icnPause = $("#liveticker_IconPause");
            icnPlay[0].style.display = 'none';
            icnPause[0].style.display = 'inline-block';
            icnPlay[0].parentNode.title = 'Pause';
            isPaused = false;
            if (speechOutput){
                decativateSpeech(true);
            }
            showNextLine(false);
        }

        // toggle the ticker
        function evt_tickerPlayPause(){
            const icnPlay = $("#liveticker_IconPlay");
            if (icnPlay[0].style.display === 'none') {
                tickerPause();
            } else {
                tickerPlay();
            }
        }

        //toggle the control panel
        function evt_toggleControls(){
            const ctrl = $("#liveticker_controls")[0];
            if (ctrl.style.display === 'none') {
                ctrl.style.display = 'inline-block';
            } else {
                ctrl.style.display = 'none';
            }
            GM_setValue('liveTicker_ctrlPanelDisplay', ctrl.style.display);
        }

        //toggle the Settings panel
        function evt_toggleSettings(){
            const ctrl = $("#liveticker_settings")[0];
            const ctrl2 = $("#liveticker_filter")[0];
            if (ctrl.style.display === 'none' || $("#liveticker_settings").is(':hidden')) {
                ctrl.style.display = 'inline-block';
                ctrl2.style.display = 'inline-block';
            } else {
                ctrl.style.display = 'none';
                ctrl2.style.display = 'none';
            }
        }

        function evt_toggleSpoiler(event){
            const check = event.target.checked;
            if (check){
                showSpoiler();
                showSpoilerCheck = true;
                GM_setValue('liveTicker_showSpoilerCheck', true);
            } else {
                hideSpoiler();
                showSpoilerCheck = false;
                GM_setValue('liveTicker_showSpoilerCheck', false);
            }
        }

        // sets the value of the speed value input
        function evt_setInputSpeedValue(evt){
            const value = speedSteps[evt.currentTarget.value] || 50;
            setTickerSpeed(value);
        }

        function evt_speechVolumeUp(){
            speechVolume = Math.min(1.0, speechVolume + 0.1);
            GM_setValue('liveTicker_speechVolume', speechVolume);
        }

        function evt_speechVolumeDown(){
            speechVolume = Math.max(0, speechVolume - 0.1);
            GM_setValue('liveTicker_speechVolume', speechVolume);
        }

        function evt_speechPitchUp(){
            speechPitch = Math.min(2.0, speechPitch + 0.2);
            $('#liveticker_voicePitch').text(speechPitch.toFixed(1));
            GM_setValue('liveTicker_speechPitch', speechPitch);
        }

        function evt_speechPitchDown(){
            speechPitch = Math.max(0, speechPitch - 0.2);
            $('#liveticker_voicePitch').text(speechPitch.toFixed(1));
            GM_setValue('liveTicker_speechPitch', speechPitch);
        }

        function evt_speechRateUp(){
            speechRate = Math.min(speechRateMaxStep, speechRate + 1);
            $('#liveticker_voiceRate').text(speechRateSteps[speechRate].toFixed(1));
            GM_setValue('liveTicker_speechRate', speechRate);
        }

        function evt_speechRateDown(){
            speechRate = Math.max(0, speechRate - 1);
            $('#liveticker_voiceRate').text(speechRateSteps[speechRate].toFixed(1));
            GM_setValue('liveTicker_speechRate', speechRate);
        }

        function evt_updateTrFilter(evt){
            const tgt = $(evt.currentTarget);
            const trType = tgt.attr("data-type");
            if (tgt.is(":checked")){
                if (hiddenTrTypes.includes(trType)){
                    hiddenTrTypes = hiddenTrTypes.filter(item => item !== trType);
                    GM_setValue('liveTicker_filterTrTypes', JSON.stringify(hiddenTrTypes));
                    $(`style#liveticker_trtypestyle_${trType}`).remove();
                }
            } else {
                if (!hiddenTrTypes.includes(trType)){
                    hiddenTrTypes.push(trType);
                    GM_setValue('liveTicker_filterTrTypes', JSON.stringify(hiddenTrTypes));
                    if ($(`style#liveticker_trtypestyle_${trType}`).length === 0){
                        addGlobalStyle(`tr.liveticker_trtype_${trType} {display: none;}`, `liveticker_trtypestyle_${trType}`);
                    }
                }
            }
        }

        setTickerCSS();

        // UI for the controls
        const headLineButton = $('div#matchReportWrap button.ol-button-toggle:nth-child(1)');
        const ctrlLiveticker = $(`<div class="liveticker_bar"><span id="spnLivetickerLabel">Pseudo-Liveticker</span><span id="spnLivetickerVersion">v.${GM_info.script.version}</span></div>`);
        const settingsLiveticker = $('<div id="liveticker_settings" class="liveticker_bar"></div>');
        const livetickerControls = $('<div id="liveticker_controls" />');
        const inputSpeedValue = $(`<input title="${tt("Ticker-Geschwindigkeit (Zeichen pro Sekunde)")}" id="inpLivetickerSpeed" value="${tickerSpeed.toString()}" class="ol-double-slider-input-from ol-numeric-input ol-transfer-list-numeric-input" data-target="#liveTickerSlider" data-min="10" data-max="1000" disabled>`);
        const sliderSpeedValue = $(`<div class="liveticker-slider"><input id="inpLivetickerSlider" type="range" min="0" max="${speedSteps.length - 1}" step="1" value="${(speedSteps.indexOf(tickerSpeed) || 0)}"></div>`);
        const divAbout = $(`<div class="liveticker-about"> &copy; <div style="display:inline" class="ol-user-name " onclick="messageSystem.openChatWithUser(${OLi18n.KnutEdelbertId});"> KnutEdelbert <div class=" msg-icon-class"><span class="icon-ol-speechbubble-icon liveticker-contact"></span></div></div></div>`);
        const btnPlayPause = $(`<button title="${tt("Pause")}" class="ol-button ol-button-rectangle liveticker-button" id="btnLivetickerPlayPause"><span style="display:none" id="liveticker_IconPlay" class="fa fa-play"></span><span id="liveticker_IconPause" class="fa fa-pause"></span></button>`);
        const btnNext = $(`<button title="${tt("Nächste Zeile (pausiert den Ticker)")}" class="ol-button ol-button-rectangle liveticker-button" id="btnLivetickerNext"><span class="fa fa-step-forward"></span></button>`);
        const btnSpeech = $(`<button title="${tt("Sprachausgabe")}" class="ol-button ol-button-rectangle liveticker-button" id="btnLivetickerSpeech"><span id="liveticker_IconSpeech" title="${tt("Sprachausgabe aktivieren")}" class="fa fa-volume-up"></span><span title="${tt("Sprachausgabe deaktivieren")}" id="liveticker_IconNoSpeech" class="fa fa-volume-off"></span></button>`);
        const btnEnd = $(`<button title="${tt("Alle Zeilen anzeigen (beendet den Ticker)")}" class="ol-button ol-button-rectangle liveticker-button" id="btnLivetickerEnd" style="margin-left:50px;"><span class="fa fa-fast-forward"></span></button>`);
        const btnMinus = $(`<button title="${tt("Langsamer")}" class="ol-button ol-button-rectangle liveticker-button" id="btnLivetickerMinus"><span id="liveticker_IconSlow">&lt;</span></button>`);
        const btnPlus = $(`<button title="${tt("Schneller")}" class="ol-button ol-button-rectangle liveticker-button" id="btnLivetickerPlus"><span id="liveticker_IconFast">&gt;</span></button>`);
        const chkHideHL = $(`<div style="display:inline-block"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input id="liveticker_checkSpoiler" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`);
        const selLanguage = $(`<select class="liveticker_select" id="liveticker_selLang"></select>`);
        const selLanguageWrapper = $(`<div class="liveticker_voiceSettings liveticker_select-wrapper" id="liveticker_select_lang-wrapper"></div>`);
        const selVoices = $(`<select class="liveticker_select" id="liveticker_selVoices"></select>`);
        const selVoiceWrapper = $(`<div class="liveticker_voiceSettings liveticker_select-wrapper" id="liveticker_select-wrapper"></div>`);
        const btnSettings = $(`<button title="${tt("Einstellungen")}" class="ol-button ol-button-rectangle liveticker-button" id="btnLivetickerSettings"><span id="liveticker_IconSettings" class="fa fa-cog"></span></button>`);
        const btnVoiceVolumeDown = $(`<button title="${tt("Leiser")}" class="ol-button ol-button-rectangle liveticker-button liveticker_voiceSettings" id="btnLivetickerVoiceVolumeDown"><span class="fa fa-volume-down"></span></button>`);
        const btnVoiceVolumeUp = $(`<button title="${tt("Lauter")}" class="ol-button ol-button-rectangle liveticker-button liveticker_voiceSettings" id="btnLivetickerVoiceVolumeUp"><span class="fa fa-volume-up"></span></button>`);
        const btnVoiceRateDown = $(`<button title="${tt("Langsamer")}" class="ol-button ol-button-rectangle liveticker-button liveticker_voiceSettings" id="btnLivetickerVoiceRateDown"><span class="fa fa-angle-double-left"></span></button>`);
        const btnVoiceRateUp = $(`<button title="${tt("Schneller")}" class="ol-button ol-button-rectangle liveticker-button liveticker_voiceSettings" id="btnLivetickerVoiceRateUp"><span class="fa fa-angle-double-right"></span></button>`);
        const spnVoiceRate = $(`<span class="liveticker_voiceSettings" id="liveticker_voiceRate" title="${tt("Sprechgeschwindigkeit")}"></span>`);
        const btnVoicePitchDown = $(`<button title="${tt("Tiefer")}" class="ol-button ol-button-rectangle liveticker-button liveticker_voiceSettings" id="btnLivetickerVoicePitchDown"><span class="fa fa-chevron-circle-down"></span></button>`);
        const btnVoicePitchUp = $(`<button title="${tt("Höher")}" class="ol-button ol-button-rectangle liveticker-button liveticker_voiceSettings" id="btnLivetickerVoicePitchUp"><span class="fa fa-chevron-circle-up"></span></button>`);
        const spnVoicePitch = $(`<span class="liveticker_voiceSettings" id="liveticker_voicePitch" title="${tt("Stimmlage")}"></span>`);

        selLanguageWrapper.append(selLanguage);
        selVoiceWrapper.append(selVoices);
        ctrlLiveticker.append(sliderSpeedValue);
        ctrlLiveticker.append(btnMinus);
        ctrlLiveticker.append(inputSpeedValue);
        ctrlLiveticker.append(btnPlus);
        ctrlLiveticker.append(btnPlayPause);
        ctrlLiveticker.append(btnNext);
        ctrlLiveticker.append(btnSpeech);
        ctrlLiveticker.append(btnEnd);
        settingsLiveticker.append($('<label>Spoiler: </label>'));
        settingsLiveticker.append(chkHideHL);
        settingsLiveticker.append($(`<label class="liveticker_voiceSettings">${tt("Sprache")}: </label>`));
        settingsLiveticker.append(selLanguageWrapper);
        btnSpeech.hide();
        settingsLiveticker.append($(`<label class="liveticker_voiceSettings">${tt("Stimme")}: </label>`));
        settingsLiveticker.append(selVoiceWrapper);
        settingsLiveticker.append(btnVoiceRateDown);
        settingsLiveticker.append(spnVoiceRate);
        settingsLiveticker.append(btnVoiceRateUp);
        settingsLiveticker.append(btnVoicePitchDown);
        settingsLiveticker.append(spnVoicePitch);
        settingsLiveticker.append(btnVoicePitchUp);
        $('.liveticker_voiceSettings').hide();

        //Filter
        const filterLiveticker = $(`<div id="liveticker_filter" class="liveticker_bar"><label class="liveticker_voiceSettings">${tt("Filter")}: </label></div>`);

        ctrlLiveticker.append(btnSettings);
        ctrlLiveticker.append(divAbout);
        livetickerControls.append(ctrlLiveticker);
        livetickerControls.append(settingsLiveticker);
        livetickerControls.append(filterLiveticker);
        livetickerControls.insertBefore("div#matchContent");
        livetickerControls[0].style.display = ctrlPanelDisplay;

        $('#liveticker_selLang').append($("<option />").attr("value", "de").text(tt("Deutsch")));
        $('#liveticker_selLang').append($("<option />").attr("value", "en").text(tt("Englisch")));
        if (tickerLanguage){
            $('#liveticker_selLang').val(tickerLanguage);
        }

        getVoices().then(function(voices){
            speechVoices = voices;
            $('#btnLivetickerSpeech')[0].style.display = 'inline-block';
            $('.liveticker_voiceSettings').show();
            $('#liveticker_voicePitch').text(speechPitch.toFixed(1));
            $('#liveticker_voiceRate').text(speechRateSteps[speechRate].toFixed(1));
            for (const v of voices){
                const key = v.name;
                const value = v.name.split(' - ')[0].replace("Microsoft ", "MS ").replace(" Desktop", " D");
                $('#liveticker_selVoices')
                    .append($("<option />")
                            .attr("value", key)
                            .text(value));
            }
            if (speechLang){
                $('#liveticker_selVoices').val(speechLang);
            }
        });

        /*
        $('<div class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="GOAL" id="liveticker_filter_GOAL" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>')
            .appendTo(filterLiveticker);
        $('<div class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_goal"/></div>').appendTo(filterLiveticker);
        */
        $(`<div title="${tt("Gute Torchance")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="SCORING_CHANCE" id="liveticker_filter_SCORING_CHANCE" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Gute Torchance")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_scoring_chance" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Torchance")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="FAIL_CHANCE" id="liveticker_filter_FAIL_CHANCE" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Torchance")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_scoring_chance" style="opacity: 0.5" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Elfmeter")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="PRE_PENALTY" id="liveticker_filter_PRE_PENALTY" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Elfmeter")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_penaltygoal" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Freistoß")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="FREEKICK" id="liveticker_filter_FREEKICK" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Freistoß")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_freekick" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Eckball")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="CORNER" id="liveticker_filter_CORNER" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Eckball")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_corner" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("An/Abpiff")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="WHISTLE" id="liveticker_filter_WHISTLE" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("An/Abpiff")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_whistle" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Gelbe Karte")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="YELLOWCARD" id="liveticker_filter_YELLOWCARD" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Gelbe Karte")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_yellowcard" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Gelbrote Karte")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="YELLOWREDCARD" id="liveticker_filter_YELLOWREDCARD" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Gelbrote Karte")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_yellowredcard" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Rote Karte")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="REDCARD" id="liveticker_filter_REDCARD" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Rote Karte")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_redcard" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Verletzung")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="INJURY" id="liveticker_filter_INJURY" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Verletzung")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_injury" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Formationswechsel")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="TAKTIK_MATCHREPORT" id="liveticker_filter_TAKTIK_MATCHREPORT" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Formationswechsel")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_taktik_matchreport" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Auswechslung")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="SUBSTITUTION" id="liveticker_filter_SUBSTITUTION" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Auswechslung")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_substitution" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Kommentar")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="REPORT" id="liveticker_filter_REPORT" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Kommentar")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_report" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Vorbericht")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="STADIUMINFO" id="liveticker_filter_STADIUMINFO" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Vorbericht")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon icon-icon_stadiuminfo" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Fazit")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="FAZIT" id="liveticker_filter_FAZIT" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Fazit")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon_fontawesome fa fa-file-text" /></div>`).appendTo(filterLiveticker);

        $(`<div title="${tt("Normal (ohne Icon)")}" class="liveticker_filter_check"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liverticker_filter_check" data-type="DEFAULT" id="liveticker_filter_DEFAULT" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div>`)
            .appendTo(filterLiveticker);
        $(`<div title="${tt("Normal (ohne Icon)")}" class="liveticker_filter_icon_wrap"><div class="liveticker_filter_icon_fontawesome fa fa-circle-o" /></div>`).appendTo(filterLiveticker);

        $("div#liveticker_filter").on("click", 'input[type="checkbox"]', evt_updateTrFilter);

        $("input.liverticker_filter_check").prop('checked', true);

        $("input#liveticker_checkSpoiler")[0].checked = showSpoilerCheck;
        if (speechOutput){
            $("span#liveticker_IconSpeech").hide();
            activateSpeech();
        } else {
            $("span#liveticker_IconNoSpeech").hide();
        }

        $(`<div id="liveticker_display" title="${tt("Liveticker Steuerung ein-/ausblenden")}" style="display:inline-block;background-color:red;border:1px solid red;color:white;border-radius: 4px;cursor:pointer;font-weight:bold;padding-left:4px; padding-right:4px;">LIVE</div>`).insertAfter(headLineButton);
        $("div#matchReportWrap").on('click','#btnLivetickerPlayPause',evt_tickerPlayPause);
        $("div#matchReportWrap").on('click','#btnLivetickerNext',evt_tickerNext);
        $("div#matchReportWrap").on('click','#btnLivetickerSpeech',evt_toggleSpeech);
        $("div#matchReportWrap").on('click','#btnLivetickerEnd',evt_tickerEnd);
        $("div#matchReportWrap").on('click','#btnLivetickerMinus',evt_tickerSlower);
        $("div#matchReportWrap").on('click','#btnLivetickerPlus',evt_tickerFaster);
        $("div#matchReportWrap").on('click','#btnLivetickerSettings',evt_toggleSettings);
        $("div#matchReportWrap").on('input','#inpLivetickerSlider',evt_setInputSpeedValue);
        $("div#matchReportWrap").on('click','#liveticker_display',evt_toggleControls);
        $("div#matchReportWrap").on('click','#liveticker_checkSpoiler',evt_toggleSpoiler);

        btnVoiceVolumeDown.click(evt_speechVolumeDown);
        btnVoiceVolumeUp.click(evt_speechVolumeUp);
        btnVoiceRateDown.click(evt_speechRateDown);
        btnVoiceRateUp.click(evt_speechRateUp);
        btnVoicePitchDown.click(evt_speechPitchDown);
        btnVoicePitchUp.click(evt_speechPitchUp);

        $("select#liveticker_selVoices").change(function(){
            speechLang = this.value;
            GM_setValue('liveTicker_speechLang', this.value);
        });

        $("select#liveticker_selLang").change(function(){
            speechLang = this.value;
            GM_setValue('liveTicker_language', this.value);
        });
    }

    // starts the main ticker function
    function startTicker(){
        $(function(){

            createControls();

            trQueue = [];
            queueIndex = 0;
            tableBody = $("div#matchContent > div > div.ol-match-report-line > table > tbody")[0];
            trQueue = parseTicker();

            if (!showSpoilerCheck){
                hideSpoiler();
            }

            hideTrTypes();

            $("div.matchScore").attr("id", "matchScore");

            // enqueue next line with the preliminary report delay
            nextLineHandle = setTimeout(function(){
                showNextLine();
            }, prelim_report_delay);

        });
    }

    function getData(ajaxurl) {
        return $.ajax({
            url: ajaxurl,
            type: 'GET',
        });
    }

    function deleteCache(){
        const listValues = GM_listValues();
        for (const val of listValues.filter(v => {return /^\/match\?season=\d+&matchId=\d+$/.test(v);})){
            GM_deleteValue(val);
        }
    }

    async function fetchMatchTicker(season, matchId){
        const url = `/match?season=${season}&matchId=${matchId}`;
        let details = confMatchCacheEnabled ? GM_getValue(url) : null;
        if (!details){
            console.log(`Request for match ${matchId}`);
            details = await getData(url);
            if (confMatchCacheEnabled) {
                GM_setValue(url, details);
            }
        } else {
            console.log(`Cache Hit for match ${matchId}`);
        }
        return details;
    }

    async function fetchTeamMatchId(userId){
        const url = `/team/overview?userId=${userId}`;
        const details = await getData(url);
        const matchLink = $(details).find(`div.row.league-match-overview-wrapper:has(div:first-child:contains('${t("LIGA AKTUELL")}')) div.team-overview-current-match-result[onclick]`);
        if (matchLink.length === 0){
            return;
        }
        const matchIdMatch = matchLink.attr("onclick").match(/\s*'?matchId'?\s*:\s*(\d+)\s*}/);
        if (!matchIdMatch) {
            return;
        }
        const matchId = matchIdMatch[1];
        return matchId;
    }

    async function fetchMatchDayTable(matchDay, leagueLevel, leagueId, season){
        season = season || OLCore.Base.season;
        const url = `/matchdaytable/leaguetable?season=${season}&matchday=${matchDay}&leagueLevel=${leagueLevel}&leagueId=${leagueId}&stateId=9&leagueMatchday=0&type=1&nav=true&navId=matchdayTable`;
        const tableData = await getData(url);
        return $(tableData).find("tr#ol-td");
        /*
        let matchDayTable = GM_getValue(`liveticker_livetable_${matchDay}|${leagueLevel}|${leagueId}`);
        if (!matchDayTable){
            console.log(`Request for matchDay ${matchDay}`);
            const tableData = await getData(url);
            matchDayTable = $("tr#ol-td")[0].parentNode.innerText;
            GM_setValue(`liveticker_livetable_${matchDay}|${leagueLevel}|${leagueId}`, matchDayTable);
        } else {
            console.log(`Cache Hit for matchDay ${matchDay}|${leagueLevel}|${leagueId}`);
        }
        return matchDayTable;
        */
    }


    async function buildLiveTable(matchDay, leagueLevel, leagueId, tableSeason, matchesId){
        const tableData = await fetchMatchDayTable(matchDay-1 || 1, leagueLevel, leagueId, tableSeason);
        if (tableData){
            liveTable = new OLTable(tableData, matchesId, matchDay);
        }
    }

    async function startConference(matchDay, leagueLevel, leagueId, confSeason){

        confSeason = confSeason || OLCore.Base.season;

        if (!confWaitDialog) {
            confWaitDialog = $(`<div id="conference_wait_dialog" class="conference_wait_popup">${tt("Lade Daten")} <span id="player_export_load_num"></span><div width="100%"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>`).dialog({
                classes: {},
                hide: { effect: "fade" },
                show: { effect: "fade" }
            });
        }

        $("div#matchdayresult").hide();
        $("div#matchReportWrap > *:not(:last-child)").hide();
        $('style#liveticker_intermediateScore').remove();

        createControls();
        tableBody = $("div#matchContent > div > div.ol-match-report-line > table > tbody")[0];
        $(tableBody).html("");

        const confArray = confMatches.split(',');
        let confLen = confArray.length;
        const matchesId = [];
        if (confSeason > 0){

            const listValues = GM_listValues();
            for (const val of listValues.filter(v => {return /^\/match\?season=\d+&matchId=\d+$/.test(v);})){
                const matchUrlMatch = val.match(/^\/match\?season=(\d+)&matchId=(\d+)$/);
                const seasonNum = parseInt(matchUrlMatch[1],10);
                const matchNum = matchUrlMatch[2];
                const sw = val.split('|')[2];
                if (!confArray.includes(matchNum) || seasonNum !== confSeason ){
                    GM_deleteValue(val);
                }
            }
            const tmpConfArray = [...confArray];
            for (const matchId of tmpConfArray){
                console.log(`Fetching Data for match ${matchId}`);
                let matchData = await fetchMatchTicker(confSeason, matchId);

                // Check, if match is already played
                const matchClick = $(matchData).find("div#matchdayresult div.ol-league-name > span[onclick]").attr("onclick");
                const gameMatchDayMatch = matchClick.match(/\s*'?season'?\s*:\s*(\d+),\s*'?matchday'?\s*:\s*(\d+)\s*/);
                let gameMatchDay = "0";
                let gameSeason = "0";
                if (gameMatchDayMatch) {
                    gameSeason = gameMatchDayMatch[1];
                    gameMatchDay = gameMatchDayMatch[2];
                }
                const confMatchRawMatchDay = parseInt(gameSeason + gameMatchDay.padStart(2,0),10);
                console.log("confMatchRawMatchDay", confMatchRawMatchDay);
                if (rawMatchDay <= confMatchRawMatchDay){
                    alert(`${tt("Spiel")} ID ${matchId} ${t("liegt in der Zukunft und wird aus der Konferenz entfernt")}`);
                    confArray.splice(confArray.indexOf(matchId),1);
                } else {
                    conferenceData[matchId] = {};
                    const mdr = $(matchData).find("div#matchdayresult > div.ol-page-content > div.row > div");
                    matchData = matchData.replace('id="matchdayresult"', `id="matchdayresult${matchId}"`);
                    const matchTBody = $(matchData).find("div#matchContent > div > div.ol-match-report-line > table > tbody")[0];
                    const home = $(mdr[0]).children("div").last().children("span").first();
                    const away = $(mdr[2]).children("div").last().children("span").first();
                    const teamIdHome = parseInt(home.attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
                    const teamIdAway = parseInt(away.attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
                    const teamNameHome = home.text();
                    const teamNameAway = away.text();
                    matchesId.push([matchId, {"id": teamIdHome, "name": teamNameHome}, {"id": teamIdAway, "name": teamNameAway}]);
                    conferenceData[matchId].teams = {};
                    conferenceData[matchId].teams[teamIdHome] = {};
                    conferenceData[matchId].teams[teamIdAway] = {};
                    conferenceData[matchId].trQueue = parseTicker(matchTBody, true, matchId);
                    conferenceData[matchId].scoreBoard = $(matchData).find(`div#matchdayresult${matchId}`);
                }
            }
            confLen = confArray.length;
            if (confLen === 0){
                alert(tt("Konferenz konnte nicht geladen werden. Keine Spiele ausgewählt."));
            }
            trQueue = [];
            let noMoreMinuteLines = 0;
            let nextLine;
            let startSponsor = false;
            let halfSponsor = false;
            for (let i = 0; i < 120; i++){
                noMoreMinuteLines = 0;
                while (noMoreMinuteLines < confLen){
                    noMoreMinuteLines = 0;
                    for (const matchId of confArray){
                        if (conferenceData[matchId].trQueue.length && conferenceData[matchId].trQueue[0].minute === i){
                            let nextTr = conferenceData[matchId].trQueue.shift();
                            if (conferenceData[matchId].trQueue.length === 0){
                                nextTr.isLastRow = true;
                            }
                            if (i < 2 && $(nextTr.tr).find('div.matchreport-sponsor').length > 0){
                                if(!startSponsor){
                                    trQueue.push(nextTr);
                                    startSponsor = true;
                                }
                            } else if (i < 46 && $(nextTr.tr).find('div.matchreport-sponsor').length > 0){
                                if(!halfSponsor){
                                    trQueue.push(nextTr);
                                    halfSponsor = true;
                                }
                            } else {
                                trQueue.push(nextTr);
                            }
                            let trDelay = nextTr.delay;
                            while (trDelay === 0){
                                nextTr = conferenceData[matchId].trQueue.shift();
                                trDelay = nextTr.delay;
                                trQueue.push(nextTr);
                            }
                        } else {
                            noMoreMinuteLines++;
                        }
                    }
                }
            }
        }

        $($("div#leagueNavWrapper > div#ol-bg-pattern")[1]).hide();
        $($("div#leagueNavWrapper > div#ol-bg-pattern")[0]).removeClass("ol-state-bg-color-12");
        $($("div#leagueNavWrapper > div#ol-bg-pattern")[0]).addClass("ol-state-bg-color-17");
        $($("div#leagueNavWrapper > div#ol-bg-pattern")[0]).css("opacity", "0.1");
        //$("div.ol-navbar-subnav-collapse-nav-container").hide();
        $("tr",$("div#matchContent > div > div.ol-match-report-line > table > tbody")).remove();
        //$("div#matchReportWrap > *:not(:last-child)").hide();
        OLCore.waitForKeyElements (
            "div.comment_widget",
            function() {$("div.comment_widget").hide();}
        );

        $('<div id="liveticker_scoreboard_wrapper"><table id="liveticker_scoreboard_table4" class="liveticker_scoreboard_table"><tbody><tr><td class="confTD" colspan="2" /></tr></tbody></table></div>').insertBefore("div#matchdayresult");

        if (confLen > 1){
            $("table#liveticker_scoreboard_table4 > tbody > tr:first-child").append('<td class="confTD" colspan="2" />');
        }
        if (confLen > 4){
            $("table#liveticker_scoreboard_table4 > tbody > tr:first-child").append('<td class="confTD" colspan="2" />');
        }
        if (confLen > 2){
            $("table#liveticker_scoreboard_table4 > tbody").append('<tr><td class="confTD" colspan="2"/><td class="confTD" colspan="2" /></tr>');
        }
        if (confLen > 4){
            $("table#liveticker_scoreboard_table4 > tbody > tr:nth-child(2)").append('<td class="confTD" colspan="2" />');
        }
        if (confLen > 6){
            $("table#liveticker_scoreboard_table4 > tbody").append('<tr><td class="confTD" colspan="2"/><td class="confTD" colspan="2" /><td class="confTD" colspan="2" /></tr>');
        }
        if(confLen === 3 || confLen === 5 || confLen === 8){
            $("table#liveticker_scoreboard_table4 > tbody > tr:last-child > td:first-child").removeAttr("colspan");
            $("table#liveticker_scoreboard_table4 > tbody > tr:last-child > td:first-child").removeAttr("class");
            $("table#liveticker_scoreboard_table4 > tbody > tr:last-child").append('<td />');
        }
        if (confLen === 7){
            $("table#liveticker_scoreboard_table4 > tbody > tr:last-child > td:not(:nth-child(2))").removeAttr("class");
        }

        $("table#liveticker_scoreboard_table4 td.confTD").each(function(i, e){
            $(e).attr("id",`td${i}`);
        });

        for (let i = 0; i < confLen; i++){
            const matchId = confArray[i];
            conferenceData[matchId].scoreBoard.css("cssText", "top: 0;margin: 0px !important;");
            conferenceData[matchId].scoreBoard.find("div.matchday-result-display").css("margin", "0px");
            conferenceData[matchId].scoreBoard.find("div.ol-page-content").css("margin", "0px");
            conferenceData[matchId].scoreBoard.find("div.ol-page-content").css("margin", "0px");
            conferenceData[matchId].scoreBoard.find("div.matchScore").text('0 : 0');
            conferenceData[matchId].scoreBoard.find("div.matchScore").attr("id",`matchScore${matchId}`);
            conferenceData[matchId].scoreBoard.find("div.matchScore").css("white-space","nowrap");
            conferenceData[matchId].scoreBoard.find("div.intermediateScore").attr("id",`intermediateScore${matchId}`);
            conferenceData[matchId].scoreBoard.find("div.intermediateScore").hide();
            const matchSBRow = conferenceData[matchId].scoreBoard.find("div.row.ol-paragraph-2 > div");
            $(matchSBRow[0]).find("a[href]").hide();
            $(matchSBRow[2]).find("a[href]").hide();
            $($(matchSBRow[0]).find("a[onclick] > div")[1]).addClass("liveticker_scoreboard_teamname");
            $($(matchSBRow[2]).find("a[onclick] > div")[1]).addClass("liveticker_scoreboard_teamname");
            $(matchSBRow[0]).find("a[onclick]").removeAttr("onclick");
            $(matchSBRow[2]).find("a[onclick]").removeAttr("onclick");
            $(matchSBRow[0]).appendTo(`td#td${i}`);
            $(matchSBRow[1]).appendTo(`td#td${i}`);
            $(matchSBRow[2]).appendTo(`td#td${i}`);
        }
        for (let i = 0; i < confLen; i++){
            const matchId = confArray[i];
            $(`td#td${i}`).attr("id",`td${matchId}`);
        }

        GM_addStyle('.liveticker_scoreboard_table td {text-align:center; vertical-align:middle;}');
        hideTrTypes();

        $("style#conference_matchdayresult").remove();

        if (!showSpoilerCheck){
            hideSpoiler();
        }
        const matchDayVal = parseInt(matchDay,10);
        if (matchDayVal > 0 && matchDayVal < 35){
            await buildLiveTable(matchDayVal, leagueLevel, leagueId, confSeason, matchesId);
        }
        if (confWaitDialog){
            $(confWaitDialog).dialog('close');
            $(confWaitDialog).dialog('destroy');
        }
        showNextLine();
    }

    function prepareConference(){
        const chk = $("input.liveticker_conference_check:checked");
        if (chk.length === 0){
            return;
        }
        if (!confWaitDialog) {
            confWaitDialog = $(`<div id="conference_wait_dialog" class="conference_wait_popup">${tt("Lade Daten")} <span id="player_export_load_num"></span><div width="100%"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>`).dialog({
                classes: {},
                hide: { effect: "fade" },
                show: { effect: "fade" }
            });
        }
        const matchIds = [];
        chk.each(function(){
            matchIds.push($(this).attr("data-matchId"));
        });
        addGlobalStyle('div#matchdayresult {display:none;}','conference_matchdayresult');
        const matchDay = $("div#dropdown-matchday-table-matchday-matchdayTable").attr("data-value");
        const leagueLevel = $("div#dropdown-matchday-table-league-level-matchdayTable").attr("data-value");
        const leagueId = parseInt($('div#dropdown-matchday-table-league-level-matchdayTable').attr("data-value"),10) === 1 ? 1 :
        $(`div#dropdown-matchday-table-1-matchdayTable[data-default="${t('Liga wählen')}"]`).is(":visible") ?
              parseInt($("div#dropdown-matchday-table-1-matchdayTable").attr("data-value"),10) :
        $(`div#dropdown-matchday-table-2-matchdayTable[data-default="${t('Liga wählen')}"]`).is(":visible") ?
              parseInt($("div#dropdown-matchday-table-2-matchdayTable").attr("data-value"),10) :
        $(`div#dropdown-matchday-table-3-matchdayTable[data-default="${t('Liga wählen')}"]`).is(":visible") ?
              parseInt($("div#dropdown-matchday-table-3-matchdayTable").attr("data-value"),10) : 0;
        const tableSeason = $("div#dropdown-matchday-table-season-matchdayTable").attr("data-value");
        olAnchorNavigation.load('/match', { season : 1, matchId : 1, matchDay : matchDay, leagueLevel : leagueLevel, leagueId: leagueId, confSeason: tableSeason, conference: matchIds.join(",") });
    }

    function buildConfChecks(){
        if (!window.location.href.includes("matchdaytable/matchdaytable")){
            return;
        }
        const matchdayTableMatchday = $("div#dropdown-matchday-table-matchday-matchdayTable").attr("data-value");
        const matchdayTableSeason = $("div#dropdown-matchday-table-season-matchdayTable").attr("data-value");
        const matchdayTableRawMatchDay = parseInt(matchdayTableSeason + matchdayTableMatchday.padStart(2,0), 10);
        console.log("matchdayTableRawMatchDay", matchdayTableRawMatchDay);

        if (matchdayTableRawMatchDay >= rawMatchDay){
            return;
        }

        function checkAllConference(){
            $('.liveticker_conference_check').prop('checked', $('#liveticker_conference_all').prop('checked'));
        }

        $("div#leagueFound table > tbody > tr > td.ol-matchday-table-spacer:first-child").each(function(){
            const matchLink = $(this.parentNode).find('td > a.ol-matchday-table-matchresults-info[onclick]');
            if (matchLink.length === 0){
                return;
            }
            const matchIdMatch = matchLink.attr("onclick").match(/\s*'?matchId'?\s*:\s*(\d+)\s*}/);
            if (!matchIdMatch) {
                return;
            }
            const matchId = matchIdMatch[1];
            const chkMatch = $(`<td><div style="display:inline-block"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input class="liveticker_conference_check" data-matchId="${matchId}" id="liveticker_conference_${matchId}" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div></td>`);
            chkMatch.insertAfter(this);
            $(this).css("text-align","center");
        });
        const linkTh = $("div#leagueFound table > thead > tr > th.ol-matchday-table-spacer:first-child");
        $(`<th style="font-weight:initial" class="user-badge-cell"><div style="display:inline-block"><label class="ol-lineup-editor-checkbox" style="margin-right:5pt"><input id="liveticker_conference_all" type="checkbox"><span class="ol-lineup-editor-checkmark liveticker_spoiler-checkbox-mark"></span></label></div></th>`)
            .insertAfter(linkTh);
        $('input#liveticker_conference_all').on('click', checkAllConference);

        const colCount = $(linkTh[0].parentNode).find('th').length;
        const tb = $(linkTh[0].parentNode.parentNode.parentNode).find('tbody');

        $(`<tr><td /><td colspan="${colCount-1}"><span id="startLiveTickerConference" style="cursor:pointer;">${tt("Konferenz starten")} <span class="fa fa-angle-right" /></span></td></tr>`).appendTo(tb);
        $('span#startLiveTickerConference').on('click', prepareConference);

        //linkTh.css("text-align","center");
        //linkTh.css("font-weight","initial");
        //$('<span id="startLiveTickerConference">Konferenz starten</span>').appendTo(linkTh);

    }

    function buildConfNav(){
        $(`<div id="nav_sub_conference" class="ol-navbar-subnav-item" data-selected="0" title="${tt("Match-IDs (STRG: User-IDs) eingeben")}"><div class="ol-navbar-subnav-item-name">${tt("Konferenz starten")}</div></div>`)
            .appendTo("div#subnav_nav_matchday_table");
        $("div#nav_sub_conference").on("click", selectConference);
        $("div#nav_sub_conference").on("contextmenu", selectUserConference);
    }

    function go(){
        const searchParams = new URLSearchParams(window.location.href);
        confMatches = searchParams.get("conference");
        const matchDay = searchParams.get("matchDay");
        const leagueLevel = searchParams.get("leagueLevel");
        const leagueId = searchParams.get("leagueId");
        const confSeason = searchParams.get("confSeason");
        liveTable = null;
        if (confMatches && confMatches.length > 0){
            startConference(matchDay, leagueLevel, leagueId, confSeason);
            return;
        }
        startTicker();
    }

    async function selectUserConference(event){
        event.preventDefault();
        await selectConference({"ctrlKey": true});
        return false;
    }

    async function selectConference(event){
        const idType = event.ctrlKey ? "User" : "Match";
        let selectedConferenceIds;
        if (idType === "Match") {
            selectedConferenceIds = window.prompt(tt(`Bitte ${idType}-IDs kommasepariert eingeben.`));
        } else if (idType === "User") {
            selectedConferenceIds = window.prompt(tt(`Bitte ${idType}-IDs kommasepariert eingeben.`), GM_getValue('livticker_conference_userIds') || '');
        }
        if (selectedConferenceIds > ''){
            if (!confWaitDialog) {
                confWaitDialog = $(`<div id="conference_wait_dialog" class="conference_wait_popup">${tt("Lade Daten")} <span id="player_export_load_num"></span><div width="100%"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>`).dialog({
                    classes: {},
                    hide: { effect: "fade" },
                    show: { effect: "fade" }
                });
            }
            if (!selectedConferenceIds.match(/^[0-9]+(\s*,\s*[0-9]+)*$/)){
                alert(tt("Ungültiges Format für IDs"));
            }
            const confIDs = selectedConferenceIds.split(',');
            if (confIDs.length > 9){
                alert(tt("Maximal 9 IDs möglich"));
                return;
            }
            if (idType === "User"){
                GM_setValue('livticker_conference_userIds', selectedConferenceIds);
                const userMatchIds = [];
                for (const id of confIDs){
                    const userMatchId = await fetchTeamMatchId(id.trim());
                    if (!userMatchId){
                        alert(`${tt("Spiel nicht gefunden")} (ID ${id.trim()})`);
                    } else if (!userMatchIds.includes(userMatchId)){
                        userMatchIds.push(userMatchId);
                    }
                }
                selectedConferenceIds = userMatchIds.join(',');
            }
            olAnchorNavigation.load('/match', { season : 1, matchId : 1, conference: selectedConferenceIds });
        }
    }

    // injects CSS Styles
    function setCSS(){

        GM_addStyle("#liveticker_filter > div.liveticker_filter_check {display:inline-block; margin: 0;vertical-align:middle;}");
        GM_addStyle("#liveticker_filter > div.liveticker_filter_icon_wrap > div.liveticker_filter_icon {display:inline-block; margin-left: 0;vertical-align:middle;margin-right:5px;transform: scale(0.5);transform-origin: 0 0;}");
        GM_addStyle("#liveticker_filter > div.liveticker_filter_icon_wrap > div.liveticker_filter_icon_fontawesome {display:inline-block; margin-left: 0;vertical-align:middle;margin-right:5px; position: relative; top: -5px;}");
        //GM_addStyle("#liveticker_filter > div.liveticker_filter_icon {display:inline-block; margin-left: 0;vertical-align:middle;margin-right:5px;}");

        GM_addStyle("#liveticker_filter > div.liveticker_filter_icon_wrap {display:inline-block;margin-left: 0;vertical-align:middle;margin-right:5px; width:22.5px; height:22.5px}");

        GM_addStyle(".conference_wait_popup {width:auto; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px; vertical-align: middle; text-align:center; padding:20px;}");


        //GM_addStyle('.liveticker_trtype_FAIL_CHANCE {background: red;}');
        GM_addStyle('.liveticker_trtype_FAIL_CHANCE div.matchresult-icon {transform: scale(0.5);');

        GM_addStyle('.liveticker-conference-scoreboard {margin: 0px !important;}');
        GM_addStyle('.liveticker_scoreboard_table {width: 200%; height:200%; z-index:1001;position: relative;}');
        //GM_addStyle('.liveticker_scoreboard_table td {box-sizing: border-box;-moz-box-sizing: border-box; -webkit-box-sizing: border-box;}');

        //GM_addStyle('.liveticker_scoreboard_table td {display:flex; align-items: center; align-content: center;text-align:center; vertical-align:middle;}');
        GM_addStyle('.liveticker_scoreboard_table td.liveticker_highlight {background-color:rgba(255, 255, 128, 0.4);}');
        GM_addStyle('.liveticker_scoreboard_table td.liveticker_endgame {background-color:rgba(128, 255, 128, 0.4);}');
        GM_addStyle('.liveticker_scoreboard_table td > div {position:relative; text-align:center; vertical-align:middle;margin:auto; width:33.33%}');
        //GM_addStyle('.liveticker_scoreboard_table td > div {display:flex; align-items: center; align-content: center;}');
        GM_addStyle('#liveticker_scoreboard_table4 {transform: scale(0.5); transform-origin: 0 0}');
        GM_addStyle('#liveticker_scoreboard_table9 {transform: scale(0.5); transform-origin: 0 0}');
        GM_addStyle('#liveticker_scoreboard_wrapper {width: 100%; margin: auto;position: relative; height:100%;}');
        GM_addStyle('.liveticker_scoreboard_teamname {white-space: nowrap; justify-content: center; display: flex;}');

        //Controls CSS
        GM_addStyle('.liveticker-contact { margin-left:5px; }');
        GM_addStyle('#spnLivetickerLabel { font-family:Roboto Condensed,sans-serif; font-size:18px; font-weight: 700 !important }');
        GM_addStyle('#spnLivetickerVersion { font-family:Roboto Condensed,sans-serif; font-size:12px; font-weight: light; margin-left: 0; }');
        GM_addStyle('#inpLivetickerSpeed { padding-left: 12px; padding-right: 12px; width:70px; display:inline-block; float:none; margin-bottom:0;}');
        GM_addStyle('#inpLivetickerSpeed:disabled { background: #ffffff}');

        GM_addStyle('.liveticker-button { margin-left:2px; margin-right:2px; padding:0; display: inline-block; width:32px; height:32px; vertical-align:middle; text-align:center;}');
        GM_addStyle('.liveticker-button span { vertical-align:middle; background-color: #000 }');
        GM_addStyle('.liveticker-about { float:right; line-height:2; margin-right:2px; }');
        GM_addStyle('.liveticker-about > span { vertical-align:middle;}');
        GM_addStyle('#btnLivetickerSettings { float:right; }');

        GM_addStyle('#liveticker_controls {border: 3px solid #000; border-radius: 4px; display: ' + ctrlPanelDisplay + '; width:100%}');
        GM_addStyle('#liveticker_settings {display:none; }');
        GM_addStyle('#liveticker_settings > label {padding-left: 5px; }');
        GM_addStyle('#liveticker_settings > label:not(:first-of-type) {border-left: 3px solid black; }');
        GM_addStyle('#liveticker_filter {display:none; }');
        GM_addStyle('#liveticker_filter > label {padding-left: 5px; }');

        GM_addStyle('.liveticker_bar { padding:2px; font-family: Roboto,sans-serif; font-size: 13pt;  width:100%}');
        GM_addStyle('.liveticker_bar > span { margin-left:6px; margin-right:6px;}');
        GM_addStyle('.liveticker_bar > div { vertical-align:middle; display:inline-block;margin-left:6px; margin-right:6px;}');

        GM_addStyle('.liveticker-slider { padding-left:2px; padding-right:2px; width:150px; }');

        //Slider CSS
        GM_addStyle('.liveticker-slider input[type=range] {-webkit-appearance: none;-moz-appearance: none;width: 100%;height: 22px;background: #fff;border: 3px solid #000;border-radius: 4px;outline: none;opacity: 1;transition: opacity .2s;padding: 3px;}');
        GM_addStyle('input[type=range]::-webkit-slider-thumb {  -webkit-appearance: none;  height: 10px;  width: 18px;  border-radius: 4px;  background: #000000;  cursor: pointer;  margin-top: 0px;}');
        GM_addStyle('input[type=range]::-moz-range-thumb {  height: 10px;  width: 18px;  border-radius: 4px;  background: #000000;  cursor: pointer;}');
        GM_addStyle('input[type=range]::-ms-thumb {  height: 10px;  width: 18px;  border-radius: 4px;  background: #000000;  cursor: pointer;}');

        //CSS for hidden spoilers
        GM_addStyle('div.liveticker_hideSpoiler {display:none !important;}');
        GM_addStyle('span.liveticker_hideSpoiler {display:none !important;}');
        GM_addStyle('td.liveticker_hideSpoiler { padding: 0 !important; }');

        GM_addStyle('div.liveticker-settings {position: absolute; top: 100px; right:100px; width:100px; height:100px; background:green;}');

        //CSS for Selects
        GM_addStyle("select.liveticker_select { -moz-appearance: none;-webkit-appearance: none;appearance: none;border: 1px solid #000;border-radius: 4px;padding-left: 5px;width: 155px;height: 100%;color: #000;}");

        GM_addStyle('div.liveticker_select-wrapper { display: inline-block; position:relative; width: 150px; height: 35px;}');

        GM_addStyle("div.liveticker_select-wrapper::before{content:'';display: inline-block;width: 35px;height: 35px;position: absolute;background-color: black;border-radius: 2px;top: -0px;right: -4px;border-top-right-radius: 5px;border-bottom-right-radius: 5px;pointer-events: none;}");

        GM_addStyle("div.liveticker_select-wrapper::after {content:'';display: inline-block;border-top: 8px dashed;border-top: 8px solid;border-right: 8px solid transparent;border-left: 8px solid transparent;position: absolute;color: white;left: 128px;top: 14px;pointer-events: none;}");

        //hide results in matchday table
        addGlobalStyle('.results-cell { display: none }', 'liveticker_resultscell');
        addGlobalStyle('div.mobile-matchdaytable-result:first-of-type { display:none }', 'liveticker_mobile-matchdaytable-result');
        addGlobalStyle('div.mobile-matchdaytable-halftime-result:nth-of-type(2) { display:none }', 'liveticker_mobile-matchdaytable-halftime-result');

        //hide results of playoff matches
        addGlobalStyle('td.ol-font-highlight:nth-child(7) { color:transparent }', 'liveticker_playoff_results');

        //hide div for ticker temporarily to avoid a short view until the lines are detached
        addGlobalStyle('div#matchContent { display: none }', 'liveticker_matchContent');

        //hide scoreboard temporarily to avoid a short view until the lines are detached
        addGlobalStyle('div.matchScore { display: none }', 'liveticker_matchScore');

        //hide intermediate scoreboard until halftime
        addGlobalStyle('div.intermediateScore { display: none }', 'liveticker_intermediateScore');

        //hide matchday table
        addGlobalStyle('div#ol-table-content { display: none }', 'liveticker_matchtable');

    }

    /*** Action ***/

    setCSS();

    rawMatchDay = OLCore.Base.rawMatchDay;

    //deface bank balance (b/c of victory bonus)
    liquid_funds = $('div.ol-navigation-player-budget > .ol-nav-liquid-funds').first().text();
    $('div.ol-navigation-player-budget  > .ol-nav-liquid-funds').text('XXX.XXX');
    $('style#liveticker_funds').remove();

    OLCore.waitForKeyElements (
        "div.matchreport-league-nav-wrapper",
        //"div.mobile-matchday-results-table-wrapper",
        defaceMobileScores
    );

    GM_addStyle('div#conferenceSelectDialog {background: white; text-align: center;}');
    GM_addStyle('div#conferenceSelectDialog > * {margin: auto; padding: 5px}');
    GM_addStyle('div#conferenceSelectDialog input[type="text"] {width: 100%;}');

    GM_addStyle('table#livetable_table > thead > tr > th {text-align:center; font-size:18px;}');
    GM_addStyle('table#livetable_table > tbody > tr > td {padding-right: 4px; padding-left: 4px;}');
    GM_addStyle('table#livetable_table > tbody > tr > td:not(:nth-child(3)) {text-align:right;}');
    GM_addStyle('table#livetable_table > tbody > tr > td:not(:first-child) {font-size:18px;}');
    GM_addStyle('table#livetable_table > tbody > tr > td:last-child {font-weight:bold;padding-right:8px}');
    GM_addStyle('table#livetable_table > tbody > tr > td:first-child {font-size:12px;vertical-align:middle}');
    GM_addStyle('table#livetable_table > tbody > tr.livetable_active {color:red;}');
    GM_addStyle('table#livetable_table > tbody > tr.blitztabelle_highlight_active {background-color:rgba(255, 255, 128, 0.4);}');
    GM_addStyle('table#livetable_table > tbody > tr.blitztabelle_highlight_even {background-color:#F2F2F2;}');
    GM_addStyle('table#livetable_table {background:white;}');

    OLCore.waitForKeyElements (
        "div#subnav_nav_matchday_table",
        buildConfNav
    );

    OLCore.waitForKeyElements (
        "tr.ol-matchday-table-head",
        buildConfChecks
    );

    //wait for the ticker page and start the ticker
    OLCore.waitForKeyElements (
        "div#matchContent",
        go
    );

})();