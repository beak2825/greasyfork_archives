// ==UserScript==
// @name WME Funnel
// @namespace d2-mac
// @author d2-mac
// @author Janek250 & Martin Kolář & krizecek (Freedit L1+)
// @description Zpřístupní permalinky z Google Spreadsheets do WME
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://editor-beta.waze.com/editor/*
// @include         https://editor-beta.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @version 0.2.4
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBI WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AUSDR8taD1g/gAAAXpJREFUWMPtl61OA1EQhb9ZumlC qGgTEBhCAoLgCDxALa5INJJU4OoJmgfAVvACfQH6BEhcHYIQAiQI2g6CbXM77M9dWrYQOskV9+ac M7Mzc39WVJV5WsCcrWQXRCQEVn7Q56uqvo9nqjoeQBvQAkZ77NNxXivI+WjUVBUZNaGIBMCgwPIv qeqw5JRiKCKHQMcB3QGnQH/KPrsA9p21I1UdxvWAAFcmVQ0Xk3cAdaN3DZ+Zn+gBhxACPUNa/6bz qtF5AsoTmATihiH2oprlcR4AXaOz+wWXInBiyJc5A2ga/nksLkVAooZ0ReqezrcN7zYpg1lCy1Hd XLFqBieM4awm4j2+Zs+IdYEgJWt2Fx2n6numtGVEW55bruNuuWkCCKI6uuI7BlOJ2XKVLG2v6zg6 tRpmuZ9xs56p6sss3wOPOY/gmz/xIFkEsAhgEcDv+y/IYVsi8uDMN4sOoPPveuAZeMuBv59pCVR1 ICIHwJoHvOxzEzJ6LMzTPgCo6u9U796CXgAAAABJRU5ErkJggg==
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/20276/WME%20Funnel.user.js
// @updateURL https://update.greasyfork.org/scripts/20276/WME%20Funnel.meta.js
// ==/UserScript==
//--------------------------------------------------------------------------------------

funnel_verze = '0.2.4';

/* definice trvalých proměných */
var funnel_logf = false;  // loguje nazvy funkci
var funnel_onoff = localStorage.getItem("FN_onoff"); if (funnel_onoff === null) {funnel_onoff = "on";} // vypnuti nebo zapnuti natahovani dat do skriptu
var funnel_gtab = localStorage.getItem("FN_gtab"); if (funnel_gtab === null || funnel_gtab === '') {funnel_gtab = 'zadej ID Google tabulky';} // id Google tabulky ze které se berou data

var funnel_zoom = Number(localStorage.getItem("FN_zoom")); if (localStorage.getItem("FN_zoom") === null) {funnel_zoom = 1;}           // provede se zoom z permalinku
var funnel_select = Number(localStorage.getItem("FN_select")); if (localStorage.getItem("FN_select") === null) {funnel_select = 0;}   // provede se vyber z permalinku
var funnel_layers = Number(localStorage.getItem("FN_layers")); if (localStorage.getItem("FN_layers") === null) {funnel_layers = 0;}   // provede se nastaveni vrstev z permalinku
var funnel_alertselect = Number(localStorage.getItem("FN_alertselect")); if (localStorage.getItem("FN_alertselect") === null) {funnel_alertselect = 1;}  // zobrazeni alert pokud nelze vybat objekt
var funnel_posledni = Number(localStorage.getItem("FN_posledni")); if (localStorage.getItem("FN_posledni") === null) {funnel_posledni = 0;}  // cislo posledniho

var funnel_gtprefix = 'https://spreadsheets.google.com/feeds/list/';
var funnel_gtsufix = '/od6/public/values?alt=json';
var funnel_gturl = funnel_gtprefix + funnel_gtab + funnel_gtsufix;
var funnel_ctrlP = false;
var funnel_link = [];
var funnel_id01 = [];
var funnel_id02 = [];
var funnel_id03 = [];
var funnel_id04 = [];
var funnel_id05 = [];
var funnel_id06 = [];
var funnel_id07 = [];
var funnel_id08 = [];
var funnel_id09 = [];
var funnel_id10 = [];
var funnel_konec = 0;

var funnel_dataLoad = false;

var funnel_pocita = 0;
var funnel_permtype = '';

// icona
var funnel_TabIconBl = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBI WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AUSDR8taD1g/gAAAXpJREFUWMPtl61OA1EQhb9ZumlC qGgTEBhCAoLgCDxALa5INJJU4OoJmgfAVvACfQH6BEhcHYIQAiQI2g6CbXM77M9dWrYQOskV9+ac M7Mzc39WVJV5WsCcrWQXRCQEVn7Q56uqvo9nqjoeQBvQAkZ77NNxXivI+WjUVBUZNaGIBMCgwPIv qeqw5JRiKCKHQMcB3QGnQH/KPrsA9p21I1UdxvWAAFcmVQ0Xk3cAdaN3DZ+Zn+gBhxACPUNa/6bz qtF5AsoTmATihiH2oprlcR4AXaOz+wWXInBiyJc5A2ga/nksLkVAooZ0ReqezrcN7zYpg1lCy1Hd XLFqBieM4awm4j2+Zs+IdYEgJWt2Fx2n6numtGVEW55bruNuuWkCCKI6uuI7BlOJ2XKVLG2v6zg6 tRpmuZ9xs56p6sss3wOPOY/gmz/xIFkEsAhgEcDv+y/IYVsi8uDMN4sOoPPveuAZeMuBv59pCVR1 ICIHwJoHvOxzEzJ6LMzTPgCo6u9U796CXgAAAABJRU5ErkJggg==';
var funnel_TabIconRed = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AYFBjgmoxHxBAAAAXhJREFUWMPtl61OA1EQhb/ZtmlCqCgEBIaQgCA4Ag9QiysSjSQIXD1B8wDYCl5gX4A+ARJXh4CGAAmCtoPoD5fpdvcuLVsIneSKnZxzZvbO3D9RVWZpATO2/IhHpAAs/mDMV1Tfh1+q+jmgrqAZjPogpgx7QGQJeMxw9pdRbbkJBEAnwwRyqHbzTi26iBwAoQO6A06A9oR9dgHsOb5DVLtRPSAKV6Ze1S+YtAMqRu9a6ZVee54RQkGhaUhr3wxeNjpPCkUXM464bohNhVzK4IFCw+jsWFycwLEhX6ZM4NTwz6NwcQKiEBqRimfwLcO7HTeDSUIL/bq5YuUETiGCszIO7/M3u0asoRDEzJpdRUdx+r71rBnRmueSC90lN0kCQb+Orvi2wZQillwpSdvvOO7tWlXjbSecrGeovkzzPtBKuQXf/IkLyTyBeQLzBH7hu8DfNhF5cL43sk4g/Hc98Ay8pcDfT7cEqh1E9oFVD3TR5yQEnKfZjOwDEKlN4DBAFCkAAAAASUVORK5CYII=';

if (funnel_gtab == 'zadej ID Google tabulky' || funnel_gtab === ''){
    funnel_onoff = "off";
}

if (funnel_onoff == "on") {
    funnel_over_gturl();
}

function funnel_over_gturl() {
    $.ajax({
        type: 'HEAD',
        url: funnel_gturl,
        success: function() {
            console.log('WME Funnel: URL pro Google tabulku je OK');
        },
        error: function() {
            funnel_onoff = "off";
            alert ('WME Funnel - Google tabulku nelze otevrit:\n' + funnel_gtab);
        }
    });
}


if (funnel_onoff == "on") {
    console.log('WME Funnel: Start load data');

    $.getJSON(funnel_gturl, function(data) {
        for (var i = 0; data.feed.entry[i].gsx$permalink.$t !== ""; i++) {
            funnel_link[i] = data.feed.entry[i].gsx$permalink.$t;
            funnel_id01[i] = data.feed.entry[i].gsx$id01.$t;
            funnel_id02[i] = data.feed.entry[i].gsx$id02.$t;
            funnel_id03[i] = data.feed.entry[i].gsx$id03.$t;
            funnel_id04[i] = data.feed.entry[i].gsx$id04.$t;
            funnel_id05[i] = data.feed.entry[i].gsx$id05.$t;
            funnel_id06[i] = data.feed.entry[i].gsx$id06.$t;
            funnel_id07[i] = data.feed.entry[i].gsx$id07.$t;
            funnel_id08[i] = data.feed.entry[i].gsx$id08.$t;
            funnel_id09[i] = data.feed.entry[i].gsx$id09.$t;
            funnel_id10[i] = data.feed.entry[i].gsx$id10.$t;
            funnel_konec++;
        }

        console.log('WME Funnel: End load data');
        funnel_dataLoad = true;
    });
}

//Ošetření service Greasymonkey
function funnel_bootstrap() {
    funnel_log_fname('funnel_bootstrap()');
    var bGreasemonkeyServiceDefined = false;

    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService == 'object');
    }
    catch (err) {
        /* Ignore */
    }

    if (typeof unsafeWindow == 'undefined' || !bGreasemonkeyServiceDefined) {
        unsafeWindow = (function (){
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute ('onclick', 'return window;');
            return dummyElem.onclick ();

        });
    }

    // --- pridano kvuli nezavislosti na jinych skriptech
    var DLscript = document.createElement("script");
    DLscript.textContent ='unsafeWindow=window; \n'+ // need this for compatibility
        DLscript.setAttribute("type", "application/javascript");
    document.body.appendChild(DLscript);
    document.body.removeChild(DLscript);
    // ---

    /* Začátek kódu */
    funnel_wait();
}

//fce k záložce
function getElementsByClassName(classname, node) {
    funnel_log_fname('getElementsByClassName(classname, node)');
    if(!node) {
        node = document.getElementsByTagName("body")[0];
    }

    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");

    for (var i = 0, j = els.length; i<j; i++) {
        if (re.test(els[i].className)) {
            a.push(els[i]);
        }
    }

    return a;
}

//fce obsah záložky
function getId(node) {
    funnel_log_fname('getId(node)');
    return document.getElementById(node);
}

function checkCtrlPress() {
    funnel_log_fname('checkCtrlPress()');
    // kontroluej, zda je zmacknuty ctrl

    $(window).keydown(function(event) {
        if (event.which == 17) {
            funnel_ctrlP = true;
        }
    }).keyup(function(event) {
        if (event.which == 17) {
            funnel_ctrlP = false;
        }
    });
}

function getUrlParameter(param, url) {
    funnel_log_fname('getUrlParameter(param, url)');
    var sPageURL = url.substring(0); // puvodne byla v zavorce (1), nevim proc, cely vyznam me unika
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == param) {
            return sParameterName[1];
        }
    }
}

//fce záložka obsah
function funnel_init() {
    funnel_log_fname('funnel_init()');
    var addon = document.createElement('section');
    //addon.id = "funnel-addon";

    addon.innerHTML += '<b><u><a href="https://docs.google.com/spreadsheets/d/' + funnel_gtab + '/edit#gid=0" target="_blank">Google tabulka</a></u>';
    addon.innerHTML += '<br>';

    if (funnel_onoff == "on") {
        addon.innerHTML += 'Stav: <b><u><a href="#" id="funnel-switch-on-off">ONline</a></u></b> Načteno: <b>' + funnel_konec + '</b> odkazů';

        addon.innerHTML += '<font size="5"><br><a href="' + funnel_link[funnel_pred_za(-1)] + '" class="funnel-link"' + ' name="' + funnel_pred_za(-1) + '" id="funnel-last1">' + '&#9664;' + '</a></font>';
        addon.innerHTML += '&nbsp;&nbsp;<font size="5"><a href="' + funnel_link[(funnel_posledni)] + '" class="funnel-link"' + ' name="' + funnel_posledni + '" id="funnel-last2">' + (funnel_posledni + 1) + '</a></font>&nbsp;&nbsp;';
        addon.innerHTML += '<font size="5"><a href="' + funnel_link[funnel_pred_za(1)] + '" class="funnel-link"' + ' name="' + funnel_pred_za(1) + '" id="funnel-last3">' + '&#9654;' + '</a></font><br>';

        addon.innerHTML += '<br>';

        addon.innerHTML += '<div id="funnel-id01">' + funnel_id01[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id02">' + funnel_id02[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id03">' + funnel_id03[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id04">' + funnel_id04[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id05">' + funnel_id05[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id06">' + funnel_id06[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id07">' + funnel_id07[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id08">' + funnel_id08[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id09">' + funnel_id09[funnel_posledni] + '</div>';
        addon.innerHTML += '<div id="funnel-id10">' + funnel_id10[funnel_posledni] + '</div>';
        addon.innerHTML += '<br>';

    } else {
        addon.innerHTML += 'Stav: <b><u><a href="#" id="funnel-switch-on-off">OFFline</a></u></b> Načteno: <b>' + funnel_konec + '</b> F';
    }

    var funnel_Html = '';

    if (funnel_onoff == "on") {
        for (var h = 0; h < funnel_konec; h++)
        {
            // seskladnani tabulky
            funnel_Html += '<u><a href="' + funnel_link[h] + '" class="funnel-link"' + ' name="' + (h) + '"> ' + (h+1) +'. odkaz ' + '</a></u>' + ' - ' + funnel_id01[h] + funnel_id02[h] + funnel_id03[h] + funnel_id04[h] + funnel_id05[h] + funnel_id06[h] + funnel_id07[h] + funnel_id08[h] + funnel_id09[h] + funnel_id10[h] + '<br>';
        }

        if (funnel_Html !== '') { // pokud jsou nejaka data, zobrazi se hlavicka nad tabulkou a data
            addon.innerHTML += '<b>Permalinky:</b><br><div style="width:100%;height:270px;overflow-y:scroll;">' + funnel_Html + '</div>';
        }
    }

    addon.innerHTML += 'Zoom: <input type="checkbox" id="funnel_cb_zoom">';
    addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
    addon.innerHTML += 'Select: <input type="checkbox" id="funnel_cb_select">';
    addon.innerHTML += '&nbsp;';
    addon.innerHTML += '!: <input type="checkbox" id="funnel_cb_alertselect">';
    addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
    addon.innerHTML += 'Layers: <input type="checkbox" id="funnel_cb_layers">';
    addon.innerHTML += '<br><br>';
    addon.innerHTML += 'G tab: <input type="text" id="funnel_text_gtab" value="' + funnel_gtab + '"><button id="funnel_bt_gtab">\u2713</button>';
    addon.innerHTML += '<br>';

    addon.innerHTML += '<font size="1"><br><i>Script WME Funnel verze ' + funnel_verze + '</i></font>';

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    newtab = document.createElement('li');
    newtab.innerHTML = '<a title="Funnel" href="#sidepanel-funnel" data-toggle="tab" id="funnel-ousko"><img src="data:image/png;base64,' + funnel_TabIconBl + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + (funnel_posledni +1) + '</a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-funnel";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    document.getElementById("funnel_cb_zoom").checked = Boolean(funnel_zoom);                 // prvnotni nastveni checkbox zoom
    document.getElementById("funnel_cb_select").checked = Boolean(funnel_select);             // prvnotni nastveni checkbox select
    document.getElementById("funnel_cb_alertselect").checked = Boolean(funnel_alertselect);   // prvnotni nastveni checkbox alertselect
    document.getElementById("funnel_cb_layers").checked = Boolean(funnel_layers);             // prvnotni nastveni checkbox layers

    $('.funnel-link').on('click', function(event) {
        if (!funnel_ctrlP) { // pokud pri kliknuti nedrzel control
            event.preventDefault();
            funnel_href = $(this).attr('href');

            funnel_posledni = Number($(this).attr('name')); // z odkazu zjisti cislo posledniho na ktery se kliklo
            localStorage.setItem("FN_posledni", funnel_posledni); // cislo posledniho ulozi do localStorage

            // zmeni popis na ousku zalozky v levem panelu
            document.getElementById("funnel-ousko").innerHTML = '<img src="data:image/png;base64,' + funnel_TabIconBl + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + (funnel_posledni +1);

            // zmena cisla a odkazu u posledniho
            document.getElementById("funnel-last1").href = funnel_link[(funnel_pred_za(-1))]; // zmeni odkaz <
            document.getElementById("funnel-last1").name = (funnel_pred_za(-1)); // zmeni name <

            document.getElementById("funnel-last2").innerHTML = (funnel_posledni + 1); // zmeni popis posledni
            document.getElementById("funnel-last2").href = funnel_link[(funnel_posledni)]; // zmeni odkaz posledni
            document.getElementById("funnel-last2").name = funnel_posledni; // zmeni name posledni

            document.getElementById("funnel-last3").href = funnel_link[(funnel_pred_za(1))]; // zmeni odkaz >
            document.getElementById("funnel-last3").name = (funnel_pred_za(1)); // zmeni name >
            //

            // zmena popisu posledniho
            document.getElementById("funnel-id01").innerHTML = funnel_id01[funnel_posledni];
            document.getElementById("funnel-id02").innerHTML = funnel_id02[funnel_posledni];
            document.getElementById("funnel-id03").innerHTML = funnel_id03[funnel_posledni];
            document.getElementById("funnel-id04").innerHTML = funnel_id04[funnel_posledni];
            document.getElementById("funnel-id05").innerHTML = funnel_id05[funnel_posledni];
            document.getElementById("funnel-id06").innerHTML = funnel_id06[funnel_posledni];
            document.getElementById("funnel-id07").innerHTML = funnel_id07[funnel_posledni];
            document.getElementById("funnel-id08").innerHTML = funnel_id08[funnel_posledni];
            document.getElementById("funnel-id09").innerHTML = funnel_id09[funnel_posledni];
            document.getElementById("funnel-id10").innerHTML = funnel_id10[funnel_posledni];
            //

            xy = OpenLayers.Layer.SphericalMercator.forwardMercator(parseFloat(getUrlParameter('lon', funnel_href)), parseFloat(getUrlParameter('lat', funnel_href)));

            unsafeWindow.Waze.map.setCenter(xy);

            // pokud je povolený, provede se zoom
            if (funnel_zoom === 1) {
                unsafeWindow.Waze.map.zoomTo(getUrlParameter('zoom', funnel_href));
            }

            // pokud je povoleny, provede se nastaveni vrstev
            if (funnel_layers === 1) {
                funnel_vyber_vrstev();
            }

            // pokud je povoleny, provede se vyber
            if (funnel_select === 1) {
                funnel_druh_objektu();
                funnel_pocita = 0;
                funnel_vyber_objektu();
            }

        }
    });

    $('#funnel-switch-on-off').on('click', function(event) {
        event.preventDefault();
        if (funnel_onoff == "on") {
            localStorage.setItem("FN_onoff", 'off');
            funnel_onoff = 'off';
            document.getElementById("funnel-switch-on-off").innerHTML = 'OFFline'; // zmeni stav na OFF
        } else {
            localStorage.setItem("FN_onoff", 'on');
            funnel_onoff = 'on';
            document.getElementById("funnel-switch-on-off").innerHTML = 'ONline'; // zmeni stav na ON
            //                    window.location.reload();
        }
    });

    $('#funnel_cb_zoom').on('change', function(event) {
        funnel_log_fname('#funnel_cb_zoom');
        event.preventDefault();
        if (funnel_zoom === 1) {
            funnel_zoom = 0;
        } else {
            funnel_zoom = 1;
        }
        localStorage.setItem("FN_zoom", funnel_zoom);
        document.getElementById("funnel_cb_zoom").checked = Boolean(funnel_zoom); // zmeni stav
    });

    $('#funnel_cb_select').on('change', function(event) {
        funnel_log_fname('#funnel_cb_select');
        event.preventDefault();
        if (funnel_select === 1) {
            funnel_select = 0;
        } else {
            funnel_select = 1;
        }
        localStorage.setItem("FN_select", funnel_select);
        document.getElementById("funnel_cb_select").checked = Boolean(funnel_select); // zmeni stav
    });

    $('#funnel_cb_layers').on('change', function(event) {
        funnel_log_fname('#funnel_cb_layers');
        event.preventDefault();
        if (funnel_layers === 1) {
            funnel_layers = 0;
        } else {
            funnel_layers = 1;
        }
        localStorage.setItem("FN_layers", funnel_layers);
        document.getElementById("funnel_cb_layers").checked = Boolean(funnel_layers); // zmeni stav
    });

    $('#funnel_cb_alertselect').on('change', function(event) {
        funnel_log_fname('#funnel_cb_alertselect');
        event.preventDefault();
        if (funnel_alertselect === 1) {
            funnel_alertselect = 0;
        } else {
            funnel_alertselect = 1;
        }
        localStorage.setItem("FN_alertselect", funnel_alertselect);
        document.getElementById("funnel_cb_alertselect").checked = Boolean(funnel_alertselect); // zmeni stav
    });


    $('#funnel_bt_gtab').on('click', function(event) {
        funnel_log_fname('#funnel_bt_gtab');
        event.preventDefault();
        funnel_gtab = document.getElementById("funnel_text_gtab").value;
        localStorage.setItem("FN_gtab", funnel_gtab);
        funnel_gturl = funnel_gtprefix + funnel_gtab + funnel_gtsufix;
        if (funnel_gtab != 'zadej ID Google tabulky' && funnel_gtab !== '') {
            funnel_over_gturl();
            funnel_posledni = 0;
        }
    });

}

function funnel_pred_za(funnel_okolik) {
    if ((funnel_posledni + funnel_okolik) < 0) {return 0;}
    if ((funnel_posledni + funnel_okolik) > (funnel_konec - 1)) {return (funnel_konec - 1);}
    return (funnel_posledni + funnel_okolik);
}

function funnel_log_fname(funnel_fname) {
    if (funnel_logf) {
        console.log('WME Funnel: function ' + funnel_fname);
    }
}

function funnel_druh_objektu() {
    funnel_log_fname('funnel_druh_objektu()');
    funnel_permtype = "zadny";
    if (funnel_href.indexOf('nodes') > -1) {
        funnel_permtype = 'nodes';
    }

    if (funnel_href.indexOf('venues') > -1) {
        funnel_permtype = 'venues';
    }

    if (funnel_href.indexOf('segments') > -1) {
        funnel_permtype = 'segments';
    }
}

function funnel_vyber_objektu() {
    funnel_log_fname('funnel_vyber_objektu()');
    if (funnel_permtype == 'zadny') {return;} // pokud neni co vybrat, vrati se
    var funnel_sezobj = [];
    var funnel_vyber = getUrlParameter(funnel_permtype, funnel_href);
    var funnel_idobj = funnel_vyber.split(',');

    for (var i = 0; funnel_idobj[i]; i++) {

        switch(funnel_permtype) {
            case 'nodes':
                var funnel_wobjekts = Waze.selectionManager.model.nodes.objects[parseInt(funnel_idobj[i])];
                break;
            case 'venues':
                var funnel_wobjekts = Waze.selectionManager.model.venues.objects[funnel_idobj[i]];
                break;
            case 'segments':
                var funnel_wobjekts = Waze.selectionManager.model.segments.objects[parseInt(funnel_idobj[i])];
                break;
        }

        if (typeof funnel_wobjekts === 'undefined') {
            funnel_pocita++;
            if (funnel_pocita >= 10) {
                // pokud je povoleny, provede se alert pokud nelze objekt vybrat
                if (funnel_alertselect === 1) {
                    alert('WME Funnel - Nelze vybrat ' + funnel_permtype + ' ID: ' + funnel_idobj[i]);
                }
                // zmeni popis na ousku zalozky v levem panelu - ikona cervena
                document.getElementById("funnel-ousko").innerHTML = '<img src="data:image/png;base64,' + funnel_TabIconRed + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + (funnel_posledni +1);
                return;
            }
            setTimeout(funnel_vyber_objektu, 500);
            return;
        }
        else {
            funnel_sezobj.push(funnel_wobjekts);
            // zmeni popis na ousku zalozky v levem panelu - ikona cerna
            document.getElementById("funnel-ousko").innerHTML = '<img src="data:image/png;base64,' + funnel_TabIconBl + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + (funnel_posledni +1);
        }
    }
    Waze.selectionManager.select(funnel_sezobj);
}

function funnel_vyber_vrstev() {
    funnel_log_fname('funnel_vyber_vrstev()');

    // vytahne do console.log nazvy vrstev
    //
    //    for (i=0; i < 26; i++){
    //        layers_name = Waze.map.controls[0].map.layers[i].name;
    //        console.log ('WME Funnel: ' + i + ' - '  + layers_name);
    //    }

    // id - nazvy vrstvy
    // ---------------------
    //  0 + Satelitní snímky
    //  1 + Města
    //  2 + Silnice
    //  3 + GPS body
    //  4 - Archív
    //  5 + Správci oblastí
    //  6 + Místa
    //  7 - Aktualizace Míst
    //  8 - Sloučené křižovatky
    //  9 - Segmenty
    // 10 - Uzly
    // 11 + Pevné radary
    // 12 - sketch
    // 13 + Systémová hlášení
    // 14 + Uživatelská hlášení
    // 15 + Oblasti editace
    // 16 - bigJunctionPathLayer
    // 17 - Uzavírky cest
    // 18 - Node Connections
    // 19 - Bridge
    // 20 - newNodes
    // 21 - streetViewPin
    // 22 - Waze.Control.SelectHighlightFeature_224_container
    // 23 - drawLandmark
    // 24 - Search
    // 25 - Přihlášení uživatelé

    funnel_vridx = [0, 1, 2, 3, 5, 6, 11, 13, 14, 15]; // ID vrstev pro jednotlive bity z cisla vrstev
    if (funnel_href.indexOf('layers') > -1) {
        var funnel_vrstvybin = (parseInt(getUrlParameter('layers', funnel_href))).toString(2); // dekadicke cislo vrstvy nacte a prevede na binarni do stringu
        var funnel_vrstvyarr = funnel_vrstvybin.split(""); // binarni cislo vrstev naplni do pole
        funnel_vrstvyarr.reverse(); // pole otoci tak aby nejmene vyznamny bit byl jako prvni

        for (var i = 0; i < 10; i++) {
            if (funnel_vrstvyarr[i] == 1) {
                Waze.map.controls[0].map.layers[funnel_vridx[i]].setVisibility(true);
            }
            else {
                Waze.map.controls[0].map.layers[funnel_vridx[i]].setVisibility(false);
            }
        }
    }
}

function funnel_wait() {
    funnel_log_fname('funnel_wait()');
    if (!window.Waze.map || typeof map === 'undefined' || typeof Waze.loginManager.user === 'undefined' || Waze.loginManager.user === null) {
        console.log('WME Funnel: ceka na Waze');
        setTimeout(funnel_wait, 500);
    } else {
        hasStates = Waze.model.hasStates();

        if (funnel_onoff == "on") {
            funnel_after_load_data();
        }
        else {
            console.log('WME Funnel: Load data off');
            funnel_init();
        }
    }
}

function funnel_after_load_data() {
    funnel_log_fname('funnel_after_load_data()');
    if (funnel_dataLoad) {
        console.log('WME Funnel: Start showing data');
        funnel_init();
    }
    else {
        setTimeout(funnel_after_load_data, 500);
    }
}

//volání fce a samotný script
funnel_bootstrap();

/*--------------------------------------------------------------------------------------
poznámky pod čarou :D

*/