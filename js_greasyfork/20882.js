// ==UserScript==
// @name            WME Funnel
// @namespace       d2-mac
// @author          d2-mac
// @author          MajkiiTelini (opravy)
// @author          Janek250 & Martin Kolář & krizecek (Freedit L1+)
// @description     Zpřístupní permalinky z Google Spreadsheets do WME
// @match           https://*.waze.com/*editor*
// @grant			GM_xmlhttpRequest
// @connect 		docs.google.com
// @version         0.4.35
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBI WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AUSDR8taD1g/gAAAXpJREFUWMPtl61OA1EQhb9ZumlC qGgTEBhCAoLgCDxALa5INJJU4OoJmgfAVvACfQH6BEhcHYIQAiQI2g6CbXM77M9dWrYQOskV9+ac M7Mzc39WVJV5WsCcrWQXRCQEVn7Q56uqvo9nqjoeQBvQAkZ77NNxXivI+WjUVBUZNaGIBMCgwPIv qeqw5JRiKCKHQMcB3QGnQH/KPrsA9p21I1UdxvWAAFcmVQ0Xk3cAdaN3DZ+Zn+gBhxACPUNa/6bz qtF5AsoTmATihiH2oprlcR4AXaOz+wWXInBiyJc5A2ga/nksLkVAooZ0ReqezrcN7zYpg1lCy1Hd XLFqBieM4awm4j2+Zs+IdYEgJWt2Fx2n6numtGVEW55bruNuuWkCCKI6uuI7BlOJ2XKVLG2v6zg6 tRpmuZ9xs56p6sss3wOPOY/gmz/xIFkEsAhgEcDv+y/IYVsi8uDMN4sOoPPveuAZeMuBv59pCVR1 ICIHwJoHvOxzEzJ6LMzTPgCo6u9U796CXgAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/20882/WME%20Funnel.user.js
// @updateURL https://update.greasyfork.org/scripts/20882/WME%20Funnel.meta.js
// ==/UserScript==
//--------------------------------------------------------------------------------------

/* definice trvalých proměných */
var funnel_logf = false;  // loguje nazvy funkci

var funnel_onoff = localStorage.getItem("FN_onoff"); if (funnel_onoff === null){funnel_onoff = "on";}                                                     // vypnuti nebo zapnuti natahovani dat do skriptu
var funnel_lista_onoff = localStorage.getItem("FN_lista_onoff"); if (funnel_lista_onoff === null){funnel_lista_onoff = "on";}                             // vypnuti nebo zapnuti natahovani dat do skriptu
var funnel_gtab = localStorage.getItem("FN_gtab"); if (funnel_gtab === null || funnel_gtab === ''){funnel_gtab = 'zadej ID Google tabulky';}              // id Google tabulky ze které se berou data
var funnel_gtlist = localStorage.getItem("FN_gtlist"); if (funnel_gtlist === null || funnel_gtlist === ''){funnel_gtlist = 'zadej list Google tabulky';}  // nazevl listu Google tabulky ze které se berou data

var funnel_zoom = Number(localStorage.getItem("FN_zoom")); if (localStorage.getItem("FN_zoom") === null){funnel_zoom = 1;}                                // provede se zoom z permalinku
var funnel_zpermfix = Number(localStorage.getItem("FN_zpermfix")); if (localStorage.getItem("FN_zpermfix") === null){funnel_zpermfix = 0;}                // zoon z permalinku (0) nebo fixni (1)
var funnel_zfix = Number(localStorage.getItem("FN_zfix")); if (localStorage.getItem("FN_zfix") === null){funnel_zfix = 16;}                               // fixni zoom (12-22)
if (funnel_zfix < 12){funnel_zfix = funnel_zfix + 12;}

var funnel_select = Number(localStorage.getItem("FN_select")); if (localStorage.getItem("FN_select") === null){funnel_select = 0;}                        // provede se vyber z permalinku
var funnel_alertselect = Number(localStorage.getItem("FN_alertselect")); if (localStorage.getItem("FN_alertselect") === null){funnel_alertselect = 1;}    // zobrazeni alert pokud nelze vybat objekt

var funnel_layers = Number(localStorage.getItem("FN_layers")); if (localStorage.getItem("FN_layers") === null){funnel_layers = 0;}                        // provede se nastaveni vrstev z permalinku
var funnel_lpermfix = Number(localStorage.getItem("FN_lpermfix")); if (localStorage.getItem("FN_lpermfix") === null){funnel_lpermfix = 0;}                // layers z permalinku (0) nebo fixni (1)
var funnel_lfix = Number(localStorage.getItem("FN_lfix")); if (localStorage.getItem("FN_lfix") === null){funnel_lfix = 485;}                              // cislo vrstvy

var funnel_lock = Number(localStorage.getItem("FN_lock")); if (localStorage.getItem("FN_lock") === null){funnel_lock = 0;}                                // zamek (0-5), pounuto o -1 oproti viditelne hodnote zoom
var funnel_ldolu = Number(localStorage.getItem("FN_ldolu")); if (localStorage.getItem("FN_ldolu") === null){funnel_ldolu = 0;}                            // provede se take snizeni vyssiho zamku

var funnel_posledni = Number(localStorage.getItem("FN_posledni")); if (localStorage.getItem("FN_posledni") === null){funnel_posledni = 0;}                // cislo posledniho
var funnel_drivekonec = Number(localStorage.getItem("FN_drivekonec")); if (localStorage.getItem("FN_drivekonec") === null){funnel_drivekonec = 0;}        // cislo posledniho

var funnel_lista_radky = Number(localStorage.getItem("FN_lista_radky")); if (localStorage.getItem("FN_lista_radky") === null){funnel_lista_radky = 10;}   // pocet radku ktere lista zobrazuje
var funnel_copy_od = Number(localStorage.getItem("FN_copy_od")); if (localStorage.getItem("FN_copy_od") === null){funnel_copy_od = 1;}                    // copirovat od radku
var funnel_copy_do = Number(localStorage.getItem("FN_copy_do")); if (localStorage.getItem("FN_copy_do") === null){funnel_copy_do = 10;}                   // copirovat do radku

// v0.4.0 hodnoty: height:110px;width:150px;
// v0.4.2 hodnoty: height:155px;width:500px;
// v0.4.3 hodnoty: height:155px;width:150px;
// v0.4.5 hodnoty: height:155px;width:175px;
// v0.4.8 hodnoty: height:204px;width:225px;

var funnel_lista_vyska = (16 * funnel_lista_radky) + 46;
var funnel_lista_h = 9 * 25;

var funnel_lista_sirka = Number(localStorage.getItem("FN_lista_sirka")); if (localStorage.getItem("FN_lista_sirka") === null){funnel_lista_sirka = funnel_lista_h;localStorage.setItem("FN_lista_sirka", funnel_lista_h);}  // sirka listy


var funnel_gturl;  // URL Google tabulky
var funnel_gtjson; // JSON Google tabulky

var funnel_gt_a = 'https://docs.google.com/spreadsheets/d/';
var funnel_gt_bj = '/gviz/tq?tqx=out:json';
var funnel_gt_bu = '/edit';
var funnel_gt_cj = '&sheet=';

funnel_sestav_urls();

var funnel_ctrlP = false;
var funnel_link = [];

var funnel_id = Array.from(Array(11), () => new Array);

var funnel_konec = 0;

var funnel_dataLoad = false;

var funnel_pocita = 0;
var funnel_permtype = '';
var funnel_smer = 0; // -1 predesly, 0 aktualni, 1 nasledujici

var funnel_copy_id = 0;
var funnel_copy_obsah;
var funnel_copy_smer = 0;

// icona
var funnel_TabIconRed = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AYFBjgmoxHxBAAAAXhJREFUWMPtl61OA1EQhb/ZtmlCqCgEBIaQgCA4Ag9QiysSjSQIXD1B8wDYCl5gX4A+ARJXh4CGAAmCtoPoD5fpdvcuLVsIneSKnZxzZvbO3D9RVWZpATO2/IhHpAAs/mDMV1Tfh1+q+jmgrqAZjPogpgx7QGQJeMxw9pdRbbkJBEAnwwRyqHbzTi26iBwAoQO6A06A9oR9dgHsOb5DVLtRPSAKV6Ze1S+YtAMqRu9a6ZVee54RQkGhaUhr3wxeNjpPCkUXM464bohNhVzK4IFCw+jsWFycwLEhX6ZM4NTwz6NwcQKiEBqRimfwLcO7HTeDSUIL/bq5YuUETiGCszIO7/M3u0asoRDEzJpdRUdx+r71rBnRmueSC90lN0kCQb+Orvi2wZQillwpSdvvOO7tWlXjbSecrGeovkzzPtBKuQXf/IkLyTyBeQLzBH7hu8DfNhF5cL43sk4g/Hc98Ay8pcDfT7cEqh1E9oFVD3TR5yQEnKfZjOwDEKlN4DBAFCkAAAAASUVORK5CYII=';

function funnel_over_gturl() {
    GM_xmlhttpRequest({
        method: 'HEAD',
        url: funnel_gtjson,
        onload: function() {
            console.log('WME Funnel: URL pro Google tabulku je OK');
        },
        onerror: function() {
            localStorage.setItem("FN_onoff", 'off');
            funnel_onoff = "off";
            if (document.getElementById('funnel-switch-on-off') !==null){
                document.getElementById("funnel-switch-on-off").innerHTML = 'off'; // zmeni stav na OFF
            }
            alert('WME Funnel - Google tabulku nelze otevřít:\n' + funnel_gtab + '\n\nKvůli neexistující tabulce bude skript ve stavu off.');
        }
    });
}


function funnel_reg_kl_zkratky(actionName, callback, keyName) {
    I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members[keyName] = actionName;
    W.accelerators.addAction(keyName, {group: 'default'});
    W.accelerators.events.register(keyName, null, callback);
    W.accelerators._registerShortcuts({["name"]: keyName});
}

function funnel_obsluha_kl_zkratky(element) {
    return function() {
        if(element == 'funnel_user_f1'){
            if (typeof($(".venue-edit-section wz-tabs wz-tab.venue-edit-tab-more-info")[0]) !== "undefined") {
                $(".venue-edit-section wz-tabs wz-tab.venue-edit-tab-more-info")[0].isActive = true;
            }
        }
        document.getElementById(element).click();
    };
}

//fce k záložce
function getElementsByClassName(classname, node) {
    funnel_log_fname('getElementsByClassName(classname, node)');
    if(!node){
        node = document.getElementsByTagName("body")[0];
    }

    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");

    for (var i = 0, j = els.length; i<j; i++) {
        if (re.test(els[i].className)){
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
    // kontroluje, zda je zmacknuty ctrl

    $(window).keydown(function(event) {
        if (event.which == 17){
            funnel_ctrlP = true;
        }
    }).keyup(function(event) {
        if (event.which == 17){
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

        if (sParameterName[0] == param){
            return sParameterName[1];
        }
    }
}

function funnel_start() {

    funnel_log_fname('funnel_start()');

    if (funnel_gtab == 'zadej ID Google tabulky' || funnel_gtab == ''
        || funnel_gtlist == 'zadej list Google tabulky' || funnel_gtlist == ''
       )
    {
        funnel_onoff = "off";
    }

    if (funnel_lista_onoff == "on" && funnel_onoff == "on"){
        // jQuery Drag&Drop extention - .posun()
        $.fn.posun = function(e) {
            if (e = $.extend({
                handle: "",
                cursor: "move"
            }, e), "" === e.handle) var a = this;
            else var a = this.find(e.handle);
            return a.css("cursor", e.cursor).on("mousedown", function(a) {
                if ("" === e.handle) var s = $(this).addClass("posunovani");
                else var s = $(this).addClass("active-handle").parent().addClass("posunovani");
                var t = s.css("z-index"),
                    o = s.outerHeight(),
                    n = s.outerWidth(),
                    l = s.offset().top + o - a.pageY,
                    r = s.offset().left + n - a.pageX;
                s.css("z-index", 1e3).parents().on("mousemove", function(e) {
                    $(".posunovani").offset({
                        top: e.pageY + l - o,
                        left: e.pageX + r - n
                    });
                }), a.preventDefault();
            }).on("mouseup", function() {
                localStorage.setItem("FN_listaX", $(this).offset().left), localStorage.setItem("FN_listaY", $(this).offset().top), "" === e.handle ? $(this).removeClass("posunovani") : $(this).removeClass("active-handle").parent().removeClass("posunovani");
            });
        };

        // Definice ovládací lišty
        if (localStorage.FN_listaX && localStorage.FN_listaY){
            var funnel_lista_x = localStorage.FN_listaX;
            var funnel_lista_y = localStorage.FN_listaY;
        } else {
            var funnel_lista_x = 700;
            var funnel_lista_y = 80;
        }

        // Pouziti odkazu v liste
        var funnel_btns = '<style>#lista {position:absolute;top:' + funnel_lista_y + 'px;left:' + funnel_lista_x + 'px;z-index:100;background: rgba(147,196,211,0.8);border:0px solid #111;border-radius:5px;height:' + funnel_lista_vyska + 'px;width:' + funnel_lista_sirka + 'px;}</style>'; // styl pro lisstu
        funnel_btns += '<style>#lista .btn {background-color:transparent;border:1;border-color:#5B8BA0;border-radius:5px;height:25px;width:25px;font-size:10px;text-align:center;padding:0px 0px;}</style>'; // styl pro tlačítka
        funnel_btns += '<style>#lista .popis {height: 16px;font-size:10px;text-align:left;overflow:hidden;white-space:nowrap;padding:2px 5px 2px 5px;}</style>'; // styl pro normalni pozadi
        funnel_btns += '<style>#lista .popis_rb {background: rgba(255,128,128,0.8);height: 16px;font-size:10px;text-align:left;overflow:hidden;white-space:nowrap;padding:2px 5px 2px 5px;}</style>'; // styl pro cervene pozadi
        funnel_btns += '<style>#lista .popis_sb {background: rgba(192,192,192,0.8);height: 16px;font-size:10px;text-align:left;overflow:hidden;white-space:nowrap;padding:2px 5px 2px 5px;}</style>'; // styl pro sede pozadi
        funnel_btns += '<style>#lista .popis_zb {background: rgba(192,192,0,0.8);height: 16px;font-size:10px;text-align:left;overflow:hidden;white-space:nowrap;padding:2px 5px 2px 5px;}</style>'; // styl pro zlute pozadi

        funnel_btns += '<button class="btn" id="funnel_last1_btn" title="předešlý">&#x25c0;</button>'; // predesly
        funnel_btns += '<button class="btn" id="funnel_last2_btn" title="aktuální">&#x25cf;</button>'; // aktualni
        funnel_btns += '<button class="btn" id="funnel_last3_btn" title="následující">&#x25b6;</button>'; // nasledujici
        funnel_btns += '<button class="btn" id="funnel_user_f1_btn" title="oprava www a telefonu">&#x260e;</button>'; // oprava www a telefonu
        funnel_btns += '<button class="btn" id="funnel_user_f2_btn" title="nastavení zámku"><span id="funnel_user_f2_lista">Lx</span></button>'; // zamek pro landmark
        funnel_btns += '<button class="btn" id="funnel_user_copy_c_btn" title="kopírování do schránky"><span id="funnel_user_copy_c_lista">c</span></button>'; // kopirovani do schranky
        funnel_btns += '<button class="btn" id="funnel_user_f3_btn" title="přejezdový radar"><span id="funnel_user_f3_lista">R</span></button>'; // přejezdový radar

        funnel_btns += '<button class="btn" style="background-color:transparent;border:0;height:25px;width:17px;font-size:10px;text-align:center;padding: 0 0 0 0px;cursor:move;" title="přesun lišty">&#x2630;</button>'; // Drag handle

        funnel_btns += '<div class="popis" id="funnel-last2-lista"></div>';

        for (var i = 1; i < funnel_lista_radky + 1; i++){
            funnel_btns += '<div class="popis" id="funnel-id' + i + '-lista"></div>';
        }

        $('body').append('<div id="lista">' + funnel_btns + '</div>');
        $('#lista').posun();

        document.getElementById("funnel_last1_btn").addEventListener("click", function (){funnel_klik_tl('funnel-last1')});
        document.getElementById("funnel_last2_btn").addEventListener("click", function (){funnel_klik_tl('funnel-last2')});
        document.getElementById("funnel_last3_btn").addEventListener("click", function (){funnel_klik_tl('funnel-last3')});
        document.getElementById("funnel_user_f1_btn").addEventListener("click", function (){funnel_klik_tl('funnel_user_f1')});
        document.getElementById("funnel_user_f2_btn").addEventListener("click", function (){funnel_klik_tl('funnel_user_f2')});
        document.getElementById("funnel_user_copy_c_btn").addEventListener("click", function (){funnel_klik_tl('funnel_user_copy_c')});
        document.getElementById("funnel_user_f3_btn").addEventListener("click", function (){funnel_klik_tl('funnel_user_f3')});

        // Obsluha kliknuti na tlacitko v liste
        funnel_klik_tl = function(server) {
            if(server == 'funnel_user_f1'){document.querySelector("div.tabs-container li.hide-residential a").click();}
            document.getElementById(server).click();
        };
    }

    funnel_natahni_data();

    // definice klavesovych zkratek

    funnel_reg_kl_zkratky('Funnel - předešlý', funnel_obsluha_kl_zkratky('funnel-last1'), 'Funnel_predesly');
    funnel_reg_kl_zkratky('Funnel - aktuální', funnel_obsluha_kl_zkratky('funnel-last2'), 'Funnel_aktualni');
    funnel_reg_kl_zkratky('Funnel - následující', funnel_obsluha_kl_zkratky('funnel-last3'), 'Funnel_nasledujici');
    funnel_reg_kl_zkratky('Funnel - oprav telefon a www', funnel_obsluha_kl_zkratky('funnel_user_f1'), 'Funnel_oprav_telefon_a_www');
    funnel_reg_kl_zkratky('Funnel - uzamknutí landmarku', funnel_obsluha_kl_zkratky('funnel_user_f2'), 'Funnel_uzamkni_landmark');

    funnel_reg_kl_zkratky('Funnel - kopírování do schránky', funnel_obsluha_kl_zkratky('funnel_user_copy_c'), 'Funnel_copy_c');

    funnel_reg_kl_zkratky('Funnel - přejezdový radar', funnel_obsluha_kl_zkratky('funnel_user_f3'), 'Funnel_prejezdovy_radar');

}

//fce záložka obsah
async function funnel_init() {

    funnel_log_fname('funnel_init()');
    funnel_upobject = require("Waze/Action/UpdateObject");

    var addon = document.createElement('section');
    //addon.id = "funnel-addon";

    addon.innerHTML += '<b><u><a href="' + funnel_gturl + '" target="_blank" id="funnel-gturl">Google tabulka</a></u>';
    addon.innerHTML += '&nbsp;&nbsp;';
    addon.innerHTML += '<b><u><a href="' + funnel_gtjson + '" target="_blank" id="funnel-gtjson">JSON</a></u>';
    addon.innerHTML += '<br>';

    addon.innerHTML += 'Stav: <b><u><a href="#" id="funnel-switch-on-off">' + funnel_onoff + '</a></u></b> Lišta: <b><u><a href="#" id="funnel-lista-on-off">' + funnel_lista_onoff + '</a></u></b> Načteno: <b>' + funnel_konec + '</b> odkazů';
    addon.innerHTML += '<br><br>';

    if (funnel_onoff == "on"){
        addon.innerHTML += '<font size="5"><a href="' + funnel_link[funnel_pred_za(-1)] + '" class="funnel-prev"' + ' name="' + funnel_pred_za(-1) + '" id="funnel-last1" title="předešlý">' + '&#9664;' + '</a></font>';
        addon.innerHTML += '&nbsp;&nbsp;<font size="5"><a href="' + funnel_link[(funnel_posledni)] + '" class="funnel-akt"' + ' name="' + funnel_posledni + '" id="funnel-last2" title="aktuální">' + (funnel_posledni + 1) + '</a></font>&nbsp;&nbsp;';
        addon.innerHTML += '<font size="5"><a href="' + funnel_link[funnel_pred_za(1)] + '" class="funnel-next"' + ' name="' + funnel_pred_za(1) + '" id="funnel-last3" title="následující">' + '&#9654;' + '</a></font>';

        addon.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

        addon.innerHTML += '<font size="3"><button id="funnel_user_f1" title="oprava www a telefonu">\u260E/w</button></font>';

        addon.innerHTML += '&nbsp;&nbsp;&nbsp;';

        addon.innerHTML += '<font size="3"><button id="funnel_user_f2" title="nastavení zámku">Lx</button></font>';
        addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
        addon.innerHTML += '<font size="3"><button id="funnel_user_copy_c" title="kopírování do schránky">C</button></font>';
        addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
        addon.innerHTML += '<font size="3"><button id="funnel_user_f3" title="přejezdový radar">R</button></font>';

        addon.innerHTML += '<br><br>';

        for (var i = 1; i < funnel_lista_radky + 1; i++){
            addon.innerHTML += '<div id="funnel-id' + i + '">' + funnel_id[i][funnel_posledni] + '</div>';
        }

        addon.innerHTML += '<br>';
    }
    else
    {
        addon.innerHTML += '<font size="3"><button id="funnel_user_f1">\u260E / www</button></font>';

        addon.innerHTML += '&nbsp;&nbsp;&nbsp;';

        addon.innerHTML += '<font size="3"><button id="funnel_user_f2"><b>Lx</b></button></font>';

        addon.innerHTML += '<br><br>';
    }

    var funnel_Html = '';

    if (funnel_onoff == "on"){
        for (var h = 0; h < funnel_konec; h++)
        {
            // seskladnani tabulky
            funnel_Html += '<u><a href="' + funnel_link[h] + '" class="funnel-link"' + ' name="' + (h) + '"> ' + (h+1) +'. odkaz ' + '</a></u>' + ' - ' + funnel_id[1][h] + ' ' + funnel_id[2][h] + '<br>';
        }

        if (funnel_Html !== ''){ // pokud jsou nejaka data, zobrazi se hlavicka nad tabulkou a data
            addon.innerHTML += '<b>Permalinky:</b><br><div style="width:100%;height:250px;overflow-y:scroll;">' + funnel_Html + '</div>';
            addon.innerHTML += '<br>';
        }
    }

    // povoleni zoom a nastevni z permalinku nebo fixniho
    addon.innerHTML += 'Zoom: <input type="checkbox" id="funnel_cb_zoom">';
    addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
    addon.innerHTML += 'z permal: <input type="radio" name="funnel_zoom_druh" id="funnel_ra_zpermal">';
    addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
    addon.innerHTML += 'fixní: <input type="radio" name="funnel_zoom_druh" id="funnel_ra_zfix">';
    addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
    addon.innerHTML += '<select style="height: 20px;" id="funnel_co_zfix"><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option></select>';

    addon.innerHTML += '<br>';

    // nastaveni select
    addon.innerHTML += 'Select: <input type="checkbox" id="funnel_cb_select">';
    addon.innerHTML += '&nbsp;';
    addon.innerHTML += '!: <input type="checkbox" id="funnel_cb_alertselect">';

    addon.innerHTML += '<br>';

    // povoleni layers a nastevni z permalinku nebo fixniho
    addon.innerHTML += 'Layers: <input type="checkbox" id="funnel_cb_layers">';
    addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
    addon.innerHTML += 'z permal: <input type="radio" name="funnel_layers_druh" id="funnel_ra_lpermal">';
    addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
    addon.innerHTML += 'fixní: <input type="radio" name="funnel_layers_druh" id="funnel_ra_lfix">';
    addon.innerHTML += '&nbsp;&nbsp;&nbsp;';
    addon.innerHTML += '<input style="height: 20px; width: 48px" type="text" id="funnel_text_lfix" value="' + funnel_lfix + '"><button style="height: 20px; width: 20px; text-align: center; vertical-align: middle; margin: 0; border: 0;" id="funnel_bt_lfix"><font style="height: 20px;">\u2713</font></button>';
    addon.innerHTML += '<br>';

    // nastaveni zamku
    addon.innerHTML += 'Zámek: <select style="height: 20px;" id="funnel_co_lock"><option value="0">L1</option><option value="1">L2</option><option value="2">L3</option><option value="3">L4</option><option value="4">L5</option><option value="5">L6</option></select>';
    addon.innerHTML += '&nbsp;';
    addon.innerHTML += '<font size="3">&#8628</font> <input type="checkbox" id="funnel_cb_ldolu">';
    addon.innerHTML += '<br>';

    // nastavení listy a copy
    addon.innerHTML += 'Lišta <font size="3">\u21A7</font> ';
    addon.innerHTML += '<select style="height: 20px;" id="funnel_co_lista_radky"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option</select>';
    addon.innerHTML += '&nbsp;';

    addon.innerHTML += 'Copy od: ';
    addon.innerHTML += '<select style="height: 20px;" id="funnel_co_copy_od"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option</select>';
    addon.innerHTML += '&nbsp;';

    addon.innerHTML += 'do: ';
    addon.innerHTML += '&nbsp;';
    addon.innerHTML += '<select style="height: 20px;" id="funnel_co_copy_do"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option</select>';

    // nastaveni G tabulky a G JSON
    addon.innerHTML += '<br>';
    addon.innerHTML += 'G tab ID: <input style="height: 20px;" type="text" id="funnel_text_gtab" value="' + funnel_gtab + '">';
    addon.innerHTML += '<br>';
    addon.innerHTML += 'G tab LIST: <input style="height: 20px;" type="text" id="funnel_text_gtlist" value="' + funnel_gtlist + '"><button style="height: 20px; width: 20px; text-align: center; vertical-align: middle; margin: 0; border: 0;" id="funnel_bt_gtab" title="Nejpreve zadej ID, LIST a KEY."><font style="height: 20px;">\u2713</font></button>';
    addon.innerHTML += '<br>';

    addon.innerHTML += '<font size="1"><i>Skript <a href="https://greasyfork.org/cs/scripts/20882-wme-funnel" target="_blank">WME Funnel</a> verze ' + GM_info.script.version + '</i></font>';

    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("sidepanel-funnel");
    tabLabel.innerHTML = '<img src="' + GM_info.script.icon + '" width="16" height="16" style="margin-top: -2px;">';
    tabLabel.title = 'Funnel';
    tabLabel.id = "funnel-ousko";
    tabPane.appendChild(addon);
    await W.userscripts.waitForElementConnected(tabPane);

    funnel_nastav_zoomsel();                                                                    // prvotni nastaveni zoom a select

    document.getElementById("funnel_cb_alertselect").checked = Boolean(funnel_alertselect);   // prvnotni nastveni checkbox alertselect

    document.getElementById("funnel_cb_layers").checked = Boolean(funnel_layers);             // prvnotni nastveni checkbox layers
    // prvnotni nastveni radio funnel_layers_druh
    if (funnel_lpermfix === 0){document.getElementById("funnel_ra_lpermal").checked = true;}
    else
    {document.getElementById("funnel_ra_lfix").checked = true;}
    //

    document.getElementById("funnel_co_lock").value = funnel_lock;                            // prvotni nastaveni combobox lock
    document.getElementById("funnel_cb_ldolu").checked = Boolean(funnel_ldolu);               // prvotni nastveni checkbox layers

    document.getElementById("funnel_co_lista_radky").value = funnel_lista_radky;                     // prvotni nastaveni combobox lista_radky
    funnel_oprava_copy_od();
    document.getElementById("funnel_co_copy_od").value = funnel_copy_od;                             // prvotni nastaveni combobox copy_od
    funnel_oprava_copy_do();
    document.getElementById("funnel_co_copy_do").value = funnel_copy_do;                             // prvotni nastaveni combobox copy_do

    // prvotni nastaveni talcitka Lx podle hodnoty lock a povoleneho snizeni
    funnel_popis_f2();

    // prvotni nastaveni listy
    if (funnel_lista_onoff == "on" && funnel_onoff == "on"){
        document.getElementById("funnel-last2-lista").innerHTML = (funnel_posledni + 1) + ' / ' + funnel_konec;

        for (var i = 1; i < funnel_lista_radky + 1; i++){
            document.getElementById("funnel-id" + i + "-lista").innerHTML = funnel_id[i][funnel_posledni];
        }
    }

    // obsluha kliknuti na odkaz
    $('.funnel-link').on('click', function(event) {
        if (!funnel_ctrlP){ // pokud pri kliknuti nedrzel control
            event.preventDefault();
            funnel_href = $(this).attr('href');

            funnel_posledni = Number($(this).attr('name')); // z odkazu zjisti cislo posledniho na ktery se kliklo
            localStorage.setItem("FN_posledni", funnel_posledni); // cislo posledniho ulozi do localStorage

            funnel_odkazy_ovladani();

            funnel_posun_vyber();
        }
    });

    // obsluha kliknuti na predesly
    $('.funnel-prev').on('click', function(event) {
        if (!funnel_ctrlP){ // pokud pri kliknuti nedrzel control
            event.preventDefault();
            funnel_href = $(this).attr('href');

            funnel_posledni = Number($(this).attr('name')); // z odkazu zjisti cislo posledniho na ktery se kliklo
            localStorage.setItem("FN_posledni", funnel_posledni); // cislo posledniho ulozi do localStorage

            funnel_odkazy_ovladani();

            if (funnel_posledni === 0){
                alert('WME Funnel - jsi na začátku seznamu.\nPo kliknutí na OK se zobrazí první odkaz.');
            }
            funnel_smer = -1;
            funnel_posun_vyber();
        }
    });

    // obsluha kliknuti na aktualni
    $('.funnel-akt').on('click', function(event) {
        if (!funnel_ctrlP){ // pokud pri kliknuti nedrzel control
            event.preventDefault();
            funnel_href = $(this).attr('href');

            funnel_posledni = Number($(this).attr('name')); // z odkazu zjisti cislo posledniho na ktery se kliklo
            localStorage.setItem("FN_posledni", funnel_posledni); // cislo posledniho ulozi do localStorage

            funnel_odkazy_ovladani();

            funnel_smer = 0;
            funnel_posun_vyber();
        }
    });

    // obsluha kliknuti na nasledujici
    $('.funnel-next').on('click', function(event) {
        if (!funnel_ctrlP){ // pokud pri kliknuti nedrzel control
            event.preventDefault();
            funnel_href = $(this).attr('href');

            funnel_posledni = Number($(this).attr('name')); // z odkazu zjisti cislo posledniho na ktery se kliklo
            localStorage.setItem("FN_posledni", funnel_posledni); // cislo posledniho ulozi do localStorage

            funnel_odkazy_ovladani();

            if (funnel_posledni === (funnel_konec - 1)){
                alert('WME Funnel - jsi na konci seznamu.\nPo kliknutí na OK se zobrazí poslední odkaz.');
            }
            funnel_smer = 1;
            funnel_posun_vyber();
        }
    });

    // obsluha kliknuti na uzivatelskou funkci 1 - oprava telefonu a url

    $('#funnel_user_f1').on('click', function(event) {
        funnel_log_fname('#funnel_user_f1');
        event.preventDefault();
        var funnel_phone;
        var funnel_phonetrim;
        var funnel_url;
        var funnel_urltrim;
        var funnel_phoneregexp = [];
        var funnel_phonecut = [];
        var funnel_urlregexp = [];
        var funnel_urlcut = '';
        if (getSelectedFeatures().length === 1 && getSelectedFeatures()[0].model.type === "venue"){
            funnel_item = getSelectedFeatures()[0].model;

            // oprava formatu telefonu

            funnel_phone = funnel_item.attributes.phone;
            console.log ('WNE Funnel phone: ' + funnel_phone);

            if (funnel_phone !== null){

                funnel_phonetrim = funnel_phone.replace(/\s/g,''); // replace odstrani vsechny mezery z telefonu

                if (/^(\+420|00420|420)?\d{9}$/.test(funnel_phonetrim)){

                    funnel_phoneregexp[0] = /^(\d{3})(\d{3})(\d{3})$/;        // regexp pro format 123456789      (err1)
                    funnel_phoneregexp[1] = /^\+420(\d{3})(\d{3})(\d{3})$/;   // regexp pro format +420123456789  (err3)
                    funnel_phoneregexp[2] = /^00420(\d{3})(\d{3})(\d{3})$/;   // regexp pro format 00420123456789 (err5)
                    funnel_phoneregexp[3] = /^420(\d{3})(\d{3})(\d{3})$/;   // regexp pro format 420123456789 (err7)

                    funnel_phonecut = funnel_phonetrim;

                    for (i = 0; i < funnel_phoneregexp.length; i++) {
                        if (funnel_phoneregexp[i].test(funnel_phonetrim)){
                            funnel_phonecut = funnel_phonetrim.match(funnel_phoneregexp[i]);
                            funnel_phonecut[0] = '+420';
                            break;
                        }
                    }
                    if (funnel_phone !== funnel_phonecut.join(' ')){
                        console.log ('WME Funnel phonenew: ' + funnel_phonecut.join(' '));
                        W.model.actionManager.add(new funnel_upobject(funnel_item, {phone: funnel_phonecut.join(' ')}));
                    }
                }
            }

            // oprava formatu url

            funnel_url = funnel_item.attributes.url;
            console.log ('WME Funnel url: ' + funnel_url);

            if (funnel_url !== null){

                funnel_urltrim = funnel_url.trim(); // trim odstrani nepotrebne mezery na zacatku a konci url

                funnel_urlregexp[0] = /^https?:\/\/((?:[^\s\/\?\.#]+\.)*[^\s\/\?\.#]+)\/?$/;   // regexp pro format 1
                funnel_urlregexp[1] = /^https?:\/\/((?:[^\s\/\?\.#]+\.)*[^\s\/\?\.#]+\/.+)$/;  // regexp pro format 2
                funnel_urlregexp[2] = /^((?:[^\s\/\?\.#]+\.)*[^\s\/\?\.#]+)\/+$/;              // regexp pro format 3
                funnel_urlregexp[3] = /^\/+((?:[^\s\/\?\.#]+\.)*[^\s\/\?\.#]+)$/;              // regexp pro format 4
                funnel_urlregexp[4] = /^\/+((?:[^\s\/\?\.#]+\.)*[^\s\/\?\.#]+)\/+$/;           // regexp pro format 5

                funnel_urlcut = funnel_urltrim;

                for (i = 0; i < funnel_urlregexp.length; i++) {
                    if (funnel_urlregexp[i].test(funnel_urltrim)){
                        funnel_urlcut = funnel_urltrim.match(funnel_urlregexp[i])[1];
                        break;
                    }
                }
                if (funnel_url !== funnel_urlcut){
                    console.log ('WME Funnel urlnew: ' + funnel_urlcut);
                    W.model.actionManager.add(new funnel_upobject(funnel_item, {url: funnel_urlcut}));
                }
            }
        }
    });

    // obsluha kliknuti na uzivatelskou funkci 2 - nastaveni zamku

    $('#funnel_user_f2').on('click', function(event) {
        funnel_log_fname('#funnel_user_f2');
        event.preventDefault();

        if (getSelectedFeatures().length === 1){
            funnel_item = getSelectedFeatures()[0].model;
            var funnel_lockrank = funnel_item.attributes.lockRank;
            console.log('WME Funnel lockRank: ' + funnel_lockrank);

            if (funnel_lockrank < funnel_lock || (funnel_lockrank > funnel_lock && Boolean(funnel_ldolu))){
                console.log('WME Funnel lockRank new: ' + funnel_lock);
                W.model.actionManager.add(new funnel_upobject(funnel_item, {lockRank: funnel_lock}));
            }
        }
    });

    // obsluha kopirovani do schranky

    $('#funnel_user_copy_c').on('click', function(event) {
        funnel_log_fname('#funnel_user_copy_c');
        event.preventDefault();

        funnel_copy_lista_class("popis");

        checkCtrlPress();
        if (funnel_ctrlP) {
            funnel_copy_id--;
            funnel_copy_smer = -1;}
        else
        {funnel_copy_id++;
         funnel_copy_smer = 1;
        }

        if (funnel_copy_id > funnel_copy_do && funnel_copy_smer == 1) {funnel_copy_id = funnel_copy_od;}
        if (funnel_copy_id > funnel_copy_do && funnel_copy_smer == -1) {funnel_copy_id = funnel_copy_do;}
        if (funnel_copy_id < funnel_copy_od && funnel_copy_smer == 1) {funnel_copy_id = funnel_copy_od;}
        if (funnel_copy_id < funnel_copy_od && funnel_copy_smer == -1) {funnel_copy_id = funnel_copy_do;}

        funnel_copy_obsah = '';
        funnel_copy_obsah = funnel_id[funnel_copy_id][funnel_posledni];
        funnel_copy_lista_class("popis_zb");

        navigator.clipboard.writeText(funnel_copy_obsah).then(function() {
            console.log('WME Funnel - zkopirovano: ' + funnel_copy_obsah);
        }, function(err) {
            console.error('Funnel - nemohu kopirovat, chyba: ', err);
        });
    });

    // obsluha kliknuti na uzivatelskou funkci 3 - prejezdovy radar

    $('#funnel_user_f3').on('click', function(event) {
        funnel_log_fname('#funnel_user_f3');
        event.preventDefault();
        // odznaceni toho co bylo predtim oznaceno, jinak neni funcni nastaveni L4
        W.selectionManager.unselectAll();
        // vytvoreni prejezdoveho radaru
        document.querySelector('.toolbar-group-item.ItemInactive.railroad-crossing.WazeControlDrawFeature').click();
        // nazstaveni zamku L4 pro prejezdovy radar- kod MajkiiTelini
        var waitForIt = function(selector, callback) {
            if (selector.length) {
                callback();
            } else {
                setTimeout(function() {
                    waitForIt(selector, callback);
                }, 50);
            }
        };
        waitForIt(document.getElementsByClassName("railroad-crossing separator-line sidebar-column"), function() {
            if (document.getElementsByName("lockRank")[5] !== undefined) {
                document.getElementsByName("lockRank")[5].click();
            };
        });
    });

    // obsluha kliknuti na zapnuti nebo vypnuti skriptu

    $('#funnel-switch-on-off').on('click', function(event) {
        event.preventDefault();
        if (funnel_onoff == "on"){
            localStorage.setItem("FN_onoff", 'off');
            funnel_onoff = 'off';
            document.getElementById("funnel-switch-on-off").innerHTML = 'off'; // zmeni stav na OFF
        } else {
            localStorage.setItem("FN_onoff", 'on');
            funnel_onoff = 'on';
            document.getElementById("funnel-switch-on-off").innerHTML = 'on'; // zmeni stav na ON
        }
    });

    // obsluha kliknuti na zapnuti nebo vypnuti listy

    $('#funnel-lista-on-off').on('click', function(event) {
        event.preventDefault();
        if (funnel_lista_onoff == "on" && funnel_onoff == "on"){
            localStorage.setItem("FN_lista_onoff", 'off');
            funnel_lista_onoff = 'off';
            document.getElementById("funnel-lista-on-off").innerHTML = 'off'; // zmeni stav na OFF
        } else {
            localStorage.setItem("FN_lista_onoff", 'on');
            funnel_lista_onoff = 'on';
            document.getElementById("funnel-lista-on-off").innerHTML = 'on'; // zmeni stav na ON
        }
    });

    // obsluha kliknuti na zoom

    $('#funnel_cb_zoom').on('change', function(event) {
        funnel_log_fname('#funnel_cb_zoom');
        event.preventDefault();
        if (funnel_zoom === 1){
            funnel_zoom = 0;
        } else {
            funnel_zoom = 1;
        }
        localStorage.setItem("FN_zoom", funnel_zoom);
    });

    $('#funnel_ra_zpermal').on('change', function(event) {
        funnel_log_fname('#funnel_ra_zpermal');
        event.preventDefault();
        funnel_zpermfix = 0;
        localStorage.setItem("FN_zpermfix", 0);
    });

    $('#funnel_ra_zfix').on('change', function(event) {
        funnel_log_fname('#funnel_ra_zfix');
        event.preventDefault();
        funnel_zpermfix = 1;
        localStorage.setItem("FN_zpermfix", 1);
    });

    $('#funnel_co_zfix').on('change', function(event) {
        funnel_log_fname('#funnel_co_zfix');
        event.preventDefault();
        funnel_zfix = Number(document.getElementById("funnel_co_zfix").value);
        localStorage.setItem("FN_zfix", funnel_zfix);
    });

    // obsluha klinuti na select

    $('#funnel_cb_select').on('change', function(event) {
        funnel_log_fname('#funnel_cb_select');
        event.preventDefault();
        if (funnel_select === 1){
            funnel_select = 0;
        } else {
            funnel_select = 1;
        }
        localStorage.setItem("FN_select", funnel_select);
    });

    $('#funnel_cb_alertselect').on('change', function(event) {
        funnel_log_fname('#funnel_cb_alertselect');
        event.preventDefault();
        if (funnel_alertselect === 1){
            funnel_alertselect = 0;

        } else {
            funnel_alertselect = 1;
        }
        localStorage.setItem("FN_alertselect", funnel_alertselect);
    });

    // obsluha kliknuti na layers

    $('#funnel_cb_layers').on('change', function(event) {
        funnel_log_fname('#funnel_cb_layers');
        event.preventDefault();
        if (funnel_layers === 1){
            funnel_layers = 0;
        } else {
            funnel_layers = 1;
        }
        localStorage.setItem("FN_layers", funnel_layers);
    });

    $('#funnel_ra_lpermal').on('change', function(event) {
        funnel_log_fname('#funnel_ra_lpermal');
        event.preventDefault();
        funnel_lpermfix = 0;
        localStorage.setItem("FN_lpermfix", 0);
    });

    $('#funnel_ra_lfix').on('change', function(event) {
        funnel_log_fname('#funnel_ra_lfix');
        event.preventDefault();
        funnel_lpermfix = 1;
        localStorage.setItem("FN_lpermfix", 1);
    });

    $('#funnel_bt_lfix').on('click', function(event) {
        funnel_log_fname('#funnel_bt_lfix');
        event.preventDefault();
        funnel_lfix = Number(document.getElementById("funnel_text_lfix").value);
        if (funnel_lfix >= 0 && funnel_lfix <= 4095 && funnel_lfix !== '' && Number.isInteger(funnel_lfix)){
            localStorage.setItem("FN_lfix", funnel_lfix);}
        else
        {
            alert ('WME Funnel - zadaná hodnota je mimo rozsah 0 až 4095');
        }
    });

    // nastaveni zamku

    $('#funnel_co_lock').on('change', function(event) {
        funnel_log_fname('#funnel_co_lock');
        event.preventDefault();
        funnel_lock = Number(document.getElementById("funnel_co_lock").value);
        localStorage.setItem("FN_lock", funnel_lock);
        funnel_popis_f2();
    });

    $('#funnel_cb_ldolu').on('change', function(event) {
        funnel_log_fname('#funnel_cb_ldolu');
        event.preventDefault();
        if (funnel_ldolu === 1){
            funnel_ldolu = 0;
        } else {
            funnel_ldolu = 1;
        }
        localStorage.setItem("FN_ldolu", funnel_ldolu);
        funnel_popis_f2();
    });

    // nastaveni listy a copy od do

    $('#funnel_co_lista_radky').on('change', function(event) {
        funnel_log_fname('#funnel_co_lista_radky');
        event.preventDefault();
        alert('WME Funnel - změna výšky lišty se projeví až po restartu WME.');
        localStorage.setItem("FN_lista_radky", Number(document.getElementById("funnel_co_lista_radky").value));
    });

    $('#funnel_co_copy_od').on('change', function(event) {
        funnel_log_fname('#funnel_co_copy_od');
        event.preventDefault();
        funnel_copy_od = Number(document.getElementById("funnel_co_copy_od").value);
        funnel_oprava_copy_od();
        localStorage.setItem("FN_copy_od", funnel_copy_od);
    });

    $('#funnel_co_copy_do').on('change', function(event) {
        funnel_log_fname('#funnel_co_copy_do');
        event.preventDefault();
        funnel_copy_do = Number(document.getElementById("funnel_co_copy_do").value);
        funnel_oprava_copy_do();
        localStorage.setItem("FN_copy_do", funnel_copy_do);
    });

    // nastaveni G tabulky

    $('#funnel_bt_gtab').on('click', function(event) {
        funnel_log_fname('#funnel_bt_gtab');
        event.preventDefault();
        funnel_gtab = document.getElementById("funnel_text_gtab").value;
        localStorage.setItem("FN_gtab", funnel_gtab);
        funnel_gtlist = document.getElementById("funnel_text_gtlist").value;
        localStorage.setItem("FN_gtlist", funnel_gtlist);
        funnel_sestav_urls();
        if (funnel_gtab != 'zadej ID Google tabulky' && funnel_gtab !== ''
            && funnel_gtlist != 'zadej list Google tabulky' && funnel_gtlist !== ''
           )
        {
            alert('WME Funnel - změna ID tabulky se projeví až po restartu WME.\nSkript nyní ověří existenci tabulky se zadaným ID.\n!! Neověřuje se název listu !!');
            localStorage.setItem("FN_onoff", 'on');
            funnel_onoff = "on";
            document.getElementById("funnel-switch-on-off").innerHTML = 'on'; // zmeni stav na ON
            funnel_over_gturl();
            funnel_posledni = 0;
            document.getElementById("funnel-gturl").href = funnel_gturl; // zmeni odkaz pro G tabulku
            document.getElementById("funnel-gtjson").href = funnel_gtjson; // zmeni odkaz pro JSON export
        }
    });
}

function funnel_sestav_urls() {
    funnel_log_fname('funnel_sestav_urls()');
    funnel_gturl = funnel_gt_a + funnel_gtab + funnel_gt_bu;
    console.log('Funnel funnel_gturl:' + funnel_gturl);
    funnel_gtjson = funnel_gt_a + funnel_gtab + funnel_gt_bj + funnel_gt_cj + funnel_gtlist;
    console.log('Funnel funnel_gtjson:' + funnel_gtjson);
}

function funnel_natahni_data() {
    if (funnel_onoff == "on"){
        console.log('WME Funnel: Start load data');
        if (funnel_lista_onoff == "on" && funnel_onoff == "on"){
            document.getElementById("funnel-last2-lista").className = "popis_sb";
            document.getElementById("funnel-last2-lista").innerHTML = "Natahuji data z G tabulky";
        }

        GM_xmlhttpRequest({
            url: funnel_gtjson,
            type: 'GET',
            onload: function(data) {
                const r = data.responseText.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
                if (r && r.length == 2) {
                    const obj = JSON.parse(r[1]);
                    const table = obj.table;
                    const header = table.cols.map(({label}) => label);
                    const rows = table.rows.map(({c}) => c.map(function(v) {return v;}));

                    for (var i = 0; rows[i][1] !== null; i++) {
                        funnel_link[i] = rows[i][1].v;

                        // uprava starsich permalinku kvuli znene zoom v nove verzi WME 2021-08
                        if (funnel_link[i].includes('&zoom=')){
                            funnel_link[i] =
                                (funnel_link[i].match(/^(.+zoom=)(\d?\d)(.+)?$/)[1]).replace('zoom=','zoomLevel=')
                                + (Number(funnel_link[i].match(/^(.+zoom=)(\d?\d)(.+)?$/)[2]) + 12)
                                + (typeof funnel_link[i].match(/^(.+zoom=)(\d?\d)(.+)?$/)[3] == 'undefined' ? '' : funnel_link[i].match(/^(.+zoom=)(\d?\d)(.+)?$/)[3]);
                        }

                        rows[i][2] == null ? funnel_id[1][i] = '' : funnel_id[1][i] = rows[i][2].v;
                        rows[i][3] == null ? funnel_id[2][i] = '' : funnel_id[2][i] = rows[i][3].v;
                        rows[i][4] == null ? funnel_id[3][i] = '' : funnel_id[3][i] = rows[i][4].v;
                        rows[i][5] == null ? funnel_id[4][i] = '' : funnel_id[4][i] = rows[i][5].v;
                        rows[i][6] == null ? funnel_id[5][i] = '' : funnel_id[5][i] = rows[i][6].v;
                        rows[i][7] == null ? funnel_id[6][i] = '' : funnel_id[6][i] = rows[i][7].v;
                        rows[i][8] == null ? funnel_id[7][i] = '' : funnel_id[7][i] = rows[i][8].v;
                        rows[i][9] == null ? funnel_id[8][i] = '' : funnel_id[8][i] = rows[i][9].v;
                        rows[i][10] == null ? funnel_id[9][i] = '' : funnel_id[9][i] = rows[i][10].v;
                        rows[i][11] == null ? funnel_id[10][i] = '' : funnel_id[10][i] = rows[i][11].v;
                        funnel_konec++;
                    }

                    console.log('WME Funnel: End load data');
                    funnel_dataLoad = true;
                    if (funnel_lista_onoff == "on" && funnel_onoff == "on"){
                        document.getElementById("funnel-last2-lista").innerHTML = "";
                        document.getElementById("funnel-last2-lista").className = "popis";
                    }

                    // pokud ma tabulka jiny pocet radku nez pri predeslem natazeni, nastavi posledni na 0
                    if (funnel_konec != funnel_drivekonec && funnel_konec !== 0) {
                        funnel_posledni = 0;
                    }
                    localStorage.setItem("FN_drivekonec", funnel_konec); // cislo konecneho ulozi do localStorage
                }
            },
            onerror: function(e) {console.log('WME Funnel: Failed to load data, error code ' + e.status)}
        })
    }
}


function funnel_popis_f2() {
    // Zmeni popis na tlacitku funkce 2 podle nastavenych hodnot
    if (Boolean(funnel_ldolu)){document.getElementById("funnel_user_f2").innerHTML = 'L' + (funnel_lock + 1) + '&#8628;';}
    else
    {document.getElementById("funnel_user_f2").innerHTML = 'L' + (funnel_lock + 1);}
    if (funnel_lista_onoff == "on" && funnel_onoff == "on"){document.getElementById("funnel_user_f2_lista").innerHTML = 'L' + (funnel_lock + 1);}
}

function funnel_odkazy_ovladani() {
    funnel_log_fname('funnel_odkazy_ovladani()');
    // zmeni popis na ousku zalozky v levem panelu
    document.getElementById("funnel-ousko").innerHTML = '<img src="' + GM_info.script.icon + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + (funnel_posledni +1);

    // zmena cisla a odkazu u posledniho
    document.getElementById("funnel-last1").href = funnel_link[(funnel_pred_za(-1))]; // zmeni odkaz <
    document.getElementById("funnel-last1").name = (funnel_pred_za(-1)); // zmeni name <

    document.getElementById("funnel-last2").innerHTML = (funnel_posledni + 1); // zmeni popis posledni
    document.getElementById("funnel-last2").href = funnel_link[(funnel_posledni)]; // zmeni odkaz posledni
    document.getElementById("funnel-last2").name = funnel_posledni; // zmeni name posledni

    document.getElementById("funnel-last3").href = funnel_link[(funnel_pred_za(1))]; // zmeni odkaz >
    document.getElementById("funnel-last3").name = (funnel_pred_za(1)); // zmeni name >

    // zmena popisu posledniho
    for (var i = 1; i < funnel_lista_radky + 1; i++) {
        document.getElementById("funnel-id" + i).innerHTML = funnel_id[i][funnel_posledni];
    }
    // zmena popisu listy
    if (funnel_lista_onoff == "on" && funnel_onoff == "on"){
        document.getElementById("funnel-last2-lista").innerHTML = (funnel_posledni + 1) + ' / ' + funnel_konec;
        document.getElementById("funnel-last2-lista").className = "popis";
        for (var i = 1; i < funnel_lista_radky + 1; i++){
            document.getElementById("funnel-id" + i + "-lista").innerHTML = funnel_id[i][funnel_posledni];
        }
    }
}

function funnel_posun_vyber() {
    funnel_log_fname('funnel_posun_vyber()');

    // zruseni zvyrazneni na liste pri kopirovani
    funnel_copy_lista_class("popis");
    funnel_copy_id = 0;

    // posun mapy
    xy = OpenLayers.Layer.SphericalMercator.forwardMercator(parseFloat(getUrlParameter('lon', funnel_href)), parseFloat(getUrlParameter('lat', funnel_href)));
    W.map.setCenter(xy);

    // pokud je povoleny, provede se zoom
    if (funnel_zoom === 1){
        // zoom z permalinku
        if (funnel_zpermfix === 0){
            W.map.getOLMap().zoomTo(getUrlParameter('zoomLevel', funnel_href));
        }
        else
        {
            W.map.getOLMap().zoomTo(funnel_zfix);
        }
    }

    // pokud je povoleny, provede se nastaveni vrstev
    if (funnel_layers === 1){
        funnel_vyber_vrstev();
    }

    // pokud je povoleny, provede se vyber
    if (funnel_select === 1){
        funnel_druh_objektu();
        funnel_pocita = 0;
        funnel_vyber_objektu();
    }
}

function funnel_pred_za(funnel_okolik) {
    if ((funnel_posledni + funnel_okolik) < 0){return 0;}
    if ((funnel_posledni + funnel_okolik) > (funnel_konec - 1)){return (funnel_konec - 1);}
    return (funnel_posledni + funnel_okolik);
}

function funnel_log_fname(funnel_fname) {
    if (funnel_logf){
        console.log('WME Funnel: function ' + funnel_fname);
    }
}

function funnel_druh_objektu() {
    funnel_log_fname('funnel_druh_objektu()');
    funnel_permtype = "zadny";
    if (funnel_href.indexOf('nodes') > -1){
        funnel_permtype = 'nodes';
    }

    if (funnel_href.indexOf('venues') > -1){
        funnel_permtype = 'venues';
    }

    if (funnel_href.indexOf('segments') > -1){
        funnel_permtype = 'segments';
    }
    if (funnel_href.indexOf('cameras') > -1){
        funnel_permtype = 'cameras';
    }
    if (funnel_href.indexOf('mapComments') > -1){
        funnel_permtype = 'mapComments';
    }
    if (funnel_href.indexOf('bigJunctions') > -1){
        funnel_permtype = 'bigJunctions';
    }
    if (funnel_href.indexOf('railroadCrossings') > -1){
        funnel_permtype = 'railroadCrossings';
    }
}

function funnel_vyber_objektu() {
    funnel_log_fname('funnel_vyber_objektu()');
    if (funnel_permtype == 'zadny'){return;} // pokud neni co vybrat, vrati se
    var funnel_sezobj = [];
    var funnel_vyber = getUrlParameter(funnel_permtype, funnel_href);
    var funnel_idobj = funnel_vyber.split(',');
    var funnel_wobjekts;

    if (funnel_lista_onoff == "on" && funnel_onoff == "on"){document.getElementById("funnel-last2-lista").className = "popis_sb";}

    for (var i = 0; funnel_idobj[i]; i++) {

        switch(funnel_permtype) {
            case 'nodes':
                funnel_wobjekts = W.selectionManager.model.nodes.objects[parseInt(funnel_idobj[i])];
                break;
            case 'venues':
                funnel_wobjekts = W.selectionManager.model.venues.objects[funnel_idobj[i]];
                break;
            case 'segments':
                funnel_wobjekts = W.selectionManager.model.segments.objects[parseInt(funnel_idobj[i])];
                break;
            case 'cameras':
                funnel_wobjekts = W.selectionManager.model.cameras.objects[parseInt(funnel_idobj[i])];
                break;
            case 'mapComments':
                funnel_wobjekts = W.selectionManager.model.mapComments.objects[funnel_idobj[i]];
                break;
            case 'bigJunctions':
                funnel_wobjekts = W.selectionManager.model.bigJunctions.objects[parseInt(funnel_idobj[i])];
                break;
            case 'railroadCrossings':
                funnel_wobjekts = W.selectionManager.model.railroadCrossings.objects[parseInt(funnel_idobj[i])];
                break;
        }

        if (typeof funnel_wobjekts === 'undefined'){
            funnel_pocita++;
            if (funnel_pocita >= 10){
                // pokud je povoleny, provede se alert pokud nelze objekt vybrat
                if (funnel_alertselect === 1){
                    alert('WME Funnel - nelze vybrat ' + funnel_permtype + ' ID: ' + funnel_idobj[i]);
                }
                // zmeni popis na ousku zalozky v levem panelu - ikona cervena
                document.getElementById("funnel-ousko").innerHTML = '<img src="data:image/png;base64,' + funnel_TabIconRed + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + (funnel_posledni +1);
                if (funnel_lista_onoff == "on" && funnel_onoff == "on"){document.getElementById("funnel-last2-lista").className = "popis_rb";}
                return;
            }
            setTimeout(funnel_vyber_objektu, 500);
            return;
        }
        else {
            funnel_sezobj.push(funnel_wobjekts);
            // zmeni popis na ousku zalozky v levem panelu - ikona cerna
            document.getElementById("funnel-ousko").innerHTML = '<img src="' + GM_info.script.icon + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + (funnel_posledni +1);
            if (funnel_lista_onoff == "on" && funnel_onoff == "on"){document.getElementById("funnel-last2-lista").className = "popis";}
        }
    }
    W.selectionManager.setSelectedModels(funnel_sezobj);
}

function funnel_vyber_vrstev() {
    funnel_log_fname('funnel_vyber_vrstev()');

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
    // 22 - W.Control.SelectHighlightFeature_224_container
    // 23 - drawLandmark
    // 24 - Search
    // 25 - Přihlášení uživatelé

    var funnel_vridx = [0, 1, 2, 3, 5, 6, 11, 13, 14, 15]; // ID vrstev pro jednotlive bity z cisla vrstev
    var funnel_vrstvydek;

    switch(true) {
        case (funnel_lpermfix === 0 && funnel_href.indexOf('layers') > -1):
            // layers z permalinku pokud ji ma permalink zadanou
            funnel_vrstvydek = getUrlParameter('layers', funnel_href);
            break;
        case (funnel_lpermfix == 1):
            // layers fixni
            funnel_vrstvydek = funnel_lfix;
            break;
        default:
            return;
    }

    var funnel_vrstvybin = (parseInt(funnel_vrstvydek)).toString(2); // dekadicke cislo vrstvy nacte a prevede na binarni do stringu
    var funnel_vrstvyarr = funnel_vrstvybin.split(""); // binarni cislo vrstev naplni do pole
    funnel_vrstvyarr.reverse(); // pole otoci tak aby nejmene vyznamny bit byl jako prvni

    for (var i = 0; i < 10; i++) {
        if (funnel_vrstvyarr[i] == 1){
            W.map.controls[0].map.layers[funnel_vridx[i]].setVisibility(true);
        }
        else {
            W.map.controls[0].map.layers[funnel_vridx[i]].setVisibility(false);
        }
    }
}

function funnel_nastav_zoomsel(){
    funnel_log_fname('funnel_nastav_zoomsel()');
    document.getElementById("funnel_cb_zoom").checked = Boolean(funnel_zoom);                  // nastveni checkbox zoom
    // nastveni radio funnel_zoom_druh
    if (funnel_zpermfix === 0){document.getElementById("funnel_ra_zpermal").checked = true;}
    else
    {document.getElementById("funnel_ra_zfix").checked = true;}
    document.getElementById("funnel_co_zfix").value = funnel_zfix;                            // nastaveni comboboxu fixni zoom
    document.getElementById("funnel_cb_select").checked = Boolean(funnel_select);             // nastveni checkbox select
}

function funnel_copy_lista_class(funnel_l_class){
    if (funnel_lista_onoff == "on"){
        if (funnel_copy_id > 0) {
            document.getElementById("funnel-id" + funnel_copy_id + "-lista").className = funnel_l_class;
        }
    }
}

function getSelectedFeatures(){
    if(!W.selectionManager.getSelectedFeatures)
        return W.selectionManager.selectedItems;
    return W.selectionManager.getSelectedFeatures();
}

function funnel_oprava_copy_od(){
    if (funnel_copy_od > funnel_lista_radky){
        funnel_copy_od = funnel_lista_radky;
        document.getElementById("funnel_co_copy_od").value = funnel_copy_od;
    }

    if (funnel_copy_od > funnel_copy_do){
        funnel_copy_od = funnel_copy_do;
        document.getElementById("funnel_co_copy_od").value = funnel_copy_od;
    }
}

function funnel_oprava_copy_do(){
    if (funnel_copy_do > funnel_lista_radky){
        funnel_copy_do = funnel_lista_radky;
        document.getElementById("funnel_co_copy_do").value = funnel_copy_do;
    }

    if (funnel_copy_do < funnel_copy_od){
        funnel_copy_do = funnel_copy_od;
        document.getElementById("funnel_co_copy_do").value = funnel_copy_do;
    }
}

function funnel_wait() {
    funnel_log_fname('funnel_wait()');

    funnel_start();

    if (funnel_onoff == "on"){
        funnel_over_gturl();
        funnel_after_load_data();
    }
    else {
        console.log('WME Funnel: Load data off');
        funnel_init();
    }
}

function funnel_after_load_data() {
    funnel_log_fname('funnel_after_load_data()');
    if (funnel_dataLoad){
        console.log('WME Funnel: Start showing data');
        funnel_init();
    }
    else {
        setTimeout(funnel_after_load_data, 500);
    }
}

//volání fce a samotný script
document.addEventListener("wme-map-data-loaded", funnel_wait, {once: true});

/*--------------------------------------------------------------------------------------
poznámky pod čarou :D

*/
