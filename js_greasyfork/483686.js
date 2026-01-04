// ==UserScript==
// @name         TEST - Kvido Multiscript
// @namespace    http://tampermonkey.net/
// @version      4.03
// @description  Skript všech skriptů
// @author       KvidoTeam
// @icon         https://i.pinimg.com/originals/0c/1e/07/0c1e07d8c596e69d24cd414c2ec6b1d9.png
// @license      MIT
// @include      *
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/483686/TEST%20-%20Kvido%20Multiscript.user.js
// @updateURL https://update.greasyfork.org/scripts/483686/TEST%20-%20Kvido%20Multiscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;

    // Definice podmínek a příslušných URL skriptů
    var scriptConditions = [
        {
            urlPattern: /www.uefa.com\/.*\/match\/.*/, // UEFA Soupiska
            scriptUrl: 'https://update.greasyfork.org/scripts/480471/UEFA%20Soupiska.user.js'
        },
        {
            urlPattern: /.*dataproject.com\/CompetitionMatches/i, //Volejbal - Dataproject - víkendová příprava
            scriptUrl: 'https://greasyfork.org/scripts/458725-volejbal-dataproject-v%C3%ADkendov%C3%A1-p%C5%99%C3%ADprava/code/Volejbal%20-%20Dataproject%20-%20v%C3%ADkendov%C3%A1%20p%C5%99%C3%ADprava.user.js'
        },
        {
            urlPattern: /.*dataproject.com\/Livescore\.aspx/i, //Volejbal - Dataproject
            scriptUrl: 'https://greasyfork.org/scripts/458724-volejbal-dataproject/code/Volejbal%20-%20Dataproject.user.js'
        },
        {
            urlPattern: /zapasy.ceskyhokej.cz\/admin\/schedule\/match\/detail\/*|hokejovyzapis.cz\/admin\/schedule\/match\/detail\/*/, //Hokejový zápis
            scriptUrl: 'https://greasyfork.org/scripts/458739-hokejov%C3%BD-z%C3%A1pis/code/Hokejov%C3%BD%20z%C3%A1pis.user.js'
        },
        {
            urlPattern: /.*eurohandball.com.*matches\/.+/, //Házená - Eurohandball
            scriptUrl: 'https://greasyfork.org/scripts/458729-h%C3%A1zen%C3%A1-eurohandball/code/H%C3%A1zen%C3%A1%20-%20Eurohandball.user.js'
        },
        {
            urlPattern: /ivibet1.com\/cz\/prematch\/.*/, //Esporty - ivibet
            scriptUrl: 'https://greasyfork.org/scripts/467633-esporty-ivibet/code/Esporty%20-%20ivibet.user.js'
        },
        {
            urlPattern: /frhlive.com/, //Házená - Rumunsko ofiko
            scriptUrl: 'https://greasyfork.org/scripts/459394-h%C3%A1zen%C3%A1-rumunsko-ofiko/code/H%C3%A1zen%C3%A1%20-%20Rumunsko%20ofiko.user.js'
        },
        {
            urlPattern: /arkus\-liga\.rs\/vestilist\.php|sportinfocentar\.com\/livescore\/unistat\/indexhrs\.html|srl.rs\/index.php/, //Házená - Chorvatsko a Srbsko
            scriptUrl: 'https://greasyfork.org/scripts/458744-h%C3%A1zen%C3%A1-chorvatsko-a-srbsko/code/H%C3%A1zen%C3%A1%20-%20Chorvatsko%20a%20Srbsko.user.js'
        },
        {
            urlPattern: /ceskyflorbal\.cz\/match\/detail\/default\//, //Florbal - ofiko ceskyflorbal.cz
            scriptUrl: 'https://greasyfork.org/scripts/458723-florbal-ofiko-ceskyflorbal-cz/code/Florbal%20-%20ofiko%20ceskyflorbalcz.user.js'
        },
        {
            urlPattern: /mlssoccer.com\/schedule\/scores/, //Fotbal - MLS - stats
            scriptUrl: 'https://greasyfork.org/scripts/458844-fotbal-mls-stats/code/Fotbal%20-%20MLS%20-%20stats.user.js'
        },
        {
            urlPattern: /ice\.hockey\/en\/schedule\-results\/schedule/, //Hokej - Rakousko
            scriptUrl: 'https://greasyfork.org/scripts/458856-hokej-rakousko/code/Hokej%20-%20Rakousko.user.js'
        },
        {
            urlPattern: /rwp-league.com\/results\/index.php/, //Vodní pólo - Regionalna vaterpolo liga
            scriptUrl: 'https://greasyfork.org/scripts/458857-vodn%C3%AD-p%C3%B3lo-regionalna-vaterpolo-liga/code/Vodn%C3%AD%20p%C3%B3lo%20-%20Regionalna%20vaterpolo%20liga.user.js'
        },
        {
            urlPattern: /app.floorball.sport\/\S+/, //Floorball.sport
            scriptUrl: 'https://greasyfork.org/scripts/468629-floorball-sport/code/Floorballsport.user.js'
        },
        {
            urlPattern: /onlajny.com\/league\/index\/id\/16/, //Hokej - ČR extraliga statistiky
            scriptUrl: 'https://greasyfork.org/scripts/458738-hokej-%C4%8Dr-extraliga-statistiky/code/Hokej%20-%20%C4%8CR%20extraliga%20statistiky.user.js'
        },
        {
            urlPattern: /tophaandbold.dk\/kampprogram\/.*/, //Házená - Dánsko ofiko
            scriptUrl: 'https://greasyfork.org/scripts/458832-h%C3%A1zen%C3%A1-d%C3%A1nsko-ofiko/code/H%C3%A1zen%C3%A1%20-%20D%C3%A1nsko%20ofiko.user.js'
        },
        {
            urlPattern: /bundesliga.com\/en\/2?bundesliga\/matchday/, //Fotbal - Bundesliga stats+soupiska
            scriptUrl: 'https://greasyfork.org/scripts/459196-fotbal-bundesliga-stats-soupiska/code/Fotbal%20-%20Bundesliga%20stats+soupiska.user.js'
        },
        {
            urlPattern: /beinsports.com\/france\/turquie-super-lig\/calendrier/, //Fotbal - Turecko ofiko stats
            scriptUrl: 'https://greasyfork.org/scripts/459197-fotbal-turecko-ofiko-stats/code/Fotbal%20-%20Turecko%20ofiko%20stats.user.js'
        },
        {
            urlPattern: /federalhockey.com\/stats/, //Hokej - USA FPHL
            scriptUrl: 'https://greasyfork.org/scripts/458736-hokej-usa-fphl/code/Hokej%20-%20USA%20FPHL.user.js'
        },
        {
            urlPattern: /marathonbet.com|es\/en\/live\//, //Marathonbet Live Statistics
            scriptUrl: 'https://greasyfork.org/scripts/468742-marathonbet-live-statistics/code/Marathonbet%20Live%20Statistics.user.js'
        },
        {
            urlPattern: /mlb.com\/gameday\/.+/, //MLB Stats
            scriptUrl: 'https://greasyfork.org/scripts/468743-mlb-stats/code/MLB%20Stats.user.js'
        },
        {
            urlPattern: /widgets.besoccerapps.com\/scripts\/widgets\?type\=matchs\&competition.*/, //Fotbal - Španělsko
            scriptUrl: 'https://greasyfork.org/scripts/458732-fotbal-%C5%A1pan%C4%9Blsko/code/Fotbal%20-%20%C5%A0pan%C4%9Blsko.user.js'
        },
        {
            urlPattern: /glomdalen.no\/fotball\/live\//, //Glomdalen
            scriptUrl: 'https://greasyfork.org/scripts/468866-glomdalen/code/Glomdalen.user.js'
        },
        {
            urlPattern: /tulospalvelu\.palloliitto\.fi\/match\/[0-9]+/, //Fotbal - Finsko ofiko
            scriptUrl: 'https://greasyfork.org/scripts/466928-fotbal-finsko-ofiko/code/Fotbal%20-%20Finsko%20ofiko.user.js'
        },
        {
            urlPattern: /scorebing\.com\/match\/.+/, //Scorebing live url
            scriptUrl: 'https://greasyfork.org/scripts/469241-scorebing-live-url/code/Scorebing%20live%20url.user.js'
        },
        {
            urlPattern: /\/livestats.dcd.shared.geniussports.com\/.*/, //Fibalivestats football live url
            scriptUrl: 'https://greasyfork.org/scripts/469302-fibalivestats-football-live-url/code/Fibalivestats%20football%20live%20url.user.js'
        },
        {
            urlPattern: /baseballsoftball\.be|fibs\.it|stats\.knbsbstats\.nl|stats\.baseball\.cz|baseballsoftball\.at|stats\.baseboll-softboll\.se|finland\.wbsc\.org|stats\.britishbaseball\.org\.uk|wbsceurope\.org|wbsc\.org|wbscamericas.org/, // Basebally ofika generování odkazů
            scriptUrl: 'https://greasyfork.org/scripts/469626-baseball-ofika/code/Baseball%20-%20ofika.user.js'
        },
        {
            urlPattern: /tulospalvelu.leijonat.fi\//, //Hokej - Finsko
            scriptUrl: 'https://greasyfork.org/scripts/458731-hokej-finsko/code/Hokej%20-%20Finsko.user.js'
        },
        {
            urlPattern: /1xstavka\.ru\/LiveFeed\/GetGameZip\?id=*|sunshinetour\.info\/api\/sst\/cache\/sst\/*|api\.asia\.ocs\-software\.com\/apga\/cache\/apga\/*/, // Chrome v117 update - zprovoznění programátorské tabulky
            scriptUrl: 'https://greasyfork.org/scripts/475273-chrome-v117-update/code/Chrome%20v117%20update.user.js'
        },
        {
            urlPattern: /www.eishockey.at\/gamecenter\/*/, //Eishockey.at
            scriptUrl: 'https://greasyfork.org/scripts/475430-eishockey-at/code/Eishockeyat.user.js'
        },
         {
            urlPattern: /fip.it\/risultati*/, //Itálie Basketbal Serie A2
            scriptUrl: 'https://greasyfork.org/scripts/477425-it%C3%A1lie-basketbal-serie-a2/code/It%C3%A1lie%20Basketbal%20Serie%20A2.user.js'
        },
        {
            urlPattern: /penny-del.org\/spiele/, //Penny DEL
            scriptUrl: 'https://greasyfork.org/scripts/477518-penny-del/code/Penny%20DEL.user.js'
        },
        {
            urlPattern: /handball.no\/system\/kamper\/kamp\/\?matchid=*/, // Házená Norsko - přesměrování
            scriptUrl: 'https://greasyfork.org/scripts/477692-h%C3%A1zen%C3%A1-norsko-p%C5%99esm%C4%9Brov%C3%A1n%C3%AD/code/H%C3%A1zen%C3%A1%20Norsko%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js'
        },
        {
            urlPattern: /alps.hockey\/en\/home-en\/season\/games/, // Hokej ofiko alps.hockey
            scriptUrl: 'https://greasyfork.org/scripts/477693-hokej-ofiko-alps-hockey/code/Hokej%20ofiko%20alpshockey.user.js'
        },
        {
            urlPattern: /zerozero.pt\/match.php*/, // Futsal Portugalsko Zero
            scriptUrl: 'https://greasyfork.org/scripts/477694-futsal-portugalsko-zero/code/Futsal%20Portugalsko%20Zero.user.js'
        },
        {
            urlPattern: /www.euroleaguebasketball.net\/*/, // Basket Přesměrování Euroliga
            scriptUrl: 'https://greasyfork.org/scripts/477696-evropsk%C3%A9-poh%C3%A1ry/code/Evropsk%C3%A9%20poh%C3%A1ry.user.js'
        },
        {
            urlPattern: /tulospalvelu.fliiga.com\/*|tulospalvelu.salibandy.fi\/*/, // Florbal Finsko přesměrování
            scriptUrl: 'https://greasyfork.org/scripts/477697-florbal-finsko-p%C5%99esm%C4%9Brov%C3%A1n%C3%AD/code/Florbal%20Finsko%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js'
        },
        {
            urlPattern: /en.volleyballworld.com\/beachvolleyball\/competitions\//, // Beach volejbal
            scriptUrl: 'https://greasyfork.org/scripts/478164-beach-volejbal/code/Beach%20volejbal.user.js'
        },
        {
            urlPattern: /finnhandball.torneopal.fi\/taso\/ottelu.php/, // Finsko - Házená
            scriptUrl: 'https://greasyfork.org/scripts/478165-finsko-h%C3%A1zen%C3%A1/code/Finsko%20-%20H%C3%A1zen%C3%A1.user.js'
        },
        {
            urlPattern: /live.leisu.com\/lanqiu\/shujufenxi\-/, // Čína Basketbal - Přesměrování do live url
            scriptUrl: 'https://greasyfork.org/scripts/478166-%C4%8D%C3%ADna-basketbal-p%C5%99esm%C4%9Brov%C3%A1n%C3%AD-do-live-url/code/%C4%8C%C3%ADna%20Basketbal%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20do%20live%20url.user.js'
        },
        {
            urlPattern: /en.volleyballworld.com\/.+\/competitions\/.+$/, // Volleyballworld Ofiko - (beach and voll) live url
            scriptUrl: 'https://greasyfork.org/scripts/470818-volleyballworld-ofiko-beach-and-voll/code/Volleyballworld%20Ofiko%20-%20(beach%20and%20voll).user.js'
        },
        {
            urlPattern: /fibalivestats.dcd.shared.geniussports.com\/u\/.*/, // Fibalivestats - Odstranění nul
            scriptUrl: 'https://greasyfork.org/scripts/478167-fibalivestats-odstran%C4%9Bn%C3%AD-nul/code/Fibalivestats%20-%20Odstran%C4%9Bn%C3%AD%20nul.user.js'
        },
        {
            urlPattern: /vision-sport.fr\/lives\/live/, // Francie - Házená
            scriptUrl: 'https://greasyfork.org/scripts/478327-francie-h%C3%A1zen%C3%A1/code/Francie%20-%20H%C3%A1zen%C3%A1.user.js'
        },
        {
            urlPattern: /legavolleyfemminile.it\/calendario\/.*/, // Itálie - Volejbal
            scriptUrl: 'https://greasyfork.org/scripts/478790-it%C3%A1lie-volejbal/code/It%C3%A1lie%20-%20Volejbal.user.js'
        },
        {
            urlPattern: /hunbasket.hu\/bajnoksag-musor\/x[0-9]+\//, // Maďarsko - Basketbal
            scriptUrl: 'https://greasyfork.org/scripts/478951-ma%C4%8Farsko-basketbal/code/Ma%C4%8Farsko%20-%20Basketbal.user.js'
        },
        {
            urlPattern: /nbf\.kz\/en\/match\/\?id\=/, // Kazachstán Basketbal
            scriptUrl: 'https://greasyfork.org/scripts/479237-kazachst%C3%A1n-basketbal/code/Kazachst%C3%A1n%20Basketbal.user.js'
        },
        {
            urlPattern: /aba-liga.com\/calendar\/.*/, // Aba
            scriptUrl: 'https://update.greasyfork.org/scripts/480379/Aba%202.user.js'
        },
        {
            urlPattern: /hockey.no\/live\/Live\/Match\/|hockey.no\/live\/BoxScore\/Boxscore\//, // Norsko - hokej
            scriptUrl: 'https://update.greasyfork.org/scripts/480389/Norsko%20-%20hokej.user.js'
        },
        {
            urlPattern: /rusbandy.ru\/game\/.*/, // Rusko Bandy
            scriptUrl: 'https://update.greasyfork.org/scripts/480680/Rusko%20Bandy.user.js'
        },
        {
            urlPattern: /resultater.volleyball.dk\/tms\/Turneringer-og-resultater\/Kamp-Information.aspx.*/, // Dánsko volejbal
            scriptUrl: 'https://update.greasyfork.org/scripts/480684/D%C3%A1nsko%20volejbal.user.js'
        },
        {
            urlPattern: /southern-football-league.co.uk/, // Southern Leagues
            scriptUrl: 'https://update.greasyfork.org/scripts/481628/Southern%20Leagues.user.js'
        },
        {
            urlPattern: /championshockeyleague.com\/en\/matches\/*/, // Champions Hockey League
            scriptUrl: 'https://update.greasyfork.org/scripts/482219/Champions%20Hockey%20League.user.js'
        },
        {
            urlPattern: /foxsports.com\/nhl\/.*\-game-boxscore\-/, // Fox Sports
            scriptUrl: 'https://update.greasyfork.org/scripts/482306/Fox%20Sports.user.js'
        },
        {
            urlPattern: /www\.iihf\.com\/en\/events\/[0-9]+\/\S+\/schedule/, // Tlačítko IIHF
            scriptUrl: 'https://update.greasyfork.org/scripts/483323/Tla%C4%8D%C3%ADtko%20IIHF.user.js'
        },
        {
            urlPattern: /atptour.com\/en\/scores\/*/, // ATP Tour
            scriptUrl: 'https://update.greasyfork.org/scripts/458859/Tenis%20-%20Script%20for%20atptourcom.user.js'
        },
        {
            urlPattern: /www\.football\.com\/*/, // Tlačítko football.com
            scriptUrl: 'https://update.greasyfork.org/scripts/482195/Luk%C3%A1%C5%A1%20s%C3%A1zkovka%202.user.js'
        },
        {
            urlPattern: /^https?:\/\/m\.synottip\.cz\//, // Přesměruje URL pro Synottip
            scriptUrl: 'https://update.greasyfork.org/scripts/483697/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20URL%20na%20Synottip.user.js'
        },
        // Odtud zkontrolovat další skripty
        {
            urlPattern: /m.sihf.ch\/de\/.*/, // Tresty - m.sihf.ch
            scriptUrl: 'https://update.greasyfork.org/scripts/483863/Tresty%20-%20msihfch.user.js'
        },
        {
            urlPattern: /liiga.fi\/en\/game\/.*/, // Hokej Liiga - GK Subs
            scriptUrl: 'https://update.greasyfork.org/scripts/484041/Hokej%20Liiga%20-%20GK%20Subs.user.js'
        },
    ];

    // Funkce pro načtení skriptu a jeho vykonání
    function loadScript(scriptUrl) {
        GM_xmlhttpRequest({
            method: "GET",
            url: scriptUrl,
            onload: function(response) {
                var code = response.responseText;
                var script = document.createElement('script');
                script.textContent = code;
                document.documentElement.appendChild(script);
            }
        });
    }

    // Procházení podmínek a volání skriptu na základě shody s URL vzorem
    for (var i = 0; i < scriptConditions.length; i++) {
        var condition = scriptConditions[i];
        if (condition.urlPattern.test(currentUrl)) {
            loadScript(condition.scriptUrl);
            break;
        }
    }
})();