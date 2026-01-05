// ==UserScript==
// @name		DIO-TOOLS
// @namespace	DIO
// @version		3.07
// @author		Diony
// @description DIO-Tools is a small extension for the browser game Grepolis. (counter, displays, smilies, trade options, changes to the layout)
// @include		http://de.grepolis.com/game*
// @include		/http[s]{0,1}://[a-z]{2}[0-9]{1,2}\.grepolis\.com/game*/
// @include		https://*forum.*.grepolis.com/*.php*
// @include		http://diotools.de/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @icon		http://s7.directupload.net/images/140128/vqchpigi.gif
// @icon64		http://diotools.de/images/icon_dio_64x64.png
// @copyright	2013+, DIONY
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_xmlhttpRequest
// @grant		GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/1277/DIO-TOOLS.user.js
// @updateURL https://update.greasyfork.org/scripts/1277/DIO-TOOLS.meta.js
// ==/UserScript==

var version = '3.07';

//if(unsafeWindow.DM) console.dir(unsafeWindow.DM.status('l10n'));
//console.dir(DM.status('templates'));

//http://s7.directupload.net/images/140128/vqchpigi.gif - DIO-Tools-Smiley

//http://de44.grepolis.com/cache/js/libs/jquery-1.10.2.min.js


//console.log(JSON.stringify(DM.getl10n()));


//// console.log(GM_getResourceText("dio_sprite"));

/*******************************************************************************************************************************
 * Changes
 * ----------------------------------------------------------------------------------------------------------------------------
 * | ● Einstellungen und auch das ganze Script komplett überarbeitet
 * | ● Features können nun ohne Refresh deaktiviert/aktiviert werden
 * | ● Einzelne Features sind unabhängiger voneinander und somit auch fehlerresistenter (einzelne Features können sich bei Fehlerauftreten durch Grepolis-Updates nicht mehr gegenseitig blockieren)
 * | ● Fehlerhafter Biremenzähler als Kompromiss für die Erweiterung der "Verfügbare Einheiten"-Anzeige entfernt: es kann nun jede Einheit im Bullauge angezeigt werden
 * | ● EO-Zähler hat ATT/UT's doppelt gezählt, wenn nebenher der veröffentlichte Belagerungsbericht im Forum offen war
 * | ● 3 kleine Layoutfehler beim EO-Zähler behoben
 * | ● Wenn Zauberfenster und Zauberbox gleichzeitig offen waren, kam es zu einem Layoutfehler
 * | ● Fehler beim Mausrad-Zoom behoben
 * | ● Fehler bei der Transporteranzeige behoben: die Kapazität der großen Transporter wurde durch das Rebalancing nichtmehr korrekt berechnet
 * | ● Smileybox etwas verbessert
 * | ● Weihnachtssmileys hinzugefügt
 * | ● Kontextmenü der Stadticons auf der strategischen Karte konnte im Nachtmodus nicht geöffnet werden
 * | ● Grüner Fortschrittsbalken beim Weltwunderzähler wurde nicht angezeigt
 * | ● Fenster wurden angepasst (Verfügbare Einheiten und Einheitenvergleich)
 * ----------------------------------------------------------------------------------------------------------------------------
 *******************************************************************************************************************************/

/*******************************************************************************************************************************
 * Bugs / TODOs
 * ----------------------------------------------------------------------------------------------------------------------------
 * | ● Aktivitätsbox für Angriffe blendet nicht aus
 * | ● Smileys verschwinden manchmal? -> bisher nicht reproduzierbar
 * | ● Performanceeinbruch nach dem Switchen des WW-Fensters
 * | ● keine Smileys im Grepoforum mit Safari (fehlendes jQuery)
 * ----------------------------------------------------------------------------------------------------------------------------
 *******************************************************************************************************************************/

/*******************************************************************************************************************************
 * Global stuff
 *******************************************************************************************************************************/
var uw = unsafeWindow || window, $ = uw.jQuery || jQuery, DATA, GM;

// GM-API?
GM = (typeof GM_info === 'object');

console.log('%c|= DIO-Tools is active =|', 'color: green; font-size: 1em; font-weight: bolder; ');

function loadValue(name, default_val){
    var value;
    if(GM){
        value = GM_getValue(name, default_val);
    } else {
        value = localStorage.getItem(name) || default_val;
    }

    if(typeof(value) === "string"){
        value = JSON.parse(value)
    }
    return value;
}

// LOAD DATA
if(GM && (uw.location.pathname === "/game/index")){
    var WID = uw.Game.world_id, MID = uw.Game.market_id, AID = uw.Game.alliance_id;

    //GM_deleteValue(WID + "_bullseyeUnit");

    DATA = {
        // GLOBAL
        options : loadValue("options", "{}"),

        user : loadValue("dio_user", "{}"),
        count: loadValue("dio_count", "[]"),

        notification : loadValue('notif', '0'),

        error: loadValue('error', '{}'),

        spellbox  :	loadValue("spellbox", '{ "top":"23%", "left": "-150%", "show": false }'),
        commandbox: loadValue("commandbox" , '{ "top":55, "left": 250 }'),
        tradebox  :	loadValue("tradebox", '{ "top":55, "left": 450 }'),

        // WORLD
        townTypes : loadValue(WID + "_townTypes", "{}"),
        sentUnits : loadValue(WID + "_sentUnits", '{ "attack": {}, "support": {} }'),

        biremes   : loadValue(WID + "_biremes", "{}"), //old
        bullseyeUnit : loadValue(WID + "_bullseyeUnit", '{ "current_group" : -1 }'), // new

        worldWonder : loadValue(WID + "_wonder", '{ "ratio": {}, "storage": {}, "map": {} }'),

        clickCount : loadValue(WID + "_click_count", '{}'), // old
        statistic : loadValue(WID + "_statistic", '{}'), // new

        // MARKET
        worldWonderTypes : loadValue(MID + "_wonderTypes", '{}')
    };

    if(!DATA.worldWonder.map) {
        DATA.worldWonder.map = {};
    }

    // Temporary:
    if(typeof DATA.options.trd == 'boolean') {
        DATA.options.per = DATA.options.rec = DATA.options.trd; delete DATA.options.trd;
    }
    if(typeof DATA.options.mov == 'boolean') {
        DATA.options.act = DATA.options.mov; delete DATA.options.mov;
    }
    if(typeof DATA.options.twn == 'boolean') {
        DATA.options.tic = DATA.options.til = DATA.options.tim = DATA.options.twn; delete DATA.options.twn;
    }
    if(GM) GM_deleteValue("notification");
}

// GM: EXPORT FUNCTIONS
uw.saveValueGM = function(name, val){
    setTimeout(function(){
        GM_setValue(name, val);
    }, 0);
};

uw.deleteValueGM = function(name){
    setTimeout(function(){
        GM_deleteValue(name);
    },0);
};

uw.chatUserRequest = function(){
    var _chatIndicator = $('.nui_main_menu .chat .indicator');

    setTimeout(function(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://api.relay-chat.de/compteur_js.php?chan="+ (uw.Game.market_id === "de" ? "Grepolis" + uw.Game.market_id.toUpperCase() : "GREPO"),
            onload: function(text){
                _chatIndicator.get(0).innerHTML = text.response.split("'")[1];
                _chatIndicator.get(0).style.display = 'block';
            },
            onerror: function(){
                _chatIndicator.get(0).style.display = 'none';
            }
        });
    }, 0);
};

uw.getImageDataFromCanvas = function(x, y){

    console.debug("HEY", document.getElementById('canvas_picker').getContext('2d').getImageData(x, y, 1, 1));
};
uw.calculateConcaveHull = function() {
    var contour = [
        new poly2tri.Point(100, 100),
        new poly2tri.Point(100, 300),
        new poly2tri.Point(300, 300),
        new poly2tri.Point(300, 100)
    ];

    var swctx = new poly2tri.SweepContext(contour);

    swctx.triangulate();
    var triangles = swctx.getTriangles();

    console.debug(triangles);

    return triangles;
};

if(typeof exportFunction == 'function'){
    // Firefox > 30
    //uw.DATA = cloneInto(DATA, unsafeWindow);
    exportFunction(uw.saveValueGM, unsafeWindow, {defineAs: "saveValueGM"});
    exportFunction(uw.deleteValueGM, unsafeWindow, {defineAs: "deleteValueGM"});
    exportFunction(uw.chatUserRequest, unsafeWindow, {defineAs: "chatUserRequest"});
    exportFunction(uw.calculateConcaveHull, unsafeWindow, {defineAs: "calculateConcaveHull"});
    exportFunction(uw.getImageDataFromCanvas, unsafeWindow, {defineAs: "getImageDataFromCanvas"});
} else {
    // Firefox < 30, Chrome, Opera, ...
    //uw.DATA = DATA;
}

var time_a, time_b;

// APPEND SCRIPT
function appendScript(){
    //console.log("GM-API: " + gm_bool);
    if(document.getElementsByTagName('body')[0]){
        var dioscript = document.createElement('script');
        dioscript.type ='text/javascript';
        dioscript.id = 'diotools';

        time_a = uw.Timestamp.client();
        dioscript.textContent = DIO_GAME.toString().replace(/uw\./g, "") + "\n DIO_GAME('"+ version +"', "+ GM +", '" + JSON.stringify(DATA).replace(/'/g, "##") + "', "+ time_a +");";
        document.body.appendChild(dioscript);
    } else {
        setTimeout(function(){
            appendScript();
        }, 500);
    }
}

if(location.host === "diotools.de"){
    // PAGE
    DIO_PAGE();
} else {
    if((location.pathname !== "/game/index") && GM){
        // FORUM
        DIO_GAME(version);
    } else {
        // GAME
        appendScript();
    }
}

function DIO_PAGE(){
    if(typeof GM_info == 'object') {
        setTimeout(function() {
            dio_user = JSON.parse(loadValue("dio_user", ""));
            console.log(dio_user);
            uw.dio_version = parseFloat(version);
        }, 0);
    } else {
        dio_user = localStorage.getItem("dio_user") || "";

        dio_version = parseFloat(version);
    }
}
function DIO_FORUM(){
    if($(".editor_textbox_container").get(0)){
        loadSmileys();
        changeForumEditorLayout();
        addForum();
    }
}
function DIO_GAME(version, gm, DATA, time_a) {
    var MutationObserver = uw.MutationObserver || window.MutationObserver,

        WID, MID, AID, PID, LID,

        dio_sprite = "http://666kb.com/i/ct1etaz0uyohw402i.png"; // http://abload.de/img/dio_spritejmqxp.png, http://img1.myimg.de/DIOSPRITEe9708.png -> Forbidden!?

    if (uw.location.pathname === "/game/index") {
        DATA = JSON.parse(DATA.replace(/##/g, "'"));

        WID = uw.Game.world_id;
        MID = uw.Game.market_id;
        AID = uw.Game.alliance_id;
        PID = uw.Game.player_id;
        LID = uw.Game.locale_lang.split("_")[0]; // LID ="es";

        // World with Artemis ??
        Game.hasArtemis = true; //Game.constants.gods.length == 6;
    }

    $.prototype.reverseList = [].reverse;

    // Implement old jQuery method (version < 1.9)
    $.fn.toggleClick = function () {
        var methods = arguments;    // Store the passed arguments for future reference
        var count = methods.length; // Cache the number of methods

        // Use return this to maintain jQuery chainability
        // For each element you bind to
        return this.each(function (i, item) {
            // Create a local counter for that element
            var index = 0;

            // Bind a click handler to that element
            $(item).on('click', function () {
                // That when called will apply the 'index'th method to that element
                // the index % count means that we constrain our iterator between 0
                // and (count-1)
                return methods[index++ % count].apply(this, arguments);
            });
        });
    };

    function saveValue(name, val) {
        if (gm) {
            saveValueGM(name, val);
        } else {
            localStorage.setItem(name, val);
        }
    }

    function deleteValue(name) {
        if (gm) {
            deleteValueGM(name);
        } else {
            localStorage.removeItem(name);
        }
    }

    /*******************************************************************************************************************************
     * Graphic filters
     *******************************************************************************************************************************/
    if (uw.location.pathname === "/game/index") {
        $('<svg width="0%" height="0%">' +
                // GREYSCALE
            '<filter id="GrayScale">' +
            '<feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0">' +
            '</filter>' +
                // SEPIA
            '<filter id="Sepia">' +
            '<feColorMatrix type="matrix" values="0.343 0.669 0.119 0 0 0.249 0.626 0.130 0 0 0.172 0.334 0.111 0 0 0.000 0.000 0.000 1 0">' +
            '</filter>' +
                // SATURATION
            '<filter id="Saturation"><feColorMatrix type="saturate" values="0.2"></filter>' +
            '<filter id="Saturation1"><feColorMatrix type="saturate" values="1"></filter>' +
            '<filter id="Saturation2"><feColorMatrix type="saturate" values="2"></filter>' +
                // HUE
            '<filter id="Hue1"><feColorMatrix type="hueRotate" values= "65"></filter>' +
            '<filter id="Hue2"><feColorMatrix type="hueRotate" values="150"></filter>' +
            '<filter id="Hue3"><feColorMatrix type="hueRotate" values="-65"></filter>' +
                // BRIGHTNESS
            '<filter id="Brightness15">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.5"/><feFuncG type="linear" slope="1.5"/><feFuncB type="linear" slope="1.5"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness12">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.2"/><feFuncG type="linear" slope="1.2"/><feFuncB type="linear" slope="1.2"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness11">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.1"/><feFuncG type="linear" slope="1.1"/><feFuncB type="linear" slope="1.1"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness10">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.0"/><feFuncG type="linear" slope="1.0"/><feFuncB type="linear" slope="1.0"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness07">' +
            '<feComponentTransfer><feFuncR type="linear" slope="0.7"/><feFuncG type="linear" slope="0.7"/><feFuncB type="linear" slope="0.7"/></feComponentTransfer>' +
            '</filter>' +
            '</svg>').appendTo('#ui_box');
    }

    /*******************************************************************************************************************************
     * Language versions: german, english, french, russian, polish, spanish
     *******************************************************************************************************************************/
    var LANG = {
        de: {
            settings: {
                dsc: "DIO-Tools bietet unter anderem einige Anzeigen, eine Smileyauswahlbox,<br>Handelsoptionen und einige Veränderungen des Layouts.",
                act: "Funktionen der Toolsammlung aktivieren/deaktivieren:",
                prv: "Vorschau einzelner Funktionen:",

                version_old: "DIO-Tools-Version ist nicht aktuell",
                version_new: "DIO-Tools-Version ist aktuell",
                version_dev: "DIO-Tools-Entwicklerversion",

                version_update: "Aktualisieren",

                link_forum: "http://forum.de.grepolis.com/showthread.php?28838&goto=newpost", //"http://forum.de.grepolis.com/showthread.php?28838"
                link_contact: "http://forum.de.grepolis.com/private.php?do=newpm&u=10548",

                forum: "Forum",
                author: "Autor",

                cat_units: "Einheiten",
                cat_icons: "Stadticons",
                cat_forum: "Forum",
                cat_trade: "Handel",
                cat_wonders: "Weltwunder",
                cat_layout: "Layout",
                cat_other: "Sonstiges"
            },
            options: {
                bir: ["Biremenzähler", "Zählt die jeweiligen Biremen einer Stadt und summiert diese.<br><br>Anzeige im Minimap-Bullauge oben links"],
                ava: ["Verfügbare Einheiten", "Zählt die verfügbaren Einheiten von allen Städten"],
                sml: ["Smileys", "Erweitert die BBCode-Leiste um eine Smileybox"],
                str: ["Einheitenstärke", "Fügt mehrere Einheitenstärketabellen in verschiedenen Bereichen hinzu"],
                tra: ["Transportkapazität", "Zeigt die belegte und verfügbare Transportkapazität im Einheitenmenu an"],
                per: ["Prozentualer Handel", "Erweitert das Handelsfenster um einen Prozentualer Handel"],
                rec: ["Rekrutierungshandel", "Erweitert das Handelsfenster um einen Rekrutierungshandel"],
                cnt: ["EO-Zähler", "Zählt die ATT/UT-Anzahl im EO-Fenster"],
                way: ["Laufzeit", "Zeigt im ATT/UT-Fenster die Laufzeit bei Verbesserter Truppenbewegung an"],
                sim: ["Simulator", "Anpassung des Simulatorlayouts & permanente Anzeige der Erweiterten Modifikatorbox"],
                spl: ["Zauberbox", "Komprimierte verschiebbare & magnetische Zauberbox (Positionsspeicherung)"],
                act: ["Aktivitätsboxen", "Verbesserte Anzeige der Handels- und Truppenaktivitätsboxen (Positionsspeicherung)"],
                pop: ["Gunst-Popup", 'Ändert das Aussehen des Gunst-Popups'],
                tsk: ["Taskleiste", 'Vergrößert die Taskleiste und minimiert das "Tägliche Belohnung"-Fenster beim Start'],
                irc: ["Chat", "Ersetzt den Allianzchat durch einen IRC-Chat"],
                bbc: ["DEF-Formular", "Erweitert die BBCode-Leiste um ein automatisches DEF-Formular"],
                com: ["Einheitenvergleich", "Fügt Einheitenvergleichstabellen hinzu"],
                tic: ["Stadticons", "Jede Stadt erhält ein Icon für den Stadttyp (Automatische Erkennung)", "Zusätzliche Icons stehen bei der manuellen Auswahl zur Verfügung"],
                til: ["Stadtliste", "Fügt die Stadticons zur Stadtliste hinzu"],
                tim: ["Karte", "Setzt die Stadticons auf die strategische Karte"],
                wwc: ["Anteil", "Anteilsrechner & Rohstoffzähler + Vor- & Zurück-Buttons bei fertiggestellten WW's (momentan nicht deaktivierbar!)"],
                wwr: ["Rangliste", "Überarbeitete Weltwunderrangliste"],
                wwi: ["Icons", 'Fügt Weltwundericons auf der strategischen Karte hinzu'],
                con: ["Kontextmenu", 'Vertauscht "Stadt selektieren" und "Stadtübersicht" im Kontextmenu'],
                sen: ["Abgeschickte Einheiten", 'Zeigt im Angriffs-/Unterstützungsfenster abgeschickte Einheiten an'],
                tov: ["Stadtübersicht", 'Ersetzt die neue Stadtansicht mit der alten Fensteransicht'],
                scr: ["Mausrad-Zoom", 'Man kann mit dem Mausrad die 3 Ansichten wechseln'],

                err: ["Automatische Fehlerberichte senden", "Wenn du diese Option aktivierst, kannst du dabei helfen Fehler zu identifizieren."],
                her: ["Thrakische Eroberung", "Verkleinerung der Karte der Thrakischen Eroberung."]
            },
            labels: {
                uni: "Verfügbare Einheiten",
                con: "Selektieren",
                // Smileys
                std: "Standard",
                gre: "Grepolis",
                nat: "Natur",
                ppl: "Leute",
                oth: "Sonstige",
                // Defense form
                ttl: "Übersicht: Stadtverteidigung",
                inf: "Informationen zur Stadt:",
                dev: "Abweichung",
                det: "Detailierte Landeinheiten",
                prm: "Premiumboni",
                sil: "Silberstand",
                mov: "Truppenbewegungen:",
                // WW
                leg: "WW-Anteil",
                stg: "Stufe",
                tot: "Gesamt",
                // Simulator
                str: "Einheitenstärke",
                los: "Verluste",
                mod: "ohne Modifikatoreinfluss",
                // Comparison box
                dsc: "Einheitenvergleich",
                hck: "Schlag",
                prc: "Stich",
                dst: "Distanz",
                sea: "See",
                att: "Angriff",
                def: "Verteidigung",
                spd: "Geschwindigkeit",
                bty: "Beute (Rohstoffe)",
                cap: "Transportkapazität",
                res: "Baukosten (Rohstoffe)",
                fav: "Gunst",
                tim: "Bauzeit (s)",
                // Trade
                rat: "Ressourcenverhältnis eines Einheitentyps",
                shr: "Anteil an der Lagerkapazität der Zielstadt",
                per: "Prozentualer Handel",
                // Sent units box
                lab: "Abgeschickt",
                improved_movement: "Verbesserte Truppenbewegung"
            },
            buttons: {
                sav: "Speichern", ins: "Einfügen", res: "Zurücksetzen"
            }
        },

        en: {
            settings: {
                dsc: "DIO-Tools offers, among other things, some displays, a smiley box,<br>trade options and some changes to the layout.",
                act: "Activate/deactivate features of the toolset:",
                prv: "Preview of several features:",

                version_old: "Version is not up to date",
                version_new: "Version is up to date",
                version_dev: "Developer version",

                version_update: "Update",

                link_forum: "http://forum.en.grepolis.com/showthread.php?52104&goto=newpost",
                link_contact: "http://forum.en.grepolis.com/private.php?do=newpm&u=46211",

                forum: "Forum",
                author: "Author",

                cat_units: "Units",
                cat_icons: "Town icons",
                cat_forum: "Forum",
                cat_trade: "Trade",
                cat_wonders: "World wonder",
                cat_layout: "Layout",
                cat_other: "Miscellaneous"
            },
            options: {
                bir: ["Bireme counter", "Counts the biremes of a city and sums these"],
                ava: ["Available units", "Counts the available units of all cities"],
                sml: ["Smilies", "Extends the bbcode bar by a smiley box"],
                str: ["Unit strength", "Adds unit strength tables in various areas"],
                tra: ["Transport capacity", "Shows the occupied and available transport capacity in the unit menu"],
                per: ["Percentual trade", "Extends the trade window by a percentual trade"],
                rec: ["Recruiting trade", "Extends the trade window by a recruiting trade"],
                cnt: ["Conquests", "Counts the attacks/supports in the conquest window"],
                way: ["Troop speed", "Displays improved troop speed in the attack/support window"],
                sim: ["Simulator", "Adaptation of the simulator layout & permanent display of the extended modifier box"],
                spl: ["Spell box", "Compressed movable & magnetic spell box (position memory)"],
                act: ["Activity boxes", "Improved display of trade and troop activity boxes (position memory)"],
                pop: ["Favor popup", "Changes the favor popup"],
                tsk: ["Taskbar", "Increases the taskbar and minimizes the daily reward window on startup"],
                irc: ["Chat", 'Replaced the alliance chat by an irc chat. (FlashPlayer required)'],
                bbc: ["Defense form", "Extends the bbcode bar by an automatic defense form"],
                com: ["Unit Comparison", "Adds unit comparison tables"],
                tic: ["Town icons", "Each city receives an icon for the town type (automatic detection)", "Additional icons are available for manual selection"],
                til: ["Town list", "Adds the town icons to the town list"],
                tim: ["Map", "Sets the town icons on the strategic map"],
                wwc: ["Calculator", "Share calculation & resources counter + previous & next buttons on finished world wonders (currently not deactivatable!)"],
                wwr: ["Ranking", "Redesigned world wonder rankings"],
                wwi: ["Icons", 'Adds world wonder icons on the strategic map'],
                con: ["Context menu", 'Swaps "Select town" and "City overview" in the context menu'],
                sen: ["Sent units", 'Shows sent units in the attack/support window'],
                tov: ["Town overview", 'Replaces the new town overview with the old window style'],
                scr: ["Mouse wheel", 'You can change the views with the mouse wheel'],

                err: ["Send bug reports automatically", "If you activate this option, you can help identify bugs."],
                her: ["Thracian Conquest", "Downsizing of the map of the Thracian conquest."]
            },
            labels: {
                uni: "Available Units",
                con: "Select town",
                // Smileys
                std: "Standard",
                gre: "Grepolis",
                nat: "Nature",
                ppl: "People",
                oth: "Other",
                hal: "Halloween",
                xma: "Xmas",
                // Defense form
                ttl: "Overview: Town defense",
                inf: "Town information:",
                dev: "Deviation",
                det: "Detailed land units",
                prm: "Premium bonuses",
                sil: "Silver volume",
                mov: "Troop movements:",
                // WW
                leg: "WW Share",
                stg: "Stage",
                tot: "Total",
                // Simulator
                str: "Unit strength",
                los: "Loss",
                mod: "without modificator influence",
                // Comparison box
                dsc: "Unit comparison",
                hck: "Blunt",
                prc: "Sharp",
                dst: "Distance",
                sea: "Sea",
                att: "Offensive",
                def: "Defensive",
                spd: "Speed",
                bty: "Booty (resources)",
                cap: "Transport capacity",
                res: "Costs (resources)",
                fav: "Favor",
                tim: "Recruiting time (s)",
                // Trade
                rat: "Resource ratio of an unit type",
                shr: "Share of the storage capacity of the target city",
                per: "Percentage trade",
                // Sent units box
                lab: "Sent units",
                improved_movement: "Improved troop movement"
            },
            buttons: {
                sav: "Save", ins: "Insert", res: "Reset"
            }
        },
        ///////////////////////////////////
        // French Translation by eclat49 //
        ///////////////////////////////////
        fr: {
            settings: {
                dsc: "DIO-Tools offres certains écrans, une boîte de smiley, les options <br>commerciales, des changements à la mise en page et d'autres choses.",
                act: "Activation/Désactivation des fonctions:",
                prv: "Aperçu des fonctions séparées:"
            },
            options: {
                bir: ["Compteur de birèmes ", "Totalise l'ensemble des birèmes présentent en villes et les résume. (Remplace la mini carte dans le cadran)"],
                sml: ["Smileys", "Rajoutes une boite de smilies à la boite de bbcode"],
                str: ["Force unitaire", "Ajoutes des tableaux de force unitaire dans les différentes armes"],
                //trd: [ "Commerce",				"Ajout d'une option par pourcentage, par troupes pour le commerce, ainsi qu'un affichage des limites pour les festivals" ],
                per: ["Commerce de pourcentage", ""],
                rec: ["Commerce de recrutement", ""],
                cnt: ["Compteur conquête", "Comptabilise le nombre d'attaque et de soutien dans la fenêtre de conquête"],
                way: ["Vitesse des troupes ", "Rajoutes le temps de trajet avec le bonus accélération"],
                sim: ["Simulateur", "Modification de la présentation du simulateur et affichage permanent des options premium"],
                spl: ["Boîte de magie", "Boîte de sort cliquable et positionnable"],
                act: ["Boîte d'activité", "Présentation améliorée du commerce et des mouvement de troupes (mémoire de position)"],
                pop: ["Popup de faveur", 'Change la popup de faveur'],
                tsk: ["Barre de tâches ", "La barre de tâches augmente et minimise le fenêtre de bonus journalier"],
                irc: ["Chat", "Remplace le chat de l'alliance à travers un chat IRC. (FlashPlayer requis)"],
                bbc: ["Formulaire de défense", "Ajout d'un bouton dans la barre BBCode pour un formulaire de défense automatique"],
                com: ["Comparaison des unités", "Ajoutes des tableaux de comparaison des unités"],
                tic: ["Icônes des villes", "Chaque ville reçoit une icône pour le type de ville (détection automatique)", "Des icônes supplémentaires sont disponibles pour la sélection manuelle"],
                til: ["Liste de ville", "Ajoute les icônes de la ville à la liste de la ville"],
                tim: ["Carte", "Définit les icônes de la ville sur la carte stratégique"],
                wwc: ["Merveille du monde", "Compteur de ressource et calcul d'envoi + bouton précédent et suivant sur les merveilles finies(ne peut être désactivé pour le moment)"],
                wwr: ["", ""],
                //wwi: [ "Icônes",'Adds world wonder icons on the strategic map' ],
                con: ["Menu contextuel", 'Swaps "Sélectionner ville" et "Aperçu de la ville" dans le menu contextuel'],
                sen: ["Unités envoyées", 'Affiche unités envoyées dans la fenêtre attaque/support'],
                tov: ["Aperçu de ville", "Remplace la nouvelle aperçu de la ville avec l'ancien style de fenêtre"],
                scr: ["Molette de la souris", 'Avec la molette de la souris vous pouvez changer les vues'],

                err: ["Envoyer des rapports de bogues automatiquement", "Si vous activez cette option, vous pouvez aider à identifier les bugs."]
            },
            labels: {
                uni: "Unités disponibles",
                con: "Sélectionner",
                // Smileys
                std: "Standard",
                gre: "Grepolis",
                nat: "Nature",
                ppl: "Gens",
                oth: "Autres",
                // Defense form
                ttl: "Aperçu: Défense de ville",
                inf: "Renseignements sur la ville:",
                dev: "Différence",
                det: "Unités terrestres détaillées",
                prm: "Bonus premium",
                sil: "Remplissage de la grotte",
                mov: "Mouvements de troupes:",
                // WW
                leg: "Participation",
                stg: "Niveau",
                tot: "Total",
                // Simulator
                str: "Force unitaire",
                los: "Pertes",
                mod: "sans influence de modificateur",
                // Comparison box
                dsc: "Comparaison des unités",
                hck: "Contond.",
                prc: "Blanche",
                dst: "Jet",
                sea: "Navale",
                att: "Attaque",
                def: "Défense",
                spd: "Vitesse",
                bty: "Butin",
                cap: "Capacité de transport",
                res: "Coût de construction",
                fav: "Faveur",
                tim: "Temps de construction (s)",
                // Trade
                rat: "Ratio des ressources d'un type d'unité",
                shr: "Part de la capacité de stockage de la ville cible",
                per: "Commerce de pourcentage",
                // Sent units box
                lab: "Envoyée",
                improved_movement: "Mouvement des troupes amélioré"
            },
            buttons: {
                sav: "Sauver", ins: "Insertion", res: "Remettre"
            }
        },
        ///////////////////////////////////
        // Russian Translation by MrBobr //
        ///////////////////////////////////
        ru: {
            settings: {
                dsc: "DIO-Tools изменяет некоторые окна, добавляет новые смайлы, отчёты,<br>улучшеные варианты торговли и другие функции.",
                act: "Включение/выключение функций:",
                prv: "Примеры внесённых изменений:"
            },
            options: {
                bir: ["Счётчик бирем", "Показывает число бирем во всех городах"],
                sml: ["Смайлы", "Добавляет кнопку для вставки смайлов в сообщения"],
                str: ["Сила отряда", "Добавляет таблицу общей силы отряда в некоторых окнах"],
                //trd: [ "Торговля",		"Добавляет маркеры и отправку недостающих ресурсов, необходимых для фестиваля. Инструменты для долевой торговли" ],
                per: ["Процент торговля", ""],
                rec: ["Рекрутинг торговля", ""],
                cnt: ["Завоевания", "Отображение общего числа атак/подкреплений в окне завоевания города"],
                way: ["30% ускорение", "Отображает примерное время движения отряда с 30% бонусом"],
                sim: ["Симулятор", "Изменение интерфейса симулятора, добавление новых функций"],
                spl: ["Заклинания", "Изменяет положение окна заклинаний"],
                act: ["Перемещения", "Показывает окна пересылки ресурсов и перемещения войск"],
                pop: ["Благосклонность", "Отображение окна с уровнем благосклонности богов"],
                tsk: ["Таскбар", "Увеличение ширины таскбара и сворачивание окна ежедневной награды при входе в игру"],
                irc: ["Чат", 'Замена чата игры на irc-чат'],
                bbc: ["Форма обороны", "Добавляет кнопку для вставки в сообщение отчёта о городе"], // Beschreibung passt nicht ganz
                com: ["Сравнение юнитов", "Добавляет окно сравнения юнитов"],
                tic: ["Типы городов", "Каждый город получает значок для городского типа (автоматическое определение)", "Дополнительные иконки доступны для ручного выбора"], // ?
                til: ["Список город", "Добавляет значки городские в список города"], // ?
                tim: ["Карта", "Устанавливает городские иконки на стратегической карте"], // ?
                wwc: ["Чудо света", "Share calculation & resources counter + previous & next buttons on finished world wonders (currently not deactivatable!)"],
                wwr: ["", ""],
                //wwi: [ "World wonder icons",'Adds world wonder icons on the strategic map' ],
                //con: [ "Context menu",	'Swaps "Select town" and "City overview" in the context menu'],
                //sen: [ "Sent units",		'Shows sent units in the attack/support window'],
                tov: ["Обзор Город", 'Заменяет новый обзор города с старом стиле окна'],  // ?
                scr: ["Колесо мыши", 'С помощью колеса мыши вы можете изменить взгляды'], // ?

                err: ["Отправить сообщения об ошибках автоматически", "Если вы включите эту опцию, вы можете помочь идентифицировать ошибки"]
            },

            labels: {
                uni: "Доступные войска",
                con: "выбирать",
                // Smileys
                std: "",
                gre: "",
                nat: "",
                ppl: "",
                oth: "",
                // Defense form
                ttl: "Обзор: Отчёт о городе",
                inf: "Информация о войсках и постройках:",
                dev: "Отклонение",
                det: "Детальный отчёт",
                prm: "Премиум-бонусы",
                sil: "Серебро в пещере",
                mov: "Перемещения",
                // WW
                leg: "",
                stg: "",
                tot: "",
                // Simulator
                str: "Сила войск",
                los: "Потери",
                mod: "без учёта заклинаний, бонусов, исследований",
                // Comparison box
                dsc: "Сравнение юнитов",
                hck: "Ударное",
                prc: "Колющее",
                dst: "Дальнего боя",
                sea: "Морские",
                att: "Атака",
                def: "Защита",
                spd: "Скорость",
                bty: "Добыча (ресурсы)",
                cap: "Вместимость транспортов",
                res: "Стоимость (ресурсы)",
                fav: "Благосклонность",
                tim: "Время найма (с)",
                // Trade
                rat: "",
                shr: "",
                per: "",
                // Sent units box
                lab: "Отправлено",
                improved_movement: "Улучшенная перемещение войск"
            },

            buttons: {
                sav: "Сохраниить", ins: "Вставка", res: "Сброс"
            }
        },
        ////////////////////////////////
        // Polish Translation by anpu //
        ////////////////////////////////
        pl: {
            settings: {
                dsc: "DIO-Tools oferuje (między innymi) poprawione widoki, nowe uśmieszki,<br>opcje handlu i zmiany w wyglądzie.",
                act: "Włącz/wyłącz funkcje skryptu:",
                prv: "podgląd poszczególnych opcji:"
            },
            options: {
                bir: ["Licznik birem", "Zlicza i sumuje biremy z miast"],
                sml: ["Emotki", "Dodaje dodatkowe (zielone) emotikonki"],
                str: ["Siła jednostek", "dodaje tabelki z siłą jednostek w różnych miejscach gry"],
                //trd: [ "Handel",			"Rozszerza okno handlu o handel procentowy, proporcje surowców wg jednostek, dodaje znaczniki dla festynów" ],
                per: ["Handel procentowy", ""],
                rec: ["Handel rekrutacyjne", ""],
                cnt: ["Podboje", "Zlicza wsparcia/ataki w oknie podboju (tylko własne podboje)"],
                way: ["Prędkość wojsk", "Wyświetla dodatkowo czas jednostek dla bonusu przyspieszone ruchy wojsk"],
                sim: ["Symulator", "Dostosowanie wyglądu symulatora oraz dodanie szybkich pól wyboru"],
                spl: ["Ramka czarów", "Kompaktowa pływająca ramka z czarami (można umieścić w dowolnym miejscu ekranu. Zapamiętuje położenie.)"],
                act: ["Ramki aktywności", "Ulepszony podgląd ruchów wojsk i handlu (można umieścić w dowolnym miejscu ekranu. Zapamiętuje położenie.)"],
                pop: ["Łaski", "Zmienia wygląd ramki informacyjnej o ilości produkowanych łask"],
                tsk: ["Pasek skrótów", "Powiększa pasek skrótów i minimalizuje okienko z bonusem dziennym"],
                irc: ["Czat", 'Zastępuje standardowy Chat chatem IRC (wymagany FlashPlayer)'],
                bbc: ["Raportów obronnych", "Rozszerza pasek skrótów BBcode o generator raportów obronnych"],
                com: ["Porównianie", "Dodaje tabelki z porównaniem jednostek"],
                tic: ["Ikony miasta", "Każde miasto otrzyma ikonę typu miasta (automatyczne wykrywanie)", "Dodatkowe ikony są dostępne dla ręcznego wyboru"], // ?
                til: ["Lista miasto", "Dodaje ikony miasta do listy miasta"], // ?
                tim: ["Mapa", "Zestawy ikon miasta na mapie strategicznej"], // ?
                wwc: ["Cuda Świata", "Liczy udział w budowie oraz ilość wysłanych surowców na budowę Cudu Świata oraz dodaje przyciski do szybkiego przełączania między cudami (obecnie nie możliwe do wyłączenia)"],
                wwr: ["", ""],
                //wwi: [ "World wonder icons",'Adds world wonder icons on the strategic map' ],
                con: ["menu kontekstowe", 'Zamiemia miejcami przycisk "wybierz miasto" z przyciskiem "podgląd miasta" po kliknięciu miasta na mapie'],
                sen: ["Wysłane jednostki", 'Pokaż wysłane jednostki w oknie wysyłania ataków/wsparć'],
                tov: ["Podgląd miasta", 'Zastępuje nowy podgląd miasta starym'],
                scr: ["Zoom", 'Możesz zmienić poziom przybliżenia mapy kółkiem myszy'],

                err: ["Automatycznie wysyłać raporty o błędach", "Jeśli włączysz tę opcję, możesz pomóc zidentyfikować błędy"]

            },
            labels: {
                uni: "Dostępne jednostki",
                con: "Wybierz miasto",
                // Smileys
                std: "Standard" /* "Standardowe" */,
                gre: "Grepolis",
                nat: "Przyroda",
                ppl: "Ludzie",
                oth: "Inne",
                // Defense form
                ttl: "Podgląd: Obrona miasta",
                inf: "Informacje o mieście:",
                dev: "Ochyłka",
                det: "jednostki lądowe",
                prm: "opcje Premium",
                sil: "Ilość srebra",
                mov: "Ruchy wojsk",
                // WW
                leg: "Udział w Cudzie",
                stg: "Poziom",
                tot: "Łącznie",
                // Simulator
                str: "Siła jednostek",
                los: "Straty",
                mod: "bez modyfikatorów",
                // Comparison box
                dsc: "Porównianie jednostek",
                hck: "Obuchowa",
                prc: "Tnąca",
                dst: "Dystansowa",
                sea: "Morskie",
                att: "Offensywne",
                def: "Defensywne",
                spd: "Prędkość",
                bty: "Łup (surowce)",
                cap: "Pojemność transportu",
                res: "Koszta (surowce)",
                fav: "Łaski",
                tim: "Czas rekrutacji (s)",
                // Trade
                rat: "Stosunek surowców dla wybranej jednostki",
                shr: "procent zapełnienia magazynu w docelowym mieście",
                per: "Handel procentowy",
                // Sent units box
                lab: "Wysłane jednostki",
                improved_movement: "Przyspieszone ruchy wojsk"
            },
            buttons: {
                sav: "Zapisz", ins: "Wstaw", res: "Anuluj"
            }
        },
        //////////////////////////////////////////////
        // Spanish Translation by Juana de Castilla //
        //////////////////////////////////////////////
        es: {
            settings: {
                dsc: "DIO-Tools ofrece, entre otras cosas, varias pantallas, ventana de <br>emoticones, opciones de comercio y algunos cambios en el diseño.",
                act: "Activar/desactivar características de las herramientas:",
                prv: "Vista previa de varias características:"
            },
            options: {
                bir: ["Contador de birremes", "Cuenta los birremes de una ciudad y los suma"],
                sml: ["Emoticones", "Código BB para emoticones"],
                str: ["Fortaleza de la Unidad", "Añade tabla de fortalezas de cada unidad en varias zonas"],
                //trd: [ "Comercio",				"Añade en la pestaña de comercio un porcentaje de comercio y reclutamiento y limitadores de Mercado por cada ciudad" ],
                per: ["Comercio de porcentual", ""],
                rec: ["Comercio de reclutamiento", ""],
                cnt: ["Conquistas", "contador de ataques y refuerzos en la pestaña de conquista"],
                way: ["Velocidad de tropas", "Muestra movimiento de tropas mejorado en la ventana de ataque/refuerzo"],
                sim: ["Simulador", "Adaptación de la ventana del simulador incluyendo recuadro de modificadores"],
                spl: ["Ventana de hechizos", "Ventana deslizante y comprimida de los hechizos (memoria posicional)"],
                act: ["Ventana de actividad", "Mejora las ventanas de comercio y movimiento de tropas (memoria posicional)"],
                pop: ["Popup", "Cambia el popup de favores"],
                tsk: ["Barra de tareas", "aumenta la barra de tareas y minimice la recompensa al aparecer"],
                irc: ["Chat", 'Sustituye el chat de la alianza con un irc chat. (require FlashPlayer)'],
                bbc: ["Formulario de defensa", "Añade en la barra de códigos bb un formulario de defensa"],
                com: ["Comparación", "añade ventana de comparación de unidades"],
                tic: ["Iconos de la ciudad", "Cada ciudad recibe un icono para el tipo de la ciudad (detección automática)", "Iconos adicionales están disponibles para la selección manual"],
                til: ["Lista de la ciudad", "Agrega los iconos de la ciudad a la lista de la ciudad"],
                tim: ["Map", "Establece los iconos de la ciudad en el mapa estratégico"],
                wwc: ["Maravillas", "Calcula participación & contador de recursos + antes y después teclas de maravillas terminadas (no desactibable ahora!)"],
                wwr: ["", ""],
                //wwi: [ "World wonder icons",'Adds world wonder icons on the strategic map' ],
                con: ["menú contextual", 'Cambia "Elegir ciudad" y "vista de la ciudad" en el menú contextual '],
                sen: ["Unidades enviadas", 'Muestra las unidades enviadas en la ventana de ataque/refuerzos'],
                tov: ["Información de la ciudad", 'sustituye la vista nueva de ciudad por la ventana antigua'],
                scr: ["Rueda raton", 'Puede cambiar las vistas con la rueda del raton'],

                err: ["Enviar informes de errores automáticamente", "Si se activa esta opción, puede ayudar a identificar errores."]
            },
            labels: {
                uni: "Unidades disponibles",
                con: "Escoger ciudad",
                // Smileys
                std: "Standard",
                gre: "Grepolis",
                nat: "Natura",
                ppl: "Gente",
                oth: "Otros",
                // Defense form
                ttl: "Vista general: Defensa de la ciudad",
                inf: "Información de la ciudad:",
                dev: "Desviación",
                det: "Unidades de tierra detalladas",
                prm: "Bonos Premium",
                sil: "Volumen de plata",
                mov: "Movimientos de tropas:",
                // WW
                leg: "WW cuota",
                stg: "Nivel",
                tot: "Total",
                // Simulator
                str: "Fortaleza de la Unidad",
                los: "Perdida",
                mod: "sin influencia del modificador",
                // Comparison box
                dsc: "Comparación de Unidades",
                hck: "Contundente",
                prc: "Punzante",
                dst: "Distancia",
                sea: "Mar",
                att: "Ataque",
                def: "Defensa",
                spd: "Velocidad",
                bty: "Botín (recursos)",
                cap: "Capacidad de transporte",
                res: "Costes (recursos)",
                fav: "Favor",
                tim: "Tiempo de reclutamiento (s)",
                // Trade
                rat: "Proporción de recursos de un tipo de unidad",
                shr: "Porcentaje de la capacidad de almacenamiento de la ciudad destino",
                per: "Porcentaje de comercio",
                // Sent units box
                lab: "Unidades enviadas",
                improved_movement: "Movimiento de tropas mejorados"
            },
            buttons: {
                sav: "Guardar", ins: "Insertar", res: "Reinicio"
            }
        },
        ar: {},
        ////////////////////////////////////////////
        //  Portuguese (BR) Translation by  HELL  //
        ////////////////////////////////////////////
        br: {
            settings: {
                dsc: "DIO-Tools oferece, entre outras coisas, algumas telas, uma caixa de smiley, opções de comércio <br> e algumas alterações no layout.",
                act: "Ativar/desativar recursos do conjunto de ferramentas:",
                prv: "Pré-visualização de vários recursos:",

                version_old: "Versão não está atualizada",
                version_new: "Versão está atualizada",
                version_dev: "Versão do desenvolvedor",

                version_update: "Atualização",

                link_forum: "http://forum.en.grepolis.com/showthread.php?52104&goto=newpost",
                link_contact: "http://forum.en.grepolis.com/private.php?do=newpm&u=46211",

                forum: "Forum",
                author: "Autor",

                cat_units: "Unidades",
                cat_icons: "Ícones nas Cidades",
                cat_forum: "Forum",
                cat_trade: "Comércio",
                cat_wonders: "Maravilhas do Mundo",
                cat_layout: "Layout",
                cat_other: "Outros"
            },
            options: {
                bir: ["Contador de Birremes", "Conta as biremes da cidade na cidade"],
                ava: ["Unidades Disponíveis", "Conta as unidades disponíveis de todas as cidades"],
                sml: ["Smilies", "Estende o bbcode com uma caixa de smiley"],
                str: ["Força das Tropas", "Adiciona quadros de força das tropas em diversas áreas"],
                tra: ["Capacidade de Transporte", "Mostra a capacidade de transporte ocupado e disponível no menu de unidades"],
                per: ["Percentual de comércio", "Estende-se a janela de comércio com um percentual de comércio"],
                rec: ["Comércio para recrutamento", "Estende-se a janela de comércio com um comércio de recrutamento"],
                cnt: ["Conquistas", "Conta os ataques/apoios na janela de conquista"],
                way: ["Velocidade da Tropa", "Displays mostram a possivél velocidade de tropa na janela de ataque/suporte"],
                sim: ["Simulador", "Adaptação do layout simulador & exposição permanente da caixa poderes estendida"],
                spl: ["Caixa de Poderes Divinos", "Pequena caixa móvel & magnética de poderes divinos (com memória de posição) "],
                act: ["Ativar caixas suspensas de comércio e ataque", "Melhorias da exibição de caixas de comércio e atividade tropa (com memória de posição)"],
                pop: ["Caixa de favores divino", "Altera a caixa de favores divino por um novo layout"],
                tsk: ["Barra de tarefas", "Aumenta a barra de tarefas e minimiza a janela recompensa diária no inicio"],
                irc: ["Chat", 'Substituiu o da bate-papo por um bate-papo IRC. (Flash Player requerido)'],
                bbc: ["Pedido de Apoio", "Estende a barra de bbcode com uma forma de Pedido de Apoio Automática"],
                com: ["Comparação de Unidades", "Adiciona tabelas de comparação de unidade"],
                tic: ["Ícones nas Cidades", "Cada cidade recebe um ícone para o tipo de tropas na cidade (detecção automática) "," Ícones adicionais estão disponíveis para seleção manual"],
                til: ["Lista das Cidades", "Adiciona os ícones da cidade na lista de cidades"],
                tim: ["Mapa", "Mostra os ícones das cidades no mapa estratégico"],
                wwc: ["Calculadora de WW", "Cálculo compartilhado & contador de recursos + botões anterior e próxima maravilhas do mundo (atualmente não desactivável!)"],
                wwr: ["Classificação", "Classificação das maravilha do mundo redesenhadas"],
                wwi: ["Icones", 'Adiciona ícones nas maravilha do mundo no mapa estratégico'],
                con: ["Menu de Contexto", 'Troca da "Selecione cidade" e "Visão Geral da Cidade" no menu de contexto'],
                sen: ["Unidades Enviadas", 'Shows sent units in the attack/support window'],
                tov: ["Visão da Cidade", 'Substitui o novo panorama da cidade, com o estilo da janela antiga'],
                scr: ["Roda do Mouse", 'Você pode alterar os pontos de vista com a roda do mouse'],

                err: ["Enviar automaticamente relatórios de erros", "Se você ativar essa opção, você pode ajudar a identificar erros."],
                her: ["Conquista Thracian", "Redução de tamanho do mapa da conquista Thracian."]
            },
            labels: {
                uni: "Unidades disponíveis",
                con: "Selecionar cidade",
                // Smileys
                std: "Padrão",
                gre: "Grepolis",
                nat: "Natural",
                ppl: "Popular",
                oth: "Outros",
                hal: "Halloween",
                xma: "Natal",
                // Defense form
                ttl: "Pedido de Apoio",
                inf: "Informação da cidade:",
                dev: "Desvio",
                det: "Unidades Detalhadas",
                prm: "Bônus Premium",
                sil: "Prata na Gruta",
                mov: "Movimentação de Tropas:",
                // WW
                leg: "WW Maravilhas",
                stg: "Level",
                tot: "Total",
                // Simulator
                str: "Força das Unidades",
                los: "Perdas",
                mod: "Sem modificador de influência",
                // Comparison box
                dsc: "Comparação de unidades",
                hck: "Impacto",
                prc: "Corte",
                dst: "Arremço",
                sea: "Naval",
                att: "Ofensivo",
                def: "Defensivo",
                spd: "Velocidade",
                bty: "Saque (recursos)",
                cap: "Capacidade de trasporte",
                res: "Custo (recursos)",
                fav: "Favor",
                tim: "Tempo de recrutamento (s)",
                // Trade
                rat: "Proporção de recursos de um tipo de unidade",
                shr: "A partir do armazenamento sobre a cidade de destino",
                per: "Percentual de comércio",
                // Sent units box
                lab: "Unidades enviadas",
                improved_movement: "Movimentação de tropas com ajuste de bônus"
            },
            buttons: {
                sav: "Salvar", ins: "Inserir", res: "Resetar"
            }
        },
        pt : {}
    };

    LANG.ar = LANG.es;
    LANG.pt = LANG.br;

    // Create JSON
    // console.log(JSON.stringify(LANG.en));

    // Forum: Choose language
    if (uw.location.pathname !== "/game/index") {
        LID = uw.location.host.split(".")[1];
    }

    // Translation GET
    function getText(category, name) {
        var txt = "???";
        if (LANG[LID]) {
            if (LANG[LID][category]) {
                if (LANG[LID][category][name]) {
                    txt = LANG[LID][category][name];
                } else {
                    if (LANG.en[category]) {
                        if (LANG.en[category][name]) {
                            txt = LANG.en[category][name];
                        }
                    }
                }
            } else {
                if (LANG.en[category]) {
                    if (LANG.en[category][name]) {
                        txt = LANG.en[category][name];
                    }
                }
            }
        } else {
            if (LANG.en[category]) {
                if (LANG.en[category][name]) {
                    txt = LANG.en[category][name];
                }
            }
        }
        return txt;
    }

    /*******************************************************************************************************************************
     * Settings
     *******************************************************************************************************************************/

    // (De)activation of the features
    var options_def = {
        bir: true, // Biremes counter
        ava: true,	// Available units
        sml: true, // Smileys
        str: true, // Unit strength
        tra: true, // Transport capacity
        per: true, // Percentual Trade
        rec: true, // Recruiting Trade
        way: true, // Troop speed
        cnt: true, // Attack/support counter
        sim: true, // Simulator
        spl: true, // Spell box
        act: false,// Activity boxes
        tsk: true, // Task bar
        irc: true, // IRC-Chat
        pop: true, // Favor popup
        bbc: true, // BBCode bar
        com: true, // Unit comparison
        tic: true, // Town icons
        til: true, // Town icons: Town list
        tim: true, // Town icons: Map
        wwc: true, // World wonder counter
        wwr: true, // World wonder ranking
        wwi: true, // World wonder icons
        con: true, // Context menu
        sen: true, // Sent units
        tov: false,// Town overview
        scr: true, // Mausrad,

        err: false,// Error Reports
        her: true	// Thrakische Eroberung
    };

    if (uw.location.pathname === "/game/index") {
        for (var opt in options_def) {
            if (options_def.hasOwnProperty(opt)) {
                if (DATA.options[opt] === undefined) {
                    DATA.options[opt] = options_def[opt];
                }
            }
        }
    }

    var version_text = '', version_color = 'black';

    function getLatestVersion() {
        $('<style id="dio_version">' +
            '#version_info .version_icon { background: url(http://666kb.com/i/ct1etaz0uyohw402i.png) -50px -50px no-repeat; width:25px; height:25px; float:left; } ' +
            '#version_info .version_icon.red { -webkit-filter: hue-rotate(-100deg); } ' +
            '#version_info .version_icon.green { -webkit-filter: hue-rotate(0deg); } ' +
            '#version_info .version_icon.blue { -webkit-filter: hue-rotate(120deg); } ' +
            '#version_info .version_text { line-height: 2; margin: 0px 6px 0px 6px; float: left;} ' +
            '</style>').appendTo("head");

        var v_info = $('#version_info');
        if (version_text === '') {
            $.ajax({
                type: "GET", url: "https://diotools.de/scripts/version.php",
                success: function (response) {
                    var latest_version = parseFloat(response),
                        current_version = parseFloat(version);

                    if (current_version < latest_version) {
                        version_text = "<div class='version_icon red'></div><div class='version_text'>" + getText('settings', 'version_old') + "</div><div class='version_icon red'></div>" +
                            '<a class="version_text" href="https://diotools.de/downloads/DIO-TOOLS.user.js" target="_blank">--> Update</a>';
                        version_color = 'crimson';
                    } else if (current_version == latest_version) {
                        version_text = "<div class='version_icon green'></div><div class='version_text'>" + getText('settings', 'version_new') + "</div><div class='version_icon green'></div>";
                        version_color = 'darkgreen';
                    } else {
                        version_text = "<div class='version_icon blue'></div><div class='version_text'>" + getText('settings', 'version_dev') + "</div><div class='version_icon blue'></div>";
                        version_color = 'darkblue';
                    }
                    v_info.html(version_text).css({color: version_color});
                }
            });
        } else {
            v_info.html(version_text).css({color: version_color});
        }
    }

    // Add DIO-Tools to grepo settings
    function settings() {
        var wid = $(".settings-menu").get(0).parentNode.id;

        if (!$("#dio_tools").get(0)) {
            $(".settings-menu ul:last").append('<li id="dio_li"><img id="dio_icon" src="http://www.greensmilies.com/smile/smiley_emoticons_smile.gif"></div> <a id="dio_tools" href="#"> DIO-Tools</a></li>');
        }

        $(".settings-link").click(function () {
            $('.section').each(function () {
                this.style.display = "block";
            });
            $('.settings-container').removeClass("dio_overflow");

            $('#dio_bg_medusa').css({display: "none"});

            if ($('#dio_settings').get(0)) {
                $('#dio_settings').get(0).style.display = "none";
            }
        });

        $("#dio_tools").click(function () {
            if ($('.email').get(0)) {
                $('.settings-container').removeClass("email");
            }

            $('.settings-container').addClass("dio_overflow");

            $('#dio_bg_medusa').css({display: "block"});

            if (!$('#dio_settings').get(0)) {
                // Styles
                $('<style id="dio_settings_style">' +
                        // Chrome Scroollbar Style
                    '#dio_settings ::-webkit-scrollbar { width: 13px; } ' +
                    '#dio_settings ::-webkit-scrollbar-track { background-color: rgba(130, 186, 135, 0.5); border-top-right-radius: 4px; border-bottom-right-radius: 4px; } ' +
                    '#dio_settings ::-webkit-scrollbar-thumb { background-color: rgba(87, 121, 45, 0.5); border-radius: 3px; } ' +
                    '#dio_settings ::-webkit-scrollbar-thumb:hover { background-color: rgba(87, 121, 45, 0.8); } ' +

                    '#dio_settings table tr :first-child { text-align:center; vertical-align:top; } ' +

                    '#dio_settings #version_info { font-weight:bold;height: 35px;margin-top:-5px; } ' +
                    '#dio_settings #version_info img { margin:-1px 2px -8px 0px; } ' +

                    '#dio_settings .icon_types_table { font-size:0.7em; line-height:2.5; border:1px solid green; border-spacing:10px 2px; border-radius:5px; } ' +
                    '#dio_settings .icon_types_table td { text-align:left; } ' +

                    '#dio_settings table p { margin:0.2em 0em; } ' +

                    '#dio_settings .checkbox_new .cbx_caption { white-space:nowrap; margin-right:10px; font-weight:bold; } ' +

                    '#dio_settings .dio_settings_tabs {width:auto; border:2px solid darkgreen; background:#2B241A; padding:1px 1px 0px 1px; right:auto; border-top-left-radius:5px; border-top-right-radius:5px; border-bottom:0px;} ' +

                    '#dio_settings .dio_settings_tabs li { float:left; } ' +

                    '#dio_settings .icon_small { margin:0px; } ' +

                    '#dio_settings img { max-width:90px; max-height:90px; margin-right:10px; } ' +

                    '#dio_settings .content { border:2px solid darkgreen; border-radius:5px; border-top-left-radius:0px; background:rgba(31, 25, 12, 0.1); top:23px; position:relative; padding:10px; height:350px; overflow-y:auto; } ' +
                    '#dio_settings .content .content_category { display:none; border-spacing:5px; } ' +

                    '#dio_settings .dio_options_table legend { font-weight:bold; } ' +
                    '#dio_settings .dio_options_table p { margin:0px; } ' +
                    '#dio_settings #donate_btn { -webkit-filter: hue-rotate(45deg); } ' +

                    '#donate_btn { background: url(' + dio_sprite + '); width:100px; height:26px;} ' +
                    '#donate_btn.de { background-position: 0px 250px } ' +
                    '#donate_btn.en { background-position: 0px 300px } ' +

                    '#dio_hall table { border-spacing: 9px 3px; } ' +
                    '#dio_hall table th { text-align:left !important;color:green;text-decoration:underline;padding-bottom:10px; } ' +
                    '#dio_hall table td.value { text-align: right; } ' +

                    '#dio_hall table td.laurel.green { background: url("/images/game/ally/founder.png") no-repeat; height:18px; width:18px; background-size:100%; } ' +
                    '#dio_hall table td.laurel.bronze { background: url("https://diotools.de/images/game/laurel_sprite.png") no-repeat 25%; height:18px; width:18px; } ' +
                    '#dio_hall table td.laurel.silver { background: url("https://diotools.de/images/game/laurel_sprite.png") no-repeat 50%; height:18px; width:18px; } ' +
                    '#dio_hall table td.laurel.gold { background: url("https://diotools.de/images/game/laurel_sprite.png") no-repeat 75%; height:18px; width:18px; } ' +
                    '#dio_hall table td.laurel.blue { background: url("https://diotools.de/images/game/laurel_sprite.png") no-repeat 100%; height:18px; width:18px; } ' +
                    '</style>').appendTo('head');


                $('.settings-container').append(
                    '<div id="dio_settings" class="player_settings section"><div id="dio_bg_medusa"></div>' +
                    '<div class="game_header bold"><a href="#" target="_blank" style="color:white">DIO-Tools (v' + version + ')</a></div>' +

                        // Check latest version
                    '<div id="version_info"><img src="http://666kb.com/i/csmicltyu4zhiwo5b.gif" /></div>' +

                        // Donate button
                    '<div style="position:absolute; left: 495px;top: 40px;"><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3EWUQUTMC5VKS" target="_blank">' +
                    '<div id="donate_btn" class="' + LID + '" alt="Donate"></div></a></div>' +

                        // Settings navigation
                    '<ul class="menu_inner dio_settings_tabs">' +
                    '<li><a class="submenu_link active" href="#" id="dio_units"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_units") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="dio_icons"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_icons") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="dio_forum"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_forum") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="dio_trade"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_trade") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="dio_wonder"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_wonders") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="dio_layout"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_layout") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" href="#" id="dio_other"><span class="left"><span class="right"><span class="middle">' + getText("settings", "cat_other") + '</span></span></span></a></li>' +
                    '</ul>' +

                        // Settings content
                    '<DIV class="content">' +

                        // Units tab
                    '<table id="dio_units_table" class="content_category visible"><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/units/available_units.png" alt="" /></td>' +
                    '<td><div id="ava" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "ava")[0] + '</div></div>' +
                    '<p>' + getText("options", "ava")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/units/sent_units.png" alt="" /></td>' +
                    '<td><div id="sen" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "sen")[0] + '</div></div>' +
                    '<p>' + getText("options", "sen")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/units/unit_strength.png" alt="" /></td>' +
                    '<td><div id="str" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "str")[0] + '</div></div>' +
                    '<p>' + getText("options", "str")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/units/transport_capacity.png" alt="" /></td>' +
                    '<td><div id="tra" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "tra")[0] + '</div></div>' +
                    '<p>' + getText("options", "tra")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/units/unit_comparison.png" alt="" /></td>' +
                    '<td><div id="com" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "com")[0] + '</div></div>' +
                    '<p>' + getText("options", "com")[1] + '</p></td>' +
                    '</tr></table>' +

                        // Icons tab
                    '<table id="dio_icons_table" class="content_category"><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/townicons/townicons.png" alt="" /></td>' +
                    '<td><div id="tic" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "tic")[0] + '</div></div>' +
                    '<p>' + getText("options", "tic")[1] + '</p>' +
                    '<table class="icon_types_table">' +
                    '<tr><td style="width:115px"><div class="icon_small townicon_lo"></div> Land Offensive</td>' + '<td><div class="icon_small townicon_fo"></div> Fly Offensive</td></tr>' +
                    '<tr><td><div class="icon_small townicon_ld"></div> Land Defensive</td>' + '<td><div class="icon_small townicon_fd"></div> Fly Defensive</td></tr>' +
                    '<tr><td><div class="icon_small townicon_so"></div> Navy Offensive</td>' + '<td><div class="icon_small townicon_no"></div> Outside</td></tr>' +
                    '<tr><td><div class="icon_small townicon_sd"></div> Navy Defensive</td>' + '<td><div class="icon_small townicon_po"></div> Empty</td></tr>' +
                    '</table><br>' +
                    '<p>' + getText("options", "tic")[2] + ':</p>' +
                    '<div class="icon_small townicon_sh"></div><div class="icon_small townicon_di"></div><div class="icon_small townicon_un"></div><div class="icon_small townicon_ko"></div>' +
                    '<div class="icon_small townicon_ti"></div><div class="icon_small townicon_gr"></div><div class="icon_small townicon_dp"></div><div class="icon_small townicon_re"></div>' +
                    '<div class="icon_small townicon_wd"></div><div class="icon_small townicon_st"></div><div class="icon_small townicon_si"></div><div class="icon_small townicon_bu"></div>' +
                    '<div class="icon_small townicon_he"></div><div class="icon_small townicon_ch"></div><div class="icon_small townicon_bo"></div><div class="icon_small townicon_fa"></div>' +
                    '<div class="icon_small townicon_wo"></div>' +
                    '</td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/townicons/townlist.png" alt="" style="border: 1px solid rgb(158, 133, 78);" /></td>' +
                    '<td><div id="til" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "til")[0] + '</div></div>' +
                    '<p>' + getText("options", "til")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/townicons/map.png" alt="" /></td>' +
                    '<td><div id="tim" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "tim")[0] + '</div></div>' +
                    '<p>' + getText("options", "tim")[1] + '</p></td>' +
                    '</tr></table>' +

                        // Forum tab
                    '<table id="dio_forum_table" class="content_category"><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/forum/smiley_box.png" alt="" /></td>' +
                    '<td><div id="sml" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "sml")[0] + '</div></div>' +
                    '<p>' + getText("options", "sml")[1] + '</p>' +
                    '<img src="http://www.greensmilies.com/smile/smiley_emoticons_mttao_wassermann.gif" /> <img src="http://666kb.com/i/cigrqlp2odi2kqo24.gif" /> ' +
                    '<img src="http://666kb.com/i/cifvfsu3e2sdiipn0.gif" alt="" /> <img src="http://666kb.com/i/cigmv8wnffb3v0ifg.gif" /> ' +
                    '<img src="http://666kb.com/i/cj2byjendffymp88t.gif" alt="" /> <img src="http://666kb.com/i/cj1l9gndtu3nduyvi.gif" /> ' +
                    '<img src="http://666kb.com/i/cigrmpfofys5xtiks.gif" alt="" />' + //'<img src="http://666kb.com/i/cifohielywpedbyh8.gif" />'+
                    '<br><br><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/forum/def_formular.png" alt="" /></td>' +
                    '<td><div id="bbc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "bbc")[0] + '</div></div>' +
                    '<p>' + getText("options", "bbc")[1] + '</p><br><img src="http://s1.directupload.net/images/140401/9b2ydh82.png" alt="" style="max-width:none !important;" /></td>' +
                    '</tr></table>' +

                        // Trade tab
                    '<table id="dio_trade_table" class="content_category"><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/trade/recruiting_trade.png" /></td>' +
                    '<td><div id="rec" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "rec")[0] + '</div></div>' +
                    '<p>' + getText("options", "rec")[1] + '</p><br>' +
                        /*
                         '<p><u>Beispiel Feuerschiffe:</u><br>'+
                         '<p>Verhältnisauswahl</p>'+
                         '<table style="font-size: 0.7em;line-height: 2.5;border: 1px solid green;border-spacing: 10px 2px;border-radius: 5px;">'+
                         '<tr><th></th><th><div class="icon_small townicon_wd"></div></th><td></td><th><div class="icon_small townicon_st"></div></th><td></td><th><div class="icon_small townicon_si"></div></th></tr>'+
                         '<tr><td>Kosten</td><td>1300</td><td></td><td>300</td><td></td><td>800</td></tr>'+
                         '<tr><td>Verhältnis</td><td>1</td><td>:</td><td>0.23</td><td>:</td><td>0.62</td></tr>'+
                         '</table>'+
                         '<p>Lagergröße Zielstadt: 25500 - 1000 Puffer (=100%)</p>'+
                         '<p>Handelsmenge 25%: </p>'+
                         '<table style="font-size: 0.7em;line-height: 2.5;">'+
                         '<tr><td>4 x 25%</td><td>4 x 25%</td><td>...</td></tr>'+
                         '<tr><td><img src="http://s7.directupload.net/images/140920/uc4dsyp9.png" style="width:60px" /></td>'+
                         '<td><img src="http://s7.directupload.net/images/140920/uc4dsyp9.png" style="width:60px" /></td><td>...</td></tr>'+
                         '</table>'+
                         //'- Versenden von 35 einzelnen Rohstoffportionen im Anteil 20% (z.B. 4900 Holz, 1130 Stein, 3015 Silber bei Lagerkapazität von 25.500), das heißt 5 Portionen für einen Rekrutierungsslot'+
                         //'- nach Ankommen von jeweils 5 Portionen, Einheiten in Auftrag geben (19-21 Feuerschiffe bei maximaler Lagerkapazität)'+
                         //'Ein Puffer von 1000 Rohstoffeinheiten wird dabei von der Lagerkapazität der Zielstadt abgezogen, damit Rekrutierungsreste und neu produzierte Rohstoffe nicht gleich zum Überlaufen des Lagers führen.'+
                         //'Das Ganze beschleunigt das Befüllen der Rekrutierungsschleifen enorm und es gehen dabei keine Rohstoffe verloren.</p>'+
                         '<br><br><br></td>'+
                         */
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/trade/percentage_trade.png" /></td>' +
                    '<td><div id="per" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "per")[0] + '</div></div>' +
                    '<p>' + getText("options", "per")[1] + '</p><br></td>' +
                        /*
                         '</tr><tr>'+
                         '<td><img src="http://s7.directupload.net/images/140917/tveb5n33.png" /></td>'+
                         '<td><div id="trd2" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">Trade Limit Marker</div></div>'+
                         '<p></p></td>'+
                         */
                    '</tr></table>' +

                        // World wonder tab
                    '<table id="dio_wonder_table" class="content_category"><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/wonders/share.png" alt="" /></td>' +
                    '<td><div id="wwc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "wwc")[0] + '</div></div>' +
                    '<p>' + getText("options", "wwc")[1] + '</p><br/>' +
                    '<img src="https://diotools.de/images/game/settings/wonders/share_calculator.png" alt="" style="max-width:none !important;" /></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/wonders/ranking.png" alt="" /></td>' +
                    '<td><div id="wwr" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "wwr")[0] + '</div></div>' +
                    '<p>' + getText("options", "wwr")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/wonders/icons.png" alt="" /></td>' +
                    '<td><div id="wwi" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "wwi")[0] + '</div></div>' +
                    '<p>' + getText("options", "wwi")[1] + '</p></td>' +
                    '</tr></table>' +

                        // Layout tab
                    '<table id="dio_layout_table" class="content_category"><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/layout/simulator.png" alt="" /></td>' +
                    '<td><div id="sim" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "sim")[0] + '</div></div>' +
                    '<p>' + getText("options", "sim")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/layout/spellbox.png" alt="" /></td>' +
                    '<td><div id="spl" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "spl")[0] + '</div></div>' +
                    '<p>' + getText("options", "spl")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/layout/taskbar.png" alt="" /></td>' +
                    '<td><div id="tsk" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "tsk")[0] + '</div></div>' +
                    '<p>' + getText("options", "tsk")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/layout/favor_popup.png" alt="" /></td>' +
                    '<td><div id="pop" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "pop")[0] + '</div></div>' +
                    '<p>' + getText("options", "pop")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/layout/contextmenu.png" alt="" /></td>' +
                    '<td><div id="con" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "con")[0] + '</div></div>' +
                    '<p>' + getText("options", "con")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/layout/activity_boxes.png" alt="" /></td>' +
                    '<td><div id="act" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "act")[0] + '</div></div>' +
                    '<p>' + getText("options", "act")[1] + '</p></td>' +
                    '</tr></table>' +

                        // Other Stuff tab
                    '<table id="dio_other_table" class="content_category"><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/misc/troop_speed.png" style="border: 1px solid rgb(158, 133, 78);" alt="" /></td>' +
                    '<td><div id="way" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "way")[0] + '</div></div>' +
                    '<p>' + getText("options", "way")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/misc/chat.png" alt="" /></td>' +
                    '<td><div id="irc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "irc")[0] + '</div></div>' +
                    '<p>' + getText("options", "irc")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/misc/conquer_counter.png" style="border: 1px solid rgb(158, 133, 78);" alt="" /></td>' +
                    '<td><div id="cnt" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "cnt")[0] + '</div></div>' +
                    '<p>' + getText("options", "cnt")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="https://diotools.de/images/game/settings/misc/mousewheel_zoom.png" alt="" /></td>' +
                    '<td><div id="scr" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "scr")[0] + '</div></div>' +
                    '<p>' + getText("options", "scr")[1] + '</p><br><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td><div id="err" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("options", "err")[0] + '</div></div>' +
                    '<p>' + getText("options", "err")[1] + '</p></td>' +
                    '</tr></table>' +


                        // Hall of DIO-Tools tab
                    '<div id="dio_hall" class="content_category">'+
                        "<p>I like to thank all of you who helped the development of DIO-Tools by donating or translating!</p>"+
                    '<table style="float:left;margin-right: 75px;">'+
                    '<tr><th colspan="3">Donations</th></tr>'+
                    (function(){
                        var donations = [
                            ["Eduard R", 50],
                            ["Gregoire L", 25],
                            ["Renee A", 20], ["Dirk R", 20], ["Patti T", 20],
                            ["Klaus N", 15],
                            ["Marco S", 10], ["Richard L", 10], ["Carsten K", 10], ["Tatiana H", 10], ["Ursula S", 10], ["Susanne S", 10], ["Falk T", 10],
                            ["Belinda M", 8], ["Wolfgang R", 8],
                            ["Miguel B", 7],
                            ["Antje S", 5], ["Hans-Jörg S", 5], ["Deanna P", 5], ["ForexTraction", 5], ["Rene F", 5], ["Rüdiger D", 5], ["Hans Hermann S", 5],
                            ["Siegbert M", 5], ["Wilhelm B", 5], ["Peter P", 5], ["Helga W", 5], ["Lydia R", 5],
                            ["Michael S", 3],
                            ["Mario P", 2], ["Artur G", 2], ["Heiko K", 2], ["Alexander B", 2], ["Dick N", 2],
                            ["Marcel G", 1], ["Ramona L", 1], ["Dennis S", 1], ["Konstandinos K", 1], ["Sarl T", 1], ["Jagadics I", 1], ["Andreas R", 1],
                            ["Peter F", 1], ["Vinicio G", 1], ["Marielle M", 1], ["Christian B", 1], ["Bernd W", 1], ["Maria N", 1], ["Thomas W", 1],
                            ["Domenik F", 1], ["Oliver H", 1], ["Jens R", 1], ["Nicole S", 1], ["Hartmut S", 1], ["Alex L", 1], ["Andreas S", 1]
                        ];
                        var donation_table = "";

                        for(var d = 0; d < donations.length; d++){

                            var donation_class = "";

                            switch(donations[d][1]){
                                case 50: donation_class = "gold";   break;
                                case 25: donation_class = "silver"; break;
                                case 20: donation_class = "bronze"; break;
                                default: donation_class = "green";  break;
                            }

                            donation_table += '<tr class="donation"><td class="laurel '+ donation_class +'"></td><td>' + donations[d][0] + '</td><td class="value">' + donations[d][1] + '€</td></tr>';
                        }

                        return donation_table;
                    })() +
                    '</table>'+
                    '<table>'+
                    '<tr><th colspan="3">Translations</th></tr>'+
                    (function(){
                        var translations = [
                            ["eclat49", "FR"],
                            ["MrBobr", "RU"],
                            ["anpu", "PL"],
                            ["Juana de Castilla", "ES"],
                            ["HELL", "BR"]
                        ];

                        var translation_table = "";

                        for(var d = 0; d < translations.length; d++){
                            translation_table += '<tr class="translation"><td class="laurel blue"></td><td >' + translations[d][0] + '</td><td class="value">' + translations[d][1] + '</td></tr>';
                        }

                        return translation_table;
                    })() +
                    '</table>'+
                    '</div>' +

                    '</DIV>' +

                    // Links (Forum, PM, ...)
                    '<div style="bottom: -50px;font-weight: bold;position: absolute;width: 99%;">' +

                    '<a id="hall_of_diotools" href="#" style="font-weight:bold; float:left">' +
                    '<img src="/images/game/ally/founder.png" alt="" style="float:left;height:19px;margin:0px 5px -3px;"><span>Hall of DIO-Tools</span></a>' +

                    '<span class="bbcodes_player bold" style="font-weight:bold; float:right; margin-left:20px;">' + getText("settings", "author") + ': ' +
                    '<a id="link_contact" href=' + getText("settings", "link_contact") + ' target="_blank">Diony</a></span>' +

                    '<a id="link_forum" href=' + getText("settings", "link_forum") + ' target="_blank" style="font-weight:bold; float:right">' +
                    '<img src="http://forum.de.grepolis.com/grepolis/statusicon/forum_new-16.png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getText("settings", "forum") + '</span></a>' +

                    '</div>' +

                    '</div></div>');

                getLatestVersion();

                // Tab event handler
                $('#dio_settings .dio_settings_tabs .submenu_link').click(function () {
                    if (!$(this).hasClass("active")) {
                        $('#dio_settings .dio_settings_tabs .submenu_link.active').removeClass("active");
                        $(this).addClass("active");
                        $("#dio_settings .visible").removeClass("visible");
                        $("#" + this.id + "_table").addClass("visible");
                    }
                });

                //
                $('#hall_of_diotools').click(function () {
                    $('#dio_settings .dio_settings_tabs .submenu_link.active').removeClass("active");

                    $("#dio_settings .visible").removeClass("visible");
                    $("#dio_hall").addClass("visible");
                });

                $("#dio_settings .checkbox_new").click(function () {
                    $(this).toggleClass("checked").toggleClass("disabled").toggleClass("green");
                    toggleActivation(this.id);

                    DATA.options[this.id] = $(this).hasClass("checked");

                    saveValue("options", JSON.stringify(DATA.options));
                });
                for (var e in DATA.options) {
                    if (DATA.options.hasOwnProperty(e)) {
                        if (DATA.options[e] === true) {
                            $("#" + e).addClass("checked").addClass("green");
                        } else {
                            $("#" + e).addClass("disabled");
                        }
                    }
                }

                $('#dio_save').click(function () {
                    $('#dio_settings .checkbox_new').each(function () {
                        var act = false;
                        if ($("#" + this.id).hasClass("checked")) {
                            act = true;
                        }
                        DATA.options[this.id] = act;
                    });
                    saveValue("options", JSON.stringify(DATA.options));
                });
            }
            $('.section').each(function () {
                this.style.display = "none";
            });
            $('#dio_settings').get(0).style.display = "block";
        });
    }

    function toggleActivation(opt) {
        var FEATURE, activation = true;
        switch (opt) {
            case "sml":
                FEATURE = SmileyBox;
                break;
            case "bir":
                FEATURE = BiremeCounter;
                break;
            case "str":
                FEATURE = UnitStrength.Menu;
                break;
            case "tra":
                FEATURE = TransportCapacity;
                break;
            case "ava":
                FEATURE = AvailableUnits;
                break;
            case "sim":
                FEATURE = Simulator;
                break;
            case "spl":
                FEATURE = Spellbox;
                break;
            case "tsk":
                FEATURE = Taskbar;
                break;
            case "scr":
                FEATURE = MouseWheelZoom;
                break;
            case "irc":
                FEATURE = Chat;
                break;
            case "com":
                FEATURE = UnitComparison;
                break;
            case "pop":
                FEATURE = FavorPopup;
                break;
            case "con":
                FEATURE = ContextMenu;
                break;
            case "tic":
                FEATURE = TownIcons;
                break;
            case "tim":
                FEATURE = TownIcons.Map;
                break;
            case "til":
                FEATURE = TownList;
                break;
            case "sen":
                FEATURE = SentUnits;
                break;
            case "act":
                FEATURE = ActivityBoxes;
                break;
            case "wwc":
                FEATURE = WorldWonderCalculator;
                break;
            case "wwr":
                FEATURE = WorldWonderRanking;
                break;
            case "wwi":
                FEATURE = WorldWonderIcons;
                break;
            case "pom":
                FEATURE = PoliticalMap;
                break;

            default:
                activation = false;
                break;
        }
        if (activation) {
            if (DATA.options[opt]) {
                FEATURE.deactivate();
            } else {
                FEATURE.activate();
            }
        }
    }

    function addSettingsButton() {
        var tooltip_str = "DIO-Tools: " + (DM.getl10n("layout", "config_buttons").settings || "Settings");

        $('<div class="btn_settings circle_button dio_settings"><div class="dio_icon js-caption"></div></div>').appendTo(".gods_area");

        // Style
        $('<style id="dio_settings_button" type="text/css">' +
            '#ui_box .btn_settings.dio_settings { top:95px; right:103px; z-index:10; } ' +
            '#ui_box .dio_settings .dio_icon { margin:7px 0px 0px 4px; width:24px; height:24px; background:url(http://666kb.com/i/cifvfsu3e2sdiipn0.gif) no-repeat 0px 0px; background-size:100% } ' +
            '#ui_box .dio_settings .dio_icon.click { margin-top:8px; }' +
            '</style>').appendTo('head');

        // Tooltip
        $('.dio_settings').tooltip(tooltip_str);

        // Mouse Events
        $('.dio_settings').on('mousedown', function () {
            $('.dio_icon').addClass('click');
        });
        $('.dio_settings').on('mouseup', function () {
            $('.dio_icon').removeClass('click');
        });
        $('.dio_settings').click(openSettings);
    }

    var diosettings = false;

    function openSettings() {
        if (!GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_PLAYER_SETTINGS)) {
            diosettings = true;
        }
        Layout.wnd.Create(GPWindowMgr.TYPE_PLAYER_SETTINGS, 'Settings');
    }

    var exc = false, sum = 0, ch = ["FBADAF", "IGCCJB"], alpha = 'ABCDEFGHIJ';

    function a() {
        var pA = PID.toString(), pB = "";

        for (var c in pA) {
            if (pA.hasOwnProperty(c)) {
                pB += alpha[pA[parseInt(c, 10)]];
            }
        }

        sum = 0;
        for (var b in ch) {
            if (ch.hasOwnProperty(b)) {
                if (pB !== ch[b]) {
                    exc = true;
                } else {
                    exc = false;
                    return;
                }
                for (var s in ch[b]) {
                    if (ch[b].hasOwnProperty(s)) {
                        sum += alpha.indexOf(ch[b][s]);
                    }
                }
            }
        }
    }

    var autoTownTypes, manuTownTypes, population, sentUnitsArray, biriArray, spellbox, commandbox, tradebox, wonder, wonderTypes;

    function setStyle() {
        // Settings
        $('<style id="dio_settings_style" type="text/css">' +
            '#dio_bg_medusa { background:url(' + dio_sprite + ') -160px -43px no-repeat; height: 510px; width: 260px; right: -10px; z-index: -1; position: absolute;} ' +
            '.dio_overflow  { overflow: hidden; } ' +
            '#dio_icon  { width:15px; vertical-align:middle; margin-top:-2px; } ' +
            '#quackicon { width:15px !important; vertical-align:middle !important; margin-top:-2px; height:12px !important; } ' +
            '#dio_settings .green { color: green; } ' +
            '#dio_settings .visible { display:block !important; } ' +
            '</style>').appendTo('head');

        // Town Icons
        $('<style id="dio_icons" type="text/css">.icon_small { position:relative; height:20px; width:25px; margin-left:-25px; }</style>').appendTo('head');

        // Tutorial-Quest Container
        $('<style id="dio_quest_container" type="text/css"> #tutorial_quest_container { top: 130px } </style>').appendTo('head');

        // Velerios
        $('<style id="dio_velerios" type="text/css"> #ph_trader_image { background-image: url(http://s14.directupload.net/images/140826/mh8k8nyw.jpg); } </style>').appendTo('head');
        // http://s7.directupload.net/images/140826/bgqlsdrf.jpg

        // Specific player wishes
        if (PID == 1212083) {
            $('<style id="dio_wishes" type="text/css"> #world_end_info { display: none; } </style>').appendTo('head');
        }
    }

    if (uw.location.pathname === "/game/index") {
        setStyle();
    }

    function loadFeatures() {
        if (typeof(ITowns) !== "undefined") {

            autoTownTypes = {};
            manuTownTypes = DATA.townTypes;
            population = {};

            sentUnitsArray = DATA.sentUnits;
            biriArray = DATA.biremes;

            spellbox = DATA.spellbox;
            commandbox = DATA.commandbox;
            tradebox = DATA.tradebox;

            wonder = DATA.worldWonder;
            wonderTypes = DATA.worldWonderTypes;

            var DIO_USER = {'name': uw.Game.player_name, 'market': MID};
            saveValue("dio_user", JSON.stringify(DIO_USER));


            $.Observer(uw.GameEvents.game.load).subscribe('DIO_START', function (e, data) {
                a();

                // English => default language
                if (!LANG[LID]) {
                    LID = "en";
                }

                if ((ch.length == 2) && exc && (sum == 42)) {
                    // AJAX-EVENTS
                    setTimeout(function () {
                        ajaxObserver();
                    }, 0);

                    addSettingsButton();

                    addFunctionToITowns();

                    if (DATA.options.tsk) {
                        setTimeout(function () {
                            minimizeDailyReward();
                            Taskbar.activate();
                        }, 0);
                    }

                    //addStatsButton();

                    fixUnitValues();

                    setTimeout(function () {

                        var waitCount = 0;

                        // No comment... it's Grepolis... i don't know... *rolleyes*
                        function waitForGrepoLazyLoading() {
                            if (typeof(ITowns.townGroups.getGroupsDIO()[-1]) !== "undefined" && typeof(ITowns.getTown(Game.townId).getBuildings) !== "undefined") {

                                try {
                                    // Funktion wird manchmal nicht ausgeführt:
                                    var units = ITowns.getTown(Game.townId).units();


                                    getAllUnits();

                                    setInterval(function () {
                                        getAllUnits();
                                    }, 900000); // 15min

                                    if (DATA.options.ava) {
                                        setTimeout(function () {
                                            AvailableUnits.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.tic) {
                                        setTimeout(function () {
                                            TownIcons.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.tim) {
                                        setTimeout(function () {
                                            TownIcons.Map.activate();
                                        }, 0);
                                    }
                                    if (DATA.options.til) {
                                        setTimeout(function () {
                                            TownList.activate();
                                        }, 0);
                                    }
                                } catch(e){
                                    if(waitCount < 12) {
                                        waitCount++;

                                        console.warn("DIO-Tools | Fehler | getAllUnits | units() fehlerhaft ausgeführt?", e);

                                        // Ausführung wiederholen
                                        setTimeout(function () {
                                            waitForGrepoLazyLoading();
                                        }, 5000); // 5s
                                    }
                                    else {
                                        errorHandling(e, "waitForGrepoLazyLoading2");
                                    }
                                }
                            }
                            else {
                                var e = { "stack": "getGroups() = " + typeof(ITowns.townGroups.getGroupsDIO()[-1]) + ", getBuildings() = " + typeof(ITowns.getTown(Game.townId).getBuildings) };

                                if(waitCount < 12) {
                                    waitCount++;

                                    console.warn("DIO-Tools | Fehler | getAllUnits | " + e.stack);

                                    // Ausführung wiederholen
                                    setTimeout(function () {
                                        waitForGrepoLazyLoading();
                                    }, 5000); // 5s
                                }
                                else {


                                    errorHandling(e, "waitForGrepoLazyLoading2");
                                }
                            }
                        }

                        waitForGrepoLazyLoading();

                    }, 0);

                    if (DATA.options.pop) {
                        setTimeout(function () {
                            FavorPopup.activate();
                        }, 0);
                    }
                    if (DATA.options.spl) {
                        setTimeout(function () {
                            Spellbox.activate();
                        }, 0);
                    }

                    imageSelectionProtection();

                    if (DATA.options.con) {
                        setTimeout(function () {
                            ContextMenu.activate();
                        }, 0);
                    }

                    if (DATA.options.act) {
                        setTimeout(function () {
                            ActivityBoxes.activate();
                        }, 0);
                    }

                    if (DATA.options.str) {
                        setTimeout(function () {
                            UnitStrength.Menu.activate();
                            hideNavElements();
                        }, 0);
                    }

                    if (DATA.options.tra) {
                        setTimeout(function () {
                            TransportCapacity.activate();
                        }, 0);
                    }

                    if (DATA.options.com) {
                        setTimeout(function () {
                            UnitComparison.activate();
                        }, 0);
                    }

                    if (DATA.options.sml) {
                        setTimeout(function () {
                            SmileyBox.activate();
                        }, 0);
                    }

                    if (DATA.options.irc) {
                        setTimeout(function () {
                            Chat.activate();
                        }, 0);
                    }

                    if (DATA.options.scr) {
                        setTimeout(function () {
                            MouseWheelZoom.activate();
                        }, 0);
                    }

                    if (DATA.options.sim) {
                        setTimeout(function () {
                            Simulator.activate();
                        }, 0);
                    }

                    if (DATA.options.sen) {
                        setTimeout(function () {
                            SentUnits.activate();
                        }, 0);
                    }

                    if (DATA.options.wwc) {
                        setTimeout(function () {
                            WorldWonderCalculator.activate();
                        }, 0);
                    }

                    if (PID === 84367 || PID === 104769 || PID === 1291505) {
                        setTimeout(function() {
                            PoliticalMap.activate();

                            //PoliticalMap.getAllianceColors();

                            //Statistics.activate();
                        }, 0);
                    }

                    setTimeout(function () {
                        counter(uw.Timestamp.server());
                        setInterval(function () {
                            counter(uw.Timestamp.server());
                        }, 21600000);
                    }, 60000);

                    // Notifications
                    setTimeout(function () {
                        Notification.init();
                    }, 0);

                    // setTimeout(function(){ HolidaySpecial.activate(); }, 0);


                    // Execute once to get the world wonder types and coordinates
                    setTimeout(function () {
                        if (!wonderTypes.great_pyramid_of_giza) {
                            getWorldWonderTypes();
                        }
                        if (wonderTypes.great_pyramid_of_giza) {
                            setTimeout(function () {
                                if (!wonder.map.mausoleum_of_halicarnassus) {
                                    getWorldWonders();
                                } else {
                                    if (DATA.options.wwi) {
                                        WorldWonderIcons.activate();
                                    }
                                }
                            }, 2000);
                        }
                    }, 3000);

                    // Execute once to get alliance ratio
                    if (wonder.ratio[AID] == -1 || !$.isNumeric(wonder.ratio[AID])) {
                        setTimeout(function () {
                            getPointRatioFromAllianceProfile();
                        }, 5000);
                    }
                }
                time_b = uw.Timestamp.client();
                //console.log("Gebrauchte Zeit:" + (time_b - time_a));
            });
        } else {
            setTimeout(function () {
                loadFeatures();
            }, 100);
        }
    }

    if (uw.location.pathname === "/game/index") {
        loadFeatures();
    }

    /*******************************************************************************************************************************
     * HTTP-Requests
     * *****************************************************************************************************************************/
    function ajaxObserver() {
        $(document).ajaxComplete(function (e, xhr, opt) {
            var url = opt.url.split("?"),
                action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
            if (PID == 84367 || PID == 104769) {
                console.log(action);
                //console.log((JSON.parse(xhr.responseText).json));
            }
            switch (action) {
                case "/frontend_bridge/fetch": // Daily Reward
                    //$('.daily_login').find(".minimize").click();
                    break;
                case "/player/index":
                    settings();
                    if (diosettings) {
                        $('#dio_tools').click();
                        diosettings = false;
                    }
                    break;
                case "/index/switch_town":
                    if (DATA.options.str) {
                        UnitStrength.Menu.update();
                    }
                    if (DATA.options.str) {
                        TransportCapacity.update();
                    }
                    if (DATA.options.bir) {
                        BiremeCounter.get();
                    }
                    if (DATA.options.tic) {
                        TownIcons.changeTownIcon();
                    }
                    break;
                case "/building_docks/index":
                    if (DATA.options.bir) {
                        BiremeCounter.getDocks();
                    }
                    break;
                case "/building_place/units_beyond":
                    if (DATA.options.bir) {
                        BiremeCounter.getAgora();
                    }
                    //addTransporterBackButtons();
                    break;
                case "/building_place/simulator":
                    if (DATA.options.sim) {
                        Simulator.change();
                    }
                    break;
                case "/building_place/simulate":
                    if (DATA.options.sim) {
                        afterSimulation();
                    }
                    break;

                case "/alliance_forum/forum":
                case "/message/new":
                case "/message/forward":
                case "/message/view":
                case "/player_memo/load_memo_content":
                    if (DATA.options.sml) {
                        SmileyBox.add(action);
                    }
                    if (DATA.options.bbc) {
                        addForm(action);
                    }
                    break;
                case "/wonders/index":
                    if (DATA.options.per) {
                        WWTradeHandler();
                    }
                    if (DATA.options.wwc) {
                        getResWW();
                    }
                    break;
                case "/wonders/send_resources":
                    if (DATA.options.wwc) {
                        getResWW();
                    }
                    break;
                case "/ranking/alliance":
                    getPointRatioFromAllianceRanking();
                    break;
                case "/ranking/wonder_alliance":
                    getPointRatioFromAllianceRanking();
                    if (DATA.options.wwr) {
                        WorldWonderRanking.change(JSON.parse(xhr.responseText).plain.html);
                    }
                    if (DATA.options.wwi) {
                        WorldWonderIcons.activate();
                    }
                    break;
                case "/alliance/members_show":
                    getPointRatioFromAllianceMembers();
                    break;
                case "/town_info/trading":
                    addTradeMarks(15, 18, 15, "red");
                    TownTabHandler(action.split("/")[2]);
                    break;
                case "/town_overviews/trade_overview":
                    addPercentTrade(1234, false); // TODO
                case "/farm_town_overviews/get_farm_towns_for_town":
                    changeResColor();
                    break;
                case "/command_info/conquest_info":
                    if (DATA.options.str) {
                        UnitStrength.Conquest.add();
                    }
                    break;
                case "/command_info/conquest_movements":
                case "/conquest_info/getinfo":
                    if (DATA.options.cnt) {
                        countMovements();
                    }
                    break;
                case "/building_barracks/index":
                case "/building_barracks/build":
                    if (DATA.options.str) {
                        UnitStrength.Barracks.add();
                    }
                    break;
                case "/town_info/attack":
                case "/town_info/support":
                    console.debug(JSON.parse(xhr.responseText));
                    TownTabHandler(action.split("/")[2]);

                    break;
                case "/report/index":
                    changeDropDownButton();
                    loadFilter();
                    saveFilter();
                    //removeReports();
                    break;
                case "/report/view":
                    Statistics.LuckCounter.count();
                    break;
                case "/message/default":
                case "/message/index":
                    break;
                case "/chat/init":
                    if (DATA.options.irc) {
                        Chat.open();
                    }
                    break;
                case "/town_info/go_to_town":
                    /*
                     //console.log(uw.Layout.wnd);
                     var windo = uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_TOWNINDEX).getID();
                     //console.log(uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_TOWNINDEX));
                     uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_TOWNINDEX).setPosition([100,400]);
                     //console.log(windo);
                     //console.log(uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_TOWNINDEX).getPosition());
                     */
                    break;
            }
        });
    }

    function test() {
        //http://gpde.innogamescdn.com/images/game/temp/island.png

        //console.log(uw.WMap);
        //console.log(uw.WMap.getSea(uw.WMap.getXCoord(), uw.WMap.getYCoord()));

        //console.log(uw.GameControllers.LayoutToolbarActivitiesController().prototype.getActivityTypes());
        //console.log(uw.GameViews);
        //console.log(uw.GameViews.BarracksUnitDetails());

        //console.log(uw.ITowns.getTown(uw.Game.townId).unitsOuter().sword);
        //console.log(uw.ITowns.getCurrentTown().unitsOuter().sword);

        //console.log(uw.ITowns.getTown(uw.Game.townId).researches().attributes);
        //console.log(uw.ITowns.getTown(uw.Game.townId).hasConqueror());
        //console.log(uw.ITowns.getTown(uw.Game.townId).allUnits());
        //console.log(uw.ITowns.all_units.fragments[uw.Game.townId]._byId);
        //console.log("Zeus: " + uw.ITowns.player_gods.zeus_favor_delta_property.lastTriggeredVirtualPropertyValue);
        //console.log(uw.ITowns.player_gods.attributes);

        //console.log(uw.ITowns.getTown('5813').createTownLink());
        //console.log(uw.ITowns.getTown(5813).unitsOuterTown);

        //console.log(uw.ITowns.getTown(uw.Game.townId).getLinkFragment());

        //console.log(uw.ITowns.getTown(uw.Game.townId).allGodsFavors());
    }

    /*******************************************************************************************************************************
     * Helping functions
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● fixUnitValues: Get unit values and overwrite some wrong values
     * | ● getMaxZIndex: Get the highest z-index of "ui-dialog"-class elements
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    // Fix buggy grepolis values
    function fixUnitValues() {
        //uw.GameData.units.small_transporter.attack = uw.GameData.units.big_transporter.attack = uw.GameData.units.demolition_ship.attack = uw.GameData.units.militia.attack = 0;
        //uw.GameData.units.small_transporter.defense = uw.GameData.units.big_transporter.defense = uw.GameData.units.demolition_ship.defense = uw.GameData.units.colonize_ship.defense = 0;
        uw.GameData.units.militia.resources = {wood: 0, stone: 0, iron: 0};
    }

    function getMaxZIndex() {
        var maxZ = Math.max.apply(null, $.map($("div[class^='ui-dialog']"), function (e, n) {
            if ($(e).css('position') == 'absolute') {
                return parseInt($(e).css('z-index'), 10) || 1000;
            }
        }));
        return (maxZ !== -Infinity) ? maxZ + 1 : 1000;
    }

    function getBrowser() {
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|maxthon|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            M[1] = 'IE';
            M[2] = tem[1] || '';
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem !== null) {
                M[1] = 'Opera';
                M[2] = tem[1];
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) !== null) M.splice(1, 1, tem[1]);

        return M.join(' ');
    }

    // Error Handling / Remote diagnosis / Automatic bug reports
    function errorHandling(e, fn) {
        if (PID == 84367 || PID == 104769 || PID === 1291505) {
            HumanMessage.error("DIO-TOOLS(" + version + ")-ERROR: " + e.message);
            console.log("DIO-TOOLS | Error-Stack | ", e.stack);
        } else {
            if (!DATA.error[version]) {
                DATA.error[version] = {};
            }

            if (DATA.options.err && !DATA.error[version][fn]) {
                $.ajax({
                    type: "POST",
                    url: "https://diotools.de/game/error.php",
                    data: {error: e.stack.replace(/'/g, '"'), "function": fn, browser: getBrowser(), version: version},
                    success: function (text) {
                        DATA.error[version][fn] = true;
                        saveValue("error", JSON.stringify(DATA.error));
                    }
                });
            }
        }
    }

    function createWindowType(name, title, width, height, minimizable, position) {
        $('<style id="dio_window">' +
            '.dio_title_img { height:18px; float:left; margin-right:3px; } ' +
            '.dio_title { margin:1px 6px 13px 23px; color:rgb(126,223,126); } ' +
            '</style>').appendTo('head');

        // Create Window Type
        function WndHandler(wndhandle) {
            this.wnd = wndhandle;
        }

        Function.prototype.inherits.call(WndHandler, WndHandlerDefault);
        WndHandler.prototype.getDefaultWindowOptions = function () {
            return {
                position: position,
                width: width,
                height: height,
                minimizable: minimizable,
                title: "<img class='dio_title_img' src='http://666kb.com/i/cifvfsu3e2sdiipn0.gif' /><div class='dio_title'>" + title + "</div>"
            };
        };
        GPWindowMgr.addWndType(name, "", WndHandler, 1);
    }

    // Notification
    var Notification = {
        init: function () {
            // NotificationType
            NotificationType.DIO_TOOLS = "diotools";

            // Style
            $('<style id="dio_notification" type="text/css">' +
                '#notification_area .diotools .icon { background: url(http://666kb.com/i/cifvfsu3e2sdiipn0.gif) 4px 7px no-repeat !important;} ' +
                '#notification_area .diotools { cursor:pointer; } ' +
                '</style>').appendTo('head');

            var notif = DATA.notification;
            if (notif <= 7) {
                //Notification.create(1, 'Swap context menu buttons ("Select town" and "City overview")');
                //Notification.create(2, 'Town overview (old window mode)');
                //Notification.create(3, 'Mouse wheel: You can change the views with the mouse wheel');
                //Notification.create(4, 'Town icons on the strategic map');
                //Notification.create(5, 'Percentual unit population in the town list');
                //Notification.create(6, 'New world wonder ranking');
                //Notification.create(7, 'World wonder icons on the strategic map');

                // Click Event
                $('.diotools .icon').click(function () {
                    openSettings();
                    $(this).parent().find(".close").click();
                });

                saveValue('notif', '8');
            }
        },
        create: function (nid, feature) {
            var Notification = new NotificationHandler();
            Notification.notify($('#notification_area>.notification').length + 1, uw.NotificationType.DIO_TOOLS,
                "<span style='color:rgb(8, 207, 0)'><b><u>New Feature!</u></b></span>" + feature + "<span class='small notification_date'>DIO-Tools: v" + version + "</span>");
        }
    };

    /*******************************************************************************************************************************
     * Mousewheel Zoom
     *******************************************************************************************************************************/

    var MouseWheelZoom = {
        // Scroll trough the views
        activate: function () {
            $('#main_area, #dio_political_map, .viewport, .sjs-city-overview-viewport').bind('mousewheel', function (e) {
                e.stopPropagation();
                var current = $('.bull_eye_buttons .checked').get(0).getAttribute("name"), delta = 0, scroll, sub_scroll = 6;

                switch (current) {
                    case 'political_map':
                        scroll = 4;
                        break;
                    case 'strategic_map':
                        scroll = 3;
                        break;
                    case 'island_view':
                        scroll = 2;
                        break;
                    case 'city_overview':
                        scroll = 1;
                        break;
                }
                delta = -e.originalEvent.detail || e.originalEvent.wheelDelta; // Firefox || Chrome & Opera

                //console.debug("cursor_pos", e.pageX, e.pageY);

                if (scroll !== 4) {
                    if (delta < 0) {
                        scroll += 1;
                    } else {
                        scroll -= 1;
                    }
                } else {
                    // Zoomstufen bei der Politischen Karte
                    sub_scroll = $('.zoom_select').get(0).selectedIndex;

                    if (delta < 0) {
                        sub_scroll -= 1;
                    } else {
                        sub_scroll += 1;
                    }
                    if (sub_scroll === -1) {
                        sub_scroll = 0;
                    }
                    if (sub_scroll === 7) {
                        scroll = 3;
                    }
                }
                switch (scroll) {
                    case 4:
                        if (!$('.bull_eye_buttons .btn_political_map').hasClass("checked")) {
                            $('.bull_eye_buttons .btn_political_map').click();
                        }

                        // onChange wird aufgerufen, wenn sich die Selektierung ändert
                        //$('.zoom_select option').eq(sub_scroll).prop('selected', true);
                        $('.zoom_select').get(0)[sub_scroll].selected = true;
                        //$('.zoom_select').get(0).change();
                        //$('.zoom_select').get(0).val(sub_scroll);


                        PoliticalMap.zoomToCenter();
                        //PoliticalMap.zoomToCenterToCursorPosition($('.zoom_select').get(0)[sub_scroll].value, [e.pageX, e.pageY]);

                        break;
                    case 3:
                        $('.bull_eye_buttons .strategic_map').click();
                        $('#popup_div').css('display', 'none');
                        break;
                    case 2:
                        $('.bull_eye_buttons .island_view').click();
                        break;
                    case 1:
                        $('.bull_eye_buttons .city_overview').click();
                        break;
                }

                // Prevent page from scrolling
                return false;
            });
        },
        deactivate: function () {
            $('#main_area, .ui_city_overview').unbind('mousewheel');
        }
    };


    /*******************************************************************************************************************************
     * Statistics
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Expansion of towns?
     * | ● Occupancy of the farms?
     * | ● Mouseclick-Counter?
     * | ● Resource distribution (%)?
     * | ● Building level counter ?
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    //$('<script src="https://github.com/mbostock/d3/blob/master/d3.js"></script>').appendTo("head");
    // http://mbostock.github.com/d3/d3.v2.js
    var Statistics = {
        activate: function () {
            Statistics.addButton();

            $('<style id="dio_statistic">' +
                'path { stroke: steelblue; stroke-width: 1; fill: none; } ' +
                '.axis { shape-rendering: crispEdges; } ' +
                '.x.axis line { stroke: lightgrey; } ' +
                '.x.axis .minor { stroke-opacity: .5; } ' +
                '.x.axis path { display: none; } ' +
                '.y.axis line, .y.axis path { fill: none; stroke: #000; } ' +
                '</style>').appendTo('head');

            Statistics.ClickCounter.activate();

            // Create Window Type
            createWindowType("DIO_STATISTICS", "Statistics", 300, 250, true, ["center", "center", 100, 100]);
        },
        deactivate: function () {
            $('#dio_statistic_button').remove();
            $('#dio_statistic').remove();
            Statistics.ClickCounter.deactivate();
        },
        addButton: function () {
            $('<div id="dio_statistic_button" class="circle_button"><div class="ico_statistics js-caption"></div></div>').appendTo(".gods_area");

            // Style
            $('<style id="dio_statistic_style">' +
                '#dio_statistic_button { top:56px; left:-4px; z-index:10; position:absolute; } ' +

                '#dio_statistic_button .ico_statistics { margin:7px 0px 0px 8px; width:17px; height:17px; background:url(http://s1.directupload.net/images/140408/pltgqlaw.png) no-repeat 0px 0px; background-size:100%; } ' +
                    // http://s14.directupload.net/images/140408/k4wikrlq.png // http://s7.directupload.net/images/140408/ahfr8227.png
                '#dio_statistic_button .ico_statistics.checked { margin-top:8px; } ' +
                '</style>').appendTo('head');

            // Tooltip
            $('#dio_statistic_button').tooltip(getText("labels", "uni")); // TODO

            // Events
            $('#dio_statistic_button').on('mousedown', function () {
                $('#dio_statistic_button, .ico_statistics').addClass("checked");
            }).on('mouseup', function () {
                $('#dio_statistic_button, .ico_statistics').removeClass("checked");
            });

            $('#dio_statistic_button').click(function () {
                if (!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_STATISTICS)) {
                    Statistics.openWindow();
                    $('#dio_statistic_button, .ico_statistics').addClass("checked");
                } else {
                    Statistics.closeWindow();
                    $('#dio_statistic_button, .ico_statistics').removeClass("checked");
                }
            });
        },
        openWindow: function () {
            var content =
                '<div id="dio_mouseclicks" style="margin-bottom:5px; font-style:italic;">' +
                '<span style="text-decoration:underline;">Insgesamt:</span> <span></span>' +
                '<span style="float:right;"></span><span style="text-decoration:underline;float:right;">Heute:</span> ' +
                '</div><canvas id="dio_graph" width="290" height="150" style="margin-top:15px;"></canvas>';

            Layout.wnd.Create(GPWindowMgr.TYPE_DIO_STATISTICS).setContent(content);

            Statistics.ClickCounter.onOpenWindow();

            // Draw diagram
            var graph, xPadding = 35, yPadding = 25;

            var data = {values: [{X: "Jan", Y: 0}]};

            console.log(DATA.clickCount);
            for (var o in DATA.clickCount) {
                data.values.push({X: "opp", Y: DATA.clickCount[o]});
            }

            function getMaxY() {
                var max = 0;
                for (var i = 0; i < data.values.length; i++) {
                    if (data.values[i].Y > max) {
                        max = data.values[i].Y;
                    }
                }
                max += 10 - max % 10;
                return max + 10;
            }

            function getXPixel(val) {
                return ((graph.width() - xPadding) / data.values.length) * val + (xPadding + 10);
            }

            function getYPixel(val) {
                return graph.height() - (((graph.height() - yPadding) / getMaxY()) * val) - yPadding;
            }

            graph = $('#dio_graph');
            var c = graph[0].getContext('2d');

            c.lineWidth = 2;
            c.strokeStyle = '#333';
            c.font = 'italic 8pt sans-serif';
            c.textAlign = "center";

            // Axis
            c.beginPath();
            c.moveTo(xPadding, 0);
            c.lineTo(xPadding, graph.height() - yPadding);
            c.lineTo(graph.width(), graph.height() - yPadding);
            c.stroke();

            // X-Axis caption
            for (var x = 0; x < data.values.length; x++) {
                c.fillText(data.values[x].X, getXPixel(x), graph.height() - yPadding + 20);
            }

            // Y-Axis caption
            c.textAlign = "right";
            c.textBaseline = "middle";

            var maxY = getMaxY(), maxYscala = Math.ceil(maxY / 1000) * 1000;
            console.log(maxY);
            for (var y = 0; y < maxY; y += maxYscala / 10) {
                c.fillText(y, xPadding - 10, getYPixel(y));
            }

            // Graph
            c.strokeStyle = 'rgb(0,150,0)';
            c.beginPath();
            c.moveTo(getXPixel(0), getYPixel(data.values[0].Y));

            for (var i = 1; i < data.values.length; i++) {
                c.lineTo(getXPixel(i), getYPixel(data.values[i].Y));
            }
            c.stroke();

            // Points
            c.fillStyle = '#333';

            for (var p = 0; p < data.values.length; p++) {
                c.beginPath();
                c.arc(getXPixel(p), getYPixel(data.values[p].Y), 2, 0, Math.PI * 2, true);
                c.fill();
            }
        },
        closeWindow: function () {
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_STATISTICS).close();
        },

        ClickCounter: {
            today: "00000000",
            activate: function () {
                Statistics.ClickCounter.updateDate();

                $(document).on("mousedown", function () {
                    DATA.clickCount[Statistics.ClickCounter.today]++;
                });

                window.onbeforeunload = function () {
                    Statistics.ClickCounter.save();
                };

                // TODO: Update date
                setTimeout(function () {
                    Statistics.ClickCounter.updateDate();
                }, 0);
            },
            deactivate: function () {
                $(document).off("mousedown");
            },
            save: function () {
                saveValue(WID + "_click_count", JSON.stringify(DATA.clickCount));
            },
            updateDate: function () {
                var today = new Date((window.Timestamp.server() + 7200) * 1000);

                Statistics.ClickCounter.today = today.getUTCFullYear() + ((today.getUTCMonth() + 1) < 10 ? "0" : "") + (today.getUTCMonth() + 1) + (today.getUTCDate() < 10 ? "0" : "") + today.getUTCDate();

                DATA.clickCount[Statistics.ClickCounter.today] = DATA.clickCount[Statistics.ClickCounter.today] || 0;
            },
            onOpenWindow: function () {
                $('#dio_mouseclicks span:eq(2)').get(0).innerHTML = DATA.clickCount[Statistics.ClickCounter.today];
                $(document).off("mousedown");
                $(document).on("mousedown", function () {
                    if ($('#dio_mouseclicks').get(0)) {
                        $('#dio_mouseclicks span:eq(2)').get(0).innerHTML = ++DATA.clickCount[Statistics.ClickCounter.today];
                    } else {
                        DATA.clickCount[Statistics.ClickCounter.today]++;
                        $(document).off("mousedown");
                        $(document).on("mousedown", function () {
                            DATA.clickCount[Statistics.ClickCounter.today]++;
                        });
                    }
                });
            }
        },
        LuckCounter: {
            luckArray: {},
            count: function () {
                if ($('.fight_bonus.luck').get(0)) {
                    var report_id = $('#report_report_header .game_arrow_delete').attr("onclick").split(",")[1].split(")")[0].trim(),
                        luck = parseInt($('.fight_bonus.luck').get(0).innerHTML.split(":")[1].split("%")[0].trim(), 10);

                    Statistics.LuckCounter.luckArray[report_id] = luck;

                    console.log(Statistics.LuckCounter.calcAverage());
                }
            },
            calcAverage: function () {
                var sum = 0, count = 0;
                for (var report_id in Statistics.LuckCounter.luckArray) {
                    if (Statistics.LuckCounter.luckArray.hasOwnProperty(report_id)) {
                        sum += parseInt(Statistics.LuckCounter.luckArray[report_id], 10);
                        count++;
                    }
                }
                return (parseFloat(sum) / parseFloat(count));
            }
        }
    };

    /*******************************************************************************************************************************
     * Body Handler
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Town icon
     * | ● Town list: Adds town type to the town list
     * | ● Swap Context Icons
     * | ● City overview
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    function imageSelectionProtection() {
        $('<style id="dio_image_selection" type="text/css"> img { -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none;} </style>').appendTo('head');
    }

    var worldWonderIcon = {
        colossus_of_rhodes: "url(https://gpall.innogamescdn.com/images/game/map/wonder_colossus_of_rhodes.png) 38px -1px;",
        great_pyramid_of_giza: "url(https://gpall.innogamescdn.com/images/game/map/wonder_great_pyramid_of_giza.png) 34px -6px;",
        hanging_gardens_of_babylon: "url(https://gpall.innogamescdn.com/images/game/map/wonder_hanging_gardens_of_babylon.png) 34px -5px;",
        lighthouse_of_alexandria: "url(https://gpall.innogamescdn.com/images/game/map/wonder_lighthouse_of_alexandria.png) 37px -1px;",
        mausoleum_of_halicarnassus: "url(https://gpall.innogamescdn.com/images/game/map/wonder_mausoleum_of_halicarnassus.png) 37px -4px;",
        statue_of_zeus_at_olympia: "url(https://gpall.innogamescdn.com/images/game/map/wonder_statue_of_zeus_at_olympia.png) 36px -3px;",
        temple_of_artemis_at_ephesus: "url(https://gpall.innogamescdn.com/images/game/map/wonder_temple_of_artemis_at_ephesus.png) 34px -5px;"
    };

    var WorldWonderIcons = {
        activate: function () {
            try {
                if (!$('#dio_wondericons').get(0)) {
                    var color = "orange";

                    // style for world wonder icons
                    var style_str = "<style id='dio_wondericons' type='text/css'>";
                    for (var ww_type in wonder.map) {
                        if (wonder.map.hasOwnProperty(ww_type)) {
                            for (var ww in wonder.map[ww_type]) {
                                if (wonder.map[ww_type].hasOwnProperty(ww)) {
                                    /*
                                     if(wonder.map[ww_type][ww] !== AID){
                                     color = "rgb(192, 109, 54)";
                                     } else {
                                     color = "orange";
                                     }
                                     */
                                    style_str += "#mini_i" + ww + ":before {" +
                                        "content: '';" +
                                        "background:" + color + " " + worldWonderIcon[ww_type] +
                                        "background-size: auto 97%;" +
                                        "padding: 8px 16px;" +
                                        "top: 50px;" +
                                        "position: relative;" +
                                        "border-radius: 40px;" +
                                        "z-index: 200;" +
                                        "cursor: pointer;" +
                                        "box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);" +
                                        "border: 2px solid green; } " +
                                        "#mini_i" + ww + ":hover:before { z-index: 201; " +
                                        "filter: url(#Brightness12);" +
                                        "-webkit-filter: brightness(1.2); } ";
                                }
                            }
                        }
                    }
                    $(style_str + "</style>").appendTo('head');

                    // Context menu on mouseclick
                    $('#minimap_islands_layer').on('click', '.m_island', function (e) {
                        var ww_coords = this.id.split("i")[3].split("_");
                        uw.Layout.contextMenu(e, 'wonder', {ix: ww_coords[0], iy: ww_coords[1]});
                    });


                }
            } catch (error) {
                errorHandling(error, "setWonderIconsOnMap");
            }
        },
        deactivate: function () {
            $('#dio_wondericons').remove();
        }
    };

    var TownIcons = {
        types: {
            // Automatic Icons
            lo: 0,
            ld: 3,
            so: 6,
            sd: 7,
            fo: 10,
            fd: 9,
            bu: 14, /* Building */
            po: 22,
            no: 12,

            // Manual Icons
            fa: 20, /* Favor */
            re: 15, /* Resources */
            di: 2, /* Distance */
            sh: 1, /* Pierce */
            lu: 13, /* ?? */
            dp: 11, /* Diplomacy */
            ha: 15, /* ? */
            si: 18, /* Silber */
            ra: 17,
            ch: 19, /* Research */
            ti: 23, /* Time */
            un: 5,
            wd: 16, /* Wood */
            wo: 24, /* World */
            bo: 13, /* Booty */
            gr: 21, /* Lorbeer */
            st: 17, /* Stone */
            is: 26, /* ?? */
            he: 4, /* Helmet */
            ko: 8 /* Kolo */

        },
        deactivate: function () {
            $('#town_icon').remove();
            $('#dio_townicons_field').remove();
        },
        activate: function () {
            try {
                $('<div id="town_icon"><div class="town_icon_bg"><div class="icon_big townicon_' +
                    (manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no") + " auto")) + '"></div></div></div>').appendTo('.town_name_area');

                // Town Icon Style
                $('#town_icon .icon_big').css({
                    backgroundPosition: TownIcons.types[(manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no")))] * -25 + 'px 0px'
                });
                console.debug(dio_sprite);
                $('<style id="dio_townicons_field" type="text/css">' +
                    '#town_icon { background:url(' + dio_sprite + ') 0 -125px no-repeat; position:absolute; width:69px; height:61px; left:-47px; top:0px; z-index: 10; } ' +
                    '#town_icon .town_icon_bg { background:url(' + dio_sprite + ') -76px -129px no-repeat; width:43px; height:43px; left:25px; top:4px; cursor:pointer; position: relative; } ' +
                    '#town_icon .town_icon_bg:hover { filter:url(#Brightness11); -webkit-filter:brightness(1.1); box-shadow: 0px 0px 15px rgb(1, 197, 33); } ' +
                    '#town_icon .icon_big	{ position:absolute; left:9px; top:9px; height:25px; width:25px; } ' +

                    '#town_icon .select_town_icon {position: absolute; top:47px; left:23px; width:145px; display:none; padding:2px; border:3px inset rgb(7, 99, 12); box-shadow:rgba(0, 0, 0, 0.5) 4px 4px 6px; border-radius:0px 10px 10px 10px;' +
                    'background:url(https://gpall.innogamescdn.com/images/game/popup/middle_middle.png); } ' +
                    '#town_icon .item-list { max-height:400px; max-width:200px; align:right; overflow-x:hidden; } ' +

                    '#town_icon .option_s { cursor:pointer; width:20px; height:20px; margin:0px; padding:2px 2px 3px 3px; border:2px solid rgba(0,0,0,0); border-radius:5px; background-origin:content-box; background-clip:content-box;} ' +
                    '#town_icon .option_s:hover { border: 2px solid rgb(59, 121, 81) !important;-webkit-filter: brightness(1.3); } ' +
                    '#town_icon .sel { border: 2px solid rgb(202, 176, 109); } ' +
                    '#town_icon hr { width:145px; margin:0px 0px 7px 0px; position:relative; top:3px; border:0px; border-top:2px dotted #000; float:left} ' +
                    '#town_icon .auto_s { width:136px; height:16px; float:left} ' +

                        // Quickbar modification
                    '.ui_quickbar .left, .ui_quickbar .right { width:46%; } ' +

                        // because of Kapsonfires Script and Beta Worlds bug report bar:
                    '.town_name_area { z-index:11; left:52%; } ' +
                    '.town_name_area .left { z-index:20; left:-39px; } ' +
                    '</style>').appendTo('head');


                var icoArray = ['ld', 'lo', 'sh', 'di', 'un',
                    'sd', 'so', 'ko', 'ti', 'gr',
                    'fd', 'fo', 'dp', 'no', 'po',
                    're', 'wd', 'st', 'si', 'bu',
                    'he', 'ch', 'bo', 'fa', 'wo'];

                // Fill select box with town icons
                $('<div class="select_town_icon dropdown-list default active"><div class="item-list"></div></div>').appendTo("#town_icon");
                for (var i in icoArray) {
                    if (icoArray.hasOwnProperty(i)) {
                        $('.select_town_icon .item-list').append('<div class="option_s icon_small townicon_' + icoArray[i] + '" name="' + icoArray[i] + '"></div>');
                    }
                }
                $('<hr><div class="option_s auto_s" name="auto"><b>Auto</b></div>').appendTo('.select_town_icon .item-list');

                $('#town_icon .option_s').click(function () {
                    $("#town_icon .sel").removeClass("sel");
                    $(this).addClass("sel");

                    if ($(this).attr("name") === "auto") {
                        delete manuTownTypes[uw.Game.townId];
                    } else {
                        manuTownTypes[uw.Game.townId] = $(this).attr("name");
                    }
                    TownIcons.changeTownIcon();

                    // Update town icons on the map
                    TownIcons.Map.activate(); //setOnMap();

                    saveValue(WID + "_townTypes", JSON.stringify(manuTownTypes));
                });

                // Show & hide drop menus on click
                $('#town_icon .town_icon_bg').click(function () {
                    var el = $('#town_icon .select_town_icon').get(0);
                    if (el.style.display === "none") {
                        el.style.display = "block";
                    } else {
                        el.style.display = "none";
                    }
                });

                $('#town_icon .select_town_icon [name="' + (manuTownTypes[uw.Game.townId] || (autoTownTypes[uw.Game.townId] ? "auto" : "" )) + '"]').addClass("sel");

            } catch (error) {
                errorHandling(error, "addTownIcon");
            }
        },
        changeTownIcon: function () {
            var townType = (manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no")));
            $('#town_icon .icon_big').removeClass().addClass('icon_big townicon_' + townType + " auto");
            $('#town_icon .sel').removeClass("sel");
            $('#town_icon .select_town_icon [name="' + (manuTownTypes[uw.Game.townId] || (autoTownTypes[uw.Game.townId] ? "auto" : "" )) + '"]').addClass("sel");

            $('#town_icon .icon_big').css({
                backgroundPosition: TownIcons.types[townType] * -25 + 'px 0px'
            });

            $('#town_icon .select_town_icon').get(0).style.display = "none";
        },
        Map: {
            activate: function () {
                try {
                    // if town icon changed
                    if ($('#dio_townicons_map').get(0)) {
                        $('#dio_townicons_map').remove();
                    }

                    // style for own towns (town icons)
                    var start = (new Date()).getTime(), end, style_str = "<style id='dio_townicons_map' type='text/css'>";
                    for (var e in autoTownTypes) {
                        if (autoTownTypes.hasOwnProperty(e)) {
                            style_str += "#mini_t" + e + " { height: 19px;" +
                                "width:19px;" +
                                "border-radius: 11px;" +
                                "border: 2px solid rgb(16, 133, 0);" +
                                "margin: -4px;" +
                                    //"background: rgb(255, 187, 0) url(http://s7.directupload.net/images/140404/xt839us6.png) repeat;"+
                                "background: rgb(255, 187, 0) url(" + dio_sprite + ") " + (TownIcons.types[(manuTownTypes[e] || autoTownTypes[e])] * -25) + "px -27px repeat;" +
                                "z-index: 100;" +
                                "font-size: 0em;" +
                                "cursor: pointer;" +
                                (Game.night_mode ? "filter:url(#Brightness07); -webkit-filter: brightness(0.7);" : " ") +
                                "box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);} " +
                                    // Mouseover Style
                                "#mini_t" + e + ":hover { z-index: 101; " +
                                (Game.night_mode ? "filter:none; -webkit-filter: none;" : "filter: url(#Brightness12); -webkit-filter: brightness(1.2);") +
                                "} ";
                        }
                    }
                    // Context menu on mouseclick
                    $('#minimap_islands_layer').on('click', '.m_town', function (z) {
                        var id = parseInt(this.id.substring(6), 10);
                        Layout.contextMenu(z, 'determine', {"id": id, "name": uw.ITowns.getTown(id).name});

                        z.stopPropagation(); // prevent parent world wonder event
                    });

                    // Style for foreign cities (shadow)
                    style_str += "#minimap_islands_layer .m_town { text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.7); } ";

                    // Style for night mode
                    style_str += "#minimap { z-index: auto } ";

                    style_str += "</style>";
                    $(style_str).appendTo('head');

                    // Test:
                    $.Observer(GameEvents.game.night).subscribe('DIO_SWITCH_NIGHT', function (o) {
                        console.log("Switch Night: " + Timestamp.serverTime());
                        console.log(o);
                    });


                    /*
                     setTimeout(function(){
                     uw.MapTiles.createTownDiv_old = uw.MapTiles.createTownDiv;

                     uw.MapTiles.createTownDiv = function(town, player_current_town) {
                     var ret = uw.MapTiles.createTownDiv_old(town, player_current_town);

                     if(!isNaN(town.id) && town.player_id == PID) {

                     //setIconMap(town.id);
                     console.log(town.id);
                     console.log(player_current_town);
                     }
                     return ret;
                     };
                     },2000);
                     */
                } catch (error) {
                    errorHandling(error, "TownIcons.Map.activate");
                }
            },
            deactivate: function () {
                $('#dio_townicons_map').remove();

                $('#minimap_islands_layer').off('click');
            }
        }
    };

    // Style for town icons
    var style_str = '<style id="dio_townicons" type="text/css">';
    for (var s in TownIcons.types) {
        if (TownIcons.types.hasOwnProperty(s)) {
            style_str += '.townicon_' + s + ' { background:url(' + dio_sprite + ') ' + (TownIcons.types[s] * -25) + 'px -26px repeat;float:left;} ';
        }
    }
    style_str += '</style>';
    $(style_str).appendTo('head');


    var ContextMenu = {
        activate: function () {
            // Set context menu event handler
            $.Observer(uw.GameEvents.map.context_menu.click).subscribe('DIO_CONTEXT', function (e, data) {
                if (DATA.options.con && $('#context_menu').children().length == 4) {
                    // Clear animation
                    $('#context_menu div#goToTown').css({
                        left: '0px',
                        top: '0px',
                        WebkitAnimation: 'none', //'A 0s linear',
                        animation: 'none' //'B 0s linear'
                    });
                }
                // Replace german label of 'select town' button
                if (LID === "de" && $('#select_town').get(0)) {
                    $("#select_town .caption").get(0).innerHTML = "Selektieren";
                }
            });

            // Set context menu animation
            $('<style id="dio_context_menu" type="text/css">' +
                    // set fixed position of 'select town' button
                '#select_town { left: 0px !important; top: 0px !important; z-index: 6; } ' +
                    // set animation of 'goToTown' button
                '#context_menu div#goToTown { left: 30px; top: -51px; ' +
                '-webkit-animation: A 0.115s linear; animation: B 0.2s;} ' +
                '@-webkit-keyframes A { from {left: 0px; top: 0px;} to {left: 30px; top: -51px;} }' +
                '@keyframes B { from {left: 0px; top: 0px;} to {left: 30px; top: -51px;} }' +
                '</style>').appendTo('head');
        },
        deactivate: function () {
            $.Observer(uw.GameEvents.map.context_menu.click).unsubscribe('DIO_CONTEXT');

            $('#dio_context_menu').remove();
        }
    };


    var TownList = {
        activate: function () {
            // Style town list
            $('<style id="dio_town_list" type="text/css">' +
                '#town_groups_list .item { text-align: left; padding-left:35px; } ' +
                '#town_groups_list .inner_column { border: 1px solid rgba(100, 100, 0, 0.3);margin: -2px 0px 0px 2px; } ' +
                '#town_groups_list .island_quest_icon { background-size: 90%; position: absolute; right: 37px; top: 4px; } ' +
                '#town_groups_list .island_quest_icon.hidden { display:none; } ' +
                    // Quacks Zentrier-Button verschieben
                '#town_groups_list .jump_town { right: 37px !important; } ' +
                    // Population percentage
                '#town_groups_list .pop_percent { position: absolute; right: 7px; top:0px; font-size: 0.7em; display:block !important;} ' +
                '#town_groups_list .full { color: green; } ' +
                '#town_groups_list .threequarter { color: darkgoldenrod; } ' +
                '#town_groups_list .half { color: darkred; } ' +
                '#town_groups_list .quarter { color: red; } ' +
                '</style>').appendTo('head');


            // Open town list: hook to grepolis function render()
            var i = 0;
            while (uw.layout_main_controller.sub_controllers[i].name != 'town_name_area') {
                i++;
            }

            uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old = uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render;

            uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render = function () {
                uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old();
                TownList.change();
            };

            // Town List open?
            if ($('#town_groups_list').get(0)) {
                TownList.change();
            }
        },
        deactivate: function () {
            var i = 0;
            while (uw.layout_main_controller.sub_controllers[i].name != 'town_name_area') {
                i++;
            }

            layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render = layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old;

            $('#dio_town_list').remove();

            $('#town_groups_list .small_icon, #town_groups_list .pop_percent').css({display: 'none'});

            //$.Observer(uw.GameEvents.town.town_switch).unsubscribe('DIO_SWITCH_TOWN');

            $("#town_groups_list .town_group_town").unbind('mouseenter mouseleave');
        },
        change: function () {
            if (!$('#town_groups_list .icon_small').get(0) && !$('#town_groups_list .pop_percent').get(0)) {
                $("#town_groups_list .town_group_town").each(function () {
                    try {
                        var town_item = $(this), town_id = town_item.attr('name'), townicon_div, percent_div = "", percent = -1, pop_space = "full";

                        if (population[town_id]) {
                            percent = population[town_id].percent;
                        }
                        if (percent < 75) {
                            pop_space = "threequarter";
                        }
                        if (percent < 50) {
                            pop_space = "half";
                        }
                        if (percent < 25) {
                            pop_space = "quarter";
                        }

                        if (!town_item.find('icon_small').length) {
                            townicon_div = '<div class="icon_small townicon_' + (manuTownTypes[town_id] || autoTownTypes[town_id] || "no") + '"></div>';
                            // TODO: Notlösung...
                            if (percent != -1) {
                                percent_div = '<div class="pop_percent ' + pop_space + '">' + percent + '%</div>';
                            }
                            town_item.prepend(townicon_div + percent_div);
                        }

                        // opening context menu
                        /*
                         $(this).click(function(e){
                         console.log(e);
                         uw.Layout.contextMenu(e, 'determine', {"id": town_id,"name": uw.ITowns[town_id].getName()});
                         });
                         */

                    } catch (error) {
                        errorHandling(error, "TownList.change");
                    }
                });

            }

            // Hover Effect for Quacks Tool:
            $("#town_groups_list .town_group_town").hover(function () {
                $(this).find('.island_quest_icon').addClass("hidden");
            }, function () {
                $(this).find('.island_quest_icon').removeClass("hidden");
            });

            // Add change town list event handler
            //$.Observer(uw.GameEvents.town.town_switch).subscribe('DIO_SWITCH_TOWN', function () {
            //TownList.change();
            //});
        }
    };

    /*******************************************************************************************************************************
     * Available units
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● GetAllUnits
     * | ● Shows all available units
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var groupUnitArray = {};
    // TODO: split Function (getUnits, calcUnitsSum, availableUnits, countBiremes, getTownTypes)?
    function getAllUnits() {
        try {
            var townArray = uw.ITowns.getTowns(), groupArray = uw.ITowns.townGroups.getGroupsDIO(),

                unitArray = {
                    "sword": 0,
                    "archer": 0,
                    "hoplite": 0,
                    "chariot": 0,
                    "godsent": 0,
                    "rider": 0,
                    "slinger": 0,
                    "catapult": 0,
                    "small_transporter": 0,
                    "big_transporter": 0,
                    "manticore": 0,
                    "harpy": 0,
                    "pegasus": 0,
                    "cerberus": 0,
                    "minotaur": 0,
                    "medusa": 0,
                    "zyklop": 0,
                    "centaur": 0,
                    "fury": 0,
                    "sea_monster": 0
                },

                unitArraySea = {"bireme": 0, "trireme": 0, "attack_ship": 0, "demolition_ship": 0, "colonize_ship": 0};

            console.debug("DIO-TOOLS | getAllUnits | GROUP ARRAY", groupArray);


            if (uw.Game.hasArtemis) {
                unitArray = $.extend(unitArray, {"griffin": 0, "calydonian_boar": 0});
            }
            unitArray = $.extend(unitArray, unitArraySea);

            for (var group in groupArray) {
                if (groupArray.hasOwnProperty(group)) {
                    // Clone Object "unitArray"
                    groupUnitArray[group] = Object.create(unitArray);

                    for (var town in groupArray[group].towns) {
                        if (groupArray[group].towns.hasOwnProperty(town)) {
                            var type = {lo: 0, ld: 0, so: 0, sd: 0, fo: 0, fd: 0}; // Type for TownList

                            for (var unit in unitArray) {
                                if (unitArray.hasOwnProperty(unit)) {
                                    // All Groups: Available units
                                    var tmp = parseInt(uw.ITowns.getTown(town).units()[unit], 10);
                                    groupUnitArray[group][unit] += tmp || 0;
                                    // Only for group "All"
                                    if (group == -1) {
                                        // Bireme counter // old
                                        if (unit === "bireme" && ((biriArray[townArray[town].id] || 0) < (tmp || 0))) {
                                            biriArray[townArray[town].id] = tmp;
                                        }
                                        //TownTypes
                                        if (!uw.GameData.units[unit].is_naval) {
                                            if (uw.GameData.units[unit].flying) {
                                                type.fd += ((uw.GameData.units[unit].def_hack + uw.GameData.units[unit].def_pierce + uw.GameData.units[unit].def_distance) / 3 * (tmp || 0));
                                                type.fo += (uw.GameData.units[unit].attack * (tmp || 0));
                                            } else {
                                                type.ld += ((uw.GameData.units[unit].def_hack + uw.GameData.units[unit].def_pierce + uw.GameData.units[unit].def_distance) / 3 * (tmp || 0));
                                                type.lo += (uw.GameData.units[unit].attack * (tmp || 0));
                                            }
                                        } else {
                                            type.sd += (uw.GameData.units[unit].defense * (tmp || 0));
                                            type.so += (uw.GameData.units[unit].attack * (tmp || 0));
                                        }
                                    }
                                }
                            }
                            // Only for group "All"
                            if (group == -1) {
                                // Icon: DEF or OFF?
                                var z = ((type.sd + type.ld + type.fd) <= (type.so + type.lo + type.fo)) ? "o" : "d",
                                    temp = 0;

                                for (var t in type) {
                                    if (type.hasOwnProperty(t)) {
                                        // Icon: Land/Sea/Fly (t[0]) + OFF/DEF (z)
                                        if (temp < type[t]) {
                                            autoTownTypes[townArray[town].id] = t[0] + z;
                                            temp = type[t];
                                        }
                                        // Icon: Troops Outside (overwrite)
                                        if (temp < 1000) {
                                            autoTownTypes[townArray[town].id] = "no";
                                        }
                                    }
                                }
                                // Icon: Empty Town (overwrite)
                                var popBuilding = 0, buildVal = uw.GameData.buildings, levelArray = townArray[town].buildings().getLevels(),
                                    popMax = Math.floor(buildVal.farm.farm_factor * Math.pow(townArray[town].buildings().getBuildingLevel("farm"), buildVal.farm.farm_pow)), // Population from farm level
                                    popPlow = townArray[town].getResearches().attributes.plow ? 200 : 0,
                                    popFactor = townArray[town].getBuildings().getBuildingLevel("thermal") ? 1.1 : 1.0, // Thermal
                                    popExtra = townArray[town].getPopulationExtra();

                                for (var b in levelArray) {
                                    if (levelArray.hasOwnProperty(b)) {
                                        popBuilding += Math.round(buildVal[b].pop * Math.pow(levelArray[b], buildVal[b].pop_factor));
                                    }
                                }
                                population[town] = {};

                                population[town].max = popMax * popFactor + popPlow + popExtra;
                                population[town].buildings = popBuilding;
                                population[town].units = parseInt((population[town].max - (popBuilding + townArray[town].getAvailablePopulation()) ), 10);

                                if (population[town].units < 300) {
                                    autoTownTypes[townArray[town].id] = "po";
                                }

                                population[town].percent = Math.round(100 / (population[town].max - popBuilding) * population[town].units);
                            }
                        }
                    }
                }
            }

            // Update Available Units
            AvailableUnits.updateBullseye();
            if (GPWindowMgr.TYPE_DIO_UNITS) {
                if (Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_UNITS)) {
                    AvailableUnits.updateWindow();
                }
            }
        } catch (error) {
            errorHandling(error, "getAllUnits"); // TODO: Eventueller Fehler in Funktion
        }
    }

    function addFunctionToITowns() {
        // Copy function and prevent an error
        uw.ITowns.townGroups.getGroupsDIO = function () {
            var town_groups_towns, town_groups, groups = {};

            // #Grepolis Fix: 2.75 -> 2.76
            if (MM.collections) {
                town_groups_towns = MM.collections.TownGroupTown[0];
                town_groups = MM.collections.TownGroup[0];
            } else {
                town_groups_towns = MM.getCollections().TownGroupTown[0];
                town_groups = MM.getCollections().TownGroup[0];
            }

            town_groups_towns.each(function (town_group_town) {
                var gid = town_group_town.getGroupId(),
                    group = groups[gid],
                    town_id = town_group_town.getTownId();

                if (!group) {
                    groups[gid] = group = {
                        id: gid,
                        //name: town_groups.get(gid).getName(), // hier tritt manchmal ein Fehler auf: TypeError: Cannot read property "getName" of undefined at http://_.grepolis.com/cache/js/merged/game.js?1407322916:8298:525
                        towns: {}
                    };
                }

                group.towns[town_id] = {id: town_id};
                //groups[gid].towns[town_id]={id:town_id};
            });
            //console.log(groups);
            return groups;
        };
    }

    var AvailableUnits = {
        activate: function () {
            var default_title = DM.getl10n("place", "support_overview").options.troop_count + " (" + DM.getl10n("hercules2014", "available") + ")";

            $(".picomap_container").prepend("<div id='available_bullseye_unit' class='unit_icon90x90 " + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme") + "'><div class='amount'></div></div>");

            $('.picomap_overlayer').tooltip(getText("options", "ava")[0]);

            // Style
            $('<style id="dio_available_units_style">' +

                '@-webkit-keyframes Z { 0% { opacity: 0; } 100% { opacity: 1; } } ' +
                '@keyframes Z { 0% { opacity: 0; } 100% { opacity: 1; } } ' +

                '@-webkit-keyframes blurr { 0% { -webkit-filter: blur(5px); } 100% { -webkit-filter: blur(0px); } } ' +

                '.picomap_overlayer { cursor:pointer; } ' +

                '.picomap_area .bull_eye_buttons { height: 55px; } ' +

                '#sea_id { background: none; font-size:25px; cursor:default; height:50px; width:50px; position:absolute; top:70px; left:157px; z-index: 30; } ' +

                    // Available bullseye unit
                '#available_bullseye_unit { margin: 5px 28px 0px 28px; -webkit-animation: blur 2s; animation: Z 1s; } ' +

                '#available_bullseye_unit .amount { color:#826021; position:relative; top:28px; font-style:italic; width:79px; font-weight: bold; text-shadow: 0px 0px 2px black, 1px 1px 2px black, 0px 2px 2px black; -webkit-animation: blur 3s; } ' +

                '#available_bullseye_unit.big_number { font-size: 0.90em; line-height: 1.4; } ' +

                '#available_bullseye_unit.blur { -webkit-animation: blurr 0.6s; } ' +

                    // Land units
                '#available_bullseye_unit.sword		.amount	{ color:#E2D9C1; top:57px; width:90px;	} ' +
                '#available_bullseye_unit.hoplite	.amount	{ color:#E2D9C1; top:57px; width:90px;	} ' +
                '#available_bullseye_unit.archer	.amount	{ color:#E2D0C1; top:47px; width:70px;	} ' +
                '#available_bullseye_unit.chariot			{ background-position: -990px 10px;		} ' +
                '#available_bullseye_unit.rider		.amount	{ color:#DFCC6C; top:52px; width:105px;	} ' +
                '#available_bullseye_unit.chariot	.amount,' +
                '#available_bullseye_unit.slinger	.amount	{ color:#F5E8B4; top:53px; width:91px;	} ' +
                '#available_bullseye_unit.catapult	.amount	{ color:#F5F6C5; top:36px; width:87px;	} ' +
                '#available_bullseye_unit.godsent	.amount	{ color:#F5F6C5; top:57px; width:92px;	} ' +

                    // Mythic units
                '#available_bullseye_unit.medusa			.amount	{ color:#FBFFBB; top:50px; width:65px;	} ' +
                '#available_bullseye_unit.manticore		    .amount	{ color:#ECD181; top:50px; width:55px; 	} ' +
                '#available_bullseye_unit.pegasus					{ background-position: -2970px 11px;	} ' +
                '#available_bullseye_unit.pegasus			.amount	{ color:#F7F8E3; top:52px; width:90px;	} ' +
                '#available_bullseye_unit.minotaur			        { background-position: -2700px 5px;	    } ' +
                '#available_bullseye_unit.minotaur		    .amount	{ color:#EAD88A; top:58px; width:78px;	} ' +
                    //'#available_bullseye_unit.zyklop					{ background-position: -4140px 10px;	} '+
                '#available_bullseye_unit.zyklop			.amount	{ color:#EDE0B0; top:53px; width:95px;	} ' +
                '#available_bullseye_unit.harpy					    { background-position: -1800px 11px;	} ' +
                '#available_bullseye_unit.harpy			    .amount	{ color:#E7DB79; top:40px; width:78px;	} ' +
                '#available_bullseye_unit.sea_monster		.amount	{ color:#D8EA84; top:58px; width:91px;	} ' +
                '#available_bullseye_unit.cerberus		    .amount	{ color:#EC7445; top:25px; width:101px;	} ' +
                '#available_bullseye_unit.centaur					{ background-position: -810px 10px;		} ' +
                '#available_bullseye_unit.centaur			.amount	{ color:#ECE0A8; top:44px; width:83px;	} ' +
                '#available_bullseye_unit.fury			    .amount	{ color:#E0E0BC; top:57px; width:95px;	} ' +
                '#available_bullseye_unit.griffin					{ background-position: -1710px 10px;	} ' +
                '#available_bullseye_unit.griffin			.amount	{ color:#FFDC9D; top:55px; width:98px;	} ' +
                '#available_bullseye_unit.calydonian_boar	.amount	{ color:#FFDC9D; top:17px; width:85px;	} ' +

                    // Naval units
                '#available_bullseye_unit.attack_ship		.amount	{ color:#FFCB00; top:26px; width:99px;	} ' +
                '#available_bullseye_unit.bireme			.amount	{ color:#DFC677; color:azure; top:28px; width:79px;	} ' +
                '#available_bullseye_unit.trireme			.amount	{ color:#F4FFD4; top:24px; width:90px;	} ' +
                '#available_bullseye_unit.small_transporter	.amount { color:#F5F6C5; top:26px; width:84px;	} ' +
                '#available_bullseye_unit.big_transporter	.amount { color:#FFDC9D; top:27px; width:78px;	} ' +
                '#available_bullseye_unit.colonize_ship		.amount { color:#F5F6C5; top:29px; width:76px;	} ' +
                '#available_bullseye_unit.colonize_ship		.amount { color:#F5F6C5; top:29px; width:76px;	} ' +
                '#available_bullseye_unit.demolition_ship	.amount { color:#F5F6C5; top:35px; width:90px;	} ' +

                    // Available units window
                '#available_units { overflow: auto; height: 250px; } ' +
                '#available_units .unit { margin: 5px; cursor:pointer; overflow:visible; } ' +
                '#available_units .unit.active { border: 2px solid #7f653a; border-radius:30px; margin:4px; } ' +
                '#available_units .unit span { text-shadow: 1px 1px 1px black, 1px 1px 2px black;} ' +
                '#available_units hr { border: none; border-top: 1px solid rgb(8, 148, 33); margin-top: 10px; } ' +
                '#available_units .option { float: left; margin-right: 30px; width:100%; } ' +

                    //'#available_units .box_content { background:url(http://s1.directupload.net/images/140206/8jd9d3ec.png) 94% 94% no-repeat; background-size:140px; } '+

                '#available_units .drop_box { position:absolute; top: -38px; right: 83px; width:90px; z-index:10; } ' +
                '#available_units .drop_group { width: 120px; } ' +
                '#available_units .select_group.open { display:block; } ' +
                '#available_units .item-list { overflow: auto; overflow-x: hidden; } ' +
                '#available_units .arrow { width:18px; height:18px; background:url(' + drop_out.src + ') no-repeat -1px -1px; position:absolute; } ' +

                    // Available units button
                '#btn_available_units { top:86px; left:119px; z-index:10; position:absolute; } ' +
                '#btn_available_units .ico_available_units { margin:5px 0px 0px 4px; width:24px; height:24px; ' +
                'background:url(http://s1.directupload.net/images/140323/w4ekrw8b.png) no-repeat 0px 0px;background-size:100%; filter:url(#Hue1); -webkit-filter:hue-rotate(100deg);  } ' +

                '</style>').appendTo('head');

            createWindowType("DIO_UNITS", (LANG.hasOwnProperty(LID) ? getText("options", "ava")[0] : default_title), 365, 270, true, [240, 70]);

            // Set Sea-ID beside the bull eye
            $('#sea_id').prependTo('#ui_box');

            AvailableUnits.addButton();

            AvailableUnits.updateBullseye();
        },
        deactivate: function () {
            $('#available_bullseye_unit').remove();
            $('#dio_available_units_style').remove();
            $('#btn_available_units').remove();

            if (Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_UNITS)) {
                Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_UNITS).close();
            }

            $('.picomap_overlayer').unbind();

            $('#sea_id').appendTo('.picomap_container')
        },
        addButton: function () {
            var default_title = DM.getl10n("place", "support_overview").options.troop_count + " (" + DM.getl10n("hercules2014", "available") + ")";

            $('<div id="btn_available_units" class="circle_button"><div class="ico_available_units js-caption"></div></div>').appendTo(".bull_eye_buttons");

            // Events
            $('#btn_available_units').on('mousedown', function () {
                $('#btn_available_units, .ico_available_units').addClass("checked");
            }).on('mouseup', function () {
                $('#btn_available_units, .ico_available_units').removeClass("checked");
            });

            $('#btn_available_units, .picomap_overlayer').click(function () {
                if (!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_UNITS)) {
                    AvailableUnits.openWindow();
                    $('#btn_available_units, .ico_available_units').addClass("checked");
                } else {
                    AvailableUnits.closeWindow();
                    $('#btn_available_units, .ico_available_units').removeClass("checked");
                }
            });

            // Tooltip
            $('#btn_available_units').tooltip(LANG.hasOwnProperty(LID) ? getText("labels", "uni") : default_title);
        },
        openWindow: function () {
            var groupArray = uw.ITowns.townGroups.getGroupsDIO(),

                unitArray = {
                    "sword": 0,
                    "archer": 0,
                    "hoplite": 0,
                    "slinger": 0,
                    "rider": 0,
                    "chariot": 0,
                    "catapult": 0,
                    "godsent": 0,
                    "manticore": 0,
                    "harpy": 0,
                    "pegasus": 0,
                    "griffin": 0,
                    "cerberus": 0,
                    "minotaur": 0,
                    "medusa": 0,
                    "zyklop": 0,
                    "centaur": 0,
                    "calydonian_boar": 0,
                    "fury": 0,
                    "sea_monster": 0,
                    "small_transporter": 0,
                    "big_transporter": 0,
                    "bireme": 0,
                    "attack_ship": 0,
                    "trireme": 0,
                    "demolition_ship": 0,
                    "colonize_ship": 0
                };

            if (!uw.Game.hasArtemis) {
                delete unitArray.calydonian_boar;
                delete unitArray.griffin;
            }

            var land_units_str = "", content =
                '<div id="available_units">' +
                    // Dropdown menu
                '<div class="drop_box">' +
                '<div class="drop_group dropdown default">' +
                '<div class="border-left"></div><div class="border-right"></div>' +
                '<div class="caption" name="' + groupArray[DATA.bullseyeUnit.current_group].id + '">' + ITowns.town_groups._byId[groupArray[DATA.bullseyeUnit.current_group].id].attributes.name + '</div>' +
                '<div class="arrow"></div>' +
                '</div>' +
                '<div class="select_group dropdown-list default active"><div class="item-list"></div></div>' +
                '</div>' +
                    // Content
                '<div class="box_content">';

            for (var unit in unitArray) {
                if (unitArray.hasOwnProperty(unit)) {
                    land_units_str += '<div class="unit index_unit bold unit_icon40x40 ' + unit + '"></div>';
                    if (unit == "sea_monster") {
                        land_units_str += '<div style="clear:left;"></div>'; // break
                    }
                }
            }
            content += land_units_str + '</div></div>';

            AvailableUnits.wnd = Layout.wnd.Create(GPWindowMgr.TYPE_DIO_UNITS);

            AvailableUnits.wnd.setContent(content);

            if (Game.premium_features.curator <= Timestamp.now()) {
                $('#available_units .drop_box').css({display: 'none'});
                DATA.bullseyeUnit.current_group = -1;
            }

            // Add groups to dropdown menu
            for (var group in groupArray) {
                if (groupArray.hasOwnProperty(group)) {
                    var group_name = ITowns.town_groups._byId[group].attributes.name;
                    $('<div class="option' + (group == -1 ? " sel" : "") + '" name="' + group + '">' + group_name + '</div>').appendTo('#available_units .item-list');
                }
            }

            // Update
            AvailableUnits.updateWindow();

            // Dropdown menu Handler
            $('#available_units .drop_group').click(function () {
                $('#available_units .select_group').toggleClass('open');
            });
            // Change group
            $('#available_units .select_group .option').click(function () {
                DATA.bullseyeUnit.current_group = $(this).attr("name");
                $('#available_units .select_group').removeClass('open');
                $('#available_units .select_group .option.sel').removeClass("sel");
                $(this).addClass("sel");

                $('#available_units .drop_group .caption').attr("name", DATA.bullseyeUnit.current_group);
                $('#available_units .drop_group .caption').get(0).innerHTML = this.innerHTML;

                $('#available_units .unit.active').removeClass("active");
                $('#available_units .unit.' + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")).addClass("active");

                AvailableUnits.updateWindow();
                AvailableUnits.updateBullseye();
                AvailableUnits.save();
            });

            // Set active bullseye unit
            $('#available_units .unit.' + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")).addClass("active");

            // Change bullseye unit
            $('#available_units .unit').click(function () {
                DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] = this.className.split(" ")[4].trim();

                $('#available_units .unit.active').removeClass("active");
                $(this).addClass("active");

                AvailableUnits.updateBullseye();
                AvailableUnits.save();

            });

            // Close button event - uncheck available units button
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_UNITS).getJQCloseButton().get(0).onclick = function () {
                $('#btn_available_units, .ico_available_units').removeClass("checked");
            };
        },
        closeWindow: function () {
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_UNITS).close();
        },
        save: function () {
            saveValue(WID + "_bullseyeUnit", JSON.stringify(DATA.bullseyeUnit));
        },
        updateBullseye: function () {
            var sum = 0, str = "", fsize = ['1.4em', '1.2em', '1.15em', '1.1em', '1.0em', '0.95em'], i;
            if ($('#available_bullseye_unit').get(0)) {
                $('#available_bullseye_unit').get(0).className = "unit_icon90x90 " + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme");

                if (groupUnitArray[DATA.bullseyeUnit.current_group]) {
                    sum = groupUnitArray[DATA.bullseyeUnit.current_group][(DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")];
                }
                sum = sum.toString();

                for (i = 0; i < sum.length; i++) {
                    str += "<span style='font-size:" + fsize[i] + "'>" + sum[i] + "</span>";
                }
                $('#available_bullseye_unit .amount').get(0).innerHTML = str;

                if (sum >= 100000) {
                    $('#available_bullseye_unit').addClass("big_number");
                } else {
                    $('#available_bullseye_unit').removeClass("big_number");
                }
            }
        },
        updateWindow: function () {
            $('#available_units .box_content .unit').each(function () {
                var unit = this.className.split(" ")[4];
                this.innerHTML = '<span style="font-size:0.9em">' + groupUnitArray[DATA.bullseyeUnit.current_group][unit] + '</span>';
            });
        }
    };

    /*******************************************************************************************************************************
     * Comparison box
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Compares the units of each unit type
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var UnitComparison = {
        activate: function () {
            //UnitComparison.addBox();
            UnitComparison.addButton();

            // Create Window Type
            createWindowType("DIO_COMPARISON", getText("labels", "dsc"), 480, 315, true, ["center", "center", 100, 100]);

            // Style
            $('<style id="dio_comparison_style"> ' +

                    // Button
                '#dio_comparison_button { top:51px; left:120px; z-index:10; position:absolute; } ' +
                '#dio_comparison_button .ico_comparison { margin:5px 0px 0px 4px; width:24px; height:24px; ' +
                'background:url(http://666kb.com/i/cjq6cxia4ms8mn95r.png) no-repeat 0px 0px; background-size:100%; filter:url(#Hue1); -webkit-filter:hue-rotate(60deg); } ' +
                '#dio_comparison_button.checked .ico_comparison { margin-top:6px; } ' +

                    // Window
                '#dio_comparison a { float:left; background-repeat:no-repeat; background-size:25px; line-height:2; margin-right:10px; } ' +
                '#dio_comparison .box_content { text-align:center; font-style:normal; } ' +

                    // Menu tabs
                '#dio_comparison_menu .tab_icon { left: 23px;} ' +
                '#dio_comparison_menu .tab_label { margin-left: 18px; } ' +

                    // Content
                '#dio_comparison .hidden { display:none; } ' +
                '#dio_comparison table { width:480px; } ' +
                '#dio_comparison .hack .t_hack, #dio_comparison .pierce .t_pierce, #dio_comparison .distance .t_distance, #dio_comparison .sea .t_sea { display:inline-table; } ' +

                '#dio_comparison .box_content { background:url(http://s1.directupload.net/images/140206/8jd9d3ec.png) 94% 94% no-repeat; background-size:140px; } ' +

                '#dio_comparison .compare_type_icon { height:25px; width:25px; background:url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png); background-size:100%; } ' +
                '#dio_comparison .compare_type_icon.booty { background:url(http://s14.directupload.net/images/140404/ki4gwd7x.png); background-size:100%; } ' +
                '#dio_comparison .compare_type_icon.time { background:url(https://gpall.innogamescdn.com/images/game/res/time.png); background-size:100%; } ' +
                '#dio_comparison .compare_type_icon.favor { background:url(https://gpall.innogamescdn.com/images/game/res/favor.png); background-size:100%; } ' +
                '</style>').appendTo("head");
        },
        deactivate: function () {
            $('#dio_comparison_button').remove();
            $('#dio_comparison_style').remove();

            if (Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_COMPARISON)) {
                Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_COMPARISON).close();
            }
        },
        addButton: function () {
            $('<div id="dio_comparison_button" class="circle_button"><div class="ico_comparison js-caption"></div></div>').appendTo(".bull_eye_buttons");

            // Events
            /*
             $('#dio_comparison_button').on('mousedown', function(){
             $('#dio_comparison_button').addClass("checked");
             }, function(){
             $('#dio_comparison_button').removeClass("checked");
             });
             */
            $('#dio_comparison_button').on('click', function () {
                if (!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_COMPARISON)) {
                    UnitComparison.openWindow();
                    $('#dio_comparison_button').addClass("checked");
                } else {
                    UnitComparison.closeWindow();
                    $('#dio_comparison_button').removeClass("checked");
                }
            });

            // Tooltip
            $('#dio_comparison_button').tooltip(getText("labels", "dsc"));
        },
        openWindow: function () {
            var content =
                // Title tabs
                '<ul id="dio_comparison_menu" class="menu_inner" style="top: -36px; right: 35px;">' +
                '<li><a class="submenu_link sea" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon icon_small townicon_so"></span><span class="tab_label">' + getText("labels", "sea") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link distance" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon icon_small townicon_di"></span><span class="tab_label">' + getText("labels", "dst") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link pierce" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon icon_small townicon_sh"></span><span class="tab_label">' + getText("labels", "prc") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link hack active" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon icon_small townicon_lo"></span><span class="tab_label">' + getText("labels", "hck") + '</span>' +
                '</span></span></span></a></li>' +
                '</ul>' +
                    // Content
                '<div id="dio_comparison" style="margin-bottom:5px; font-style:italic;"><div class="box_content hack"></div></div>';

            Layout.wnd.Create(GPWindowMgr.TYPE_DIO_COMPARISON).setContent(content);

            UnitComparison.addComparisonTable("hack");
            UnitComparison.addComparisonTable("pierce");
            UnitComparison.addComparisonTable("distance");
            UnitComparison.addComparisonTable("sea");

            // Tooltips
            var labelArray = DM.getl10n("barracks"),
                labelAttack = DM.getl10n("context_menu", "titles").attack,
                labelDefense = DM.getl10n("place", "tabs")[0];

            $('.tr_att').tooltip(labelAttack);
            $('.tr_def').tooltip(labelDefense + " (Ø)");
            $('.tr_def_sea').tooltip(labelDefense);
            $('.tr_spd').tooltip(labelArray.tooltips.speed);
            $('.tr_bty').tooltip(labelArray.tooltips.booty.title);
            $('.tr_bty_sea').tooltip(labelArray.tooltips.ship_transport.title);
            $('.tr_res').tooltip(labelArray.costs + " (" +
                labelArray.cost_details.wood + " + " +
                labelArray.cost_details.stone + " + " +
                labelArray.cost_details.iron + ")"
            );
            $('.tr_fav').tooltip(labelArray.costs + " (" + labelArray.cost_details.favor + ")");
            $('.tr_tim').tooltip(labelArray.cost_details.buildtime_barracks + " (s)");
            $('.tr_tim_sea').tooltip(labelArray.cost_details.buildtime_docks + " (s)");

            UnitComparison.switchComparisonTables();

            // Close button event - uncheck available units button
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_COMPARISON).getJQCloseButton().get(0).onclick = function () {
                $('#dio_comparison_button').removeClass("checked");
                $('.ico_comparison').get(0).style.marginTop = "5px";
            };
        },
        closeWindow: function () {
            Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DIO_COMPARISON).close();
        },
        switchComparisonTables: function () {
            $('#dio_comparison_menu .hack, #dio_comparison_menu .pierce, #dio_comparison_menu .distance, #dio_comparison_menu .sea').click(function () {
                $('#dio_comparison .box_content').removeClass($('#dio_comparison .box_content').get(0).className.split(" ")[1]);
                console.debug(this.className.split(" ")[1]);
                $('#dio_comparison .box_content').addClass(this.className.split(" ")[1]);

                $('#dio_comparison_menu .active').removeClass("active");
                $(this).addClass("active");
            });
        },

        tooltips: [], t: 0,

        addComparisonTable: function (type) {
            var pos = {
                att: {hack: "36%", pierce: "27%", distance: "45.5%", sea: "72.5%"},
                def: {hack: "18%", pierce: "18%", distance: "18%", sea: "81.5%"}
            };
            var unitIMG = "https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png";
            var strArray = [
                "<td></td>",
                '<td><div class="compare_type_icon" style="background-position: 0% ' + pos.att[type] + ';"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% ' + pos.def[type] + ';"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% 63%;"></div></td>',
                (type !== "sea") ? '<td><div class="compare_type_icon booty"></div></td>' : '<td><div class="compare_type_icon" style="background-position: 0% 91%;"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% 54%;"></div></td>',
                '<td><div class="compare_type_icon favor"></div></td>',
                '<td><div class="compare_type_icon time"></div></td>'
            ];

            for (var e in uw.GameData.units) {
                if (uw.GameData.units.hasOwnProperty(e)) {
                    var valArray = [];

                    if (type === (uw.GameData.units[e].attack_type || "sea") && (e !== "militia")) {
                        valArray.att = Math.round(uw.GameData.units[e].attack * 10 / uw.GameData.units[e].population) / 10;
                        valArray.def = Math.round(((uw.GameData.units[e].def_hack + uw.GameData.units[e].def_pierce + uw.GameData.units[e].def_distance) * 10) / (3 * uw.GameData.units[e].population)) / 10;
                        valArray.def = valArray.def || Math.round(uw.GameData.units[e].defense * 10 / uw.GameData.units[e].population) / 10;
                        valArray.speed = uw.GameData.units[e].speed;
                        valArray.booty = Math.round(((uw.GameData.units[e].booty) * 10) / uw.GameData.units[e].population) / 10;
                        valArray.booty = valArray.booty || Math.round(((uw.GameData.units[e].capacity ? uw.GameData.units[e].capacity + 6 : 0) * 10) / uw.GameData.units[e].population) / 10;
                        valArray.favor = Math.round((uw.GameData.units[e].favor * 10) / uw.GameData.units[e].population) / 10;
                        valArray.res = Math.round((uw.GameData.units[e].resources.wood + uw.GameData.units[e].resources.stone + uw.GameData.units[e].resources.iron) / (uw.GameData.units[e].population));
                        valArray.time = Math.round(uw.GameData.units[e].build_time / uw.GameData.units[e].population);

                        // World without Artemis? -> grey griffin and boar
                        valArray.heroStyle = "";
                        valArray.heroStyleIMG = "";

                        if (!uw.Game.hasArtemis && ((e === "griffin") || (e === "calydonian_boar"))) {
                            valArray.heroStyle = "color:black;opacity: 0.4;";
                            valArray.heroStyleIMG = "filter: url(#GrayScale); -webkit-filter:grayscale(100%);";
                        }

                        strArray[0] += '<td class="un' + (UnitComparison.t) + '"><span class="unit index_unit unit_icon40x40 ' + e + '" style="' + valArray.heroStyle + valArray.heroStyleIMG + '"></span></td>';
                        strArray[1] += '<td class="bold" style="color:' + ((valArray.att > 19) ? 'green;' : ((valArray.att < 10 && valArray.att !== 0 ) ? 'red;' : 'black;')) + valArray.heroStyle + '">' + valArray.att + '</td>';
                        strArray[2] += '<td class="bold" style="color:' + ((valArray.def > 19) ? 'green;' : ((valArray.def < 10 && valArray.def !== 0 ) ? 'red;' : 'black;')) + valArray.heroStyle + '">' + valArray.def + '</td>';
                        strArray[3] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.speed + '</td>';
                        strArray[4] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.booty + '</td>';
                        strArray[5] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.res + '</td>';
                        strArray[6] += '<td class="bold" style="color:' + ((valArray.favor > 0) ? 'rgb(0, 0, 214);' : 'black;') + valArray.heroStyle + ';">' + valArray.favor + '</td>';
                        strArray[7] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.time + '</td>';

                        UnitComparison.tooltips[UnitComparison.t] = uw.GameData.units[e].name;
                        UnitComparison.t++;
                    }
                }
            }

            $('<table class="hidden t_' + type + '" cellpadding="1px">' +
                '<tr>' + strArray[0] + '</tr>' +
                '<tr class="tr_att">' + strArray[1] + '</tr><tr class="tr_def' + (type == "sea" ? "_sea" : "") + '">' + strArray[2] + '</tr>' +
                '<tr class="tr_spd">' + strArray[3] + '</tr><tr class="tr_bty' + (type == "sea" ? "_sea" : "") + '">' + strArray[4] + '</tr>' +
                '<tr class="tr_res">' + strArray[5] + '</tr><tr class="tr_fav">' + strArray[6] + '</tr><tr class="tr_tim' + (type == "sea" ? "_sea" : "") + '">' + strArray[7] + '</tr>' +
                '</table>').appendTo('#dio_comparison .box_content');

            for (var i = 0; i <= UnitComparison.t; i++) {
                $('.un' + i).tooltip(UnitComparison.tooltips[i]);
            }
        }
    };

    /*******************************************************************************************************************************
     * Reports and Messages
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Storage of the selected filter (only in German Grepolis yet)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var filter = "all";

    function saveFilter() {
        $('#dd_filter_type_list .item-list div').each(function () {
            $(this).click(function () {
                filter = $(this).attr("name");
            });
        });
        /*
         var i = 0;
         $("#report_list a").each(function () {
         //console.log((i++) +" = " + $(this).attr('data-reportid'));
         });
         */
    }

    function loadFilter() {
        if ($('#dd_filter_type_list .selected').attr("name") !== filter) {
            $('#dd_filter_type .caption').click();
            $('#dd_filter_type_list .item-list div[name=' + filter + ']').click();
        }
    }

    function removeReports() {
        $("#report_list li:contains('spioniert')").each(function () {
            //$(this).remove();
        });
    }

    var zut = 0;
    var messageArray = {};

    function filterPlayer() {
        if (!$('#message_filter_list').get(0)) {
            $('<div id="message_filter_list" style="height:300px;overflow-y:scroll; width: 790px;"></div>').appendTo('#folder_container');
            $("#message_list").get(0).style.display = "none";
        }
        if (zut < parseInt($('.es_last_page').get(0).value, 10) - 1) {
            $('.es_page_input').get(0).value = zut++;
            $('.jump_button').click();
            $("#message_list li:contains('')").each(function () {
                $(this).appendTo('#message_filter_list');
            });
        } else {
            zut = 1;
        }
    }


    /*******************************************************************************************************************************
     * World Wonder Ranking - Change
     *******************************************************************************************************************************/

    function getWorldWonderTypes() {
        $.ajax({
            type: "GET",
            url: "/game/alliance?town_id=" + uw.Game.town_id + "&action=world_wonders&h=" + uw.Game.csrfToken + "&json=%7B%22town_id%22%3A" + uw.Game.town_id + "%2C%22nlreq_id%22%3A" + uw.Game.notification_last_requested_id +
            "%7D&_=" + uw.Game.server_time,
            success: function (text) {
                try {
                    //console.log(JSON.parse(text));
                    temp = JSON.parse(text).json.data.world_wonders;
                    for (var t in temp) {
                        if (temp.hasOwnProperty(t)) {
                            wonderTypes[temp[t].wonder_type] = temp[t].full_name;
                        }
                    }
                    temp = JSON.parse(text).json.data.buildable_wonders;
                    for (var x in temp) {
                        if (temp.hasOwnProperty(x)) {
                            wonderTypes[x] = temp[x].name;
                        }
                    }
                    saveValue(MID + "_wonderTypes", JSON.stringify(wonderTypes));
                } catch (error) {
                    errorHandling(error, "getWorldWonderTypes");
                }
            }
        });
    }

    function getWorldWonders() {
        $.ajax({
            type: "GET",
            url: "/game/ranking?town_id=" + uw.Game.town_id + "&action=wonder_alliance&h=" + uw.Game.csrfToken + "&json=%7B%22type%22%3A%22all%22%2C%22town_id%22%3A" + uw.Game.town_id + "%2C%22nlreq_id%22%3A3" + uw.Game.notification_last_requested_id +
            "%7D&_=" + uw.Game.server_time
        });
    }

    var WorldWonderRanking = {
        activate: function () {
            if ($('#dio_wonder_ranking').get(0)) {
                $('#dio_wonder_ranking').remove();
            }
            $('<style id="dio_wonder_ranking" type="text/css"> .wonder_ranking { display: none; } </style>').appendTo('head');
        },
        deactivate: function () {
            if ($('#dio_wonder_ranking').get(0)) {
                $('#dio_wonder_ranking').remove();
            }
            $('<style id="dio_wonder_ranking" type="text/css"> .wonder_ranking { display: block; } </style>').appendTo('head');
        },
        change: function (html) {
            if ($('#ranking_inner tr', html)[0].children.length !== 1) { // world wonders exist?
                try {
                    var ranking = {}, temp_ally, temp_ally_id, temp_ally_link;

                    // Save world wonder ranking into array
                    $('#ranking_inner tr', html).each(function () {
                        try {
                            if (this.children[0].innerHTML) {
                                temp_ally = this.children[1].children[0].innerHTML; // das hier

                                temp_ally_id = this.children[1].children[0].onclick.toString();
                                temp_ally_id = temp_ally_id.substring(temp_ally_id.indexOf(",") + 1);
                                temp_ally_id = temp_ally_id.substring(0, temp_ally_id.indexOf(")"));

                                temp_ally_link = this.children[1].innerHTML;

                            } else {
                                //World wonder name
                                var wonder_name = this.children[3].children[0].innerHTML;

                                for (var w in wonderTypes) {
                                    if (wonderTypes.hasOwnProperty(w)) {
                                        if (wonder_name == wonderTypes[w]) {
                                            var level = this.children[4].innerHTML, // world wonder level
                                                ww_data = JSON.parse(atob(this.children[3].children[0].href.split("#")[1])), wonder_link;
                                            //console.log(ww_data);

                                            if (!ranking.hasOwnProperty(level)) {
                                                // add wonder types
                                                ranking[level] = {
                                                    colossus_of_rhodes: {},
                                                    great_pyramid_of_giza: {},
                                                    hanging_gardens_of_babylon: {},
                                                    lighthouse_of_alexandria: {},
                                                    mausoleum_of_halicarnassus: {},
                                                    statue_of_zeus_at_olympia: {},
                                                    temple_of_artemis_at_ephesus: {}
                                                };
                                            }

                                            if (!ranking[level][w].hasOwnProperty(temp_ally_id)) {
                                                ranking[level][w][temp_ally_id] = {}; // add alliance array
                                            }
                                            // island coordinates of the world wonder:
                                            ranking[level][w][temp_ally_id].ix = ww_data.ix;
                                            ranking[level][w][temp_ally_id].iy = ww_data.iy;
                                            ranking[level][w][temp_ally_id].sea = this.children[5].innerHTML; // world wonder sea

                                            wonder_link = this.children[3].innerHTML;
                                            if (temp_ally.length > 15) {
                                                temp_ally = temp_ally.substring(0, 15) + '.';
                                            }
                                            wonder_link = wonder_link.substr(0, wonder_link.indexOf(">") + 1) + temp_ally + '</a>';

                                            ranking[level][w][temp_ally_id].ww_link = wonder_link;

                                            // other data of the world wonder
                                            ranking[level][w][temp_ally_id].ally_link = temp_ally_link;
                                            ranking[level][w][temp_ally_id].ally_name = temp_ally; // alliance name
                                            ranking[level][w][temp_ally_id].name = wonder_name; // world wonder name

                                            // Save wonder coordinates for wonder icons on map
                                            if (!wonder.map[w]) {
                                                wonder.map[w] = {};
                                            }
                                            wonder.map[w][ww_data.ix + "_" + ww_data.iy] = level;
                                            saveValue(WID + "_wonder", JSON.stringify(wonder));

                                        }
                                    }
                                }
                            }
                        } catch (error) {
                            errorHandling(error, "WorldWonderRanking.change(function)");
                        }
                    });

                    if ($('#ranking_table_wrapper').get(0)) {
                        $('#ranking_fixed_table_header').get(0).innerHTML = '<tr>' +
                            '<td style="width:10px">#</td>' +
                            '<td>Colossus</td>' +
                            '<td>Pyramid</td>' +
                            '<td>Garden</td>' +
                            '<td>Lighthouse</td>' +
                            '<td>Mausoleum</td>' +
                            '<td>Statue</td>' +
                            '<td>Temple</td>' +
                            '</tr>';

                        $('#ranking_fixed_table_header').css({
                            tableLayout: 'fixed',
                            width: '100%',
                            //paddingLeft: '0px',
                            paddingRight: '15px'
                        });

                        var ranking_substr = '', z = 0;
                        for (var level = 10; level >= 1; level--) {
                            if (ranking.hasOwnProperty(level)) {
                                var complete = "";
                                if (level == 10) {
                                    complete = "background: rgba(255, 236, 108, 0.36);";
                                }

                                // Alternate table background color
                                if (z === 0) {
                                    ranking_substr += '<tr class="game_table_odd" style="' + complete + '"><td style="border-right: 1px solid #d0be97;">' + level + '</td>';
                                    z = 1;
                                } else {
                                    ranking_substr += '<tr class="game_table_even" style="' + complete + '"><td style="border-right: 1px solid #d0be97;">' + level + '</td>';
                                    z = 0;
                                }
                                for (var w in ranking[level]) {
                                    if (ranking[level].hasOwnProperty(w)) {
                                        ranking_substr += '<td>';

                                        for (var a in ranking[level][w]) {
                                            if (ranking[level][w].hasOwnProperty(a)) {
                                                ranking_substr += '<nobr>' + ranking[level][w][a].ww_link + '</nobr><br />'; // ww link
                                            }
                                        }
                                        ranking_substr += '</td>';
                                    }
                                }
                                ranking_substr += '</tr>';
                            }
                        }

                        var ranking_str = '<table id="ranking_endless_scroll" class="game_table" cellspacing="0"><tr>' +
                            '<td style="width:10px;border-right: 1px solid #d0be97;"></td>' +
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.colossus_of_rhodes + ';margin-left:26px"></div></td>' +	// Colossus
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.great_pyramid_of_giza + ';margin-left:19px"></div></td>' +	// Pyramid
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.hanging_gardens_of_babylon + ';margin-left:19px"></div></td>' +	// Garden
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.lighthouse_of_alexandria + ';margin-left:24px"></div></td>' +	// Lighthouse
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.mausoleum_of_halicarnassus + ';margin-left:25px"></div></td>' +	// Mausoleum
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.statue_of_zeus_at_olympia + ';margin-left:25px"></div></td>' +	// Statue
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.temple_of_artemis_at_ephesus + ';margin-left:22px"></div></td>' +	// Temple
                            '</tr>' + ranking_substr + '</table>';

                        $('#ranking_table_wrapper').get(0).innerHTML = ranking_str;

                        $('#ranking_endless_scroll .dio_wonder').css({
                            width: "65px", height: "60px",
                            backgroundSize: "auto 100%",
                            backgroundPosition: "64px 0px"
                        });

                        $('#ranking_endless_scroll').css({
                            tableLayout: 'fixed',
                            width: '100%',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            fontSize: '0.7em',
                            lineHeight: '2'
                        });
                        $('#ranking_endless_scroll tbody').css({
                            verticalAlign: 'text-top'
                        });

                        $('#ranking_table_wrapper img').css({
                            width: "60px"
                        });
                        $('#ranking_table_wrapper').css({
                            overflowY: 'scroll'
                        });
                    }
                } catch (error) {
                    errorHandling(error, "WorldWonderRanking.change");
                }
            }
            if ($('.wonder_ranking').get(0)) {
                $('.wonder_ranking').get(0).style.display = "block";
            }
        }
    };

    /*******************************************************************************************************************************
     * World Wonder
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● click adjustment
     * | ● Share calculation (= ratio of player points to alliance points)
     * | ● Resources calculation & counter (stores amount)
     * | ● Adds missing previous & next buttons on finished world wonders (better browsing through world wonders)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    // getPointRatio: Default
    function getPointRatioFromAllianceProfile() {
        if (AID) {
            $.ajax({
                type: "GET",
                url: '/game/alliance?town_id=' + uw.Game.townId + '&action=profile&h=' + uw.Game.csrfToken + '&json=%7B%22alliance_id%22%3A' + AID + '%2C%22town_id%22%3A' + uw.Game.townId +
                '%2C%22nlreq_id%22%3A' + uw.Game.notification_last_requested_id + '%7D&_=' + uw.Game.server_time,
                success: function (text) {
                    try {
                        text = text.substr(text.indexOf("/li") + 14).substr(0, text.indexOf("\ "));
                        var AP = parseInt(text, 10);
                        wonder.ratio[AID] = 100 / AP * uw.Game.player_points;
                        saveValue(WID + "_wonder", JSON.stringify(wonder));
                    } catch (error) {
                        errorHandling(error, "getPointRatioFromAllianceProfile");
                    }
                }
            });
        } else {
            wonder.ratio[AID] = -1;
            saveValue(WID + "_wonder", JSON.stringify(wonder));
        }
    }

    function getPointRatioFromAllianceRanking() {
        try {
            if (AID && $('.current_player .r_points').get(0)) {
                wonder.ratio[AID] = 100 / parseInt($('.current_player .r_points').get(0).innerHTML, 10) * uw.Game.player_points;
                saveValue(WID + "_wonder", JSON.stringify(wonder));
            }
        } catch (error) {
            errorHandling(error, "getPointRatioFromAllianceRaking");
        }
    }

    function getPointRatioFromAllianceMembers() {
        try {
            var ally_points = 0;
            $('#ally_members_body tr').each(function () {
                ally_points += parseInt($(this).children().eq(2).text(), 10) || 0;
            });
            wonder.ratio[AID] = 100 / ally_points * uw.Game.player_points;
            saveValue(WID + "_wonder", JSON.stringify(wonder));
        } catch (error) {
            errorHandling(error, "getPointRatioFromAllianceMembers");
        }
    }

    var WorldWonderCalculator = {
        activate: function () {
            // Style
            $('<style id="dio_wonder_calculator"> ' +
                '.wonder_controls { height:380px; } ' +
                '.wonder_controls .wonder_progress { margin: 0px auto 5px; } ' +
                '.wonder_controls .wonder_header { text-align:left; margin:10px -8px 12px 3px; }' +
                '.wonder_controls .build_wonder_icon { top:25px !important; }' +
                '.wonder_controls .wonder_progress_bar { top:54px; }' +
                '.wonder_controls .trade fieldset { float:right; } ' +
                '.wonder_controls .wonder_res_container { right:29px; } ' +
                '.wonder_controls .ww_ratio {position:relative; height:auto; } ' +
                '.wonder_controls fieldset.next_level_res {  height:auto; } ' +
                '.wonder_controls .town-capacity-indicator { margin-top:0px; } ' +

                '.wonder_controls .ww_ratio .progress { line-height:1; color:white; font-size:0.8em; } ' +
                '.wonder_controls .ww_perc { position:absolute; width:242px; text-align:center; } ' +
                '.wonder_controls .indicator3 { z-index:0; } ' +
                '.wonder_controls .indicator3.red { background-position:right -203px; height:10px; width:242px; } ' +
                '.wonder_controls .indicator3.green { background-position:right -355px; height:10px; width:242px; } ' +
                '.wonder_controls .all_res { background:url(https://gpall.innogamescdn.com/images/game/layout/resources_2.32.png) no-repeat 0 -90px; width:30px; height:30px; margin:0 auto; margin-left:5px; } ' +
                '.wonder_controls .town-capacity-indicator { margin-top:0px; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function () {
            $('#dio_wonder_calculator').remove();
        }
    };

    // TODO: Split function...
    function getResWW() {
        try {
            var wndArray = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_WONDERS);

            for (var e in wndArray) {
                if (wndArray.hasOwnProperty(e)) {
                    var wndID = "#gpwnd_" + wndArray[e].getID() + " ";

                    if ($(wndID + '.wonder_progress').get(0)) {
                        var res = 0,
                            ww_share = {total: {share: 0, sum: 0}, stage: {share: 0, sum: 0}},
                            ww_type = $(wndID + '.finished_image_small').attr('src').split("/")[6].split("_")[0], // Which world wonder?
                            res_stages = [2, 4, 6, 10, 16, 28, 48, 82, 140, 238], // Rohstoffmenge pro Rohstofftyp in 100.000 Einheiten
                            stage = parseInt($(wndID + '.wonder_expansion_stage span').get(0).innerHTML.split("/")[0], 10) + 1, // Derzeitige Füllstufe
                            speed = uw.Game.game_speed;

                        wonder.storage[AID] = wonder.storage[AID] || {};

                        wonder.storage[AID][ww_type] = wonder.storage[AID][ww_type] || {};

                        wonder.storage[AID][ww_type][stage] = wonder.storage[AID][ww_type][stage] || 0;

                        if (!$(wndID + '.ww_ratio').get(0)) {
                            $('<fieldset class="ww_ratio"></fieldset>').appendTo(wndID + '.wonder_res_container .trade');
                            $(wndID + '.wonder_header').prependTo(wndID + '.wonder_progress');
                            $(wndID + '.wonder_res_container .send_res').insertBefore(wndID + '.wonder_res_container .next_level_res');
                        }

                        for (var d in res_stages) {
                            if (res_stages.hasOwnProperty(d)) {
                                ww_share.total.sum += res_stages[d];
                            }
                        }

                        ww_share.total.sum *= speed * 300000;

                        ww_share.total.share = parseInt(wonder.ratio[AID] * (ww_share.total.sum / 100), 10);

                        ww_share.stage.sum = speed * res_stages[stage - 1] * 300000;

                        ww_share.stage.share = parseInt(wonder.ratio[AID] * (ww_share.stage.sum / 100), 10); // ( 3000 = 3 Rohstofftypen * 100000 Rohstoffe / 100 Prozent)
                        setResWW(stage, ww_type, ww_share, wndID);


                        $(wndID + '.wonder_res_container .send_resources_btn').click(function (e) {
                            try {
                                wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_wood input:text').get(0).value, 10);
                                wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_stone input:text').get(0).value, 10);
                                wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_iron input:text').get(0).value, 10);

                                setResWW(stage, ww_type, ww_share, wndID);
                                saveValue(WID + "_wonder", JSON.stringify(wonder));
                            } catch (error) {
                                errorHandling(error, "getResWW_Click");
                            }
                        });

                    } else {
                        $('<div class="prev_ww pos_Y"></div><div class="next_ww pos_Y"></div>').appendTo(wndID + '.wonder_controls');

                        $(wndID + '.wonder_finished').css({width: '100%'});

                        $(wndID + '.pos_Y').css({
                            top: '-266px'
                        });
                    }
                }
            }
        } catch (error) {
            errorHandling(error, "getResWW");
        }
    }

    function setResWW(stage, ww_type, ww_share, wndID) {
        try {
            var stage_width, total_width, res_total = 0, stage_color = "red", total_color = "red";

            for (var z in wonder.storage[AID][ww_type]) {
                if (wonder.storage[AID][ww_type].hasOwnProperty(z)) {
                    res_total += wonder.storage[AID][ww_type][z];
                }
            }

            // Progressbar
            if (ww_share.stage.share > wonder.storage[AID][ww_type][stage]) {
                stage_width = (242 / ww_share.stage.share) * wonder.storage[AID][ww_type][stage];
                stage_color = "red";
            } else {
                stage_width = 242;
                stage_color = "green"
            }
            if (ww_share.total.share > res_total) {
                total_color = "red";
                total_width = (242 / ww_share.total.share) * res_total;
            } else {
                total_width = 242;
                total_color = "green"
            }

            $(wndID + '.ww_ratio').get(0).innerHTML = "";
            $(wndID + '.ww_ratio').append(
                '<legend>' + getText("labels", "leg") + ' (<span style="color:#090">' + (Math.round(wonder.ratio[AID] * 100) / 100) + '%</span>):</legend>' +
                '<div class="town-capacity-indicator">' +
                '<div class="icon all_res"></div>' +
                '<div id="ww_town_capacity_stadium" class="tripple-progress-progressbar">' +
                '<div class="border_l"></div><div class="border_r"></div><div class="body"></div>' +
                '<div class="progress overloaded">' +
                '<div class="indicator3 ' + stage_color + '" style="width:' + stage_width + 'px"></div>' +
                '<span class="ww_perc">' + Math.round(wonder.storage[AID][ww_type][stage] / ww_share.stage.share * 100) + '%</span>' +
                '</div>' +
                '<div class="amounts">' + getText("labels", "stg") + ': <span class="curr">' + pointNumber(wonder.storage[AID][ww_type][stage]) + '</span> / ' +
                '<span class="max">' + pointNumber(Math.round(ww_share.stage.share / 1000) * 1000) + '</span></div>' +
                '</div></div>' +
                '<div class="town-capacity-indicator">' +
                '<div class="icon all_res"></div>' +
                '<div id="ww_town_capacity_total" class="tripple-progress-progressbar">' +
                '<div class="border_l"></div><div class="border_r"></div><div class="body"></div>' +
                '<div class="progress overloaded">' +
                '<div class="indicator3 ' + total_color + '" style="width:' + total_width + 'px;"></div>' +
                '<span class="ww_perc">' + Math.round(res_total / ww_share.total.share * 100) + '%</span>' +
                '</div>' +
                '<div class="amounts">' + getText("labels", "tot") + ': <span class="curr">' + pointNumber(res_total) + '</span> / ' +
                '<span class="max">' + pointNumber((Math.round(ww_share.total.share / 1000) * 1000)) + '</span></div>' +
                '</div></div>');

            $(wndID + '.ww_ratio').tooltip(
                "<table style='border-spacing:0px; text-align:right' cellpadding='5px'><tr>" +
                "<td align='right' style='border-right: 1px solid;border-bottom: 1px solid'></td>" +
                "<td style='border-right: 1px solid; border-bottom: 1px solid'><span class='bbcodes_player bold'>(" + (Math.round((wonder.ratio[AID]) * 100) / 100) + "%)</span></td>" +
                "<td style='border-bottom: 1px solid'><span class='bbcodes_ally bold'>(100%)</span></td></tr>" +
                "<tr><td class='bold' style='border-right:1px solid;text-align:center'>" + getText("labels", "stg") + "&nbsp;" + stage + "</td>" +
                "<td style='border-right: 1px solid'>" + pointNumber(Math.round(ww_share.stage.share / 1000) * 1000) + "</td>" +
                "<td>" + pointNumber(Math.round(ww_share.stage.sum / 1000) * 1000) + "</td></tr>" +
                "<tr><td class='bold' style='border-right:1px solid;text-align:center'>" + getText("labels", "tot") + "</td>" +
                "<td style='border-right: 1px solid'>" + pointNumber(Math.round(ww_share.total.share / 1000) * 1000) + "</td>" +
                "<td>" + pointNumber(Math.round(ww_share.total.sum / 1000) * 1000) + "</td>" +
                "</tr></table>");

        } catch (error) {
            errorHandling(error, "setResWW");
        }
    }

    // Adds points to numbers
    function pointNumber(number) {
        var sep;
        if (LID === "de") {
            sep = ".";
        } else {
            sep = ",";
        }

        number = number.toString();
        if (number.length > 3) {
            var mod = number.length % 3;
            var output = (mod > 0 ? (number.substring(0, mod)) : '');

            for (var i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0)) {
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                } else {
                    output += sep + number.substring(mod + 3 * i, mod + 3 * i + 3);
                }
            }
            number = output;
        }
        return number;
    }

    /*******************************************************************************************************************************
     * Farming Village Overview
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Color change on possibility of city festivals
     * ----------------------------------------------------------------------------------------------------------------------------
     * *****************************************************************************************************************************/

    function changeResColor() {
        var res, res_min, i = 0;
        $('#fto_town_list .fto_resource_count :last-child').reverseList().each(function () {
            if ($(this).parent().hasClass("stone")) {
                res_min = 18000;
            } else {
                res_min = 15000;
            }
            res = parseInt(this.innerHTML, 10);
            if ((res >= res_min) && !($(this).hasClass("town_storage_full"))) {
                this.style.color = '#0A0';
            }
            if (res < res_min) {
                this.style.color = '#000';
            }
        });
    }

    /********************************************************************************************************************************
     * Conquest Info
     * -----------------------------------------------------------------------------------------------------------------------------
     * | ● Amount of supports und attacks in the conquest window
     * | ● Layout adjustment (for reasons of clarity)
     * | - TODO: conquest window of own cities
     * -----------------------------------------------------------------------------------------------------------------------------
     * ******************************************************************************************************************************/

    function countMovements() {
        var sup = 0, att = 0;
        $('.tab_content #unit_movements .support').each(function () {
            sup++;
        });
        $('.tab_content #unit_movements .attack_land, .tab_content #unit_movements .attack_sea, .tab_content #unit_movements .attack_takeover').each(function () {
            att++;
        });

        var str = "<div id='move_counter' style=''><div style='float:left;margin-right:5px;'></div>" +
            "<div class='movement def'></div>" +
            "<div class='movement' style='color:green;'> " + sup + "</div>" +
            "<div class='movement off'> </div>" +
            "<div style='color:red;'> " + att + "</div></div>" +
            "<hr class='move_hr'>";

        if ($('.gpwindow_content .tab_content .bold').get(0)) {
            $('.gpwindow_content .tab_content .bold').append(str);
        } else {
            $('.gpwindow_content h4:eq(1)').append(str);

            // TODO: set player link ?
            /*
             $('#unit_movements li div').each(function(){

             //console.log(this.innerHTML);
             });
             */
        }

        $('<style id="dio_conquest"> ' +
            '.move_hr { margin:7px 0px 0px 0px; background-color:#5F5242; height:2px; border:0px solid; } ' +
                // Smaller movements
            '#unit_movements { font-size: 0.80em; } ' +
            '#unit_movements .incoming { width:150px; height:45px; float:left; } ' +
                // Counter
            '#move_counter { position:relative; width:100px; margin-top:-16px; left: 40%; } ' +
            '#move_counter .movement { float:left; margin:0px 5px 0px 0px; height:18px; width:18px; position:relative; } ' +
            '#move_counter .def { background:url(https://gpall.innogamescdn.com/images/game/place/losts.png); background-position:0 -36px; } ' +
            '#move_counter .off { background:url(https://gpall.innogamescdn.com/images/game/place/losts.png); background-position:0 0px; }' +
            '</style>').appendTo("head");

        /*
         $('#unit_movements div').each(function(){
         if($(this).attr('class') === "unit_movements_arrow"){
         // delete placeholder for arrow of outgoing movements (there are no outgoing movements)
         if(!this.style.background) { this.remove(); }
         } else {
         // realign texts
         $(this).css({
         margin: '3px',
         paddingLeft: '3px'
         });
         }
         });
         */
    }

    /*******************************************************************************************************************************
     * Town window
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● TownTabHandler (trade, attack, support,...)
     * | ● Sent units box
     * | ● Short duration: Display of 30% troop speed improvement in attack/support tab
     * | ● Trade options:
     * |    - Ressource marks on possibility of city festivals
     * |    - Percentual Trade: Trade button
     * |    - Recruiting Trade: Selection boxes (ressource ratio of unit type + share of the warehouse capacity of the target town)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var arrival_interval = {};
    // TODO: Change both functions in MultipleWindowHandler()
    function TownTabHandler(action) {
        var wndArray, wndID, wndA;
        wndArray = Layout.wnd.getOpen(uw.Layout.wnd.TYPE_TOWN);
        //console.log(wndArray);
        for (var e in wndArray) {
            if (wndArray.hasOwnProperty(e)) {
                //console.log(wndArray[e].getHandler());
                wndA = wndArray[e].getAction();
                wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                if (!$(wndID).get(0)) {
                    wndID = "#gpwnd_" + (wndArray[e].getID() + 1) + " ";
                }
                //console.log(wndID);
                if (wndA === action) {
                    switch (action) {
                        case "trading":
                            if ($(wndID + '#trade_tab').get(0)) {
                                if (!$(wndID + '.rec_trade').get(0) && DATA.options.rec) {
                                    addRecTrade(wndID);
                                }
                                console.log(DATA.options.per);
                                if (!$(wndID + '.btn_trade').get(0) && DATA.options.per) {
                                    addPercentTrade(wndID, false);
                                }
                            }
                            //addTradeMarks(wndID, 15, 18, 15, "red"); // town festival
                            break;
                        case "support":
                        case "attack":
                            //if(!arrival_interval[wndID]){
                            if (DATA.options.way && !($('.js-casted-powers-viewport .unit_movement_boost').get(0) || $(wndID + '.short_duration').get(0))) {
                                //if(arrival_interval[wndID]) console.log("add " + wndID);
                                ShortDuration.add(wndID);
                            }
                            if (DATA.options.sen) {
                                SentUnits.add(wndID, action);
                            }
                            //}
                            break;
                        case "rec_mark":
                            //addTradeMarks(wndID, 15, 18, 15, "lime");
                            break;
                    }
                }
            }
        }
    }

    function WWTradeHandler() {
        var wndArray, wndID, wndA;
        wndArray = uw.GPWindowMgr.getOpen(uw.GPWindowMgr.TYPE_WONDERS);
        for (var e in wndArray) {
            if (wndArray.hasOwnProperty(e)) {
                wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                if (DATA.options.per && !($(wndID + '.btn_trade').get(0) || $(wndID + '.next_building_phase').get(0) || $(wndID + '#ww_time_progressbar').get(0))) {
                    addPercentTrade(wndID, true);
                }
            }
        }
    }

    /*******************************************************************************************************************************
     * ● Sent units box
     *******************************************************************************************************************************/
    var SentUnits = {
        activate: function () {
            $.Observer(GameEvents.command.send_unit).subscribe('DIO_SEND_UNITS', function (e, data) {
                for (var z in data.params) {
                    if (data.params.hasOwnProperty(z) && (data.sending_type !== "")) {
                        if (uw.GameData.units[z]) {
                            sentUnitsArray[data.sending_type][z] = (sentUnitsArray[data.sending_type][z] == undefined ? 0 : sentUnitsArray[data.sending_type][z]);
                            sentUnitsArray[data.sending_type][z] += data.params[z];
                        }
                    }
                }
                //SentUnits.update(data.sending_type); ????
            });
        },
        deactivate: function () {
            $.Observer(GameEvents.command.send_unit).unsubscribe('DIO_SEND_UNITS');
        },
        add: function (wndID, action) {
            if (!$(wndID + '.sent_units_box').get(0)) {
                $('<div class="game_inner_box sent_units_box ' + action + '"><div class="game_border ">' +
                    '<div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div>' +
                    '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                    '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                    '<div class="game_header bold">' +
                    '<div class="icon_sent townicon_' + (action == "attack" ? "lo" : "ld") + '"></div><span>' + getText("labels", "lab") + ' (' + (action == "attack" ? "OFF" : "DEF") + ')</span>' +
                    '</div>' +
                    '<div class="troops"><div class="units_list"></div><hr style="width: 172px;border: 1px solid rgb(185, 142, 93);margin: 3px 0px 2px -1px;">' +
                    '<div id="btn_sent_units_reset" class="button_new">' +
                    '<div class="left"></div>' +
                    '<div class="right"></div>' +
                    '<div class="caption js-caption">' + getText("buttons", "res") + '<div class="effect js-effect"></div></div>' +
                    '</div>' +
                    '</div></div>').appendTo(wndID + '.attack_support_window');

                SentUnits.update(action);

                $(wndID + '.icon_sent').css({
                    height: '20px',
                    marginTop: '-2px',
                    width: '20px',
                    backgroundPositionY: '-26px',
                    paddingLeft: '0px',
                    marginLeft: '0px'
                });

                $(wndID + '.sent_units_box').css({
                    position: 'absolute',
                    right: '0px',
                    bottom: '16px',
                    width: '192px'
                });
                $(wndID + '.troops').css({padding: '6px 0px 6px 6px'});

                $(wndID + '#btn_sent_units_reset').click(function () {
                    // Overwrite old array
                    sentUnitsArray[action] = {};

                    SentUnits.update(action);
                });
            }
        },
        update: function (action) {
            try {
                // Remove old unit list
                $('.sent_units_box.' + action + ' .units_list').each(function () {
                    this.innerHTML = "";
                });
                // Add new unit list
                for (var x in sentUnitsArray[action]) {
                    if (sentUnitsArray[action].hasOwnProperty(x)) {
                        if ((sentUnitsArray[action][x] || 0) > 0) {
                            $('.sent_units_box.' + action + ' .units_list').each(function () {
                                $(this).append('<div class="unit_icon25x25 ' + x +
                                    (sentUnitsArray[action][x] >= 1000 ? (sentUnitsArray[action][x] >= 10000 ? " five_digit_number" : " four_digit_number") : "") + '">' +
                                    '<span class="count text_shadow">' + sentUnitsArray[action][x] + '</span>' +
                                    '</div>');
                            });
                        }
                    }
                }
                saveValue(WID + "_sentUnits", JSON.stringify(sentUnitsArray));
            } catch (error) {
                errorHandling(error, "updateSentUnitsBox");
            }
        }
    };

    /*******************************************************************************************************************************
     * ● Short duration
     *******************************************************************************************************************************/

    var DurationCalculator = {
        activate: function () {
            var speedBoosterSprite = "https://diotools.de/images/game/speed_booster.png";

            $('<style id="dio_duration_calculator_style">' +
                '.dio_speed_booster { border:1px solid #724B08; border-spacing: 0px;} ' +
                '.dio_speed_booster td { border:0; padding:2px; } ' +
                '.dio_speed_booster .checkbox_new { margin: 4px 0px 1px 3px; } ' +
                '.dio_speed_booster .odd { background: url("https://gpall.innogamescdn.com/images/game/border/brown.png") repeat scroll 0% 0% transparent; } ' +
                '.dio_speed_booster .even { background: url("https://gpall.innogamescdn.com/images/game/border/odd.png") repeat scroll 0% 0% transparent; } ' +
                '.booster_icon { width:20px; height:20px; background-image:url(' + speedBoosterSprite + ');} ' +
                '.booster_icon.improved_speed { background-position:0 0; } ' +
                '.booster_icon.cartography { background-position:-20px 0; } ' +
                '.booster_icon.meteorology { background-position:-40px 0; } ' +
                '.booster_icon.lighthouse { background-position:-60px 0; } ' +
                '.booster_icon.set_sail { background-position:-80px 0; } ' +
                '.booster_icon.atalanta { background-position:-100px 0; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function () {
            $('#dio_duration_calculator_style').remove();
        },
        add: function (wndID, data) {

        }
    };


    // TODO : Style Umstellen!
    var ShortDuration = {
        activate: function () {

        },
        deactivate: function () {

        },
        add: function (wndID) {
            //console.log($(wndID + ".duration_container").get(0));
            try {
                var tooltip = (LANG.hasOwnProperty(LID) ? getText("labels", "improved_movement") : "") + " (+30% " + DM.getl10n("barracks", "tooltips").speed.trim() + ")";

                var speedBoosterSprite = "https://diotools.de/images/game/speed_booster.png";

                $('<table class="dio_duration">' +
                    '<tr><td class="way_icon"></td><td class="dio_way"></td><td class="arrival_icon"></td><td class="dio_arrival"></td><td colspan="2" class="dio_night"></td></tr>' +
                    '<tr class="short_duration_row" style="color:darkgreen">' +
                    '<td>&nbsp;╚&gt;&nbsp;</td><td><span class="short_duration">~0:00:00</span></td>' +
                    '<td>&nbsp;&nbsp;&nbsp;╚&gt;</td><td><span class="short_arrival">~00:00:00</span></td>' +
                    '<td class="short_icon"></td><td></td></tr>' +
                    '</table>').prependTo(wndID + ".duration_container");

                /*
                $('<style id="dio_speed_booster_style">' +
                    '.dio_speed_booster { border:1px solid #724B08; border-spacing: 0px;} ' +
                    '.dio_speed_booster td { border:0; padding:2px; } ' +
                    '.dio_speed_booster .checkbox_new { margin: 4px 0px 1px 3px; } ' +
                    '.dio_speed_booster .odd { background: url("https://gpall.innogamescdn.com/images/game/border/brown.png") repeat scroll 0% 0% transparent; } ' +
                    '.dio_speed_booster .even { background: url("https://gpall.innogamescdn.com/images/game/border/odd.png") repeat scroll 0% 0% transparent; } ' +
                    '.booster_icon { width:20px; height:20px; background-image:url(' + speedBoosterSprite + ');} ' +
                    '.booster_icon.improved_speed { background-position:0 0; } ' +
                    '.booster_icon.cartography { background-position:-20px 0; } ' +
                    '.booster_icon.meteorology { background-position:-40px 0; } ' +
                    '.booster_icon.lighthouse { background-position:-60px 0; } ' +
                    '.booster_icon.set_sail { background-position:-80px 0; } ' +
                    '.booster_icon.atalanta { background-position:-100px 0; } ' +
                    '</style>').appendTo('head');

                $('<table class="dio_speed_booster"><tr>' +
                    '<td class="odd"><div class="booster_icon improved_speed"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                    '<td class="even"><div class="booster_icon cartography"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                    '<td class="odd"><div class="booster_icon meteorology"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                    '<td class="even"><div class="booster_icon lighthouse"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                    '<td class="odd"><div class="booster_icon set_sail"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                    '<td class="even"><div class="booster_icon atalanta"></div><div class="checkbox_new checked"><div class="cbx_icon"></div></div></td>' +
                    '</tr></table>').appendTo(wndID + ".duration_container");
                    
                    */

                $(wndID + ".nightbonus").appendTo(wndID + ".dio_night");
                $(wndID + '.way_duration').appendTo(wndID + ".dio_way");
                $(wndID + ".arrival_time").appendTo(wndID + ".dio_arrival");

                // Style TODO: Umschreiben!
                $(wndID + '.duration_container').css({
                    width: 'auto'
                });
                $(wndID + '.dio_duration').css({
                    borderSpacing: '0px',
                    marginBottom: '2px',
                    textAlign: 'right'
                });
                $(wndID + '.dio_way span,' + wndID + '.dio_arrival span').css({
                    padding: '0px 0px 0px 0px',
                    background: 'none'
                });
                $(wndID + '.short_icon').css({
                    padding: '20px 0px 0px 30px',
                    background: 'url(http://666kb.com/i/ck2c7eohpyfa3yczt.png) 11px -1px / 21px no-repeat',
                    WebkitFilter: 'hue-rotate(50deg)'
                });
                $(wndID + '.way_icon').css({
                    padding: '30px 0px 0px 30px',
                    background: 'transparent url(https://gpall.innogamescdn.com/images/game/towninfo/traveltime.png) no-repeat 0 0'
                });
                $(wndID + '.arrival_icon').css({
                    padding: '30px 0px 0px 30px',
                    background: 'transparent url(https://gpall.innogamescdn.com/images/game/towninfo/arrival.png) no-repeat 0 0'
                });
                $(wndID + '.max_booty').css({
                    padding: '0px 0px 0px 30px',
                    margin: '3px 0 4px 4px',
                    width: 'auto'
                });
                $(wndID + '.fast_boats_needed').css({
                    background: 'transparent url(http://s7.directupload.net/images/140724/4pvfuch8.png) no-repeat 0 0',
                    padding: '2px 10px 7px 24px',
                    margin: '0px 0px 0px 6px'
                });
                $(wndID + '.slow_boats_needed').css({
                    background: 'transparent url(http://s1.directupload.net/images/140724/b5xl8nmj.png) no-repeat 0 0',
                    padding: '2px 10px 7px 24px',
                    margin: '0px 0px 0px 6px'
                });

                // Tooltip
                $(wndID + '.short_duration_row').tooltip(tooltip);

                // Detection of changes
                ShortDuration.change(wndID);
                // $(wndID + '.way_duration').bind('DOMSubtreeModified', function(e) { console.log(e); }); // Alternative

            } catch (error) {
                errorHandling(error, "addShortDuration");
            }
        },
        change: function (wndID) {
            var duration = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes[0]) {
                        //console.log(mutation);
                        ShortDuration.calculate(wndID);
                    }
                });
            });
            if ($(wndID + '.way_duration').get(0)) {
                duration.observe($(wndID + '.way_duration').get(0), {
                    attributes: false,
                    childList: true,
                    characterData: false
                });
            }
        },
        //$('<style> .duration_container { display: block !important } </style>').appendTo("head");
        calculate: function (wndID) {
            //console.log(wndID);
            //console.log($(wndID + '.duration_container .way_duration').get(0));
            try {
                var setup_time = 900 / Game.game_speed,
                    duration_time = $(wndID + '.duration_container .way_duration').get(0).innerHTML.replace("~", "").split(":"),
                // TODO: hier tritt manchmal Fehler auf TypeError: Cannot read property "innerHTML" of undefined at calcShortDuration (<anonymous>:3073:86)
                    arrival_time,
                    h, m, s,
                    atalanta_factor = 0;

                var hasCartography = ITowns.getTown(Game.townId).getResearches().get("cartography");
                var hasMeteorology = ITowns.getTown(Game.townId).getResearches().get("meteorology");
                var hasSetSail = ITowns.getTown(Game.townId).getResearches().get("set_sail");

                var hasLighthouse = ITowns.getTown(Game.townId).buildings().get("lighthouse");

                // Atalanta aktiviert?
                if ($(wndID + '.unit_container.heroes_pickup .atalanta').get(0)) {
                    if ($(wndID + '.cbx_include_hero').hasClass("checked")) {
                        // Beschleunigung hängt vom Level ab, Level 1 = 11%, Level 20 = 30%
                        var atalanta_level = MM.getCollections().PlayerHero[0].models[1].get("level");

                        atalanta_factor = (atalanta_level + 10) / 100;
                    }
                }

                // Sekunden, Minuten und Stunden zusammenrechnen (-> in Sekunden)
                duration_time = ((parseInt(duration_time[0], 10) * 60 + parseInt(duration_time[1], 10)) * 60 + parseInt(duration_time[2], 10));

                // Verkürzte Laufzeit berechnen
                duration_time = ((duration_time - setup_time) * (1 + atalanta_factor)) / (1 + 0.3 + atalanta_factor) + setup_time;


                h = Math.floor(duration_time / 3600);
                m = Math.floor((duration_time - h * 3600) / 60);
                s = Math.floor(duration_time - h * 3600 - m * 60);

                if (m < 10) {
                    m = "0" + m;
                }
                if (s < 10) {
                    s = "0" + s;
                }

                $(wndID + '.short_duration').get(0).innerHTML = "~" + h + ":" + m + ":" + s;

                // Ankunftszeit errechnen
                arrival_time = Math.round((Timestamp.server() + Game.server_gmt_offset)) + duration_time;

                h = Math.floor(arrival_time / 3600);
                m = Math.floor((arrival_time - h * 3600) / 60);
                s = Math.floor(arrival_time - h * 3600 - m * 60);

                h %= 24;

                if (m < 10) {
                    m = "0" + m;
                }
                if (s < 10) {
                    s = "0" + s;
                }

                $(wndID + '.short_arrival').get(0).innerHTML = "~" + h + ":" + m + ":" + s;

                clearInterval(arrival_interval[wndID]);

                arrival_interval[wndID] = setInterval(function () {
                    arrival_time += 1;

                    h = Math.floor(arrival_time / 3600);
                    m = Math.floor((arrival_time - h * 3600) / 60);
                    s = Math.floor(arrival_time - h * 3600 - m * 60);

                    h %= 24;

                    if (m < 10) {
                        m = "0" + m;
                    }
                    if (s < 10) {
                        s = "0" + s;
                    }

                    if ($(wndID + '.short_arrival').get(0)) {
                        $(wndID + '.short_arrival').get(0).innerHTML = "~" + h + ":" + m + ":" + s;
                    } else {
                        clearInterval(arrival_interval[wndID]);
                    }
                }, 1000);

            } catch (error) {
                errorHandling(error, "ShortDuration.calculate");
            }
        }
    };

    /*******************************************************************************************************************************
     * ● Dropdown menu
     *******************************************************************************************************************************/

    // TODO: Umstellen!
    // Preload images for drop down arrow buttons
    var drop_over = new Image();
    drop_over.src = "http://s7.directupload.net/images/140107/hna95u8a.png";
    var drop_out = new Image();
    drop_out.src = "http://s14.directupload.net/images/140107/ppsz5mxk.png";

    function changeDropDownButton() {
         $('<style id="dio_style_arrow" type="text/css">' +
         '#dd_filter_type .arrow, .select_rec_unit .arrow {' +
         'width: 18px !important; height: 17px !important; background: url("http://s14.directupload.net/images/140107/ppsz5mxk.png") no-repeat 0px -1px !important;' +
         'position: absolute; top: 2px !important; right: 3px; } ' +
         '</style>').appendTo('head');

    }

    /*******************************************************************************************************************************
     * ● Recruiting Trade
     * *****************************************************************************************************************************/
    var trade_count = 0, unit = "FS", percent = "0.0"; // Recruiting Trade

    function addRecTrade(wndID) {
        var max_amount;

        $('<div class="rec_trade">' +
                // DropDown-Button for unit
            '<div class="drop_rec_unit dropdown default">' +
            '<div class="border-left"></div>' +
            '<div class="border-right"></div>' +
            '<div class="caption" name="' + unit + '">' + unit + '</div>' +
            '<div class="arrow"></div>' +
            '</div>' +
            '<div class="drop_rec_perc dropdown default">' +
                // DropDown-Button for ratio
            '<div class="border-left"></div>' +
            '<div class="border-right"></div>' +
            '<div class="caption" name="' + percent + '">' + Math.round(percent * 100) + '%</div>' +
            '<div class="arrow"></div>' +
            '</div></div><span class="rec_count" style="top:30px">(' + trade_count + ')</span>').appendTo(wndID + ".content");

        // Select boxes for unit and ratio
        $('<div class="select_rec_unit dropdown-list default active">' +
            '<div class="item-list">' +
            '<div class="option_s unit index_unit unit_icon40x40 attack_ship" name="FS"></div>' +
            '<div class="option_s unit index_unit unit_icon40x40 bireme" name="BI"></div>' +
            '<div class="option_s unit index_unit unit_icon40x40 sword" name="SK"></div>' +
            '<div class="option_s unit index_unit unit_icon40x40 slinger" name="SL"></div>' +
            '<div class="option_s unit index_unit unit_icon40x40 archer" name="BS"></div>' +
            '<div class="option_s unit index_unit unit_icon40x40 hoplite" name="HO"></div>' +
            '<div class="option_s unit index_unit unit_icon40x40 rider" name="RE"></div>' +
            '<div class="option_s unit index_unit unit_icon40x40 chariot" name="SW"></div>' +
            '</div></div>').appendTo(wndID + ".rec_trade");
        $('<div class="select_rec_perc dropdown-list default inactive">' +
            '<div class="item-list">' +
            '<div class="option sel" name="0.0">&nbsp;&nbsp;0%</div>' +
            '<div class="option" name="0.05">&nbsp;&nbsp;5%</div>' +
            '<div class="option" name="0.1">10%</div>' +
            '<div class="option" name="0.16666">17%</div>' +
            '<div class="option" name="0.2">20%</div>' +
            '<div class="option" name="0.25">25%</div>' +
            '<div class="option" name="0.33">33%</div>' +
            '<div class="option" name="0.5">50%</div>' +
            '</div></div>').appendTo(wndID + ".rec_trade");

        $(wndID + ".rec_trade [name='" + unit + "']").toggleClass("sel");

        // Styles
        $(wndID + '.rec_trade').css({position: 'absolute', left: '30px', top: '70px'});
        $(wndID + '.select_rec_unit').css({
            position: 'absolute',
            top: '20px',
            width: '84px',
            display: "none"
        });
        $(wndID + '.select_rec_perc').css({
            position: 'absolute',
            left: '50px',
            top: '20px',
            width: '50px',
            display: "none"
        });
        $(wndID + '.item-list').css({maxHeight: '400px', maxWidth: '200px', align: "right"});

        $(wndID + '.arrow').css({
            width: '18px',
            height: '18px',
            background: 'url(' + drop_out.src + ') no-repeat -1px -1px',
            position: 'absolute'
        });

        $(wndID + '.option_s').css({
            filter: "url(#GrayScale)",
            WebkitFilter: "grayscale(100%)",
            cursor: 'pointer',
            color: 'black',
            lineHeight: '14px',
            float: 'left',

            position: 'relative',
            width: '40px',
            margin: '0px',
            padding: '0px'
        });

        $('.select_rec_unit .sel').css({"filter": "url(#Sepia)", "-webkit-filter": "sepia(100%)"});

        // hover effects of the elements in the drop menus
        $(wndID + '.option_s').hover(
            function () {
                //console.log(this.className);
                $(this).css({"filter": "none", "-webkit-filter": "grayscale(0%) sepia(0%)"});
                if (!($(this).hasClass("sel"))) {
                    $('.option_s .sel').css({"filter": "url(#Sepia)", "-webkit-filter": "grayscale(0%) sepia(100%)"});
                }
            },
            function () {
                $('.select_rec_unit .option_s').css({
                    "filter": "url(#GrayScale)",
                    "-webkit-filter": "grayscale(100%) sepia(0%)"
                });
                $('.select_rec_unit .sel').css({
                    "filter": "url(#Sepia)",
                    "-webkit-filter": "grayscale(0%) sepia(100%)"
                });
            }
        );
        $(wndID + '.option').hover(
            function () {
                $(this).css({color: '#fff', background: "#328BF1"});
            },
            function () {
                $(this).css({color: '#000', background: "#FFEEC7"});
            }
        );

        // click events of the drop menu
        $(wndID + ' .select_rec_unit .option_s').each(function () {
            $(this).click(function (e) {
                $(".select_rec_unit .sel").toggleClass("sel");
                $("." + this.className.split(" ")[4]).toggleClass("sel");

                unit = $(this).attr("name");
                $('.drop_rec_unit .caption').attr("name", unit);
                $('.drop_rec_unit .caption').each(function () {
                    this.innerHTML = unit;
                });
                $(this).parent().parent().get(0).style.display = "none";
                $('.drop_rec_unit .caption').change();
            });
        });
        $(wndID + ' .select_rec_perc .option').each(function () {
            $(this).click(function (e) {
                $(this).parent().find(".sel").toggleClass("sel");
                $(this).toggleClass("sel");

                percent = $(this).attr("name");
                $('.drop_rec_perc .caption').attr("name", percent);
                $('.drop_rec_perc .caption').each(function () {
                    this.innerHTML = Math.round(percent * 100) + "%";
                });
                $(this).parent().parent().get(0).style.display = "none";
                $('.drop_rec_perc .caption').change();
            });
        });

        // show & hide drop menus on click
        $(wndID + '.drop_rec_perc').click(function (e) {
            if ($(e.target)[0].parentNode.parentNode.childNodes[3].style.display === "none") {
                $(e.target)[0].parentNode.parentNode.childNodes[3].style.display = "block";
                $(e.target)[0].parentNode.parentNode.childNodes[2].style.display = "none";
            } else {
                $(e.target)[0].parentNode.parentNode.childNodes[3].style.display = "none";
            }
        });
        $(wndID + '.drop_rec_unit').click(function (e) {
            if ($(e.target)[0].parentNode.parentNode.childNodes[2].style.display === "none") {
                $(e.target)[0].parentNode.parentNode.childNodes[2].style.display = "block";
                $(e.target)[0].parentNode.parentNode.childNodes[3].style.display = "none";
            } else {
                $(e.target)[0].parentNode.parentNode.childNodes[2].style.display = "none";
            }
        });

        $(wndID).click(function (e) {
            var clicked = $(e.target), element = $('#' + this.id + ' .select_rec_unit').get(0);
            if ((clicked[0].parentNode.className.split(" ")[1] !== "dropdown") && element) {
                element.style.display = "none";
            }
        });

        // hover arrow change
        $(wndID + '.dropdown').hover(function (e) {
            $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_over.src + "') no-repeat -1px -1px";
        }, function (e) {
            $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_out.src + "') no-repeat -1px -1px";
        });

        $(wndID + ".drop_rec_unit .caption").attr("name", unit);
        $(wndID + ".drop_rec_perc .caption").attr("name", percent);

        $(wndID + '.drop_rec_unit').tooltip(getText("labels", "rat"));
        $(wndID + '.drop_rec_perc').tooltip(getText("labels", "shr"));

        var ratio = {
            NO: {w: 0, s: 0, i: 0},
            FS: {w: 1, s: 0.2308, i: 0.6154},
            BI: {w: 1, s: 0.8750, i: 0.2250},
            SL: {w: 0.55, s: 1, i: 0.4},
            RE: {w: 0.6666, s: 0.3333, i: 1},
            SK: {w: 1, s: 0, i: 0.8947},
            HO: {w: 0, s: 0.5, i: 1},
            BS: {w: 1, s: 0, i: 0.6250},
            SW: {w: 0.4545, s: 1, i: 0.7273}
        };


        if ($('#town_capacity_wood .max').get(0)) {
            max_amount = parseInt($('#town_capacity_wood .max').get(0).innerHTML, 10);
        } else {
            max_amount = 25500;
        }

        $(wndID + '.caption').change(function (e) {
            //console.log($(this).attr('name') + ", " + unit + "; " + percent);
            if (!(($(this).attr('name') === unit) || ($(this).attr('name') === percent))) {
                //trade_count = 0;
                $('.rec_count').get(0).innerHTML = "(" + trade_count + ")";
            }

            var tmp = $(this).attr('name');

            if ($(this).parent().attr('class').split(" ")[0] === "drop_rec_unit") {
                unit = tmp;
            } else {
                percent = tmp;
            }
            var max = (max_amount - 100) / 1000;
            addTradeMarks(max * ratio[unit].w, max * ratio[unit].s, max * ratio[unit].i, "lime");

            var part = (max_amount - 1000) * parseFloat(percent); // -1000 als Puffer (sonst Überlauf wegen Restressies, die nicht eingesetzt werden können, vorallem bei FS und Biremen)
            var rArray = uw.ITowns.getTown(uw.Game.townId).getCurrentResources();
            var tradeCapacity = uw.ITowns.getTown(uw.Game.townId).getAvailableTradeCapacity();

            var wood = ratio[unit].w * part;
            var stone = ratio[unit].s * part;
            var iron = ratio[unit].i * part;

            if ((wood > rArray.wood) || (stone > rArray.stone) || (iron > rArray.iron) || ( (wood + stone + iron) > tradeCapacity)) {
                wood = stone = iron = 0;
                $('.drop_rec_perc .caption').css({color: '#f00'});
                //$('.' + e.target.parentNode.parentNode.className + ' .select_rec_perc .sel').css({color:'#f00'});
                //$('.select_rec_perc .sel').css({color:'#f00'});
            } else {
                $('.' + e.target.parentNode.parentNode.className + ' .drop_rec_perc .caption').css({color: '#000'});
            }
            $("#trade_type_wood [type='text']").select().val(wood).blur();
            $("#trade_type_stone [type='text']").select().val(stone).blur();
            $("#trade_type_iron [type='text']").select().val(iron).blur();
        });

        $('#trade_button').click(function () {
            trade_count++;
            $('.rec_count').get(0).innerHTML = "(" + trade_count + ")";

        });

        $(wndID + '.rec_count').css({
            position: 'absolute',
            display: 'block',
            left: '33px',
            top: '95px',
            width: '20px'
        });
        $(wndID + '.drop_rec_unit').css({
            position: 'absolute',
            display: 'block',
            width: '50px',
            overflow: 'visible'
        });
        $(wndID + '.drop_rec_perc').css({
            position: 'absolute',
            display: 'block',
            left: '49px',
            width: '55px',
            color: '#000'
        });
        $(wndID + '.drop_rec_perc .caption').change();
    }

    /*******************************************************************************************************************************
     * ● Ressources marks
     *******************************************************************************************************************************/
    function addTradeMarks(woodmark, stonemark, ironmark, color) {
        var max_amount, limit, wndArray = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_TOWN), wndID;
        for (var e in wndArray) {
            if (wndArray.hasOwnProperty(e)) {
                wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                if ($(wndID + '.town-capacity-indicator').get(0)) {

                    max_amount = $(wndID + '.amounts .max').get(0).innerHTML;

                    $('#trade_tab .c_' + color).each(function () {
                        this.remove();
                    });
                    $('#trade_tab .progress').each(function () {
                        if ($("p", this).length < 3) {
                            if ($(this).parent().get(0).id != "big_progressbar") {
                                limit = 1000 * (242 / parseInt(max_amount, 10));

                                switch ($(this).parent().get(0).id.split("_")[2]) {
                                    case "wood":
                                        limit = limit * woodmark;
                                        break;
                                    case "stone":
                                        limit = limit * stonemark;
                                        break;
                                    case "iron":
                                        limit = limit * ironmark;
                                        break;
                                }
                                $('<p class="c_' + color + '"style="position:absolute;left: ' + limit + 'px; background:' + color + ';width:2px;height:100%;margin:0px"></p>').appendTo(this);
                            }
                        }
                    });
                }
            }
        }
    }

    /*******************************************************************************************************************************
     * ● Percentual Trade
     *******************************************************************************************************************************/
    var rest_count = 0;

    function addPercentTrade(wndID, ww) {

        var a = "";
        var content = wndID + ".content";
        if (ww) {
            a = "ww_";
            content = wndID + '.trade .send_res';
        }
        $('<div class="btn btn_trade"><a class="button" href="#">' +
            '<span class="left"><span class="right">' +
            '<span class="middle mid">' +
            '<span class="img_trade"></span></span></span></span>' +
            '<span style="clear:both;"></span>' +
            '</a></div>').prependTo(content);

        $(wndID + '.btn_trade').tooltip(getText("labels", "per"));

        setPercentTrade(wndID, ww);

        // Style
        $(wndID + '.btn').css({width: '20px', overflow: 'visible', position: 'absolute', display: 'block'});

        if (!ww) {
            $(wndID + '.content').css({height: '320px'});
        }

        if (ww) {
            $(wndID + '.btn_trade').css({left: '678px', top: '154px'});
        } else {
            $(wndID + '.btn_trade').css({left: '336px', top: '135px'});
        }

        $(wndID + '.mid').css({minWidth: '26px'});

        $(wndID + '.img_trade').css({
            width: '27px',
            height: '27px',
            top: '-3px',
            float: 'left',
            position: 'relative',
            background: 'url("http://666kb.com/i/cjq6d72qk521ig1zz.png") no-repeat'
        });

    }

    var res = {};

    function setPercentTrade(wndID, ww) {
        var a = ww ? "ww_" : "", own_town = $(wndID + '.town_info').get(0) ? true : false;

        $(wndID + '.btn_trade').toggleClick(function () {
            res.wood = {};
            res.stone = {};
            res.iron = {};
            res.sum = {};

            res.sum.amount = 0;
            // Set amount of resources to 0
            setAmount(true, a, wndID);
            // Total amount of resources // TODO: ITowns.getTown(Game.townId).getCurrentResources(); ?
            for (var e in res) {
                if (res.hasOwnProperty(e) && e != "sum") {
                    res[e].rest = false;
                    res[e].amount = parseInt($('.ui_resources_bar .' + e + ' .amount').get(0).innerHTML, 10);
                    res.sum.amount += res[e].amount;
                }
            }
            // Percentage of total resources
            res.wood.percent = 100 / res.sum.amount * res.wood.amount;
            res.stone.percent = 100 / res.sum.amount * res.stone.amount;
            res.iron.percent = 100 / res.sum.amount * res.iron.amount;

            // Total trading capacity
            res.sum.cur = parseInt($(wndID + '#' + a + 'big_progressbar .caption .curr').get(0).innerHTML, 10);

            // Amount of resources on the percentage of trading capacity (%)
            res.wood.part = parseInt(res.sum.cur / 100 * res.wood.percent, 10);
            res.stone.part = parseInt(res.sum.cur / 100 * res.stone.percent, 10);
            res.iron.part = parseInt(res.sum.cur / 100 * res.iron.percent, 10);

            // Get rest warehouse capacity of each resource type
            for (var f in res) {
                if (res.hasOwnProperty(f) && f != "sum") {
                    if (!ww && own_town) { // Own town
                        var curr = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .curr').get(0).innerHTML.replace('+', '').trim(), 10) || 0,
                            curr2 = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .curr2').get(0).innerHTML.replace('+', '').trim(), 10) || 0,
                            max = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .max').get(0).innerHTML.replace('+', '').trim(), 10) || 0;

                        res[f].cur = curr + curr2;
                        res[f].max = max - res[f].cur;

                        if (res[f].max < 0) {
                            res[f].max = 0;
                        }

                    } else { // World wonder or foreign town
                        res[f].max = 30000;
                    }
                }
            }
            // Rest of fraction (0-2 units) add to stone amount
            res.stone.part += res.sum.cur - (res.wood.part + res.stone.part + res.iron.part);

            res.sum.rest = 0;
            rest_count = 0;
            calcRestAmount();
            setAmount(false, a, wndID);
        }, function () {
            setAmount(true, a, wndID);
        });
    }

    function calcRestAmount() {
        // Subdivide rest
        if (res.sum.rest > 0) {
            for (var e in res) {
                if (res.hasOwnProperty(e) && e != "sum" && res[e].rest != true) {
                    res[e].part += res.sum.rest / (3 - rest_count);
                }
            }
            res.sum.rest = 0;
        }
        // Calculate new rest
        for (var f in res) {
            if (res.hasOwnProperty(f) && f != "sum" && res[f].rest != true) {
                if (res[f].max <= res[f].part) {
                    res[f].rest = true;
                    res.sum.rest += res[f].part - res[f].max;
                    rest_count += 1;
                    res[f].part = res[f].max;
                }
            }
        }
        // Recursion
        if (res.sum.rest > 0 && rest_count < 3) {
            calcRestAmount();
        }
    }

    function setAmount(clear, a, wndID) {
        for (var e in res) {
            if (res.hasOwnProperty(e) && e != "sum") {
                if (clear == true) {
                    res[e].part = 0;
                }
                $(wndID + "#" + a + "trade_type_" + e + ' [type="text"]').select().val(res[e].part).blur();
            }
        }
    }

    /********************************************************************************************************************************
     * Unit strength (blunt/sharp/distance) and Transport Capacity
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Unit strength: Menu
     * |	- Switching of def/off display with buttons
     * |	- Possible Selection of certain unit types
     * | ● Unit strength: Conquest
     * | ● Unit strength: Barracks
     * | ● Transport capacity: Menu
     * |	- Switching of transporter speed (+/- big transporter)
     * ----------------------------------------------------------------------------------------------------------------------------
     * ******************************************************************************************************************************/

    var def = true, blunt = 0, sharp = 0, dist = 0, shipsize = false;

    var UnitStrength = {
        // Calculate defensive strength
        calcDef: function (units) {
            var e;
            blunt = sharp = dist = 0;
            for (e in units) {
                if (units.hasOwnProperty(e)) {
                    blunt += units[e] * uw.GameData.units[e].def_hack;
                    sharp += units[e] * uw.GameData.units[e].def_pierce;
                    dist += units[e] * uw.GameData.units[e].def_distance;
                }
            }
        },
        // Calculate offensive strength
        calcOff: function (units, selectedUnits) {
            var e;
            blunt = sharp = dist = 0;
            for (e in selectedUnits) {
                if (selectedUnits.hasOwnProperty(e)) {
                    var attack = (units[e] || 0) * uw.GameData.units[e].attack;
                    switch (uw.GameData.units[e].attack_type) {
                        case 'hack':
                            blunt += attack;
                            break;
                        case 'pierce':
                            sharp += attack;
                            break;
                        case 'distance':
                            dist += attack;
                            break;
                    }
                }
            }
        },
        /*******************************************************************************************************************************
         * ● Unit strength: Unit menu
         *******************************************************************************************************************************/
        Menu: {
            activate: function () {
                $('<div id="strength" class="cont def"><hr>' +
                    '<span class="bold text_shadow cont_left strength_font">' +
                    '<table style="margin:0px;">' +
                    '<tr><td><div class="ico units_info_sprite img_hack"></td><td id="blunt">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_pierce"></td><td id="sharp">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_dist"></td><td id="dist">0</td></tr>' +
                    '</table>' +
                    '</span>' +
                    '<div class="cont_right">' +
                    '<img id="def_button" class="active img" src="https://gpall.innogamescdn.com/images/game/unit_overview/support.png">' +
                    '<img id="off_button" class="img" src="https://gpall.innogamescdn.com/images/game/unit_overview/attack.png">' +
                    '</div></div>').appendTo('.units_land .content');

                // Style
                $('<style id="dio_strength_style">' +
                    '#strength.def #off_button, #strength.off #def_button { filter:url(#Sepia); -webkit-filter:sepia(1); }' +
                    '#strength.off #off_button, #strength.def #def_button { filter:none; -webkit-filter:none; } ' +

                    '#strength.off .img_hack { background-position:0% 36%;} ' +
                    '#strength.def .img_hack { background-position:0%  0%;} ' +
                    '#strength.off .img_pierce { background-position:0% 27%;} ' +
                    '#strength.def .img_pierce { background-position:0%  9%;} ' +
                    '#strength.off .img_dist { background-position:0% 45%;} ' +
                    '#strength.def .img_dist { background-position:0% 18%;} ' +

                    '#strength .strength_font { font-size: 0.8em; } ' +
                    '#strength.off .strength_font { color:#edb;} ' +
                    '#strength.def .strength_font { color:#fc6;} ' +

                    '#strength .ico { height:20px; width:20px; } ' +
                    '#strength .units_info_sprite { background:url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png); background-size:100%; } ' +

                    '#strength .img_pierce { background-position:0px -20px; } ' +
                    '#strength .img_dist { background-position:0px -40px; } ' +
                    '#strength hr { margin:0px; background-color:#5F5242; height:2px; border:0px solid; } ' +
                    '#strength .cont_left { width:65%;  display:table-cell; } ' +

                    '#strength.cont { background:url(https://gpall.innogamescdn.com/images/game/layout/layout_units_nav_border.png); } ' +

                    '#strength .cont_right { width:30%; display:table-cell; vertical-align:middle; } ' +
                    '#strength .img { float:right; background:none; margin:2px 8px 2px 0px; } ' +

                    '</style>').appendTo("head");

                // Button events
                $('.units_land .units_wrapper, .btn_gods_spells .checked').click(function () {
                    setTimeout(function () {
                        UnitStrength.Menu.update();
                    }, 100);
                });

                $('#off_button').click(function () {
                    $('#strength').addClass('off').removeClass('def');

                    def = false;
                    UnitStrength.Menu.update();
                });
                $('#def_button').click(function () {
                    $('#strength').addClass('def').removeClass('off');

                    def = true;
                    UnitStrength.Menu.update();
                });
                $('#def_button, #off_button').hover(function () {
                    $(this).css('cursor', 'pointer');
                });

                UnitStrength.Menu.update();
            },
            deactivate: function () {
                $('#strength').remove();
                $('#dio_strength_style').remove();
            },
            update: function () {
                var unitsIn = uw.ITowns.getTown(uw.Game.townId).units(), units = UnitStrength.Menu.getSelected();

                // Calculation
                if (def === true) {
                    UnitStrength.calcDef(units);
                } else {
                    UnitStrength.calcOff(unitsIn, units);
                }
                $('#blunt').get(0).innerHTML = blunt;
                $('#sharp').get(0).innerHTML = sharp;
                $('#dist').get(0).innerHTML = dist;
            },
            getSelected: function () {
                var units = [];
                if ($(".units_land .units_wrapper .selected").length > 0) {
                    $(".units_land .units_wrapper .selected").each(function () {
                        units[this.className.split(" ")[1]] = this.children[0].innerHTML;
                    });
                } else {
                    $(".units_land .units_wrapper .unit").each(function () {
                        units[this.className.split(" ")[1]] = this.children[0].innerHTML;
                    });
                }
                return units;
            }
        },
        /*******************************************************************************************************************************
         * ● Unit strength: Conquest
         *******************************************************************************************************************************/
        Conquest: {
            add: function () {
                var units = [], str;

                // units of the siege
                $('#conqueror_units_in_town .unit').each(function () {
                    str = $(this).attr("class").split(" ")[4];
                    if (!uw.GameData.units[str].is_naval) {
                        units[str] = parseInt(this.children[0].innerHTML, 10);
                        //console.log($(this).attr("class").split(" ")[4]);
                    }
                });
                // calculation
                UnitStrength.calcDef(units);

                $('<div id="strength_eo" class="game_border" style="width:90px; margin: 20px; align:center;">' +
                    '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                    '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                    '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                    '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                    '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                    '<tr><td width="1%"><div class="ico units_info_sprite img_hack"></div></td><td id="bl" align="center" width="100%">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_pierce"></div></td><td id="sh" align="center">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_dist"></div></td><td id="di" align="center">0</td></tr>' +
                    '</table></span>' +
                    '</div>').appendTo('#conqueror_units_in_town');

                $('#strength_eo').tooltip('Gesamteinheitenstärke der Belagerungstruppen');

                // Veröffentlichung-Button-Text
                $('#conqueror_units_in_town .publish_conquest_public_id_wrap').css({
                    marginLeft: '130px'
                });

                $('#strength_eo .ico').css({
                    height: '20px',
                    width: '20px'
                });
                $('#strength_eo .units_info_sprite').css({
                    background: 'url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)',
                    backgroundSize: '100%'
                });
                $('#strength_eo .img_pierce').css({backgroundPosition: '0% 9%'});
                $('#strength_eo .img_dist').css({backgroundPosition: '0% 18%'});


                $('#bl').get(0).innerHTML = blunt;
                $('#sh').get(0).innerHTML = sharp;
                $('#di').get(0).innerHTML = dist;
            }
        },
        /*******************************************************************************************************************************
         * ● Unit strength: Barracks
         *******************************************************************************************************************************/
        Barracks: {
            add: function () {
                if (!$('#strength_baracks').get(0)) {
                    var units = [], pop = 0;

                    // whole units of the town
                    $('#units .unit_order_total').each(function () {
                        units[$(this).parent().parent().attr("id")] = this.innerHTML;
                    });
                    // calculation
                    UnitStrength.calcDef(units);

                    // population space of the units
                    for (var e in units) {
                        if (units.hasOwnProperty(e)) {
                            pop += units[e] * uw.GameData.units[e].population;
                        }
                    }
                    $('<div id="strength_baracks" class="game_border" style="float:right; width:70px; align:center;">' +
                        '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                        '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                        '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                        '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                        '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                        '<tr><td width="1%"><div class="ico units_info_sprite img_hack"></div></td><td id="b" align="center" width="100%">0</td></tr>' +
                        '<tr><td><div class="ico units_info_sprite img_pierce"></div></td><td id="s" align="center">0</td></tr>' +
                        '<tr><td><div class="ico units_info_sprite img_dist"></div></td><td id="d" align="center">0</td></tr>' +
                        '</table></span>' +
                        '</div>').appendTo('.ui-dialog #units');

                    $('<div id="pop_baracks" class="game_border" style="float:right; width:60px; align:center;">' +
                        '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                        '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                        '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                        '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                        '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                        '<tr><td width="1%"><img class="ico" src="https://gpall.innogamescdn.com/images/game/res/pop.png"></td><td id="p" align="center" width="100%">0</td></tr>' +
                        '</table></span>' +
                        '</div>').appendTo('.ui-dialog #units');

                    $('.ui-dialog #units .ico').css({
                        height: '20px',
                        width: '20px'
                    });
                    $('.ui-dialog #units .units_info_sprite').css({
                        background: 'url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)',
                        backgroundSize: '100%'
                    });
                    $('.ui-dialog #units .img_pierce').css({backgroundPosition: '0% 9%'});
                    $('.ui-dialog #units .img_dist').css({backgroundPosition: '0% 18%'});

                    //$('#pop_baracks').tooltip('Bevölkerungszahl aller Landeinheiten der Stadt');
                    //$('#strength_baracks').tooltip('Gesamteinheitenstärke stadteigener Truppen');

                    $('#b').get(0).innerHTML = blunt;
                    $('#s').get(0).innerHTML = sharp;
                    $('#d').get(0).innerHTML = dist;
                    $('#p').get(0).innerHTML = pop;
                }
            }
        }
    };

    /*******************************************************************************************************************************
     * ● Transporter capacity
     *******************************************************************************************************************************/
    var TransportCapacity = {
        activate: function () {
            // transporter display
            $('<div id="transporter" class="cont" style="height:25px;">' +
                '<table style=" margin:0px;"><tr align="center" >' +
                '<td><img id="ship_img" class="ico" src="http://s7.directupload.net/images/140724/4pvfuch8.png"></td>' +
                '<td><span id="ship" class="bold text_shadow" style="color:#FFCC66;font-size: 10px;line-height: 2.1;"></span></td>' +
                '</tr></table>' +
                '</div>').appendTo('.units_naval .content');

            $('#transporter.cont').css({
                background: 'url(https://gpall.innogamescdn.com/images/game/layout/layout_units_nav_border.png)'
            });

            $('#transporter').hover(function () {
                $(this).css('cursor', 'pointer');
            });
            $('#transporter').toggleClick(
                function () {
                    $('#ship_img').get(0).src = "http://s1.directupload.net/images/140724/b5xl8nmj.png";
                    shipsize = !shipsize;
                    TransportCapacity.update();
                },
                function () {
                    $('#ship_img').get(0).src = "http://s7.directupload.net/images/140724/4pvfuch8.png";
                    shipsize = !shipsize;
                    TransportCapacity.update();
                }
            );
            TransportCapacity.update();
        },
        deactivate: function () {
            $('#transporter').remove();
        },
        update: function () {
            var bigTransp = 0, smallTransp = 0, pop = 0, ship = 0, unit, berth, units = [];
            // Ship space (available)
            smallTransp = parseInt(uw.ITowns.getTown(parseInt(uw.Game.townId, 10)).units().small_transporter, 10);
            if (isNaN(smallTransp)) smallTransp = 0;
            if (shipsize) {
                bigTransp = parseInt(uw.ITowns.getTown(parseInt(uw.Game.townId, 10)).units().big_transporter, 10);
                if (isNaN(bigTransp)) bigTransp = 0;
            }

            // Checking: Research berth
            berth = 0;
            if (uw.ITowns.getTown(uw.Game.townId).researches().hasBerth()) {
                berth = GameData.research_bonus.berth;
            }
            ship = bigTransp * (GameData.units.big_transporter.capacity + berth) + smallTransp * (GameData.units.small_transporter.capacity + berth);

            units = uw.ITowns.getTown(uw.Game.townId).units();

            // Ship space (required)
            for (var e in units) {
                if (units.hasOwnProperty(e)) {
                    if (uw.GameData.units[e]) { // without Heroes
                        if (!(uw.GameData.units[e].is_naval || uw.GameData.units[e].flying)) {
                            pop += units[e] * uw.GameData.units[e].population;
                        }
                    }
                }
            }
            $('#ship').get(0).innerHTML = pop + "/" + ship;
        }
    };


    /*******************************************************************************************************************************
     * Simulator
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Layout adjustment
     * | ● Permanent display of the extended modifier box
     * | ● Unit strength for entered units (without modificator influence yet)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var Simulator = {
        activate: function () {
            $('<style id="dio_simulator" type="text/css">' +

                '#place_simulator { overflow: hidden !important} ' +
                '#place_simulator .game_body { height: 457px !important} ' +

                    // Bonus container
                '.place_sim_bonuses_heroes { position:absolute; right:-20px; top:24px; width: 300px;} ' +
                '.place_sim_bonuses_heroes .place_sim_showhide { display:none; } ' + // Hide modifier box button


                    //'.place_sim_wrap_mods {position: relative; right: -17px !important} '+
                '.place_sim_wrap_mods .place_simulator_table :eq(1) { width: 300px;} ' + ////////////// genauer!
                '.place_sim_wrap_mods > .place_simulator_table { width: 272px;} ' + ////////////// genauer!

                    // Wall losses
                '.place_sim_wrap_mods tr:last-child { display:none; } ' +

                    // Extended modifier box
                    //'@-webkit-keyframes 	MODBOX { 0% { opacity: 0; } 100% { opacity: 1; } } '+
                    //'@keyframes 			MODBOX { 0% { opacity: 0; } 100% { opacity: 1; } } '+

                '.place_sim_wrap_mods_extended { display: table-cell !important; -webkit-animation:MODBOX 1s; animation:MODBOX 1s; position: relative; width:272px; padding-top: 3px; opacity: 1 !important; left: 0px; top: 0px} ' +
                '.place_sim_wrap_mods_extended table tr td:eq(0) { width: 18px !important } ' +
                '.place_sim_wrap_mods_extended td { border:0px; } ' +
                '.place_sim_wrap_mods_extended tr td:first-child { border-left:0px; width:19px; padding-left:0px; } ' +
                '.place_sim_wrap_mods_extended .place_simulator_table { border:0; margin:2px; border-collapse:separate; border:1px solid #724B08; table-layout:fixed; width:100% } ' +

                '.place_simulator_table .place_image { display:block; width: 20px; height:20px; background-size:100%; margin:auto; } ' +

                '.place_simulator_table .place_image.pa_commander { background: url(https://diotools.de/images/game/advisors/advisors_22.png); background-position: 0px 44px; } ' +
                '.place_simulator_table .place_image.pa_captain { background: url(https://diotools.de/images/game/advisors/advisors_22.png); background-position: 0px 88px; } ' +
                '.place_simulator_table .place_image.pa_priest { background: url(https://diotools.de/images/game/advisors/advisors_22.png); background-position: 0px 66px; } ' +

                '.place_simulator_table .place_image.is_night { background-position: 0px -40px; } ' +
                '.place_simulator_table .place_image.research_ram { background-position: 0px -300px; } ' +
                '.place_simulator_table .place_image.research_phalanx { background-position: 0px -280px; }' +

                '.place_sim_wrap_mods_extended .place_cross { height:16px; background:none; } ' +
                '.place_sim_wrap_mods_extended .place_checkbox_field { display:table-cell; width:13px; height:13px; } ' +

                '.place_sim_wrap_mods_extended tr:last-child { display:none;} ' +

                '.place_sim_wrap_mods_extended tr:nth-of-type(3) td, .place_sim_wrap_mods_extended tr:nth-of-type(5) td { border-top: 2px solid #BFA978 !important; padding-top: 3px !important} ' +

                '.place_sim_wrap_mods_extended .game_border>div { display:none; } ' +
                '.place_sim_wrap_mods_extended .game_border { margin:0px; } ' +

                '.place_sim_wrap_mods_extended .game_border { height: 139px; overflow-y: auto; overflow-x: hidden; }' + // Größe der Modfikatorbox begrenzen

                '#place_simulator .window_inner_curtain { display: none !important } ' + // Hintergrund entfernen bei offener Modifikatorbox

                    // Unit container
                '#simulator_body .unit_container { height: 50px !important; width: 50px !important; margin: 0px 3px 0px 1px !important} ' +
                '.place_simulator_odd, .place_simulator_even { text-align: center !important} ' +
                '.place_insert_field { margin: 0px !important}  ' +

                '#place_sim_ground_units { position:absolute; bottom: 35px;} ' +

                    // Sea unit box
                '#place_sim_naval_units { position: absolute; } ' +
                '#place_sim_naval_units tbody tr:last-child { height:auto !important; }' +

                '.place_sim_select_strategies select { width: 95px !important} ' +
                '.place_sim_select_strategies { margin-left: 99px !important} ' +


                    // Land unit box
                '#place_sim_wrap_units { position: absolute !important; bottom: 35px !important} ' +

                '#simulator_body>h4 { position:absolute;bottom:188px;} ' +

                    // Select boxes
                '.place_sim_select_gods_wrap { position:absolute; bottom:185px; left:96px;} ' +

                '.place_sim_select_gods { width: 105px !important} ' +
                '.place_sim_select_gods select { width: 80px !important} ' +

                '#select_insert_units { width: 130px !important} ' +

                '.place_sim_select_gods_wrap .place_symbol, .place_sim_select_strategies .place_symbol { margin: 0px 2px 0px 5px !important} ' +
                '.place_sim_insert_units .place_symbol { background: url(https://gpall.innogamescdn.com/images/game/towninfo/traveltime.png) !important; background-size: 140% !important; background-position-y: -4px !important} ' +
                '.place_attack { float: left !important} ' +
                '#simulator_body .att { margin-left: 19px !important} ' +

                    // Hero box
                '.place_sim_heroes_container { position: absolute !important; right: 26px !important; padding-top: 3px !important; z-index: 1 !important} ' +
                '.place_sim_hero_container { width: 45px !important; height: 25px !important} ' +

                '#place_simulator .place_sim_bonuses_heroes h4:nth-of-type(2) { display:none; }' + // Heroes title

                    // - Hero container
                '.place_sim_hero_choose, .place_sim_hero_unit_container { height: 26px !important; width: 30px !important} ' +
                '#hero_defense_icon, #hero_attack_icon { height: 25px !important; width: 25px !important; margin: 0px !important} ' +
                '#hero_defense_dd, #hero_attack_dd { height: 25px !important; width: 25px !important; margin: 1px !important} ' +
                '.place_sim_hero_attack, .place_sim_hero_defense { margin-left: 3px !important} ' +
                '#hero_attack_text, #hero_defense_text { font-size: 11px !important; bottom: 0px !important} ' +
                '.place_sim_heroes_container .plus { left: 2px; top: 2px !important} ' +

                '.place_sim_heroes_container .button_new.square { left: 2px !important; } ' +


                    // - Hero spinner
                '.place_sim_heroes_container .spinner { height: 25px !important; width: 40px !important } ' +
                '.place_sim_heroes_container td:nth-child(0) { height: 30px !important} ' +
                '.place_sim_heroes_container .spinner { height: 24px !important; position:absolute !important; width:12px !important; left:29px !important; '+
                                                        'background:url(https://gpall.innogamescdn.com/images/game/border/odd.png) repeat !important; border: 1px solid rgb(107, 107, 107) !important; } ' +
                '.place_sim_heroes_container .spinner .button_down, .place_sim_heroes_container .spinner .button_up { bottom: 2px !important; cursor: pointer !important} ' +
                '.place_sim_heroes_container .spinner .border_l, .place_sim_heroes_container .spinner .border_r, .place_sim_heroes_container .spinner .body { display:none; } '+

                // Quack
                '#q_place_sim_lost_res { display: none; } ' +
                '</style>').appendTo('head');

            if($('#place_simulator').get(0)) {
                Simulator.change();
            }

        },
        deactivate: function () {
            $('#dio_simulator').remove();
            if($('#simu_table').get(0)) {
                $('#simu_table').remove();

                // Hero box
                if ($('.place_sim_heroes_container').get(0)) {
                    $('.hero_unit').each(function () {
                        $(this).addClass('unit_icon40x40').removeClass('unit_icon25x25');
                    });

                    // Hero spinner
                    $('.place_sim_heroes_container .spinner').each(function () {
                        $(this).addClass('place_sim_hero_spinner');
                    });
                }
            }
        },
        change: function () {
            // TODO: Durch CSS ersetzen...

            // Wall loss
            $('.place_sim_wrap_mods tr:eq(1) td:eq(5)').html('<span id="building_place_def_losses_wall_level" class="place_losses bold"></span>');

            // Extended modificator box
            $('.place_sim_wrap_mods_extended .power').each(function () {
                $(this).removeClass("power_icon45x45").addClass("power_icon16x16");
            });
            $('.place_sim_wrap_mods_extended td:nth-child(even)').each(function () {
                $(this).addClass("left_border place_simulator_odd");
            });
            $('.place_sim_wrap_mods_extended td:nth-child(odd)').each(function () {
                $(this).addClass("left_border place_simulator_even");
            });

            // Border entfernen
            $('.place_sim_wrap_mods_extend td:first-child').each(function () {
                $(this).removeClass("left_border");
            });

            // -> Update percentage each time
            $('.place_checkbox_field').click(function () {
                FightSimulator.closeModsExtended(); //$('.place_sim_bonuses_more_confirm').get(0).click();
            });

            // Hero world ?
            if (uw.Game.hasArtemis) {
                $('.place_sim_wrap_mods_extend tr').each(function () {
                    this.children[1].style.borderLeft = "none";
                    this.children[0].remove();
                });
            }

            // Hero box
            if ($('.place_sim_heroes_container').get(0)) {
                $('.hero_unit').each(function () {
                    $(this).removeClass('unit_icon40x40').addClass('unit_icon25x25');
                });

                // Hero spinner
                $('.place_sim_heroes_container .spinner').each(function () {
                    $(this).removeClass('place_sim_hero_spinner');
                });
            }

            setStrengthSimulator();
        }
    };

    function afterSimulation() {
        var lossArray = {att: {res: 0, fav: 0, pop: 0}, def: {res: 0, fav: 0, pop: 0}},
            wall_level = parseInt($('.place_sim_wrap_mods .place_insert_field[name="sim[mods][def][wall_level]"]').val(), 10),
            wall_damage = parseInt($('#building_place_def_losses_wall_level').get(0).innerHTML, 10),
            wall_iron = [0, 200, 429, 670, 919, 1175, 1435, 1701, 1970, 2242, 2518, 2796, 3077, 3360, 3646, 3933, 4222, 4514, 4807, 5101, 5397, 5695, 5994, 6294, 6596, 6899];

        // Calculate unit losses
        $('#place_sim_ground_units .place_losses, #place_sim_naval_units .place_losses').each(function () {
            var loss = parseInt(this.innerHTML, 10) || 0;
            console.log(this.innerHTML);
            if (loss > 0) {
                var unit = this.id.substring(26);
                var side = this.id.split("_")[2]; // att / def
                lossArray[side].res += loss * (uw.GameData.units[unit].resources.wood + uw.GameData.units[unit].resources.stone + uw.GameData.units[unit].resources.iron);
                lossArray[side].fav += loss * uw.GameData.units[unit].favor;
                lossArray[side].pop += loss * uw.GameData.units[unit].population;
            }
        });
        // Calculate wall resource losses
        for (var w = wall_level; w > wall_level - wall_damage; w--) {
            lossArray.def.res += 400 + w * 350 + wall_iron[w]; // wood amount is constant, stone amount is multiplicative and iron amount is irregular for wall levels
        }

        // Insert losses into table
        for (var x in lossArray) {
            if (lossArray.hasOwnProperty(x)) {
                for (var z in lossArray[x]) {
                    if (lossArray[x].hasOwnProperty(z)) {
                        console.log(((z === "res") && (lossArray[x][z] > 10000)) ? (Math.round(lossArray[x][z] / 1000) + "k") : lossArray[x][z]);
                        $("#" + x + "_" + z).get(0).innerHTML = ((z === "res") && (lossArray[x][z] > 10000)) ? (Math.round(lossArray[x][z] / 1000) + "k") : lossArray[x][z];

                    }
                }
            }
        }
    }

    // Stärkeanzeige: Simulator
    var unitsGround = {att: {}, def: {}}, unitsNaval = {att: {}, def: {}}, name = "";

    function setStrengthSimulator() {
        $('<div id="simu_table">' +
            '<div style="float:left; margin-right:12px;"><h4>' + getText("labels", "str") + '</h4>' +
            '<table class="place_simulator_table strength" cellpadding="0px" cellspacing="0px" style="align:center;">' +
            '<tr>' +
            '<td class="place_simulator_even"></td>' +
            '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_hack"></div></td>' +
            '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_pierce"></div></td>' +
            '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_dist"></div></td>' +
            '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_ship"></div></td>' +
            '</tr><tr>' +
            '<td class="place_simulator_even"><div class="place_symbol place_att"></div></td>' +
            '<td class="left_border place_simulator_odd" id="att_b">0</td>' +
            '<td class="left_border place_simulator_even" id="att_s">0</td>' +
            '<td class="left_border place_simulator_odd" id="att_d">0</td>' +
            '<td class="left_border place_simulator_even" id="att_ship">0</td>' +
            '</tr><tr>' +
            '<td class="place_simulator_even"><div class="place_symbol place_def"></div></td>' +
            '<td class="left_border place_simulator_odd" id="def_b">0</td>' +
            '<td class="left_border place_simulator_even" id="def_s">0</td>' +
            '<td class="left_border place_simulator_odd" id="def_d">0</td>' +
            '<td class="left_border place_simulator_even" id="def_ship">0</td>' +
            '</tr>' +
            '</table>' +
            '</div><div><h4>' + getText("labels", "los") + '</h4>' +
            '<table class="place_simulator_table loss" cellpadding="0px" cellspacing="0px" style="align:center;">' +
            '<tr>' +
            '<td class="place_simulator_even"></td>' +
            '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_res"></div></td>' +
            '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_fav"></div></td>' +
            '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_pop"></div></td>' +
            '</tr><tr>' +
            '<td class="place_simulator_even"><div class="place_symbol place_att"></div></td>' +
            '<td class="left_border place_simulator_odd" id="att_res">0</td>' +
            '<td class="left_border place_simulator_even" id="att_fav">0</td>' +
            '<td class="left_border place_simulator_odd" id="att_pop">0</td>' +
            '</tr><tr>' +
            '<td class="place_simulator_even"><div class="place_symbol place_def"></div></td>' +
            '<td class="left_border place_simulator_odd" id="def_res">0</td>' +
            '<td class="left_border place_simulator_even" id="def_fav">0</td>' +
            '<td class="left_border place_simulator_odd" id="def_pop">0</td>' +
            '</tr>' +
            '</table>' +
            '</div></div>').appendTo('#simulator_body');

        $('#simu_table').css({
            position: 'absolute',
            top: '200px',
            fontSize: '0.8em',
            width: '63%'
        });
        $('#simu_table .ico').css({
            height: '20px',
            width: '20px',
            margin: 'auto'
        });
        $('#simu_table .units_info_sprite').css({
            background: 'url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)',
            backgroundSize: '100%'
        });
        $('#simu_table .img_hack').css({backgroundPosition: '0% 36%'});
        $('#simu_table .img_pierce').css({backgroundPosition: '0% 27%'});
        $('#simu_table .img_dist').css({backgroundPosition: '0% 45%'});
        $('#simu_table .img_ship').css({backgroundPosition: '0% 72%'});

        $('#simu_table .img_fav').css({
            background: 'url(https://gpall.innogamescdn.com/images/game/res/favor.png)',
            backgroundSize: '100%'
        });
        $('#simu_table .img_res').css({
            background: 'url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png) 0% 54%',
            backgroundSize: '100%'
        });
        $('#simu_table .img_pop').css({
            background: 'url(https://gpall.innogamescdn.com/images/game/res/pop.png)',
            backgroundSize: '100%'
        });

        $('#simu_table .left_border').css({
            width: '54px'
        });
        $('#simu_table .left_border').each(function () {
            $(this)[0].align = 'center';
        });

        $('#simu_table .strength').tooltip(getText("labels", "str") + " (" + getText("labels", "mod") + ")");
        $('#simu_table .loss').tooltip(getText("labels", "los"));

        // Klick auf Einheitenbild
        $('.index_unit').click(function () {
            var type = $(this).attr('class').split(" ")[4];
            $('.place_insert_field[name="sim[units][att][' + type + ']"]').change();
        });

        $('#place_sim_ground_units .place_insert_field, #place_sim_naval_units .place_insert_field').on('input change', function () {
            name = $(this).attr("name").replace(/\]/g, "").split("[");
            var str = this;
            //console.log(str);
            setTimeout(function () {
                var unit_type = $(str).closest('.place_simulator_table').attr("id").split("_")[2],
                    val, e;

                val = parseInt($(str).val(), 10);
                val = val || 0;

                if (unit_type == "ground") {
                    unitsGround[name[2]][name[3]] = val;

                    if (name[2] == "def") {
                        UnitStrength.calcDef(unitsGround.def);
                    } else {
                        UnitStrength.calcOff(unitsGround.att, unitsGround.att);
                    }
                    $('#' + name[2] + '_b').get(0).innerHTML = blunt;
                    $('#' + name[2] + '_s').get(0).innerHTML = sharp;
                    $('#' + name[2] + '_d').get(0).innerHTML = dist;

                } else {
                    var att = 0, def = 0;
                    unitsNaval[name[2]][name[3]] = val;

                    if (name[2] == "def") {
                        for (e in unitsNaval.def) {
                            if (unitsNaval.def.hasOwnProperty(e)) {
                                def += unitsNaval.def[e] * uw.GameData.units[e].defense;
                            }
                        }
                        $('#def_ship').get(0).innerHTML = def;
                    } else {
                        for (e in unitsNaval.att) {
                            if (unitsNaval.att.hasOwnProperty(e)) {
                                att += unitsNaval.att[e] * uw.GameData.units[e].attack;
                            }
                        }
                        $('#att_ship').get(0).innerHTML = att;
                    }
                }
            }, 100);
        });

        // Abfrage wegen eventueller Spionageweiterleitung
        getUnitInputs();
        setTimeout(function () {
            setChangeUnitInputs("def");
        }, 100);

        $('#select_insert_units').change(function () {
            var side = $(this).find('option:selected').val();
            setTimeout(function () {
                getUnitInputs();
                if (side === "att" || side === "def") {
                    setChangeUnitInputs(side);
                }
            }, 200);
        });
    }

    function getUnitInputs() {
        $('#place_sim_ground_units .place_insert_field, #place_sim_naval_units .place_insert_field').each(function () {
            name = $(this).attr("name").replace(/\]/g, "").split("[");
            var str = this;
            var unit_type = $(str).closest('.place_simulator_table').attr("id").split("_")[2],
                val, e;
            val = parseInt($(str).val(), 10);
            val = val || 0;
            if (unit_type === "ground") {
                unitsGround[name[2]][name[3]] = val;
            } else {
                var att = 0, def = 0;
                unitsNaval[name[2]][name[3]] = val;
            }
        });
    }

    function setChangeUnitInputs(side) {
        $('.place_insert_field[name="sim[units][' + side + '][godsent]"]').change();
        setTimeout(function () {
            $('.place_insert_field[name="sim[units][' + side + '][colonize_ship]"]').change();
        }, 100);
    }

    /*******************************************************************************************************************************
     * Defense form
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Adds a defense form to the bbcode bar
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    // Funktion aufteilen...
    function addForm(e) {
        var textareaId = "", bbcodeBarId = "";

        switch (e) {
            case "/alliance_forum/forum":
                textareaId = "#forum_post_textarea";
                bbcodeBarId = "#forum";
                break;
            case "/message/forward":
                textareaId = "#message_message";
                bbcodeBarId = "#message_bbcodes";
                break;
            case "/message/new":
                textareaId = "#message_new_message";
                bbcodeBarId = "#message_bbcodes";
                break;
            case "/message/view":
                textareaId = "#message_reply_message";
                bbcodeBarId = "#message_bbcodes";
                break;
            case "/player_memo/load_memo_content":
                textareaId = "#memo_text_area";
                bbcodeBarId = "#memo_edit";
                break;
        }

        $('<a title="Verteidigungsformular" href="#" class="dio_bbcode_option def_form" name="def_form"></a>').appendTo(bbcodeBarId + ' .bb_button_wrapper');

        $('.def_form_button').css({
            cursor: 'pointer',
            marginTop: '3px'
        });

        $(bbcodeBarId + ' .dio_bbcode_option').css({
            background: 'url("http://s14.directupload.net/images/140126/lt3hyb8j.png")',
            display: 'block',
            float: 'left',
            width: '22px',
            height: '23px',
            margin: '0 3px 0 0',
            position: 'relative'
        });
        $(bbcodeBarId + ' .def_form').css({
            backgroundPosition: '-89px 0px'
        });
        var imgArray = {
            wall: 'https://gpall.innogamescdn.com/images/game/main/wall.png',
            tower: 'https://gpall.innogamescdn.com/images/game/main/tower.png',
            hide: 'https://gpall.innogamescdn.com/images/game/main/hide.png',

            spy: 'http://s7.directupload.net/images/140114/yr993xwc.png',
            pop: 'http://s7.directupload.net/images/140114/4d6xktxm.png',

            rev1: 'http://s7.directupload.net/images/140115/9cv6otiu.png',
            rev0: 'http://s7.directupload.net/images/140115/aue4rg6i.png',
            eo1: 'http://s1.directupload.net/images/140115/fkzlipyh.png',
            eo0: 'http://s1.directupload.net/images/140115/hs2kg59c.png',
            att: 'http://s1.directupload.net/images/140115/3t6uy4te.png',
            sup: 'http://s7.directupload.net/images/140115/ty6szerx.png',

            zeus: 'http://s1.directupload.net/images/140114/cdxecrpu.png',
            hera: 'http://s1.directupload.net/images/140114/mve54v2o.png',
            athena: 'http://s14.directupload.net/images/140114/kyqyedhe.png',
            poseidon: 'http://s7.directupload.net/images/140114/tusr9oyi.png',
            hades: 'http://s7.directupload.net/images/140114/huins2gn.png',
            artemis: 'http://s7.directupload.net/images/140114/kghjhko8.png',
            nogod: 'http://s1.directupload.net/images/140114/e7vmvfap.png',

            captain: 'http://s14.directupload.net/images/140114/88gg75rc.png',
            commander: 'http://s14.directupload.net/images/140114/slbst52o.png',
            priest: 'http://s1.directupload.net/images/140114/glptekkx.png',

            phalanx: 'http://s7.directupload.net/images/140114/e97wby6z.png',
            ram: 'http://s7.directupload.net/images/140114/s854ds3w.png',

            militia: 'http://wiki.en.grepolis.com/images/9/9b/Militia_40x40.png',
            sword: 'http://wiki.en.grepolis.com/images/9/9c/Sword_40x40.png',
            slinger: 'http://wiki.en.grepolis.com/images/d/dc/Slinger_40x40.png',
            archer: 'http://wiki.en.grepolis.com/images/1/1a/Archer_40x40.png',
            hoplite: 'http://wiki.en.grepolis.com/images/b/bd/Hoplite_40x40.png',
            rider: 'http://wiki.en.grepolis.com/images/e/e9/Rider_40x40.png',
            chariot: 'http://wiki.en.grepolis.com/images/b/b8/Chariot_40x40.png',
            catapult: 'http://wiki.en.grepolis.com/images/f/f0/Catapult_40x40.png',
            godsent: 'http://wiki.de.grepolis.com/images/6/6e/Grepolis_Wiki_225.png',

            def_sum: 'http://s14.directupload.net/images/140127/6cxnis9r.png',

            minotaur: 'http://wiki.de.grepolis.com/images/7/70/Minotaur_40x40.png',
            manticore: 'http://wiki.de.grepolis.com/images/5/5e/Manticore_40x40.png',
            zyclop: 'http://wiki.de.grepolis.com/images/6/66/Zyklop_40x40.png',
            sea_monster: 'http://wiki.de.grepolis.com/images/7/70/Sea_monster_40x40.png',
            harpy: 'http://wiki.de.grepolis.com/images/8/80/Harpy_40x40.png',
            medusa: 'http://wiki.de.grepolis.com/images/d/db/Medusa_40x40.png',
            centaur: 'http://wiki.de.grepolis.com/images/5/53/Centaur_40x40.png',
            pegasus: 'http://wiki.de.grepolis.com/images/5/54/Pegasus_40x40.png',
            cerberus: 'http://wiki.de.grepolis.com/images/6/67/Zerberus_40x40.png',
            fury: 'http://wiki.de.grepolis.com/images/6/67/Erinys_40x40.png',
            griffin: 'http://wiki.de.grepolis.com/images/d/d1/Unit_greif.png',
            calydonian_boar: 'http://wiki.de.grepolis.com/images/9/93/Unit_eber.png',

            big_transporter: 'http://wiki.en.grepolis.com/images/0/04/Big_transporter_40x40.png',
            bireme: 'http://wiki.en.grepolis.com/images/4/44/Bireme_40x40.png',
            attack_ship: 'http://wiki.en.grepolis.com/images/e/e6/Attack_ship_40x40.png',
            demolition_ship: 'http://wiki.en.grepolis.com/images/e/ec/Demolition_ship_40x40.png',
            small_transporter: 'http://wiki.en.grepolis.com/images/8/85/Small_transporter_40x40.png',
            trireme: 'http://wiki.en.grepolis.com/images/a/ad/Trireme_40x40.png',
            colonize_ship: 'http://wiki.en.grepolis.com/images/d/d1/Colonize_ship_40x40.png',

            move_icon: 'https://gpall.innogamescdn.com/images/game/unit_overview/',

            bordure: 'http://s1.directupload.net/images/140126/8y6pmetk.png'
        };

        $('<div class="bb_def_chooser">' +
            '<div class="bbcode_box middle_center">' +
            '<div class="bbcode_box top_left"></div><div class="bbcode_box top_right"></div>' +
            '<div class="bbcode_box top_center"></div><div class="bbcode_box bottom_center"></div>' +
            '<div class="bbcode_box bottom_right"></div><div class="bbcode_box bottom_left"></div>' +
            '<div class="bbcode_box middle_left"></div><div class="bbcode_box middle_right"></div>' +
            '<div class="bbcode_box content clearfix" style="padding:5px">' +
            '<div id="f_uni" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "det") + '</div></div><br><br>' +
            '<div id="f_prm" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "prm") + '</div></div><br><br>' +
            '<div id="f_sil" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "sil") + '</div></div><br><br>' +
            '<div id="f_mov" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getText("labels", "mov") + '</div></div><br><br>' +
            '<div><a class="button" id="dio_insert" href="#"><span class="left"><span class="right"><span class="middle"><small>' + getText("buttons", "ins") + '</small></span></span></span><span></span></a></div>' +
            '</div></div></div>').appendTo(bbcodeBarId + ' .bb_button_wrapper');

        $('.bb_def_chooser').css({
            display: 'none',
            top: '38px',
            left: '510px',
            position: 'absolute',
            width: '190px',
            zIndex: 10000
        });

        $(bbcodeBarId + " .bb_def_chooser .checkbox_new").click(function () {
            $(this).toggleClass("checked");
        });

        $(bbcodeBarId + ' .def_form').toggleClick(function () {
            $(this).parent().find(".bb_def_chooser").get(0).style.display = "block";
        }, function () {
            $(this).parent().find(".bb_def_chooser").get(0).style.display = "none";
        });

        $(bbcodeBarId + ' #dio_insert').click(function () {
            var textarea = $(textareaId).get(0), text = $(textarea).val(), troop_table = "", troop_img = "", troop_count = "", separator = "", move_table = "", landunit_sum = 0;

            $('.def_form').click();

            if ($('#f_uni').hasClass("checked")) {
                $('.units_land .unit, .units_naval .unit').each(function () {
                    troop_img += separator + '[img]' + imgArray[this.className.split(" ")[1]] + '[/img]';
                    troop_count += separator + '[center]' + $(this).find(".value").get(0).innerHTML + '[/center]';
                    separator = "[||]";
                });
            } else {
                $('.units_land .unit').each(function () {
                    var a = this.className.split(" ")[1], def = (uw.GameData.units[a].def_hack + uw.GameData.units[a].def_pierce + uw.GameData.units[a].def_distance) / (3 * uw.GameData.units[a].population);
                    if (def > 10) {
                        landunit_sum += parseInt($(this).find(".value").get(0).innerHTML, 10) * uw.GameData.units[a].population * ((def > 20) ? 2 : 1);
                    }
                });
                landunit_sum = (landunit_sum > 10000) ? ((Math.round(landunit_sum / 100)) / 10) + "k" : landunit_sum;

                troop_img += '[img]' + imgArray.def_sum + '[/img]';
                troop_count += '[center]' + landunit_sum + '[/center]';
                separator = "[||]";
                $('.units_naval .unit').each(function () {
                    troop_img += separator + '[img]' + imgArray[this.className.split(" ")[1]] + '[/img]';
                    troop_count += separator + '[center]' + $(this).find(".value").get(0).innerHTML + '[/center]';
                });
            }
            if (troop_img !== "") {
                troop_table = "\n[table][**]" + troop_img + "[/**][**]" + troop_count + "[/**][/table]\n";
            }

            var str = '[img]' + imgArray.bordure + '[/img]' +
                '\n\n[color=#006B00][size=12][u][b]' + getText("labels", "ttl") + ' ([url="http://adf.ly/eDM1y"]©DIO-Tools[/url])[/b][/u][/size][/color]\n\n' +
                    //'[table][**][img]'+ imgArray.sup +'[/img][||]'+
                '[size=12][town]' + uw.ITowns.getTown(uw.Game.townId).getId() + '[/town] ([player]' + uw.Game.player_name + '[/player])[/size]' +
                    //'[||][img]'+ imgArray['rev' + (uw.ITowns.getTown(uw.Game.townId).hasConqueror()?1:0)] +'[/img][/**][/table]'+
                '\n\n[i][b]' + getText("labels", "inf") + '[/b][/i]' + troop_table +
                '[table][*]' +
                '[img]' + imgArray.wall + '[/img][|]\n' +
                '[img]' + imgArray.tower + '[/img][|]\n' +
                '[img]' + imgArray.phalanx + '[/img][|]\n' +
                '[img]' + imgArray.ram + '[/img][|]\n' +
                ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.commander + '[/img][|]\n' : ' ') +
                ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.captain + '[/img][|]\n' : ' ') +
                ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.priest + '[/img][|]\n' : ' ') +
                ($('#f_sil').hasClass("checked") ? '[center][img]' + imgArray.spy + '[/img][/center][|]\n' : ' ') +
                '[img]' + imgArray.pop + '[/img][|]\n' +
                '[img]' + imgArray[(uw.ITowns.getTown(uw.Game.townId).god() || "nogod")] + '[/img][/*]\n' +
                '[**][center]' + uw.ITowns.getTown(uw.Game.townId).buildings().getBuildingLevel("wall") + '[/center][||]' +
                '[center]' + uw.ITowns.getTown(uw.Game.townId).buildings().getBuildingLevel("tower") + '[/center][||]' +
                '[center]' + (uw.ITowns.getTown(uw.Game.townId).researches().attributes.phalanx ? '+' : '-') + '[/center][||]' +
                '[center]' + (uw.ITowns.getTown(uw.Game.townId).researches().attributes.ram ? '+' : '-') + '[/center][||]' +
                ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.commander >= uw.Timestamp.now()) ? '+' : '-') + '[/center][||]' : ' ') +
                ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.captain >= uw.Timestamp.now()) ? '+' : '-') + '[/center][||]' : ' ') +
                ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.priest >= uw.Timestamp.now()) ? '+' : '-') + '[/center][||]' : ' ') +
                ($('#f_sil').hasClass("checked") ? '[center]' + Math.round(uw.ITowns.getTown(uw.Game.townId).getEspionageStorage() / 1000) + 'k[/center][||]' : ' ') +
                '[center]' + uw.ITowns.getTown(uw.Game.townId).getAvailablePopulation() + '[/center][||]' +
                '[center]' + $('.gods_favor_amount').get(0).innerHTML + '[/center]' +
                '[/**][/table]';

            var bb_count_str = parseInt(str.match(/\[/g).length, 10), bb_count_move = 0;

            var i = 0;
            if ($('#f_mov').hasClass("checked")) {
                move_table += '\n[i][b]' + getText("labels", "mov") + '[/b][/i]\n[table]';

                $('#toolbar_activity_commands').mouseover();

                $('#toolbar_activity_commands_list .content .command').each(function () {
                    var cl = $(this).children()[0].className.split(" ");
                    if ((cl[cl.length - 1] === "returning" || cl[cl.length - 1] === "revolt_arising" || cl[cl.length - 1] === "revolt_running") && ((bb_count_str + bb_count_move) < 480)) {
                        move_table += (i % 1) ? "" : "[**]";
                        i++;
                        move_table += "[img]" + imgArray.move_icon + cl[2] + ".png[/img][||]";
                        move_table += getArrivalTime($(this).children()[1].innerHTML) + (uw.Game.market_id === "de" ? " Uhr[||]" : " [||]");
                        move_table += "[town]" + JSON.parse(atob($(this).children()[2].firstChild.href.split("#")[1])).id + "[/town]";
                        move_table += (i % 1) ? "[||]" : "[/**]";
                    }
                    bb_count_move = parseInt(move_table.match(/\[/g).length, 10);
                });
                if ((bb_count_str + bb_count_move) > 480) {
                    move_table += '[**]...[/**]';
                }

                $('#toolbar_activity_commands').mouseout();

                //console.log((bb_count_str + bb_count_move));
                move_table += (i % 1) ? "[/**]" : "";
                move_table += "[*][|][color=#800000][size=6][i] (" + getText("labels", "dev") + ": ±1s)[/i][/size][/color][/*][/table]\n";
            }

            str += move_table + '[img]' + imgArray.bordure + '[/img]';


            $(textarea).val(text.substring(0, $(textarea).get(0).selectionStart) + str + text.substring($(textarea).get(0).selectionEnd));
        });
    }

    function getArrivalTime(duration_time) {
        /*
         var server_time = new Date((uw.Timestamp.server() + 7200) * 1000);

         duration_time = duration_time.split(":");

         s = server_time.getUTCSeconds() + parseInt(duration_time[2], 10);
         m = server_time.getUTCMinutes() + parseInt(duration_time[1], 10) + ((s>=60)? 1 : 0);
         h = server_time.getUTCHours() + parseInt(duration_time[0], 10) + ((m>=60)? 1 : 0);
         */

        var server_time = $('.server_time_area').get(0).innerHTML.split(" ")[0].split(":"), arrival_time, s, m, h;
        duration_time = duration_time.split(":");

        s = parseInt(server_time[2], 10) + parseInt(duration_time[2], 10);
        m = parseInt(server_time[1], 10) + parseInt(duration_time[1], 10) + ((s >= 60) ? 1 : 0);
        h = parseInt(server_time[0], 10) + parseInt(duration_time[0], 10) + ((m >= 60) ? 1 : 0);

        s = s % 60;
        m = m % 60;
        h = h % 24;

        s = ((s < 10) ? "0" : "") + s;
        m = ((m < 10) ? "0" : "") + m;
        h = ((h < 10) ? "0" : "") + h;

        arrival_time = h + ":" + m + ":" + s;

        return arrival_time;
    }


    /*******************************************************************************************************************************
     * Smiley box
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Display of a smiley selection box for text input fields (forum, messages, notes):
     * | ● Used smileys: http://www.greensmilies.com/smilie-album/
     * | + Own Grepolis smileys
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var smileyArray = {};

    var SmileyBox = {
        loading_error: false, isHalloween: false, isXmas: false, isForum: $(".editor_textbox_container").get(0),

        activate: function () {
            $('<style id="dio_smiley">' +
                '.smiley_button { cursor:pointer; margin:3px 2px 2px 2px; } ' +

                '.smiley_box.game { z-index:5000; position:absolute; top:27px; left:430px; min-width:300px; display:none; } ' +

                    // Smiley categories
                '.smiley_box .box_header { display: table; width: 100%; text-align:center; } ' +
                '.smiley_box .group { display:table-cell; color: #0c450c; cursor: pointer; font-weight:bold; padding: 0px 2px 0px 2px; } ' +
                '.smiley_box .group.active { color: #089421; text-decoration:underline;} ' +
                '.smiley_box .group:hover { color: #14999E; } ' + // #11AD6C

                    // Special smiley categories
                '.smiley_box .halloween { color: #E25E00; } ' +
                '.smiley_box .xmas { color: darkred; } ' +

                '.smiley_box hr { margin:3px 0px 0px 0px; color:#086b18; border:1px solid; } ' +

                    // Smilies
                '.smiley_box .box_content { overflow: hidden; } ' +
                '.smiley_box .box_content .smiley { border: 1px solid rgba(0,0,0,0); border-radius: 5px;} ' +
                '.smiley_box .box_content .smiley:hover { background: rgba(8, 148, 77, 0.2); border: 1px solid rgba(0, 128, 0, 0.5); } ' +

                    // Smiley page link
                '.smiley_box .box_footer { text-align:center; margin-top:4px; } ' +
                '.smiley_box a:link, .smiley_box a:visited { color: #086b18; font-size: 0.7em; } ' +
                '.smiley_box a:hover { color: #14999E; } ' +

                    // TODO Forum ...
                '.smiley_box.forum .box_header_left { float:left; } ' +
                    //'.smiley_box.forum .group { padding-right: 10px; } '+
                '.smiley_box.forum .box_header_right { text-align:right; margin-top:2px; } ' +

                '.smiley_box.forum { max-height:90px; margin-left:5px; width:99%; min-height:10px; } ' +
                '.smiley_box.forum .box_content { overflow:overlay; min-height:70px; margin-bottom:10px; } ' +

                '.smiley_box.forum a:link, .smiley_box.forum a:visited { font-size: 1em; } ' +

                '</style>').appendTo('head');


            // Smiley categories
            smileyArray.button = ["rollsmiliey", "smile"];

            smileyArray.standard = [
                "smilenew", "i/cnfy7elqh8dotnsdp", "lol", "neutral_new", "afraid", "freddus_pacman", "auslachen2", "kolobok-sanduhr", "bussi2", "winken4", "flucht2", "panik4", "ins-auge-stechen",
                "seb_zunge", "fluch4_GREEN", "baby_junge2", "blush-reloaded6", "frown", "verlegen", "blush-pfeif", "stevieh_rolleyes", "daumendreh2", "baby_taptap",
                "sadnew", "hust", "confusednew", "idea2", "irre", "irre4", "sleep", "candle", "nicken", "no_sad",
                "thumbs-up_new", "thumbs-down_new", "bravo2", "oh-no2", "kaffee2", "drunk", "saufen", "freu-dance", "hecheln", "headstand", "rollsmiliey", "eazy_cool01", "motz", "cuinlove", "biggrin"
            ];
            smileyArray.nature = [
                "dinosaurier07", "flu-super-gau", "ben_cat", "schwein", "hundeleine01", "blume", "ben_sharky", "ben_cow", "charly_bissig", "gehirnschnecke_confused", "mttao_fische", "mttao_angler",
                "insel", "fliegeschnappen", "i/cifohy0y1cl7nckzw", /* Spinne */ "i/cifogx34asrswrcjw", /* Schiffbrüchiger */ "plapperhase", "ben_dumbo"
            ];
            smileyArray.grepolis = [
                "mttao_wassermann", "i/cigrmpfofys5xtiks", /* Hera */ "i/cifvfsu3e2sdiipn0", /* Medusa */ "i/cigmv8wnffb3v0ifg", /* Mantikor */ "i/cigrqlp2odi2kqo24", /* Zyklop */
                "i/cj1l9gndtu3nduyvi", /* Minotaurus */ "i/cj2byjendffymp88t", /* Pegasus */ "i/cj2ccmi2x8mhcoikd", /* Hydra */
                "silvester_cuinlove", "mttao_schuetze", "kleeblatt2", "wallbash", /* "glaskugel4", */ "musketiere_fechtend", /* "krone-hoch",*/ "i/cifojb85jytq5h07g", // Wikinger
                "mttao_waage2", "steckenpferd", /* "kinggrin_anbeten2", */ "i/cifohielywpedbyh8", /* Grepo Love */ "skullhaufen", "pferdehaufen" // "i/ckajscggscw4s2u60"
            ];
            smileyArray.people = [
                "seb_hut5", "opa_boese2", "star-wars-yoda1-gruen", "hexefliegend", "snob", "seb_detektiv_ani", "seb_cowboy", "devil", "segen", "pirat5", "borg", "hexe3b",
                "i/cifoqe3geok0jco5o", // Ägypter
                "i/ciforgs313z0ae1cc", // Hippie
                "eazy_polizei", "stars_elvis", "mttao_chefkoch", "nikolaus", "pirate3_biggrin", "batman_skeptisch", "tubbie1", "tubbie2", "tubbie3", "tubbie4"
            ];
            smileyArray.other = [
                "steinwerfen", "herzen02", "scream-if-you-can", "kolobok", "headbash", "liebeskummer", "bussi", "brautpaar-reis", "grab-schaufler2", "boxen2", "aufsmaul",
                "sauf", "mttao_kehren", "sm", "weckruf", "klugscheisser2", "karte2_rot", "dagegen", "party", "dafuer", "outofthebox", "pokal_gold", "koepfler", "transformer"
            ];

            SmileyBox.checkHolidaySeason();

            if (SmileyBox.isHalloween) {
                smileyArray.halloween = [
                    "zombies_alien", "zombies_lol", "zombies_rolleyes", "zombie01", "zombies_smile", "zombie02", "zombies_skeptisch", "zombies_eek", "zombies_frown",
                    "scream-if-you-can", "geistani", "pfeildurchkopf01", "grab-schaufler", "kuerbisleuchten", "mummy3",
                    "kuerbishaufen", "halloweenskulljongleur", "fledermausvampir", "frankenstein_lol", "halloween_confused", "zombies_razz",
                    "halloweenstars_freddykrueger", "zombies_cool", "geist2", "fledermaus2", "halloweenstars_dracula"
                    // "batman" "halloweenstars_lastsummer"
                ];
            }
            if (SmileyBox.isXmas) {
                smileyArray.xmas = [
                    "schneeballwerfen", "schneeball", "xmas4_advent4", "nikolaus", "weihnachtsmann_junge", "schneewerfen_wald", "weihnachtsmann_nordpol", "xmas_kilroy_kamin",
                    "xmas4_laola", "xmas4_aufsmaul", "xmas3_smile", "xmas4_paketliebe", "mttao_ruprecht_peitsche", "3hlkoenige", "santa", "xmas4_hurra2", "weihnachtsgeschenk2", "fred_weihnachten-ostern"
                    //"dafuer", "outofthebox", "pokal_gold", "koepfler", "transformer"
                ];
            }

            //smileyArray.other = smileyArray.halloween.slice();

            // Forum: Extra smiley
            if (SmileyBox.isForum) {
                smileyArray.grepolis.push("i/ckajscggscw4s2u60"); // Pacman
                smileyArray.grepolis.push("i/cowqyl57t5o255zli"); // Bugpolis
                smileyArray.grepolis.push("i/cowquq2foog1qrbee"); // Inno
            }

            SmileyBox.loadSmileys();
        },
        deactivate: function () {
            $('#dio_smiley').remove();
        },
        checkHolidaySeason: function () {
            // TODO: HolidaySpecial-Klasse stattdessen benutzen
            var daystamp = 1000 * 60 * 60 * 24, today = new Date((new Date()) % (daystamp * (365 + 1 / 4))), // without year

            // Halloween-Smileys ->15 days
                halloween_start = daystamp * 297, // 25. Oktober
                halloween_end = daystamp * 321, // 8. November
            // Xmas-Smileys -> 28 Tage
                xmas_start = daystamp * 334, // 1. Dezember
                xmas_end = daystamp * 361; // 28. Dezember

            SmileyBox.isHalloween = (today >= halloween_start) ? (today <= halloween_end) : false;

            SmileyBox.isXmas = (today >= xmas_start) ? (today <= xmas_end) : false;
        },
        // preload images
        loadSmileys: function () {
            // Replace german sign smilies
            if (LID !== "de") {
                smileyArray.other[17] = "dagegen2";
                smileyArray.other[19] = "dafuer2";
            }

            for (var e in smileyArray) {
                if (smileyArray.hasOwnProperty(e)) {
                    for (var f in smileyArray[e]) {
                        if (smileyArray[e].hasOwnProperty(f)) {
                            var src = smileyArray[e][f];

                            smileyArray[e][f] = new Image();
                            smileyArray[e][f].className = "smiley";

                            if (src.substring(0, 2) == "i/") {
                                smileyArray[e][f].src = "http://666kb.com/" + src + ".gif";
                            } else {
                                if (SmileyBox.loading_error == false) {
                                    smileyArray[e][f].src = "http://www.greensmilies.com/smile/smiley_emoticons_" + src + ".gif";
                                } else {
                                    smileyArray[e][f].src = 'http://s1.directupload.net/images/140128/93x3p4co.gif';
                                }
                            }
                            smileyArray[e][f].onerror = function () {
                                this.src = 'http://s1.directupload.net/images/140128/93x3p4co.gif';
                            };
                        }
                    }
                }
            }
        },

        // Forum smilies
        changeForumEditorLayout: function () {
            $('.blockrow').css({border: "none"});

            // Subject/Title
            $($('.section div label[for="title"]').parent()).css({float: "left", width: "36%", marginRight: "20px"});
            $($('.section div label[for="subject"]').parent()).css({float: "left", width: "36%", marginRight: "20px"});

            $('.section div input').eq(0).css({marginBottom: "-10px", marginTop: "10px"});
            $('#display_posticon').remove();

            // Posticons
            $('.posticons table').css({width: "50%" /* marginTop: "-16px"*/});
            $('.posticons').css({marginBottom: "-16px"});
            $('.posticons').insertAfter($('.section div label[for="title"]').parent());
            $('.posticons').insertAfter($('.section div label[for="subject"]').parent());
            // Posticons hint
            $('.posticons p').remove();
            // Posticons: No Icon - radio button
            $(".posticons [colspan='14']").parent().replaceWith($(".posticons [colspan='14']"));
            $(".posticons [colspan='14']").children().wrap("<nobr></nobr>");
            $(".posticons [colspan='14']").appendTo('.posticons tr:eq(0)');
            $(".posticons [colspan='4']").remove();
        },

        addForum: function () {
            $('<div class="smiley_box forum"><div>' +
                '<div class="box_header_left">' +
                '<span class="group standard active">' + getText("labels", "std") + '</span>' +
                '<span class="group grepolis">' + getText("labels", "gre") + '</span>' +
                '<span class="group nature">' + getText("labels", "nat") + '</span>' +
                '<span class="group people">' + getText("labels", "ppl") + '</span>' +
                '<span class="group other">' + getText("labels", "oth") + '</span>' +
                (SmileyBox.isHalloween ? '<span class="group halloween">' + getText("labels", "hal") + '</span>' : '') +
                (SmileyBox.isXmas ? '<span class="group xmas">' + getText("labels", "xma") + '</span>' : '') +
                '</div>' +
                '<div class="box_header_right"><a class="smiley_link" href="http://www.greensmilies.com/smilie-album/" target="_blank">WWW.GREENSMILIES.COM</a></div>' +
                '<hr>' +
                '<div class="box_content" style="overflow: hidden;"><hr></div>' +
                '</div></div><br>').insertAfter(".texteditor");

            SmileyBox.addSmileys("standard", "");

            $('.group').click(function () {
                $('.group.active').removeClass("active");
                $(this).addClass("active");
                // Change smiley group
                SmileyBox.addSmileys(this.className.split(" ")[1], "");
            });
        },

        // add smiley box
        add: function (e) {
            var bbcodeBarId = "";
            switch (e) {
                case "/alliance_forum/forum":
                    bbcodeBarId = "#forum";
                    break;
                case "/message/forward":
                    bbcodeBarId = "#message_bbcodes";
                    break;
                case "/message/new":
                    bbcodeBarId = "#message_bbcodes";
                    break;
                case "/message/view":
                    bbcodeBarId = "#message_bbcodes";//setWonderIconsOnMap
                    break;
                case "/player_memo/load_memo_content":
                    bbcodeBarId = "#memo_edit"; // old notes
                    break;
                case "/frontend_bridge/fetch":
                    bbcodeBarId = ".notes_container"; // TODO: new notes
                    break;
            }
            if (($(bbcodeBarId + ' #emots_popup_7').get(0) || $(bbcodeBarId + ' #emots_popup_15').get(0)) && PID == 84367) {
                $(bbcodeBarId + " .bb_button_wrapper").get(0).lastChild.remove();
            }
            $('<img class="smiley_button" src="http://www.greensmilies.com/smile/smiley_emoticons_smile.gif">').appendTo(bbcodeBarId + ' .bb_button_wrapper');

            $('<div class="smiley_box game">' +
                '<div class="bbcode_box middle_center"><div class="bbcode_box middle_right"></div><div class="bbcode_box middle_left"></div>' +
                '<div class="bbcode_box top_left"></div><div class="bbcode_box top_right"></div><div class="bbcode_box top_center"></div>' +
                '<div class="bbcode_box bottom_center"></div><div class="bbcode_box bottom_right"></div><div class="bbcode_box bottom_left"></div>' +
                '<div class="box_header">' +
                '<span class="group standard active">' + getText("labels", "std") + '</span>' +
                '<span class="group grepolis">' + getText("labels", "gre") + '</span>' +
                '<span class="group nature">' + getText("labels", "nat") + '</span>' +
                '<span class="group people">' + getText("labels", "ppl") + '</span>' +
                '<span class="group ' + (SmileyBox.isHalloween ? 'halloween' : (SmileyBox.isXmas ? 'xmas' : 'other')) + '">' + getText("labels", (SmileyBox.isHalloween ? 'hal' : (SmileyBox.isXmas ? 'xma' : 'oth'))) + '</span>' +
                '</div>' +
                '<hr>' +
                '<div class="box_content"></div>' +
                '<hr>' +
                '<div class="box_footer"><a href="http://www.greensmilies.com/smilie-album/" target="_blank">WWW.GREENSMILIES.COM</a></div>' +
                '</div>').appendTo(bbcodeBarId + ' .bb_button_wrapper');


            $(bbcodeBarId + ' .group').click(function () {
                $('.group.active').removeClass("active");
                $(this).addClass("active");
                // Change smiley group
                SmileyBox.addSmileys(this.className.split(" ")[1], "#" + $(this).closest('.bb_button_wrapper').parent().get(0).id);
            });

            SmileyBox.addSmileys("standard", bbcodeBarId);

            // smiley box toggle
            $(bbcodeBarId + " .smiley_button").toggleClick(
                function () {
                    this.src = smileyArray.button[0].src;
                    $(this).closest('.bb_button_wrapper').find(".smiley_box").get(0).style.display = "block";
                },
                function () {
                    this.src = smileyArray.button[1].src;
                    $(this).closest('.bb_button_wrapper').find(".smiley_box").get(0).style.display = "none";
                }
            );
        },

        // insert smileys from arrays into smiley box
        addSmileys: function (type, bbcodeBarId) {
            // reset smilies
            if ($(bbcodeBarId + " .box_content").get(0)) {
                $(bbcodeBarId + " .box_content").get(0).innerHTML = '';
            }
            // add smilies
            for (var e in smileyArray[type]) {
                if (smileyArray[type].hasOwnProperty(e)) {
                    $(smileyArray[type][e]).clone().appendTo(bbcodeBarId + " .box_content");
                    //$('<img class="smiley" src="' + smileyArray[type][e].src + '" alt="" />').appendTo(bbcodeBarId + " .box_content");
                }
            }
            $('.smiley').css({margin: '0px', padding: '2px', maxHeight: '35px', cursor: 'pointer'});

            $(bbcodeBarId + " .box_content .smiley").click(function () {
                var textarea;
                if (uw.location.pathname === "/game/index") {
                    // hide smiley box
                    $(this).closest('.bb_button_wrapper').find(".smiley_button").click();
                    // find textarea
                    textarea = $(this).closest('.gpwindow_content').find("textarea").get(0);
                } else {

                    if ($('.editor_textbox_container').get(0)) {
                        textarea = $('.editor_textbox_container .cke_contents textarea').get(0);
                    } else {
                        $(this).appendTo('iframe .forum');
                    }
                }
                var text = $(textarea).val();
                $(textarea).val(text.substring(0, $(textarea).get(0).selectionStart) + "[img]" + this.src + "[/img]" + text.substring($(textarea).get(0).selectionEnd));
            });
        }
    };

    if ($(".editor_textbox_container").get(0)) {
        SmileyBox.activate();
        SmileyBox.changeForumEditorLayout();
        SmileyBox.addForum();
    }

    /*******************************************************************************************************************************
     * Biremes counter
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Incremental update when calling a city (experimental, especially intended for siege worlds)
     * ----------------------------------------------------------------------------------------------------------------------------
     * @deprecated
     * *****************************************************************************************************************************/
    var BiremeCounter = {
        activate: function () {
            $(".picomap_container").prepend("<div id='available_bullseye_unit'><div id='bi_count'></div></div>");

            $('.picomap_overlayer').tooltip(getText("options", "bir")[0]);
            BiremeCounter.update();

            // Style
            $('<style id="dio_bireme_counter">' +
                '#available_bullseye_unit { background: url(https://gpall.innogamescdn.com/images/game/units/units_sprite_90x90_compressed.jpg); height:90px;' +
                'width:90px; position: relative; margin: 5px 28px 0px 28px; background-position: -270px 0px; } ' +
                '#bi_count { color:#826021; position:relative; top:28px; font-style:italic; width:79px; } ' +
                '#sea_id { background: none; font-size:25px; cursor:default; height:50px; width:50px; position:absolute; top:70px; left:157px; z-index: 30; } ' +
                '</style>').appendTo('head');

            // fs_count: color: #FFC374;position: relative;top: 30px;font-style: italic;width: 101px;text-shadow: 1px 1px 0px rgb(69, 0, 0);
            // manti: background-position: -1350px 180px;
            // manti-count: color: #ECD181;position: relative;top: 48px;font-style: italic;width: 52px;text-shadow: 2px 2px 0px rgb(0, 0, 0);
            // medusa:-1440px 182px;
            // med-count: color: #DEECA4;position: relative;top: 50px;font-style: italic;width: 55px;text-shadow: 2px 2px 0px rgb(0, 0, 0);

            // Set Sea-ID beside the bull eye
            $('#sea_id').prependTo('#ui_box');
        },
        deactivate: function () {
            $('#available_bullseye_unit').remove();
            $('#dio_bireme_counter').remove();
            $('#sea_id').appendTo('.picomap_container');
        },
        save: function () {
            saveValue(WID + "_biremes", JSON.stringify(biriArray));
        },
        update: function () {
            var sum = 0, e;
            if ($('#bi_count').get(0)) {
                for (e in biriArray) {
                    if (biriArray.hasOwnProperty(e)) {
                        if (!uw.ITowns.getTown(e)) { // town is no longer in possession of user
                            delete biriArray[e];
                            BiremeCounter.save();
                        } else {
                            sum += parseInt(biriArray[e], 10);
                        }
                    }
                }

                sum = sum.toString();
                var str = "", fsize = ['1.4em', '1.2em', '1.15em', '1.1em', '1.0em'], i;

                for (i = 0; i < sum.length; i++) {
                    str += "<span style='font-size:" + fsize[i] + "'>" + sum[i] + "</span>";
                }
                $('#bi_count').get(0).innerHTML = "<b>" + str + "</b>";
            }
        },
        get: function () {
            var biremeIn = parseInt(uw.ITowns.getTown(uw.Game.townId).units().bireme, 10),
                biremeOut = parseInt(uw.ITowns.getTown(uw.Game.townId).unitsOuter().bireme, 10);
            if (isNaN(biremeIn)) biremeIn = 0;
            if (isNaN(biremeOut)) biremeOut = 0;
            if (!biriArray[uw.Game.townId] || biriArray[uw.Game.townId] < (biremeIn + biremeOut)) {
                biriArray[uw.Game.townId] = biremeIn;
            }
            BiremeCounter.update();
            BiremeCounter.save();
        },
        getDocks: function () {
            var windowID = uw.BuildingWindowFactory.getWnd().getID(),
                biremeTotal = parseInt($('#gpwnd_' + windowID + ' #unit_order_tab_bireme .unit_order_total').get(0).innerHTML, 10);

            if (!isNaN(biremeTotal)) biriArray[uw.Game.townId] = biremeTotal;
            BiremeCounter.update();
            BiremeCounter.save();
        },
        getAgora: function () {
            var biremeTotal = parseInt(uw.ITowns.getTown(parseInt(uw.Game.townId, 10)).units().bireme, 10);
            if (isNaN(biremeTotal)) biremeTotal = 0;

            $('#units_beyond_list .bireme').each(function () {
                biremeTotal += parseInt(this.children[0].innerHTML, 10);
            });
            biriArray[uw.Game.townId] = biremeTotal;
            BiremeCounter.update();
            BiremeCounter.save();
        }
    };

    /*******************************************************************************************************************************
     * Favor Popup
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Improved favor popup
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var FavorPopup = {
        godArray: {
            zeus: '0px',
            hera: '-152px',
            poseidon: '-101px',
            athena: '-50px',
            hades: '-203px',
            artemis: '-305px'
        }, godImg: (new Image()).src = "https://diotools.de/images/game/gods.png",

        activate: function () {
            $('.gods_favor_button_area, #favor_circular_progress').bind('mouseover mouseout', function () {
                return false;
            });
            $('.gods_area').bind('mouseover', function () {
                FavorPopup.setFavorPopup();
            });
        },

        deactivate: function () {
            $('.gods_favor_button_area, #favor_circular_progress').unbind('mouseover mouseout');
            $('.gods_area').unbind('mouseover');
        },

        setFavorPopup: function () {
            var pic_row = "", fav_row = "", prod_row = "", tooltip_str;

            for (var g in FavorPopup.godArray) {
                if (FavorPopup.godArray.hasOwnProperty(g)) {
                    if (uw.ITowns.player_gods.attributes.temples_for_gods[g]) {
                        pic_row += '<td><div style="width:50px;height:51px;background:url(' + FavorPopup.godImg + ');background-position: 0px ' + FavorPopup.godArray[g] + ';"></td>';
                        fav_row += '<td class="bold" style="color:blue">' + uw.ITowns.player_gods.attributes[g + "_favor"] + '</td>';
                        prod_row += '<td class="bold">' + uw.ITowns.player_gods.attributes.production_overview[g].production + '</td>';
                    }
                }
            }
            tooltip_str = $('<table><tr><td></td>' + pic_row + '</tr>' +
                '<tr align="center"><td><img src="https://gpall.innogamescdn.com/images/game/res/favor.png"></td>' + fav_row + '</tr>' +
                '<tr align="center"><td>+</td>' + prod_row + '</tr>' +
                '</table>');

            $('.gods_favor_button_area, #favor_circular_progress').tooltip(tooltip_str);
        }
    };

    /*******************************************************************************************************************************
     * GUI Optimization
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Modified spell box (smaller, moveable & position memory)
     * | ● Larger taskbar and minimize daily reward-window on startup
     * | ● Modify chat
     * | ● Improved display of troops and trade activity boxes (movable with position memory on startup)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var Spellbox = {
        observe: function () {
            $.Observer(uw.GameEvents.ui.layout_gods_spells.rendered).subscribe('DIO_SPELLBOX_CHANGE_OPEN', function () {
                if (spellbox.show == false) {
                    spellbox.show = true;
                    saveValue("spellbox", JSON.stringify(spellbox));
                }
                Spellbox.change();
            });
            $.Observer(uw.GameEvents.ui.layout_gods_spells.state_changed).subscribe('DIO_SPELLBOX_CLOSE', function () {
                spellbox.show = false;
                saveValue("spellbox", JSON.stringify(spellbox));
            });

            // GRCRT Bug-Fix
            if(typeof(RepConv) !== "undefined") {
                $.Observer(uw.GameEvents.ui.layout_gods_spells.rendered).unsubscribe('GRCRT_GRC_ui_layout_gods_spells_rendered');

                $.Observer(uw.GameEvents.ui.layout_gods_spells.rendered).subscribe('GRCRT_GRC_ui_layout_gods_spells_rendered', function () {
                    // PlayerGods doesn't exists at game start and the function would call an error
                    if (typeof(RepConv.models.PlayerGods) !== "undefined") {
                        RepConvTool.loadPower();
                    }
                });
            }
        },

        activate: function () {
            Spellbox.observe();
            Spellbox.change();

            $('<style id="dio_spellbox_style" type="text/css">' +
                    // Don't hide hero box, unit time box and hero coin box from GRC
                '#ui_box .nui_right_box { overflow: visible; } ' +
                    // Hide negative spells
                '#ui_box .bolt, #ui_box .earthquake, #ui_box .pest { display: none } ' +
                    // Change spell order
                '#ui_box .god_container { float: left } ' +
                '#ui_box .god_container[data-god_id="zeus"], #ui_box .god_container[data-god_id="athena"] { float: none } ' +
                    // Remove background
                '#ui_box .powers_container { background: none !important } ' +
                    // Hide god titles
                '#ui_box .content .title { display: none !important } ' +
                    // Hide border elements
                '#ui_box .gods_spells_menu .left, #ui_box .gods_spells_menu .right, #ui_box .gods_spells_menu .top, #ui_box .gods_spells_menu .bottom { display: none } ' +
                    // Layout
                '#ui_box .gods_area { height:150px } ' +

                '#ui_box .gods_spells_menu { width: 134px; position:absolute; z-index:5000; padding:30px 0px 0px -4px } ' +
                '#ui_box .gods_spells_menu .content { background:url(https://gpall.innogamescdn.com/images/game/layout/power_tile.png) 1px 4px; overflow:auto; margin:0 0 0px 0px; border:3px inset rgb(16, 87, 19); border-radius:10px } ' +

                '#ui_box .nui_units_box { display:block; margin-top:-8px; position:relative } ' +
                '#ui_box .nui_units_box .bottom_ornament { margin-top:-28px; position: relative } ' +
                '</style>').appendTo('head');

            // Draggable Box
            $("#ui_box .gods_spells_menu").draggable({
                containment: "body",
                distance: 10,
                snap: "body, .gods_area, .nui_units_box, .ui_quickbar, .nui_main_menu, .minimized_windows_area, #island_quests_overview",
                opacity: 0.7,
                stop: function () {
                    spellbox.top = this.style.top;
                    spellbox.left = this.style.left;

                    saveValue("spellbox", JSON.stringify(spellbox));
                }
            });
            $("#ui_box .gods_spells_menu").before($('#ui_box .nui_units_box'));

            // Position
            $('#ui_box .gods_spells_menu').css({
                left: spellbox.left,
                top: spellbox.top
            });

            // Active at game start?
            if (spellbox.show && !$('#ui_box .btn_gods_spells').hasClass('active')) {
                $('#ui_box .btn_gods_spells').click();
            }
        },
        deactivate: function () {
            $('#ui_box .gods_spells_menu').draggable('destroy');

            // Position
            $('#ui_box .gods_spells_menu').css({
                left: "auto",
                top: "150px"
            });

            //$("#ui_box .gods_spells_menu").appendTo('gods_area'); // ?

            $('#dio_spellbox_style').remove();

            $.Observer(GameEvents.ui.layout_gods_spells.rendered).unsubscribe('DIO_SPELLBOX_CHANGE_OPEN');
            $.Observer(GameEvents.ui.layout_gods_spells.state_changed).unsubscribe('DIO_SPELLBOX_CLOSE');
        },

        change: function () {
            //console.log("Unitsbox: "+ $(".nui_units_box").height());
            //console.log("Spellbox: "+ $(".gods_spells_menu").height());

            // Change spell order
            $('#ui_box .god_container[data-god_id="poseidon"]').prependTo('#ui_box .gods_spells_menu .content');
            $('#ui_box .god_container[data-god_id="athena"]').appendTo('#ui_box .gods_spells_menu .content');
            $('#ui_box .god_container[data-god_id="artemis"]').appendTo('#ui_box .gods_spells_menu .content');
        }

    };


    // Minimize Daily reward window on startup
    function minimizeDailyReward() {
        /*
         $.Observer(uw.GameEvents.window.open).subscribe('DIO_WINDOW', function(u,dato){});
         $.Observer(uw.GameEvents.window.reload).subscribe('DIO_WINDOW2', function(f){});
         */
        if (MutationObserver) {
            var startup = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes[0]) {
                        if ($('.daily_login').get(0)) { //  && !uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_SHOW_ON_LOGIN).isMinimized()
                            $('.daily_login').find(".minimize").click();
                            //uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_SHOW_ON_LOGIN).minimize();
                        }
                    }
                });
            });
            startup.observe($('body').get(0), {attributes: false, childList: true, characterData: false});

            setTimeout(function () {
                startup.disconnect();
            }, 3000);
        }
    }

    // Larger taskbar
    var Taskbar = {
        activate: function () {
            $('.minimized_windows_area').get(0).style.width = "150%";
            $('.minimized_windows_area').get(0).style.left = "-25%";
        },
        deactivate: function () {
            $('.minimized_windows_area').get(0).style.width = "100%";
            $('.minimized_windows_area').get(0).style.left = "0%";
        }
    };

    // Hide fade out buttons
    function hideNavElements() {
        if (Game.premium_features.curator <= Timestamp.now()) {
            $('.nav').each(function () {
                this.style.display = "none";
            });
        }
    }

    /*******************************************************************************************************************************
     * Modify Chat
     *******************************************************************************************************************************/
    var Chat = {
        interval: null,

        activate: function () {
            if (!$('#dio_flash').get(0)) {
                $('<script id="dio_flash" type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>').appendTo('head');
            }
            $('<style id="dio_chat">.nui_main_menu .chat { filter: "url(#Hue1)"; -webkit-filter: "hue-rotate(65deg)";  }</style>').appendTo('head');
            Chat.updateChatUser();
            Chat.interval = setInterval(function () {
                Chat.updateChatUser();
            }, 300000); // 5 minutes
            $('.nui_main_menu .chat').mouseover(function () {
                //Chat.popupChatUser();
            });
            // No alliance chat:
            if ($('.nui_main_menu .chat').hasClass('disabled')) {
                $('.nui_main_menu .chat').removeClass('disabled');
            }
        },
        deactivate: function () {
            $('#dio_chat').remove();
            $('.nui_main_menu .chat .indicator').get(0).style.display = 'none';

            clearInterval(Chat.interval);

            if (GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_CHAT)) {
                GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_CHAT).close();
            }
        },

        updateChatUser: function () {
            var market = uw.Game.market_id;
            if (gm) {
                // GM-BROWSER:
                chatUserRequest();
            } else {
                // SAFARI:
                $.ajax({
                    url: "https://diotools.de/game/chatuser_count.php?chan=Grepo" + (market === "de" ? "lisDE" : ""),
                    dataType: 'text',
                    success: function (text) {
                        $('.nui_main_menu .chat .indicator').get(0).innerHTML = text;
                        $('.nui_main_menu .chat .indicator').get(0).style.display = 'block';
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        $('.nui_main_menu .chat .indicator').get(0).style.display = 'none';
                    }
                });
            }
        },

        popupChatUser: function () { // not used yet
            setTimeout(function () {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://wwwapi.iz-smart.net/modules.php?name=Chaninfo&file=nicks&chan=Grepolis" + uw.Game.market_id.toUpperCase(),
                    onload: function (response) {
                        //$('.nui_main_menu .chat .indicator').get(0).innerHTML =
                        //console.log(response.responseText);
                        //$('.nui_main_menu .chat .indicator').get(0).style.display = 'inline';
                    }
                });
            }, 0);
        },

        // Modify chat window
        open: function () {
            var host = {fr: 'irc.quakenet.org', def: 'flash.afterworkchat.de'},
                market = uw.Game.market_id, select_nick = false, chatwnd_id,
                nickname = uw.Game.player_name;

            setTimeout(function () {
                Chat.updateChatUser();
            }, 30000); // 30 seconds

            //uw.GPWindowMgr.Create(uw.Layout.wnd.TYPE_CHAT);

            //uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_CHAT).setWidth(600);
            //uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_CHAT).setHeight(300);
            //uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_CHAT).setPosition([0,'bottom']);

            //console.log(uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_CHAT));

            chatwnd_id = '#gpwnd_' + uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_CHAT).getID();

            $('#chat').get(0).innerHTML = "";
            //$(chatwnd_id).parent().children('.gpwindow_left').remove();
            //$(chatwnd_id).parent().children('.gpwindow_right').remove();
            //$(chatwnd_id).parent().children('.gpwindow_top').remove();
            //$(chatwnd_id).parent().children('.gpwindow_bottom').remove();
            //$(chatwnd_id).parent().parent().children('.ui-dialog-titlebar').remove();

            var replaceArray = {
                // Russian:
                "Ё": "YO",
                "Й": "I",
                "Ц": "TS",
                "У": "U",
                "К": "K",
                "Е": "E",
                "Н": "N",
                "Г": "G",
                "Ш": "SH",
                "Щ": "SCH",
                "З": "Z",
                "Х": "H",
                "Ъ": "'",
                "ё": "yo",
                "й": "i",
                "ц": "ts",
                "у": "u",
                "к": "k",
                "е": "e",
                "н": "n",
                "г": "g",
                "ш": "sh",
                "щ": "sch",
                "з": "z",
                "х": "h",
                "ъ": "'",
                "Ф": "F",
                "Ы": "I",
                "В": "V",
                "А": "a",
                "П": "P",
                "Р": "R",
                "О": "O",
                "Л": "L",
                "Д": "D",
                "Ж": "ZH",
                "Э": "E",
                "ф": "f",
                "ы": "i",
                "в": "v",
                "а": "a",
                "п": "p",
                "р": "r",
                "о": "o",
                "л": "l",
                "д": "d",
                "ж": "zh",
                "э": "e",
                "Я": "Ya",
                "Ч": "CH",
                "С": "S",
                "М": "M",
                "И": "I",
                "Т": "T",
                "Ь": "'",
                "Б": "B",
                "Ю": "YU",
                "я": "ya",
                "ч": "ch",
                "с": "s",
                "м": "m",
                "и": "i",
                "т": "t",
                "ь": "'",
                "б": "b",
                "ю": "yu",

                // Greek:
                'Α': 'A',
                'Β': 'B',
                'Γ': 'G',
                'Δ': 'D',
                'Ε': 'E',
                'Ζ': 'Z',
                'Η': 'H',
                'Θ': 'Th',
                'Ι': 'I',
                'Κ': 'K',
                'Λ': 'L',
                'Μ': 'M',
                'Ν': 'N',
                'Ξ': 'J',
                'Ο': 'O',
                'Π': 'P',
                'Ρ': 'R',
                'Σ': 'S',
                'Τ': 'T',
                'Υ': 'U',
                'Φ': 'F',
                'Χ': 'Ch',
                'Ψ': 'Ps',
                'Ω': 'W',
                'Ά': 'A',
                'Έ': 'E',
                'Ή': 'H',
                'Ί': 'I',
                'Ό': 'O',
                'Ύ': 'U',
                'Ώ': 'W',
                'Ϊ': 'I',
                'α': 'a',
                'β': 'b',
                'γ': 'g',
                'δ': 'd',
                'ε': 'e',
                'ζ': 'z',
                'η': 'h',
                'θ': 'th',
                'ι': 'i',
                'κ': 'k',
                'λ': 'l',
                'μ': 'm',
                'ν': 'n',
                'ξ': 'j',
                'ο': 'o',
                'π': 'p',
                'ρ': 'r',
                'ς': 's',
                'σ': 's',
                'τ': 't',
                'υ': 'u',
                'φ': 'f',
                'χ': 'ch',
                'ψ': 'ps',
                'ω': 'w',
                'ά': 'a',
                'έ': 'e',
                'ή': 'h',
                'ί': 'i',
                'ό': 'o',
                'ύ': 'u',
                'ώ': 'w',
                'ϊ': 'i',
                'ΐ': 'i'
            };

            function replaceNick(word) {
                var temp = "", temp2 = "";
                // Step 1: Replace Special and some german chars
                word = word.replace(/[.,:,+,*]/g, "").replace(/[=,\ ,\-]/g, "_").replace(/ö/gi, "oe").replace(/ä/gi, "ae").replace(/ü/gi, "ue").replace(/ß/g, "ss");
                // Step 2: Replace russian and greek chars
                if (!word.match(/^[a-zA-Z0-9_]+$/)) {
                    temp = word.split('').map(function (char) {
                        var ch = "";
                        ch = replaceArray[char] || char;
                        return ch;
                    }).join("");
                    // Step 3: Delete all other special chars
                    if (!temp.match(/^[a-zA-Z0-9_]+$/)) {
                        for (var c = 0; c < temp.length; c++) {
                            if (temp[c].match(/^[a-zA-Z0-9_]+$/)) {
                                temp2 += temp[c];
                            }
                        }
                        select_nick = true;
                        temp = temp2;
                    }
                    word = temp;
                }
                return word;
            }

            //nickname = "kνnmδενεί-ναισυνδεδ*εμένος_Ιππέας"; // test nickname
            nickname = replaceNick(nickname);

            if (PID == 84367) {
                nickname = "DionY_";
            }

            $('<iframe src="http://flash.afterworkchat.de/1.0/FlashChat.swf' + //http://grepodio.heliohost.org/lightIRC/index.php'+
                '?host=flash.afterworkchat.de' +
                '&languagePath=http://flash.afterworkchat.de/1.0/language/' +
                '&port=6667' +
                '&policyPort=9000' +
                '&styleURL=https://diotools.de/css/green2.css' + //http://grepodio.heliohost.org/style.css'+ //
                '&emoticonPath=https://diotools.de/chat/emoticons/' + //http://www.greensmilies.com/smile/smiley_emoticons_'+
                '&emoticonList=' +
                ':)->smile.png,:(->sad.png,:O->baby.swf,:D->biggrin.png,~D->coffee.swf,:P->tongue.swf,8)->cool.png,:|->neutral.png,X)->drunk.swf,%5e%5e->grins.png,:{->cry.swf,:S->verlegen.png,' +
                ':$->blush.swf,:]->lol.swf,:*->bussi.swf,:[->fluch.swf' +
                    //'&accessKey=54a2846a460ae1703ac690d21551b997'+
                '&nick=' + nickname +
                '&nickAlternate=' + nickname + '_' +
                '&autojoin=%23GREPO,%23Grepolis' + market.toUpperCase() +
                '&showNickSelection=' + select_nick +
                '&showNavigation=true' +
                '&navigationPosition=top' +
                '&showNickSelection=false' +
                '&showIdentifySelection=false' +
                '&language=' + LID +
                '&quitMessage=CYA' +
                '&showChannelHeader=false' +
                    //'&useUserListIcons=true'+
                '&userListWidth=100' +
                '&soundAlerts=true' +
                '&soundOnNewChannelMessage=false' +
                '&showServerWindow=false' +
                '&fontSize=9' +
                '&showJoinPartMessages=false' +
                '&showMenuButton=false' +
                '&showTranslationButton=false' +
                '&showTimestamps=true' +
                    //'&showInfoMessages=false'+
                '&showRegisterNicknameButton=false' +
                '&showRichTextControls=false' +
                    //'&useUserListIcons=true'+
                '&showUserListInformationPopup=false' +
                '&showNickChangeButton=false' +
                '&showChannelCentral=false' +
                '&showOptionsButton=false' +
                '&showEmoticonsButton=true' +
                '&rememberNickname=false' +
                '" style="width:518px; height:357px; border:0px;"></iframe>').appendTo("#chat");

            /*
             $('<html><body><div id="lightIRC"><p><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" /></a></p></div>'+
             '<script type="text/javascript">'+
             'var params = {};'+
             'params.languagePath			= "http://flash.afterworkchat.de/1.0/language/";'+
             'params.host					= "flash.afterworkchat.de";'+
             'params.port					= 6667;'+
             'params.policyPort			= 9000;'+
             //'params.accessKey			= "54a2846a460ae1703ac690d21551b997";'+
             'params.styleURL				= "http://diotools.de/css/green2.css";'+
             'params.emoticonPath			= "http://diotools.de/chat/emoticons/";'+
             'params.emoticonList			= ":)->smile.png,:(->sad.png,:O->baby.swf,:D->biggrin.png,~D->coffee.swf,:P->tongue.swf,8)->cool.png,:|->neutral.png,X)->drunk.swf,%5e%5e->grins.png,:{->cry.swf,:S->verlegen.png,'+
             ':$->blush.swf,:]->lol.swf,:*->bussi.swf,:[->fluch.swf";'+
             'params.nick					= "'+ nickname + '";' +
             'params.autojoin				= "%23GREPO,%23Grepolis'+ market.toUpperCase() + '";' +
             'params.showNickSelection		= ' + select_nick + ';'+
             'params.showIdentifySelection = false;'+
             'params.language				= "'+ LID +'";'+
             'params.soundAlerts			= true;'+
             'params.fontSize				= "10";'+
             'params.navigationPosition	= "top";'+
             'params.showJoinPartMessages	= false;'+
             'params.showTimestamps		= true;'+
             'params.showRegisterNicknameButton = false;'+
             'params.showNickChangeButton	= true;'+
             'params.showOptionsButton		= true;'+
             'params.showServerWindow		= false;'+
             'params.showOptionsButton		= false;'+
             'params.showMenuButton		= false;'+
             'params.showTranslationButton	= false;'+
             'params.showRichTextControls	= false;'+
             'params.showChannelHeader		= false;'+
             'params.rememberNickname		= false;'+
             'params.userListWidth			= 100;' +
             'params.soundAlerts			= true;'+
             'params.soundOnNewChannelMessage = false;'+
             'swfobject.embedSWF("http://flash.afterworkchat.de/1.0/FlashChat.swf", "lightIRC", "100%", "100%", "10.0.0", "http://flash.afterworkchat.de/expressinstall.swf", params, {wmode:"transparent"});'+
             '</script></body></html>').appendTo("#chat");
             */
        }
    };

    /*******************************************************************************************************************************
     * Activity boxes
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Show troops and trade activity boxes
     * | ● Boxes are magnetic & movable (position memory)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var mut_toolbar, mut_command, mut_trade;

    var save_command_mouseout,
        save_commandlist_mouseout,
        save_trade_mouseout,
        save_tradelist_mouseout,

        save_command_mouseover,
        save_trade_mouseover;


    var ActivityBoxes = {
        activate: function () {
            ActivityBoxes.checkToolbarAtStart();

            $('#toolbar_activity_commands_list').css({
                left: commandbox.left + "px",
                top: commandbox.top + "px"
            });

            $('<style id="fix_lists" type="text/css">' +
                '#toolbar_activity_commands_list, #toolbar_activity_trades_list { width: 160px}' +
                '.dropdown-list .content { max-height: 329px}' +
                '</style>' +
                '<style id="dio_fix_trade" type="text/css">' +
                '#toolbar_activity_trades_list {' +
                'left:' + tradebox.left + 'px !important;' +
                'top: ' + tradebox.top + 'px !important}' +
                '</style>').appendTo('head');


            ActivityBoxes.draggableTradeBox();
            ActivityBoxes.draggableCommandBox();

            ActivityBoxes.catchToolbarEvents();
        },
        deactivate: function () {
            ActivityBoxes.hideTradeList();
            ActivityBoxes.hideCommandList();

            mut_toolbar.disconnect();
            mut_command.disconnect();
            mut_trade.disconnect();
        },
        showTradeList: function () {
            if (!$('#dio_trades_activity_style').get(0)) {
                $('#toolbar_activity_trades').mouseover();
                $('<style id="dio_trades_activity_style"> #toolbar_activity_trades_list { display: block !important; } </style>').appendTo("head");
            }
        },
        showCommandList: function () {
            if (!$('#dio_commands_activity_style').get(0)) {
                $('#toolbar_activity_commands').mouseover();
                $('<style id="dio_commands_activity_style"> #toolbar_activity_commands_list { ' +
                    'display:block !important; left:' + commandbox.left + 'px; top:' + commandbox.top + 'px; }' +
                    '</style>').appendTo("head");
            }
        },
        hideTradeList: function () {
            if ($('#dio_trades_activity_style').get(0)) {
                $('#dio_trades_activity_style').remove();
                $('#toolbar_activity_trades').mouseout();
            }
        },
        hideCommandList: function () {
            if ($('#dio_commands_activity_style').get(0)) {
                $('#dio_commands_activity_style').remove();
                $('#toolbar_activity_commands').mouseout();
            }
        },
        activate2: function () {
            var observe_options = {attributes: false, childList: true, characterData: false};

            ActivityBoxes.catchToolbarEvents();

            mut_command.observe($('.toolbar_activities .commands .count').get(0), observe_options);
            mut_trade.observe($('.toolbar_activities .trades .count').get(0), observe_options);

            $('<style id="dio_activity_style"> ' +
                '#toolbar_activity_commands_list.active { display: block !important; } ' +
                '#toolbar_activity_trades_list.active { display: block !important; } ' +
                '</style>').appendTo("head");


            $('#toolbar_activity_commands').mouseover();
            $('#toolbar_activity_trades').mouseover();

            $('#toolbar_activity_commands, #toolbar_activity_trades').off("mouseover");

            $('#toolbar_activity_commands, #toolbar_activity_commands_list, #toolbar_activity_trades, #toolbar_activity_trades_list').off("mouseout");

            $('#toolbar_activity_trades_list').unbind("click");
            //console.log($('#toolbar_activity_commands').data('events')["dd:list:show"][0].handler());

            ActivityBoxes.checkToolbarAtStart();

            $('#toolbar_activity_commands_list').css({
                left: commandbox.left + "px",
                top: commandbox.top + "px"
            });

            $('<style id="fix_lists" type="text/css">' +
                '#toolbar_activity_commands_list, #toolbar_activity_trades_list { width: 160px}' +
                '.dropdown-list .content { max-height: 329px}' +
                '</style>' +
                '<style id="dio_fix_trade" type="text/css">' +
                '#toolbar_activity_trades_list {' +
                'left:' + tradebox.left + 'px !important;' +
                'top: ' + tradebox.top + 'px !important}' +
                '</style>').appendTo('head');

            ActivityBoxes.draggableCommandBox();
            ActivityBoxes.draggableTradeBox();


            /*
             $('.toolbar_activities .commands').on("mouseover.bla", function(){
             $('#toolbar_activity_commands_list').addClass("active");
             });

             $('.toolbar_activities .trades').mouseover(function(){
             $('#toolbar_activity_trades_list').addClass("active");
             });
             */
        },
        deactivate2: function () {
            mut_toolbar.disconnect();
            mut_command.disconnect();
            mut_trade.disconnect();
            /*
             $('#toolbar_activity_commands').on("mouseover", save_command_mouseover);
             $('#toolbar_activity_trades').on("mouseover", save_trade_mouseover);

             $('#toolbar_activity_commands').on("mouseout", save_command_mouseout);
             $('#toolbar_activity_commands_list').on("mouseout", save_commandlist_mouseout);
             $('#toolbar_activity_trades').on("mouseout", save_trade_mouseout);
             $('#toolbar_activity_trades_list').on("mouseout", save_tradelist_mouseout);
             */

            $('#toolbar_activity_commands').mouseover = save_command_mouseover;
            $('#toolbar_activity_trades').mouseover = save_trade_mouseover;

            $('#toolbar_activity_commands').mouseout = save_command_mouseout;
            $('#toolbar_activity_commands_list').mouseout = save_commandlist_mouseout;
            $('#toolbar_activity_trades').mouseout = save_trade_mouseout;
            $('#toolbar_activity_trades_list').mouseout = save_tradelist_mouseout;


            $('#toolbar_activity_trades_list').removeClass("active");
            $('#toolbar_activity_commands_list').removeClass("active");
            /*
             $('.toolbar_activities .commands').off("mouseover.bla");
             */
            $('#dio_activity_style').remove();


        },
        checkToolbarAtStart: function () {
            if (parseInt($('.toolbar_activities .commands .count').get(0).innerHTML, 10) > 0) {
                ActivityBoxes.showCommandList();
            } else {
                ActivityBoxes.hideCommandList();
            }
            if (parseInt($('.toolbar_activities .trades .count').get(0).innerHTML, 10) > 0) {
                ActivityBoxes.showTradeList();
            } else {
                ActivityBoxes.hideTradeList();
            }
        },
        catchToolbarEvents: function () {
            var observe_options = {attributes: false, childList: true, characterData: false};

            mut_toolbar = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes[0]) {
                        console.debug(mutation.target.id);
                        if (mutation.target.id === "toolbar_activity_trades_list") {
                            ActivityBoxes.draggableTradeBox();
                        } else {
                            ActivityBoxes.draggableCommandBox();
                        }
                        mutation.addedNodes[0].remove();
                    }
                });
            });
            //mut_toolbar.observe($('#toolbar_activity_commands_list').get(0), observe_options );
            //mut_toolbar.observe($('#toolbar_activity_trades_list').get(0), observe_options );

            mut_command = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes[0]) {
                        console.debug(mutation.addedNodes[0].nodeValue);
                        if (mutation.addedNodes[0].nodeValue > 0) {
                            ActivityBoxes.showCommandList();
                        } else {
                            console.debug("hiiiiiiiide commands");
                            ActivityBoxes.hideCommandList();
                        }
                    }
                });
            });
            mut_trade = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes[0]) {
                        if (mutation.addedNodes[0].nodeValue > 0) {
                            ActivityBoxes.showTradeList();
                        } else {
                            ActivityBoxes.hideTradeList();
                        }
                    }
                });
            });
            mut_command.observe($('.toolbar_activities .commands .count').get(0), observe_options);
            mut_trade.observe($('.toolbar_activities .trades .count').get(0), observe_options);
        },
        // Moveable boxes
        draggableTradeBox: function () {
            $("#toolbar_activity_trades_list").draggable({
                containment: "body",
                distance: 20,
                snap: "body, .gods_area, .nui_units_box, .ui_quickbar, .nui_main_menu, .minimized_windows_area, .nui_left_box",
                opacity: 0.7,
                start: function () {
                    $("#dio_fix_trade").remove();
                },
                stop: function () {
                    var pos = $('#toolbar_activity_trades_list').position();

                    tradebox.left = pos.left;
                    tradebox.top = pos.top;

                    saveValue("tradebox", JSON.stringify(tradebox));

                    $('<style id="dio_fix_trade" type="text/css">' +
                        '#toolbar_activity_trades_list { left:' + tradebox.left + 'px !important; top:' + tradebox.top + 'px !important; } ' +
                        '</style>').appendTo('head');
                }
            });
        },
        draggableCommandBox: function () {
            $("#toolbar_activity_commands_list").draggable({
                containment: "body",
                distance: 20,
                snap: "body, .gods_area, .nui_units_box, .ui_quickbar, .nui_main_menu, .minimized_windows_area, .nui_left_box",
                opacity: 0.7,
                stop: function () {
                    var pos = $('#toolbar_activity_commands_list').position();
                    commandbox.left = pos.left;
                    commandbox.top = pos.top;

                    saveValue("commandbox", JSON.stringify(commandbox));
                }
            });
        }
    };

    /*******************************************************************************************************************************
     * Counter
     *******************************************************************************************************************************/

    function counter(time) {
        var type = "", today, counted, year, month, day;
        if (uw.Game.market_id !== "zz") {
            counted = DATA.count;
            today = new Date((time + 7200) * 1000);
            year = today.getUTCFullYear();
            month = ((today.getUTCMonth() + 1) < 10 ? "0" : "") + (today.getUTCMonth() + 1);
            day = (today.getUTCDate() < 10 ? "0" : "") + today.getUTCDate();
            today = year + month + day;
            //console.log(today);
            if (counted[0] !== today) {
                type += "d";
            }
            if (counted[1] == false) {
                type += "t";
            }
            if ((counted[2] == undefined) || (counted[2] == false)) {
                type += "b";
            }
            if (type !== "") {
                $.ajax({
                    type: "GET",
                    url: "https://diotools.de/game/count.php?type=" + type + "&market=" + uw.Game.market_id + "&date=" + today + "&browser=" + getBrowser(),
                    dataType: 'text',
                    success: function (text) {
                        if (text.indexOf("dly") > -1) {
                            counted[0] = today;
                        }
                        if (text.indexOf("tot") > -1) {
                            counted[1] = true;
                        }
                        if (text.indexOf("bro") > -1) {
                            counted[2] = true;
                        }
                        saveValue("dio_count", JSON.stringify(counted));
                    }
                });
            }
        }
    }


    /*******************************************************************************************************************************
     * Political Map
     *******************************************************************************************************************************/

    var PoliticalMap = {
        data: null,
        activate: function () {
            $('<div id="dio_political_map">' +
                '<div class="canvas_wrapper"></div>' +
                '<select class="zoom_select">' +
                '<option value="0.50">1 : 0.50</option>' +
                '<option value="0.75">1 : 0.75</option>' +
                '<option value="1.00" selected>1 : 1.00</option>' +
                '<option value="1.25">1 : 1.25</option>' +
                '<option value="1.50">1 : 1.50</option>' +
                '<option value="2.00">1 : 2.00</option>' +
                '<option value="3.00">1 : 3.00</option>' +
                '</select>' +
                '<div class="legend sandy-box">' +
                '<div class="corner_tl"></div>' +
                '<div class="corner_tr"></div>' +
                '<div class="corner_bl"></div>' +
                '<div class="corner_br"></div>' +
                '<div class="border_t"></div>' +
                '<div class="border_b"></div>' +
                '<div class="border_l"></div>' +
                '<div class="border_r"></div>' +
                '<div class="middle"></div>' +
                '<div class="content"><div class="item"></div></div>' +
                '</div></div>').appendTo('#ui_box');

            // Style
            $('<style id="dio_political_map_style">' +
                '#dio_political_map { width:100%; height:100%; z-index:3; background:#123d70; display:none; position:absolute; top:0; } ' +
                '#dio_political_map.active { display: block; } ' +
                '#dio_political_map .canvas_wrapper { } ' +
                '#dio_political_map canvas { position: absolute; cursor:move; top:0; left:0; } ' +
                '#dio_political_map .zoom_select { position:absolute; top:70px; left:300px; font-size: 2em; opacity:0.5; } ' +
                '#dio_political_map .zoom_select:hover { opacity:1; } ' +
                '#dio_political_map .legend { position:absolute; right:200px; top:50px; width:200px; height:auto; text-align:left; } ' +
                '#dio_political_map .legend .color_checker { width:15px; height:15px; float:left; border:1px solid rgb(100, 100, 0); margin:5px; position:relative; cursor:pointer; } ' +
                '#dio_political_map .legend .wonder_icon { float: left; margin: 4px; } ' +

                '.btn_political_map { top:56px; left:-4px; z-index:10; position:absolute; } ' +

                '.btn_political_map .ico_political_map { margin:7px 0px 0px 8px; width:17px; height:17px; background:url(http://s1.directupload.net/images/140408/pltgqlaw.png) no-repeat 0px 0px; background-size:100%; } ' +
                    // http://s14.directupload.net/images/140408/k4wikrlq.png // http://s7.directupload.net/images/140408/ahfr8227.png
                '.btn_political_map .ico_political_map.checked { margin-top:8px; } ' +
                '</style>').appendTo('head');

            PoliticalMap.addButton();

            var zoomSelect = $('.zoom_select');

            zoomSelect.change(function () {
                //PoliticalMap.zoomToCenter();
            });
            zoomSelect.on("change", function () {
                PoliticalMap.zoomToCenter();
            });

            ColorPicker.init();
        },
        deactivate: function () {
            $('.btn_political_map').remove();
            $('#dio_political_map_style').remove();
        },
        addButton: function () {
            var m_ZoomFactor = 1.0;
            $('<div class="btn_political_map circle_button" name="political_map"><div class="ico_political_map js-caption"></div></div>').appendTo(".bull_eye_buttons");

            var politicalMapButton = $('.btn_political_map');

            // Tooltip
            politicalMapButton.tooltip("Political Map"); // TODO: Language

            // Events
            politicalMapButton.on('mousedown', function () {
                //$('.btn_political_map, .ico_political_map').addClass("checked");
            }).on('mouseup', function () {
                //$('.btn_political_map, .ico_political_map').removeClass("checked");
            });

            $('.rb_map .option').click(function () {
                $('.btn_political_map, .ico_political_map').removeClass("checked");
                $('#dio_political_map').removeClass("active");
                $(this).addClass("checked");
            });

            politicalMapButton.click(function () {
                $('.rb_map .checked').removeClass("checked");
                $('.btn_political_map, .ico_political_map').addClass("checked");
                $('#dio_political_map').addClass("active");

                if ($('#dio_political_map').hasClass("active")) {
                    if (PoliticalMap.data == null) {
                        $('#ajax_loader').css({visibility: "visible"});
                        // Map-Daten aus DB auslesen
                        PoliticalMap.loadMapData();
                    } else {
                        //PoliticalMap.drawMap(PoliticalMap.data);
                    }
                }
            });
        },
        /**
         * Läd die Allianzen und Inseln aus der Datenbank
         * @since 3.0
         */
        loadMapData: function () {
            $.ajax({
                type: "GET",
                url: "https://diotools.de/php/map.php?world_id=" + WID + "&callback=jsonCallback",
                //dataType: 'jsonp',
                //async: false,
                //jsonpCallback: 'jsonCallback',
                //contentType: "application/json",
                success: function (response) {
                    if (response !== "") {
                        PoliticalMap.data = response;

                        var m_ZoomFactor = $('.zoom_select').get(0)[$('.zoom_select').get(0).selectedIndex].selected;

                        PoliticalMap.drawMap(PoliticalMap.data, m_ZoomFactor);
                        PoliticalMap.drawWonders(PoliticalMap.data, m_ZoomFactor);

                        $('#ajax_loader').css({visibility: "hidden"});

                        // Überprüfen, ob die Weltdaten geupdatet werden müssen
                        $.ajax({
                            type: "GET",
                            url: "https://diotools.de/php/update_db.php?world_id=" + WID
                        });
                    } else {
                        // Welt existiert noch nicht in DB
                        $.ajax({
                            type: "GET", url: "https://diotools.de/php/update_db.php?world_id=" + WID,
                            success: function () {
                                // Map-Daten aus DB auslesen, wenn die Weltdaten erfolgreich in die DB geladen wurden
                                $.ajax({
                                    type: "GET",
                                    url: "https://diotools.de/php/map.php?world_id=" + WID,
                                    success: function (response) {
                                        PoliticalMap.data = response;

                                        var m_ZoomFactor = $('.zoom_select').get(0)[$('.zoom_select').get(0).selectedIndex].selected;

                                        PoliticalMap.drawMap(PoliticalMap.data, m_ZoomFactor);
                                        PoliticalMap.drawWonders(PoliticalMap.data, m_ZoomFactor);

                                        $('#ajax_loader').css({visibility: "hidden"});
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },
        /**
         * Ändert die Zoomstufe der Karte zum Zentrum hin
         *
         * @param _zoom
         * @since 3.0
         */
        zoomToCenter: function () {
            var _zoom = $('.zoom_select').get(0)[$('.zoom_select').get(0).selectedIndex].value;

            var canvas = $('#dio_political_map canvas'),

                canvas_size = parseInt($('#dio_political_map canvas').width(), 10); // Breite und Höhe sind immer gleich

            var canvas_style = $('#dio_political_map .canvas_wrapper').get(0).style;

            // Berechnung: Alter Abstand + (1000 * Zoomänderung / 2)
            canvas_style.top = parseInt(canvas_style.top, 10) + (1000 * (canvas_size / 1000 - _zoom)) / 2 + "px";
            canvas_style.left = parseInt(canvas_style.left, 10) + (1000 * (canvas_size / 1000 - _zoom)) / 2 + "px";

            PoliticalMap.clearMap();
            PoliticalMap.drawMap(PoliticalMap.data, _zoom);
            PoliticalMap.drawWonders(PoliticalMap.data, _zoom);

        },
        /**
         * Ändert die Zoomstufe der Karte zur Cursorposition hin
         *
         * @param _zoom
         * @param _pos
         *
         * @since 3.0
         */
        zoomToCursorPosition: function (_zoom, _pos) {

        },
        /**
         * Zeichnet die Karte in ein Canvas
         *
         * @param _islandArray {Array}
         * @param _zoom {int}
         *
         * @since 3.0
         */
        drawMap: function (_islandArray, _zoom) {

            $('<canvas class="canv_map" height="' + (1000 * _zoom) + 'px" width="' + (1000 * _zoom) + "px\"></canvas>").prependTo('.canvas_wrapper')

            // TODO: Weite und Höhe vom Fenster ermitteln, Update Containment bei onResizeWindow
            $('#dio_political_map .canvas_wrapper').draggable({
                // left, top, right, bottom
                //containment: [-500 * _zoom, -300 * _zoom, 500 * _zoom, 300 * _zoom],
                distance: 10,
                grid: [100 * _zoom, 100 * _zoom],
                //limit: 500,
                cursor: 'pointer'
            });

            var ally_ranking = JSON.parse(_islandArray)['ally_ranking'];
            var island_array = JSON.parse(_islandArray)['ally_island_array'];


            var c = $('#dio_political_map .canv_map')[0].getContext('2d');

            // Grid
            c.strokeStyle = 'rgb(0,100,0)';

            for (var l = 0; l <= 10; l++) {
                // Horizontal Line
                c.moveTo(0, l * 100 * _zoom);
                c.lineTo(1000 * _zoom, l * 100 * _zoom);
                c.stroke();

                // Vertical Line
                c.moveTo(l * 100 * _zoom, 0);
                c.lineTo(l * 100 * _zoom, 1000 * _zoom);
                c.stroke();
            }

            // Center Circle
            c.beginPath();
            c.arc(500 * _zoom, 500 * _zoom, 100 * _zoom, 0, Math.PI * 2, true);
            c.fillStyle = 'rgba(0,100,0,0.2)';
            c.fill();
            c.stroke();

            // Sea numbers
            c.fillStyle = 'rgb(0,100,0)';

            for (var y = 0; y <= 10; y++) {
                for (var x = 0; x <= 10; x++) {
                    c.fillText(y + "" + x, y * 100 * _zoom + 2, x * 100 * _zoom + 10);
                }
            }

            // Alliance Colors
            var colorArray = ["#00A000", "yellow", "red", "rgb(255, 116, 0)", "cyan", "#784D00", "white", "purple", "#0078FF", "deeppink", "darkslategrey"];

            // Islands
            for (var t in island_array) {
                if (island_array.hasOwnProperty(t)) {
                    var tmp_points = 0, dom_ally = "";
                    for (var ally in island_array[t]) {
                        if (island_array[t].hasOwnProperty(ally)) {
                            if (tmp_points < island_array[t][ally] && (ally !== "X") && (ally !== "")) {
                                tmp_points = island_array[t][ally];
                                dom_ally = ally;
                            }
                        }
                    }

                    c.fillStyle = colorArray[parseInt(ally_ranking[dom_ally], 10) - 1] || "darkslategrey";
                    //c.fillRect(t.split("x")[0] * _zoom, t.split("x")[1] * _zoom, 3 * _zoom, 3 * _zoom);

                    //c.beginPath();
                    //console.info(island_array[t]);
                    //c.arc(t.split("x")[0], t.split("x")[1], 2, 0, Math.PI * 2, true);
                    //c.fillRect(t.split("x")[0] * _zoom,t.split("x")[1] * _zoom, 3 * _zoom, 3 * _zoom);
                    //c.fill();

                    // TEST HEATMAP
                    console.debug("Blaaa", c.fillStyle);
                    if (c.fillStyle !== "#2f4f4f") {
                        var color = c.fillStyle;
                        console.debug("Hallo");
                        var radgrad = c.createRadialGradient(t.split("x")[0] * _zoom + 1, t.split("x")[1] * _zoom + 1, 0, t.split("x")[0] * _zoom + 1, t.split("x")[1] * _zoom + 1, 10);
                        radgrad.addColorStop(0, PoliticalMap.convertHexToRgba(color, 0.2));
                        radgrad.addColorStop(0.6, PoliticalMap.convertHexToRgba(color, 0.2));
                        radgrad.addColorStop(1, PoliticalMap.convertHexToRgba(color, 0.0));

                        // draw shape
                        c.fillStyle = radgrad;

                        c.fillRect(t.split("x")[0] * _zoom - 10, t.split("x")[1] * _zoom - 10, 22, 22);

                        c.fillStyle = PoliticalMap.convertHexToRgba(color, 0.7);
                        c.fillRect(t.split("x")[0] * _zoom, t.split("x")[1] * _zoom, 3 * _zoom, 3 * _zoom);
                    }
                    else {
                        c.fillRect(t.split("x")[0] * _zoom, t.split("x")[1] * _zoom, 3 * _zoom, 3 * _zoom);
                    }
                }
            }



            // Legende
            var legend = $('#dio_political_map .legend .content');

            legend.get(0).innerHTML = "";

            for (var ally in ally_ranking) {
                if (ally_ranking.hasOwnProperty(ally)) {
                    //legend.append("<div class='item' style='color:"+ colorAllyArray[ally] +"'><div class='color_checker' style='background-color:"+ colorAllyArray[ally] +"'></div>...</div>");

                    if (ally_ranking[ally] > 10) {
                        legend.append("<div class='item' style='color:" + colorArray[ally_ranking[ally] - 1] + "'><div class='color_checker' style='background-color:" + colorArray[ally_ranking[ally] - 1] + "'></div>...</div>");

                        break;
                    } else {
                        legend.append("<div class='item' style='color:" + colorArray[ally_ranking[ally] - 1] + "'><div class='color_checker' style='background-color:" + colorArray[ally_ranking[ally] - 1] + "'></div>" + ally + "</div>");

                    }
                }
            }

            $('#dio_political_map .legend .color_checker').click(function (event) {
                // getting user coordinates
                var x = event.pageX - this.offsetLeft;
                var y = event.pageY - this.offsetTop;

                console.debug("HALLO 0", event.pageX, this.offsetLeft);

                ColorPicker.open(x,y);
            });


            // TODO: Wenn eine Farbe ausgewählt wurde, soll [...]
            $(ColorPicker).on("onColorChanged", function(event, color){
                console.debug("Farbe setzen", event, color);

                $.ajax({
                    type: "POST",
                    url: "https://" + Game.world_id + ".grepolis.com/game/alliance?town_id=" + Game.townId + "&action=assign_map_color&h=" + Game.csrfToken,
                    data: {
                        "json": "{\"alliance_id\":\"217\",\"color\":"+ color +",\"player_id\":\"8512878\",\"town_id\":\"71047\",\"nl_init\":true}"
                    },
                    success: function (response) {
                        console.debug("Erfolgreich übertragen", response);
                    }
                });
            });

        },
        convertHexToRgba: function (hex, opacity) {
            console.debug("hex", hex);
            hex = hex.replace('#', '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);

            result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
            return result;
        },
        /**
         * Zeichnet die Weltwunder auf der Karte
         *
         * @param _islandArray {Array}
         * @param _zoom {int}
         *
         * @since 3.0
         */
        drawWonders: function (_islandArray, _zoom) {

            $('<canvas class="canv_ww" height="' + (1000 * _zoom) + 'px" width="' + (1000 * _zoom) + 'px"></canvas>').appendTo('.canvas_wrapper')

            var c = $('#dio_political_map .canv_ww')[0].getContext('2d');

            c.strokeStyle = 'rgb(0,100,0)';

            // World Wonders
            var wonders = {}, wonderImages = {};
            //console.debug(JSON.stringify(wonder.map));

            for (var wonderType in wonder.map) {
                if (wonder.map.hasOwnProperty(wonderType)) {
                    var tmp = 0;
                    for (var wonderCoords in wonder.map[wonderType]) {
                        if (parseInt(wonder.map[wonderType][wonderCoords], 10) > tmp) {
                            wonders[wonderType] = wonderCoords;
                            tmp = parseInt(wonder.map[wonderType][wonderCoords], 10)
                        }
                    }
                }
            }

            // Legende
            var legend = $('#dio_political_map .legend .content');

            legend.append("<div class=\"item no_results\"></div>");

            for (var w in wonders) {
                if (wonders.hasOwnProperty(w)) {
                    var _w = w;

                    wonderImages[_w] = new Image();

                    wonderImages[_w].onload = function () {
                        c.drawImage(this, this.pos.split("_")[0] * _zoom - 9, this.pos.split("_")[1] * _zoom - 9);
                    };

                    wonderImages[_w].pos = wonders[_w];
                    wonderImages[_w].src = "https://diotools.de/images/icons/ww/" + _w + ".png";

                    var wonder_string = _w.split("_of")[0].split("_");
                    wonder_string = wonder_string[wonder_string.length - 1];
                    wonder_string = wonder_string.substring(0, 1).toUpperCase() + wonder_string.substring(1);

                    legend.append("<img class='wonder_icon' src='" + wonderImages[_w].src + "'><div class='item'>" + wonder_string + "</div>");
                }
            }
        },
        clearMap: function () {
            $('#dio_political_map .canv_map').remove();
            $('#dio_political_map .canv_ww').remove();
        },
        getAllianceColors: function () {
            $.ajax({
                type: "GET",
                url: "https://" + Game.world_id + ".grepolis.com/game/map_data?town_id=" + Game.townId + "&action=get_custom_colors&h=" + Game.csrfToken,
                dataType: 'json',
                success: function (response) {
                    // Allianzbox herausfiltern
                    var html_string = $('#alliance_box', $(response.json.list_html));

                    var flagArray = $('.flag', html_string);
                    var linkArray = $('a', html_string);

                    var allianceColorArray = [];

                    for (var i = 0; i < flagArray.length; i++) {
                        allianceColorArray[i] = {
                            "id": parseInt(linkArray[i].attributes.onclick.value.split(",")[1].split(")")[0], 10),
                            "color": flagArray[i].style.backgroundColor
                        };
                    }

                    console.debug("ANTWORT", allianceColorArray);
                }
            });
        }
    };

    var ColorPicker = {
        open: function(pos_left, pos_top){
            $('#dio_color_picker').removeClass("hidden");
            $('#dio_color_picker').css({
                left: pos_left,
                top: pos_top
            });
        },
        close: function(){
            $('#dio_color_picker').addClass("hidden");
        },
        init: function () {
            // Style
            $('<style id="dio_color_picker_style">' +
                '#dio_color_picker { left:200px;top:300px;position:absolute;z-index:1000;} ' +
                '#dio_color_picker.hidden { display:none;} ' +
                '#dio_color_picker span.grepo_input, ' +
                '#dio_color_picker a.color_table, ' +
                '#dio_color_picker a.confirm, ' +
                '#dio_color_picker a.cancel' +
                ' { float:left; } ' +
                '</style>').appendTo('head');

            $(
                '<canvas width="600" height="440" style="left:200px !important;top:100px !important;" id="canvas_picker" onclick="console.debug(this.getContext(\'2d\').getImageData(10, 10, 1, 1).data)"></canvas>' +
                '<div id="hex">HEX: <input type="text"></input></div>' +
                '<div id="rgb">RGB: <input type="text"></input></div>'
            ).prependTo('#dio_political_map')

            $(
                '<div id="dio_color_picker" class="hidden"><table class="bb_popup" cellpadding="0" cellspacing="0"><tbody>' +
                '<tr class="bb_popup_top">' +
                '<td class="bb_popup_top_left"></td>' +
                '<td class="bb_popup_top_middle"></td>' +
                '<td class="bb_popup_top_right"></td>' +
                '</tr>' +
                '<tr>' +
                '<td class="bb_popup_middle_left"></td>' +
                '<td class="bb_popup_middle_middle">' +
                '<div class="bb_color_picker_colors">' +
                '<div style="background-color: rgb(255, 0, 0);"></div>' +
                '<div style="background-color: rgb(0, 255, 0);"></div>' +
                '<div style="background-color: rgb(0, 0, 255);"></div>' +
                '</div>' +
                '<a href="#" class="cancel"></a>' +
                '<span class="grepo_input">' +
                '<span class="left">' +
                '<span class="right">' +
                '<input class="color_string" style="width:50px;" maxlength="6" type="text">' +
                '</span>' +
                '</span>' +
                '</span>' +
                '<a href="#" class="color_table"><input type="color" id="c" tabindex=-1 class="hidden"></a>' +
                '<a href="#" class="confirm"></a>' +
                '</td>' +
                '<td class="bb_popup_middle_right"></td>' +
                '</tr>' +
                '<tr class="bb_popup_bottom">' +
                '<td class="bb_popup_bottom_left"></td>' +
                '<td class="bb_popup_bottom_middle"></td>' +
                '<td class="bb_popup_bottom_right"></td>' +
                '</tr>' +
                '</tbody></table></div>'
            ).prependTo('#dio_political_map');

            var canvas = document.getElementById('canvas_picker').getContext('2d');

            var count = 5, line = 0, width = 16, height = 12, sep = 1;

            var offset = (count - 2) * width;

            for (var i = 2, j = 0; i < count; i++, j++) {

                line = 0;

                // Pinktöne (255,0,255)
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", 0, " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(255," + ((j / (count - 1) * 255) | 0) + ", 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Rosatöne (255,0,127)
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", 0, " + ((i / count * 127) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(255," + ((j / (count - 1) * 255) | 0) + "," + (127 + ((j / (count - 1) * 127) | 0)) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Rottöne (255,0,0)
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", 0, 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(255," + ((j / (count - 1) * 255) | 0) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Orangetöne (255, 127, 0)
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", " + ((i / count * 127) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(255, " + (127 + ((j / (count - 1) * 127) | 0)) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Dunkelbrauntöne (170, 85, 0)
                canvas.fillStyle = "rgb(" + ((i / count * 170) | 0) + ", " + ((i / count * 85) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + (170 + (j / (count - 1) * 85) | 0) + ", " + (85 + ((j / (count - 1) * 170) | 0)) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Brauntöne (191, 127, 0)
                canvas.fillStyle = "rgb(" + ((i / count * 191) | 0) + ", " + ((i / count * 127) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + (191 + (j / (count - 1) * 64) | 0) + ", " + (127 + ((j / (count - 1) * 127) | 0)) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Gelbtöne (255,255,0)
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", " + ((i / count * 255) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(255, 255," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Gelbgrüntöne (127,255,0)
                canvas.fillStyle = "rgb(" + ((i / count * 127) | 0) + "," + ((i / count * 191) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + (127 + (j / (count - 1) * 127) | 0) + "," + (191 + (j / (count - 1) * 64) | 0) + "," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Dunkelgrasgrüntöne (85, 170, 0)
                /*
                 canvas.fillStyle = "rgb("+ ((i/count*85)|0) +", "+ ((i/count*170)|0) +", 0)";
                 canvas.fillRect(i * width, line, width-sep, height-sep);

                 canvas.fillStyle = "rgb("+ (85 + (j/(count-1)*170)|0) +", "+ (170 + ((j/(count-1)*85)|0)) +","+ ((j/(count-1)*255)|0) +")";
                 canvas.fillRect(i * width + offset, line, width-sep, height-sep);

                 line = line + height;
                 */

                // Grüntöne (0,255,0)
                canvas.fillStyle = "rgb(0," + ((i / count * 255) | 0) + ", 0)";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + ", 255," + ((j / (count - 1) * 255) | 0) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Türkistöne (0,255,127)
                /*
                 canvas.fillStyle = "rgb(0,"+ ((i/count*255)|0) +","+ ((i/count*127)|0) + ")";
                 canvas.fillRect(i * width, line, width-sep, height-sep);

                 canvas.fillStyle = "rgb("+ ((j/(count-1)*255)|0) +", 255,"+ (127 + ((j/(count-1)*127)|0)) +")";
                 canvas.fillRect(i * width + offset, line, width-sep, height-sep);

                 line = line + height;
                 */

                // Dunkel-Türkistöne (0,191,127)
                canvas.fillStyle = "rgb(0, " + ((i / count * 191) | 0) + "," + ((i / count * 127) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + "," + (191 + (j / (count - 1) * 64) | 0) + ", " + (127 + ((j / (count - 1) * 127) | 0)) + ")";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;


                // Cyantöne (0,255,255)
                canvas.fillStyle = "rgb(0, " + ((i / count * 255) | 0) + ", " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + ",255, 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Hellblautöne (0,127,255)
                canvas.fillStyle = "rgb(0, " + ((i / count * 127) | 0) + "," + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + "," + (127 + ((j / (count - 1) * 127) | 0)) + ", 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Blautöne (0,0,255)
                canvas.fillStyle = "rgb(0, 0, " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + ((j / (count - 1) * 255) | 0) + "," + ((j / (count - 1) * 255) | 0) + ", 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Lilatöne (127,0,255)
                canvas.fillStyle = "rgb(" + ((i / count * 127) | 0) + ", 0, " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width, line, width - sep, height - sep);

                canvas.fillStyle = "rgb(" + (127 + ((j / (count - 1) * 127) | 0)) + "," + ((j / (count - 1) * 255) | 0) + ", 255)";
                canvas.fillRect(i * width + offset, line, width - sep, height - sep);

                line = line + height;

                // Grautöne
                /*
                 canvas.fillStyle = "rgb("+ ((i/count*127)|0) +", "+ ((i/count*127)|0) +", "+ ((i/count*127)|0) +")";
                 canvas.fillRect(i * width, line, width-sep, height-sep);

                 canvas.fillStyle = "rgb("+ (127 + ((j/(count-1)*127)|0)) +","+ (127 + ((j/(count-1)*127)|0)) +","+ (127 + ((j/(count-1)*127)|0)) +")";
                 canvas.fillRect(i * width + offset, line, width-sep, height-sep);

                 line = line + height;
                 */

            }

            line = line + height;

            for (var i = 0; i <= count; i++) {
                // Grautöne
                canvas.fillStyle = "rgb(" + ((i / count * 255) | 0) + ", " + ((i / count * 255) | 0) + ", " + ((i / count * 255) | 0) + ")";
                canvas.fillRect(i * width + width * 2, line, width - sep, height - sep);
            }


            // http://www.javascripter.net/faq/rgbtohex.htm
            function rgbToHex(R, G, B) {
                return toHex(R) + toHex(G) + toHex(B)
            }

            function toHex(n) {
                n = parseInt(n, 10);
                if (isNaN(n)) return "00";
                n = Math.max(0, Math.min(n, 255));
                return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
            }

            $('#dio_color_picker a.cancel').click(function () {
                ColorPicker.close();
            });


            $('#dio_color_picker a.confirm').click(function () {
                // Custom-Event auslösen
                $(ColorPicker).trigger("onColorChanged", [$('#dio_color_picker .color_string')[0].value]);
                ColorPicker.close();
            });

            $('#dio_color_picker a.color_table').click(function () {
                document.getElementById("c").click();
            });

            $('#dio_color_picker a.color_table #c').change(function () {
                $('#dio_color_picker input.color_string')[0].value = this.value;
                $('#dio_color_picker input.color_string')[0].style.color = this.value;
            });
        }
    };

    var UnitImages = {
        activate : function(){
            $('<style id="dio_unit_images">' +

                '.unit_icon25x25 { background-image: url(https://diotools.de/images/game/units/unit_icons_25x25_2.91.png);} ' +
                '.unit_icon40x40 { background-image: url(https://diotools.de/images/game/units/unit_icons_40x40_2.91.png);} ' +
                '.unit_icon50x50 { background-image: url(https://diotools.de/images/game/units/unit_icons_50x50_2.91.png);} ' +
                '.unit_icon90x90 { background-image: url(https://diotools.de/images/game/units/unit_icons_90x90_2.91.png);} ' +

                '.unit_icon228x165 { background-image: none; height:0px;} ' +
                '.unit_card .deco_statue { background-image: none !important;} ' +
                '.grepo_box_silver .border_l, .grepo_box_silver .border_r { background-image: none;} ' +
                '.box_corner .box_corner_tl, .grepo_box_silver .box_corner_tr { height:31px; } ' +
                '.grepo_box_silver .grepo_box_content { padding: 21px 10px 0px; } ' +

                '</style>').appendTo('head');
        },
        deactivate : function(){
            $('#dio_unit_images').remove();

        }
    };

    /*******************************************************************************************************************************
     * Holiday Special
     *******************************************************************************************************************************/

    var HolidaySpecial = {
        isHalloween : false, isXmas : false, isNewYear : false,

        activate : function(){
            var daystamp = 1000*60*60*24, today = new Date((new Date())%(daystamp*(365+1/4))), // without year

                // Halloween -> 15 days
                halloween_start = daystamp * 297, // 25. Oktober
                halloween_end = daystamp * 321, // 8. November
                // Xmas -> 28 days
                xmas_start = daystamp * 334, // 1. Dezember
                xmas_end = daystamp * 361, // 28. Dezember
                // NewYear -> 7 days
                newYear_start = daystamp * 0, // 1. Januar
                newYear_end = daystamp * 7; // 7. Januar

            HolidaySpecial.isHalloween = (today >= halloween_start) ? (today <= halloween_end) : false;

            HolidaySpecial.isXmas = (today >= xmas_start) ? (today <= xmas_end) : false;

            HolidaySpecial.isNewYear = (today >= newYear_start) ? (today <= newYear_end) : false;

            if(HolidaySpecial.isXmas){ HolidaySpecial.XMas.add(); }
            if(HolidaySpecial.isNewYear){ HolidaySpecial.NewYear.add(); }
        },
        XMas : {
            add : function(){
                $('<a href="http://www.greensmilies.com/smilie-album/weihnachten-smilies/" target="_blank"><div id="dio_xmas"></div></a>').appendTo('#ui_box');

                var dioXMAS = $('#dio_xmas');

                dioXMAS.css({
                    background: 'url("http://www.greensmilies.com/smile/smiley_emoticons_weihnachtsmann_nordpol.gif") no-repeat',
                    height: '51px',
                    width: '61px',
                    position:'absolute',
                    bottom:'10px',
                    left:'60px',
                    zIndex:'2000'
                });
                dioXMAS.tooltip("Ho Ho Ho, Merry Christmas!");
            }
        },
        NewYear : {
            add : function(){
                // TODO: Jahreszahl dynamisch setzen
                $('<a href="http://www.greensmilies.com/smilie-album/" target="_blank"><div id="dio_newYear">'+
                '<img src="http://www.greensmilies.com/smile/sign2_2.gif">'+
                '<img src="http://www.greensmilies.com/smile/sign2_0.gif">'+
                '<img src="http://www.greensmilies.com/smile/sign2_1.gif">'+
                '<img src="http://www.greensmilies.com/smile/sign2_6.gif">'+
                '</div></a>').appendTo('#ui_box');

                var dioNewYear = $('#dio_newYear');

                dioNewYear.css({
                    position:'absolute',
                    bottom:'10px',
                    left:'70px',
                    zIndex:'10'
                });
                dioNewYear.tooltip("Happy new year!");
            }
        }
    };

}