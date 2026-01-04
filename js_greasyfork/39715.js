// ==UserScript==
// @name                WME Road History
// @name:pl             WME Road History
// @description         Saves state of roads in area and it finds changes between history snapshots.
// @description:pl      Zapisuje stan obszaru mapy i tworzy historię zmian pomiędzy "migawkami" mapy.
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @version             2018.09.12.01
// @grant               none
// @namespace           https://greasyfork.org/en/scripts/39715-wme-road-history
// @copyright           2015 wlodek76
// @credits             FZ69617 tips and tricks
// @downloadURL https://update.greasyfork.org/scripts/39715/WME%20Road%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/39715/WME%20Road%20History.meta.js
// ==/UserScript==

/* global W */
/* global OL */
/* ecmaVersion 2017 */
/* global $ */
/* global I18n */
/* global require */
/* eslint no-multi-spaces: ["warn", { ignoreEOLComments:true, exceptions: { "VariableDeclarator": true} }]*/
/* eslint curly: ["warn", "multi-or-nest"] */

var wmech_version = "2018.03.18.01";

var epsg900913 = new OL.Projection("EPSG:900913");
var epsg4326   = new OL.Projection("EPSG:4326");

var lang = {code:'en',
              summarystats    : 'Statistic of the latest edits',
              statedits       : ' ed.',
              showcircle      : 'Colorize edits on the map',
              showcircleshort : 'Show short names of editors',
              showcirclelong  : 'Show long names of editors',
              fulltime       : 'Show seconds in timestamps',
              datesdefined   : 'Date range:',
              datesincorrect : 'Incorrect date range in Options!',
              daterange      : 'Date range:',
              showfromdate   : 'From date:',
              showtodate     : 'To date:',
              customize      : 'Customize:',
              rowsperpage    : 'Rows per page: ',
              dbversion      : 'Database version: ',
              dbopenerror    : 'WME Road History\n\nProbably you are trying to run the script with newer version of database. Please update the script to the newest version.',
              reloadsite     : 'WME Road History\n\nDatabase version has been updated. Please refresh the site!',
              closetabs      : 'WME Road History\n\nPlease close all other tabs with this site open!',
              mergedatatip   : 'Merge option compares timestamps between segments. Only segments with the newest timestamp will be uploaded.',
              dberrorlocked  : "ERR: Can't delete a Database. Database is locked or used in other instance of browser!",
              dberrordelete  : "ERR: Can't delete a Database!",
              preparingdatabase : 'Preparing database...',
              clearquestion  : 'Do you want to clear Database before import?',
              mergedata      : 'Merge data into Database',
              exporteddata   : 'Exported records: ',
              importeddata   : 'Processed records: ',
              imports        : 'Import from file...',
              exports        : 'Export to file...',
              options        : 'Options',
              amonly         : 'Tools for Area Managers or L3 editors.',
              trAB           : 'Time Restrictions (A do B):',
              trBA           : 'Time Restrictions (B do A):',
              removedtr      : 'Removed TR turn: ',
              changedtr      : 'Changed TR turn: ',
              addedtr        : 'Added TR turn: ',
              removed_uturn  : 'Removed U-Turn: ',
              added_uturn    : 'Added U-Turn: ',
              veh1           : 'Trucks',
              veh2           : 'Public Transportation',
              veh3           : 'Taxis',
              veh4           : 'Buses',
              veh5           : 'HOV - 2',
              veh6           : 'HOV - 3',
              veh7           : 'RV',
              veh8           : 'Towing vehicles',
              veh9           : 'Motorcycles',
              veh10          : 'Private vehicles',
              veh11          : 'Hazardous materials',
              exceptvehicles : 'Except vehicles: ',
              allweek      : 'All Week',
              day1         : 'Su',
              day2         : 'Mo',
              day3         : 'Tu',
              day4         : 'We',
              day5         : 'Th',
              day6         : 'Fr',
              day7         : 'Sa',
              allday       : 'All Day',
              atob         : 'A to B',
              btoa         : 'B to A',
              none         : 'None',
              trbefore     : 'Time restrictions before:',
              trafter      : 'Time restrictions:',
              tollchange   : 'Changed: ',
              tollpart     : 'Toll Road Partially',
              tollfree     : 'Toll Road Free',
              toll         : 'Toll Road',
              changename   : 'Street: ',
              changecity   : 'City: ',
              level        : 'Level: ',
              changedgeom  : 'Changed geometry',
              into         : 'to ',
              to           : 'to',
              noname       : 'No name',
              removedturn  : 'Removed turn: ',
              addedturn    : 'Added turn: ',
              road1        : 'Street',
              road2        : 'Primary Street',
              road3        : 'Freeway',
              road4        : 'Ramp',
              road5        : 'Walking Trail',
              road6        : 'Major Highway',
              road7        : 'Minor Highway',
              road8        : 'Dirt road / 4x4 Trail',
              road10       : 'Pedestrian Boardwalk',
              road17       : 'Private Road',
              road18       : 'Railroad',
              road19       : 'Runway / Taxiway',
              road20       : 'Parking Lot Road',
              road21       : 'Service Road',
              roadtype     : 'RoadType(',
              dirchange0   : '<b class=wmeroadhistory_error>Removed direction</b>',
              dirchange1   : 'Changed to <b class=wmeroadhistory_error>One-way</b>',
              dirchange2   : 'Changed to <b class=wmeroadhistory_error>Two-way</b>',
              dirchangerev : '<b class=wmeroadhistory_error>Reversed direction</b>',
              dirchangeadd : '<b class=wmeroadhistory_error>Added direction</b>',
              newsegment : 'New',
              sec : 'sec.',
              prev : 'Newest',
              next : 'Oldest',
              stop : 'Stop',
              changes: 'Changes',
              segments: 'Segments',
              edits: 'Edits',
              scanarea: 'Scan Area'
             };
var langPL = {code:'pl',
              summarystats    : 'Statystyka ostatnich edycji',
              statedits       : ' ed.',
              showcircle      : 'Koloruj edycje na mapie',
              showcircleshort : 'Pokaż skrócone nazwy edytorów',
              showcirclelong  : 'Pokaż długie nazwy edytorów',
              fulltime       : 'Pokaż sekundy w znacznikach czasowych',
              datesdefined   : 'Zakres dat:',
              datesincorrect : 'UWAGA: Niewłaściwy zakres dat w Opcjach!',
              daterange      : 'Zakres dat:',
              showfromdate   : "Od dnia:",
              showtodate     : "Do dnia:",
              customize      : 'Dostosuj ustawienia:',
              rowsperpage    : 'Ilość wierszy na stronie: ',
              dbversion      : 'Wersja bazy danych: ',
              dbopenerror    : 'WME Road History\n\nPrawdopodobnie próbujesz uruchomić starszą wersję skryptu na nowszej bazie danych. Zaktualizuj skrypt do najnowszej wersji.',
              reloadsite     : 'WME Road History\n\nWersja bazy danych została zaktualizowana. Proszę odświeżyć stronę!',
              closetabs      : 'WME Road History\n\nBaza danych wymaga aktualizacji. Proszę zamknąć stronę na pozostałych zakładkach przeglądarki!',
              mergedatatip   : 'Opcja dołączania danych porównuje znaczniki czasowe segmentów. Tylko najnowsze segmenty będą zaimportowane.',
              dberrorlocked  : "ERR: Nie mogę skasować Bazy danych.<br>Baza danych jest zablokowana lub używana przez inną instancję przeglądarki!",
              dberrordelete  : "ERR: Nie mogę skasować Bazy danych!",
              preparingdatabase : 'Przygotowywanie bazy danych...',
              clearquestion  : 'Czy wyczyścić Bazę danych przed importem?',
              mergedata      : 'Dołącz dane do Bazy danych',
              exporteddata   : 'Wyeksportowano rekordów: ',
              importeddata   : 'Przetworzono rekordów: ',
              imports        : 'Import z pliku...',
              exports        : 'Eksport do pliku...',
              options        : 'Opcje',
              amonly         : 'Narzędzie przeznaczone dla Area Manager lub edytorów L3.',
              trAB           : 'Ograniczenia czasowe (A do B):',
              trBA           : 'Ograniczenia czasowe (B do A):',
              removedtr      : 'Usunięty TR skrętu: ',
              changedtr      : 'Zmieniony TR skrętu: ',
              addedtr        : 'Dodany TR skrętu: ',
              removed_uturn  : 'Usunięte zawracanie: ',
              added_uturn    : 'Dodane zawracanie: ',
              veh1           : 'Ciężarówki',
              veh2           : 'Transport Publiczny',
              veh3           : 'Taksówki',
              veh4           : 'Autobusy',
              veh5           : 'Więcej niż 2 pasażerów (HOV - 2)',
              veh6           : 'Więcej niż 3 pasażerów (HOV - 3)',
              veh7           : 'Kamper',
              veh8           : 'Pojazdy holujące',
              veh9           : 'Motocykle',
              veh10          : 'Samochody prywatne',
              veh11          : 'Materiały niebezpieczne',
              exceptvehicles : 'Z wyjątkiem pojazdów: ',
              allweek      : 'Każdy tydzień',
              day1         : 'Nd',
              day2         : 'Pon',
              day3         : 'Wt',
              day4         : 'Śr',
              day5         : 'Czw',
              day6         : 'Pt',
              day7         : 'Sob',
              allday       : 'Cały dzień',
              atob         : 'A do B',
              btoa         : 'B do A',
              none         : 'Brak',
              trbefore     : 'Poprzednie ograniczenia czasowe:',
              trafter      : 'Ograniczenia czasowe:',
              tollchange   : 'Zmiana: ',
              tollpart     : 'Droga częściowo płatna',
              tollfree     : 'Droga bezpłatna',
              toll         : 'Droga płatna',
              changename   : 'Nazwa: ',
              changecity   : 'Miasto: ',
              level        : 'Poziom: ',
              changedgeom  : 'Zmiana geometrii',
              into         : 'w ',
              to           : 'do',
              noname       : 'Bez nazwy',
              removedturn  : 'Usunięto skręt: ',
              addedturn    : 'Dodano skręt: ',
              road1        : 'Ulica',
              road2        : 'Główna ulica',
              road3        : 'Autostrada / Droga ekspresowa',
              road4        : 'Wjazd / Zjazd',
              road5        : 'Ścieżka dla pieszych',
              road6        : 'Droga krajowa',
              road7        : 'Droga wojewódzka',
              road8        : 'Droga gruntowa',
              road10       : 'Deptak',
              road17       : 'Droga prywatna',
              road18       : 'Tory kolejowe / tramwajowe',
              road19       : 'Pas startowy / Droga kołowania',
              road20       : 'Droga wewnętrzna',
              road21       : 'Droga serwisowa',
              roadtype     : 'RoadType(',
              dirchange0   : '<b class=wmeroadhistory_error>Usunięto kierunkowość</b>',
              dirchange1   : 'Zmieniono na <b class=wmeroadhistory_error>Jednokierunkowa</b>',
              dirchange2   : 'Zmieniono na <b class=wmeroadhistory_error>Dwukierunkowa</b>',
              dirchangerev : '<b class=wmeroadhistory_error>Odwrócono kierunkowość</b>',
              dirchangeadd : '<b class=wmeroadhistory_error>Dodano kierunkowość</b>',
              newsegment : 'Nowy',
              sec : 'sek.',
              prev : 'Nowsze',
              next : 'Starsze',
              stop : 'Stop',
              changes: 'Zmiany',
              segments: 'Segmentów',
              edits: 'Edycje',
              scanarea: 'Skanuj Obszar'
             };

var DIFF_DIR    = 0x01;
var DIFF_TYPE   = 0x02;
var DIFF_TURNS  = 0x04;
var DIFF_NAMES  = 0x08;
var DIFF_CITY   = 0x10;
var DIFF_TR     = 0x20;
var DIFF_LEVEL  = 0x40;
var DIFF_GEOM   = 0x80;
var DIFF_TOLL   = 0x100;
var DIFF_TS     = 0x200;

var last_LONLAT;
var last_ZOOM;
var wazepending;
var rec_xy1;
var rec_xy2;
var rec = false;
var rec_direction = 1;
var scanned_segments_list = {};      // zastosowanie tablicy obiektów jest szybsze wydajnościowo podczas przeszukiwania tablicy
var scanned_segments = 0;
var scanned_segments_prev = 0;
var added_segments = 0;
var added_segments_prev = 0;
var added_changes = 0;
var added_changes_prev = 0;
var rec_zoom = 5;
var rec_elapsed_time = 0;
var wazeDataBaseName = 'wazeDB';
var wazeDB;
var readconfig = 0;
var LastTimeScan = 0;
var ShowHistMode = 2;
var pageEdits    = 0;
var prevScroll = 0;
var userinfoDispPrev = '';
var showturn    = [0,0,0,0];
var importlines = new Array();
var importcount = 0;
var importmaxcount = 0;
var importchunk = 0;
var importpercent = -1;
var importbrowser = 0;
var chunkdata = 0;
var ICONMODE = 0;   // 0: oznacza że skrypt użyje linii do pokazania zmian na mapie 1: oznacza, że zmiany na mapie zostaną pokazane jako ikonki
var markerskey = {};
var markersseg = {};
var markersadd = [];
var stats = {};
var updatestatsdelay = 0;
var ventCount = 0;
var scanprocentyPrev  = 0;
var scanprocentyDelta = 0;
var scanprocPrev = 0;
var scanproc = '';
var LOOPTIMER = 100;

/*----------------------------------------------------------------------------------------------------------
 FileSaver.js Javascript Component
 Copyright © 2015 Eli Grey.

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without
 limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
------------------------------------------------------------------------------------------------------------*/
var saveAs = saveAs
// IE 10+ (native saveAs)
|| (typeof navigator !== "undefined" &&
    navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
// Everyone else
|| (function(view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent))
        return;

    var doc = view.document
    // only get URL when necessary in case Blob.js hasn't overridden it yet
    , get_URL = function() {
        return view.URL || view.webkitURL || view;
    }
    , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
    , can_use_save_link = "download" in save_link
    , click = function(node) {
        var event = doc.createEvent("MouseEvents");
        event.initMouseEvent(
            "click", true, false, view, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
        node.dispatchEvent(event);
    }
    , webkit_req_fs = view.webkitRequestFileSystem
    , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
    , throw_outside = function(ex) {
        (view.setImmediate || view.setTimeout)(function() {
            throw ex;
        }, 0);
    }
    , force_saveable_type = "application/octet-stream"
    , fs_min_size = 0
    // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
    // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
    // for the reasoning behind the timeout and revocation flow
    , arbitrary_revoke_timeout = 500 // in ms
    , revoke = function(file) {
        var revoker = function() {
            if (typeof file === "string") { // file is an object URL
                get_URL().revokeObjectURL(file);
            } else { // file is a File
                file.remove();
            }
        };
        if (view.chrome)
            revoker();
        else
            setTimeout(revoker, arbitrary_revoke_timeout);
    }
    , dispatch = function(filesaver, event_types, event) {
        event_types = [].concat(event_types);
        var i = event_types.length;
        while (i--) {
            var listener = filesaver["on" + event_types[i]];
            if (typeof listener === "function") {
                try {
                    listener.call(filesaver, event || filesaver);
                } catch (ex) {
                    throw_outside(ex);
                }
            }
        }
    }
    , FileSaver = function(blob, name) {
        // First try a.download, then web filesystem, then object URLs
        var
        filesaver = this
        , type = blob.type
        , blob_changed = false
        , object_url
        , target_view
        , dispatch_all = function() {
            dispatch(filesaver, "writestart progress write writeend".split(" "));
        }
        // on any filesys errors revert to saving with object URLs
        , fs_error = function() {
            // don't create more object URLs than needed
            if (blob_changed || !object_url)
                object_url = get_URL().createObjectURL(blob);
            if (target_view)
                target_view.location.href = object_url;
            else {
                var new_tab = view.open(object_url, "_blank");
                if (new_tab == undefined && typeof safari !== "undefined") {
                    //Apple do not allow window.open, see http://bit.ly/1kZffRI
                    view.location.href = object_url
                }
            }
            filesaver.readyState = filesaver.DONE;
            dispatch_all();
            revoke(object_url);
        }
        , abortable = function(func) {
            return function() {
                if (filesaver.readyState !== filesaver.DONE)
                    return func.apply(this, arguments);
            };
        }
        , create_if_not_found = {create: true, exclusive: false}
        , slice
        ;
        filesaver.readyState = filesaver.INIT;
        if (!name)
            name = "download";
        if (can_use_save_link) {
            object_url = get_URL().createObjectURL(blob);
            save_link.href = object_url;
            save_link.download = name;
            click(save_link);
            filesaver.readyState = filesaver.DONE;
            dispatch_all();
            revoke(object_url);
            return;
        }
        // prepend BOM for UTF-8 XML and text/plain types
        if (/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type))
            blob = new Blob(["\ufeff", blob], {type: blob.type});

        // Object and web filesystem URLs have a problem saving in Google Chrome when
        // viewed in a tab, so I force save with application/octet-stream
        // http://code.google.com/p/chromium/issues/detail?id=91158
        // Update: Google errantly closed 91158, I submitted it again:
        // https://code.google.com/p/chromium/issues/detail?id=389642
        if (view.chrome && type && type !== force_saveable_type) {
            slice = blob.slice || blob.webkitSlice;
            blob = slice.call(blob, 0, blob.size, force_saveable_type);
            blob_changed = true;
        }
        // Since I can't be sure that the guessed media type will trigger a download
        // in WebKit, I append .download to the filename.
        // https://bugs.webkit.org/show_bug.cgi?id=65440
        if (webkit_req_fs && name !== "download")
            name += ".download";
        if (type === force_saveable_type || webkit_req_fs)
            target_view = view;
        if (!req_fs) {
            fs_error();
            return;
        }
        fs_min_size += blob.size;
        req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
            fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
                var save = function() {
                    dir.getFile(name, create_if_not_found, abortable(function(file) {
                        file.createWriter(abortable(function(writer) {
                            writer.onwriteend = function(event) {
                                target_view.location.href = file.toURL();
                                filesaver.readyState = filesaver.DONE;
                                dispatch(filesaver, "writeend", event);
                                revoke(file);
                            };
                            writer.onerror = function() {
                                var error = writer.error;
                                if (error.code !== error.ABORT_ERR)
                                    fs_error();
                            };
                            "writestart progress write abort".split(" ").forEach(function(event) {
                                writer["on" + event] = filesaver["on" + event];
                            });
                            writer.write(blob);
                            filesaver.abort = function() {
                                writer.abort();
                                filesaver.readyState = filesaver.DONE;
                            };
                            filesaver.readyState = filesaver.WRITING;
                        }), fs_error);
                    }), fs_error);
                };
                dir.getFile(name, {create: false}, abortable(function(file) {
                    // delete file if it already exists
                    file.remove();
                    save();
                }), abortable(function(ex) {
                    if (ex.code === ex.NOT_FOUND_ERR)
                        save();
                    else
                        fs_error();
                }));
            }), fs_error);
        }), fs_error);
    }
    , FS_proto = FileSaver.prototype
    , saveAs = function(blob, name) {
        return new FileSaver(blob, name);
    }
    ;
    FS_proto.abort = function() {
        var filesaver = this;
        filesaver.readyState = filesaver.DONE;
        dispatch(filesaver, "abort");
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
        FS_proto.onwritestart =
        FS_proto.onprogress =
        FS_proto.onwrite =
        FS_proto.onabort =
        FS_proto.onerror =
        FS_proto.onwriteend =
        null;

    return saveAs;
}(
    typeof self !== "undefined" && self
    || typeof window !== "undefined" && window
    || this.content
));
//------------------------------------------------------------------------------------------------
window.indexedDB      = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB)
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
//------------------------------------------------------------------------------------------------
var docurl = window.document.URL;
if (docurl.indexOf( "/pl/" ) >=0 ) lang = langPL;
//------------------------------------------------------------------------------------------------
var openrequest = window.indexedDB.open( wazeDataBaseName, 2 );

openrequest.onsuccess = function(event) {
    wazeDB = event.target.result;
    console.log("WMERoadHistory.DataBase.Init.OK = ", openrequest.result.name, wazeDB.version );
};

openrequest.onblocked = function(event) {
    //alert( lang.closetabs );
};

openrequest.onerror = function(event) {
    alert(lang.dbopenerror);
};

openrequest.onupgradeneeded = function(event) {

    var db = event.target.result;
    console.log("WMERoadHistory.DataBase.Upgrade: ", db);

    var storeSEG = false;
    var storeCHG = false;
    var stores = db.objectStoreNames;
    for(var n=0; n<stores.length; n++) {
        if ( stores[n] == 'segments') storeSEG = true;
        if ( stores[n] == 'changes') storeCHG = true;
    }

    if (storeSEG) {
    }
    else {
        var newStore = db.createObjectStore("segments", { keyPath: "ID", autoIncrement: false });
        newStore.createIndex("T", "T", { unique: false });
    }

    if (storeCHG) {
        var currentStore = event.currentTarget.transaction.objectStore("changes");

        var nameID = '';
        var nameT  = '';
        for(let n=0; n<currentStore.indexNames.length; n++) {
            var name = currentStore.indexNames[n];
            if (name == 'ID') nameID = name;
            if (name == 'T') nameT = name;
        }
        if (nameT == '') currentStore.createIndex("T", "T", { unique: false });
        if (nameID == '') currentStore.createIndex("ID", "ID", { unique: false });
    }
    else {
        let newStore = db.createObjectStore("changes", { keyPath: "nr", autoIncrement: true });
        newStore.createIndex("T",    "T",   { unique: false });
        newStore.createIndex("ID",   "ID",  { unique: false });
    }
}
//------------------------------------------------------------------------------------------------
function bootstrapWMERoadHistory()
{
    if(!window.W.map) {
        console.log('WME Road History: Waiting for WME...');
        setTimeout(bootstrapWMERoadHistory, 1000);
        return;
    }

    window.addEventListener("beforeunload", saveOptions, true);

    setTimeout(initialiseWMERoadHistory, 1000);
}
//------------------------------------------------------------------------------------------------
function saveOptions() {

    var options = '';

    var opt0  = getId('_wmeRoadHistoryRows');
    var opt1  = getId('_wmeRoadHistoryFromYear');
    var opt2  = getId('_wmeRoadHistoryFromMonth');
    var opt3  = getId('_wmeRoadHistoryFromDay');
    var opt4  = getId('_wmeRoadHistoryToYear');
    var opt5  = getId('_wmeRoadHistoryToMonth');
    var opt6  = getId('_wmeRoadHistoryToDay');
    var opt7  = getId('_wmeRoadHistoryDateRange');
    var opt8  = getId('_wmeRoadHistoryFullTime');
    var opt9  = getId('_wmeRoadHistoryShowCircle');
    var opt10 = getId('_wmeRoadHistoryShowCircleShort');
    var opt11 = getId('_wmeRoadHistoryShowCircleLong');
    var opt12 = getId('_wmeRoadHistorySummaryStats');

    if (opt0  != undefined) options += opt0.value    + "|";
    if (opt1  != undefined) options += opt1.value    + "|";
    if (opt2  != undefined) options += opt2.value    + "|";
    if (opt3  != undefined) options += opt3.value    + "|";
    if (opt4  != undefined) options += opt4.value    + "|";
    if (opt5  != undefined) options += opt5.value    + "|";
    if (opt6  != undefined) options += opt6.value    + "|";
    if (opt7  != undefined) options += opt7.checked  + "|";
    if (opt8  != undefined) options += opt8.checked  + "|";
    if (opt9  != undefined) options += opt9.checked  + "|";
    if (opt10 != undefined) options += opt10.checked + "|";
    if (opt11 != undefined) options += opt11.checked + "|";
    if (opt12 != undefined) options += opt12.checked + "|";

    localStorage.setItem('WMERoadHistoryOptions', options );
}
//------------------------------------------------------------------------------------------------
function loadOptions() {

    if (localStorage.WMERoadHistoryOptions) {
        var options = localStorage.WMERoadHistoryOptions.split('|');

        if (options[0])  getId('_wmeRoadHistoryRows').value              =  options[0];
        if (options[1])  getId('_wmeRoadHistoryFromYear').value          =  options[1];
        if (options[2])  getId('_wmeRoadHistoryFromMonth').value         =  options[2];
        if (options[3])  getId('_wmeRoadHistoryFromDay').value           =  options[3];
        if (options[4])  getId('_wmeRoadHistoryToYear').value            =  options[4];
        if (options[5])  getId('_wmeRoadHistoryToMonth').value           =  options[5];
        if (options[6])  getId('_wmeRoadHistoryToDay').value             =  options[6];
        if (options[7])  getId('_wmeRoadHistoryDateRange').checked       = (options[7]  == 'true');
        if (options[8])  getId('_wmeRoadHistoryFullTime').checked        = (options[8]  == 'true');
        if (options[9])  getId('_wmeRoadHistoryShowCircle').checked      = (options[9]  == 'true');
        if (options[10]) getId('_wmeRoadHistoryShowCircleShort').checked = (options[10] == 'true');
        if (options[11]) getId('_wmeRoadHistoryShowCircleLong').checked  = (options[11] == 'true');
        if (options[12]) getId('_wmeRoadHistorySummaryStats').checked    = (options[12] == 'true');
    }
}
//------------------------------------------------------------------------------------------------
function getElementsByClassName(classname, node) {
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (let i=0,j=els.length; i<j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
    return a;
}
//--------------------------------------------------------------------------------------------------------
function getId(node) {
    return document.getElementById(node);
}
//--------------------------------------------------------------------------------------------------------
function precFloat(f, prec)
{
    if (!isFinite(f)) return "&mdash;";

    if (f < 0)
        f -= Math.pow(0.1, prec) * 0.5;
    else
        f += Math.pow(0.1, prec) * 0.5;

    var ipart = parseInt(f);
    var fpart = Math.abs(f - ipart);
    f = ipart;

    if (fpart == '0') fpart = '0.0';
    fpart += '0000000000000000';
    if (prec) f += fpart.substr(1, prec + 1);

    return f;
}
//--------------------------------------------------------------------------------------------------------
function createCRC32() {
    var c, i, j,
        crcTable = [];
    for (i = 0; i < 256; i++) {
        c = i;
        for (j = 0; j < 8; j++)
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        crcTable[i] = c;
    }

    return function (str) {
        var i,
            crc = 0 ^ (-1);

        for (i = 0; i < str.length; i++)
            crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];

        return (crc ^ (-1)) >>> 0;
    };
}
//--------------------------------------------------------------------------------------------------------
var crc32 = createCRC32();
//--------------------------------------------------------------------------------------------------------
function updateSaveButton() {
    var obj = getId('wmeroadhistory_scanarea');
    if (rec == true) {
        obj.style.backgroundColor = '#C00000';
        obj.style.color           = '#FFFFFF';
        obj.innerHTML             = lang.stop;
    }
    else {
        obj.style.backgroundColor = '';
        obj.style.color           = '';
        obj.innerHTML             = lang.scanarea;
    }
}
//--------------------------------------------------------------------------------------------------------
function stopRec(finished) {
    var WM = window.W.map;

    rec = false;
    updateSaveButton(rec);

    WM.panTo(last_LONLAT);
    WM.zoomTo(last_ZOOM);

    if (ShowHistMode == 3) ShowHistMode = 2;
    if (ShowHistMode == 0) wmeroadhistoryTAB2();
    if (ShowHistMode == 1) wmeroadhistoryTAB1();
    if (ShowHistMode == 2) wmeroadhistoryTAB2();
}
//--------------------------------------------------------------------------------------------------------
function getMidPointLen(seg) {

    var points, p1, p2;
    points = seg.geometry.components.length;

    var x      = 0;
    var y      = 0;
    var length = 0;

    if (points == 2) {
        p1 = seg.geometry.components[0];
        p2 = seg.geometry.components[1];

        x = p1.x + (p2.x - p1.x) * 0.5;
        y = p1.y + (p2.y - p1.y) * 0.5;

        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        length += Math.sqrt(dx*dx + dy*dy);
    }
    else {

        for(let i=0; i<points-1; i++) {
            p1 = seg.geometry.components[i + 0];
            p2 = seg.geometry.components[i + 1];

            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;
            length += Math.sqrt(dx*dx + dy*dy);
        }
        var midlen = length / 2.0;

        var length1 = 0;
        var length2 = 0;
        for(let i=0; i<points-1; i++) {
            p1 = seg.geometry.components[i + 0];
            p2 = seg.geometry.components[i + 1];
            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;
            length1 = length2;
            length2 = length2 + Math.sqrt(dx*dx + dy*dy);

            if (midlen >= length1 && midlen < length2) {
                var proc = (midlen - length1) / (length2 - length1);
                x = p1.x + (p2.x - p1.x) * proc;
                y = p1.y + (p2.y - p1.y) * proc;
            }
        }
    }

    return { x:x, y:y, d:length};
}
//------------------------------------------------------------------------------------------------
function merge_imported_change_DB_Sync(item) {

    var objstore = wazeDB.transaction( 'changes', 'readonly').objectStore('changes');
    var range = IDBKeyRange.only( item.ID );
    var index = objstore.index( 'ID' );

    var idexists     = false;
    var foundthesame = false;

    index.openCursor(range, "next").onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            idexists = true;

            var rekord = cursor.value;
            var diff = false;

            if (rekord.E != item.E) diff = true;
            if (rekord.D != item.D) diff = true;
            if (rekord.x != item.x) diff = true;
            if (rekord.y != item.y) diff = true;
            if (rekord.N != item.N) diff = true;
            if (rekord.C != item.C) diff = true;
            if (rekord.K != item.K) diff = true;
            if (rekord.Q != item.Q) diff = true;

            if (rekord.drA  != item.drA)  diff = true;
            if (rekord.drB  != item.drB)  diff = true;
            if (rekord.tyA  != item.tyA)  diff = true;
            if (rekord.tyB  != item.tyB)  diff = true;
            if (rekord.arA  != item.arA)  diff = true;
            if (rekord.arB  != item.arB)  diff = true;
            if (rekord.naA  != item.naA)  diff = true;
            if (rekord.naB  != item.naB)  diff = true;
            if (rekord.ciA  != item.ciA)  diff = true;
            if (rekord.ciB  != item.ciB)  diff = true;
            if (rekord.trA  != item.trA)  diff = true;
            if (rekord.trB  != item.trB)  diff = true;
            if (rekord.tsA  != item.tsA)  diff = true;
            if (rekord.tsB  != item.tsB)  diff = true;
            if (rekord.lvA  != item.lvA)  diff = true;
            if (rekord.lvB  != item.lvB)  diff = true;
            if (rekord.geA  != item.geA)  diff = true;
            if (rekord.geB  != item.geB)  diff = true;
            if (rekord.tolA != item.tolA) diff = true;
            if (rekord.tolB != item.tolB) diff = true;

            if (!diff) foundthesame = true;

            cursor.continue();
        }
        else {
            if (idexists) {
                if (foundthesame) {
                    getId('wmerh_progress_info').innerHTML = lang.importeddata + (importcount - importchunk) + ' / ' + (importmaxcount - 2);
                    setTimeout(wmeroadhistoryIMPORTLOOP, 1);
                }
                else {

                    let objectStore = wazeDB.transaction('changes', 'readwrite').objectStore('changes');
                    let request = objectStore.put( item );
                    request.onsuccess = function() {
                        getId('wmerh_progress_info').innerHTML = lang.importeddata + (importcount - importchunk) + ' / ' + (importmaxcount - 2);
                        setTimeout(wmeroadhistoryIMPORTLOOP, 1);
                    }
                }
            }
            else {
                let objectStore = wazeDB.transaction('changes', 'readwrite').objectStore('changes');
                let request = objectStore.put( item );
                request.onsuccess = function() {
                    getId('wmerh_progress_info').innerHTML = lang.importeddata + (importcount - importchunk) + ' / ' + (importmaxcount - 2);
                    setTimeout(wmeroadhistoryIMPORTLOOP, 1);
                }
            }
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function changesDB(diff, segID, segtime, segeditor, segx, segy, segnames, segcity, before, after, segkind, segequal) {

    var item = { ID: segID, T: segtime, E: segeditor, D: diff, x: segx, y: segy, N: segnames, C: segcity, K: segkind, Q: segequal};
    if (diff & DIFF_DIR)   item.drA   = before.D;
    if (diff & DIFF_DIR)   item.drB   =  after.D;
    if (diff & DIFF_TYPE)  item.tyA   = before.K;
    if (diff & DIFF_TYPE)  item.tyB   =  after.K;
    if (diff & DIFF_TURNS) item.arA   = before.A;
    if (diff & DIFF_TURNS) item.arB   =  after.A;
    if (diff & DIFF_NAMES) item.naA   = before.N;
    if (diff & DIFF_NAMES) item.naB   =  after.N;
    if (diff & DIFF_CITY)  item.ciA   = before.C;
    if (diff & DIFF_CITY)  item.ciB   =  after.C;
    if (diff & DIFF_TR)    item.trA   = before.TR;
    if (diff & DIFF_TR)    item.trB   =  after.TR;
    if (diff & DIFF_TS)    item.tsA   = before.TS;
    if (diff & DIFF_TS)    item.tsB   =  after.TS;
    if (diff & DIFF_LEVEL) item.lvA   = before.L;
    if (diff & DIFF_LEVEL) item.lvB   =  after.L;
    if (diff & DIFF_GEOM)  item.geA   = before.G;
    if (diff & DIFF_GEOM)  item.geB   =  after.G;
    if (diff & DIFF_TOLL)  item.tolA  = before.TL;
    if (diff & DIFF_TOLL)  item.tolB  =  after.TL;

    var objectStore = wazeDB.transaction('changes', 'readwrite').objectStore('changes');
    var request = objectStore.add( item );
    request.onsuccess = function() {
        added_changes++;
    }
    request.onerror = function() {
    }
}
//--------------------------------------------------------------------------------------------------------
function addDB(segID, roadtime, roadeditor, roaddir, roadkind, roadarrows, roadnames, roadcity, roadtr, roadts, roadlevel, roadgeom, roadgeom2, roadtoll, roadx, roady, roadequal, roadpoints) {

    var objectStore = wazeDB.transaction('segments', 'readwrite').objectStore('segments');
    var request = objectStore.get( segID );
    request.onsuccess = function() {
        if(request.result) {
            var item = { ID: segID, T: roadtime, E: roadeditor, D: roaddir, K: roadkind, A: roadarrows, N: roadnames, C: roadcity, TR: roadtr, TS: roadts, L: roadlevel, G: roadgeom2, TL: roadtoll, x: roadx, y: roady, Q:roadequal, P:roadpoints };
            var rekord = request.result;

            var diff = 0;
            if (roaddir     != rekord.D)   diff |= DIFF_DIR;
            if (roadkind    != rekord.K)   diff |= DIFF_TYPE;
            if (roadarrows  != rekord.A)   {
                //sortowanie i ujednolicenie rekordów przed porównaniem
                //z powodu różnej kolejności zmiennych na różnych platformach Chrome/Firefox
                if (roadarrows.length == rekord.A.length) {
                    var a = roadarrows.split('·');
                    var b = rekord.A.split('·');
                    a.sort();
                    b.sort();
                    if (a.toString() != b.toString())
                        diff |= DIFF_TURNS;
                }
                else
                    diff |= DIFF_TURNS;
            }
            if (roadnames != rekord.N)   {
                //poprawione porównywanie nazw Alt, zdarza się, że nazwy w Alt potrafią być zwrócone przez mechanizm WME w innej przypadkowej kolejności!
                var names1 = roadnames.split(',');
                var names2 = rekord.N.split(',');
                names1.sort();
                names2.sort();
                if (names1.toString() != names2.toString())
                    diff |= DIFF_NAMES;
            }
            if (roadcity != rekord.C) diff |= DIFF_CITY;

            //posortowanie i porównanie wpisów zawierających ograniczenia bazujące na czasie, mogą być w różnej kolejności zwrócone przez mechanizm WME
            //kolejność ograniczeń na liście nie ma znaczenia są traktowane operatorem logicznym OR
            //zmiana tej kolejności nie powinna być odnotowana jako zmiana edycyjna przez skrypt stąd wcześniejsze posortowanie i dopiero porównanie danych
            if (roadtr != rekord.TR)  {
                var tab1 = roadtr.split('²');
                var tab2 = rekord.TR.split('²');
                tab1.sort();
                tab2.sort();
                var vstr1 = '';
                var vstr2 = '';
                for(let i=0; i<tab1.length; i++) {
                    let v = tab1[i].split('¹');
                    v.sort();
                    vstr1 += v.toString();
                }
                for(let i=0; i<tab2.length; i++) {
                    let v = tab2[i].split('¹');
                    v.sort();
                    vstr2 += v.toString();
                }
                if (vstr1.toString() != vstr2.toString())
                    diff |= DIFF_TR;
            }

            //posortowanie i porównanie wpisów zawierających ograniczenia dla skrętów, mogą być w różnej kolejności zwrócone przez mechanizm WME
            //kolejność ograniczeń na liście nie ma znaczenia są traktowane operatorem logicznym OR
            //zmiana tej kolejności nie powinna być odnotowana jako zmiana edycyjna przez skrypt stąd wcześniejsze posortowanie i dopiero porównanie danych
            if (roadts != rekord.TS)  {
                let tab1 = roadts.split('²');
                let tab2 = rekord.TS.split('²');
                tab1.sort();
                tab2.sort();
                let vstr1 = '';
                let vstr2 = '';
                for(let i=0; i<tab1.length; i++) {
                    let v = tab1[i].split('¹');
                    v.sort();
                    vstr1 += v.toString();
                }
                for(let i=0; i<tab2.length; i++) {
                    let v = tab2[i].split('¹');
                    v.sort();
                    vstr2 += v.toString();
                }
                if (vstr1.toString() != vstr2.toString())
                    diff |= DIFF_TS;
            }

            if (roadlevel != rekord.L) diff |= DIFF_LEVEL;
            //porównanie dwóch sum kontrolnych w starej i nowej wersji
            if (roadgeom != rekord.G && roadgeom2 != rekord.G) {
                //sprawdzenie czy wraz ze zmianą geometrii zmienił się również znacznik czasowy
                //czy różnica jest wynikiem błędu zaokrąglenia starej sumy
                if (roadtime != rekord.T) {
                    diff |= DIFF_GEOM;
                }
            }
            if (roadtoll != rekord.TL) diff |= DIFF_TOLL;

            if (diff) {
                if (roadtime == rekord.T) {
                    let t = new Date();
                    roadtime = parseInt(t.getTime() / 1000);
                    roadeditor = '?';
                }

                changesDB(diff, segID, roadtime, roadeditor, roadx, roady, roadnames, roadcity, rekord, item, roadkind, roadequal);
            }

            //aktualizacja rekordu w bazie danych zawsze
            objectStore.put( item );
            scanned_segments++;
        }
        else {
            added_segments++;

            let item = { ID: segID, T: roadtime, E: roadeditor, D: roaddir, K: roadkind, A: roadarrows, N: roadnames, C: roadcity, TR: roadtr, TS:roadts, L: roadlevel, G: roadgeom2, TL: roadtoll, x: roadx, y: roady, Q:roadequal, P:roadpoints };
            objectStore.put( item );
            scanned_segments++;
        }
    }
    request.onerror = function() {
    }
}
//--------------------------------------------------------------------------------------------------------
function SCAN_SEGMENTS() {
    let segments = W.model.segments.getObjectArray();

    for(let i=0;i<segments.length;i++){//(var seg in W.model.segments.getObjectArray()) {
        var segment    = segments[i]; //W.model.segments.getObjectById(seg);
        var attributes = segment.attributes;
        var line       = getId(segment.geometry.id);
        var segID      = attributes.id;

        if (line !== null && segID !== null) {
            if (scanned_segments_list[segID] === undefined) {
                scanned_segments_list[segID] = 1;

                var xyd = getMidPointLen( segment );
                var roadx = parseInt( xyd.x );
                var roady = parseInt( xyd.y );

                var roadpoints = [];
                var points = attributes.geometry.components;
                var num = points.length;
                roadpoints.push ( parseInt(points[0].x + 0.5) );
                roadpoints.push ( parseInt(points[0].y + 0.5) );
                roadpoints.push ( parseInt(points[num-1].x + 0.5) );
                roadpoints.push ( parseInt(points[num-1].y + 0.5) );

                //sprawdzenie czy oba końce drogi są poza skanowanym obszarem mapy
                var both_ends_behind_scanarea = 0;
                if (roadpoints[0] < rec_xy1.lon) both_ends_behind_scanarea |= 1;
                if (roadpoints[0] > rec_xy2.lon) both_ends_behind_scanarea |= 1;
                if (roadpoints[2] < rec_xy1.lon) both_ends_behind_scanarea |= 2;
                if (roadpoints[2] > rec_xy2.lon) both_ends_behind_scanarea |= 2;
                if (roadpoints[1] > rec_xy1.lat) both_ends_behind_scanarea |= 1;
                if (roadpoints[1] < rec_xy2.lat) both_ends_behind_scanarea |= 1;
                if (roadpoints[3] > rec_xy1.lat) both_ends_behind_scanarea |= 2;
                if (roadpoints[3] < rec_xy2.lat) both_ends_behind_scanarea |= 2;
                if (both_ends_behind_scanarea == 3) continue;

                var roadtime      = parseInt(attributes.updatedOn / 1000);
                var roadcreated   = parseInt(attributes.createdOn / 1000);
                var roadequal     = 0;

                if (roadtime == roadcreated) roadequal = 1;

                var roadeditor = parseInt(attributes.updatedBy);
                var user = W.model.users.getObjectById(roadeditor);
                if (user === null || typeof(user) === "undefined")
                    roadeditor = '-';
                else
                    roadeditor = user.userName + '(' + user.normalizedLevel + ')';

                var roadkind = parseInt(attributes.roadType);
                var roaddir  = (attributes.fwdDirection ? 1 : 0) * 2 + (attributes.revDirection ? 1 : 0);

                var roadarrows = '';

                //zwraca różną kolejność danych na różnych platformach Chrome/Firefox
                //for (s in attributes.fromConnections) { roadarrows += 'A' + parseInt(s) + '·'; }
                //for (s in attributes.toConnections)   { roadarrows += 'B' + parseInt(s) + '·'; }

                //procedura zapewniająca tę samą kolejność danych za pomocą sortowania
                //istotne podczas porównywania utworzonych rekordów na różnych platformach Chrome/Firefox
                var fromConn = new Array();
                var toConn   = new Array();
                for (s in attributes.fromConnections) { fromConn.push( parseInt(s) ); }
                for (s in attributes.toConnections)   {   toConn.push( parseInt(s) ); }
                fromConn.sort();
                toConn.sort();
                for (let i=0; i<fromConn.length; i++)
                    roadarrows += 'A' + fromConn[i] + '·';
                for (let i=0; i<toConn.length;   i++)
                    roadarrows += 'B' + toConn[i]   + '·';


                var roadnames = '';
                var roadcity = '';

                let street = W.model.streets.getObjectById(attributes.primaryStreetID);
                if (street != undefined) {
                    if (street.name != null) {
                        roadnames += street.name;
                    }
                    if (street.cityID != null) {
                        var city = W.model.cities.getObjectById(street.cityID);
                        roadcity = city.isEmpty ? '·' : city.name;
                    }
                }
                for(var j=0; j<attributes.streetIDs.length; j++) {
                    var sid = attributes.streetIDs[j];
                    if (sid !== null) {
                        let street = W.model.streets.getObjectById(sid);
                        if (street != undefined) {
                            if (street.name != null) {
                                if (roadnames != '') roadnames += ", ";
                                roadnames += street.name;
                            }
                        }
                    }
                }

                var roadtr = '';

                /* //This is broken right now - have to change to check the turngraph...which is ugly and complicated
                var tr = attributes.fwdRestrictions;
                if (tr.length) {
                    roadtr += 'AB¹';
                    for(let i=0; i<tr.length; i++) {
                        roadtr += (tr[i].allDay==true ? 1 : 0) + '·';
                        roadtr += tr[i].days + '·';
                        roadtr += tr[i].description + '·';
                        roadtr += (tr[i].enabled ? 1 : 0) + '·';
                        roadtr += (tr[i].fromDate == null ? ''      : tr[i].fromDate) + '·';
                        roadtr += (tr[i].fromTime == null ? '00:00' : tr[i].fromTime) + '·';
                        roadtr += (tr[i].toDate == null   ? ''      : tr[i].toDate)   + '·';
                        roadtr += (tr[i].toTime == null   ? '23:59' : tr[i].toTime)   + '·';
                        roadtr += tr[i].vehicleTypes + '¹';
                    }
                    roadtr += '²';
                }

                var tr = attributes.revRestrictions;
                if (tr.length) {
                    roadtr += 'BA¹';
                    for(let i=0; i<tr.length; i++) {
                        roadtr += (tr[i].allDay==true ? 1 : 0) + '·';
                        roadtr += tr[i].days + '·';
                        roadtr += tr[i].description + '·';
                        roadtr += (tr[i].enabled ? 1 : 0) + '·';
                        roadtr += (tr[i].fromDate == null ? ''      : tr[i].fromDate) + '·';
                        roadtr += (tr[i].fromTime == null ? '00:00' : tr[i].fromTime) + '·';
                        roadtr += (tr[i].toDate == null   ? ''      : tr[i].toDate)   + '·';
                        roadtr += (tr[i].toTime == null   ? '23:59' : tr[i].toTime)   + '·';
                        roadtr += tr[i].vehicleTypes + '¹';
                    }
                    roadtr += '²';
                }
*/
                var roadts = '';
/*
                for(trseg in attributes.toRestrictions) {
                    var tr = attributes.toRestrictions[trseg];
                    roadts += 'B' + trseg + '¹';
                    for(let i=0; i<tr.length; i++) {
                        roadts += (tr[i].allDay==true ? 1 : 0) + '·';
                        roadts += tr[i].days + '·';
                        roadts += tr[i].description + '·';
                        roadts += (tr[i].enabled ? 1 : 0) + '·';
                        roadts += (tr[i].fromDate == null ? ''      : tr[i].fromDate) + '·';
                        roadts += (tr[i].fromTime == null ? '00:00' : tr[i].fromTime) + '·';
                        roadts += (tr[i].toDate == null   ? ''      : tr[i].toDate)   + '·';
                        roadts += (tr[i].toTime == null   ? '23:59' : tr[i].toTime)   + '·';
                        roadts += tr[i].vehicleTypes + '¹';
                    }
                    roadts += '²';
                }

                for(trseg in attributes.fromRestrictions) {
                    var tr = attributes.fromRestrictions[trseg];
                    roadts += 'A' + trseg + '¹';
                    for(let i=0; i<tr.length; i++) {
                        roadts += (tr[i].allDay==true ? 1 : 0) + '·';
                        roadts += tr[i].days + '·';
                        roadts += tr[i].description + '·';
                        roadts += (tr[i].enabled ? 1 : 0) + '·';
                        roadts += (tr[i].fromDate == null ? ''      : tr[i].fromDate) + '·';
                        roadts += (tr[i].fromTime == null ? '00:00' : tr[i].fromTime) + '·';
                        roadts += (tr[i].toDate == null   ? ''      : tr[i].toDate)   + '·';
                        roadts += (tr[i].toTime == null   ? '23:59' : tr[i].toTime)   + '·';
                        roadts += tr[i].vehicleTypes + '¹';
                    }
                    roadts += '²';
                }*/

                var roadlevel = parseInt(attributes.level);
                var roadgeom  = crc32(attributes.geometry.toString());
                var roadtoll  = (attributes.fwdToll ? 1 : 0) * 2 + (attributes.revToll ? 1 : 0);

                //pod Chrome i Firefox występują różne błędy zaokrągleń w rezultacie jest inna suma kontrolna geometrii!!!
                //porównanie dwóch wariantów sum kontrolnych starej i zastąpienie nową z poprawionym błędem zaokrąglenia
                var pstr = '';
                for(var p=0; p<attributes.geometry.components.length; p++) {
                    var pt = attributes.geometry.components[p];
                    var xrounded = parseInt(pt.x * 1000 + 0.5) / 1000.0;
                    var yrounded = parseInt(pt.y * 1000 + 0.5) / 1000.0;
                    if (!p) pstr +=  'POINT(' + xrounded + ' ' + yrounded + ')';
                    else    pstr += ',POINT(' + xrounded + ' ' + yrounded + ')';
                }
                var roadgeom2 = crc32(pstr);


                addDB(segID, roadtime, roadeditor, roaddir, roadkind, roadarrows, roadnames, roadcity, roadtr, roadts, roadlevel, roadgeom, roadgeom2, roadtoll, roadx, roady, roadequal, roadpoints);
            }
        }
    }

    updateCountTime();
}
//--------------------------------------------------------------------------------------------------------
function updateCountTime() {
    var tNow = new Date();
    var t = parseInt( (tNow.getTime() - rec_elapsed_time) / 1000);
    var ts = '';
    if (t < 60)
        ts = t + '&nbsp;' + lang.sec;
    else {
        var a = parseInt(t / 60);
        var b = t - a*60;
        if (b<10) ts = a + ':0' + b + '&nbsp;min.'
        else      ts = a + ':'  + b + '&nbsp;min.'
    }

    var bs = '';
    var be = '';
    if (added_changes) {
        bs = '<b>';
        be = '</b>';
    }

    getId('wmeroadhistory_log').innerHTML = lang.segments + ':&nbsp;' + scanned_segments + ' &nbsp; ' + bs + lang.changes + ':&nbsp;' + added_changes + be + '<br>(' + ts + ')' + scanproc;
}
//--------------------------------------------------------------------------------------------------------
function selectShowTurn(segs)
{

    for(let i=0; i<4; i++) {
        if (segs[i]==0) continue;

        var segment = W.model.segments.getObjectById( segs[i] );
        if (segment != undefined) {

            var line = getId(segment.geometry.id);
            if (line !== null) {

                var color     = line.getAttribute("stroke");
                var opacity   = line.getAttribute("stroke-opacity");
                var lineWidth = line.getAttribute("stroke-width");

                var kol1 = '#FE61FE';
                var kol2 = '#FE01FE';

                var selected = false;
                //if (opacity == 1 || lineWidth == 9) selected = true;   // nie działa poprawnie zaznaczanie - wchodzi w interakcję z WME Highlights
                //if (color == kol1) selected = false;
                //if (color == kol2) selected = false;
                if (color == '#03b9da') selected = true;
                if (color == '#00d8ff') selected = true;

                if (!selected) {
                    if (i < 2) {
                        if (color == kol1 || color == kol2) {
                            line.setAttribute("stroke", "#dd7700");
                            line.setAttribute("stroke-opacity", 0.001 );
                            line.setAttribute("stroke-width", 2);
                        }
                    }
                    else if (i == 2) {
                        if (color != kol1) {
                            line.setAttribute("stroke", kol1);
                            line.setAttribute("stroke-opacity", 0.601 );
                            line.setAttribute("stroke-width", 9);
                        }
                    }
                    else if (i == 3) {
                        if (color != kol2) {
                            line.setAttribute("stroke", kol2);
                            line.setAttribute("stroke-opacity", 0.801 );
                            line.setAttribute("stroke-width", 9);
                        }
                    }
                }
            }
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryLOOP()
{
    //--------- zaznaczenie skrętu na mapie
    selectShowTurn(showturn);

    //--------- aktualizacja statystyk ----------------------------------------
    //statystyki są podliczane z opóźnieniem 2 sek., aby nie przeciążać przeglądanych edycji
    if (updatestatsdelay) {
        updatestatsdelay--;
        if (updatestatsdelay == 0) showstatsdelayed();
    }

    //--------- aktualizacja liczby przeskanowanych segmentów i zmian ---------
    if (scanned_segments != scanned_segments_prev || added_changes != added_changes_prev) {
        scanned_segments_prev = scanned_segments;
        added_changes_prev = added_changes;
        updateCountTime();
    }

    //--------- przywrócenie pozycji sidebar, która resetuje się po zaznaczeniu segmentu --------
    if (getId('wmeroadhistory_scanarea').onclick == null)
        getId('wmeroadhistory_list').innerHTML = '<p class=wmeroadhistory_amonly>' + lang.amonly + '</p>';

    var scanarea      = getId('wmeroadhistory_scanarea');
    var tab           = getId('wmeroadhistory_tab');
    var sidebar       = getId('sidebar');
    var userinfoDisp  = getId('user-info').style.display;
    if (tab.className == 'active') {
        if (userinfoDisp == 'block') {
            if (userinfoDisp != userinfoDispPrev)
                sidebar.scrollTop = prevScroll;
            prevScroll = sidebar.scrollTop;
        }
        userinfoDispPrev = userinfoDisp;
    }

    //-------- inicjalizacja warstwy na której będą pokazywane markery --------
    create_markers_layer();

    //-------- główna procedura skacząca po mapie -----------------------------
    if (rec) {

        //oczekiwanie na gotowość mapy za pomocą badania przycisku hidden lub zdarzeń vent
        //nie wiadomo, która z tych metod jest lepsza i stabilniejsza w praktyce
        //metoda vent zostaje, teoretycznie powinna być tą najlepszą

        var ready = (ventCount==0);                                                       // metoda vent
        //var ready = (wazepending.className.indexOf("hidden") >= 0);                     // metoda hidden
        //var ready = (wazepending.className.indexOf("hidden") >= 0) && (ventCount==0);   // połączenie dwóch metod

        if (ready) {

            var WM   = window.W.map;
            var zoom = WM.getZoom();
            var W    = WM.getSize().w;
            var H    = WM.getSize().h;

            if (zoom == rec_zoom) {

                //zakładka 30px niepotrzebna segmenty na obrzeżach okna ładowane są i tak z pewnym marginesem
                //W -= 30;
                //H -= 30;

                var cent = WM.getCenter();

                var scanprocenty = (cent.lat - rec_xy1.lat) / (rec_xy2.lat - rec_xy1.lat);
                var scanprocentx = (cent.lon - rec_xy1.lon) / (rec_xy2.lon - rec_xy1.lon);
                if (scanprocenty < 0) scanprocenty = 0;
                if (scanprocenty > 1) scanprocenty = 1;
                if (scanprocentx < 0) scanprocentx = 0;
                if (scanprocentx > 1) scanprocentx = 1;

                var proc = scanprocenty;
                if (rec_direction == 1) proc += scanprocentyDelta * scanprocentx;
                if (rec_direction == 3) proc += scanprocentyDelta * (1 - scanprocentx);
                if (proc < 0) proc = 0;
                if (proc > 1) proc = 1;

                if (scanprocenty > scanprocentyPrev) {
                    scanprocentyDelta = scanprocenty - scanprocentyPrev;
                    scanprocentyPrev = scanprocenty;
                }

                scanproc = '&nbsp;&nbsp;&nbsp;' + precFloat(proc * 100, 1) + '%';

                var wsp = new OL.LonLat(cent.lon, cent.lat).transform(epsg900913, epsg4326);
                var log = 'WME Road History LOG: ' + precFloat(proc * 100, 1) + '% segs: ' + scanned_segments + ' cent: ' + precFloat(wsp.lon, 8) + ',' + precFloat(wsp.lat, 8) + ' zoom: ' + zoom + ' window: ' + W + ' ' + H;
                console.log(log);

                SCAN_SEGMENTS();


                if (rec_direction == 1 && cent.lon > rec_xy2.lon) rec_direction = 2;
                if (rec_direction == 3 && cent.lon < rec_xy1.lon) rec_direction = 4;

                //czasami potrafi zwrócić "Uncaught TypeError: undefined is not a function" dla dużego obszaru roboczego mapy np. 3030 x 1722 px.
                //rzadko to się zdarza, błąd nie jest nawet powtarzalny, wygląda to na jakiś bug wewnętrzny po stronie serwera WME
                //możliwe, że występuje tylko wtedy, gdy mapa na serwerze jest w trakcie aktualizacji
                //rozwiązaniem od strony użytkownika jest zmniejszenie okna mapy, restart przeglądarki i ponowne uruchomienie skanowania
                //bądź wystarczy delikatne zmienić obszar skanowania o kilka pikseli

                //skok mapy za pomocą WM.setCenter
                //var e1 = new OL.Geometry.Point(0, 0);
                //var e2 = new OL.Geometry.Point(W, H);
                //var p1 = WM.getLonLatFromViewPortPx(e1);
                //var p2 = WM.getLonLatFromViewPortPx(e2);
                //var dx = p2.lon - p1.lon;
                //var dy = p2.lat - p1.lat;
                //var x = cent.lon;
                //var y = cent.lat;
                //if      (rec_direction == 1) { x += dx;                    }
                //else if (rec_direction == 2) { y += dy; rec_direction = 3; }
                //else if (rec_direction == 3) { x -= dx;                    }
                //else if (rec_direction == 4) { y += dy; rec_direction = 1; }
                //WM.setCenter( [x, y], zoom );


                //skok mapy za pomocą panoramowania widoku WM.pan
                if      (rec_direction == 1)   WM.pan( W, 0);
                else if (rec_direction == 2) { WM.pan( 0, H); rec_direction = 3; }
                else if (rec_direction == 3)   WM.pan(-W, 0);
                else if (rec_direction == 4) { WM.pan( 0, H); rec_direction = 1; }


                if (cent.lon > rec_xy2.lon && cent.lat < rec_xy2.lat) {
                    stopRec(true);
                    LastTimeScan = rec_elapsed_time;

                    scanproc = '';
                    updateCountTime();
                }
            }
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistorySCANAREA() {
    var WM = window.W.map;

    if (rec)
        stopRec(false);
    else {

        last_LONLAT = WM.getCenter();
        last_ZOOM   = WM.getZoom();

        let Width = WM.getSize().w;
        let Height = WM.getSize().h;

        let e1 = new OL.Geometry.Point(0, 0);
        let e2 = new OL.Geometry.Point(Width, Height);

        rec_xy1    = WM.getLonLatFromViewPortPx(e1);
        rec_xy2    = WM.getLonLatFromViewPortPx(e2);

        rec_direction = 1;
        getId('wmeroadhistory_log').innerHTML = '&nbsp;';

        scanned_segments_list = {};
        scanned_segments = 0;
        scanned_segments_prev = 0;
        added_segments = 0;
        added_segments_prev = 0;
        added_changes = 0;
        added_changes_prev = 0;
        scanprocentyPrev = 0;
        scanprocentyDelta = 0;
        scanprocPrev = 0;

        let tNow = new Date();
        rec_elapsed_time = tNow.getTime();

        rec_zoom = last_ZOOM + 1;
        if (rec_zoom < 5) rec_zoom = 5;
        if (rec_zoom > 10) rec_zoom = 10;

        if (typeof W == 'undefined')              W = window.W;
        if (typeof W.loginManager == 'undefined') W.loginManager = window.W.loginManager;
        if (W.loginManager && W.loginManager.isLoggedIn()) {
            let thisUser = W.loginManager.user;
            var lev = thisUser.normalizedLevel;
            if (thisUser !== null && (lev*lev >= lev+lev+lev || thisUser.isAreaManager)) {
                rec = true;
                WM.zoomTo(rec_zoom);
                WM.panTo(rec_xy1);

                updateSaveButton(rec);
            }
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\'/g, '&#39;').replace(/\r/g, ' ').replace(/\n/g, ' ');
}
//--------------------------------------------------------------------------------------------------------
function createLink(segx, segy, zoom, idsegments) {
    var WM = window.W.map;

    var docurl = document.URL;
    var docurlparams = docurl.split('&');

    var layers = '';
    var link = '';
    for(let i=0; i<docurlparams.length; i++) {
        if (docurlparams[i].indexOf( 'waze.com' ) >= 0) link   = docurlparams[i];
        if (docurlparams[i].indexOf( 'layers' )   >= 0) layers = docurlparams[i];
    }

    var lonlat = new OL.LonLat(segx, segy).transform(epsg900913, epsg4326);

    link += '&lon='  + parseInt(lonlat.lon * 1000000 + 0.5) / 1000000;
    link += '&lat='  + parseInt(lonlat.lat * 1000000 + 0.5) / 1000000;
    if (layers != '') link += '&' + layers;
    link += '&zoom=' + zoom;
    link += '&segments=' + idsegments;

    return link;
}
//--------------------------------------------------------------------------------------------------------
function gotoSEG(x, y, segid) {
    var WM = window.W.map;
    var xy = new OL.LonLat( x, y );

    WM.panTo(xy);
    WM.zoomTo(6);

    showturn[0] = showturn[2];
    showturn[1] = showturn[3];
    showturn[2] = segid;
    showturn[3] = 0;
}
//--------------------------------------------------------------------------------------------------------
function gotoTURN(event) {
    var WM = window.W.map;

    var segs = event.target.id.split('_');
    var seg1 = parseInt( segs[1] );
    var segN = segs[2];
    var seg2 = parseInt( segs[3] );

    var objectStore = wazeDB.transaction('segments', 'readonly').objectStore('segments');
    var request = objectStore.get( seg1 );
    request.onsuccess = function() {
        var rekord = request.result;
        if(rekord) {

            if (rekord.P.length >= 2) {
                if (segN == 'A') {
                    let x = rekord.P[ 0 ];
                    let y = rekord.P[ 1 ];
                }
                else {
                    let x = rekord.P[ rekord.P.length - 2 ];
                    let y = rekord.P[ rekord.P.length - 1 ];
                }
                var xy = new OL.LonLat( x, y );

                showturn[0] = showturn[2];
                showturn[1] = showturn[3];
                showturn[2] = seg1;
                showturn[3] = seg2;

                WM.panTo(xy);
                WM.zoomTo(6);
            }

        }
    }

}
//--------------------------------------------------------------------------------------------------------
function foundPELinkName( pe, seg2 ) {

    var objectStore = wazeDB.transaction('segments', 'readonly').objectStore('segments');
    var request = objectStore.get( seg2 );
    request.onsuccess = function() {
        var rekord = request.result;
        if (rekord) {
            if (rekord.N == '') pe.innerHTML = lang.into + lang.noname;
            else                pe.innerHTML = lang.into + rekord.N;
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function formatRestriction(str, bs, be) {
    var items = str.split('·');

    var li = document.createElement('p');

    if (items[4]=='') li.innerHTML += bs + lang.allweek                                                         + be + '<br>';
    else              li.innerHTML += bs + items[4] + ' <span style="font-weight:normal">..</span> ' + items[6] + be + '<br>';  

    if (items[0] == 0) li.innerHTML += bs + items[5] + ' - ' + items[7] + be + '<br>';

    if (items[1] != 127) {
        let html = bs;
        if (items[1] & 0x01) { if (html!='') html+=' · '; html += lang.day1; }
        if (items[1] & 0x02) { if (html!='') html+=' · '; html += lang.day2; }
        if (items[1] & 0x04) { if (html!='') html+=' · '; html += lang.day3; }
        if (items[1] & 0x08) { if (html!='') html+=' · '; html += lang.day4; }
        if (items[1] & 0x10) { if (html!='') html+=' · '; html += lang.day5; }
        if (items[1] & 0x20) { if (html!='') html+=' · '; html += lang.day6; }
        if (items[1] & 0x40) { if (html!='') html+=' · '; html += lang.day7; }
        html += be + '<br>';
        li.innerHTML += html;
    }
    if (items[2]!='') li.innerHTML += '<i>&quot;' + htmlEntities(items[2]) + '&quot;</i><br>';

    if (items[8] != '-1') {
        li.innerHTML += lang.exceptvehicles + '<br>';
        let html = bs;
        if ((items[8] & 0x01)==0)  html += '- ' + lang.veh1  + '<br>';
        if ((items[8] & 0x02)==0)  html += '- ' + lang.veh2  + '<br>';
        if ((items[8] & 0x04)==0)  html += '- ' + lang.veh3  + '<br>';
        if ((items[8] & 0x08)==0)  html += '- ' + lang.veh4  + '<br>';
        if ((items[8] & 0x10)==0)  html += '- ' + lang.veh5  + '<br>';
        if ((items[8] & 0x20)==0)  html += '- ' + lang.veh6  + '<br>';
        if ((items[8] & 0x40)==0)  html += '- ' + lang.veh7  + '<br>';
        if ((items[8] & 0x80)==0)  html += '- ' + lang.veh8  + '<br>';
        if ((items[8] & 0x100)==0) html += '- ' + lang.veh9  + '<br>';
        if ((items[8] & 0x200)==0) html += '- ' + lang.veh10 + '<br>';
        if ((items[8] & 0x400)==0) html += '- ' + lang.veh11 + '<br>';
        html += be;
        li.innerHTML += html;
    }

    return li;
}
//--------------------------------------------------------------------------------------------------------
function create_markers_layer() {

    var WM = window.W.map;
    var OL = window.OL;

    var mlayers = WM.getLayersBy("uniqueName","__WMERoadHistoryMarkers");
    if (mlayers.length == 0) {
        let drc_mapLayer;
        //----------wersja z ikonkami jest bardzo wolna, pokazanie na mapie 1000 ikonek spowalnia mocno rendering
        if (ICONMODE == 1) {
            drc_mapLayer = new OL.Layer.Markers("WME Road History", {
                displayInLayerSwitcher: true,
                uniqueName: "__WMERoadHistoryMarkers"
            });
        }

        //----------wersja z liniami lepsza i szybsza w renderingu
        if (ICONMODE == 0) {
            var drc_style = new OL.Style({
                strokeDashstyle: 'solid',
                strokeColor : '${lineColor}',
                strokeOpacity: 0.5,
                strokeWidth: '${lineWidth}',
                fillColor: '#000000',
                fillOpacity: 0,
                pointRadius: 0,
                label : '${labelText}',
                fontFamily: 'Tahoma',
                labelOutlineColor: '#FFFFFF',
                labelOutlineWidth: '2',
                fontColor: '${labelColor}',
                fontOpacity: 1,
                fontSize: '9px',
                display: 'block'
            });

            drc_mapLayer = new OL.Layer.Vector("WME Road History", {
                displayInLayerSwitcher: true,
                styleMap: new OL.StyleMap(drc_style),
                uniqueName: "__WMERoadHistoryMarkers"
            });
        }

        I18n.translations[I18n.currentLocale()].layers.name["__WMERoadHistoryMarkers"] = "WME Road History";
        WM.addLayer(drc_mapLayer);
        drc_mapLayer.setVisibility(true);

    }
}
//--------------------------------------------------------------------------------------------------------
function remove_markers() {

    var WM = window.W.map;
    var OL = window.OL;

    markerskey = {};
    markersseg = {};
    markersadd = [];

    var mlayers = WM.getLayersBy("uniqueName","__WMERoadHistoryMarkers");
    var markerLayer = mlayers[0];
    if (markerLayer) {
        if (ICONMODE)
            markerLayer.clearMarkers();
        else
            markerLayer.removeAllFeatures();
    }
}
//--------------------------------------------------------------------------------------------------------
function add_markers_from_list() {

    var showcircle       = getId('_wmeRoadHistoryShowCircle').checked;
    var showcircleshort  = getId('_wmeRoadHistoryShowCircleShort').checked;
    var showcirclelong   = getId('_wmeRoadHistoryShowCircleLong').checked;

    //jeżeli nie zaznaczono żadnej z opcji kolorowania to powrót
    if (!showcircle && !showcircleshort && !showcirclelong) return;

    // przygotowanie danych warstwy '__WMERoadHistoryMarkers'
    var WM = window.W.map;
    var OL = window.OL;

    var mlayers = WM.getLayersBy("uniqueName","__WMERoadHistoryMarkers");
    var markerLayer = mlayers[0];
    if (markerLayer == undefined) return;

    var lineFeatures  = [];

    while (markersadd.length) {

        var mark  = markersadd.shift();
        var x     = mark.x;
        var y     = mark.y;
        var ed    = mark.editor;
        var key   = mark.key;
        var segid = mark.segid;

        if (markerskey[key] == 1) continue;
        markerskey[key] = 1;

        if (ShowHistMode == 1) {
            if (markersseg[segid] == undefined)
                markersseg[segid] = 0;
            else
                markersseg[segid] = markersseg[segid] + 1;
            x += markersseg[segid] * 4;
        }

        var edT = '#808080';
        var edL = '#808080';

        if (ed.indexOf('(1)') >= 0)   { edT = '#FF0000'; edL = '#FF0000'; }
        if (ed.indexOf('(2)') >= 0)   { edT = '#af8000'; edL = '#FFFF00'; }
        if (ed.indexOf('(3)') >= 0)   { edT = '#00FF00'; edL = '#00FF00'; }
        if (ed.indexOf('(4)') >= 0)   { edT = '#0080FF'; edL = '#0080FF'; }
        if (ed.indexOf('(5)') >= 0)   { edT = '#FF00FF'; edL = '#FF00FF'; }
        if (ed == 'Inactive User(1)') { edT = '#808080'; edL = '#808080'; ed = 'I'; }

        if (showcirclelong) {}
        else if (showcircleshort)
            ed = ed.substr(0, 3);
        else
            ed = '';

        var width = 0;
        if (showcircle) width = 30;

        if (ICONMODE) {
            var di = require("Waze/DivIcon");
            var iconA = new di("wmeroadhistorymarker1");
            var lonlatA = new OL.LonLat( x, y );
            markerA = new OL.Marker(lonlatA, iconA );
            markerA.display(true);
            markerLayer.addMarker(markerA);
        }
        else {
            var p1 = new OL.Geometry.Point(x, y)
            var p2 = new OL.Geometry.Point(x, y)

            var points = [];
            points.push(p1);
            points.push(p2);
            var line = new OL.Geometry.LineString(points);

            var lineFeature = new OL.Feature.Vector(line, { labelText: ed, labelColor: edT, lineColor: edL, lineWidth:width } );
            lineFeatures.push(lineFeature);
        }
    }

    if (!ICONMODE)
        markerLayer.addFeatures(lineFeatures);
}
//--------------------------------------------------------------------------------------------------------
function showEdits(histmode, fromPage) {

    var objlist = getId('wmeroadhistory_list');
    if (objlist == null) return;

    var range, transaction, store, index;

    let lower = 0;
    let upper = 9999999999;

    if (getId('_wmeRoadHistoryDateRange').checked) {

        var fyear  = parseInt(getId('_wmeRoadHistoryFromYear').value);
        var fmonth = parseInt(getId('_wmeRoadHistoryFromMonth').value) - 1;
        var fday   = parseInt(getId('_wmeRoadHistoryFromDay').value);

        var tyear  = parseInt(getId('_wmeRoadHistoryToYear').value);
        var tmonth = parseInt(getId('_wmeRoadHistoryToMonth').value) - 1;
        var tday   = parseInt(getId('_wmeRoadHistoryToDay').value);

        var lowerdate = new Date(fyear, fmonth, fday, 0, 0, 0, 0);
        var upperdate = new Date(tyear, tmonth, tday, 23, 59, 59, 999);

        lower = parseInt(lowerdate.getTime() / 1000);
        upper = parseInt(upperdate.getTime() / 1000);

        if (lower <= upper) {
            getId('wmeroadhistory_rangeinfo').innerHTML = lang.datesdefined + ' &nbsp; ' + lowerdate.toLocaleDateString() + ' - ' + upperdate.toLocaleDateString();
        }
        else {
            getId('wmeroadhistory_rangeinfo').innerHTML = '<span style="color: #CC0000; ">' + lang.datesincorrect + '</span>';
            return;
        }
    }
    else
        getId('wmeroadhistory_rangeinfo').innerHTML = '';

    var showseconds = getId('_wmeRoadHistoryFullTime').checked;
    updatestatsdelay = 0;
    while (markersadd.length) markersadd.pop();

    if (histmode == 1) {
        range = IDBKeyRange.bound( lower, upper );
        transaction = wazeDB.transaction(["changes"], "readonly");
        store = transaction.objectStore("changes");
        index = store.index("T");
    }
    else {
        range = IDBKeyRange.bound( lower, upper );
        transaction = wazeDB.transaction(["segments"], "readonly");
        store = transaction.objectStore("segments");
        index = store.index("T");
    }

    var count = 0;
    var page = 0;
    var end = 0;

    var rows = getId('_wmeRoadHistoryRows').value;
    if (rows < 5)    rows = 5;
    if (rows > 1000) rows = 1000;

    var t = new Date();
    var curtime = parseInt( t.getTime() / 1000);

    index.openCursor(range, "prev").onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {

            if (page < fromPage) {

                page++;
                cursor.advance( rows );
            }
            else if (count < rows) {

                var segid     = cursor.value.ID;
                var segtime   = cursor.value.T;
                var segeditor = cursor.value.E;
                var segnames  = cursor.value.N;
                var segcity   = cursor.value.C;
                var segx      = cursor.value.x;
                var segy      = cursor.value.y;
                var segkind   = cursor.value.K;
                var segequal  = cursor.value.Q;

                var h1 = document.createElement('h1');
                var h2 = document.createElement('h2');
                var ul = document.createElement('ul');
                var h4 = document.createElement('h4');
                var h5 = document.createElement('h5');
                var h6 = document.createElement('h6');
                var hr = document.createElement('hr');

                if (stats[segeditor] == null) {
                    var list = {};
                    list[ segid + '.' + segtime ] = 1;
                    stats[segeditor] = list;
                }
                else
                    stats[segeditor][segid + '.' + segtime] = 1;

                //----- dodanie wsp. markera do tablicy ----------
                var mark = { x:segx, y:segy, editor:segeditor, key:cursor.primaryKey, segid:segid };
                markersadd.push( mark );

                if (histmode == 1) {


                    if (cursor.value.drA != null && cursor.value.drB != null) {

                        let li = document.createElement('li');

                        if (cursor.value.drA == 0)     li.innerHTML = lang.dirchangeadd;

                        if (cursor.value.drA == 1) {
                            if (cursor.value.drB == 0) li.innerHTML = lang.dirchange0;
                            if (cursor.value.drB == 2) li.innerHTML = lang.dirchangerev;
                            if (cursor.value.drB == 3) li.innerHTML = lang.dirchange2;
                        }

                        if (cursor.value.drA == 2) {
                            if (cursor.value.drB == 0) li.innerHTML = lang.dirchange0;
                            if (cursor.value.drB == 1) li.innerHTML = lang.dirchangerev;
                            if (cursor.value.drB == 3) li.innerHTML = lang.dirchange2;
                        }

                        if (cursor.value.drA == 3) {
                            if (cursor.value.drB == 0) li.innerHTML = lang.dirchange0;
                            if (cursor.value.drB == 1) li.innerHTML = lang.dirchange1;
                            if (cursor.value.drB == 2) li.innerHTML = lang.dirchange1;
                        }

                        ul.appendChild(li);
                    }


                    var tyA = cursor.value.tyA;
                    var tyB = cursor.value.tyB;
                    if (tyA != null && tyB != null) {

                        let li = document.createElement('li');

                        let html = '';

                        switch (tyA) {
                            case 1:  html += lang.road1;  break;
                            case 2:  html += lang.road2;  break;
                            case 3:  html += lang.road3;  break;
                            case 4:  html += lang.road4;  break;
                            case 5:  html += lang.road5;  break;
                            case 6:  html += lang.road6;  break;
                            case 7:  html += lang.road7;  break;
                            case 8:  html += lang.road8;  break;
                            case 10: html += lang.road10; break;
                            case 17: html += lang.road17; break;
                            case 18: html += lang.road18; break;
                            case 19: html += lang.road19; break;
                            case 20: html += lang.road20; break;
                            default: html += lang.roadtype + tyA + ')'; break;
                        }

                        html += ' » <b class=wmeroadhistory_kind >';

                        switch (tyB) {
                            case 1:  html += lang.road1;  break;
                            case 2:  html += lang.road2;  break;
                            case 3:  html += lang.road3;  break;
                            case 4:  html += lang.road4;  break;
                            case 5:  html += lang.road5;  break;
                            case 6:  html += lang.road6;  break;
                            case 7:  html += lang.road7;  break;
                            case 8:  html += lang.road8;  break;
                            case 10: html += lang.road10; break;
                            case 17: html += lang.road17; break;
                            case 18: html += lang.road18; break;
                            case 19: html += lang.road19; break;
                            case 20: html += lang.road20; break;
                            default: html += lang.roadtype + tyB + ')'; break;
                        }

                        html += '</b>';
                        li.innerHTML = html;

                        ul.appendChild(li);
                    }



                    var arA = cursor.value.arA;
                    var arB = cursor.value.arB;
                    if (arA != null && arB != null) {
                        var turnsA = arA.split('·');
                        var turnsB = arB.split('·');

                        for(let i=0; i<turnsA.length - 1; i++) {
                            var p = arB.indexOf( turnsA[i] + '·' );
                            if (p < 0) {

                                let seg1 = segid;
                                let segN = turnsA[i].substr(0,1);
                                let seg2 = turnsA[i].substr(1,12);

                                let li = document.createElement('li');
                                if (seg1 == seg2) li.innerHTML += '<b class=wmeroadhistory_uturn >' + lang.removed_uturn + '</b>';
                                else              li.innerHTML += '<b class=wmeroadhistory_error >' + lang.removedturn + '</b>';

                                let pe = document.createElement('p');
                                pe.innerHTML = 'link';
                                pe.className = 'wmeroadhistory_turnlink';
                                pe.id = 'turnlink_' + seg1 + '_' + segN + '_' + seg2;

                                foundPELinkName( pe, parseInt(seg2) );

                                pe.onclick = (function(event) {
                                    gotoTURN(event);
                                });
                                li.appendChild(pe);

                                ul.appendChild(li);
                            }
                        }

                        for(let i=0; i<turnsB.length - 1; i++) {
                            let p = arA.indexOf( turnsB[i] + '·' );
                            if (p < 0) {

                                let seg1 = segid;
                                let segN = turnsB[i].substr(0,1);
                                let seg2 = turnsB[i].substr(1,12);

                                var li = document.createElement('li');
                                if (seg1 == seg2) li.innerHTML += '<b class=wmeroadhistory_uturn >' + lang.added_uturn + '</b>';
                                else              li.innerHTML += '<b class=wmeroadhistory_error >' + lang.addedturn + '</b>';

                                let pe = document.createElement('p');
                                pe.innerHTML = 'link';
                                pe.className = 'wmeroadhistory_turnlink';
                                pe.id = 'turnlink_' + seg1 + '_' + segN + '_' + seg2;

                                foundPELinkName( pe, parseInt(seg2) );

                                pe.onclick = (function(event) {
                                    gotoTURN(event);
                                });
                                li.appendChild(pe);

                                ul.appendChild(li);
                            }
                        }
                    }


                    if (cursor.value.naA != null && cursor.value.naB != null) {
                        let li = document.createElement('li');
                        li.innerHTML = lang.changename + cursor.value.naA + ' » ' + cursor.value.naB;
                        ul.appendChild(li);
                    }

                    if (cursor.value.ciA != null && cursor.value.ciB != null) {
                        let li = document.createElement('li');
                        li.innerHTML = lang.changecity + cursor.value.ciA + ' » ' + cursor.value.ciB;
                        ul.appendChild(li);
                    }

                    if (cursor.value.geA != null && cursor.value.geB != null) {
                        let li = document.createElement('li');
                        li.innerHTML = lang.changedgeom;
                        ul.appendChild(li);
                    }

                    if (cursor.value.lvA != null && cursor.value.lvB != null) {
                        let li = document.createElement('li');
                        li.innerHTML = lang.level + cursor.value.lvA + ' » ' + cursor.value.lvB;
                        ul.appendChild(li);
                    }

                    if (cursor.value.tolA != null && cursor.value.tolB != null) {
                        let li = document.createElement('li');

                        if (cursor.value.tolA == 0) li.innerHTML += lang.tollfree;
                        if (cursor.value.tolA == 1) li.innerHTML += lang.tollpart;
                        if (cursor.value.tolA == 2) li.innerHTML += lang.tollpart;
                        if (cursor.value.tolA == 3) li.innerHTML += lang.toll;

                        if (cursor.value.tolB == 0) li.innerHTML += ' » <b class=wmeroadhistory_toll>' + lang.tollfree + '</b>';
                        if (cursor.value.tolB == 1) li.innerHTML += ' » <b class=wmeroadhistory_toll>' + lang.tollpart + '</b>';
                        if (cursor.value.tolB == 2) li.innerHTML += ' » <b class=wmeroadhistory_toll>' + lang.tollpart + '</b>';
                        if (cursor.value.tolB == 3) li.innerHTML += ' » <b class=wmeroadhistory_toll>' + lang.toll     + '</b>';

                        ul.appendChild(li);
                    }

                    var trBefore = cursor.value.trA;
                    var trAfter  = cursor.value.trB;
                    if (trBefore != null && trAfter != null) {

                        var before = trBefore.split('²');
                        var after  = trAfter.split('²');

                        var abBefore = '';
                        var abAfter  = '';
                        var baBefore = '';
                        var baAfter  = '';

                        for(let i=0; i<before.length - 1; i++) {
                            if (before[i].indexOf('AB¹') == 0) abBefore = before[i];
                            if (before[i].indexOf('BA¹') == 0) baBefore = before[i];
                        }

                        for(let i=0; i<after.length - 1; i++) {
                            if (after[i].indexOf('AB¹') == 0) abAfter = after[i];
                            if (after[i].indexOf('BA¹') == 0) baAfter = after[i];
                        }

                        if (abBefore != abAfter) {

                            let li = document.createElement('li');
                            li.innerHTML = '<b class=wmeroadhistory_trafter>' + lang.trAB + '</b>';
                            ul.appendChild(li);

                            if (abAfter == '') {
                                let li = document.createElement('p');
                                li.innerHTML = '<b class=wmeroadhistory_trafter>' + lang.none + '</b>';
                                ul.appendChild(li);
                            }
                            else {
                                var lines = abAfter.split('¹');
                                for(let i=1; i<lines.length-1; i++) {
                                    let li = formatRestriction( lines[i], '<b class=wmeroadhistory_trafter>', '</b>');
                                    ul.appendChild(li);
                                }
                            }

                            var lines = abBefore.split('¹');
                            for(let i=1; i<lines.length-1; i++) {
                                let li = formatRestriction( lines[i], '', '');
                                li.className = 'wmeroadhistory_trbefore';
                                ul.appendChild(li);
                            }
                        }

                        if (baBefore != baAfter) {

                            let li = document.createElement('li');
                            li.innerHTML = '<b class=wmeroadhistory_trafter>' + lang.trBA + '</b>';
                            ul.appendChild(li);

                            if (baAfter == '') {
                                let li = document.createElement('p');
                                li.innerHTML = '<b class=wmeroadhistory_trafter>' + lang.none + '</b>';
                                ul.appendChild(li);
                            }
                            else {
                                let lines = baAfter.split('¹');
                                for(let i=1; i<lines.length-1; i++) {
                                    let li = formatRestriction( lines[i], '<b class=wmeroadhistory_trafter>', '</b>');
                                    ul.appendChild(li);
                                }
                            }

                            let lines = baBefore.split('¹');
                            for(let i=1; i<lines.length-1; i++) {
                                let li = formatRestriction( lines[i], '', '');
                                li.className = 'wmeroadhistory_trbefore';
                                ul.appendChild(li);
                            }

                        }

                    }


                    var trBefore = cursor.value.tsA;
                    var trAfter  = cursor.value.tsB;
                    if (trBefore != null && trAfter != null) {
                        let before = trBefore.split('²');
                        let after  = trAfter.split('²');

                        for(let i=0; i<before.length - 1; i++) {
                            let bi = before[i].split('¹');

                            var aifound = [];

                            for(let j=0; j<after.length - 1; j++) {
                                let ai = after[j].split('¹');
                                if (ai[0] == bi[0]) {
                                    aifound = ai;
                                }
                            }

                            if (aifound.length > 2) {
                                let li = document.createElement('li');
                                li.innerHTML = '<b class=wmeroadhistory_trturn>' + lang.changedtr + '</b>';

                                let seg1 = segid;
                                let segN = bi[0].substr(0,1);
                                let seg2 = bi[0].substr(1,12);

                                let pe = document.createElement('p');
                                pe.innerHTML = 'link';
                                pe.className = 'wmeroadhistory_turnlink';
                                pe.id = 'turnlink_' + seg1 + '_' + segN + '_' + seg2;

                                foundPELinkName( pe, parseInt(seg2) );

                                pe.onclick = (function(event) {
                                    gotoTURN(event);
                                });
                                li.appendChild(pe);
                                ul.appendChild(li);

                                if (aifound.length <= 2) {
                                    let li = document.createElement('p');
                                    li.innerHTML = '<b class=wmeroadhistory_trturn>' + lang.none + '</b>';
                                    ul.appendChild(li);
                                }
                                else {
                                    for(let k=1; k<aifound.length-1; k++) {
                                        let li = formatRestriction( aifound[k], '<b class=wmeroadhistory_trturn>', '</b>');
                                        ul.appendChild(li);
                                    }
                                }

                                for(let k=1; k<bi.length-1; k++) {
                                    let li = formatRestriction( bi[k], '', '');
                                    ul.appendChild(li);
                                }
                            }
                            else {
                                let li = document.createElement('li');
                                li.innerHTML = '<b class=wmeroadhistory_trturn>' + lang.removedtr + '</b>';

                                let seg1 = segid;
                                let segN = bi[0].substr(0,1);
                                let seg2 = bi[0].substr(1,12);

                                let pe = document.createElement('p');
                                pe.innerHTML = 'link';
                                pe.className = 'wmeroadhistory_turnlink';
                                pe.id = 'turnlink_' + seg1 + '_' + segN + '_' + seg2;

                                foundPELinkName( pe, parseInt(seg2) );

                                pe.onclick = (function(event) {
                                    gotoTURN(event);
                                });
                                li.appendChild(pe);
                                ul.appendChild(li);

                                //var li = document.createElement('p');
                                //li.innerHTML = '<b class=wmeroadhistory_trturn>' + lang.none + '</b>';
                                //ul.appendChild(li);

                                for(let k=1; k<bi.length-1; k++) {
                                    let li = formatRestriction( bi[k], '', '');
                                    ul.appendChild(li);
                                }
                            }
                        }


                        for(let i=0; i<after.length - 1; i++) {
                            let ai = after[i].split('¹');

                            let p = trBefore.indexOf( ai[0] + '¹' );
                            if (p < 0) {
                                let li = document.createElement('li');
                                li.innerHTML = '<b class=wmeroadhistory_trturn>' + lang.addedtr + '</b>';

                                let seg1 = segid;
                                let segN = ai[0].substr(0,1);
                                let seg2 = ai[0].substr(1,12);

                                var pe = document.createElement('p');
                                pe.innerHTML = 'link';
                                pe.className = 'wmeroadhistory_turnlink';
                                pe.id = 'turnlink_' + seg1 + '_' + segN + '_' + seg2;

                                foundPELinkName( pe, parseInt(seg2) );

                                pe.onclick = (function(event) {
                                    gotoTURN(event);
                                });
                                li.appendChild(pe);
                                ul.appendChild(li);

                                for(let k=1; k<ai.length-1; k++) {
                                    let li = formatRestriction( ai[k], '<b class=wmeroadhistory_trturn>', '</b>');
                                    ul.appendChild(li);
                                }
                            }
                        }
                    }



                }

                var t = new Date;
                t.setTime( segtime * 1000 );
                var topt = { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" };
                var czas;
                if (showseconds) czas = t.toLocaleString(lang.code);
                else             czas = t.toLocaleDateString(lang.code, topt);


                if (segnames == '') h1.innerHTML = '<b>' + lang.noname + '</b>';
                else                h1.innerHTML = '<b>' + htmlEntities(segnames) + '</b>';

                h1.onclick = (function() {
                    gotoSEG(segx, segy, segid);
                });

                if      (segkind == 1)   h1.style.color = '#488193';  // street
                else if (segkind == 2)   h1.style.color = '#488193';  // primary street
                else if (segkind == 3)   h1.style.color = '#488193';  // freeways
                else if (segkind == 4)   h1.style.color = '#488193';  // ramps
                else if (segkind == 6)   h1.style.color = '#488193';  // major highway
                else if (segkind == 7)   h1.style.color = '#488193';  // minor highway
                else if (segkind == 8)   h1.style.color = '#404040';  // dirt roads
                else if (segkind == 18)  h1.style.color = '#c0c0c0';  // pkp
                else if (segkind == 21)  h1.style.color = '#808080';  // service road
                else if (segkind == 120) h1.style.color = '#808080';  // service road
                else                     h1.style.color = '#808080';

                if (segequal && curtime - segtime < 7*24*3600) {
                    h4.innerHTML = '<b class=wmeroadhistory_newseg>' + lang.newsegment + '</b>';
                }

                h2.innerHTML = htmlEntities(segcity);
                h5.innerHTML = czas;
                h6.innerHTML = htmlEntities(segeditor);
                if (segeditor.indexOf('(1)') >= 0)           h6.className = 'wmeroadhistory_rank1';
                if (segeditor.indexOf('(2)') >= 0)           h6.className = 'wmeroadhistory_rank2';
                if (segeditor.indexOf('(3)') >= 0)           h6.className = 'wmeroadhistory_rank3';
                if (segeditor.indexOf('(4)') >= 0)           h6.className = 'wmeroadhistory_rank4';
                if (segeditor.indexOf('(5)') >= 0)           h6.className = 'wmeroadhistory_rank5';
                if (segeditor.indexOf('Inactive User') >= 0) h6.className = 'wmeroadhistory_rank0';


                if (count < objlist.childNodes.length) {
                    var div = objlist.childNodes[count];

                    div.innerHTML = '';

                    div.appendChild(h1);
                    div.appendChild(h4);
                    div.appendChild(h2);
                    div.appendChild(ul);
                    div.appendChild(h5);
                    div.appendChild(h6);
                    div.appendChild(hr);
                }
                else {
                    var newdiv = document.createElement('div');

                    newdiv.appendChild(h1);
                    newdiv.appendChild(h4);
                    newdiv.appendChild(h2);
                    newdiv.appendChild(ul);
                    newdiv.appendChild(h5);
                    newdiv.appendChild(h6);
                    newdiv.appendChild(hr);

                    objlist.appendChild(newdiv);
                }

                count++;
                cursor.continue();
            }
            else {

                add_markers_from_list();
                updatestatsdelay = parseInt(2000 / LOOPTIMER);
            }
        }
        else {
            add_markers_from_list();
            updatestatsdelay = parseInt(2000 / LOOPTIMER);

            //korekta pozycji na ostatniej stronie, gdy list jest mniejsza niż zdefiniowana ilość wierszy
            if (count && count < rows) {
                for(let i=count; i<rows; i++) {
                    let div = objlist.childNodes[i];
                    div.innerHTML = '';
                }
            }

            if (count==0) {
                if (pageEdits > page-1) pageEdits = page-1;
                if (pageEdits < 0)      pageEdits = 0;
            }
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryTAB1() {

    ShowHistMode = 1;
    updateTabs();

    //reset zaznaczonych segmentów
    showturn[0] = showturn[2];
    showturn[1] = showturn[3];
    showturn[2] = 0;
    showturn[3] = 0;


    //usunięcie,czyszczenie markerów z mapy
    remove_markers();

    //reset statystyk po kliknięciu w zakładkę, aby można było podliczać od nowa poruszając się po stronach
    reset_statistics();

    getId('wmeroadhistory_list').innerHTML = '';
    getId('wmeroadhistory_list').style.display = 'block';
    getId('wmeroadhistory_options').style.display = 'none';
    getId('wmeroadhistory_stats').style.display = 'block';

    pageEdits = 0;
    showEdits(ShowHistMode, pageEdits);

    getId('wmeroadhistory_list_buttons_1').style.visibility = '';
    getId('wmeroadhistory_list_buttons_2').style.visibility = '';
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryTAB2() {

    ShowHistMode = 2;
    updateTabs();

    //reset zaznaczonych segmentów
    showturn[0] = showturn[2];
    showturn[1] = showturn[3];
    showturn[2] = 0;
    showturn[3] = 0;


    //usunięcie,czyszczenie markerów z mapy
    remove_markers();

    //reset statystyk po kliknięciu w zakładkę, aby można było podliczać od nowa poruszając się po stronach
    reset_statistics();

    getId('wmeroadhistory_list').innerHTML = '';
    getId('wmeroadhistory_list').style.display = 'block';
    getId('wmeroadhistory_options').style.display = 'none';
    getId('wmeroadhistory_stats').style.display = 'block';

    pageEdits = 0;
    showEdits(ShowHistMode, pageEdits);

    getId('wmeroadhistory_list_buttons_1').style.visibility = '';
    getId('wmeroadhistory_list_buttons_2').style.visibility = '';
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryTAB3() {

    ShowHistMode = 3;
    updateTabs();

    //reset zaznaczonych segmentów
    showturn[0] = showturn[2];
    showturn[1] = showturn[3];
    showturn[2] = 0;
    showturn[3] = 0;

    getId('wmeroadhistory_list').innerHTML = '';
    getId('wmeroadhistory_list').style.display = 'none';
    getId('wmeroadhistory_options').style.display = 'block';
    getId('wmeroadhistory_list_buttons_1').style.visibility = 'hidden';
    getId('wmeroadhistory_list_buttons_2').style.visibility = 'hidden';
    getId('wmeroadhistory_stats').style.display = 'none';

    if (window.File && window.FileReader && window.FileList && window.Blob) {
    }
    else {
        alert('The File APIs are not fully supported by your browser.');

        getId('wmeroadhistory_import').className = 'wmerh_button_disabled';
        getId('wmeroadhistory_export').className = 'wmerh_button_disabled';
    }

    getId('wmerh_dbinfo').innerHTML = lang.dbversion + wazeDB.version;
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryPREV() {
    if (pageEdits) {
        pageEdits--;
        if (pageEdits < 0) pageEdits = 0;
        showEdits(ShowHistMode, pageEdits);
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryNEXT() {
    pageEdits++;
    showEdits(ShowHistMode, pageEdits);
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryPREVDOWN() {
    if (pageEdits) {
        pageEdits--;
        if (pageEdits < 0) pageEdits = 0;
        getId('sidebar').scrollTop = 0;
        showEdits(ShowHistMode, pageEdits);
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryNEXTDOWN() {
    pageEdits++;
    getId('sidebar').scrollTop = 0;
    showEdits(ShowHistMode, pageEdits);
}
//--------------------------------------------------------------------------------------------------------
function updateTabs() {
    if (ShowHistMode == 1) {
        getId('wmeroadhistory_tab1').className = 'wmeroadhistory_tab_active';
        getId('wmeroadhistory_tab2').className = '';
        getId('wmeroadhistory_tab3').className = '';
    }
    if (ShowHistMode == 2) {
        getId('wmeroadhistory_tab1').className = '';
        getId('wmeroadhistory_tab2').className = 'wmeroadhistory_tab_active';
        getId('wmeroadhistory_tab3').className = '';
    }
    if (ShowHistMode == 3) {
        getId('wmeroadhistory_tab1').className = '';
        getId('wmeroadhistory_tab2').className = '';
        getId('wmeroadhistory_tab3').className = 'wmeroadhistory_tab_active';
    }
}
//--------------------------------------------------------------------------------------------------------
function importexportenable(flag) {
    if (flag) {
        getId('wmeroadhistory_import').className = 'wmerh_button_enabled';
        getId('wmeroadhistory_export').className = 'wmerh_button_enabled';
        getId('wmeroadhistory_import').disabled = false;
        getId('wmeroadhistory_export').disabled = false;
        getId('wmeroadhistory_mergecheckbox').disabled = false;
    }
    else {
        getId('wmeroadhistory_import').className = 'wmerh_button_disabled';
        getId('wmeroadhistory_export').className = 'wmerh_button_disabled';
        getId('wmeroadhistory_import').disabled = true;
        getId('wmeroadhistory_export').disabled = true;
        getId('wmeroadhistory_mergecheckbox').disabled = true;
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryIMPORT() {

    getId('wmeroadhistory_wrapper').innerHTML = '<input id=wmeroadhistory_fileselector type="file" name="files[]" />';
    getId('wmeroadhistory_wrapper').addEventListener('change', wmeroadhistoryFILESELECTOR, false);

    getId('wmeroadhistory_fileselector').click();

    reset_statistics();
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryIMPORTLOOP() {

    var saveitems  = new Array();
    var savestores = new Array();
    var compitems  = new Array();
    var compstores = new Array();

    var v = 0;
    while (importcount < importmaxcount && v<100) {

        var str = importlines[ importcount++ ];

        var percent = Math.round((importcount / importmaxcount) * 100);
        if (percent != importpercent) {
            importpercent = percent;
            getId('wmerh_progress_percent').style.minWidth = percent + '%';
            getId('wmerh_progress_percent').innerHTML      = percent + '%';
        }

        var data = str.split('¤');
        if (data[0] == '[CONFIG]')       { chunkdata = 3; continue; }
        if (data[0] == '[SEGMENTSDATA]') { chunkdata = 1; importchunk++; continue; }
        if (data[0] == '[CHANGESDATA]')  { chunkdata = 2; importchunk++; continue; }

        if (chunkdata == 3) {
            if (data[0] == 'browser=other')   importbrowser = 0;
            if (data[0] == 'browser=chrome')  importbrowser = 1;
            if (data[0] == 'browser=firefox') importbrowser = 2;
        }

        if (chunkdata == 1) {
            let ID = parseInt(data[0]);
            let T  = parseInt(data[1]);
            let E  = data[2];
            let D  = parseInt(data[3]);
            let K  = parseInt(data[4]);
            let x  = parseInt(data[5]);
            let y  = parseInt(data[6]);
            let N  = data[7];
            let C  = data[8];
            let Q  = parseInt(data[9]);
            let A  = data[10];
            let TR = data[11];
            let TS = data[12];
            let L  = parseInt(data[13]);
            let G  = parseInt(data[14]);
            let TL = parseInt(data[15]);

            var P = new Array();
            var pstr = data[16].split(',');
            for(let i=0; i<pstr.length; i++)
                P.push ( parseInt(pstr[i]) );

            let item = { ID:ID, T:T, E:E, D:D, K:K, x:x, y:y, N:N, C:C, Q:Q, A:A, TR:TR, TS:TS, L:L, G:G, TL:TL, P:P };

            if (getId('wmeroadhistory_mergecheckbox').checked == true) {
                compitems.push( item );
                compstores.push( 'segments' );
            }
            else {
                saveitems.push( item );
                savestores.push( 'segments' );
            }
        }

        if (chunkdata == 2) {
            let ID = parseInt(data[0]);
            let T  = parseInt(data[1]);
            let E  = data[2];
            let D  = parseInt(data[3]);
            let K  = parseInt(data[4]);
            let x  = parseInt(data[5]);
            let y  = parseInt(data[6]);
            let N  = data[7];
            let C  = data[8];
            let Q  = parseInt(data[9]);

            let item = { ID:ID, T:T, E:E, D:D, K:K, x:x, y:y, N:N, C:C, Q:Q };

            if (data[10] != '' || data[11] != '') {
                item.drA = parseInt( data[10] );
                item.drB = parseInt( data[11] );
            }

            if (data[12] != '' || data[13] != '') {
                item.tyA = parseInt( data[12] );
                item.tyB = parseInt( data[13] );
            }

            if (data[14] != '' || data[15] != '') {
                item.arA = data[14];
                item.arB = data[15];
            }

            if (data[16] != '' || data[17] != '') {
                item.naA = data[16];
                item.naB = data[17];
            }

            if (data[18] != '' || data[19] != '') {
                item.ciA = data[18];
                item.ciB = data[19];
            }

            if (data[20] != '' || data[21] != '') {
                item.trA = data[20];
                item.trB = data[21];
            }

            if (data[22] != '' || data[23] != '') {
                item.tsA = data[22];
                item.tsB = data[23];
            }

            if (data[24] != '' || data[25] != '') {
                item.lvA = parseInt( data[24] );
                item.lvB = parseInt( data[25] );
            }

            if (data[26] != '' || data[27] != '') {
                item.geA = parseInt( data[26] );
                item.geB = parseInt( data[27] );
            }

            if (data[28] != '' || data[29] != '') {
                item.tolA = parseInt( data[28] );
                item.tolB = parseInt( data[29] );
            }

            if (getId('wmeroadhistory_mergecheckbox').checked == true) {
                // wprowadzenie synchronicznej pojedynczej aktualizacji rekordu zmiany, tryb asynchroniczny jest zbyt skomplikowany i zagmatwany tutaj
                // jednorazowe pobranie rekordu i aktualizacja synchroniczna
                merge_imported_change_DB_Sync( item );
                break;
            }
            else {
                saveitems.push( item );
                savestores.push( 'changes' );
            }
        }

        v++;
    }

    if (compitems.length) {
        var trx = wazeDB.transaction( compstores , 'readwrite');
        var reqarray = new Array();

        trx.oncomplete = function(event) {

            var updatestores = new Array();
            var updateitems  = new Array();

            for(let i=0; i<compitems.length; i++) {
                let rekord = reqarray[i].result;
                let item   = compitems[i];

                if (rekord) {
                    if (item.T >= rekord.T) {
                        updatestores.push( compstores[i] );
                        updateitems.push( item );
                    }
                }
                else {
                    updatestores.push( compstores[i] );
                    updateitems.push( item );
                }
            }

            if (updatestores.length) {
                var trxupdate = wazeDB.transaction( updatestores , 'readwrite');

                trxupdate.oncomplete = function(event) {
                    getId('wmerh_progress_info').innerHTML = lang.importeddata + (importcount - importchunk) + ' / ' + (importmaxcount - 2);
                    setTimeout(wmeroadhistoryIMPORTLOOP, 1);
                };
                trxupdate.onerror = function(error) {
                };

                for(let i=0; i<updateitems.length; i++) {
                    var updstore = trxupdate.objectStore( updatestores[i] );
                    updstore.put( updateitems[i] );
                }
            }
            else {
                getId('wmerh_progress_info').innerHTML = lang.importeddata + (importcount - importchunk) + ' / ' + (importmaxcount - 2);
                setTimeout(wmeroadhistoryIMPORTLOOP, 1);
            }

        };
        trx.onerror = function(error) {
        };

        for(let i=0; i<compitems.length; i++) {
            let store = trx.objectStore( compstores[i] );
            let req = store.get( compitems[i].ID );
            reqarray.push(req);
        }
    }

    if (saveitems.length) {
        let trx = wazeDB.transaction( savestores , 'readwrite');

        trx.oncomplete = function(event) {
            getId('wmerh_progress_info').innerHTML = lang.importeddata + (importcount - importchunk) + ' / ' + (importmaxcount - 2);
            setTimeout(wmeroadhistoryIMPORTLOOP, 1);
        };
        trx.onerror = function(error) {
        };

        for(let i=0; i<saveitems.length; i++) {
            let store = trx.objectStore( savestores[i] );
            store.put( saveitems[i] );
        }
    }

    if (importcount == importmaxcount) {
        while (importlines.length) { importlines.pop(); }

        setTimeout(progressFadeOut, 5000);
        importexportenable(1);
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistorydatabaseInit() {

    var openrequest = window.indexedDB.open( wazeDataBaseName, 2 );

    openrequest.onsuccess = function(event) {
        wazeDB = event.target.result;
        console.log("WMERoadHistory.DataBase.Create.OK = ", openrequest.result.name );

        setTimeout(wmeroadhistoryIMPORTLOOP, 100);
    };

    openrequest.onerror = function(event) {
        importexportenable(1);
    };

    openrequest.onupgradeneeded = function(event) {
        var db = event.target.result;

        var objectStore1 = db.createObjectStore("segments", { keyPath: "ID", autoIncrement: false });
        objectStore1.createIndex("T",    "T",    { unique: false });

        var objectStore2 = db.createObjectStore("changes", { keyPath: "nr", autoIncrement: true });
        objectStore2.createIndex("T",    "T",    { unique: false });
        objectStore2.createIndex("ID",  "ID",    { unique: false });
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryFILESELECTOR(evt) {

    getId('wmerh_progress').className              = 'loading';
    getId('wmerh_progress_percent').style.minWidth = '0%';
    getId('wmerh_progress_percent').innerHTML      = '0%';
    getId('wmerh_progress_info').innerHTML         = lang.importeddata + '0 / 0';

    var files = evt.target.files;

    if (files.length) {
        var f = files[0];

        if (f.type.match('text/plain')) {
            var reader = new FileReader();

            reader.onloadstart = function(e) {
            };

            reader.onload = function(e) {
                importlines = e.target.result.split('¶\r\n');
                importlines.pop();

                if (importlines.length == 0) {
                    importlines = e.target.result.split('¶\n');
                    importlines.pop();
                }

                importchunk = 0;
                importcount = 0;
                importmaxcount = importlines.length;
                importPercent = -1;
                importbrowser = 0;
                chunkdata = 0;

                if (importmaxcount) {
                    importexportenable(0);

                    if ( getId('wmeroadhistory_mergecheckbox').checked == false ) {
                        if (wazeDB) {

                            getId('wmerh_progress_info').innerHTML = lang.preparingdatabase;
                            wazeDB.close();

                            var req = window.indexedDB.deleteDatabase( wazeDataBaseName );
                            req.onsuccess = function () {
                                wmeroadhistorydatabaseInit();

                            };
                            req.onerror = function () {
                                importexportenable(1);
                                getId('wmerh_progress_info').innerHTML = lang.dberrordelete;
                            };
                            req.onblocked = function () {
                                importexportenable(1);
                                getId('wmerh_progress_info').innerHTML = lang.dberrorlocked;
                            };
                        }
                    }
                    else
                        setTimeout(wmeroadhistoryIMPORTLOOP, 100);

                }
                else {
                    getId('wmerh_progress_percent').style.minWidth = '100%';
                    getId('wmerh_progress_percent').innerHTML      = '100%';

                    setTimeout(progressFadeOut, 5000);
                    importexportenable(1);
                }
            };

            reader.readAsText(f, 'utf-8');
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function databaseExport(maxcount) {

    var count = 0;
    var exportpercent = -1;
    var txt = '';

    //var firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    //var chrome  = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    //txt += '[BROWSER]¶\r\n';
    //if (chrome)       txt += 'chrome¶\r\n';
    //else if (firefox) txt += 'firefox¶\r\n';
    //else              txt += 'other¶\r\n';

    txt += '[SEGMENTSDATA]¶\r\n';


    //zmiana przeszukiwania bazy wg. primary key jest szybsze
    var store = wazeDB.transaction( ["segments"] ,'readonly').objectStore("segments");
    var index = store.openCursor();

    index.onerror = function(event) {
        importexportenable(1);
    };

    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            count++;
            var item = cursor.value;

            var row = '';
            row += item.ID + '¤';
            row += item.T  + '¤';
            row += item.E  + '¤';
            row += item.D  + '¤';
            row += item.K  + '¤';
            row += item.x  + '¤';
            row += item.y  + '¤';
            row += item.N  + '¤';
            row += item.C  + '¤';
            row += item.Q  + '¤';
            row += item.A  + '¤';
            row += item.TR + '¤';
            row += item.TS + '¤';
            row += item.L  + '¤';
            row += item.G  + '¤';
            row += item.TL + '¤';
            row += item.P  + '¤';

            txt += row + '¶\r\n';

            var percent = Math.round((count / maxcount) * 100);
            if (percent != exportpercent) {
                exportpercent = percent;
                getId('wmerh_progress_percent').style.minWidth = percent + '%';
                getId('wmerh_progress_percent').innerHTML      = percent + '%';
                getId('wmerh_progress_info').innerHTML         = lang.exporteddata + count + ' / ' + maxcount;
            }

            cursor.continue();
        }
        else {

            txt += '[CHANGESDATA]¶\r\n';

            //zmiana przeszukiwania bazy wg. primary key jest szybsze
            var store2 = wazeDB.transaction( ['changes'] ,'readonly').objectStore('changes');
            var index2 = store2.openCursor();

            index2.onerror = function(event) {
                importexportenable(1);
            }

            index2.onsuccess = function(event) {
                var cursor2 = event.target.result;
                if (cursor2) {
                    count++;
                    var item = cursor2.value;

                    var row = '';
                    row += item.ID   + '¤';
                    row += item.T    + '¤';
                    row += item.E    + '¤';
                    row += item.D    + '¤';
                    row += item.K    + '¤';
                    row += item.x    + '¤';
                    row += item.y    + '¤';
                    row += item.N    + '¤';
                    row += item.C    + '¤';
                    row += item.Q    + '¤';
                    if (item.drA  != undefined) row += item.drA  + '¤'; else row += '¤';
                    if (item.drB  != undefined) row += item.drB  + '¤'; else row += '¤';
                    if (item.tyA  != undefined) row += item.tyA  + '¤'; else row += '¤';
                    if (item.tyB  != undefined) row += item.tyB  + '¤'; else row += '¤';
                    if (item.arA  != undefined) row += item.arA  + '¤'; else row += '¤';
                    if (item.arB  != undefined) row += item.arB  + '¤'; else row += '¤';
                    if (item.naA  != undefined) row += item.naA  + '¤'; else row += '¤';
                    if (item.naB  != undefined) row += item.naB  + '¤'; else row += '¤';
                    if (item.ciA  != undefined) row += item.ciA  + '¤'; else row += '¤';
                    if (item.ciB  != undefined) row += item.ciB  + '¤'; else row += '¤';
                    if (item.trA  != undefined) row += item.trA  + '¤'; else row += '¤';
                    if (item.trB  != undefined) row += item.trB  + '¤'; else row += '¤';
                    if (item.tsA  != undefined) row += item.tsA  + '¤'; else row += '¤';
                    if (item.tsB  != undefined) row += item.tsB  + '¤'; else row += '¤';
                    if (item.lvA  != undefined) row += item.lvA  + '¤'; else row += '¤';
                    if (item.lvB  != undefined) row += item.lvB  + '¤'; else row += '¤';
                    if (item.geA  != undefined) row += item.geA  + '¤'; else row += '¤';
                    if (item.geB  != undefined) row += item.geB  + '¤'; else row += '¤';
                    if (item.tolA != undefined) row += item.tolA + '¤'; else row += '¤';
                    if (item.tolB != undefined) row += item.tolB + '¤'; else row += '¤';

                    txt += row + '¶\r\n';


                    var percent = Math.round((count / maxcount) * 100);
                    if (percent != exportpercent) {
                        exportpercent = percent;
                        getId('wmerh_progress_percent').style.minWidth = percent + '%';
                        getId('wmerh_progress_percent').innerHTML      = percent + '%';
                        getId('wmerh_progress_info').innerHTML         = lang.exporteddata + count + ' / ' + maxcount;
                    }

                    cursor2.continue();
                }
                else {
                    getId('wmerh_progress_percent').style.minWidth = '100%';
                    getId('wmerh_progress_percent').innerHTML      = '100%';
                    getId('wmerh_progress_info').innerHTML         = lang.exporteddata + count + ' / ' + maxcount;

                    let t = new Date;

                    let blob = new Blob([ txt ], {type: "text/plain;charset=utf-8"});
                    let y = t.getFullYear();
                    let m = t.getMonth() + 1;
                    let d = t.getDate();
                    if (m < 10) m = '0' + m;
                    if (d < 10) d = '0' + d;
                    saveAs(blob, 'wmeroadhistory_' + y + '-' + m + '-' + d + '_' + t.toLocaleTimeString() + '.txt' );

                    setTimeout(progressFadeOut, 5000);
                    importexportenable(1);
                }
            }
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function wmeroadhistoryEXPORT() {

    getId('wmerh_progress').className              = 'loading';
    getId('wmerh_progress_percent').style.minWidth = '0%';
    getId('wmerh_progress_percent').innerHTML      = '0%';
    getId('wmerh_progress_info').innerHTML         = lang.exporteddata + '0 / 0';
    importexportenable(0);

    var maxcount = 0;

    var objstore = wazeDB.transaction(["segments"], "readonly").objectStore("segments");
    var requestcount = objstore.count();
    requestcount.onerror = function() {
        importexportenable(1);
    }
    requestcount.onsuccess = function() {
        maxcount += requestcount.result;

        var objstore2 = wazeDB.transaction(["changes"], "readonly").objectStore("changes");
        var requestcount2 = objstore2.count();
        requestcount2.onerror = function() {
            importexportenable(1);
        }
        requestcount2.onsuccess = function() {
            maxcount += requestcount2.result;

            databaseExport(maxcount);
        }

    }

}
//--------------------------------------------------------------------------------------------------------
function progressFadeOut() {
    //sprawdzenie czy w czasie czekania na efekt transition nie rozpoczęto kolejnego importu
    //zezwolenie na zniknięcie paska postępu tylko wtedy, gdy proces importu został ukończony
    if (importcount == importmaxcount)
        getId('wmerh_progress').className = '';
}
//--------------------------------------------------------------------------------------------------------
function update_multi_checkboxes(event) {

    var src = event.target.id;
    var c1 = '_wmeRoadHistoryShowCircleShort';
    var c2 = '_wmeRoadHistoryShowCircleLong';
    if (src == c1) getId(c2).checked = false;
    if (src == c2) getId(c1).checked = false;
}
//--------------------------------------------------------------------------------------------------------
function showstatsdelayed() {

    if (getId('_wmeRoadHistorySummaryStats').checked == false) {
        getId('wmeroadhistory_stats').innerHTML = '';
        return;
    }

    var maxcount = 0;
    var sortable = [];
    for(ed in stats) {
        var item = stats[ed];
        let count = 0;
        for(c in item) { count++; }
        sortable.push( [ed, count] );
        if (count > maxcount) maxcount = count;
    }

    sortable.sort(function(b, a) {return a[1] - b[1]});

    if (sortable.length) {
        getId('wmeroadhistory_stats').innerHTML = '<br>';
        for(let i=0; i<sortable.length; i++) {
            let autor  = sortable[i][0];
            let count  = sortable[i][1];
            let pasek = parseInt(150 * count / maxcount);

            let klasa = 'wmeroadhistory_rank0';
            if (autor.indexOf('(1)')>=0)     klasa = 'wmeroadhistory_rank1';
            if (autor.indexOf('(2)')>=0)     klasa = 'wmeroadhistory_rank2';
            if (autor.indexOf('(3)')>=0)     klasa = 'wmeroadhistory_rank3';
            if (autor.indexOf('(4)')>=0)     klasa = 'wmeroadhistory_rank4';
            if (autor.indexOf('(5)')>=0)     klasa = 'wmeroadhistory_rank5';
            if (autor == 'Inactive User(1)') klasa = 'wmeroadhistory_rank0';

            getId('wmeroadhistory_stats').innerHTML += '<div class="' + klasa + '" style="display: inline-block; min-width:150px;" >' + autor + '</div>';
            getId('wmeroadhistory_stats').innerHTML += '<b>' + count + '</b>' + lang.statedits + '<br>';
        }
        getId('wmeroadhistory_stats').innerHTML += '<br>';
    }
}
//--------------------------------------------------------------------------------------------------------
function reset_statistics()
{
    stats = {};
    getId('wmeroadhistory_stats').innerHTML = '';
}
//--------------------------------------------------------------------------------------------------------
function initialiseWMERoadHistory()
{
    var docurl = window.document.URL;
    if (docurl.indexOf( "/pl/" ) >=0 ) lang = langPL;

    var addon       = document.createElement('section');
    addon.id        = "wmeroadhistory-addon";
    addon.innerHTML = ''
        + '<div style="margin-bottom: 5px;"><b style="margin:0px; padding:0px;"><a href="https://greasyfork.org/pl/scripts/8593-wme-road-history" target="_blank"><u>WME Road History</u></a></b> &nbsp; v' + wmech_version + '</div>'
        + '<button id=wmeroadhistory_scanarea class="btn btn-default" style="min-width:150px; margin: 0px; "></button>'
        + '<div    id=wmeroadhistory_log     style="">&nbsp;</div>'
        + '<div class=wmeroadhistory_noselect style="margin-top: 10px; ">'
        +     '<div id=wmeroadhistory_tab1>' + lang.changes + '</div>'
        +     '<div id=wmeroadhistory_tab2>' + lang.edits   + '</div>'
        +     '<div id=wmeroadhistory_tab3>' + lang.options + '</div>'
        +     '<div id=wmeroadhistory_tab9></div>'
        + '</div>'
        + '<div id=wmeroadhistory_options style="text-align: center; display:none; ">'
        +     '<div id=wmeroadhistory_wrapper style="display:none; "></div>'
        +     '<div id=wmerh_dbinfo></div>'
        +     '<br>'
        +     '<button id=wmeroadhistory_import class="wmerh_button_enabled" style=" margin: 0px; ">' + lang.imports + '</button> &nbsp; '
        +     '<button id=wmeroadhistory_export class="wmerh_button_enabled" style=" margin: 0px; ">' + lang.exports + '</button>'
        +     '<div><input id=wmeroadhistory_mergecheckbox type="checkbox" style="margin-top:10px;" title="' + lang.mergedatatip + '" />' + lang.mergedata + '</div>'
        +     '<div id=wmerh_progress>'
        +         '<div id=wmerh_progress_bar><div id=wmerh_progress_percent>0%</div></div>'
        +         '<div id=wmerh_progress_info></div>'
        +     '</div>'
        +     '<hr style="margin:5px; padding:0px;">'
        +     '<p style="margin-bottom:10px;"><b>' + lang.customize + '</b></p>'
        +     '<div style="text-align: left; ">'
        +         '<div style="text-align: left; ">' + lang.rowsperpage + ' &nbsp; <input id=_wmeRoadHistoryRows type="number" min=5 max=1000 step=5  size="4" value="50" style="width:60px" /></div><br>'
        +         '<div style="text-align: left; "><input id=_wmeRoadHistoryDateRange type="checkbox" style="" />' + lang.daterange + '</div>'
        +         '<div>'
        +               '<p style="min-width: 70px; display: inline-block; ">' + lang.showfromdate + '</p>'
        +               '<input type="number" min="2000" max="2999"  size="4" id="_wmeRoadHistoryFromYear"   style="width:65px; margin: 2px; "/>'
        +               '<input type="number" min="1"    max="12"    size="2" id="_wmeRoadHistoryFromMonth"  style="width:45px; margin: 2px; "/>'
        +               '<input type="number" min="1"    max="31"    size="2" id="_wmeRoadHistoryFromDay"    style="width:45px; margin: 2px; "/>'
        +         '</div>'
        +         '<div>'
        +               '<p style="min-width: 70px; display: inline-block; ">' + lang.showtodate    + '</p>'
        +               '<input type="number" min="2000" max="2999"  size="4" id="_wmeRoadHistoryToYear"     style="width:65px; margin: 2px; "/>'
        +               '<input type="number" min="1"    max="12"    size="2" id="_wmeRoadHistoryToMonth"    style="width:45px; margin: 2px; "/>'
        +               '<input type="number" min="1"    max="31"    size="2" id="_wmeRoadHistoryToDay"      style="width:45px; margin: 2px; "/>'
        +         '</div>'
        +         '<div style="text-align: left; "><input id=_wmeRoadHistoryFullTime         type="checkbox"             />' + lang.fulltime        + '</div>'
        +         '<div style="text-align: left; "><input id=_wmeRoadHistoryShowCircle       type="checkbox"   checked   />' + lang.showcircle      + '</div>'
        +         '<div style="text-align: left; "><input id=_wmeRoadHistoryShowCircleShort  type="checkbox"   checked   />' + lang.showcircleshort + '</div>'
        +         '<div style="text-align: left; "><input id=_wmeRoadHistoryShowCircleLong   type="checkbox"             />' + lang.showcirclelong  + '</div>'
        +         '<div style="text-align: left; "><input id=_wmeRoadHistorySummaryStats     type="checkbox"   checked   />' + lang.summarystats    + '</div>'
        +     '</div>'
        + '</div>'
        + '<div id=wmeroadhistory_stats style="font-family:Tahoma; font-size:11px; ">'
        + '</div>'
        + '<div id=wmeroadhistory_list_buttons_1 style="text-align: center; margin:0px; background: #f8f8f8; padding: 5px; visibility: hidden; ">'
        +     '<button id=wmeroadhistory_prev class="btn btn-default" style="margin: 2px; padding:0px; font-weight:normal; height:20px; padding-left:20px; padding-right:20px; " >&lt;&lt; ' + lang.prev + '</button>'
        +     '<button id=wmeroadhistory_next class="btn btn-default" style="margin: 2px; padding:0px; font-weight:normal; height:20px; padding-left:20px; padding-right:20px; " >' + lang.next + ' &gt;&gt;</button>'
        +     '<div id=wmeroadhistory_rangeinfo></div>'
        + '</div>'
        + '<div id=wmeroadhistory_list>'
        + '</div>'
        + '<div id=wmeroadhistory_list_buttons_2 style="text-align: center; margin:0px; background: #f8f8f8; padding: 5px; visibility: hidden; ">'
        +     '<button id=wmeroadhistory_prev2 class="btn btn-default" style="margin: 2px; padding:0px; font-weight:normal; height:20px; padding-left:20px; padding-right:20px; " >&lt;&lt; ' + lang.prev + '</button>'
        +     '<button id=wmeroadhistory_next2 class="btn btn-default" style="margin: 2px; padding:0px; font-weight:normal; height:20px; padding-left:20px; padding-right:20px; " >' + lang.next + ' &gt;&gt;</button>'
        + '</div>'
        + '<style>'
        +     '.wmeroadhistory_hovbutton:hover  { cursor:pointer; color: #0000FF; text-decoration: underline; }'
        +     '#wmeroadhistory_list div         { padding-left: 15px; border: 0px solid #f0f0f0; border-bottom-width: 1px; padding-top:5px; padding-bottom:5px; }'
    //+     '#wmeroadhistory_list div:hover   { background: #E6F2FF; }'
        +     '#wmeroadhistory_list h1          { margin: 0px; padding: 0px; line-height: 100%; font-size: 15px; display: inline-block; left: -15px; position: relative; padding-left: 15px; }'
        +     '#wmeroadhistory_list h1:hover    { cursor: pointer; color: #0D5270; text-decoration: underline; }'
        +     '#wmeroadhistory_list h1          { background-position: 0px 2px; background-repeat: no-repeat; }'
        +     '#wmeroadhistory_list h1          { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAMCAIAAAA/PgD0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA7ElEQVR4nGWNQUvDQBSE34Z1N65dU0mMaSkoItriqVdP/nOP/gEPYkV6MSgloUVsTbPvjYd4qHT4Tt8wjAIA0PP7x+yz2rTh8EBfF9nN8EwpUgw8PL3W2+CdU0oB+Ppep7G+v72KXsrFspWecyASAES9I1dvZVYu9LxeGWuDgHZirZnXK90wQEJ72bBoH5vqJ+x3aWyj8zRpmRnYpWW+SBM9SLw39bL5Nz2xukh8JMB0lAfmIPIH83SUCxAJ4djZ8Wk/iLAgsEzyvndWCBFAAE0GaRqbIJI5My6yTqpq3XQfTQiPb+Xd5dBo3ZlfDOiS3+b9cP0AAAAASUVORK5CYII="); }'
        +     '#wmeroadhistory_list h2          { margin: 0px; padding: 0px; line-height: 100%; color: #606060; font-size: 100%;  }'
        +     '#wmeroadhistory_list ul          { margin: 0px; padding: 0px; margin-left: 30px; margin-top: 5px; font-family: Tahoma; font-size: 11px; margin-bottom:5px; color: #606060; line-height: 18px; }'
        +     '#wmeroadhistory_list h4          { margin: 0px; padding: 0px; line-height: 100%; color: #606060; font-family: Tahoma; font-size: 11px; display: inline-block; }'
        +     '#wmeroadhistory_list h5          { margin: 0px; padding: 0px; line-height: 100%; color: #606060; font-family: Tahoma; font-size: 11px; float:left; margin-top: 5px; }'
        +     '#wmeroadhistory_list h6          { margin: 0px; padding: 0px; line-height: 100%; font-family: Tahoma; font-size: 11px; float:right; font-weight: normal; margin-top: 5px; }'
        +     '#wmeroadhistory_list p           { margin: 0px; }'
        +     '#wmeroadhistory_list hr          { margin: 0px; clear: both; border: 0px; outline: 0px; height: 0px; }'
        +     '#wmeroadhistory_tab1, #wmeroadhistory_tab2, #wmeroadhistory_tab3                         { font-size: 12px; display: inline-block; width: 85px; height: 30px; line-height: 30px; border: 1px solid #e0e0e0; border-radius: 5px 5px 0 0; border-bottom-width: 0px; text-align: center; }'
        +     '#wmeroadhistory_tab1:hover, #wmeroadhistory_tab2:hover, #wmeroadhistory_tab3:hover       { background: #d0d0d0; cursor: pointer; }'
        +     '#wmeroadhistory_tab9             { width: 100%; height:1px; background: #e0e0e0; }'
        +     '.wmeroadhistory_tab_active       { font-weight: bold;   background: #e9e9e9; }'
        +     '.wmeroadhistory_tab_noactive     { font-weight: normal; background: #f8f8f8; }'
        +     '.wmeroadhistory_noselect         { -webkit-touch-callout: none;  -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
        +     '.wmeroadhistory_rank0            { color: #808080 }'
        +     '.wmeroadhistory_rank1            { color: #E12222 }'
        +     '.wmeroadhistory_rank2            { color: #EB712D }'
        +     '.wmeroadhistory_rank3            { color: #349B20 }'
        +     '.wmeroadhistory_rank4            { color: #3176E9 }'
        +     '.wmeroadhistory_rank5            { color: #C000C0 }'
        +     '.wmeroadhistory_newseg           { color: #ffffff; font-weight: bold; background: #4CD429; border-radius: 5px 5px 5px 5px; padding: 1px 5px 1px 5px; margin-left: 3px; }'
        +     '.wmeroadhistory_turnlink         { display: inline-block; color: #0091FF; text-decoration: underline; }'
        +     '.wmeroadhistory_turnlink:hover   { color: #000000; text-decoration: underline; cursor: pointer; }'
        +     '.wmeroadhistory_turnlink         { -webkit-touch-callout: none;  -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
        +     '.wmeroadhistory_error            { color: #D72C2C }'
        +     '.wmeroadhistory_kind             { color: #404040 }'
        +     '.wmeroadhistory_toll             { color: #CC38CC }'
        +     '.wmeroadhistory_trbefore         { color: #808080 }'
        +     '.wmeroadhistory_trafter          { color: #D72C2C }'
        +     '.wmeroadhistory_uturn            { color: #808080 }'
        +     '.wmeroadhistory_trturn           { color: #D72C2C }'
        +     '.wmeroadhistory_amonly           { color: #59899e; font-weight:bold; }'
        +     '#wmerh_progress                  { opacity: 0; height: 0; margin-top: 10px; margin-bottom: 20px; }'
        +     '#wmerh_progress                  { -moz-transition: opacity 0.5s linear; -o-transition: opacity 0.5s linear; -webkit-transition: opacity 0.5s linear; }'
        +     '#wmerh_progress.loading          { opacity: 1.0; height: auto; }'
        +     '#wmerh_progress_bar              { margin: 0px; padding: 2px; border: 1px solid #a0a0a0; border-radius: 5px; font-size: 14px; width: 75%; margin: 0 auto; }'
        +     '#wmerh_progress_percent          { background-color: #C0E7F1; width: 0px; color: #000000; white-space: nowrap; }'
        +     '#wmerh_progress_info             { font-family: Tahoma; font-size: 11px; color: #000000; }'
        +     '.wmerh_button_disabled           { disabled: true;  color: #C0C0C0; }'
        +     '.wmerh_button_enabled            { disabled: false; color: #000000; }'
        +     '#wmerh_dbinfo                    { font-size: 11px; color: #a0a0a0; font-weight: normal; text-align: center; padding:0px; font-style: italic; }'
        +     '#wmeroadhistory_rangeinfo        { font-family: Tahoma; font-size: 11px; color: #007EFF; }'
        +     '.wmeroadhistorymarker1           { display:block; width:33px; height:40px; margin-left:-16px; margin-top:-36px; }'
        +     '.wmeroadhistorymarker1           { background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAoCAYAAABw65OnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACUJJREFUeNqsWA1sVFkVPu9nZjoz/ZmW0gJLf2i7si1lU6hYiMvC/siKyBokTYA1EYkJGA0SQ0j8BdaIQiIaRJQogRA2ITR21yXIJgUpsJFlkUSSVtulQO0PpfaPdqadzsyb9/y+mSm03Te0oC+5eXfe3Hu+755z7jnnXkWe/lHRlJUrVyp+v18Z+5iWlmbV19db6LKZTyNQmeYYgqqtra16YWGhbhiGIxgMai6XS41Go4qmaVYoFDLdbndU1/UIxhkYZ4CUmSBlPSuJGHhlZaUWiUScXq/Xhd9uRVFS2EzTdKqqqqGpZvyJohu2LGuUDWODw8PDIYfDEb5582b0SWSSkeDKNazOQWCsNBUg6cuWLcvbsGHDF/Lz8z8L9RdDE9kAduK/MMb2wjx32tra/n769Om6a9euteO/IWgqQEIYG4FmonZE7Ehw9XoKntHR0VSsxLdmzZr5mzdv3jpnzpzXIVgfjYh80ivS/lBkBH0PqOb5RD6TLZKCPkgZ9+/fv3DixImj586da4YmH0JcAPJGoRVjMhHFjgAeN5hnQK0zDxw48LUlS5Z8S9W0lKt3Rf7cKPJRm0jUxvU0uOzSfJGvLBBZXgQy0ejojRs3frdr165TMGEPtDUIfwpOJqJMNgFY0+6ZHo9n9tGjR38CB/vS3T6RfX8VaXgwfY8vnyXyg1dFimaIwFH/snXr1rdHRka6sLABaDc43jTa+IWkp6enYEAGSMw6fvz4XhKovyPy3fdFuoaebh//B55w9l8i87JEKop8zy9fvvy52traj2GqyNDQkNHd3f0pEsrq1asdYJmGQTkHDx78Rnl5+VuXWrCa8/aqn87DeRdvixRDG4tApKysLHT+/Pkm+EcY8iMtLS3mIxIwgz4wMODBLshatWpVxaZNm356b0DVd5y1JzB+v01uqg2Zq60iL8NHFhTPrujs7PzbnTt3+qCN8Pz58w2YyoxFv46ODu53OqNvy5Yt34QTuvZdFAkb8n95KIfyKJfyiUM84hKfJNTc3FwnfMG7ePHieXl5eSsut8Sd0LLsW9J4Pm5MqnPiHMqjXMonDvGIy2kqcwAjIkzhXb9+PeOA9l7j/7byz+WJfB87I8018TvlUj5xiEdc4utUyezZs52IbN6CgoJFwUg8DljPAJ4K0O98XqQ0R+Tb74r4QxP/p1zKJw7xYBZnzBVmzpzJJERzpPh8vsLbiITmMzD4KgLUe5vjfTsCfCiX8olDPOISX0cOUAOBgM6EhCzoa29PeMoUmW2MKFX/9cr4m+r+RX1iTBIZ7YMIZLluH/HwM4avh8NhBWGa2mBCdIwaTzbFugXxNoSVdkLguvL493dB4OeXptYY5RMHJFTixvBjXq2qFkgIWsTj1BxP2gG1DSKvlcRXLnkJAvi279L0zObB+okzhht7O51OC0nFhLdGkf/7C3xTCyLgUOjpCfApyBAhDvGIS3wdNQAJGKwJ+vr6Wkvy03MdCCHhJ4TqjqE4cLorTmLssaao05zwkxKk+/vt/feIh08G8dWenh4TCYvqCTY3N//DCQIriqZe0YWWxwQc+vS08PI8EIH8pqamW8QjLvHVuXPnUi0h2Gnk5MmTH+Idql6YPFraRc6IEa9spxpPucQ6deoUcUbYJ77KYhRBIwyTDCNwdDU0NNQvfk7kpYLpk5BpEKC8yrkijY2N9SgBu4hHXOJzN1sARwSNDKM/gDR+BhWQ/0eviWR6EmkxWZt8EEjSKOeHr4hQLuUTh3jEJX4slff39wsKmFhqR99CVRVcWrmwqmKOonyAesBI4qSm8piLmcQpU+Avv1mLCivLslAA/76uru4jfO7G9hy8desW95j5qLKCagQqEgQQBXVhf3FxsWvpwsKypXnxemA4bA9CAZEkjjjTK/LbN0VeRKl3+fLl2v379/8JztiJercfOzGIBRsTyjtqANW0hdCN+jRqYVIb0q5atXBe6ZtlitI3ItLca1/g2D1r54v8+suIZxmWefHixZo9e/a8g8qtHXGhB1EyAN8I29WYgkondoSD10YZO+A098D6QUX5Cy98sdTlXg3BjCFtg/FSf3JV5YTq36oQeRv+tB7hPBL09x87duzI4cOH34f6O7C4HmjaD62HWFElLflZcdOUmJAGMtkgk5uVlZW/ffv2tVVVVa+kpqZm8MyxsQYgk9TwYzhfNfIKAtDQ9evXLx06dOgsysZ/Q1Y3wHshy8/0MfkQpE1WIxhacFITodXgFoIXh6i+K1eu3D5z5szHs2bN0qpeLCnxIVpebn2shVcR4L6HWqLl9u1/bty48QCArqDEv4eFdCFt96If04DdKUyzsyeJdHV1mUVFRQbIhOFMocQZMwQyHStWrCh5qTQrpwkauYtTWG6ayB/WUf2Bhzt37vwVVv8JwjL3fTcWMIDdNoJjYThhAsvumJ/0aAi1RuGoIazGD5v2QfADtM7du3f/cTgQGPzZ6yJzQOCXb4h4NdPEYek4AlELyHbBBL0g4ed8hubxh2y7HTaBQHV1NXO8A+HUyfILWnDBniz/dPR12NWBlarQ0ODK5csq15UqSiEyL9Rcd+TIkQsgwD1E0hE0nku17OxslpA6ZKoZGRkKSCU1R8wpcTJyefHAjmkQwvNoOkhkoM93Goh4WRYgCYXgO+7S54sK29vbW3fs2FEDwAD+p/moYZJ3Y54HC3CjubgQxqKKigorcfD51BZlpaPjKOjhSZznUfzMxKRMCM/E/yzJUA1IOoTN5Unt6tWr/kWLFuXu3bv3w97eWBBxYR6LFR3Niz6vFLxoJEPNQpxmInxHc3JyTPhdjMT4JKyw6KTKsXoHL0LwdvN+Am8eCfhN4y0NhXIuYoi1bdu2D/C/iabRdHgTnIGIdxsG5kVoEt7mYC6DqwMBS8PcR8DjSVh0IGzBWG0BYSx+o9wZnJjwCQoj0X7O5W82XtNgfCzA8c3GCxySYMPvMK8EIINJchQ4BiKmZUsCqjUwIMhqB6YI0THBmGMcPLSQAPAk8WZTAAAeipWoFy0S4u9YdrcsVmyMCwYLGG5xXiHxZJi4XLNsI+bYPRUSjDZjxgyVJTlIaXgrWI3Ci7JYzki8J3g5VD7WDwaDtIGFE7jJRcHXTRyCozC5OTlgKVNcqCmJbSvQ0IQrw6mesStFzq2pqRkDtL08+68AAwDXuYBD7DWeHAAAAABJRU5ErkJggg==); }'
        + '</style>'
    ;

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    var newtab = document.createElement('li');
    newtab.innerHTML = '<a id=sidepanel-wmeroadhistory-tab href="#sidepanel-wmeroadhistory" data-toggle="tab" style="" >Road History</a>';
    newtab.id = 'wmeroadhistory_tab';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-wmeroadhistory";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    if (typeof W == 'undefined')
        W = window.W;
    if (typeof W.loginManager == 'undefined')
        W.loginManager = window.W.loginManager;
    if (W.loginManager && W.loginManager.isLoggedIn()) {
        let thisUser = W.loginManager.user;
        var lev = thisUser.normalizedLevel;
        if (thisUser !== null && (lev*lev >= lev+lev+lev || thisUser.isAreaManager)) {
            getId('wmeroadhistory_scanarea').onclick  = wmeroadhistorySCANAREA;
            getId('wmeroadhistory_tab1').onclick      = wmeroadhistoryTAB1;
            getId('wmeroadhistory_tab2').onclick      = wmeroadhistoryTAB2;
            getId('wmeroadhistory_tab3').onclick      = wmeroadhistoryTAB3;
            getId('wmeroadhistory_prev').onclick      = wmeroadhistoryPREV;
            getId('wmeroadhistory_next').onclick      = wmeroadhistoryNEXT;
            getId('wmeroadhistory_prev2').onclick     = wmeroadhistoryPREVDOWN;
            getId('wmeroadhistory_next2').onclick     = wmeroadhistoryNEXTDOWN;
            getId('wmeroadhistory_import').onclick    = wmeroadhistoryIMPORT;
            getId('wmeroadhistory_export').onclick    = wmeroadhistoryEXPORT;
        }
    }

    getId('_wmeRoadHistoryShowCircleShort').onchange = update_multi_checkboxes;
    getId('_wmeRoadHistoryShowCircleLong').onchange  = update_multi_checkboxes;

    updateSaveButton();

    let t = new Date();
    getId('_wmeRoadHistoryFromYear').value  = 2010;
    getId('_wmeRoadHistoryFromMonth').value = 1;
    getId('_wmeRoadHistoryFromDay').value   = 1;

    getId('_wmeRoadHistoryToYear').max      = t.getFullYear() + 1;
    getId('_wmeRoadHistoryToYear').value    = t.getFullYear() + 1;
    getId('_wmeRoadHistoryToMonth').value   = 1;
    getId('_wmeRoadHistoryToDay').value     = 1;

    getId('_wmeRoadHistoryDateRange').onchange = reset_statistics;
    getId('_wmeRoadHistoryFromYear').onchange  = reset_statistics;
    getId('_wmeRoadHistoryFromMonth').onchange = reset_statistics;
    getId('_wmeRoadHistoryFromDay').onchange   = reset_statistics;
    getId('_wmeRoadHistoryToYear').onchange    = reset_statistics;
    getId('_wmeRoadHistoryToMonth').onchange   = reset_statistics;
    getId('_wmeRoadHistoryToDay').onchange     = reset_statistics;

    loadOptions();

    var list = document.getElementsByTagName("div");
    for(let i=0; i<list.length; i++) {
        let id = list[i].id;
        let p = id.indexOf("PendingOperation");
        if (p>=0)
            wazepending = list[i];
    }

    W.vent.on("operationPending", function() {
        ventCount++;
    });
    W.vent.on("operationDone", function() {
        ventCount--;
        if (ventCount < 0) ventCount = 0;
    });

    window.setInterval(wmeroadhistoryLOOP, LOOPTIMER);
}
//--------------------------------------------------------------------------------------------------------------
bootstrapWMERoadHistory();
