// ==UserScript==
// @name         Kvido Multiscript
// @namespace    http://tampermonkey.net/
// @version      6.40
// @description  Skript všech skriptů
// @author       KvidoTeam
// @icon         https://i.pinimg.com/originals/0c/1e/07/0c1e07d8c596e69d24cd414c2ec6b1d9.png
// @license      MIT
// @include      *
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/467980/Kvido%20Multiscript.user.js
// @updateURL https://update.greasyfork.org/scripts/467980/Kvido%20Multiscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = window.location.href;
    let responseStore = {};

    let scriptConditions = [
        {
            urlPattern: /www.uefa.com\/.*\/match\/.*/, // UEFA Soupiska
            scriptUrl: 'https://update.greasyfork.org/scripts/480471/UEFA%20Soupiska.user.js',
            requirements: []
        },
        {
            urlPattern: /.*dataproject.com\/CompetitionMatches/i, //Volejbal - Dataproject - víkendová příprava
            scriptUrl: 'https://greasyfork.org/scripts/458725-volejbal-dataproject-v%C3%ADkendov%C3%A1-p%C5%99%C3%ADprava/code/Volejbal%20-%20Dataproject%20-%20v%C3%ADkendov%C3%A1%20p%C5%99%C3%ADprava.user.js',
            requirements: []
        },
        {
            urlPattern: /.*dataproject.com\/Livescore\.aspx/i, //Volejbal - Dataproject
            scriptUrl: 'https://greasyfork.org/scripts/458724-volejbal-dataproject/code/Volejbal%20-%20Dataproject.user.js',
            requirements: []
        },
        {
            urlPattern: /zapasy.ceskyhokej.cz\/admin\/schedule\/match\/detail\/*|hokejovyzapis.cz\/admin\/schedule\/match\/detail\/*/, //Hokejový zápis
            scriptUrl: 'https://greasyfork.org/scripts/458739-hokejov%C3%BD-z%C3%A1pis/code/Hokejov%C3%BD%20z%C3%A1pis.user.js',
            requirements: []
        },
        {
            urlPattern: /.*eurohandball.com.*matches\/.+/, //Házená - Eurohandball
            scriptUrl: 'https://greasyfork.org/scripts/458729-h%C3%A1zen%C3%A1-eurohandball/code/H%C3%A1zen%C3%A1%20-%20Eurohandball.user.js',
            requirements: []
        },
        {
            urlPattern: /ivibets\.org\/cz\/prematch\/.*/, //Esporty - ivibet
            scriptUrl: 'https://greasyfork.org/scripts/467633-esporty-ivibet/code/Esporty%20-%20ivibet.user.js',
            requirements: []
        },
        {
            urlPattern: /frhlive\d*\.com/, //Házená - Rumunsko ofiko
            scriptUrl: 'https://update.greasyfork.org/scripts/459394/H%C3%A1zen%C3%A1%20-%20Rumunsko%20ofiko.user.js',
            requirements: []
        },
        {
            urlPattern: /arkus\-liga\.rs\/vestilist\.php|sportinfocentar(?:2)?\.com\/livescore\/unistat\/indexhrs\.html|srl\.rs\/index\.php|macedoniahandball\.com\.mk\//, //Házená - Chorvatsko a Srbsko
            scriptUrl: 'https://update.greasyfork.org/scripts/458744/H%C3%A1zen%C3%A1%20-%20Chorvatsko%20a%20Srbsko.user.js',
            requirements: []
        },
        {
            urlPattern: /ceskyflorbal\.cz\/match\/detail\/default\//, //Florbal - ofiko ceskyflorbal.cz
            scriptUrl: 'https://greasyfork.org/scripts/458723-florbal-ofiko-ceskyflorbal-cz/code/Florbal%20-%20ofiko%20ceskyflorbalcz.user.js',
            requirements: []
        },
        {
            urlPattern: /mlssoccer.com\/schedule\/scores/, //Fotbal - MLS - stats
            scriptUrl: 'https://greasyfork.org/scripts/458844-fotbal-mls-stats/code/Fotbal%20-%20MLS%20-%20stats.user.js',
            requirements: []
        },
        {
            urlPattern: /ice\.hockey\/en\/schedule\-results\/schedule/, //Hokej - Rakousko
            scriptUrl: 'https://greasyfork.org/scripts/458856-hokej-rakousko/code/Hokej%20-%20Rakousko.user.js',
            requirements: []
        },
        {
            urlPattern: /rwp-league.com\/results\/index.php/, //Vodní pólo - Regionalna vaterpolo liga
            scriptUrl: 'https://greasyfork.org/scripts/458857-vodn%C3%AD-p%C3%B3lo-regionalna-vaterpolo-liga/code/Vodn%C3%AD%20p%C3%B3lo%20-%20Regionalna%20vaterpolo%20liga.user.js',
            requirements: []
        },
        {
            urlPattern: /app.floorball.sport\/\S+/, //Floorball.sport
            scriptUrl: 'https://greasyfork.org/scripts/468629-floorball-sport/code/Floorballsport.user.js',
            requirements: []
        },
        {
            urlPattern: /onlajny.com\/league\/index\/id\/16/, //Hokej - ČR extraliga statistiky
            scriptUrl: 'https://greasyfork.org/scripts/458738-hokej-%C4%8Dr-extraliga-statistiky/code/Hokej%20-%20%C4%8CR%20extraliga%20statistiky.user.js',
            requirements: []
        },
        {
            urlPattern: /tophaandbold.dk\/kampprogram\/.*/, //Házená - Dánsko ofiko
            scriptUrl: 'https://greasyfork.org/scripts/458832-h%C3%A1zen%C3%A1-d%C3%A1nsko-ofiko/code/H%C3%A1zen%C3%A1%20-%20D%C3%A1nsko%20ofiko.user.js',
            requirements: []
        },
        {
            urlPattern: /bundesliga.com\/en\/2?bundesliga\/matchday/, //Fotbal - Bundesliga stats
            scriptUrl: 'https://update.greasyfork.org/scripts/459196/Fotbal%20-%20Bundesliga%20stats.user.js',
            requirements: []
        },
        {
            urlPattern: /beinsports.com\/france\/turquie-super-lig\/calendrier/, //Fotbal - Turecko ofiko stats
            scriptUrl: 'https://greasyfork.org/scripts/459197-fotbal-turecko-ofiko-stats/code/Fotbal%20-%20Turecko%20ofiko%20stats.user.js',
            requirements: []
        },
        {
            urlPattern: /federalhockey.com\/stats/, //Hokej - USA FPHL
            scriptUrl: 'https://greasyfork.org/scripts/458736-hokej-usa-fphl/code/Hokej%20-%20USA%20FPHL.user.js',
            requirements: []
        },
        {
            urlPattern: /marathonbet.com|es\/en\/live\//, //Marathonbet Live Statistics
            scriptUrl: 'https://greasyfork.org/scripts/468742-marathonbet-live-statistics/code/Marathonbet%20Live%20Statistics.user.js',
            requirements: []
        },
        {
            urlPattern: /mlb.com\/gameday\/.+/, //MLB Stats
            scriptUrl: 'https://greasyfork.org/scripts/468743-mlb-stats/code/MLB%20Stats.user.js',
            requirements: []
        },
        {
            urlPattern: /widgets.besoccerapps.com\/scripts\/widgets\?type\=matchs\&competition.*/, //Fotbal - Španělsko
            scriptUrl: 'https://update.greasyfork.org/scripts/483857/Fotbal%20-%20%C5%A0pan%C4%9Blsko.user.js',
            requirements: []
        },
        {
            urlPattern: /glomdalen.no\/fotball\/live\//, //Glomdalen
            scriptUrl: 'https://greasyfork.org/scripts/468866-glomdalen/code/Glomdalen.user.js',
            requirements: []
        },
        {
            urlPattern: /tulospalvelu\.palloliitto\.fi\/match\/[0-9]+/, //Fotbal - Finsko ofiko
            scriptUrl: 'https://greasyfork.org/scripts/466928-fotbal-finsko-ofiko/code/Fotbal%20-%20Finsko%20ofiko.user.js',
            requirements: []
        },
        {
            urlPattern: /scorebing\.com\/match\/.+/, //Scorebing live url
            scriptUrl: 'https://greasyfork.org/scripts/469241-scorebing-live-url/code/Scorebing%20live%20url.user.js',
            requirements: []
        },
        {
            urlPattern: /\/livestats.dcd.shared.geniussports.com\/.*/, //Fibalivestats football live url
            scriptUrl: 'https://greasyfork.org/scripts/469302-fibalivestats-football-live-url/code/Fibalivestats%20football%20live%20url.user.js',
            requirements: []
        },
        {
            urlPattern: /baseballsoftball\.be|fibs\.it|stats\.knbsbstats\.nl|stats\.baseball\.cz|baseballsoftball\.at|stats\.baseboll-softboll\.se|finland\.wbsc\.org|stats\.britishbaseball\.org\.uk|wbsceurope\.org|wbsc\.org|wbscamericas.org/, // Basebally ofika generování odkazů
            scriptUrl: 'https://greasyfork.org/scripts/469626-baseball-ofika/code/Baseball%20-%20ofika.user.js',
            requirements: []
        },
        {
            urlPattern: /tulospalvelu.leijonat.fi\//, //Hokej - Finsko
            scriptUrl: 'https://update.greasyfork.org/scripts/553968/Hokej%20-%20Finsko%20%28Tabulka%20z%C3%A1pas%C5%AF%29.user.js',
            requirements: []
        },
        {
            urlPattern: /www.eishockey.at\/gamecenter\/*/, //Eishockey.at
            scriptUrl: 'https://greasyfork.org/scripts/475430-eishockey-at/code/Eishockeyat.user.js',
            requirements: [],
            requirements: []
        },
        {
            urlPattern: /fip.it\/risultati*/, //Itálie Basketbal Serie A2
            scriptUrl: 'https://update.greasyfork.org/scripts/477425/It%C3%A1lie%20Basketbal%20Serie%20A2.user.js',
            requirements: []
        },
        {
            urlPattern: /penny-del.org\/spiele/, //Penny DEL
            scriptUrl: 'https://greasyfork.org/scripts/477518-penny-del/code/Penny%20DEL.user.js',
            requirements: []
        },
        {
            urlPattern: /handball.no\/system\/kamper\/kamp\/\?matchid=*/, // Házená Norsko - přesměrování
            scriptUrl: 'https://greasyfork.org/scripts/477692-h%C3%A1zen%C3%A1-norsko-p%C5%99esm%C4%9Brov%C3%A1n%C3%AD/code/H%C3%A1zen%C3%A1%20Norsko%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js',
            requirements: []
        },
        {
            urlPattern: /alps.hockey\/en\/home-en\/season\/games/, // Hokej ofiko alps.hockey
            scriptUrl: 'https://greasyfork.org/scripts/477693-hokej-ofiko-alps-hockey/code/Hokej%20ofiko%20alpshockey.user.js',
            requirements: []
        },
        {
            urlPattern: /zerozero.pt\/match.php*/, // Futsal Portugalsko Zero
            scriptUrl: 'https://greasyfork.org/scripts/477694-futsal-portugalsko-zero/code/Futsal%20Portugalsko%20Zero.user.js',
            requirements: []
        },
        {
            urlPattern: /www\.euroleaguebasketball\.net\/(en\/)?(.+\/)?game-center/, // Basket Přesměrování Euroliga
            scriptUrl: 'https://update.greasyfork.org/scripts/488519/Evropsk%C3%A9%20poh%C3%A1ry%20-%20Vylep%C5%A1en%C3%A1%20verze.user.js',
            requirements: []
        },
        {
            urlPattern: /tulospalvelu.fliiga.com\/*|tulospalvelu.salibandy.fi\/*/, // Florbal Finsko přesměrování
            scriptUrl: 'https://greasyfork.org/scripts/477697-florbal-finsko-p%C5%99esm%C4%9Brov%C3%A1n%C3%AD/code/Florbal%20Finsko%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js',
            requirements: []
        },
        {
            urlPattern: /en.volleyballworld.com\/beachvolleyball\/competitions\//, // Beach volejbal
            scriptUrl: 'https://greasyfork.org/scripts/478164-beach-volejbal/code/Beach%20volejbal.user.js',
            requirements: []
        },
        {
            urlPattern: /finnhandball.torneopal.fi\/taso\/ottelu.php/, // Finsko - Házená
            scriptUrl: 'https://greasyfork.org/scripts/478165-finsko-h%C3%A1zen%C3%A1/code/Finsko%20-%20H%C3%A1zen%C3%A1.user.js',
            requirements: []
        },
        {
            urlPattern: /live.leisu.com\/lanqiu\/shujufenxi\-/, // Čína Basketbal - Přesměrování do live url
            scriptUrl: 'https://greasyfork.org/scripts/478166-%C4%8D%C3%ADna-basketbal-p%C5%99esm%C4%9Brov%C3%A1n%C3%AD-do-live-url/code/%C4%8C%C3%ADna%20Basketbal%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20do%20live%20url.user.js',
            requirements: []
        },
        {
            urlPattern: /en.volleyballworld.com\/.+\/competitions\/.+$/, // Volleyballworld Ofiko - (beach and voll) live url
            scriptUrl: 'https://greasyfork.org/scripts/470818-volleyballworld-ofiko-beach-and-voll/code/Volleyballworld%20Ofiko%20-%20(beach%20and%20voll).user.js',
            requirements: []
        },
        {
            urlPattern: /fibalivestats.dcd.shared.geniussports.com\/u\/.*/, // Fibalivestats - Odstranění nul
            scriptUrl: 'https://greasyfork.org/scripts/478167-fibalivestats-odstran%C4%9Bn%C3%AD-nul/code/Fibalivestats%20-%20Odstran%C4%9Bn%C3%AD%20nul.user.js',
            requirements: []
        },
        {
            urlPattern: /vision-sport.fr\/lives\/live/, // Francie - Házená
            scriptUrl: 'https://greasyfork.org/scripts/478327-francie-h%C3%A1zen%C3%A1/code/Francie%20-%20H%C3%A1zen%C3%A1.user.js',
            requirements: []
        },
        {
            urlPattern: /legavolleyfemminile\.it\/calendario.*/, // Itálie - Volejbal
            scriptUrl: 'https://greasyfork.org/scripts/478790-it%C3%A1lie-volejbal/code/It%C3%A1lie%20-%20Volejbal.user.js',
            requirements: []
        },
        {
            urlPattern: /mkosz.hu\/bajnoksag-musor\/x[0-9]+\//, // Maďarsko - Basketbal
            scriptUrl: 'https://greasyfork.org/scripts/478951-ma%C4%8Farsko-basketbal/code/Ma%C4%8Farsko%20-%20Basketbal.user.js',
            requirements: []
        },
        {
            urlPattern: /nbf\.kz\/en\/match\/\?id\=/, // Kazachstán Basketbal
            scriptUrl: 'https://update.greasyfork.org/scripts/562113/Kazachst%C3%A1n%20Basketbal.user.js',
            requirements: []
        },
        {
            urlPattern: /https:\/\/(www\.aba-liga\.com|druga\.aba-liga\.com)\/(calendar|match\/\d+\/\d+\/\d+\/Teamcomp\/q1\/1\/home\/.+?-.+)/, // Aba
            scriptUrl: 'https://update.greasyfork.org/scripts/480379/ABA%20Liga%20-%20Drugaaba-liga.user.js',
            requirements: []
        },
        {
            urlPattern: /hockey.no\/live\/Live\/Match\/|hockey.no\/live\/BoxScore\/Boxscore\//, // Norsko - hokej
            scriptUrl: 'https://update.greasyfork.org/scripts/480389/Norsko%20-%20hokej.user.js',
            requirements: []
        },
        {
            urlPattern: /rusbandy.ru\/game\/.*/, // Rusko Bandy
            scriptUrl: 'https://update.greasyfork.org/scripts/480680/Rusko%20Bandy.user.js',
            requirements: []
        },
        {
            urlPattern: /resultater.volleyball.dk\/tms\/Turneringer-og-resultater\/Kamp-Information.aspx.*/, // Dánsko volejbal
            scriptUrl: 'https://update.greasyfork.org/scripts/480684/D%C3%A1nsko%20volejbal.user.js',
            requirements: []
        },
        {
            urlPattern: /southern-football-league.co.uk/, // Southern Leagues
            scriptUrl: 'https://update.greasyfork.org/scripts/481628/Southern%20Leagues.user.js',
            requirements: []
        },
        {
            urlPattern: /www\.chl\.hockey\/en\/matches\/*/, // Champions Hockey League
            scriptUrl: 'https://update.greasyfork.org/scripts/557934/Champions%20Hockey%20League.user.js',
            requirements: []
        },
        {
            urlPattern: /foxsports.com\/nhl\/.*\-game-boxscore\-/, // Fox Sports
            scriptUrl: 'https://update.greasyfork.org/scripts/482306/Fox%20Sports.user.js',
            requirements: []
        },
        {
            urlPattern: /www\.iihf\.com\/en\/events\/[0-9]+\/\S+\/schedule/, // Tlačítko IIHF
            scriptUrl: 'https://update.greasyfork.org/scripts/483323/Tla%C4%8D%C3%ADtko%20IIHF.user.js',
            requirements: []
        },
        {
            urlPattern: /hockeyslovakia\.sk\/sk\/stats\/results-date\/\d+\/tipos-extraliga/, // Slovensko hokej
            scriptUrl: 'https://update.greasyfork.org/scripts/509164/HockeySlovakia.user.js',
            requirements: []
        },
        {
            urlPattern: /^https?:\/\/m\.synottip\.cz\//, // Přesměruje URL pro Synottip
            scriptUrl: 'https://update.greasyfork.org/scripts/483697/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20URL%20na%20Synottip.user.js',
            requirements: []
        },
        {
            urlPattern: /m.sihf.ch\/de\/.*/, // Tresty - m.sihf.ch
            scriptUrl: 'https://update.greasyfork.org/scripts/483863/Tresty%20-%20msihfch.user.js',
            requirements: []
        },
        {
            urlPattern: /liiga.fi\/en/, // Hokej Liiga - GK Subs + tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/487309/Hokej%20Liiga%20-%20GK%20Subs%20%20URL%20%C3%BAprava.user.js',
            requirements: []
        },
        {
            urlPattern: /prod-scores-api.ausopen.com\/match-centre\/.*/, // Australian Open
            scriptUrl: 'https://update.greasyfork.org/scripts/484156/Australian%20Open.user.js',
            requirements: []
        },
        {
            urlPattern: /sport\.synottip\.cz\/*/, // Synottip tlačítko pro klasickou verzi
            scriptUrl: 'https://update.greasyfork.org/scripts/484538/Synottip%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20na%20live%20z%C3%A1pas%20-%20Fin%C3%A1ln%C3%AD%20verze.user.js',
            requirements: []
        },
        {
            urlPattern: /lmt.fn.sportradar.com\/demolmt\/en\/Etc:UTC\/gismo\/match_timeline\/.*/, // SR Tresty
            scriptUrl: 'https://update.greasyfork.org/scripts/484684/SR%20Tresty.user.js',
            requirements: []
        },
        {
            urlPattern: /dc\.livesport\.eu\/kvido\/parser\/multi-admin$/, // Odstranění simulace a series + WTA/ATP API Změna
            scriptUrl: 'https://update.greasyfork.org/scripts/539273/Odstran%C4%9Bn%C3%AD%20simulace%20a%20series%20%2B%20WTAATP%20API%20Zm%C4%9Bna.user.js',
            requirements: []
        },
        {
            urlPattern: /hockey.no\/live\/Live\/Gamesheet\//, // Norsko Hokej Penalties
            scriptUrl: 'https://update.greasyfork.org/scripts/486126/Hokej%20Penalties%20-%20Fin%C3%A1le.user.js',
            requirements: []
        },
        {
            urlPattern: /1xmobi\.com\/.*/, // Přesměrování 1xbet
            scriptUrl: 'https://update.greasyfork.org/scripts/487813/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%201xmobicom.user.js',
            requirements: []
        },
        {
            urlPattern: /waterpolo.hu\/adatbank\/meccs\/.*/, // Přesměrování Maďarsko-WaterPolo
            scriptUrl: 'https://update.greasyfork.org/scripts/488009/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20Ma%C4%8Farsko-WaterPolo.user.js',
            requirements: []
        },
        {
            urlPattern: /widgets\.fn\.sportradar\.com\/.*/, // Tabulka ve zdrojovém kódu pro Sportradar
            scriptUrl: 'https://update.greasyfork.org/scripts/488672/Widget%20-%20Sportradar.user.js',
            requirements: []
        },
        {
            urlPattern: /easl.basketball\/schedule\/*/, // Tabulka pro basketbal EASL
            scriptUrl: 'https://update.greasyfork.org/scripts/488509/EASL%20basket.user.js',
            requirements: []
        },
        {
            urlPattern: /widgets\.sir\.sportradar\.com\/live-match-tracker\/*/, // Tvoří tabulku na Sportradaru pro přidávání Skóre a statusu
            scriptUrl: 'https://update.greasyfork.org/scripts/489572/Sportradar%20-%20Tabulka.user.js',
            requirements: []
        },
        {
            urlPattern: /gleague.nba\.com\/game\/*/, // NBA G league tabulka
            scriptUrl: 'https://update.greasyfork.org/scripts/491486/gleague.user.js',
            requirements: []
        },
        {
            urlPattern: /lbl.basket\.lv\/*/, // Lotyšsko basketbal
            scriptUrl: 'https://update.greasyfork.org/scripts/491960/LBL%20basket.user.js',
            requirements: []
        },
        {
            urlPattern: /ihf.info\/competitions\/*/, // Házená IHF tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/540092/Tla%C4%8D%C3%ADtko%20IHF.user.js',
            requirements: []
        },
        {
            urlPattern: /enetscores.com/, // Enetscores
            scriptUrl: 'https://update.greasyfork.org/scripts/498150/Enetscores.user.js',
            requirements: []
        },
        {
            urlPattern: /www.wimbledon.com\/*/, // Wimbledon ID
            scriptUrl: 'https://update.greasyfork.org/scripts/498853/Wimbledon%20Custom%20Highlighter.user.js',
            requirements: []
        },
        {
            urlPattern: /www.fiba.basketball\/en\/event\/*/, // Fiba.basketball Boxscore
            scriptUrl: 'https://update.greasyfork.org/scripts/499498/FIBA%20Boxscore.user.js',
            requirements: []
        },
        {
            urlPattern: /courtside1891.basketball\/games/, // Courtside Tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/500275/Courtside.user.js',
            requirements: []
        },
        {
            urlPattern: /www.mackolik.com\/.*canli-sonuclar/, // Tlačítko Mackolik
            scriptUrl: 'https://update.greasyfork.org/scripts/503412/Mackolik%20P%C5%99egenerov%C3%A1n%C3%AD%20Z%C3%A1pas%C5%AF.user.js',
            requirements: []
        },
        {
            urlPattern: /www.usopen.org\/*/, // US Open tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/504359/US%20Open%20-%20tla%C4%8D%C3%ADtko.user.js',
            requirements: []
        },
        {
            urlPattern: /tenipo\.com\/.*/, // Tlačítko Tenipo
            scriptUrl: 'https://update.greasyfork.org/scripts/507143/Tenipo%20Match%20Detail%20Button%20-%20Optimized.user.js',
            requirements: []
        },
        {
            urlPattern: /russiabasket\.ru\/(competitions\/.*\/(premer-liga|superliga|kubok-rossii)\/schedule|competitions\/.*|games\/\d+.*)|belarus\.russiabasket\.ru\/competitions|vtb-league\.com\/en\/rbwidget\/schedule\/\?compId=.*/, // Ruské a Běloruské basketbaly
            scriptUrl: 'https://update.greasyfork.org/scripts/491644/Rusko%20a%20B%C4%9Blorusko%20-%20Basketbal%20-%20Fin%C3%A1ln%C3%AD.user.js',
            requirements: []
        },
        {
            urlPattern: /lnpscoreboard.webpont.com\//, // LNP Italy Basket Serie A2
            scriptUrl: 'https://update.greasyfork.org/scripts/511343/LNP%20Italy%20Basket%20Serie%20A2.user.js',
            requirements: []
        },
        {
            urlPattern: /www.nhl\.com\/schedule\/*/, // NHL tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/512729/NHL%20Gamecenter%20tla%C4%8D%C3%ADtka.user.js',
            requirements: []
        },
        {
            urlPattern: /kamper.basket.no/, // Norsko basketbal přegenerování
            scriptUrl: 'https://update.greasyfork.org/scripts/513056/Norsko%20Basketbal2.user.js',
            requirements: []
        },
        {
            urlPattern: /www.cbaleague.com/, // Čína basketbal přesměrování
            scriptUrl: 'https://update.greasyfork.org/scripts/513400/CBA%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20do%20spr%C3%A1vn%C3%A9%20URL.user.js',
            requirements: []
        },
        {
            urlPattern: /www.sunshinetour.info/, // Sunsine tour odstranění pořadí hráčů
            scriptUrl: 'https://update.greasyfork.org/scripts/514797/Remove%20Specific%20TD%20Elements%20with%20Number%3D.user.js',
            requirements: []
        },
        {
            urlPattern: /https:\/\/www\.nhl\.com\/scores\/htmlreports\/.*\/GS.*\.HTM/, // NHL tresty
            scriptUrl: 'https://update.greasyfork.org/scripts/515211/NHL%20Tresty.user.js',
            requirements: []
        },
        {
            urlPattern: /www.365scores.com\/football\/match\/*/, // 365scores.com DynamicRedirect
            scriptUrl: 'https://update.greasyfork.org/scripts/520310/365scorescom%20DynamicRedirect.user.js',
            requirements: []
        },
        {
            urlPattern: /text.khl.ru\/text\//, // KHL tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/517019/KHL%20tla%C4%8D%C3%ADtko.user.js',
            requirements: [
                { type: 'xmlhttprequest', url: 'https://en.khl.ru/calendar/', method: 'GET' }
            ]
        },
        {
            urlPattern: /example\.com\/\?redirected\/NFL/, // NFL - přidávání dopředu
            scriptUrl: 'https://update.greasyfork.org/scripts/555532/NFL%20-%20odkazy.user.js',
            requirements: []
        },
        {
            urlPattern: /www.sportstiger.com/, // Tlačítko na přepsání u kabaddi
            scriptUrl: 'https://update.greasyfork.org/scripts/519839/P%C5%99eps%C3%A1n%C3%AD%20URL%20-%20Kabaddi.user.js',
            requirements: []
        },
        {
            urlPattern: /sihf.ch\/de\/game-center\/.*page/, // Švýcarský hokej - tabulka s odkazy
            scriptUrl: 'https://update.greasyfork.org/scripts/520518/%C5%A0v%C3%BDcarsk%C3%BD%20hokej%20-%20tabulka%20s%20odkazy.user.js',
            requirements: []
        },
        {
            urlPattern: /goaloo13.com\/.*[^live]/, // Goalloooo - přesměrování url
            scriptUrl: 'https://update.greasyfork.org/scripts/520893/Goalloooo%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20url.user.js',
            requirements: []
        },
        {
            urlPattern: /www.vbl-ticker.de/, // Německé volejbaly - tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/522289/VBL%20-%20N%C4%9Bmeck%C3%BD%20volejbal.user.js',
            requirements: []
        },
        {
            urlPattern: /www.svleague.jp\/ja\/match\/*/, // Přesměrování Japonsý volejbal
            scriptUrl: 'https://update.greasyfork.org/scripts/523139/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20Japonsko%20volejbal.user.js',
            requirements: []
        },
        {
            urlPattern: /text.khl.ru\/en\/*/, // KHL - GK HS
            scriptUrl: 'https://update.greasyfork.org/scripts/525042/KHL%20-%20GK%20HS.user.js',
            requirements: []
        },
        {
            urlPattern: /daikin-hbl.de\/de\/*/, // Německá házená - úprava live url
            scriptUrl: 'https://update.greasyfork.org/scripts/528257/N%C4%9Bmeck%C3%A1%20h%C3%A1zen%C3%A1.user.js',
            requirements: []
        },
        {
            urlPattern: /chl.ca\/[a-z]+\/(?:en\/)?gamecentre\/\d+/, // Minutáž CHL
            scriptUrl: 'https://update.greasyfork.org/scripts/528339/CHL%20-%20minut%C3%A1%C5%BE.user.js',
            requirements: []
        },
        {
            urlPattern: /cricheroes\.com\/(?!_next\/data\/).*/, // Cricheroes Redirect
            scriptUrl: 'https://update.greasyfork.org/scripts/530266/Cricheroes%20Redirect.user.js',
            requirements: []
        },
        {
            urlPattern: /cricheroes.com\/_next\/data\/.*/, // Cricheroes JSON Table
            scriptUrl: 'https://update.greasyfork.org/scripts/530267/Cricheroes%20JSON%20Table.user.js',
            requirements: []
        },
        {
            urlPattern: /finnhandball.torneopal.fi\/taso\/live.php/, // Finsko házená
            scriptUrl: 'https://update.greasyfork.org/scripts/528877/Finsko%20h%C3%A1zen%C3%A1.user.js',
            requirements: []
        },
        {
            urlPattern: /basketballaustria.at|lnbp.mx|easl.basketball/, // Rakousko+Mexiko basket změna href
            scriptUrl: 'https://update.greasyfork.org/scripts/551165/Fixture%20Link%20P%C5%99epis%20%28Austria%20%2B%20LNBP%20%2B%20EASL%29.user.js',
            requirements: []
        },
        {
            urlPattern: /espn.com\/nba\/schedule/, // ESPN odebrání řádku pro tvorbu multi
            scriptUrl: 'https://update.greasyfork.org/scripts/533743/ESPN%20-%20play%20off%20multi.user.js',
            requirements: []

        },
        {
            urlPattern: /scoresway.com\/.*\/soccer\/.*match\/.*/, // StatsPerform Live Url
            scriptUrl: 'https://update.greasyfork.org/scripts/536484/StatsPerform%20Live%20Url.user.js',
            requirements: []
        },
        {
            urlPattern: /dc.livesport.eu\/kvido\/parser\/participant\-admin/, // Participant parser admin - HS Autopair
            scriptUrl: 'https://update.greasyfork.org/scripts/537403/Participant%20parser%20admin%20-%20HS%20Autopair.user.js',
            requirements: []
        },
        {
            urlPattern: /(itp-atp-sls\.infosys-platforms\.com\/prod\/api\/stats-plus\/v1\/keystats\/year\/.*|www\.atptour\.com\/-\/Hawkeye\/MatchStats\/\d{4}\/\d+\/[a-z0-9]+)/i, // ATP ITP Tour Statistics + Hawkeye
            scriptUrl: 'https://update.greasyfork.org/scripts/538189/ATP%20ITP%20Tour%20Statistics.user.js',
            requirements: [{ type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js' }]
        },
        {
            urlPattern: /atptour.com\/en\/scores\//, // ATP Tour
            scriptUrl: 'https://update.greasyfork.org/scripts/538308/Tabulka%20s%20API%20infosys.user.js',
            requirements: []
        },
        {
            urlPattern: /statsapi.mlb.com/, // MLB - api tabulka
            scriptUrl: 'https://update.greasyfork.org/scripts/539235/MLB-N%C3%A1hradn%C3%AD%20p%C5%99id%C3%A1n%C3%AD%20z%20api.user.js',
            requirements: []
        },
        {
            urlPattern: /api.wtatennis.com/, // WTA - api tabulka s odkazy
            scriptUrl: 'https://update.greasyfork.org/scripts/539880/WTA%20API%20Matches%20Table.user.js',
            requirements: []
        },
        {
            urlPattern: /wnba.com\/./, // Tlačítko pro WNBA - Překlik do API
            scriptUrl: 'https://update.greasyfork.org/scripts/540636/Tla%C4%8D%C3%ADtko%20WNBA%20-%20API.user.js',
            requirements: []
        },
        {
            urlPattern: /worldtabletennis.com\/matches\?selectedTab\=SCHEDULED/, // WTT Fixtures
            scriptUrl: 'https://update.greasyfork.org/scripts/540925/WTT%20Fixtures.user.js',
            requirements: []
        },
        {
            urlPattern: /https:\/\/bwfworldtour\.bwfbadminton\.com\/tournament\/.*\/results\/.*/, // BWF Badminton - Tlačítka na proklik do API
            scriptUrl: 'https://update.greasyfork.org/scripts/542649/Badminton%20-%20API.user.js',
            requirements: []
        },
        {
            urlPattern: /esportsbet.io/, // esportsbet Live URL Button
            scriptUrl: 'https://update.greasyfork.org/scripts/546783/esportsbet%20%E2%80%93%20LIVE%20tla%C4%8D%C3%ADtko.user.js',
            requirements: []
        },
        {
            urlPattern: /(ice\.hockey\/en\/schedule\/schedule(\/.*)?|metalligaen\.dk(\/.*)?)/, // ICEHL + Metalligaen Tabulka s Live Urls
            scriptUrl: 'https://update.greasyfork.org/scripts/548198/S3%20Schedules%20%28ICEHL%20%2B%20Metal%20Ligaen%29.user.js',
            requirements: []
        },
        {
            urlPattern: /s3.eu-west-1.amazonaws.com/, // ICEHL JSON Tab
            scriptUrl: 'https://update.greasyfork.org/scripts/546940/ICEHL%20JSON.user.js',
            requirements: []
        },
        {
            urlPattern: /eurobeachvolley.cev.eu\/en\//, // CEV Live URL Button
            scriptUrl: 'https://update.greasyfork.org/scripts/544285/CEV%20Live%20URL%20Button%20%28Final%29.user.js',
            requirements: []
        },
        {
            urlPattern: /hbstatz.is/, // HBStatz
            scriptUrl: 'https://update.greasyfork.org/scripts/548773/HBStatz%20redirect.user.js',
            requirements: []
        },
        {
            urlPattern: /coolbet.betstream.betgenius.com/, // Coolbet - API tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/549232/BetGenius%3A%20jump%20to%20API.user.js',
            requirements: []
        },
        {
            urlPattern: /https:\/\/publicaties\.hockeyweerelt\.nl\/mc\/competitions\/.*\/matches\/upcoming.*/, // Nizozemsko Pozemák - Tabulka s odkazy do live url
            scriptUrl: 'https://update.greasyfork.org/scripts/549585/HockeyWeerelt%20Upcoming.user.js',
            requirements: []
        },
        {
            urlPattern: /https:\/\/snookerscores\.net\/tournament-manager\/[^/]+\/knockout\/?/, // QTour směr API
            scriptUrl: 'https://update.greasyfork.org/scripts/550342/SnookerScores%20-%20p%C5%99ep%C3%AD%C5%A1e%20href%20na%20API.user.js',
            requirements: []
        },
        {
            urlPattern: /www\.coolbet\.com\/en\/sports\/tennis(\/.*)?$/, // Coolbet BetGenius API
            scriptUrl: 'https://update.greasyfork.org/scripts/550667/Coolbet%20%E2%86%92%20API%20Urls.user.js',
            requirements: []
        },
        {
            urlPattern: /nbl.com.au/, // Australský asket, změna url
            scriptUrl: 'https://update.greasyfork.org/scripts/550688/NBL%20%E2%80%93%20p%C5%99epsat%20href%20na%20AtriumSports%20fixture_detail.user.js',
            requirements: []
        },
        {
            urlPattern: /https?:\/\/(www\.)?fonbet\.com\.cy\/(live|sports)(\/.*)?/, // Přesměrování apiunblocker
            scriptUrl: 'https://update.greasyfork.org/scripts/550758/Fonbet%20Redirector.user.js',
            requirements: []
        },
        {
            urlPattern: /resultadosbalonmano.isquad.es/, // Přidání odkazů na španělskou házenou
            scriptUrl: 'https://update.greasyfork.org/scripts/551172/%C5%A0pan%C4%9Blsk%C3%A1%20h%C3%A1zen%C3%A1%20Tabulka%20s%20LIVE%20URL%20%28verze%2012%29.user.js',
            requirements: []
        },
        {
            urlPattern: /lnb\.fr\/fr\/calendar.*/, // Přepis href pro proklik do eapi (Francie)
            scriptUrl: 'https://update.greasyfork.org/scripts/551471/LNB%20Calendar%20%E2%80%93%20P%C5%99epis%20href%20na%20API%20URL.user.js',
            requirements: []
        },
        {
            urlPattern: /www\.zerozero\.pt\/.*/, // zerozero přepis
            scriptUrl: 'https://update.greasyfork.org/scripts/551135/zerozero%3A%20jogo%20%E2%86%92%20live-ao-minuto.user.js',
            requirements: []
        },
        {
            urlPattern: /laliganacional.com.ar/, // vytvoření tlačítka argentinský basket žen
            scriptUrl: 'https://update.greasyfork.org/scripts/551917/LNB%20Partido%20%E2%86%92%20Live%20Button.user.js',
            requirements: []
        },
        {
            urlPattern: /sdp-prem-prod.premier-league-prod.pulselive.com/, // PremierLeagueAPI - tabulka zápasů
            scriptUrl: 'https://update.greasyfork.org/scripts/546794/PL%20Pulselive%20API%20%E2%86%92%20tabulka%20z%C3%A1pas%C5%AF.user.js',
            requirements: []
        },
        {
            urlPattern: /eapi\.web\.prod\.cloud\.atriumsports\.com\/v1\/embed\/\d+\/fixtures\?seasonId=[\w-]+$/
, // eapi tabulky s live url zápasů
            scriptUrl: 'https://update.greasyfork.org/scripts/551885/Atrium%20API%20%E2%86%92%20Tabulky%20s%20odkazy%20na%20z%C3%A1pasy%20%28v%C5%A1echny%20sout%C4%9B%C5%BEe%29.user.js',
            requirements: []
        },
        {
            urlPattern: /live\.acb\.com\/es\/partidos\/[^\/]+\/previa\/?$/, // ACB - Španělský basketbal - generování tlačítka
            scriptUrl: 'https://update.greasyfork.org/scripts/551762/ACB%20tla%C4%8D%C3%ADtko%20-%20%C5%A0pan%C4%9Blsk%C3%BD%20basketbal.user.js',
            requirements: []
        },
        {
            urlPattern: /www.fifa.com/, // Přidá tlačítko "LIVE URL INCIDENTY" pro otevření timeline API
            scriptUrl: 'https://update.greasyfork.org/scripts/554005/FIFA%20%E2%80%93%20Tla%C4%8D%C3%ADtko%20%22INCIDENTY%20LIVE%20URL%22.user.js',
            requirements: []
        },
        {
            urlPattern: /api.fifa.com/, // Na stránce timeline API vytvoří tabulku žlutých/červených karet, střídání + minutáže
            scriptUrl: 'https://update.greasyfork.org/scripts/553989/FIFA%20API%20%E2%80%93%20full%20set.user.js',
            requirements: []
        },
        {
            urlPattern: /https?:\/\/(www\.)?lewaterpolo\.com\/.+\/partido\/?/, // lewaterpolo - Španělský vodáci - přesměrování do API
            scriptUrl: 'https://update.greasyfork.org/scripts/552675/Lewaterpolo%20API%20redirect.user.js',
            requirements: []
        },
        {
            urlPattern: /https?:\/\/(www\.)?finbandy\.torneopal\.fi\/taso\/ottelu\.php(\?.*)?/, // finské bandy live url
            scriptUrl: 'https://update.greasyfork.org/scripts/554645/Finbandy%20URL%20.user.js',
            requirements: []
        },
        {
            urlPattern: /live.glomdalen.no/, // Vytvoření tlačítka pro přesměrování do glomdalen api
            scriptUrl: 'https://update.greasyfork.org/scripts/555744/Glomdalen%20%E2%86%92%20Tla%C4%8D%C3%ADtko%20s%20proklikem%20do%20API.user.js',
            requirements: []
        },
        {
            urlPattern: /live.hockey.no/, // Norský hokej tabulka pro efektivnější zápasů
            scriptUrl: 'https://update.greasyfork.org/scripts/557121/Livehockeyno%20%E2%80%93%20tabulka%20z%C3%A1pas%C5%AF.user.js',
            requirements: []
        },
        {
            urlPattern: /icehockey.ro/, // Rumunský hokej - tlačítko
            scriptUrl: 'https://update.greasyfork.org/scripts/557668/icehockeyro%20%E2%80%94%20Enable%20Game%20Center%20buttons.user.js',
            requirements: []
        },
        {
            urlPattern: /espn.com/, // ESPN - přesměrování pro stats NBA
            scriptUrl: 'https://update.greasyfork.org/scripts/557917/ESPN%20Matchup%20Redirect%20to%20API%20%28SPA-ready%29.user.js',
            requirements: []
        },
        {
            urlPattern: /v3api.nifs.no/, // Glomdalen api tabulka
            scriptUrl: 'https://update.greasyfork.org/scripts/555743/Glomdalen%20-%20api%20tabulka%20%28incidenty%20%2B%20status%29.user.js',
            requirements: []
        },
        {
            urlPattern: /1xbitx1.com\/*./, // přesměrování z https://1xbitx1.com/* do detailu
            scriptUrl: 'https://update.greasyfork.org/scripts/555112/1xBit%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js',
            requirements: []
        },
        {
            urlPattern: /cbssports.com/, // Přesměruje CBS Gametracker preview na live stránku
            scriptUrl: 'https://update.greasyfork.org/scripts/557945/CBS%20Sports%20Preview%20Redirect%20to%20Live.user.js',
            requirements: []
        },
        {
            urlPattern: /bandyforbundet\.no\/tournament\/(bandy|floorball)/, // Přesměrování pro Norské bandy a florbal
            scriptUrl: 'https://update.greasyfork.org/scripts/557930/Norsko%20-%20bandy%20a%20fLorbal.user.js',
            requirements: []
        },
        {
            urlPattern: /supersport\.com\/(cricket|rugby)\/fixtures/,// Tlačítka pro kriket a rugby
            scriptUrl: 'https://update.greasyfork.org/scripts/558407/Supersport%20Fixtures%20%E2%80%93%20API%20Button.user.js',
            requirements: []
         },
        {
            urlPattern: /.*fikstur\.tvf\.org\.tr\/MacTakvim\/.*/i, // Volejbal Turecko
            scriptUrl: 'https://update.greasyfork.org/scripts/558124/Turecko%20volejbal.user.js',
            requirements: []
        },
        {
            urlPattern: /www.wst.tv/, // Přidá tlačítko "API" pro otevření API live url
            scriptUrl: 'https://update.greasyfork.org/scripts/559352/WST%20Live%20URL%20Button.user.js',
            requirements: []
        },
        {
            urlPattern: /league20252026\.volleyballchina\.com\/schedule/, // Přidá tlačítko "API" pro otevření API live url
            scriptUrl: 'https://update.greasyfork.org/scripts/559365/Volleyball%20China%20%E2%80%93%20LIVE%20API%20tabulka%20s%20odkazy.user.js',
            requirements: []
        },
        {
            urlPattern: /premiershiprugby.com/, // Přesměruje hlavní stránku rugby do API
            scriptUrl: 'https://update.greasyfork.org/scripts/560634/Premiership%20Rugby%20redirect.user.js',
            requirements: []
        },
        {
            urlPattern: /bbc\.com\/sport\/cricket\/scores-fixtures/, // Přesměruje hlavní stránku rugby do API
            scriptUrl: 'https://update.greasyfork.org/scripts/562529/BBC%20Cricket%20API%20btn.user.js',
            requirements: []
        }
    ];

    function executeRequest(req, callback) {
        if (req.type === 'script') {
            // Načte externí skript a vloží ho do stránky
            const s = document.createElement('script');
            s.src = req.url;
            s.onload = callback;
            s.onerror = () => {
                console.error(`Chyba při načítání skriptu: ${req.url}`);
                if (callback) callback();
            };
            document.head.appendChild(s);
            return;
        }

        if (req.type === 'inlineScript') {
            // Stáhne obsah a vloží ho jako inline <script>
            GM_xmlhttpRequest({
                method: req.method || "GET",
                url: req.url,
                onload: function(response) {
                    const s = document.createElement('script');
                    s.textContent = response.responseText;
                    document.head.appendChild(s);
                    if (callback) callback();
                }
            });
            return;
        }

        if (req.type === 'xmlhttprequest') {
            // Stáhne obsah a uloží ho do responseStore
            GM_xmlhttpRequest({
                method: req.method || "GET",
                url: req.url,
                onload: function(response) {
                    responseStore[req.url] = response.responseText;
                    if (callback) callback();
                }
            });
            return;
        }

        console.warn(`Nepodporovaný typ požadavku: ${req.type}`);
        if (callback) callback();
    }

    function loadScript(scriptUrl) {
        let version = GM_info.script.version;

        const urlWithVersion = scriptUrl + (scriptUrl.includes('?') ? '&' : '?') + 'v=' + version;

        GM_xmlhttpRequest({
            method: "GET",
            url: urlWithVersion,
            onload: function(response) {
                const code = response.responseText;
                console.log("Response: " + response.finalUrl);
                console.log("Headers: " + response.responseHeaders);
                const script = document.createElement('script');
                script.textContent = `
                    (function() {
                        let responseStore = ${JSON.stringify(responseStore)};
                        ${code}
                    })();
                `;
                document.documentElement.appendChild(script);
            }
        });
    }

    function executeRequirements(requirements, onComplete) {
        if (requirements.length === 0) {
            onComplete();
            return;
        }

        let completed = 0;

        requirements.forEach(function(req) {
            executeRequest(req, function() {
                completed++;
                if (completed === requirements.length) {
                    onComplete();
                }
            });
        });
    }


    for (let i = 0; i < scriptConditions.length; i++) {
        let condition = scriptConditions[i];
        if (condition.urlPattern.test(currentUrl) && condition.scriptUrl) {
            executeRequirements(condition.requirements, function() {
                loadScript(condition.scriptUrl);
            });
            break;
        }
    }
})();