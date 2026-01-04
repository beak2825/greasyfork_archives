// ==UserScript==
// @name         BadgeZee
// @namespace    none
// @version      2019.02.06.2147
// @description  Custom badges for anyone you want that won't disturb others!
// @author       technical13
// @supportURL   https://Discord.me/TheShoeStore
// @include      *munzee.com/m/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372809/BadgeZee.user.js
// @updateURL https://update.greasyfork.org/scripts/372809/BadgeZee.meta.js
// ==/UserScript==
var isDebug = false;
var intVerbosity = 1;
const ver = '2019.02.06.2147';
const scriptName = 'BadgeZee v' + ver;
console.info( scriptName + ' loaded' );

function toBoolean( val ) {
    const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
    val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );
    return ( arrTrue.indexOf( val ) !== -1 ? true : false );
}

const intParamsStart = ( document.URL.indexOf( '?' ) + 1 );
const strParams = document.URL.substr( intParamsStart );
const arrParamSets = strParams.split( '&' );
var objParams = {};
arrParamSets.forEach( function( strParam ) {
    let arrParam = strParam.split( '=' );
    if ( arrParam[ 0 ] === 'debug' ) {
        isDebug = toBoolean( arrParam[ 1 ] );
    } else if ( arrParam[ 0 ] === 'verbosity' ) {
        intVerbosity = ( arrParam[ 1 ] ? ( parseInt( arrParam[ 1 ] ) < 0 ? 0 : ( parseInt( arrParam[ 1 ] ) > 9 ? 9 : parseInt( arrParam[ 1 ] ) ) ) : 9 );
    }
} );
if ( isDebug ) { console.log( 'Debug mode is on with verbosity level: %d', intVerbosity ); }

function createVC( imgURL ) {
    var domNewImg = document.createElement( 'img' );
    domNewImg.style = 'max-height: 30px; vertical-align: top;';
    domNewImg.setAttribute( 'data-toggle', 'tooltip' );
    domNewImg.src = imgURL;

    return domNewImg;
}

function createTitle( title ) {
    var domSpan = document.createElement( 'span' );
    domSpan.className = 'badge title-badge';
    domSpan.appendChild( document.createTextNode( title ) );

    return domSpan;
}

( function() {
    if ( document.getElementById( 'error' ) ) {
        console.warn( scriptName + ': page was not found: 404' );
    } else {
        const domPlayerInfo = document.getElementsByClassName( 'avatar' )[ 0 ];
        const strPlayerAvatar = domPlayerInfo.querySelector( 'img' ).attributes.src;
        const strPlayerName = domPlayerInfo.getElementsByClassName( 'avatar-username' )[ 0 ].innerText;
        const objParentHeading = document.getElementsByTagName( 'h2' );

        var domContainer = document.createElement( 'h2' );
        var domTitleSpan = document.createElement( 'span' );
        domTitleSpan.className = 'hidden-xs';
        domTitleSpan.id = 'badge-titles';
        const domTextNode = document.createTextNode( ' ' );
        var isDefaultAvatar = ( strPlayerAvatar.value === 'https://munzee.global.ssl.fastly.net/images/avatars/ua5069.png' ? true : false );

        const objSavedTitles = {
// You can add as many custom titles to the top of this list as you want!
// Just make sure to use format: // Note, you must escape an apostrophe's with a backslash
//            'CaseSensitiveUserName': [ 'Daddy\'s Girl' ],// Single title
//            'SomeOtherUserName': [ 'Big Brother', 'Mama\'s Boy' ],// Multiple titles for same person
            '1849': [ 'WallaBee Keeper' ],
            'greenie': [ 'Discord Bot' ],
            'MeLa': [ 'MunzStat Developer' ],
            'Mizak': [ 'ItemBrowser Developer', 'WallaBee Keeper' ],
            'rynee': [ 'MunzeeMapV2 Developer' ],
            'sohcah': [ 'CuppaZee Developer' ],
            'technical13': [ 'Discord Owner' ]
        };
        const arrDiscordians = [
          '-Hawk-', '1SheMarine', '2mctwins2', '3newsomes', 'acinna',
          'ahagmann', 'AL2NJ', 'AllHandsMT', 'AllyMouse', 'ambyr',
          'ANABELLE', 'appeltje32', 'aronk76', 'asusik666', 'Bandyrooster',
          'BarnyardDawg', 'bazfum', 'BigLion', 'bingbonglong', 'Bittfam18',
          'bitux', 'Blutengel', 'bossmanlee', 'BrianMoos', 'brilang',
          'Brookcus', 'BSLLM', 'Buckeyecacher111', 'Bungle', 'cachaholic',
          'CaliberCable', 'CambridgeHannons', 'camolady4280', 'cbf600', 'ChandaBelle',
          'Chefvedder', 'Clareppuccino', 'coachV', 'Coddiwomplers', 'CzPeet',
          'dap217', 'deeralemap', 'djeagle', 'dlovegrove', 'doggonefun',
          'dt07751', 'Duysterstein', 'egginthesky', 'einkilorind', 'EmeraldAngel',
          'Falamazar', 'FindDeezee', 'food', 'FrankBroughton', 'FRH',
          'FromOct09', 'Gamsci', 'Ganesia', 'GeodudeDK', 'geomsp',
          'Gomphus', 'granitente', 'GrassyPoet', 'greislige', 'GrimWolf',
          'gspleo', 'gwendy', 'halemeister', 'halizwein', 'HB31',
          'hksfarm', 'honeybadger72', 'HtV', 'humbird7', 'hunniees',
          'hwbas04', 'Irelandgirl58', 'iScreamBIue', 'J1Huisman', 'JABIE28',
          'JacquesC', 'janbso', 'Jeeper32', 'Jerzee', 'jjanus',
          'johanenpaula', 'julissajean', 'Kapum', 'Kcsilvia', 'KellyTubeYT',
          'Kelster3', 'kermit450', 'kimbest', 'klc1960', 'KobeJasper',
          'kodiak62', 'krissymonkey', 'kuzminchmelev', 'Kyrandia', 'ladyelliott',
          'ledaekim', 'leve2002', 'levesund', 'lifehacksss', 'Lightek',
          'loeschfamily', 'Lonos', 'LordGro', 'lostsole68', 'LukeMcC480',
          'Lumen', 'lwardlaw93', 'maddoggie12', 'madtux', 'mamaduck71',
          'mars00xj', 'MaryJaneKitty', 'MattHoward', 'mayoleintje88', 'mding4gold',
          'MeLa', 'Mickyz', 'Mizak', 'Mnbball', 'mortonfox',
          'munzeeprof', 'MYater', 'nativenuk', 'Netkaloz', 'NexusDivine',
          'Nicoless', 'Norbee97', 'Obi-Cal', 'Oldman66', 'Penfold49',
          'piesciuk', 'PLitewski', 'Poemelke', 'prmarks1391', 'QueenofDNile',
          'rabe85', 'RainyC', 'RebelGTP', 'RedCarRobbie', 'rosieree',
          'roughdraft', 'RTHawk', 'Rubik80', 'rynee', 'scifiguy',
          'secretagentbill', 'Section42', 'sevans', 'sevenfooter1', 'Shanley25',
          'shaynemarks', 'skindo', 'Smith2190', 'sohcah', 'solarwib',
          'sportygal7', 'stebu', 'StewStunner', 'strawsolid6', 'sunnydae',
          'SusanVette', 'SvejkKlobasa', 'sverlaan', 'Sydonkidd', 'szipeti',
          'TakeruDavis', 'tatch', 'teamsturms', 'technical13', 'The8re',
          'TheBear77', 'TheFoods', 'thegenie18', 'TheGreenWitchofMim1', 'TheMachman',
          'theThunderbirds', 'timoteo283', 'tonatiuhc302', 'treasurehunter11', 'Tristar105',
          'utilitymanjoe', 'Vaporizz', 'Vike91', 'wandelKuub', 'wanzong',
          'wemissmo', 'Westford1970', 'WHC', 'wheelybarrow', 'WinterCheetah',
          'WriteAndMane', 'xlud', 'xwusel', 'YMHgra', 'zsomborpeto'
        ];
        const objWinnersVC = {
            '2013': {
                'November': [
                    'jfigel'
                ],
                'December': [
                    'batmanandrobin'
                ]
            },
            '2014': {
                'January': [
                    'Calvertcachers'
                ],
                'February': [
                    'jfigel','codyhollowfarm','Alexarcara','CommToad','Munzeerailfan',
                    'Gamsci','mitchellrulez','MisplacedManatee','rustyfurnace','Jarom',
                    'iamfull','MeanderingMonkeys'
                ],
                'March': [
                    's2jwwill'
                ],
                'April': [
                    'jarcc'
                ],
                'May': [
                    'moggypaws','codyhollowfarm'
                ],
                'June': [
                    'LedaEkim'
                ],
                'July': [
                    'JOK'
                ],
                'August': [
                    'CanadIanZombie'
                ],
                'September': [
                    'Journey374','JOK'
                ],
                'October': [
                    'CommToad','BAJACLAN'
                ],
                'November': [
                    'JOK','Jt75'
                ],
                'December': [
                    'glaciergrizzly','MeanderingMonkeys'
                ]
            },
            '2015': {
                'January': [
                    'Jt75'
                ],
                'February': [
                    'rosemark'
                ],
                'March': [
                    'TheCuppFamily','Journey374','Gamsci','rustyfurnace','RubyRubyDues',
                    'CommToad','HtV','MeanderingMonkeys','BAJACLAN','LedaEkim',
                    'wvkiwi'
                ],
                'April': [
                    'rustyfurnace','jayterho','MeanderingMonkeys'
                ],
                'May': [
                    'wvkiwi','Nativetexan','Gamsci','Therealgigi'
                ],
                'June': [
                    'bobadams','dlovegrove','KlassicKelly','mabuseserben','tonbur','Poemelke','ahagmann','furkeszek','BAJACLAN','rufnredy','deeralemap','metarons','goldfish72','humbird7','hisaccityiowahere','kalemi'
                ],
                'July': [
                    'DalenBarb','emceeelwee','rbct109','crawil','rosemark','IanZ','luckytrition','efton','kj6soz','RUJA','ouroboros'
                ],
                'August': [
                    'hans415','Goldfish67','ButchL'
                ],
                'September': [
                    'c-bn-bn','winsomesmile','kahluakel','laczy76','MeanderingMonkeys','dt07751','szipeti','moram85'
                ],
                'October': [
                    'Gamsci','HtV','furbabies'
                ],
                'November': [
                    '5daughters','rosemark','Ehsup','Berry72','Borghuis','MoraM85'
                ],
                'December': [
                    'tygrici','HtV','wvkiwi','rosemark'
                ]
            },
            '2016': {
                'January': [
                    'rastephens','StealthRT','RubyRubyDues','berry72'
                ],
                'February': [
                    'dt07751','Haalitip','thepetersonfinders','Laczy76'
                ],
                'March': [
                    'HtV','deeralemap','thepetersonfinders','dekaper'
                ],
                'April': [
                    'MoraM85','Laczy76','hunniees','mobility','reej',
                    'Minerva123','rufnredy'
                ],
                'May': [
                    'sgphotos','aufbau','RubyRubyDues','denali0407','Bambusznad',
                    'ChickenRun','BoMS','KernKlan','Heinerup','Gamsci',
                    'CACHEEATER','wowieann','Sunboy'
                ],
                'June': [
                    'Marock','GeoCredibles','mobility','vanislelady','aufbau',
                    'feikjen','Theceoiksjes','Lonos','halemeister','ButchL',
                    'TheCuppFamily','BellaBrandalyn'
                ],
                'July': [
                    'nyisutter','monrose','Emceeelwee','Pronkrug','pilsleyguy',
                    'Terrys0918','goldfish72','ZAYD','Marock','reej',
                    'Staslovtsov'
                ],
                'August': [
                    'Terrys0918','Staslovtsov','Theceoiksjes','Sonny32712','Traycee',
                    'sidekicks','AnnaD','Leusink','Olivideae'
                ],
                'September': [
                    'markcase','Hypospray','Staslovtsov','Laczy76','Jafo43',
                    'hoekraam','Ffm','c-bn-bn','EagleDadandXenia','BAJACLAN',
                    'AZJEDI'
                ],
                'October': [
                    'ZAYD','fsafranek','gelada','mobility','maxmaggott',
                    'david03','daysleeperdot','OldSchoolSkater','Leeh','TXTravelers',
                    'taska1981','Goldfish67','2mctwins'
                ],
                'November': [
                    'Hikerdude','mossguts','76CJ7','Omatsegorova',
                    'Leusink','dt07751','Gamsci'
                ],
                'December': [
                    'monrose','kpr1000','Basketballlife','Kyndall32712','Candy32712',
                    'mossguts','terrys0918','Sonny32712','Chrislan','3newsomes',
                    '5Star','hoekraam','Gollygeos','levesund','Sprinkman',
                    'DO6CC','vanislelady','markcase','Pollywog','OddIntentions',
                    'Gamsci','gelada','76CJ7','EagleDadandXenia','draco85',
                    'Laczy76','FRLK','GeoCredibles','d-n','Attis',
                    'Bambusznad','MariaHTJ','Batmun','pilsleyguy',
                    'piupardo','Zniffer','Heinerup','HtV','bonsaai',
                    'ZAYD','nyisutter','aaalv','Traycee','TheDrollEclectic',
                    'Skree','Jafo43','nuttynan','AnnaD','johnsjen',
                    'fsafranek','wowieann','J1Huisman','NuttyRachy',
                    'Omatsegorova','Chivasloyal','Staslovtsov','JackSparrow','CzPeet',
                    'Hypospray','Florentinka','florish','pritzen','Nov64',
                    'Derbstesfrau','Derbste','fscheerhoorn','petertt','ChrisMJ',
                    'szipeti','szimari','rufnredy','RubyRubyDues','mobility',
                    'TheCuppFamily','Hikerdude','Calvertcachers','LilCrab','PrincessMeli',
                    'appeltje32','cvdchiller','coastingcollins','RudiTeam','nhblues',
                    'Pronkrug','Theceoiksjes','WandelKuub','PAKRee','Lukyshak',
                    'Minerva123','pepsiman','highmaintenance','halemeister','djsgriffus',
                    'hunniees','alfabootis','CrossedAnchors','berry72','AlephRita',
                    'OldSchoolSkater','dt07751','ChinaBulls','LFC21','Goldfish67',
                    'goldfish72','mayberryman','fionails','wvkiwi','targeteer2k',
                    'AZJEDI','Bigpoopyhead','oztex','TXTravelers','Elise',
                    'Marijn','Leusink','Surie','Nadett','rynee',
                    'becca911','tygrici','skleba','Marnic','BAJACLAN',
                    'DHitz','Sunboy','Lovelylissa'
                ]
            },
            '2017': {
                'January': [
                    'Trappertje','petertt','sverlaan','pepsiman','annabanana',
                    'Sunboy','Florentinka','highmaintenance','J1Huisman','fscheerhoorn',
                    'utilitymanjoe'
                ],
                'February': [
                    'sverlaan','Theceoiksjes','nyisutter','d-n','dt07751',
                    'fscheerhoorn','vanislelady','pritzen','AnnaD','cvdchiller',
                    'PAKRee','Brandikorte','TheDrollEclectic','florish'
                ],
                'March': [
                    'Arendsoog','molletje','Chivasloyal','arts5','oldmountaineer',
                    'alfabootis','molletje','AlephRita','Journey374','ZAYD',
                    'hunniees','GrizzSteve'
                ],
                'April': [
                    '', 'Aronk76'
                ],
                'May': [
                    ''
                ],
                'June': [
                    'Durango','Theceoiksjes','Human01d','5Star','SLP',
                    'Atzepeng84','Amireneemi','oldmountaineer','Laczy76','Journey374',
                    'Robfire','rabe85','bencus05','vanislelady','Dg25plus',
                    'HB31','paupau'
                ],
                'July': [
                    'gorilla','FRLK','RubyRubyDues','cuttingcrew','vafarley',
                    'Mnbball','fionails','Shewhofishes','greensfgiant','einkilorind',
                    'Pinkeltje','pulsarxp','dorsetknob','5Star','rabe85',
                    'djsgriffus','cachewhisperer','halizwein','Anitaz'
                ],
                'August': [
                    'Belladivadee','appeltje32','bordentaxi','StealthRT','lison55',
                    'mutti','AZJEDI','patrisk','ZAYD','Adam848',
                    'AlephRita','Atzepeng84','Bambusznad','Goldfish67','Phorsyte',
                    'oldmountaineer','Nickoes','Pinkeltje','nicmar'
                ],
                'September': [
                    ''
                ],
                'October': [
                    'Trappertje','Aaalv','FRLK','Koukyy','owlsurfer',
                    'Laczy76','Nov64','vanislelady','Boompa','Marnic',
                    'halemeister','SuperKoe','denali0407','patrisk','Batmun',
                    'halizwein','scifimom22','TheGSA','nicmar'
                ],
                'November': [
                    'highmaintenance','einkilorind','Nickoes','Hikerdude','SoccerGurl',
                    'Jafo43','AZBookworm','MeanderingMonkeys','all0123','irca',
                    'feikjen','EmileP68','Human01d','pepsiman','PAKRee',
                    'mars00xj','halizwein','Laczy76'
                ],
                'December': [
                    ''
                ]
            },
            '2018': {
                'January': [
                    '', 'technical13'
                ],
                'February': [
                    'Supervixen','rayannchick','Jafo43','Laczy76','feikjen',
                    'gumpel','d-n','sverlaan','Brandikorte','Nierenstein',
                    'tmabrey','felixbongers','Caeserjim','Phorsyte','Shewhofishes',
                    'DO6CC','SuperKoe','Ubbs','Grandma03'
                ],
                'March': [
                    'wally62','Gollygeos','Ly2kw','Peter1980','nyisutter',
                    'Swelpje','Tossie','SLP','molletje','patrisk',
                    'aufbau','Gamsci','szipeti','123xilef','koebes',
                    'thepetersonfinders','MrCB','rynee','SoccerGurl','hopsgeneral'
                ],
                'April': [
                    ''
                ],
                'May': [
                    'Norbee97','gelada','GeoHubi','Duysterstein','Rita85gto',
                    'feikjen','fsafranek','Heinerup','redphoenix','Batmun',
                    'Gamsci','StaceyZ','Jakuje','Nickoes','Elmer',
                    'MrCB','Olagorie','JazzCat','Geckofreund','petertt',
                    'Nov64','Rubik80','2mctwins','dorsetknob','Durango',
                    'loeschfamily','BAJACLAN','Sunboy'
                ],
                'June': [
                    'vanislelady','Kyrandia','oldmountaineer','hunniees','Karrajan',
                    'tmabrey','WeLoveDanger','fsafranek','QueenofDNile','hopsgeneral',
                    'StealthRT','OHail','annabanana','dydy','2mctwins',
                    'MrsHB31','AZJEDI',//Random draw winners
                    'cvdchiller','Kolos2002','Andy69','JirkaKa','EarthAngel','Human01d','stineB'//BONUS Premium membership winners
                ],
                'July': [
                    'JustRachel','cuttingcrew','EagleDadandXenia','Hmn007','Flogni',
                    'mars00xj','gumpel','appeltje32','GeoHubi','Bustersblue',
                    'Theceoiksjes','Teambobcats','munz619','dt07751','jsamundson',
                    'Human01d','Nierenstein','Andy69','BituX'
                ],
                'August': [
                    'Sydonkidd','Kareysue','RUJA','c-bn-bn','patrisk',
                    'Heinerup','Fyrsel','FrankBroughton','Munz619','Scarybob222',
                    'Leusink','StaceyZ','MsYB','Claudi','DeLeeuwen',
                    'Lukyshak','Theceoiksjes','kodiak62','markcase',
                    'redphoenix','Netkaloz','Minerva123','brunosantos','TTFNCACHN',
                    'Anni56','all0123','Durango','Kelkavcvt','stineB',
                    'JuppTenhagen','SoccerGurl','Prindlepalooza','fionails'
                ],
                'September': [
                    'Batmun','Pyro1970','KobeJasper','Jeeper32','GeoCredibles',
                    'geomatrix','wally62','Nov64','RubyRubyDues','Kareysue',
                    'halemeister','SJ0239917','radschlaeger','Munz619','EarthAngel',
                    'Andy69','Taz30','Tossie','Karpe12','Zsomborpeto',
                    'AgentHop','RePe','felixbongers','Pinkeltje','Matanome',
                    'Marijn'
                ],
                'October': [
                    'cuttingcrew','DrentseHooglander','Chere','mobility','stebu',
                    'Nexus69','Bustersblue','Lihi80','humbird7','highmaintenance',
                    'dorsetknob','allison35','DaddyOMommyO','hunniees','Ubbs',
                    'MariaHTJ','Boston2005','sagabi','PavelZR','RMNedrow',
                    'Georiffles','utilitymanjoe','2mctwins','vafarley'
                ],
                'November': [
                    ''
                ],
                'December': [
                    'fscheerhoorn','annabanana','lison55','cvdchiller','kodiak62','zsomborpeto','vafarley','wally62','Tracee74','highmaintenance','hopsgeneral','rita85gto','OHail','Calvertcachers','Dg25plus','kali32891','Florentinka','sohcah','mobility','GeoHubi','Minerva123','Shewhofishes','szegedi','redphoenix','geojerry7','FindersGirl','RudiTeam','DiSaRu','pilsleyguy','Attis','mrscb','mtbiker64','paupau','Marock','aufbau'
                ]
            },
            '2019': {
                'January': [
                    'brilang','spdx2','Calvertcachers','Bungle','Scarybob222','123xilef','Karpe12','Nickoes','NietErVoor','karrajan','teamsturms','Hikerdude','munz619','humbird7','2mctwins2','Hmn007','nyisutter','RUJA','vafarley','rufnredy','koebes','Luuk','loeschfamily','Durango','FromTheTardis','reej','TheFatCats','rabe85','Gollygeos'
                ],
                'February': [
                ],
                'March': [
                ],
                'April': [
                ],
                'May': [
                ],
                'June': [
                ],
                'July': [
                ],
                'August': [
                ],
                'October': [
                ],
                'November': [
                ],
                'December': [
                ]
            }
        };
        const objEntrantVC = {
            '2013': {
                'November': [
                    'jfigel','Leftovers4dinner'
                ],
                'December': [
                    'batmanandrobin','obxgeek','TheIrishDuo','ColesCruising','Harry4077','AB4N','TuckerRay','rynee'
                ]
            },
            '2014': {
                'January': [
                    'CommToad','JSSeegars','ColesCruising','Harry4077','batmanandrobin','codyhollowfarm','Calvertcachers','obxgeek','AB4N','TuckerRay','Gamsci','Jarom','MeanderingMonkeys'
                ],
                'February': [
                    'jfigel','codyhollowfarm','Alexarcara','CommToad','Munzeerailfan','Gamsci','mitchellrulez','MisplacedManatee','rustyfurnace','Jarom','iamfull','MeanderingMonkeys'
                ],
                'March': [
                    'BooGirs','xombie1013','Monkeyware','Munzeerailfan','CommToad','jfigel','rustyfurnace','Gamsci','s2jwwill','JOK','Jt75','Jafigel','batmanandrobin','K2CLH','MeanderingMonkeys','Alexarcara'
                ],
                'April': [
                    'K2CLH','MeanderingMonkeys','Jt75','Thaedion','Staygold678','Jafigel','Munzeerailfan','Leftovers4dinner','rynee','Tarirae','Cacheosaurusrex','mars00xj','ColesCruising','jfigel','Alexarcara','CommToad','moggypaws','Thaedion','Faygopanda','JOK','Gamsci','batmanandrobin','jarcc','targeteer2k','thegorilla23'
                ],
                'May': [
                    'K2CLH','cgal','codyhollowfarm','Jt75','Tarirae','Staygold678','LedaEkim','JOK','MeanderingMonkeys','Munzeerailfan','Hey2ya','Hikerfolk','targeteer2k','CommToad','mars00xj','Kenlaur','Alexarcara','Thaedion','moggypaws','iamfull','Jafigel','jfigel','wvkiwi'
                ],
                'June': [
                    'LedaEkim','rynee','iamfull','Leftovers4dinner','Staygold678','CommToad','Jt75','codyhollowfarm','Munzeerailfan','johanenpaula','K2CLH','MeanderingMonkeys','wvkiwi'
                ],
                'July': [
                    '1849','K2CLH','obxgeek','LedaEkim','Staygold678','Wickedblessed','CommToad','MeanderingMonkeys','JOK','targeteer2k','CanadIanZombie','Munzeerailfan','Alexarcara','iamfull'
                ],
                'August': [
                    'jarcc','1849','MeanderingMonkeys','rynee','Gamsci','CommToad','BAJACLAN','iamfull','Munzeerailfan','CanadIanZombie'
                ],
                'September': [
                    'Linksbiggestfan','Journey374','Robfire','CommToad','3amt','mars00xj','1849','JOK','Jt75','obxgeek','iamfull','jfigel','MeanderingMonkeys','Munzeerailfan','Mhoefing','rustyfurnace','Tarirae','BAJACLAN','Jeremyaxe','rynee','wvkiwi','K2CLH'
                ],
                'October': [
                    'Jt75','Tarirae','Gamsci','RubyRubyDues','CanadIanZombie','Munzeerailfan','CommToad','Qdog','1849','KamKJ','rustyfurnace','BAJACLAN','MeanderingMonkeys','targeteer2k','moggypaws','Thaedion','thegorilla23','rynee'
                ],
                'November': [
                    'Keebs','Journey374','CommToad','cgal','Gamsci','RubyRubyDues','K2CLH','furbabies','Jt75','MeanderingMonkeys','JOK','1849','iamfull','wvkiwi','Jarom','BAJACLAN'
                ],
                'December': [
                    'wakefieldbob','Journey374','furbabies','glaciergrizzly','Gamsci','RubyRubyDues','Hellnite','CommToad','Robfire','Qdog','cgal','MeanderingMonkeys','iamfull','1849','Jarom','wvkiwi','Jt75','BAJACLAN','3amt'
                ]
            },
            '2015': {
                'January': [
                    'Journey374','1849','RubyRubyDues','BAJACLAN','CommToad','MeanderingMonkeys','rosemark','wakefieldbob','Gamsci','JOK','Jarom','cgal','Jt75'
                ],
                'February': [
                    'rosemark','1849','Journey374','rufnredy','cgal','JOK','iamfull','K2CLH','Gamsci','furbabies','RubyRubyDues','HtV','MeanderingMonkeys','Qdog'
                ],
                'March': [
                    'TheCuppFamily','Journey374','Gamsci','rustyfurnace','RubyRubyDues','CommToad','HtV','MeanderingMonkeys','BAJACLAN','LedaEkim','wvkiwi'
                ],
                'April': [
                    'cgal','K2CLH','TheCuppFamily','Jt75','Journey374','furbabies','LedaEkim','8a22a','cski','RubyRubyDues','CommToad','MeanderingMonkeys','obxgeek','HtV','iamfull','jayterho','dekaper','1849','thegorilla23','BAJACLAN','Gamsci','rosemark','rustyfurnace','wvkiwi','Qdog','rynee'
                ],
                'May': [
                    'Journey374','rosemark','NativeTexan','JOK','Jt75','LedaEkim','K2CLH','HtV','dekaper','cski','cgal','jayterho','1849','wakefieldbob','iamfull','FrankBroughton','TheCuppFamily','Jafo44','Qdog','AgentHop','CommToad','furbabies','obxgeek','RubyRubyDues','Gamsci','Therealgigi','dt07751','rustyfurnace','MeanderingMonkeys','jfigel','wvkiwi','kpcrystal07','markcase','BAJACLAN','rynee','thegorilla23'
                ],
                'June': [
                    'markcase','rufnredy','Therealgigi','LyteHouseLovers','daysleeperdot','furbabies','Journey374','Gamsci','McRon','AgentHop','sandlapper120','reej','JOK','Xridesbikex','chalupa','humbird7','jfigel','Thepiedpiper','HB31','Raggedrobin','Slaugy','berry72','halizwein','thorkel','pilsleyguy','die4lustigen5','Monkeyware','Chivasloyal','goldfish72','76CJ7','die4lustigen5','nhblues','garfld67','turtlefan','B4team','GoofyButterfly','bluestreek','Jafo43','Aronk76','efton','Townsow','rynee','queensgrantmusic','rosemark','luckytrition','wakefieldbob','KaLeMi','rbct109','KlassicKelly','NativTxn','szipeti','c-bn','furkeszek','dlwbsa','gelada','cvdchiller','xptwo','winkide','OHail','dlovegrove','Bfloanonchick','secretagentbill','Lednimedvidek','Scgurl03','Tireslinger2010','hunniees','SparrowsGold','Jt75','lynzmeister','grosseface1','sagabi','ahagmann','halaszkiraly','tissa1020FoxhoundCepheus7','geomsp','nyisutter','fluffyfish','janzattic','MabusesErben','mrbloodhound','JackSparrow','crazyladylisa','1derWoman','hisaccityiowahere','Spacecoastgeostore','JaroslavKaas','1849','Curt360','d-n','Winnie51','StealthRT','Mattie','war1man','staordadh','Pointme2','RubyRubyDues','HtV','RcFlyer','IanZ','Yuppy','MoraM85','Mihul','mountainwanderer','skinner879','peterparts','BreathEZ','JuppTenhagen','Rosieree','MamaDuck71','GunnerSteve','3newsomes','Laczy76','BoMS','RUJA','levesund','TheCuppFamily','OdinsFiRe','McAdies','Nov64','EagleDadandXenia','jayterho','dsvmusic','lulu1975','Jigge','kulbago','pritzen','obxgeek','Maryoooch','brilang','geomatrix','tomtom7','Tonbur','Aniara','AusTrackers','TheMachman','deeralemap','ChickenRun','molletje','dekaper','Rubik80','MsYB','jamieb513','bobadams','Redickdigital','AlecPKeaton','dt07751','BAJACLAN','Czechroo','Rodz','metarons','iamfull','paflal','Nickoes','CommToad','thegorilla23','Borghuis','GOF','MeanderingMonkeys','BigLion','Poemelke','wvkiwi'
                ],
                'July': [
                    'Zniffer','MetteS','BoMS','efton','furkeszek','76CJ7','dekaper','emceeelwee','djeagle','HtV','feikjen','bordentaxi','felixbongers','AKiteFlier','vojjuric','Chivasloyal','Borghuis','cvdchiller','HB31','reej','BigLion','rosemark','fluffyfish','jayterho','McRon','B4team','halizwein','Anni56','halaszkiraly','jfigel','GoofyButterfly','rufnredy','Journey374','Redickdigital','AgentHop','xombie1013','LedaEkim','secretagentbill','GAD64','rbct109','arve','hunniees','GunnerSteve','dt07751','deeralemap','tevjen','Poemelke','Casebusters','sandlapper120','CACHEEATER','queensgrantmusic','Spacecoastgeostore','RUJA','Surie','Xridesbikex','herkette','JOK','EagleDadandXenia','markcase','GeoNSow','IndianaCoins','IanZ','obxgeek','DalenBarb','wakefieldbob','Randomluck','dlovegrove','dydy','dlwbsa','pilsleyguy','Attis','FRLK','ouroboros','nyisutter','Rosieree','war1man','cachewhisperer','luckytrition','pritzen','CommToad','Goldfish67','OHail','Tazscouter','Mountianbird','Henning49','Nov64','iamfull','goldfish72','Aniara','RubyRubyDues','TNT','1849','q22q17','Gamsci','Jt75','Aronk76','levesund','StealthRT','rastephens','KlassicKelly','KJ6SOZ','daysleeperdot','CRAWIL','BonKriss13','denali0407','MeanderingMonkeys','whtwolfden','LyteHouseLovers'
                ],
                'August': [
                    'Lukyshak','8a22a','Laczy76','Alke04','JOK','1849','rbct109','rosemark','Bambusznad','szipeti','Tarirae','fluffyfish','JuppTenhagen','GunnerSteve','Thorian','ButchL','Borghuis','markcase','hans415','StealthRT','Gamsci','Loreley','Robby','RubyRubyDues','Mikev1','HtV','thepetersonfinders','wakefieldbob','FrankBroughton','goldfish72','Goldfish67','dt07751','MeanderingMonkeys','Surie'
                ],
                'September': [
                    'markcase','Chivasloyal','1849','pilsleyguy','dt07751','reej','c-bn','deeralemap','BigLion','nyisutter','dekaper','wakefieldbob','cski','jfigel','rosemark','szipeti','scifimom22','76CJ7','Journey374','hans415','HtV','Laczy76','MoraM85','lakotawoman2010','hunniees','goldfish72','Goldfish67','Kahluakel','gelada','ana26','raunas','Georiffles','IanZ','halemeister','FrankBroughton','furbabies','metarons','JuppTenhagen','KlassicKelly','Bambusznad','PhoKite','HB31','thepetersonfinders','hugosoft','janahu','CommToad','Mikev1','winkide','TheIrishDuo','berkestomi','GunnerSteve','Growlers','RubyRubyDues','anderkar','Robby','Nickoes','5daughters','JOK','halizwein','rufnredy','2Witches','Anteaus','FRLK','Attis','pritzen','Gamsci','Cookshome','StealthRT','AdventureTharon','winsomesmile','ddcards','LedaEkim','BAJACLAN','TakeruDavis','Nov64','tiki4','rynee','AgentHop','Poemelke','cvdchiller','Borghuis','arts5','MeanderingMonkeys','wvkiwi'
                ],
                'October': [
                    'hunniees','RubyRubyDues','Journey374','furbabies','markcase','szipeti','Poemelke','Chivasloyal','dt07751','GAD64','KlassicKelly','Gamsci','lakotawoman2010','ehsup','HtV','Djessamuels','kanga021','ana26','TakeruDavis','wakefieldbob','MeLa','levesund','JOK','MeanderingMonkeys','Goldfish67','goldfish72','RUJA','daysleeperdot','Attis'
                ],
                'November': [
                    'JOK','hunniees','szipeti','jamieb513','ButchL','ehsup','chalupa','halizwein','rosemark','KFL200','levesund','McRon','Southtexas','turnersrugs','MoraM85','Laczy76','wakefieldbob','dt07751','76CJ7','jfigel','HtV','thepetersonfinders','aufbau','Batmun','markcase','Mikev1','kpcrystal07','prmarks1391','Netkaloz','5daughters','tatch','efton','furkeszek','BigLion','GunnerSteve','Journey374','1849','Chivasloyal','Borghuis','nyisutter','kodiak62','daysleeperdot','ToysRGood','cvdchiller','Gamsci','CommToad','KlassicKelly','BAJACLAN','Cosmo','rufnredy','HB31','2mctwins2','2mctwins','dekaper','FRLK','berry72','RubyRubyDues','DHitz','JuppTenhagen','tygrici'
                ],
                'December': [
                    'RubyRubyDues','HtV','mobility','szipeti','LilCrab','kpcrystal07','iamfull','Chivasloyal','halizwein','rosemark','Batmun','rufnredy','Gamsci','TheHucksters','wakefieldbob','AusTrackers','Calvertcachers','geoibsons','hunniees','dt07751','Zniffer','levesund','monrose','Jt75','nyisutter','markcase','tygrici','berry72','BAJACLAN','J1Huisman','duncdonut73','jfigel','LedaEkim','2mctwins2','thepetersonfinders','wvkiwi','MeLa','JOK','targeteer2k','Journey374','furbabies','Martin5'
                ]
            },
            '2016': {
                'January': [
                   'Journey374','rosemark','halizwein','nyisutter','Laczy76','mobility','markcase','Zniffer','Mikev1','szipeti','8a22a','KFL200','roughdraft','RubyRubyDues','monrose','ana26','76CJ7','StealthRT','HB31','rastephens','Bambusznad','JOK','Dderryberry60','Gamsci','ZandK','ehsup','Notblonde','berry72','thepetersonfinders','Batmun','HtV','cvdchiller','ZAYD','berkestomi','FRLK','GrizzSteve','hunniees','Tazscouter','Sunboy','Calvertcachers','rufnredy','dekaper'
                ],
                'February': [
                    'markcase','sparkfel','HtV','Laczy76','monrose','Aronk76','Mikev1','roughdraft','rosemark','RubyRubyDues','TwoThumbsFresh','hunniees','dt07751','TheBitBandit','3newsomes','DHitz','dekaper','aufbau','Gamsci','Notblonde','Journey374','Batmun','76CJ7','thepetersonfinders','nyisutter','rynee','cvdchiller','szipeti','Surie','mobility','Haalitip','2mctwins2','2mctwins','GrizzSteve'
                ],
                'March': [
                    'Lukyshak','76CJ7','jakemryan','rosemark','szipeti','Gamsci','rufnredy','BAJACLAN','2dld26','nyisutter','monrose','markcase','TheBitBandit','halemeister','hunniees','dt07751','iamfull','sagabi','DHitz','ButchL','Batmun','1849','aufbau','Sunboy','RubyRubyDues','Dave1968','HtV','Nov64','pritzen','wowieann','thepetersonfinders','mobility','berry72','GrizzSteve','2mctwins2','2mctwins','deeralemap','dekaper'
                ],
                'April': [
                    'Fireslayer','Lorimar','monrose','markcase','rosemark','ButchL','76CJ7','MoraM85','szimari','szipeti','halizwein','fsafranek','thepetersonfinders','1849','dt07751','arts5','Lukyshak','RubyRubyDues','Dave1968','Laczy76','hunniees','pepsiman','d-n','oberharzer1','Nov64','dekaper','deeralemap','DHitz','Adventuremom','hoekraam','mobility','wowieann','damgaard','2mctwins2','2mctwins','roughdraft','ana26','lasipeti','TD42','TheBitBandit','aufbau','gelada','geomsp','reej','FRLK','nyisutter','dlovegrove','halemeister','Minerva123','Bambusznad','HtV','Surie','Sunboy','mars00xj','furbabies','wvkiwi','Journey374','Gamsci','rufnredy','goldfish72','berry72','Xridesbikex','levesund','ZAYD','GrizzSteve'
                ],
                'May': [
                    'hoekraam','pepsiman','Sullendaiz','monrose','J1Huisman','gelada','emceeelwee','sgphotos','scifimom22','76CJ7','MoraM85','markcase','MeLa','aufbau','felixbongers','bordentaxi','feikjen','RubyRubyDues','EagleDadandXenia','roughdraft','halemeister','dg7nct','szipeti','denali0407','reej','AZee','GZee','Bambusznad','hunniees','dt07751','TubaDude','TheRealHunter','ButchL','JackSparrow','ChickenRun','levesund','BoMS','MetteS','Josimo','Minerva123','szimari','Polkajen','HtV','appeltje32','AnnaD','petertt','Nov64','SpiritTree','KernKlan','ana26','mobility','berkestomi','dekaper','pilsleyguy','Netkaloz','KFL200','Marock','MariaHTJ','IanZ','rosemark','Heinerup','dlovegrove','TheBitBandit','Aronk76','geomsp','fsafranek','tatch','Laczy76','maxmaggott','c-bn','KarlWitsman','wakefieldbob','mars00xj','Cybergran','vanislelady','cvdchiller','Jafo43','5daughters','Dipsticks','Lukyshak','pritzen','rufnredy','GeoCredibles','Jt75','DHitz','arts5','1849','TheCuppFamily','ErinBug232','nyisutter','deeralemap','Mattie','Gamsci','Traycee','Dave1968','CACHEEATER','kanga021','wowieann','Goldfish67','goldfish72','d-n','CommToad','halizwein','Sunboy','Hypospray','Kazrob273','Mrs5daughters','Attis','rabe85','turnersrugs','Journey374','Theceoiksjes','IndianaCoins','Marnic','Zniffer','RUJA','berry72','david03','FRLK','rynee','BAJACLAN','Surie','Alke04','DalenBarb'
                ],
                'June': [
                   'monrose','vanislelady','lonos','MariaHTJ','fscheerhoorn','hoekraam','Dts234','kanga021','Aronk76','scifimom22','76CJ7','RUJA','Zniffer','MeLa','emceeelwee','Alke04','AZJEDI','Heinerup','frlk','ChickenRun','JackSparrow','denali0407','Sullendaiz','deeralemap','appeltje32','rosemark','d-n','berry72','felixbongers','bordentaxi','feikjen','sidekicks','maxmaggott','szimari','szipeti','iamfull','Nickoes','markcase','wakefieldbob','petertt','IanZ','Gamsci','bonsaai','RubyRubyDues','halemeister','Laczy76','dt07751','Hypospray','ButchL','Minerva123','gelada','OCMomkat61','Jafo43','feikjen','NanaKern','KernKlan','Bambusznad','fsafranek','2mctwins2','2mctwins','Attis','luckytrition','Lokiira','3newsomes','BAJACLAN','airnut','rufnredy','Marock','CACHEEATER','nyisutter','GeoCredibles','mobility','hunniees','ana26','Theceoiksjes','HtV','pepsiman','levesund','Jt75','taska1981','Traycee','Robfire','pilsleyguy','Nov64','TheCuppFamily','david03','pritzen','hisaccityiowahere','1derWoman','DO6CC','rabe85','wowieann','Marnic','Rokey','BellaBrandalyn','jakemryan','dekaper','DHitz','EagleDadandXenia','aufbau','cuppcake','Venezia','atmega8','tatch','reej','cvdchiller','grisly1','humbird7','OHail','ZAYD','Goldfish67','goldfish72','Leusink','Surie','halizwein'
                ],
                'July': [
                    'Aronk76','TubaDude','EagleDadandXenia','nhblues','FRLK','hoekraam','Alke04','Theceoiksjes','mobility','Jt75','cvdchiller','monrose','76CJ7','petertt','ZAYD','nyisutter','markcase','AnnaD','djeagle','mding4gold','Gollygeos','emceeelwee','Freecyclestacy','Disneyfan4life85','rabe85','Tornado','Lukyshak','vanislelady','Pollywog','AllyMouse','Laczy76','alfabootis','ThePucketts','Nickoes','d-n','DHitz','szimari','szipeti','Pronkrug','levesund','Hypospray','daysleeperdot','HtV','halizwein','MariaHTJ','wowieann','Dts234','TXTravelers','Jafo43','RickyRebel','halemeister','GeoCredibles','Marock','Batmun','eph5vs20','TheCuppFamily','denali0407','pritzen','Gamsci','mars00xj','Surie','deeralemap','gelada','fsafranek','ChinaBulls','Robfire','Attis','IanZ','Venezia','Traycee','azrich','pepsiman','pilsleyguy','bencus05','taska1981','RubyRubyDues','Staslovtsov','Marnic','mossguts','terrys0918','Sonny32712','Nov64','Dipsticks','JackSparrow','cuppcake','BellaBrandalyn','rufnredy','proxie','Szotyii','appeltje32','Lissu','wakefieldbob','AZJEDI','Goldfish67','goldfish72','fscheerhoorn','rynee','Poemelke','reej','Heinerup','bordentaxi','feikjen','J1Huisman','Bambusznad','kanga021','CadillacBlood','Steampunk','Leusink','3newsomes','BAJACLAN'
                ],
                'August': [
                    'JackSparrow','markcase','dlovegrove','hoekraam','emceeelwee','Lukyshak','Gollygeos','nyisutter','Heinerup','monrose','Staslovtsov','TubaDude','76CJ7','scifimom22','Nov64','Surie','Laczy76','reej','rufnredy','EagleDadandXenia','AnnaD','petertt','1SheMarine','hunniees','vanislelady','Sonny32712','GeoCredibles','FRLK','Marock','alfabootis','halemeister','QueenofDNile','highmaintenance','J1Huisman','mobility','Jafo43','eph5vs20','jillix','deeralemap','pritzen','fsafranek','OldSchoolSkater','airnut','Theceoiksjes','appeltje32','pepsiman','WandelKuub','BAJACLAN','Gamsci','RubyRubyDues','sidekicks','bencus05','thepetersonfinders','Venezia','3newsomes','atmega8','IndianaCoins','Bambusznad','Sunboy','Marnic','HtV','dt07751','olivideae','rabe85','Birdhouse','szipeti','gelada','ChinaBulls','AZJEDI','DHitz','Mulder','denali0407','wvkiwi','Basketballlife','terrys0918','mossguts','Dts234','goldfish72','Goldfish67','Traycee','szimari','d-n','Leusink','cvdchiller','Pronkrug','Aronk76','92Supercoupe'
                ],
                'September': [
                    'markcase','Xridesbikex','Surie','Hypospray','monrose','mossguts','terrys0918','Leusink','Rubik80','RubyRubyDues','Staslovtsov','petertt','eph5vs20','Laczy76','Gollygeos','nyisutter','Jafo43','FRLK','Birdhouse','MariaHTJ','halizwein','76CJ7','scifimom22','daysleeperdot','hoekraam','johnsjen','szipeti','GeoCredibles','coastingcollins','OddIntentions','halemeister','vanislelady','sidekicks','levesund','HtV','Omatsegorova','Nickoes','Candy32712','Sonny32712','Stingingzakster','pepsiman','fsafranek','AnnaD','JackSparrow','Ffm','c-bn','wemissmo','EagleDadandXenia','dt07751','hunniees','szimari','2mctwins','2mctwins2','TheCuppFamily','Bambusznad','alfabootis','emceeelwee','Marock','rufnredy','mobility','Goldfish67','goldfish72','piupardo','mars00xj','feikjen','appeltje32','OldSchoolSkater','Dts234','cuppcake','pritzen','kanga021','gelada','ZAYD','DHitz','Marnic','BAJACLAN','wowieann','jfigel','wakefieldbob','highmaintenance','atmega8','thepetersonfinders','Theceoiksjes','Nadett','Sunboy','rabe85','Pronkrug','deeralemap','Nov64','Gamsci','ChinaBulls','cvdchiller','Lissu','jillix','d-n','Lukyshak','AZJEDI','annabanana','3newsomes','dlovegrove','J1Huisman','Hikerdude','WandelKuub','Traycee','djsgriffus'
                ],
                'October': [
                   '76CJ7','highmaintenance','markcase','kpr1000','ZAYD','monrose','c-bn','cvdchiller','GZee','DHitz','fsafranek','airnut','AZJEDI','kanga021','moff','johanenpaula','levesund','mossguts','Basketballlife','terrys0918','Theceoiksjes','Bambusznad','nyisutter','Staslovtsov','5Star','EagleDadandXenia','gelada','HtV','RubyRubyDues','nhblues','mobility','alfabootis','Laczy76','Pronkrug','Omatsegorova','MariaHTJ','TubaDude','maxmaggott','PrincessMeli','Sprinkman','LedaEkim','vanislelady','Nov64','jfigel','djsgriffus','pepsiman','hoekraam','AnnaD','petertt','GeoCredibles','denali0407','appeltje32','Jafo43','MattHoward','piupardo','Werewulf','szipeti','Bizzeh','LilCrab','Marnic','Gollygeos','szimari','Venezia','fscheerhoorn','hunniees','Gamsci','bencus05','coastingcollins','Lissu','aaalv','Traycee','Batmun','Dts234','Florentinka','Birdhouse','Stingingzakster','Candy32712','Sonny32712','JackSparrow','d-n','TheCuppFamily','Hypospray','thepetersonfinders','atmega8','Surie','LFC21','OddIntentions','david03','reej','3newsomes','Hikerdude','wowieann','daysleeperdot','arts5','BOOM','rabe85','boompa','jillix','emceeelwee','WandelKuub','pritzen','Sunboy','Trappertje','deeralemap','PubbE','rufnredy','OldSchoolSkater','david03','Leeh','TXTravelers','BAJACLAN','1SheMarine','dlovegrove','taska1981','Leusink','QueenofDNile','dt07751','goldfish72','Goldfish67','2mctwins','2mctwins2','Nadett','FRLK','RoversEnd','grafinator','ChinaBulls'
                ],
                'November': [
                    'Laczy76','TXTravelers','monrose','5Star','gelada','Hikerdude','nyisutter','RubyRubyDues','FlightsOfFancy','Bambusznad','MariaHTJ','halemeister','Bigpoopyhead','76CJ7','hoekraam','aufbau','Gollygeos','kpr1000','rufnredy','mossguts','Basketballlife','terrys0918','WandelKuub','AlephRita','GeoCredibles','3newsomes','Staslovtsov','Attis','RoversEnd','Nov64','AZJEDI','Omatsegorova','HtV','Gamsci','Jafo43','markcase','pritzen','levesund','Hypospray','mobility','ZAYD','DHitz','mars00xj','Werewulf','szimari','szipeti','taska1981','Nadett','Sunboy','fsafranek','JackSparrow','CzPeet','halizwein','wowieann','OddIntentions','LFC21','hunniees','highmaintenance','dt07751','Leusink','cvdchiller','Goldfish67','goldfish72','Pronkrug','Theceoiksjes','appeltje32 '
                ],
                'December': [
                    'monrose','kpr1000','Basketballlife','Kyndall32712','Candy32712','mossguts','terrys0918','Sonny32712','Chrislan','3newsomes','5Star','hoekraam','Gollygeos','levesund','Sprinkman','DO6CC','vanislelady','markcase','Pollywog','OddIntentions','Gamsci','gelada','76CJ7','EagleDadandXenia','draco85','Laczy76','FRLK','GeoCredibles','d-n','Attis','Bambusznad','MariaHTJ','Batmun','pilsleyguy','piupardo','Zniffer','Heinerup','HtV','bonsaai','ZAYD','nyisutter','aaalv','Traycee','TheDrollEclectic','Skree','Jafo43','nuttynan','AnnaD','johnsjen','fsafranek','wowieann','J1Huisman','NuttyRachy','Omatsegorova','Chivasloyal','Staslovtsov','JackSparrow','CzPeet','Hypospray','Florentinka','florish','pritzen','Nov64','Derbstesfrau','Derbste','fscheerhoorn','petertt','ChrisMJ','szipeti','szimari','rufnredy','RubyRubyDues','mobility','TheCuppFamily','Hikerdude','Calvertcachers','LilCrab','PrincessMeli','appeltje32','cvdchiller','coastingcollins','RudiTeam','nhblues','Pronkrug','Theceoiksjes','WandelKuub','PAKRee','Lukyshak','Minerva123','pepsiman','highmaintenance','halemeister','djsgriffus','hunniees','alfabootis','CrossedAnchors','berry72','AlephRita','OldSchoolSkater','dt07751','ChinaBulls','LFC21','Goldfish67','goldfish72','mayberryman','fionails','wvkiwi','targeteer2k','AZJEDI','Bigpoopyhead','oztex','TXTravelers','Elise','Marijn','Leusink','Surie','Nadett','rynee','becca911','tygrici','skleba','Marnic','BAJACLAN','DHitz','Sunboy','Lovelylissa'
                ]
            },
            '2017': {
                'January': [
                    'Pollywog','Sprinkman','AlephRita','monrose','kpr1000','rbct109','patrisk','Star','Theceoiksjes','cenki','coastingcollins','Tracee74','fsafranek','Aronk76','Trappertje','vanislelady','mobility','Gollygeos','Hikerdude','petertt','AnnaD','WandelKuub','Marock','Brandikorte','dlovegrove','newsomes','ICFrosty','Rags2','Frostitute','halemeister','RebelGTP','Birdhouse','appeltje32','RubyRubyDues','CJ7','markcase','Chivasloyal','rufnredy','Nickoes','JonahJohnson21','mayberryman','LadyMunzee','Bambusznad','CrossedAnchors','Staslovtsov','Codeyharrison0','Sonny32712','Stingingzakster','Candy32712','mars00xj','ChinaBulls','GeoCredibles','oldmountaineer','rabe85','ChrisMJ','NuttyRachy','EmileP68','sverlaan','CzPeet','pepsiman','mossguts','terrys0918','MariaHTJ','hoekraam','Minerva123','florish','ZAYD','Kyndall32712','alfabootis','nyisutter','FRLK','Omatsegorova','Gamsci','Calvertcachers','wemissmo','annabanana','jgphd','Traycee','Nadett','Sunboy','OldSchoolSkater','Bigpoopyhead','Venezia','bencus05','scifimom22','RudiTeam','Sherminator18','JackSparrow','Florentinka','d-n','highmaintenance','GrizzSteve','Jafo43','J1Huisman','kagey','nuttynan','fscheerhoorn','TheCuppFamily','AZJEDI','LFC21','Goldfish67','Leusink','Marnic','goldfish72','dt07751','hunniees','djsgriffus','utilitymanjoe','DHitz','BAJACLAN'
                ],
                'February': [
                    'monrose','Nickoes','molletje','Rubymoon05','Basketballlife','mossguts','terrys0918','VampGirl32','RubyRubyDues','5Star','kpr1000','patrisk','Gollygeos','3newsomes','allison35','EmileP68','sverlaan','Aronk76','annabanana','rufnredy','Gamsci','J1Huisman','kanga021','Theceoiksjes','EagleDadandXenia','nyisutter','denali0407','Chivasloyal','d-n','markcase','RudiTeam','fsafranek','gelada','Laczy76','IanZ','levesund','halemeister','Bigpoopyhead','Sherminator18','pilsleyguy','utilitymanjoe','dt07751','fscheerhoorn','hunniees','bonsaai','NuttyRachy','deeralemap','oldmountaineer','Florentinka','Surie','Tracee74','OHail','vanislelady','jgphd','mars00xj','GeoCredibles','Chrislan','HtV','76CJ7','pritzen','AnnaD','Nov64','pepsiman','Bambusznad','Pronkrug','grafinator','furshore','MariaHTJ','mom','highmaintenance','rabe85','szimari','szipeti','AlephRita','ZAYD','WandelKuub','Sprinkman','Jafo43','scifimom22','Marock','c-bn','appeltje32','LFC21','bencus05','seekerfamily','TXTravelers','petertt','cvdchiller','Venezia','alfabootis','PubbE','FrankBroughton','Traycee','airnut','JackSparrow','Trappertje','PAKRee','TheCuppFamily','reej','Boompa','hoekraam','BAJACLAN','GrizzSteve','Omatsegorova','the1acwright','thepetersonfinders','Goldfish67','RebelGTP','goldfish72','Brandikorte','Hikerdude','wakefieldbob','johnsjen','feikjen','bordentaxi','felixbongers','TheDrollEclectic','Sunboy','OldSchoolSkater','Staslovtsov','FRLK','florish','Werewulf','Marnic','lynnslilypad','Sonny32712','Candy32712','djsgriffus','DHitz','Minerva123','Leusink','nicmar','CzPeet'
                ],
                'March': [
                    'highmaintenance','RubyRubyDues','fsafranek','CrossedAnchors','Gollygeos','monrose','molletje','5Star','EagleDadandXenia','GeoCredibles','WhisperInTheWind','Journey374','Chivasloyal','HtV','bonsaai','patrisk','J1Huisman','airnut','kpr1000','Gamsci','nyisutter','rufnredy','mobility','Nov64','furshore','76CJ7','GrizzSteve','hunniees','FRLK','annabanana','Loxmudprincess','the1acwright','Staslovtsov','Omatsegorova','c-bn','arts5','Nickoes','VampGirl32','szimari','CzPeet','thepetersonfinders','Aronk76','d-n','Tracee74','TheDrollEclectic','HtV','Traycee','dt07751','markcase','BAJACLAN','bordentaxi','felixbongers','feikjen','Jafo43','halemeister','AZJEDI','jgphd','kagey','fscheerhoorn','mars00xj','Werewulf','Jt75','utilitymanjoe','hoekraam','Minerva123','appeltje32','AlephRita','grafinator','Marock','oldmountaineer','demhackbardt','LFC21','denali0407','Batmun','pritzen','seekerfamily','Arendsoog','deeralemap','Candy32712','Sonny32712','dlovegrove','alfabootis','rabe85','MariaHTJ','ZAYD','Venezia','RudiTeam','szipeti','Sprinkman','bencus05','gelada','Boompa','OldSchoolSkater'
                ],
                'April': [
                    'd-n','bonsaai','gelada','J1Huisman','Jt75','Robfire','OHail','cvdchiller','fscheerhoorn','5Star','HtV','c-bn','monrose','Phorsyte','brawnybear','SuperKoe','annabanana','FRLK','szipeti','szimari','molletje','EagleDadandXenia','appeltje32','bordentaxi','feikjen','coastingcollins','Sprinkman','Sherminator18','76CJ7','WandelKuub','Theceoiksjes','levesund','Sunboy','WouterVL','Gollygeos','Prindlepalooza','grafinator','patrisk','Traycee','Chrislan','markcase','djeagle','aaalv','Jafo43','broek','rabe85','Arendsoog','felixbongers','oldmountaineer','Calvertcachers','rufnredy','CzPeet','rynee','kpr1000','mars00xj','Codeyharrison0','Sonny32712','alfabootis','bencus05','hunniees','HB31','RubyRubyDues','Laczy76','hoekraam','Dg25plus','seekerfamily','OldSchoolSkater','demhackbardt','Hikerdude','wally62','halemeister','utilitymanjoe','dydy','Nov64','Pronkrug','Candy32712','3newsomes','fsafranek','cachewhisperer','Shewhofishes','nyisutter','Elise','Leusink','Marijn','Bambusznad','DO6CC','Chivasloyal','djsgriffus','arts5','taska1981','thepetersonfinders','BAJACLAN','AZJEDI','Staslovtsov','Skree','reej','Aronk76','Venezia','AlephRita','Marnic','GeoCredibles','furshore','halaszkiraly','Marock','mobility','Ivivila','Gamsci','vanislelady','pepsiman','pilsleyguy','Nickoes','pritzen','highmaintenance','mayberryman','JonahJohnson21','MariaHTJ','Lukyshak','sagabi','Trappertje','Batmun','nicmar','TheCuppFamily','Goldfish67','goldfish72','PawPatrolThomas','EmileP68','sverlaan','dt07751','ZAYD','RudiTeam','jarcc','RoversEnd','jgphd','Kagely','JackSparrow','Werewulf','Hmn007','deeralemap','LFC21','denali0407','humbird7','PAKRee','Surie','2mctwins2','2mctwins','StealthRT','TXTravelers','DeLeeuwen','Minerva123','TheDrollEclectic','halizwein','oztex','QueenofDNile','dlovegrove'
                ],
                'May': [
                    'demhackbardt','Gollygeos','miri68','5Star','DHitz','GeoCredibles','Traycee','mossguts','Basketballlife','terrys0918','martaska','Calvertcachers','maxmaggott','ZAYD','cuttingcrew','utilitymanjoe','sagabi','Bambusznad','markcase','PawPatrolThomas','TXTravelers','oztex','monrose','Sonny32712','Codeyharrison0','molletje','AlephRita','rabe85','LadyMunzee','dt07751','nyisutter','gorilla','gelada','pulsarxp','NuttyRachy','RubyRubyDues','wally62','JackSparrow','AZJEDI','cvdchiller','Chrislan','Andyscorch'//Partial list?
                ],
                'June': [
                    'RubyRubyDues','Brandikorte','pilsleyguy','szimari','szipeti','Arendsoog','fscheerhoorn','hoekraam','DHitz','wally62','5Star','kpr1000','felixbongers','levesund','AnnaD','petertt','RudiTeam','feikjen','monrose','Gollygeos','markcase','reej','J1Huisman','FRLK','Hikerdude','ZAYD','Ralpon','HtV','gorilla','gelada','Sprinkman','Amerod','brawnybear','rabe85','Hmn007','Nickoes','c-bn','kodiak62','Theceoiksjes','Laczy76','MeLa','WandelKuub','alfabootis','Venezia','vanislelady','molletje','Sunboy','AlephRita','EagleDadandXenia','denali0407','Bambusznad','Robfire','Codeyharrison0','Sonny32712','pulsarxp','OHail','AZJEDI','JoshA14','paupau','draco85','halaszkiraly','CzPeet','SuperKoe','jsamundson','Norkie','Batmun','TheGSA','Aronk76','fsafranek','cuttingcrew','Tracee74','GeoCredibles','rufnredy','Candy32712','jarcc','Journey374','raunas','Durango','Prindlepalooza','appeltje32.','Albatrozz','Marock','mobility','OldSchoolSkater','2mctwins2','2mctwins','Atzepeng84','HB31','halizwein','Lewatkin','QueenofDNile','Traycee','wemissmo','nhblues','76CJ7','Anitaz','furbabies','einkilorind','Llee430','oldmountaineer','pritzen','andrewbmbox','Evi','Lukyshak','koebes','Tornado','Gamsci','kanga021','patrisk','thepetersonfinders','seekerfamily','bencus05','MariaHTJ','halemeister','hunniees','StaceyZ','utilitymanjoe','dt07751','nyisutter','Nov64','annabanana','Pronkrug','mayberryman','rynee','cvdchiller','Human01d','pooky92','pepsiman','jgphd','DeLeeuwen','DO6CC','FFM','mars00xj','WouterVL','taska1981','LFC21','Crashbum','airnut','kilpertti','WE4NCS','Shewhofishes','Phorsyte','Mnbball','ohmaneel','RebelGTP','loeschfamily','PAKRee','Sherminator18','Dg25plus','Surie','d-n','highmaintenance','djsgriffus','VampGirl32','dap217','dabecks','miri68','malof','TrialbyFire','hopsgeneral','AgentHop','dlovegrove','terrys0918','BAJACLAN','SLP','OBC','coastingcollins','3newsomes','Florentinka','Amireneemi','oztex','TXTravelers','Madman2o'
                ],
                'July': [
                    'Dg25plus','GeoCredibles','cuttingcrew','5Star','florish','Sueskyp','TheGSA','DeLeeuwen','Aukush','Laczy76','radschlaeger','levesund','76CJ7','ZAYD','Sanli','WeLoveDanger','Gollygeos','c-bn','kpr1000','Brandikorte','djsgriffus','Veroni','Amerod','nuttynan','appeltje32','utilitymanjoe','pepsiman','FindersGirl','dorsetknob','scifimom22','Heinerup','wally62','highmaintenance','Hmn007','Nickoes','monrose','Florentinka','TheDrollEclectic','Human01d','vanislelady','AgentHop','RubyRubyDues','pooky92','3newsomes','markcase','hunniees','szipeti','Lewatkin','patrisk','rufnredy','Phorsyte','J1Huisman','miri68','EagleDadandXenia','MrsHB31','airnut','Pinkeltje','oldmountaineer','fsafranek','bonsaai','FRLK','alfabootis','bencus05','mayberryman','loeschfamily','JonahJohnson21','Mnbball','AlephRita','szimari','molletje','Trappertje','WandelKuub','Shewhofishes','HB31','cachewhisperer','Jafo43','fionails','linusbi','Evi','Anitaz','CzPeet','pulsarxp','SuperKoe','dap217','vafarley','Leusink','Robfire','aaalv','roughdraft','hoekraam','Sprinkman','paupau','einkilorind','MariaHTJ','Lukyshak','grafinator','deeralemap','Durango','coastingcollins','mobility','Marnic','gorilla','gelada','kodiak62','Albatrozz','Swelpje','Bambusznad','Gamsci','mctwins2','cvdchiller','Atzepeng84','WE4NCS','Marock','nicmar','rabe85','Theceoiksjes','fscheerhoorn','bordentaxi','feikjen','felixbongers','dt07751','Arendsoog','Staslovtsov','jsamundson','MrCB','RobS','BikeDH','Netkaloz','Ralpon','Pronkrug','kanga021','Minerva123','sfwife','brawnybear','Sherminator18','Venezia','annabanana','musthavemuzk','denali0407','pilsleyguy','thepetersonfinders','Leeh','AZJEDI','greensfgiant','Minerva123','LFC21','geojerry7','DHitz','JackSparrow','Belladivadee','d-n','Nov64','DO6CC','1SheMarine','halizwein','Ivivila','pritzen','mars00xj','StaceyZ','LauraAgain','Hikerdude','allison35','Iansdad','alicta','taska1981','FFM','demhackbardt','derekh','Batmun','Aronk76','OBC','SLP','Goldfish67','humbird7','Surie','2mctwins','RudiTeam','Calvertcachers','Prindlepalooza','Traycee','WHC','OldSchoolSkater','BAJACLAN','QueenofDNile'
                ],
                'August': [
                    'anislelady','markcase','RubyRubyDues','cvdchiller','Tracee74','monrose','djsgriffus','pepsiman','TheGSA','76CJ7','sgphotos','dap217','Florentinka','Aukush','molletje','Batmun','Sprinkman','Prindlepalooza','fsafranek','StaceyZ','nyisutter','wally62','RePe','kpr1000','Pinkeltje','J1Huisman','appeltje32','dorsetknob','Gamsci','ZAYD','5Star','MrCB','geojerry7','Hmn007','Nickoes','FRLK','miri68','hoekraam','alicta','Bungle','paupau','Arendsoog','feikjen','npyskater','Atzepeng84','CzPeet','cachewhisperer','szipeti','Pronkrug','Theceoiksjes','Peter1980','Netkaloz','Bambusznad','mobility','Aronk76','WE4NCS','Laczy76','Marnic','Human01d','fscheerhoorn','WandelKuub','Anitaz','FindersGirl','GeoCredibles','Sophia0909','szimari','WeLoveDanger','felixbongers','AZJEDI','rufnredy','Phorsyte','Shewhofishes','bordentaxi','Venezia','Gollygeos','coastingcollins','cuttingcrew','Belladivadee','pulsarxp','humbird7','AlephRita','PubbE','pooky92','tmabrey','BikeDH','gumpel','Leusink','JoshA14','scifimom22','kodiak62','Calvertcachers','Dg25plus','einkilorind','Mnbball','c-bn','mutti','HGH2','annabanana','BAJACLAN','oldmountaineer','kanga021','DHitz','dydy','SuperKoe','halaszkiraly','OHail','Jafo43','3newsomes','Yida','thepetersonfinders','Evi','nicmar','gelada','Marock','Ubbs','Hikerdude','MariaHTJ','rynee','halemeister','jsamundson','JackSparrow','Lukyshak','airnut','SLP','vafarley','OBC','EmileP68','sverlaan','fionails','linusbi','levesund','hunniees','MrsHB31','ChrisMJ','loeschfamily','dt07751','PAKRee','alfabootis','bencus05','malof','HB31','Nov64','GrandMasterE','halizwein','HarQuinzel','lison55','patrisk','RobS','Amerod','martaska','Sanli','Trappertje','pritzen','deeralemap','Albatrozz','Swelpje','Veroni','Minerva123','mars00xj','Adam848','gorilla','MeanderingMonkeys','musthavemuzk','demhackbardt','d-n','StealthRT','sfwife','greensfgiant','rabe85','petertt','AnnaD','NetB','2mctwins','2mctwins2','OldSchoolSkater','Durango','EagleDadandXenia','Surie','Staslovtsov','Elise','Marijn','RudiTeam','Goldfish67','dlovegrove','QueenofDNile'
                ],
                'September': [
                    'FindersGirl','bonsaai','kodiak62','WeLoveDanger','5Star','pooky92','Gamsci','Leusink','Phorsyte','WE4NCS','TheGSA','HB31','GeoCredibles','monrose','Gollygeos','markcase','Shewhofishes','cuttingcrew','hoekraam','wemissmo','denali0407','jsamundson','lison55','Dg25plus','QueenofDNile','fscheerhoorn','fsafranek','Nov64','Venezia','kpr1000','bencus05','dap217','Peter1980','annabanana','Hmn007','Nickoes','patrisk','bordentaxi','feikjen','felixbongers','AZJEDI','tmabrey','Anitaz','paupau','Adam848','Werewulf','StaceyZ','vanislelady','halemeister','Human01d','DHitz','Sanli','rufnredy','molletje','alfabootis','76CJ7','Sprinkman','war1man','Rosieree','humbird7','Belladivadee','pritzen','TubaDude','hunniees','gumpel','Calvertcachers','Minerva123','c-bn','gelada','AgentHop','dorsetknob','nyisutter','appeltje32','RubyRubyDues','sverlaan','cvdchiller','MrsHB31','3newsomes','EagleDadandXenia','MariaHTJ','2mctwins','2mctwins2','Amireneemi','Tracee74','Bambusznad','halizwein','mobility','Florentinka','cachewhisperer','Vharrison','Sonny32712','Candy32712','rabe85','Laczy76','SuperKoe','d-n','djsgriffus','Trappertje','Theceoiksjes','deeralemap','mars00xj','Jafo43','oldmountaineer','FRLK','reej','J1Huisman','Pinkeltje','all0123','ZAYD','Batmun','RudiTeam','mayberryman','Ubbs','Pronkrug','tomtom71','Aukush','Traycee','Mnbball','OHail','AlephRita','RePe','nora1','Hikerdude','pepsiman','BAJACLAN','musthavemuzk','Goldfish67','WandelKuub'
                ],
                'October': [
                    'radschlaeger','Aaalv','monrose','EagleDadandXenia','lison55','Gollygeos','tmabrey','GeoCredibles','Peter1980','markcase','Sanli','Laczy76','felixbongers','hoekraam','feikjen','OHail','Aukush','c-bn','gelada','patrisk','5Star','OHail','geojerry7','mobility','TheCuppFamily','Bambusznad','paupau','koebes','mutti','denali0407','Koukyy','Gamsci','SuperKoe','Netkaloz','bordentaxi','AlephRita','AZJEDI','SoccerGurl','HarQuinzel','levesund','Adam848','Trappertje','Marock','cuttingcrew','76CJ7','gumpel','HtV','DHitz','TheGSA','OldSchoolSkater','Sophia0909','WeLoveDanger','szipeti','Geodude','fsafranek','Hmn007','d-n','Arendsoog','Theceoiksjes','HB31','molletje','alfabootis','bencus05','ZAYD','kodiak62','RePe','airnut','highmaintenance','ChrisMJ','jsamundson','pooky92','owlsurfer','AZBookworm','Yida','Jafo43','appeltje32','Florentinka','vanislelady','reej','tomtom71','Prindlepalooza','StaceyZ','gorilla','Human01d','alicta','AgentHop','hopsgeneral','mars00xj','vafarley','halemeister','rynee','nyisutter','Staslovtsov','Brandikorte','annabanana','hunniees','dt07751','scifimom22','hugosoft','Krogh','kpr1000','NativenUK','MrsHB31','Tracee74','dorsetknob','Venezia','fionails','linusbi','Pronkrug','rufnredy','3newsomes','Dg25plus','Vimpula','Kjasdad','petertt','TubaDude','IanZ','Marnic','MrCB','FRLK','RubyRubyDues','CzPeet','WE4NCS','Hikerdude','loeschfamily','Ubbs','Mnbball','WandelKuub','fscheerhoorn','rabe85','cvdchiller','MariaHTJ','sverlaan','Minerva123','Batmun','deeralemap','Phorsyte','FFM','Shewhofishes','KG','DO6CC','nicmar','thepetersonfinders','taska1981','coastingcollins','kanga021','Georiffles','Amerod','2mctwins','2mctwins2','Boompa','pritzen','bonsaai','MeanderingMonkeys','djsgriffus','pepsiman','Matanome','EmileP68','pilsleyguy','grafinator','PAKRee','Sherminator18','RobS','oldmountaineer','Sunboy','LFC21','halizwein','Veroni','Traycee','Nov64','Durango','BAJACLAN','JackSparrow','dlovegrove','lynnslilypad','krissymonkey','musthavemuzk','Sprinkman','TXTravelers','QueenofDNile','J1Huisman','Pinkeltje','solarwib','amoocow','Eifulaner'
                ],
                'November': [
                    'Geodude','Arendsoog','markcase','5Star','TheGSA','Scarybob222','cuttingcrew','vanislelady','Peter1980','patrisk','highmaintenance','tmabrey','Pollywog','c-bn','DragonflyGirl','Gollygeos','Phorsyte','monrose','Acknud','EagleDadandXenia','Human01d','szipeti','bonsaai','feikjen','bordentaxi','TXTravelers','Traycee','Tracee74','Atzepeng84','kpr1000','kodiak62','RudiTeam','paupau','fionails','levesund','Poolnudel','mars00xj','MrsHB31','HB31','molletje','HtV','jsamundson','wally62','appeltje32','Amerod','WeLoveDanger','felixbongers','Dg25plus','RobS','linusbi','Hoekramm','halemeister','Marnic','Nov64','StaceyZ','dorsetknob','mobility','Adam848','PavelZR','76CJ7','MariaHTJ','gumpel','Staslovtsov','gelada','malof','all0123','hunniees','JirkaKa','thepetersonfinders','FindersGirl','loeschfamily','Aukush','owlsurfer','GeoCredibles','Hmn007','minerva','Food','PAKRee','kareliris','3newsomes','annabanana','pilsleyguy','nicmar','mayberryman','tomtom71','alfabootis','Poemelke','RubyRubyDues','Gamsci','Leusink','cvdchiller','Bambusznad','AlephRita','dt07751','J1Huisman','Nickoes','Trappertje','pritzen','SuperKoe','WandelKuub','rabe85','Koukyy','FRLK','Florentinka','Ralpon','fscheerhoorn','irca','alicta','einkilorind','TheMachman','grafinator','lison55','rufnredy','Marock','bencus05','Laczy76','ZAYD','coastingcollins','Theceoiksjes','Ubbs','Mnbball','Jafo43','Sanli','demhackbardt','sverlaan','PawPatrolThomas','EmileP68','NativenUK','pepsiman','OBC','SLP','Calvertcachers','AZJEDI','Pronkrug','Sunboy','dydy','JuppTenhagen','Batmun','martaska','Netkaloz','Venezia','halizwein','2mctwins2','2mctwins','DHitz','krissymonkey','vafarley','MeanderingMonkeys','oldmountaineer','Hikerdude','Pinkeltje','Bumpy','nyisutter','MrCB','lynnslilypad','Boompa','denali0407','fsafranek','mrscb','Madman2o','Kjasdad','hopsgeneral','deeralemap','TheCuppFamily','Durango','LFC21','AgentHop','SoccerGurl','BAJACLAN','Brandikorte','OHail','musthavemuzk','Sprinkman','djsgriffus','CzPeet','AZBookworm'
                ],
                'December': [
                    'Koukyy','DHitz','Chere','Minerva123','Adventuremom','J1Huisman','5Star','Pinkeltje','kpr1000','Poemelke','Human01d','WeLoveDanger','WandelKuub','markcase','mars00xj','Tomtom','Adam848','HtV','molletje','hoekraam','BDg25plus','EagleDadandXenia','fsafranek','paupau','NativenUK','Aukush','Peter1980','oldmountaineer','Gollygeos','monrose','GeoCredibles','Jt75','Elmer','tmabrey','Batmun','2mctwins','2mctwins2','JirkaKa','gumpel','patrisk','nyisutter','3newsomes','FindersGirl','cuttingcrew','pepsiman','Acknud','DragonflyGirl','vanislelady','AgentHop','TheGSA','mobility','Leusink','kodiak62','76CJ7','Norbee97','hunniees','rynee','Bumpy','vafarley','rabe85','hopsgeneral','Matanome','ZAYD','owlsurfer','ChrisMJ','Hmn007','aufbau','djsgriffus','appeltje32','NuttyRachy','Staslovtsov','lison55','Calvertcachers','MrCB','demhackbardt','bordentaxi','Tracee74','Werewulf','feikjen','cvdchiller','redphoenix','Pollywog','Chivasloyal','Dts234','Brandikorte','Marock','alicta','MariaHT','levesund','NuttyRachy','Gamsci','loeschfamily','RubyRubyDues','PawPatrolThomas','sverlaan','thepetersonfinders','Boompa','Jeeper32','PavelZR','airnut','highmaintenance','kareliris','irca','alfabootis','EmileP68','Durango','LFC21','dt07751','jsamundson','Mnbball','Ubbs','HB31','Venezia','fscheerhoorn','d-n','Bambusznad','felixbongers','Gargoyle18','Arendsoog','Theceoiksjes','Hikerdude','Georiffles','netkaloz','bonsaai','Kjasdad','technical13','OBC','deeralemap','Prindlepalooza','Amerod','bearmomscouter','AZJEDI','Pronkrug','Nov64','DeNachtwaker','grafinator','humbird7','dorsetknob','SLP','Tossie','Sunboy','hisaccityiowahere','Nickoes','Grandma03','szipeti','coastingcollins','Skree','geojerry7','wally62','MMG','Florentinka','Albatrozz','Swelpje','annabanana','mrscb','halizwein','linusbi','fionails','c-bn','AlephRita','reej','McAdies','HarQuinzel','Wingnut71','MrsHB31','ivwarrior','Baseballkrazy','Jafo43','mayberryman','bencus05','DO6CC','pilsleyguy','Pyro1970','Paulus2012','Laczy76','Veroni','radschlaeger','Sanli','PAKRee','Shewhofishes','Phorsyte','FRLK','Brazroland','RudiTeam','petertt','Derbstesfrau','halemeister','Derbste','SusiHugo','EnnooHugo','TXTravelers','SoccerGurl','rufnredy','denali0407','BonnieB1','dydy','pooky92','einkilorind','Marijn','Nierenstein','FFM','pritzen','all0123','CzPeet','JuppTenhagen','OHail','Mtbiker64','djeagle','RobS','gelada','MetteS','Zniffer','BoMS','Krogh','JesterAndGranny','nicmar','QueenofDNile','Marnic','RePe','wemissmo','Goldfish67','goldfish72','GrandMasterE','BAJACLAN','StaceyZ','Turtle','MeanderingMonkeys','Elise','TakeruDavis','BartWullems','malof','Meeloper','RUJA','Heinerup','DeLeeuwen','emceeelwee','wakefieldbob','musthavemuzk','NavywifeRN','jfigel','AZBookworm','lynnslilypad','PinkBulldog','dlovegrove','LilCrab','PrincessMeli','utilitymanjoe','balesz','martaska'
                ]
            },
            '2018': {
                'January': [
                    'Gollygeos','Peter1980','Atzepeng84','kagey','JirkaKa','Tossie','Adam848','2mcmacks','HaloBoy2010','markcase','kpr1000','monrose','76CJ7','dorsetknob','Neta','Acknud','EagleDadandXenia','Pollywog','gumpel','fscheerhoorn','fsafranek','ivwarrior','Mojo801','Skree','Mtbiker64','Exnumbersnerd','kodiak62','reej','TheGSA','rayannchick','Jeeper32','pooky92','schnausi','molletje','technical13','GeoCredibles','Marock','cuttingcrew','Chere','Sprinkman','coastingcollins','brawnybear','5Star','Arendsoog','bonsaai','Gargoyle18','petertt','Whatver29','halemeister','einkilorind','geojerry7','paupau','Amerod','J1Huisman','vanislelady','hoekraam','Supervixen','Human01d','Jennbaby82','patrisk','Hmn007','Elmer','stineB','CzPeet','WeLoveDanger','Traycee','lison55','Rubik80','d-n','EmileP68','MariaHTJ','Minerva123','ZAYD','oldmountaineer','PavelZR','Eifulaner','PawPatrolThomas','sverlaan','appeltje32','Nickoes','Chivasloyal','TheCuppFamily','JesterAndGranny','Netkaloz','Batmun','Bambusznad','Brazroland','Marnic','RudiTeam','nicmar','Laczy76','DavidLapage','Tonya209','kareliris','Froggybabe89','Sheila91','Annabanana01','PinkBulldog','Shewhofishes','rynee','GeoHubi','Arendt','HB31','mars00xj','halizwein','Sunboy','DHitz','Leusink','Taz30','scifimom22','irca','Calvertcachers','MeLa','FindersGirl','Poemelke','Gamsci','cvdchiller','BrotherWilliam','bordentaxi','feikjen','felixbongers','HtV','Swelpje','Albatrozz','MrCB','Norbee97','vafarley','bearmomscouter','Pronkrug','hunniees','WandelKuub','Hikerdude','Aukush','mobility','Sanli','AlephRita','Hani7','Veroni','BartWullems','BAJACLAN','mrscb','Amireneemi','tmabrey','levesund','dt07751','DeNachtwaker','Mihul','Krogh','IanZ','highmaintenance','Theceoiksjes','Penfold49','demhackbardt','Zsomborpeto','NativenUK','szipeti','owlsurfer','StaceyZ','roughdraft','3newsomes','RubyRubyDues','Dg25plus','Kulcs','BTamas','rufnredy','c-bn','thepetersonfinders','wally62','MrsHB31','Boompa','balesz','Phorsyte','grafinator','jsamundson','Prindlepalooza','all0123','rabe85','Goldfish67','goldfish72','jfigel','PAKRee','linusbi','alfabootis','Koukyy','Jellybean88','SLP','annabanana','Ly2kw','QueenofDNile','TXTravelers','MeanderingMonkeys','wemissmo','dlovegrove','Pyro1970','denali0407','VampGirl32','krissymonkey','malof','2mctwins2','OHail','2mctwins','Venezia','Merrymunzee','dydy','Pinkeltje','hopsgeneral','PurpleRose4HIM','AgentHop','Trappertje','pritzen','SoccerGurl','NavywifeRN','SuperKoe','Nov64','loeschfamily','AnnaD','deeralemap','Durango','AZJEDI','Mnbball','FFM','DO6CC','Jafo43','FRLK','Karpe12','OBC','radschlaeger','Nierenstein','Lihi80','fionails','gorilla','gelada','djsgriffus','pepsiman','musthavemuzk','Grandma03','Bumpy','Marijn'
                ],
                'February': [
                    'Supervixen','Powerfreak','Taz30','irca','RudiTeam','76CJ7','kareliris','paupau','rayannchick','Jafo43','BrianMoos','Chere','Tossie','Arendt','markcase','Adam848','Peter1980','hoekraam','5Star','RubyRubyDues','nyisutter','FindersGirl','lison55','Laczy76','bordentaxi','Koukyy','feikjen','BAJACLAN','rufnredy','gumpel','Ly2kw','cuttingcrew','monrose','Boompa','geojerry7','hunniees','Karpe12','Nov64','Gollygeos','dt07751','Zsomborpeto','JirkaKa','Norbee97','Fuzzers','jsamundson','Lihi80','Kulcs','Human01d','d-n','Prindlepalooza','Sternenkind','Szegedi','EmileP68','PawPatrolThomas','sverlaan','vafarley','aufbau','Theceoiksjes','schnausi','Brandikorte','PavelZR','Brazroland','Mihul','Pronkrug','mobility','Dg25plus','Amerod','kpr1000','123xilef','Pyro1970','Nickoes','Arendsoog','AlephRita','Zxde','Acknud','appeltje32','GeoCredibles','owlsurfer','EagleDadandXenia','TheGSA','Ovaldas','Albatrozz','Swelpje','jhoning','c-bn','radschlaeger','Hmn007','Nierenstein','PAKRee','derekh','demhackbardt','gelada','Tonya209','WeLoveDanger','thepetersonfinders','tmabrey','FRLK','DavidLapage','kodiak62','Gargoyle18','Poemelke','Veroni','tomtom71','J1Huisman','Minerva123','felixbongers','Staslovtsov','SoccerGurl','AZJEDI','Hikerdude','deeralemap','pritzen','annabanana','HtV','oldmountaineer','WandelKuub','Pinkeltje','redphoenix','Caeserjim','Phorsyte','Shewhofishes','highmaintenance','MrsHB31','PubbE','dorsetknob','Jeeper32','3newsomes','fscheerhoorn','Geoact3','Gamsci','DO6CC','patrisk','HB31','TXTravelers','alfabootis','bencus05','Durango','PurpleRose4HIM','2mctwins2','szipeti','BTamas','MariaHTJ','molletje','Vataomi','StaceyZ','NativenUK','Sunboy','halizwein','grafinator','SuperKoe','all0123','FFM','LiiLuu70','BituX','Batmun','LFC21','2mctwins','Mnbball','Ubbs','loeschfamily','kagey','cvdchiller','alicta','Marock','pooky92','Marnic','nicmar','djeagle','Leusink','Matanome','GeoHubi','stineB','RobS','Florentinka','Goldfish67','TheCuppFamily','coastingcollins','mars00xj','pilsleyguy','Grandma03','Kerzenwelt','rynee','hopsgeneral','MrCB','AgentHop','technical13','fsafranek','CzPeet','vanislelady','dlovegrove','djsgriffus','pepsiman','VampGirl32','MeanderingMonkeys','lynnslilypad','musthavemuzk'
                ],
                'March': [
                    'wally62','sgphotos','scifimom22','76CJ7','5Star','Gollygeos','Ly2kw','Adam848','GeoCredibles','TheGSA','Chere','cvdchiller','Peter1980','monrose','mars00xj','paupau','Acknud','Calvertcachers','EagleDadandXenia','hunniees','halemeister','rufnredy','dt07751','Powerfreak','appeltje32','ivwarrior','BAJACLAN','nyisutter','Koukyy','NativenUK','Albatrozz','Swelpje','Bambusznad','kodiak62','Arendt','Brandikorte','Norbee97','Traycee','kpr1000','Tossie','SLP','OBC','DavidLapage','Tonya209','Arendsoog','dazie62','Matanome','hoekraam','molletje','Sternenkind','feikjen','bordentaxi','allison35','redphoenix','oldmountaineer','wemissmo','denali0407','annabanana','Trappertje','mobility','Zxde','FindersGirl','cuttingcrew','markcase','Jeeper32','Chivasloyal','PAKRee','JustRachel','lison55','patrisk','felixbongers','MariaHTJ','bonsaai','Ovaldas','aufbau','RubyRubyDues','Merrymunzee','Nov64','pritzen','djsgriffus','pepsiman','Jafo43','Karpe12','geojerry7','HtV','Prindlepalooza','AlephRita','Poemelke','irca','kareliris','vafarley','mrscb','Mforrest7','humbird7','fscheerhoorn','WeLoveDanger','Marnic','EoTwP','Aronk76','Taz30','owlsurfer','technical13','Gamsci','HB31','HaloBoy2010','Alggry','tomtom71','Zeppe','c-bn','Duysterstein','gumpel','Dg25plus','Baseballkrazy','Theceoiksjes','musthavemuzk','Durango','jhoning','brawnybear','szipeti','AZJEDI','RobS','2mctwins2','2mctwins','Lihi80','nicmar','Mnbball','Ubbs','loeschfamily','Zsomborpeto','StaceyZ','OHail','dlovegrove','radschlaeger','alfabootis','deeralemap','Pronkrug','Nickoes','ZAYD','linusbi','kanga021','fionails','levesund','Werewulf','schnausi','Brazroland','Hmn007','demhackbardt','EmileP68','123xilef','Adue','utilitymanjoe','Grandma03','mutti','koebes','Tracee74','PawPatrolThomas','sverlaan','Jakuje','fsafranek','thepetersonfinders','Mihul','MrsHB31','highmaintenance','Netkaloz','BTamas','3newsomes','Sprinkman','Kyrandia','dydy','Sunboy','Neta','Skree','Szegedi','1SheMarine','halizwein','LFC21','MrCB','tmabrey','AgentHop','Staslovtsov','rynee','WandelKuub','d-n','Leusink','dorsetknob','SoccerGurl','FRLK','Human01d','Supervixen','DeNachtwaker','Meeloper','Mickyz','JirkaKa','reej','SuperKoe','PavelZR','Rubik80','Marock','Lenyy','hopsgeneral','J1Huisman','Pinkeltje'
                ],
                'April': [
                    'DeNachtwaker','MrCB','Powerfreak','jhoning','Pinkeltje','Jakuje','Human01d','reej','szipeti','Pronkrug','Kabouter','nyisutter','feikjen','FRLK','johanenpaula','linusbi','Theceoiksjes','fionails','levesund','JirkaKa','Luka','Nickoes','monrose','BAJACLAN','Traycee','wemissmo','RubyRubyDues','annabanana','kodiak62','Chere','76CJ7','scifimom22','Amerod','Adam848','bearmomscouter','J1Huisman','Jeeper32','MeLa','GeoCredibles','markcase','Zniffer','FindersGirl','Peter1980','5Star','mrscb','radschlaeger','123xilef','mutti','Poemelke','Sunboy','Atzepeng84','Arendt','Mihul','owlsurfer','paupau','mobility','PavelZR','hoekraam','Nov64','HtV','Elmer','Sternenkind','c-bn','Arendsoog','molletje','OHail','Apollitt','stineB','Hmn007','Calvertcachers','dorsetknob','RUJA','djsgriffus','pepsiman','dt07751','fsafranek','AlephRita','goldfish72','Goldfish67','cvdchiller','1SheMarine','Acknud','koebes','Ichbinderneue','Duysterstein','ZAYD','Kareysue','gumpel','DrentseHooglander','hunniees','Neta','geojerry7','appeltje32','JustRachel','Kyrandia','Tomcache','halemeister','Rubik80','JustMadison','Aukush','Geoact3','Rita85gto','Heinerup','dazie62','oldmountaineer','MrsHB31','dlovegrove','Karpe12','Hikerdude','WandelKuub','schnausi','Karrajan','Chivasloyal','3newsomes','bordentaxi','felixbongers','MariaHTJ','rynee','DHitz','wally62','gelada','cuttingcrew','sverlaan','PawPatrolThomas','EmileP68','rabe85','Bambusznad','TXTravelers','redphoenix','Gollygeos','WeLoveDanger','Bustersblue','nora1','EoTwP','CzPeet','QueenofDNile','Dg25plus','jsamundson','kpr1000','Albatrozz','Swelpje','EagleDadandXenia','2mcmacks','Jennbaby82','Trappertje','tmabrey','Sprinkman','Vataomi','GeoHubi','irca','Things2do','Sanli','Aplainlady','DavidLapage','patrisk','EllieBellie','AZBookworm','AZJEDI','StealthRT','tomtom71','d-n','Lihi80','Veroni','Laczy76','StaceyZ','vafarley','dydy','HB31','Szakica','Attis','Koukyy','Lenyy','aufbau','PurpleRose4HIM','rufnredy','lison55','Nytshaed','einkilorind','Harrie56','BTamas','PAKRee','Taz30','fscheerhoorn','Marock','EarthAngel','Jafo43','Darkharibo','Tossie','Gamsci','mars00xj','pooky92','all0123','Zsomborpeto','kareliris','Netkaloz','Supervixen','Ubbs','Mnbball','loeschfamily','thepetersonfinders','pritzen','RePe','NativenUK','Matanome','Ovaldas','2mctwins2','2mctwins','Adue','deeralemap','Durango','WhisperInTheWind','demhackbardt','SuperKoe','hopsgeneral','AgentHop','Szegedi','Leusink','Elise','Madman2o','MeanderingMonkeys','denali0407'
                ],
                'May': [
                    'cuttingcrew','MariaHTJ','schnausi','Jellybean88','SJ0239917','szipeti','J1Huisman','Gollygeos','mobility','Neta','Chere','5Star','Human01d','JirkaKa','pooky92','owlsurfer','paupau','tmabrey','ahagmann','Mihul','Rollermama','ivwarrior','nyisutter','Aliwolf','Karrajan','levesund','Hanry','Peter1980','Ichbinderneue','c-bn','Norbee97','Tossie','Mieze','netkaloz','gorilla','Adam848','tomtom71','76CJ7','gelada','GeoHubi','SuperKoe','pilsleyguy','PavelZR','hoekraam','Munz619','stineB','Szakica','Lenyy','Poemelke','monrose','markcase','DrentseHooglander','Duysterstein','DavidLapage','gumpel','kareliris','Kyrandia','Tonya209','Rita85gto','AlephRita','reej','molletje','Geodude','Chivasloyal','Mattie','radschlaeger','Zsomborpeto','Marijn','Ovaldas','Fscheerhhorn','Zeppe','Diana1994','WandelKuub','DiSaRu','Meeloper','appeltje32','Leusink','Elise','Krogh','Powerfreak','feikjen','fsafranek','coastingcollins','Bustersblue','Vataomi','lison55','jhoning','OHail','EoTwP','Alggry','dazie62','EagleDadandXenia','Trappertje','GeoCredibles','Sternenkind','ChandaBelle','Zniffer','Heinerup','Wintersturm','redphoenix','LFC21','kodiak62','halizwein','DeNachtwaker','Anni56','Henning49','HtV','Arendsoog','Hikerdude','wally62','patrisk','malof','hugosoft','Nytshaed','Batmun','highmaintenance','Amerod','aufbau','Theceoiksjes','FRLK','Geopaws','Pronkrug','Laczy76','andrewbmbox','piupardo','Gamsci','WiseOldWizard','cvdchiller','DHitz','Zxde','alfabootis','NativenUK','martaska','StaceyZ','JustRachel','halemeister','secretagentbill','kpr1000','Shewhofishes','Albatrozz','123xilef','Venezia','Pinkeltje','Calvertcachers','Phorsyte','WeLoveDanger','Bambusznad','grafinator','Szegedi','Jakuje','CzPeet','RudiTeam','Nickoes','Hmn007','Elmer','Aukush','BituX','koebes','mutti','RubyRubyDues','Acknud','Koukyy','Lihi80','Traycee','EarthAngel','MrCB','mrscb','geojerry7','mars00xj','Lammy','oldmountaineer','dt07751','Taz30','hunniees','JustMadison','Karpe12','vafarley','Dg25plus','jsamundson','all0123','thepetersonfinders','Sanli','Olagorie','3newsomes','Marock','bordentaxi','JazzCat','PAKRee','Balazs80','Geckofreund','WinterCheetah','technical13','irca','Flogni','AnnaD','petertt','TheCuppFamily','HB31','Jafo43','Tlmeadowlark','DO6CC','d-n','Andy69','einkilorind','Matanome','TheFrog','balesz','felixbongers','pritzen','Nov64','Tomcache','deeralemap','Rubik80','2mctwins2','2mctwins','Pyro1970','Swelpje','Marnic','Sprinkman','SvejkKlobasa','RePe','Harrie56','annabanana','nicmar','dorsetknob','Georiffles','Evi','Durango','pulsarxp','bonsaai','Prindlepalooza','Jeeper32','Mnbball','loeschfamily','MrsHB31','MeanderingMonkeys','rabe85','greislige','Attis','RUJA','NavywifeRN','AZBookworm','SoccerGurl','AZJEDI','linusbi','Arendt','djsgriffus','pepsiman','BrianMoos','Kareysue','fionails','Lukyshak','BTamas','BAJACLAN','Sunboy','FFM','Goldfish67','goldfish72','Yida','Ly2kw','rufnredy','Bumpy','Sophia0909','Grandma03','Mojo801','thegorilla23','VampGirl32','dlovegrove','OBC','AgentHop','hopsgeneral','SLP','denali0407','Gargoyle18','amoocow','demhackbardt','derekh','Orky99','wemissmo','Boompa','StealthRT','musthavemuzk','QueenofDNile'
                ],
                'June': [
                    'TheMoonRider','bearmomscouter','markcase','Mieze','3newsomes','Remstaler','vanislelady','Powerfreak','Kyrandia','Chere','c-bn','Sternenkind','Adam848','Felix11','dazie62','greislige','Berti55','Gollygeos','5Star','DrentseHooglander','oldmountaineer','molletje','dt07751','appeltje32','Hmn007','Remstaler','koebes','mutti','radschlaeger','Geckofreund','DHitz','Rita85gto','Peter1980','feikjen','szipeti','Tonya209','DavidLapage','hunniees','Karrajan','Neta','Andy69','Gwendy','HtV','cuttingcrew','Nickoes','paupau','EarthAngel','StaceyZ','Calvertcachers','RubyRubyDues','Rubik80','SJ0239917','patrisk','Vataomi','monrose','gumpel','stineB','Munz619','pooky92','BAJACLAN','aufbau','kpr1000','tmabrey','hoekraam','schnausi','cvdchiller','MariaHTJ','Karpe12','tomtom71','WeLoveDanger','Albatrozz','WandelKuub','owlsurfer','Dg25plus','PawPatrolThomas','sverlaan','mars00xj','EmileP68','Teambobcats','nyisutter','Lihi80','GeoCredibles','thepetersonfinders','halizwein','Kolos2002','mobility','Amerod','Poemelke','bordentaxi','ChandaBelle','Lukyshak','fionails','linusbi','levesund','lison55','halemeister','fsafranek','Acknud','Koukyy','grafinator','fscheerhoorn','Wintersturm','Chivasloyal','WiseOldWizard','QueenofDNile','hopsgeneral','AgentHop','dlovegrove','EagleDadandXenia','StealthRT','pritzen','Nov64','Ubbs','musthavemuzk','Sprinkman','wemissmo','Tlmeadowlark','Jafo43','OHail','wally62','annabanana','reej','denali0407','Kareysue','Sunboy','Leusink','dydy','Mnbball','LFC21','MrCB','mrscb','highmaintenance','BTamas','PAKRee','Trappertje','CzPeet','JirkaKa','2mctwins','2mctwins2','Zsomborpeto','MrsHB31','dorsetknob','HB31','rabe85','GeoHubi','J1Huisman','Pinkeltje','SoccerGurl','Hikerdude','Durango','Netkaloz','AZBookworm','AZJEDI','Bambusznad','geojerry7','Florentinka','Human01d','Matanome','felixbongers','JazzCat','rufnredy','Gamsci','FRLK','vafarley','kodiak62','alfabootis','bencus05','Leve2002','Batmun','deeralemap','redphoenix','Pronkrug','Theceoiksjes'
                ],
                'July': [
                    'Sophia0909','JustMadison','JustRachel','cuttingcrew','kpr1000','schnausi','Mieze','5Star','GeoCredibles','redphoenix','Remstaler','JemmaJ1983','Kareysue','Peter1980','mobility','pooky92','Asusik666','paupau','szipeti','monrose','EagleDadandXenia','dazie62','sfwife','reej','RubyRubyDues','2mcmacks','AZJEDI','Kelkavcvt','Hmn007','Swelpje','Albatrozz','Hikerdude','Phorsyte','Tlmeadowlark','djsgriffus','Shewhofishes','pepsiman','kodiak62','Nickoes','AlephRita','Leve2002','Flogni','WeLoveDanger','SuperKoe','123xilef','RePe','lison55','levesund','Zsomborpeto','allison35','grubsneerg','denali0407','brawnybear','OHail','Adam848','Rubik80','mars00xj','markcase','SJ0239917','Mayoleintje88','gumpel','Mieze','AZBookworm','einkilorind','Aaalv','owlsurfer','appeltje32','fscheerhoorn','BTamas','nyisutter','Gollygeos','Vataomi','GeoHubi','EoTwP','Bustersblue','hunniees','Theceoiksjes','Pronkrug','stineB','Teambobcats','CzPeet','Munz619','Anni56','HtV','dt07751','alaumann','Bordextaxi','all0123','J1Huisman','feikjen','bonsaai','BAJACLAN','jsamundson','WandelKuub','felixbongers','Pinkeltje','pritzen','StewStunner','Karrajan','Minerva123','Netkaloz','Human01d','Wintersturm','jhoning','d-n','PavelZR','Struwel','Sternenkind','ChandaBelle','DrentseHooglander','Gargoyle18','FindersGirl','coastingcollins','SvejkKlobasa','Nierenstein','greislige','irca','kareliris','Poemelke','Mihul','Syrtene','molletje','Acknud','Ichbinderneue','patrisk','mutti','koebes','radschlaeger','rynee','Tomcache','Bambusznad','bearmomscouter','Geckofreund','JirkaKa','Ovaldas','Amerod','hoekraam','Calvertcachers','aufbau','c-bn','rufnredy','mrscb','Chere','Andy69','Promethium','2mctwins','DangerousDon','AgentHop','annabanana','Sternenkind','MaryJaneKitty','technical13','dorsetknob','HB31','BituX','PrincessMeli','Kyrandia','tomtom71','Merrymunzee','dydy','thepetersonfinders','Sprinkman','deeralemap','EmileP68','Zniffer','PawPatrolThomas','sverlaan','Attis','Jafo43','Heinerup','Powerfreak','KobeJasper','NoahCache','Jakuje','Gamsci','Lihi80','76CJ7','MrCB','Claudi','3newsomes','linusbi','fionails','2mctwins2','StaceyZ','alfabootis','wally62','Nov64','Durango','halizwein','DHitz','MrsHB31','Lenyy','grafinator','Ly2kw','goldfish72','rabe85','Marijn','Elise','Leusink','Target13','Liasousa','Batmun','Karpe12','Duysterstein','musthavemuzk','highmaintenance','Sydonkidd','Boompa','taska1981','fsafranek','demhackbardt','Sunboy','DiSaRu','Tossie','Mattie','MariaHTJ','RUJA','Koukyy','Dibcrew','Mnbball','WiseOldWizard','Cidinho','TheCuppFamily','Dg25plus','Krogh','Goldfish67','cvdchiller','FRLK','hopsgeneral','Florentinka','Pyro1970','EarthAngel','Jeeper32','Szakica','loeschfamily','geomatrix','MeanderingMonkey','brilang'
                ],
                'August': [
                    'Chere','Rollermama','Sydonkidd','dazie62','denali0407','CzPeet','Smew','JirkaKa','EarthAngel','KFL200','Laczy76','aufbau','Chivasloyal','Stebu','Mihul','monrose','wemissmo','Target13','airnut','nyisutter','Acknud','Zsomborpeto','Kabouter','levesund','johanenpaula','Sternenkind','Penfold49','Kareysue','RePe','Powerfreak','Ichbinderneue','halemeister','WeLoveDanger','ChandaBelle','Remstaler','Mieze','Human01d','DrentseHooglander','Zniffer','RUJA','ivwarrior','c-bn-bn','Ly2kw','kpr1000','Poemelke','radschlaeger','koebes','mutti','Bliksem26','KobeJasper','patrisk','Peter1980','Brazilia','TinyTrio','Mattie','Gollygeos','Heinerup','Traycee','mobility','grafinator','Veroni','Arendsoog','brawnybear','Bustersblue','MariSH','Szakica','Aniara','rbct109','Karrajan','Fyrsel','Adam848','Kolos2002','SJ0239917','Teambobcats','PurpleRose4HIM','Krogh','Trappertje','Calvertcachers','Bambusznad','reej','Sprinkman','HtV','Tlmeadowlark','bearmomscouter','RubyRubyDues','GeoCredibles','allison35','DangerousDon','HerrNielson','OHail','Geckofreund','Hanry','FrankBroughton','2mcmacks','Phorsyte','Hikerdude','WandelKuub','Shewhofishes','Munz619','Boersentrader','Scarybob222','cuttingcrew','123xilef','taska1981','Leusink','FRLK','dorsetknob','StaceyZ','hoekraam','76CJ7','NoahCache','MariaHTJ','Flogni','ahagmann','2mctwins2','2mctwins','EagleDadandXenia','MsYB','Syrtene','Asusik666','Lihi80','fsafranek','Sanli','Dg25plus','Jellybean88','highmaintenance','Claudi','Mtbiker64','gorilla','Adue','EoTwP','BrianMoos','OBC','SLP','DeLeeuwen','Marock','BituX','lison55','pilsleyguy','TheCuppFamily','technical13','MaryJaneKitty','WinterCheetah','rayannchick','DeNachtwaker','J1Huisman','Pinkeltje','Lukyshak','Pronkrug','Theceoiksjes','brilang','kodiak62','hunniees','Jakuje','Swelpje','Albatrozz','tomtom71','Arendt','dt07751','lostsole68','jsamundson','rufnredy','gelada','DavidLapage','markcase','Rubik80','JustMe','Jafo43','Tonya209','piupardo','cvdchiller','fscheerhoorn','StealthRT','greislige','Liasousa','Cidinho','wally62','Attis','kareliris','irca','jhoning','anski','redphoenix','ANABELLE','5Star','alaumann','Karen2921','Team-MTB-OC','Shaynemarks','Gamsci','MrCB','Netkaloz','Boston2005','dap217','RudiTeam','rabe85','geomatrix','Batmun','Dibcrew','mars00xj','Norbee97','Brandikorte','FromTheTardis','ChinaBulls','MetteS','BoMS','Geodude','grubsneerg','schnausi','gumpel','AnnaD','petertt','Minerva123','Koukyy','paupau','brunosantos','TTFNCACHN','appeltje32','Owl03','Anni56','Tracee74','einkilorind','szipeti','bencus05','alfabootis','Vataomi','Kyrandia','bordentaxi','feikjen','Leve2002','felixbongers','pooky92','Wintersturm','Hmn007','all0123','pepsiman','Taz30','Szegedi','molletje','Ovaldas','owlsurfer','Nickoes','Robelwilson','Volare','Talkie','nicmar','Georiffles','deeralemap','sfwife','annabanana','Durango','malof','demhackbardt','KTMLSE','JazzCat','Sdgal','3newsomes','Vimpula','Aukush','halizwein','DiSaRu','Pyro1970','sverlaan','OldSchoolSkater','Lovelylissa','Kelkavcvt','NavywifeRN','Truewhovian','HB31','mrscb','WiseOldWizard','GeoHubi','stineB','AlephRita','dydy','PawPatrolThomas','EmileP68','Venezia','Boompa','Atzepeng84','DO6CC','PavelZR','Faby','PAKRee','JuppTenhagen','Marnic','vafarley','Neta','pritzen','NativenUK','Gwendy','BAJACLAN','Karpe12','Tomcache','Bungle','d-n','Nov64','thepetersonfinders','EllieBellie','AZBookworm','SoccerGurl','AZJEDI','Matanome','Goldfish67','Mnbball','goldfish72','Ubbs','RobS','Rita85gto','Prindlepalooza','djsgriffus','fionails','Adventuremom','DHitz','Aronk76','loeschfamily','AgentHop','hopsgeneral','dlovegrove','Jeeper32','secretagentbill','MrsHB31','oldmountaineer','FFM','Staslovtsov','prmarks1391','Promethium','rynee','QueenofDNile','amoocow','musthavemuzk'
                ],
                'September': [
                    'Gollygeos','dazie62','jhoning','TTFNCACHN','levesund','Geodude','Krogh','5Star','DavidLapage','Liasousa','Cidinho','molletje','patrisk','kodiak62','MPeters82','Team-MTB-OC','Batmun','Calvertcachers','lostsole68','RMNedrow','Dg25plus','monrose','Norbee97','GeoHubi','Pyro1970','Ovaldas','OBC','markcase','Chivasloyal','KobeJasper','McAdies','highmaintenance','FromTheTardis','EoTwP','SLP','Gamsci','HB31','Jellybean88','mrscb','nyisutter','Laczy76','SDgal','2mcmacks','Sprinkman','Hmn007','lison55','Karen2921','Jeeper32','Nickoes','dt07751','hunniees','GeoCredibles','EagleDadandXenia','Jafo43','Poemelke','geomatrix','ANABELLE','grubsneerg','JustMadison','JustRachel','aufbau','muriabreu','wally62','MrsHB31','Bustersblue','denali0407','LilCrab','WinterCheetah','rayannchick','MaryJaneKitty','technical13','CoalCracker7','secretagentbill','jsamundson','Target13','MrCB','Chere','Nov64','AllyMouse','Hikerdude','WandelKuub','RubyRubyDues','DrentseHooglander','Kareysue','OHail','AZJEDI','fsafranek','Mihul','Dgas71','stineB','Theceoiksjes','Sydonkidd','ivwarrior','kpr1000','Peter1980','Durango','Teambobcats','Pronkrug','c-bn-bn','HtV','BrianMoos','paupau','FRLK','bordentaxi','feikjen','Traycee','BAJACLAN','brunosantos','Ladyl89','dap217','cuttingcrew','NuttyRachy','Leusink','RudiTeam','Szakica','Dibcrew','Bliksem26','mars00xj','brilang','Squonk','Rytmiorkesteri','mobility','appeltje32','Debolicious','TubaDude','76CJ7','halemeister','SJ0239917','rufnredy','FindersGirl','mutti','koebes','radschlaeger','Mayoleintje88','Munz619','Attis','greislige','Netkaloz','TinyTrio','Zxde','annabanana','Minerva123','EarthAngel','Bungle','Kyrandia','Ichbinderneue','Faby','Mtbiker64','SoccerGurl','EllieBellie','NavywifeRN','DaddyOMommyO','Kolos2002','Karrajan','owlsurfer','d-n','Rubik80','Owl03','wemissmo','Andy69','Becca009','Talkie','Volare','Brandikorte','Shewhofishes','Phorsyte','airnut','JazzCat','Tracee74','Marock','PurpleRose4HIM','geojerry7','MariaHTJ','Amerod','StaceyZ','WeLoveDanger','Prindlepalooza','dorsetknob','fionails','Syrtene','JustMe','Ly2kw','redphoenix','einkilorind','Adam848','Bambusznad','bearmomscouter','Mattie','MsYB','all0123','Taz30','RebelGTP','thepetersonfinders','Gargoyle18','Human01d','demhackbardt','OldSchoolSkater','Leve2002','ChandaBelle','2mctwins','Boston2005','linusbi','Lilyvive','pepsiman','Tossie','Karpe12','hoekraam','Stitchy','allison35','WiseOldWizard','Duysterstein','Tbleek79','Lihi80','3newsomes','PavelZR','Atzepeng84','Albatrozz','Kabouter','johanenpaula','airnut','fscheerhoorn','Koukyy','TheCuppFamily','Promethium','Zsomborpeto','AZBookworm','J1Huisman','rabe85','LFC21','hopsgeneral','Goldfish67','AgentHop','RePe','Aslansden','goldfish72','Elise','felixbongers','Claudi','tomtom71','reej','Pinkeltje','Sunboy','Aukush','Penfold49','Tlmeadowlark','Gwendy','Szegedi','SvejkKlobasa','SuperKoe','2mctwins2','djsgriffus','Matanome','alfabootis','Venezia','Marijn','Yida','Sophia0909','Sanli','sunnydae','deeralemap','Kelkavcvt','loeschfamily','rynee','StealthRT'
                ],
                'October': [
                    'zsomborpeto','TTFNCACHN','rabe85','Trappertje','5Star','markcase','GeoCredibles','RubyRubyDues','cuttingcrew','dazie62','BeFi14','bearmomscouter','stineB','Roogles','Dg25plus','Mattie','sdgal','rufnredy','DrentseHooglander','munz619','monrose','Rubik80','Sternenkind','EarthAngel','eotwp','AZJEDI','Faby','Bungle','Chere','Tbleek79','JustRachel','Shewhofishes','Phorsyte','reej','Powerfreak','Team-MTB-OC','karrajan','RePe','OHail','MPeters82','TheGSA','76CJ7','gelada','Atzepeng84','pepsiman','mobility','stebu','redphoenix','Peter1980','brilang','Dibcrew','FindersGirl','Lilyvive','J1Huisman','Nexus69','gwendy','Bustersblue','lison55','Calvertcachers','aufbau','Lihi80','Target13','tomtom7','SpySmurf','levesund','Kareysue','WeLoveDanger','Pinkeltje','Bambusznad','Ancs','Gollygeos','McAdies','Karpe12','molletje','humbird7','Liasousa','Cidinho','Sprinkman','Amerod','schnausi','Hmn007','Mnbball','Teambobcats','Jafo43','owlsurfer','Andy69','becca009','paupau','HtV','kelkavcvt','Nickoes','highmaintenance','fsafranek','jsamundson','kpr1000','dorsetknob','Minerva123','Buckeyecacher111','secretagentbill','EagleDadandXenia','kodiak62','DHitz','JirkaKa','appeltje32','bordentaxi','feikjen','c-bn','koebes','KobeJasper','hoekraam','AlephRita','2mctwins2','mars00xj','tomtom71','Promethium','Pyro1970','Leusink','Elise','mutti','Henning49','anni56','Zniffer','d-n','szegedi','boompa','FromTheTardis','mrscb','allison35','Stitchy','kareliris','benotje','Adam848','123xilef','Poemelke','irca','szipeti','sverlaan','PawPatrolThomas','denali0407','Squonk','DaddyOMommyO','MrsHB31','hunniees','dt07751','Ubbs','PRINDLEPALOOZA','SJ0239917','EmileP68','RoseSquirrel','bazfum','nyisutter','brawnybear','Luuk','HB31','wally62','geomatrix','JazzCat','ichbinderneue','mayoleintje88','mayberryman','schuch22','ANABELLE','QueenofDNile','Nov64','all0123','Marijn','Chivasloyal','remstaler','Mieze','MariaHTJ','fionails','Sophia0909','Traycee','Mijs','SvejkKlobasa','thepetersonfinders','wemissmo','deeralemap','Kyrandia','pritzen','yida','wintersturm','Albatrozz','gumpel','CzPeet','Attis','AZBookworm','cvdchiller','matanome','Hikerdude','WandelKuub','fscheerhoorn','djsgriffus','Boston2005','Pronkrug','Theceoiksjes','greislige','sagabi','lynnslilypad','grubsneerg','Marnic','SuperKoe','annabanana','PavelZR','AgentHop','Koukyy','patrisk','JustMe','mihul','Human01d','Durango','MsYB','RMNedrow','ChandaBelle','hopsgeneral','Georiffles','SydonKidd','dlovegrove','dabecks','utilitymanjoe','MrCB','Ladyl89','felixbongers','Jakuje','teamsturms','nuttynan','GeoHubi','SoccerGurl','szakica','StaceyZ','loeschfamily','BAJACLAN','2mctwins','EllieBellie','DragonSlayer500','fuzzers','WinterCheetah','MaryJaneKitty','technical13','lostsole68','musthavemuzk','vafarley','StealthRT'
                ],
                'November': [
                    'Amerod','dorsetknob','Ancs','Netkaloz','Bambusznad','soderhallen','wondermunz','wintersturm','AZJEDI','Georiffles','AZBookworm','EllieBellie','SoccerGurl','kelkavcvt','EarthAngel','highmaintenance','TheJackaroo','Faby','Ladyl89','musthavemuzk','EarthAngel','dlovegrove','QueenofDNile','Thegenie18','AmyJoy','fionails','linusbi','levesund','ol0n0lo','Noisette','LFC21','Merrymunzee','thepetersonfinders','MrsHB31','mayoleintje88','HB31','annabanana','wemissmo','WinterCheetah','rayannchick','MaryJaneKitty','technical13','pritzen','Sophia0909','yida','JazzCat','EagleDadandXenia','Brandikorte','grubsneerg','Roogles','dombaumeister','fyrsel','CupcakeQueen','hunniees','PapaBuck21','Buckeyecacher111','xwusel','EmileP68','PawPatrolThomas','sverlaan','becca009','Attis','molletje','FizzleWizzle','Roeddk','Swelpje','Albatrozz','WiseOldWizard','Nov64','Hmn007','TXTravelers','denali0407','PRINDLEPALOOZA','Mattie','Olivetree','Kermit450','WandelKuub','Hikerdude','3newsomes','2mctwins2','2mctwins','Debolicious','Kcsilvia','Andy69','Atzepeng84','karrajan','JuppTenhagen','deeralemap','Pronkrug','kpr1000','markcase','MariaHTJ','mars00xj','dabecks','Chivasloyal','BituX','fscheerhoorn','caribus','pilsleyguy','greislige','janbso','DrentseHooglander','Lukyshak','Bungle','kodiak62','WeLoveDanger','Shewhofishes','Phorsyte','munz619','Ivivila','fsafranek','jsamundson','Sprinkman','StaceyZ','hilja','irca','Werewulf','felixbongers','piupardo','GolemCZ','sdgal','Catcachn','76CJ7','Jafo43','stebu','Liasousa','Cidinho','BTamas','demhackbardt','alfabootis','Venezia','bencus05','sohcah','JustRachel','PavelZR','goldfish72','Goldfish67','DaddyOMommyO','Duysterstein','malof','Human01d','patrisk','matanome','dap217','Marijn','Elise','Leusink','mrscb','MrCB','Mijs','Luuk','FromTheTardis','Poemelke','rabe85','Gamsci','J1Huisman','Pinkeltje','hoekraam','forbidden72','TTFNCACHN','Bustersblue','Jakuje','Adue','FRLK','gelada','Karpe12','barefootguru','BGB','lison55','BAJACLAN','The8re','rufnredy','HarQuinzel','kareliris','Dg25plus','GeoCredibles','KFL200','Teambobcats','kali32891','Bliksem26','KobeJasper','allison35','Stitchy','GrandMasterE','2mcmacks','cuttingcrew','Scarybob222','nyisutter','TrickiVick','sagabi','d-n','airnut','5Star','c-bn','szipeti','Powerfreak','rita85gto','paupau','monrose','Adam848','McAdies','Gollygeos','SydonKidd','tomtom7','teamsturms','vataomi','MPeters82','Rubik80','geojerry7','gumpel','SJ0239917','tomtom71','Koukyy','Pyro1970','geomatrix','Theceoiksjes','SuperKoe','lynnslilypad','sunnydae','Peter1980','OHail','appeltje32'
                ],
                'December': [
                    'Zniffer','Albatrozz','Andy69','Attis','Behr47','GeoHubi','stineB','greislige','lostsole68','mtbiker64','MrCB','ChandaBelle','SuperKoe','JustMe','leve2002','dt07751','Norbee97','MariaHTJ','DiSaRu','Tossie','Florentinka','pritzen','Dibcrew','Promethium','tlmeadowlark','caribus','Rytmiorkesteri','TrickiVick','Ancs','DeLeeuwen','hunniees','Duysterstein','Liasousa','FrankBroughton','Cidinho','JustRachel','szegedi','Steffi78','Rubik80','Gamsci','Ubbs','Mnbball','loeschfamily','Nierenstein','TheFatCats','soderhallen','TheFrog','RudiTeam','vafarley','radioscout','CzPeet','Orky99','KobeJasper','matanome','Pyro1970','PAKRee','RePe','Tracee74','dabecks','wally62','d-n','zoekix','Adue','MetteS','BoMS','ivwarrior','PRINDLEPALOOZA','StealthRT','lynnslilypad','hopsgeneral','AgentHop','SLAUGY','musthavemuzk','amoocow','CoalCracker7','gorilla','utilitymanjoe','Aniara','Taz30','WhisperInTheWind','Durango','BrianMoos','Venezia','wowieann','GolemCZ','Munzeehunter101','Stitchy','allison35','Boston2005','demhackbardt','pilsleyguy','mrscb','pepperino','gargoyle18','Marock','alfabootis','zsomborpeto','Arendt','orgawan','Supervixen','deeralemap','djsgriffus','pepsiman','Sunboy','Sophia0909','yida','EagleDadandXenia','MrsHB31','BAJACLAN','StewStunner','HB31','schnausi','Jennbaby82','WinterCheetah','rayannchick','MaryJaneKitty','technical13','fscheerhoorn','Twinkel','Team-MTB-OC','wondermunz','wemissmo','Buckeyecacher111','becca009','Goldfish67','goldfish72','Elise','SydonKidd','DrentseHooglander','Flogni','mihul','PrincessMeli','molletje','xlud','JazzCat','DisneyGirl','RubyRubyDues','brilang','sohcah','vataomi','AZJEDI','mars00xj','Karpe12','einkilorind','Werewulf','Jafo43','Bungle','NietErVoor','dombaumeister','szakica','prmarks1391','wakefieldbob','StaceyZ','ichbinderneue','koebes','radschlaeger','Bambusznad','ol0n0lo','Ovaldas','AmyJoy','Nexus69','MsYB','HarQuinzel','tmabrey','GrandMasterE','Kyrandia','Lumen','Henning49','anni56','Laczy76','Veroni','Heinerup','Lihi80','EarthAngel','BGB','Shigoist','NuttyRachy','J1Huisman','aufbau','Koukyy','shaynemarks','c-bn','mutti','Kolos2002','Jeeper32','grafinator','Pinkeltje','2mctwins2','2mctwins','grubsneerg','brazroland','Luuk','Poemelke','Mijs','Brandikorte','Human01d','FRLK','WeLoveDanger','rufnredy','Felix11','Debolicious','Aukush','vanislelady','highmaintenance','LFC21','highmaintenance','nicmar','Marnic','fsafranek','appeltje32','Chameleon42','linusbi','fionails','levesund','JirkaKa','Tbleek79','alicta','TheJackaroo','halemeister','monrose','RoseSquirrel','AslansDen','FromTheTardis','karrajan','Wekivamom','Peter1980','geojerry7','markcase','OHail','Roogles','TTFNCACHN','nyisutter','Noisette','remstaler','dazie62','kpr1000','humbird7','5Star','mobility','Kcsilvia','mayoleintje88','Chere','Trappertje','Bustersblue','Netkaloz','Hikerdude','rita85gto','Thegenie18','smew','Atzepeng84','McAdies','gelada','Leusink','lison55','Calvertcachers','kodiak62','Target13','SJ0239917','Chivasloyal','Jellybean88','FindersGirl','annabanana','all0123','QueenofDNile','malof','GeoCredibles','Mieze','Krogh','barefootguru','FizzleWizzle','MPeters82','redphoenix','denali0407','Squonk','Sprinkman','stebu','Kermit450','jsamundson','DHitz','patrisk','Nickoes','dorsetknob','DaddyOMommyO','Minerva123','WiseOldWizard','PawPatrolThomas','sverlaan','Dg25plus','Arendsoog','Gollygeos','Teambobcats','Brazilia','TinyTrio','123xilef','Kareysue','Adam848','reej','bordentaxi','feikjen','Theceoiksjes','WandelKuub','Batmun','asusik666','Hmn007','EmileP68','cvdchiller','pulsarxp','schwester69','Mattie','kali32891','Pronkrug','sagabi','paupau','teamsturms','Powerfreak','3newsomes','Catcachn','sdgal','Phorsyte','Sanli','felixbongers','halizwein','Jansszenn','Marijn','Amerod','wintersturm','eotwp','munz619','Traycee','hoekraam','76CJ7','rabe85','Nov64','Jakuje','irca','owlsurfer','benotje','tomtom71','cuttingcrew','szipeti','Olivetree','Sternenkind','hilja','gumpel','kareliris','Shewhofishes','HtV','AlephRita'
                ]
            },
            '2019': {
                'January': [
                    'allison35','humbird7','2mctwins2','gorilla','Adam848','geojerry7','Kermit450','caribus','FizzleWizzle','MrsHB31','fionails','linusbi','levesund','Hmn007','nicmar','Gamsci','Marnic','pritzen','xwusel','deeralemap','DHitz','tomtom71','GeoHubi','stineB','2mcmacks','Jeeper32','nyisutter','Amerod','irca','mrscb','wally62','brazroland','Thegenie18','Zniffer','RUJA','dt07751','annabanana','vafarley','Reart','thepetersonfinders','rufnredy','patrisk','koebes','felixbongers','Georiffles','gelada','feikjen','Mijs','Luuk','Poemelke','kareliris','pulsarxp','highmaintenance','wemissmo','loeschfamily','boompa','RePe','Mux','halizwein','Nov64','Batmun','StaceyZ','bearmomscouter','tlmeadowlark','Liasousa','Lylmik','Cidinho','EarthAngel','fsafranek','Durango','cvdchiller','djsgriffus','pepsiman','Lihi80','Tibibacsi','TheCuppFamily','Faby','rosieree','Sophia0909','yida','Leusink','Duysterstein','FromTheTardis','greislige','Buckeyecacher111','Attis','JackSparrow','ChickenRun','szakica','FNS','matanome','reej','SuperKoe','TheFatCats','mihul','monty1961','hilja','zsomborpeto','habu','mrsg9064','bordentaxi','Dg25plus','Belinha','ChandaBelle','Belita','grubsneerg','Stitchy','JustMe','BAJACLAN','Ladyl89','d-n','2mctwins','demhackbardt','sverlaan','EmileP68','Boston2005','rabe85','Shigoist','Arendsoog','PawPatrolThomas','appeltje32','StealthRT','schuch22','Sanli','Cwir','Gollygeos','Henning49','anni56','sohcah','DiSaRu','Tossie','QueenofDNile','Marock','lynnslilypad','sunnydae','MeanderingMonkeys','BGB','AZJEDI','CzPeet','kelkavcvt','mutti','ichbinderneue','szipeti','MeLa','kodiak62','RubyRubyDues','Jerzee','Peter1980','EagleDadandXenia','5Star','brilang','xlud','Atzepeng84','SJ0239917','Chere','TTFNCACHN','monrose','J1Huisman','Pinkeltje','Human01d','Veroni','Noisette','molletje','Laczy76','alaumann','Nexus69','barefootguru','lison55','CoalCracker7','Jafo43','spdx2','aufbau','Bewrightback','Arendt','redphoenix','SLP','OBC','Trappertje','Theceoiksjes','Powerfreak','Team-MTB-OC','Bambusznad','owlsurfer','paupau','Minerva123','denali0407','kpr1000','StewStunner','OHail','Calvertcachers','h0tdog','Roogles','roughdraft','lostsole68','Chivasloyal','zork','Adue','Jakuje','markcase','jsamundson','dazie62','TrickiVick','FindersGirl','FindDeezee','SLAUGY','Geodude','schnausi','Target13','Lilyvive','ol0n0lo','TTFNCACHN','Mattie','gumpel','Sternenkind','Bungle','cuttingcrew','Scarybob222','HtV','PRINDLEPALOOZA','TheFrog','123xilef','Karpe12','rita85gto','Jerseyjulie','JerseyGeocacher','mobility','Lumen','Nickoes','DaddyOMommyO','Hawk','WeLoveDanger','TheRealKevin','MrCB','DrentseHooglander','NietErVoor','fscheerhoorn','vataomi','karrajan','orgawan','Aukush','RudiTeam','dombaumeister','wintersturm','KobeJasper','Tbleek79','MPeters82','Bustersblue','TheJackaroo','teamsturms','prmarks1391','Aniara','Kyrandia','radschlaeger','AlephRita','sagabi','Section42','eotwp','sdgal','Koukyy','Phorsyte','Shewhofishes','WandelKuub','Hikerdude','hoekraam','Andy69','becca009','Pronkrug','Debolicious','JazzCat','BituX','all0123','Teambobcats','stebu','hunniees','Rubik80','Twinkel','MariaHTJ','tmabrey','c-bn','Albatrozz','mars00xj','MsYB','YankaBucs','munz619','GolemCZ'
                ],
                'February': [
                    'karrajan','highmaintenance','Jennbaby82','FromTheTardis','klc1960','stebu','Noisette','markcase','Albatrozz','Team-MTB-OC','FindDeezee','Dazzle007','c-bn','mutti','radschlaeger','koebes','Peter1980','schuch22'
                ],
                'March': [
                ],
                'April': [
                ],
                'May': [
                ],
                'June': [
                ],
                'July': [
                ],
                'August': [
                ],
                'October': [
                ],
                'November': [
                ],
                'December': [
                ]
            }
        };
        const arrBetaTesters = [
            '76CJ7', 'Aukush', 'Attis', 'Bowlr', 'Brandikorte',
            'BrianMoos', 'coachV', 'crawil', 'CrossedAnchors', 'daddyof5greatkids',
            'daysleeperdot', 'EagleDadandXenia', 'Food', 'Gomphus', 'hksfarm',
            'J1Huisman', 'JacquesC', 'ly2kw', 'malof', 'mars00xj',
            'matanome', 'MrCB', 'mtbiker64', 'Noisette', 'nuttynan',
            'OldSchoolSkater', 'q22q17', 'quasar', 'RebelGTP', 'RePe',
            'RUJA', 'rynee', 'SgtMikal', 'technical13', 'The8re',
            'Theceoiksjes', 'TheMachman', 'tmabrey', 'Traveler97', 'Zniffer'
        ];
        const objDefaultAvatars = {
            dormant: 'https://munzee.global.ssl.fastly.net/images/pins/flsuncoastpiratefeast.png',
            inactive: 'https://munzee.global.ssl.fastly.net/images/pins/zombieoutbreak2018.png'
        };

        if ( objParentHeading[ 0 ].getElementsByClassName( 'avatar-username' )[ 0 ] ) {
            var domAvatarUsername = objParentHeading[ 0 ].getElementsByClassName( 'avatar-username' )[ 0 ];
            domContainer.appendChild( domAvatarUsername );
        }
        if ( objParentHeading[ 0 ].getElementsByClassName( 'avatar-send-message' )[ 0 ] ) {
            var domMessageMe = objParentHeading[ 0 ].getElementsByClassName( 'avatar-send-message' )[ 0 ];
            domContainer.appendChild( domMessageMe );
        }

        var arrWinnerVC = [];
        for ( let year in objWinnersVC ) {
            for ( let month in objWinnersVC[ year ] ) {
                if ( objWinnersVC[ year ][ month ].indexOf( strPlayerName ) !== -1 ) {
                    if ( isDebug && intVerbosity >= 3 ) {
                        console.log( scriptName + ': %s was found in objWinnersVC[ \'%s\' ][ \'%s\' ] at index %d', strPlayerName, year, month, objEntrantVC[ year ][ month ].indexOf( strPlayerName ) );
                    }
                    arrWinnerVC.push( month + ', ' + year );
                    if ( isDebug && intVerbosity >= 3 ) {
                        console.log( scriptName + ': Added %s, %s to arrWinnerVC', month, year );
                    }
                }
            }
        }
        if ( isDebug && intVerbosity >= 2 ) { console.log( '%s: arrWinnerVC: %o', scriptName, arrWinnerVC ); }
        if ( arrWinnerVC.length > 0 ){
            var domWinnerVC = createVC( 'https://munzee.global.ssl.fastly.net/images/new_badges/small/goldenunicorn.png' );
            domWinnerVC.title = arrWinnerVC.join( String.fromCharCode( 13 ) );
            if ( isDebug && intVerbosity >= 2 ) { console.log( scriptName + ': ' + domWinnerVC ); }
            domContainer.appendChild( domWinnerVC );
        }

        var arrEnteredVC = [];
        for ( let year in objEntrantVC ) {
            for ( let month in objEntrantVC[ year ] ) {
                if ( objEntrantVC[ year ][ month ].indexOf( strPlayerName ) !== -1 ) {
                    if ( isDebug && intVerbosity >= 3 ) {
                        console.log( scriptName + ': %s was found in objEnterantVC[ \'%s\' ][ \'%s\' ] at index %d', strPlayerName, year, month, objEntrantVC[ year ][ month ].indexOf( strPlayerName ) );
                    }
                    arrEnteredVC.push( month + ', ' + year + ( objWinnersVC[ year ][ month ].indexOf( strPlayerName ) !== -1 ? ' *' : '' ) );
                    if ( isDebug && intVerbosity >= 3 ) {
                        console.log( scriptName + ': Added %s, %s to arrEnteredVC', month, year );
                    }
                }
            }
        }
        if ( isDebug && intVerbosity >= 2 ) { console.log( '%s: arrEnteredVC: %o', scriptName, arrEnteredVC ); }
        if ( arrEnteredVC.length > 0 ){
            var domEnteredVC = createVC( 'https://munzee.global.ssl.fastly.net/images/new_badges/small/videocontest.png' );
            domEnteredVC.title = arrEnteredVC.join( String.fromCharCode( 13 ) );
            if ( isDebug && intVerbosity >= 2 ) { console.log( scriptName + ': ' + domEnteredVC ); }
            domContainer.appendChild( domEnteredVC );
        }

        var objTitleHolder = objParentHeading[ 0 ].getElementsByTagName( 'span' )[ 0 ];
        var arrTitleSpans = Array.from( objTitleHolder.getElementsByClassName( 'title-badge' ) );
        var arrTitles = [];
        arrTitleSpans.forEach( function( tb ){ arrTitles.push( tb.innerText ); } );

        if ( arrDiscordians.indexOf( strPlayerName ) !== -1 ) {
            arrTitles.push( 'Discordian' );
        }
        if ( arrBetaTesters.indexOf( strPlayerName ) !== -1 ) {
            arrTitles.push( 'Beta Tester v4.0' );
        }
        if ( objSavedTitles[ strPlayerName ] ) {
            objSavedTitles[ strPlayerName ].forEach( function( title ) {
                arrTitles.push( title );
            } );
        }
        arrTitles.sort().forEach( function( title ) {
            domTitleSpan.appendChild( domTextNode.cloneNode() );
            domTitleSpan.appendChild( createTitle( title ) );
        } );
        domContainer.appendChild( domTitleSpan );

        if ( isDebug && intVerbosity >= 2 ) { console.log( '%s: isDefaultAvatar: %s\nTitles: %o', scriptName, isDefaultAvatar, arrTitles ); }
        if ( isDefaultAvatar ) {
            if ( arrTitles.indexOf( 'Dormant' ) !== -1 ) {
                strPlayerAvatar.value = objDefaultAvatars.dormant;
            }
            else if ( arrTitles.indexOf( 'Inactive' ) !== -1 ) {
                strPlayerAvatar.value = objDefaultAvatars.inactive;
            }
        }

        if ( objParentHeading[ 0 ].getElementsByClassName( 'premium' )[ 0 ] ) {
            var domPremium = objParentHeading[ 0 ].getElementsByClassName( 'premium' )[ 0 ];
            domContainer.appendChild( domPremium );
        }

        if ( objParentHeading[ 0 ] ) {
            if ( isDebug && intVerbosity >= 1 ) { console.log( scriptName + ': New HTML code: %o', domContainer ); }
            objParentHeading[ 0 ].parentNode.replaceChild( domContainer, objParentHeading[ 0 ] );
        } else {
            console.warn( scriptName + ': Unable to find the appropriate place to add titles: ' + arrTitles );
        }
    }
} )();