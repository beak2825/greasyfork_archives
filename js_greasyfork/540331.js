// ==UserScript==
// @name         IdlePixel Market Overhaul - TheeMarcel Fork
// @namespace    com.anwinity.idlepixel
// @version      1.6.56
// @description  Overhaul of market UI and functionality.
// @author       Original Author: Anwinity || Modded By: GodofNades/Zlef/Wynaan/TheeMarcel
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/540331/IdlePixel%20Market%20Overhaul%20-%20TheeMarcel%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/540331/IdlePixel%20Market%20Overhaul%20-%20TheeMarcel%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let marketTimer;
    let marketWatcherTimer;
    var marketRunning = false;

    const LOCAL_STORAGE_KEY_WATCHERS = "plugin_market_watchers";
    const LOCAL_STORAGE_KEY_LOG = "plugin_market_log";

    const LOCAL_STORAGE_LOG_LIMIT = 100;

    const MARKET_HISTORY_URL = "https://data.idle-pixel.com/market/api/getMarketHistory.php";
    const MARKET_TRADABLES_URL = "https://data.idle-pixel.com/market/api/getTradables.php";
    const MARKET_POSTINGS_URL = "https://idle-pixel.com/market/browse";

    const IMAGE_HOST_URL = document
    .querySelector("itembox[data-item=copper] img")
    .src.replace(/\/[^/]+.png$/, "");
    const COIN_ICON_URL = `${IMAGE_HOST_URL}/coins.png`;

    const XP_PER = {
        stone: 0.1,
        copper: 1,
        iron: 5,
        silver: 10,
        gold: 20,
        promethium: 100,
        titanium: 300,

        bronze_bar: 5,
        iron_bar: 25,
        silver_bar: 50,
        gold_bar: 100,
        promethium_bar: 500,
        titanium_bar: 2000,
        ancient_bar: 5000
    };

    const BONEMEAL_PER = {
        bones: 1,
        big_bones: 2,
        ice_bones: 3,
        ashes: 2,
        blood_bones: 4
    };

    const LEVEL_REQ = {
        // net
        raw_shrimp: "Cooking: 1",
        raw_anchovy: "Cooking: 5",
        raw_sardine: "Cooking: 10",
        raw_crab: "Cooking: 35",
        raw_piranha: "Cooking: 50",

        // rod
        raw_salmon: "Cooking: 10",
        raw_trout: "Cooking: 20",
        raw_pike: "Cooking: 35",
        raw_eel: "Cooking: 55",
        raw_rainbow_fish: "Cooking: 70",

        // harpoon
        raw_tuna: "Cooking: 35",
        raw_swordfish: "Cooking: 50",
        raw_manta_ray: "Cooking: 75",
        raw_shark: "Cooking: 82",
        raw_whale: "Cooking: 90",

        // plant seeds
        dotted_green_leaf_seeds: "Farming: 1<br/>Stop Dying: 15",
        red_mushroom_seeds: "Farming: 1<br/>Cant Die",
        stardust_seeds: "Farming: 8<br/>Cant Die",
        green_leaf_seeds: "Farming: 10<br/>Stop Dying: 25",
        lime_leaf_seeds: "Farming: 25<br/>Stop Dying: 40",
        gold_leaf_seeds: "Farming: 50<br/>Stop Dying: 60",
        crystal_leaf_seeds: "Farming: 70<br/>Stop Dying: 80",

        // tree seeds
        tree_seeds: "Farming: 10<br/>Stop Dying: 25",
        oak_tree_seeds: "Farming: 25<br/>Stop Dying: 40",
        willow_tree_seeds: "Farming: 37<br/>Stop Dying: 55",
        maple_tree_seeds: "Farming: 50<br/>Stop Dying: 65",
        stardust_tree_seeds: "Farming: 65<br/>Stop Dying: 80",
        pine_tree_seeds: "Farming: 70<br/>Stop Dying: 85",
        redwood_tree_seeds: "Farming: 80<br/>Stop Dying: 92",

        // bows
        long_bow: "Archery: 25",

        // melee
        stinger: "Melee: 5 <br /> Invent: 10",
        iron_dagger: "Melee: 10 <br /> Invent: 20",
        skeleton_sword: "Melee: 20 <br /> Invent: 30",
        club: "Melee: 30",
        spiked_club: "Melee: 30",
        scythe: "Melee: 40",
        trident: "Melee: 70",
        rapier: "Melee: 90",

        // other equipment
        bone_amulet: "Invent: 40",

        // armour
        skeleton_shield: "Melee: 20",

        // logs conver rate
        logs: "5% <br/> Convert to Charcoal",
        oak_logs: "10% <br/> Convert to Charcoal",
        willow_logs: "15% <br/> Convert to Charcoal",
        maple_logs: "20% <br/> Convert to Charcoal",
        stardust_logs: "25% <br/> Convert to Charcoal",
        pine_logs: "30% <br/> Convert to Charcoal",
        redwood_logs: "35% <br/> Convert to Charcoal"
    };

    const HEAT_PER = {
        raw_chicken: 10,
        raw_meat: 40,

        // net
        raw_shrimp: 10,
        raw_anchovy: 20,
        raw_sardine: 40,
        raw_crab: 75,
        raw_piranha: 120,

        // rod
        raw_salmon: 20,
        raw_trout: 40,
        raw_pike: 110,
        raw_eel: 280,
        raw_rainbow_fish: 840,

        // harpoon
        raw_tuna: 75,
        raw_swordfish: 220,
        raw_manta_ray: 1200,
        raw_shark: 3000,
        raw_whale: 5000,

        // net (shiny)
        raw_shrimp_shiny: 10,
        raw_anchovy_shiny: 20,
        raw_sardine_shiny: 40,
        raw_crab_shiny: 75,
        raw_piranha_shiny: 120,

        // rod (shiny)
        raw_salmon_shiny: 20,
        raw_trout_shiny: 40,
        raw_pike_shiny: 110,
        raw_eel_shiny: 280,
        raw_rainbow_fish_shiny: 840,

        // harpoon (shiny)
        raw_tuna_shiny: 75,
        raw_swordfish_shiny: 220,
        raw_manta_ray_shiny: 1200,
        raw_shark_shiny: 3000,
        raw_whale_shiny: 5000,

        // net (mega shiny)
        raw_shrimp_mega_shiny: 10,
        raw_anchovy_mega_shiny: 20,
        raw_sardine_mega_shiny: 40,
        raw_crab_mega_shiny: 75,
        raw_piranha_mega_shiny: 120,

        // rod (mega shiny)
        raw_salmon_mega_shiny: 20,
        raw_trout_mega_shiny: 40,
        raw_pike_mega_shiny: 110,
        raw_eel_mega_shiny: 280,
        raw_rainbow_fish_mega_shiny: 840,

        // harpoon (mega shiny)
        raw_tuna_mega_shiny: 75,
        raw_swordfish_mega_shiny: 220,
        raw_manta_ray_mega_shiny: 1200,
        raw_shark_mega_shiny: 3000,
        raw_whale_mega_shiny: 5000,

        //stardust fish
        raw_small_stardust_fish: 300,
        raw_medium_stardust_fish: 600,
        raw_large_stardust_fish: 2000
    };

    const CHARCOAL_PERC = {
        logs: 0.05,
        oak_logs: 0.1,
        willow_logs: 0.15,
        maple_logs: 0.2,
        stardust_logs: 0.25,
        pine_logs: 0.3,
        redwood_logs: 0.35
    };

    const CATEGORY_RATIOS = {
        ores: ["Coins/XP"],
        bars: ["Coins/XP"],
        bones: ["Coins/Bonemeal"],
        logs: ["Coins/Heat", "Coins/Charcoal"],
        raw_fish: ["Coins/Energy", "Energy/Heat", "Coins/Heat/Energy"],
        cooked_fish: ["Coins/Energy"]
    };

    const THEME_DEFAULTS = {
        default: {
            colorPanelsOutline: "#ffffff",
            colorPanelsBg:      "#ffffff",
            colorItemSlotsBg:   "#00ffdd",
            colorRowOdd:        "#c3ebe9",
            colorRowEven:       "#c3ebe9",
            colorText:          "#000000",
            colorChartLineMax:      "#b41414",
            colorChartLineAverage:  "#3232d2",
            colorChartLineMin:      "#509125"
        },
        dark: {
            colorPanelsOutline: "#2a2a2a",
            colorPanelsBg:      "#333333",
            colorItemSlotsBg:   "#333333",
            colorRowOdd:        "#333333",
            colorRowEven:       "#444444",
            colorText:          "#cccccc",
            colorChartLineMax:      "#b41414",
            colorChartLineAverage:  "#0984f7",
            colorChartLineMin:      "#509125"
        }
    };

	const SMITTY_IDS = {
		1: "smitty",
		9: "jesterz",
		11: "mash",
		13: "ulric",
		17: "luxferre",
		22: "babemomlover",
		35: "pmaguire13",
		51: "superpuh4",
		54: "treekeeper",
		58: "scripton",
		63: "geoneo42",
		69: "lmaragon",
		91: "grusiturbon",
		141: "fnask",
		159: "jt616",
		160: "serdar",
		161: "silen",
		165: "georik",
		176: "darksilence",
		199: "agrodon",
		222: "lolepolman",
		294: "omghookers",
		320: "exoshini",
		365: "richie19942",
		379: "kenosaurr",
		483: "pioter00000",
		484: "nogresh",
		534: "amyjane1991",
		541: "blade",
		542: "smethaj",
		566: "dakiller234",
		569: "laazuu",
		595: "syncy101",
		610: "gintrux24",
		620: "halflive9",
		624: "luxchatter",
		645: "dvoraks",
		647: "jedrick",
		689: "drdunder",
		702: "vesp",
		711: "liamk96",
		712: "fyrn",
		728: "schwarzsi",
		738: "robbha",
		755: "niko2003",
		769: "brobear988",
		812: "ihsous",
		841: "db72432",
		846: "murdarains",
		850: "disrx",
		868: "gamefrey",
		890: "oobifai",
		910: "alcohol",
		925: "grimmloch",
		934: "sifsnp",
		975: "deadlyseven",
		988: "kekke24",
		992: "racer",
		994: "itachi1706",
		1011: "bigfella",
		1031: "eegos",
		1033: "publicplayer",
		1083: "dekarbia",
		1097: "warlitz",
		1099: "ztkpeppard",
		1110: "aw3s0m3saus3",
		1111: "batchloo1",
		1113: "benwillard",
		1158: "voldinium",
		1203: "poopsock",
		1223: "youallsuck",
		1235: "ciyn",
		1268: "hendrix321",
		1288: "hax",
		1409: "captpork",
		1433: "whoisyou",
		1439: "claw45",
		1441: "pib",
		1456: "seiken",
		1473: "freeamyhugs",
		1499: "breakmyballs",
		1527: "hellofriend",
		1612: "herband",
		1613: "miniadri",
		1641: "howtobegrace",
		1656: "dnf",
		1665: "beyya",
		1668: "icedrop",
		1699: "gacoa",
		1710: "edward2001",
		1726: "valex",
		1753: "jellyop",
		1785: "ropro",
		1828: "sounds",
		1891: "theroyalcoco",
		1954: "j4c0m6",
		1986: "hii",
		1990: "kuroiteiken",
		2050: "laugexd",
		2058: "apsala",
		2128: "nnax",
		2151: "vipame",
		2218: "007",
		2231: "acdc",
		2262: "erendros",
		2269: "frustradead",
		2398: "novagod46",
		2412: "fozzwer",
		2581: "badgehunter",
		2678: "passi",
		2691: "rezero",
		2734: "pixlez",
		2812: "50centjohn",
		2879: "induche",
		2919: "xirvisa",
		2979: "orjan",
		3042: "helasraizam",
		3071: "liol",
		3099: "vivivi",
		3218: "zeragon",
		3252: "mayakovsky",
		3375: "trollzare",
		3410: "makeuqq",
		3412: "thewaterboy",
		3418: "crazyem",
		3452: "creris",
		3494: "faradox",
		3542: "kishandreth",
		3560: "tootoopig",
		3607: "hdcferb",
		3670: "ji0ng3683",
		3684: "colamity",
		3723: "kaliszia",
		3857: "lassebrus",
		3872: "faheem2",
		3890: "hamspiceds",
		4138: "hyde",
		4305: "jerko",
		4674: "linuxposer",
		4921: "applefiber",
		5245: "sexy_squid",
		5676: "snek",
		5824: "aisar",
		5889: "tzakyrie",
		5987: "spyplund",
		6090: "captainmick",
		6255: "emonlion",
		6274: "gillis",
		6355: "narants",
		6598: "blackblade",
		6657: "level",
		6663: "jarvis",
		7649: "harpocoatl",
		7762: "duckybom",
		7844: "notispaswag",
		7911: "welp",
		8030: "sigolo",
		8052: "jellybones",
		8169: "trigera",
		8199: "trojan",
		8296: "zorian91",
		8337: "monnik",
		8545: "kuresto",
		8764: "gubbelille",
		8879: "hyyra",
		8902: "abc123abc123",
		8909: "j0int",
		8933: "milco",
		8962: "snygget",
		9247: "scyther",
		9294: "williamstark",
		9427: "magnus",
		9785: "matteboi",
		9811: "edvin227",
		9973: "bilbo",
		10121: "chilloutryan",
		10169: "larethania",
		10495: "natureicy",
		10644: "j3ppe3",
		10659: "issew",
		10685: "buna191919",
		11361: "necrofart",
		11367: "ryddeman",
		11380: "snickersburk",
		11392: "fireblade920",
		11503: "nolife",
		11725: "kernowek",
		11742: "kajja2",
		11797: "kogart",
		11984: "lodis",
		12091: "ciyanx",
		12094: "robstradomus",
		12285: "lunaheal",
		12651: "mikedtss",
		12862: "astro",
		12939: "tryplyo",
		12992: "mairuu",
		13496: "floobs",
		13592: "cptsneballe",
		13607: "penislicker",
		13878: "maxi1207",
		13940: "dubhz",
		15059: "morgal",
		15225: "moist",
		15511: "atonycruz",
		15562: "fidler116",
		15629: "prinnygod",
		15686: "guitarjd13",
		15959: "swiftpain",
		16069: "kappakepa",
		16103: "holyblast",
		16328: "klemen",
		16329: "project",
		16382: "rockstump",
		16537: "hootch",
		16760: "freaker16",
		16775: "unferth",
		17034: "kape142",
		17089: "brittjens",
		17115: "deshwitard",
		17168: "stephanepare",
		17214: "giraffejesus",
		17262: "nezotteket",
		17263: "rooiedooie",
		17385: "kalaokki",
		17466: "mootre",
		17779: "camyeet",
		18846: "raxxen",
		18947: "mrwholesome",
		19109: "fredthefat",
		19231: "tav114114",
		19329: "thedarkgamer",
		19332: "brony181",
		19459: "svgmex",
		19562: "gethenus",
		19763: "berati55",
		19994: "flymanry",
		20057: "holken88",
		20099: "thedictator",
		20215: "nilsen",
		20457: "joshuacrain",
		20489: "rothsay",
		20914: "coolman90",
		21252: "skytten",
		21276: "zeragrodon",
		21382: "lord binary",
		21467: "morgan91",
		21756: "eduskunta",
		21769: "v394rd",
		21926: "gazao",
		21998: "linohlyn",
		21999: "nunomcp",
		22049: "teejae",
		22052: "psonic13",
		22086: "benbotox",
		22126: "fbi",
		22212: "monty oso",
		22243: "sandriana",
		22264: "sleepyynet",
		22267: "milks",
		22277: "flymanry2",
		22329: "cockalock",
		22378: "russell",
		22390: "dumbwit",
		22410: "sweetlover69",
		22430: "flymary",
		22450: "killerelite9",
		22453: "jstnlng",
		22487: "randolph524",
		22501: "emojiface69",
		22515: "snigeln",
		22576: "fighthouse",
		22644: "listurfiend",
		22669: "chickentacos",
		22693: "narvos",
		22729: "rowenary",
		22738: "kitt",
		22773: "dootypoopy",
		22813: "aziap",
		22835: "buttonlove",
		22901: "jameswarren",
		22907: "bigjobby",
		22932: "itsagamer",
		22943: "fernqvist",
		22959: "willsmithgg",
		22962: "dimos",
		22963: "suckerberg",
		22968: "xtoasty",
		22975: "woootf",
		22980: "bb3",
		22996: "master1",
		23033: "melllist",
		23043: "master2",
		23078: "itaysides",
		23210: "valleknugen",
		23218: "necrobyte",
		23233: "tcooley23",
		23257: "itc1595",
		23261: "semour",
		23301: "woodjedi",
		23316: "therevenant",
		23317: "baha",
		23376: "tin can",
		23394: "hawklove",
		23431: "miku0o",
		23626: "lemole",
		23709: "dreadcentaur",
		23717: "yondercypres",
		23761: "kolaciak",
		23810: "pablopdlc",
		23811: "happyism",
		23923: "stavos",
		23962: "shan007tjuuh",
		23970: "nasa",
		24060: "scipio",
		24088: "vlagod",
		24195: "molten",
		24219: "brxndonn",
		24225: "trump2020",
		24250: "testies",
		24262: "jimmythedog",
		24318: "amybear",
		24590: "milonti",
		24737: "zombiebunny",
		24742: "avatar1005",
		24814: "API~24814",
		24854: "crisanton",
		24906: "templeye",
		24995: "munykoo",
		25138: "skimask",
		25175: "snakke",
		25186: "shotgunlord",
		25264: "induche2",
		25341: "statheon",
		25380: "felipewolf",
		25434: "bigfis09",
		25530: "crashconner",
		25559: "patriot",
		25662: "capitano",
		25686: "lowercase",
		25702: "nathanaelpar",
		25755: "huggebugge17",
		25822: "hemp",
		25879: "inrix321",
		25891: "lemonn",
		25908: "rosepig",
		25956: "andy",
		25976: "autocorrect",
		26026: "bratworst",
		26029: "joys07",
		26062: "malpighi",
		26169: "cooliokris",
		26263: "bartjohn",
		26373: "axe",
		26595: "hi people",
		26682: "cadenator26",
		26694: "mrckrabs",
		26710: "sikislordu",
		26749: "musky",
		26886: "dogethebeast",
		26967: "smomburg",
		26987: "roxas404",
		27032: "progamer72",
		27155: "crucifer",
		27171: "unholydonuts",
		27190: "flatmooner2",
		27215: "blgchungus",
		27222: "lunatea",
		27252: "gr33n v0yd",
		27356: "omgsteven2",
		27378: "fad",
		27385: "derpyz",
		27391: "nmdm",
		27478: "jarredpro",
		27548: "theemarcel",
		27573: "urlikaz",
		27582: "istanbul",
		27630: "cibili",
		27695: "ethan7123",
		27735: "steeler",
		27756: "potatololz",
		27783: "pheynix",
		27791: "syntax",
		27800: "deathjhay",
		27842: "fatblackrat",
		27870: "whiscaskaat",
		27911: "pizza1337",
		27925: "drdornon",
		27968: "littlelocki",
		27993: "satsujin",
		28032: "dreadedbolt",
		28251: "lwkl2020",
		28292: "asly58",
		28341: "brettagamer",
		28352: "d3vilswork",
		28370: "jcoon225",
		28419: "miniflow",
		28530: "moistmoose",
		28588: "trojanhorse",
		28666: "oreo0421",
		28667: "oreo0422",
		28668: "oreo0423",
		28669: "oreo0424",
		28670: "oreo0455",
		28671: "oreo0426",
		28672: "oreo0427",
		28689: "idkwat2put",
		28690: "fourgalaxy",
		28729: "drsamantha",
		28789: "raistul",
		28841: "kenshi35353",
		29001: "meester",
		29057: "robojelly",
		29163: "imbad69",
		29206: "gamer517",
		29265: "cuppas",
		29285: "jelze",
		29307: "desmaize",
		29566: "thrsdzgaeger",
		29591: "usernames",
		29595: "zekura",
		29662: "foxscope",
		29718: "dually",
		29752: "smokerq",
		29876: "neverid02",
		29881: "yasinxd",
		30081: "ezcya",
		30096: "srbenites",
		30106: "serdarrg",
		30159: "pranav",
		30171: "kostiks",
		30176: "huejasstm",
		30224: "cryptify12",
		30371: "shyroni",
		30397: "noahsmathers",
		30404: "sdoublex183",
		30413: "sdoublex182",
		30437: "panda420",
		30479: "herrderlocke",
		30524: "anwinity",
		30534: "sweat4dayz",
		30550: "fatalwarrio7",
		30553: "reessagny",
		30557: "uriel",
		30570: "cole",
		30575: "warg1",
		30580: "nickgb",
		30584: "zrytel",
		30587: "icezone",
		30599: "shmeeblez",
		30600: "yepc",
		30605: "biomastar",
		30612: "mewtwo2387",
		30690: "gristlehead",
		31186: "fidler",
		31285: "assman",
		31602: "lusfer",
		31820: "snowballs",
		31926: "skitsvicious",
		32113: "theserver",
		33578: "burglarr",
		33932: "pitbull47528",
		34518: "brooksy",
		34971: "master3",
		36251: "veyran",
		36492: "jsgjsg2",
		36763: "biakaboose",
		37457: "fak1r",
		37530: "ashzinho",
		37570: "voidshifter",
		37777: "lewisulous",
		38194: "sanw00p",
		38916: "avron5",
		38945: "samras",
		39197: "triskattie",
		39392: "ataksak",
		39482: "hope4848",
		39778: "cutefoxeh",
		39898: "kingprawn",
		42500: "dannyabo",
		43811: "majk1ez",
		44074: "troll123abc",
		45131: "infernomax",
		45244: "superiordart",
		46092: "cvc",
		46684: "kreval",
		46710: "eastdragon16",
		46737: "experyus72",
		46946: "iog1c",
		47440: "zaki3926",
		48089: "awesomem123",
		48490: "monstersens",
		48502: "mccl0215",
		48600: "bladeoshadow",
		48875: "dracarys",
		48959: "joshua92",
		49232: "kuba12ee",
		49820: "muffinkopp",
		49876: "shroudedwolf",
		50062: "telemees",
		50105: "cheepuffy",
		50305: "simou989",
		50326: "parasiteee",
		50425: "captyell",
		50439: "cortasaire",
		50550: "grodon",
		50593: "callmeoddie",
		50882: "mehmetaliayy",
		52116: "haseeo",
		52217: "culler",
		52349: "dobby11302",
		53858: "kloss",
		54983: "oreo0428",
		55398: "shiryu",
		56159: "musiclovers1",
		57827: "eatmypossum",
		58162: "nck555",
		58386: "clyde bojan",
		58874: "salde",
		58948: "dracafrey",
		59045: "nerdyfox201",
		59159: "g2695885",
		59552: "alcerooock",
		59636: "popgoes",
		59812: "imnotyouraeb",
		59946: "glod4",
		59952: "garen98123",
		60184: "arcanun",
		60636: "g2511189",
		61687: "ellese13",
		61728: "nameentered",
		61919: "yoooo5732",
		61962: "6969prison",
		62227: "wootlink",
		62242: "cumdumpster",
		62244: "darkmaniak",
		62362: "karkish",
		62378: "j7890",
		62873: "midnightwarr",
		63131: "kjuszino",
		63884: "anarox",
		63900: "jobo25",
		63948: "jewddha",
		63977: "moisesdlc",
		63992: "koyot",
		64004: "icecold",
		64016: "bitcoin",
		64105: "guess23876",
		64112: "huay",
		64134: "awesomenoob",
		64147: "superman",
		64163: "direct",
		64193: "foxyballz",
		64288: "diverger",
		64355: "matrx122",
		64370: "hipshotdot",
		64401: "pickle rick",
		64489: "raisinthebar",
		64611: "we5cey",
		64669: "alexisgiorda",
		64681: "wert1234576",
		64713: "ghandi",
		64750: "lawsonplayce",
		64758: "macke",
		64773: "waffles121",
		64950: "woowoo",
		65077: "Darhk",
		65096: "laomol",
		65118: "perra",
		65170: "kill dragon",
		65270: "kzealos",
		65343: "vurtualjudge",
		65348: "phoenix101",
		65511: "chowlee",
		65527: "Woolfsan",
		65552: "Amiante",
		65670: "muhammadally",
		65691: "dongman",
		65715: "schismatic",
		65810: "gabrial",
		65846: "baileybeast7",
		65883: "lemman",
		65917: "bobydidnot22",
		66276: "treos",
		66279: "DrSacredTime",
		66394: "scrumshot",
		66397: "morgz9793",
		66432: "truxain",
		66475: "dbalter",
		66487: "styopa",
		66520: "shoblainx",
		66531: "freezeer",
		66632: "JustGoose",
		66690: "andrewin",
		66787: "chickgold123",
		66829: "s6509333",
		66877: "mezhone",
		67142: "Youseff",
		67219: "realboi56",
		67265: "kingpepzi",
		67284: "13hhoo",
		67350: "sharkbite202",
		67366: "wolf1800",
		67528: "mrderrp1",
		67637: "light",
		67638: "bfox",
		67658: "sashas",
		67677: "mazurr6",
		67905: "stiles",
		67991: "Itcamper",
		68015: "ekansh",
		68026: "cocojews",
		68098: "yyeman",
		68146: "extracheese",
		68149: "4ever",
		68156: "samztha",
		68289: "API~68289",
		68323: "Pipjim",
		68421: "hihihi",
		68465: "ming0812",
		68530: "mistahj",
		68553: "opietrice",
		68853: "kanchibar",
		68882: "TaJokZa",
		68917: "iamawsomenes",
		69085: "miraclemuz",
		69177: "hashy",
		69182: "thunderstar5",
		69208: "1234yfyv",
		69329: "user13",
		69375: "jman9079",
		69436: "biglatinking",
		69507: "bobbywtp",
		69754: "pharaok",
		69885: "lobus",
		69895: "khanh1",
		69989: "jackieboy",
		70166: "spinalbasoo",
		70328: "Fenman",
		70383: "dobby11709",
		70562: "craxxy",
		70762: "joys06",
		70765: "joys05",
		70862: "pp69",
		71042: "1 2 3",
		71118: "antaeus828",
		71134: "jaxonvm",
		71227: "Serfuzz",
		71340: "API~71340",
		71397: "remxb4",
		71417: "keltanen",
		71488: "emetems",
		71542: "turtleking",
		71598: "xszakix",
		71599: "vnshiruzen",
		71605: "cihatimin",
		71631: "dounford",
		71728: "undertaleman",
		71765: "ngmullins",
		71864: "fatalerror",
		72082: "EOwnez",
		72130: "wait",
		72191: "tumifumkins",
		72309: "apprez21",
		72443: "eatmybread",
		72552: "drizzt",
		72666: "tenebrislux1",
		72698: "goood",
		72976: "aflower",
		73082: "akihiro",
		73149: "minime",
		73193: "calvis",
		73212: "omnomdom",
		73213: "pennepasta",
		73364: "strxggle",
		73416: "orsted",
		73469: "ponzer",
		73513: "qilah",
		73681: "deanstensson",
		73988: "yuxzh",
		74002: "scout101",
		74011: "Docsnuggles",
		74024: "pals",
		74114: "leoej",
		74130: "bananaandpal",
		74310: "recon",
		74377: "the greatest",
		74426: "CharlieTehe",
		74630: "sm83",
		74719: "tanman15",
		74794: "fefek1",
		74851: "cheesestick",
		74858: "leefy",
		74945: "yeeburrito",
		75118: "Aarav",
		75125: "oceanwavex",
		75206: "cono6783",
		75271: "sbirsbir",
		75324: "slipperfruit",
		75794: "wad23",
		75834: "aidoneus",
		75875: "ansoag",
		76035: "annoyance",
		76049: "dhliu8002",
		76103: "SirZoop",
		76128: "willityl000",
		76199: "subscript",
		76217: "untiger",
		76347: "parkourfranz",
		76417: "endpotion",
		76436: "345899go",
		76505: "invalidoffer",
		76519: "T1god",
		76611: "yaydiamonds",
		76684: "sorrymate110",
		76720: "strawberi",
		76735: "farel8975",
		76808: "laura",
		76963: "blrwnafr",
		77012: "lolmaster09",
		77028: "captainwill",
		77045: "waffl",
		77130: "vincent12108",
		77188: "itsmedb",
		77209: "kajzerata",
		77258: "ryu",
		77264: "statik",
		77503: "panariva",
		77600: "haterade0808",
		77620: "panariva1",
		77629: "panariva2",
		77938: "socker",
		77958: "hinokara",
		77963: "kiki707",
		77966: "indiansword",
		78054: "jdshepperd77",
		78203: "charjellie",
		78207: "aki",
		78215: "cobra101",
		78230: "psibugboi",
		78242: "minxie",
		78390: "starturtleyt",
		78463: "demonspain",
		78534: "kambran",
		78556: "blep",
		78628: "jackraw",
		78678: "bananamuffin",
		78714: "chiknstrips",
		78724: "popear",
		78847: "opons",
		78892: "p3g4n1x",
		78997: "Kauto",
		79070: "alltix",
		79140: "ieatfood",
		79216: "laloca",
		79377: "arre",
		79418: "oke 1",
		79477: "lyrical",
		79563: "jjbrawlz",
		79750: "raiderboy",
		79779: "DeanBean",
		79780: "Nostrum",
		79815: "open",
		79848: "wanyiwan",
		79968: "API~79968",
		80034: "auzrath",
		80052: "stone",
		80135: "834391",
		80178: "onet",
		80198: "sharpgamer",
		80275: "thecaptainyt",
		80303: "supergiant07",
		80312: "xsacre",
		80337: "averdrity",
		80339: "liamthegreat",
		80353: "21iemanuel",
		80502: "dh3lol",
		80530: "huggybearojb",
		80552: "ffgtfgh",
		80673: "minh1412",
		80678: "zorrky25",
		80693: "larryy",
		80708: "shiggi",
		80759: "API~80759",
		80778: "instigation",
		80809: "smelldied",
		80981: "pikminfan1",
		81010: "player123",
		81022: "smallboydan",
		81035: "Oil Booty",
		81051: "person50605",
		81082: "ninjawiki",
		81095: "cyropyro",
		81158: "limegreen",
		81165: "2z2z2z",
		81182: "dank",
		81190: "lionzon",
		81246: "estratega",
		81321: "chimpura",
		81371: "janjen",
		81383: "andy265739",
		81455: "FuturePhelps",
		81499: "skyedemon",
		81506: "greymanchi",
		81595: "crazyhatter",
		81650: "099ersf2",
		81760: "kainchamele",
		81762: "rtxerz",
		81784: "gretchid",
		81799: "API~81799",
		81801: "mirai",
		81824: "goldwolf",
		81842: "xunlan",
		81866: "notsogood",
		81885: "lucas0322",
		81893: "ikaq",
		81898: "scourge",
		81906: "actualrandom",
		81909: "jedzhang",
		81920: "n00bmast4r",
		81924: "Kizuoo",
		81967: "j4kex2",
		81970: "BarKochba",
		82022: "meemee",
		82032: "osnar",
		82044: "ouija",
		82046: "lucifius87",
		82085: "ultraman",
		82102: "gule",
		82117: "lovedie",
		82146: "ihamth",
		82189: "corruptednob",
		82215: "pixu",
		82216: "loleivittu",
		82220: "kkonapixel",
		82232: "strato",
		82234: "lordgaspode",
		82252: "truesage",
		82276: "pann",
		82312: "sneh",
		82399: "jchen95",
		82402: "voldrethar",
		82411: "halfticket18",
		82532: "tt1122",
		82558: "zombcreep22",
		82568: "sherlock",
		82575: "asilypenguin",
		82601: "overlords",
		82603: "coopdogg",
		82621: "danieltan",
		82637: "madrobots22",
		82669: "cargan2022",
		82675: "sennenz",
		82684: "feefyquart",
		82688: "e7i7o4",
		82694: "lv5raid3r",
		82697: "thana",
		82698: "potatoboy",
		82699: "deadgarsruse",
		82704: "nussu",
		82711: "araknor",
		82717: "shusher",
		82723: "trader",
		82727: "thejuice",
		82728: "lostmycookie",
		82729: "funnybacon1",
		82731: "bookedfever8",
		82736: "dyson",
		82745: "kautos",
		82747: "zoeyt123",
		82750: "dequan1",
		82751: "cashmatt222",
		82754: "momo",
		82758: "itsvivrant",
		82759: "salsaberry1",
		82766: "jitteryswagi",
		82769: "beck2115",
		82772: "ipstigma",
		82774: "swishytail",
		82776: "eevees1",
		82777: "superno9",
		82778: "h12 h12",
		82780: "darknero42",
		82785: "blade v2",
		82788: "bobcameback",
		82793: "brodosh000",
		82804: "legacylife",
		82805: "yellow777",
		82807: "guest2028461",
		82812: "haha8397",
		82813: "pogg",
		82816: "ehhhok",
		82823: "goddambeatch",
		82827: "cmdrgooseman",
		82832: "lipides",
		82834: "ulfberth",
		82835: "x2811",
		82836: "atriox",
		82840: "iloveamy",
		82851: "s707024",
		82855: "whits15",
		82858: "soulslayer1",
		82868: "bert",
		82870: "gfsdgdssdg",
		82872: "3d god",
		82887: "kianlinder",
		82890: "dawud",
		82893: "missnobodyip",
		82902: "anwinbot",
		82905: "wee",
		82912: "amazing joey",
		82915: "3dterraria",
		82937: "antix",
		82942: "shaver0",
		82946: "ninjaad",
		82947: "hulker",
		82957: "eoin08",
		82961: "nikolaaaaa",
		82972: "vaiman",
		82974: "sireggsalot",
		82978: "ttk",
		82984: "fozzyman",
		82985: "supermuskrat",
		83004: "joenut916",
		83005: "wadepowell",
		83007: "laederlaepp",
		83008: "milamberza",
		83021: "punki8735",
		83026: "cellester",
		83027: "c0gan",
		83040: "nyx",
		83041: "daniil",
		83044: "supergiant01",
		83045: "pikachardrag",
		83046: "babydwagone",
		83052: "biggiechease",
		83054: "comethazine",
		83069: "hyper bob",
		83071: "yourboijango",
		83075: "codenamealph",
		83080: "aeternusdeus",
		83082: "keyrocketor",
		83092: "stotty246",
		83093: "ragingaxe",
		83102: "t22bbboi1000",
		83109: "reactorplayz",
		83113: "sammypingu",
		83116: "ninjamalkav",
		83117: "beskkov",
		83121: "tenos",
		83128: "bruhserious1",
		83130: "vikpat",
		83132: "alg",
		83136: "dboy",
		83138: "kahn200697",
		83141: "endlesssmile",
		83142: "malin",
		83144: "waterspiritx",
		83153: "cedar",
		83154: "feuersteiin",
		83160: "light15111",
		83166: "fishmaster",
		83179: "alexius",
		83180: "tropica",
		83184: "pewpewz",
		83233: "stotty69",
		83250: "nedflandersa",
		83263: "gtmax0523",
		83279: "peterzal",
		83283: "flekzj",
		83305: "kleinlol",
		83310: "pocketsum",
		83315: "galaxie2",
		83317: "mjwabby",
		83336: "1okboomer1",
		83344: "aqahunter",
		83362: "lupinicus",
		83385: "mokapuff",
		83409: "vcobra101",
		83440: "ivory",
		83441: "name69",
		83450: "lil eagle",
		83477: "retep3400",
		83480: "s2d34here",
		83494: "methheadjoe",
		83495: "smellysam208",
		83509: "ififika",
		83525: "lovesson",
		83530: "dunkyninja",
		83631: "sandwiches",
		83637: "ltsswb",
		83666: "jolisushi",
		83720: "gityxcom",
		83744: "yoeet",
		83760: "jowzer",
		83802: "cshasty",
		83828: "lucyf3r",
		83832: "aitaviz",
		83859: "joysticky2",
		83863: "jabber267",
		83868: "stimcar",
		83885: "kootei",
		83894: "gc5185",
		83985: "terper124",
		84007: "vvalido",
		84021: "hellowbellow",
		84026: "ecline",
		84042: "xd3monking42",
		84090: "brooksy work",
		84093: "bee",
		84179: "glitterhavoc",
		84204: "synogunn",
		84218: "ender3989",
		84241: "medallion",
		84247: "derp",
		84250: "asdasd",
		84253: "tdm238",
		84278: "blykes",
		84279: "misotheist",
		84289: "guest",
		84320: "greysteele",
		84323: "frostwolf26",
		84330: "siddaboss",
		84342: "sw33ny",
		84394: "pooper15",
		84396: "urmomisntfun",
		84403: "njursten",
		84413: "shelmerdine",
		84418: "morgondagar",
		84422: "mattmode",
		84441: "twrtlez",
		84489: "sxsxsxsxxdcc",
		84505: "javen",
		84543: "laban",
		84560: "legion",
		84571: "simpo12345",
		84575: "zabi",
		84576: "dragon rider",
		84596: "nick3",
		84614: "lemur",
		84630: "rmhoward",
		84638: "panimocna",
		84681: "edgeville",
		84704: "rodapro76",
		84719: "earthcat",
		84741: "everettqin",
		84743: "ralye",
		84761: "meh7541",
		84771: "shart",
		84850: "lengimen",
		84872: "sirtom",
		84898: "hcbutnosigil",
		84901: "ilymari",
		84909: "tony69",
		84913: "alexjb09",
		85229: "yourboykam",
		85254: "crazycb",
		85267: "arandomgamer",
		85295: "pcgamer1043",
		85298: "nickmahoney",
		85322: "towtle",
		85324: "majinsnail59",
		85340: "sylas",
		85372: "312414044",
		85409: "hngggeee",
		85453: "geass",
		85456: "herja",
		85528: "shadz",
		85552: "jahst",
		85593: "grumbles",
		85620: "berfers",
		85634: "dabingo69",
		85645: "hidden",
		85646: "iceevx",
		85652: "nekoshojo",
		85675: "bigmike",
		85676: "enjineer20",
		85678: "114514",
		85681: "theking77",
		85684: "lolno",
		85703: "hayoung",
		85715: "cricketsloun",
		85717: "thenitro",
		85721: "calvogamerpr",
		85736: "alttrading",
		85756: "1234yfyv25",
		85760: "elephantgod",
		85761: "drasgoon",
		85763: "jonnysins420",
		85785: "platinumpass",
		85790: "wolfdaa",
		85802: "vision0w0",
		85804: "dyingstar",
		85807: "trussville8",
		85812: "itxlama",
		85817: "rainoat",
		85821: "redfalcon",
		85829: "kreldorsilv",
		85856: "zerodelta",
		85873: "brunnomarion",
		85918: "ᓚᘏᗢ",
		85934: "hcat",
		85954: "cero",
		85962: "golfschmolf",
		86009: "bardofrage",
		86020: "elenarch",
		86117: "easheyzz",
		86126: "raconteur",
		86138: "warzone",
		86143: "mo2012",
		86186: "finnjn",
		86222: "bobeyuno",
		86230: "zbx",
		86246: "juniour1x",
		86255: "confit",
		86256: "parad0ck",
		86259: "sisi",
		86278: "finni",
		86314: "dogedoge2000",
		86323: "ghost669",
		86330: "inkerbelll",
		86331: "lipleonaxil",
		86335: "munchyorgans",
		86341: "thana7",
		86348: "1176746317",
		86359: "olivegarden",
		86361: "dyl",
		86365: "corns",
		86369: "chickenwings",
		86376: "fartgod21",
		86381: "valcar",
		86432: "heeheecheese",
		86437: "wasper",
		86453: "nyhz",
		86473: "wyatt14",
		86521: "russian174",
		86532: "notalttradin",
		86556: "bacon1989",
		86578: "s225241",
		86605: "1kongking",
		86642: "monke69you",
		86717: "midgie",
		86758: "monnazz",
		86836: "cashley",
		86870: "ianjohnplay",
		86885: "dkindle",
		86899: "kevins123",
		86970: "caponejunior",
		87026: "shadowhawk11",
		87039: "world66",
		87050: "restive",
		87066: "jens2",
		87122: "pathique",
		87173: "crxckydareal",
		87218: "kramgo",
		87220: "craz186",
		87373: "gh0stie",
		87389: "dmttic",
		87433: "kitsu",
		87443: "ruteski",
		87594: "fajs",
		87595: "distx",
		87747: "0x20",
		87785: "riccardo72",
		87896: "pandakid116",
		87923: "2default",
		87996: "kpuuuuu",
		88003: "geraosf",
		88040: "thesloth",
		88098: "dapapaya",
		88127: "quaker0",
		88176: "grifoli",
		88259: "jsm5557",
		88287: "tangjy",
		88363: "ezissmart",
		88388: "n8thegr899",
		88457: "ogerhcyt",
		88488: "goldsoup9",
		88586: "robartios",
		88779: "brobba1",
		88884: "doubledipps",
		89078: "melocke",
		89128: "ube",
		89130: "unlawfulyyrs",
		89142: "guest_kjzbe",
		89183: "demonachizer",
		89248: "stefan",
		89571: "peutj",
		89587: "ln41",
		89671: "kramen",
		89777: "shelfman",
		89799: "guest_wsfar",
		89845: "dvb2",
		89869: "kowloon",
		90053: "kinnad",
		90072: "stixy92",
		90161: "not moldar",
		90186: "bradells",
		90357: "goodhumoured",
		90417: "thereacher",
		90508: "grimfang",
		90559: "bloodwood",
		90561: "anzha",
		90608: "sonicenjoyer",
		90639: "malefus",
		90688: "batschbirne2",
		90886: "essardiage",
		90956: "yukihira",
		90957: "1998nik",
		90969: "kitcher69",
		91014: "sivartus",
		91084: "secre",
		91141: "gobo123",
		91181: "emh593",
		91259: "azeran",
		91286: "guest_ygggf",
		91439: "sablemink",
		91539: "enexysftw",
		91692: "grylis1",
		91823: "API~91823",
		91894: "xxxxxxx",
		92167: "omminn",
		92359: "woowoodaboss",
		92394: "rangus",
		92536: "alanl2011",
		92562: "dwalt",
		92566: "b l a n k",
		92571: "shrimp king",
		92663: "elranthan",
		92725: "tittiebuster",
		92794: "godofnades",
		92858: "spinnybrook2",
		93023: "nanozan",
		93053: "cullen",
		93057: "otai",
		93136: "asdfwefwef",
		93196: "guest_mabwe",
		93218: "goma",
		93288: "saitamatokyo",
		93382: "neroq",
		93398: "fushicul",
		93406: "model kx",
		93421: "guest_tyawz",
		93438: "ralphcpjrx",
		93622: "guest_fdpvq",
		93684: "nukaocpo",
		93685: "guest_scvzk",
		93703: "bcnc34",
		93724: "kibasiro",
		93754: "ebios",
		93771: "cuku",
		93772: "pontaro",
		93798: "guest_jkxja",
		93893: "gules",
		93902: "maustar",
		93904: "guest_aamzd",
		93946: "guest_mdcqr",
		94020: "yamajiro",
		94058: "roto",
		94077: "gonedonedo",
		94147: "romuska",
		94165: "guest_peukj",
		94245: "semedaruma",
		94320: "guest_ebuxx",
		94335: "gtr2022",
		94414: "mochio",
		94415: "7743",
		94426: "guest_gydgm",
		94458: "kanikuma",
		94628: "moimoi0621",
		94651: "guest42069",
		94677: "sequal",
		94757: "guest_zygtd",
		94769: "willym00",
		94819: "lominatrix",
		94832: "meteox",
		94840: "akado",
		94882: "mayhem",
		94883: "dztgx",
		94884: "grill",
		94962: "27kahlcon",
		94981: "riddler 678",
		95012: "telarizs",
		95043: "hceline",
		95164: "siitake",
		95214: "thesubdark",
		95255: "prosama",
		95298: "daifuku",
		95353: "t10",
		95389: "geoj",
		95429: "og secretpro",
		95437: "gishi92",
		95445: "souleate3",
		95456: "frontier24",
		95500: "alaiselsa",
		95529: "xfeet",
		95596: "mcwarhammer",
		95606: "doldhov",
		95721: "tiberiusg",
		95723: "zimby2095",
		95777: "goodonesaret",
		95812: "hoarseboltro",
		95823: "3th0s",
		95838: "millax2525",
		95871: "sirchonky",
		95973: "bigjobby",
		96093: "mlf",
		96148: "goldie",
		96202: "trapo10",
		96223: "dragoons",
		96232: "robbobhob",
		96264: "stormclouds",
		96278: "nethercat888",
		96279: "idlechicken",
		96330: "guest_fwwej",
		96337: "natswallis",
		96415: "shike",
		96471: "sparxlz",
		96564: "mdeatike",
		96603: "scpey",
		96629: "mlise",
		96635: "shobie",
		96740: "guest_udrpx",
		96756: "zeklos",
		96806: "omariharbl",
		96865: "API~96865",
		96874: "dittothegod",
		96896: "koshihikari",
		96909: "pestcontrol2",
		96932: "trevbone",
		96953: "jimbob",
		97126: "odunu",
		97340: "maindog",
		97828: "pero88888735",
		97918: "littleanimal",
		98070: "foxymew",
		98088: "gingerhead",
		98091: "takuya",
		98272: "max12",
		98301: "nimaa1993",
		98460: "guest_agfzx",
		98463: "abelia wiz",
		98466: "mjnb",
		98575: "motolov",
		98598: "optica89",
		98655: "tsuki",
		98813: "rospiggen",
		98887: "monomm",
		98889: "gennkotu",
		98943: "oxbor",
		98987: "guccialakaza",
		99000: "nillygorilly",
		99108: "epiphany",
		99125: "smoke13",
		99157: "gannman",
		99201: "adonai",
		99398: "guestvdqym",
		99462: "realitor",
		99494: "dvrk",
		99510: "darkroot",
		99523: "liamqte",
		99526: "flamesmh",
		99527: "tigbitties",
		99535: "shadowkilaaa",
		99552: "dickbutticus",
		99696: "wangb5573a",
		99726: "mrozi",
		99743: "guest7929483",
		99747: "yuuki300",
		99748: "vrnk",
		99754: "xentuz",
		99760: "ezrawater266",
		99776: "hero 20",
		99793: "hminer",
		99797: "1046898abc",
		99826: "thzue thuz",
		99835: "ozegar",
		99841: "efha",
		99902: "wkxga",
		99906: "toaster102",
		99912: "aallke",
		99931: "connor9999",
		100008: "apkhoil",
		100077: "bl1tz",
		100176: "godson",
		100199: "endi",
		100276: "monke42o",
		100384: "paddycat",
		100403: "wiz",
		100416: "cagdas683",
		100425: "dralina",
		100472: "idkk",
		100525: "mitchym",
		100538: "yorguntroll",
		100569: "opcoolness",
		100622: "krzarm",
		100637: "guest_mzvpd",
		100687: "thewolfyt99",
		100825: "nilu1235",
		100845: "terpe",
		100846: "pooman",
		100916: "hi0there",
		100919: "kenu",
		100945: "2012wastaken",
		101027: "neotarlaxx",
		101051: "thordin",
		101076: "tehehe",
		101153: "tenares",
		101182: "okkoz2",
		101222: "guest_uexzv",
		101235: "simony",
		101272: "spikosnail",
		101276: "rex000000000",
		101303: "ebelinmergal",
		101346: "falm",
		101409: "smiskish",
		101427: "codex234",
		101470: "creepyhilo",
		101476: "metaLpete",
		101538: "yall",
		101548: "sdfygysduyf",
		101558: "angad211207",
		101582: "linkn2601",
		101608: "wolfb722",
		101646: "cephied0",
		101709: "matemen",
		101741: "zane gia",
		101767: "roddy",
		101833: "API~101833",
		101887: "nonsensefief",
		102025: "路人a",
		102037: "sstar1",
		102072: "margal",
		102310: "guest_wbuxu",
		102327: "cat holic",
		102551: "loophoc",
		102559: "yesnt",
		102637: "skipcast",
		102641: "seanyboiii28",
		102942: "marakesh",
		103229: "lediable666",
		103341: "rednike",
		103666: "newobh",
		103856: "mantus",
		103860: "czmmu",
		103905: "heiks",
		103952: "hunk",
		104032: "idiotperson",
		104069: "chillora",
		104358: "poincare",
		104425: "jollyjim",
		104446: "thqnos",
		104485: "guest1125566",
		104544: "shienshokun",
		104613: "ывыф",
		104673: "m22",
		104689: "webep",
		104777: "cipek",
		104883: "fearfulonyx",
		104902: "sklzy",
		104971: "kalle",
		105019: "shadowthyme",
		105169: "kekler",
		105360: "plusninja",
		105391: "tuntinhas",
		105421: "lilyjersy009",
		105552: "gatsu83ita",
		105575: "susy baka",
		105625: "rpro35864",
		105694: "guest_pesaj",
		105702: "botofnades",
		106008: "godhelpme",
		106183: "gamesgamesga",
		106237: "pixfort",
		106285: "anguy",
		106289: "yubbzy71",
		106329: "sam123jo0",
		106358: "leozao",
		106389: "API~106389",
		106398: "lol1234",
		106443: "luka119",
		106529: "maniaman1994",
		106583: "kenster",
		106594: "makal",
		106683: "thebacon",
		106690: "softwork",
		106788: "napstyy",
		106807: "geusea",
		106828: "guest_gammx",
		106934: "ethanlar",
		106961: "mine diamond",
		107057: "freezetail",
		107067: "keremtorun",
		107082: "shiroyt",
		107162: "dyegon101",
		107235: "yasodigo",
		107436: "goddarncrow",
		107442: "comics1996",
		107524: "3s0t3r1c",
		107541: "knmt22",
		107636: "bureeyn",
		107809: "guest_axyvb",
		107899: "bronzmaster",
		107917: "kandohar",
		107956: "fztl",
		108061: "ufocuk",
		108070: "emiran",
		108086: "baha14",
		108088: "gvgjt",
		108237: "kompil",
		108337: "cloakedsif",
		108352: "guest_gterj",
		108402: "zalata",
		108418: "butzen",
		108466: "che13",
		108638: "peconpie1000",
		108716: "imjustplayin",
		108797: "notsolucky",
		108819: "caracal",
		108930: "fhénix",
		109015: "timist",
		109149: "sirdeath",
		109207: "ibouprofene",
		109323: "shinwoo",
		109353: "kerth",
		109387: "API~109387",
		109389: "emmooly",
		109403: "liefhan",
		109419: "fractaldust",
		109433: "goianeiro",
		109497: "inxflames",
		109593: "zyrok",
		109870: "bobonwork",
		109878: "flerbiglerb",
		109890: "ch8tasnm",
		109967: "cartecay",
		109972: "etno9412",
		109983: "kornasek123",
		110041: "darincampo",
		110129: "empyers4444",
		110135: "bg3",
		110154: "vuzzzle",
		110185: "zheng",
		110298: "alphabravo",
		110320: "jellyb",
		110448: "серега112",
		110486: "ballssss",
		110488: "spaz12gg",
		110627: "ninjajesus42",
		110794: "hoemaam",
		110812: "calipt",
		110833: "nexstranger",
		110861: "pokebeans",
		110900: "agatha",
		111057: "asterixgooon",
		111082: "davidgaoo",
		111175: "plexi",
		111255: "jay8",
		111307: "people26",
		111344: "casppiii",
		111406: "voxcillion",
		111471: "micahkang11",
		111491: "camo",
		111517: "lalolilolu",
		111548: "fallen52",
		111587: "pockle",
		111595: "mijati",
		111598: "burntbagel",
		111727: "emblazoned",
		111776: "tituska0515",
		111779: "antonnn",
		111789: "furiousdx500",
		111832: "htun",
		112009: "spockman22",
		112081: "arksnorax142",
		112084: "admirallake",
		112095: "bellot",
		112266: "watoq",
		112282: "memerson3",
		112287: "real riddler",
		112396: "mjay",
		112420: "fingolfin",
		112457: "uniadam1608",
		112462: "metaps",
		112496: "mgflife",
		112508: "bronzeman",
		112533: "30linathan",
		112677: "hunterr0306",
		112691: "boltm34",
		112762: "guest_xxmyq",
		112765: "idlerpixler",
		112778: "regdan",
		112780: "520177",
		112836: "ninja grim",
		112837: "venturo2",
		112844: "mcsmo",
		112882: "tomato12",
		112928: "player2",
		112998: "hc bro",
		113008: "alexjkdcqc",
		113078: "mikem",
		113085: "skypeace",
		113152: "afk miner",
		113164: "ymunchyy",
		113224: "bloodgood",
		113275: "iminschool",
		113352: "dajdza",
		113410: "downloadnowf",
		113466: "ashleyplayz",
		113514: "burden",
		113532: "guest_wxyfu",
		113571: "mametarokun",
		113577: "elona",
		113587: "wabisabi",
		113595: "jason11352",
		113630: "wenchy",
		113670: "night172",
		113679: "newgame",
		113709: "paperxd",
		113859: "gridvoin",
		113936: "guestscvzk",
		114026: "jeremy",
		114044: "dakarai",
		114047: "guest_qkexx",
		114224: "arsuma1996",
		114248: "smallchild84",
		114376: "1053925",
		114652: "pietateip",
		114714: "paliga",
		114786: "ar91839751",
		114800: "nwj96",
		115312: "cymbidium",
		115313: "horserider",
		115360: "cammyrock",
		116113: "sacerca",
		116150: "e norm",
		116250: "evoti",
		116283: "mippo",
		116285: "knackx",
		116419: "just a nerd",
		116467: "lodz",
		116516: "swimispro",
		116696: "ebios2",
		116758: "theleder1",
		116772: "pichuhex",
		116976: "gabelinskii",
		116986: "mrboomstronk",
		117059: "dretwy",
		117077: "guest_pwtmd",
		117105: "kotapoyo",
		117111: "swindle",
		117151: "yuayumia",
		117299: "fallblade",
		117309: "guest_wzsyq",
		117410: "daichi383",
		117497: "killerbanjo",
		117503: "metal duck",
		117537: "koopaidiot",
		117550: "koro",
		117559: "littlegg1288",
		117604: "deusgramm2",
		117806: "pointless",
		117853: "lil egg",
		117973: "ma25",
		118005: "giorgio",
		118061: "chrisfly007",
		118290: "kirbo",
		118352: "guest_ggssk",
		118388: "spy penguin",
		118393: "holyduckv1",
		118411: "dwauikghuiaf",
		118528: "vetej",
		118578: "coyotee",
		118714: "API~118714",
		118825: "beepobeepo",
		118837: "mrjoebear",
		118972: "nokru",
		118976: "sharkedmania",
		119020: "dom011310",
		119071: "shawng93",
		119074: "tryme",
		119196: "iettaigator",
		119199: "permafox",
		119207: "greenturtle",
		119279: "crabguysea",
		119374: "kuninori3333",
		119447: "milkyw4i",
		119495: "guest_paxbu",
		119502: "silent raven",
		119570: "hhhhoooo",
		119580: "fanofmohgwyn",
		119608: "guest_jdfxv",
		119612: "cecej",
		119632: "hccoco",
		119675: "le king",
		119724: "API~119724",
		119776: "birdmanbilly",
		119877: "powerdoodler",
		119911: "jshsidekick",
		119969: "API~119969",
		119998: "iamgroceries",
		120071: "wessamr",
		120116: "iintyouanji",
		120336: "landog123",
		120438: "deathupon",
		120532: "mvhel",
		120547: "ruiop333",
		120576: "lighttanis",
		120599: "profnyoom",
		120604: "clipseltart",
		120621: "kampfwagen",
		120629: "tyty39",
		120770: "jaknoobz",
		120802: "arrival",
		120867: "padfoot",
		120937: "suru",
		121011: "funeral",
		121071: "toxicace",
		121078: "backet hat",
		121124: "demonsnroses",
		121132: "numbertwo",
		121170: "muffi",
		121183: "4y6",
		121234: "britishtea",
		121280: "floger",
		121289: "taroble",
		121290: "readmi",
		121296: "steve123hc",
		121305: "vithrick",
		121308: "poplolyay20",
		121408: "wiskah",
		121535: "nerfminer",
		121550: "8illy",
		121569: "honeycrunch",
		121633: "pangpangq1",
		121711: "dsdsksjkajk",
		121727: "resawl",
		121743: "amairgumbuck",
		121753: "kyprioth",
		121828: "guest10399",
		121858: "13777877893",
		121865: "demonlilly",
		121935: "voidgodd",
		121946: "funtasticcc",
		121956: "averagebones",
		121990: "pianist87",
		121993: "douglas",
		122006: "xcentricorbi",
		122027: "zlef",
		122048: "yutakat",
		122074: "nathsae",
		122087: "avius",
		122129: "rajez",
		122251: "sakakakan",
		122255: "ovid",
		122268: "ooga booga",
		122330: "tsutomu",
		122510: "default212",
		122711: "rolypoly",
		122716: "rngisbad",
		122734: "montywhisper",
		122793: "kbommer",
		122963: "choro931",
		122969: "vitalknight",
		122984: "satatehat",
		123049: "seravira",
		123062: "banban",
		123067: "mumbo",
		123127: "sirwombat",
		123386: "patorens",
		123404: "sutesute",
		123560: "frog god",
		123626: "aniceperson3",
		123642: "minako",
		123696: "strangus",
		123749: "grejl",
		123899: "damien",
		124016: "coinguy",
		124020: "moumou555",
		124023: "ready1000",
		124109: "polkiol",
		124161: "mansafe",
		124199: "danzilll",
		124213: "kaakun",
		124215: "angeange444",
		124228: "mavil",
		124266: "fraser",
		124331: "kazaan467",
		124334: "blahbllah2",
		124460: "guest_uqbaj",
		124497: "wolfe2011",
		124574: "someoneasome",
		124612: "hero 21",
		124628: "lavalamp",
		124769: "shadowslyr66",
		124824: "mrfedora",
		124855: "buhlahkay333",
		124856: "aeyeah",
		124865: "neme456",
		124881: "becyeah",
		124923: "iancheng2012",
		124936: "asteriea",
		125012: "moneyface99",
		125015: "andrewinbax",
		125023: "geospells",
		125106: "ej309129",
		125116: "madmod",
		125142: "sneedchuck",
		125159: "nitter",
		125166: "0mitchtea0",
		125233: "dogeater",
		125249: "xak",
		125267: "phoenix7",
		125290: "baller no1",
		125308: "switcher21",
		125330: "lalala32",
		125331: "vinicusvmng",
		125382: "lalala30",
		125384: "dekehulin7",
		125432: "xenos",
		125473: "play111",
		125495: "jae",
		125526: "brynia",
		125566: "nixelpixel",
		125578: "acesoldier",
		125605: "pheobe",
		125699: "cookieman11",
		125751: "smitty44",
		125815: "bluberryaaaa",
		125927: "villa216",
		125965: "frosty21",
		126002: "nidht",
		126036: "ebugg2011",
		126132: "na200",
		126134: "skult",
		126141: "killercreed5",
		126145: "decoy",
		126147: "pingaloca",
		126149: "tarsin",
		126524: "esquiloalbin",
		126646: "blinkdd",
		126922: "williamjew",
		126956: "lonestar3242",
		127031: "ppitek40",
		127114: "ragnorak2",
		127169: "dryack",
		127251: "clarksfield",
		127460: "commandovmk",
		127519: "angero",
		127617: "krampus",
		127623: "austinnxd",
		127625: "remma",
		127647: "dyloonytoons",
		127653: "feizu",
		127740: "molpo",
		127800: "betafeta",
		127949: "kuraiji",
		127956: "doon",
		128077: "ragnorak1",
		128174: "zpmjay",
		128225: "sliverwolf",
		128304: "lower99",
		128360: "bigbyson",
		128365: "sirblueberry",
		128421: "dxkmi",
		128429: "supahelsing",
		128465: "sinister113",
		128490: "spiritsk",
		128545: "jtass",
		128570: "darthblood",
		128638: "taki",
		128661: "stardusty",
		128718: "tyraravenlk",
		128727: "agrica2",
		128753: "nokotuki",
		128801: "evander",
		128834: "mignoz",
		128947: "keenan evans",
		128989: "pearly",
		129021: "aleex",
		129050: "szkz",
		129055: "hannhans89",
		129115: "jayden69",
		129203: "eduard",
		129305: "long1234",
		129446: "guest_vvbzf",
		129497: "elandal",
		129557: "anko300",
		129612: "aditheawsome",
		129758: "guest_mafqy",
		129767: "notiert",
		129778: "robozlef",
		129803: "API~129803",
		129822: "piress",
		129849: "legocraft",
		129872: "API~129872",
		130038: "hardcore1231",
		130072: "lightning12",
		130147: "guest_vkzmy",
		130199: "adeesn0t",
		130205: "dedtroy11",
		130405: "inisitijitty",
		130434: "ewa09",
		130436: "imperial",
		130499: "mylady",
		130534: "yukihana",
		130546: "krimineldin",
		130574: "lazerkill",
		130609: "broombasket4",
		130631: "uki",
		130679: "lcey",
		130714: "kabokomar",
		130842: "suzieq",
		130912: "yakuritera",
		130938: "ruiop109",
		130948: "omegatorch",
		130962: "bschmidt000",
		130968: "mn44f",
		131014: "hellomyname",
		131021: "waffle",
		131059: "huujuu",
		131121: "akirafalopas",
		131127: "kuroln",
		131235: "ol1v1er09",
		131279: "tortoise7",
		131288: "cuberverse",
		131315: "coleuncapher",
		131350: "flowercats",
		131409: "happy sun",
		131426: "mavi13",
		131428: "le optex",
		131535: "melon bird",
		131699: "onediffman",
		131708: "chorweil",
		131797: "amblikmeez",
		131799: "mikatamo",
		131855: "svartsyn",
		131977: "lutezio",
		132086: "guest_srxza",
		132101: "bagaceiras",
		132129: "superkingz",
		132189: "fotttt",
		132225: "skaffa",
		132251: "mandrew",
		132307: "hologaster",
		132311: "bobreloaded",
		132339: "gherek000",
		132350: "psyako",
		132427: "bigoud",
		132538: "ernepito",
		132636: "atari",
		132676: "bongoidle",
		132685: "yuii",
		132729: "jfaltous",
		132753: "apoilo",
		132852: "star98765431",
		132865: "kt333",
		132937: "iidanii",
		133008: "dengdeng",
		133032: "guest_yjkpa",
		133057: "ezorken",
		133127: "jhubnon",
		133172: "aigis",
		133182: "guest_quvkz",
		133216: "omiredrose",
		133263: "aaiin",
		133294: "charm",
		133323: "pr0j3t0",
		133405: "sanjyiu",
		133497: "jason1648",
		133515: "narpnarp",
		133519: "carlos",
		133542: "dranurg",
		133576: "aax22310",
		133606: "ada",
		133714: "iplayforfun",
		133822: "lholtz000",
		133835: "nickel",
		133887: "chigo30",
		133910: "chrpet91",
		133923: "API~133923",
		133981: "danman87654",
		134094: "yousuck",
		134134: "gortie",
		134195: "poyopoyo",
		134311: "lpellei",
		134370: "numbuh7",
		134379: "reddy",
		134447: "cheeseballs",
		134448: "snicklpickl",
		134450: "thatguy345",
		134538: "weve000",
		134561: "abdulla",
		134577: "vanick00",
		134656: "creeper649",
		134693: "trgn",
		134743: "mowere0",
		134857: "1blucky",
		134883: "milo7717",
		134996: "totoro 47",
		135013: "rwinner16",
		135297: "totorydby",
		135312: "ishythefishy",
		135386: "allen83546",
		135523: "nolanchrisse",
		135552: "littlekia",
		136068: "lisa ferrat",
		136085: "teateatea",
		136109: "API~136109",
		136158: "xendrein",
		136217: "ownin",
		136234: "neojump",
		136235: "mully",
		136384: "cigo30levil",
		136464: "guest_kwaax",
		136491: "detahat1799",
		136639: "greedialb",
		136650: "philbertt iv",
		136668: "ardcore2",
		136673: "dhpiswinning",
		136680: "hc tryout",
		136681: "peconpie1",
		136688: "one death",
		136690: "paperlul",
		136691: "dyloonytoon",
		136692: "r1hc35864",
		136693: "scpezz",
		136696: "hardercore",
		136697: "dylantoons",
		136700: "deathless",
		136704: "agountursas2",
		136708: "greymanchihc",
		136711: "thug shaker",
		136712: "efilon",
		136714: "nami hard",
		136725: "papercc",
		136733: "zeragon 1lhc",
		136735: "dralina1lhc",
		136736: "ions331",
		136737: "k1ng0at",
		136738: "hcofrage1",
		136741: "1pixel",
		136743: "1shotdead",
		136745: "smittyiscool",
		136746: "numbuh8999",
		136747: "scpea",
		136748: "jhar5008",
		136753: "2pixel",
		136754: "3shotdead",
		136755: "dralina2lhc",
		136758: "dontdielol",
		136759: "gunnar1life",
		136760: "dralina3lhc",
		136762: "ral08hc",
		136766: "dapapaya1hc",
		136769: "crazcashmatt",
		136771: "dralina4lhc",
		136772: "3pixel",
		136774: "neojumpnum2",
		136776: "thebacon1hp",
		136777: "dralina5lhc",
		136778: "momotoe1life",
		136780: "maxidkhc",
		136781: "neojumpnum3",
		136782: "jlhcl",
		136783: "efilon1",
		136784: "ataris1life",
		136785: "dralina6lhc",
		136786: "dapapaya1hc2",
		136787: "thug hunters",
		136788: "zpmjay 1lhc",
		136789: "fztl 1lhc",
		136790: "macke1",
		136798: "hcofrage2",
		136801: "aardehc",
		136802: "whyamitrying",
		136805: "fatal 1lhc",
		136808: "hckianlinder",
		136815: "kianhc1life",
		136816: "ace kianoshi",
		136817: "majkya0",
		136818: "shanhcim",
		136819: "beskkovhc",
		136820: "rosepig1lhc",
		136821: "jimbob1shot",
		136822: "tangjyhc1l",
		136823: "beck1hc",
		136824: "fefek2",
		136825: "lux1l",
		136826: "spastii",
		136828: "beck1hc2",
		136830: "lux1l2",
		136834: "fztl 1lhc2",
		136850: "fatal 1lhc2",
		136858: "rnggodlol2",
		136861: "1l hc loser",
		136862: "amideadyet",
		136867: "dyioonytoons",
		136869: "rng go brrrr",
		136873: "jimbob1hit2",
		136881: "immadierealq",
		136894: "1lhcmorgan91",
		136895: "jords",
		136898: "evenwhc",
		136900: "rnggodlol3",
		136903: "the feds",
		136904: "harderercore",
		136908: "ur mom gae",
		136909: "chessewyt",
		136910: "leeroy jenki",
		136911: "bobonworkhch",
		136912: "hardestcore",
		136913: "2lives",
		136914: "butterfly2",
		136921: "swatcher22",
		136923: "t0edoctor218",
		136925: "iforgord",
		136926: "idcwhat1live",
		136931: "has has has",
		136935: "t0edoctor217",
		136937: "paperf",
		136941: "morgan91hc1l",
		136946: "deadboi1lhc",
		136949: "fav word",
		136951: "gfgd 1lhc",
		136953: "idie10times",
		136958: "minidanger",
		136969: "teedrock",
		136970: "dk86",
		136973: "jimbob 1l3",
		136977: "good idea 2",
		136980: "good idea 3",
		136981: "good idea 4",
		136982: "good idea 5",
		136985: "kianthe1st",
		136990: "dontdieagain",
		136993: "phoenix 1hc",
		136994: "game over",
		136999: "fraser v2",
		137024: "osen1lhc",
		137025: "morgan911lhc",
		137029: "raichu hc2",
		137035: "craneoscuro",
		137036: "jlhcl2",
		137046: "nillys1bcell",
		137054: "matthewhard1",
		137061: "osen1lhc2",
		137072: "beck1hc3",
		137073: "grillplzunmu",
		137074: "tired1lh",
		137076: "fztl 1lhc3",
		137077: "plzunmute444",
		137078: "beck1hc4",
		137083: "i will live",
		137086: "paperxo",
		137087: "sonic 1lh",
		137088: "paperzo",
		137090: "paperpo",
		137099: "dj khaled",
		137119: "hellllooooo",
		137146: "oke 1lhc",
		137155: "zpmjay 1lhc2",
		137163: "napstyyhccc",
		137178: "jimbob 1l4",
		137180: "1lhcisfucked",
		137182: "dagoat",
		137185: "dagoatno2",
		137187: "kenu1",
		137189: "keymusketeer",
		137196: "braden554",
		137199: "kenu3",
		137201: "totiredtiger",
		137203: "totiredtotry",
		137212: "kenu4",
		137234: "jimbob 1l5",
		137237: "jzisthegoat",
		137240: "napstyycccc",
		137241: "jimbob 1l6",
		137242: "ihateupdates",
		137244: "sav3 me",
		137246: "dyl00nyt00ns",
		137260: "horsetraner",
		137265: "wooperhc",
		137266: "dogger69",
		137285: "t0edoctor216",
		137286: "jimbob 1l7",
		137288: "lost count",
		137294: "arrivalhc",
		137308: "kaat 1lhc",
		137309: "flatmoon1lhc",
		137314: "emblaze",
		137317: "cheezmoseth",
		137325: "dumbestdeath",
		137332: "saneless",
		137333: "mewtwo1lhc2",
		137336: "sinewave",
		137345: "youarenoobs",
		137351: "youwilldie",
		137373: "reileen",
		137384: "evenhardcore",
		137388: "jimbob 1l8",
		137407: "fiinnii",
		137410: "e1life",
		137422: "dont die",
		137427: "jimbob 1l9",
		137430: "teedr0ck",
		137439: "scissors",
		137464: "shrekis7ft",
		137488: "spiderslayer",
		137489: "qpqpqp",
		137498: "flipperflapp",
		137502: "qpqpqp2",
		137505: "raichu hc3",
		137509: "number 100",
		137512: "flatmoon2lhc",
		137524: "its an l",
		137532: "anguy1life",
		137543: "opcool 1hc",
		137558: "1x3",
		137562: "evenwnorway",
		137569: "raichu hc4",
		137571: "raichu hc1",
		137573: "marucrossii",
		137594: "nenninja",
		137598: "piress 1lhc",
		137617: "imded",
		137618: "ohyesplz",
		137624: "hardcoreben",
		137633: "dounbot",
		137647: "huriel",
		137648: "memerdad4",
		137658: "mn66f",
		137660: "kianthe2nd",
		137661: "pikachufire",
		137684: "kenzhang1lh",
		137716: "ngmullins2",
		137729: "not a spider",
		137742: "non spider",
		137819: "kianthe3rd",
		137824: "dragonninja9",
		137834: "shapedsword",
		137868: "dontdie",
		137872: "ryan123124",
		137874: "yowsg",
		137881: "ryryryanfn",
		137915: "jennatolls",
		137924: "1 l felix",
		137957: "darkfox2",
		137962: "love spiders",
		137965: "uranium",
		137972: "minesweeper1",
		138036: "onyxwingman",
		138087: "079583245",
		138090: "issew1lhc",
		138141: "gakgak",
		138153: "hipposniffer",
		138377: "165bowler",
		138638: "whosjoecorps",
		138661: "shapedsword2",
		138692: "monkeyharhar",
		138727: "interpreter",
		138936: "sten",
		139020: "ejismean",
		139024: "pphaspower",
		139052: "the tickler",
		139088: "joethorhc",
		139118: "galbrush",
		139188: "show5432",
		139294: "totoro47 1hc",
		139351: "liam1lhc",
		139366: "dbronner",
		139511: "kocur26",
		139521: "dayz",
		139557: "gyesa",
		139606: "dragonw55674",
		139678: "kenu6",
		139708: "havoccc",
		139792: "revved",
		139806: "blackh0le12",
		139847: "dzoonytoons",
		139849: "tanakan",
		139868: "pietateiplhc",
		139918: "farangodwmaf",
		139929: "vanillasteel",
		139942: "bmerak",
		139981: "wmaf4life",
		140024: "benetnasch",
		140035: "mesa",
		140079: "lightning1hc",
		140089: "1lhcmazurr6",
		140139: "valkirie",
		140206: "prace4",
		140267: "yatuoituoi",
		140269: "impereil",
		140282: "notgule",
		140284: "barka",
		140287: "lightning12s",
		140290: "bosken",
		140325: "duckz",
		140330: "your dad",
		140339: "cuckscaper",
		140343: "nikuniku",
		140385: "the teacher",
		140396: "onelifecuck",
		140465: "digitalfairy",
		140526: "ernepito1lhc",
		140527: "ernepitohc",
		140554: "baxterds",
		140561: "mvhel1l",
		140571: "meater",
		140654: "barclay",
		140710: "yohgo",
		140733: "hardtytytey",
		140759: "tytyteyhc",
		140771: "discpsycho",
		140772: "pikachufire2",
		140840: "peyang",
		140843: "aksel",
		140867: "vinicushard",
		141021: "lllllll",
		141081: "trama",
		141082: "plusninja1l",
		141092: "ojechapar",
		141132: "reizo07",
		141144: "ilovetiddies",
		141150: "fishfood",
		141227: "dayzhc",
		141273: "goalieman247",
		141281: "tippytoe9405",
		141284: "games1lifehc",
		141331: "guleis",
		141332: "mutedfor",
		141333: "1140years",
		141359: "adrielo",
		141366: "deathlord99",
		141400: "shah",
		141433: "guleisleavin",
		141434: "unpresent",
		141444: "linbro13",
		141445: "guest_b53s1",
		141495: "leolally",
		141588: "tosster",
		141592: "dak01",
		141630: "not wert1234",
		141680: "legoenderman",
		141692: "1hc totoro",
		141693: "1lhc totoro",
		141704: "noahsnoah",
		141716: "gaoyu",
		141760: "fortnite6",
		141761: "esskayss",
		141762: "fortnitebe",
		141767: "himothy",
		141869: "smitty1lhc",
		141873: "mesmyria",
		141908: "exrcstslayer",
		141928: "pichu",
		141932: "dragonduck24",
		141934: "bobjim",
		141967: "tennis3",
		141968: "bruvwin",
		142012: "csnare",
		142071: "bigdick76",
		142076: "smallpp76",
		142170: "slavko",
		142171: "toto 1hc",
		142317: "kchamber001",
		142329: "165hc",
		142341: "death wish",
		142365: "spyk255",
		142429: "yeetbio",
		142449: "coceater1254",
		142486: "naginari",
		142488: "nword4prez",
		142545: "tadakatsu",
		142634: "childpred",
		142662: "poopooman",
		142676: "publius",
		142728: "eijdu",
		142737: "fatfungy",
		142772: "kenu7",
		142781: "dicoala",
		142809: "bastian",
		142850: "guest_w550y",
		142890: "mahnamahna",
		142895: "aestheticmax",
		142920: "pwedo",
		142946: "x2hamburger",
		142966: "bubu2024",
		142970: "florr boy",
		142984: "maznek",
		143084: "kmzero",
		143110: "cwhite004",
		143123: "himothy3",
		143149: "kenu8",
		143162: "niggersarent",
		143183: "creation",
		143233: "danielcarson",
		143269: "totoro 1ihc",
		143277: "superlaser15",
		143334: "deedos",
		143406: "kenu9",
		143431: "elp me plz",
		143434: "userplayer43",
		143435: "constantair",
		143436: "fgrevfndic",
		143437: "infinitespac",
		143438: "paperweight",
		143439: "user45001",
		143440: "forest901",
		143473: "kenu10",
		143501: "raven 1lhc",
		143533: "tzzaannyy",
		143541: "boblid",
		143585: "tema174",
		143599: "ash3asher",
		143606: "ihateniggers",
		143672: "xiles",
		143731: "youmay771lhc",
		143743: "jyro",
		143746: "cooperiscoop",
		143747: "kingjyro",
		143790: "cwhite005",
		143791: "kenu11",
		143797: "coopiscooper",
		143822: "guest_04zf1",
		143892: "ryuu",
		143906: "me is human",
		143907: "toto 1lihc",
		143908: "me ls human",
		143942: "cammysbetter",
		143943: "luxisbetter",
		143944: "odin idk",
		143987: "maxisback",
		143998: "choubada4",
		144099: "guest_qqavb",
		144109: "kendar",
		144151: "risexhermes",
		144189: "jdsijqiodjjo",
		144286: "hehehehehe",
		144301: "odin idk hc1",
		144339: "diondragon",
		144341: "grooby",
		144405: "cooperh01h1",
		144440: "cooperh2h",
		144566: "issic",
		144575: "holymoly",
		144680: "beanbag5651",
		144741: "faditimo77",
		144742: "agrajag",
		144786: "tron",
		144866: "cooperh3h",
		144905: "pasupuletin",
		144934: "acapitalism",
		144952: "kendar1lhc",
		144960: "quimothy",
		145009: "dren",
		145069: "ilyushin",
		145095: "sleepymilo",
		145148: "notahuman",
		145222: "smitty i am",
		145267: "ghilkj",
		145276: "winner44",
		145278: "sam140",
		145294: "gibbycraft",
		145300: "yccjhger2",
		145336: "wsg",
		145371: "not buggy",
		145396: "wholphin",
		145408: "tuck7tuck",
		145411: "kenu12",
		145412: "bluekind",
		145420: "ducky23",
		145447: "maskenjkpg",
		145469: "rtoip18",
		145572: "thatonestar",
		145629: "dunkboy",
		145630: "nanomik",
		145631: "bobseshey",
		145637: "hermit crabs",
		145656: "zeke0616",
		145688: "cdots",
		145693: "atri",
		145694: "himyigger",
		145723: "hi405",
		145801: "sifreyja",
		145807: "wormguts",
		145884: "ak8814844",
		145897: "lasvoss01",
		145937: "nylithstabbn",
		145939: "logan9",
		145945: "olliehall",
		145956: "millax25hc",
		145967: "monke3",
		145984: "j5hvjsne",
		146000: "dangpzanco",
		146089: "alexqk1337",
		146093: "prongs",
		146100: "gmiconic20",
		146111: "vitreous 2",
		146139: "bbq",
		146275: "kensterhc",
		146288: "kermalon",
		146345: "notkgb",
		146366: "darklord78",
		146422: "bladeoshadox",
		146439: "blakejones",
		146450: "junetexza",
		146475: "fryele",
		146520: "loiathal1",
		146560: "loiathal2",
		146564: "loiathal3",
		146574: "loiathalhc",
		146662: "houseman",
		146699: "xerafian",
		146894: "abalone46",
		146900: "magzie",
		146903: "kingblue",
		146904: "merchaderk69",
		146943: "urkellitoww",
		146944: "xfiloo88",
		147026: "kenu13",
		147029: "jayden69 1lh",
		147034: "dr the real1",
		147057: "yaotzin",
		147171: "kenu14",
		147177: "fullboxed",
		147303: "hexedgirl",
		147305: "jackusfritu",
		147306: "mythralhex",
		147342: "poentia",
		147458: "tissue89",
		147507: "trogdor01010",
		147568: "tuga3d",
		147587: "frosty21hc1l",
		147603: "gooner",
		147621: "frosty21hcv2",
		147627: "sadstick",
		147661: "brackettrash",
		147664: "magomik",
		147765: "zert",
		147771: "famousfred",
		147839: "guest_e91qg",
		147845: "i ssn i zbg",
		147846: "guest_4xte8",
		147856: "pinkbanan",
		147860: "pieta3lhc",
		147927: "noisygooner",
		147930: "notsogoody",
		147941: "ironman2888",
		147962: "hyperion",
		147967: "abalone462",
		147968: "froze",
		148052: "carvery",
		148058: "nproductive",
		148061: "guest_3d2j9",
		148133: "grantaire",
		148146: "tomthebaker",
		148147: "mahna1lhc",
		148212: "dzvsei",
		148223: "akr",
		148312: "debacle0192",
		148335: "ctbaao1",
		148345: "depu",
		148358: "guest_weed0",
		148370: "dasherthepro",
		148500: "lasvoss02",
		148628: "adrielo1lhc",
		148637: "ssdexecutor1",
		148667: "radiationhaz",
		148706: "API~148706",
		148712: "calliam",
		148779: "lem0n",
		148818: "detanker",
		148827: "rizzlat",
		148845: "my name is y",
		148851: "kieru",
		148903: "viljehamn",
		148943: "d3athwatch3r",
		148951: "leseratte",
		148972: "guest_s079d",
		148990: "poppe961",
		149018: "alexadevana",
		149042: "l0verboy",
		149121: "khalid merri",
		149123: "strohball",
		149140: "rehehehe",
		149224: "duolingo owl",
		149232: "fotbolle",
		149247: "macher",
		149248: "dumwaystodie",
		149298: "billyboi",
		149342: "meyyoyeyyo",
		149350: "potatosz",
		149351: "potatosz2",
		149369: "kuzyass",
		149394: "noone3746383",
		149395: "tainbal",
		149412: "brrrt",
		149419: "cookiesugar",
		149420: "daman1lh",
		149446: "iamfast",
		149450: "rimo5",
		149470: "mower1lh",
		149486: "shadowgod",
		149574: "spartacus",
		149597: "tee9738",
		149849: "salinte",
		149887: "afk minerol",
		149993: "citrusgremli",
		150094: "randombard72",
		150129: "desrtfx",
		150142: "madmod114514",
		150520: "guest_r1s1k",
		150539: "amd",
		150575: "herpaderpa",
		150579: "friedrat",
		150627: "hydenseek35",
		150657: "onii chan",
		150724: "penguinsgo",
		150788: "gimbit",
		150816: "guest_7ye01",
		150956: "phenomenon",
		151000: "mutt",
		151133: "4u6ka",
		151228: "riptidedh999",
		151230: "xxenithh",
		151231: "kuulat",
		151236: "witchiewoo",
		151284: "8bitpixel",
		151438: "kenu15",
		151573: "kasperlöth",
		151576: "goodplayer",
		151580: "noobmoney7",
		151593: "isace",
		151603: "ava",
		151604: "suscitatio",
		151631: "dh2wasbetter",
		151725: "nichd55",
		151768: "taoteching",
		151871: "API~151871",
		152061: "1lhardcore",
		152062: "hardcore1l",
		152134: "scarlet jay",
		152172: "plusninja1l2",
		152383: "skitnere3",
		152423: "mavs",
		152444: "lunassy",
		152519: "pixme",
		152664: "onelife1",
		152679: "alfavale",
		152683: "heno2mhg",
		152690: "eriktyp",
		152743: "jonb2100",
		152765: "graescale",
		152839: "sweetfate",
		152845: "scarlett",
		152985: "omegadyn",
		153006: "yabus",
		153104: "r3bel",
		153183: "darthminer",
		153184: "rundownmoon",
		153185: "ricc",
		153247: "r4venlord",
		153274: "amjh",
		153296: "yoxr",
		153307: "namir",
		153404: "fluffwfork",
		153430: "digby",
		153444: "gleepnir",
		153513: "steinkald",
		153555: "juiceboy",
		153597: "wremm",
		153601: "okilian",
		153608: "maomi",
		153645: "plemma",
		153678: "153dfc20",
		153967: "hurling",
		154062: "the tricolor",
		154077: "eurther",
		154078: "dudertudor",
		154079: "starmonsty",
		154126: "ldfivbj",
		154210: "leseratte3",
		154212: "superslash10",
		154213: "cheese man 1",
		154219: "trinketbiter",
		154224: "oscarbg",
		154237: "bob cat 1",
		154271: "huuuuh",
		154294: "akrr",
		154295: "ikp21",
		154315: "clmcrbat",
		154402: "brass",
		154446: "tinfoil",
		154499: "foop",
		154521: "mavs1no",
		154555: "melissaluvsu",
		154564: "ades",
		154599: "noahgm",
		154624: "crungle",
		154718: "desch nuts",
		154787: "adrielo2lhc",
		154799: "james9325",
		154834: "outpost",
		154838: "imu",
		154847: "greatdane220",
		154851: "kenu16",
		154870: "zur1",
		154984: "natureboy",
		155009: "sniggers",
		155015: "kenu17",
		155025: "hi 464",
		155031: "bluecheeses",
		155044: "ryddeman1l",
		155049: "kenu18",
		155064: "kenu19",
		155072: "thirdran4869",
		155159: "glab",
		155160: "oscarlin0591",
		155171: "jsny",
		155210: "riskyplayz17",
		155397: "jeffiscrazy",
		155437: "starhc",
		155448: "mr fr0ggy",
		155451: "parteeman930",
		155454: "outhouse",
		155456: "jools",
		155482: "fatalererror",
		155505: "dragon23",
		155525: "agadajfk",
		155572: "sigma1234567",
		155648: "desyncing",
		155658: "rock solid",
		155659: "rock solid 2",
		155661: "weirdosr",
		155753: "cfilorvy1234",
		155768: "gman3646",
		155771: "geaa10101010",
		155792: "will77717",
		155797: "flowerpotlov",
		155813: "winston2332",
		155873: "bestacombat2",
		155876: "shinatobe",
		155883: "nerdstaunch",
		155886: "inveteratus",
		155911: "zyxxer",
		156014: "okejdo",
		156025: "arikiwi",
		156032: "lewis",
		156062: "lord andy",
		156090: "ronnielv12",
		156147: "plsdontdie",
		156150: "reshstan",
		156152: "potatozfrog",
		156172: "harlequin",
		156189: "karel",
		156203: "tekpin",
		156226: "jbadger420",
		156235: "ardonerkebab",
		156239: "blowarium",
		156244: "lindberg",
		156257: "timkuk",
		156264: "isanidiot",
		156269: "ikasu",
		156510: "amyjane",
		156530: "phojlip",
		156543: "bruh123123",
		156548: "chungkles",
		156561: "kkatelynn161",
		156686: "xlr8hc",
		156721: "mrbusiness",
		156746: "gaby18",
		156777: "turtlekid69",
		156801: "lightdarkxyz",
		156816: "isachardcore",
		156841: "knap",
		156884: "kaluria",
		156905: "mineblockm",
		156926: "nyorn dard",
		156937: "watrbotl",
		156979: "fuckles",
		156992: "wjh25",
		157034: "guest001",
		157075: "genpayne1972",
		157117: "guest_s3tpr",
		157127: "sericainthis",
		157139: "API~157139",
		157165: "federico2011",
		157239: "galaxylordop",
		157244: "dab2",
		157245: "stanthepan3",
		157269: "chiseqiufen2",
		157283: "zrytel2",
		157285: "alexthefrog",
		157286: "landen2024",
		157291: "tadeusz",
		157297: "asumiti",
		157309: "ezipps",
		157310: "kuba12eee",
		157313: "bungalowbil",
		157341: "fio",
		157348: "ekis91",
		157400: "nightprism",
		157434: "spency",
		157614: "guest_sg7sp",
		157641: "themasher",
		157660: "skarchery",
		157708: "solwemyr",
		157789: "froza",
		157821: "korben3535",
		157877: "ohyourcool22",
		157892: "pandarrr",
		157966: "qawsedrftgyh",
		158025: "seirunir",
		158073: "ven lettuce",
		158075: "forthehoard",
		158082: "mr gumdrop",
		158114: "ajema",
		158163: "guest_urskt",
		158168: "obitokino",
		158208: "kealig",
		158221: "yung beagle",
		158236: "everettq",
		158267: "ch3rrypoppin",
		158324: "velp",
		158444: "ffox",
		158476: "clockeye1",
		158477: "creature",
		158502: "guest_8tcr6",
		158545: "smarmyj",
		158611: "ksprs",
		158615: "gengar",
		158627: "olivercandy",
		158646: "kukost",
		158656: "kevs123",
		158665: "mewing max",
		158699: "sirbiggles",
		158732: "jopple",
		158750: "cannonball",
		158782: "toripl",
		158796: "nekselk",
		158880: "sax116",
		158921: "saganaki",
		158922: "spyrzgaming",
		158936: "rhayne",
		158952: "dylan goat",
		158981: "epicyoumu",
		158982: "phaxz",
		158987: "guest_uwj00",
		159034: "wwenrojal",
		159065: "grifoli1h",
		159157: "guest_ed9v6",
		159196: "deku1437",
		159242: "antithalian",
		159248: "hannes",
		159318: "aflow",
		159363: "kanosthefall",
		159401: "guest_rt031",
		159449: "keyklicks",
		159512: "yyeman1hc",
		159515: "stackofdoggo",
		159566: "kuba555",
		159643: "hannes1",
		159652: "maxxy123",
		159660: "el po gamer",
		159676: "elephant725",
		159692: "moaf",
		159711: "winterthree",
		159725: "shenshen",
		159742: "shong alt",
		159755: "dumbwit316",
		159819: "leswholemilk",
		159961: "azn ghost",
		159966: "vdqym1hc",
		159986: "chung",
		160023: "wwendrol",
		160142: "night1lhc",
		160145: "asgdhjsvn",
		160147: "triceratots",
		160179: "skibidipig",
		160180: "reikidle12",
		160187: "pigskibidi",
		160206: "trukifr",
		160273: "hvorr",
		160314: "nomana",
		160320: "pigacount1",
		160323: "hardcoress",
		160325: "watch me win",
		160334: "erkina",
		160360: "alcroft",
		160375: "blacksight6",
		160406: "omegarc",
		160424: "helmer86",
		160432: "potatoz",
		160450: "hollymack",
		160452: "mistermike",
		160487: "thamaster05",
		160517: "eklen",
		160590: "themustynut",
		160640: "dillywilly",
		160642: "seanni",
		160645: "echo1wolf",
		160673: "mortaliz",
		160693: "mem mem",
		160704: "sparkyumr98",
		160707: "guest_c8cem",
		160708: "sandshrew",
		160736: "adamn",
		160801: "rilence",
		160826: "arthurb",
		160830: "node",
		160884: "guest_6g41x",
		160885: "moore",
		160892: "tee4208",
		160967: "drcunningh",
		160981: "guest_xq77m",
		161053: "jjjjjjo",
		161057: "erkin",
		161155: "ginger1010",
		161177: "nihar447",
		161212: "adagio",
		161223: "orangecat",
		161270: "superlaser17",
		161317: "yhx1234",
		161380: "titanbeast",
		161462: "holographica",
		161472: "pear451",
		161488: "berko",
		161514: "guest_mfbyx",
		161537: "mrtymcfly1",
		161585: "potato 2000",
		161638: "judfolsom",
		161671: "blackcat0621",
		161675: "auorax10",
		161678: "wolfsword",
		161691: "guest_mccbu",
		161720: "unholytinkle",
		161736: "mpg5036",
		161790: "draaglom",
		161801: "snowleopard",
		161884: "renprincess",
		161940: "megalomaniac",
		161952: "lunna85",
		161975: "infinito",
		161999: "megalomain",
		162018: "paradigms",
		162033: "kkszysiu",
		162036: "jwstillwater",
		162073: "imokathome",
		162101: "toxerino",
		162105: "rappa",
		162106: "gujje",
		162111: "hcniklu",
		162115: "elimac4229",
		162127: "hyvlarn",
		162130: "fishsticks10",
		162173: "darac5000",
		162201: "baemir",
		162237: "pandorum",
		162259: "drdreggel",
		162265: "sysphus",
		162297: "mcdouble",
		162313: "prespik",
		162317: "billiam",
		162335: "twt",
		162356: "boodabooda",
		162369: "chentu",
		162374: "dw7",
		162375: "terra0211",
		162416: "guestnt",
		162443: "guest_cjfpk",
		162508: "grifter",
		162517: "trummas",
		162523: "ard6rbq5",
		162531: "saladin",
		162547: "ilov3f3nt",
		162573: "psychov13",
		162579: "keirgoose",
		162592: "katara",
		162607: "tresde",
		162632: "reik44",
		162637: "unmutemeplz",
		162669: "yujiko",
		162683: "bootyblaster",
		162701: "brutus",
		162710: "gralle",
		162720: "legendofsenn",
		162779: "buttstuff",
		162796: "maninahat",
		162804: "skibidislice",
		162808: "pantad",
		162850: "whiskas",
		162865: "louha",
		162870: "ipatb",
		162894: "agstinger",
		162915: "ckwc",
		162917: "astro dhm",
		162936: "newtscoot10",
		162944: "1hcs123",
		162958: "prestobean",
		162981: "mightysheep",
		162982: "winnie",
		162987: "kacaca",
		162991: "galor",
		162996: "marcello",
		163018: "snigelnnn",
		163031: "rngisokay",
		163076: "stardustreve",
		163091: "kyjin77",
		163094: "ipman",
		163136: "freddy kk",
		163142: "big monkey",
		163152: "viking 6889",
		163192: "relaxo",
		163210: "guest_ftjr4",
		163223: "johnnyvrude",
		163239: "mapiyy7",
		163255: "jadeskip",
		163280: "nutcream",
		163282: "quadius",
		163285: "idle xyz123",
		163310: "nanbriwwww",
		163314: "nyanyanya",
		163315: "bittopixel",
		163337: "odhsfoifhods",
		163369: "killmeurgay",
		163379: "jinxy",
		163398: "lameo",
		163408: "ifyb",
		163412: "hez",
		163416: "papi",
		163417: "imeteox",
		163421: "kreldorsil",
		163428: "cookiedragon",
		163429: "phil acio",
		163459: "guest_ax62k",
		163470: "daimino",
		163502: "friarbob16",
		163505: "flamefeeder3",
		163563: "darthcarbon",
		163578: "API~163578",
		163590: "deathontoast",
		163601: "brrrt1lhc",
		163617: "powerdooodle",
		163639: "shdwbrian",
		163651: "labyrinth",
		163680: "happynoob666",
		163682: "codyhodyyy",
		163711: "cfox",
		163713: "foxyboxy121",
		163729: "foxyboxy313",
		163734: "dfox",
		163735: "arijo",
		163744: "guest_zksk6",
		163755: "possum",
		163756: "atlanter520",
		163761: "l240",
		163772: "zlo",
		163816: "lytury",
		163828: "protein",
		163858: "flyingcoco",
		163861: "API~163861",
		163907: "miaw",
		164011: "crazyfase",
		164030: "valverrater",
		164083: "jaxonthebada",
		164084: "adrianisba",
		164094: "zll",
		164097: "tfft",
		164101: "havadik",
		164116: "soup",
		164137: "arctus614",
		164150: "amongbro",
		164166: "anubis331",
		164185: "aaad",
		164216: "guest_amsq0",
		164236: "fisheyedfish",
		164250: "realsteele",
		164254: "foehammer",
		164276: "dirtycrob",
		164282: "guest0",
		164284: "squishies",
		164317: "leoleo",
		164323: "minifloydo32",
		164325: "geen",
		164328: "lisa selena",
		164340: "wwwwssss",
		164366: "skullaz",
		164392: "yarausa",
		164400: "asadsad",
		164414: "yukkipedia",
		164449: "ezlife",
		164467: "konstantinos",
		164477: "API~164477",
		164478: "natedrake",
		164496: "API~164496",
		164501: "bmbl3",
		164507: "theordhel",
		164515: "API~164515",
		164525: "kidrock76",
		164526: "guest_43v7j",
		164552: "guest_ga998",
		164565: "anguy1",
		164567: "siren",
		164571: "guest_vef4y",
		164576: "API~164576",
		164580: "kevokeys123",
		164586: "notnerdy",
		164589: "blackmanta",
		164613: "API~164613",
		164616: "lowest",
		164639: "API~164639",
		164643: "rotster",
		164654: "sleepydrug",
		164688: "guest_b1aup",
		164690: "voidhymn",
		164729: "clumsylynx",
		164763: "guest_8a0ff",
		164765: "ixvi",
		164772: "softreset",
		164792: "API~164792",
		164793: "API~164793",
		164822: "bd330",
		164827: "chillybreeze",
		164831: "API~164831",
		164841: "fox is hard",
		164890: "guest_5rmsv",
		164925: "jurc11",
		164941: "moomoopixel",
		164968: "API~164968",
		164973: "API~164973",
		164998: "colep",
		165004: "guest_mfx4m",
		165006: "scyntold",
		165014: "ipagiff",
		165032: "eznoob",
		165033: "API~165033",
		165044: "guest_sm86m",
		165065: "arrow ace",
		165068: "matku555",
		165069: "solidpond149",
		165081: "concrete",
		165084: "API~165084",
		165086: "plagusthewis",
		165091: "guest_1ma09",
		165107: "imbored4365",
		165113: "zestfestcar",
		165147: "inf",
		165157: "jishwa",
		165167: "free bfox",
		165172: "arikiwin",
		165184: "shivaz",
		165200: "API~165200",
		165202: "iburngays",
		165205: "API~165205",
		165210: "razzlepants",
		165214: "allah is god",
		165220: "rsquared85",
		165236: "bussnut",
		165244: "rainyplanet",
		165253: "API~165253",
		165255: "pjdhunt",
		165268: "eggman36090",
		165305: "API~165305",
		165330: "deviner dan",
		165332: "ruinfoxy",
		165334: "paulomansur1",
		165344: "darkxwolf17",
		165353: "whaler101",
		165361: "clin9509",
		165364: "guest_cuwry",
		165369: "austindildy1",
		165370: "donovanm1200",
		165372: "lelanddiceat",
		165373: "guest_sb30t",
		165384: "gargieog",
		165389: "bigbrainboy",
		165415: "kkemobilegam",
		165417: "koyot96",
		165453: "kb1",
		165455: "API~165455",
		165471: "revan",
		165475: "API~165475",
		165477: "davediamond2",
		165479: "hitler123",
		165484: "gingerkgr",
		165486: "potato22",
		165487: "API~165487",
		165496: "srdr4545",
		165501: "hmellow",
		165508: "silvereagles",
		165511: "pandemonium",
		165531: "vaatic",
		165539: "sukndwnnfrts",
		165547: "thebigbyson",
		165560: "zazaza",
		165568: "shiku",
		165572: "slytherin410",
		165579: "API~165579",
		165587: "twb1234",
		165590: "furysharkk",
		165594: "theanarch",
		165607: "davee",
		165635: "grim r3ap3r",
		165638: "ultrabeany",
		165640: "766243",
		165642: "freaky folly",
		165648: "API~165648",
		165654: "maligora",
		165659: "dante heart",
		165664: "API~165664",
		165669: "cadeoverheav",
		165676: "oinkmaster75",
		165677: "766274",
		165678: "rj70msp",
		165689: "dylanleintz",
		165692: "galactic435",
		165693: "w1lbert",
		165701: "londogarak",
		165703: "profesordidy",
		165705: "death1443124",
		165708: "9876rt",
		165709: "56789",
		165710: "werewgfsd",
		165716: "captainmik",
		165736: "breakfast5",
		165749: "dccp42",
		165753: "guest_70cc7",
		165756: "kinggamingyt",
		165767: "API~165767",
		165779: "jackz1234",
		165792: "20weimern",
		165804: "flobba",
		165814: "guest_7913e",
		165838: "API~165838",
		165851: "higgsboson88",
		165870: "shooters",
		165871: "pikfan1sucks",
		165881: "mirai1312",
		165883: "mattsyplum",
		165892: "hcidler",
		165894: "turfnsurf",
		165906: "sgognbob",
		165908: "API~165908",
		165909: "wetranger",
		165912: "edwelsh",
		165915: "rolandu",
		165920: "766425",
		165926: "bman",
		165927: "API~165927",
		165929: "caproni77",
		165938: "samathy",
		165957: "diamondgam3r",
		165993: "API~165993",
		165995: "ohlongbernie",
		166003: "API~166003",
		166021: "guest_r9t2d",
		166054: "thechonkler",
		166061: "chokri",
		166063: "API~166063",
		166072: "toleyuta",
		166082: "moedex13",
		166115: "andrewandnik",
		166124: "noncentralce",
		166126: "API~166126",
		166131: "dmightybear",
		166139: "sleduvat",
		166159: "lerim",
		166175: "guest_ef8et",
		166179: "a1ek",
		166183: "kornman",
		166192: "scruffy1000",
		166200: "nerfwarrior",
		166202: "saiko",
		166206: "API~166206",
		166225: "thatstik",
		166230: "lefty09",
		166234: "API~166234",
		166265: "mooneyes",
		166268: "ldog2020",
		166271: "nerdman7777",
		166278: "papabliss",
		166284: "switch321",
		166287: "afk miner 2",
		166288: "monkeyboi911",
		166289: "challange",
		166295: "eefin",
		166304: "woeiruty",
		166323: "API~166323",
		166347: "API~166347",
		166356: "daiba",
		166372: "hakk3",
		166373: "API~166373",
		166390: "n3rdyivy",
		166397: "unit08",
		166400: "calebmather1",
		166409: "zadhax",
		166415: "rendrone2",
		166416: "rendrone3",
		166417: "rendrone4",
		166419: "rendrone5",
		166422: "guest_fmt3c",
		166423: "robertw0987",
		166442: "digger272",
		166460: "jj1lhc",
		166482: "edinstinct",
		166484: "mrbojangles",
		166526: "kcaryths",
		166532: "rikki",
		166537: "player8729",
		166538: "schmitty",
		166546: "coolakon2",
		166551: "lerimflavor",
		166554: "kayy",
		166555: "pjjjjp3",
		166562: "iamburnj",
		166568: "synreala",
		166664: "guest_ugz4c",
		166675: "coldstone",
		166699: "threestrkes",
		166715: "play",
		166760: "guest_wuugv",
		166803: "API~166803",
		166855: "lolugrumpy",
		166901: "hlebtostowy",
		166920: "API~166920",
		166950: "swampamus",
		166962: "goboo",
		166989: "API~166989",
		167022: "tanche",
		167039: "API~167039",
		167073: "API~167073",
		167079: "guest_4g5fe",
		167099: "sylvandra",
		167125: "renlo",
		167133: "gonkuzet",
		167195: "reximus",
		167260: "guest_yq73r",
		167276: "ebaynissen",
		167354: "API~167354",
		167379: "woozey",
		167390: "API~167390",
		167438: "API~167438",
		167485: "comixse",
		167510: "API~167510",
		167512: "fizz",
		167525: "sbyz",
		167559: "kargariw",
		167561: "API~167561",
		167567: "steel falcon",
		167572: "zuchta35",
		167577: "skroll",
		167583: "jestic",
		167595: "guest_dyvd2",
		167615: "anaria",
		167619: "API~167619",
		167621: "superjerry69",
		167631: "xinenos",
		167644: "wearebob",
		167651: "tuathaan",
		167652: "usliberty",
		167709: "API~167709",
		167752: "icw04",
		167753: "alygator",
		167754: "ndessell",
		167815: "argierg",
		167856: "lostrunev2",
		167862: "olegatorsh",
		167888: "lembardiino",
		167896: "akronymus",
		167900: "justalittle",
		167909: "doey103",
		167910: "guest_zpvk2",
		167916: "firstredby",
		167930: "API~167930",
		167931: "guest_r2p5g",
		167942: "caseys chips",
		167962: "grassy",
		167982: "API~167982",
		167988: "API~167988",
		168050: "bihwe",
		168061: "API~168061",
		168064: "osmium",
		168065: "burlock99",
		168072: "donogrimm77",
		168123: "thefatman",
		168137: "API~168137",
		168139: "guest_rs112",
		168144: "supsan",
		168150: "guest_qugz2",
		168163: "kyleph91",
		168173: "usagi",
		168179: "republicus",
		168194: "glorpie",
		168201: "the champion",
		168204: "vah003",
		168205: "kaigamer123",
		168221: "API~168221",
		168238: "guest_jda9t",
		168246: "dantebelmont",
		168294: "API~168294",
		168324: "bodek101",
		168329: "guest_3gyp1",
		168330: "API~168330",
		168332: "bydoo",
		168344: "tannuninja",
		168349: "goonga",
		168350: "guest_frwpq",
		168365: "standrdgamr",
		168381: "whuk",
		168408: "coldchimera",
		168415: "guest_j95pq",
		168422: "API~168422",
		168438: "API~168438",
		168475: "guest_04zx1",
		168477: "raichu hc6",
		168503: "twinkletoes",
		168504: "skibidigoon",
		168506: "royalfiddlec",
		168516: "dlc",
		168551: "drslim",
		168559: "boom9001",
		168582: "wockytank",
		168593: "kurano chin",
		168600: "darleenax0",
		168631: "API~168631",
		168633: "acej",
		168636: "guest_jet8w",
		168666: "ellioto",
		168680: "pulsefire",
		168697: "nocolours",
		168727: "API~168727",
		168734: "kakkasika123",
		168745: "znlyk",
		168759: "API~168759",
		168775: "rendrone6",
		168776: "rendrone7",
		168781: "nolun",
		168796: "anotherbean6",
		168805: "warburton",
		168832: "stenröse",
		168856: "indyjansson",
		168860: "kennytheprin",
		168861: "foolishdemon",
		168864: "vurtualjudg2",
		168884: "kayse",
		168900: "namtab",
		168907: "kazugames",
		168929: "westblade",
		168936: "naraku666",
		168937: "abiotic",
		168940: "bestie",
		168960: "guest_aq245",
		168964: "chillybreez",
		168969: "szartidot",
		168972: "wuuuut",
		168999: "ashente",
		169006: "nilsenalt",
		169016: "guest_6wqw2",
		169045: "brcklayer",
		169046: "API~169046",
		169048: "royal39",
		169066: "stripper1",
		169076: "faifai",
		169079: "gravystrap",
		169080: "gravys",
		169086: "API~169086",
		169090: "gengar1997",
		169111: "peepole",
		169137: "yungdave",
		169173: "iran",
		169185: "oddish123",
		169194: "guest_dtj9p",
		169200: "vaguegloom",
		169223: "kalacs8706",
		169231: "hacknug",
		169238: "guest_625bq",
		169240: "guest_xsqdq",
		169260: "szargoon1",
		169291: "remilia",
		169294: "miner55896",
		169295: "yodi",
		169296: "codenine",
		169297: "API~169297",
		169307: "mnitride",
		169315: "API~169315",
		169320: "smolhero3",
		169331: "guest_atrym",
		169357: "randomguy261",
		169360: "swxrd",
		169372: "astralking9",
		169378: "ballsmcgee",
		169379: "elicoolman77",
		169380: "nkbrotime",
		169383: "laptopuser",
		169388: "szargoon2",
		169393: "sp1d3rd4nc3",
		169408: "blazing gup",
		169413: "cyril39",
		169418: "API~169418",
		169427: "survivalgang",
		169429: "bluetm999",
		169465: "yesssint",
		169543: "monolocali",
		169548: "geyser",
		169599: "barks",
		169614: "guest_y9tdb",
		169639: "hiziblisi",
		169653: "arnonymxy",
		169663: "API~169663",
		169676: "bananapanda",
		169700: "oxigalia27",
		169732: "guest_x2qjf",
		169733: "pxrished",
		169752: "flyman",
		169757: "igne",
		169758: "sffxr",
		169765: "serana",
		169767: "dxe",
		169770: "fatality",
		169774: "mfalme",
		169785: "luckesjo",
		169789: "gemhunting",
		169834: "irony0380",
		169837: "nobodyimport",
		169853: "caster",
		169856: "yeetbox72",
		169867: "renevent",
		169884: "gorg",
		169885: "aurit",
		169897: "2268483620",
		169912: "zgs",
		169928: "guest_t5sxq",
		169931: "co59",
		169933: "abdon",
		169982: "guest_ccf45",
		170006: "738533403",
		170062: "wanderer945",
		170063: "az730308539",
		170087: "zentzez",
		170127: "lzy754570436",
		170137: "abcdefghiklm",
		170153: "meltypenguin",
		170157: "kiddrank",
		170159: "puvnmmtj",
		170163: "chubby401",
		170227: "API~170227",
		170243: "cqgtomatt",
		170251: "qianqiu",
		170279: "aaaaas",
		170281: "valis",
		170306: "xms",
		170341: "404notfound",
		170369: "hpl",
		170401: "API~170401",
		170412: "API~170412",
		170423: "ggbond",
		170438: "guest_tjm2a",
		170442: "valis1",
		170444: "valis2",
		170445: "pluhguy",
		170464: "API~170464",
		170499: "potato27",
		170510: "popp",
		170519: "willm",
		170527: "chicken35",
		170545: "afoz",
		170548: "andrew1",
		170549: "andrew3",
		170551: "API~170551",
		170557: "jusitnqi",
		170558: "toisan0822",
		170565: "zako1",
		170566: "zako2",
		170567: "zako3",
		170568: "zako4",
		170569: "zako5",
		170596: "jenko",
		170597: "linklegend",
		170627: "kui",
		170636: "guest_73a1a",
		170643: "ryan12345",
		170662: "biggiantfry1",
		170679: "1297284355",
		170680: "lagzord",
		170700: "mamba1",
		170701: "mamba2",
		170702: "mamba3",
		170703: "mamba5",
		170704: "API~170704",
		170705: "gg2",
		170706: "mamba4",
		170707: "gg3",
		170708: "gg5",
		170709: "gg4",
		170730: "spaces",
		170751: "snailypk",
		170756: "hognakt",
		170758: "stronk",
		170759: "API~170759",
		170760: "nassim75",
		170762: "dragonair",
		170764: "elliotja1",
		170779: "API~170779",
		170807: "tickle man",
		170812: "shrimpcat",
		170815: "API~170815",
		170822: "lulinlulin",
		170831: "aishangbiao",
		170832: "API~170832",
		170833: "guest_61vsr",
		170835: "zking1234",
		170841: "solstice",
		170843: "beeman",
		170844: "fabioenchila",
		170868: "API~170868",
		170869: "farm3",
		170870: "API~170870",
		170871: "farm5",
		170872: "farm6",
		170873: "farm7",
		170905: "API~170905",
		170906: "jamarcusn1g1",
		170913: "ph4ntom",
		170916: "guest_3jc5p",
		170917: "paigeizrad",
		170934: "pengazz",
		170935: "vincent1",
		170943: "goated",
		170945: "gabe517733",
		170948: "frogolite",
		170965: "transtomboy",
		170968: "bardybeans",
		170986: "erm",
		171002: "mrsniper",
		171004: "feuer",
		171008: "nubbie",
		171010: "darthogaz",
		171019: "tyrant87",
		171021: "dragonstar",
		171044: "skiddy",
		171047: "guest_kvq55",
		171050: "guest_3k19r",
		171052: "mike in iss",
		171053: "ch4mphin",
		171057: "dyboss",
		171078: "guest_85tq7",
		171084: "6969prsonalt",
		171100: "eli tundris",
		171107: "API~171107",
		171122: "zxayen",
		171127: "API~171127",
		171134: "jimbobby",
		171164: "facecomplex",
		171170: "API~171170",
		171172: "bahpap",
		171179: "API~171179",
		171181: "hydragodlmg",
		171183: "vengflyking",
		171195: "API~171195",
		171196: "unoo",
		171207: "miller7",
		171224: "sinisterp",
		171237: "axp",
		171243: "faleliam",
		171248: "supanovaplay",
		171250: "1346",
		171256: "raider1",
		171258: "shone2",
		171269: "jinwo",
		171272: "indra7",
		171289: "gleep",
		171294: "iclxppz",
		171305: "goodboyisaac",
		171310: "lucyy",
		171319: "rugger5g5g5",
		171320: "cotton2228",
		171329: "silly willy",
		171342: "idle pablo",
		171346: "legoninjajb",
		171350: "cooksonic",
		171389: "guest_tk1tz",
		171390: "smis",
		171393: "michael15",
		171411: "schlingel",
		171415: "drthereal",
		171416: "arteen",
		171417: "API~171417",
		171418: "epicmetal1",
		171425: "glenkin",
		171427: "guest_bzur9",
		171439: "catlyn",
		171466: "API~171466",
		171489: "juststand",
		171512: "metmeseecash",
		171515: "API~171515",
		171525: "API~171525",
		171527: "280013481",
		171531: "brayhay324",
		171532: "ramin",
		171536: "elio",
		171538: "guest_4g2fx",
		171539: "API~171539",
		171548: "pigtheninga2",
		171565: "themainlogic",
		171574: "guest_1ps5x",
		171576: "leool",
		171607: "yuji",
		171625: "API~171625",
		171746: "bluedress",
		171753: "API~171753",
		171779: "guest_p9817",
		171780: "diple",
		171781: "kingmaster5z",
		171796: "c figgy",
		171797: "ajrlxy",
		171799: "yogurt1234",
		171811: "guest_zppxg",
		171823: "justinwalk",
		171824: "API~171824",
		171825: "ig1",
		171826: "plipo",
		171854: "luna0104",
		171870: "pawlz",
		171886: "API~171886",
		171897: "thatevil",
		171898: "yazzberry",
		171900: "sir chungus",
		171901: "bubby",
		171926: "jellybz",
		171952: "jgarel",
		171960: "guest_jsu07",
		171972: "API~171972",
		171979: "API~171979",
		171981: "API~171981",
		171990: "drizzy",
		171994: "API~171994",
		172025: "harryballs69",
		172026: "asdafagas",
		172059: "endcycle",
		172091: "tobm22575",
		172094: "guest_bmtm9",
		172096: "abolyakuza",
		172099: "texasred",
		172101: "duckzrouxlz",
		172112: "API~172112",
		172132: "japva",
		172170: "wiiki",
		172187: "prstben",
		172203: "niccolozy",
		172227: "guest_as3d5",
		172258: "finny22",
		172259: "guest_0tsyr",
		172270: "bluepaladin",
		172292: "sonaralee",
		172306: "API~172306",
		172313: "nbankes",
		172329: "bob1233",
		172330: "API~172330",
		172351: "idpifoo",
		172368: "nalaysiabyrd",
		172376: "runeseeker",
		172381: "API~172381",
		172385: "jiepie",
		172413: "API~172413",
		172438: "guest_611gw",
		172449: "guest_sezdx",
		172492: "kronos51",
		172496: "surukamichan",
		172511: "API~172511",
		172543: "ehrros",
		172551: "API~172551",
		172553: "never1989",
		172555: "jostar",
		172558: "it idie10tim",
		172561: "API~172561",
		172562: "guest_e0zc0",
		172569: "twelve15",
		172575: "cy chotic",
		172584: "frague71",
		172591: "the2ndlegacy",
		172597: "kaibkr",
		172598: "y5215588",
		172631: "API~172631",
		172632: "bruextian",
		172633: "mithzan",
		172635: "fat mama",
		172638: "sarah smith",
		172639: "runedev",
		172642: "lionscubs123",
		172647: "mrswolemilk",
		172651: "datguyusaw",
		172764: "mco180",
		172767: "wowso",
		172769: "API~172769",
		172772: "dh3 was peak",
		172773: "firemarlin",
		172775: "67 mason",
		172785: "solarflayre",
		172787: "monkeytim11",
		172797: "l0stscr0lls",
		172805: "jamzzy",
		172807: "r0ces",
		172809: "API~172809",
		172813: "API~172813",
		172824: "monaye32889",
		172827: "godzillah1",
		172838: "2ez",
		172868: "bozondrt",
		172869: "joeyjames",
		172874: "raam",
		172890: "wefu",
		172899: "rrob100",
		172918: "dappermimicy",
		172936: "xiejunff1",
		172944: "goatmilk",
		172978: "nyonflame",
		172994: "sir radzig",
		173063: "grinder1",
		173067: "API~173067",
		173068: "someone0987",
		173107: "mnlg",
		173109: "fackuu99",
		173112: "undefeated10",
		173128: "wtmsb",
		173135: "zhishi6go",
		173174: "API~173174",
		173224: "happyboll",
		173228: "cocodone",
		173241: "API~173241",
		173272: "lilmacy",
		173273: "hello101",
		173274: "dylan2182010",
		173276: "gkelderh000",
		173278: "fartbender42",
		173287: "API~173287",
		173336: "hightluck",
		173445: "guest_9qwr3",
		173454: "2280742943",
		173459: "hes",
		173471: "shan",
		173472: "shan1",
		173473: "API~173473",
		173503: "bloarb",
		173507: "lian",
		173510: "API~173510",
		173516: "API~173516",
		173533: "myuserexists",
		173548: "shan2",
		173560: "yameal",
		173562: "guest_p7xsx",
		173566: "API~173566",
		173584: "guest_tt753",
		173586: "dfww",
		173604: "guest_kud84",
		173634: "gman789",
		173640: "brightblight",
		173656: "bigguy",
		173657: "API~173657",
		173660: "scriptor",
		173667: "676767",
		173691: "API~173691",
		173692: "samhapppy",
		173701: "cikez",
		173703: "API~173703",
		173738: "qdfgnm",
		173746: "bulebell",
		173747: "lane0",
		173751: "6gbg",
		173753: "API~173753",
		173754: "iakjsjw",
		173755: "API~173755",
		173756: "API~173756",
		173757: "trippeisenwa",
		173762: "hello1012",
		173768: "guest_k0g2w",
		173771: "guest_m7k2d",
		173772: "1234567u",
		173773: "cirvetgt",
		173780: "block",
		173784: "guest_91t6d",
		173787: "tildis",
		173793: "judeq",
		173806: "marionn",
		173814: "speedlobus",
		173820: "iamcool69",
		173831: "thatoneguy12",
		173833: "API~173833",
		173838: "prstben2",
		173857: "API~173857",
		173865: "天地大变",
		173868: "API~173868",
		173869: "API~173869",
		173870: "he2",
		173871: "API~173871",
		173884: "krabbicraft",
		173902: "API~173902",
		173932: "fallenhyde",
		173936: "guest_497vg",
		173944: "jjamwas",
		173945: "API~173945",
		173958: "luke pete",
		173960: "potatoator",
		173978: "API~173978",
		173990: "API~173990",
		173991: "tracery",
		174023: "API~174023",
		174041: "sciencecal1",
		174061: "API~174061",
		174068: "API~174068",
		174075: "knallt",
		174081: "litt",
		174093: "guest_zvy71",
		174146: "dmv",
		174147: "API~174147",
		174157: "guest_yqes6",
		174160: "API~174160",
		174175: "roshantheg",
		174177: "API~174177",
		174181: "gabers123555",
		174190: "crimsonv",
		174207: "ogabb",
		174238: "API~174238",
		174275: "API~174275",
		174284: "peanuts8794",
		174313: "API~174313",
		174317: "API~174317",
		174323: "guest_3e3az",
		174333: "orange5353",
	};

    const configurableStyles = document.createElement("style");
    document.head.appendChild(configurableStyles);

    class MarketPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("market", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        label: "------------------------------------------------<br/>General<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "autoMax",
                        label: "Autofill Max Buy",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "marketSoldNotification",
                        label: "Notification on item sold and item watchers", //temp fix
                        type: "boolean",
                        default: true
                    },
                    //Zlef
                    {
                        id: "clickBrewIng",
                        label: "Click on a brewing ingredient to go to player market page.",
                        type: "boolean",
                        default: true
                    },
                    //End Zlef
                    {
                        id: "marketGraph",
                        label: "Show a 7-days price history when browsing items.",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Table<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "highlightBest",
                        label: "Highlight Best",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "altIDList",
                        label: "Player ID blacklist for alts",
                        type: "string",
                        max: 200000,
                        default: "PlaceIDsHere"
                    },
                    {
                        id: "heatPotion",
                        label: "Account for heat potion use in heat cost",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "extraInfoColumn",
                        label: "Show Extra Info on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "categoryColumn",
                        label: "Show Category on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickBuyColumn",
                        label: "Show Quick Buy button on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickBuyAmount",
                        label: "Quick Buy button amount (0 = max)",
                        type: "number",
                        default: 1
                    },
                    {
                        id: "quickBuyAllNeedsAltKey",
                        label: "Require Alt-key when right-clicking to quick-buy all",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Theme<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "condensed",
                        label: "Condensed UI",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "theme",
                        label: "Bundled theme",
                        type: "select",
                        options: ["Default", "Dark"],
                        default: "Default"
                    },
                    {
                        id: "colorTextEnabled",
                        label: "Change text color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorText",
                        label: "Text color",
                        type: "color",
                        default: THEME_DEFAULTS.default.text
                    },
                    {
                        id: "colorItemSlotsBgEnabled",
                        label: "Change item slots background color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorItemSlotsBg",
                        label: "Panels background color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgItemSlots
                    },
                    {
                        id: "colorPanelsBgEnabled",
                        label: "Change panels background color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorPanelsBg",
                        label: "Panels background color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgPanels
                    },
                    {
                        id: "colorPanelsOutlineEnabled",
                        label: "Change panels outline color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorPanelsOutline",
                        label: "Panels outline color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgOutline
                    },
                    {
                        id: "colorRowAccentsEnabled",
                        label: "Change table row accent colors",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorRowOdd",
                        label: "Row accent color 1",
                        type: "color",
                        default: THEME_DEFAULTS.default.rowAccent1
                    },
                    {
                        id: "colorRowEven",
                        label: "Row accent color 2",
                        type: "color",
                        default: THEME_DEFAULTS.default.rowAccent2
                    },
                    {
                        id: "colorChartLineEnabled",
                        label: "Change history chart line colors",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorChartLineMax",
                        label: "History chart max price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineMax
                    },
                    {
                        id: "colorChartLineAverage",
                        label: "History chart average price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineAverage
                    },
                    {
                        id: "colorChartLineMin",
                        label: "History chart min price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineMin
                    }
                ]
            });
            this.lastBrowsedItem = "all";
            this.lastCategoryFilter = "all";
            this.historyChart = undefined;
            this.marketAverages = {};
            this.pendingConfirmationPurchaseLog = {};
            this.currentTableData = undefined;
            this.lastSortIndex = 0;
            this.loginDone = false;
        }

        onConfigsChanged() {
            this.applyCondensed(this.getConfig("condensed"));
            this.loadStyles();

            if(this.getConfig("marketSoldNotification")) {
                this.updateMarketNotifications();
            } else {
                clearInterval(marketTimer);
                //should this be running without sold notifications?
                clearInterval(marketWatcherTimer);
                marketRunning = false;
                $("#market-sidecar").hide();
            }

            if(this.getConfig("marketGraph")) {
                $("#history-chart-div").hide();
            }

            if(this.loginDone)
                this.refreshMarket(false);
        }

        addMarketNotifications() {
            const sideCar = document.createElement('span');
            sideCar.id = `market-sidecar`;
            sideCar.onclick = function () {
                IdlePixelPlus.plugins.market.collectMarketButton();
            }
            sideCar.style='margin-right: 4px; margin-bottom: 4px; display: none; cursor: pointer;';

            var elem = document.createElement("img");
            elem.setAttribute("src", `${IMAGE_HOST_URL}/player_market.png`);
            const sideCarIcon = elem;
            sideCarIcon.className = "w20";

            const sideCarDivLabel = document.createElement('span');
            sideCarDivLabel.id = `market-sidecar-coins`;
            sideCarDivLabel.innerText = ' 0';
            sideCarDivLabel.className = 'color-white'

            sideCar.append("  (", sideCarIcon, sideCarDivLabel, ")");
            document.querySelector('#item-display-coins').after(sideCar);
            $("#market-sidecar").hide();
        };

        collectMarketButton() {
            $("#market-sidecar").hide();
            document.querySelectorAll(`button[id^=player-market-slot-collect-amount]`).forEach(b => {
                const collect = parseInt(b.textContent.replace(/[^0-9]/g,''));
                if(collect > 0){
                    b.click();
                }
            });
        }

        updateMarketNotifications() {
            if(!marketRunning) {
                marketRunning = true;
                marketTimer = setInterval(function() {
                    websocket.send("MARKET_REFRESH_SLOTS");

                    setTimeout(function() {
                        const total = [1, 2, 3].map(n => {
                            const collect = parseInt($(`button#player-market-slot-collect-amount-${n}`).text().replace(/\D/g,''));
                            return isNaN(collect) ? 0 : collect;
                        }).reduce((a, b) => a + b, 0);
                        if(total > 0) {
                            $("#market-sidecar-coins").text(" " + total.toLocaleString());
                            $("#market-sidecar").show();
                        } else {
                            $("#market-sidecar-coins").text(" " + total.toLocaleString());
                            $("#market-sidecar").hide();
                        }
                    }, 50);
                }, 10000);
                marketWatcherTimer = setInterval(function() {
                    IdlePixelPlus.plugins.market.checkWatchers();
                }, 30000);
            }
        }

        applyCondensed(condensed) {
            if(condensed) {
                $("#panel-player-market").addClass("condensed");
                $("#modal-market-select-item").addClass("condensed");
            }
            else {
                $("#panel-player-market").removeClass("condensed");
                $("#modal-market-select-item").removeClass("condensed");
            }
        }

        getStyleFromConfig(enableId, colorId) {
            return this.getConfig(enableId) ? this.getConfig(colorId) : THEME_DEFAULTS[this.getConfig("theme").toLowerCase()][colorId];
        }

        loadStyles() {
            const colorText = this.getStyleFromConfig("colorTextEnabled", "colorText");
            const colorPanelsOutline = this.getStyleFromConfig("colorPanelsOutlineEnabled", "colorPanelsOutline");
            const colorRowOdd = this.getStyleFromConfig("colorRowAccentsEnabled", "colorRowOdd");
            const colorRowEven = this.getStyleFromConfig("colorRowAccentsEnabled", "colorRowEven");
            const colorItemSlotsBg = this.getStyleFromConfig("colorItemSlotsBgEnabled", "colorItemSlotsBg");
            const colorPanelsBg = this.getStyleFromConfig("colorPanelsBgEnabled", "colorPanelsBg");
            const styles = `
            #market-table, #market-log-table {
                margin-top: 0.5em !important;
                border-spacing:0 4px !important;
                border-collapse: separate;
                background: ${colorPanelsOutline} !important;
                border-width: 4px;
                border-radius: 5pt;
                padding: 4px;
                > * tr th {
                    background: ${colorPanelsOutline};
                    color: ${colorText};
                }
                > * tr:nth-child(even) {
                    background: ${colorRowOdd};
                    color: ${colorText};
                }
                > * tr:nth-child(odd) {
                    background: ${colorRowEven};
                    color: ${colorText};
                }
                > * tr.cheaper {
                    background-color: rgb(50, 205, 50, 0.25);
                }
                > * td {
                    background: inherit;
                    color: inherit;
                    &:first-child {
                        border-top-left-radius: 5pt;
                        border-bottom-left-radius: 5pt;
                    }
                    &:last-child {
                        border-top-right-radius: 5pt;
                        border-bottom-right-radius: 5pt;
                    }
                    > button {
                        border-radius: 3pt;
                        border: 2px solid #00000022;
                        padding: 4px;
                        box-shadow: none;
                        background-color: ${colorPanelsOutline};
                        color: ${colorText};
                        &:disabled {
                            color: ${colorText + "55"};
                            pointer-events: none;
                        }
                    }
                }
            }
            div[id^=player-market-slot] {
                border-spacing:0 4px;
                border-collapse: separate;
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorItemSlotsBg};
                color: ${colorText};
                > div, span {
                    color: ${colorText} !important;
                }
                > button {
                    border-radius: 5pt;
                    border: 2px solid #00000022;
                    box-shadow: none;
                }
            }
            div[id^=player-market-slot-empty] {
                &:hover {
                    outline: 1px solid ${colorText + "55"};
                    z-index: 1;
                }
                > #panel-sell-text {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    font-size: 20pt;
                    color: ${colorText + "55"} !important;
                }
            }
            #market-watcher-div {
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorPanelsBg};
                margin: 0px;
                color: ${colorText};
                > div[id^=watched-item] {
                    color: black;
                }
            }
            #history-chart-div {
                position: relative;
                margin: 0 auto;
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorPanelsBg};
                > #history-chart-timespan {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    font-size: 10pt;
                    border-radius: 3pt;
                    background-color: ${colorPanelsBg};
                    color: ${colorText};
                    &:hover {
                        cursor: pointer;
                    }
                    &:focus-visible {
                        outline: none;
                    }
                }
            }`;
            if(this.historyChart) {
                this.historyChart.options.scales.x.ticks.color = colorText;
                this.historyChart.options.scales.y.ticks.color = colorText;
            }
            else {
                Chart.defaults.color = colorText;
            }

            configurableStyles.innerHTML = styles;
        }

        async onLogin() {
            this.addMarketNotifications();
            if(this.getConfig("marketSoldNotification")) {
                this.updateMarketNotifications();
            }
            const self = this;

            $("head").append(`
            <style id="styles-market">
                #panel-player-market {
                    &.condensed {
                        > center {
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                        }
                        & div.player-market-slot-base {
                            height: 400px;
                        }
                        & div.player-market-slot-base hr {
                            margin-top: 2px;
                            margin-bottom: 4px;
                        }
                        & div.player-market-slot-base br + div.player-market-slot-base br {
                            display: none;
                        }
                        & div.player-market-slot-base[id^="player-market-slot-occupied"] {
                            > button {
                                padding: 2px;
                            }
                            > button[id^="player-market-slot-see-market"] {
                                width: 90%;
                                margin-top: 0.5em;
                                margin-bottom: 0.5em;
                                background-color: rgb(46, 137, 221);
                            }
                            > h2[id^="player-market-slot-item-item-label"] {
                                font-size: 1.8rem;
                                margin-bottom: 0;
                            }
                        }
                        & #market-table th, #market-table td {
                            padding: 2px 4px;
                        }
                    }
                }
                #modal-market-select-item.condensed #modal-market-select-item-section .select-item-tradables-catagory {
                    margin: 6px 6px;
                    padding: 6px 6px;
                }
                #modal-market-select-item.condensed #modal-market-select-item-section .select-item-tradables-catagory hr {
                    margin-top: 2px;
                    margin-bottom: 2px;
                }
                .hide {
                    display: none;
                }
                .bold {
                    font-weight: bold;
                }
                .select-item-tradables-catagory {
                    border-radius: 5pt;
                }
                #market-table th.actions:hover {
                    color: gray;
                    cursor: pointer;
                }
                .context-menu {
                    position: absolute;
                }
                .menu {
                    display: flex;
                    flex-direction: column;
                    background-color: rgb(240, 240, 240);
                    border-radius: 5pt;
                    box-shadow: 4px 4px 8px #0e0e0e;
                    padding: 10px 0;
                    list-style-type: none;
                    > li {
                        font: inherit;
                        border: 0;
                        padding: 4px 36px 4px 16px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        position: relative;
                        text-decoration: unset;
                        color: #000;
                        transition: 0.5s linear;
                        -webkit-transition: 0.5s linear;
                        -moz-transition: 0.5s linear;
                        -ms-transition: 0.5s linear;
                        -o-transition: 0.5s linear;
                        > span:not(:first-child) {
                            position: absolute;
                            right: 12px;
                        }
                        &:hover {
                            background:#afafaf;
                            color: #15156d;
                            cursor: pointer;
                        }
                    }
                }
                .hoverable-div:hover {
                    box-shadow: 4px 4px 8px #0e0e0e;
                    border-color: #252525;
                    cursor: pointer;
                }
                #market-log-table th, #market-log-table td {
                    padding: 2px 4px;
                }
            </style>
            `);

            // Market watcher modal
            $("#modal-item-input").after(`
            <div class="modal modal-dim" id="modal-market-configure-item-watcher" tabindex="-1" style="top: 0px; display: none;" aria-modal="true" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-secondary">ITEM WATCHER</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="center">
                                <div class="modal-market-sell-image p-2 hard-shadow">
                                    <h2 id="modal-market-configure-item-watcher-label"></h2>
                                    <img id="modal-market-configure-item-watcher-image" width="50px" height="50px" original-width="50px" original-height="50px" src="">
                                </div>
                                <br>
                                <input type="hidden" id="modal-market-configure-item-watcher">
                                <div class="modal-market-watcher-inputs font-small color-grey p-2 shadow">
                                    <br>
                                    <br>
                                    Limit:
                                    <span class="color-gold" id="modal-market-configure-item-watcher-low-limit">N/A</span>
                                    -
                                    <span class="color-gold" id="modal-market-configure-item-watcher-high-limit">N/A</span>
                                    <span class="color-gold"> each</span>
                                    <br>
                                    <img src="${COIN_ICON_URL}" title="coins">
                                    <input type="text" id="modal-market-configure-item-watcher-price-each" width="30%" placeholder="Price Each" original-width="30%">
                                    <select id="modal-market-configure-item-watcher-mode">
                                    <option value="1">Less than</option>
                                    <option value="2">At least</option>
                                    </select>
                                    <br>
                                    <br>
                                    <br>
                                    <br>
                                    <div>
                                        <input type="button" id="modal-market-configure-item-watcher-cancel-button" data-bs-dismiss="modal" value="Cancel">
                                        <input type="button" id="modal-market-configure-item-watcher-ok-button" onclick="IdlePixelPlus.plugins.market.createMarketWatcher()" class="background-primary hover" value="Create Watcher">
                                        <u class="hover" onclick="alert(&quot;You will get a notification when the price crosses the specified threshold.&quot;)">?</u>
                                    </div>
                                    <br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);

            // Market table sort menu
            $("#panel-player-market").append(`
            <div id="market-sort-context-menu" class="context-menu" style="display: none">
                <ul class="menu">
                    <li id="context-menu-price-each-item" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-price-each-item\");'>
                        <span> Price Each</span>
                    </li>
                </ul>
            </div>`);

            const sellSlotWidth = $(".player-market-slot-base").outerWidth();
            document.getElementById("market-table").style.minWidth = sellSlotWidth * 3;
            // History chart
            $(`#panel-player-market button[onclick^="Market.clicks_browse_player_market_button"]`).parent().before(`
                <div id="history-chart-div" style="display:block; margin-bottom: 0.5em; width: ${sellSlotWidth * 3}px; height: 200px;">
                    <select id="history-chart-timespan" align="right" onchange='IdlePixelPlus.plugins.market.fetchMarketHistory();'>
                        <option value="1d">24 Hours</option>
                        <option value="7d" selected="selected">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="60d">60 Days</option>
                        <option value="120d">120 Days</option>
                    </select>
                    <canvas id="history-chart" style="display: block;" align="middle">
                </div>`);
            Object.assign(Chart.defaults.datasets.line, {
                fill: false,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 1
            });

            // Market watcher
            $("#notifications-area").children().last().after(`
                <div id="notification-market-watcher" class="notification hover hide" onclick='switch_panels(\"panel-player-market\");' style="margin-right: 4px; margin-bottom: 4px; background-color: rgb(183, 68, 14);">
                    <img src="${IMAGE_HOST_URL}/player_market.png" class="w20" title="market_alert">
                    <span id="notification-market-item-label" class="color-white"> Market Alert</span>
                </div>`);
            $("#history-chart-div").prev().before(`
                <center>
                <div id="market-watcher-div" class="select-item-tradables-catagory shadow" align="left" style="width: ${sellSlotWidth * 3}px; display: none;">
                    <span class="bold">Active watchers</span>
                    <hr style="margin-top: 2px; margin-bottom: 4px;">
                </div>
                </center>`);

            // modal-market-configure-item-to-sell-amount
            const sellModal = $("#modal-market-configure-item-to-sell");
            const sellAmountInput = sellModal.find("#modal-market-configure-item-to-sell-amount");
            sellAmountInput.after(`
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyOneAmountSell()">1</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountSell()">max</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountSell(true)">max-1</button>
            `);
            const sellPriceInput = sellModal.find("#modal-market-configure-item-to-sell-price-each").after(`
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMinPriceSell()">min</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyLowestPriceSell()">lowest</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMidPriceSell()">mid</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxPriceSell()">max</button>
                <br /><br />
                Total: <span id="modal-market-configure-item-to-sell-total"></span>
            `);

            // Extra buttons beside <BROWSE PLAYER MARKET>
            $(`#panel-player-market button[onclick^="Market.clicks_browse_player_market_button"]`)
                .first()
                .after(`<button id="refresh-market-table-button" type="button" style="height: 44px; margin-left: 0.5em" onclick="IdlePixelPlus.plugins.market.refreshMarket(true);">
                            Refresh
                        </button>`)
                .after(`<button id="watch-market-item-button" type="button" style="height: 44px; margin-left: 0.5em" onclick="IdlePixelPlus.plugins.market.watchItemOnClick()">
                            Watch Item
                        </button>`);

            document.querySelectorAll(`button[id^=player-market-slot-collect-amount]`).forEach(b => {
                // Add See Market button
                const id = b.id.match(/[1-3]/)[0];
                b.nextElementSibling.remove();
                b.insertAdjacentHTML("afterend", `<button type="button" id="player-market-slot-see-market-${id}" onclick="IdlePixelPlus.plugins.market.seeMarketOnClick(${id})">See Market</button>`);

                // Add event to reset collection button
                b.addEventListener("click", () => {
                    const item = document.getElementById(`player-market-slot-item-item-label-${id}`).textContent.toLowerCase().replace(/\s/g, "_");
                    const price_each = parseInt(document.getElementById(`player-market-slot-item-price-each-${id}`).textContent.replace(/[^0-9]+/g, ""));
                    const amount = b.textContent.replace(/[^0-9]+/g, "") / price_each;
                    if (amount > 0) {
                        this.saveLogToLocalStorage({
                            item: item,
                            amount: amount,
                            price_each: price_each,
                            transaction_type: "Sale"
                        });
                        b.textContent = b.textContent.replace(/[0-9,]+/, '0');
                        $("#market-sidecar").hide();
                        this.refreshMarket(false);
                    }
                });
            });
            document.querySelectorAll(`span[id^=player-market-slot-expires]`).forEach(s => s.previousElementSibling.remove());

            // Refresh market on purchase
            const purchaseButton = document.querySelector(`input[onclick*="Market.purchase_item()"]`);
            if(purchaseButton)
                purchaseButton.addEventListener("click", () => this.refreshMarket(false));

            sellAmountInput.on("input change", () => this.applyTotalSell());
            sellPriceInput.on("input change", () => this.applyTotalSell());

            // Zlef
            // Add buttons to brewing ingredients
            const parentDiv = document.getElementById("panel-brewing");

            // Loop through all itembox elements within the parent div
            parentDiv.querySelectorAll('itembox').forEach((itemBox) => {
                // Check if it contains 'Primary Ingredient' or 'Secondary Ingredient'
                const tooltip = itemBox.getAttribute("data-bs-original-title");
                if (tooltip && (tooltip.includes("Primary Ingredient") || tooltip.includes("Secondary Ingredient"))) {
                    // Add click event to the itembox
                    itemBox.addEventListener("click", () => this.brewingIngClicked(itemBox));
                }
            });
            //End Zlef

            // Observer for brewing modal change
            const brewingModal = document.getElementById("modal-brew-ingredients");
            const brewingModalObserverOptions = { childList: true, subtree: true};
            const brewingModalObserver = new window.MutationObserver((mutationRecords) => {
                brewingModalObserver.disconnect();
                const record = mutationRecords[0];
                let totalCost = 0;
                const promises = Array.from(record.addedNodes).map((async (node) => {
                        if(node.nodeName === "IMG" && node.nextSibling.nodeName === "#text") {
                            const item = node.src.match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
                            if(Market.tradables.find(t => t.item === item)) {
                                const qty = node.nextSibling.textContent.match(/[0-9]+/)[0];
                                const response = await fetch(`${MARKET_POSTINGS_URL}/${item}/`);
                                const data = await response.json();
                                let currentMarketMinPrice = Math.min(...data.map(datum => datum.market_item_price_each));
                                if(!isFinite(currentMarketMinPrice)) { // If item isn't currently on sale, use market average value instead
                                    currentMarketMinPrice = this.marketAverages[item];
                                }
                                const displayedValue = (qty * currentMarketMinPrice > 1000) ? `${(qty * currentMarketMinPrice / 1000).toFixed(2)}k` : qty * currentMarketMinPrice;
                                totalCost += qty * currentMarketMinPrice;
                                node.nextSibling.textContent += ` (`;
                                node.nextElementSibling.insertAdjacentHTML("beforebegin", `<img src="${COIN_ICON_URL}" title="coins"> ${displayedValue})`);
                            }
                        }
                    })
                );
                Promise.all(promises).then(() => {
                    const totalCostElement = document.getElementById("brewing-total-cost");
                    const totalCostStr = `Estimated total cost: ${totalCost > 1000 ? (totalCost / 1000).toFixed(2) + "k" : totalCost}`;
                    if(totalCostElement)
                        totalCostElement.textContent = totalCostStr;
                    else
                        record.target.parentNode.insertAdjacentHTML("afterend", `<span id="brewing-total-cost" class="colorg-grey">${totalCostStr}</span>`);
                    brewingModalObserver.observe(brewingModal, brewingModalObserverOptions);
                });
            });
            brewingModalObserver.observe(brewingModal, brewingModalObserverOptions);

            if(this.getConfig("condensed")) {
                // Remove <br> from between <Amount left> and <Price each>, and reinsert it above title
                document.querySelectorAll(`span[id^="player-market-slot-item-amount-left"]`).forEach(e => {
                    const br = e.parentNode.removeChild(e.nextElementSibling);
                    e.parentNode.querySelector(`h2[id^="player-market-slot-item-item-label"]`).before(br);
                });
            }

            const buyModal = $("#modal-market-purchase-item");
            const buyAmountInput = buyModal.find("#modal-market-purchase-item-amount-input");
            $(document).on('click', '[onclick*="Modals.market_purchase_item"]', this.handlePurchaseClick.bind(this));
            buyAmountInput.after(`
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyOneAmountBuy()">1</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountBuy()">max</button>
                <br /><br />
                Total: <span id="modal-market-purchase-item-total"></span>
                <br />
                Owned: <item-display data-format="number" data-key="coins"></item-display>
            `);
            buyAmountInput.on("input change", () => this.applyTotalBuy());

            // Remove sell buttons
            document.querySelectorAll("div[id^=player-market-slot-empty] button").forEach(b => {
                b.parentElement.onclick = b.onclick;
                const div = document.createElement("div");
                div.setAttribute("id", "panel-sell-text");
                div.classList.add("hover");
                div.innerText = "Sell an item";
                b.replaceWith(div);
            });

            // wrap Market.browse_get_table to capture last selected
            Market.browse_get_table = function(item) {
                return self.browseGetTable(item, true);
            }

            // Wrap Market.purchase_item to send to log
            const original_purchase_item = Market.purchase_item;
            Market.purchase_item = function() {
                const item = document.getElementById("modal-market-purchase-item-label").textContent.toLowerCase().replace(/\s/g, "_");
                const amount = get_number_with_letters(document.getElementById("modal-market-purchase-item-amount-input").value);
                const price_each = parseInt(document.getElementById("modal-market-purchase-item-price-each").value.replace(/[^0-9]+/g, ""));
                IdlePixelPlus.plugins.market.storeLogPendingConfirmation(item, amount, price_each, "Purchase");
                original_purchase_item.apply(this);
            }

            // Add event listener to websocket to catch purchase confirmations
            websocket.connected_socket.addEventListener("message", (e) => {
                if(e.data.includes("OPEN_DIALOGUE=")) {
                    const values = e.data.substring(e.data.indexOf('=')+1);
                    if(values.includes("MARKET PURCHASE") && values.includes("Successfully purchased from player market!")) {
                        this.saveLogToLocalStorage(this.pendingConfirmationPurchaseLog);
                        this.pendingConfirmationPurchaseLog = {};
                    }
                }
            })

            // Edit tradables modal category names
            new window.MutationObserver((mutationRecords) => {
                const childList = mutationRecords.filter(record => record.type === "childList")[0];
                if(childList && childList.target && childList.target.id === "modal-market-select-item-section") {
                    const elements = document.getElementById(childList.target.id).querySelectorAll(".select-item-tradables-catagory");
                    elements.forEach(e => {
                        let isSellModal = false;

                        e.classList.add("bold");
                        e.innerHTML = e.innerHTML.replace(/[a-zA-Z_]+<hr>/, e.textContent.split("_").map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ") + "<hr>");

                        e.querySelectorAll("div").forEach(d => {
                            isSellModal |= /Modals\.market_configure_item_to_sell/.test(d.onclick.toString());
                            if(d.parentNode.textContent.toLowerCase() != "all") {
                                d.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                });
                                const match = d.onclick.toString().match(/(Modals\.market_configure_item_to_sell|Market\.browse_get_table)\(\"([a-zA-Z0-9_]+)\"/);
                                if(match) {
                                    d.setAttribute("data-bs-toggle", "tooltip");
                                    d.setAttribute("data-bs-placement", "top");
                                    d.setAttribute("data-boundary", "window");
                                    d.setAttribute("title", Items.get_pretty_item_name(match[2]));
                                }
                            }
                        });
                        if(!isSellModal) {
                            e.onclick = () => this.filterButtonOnClick(e.textContent.toLowerCase().replace(" ", "_"));
                            e.classList.add("hoverable-div");
                        }
                    });
                }
            }).observe(document.getElementById("modal-market-select-item"), {
                childList: true,
                subtree: true
            });

            // Player ID display
            var playerID = var_player_id;
            $(`#search-username-hiscores`).after(`<span id="player_id">(ID: ${playerID})</span>`);

            this.onConfigsChanged();
            this.createMarketLogPanel();
            this.loadStyles();
            this.applyLogLocalStorage();
            this.applyWatchersLocalStorage();
            this.checkWatchers();
            this.getGlobalMarketHistoryAverages(7);
            this.preloadMarketTradables();
            this.loginDone = true;
        }

        async fetchBrowseResult(item) {
            const response = await fetch(`${MARKET_POSTINGS_URL}/${item}/`);
            return response.json();
        }

        browseGetTable(item, updateGraph) {
            const self = this;
            if(item != this.lastBrowsedItem) {
                self.lastSortIndex = 0;
            }
            this.lastBrowsedItem = item;
            if(item == "all") {
                $("#watch-market-item-button").hide();
                $("#history-chart-div").hide();
            }
            else {
                $("#watch-market-item-button").show();
                $("#modal-market-configure-item-watcher-image").attr("src", this.getItemIconUrl(item));
                $("#modal-market-configure-item-watcher-label").text(item.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));

                try {
                    if(this.getConfig("marketGraph") && updateGraph) {
                        self.fetchMarketHistory(item);
                    }
                } catch(err) {
                    console.log(err);
                }
            }

            // A good chunk of this is taking directly from Market.browse_get_table
            //hide_element("market-table");
            //show_element("market-loading");
            let best = {};
            let bestList = {};
            return $.get(`${MARKET_POSTINGS_URL}/${item}/`).done(async function(data) {
                const xpMultiplier = DonorShop.has_donor_active(IdlePixelPlus.getVar("donor_bonus_xp_timestamp")) ? 1.1 : 1;
                const listofAlts = IdlePixelPlus.plugins.market.getConfig("altIDList").replace(";",",").replace(/\s?,\s?/g, ",").toLowerCase().split(',').map(altId => parseInt(altId));
                const useHeatPot = self.getConfig("heatPotion");

                if(data.find(datum => ["logs", "raw_fish"].includes(datum.market_item_category)) !== undefined) {
                    var coinsPerHeat = 100000;
                    const logsData = await self.fetchBrowseResult("logs");
                    coinsPerHeat = 1.01 * Math.min(...logsData.map(datum => datum.market_item_price_each / Cooking.getHeatPerLog(datum.market_item_name)));
                }

                // Removes the alts listing from market and calculations
                data = data.filter(datum => listofAlts.indexOf(parseInt(datum.player_id)) == -1);

                data.forEach(datum => {
                    //console.log(datum);
                    const priceAfterTax = datum.market_item_price_each * 1.01;
                    switch(datum.market_item_category) {
                        case "bars":
                        case "ores": {
                            let perCoin = (priceAfterTax / (xpMultiplier*XP_PER[datum.market_item_name]));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = isNaN(perCoin) ? "" : `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/xp`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "logs": {
                            let perCoin = (priceAfterTax / (Cooking.getHeatPerLog(datum.market_item_name) * (useHeatPot ? 2 : 1)));
                            let sDPerCoin = (4000 / priceAfterTax);
                            const charcoalMultiplier = 1 * (window.var_titanium_charcoal_foundry_crafted ? 2 : 1) * (window.var_green_charcoal_orb_absorbed ? 2 : 1);
                            let charPerCoin = ((priceAfterTax / CHARCOAL_PERC[datum.market_item_name]) / charcoalMultiplier);
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            datum.perCoin = perCoin;
                            datum.levelReq = levelReq;
                            datum.sDPerCoin = sDPerCoin;
                            datum.charPerCoin = charPerCoin;
                            datum.ratios = [perCoin, charPerCoin];
                            if (datum.market_item_name == 'stardust_logs') {
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat<br />${sDPerCoin.toFixed(sDPerCoin < 10 ? 2 : 1)} ~SD/coin<br/>${charPerCoin.toFixed(charPerCoin < 10 ? 2: 1)} ~coins/charcoal`;
                            }
                            else {
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat<br/>${charPerCoin.toFixed(charPerCoin < 10 ? 2: 1)} ~coins/charcoal`;
                            }
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "raw_fish":{
                            let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                            let energy = (Cooking.get_energy(datum.market_item_name));
                            let heat = (HEAT_PER[datum.market_item_name]);
                            let perHeat = (energy / heat);
                            let comboCoinEnergyHeat = ((priceAfterTax + (heat * coinsPerHeat / (useHeatPot ? 2 : 1))) / energy);
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            datum.perCoin = comboCoinEnergyHeat;
                            datum.perHeat = perHeat;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy || ${perHeat.toFixed(perHeat < 10 ? 2 : 1)} energy/heat<br />${comboCoinEnergyHeat.toFixed(comboCoinEnergyHeat < 10 ? 4 : 1)} coins/heat/energy`;
                            datum.levelReq = levelReq;
                            datum.ratios = [perCoin, perHeat, comboCoinEnergyHeat];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "cooked_fish":{
                            let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "bones": {
                            let perCoin = (priceAfterTax / BONEMEAL_PER[datum.market_item_name]);
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/bonemeal`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "seeds": {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            let sDPerCoin = (14000 / priceAfterTax);
                            datum.levelReq = levelReq;
                            datum.sDPerCoin = sDPerCoin;
                            datum.perCoinLabel = (datum.market_item_name == "stardust_seeds") ? `${sDPerCoin.toFixed(sDPerCoin < 10 ? 2 : 1)} ~SD/Coin` : "";
                            break;
                        }
                        case "armour":
                        case "other_equipment":
                        case "weapons": {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            datum.perCoinLabel = "";
                            datum.levelReq = LEVEL_REQ[datum.market_item_name] ? LEVEL_REQ[datum.market_item_name] : "N/A";
                            break;
                        }
                        default: {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            datum.perCoinLabel = "";
                            datum.levelReq = "N/A";
                            break;
                        }
                    }
                });
                Object.values(bestList).forEach(bestCatList => bestCatList.forEach(datum => datum.best=true));

                //console.log(self.lastCategoryFilter);
                //console.log(self.lastSortIndex);
                //console.log(self.lastBrowsedItem);
                if(item !== self.lastBrowsedItem)
                    self.lastSortIndex = 0;
                self.currentTableData = data;
                self.filterTable(item === "all" ? self.lastCategoryFilter : (data.length > 0 ? data[0].market_item_category : "all"));

                hide_element("market-loading");
                show_element("market-table");
            });

        }

        setBest(best, bestList, datum, ratio) {
            if(!best[datum.market_item_category]) {
                best[datum.market_item_category] = ratio;
                bestList[datum.market_item_category] = [datum];
            }
            else {
                if(ratio == best[datum.market_item_category]) {
                    bestList[datum.market_item_category].push(datum);
                }
                else if(ratio < best[datum.market_item_category]) {
                    bestList[datum.market_item_category] = [datum];
                    best[datum.market_item_category] = ratio;
                }
            }
        }

        updateTable() {
            let html = `<tr>
                            <th>ITEM</th>
                            <th style="width: 60px;"></th>
                            <th>AMOUNT</th>
                            <th class="actions" onclick="IdlePixelPlus.plugins.market.marketHeaderOnClick(event);">PRICE EACH</th>`;
            if(this.getConfig("extraInfoColumn"))
                html += `<th>EXTRA INFO</th>`;
            if(this.getConfig("categoryColumn"))
                html += `<th>CATEGORY</th>`;
            html += `<th>EXPIRES IN</th>`;
            if(this.getConfig("quickBuyColumn"))
                html += `<th>QUICK BUY
                        </th>`;
                html += `<th style="width: 0px;"><u class="hover" style="font-size: 80%; font-weight: 400;" onclick="alert(&quot;You can configure visible table columns in the plugin options.&quot;)">?</u></th>`;
            html += `</tr>`;
            // in case you want to add any extra data to the table but still use this script
            if(typeof window.ModifyMarketDataHeader === "function") {
                html = window.ModifyMarketDataHeader(html);
            }

            this.currentTableData.forEach(datum => {
                if(!datum.hidden) {
                    let market_id = datum.market_id;
                    let player_id = datum.player_id;
                    let item_name = datum.market_item_name;
                    let amount = datum.market_item_amount;
                    let price_each = datum.market_item_price_each;
                    let category = datum.market_item_category;
                    let timestamp = datum.market_item_post_timestamp;
                    let perCoinLabel = datum.perCoinLabel;
                    let best = datum.best && this.getConfig("highlightBest");
                    let levelReq = datum.levelReq;
                    let your_entry = "";

                    if(Items.getItem("player_id") == player_id) {
                        your_entry = "<span class='font-small'><br /><br />(Your Item)</span>";
                    } else {
                        if (SMITTY_IDS[player_id] != null) {
                        your_entry = `<span class='font-small'><br /><br />${SMITTY_IDS[player_id]}</span>`;
                        } else {
                            your_entry = `<span class='font-small'><br /><br />(UNKNOWN PLAYER)</span>`;
                            //console.info(player_id);
                        }
                    }

                    let rowHtml = "";
                    rowHtml += `<tr onclick="Modals.market_purchase_item('${market_id}', '${item_name}', '${amount}', '${price_each}'); IdlePixelPlus.plugins.market.applyMaxAmountBuyIfConfigured();" class="hover${ best ? ' cheaper' : '' }">`;
                    rowHtml += `<td>${Items.get_pretty_item_name(item_name)}${your_entry}</td>`;
                    rowHtml += `<td style="width: 60px;"><img src="${IMAGE_HOST_URL}/${item_name}.png" /></td>`;
                    rowHtml += `<td>${amount}</td>`;
                    rowHtml += `<td><img src="${COIN_ICON_URL}" /> ${Market.get_price_after_tax(price_each)}`;
                    if(perCoinLabel) {
                        rowHtml += `<br /><span style="font-size: 80%; opacity: 0.8">${perCoinLabel}</span>`;
                    }
                    rowHtml += `</td>`;
                    if(this.getConfig("extraInfoColumn"))
                        rowHtml += `<td>${levelReq}</td>`;
                    if(this.getConfig("categoryColumn"))
                        rowHtml += `<td>${category}</td>`;
                    rowHtml += `<td>${Market._get_expire_time(timestamp)}</td>`;
                    if(this.getConfig("quickBuyColumn")) {
                        const qbSetting = this.getConfig("quickBuyAmount");
                        const qbMaxAmount = Math.min(amount, Math.floor(IdlePixelPlus.getVarOrDefault("coins", 0, "int") / (price_each * 1.01)));
                        const qbAmount = (qbSetting == 0) ? qbMaxAmount : Math.min(qbSetting, amount, Math.floor(IdlePixelPlus.getVarOrDefault("coins", 0, "int") / (price_each * 1.01)));
                        const qbButtonStr = (qbSetting == 0) ? "Max" : `${qbAmount}`;
                        rowHtml += `<td>
                                        <button onclick='event.stopPropagation();
                                                        IdlePixelPlus.plugins.market.quickBuyOnClick(${market_id}, ${qbAmount});
                                                        IdlePixelPlus.plugins.market.storeLogPendingConfirmation(\"${item_name}\", \"${qbAmount}\", \"${Market.get_price_after_tax(price_each)}\", \"Purchase\");'
                                                oncontextmenu='IdlePixelPlus.plugins.market.quickBuyOnRightClick(${market_id}, ${qbMaxAmount}, event);
                                                                IdlePixelPlus.plugins.market.storeLogPendingConfirmation(\"${item_name}\", \"${qbMaxAmount}\", \"${Market.get_price_after_tax(price_each)}\", \"Purchase\");'
                                                ${qbMaxAmount == 0 ? "disabled": ""}>
                                            Buy ${qbButtonStr}
                                        </button>
                                    </td>`;
                    }
                    rowHtml += `<td style="width:0px;"></td></tr>`;

                    // in case you want to add any extra data to the table but still use this script
                    if(typeof window.ModifyMarketDataRow === "function") {
                        rowHtml = window.ModifyMarketDataRow(datum, rowHtml);
                    }
                    html += rowHtml;
                }
            });
            document.getElementById("market-table").innerHTML = html;
        }

        quickBuyOnClick(marketId, amount) {
            IdlePixelPlus.sendMessage("MARKET_PURCHASE=" + marketId + "~" + amount);
            this.refreshMarket(false);
            this.checkWatchers();
        }

        quickBuyOnRightClick(marketId, amount, event) {
            const qbAllNeedsAltKey = this.getConfig("quickBuyAllNeedsAltKey");
            event.preventDefault();
            event.stopPropagation();
            if(!qbAllNeedsAltKey || event.altKey) {
                IdlePixelPlus.sendMessage("MARKET_PURCHASE=" + marketId + "~" + amount);
                this.refreshMarket(false);
                this.checkWatchers();
            }
        }

        filterButtonOnClick(category) {
            this.lastSortIndex = 0;
            this.lastCategoryFilter = category;
            if(category != "all") { // Patch to prevent clicking the "All" button event coming through to the category listener without double-toggling
                Modals.toggle("modal-market-select-item");
            }
            this.browseGetTable("all", true);
        }

        filterTable(category) {
            if(category) {
                this.lastCategoryFilter = category;
            }
            else {
                category = this.lastCategoryFilter || "all";
            }

            this.configureTableContextMenu(category);

            this.currentTableData.forEach(datum => {
                if(category === "all")
                    datum.hidden = false;
                else
                    datum.hidden = !(category === datum.market_item_category);
            });

            this.sortTable(this.lastSortIndex);
            this.updateTable();
        }

        sortTable(sortDataIndex) {
            // Split the table data into a visible and hidden array in order to sort the visible one
            const visible = this.currentTableData.filter(datum => !datum.hidden);
            const hidden = this.currentTableData.filter(datum => datum.hidden);

            visible.sort((a, b) => {
                switch(sortDataIndex) {
                    case 0:     return a.market_item_price_each - b.market_item_price_each;
                    case 100:   {
                        const a_avg = isNaN(this.marketAverages[a.market_item_name]) ? 0.001 : this.marketAverages[a.market_item_name];
                        const b_avg = isNaN(this.marketAverages[b.market_item_name]) ? 0.001 : this.marketAverages[b.market_item_name];
                        return ((a.market_item_price_each / a_avg) - 1) - ((b.market_item_price_each / b_avg) - 1);
                    }
                    default:    return a.ratios[sortDataIndex - 1] - b.ratios[sortDataIndex - 1];
                }
            });
            this.currentTableData = visible.concat(hidden);
            this.lastSortIndex = sortDataIndex;
        }

        refreshMarket(disableButtonForABit) {
            if(this.lastBrowsedItem) {
                this.browseGetTable(this.lastBrowsedItem, false);
                if(disableButtonForABit) { // prevent spam clicking it
                    $("#refresh-market-table-button").prop("disabled", true);
                    setTimeout(() => {
                        $("#refresh-market-table-button").prop("disabled", false);
                    }, 700);
                }
            }
        }

        applyOneAmountBuy() {
            $("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val(1);
            this.applyTotalBuy();
        }

        applyMaxAmountBuyIfConfigured() {
            if(this.getConfig("autoMax")) {
                this.applyMaxAmountBuy();
            }
        }

        applyMaxAmountBuy(minus1=false) {
            const coinsOwned = IdlePixelPlus.getVarOrDefault("coins", 0, "int");
            const price = parseInt($("#modal-market-purchase-item #modal-market-purchase-item-price-each").val().replace(/[^\d]+/g, ""));
            const maxAffordable = Math.floor(coinsOwned / price);
            const maxAvailable = parseInt($("#modal-market-purchase-item #modal-market-purchase-item-amount-left").val().replace(/[^\d]+/g, ""));
            let max = Math.min(maxAffordable, maxAvailable);
            if(minus1) {
                max--;
            }
            if(max < 0) {
                max = 0;
            }
            $("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val(max);
            this.applyTotalBuy();
        }

        parseIntKMBT(s) {
            if(typeof s === "number") {
                return Math.floor(s);
            }
            s = s.toUpperCase().replace(/[^\dKMBT]+/g, "");
            if(s.endsWith("K")) {
                s = s.replace(/K$/, "000");
            }
            else if(s.endsWith("M")) {
                s = s.replace(/M$/, "000000");
            }
            else if(s.endsWith("B")) {
                s = s.replace(/B$/, "000000000");
            }
            else if(s.endsWith("T")) {
                s = s.replace(/T$/, "000000000000");
            }
            return parseInt(s);
        }

        // Added by Zlef ->
        handlePurchaseClick() {
            setTimeout(this.displayOwnedInPurchase.bind(this), 100);
        }

        displayOwnedInPurchase() {
            const itemNameElement = $("#modal-market-purchase-item-label");
            const itemName = itemNameElement.text();

            if (!itemName) {
                return;
            }

            const itemNameForQuery = itemName.toLowerCase().replace(/\s/g, '_');
            let itemVar = IdlePixelPlus.getVarOrDefault(itemNameForQuery, "0");

            const containerElement = $("#modal-market-purchase-item-image").parent();

            // Check if the element already exists before appending
            if (!containerElement.find("#amount-owned").length) {
                containerElement.append(`<p id="amount-owned">You own: ${itemVar}</p>`);
            } else {
                // Update the existing element
                containerElement.find("#amount-owned").text(`You own: ${itemVar}`);
            }
        }

        brewingIngClicked(itemBox) {
            if (this.getConfig("clickBrewIng")) {
                const dataItem = itemBox.getAttribute("data-item").toLowerCase();
                if(Market.tradables.find(t => t.item === dataItem)) {
                    this.openMarketToItem(dataItem);
                }
            }
        }

        // Function for opening the market to a specific item
        openMarketToItem(dataItem) {
            // Simulate clicking the Player Market panel
            const playerMarketPanel = document.getElementById("left-panel-item_panel-market");
            if (playerMarketPanel) {
                playerMarketPanel.click();
            }
            switch_panels('panel-player-market');

            const intervalId = setInterval(() => {
                // Check if the market table element is present
                const marketTable = document.getElementById("market-table");
                if (marketTable) {
                    // If it's present, clear the interval and execute function
                    clearInterval(intervalId);
                    Market.browse_get_table(dataItem);
                }
            }, 100);
        }
        //End Zlef

        applyTotalBuy() {
            const amount = this.parseIntKMBT($("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val());
            const price = this.parseIntKMBT($("#modal-market-purchase-item #modal-market-purchase-item-price-each").val().replace("Price each: ", ""));
            const total = amount*price;
            const totalElement = $("#modal-market-purchase-item-total");
            if(isNaN(total)) {
                totalElement.text("");
            }
            else {
                totalElement.text(total.toLocaleString());
                const coinsOwned = IdlePixelPlus.getVarOrDefault("coins", 0, "int");
                if(total > coinsOwned) {
                    totalElement.css("color", "red");
                }
                else {
                    totalElement.css("color", "");
                }
            }
        }

        currentItemSell() {
            return $("#modal-market-configure-item-to-sell").val();
        }

        applyOneAmountSell() {
            const item = this.currentItemSell();
            const owned = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            $("#modal-market-configure-item-to-sell-amount").val(Math.min(owned, 1));
            this.applyTotalSell();
        }

        applyMaxAmountSell(minus1=false) {
            const item = this.currentItemSell();
            let max = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            if(minus1) {
                max--;
            }
            if(max < 0) {
                max = 0;
            }
            $("#modal-market-configure-item-to-sell-amount").val(max);
            this.applyTotalSell();
        }

        applyMinPriceSell() {
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            $("#modal-market-configure-item-to-sell-price-each").val(min);
            this.applyTotalSell();
        }

        async applyLowestPriceSell() {
            var lowest = 100000000000;
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            const item = $("#modal-market-configure-item-to-sell-image").attr("src").match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
            const data = await this.fetchBrowseResult(item);
            lowest = Math.min(...data.map(datum => datum.market_item_price_each));
            $("#modal-market-configure-item-to-sell-price-each").val(Math.max(Math.min(lowest - 1, max), min));
            this.applyTotalSell();
        }

        applyMidPriceSell() {
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            const mid = Math.floor((min+max)/2);
            $("#modal-market-configure-item-to-sell-price-each").val(mid);
            this.applyTotalSell();
        }

        applyMaxPriceSell() {
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            $("#modal-market-configure-item-to-sell-price-each").val(max);
            this.applyTotalSell();
        }

        applyTotalSell() {
            const amount = this.parseIntKMBT($("#modal-market-configure-item-to-sell-amount").val());
            const price = this.parseIntKMBT($("#modal-market-configure-item-to-sell-price-each").val());
            const total = amount*price;
            if(isNaN(total)) {
                $("#modal-market-configure-item-to-sell-total").text("");
            }
            else {
                $("#modal-market-configure-item-to-sell-total").text(total.toLocaleString());
            }
            // TODO total w/ tax
        }

        seeMarketOnClick(sellSlotIndex) {
            try {
                const item = $(`#player-market-slot-item-image-${sellSlotIndex}`).attr("src").match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
                this.browseGetTable(item, true);
            } catch(err) {
                console.error(err);
            }
        }

        async fetchMarketHistory(item) {
            const timespanSelect = document.getElementById("history-chart-timespan");
            const timespan = timespanSelect.options[timespanSelect.selectedIndex].value;
            if(item === undefined)
                item = this.lastBrowsedItem;

            $("#history-chart-div").show();

            const response = await fetch(`${MARKET_HISTORY_URL}?item=${item}&range=${timespan}`);
            const data = await response.json();
            const splitData = this.splitHistoryData(data, timespan == "1d" ? "hours" : "days");

            // Create chart object if uninitialized
            if(this.historyChart === undefined){
                this.historyChart = new Chart($("#history-chart"), {
                    type: 'line',
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                grid: {
                                    color: "#77777744"
                                }
                            },
                            y: {
                                beginAtZero: false,
                                grid: {
                                    color: "#77777744"
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        }
                    }
                });
            }
            this.updateHistoryChart(splitData);
        }

        updateHistoryChart(data) {
            const averagePrices = data.map(datum => Math.round(datum.data.map(d => d.price * d.amount)
                                                                              .reduce((a, b) => a + b, 0) / datum.data.map(d => d.amount)
                                                                                                                      .reduce((a, b) => a + b, 0)));
            this.historyChart.options.plugins.tooltip.callbacks.footer = (tooltipItems) => {
                const amountsSum = data[tooltipItems[0].dataIndex].data.map(datum => datum.amount).reduce((a, b) => a + b, 0);
                return `Transaction Volume: ${amountsSum}`;
            }
            this.historyChart.data = {
                labels: data.map(datum => datum.date),
                datasets: [{
                    label: 'Lowest Price',
                    data: data.map(datum => Math.min(...datum.data.map(d => d.price))),
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineMin")
                },
                {
                    label: 'Average Price',
                    data: averagePrices,
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineAverage")
                },
                {
                    label: 'Highest Price',
                    data: data.map(datum => Math.max(...datum.data.map(d => d.price))),
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineMax")
                }]
            };
            this.historyChart.update();
        }

        splitHistoryData(data, bucketSize) {
            var splitData = [];
            data.history.forEach(datum => {
                let match;
                const date = new Date(datum.datetime);
                if(bucketSize == "days")
                    match = splitData.filter(dd => dd.date.getDate() == date.getDate() && dd.date.getMonth() == date.getMonth());
                else if(bucketSize == "hours")
                    match = splitData.filter(dd => dd.date.getHours() == date.getHours());
                if(match.length == 0) {
                    splitData.push({
                        date: date,
                        data: [{price: datum.price, amount: datum.amount}]
                    });
                } else {
                    match[0].data.push({price: datum.price, amount: datum.amount});
                }
            });
            if(bucketSize == "days")
                splitData.forEach(datum => datum.date = datum.date.toString().match(/^[a-zA-Z]+\s([a-zA-Z]+\s[0-9]{1,2})\s/)[1]);
            else if(bucketSize == "hours")
                splitData.forEach(datum => datum.date = `${datum.date.getHours()}h`);
            return splitData;
        }

        async getGlobalMarketHistoryAverages(timespan) {
            const historyResponse = await fetch(`${MARKET_HISTORY_URL}?item=all&range=${timespan}d`);
            this.marketAverages = await historyResponse.json()
                .then((data) => {
                    const sumDict = {};
                    const avgDict = {};
                    data.history.forEach(datum => {
                        sumDict[datum.item] = {
                            sum: sumDict[datum.item] ? sumDict[datum.item]?.sum + datum.price : datum.price,
                            length: sumDict[datum.item] ? sumDict[datum.item].length + 1 : 1,
                        }
                    });
                    Object.entries(sumDict).forEach(([item, datum]) => {
                        avgDict[item] = datum.sum / datum.length
                    });
                    return avgDict;
                });
        }

        createMarketWatcher() {
            const item = $("#modal-market-configure-item-watcher-label").text().toLowerCase().replace(/\s/g, "_");
            const value = $("#modal-market-configure-item-watcher-price-each").val();
            const lt_gt = $("#modal-market-configure-item-watcher-mode").val() == "1" ? "<" : ">";

            Modals.toggle("modal-market-configure-item-watcher");
            $("#modal-market-configure-item-watcher-ok-button").val("Create Watcher");

            if($("#market-watcher-div").find(`#watched-item-${item}`).length == 0) {
                this.createWatcherElement(item, value, lt_gt);
                $("#market-watcher-div").show();
            }
            else {
                $(`#watched-item-${item}-label`).text(`${lt_gt} ${value}`);
            }

            this.saveWatcherToLocalStorage(item, value, lt_gt);
            this.checkWatchers();
        }

        createWatcherElement(item, value, lt_gt) {
            $("#market-watcher-div").children().last().after(`
            <div id="watched-item-${item}" class="market-tradable-item p-1 m-1 hover shadow" style="background-color:#ffcccc">
                <div align="left" onclick='IdlePixelPlus.plugins.market.browseGetTable(\"${item}\", true); event.stopPropagation();'>
                    <img class="hover" src="${IMAGE_HOST_URL}/search_white.png" width="15px" height="15px" title="search_white">
                </div>
                <div onclick='IdlePixelPlus.plugins.market.watchedItemOnClick(\"${item}\");' style="margin-top: -15px;">
                <div style="display: block;">
                    <img src="${this.getItemIconUrl(item)}" width="50px" height="50px">
                </div>
                <div style="display: block;">
                    <img src="${COIN_ICON_URL}" title="coins">
                    <span class="market-watched-item" id="watched-item-${item}-label">${lt_gt} ${value}</span>
                </div>
                </div>
            </div>`);
        }

        deleteMarketWatcher(item) {
            $(`#watched-item-${item}`).remove();
            if($("#market-watcher-div").find(".market-watched-item").length == 0) {
                $("#market-watcher-div").hide();
            }
            this.removeWatcherFromLocalStorage(item);
        }

        configureItemWatcherModal(item, create) {
            const tradable = Market.tradables.find(t => t.item == item);
            $("#modal-market-configure-item-watcher-image").attr("src", this.getItemIconUrl(item));
            document.getElementById("modal-market-configure-item-watcher-label").textContent = Items.get_pretty_item_name(item);
            document.getElementById("modal-market-configure-item-watcher-low-limit").textContent = tradable.lower_limit;
            document.getElementById("modal-market-configure-item-watcher-high-limit").textContent = tradable.upper_limit;
            if(create){
                $("#modal-market-configure-item-watcher-price-each").val("");
                $("#modal-market-configure-item-watcher-mode").val("1");
                $("#modal-market-configure-item-watcher-ok-button").prop("value", `Create Watcher`);
                $("#modal-market-configure-item-watcher-cancel-button").prop("value", "Cancel");
                $("#modal-market-configure-item-watcher-cancel-button").attr("onclick", "");
            }
            else {
                $("#modal-market-configure-item-watcher-price-each").val($(`#watched-item-${item}-label`).text().match(/[0-9]+/)[0]);
                $("#modal-market-configure-item-watcher-mode").val($(`#watched-item-${item}-label`).text().match(/[><]/)[0] == "<" ? "1" : "2");
                $("#modal-market-configure-item-watcher-ok-button").prop("value", `Edit Watcher`);
                $("#modal-market-configure-item-watcher-cancel-button").prop("value", "Delete Watcher");
                $("#modal-market-configure-item-watcher-cancel-button").attr("onclick", `IdlePixelPlus.plugins.market.deleteMarketWatcher(\"${item}\")`);
            }
        }

        watchItemOnClick() {
            this.configureItemWatcherModal(this.lastBrowsedItem, true);
            Modals.toggle("modal-market-configure-item-watcher");
        }

        watchedItemOnClick(item) {
            this.configureItemWatcherModal(item, false);
            Modals.toggle("modal-market-configure-item-watcher");
        }

        checkWatchers() {
            const notification = document.getElementById("notification-market-watcher");
            const watchedItems = document.querySelectorAll(".market-watched-item");
            const promises = Array.from(watchedItems).map((async (watchedItem) => {
                const id = watchedItem.id;
                const item = id.match(/watched-item-([a-zA-Z0-9_]+)-label/)[1];
                const price = watchedItem.textContent.match(/[0-9]+/)[0];
                const lt_gt = watchedItem.textContent.match(/[><]/)[0];
                //console.log("Running watcher checks..");
                const response = await fetch(`../../market/browse/${item}/`);
                const data = await response.json();

                const sorted = data.map(datum => Math.floor(datum.market_item_price_each * 1.01)).toSorted((a, b) => a - b);
                if(sorted.length > 0 && (lt_gt === ">" && sorted[0] >= price) || (lt_gt === "<" && sorted[0] <= price)) {
                    document.getElementById(`watched-item-${item}`).style.backgroundColor = "#99ffcc";
                    return Promise.resolve();
                }
                else {
                    document.getElementById(`watched-item-${item}`).style.backgroundColor = "#ffcccc";
                    return Promise.reject();
                }
            }));
            Promise.any(promises).then(() =>
                notification.classList.remove("hide")
            ).catch(() =>
                notification.classList.add("hide")
            );
        }

        saveWatcherToLocalStorage(item, value, lt_gt) {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_WATCHERS);
            const newWatcher = {
                item: item,
                value: value,
                lt_gt: lt_gt
            };
            var jsonData = {};
            if(ls) {
                jsonData = JSON.parse(ls);
                jsonData.watchers = jsonData.watchers.filter(watcher => watcher.item !== item);
                jsonData.watchers.push(newWatcher);
            }
            else {
                jsonData = {
                    watchers: [newWatcher]
                };
            }
            localStorage.setItem(LOCAL_STORAGE_KEY_WATCHERS, JSON.stringify(jsonData));
        }

        removeWatcherFromLocalStorage(item) {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_WATCHERS);
            var jsonData = {};
            if(ls) {
                jsonData = JSON.parse(ls);
                jsonData.watchers = jsonData.watchers.filter(watcher => watcher.item !== item);
            }
            localStorage.setItem(LOCAL_STORAGE_KEY_WATCHERS, JSON.stringify(jsonData));
        }

        applyWatchersLocalStorage() {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_WATCHERS);
            if(ls) {
                const jsonData = JSON.parse(ls);
                if(jsonData.watchers && jsonData.watchers.length > 0) {
                    jsonData.watchers.forEach(watcher => {
                        this.createWatcherElement(watcher.item, watcher.value, watcher.lt_gt);
                    });
                    $("#market-watcher-div").show();
                }
            }
        }

        configureTableContextMenu(category) {
            const contextMenu = document.getElementById("market-sort-context-menu").getElementsByClassName("menu").item(0);
            for(let child of Array.from(contextMenu.querySelectorAll('li:not([id="context-menu-price-each-item"])'))) {
                child.remove();
            }
            if(category in CATEGORY_RATIOS) {
                for(let i = 0; i < CATEGORY_RATIOS[category].length; i++) {
                    contextMenu.innerHTML +=`<li id="context-menu-ratio-${i}" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-ratio-${i}\");'>
                                                <span> ${CATEGORY_RATIOS[category][i]}</span>
                                            </li>`;
                }
            }
            else if(this.lastSortIndex != 100) {
                this.lastSortIndex = 0;
                this.contextMenuChangeSelected("context-menu-price-each-item");
            }
            contextMenu.innerHTML +=`<li id="context-menu-negative-diff" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-negative-diff\");'>
                                        <span> Trending Value (7d)</span>
                                    </li>`;
            if(this.lastSortIndex == 0)
                this.contextMenuChangeSelected("context-menu-price-each-item");
            else if(this.lastSortIndex == 100)
                this.contextMenuChangeSelected("context-menu-negative-diff");
            else
                this.contextMenuChangeSelected(`context-menu-ratio-${this.lastSortIndex - 1}`);
        }

        contextMenuChangeSelected(menuItem) {
            const e = document.getElementById("market-sort-context-menu-selected");
            if(e)
                e.remove();
            document.getElementById(menuItem).innerHTML += `<span id="market-sort-context-menu-selected">&#x2714;</span>`;
        }

        contextMenuSelectOnClick(menuItem) {
            this.contextMenuChangeSelected(menuItem);
            let sortDataIndex = 0;

            if(menuItem == "context-menu-negative-diff")
                sortDataIndex = 100;
            else if(menuItem != "context-menu-price-each-item")
                sortDataIndex = parseInt(menuItem.replace(/[^0-9]/g, "")) + 1;
            this.sortTable(sortDataIndex);
            this.updateTable();
        }

        marketHeaderOnClick(event) {
            document.addEventListener("click", () => document.getElementById("market-sort-context-menu").style.display = "none", { once: true });

            var menu = document.getElementById("market-sort-context-menu");
            menu.style.display = 'block';
            menu.style.left = event.pageX + "px";
            menu.style.top = event.pageY + "px";

            event.stopPropagation();
        }

        async preloadMarketTradables() {
            const response = await fetch(MARKET_TRADABLES_URL);
            const data = await response.json();
            Market.tradables = data.tradables;
        }

        getItemIconUrl(item) {
            return `${IMAGE_HOST_URL}/${item}.png`;
        }

        createMarketLogPanel() {
            IdlePixelPlus.addPanel("market-log", "Market Log", function() {
                let content = `
                <div>
                    <table id="market-log-table" class="market-table mt-5" width="90%" style="min-width: 900px;" original-width="90%">
                    </table>
                </div>`;
                return content;
            });
            //document.getElementById("left-panel-achievements-btn").nextElementSibling.insertAdjacentHTML("afterend",
            document.getElementById("left-panel-item_panel-collection-log").nextElementSibling.insertAdjacentHTML("afterend",
            `<div id="left-panel-item_panel-market-log" onclick="switch_panels('panel-market-log')" class="hover hover-menu-bar-item left-menu-item">
                <table class="game-menu-bar-left-table-btn left-menu-item-quests-ach-loot" style="width:100%">
                    <tbody><tr>
                        <td style="width:30px;">
                            <img id="menu-bar-achievements-icon" class="w30" src="${IMAGE_HOST_URL}/player_market.png">
                        </td>
                        <td>
                            MARKET LOG
                        </td>
                    </tr>
                </tbody></table>
            </div>`);
        }

        storeLogPendingConfirmation(item, amount, price, type) {
            this.pendingConfirmationPurchaseLog = {
                item: item,
                amount: amount,
                price_each: price,
                transaction_type: type
            };
        }

        saveLogToLocalStorage(log) {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_LOG);
            const currentTime = new Date();
            log.timestamp = currentTime.toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', hour12: false, minute: '2-digit'});
            var jsonData = {};
            if(ls) {
                jsonData = JSON.parse(ls);
                jsonData.logs.unshift(log);
                if(jsonData.logs.length > LOCAL_STORAGE_LOG_LIMIT)
                    jsonData.logs = jsonData.logs.slice(0, LOCAL_STORAGE_LOG_LIMIT);
            }
            else {
                jsonData = {
                    logs: [log]
                };
            }
            localStorage.setItem(LOCAL_STORAGE_KEY_LOG, JSON.stringify(jsonData));
            this.applyLogLocalStorage();
        }

        applyLogLocalStorage() {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_LOG);
            let html = `<tr>
                            <th>ITEM</th>
                            <th style="width: 60px;"></th>
                            <th>AMOUNT</th>
                            <th>PRICE EACH</th>
                            <th>TOTAL</th>
                            <th>TRANSACTION</th>
                            <th>TIME</th>
                        </tr>`;
            if(ls) {
                const jsonData = JSON.parse(ls);
                if(jsonData.logs && jsonData.logs.length > 0) {
                    jsonData.logs.forEach(log => {
                        let rowHtml = `<tr>`;
                        rowHtml += `<td>${Items.get_pretty_item_name(log.item)}</td>`;
                        rowHtml += `<td style="width: 60px;"><img src="${IMAGE_HOST_URL}/${log.item}.png" /></td>`;
                        rowHtml += `<td>${log.amount}</td>`;
                        rowHtml += `<td><img src="${COIN_ICON_URL}" /> ${log.price_each}`;
                        rowHtml += `<td><img src="${COIN_ICON_URL}" /> ${log.price_each * log.amount}`;
                        rowHtml += `<td>${log.transaction_type}</td>`;
                        rowHtml += `<td>${log.timestamp}</td>`;
                        rowHtml += `</tr>`;
                        html += rowHtml;
                    });
                }
            }
            document.getElementById("market-log-table").innerHTML = html;
        }

        deleteLogLocalStorage() {
            localStorage.setItem(LOCAL_STORAGE_KEY_LOG, "");
        }

        onPanelChanged(before, after) {
            if (before != after && after === 'market-log') {
                document.getElementById("panel-market-log").style.paddingLeft = "20px";
                //could be moved, only needs to be once after panel has been created
            }
            if (before != after && before === 'market-log') {
                document.getElementById(`left-panel-item_panel-${before}`).style.border = "";
            }
        }
    }

    const plugin = new MarketPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();