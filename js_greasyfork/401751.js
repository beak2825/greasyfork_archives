// ==UserScript==
// @name deking2
// @version 1.0.0
// @author Arekino, Beruska a Prisnak
// @description DE King 2
// @match https://www.darkelf.cz/*
// @match http://deficurky.detimes.cz/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_addStyle
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://unpkg.com/vm.shortcut
// @namespace https://greasyfork.org/users/322976
// @downloadURL https://update.greasyfork.org/scripts/401751/deking2.user.js
// @updateURL https://update.greasyfork.org/scripts/401751/deking2.meta.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/data/local-storage-data-provider.ts
// Prefix our localStorage keys to avoid possible conflicts
// with other scripts.
const prefixKey = (key) => `DEKing2_${key}`;
class LocalStorageDataProvider {
    constructor() {
        this.save = (key, value) => {
            try {
                unsafeWindow.localStorage.setItem(prefixKey(key), JSON.stringify(value));
            }
            catch (error) {
                console.error(`Failed to save ${key} to localStorage.`, error);
            }
        };
        this.load = (key) => {
            try {
                return JSON.parse(unsafeWindow.localStorage.getItem(prefixKey(key)));
            }
            catch (error) {
                console.error(`Failed to load ${key} from localStorage.`, error);
            }
        };
        this.delete = (key) => {
            try {
                unsafeWindow.localStorage.removeItem(prefixKey(key));
            }
            catch (error) {
                console.error(`Failed to delete ${key} from localStorage.`, error);
            }
        };
    }
}

// CONCATENATED MODULE: ./src/lib/interfaces.ts
// Define the shared interfaces here
// prefix them with I
var MapType;
(function (MapType) {
    MapType[MapType["Classic"] = 0] = "Classic";
    MapType[MapType["K"] = 1] = "K";
    MapType[MapType["S"] = 2] = "S";
    MapType[MapType["M"] = 3] = "M";
})(MapType || (MapType = {}));

// CONCATENATED MODULE: ./src/db/lands-db.ts
// This LANDS db is already minimized in size. Each record has either [cz] or [cz,sk] array of values. Some land names are same names in both languages. 
// The English variant is ignored.
const LANDS_CLASSIC = JSON.parse(`{"1":["Horní val","Horný val"],"2":["Severní kopce","Severné kopce"],"3":["Větrná step","Veterná step"],"4":["Bystřina","Bystrina"],"6":["Stará hláska"],"7":["Diamantový vrch"],"8":["Záhoří","Záhorie"],"9":["Doubov","Dubov"],"10":["Vrchovina"],"12":["Ohnivá hora"],"13":["Velín"],"14":["Železné doly","Železné bane"],"15":["Horní cesta","Horná cesta"],"16":["Sokolí hory","Sokolie hory"],"17":["Zapovězená svatyně","Zakázaná svätyňa"],"19":["Koňská pláň","Konská pláň"],"20":["Pustý kraj"],"21":["Elfí osada","Elfia osada"],"22":["Západní přístav","Západný prístav"],"23":["Staré obětiště","Staré obetisko"],"24":["Jílovsko","Ílovisko"],"25":["Podhradí","Podhradie"],"26":["Hradiště","Hradisko"],"28":["Skřetí řeka","Škretia rieka"],"29":["Zelené pláně","Zelené pláne"],"30":["Osada zbrojířů","Osada zbrojárov"],"31":["Černý Les","Čierny les"],"32":["Dračí skon"],"33":["Krvavá pláň"],"34":["Jezero rusalek","Jazero rusaliek"],"36":["Přímořsko","Prímorsko"],"37":["Umrlčí pahorky","Umrlčie pahorky"],"38":["Zlatý důl","Zlatá baňa"],"39":["Bažiny smutku","Bažiny smútku"],"40":["Říše středu","Ríša stredu"],"41":["Opatství","Opátstvo"],"42":["Elfí louky","Elfie lúky"],"44":["Vlčí doupata","Vlčie dúpätá"],"46":["Chrám smrti"],"47":["Bludná zem"],"48":["Malý hvozd","Malá húšťava"],"49":["Labutí prameny","Labutie pramene"],"50":["Lesní obětiště","Lesné obetisko"],"51":["Strážnice","Strážnica"],"52":["Pramen osudu","Prameň osudu"],"54":["Jezerní věž","Jazerná veža"],"55":["Skřetí jeskyně","Škretia jaskyňa"],"56":["Průsmyk","Priesmyk"],"57":["Pustá Tvrz","Pustá pevnosť"],"58":["Kupecké přístavy","Kupecké prístavy"],"59":["Královský důl","Kráľovská baňa"],"60":["Chlístov"],"61":["Koňské statky","Konské statky"],"63":["Hrzov","Hrdzov"],"64":["Jezerní hranice","Jazerná hranica"],"65":["Čarodějná hláska","Čarodejná hláska"],"66":["Země Dark Elfa","Zem Dark Elfa"],"67":["Země horalů","Zem horalov"],"68":["Květinová pole","Kvetinové pole"],"69":["Rug Tharsis"],"70":["Jezerní přístav","Jazerný prístav"],"71":["Medvědín","Medveďov"],"72":["Ania el Arin"],"73":["Morrt Inmon"],"74":["Zlaté skály","Zlaté skaly"],"75":["Země koruny","Zem koruny"],"76":["Osada kovářů","Osada kováčov"],"77":["Trollí vrchy","Trollie vrchy"],"78":["Zakletá mohyla","Zakliata mohyla"],"79":["Trpasličí doly","Trpasličie bane"],"80":["Skalní město","Skalné mesto"],"81":["Ďáblova hora","Diablova hora"],"82":["Klášter Lin","Kláštor Lin"],"83":["Vlčí step","Vlčia step"],"84":["Tir Mon"],"85":["Vinice"],"86":["Kouzelný les","Kúzelný les"],"87":["Jezerní království","Jazerné kráľovstvo"],"88":["Inmonis"],"89":["Palmová oáza"],"90":["Větrný dvorec","Veterný dvorec"],"91":["Kemen an Rin"],"92":["Strážný les","Strážny les"],"93":["Hraniční poušť","Hraničná púšť"],"94":["Hlídka nomádů","Hliadka nomádov"],"95":["Morrtis"],"96":["Mrtvá poušť","Mŕtva púšť"],"97":["Osada nomádů","Osada nomádov"],"98":["Země mnichů","Zem mníchov"],"99":["Město lesních elfů","Mesto lesných elfov"],"100":["Eridan Teos"],"101":["Var el Rug"],"102":["Hranice nomádů","Hranica nomádov"],"103":["Orlí pevnost","Orlia pevnosť"],"104":["Klášterní výspa","Kláštorná strážnica"],"105":["Ledová zátoka","Ľadová zátoka"],"106":["Země bohatýrů","Zem bohatierov"],"107":["Trpasličí hory","Trpasličie hory"],"108":["Šedé hory"],"109":["Severní spoušť","Severná spúšť"],"110":["Soumračné vrchy","Súmračné vrchy"],"111":["Kraj obrů","Kraj obrov"],"112":["Černokněžnická říše","Černokňažnícka ríša"],"113":["Temný hvozd","Temná húština"],"114":["Divočina"],"115":["Modré hory"],"116":["Osamělá hora","Osamelá hora"],"117":["Železné hory"],"118":["Hůrecko","Hôrecko"],"119":["Údolí elfů","Údolie elfov"],"120":["Jezero divochů","Jazero divochov"],"121":["Elfí přístavy","Elfské prístavy"],"122":["Kraj půlčíků","Kraj hobitov"],"123":["Elfí les"],"124":["Bitevní pláň","Bojová pláň"],"125":["Větrný kraj","Veterný kraj"],"126":["Železná věž","Železná veža"],"127":["Vyprahlá zem","Vyprahnutá zem"],"128":["Popelavé hory","Popolavé hory"],"129":["Vřesoviště","Vresovisko"],"130":["Země koní","Zem koní"],"131":["Země stínů","Zem tieňov"],"132":["Dlouhopolsko","Dlhopolsko"],"133":["Mořské království","Morské kráľovstvo"],"134":["Země králů","Zem kráľov"],"135":["Jižní cesta","Južná cesta"],"136":["Východní Jihozemsko","Východné Juhozemsko"],"137":["Západní Jihozemsko","Západné Juhozemsko"],"204":["Gal Jint"],"205":["Arcad Mon"],"206":["Salkan"],"207":["Galhad"],"208":["Východní podhůří","Východné podhorie"],"209":["Vlčí zem","Vlčia zem"],"210":["Západní podhůří","Západné podhorie"],"211":["Oriel Jint"],"212":["Eridanis"],"213":["Srdce pouště","Srdce púšte"],"214":["Aisha"],"215":["Kameny duchů","Kamene duchov"],"216":["Osada"],"217":["Šedý klášter","Šedý kláštor"],"218":["Anshar"],"219":["Arrhad"],"220":["Pustina"],"221":["Belnor"],"222":["Hadí hrob"],"223":["Měsíční věž","Mesačná veža"],"224":["Kan el osir"],"225":["Vraní věž","Vrania veža"],"226":["Krinor"],"227":["Skřetí doupata","Škretie dúpätá"],"228":["Vyprahlé tábořiště","Vyprahnuté táborisko"],"229":["Bílá věž","Biela veža"],"230":["Dahakan"],"237":["Úrodné pláně","Úrodné pláne"],"238":["Kamenný úvoz"],"239":["Zátoka korzárů","Zátoka Korzárov"],"240":["Skrytý klášter","Skrytý kláštor"],"241":["Skřetí stezka","Škretia cesta"],"242":["Skřetí doly","Škretie bane"],"243":["Til Man"],"244":["Lužina"],"245":["Obří vodopády","Obrie vodopády"],"246":["Arratan"],"247":["Jižní přístav","Južný prístav"],"248":["Ostrov korzárů","Ostrov korzárov"],"249":["Údolí ďábla","Údolie diabla"],"250":["Ledrie","Ledria"],"251":["Ania el Sor"],"252":["Medvědí pevnost","Medvedia pevnosť"],"253":["Vilmon"],"254":["Loděnice","Lodenica"],"255":["Gurmond"],"256":["Antenor"],"257":["Grim Leor"],"258":["Jižní cíp","Južný cíp"],"259":["Střežený průsmyk","Strážený priesmyk"],"260":["Osiris"],"261":["Ledová soutěska","Ľadová tiesňava"],"262":["Vodní pevnost","Vodná pevnosť"],"263":["Stezky bloudění","Cesty blúdenia"],"264":["Svatý strom","Svätý strom"],"265":["Sídlo alchymistů","Sídlo alchymistov"],"266":["Velký močál","Veľký močiar"],"267":["Elfí planiny","Elfie planiny"],"268":["Věž poznání","Veža poznania"],"269":["Mohylový les"],"270":["Rašeliniště","Rašelinisko"],"271":["Mrtvý les","Mŕtvy les"],"272":["Citadela Temnoty"],"273":["Khelek ledr"],"274":["Vřesové kopce","Vresové kopce"],"275":["Hraniční linie","Hraničná línia"],"276":["Zlatý klášter","Zlatý kláštor"],"277":["Cech zabijáků","Cech zabijakov"],"278":["Lorman"],"279":["Kraj zbrojmistrů","Kraj zbrojmajstrov"],"280":["Osada elfích lovců","Osada elfských lovcov"],"281":["Skryté údolí","Skryté údolie"],"282":["Les pokoje","Les pokoja"],"283":["Jižní hlídka","Južná hliadka"],"284":["Dellkan"],"285":["Strážné hory","Strážne hory"],"286":["Tábořiště barbarů","Táborisko barbarov"],"287":["Pláň ohně","Pláň ohňa"],"288":["Město nekromantů","Mesto nekromantov"],"289":["Vypleněná zem","Vyplienená zem"],"290":["Popelavá zem","Popolavá zem"],"291":["Dračí klášter","Dračí kláštor"],"292":["Cug el Athol"],"293":["Prokletá zem","Prekliata zem"],"294":["Krvavé pole"],"295":["Skřetí zbořenina","Škretie zborenisko"],"296":["Zpustošené město","Spustošené mesto"],"297":["Had el har"],"298":["Jezero třpytu","Jazero lesku"],"299":["Pekelná výheň","Pekelná vyhňa"],"300":["Šibeniční vrchy","Šibeničné vrchy"],"301":["Pláň kostí"],"302":["Dračí spoušť","Dračia spúšť"],"303":["Trollí loviště","Trollie lovisko"],"304":["Hranice smrti","Hranica smrti"],"305":["Stezka barbarů","Cesta barbarov"],"306":["Skřetí hlídka","Škretia hliadka"],"307":["Otrávená pustina","Otrávená pustatina"],"308":["Spáleniště","Spálenisko"],"309":["Meziříčí","Medziriečie"],"310":["Skryté město","Skryté mesto"],"311":["Stráž hranice"],"312":["Posvěcená zem","Posvätená zem"],"313":["Elfí řeka","Elfia rieka"],"314":["Radov"],"315":["Jezero dryád","Jazero dryád"],"316":["Ústí","Ústie"],"317":["Kutov"],"318":["Hadí pláně","Hadie pláne"],"319":["Klášter Aborea","Kláštor Aborea"],"320":["Elfí hlídka","Elfia hliadka"],"321":["Přístav Kythie","Prístav Kythia"],"322":["Pobřeží perel","Pobrežie perál"],"323":["Ostrov barbarů","Ostrov barbarov"],"324":["Démantové hory","Diamantové hory"],"325":["Pobřeží úsvitu","Pobrežie úsvitu"],"326":["Osada katů","Osada katov"],"327":["Mithrilové hory"],"328":["Útesy smrti"],"329":["Monument vítězství","Monument víťazstva"],"330":["Kraj klenotníků","Kraj klenotníkov"],"331":["Ostrov templářů","Ostrov templárov"],"332":["Přístav Torment","Prístav Torment"],"333":["Zaniklá říše","Zaniknutá ríša"],"334":["Osamělý klášter","Osamelý kláštor"],"335":["Jestřábí hory","Jastrabie hory"],"336":["Antemon"],"337":["Věž démonů","Veža démonov"],"338":["Cesta skurutů","Cesta skurutov"],"339":["Královská pevnost","Kráľovská pevnosť"],"340":["Smutné jezero","Smutné jazero"],"341":["Kapřín","Kaprov"],"342":["Skřetí přístav","Škretí prístav"],"343":["Thim Kan"],"344":["Osada lodivodů","Osada lodivodov"],"345":["Belman"],"346":["Arr dol"],"347":["Štičí řeka","Rieka šťúk"],"348":["Mramorová věž","Mramorová veža"],"349":["Mlýnice","Mlynica"],"350":["Vrchy zbojníků","Vrchy zbojníkov"],"351":["Zátoka komárů","Zátoka komárov"],"352":["Oriel el Alb"],"353":["Osada obchodníků","Osada obchodníkov"],"354":["Hory Nelian"],"355":["Ledopád","Ľadopád"],"356":["Ledové jezero","Ľadové jazero"],"357":["Sněžná pevnost","Snežná pevnosť"],"358":["Čarodějné hory","Čarodejné hory"],"359":["Jeskyně Siitcewa","Jaskyňa Siitcewa"],"360":["Tajemný portál","Tajomný portál"],"361":["Kouzelný mlýn","Kúzelný mlyn"],"362":["Severní útočiště","Severné útočisko"],"363":["Sobí stezka","Sobia rieka"],"364":["Tábor divochů","Tábor divochov"],"365":["Trpasličí štoly","Trpasličie štôlne"],"366":["Kardif"],"367":["Barbarská step"],"368":["Závětří","Závetrie"],"369":["Zem ještěrů","Zem jašterov"],"370":["Zátočina"],"371":["Skřetosluj","Škreťolom"],"372":["Hrad černých rytířů","Hrad čiernych rytierov"],"373":["Auguron"],"374":["Krčma u Kulhavce","Krčma u Krivého"],"375":["Algeban"],"376":["Barbarské legie","Barbarská légia"],"377":["Království barbarů","Kráľovstvo barbarov"],"378":["Mahulská pole","Mahulské polia"],"379":["Cedrové údolí","Cédrové údolie"],"380":["Skarha"],"381":["Studna naděje","Studňa nádeje"],"382":["Zbořený kostelec","Zborený kostolík"],"383":["Linské hory"],"384":["Obelisk osudu"],"385":["Kovárna trpaslíků","Kováčňa trpaslíkov"],"386":["Prokletá věž","Prekliata veža"],"387":["Moriagor"],"388":["Mlžné jezero","Hmlové jazero"],"389":["Hrad Laradur"],"390":["Hvozd čarodějnic","Húština čarodejníc"],"391":["Město lesního lidu","Mesto lesného ľudu"],"392":["Totem temnoty"],"393":["Ďáblovy pece","Diablove pece"],"394":["Poslední soud","Posledný súd"],"395":["Hory šílenství","Hory šialenstva"],"396":["Les kostí"],"397":["Propast zhouby","Priepasť záhuby"],"398":["Kraj drakobijců","Kraj drakobijcov"],"399":["Planina zmaru"],"400":["Svatyně Nicoty","Svätyňa Ničoty"],"401":["Hrobka pánů severu","Hrobky pánov severu"],"402":["Barbarská stráž"],"403":["Strážná step","Strážna step"],"404":["Drakeova marka"],"405":["Vrchy ozvěn","Vrchy ozvien"],"406":["Kolny","Kôlne"],"407":["Pelouchy","Pelechy"],"408":["Thim Inmon"],"409":["Říše Argad","Ríša Argad"],"410":["Stěžery","Stožiare"],"411":["Lesní portál","Lesný portál"],"412":["Arr Ania"],"413":["Sněžné hory","Snežné hory"],"414":["Osada půlčíků","Osada hobitov"],"415":["Pramenité vrchy"],"416":["Hadakanův hvozd","Hadakanova húština"],"417":["Lesní brána","Lesná brána"],"418":["Vlčí brázda","Vlčia brázda"],"419":["Imrazd"],"420":["Khelek Jint"],"421":["Větrov","Vetrov"],"422":["Pastviny"],"423":["Kraj koření","Kraj korenia"],"424":["Til Thar"],"425":["Podhůří","Podhorie"],"426":["Zem druidů","Zem druidov"],"427":["Tiché údolí","Tiché údolie"],"428":["Půtkov","Pútkov"],"429":["Stínov","Tieňov"],"430":["Hrad Perst"],"431":["Dunící hora","Duniaca hora"],"432":["Rákosiny"],"433":["Soutočné louky","Sútočné lúky"],"434":["Perknov"],"435":["Osada malomocných"],"436":["Les skřítků","Les škriatkov"],"437":["Hájina","Hájená"],"438":["Kraj rybářů","Kraj rybárov"],"439":["Zem bažin","Zem bažín"],"440":["Slonovinová věž","Slonovinová veža"],"441":["Černá hláska","Čierna hláska"],"442":["Křečhoř","Kŕčhor"],"443":["Lesní klášter","Lesný kláštor"],"444":["Dělící jezero","Deliace jazero"],"445":["Zem tůní","Zem tôní"],"446":["Srdce močálu","Srdce močiara"],"447":["Jezerní osada","Jazerná osada"],"448":["Pomezí","Pomedzie"],"449":["Dellmor"],"450":["Trollí most"],"451":["Bažina smrti","Barina smrti"],"452":["Mokrá pláň"],"453":["Alb Kemen"],"454":["Pevnost Geran","Pevnosť Geran"],"455":["Werdor"],"456":["Mokřady","Mokrade"],"457":["Bobří řeka","Bobria rieka"],"458":["Vodní mlýn","Vodný mlyn"],"459":["Zlatá hláska"],"460":["Ohnivý kruh"],"461":["Hranice stínů","Hranica tieňov"],"462":["Ostrov mrtvých","Ostrov mŕtvych"],"463":["Nor el Har"],"464":["Leor el Morrt"],"465":["Cesta bohů","Cesta bohov"],"466":["Pirátská krčma","Pirátska krčma"],"467":["Aréna smrti"],"468":["Zem mořeplavců","Zem moreplavcov"],"469":["Zámostí","Zámostie"],"470":["Thingolan"],"471":["Elmonath"],"472":["Malá delta"],"473":["Atan Kirs"],"474":["Thar el Zall"],"475":["Andiwa"],"476":["Konar el Morrt"],"477":["Přístav Trákie","Prístav Trákia"],"478":["Lorion"],"479":["Zátoka elfů","Zátoka elfov"],"480":["Citadela Eliador"],"481":["Průsmyk padlých","Priesmyk padlých"],"482":["Khelek Kirs"],"483":["Dol el Zint"],"484":["Kovárny","Kováčne"],"485":["Brána naděje","Brána nádeje"],"486":["Rivia"],"487":["Ďáblův pramen","Diablov prameň"],"488":["Elfí věštírna","Elfia veštiareň"],"489":["Vrchy ohně","Vrchy ohňa"],"490":["Utasar"],"491":["Severní hradba","Severná hradba"],"492":["Dahamond"],"493":["Trpasličí dílny","Trpasličie dielne"],"494":["Trpasluj","Trpaslom"],"495":["Zartie"],"496":["Korstan"],"497":["Dvě věže","Dve veže"],"498":["Zallman"],"499":["Lesetria"],"500":["Veverčí vrchy","Veveričie vrchy"],"501":["Baldur"],"502":["Oltář vampýrů","Oltár upírov"],"503":["Houštiny","Húštiny"],"504":["Osada léčitelů","Osada liečiteľov"],"505":["Věž úsvitu","Veža úsvitu"],"506":["Doupě vrahů","Dúpä vrahov"],"507":["Gulova samota"],"508":["Eridan Cug"],"509":["Žabí tůň","Žabia kaluž"],"510":["Kan el Charat"],"511":["Celeb Thar"],"512":["Býčí věž","Býčia veža"]}`);
const LANDS_K = JSON.parse(`{"7101":["Výmar"],"7102":["Lipsko"],"7103":["Gnandstein"],"7104":["Wurzen"],"7105":["Grimma"],"7106":["Mildenstein"],"7107":["Gera"],"7108":["Jena"],"7109":["Cvikov"],"7110":["Glauchau"],"7111":["Freiberg"],"7112":["Altzella"],"7113":["Torgau"],"7114":["Albrechtsburg"],"7115":["Míšeň"],"7116":["Drážďany"],"7117":["Marienberg"],"7118":["Chemnitz"],"7119":["Annaberg"],"7120":["Aue"],"7121":["Plavno"],"7122":["Klingenthal"],"7123":["Scharfenstein"],"7124":["Lauenstein"],"7125":["Koenigstein"],"7126":["Ortenburg"],"7127":["Pirna"],"7128":["Karlovy Vary"],"7129":["Hasištejn"],"7130":["Chomutov"],"7131":["Kadaň"],"7132":["Most"],"7133":["Žatec"],"7134":["Teplice"],"7135":["Louny"],"7136":["Říp"],"7137":["Děčín"],"7138":["Ústí nad Labem"],"7139":["Litoměřice"],"7140":["Budyně"],"7141":["Bautzen"],"7142":["Zhořelec"],"7143":["Markersdorf"],"7144":["Žitava"],"7145":["Henryków Lubański"],"7146":["Lubaň"],"7147":["Frýdlant"],"7148":["Šluknov"],"7149":["Sloup"],"7150":["Liberec"],"7151":["Jablonec"],"7152":["Česká Lípa"],"7153":["Bezděz"],"7154":["Kokořín"],"7155":["Mladá Boleslav"],"7156":["Trosky"],"7157":["Kost"],"7158":["Semily"],"7159":["Vrchlabí"],"7160":["Dvůr Králové"],"7161":["Trutnov"],"7162":["Broumov"],"7163":["Náchod"],"7164":["Boleslawiec"],"7165":["Nowogrodziec"],"7166":["Sobieszów"],"7167":["Hlohov"],"7168":["Zlotoryja"],"7169":["Wlen"],"7170":["Jelení hora"],"7171":["Lehnické Pole"],"7172":["Lehnice"],"7173":["Javor"],"7174":["Kamenná Hora"],"7175":["Valdenburk"],"7176":["Lubuš"],"7177":["Górka"],"7178":["Svídnice"],"7179":["Cieplowody"],"7180":["Nowa Ruda"],"7181":["Vratislav"],"7182":["Lesnica"],"7183":["Lagievniki"],"7184":["Zloty Stok"],"7185":["Kladsko"],"7186":["Tržebnica"],"7187":["Olešnice"],"7188":["Olava"],"7189":["Strzelin"],"7190":["Nisa"],"7191":["Twardogora"],"7192":["Chrastawa"],"7193":["Brzeg"],"7194":["Wierušow"],"7195":["Namyslow"],"7196":["Wojčice"],"7197":["Niemodlin"],"7198":["Horní Hlohov"],"7199":["Sokolniky"],"7200":["Bobrovniki"],"7201":["Kluczbork"],"7202":["Karlowice"],"7203":["Piastovská věž"],"7204":["Opolí"],"7205":["Krapkowice"],"7206":["Strzelce"],"7207":["Toszek"],"7208":["Wieluň"],"7209":["Daloszyn"],"7210":["Krzepice"],"7211":["Lubliniec"],"7212":["Zawadzkie"],"7213":["Balchatow"],"7214":["Radomsko"],"7215":["Dankow"],"7216":["Jasná hora"],"7217":["Čenstochová"],"7218":["Bobolice"],"7219":["Bytom"],"7220":["Bedzin"],"7221":["Cheb"],"7222":["Selb"],"7223":["Wiesau"],"7224":["Weiden"],"7225":["Schwandorf"],"7226":["Leuchtenberg"],"7227":["Neunburg"],"7228":["Loket"],"7229":["Sokolov"],"7230":["Kynžvart"],"7231":["Tachov"],"7232":["Přimda"],"7233":["Domažlice"],"7234":["Andělská hora"],"7235":["Teplá"],"7236":["Stříbro"],"7237":["Bečov"],"7238":["Rabštejn"],"7239":["Plzeň"],"7240":["Radyně"],"7241":["Švihov"],"7242":["Velhartice"],"7243":["Podbořany"],"7244":["Plasy"],"7245":["Krakovec"],"7246":["Rokycany"],"7247":["Nepomuk"],"7248":["Rábí"],"7249":["Rakovník"],"7250":["Křivoklát"],"7251":["Beroun"],"7252":["Točník"],"7253":["Příbram"],"7254":["Orlík"],"7255":["Zvíkov"],"7256":["Kladno"],"7257":["Levý Hradec"],"7258":["Malá Strana"],"7259":["Karlštejn"],"7260":["Pražský Hrad"],"7261":["Dobříš"],"7262":["Bechyně"],"7263":["Mělník"],"7264":["Dražice"],"7265":["Staré Město"],"7266":["Vyšehrad"],"7267":["Jílové"],"7268":["Nymburk"],"7269":["Kolín"],"7270":["Lipany"],"7271":["Sázavský klášter"],"7272":["Konopiště"],"7273":["Tábor"],"7274":["Český Šternberk"],"7275":["Blaník"],"7276":["Kámen"],"7277":["Hradec Králové"],"7278":["Poděbrady"],"7279":["Kutná Hora"],"7280":["Kunětická Hora"],"7281":["Sion"],"7282":["Havlíčkův Brod"],"7283":["Kladruby"],"7284":["Přibyslav"],"7285":["Lipnice"],"7286":["Želivský klášter"],"7287":["Pelhřimov"],"7288":["Jihlava"],"7289":["Roštejn"],"7290":["Potštejn"],"7291":["Rychnov n. Kněžnou"],"7292":["Pardubice"],"7293":["Chrudim"],"7294":["Česká Třebová"],"7295":["Svitavy"],"7296":["Lanškroun"],"7297":["Zelená Hora"],"7298":["Žďár n. Sázavou"],"7299":["Svojanov"],"7300":["Pernštejn"],"7301":["Blansko"],"7302":["Kuřim"],"7303":["Jeseník"],"7304":["Bruntál"],"7305":["Šumperk"],"7306":["Sovinec"],"7307":["Bouzov"],"7308":["Moravská Třebová"],"7309":["Uničov"],"7310":["Olomouc"],"7311":["Macocha"],"7312":["Vyškov"],"7313":["Prostějov"],"7314":["Svatý Kopeček"],"7315":["Potštát"],"7316":["Přerov"],"7317":["Vikštejn"],"7318":["Helfštýn"],"7319":["Valašské Meziříčí"],"7320":["Vsetín"],"7321":["Fulnek"],"7322":["Nový Jičín"],"7323":["Opava"],"7324":["Ratiboř"],"7325":["Hlubčice"],"7326":["Kandřín"],"7327":["Kozlí"],"7328":["Rybník"],"7329":["Hlivice"],"7330":["Grodziec"],"7331":["Myslovice"],"7332":["Vladislav"],"7333":["Žárov"],"7334":["Karviná"],"7335":["Ostrava"],"7336":["Třinec"],"7337":["Štramberk"],"7338":["Frýdek-Mistek"],"7339":["Jablunkov"],"7340":["Čadca"],"7341":["Pruchná"],"7342":["Těšín"],"7343":["Řezno"],"7344":["Roding"],"7345":["Cham"],"7346":["Heilsberg"],"7347":["Rottenburg"],"7348":["Mainburg"],"7349":["Štrubina"],"7350":["Brenneberg"],"7351":["Falkenstein"],"7352":["Řezné"],"7353":["Deggendorf"],"7354":["Landau"],"7355":["Dingolfing"],"7356":["Landshut"],"7357":["Erding"],"7358":["Reisbach"],"7359":["Eggenfelden"],"7360":["Vilshofen"],"7361":["Pfarrkirchen"],"7362":["Schwaim"],"7363":["Schärding"],"7364":["Eferding"],"7365":["Egg"],"7366":["Grafenau"],"7367":["Rinchnach"],"7368":["Pasov"],"7369":["Fürsteneck"],"7370":["Waxenberg"],"7371":["Linec"],"7372":["Český Krumlov"],"7373":["Helfenburk"],"7374":["Klatovy"],"7375":["Kašperk"],"7376":["Vimperk"],"7377":["Sušice"],"7378":["Strakonice"],"7379":["Prachatice"],"7380":["Písek"],"7381":["Vodňany"],"7382":["Dívčí kámen"],"7383":["Hluboká n. Vltavou"],"7384":["České Budějovice"],"7385":["Třeboň"],"7386":["Jindřichův Hradec"],"7387":["Telč"],"7388":["Rožmberk"],"7389":["Nové Hrady"],"7390":["Freistadt"],"7391":["Pregarten"],"7392":["Dornach"],"7393":["Martinsberg"],"7394":["Weinberg"],"7395":["Vitoraz"],"7396":["Pöggstall"],"7397":["Zwettl"],"7398":["Heidenreichstein"],"7399":["Landštejn"],"7400":["Raabs"],"7401":["Bítov"],"7402":["Třebíč"],"7403":["Cornštejn"],"7404":["Retz"],"7405":["Eggenburg"],"7406":["Horn"],"7407":["Grafenegg"],"7408":["Maissau"],"7409":["Götlweig"],"7410":["Laudon"],"7411":["Vídeň"],"7412":["Velké Meziříčí"],"7413":["Templštejn"],"7414":["Špilberk"],"7415":["Rosa Coeli"],"7416":["Moravský Krumlov"],"7417":["Znojmo"],"7418":["Holabrunn"],"7419":["Stockerau"],"7420":["Korneuburg"],"7421":["Mistelbach"],"7422":["Staatz"],"7423":["Brno"],"7424":["Slavkov"],"7425":["Cimburk"],"7426":["Dívčí hrady"],"7427":["Kyjov"],"7428":["Kroměříž"],"7429":["Hodonín"],"7430":["Břeclav"],"7431":["Zistersdorf"],"7432":["Dürnkrut"],"7433":["Gänserndorf"],"7434":["Kúty"],"7435":["Malacky"],"7436":["Prešpurk"],"7437":["Holíč"],"7438":["Čachtice"],"7439":["Senica"],"7440":["Strážnice"],"7441":["Uherské Hradiště"],"7442":["Trnava"],"7443":["Zlín"],"7444":["Vizovice"],"7445":["Skalka"],"7446":["Nové Mesto n. Váhom"],"7447":["Piešťany"],"7448":["Bytča"],"7449":["Púchov"],"7450":["Lednica"],"7451":["Žilina"],"7452":["Lietava"],"7453":["Povážská Bystrica"],"7454":["Ilava"],"7455":["Trenčín"],"7456":["Tematín"],"7457":["Hlohovec"],"7458":["Topoľčany"],"7459":["Nitra"],"7460":["Kozárovce"],"7461":["Banská Štiavnica"],"7462":["Handlová"],"7463":["Prievidza"],"7464":["Bojnice"],"7465":["Nitranské Pravno"]}`);
const LANDS_S = JSON.parse(`{"7501":["Darg an Theie"],"7502":["Severní svahy"],"7503":["Var el Cug"],"7504":["Var el Fug"],"7505":["Pekliska"],"7506":["Zmrzlý vrch"],"7507":["Trpasličí hradba"],"7508":["Chechtavá pláň"],"7509":["Noriel"],"7510":["Hranice svobody"],"7511":["Boleslavova tvrz"],"7512":["Thak Undol"],"7513":["Poustevny"],"7514":["Salinmon"],"7515":["Trojhradí"],"7516":["Dvojhradí"],"7517":["Horská stezka"],"7518":["Poslední vzdor"],"7519":["Čapí klín"],"7520":["Skřetobor"],"7521":["Skřetí loviště"],"7522":["Stinné stráně"],"7523":["Inmon el Kemen"],"7524":["Arcad Ania"],"7525":["Had el Zag"],"7526":["Undlor"],"7527":["Červený kráter"],"7528":["Belantis"],"7529":["Mezihoří"],"7530":["Středohoří"],"7531":["Tian el Atan"],"7532":["Suché úbočí"],"7533":["Havraní vrch"],"7534":["Grim el Man"],"7535":["Písečná planina"],"7536":["Dobrodruhův hrob"],"7537":["Ledr an Ante"],"7538":["Zlaté písky"],"7539":["Arcadrass"],"7540":["Rad Host"],"7541":["Lormond"],"7542":["Arthosův lán"],"7543":["Dellatan"],"7544":["Khelek Soris"],"7545":["Atan el Thar"],"7546":["Železné štoly"],"7547":["Travnatá step"],"7548":["Had an Har"],"7549":["Solná stezka"],"7550":["Půlkraj"],"7551":["Tichá věž"],"7552":["Khelek Thar"],"7553":["Tábory vyhnanců"],"7554":["Oáza hojnosti"],"7555":["Orientální trh"],"7556":["Arrtol"],"7557":["Hobití úvoz"],"7558":["Krilor an Har"],"7559":["Und Krilin"],"7560":["Luka"],"7561":["Rozcestí"],"7562":["Klášterní zahrady"],"7563":["Čertův mlýn"],"7564":["Entín"],"7565":["Vlčina"],"7566":["Stříbrný háj"],"7567":["Kopřivová pole"],"7568":["Jelení obora"],"7569":["Studna vědění"],"7570":["Theothar"],"7571":["Zlaté nížiny"],"7572":["Had an Lin"],"7573":["Man enel Thar"],"7574":["Jantarový důl"],"7575":["Šmuknov"],"7576":["Sedlec"],"7577":["Bublinkov"],"7578":["Tirlinis"],"7579":["Brod v podhradí"],"7580":["Podhradní Lhota"],"7581":["Říše neumírajících"],"7582":["Levý Hradec"],"7583":["Zagvar"],"7584":["Půlčíkov"],"7585":["Bílá Citadela"],"7601":["Trpasličí brána"],"7602":["Krčma V Podzemí"],"7603":["Mlžná věž"],"7604":["Věž z kostí"],"7605":["Trpasličí sklady"],"7606":["Důlní svatyně"],"7607":["Zeď nářků"],"7608":["Úhor"],"7609":["Kazadorum"],"7610":["Kostnice"],"7611":["Kamenná věž"],"7612":["Mithrilová hora"],"7613":["Dračí hory"],"7614":["Královské rovy"],"7615":["Doudleby"],"7616":["Černá márnice"],"7617":["Skalní hroby"],"7618":["Poslední skok"],"7619":["Trollí stěna"],"7620":["Nekrobor"],"7621":["Grešlové mýto"],"7622":["Runový menhir"],"7623":["Porta"],"7624":["Ostroh"],"7625":["Rokle smrti"],"7626":["Skřetí tábor"],"7627":["Severní líheň"],"7628":["Osir Dol"],"7629":["Šamanova chýše"],"7630":["Loviště"],"7631":["Hluboké písky"],"7632":["Mořské dno"],"7633":["Pouštní město"],"7634":["Palmová kazatelna"],"7635":["Bílá pláň"],"7636":["Spalující výheň"],"7637":["Barbarská pláň"],"7638":["Stanice karavany"],"7639":["Velká zeď"],"7640":["Koňské pastviny"],"7641":["Síň válečníků"],"7642":["Širé pláně"],"7643":["Měsíční brána"],"7644":["U Dark Elfa"],"7645":["Amfiteátr"],"7646":["Skurutí slum"],"7647":["Kostel duší"],"7648":["Tabáková farma"],"7649":["Cesta nebojácných"],"7650":["Vědomí pouště"],"7651":["Ekh Nerat"],"7652":["Kolo bolesti"],"7653":["Lví savana"],"7654":["Oáza vzteku"],"7655":["Zelná poušť"],"7656":["Podzemní tůň"],"7657":["Oraniště"],"7658":["Božský vchod"],"7659":["Konopkov"],"7660":["Průrva"],"7661":["Panské louky"],"7662":["Elfí hvozd"],"7663":["Dlážděný úvoz"],"7664":["Zahořany"],"7665":["Entí školka"],"7666":["Tobyho statek"],"7667":["Lesní pěšina"],"7668":["Bor"],"7669":["Panské sídlo"],"7670":["Přízračný les"],"7671":["Brána lásky"],"7672":["Panská cesta"],"7673":["Ovar tauri"],"7674":["Dílny"],"7675":["Absintov"],"7676":["Semeniště"],"7677":["Kraj zlatokopek"],"7678":["Smrtící břehy"],"7679":["Rybárny"],"7680":["Kolbiště"],"7681":["Mechový palouk"],"7682":["Pravý Hradec"],"7683":["Osamělá věž"],"7684":["Rudá říčka"]}`);
const LANDS = Object.assign(Object.assign(Object.assign({}, LANDS_CLASSIC), LANDS_K), LANDS_S);
// sorted
const LAND_IDS_CLASSIC = JSON.parse(`["1","2","3","4","6","7","8","9","10","12","13","14","15","16","17","19","20","21","22","23","24","25","26","28","29","30","31","32","33","34","36","37","38","39","40","41","42","44","46","47","48","49","50","51","52","54","55","56","57","58","59","60","61","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","204","205","206","207","208","209","210","211","212","213","214","215","216","217","218","219","220","221","222","223","224","225","226","227","228","229","230","237","238","239","240","241","242","243","244","245","246","247","248","249","250","251","252","253","254","255","256","257","258","259","260","261","262","263","264","265","266","267","268","269","270","271","272","273","274","275","276","277","278","279","280","281","282","283","284","285","286","287","288","289","290","291","292","293","294","295","296","297","298","299","300","301","302","303","304","305","306","307","308","309","310","311","312","313","314","315","316","317","318","319","320","321","322","323","324","325","326","327","328","329","330","331","332","333","334","335","336","337","338","339","340","341","342","343","344","345","346","347","348","349","350","351","352","353","354","355","356","357","358","359","360","361","362","363","364","365","366","367","368","369","370","371","372","373","374","375","376","377","378","379","380","381","382","383","384","385","386","387","388","389","390","391","392","393","394","395","396","397","398","399","400","401","402","403","404","405","406","407","408","409","410","411","412","413","414","415","416","417","418","419","420","421","422","423","424","425","426","427","428","429","430","431","432","433","434","435","436","437","438","439","440","441","442","443","444","445","446","447","448","449","450","451","452","453","454","455","456","457","458","459","460","461","462","463","464","465","466","467","468","469","470","471","472","473","474","475","476","477","478","479","480","481","482","483","484","485","486","487","488","489","490","491","492","493","494","495","496","497","498","499","500","501","502","503","504","505","506","507","508","509","510","511","512"]`);
// sorted
const LAND_IDS_K = JSON.parse(`["7101","7102","7103","7104","7105","7106","7107","7108","7109","7110","7111","7112","7113","7114","7115","7116","7117","7118","7119","7120","7121","7122","7123","7124","7125","7126","7127","7128","7129","7130","7131","7132","7133","7134","7135","7136","7137","7138","7139","7140","7141","7142","7143","7144","7145","7146","7147","7148","7149","7150","7151","7152","7153","7154","7155","7156","7157","7158","7159","7160","7161","7162","7163","7164","7165","7166","7167","7168","7169","7170","7171","7172","7173","7174","7175","7176","7177","7178","7179","7180","7181","7182","7183","7184","7185","7186","7187","7188","7189","7190","7191","7192","7193","7194","7195","7196","7197","7198","7199","7200","7201","7202","7203","7204","7205","7206","7207","7208","7209","7210","7211","7212","7213","7214","7215","7216","7217","7218","7219","7220","7221","7222","7223","7224","7225","7226","7227","7228","7229","7230","7231","7232","7233","7234","7235","7236","7237","7238","7239","7240","7241","7242","7243","7244","7245","7246","7247","7248","7249","7250","7251","7252","7253","7254","7255","7256","7257","7258","7259","7260","7261","7262","7263","7264","7265","7266","7267","7268","7269","7270","7271","7272","7273","7274","7275","7276","7277","7278","7279","7280","7281","7282","7283","7284","7285","7286","7287","7288","7289","7290","7291","7292","7293","7294","7295","7296","7297","7298","7299","7300","7301","7302","7303","7304","7305","7306","7307","7308","7309","7310","7311","7312","7313","7314","7315","7316","7317","7318","7319","7320","7321","7322","7323","7324","7325","7326","7327","7328","7329","7330","7331","7332","7333","7334","7335","7336","7337","7338","7339","7340","7341","7342","7343","7344","7345","7346","7347","7348","7349","7350","7351","7352","7353","7354","7355","7356","7357","7358","7359","7360","7361","7362","7363","7364","7365","7366","7367","7368","7369","7370","7371","7372","7373","7374","7375","7376","7377","7378","7379","7380","7381","7382","7383","7384","7385","7386","7387","7388","7389","7390","7391","7392","7393","7394","7395","7396","7397","7398","7399","7400","7401","7402","7403","7404","7405","7406","7407","7408","7409","7410","7411","7412","7413","7414","7415","7416","7417","7418","7419","7420","7421","7422","7423","7424","7425","7426","7427","7428","7429","7430","7431","7432","7433","7434","7435","7436","7437","7438","7439","7440","7441","7442","7443","7444","7445","7446","7447","7448","7449","7450","7451","7452","7453","7454","7455","7456","7457","7458","7459","7460","7461","7462","7463","7464","7465"]`);
// sorted
const LAND_IDS_S = JSON.parse(`["7501","7502","7503","7504","7505","7506","7507","7508","7509","7510","7511","7512","7513","7514","7515","7516","7517","7518","7519","7520","7521","7522","7523","7524","7525","7526","7527","7528","7529","7530","7531","7532","7533","7534","7535","7536","7537","7538","7539","7540","7541","7542","7543","7544","7545","7546","7547","7548","7549","7550","7551","7552","7553","7554","7555","7556","7557","7558","7559","7560","7561","7562","7563","7564","7565","7566","7567","7568","7569","7570","7571","7572","7573","7574","7575","7576","7577","7578","7579","7580","7581","7582","7583","7584","7585","7601","7602","7603","7604","7605","7606","7607","7608","7609","7610","7611","7612","7613","7614","7615","7616","7617","7618","7619","7620","7621","7622","7623","7624","7625","7626","7627","7628","7629","7630","7631","7632","7633","7634","7635","7636","7637","7638","7639","7640","7641","7642","7643","7644","7645","7646","7647","7648","7649","7650","7651","7652","7653","7654","7655","7656","7657","7658","7659","7660","7661","7662","7663","7664","7665","7666","7667","7668","7669","7670","7671","7672","7673","7674","7675","7676","7677","7678","7679","7680","7681","7682","7683","7684"]`);

// CONCATENATED MODULE: ./src/lib/constants.ts
// Existuje jeden frame (Map), ktery ma dva ruzne obsahy.
// Ty se daji rozlisit pres document.title
// nahled mapy: title = `Mapa světa`
// normalni hraci mapa: title = `Dark Elf's world map`;
var FrameNames;
(function (FrameNames) {
    FrameNames["Main"] = "mapa";
    FrameNames["Top"] = "Lista_Horni";
    FrameNames["Information"] = "lista_informace";
    FrameNames["Left"] = "Lista_Vlevo";
})(FrameNames || (FrameNames = {}));
var StorageKeys;
(function (StorageKeys) {
    StorageKeys["HOUSES"] = "houses";
    StorageKeys["TOPBAR"] = "top_bar";
    StorageKeys["LEAGUE_METADATA"] = "league_metadata";
    StorageKeys["LAND_HISTORY"] = "land_history";
    StorageKeys["ACCOUNT_CREDENTIALS"] = "account_data";
    StorageKeys["LAST_FILLED_USERNAME"] = "last_username";
    StorageKeys["PLAYER_SETTINGS"] = "player_settings";
    StorageKeys["ALLIANCES"] = "alliances";
    StorageKeys["ALLIANCE_MEMBERS"] = "alliance_members";
    StorageKeys["FLYING_SPELLS"] = "flying_spells";
    StorageKeys["FLYING_ATTACKS"] = "flying_attacks";
    StorageKeys["REPORTED_SPELLS"] = "reported_spells";
    StorageKeys["MAP_CASTING"] = "map_casting";
    StorageKeys["MAP_CASTING_LANDS"] = "map_casting_lands";
})(StorageKeys || (StorageKeys = {}));
class StorageKeysFunctions {
}
StorageKeysFunctions.LastRunDate = (leagueId) => { return `${StorageKeys.LAND_HISTORY}_${leagueId}_date`; };
StorageKeysFunctions.LastRunDay = (leagueId) => { return `${StorageKeys.LAND_HISTORY}_${leagueId}_day`; };
StorageKeysFunctions.LandHistory = (leagueId, landId) => `${StorageKeys.LAND_HISTORY}_${leagueId}_${landId}`;
StorageKeysFunctions.LandsHistory = (leagueId) => `${StorageKeys.LAND_HISTORY}_${leagueId}`;
StorageKeysFunctions.Alliances = (leagueId) => `${StorageKeys.ALLIANCES}_${leagueId}`;
StorageKeysFunctions.AllianceMembers = (leagueId) => `${StorageKeys.ALLIANCE_MEMBERS}_${leagueId}`;
StorageKeysFunctions.FlyingSpells = (leagueId) => `${StorageKeys.FLYING_SPELLS}_${leagueId}`;
StorageKeysFunctions.FlyingAttacks = (leagueId) => `${StorageKeys.FLYING_ATTACKS}_${leagueId}`;
StorageKeysFunctions.ReportedSpells = (leagueId) => `${StorageKeys.REPORTED_SPELLS}_${leagueId}`;
const CurrentLocation = {
    Land: {
        Economy: document.URL.match('https://www.darkelf.cz/e.asp.*'),
        Building: document.URL.match('https://www.darkelf.cz/b.asp.*'),
        Diplomacy: document.URL.match('https://www.darkelf.cz/c.asp.*'),
        Army: document.URL.match('https://www.darkelf.cz/a.asp.*'),
        Enemy: document.URL.match('https://www.darkelf.cz/l.asp.*'),
    },
    Hero: {
        Detail: document.URL.match('https://www.darkelf.cz/hero.asp'),
        Artifacts: document.URL.match('https://www.darkelf.cz/artefacts_list.asp'),
        Equip: document.URL.match('https://www.darkelf.cz/hero_artefacts.asp'),
    },
    Statistics: {
        Auction: document.URL.match('https://www.darkelf.cz/statistiky/artefacts_auction.asp')
    },
    Pay2Win: {
        Overview: document.URL.match('https://www.darkelf.cz/sluzby/sluzby_prehled.asp')
    },
    Main: document.URL.match('https://www.darkelf.cz/world.asp*'),
    Map: document.URL.match('https://www.darkelf.cz/map_new.asp*'),
    EntryMap: document.URL.match('https://www.darkelf.cz/world_map.asp'),
    TopBar: document.URL.match('https://www.darkelf.cz/Lista_Horni.asp'),
    InfoBar: document.URL.match('https://www.darkelf.cz/lista_informace.asp'),
    Headquarters: document.URL.match('https://www.darkelf.cz/centrala.asp'),
    Deficurky: document.URL.match('http://deficurky.detimes.cz/.*'),
    BuildingsListEx: document.URL.match('https://www.darkelf.cz/buildings_list_ex.asp'),
    Login: document.URL.match('https://www.darkelf.cz/login.asp'),
    Trophies: document.URL.match('https://www.darkelf.cz/trofeje.asp'),
    Leagues: document.URL.match('https://www.darkelf.cz/ligy.asp'),
    Alliance: document.URL.match('https://www.darkelf.cz/aliance.asp'),
    MassHouses: document.URL.match('https://www.darkelf.cz/auto_domy.asp'),
    Magic: document.URL.match('https://www.darkelf.cz/magie.asp'),
};
const DEFAULT_PLAYER_SETTINGS = {
    showLandCount: true,
    irrelevantPlayers: {
        '1': [],
        '2C': [],
    }
};
const firebaseConfig = {
    apiKey: "AIzaSyCuUWWvYLLyNX5PCL_EQTql6bLk8GRxf60",
    authDomain: "deking2.firebaseapp.com",
    databaseURL: "https://deking2.firebaseio.com",
    projectId: "deking2",
    storageBucket: "deking2.appspot.com",
    messagingSenderId: "528863873695",
    appId: "1:528863873695:web:0236360e737737d906f0aa"
};

// CONCATENATED MODULE: ./src/html-parsers/alliance-parser.ts

const parseAllianceMembers = (doc) => {
    const $doc = $(doc);
    if ($doc.find("input[name='nazev']").length !== 0)
        return null;
    const allianceMembers = [];
    // from old deking
    $.each($($doc.find('table')[2]).find('tr:not(:first):not(:last)'), function () {
        const name = $($(this).find('th').find('a')[1]).html();
        const link = $($(this).find('th').find('a')[0]).attr('href');
        const race = $($(this).find('td'))[1].textContent;
        const raceId = 0; // TODO: convert race (name) to id
        const id = parseInt(link.replace(/^\D+/g, ''));
        allianceMembers.push({ id: id, name: name, raceId });
    });
    dlog('Členové mojí aliance:', allianceMembers.map(am => am.name));
    return allianceMembers;
};
const parseAlliances = (doc) => {
    const $doc = $(doc);
    const $allianceSelect = $doc.find("select[name='vyber_aliance']");
    if (!$allianceSelect.length)
        return null;
    const options = [...$allianceSelect[0].options];
    const alliances = options.filter(opt => !!opt.label).map(opt => ({
        id: parseInt(opt.value),
        name: opt.label
    }));
    dlog('Aliance:', alliances.map(a => a.name));
    return alliances;
};

// CONCATENATED MODULE: ./src/db/attacks-db.ts
const ATTACKS_DB = {
    1: { color: "#00CC00", cz: "přesun", id: 1 },
    3: { color: "#AAAAAA", cz: "plenivý", id: 3 },
    4: { color: "#FF4444", cz: "dobyvačný", id: 4 }
};

// CONCATENATED MODULE: ./src/html-parsers/attacks-parser.ts

function parseFlyingAttacks(doc) {
    let attacksTds = [...doc.querySelectorAll('td[id_attack]')];
    return attacksTds.map(x => {
        return {
            landId: Number(x.getAttribute("id_to")),
            power: Number(x.innerText.split(":")[1]),
            sourcePlayer: { name: x.getAttribute("name_attacker"), id: Number(x.getAttribute("id_attacker")) },
            targetPlayer: { name: x.getAttribute("name_defender"), id: Number(x.getAttribute("id_defender")) },
            attackType: ATTACKS_DB[Number(x.getAttribute("id_type"))]
        };
    });
}

// CONCATENATED MODULE: ./src/services/alliance-service.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class alliance_service_AllianceService {
    constructor(dataProvider, metadataService) {
        // parse alliances and members
        // unless they were already saved for the current day
        // TODO: save allianceId for each player?
        // TODO: read also other playes and store them by alliance?
        this.refresh = () => __awaiter(this, void 0, void 0, function* () {
            const membersStorageKey = StorageKeysFunctions.AllianceMembers(this.metadataService.metadata.leagueId);
            const alliancesStorageKey = StorageKeysFunctions.Alliances(this.metadataService.metadata.leagueId);
            const flyingAttacksStorageKey = StorageKeysFunctions.FlyingAttacks(this.metadataService.metadata.leagueId);
            let allianceMembers = this.dataProvider.load(membersStorageKey);
            if (!allianceMembers || allianceMembers.day !== this.metadataService.metadata.day) {
                const doc = yield getDomFromUrl('https://www.darkelf.cz/aliance.asp', 'GET');
                const day = this.metadataService.metadata.day;
                // process alliances
                dlog('Parsing existing alliances.');
                const alliances = parseAlliances(doc);
                this.dataProvider.save(alliancesStorageKey, { alliances, day });
                // process members
                dlog('Parsing own alliance members.');
                const members = parseAllianceMembers(doc);
                this.dataProvider.save(membersStorageKey, { members, day });
            }
            // read attacks
            dlog('Parsing flying attacks.');
            const attacksDoc = yield getDomFromUrl('https://www.darkelf.cz/attacks_list.asp?id_player=all', 'GET');
            const flyingAttacks = parseFlyingAttacks(attacksDoc);
            this.dataProvider.save(flyingAttacksStorageKey, flyingAttacks);
        });
        this.dataProvider = dataProvider;
        this.metadataService = metadataService;
    }
    get members() {
        const membersStorageKey = StorageKeysFunctions.AllianceMembers(this.metadataService.metadata.leagueId);
        return this.dataProvider.load(membersStorageKey).members;
    }
    get flyingAttacks() {
        return this.dataProvider.load(StorageKeysFunctions.FlyingAttacks(this.metadataService.metadata.leagueId));
    }
    get alliances() {
        const alliancesStorageKey = StorageKeysFunctions.Alliances(this.metadataService.metadata.leagueId);
        return this.dataProvider.load(alliancesStorageKey).alliances;
    }
}

// CONCATENATED MODULE: ./src/html-parsers/league-metadata-parser.ts
function parseLeagueInfo(redArrowEl) {
    // the arrow image has 'onmouseover' function, which
    // actually includes a player name, a league id and the day
    const info = redArrowEl.getAttribute('onmouseover');
    let start = 79;
    let end = info.indexOf('</span>');
    // "PLAYER_NAME<br/> Liga LEAGUE_ID<br/> Herni den DAY"
    const t = info.substr(79, end - start);
    // parse playername
    const playerName = t.substr(0, t.indexOf('<'));
    if (!playerName)
        throw "failed to parse the playername";
    // parse player id
    const parentEl = redArrowEl.parentElement;
    const href = parentEl.getAttribute('href');
    const playerId = href.split('hrac=')[1];
    // parse league
    start = t.indexOf('Liga') + 5;
    end = t.lastIndexOf('<br');
    const leagueId = t.substr(start, end - start);
    if (!leagueId)
        throw "failed to parse the league";
    // parse league day
    const day = Number(t.substr(t.lastIndexOf(' ') + 1));
    //if (!day) throw "failed to parse the day";
    return {
        playerName,
        playerId,
        leagueId,
        day
    };
}

// CONCATENATED MODULE: ./src/services/metadata-service.ts



class metadata_service_MetadataService {
    constructor(dataProvider) {
        this.parseLeagueMetadata = (redArrowEl) => {
            const leagueMetadata = parseLeagueInfo(redArrowEl);
            this.dataProvider.save(StorageKeys.LEAGUE_METADATA, leagueMetadata);
            dlog('Metadata nactena a ulozena.', leagueMetadata);
            return leagueMetadata;
        };
        this.resetMetadata = () => {
            if (this.metadata) {
                dlog('Metadata vymazana.');
                this.dataProvider.save(StorageKeys.LEAGUE_METADATA, null);
            }
        };
        this.dataProvider = dataProvider;
    }
    get metadata() {
        return this.dataProvider.load(StorageKeys.LEAGUE_METADATA);
    }
    get hasValidMetadata() {
        return !!this.metadata
            && typeof this.metadata.day === 'number'
            && !!this.metadata.leagueId
            && !!this.metadata.playerName
            && !!this.metadata.playerId;
    }
}

// CONCATENATED MODULE: ./src/db/spells-db.ts
const SPELLS_DB = JSON.parse('{"3":{"id":3,"isGood":false,"cz":"Magický šíp","sk":"Magický šíp","en":"Magic Arrow"},"4":{"id":4,"isGood":false,"cz":"Strach","sk":"Strach","en":"Fear"},"5":{"id":5,"isGood":true,"cz":"Spokojenost","sk":"Spokojnosť","en":"Content"},"6":{"id":6,"isGood":false,"cz":"Povodeň","sk":"Povodeň","en":"Flood"},"7":{"id":7,"isGood":false,"cz":"Nespokojenost","sk":"Nespokojnosť","en":"Discontent"},"8":{"id":8,"isGood":false,"cz":"Děs obyvatelstva","sk":"Des obyvateľstva","en":"Panic"},"9":{"id":9,"isGood":true,"cz":"Zmrtvýchvstání","sk":"Zmŕtvychvstanie","en":"Animate Dead"},"10":{"id":10,"isGood":false,"cz":"Krupobití","sk":"Krupobitie","en":"Hailstorm"},"11":{"id":11,"isGood":false,"cz":"Zasypání","sk":"Zasypanie","en":"Cave-in"},"12":{"id":12,"isGood":true,"cz":"Uzdravení","sk":"Uzdravenie","en":"Tranquility"},"13":{"id":13,"isGood":false,"cz":"Odražeč štítů","sk":"Odražeč štítů","en":"Dispel Shields"},"14":{"id":14,"isGood":true,"cz":"Neovlivnitelnost","sk":"Neovplyvnitelnosť","en":"Natural Growth"},"15":{"id":15,"isGood":false,"cz":"Magické oko","sk":"Magické oko","en":"Magic Eye"},"18":{"id":18,"isGood":true,"cz":"Nápoj lásky","sk":"Nápoj lásky","en":"Love potion"},"20":{"id":20,"isGood":false,"cz":"Magický vír","sk":"Magický vír","en":"Magic Whirl"},"30":{"id":30,"isGood":true,"cz":"Mana na zlato","sk":"Mana na zlato","en":"Mana To Gold"},"40":{"id":40,"isGood":true,"cz":"Příznivé počasí","sk":"Priaznivé počasie","en":"Fair Weather"},"50":{"id":50,"isGood":true,"cz":"Magické klima","sk":"Magická klíma","en":"Magical Climate"},"60":{"id":60,"isGood":true,"cz":"Pás zmatení","sk":"Pás zmätenia","en":"Phantom Trail"},"70":{"id":70,"isGood":true,"cz":"Vojenský štít","sk":"Vojenský štít","en":"Military Shield"},"80":{"id":80,"isGood":true,"cz":"Magický štít","sk":"Magický štít","en":"Magic Shield"},"90":{"id":90,"isGood":false,"cz":"Ukrást peníze","sk":"Ukradnúť peniaze","en":"Steal Gold"},"100":{"id":100,"isGood":false,"cz":"Ukrást manu","sk":"Ukradnúť manu","en":"Steal Mana"},"105":{"id":105,"isGood":true,"cz":"Požehnání","sk":"Požehnanie","en":"Blessing"},"110":{"id":110,"isGood":false,"cz":"Blesk","sk":"Blesk","en":"Thunderbolt"},"115":{"id":115,"isGood":false,"cz":"Kletba","sk":"Kliatba ","en":"Curse"},"117":{"id":117,"isGood":false,"cz":"Dvojitá Kletba","sk":"Dvojitá Kliatba","en":"Double Curse"},"120":{"id":120,"isGood":true,"cz":"Vojenský štít velký","sk":"Vojenský štít veľký","en":"Large Military Shield"},"130":{"id":130,"isGood":true,"cz":"Magický štít velký","sk":"Magický štít veľký ","en":"Large Magic Shield"},"140":{"id":140,"isGood":false,"cz":"Bouře","sk":"Búrka","en":"Storm"},"160":{"id":160,"isGood":false,"cz":"Černá smrt","sk":"Čierna smrť","en":"Black Death"},"170":{"id":170,"isGood":false,"cz":"Uragán","sk":"Uragán","en":"Hurricane"},"180":{"id":180,"isGood":false,"cz":"Smrtící démon","sk":"Smrtiaci démon","en":"Demon of Death"},"190":{"id":190,"isGood":false,"cz":"Zemětřesení","sk":"Zemetrasenie","en":"Earthquake"},"193":{"id":193,"isGood":false,"cz":"Démon kamene","sk":"Démon kameňa","en":"Demon of Stone"},"195":{"id":195,"isGood":false,"cz":"Démon magie","sk":"Démon mágie","en":"Demon of Magic"},"200":{"id":200,"isGood":false,"cz":"Soudný den","sk":"Súdny deň","en":"Armageddon"}}');

// CONCATENATED MODULE: ./src/html-parsers/report-parser.ts


// TODO: add interface for the return type
const parseSpellRow = function (tr) {
    var _a;
    const cells = tr.children;
    if (!cells.length)
        return null;
    const spellImg = cells[0].children[0].getAttribute('src');
    const spellId = spellImg.match(/\d+/)[0];
    const spell = SPELLS_DB[Number(spellId)];
    const landName = cells[1].textContent.split(' - ')[0];
    // TODO: this doesn't work right now.
    // .. kdyz na me nekdo hazi SmD, tak v zelenem textu jsem napsany ja a ne ten, kdo to kouzlil
    const sourcePlayer = $(cells[1]).find('span')[0].textContent;
    const targetPlayer = (_a = cells[2].textContent) === null || _a === void 0 ? void 0 : _a.trim().split(' ')[1];
    const thumbImg = cells[3].children[0].getAttribute('src');
    const thumbUp = thumbImg === 'images/s/hand_up.gif';
    // const text = tr.nextElementSibling?.textContent?.trim();
    // TODO: SK/EN variants
    // let spellPower = undefined;
    // } else if (text.startsWith('Seslal jsi') || text.startsWith('Nepodařilo se ti')) {
    //     sourcePlayer = '___self___'; // TODO: get current player name from somewhere?
    //     const spellPowerIndex = text.lastIndexOf('Síla kouzla byla ');
    //     const spellPowerText = text.substr(spellPowerIndex + 17).slice(0, -1);
    //     spellPower = parseInt(spellPowerText, 10);
    // } else {
    //     sourcePlayer = text.substring(0, text.indexOf(' '));
    // }
    return {
        spell,
        landName,
        sourcePlayer,
        targetPlayer,
        thumbUp
    };
};
// TODO: optimize to stop when the land is found
const getLandIdByName = (name, leagueId) => {
    const lands = getLandsByMapType(getMapType(leagueId));
    const landIds = Object.keys(lands);
    let id = undefined;
    landIds.forEach(landId => {
        if (lands[landId].includes(name)) {
            id = landId;
        }
    });
    return Number(id);
};
// TODO>...
const isSuccess = (thumbUp, isGood, mySpell) => {
    if (thumbUp && mySpell) {
        if (isGood || mySpell)
            return true; // moje zeme a dobre kouzlo, chceme palec nahoru  + cokoliv spatneho co jsem si zakouzlil ja.. dafuq..
        else
            return false; // moje zeme a spatne kouzlo, chceme palec dolu
    }
    else
        return true; // pokud je cizi, tak palec hore = proslo
};
// WORK IN PROGRESS!
const parseSpellsFromAllianceReport = (doc, me, allianceMembers, leagueId) => {
    const table = $(doc).find('table')[1];
    const trSpells = $(table).find('tr[style="font-weight:bold;font-size:small;color:#7777AB;"]');
    const parsedSpells = [];
    $.each(trSpells, function () {
        const parsedRow = parseSpellRow(this);
        const spell = parsedRow.spell;
        const landId = getLandIdByName(parsedRow.landName, leagueId);
        const sourcePlayer = parsedRow.sourcePlayer;
        const success = isSuccess(parsedRow.thumbUp, spell.isGood, me.name == parsedRow.sourcePlayer);
        parsedSpells.push({
            landId,
            spell,
            sourcePlayer,
            success
        });
    });
    return parsedSpells;
};
// #region oldcode
/*
export function parseReport(doc: Document) {
    const table = $(doc).find('table')[1];
    const userData = getUserData(doc);

    const trSpells = $(table).find('tr[style="font-weight:bold;font-size:small;color:#7777AB;"]');
    $.each(trSpells, function () {
        const parsedTr = parseReportTr(this);

        if (!isUserMyMate(myMates, parsedTr.user) || parsedTr.user == userData.user) { // pokud figuruje spolualiancnik v mem hlaseni, neresim ho, resim ho u sebe

            var spell = that._dataProvider.getSpellByImg(parsedTr.imgLink);
            var land = parsedTr.land;
            var user = parsedTr.user;


            var textInfo = $(table).find(this).next('tr').find('td').html();
            var meWhoCast = textInfo.indexOf('Seslal jsi') == 0 || textInfo.indexOf('Zoslal si') == 0 || textInfo.indexOf('You sent') == 0;

            var spellSuccess = that._isSuccess(parsedTr.thumb, userData, user, spell.isGood, meWhoCast);


            if (spellSuccess) {
                if (land == null)
                    debugger;

                if (lands[land.id] == undefined) {
                    lands[land.id] = {};
                    lands[land.id].spells = [];
                }
                if (lands[land.id].spells == undefined)
                    debugger;
                lands[land.id].spells.push(spell);

                if (parsedTr.user == userData.user)
                    lands[land.id].isMyLand = true;

            }
        }

    });

    const trAttacks = $(table).find('tr[style="font-weight:bold;font-size:small;color:#CC3322;"]');
    $.each(trAttacks, function () {
        var parsedTr = that._parseReportTr(this);

        if (parsedTr.imgLink == 'images/s/m3.gif') {


            var isMyLand = parsedTr.user == userData.user;

            var trInfo = $(table).find(this).next('tr').html();
            var lines = trInfo.split('<br>');

            if (lines.length > 1) {
                var landFrom, landTo;
                var isSuccess;
                var attack, defense;
                if (isMyLand) {
                    // pokud je to moje zeme, branil jsem - zeme druha je posledni ve strong
                    landFrom = parsedTr.land;
                    landTo = that._dataProvider.getLandByName($(lines[0]).find('strong:last()').html());
                    isSuccess = parsedTr.thumb == 'images/s/hand_down.gif';
                    defense = parseInt(lines[1].replace(/^\D+/g, ''));
                } else {
                    landTo = parsedTr.land;
                    landFrom = that._dataProvider.getLandByName($(lines[0]).find('strong:last()').html());
                    isSuccess = parsedTr.thumb == 'images/s/hand_up.gif';
                    attack = parseInt($($(lines[0]).find('strong')[1]).html());

                }

                if (lands[landFrom.id] == undefined) {
                    lands[landFrom.id] = {};
                    lands[landFrom.id].attacks = [];
                    lands[landFrom.id].spells = [];
                }
                if (lands[landFrom.id].attacks == undefined)
                    lands[landFrom.id].attacks = [];
                lands[landFrom.id].attacks.push({
                    landFrom: landFrom,
                    landTo: landTo,
                    isSuccess: isSuccess,
                    attack: attack,
                    defense: defense
                });
                if (isMyLand)
                    lands[landFrom.id].isMyLand = true;
            }
        }


    });

}
*/
// #endregion

// CONCATENATED MODULE: ./src/services/reports-service.ts
var reports_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class reports_service_ReportsService {
    constructor(dataProvider, metadataService, allianceService) {
        this.refresh = () => reports_service_awaiter(this, void 0, void 0, function* () {
            dlog('parsing spells from the alliance report');
            // TODO: only parse once per day
            const doc = yield getDomFromUrl('https://www.darkelf.cz/hlaseni_all.asp', 'GET');
            const spells = parseSpellsFromAllianceReport(doc, {
                id: Number(this.metadataService.metadata.playerId),
                name: this.metadataService.metadata.playerName
            }, this.allianceService.members, this.metadataService.metadata.leagueId);
            this.dataProvider.save(StorageKeysFunctions.ReportedSpells(this.metadataService.metadata.leagueId), spells);
            // TODO: read attacks
            // TODO: save attacks
        });
        this.dataProvider = dataProvider;
        this.metadataService = metadataService;
        this.allianceService = allianceService;
    }
    get spells() {
        return this.dataProvider.load(StorageKeysFunctions.ReportedSpells(this.metadataService.metadata.leagueId));
    }
}

// CONCATENATED MODULE: ./src/services/settings-service.ts


class settings_service_SettingsService {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
    }
    load(playerName) {
        return this.dataProvider.load(StorageKeys.PLAYER_SETTINGS) || DEFAULT_PLAYER_SETTINGS;
    }
    save(playerName, settings) {
        const newSettings = Object.assign(Object.assign({}, this.load(playerName)), settings);
        this.dataProvider.save(StorageKeys.PLAYER_SETTINGS, newSettings);
        dlog('player settings saved:', newSettings);
    }
}

// CONCATENATED MODULE: ./src/html-parsers/land/land-parser.ts

function parseLandFrame(doc, landId) {
    const rulerName = doc.getElementsByTagName('td')[1].childNodes.length < 2 ? "" : doc.getElementsByTagName('td')[1].innerText.replace(/\s/g, "").slice(0, -1);
    if (!rulerName)
        console.warn('parseLandFrame: Failed to parse rulerName of landId:', landId);
    const landName = LANDS[landId][0];
    const tds = [...doc.getElementsByTagName('td')];
    //const strengthCell: HTMLTableCellElement = tds.find(td=>td.style.color === 'rgb(255, 68, 68)');
    const strengthCell = [...doc.getElementsByTagName('th')][1];
    let strengthTdInnerText = strengthCell.innerText;
    let pos = strengthTdInnerText.search('\\(');
    if (pos != -1) {
        strengthTdInnerText = strengthTdInnerText.substr(pos + 1);
    }
    const strength = parseInt(strengthTdInnerText);
    if (!strength)
        console.warn('parseLandFrame: Failed to parse strength of landId:', landId);
    pos = strengthTdInnerText.search('\\+');
    const inhabitants = parseInt(strengthTdInnerText.substr(pos + 2));
    const race = parseInt([].slice.call(doc.querySelectorAll("a")).filter((x) => x.href.startsWith("https://www.darkelf.cz/prehled_ras.asp"))[0].href.split('=')[1]);
    if (!race)
        console.warn('parseLandFrame: Failed to parse race of landId:', landId);
    let minimalAttackArray = Array.prototype.slice.call(doc.getElementsByTagName('td')).filter((x) => x.style.color == "rgb(153, 153, 153)");
    let minimalAttack = NaN;
    if (minimalAttackArray.length > 0) {
        let minimalAttackText = minimalAttackArray[0].innerText.split(' ').slice(-1)[0];
        minimalAttack = parseInt(minimalAttackText);
    }
    let defClass = doc.getElementsByClassName('def');
    let bonusDefense = 0;
    if (defClass.length > 0) {
        bonusDefense = parseInt(defClass[0].children[1].innerText);
    }
    let incomeClass = doc.getElementsByClassName('mon2');
    let bonusGoldIncome = 0;
    if (incomeClass.length > 0) {
        bonusGoldIncome = parseInt(incomeClass[0].children[1].innerText);
    }
    const manaCell = $('td:contains("% mana")');
    const bonusManaIncome = manaCell[0]
        ? parseInt(manaCell[0].innerText.split('%')[0])
        : 0;
    return {
        inhabitants,
        rulerName,
        strength,
        race,
        bonusDefense,
        bonusGoldIncome,
        bonusManaIncome,
        landName,
        minimalAttack
    };
}

// CONCATENATED MODULE: ./src/services/land-history-service.ts
var land_history_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class land_history_service_LandHistoryService {
    constructor(dataProvider, metadatService) {
        this.refresh = () => land_history_service_awaiter(this, void 0, void 0, function* () {
            dlog('Land history REFRESH');
            const leagueMetadata = this.metadataService.metadata;
            if (!leagueMetadata) {
                console.warn('No metadata. Land history refresh stopped.');
                return;
            }
            if (leagueMetadata.day === 0
                && this.currentHistory
                && this.currentHistory[Object.keys(this.currentHistory)[0]].length > 1) {
                dlog(`Clearing ${this.currentHistory[Object.keys(this.currentHistory)[0]].length} days of old history.`);
                this.clearHistory(leagueMetadata.leagueId);
            }
            if (this.currentHistory
                && this.currentHistory[Object.keys(this.currentHistory)[0]][leagueMetadata.day]) {
                dlog(`History for day ${leagueMetadata.day} already exists.`);
                return;
            }
            if (leagueMetadata.leagueId.startsWith("T")) {
                dlog("Don't save history for training leagues");
                return;
            }
            const mapDoc = yield getDomFromUrl('https://www.darkelf.cz/map_new.asp', 'GET');
            yield this.save(mapDoc);
        });
        this.forceSave = (doc) => land_history_service_awaiter(this, void 0, void 0, function* () { return this.save(doc); });
        this.save = (doc) => land_history_service_awaiter(this, void 0, void 0, function* () {
            dlog('History save START.');
            const { leagueId } = this.metadataService.metadata;
            showLoading(getFrameDocument(FrameNames.Main));
            let landIds;
            const mapType = getMapType(leagueId);
            if (mapType === MapType.M) {
                // Small maps have only a subset of lands.
                // This subset depends on visible areas which might be different for each league.
                // Therefore, we will get the land ids by reading the map.
                // TODO: This doesn't work anymore. Or at least in DMs.
                // Would probably need to hardcode the IDs for each specific mini league.
                landIds = [...doc.querySelectorAll('.land')]
                    .map((landEl) => landEl.dataset.id);
            }
            else {
                landIds = getLandIds(getMapType(leagueId));
            }
            const updatedHistory = yield this.parseAndAppendTodayToCurrentHistory(this.currentHistory, landIds);
            this.dataProvider.save(StorageKeysFunctions.LandsHistory(leagueId), updatedHistory);
            hideLoading(getFrameDocument(FrameNames.Main));
            dlog('History save DONE.');
        });
        this.deleteOld = () => {
            let leaguesATag = Array.prototype.slice.call(document.getElementsByClassName('v'));
            leaguesATag.forEach((x) => {
                let leagueId = x.innerText;
                if (leagueId.substr(0, 4) == "Liga") {
                    leagueId = leagueId.substr(5);
                }
                this.dataProvider.delete(StorageKeysFunctions.LandsHistory(leagueId));
            });
        };
        this.clearHistory = (leagueId) => {
            this.dataProvider.delete(StorageKeysFunctions.LandsHistory(leagueId));
        };
        this.renderStrengthForecast = (document, landId, defenseBonus) => {
            const landHistory = this.currentHistory[landId];
            const calcDefense = (jednicky, trojky, obyvatele, defenseBonus) => {
                let def = jednicky * 5 + trojky * 4;
                if (defenseBonus) {
                    def = Math.floor(def * (1 + defenseBonus / 100));
                }
                return def + obyvatele;
            };
            const stats = landHistory.reduce((acc, cv) => {
                const strDiff = Number(cv[3]) - acc[3];
                if (!strDiff)
                    return acc;
                const minAttack = Number(cv[1]);
                let jednicky = acc[0];
                let trojky = acc[1];
                let obyvatele = acc[2];
                switch (strDiff) {
                    case 6: {
                        jednicky++;
                        break;
                    }
                    case 12: {
                        jednicky += 2;
                        break;
                    }
                    case 14: {
                        jednicky++;
                        trojky++;
                        break;
                    }
                    case 20: {
                        jednicky += 2;
                        trojky++;
                        break;
                    }
                    case 22: {
                        jednicky++;
                        trojky += 2;
                        break;
                    }
                    case 28: {
                        jednicky += 2;
                        trojky += 2;
                        break;
                    }
                }
                const armyDef = calcDefense(jednicky, trojky, obyvatele, defenseBonus);
                if (minAttack - armyDef !== 1) {
                    obyvatele++;
                }
                return [jednicky, trojky, obyvatele, acc[3] + strDiff];
            }, [6, 2, 10, 52]); // jednicky, trojky, obyvatele, sila zeme
            const t1Def = calcDefense(stats[0] + 2, stats[1] + 2, stats[2] + 1, defenseBonus);
            const t2Def = calcDefense(stats[0] + 4, stats[1] + 4, stats[2] + 2, defenseBonus);
            const swordIcon = document.querySelector(`img[src="images/s/m.gif"]`);
            const forecastEl = document.createElement('td');
            forecastEl.style.whiteSpace = 'break-spaces';
            forecastEl.textContent = `Zítra.: ${t1Def + 1}\nPozítří: ${t2Def + 1}`;
            swordIcon.parentElement.parentElement.parentElement.appendChild(forecastEl);
        };
        this.renderLandHistory = (document, landId) => {
            const leagueMetadata = this.metadataService.metadata;
            if (!leagueMetadata || !this.currentHistory) {
                console.warn('Cannot render land history. Missing data.');
                return;
            }
            const landHistory = this.currentHistory[landId];
            const historyEl = document.createElement('div');
            historyEl.id = 'land-history';
            historyEl.setAttribute('style', `
            display: grid;
            grid-template-columns: 16px auto auto auto auto min-content;
            gap: 1px 2px;
            background: #2c200d;
            color: silver;
            padding: 3px;
            font-size: 11px;
            text-align: right;
            font-family: sans-serif;
            margin: 1px;
            white-space: nowrap;
        `);
            // history data: [inhabitants, minimalAttack, owner, power]
            historyEl.innerHTML = `
            <span>den</span>
            <span>vládce</span>
            <span>síla</span>
            <span>diff</span>
            <span>obyv.</span>
            <span>p.ú.</span>
    ` + `
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <span> </span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
    ` + landHistory
                .map((record, index, source) => `
            <strong>${index.toString()}</strong>
            <span>${record ? record[2] : '-'}</span>
            <span>${record ? record[3] : '-'}</span>
            <span>${record && source[index - 1] ? this.renderLandPowerDiff(Number(record[3]), (index === 0) ? 0 : Number(source[index - 1][3])) : '-'}</span>
            <span>${record ? record[0] : '-'}</span>
            <span>${record ? record[1] : '-'}</span>
        `)
                .reverse()
                .join('');
            document.body.append(historyEl);
        };
        this.parseAndAppendTodayToCurrentHistory = (currentHistory, landIds) => land_history_service_awaiter(this, void 0, void 0, function* () {
            const day = this.metadataService.metadata.day;
            let leagueHistory = currentHistory || {};
            const promises = landIds
                .map((id) => getDomFromUrl("https://www.darkelf.cz/l.asp?id=" + id, 'GET')
                .then((doc) => ({
                id,
                doc
            })));
            const results = yield Promise.all(promises);
            results.forEach((result) => {
                const { id, doc } = result;
                const parsedData = parseLandFrame(doc, Number(id));
                const newEntry = [
                    !isNaN(parsedData.inhabitants) ? parsedData.inhabitants.toString() : "",
                    !isNaN(parsedData.minimalAttack) ? parsedData.minimalAttack.toString() : "",
                    parsedData.rulerName,
                    parsedData.strength.toString()
                ];
                let landHistory = leagueHistory[id];
                // The history of current day has to be saved at matching index
                // so we can use the index for later retrieval (instead of including the
                // actual day info in data itself)
                if (!landHistory) {
                    leagueHistory[id] = new Array(day + 1);
                    leagueHistory[id][day] = newEntry;
                }
                else {
                    landHistory.length = day + 1;
                    landHistory[day] = newEntry;
                }
            });
            return leagueHistory;
        });
        this.dataProvider = dataProvider;
        this.metadataService = metadatService;
    }
    get currentHistory() {
        const currentHistory = this.dataProvider.load(StorageKeysFunctions.LandsHistory(this.metadataService.metadata.leagueId));
        if (!currentHistory || !Object.keys(currentHistory).length) {
            return null;
        }
        return currentHistory;
    }
    renderLandPowerDiff(currentPower, previousPower) {
        if (currentPower && previousPower) {
            let diff = currentPower - previousPower;
            if (diff === 0)
                return '';
            let sign = '';
            if (diff > 0)
                sign = '+';
            return `${sign}${diff}`;
        }
        return '';
    }
}

// CONCATENATED MODULE: ./src/db/units-db.ts
const UNITS_DB = {
    0: {
        magical: { attack: 4, defense: 4, costGold: 150, costMana: 20, pay: 10 },
        defensive: { attack: 1, defense: 5, costGold: 30, costMana: 0, pay: 1 },
        offensive: { attack: 7, defense: 3, costGold: 90, costMana: 7, pay: 5 }
    },
    1: {
        defensive: { attack: 4, defense: 3, pay: 2, costGold: 40, costMana: 0 },
        offensive: { attack: 9, defense: 3, pay: 4, costGold: 100, costMana: 5 },
        magical: { attack: 5, defense: 4, pay: 11, costGold: 160, costMana: 20 }
    },
    2: {
        defensive: { attack: 2, defense: 4, pay: 2, costGold: 30, costMana: 0 },
        offensive: { attack: 5, defense: 3, pay: 8, costGold: 200, costMana: 9 },
        magical: { attack: 3, defense: 3, pay: 14, costGold: 100, costMana: 30 }
    },
    3: {
        defensive: { attack: 3, defense: 3, pay: 2, costGold: 50, costMana: 0 },
        offensive: { attack: 7, defense: 1, pay: 5, costGold: 130, costMana: 4 },
        magical: { attack: 5, defense: 3, pay: 16, costGold: 120, costMana: 30 }
    },
    4: {
        defensive: { attack: 1, defense: 4, pay: 1, costGold: 10, costMana: 0 },
        offensive: { attack: 7, defense: 2, pay: 3, costGold: 0, costMana: 15 },
        magical: { attack: 5, defense: 3, pay: 10, costGold: 150, costMana: 15 }
    },
    5: {
        defensive: { attack: 2, defense: 5, pay: 1, costGold: 0, costMana: 4 },
        offensive: { attack: 7, defense: 2, pay: 6, costGold: 0, costMana: 20 },
        magical: { attack: 3, defense: 5, pay: 7, costGold: 0, costMana: 15 }
    },
    6: {
        defensive: { attack: 2, defense: 6, pay: 1, costGold: 30, costMana: 0 },
        offensive: { attack: 6, defense: 5, pay: 5, costGold: 60, costMana: 8 },
        magical: { attack: 5, defense: 5, pay: 9, costGold: 100, costMana: 15 }
    },
    7: {
        defensive: { attack: 3, defense: 5, pay: 1, costGold: 30, costMana: 0 },
        offensive: { attack: 8, defense: 3, pay: 5, costGold: 50, costMana: 9 },
        magical: { attack: 4, defense: 5, pay: 10, costGold: 60, costMana: 10 }
    },
    8: {
        defensive: { attack: 2, defense: 7, pay: 1, costGold: 10, costMana: 0 },
        offensive: { attack: 5, defense: 6, pay: 3, costGold: 40, costMana: 2 },
        magical: { attack: 3, defense: 7, pay: 9, costGold: 200, costMana: 2 }
    },
    9: {
        defensive: { attack: 2, defense: 2, pay: 3, costGold: 22, costMana: 0 },
        offensive: { attack: 4, defense: 2, pay: 10, costGold: 100, costMana: 10 },
        magical: { attack: 1, defense: 2, pay: 17, costGold: 100, costMana: 25 }
    },
    10: {
        defensive: { attack: 4, defense: 6, pay: 0, costGold: 20, costMana: 0 },
        offensive: { attack: 8, defense: 8, pay: 0, costGold: 100, costMana: 0 },
        magical: { attack: 3, defense: 6, pay: 0, costGold: 200, costMana: 0 }
    },
};

// CONCATENATED MODULE: ./src/db/artifacts-db.ts
/*
1 - plast
2 - hlava
3 - zbran
4 - telo
5 - prsten
6 - stit
7 - kapsa
8 - boty

https://www.darkelf.cz/artefacts_all.asp
11 zakladnich setu (je v tom 2x nekro)
3 draci sety
20 unikatu

sety
1 - de
2 - vasek
3 - nekro s mecem
4 - nekro s holi
5 - mag
6 - rytir
7 - trpaslik
8 - elf
9 - zbrojnos
10 - skret
11 - legionar
20 - stribrny drak
21 - zlaty drak
22 - cerny drak

 */
// TODO: Add Dragon sets
const ARTIFACTS_DB = JSON.parse(`{"images/ar/de1.jpg":{"img":"images/ar/de1.jpg","name":"Plášť mlhy","set":1,"slot":1,"survival":0,"escape":10,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":30,"spellPower":0,"thieving":16,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/de2.jpg":{"img":"images/ar/de2.jpg","name":"Koruna nadvlády","set":1,"slot":2,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":12,"defenseBonus":0,"magicalDefense":0,"spellPower":6,"thieving":0,"destruction":0,"efficiency":3,"repairCost":16},"images/ar/de3.jpg":{"img":"images/ar/de3.jpg","name":"Dark Elfí hůl","set":1,"slot":3,"survival":0,"escape":0,"attack":5,"attackBonus":5,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":14,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/de4.jpg":{"img":"images/ar/de4.jpg","name":"Roucho Dark Elfa","set":1,"slot":4,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":30,"defenseBonus":5,"magicalDefense":16,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/de5.jpg":{"img":"images/ar/de5.jpg","name":"Jeden Prsten","set":1,"slot":5,"survival":10,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":16,"thieving":0,"destruction":12,"efficiency":0,"repairCost":16},"images/ar/de6.jpg":{"img":"images/ar/de6.jpg","name":"Ohnivý štít","set":1,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":30,"defenseBonus":16,"magicalDefense":30,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/de7.jpg":{"img":"images/ar/de7.jpg","name":"Palantir moci","set":1,"slot":7,"survival":16,"escape":16,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":16,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/de8.jpg":{"img":"images/ar/de8.jpg","name":"Dračí boty","set":1,"slot":8,"survival":0,"escape":20,"attack":0,"attackBonus":0,"defense":16,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":1,"repairCost":16},"images/ar/kr1.jpg":{"img":"images/ar/kr1.jpg","name":"Hermelínový plášť","set":2,"slot":1,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":20,"defenseBonus":8,"magicalDefense":20,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/kr2.jpg":{"img":"images/ar/kr2.jpg","name":"Svatováclavská Koruna","set":2,"slot":2,"survival":12,"escape":0,"attack":0,"attackBonus":2,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":20,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/kr3.jpg":{"img":"images/ar/kr3.jpg","name":"Meč Krále Václava","set":2,"slot":3,"survival":0,"escape":0,"attack":4,"attackBonus":4,"defense":30,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/kr4.jpg":{"img":"images/ar/kr4.jpg","name":"Zbroj Českého Lva","set":2,"slot":4,"survival":20,"escape":0,"attack":0,"attackBonus":0,"defense":36,"defenseBonus":4,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/kr5.jpg":{"img":"images/ar/kr5.jpg","name":"Žezlo","set":2,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":15,"spellPower":15,"thieving":0,"destruction":20,"efficiency":0,"repairCost":16},"images/ar/kr6.jpg":{"img":"images/ar/kr6.jpg","name":"Královské jablko","set":2,"slot":6,"survival":20,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":9,"thieving":0,"destruction":0,"efficiency":4,"repairCost":16},"images/ar/kr7.jpg":{"img":"images/ar/kr7.jpg","name":"Královský dekret","set":2,"slot":7,"survival":0,"escape":0,"attack":1,"attackBonus":2,"defense":0,"defenseBonus":0,"magicalDefense":15,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/kr8.jpg":{"img":"images/ar/kr8.jpg","name":"Královské boty","set":2,"slot":8,"survival":0,"escape":20,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":7,"magicalDefense":0,"spellPower":8,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/ne1.jpg":{"img":"images/ar/ne1.jpg","name":"Plášť temnoty","set":3,"slot":1,"survival":0,"escape":10,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":20,"spellPower":0,"thieving":10,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/ne2.jpg":{"img":"images/ar/ne2.jpg","name":"Helma nazgůla","set":3,"slot":2,"survival":5,"escape":0,"attack":0,"attackBonus":0,"defense":20,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":2,"repairCost":8},"images/ar/ne3a.jpg":{"img":"images/ar/ne3a.jpg","name":"Angmarský meč","set":3,"slot":3,"survival":0,"escape":0,"attack":4,"attackBonus":4,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":1,"repairCost":8},"images/ar/ne3b.jpg":{"img":"images/ar/ne3b.jpg","name":"Angmarská hůl","set":3,"slot":3,"survival":0,"escape":0,"attack":3,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":12,"thieving":0,"destruction":0,"efficiency":1,"repairCost":8},"images/ar/ne4.jpg":{"img":"images/ar/ne4.jpg","name":"Černá zbroj","set":3,"slot":4,"survival":10,"escape":0,"attack":0,"attackBonus":0,"defense":30,"defenseBonus":0,"magicalDefense":10,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/ne5.jpg":{"img":"images/ar/ne5.jpg","name":"Amulet smrti","set":3,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":10,"magicalDefense":0,"spellPower":6,"thieving":0,"destruction":10,"efficiency":0,"repairCost":8},"images/ar/ne6.jpg":{"img":"images/ar/ne6.jpg","name":"Štít Smrtihlav","set":3,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":30,"defenseBonus":10,"magicalDefense":10,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/ne7.jpg":{"img":"images/ar/ne7.jpg","name":"Kniha mrtvých","set":3,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":10,"spellPower":8,"thieving":0,"destruction":10,"efficiency":0,"repairCost":8},"images/ar/ne8.jpg":{"img":"images/ar/ne8.jpg","name":"Černé holenice","set":3,"slot":8,"survival":0,"escape":10,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":10,"destruction":6,"efficiency":0,"repairCost":8},"images/ar/m1.jpg":{"img":"images/ar/m1.jpg","name":"Šarlatový plášť","set":5,"slot":1,"survival":10,"escape":10,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":22,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/m2.jpg":{"img":"images/ar/m2.jpg","name":"Klobouk Špičák","set":5,"slot":2,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":10,"defenseBonus":0,"magicalDefense":10,"spellPower":0,"thieving":0,"destruction":0,"efficiency":2,"repairCost":8},"images/ar/m3.jpg":{"img":"images/ar/m3.jpg","name":"Hůl mága","set":5,"slot":3,"survival":0,"escape":0,"attack":3,"attackBonus":3,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":13,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/m4.jpg":{"img":"images/ar/m4.jpg","name":"Modré roucho","set":5,"slot":4,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":20,"defenseBonus":3,"magicalDefense":12,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/m5.jpg":{"img":"images/ar/m5.jpg","name":"Dračí kámen","set":5,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":12,"spellPower":8,"thieving":0,"destruction":0,"efficiency":1,"repairCost":8},"images/ar/m6.jpg":{"img":"images/ar/m6.jpg","name":"Ochranný amulet","set":5,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":20,"defenseBonus":12,"magicalDefense":20,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/m7.jpg":{"img":"images/ar/m7.jpg","name":"Věštící koule","set":5,"slot":7,"survival":0,"escape":12,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":4,"thieving":12,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/m8.jpg":{"img":"images/ar/m8.jpg","name":"Boty z baziliška","set":5,"slot":8,"survival":0,"escape":12,"attack":0,"attackBonus":0,"defense":10,"defenseBonus":0,"magicalDefense":0,"spellPower":6,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/kn1.jpg":{"img":"images/ar/kn1.jpg","name":"Hedvábný plášť","set":6,"slot":1,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":1,"thieving":0,"destruction":6,"efficiency":0,"repairCost":4},"images/ar/kn2.jpg":{"img":"images/ar/kn2.jpg","name":"Rytířská přilba","set":6,"slot":2,"survival":4,"escape":0,"attack":0,"attackBonus":1,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/kn3.jpg":{"img":"images/ar/kn3.jpg","name":"Rytířský meč","set":6,"slot":3,"survival":0,"escape":0,"attack":2,"attackBonus":4,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":3,"efficiency":0,"repairCost":4},"images/ar/kn4.jpg":{"img":"images/ar/kn4.jpg","name":"Plátová zbroj","set":6,"slot":4,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":2,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":4,"destruction":0,"efficiency":1,"repairCost":4},"images/ar/kn5.jpg":{"img":"images/ar/kn5.jpg","name":"Safírový prsten","set":6,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":1,"thieving":2,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/kn6.jpg":{"img":"images/ar/kn6.jpg","name":"Erbovní štít","set":6,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":3,"defenseBonus":0,"magicalDefense":10,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/kn7.jpg":{"img":"images/ar/kn7.jpg","name":"Kniha kouzel","set":6,"slot":7,"survival":0,"escape":0,"attack":1,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":1,"destruction":0,"efficiency":1,"repairCost":4},"images/ar/kn8.jpg":{"img":"images/ar/kn8.jpg","name":"Železné obutí","set":6,"slot":8,"survival":2,"escape":0,"attack":0,"attackBonus":0,"defense":2,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":8,"efficiency":0,"repairCost":4},"images/ar/dw1.jpg":{"img":"images/ar/dw1.jpg","name":"Hornická pláštěnka","set":7,"slot":1,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":4,"defenseBonus":0,"magicalDefense":12,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dw2.jpg":{"img":"images/ar/dw2.jpg","name":"Trpasličí helma","set":7,"slot":2,"survival":10,"escape":0,"attack":0,"attackBonus":0,"defense":11,"defenseBonus":4,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dw3.jpg":{"img":"images/ar/dw3.jpg","name":"Válečná sekera","set":7,"slot":3,"survival":0,"escape":0,"attack":2,"attackBonus":0,"defense":9,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":1,"repairCost":4},"images/ar/dw4.jpg":{"img":"images/ar/dw4.jpg","name":"Drátěná košile","set":7,"slot":4,"survival":7,"escape":0,"attack":0,"attackBonus":0,"defense":14,"defenseBonus":4,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dw5.jpg":{"img":"images/ar/dw5.jpg","name":"Smaragdový prsten","set":7,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":6,"spellPower":0,"thieving":7,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dw6.jpg":{"img":"images/ar/dw6.jpg","name":"Klanový štít","set":7,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":9,"defenseBonus":4,"magicalDefense":5,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dw7.jpg":{"img":"images/ar/dw7.jpg","name":"Stéla stařešiny","set":7,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":2,"magicalDefense":10,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dw8.jpg":{"img":"images/ar/dw8.jpg","name":"Havířské boty","set":7,"slot":8,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":5,"defenseBonus":2,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":1,"efficiency":0,"repairCost":4},"images/ar/el1.jpg":{"img":"images/ar/el1.jpg","name":"Plášť z Lórienu","set":8,"slot":1,"survival":5,"escape":5,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":10,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/el2.jpg":{"img":"images/ar/el2.jpg","name":"Fëanorova přilba","set":8,"slot":2,"survival":3,"escape":0,"attack":0,"attackBonus":0,"defense":8,"defenseBonus":3,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/el3.jpg":{"img":"images/ar/el3.jpg","name":"Meč Andúril","set":8,"slot":3,"survival":0,"escape":0,"attack":3,"attackBonus":2,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/el4.jpg":{"img":"images/ar/el4.jpg","name":"Mithrilová zbroj","set":8,"slot":4,"survival":6,"escape":0,"attack":0,"attackBonus":0,"defense":14,"defenseBonus":0,"magicalDefense":6,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/el5.jpg":{"img":"images/ar/el5.jpg","name":"Prsten naděje","set":8,"slot":5,"survival":0,"escape":10,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":4,"thieving":0,"destruction":0,"efficiency":2,"repairCost":4},"images/ar/el6.jpg":{"img":"images/ar/el6.jpg","name":"Elfí štít","set":8,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":10,"defenseBonus":4,"magicalDefense":10,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/el7.jpg":{"img":"images/ar/el7.jpg","name":"Noldorský luk","set":8,"slot":7,"survival":0,"escape":0,"attack":1,"attackBonus":1,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/el8.jpg":{"img":"images/ar/el8.jpg","name":"Zdobené boty","set":8,"slot":8,"survival":4,"escape":10,"attack":0,"attackBonus":0,"defense":2,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/l1.jpg":{"img":"images/ar/l1.jpg","name":"Drátěná pláštěnka","set":9,"slot":1,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":3,"defenseBonus":3,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/l2.jpg":{"img":"images/ar/l2.jpg","name":"Železný klobouk","set":9,"slot":2,"survival":2,"escape":0,"attack":0,"attackBonus":0,"defense":1,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/l3.jpg":{"img":"images/ar/l3.jpg","name":"Železné kopí","set":9,"slot":3,"survival":0,"escape":0,"attack":1,"attackBonus":0,"defense":2,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/l4.jpg":{"img":"images/ar/l4.jpg","name":"Lněný varkoč","set":9,"slot":4,"survival":1,"escape":0,"attack":0,"attackBonus":0,"defense":2,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/l5.jpg":{"img":"images/ar/l5.jpg","name":"Mosazný prsten","set":9,"slot":5,"survival":1,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":1,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/l6.jpg":{"img":"images/ar/l6.jpg","name":"Dřevěný štít","set":9,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":8,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/l7.jpg":{"img":"images/ar/l7.jpg","name":"Ochranný pentagram","set":9,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":5,"spellPower":1,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/l8.jpg":{"img":"images/ar/l8.jpg","name":"Kožené boty","set":9,"slot":8,"survival":2,"escape":2,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/or1.jpg":{"img":"images/ar/or1.jpg","name":"Vlčí kožešina","set":10,"slot":1,"survival":1,"escape":2,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/or2.jpg":{"img":"images/ar/or2.jpg","name":"Skřetí přilba","set":10,"slot":2,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":1,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/or3.jpg":{"img":"images/ar/or3.jpg","name":"Skřetí šavle","set":10,"slot":3,"survival":0,"escape":0,"attack":1,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/or4.jpg":{"img":"images/ar/or4.jpg","name":"Skřetí zbroj","set":10,"slot":4,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":5,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/or5.jpg":{"img":"images/ar/or5.jpg","name":"Železný prsten","set":10,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":1,"repairCost":2},"images/ar/or6.jpg":{"img":"images/ar/or6.jpg","name":"Skřetí štít","set":10,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":2,"defenseBonus":2,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/or7.jpg":{"img":"images/ar/or7.jpg","name":"Lebka mága","set":10,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":10,"efficiency":0,"repairCost":2},"images/ar/or8.jpg":{"img":"images/ar/or8.jpg","name":"Skřetí bagančata","set":10,"slot":8,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":1,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/leg1.jpg":{"img":"images/ar/leg1.jpg","name":"Plášť centuria","set":11,"slot":1,"survival":3,"escape":0,"attack":0,"attackBonus":0,"defense":2,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/leg2.jpg":{"img":"images/ar/leg2.jpg","name":"Přilba legionáře","set":11,"slot":2,"survival":2,"escape":0,"attack":0,"attackBonus":0,"defense":5,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/leg3.jpg":{"img":"images/ar/leg3.jpg","name":"Gladius","set":11,"slot":3,"survival":0,"escape":0,"attack":1,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":2,"efficiency":0,"repairCost":2},"images/ar/leg4.jpg":{"img":"images/ar/leg4.jpg","name":"Legionářská zbroj","set":11,"slot":4,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":4,"defenseBonus":1,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/leg5.jpg":{"img":"images/ar/leg5.jpg","name":"Rubínový prsten","set":11,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":1,"spellPower":1,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/leg6.jpg":{"img":"images/ar/leg6.jpg","name":"Legionářský štít","set":11,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":10,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/leg7.jpg":{"img":"images/ar/leg7.jpg","name":"Magický svitek","set":11,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":2,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/leg8.jpg":{"img":"images/ar/leg8.jpg","name":"Legionářské sandály","set":11,"slot":8,"survival":0,"escape":1,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":2,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/pen.jpg":{"img":"images/ar/pen.jpg","name":"Kronikářský brk","set":0,"slot":7,"survival":0,"escape":0,"attack":3,"attackBonus":3,"defense":30,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":1},"images/ar/mandra.jpg":{"img":"images/ar/mandra.jpg","name":"Irsilova Mandragora","set":0,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":10,"defenseBonus":3,"magicalDefense":0,"spellPower":0,"thieving":10,"destruction":0,"efficiency":0,"repairCost":6},"images/ar/pohar_lp.jpg":{"img":"images/ar/pohar_lp.jpg","name":"Pletronův pohár","set":0,"slot":2,"survival":0,"escape":0,"attack":0,"attackBonus":1,"defense":18,"defenseBonus":4,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/kopi.jpg":{"img":"images/ar/kopi.jpg","name":"Roderikovo kopí","set":0,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":1,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":20,"efficiency":0,"repairCost":6},"images/ar/mucho.jpg":{"img":"images/ar/mucho.jpg","name":"Paprskova houba","set":0,"slot":7,"survival":10,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":10,"destruction":20,"efficiency":0,"repairCost":8},"images/ar/medaile.jpg":{"img":"images/ar/medaile.jpg","name":"Řád Celegorna","set":0,"slot":2,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":14,"defenseBonus":0,"magicalDefense":10,"spellPower":5,"thieving":0,"destruction":0,"efficiency":0,"repairCost":6},"images/ar/Hul_nagi.jpg":{"img":"images/ar/Hul_nagi.jpg","name":"Hůlka naginaty","set":0,"slot":3,"survival":0,"escape":0,"attack":3,"attackBonus":3,"defense":0,"defenseBonus":3,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":6},"images/ar/smaragd.jpg":{"img":"images/ar/smaragd.jpg","name":"Zelího Smaragd ","set":0,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":1,"defense":8,"defenseBonus":8,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":10},"images/ar/kus.jpg":{"img":"images/ar/kus.jpg","name":"Modrá kuše","set":0,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":26,"defenseBonus":12,"magicalDefense":0,"spellPower":8,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/hul.jpg":{"img":"images/ar/hul.jpg","name":"Torgova hůl","set":0,"slot":3,"survival":0,"escape":0,"attack":4,"attackBonus":0,"defense":30,"defenseBonus":0,"magicalDefense":0,"spellPower":13,"thieving":0,"destruction":0,"efficiency":0,"repairCost":12},"images/ar/safir.jpg":{"img":"images/ar/safir.jpg","name":"Pattonův Safír","set":0,"slot":5,"survival":0,"escape":5,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":5,"efficiency":3,"repairCost":6},"images/ar/packa.jpg":{"img":"images/ar/packa.jpg","name":"Dexterova packa","set":0,"slot":4,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":20,"defenseBonus":4,"magicalDefense":0,"spellPower":3,"thieving":0,"destruction":0,"efficiency":0,"repairCost":16},"images/ar/remdih.jpg":{"img":"images/ar/remdih.jpg","name":"Řemdih Brčka","set":0,"slot":3,"survival":0,"escape":0,"attack":4,"attackBonus":4,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":3,"repairCost":10},"images/ar/plast.jpg":{"img":"images/ar/plast.jpg","name":"Plášť štěstí","set":0,"slot":1,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":10,"defenseBonus":5,"magicalDefense":15,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":6},"images/ar/mesec.jpg":{"img":"images/ar/mesec.jpg","name":"Yakushiho měšec","set":0,"slot":7,"survival":0,"escape":6,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":3,"magicalDefense":0,"spellPower":0,"thieving":20,"destruction":0,"efficiency":0,"repairCost":6},"images/ar/vidle.jpg":{"img":"images/ar/vidle.jpg","name":"Saykovy vidle","set":0,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":2,"defense":12,"defenseBonus":5,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":10},"images/ar/brcko.jpg":{"img":"images/ar/brcko.jpg","name":"Kronikářské brčko","set":0,"slot":7,"survival":0,"escape":0,"attack":1,"attackBonus":1,"defense":20,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":1},"images/ar/darek.jpg":{"img":"images/ar/darek.jpg","name":"Dárek - překvapení","set":0,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":1},"images/ar/astrolab.png":{"img":"images/ar/astrolab.png","name":"Astroláb","set":0,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":2,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":9,"thieving":0,"destruction":20,"efficiency":0,"repairCost":1},"images/ar/paleta.png":{"img":"images/ar/paleta.png","name":"Malířská paleta","set":0,"slot":2,"survival":0,"escape":0,"attack":0,"attackBonus":2,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":6,"thieving":20,"destruction":0,"efficiency":0,"repairCost":1},"images/ar/dr_b1.png":{"img":"images/ar/dr_b1.png","name":"Stříbrné křídlo","set":20,"slot":1,"survival":0,"escape":5,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":2,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/dr_b2.png":{"img":"images/ar/dr_b2.png","name":"Stříbrná hlava","set":20,"slot":2,"survival":5,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":5,"efficiency":0,"repairCost":2},"images/ar/dr_b3.png":{"img":"images/ar/dr_b3.png","name":"Stříbrný pařát","set":20,"slot":3,"survival":0,"escape":0,"attack":2,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":2,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/dr_b4.png":{"img":"images/ar/dr_b4.png","name":"Stříbrné tělo","set":20,"slot":4,"survival":5,"escape":0,"attack":0,"attackBonus":0,"defense":7,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/dr_b5.png":{"img":"images/ar/dr_b5.png","name":"Stříbrné oko","set":20,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":10,"spellPower":2,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/dr_b6.png":{"img":"images/ar/dr_b6.png","name":"Stříbrné zuby","set":20,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":1,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":5,"efficiency":0,"repairCost":2},"images/ar/dr_b7.png":{"img":"images/ar/dr_b7.png","name":"Stříbrná krev","set":20,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":1,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":2,"thieving":0,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/dr_b8.png":{"img":"images/ar/dr_b8.png","name":"Stříbrný ocas","set":20,"slot":8,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":2,"magicalDefense":0,"spellPower":0,"thieving":3,"destruction":0,"efficiency":0,"repairCost":2},"images/ar/dr_zl1.png":{"img":"images/ar/dr_zl1.png","name":"Zlaté křídlo","set":21,"slot":1,"survival":0,"escape":6,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":3,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dr_zl2.png":{"img":"images/ar/dr_zl2.png","name":"Zlatá hlava","set":21,"slot":2,"survival":7,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":6,"efficiency":0,"repairCost":4},"images/ar/dr_zl3.png":{"img":"images/ar/dr_zl3.png","name":"Zlatý pařát","set":21,"slot":3,"survival":0,"escape":0,"attack":2,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":3,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dr_zl4.png":{"img":"images/ar/dr_zl4.png","name":"Zlaté tělo","set":21,"slot":4,"survival":7,"escape":0,"attack":0,"attackBonus":0,"defense":14,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dr_zl5.png":{"img":"images/ar/dr_zl5.png","name":"Zlaté oko","set":21,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":15,"spellPower":3,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dr_zl6.png":{"img":"images/ar/dr_zl6.png","name":"Zlaté zuby","set":21,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":1,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":6,"efficiency":0,"repairCost":4},"images/ar/dr_zl7.png":{"img":"images/ar/dr_zl7.png","name":"Zlatá krev","set":21,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":1,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":3,"thieving":0,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dr_zl8.png":{"img":"images/ar/dr_zl8.png","name":"Zlatý ocas","set":21,"slot":8,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":3,"magicalDefense":0,"spellPower":0,"thieving":5,"destruction":0,"efficiency":0,"repairCost":4},"images/ar/dr_ce1.png":{"img":"images/ar/dr_ce1.png","name":"Černé křídlo","set":22,"slot":1,"survival":0,"escape":7,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":5,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/dr_ce2.png":{"img":"images/ar/dr_ce2.png","name":"Černá hlava","set":22,"slot":2,"survival":10,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":7,"efficiency":0,"repairCost":8},"images/ar/dr_ce3.png":{"img":"images/ar/dr_ce3.png","name":"Černý pařát","set":22,"slot":3,"survival":0,"escape":0,"attack":3,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":3,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/dr_ce4.png":{"img":"images/ar/dr_ce4.png","name":"Černé tělo","set":22,"slot":4,"survival":10,"escape":0,"attack":0,"attackBonus":0,"defense":20,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/dr_ce5.png":{"img":"images/ar/dr_ce5.png","name":"Černé oko","set":22,"slot":5,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":0,"magicalDefense":20,"spellPower":6,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/dr_ce6.png":{"img":"images/ar/dr_ce6.png","name":"Černé zuby","set":22,"slot":6,"survival":0,"escape":0,"attack":0,"attackBonus":2,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":0,"thieving":0,"destruction":12,"efficiency":0,"repairCost":8},"images/ar/dr_ce7.png":{"img":"images/ar/dr_ce7.png","name":"Černá krev","set":22,"slot":7,"survival":0,"escape":0,"attack":0,"attackBonus":1,"defense":0,"defenseBonus":0,"magicalDefense":0,"spellPower":5,"thieving":0,"destruction":0,"efficiency":0,"repairCost":8},"images/ar/dr_ce8.png":{"img":"images/ar/dr_ce8.png","name":"Černý ocas","set":22,"slot":8,"survival":0,"escape":0,"attack":0,"attackBonus":0,"defense":0,"defenseBonus":5,"magicalDefense":0,"spellPower":0,"thieving":5,"destruction":0,"efficiency":0,"repairCost":8}}`);
const ARTIFACT_SET_VALUES = {
    0: {
        survival: 0,
        escape: 0,
        attack: 0,
        attackBonus: 0,
        defense: 0,
        defenseBonus: 0,
        magicalDefense: 0,
        spellPower: 0,
        thieving: 0,
        destruction: 0,
        efficiency: 0,
        repairCost: 0
    },
    1: {
        survival: 28,
        escape: 49,
        attack: 6,
        attackBonus: 6,
        defense: 92,
        defenseBonus: 23,
        magicalDefense: 79,
        spellPower: 39,
        thieving: 34,
        destruction: 13,
        efficiency: 6,
        repairCost: 64
    },
    2: {
        survival: 55,
        escape: 21,
        attack: 7,
        attackBonus: 11,
        defense: 89,
        defenseBonus: 22,
        magicalDefense: 53,
        spellPower: 35,
        thieving: 21,
        destruction: 21,
        efficiency: 5,
        repairCost: 64
    },
    3: {
        survival: 17,
        escape: 22,
        attack: 5,
        attackBonus: 5,
        defense: 83,
        defenseBonus: 22,
        magicalDefense: 54,
        spellPower: 16,
        thieving: 22,
        destruction: 29,
        efficiency: 5,
        repairCost: 32
    },
    4: {
        survival: 17,
        escape: 22,
        attack: 4,
        attackBonus: 0,
        defense: 83,
        defenseBonus: 22,
        magicalDefense: 54,
        spellPower: 29,
        thieving: 22,
        destruction: 29,
        efficiency: 5,
        repairCost: 32
    },
    5: {
        survival: 11,
        escape: 37,
        attack: 4,
        attackBonus: 4,
        defense: 64,
        defenseBonus: 17,
        magicalDefense: 81,
        spellPower: 35,
        thieving: 13,
        destruction: 0,
        efficiency: 5,
        repairCost: 32
    },
    6: {
        survival: 8,
        escape: 0,
        attack: 5,
        attackBonus: 7,
        defense: 10,
        defenseBonus: 0,
        magicalDefense: 11,
        spellPower: 4,
        thieving: 10,
        destruction: 20,
        efficiency: 4,
        repairCost: 16
    },
    7: {
        survival: 19,
        escape: 0,
        attack: 3,
        attackBonus: 0,
        defense: 58,
        defenseBonus: 21,
        magicalDefense: 37,
        spellPower: 0,
        thieving: 8,
        destruction: 2,
        efficiency: 2,
        repairCost: 16
    },
    8: {
        survival: 22,
        escape: 28,
        attack: 6,
        attackBonus: 5,
        defense: 38,
        defenseBonus: 9,
        magicalDefense: 29,
        spellPower: 5,
        thieving: 0,
        destruction: 0,
        efficiency: 3,
        repairCost: 16
    },
    9: {
        survival: 10,
        escape: 3,
        attack: 2,
        attackBonus: 0,
        defense: 21,
        defenseBonus: 4,
        magicalDefense: 6,
        spellPower: 2,
        thieving: 2,
        destruction: 0,
        efficiency: 0,
        repairCost: 8
    },
    10: {
        survival: 2,
        escape: 3,
        attack: 2,
        attackBonus: 0,
        defense: 11,
        defenseBonus: 3,
        magicalDefense: 0,
        spellPower: 0,
        thieving: 2,
        destruction: 11,
        efficiency: 2,
        repairCost: 8
    },
    11: {
        survival: 7,
        escape: 2,
        attack: 2,
        attackBonus: 0,
        defense: 25,
        defenseBonus: 2,
        magicalDefense: 2,
        spellPower: 5,
        thieving: 3,
        destruction: 3,
        efficiency: 0,
        repairCost: 8
    },
    20: {
        survival: 0,
        escape: 0,
        attack: 0,
        attackBonus: 0,
        defense: 0,
        defenseBonus: 0,
        magicalDefense: 0,
        spellPower: 0,
        thieving: 0,
        destruction: 0,
        efficiency: 0,
        repairCost: 0
    },
    21: {
        survival: 0,
        escape: 0,
        attack: 0,
        attackBonus: 0,
        defense: 0,
        defenseBonus: 0,
        magicalDefense: 0,
        spellPower: 0,
        thieving: 0,
        destruction: 0,
        efficiency: 0,
        repairCost: 0
    },
    22: {
        survival: 0,
        escape: 0,
        attack: 0,
        attackBonus: 0,
        defense: 0,
        defenseBonus: 0,
        magicalDefense: 0,
        spellPower: 0,
        thieving: 0,
        destruction: 0,
        efficiency: 0,
        repairCost: 0
    },
};

// CONCATENATED MODULE: ./src/html-parsers/magic-parser.ts

function parseFlyingSpells(doc) {
    const spellElements = [...doc.querySelectorAll('span[id_spell]')];
    return spellElements.map(se => {
        return {
            spell: SPELLS_DB[Number(se.getAttribute('id_type'))],
            spellPower: Number(se.getAttribute('power')),
            landId: Number(se.getAttribute('id_land')),
            sourcePlayer: {
                id: Number(se.getAttribute('id_player')),
                name: se.getAttribute('name_player')
            },
            targetPlayer: {
                id: Number(se.getAttribute('id_player_defender')),
                name: se.getAttribute('name_defender')
            }
        };
    });
}

// CONCATENATED MODULE: ./src/services/magic-service.ts
var magic_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class magic_service_MagicService {
    constructor(dataProvider, metadataService, allianceService) {
        this.refresh = () => magic_service_awaiter(this, void 0, void 0, function* () {
            yield this.parseFlyingSpells();
        });
        this.dataProvider = dataProvider;
        this.metadataService = metadataService;
        this.allianceService = allianceService;
    }
    parseFlyingSpells() {
        return magic_service_awaiter(this, void 0, void 0, function* () {
            dlog('parsing flying spells');
            const doc = yield getDomFromUrl('https://www.darkelf.cz/spells_list.asp?sort=1', 'GET');
            const flyingSpells = parseFlyingSpells(doc);
            this.dataProvider.save(StorageKeysFunctions.FlyingSpells(this.metadataService.metadata.leagueId), flyingSpells);
        });
    }
    get flyingSpells() {
        return this.dataProvider.load(StorageKeysFunctions.FlyingSpells(this.metadataService.metadata.leagueId));
    }
}

// CONCATENATED MODULE: ./src/db/enums.ts
var RacesEnum;
(function (RacesEnum) {
    RacesEnum[RacesEnum["Lide"] = 0] = "Lide";
    RacesEnum[RacesEnum["Barbari"] = 1] = "Barbari";
    RacesEnum[RacesEnum["Skreti"] = 2] = "Skreti";
    RacesEnum[RacesEnum["Skuruti"] = 3] = "Skuruti";
    RacesEnum[RacesEnum["Nekromanti"] = 4] = "Nekromanti";
    RacesEnum[RacesEnum["Magove"] = 5] = "Magove";
    RacesEnum[RacesEnum["Elfove"] = 6] = "Elfove";
    RacesEnum[RacesEnum["TemniElfove"] = 7] = "TemniElfove";
    RacesEnum[RacesEnum["Trpaslici"] = 8] = "Trpaslici";
    RacesEnum[RacesEnum["Hobiti"] = 9] = "Hobiti";
    RacesEnum[RacesEnum["Enti"] = 10] = "Enti";
})(RacesEnum || (RacesEnum = {}));
//matching IDs with in game values
var ContractTypeEnum;
(function (ContractTypeEnum) {
    ContractTypeEnum[ContractTypeEnum["War"] = 6] = "War";
    ContractTypeEnum[ContractTypeEnum["Trade"] = 3] = "Trade";
    ContractTypeEnum[ContractTypeEnum["Magic"] = 2] = "Magic";
    ContractTypeEnum[ContractTypeEnum["Alliance"] = 1] = "Alliance";
    ContractTypeEnum[ContractTypeEnum["Peace"] = 7] = "Peace";
    ContractTypeEnum[ContractTypeEnum["FreePass"] = 4] = "FreePass";
    ContractTypeEnum[ContractTypeEnum["NoTreaty"] = 5] = "NoTreaty";
    ContractTypeEnum[ContractTypeEnum["Nothing"] = 0] = "Nothing";
})(ContractTypeEnum || (ContractTypeEnum = {}));
var UnitTypeEnum;
(function (UnitTypeEnum) {
    UnitTypeEnum[UnitTypeEnum["Defensive"] = 0] = "Defensive";
    UnitTypeEnum[UnitTypeEnum["Offensive"] = 1] = "Offensive";
    UnitTypeEnum[UnitTypeEnum["Magical"] = 2] = "Magical";
})(UnitTypeEnum || (UnitTypeEnum = {}));
var ContractTargetLandTypeEnum;
(function (ContractTargetLandTypeEnum) {
    ContractTargetLandTypeEnum[ContractTargetLandTypeEnum["Mine"] = 0] = "Mine";
    ContractTargetLandTypeEnum[ContractTargetLandTypeEnum["Ally"] = 1] = "Ally";
    ContractTargetLandTypeEnum[ContractTargetLandTypeEnum["Neutral"] = 2] = "Neutral";
    ContractTargetLandTypeEnum[ContractTargetLandTypeEnum["Enemy"] = 3] = "Enemy";
})(ContractTargetLandTypeEnum || (ContractTargetLandTypeEnum = {}));
//matching IDs with in game values
//todo ostatne rasove stavby
var BuildingEnum;
(function (BuildingEnum) {
    BuildingEnum[BuildingEnum["Dilna"] = 90] = "Dilna";
    BuildingEnum[BuildingEnum["PosvatnaStudna"] = 45] = "PosvatnaStudna";
    BuildingEnum[BuildingEnum["SypkaObilna"] = 50] = "SypkaObilna";
    BuildingEnum[BuildingEnum["RudnyDul"] = 70] = "RudnyDul";
    BuildingEnum[BuildingEnum["ZlatyDul"] = 140] = "ZlatyDul";
    BuildingEnum[BuildingEnum["PolniModlitebna"] = 40] = "PolniModlitebna";
    BuildingEnum[BuildingEnum["KamenneCesty"] = 85] = "KamenneCesty";
    BuildingEnum[BuildingEnum["Katapult"] = 60] = "Katapult";
    BuildingEnum[BuildingEnum["CechValky"] = 115] = "CechValky";
    BuildingEnum[BuildingEnum["Arena"] = 120] = "Arena";
    BuildingEnum[BuildingEnum["Cviciste"] = 105] = "Cviciste";
    BuildingEnum[BuildingEnum["ObranneVozy"] = 100] = "ObranneVozy";
    BuildingEnum[BuildingEnum["DreveneHradby"] = 110] = "DreveneHradby";
    BuildingEnum[BuildingEnum["MalaPevnost"] = 145] = "MalaPevnost";
    BuildingEnum[BuildingEnum["StredniPevnost"] = 170] = "StredniPevnost";
    BuildingEnum[BuildingEnum["VelkaPevnost"] = 210] = "VelkaPevnost";
    BuildingEnum[BuildingEnum["ObrannaMagickaVez"] = 125] = "ObrannaMagickaVez";
    BuildingEnum[BuildingEnum["ObradniSvatyne"] = 130] = "ObradniSvatyne";
    BuildingEnum[BuildingEnum["MalaMagickaVez"] = 160] = "MalaMagickaVez";
    BuildingEnum[BuildingEnum["StredniMagVez"] = 165] = "StredniMagVez";
    BuildingEnum[BuildingEnum["CechMagie"] = 118] = "CechMagie";
    BuildingEnum[BuildingEnum["Chram"] = 180] = "Chram";
    BuildingEnum[BuildingEnum["VelkaMagVez"] = 200] = "VelkaMagVez";
    BuildingEnum[BuildingEnum["Hrbitov"] = 83] = "Hrbitov";
    BuildingEnum[BuildingEnum["Trziste"] = 20] = "Trziste";
    BuildingEnum[BuildingEnum["Obetiste"] = 80] = "Obetiste";
    BuildingEnum[BuildingEnum["HospodaProHrdinu"] = 30] = "HospodaProHrdinu";
    BuildingEnum[BuildingEnum["StrojCasu"] = 240] = "StrojCasu";
    BuildingEnum[BuildingEnum["BranaCasu"] = 250] = "BranaCasu";
})(BuildingEnum || (BuildingEnum = {}));

// CONCATENATED MODULE: ./src/db/buildings-db.ts
//todo ostatne rasove stavby
const BUILDINGS_DB = {
    90: { "name": "Dilna", "gold": 600, "mana": 0 },
    45: { "name": "Posvatna studna", "gold": 700, "mana": 0 },
    50: { "name": "Sypka - obilna", "gold": 1000, "mana": 0 },
    70: { "name": "Rudny dul", "gold": 1400, "mana": 0 },
    140: { "name": "Zlaty dul", "gold": 2500, "mana": 0 },
    40: { "name": "Polni modlitebna", "gold": 700, "mana": 100 },
    85: { "name": "Kamenne cesty", "gold": 1600, "mana": 0 },
    60: { "name": "Katapult", "gold": 2000, "mana": 0 },
    115: { "name": "Cech valky", "gold": 3000, "mana": 0 },
    120: { "name": "Arena", "gold": 3600, "mana": 0 },
    105: { "name": "Cviciste", "gold": 1600, "mana": 0 },
    100: { "name": "Obranne vozy", "gold": 1800, "mana": 0 },
    110: { "name": "Drevene hradby", "gold": 2000, "mana": 0 },
    145: { "name": "Mala pevnost", "gold": 5000, "mana": 0 },
    170: { "name": "Stredni pevnost", "gold": 10000, "mana": 0 },
    210: { "name": "Velka pevnost", "gold": 30000, "mana": 0 },
    125: { "name": "Obranna magicka vez", "gold": 200, "mana": 200 },
    130: { "name": "Obradni svatyne", "gold": 300, "mana": 300 },
    160: { "name": "Mala magicka vez", "gold": 700, "mana": 700 },
    165: { "name": "Stredni mag vez", "gold": 2000, "mana": 2000 },
    118: { "name": "Cech magie", "gold": 3500, "mana": 0 },
    180: { "name": "Chram", "gold": 6000, "mana": 600 },
    200: { "name": "Velka mag vez", "gold": 10000, "mana": 10000 },
    83: { "name": "Hrbitov", "gold": 300, "mana": 30 },
    20: { "name": "Trziste", "gold": 400, "mana": 0 },
    80: { "name": "Obetiste", "gold": 1500, "mana": 100 },
    30: { "name": "Hospoda pro hrdinu", "gold": 5000, "mana": 0 },
    240: { "name": "Stroj casu", "gold": 8000, "mana": 8000 },
    250: { "name": "Brana casu", "gold": 16000, "mana": 16000 }
};

// CONCATENATED MODULE: ./src/lib/play-turn-calc.ts



class play_turn_calc_PlayTurnCalc {
    nextTurn() {
        let goldIncome = this.landsGoldIncome() * this.playerInfo.rank / 1000;
        let manaIncome = this.landsManaIncome() * this.playerInfo.rank / 1000;
        let alliancePayConst = this.playerInfo.race == RacesEnum.Hobiti ? 0.05 : 0.04;
        let alliancePaymentGold = this.playerInfo.inAlliance ? Math.floor(goldIncome * alliancePayConst) : 0;
        let alliancePaymentMana = this.playerInfo.inAlliance ? Math.floor(manaIncome * alliancePayConst) : 0;
        //todo
    }
    landsGoldIncome() {
        let totalIncome = 0;
        for (let land in this.playerLands) {
            let landIncome = this.calculateGoldIncome(parseInt(land));
            totalIncome += landIncome;
            dlog(landIncome, land);
        }
        return totalIncome;
    }
    landsManaIncome() {
        let totalIncome = 0;
        for (let land in this.playerLands) {
            let l = this.playerLands[parseInt(land)];
            totalIncome += this.calculateManaIncome(l);
        }
        return totalIncome;
    }
    calculateManaIncome(land) {
        let mageIncome = Math.floor(land.army.magical * this.weather.mana * land.bonuses.incomeMana);
        let contractsIncome = 0;
        Object.keys(land.diplomacy).forEach((key) => {
            let contract = land.diplomacy[key];
            if (contract.type == ContractTypeEnum.Magic) {
                let magicUnits = this.getLandMages(contract.targetLandId);
                //Only up to 2.25x inhabs can be calculated
                contractsIncome += Math.floor(magicUnits * 0.2);
            }
        });
        let buildingIncome = 0;
        buildingIncome += land.buildings.includes(BuildingEnum.PosvatnaStudna) ? 5 : 0;
        //todo towers,magicky haj
        let totalIncome = mageIncome + contractsIncome + buildingIncome;
        return totalIncome;
    }
    calculateGoldIncome(landId) {
        //todo check if land bonus income only affects inhabitants
        let land = this.playerLands[landId];
        let magicMultiplier = ((land.spellEffects.goldIncome / 100));
        let dielnaMultiplier = land.buildings.includes(BuildingEnum.Dilna) ? 1.05 : 1;
        let inhabsIncome = Math.floor(land.inhabitants * 5 * this.weather.gold / 100 * (land.bonuses.incomeGold + 100) / 100);
        inhabsIncome = Math.floor(dielnaMultiplier * inhabsIncome);
        let contractsIncome = 0;
        Object.keys(land.diplomacy).forEach((key) => {
            let contract = land.diplomacy[key];
            if (contract.type == ContractTypeEnum.Trade && contract.validFromTomorrow == false) {
                let contractInhab = this.getLandInhabs(contract.targetLandId);
                let thisContractInhab = contractInhab * 0.9;
                let thisLandMinIncome = land.inhabitants * 2;
                //use min of these two
                let income = thisContractInhab > thisLandMinIncome ? thisLandMinIncome : thisContractInhab;
                contractsIncome += income;
            }
        });
        contractsIncome = Math.floor(contractsIncome);
        contractsIncome = Math.floor(contractsIncome * dielnaMultiplier);
        let constBuildingIncome = 0;
        constBuildingIncome += land.buildings.includes(BuildingEnum.RudnyDul) ? 50 : 0;
        constBuildingIncome += land.buildings.includes(BuildingEnum.ZlatyDul) ? 100 : 0;
        let totalIncome = Math.round(magicMultiplier * (contractsIncome + inhabsIncome + constBuildingIncome));
        let totalIncome1 = Math.round(magicMultiplier * contractsIncome) + Math.round(magicMultiplier * inhabsIncome) + Math.round(magicMultiplier * constBuildingIncome);
        let pays = this.playerInfo.soldierPay;
        let totalSoldierPay = land.army.defensive * pays.defense + land.army.offensive * pays.offensive + land.army.magical * pays.magical;
        dlog(totalIncome1 - totalSoldierPay);
        return totalIncome - totalSoldierPay;
    }
    getLandMages(landId) {
        let thisLand = this.playerLands[landId];
        if (thisLand !== undefined)
            return thisLand.army.magical;
        let alliedLand = this.allianceLandsNearby[landId];
        if (alliedLand !== undefined)
            return alliedLand.magicalUnits;
        return 0;
    }
    getLandInhabs(landId) {
        let thisLand = this.playerLands[landId];
        if (thisLand !== undefined)
            return thisLand.inhabitants;
        let alliedLand = this.allianceLandsNearby[landId];
        if (alliedLand !== undefined)
            return alliedLand.inhabitants;
        return 0;
    }
    buildBuilding(landId, building) {
        let b = BUILDINGS_DB[building];
        if (b.gold > this.playerInfo.gold) {
            dlog("Not enough gold to build this", landId, building);
            return;
        }
        if (b.mana > this.playerInfo.mana) {
            dlog("Not enough mana to build this", landId, building);
            return;
        }
        let land = this.playerLands[landId];
        if (land.buildings.includes(building)) {
            dlog("This building is already built", landId, building);
            return;
        }
        //todo obmedzenia na pevnosti a veze
        land.buildings.push(building);
        this.playerInfo.gold -= b.gold;
        this.playerInfo.mana -= b.mana;
    }
    buildSypka(landId) {
        this.buildBuilding(landId, BuildingEnum.SypkaObilna);
    }
    buildStudna(landId) {
        this.buildBuilding(landId, BuildingEnum.PosvatnaStudna);
    }
    buildHouses(landId, housesCount) {
        let land = this.playerLands[landId];
        let housesCost = this.celkovaCenuDomu(land.houses, housesCount, this.weather.houseCost);
        if (housesCost > this.playerInfo.gold) {
            dlog("Not enough gold to build houses", landId, housesCost);
            return;
        }
        land.houses += housesCount;
        this.playerInfo.gold -= housesCost;
    }
    //COPY PASTE FROM DE source code
    celkovaCenuDomu(celkemDomu, chciKoupit, pocasi) {
        var priceHouse;
        var total = 0;
        for (let c = 0; c < chciKoupit; c++) {
            priceHouse = Math.floor((60 + Math.pow((celkemDomu + 1 + c) / 9, 2)) * pocasi / 100); // +1 je proto, ze kupuji dalsi dum
            total = total + priceHouse;
        }
        return total;
    }
}
class play_turn_calc_Land {
    growInhabitants() {
        let armyCount = this.army.defensive + this.army.offensive + this.army.magical;
        let baseGrowth = 1 + Math.floor(this.inhabitants / 20) + (this.buildings.includes(BuildingEnum.SypkaObilna) ? 2 : 0);
        let maxGrowth = Math.floor(baseGrowth * (this.spellEffects.natality / 100));
        let emptyHouses = this.houses - this.inhabitants - armyCount;
        this.inhabitants += emptyHouses > maxGrowth ? maxGrowth : emptyHouses;
    }
}

// CONCATENATED MODULE: ./src/html-parsers/information-frame-parser.ts
function parseInfromationFrame(dom) {
    let actualGold = parseInt(dom.getElementsByTagName('span')[0].innerText);
    let actualMana = parseInt(dom.getElementsByTagName('span')[2].innerText);
    let turnsString = dom.getElementsByTagName('span')[3].innerText;
    let usedTurns = parseInt(turnsString);
    turnsString = turnsString.substr(turnsString.search(' / ') - 1);
    let maxTurns = parseInt(turnsString);
    return { actualGold, actualMana, maxTurns, usedTurns };
}

// CONCATENATED MODULE: ./src/html-parsers/central-parser.ts
function parseCentralFrame(doc) {
    let ids = [].slice.call(doc.querySelectorAll("a[target='mapa']")).map((x) => parseInt(x.href.split('=')[1]));
    let incomeSummaryRow = doc.querySelector('tr.br');
    if (!incomeSummaryRow) {
        // There's just a single land in the list and the summary is not rendered in that case
        return;
    }
    const possibleBaseRanks = [1000, 2000, 3000, 4000];
    const goldIncome = parseInt(incomeSummaryRow.children[1].innerText);
    const manaIncome = parseInt(incomeSummaryRow.children[2].innerText);
    let rankTr = incomeSummaryRow.nextElementSibling;
    const goldRankIncome = parseInt(rankTr.children[1].innerText);
    const manaRankIncome = parseInt(rankTr.children[2].innerText);
    const rank = parseInt(rankTr.children[3].innerText.split('(')[1]);
    let baseRank = 0;
    possibleBaseRanks.forEach(ele => {
        let multiplier = rank / ele;
        multiplier = multiplier > 2 ? 2 : multiplier;
        multiplier = multiplier < 0.25 ? 0.25 : multiplier;
        multiplier -= 1; //Aby sme zistili prijmy z hodnosti samotnej :)
        //TODO barbari mozu mat minimum 0.5 prijmov??
        if (Math.floor(goldIncome * multiplier) == goldRankIncome &&
            Math.floor(manaIncome * multiplier) == manaRankIncome) {
            baseRank = ele;
        }
    });
    if (baseRank == 0) {
        console.error("Cannot parse base rank! Probably code malfunction. FIX ME");
    }
    return { landIds: ids, actualRank: rank, baseLeagueRank: baseRank, baseGoldIncome: goldIncome, baseManaIncome: manaIncome };
}

// CONCATENATED MODULE: ./src/html-parsers/map-parser.ts
function parseMapPage(doc) {
    let result = { lands: {} };
    doc.querySelectorAll("div.land").forEach(x => {
        let landId = parseInt(x.id.substr(1));
        let aElems = x.querySelectorAll("a");
        let houseImageSrc = aElems[2].children[0].src;
        let towerImageSrc = aElems[3].children[0].src;
        //so many possibilities, so muh fun
        //Přístav Trákie (0) = Arekino (Kamarádi)\r ⧍71(5)   🙂66   ⚔0/0/0   ⛅50%-100%-100%
        //Thingolan (816) = Enfant terrible (DEgen a spol. 2C)
        //Korstan (176+15%)
        //Zem druidů (0) = Zimuzga\r⧍43(42)   🙂1   ⚔0/0/0
        //Kan el osir (407) = Arekino3 (Moria)\r⧍48(1)   🙂10   ⚔0/0→37/0
        let titleString = x.title;
        let strength = parseInt(titleString.split('(')[1]);
        let isNeutral = !titleString.includes('=');
        let isAllyOrMine = titleString.includes("\r");
        let land = { houseImageSrc, landId, towerImageSrc, isNeutral, strength };
        if (isAllyOrMine) {
            land.houses = parseInt(titleString.split('⧍')[1]);
            land.inhabitants = parseInt(titleString.split('🙂')[1]);
            land.units = parseUnitsFromTitle(titleString);
            if (titleString.includes('⛅')) {
                let effectString = titleString.split('⛅')[1];
                let tokens = effectString.split('-');
                land.magicEffects = { natality: parseInt(tokens[0]), gold: parseInt(tokens[1]), mana: parseInt(tokens[2]) };
            }
            else {
                land.magicEffects = { gold: 100, mana: 100, natality: 100 };
            }
        }
        result.lands[landId] = land;
    });
    return result;
}
//here we should already know its ally or mine
function parseUnitsFromTitle(str) {
    let unitsString = str.split('⚔')[1];
    let tokens = unitsString.split('/');
    let defensive = parseUnits(tokens[0]);
    let offensive = parseUnits(tokens[1]);
    let magical = parseUnits(tokens[2]);
    return { defensive, magical, offensive };
}
function parseUnits(str) {
    //on move exists
    if (str.includes('→')) {
        let onMove = parseInt(str.split('→')[1]);
        return { inLand: parseInt(str), onMove };
    }
    else {
        return { inLand: parseInt(str), onMove: 0 };
    }
}

// CONCATENATED MODULE: ./src/html-parsers/land/diplomacy-parser.ts

function parseDiplomacyPage(dom) {
    let [, , , , , ...rest] = dom.querySelectorAll('th');
    //pop first 5 items
    let contracts = [];
    rest.forEach(x => {
        let parsed = parseContract(x);
        contracts.push(parsed);
    });
    return { contracts };
}
//td is having land name
function parseContract(td) {
    let targetLandId = parseInt(td.children[1].href.split('=')[1]);
    //next sibling is td showing actual type of contract
    let nextSibling = td.nextElementSibling;
    let nextSiblingStyle = nextSibling.attributes["style"].value;
    let color = nextSiblingStyle.slice(-8, -1);
    let type = colorToContractType(color);
    let validFromTomorrow = nextSibling.innerHTML.includes("<small>");
    let targetLandType = classNameToTargetLandType(td.className);
    return { targetLandId, targetLandType, type, validFromTomorrow };
}
//should be #xxxxxx color, but also no color is possible (some random values probably ht:bold)
function colorToContractType(color) {
    switch (color) {
        case "#FF4444":
            return ContractTypeEnum.War;
        case "#FFDD44":
            return ContractTypeEnum.Trade;
        case "#55AAFF":
            return ContractTypeEnum.Magic;
        case "#CCCCCC":
            return ContractTypeEnum.Alliance;
        case "#00CC00":
            return ContractTypeEnum.Peace;
        case "#CC55DD":
            return ContractTypeEnum.FreePass;
        case "#999999":
            return ContractTypeEnum.NoTreaty;
        default:
            return ContractTypeEnum.Nothing;
    }
}
function classNameToTargetLandType(className) {
    switch (className) {
        case "lg":
            return ContractTargetLandTypeEnum.Mine;
        case "rd":
            return ContractTargetLandTypeEnum.Enemy;
        case "br2":
            return ContractTargetLandTypeEnum.Neutral;
        case "man":
            return ContractTargetLandTypeEnum.Ally;
    }
}

// CONCATENATED MODULE: ./src/html-parsers/land/building-parser.ts
function parseBuildingPage(dom) {
    let result = [];
    dom.querySelectorAll("option").forEach(x => {
        if (parseInt(x.value) > 5000) {
            result.push(parseInt(x.value) - 5000);
        }
    });
    return { built: result };
}

// CONCATENATED MODULE: ./src/html-parsers/top-frame-parser.ts
function parseTopFrame(dom) {
    return !!dom.querySelector('div.r_nav') || !!dom.querySelector('table#subdiv_center')
        ? parseSimpleSkinFrame(dom)
        : parsePictureSkinFrame(dom);
}
function parseSimpleSkinFrame(dom) {
    const navigationLinks = Array.prototype.slice.call(dom.getElementsByTagName('a'));
    const reportLink = navigationLinks.filter((link) => link.pathname === '/hlaseni.asp')[0];
    return parseReportTitle(reportLink.title);
}
function parsePictureSkinFrame(dom) {
    const navigationLinks = Array.prototype.slice.call(dom.getElementsByTagName('a'));
    const reportLink = navigationLinks.filter((link) => link.pathname === '/hlaseni.asp')[0];
    const reportImage = reportLink.children[0];
    return parseReportTitle(reportImage.title);
}
const parseReportTitle = (reportTitle) => {
    // The regexp is looking for "Den: 5" and "100-150-50" strings. SK variant ('deň') should be covered.
    const matches = reportTitle.match(/De\w:\s(\d+)[^\d]*(\d+-\d+-\d+)/);
    if (!matches) {
        console.warn('Failed to parse the top frame info.');
        return;
    }
    const day = Number(matches[1]);
    const weather = matches[2].split('-');
    const weatherGold = Number(weather[0]);
    const weatherMana = Number(weather[1]);
    const weatherHouses = Number(weather[2]);
    return { day, weatherGold, weatherMana, weatherHouses };
};

// CONCATENATED MODULE: ./src/services/create-player-turn-calc-service.ts
var create_player_turn_calc_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











class create_player_turn_calc_service_CreatePlayerTurnService {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
    }
    FetchData() {
        return create_player_turn_calc_service_awaiter(this, void 0, void 0, function* () {
            let result = new play_turn_calc_PlayTurnCalc();
            let parsedInfo = parseInfromationFrame(yield getDomFromUrl('https://www.darkelf.cz/lista_informace.asp', 'GET'));
            let weather = parseTopFrame(yield getDomFromUrl('https://www.darkelf.cz/Lista_Horni.asp', 'GET'));
            result.weather = { gold: weather.weatherGold, houseCost: weather.weatherHouses, mana: weather.weatherMana };
            let centralFrameData = parseCentralFrame(yield (yield getDomFromUrl('https://www.darkelf.cz/centrala.asp', 'GET')));
            let ids = centralFrameData.landIds;
            result.playerInfo = { baseRank: centralFrameData.baseLeagueRank, gold: parsedInfo.actualGold, inAlliance: true,
                mana: parsedInfo.actualMana, race: RacesEnum.Barbari, rank: centralFrameData.actualRank, turnsRemaining: parsedInfo.maxTurns - parsedInfo.usedTurns,
                soldierPay: { defense: 0, magical: 0, offensive: 0 }, baseGoldIncome: centralFrameData.baseGoldIncome, baseManaIncome: centralFrameData.baseManaIncome };
            let mapData = parseMapPage(yield getDomFromUrl('https://www.darkelf.cz/map_new.asp', 'GET'));
            result.playerLands = {};
            result.allianceLandsNearby = {};
            let landPromise = [];
            let diplomacyPromise = [];
            let buildingPromise = [];
            ids.forEach(element => {
                let domProm = getDomFromUrl('https://www.darkelf.cz/l.asp?id=' + element, 'GET');
                landPromise.push({ domProm: domProm, id: element });
            });
            ids.forEach(element => {
                let domProm = getDomFromUrl('https://www.darkelf.cz/b.asp?id=' + element, 'GET');
                buildingPromise.push({ domProm: domProm, id: element });
            });
            ids.forEach(element => {
                let domProm = getDomFromUrl('https://www.darkelf.cz/c.asp?id=' + element, 'GET');
                diplomacyPromise.push({ domProm: domProm, id: element });
            });
            let landResolved = [];
            let diplomacyResolved = [];
            let buildingResolved = [];
            for (let index = 0; index < landPromise.length; index++) {
                const p = landPromise[index];
                landResolved.push({ d: yield p.domProm, id: p.id });
            }
            for (let index = 0; index < buildingPromise.length; index++) {
                const p = buildingPromise[index];
                buildingResolved.push({ d: yield p.domProm, id: p.id });
            }
            for (let index = 0; index < diplomacyPromise.length; index++) {
                const p = diplomacyPromise[index];
                diplomacyResolved.push({ d: yield p.domProm, id: p.id });
            }
            landResolved.forEach(x => {
                let land = new play_turn_calc_Land();
                let landId = x.id;
                let info = parseLandFrame(x.d, landId);
                land.bonuses = { defense: info.bonusDefense, incomeGold: info.bonusGoldIncome, incomeMana: info.bonusManaIncome };
                result.playerInfo.race = info.race;
                let units = UNITS_DB[info.race];
                result.playerInfo.soldierPay = { defense: units.defensive.pay, magical: units.magical.pay, offensive: units.offensive.pay };
                let mapLand = mapData.lands[landId];
                let defensive = mapLand.units.defensive.inLand + mapLand.units.defensive.onMove;
                let offensive = mapLand.units.offensive.inLand + mapLand.units.offensive.onMove;
                let magical = mapLand.units.magical.inLand + mapLand.units.magical.onMove;
                land.army = { defensive, offensive, magical };
                land.houses = land.houses = mapLand.houses;
                land.inhabitants = mapLand.inhabitants;
                land.spellEffects = { goldIncome: 100, manaIncome: 100, natality: 100 };
                if (mapLand.magicEffects !== undefined) {
                    land.spellEffects = { goldIncome: mapLand.magicEffects.gold, manaIncome: mapLand.magicEffects.mana, natality: mapLand.magicEffects.natality };
                }
                result.playerLands[landId] = land;
            });
            diplomacyResolved.forEach(x => {
                let diplomacy = parseDiplomacyPage(x.d);
                result.playerLands[x.id].diplomacy = diplomacy.contracts;
                diplomacy.contracts.forEach(x => {
                    if (x.targetLandType == ContractTargetLandTypeEnum.Ally) {
                        let allyLandInfo = mapData.lands[x.targetLandId];
                        let magicalUnits = allyLandInfo.units.magical;
                        result.allianceLandsNearby[x.targetLandId] =
                            { inhabitants: allyLandInfo.inhabitants, magicalUnits: magicalUnits.inLand + magicalUnits.onMove };
                    }
                });
            });
            buildingResolved.forEach(x => {
                let built = parseBuildingPage(x.d);
                result.playerLands[x.id].buildings = built.built;
            });
            let r = [];
            for (let key in result.playerLands) {
                let value = result.playerLands[key];
                // Use `key` and `value`
                var v = result.calculateGoldIncome(parseInt(key));
                r.push(v);
            }
            return result;
        });
    }
}

// CONCATENATED MODULE: ./src/lib/utils.ts
var utils_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};












function dlog(message, ...optionalParams) {
    if (unsafeWindow.de_debug)
        console.log(message, ...optionalParams);
}
function getServices(dataProvider) {
    const metadataService = new metadata_service_MetadataService(dataProvider);
    const settingsService = new settings_service_SettingsService(dataProvider);
    const allianceService = new alliance_service_AllianceService(dataProvider, metadataService);
    const reportsService = new reports_service_ReportsService(dataProvider, metadataService, allianceService);
    const magicService = new magic_service_MagicService(dataProvider, metadataService, allianceService);
    const landHistoryService = new land_history_service_LandHistoryService(dataProvider, metadataService);
    const playerTurnCalcService = new create_player_turn_calc_service_CreatePlayerTurnService(dataProvider);
    return { metadataService, settingsService, allianceService, reportsService, magicService, landHistoryService, playerTurnCalcService };
}
function wrapLocationHandler(name, dataProvider, handler) {
    unsafeWindow.de_debug && console.group(name);
    handler(getServices(dataProvider));
    unsafeWindow.de_debug && console.groupEnd();
}
function getFrameDocument(frameName) {
    const frame = window.parent.document.getElementsByName(frameName)[0];
    return frame.contentDocument;
}
// The hero overview page layout doesn't use the same frame names
// as the game itself so we need to get the document differently.
function getFrameDocumentForHeroPanel() {
    let doc;
    try {
        doc = getFrameDocument(FrameNames.Left);
    }
    catch (e) {
        const frame = [...window.parent.document.querySelectorAll('.detail_frame')][0];
        if (!frame) {
            doc = window.document;
        }
        else {
            doc = frame.contentDocument;
        }
    }
    return doc;
}
function getDomFromUrl(url, method, body = undefined) {
    return utils_awaiter(this, void 0, void 0, function* () {
        const getBlob = (url) => {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                if (method.toUpperCase() == 'POST') {
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    var status = xhr.status;
                    if (status == 200) {
                        resolve(xhr.response);
                    }
                    else {
                        reject(status);
                    }
                };
                xhr.send(body);
            });
        };
        const readWithFileReaderAndWindowsEncoding = (inputFile) => {
            const temporaryFileReader = new FileReader();
            return new Promise((resolve, reject) => {
                temporaryFileReader.onerror = () => {
                    temporaryFileReader.abort();
                    reject(new DOMException("Problem parsing input file."));
                };
                temporaryFileReader.onload = () => {
                    resolve(temporaryFileReader.result);
                };
                temporaryFileReader.readAsText(inputFile, 'windows-1250');
            });
        };
        var res = (yield getBlob(url));
        var text = (yield readWithFileReaderAndWindowsEncoding(res));
        var dom = new DOMParser().parseFromString(text, 'text/html');
        return dom;
    });
}
function showLoading(document) {
    var div = document.createElement('div');
    document.body.append(div);
    div.outerHTML = `
        <div id="loading_screen" style="position: fixed; top: 0; left: 0; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; z-index:100; background: rgba(0,0,0,0.4);">
            <img src="https://i.giphy.com/media/RHEqKwRZDwFKE/giphy.webp"/>
        </div>
    `;
}
function hideLoading(document) {
    document.getElementById("loading_screen").remove();
}
function findBestArtifactFor(artifacts, primary, secondary) {
    const reducer = (acc, cv) => {
        if (!acc)
            return cv;
        if (secondary && !acc[primary] && (cv[secondary] > acc[secondary]))
            return cv;
        return cv[primary] > acc[primary] ? cv : acc;
    };
    return artifacts.reduce(reducer, null);
}
function findBestArtifactForThievingAndDestruction(artifacts) {
    const reducer = (acc, cv) => {
        if (!acc)
            return cv;
        const cvSum = cv.thieving + cv.destruction;
        const accSum = acc.thieving + acc.destruction;
        return cvSum > accSum ? cv : acc;
    };
    return artifacts.reduce(reducer, null);
}
function findArtifactSets(artifacts) {
    let groupedBySet = artifacts.reduce((acc, cv) => {
        const set = Number(cv.set);
        acc[set] = acc[set] ? [...acc[set], cv] : [cv];
        return acc;
    }, {});
    const possibleSetIds = Object.keys(groupedBySet).filter(setId => groupedBySet[Number(setId)].length > 7);
    Object.keys(groupedBySet).forEach(key => {
        if (!possibleSetIds.includes(key))
            delete groupedBySet[Number(key)];
    });
    return groupedBySet;
}
// TODO: Make one specific function for thieving+desctruction
// combination, where both values are equal,
// unlike the usual primary>secondary relationship
function findBestArtifactInAllSlotsFor(artifacts, primary, secondary) {
    const groupedBySlot = artifacts
        .reduce((acc, cv) => {
        const slot = Number(cv.slot);
        acc[slot] = acc[slot] ? [...acc[slot], cv] : [cv];
        return acc;
    }, {});
    const bestSingles = Object
        .keys(groupedBySlot)
        .map(key => findBestArtifactFor(groupedBySlot[Number(key)], primary, secondary));
    let sets = findArtifactSets(artifacts);
    // TODO: also handle secondary value
    const choosingTheBestSetReducer = (bestSetId, currentSetId) => {
        if (ARTIFACT_SET_VALUES[currentSetId][primary] > ARTIFACT_SET_VALUES[bestSetId][primary])
            return currentSetId;
        return bestSetId;
    };
    const bestSetId = Object.keys(sets).map(k => Number(k)).reduce(choosingTheBestSetReducer, 0);
    const primarySum = sumArtifactsByProperty(primary, bestSingles);
    return ARTIFACT_SET_VALUES[bestSetId][primary] > primarySum ? sets[bestSetId] : bestSingles;
}
function findBestThievingAndDestructionArtifacts(artifacts) {
    const groupedBySlot = artifacts
        .reduce((acc, cv) => {
        const slot = Number(cv.slot);
        acc[slot] = acc[slot] ? [...acc[slot], cv] : [cv];
        return acc;
    }, {});
    return Object
        .keys(groupedBySlot)
        .map(key => findBestArtifactForThievingAndDestruction(groupedBySlot[Number(key)]));
}
function sumArtifactsByProperty(property, artifacts) {
    const reducer = (acc, cv) => acc + cv[property];
    return artifacts.reduce(reducer, 0);
}
// Calculate total repair cost of all owned artifacts (calc with set discounts).
// Just make a sum and then subtract the discount of each complete set.
function calcTotalRepairCost(artifacts) {
    const sets = findArtifactSets(artifacts);
    let repairCost = sumArtifactsByProperty('repairCost', artifacts);
    Object.keys(sets).forEach(setId => repairCost -= ARTIFACT_SET_VALUES[Number(setId)].repairCost);
    return repairCost;
}
// TODO: Check for sets (similary as it's done when chosing the best arts to equip)\
// Note: This was primarily written just as stats report for available arts.
function sumArtifacts(artifacts, primary, secondary) {
    // TODO: use console.table
    const bestArts = findBestArtifactInAllSlotsFor(artifacts, primary, secondary);
    // TODO: Maybe update the 'findBest..' to only return 'used' artifacts?
    // only consider the artifacts which add to primary or secondary
    const usedArtifacts = bestArts.filter(a => a[primary] || a[secondary]);
    const primarySum = sumArtifactsByProperty(primary, usedArtifacts);
    const secondarySum = !!secondary && sumArtifactsByProperty(secondary, usedArtifacts);
    const repairCostSum = sumArtifactsByProperty('repairCost', usedArtifacts);
    let report = `Best artifacts for ${primary}:`;
    report += `\n${usedArtifacts
        .map(a => {
        let detail = `(+${a[primary]}`;
        if (secondary)
            detail += `, +${a[secondary]}`;
        detail += `, rep: ${a['repairCost']}`;
        detail += ')';
        return `${a.name} ${detail}`;
    })
        .join(',\n')}`;
    report += `\n\n${primary}: ${primarySum}`;
    if (secondary)
        report += `\n${secondary}: ${secondarySum}`;
    report += `\nrepair: ${repairCostSum}`;
    report += `\ncost per point: ${(repairCostSum / primarySum).toFixed(2)}`;
    report += `\n\nUsed ${usedArtifacts.length} from ${artifacts.length} artifacts.`;
    return report;
}
function printTopFixedDefense(artifacts) {
    dlog(sumArtifacts(artifacts, 'defense', 'defenseBonus'));
}
function printTopPercentualDefense(artifacts) {
    dlog(sumArtifacts(artifacts, 'defenseBonus', 'defense'));
}
function printTopFixedAttack(artifacts) {
    dlog(sumArtifacts(artifacts, 'attack', 'attackBonus'));
}
function printTopPercentualAttack(artifacts) {
    dlog(sumArtifacts(artifacts, 'attackBonus', 'attack'));
}
const calcGrowthPerTurn = (ppl, bonus, granary) => {
    let growth = Math.floor(ppl / 10) + (granary ? 6 : 2);
    growth = Math.floor(growth * bonus / 2);
    return growth;
};
const calcGrowth = (ppl, bonus, granaryTurn, turns) => {
    let rv = ppl;
    for (let i = 0; i < turns; i++) {
        rv += calcGrowthPerTurn(rv, bonus, granaryTurn <= i);
    }
    return rv;
};
const getMapType = (leagueId) => {
    if (leagueId[0] === 'S')
        return MapType.S;
    if (leagueId[0] === 'K')
        return MapType.K;
    if (leagueId.slice(-1) === 'm' ||
        leagueId.startsWith('DM') ||
        leagueId.startsWith('A') ||
        leagueId.startsWith('R'))
        return MapType.M;
    return MapType.Classic;
};
const getLandIds = (mapType) => {
    switch (mapType) {
        case MapType.S:
            return LAND_IDS_S;
        case MapType.K:
            return LAND_IDS_K;
        default:
            return LAND_IDS_CLASSIC;
    }
};
const getLandsByMapType = (mapType) => {
    switch (mapType) {
        case MapType.S:
            return LANDS_S;
        case MapType.K:
            return LANDS_K;
        default:
            return LANDS_CLASSIC;
    }
};
const calculateBuildHouseCost = (alreadyBuiltHouses, numberOfBuying, weatherHouses) => {
    let priceHouse;
    let total = 0;
    for (let c = 0; c < numberOfBuying; c++) {
        priceHouse = Math.floor((60 + Math.pow((alreadyBuiltHouses + 1 + c) / 9, 2)) * weatherHouses / 100); // +1 je proto, ze kupuji dalsi dum
        total = total + priceHouse;
    }
    return total;
};
const pickAttackUnit = (raceId) => {
    const units = UNITS_DB[raceId];
    switch (raceId) {
        case 6:
        case 5:
            return units.magical;
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 7:
        case 8:
        case 9:
        case 10:
        default:
            return units.offensive;
    }
};
const pickDefenseUnit = (raceId) => {
    return UNITS_DB[raceId].defensive;
};
const getSpellImgSrc = (id) => `images/kouzla/k${id}.gif`;

// CONCATENATED MODULE: ./src/html-parsers/land/economy-parser.ts
function parseEconomyFrame(dom) {
    const tdWithHouseCount = Array.prototype.slice.call(dom.getElementsByTagName('img')).filter((x) => x.src.match('https://www.darkelf.cz/images/m/.*gif'))[0].parentElement;
    const houses = parseInt(tdWithHouseCount.innerText);
    const tdWithInhabitants = tdWithHouseCount.parentElement.nextElementSibling.children[1];
    const inhabitants = parseInt(tdWithInhabitants.innerText);
    const tdSoldiers = tdWithInhabitants.parentElement.nextElementSibling.children[1];
    const soldiers = parseInt(tdSoldiers.innerText);
    const tdWithEmptyHouses = tdSoldiers.parentElement.nextElementSibling.children[1];
    const emptyHouses = parseInt(tdWithEmptyHouses.innerText);
    const tdWithInhabGrowth = tdWithEmptyHouses.parentElement.nextElementSibling.children[1];
    const inhabGrowth = parseInt(tdWithInhabGrowth.innerText);
    const race = parseInt([].slice.call(dom.querySelectorAll("a")).filter((x) => x.href.startsWith("https://www.darkelf.cz/prehled_ras.asp"))[0].href.split('=')[1]);
    let growthBonus = 1;
    const growthBonusCell = $(`th:contains("Vliv kouzel")`);
    if (growthBonusCell.length) {
        const hasDoubledBonus = $(`table tr.man2 td:contains("200%")`);
        growthBonus = hasDoubledBonus.length ? 2 : 0.5;
    }
    return {
        emptyHouses,
        houses,
        inhabGrowth,
        inhabitants,
        soldiers,
        race,
        growthBonus
    };
}

// CONCATENATED MODULE: ./src/lib/deficurky.ts
var deficurky_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






function fillDeficurkyFormFromURL() {
    const url = new URL(document.URL);
    if (url.searchParams.get("obyv") != undefined) {
        document.getElementsByTagName('input')[4].value = url.searchParams.get("obyv");
    }
    if (url.searchParams.get("kola") != undefined) {
        document.getElementsByTagName('input')[5].value = url.searchParams.get("kola");
    }
    if (url.searchParams.get("domy") != undefined) {
        document.getElementsByTagName('input')[10].value = url.searchParams.get("domy");
    }
    if (url.searchParams.get("pocasie") != undefined) {
        document.getElementsByTagName('input')[11].value = url.searchParams.get("pocasie");
    }
    if (url.searchParams.get("voj") != undefined) {
        document.getElementsByTagName('input')[12].value = url.searchParams.get("voj");
    }
}
function getInputForDeficurkyButton(economyDoc) {
    return deficurky_awaiter(this, void 0, void 0, function* () {
        const economyParsed = parseEconomyFrame(economyDoc);
        const topDoc = getFrameDocument(FrameNames.Top);
        const topParsed = parseTopFrame(topDoc);
        const infoDoc = getFrameDocument(FrameNames.Information);
        const infoParsed = parseInfromationFrame(infoDoc);
        const landId = parseInt(economyDoc.URL.split('=')[1]);
        let doc = getFrameDocument(FrameNames.Main);
        if (!doc.URL.match("https://www.darkelf.cz/map_new.asp.*")) {
            //dlog("Nie je mapa otvorena, pouzi request")
            doc = yield getDomFromUrl("https://www.darkelf.cz/map_new.asp", "GET");
        }
        // TODO: optimize: shouldn't read the whole map
        const natality = parseMapPage(doc).lands[landId].magicEffects.natality;
        // TODO: ulozit do data providera??
        return {
            houses: economyParsed.houses,
            inhabitants: economyParsed.inhabitants,
            soldiers: economyParsed.soldiers,
            turns: infoParsed.maxTurns - infoParsed.usedTurns,
            weatherHouses: topParsed.weatherHouses,
            growthBonus: economyParsed.growthBonus,
            natality,
            race: economyParsed.race
        };
    });
}

// CONCATENATED MODULE: ./src/locations/entry-map.ts
var entry_map_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const handler = (services) => entry_map_awaiter(void 0, void 0, void 0, function* () {
    const doc = getFrameDocument(FrameNames.Main);
    const youAreHere = doc.getElementById('YouAreHere');
    if (!youAreHere)
        return;
    const redArrowEl = youAreHere.firstElementChild;
    const { metadataService, allianceService, reportsService, landHistoryService } = services;
    metadataService.parseLeagueMetadata(redArrowEl);
    if (!metadataService.hasValidMetadata) {
        console.error('Nepodarilo se nacist metadata.');
        return;
    }
    // read the alliance/players data
    yield allianceService.refresh();
    // read reports
    yield reportsService.refresh();
    // read all lands details
    yield landHistoryService.refresh();
    // refresh the frame with navigation
    // (it was 'skipped' during the first render when there were
    // no metadata ready and it won't refresh itself anymore)
    // Additional Explanation:
    // The original loading process looks like this:
    // 1. User clicks login.
    // 2. All frames load and wait for user click on entry map.
    // 3. User clicks the entry map. The left and map frames are reloaded with new content. The top frame doesn't reload, as there is nothing new.
    // Top frame not refreshing is an issue because it has code which needs full metadata to work (which won't be available until the frame is refreshed AFTER the metadata is parsed)
    try {
        getFrameDocument(FrameNames.Top).location.reload();
        youAreHere.href = "https://www.darkelf.cz/map_new.asp";
        youAreHere.click();
    }
    catch (e) {
        console.error('Nepodarilo se obnovit menu frame.', e);
    }
});
const entryMapHandler = (dataProvider) => wrapLocationHandler('Entry map', dataProvider, handler);

// CONCATENATED MODULE: ./src/lib/magical-defense.ts

//everything here is almost copypaste from original deking
function calulateMO(strength, minimalAttack, bonusDefense, day) {
    let i;
    const maxJednotiek = Math.floor((strength - 16) / 6) + 1;
    for (i = 0; i < maxJednotiek; i++) {
        const pocetTrojek = (strength - i * 6) / 8;
        const ZvysokPoTrojkach = (strength - i * 6) % 8;
        if (ZvysokPoTrojkach != 0) {
            continue; //tolkoto jednotiek nemoze byt
        }
        // const obrana = Math.floor((i * 5 + pocetDvojek * 4) * (1 + (bonusDefense / 100))) + 10;
        let obyv = minimalAttack - Math.floor((i * 5 + pocetTrojek * 4) * (1 + (bonusDefense / 100))) - 1;
        const maxObyv = +10 + +day;
        if (obyv <= (maxObyv)) {
            obyv = minimalAttack - Math.floor((i * 5 + pocetTrojek * 4) * (1 + (bonusDefense / 100))) - 1;
            const domky = Math.max(48, i + pocetTrojek + obyv);
            let mo = Math.floor((pocetTrojek * pocetTrojek * 3) / domky);
            const minDomky = Math.max(48, i + pocetTrojek + obyv);
            const results = {};
            if (i > day * 3 + 6 || pocetTrojek > day * 2 + 2) {
                return undefined;
            }
            dlog({ jedniciek: i, trojek: pocetTrojek, obyv: obyv });
            for (let j = 0; j <= day; j++) {
                const mocnina = Math.pow(0.5, day);
                const kombinacne = choose(day, j);
                const probability = mocnina * kombinacne;
                mo = Math.floor((pocetTrojek * pocetTrojek * 3) / (minDomky + j));
                if (results[mo] == undefined) {
                    results[mo] = probability;
                }
                else {
                    results[mo] += probability;
                }
            }
            let correctFormOfResults = [];
            for (let i in results) {
                let r = {};
                r.Md = parseInt(i);
                r.Prob = results[i];
                correctFormOfResults.push(r);
            }
            return correctFormOfResults;
        }
    }
}
function choose(n, k) {
    let hore = 1;
    let dole = 1;
    for (let i = 2; i <= n; i++) {
        hore *= i;
    }
    for (let i = 2; i <= k; i++) {
        dole *= i;
    }
    for (let i = 2; i <= n - k; i++) {
        dole *= i;
    }
    return hore / dole;
}

// CONCATENATED MODULE: ./src/ui/land/economy.ts



function renderCopyLandNameButton(doc) {
    var _a;
    if (!window.location.search)
        return null;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const landName = (_a = LANDS[id]) === null || _a === void 0 ? void 0 : _a[0];
    const btn = doc.createElement('img');
    btn.title = 'Zkopíruj název země do schránky.';
    btn.src = 'images/s/clipboard.gif';
    btn.setAttribute('style', 'cursor: copy;');
    btn.onclick = function (event) {
        event.preventDefault();
        navigator.clipboard.writeText(landName).then(() => dlog("Název země uložen do schránky."), (err) => console.error("Nepodařilo se zkopírovat název země. ", err));
    };
    const titleEl = doc.querySelector('th.br2');
    titleEl.prepend(btn);
}
function renderDeficurkyButton(input, document) {
    const btn = document.createElement('button');
    btn.innerHTML = `DE-fičurky`;
    btn.className = 'butt_sml';
    btn.type = 'button';
    btn.onclick = (e) => {
        window.open(`http://deficurky.detimes.cz/?domy=${input.houses}&obyv=${input.inhabitants}&voj=${input.soldiers}&kola=${input.turns}&pocasie=${input.weatherHouses}`, '_blank');
    };
    btn.style.display = 'block';
    let a;
    switch (input.natality) {
        case 200:
            a = 2;
            break;
        case 100:
            a = 1;
            break;
        case 50:
            a = 0.5;
            break;
    }
    let reCalcFunction = () => {
        const maxInhabitants = calcGrowth(input.inhabitants, a, parseInt(sliderSypka.value), parseInt(sliderTurnsUsed.value));
        const nonRecruitableInhabConst = input.race == RacesEnum.Enti ? 0.1 : 0.2;
        let maxRecruit = input.houses > maxInhabitants + parseInt(inputArmy.value) ?
            maxInhabitants - Math.ceil(input.houses * nonRecruitableInhabConst) :
            maxInhabitants - Math.ceil((parseInt(inputArmy.value) + maxInhabitants) * nonRecruitableInhabConst);
        maxRecruit = maxRecruit < 0 ? 0 : maxRecruit;
        let housesTotal = maxInhabitants + parseInt(inputArmy.value);
        let houseCost = calculateBuildHouseCost(input.houses, housesTotal - input.houses, input.weatherHouses);
        const label = `(max ${maxInhabitants}(+${maxInhabitants - input.inhabitants})ob. -> ${maxRecruit} verb)<br>Sypka postavena v ${sliderSypka.value} kole<br>Pocet odohranych kol ${sliderTurnsUsed.value}<br> Cena ${housesTotal - input.houses > 0 ? housesTotal - input.houses : 0} domov ${houseCost}`;
        document.getElementById("maxInhabLabel").innerHTML = label;
    };
    let inputArmy = document.createElement('input');
    inputArmy.pattern = "\\d+";
    inputArmy.value = input.soldiers.toString();
    let sliderSypka = document.createElement('input');
    sliderSypka.type = 'range';
    sliderSypka.min = '0';
    sliderSypka.max = input.turns.toString();
    sliderSypka.value = '0';
    sliderSypka.oninput = reCalcFunction;
    inputArmy.oninput = reCalcFunction;
    let sliderTurnsUsed = document.createElement('input');
    sliderTurnsUsed.type = 'range';
    sliderTurnsUsed.min = '0';
    sliderTurnsUsed.max = input.turns.toString();
    sliderTurnsUsed.value = input.turns.toString();
    sliderTurnsUsed.oninput = reCalcFunction;
    const maxInhabitants = calcGrowth(input.inhabitants, a, 0, input.turns);
    const nonRecruitableInhabConst = input.race == RacesEnum.Enti ? 0.1 : 0.2;
    let maxRecruit = input.houses > maxInhabitants + parseInt(inputArmy.value) ?
        maxInhabitants - Math.ceil(input.houses * nonRecruitableInhabConst) :
        maxInhabitants - Math.ceil((parseInt(inputArmy.value) + maxInhabitants) * nonRecruitableInhabConst);
    maxRecruit = maxRecruit < 0 ? 0 : maxRecruit;
    let housesTotal = maxInhabitants + parseInt(inputArmy.value);
    let houseCost = calculateBuildHouseCost(input.houses, housesTotal - input.houses, input.weatherHouses);
    const label = `(max ${maxInhabitants}(+${maxInhabitants - input.inhabitants})ob. -> ${maxRecruit} verb)<br> Cena ${housesTotal - input.houses > 0 ? housesTotal - input.houses : 0} domov ${houseCost}`;
    const divLabel = document.createElement('div');
    divLabel.id = "maxInhabLabel";
    divLabel.innerHTML = label;
    const td = document.createElement('td');
    td.setAttribute('colspan', '2');
    const tr = document.createElement('tr');
    td.append(btn);
    td.append(divLabel);
    td.append(sliderSypka);
    td.append(inputArmy);
    td.append(sliderTurnsUsed);
    tr.append(td);
    document.getElementsByTagName('tbody')[3].prepend(tr);
}

// CONCATENATED MODULE: ./src/ui/land/neutral.ts
function renderMagicalDefenseOnNeutral(MdProb, document) {
    const zNode = document.createElement('td');
    if (MdProb != undefined) {
        MdProb.forEach(x => zNode.innerHTML += '<p style="color:red">MO: ' + x.Md + ' - ' + Math.round(x.Prob * 1000) / 10 + '%</p>');
    }
    else {
        zNode.innerHTML = '<p style="color:red">Odlogla neutralka</p>';
    }
    document.getElementsByTagName('td')[5].parentElement.parentElement.appendChild(zNode);
}

// CONCATENATED MODULE: ./src/locations/land.ts
var land_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







// This location is shared for both Enemy and Neutral lands.
const land_handler = (services) => land_awaiter(void 0, void 0, void 0, function* () {
    const doc = getFrameDocument(FrameNames.Left);
    const { metadataService, landHistoryService } = services;
    if (!metadataService.hasValidMetadata) {
        dlog('Missing metadata.');
        return;
    }
    const landId = parseInt(document.URL.split('=')[1]);
    const landFrameData = parseLandFrame(doc, landId);
    const isNeutral = !landFrameData.rulerName;
    // land name clipboard helper
    renderCopyLandNameButton(doc);
    // land history
    landHistoryService.renderLandHistory(doc, landId);
    // magical defense
    if (isNeutral) {
        let magicalDefense = calulateMO(landFrameData.strength, landFrameData.minimalAttack, landFrameData.bonusDefense, metadataService.metadata.day);
        renderMagicalDefenseOnNeutral(magicalDefense, doc);
        if (metadataService.metadata.day < 7) {
            landHistoryService.renderStrengthForecast(doc, landId, landFrameData.bonusDefense);
        }
    }
    else {
        // enemy land
        // get attack/defense estimates
        const { race, strength } = landFrameData;
        const attackUnit = pickAttackUnit(race);
        const defenseUnit = pickDefenseUnit(race);
        const anchor = doc.querySelectorAll('table')[0];
        dlog("1-2-3 ", calcUnitCombination(race, strength, true, true, true));
        dlog("1-3 ", calcUnitCombination(race, strength, false, true, true));
        dlog("1-2 ", calcUnitCombination(race, strength, true, true, false));
        renderEstimates(anchor, strength, attackUnit, defenseUnit);
        // remove useless links
        const uselessLinksAnchor = $('a[href*="vyhl_zeme.asp"]');
        if (uselessLinksAnchor[0]) {
            const table = uselessLinksAnchor.closest('table');
            if (table.length) {
                table.remove();
            }
            else {
                // there's no table
                // => the land is under allied control
                // => different formatting
                uselessLinksAnchor.prev().remove();
                uselessLinksAnchor.prev().remove();
                uselessLinksAnchor.prev().remove();
                uselessLinksAnchor.next().remove();
                uselessLinksAnchor.next().remove();
                uselessLinksAnchor.remove();
            }
        }
    }
});
const calcBaseArmyAttack = (unit, count) => Math.floor(count * unit.attack);
const calcBaseArmyDefense = (unit, count) => Math.floor(count * unit.defense);
const getSimpleAttacks = (unit, count) => {
    const baseAttack = calcBaseArmyAttack(unit, count);
    const a1 = Math.floor(baseAttack >= 100 ? baseAttack + 30 : baseAttack);
    const a2 = Math.floor(a1 >= 200 ? a1 + 60 : a1);
    const max = !baseAttack ? 0 : Math.floor(a2 * 1.65);
    return [
        ['utok armady', baseAttack],
        ['s modlitebnou', a1],
        ['s katapultem', a2],
        ['maximum', max]
    ];
};
const getSimpleDefenses = (unit, count) => {
    const baseDefense = calcBaseArmyDefense(unit, count);
    const midFortress = !baseDefense ? 0 : Math.floor(baseDefense * 1.5 + 100);
    const bigFortress = !baseDefense ? 0 : Math.floor(baseDefense * 2.05 + 100);
    const max = !baseDefense ? 0 : Math.floor(baseDefense * 2.4 + 100);
    return [
        ['obrana armady', baseDefense],
        ['+ vozy', baseDefense + 100],
        ['+ SP', midFortress],
        ['+ VP + cv', bigFortress],
        ['+ stity', max]
    ];
};
const getEstimatesHTMLForUnit = (unit, count) => {
    const simpleAttacks = getSimpleAttacks(unit, count);
    const simpleDefenses = getSimpleDefenses(unit, count);
    const attackHTML = simpleAttacks.reduce((acc, attack) => {
        return acc + `
            <span>${attack[0]}</span>
            <span style="color:red">${attack[1]}</span>
            <span style="color:palevioletred">${Math.floor(Number(attack[1]) * 0.7)}</span>
        `;
    }, '');
    const defenseHTML = simpleDefenses.reduce((acc, defense, idx) => {
        return acc + `
            <span>${defense[0]}</span>
            <span style="color:cornflowerblue">${defense[1]}</span>
            <span>${idx === 0 ? Math.floor(Number(defense[1]) * 0.3) : ''}</span>
        `;
    }, '');
    let content = '';
    content += `
        <span style="color:lightseagreen">${count.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} * (${unit.attack}/${unit.defense})</span>
        <strong>útok</strong>
        <strong>(-30%)</strong>
        `;
    content += attackHTML;
    content += `<em>.</em><em>.</em><em>.</em>`;
    content += `
        <strong></strong>
        <strong>obrana</strong>
        <strong>(vojenská)</strong>
        `;
    content += defenseHTML;
    return content;
};
const renderEstimates = (anchor, strength, attackUnit, defenseUnit) => {
    const maxAttackUnitsCount = strength / (attackUnit.attack + attackUnit.defense);
    const maxDefenseUnitsCount = strength / (defenseUnit.attack + defenseUnit.defense);
    const attackUnitEstimates = getEstimatesHTMLForUnit(attackUnit, maxAttackUnitsCount);
    const defenseUnitEstimates = getEstimatesHTMLForUnit(defenseUnit, maxDefenseUnitsCount);
    const detailsEl = document.createElement('div');
    detailsEl.id = 'army-details';
    detailsEl.setAttribute('style', `
        display: grid;
        grid-template-columns: auto auto min-content;
        background: #222;
        color: silver;
        padding: 10px;
        font-size: 0.9em;
        text-align: left;
        font-family: sans-serif;
        z-index: 100;
        border-radius: 1px;
        white-space: nowrap;
    `);
    let content = '';
    content += attackUnitEstimates;
    content += `<em>&nbsp;</em><em>&nbsp;</em><em>&nbsp;</em>`;
    content += `<em>/</em><em>/</em><em>/</em>`;
    content += `<em>&nbsp;</em><em>&nbsp;</em><em>&nbsp;</em>`;
    content += defenseUnitEstimates;
    detailsEl.innerHTML = content;
    $(detailsEl).insertAfter($(anchor));
};
const calcUnitCombination = (race, strength, useOffensive, useDefensive, useMagical) => {
    let result = [];
    let a = UNITS_DB[race];
    let magicalPower = a.magical.attack + a.magical.defense;
    let offensivePower = a.offensive.attack + a.offensive.defense;
    let defensivePower = a.defensive.attack + a.defensive.defense;
    for (let defensinveCount = 0; defensinveCount <= (strength / defensivePower); defensinveCount++) {
        if (defensinveCount > 1 && !useDefensive) {
            break;
        }
        for (let offsensiveCount = 0; offsensiveCount <= (strength / offensivePower); offsensiveCount++) {
            if (offsensiveCount > 0 && !useOffensive) {
                break;
            }
            if (defensinveCount * defensivePower + offensivePower * offsensiveCount > strength) {
                break;
            }
            for (let magicalCount = 0; magicalCount <= (strength / defensivePower); magicalCount++) {
                if (magicalCount > 0 && !useMagical) {
                    break;
                }
                if (magicalCount * magicalPower + offensivePower * offsensiveCount + defensinveCount * defensivePower > strength) {
                    break;
                }
                if (magicalCount * magicalPower + offensivePower * offsensiveCount + defensinveCount * defensivePower == strength) {
                    result.push({ defensive: defensinveCount, offensive: offsensiveCount, magical: magicalCount });
                }
            }
        }
    }
    return result.reverse();
};
const landHandler = (dataProvider) => wrapLocationHandler('Land', dataProvider, land_handler);

// CONCATENATED MODULE: ./src/locations/land-economy.ts
var land_economy_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




const land_economy_handler = (services) => land_economy_awaiter(void 0, void 0, void 0, function* () {
    const doc = getFrameDocument(FrameNames.Left);
    const { landHistoryService } = services;
    const landId = parseInt(document.URL.split('=')[1]);
    renderCopyLandNameButton(doc);
    const ecoData = yield getInputForDeficurkyButton(doc);
    renderDeficurkyButton(ecoData, doc);
    yield landHistoryService.renderLandHistory(doc, landId);
});
const landEconomyHandler = (dataProvider) => wrapLocationHandler('Land economy', dataProvider, land_economy_handler);

// CONCATENATED MODULE: ./src/html-parsers/hero/artifacts-parser.ts

const parseArtifacts = (doc) => {
    const arElements = [...doc.querySelectorAll('form[name="form_ar"] tr td img')];
    const arLinks = arElements.map(artImg => artImg.getAttribute('src'));
    return arLinks.map(a => ARTIFACTS_DB[a]).filter(a => a);
};

// CONCATENATED MODULE: ./src/locations/hero-artifacts.ts



const heroArtifactsHandler = (dataProvider) => wrapLocationHandler('Hero artifacts', dataProvider, hero_artifacts_handler);
const hero_artifacts_handler = (services) => {
    const doc = getFrameDocumentForHeroPanel();
    const heroArts = parseArtifacts(doc);
    // When this location is triggered by shortcut button in hero-details location
    // the `s` URL argument exists. It means we just grab the artifacts here
    // minify them into a string, and redirect to hero-equip page where this
    // string is parsed and artifacts equipped.
    const searchParams = new URLSearchParams(document.location.search);
    const heroId = Number(searchParams.get('h'));
    const set = Number(searchParams.get('s'));
    const artsString = heroArts.map(a => a.img).join('-');
    // dlog(heroArts.map(a => a.name).join('\n'));
    if (set) {
        unsafeWindow.location.href = `/hero_artefacts.asp?h=${heroId}&arts=${artsString}&s=${set}`;
    }
    else {
        const artsDbArray = Object.keys(ARTIFACTS_DB).map(ak => ARTIFACTS_DB[ak]);
        // TEMP: Just looking at the best possible values
        // dlog('\n\n\nALL ARTIFACTS:');
        // printTopFixedDefense(artsDbArray);
        // printTopPercentualDefense(artsDbArray);
        // printTopFixedAttack(artsDbArray);
        // dlog(sumArtifacts(artsDbArray, 'spellPower'));
        // This report is useful for enemy heroes
        // as you can quickly check their max stats.
        dlog(`\nHERO ${heroId} ARTIFACTS (repair sum: ${calcTotalRepairCost(heroArts)})`);
        printTopFixedDefense(heroArts);
        printTopFixedAttack(heroArts);
        // dlog(sumArtifacts(heroArts, 'spellPower'));
    }
};

// CONCATENATED MODULE: ./src/ui/top-bar.ts

function redesignNavigation(dom, playerId, onRefresh) {
    const hasOriginalSkin = !!dom.querySelector('table#subdiv_center');
    if (!hasOriginalSkin)
        return;
    extendOriginalSkin(dom, playerId, onRefresh);
}
function extendOriginalSkin(doc, playerId, onRefresh) {
    GM_addStyle(`
          #subdiv_center {
              background-image: none;
              line-height: 1.5;
              font-family: sans-serif; 
          }
          #subdiv_center a { 
              margin: 0 5px; 
              letter-spacing: 0;
              text-decoration: none;
              color: #BBB;
          }
          
          #subdiv_center a:hover { 
              color: #FFF !important;
          }
      `);
    const header = $(doc.querySelector('#subdiv_center'));
    // remove the first four links (Smlouvy, Vojsko, Hospodarstvi, Stavby)
    header.find('b').slice(0, 4).remove();
    // highlight the 'Dalsi kolo' button to avoid misslicks
    const endTurnBtn = header.find(`a[href*="konec_kola.asp"]`);
    endTurnBtn.css({
        color: 'red',
        margin: '0 20px',
    });
    // highlight 'Hlaseni'
    const reportBtn = header.find(`a[target*="hlas"]`);
    reportBtn.css({
        color: '#11cc23'
    });
    // highlight 'Magie'
    const spellcastingBtn = header.find(`a[href*="magie.asp"]`);
    spellcastingBtn.css({
        color: '#00AAFF'
    });
    // highlight 'Centrala'
    const overviewBtn = header.find(`a[href*="centrala.asp"]`);
    overviewBtn.css({
        color: '#e79d00'
    });
    // Change link/target for 'Mapa'
    const mapaBtn = header.find(`a[href*="world_map.asp"]`);
    mapaBtn.attr('href', 'map_new.asp');
    // Remove original 'Napoveda' button
    const helpBtn = header.find(`a[href*="help.asp"]`);
    helpBtn.remove();
    const settingsBtn = header.find(`a[href*="nastaveni.asp"]`);
    const tdEl = settingsBtn.parent();
    const trEl = tdEl.parent();
    const { day, weatherGold, weatherMana, weatherHouses } = parseTopFrame(doc);
    const colorWeatherValue = (value, negative) => {
        if ((value > 100 && !negative) || (value < 100 && negative))
            return `<span style="color: lightgreen">${value}</span>`;
        if ((value < 100 && !negative) || (value > 100 && negative))
            return `<span style="color: orangered">${value}</span>`;
        return `<span style="color: #CCC">${value}</span>`;
    };
    const weatherInfo = $('<td>', {
        html: `
          ${day}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ${colorWeatherValue(weatherGold)}-${colorWeatherValue(weatherMana)}-${colorWeatherValue(weatherHouses, true)}
      `,
        css: { color: '#CCC' }
    });
    trEl.prepend(weatherInfo);
    const helpLink = $('<a>', {
        href: '/napoveda/0/napoveda_darkelf.htm',
        text: 'Nápověda',
        target: 'mapa',
        css: { color: 'brown' }
    });
    tdEl.append(helpLink);
    const aaLink = $('<a>', {
        href: '/statistiky/artefacts_auction.asp',
        text: 'AA',
        target: 'mapa',
        css: { color: 'brown' }
    });
    tdEl.append(aaLink);
    const ahLink = $('<a>', {
        href: '/statistiky/heroes_auction.asp',
        text: 'AH',
        target: 'mapa',
        css: { color: 'brown' }
    });
    tdEl.append(ahLink);
    const hLink = $('<a>', {
        href: '/heroes.asp?p=' + playerId,
        text: 'Hrdinové',
        target: 'mapa',
        css: { color: 'brown' }
    });
    tdEl.append(hLink);
    const htLink = $('<a>', { href: '/heroes_transfer.asp', text: 'Převod H', target: 'mapa', css: { color: 'brown' } });
    tdEl.append(htLink);
    const refreshBtn = $('<td>', { text: 'Refresh!', css: { color: 'white', cursor: 'pointer' } });
    refreshBtn.on('click', onRefresh);
    trEl.append(refreshBtn);
    // remove the initial <br />
    const br = header.find('br');
    br.remove();
}

// CONCATENATED MODULE: ./src/locations/top-bar.ts
var top_bar_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const top_bar_handler = (services) => {
    const doc = getFrameDocument(FrameNames.Top);
    const { metadataService, landHistoryService, reportsService } = services;
    if (!metadataService.hasValidMetadata) {
        dlog('Missing metadata.');
        return;
    }
    const { playerId } = metadataService.metadata;
    function onRefresh() {
        return top_bar_awaiter(this, void 0, void 0, function* () {
            dlog('refresh - saving land history and parsing reports');
            yield landHistoryService.forceSave(getFrameDocument(FrameNames.Main));
            yield reportsService.refresh();
            dlog('refreshed');
        });
    }
    redesignNavigation(doc, playerId, onRefresh);
};
const topBarHandler = (dataProvider) => wrapLocationHandler('Top bar', dataProvider, top_bar_handler);

// CONCATENATED MODULE: ./src/ui/info-bar.ts
// Replace the useless current position in league
// rankings label by the current land count.
// TODO: OPTIONAL
function replaceCurrentRankingByLandCount(doc) {
    const statBar = doc.getElementById('stat');
    if (!statBar)
        return;
    const landCountEl = statBar.childNodes[0];
    if (!landCountEl)
        return;
    const tooltip = statBar.getAttribute('title');
    const currentLandCount = 'zemí: ' + [...tooltip].slice(6, 8).join('') + ' ';
    statBar.parentElement.replaceChild(document.createTextNode(currentLandCount), statBar);
}

// CONCATENATED MODULE: ./src/locations/info-bar.ts



const info_bar_handler = (services) => {
    const doc = getFrameDocument(FrameNames.Information);
    replaceCurrentRankingByLandCount(doc);
};
const infoBarHandler = (dataProvider) => wrapLocationHandler('Info bar', dataProvider, info_bar_handler);

// CONCATENATED MODULE: ./src/ui/land/diplomacy.ts
// Taken from deking
function addBulkContractActions(doc) {
    const jqDoc = $(doc);
    const bulkContractDropDown = $(`
        <select class="list_centred">
            <option value="0"></option>
            <option value="6" style="color:#FF4444">Válka</option>
            <option value="3" style="color:#FFDD44">Obchodní</option>
            <option value="2" style="color:#55AAFF">Magická</option>
            <option value="1" style="color:#CCCCCC">Vojenská</option>
            <option value="7" style="color:#00CC00">Mír</option>
            <option value="4" style="color:#CC55DD">Volný průchod</option>
            <option value="5" style="color:#999999">Zrušena</option>
        </select>
    `);
    bulkContractDropDown.on('change', function () {
        jqDoc.find('select[name="CBoxMojeNabidka"]').val($(this).val());
    });
    const tr = $('<tr><td>Hromadná změna</td><td></td>');
    $($(tr).find('td')[1]).append(bulkContractDropDown);
    $(jqDoc.find('tbody')[1]).append(tr);
    const trYesNo = $(`
        <tr>
            <td>Hromadný příjem</td>
            <td>
                <button class="butt_sml" style="color:green" data-id="1">Ano</button>
                <button class="butt_sml" style="color:red" data-id="0">Ne</button>
            </td>
        </tr>
    `);
    trYesNo.find('button').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        jqDoc.find('select[name*="CBoxJehoNabidka"]').val($(this).data('id'));
    });
    $(jqDoc.find('tbody')[1]).append(trYesNo);
}

// CONCATENATED MODULE: ./src/locations/land-diplomacy.ts



const land_diplomacy_handler = (services) => {
    const doc = getFrameDocument(FrameNames.Left);
    addBulkContractActions(doc);
};
const landDiplomacyHandler = (dataProvider) => wrapLocationHandler('Land diplomacy', dataProvider, land_diplomacy_handler);

// CONCATENATED MODULE: ./src/ui/map.ts
GM_addStyle(`
    .name_label {
        display: block;
        font-family: sans-serif;
        font-size: 80%;
        padding: 3px;
        color: white;
        color: transparent;
        white-space: nowrap;
        position: absolute;
        top: -15px;
        left: 0;
        width: 100%;
        pointer-events: none;
    }
    .land_border_blue { 
      border: 2px solid magenta;
    }
    .crypt {
      background: DarkMagenta;
      border-radius: 2px;
    }
    .crypt[src="images/crypts/c11.gif"] {
        background: magenta;
        border-radius: 2px;
    } 
    .hero {
      background: rgb(70 255 121 / 63%);
      border-radius: 2px;
    }
    .mapCasting {
      background-color: red !important;
    }
    .mapCastingDim {
      background-color: #FF000099 !important;
    }
    .nat50 > a:nth-of-type(3) > img {
      background-color: #FF000099;
      border-radius: 2px;
    }
    .nat200 > a:nth-of-type(3) > img {
      background-color: #FFFF0080;
      border-radius: 2px;
    }
`);
function addSearchLabel(landEl) {
    const nameLabel = document.createElement('span');
    nameLabel.innerHTML = landEl.dataset.name;
    nameLabel.className = 'name_label';
    landEl.prepend(nameLabel);
}
function dimLand(landEl, irrelevantPlayers) {
    const playerName = landEl.dataset.player;
    if (irrelevantPlayers.indexOf(playerName) > -1) {
        landEl.style.opacity = '0.6';
    }
}
function showNatalityBonus(landEl) {
    const natalityBonus = Number(landEl.dataset.b_natality);
    if (natalityBonus) {
        landEl.classList.add('nat' + natalityBonus);
    }
}

// CONCATENATED MODULE: ./src/locations/map.ts



//#region Quick Spell
const handleShortcut = (key) => {
    // get sidebar with magic
    const sidebarDoc = getFrameDocument(FrameNames.Left);
    // find the spell-casting button
    const castSpellButton = $(sidebarDoc).find(`a[href*="magie.asp?dest_land="]`);
    if (!castSpellButton)
        return;
    const landUrl = castSpellButton.attr('href');
    if (!landUrl)
        return;
    sidebarDoc.location.href = `${landUrl}&qs=${key}`;
};
// Alt on Windows
VM.registerShortcut('alt-1', () => handleShortcut('n'));
VM.registerShortcut('alt-2', () => handleShortcut('nn'));
VM.registerShortcut('alt-3', () => handleShortcut('s'));
VM.registerShortcut('alt-4', () => handleShortcut('p'));
VM.registerShortcut('alt-5', () => handleShortcut('kr'));
VM.registerShortcut('alt-6', () => handleShortcut('k'));
VM.registerShortcut('alt-7', () => handleShortcut('dk'));
VM.registerShortcut('alt-8', () => handleShortcut('smdsmdsmd'));
VM.registerShortcut('alt-9', () => handleShortcut('ccc'));
VM.registerShortcut('alt-0', () => handleShortcut('mmmmm'));
// Ctrl on Mac
VM.registerShortcut('ctrl-1', () => handleShortcut('n'));
VM.registerShortcut('ctrl-2', () => handleShortcut('nn'));
VM.registerShortcut('ctrl-3', () => handleShortcut('s'));
VM.registerShortcut('ctrl-4', () => handleShortcut('p'));
VM.registerShortcut('ctrl-5', () => handleShortcut('kr'));
VM.registerShortcut('ctrl-6', () => handleShortcut('k'));
VM.registerShortcut('ctrl-7', () => handleShortcut('dk'));
VM.registerShortcut('ctrl-8', () => handleShortcut('smdsmdsmd'));
VM.registerShortcut('ctrl-9', () => handleShortcut('ccc'));
VM.registerShortcut('ctrl-0', () => handleShortcut('mmmmm'));
//#endregion
const SPELL_ICON_SIZE = 11;
const map_handler = (services) => {
    var _a, _b;
    const doc = getFrameDocument(FrameNames.Main);
    const { metadataService, settingsService, reportsService } = services;
    if (!metadataService.hasValidMetadata) {
        dlog('Missing metadata.');
        return;
    }
    const { playerName, leagueId } = metadataService.metadata;
    const settings = settingsService.load(playerName);
    //#region Reported Spells
    const reportedSpells = reportsService.spells;
    const reportedSpellsByLand = reportedSpells.reduce((acc, cv) => {
        const currentSpells = acc[cv.landId];
        acc[cv.landId] = currentSpells ? [...currentSpells, cv] : [cv];
        return acc;
    }, {});
    function renderReportedSpells(landEl, landId) {
        const reportedSpells = reportedSpellsByLand[landId];
        if (!reportedSpells)
            return;
        const groupedBySpell = reportedSpells.reduce((acc, cv) => {
            const cvId = cv.spell.id;
            acc[cvId] = acc[cvId] ? [...acc[cvId], cv] : [cv];
            return acc;
        }, {});
        const spellIds = Object.keys(groupedBySpell);
        const idForHiding = landEl.id + "spellsFromReport";
        const reportedSpellsContainer = document.createElement("div");
        reportedSpellsContainer.setAttribute('style', `
            position: absolute;
            height: 1px;
            width: 1px;
            left: -20px;
            top: 0;
            border:none;
        `);
        reportedSpellsContainer.id = 'reportedSpellsContainer' + landId;
        spellIds.forEach((spellId, columnIndex) => {
            const spells = groupedBySpell[Number(spellId)];
            // TODO: filter the spells by success
            const title = spells.map(reportedSpell => `${reportedSpell.spell.cz} (${reportedSpell.sourcePlayer}: n/a)`).join('\n');
            const spellIcon = makeReportedSpellIcon(spells[0].spell.id, 0, columnIndex, title, idForHiding);
            reportedSpellsContainer.appendChild(spellIcon);
            if (spells.length > 1) {
                const countIcon = makeSpellCountIcon(title, spells.length, -1, columnIndex, idForHiding);
                reportedSpellsContainer.appendChild(countIcon);
            }
        });
        landEl.appendChild(reportedSpellsContainer);
    }
    //#endregion Reported Spells
    //#region Icon utils
    function makeHideSpellsButton(id) {
        const buttonEle = document.createElement("img");
        buttonEle.setAttribute('style', `
            position: absolute;
            right: -${16}px;
            top: ${-1 - SPELL_ICON_SIZE}px;
            width: ${SPELL_ICON_SIZE}px;
            height: ${SPELL_ICON_SIZE}px;
            border:none;
            display: inline-block;
        `);
        buttonEle.src = "/images/s/cross.gif";
        buttonEle.onclick = function () {
            document.querySelectorAll("#" + id).forEach((x) => x.hidden = !x.hidden);
        };
        return buttonEle;
    }
    function makeSpellCountIcon(title, count, rowIndex, columnIndex, id) {
        const countEle = document.createElement("div");
        countEle.title = title;
        countEle.innerText = count.toString();
        countEle.setAttribute('style', `
            position: absolute;
            right: -${19 + SPELL_ICON_SIZE * rowIndex}px;
            top: ${-2 + SPELL_ICON_SIZE * columnIndex}px;
            width: ${SPELL_ICON_SIZE}px;
            height: ${SPELL_ICON_SIZE}px;
            color: wheat;
            font-size: 12px;
            font-family: monospace;
            font-weight: normal;
            font-variant: italic;
            pointer-events: none;
            text-shadow: 0 0 2px black, 0 0 6px red;
        `);
        countEle.classList.add('text_shadow');
        countEle.id = id;
        return countEle;
    }
    function makeReportedSpellIcon(spellId, row, column, title, id, success = false) {
        const iconSize = 11;
        const spellEl = document.createElement('img');
        spellEl.src = getSpellImgSrc(spellId);
        spellEl.setAttribute('style', `
            position: absolute;
            right: -${16 + iconSize * row}px;
            top: ${-1 + iconSize * column}px;
            width: ${iconSize}px;
            height: ${iconSize}px;
            ${success ? 'border: 1px solid yellow; border-radius: 1px;' : undefined}
            ${!success ? 'opacity: 0.5;' : undefined}
        `);
        spellEl.title = title;
        spellEl.id = id;
        return spellEl;
    }
    //#endregion Icon utils
    // TODO: read and save army (it can be also used to check MO for previous days)
    // TODO: read magic tower
    // TODO: read fortress
    // TODO: read heroes
    // TODO: read bonuses (bonuses could/should be stored in db)
    // TODO: Make the pipeline configurable via user settings
    // PIPELINE
    const pipeline = [];
    pipeline.push(addSearchLabel);
    pipeline.push(renderReportedSpells);
    // Dimming lands
    if ((_b = (_a = settings) === null || _a === void 0 ? void 0 : _a.irrelevantPlayers[leagueId]) === null || _b === void 0 ? void 0 : _b.length) {
        pipeline.push((landEl) => dimLand(landEl, settings.irrelevantPlayers[leagueId]));
    }
    // Showing natality bonus
    pipeline.push(showNatalityBonus);
    // Pipeline execution
    const landElements = doc.querySelectorAll('.land');
    landElements.forEach(landEl => pipeline.forEach((fn) => fn(landEl, Number(landEl.dataset.id))));
    // Replace map tiles for 'Dark Mode'
    // TODO: Should be configurable (on/off)
    // if ([MapType.Classic, MapType.M].includes(getMapType(metadataService.metadata.leagueId))) {
    //     GM_addStyle(`
    //         .area1 { background: url('https://i.imgur.com/avaUegX.gif'); }
    //         .area2 { background: url('https://i.imgur.com/lINGEM2.gif'); }
    //         .area3 { background: url('https://i.imgur.com/sVIcwyC.gif'); }
    //         .area4 { background: url('https://i.imgur.com/uO0oq2s.gif'); }
    //         .area5 { background: url('https://i.imgur.com/QfK7OJO.gif'); }
    //         .area6 { background: url('https://i.imgur.com/Xn0bs67.gif'); }
    //         .area7 { background: url('https://i.imgur.com/bbYnt6X.gif'); }
    //         .area8 { background: url('https://i.imgur.com/cb1DR7u.gif'); }
    //         .area9 { background: url('https://i.imgur.com/GJo2gPf.gif'); }
    //     `);
    // }
};
const mapHandler = (dataProvider) => wrapLocationHandler('Map', dataProvider, map_handler);

// CONCATENATED MODULE: ./src/locations/leagues.ts

const leagues_handler = (services) => {
    const { landHistoryService } = services;
    landHistoryService.deleteOld();
};
const leaguesHandler = (dataProvider) => wrapLocationHandler('Leagues', dataProvider, leagues_handler);

// CONCATENATED MODULE: ./src/ui/other/account-manager.ts

class account_manager_accountCredentialsManager {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
    }
    credentialsManagment(document) {
        let userName = document.createElement('input');
        let password = document.createElement('input');
        let addButton = document.createElement('button');
        let removeButton = document.createElement('button');
        let container = document.createElement('div');
        let userNameSelect = document.createElement('select');
        let a = this.dataProvider.load(StorageKeys.ACCOUNT_CREDENTIALS);
        a.forEach(element => {
            let option = document.createElement('option');
            option.innerText = element.usr;
            userNameSelect.appendChild(option);
        });
        userName.placeholder = 'username';
        password.placeholder = 'password';
        password.type = 'password';
        addButton.type = 'submit';
        addButton.innerText = 'Add';
        addButton.onclick = () => {
            let a = this.dataProvider.load(StorageKeys.ACCOUNT_CREDENTIALS);
            a.push({ psd: password.value, usr: userName.value.toLowerCase() });
            this.dataProvider.save(StorageKeys.ACCOUNT_CREDENTIALS, a);
            //alert('added');
            let option = document.createElement('option');
            option.innerText = userName.value;
            userNameSelect.appendChild(option);
            password.value = '';
            userName.value = '';
        };
        removeButton.type = 'submit';
        removeButton.innerText = 'Remove';
        removeButton.onclick = () => {
            let a = this.dataProvider.load(StorageKeys.ACCOUNT_CREDENTIALS);
            a = a.filter(x => x.usr != userNameSelect.options[userNameSelect.selectedIndex].value.toLowerCase());
            this.dataProvider.save(StorageKeys.ACCOUNT_CREDENTIALS, a);
            //alert('removed');
            userNameSelect.options[userNameSelect.selectedIndex].remove();
        };
        container.append(userName);
        container.append(password);
        container.append(addButton);
        container.append(userNameSelect);
        container.append(removeButton);
        document.body.prepend(container);
    }
    showAllUserInfo(document, userInfo) {
        let table = document.createElement('table');
        userInfo.forEach(element => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = `${element.userName} ${element.league}`;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = `${element.gold.toString()} <img border="0" align="absmiddle" src="https://www.darkelf.cz/images/s/mon.gif">`;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = `${element.mana.toString()} <img border="0" align="absmiddle" src="https://www.darkelf.cz/images/s/man.gif">`;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerText = element.usedTurns.toString() + ' / ' + element.maxTurns.toString();
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerText = element.day.toString() + '. day';
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = `${element.deCredits} <img border="0" align="absmiddle" src="https://www.darkelf.cz/images/sluzby/de.gif">`;
            tr.appendChild(td);
            td = document.createElement('td');
            element.heroList.forEach(x => {
                td.innerHTML += `<a href="${x.path}"><img border="0" align="absmiddle" src="${x.imagePath}"></a>${x.name.split(' - ')[0]} `;
            });
            tr.appendChild(td);
            td = document.createElement('td');
            element.activeServices.forEach(x => {
                td.innerText += x + ', ';
            });
            tr.appendChild(td);
            table.appendChild(tr);
        });
        document.body.prepend(table);
    }
}
function showLogOutOnTrophies(document, logOutFunction) {
    let b = document.createElement('button');
    b.onclick = () => logOutFunction();
    b.innerText = 'You are logged in, to show account manager, first log out. Click to log out';
    document.body.prepend(b);
}

// CONCATENATED MODULE: ./src/services/account-manager-service.ts
var account_manager_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class account_manager_service_AccountManagerService {
    constructor(dataProvider) {
        this.run = () => account_manager_service_awaiter(this, void 0, void 0, function* () {
            //works only when not logged in
            if (yield this.isThisLoggedIn()) {
                showLogOutOnTrophies(document, this.logOut);
                return;
            }
            showLoading(document);
            let dbInfo = this.dataProvider.load(StorageKeys.ACCOUNT_CREDENTIALS);
            if (dbInfo == null) {
                this.dataProvider.save(StorageKeys.ACCOUNT_CREDENTIALS, []);
                dbInfo = []; //initialize
            }
            let acm = new account_manager_accountCredentialsManager(this.dataProvider);
            acm.credentialsManagment(document); //UI creates div to manage credentials
            let uiInfo = [];
            for (let index = 0; index < dbInfo.length; index++) {
                const b = dbInfo[index];
                yield this.getDataFromUser(b.usr, b.psd, uiInfo, 0);
            }
            acm.showAllUserInfo(document, uiInfo);
            yield this.logOut();
            hideLoading(document);
        });
        this.dataProvider = dataProvider;
    }
    login(username, password) {
        return account_manager_service_awaiter(this, void 0, void 0, function* () {
            yield fetch("https://www.darkelf.cz/login.asp", { "credentials": "include", "headers": { "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", "accept-language": "sk-SK,sk;q=0.9,cs;q=0.8,en-US;q=0.7,en;q=0.6", "cache-control": "max-age=0", "content-type": "application/x-www-form-urlencoded", "sec-fetch-dest": "document", "sec-fetch-mode": "navigate", "sec-fetch-site": "same-origin", "sec-fetch-user": "?1", "upgrade-insecure-requests": "1" }, "referrer": "https://www.darkelf.cz/ligy.asp", "referrerPolicy": "no-referrer-when-downgrade", "body": "de_name=" + username + "&de_password=" + password + "&login_submit=P%F8ihl%E1sit+m%FDm+%FA%E8tem", "method": "POST", "mode": "cors" });
        });
    }
    logOut() {
        return account_manager_service_awaiter(this, void 0, void 0, function* () {
            yield getDomFromUrl('https://www.darkelf.cz/odlogovat.asp', 'GET');
        });
    }
    getDataFromUser(username, password, uiInfo, numberOfTries) {
        return account_manager_service_awaiter(this, void 0, void 0, function* () {
            try {
                yield this.login(username, password);
                let uiInfoElement = { day: 0, deCredits: '0', gold: 0, heroList: [], league: 'x', mana: 0, maxTurns: 0, newMail: false, usedTurns: 0, userName: username, activeServices: [] };
                let domEntryMap = yield getDomFromUrl('https://www.darkelf.cz/world_map.asp', 'GET');
                let arrowElement = domEntryMap.getElementById('YouAreHere');
                let inLeague = arrowElement != undefined;
                if (inLeague) {
                    let parsedLogin = parseLeagueInfo(arrowElement.firstElementChild);
                    //uiInfoElement.userName = parsedLogin.playerName; show login username as set in default
                    uiInfoElement.day = parsedLogin.day;
                    uiInfoElement.league = parsedLogin.leagueId;
                    let domInfo = yield getDomFromUrl('https://www.darkelf.cz/lista_informace.asp', 'GET');
                    parseInfromationFrame(domInfo);
                    let parsedInfo = parseInfromationFrame(domInfo);
                    uiInfoElement.gold = parsedInfo.actualGold;
                    uiInfoElement.mana = parsedInfo.actualMana;
                    uiInfoElement.maxTurns = parsedInfo.maxTurns;
                    uiInfoElement.usedTurns = parsedInfo.usedTurns;
                }
                let domCredits = yield getDomFromUrl('https://www.darkelf.cz/sluzby/sluzby.asp', 'GET');
                uiInfoElement.deCredits = domCredits.getElementsByTagName('strong')[0].innerText;
                let heroesDom = yield getDomFromUrl('https://www.darkelf.cz/heroes_transfer.asp', 'POST', 'chosen_chars=&cb_idplayers=1&player_selected=Zvol+hr%E1%E8e');
                let tds = heroesDom.getElementsByClassName('vlajka');
                let servicesDom = yield getDomFromUrl('https://www.darkelf.cz/sluzby/sluzby_prehled.asp', 'GET');
                let tbody = Array.prototype.slice.call(servicesDom.getElementsByTagName('tbody')[1].children);
                for (let index = 2; index < tbody.length - 1; index++) { //cut first two and last elements
                    const element = tbody[index];
                    uiInfoElement.activeServices.push(`${element.children[0].innerText} ${element.children[3].innerText.split(' ').slice(0, -1).join('')}`);
                }
                uiInfoElement.heroList = [];
                Array.prototype.slice.call(tds).forEach((element) => {
                    uiInfoElement.heroList.push({ imagePath: element.children[0].children[0].src, name: element.title, path: element.children[0].href });
                });
                uiInfo.push(uiInfoElement);
                //await this.logOut();
            }
            catch (e) {
                dlog('Not working username, password and number of retries: ', username, password, numberOfTries);
                if (numberOfTries > 0) {
                    yield this.getDataFromUser(username, password, uiInfo, numberOfTries - 1);
                }
            }
        });
    }
    isThisLoggedIn() {
        return account_manager_service_awaiter(this, void 0, void 0, function* () {
            try {
                let domInfo = yield getDomFromUrl('https://www.darkelf.cz/lista_informace.asp', 'GET');
                let a = parseInfromationFrame(domInfo);
                dlog('We are logged in, dont run AM');
                return true;
            }
            catch (e) {
                dlog('We are not logged in, run AM');
                return false;
            }
        });
    }
}

// CONCATENATED MODULE: ./src/locations/trophies.ts
var trophies_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const trophiesHandler = () => trophies_awaiter(void 0, void 0, void 0, function* () {
    const dataProvider = new LocalStorageDataProvider();
    const accountManager = new account_manager_service_AccountManagerService(dataProvider);
    yield accountManager.run();
});

// CONCATENATED MODULE: ./src/locations/headquarters.ts

const headquarters_handler = (services) => {
    const { playerTurnCalcService } = services;
    unsafeWindow.CalcIncome = playerTurnCalcService.FetchData;
};
const headquartersHandler = (dataProvider) => wrapLocationHandler('Headquarters', dataProvider, headquarters_handler);

// CONCATENATED MODULE: ./src/html-parsers/mass-houses-parser.ts
function parseMassHousesPage(dom) {
    let result = { lands: {}, actualGold: parseInt(dom.querySelector('#Zbyde_zlato').innerText) };
    dom.querySelectorAll("a[target]").forEach((e, i) => {
        if (i % 4 == 0) {
            let id = (e.href.split('=')[1]);
            let housesEle = dom.querySelectorAll("#es" + id + "h")[0];
            let name = housesEle.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerText;
            let houses = parseInt(housesEle.innerText);
            let s = dom.querySelector("#es" + id + "b");
            let housesToBuild = s == undefined ? 0 : parseInt(s.innerText);
            //let housesToBuild = parseInt((s[0] as HTMLElement).innerText);
            let inhabitants = parseInt(housesEle.parentElement.parentElement.nextSibling.innerText);
            let existsBonus = housesEle.parentElement.parentElement.previousSibling.previousSibling.outerHTML.includes("<span class=\"mon\">");
            let bonus = 0;
            if (existsBonus) {
                bonus = parseInt(housesEle.parentElement.parentElement.previousSibling.previousSibling.children[0].innerText);
            }
            result.lands[parseInt(id)] = { bonusGold: bonus, houses, inhabitants, name, housesToBuild };
        }
    });
    return result;
}

// CONCATENATED MODULE: ./src/ui/mass-houses.ts
function setHouses(doc, houses) {
    for (const key in houses) {
        if (Object.prototype.hasOwnProperty.call(houses, key)) {
            const element = houses[key];
            document.querySelector('input#es' + key).value = element.toString();
        }
    }
    TotalPriceShow();
}

// CONCATENATED MODULE: ./src/services/house-returns-service.ts
var house_returns_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








class house_returns_service_HouseReturnsService {
    constructor() {
        //COPY PASTE FROM DE source code
        this.celkovaCenuDomu = (celkemDomu, chciKoupit, pocasi) => {
            var priceHouse;
            var total = 0;
            for (let c = 0; c < chciKoupit; c++) {
                priceHouse = Math.floor((60 + Math.pow((celkemDomu + 1 + c) / 9, 2)) * pocasi / 100); // +1 je proto, ze kupuji dalsi dum
                total = total + priceHouse;
            }
            return total;
        };
        this.calculateAndShow = () => house_returns_service_awaiter(this, void 0, void 0, function* () {
            dlog("Chyba tomu pocitat s prirastkom v ostatnych zemkach (skrati sa navratnost ked v inej zemke dorastu obyv), zatial to napise navratnost dalsieho nepostaveneho domu");
            let massHousesData = parseMassHousesPage(document);
            let weather = parseTopFrame(yield getDomFromUrl('https://www.darkelf.cz/Lista_Horni.asp', 'GET'));
            let mapData = parseMapPage(yield getDomFromUrl('https://www.darkelf.cz/map_new.asp', 'GET'));
            let headQuartersData = parseCentralFrame(yield getDomFromUrl('https://www.darkelf.cz/centrala.asp', 'GET'));
            let promises = {};
            let returnsUpToTurn = document.getElementById("maxTurnReturns");
            headQuartersData.landIds.forEach(element => {
                promises[element] = {
                    diplomacyPage: getDomFromUrl('https://www.darkelf.cz/c.asp?id=' + element, 'GET'),
                    buildingPage: getDomFromUrl('https://www.darkelf.cz/b.asp?id=' + element, 'GET')
                };
            });
            let allHouses = [];
            for (const property in massHousesData.lands) {
                let land = massHousesData.lands[property];
                //make this faster by calling all get dom from url first and then await it all later
                let diplomacy = parseDiplomacyPage(yield promises[property].diplomacyPage);
                //let buildings = parseBuildingPage(await getDomFromUrl('https://www.darkelf.cz/b.asp?id=' + property, 'GET'));
                //mby use buildings in future
                let id = parseInt(property);
                let goldIncomeForHouseWithIgnoringInhabsGrow = 5 * weather.weatherGold / 100;
                diplomacy.contracts.forEach(x => {
                    if (x.type == ContractTypeEnum.Trade) {
                        let contractedLandInhabs = mapData.lands[x.targetLandId].inhabitants != null ? mapData.lands[x.targetLandId].inhabitants : 0;
                        if (contractedLandInhabs * 2.25 > land.inhabitants) {
                            goldIncomeForHouseWithIgnoringInhabsGrow += 0.9;
                        }
                        if (land.inhabitants * 2.25 < contractedLandInhabs) {
                            //add another 1.25 inhabs to count
                            goldIncomeForHouseWithIgnoringInhabsGrow += 0.9 * 1.25;
                        }
                    }
                });
                goldIncomeForHouseWithIgnoringInhabsGrow *= mapData.lands[id].magicEffects.gold / 100;
                let rankMultiplier = headQuartersData.actualRank / headQuartersData.baseLeagueRank;
                rankMultiplier = rankMultiplier > 2 ? 2 : rankMultiplier;
                rankMultiplier = rankMultiplier < 0.25 ? 0.25 : rankMultiplier;
                goldIncomeForHouseWithIgnoringInhabsGrow *= rankMultiplier;
                let returnsInTurns = this.celkovaCenuDomu(land.houses, 1, weather.weatherHouses) / goldIncomeForHouseWithIgnoringInhabsGrow;
                dlog(land.name, land.houses, returnsInTurns, land.housesToBuild);
                for (let i = 0; i < land.housesToBuild; i++) {
                    let housePrice = this.celkovaCenuDomu(land.houses + i, 1, weather.weatherHouses);
                    let returnsInTurns = housePrice / goldIncomeForHouseWithIgnoringInhabsGrow;
                    allHouses.push({ landId: id, returnsInTurns: returnsInTurns, housePrice: housePrice });
                }
            }
            allHouses.sort((a, b) => a.returnsInTurns > b.returnsInTurns ? 1 : a.returnsInTurns < b.returnsInTurns ? -1 : 0);
            let turnsNumber = Number(returnsUpToTurn.value);
            if (!isNaN(turnsNumber) && turnsNumber !== 0) {
                allHouses = allHouses.filter(x => x.returnsInTurns <= turnsNumber);
            }
            let housesCalculated = {};
            let money = massHousesData.actualGold;
            for (let index = 0; index < allHouses.length; index++) {
                const element = allHouses[index];
                money -= element.housePrice;
                if (money < 0) {
                    break;
                }
                if (housesCalculated[element.landId] == undefined) {
                    housesCalculated[element.landId] = 1;
                }
                else {
                    housesCalculated[element.landId] += 1;
                }
            }
            //return housesCalculated;
            setHouses(document, housesCalculated);
        });
        this.createImprovedHousesCalcBtn = () => {
            let btn = document.createElement("button");
            btn.type = "button";
            btn.className = "butt_sml";
            btn.style.color = "lightBlue";
            btn.innerText = "Spocitaj domy lepsie!";
            btn.onclick = () => this.calculateAndShow();
            btn.style.marginRight = '5px';
            const anchor = document.querySelector('input[name="buy"]');
            let inp = document.createElement("input");
            inp.className = "edit_big";
            inp.style.width = "34px";
            inp.style.marginRight = '15px';
            inp.id = "maxTurnReturns";
            anchor.parentElement.prepend(inp);
            anchor.parentElement.prepend(btn);
        };
    }
}

// CONCATENATED MODULE: ./src/locations/mass-houses.ts



// TODO: disable WIP so it won't interfere with gameplay
const mass_houses_handler = (services) => {
    var _a;
    const doc = getFrameDocument(FrameNames.Main);
    let houseReturnsService = new house_returns_service_HouseReturnsService();
    // houseReturnsService.run();
    houseReturnsService.createImprovedHousesCalcBtn();
    // Sum magic units
    const magicUnitCells = document.querySelectorAll('form[name="form_domy"] table tr td:nth-child(9) a');
    if (((_a = magicUnitCells) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        const sum = [...magicUnitCells].reduce((total, cv) => {
            return total + Number(cv.textContent);
        }, 0);
        console.log('Magickych jednotek:', sum);
    }
};
const massHousesHandler = (dataProvider) => wrapLocationHandler('Mass houses', dataProvider, mass_houses_handler);

// CONCATENATED MODULE: ./src/locations/hero-detail.ts

const heroDetailHandler = (dataProvider) => wrapLocationHandler('Hero detail', dataProvider, hero_detail_handler);
const hero_detail_handler = (services) => {
    const doc = getFrameDocumentForHeroPanel();
    const heroId = parseInt(document.URL.split('=')[1]);
    addToggleButtons(doc, heroId);
};
// 
// This only links to hero-artifacts location, which is the only 
// one that has list of available hero artifacts. 
// The url arg `s` is added to be used as a redirect trigger.
const addToggleButtons = (doc, heroId) => {
    const fragment = $(document.createDocumentFragment());
    const buttonsWrapper = $('<div>', {
        css: { padding: '1px', display: 'flex', alignItems: 'center' }
    });
    const btnCss = {
        padding: 1,
        marginLeft: 3,
        textDecoration: 'none',
        borderWidth: 1,
        height: 20,
        display: 'flex',
        lineHeight: '20px'
    };
    const attackToggle = $('<a>', {
        href: `/artefacts_list.asp?h=${heroId}&s=1`,
        html: `<img src="https://www.darkelf.cz/images/s/m.gif" alt="Útok" title="Útok" />`,
        target: 'Lista_Vlevo',
        'class': 'butt_sml',
        css: btnCss
    });
    buttonsWrapper.append(attackToggle);
    const defenseToggle = $('<a>', {
        href: `/artefacts_list.asp?h=${heroId}&s=2`,
        html: `<img src="https://www.darkelf.cz/images/s/sa.gif" alt="Obrana" title="Obrana" />`,
        target: 'Lista_Vlevo',
        'class': 'butt_sml',
        css: btnCss
    });
    buttonsWrapper.append(defenseToggle);
    const magicToggle = $('<a>', {
        href: `/artefacts_list.asp?h=${heroId}&s=3`,
        text: 'SK',
        target: 'Lista_Vlevo',
        'class': 'butt_sml',
        css: btnCss
    });
    buttonsWrapper.append(magicToggle);
    const thievingToggle = $('<a>', {
        href: `/artefacts_list.asp?h=${heroId}&s=4`,
        text: 'Kradeni',
        html: `<img src="https://www.darkelf.cz/images/crypts/c11.gif" width="23" height="16" alt="kradeni" title="kradeni + destrukce" />`,
        target: 'Lista_Vlevo',
        'class': 'butt_sml',
        css: btnCss
    });
    buttonsWrapper.append(thievingToggle);
    const necroSetToggle = $('<a>', {
        href: `/artefacts_list.asp?h=${heroId}&s=7`,
        html: `<img src="https://www.darkelf.cz/images/ar/ne6.jpg" width="20" alt="Nekro" title="Nekro" />`,
        target: 'Lista_Vlevo',
        'class': 'butt_sml',
        css: btnCss
    });
    buttonsWrapper.append(necroSetToggle);
    const kingSetToggle = $('<a>', {
        href: `/artefacts_list.asp?h=${heroId}&s=8`,
        html: `<img src="https://www.darkelf.cz/images/ar/kr1.jpg" width="20" alt="Vašek" title="Vašek" />`,
        target: 'Lista_Vlevo',
        'class': 'butt_sml',
        css: btnCss
    });
    buttonsWrapper.append(kingSetToggle);
    const unequipToggle = $('<a>', {
        href: `/artefacts_list.asp?h=${heroId}&s=6`,
        text: 'Nic',
        target: 'Lista_Vlevo',
        'class': 'butt_sml',
        css: btnCss
    });
    buttonsWrapper.append(unequipToggle);
    fragment.append(buttonsWrapper);
    const anchor = $(doc).find('#centrala > table:nth-of-type(4)');
    anchor.css('margin-top', '0');
    anchor.before(fragment);
};

// CONCATENATED MODULE: ./src/locations/hero-equip.ts


const heroEquipHandler = (dataProvider) => wrapLocationHandler("Hero equip", dataProvider, hero_equip_handler);
const hero_equip_handler = (services) => {
    var _a;
    const searchParams = new URLSearchParams(document.location.search);
    const set = Number(searchParams.get("s"));
    const heroId = Number(searchParams.get("h"));
    const heroArtsString = searchParams.get("arts");
    if (GM_getValue("redirectAfterEquip")) {
        GM_setValue("redirectAfterEquip", false);
        unsafeWindow.location.href = `hero.asp?h=${heroId}`;
    }
    const doc = getFrameDocumentForHeroPanel();
    const heroArts = (_a = heroArtsString) === null || _a === void 0 ? void 0 : _a.split("-").map((as) => ARTIFACTS_DB[as]);
    switch (set) {
        case 1:
            equipAttackArtifacts(doc, heroArts);
            break;
        case 2:
            equipDefenseArtifacts(doc, heroArts);
            break;
        case 3:
            equipSpellPowerArtifacts(doc, heroArts);
            break;
        case 4:
            equipThievingArtifacts(doc, heroArts);
            break;
        case 6:
            unequipArtifacts(doc);
            break;
        case 7:
            equipNecroSet(doc, heroArts);
            break;
        case 8:
            equipKingSet(doc, heroArts);
            break;
        default:
            break;
    }
};
function equipAttackArtifacts(doc, arts) {
    const bestAttackArts = findBestArtifactInAllSlotsFor(arts, "attack", "attackBonus");
    dlog("best attack arts", bestAttackArts.map((a) => a.name));
    equipArtifacts(doc, bestAttackArts);
}
function equipDefenseArtifacts(doc, arts) {
    const bestDefenseArts = findBestArtifactInAllSlotsFor(arts, "defense", "defenseBonus");
    dlog("best defense arts", bestDefenseArts.map((a) => a.name));
    equipArtifacts(doc, bestDefenseArts);
}
function equipSpellPowerArtifacts(doc, arts) {
    const bestSpellPowerArts = findBestArtifactInAllSlotsFor(arts, "spellPower");
    dlog("best spellPower arts", bestSpellPowerArts.map((a) => a.name));
    equipArtifacts(doc, bestSpellPowerArts);
}
function equipThievingArtifacts(doc, arts) {
    const bestThievingArtifacts = findBestThievingAndDestructionArtifacts(arts);
    dlog("best thieving arts", bestThievingArtifacts.map((a) => a.name));
    equipArtifacts(doc, bestThievingArtifacts);
}
function equipNecroSet(doc, arts) {
    const artifactSets = findArtifactSets(arts);
    if (artifactSets[3]) {
        equipArtifacts(doc, artifactSets[3]);
    }
}
function equipKingSet(doc, arts) {
    const artifactSets = findArtifactSets(arts);
    if (artifactSets[2]) {
        equipArtifacts(doc, artifactSets[2]);
    }
}
function equipArtifacts(doc, artifacts) {
    const selectFields = [...doc.querySelectorAll("select")];
    selectFields.forEach((sf, index) => {
        var _a;
        let bestArtValue;
        (_a = [...sf.options]) === null || _a === void 0 ? void 0 : _a.some((opt) => {
            var _a;
            if (opt.label
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes((_a = artifacts[index]) === null || _a === void 0 ? void 0 : _a.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
                bestArtValue = opt.value;
                return true;
            }
            return false;
        });
        if (bestArtValue) {
            $(sf).val(bestArtValue);
        }
    });
    // I need a persistent storage to keep the redirect
    // flag alive through frame reloads.
    GM_setValue("redirectAfterEquip", false);
    $('input[name="butt_save"]').click();
}
function unequipArtifacts(doc) {
    const selectFields = [...doc.querySelectorAll("select")];
    selectFields.forEach((sf, index) => {
        sf.selectedIndex = 0;
    });
    GM_setValue("redirectAfterEquip", false);
    $('input[name="butt_save"]').click();
}

// CONCATENATED MODULE: ./src/locations/auction.ts

const auctionHandler = () => {
    //
    // Move all auctions ending today to the top
    const frame = window.parent.document.getElementsByName(FrameNames.Main)[0];
    // The auction can be also opened from hell
    // which will have different layout so
    // we cannot use the generic getFrameDoc...
    const doc = frame
        ? frame.contentDocument
        : document;
    const summaryTables = doc.querySelectorAll('table[summary]');
    const artifactsTable = summaryTables[summaryTables.length - 1];
    const rows = [...artifactsTable.querySelectorAll('tr:not(:first-child)')];
    const rowsEndingToday = [];
    const otherRows = [];
    const today = new Date();
    const todayMatchString = `${today.getDate()}.${today.getMonth() + 1}.`;
    rows.forEach((row) => {
        const dateCell = row.querySelector('td:nth-child(8)');
        if (dateCell.textContent.includes(todayMatchString)) {
            row.style.boxShadow = '40px 0 2px orange inset';
            rowsEndingToday.push(row);
        }
        else {
            otherRows.push(row);
        }
    });
    $(rows).replaceWith($(rowsEndingToday));
    $(artifactsTable).append($(otherRows));
};

// CONCATENATED MODULE: ./src/locations/magic.ts


const magic_handler = (services) => {
    const { magicService } = services;
    const doc = getFrameDocument(FrameNames.Left);
    handleQuickSpell();
};
//#region Quick Spell
function handleQuickSpell() {
    // get quickSpell from url
    const searchParams = new URLSearchParams(document.location.search);
    const quickSpell = searchParams.get('qs');
    if (!quickSpell)
        return;
    if (quickSpell) {
        const k1 = document.getElementById('K1');
        const k2 = document.getElementById('K2');
        const k3 = document.getElementById('K3');
        const k4 = document.getElementById('K4');
        const k5 = document.getElementById('K5');
        switch (quickSpell) {
            case 'n': {
                k1.value = 7;
                break;
            }
            case 'nn': {
                k1.value = 7;
                k2.value = 7;
                break;
            }
            case 's': {
                k1.value = 5;
                break;
            }
            case 'p': {
                k1.value = 105;
                break;
            }
            case 'kr': {
                k1.value = 10;
                break;
            }
            case 'k': {
                k1.value = 115;
                break;
            }
            case 'dk': {
                k1.value = 117;
                break;
            }
            case 'ccc': {
                k1.value = 160;
                k2.value = 160;
                k3.value = 160;
                break;
            }
            case 'bbsmdsmddk': {
                k1.value = 110;
                k2.value = 110;
                k3.value = 180;
                k4.value = 180;
                k5.value = 117;
                break;
            }
            case 'smdsmdsmd': {
                k1.value = 180;
                k2.value = 180;
                k3.value = 180;
                break;
            }
            case 'mmmmm': {
                k1.value = 3;
                k2.value = 3;
                k3.value = 3;
                k4.value = 3;
                k5.value = 3;
                break;
            }
            default: break;
        }
    }
}
//#endregion Quick Spell
const magicHandler = (dataProvider) => wrapLocationHandler('Headquarters', dataProvider, magic_handler);

// CONCATENATED MODULE: ./src/locations/pay2win-overview.ts

function pay2win_overview_handler(services) {
    // Hide the audit of paid services.
    // It is way too long.
    const divWithSpendingHistory = document.querySelectorAll('div[align]')[2];
    divWithSpendingHistory.remove();
}
const pay2winOverviewHandler = (dataProvider) => wrapLocationHandler('Services Overview', dataProvider, pay2win_overview_handler);

// CONCATENATED MODULE: ./src/index.ts
var src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





















(function () {
    return src_awaiter(this, void 0, void 0, function* () {
        // Debug flag. Setting to false disables all console logs.
        // Use `dlog` function instead of `console.log` to make it work.
        unsafeWindow.de_debug = true;
        // Useful services initialization
        const dataProvider = new LocalStorageDataProvider();
        const { metadataService, landHistoryService } = getServices(dataProvider);
        // These locations are usually accessed before getting into the league.
        // Accessing them is a good opportunity for league metadata reset.
        if (['https://www.darkelf.cz/ligy.asp', 'https://www.darkelf.cz/index.asp', 'https://www.darkelf.cz/login.asp',]
            .includes(document.URL)) {
            metadataService.resetMetadata();
            return;
        }
        // This is the only frame/location which loads just once per login
        if (CurrentLocation.EntryMap)
            entryMapHandler(dataProvider);
        if (CurrentLocation.Land.Enemy)
            landHandler(dataProvider);
        if (CurrentLocation.Land.Economy)
            landEconomyHandler(dataProvider);
        if (CurrentLocation.Land.Diplomacy)
            landDiplomacyHandler(dataProvider);
        if (CurrentLocation.Hero.Detail)
            heroDetailHandler(dataProvider);
        if (CurrentLocation.Hero.Artifacts)
            heroArtifactsHandler(dataProvider);
        if (CurrentLocation.Hero.Equip)
            heroEquipHandler(dataProvider);
        if (CurrentLocation.TopBar)
            topBarHandler(dataProvider);
        if (CurrentLocation.InfoBar)
            infoBarHandler(dataProvider);
        if (CurrentLocation.Map)
            mapHandler(dataProvider);
        if (CurrentLocation.Leagues)
            leaguesHandler(dataProvider);
        if (CurrentLocation.Trophies)
            trophiesHandler(); // TODO: remove dataProvider dependency from handler
        if (CurrentLocation.Headquarters)
            headquartersHandler(dataProvider);
        if (CurrentLocation.MassHouses)
            massHousesHandler(dataProvider);
        if (CurrentLocation.Statistics.Auction)
            auctionHandler();
        if (CurrentLocation.Magic)
            magicHandler(dataProvider);
        if (CurrentLocation.Pay2Win.Overview)
            pay2winOverviewHandler(dataProvider);
        // ehm - dev workaround for saving history on demand
        // I am too lazy to make a button for it so just trigger this
        // from the web console :)
        unsafeWindow.saveHistory = () => landHistoryService.forceSave(getFrameDocument(FrameNames.Main));
    });
}());
/*
    Scripts for 3rd party websites
 */
(function () {
    if (CurrentLocation.Deficurky) {
        fillDeficurkyFormFromURL();
    }
})();


/***/ })
/******/ ]);