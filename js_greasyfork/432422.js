// ==UserScript==
// @name         Clerk Utilities OFFICIAL
// @namespace    https://greasyfork.org/users/206502
// @version      3.405
// @description  Narzedzia przydatne w pracy jako OB Clerk
// @author       @nowaratn
// @icon         https://drive-render.corp.amazon.com/view/nowaratn@/CLERK/clerk.png
// @match        https://trans-logistics-eu.amazon.com/*
// @match        https://hooks.chime.aws/*
// @match        https://app.chime.aws*
// @match        https://atrops-web-eu.amazon.com/new_caps*
// @match        http*://sortcenter-menu-eu.amazon.com/containerization/trickle*
// @match        https://www.amazonlogistics.eu/ssp/dock/hrz*
// @match        https://eu-west-1.prod.sort-assist-mobile.ats.amazon.dev*
// @include      *://*.amazon.dev/*
// @run-at       document-start
// @exclude      https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ib*
// @exclude      https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432422/Clerk%20Utilities%20OFFICIAL.user.js
// @updateURL https://update.greasyfork.org/scripts/432422/Clerk%20Utilities%20OFFICIAL.meta.js
// ==/UserScript==

// Clerk Icon thanks to: https://www.flaticon.com/free-icon/clerk_2916076

let Przewijanie_zmienna_test;
let kolory;
let guziki_przewijania;
let Beta_kopiowanie;
let Auto_Odswiez;
let Guzik_odswiez_YMS;
let poprawki_kosmetyczne;
let ciemny_motyw;
let Zapobieganie_wyjsciu;
let Czyje_auto;
let Liczenie_gaylordow;
let Drukowanie;
let Policz_ile_beta;
let barka_cfg;
var token;
var Jastrz;
var Fans;
var Psstani;
var addedStyles = {};
var snoop_cfg;

// Menu opcji
let gmc = GM_config(
    {
        'id': 'ClerkConfig', // The id used for this instance of GM_config
        'title': 'Clerk Utilities config',
        'fields':
        {
            'Hiddenz':
            {
                'section': 'Aby dowiedziec sie wiecej, najedz kursorem myszy na dana funkcje',
                'type': 'hidden',
            },
            'Kolorowanie':
            {
                'section': 'Yard Management System (YMS)',
                'type': 'checkbox', // Makes this setting a checkbox input
                'label': 'Kolorowanie pól YMS', // Appears next to field
                'title': 'Kolorowanie pól Yardu zgodnie z ich przeznaczeniem (zielone = ok, zolte = tylko dla naczep, czarne = absolutnie NIE dla puszek (kierowca nie wyjedzie z pola)',
                'default': true // Default value if user doesn't change it
            },
            'Guziki_przewijania':
            {
                'type': 'checkbox', // Makes this setting a checkbox input
                'label': 'Guziki przewijania w YMS', // Appears next to field
                'title': 'Czy dodac do strony YMS dodatkowe guziki, dzieki którym szybko przemiescisz sie do danego pola?',
                'default': true // Default value if user doesn't change it
            },
            'Pole':
            {
                'label': 'Pole/Brama',
                'type': 'text',
                'title': 'Dodatkowy guzik dla przewijania w YMS',
                'default': 'HS - 350'
            },
            'Beta_kopiowanie':
            {
                'type': 'checkbox',
                'label': 'Guzik kopiowania numeru rejestracji/puszki',
                'title': 'Czy dodac dodatkowy guzik dla kazdego Assetu na Yardzie do szybkiego kopiowania numeru rejestracyjnego?',
                'default': true
            },
            'Auto_Odswiez_YMS':
            {
                'type': 'checkbox',
                'label': 'Autoodswiezanie strony z YMS',
                'title': 'Zaznaczenie tego okienka spowoduje, iz przy kazdej utracie widocznosci strony YMS rozpocznie sie odliczanie ' +
                '- jezeli wrócimy do niej po czasie dluzszym niz 5 minut, dopiero wtedy automatycznie sie ona odswiezy (oszczedza nieco procesor wylaczajac w ten sposób odswiezanie w tle). // Moze zle dzialac z automatycznym drukowaniem CMR //',
                'default': false
            },
            'Guzik_odswiez_YMS':
            {
                'type': 'checkbox',
                'label': 'Dodac guzik odswiezania YMS (podobny jak dla SSP)',
                'default': true
            },
            'Drukowanie':
            {
                'section': 'Outbound Dock Management (SSP)',
                'type': 'hidden',
                'type': 'checkbox', // Makes this setting a checkbox input
                'label': 'Automatyczne wpisywanie numeru rejestracji ciagnika do dokumentu CMR w SSP',
                'title': 'Czy wlaczyc funkcje, która automatycznie bedzie pobierac nr rejestracyjny pojazdu i odpowiednio uzupelniac CMR? (drukowanie CMR od razu przechodzi do okienka z drukowaniem, samo wybiera national/international, wybiera "postal items" oraz wpisuje nr rej pobrany z YMS)',
                'default': false // Default value if user doesn't change it
            },
            'Liczenie_gaylordow':
            {
                'type': 'checkbox',
                'label': 'Dodac guzik sluzacy do zliczenia ilosci gaylordow zaladowanych na aucie',
                'title': 'Obecnie ze wzgledu na bagi, SSP pokazuje kazdy pojedynczy kontener na aucie. Nacisniecie guzika pokazuje ilosc faktycznych palet obok tej zawyzonej wartosci; dla pierwszych 10 aut w SSP',
                'default': false
            },
            'Zapobieganie_wyjsciu':
            {
                'type': 'checkbox',
                'label': 'Zapobiegac przypadkowemu zamknieciu/przejsciu strony SSP?',
                'title': 'Nacisniecie na jakikolwiek link/zakladke spowoduje wczesniejsze pokazanie komunikatu z potwierdzeniem, ze na pewno chcesz opuscic strone SSP',
                'default': true
            },
            'Czyje_auto':
            {
                'type': 'checkbox',
                'label': 'Dodac funkcje oznaczania w SSP, ktory Clerk zajmuje sie ktorym autem? (Czyje auto.exe)',
                'default': true
            },
            'Poprawki_kosmetyczne':
            {
                'type': 'checkbox',
                'label': 'Czy poprawic wyglad SSP?',
                'title': '   Na ten moment poprawki obejmuja: zmiany szerokosci kolumn w podgladzie Stacked/Staged/Loaded - poniewaz Stacking Filter niektórych kierunków jest tak dlugi, ze wychodzil do drugiej linii, przez co podglad stawal sie malo czytelny.',
                'default': true
            },
            'barka_cfg':
            {
                'type': 'checkbox',
                'label': 'Barka.',
                'title': ' 21:37',
                'default': false
            },
            'Snoop':
            {
                'type': 'checkbox',
                'label': 'Snoop.',
                'title': ' D-O-double-G (04:20)',
                'default': false
            },
            'Policz_ile_beta':
            {
                'type': 'checkbox',
                'label': '[TO IMPROVE] Policz ile / Sprawdź czy można zamknąć',
                'title': ' Dodaje automatyczne sprawdzanie i zapisanie w pamięci (przy każdym wejściu na [Received], jakie paczki zostały w sekcji [Received] (Tylko te dwellujące poniżej 40 minut), a następnie odpowiednio oznacza możliwe do zamknięcia Gaylordy/Carty w sekcji "Stacked" (na czerwono = znaleziono paczki w Received i powinno się poczekać z zamknięciem).',
                'default': false
            },
            'Fans':
            {
                'type': 'checkbox',
                'label': 'Fansy',
                'default': false
            },
            'Jastrz':
            {
                'type': 'checkbox',
                'label': 'Jastrz',
                'default': false
            },
            'Psstani Assistant':
            {
                'type': 'checkbox',
                'label': 'Psstani',
                'default': false
            }
        },
        'events': {
            'init':  function () { // runs after initialization completes
                // Zapobieganie_wyjsciu: this.get('Zapobieganie_wyjsciu')
                // Zapobieganie_wyjsciu: this.get('Zapobieganie_wyjsciu')


                Przewijanie_zmienna_test = this.get('Pole');
                kolory = this.get('Kolorowanie');
                guziki_przewijania = this.get('Guziki_przewijania');
                Beta_kopiowanie = this.get('Beta_kopiowanie');
                Auto_Odswiez = this.get('Auto_Odswiez_YMS');
                Guzik_odswiez_YMS = this.get('Guzik_odswiez_YMS');
                Drukowanie = this.get('Drukowanie');
                Liczenie_gaylordow = this.get('Liczenie_gaylordow');
                Zapobieganie_wyjsciu = this.get('Zapobieganie_wyjsciu');
                Czyje_auto = this.get('Czyje_auto');
                poprawki_kosmetyczne = this.get('Poprawki_kosmetyczne');
                //   ciemny_motyw = this.get('ciemny_motyw');
                Policz_ile_beta = this.get('Policz_ile_beta');
                barka_cfg = this.get('barka_cfg');
                Jastrz = this.get('Jastrz');
                Fans = this.get('Fans');
                snoop_cfg = this.get('Snoop');
                Psstani = this.get('Psstani Assistant');
            }
        },
        'css': '#ClerkConfig_section_header_1 { text-align: left !important; padding-left: 1em; } #ClerkConfig_section_header_2 { text-align: left !important; padding-left: 1em; } #ClerkConfig_section_header_3 { text-align: left !important; padding-left: 1em; }' // CSS that will hide the section
    });

// Tablica kolorów pól:
var tablica = [
    ["HS - 301", ""],
    ["HS - 302", ""],
    ["HS - 303", ""],
    ["HS - 304", ""],
    ["HS - 305", ""],
    ["HS - 306", ""],
    ["HS - 307", ""],
    ["HS - 308", "#lampa"],
    ["HS - 309", ""],
    ["HS - 310", ""],
    ["HS - 311", ""],
    ["HS - 312", ""],
    ["HS - 313", ""],
    ["HS - 314", ""],
    ["HS - 315", ""],
    ["HS - 316", ""],
    ["HS - 317", ""],
    ["HS - 318", "#lampa"],
    ["HS - 319", ""],
    ["HS - 320", ""],
    ["HS - 321", "#hydrant"],
    ["HS - 322", ""],
    ["HS - 323", ""],
    ["HS - 324", ""],
    ["HS - 325", ""],
    ["HS - 326", ""],
    ["HS - 327", ""],
    ["HS - 328", ""],
    ["HS - 329", ""],
    ["HS - 330", "#lampa"],
    ["HS - 331", ""],
    ["HS - 332", ""],
    ["HS - 333", ""],
    ["HS - 334", ""],
    ["HS - 335", ""],
    ["HS - 336", ""],
    ["HS - 337", ""],
    ["HS - 338", ""],
    ["HS - 339", "#hydrant"],
    ["HS - 340", "#lampa"],
    ["HS - 341", ""],
    ["HS - 342", ""],
    ["HS - 343", ""],
    ["HS - 344", ""],
    ["HS - 345", ""],
    ["HS - 346", ""],
    ["HS - 347", ""],
    ["HS - 348", ""],
    ["HS - 349", ""],
    ["HS - 350", ""],
    ["HS - 351", ""],
    ["HS - 352", "#lampa"],
    ["HS - 353", ""],
    ["HS - 354", "#FFFFCC"], // zolty
    ["HS - 355", "#FFFFCC"],
    ["HS - 356", "#FFFFCC"],
    ["HS - 357", "#hydrant"],
    //["HS - 357","#C0C0C0"], // szary
    ["HS - 358","#FFFFCC"],
    ["HS - 359","#FFFFCC"],
    ["HS - 360","#FFFFCC"],
    ["HS - 361","#FFFFCC"],
    ["HS - 362","#FFFFCC"],
    ["HS - 365","#CCFFFF"],
    ["HS - 366","#FFFFCC"],
    ["HS - 367","#hydrant"],
    ["HS - 368","#FFFFCC"],
    ["HS - 369","#CCFFCC"], // zielony
    ["HS - 370","#CCFFCC"],
    ["HS - 371","#CCFFCC"],
    ["HS - 372", "#FFFFCC"],
    ["HS - 373", "#FFFFCC"],
    ["HS - 374", "#lampa"],
    ["HS - 375", "#hydrant"],
    ["HS - 376", "#FFFFCC"],
    ["HS - 377","#FFFFCC"],
    ["HS - 378","#FFFFCC"],
    ["HS - 379","#FFFFCC"],
    ["HS - 380","#FFFFCC"],
    ["HS - 381","#CCFFCC"],
    ["HS - 382","#CCFFCC"],
    ["HS - 383", "#CCFFCC"],
    ["HS - 384", "#CCFFCC"],
    ["HS - 385","#lampa"],
    ["HS - 386","#FFFFCC"],
    ["HS - 387","#FFFFCC"],
    ["HS - 388","#FFFFCC"],
    ["HS - 389","#FFFFCC"],
    ["HS - 390","#FFFFCC"],
    ["HS - 391","#CCFFCC"],
    ["HS - 392", "#CCFFCC"],
    ["HS - 393", "#hydrant"],
    ["HS - 394","#CCFFCC"],
    ["HS - 395","#CCFFCC"],
    ["HS - 396", "#FFFFCC"],
    ["HS - 397", "#lampa"],
    ["HS - 398","#CCFFCC"],
    ["HS - 399","#CCFFCC"],
    ["HS - 400", "#CCFFCC"],
    ["HS - 401", "#CCFFCC"],
    ["HS - 402", "#CCFFCC"],
    ["HS - 403", "#CCFFCC"],
    ["HS - 404", "#CCFFCC"]
];


var rodeo_ssp = [
    ["KTW1->AIR-KTW3-LEJA-PARA","https://tiny.amazon.com/38kmb4qa/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DAP8-ND","https://tiny.amazon.com/1jj3mpgpc/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DBE3-ND","https://tiny.amazon.com/19pxa1n9i/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DHH2-ND","https://tiny.amazon.com/1eg0r4uii/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DVI1-ND","https://tiny.amazon.com/1bo8levko/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DVI2-ND","https://tiny.amazon.com/yje9ux9n/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DVI3-ND","https://tiny.amazon.com/1hpkjq1ao/rodeamazKTW1ExSD"],
    ["KTW1->CC-ATPO-HAGENBRU-AT-H1","https://tiny.amazon.com/v8iaiawd/rodeamazKTW1ExSD"],
    ["KTW1->CC-ATPO-KALSDORF-AT-H2-ND","https://tiny.amazon.com/iqevx14q/rodeamazKTW1ExSD"],
    ["KTW1->CC-ATPO-WIEN-AT-H2-ND","https://tiny.amazon.com/a5b1xjfg/rodeamazKTW1ExSD"],
    ["KTW1->CC-DE08-DEPO-REINSDOR-DE-H1","https://tiny.amazon.com/mtpqbnha/rodeamazKTW1ExSD"],
    ["KTW1->CC-DE04-DEPO-RADEFELD-DE-H1","https://tiny.amazon.com/11ppi38pm/rodeamazKTW1ExSD"],
    ["KTW1->CC-DHLX-OZAROWIC-PL-H1","https://tiny.amazon.com/jyia3gwz/rodeamazKTW1ExSD"],
    ["KTW1->CC-D016-DPDD-ASCHAF16-DE-H2","https://tiny.amazon.com/11z20w50w/rodeamazKTW1ExSD"],
    ["KTW1->CC-DPDD-DUISB147-DE-H2","https://tiny.amazon.com/hulhmj2c/rodeamazKTW1ExSD"],
    ["KTW1->CC-DPDD-GUDENS14-DE-H2","https://tiny.amazon.com/13zfzzuvz/rodeamazKTW1ExSD"],
    ["KTW1->CC-DPDD-NUERN190-DE-H2","https://tiny.amazon.com/1hwxcubeu/rodeamazKTW1ExSD"],
    ["KTW1->CC-DP01-DP-OTTENDOR-DE","https://tiny.amazon.com/9m95dpn8/rodeamazKTW1ExSD"],
    ["KTW1->CC-DP08-DP-NEUMARK-DE-H2","https://tiny.amazon.com/4to1rhmg/rodeamazKTW1ExSD"],
    ["KTW1->CC-DP17-DP-NEUSTREL-DE-H2","https://tiny.amazon.com/85vqha5d/rodeamazKTW1ExSD"],
    ["KTW1->CC-DP01-DP-OTTENDOR-DE-H1","https://tiny.amazon.com/4uco4mpi/rodeamazKTW1ExSD"],
    ["KTW1->CC-UPS-KATOWICE-PL-H1","https://tiny.amazon.com/2njdohm/rodeamazKTW1ExSD"],
    ["KTW1->LH-BER8","https://tiny.amazon.com/vrnf54bo/rodeamazKTW1ExSD"],
    ["KTW1->LH-KZ41-DHPL-ZABRZE-PL-H2","https://tiny.amazon.com/oe5t7izo/rodeamazKTW1ExSD"],
    ["KTW1->LH-DTM8","https://tiny.amazon.com/21naviv5/rodeamazKTW1ExSD"],
    ["KTW1->LH-DTM9","https://tiny.amazon.com/13ilc4blc/rodeamazKTW1ExSD"],
    ["KTW1->LH-FRAX","https://tiny.amazon.com/1x2gbhj7/rodeamazKTW1ExSD"],
    ["KTW1->LH-HAJ8","https://tiny.amazon.com/qljxu4kk/rodeamazKTW1ExSD"],
    ["KTW1->LH-HHN9","https://tiny.amazon.com/18qzrnqzy/rodeamazKTW1ExSD"],
    ["KTW1->LH-HEKE-HRMS-KETZIN-DE-H1","https://tiny.amazon.com/3wh5k9dt/rodeamazKTW1ExSD"],
    ["KTW1->LH-IP97-INPO-PIOTRKOW-PL-H1","https://tiny.amazon.com/yiovrm26/rodeamazKTW1ExSD"],
    ["KTW1->LH-LEJ7","https://tiny.amazon.com/1bdxeg3af/rodeamazKTW1ExSD"],
    ["KTW1->LH-LIN8","https://tiny.amazon.com/bbvtsszy/rodeamazKTW1ExSD"],
    ["KTW1->LH-MHG9","https://tiny.amazon.com/3gf01ovv/rodeamazKTW1ExSD"],
    ["KTW1->LH-NUE9","https://tiny.amazon.com/1i9azdy6z/rodeamazKTW1ExSD"],
    ["KTW1->LH-PRG9","https://tiny.amazon.com/151by7cjl/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DSY2-ND","https://tiny.amazon.com/10y5a44cx/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DVI1-DVI2-ND","https://tiny.amazon.com/s8a97trx/rodeamazKTW1ExSD"],
    ["KTW1->LH-HAJX","https://tiny.amazon.com/1ce5uvr32/rodeamazKTW1ExSD"],
    ["KTW1->LH-BLQ8","https://tiny.amazon.com/1giz1m89h/rodeamazKTW1ExSD"],
    ["KTW1->LH-FCO9","https://tiny.amazon.com/165a10vns/rodeamazKTW1ExSD"],
    ["KTW1->RAIL-LH-RKTW-DTM8","https://tiny.amazon.com/1cyfdr6j0/rodeamazKTW1ExSD"],
    ["KTW1->RAIL-LH-RKTW-DTM9","https://tiny.amazon.com/185o11c31/rodeamazKTW1ExSD"],
    ["KTW1->LH-MUC7","https://tiny.amazon.com/ufelvu6z/rodeamazKTW1ExSD"],
    ["KTW1->LH-MHG7","https://tiny.amazon.com/fitm41us/rodeamazKTW1ExSD"],
    ["KTW1->LH-MHG7","https://tiny.amazon.com/fitm41us/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DSY1-ND","https://tiny.amazon.com/y1szljqq/rodeamazKTW1ExSD"],
    ["KTW1->AMZL-DBB1-ND","https://tiny.amazon.com/1ifhwmeit/rodeamazKTW1ExSD"]
];


var tso_stages = [
    ["STAGE_POZ2","42bf33f3-0cff-846a-04e1-8fc4c2563f3a"],
    ["STAGE_FRA7","aac425b8-25ab-8d26-721e-bc08e16194b0"],
    ["STAGE_DUS4","eec42757-e54c-1e4b-3469-f35f32ca3326"],
    ["STAGE_BRE4","70c73889-b794-6790-6676-2bc707fe361f"],
    ["STAGE_NUE1","acc78e54-ba4e-04e2-263c-85337f06516c"],
]


// Zmienne
var zaladunki_temp;
var temp = "";
var van = "";
var van2 = "";
var van3 = "";
var i;
var klasy;
var rej = "";
var rejka = "";
var puszki_puste;
var puszki_defekty;
var puszki_wszystkie;
var naczepy_ats;
var vrid_array = [];
var test;
var tytul_okienka_pomocy;


// (function() {
//     if(window.location.href.indexOf("https://hooks.chime.aws") > -1 )
//     {
//         //console.log(GM_config.get("Wiadomosc"));
//         var xhr = new XMLHttpRequest();
//         var url = "https://hooks.chime.aws/incomingwebhooks/34bbb031-c878-4916-ac44-a2843717b0cc?token=S1FYbHE3eW18MXxKdnNVNUFIUWFNZUNwYWx5LXhra29SZ2VOOXN5NHkxbGFzaUlmRW5qUWJr";
//         xhr.open("POST", url, true);
//         xhr.setRequestHeader("Content-Type", "application/JSON");
//         var data = JSON.stringify({"Content": GM_config.get("Wiadomosc")});
//         xhr.send(data);
//     }
// })();



setTimeout(function() {

    if(Psstani)
    {
        if(window.location.href.indexOf("https://app.chime.aws") > -1 )
        {
            //console.log('test1');
            setTimeout(function() {
                //console.log('test2');

                // Sprawdz czy na liście kontaktów
                var ConvList = document.querySelectorAll('.MessageNavCellContainer__name');
                var found = false;

                for(var i = 0;i<ConvList.length;i++)
                {
                    if(ConvList[i].textContent == 'Nowara, Tomasz')
                    {
                        ConvList[i].click();
                        found = true;
                        break;
                    }
                }

                // jeżeli nie ma na liście ostatnich, trzeba napisać
                if(!found)
                {
                    window.location.href = 'https://app.chime.aws/conversations/new';
                    setTimeout(function() {
                    },3000);
                }

                // schowaj navbar
                document.querySelector('.Sidebar').style.display = 'none';
            },2000);
        }
    }


    // SKANER

    // SKANER
    if(window.location.href.indexOf("eu-west-1.prod.sort-assist-mobile.ats.amazon.dev") > -1) {
        // Modified menu creation with new layout and buttons
        // Create scanner button
        var przebijacz = document.createElement('div');
        przebijacz.setAttribute('id', 'przebijacz_div');
        przebijacz.setAttribute('style', 'display:inline-flex;padding-left:20px;');
        przebijacz.innerHTML = '<div style="width:50px;background-image:url(\'https://eu-west-1.prod.sort-assist-mobile.ats.amazon.dev/static/media/scanPackage.3fc212cc3f3994c90dcd0b7267fd2250.svg\');background-repeat:round;display:inline-block;">&nbsp;</div><span style="margin-left:5px;">PRZEBIJACZ</span>';
        document.querySelectorAll('header')[0].appendChild(przebijacz);

        var przebijacz_menu = document.createElement('div');
        przebijacz_menu.innerHTML = `
    <div style="
        padding: 20px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        font-family: 'Segoe UI', Arial, sans-serif;
        max-width: 800px;
    ">
        <div style="
            text-align: center;
            color: #333;
            font-size: xx-large;
            margin-bottom: 15px;
        ">PRZEBIJACZ</div>

        <textarea id="bulk-input"
            placeholder="Jeżeli masz większą ilość paczek, wklej je tutaj - uzuepłnią poniższe pola. \r\nPrzyciski lokacji działają dla każdej wpisanej paczki."
            style="
                width: 100%;
                height: 3em;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 10px;
                font-size: 13px;
            "
        ></textarea>

        <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            background: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
            font-size: 13px;
        ">
            <div style="flex: 1; text-align: center;">Co</div>
            <div style="flex: 1; text-align: center;">Gdzie</div>
            <div style="flex: 1; text-align: center;">Status</div>
        </div>

        <div id="input-container" style="
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 300px;
            overflow-y: auto;
        ">
        </div>

        <div style="display: flex; gap: 8px; margin: 10px 0;">
            <button id="same-stage" style="
                flex: 1;
                padding: 6px;
                background-color: #f5f5f5;
                color: #333;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">Wszystko do tej samej (pierwszej) lokacji</button>

            <button id="hasiok_stage" style="padding: 6px 12px; background-color: #f5f5f5; color: #333; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px;">Hasiok</button>
            <button id="vret_stage" style="padding: 6px 12px; background-color: #f5f5f5; color: #333; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px;">General VRET</button>
            <button id="cret_stage" style="padding: 6px 12px; background-color: #f5f5f5; color: #333; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px;">CRET_MIX</button>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button id="clear-all" style="
                padding: 6px 12px;
                background-color: tomato;
                color: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">Czyść wszystko</button>

            <button id="przebijacz_akcja" style="
                flex: 1;
                padding: 8px;
                background-color: #404040;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            ">PRZEBIJAJ</button>
        </div>
    </div>
`;

        przebijacz_menu.setAttribute('id', 'przebijacz_menu');
        przebijacz_menu.setAttribute('style', 'display:none;width:600px;right:2%;top:10%;border:1px solid black;position:fixed;background-color:white;box-shadow: 0 2px 10px rgba(0,0,0,0.1);max-height:90vh;overflow:hidden;');
        document.querySelector('body').appendChild(przebijacz_menu);

        // Add click event to toggle menu
        document.getElementById("przebijacz_div").addEventListener("click", function() {
            document.getElementById("przebijacz_menu").style.display =
                document.getElementById("przebijacz_menu").style.display === 'block' ? 'none' : 'block';
        });

        // Add functions for new features
        function createInitialRows() {
            const container = document.getElementById('input-container');
            container.innerHTML = ''; // Clear existing rows
            for(let i = 0; i < 6; i++) {
                addNewRow();
            }
        }


        // Create Pallets button
        var palletsButton = document.createElement('div');
        palletsButton.setAttribute('id', 'pallets_button');
        palletsButton.setAttribute('style', 'display:inline-flex;padding-left:20px;cursor:pointer;align-items:center;'); // dodano align-items:center
        palletsButton.innerHTML = `
    <img src="https://eu.empty-tote-mover.aces.amazon.dev/assets/favicon-b51d6189.ico"
         style="height: 50px;
                margin-right: 8px;
                vertical-align: middle;">
    <span>Pallets from Tote to Bramy TSO</span>
`;

        // document.querySelectorAll('header')[0].appendChild(toteImage);
        document.querySelectorAll('header')[0].appendChild(palletsButton);


        // Create pallets menu
        var palletsMenu = document.createElement('div');
        palletsMenu.setAttribute('id', 'pallets_menu');
        palletsMenu.setAttribute('style', 'display:none;width:600px;right:2%;top:10%;border:1px solid black;position:fixed;background-color:white;box-shadow: 0 2px 10px rgba(0,0,0,0.1);max-height:90vh;overflow:hidden;');
        palletsMenu.innerHTML = `
    <div style="padding: 20px;">
        <div style="margin-bottom: 15px; font-size: 18px; font-weight: bold; text-align: center;">
            Ponieważ nie zawsze jest łatwy dostęp do etykiet, tutaj można zeskanować jeden Tote z każdej palety, aby przebić je bezpośrednio na Bramy_TSO.
        </div>
        <textarea id="totes-input"
            placeholder="Wklej listę tote (każdy w nowej linii)"
            style="width: 100%;
                   height: 150px;
                   margin-bottom: 10px;
                   padding: 8px;
                   border: 1px solid #ccc;
                   border-radius: 4px;"></textarea>
        <div id="progress-container" style="margin-bottom: 10px; display: none;">
            <div style="margin-bottom: 5px;">
                <span id="current-operation">Przetwarzanie...</span>
                <span id="progress-counter"></span>
            </div>
            <div style="background-color: #f0f0f0; border-radius: 4px; overflow: hidden;">
                <div id="progress-bar"
                     style="height: 20px;
                            width: 0%;
                            background-color: #4CAF50;
                            transition: width 0.3s;"></div>
            </div>
        </div>
        <div id="results-container"
             style="max-height: 200px;
                    overflow-y: auto;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    display: none;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Tote</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Paleta</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Status</th>
                    </tr>
                </thead>
                <tbody id="results-body"></tbody>
            </table>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button id="process_totes" style="
                flex: 1;
                padding: 10px;
                background-color: #404040;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;">Przenieś do Bramy TSO</button>
            <button id="clear_all" style="
                padding: 10px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;">Wyczyść wszystko</button>
        </div>
    </div>
`;

        document.querySelector('body').appendChild(palletsMenu);


        // Dodaj handler dla przycisku czyszczenia
        document.getElementById("clear_all").addEventListener("click", function() {
            document.getElementById("totes-input").value = "";
            document.getElementById("progress-container").style.display = "none";
            document.getElementById("results-container").style.display = "none";
            document.getElementById("results-body").innerHTML = "";
            document.getElementById("progress-bar").style.width = "0%";
            document.getElementById("current-operation").textContent = "Przetwarzanie...";
            document.getElementById("progress-counter").textContent = "";
        });

        async function getContainerInfo(toteId) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://sortcenter-menu-eu.amazon.com/audit/backend/getContainerInfo?containerId=${toteId}&trollStamp=${Date.now()}`,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
                        "Accept": "application/json",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Connection": "keep-alive",
                        "Referer": "https://sortcenter-menu-eu.amazon.com/audit/containerInfo",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data.parentContainerLabel || null);
                        } catch (error) {
                            console.error('Error parsing response:', error);
                            resolve(null);
                        }
                    },
                    onerror: function(error) {
                        console.error('Error fetching container info:', error);
                        resolve(null);
                    }
                });
            });
        }

        // Toggle pallets menu
        document.getElementById("pallets_button").addEventListener("click", function() {
            document.getElementById("pallets_menu").style.display =
                document.getElementById("pallets_menu").style.display === 'block' ? 'none' : 'block';
            document.getElementById("przebijacz_menu").style.display = 'none';
        });

        // Process totes button handler
        document.getElementById("process_totes").addEventListener("click", async function() {
            const button = this;
            const progressContainer = document.getElementById('progress-container');
            const resultsContainer = document.getElementById('results-container');
            const resultsBody = document.getElementById('results-body');
            const progressBar = document.getElementById('progress-bar');
            const progressCounter = document.getElementById('progress-counter');
            const currentOperation = document.getElementById('current-operation');

            // Resetuj i pokaż kontenery
            resultsBody.innerHTML = '';
            progressContainer.style.display = 'block';
            resultsContainer.style.display = 'block';
            button.disabled = true;
            button.style.backgroundColor = '#cccccc';

            const totesList = document.getElementById("totes-input").value
            .split('\n')
            .filter(tote => tote.trim());

            const totalTotes = totesList.length;

            for (let i = 0; i < totesList.length; i++) {
                const tote = totesList[i].trim();

                // Aktualizuj progress bar i licznik
                const progress = ((i + 1) / totalTotes) * 100;
                progressBar.style.width = `${progress}%`;
                progressCounter.textContent = `${i + 1}/${totalTotes}`;
                currentOperation.textContent = `Przetwarzanie tote: ${tote}`;

                // Dodaj wiersz dla aktualnego tote
                const row = resultsBody.insertRow();
                const toteCell = row.insertCell(0);
                const palletCell = row.insertCell(1);
                const statusCell = row.insertCell(2);

                toteCell.textContent = tote;
                toteCell.style.padding = '8px';
                palletCell.style.padding = '8px';
                statusCell.style.padding = '8px';

                // Pobierz informacje o palecie
                const palletId = await getContainerInfo(tote);
                palletCell.textContent = palletId || 'Nie znaleziono';

                if (palletId) {
                    statusCell.innerHTML = '<span style="color: #666;">Przenoszenie...</span>';
                    try {
                        const result = await przebijacz_fetch(palletId, '94ca6e90-6d0b-21ee-8795-58bf1d75fb66');
                        if (result.errors) {
                            if (result.errors[0].message.includes("MoveContainer failed due to move to same parent")) {
                                statusCell.innerHTML = '<span style="color: #2196F3;">Move to same parent</span>';
                            } else {
                                statusCell.innerHTML = `<span style="color: #f44336;">${result.errors[0].message}</span>`;
                            }
                        } else {
                            statusCell.innerHTML = '<span style="color: #4CAF50;">Sukces</span>';
                        }
                    } catch (error) {
                        statusCell.innerHTML = `<span style="color: #f44336;">Błąd: ${error.message}</span>`;
                    }
                } else {
                    statusCell.innerHTML = '<span style="color: #f44336;">Nie znaleziono palety</span>';
                }

                await timerasync(150);
            }

            // Zakończ operację
            currentOperation.textContent = 'Zakończono';
            button.disabled = false;
            button.style.backgroundColor = '#404040';
        });

        document.getElementById("przebijacz_akcja").addEventListener(
            "click", przebijacz_akcja, false
        );

        var timerasync = ms => new Promise(res => setTimeout(res, ms));

        async function przebijacz_akcja() {
            const rows = document.getElementById('input-container').children;

            for(let row of rows) {
                const inputs = row.getElementsByTagName('input');
                const paczka = inputs[0].value;
                const gdzie = inputs[1].value;
                const statusField = inputs[2];

                if(!paczka || !gdzie) continue;

                const response = await przebijacz_fetch(paczka, gdzie);

                if(response.errors) {
                    statusField.value = response.errors[0].message;
                } else {
                    statusField.value = "OK";
                }

                await timerasync(150);
            }
        }


        function addNewRow() {
            const container = document.getElementById('input-container');
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.gap = '10px';
            rowDiv.innerHTML = `
        <input type="text" placeholder="Paczka/Gaylord/Cart" style="flex: 1; padding: 5px;">
        <input type="text" placeholder="Naczepa/Stage/Gaylord/Cart" style="flex: 1; padding: 5px;">
        <input type="text" placeholder="Status" style="flex: 1; padding: 5px;" readonly>
    `;
            container.appendChild(rowDiv);
        }

        // Add event listener for bulk input
        document.getElementById('bulk-input').addEventListener('input', function(e) {
            const packages = e.target.value.split('\n').filter(line => line.trim());
            const container = document.getElementById('input-container');
            container.innerHTML = ''; // Clear existing rows

            packages.forEach(pkg => {
                addNewRow();
                const lastRow = container.lastElementChild;
                const inputs = lastRow.getElementsByTagName('input');
                inputs[0].value = pkg.trim();
            });

            // Add extra rows if less than 3 total
            while(container.children.length < 6) {
                addNewRow();
            }
        });


        // Add event listener for "Hasiok stage" button
        document.getElementById('hasiok_stage').addEventListener('click', function() {
            const rows = document.getElementById('input-container').children;

            for(let row of rows) {
                const inputs = row.getElementsByTagName('input');
                if(inputs[0].value) {
                    inputs[1].value = '0ac6da8c-074d-e370-97ab-3610bfb64d4d';
                }
            }
        });

        // Add event listener for "General VRET stage" button
        document.getElementById('vret_stage').addEventListener('click', function() {
            const rows = document.getElementById('input-container').children;

            for(let row of rows) {
                const inputs = row.getElementsByTagName('input');
                if(inputs[0].value) {
                    inputs[1].value = '72c125ca-df3d-3b59-dcbc-eb51c18c1be0';
                }
            }
        });

        // Add event listener for "General VRET stage" button
        document.getElementById('cret_stage').addEventListener('click', function() {
            const rows = document.getElementById('input-container').children;

            for(let row of rows) {
                const inputs = row.getElementsByTagName('input');
                if(inputs[0].value) {
                    inputs[1].value = '96baa656-4d02-8f57-e14a-3bb203699290';
                }
            }
        });

        // Add event listener for "Ten sam stage" button
        document.getElementById('same-stage').addEventListener('click', function() {
            const rows = document.getElementById('input-container').children;
            let firstStage = '';

            // Get first non-empty stage value
            for(let row of rows) {
                const inputs = row.getElementsByTagName('input');
                if(inputs[0].value && inputs[1].value) {
                    firstStage = inputs[1].value;
                    break;
                }
            }

            // Apply to all rows with packages
            if(firstStage) {
                for(let row of rows) {
                    const inputs = row.getElementsByTagName('input');
                    if(inputs[0].value) {
                        inputs[1].value = firstStage;
                    }
                }
            }
        });

        // Add event listener for "Czyść" button
        document.getElementById('clear-all').addEventListener('click', function() {
            document.getElementById('bulk-input').value = '';
            createInitialRows();
        });

        // Initialize with three empty rows
        createInitialRows();
    }

    async function przebijacz_fetch(paczka, gdzie)
    {
        var zapytanie = await fetch("https://eu-west-1.prod.sort-assist-mobile.ats.amazon.dev/graphql", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "content-type": "application/json",
                "x-api-key": "SCRIPTING-OR-AUTOMATING-THIS-API-IS-STRICTLY-AGAINST-POLICY-AND-RISKS-BANNING-ACCOUNT",
                "x-session-lineage": "App~SAM^S_09b37646-bf21-4ac5-bd05-9e35e1ead51e >> ??~RootActor^X_x:3 >> Ro~ContainerBuilder^X_x:7 >> Wf~Trickle2^X_x:9 >> Op~ScanDestination^X_x:13 >> ??~VisualMoveContainer^X_x:16",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=4"
            },
            "referrer": "https://eu-west-1.prod.sort-assist-mobile.ats.amazon.dev/",
            "body": "{\"operationName\":\"visualMoveContainer\",\"variables\":{\"input\":{\"sourceScannable\":\"" + paczka + "\",\"destinationScannable\":\"" + gdzie + "\",\"overrideValidation\":true,\"enforceDirectedWorkExistCheck\":false,\"lightGuidedSortation\":false}},\"query\":\"mutation visualMoveContainer($input: MoveContainerInput!) {\\n  visualMoveContainer(input: $input) {\\n    sourceScannable\\n    sourceScannableIds\\n    destinationScannable\\n    destinationScannableIds\\n    sourceContainerLabel\\n    destinationContainerLabel\\n    __typename\\n  }\\n}\"}",
            "method": "POST",
            "mode": "cors"
        });

        var jobj = await zapytanie.json();
        return jobj;
    }


    // CAPS
    if(window.location.href.indexOf("https://atrops-web-eu.amazon.com/new_caps") > -1)
    {
        const table = document.getElementById("report_table"); // Zmień na właściwe ID swojej tabeli

        const headerRow = table.rows[0];
        let capIndex = -1;
        let scheduleIndex = -1;

        // Znajdź indeksy kolumn "cap" i "schedule" w nagłówku tabeli
        for (let cellIndex = 0; cellIndex < headerRow.cells.length; cellIndex++) {
            const cellText = headerRow.cells[cellIndex].textContent.toLowerCase();
            if (cellText == "cap") {
                capIndex = cellIndex;
            }
            if (cellText == "schedule") {
                scheduleIndex = cellIndex;
            }
        }

        if (capIndex === -1 || scheduleIndex === -1) {
            console.log("Nie znaleziono kolumny 'cap' lub 'schedule' w nagłówku tabeli.");
            return;
        }

        for (let row = 1; row < table.rows.length; row++) {
            const capValue = parseFloat(table.rows[row].cells[capIndex].textContent);
            const scheduleValue = parseFloat(table.rows[row].cells[scheduleIndex].textContent);

            if (!isNaN(capValue) && !isNaN(scheduleValue)) {
                const difference = capValue - scheduleValue;
                const cell = table.rows[row].cells[scheduleIndex];

                if (difference > 3) {
                    cell.style.backgroundColor = "yellowgreen";
                } else if (difference < 3 && difference >= 0) {
                    cell.style.backgroundColor = "yellow";
                } else {
                    cell.style.backgroundColor = "pink";
                }
            }
        }
    }

    //
    // YMS
    //
    if(window.location.href.indexOf("https://trans-logistics-eu.amazon.com/yms/shipclerk/") > -1)
    {
        var script = document.createElement('script');
        script.textContent = 'function copyToClipboard(text){ var dummy = document.createElement("input"); document.body.appendChild(dummy);dummy.setAttribute(\'value\', text);dummy.select();document.execCommand("copy"); document.body.removeChild(dummy); }';
        (document.head||document.documentElement).appendChild(script);

        setInterval(function(){
            if(document.getElementById("summary-view-toggle").checked != true){
                if(document.getElementById("checkout-dialog") == null){
                    if(document.getElementById("movementForm") == null){
                        if(document.getElementById("loadingMask").className != "yms-modal-backdrop"){
                            if(document.getElementById("ship-clerk-dashboard-table") != null && document.getElementById("ship-clerk-dashboard-table") != undefined)
                            {
                                rej = document.getElementsByClassName('col6');
                                var temp3;
                                var temp4;
                                var temp5;
                                var i = 0;
                                var k = 0;
                                var id = "";
                                klasy = $("tr[class]");



                                // Petla na kolor
                                for (i ; i < klasy.length ; i++)
                                {
                                    if(kolory == true)
                                    {
                                        if((tablica[k]) != undefined)
                                        {
                                            temp3 = (tablica[k][0]); // Jakie pole

                                            if(klasy[i].children[0] != undefined && klasy[i].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0].children[0].innerText == temp3) // nie includes
                                            {
                                                temp5 = (tablica[k][1]); // Jaki kolor
                                                if(temp5 == "#lampa")
                                                {
                                                    if(document.getElementById("lampa_" + i) == null)
                                                    {
                                                        var zNode_test = document.createElement ('div');
                                                        zNode_test.innerHTML = '<div title="Pole z lampa - najlepiej skladowac na nim naczepy." id="lampa_' + i + '" style="width:3em;height:4em;z-index:9999;content:url(https://drive-render.corp.amazon.com/view/nowaratn@/CLERK/Lampa.png);"></div>';
                                                        zNode_test.setAttribute ('id', 'myLampa_' + i);
                                                        zNode_test.setAttribute ('style', 'position:relative;top:-4em;left:8em;height:1px;');
                                                        klasy[i].children[0].children[0].appendChild(zNode_test);
                                                        klasy[i].bgColor = "#C0C0C0";
                                                        if(klasy[i+1].children.length = 7)
                                                        {
                                                            klasy[i+1].bgColor = klasy[i].bgColor;
                                                        }
                                                        k++;
                                                    }
                                                }
                                                else if (temp5 == "#hydrant")
                                                {
                                                    if(document.getElementById("hydrant_" + i) == null)
                                                    {
                                                        var zNode_test2 = document.createElement ('div');
                                                        zNode_test2.innerHTML = '<div title="Pole z hydrantem - najlepiej skladowac na nim naczepy." id="hydrant_' + i + '" style="width:1.5em;height:3em;z-index:9999;content:url(https://drive-render.corp.amazon.com/view/nowaratn@/CLERK/Hydrant.png);"></div>';
                                                        zNode_test2.setAttribute ('id', 'myhydrant_' + i);
                                                        zNode_test2.setAttribute ('style', 'position:relative;top:-3em;left:9em;height:1px;');
                                                        klasy[i].children[0].children[0].appendChild(zNode_test);
                                                        klasy[i].bgColor = "#C0C0C0";
                                                        if(klasy[i+1].children.length = 7)
                                                        {
                                                            klasy[i+1].bgColor = klasy[i].bgColor;
                                                        }
                                                        k++;
                                                    }
                                                }
                                                else // if (temp5 != "#lampa" && temp5 != "#hydrant")
                                                {
                                                    //    klasy[i].children.length = >8 / pierwszy wers
                                                    //    klasy[i].children.length = 7 / drugi wers - brak oznaczenia bramy
                                                    // console.log("else");

                                                    temp4 = (tablica[k][1]);
                                                    if(klasy[i].bgColor != temp4)
                                                    {
                                                        klasy[i].bgColor = temp4;
                                                    }
                                                    k++;

                                                    if(klasy[i].children.length = 7)
                                                    {
                                                        //    console.log(klasy[i]);
                                                        if(klasy[i+1].bgColor != temp4)
                                                        {
                                                            klasy[i+1].bgColor = temp4;
                                                        }
                                                    }

                                                    if(klasy[i].attributes[1].nodeValue = "empty-location ng-scope")
                                                    {
                                                        klasy[i].attributes[1].nodeValue = "ng-scope";
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // Wyszukiwanie do przewijania YMS guzikami
                                    if(klasy[i].children[0] != undefined && klasy[i].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0].children[0].innerText == "DD144")
                                    {
                                        van = klasy[i];
                                    }
                                    if(klasy[i].children[0] != undefined && klasy[i].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0].children[0].innerText == "SB - 404")
                                    {
                                        van2 = klasy[i];

                                    }
                                    if(klasy[i].children[0] != undefined && klasy[i].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0].children[0].innerText == Przewijanie_zmienna_test)
                                    {
                                        van3 = klasy[i];
                                    }

                                    if(Beta_kopiowanie == true)
                                    {
                                        if(rej[i] != null)
                                        {
                                            if(rej[i].children[0] != undefined && rej[i].children[0].children[0] != undefined && rej[i].children[0].children[0].children[0] != undefined && rej[i].children[0].children[0].children[0].attributes[1].value != "Kopiuj")
                                            {
                                                var temptemptemp;
                                                var temp14 = rej[i].innerText;
                                                temptemptemp = temp14.split("\n");
                                                temp14 = temptemptemp[0];

                                                var zNode_kopiowanie = document.createElement ('div');
                                                zNode_kopiowanie.innerHTML = "<input type=\"button\" title=\"Kopiuj\" id=\"button_copy_" + i + "\" style=\"background: url(https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/16/copy-icon.png) no-repeat top left;border: none;opacity:0.5;width:20px !important;padding:10px;margin-left:-20px;\" onclick=\"document.getElementById('text_"+i+"').select(); document.execCommand('copy');\" />" +
                                                    "<textarea rows=\"1\" cols=\"1\" id=\"text_" + i + "\" style=\"opacity:0;visibility:visible;margin-top:-1.5rem;\">"+temp14+"</textarea>";
                                                zNode_kopiowanie.setAttribute ('id', 'textarea_' + i);
                                                zNode_kopiowanie.setAttribute ('style', 'position:absolute;');
                                                // position:absolute;
                                                if(document.getElementsByClassName('col6')[i].children[0] != undefined)
                                                {
                                                    document.getElementsByClassName('col6')[i].children[0].insertBefore(zNode_kopiowanie,document.getElementsByClassName('col6')[i].children[0].children[0]);
                                                    document.getElementsByClassName('col6')[i].children[0].children[0].style.width = "0%";
                                                }
                                                // rej[i].innerHTML = rej[i].innerHTML.replace('<!-- end ngIf: yardAsset -->','<!-- end ngIf: yardAsset --><input type="button" title="Kopiuj" id="button_copy_' + i + '" onclick="copyToClipboard(\'' + temp14 + '\')" style="background: url(https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/16/copy-icon.png) no-repeat top left;border: none;opacity:0.5;width:20px !important;" />&nbsp;');
                                            }
                                        }
                                    }

                                    /////////////////////////////////////////////////////////////////////
                                    ///////////////////// Jaki VRID jaki nr konia //////////////////////
                                    ///////////////////////////////////////////////////////////////////

                                    // klasy = document.getElementsByTagName("TR");
                                }

                                i = 1;
                                k = 0;
                                temp3 = "";
                                temp4 = "";


                                var vrid_rej = "";
                                var temp_vrid2 = "";

                                var konie = document.querySelectorAll('.yard-asset-icon-TRACTOR');
                                var boxtruck = document.querySelectorAll('.yard-asset-icon-BOX_TRUCK');

                                var koniu = "";
                                var parentTr = "";
                                var koniu_info = "";
                                var koniu_vrid = "";
                                var ile = "";
                                var polko = "";


                                // konie
                                for (i = 0 ; i < konie.length ; i++)
                                {
                                    koniu = document.querySelectorAll('.yard-asset-icon-TRACTOR')[i];
                                    parentTr = koniu.closest('tr');
                                    koniu_info = parentTr.querySelector('.load-identifiers');
                                    koniu_vrid = koniu_info.querySelectorAll('span');
                                    ile = koniu_vrid.length;
                                    polko = "";


                                    if(ile != 0)
                                    {
                                        if(parentTr.querySelector('.col1') != null)
                                        {
                                            console.log(koniu_vrid);
                                            console.log(ile);
                                            polko = parentTr.querySelector('.col1').textContent.trim();
                                            localStorage.setItem(koniu_vrid[ile-1].lastChild.textContent.trim() + "_pole",polko.replaceAll(' ',''));
                                        }
                                        else if(parentTr.previousElementSibling.querySelector('.col1') != null)
                                        {
                                            polko = parentTr.previousElementSibling.querySelector('.col1').textContent.trim();
                                            localStorage.setItem(koniu_vrid[ile-1].lastChild.textContent.trim() + "_pole",polko.replaceAll(' ',''));
                                        }
                                        else
                                        {
                                            polko = parentTr.previousElementSibling.previousElementSibling.querySelector('.col1').textContent.trim();
                                            localStorage.setItem(koniu_vrid[ile-1].lastChild.textContent.trim() + "_pole",polko.replaceAll(' ',''));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },1000);




        // Guzik filtruj YMS na ats / detr
        if(document.getElementById("filtruj_yms_div") == null || document.getElementById("filtruj_yms_div") == undefined)
        {
            var filtruj_yms = document.createElement ('div');
            filtruj_yms.innerHTML = '<input id="filtruj_yms_ats" type="button" value="ATS" style="padding-left:10px;padding-right:10px;" ></input>' +
                '<input id="filtruj_yms_atpst" type="button" value="ATPST" style="padding-left:10px;padding-right:10px;" ></input>' +
                '<input id="filtruj_yms_detr" type="button" value="DETR" style="padding-left:10px;padding-right:10px;" ></input>' +
                '<input id="filtruj_yms_mikpi" type="button" value="MIKPI" style="padding-left:10px;padding-right:10px;" ></input>' +
                '<input id="filtruj_yms_kasuj" type="button" value="[X]" style="padding-left:10px;padding-right:10px;" ></input>';
            filtruj_yms.setAttribute ('id', 'filtruj_yms_div');
            filtruj_yms.setAttribute ('style', 'position:absolute;display:inline;');
            document.getElementById("searchFilterForm").appendChild(filtruj_yms);

            document.getElementById ("filtruj_yms_ats").addEventListener (
                "click", ButtonClickFiltrujATS, false
            );

            document.getElementById ("filtruj_yms_mikpi").addEventListener (
                "click", ButtonClickFiltrujMIKPI, false
            );

            document.getElementById ("filtruj_yms_detr").addEventListener (
                "click", ButtonClickFiltrujDETR, false
            );

            document.getElementById ("filtruj_yms_kasuj").addEventListener (
                "click", ButtonClickFiltrujKasuj, false
            );

            document.getElementById ("filtruj_yms_atpst").addEventListener (
                "click", ButtonClickFiltrujATPST, false
            );

            function ButtonClickFiltrujATS (zEvent)
            {
                document.getElementById("searchInput").value = "atse";
                document.getElementById("searchInput").dispatchEvent(new KeyboardEvent('input',{'key':'s'}));
            }

            function ButtonClickFiltrujATPST (zEvent)
            {
                document.getElementById("searchInput").value = "atps";
                document.getElementById("searchInput").dispatchEvent(new KeyboardEvent('input',{'key':'s'}));
            }

            function ButtonClickFiltrujDETR (zEvent)
            {
                document.getElementById("searchInput").value = "DETR";
                document.getElementById("searchInput").dispatchEvent(new KeyboardEvent('input',{'key':'s'}));
            }

            function ButtonClickFiltrujKasuj (zEvent)
            {
                document.getElementById("searchInput").value = "";
                document.getElementById("searchInput").dispatchEvent(new KeyboardEvent('input',{'key':'s'}));
            }

            function ButtonClickFiltrujMIKPI (zEvent)
            {
                document.getElementById("searchInput").value = "MIKPI";
                document.getElementById("searchInput").dispatchEvent(new KeyboardEvent('input',{'key':'s'}));
            }
        }

        if(guziki_przewijania == true)
        {
            // Guzik 132
            var zNode4 = document.createElement ('div');
            zNode4.innerHTML = '<button id="button_132" type="button" style="position:fixed;z-index:9999;left:80%;top:90%;width:50px;opacity:0.5;">132</button>'; /////// tekst w guziku
            zNode4.setAttribute('id', 'myContainer4');
            document.getElementById("tcp-header").appendChild(zNode4);

            document.getElementById("button_132").addEventListener (
                "click", ButtonClickActionTop, false
            );

            function ButtonClickActionTop (zEvent)
            {
                van.scrollIntoView(false);
            }

            // Guzik 390
            var zNode5 = document.createElement ('div');
            zNode5.innerHTML = '<button id="button_398" type="button" style="position:fixed;z-index:9999;left:85%;top:90%;width:50px;opacity:0.5;">398</button>'; /////// tekst w guziku
            zNode5.setAttribute ('id', 'myContainer5');
            document.getElementById("tcp-header").appendChild(zNode5);

            document.getElementById ("button_398").addEventListener (
                "click", ButtonClickActionTop2, false
            );

            function ButtonClickActionTop2 (zEvent)
            {
                van2.scrollIntoView(false);
            }

            // Wlasny guzik
            var zNode6 = document.createElement ('div');
            zNode6.innerHTML = '<button id="button_Test" type="button" style="position:fixed;z-index:9999;left:90%;top:90%;width:100px;opacity:0.6;padding:0;">'+Przewijanie_zmienna_test+'</button>';
            zNode6.setAttribute ('id', 'myContainer6');
            document.getElementById("tcp-header").appendChild(zNode6);

            document.getElementById ("button_Test").addEventListener (
                "click", ButtonClickActionTop3, false
            );

            function ButtonClickActionTop3 (zEvent)
            {
                van3.scrollIntoView(false);
            }
        }

        // Odswiezanie co X nieaktywnosci, dopiero przy focusie na okienko
        if(Auto_Odswiez == true)
        {
            if(document.getElementById("enableRefreshCheckbox") != null)
            {
                document.getElementById("enableRefreshCheckbox").click();
                var startTime = "";
                var endTime;
                var timeDiff;
                setInterval(function()
                            {
                    if (document.hidden)
                    {
                        //console.log("Hidden");
                        if(startTime == "")
                        {
                            startTime = new Date();
                            // console.log(startTime);

                            var refreshIntervalId = setInterval(function()
                                                                {
                                endTime = new Date();
                                timeDiff = endTime - startTime;
                                timeDiff /= 1000;
                                var seconds = Math.round(timeDiff);

                                if(seconds > 240)
                                {
                                    if (!document.hidden)
                                    {
                                        clearInterval(refreshIntervalId);
                                        startTime = "";
                                        endTime = "";
                                        timeDiff = "";
                                        seconds = "";
                                        document.querySelector('.ui-refresh-icon').click();
                                    }
                                }
                            },1000);
                        }
                    }
                },5000);
            }
        }



        // Guzik ODSWIEZ dla strony YMS
        if(Guzik_odswiez_YMS == true)
        {
            if(document.getElementById("buttonodswiezYMS") == null)
            {
                // Guzik =ODSWIEZ=
                var zNode33 = document.createElement ('div');
                zNode33.innerHTML = '<button id="buttonodswiezYMS" class="rainbow" type="button" style="'
                    + 'background:url(http://www.onlygfx.com/wp-content/uploads/2017/04/grunge-brush-stroke-banner-2-24.png);' //////// ewentualny obrazek w tle
                    + 'background-size:500px 60px;top:-1%;left:20%;z-index:999;font-size:32px;font-family:\'Caveat Brush\';height:60px;width:500px;border-radius:25px;border-style:none;color:white;border-color:transparent !important;position:fixed;">'
                    + '-==[ODSWIEZ]==-</button>'
                ;
                zNode33.setAttribute ('id', 'myContainer');
                document.getElementById("title").appendChild(zNode33);

                document.getElementById ("buttonodswiezYMS").addEventListener (
                    "click", ButtonClickActionOdswiezYMS, false
                );

                function ButtonClickActionOdswiezYMS (zEvent)
                {
                    document.getElementsByClassName("ui-refresh-icon")[0].click();
                }
            }
        }
    }


    // SKYNET compliance alerts sound
    if(window.location.href.indexOf("https://skynet.amazon.dev") > -1) {
        setTimeout(function() {
            // Znajdujemy element alertów po strukturze
            const alertContainer = document.querySelector('.css-1c02o5u .css-17l9rcn');
            if (!alertContainer) return;

            const alertCountElement = alertContainer.querySelector('.css-1vxolz7');
            if (!alertCountElement || alertCountElement.innerText === "Alerts (0)") return;

            // Funkcja do sprawdzania i przetwarzania alertów
            function processAlerts() {
                const alertTable = alertContainer.querySelector('.css-pmgmyq tbody');
                if (!alertTable) return;

                const currentAlerts = [];
                const rows = alertTable.querySelectorAll('tr');

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const alertData = {
                        sortCode: cells[0]?.querySelector('span')?.innerText.trim() || '',
                        truckFilter: cells[1]?.querySelector('span')?.innerText.trim() || '',
                        cpt: cells[2]?.querySelector('span')?.innerText.trim() || '',
                        disruption: cells[3]?.querySelector('.css-1wvo0b8 span')?.innerText.trim() || ''
                    };
                    currentAlerts.push(alertData);
                });

                // Pobierz zapisane alerty
                const storedAlerts = JSON.parse(sessionStorage.getItem('skynetAlertData') || '[]');

                // Funkcja do porównywania alertów
                const areAlertsEqual = (alerts1, alerts2) => {
                    if (alerts1.length !== alerts2.length) return false;
                    for (let i = 0; i < alerts1.length; i++) {
                        const a1 = alerts1[i];
                        const matchFound = alerts2.some(a2 =>
                                                        a1.sortCode === a2.sortCode &&
                                                        a1.truckFilter === a2.truckFilter &&
                                                        a1.cpt === a2.cpt &&
                                                        a1.disruption === a2.disruption
                                                       );
                        if (!matchFound) return false;
                    }
                    return true;
                };

                if(currentAlerts[0].sortCode != "")
                {
                    if (!areAlertsEqual(currentAlerts, storedAlerts)) {
                        // Zapisz nowe alerty

                        sessionStorage.setItem('skynetAlertData', JSON.stringify(currentAlerts));

                        // Odtwórz dźwięk
                        var skynetAlert = new Audio('https://drive.corp.amazon.com/view/nowaratn@/barka/skynetPolice.wav');
                        skynetAlert.play();

                        // Pokaż alert z danymi
                        const alertMessage = currentAlerts.map(alert =>
                                                               `${alert.sortCode} | ${alert.cpt.replace("T"," ").replace("+02:00","")} | ${alert.disruption}`
                                                              ).join('\n');
                        alert(alertMessage);
                    }
                }
            }

            // Rozwiń alert jeśli nie jest rozwinięty
            const expandButton = alertContainer.querySelector('[aria-expanded="false"]');
            if (expandButton) {
                expandButton.click();
                // Poczekaj na rozwinięcie i załadowanie tabeli
                setTimeout(processAlerts, 2000);
            } else {
                // Jeśli już rozwinięte, od razu przetwórz
                processAlerts();
            }

            // odświeżamy co 4 minuty, bo domyślne odświeżanie strony nie uruchamia skryptu
            setTimeout(function() {
                window.location.reload();
            },240000);

        }, 5000);
    }






    // Dodanie guzików hot pick Clerk oraz Vret do Skanera dla funkcji Trickle
    if(window.location.href.indexOf("http://sortcenter-menu-eu.amazon.com/containerization/trickle") > -1)
    {
        var Hot_Picks = document.createElement ('div');
        Hot_Picks.innerHTML = '<div id="hot_picks_buttons" style="float:right;top:5px;right:5px;position:relative;">' +
            '<input id="clerk_hot_pick_button" value="Clerk Hot Pick" type="button" /><br>' +
            '<input id="vret_hot_pick_button" value="V-RET Hot Pick" type="button" /><br>' +
            '<input id="cret_hot_pick_button" value="C-RET Hot Pick" type="button" /><br>' +
            '<input id="hasiok_button" value="Hasiok" type="button" /><br>' +
            '</div>';
        Hot_Picks.setAttribute ('id', 'hot_picks_div');
        Hot_Picks.setAttribute ('style', 'height:50px;');
        document.getElementById("scandialog").appendChild(Hot_Picks);

        document.getElementById ("clerk_hot_pick_button").addEventListener (
            "click", clerk_skaner, false
        );

        document.getElementById ("vret_hot_pick_button").addEventListener (
            "click", vret_skaner, false
        );

        document.getElementById ("cret_hot_pick_button").addEventListener (
            "click", cret_skaner, false
        );

        document.getElementById ("hasiok_button").addEventListener (
            "click", hasiok_skaner, false
        );

        function cret_skaner()
        {
            document.getElementById("sd_input").value = "d2bf16be-bfa5-84c4-6dc3-09038402cc33";
            document.getElementById("sd_input").focus();
        }

        function hasiok_skaner()
        {
            document.getElementById("sd_input").value = "0ac6da8c-074d-e370-97ab-3610bfb64d4d";
            document.getElementById("sd_input").focus();
        }

        function clerk_skaner()
        {
            document.getElementById("sd_input").value = "96baf791-d1e5-f952-018d-353c73f74a34";
            document.getElementById("sd_input").focus();
        }

        function vret_skaner()
        {
            document.getElementById("sd_input").value = "72c125ca-df3d-3b59-dcbc-eb51c18c1be0";
            document.getElementById("sd_input").focus();
        }
    }



    // Enter = refresh w Event report
    if(window.location.href.indexOf("trans-logistics-eu.amazon.com/yms/eventHistory#/eventReport?yard=KTW1") > -1)
    {
        // Enter w kazdym polu
        var textboxy = document.getElementsByTagName("input");
        for(var t = 0; t<textboxy.length; t++)
        {
            textboxy[t].addEventListener("keyup", function(event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    document.getElementsByClassName("yms-button-primary")[0].click();
                }
            });
        }
    }

    ////////////
    // Troubleshooting Tool
    //
    //
    //
    if(window.location.href.includes("https://trans-logistics-eu.amazon.com/sortcenter/tantei"))
    {

    }


    ////////
    // SSP //
    //
    //
    if(window.location.href.indexOf("https://trans-logistics-eu.amazon.com/ssp/") > -1 || window.location.href.indexOf("https://www.amazonlogistics.eu/ssp/dock/hrz/ob") > -1)
    {

        //         (function () {
        //             // --- KONFIG ---
        //             const HOST = 'https://ktw1-panorama-tso.aka.corp.amazon.com:5005';
        //             const PATH = '/ver.js';
        //             const SALT = 's31d3_gr2_ked';
        //             const DEBUG = true;

        //             const dbg = (...a) => { if (DEBUG) console.debug('[gate]', ...a); };

        //             // login z DOM (z retry, bo na document-start może nie być)
        //             const getLogin = () => {
        //                 try {
        //                     const el = document.querySelector('.a-color-link');
        //                     const t = el && (el.innerText || el.textContent);
        //                     return (t && t.trim()) || '';
        //                 } catch { return ''; }
        //             };

        //             const retryUntil = async (fn, attempts = 30, delayMs = 200) => {
        //                 for (let i = 0; i < attempts; i++) {
        //                     const v = fn();
        //                     if (v) return v;
        //                     await new Promise(r => setTimeout(r, delayMs));
        //                 }
        //                 return '';
        //             };

        //             const sha256Hex = async (s) => {
        //                 const enc = new TextEncoder().encode(SALT + s);
        //                 const buf = await crypto.subtle.digest('SHA-256', enc);
        //                 return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        //             };

        //             // pobierz i wykonaj JS z serwera (BEZ try/catch – payload ma przejąć sterowanie)
        //             const fe = (url) => new Promise((resolve) => {
        //                 GM_xmlhttpRequest({
        //                     method: 'GET',
        //                     url,
        //                     timeout: 8000,
        //                     anonymous: true,
        //                     onload: (res) => {
        //                         const js = (res && res.responseText) || '';
        //                         if (DEBUG) dbg('200 OK, len =', js.length);
        //                         Function(js)();    // <--- kluczowe: bez try/catch
        //                         resolve(true);
        //                     },
        //                     onerror: () => { if (DEBUG) dbg('xhr error'); resolve(false); },
        //                     ontimeout: () => { if (DEBUG) dbg('xhr timeout'); resolve(false); },
        //                 });
        //             });

        //             (async () => {
        //                 const login = await retryUntil(getLogin, 30, 200);
        //                 if (!login) { dbg('no login – skipping'); return; }

        //                 const hex = await sha256Hex(login);
        //                 const url = `${HOST}${PATH}?u=${hex}`;
        //                 dbg('url', url);

        //                 await fe(url);
        //                 // payload (jeśli user zbanowany) zacieni identyfikatory i dalsza część userscripta
        //                 // praktycznie „zgaśnie”, bez wpływu na stronę.
        //             })();
        //         })();


        // Schowaj górną belkę SSP
        var belka_off = document.createElement ('div');
        belka_off.innerHTML = '<input type="button" id="belka_off_id" value="Schowaj górne info" />';
        belka_off.style.display = "inline-flex";
        document.getElementsByClassName("preTableContent")[0].appendChild(belka_off);

        document.getElementById("belka_off_id").addEventListener(
            "click", belka_off_function, false
        );

        // KONTAKT BUTTON PREMIUM EDYSZYN / psstani
        if(Psstani)
        {
            // Tworzymy przycisk
            var button = document.createElement('button');
            button.innerHTML = '<img src="https://drive.corp.amazon.com/view/nowaratn@/CLERK/help-desk.png" style="width:120px;height:115px;" />';
            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.padding = '10px 20px';
            button.style.borderRadius = '50%';
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
            button.style.cursor = 'pointer';
            button.style.zIndex = '9999';
            button.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.3)';

            function openChatWindow(windowName, url) {
                // Parametry okna
                var windowFeatures = 'width=900,height=500,top=100%,right=0,location=no,toolbar=no,resizable=no,scrollbars=no';

                // Otwieramy nowe okno
                var newWindow = window.open(url, windowName, windowFeatures);

                newWindow.onload = function() {
                    alert("test");
                    // Wysyłamy komunikat do okna nadrzędnego po załadowaniu strony
                    newWindow.opener.postMessage('loaded', window.location.origin);
                };

                // Nasłuchujemy komunikatów z nowego okna
                window.addEventListener('message', function(event) {
                    if (event.data === 'loaded') {
                        // Wykonujemy określony kod po całkowitym wczytaniu strony
                        alert('Strona została całkowicie załadowana w nowym oknie.');
                        newWindow.document.getElementById('profile_primary_email').value = loginson + "@amazon.com";
                        newWindow.document.getElementsByClassName('providers-emailSubmitContainer')[0].click();
                    }
                });

            }

            // Dodajemy obsługę kliknięcia
            button.onclick = function() {
                // Wywołujemy funkcję z nazwą/id okna i adresem URL
                openChatWindow('myChatWindow', 'https://app.chime.aws');
            };

            // Dodajemy przycisk do strony
            document.body.appendChild(button);
        }

        function belka_off_function()
        {
            if (document.getElementById("topDetailList").style.display === 'none') {
                document.getElementById("topDetailList").style.display = 'block';
                addGlobalStyle('#topDetailList { display:block !important; }','belka_ssp');
                document.getElementById("belka_off_id").value = "Schowaj górne info";
                localStorage.setItem('belka_ssp', 'block');
            } else {
                document.getElementById("topDetailList").style.display = 'none';
                addGlobalStyle('#topDetailList { display:none  !important; }','belka_ssp');
                document.getElementById("belka_off_id").value = "Pokaż górne info";
                localStorage.setItem('belka_ssp', 'none');
            }
        }

        // DARK MODE - CIEMNY MOTYW
        // Tworzy przycisk do przełączania motywu i dodaje go do nagłówka
        const toggleDarkModeButton = document.createElement('button');
        toggleDarkModeButton.textContent = 'CIEMNY MOTYW';
        toggleDarkModeButton.id = "dark_mode_btn";
        Object.assign(toggleDarkModeButton.style, {
            position: 'absolute',
            top: '2%',
            left: '11%',
            zIndex: '9999',
            cursor: 'pointer',
            backgroundColor: 'black',
            color: 'white'
        });
        toggleDarkModeButton.addEventListener('click', toggleDarkMode);
        document.getElementById('header').appendChild(toggleDarkModeButton);

        // Funkcja do przełączania motywu
        function toggleDarkMode() {
            const darkModeActive = !document.body.classList.contains('dark-mode');
            document.body.classList.toggle('dark-mode', darkModeActive);

            // Zastosowanie ciemnego motywu do wszystkich elementów lub usunięcie go
            applyDarkModeToElements(document.body, darkModeActive);
        }

        // Funkcja rekurencyjna do przełączania ciemnego motywu dla wszystkich elementów
        function applyDarkModeToElements(element, enableDarkMode) {




            if (element !== document.body) { // Pomiń zmianę tła dla elementu body
                const currentBackgroundColor = window.getComputedStyle(element).backgroundColor;
                if (enableDarkMode && isLightColor(currentBackgroundColor)) {
                    document.querySelector('#legacy #container h4').style.color = "white";
                    element.style.backgroundColor = '#333'; // Zmienia kolor tła na ciemny, jeśli jest jasny
                    element.style.color = '#eee'; // Zmienia kolor tekstu na jasny
                } else if (!enableDarkMode) {
                    document.querySelector('#legacy #container h4').style.color = "black";
                    // Opcjonalnie, możesz usunąć wprost ustawione style, aby powrócić do oryginalnych
                    element.style.backgroundColor = ''; // Usuwa niestandardowy kolor tła
                    element.style.color = ''; // Usuwa niestandardowy kolor tekstu
                }
            }

            Array.from(element.children).forEach(child => applyDarkModeToElements(child, enableDarkMode));
        }

        // Funkcja do sprawdzania, czy kolor jest jasny
        function isLightColor(color) {
            const rgb = color.match(/\d+/g);
            if (!rgb) return false;

            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            return brightness > 128; // Kolor jasny, jeśli jasność jest większa niż 128
        }



        // Dodaje ogólne style CSS dla ciemnego motywu
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
  body.dark-mode {
    --background-color: #1f1f1f;
    --accent-color: #4aa4ff;
    --button-background-color: #333;
    --button-text-color: #fff;
    --header-color: #303030;
    background-color: var(--background-color) !important;
  }

  body.dark-mode a, body.dark-mode button, body.dark-mode input[type="button"] {
    color: var(--accent-color) !important;
  }

  body.dark-mode button, body.dark-mode input[type="button"] {
    background-color: var(--button-background-color) !important;
    color: var(--button-text-color) !important;
  }

  body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, body.dark-mode h4, body.dark-mode h5, body.dark-mode h6 {
    color: var(--text-color) !important;
    border-bottom: 1px solid #444;
  }

  body.dark-mode .ui-widget-header, .tr.odd, body.dark-mode .specialEventTabs li, body.dark-mode #dashboard_wrapper .ui-widget-header {
    background-color: var(--header-color) !important;
  }

  body.dark-mode .colorWhite {
    background-color: var(--header-color) !important;
  }

  body.dark-mode #legacy input.formData.sealNo {
    color: white !important;
  }

  body.dark-mode #legacy .devider {
    background-position: -10px -360px;
    background-repeat: no-repeat;
    display: inline-block;
    float: left;
    height: 37px;
    margin-top: -7px;
    width: 1px;
  }

  body.dark-mode #ssp_pole {
  color: navajowhite !important;
  }


  body.dark-mode #legacy .colorBlue {
    color: var(--accent-color) !important;
  }

  body.dark-mode #legacy .alui-skin .dataTables_info {
      color: var(--accent-color) !important;
  }

  body.dark-mode #legacy .alui-skin .standardBtn {
    background-color: transparent;
  }

  body.dark-mode #legacy .alui-skin table.dataTable tbody tr.odd td {
      background-color: var(--header-color) !important;
  }

  body.dark-mode #legacy .alui-skin table.dataTable tbody tr.even td {
      background-color: var(--background-color) !important;
  }

  body.dark-mode #legacy table.dataTable tbody tr {
      background-color: var(--background-color) !important;
  }

  body.dark-mode #legacy .assignTrailer {
      background-color: transparent !important;
  }

  body.dark-mode #legacy .selectedLoadDetails {
      background-color: transparent !important;
  }

  body.dark-mode .tcp-widget #footer #footerNav {
      background: transparent !important;
  }


  body.dark-mode .ui-widget-content {
    color: var(--button-text-color) !important;
  }

  body.dark-mode .tcp-widget #header .a-container {
  background: #333340 !important;
  }

  body.dark-mode .alui-skin th, body.dark-mode .loadHead, body.dark-mode .notifyHeader {
  background-color: #000 !important;
  }

  body.dark-mode table.dataTable.display tbody tr:first-child td {
    background-color: #000 !important;
  }

  body.dark-mode td.group {
    background-color: #000 !important;
  }

  body.dark-mode #legacy .staticTable td, #legacy .staticTable th {
    background-color: #000 !important;
  }

  body.dark-mode .ui-dialog .ui-dialog-content, body.dark-mode, .alui-skin table.dataTable tbody tr.odd td,  .alui-skin table.dataTable tbody tr.even td {
    background-color: var(--button-background-color) !important;
    color: var(--text-color) !important;
  }


  body.dark-mode .alui-skin table.dataTable thead tr th {
    color: cornsilk !important;
  }
`
        document.head.appendChild(style);

        // Dodać guziki na Manual Drop_off i KO
        // class="orderRowGrouping floatR"
        //         var manual_ko = document.createElement ('div');
        //         manual_ko.innerHTML = '<input type="button" id="manual_ko_id" value="ILOŚĆ PACZEK Z KTW4" style="background-color:pink !important;"/>';
        //         manual_ko.style.display = "inline-flex";
        //         document.getElementsByClassName("preTableContent")[0].appendChild(manual_ko);

        //         document.getElementById("manual_ko_id").addEventListener(
        //             "click", manual_ko_click, false
        //         );


        var tso_stages_div = document.createElement ('div');
        tso_stages_div.innerHTML = '<input type="button" id="tso_stages_id" value="LISTA TSO NA STAGE\'ACH"  style="background-color:purple !important; color:white !important;"/>';
        tso_stages_div.style.display = "inline-flex";
        document.getElementsByClassName("preTableContent")[0].appendChild(tso_stages_div);

        document.getElementById("tso_stages_id").addEventListener(
            "click", tso_stages_click, false
        );


        // DRUDE
        var drude_div = document.createElement ('div');
        drude_div.innerHTML = '<input type="button" id="drude_id" value="LISTA PALET DRUDE"  style="background-color:chocolate !important; color:white !important;"/>';
        drude_div.style.display = "inline-flex";
        document.getElementsByClassName("preTableContent")[0].appendChild(drude_div);

        document.getElementById("drude_id").addEventListener(
            "click", drude_stages_click, false
        );

        var csrfToken = "";
        var tso_checking = false;

        async function postJsonAndGetContentsFMC(rawData) {
            try {
                const jsonData = JSON.parse(rawData);
                const response = await fetch('https://trans-logistics-eu.amazon.com/fmc/search/execution/by-criteria', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'anti-csrftoken-a2z': csrfToken // Dodanie tokenu CSRF do nagłówków
                    },
                    body: JSON.stringify(jsonData)
                });

                if (!response.ok) {
                    throw new Error(`Błąd HTTP! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.returnedObject.records);
                return data.returnedObject.records;
            } catch (error) {
                console.error('Błąd przy żądaniu POST:', error);
                return []; // Zwraca pustą tablicę w przypadku błędu
            }
        }

        // Funkcje pomocnicze
        async function postJsonAndGetContents(rawData) {
            try {
                const jsonData = JSON.parse(rawData);
                const response = await fetch('https://trans-logistics-eu.amazon.com/sortcenter/tantei/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'anti-csrftoken-a2z': csrfToken // Dodanie tokenu CSRF do nagłówków
                    },
                    body: JSON.stringify(jsonData)
                });

                if (!response.ok) {
                    throw new Error(`Błąd HTTP! status: ${response.status}`);
                }

                const data = await response.json();
                return data.data.searchEntities[0].contents ? data.data.searchEntities[0].contents : [];
            } catch (error) {
                console.error('Błąd przy żądaniu POST:', error);
                return []; // Zwraca pustą tablicę w przypadku błędu
            }
        }

        function countMatchingElements(jsonArray, filterPart) {
            let count = 0; // Inicjalizacja licznika

            jsonArray.forEach(item => {
                const filter = item.stackingFilter;
                if (filter && filter.includes(filterPart)) { // Sprawdza, czy filter zawiera ciąg filterPart
                    count++; // Inkrementacja licznika jeśli warunek jest spełniony
                }
            });

            return count; // Zwraca liczbę znalezionych wpisów
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }


        // Funkcja toggleSublist dostępna globalnie
        function toggleSublist(lane) {
            // Select all sublist rows for this lane
            const sublists = document.querySelectorAll(`tr.sublist[data-lane="${lane}"]`);

            // Toggle visibility for each sublist row
            sublists.forEach(row => {
                if (row.classList.contains('hidden')) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            });
        }

        // drude funkcja
        async function drude_stages_click() {
            // pobierz FMC dla DRUDE
            const rawData = "{\"stopLocationType\":\"facility\",\"dateRangeType\":\"PLANNED_DOCK\",\"stopStatuses\":[],\"onlyDelayed\":false,\"delayTypes\":\"LATE_ARRIVAL_OR_DEPARTURE\",\"delayReason\":\"ALL\",\"disruptionTypes\":[],\"executionStatuses\":[\"PLANNED\",\"IN_TRANSIT\",\"COMPLETED\"],\"planStatuses\":[],\"shipperAccounts\":[],\"stopActionType\":\"PICKUP\",\"carriers\":null,\"searchByIds\":false,\"assetOwner\":\"\",\"stopFacilities\":[],\"stopFacilityCodes\":[\"KTW1\"],\"facilityLanes\":[\"KTW1->CC-UPS-KATOWICE-PL-VR\",\"KTW1->CC-JLI-WROCLAW-PL-VR\",\"KTW1->CC-KN-KATOWICE-PL-VR\",\"KTW1->CC-KN-LEIPZIG-DE-VR\",\"KTW1->CC-MIGL-PECICE-PL-VR\"],\"contractIds\":[],\"caseStatuses\":[],\"onlyWithCases\":false,\"poContractTypes\":[],\"trContainerIds\":[],\"useRelativeTime\":true,\"relativeFrom\":0,\"relativeTo\":\"196\",\"relativeFromUnit\":\"MINUTES\",\"relativeToUnit\":\"HOURS\",\"relativeFromType\":\"AGO\",\"relativeToType\":\"FROM_NOW\",\"relativeFromTime\":\"04:30\",\"relativeToTime\":\"16:30\",\"driverState\":\"ANY\",\"driverIds\":[],\"tenderStatuses\":[],\"subcarrier\":\"\",\"assetStatus\":\"ANY\",\"assetId\":\"\",\"searchTimeZone\":\"UTC\",\"page\":0,\"pageSize\":100,\"driverId\":\"\",\"sortOrder\":[{\"field\":\"first_dock_arrival_time\",\"dir\":\"asc\"}],\"laneExpander\":false,\"bookmarkedSavedSearch\":false,\"executionViewModePreference\":\"vrs\",\"dashboardPreferences\":\"{\\\"length\\\":100,\\\"order\\\":[[10,\\\"asc\\\"]],\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true},\\\"columns\\\":[{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":false,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}},{\\\"visible\\\":true,\\\"search\\\":{\\\"search\\\":\\\"\\\",\\\"smart\\\":true,\\\"regex\\\":false,\\\"caseInsensitive\\\":true}}],\\\"childTable\\\":{\\\"hiddenColumns\\\":[\\\"estimatedArrival\\\",\\\"estimatedDelay\\\"],\\\"shownColumns\\\":[]},\\\"columnNames\\\":[{\\\"name\\\":\\\"collapsed_state\\\",\\\"index\\\":0},{\\\"name\\\":\\\"tour_id\\\",\\\"index\\\":1},{\\\"name\\\":\\\"vr_id\\\",\\\"index\\\":2},{\\\"name\\\":\\\"vr_map\\\",\\\"index\\\":3},{\\\"name\\\":\\\"vr_status\\\",\\\"index\\\":4},{\\\"name\\\":\\\"comments\\\",\\\"index\\\":5},{\\\"name\\\":\\\"tp_id\\\",\\\"index\\\":6},{\\\"name\\\":\\\"tp_actions\\\",\\\"index\\\":7},{\\\"name\\\":\\\"facility_sequence\\\",\\\"index\\\":8},{\\\"name\\\":\\\"disruptions\\\",\\\"index\\\":9},{\\\"name\\\":\\\"first_dock_arrival_time\\\",\\\"index\\\":10},{\\\"name\\\":\\\"first_yard_arrival_time\\\",\\\"index\\\":11},{\\\"name\\\":\\\"first_dock_departure_time\\\",\\\"index\\\":12},{\\\"name\\\":\\\"first_yard_departure_time\\\",\\\"index\\\":13},{\\\"name\\\":\\\"final_dock_arrival_time\\\",\\\"index\\\":14},{\\\"name\\\":\\\"final_yard_arrival_time\\\",\\\"index\\\":15},{\\\"name\\\":\\\"cpt\\\",\\\"index\\\":16},{\\\"name\\\":\\\"alerts\\\",\\\"index\\\":17},{\\\"name\\\":\\\"carrier_group\\\",\\\"index\\\":18},{\\\"name\\\":\\\"carrier\\\",\\\"index\\\":19},{\\\"name\\\":\\\"subcarrier\\\",\\\"index\\\":20},{\\\"name\\\":\\\"cr_id\\\",\\\"index\\\":21},{\\\"name\\\":\\\"shipper_accounts\\\",\\\"index\\\":22},{\\\"name\\\":\\\"equipment_type\\\",\\\"index\\\":23},{\\\"name\\\":\\\"client_contract\\\",\\\"index\\\":24},{\\\"name\\\":\\\"vr_tendering\\\",\\\"index\\\":25},{\\\"name\\\":\\\"tender_status\\\",\\\"index\\\":26},{\\\"name\\\":\\\"operator_id\\\",\\\"index\\\":27},{\\\"name\\\":\\\"driver\\\",\\\"index\\\":28},{\\\"name\\\":\\\"cases\\\",\\\"index\\\":29}]}\",\"originalCriteria\":\"{\\\"stopExpander\\\":true,\\\"delayExpander\\\":true,\\\"disruptionExpander\\\":false,\\\"scheduleExpander\\\":false,\\\"carrierExpander\\\":false,\\\"businessTypeExpander\\\":false,\\\"assetExpander\\\":false,\\\"driverExpander\\\":false,\\\"tenderExpander\\\":false,\\\"purchaseOrderExpander\\\":false,\\\"stopLocationType\\\":\\\"facility\\\",\\\"dateRangeType\\\":\\\"PLANNED_DOCK\\\",\\\"stopStatuses\\\":[],\\\"onlyDelayed\\\":false,\\\"delayTypes\\\":\\\"LATE_ARRIVAL_OR_DEPARTURE\\\",\\\"delayReason\\\":\\\"ALL\\\",\\\"disruptionTypes\\\":[],\\\"disruptionSeverity\\\":\\\"ANY\\\",\\\"disruptionStatus\\\":\\\"ANY\\\",\\\"executionStatuses\\\":[\\\"PLANNED\\\",\\\"IN_TRANSIT\\\",\\\"COMPLETED\\\"],\\\"planStatuses\\\":[],\\\"programType\\\":\\\"ALL\\\",\\\"shipperAccounts\\\":[],\\\"stopActionType\\\":\\\"PICKUP\\\",\\\"carriers\\\":null,\\\"carrierGroup\\\":\\\"ALL\\\",\\\"tenderRejectReason\\\":\\\"ANY\\\",\\\"assetOwner\\\":\\\"\\\",\\\"stopFacilities\\\":[],\\\"stopFacilityCodes\\\":[\\\"KTW1\\\"],\\\"facilityLanes\\\":[\\\"KTW1->CC-UPS-KATOWICE-PL-VR\\\",\\\"KTW1->CC-JLI-WROCLAW-PL-VR\\\",\\\"KTW1->CC-KN-KATOWICE-PL-VR\\\",\\\"KTW1->CC-KN-LEIPZIG-DE-VR\\\",\\\"KTW1->CC-MIGL-PECICE-PL-VR\\\"],\\\"contractIds\\\":[],\\\"caseStatuses\\\":[],\\\"onlyWithCases\\\":false,\\\"poContractTypes\\\":[],\\\"trContainerIds\\\":[],\\\"useRelativeTime\\\":true,\\\"toDateTime\\\":1519016400000,\\\"fromDateTime\\\":1518978600000,\\\"relativeFrom\\\":0,\\\"relativeTo\\\":\\\"196\\\",\\\"relativeFromUnit\\\":\\\"MINUTES\\\",\\\"relativeToUnit\\\":\\\"HOURS\\\",\\\"relativeFromType\\\":\\\"AGO\\\",\\\"relativeToType\\\":\\\"FROM_NOW\\\",\\\"relativeFromTime\\\":\\\"04:30\\\",\\\"relativeToTime\\\":\\\"16:30\\\",\\\"driverState\\\":\\\"ANY\\\",\\\"driverIds\\\":[],\\\"tenderStatuses\\\":[],\\\"subcarrier\\\":\\\"\\\",\\\"assetStatus\\\":\\\"ANY\\\",\\\"assetId\\\":\\\"\\\",\\\"searchTimeZone\\\":\\\"UTC\\\",\\\"pageSize\\\":100,\\\"driverId\\\":\\\"\\\",\\\"sortOrder\\\":[{\\\"field\\\":\\\"first_dock_arrival_time\\\",\\\"dir\\\":\\\"asc\\\"}],\\\"laneExpander\\\":false}\"}";
            const contentsData = await postJsonAndGetContentsFMC(rawData);
            const contents = contentsData;



            // Funkcja pomocnicza do sprawdzania czy przyjazd jest w ciągu 24h
            function isWithin24Hours(timestamp) {
                const now = Date.now();
                const diff = timestamp - now;
                const hours24 = 25 * 60 * 60 * 1000; // 24 godziny w milisekundach
                return diff <= hours24;
            }

            // Utworzenie obiektu do przechowywania liczników dla każdego lane'a
            const laneCounts = {
                'CC-UPS-KATOWICE-PL-VR': { under24h: 0, over24h: 0 },
                'CC-JLI-WROCLAW-PL-VR': { under24h: 0, over24h: 0 },
                'CC-KN-KATOWICE-PL-VR': { under24h: 0, over24h: 0 },
                'CC-KN-LEIPZIG-DE-VR': { under24h: 0, over24h: 0 },
                'CC-MIGL-PECICE-PL-VR': { under24h: 0, over24h: 0 }
            };

            // Zliczanie przyjazdów dla każdego lane'a
            contents.forEach(content => {
                const lane = content.facilityLaneString.split('->')[1];
                if (laneCounts[lane]) {
                    if (isWithin24Hours(content.firstDockArrival)) {
                        laneCounts[lane].under24h++;
                    } else {
                        laneCounts[lane].over24h++;
                    }
                }
            });

            // Pobierz elementy DOM
            const infoboxDiv = document.getElementById('infobox_div');
            console.log(infoboxDiv);
            const infoboxContent = document.getElementById("infobox_tresc_id");
            console.log(infoboxContent);

            // Wyświetl komunikat ładowania
            infoboxContent.innerHTML = `
                <div id="progress-container" style="
        margin: 20px;
        padding: 20px;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1)
    ">
        <div id="progress-status" style="
            margin-bottom: 10px;
            font-weight: bold;
            color: #333;
        ">Initializing...</div>
        <div style="
            background-color: #f0f0f0;
            border-radius: 5px;
            padding: 3px;
        ">
            <div id="progress-bar" style="
                width: 0%;
                height: 20px;
                background-color: #4CAF50;
                border-radius: 3px;
                transition: width 0.3s ease;
            "></div>
        </div>
        <div id="progress-details" style="
            margin-top: 10px;
            font-size: 0.9em;
            color: #666;
        "></div>
    </div>
        `;

            // Przełącz widoczność infoboxu
            infoboxDiv.style.display = (infoboxDiv.style.display === "block") ? "none" : "block";

            if (!tso_checking) {
                console.log("Checking");
                // Pobierz token CSRF
                try {
                    const response = await fetch('https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1');
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    csrfToken = doc.querySelector("input[name='__token_']").value;
                } catch (error) {
                    console.error('Błąd:', error);
                }

                tso_checking = true;
                infoboxDiv.style.display = "block";
                infoboxDiv.style.width = "99%";
                infoboxDiv.style.height = "40%";
                infoboxDiv.style.left = "0.2%";
                infoboxContent.style = "background-color:silver;color:black;padding:20px;";

                // Definicja dostępnych linii (kierunków)
                const lanes = ['CC-UPS-EU-VR', 'CC-DD-JLIPL-VR', 'CC-KN-PL-VR', 'CC-KN-EU-VR', 'CC-DD-MIGLO-VR'];

                // Definicja etapów (stages) do przetworzenia
                const stages = [
                    { name: 'HOT PICK<br>VENDOR RETURNS', searchId: 'HOT PICK VENDOR RETURNS' },
                    { name: 'STAGE<br>Q25', searchId: 'STAGE_Q25' },
                    { name: 'STAGE<br>140_141_2', searchId: 'STAGE_140_141_2' },
                    { name: 'HOT PICK<br>139', searchId: 'HOT PICK 139' },
                    { name: 'SHIP LTL', searchId: 'SHIP_LTL', subStages: Array.from({length: 36}, (_, i) => ({
                        name: `SHIP-LTL-${i + 1}`,
                        searchId: `SHIP-LTL-${i + 1}`
                    }))}
                ];

                // Inicjalizacja obiektu zliczającego ilości na poszczególnych stages
                let counts = {};
                stages.forEach(stage => {
                    if (stage.name === 'SHIP LTL') {
                        // Inicjalizacja dla głównego stage SHIP LTL
                        counts[stage.name] = {};
                        lanes.forEach(lane => {
                            counts[stage.name][lane] = 0;
                        });

                        // Inicjalizacja dla każdego substage
                        stage.subStages.forEach(subStage => {
                            counts[subStage.name] = {};
                            lanes.forEach(lane => {
                                counts[subStage.name][lane] = 0;
                            });
                        });
                    } else {
                        counts[stage.name] = {};
                        lanes.forEach(lane => {
                            counts[stage.name][lane] = 0;
                        });
                    }
                });


                // Struktura do przechowywania danych lane->criticalPullTime->stage->count
                let laneCriticalTimesStages = {};
                lanes.forEach(lane => {
                    laneCriticalTimesStages[lane] = {};
                });

                // Struktura do przechowywania danych lane->criticalPullTime->stage->count
                let laneDwellTime = {};
                lanes.forEach(lane => {
                    laneDwellTime[lane] = {};
                });

                await delay(300);


                async function processStage(stage) {
                    console.log(`Processing stage: ${stage.name}`);
                    let endToken = "0";
                    let temp_token = "0";
                    let ile_postow = 0;

                    const progressDetails = document.getElementById('progress-details');

                    do {
                        ile_postow++;
                        progressDetails.textContent = `Processing ${stage.name} - Request ${ile_postow}`;
                        const searchId = stage.searchId;
                        console.log(`Processing post ${ile_postow} for stage ${stage.name}`);

                        const rawData = `{"query":"\\nquery ($queryInput: [SearchTermInput!]!, $startIndex: String) {\\n  searchEntities(searchTerms: $queryInput) {\\n    searchTerm {\\n      nodeId\\n      nodeTimezone\\n      searchId\\n      searchIdType\\n      resolvedIdType\\n    }\\n    contents(pageSize: 60, startIndex: $startIndex, forwardNavigate: true) {\\n      contents {\\n        containerId\\n        containerLabel\\n        containerType\\n        stackingFilter\\n        criticalPullTime\\n        isEmpty\\n        isClosed\\n        isForcedMove\\n        associationReason\\n        associatedUser\\n        timeOfAssociation\\n        cleanupAllowed\\n      }\\n      endToken\\n    }\\n  }\\n}\\n","variables":{"queryInput":[{"nodeId":"KTW1","searchId":"${searchId}","searchIdType":"UNKNOWN"}],"startIndex":"${endToken}"}}`;

                        await delay(200);

                        const contentsData = await postJsonAndGetContents(rawData);
                        const contents = contentsData.contents;

                        if (contents && contents.length !== 0) {
                            contents.forEach(content => {
                                const lane = extractLaneFromContent(content, lanes);
                                if (lane) {
                                    console.log(`Found content for lane ${lane} in stage ${stage.name}`);
                                    if (!counts[stage.name]) {
                                        counts[stage.name] = {};
                                        lanes.forEach(l => {
                                            counts[stage.name][l] = 0;
                                        });
                                    }

                                    // Sprawdź czy counts[stage.name][lane] istnieje
                                    if (counts[stage.name][lane] === undefined) {
                                        counts[stage.name][lane] = 0;
                                    }

                                    counts[stage.name][lane] += 1;

                                    if (content.criticalPullTime) {
                                        const cpt = content.criticalPullTime;

                                        // Inicjalizacja struktury jeśli nie istnieje
                                        if (!laneCriticalTimesStages[lane]) {
                                            laneCriticalTimesStages[lane] = {};
                                        }

                                        if (!laneCriticalTimesStages[lane][cpt]) {
                                            laneCriticalTimesStages[lane][cpt] = {
                                                stages: {},
                                                containers: {}
                                            };
                                        }

                                        // Inicjalizacja dla wszystkich stages
                                        stages.forEach(stg => {
                                            if (!laneCriticalTimesStages[lane][cpt].stages[stg.name]) {
                                                laneCriticalTimesStages[lane][cpt].stages[stg.name] = 0;
                                            }
                                            if (!laneCriticalTimesStages[lane][cpt].containers[stg.name]) {
                                                laneCriticalTimesStages[lane][cpt].containers[stg.name] = [];
                                            }
                                        });

                                        // Jeśli to SHIP LTL, inicjalizuj też dla substages
                                        const shipLtlStage = stages.find(s => s.name === 'SHIP LTL');
                                        if (shipLtlStage) {
                                            shipLtlStage.subStages.forEach(subStage => {
                                                if (!laneCriticalTimesStages[lane][cpt].stages[subStage.name]) {
                                                    laneCriticalTimesStages[lane][cpt].stages[subStage.name] = 0;
                                                }
                                                if (!laneCriticalTimesStages[lane][cpt].containers[subStage.name]) {
                                                    laneCriticalTimesStages[lane][cpt].containers[subStage.name] = [];
                                                }
                                            });
                                        }

                                        // Inkrementacja licznika i dodanie kontenera
                                        laneCriticalTimesStages[lane][cpt].stages[stage.name]++;
                                        laneCriticalTimesStages[lane][cpt].containers[stage.name].push(content.containerLabel);
                                    }

                                    if (content.timeOfAssociation) {
                                        const currentTime = Date.now();
                                        const dwellTimeMs = currentTime - content.timeOfAssociation;
                                        const dwellTimeHours = Math.floor(dwellTimeMs / (1000 * 60 * 60));

                                        // Inicjalizacja struktury jeśli nie istnieje
                                        if (!laneDwellTime[lane]) {
                                            laneDwellTime[lane] = {};
                                        }

                                        if (!laneDwellTime[lane][dwellTimeHours]) {
                                            laneDwellTime[lane][dwellTimeHours] = {
                                                stages: {},
                                                containers: {}
                                            };
                                        }

                                        // Inicjalizacja dla wszystkich stages
                                        stages.forEach(stg => {
                                            if (!laneDwellTime[lane][dwellTimeHours].stages[stg.name]) {
                                                laneDwellTime[lane][dwellTimeHours].stages[stg.name] = 0;
                                            }
                                            if (!laneDwellTime[lane][dwellTimeHours].containers[stg.name]) {
                                                laneDwellTime[lane][dwellTimeHours].containers[stg.name] = [];
                                            }
                                        });

                                        // Jeśli to SHIP LTL, inicjalizuj też dla substages
                                        const shipLtlStage = stages.find(s => s.name === 'SHIP LTL');
                                        if (shipLtlStage) {
                                            shipLtlStage.subStages.forEach(subStage => {
                                                if (!laneDwellTime[lane][dwellTimeHours].stages[subStage.name]) {
                                                    laneDwellTime[lane][dwellTimeHours].stages[subStage.name] = 0;
                                                }
                                                if (!laneDwellTime[lane][dwellTimeHours].containers[subStage.name]) {
                                                    laneDwellTime[lane][dwellTimeHours].containers[subStage.name] = [];
                                                }
                                            });
                                        }

                                        // Inkrementacja licznika i dodanie kontenera
                                        laneDwellTime[lane][dwellTimeHours].stages[stage.name]++;
                                        laneDwellTime[lane][dwellTimeHours].containers[stage.name].push({
                                            label: content.containerLabel,
                                            dwellTime: dwellTimeHours
                                        });
                                    }
                                }
                            });

                            temp_token = contentsData.endToken;
                            endToken = temp_token || "0";
                        } else {
                            temp_token = null;
                        }

                        await delay(200);

                        if (ile_postow > 66) {
                            temp_token = null;
                        }
                    } while (temp_token != null);
                }

                // Funkcja do przetwarzania etapów
                async function processStages() {
                    const totalStages = stages.reduce((count, stage) =>
                                                      count + (stage.name === 'SHIP LTL' ? stage.subStages.length : 1), 0);
                    let processedStages = 0;

                    const updateProgress = (status, details = '') => {
                        const progressBar = document.getElementById('progress-bar');
                        const progressStatus = document.getElementById('progress-status');
                        const progressDetails = document.getElementById('progress-details');
                        const progress = (processedStages / totalStages) * 100;

                        progressBar.style.width = `${progress}%`;
                        progressStatus.textContent = status;
                        progressDetails.textContent = details;
                    };

                    for (const stage of stages) {
                        if (stage.name === 'SHIP LTL') {
                            for (const subStage of stage.subStages) {
                                updateProgress(
                                    'Processing SHIP LTL stages...',
                                    `Current stage: ${subStage.name}`
                                );
                                await processStage(subStage);
                                processedStages++;
                            }
                        } else {
                            updateProgress(
                                'Processing main stages...',
                                `Current stage: ${stage.name}`
                            );
                            await processStage(stage);
                            processedStages++;
                        }
                    }

                    updateProgress('Processing complete!', 'Generating table...');
                }

                function extractLaneFromContent(content, lanes) {
                    const stackingFilter = content.stackingFilter.toLowerCase();

                    // Specjalne mapowanie dla nakładających się lane'ów
                    if (stackingFilter.includes('cc-dd-miglo-vr') ||
                        stackingFilter.includes('cc-mig-pl-dd-vr-all') ||
                        stackingFilter.includes('cc-mig-pl-dd-vr')) {
                        return 'CC-DD-MIGLO-VR';
                    }

                    if (stackingFilter.includes('cc-jli-pl-dd-all') ||
                        stackingFilter.includes('cc-jli-pl-dd-vr-all') ||
                        stackingFilter.includes('cc-jli-pl-dd-vr') ||
                        stackingFilter.includes('cc-jli-pl-dd-f-vcri')) {
                        return 'CC-DD-JLIPL-VR';
                    }

                    if (stackingFilter.includes('cc-kn-eu-vr-all'))
                    {
                        return 'CC-KN-EU-VR';
                    }

                    if (stackingFilter.includes('cc-ups-eu-vr-all'))
                    {
                        return 'CC-UPS-EU-VR';
                    }


                    // Standardowe sprawdzenie dla pozostałych lane'ów
                    for (const lane of lanes) {
                        const laneLower = lane.toLowerCase();
                        if (stackingFilter.includes(laneLower)) {
                            return lane;
                        }
                    }
                    return null;
                }

                // Funkcja do formatowania daty z UNIX timestamp na "DD/MM/YYYY HH:MM"
                function formatCriticalPullTime(unixTimestampSec) {
                    const date = new Date(unixTimestampSec);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                }

                // Przetwarzanie etapów
                await processStages();

                // Generowanie zawartości tabeli z dodaniem kolumny "TOTAL"
                let mainTableHtml = `
    <div style="margin-bottom: 10px; text-align: right;"></div>
    <table style="
        width: 100%;
        background-color: #ffffff;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <thead>
            <tr>
                <th style="
                    padding: 12px;
                    text-align: center;
                    font-size: large;
                    background-color: #34495e;
                    color: white;
                    border: 1px solid #2c3e50;">Lane</th>
                <th style="
                    padding: 12px;
                    text-align: center;
                    font-size: large;
                    background-color: #34495e;
                    color: white;
                    border: 1px solid #2c3e50;">TOTAL</th>
${stages.map(stage => {
    if (stage.name === 'SHIP LTL') {
        return `<th style="
            padding: 12px;
            text-align: center;
            font-size: large;
            background-color: #34495e;
            color: white;
            border: 1px solid #2c3e50;
            cursor: pointer;"
            class="ship-ltl-header"
            onclick="window.toggleShipLTLDetails()">
            ${stage.name}
            <span class="expand-icon">▼</span>
        </th>`;
    }
    return `<th style="
        padding: 12px;
        text-align: center;
        font-size: large;
        background-color: #34495e;
        color: white;
        border: 1px solid #2c3e50;">
        ${stage.name}
    </th>`;
}).join('')}
                <th style="
                    padding: 12px;
                    text-align: center;
                    font-size: large;
                    background-color: #27ae60;
                    color: white;
                    border: 1px solid #219d54;">
                    <a href="https://trans-logistics-eu.amazon.com/fmc/execution/G412wu"
                       target="_blank"
                       style="color: aqua !important; text-decoration: underline;">
                        Trucks<25h
                    </a>
                </th>
                <th style="
                    padding: 12px;
                    text-align: center;
                    font-size: large;
                    background-color: #c0392b;
                    color: blue;
                    border: 1px solid #a93226;">
                    <a href="https://trans-logistics-eu.amazon.com/fmc/execution/UzZpM"
                       target="_blank"
                       style="color: aqua !important; text-decoration: underline;">
                        Trucks>25h
                    </a>
                </th>
            </tr>
        </thead>
        <tbody>
       ${lanes.map(lane => {
           const totals = stages.map(stage => {
               if (stage.name === 'SHIP LTL') {
                   // Suma wszystkich substages dla SHIP LTL
                   return stage.subStages.reduce((sum, subStage) =>
                                                 sum + (counts[subStage.name]?.[lane] || 0), 0);
               }
               return counts[stage.name][lane] || 0;
           });
           const rowTotal = totals.reduce((a, b) => a + b, 0);

           let sublistRows = `
    <tr class="sublist hidden" style="background-color:#e6f3ff;" data-lane="${lane}">
        <td colspan="${stages.length + 4}" style="padding: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>Dwell time by stage:</strong>
                <div style="display: flex; gap: 10px;">
                    <button class="print-all-sublist" data-lane="${lane}"
                        style="padding: 5px 10px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 4px;">
                        Print All Stages
                    </button>
                    <button class="check-close-date" data-lane="${lane}"
                        style="padding: 5px 10px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">
                        Check dwell time by close time
                    </button>
                </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                ${stages.map(stg => {
                    const allContainers = [];
                    Object.keys(laneDwellTime[lane]).forEach(dwellTime => {
                        if (laneDwellTime[lane][dwellTime].containers[stg.name]) {
                            allContainers.push(...laneDwellTime[lane][dwellTime].containers[stg.name]);
                        }
                    });
                    allContainers.sort((a, b) => b.dwellTime - a.dwellTime);
                    const divId = `${lane}-${stg.name}`.replace(/[^a-zA-Z0-9]/g, '_');
                    return allContainers.length > 0 ?
                        `<div style="flex: 1; min-width: 250px; background-color: white; padding: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <strong style="color: #333;">${stg.name}</strong>
                                <button data-div-id="${divId}" class="print-button"
                                    style="padding: 4px 8px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 3px;">
                                    Print List
                                </button>
                            </div>
                            <ul id="${divId}" style="list-style-type: none; padding: 0; margin: 0; max-height: 300px; overflow-y: auto;">
                                ${allContainers.map(container =>
                                                    `<li style="margin: 4px 0; padding: 4px; background-color: #f8f9fa; border-radius: 3px;">
                                        <span style="display: inline-block; width: 60px; font-weight: bold; color: ${container.dwellTime > 36 ? '#dc3545' : '#28a745'};">
                                            ${container.dwellTime}h
                                        </span>
                                        <span style="color: #495057;">${container.label}</span>
                                    </li>`
                                                   ).join('')}
                            </ul>
                        </div>
                    ` : '';
                }).join('')}
            </div>
        </td>
    </tr>
`;



           var kierunek = "";

           if (lane === 'CC-UPS-EU-VR') kierunek = 'CC-UPS-KATOWICE-PL-VR';
           else if (lane === 'CC-DD-JLIPL-VR') kierunek = 'CC-JLI-WROCLAW-PL-VR';
           else if (lane === 'CC-KN-PL-VR') kierunek = 'CC-KN-KATOWICE-PL-VR';
           else if (lane === 'CC-KN-EU-VR') kierunek = 'CC-KN-LEIPZIG-DE-VR';
           else if (lane === 'CC-DD-MIGLO-VR') kierunek = 'CC-MIGL-PECICE-PL-VR';


           return `
                    <tr style="background-color: #ecf0f1; transition: background-color 0.3s;">
                        <td class="lane-cell" style="
                            padding: 10px;
                            text-align: center;
                            cursor: pointer;
                            font-size: large;
                            border: 1px solid #bdc3c7;">
                            ${kierunek}
                        </td>
                        <td style="
                            font-size: large;
                            padding: 10px;
                            text-align: center;
                            font-weight: bold;
                            border: 1px solid #bdc3c7;">
                            ${rowTotal}
                        </td>
 ${totals.map((value, index) => {
               if (stages[index].name === 'SHIP LTL') {
                   const subStagesTotal = stages[index].subStages.reduce((sum, subStage) =>
                                                                         sum + (counts[subStage.name][lane] || 0), 0);
                   return `<td style="font-size:large; padding: 8px; text-align: center;">${subStagesTotal}</td>`;
               }
               return `<td style="font-size:large; padding: 8px; text-align: center;">${value}</td>`;
           }).join('')}

    <td style="font-size: large; padding: 8px; text-align: center; font-weight: bold;">${laneCounts[kierunek].under24h}</td>
    <td style="font-size: large; padding: 8px; text-align: center; font-weight: bold;">${laneCounts[kierunek].over24h}</td>
</tr>
                            ${sublistRows}
                    </tr>`;
       }).join('')}

<tr id="ship-ltl-details" style="display: none;">
    <td colspan="${stages.length + 4}">
        <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="padding: 8px; background-color: #f8f9fa; border: 1px solid #dee2e6;">Lane / Stage</th>
                    ${stages.find(s => s.name === 'SHIP LTL').subStages.map(subStage => `
                        <th style="padding: 8px; background-color: #f8f9fa; border: 1px solid #dee2e6;">
                            ${subStage.name}
                        </th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                ${lanes.map(lane => {
                    var kierunek = "";
                    if (lane === 'CC-UPS-EU-VR') kierunek = 'CC-UPS-KATOWICE-PL-VR';
                    else if (lane === 'CC-DD-JLIPL-VR') kierunek = 'CC-JLI-WROCLAW-PL-VR';
                    else if (lane === 'CC-KN-PL-VR') kierunek = 'CC-KN-KATOWICE-PL-VR';
                    else if (lane === 'CC-KN-EU-VR') kierunek = 'CC-KN-LEIPZIG-DE-VR';
                    else if (lane === 'CC-DD-MIGLO-VR') kierunek = 'CC-MIGL-PECICE-PL-VR';

                    return `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #dee2e6; background-color: #f8f9fa; cursor: pointer;"
                                class="ship-ltl-lane"
                                data-lane="${lane}">
                                <strong>${kierunek}</strong>
                            </td>
                            ${stages.find(s => s.name === 'SHIP LTL').subStages.map(subStage => `
                                <td style="padding: 8px; text-align: center; border: 1px solid #dee2e6;">
                                    ${(counts[subStage.name]?.[lane] || 0) > 0 ? counts[subStage.name]?.[lane] : ''}
                                </td>
                            `).join('')}
                        </tr>
                        <tr id="ship-ltl-details-${lane}" class="ship-ltl-sublist" style="display: none;">
                            <td colspan="${stages.find(s => s.name === 'SHIP LTL').subStages.length + 1}" style="padding: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <strong>Dwell time by stage:</strong>
                                    <div style="display: flex; gap: 10px;">
                                        <button class="print-all-sublist" data-lane="${lane}"
                                            style="padding: 5px 10px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 4px;">
                                            Print All Stages
                                        </button>
                                        <button class="check-close-date" data-lane="${lane}"
                                            style="padding: 5px 10px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">
                                            Check dwell time by close time
                                        </button>
                                    </div>
                                </div>
                                <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                                    ${stages.find(s => s.name === 'SHIP LTL').subStages.map(subStage => {
                        const allContainers = [];
                        Object.keys(laneDwellTime[lane]).forEach(dwellTime => {
                            if (laneDwellTime[lane][dwellTime].containers[subStage.name]) {
                                allContainers.push(...laneDwellTime[lane][dwellTime].containers[subStage.name]);
                            }
                        });
                        allContainers.sort((a, b) => b.dwellTime - a.dwellTime);
                        const divId = `shipltl-${lane}-${subStage.name}`.replace(/[^a-zA-Z0-9]/g, '_');
                        return allContainers.length > 0 ?
                            `<div style="flex: 1; min-width: 250px; background-color: white; padding: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                                    <strong style="color: #333;">${subStage.name}</strong>
                                                    <button data-div-id="${divId}" class="print-button"
                                                        style="padding: 4px 8px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 3px;">
                                                        Print List
                                                    </button>
                                                </div>
                                                <ul id="${divId}" style="list-style-type: none; padding: 0; margin: 0; max-height: 300px; overflow-y: auto;">
                                                    ${allContainers.map(container =>
                                                                        `<li style="margin: 4px 0; padding: 4px; background-color: #f8f9fa; border-radius: 3px;">
                                                            <span style="display: inline-block; width: 60px; font-weight: bold; color: ${container.dwellTime > 36 ? '#dc3545' : '#28a745'};">
                                                                ${container.dwellTime}h
                                                            </span>
                                                            <span style="color: #495057;">${container.label}</span>
                                                        </li>`
                                                                       ).join('')}
                                                </ul>
                                            </div>
                                        ` : '';
                    }).join('')}
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    </td>
</tr>



        </tbody>
    </table>

`;

                // Wyświetlenie tabeli
                infoboxContent.innerHTML = mainTableHtml;


                document.querySelectorAll('.ship-ltl-lane').forEach(cell => {
                    cell.addEventListener('click', function() {
                        const lane = this.getAttribute('data-lane');
                        const detailsRow = document.getElementById(`ship-ltl-details-${lane}`);

                        // Ukryj wszystkie inne otwarte szczegóły
                        document.querySelectorAll('.ship-ltl-sublist').forEach(row => {
                            if (row.id !== `ship-ltl-details-${lane}`) {
                                row.style.display = 'none';
                            }
                        });

                        // Przełącz widoczność klikniętego wiersza
                        detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
                    });
                });

                document.querySelectorAll('.ship-ltl-sublist .print-button').forEach(button => {
                    button.addEventListener('click', function() {
                        const divId = this.getAttribute('data-div-id');
                        const div = document.getElementById(divId);
                        const items = Array.from(div.querySelectorAll('li'))
                        .map(li => li.textContent.trim());

                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
            <html>
                <head>
                    <title>Container List</title>
                    <style>
                        body { font-family: monospace; font-size: 12px; padding: 20px; }
                        .item { line-height: 1.5; }
                    </style>
                </head>
                <body>
                    <h2>${divId}</h2>
                    ${items.map((item, index) => `
                        <div class="item">${index + 1}. ${item}</div>
                    `).join('')}
                </body>
            </html>
        `);
                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                        printWindow.close();
                    });
                });

                document.querySelectorAll('.ship-ltl-sublist .print-all-sublist').forEach(button => {
                    button.addEventListener('click', function() {
                        const lane = this.getAttribute('data-lane');
                        const parentRow = this.closest('.ship-ltl-sublist');
                        const allDivs = parentRow.querySelectorAll('div > div > div'); // Kontenery ze stages

                        const allData = Array.from(allDivs)
                        .filter(div => div.querySelector('ul')) // Tylko te z listą kontenerów
                        .map(container => {
                            const headerText = container.querySelector('strong').textContent;
                            const items = Array.from(container.querySelectorAll('li'))
                            .map(li => li.textContent.trim())
                            .filter(text => text);

                            return {
                                header: headerText,
                                items: items
                            };
                        });

                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
            <html>
                <head>
                    <title>Container Lists</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: monospace; font-size: 12px; padding: 10px; }
                        .section { margin-bottom: 20px; }
                        .header { font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid black; padding-bottom: 5px; }
                        .items-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
                        .item { line-height: 1.2; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${allData.map((data) => `
                            <div class="section">
                                <div class="header">${data.header}</div>
                                <div class="items-container">
                                    ${data.items.slice(0, 40).map((item, index) => `
                                        <div class="item">${index + 1}. ${item}</div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </body>
            </html>
        `);
                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                        printWindow.close();
                    });
                });

                document.querySelectorAll('.ship-ltl-sublist .check-close-date').forEach(button => {
                    button.addEventListener('click', async function() {
                        const lane = this.getAttribute('data-lane');
                        const parentRow = this.closest('.ship-ltl-sublist');
                        const allDivs = parentRow.querySelectorAll('ul');

                        button.disabled = true;
                        button.style.backgroundColor = '#cccccc';

                        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

                        for (const div of allDivs) {
                            const parentDiv = div.closest('div');
                            const overlay = document.createElement('div');
                            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;

                            const spinner = document.createElement('div');
                            spinner.innerHTML = 'Processing...';
                            spinner.style.cssText = `
                color: white;
                background-color: #007bff;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
            `;

                            overlay.appendChild(spinner);
                            parentDiv.style.position = 'relative';
                            parentDiv.appendChild(overlay);

                            const containers = Array.from(div.querySelectorAll('li span:last-child'))
                            .map(span => span.textContent.trim());

                            let processed = 0;
                            const total = containers.length;

                            for (const container of containers) {
                                try {
                                    const queryData = {
                                        query: `
                            query ($queryInput: [SearchTermInput!]!) {
                                searchEntities(searchTerms: $queryInput) {
                                    searchTerm {
                                        nodeId
                                        nodeTimezone
                                        searchId
                                        searchIdType
                                        resolvedIdType
                                    }
                                    events {
                                        identifier
                                        description {
                                            ... on ContainerAuditEventDescription {
                                                stateChangeReason
                                            }
                                        }
                                        byUser
                                        lastUpdateTime
                                    }
                                }
                            }
                        `,
                                        variables: {
                                            queryInput: [{
                                                nodeId: "KTW1",
                                                searchId: container,
                                                searchIdType: "UNKNOWN"
                                            }]
                                        }
                                    };

                                    const response = await fetch('https://trans-logistics-eu.amazon.com/sortcenter/tantei/graphql', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'anti-csrftoken-a2z': csrfToken
                                        },
                                        body: JSON.stringify(queryData)
                                    });

                                    const data = await response.json();
                                    const events = data.data.searchEntities[0].events;

                                    let relevantTime = null;
                                    const closeEvent = events.find(event =>
                                                                   event.description?.stateChangeReason === "CLOSE"
                                                                  );

                                    if (closeEvent) {
                                        relevantTime = closeEvent.lastUpdateTime;
                                    } else {
                                        const firstNon705Event = events
                                        .filter(event => event.byUser !== "705")
                                        .sort((a, b) => a.lastUpdateTime - b.lastUpdateTime)[0];

                                        if (firstNon705Event) {
                                            relevantTime = firstNon705Event.lastUpdateTime;
                                        }
                                    }

                                    if (relevantTime) {
                                        const currentTime = Date.now();
                                        const timeDiff = Math.floor((currentTime - relevantTime) / (1000 * 60 * 60));

                                        const spans = div.querySelectorAll('li span:last-child');
                                        const targetSpan = Array.from(spans).find(span =>
                                                                                  span.textContent.trim() === container
                                                                                 );
                                        if (targetSpan) {
                                            const li = targetSpan.closest('li');
                                            const timeSpan = li.querySelector('span:first-child');
                                            timeSpan.textContent = `${timeDiff}h`;
                                            timeSpan.style.color = timeDiff > 36 ? '#dc3545' : '#28a745';
                                        }
                                    }

                                    processed++;
                                    spinner.innerHTML = `Processing... ${processed}/${total}`;
                                    await sleep(450);

                                } catch (error) {
                                    console.error(`Error processing container ${container}:`, error);
                                }
                            }

                            const items = Array.from(div.querySelectorAll('li'));
                            items.sort((a, b) => {
                                const timeA = parseInt(a.querySelector('span:first-child').textContent);
                                const timeB = parseInt(b.querySelector('span:first-child').textContent);
                                return timeB - timeA;
                            });

                            div.innerHTML = '';
                            items.forEach(item => div.appendChild(item));

                            parentDiv.removeChild(overlay);
                        }

                        button.disabled = false;
                        button.style.backgroundColor = '#4CAF50';
                    });
                });



                const shipLtlHeader = document.querySelector('.ship-ltl-header');
                if (shipLtlHeader) {
                    shipLtlHeader.addEventListener('click', function() {
                        const shipLTLDetails = document.getElementById('ship-ltl-details');
                        if (shipLTLDetails.style.display === 'none') {
                            shipLTLDetails.style.display = 'table-row';
                            this.querySelector('.expand-icon').textContent = '▲';
                        } else {
                            shipLTLDetails.style.display = 'none';
                            this.querySelector('.expand-icon').textContent = '▼';
                        }
                    });
                }


                // Podłączanie eventów do komórek Lane
                const laneCells = document.querySelectorAll('.lane-cell');
                laneCells.forEach(cell => {
                    cell.addEventListener('click', () => {
                        const lane = cell.textContent.trim();
                        var kierunek = "";
                        if (lane === 'CC-UPS-KATOWICE-PL-VR') kierunek = 'CC-UPS-EU-VR';
                        else if (lane === 'CC-JLI-WROCLAW-PL-VR') kierunek = 'CC-DD-JLIPL-VR';
                        else if (lane === 'CC-KN-KATOWICE-PL-VR') kierunek = 'CC-KN-PL-VR';
                        else if (lane === 'CC-KN-LEIPZIG-DE-VR') kierunek = 'CC-KN-EU-VR';
                        else if (lane === 'CC-MIGL-PECICE-PL-VR') kierunek = 'CC-DD-MIGLO-VR';

                        // console.log('Clicking lane:', kierunek); // Debug line
                        toggleSublist(kierunek);
                    });
                });



                document.querySelectorAll('.check-close-date').forEach(button => {
                    button.addEventListener('click', async function() {
                        const lane = this.getAttribute('data-lane');
                        const parentRow = this.closest('.sublist');
                        const allDivs = parentRow.querySelectorAll('ul');

                        // Dezaktywuj przycisk podczas przetwarzania
                        button.disabled = true;
                        button.style.backgroundColor = '#cccccc';

                        // Funkcja sleep do wprowadzenia opóźnienia
                        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

                        for (const div of allDivs) {
                            // Dodaj overlay pokazujący, że div jest przetwarzany
                            const parentDiv = div.closest('div');
                            const overlay = document.createElement('div');
                            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;

                            const spinner = document.createElement('div');
                            spinner.innerHTML = 'Processing...';
                            spinner.style.cssText = `
                color: white;
                background-color: #007bff;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
            `;

                            overlay.appendChild(spinner);
                            parentDiv.style.position = 'relative';
                            parentDiv.appendChild(overlay);

                            const containers = Array.from(div.querySelectorAll('li span:last-child'))
                            .map(span => span.textContent.trim());

                            // Licznik do wyświetlania postępu
                            let processed = 0;
                            const total = containers.length;

                            // Przetwarzaj każdy kontener pojedynczo
                            for (const container of containers) {
                                try {
                                    const queryData = {
                                        query: `
                            query ($queryInput: [SearchTermInput!]!) {
                                searchEntities(searchTerms: $queryInput) {
                                    searchTerm {
                                        nodeId
                                        nodeTimezone
                                        searchId
                                        searchIdType
                                        resolvedIdType
                                    }
                                    events {
                                        identifier
                                        description {
                                            ... on ContainerAuditEventDescription {
                                                stateChangeReason
                                            }
                                        }
                                        byUser
                                        lastUpdateTime
                                    }
                                }
                            }
                        `,
                                        variables: {
                                            queryInput: [{
                                                nodeId: "KTW1",
                                                searchId: container,
                                                searchIdType: "UNKNOWN"
                                            }]
                                        }
                                    };

                                    const response = await fetch('https://trans-logistics-eu.amazon.com/sortcenter/tantei/graphql', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'anti-csrftoken-a2z': csrfToken
                                        },
                                        body: JSON.stringify(queryData)
                                    });

                                    const data = await response.json();
                                    const events = data.data.searchEntities[0].events;

                                    let relevantTime = null;

                                    const closeEvent = events.find(event =>
                                                                   event.description?.stateChangeReason === "CLOSE"
                                                                  );

                                    if (closeEvent) {
                                        relevantTime = closeEvent.lastUpdateTime;
                                    } else {
                                        const firstNon705Event = events
                                        .filter(event => event.byUser !== "705")
                                        .sort((a, b) => a.lastUpdateTime - b.lastUpdateTime)[0];

                                        if (firstNon705Event) {
                                            relevantTime = firstNon705Event.lastUpdateTime;
                                        }
                                    }

                                    if (relevantTime) {
                                        const currentTime = Date.now();
                                        const timeDiff = Math.floor((currentTime - relevantTime) / (1000 * 60 * 60));

                                        const spans = div.querySelectorAll('li span:last-child');
                                        const targetSpan = Array.from(spans).find(span => span.textContent.trim() === container);
                                        if (targetSpan) {
                                            const li = targetSpan.closest('li');
                                            const timeSpan = li.querySelector('span:first-child');
                                            timeSpan.textContent = `${timeDiff}h`;
                                            timeSpan.style.color = timeDiff > 36 ? '#dc3545' : '#28a745';
                                        }
                                    }

                                    processed++;
                                    spinner.innerHTML = `Processing... ${processed}/${total}`;

                                    // Czekaj 450ms przed następnym zapytaniem
                                    await sleep(450);

                                } catch (error) {
                                    console.error(`Error processing container ${container}:`, error);
                                }
                            }

                            // Sortuj elementy po zakończeniu wszystkich zapytań
                            const items = Array.from(div.querySelectorAll('li'));
                            items.sort((a, b) => {
                                const timeA = parseInt(a.querySelector('span:first-child').textContent);
                                const timeB = parseInt(b.querySelector('span:first-child').textContent);
                                return timeB - timeA;
                            });

                            div.innerHTML = '';
                            items.forEach(item => div.appendChild(item));

                            // Usuń overlay po zakończeniu przetwarzania
                            parentDiv.removeChild(overlay);
                        }

                        // Aktywuj przycisk ponownie
                        button.disabled = false;
                        button.style.backgroundColor = '#007bff';
                    });
                });






                document.querySelectorAll('.print-all-sublist').forEach(button => {
                    button.addEventListener('click', function() {
                        const lane = this.getAttribute('data-lane');
                        var allDivsInLane = this.parentElement.parentElement.children;
                        allDivsInLane = Array.from(allDivsInLane).slice(1);

                        console.log(allDivsInLane);

                        // Zbierz dane ze wszystkich div'ów w danej subliście
                        const allData = Array.from(allDivsInLane).map(container => {
                            const headerText = container.querySelector('strong').textContent;
                            const items = Array.from(container.querySelectorAll('li'))
                            .map(li => li.textContent.trim())
                            .filter(text => text);

                            return {
                                header: headerText,
                                items: items
                            };
                        });

                        // Otwórz okno drukowania z wszystkimi listami obok siebie
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
        <html>
            <head>
                <title>Container Lists</title>
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
    }
    .section {
        margin-bottom: 20px;
    }
    .header {
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 2px solid black;
        padding-bottom: 5px;
    }
    .items-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
    }
    .item {
        line-height: 1.2;
    }
</style>
            </head>
            <body>
                <div class="container">
                 ${allData.map((data) => `
    <div class="section">
        <div class="header">${data.header}</div>
        <div class="items-container">
            ${data.items.slice(0, 40).map((item, index) => `
                <div class="item">${index + 1}. ${item}</div>
            `).join('')}
        </div>
    </div>
`).join('')}
                </div>
            </body>
        </html>
    `);

                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                        printWindow.close();

                    });
                });

                tso_checking = false;
                window.tso_checking = false;
            }
        }














        // Główna funkcja
        async function tso_stages_click() {

            // Sprawdź, czy kontener już istnieje i usuń go, jeśli tak
            const existingContainer = document.querySelector('.dock-data-container');
            if (existingContainer) {
                existingContainer.remove();
                return;
            }
            // Dodaj style CSS
            // Dodaj style CSS (ta część pozostaje bez zmian)
            const styles = `
        .dock-data-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f8f9fa;
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 9999;
            max-height: 90vh;
            overflow-y: auto;
            font-size: 14px;
            color: #343a40;
        }

        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
        }

        .dock-data-table {
            margin: 20px 0;
            background: white;
        }

        .dock-data-table td {
            border: 1px solid #dee2e6;
            padding: 5px 5px;
            text-align: center;
            font-size: large;
        }

        .dock-data-table th {
            background-color: #e9ecef;
            position: sticky;
            top: 0;
            padding: 5px 5px;
            font-weight: bold;
            font-size: x-large;
            color: #495057;
        }

        .dock-data-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .dock-data-table tr:hover {
            background-color: #e9ecef;
            transition: background-color 0.2s;
        }

        .sublist {
            background-color: #e6f3ff;
        }

        .hidden {
            display: none;
        }
    `;
            const styleSheet = document.createElement("style");
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);

            // Utwórz kontener
            const container = document.createElement('div');
            container.id = "container_tso";
            container.className = 'dock-data-container';
            document.body.appendChild(container);

            // Dodaj loader
            const loader = document.createElement('div');
            loader.innerHTML = `
        <span style="
            background-image:url('https://drive.corp.amazon.com/view/nowaratn@/loading.gif');
            background-size:contain;
            height:36px;
            width:36px;
            display:flex;
            margin: 20px auto;
        "></span>
    `;
            container.appendChild(loader);
            document.body.appendChild(container);

            if (!window.tso_checking) {
                window.tso_checking = true;

                // Pobierz token CSRF
                try {
                    const response = await fetch('https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1');
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    csrfToken = doc.querySelector("input[name='__token_']").value;
                } catch (error) {
                    console.error('Błąd:', error);
                }

                tso_checking = true;


                // Definicja dostępnych linii (kierunków)
                const lanes = ['DUS4', 'FRA7', 'NUE1', 'POZ2', 'BRE4'];

                // Definicja etapów (stages) do przetworzenia
                const stages = [
                    { name: 'Stage_TSO', searchId: 'Stage_TSO' },
                    { name: 'Stage_TSO 2', searchId: 'Stage_TSO 2' },
                    { name: 'IB_IXD_1', searchId: 'IB_IXD_1' },
                    { name: 'Bramy_TSO', searchId: 'Bramy_TSO' },
                    { name: 'DD164_KLATKA', searchId: 'CRITS_DD164_KLATKA' },
                ];

                // Inicjalizacja obiektu zliczającego ilości na poszczególnych stages
                let counts = {};
                stages.forEach(stage => {
                    if (stage.name === 'SHIP LTL') {
                        // Inicjalizacja dla głównego stage
                        counts[stage.name] = {};
                        lanes.forEach(lane => {
                            counts[stage.name][lane] = 0;
                        });
                        // Inicjalizacja dla substages
                        stage.subStages.forEach(subStage => {
                            counts[subStage.name] = {};
                            lanes.forEach(lane => {
                                counts[subStage.name][lane] = 0;
                            });
                        });
                    } else {
                        counts[stage.name] = {};
                        lanes.forEach(lane => {
                            counts[stage.name][lane] = 0;
                        });
                    }
                });


                // Struktura do przechowywania danych lane->criticalPullTime->stage->count
                let laneCriticalTimesStages = {};
                lanes.forEach(lane => {
                    laneCriticalTimesStages[lane] = {};
                });

                await delay(300);

                // Funkcja do przetwarzania etapów
                async function processStages() {
                    for (const stage of stages) {
                        let endToken = "0";
                        let temp_token = "0";
                        let ile_postow = 0;

                        do {
                            ile_postow++;
                            const searchId = stage.searchId;

                            const rawData = `{"query":"\\nquery ($queryInput: [SearchTermInput!]!, $startIndex: String) {\\n  searchEntities(searchTerms: $queryInput) {\\n    searchTerm {\\n      nodeId\\n      nodeTimezone\\n      searchId\\n      searchIdType\\n      resolvedIdType\\n    }\\n    contents(pageSize: 60, startIndex: $startIndex, forwardNavigate: true) {\\n      contents {\\n        containerId\\n        containerLabel\\n        containerType\\n        stackingFilter\\n        criticalPullTime\\n        isEmpty\\n        isClosed\\n        isForcedMove\\n        associationReason\\n        associatedUser\\n        timeOfAssociation\\n        cleanupAllowed\\n      }\\n      endToken\\n    }\\n  }\\n}\\n","variables":{"queryInput":[{"nodeId":"KTW1","searchId":"${searchId}","searchIdType":"UNKNOWN"}],"startIndex":"${endToken}"}}`;
                            const contentsData = await postJsonAndGetContents(rawData);
                            const contents = contentsData.contents;

                            if (contents && contents.length !== 0) {
                                contents.forEach(content => {
                                    const lane = extractLaneFromContent(content, lanes);
                                    if (lane) {
                                        counts[stage.name][lane] += 1;

                                        if (content.criticalPullTime) {
                                            const cpt = content.criticalPullTime;
                                            if (!laneCriticalTimesStages[lane][cpt]) {

                                                laneCriticalTimesStages[lane][cpt] = {
                                                    stages: {},
                                                    containers: {} // Add this to store containers
                                                };

                                                stages.forEach(stg => {
                                                    laneCriticalTimesStages[lane][cpt].stages[stg.name] = 0;
                                                    laneCriticalTimesStages[lane][cpt].containers[stg.name] = []; // Initialize container array for each stage
                                                });
                                            }

                                            // Store container in the appropriate stage array
                                            laneCriticalTimesStages[lane][cpt].stages[stage.name] += 1;
                                            laneCriticalTimesStages[lane][cpt].containers[stage.name].push(content.containerLabel);
                                        }
                                    }
                                });

                                temp_token = contentsData.endToken;
                                endToken = temp_token || "0";
                            } else {
                                temp_token = null;
                            }

                            await delay(200);

                            if (ile_postow > 66) {
                                temp_token = null;
                            }
                        } while (temp_token != null);
                    }
                }

                // Funkcja do wyciągania linii z zawartości
                function extractLaneFromContent(content, lanes) {
                    for (const lane of lanes) {
                        const laneLower = lane.toLowerCase();
                        if (
                            (content.destinationName && content.destinationName.toLowerCase().includes(laneLower)) ||
                            (content.toNode && content.toNode.toLowerCase().includes(laneLower)) ||
                            (content.containerLabel && content.containerLabel.toLowerCase().includes(laneLower)) ||
                            (content.stackingFilter && content.stackingFilter.toLowerCase().includes(laneLower))
                        ) {
                            return lane;
                        }
                    }
                    return null;
                }

                // Funkcja do formatowania daty z UNIX timestamp na "DD/MM/YYYY HH:MM"
                function formatCriticalPullTime(unixTimestampSec) {
                    const date = new Date(unixTimestampSec);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                }

                // Przetwarzanie etapów
                await processStages();

                loader.remove();

                // Zmodyfikuj generowanie tabeli, aby używało nowego kontenera
                container.innerHTML = `
                <div id="container_tsoheader" style="height:10px;background-color:black;cursor:move;">
            <button class="close-button">X</button>
            </div>
            <table class="dock-data-table">
                <thead>
                    <tr>
                        <th>Lane</th>
                        ${stages.map(stage => `<th>${stage.name}</th>`).join('')}
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${lanes.map(lane => {
                    const totals = stages.map(stage => counts[stage.name][lane]);
                    const rowTotal = totals.reduce((a, b) => a + b, 0);

                    // Podlista: posortowane criticalPullTime
                    const cptKeys = Object.keys(laneCriticalTimesStages[lane])
                    .map(k => parseInt(k))
                    .sort((a,b) => a - b);

                    let sublistRows = '';
                    if (cptKeys.length > 0) {
                        sublistRows = cptKeys.map(cpt => {
                            const dateFormatted = formatCriticalPullTime(cpt);
                            const stageCounts = stages.map(stg => laneCriticalTimesStages[lane][cpt].stages[stg.name]);
                            const cptTotal = stageCounts.reduce((a, b) => a + b, 0);

                            // Add containers list
                            const containers = laneCriticalTimesStages[lane][cpt].containers;
                            const containersHtml = `
    <tr class="sublist hidden" style="background-color:#e6f3ff;" data-lane="${lane}">
        <td colspan="${stages.length + 4}" style="padding: 8px;">
            <strong>Dwell time by stage:</strong><br>
            <br>
            ${stages.map(stg => {
                const stageContainers = laneCriticalTimesStages[lane][cpt].containers[stg.name];
                return stageContainers.length > 0 ? `
                    <div style="margin: 5px 0;">
                        <strong>${stg.name}:</strong>
                        ${stageContainers.map(container =>
                                              `<a href="https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&searchType=Container&searchId=${container}" target="_blank">${container}</a>`
                                             ).join(', ')}
                    </div>
                ` : '';
            }).join('')}
        </td>
    </tr>
`;

                            return `
            <tr class="sublist hidden" style="background-color:skyblue;" data-lane="${lane}">
                <td style="padding: 8px; text-align: center; font-size:larger;">${dateFormatted}</td>
                ${stageCounts.map(val => `<td style="padding: 8px; text-align: center;">${val}</td>`).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold;">${cptTotal}</td>
            </tr>
            ${containersHtml}
        `;
                        }).join('');
                    }



                    return `
                            <tr>
                                <td class="lane-cell" style="cursor:pointer;">${lane}</td>
                                ${totals.map(value => `<td>${value}</td>`).join('')}
                                <td style="font-weight: bold;">${rowTotal}</td>
                            </tr>
                            ${sublistRows}
                        `;
                }).join('')}
                </tbody>
            </table>
        `;

                // Podłącz event listenery
                container.querySelector('.close-button').onclick = () => container.remove();

                const laneCells = container.querySelectorAll('.lane-cell');
                laneCells.forEach(cell => {
                    const lane = cell.textContent.trim();
                    cell.addEventListener('click', () => {
                        const sublists = container.querySelectorAll(`.sublist[data-lane="${lane}"]`);
                        sublists.forEach(sublist => sublist.classList.toggle('hidden'));
                    });
                });

                dragElement(container);

                window.tso_checking = false;
                tso_checking = false;
            }
        }



        async function manual_ko_click()
        {
            function initializeUI() {
                // Dodanie stylów CSS
                const styles = `
        .dock-data-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f8f9fa;
            padding-left: 25px;
            padding-right: 15px;
            padding-bottom: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 9999;
            max-height: 90vh;
            overflow-y: auto;
            min-width: 800px;
            font-size: 14px;
            color: #343a40;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            color: #212529;
            margin-bottom: 20px;
            text-align: center;
        }

        .toggle-button {
            position: absolute;
            top: 10px;
            right: 50px;
            background: #6c757d;
            color: white;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }

        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #6c757d;
            color: white;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }

        .toggle-button:hover {
            background: #5a6268;
        }

        .dock-data-table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            background: white;
        }

        .dock-data-table th, .dock-data-table td {
            border: 1px solid #dee2e6;
            padding: 12px 15px;
            text-align: left;
            font-size: 14px;
        }

        .dock-data-table th {
            background-color: #e9ecef;
            position: sticky;
            top: 0;
            font-weight: bold;
            font-size: 15px;
            color: #495057;
        }

        .dock-data-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .dock-data-table tr:hover {
            background-color: #e9ecef;
            transition: background-color 0.2s;
        }

        .refresh-button {
            background-color: #28a745;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin: 15px 0;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.2s;
        }

        .refresh-button:hover {
            background-color: #218838;
        }

        .last-update {
            font-size: 14px;
            color: #6c757d;
            margin: 15px 0;
            text-align: center;
        }

        hr {
            border: none;
            border-top: 1px solid #dee2e6;
            margin: 15px 0;
        }

        .hidden {
            display: none;
        }

         .countdown {
            font-size: 14px;
            color: #6c757d;
            margin: 5px 0;
            text-align: center;
        }
    `;


                const styleSheet = document.createElement("style");
                styleSheet.innerText = styles;
                document.head.appendChild(styleSheet);

                // Utworzenie i dodanie kontenera UI
                const container = document.createElement('div');
                container.className = 'dock-data-container';
                document.body.appendChild(container);

                // Dodanie tytułu
                const title = document.createElement('div');
                title.className = 'title';
                title.textContent = 'Pozostałe paczki KTW4->KTW1';
                container.appendChild(title);

                // Dodanie przycisku toggle
                const toggleButton = document.createElement('button');
                toggleButton.className = 'toggle-button';
                toggleButton.textContent = '−';
                container.appendChild(toggleButton);

                // Dodanie przycisku close
                const closeButton = document.createElement('button');
                closeButton.className = 'close-button';
                closeButton.textContent = 'X';
                container.appendChild(closeButton);

                // Element na tabelę
                const tableDiv = document.createElement('div');
                container.appendChild(tableDiv);

                // Element HR
                const tableHr = document.createElement('hr');
                container.appendChild(tableHr);

                // Element pokazujący czas ostatniej aktualizacji
                const lastUpdateDiv = document.createElement('div');
                lastUpdateDiv.className = 'last-update';
                container.appendChild(lastUpdateDiv);

                // Element HR
                const bottomHr = document.createElement('hr');
                container.appendChild(bottomHr);

                // Dodanie elementu dla odliczania
                const countdownDiv = document.createElement('div');
                countdownDiv.className = 'countdown';
                container.appendChild(countdownDiv);

                // Dodanie przycisku odświeżania
                const refreshButton = document.createElement('button');
                refreshButton.className = 'refresh-button';
                refreshButton.textContent = 'Odśwież dane';
                container.appendChild(refreshButton);

                // Logika przycisku toggle
                let isVisible = true;

                toggleButton.addEventListener('click', () => {
                    isVisible = !isVisible;
                    contentElements.forEach(el => {
                        el.classList.toggle('hidden');
                    });
                    toggleButton.textContent = isVisible ? '−' : '+';
                    container.style.padding = isVisible ? '25px' : '15px';
                });


                closeButton.addEventListener('click', () => {
                    container.remove();
                });


                // Aktualizacja listy elementów do ukrywania
                const contentElements = [tableDiv, tableHr, lastUpdateDiv, bottomHr, refreshButton, countdownDiv];


                return { refreshButton, lastUpdateDiv, tableDiv, countdownDiv };
            }

            // Funkcja tworząca tabelę HTML
            function createTable(data) {
                return `
            <table class="dock-data-table">
                <thead>
                    <tr>
                        <th>Kierunek</th>
                        <th>CPT</th>
                        <th>Liczba paczek</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td>${row.route}</td>
                            <td>${row.criticalPullTime}</td>
                            <td>${row.inboundInTransitP}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
            }




            // Tutaj pozostałe funkcje z poprzedniego skryptu (fetchDockData, fetchContainerData, fetchAndProcessData)
            async function fetchDockData() {
                // Get current time
                const now = new Date();

                // Calculate times
                const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
                const eighteenHoursAhead = new Date(now.getTime() + (18 * 60 * 60 * 1000));

                // Convert to milliseconds timestamp
                const startDate = twoHoursAgo.getTime();
                const endDate = eighteenHoursAhead.getTime();

                try {
                    const response = await fetch("https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?", {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                            "Accept": "application/json, text/javascript, */*; q=0.01",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "X-Requested-With": "XMLHttpRequest",
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin",
                            "Priority": "u=0"
                        },
                        "referrer": "https://trans-logistics-eu.amazon.com/ssp/dock/ob?",
                        "body": `entity=getOutboundDockView&nodeId=KTW1&startDate=${startDate}&endDate=${endDate}&loadCategories=outboundScheduled%2CoutboundInProgress%2CoutboundReadyToDepart%2CoutboundDeparted%2CoutboundCancelled&shippingPurposeType=NON-TRANSSHIPMENT%2CSHIP_WITH_AMAZON`,
                        "method": "POST",
                        "mode": "cors"
                    });

                    const data = await response.json();

                    // Tablica na wszystkie załadunki
                    const loads = [];

                    // Sprawdzenie czy mamy dane i czy mamy aaData
                    if (data && data.ret && data.ret.aaData) {
                        // Iteracja przez wszystkie elementy i wyciągnięcie danych o załadunkach
                        data.ret.aaData.forEach(item => {
                            if (item.load) {
                                loads.push(item.load);
                            }
                        });
                    }

                    // Możesz zapisać dane do localStorage jeśli chcesz je zachować
                    localStorage.setItem('dockLoads', JSON.stringify(loads));

                    //console.log('Zapisane załadunki:', loads);
                    return loads;

                } catch (error) {
                    console.error('Error fetching dock data:', error);
                }
            }

            async function fetchContainerData(loadGroupIds) {
                try {
                    const response = await fetch("https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?", {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                            "Accept": "application/json, text/javascript, */*; q=0.01",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "X-Requested-With": "XMLHttpRequest",
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin"
                        },
                        "referrer": "https://trans-logistics-eu.amazon.com/ssp/dock/ob?",
                        "body": `entity=getContainerCountForCPT&loadGroupIds=${loadGroupIds.join('%2C')}&nodeId=KTW1`,
                        "method": "POST",
                        "mode": "cors"
                    });

                    return await response.json();
                } catch (error) {
                    console.error('Error fetching container data:', error);
                    return null;
                }
            }

            // Funkcja do pobrania zapisanych danych
            function getStoredRouteData() {
                const storedData = localStorage.getItem('routeData');
                return storedData ? JSON.parse(storedData) : [];
            }

            async function fetchAndProcessData() {
                try {
                    const loads = await fetchDockData();
                    const loadGroupIds = loads.map(load => load.loadGroupId);
                    const containerData = await fetchContainerData(loadGroupIds);

                    // Utworzenie mapy do przechowywania unikalnych kombinacji route/criticalPullTime
                    const uniqueRouteData = new Map();

                    // Przetwarzanie danych
                    loads.forEach(load => {
                        if(load.route.length > 10)
                        {
                            const key = `${load.route}|${load.criticalPullTime}`;
                            if (!uniqueRouteData.has(key)) {
                                const containerInfo = containerData.ret.cptContainerCountMap[load.loadGroupId];
                                const inboundInTransitP = containerInfo ? containerInfo.inboundInTransit.P : 0;

                                // Dodaj tylko jeśli inboundInTransitP > 0
                                if (inboundInTransitP > 0) {
                                    uniqueRouteData.set(key, {
                                        route: load.route,
                                        criticalPullTime: load.criticalPullTime,
                                        inboundInTransitP: inboundInTransitP
                                    });
                                }
                            }
                        }
                    });

                    // Konwersja do tablicy i sortowanie po criticalPullTime
                    const results = Array.from(uniqueRouteData.values())
                    .sort((a, b) => {
                        const dateA = new Date(a.criticalPullTime);
                        const dateB = new Date(b.criticalPullTime);
                        return dateA - dateB;
                    });

                    // Wyświetlenie wyników w konsoli w formie tabeli
                    // console.table(results);

                    // Zapisanie wyników do localStorage
                    localStorage.setItem('routeData', JSON.stringify(results));

                    return results;

                } catch (error) {
                    console.error('Error processing data:', error);
                }
            }

            const ui = initializeUI();

            async function refreshData() {
                try {
                    const results = await fetchAndProcessData();
                    if (results && results.length > 0) {
                        ui.tableDiv.innerHTML = createTable(results);
                    }
                } catch (error) {
                    console.error('Error refreshing data:', error);
                }
            }

            // Obsługa kliknięcia przycisku
            ui.refreshButton.addEventListener('click', () => {
                refreshData();
            });

            const results = await fetchAndProcessData();
            if (results && results.length > 0) {
                ui.tableDiv.innerHTML = createTable(results);
            }

        }


        function countElementsWithSameStackingFilter(jsonArray) {
            const countMap = {};

            jsonArray.forEach(item => {
                const filter = item.stackingFilter;
                if (filter) {
                    countMap[filter] = (countMap[filter] || 0) + 1;
                }
            });

            return countMap;
        }
        // rainbow normal smooth
        addGlobalStyle('.rainbow { animation: rainbow 10s linear infinite; background: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet, purple, red); -webkit-background-clip: text; background-clip: text; color: transparent; } @keyframes rainbow { 0%, 100% { color: red; } 11.11% { color: rgb(255, 160, 0); } 22.22% { color: rgb(255, 255, 0); } 33.33% { color: rgb(128, 255, 0); } 44.44% { color: rgb(0, 191, 255); } 55.55% { color: rgb(138, 43, 226); } 66.66% { color: rgb(186, 85, 211); } 77.77% { color: rgb(147, 112, 219); } 88.88% { color: rgb(255, 160, 0); } }');

        // addGlobalStyle('.rainbow { animation: rainbow 5s infinite; } @keyframes rainbow{ 0%, 100% {color: red;} 12.5% {color: orange;} 25% {color: yellow;} 37.5% {color: green;} 50% {color: blue;} 62.5% {color: indigo;} 75% {color: violet;} 87.5% {color: purple;}}');
        addGlobalStyle('@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); }');
        addGlobalStyle('.marquee {  white-space: nowrap; overflow: hidden; animation: marquee 10s linear infinite; }');
        addGlobalStyle('.infobox_events:hover { background-color:yellow; }');
        addGlobalStyle('.ColContId { display:inline-grid; }');
        addGlobalStyle('#documentDeliveredMessage { display:contents; }');



        // eCMR ilość paczek
        // Tworzymy nową instancję Intersection Observer
        const observer_cmr = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element wchodzi w obszar widoczności
                    // console.log('Element is now visible');
                    // Tutaj możesz wykonać odpowiednie akcje, np. uruchomić animacje
                    var ssp = document.getElementById("dashboard");
                    var ile = ssp.getElementsByTagName("tr").length;
                    var vrid_1 = "";
                    var zaladowane = "";
                    var gdzievrid = "";
                    var gdziezaladowane = "";

                    for(i=0;i<=12;i++)
                    {
                        if(ssp.getElementsByTagName("tr")[0].children[i].innerText == "VR Id")
                        {
                            gdzievrid = i;
                        }

                        if(ssp.getElementsByTagName("tr")[0].children[i].innerText == "P")
                        {
                            gdziezaladowane = i;
                        }
                    }

                    var vrid_2 = document.getElementsByClassName("col-md-10 backGroundNone")[0].innerText;
                    vrid_2 = vrid_2.substring(vrid_2.length - 9);
                    console.log(vrid_2);

                    for(i=2;i<ile;i++)
                    {
                        if(ssp.getElementsByTagName("tr")[i].className != "")
                        {
                            if(ssp.getElementsByTagName("tr")[i].children[gdzievrid] != undefined)
                            {
                                vrid_1 = ssp.getElementsByTagName("tr")[i].children[gdzievrid].children[0].innerText.replace(" PUP","").trim();
                                console.log(vrid_1);

                                if(vrid_1 == vrid_2)
                                {
                                    zaladowane = ssp.getElementsByTagName("tr")[i].children[gdziezaladowane].innerText;
                                    document.getElementsByClassName("routeSegmentNumberOfPackages")[0].value = zaladowane;

                                    // Pobieramy element select po klasie
                                    const selectElement = document.querySelector('.routeSegmentIdDropdown');

                                    // Ustawiamy indeks na ostatni element (length - 1)
                                    selectElement.selectedIndex = selectElement.options.length - 1;
                                }
                            }
                        }
                    }


                    var kierunek_ssp = document.getElementsByClassName("col-md-10 backGroundNone")[0].innerText;
                    kierunek_ssp = kierunek_ssp.replace("Details for\nRoute ","");
                    kierunek_ssp = kierunek_ssp.substr(0,kierunek_ssp.length-12);

                    if(kierunek_ssp == "KTW1->AIR-KTW1-EDDP-EMSA")
                    {

                        var inTransit = document.getElementsByClassName("containerHierarchy sweepLink colorBlue")[2];
                        if(inTransit.innerText != "0")
                        {
                            document.getElementById("eCMRRouteSegmentData").style.height = "";
                            var eddp_info = document.createElement ('div');
                            eddp_info.innerHTML = '<br><center><span style="font-size:x-large;color:red;font-variant:all-small-caps;">In Transit nadal znajdują się paczki do przebicia na ten kierunek</center></span>';
                            // eddp_info.style.display = "inline-flex";
                            document.getElementById("eCMRRouteSegmentData").appendChild(eddp_info);
                        }
                    }


                } else {
                    // Element wychodzi z obszaru widoczności
                    // console.log('Element is no longer visible');
                    // Tutaj możesz wykonać akcje, np. zatrzymać animacje
                }
            });
        });

        // Element, który chcemy obserwować
        const targetElement = document.querySelector('#eCMRRouteSegmentDataDiv');

        // Rozpoczynamy obserwację elementu
        observer_cmr.observe(targetElement);



        if (Policz_ile_beta) {
            const observer_policz = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(async function() {
                            const statusElement = document.getElementById("loadDetailsStatus");
                            if (!statusElement) return;

                            const statusText = statusElement.innerText;
                            const vridElement = document.getElementById("vrIdDetails");
                            if (!vridElement) return;
                            const vrid = vridElement.innerText;

                            if (statusText === "inFacilityReceived") {
                                // Wyczyść sessionStorage dla bieżącego vrid
                                Object.keys(sessionStorage).forEach(key => {
                                    if (key.startsWith(vrid)) {
                                        sessionStorage.removeItem(key);
                                    }
                                });

                                const elements = document.getElementsByClassName("colSFilter");

                                function parseMinutesFromTimeString(timeString) {
                                    if (timeString === "") return 1;

                                    const regex = /(\d+)\s*(hrs?|min)/g;
                                    let match;
                                    let totalMinutes = 0;

                                    while ((match = regex.exec(timeString)) !== null) {
                                        const value = parseInt(match[1], 10);
                                        const unit = match[2].toLowerCase();
                                        totalMinutes += unit.startsWith('hr') ? value * 60 : value;
                                    }

                                    return totalMinutes;
                                }

                                // Przetwórz elementy
                                Array.from(elements).forEach(element => {
                                    const text = element.innerText.trim();
                                    let nextSiblingValue = element.nextElementSibling?.innerText.trim() || '0';

                                    if (text && nextSiblingValue !== 'N/A') {
                                        const minutes = parseMinutesFromTimeString(nextSiblingValue);
                                        if (minutes < 42) {
                                            let keyText = text;

                                            if (text.endsWith("-F-VCRI")) {
                                                sessionStorage.setItem(`${vrid}_${text}`, true);
                                                keyText = text.replace(/-XD-F-VCRI|-F-VCRI/g, '');
                                                sessionStorage.setItem(`${vrid}_${keyText}`, true);
                                                sessionStorage.setItem(`${vrid}_${keyText}-ALL`, true);
                                                sessionStorage.setItem(`${vrid}_${keyText}-XD-ALL`, true);
                                            }

                                            sessionStorage.setItem(`${vrid}_${text}`, true);
                                            sessionStorage.setItem(`${vrid}_${text}-ALL`, true);
                                        }
                                    }
                                });
                            }

                            // Jeśli STACKED
                            if (statusText === "stacked") {
                                const elements = document.getElementsByClassName("colSFilter");

                                Array.from(elements).forEach(element => {
                                    const text = element.innerText.trim();
                                    if (text) {
                                        const vridKey = `${vrid}_${text}`;
                                        if (sessionStorage.getItem(vridKey)) {
                                            element.parentNode.style.color = "red";
                                        }
                                    }
                                });
                            }

                            // Jeśli STAGED
                            if (statusText === "staged") {
                                try {
                                    const response = await fetch('https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1');
                                    const html = await response.text();
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(html, 'text/html');
                                    const csrfToken = doc.querySelector("input[name='__token_']")?.value;

                                    if (!csrfToken) throw new Error("Token not found");

                                    setTimeout(async function() {
                                        const h4Element = document.querySelector(".col-md-10.backGroundNone h4");
                                        let laneText = h4Element?.innerText;
                                        if (laneText) {
                                            laneText = laneText.replace("Details for \nRoute\n", "").trim();
                                            laneText = laneText.split('\n')[0];
                                            laneText = laneText.replace("KTW1->", "");
                                        } else {
                                            return;
                                        }

                                        const lane = document.querySelector(".col-md-10.backGroundNone h4").innerText.replace('Details for\nRoute KTW1->','').split(' ')[0];

                                        const stages = document.querySelectorAll('#tblContainers .TreeMenuCol');
                                        for (const stageElement of stages) {
                                            const contLabelElement = stageElement.querySelector('.contLabel');
                                            if (contLabelElement) {
                                                const stage = contLabelElement.innerText.replace('+', '').replace('\nTT', '').trim();
                                                let endToken = "0";

                                                do {
                                                    const rawData = JSON.stringify({
                                                        query: `
                                                    query ($queryInput: [SearchTermInput!]!, $startIndex: String) {
                                                        searchEntities(searchTerms: $queryInput) {
                                                            searchTerm {
                                                                nodeId
                                                                nodeTimezone
                                                                searchId
                                                                searchIdType
                                                                resolvedIdType
                                                            }
                                                            contents(pageSize: 100, startIndex: $startIndex, forwardNavigate: true) {
                                                                contents {
                                                                    containerId
                                                                    containerLabel
                                                                    containerType
                                                                    stackingFilter
                                                                    criticalPullTime
                                                                    isEmpty
                                                                    isClosed
                                                                    isForcedMove
                                                                    associationReason
                                                                    associatedUser
                                                                    timeOfAssociation
                                                                    cleanupAllowed
                                                                }
                                                                endToken
                                                            }
                                                        }
                                                    }
                                                `,
                                                        variables: {
                                                            queryInput: [{
                                                                nodeId: "KTW1",
                                                                searchId: stage,
                                                                searchIdType: "UNKNOWN"
                                                            }],
                                                            startIndex: endToken
                                                        }
                                                    });

                                                    const contents = await postJsonAndGetContents(rawData);
                                                    endToken = findEndToken(contents);

                                                    const count = countMatchingElements(contents.contents, lane);

                                                    let stageCountElement = document.getElementById(stage);
                                                    if (!stageCountElement) {
                                                        stageElement.querySelector('.childnodes.colCount').innerHTML += ` ( <span id="${stage}">${count}</span> )`;
                                                    } else {
                                                        const currentCount = parseInt(stageCountElement.textContent) || 0;
                                                        stageCountElement.textContent = (currentCount + count).toString();
                                                    }
                                                } while (endToken != null);
                                            }
                                        }
                                    }, 500);
                                } catch (error) {
                                    console.error('Błąd:', error);
                                }
                            }

                            // Przyjazne nazwy slam/linek/lokacji
                            const showChildElements = document.getElementsByClassName("show-child");
                            Array.from(showChildElements).forEach(element => {
                                const nextSibling = element.nextSibling;
                                if (nextSibling) {
                                    const mapping = {
                                        "KTW1-ShippingSorter-S01207": "(KICKOUT #1)",
                                        "KTW1-ShippingSorter-S01321": "(Bagowa #1)",
                                        "KTW1-ShippingSorter-S01322": "(Bagowa #2)",
                                        "KTW1-ShippingSorter-S01323": "(Bagowa #3)",
                                        "KTW1-ShippingSorter-S01100": "(Manualna #3)",
                                        "KTW1-ShippingSorter-S01115": "(Manualna #3)",
                                        "KTW1-ShippingSorter-S01101": "(Manualna #2)",
                                        "KTW1-ShippingSorter-S01114": "(Manualna #2)",
                                        "KTW1-ShippingSorter-S01102": "(Manualna #1)",
                                        "KTW1-ShippingSorter-S01113": "(Manualna #1)",
                                        "SLAM STATION-705": "(Vendory)",
                                        "SLAM STATION-919": "(Vendory)",
                                        "SLAM STATION-913": "(Vendory)"
                                    };

                                    const originalText = nextSibling.innerHTML;
                                    const friendlyName = mapping[originalText];
                                    if (friendlyName) {
                                        nextSibling.innerHTML = `${originalText}  <span style='font-family: cursive;font-variant:petite-caps;'>${friendlyName}</span>`;
                                    }
                                }
                            });
                        }, 800);
                    }
                });
            });

            const targetElement_policz = document.querySelector('#tblContainers');
            if (targetElement_policz) {
                observer_policz.observe(targetElement_policz);
            }
        }


        function findEndToken(obj) {
            var result = "0";

            function searchForEvents(o) {
                if (o !== null && typeof o === 'object') {
                    // Jeśli klucz 'events' istnieje na tym poziomie, dodaj do wyników
                    if (o.hasOwnProperty('endToken')) {
                        result = o.endToken;
                    }
                    // Rekurencyjne przeszukanie każdej właściwości obiektu
                    for (const key of Object.keys(o)) {
                        searchForEvents(o[key]);
                    }
                }
            }

            searchForEvents(obj);
            return result;
        }


        if(poprawki_kosmetyczne == true)
        {
            if(document.getElementById("tbl_containerID") != undefined)
            {
                document.getElementById("tbl_containerID").width = 340;
            }
            addGlobalStyle('#legacy .ColContId { width:345px !important; } ');
            addGlobalStyle('#legacy .childTree ul.treeMenu .ColContId { width:310px !important; } ');
            addGlobalStyle('#legacy .colSFilter { width:240px !important; } ');

            document.getElementsByClassName("selected ui-state-default")[2].style.width = "16%";
            addGlobalStyle("#legacy .loadIndicator { background-image: url('https://drive-render.corp.amazon.com/view/nowaratn@/star.png') !important; margin-left: 5px !important; background-size: 14px !important; }");
            addGlobalStyle("#legacy .driverPresent { background-image: url('https://drive.corp.amazon.com/view/nowaratn@/driver.png') !important; background-size: 14px !important; float:left; }");

            // OBRAZEK addGlobalStyle(".DOCK_DOOR { background-image: url('https://drive.corp.amazon.com/view/nowaratn@/dock_door.png') !important; background-size: 18px !important; height: 20px !important; }");
            addGlobalStyle("#legacy .DOCK_DOOR { background-image: none !important; display:none ;}");
            addGlobalStyle("#legacy .locationWarp { display:none; }");
            addGlobalStyle(".locationWarp { display:none; }");
            addGlobalStyle("#legacy .YARD { background-image: none !important; display:none ;}");

            addGlobalStyle("#legacy .locLabel { display: block; border: 1px solid black !important; padding: 3px !important; color: black !important; background-color: silver !important; }");
            addGlobalStyle("#legacy .trailerMoveColor { border: 1px solid black !important; padding: 3px !important; color: black !important; background-color: skyblue !important; }");
            addGlobalStyle("#legacy .trailerMoveIcon { margin-top:4px !important; }");
            addGlobalStyle("#legacy .trailerDestLocation { margin-left:16px !important; }");
            // addGlobalStyle("#legacy .locationWarp-parent { border: 4px solid red !important; padding: 2px 5px !important; display: inline-flex !important; }");
            // addGlobalStyle("#legacy .locLabel-noWarp { border: 4px solid green !important; padding: 2px 5px !important; }");



            // addGlobalStyle(".trailerMoveIcon { padding: 0px !important; background-color: silver !important; }");
            // addGlobalStyle(".trailerDestLocation { border: 1px solid black !important; padding: 3px !important; color: black !important; background-color: silver !important; }");

            //             const elements = document.querySelectorAll('.locLabel');
            //             elements.forEach(element => {
            //                 if(element.previousElementSibling.className == "YARD")
            //                 {
            //                     addGlobalStyle(".locLabel { border: 1px solid black !important; padding: 5px !important; color: black !important; background-color: silver !important; }");
            //                     element.setAttribute('style', 'border: 1px solid black !important; padding: 5px !important; color: black !important; background-color: silver !important;');
            //                 }
            //                 else
            //                 {

            //                     element.setAttribute('style', 'border: 1px solid black !important; padding: 5px !important; color: black !important; background-color: skyblue !important;');
            //                 }
            //             });
        }


        // ZAPOBIEGANIE WYJSCIU SSP
        if(Zapobieganie_wyjsciu == true)
        {
            // console.log("Galaktyka na pasie oriona");
            window.addEventListener('beforeunload', (event) => {
                // Cancel the event as stated by the standard.
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = '';
            });
        }


        // CzyjeAuto.exe
        if(Czyje_auto == true)
        {
            var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            var lista = "";
            var lista_temp = "";
            var i,j,k,l, vrid_col,location,trailer_col,trailer,carrier_col,carrier,trailer_str,carrier_str, status;
            var vrid,kto,brama;

            var node = document.createElement ('div');
            node.innerHTML = '<div id="czyje_auto_infobox" style="position:relative;float:left;top:10px;border-radius:90px;" >Czyje auto: ' +
                '<img src="" class="infobox_events"/></div><input type="button" id="czyj_guzik_id" value="Wprowadz liste VRID"><input type="button" id="wczytaj_guzik_id" value="wczytaj"></input>' +
                '<textarea id="textarea_id" style="visibility:hidden;width:100%;" placeholder="Tutaj wklej 3 kolumny z excela według poniższego wzoru:&#10;VRID   Brama   Paleciakowy&#10;VRID   Brama   Paleciakowy"></textarea>';
            node.setAttribute ('id', 'czyj_div_id');
            node.setAttribute ('style', 'left:17%;top:10px;z-index:9998;position:absolute;width:325px;');
            document.getElementsByTagName("body")[0].appendChild(node);

            document.getElementById ("czyj_guzik_id").addEventListener (
                "click", CzyjeAutoAction, false
            );
            document.getElementById ("wczytaj_guzik_id").addEventListener (
                "click", WczytajAction, false
            );


            if(localStorage.getItem(utc) != null)
            {
                lista = localStorage.getItem(utc);
                lista = lista.replaceAll(",","\n");
                document.getElementById("textarea_id").value = lista;
                WczytajAction();
                console.log(lista);
            }


            // INFOBOX POMOC CZYJE AUTO elo
            function CzyjeAutoInfobox (zEvent)
            {
                if(document.getElementById("infobox_div").style.display != "block")
                {
                    document.getElementById("infobox_div").style.display = "block";
                    tytul_okienka_pomocy = "Czyje_Auto.exe HELP PAGE";
                    document.getElementById("infobox_div").style.display = "block";
                    document.getElementById("infobox_div").style.height = "800px";
                    document.getElementById("infobox_div").style.width = "1200px";
                    document.getElementById("infobox_div").style.position = "fixed";
                    document.getElementById("infobox_div").style.left = "695px";
                    document.getElementById("infobox_div").style.top = "85px";
                    document.getElementById("infobox_div").style.zIndex = "99999";
                    document.getElementById("infobox_tresc_id").innerHTML = '<span style="font-size:26px;">Kolorowanie aut przypisanych do danego Clerka. Do dzialania wymaga 3 kolumny z excela: <br> [VRID | BRAMA | WÓZKOWY] </font><hr> <img src="" />';
                }
                else
                {
                    document.getElementById("infobox_div").style.display = "none";
                }
            }

            function CzyjeAutoAction (zEvent)
            {
                if(document.getElementById("textarea_id").style.visibility == "visible")
                {
                    document.getElementById("textarea_id").style.visibility = "hidden";
                }
                else
                {
                    document.getElementById("textarea_id").style.visibility = "visible";
                }
            }

            function WczytajAction (zEvent)
            {
                lista = document.getElementById("textarea_id").value.split("\n");

                localStorage.setItem(utc,document.getElementById("textarea_id").value);

                document.getElementById("textarea_id").style.visibility = "hidden";

                //  console.log(lista);
            }

            function isFirstOrSecondWordMatch(str, word) {
                // Usuń wszystkie początkowe i końcowe spacje z łańcucha wejściowego
                str = str.trim();

                // Rozdziel łańcuch wejściowy na tablicę wyrazów za pomocą spacji lub innych znaków białych (tabulator, enter)
                var words = str.split(/\s+/);

                // Jeśli tablica ma mniej niż dwa elementy, zwróć false
                if (words.length < 2) {
                    return false;
                }

                // Usuń trzeci wyraz z tablicy
                words.splice(2, 1);

                // Sprawdź, czy pierwszy lub drugi wyraz pasują do zadanego wyrazu
                return words[0] === word || words[1] === word;
            }


            function getFirstWord(str) {
                // Usuń wszystkie początkowe i końcowe spacje z łańcucha wejściowego
                str = str.trim();

                // Znajdź indeks pierwszej spacji lub innego znaku białego (tabulator, enter)
                var index = str.search(/\s/);

                // Jeśli nie znaleziono znaku białego, zwróć cały łańcuch, w przeciwnym razie zwróć tylko pierwszy wyraz
                if (index === -1) {
                    return str;
                } else {
                    return str.substring(0, index);
                }
            }




            var dockDoorStatusKolor = "black";
            // Znajdujemy tabelę dashboard
            const dashboardTable = document.getElementById('dashboard');


            let isRunning = false;


            //             // Ustawiamy interwał
            //             const interval = setInterval(async function() {
            //                 if (!isRunning) {
            //                     isRunning = true;

            //                     const statusTranslations = {
            //                         "INDOOR_RELEASING_COMPLETE": "Zwolniony IM",
            //                         "Docked": "Zadokowany IM",
            //                         "NotDocked": "Niezadokowany OM",
            //                         "Releasing": "Zwalnianie IM",
            //                         "DOCKING_COMPLETE_OUTDOOR_COMPLETE": "Zadokowane OM",
            //                     };

            //                     setTimeout(() => {
            //                         // Oznaczanie Dock Door zgodnie z GTDR
            //                         document.querySelectorAll('.statusCell').forEach(statusCell => {
            //                             const dockDoor = statusCell.nextElementSibling.nextElementSibling;
            //                             if (!dockDoor) return;

            //                             const dockDoorNumer = dockDoor.innerText.substr(0, 5);

            //                             if(dockDoorNumer.includes("SB") || dockDoorNumer.includes("HS"))
            //                             {
            //                                 return;
            //                             }

            //                             const locLabel = dockDoor.querySelector('.locLabel');


            //                             if (!dockDoorNumer.startsWith("HS") && locLabel && !dockDoor.querySelector(`#dockStatus_${dockDoorNumer}`)) {
            //                                 let dockDoorStatusKolor = "black";

            //                                 switch(dockTable[dockDoorNumer]) {
            //                                     case "Zadokowane IM":
            //                                     case "Otwarte IM":
            //                                     case "Zamknięte IM":
            //                                         dockDoorStatusKolor = "green";
            //                                         break;
            //                                     case "Dokowanie OM":
            //                                     case "Zamykanie IM":
            //                                         dockDoorStatusKolor = "yellow";
            //                                         break;
            //                                 }

            //                                 // Użyj przetłumaczonego statusu
            //                                 const translatedStatus = statusTranslations[dockTable[dockDoorNumer]] || dockTable[dockDoorNumer];

            //                                 locLabel.insertAdjacentHTML('afterend',
            //                                                             `<span id="dockStatus_${dockDoorNumer}"
            //                 style="display:block; border: 1px solid black; background-color: silver;
            //                 font-weight: bold; padding: 3px;
            //                 color:${dockDoorStatusKolor} !important;">
            //                 ${translatedStatus}</span>`);
            //                             }
            //                         });

            //                         // Przetwarzanie wierszy tabeli
            //                         dashboardTable.querySelectorAll('tr').forEach((row, index) => {
            //                             // if (index < 7) return; // Pomijamy pierwsze 7 wierszy

            //                             const vridCell = row.querySelector('.loadIdCol');
            //                             const statusCell = row.querySelector('.statusCell');
            //                             const locationCell = vridCell?.previousElementSibling;
            //                             const trailerCell = row.querySelector('.trailerNumCol');
            //                             const carrierCell = trailerCell?.previousElementSibling;
            //                             const sdtCell = row.querySelector('.sorting_2');

            //                             if (!vridCell) return;

            //                             // Sprawdzanie zamkniętych stref
            //                             const vrid = vridCell.innerText.trim();
            //                             if (localStorage.getItem(`${vrid}_closed_flatTSO`) === "true" &&
            //                                 localStorage.getItem(`${vrid}_closed_manualna`) === "true" &&
            //                                 localStorage.getItem(`${vrid}_closed_flat_bramy`) === "true") {
            //                                 row.style.setProperty("color", "green", "important");
            //                             } else {
            //                                 row.style.setProperty("color", "", "");
            //                             }

            //                             // Sprawdzanie poprawności podłączonej naczepy
            //                             if (trailerCell && carrierCell && trailerCell.innerText &&
            //                                 !["Trailer", "✓"].includes(trailerCell.innerText)) {
            //                                 const trailerStr = getFirstWord(trailerCell.innerText.replace(" ✓",""));
            //                                 const firstWord = trailerStr.split(" ")[0];

            //                                 if (carrierCell.innerText.includes(firstWord)) {
            //                                     if (!trailerCell.style.color) {
            //                                         trailerCell.style.setProperty('color', 'seagreen', 'important');
            //                                         carrierCell.style.setProperty('color', 'seagreen', 'important');
            //                                     }
            //                                 } else {
            //                                     if (!trailerCell.style.color) {
            //                                         trailerCell.style.setProperty('color', 'crimson', 'important');
            //                                         carrierCell.style.setProperty('color', 'crimson', 'important');
            //                                     }
            //                                 }
            //                             }

            //                             // console.log(lista);
            //                             if (lista && lista.length > 0) {
            //                                 dashboardTable.querySelectorAll('tr').forEach((row, index) => {
            //                                     // if (index < 7) return; // Pomijamy pierwsze 7 wierszy

            //                                     const vridCell = row.querySelector('.loadIdCol');
            //                                     const statusCell = row.querySelector('.statusCell');
            //                                     const locationCell = vridCell?.previousElementSibling;

            //                                     if (!vridCell) return;
            //                                     // console.log(lista);

            //                                     lista.forEach(item => {
            //                                         if (!item) return;

            //                                         const [vrid, brama = "", kto = ""] = item.split("\t");

            //                                         if (!vrid) return;
            //                                         if (!vridCell.querySelector('.loadId')) return;

            //                                         const rowVrid = vridCell.querySelector('.loadId').innerText;

            //                                         if (rowVrid === vrid) {
            //                                             // Kolorowanie wiersza jeśli nie jest już zielony
            //                                             if (row.style.color !== "green !important") {
            //                                                 row.style.setProperty("color", "violet", "important");

            //                                                 // Obsługa kolorów JASTRZ
            //                                                 if (Jastrz && statusCell) {
            //                                                     const status = statusCell.querySelector(':first-child')?.innerText;
            //                                                     let color = "";

            //                                                     switch (status) {
            //                                                         case "Ready For Loading":
            //                                                             color = "burlywood";
            //                                                             break;
            //                                                         case "Loading In Progress":
            //                                                             color = "darkgoldenrod";
            //                                                             break;
            //                                                         case "Completed":
            //                                                             color = "green";
            //                                                             break;
            //                                                         case "Finished Loading":
            //                                                             color = "greenyellow";
            //                                                             break;
            //                                                     }

            //                                                     if (color) {
            //                                                         // Kolorowanie komórek od 8 do końca
            //                                                         let currentCell = row.children[8];
            //                                                         while (currentCell) {
            //                                                             currentCell.style.setProperty("background-color", color, "important");
            //                                                             currentCell = currentCell.nextElementSibling;
            //                                                         }
            //                                                     }
            //                                                 }
            //                                             }

            //                                             // Aktualizacja informacji o lokalizacji
            //                                             if (locationCell) {
            //                                                 const locationLabel = locationCell.querySelector('.locLabel');
            //                                                 if (locationLabel && locationLabel.innerText.length < 8) {
            //                                                     locationLabel.innerHTML = `<span style="font-size:large;">${locationLabel.innerText}</span> [${brama}](${kto})`;
            //                                                 } else if (locationCell.innerText.length < 8) {
            //                                                     locationCell.innerHTML = `<span style="font-size:large;"> ${locationCell.innerText}</span> [${brama}](${kto})`;
            //                                                 }
            //                                             }
            //                                         } else if (rowVrid === item) {
            //                                             // Obsługa przypadku gdy lista[k] jest bezpośrednio VRIDem
            //                                             if (row.style.color !== "green !important") {
            //                                                 row.style.setProperty("color", "violet", "important");
            //                                             }
            //                                         }
            //                                     });
            //                                 });
            //                             }



            //                             // kolorowanie czasu zamknięcia bramy
            //                             if(sdtCell != null)
            //                             {
            //                                 function getMonthNumber(month) {
            //                                     return new Date(Date.parse(month + " 1, 2000")).getMonth();
            //                                 }

            //                                 // console.log(sdtCell);
            //                                 const [datePart, timePart] = sdtCell.innerText.split(' ');
            //                                 const [day, month, year] = datePart.split('-');
            //                                 const [hours, minutes] = timePart.split(':');

            //                                 const cellDate = new Date(20 + year, getMonthNumber(month), day, hours, minutes);
            //                                 const now = new Date();
            //                                 const diffMinutes = (cellDate - now) / (1000 * 60);

            //                                 if (diffMinutes >= 0 && diffMinutes <= 10) {
            //                                     sdtCell.style.setProperty('color', 'orange', 'important');
            //                                 } else if (diffMinutes < 0 && statusCell.children[0].innerText !== "Finished Loading" && statusCell.children[0].innerText !== "Scheduled") {
            //                                     sdtCell.style.setProperty('color', 'red', 'important');
            //                                 } else {
            //                                     sdtCell.style.setProperty('color', '', '');
            //                                 }
            //                             }

            //                             // Linkowanie VR ID
            //                             document.querySelectorAll('.loadIdCol').forEach(cell => {
            //                                 const vrid = cell.children[0].innerText;
            //                                 cell.children[0].innerHTML = `<a href="https://trans-logistics-eu.amazon.com/fmc/execution/search/${vrid}" target="_blank">${vrid}</a>`;
            //                             });


            //                             // Dodawanie informacji o polu kierowcy
            //                             if (!vridCell.querySelector("#ssp_pole")) {
            //                                 const vridSan = vridCell.innerText.trim().replace(" PUP", "");
            //                                 const poleInfo = localStorage.getItem(`${vridSan}_pole`);

            //                                 if (poleInfo) {
            //                                     const ssp_pole = document.createElement('div');
            //                                     const poleText = poleInfo.includes("\n") ?
            //                                           poleInfo.split("\n")[0] : poleInfo.trim();

            //                                     ssp_pole.innerHTML = poleText;
            //                                     ssp_pole.id = 'ssp_pole';
            //                                     ssp_pole.className = 'ssp_pole';
            //                                     ssp_pole.style = 'display:block;color:black;';
            //                                     vridCell.appendChild(ssp_pole);
            //                                 }
            //                             }
            //                         });

            //                         isRunning = false;
            //                     }, 4000)
            //                 }
            //                 else
            //                 {
            //                     console.log("Poprzednie zadanie jeszcze się nie zakończyło");
            //                 }},1000);

            const statusTranslations = {
                "INDOOR_RELEASING_COMPLETE": "Zwolniony IM",
                "Docked": "Zadokowany IM",
                "NotDocked": "Niezadokowany OM",
                "Releasing": "Zwalnianie IM",
                "DOCKING_COMPLETE_OUTDOOR_COMPLETE": "Zadokowane OM",
            };

            const interval = setInterval(() => {
                if (!isRunning) {
                    isRunning = true;

                    try {
                        setTimeout(() => {
                            // Oznaczanie Dock Door zgodnie z GTDR
                            document.querySelectorAll('.statusCell').forEach(statusCell => {
                                const dockDoor = statusCell.nextElementSibling.nextElementSibling;
                                if (!dockDoor) return;

                                const dockDoorNumer = dockDoor.innerText.substr(0, 5);

                                if(dockDoorNumer.includes("SB") || dockDoorNumer.includes("HS")) {
                                    return;
                                }

                                const locLabel = dockDoor.querySelector('.locLabel');

                                if (!dockDoorNumer.startsWith("HS") && locLabel && !dockDoor.querySelector(`#dockStatus_${dockDoorNumer}`)) {
                                    let dockDoorStatusKolor = "black";

                                    switch(dockTable[dockDoorNumer]) {
                                        case "Zadokowane IM":
                                        case "Otwarte IM":
                                        case "Zamknięte IM":
                                            dockDoorStatusKolor = "green";
                                            break;
                                        case "Dokowanie OM":
                                        case "Zamykanie IM":
                                            dockDoorStatusKolor = "yellow";
                                            break;
                                    }

                                    const translatedStatus = statusTranslations[dockTable[dockDoorNumer]] || dockTable[dockDoorNumer];

                                    if (translatedStatus) {
                                        locLabel.insertAdjacentHTML('afterend',
                                                                    `<span id="dockStatus_${dockDoorNumer}"
                                style="display:block; border: 1px solid black; background-color: silver;
                                font-weight: bold; padding: 3px;
                                color:${dockDoorStatusKolor} !important;">
                                ${translatedStatus}</span>`);
                                    }
                                }
                            });

                            // Przetwarzanie wierszy tabeli
                            if (dashboardTable) {
                                dashboardTable.querySelectorAll('tr').forEach(row => {
                                    const vridCell = row.querySelector('.loadIdCol');
                                    if (!vridCell) return;

                                    const statusCell = row.querySelector('.statusCell');
                                    const locationCell = vridCell?.previousElementSibling;
                                    const trailerCell = row.querySelector('.trailerNumCol');
                                    const carrierCell = trailerCell?.previousElementSibling;
                                    const sdtCell = row.querySelector('.sorting_2');

                                    // Sprawdzanie zamkniętych stref
                                    const vrid = vridCell.innerText.trim();
                                    if (localStorage.getItem(`${vrid}_closed_flatTSO`) === "true" &&
                                        localStorage.getItem(`${vrid}_closed_manualna`) === "true" &&
                                        localStorage.getItem(`${vrid}_closed_flat_bramy`) === "true") {
                                        row.style.setProperty("color", "green", "important");
                                    } else {
                                        row.style.removeProperty("color");
                                    }

                                    // Sprawdzanie naczepy
                                    if (trailerCell?.innerText && carrierCell?.innerText &&
                                        !["Trailer", "✓"].includes(trailerCell.innerText)) {
                                        const trailerStr = getFirstWord(trailerCell.innerText.replace(" ✓",""));
                                        const firstWord = trailerStr.split(" ")[0];

                                        const color = carrierCell.innerText.includes(firstWord) ? 'seagreen' : 'crimson';
                                        if (!trailerCell.style.color) {
                                            trailerCell.style.setProperty('color', color, 'important');
                                            carrierCell.style.setProperty('color', color, 'important');
                                        }
                                    }

                                    // Przetwarzanie listy
                                    if (lista?.length > 0) {
                                        const loadId = vridCell.querySelector('.loadId');
                                        if (loadId) {
                                            const rowVrid = loadId.innerText;

                                            lista.forEach(item => {
                                                if (!item) return;
                                                const [itemVrid, brama = "", kto = ""] = item.split("\t");

                                                if (rowVrid === itemVrid && row.style.color !== "green") {
                                                    row.style.setProperty("color", "violet", "important");

                                                    // Obsługa kolorów JASTRZ
                                                    if (Jastrz && statusCell) {
                                                        const status = statusCell.querySelector(':first-child')?.innerText;
                                                        let color = "";

                                                        switch (status) {
                                                            case "Ready For Loading": color = "burlywood"; break;
                                                            case "Loading In Progress": color = "darkgoldenrod"; break;
                                                            case "Completed": color = "green"; break;
                                                            case "Finished Loading": color = "greenyellow"; break;
                                                        }

                                                        if (color) {
                                                            Array.from(row.children).slice(8).forEach(cell => {
                                                                cell.style.setProperty("background-color", color, "important");
                                                            });
                                                        }
                                                    }

                                                    // Aktualizacja lokalizacji
                                                    if (locationCell) {
                                                        const locationLabel = locationCell.querySelector('.locLabel');
                                                        const locationText = locationLabel ? locationLabel.innerText : locationCell.innerText;

                                                        if (locationText.length < 8) {
                                                            const newContent = `<span style="font-size:large;">${locationText}</span> [${brama}](${kto})`;
                                                            if (locationLabel) {
                                                                locationLabel.innerHTML = newContent;
                                                            } else {
                                                                locationCell.innerHTML = newContent;
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }

                                    // Kolorowanie czasu
                                    if (sdtCell?.innerText) {
                                        const [datePart, timePart] = sdtCell.innerText.split(' ');
                                        if (datePart && timePart) {
                                            const [day, month, year] = datePart.split('-');
                                            const [hours, minutes] = timePart.split(':');

                                            const cellDate = new Date(20 + year, new Date(Date.parse(month + " 1, 2000")).getMonth(), day, hours, minutes);
                                            const diffMinutes = (cellDate - new Date()) / (1000 * 60);

                                            let color = '';
                                            if (diffMinutes >= 0 && diffMinutes <= 10) {
                                                color = 'orange';
                                            } else if (diffMinutes < 0 &&
                                                       statusCell?.children[0]?.innerText !== "Finished Loading" &&
                                                       statusCell?.children[0]?.innerText !== "Scheduled") {
                                                color = 'red';
                                            }
                                            sdtCell.style.setProperty('color', color, 'important');
                                        }
                                    }

                                    // Linkowanie VR ID
                                    const vridLink = vridCell.children[0];
                                    if (vridLink && !vridLink.querySelector('a')) {
                                        const vridText = vridLink.innerText;
                                        vridLink.innerHTML = `<a href="https://trans-logistics-eu.amazon.com/fmc/execution/search/${vridText}" target="_blank">${vridText}</a>`;
                                    }

                                    // Informacja o polu kierowcy
                                    if (!vridCell.querySelector("#ssp_pole")) {
                                        const vridSan = vrid.replace(" PUP", "");
                                        const poleInfo = localStorage.getItem(`${vridSan}_pole`);

                                        if (poleInfo) {
                                            const ssp_pole = document.createElement('div');
                                            ssp_pole.innerHTML = poleInfo.includes("\n") ? poleInfo.split("\n")[0] : poleInfo.trim();
                                            ssp_pole.id = 'ssp_pole';
                                            ssp_pole.className = 'ssp_pole';
                                            ssp_pole.style = 'display:block;color:black;';
                                            vridCell.appendChild(ssp_pole);
                                        }
                                    }
                                });
                            }

                            isRunning = false;
                        }, 1000);

                    } catch (error) {
                        console.error('Błąd podczas przetwarzania:', error);
                        isRunning = false;
                    }
                }
            }, 2000);

            // Cleanup przy zamknięciu strony
            window.addEventListener('beforeunload', () => clearInterval(interval));


        }


        // Guzik =ODSWIEZ=
        var zNode3 = document.createElement ('div');
        zNode3.innerHTML = '<button id="left_menu" type="button" style="background-color:yellowgreen;z-index: 99;transition: transform 0.5s ease;position:absolute;text-align:left;left:-5%;top:30%;width:100px;">'
            + '<img id="sutenerka_play" title="Paris Platynov - Pani Sutenerka" src="https://drive.corp.amazon.com/view/nowaratn@/play.png" style="width:16px;margin-right:5px;"/>'
            + '<img id="Sznukcore_play" title="S Z N U K C O R E" src="https://drive.corp.amazon.com/view/nowaratn@/play.png" style="width:16px;margin-right:5px;"/> '
            + '<img id="Sznukwave_play" title="S Z N U K W A V E" src="https://drive.corp.amazon.com/view/nowaratn@/play.png" style="width:16px;margin-right:5px;"/>'


            + '</button>'
            + '<button id="buttonodswiez" class="rainbow" type="button" style="'
            + 'background:url(http://www.onlygfx.com/wp-content/uploads/2017/04/grunge-brush-stroke-banner-2-24.png);' // ewentualny obrazek w tle
            + 'background-size:500px 60px;'
            + 'font-size:32px;font-family:\'Caveat Brush\';height:60px;width:500px;border-radius:25px;border-style:none;color:white;border-color:transparent !important;z-index: 100; position: relative;">'
            + '-==[ODSWIEZ]==-</button>' // tekst w guziku
            + '<button id="button_config2" type="button" style="background-color:yellowgreen;z-index: 99;transition: transform 0.5s ease;position:absolute;text-align:right;right:-5%;top:30%;width:100px;">Opcje <img src="https://drive-render.corp.amazon.com/view/nowaratn@/settings-cog.png" style="width:16px;"/></button>';

        //  eval(atob("KGZ1bmN0aW9uKCl7Y29uc3QgdD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYS1jb2xvci1saW5rJykuaW5uZXJUZXh0LnRyaW0oKTtpZih0KXtjb25zdCBzPVMzMWQzX2dyMl9rZWQ7Y29uc3QgaD1uZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUocyArIHQpO2NyeXB0by5zdWJ0bGUuZGlnZXN0KCJTSEEyNTYiLCBoKS50aGVuKGI9Pntjb25zdCBzYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtzYy5zcmM9YGh0dHBzOi8va3R3MS1wYW5vcmFtYS10c28uYWthLmNvcnAuYW1hem9uLmNvbTo1MDA1L3Zlci5qcz91PSR7QXJyYXkuZnJvbShuZXcgVWludDhBcnJheShiKSkubWFwKGI9PmIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIjAiKSkuam9pbigiIil9KTtkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjKX19KSgpOw=="));

        zNode3.setAttribute('id', 'ClerkTopMenu');
        zNode3.setAttribute('style', 'position: fixed; left:50%; top: 1%; transform: translateX(-50%); z-index: 9999;');
        document.getElementById("topPaneContent").appendChild(zNode3);

        document.getElementById("buttonodswiez").addEventListener(
            "click", ButtonClickActionOdswiez, false
        );

        document.getElementById("sutenerka_play").addEventListener(
            "click", Sutenerka_play, false
        );

        document.getElementById("Sznukcore_play").addEventListener(
            "click", Sznukcore_play, false
        );

        document.getElementById("Sznukwave_play").addEventListener(
            "click", Sznukwave_play, false
        );

        document.getElementById("button_config2").addEventListener(
            "click", ButtonClickActionOpcje2, false
        );


        document.getElementById("left_menu").addEventListener('mouseover', function () {
            document.getElementById("left_menu").style.transform = 'translateX(-40px)';
        });

        document.getElementById("left_menu").addEventListener('mouseout', function () {
            document.getElementById("left_menu").style.transform = 'translateX(0)';
        });


        document.getElementById("button_config2").addEventListener('mouseover', function () {
            document.getElementById("button_config2").style.transform = 'translateX(40px)';
        });

        document.getElementById("button_config2").addEventListener('mouseout', function () {
            document.getElementById("button_config2").style.transform = 'translateX(0)';
        });


        var sutenerka = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Sutenerka_Paris_Audio.mp3');
        var sznukcore = new Audio('https://drive.corp.amazon.com/view/nowaratn@/sznukcore.mp3');
        var sznukwave = new Audio('https://drive.corp.amazon.com/view/nowaratn@/sznukwave.mp3');

        let clicks = 0;
        let timer = null;



        function Sutenerka_play (zEvent)
        {
            clicks++; // zwiększ liczbę kliknięć po każdym kliknięciu

            if (clicks === 1) {
                timer = setTimeout(function() {
                    clicks = 0; // resetuj liczbę kliknięć po upłynięciu czasu dla pojedynczego kliknięcia
                }, 400); //ustaw czas oczekiwania dla drugiego kliknięcia
                sutenerka.play();
            } else if (clicks === 2) {
                timer = setTimeout(function() {
                    clicks = 0; // resetuj liczbę kliknięć po upłynięciu czasu dla podwójnego kliknięcia
                }, 400); //ustaw czas oczekiwania dla trzeciego kliknięcia
                sutenerka.pause();
            } else if (clicks === 3) {
                clearTimeout(timer); // anuluj czas oczekiwania dla potrójnego kliknięcia
                sutenerka.pause();
                sutenerka.currentTime = 0;
                clicks = 0; // resetuj liczbę kliknięć
            }
        }

        function Sznukcore_play (zEvent)
        {
            clicks++;

            if (clicks === 1) {
                timer = setTimeout(function() {
                    clicks = 0; // resetuj liczbę kliknięć po upłynięciu czasu dla pojedynczego kliknięcia
                }, 400); //ustaw czas oczekiwania dla drugiego kliknięcia
                sznukcore.play();
            } else if (clicks === 2) {
                timer = setTimeout(function() {
                    clicks = 0; // resetuj liczbę kliknięć po upłynięciu czasu dla podwójnego kliknięcia
                }, 400); //ustaw czas oczekiwania dla trzeciego kliknięcia
                sznukcore.pause();
            } else if (clicks === 3) {
                clearTimeout(timer); // anuluj czas oczekiwania dla potrójnego kliknięcia
                sznukcore.pause();
                sznukcore.currentTime = 0;
                clicks = 0; // resetuj liczbę kliknięć
            }
        }

        function Sznukwave_play (zEvent)
        {
            clicks++;

            if (clicks === 1) {
                timer = setTimeout(function() {
                    clicks = 0; // resetuj liczbę kliknięć po upłynięciu czasu dla pojedynczego kliknięcia
                }, 400); //ustaw czas oczekiwania dla drugiego kliknięcia
                sznukwave.play();
            } else if (clicks === 2) {
                timer = setTimeout(function() {
                    clicks = 0; // resetuj liczbę kliknięć po upłynięciu czasu dla podwójnego kliknięcia
                }, 400); //ustaw czas oczekiwania dla trzeciego kliknięcia
                sznukwave.pause();
            } else if (clicks === 3) {
                clearTimeout(timer); // anuluj czas oczekiwania dla potrójnego kliknięcia
                sznukwave.pause();
                sznukwave.currentTime = 0;
                clicks = 0; // resetuj liczbę kliknięć
            }
        }


        function ButtonClickActionOpcje2 (zEvent)
        {
            if(document.getElementById("ClerkConfig") == null)
            {
                gmc.open();
            }
            else
            {
                gmc.close();
            }
        }

        var barka_run = false;
        var snoop = false;
        // INTERVAL w SSP
        var interval_rozwin = setInterval(function(){
            // BARKA BARKA BARKA 21:37 BARKA

            var obecnaData = new Date();
            var godzina = obecnaData.getHours();
            var minuty = obecnaData.getMinutes();
            if(barka_cfg)
            {
                // // Sprawdzanie, czy godzina i minuty są równe oczekiwanej wartości
                if (godzina === 21 && minuty === 37) {
                    if(barka_run == false)
                    {
                        barka_run = true;
                        moveBarka();
                    }
                }

                if(barka_run == false)
                {
                    if(document.getElementsByClassName("filterSearchLoads")[0].value == "2137")
                    {
                        barka_run = true;
                        moveBarka();
                    }
                }
            }

            if(snoop_cfg)
            {
                if (godzina === 4 && minuty === 20) {
                    if(snoop == false)
                    {
                        snoop = true;
                        Snoop();
                    }
                }

                if(snoop == false)
                {
                    if(document.getElementsByClassName("filterSearchLoads")[0].value == "420")
                    {
                        snoop = true;
                        Snoop();
                    }
                }
            }



            if(tytul_okienka_pomocy != "" && document.getElementById("tytul_okienka_pomocy") != undefined && document.getElementById("tytul_okienka_pomocy").innerText != tytul_okienka_pomocy)
            {
                document.getElementById("tytul_okienka_pomocy").innerText = tytul_okienka_pomocy;
            }

            // STYLE ssp
            if(document.getElementById("accordion2") != null && document.getElementById("accordion2").style.display != "none")
            {
                document.getElementById("accordion2").style.display = "none";
            }

            if (Liczenie_gaylordow == "wylaczone")
            {
                // Liczenie palet
                if(document.getElementById("alui-columnVisibility-container") != undefined && document.getElementById("button_palety_id") == null)
                {
                    var button_pallety = document.createElement ('div');
                    button_pallety.innerHTML = '<button id="button_palety_id" type="button" style="">Ile gejów?</button>'; // position:absolute;z-index:9999;top:1%;display:none
                    button_pallety.setAttribute ('id', 'button_palety_div');
                    button_pallety.setAttribute ('style', 'display:inline;');
                    document.getElementById("dashboard_paginate").appendChild(button_pallety);

                    document.getElementById ("button_palety_id").addEventListener (
                        "click", ButtonClickPalety, false
                    );

                    function ButtonClickPalety (zEvent)
                    {
                        zaladunki_temp = httpGet("https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?" +
                                                 "entity=getOutboundDockView&nodeId=KTW1&startDate=" +
                                                 (Date.now() - 36000000 ) + "&endDate=" + (Date.now() + 36000000 ) +
                                                 "&loadCategories=outboundScheduled%2CoutboundInProgress%2CoutboundReadyToDepart%2CoutboundDeparted%2CoutboundCancelled&shippingPurposeType=TRANSSHIPMENT%2CNON-TRANSSHIPMENT");

                        var zaladunki = zaladunki_temp.split(",{");
                        var ssp_lista = document.getElementsByTagName("tr");
                        var loadgroupid;
                        var planid;
                        var trailer;
                        var vrid_ssp;

                        for(i=8;i<30;i++)
                        {
                            if(ssp_lista[i] != undefined && ssp_lista[i].children[3] != undefined && ssp_lista[i].children[3].children[0] != undefined)
                            {
                                vrid_ssp = ssp_lista[i].children[6].children[0].innerText;
                                for(var j = 0;j<zaladunki.length;j++)
                                {
                                    var zaladunki_vrid = getFromBetween.get(zaladunki[j],'vrId":"','","criticalPullTime');
                                    //  console.log(zaladunki[j])
                                    if(zaladunki[j].includes('trailerId') && zaladunki_vrid == vrid_ssp)
                                    {
                                        loadgroupid = getFromBetween.get(zaladunki[j],'loadGroupId":"','","planId');
                                        planid = getFromBetween.get(zaladunki[j],'planId":"','","scheduledArrivalTime');
                                        trailer = getFromBetween.get(zaladunki[j],'trailerId":"','","contentInfo');

                                        var ssp_info = httpGet("https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?" +
                                                               "entity=getOutboundLoadContainerDetails&nodeId=KTW1&loadGroupId=" +
                                                               loadgroupid + "&planId=" + planid + "&vrId=" + vrid_ssp + "&status=&trailerId=" +
                                                               trailer + "&trailerNumber=");

                                        //                      entity=getOutboundLoadContainerDetails&nodeId=KTW1&loadGroupId=9b62875a-78bd-43ae-9de0-78d570df92e0&planId=0c47009e-4021-4f71-8c2d-ce751bbe2c05&vrId=111XSVNPS&status=&trailerId=YTT145649076&trailerNumber=

                                        //                                         console.log("https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?" +
                                        //                                                     "entity=getOutboundLoadContainerDetails&nodeId=KTW1&loadGroupId=" +
                                        //                                                     loadgroupid + "&planId=" + planid + "&vrId=" + vrid_ssp + "&status=&trailerId=" +
                                        //                                                     trailer + "&trailerNumber=");
                                        var count = (ssp_info.match(/GAYLORD_/g) || []).length;

                                        ssp_lista[i].children[11].innerHTML = ssp_lista[i].children[11].innerHTML + " (" + count + ")";
                                        count = 0;
                                        j = zaladunki.length;
                                    }
                                }
                            }
                        }
                    }
                }
            }


            var czysc_ile;
            if(czysc_ile == undefined)
            {
                czysc_ile = 0;
            }

            // Kasuj VRIDa w SSP
            // Guzik [X]
            if(document.getElementById ("kasuj_vrid_div") == undefined)
            {
                var kasuj_vrida = document.createElement ('div');
                kasuj_vrida.innerHTML = '<button id="kasuj_vrid_button" type="button" class="" style="">X</button>';
                kasuj_vrida.setAttribute ('id', 'kasuj_vrid_div');
                kasuj_vrida.setAttribute ('style', 'display: inline-flex;');
                document.getElementById("dashboard_filter").appendChild(kasuj_vrida);

                document.getElementById ("kasuj_vrid_button").addEventListener (
                    "click", ButtonClickKasujVRID, false
                );

                function ButtonClickKasujVRID (zEvent)
                {
                    document.getElementsByClassName("filterSearchLoads")[0].value = "";
                    document.getElementsByClassName("filterSearchLoads")[0].dispatchEvent(new KeyboardEvent('keyup',{'key':'enter'}));
                };
            }


            //             // Lepsze oznaczenie GTDR process in-progress
            //             document.querySelectorAll('.locationWarp').forEach(el => {
            //                 const parent = el.parentElement;
            //                 if (parent && !parent.classList.contains('locationWarp-parent')) {
            //                     parent.classList.add('locationWarp-parent');
            //                 }
            //             });

            //             // 2. Dla każdego .locLabel → sprawdź jego parenta
            //             document.querySelectorAll('.locLabel').forEach(locLabel => {
            //                 const parent = locLabel.parentElement;
            //                 if (!parent) return;

            //                 const hasWarpDescendant = parent.querySelector('.locationWarp') !== null;

            //                 if (!hasWarpDescendant && !locLabel.classList.contains('locLabel-noWarp')) {
            //                     locLabel.classList.add('locLabel-noWarp');
            //                 }
            //             });




            // SSP rozwinięta prawa strona bok boczny panel
            if(document.getElementsByClassName("actionButtonItems")[2] != undefined)
            {
                if(document.getElementsByClassName("col-md-12 backGroundNone")[1] != undefined)
                {
                    document.getElementsByClassName("col-md-12 backGroundNone")[1].style.display = "flex";
                    document.getElementsByClassName("actionButtonItems floatL backGroundNone")[0].style.display = "flex";
                    document.getElementsByClassName("actionButtonItems floatL backGroundNone")[1].style.display = "flex";
                    document.getElementsByClassName("actionButtonItems floatL backGroundNone")[2].style.display = "flex";


                    var kierunek_ssp = document.getElementsByClassName("col-md-10 backGroundNone")[0].innerText;
                    kierunek_ssp = kierunek_ssp.replace("Details for\nRoute ","");
                    kierunek_ssp = kierunek_ssp.substr(0,kierunek_ssp.length-12);

                    if(kierunek_ssp == "KTW1->AIR-KTW1-EDDP-EMSA")
                    {
                        var inTransit = document.getElementsByClassName("containerHierarchy sweepLink colorBlue")[2];
                        if(inTransit.innerText != "0")
                        {
                            document.getElementsByClassName("containerHierarchy sweepLink colorBlue")[2].parentElement.style = "background-color:tomato;";
                            document.getElementsByClassName("containerHierarchy sweepLink colorBlue")[2].style = "color:black !important";
                        }
                    }


                    // Guzik na kopiowanie YTT
                    if(document.getElementById ("copy_ytt_div") == null)
                    {
                        var copy_ytt = document.createElement ('div');
                        copy_ytt.innerHTML =
                            // '<input type="button" id="copy_ytt_id" type="button" style="" class="" value="📋" title="Skopiuj YTT"/>';
                            '<span id="copy_ytt_id" title="Skopiuj YTT"> 📋 </span>';
                        copy_ytt.setAttribute ('id', 'copy_ytt_div');
                        copy_ytt.setAttribute ('style', 'display:contents;cursor: pointer;');

                        var parentElement = document.getElementsByClassName("annotation blankAnnot")[1].parentNode;
                        parentElement.insertBefore(copy_ytt, document.getElementsByClassName("annotation blankAnnot")[1].nextSibling);

                        document.getElementById ("copy_ytt_id").addEventListener (
                            "click", copy_ytt_fnc, false
                        );

                        function copy_ytt_fnc (zEvent)
                        {
                            var valueToCopy = document.getElementsByClassName("annotation blankAnnot")[1].attributes.rel.value.substr(8);

                            navigator.clipboard.writeText(valueToCopy)
                                .then(function() {
                                console.log('Wartość została skopiowana do schowka.');
                            })
                                .catch(function(error) {
                                console.error('Wystąpił błąd podczas kopiowania do schowka:', error);
                            });
                        }
                    }


                    // jeżeli nie ma guzika rodeo
                    if (document.getElementById("ssp_rodeo_button_div") == null)
                    {
                        var temp_vrid = document.getElementsByClassName("col-md-10 backGroundNone")[0].innerText;
                        temp_vrid = temp_vrid.substring(temp_vrid[0] - 9);

                        // localStorage.getItem(cmr_vrid);

                        var ssp_rodeo_button = document.createElement ('div');
                        ssp_rodeo_button.innerHTML =
                            '<input type="button" id="ssp_rodeo_button" type="button" style="" value="RODEO"/>';
                        ssp_rodeo_button.setAttribute ('id', 'ssp_rodeo_button_div');
                        ssp_rodeo_button.setAttribute ('style', 'display:inline-flex');
                        // document.getElementsByClassName("actionButtonItems")[2].appendChild(ssp_rodeo_button);
                        document.getElementsByClassName("col-md-10 backGroundNone")[0].children[0].appendChild(ssp_rodeo_button);

                        document.getElementById ("ssp_rodeo_button").addEventListener (
                            "click", ButtonClickRODEOSSP, false
                        );

                        function ButtonClickRODEOSSP (zEvent)
                        {

                            for(i=0;i<= rodeo_ssp.length;i++)
                            {
                                if(rodeo_ssp[i] != undefined)
                                {
                                    if(kierunek_ssp == (rodeo_ssp[i][0]))
                                    {
                                        window.open((rodeo_ssp[i][1]), '_blank').focus();
                                        break;
                                    }
                                }
                            }
                        }
                    }



                    // Dodanie guzik do FMC obok kierunku
                    if(document.getElementById("ssp_fmc_button") == undefined)
                    {
                        var ssp_fmc_button = document.createElement ('div');
                        ssp_fmc_button.innerHTML = '<input type="button" id="ssp_fmc_button" value="FMC">';
                        ssp_fmc_button.setAttribute ('id', 'ssp_fmc_div');
                        ssp_fmc_button.setAttribute ('style', 'display:inline-flex;');
                        document.getElementsByClassName("col-md-10 backGroundNone")[0].children[0].appendChild(ssp_fmc_button);

                        var ssp_fmc_vrid = document.getElementsByClassName("col-md-10 backGroundNone")[0].innerText.substr(-9);

                        document.getElementById("ssp_fmc_button").addEventListener('click', function ()
                                                                                   {
                            window.open("https://trans-logistics-eu.amazon.com/fmc/execution/search/" + ssp_fmc_vrid, '_blank').focus();
                        });
                    }





                    var czy_stacked = false;


                    // Liczenie ile pojemników na Stacku
                    if(document.getElementsByClassName("selectedTableRow")[0] != null &&
                       document.getElementById("stacked_ile_faktycznie") == null &&
                       czy_stacked == false) {

                        czy_stacked = true; // Poprawiono operator == na =

                        const checked_lane = document.getElementsByClassName("selectedTableRow")[0];
                        const loadGroupId = checked_lane.dataset.loadgroupid;
                        const planId = checked_lane.getAttribute("planid");
                        const vrid2 = checked_lane.getAttribute("vrid");
                        const trailerId = document.getElementsByClassName("textBold")[4].innerText.slice(1, -1);

                        const stackedContainer = document.getElementsByClassName("containerHierarchy sweepLink colorBlue")[15];
                        if (stackedContainer) {
                            syncFunction();
                            StagedCheck();
                        }

                        async function syncFunction() {
                            const stackedContainer = document.getElementsByClassName("containerHierarchy sweepLink colorBlue")[15];
                            if (stackedContainer && !document.getElementById("stacked_ile_faktycznie")) {
                                try {
                                    const response = await axios.post('https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata',
                                                                      new URLSearchParams({
                                        entity: 'getContainerDetailsForLoadGroupId',
                                        nodeId: 'KTW1',
                                        loadGroupId,
                                        planId,
                                        vrId: vrid2,
                                        status: "stacked",
                                        trailerId,
                                        trailerNumber: ""
                                    }), {
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                    });

                                    if (response.data?.ret?.aaData?.ROOT_NODE) {
                                        const rootNodeArray = response.data.ret.aaData.ROOT_NODE;
                                        let count = countContainers(rootNodeArray);
                                        // count = adjustCountForLabels(rootNodeArray, count);

                                        if (!document.getElementById("stacked_ile_faktycznie")) {
                                            stackedContainer.outerHTML += `<span id='stacked_ile_faktycznie'> (${count})</span>`;
                                        }
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        }

                        async function StagedCheck() {
                            const stagedContainer = document.getElementsByClassName("containerHierarchy sweepLink colorBlue")[17];
                            if (stagedContainer && !document.getElementById("stacked_ile_faktycznie")) {
                                try {
                                    const response = await axios.post('https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata',
                                                                      new URLSearchParams({
                                        entity: 'getContainerDetailsForLoadGroupId',
                                        nodeId: 'KTW1',
                                        loadGroupId,
                                        planId,
                                        vrId: vrid2,
                                        status: "staged",
                                        trailerId,
                                        trailerNumber: ""
                                    }), {
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                    });

                                    if (response.data?.ret?.aaData?.ROOT_NODE) {
                                        const rootNodeArray = response.data.ret.aaData.ROOT_NODE;
                                        const count = countContainers(rootNodeArray);

                                        if (!document.getElementById("staged_ile_faktycznie")) {
                                            stagedContainer.outerHTML += `<span id='staged_ile_faktycznie'> (${count})</span>`;
                                        }
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        }

                        function countContainers(rootNodeArray) {
                            let count = 0;
                            for (const obj of rootNodeArray) {
                                if (obj?.childNodes?.length > 0) {
                                    for (const childnode of obj.childNodes) {
                                        if (childnode?.childNodes?.length > 0) {
                                            if (!childnode.container.label.startsWith("CART_KTW4") &&
                                                !obj.container.label.endsWith("VENDOR-RETURNS") &&
                                                !obj.container.label.startsWith("BG-")) {
                                                count++;
                                            }
                                        }
                                    }
                                }
                            }
                            return count;
                        }

                        function adjustCountForLabels(rootNodeArray, count) {
                            const labelsToCheck = ["KTW4_PRESORTS", "KTW4_BRIEF", "BG-"];
                            for (const obj of rootNodeArray) {
                                if (labelsToCheck.some(label => obj.container.label.includes(label))) {
                                    count--;
                                }
                            }
                            return count;
                        }
                    }
                }
            }



            /////////////////////////////////////////
            // MENU SSP STACKED/STAGED/ROZWIN/MIRROR
            ///////////////////////////////////////
            if(document.getElementById("tblContainers_filter") != null)
            {
                if(document.getElementById("menu_ssp_div_left") == null)
                {
                    var guzik_style = "margin-bottom: 5px;    margin-right: 10px;background-color:white;";
                    var guzik_style_left = "float:left; margin-bottom: 5px;    margin-right: 10px;background-color:white;";

                    // lewy
                    var menu_node_left = document.createElement ('div');
                    menu_node_left.innerHTML =
                        '<div id="menu_closed_infobox" class="infobox_events" style="float:left;margin-top:0.25em;margin-right:0.5em;border-radius:90px;" title="Jak to dziala?"><img src="" class="infobox_events" /></div><button id="button_closed_flatbramy" type="button" style="' + guzik_style_left + '">Flat Bramy</button>' +
                        '<button id="button_closed_flatTSO" type="button" style="' + guzik_style_left + '">Flat MIRROR</button>' +
                        '<button id="button_closed_manualna" type="button" style="' + guzik_style_left + '">Manualna</button>'; // +
                    //'<button id="button_are_closed" type="button" style="' + guzik_style_left + '">Sprawdź czy zamknięte</button>';
                    menu_node_left.setAttribute ('id', 'menu_ssp_div_left');
                    menu_node_left.setAttribute ('style', 'display:inline;float:left;padding-top:5px;padding-left:5px;background-color:#eaf3fe;border:1px solid #cbcbcb;');
                    document.getElementById("tblContainers").parentNode.insertBefore(menu_node_left, document.getElementById("tblContainers"));

                    // prawy
                    var menu_node_right = document.createElement ('div');
                    menu_node_right.innerHTML =
                        '<button id="buttonrozwin" type="button" style="' + guzik_style + '">Rozwiń</button>' +
                        '<button id="button_ile_id" type="button" style="' + guzik_style + '">Policz ile</button>' +
                        '<button id="mirror_button_id" type="button" style="' + guzik_style + '">Mirror Chutes?</button><div id="mirroring_okienko_div" width="200px" height="110px" style=""></div>';
                    menu_node_right.setAttribute ('id', 'menu_ssp_div_right');
                    menu_node_right.setAttribute ('style', 'display:inline;float:right;padding-top:5px;padding-right:5px;padding-left:10px;background-color:#f4f5f5;border:1px solid #cbcbcb;');
                    document.getElementById("tblContainers").parentNode.insertBefore(menu_node_right, document.getElementById("tblContainers"));


                    // dolny
                    if(Fans)
                    {
                        if(!document.getElementById("menu_ssp_div_bottom"))
                        {
                            var menu_node_bottom = document.createElement ('div');
                            menu_node_bottom.innerHTML = '<button id="button_fans" type="button" style="">Fansuj</button>';
                            menu_node_bottom.setAttribute ('id', 'menu_ssp_div_bottom');
                            menu_node_bottom.setAttribute ('style', 'display:contents;');
                            document.getElementById("sweepLinkContainer").appendChild(menu_node_bottom);
                            document.getElementById("button_fans").setAttribute ('class', '.alui-skin .standardBtn');
                        }
                    }





                    // jeżeli KTW3 EDDP
                    function parseDate(s) {
                        var months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
                                      jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
                        var p = s.split('-');
                        return new Date(p[2], months[p[1].toLowerCase()], p[0]);
                    }


                    var lane = document.getElementsByClassName("col-md-10 backGroundNone")[0].children[0].innerText;
                    lane = lane.replace("Details for\nRoute ","").substring(0, lane.length - 30);

                    var vrid;
                    var cpt;
                    var cpt_data;
                    var cpt_godzina;
                    var cpt_string;


                    // Style:
                    document.getElementById("mirroring_okienko_div").style = "text-align:right;top:-4em;padding:10px;border-style:solid;border-color:black;position: absolute;left: 30em;background-color: lightgray;visibility:hidden;";

                    vrid = document.getElementById("cdetailHead").children[1].children[0].children[0].innerText;

                    if(localStorage.getItem(vrid + "_closed_flat_bramy") == "true")
                    {
                        document.getElementById("button_closed_flatbramy").style.setProperty('background-color','greenyellow','important');
                    }

                    if(localStorage.getItem(vrid + "_closed_flatTSO") == "true")
                    {
                        document.getElementById("button_closed_flatTSO").style.setProperty('background-color','greenyellow','important');
                    }

                    if(localStorage.getItem(vrid + "_closed_manualna") == "true")
                    {
                        document.getElementById("button_closed_manualna").style.setProperty('background-color','greenyellow','important');
                    }


                    if(document.getElementById("button_closed_manualna").style.backgroundColor == "white")
                    {
                        localStorage.setItem(vrid + "_closed_manualna",false);
                    }
                    if(document.getElementById("button_closed_flatTSO").style.backgroundColor == "white")
                    {
                        localStorage.setItem(vrid + "_closed_flatTSO",false);
                    }
                    if(document.getElementById("button_closed_flatbramy").style.backgroundColor == "white")
                    {
                        localStorage.setItem(vrid + "_closed_flat_bramy",false);
                    }




                    // Akcje:
                    document.getElementById ("buttonrozwin").addEventListener (
                        "click", ButtonClickActionRozwin, false
                    );

                    document.getElementById ("mirror_button_id").addEventListener (
                        "click", ButtonClickActionMirror, false
                    );

                    document.getElementById ("button_closed_flatbramy").addEventListener (
                        "click", ButtonClosedFlatBramy, false
                    );

                    document.getElementById ("button_closed_flatTSO").addEventListener (
                        "click", ButtonClosedFlatTSO, false
                    );

                    document.getElementById ("button_closed_manualna").addEventListener (
                        "click", ButtonClosedManualna, false
                    );

                    document.getElementById ("menu_closed_infobox").addEventListener (
                        "click", ButtonClosedInfobox, false
                    );

                    document.getElementById ("button_ile_id").addEventListener (
                        "click", ButtonPoliczIle, false
                    );

                    if(Fans)
                    {
                        document.getElementById("button_fans").addEventListener (
                            "click", ButtonFans, false
                        );
                    }


                }

                //                 // EDDK pomoc kolory
                //                 if(document.getElementsByClassName("col-md-10 backGroundNone")[0] != undefined)
                //                 {
                //                     if(document.getElementsByClassName("col-md-10 backGroundNone")[0].innerText.substring(18,37) == "KTW1->AIR-KTWA-EDDK")
                //                     {
                //                         if(document.getElementById("eddk_kolory_div") == undefined)
                //                         {
                //                             document.getElementsByClassName("font13")[1].innerHTML = '<div id="eddk_kolory_div" style="display:flex;font-size:large;">' +
                //                                 '<div id="eddk_dnw1" style="background-color:black;border-style:solid;border-color:black;color:white;margin-right:1em;padding:5px;" title="CZARNY">DNW1</div>' +
                //                                 '<div id="eddk_dnw2" style="background-color:green;border-style:solid;border-color:black;margin-right:1em;padding:5px;" title="ZIELONY">DNW2</div>' +
                //                                 '<div id="eddk_dnw3" style="background-color:orange;border-style:solid;border-color:black;margin-right:1em;padding:5px;"  title="POMARANCZOWY">DNW3</div>' +
                //                                 '<div id="eddk_dnw4" style="background-color:white;border-style:solid;border-color:black;margin-right:1em;padding:5px;"  title="BIALY">DNW4</div>' +
                //                                 '<div id="eddk_dnw6" style="background-color:blue;border-style:solid;border-color:black;color:white;margin-right:1em;padding:5px;"  title="NIEBIESKI">DNW6</div>' +
                //                                 '<div id="eddk_dnw8" style="background-color:brown;border-style:solid;border-color:black;color:white;margin-right:1em;padding:5px;"  title="BRAZOWY">DNW8</div>' +
                //                                 '<div id="eddk_dnx4" style="background-color:yellow;border-style:solid;border-color:black;margin-right:1em;padding:5px;"  title="ZÓLTY">DNX4</div>' +
                //                                 '<font size="1px">Skreslone = brak na Sorterze (przy CPT mozesz je zamykac)</font></div>';
                //                         }

                //                         var dnw1 = true;
                //                         var dnw2 = true;
                //                         var dnw3 = true;
                //                         var dnw4 = true;
                //                         var dnw6 = true;
                //                         var dnw8 = true;
                //                         var dnx4 = true;
                //                         var sorterlane;

                //                         for(i=0;i<=document.getElementsByClassName("TreeMenuCol sorting_1").length;i++)
                //                         {
                //                             if(document.getElementsByClassName("TreeMenuCol sorting_1")[i] != undefined && document.getElementsByClassName("TreeMenuCol sorting_1")[i].textContent.substring(2,22) == "KTW1-ShippingSorter ")
                //                             {
                //                                 sorterlane = i;
                //                             }
                //                         }
                //                         //   console.log(sorterlane);

                //                         for(j=0;j<=document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children.length;j++)
                //                         {
                //                             if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children[j] != undefined)
                //                             {
                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNW1")
                //                                 {
                //                                     dnw1 = false;
                //                                     //  console.log("dnw1: " + dnw1);
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNW2")
                //                                 {
                //                                     dnw2 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNW3")
                //                                 {
                //                                     dnw3 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNW4")
                //                                 {
                //                                     dnw4 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNW6")
                //                                 {
                //                                     dnw6 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNW8")
                //                                 {
                //                                     dnw8 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNX4")
                //                                 {
                //                                     dnx4 = false;
                //                                 }
                //                             }
                //                         }

                //                         if(sorterlane == undefined || sorterlane == null)
                //                         {
                //                             dnw1 = true;
                //                             dnw2 = true;
                //                             dnw3 = true;
                //                             dnw4 = true;
                //                             dnw6 = true;
                //                             dnw8 = true;
                //                             dnx4 = true;
                //                         }

                //                         //  console.log("dnw1: " + dnw1);

                //                         if(dnw1 == true)
                //                         {
                //                             //console.log("dnw1: dziala");
                //                             document.getElementById("eddk_dnw1").style.textDecoration = "line-through";
                //                         }

                //                         if(dnw2 == true)
                //                         {
                //                             document.getElementById("eddk_dnw2").style.textDecoration = "line-through";
                //                         }

                //                         if(dnw3 == true)
                //                         {
                //                             document.getElementById("eddk_dnw3").style.textDecoration = "line-through";
                //                         }

                //                         if(dnw4 == true)
                //                         {
                //                             document.getElementById("eddk_dnw4").style.textDecoration = "line-through";
                //                         }

                //                         if(dnw6 == true)
                //                         {
                //                             document.getElementById("eddk_dnw6").style.textDecoration = "line-through";
                //                         }

                //                         if(dnw8 == true)
                //                         {
                //                             document.getElementById("eddk_dnw8").style.textDecoration = "line-through";
                //                         }

                //                         if(dnx4 == true)
                //                         {
                //                             document.getElementById("eddk_dnx4").style.textDecoration = "line-through";
                //                         }
                //                         // document.getElementsByClassName("TreeMenuCol sorting_1")[0].textContent.substring(2,22) // "KTW1-ShippingSorter "
                //                     }
                //                 }

                //
                // HAJA kolory pomoc
                //
                //                 else if(document.getElementsByClassName("col-md-10 backGroundNone")[0].innerText.substring(18,37) == "KTW1->AIR-KTWA-HAJA")
                //                 {
                //                     if(document.getElementById("haja_kolory_div") == undefined)
                //                     {
                //                         document.getElementsByClassName("font13")[1].innerHTML = '<div id="haja_sorter" style="margin-bottom:-2%;">SORTER:</div><br>' +
                //                             '<div id="haja_kolory_div" style="display:flex;font-size:large;margin-bottom:1%;">' +
                //                             '<div id="haja_dhh1_sorter" style="background-color:black;border-style:solid;border-color:black;color:white;margin-right:1em;height:100%;" title="CZARNY">DHH1</div>' +
                //                             '<div id="haja_dhh3_sorter" style="background-color:blue;border-style:solid;border-color:blue;color:white;margin-right:1em;height:100%;"  title="NIEBIESKI">DHH3</div>' +
                //                             '<div id="haja_dnm1_sorter" style="background-color:green;border-style:solid;border-color:green;margin-right:1em;height:100%;" title="ZIELONY">DNM1</div>' +
                //                             '<div id="haja_dnm2_sorter" style="background-color:red;border-style:solid;border-color:red;margin-right:1em;height:100%;"  title="CZERWONY">DNM2</div>' +
                //                             '<div id="haja_dhb1_sorter" style="background-color:brown;border-style:solid;border-color:brown;color:white;margin-right:1em;height:100%;"  title="BRAZOWY">DHB1</div>' +
                //                             '<div id="haja_dnx5_sorter" style="background-color:yellow;border-style:solid;border-color:yellow;margin-right:1em;height:100%;"  title="ZÓLTY">DNX5</div>' +
                //                             '<div id="haja_dnx6_sorter" style="background-color:orange;border-style:solid;border-color:orange;margin-right:1em;height:100%;"  title="POMARANCZOWY">DNX6</div>' +
                //                             '<div id="haja_dnw9_sorter" style="background-color:white;border-style:solid;border-color:white;margin-right:1em;height:100%;"  title="BIALY">DNW9</div>' +
                //                             '<font size="1px">Skreslone = brak na Sorterze</font></div><hr style="margin-bottom:1px;">' +

                //                             '<div id="haja_inne" style="margin-bottom:-2%;">INNE:</div><br>' +
                //                             '<div id="haja_kolory_div_2" style="display:flex;font-size:large;">' +
                //                             '<div id="haja_dhh1_slam" style="background-color:black;border-style:solid;border-color:black;color:white;margin-right:1em;height:100%;" title="CZARNY">DHH1</div>' +
                //                             '<div id="haja_dhh3_slam" style="background-color:blue;border-style:solid;border-color:blue;color:white;margin-right:1em;height:100%;"  title="NIEBIESKI">DHH3</div>' +
                //                             '<div id="haja_dnm1_slam" style="background-color:green;border-style:solid;border-color:green;margin-right:1em;height:100%;" title="ZIELONY">DNM1</div>' +
                //                             '<div id="haja_dnm2_slam" style="background-color:red;border-style:solid;border-color:red;margin-right:1em;height:100%;"  title="CZERWONY">DNM2</div>' +
                //                             '<div id="haja_dhb1_slam" style="background-color:brown;border-style:solid;border-color:brown;color:white;margin-right:1em;height:100%;"  title="BRAZOWY">DHB1</div>' +
                //                             '<div id="haja_dnx5_slam" style="background-color:yellow;border-style:solid;border-color:yellow;margin-right:1em;height:100%;"  title="ZÓLTY">DNX5</div>' +
                //                             '<div id="haja_dnx6_slam" style="background-color:orange;border-style:solid;border-color:orange;margin-right:1em;height:100%;"  title="POMARANCZOWY">DNX6</div>' +
                //                             '<div id="haja_dnw9_slam" style="background-color:white;border-style:solid;border-color:white;margin-right:1em;height:100%;"  title="BIALY">DNW9</div>' +
                //                             '<font size="1px">Skreslone = brak na Slam/Drop-off</font></div>';

                //                     }

                //                     var dhh1 = true;
                //                     var dnm1 = true;
                //                     var dnx6 = true;
                //                     var dnw9 = true;
                //                     var dhh3 = true;
                //                     var dhb1 = true;
                //                     var dnx5 = true;
                //                     var dnm2 = true;
                //                     var sorterlane2;

                //                     for(i=0;i<=document.getElementsByClassName("TreeMenuCol sorting_1").length;i++)
                //                     {
                //                         if(document.getElementsByClassName("TreeMenuCol sorting_1")[i] != undefined && document.getElementsByClassName("TreeMenuCol sorting_1")[i].textContent.substring(2,22) == "KTW1-ShippingSorter ")
                //                         {
                //                             sorterlane2 = i;
                //                         }
                //                     }
                //                     //   console.log(sorterlane);

                //                     if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2] != undefined)
                //                     {
                //                         for(j=0;j<=document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children.length;j++)
                //                         {
                //                             if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j] != undefined)
                //                             {
                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DHH1")
                //                                 {
                //                                     dhh1 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNM1")
                //                                 {
                //                                     dnm1 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNX6")
                //                                 {
                //                                     dnx6 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNW9")
                //                                 {
                //                                     dnw9 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DHH3")
                //                                 {
                //                                     dhh3 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DHB1")
                //                                 {
                //                                     dhb1 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNX5")
                //                                 {
                //                                     dnx5 = false;
                //                                 }

                //                                 if(document.getElementsByClassName("TreeMenuCol sorting_1")[sorterlane2].children[1].children[0].children[j].children[1].children[3].innerText.substring(14,18) == "DNM2")
                //                                 {
                //                                     dnm2 = false;
                //                                 }
                //                             }
                //                         }
                //                     }

                //                     if(sorterlane2 == undefined || sorterlane2 == null) // brak sorterlane2 oznacza brak paczek na Sorterze
                //                     {
                //                         dhh1 = true;
                //                         dnm1 = true;
                //                         dnx6 = true;
                //                         dnw9 = true;
                //                         dhh3 = true;
                //                         dhb1 = true;
                //                         dnx5 = true;
                //                         dnm2 = true;
                //                     }


                //                     if(dhh1 == true)
                //                     {
                //                         document.getElementById("haja_dhh1_sorter").style.textDecoration = "line-through black";
                //                     }

                //                     if(dnm1 == true)
                //                     {
                //                         document.getElementById("haja_dnm1_sorter").style.textDecoration = "line-through";
                //                     }

                //                     if(dnx6 == true)
                //                     {
                //                         document.getElementById("haja_dnx6_sorter").style.textDecoration = "line-through";
                //                     }

                //                     if(dnw9 == true)
                //                     {
                //                         document.getElementById("haja_dnw9_sorter").style.textDecoration = "line-through";
                //                     }

                //                     if(dhh3 == true)
                //                     {
                //                         document.getElementById("haja_dhh3_sorter").style.textDecoration = "line-through red";
                //                     }

                //                     if(dhb1 == true)
                //                     {
                //                         document.getElementById("haja_dhb1_sorter").style.textDecoration = "line-through";
                //                     }

                //                     if(dnx5 == true)
                //                     {
                //                         document.getElementById("haja_dnx5_sorter").style.textDecoration = "line-through";
                //                     }

                //                     if(dnm2 == true)
                //                     {
                //                         document.getElementById("haja_dnm2_sorter").style.textDecoration = "line-through";
                //                     }
                //                     // document.getElementsByClassName("TreeMenuCol sorting_1")[0].textContent.substring(2,22) // "KTW1-ShippingSorter "
                //                 }
                //                 else
                //                 {
                //                     document.getElementsByClassName("font13")[1].innerHTML = "\n\t  <span class=\"forceMovedImage\">!</span> = Self Force Moved\n\t  <span class=\"forceMovedChildImage\"></span> =  Child Force Moved\n   <span class=\"aclMoveIcon\">A</span> =  ACL Moves\n\t"
                //                 }
            }







            // Wpisanie ilosci paczek do eCMR
            // if(document.getElementById("fl_sealNo") != null)
            // {

            if(document.getElementById("eCMRRouteSegmentData") != undefined && document.getElementById("eCMRRouteSegmentData").className == "hiddenTag modalDialog alignL ui-dialog-content ui-widget-content")
            {

            }

            // Dragable resizible ogólne okienko informacyjne
            if(document.getElementById("infobox_div") == undefined)
            {
                var infobox_style;

                if (tytul_okienka_pomocy == undefined)
                {
                    tytul_okienka_pomocy = "Dzien dobry!";
                }


                var infobox = document.createElement('div');
                infobox.innerHTML = `
    <div id="infobox_divheader" style="
        text-align: center;
        border-bottom: 2px solid #2c3e50;
        cursor: move;
        background-color: #34495e;
        color: white;
        padding: 8px;
        border-radius: 5px 5px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;">

        <div style="display: flex; gap: 5px;">
            <button id="infobox_zmniejsz_id" title="schowaj" style="
                padding: 4px 8px;
                border: none;
                background-color: #3498db;
                color: white;
                cursor: pointer;
                border-radius: 3px;">^</button>
            <button id="infobox_przypnij_id" title="przypnij" style="
                padding: 4px 8px;
                border: none;
                background-color: #3498db;
                color: white;
                cursor: pointer;
                border-radius: 3px;">*</button>
        </div>

        <span id="tytul_okienka_pomocy">${tytul_okienka_pomocy}</span>

        <button id="infobox_zamknij_id" title="zamknij" style="
            padding: 4px 8px;
            border: none;
            background-color: #e74c3c;
            color: white;
            cursor: pointer;
            position: relative;
            right: 0.5%;
            border-radius: 3px;">X</button>
    </div>
    <div id="infobox_tresc_id"></div>`;

                infobox.setAttribute('id', 'infobox_div');
                infobox.setAttribute('style', `
    position: fixed;
    height: 300px;
    background-color: #ffffff;
    left: 200px;
    top: 200px;
    resize: both;
    overflow: auto;
    color: black;
    display: none;
    z-index: 1010;
    border-radius: 5px;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border: 1px solid #bdc3c7;
`);
                document.getElementsByTagName("body")[0].appendChild(infobox);


                dragElement(document.getElementById("infobox_div"));

                document.getElementById ("infobox_zmniejsz_id").addEventListener (
                    "click", InfoboxZmniejsz, false
                );

                document.getElementById ("infobox_zamknij_id").addEventListener (
                    "click", InfoboxZamknij, false
                );

                document.getElementById ("infobox_przypnij_id").addEventListener (
                    "click", InfoboxPrzypnij, false
                );

                function InfoboxZmniejsz (zEvent)
                {
                    if(document.getElementById("infobox_div").style.height != "25px")
                    {
                        document.getElementById("infobox_div").style.height = "25px";
                    }
                    else
                    {
                        document.getElementById("infobox_div").style.height = "800px";
                    }
                }

                function InfoboxZamknij (zEvent)
                {
                    document.getElementById("infobox_div").style.display = "none";
                }

                function InfoboxPrzypnij(zEvent)
                {
                    if(document.getElementById("infobox_div").style.position == "fixed")
                    {
                        document.getElementById("infobox_div").style.position = "absolute";
                    }
                    else
                    {
                        document.getElementById("infobox_div").style.position = "fixed";
                    }
                }


                // NOWOSCI w danej wersji
                if(localStorage.getItem("wersja") == null || localStorage.getItem("wersja") < 3400)
                {
                    document.getElementById("infobox_div").style.display = "block";
                    tytul_okienka_pomocy = "CO NOWEGO?";
                    document.getElementById("infobox_div").style.display = "block";
                    document.getElementById("infobox_div").style.height = "800px";
                    document.getElementById("infobox_div").style.width = "1200px";
                    document.getElementById("infobox_div").style.position = "fixed";
                    document.getElementById("infobox_div").style.left = "5%";
                    document.getElementById("infobox_div").style.top = "5%";
                    document.getElementById("infobox_div").style.textAlign = "center";
                    document.getElementById("infobox_div").style.zIndex = "99999";
                    document.getElementById("infobox_tresc_id").innerHTML = '<br><span style="font-size:26px;">' +

                        'v 3.400 <br><span style="font-size:14px;">(12/11/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Przebudowano tabelę z paletami DRUDE <br>' +
                        '(Usunięto nieużywane Stage / dodano lokację SHIP-LTL wraz z podtabelą / dodano pasek postępu sprawdzania)<br>' +
                        '* Zaktualizowano linki do RODEO dla każdego z kierunków<br>' +

                        '</span>' +
                        '<br><br><hr><br>'+



                        'v 3.300 <br><span style="font-size:14px;">(09/10/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Przebudowano tabelę z paletami DRUDE <br>' +
                        '* Dodano przycisk sprawdzający Dwell Time palet na podstawie godziny ich zamknięcia <br>' +
                        '(ponieważ musi to być zrealizowane przez TroubleShooting Tool, i ze względu na jego limity, może to długo potrwać - 2 palety/s)  <br>' +
                        '* Dodano w SSP kolorowanie czasu zamknięcia bramy, jeżeli pozostało do tego mniej niż 10 minut. <br>' +

                        '</span>' +
                        '<br><br><hr><br>'+




                        'v 3.200 <br><span style="font-size:14px;">(18/09/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano sprawdzanie stanu GTDR dla każdej bramy <br>' +
                        '(Zapobiega Early Finish Violation)<br>' +
                        '(Trzeba zalogować się na stronę <a href="https://www.amazonlogistics.eu/gtdr/checklist/locations">GTDR</a> aby mogło prawidłowo pobierać dane)<br>' +
                        '* Dodano Przebijacza Palet TSO na Bramy_TSO.<br>' +
                        '(Nie zawsze jest łatwy dostęp do etykiet, więc wystarczy zeskanować jeden Tote z palety do listy i nacisnąć przcisk)<br>' +
                        '* Mnóstwo innych poprawek wydajności/stabilności.<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 3.090 <br><span style="font-size:14px;">(30/07/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa Stacking Filters dla DRUDE Wroclaw w "LISTA PALET DRUDE"<br>' +
                        '* Poprawa Stacking Filters dla DRUDE Leipzig w "LISTA PALET DRUDE"<br>' +
                        '* Dodano UPS-Katowice DRUDE w "LISTA PALET DRUDE"<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 3.070 <br><span style="font-size:14px;">(15/07/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa Stacking Filters dla DRUDE Wroclaw w "LISTA PALET DRUDE"<br>' +
                        '* DODANO: Alerty dla <a href="https://skynet.amazon.dev/ship-schedule/KTW1" target="_blank">Skynet Ship Schedule</a><br>' +
                        'Należy zezwolić na odtwarzanie dźwięków na stronie:<br>' +
                        '<img src="https://drive.corp.amazon.com/view/nowaratn@/barka/skynetSoundAllow.jpg" /><br>'+
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 3.060 <br><span style="font-size:14px;">(24/06/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Zaktualizowano Stacking Filters dla DRUDE w "LISTA PALET DRUDE" (już prawidłowo zlicza)<br>' +
                        '* Dodano STAGE_141_D3_1 w "LISTA PALET DRUDE"<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 3.040 <br><span style="font-size:14px;">(07/06/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Zaktualizowano Stage dla DRUDE w "LISTA PALET DRUDE"<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 3.030 <br><span style="font-size:14px;">(10/04/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa liczenia pojemników na Stacked/Stage (nie uwzględnia już cartów z KTW4 i Vendorów).<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 3.020 <br><span style="font-size:14px;">(09/04/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* NOWA FUNKCJONALNOŚĆ dla przycisk "LISTA PALET DRUDE" - naciśnięcie na każdy kierunek w tabeli, pokaże palety do wysyłki zgodnie z FIFO.<br>' +
                        '* Do tego dla każdej lokacji dodano przycisk "Print All Stages" który wydrukuje listę z paletami w kolejności od najdłużej dwellujących (pierwsze 40 palet).<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 3.010 <br><span style="font-size:14px;">(02/04/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano przycisk "ILOŚĆ PACZEK Z KTW4" <br>' +
                        '* Dodano przycisk "LISTA PALET DRUDE" (wraz z ilością zaplanowanych aut z podziałem na <25h oraz >25h)<br>' +
                        '* Poprawiono widoczność statusu GTDR dla załadunków <br>' +
                        '</span>' +
                        '<br><br><hr><br>'+



                        'v 2.900 <br><span style="font-size:14px;">(08/02/2025)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Reorganizacja listy TSO (Stage_TSO / Bramy_TSO) <br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 2.850 <br><span style="font-size:14px;">(12/12/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa: PRZEBIJACZ (o wiele ładniejszy, szybszy, i lepszy) - pojawia się po wejściu na Skaner, na 1285. <br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 2.800 <br><span style="font-size:14px;">(12/12/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano: PRZEBIJACZ (dostepny po wejściu na 1285 na skanerze i odświeżeniu strony)(wbudowany force move (; ) <img src="https://eu-west-1.prod.sort-assist-mobile.ats.amazon.dev/static/media/scanPackage.3fc212cc3f3994c90dcd0b7267fd2250.svg" style="height:32px;"/>  <br>' +
                        '* Dodano: Przycisk do wylistowania wszystkich aut na CRITS (w FMC, do przekazania zmiany [bez bidów]). <br>' +
                        '* Poprawa: Wszystkie linki do RODEO dla kierunków w SSP.<br>' +
                        '* Poprawa: Sposób przedstawienia i liczenie palet na CRITS (teraz wraz z CPT!).<br>' +
                        '* Poprawa: Działanie przycisku "Mirror Chutes" w SSP.<br>' +

                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.550 <br><span style="font-size:14px;">(18/09/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa: Barka.<br>' +
                        '* Dodano: Snoop.' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 2.500 <br><span style="font-size:14px;">(09/05/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Zaktualizowano zliczanie palets CRITS o Ship Clerk HotPick.<br>' +
                        '* Wiele drobnych poprawek i usprawnień.' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.450 <br><span style="font-size:14px;">(27/04/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano przycisk do zliczania wszystkich palet na kierunki CRITS (na danym Stage + Stage TSO), dla ułatwienia zaplanowania zapotrzebowania aut na daną zmianę.' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.400 <br><span style="font-size:14px;">(20/04/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dokładne zliczanie ilości palet na każdym Stage ( CRITS )' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.350 <br><span style="font-size:14px;">(10/04/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano nowe lokacje w skanerze online.<br>' +
                        '* Poprawiono wyświetlany kolor pola, na którym znajduje się kierowca (ssp).<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.340 <br><span style="font-size:14px;">(03/04/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Psstani update.<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.330 <br><span style="font-size:14px;">(13/03/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa przycisku kopiowania rejestracji w YMS.<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.320 <br><span style="font-size:14px;">(13/03/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Naprawa guzików przewijania Yardu.<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.300 <br><span style="font-size:14px;">(23/02/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* 🦇 Poprawa Ciemnego motywu (guzik "Dark Mode" w lewym górnym rogu).<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.200 <br><span style="font-size:14px;">(16/02/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* 🦇 Dodano ciemny motyw dla SSP (guzik "Dark Mode" w lewym górnym rogu).<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.100 <br><span style="font-size:14px;">(12/01/24)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa informacji w SSP, na którym polu znajduje się kierowca.<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 2.000 <br><span style="font-size:14px;">(01/12/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Aktualizacja sposobu liczenia pojemników w Stacked (nie liczy już pojedynczych bagów)<br>' +
                        '* Dodano liczenie pojemników na Stage (nareszcie bez bagów)<br>' +
                        '* Dodano informację w SSP, na którym polu znajduje się kierowca<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 1.990 <br><span style="font-size:14px;">(13/10/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* "Jastrz Update"<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 1.980 <br><span style="font-size:14px;">(06/10/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '*Poprawa działania funkcji "sprawdź czy można zamknąć<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 1.970 <br><span style="font-size:14px;">(21/09/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '*Dodano podpowiedzi lokalizacji paczek w Received/Diverted <br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 1.960 <br><span style="font-size:14px;">(14/09/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Zaznaczanie paczek "In-transit" dla kierunku KTW1->AIR-KTW1-EDDP-EMSA (jeżeli liczba paczek jest większa niż 0)<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 1.950 <br><span style="font-size:14px;">(31/08/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa funkcji wpisywania ilości paczek w eCMR <br>' +
                        '* Poprawa funkcji BETA: Policz ile / Sprawdź czy można zamknąć (w Stacked koloruje na czerwono podsorty które znajdzie w Received)<br>' +
                        '* Poprawa wyglądu skryptu (strony ssp) w niektórych miejscach<br>' +
                        '* Poprawa stabilności działania skryptu <br>' +
                        '* Poprawa kremówek <br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 1.930 <br><span style="font-size:14px;">(18/08/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano zapisywanie listy załadunkowej dla dodatku "Czyje auto" (po odświeżeniu strony SSP przywróci listę) <br>' +
                        '* Poprawa stabilności działania skryptu <br>' +
                        '* Poprawa w chowaniu górnej belki w SSP <br>' +
                        '* Poprawa wyglądu skryptu w niektórych miejscach<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+

                        'v 1.925 <br><span style="font-size:14px;">(12/08/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawa stabilności działania skryptu <br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 1.920 <br><span style="font-size:14px;">(10/08/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano kolorowanie Caps Dashboard zgodnie z wypełnieniem (Scheduled vs Capacity) <br>' +
                        '* Poprawiono graficznie: Barka.<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 1.915 <br><span style="font-size:14px;">(05/08/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawiono umiejscowienie guzików FMC oraz RODEO na prawym panelu SSP <br>' +
                        '* Poprawiono umiejscowienie guzików MOVE/FINISH/DETACH/SWAP (kosmetyczne)<br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 1.911 <br><span style="font-size:14px;">(04/08/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano ustawienia Barki w opcjach skryptu <br>' +
                        '* Dodano odnośnik do FMC dla każdego VRID na stronie głównej SSP<br>' +
                        '* Poprawiono dodawanie guzika FMC w SSP z prawej strony <br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 1.900 <br><span style="font-size:14px;">(12/07/23)</span> <br><br>' +

                        '* 🆕🆒 <span style="font-size:16px;">' +
                        'Dodano w SSP przycisk kierujący do FMC (po rozwinięciu danego VRIDa, z prawej strony) <br><br>' +
                        '* Poprawiono logikę działania przycisku zwiń/rozwiń w widoku "Stacked" <br>' +
                        '* Poprawiono drobne błędy przy liczeniu ilości pojemników w "Stacked" <br>' +
                        '* Poprawiono drobne błędy funkcji "Czyje auto" <br>' +
                        '* Poprawiono umiejscowienie i wygląd przycisku do kopiowania wirtualnego numeru naczepy <br>' +
                        '* Poprawiono umiejscowienie i wygląd "wody" (przycisku do wyłączenia) pod Barką <br>' +
                        '</span>'+
                        '<br><br><hr><br>'+



                        'v 1.870 <br><span style="font-size:14px;">(29/06/23)</span> <br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Dodano guziki "Clerk Hot Pick" oraz "Vret Hot Pick" do Skanera dla funkcji Trickle <br>' +
                        '<span style="font-size:12px;">(Dla szybszego przenoszenia paczek/pojemników na te wirtualne lokacje)</span> <br><br>' +
                        '* Dodano guzik kopiowania numeru YTT z poziomu SSP / bocznego panelu dla poszczególnego VRID' +
                        '</span>'+
                        '<br><br><hr><br>'+


                        'v 1.860 <br><span style="font-size:14px;">(13/04/23)</span><br><br>' +
                        '<br>Barka.<br>' +
                        '<br><br><hr><br>'+

                        'v 1.850 <br><span style="font-size:14px;">(13/04/23)</span><br><br>' +
                        '<span style="font-size:16px;">' +
                        '* Poprawka weryfikacji "Stacked" <br>' +
                        '</span>' +
                        '<span style="font-size:12px;">(nie liczy już pustych pojemników)</span> <br><br>' +
                        '</span>' +
                        '<br><br><hr><br>'+


                        'v 1.800 <br><span style="font-size:14px;">(31/03/23)</span><br>' +
                        '<span style="font-size:16px;">' +
                        '<br>* Dodano automatyczne weryfikowanie, ile pojemników znajduje się tak naprawdę w Stacked<br>' +
                        '</span>' +
                        '<span style="font-size:12px;">(Jeżeli pojemnik nie ma nadanego Stacking Filter, nie jest liczony przez SSP)<br>(Skrypt również NIE liczy zbiorczej palety z KTW4)</span> <br><br>' +
                        '<br>* Dalsze ulepszenia w Opcji "Czy poprawic wyglad SSP?" (polecam włączyć)<br>' +
                        '* Dodano "S Z N U K C O R E".mp3 <br>' +
                        '* Dodano "S Z N U K W A V E".mp3 <br><br><hr>' +


                        'v 1.750 <br><span style="font-size:14px;">(30/03/23)</span> <br><br>* Dodano automatyczne weryfikowanie podłączonej naczepy względem Carriera w SSP <br>' +
                        '* Ulepszenia w Opcji "Czy poprawic wyglad SSP?" <br><br><hr>'+

                        'v 1.700 <br><span style="font-size:14px;">(16/03/23)</span> <br><br>* Aktualizacja kierunków dla guzika "RODEO" <br><hr><br>' +

                        'v 1.650 <br><span style="font-size:14px;">(15/03/23)</span> <br><br>* Poprawki związane ze zmianą nazw Stacking Area (FR_S = FLAT-A , itd.) <br><hr><br>' +

                        'v 1.600 <br><span style="font-size:14px;">(03/03/23)</span> <br><br>** Ważne zmiany ** <br>' +
                        '* Poprawa guzików "Odśwież" oraz "Opcje"<br>' +
                        '* Poprawa ustawień znajdujących się w opcjach<br>' +
                        '* Dodano funkcje "BETA"<br>' +
                        '* Dodano funkcje "BETA" : [Policz ile / Sprawdź czy można zamknąć]<br>' +
                        '* Inne liczne drobne poprawki stabilności i funkcjonalności<br>' +
                        '<br><hr>' +

                        'v 1.5 <br><span style="font-size:14px;">(11/02/23)</span> <br><br>* Poprawki kosmetyczne i drobne poprawki funkcji. <br><hr><br>' +

                        'v 1.350 <br><span style="font-size:14px;">(11/06/2022)</span> <br><br>* Poprawki linków RODEO. <br> * Poprawki działania "Czyje auto".<hr><br>' +

                        'v 1.340 <br><span style="font-size:14px;">(01/06/2022)</span> <br><br>* Poprawki linków RODEO. <br><hr><br>' +

                        'v 1.330 <br><span style="font-size:14px;">(29/04/2022)</span> <br><br>* Nowe funkcje w opcji "Poprawy kosmetyczne". <br>' +
                        '* Ukrywanie panelu "LOAD" z prawej strony po wyborze któregos z zaladunku, aby zmiescic wszystkie wazne informacje na jednej stronie bez przewijania.<hr><br>' +


                        'v 1.320 <br><span style="font-size:14px;">(15/04/2022)</span> <br><br>* Poprawa dzialania w zwiazku ze zmianami na stronie YMS. <br><hr><br>' +

                        'v 1.310 <br><span style="font-size:14px;">(01/04/21)</span> <br><br>* Dodano przycisk "Policz Ile" w widoku na Received danego kierunku. <br>' +
                        '(Guzik ten podliczy ile paczek na dany pre-sort znajduje sie jeszcze w drodze na Ship.)<hr><br>' +

                        'v 1.300 <br><span style="font-size:14px;">(26/03/22)</span> <br><br>* Poprawki linków dla guzika RODEO w SSP. <br>' +
                        '* Poprawki automatycznego wpisywania ilosci paczek w eCMR.<hr><br>' +

                        'v 1.1 <br><span style="font-size:14px;">(05/02/22)</span> <br><br>* Dodano guzik do automatycznego rozladowania Assetu - podczas podlaczania nierozladowanej puszki wyskakuje odpowiedni komunikat, przy którym znajduje sie specjalny guzik do automatycznego rozladowania. Wystarczy nacisnac i policzyc do 10.<br><hr><br>' +
                        'v 1.035 <br><span style="font-size:14px;">(02/02/22)</span> <br><br>* Poprawki kierunków dla których dziala przycisk RODEO.<br>' +
                        '* Podczas [Attach] dodano dwa guziki przyspieszajace proces - LIVE i PRE.<br><hr><br>'+

                        'v 1.030 <br><span style="font-size:14px;">(28/01/22)</span> <br><br>* Aktualizacja kierunków dla których dziala przycisk RODEO.<br><hr><br>' +
                        'v 1.026 <br><span style="font-size:14px;">(13/01/22)</span> <br><br>* Poprawa pomocy dla kierunków EDDK/HAJA. <br>' +
                        '* Drobne poprawki wygladu i stabilnosci.<br><hr><br>'+

                        'v 1.024 <br><span style="font-size:14px;">(13/11/21)</span> <br><br>* Dodanie pomocy dla kierunku HAJA (podobnie jak dla EDDK). <br>' +
                        '* Dodano guzik RODEO dla kazdego kierunku (w menu SSP tam gdzie ATTACH/START/FINISH).<br><hr><br>'+
                        'v 1.021 <br><span style="font-size:14px;">(05/11/21)</span> <br><br>* Poprawienie automatycznego uzupelniania eCMR. <br><hr><br>' +
                        'v 1.020 <br><span style="font-size:14px;">(03/11/21)</span> <br><br>* Naprawa guzików przewijania i kolorowania YMS.<br>' +
                        '* Dodano ATPST do filtrowania YMS.<br><hr><br>'+
                        'v 1.019 <br><span style="font-size:14px;">(09/10/21)</span> <br><br>* Dodanie guzików filtrowania YMS po Przewoznikach. <br><hr><br>' +
                        'v 1.017 <br><span style="font-size:14px;">(02/10/21)</span> <br><br>* Dodanie opcji poprawek kosmetycznych dla SSP. <br><hr><br>' +
                        'v 1.016 <br><span style="font-size:14px;">(02/10/21)</span> <br><br>* Odblokowanie guzika "Actions -> Create" (VRID) w FMC :) <br><hr><br>' +
                        'v 1.015 <br><span style="font-size:14px;">(02/10/21)</span> <br><br>* Poprawiony wyglad Case w FMC <br> <font size="3">(ROC zawsze odpowiada na wiadomosc razem z wklejeniem jej zawartosci, tworzac nieraz bardzo dlugie bloki tekstu w których ciezko sie polapac).</font><br><hr><br>' +
                        'v 1.013: <br>* Poprawione dzialanie guzika "Mirror Chutes?" przy sprawdzaniu Stacked w SSP.' +
                        '</span>';

                    localStorage.setItem("wersja",3400);
                }

            }


            // Add fast button ATTACH
            if(document.getElementById("assignEmptyTrailerDialog").parentElement.style.display == "block")
            {
                if(document.getElementById("attachmenu_div") == undefined)
                {
                    var attachmenu = document.createElement ('div');
                    attachmenu.innerHTML = '<input id="attach_pre" type="button" value="PRE-load" /> <input id="attach_live" type="button" value="LIVE-load" />';
                    attachmenu.setAttribute ('id', 'attachmenu_div');
                    attachmenu.setAttribute ('style', 'display:grid;width:20%;');
                    document.getElementById("attachAssignedTrailer").parentElement.parentElement.appendChild(attachmenu);

                    document.getElementById ("attach_pre").addEventListener (
                        "click", attach_pre, false
                    );

                    document.getElementById ("attach_live").addEventListener (
                        "click", attach_live, false
                    );

                    function attach_pre (zEvent)
                    {
                        document.getElementsByClassName("selectAttachReason")[0].selectedIndex = 3;
                        document.getElementById("attachAssignedTrailer").className = document.getElementById("attachAssignedTrailer").className.replace(" primaryDisBtn","")
                        document.getElementById("attachAssignedTrailer").click();

                    }

                    function attach_live (zEvent)
                    {
                        document.getElementsByClassName("selectAttachReason")[0].selectedIndex = 2;
                        document.getElementById("attachAssignedTrailer").className = document.getElementById("attachAssignedTrailer").className.replace(" primaryDisBtn","")
                        document.getElementById("attachAssignedTrailer").click();
                    }
                }
            }


        }, 500);


        function ButtonClickGEAR (zEvent)
        {

        }

        function ButtonFans (zEvent)
        {


            GM.xmlHttpRequest({
                method: "POST",
                url: "https://fans-dub.amazon.com/api/message/new",
                data: JSON.stringify({"to":"nowaratn","directReports":"","messageText":"139 do zamkniecia"}),
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            });
        }

        function ButtonPoliczIle (zEvent)
        {
            if (document.getElementById("mirroring_okienko_div").style.visibility == "hidden") {

                // Get the elements with the "colSFilter" class
                const elements = document.getElementsByClassName("colSFilter");

                // Create an array to hold the text values
                const tabl = [];

                // Iterate over the elements and push the text values to the array
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    const text = element.innerText.trim();
                    const vrid = document.getElementById("vrIdDetails").innerText;
                    const nextSiblingValue = element.nextElementSibling ? element.nextElementSibling.innerText.trim() : '';

                    if (text) {
                        tabl.push(text);
                    }
                }

                // Count the frequency of each element and store the count in an object
                const tabl2 = {};
                for (let i = 0; i < tabl.length; i++) {
                    const element = tabl[i];
                    if (element in tabl2) {
                        tabl2[element] += 1;
                    } else {
                        tabl2[element] = 1;
                    }
                }

                // Create an array of unique elements
                const unique = [...new Set(tabl)];

                // Sort the unique elements by their frequency in descending order
                unique.sort((a, b) => tabl2[b] - tabl2[a]);

                // Create a string with the frequency of each unique element
                let wiadomosc_ile = "";
                for (let i = 0; i < unique.length; i++) {
                    const element = unique[i];
                    if (element && element.length >= 3) {
                        wiadomosc_ile += `<b>${element}</b>: ${tabl2[element]}<hr>`;
                    }
                }

                // Add buttons to the output div
                const notesHtml = `
      <br>
      <div id="notes_mirroring_menu">
        <input type="button" id="notes_otworz" value="Otwórz notes" />
        <input type="button" id="notes_policz_ile_dodaj" value="Dodaj do notesu" />
      </div>
    `;
                //wiadomosc_ile += notesHtml;

                // Set the innerHTML of the output div
                document.getElementById("mirroring_okienko_div").innerHTML = wiadomosc_ile;

                // Add event listeners to the buttons
                //   document.getElementById("notes_otworz").addEventListener("click", notes_otworz, false);
                //   document.getElementById("notes_policz_ile_dodaj").addEventListener("click", notes_policz_ile_dodaj, false);

                // Show the output div
                document.getElementById("mirroring_okienko_div").style.visibility = "visible";
            } else {
                // Hide the output div
                document.getElementById("mirroring_okienko_div").style.visibility = "hidden";
            }
        }

        // NOTES
        function notes_otworz (zEvent)
        {
            document.getElementById("infobox_div").style.display = "block";
        }

        function notes_policz_ile_dodaj (zEvent)
        {
            var lane = document.getElementsByClassName("col-md-10 backGroundNone")[0].children[0].innerText;
            lane = lane.replace("Details for\nRoute ","");

            document.getElementById("infobox_tresc_id").innerHTML +=
                '<div class="notatka" style="border-style:solid;margin:10px;overflow:hidden;">' +
                '<div class="notes_header" style="font-size:large;font-weight:bold;margin-top:10px;margin-bottom:10px;">' + lane + '</div></tr>' +
                '<div class="notes_entry_left" style="overflow:hidden;float:left;">' + document.getElementById("mirroring_okienko_div").innerText.replaceAll("\n","<br>") + '</div>' +
                '<div class="notes_entry_right" style="overflow:hidden;"></div>' +
                '<div class="notatka_menu" style="float:nonebackground-color:cornsilk;padding:4px !important;height:100%;"><input id="notatka_co_zamknac" type="button" value="Sprawdź co do zamknięcia" />  </div>' +
                '</div>';


        }



        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }


        function ButtonClosedInfobox (zEvent)
        {
            if(document.getElementById("infobox_div").style.display != "block")
            {
                tytul_okienka_pomocy = "CLOSED.exe HELP PAGE";
                document.getElementById("infobox_div").style.display = "block";
                document.getElementById("infobox_div").style.height = "800px";
                document.getElementById("infobox_div").style.width = "1200px";
                document.getElementById("infobox_div").style.position = "fixed";
                document.getElementById("infobox_div").style.left = "695px";
                document.getElementById("infobox_div").style.top = "85px";
                document.getElementById("infobox_div").style.zIndex = "99999";

                document.getElementById("infobox_tresc_id").innerHTML = '<span style="font-size:26px;">Mozesz oznaczyc sobie, które sekcje poleciles juz zamknac. Zaznaczenie wszystkich spowoduje oznaczenie tego w SSP.<br>Nie musisz o WSZYSTKIM pamietac - zaznaczaj sobie :) </font><hr> <img src="http://ob-clock.000webhostapp.com/help_closed.gif" />';

            }
            else
            {
                document.getElementById("infobox_div").style.display = "none";
            }
        }


        function ButtonClosedFlatBramy (zEvent)
        {
            var button = document.getElementById("button_closed_flatbramy");
            var vrid = document.getElementById("cdetailHead").children[1].children[0].children[0].innerText;

            if(button.style.backgroundColor == "white")
            {
                button.style.setProperty('background-color','greenyellow','important');
                localStorage.setItem(vrid + "_closed_flat_bramy",true);
            }
            else
            {
                button.style.backgroundColor = "white";
                localStorage.setItem(vrid + "_closed_flat_bramy",false);
            }
        }

        function ButtonClosedFlatTSO (zEvent)
        {
            var button = document.getElementById("button_closed_flatTSO");
            var vrid = document.getElementById("cdetailHead").children[1].children[0].children[0].innerText;
            if(button.style.backgroundColor == "white")
            {
                button.style.setProperty('background-color','greenyellow','important');
                localStorage.setItem(vrid + "_closed_flatTSO",true);
            }
            else
            {
                button.style.backgroundColor = "white";
                localStorage.setItem(vrid + "_closed_flatTSO",false);
            }
        }

        function ButtonClosedManualna (zEvent)
        {
            var button = document.getElementById("button_closed_manualna");
            var vrid = document.getElementById("cdetailHead").children[1].children[0].children[0].innerText;
            if(button.style.backgroundColor == "white")
            {
                button.style.setProperty('background-color','greenyellow','important');
                localStorage.setItem(vrid + "_closed_manualna",true);
            }
            else
            {
                button.style.backgroundColor = "white";
                localStorage.setItem(vrid + "_closed_manualna",false);
            }
        }

        // [Jaki stack] akcja
        function ButtonClickActionStack (zEvent)
        {
            document.getElementById("button_stack").style = "";
            document.getElementById("stack_textarea").value = "";

            var kierunek;
            var kierunek2;
            var paleta;
            var palety = "";
            var zle;
            zle = false;
            var ileklik = document.getElementsByClassName("floatL treeLinkMargin showTreeChild show-child");

            for(var a = 0;a < ileklik.length;a++)
            {
                ileklik[a].click();
            }


            for(a=1;a<document.getElementsByClassName("colSFilter").length-1;a++)
            {
                kierunek = document.getElementsByClassName("colSFilter")[a].innerText;
                kierunek = kierunek.substring(0,4);
                kierunek2 = document.getElementsByClassName("colSFilter")[a+1].innerText;
                kierunek2 = kierunek2.substring(0,4);

                if(document.getElementsByClassName("colSFilter")[a].className != "sfilterName colSFilter" && document.getElementsByClassName("colSFilter")[a+1].className != "sfilterName colSFilter")
                {
                    if(kierunek != kierunek2)
                    {
                        //  console.log(kierunek + " =? " + kierunek2)
                        // console.log(document.getElementsByClassName("colSFilter")[a].parentElement.parentElement.parentElement.parentElement);
                        if(document.getElementsByClassName("colSFilter")[a].parentElement.parentElement.parentElement.parentElement.children[1] != null)
                        {
                            paleta = document.getElementsByClassName("colSFilter")[a].parentElement.parentElement.parentElement.parentElement.children[1].children[0].innerText;
                        }
                        else
                        {
                            paleta = document.getElementsByClassName("colSFilter")[a].parentElement.parentElement.parentElement.children[1].children[0].innerText;
                        }
                        // console.log(paleta);
                        paleta = paleta.substring(2,paleta.length - 4);
                        palety = palety + paleta + "  /  ";

                        zle = true;
                        a++;
                    }
                }
            }

            if(zle == false)
            {
                document.getElementById("button_stack").style = "color:green;";
            }
            else
            {
                document.getElementById("stack_textarea").value = palety;
                document.getElementById("button_stack").style = "color:red;";

            }
            setTimeout(function() {
                document.getElementById("button_stack").style = "";
            },3000);
        }

        // [Jaki Chute?] akcja
        function ButtonClickActionSzut (zEvent)
        {
            var chuty = document.getElementsByClassName("colSFilter");

            for (var q = 0 ; q < chuty.length ; q++)
            {
                for (var y = 0 ; y < szut.length ; y++)
                {
                    if(document.getElementsByClassName("colSFilter")[q].innerText == szut[y][0])
                    {
                        document.getElementsByClassName("colSFilter")[q].innerText = szut[y][1];
                    }
                }
            }

            //             for (q = 0; q < szut.length; q++)
            //             {
            //                 if(!chuty.innerText(szut[q][1]))
            //                 {
            //                     var replace = "regex";
            //                     var re = new RegExp(szut[q][0],"g");
            //                     chuty.innerHTML = chuty.innerHTML.replace(re, szut[q][0] + "<br>("+szut[q][1]+")");
            //                 }
            //             }
            //             chuty = "";
        }

        // [ROZWIN] akcja
        function ButtonClickActionRozwin (zEvent)
        {
            var ile_rozwin;
            var i = 0;
            ile_rozwin = document.getElementsByClassName("childTree").length;
            var elements = document.querySelectorAll('.childTree');

            if(document.getElementById("buttonrozwin").textContent != "Zwiń")
            {
                document.getElementById("buttonrozwin").textContent = "Zwiń";

                elements.forEach(function(element) {
                    if(element.className == "childTree hidden")
                    {
                        element.className = "childTree";
                    }
                });
            }
            else
            {
                document.getElementById("buttonrozwin").textContent = "Rozwiń";

                elements.forEach(function(element) {
                    if(element.className == "childTree")
                    {
                        element.className = "childTree hidden";
                    }
                });
            }

        }


        function getDockingStatuses() {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "POST",
                    url: "https://www.amazonlogistics.eu/gtdr/graphql",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-US",
                        "Content-Type": "application/json",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin",
                        "Priority": "u=4"
                    },
                    data: JSON.stringify({
                        operationName: "dockingLocations",
                        variables: {
                            nodeId: "KTW1"
                        },
                        query: `query dockingLocations($nodeId: String!) {
                    dockingLocations(nodeId: $nodeId) {
                        label
                        dockingStatus
                        workflowId
                        lastReleasedVehicleId
                        isPaused
                        pauseReason
                        pauseReasonText
                        onResumeStepName
                        vehicle {
                            identifier
                            number
                            type
                            loadIntegrityIssueList {
                                riskType
                                __typename
                            }
                            __typename
                        }
                        tdrState {
                            tdrMismatch
                            yimTDRState
                            vehicle {
                                identifier
                                number
                                type
                                __typename
                            }
                            __typename
                        }
                        __typename
                    }
                }`
                    }),
                    onload: function(response) {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            const dockTable = {};

                            // Tworzenie tablicy asocjacyjnej ze sprawdzeniem statusu
                            jsonResponse.data.dockingLocations.forEach(dock => {
                                if (dock.dockingStatus === "Docking" && dock.pauseReason === null)
                                {
                                    dockTable[dock.label] = "Dokowanie OM/IM";
                                }

                                if (dock.dockingStatus === "Docking" && dock.pauseReason !== null)
                                {
                                    dockTable[dock.label] = "Zadokowane OM";
                                }

                                if (dock.dockingStatus === "Docked" && dock.pauseReason === null)
                                {
                                    dockTable[dock.label] = "Otwarte IM";
                                }

                                if (dock.dockingStatus === "Releasing" && dock.pauseReason === null)
                                {
                                    dockTable[dock.label] = "Zamykanie IM";
                                }

                                if (dock.dockingStatus === "Releasing" && dock.pauseReason !== null)
                                {
                                    dockTable[dock.label] = "Zamknięte IM";
                                }




                            });

                            resolve(dockTable);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }
        var dockTable = {};

        function removeCookie(name) {
            document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        }

        // [ODSWIEZ] akcja
        async function ButtonClickActionOdswiez(zEvent) {
            dockTable = {};

            removeCookie("amzn_sso_rfp");
            removeCookie("amzn_sso_token");

            document.getElementById("manualRefresh").click();

            await Promise.all([
                getDockingStatuses().then(result => dockTable = result),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);

            if(localStorage.getItem("belka_ssp") == "none") {
                addGlobalStyle('#topDetailList { display:none !important; }','belka_ssp');
            } else {
                addGlobalStyle('#topDetailList { display:block !important; }','belka_ssp');
            }
        }

        // [MIRROR] akcja
        function ButtonClickActionMirror (zEvent)
        {
            // document.getElementsByClassName("childTree")[0].children[0].children[0].children[1].children[3]
            if(document.getElementById("mirroring_okienko_div").style.visibility == "hidden")
            {
                var stack;
                var chute;
                var stack_lista = Array.from(Array(20), () => new Array(40));
                var i;
                var j;
                var z;
                j = 0;
                var ile = document.getElementsByClassName("childTree").length;

                // document.getElementsByClassName("childTree")[1].children[0].children[0].children[1].children[3].parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].children[0].children[1].innerText

                for (i=0;i<ile;i++)
                {
                    if(document.getElementsByClassName("childTree")[i] != undefined)
                    {
                        chute = document.getElementsByClassName("childTree")[i].children[0].children[0].children[1].children[3].parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].children[0].children[1].innerText;
                        if(chute.substring(0,6) == "FLAT-A" || chute.substring(0,6) == "FST-A-")
                        {

                            stack = document.getElementsByClassName("childTree")[i].children[0].children[0].children[1].children[3].innerText;
                            // console.log(stack);

                            if(/\s/.test(stack) == true)
                            {
                                document.getElementsByClassName("childTree")[i].children[0].children[0].children[1].children[0].children[0].children[0].children[0].click();
                                stack = document.getElementsByClassName("childTree")[i].children[0].children[0].children[1].nextSibling.children[0].children[1].children[3].innerText.replace("-SMALL-VCRI","");
                                document.getElementsByClassName("childTree")[i].children[0].children[0].children[1].children[0].children[0].children[0].children[0].click();
                            }


                            if(stack != "" && stack != null)
                            {
                                //  console.log(j);
                                //  console.log(stack);

                                if(exists(stack_lista,stack) == false)
                                {
                                    stack_lista[j][0] = stack;
                                    stack_lista[j][1] = chute;
                                    j++;
                                }
                                else
                                {
                                    for(var k = 0; k < 20; k++)
                                    {
                                        if(stack_lista[k][0] == stack)
                                        {
                                            /*                                              console.log("JEST: " + stack);
                                                     console.log("k: " + k);
                                                     console.log(stack_lista[k][0]);
                                                     console.log(chute); */
                                            stack_lista[k][2] = chute;
                                            k = 20;
                                        }
                                    }


                                }
                            }
                        }
                    }
                }

                var tempmirror = "";
                var niemirror = "";
                var mirror;

                document.getElementById("mirroring_okienko_div").innerText = "";
                for(i=0;i<=20;i++)
                {
                    if(stack_lista[i] != undefined)
                    {
                        //  console.log("przed: " + stack_lista[i][2]);
                        if(stack_lista[i][2] != undefined)
                        {
                            //   console.log("po: " + stack_lista[i][2]);
                            tempmirror = tempmirror + stack_lista[i][0] + " - <font color='green'>" + stack_lista[i][1] + "<font color='black'><-><font color='green'>" + stack_lista[i][2] + "</font><br>";
                            //    document.getElementById("mirroring_okienko_div").innerText = temp + stack_lista[i][0] + " - " + stack_lista[i][1] + "<->" + stack_lista[i][2] + "\r\n";
                        }
                        else
                        {
                            if(stack_lista[i][0] != undefined && stack_lista[i][1] != undefined)
                            {
                                niemirror = niemirror + stack_lista[i][0] + " - <font color='tomato'>" + stack_lista[i][1] + "</font><br>";
                            }
                        }
                    }
                }

                document.getElementById("mirroring_okienko_div").innerHTML = "<b>" + tempmirror + "<hr>" + niemirror;

                //      document.getElementsByClassName("childTree")[1].children[0].children[0].children[1].children[3].innerText

                document.getElementById("mirroring_okienko_div").style.visibility = "visible";
            }
            else
            {
                document.getElementById("mirroring_okienko_div").style.visibility = "hidden";
            }
        }


    }


    // Sprawdzanie, czy strona TroubleShooting Tool jest ustawiona na KTW1
    if(window.location.href.indexOf("://trans-logistics-eu.amazon.com/sortcenter/tt?setNodeId=KTW1") > -1)
    {
        if(document.getElementById("availableNodeName").innerText != "KTW1")
        {
            location.reload();
        }
    }



    // wyglad case i Case buttons
    if(window.location.href.indexOf("trans-logistics-eu.amazon.com/fmc/execution") > -1)
    {
        console.log("FMC");
        var case_int = setInterval(function() {
            if(document.getElementsByClassName("dropdown-menu  dropdown-menu-right ")[0].children[0] != undefined)
            {
                document.getElementsByClassName("dropdown-menu  dropdown-menu-right ")[0].children[0].className = "enabled";
            }

            var wynik = document.querySelectorAll('.case-correspondence-container');
            if(wynik[0] != undefined)
            {
                for(i=0;i<=wynik[0].children[0].children.length;i++)
                {
                    if(wynik[0].children[0].children[i] != undefined)
                    {
                        wynik[0].children[0].children[i].style.height = "250px";
                        wynik[0].children[0].children[i].style.overflow = "scroll";
                    }
                }
            }
        },1000);


        // CRITS TRUCK COUNTER
        var critsFMC = document.createElement ('div');
        critsFMC.innerHTML = '<input id="crits_fmc_button" type="button" value="Wylistuj auta na CRITS" style />';
        critsFMC.setAttribute('style',";");
        critsFMC.setAttribute ('id', 'critsFMC_div');
        critsFMC.setAttribute ('class', 'datatable-widget-left-inline');
        document.getElementsByClassName('widget-holder')[0].children[0].appendChild(critsFMC);

        document.getElementById('crits_fmc_button').addEventListener('click', processTable);


        function processTable() {
            // Znajdź tabelę o id 'fmc-execution-plans-vrs'
            var table = document.getElementById('fmc-execution-plans-vrs');
            if (!table) {
                alert('Nie znaleziono tabeli');
                return;
            }

            // Znajdź indeksy kolumn "Facility Sequence", "Shipper Account" i "VR ID"
            var thead = table.getElementsByTagName('thead')[0];
            var headerRow = thead.getElementsByTagName('tr')[0];
            var headers = headerRow.getElementsByTagName('th');
            var facilitySeqIndex = -1;
            var shipperAccountIndex = -1;
            var vrIdIndex = -1;
            var truckFilterIndex = -1;

            for (var i = 0; i < headers.length; i++) {
                var headerText = headers[i].innerText.trim();
                if (headerText === 'Facility Sequence') {
                    facilitySeqIndex = i;
                }
                if (headerText === 'Shipper Account') {
                    shipperAccountIndex = i;
                }
                if (headerText === 'VR ID') {
                    vrIdIndex = i;
                }
                if (headerText === 'Truck filter') {
                    truckFilterIndex = i;
                }
            }

            if (facilitySeqIndex === -1 || shipperAccountIndex === -1 || vrIdIndex === -1) {
                alert('Nie znaleziono wymaganych kolumn');
                return;
            }

            // Tablice z zadeklarowanymi wartościami
            var facilityArray = ['KTW1->DUS4', 'KTW1->FRA7', 'KTW1->NUE1', 'KTW1->POZ2', 'KTW1->BRE4'];
            var shipperArray = ['CustomerReturns','OutboundVendorReturns', 'BobtailMovementAnnotation','FleetManagementEquipmentRepositioning'];

            // Inicjalizuj obiekt dla każdego elementu
            var vrIdData = {};
            for (i = 0; i < facilityArray.length; i++) {
                vrIdData[facilityArray[i]] = [];
            }

            // Przejdź przez wiersze tabeli i zbierz VR ID
            var tbody = table.getElementsByTagName('tbody')[0];
            var rows = tbody.querySelectorAll('tr[id]');
            for (i = 0; i < rows.length; i++) {
                var cells = rows[i].children;
                var facilityValue = cells[facilitySeqIndex].innerText.trim();
                var shipperValue = cells[shipperAccountIndex].innerText.trim();
                var truckFilter = cells[truckFilterIndex].innerText.trim();
                var vrIdValue = cells[vrIdIndex].innerText.trim();

                if (!shipperArray.includes(shipperValue)) {
                    console.log(facilityValue);
                    if (facilityArray.includes(facilityValue)) {
                        vrIdData[facilityValue].push(vrIdValue);
                    } else if (facilityArray.includes("KTW1->" + truckFilter)) {
                        vrIdData["KTW1->" + truckFilter].push(vrIdValue);
                    }
                }
            }

            // Utwórz tabelę wynikową
            var resultTable = '<table border="1"><tr><th>Element</th><th>VR IDs</th></tr>';
            for (var key of facilityArray) {
                var vrIds = vrIdData[key].join(' ');
                resultTable += '<tr><td>' + key + '</td><td>' + vrIds + '</td></tr>';
            }
            resultTable += '</table>';

            // Wyświetl okienko z wynikiem
            var resultWindow = window.open('', 'Wynik', 'width=600,height=400');
            resultWindow.document.write('<html><head><title>Wynik</title></head><body>');
            resultWindow.document.write(resultTable);
            resultWindow.document.write('</body></html>');
            resultWindow.document.close();
        }



    }

    function recreateNode(el, withChildren) {
        if (withChildren) {
            el.parentNode.replaceChild(el.cloneNode(true), el);
        }
        else {
            var newEl = el.cloneNode(false);
            while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
            el.parentNode.replaceChild(newEl, el);
        }
    }

    function httpGet(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    var getFromBetween = {
        results:[],
        string:"",
        getFromBetween:function (sub1,sub2) {
            if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
            var SP = this.string.indexOf(sub1)+sub1.length;
            var string1 = this.string.substr(0,SP);
            var string2 = this.string.substr(SP);
            var TP = string1.length + string2.indexOf(sub2);
            return this.string.substring(SP,TP);
        },
        removeFromBetween:function (sub1,sub2) {
            if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
            var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
            this.string = this.string.replace(removal,"");
        },
        getAllResults:function (sub1,sub2) {
            // first check to see if we do have both substrings
            if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

            // find one result
            var result = this.getFromBetween(sub1,sub2);
            // push it to the results array
            this.results.push(result);
            // remove the most recently found one from the string
            this.removeFromBetween(sub1,sub2);

            // if there's more substrings
            if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
                this.getAllResults(sub1,sub2);
            }
            else return;
        },
        get:function (string,sub1,sub2) {
            this.results = [];
            this.string = string;
            this.getAllResults(sub1,sub2);
            return this.results;
        }
    };

    function exists(arr, search) {
        return arr.some(row => row.includes(search));
    }

    function addGlobalStyle(css, id) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }

        if (id && addedStyles[id]) {
            // Jeśli styl o podanym id już istnieje, zaktualizuj go
            addedStyles[id].innerHTML = css;
        } else {
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;

            if (id) {
                // Jeśli podane jest id, zapisz styl w obiekcie addedStyles
                addedStyles[id] = style;
            }

            head.appendChild(style);
        }
    }

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    async function moveBarka() {
        // Zmienna kremowka zdefiniowana na wyższym poziomie
        let kremowkaInterval;

        // Stworzenie guzika wyłącz jako tafli morza
        var barka_off = document.createElement('div');
        barka_off.innerHTML = `
        <img src='https://drive.corp.amazon.com/view/nowaratn@/barka/waves.png' style='z-index:100 !important; position:fixed; display:block; bottom:10px;' /><br>
        <img src='https://drive.corp.amazon.com/view/nowaratn@/barka/waves_one.png' style='z-index:102 !important; position:fixed; display:block; bottom:0px !important;' />
    `;
        barka_off.style = "width:100%; display:block;";
        barka_off.id = 'barka_off_id';

        barka_off.addEventListener("click", btnBarkaOff, false);

        // Stworzenie obiektu barki
        var barka_div = document.createElement('div');
        barka_div.innerHTML = '<img id="barka_image_id" src="https://drive-render.corp.amazon.com/view/nowaratn@/barka/barka.png" />';
        barka_div.id = 'barka_div_id';
        barka_div.style = `
        display: inline-flex;
        width: 190px;
        height: 100px;
        right: -200px;
        bottom: 0px;
        position: fixed;
        z-index: 101;
        transition: transform 100s linear;
        transform: translateX(0%);
        cursor: pointer;
    `;

        // Dodanie interakcji z barką
        barka_div.addEventListener('click', () => {
            const horn = new Audio('https://example.com/horn_sound.mp3'); // Upewnij się, że masz odpowiedni URL do dźwięku
            horn.play();
        });

        // Uruchomienie muzyki
        var barkaMusic = new Audio('https://drive.corp.amazon.com/view/nowaratn@/barka/barka_v2.mp3');
        barkaMusic.loop = true; // Ustawienie muzyki na pętlę
        barkaMusic.play();

        function btnBarkaOff() {
            document.getElementById("barka_div_id")?.remove();
            document.getElementById("barka_off_id")?.remove();
            barkaMusic.pause();

            // Zatrzymanie generowania kremówek
            clearInterval(kremowkaInterval);

            const elements = document.querySelectorAll(".falling-image");
            elements.forEach(element => element.remove());

            // Usunięcie tła z falami
            document.getElementById("wave_background")?.remove();
        }

        // Dodanie efektu fali na tle
        function addWaveBackground() {
            const waveBackground = document.createElement('div');
            waveBackground.id = 'wave_background';
            waveBackground.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 25%;
            height: 25%;
            background: url('https://drive-render.corp.amazon.com/view/nowaratn@/barka/wave.gif') repeat-x;
            background-size: cover;
            z-index: 50;
            pointer-events: none;
            animation: wave 10s linear infinite;
        `;

            document.body.appendChild(waveBackground);

            // Dodanie kluczy @keyframes dla animacji tła
            const styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = `
            @keyframes wave {
                from { background-position-x: 0; }
                to { background-position-x: 1000px; }
            }
        `;
            document.head.appendChild(styleSheet);
        }

        // Po 6 sekundach muzyki, uruchomienie barki z prawej na lewą
        setTimeout(function() {
            document.body.appendChild(barka_div); // barka
            document.body.appendChild(barka_off); // fale

            // Dodanie tła z falami
            // addWaveBackground();

            // Funkcja do generowania losowej liczby w zakresie
            function getRandom(min, max) {
                return Math.random() * (max - min) + min;
            }

            // Tworzenie elementu obrazka i ustawianie jego stylu
            function createImage() {
                const image = new Image();
                image.src = 'https://drive-render.corp.amazon.com/view/nowaratn@/barka/kremowka.png';
                image.className = 'falling-image';

                const maxX = window.innerWidth - 50; // szerokość obrazka to 50px
                const initialX = getRandom(0, maxX);

                // Losowy rozmiar
                const size = getRandom(30, 70); // Rozmiar od 30px do 70px

                image.style.position = 'fixed';
                image.style.left = `${initialX}px`;
                image.style.top = `-50px`; // Startuje tuż nad widoczną częścią strony
                image.style.width = `${size}px`;
                image.style.height = `${size}px`;
                image.style.zIndex = '200';

                // Rotacja
                const rotation = getRandom(0, 360);
                image.style.transform = `rotate(${rotation}deg)`;

                document.body.appendChild(image);

                const animationDuration = getRandom(2, 5);

                image.style.transition = `
                top ${animationDuration}s linear,
                transform ${animationDuration}s linear
            `;

                // Rotacja podczas spadania
                const rotationSpeed = getRandom(360, 720); // Pełne obroty
                setTimeout(() => {
                    const maxY = window.innerHeight + 50;
                    image.style.top = `${maxY}px`;
                    image.style.transform = `rotate(${rotation + rotationSpeed}deg)`;
                }, 0);

                // Usunięcie obrazka po zakończeniu animacji
                image.addEventListener('transitionend', () => image.remove());
            }

            // Wywołanie funkcji createImage co pewien czas
            const spawnInterval = 500; // ms
            kremowkaInterval = setInterval(createImage, spawnInterval);

            setTimeout(function() {
                const pageWidth = window.innerWidth;
                barka_div.style.transform = `translateX(-${pageWidth + 200}px)`;
                setTimeout(function(){
                    clearInterval(kremowkaInterval);
                    btnBarkaOff();
                }, 120000);
            }, 100);
        }, 6000);
    }


    async function Snoop() {
        // Podmień poniższe linki na swoje
        var imageUrls = [
            'https://drive.corp.amazon.com/view/nowaratn@/Snoop/weed1.png',
            'https://drive.corp.amazon.com/view/nowaratn@/Snoop/weed2.png',
            'https://drive.corp.amazon.com/view/nowaratn@/Snoop/weed3.png',
            'https://drive.corp.amazon.com/view/nowaratn@/Snoop/weed4.png'
        ];

        var cornerImageUrl = 'https://drive.corp.amazon.com/view/nowaratn@/Snoop/snoop.gif'; // Obraz w rogach strony
        var centerImageUrl = 'https://drive.corp.amazon.com/view/nowaratn@/Snoop/fog1.gif'
        var musicUrl = 'https://drive.corp.amazon.com/view/nowaratn@/Snoop/snoop.mp4'; // Muzyka do odtworzenia
        var buttonImageUrl = 'https://www.safetysign.com/images/source/medium-images/J2501.png'; // Obraz dla guzika wyłączającego

        var imageDelay = 3000; // Opóźnienie przed pojawieniem się obrazów (w milisekundach)
        var buttonMoveCount = 9; // Liczba przemieszczeń guzika

        // Odtwarzanie muzyki po uruchomieniu
        var audio = new Audio(musicUrl);
        audio.loop = true; // Muzyka będzie się powtarzać
        audio.play().catch(function (error) {
            console.log('Autoodtwarzanie muzyki zostało zablokowane przez przeglądarkę.');
        });

        // Zmienna przechowująca ID interwału tworzenia obrazów
        var fallingImagesInterval;
        // Tablica przechowująca referencje do spadających obrazów
        var fallingImages = [];
        // Referencje do obrazów w rogach
        var leftCornerImage, rightCornerImage;

        // Funkcja do efektu fade-in
        function fadeIn(element, duration) {
            element.style.opacity = 0;
            element.style.transition = 'opacity ' + duration + 'ms';
            setTimeout(function() {
                element.style.opacity = 1;
            }, 10); // Krótkie opóźnienie, aby zapewnić działanie transition
        }

        // Funkcja tworząca spadający obraz z efektem fade-in i obrotem
        function createFallingImage() {
            var fallingImage = document.createElement('img');
            // Wybierz losowy obraz z tablicy imageUrls
            var randomIndex = Math.floor(Math.random() * imageUrls.length);
            fallingImage.src = imageUrls[randomIndex];
            fallingImage.style.position = 'fixed';
            fallingImage.style.top = '-100px';
            fallingImage.style.left = Math.random() * window.innerWidth + 'px';
            var size = 30 + Math.random() * 70; // Losowy rozmiar między 30 a 100 pikseli
            fallingImage.style.width = size + 'px';
            fallingImage.style.height = 'auto';
            fallingImage.style.opacity = 0; // Początkowa przezroczystość 0
            fallingImage.style.pointerEvents = 'none'; // Obraz nie będzie reagował na zdarzenia myszy
            fallingImage.style.transition = 'opacity 1000ms';
            fallingImage.style.zIndex = 9999;

            // Ustawienie początkowego obrotu
            var rotationDirection = Math.random() < 0.5 ? -1 : 1; // Losowy kierunek obrotu
            var rotationSpeed = 0.1 + Math.random() * 0.5; // Losowa prędkość obrotu

            document.body.appendChild(fallingImage);

            // Dodaj obraz do tablicy
            fallingImages.push(fallingImage);

            // Efekt fade-in dla spadającego obrazu
            setTimeout(function() {
                fallingImage.style.opacity = Math.random() * 0.5 + 0.5; // Losowa przezroczystość między 0.5 a 1
            }, 10);

            // Animacja spadającego obrazu z obrotem
            var duration = 5000 + Math.random() * 5000; // Losowy czas trwania między 5 a 10 sekund
            var start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                var progress = timestamp - start;
                var translateY = (progress / duration) * (window.innerHeight + 200);
                var rotateAngle = rotationDirection * rotationSpeed * progress;

                fallingImage.style.transform = 'translateY(' + translateY + 'px) rotate(' + rotateAngle + 'deg)';
                if (progress < duration) {
                    fallingImage.animationFrameId = window.requestAnimationFrame(step);
                } else {
                    document.body.removeChild(fallingImage);
                    // Usuń obraz z tablicy
                    var index = fallingImages.indexOf(fallingImage);
                    if (index > -1) {
                        fallingImages.splice(index, 1);
                    }
                }
            }
            fallingImage.animationFrameId = window.requestAnimationFrame(step);
        }

        // Uruchomienie dodawania obrazów po opóźnieniu
        setTimeout(function() {
            // Dodanie obrazów w dolnych rogach strony
            leftCornerImage = document.createElement('img');
            leftCornerImage.src = cornerImageUrl;
            leftCornerImage.style.position = 'fixed';
            leftCornerImage.style.bottom = '0px';
            leftCornerImage.style.left = '0px';
            leftCornerImage.style.width = '100px'; // Możesz dostosować rozmiar
            leftCornerImage.style.height = 'auto';
            leftCornerImage.style.zIndex = 9999;
            fadeIn(leftCornerImage, 1000); // Efekt fade-in przez 1 sekundę
            document.body.appendChild(leftCornerImage);

            rightCornerImage = document.createElement('img');
            rightCornerImage.src = cornerImageUrl;
            rightCornerImage.style.position = 'fixed';
            rightCornerImage.style.bottom = '0px';
            rightCornerImage.style.right = '0px';
            rightCornerImage.style.width = '100px'; // Możesz dostosować rozmiar
            rightCornerImage.style.height = 'auto';
            rightCornerImage.style.zIndex = 9999;
            fadeIn(rightCornerImage, 1000); // Efekt fade-in przez 1 sekundę
            document.body.appendChild(rightCornerImage);

            // Tworzenie spadających obrazów w odstępach czasu
            fallingImagesInterval = setInterval(createFallingImage, 500);
        }, imageDelay);

        // Dodanie guzika do wyłączenia funkcji
        var button = document.createElement('img');
        button.src = buttonImageUrl;
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.width = '120px'; // Możesz dostosować rozmiar
        button.style.height = 'auto';
        button.style.cursor = 'pointer';
        button.style.zIndex = 10000;
        document.body.appendChild(button);

        var moveCount = 0;
        var maxMoves = buttonMoveCount; // Liczba przemieszczeń

        function moveButton() {
            if (moveCount < maxMoves) {
                // Przesuń guzik w losowe miejsce
                var randomTop = Math.random() * (window.innerHeight - 50) + 'px';
                var randomLeft = Math.random() * (window.innerWidth - 50) + 'px';
                button.style.top = randomTop;
                button.style.left = randomLeft;
                button.style.right = 'auto'; // Resetuj prawą pozycję
                moveCount++;
            } else {
                // Po osiągnięciu maksymalnej liczby przemieszczeń, pozostaw guzik w miejscu
                button.removeEventListener('mouseover', moveButton);
            }
        }

        button.addEventListener('mouseover', moveButton);

        // Funkcja do wyłączenia funkcji
        function disableFunctions() {
            // Zatrzymaj muzykę
            audio.pause();
            audio.currentTime = 0;

            // Usuń obrazy w rogach
            if (leftCornerImage && leftCornerImage.parentNode) {
                leftCornerImage.parentNode.removeChild(leftCornerImage);
            }
            if (rightCornerImage && rightCornerImage.parentNode) {
                rightCornerImage.parentNode.removeChild(rightCornerImage);
            }

            // Zatrzymaj tworzenie nowych spadających obrazów
            clearInterval(fallingImagesInterval);

            // Usuń istniejące spadające obrazy
            fallingImages.forEach(function(img) {
                window.cancelAnimationFrame(img.animationFrameId);
                if (img.parentNode) {
                    img.parentNode.removeChild(img);
                }
            });
            fallingImages = [];

            // Usuń guzik
            if (button && button.parentNode) {
                button.parentNode.removeChild(button);
            }
        }

        button.addEventListener('click', disableFunctions);
    }
},3000);