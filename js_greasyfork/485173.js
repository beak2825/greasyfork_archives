// ==UserScript==
// @name         GGn Collection Crawler
// @namespace    none
// @version      1.3.2.1
// @author       ingts, Sharkendon
// @description  Searches websites found in group page and lists possible collections and tags from their info
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/collections.php*
// @match        https://steamdb.info/app/*
// @require      https://update.greasyfork.org/scripts/541342/GGn%20Corner%20Button.js
// @connect      store.steampowered.com
// @connect      dlsite.com
// @connect      pcgamingwiki.com
// @connect      api.vndb.org
// @connect      mobygames.com
// @connect      itch.io
// @connect      wikipedia.org
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485173/GGn%20Collection%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/485173/GGn%20Collection%20Crawler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : undefined)();
function promiseXHR(url, options = {}) {
        if (!Object.hasOwn(options, 'timeout'))
            options.timeout = 10000;

        return new Promise((resolve, reject) => {
            _GM_xmlhttpRequest({
                url,
                ...options,
                onabort: (response) => {
                    reject(response);
                },
                onerror: (response) => {
                    reject(response);
                },
                ontimeout: (response) => {
                    reject(response);
                },
                onload: (response) => {
                    resolve(response);
                },
            });
        })
    }
function getSettings(array) {
        const obj = {};

        for (const [key, defaultVal] of array) {
            let gmValue = GM_getValue(key);
            if (typeof gmValue === 'undefined') {
                GM_setValue(key, defaultVal);
                obj[key] = defaultVal;
                continue
            }
            obj[key] = gmValue;
        }

        return obj
    }
    const ggnToVndbPlatform = new Map([
        ["Windows", "win"],
        ["Linux", "lin"],
        ["Mac", "mac"],
        ["3DO", "tdo"],
        ["iOS", "ios"],
        ["Android", "and"],
        ["DOS", "dos"],
        ["Dreamcast", "drc"],
        ["NES", "nes"],
        ["SNES", "sfc"],
        ["Game Boy Advance", "gba"],
        ["Game Boy Color", "gbc"],
        ["MSX", "msx"],
        ["Nintendo DS", "nds"],
        ["Switch", "swi"],
        ["Wii", "wii"],
        ["Wii U", "wiu"],
        ["Nintendo 3DS", "n3d"],
        ["NEC PC-98", "p98"],
        ["NEC TurboGrafx-16", "pce"],
        ["NEC PC-FX", "pcf"],
        ["PlayStation Portable", "psp"],
        ["PlayStation 1", "ps1"],
        ["PlayStation 2", "ps2"],
        ["PlayStation 3", "ps3"],
        ["PlayStation 4", "ps4"],
        ["PlayStation 5", "ps5"],
        ["PlayStation Vita", "psv"],
        ["Mega Drive", "smd"],
        ["Saturn", "sat"],
        ["Sharp X1", "x1s"],
        ["Sharp X68000", "x68"],
        ["Xbox", "xb1"],
        ["Xbox 360", "xb3"],
    ]);

    const DLsiteThemes = new Map([
        [431, 8817],
[432, 856],
[71, 131],
[508, 3813],
[240, 6702],
[513, 10481],
[48, 5844],
[302, 5845],
[529, 5846],
[159, 9693],
[8, 4502],
[190, 3039],
[175, 3031],
[161, 4908],
[414, 586],
[175, 3031],
[156, 5366],
[162, 11642],
[113, 5129],
[115, 5129],
[158, 3032],
[118, 3032],
[239, 2862],
[317, 2862],
[506, 2862],
[184, 2862],
[237, 2862],
[303, 5214],
[244, 5214],
[111, 5214],
[250, 5214],
[245, 5214],
[37, 3033],
[47, 3033],
[119, 3033],
[526, 10555],
[325, 10555],
[534, 3185],
[211, 3185],
[163, 6233],
[324, 6233],
[490, 6233],
[239, 6233],
[317, 6233],
[184, 6233],
[207, 3041],
[531, 3041],
[85, 3041],
[157, 11751],
[139, 11754],
[46, 11769],
[444, 11770],
[533, 11801],
[519, 10392],
[129, 12669],
[132, 12669],
]);

    const DlsiteThemesExtra = new Map([
        [115, 5366],
    ]);
const DLsiteFeatures = new Map([
        [73, 9461],
    ]);
const themesMap = new Map([
        [49, "MOMA's Video Game Collection"],
        [62, "English Translated Visual Novels"],
        [68, "Touhou Project Fangames"],
        [74, "A Decade In Gaming"],
        [76, "The Ultimate wipEout Music Collection"],
        [84, "The Superlative Suikoden Music Collection"],
        [88, "Classic World of Darkness"],
        [89, "World of Darkness (aka New World of Darkness)"],
        [94, "Neo Geo Online Collection"],
        [102, "Bit.Trip Music Collection"],
        [103, "Undubbed Games"],
        [106, "The Legend of Heroes Music Collection"],
        [130, "LGBTQ Characters in Games"],
        [131, "Isometric (Parallel Projection/Axonometric)"],
        [143, "Low-end PC Games rated above 70% on Metacritic"],
        [152, "Early Access"],
        [155, "Metroidvania"],
        [156, "Free (Freeware) Games"],
        [164, "Crowdfunded"],
        [192, "Tycoon Simulators"],
        [289, "Games Based on TV Shows"],
        [354, "Video games that inspired Uwe Boll"],
        [459, "GLaDOS"],
        [585, "Post-Apocalyptic"],
        [586, "Zombie Games"],
        [623, "Dancing Games"],
        [624, "Political and Government Simulation Games"],
        [673, "World War II"],
        [683, "Virtual Reality (VR) Only"],
        [853, "Games for Non-Gamers"],
        [856, "Female Protagonist"],
        [881, "Denuvo Cracked"],
        [902, "Procedural Generation"],
        [911, "Middle-Earth"],
        [997, "No-Intro"],
        [998, "Redump"],
        [1006, "Automation"],
        [1034, "Multicart Games"],
        [1035, "Denuvo Uncracked"],
        [1049, "[MP3] released soundtracks"],
        [1050, "[FLAC] needed soundtracks"],
        [1062, "Free OSTs"],
        [1072, "Pre-injected CIA Virtual Console Torrents"],
        [1098, "Online Only Games"],
        [1106, "The Magnificent Mega Man Music Medley"],
        [1111, "Sega Forever"],
        [1112, "Denuvo Removed"],
        [1123, "Vaporwave"],
        [1157, "Interactive Movie"],
        [1232, "Japanese Role-Playing Games"],
        [1536, "Games Removed From Steam"],
        [1692, "Native English Visual Novels"],
        [1763, "Games Removed From GOG"],
        [1793, "Eroge (18+)"],
        [1794, "Nukige (18+)"],
        [1989, "H.P. Lovecraft inspired games"],
        [2333, "[UWP] Universal Windows Platform Cracked"],
        [2380, "Permadeath"],
        [2515, "Forgotten Realms"],
        [2832, "Cel shading games"],
        [2862, "Monster Girls"],
        [3025, "World War I"],
        [3031, "Catgirls"],
        [3032, "Yuri"],
        [3033, "Yaoi"],
        [3034, "Kemonomimi"],
        [3035, "Otome"],
        [3039, "Futanari"],
        [3041, "Loli"],
        [3142, "[UWP] Universal Windows Platform Uncracked"],
        [3169, "Steampunk"],
        [3185, "Shota"],
        [3232, "Original Xbox Exclusives"],
        [3267, "PlayStation 2 Exclusives"],
        [3497, "Full Motion Video"],
        [3605, "PlayStation Minis"],
        [3622, "Cyberpunk"],
        [3624, "Final Fantasy Music"],
        [3681, "Games in Black and White"],
        [3721, "Anthropomorphic Animals"],
        [3729, "Games Based on Anime, Manga, or Light Novels"],
        [3813, "Turn Based Combat"],
        [3933, "Free (Libre) Games"],
        [3994, "Vampire"],
        [4033, "ACA Neo Geo"],
        [4086, "Flying"],
        [4138, "Uncensored Games"],
        [4364, "Free Applications"],
        [4365, "Free (Libre) Applications"],
        [4502, "Slice of Life"],
        [4506, "12 days of Christmas 2018"],
        [4624, "Touhou Music"],
        [4859, "Villain Protagonist"],
        [4908, "Scatological"],
        [4924, "Halloween"],
        [5078, "Episodic Story"],
        [5129, "Rape Fantasy (18+)"],
        [5144, "Atmospheric Adventures"],
        [5148, "Out of Early Access"],
        [5160, "Games With an Unofficial English Translation"],
        [5174, "Olympic Games"],
        [5214, "Gender Benders"],
        [5287, "Mecha"],
        [5366, "Female Domination / Dominatrix games (18+)"],
        [5445, "Epic Games Store Exclusives"],
        [5498, "Physics Based Games"],
        [5515, "Middle Ages (Medieval period)"],
        [5690, "Alicesoft Sound Album"],
        [5711, "Souls-Like"],
        [5715, "Sega Mega Drive and Genesis Classics"],
        [5785, "Nakige"],
        [5786, "Utsuge"],
        [5844, "Netorare"],
        [5845, "Netori"],
        [5846, "Netorase"],
        [5940, "Controller Only"],
        [5976, "EA Originals"],
        [6012, "Norse Mythology"],
        [6025, "Asian-Only Games With English Language Support"],
        [6061, "Games With Backer-Created Content"],
        [6109, "Animal Protagonist"],
        [6125, "Western"],
        [6233, "Bestiality (18+)"],
        [6329, "Exa_Pico Universe"],
        [6336, "Nasuverse"],
        [6370, "12 Days of Christmas 2019"],
        [6402, "Pirates"],
        [6440, "Oculus Originals"],
        [6448, "3DCG"],
        [6453, "Dinosaurs"],
        [6550, "PlayStation Vita Exclusives"],
        [6556, "Rail Shooter"],
        [6589, "Games of the Decade"],
        [6646, "Vietnam War"],
        [6693, "God Game"],
        [6701, "Gyaru"],
        [6702, "Magical Girl"],
        [6708, "Surrealism"],
        [6751, "Outer Space"],
        [6803, "Cold War"],
        [6826, "Games Based on Movies"],
        [6829, "Macro Environment"],
        [6865, "Games Removed From Google Play"],
        [6870, "Worlds of power"],
        [7039, "Card Battler"],
        [7043, "Never-Ending"],
        [7060, "Grappling Hook"],
        [7068, "Homebrew/Late Release"],
        [7079, "Games Removed From Xbox Games Store"],
        [7090, "PlayStation 4 Exclusives"],
        [7113, "Abandonware (for Windows)"],
        [7157, "Games Bundled With Cereal"],
        [7194, "PlayStation 3 Exclusives"],
        [7210, "Train Simulation"],
        [7264, "Alice Sound Collection"],
        [7424, "Street Fighter EX"],
        [7427, "SNK vs. Capcom"],
        [7466, "English Voiced Visual Novels"],
        [7472, "Furry"],
        [7498, "Namco Game Sound Express"],
        [7554, "Indie Live Expo Featured Games"],
        [7563, "Asian exclusive Xbox titles"],
        [7567, "Banned in Australia"],
        [7590, "Nintendo 64 Exclusives"],
        [7628, "Xbox 360 Exclusives"],
        [7674, "Games Featuring Snoop Dogg"],
        [7677, "Evil Ryu Appearances"],
        [7678, "Wu-Tang Clan Appearances"],
        [7694, "Adware as a video game"],
        [7700, "Hulk Hogan Appearances"],
        [7701, "Shaquille O'Neal Appearances"],
        [7713, "Michael Jackson Appearances"],
        [7809, "Polygon Top 100 Best Games of All Time (2017)"],
        [7826, "Cats"],
        [7828, "Edgar Allan Poe inspired games"],
        [7831, "Bara"],
        [7837, "Games with Radio-Controlled Cars"],
        [7870, "Games With an Unofficial Chinese Translation"],
        [7900, "12 Days of Christmas 2020"],
        [7912, "Microphone Required"],
        [7939, "Video Game Soundtracks on Vinyl"],
        [7955, "Art Games"],
        [7996, "Experimental Gameplay"],
        [8035, "Interwar Period"],
        [8036, "Nintendo Switch 2020 Indie Game Highlights"],
        [8061, "PlayStation 2 Classics for PlayStation 4"],
        [8089, "Banned in China"],
        [8091, "Banned in India"],
        [8097, "Games with Decompilation Projects"],
        [8114, "Psychedelia"],
        [8122, "WiiWare"],
        [8136, "Ross's Game Dungeon"],
        [8146, "Namco Video Game Graffiti"],
        [8155, "Dieselpunk"],
        [8194, "Tanks"],
        [8195, "Naval"],
        [8200, "Games Based on Novels, Novellas and Short Stories"],
        [8307, "Gambling"],
        [8524, "Pre-installed Mac games"],
        [8817, "Pixel Graphics"],
        [8838, "Voxel Art"],
        [8852, "Powered by the Apocalypse"],
        [8913, "Clay Animation"],
        [8933, "Games with Designer's Name in Title"],
        [9150, "Games Based on Comics"],
        [9188, "Alpha/beta builds"],
        [9238, "Ancient Egypt"],
        [9356, "Virtual Console"],
        [9409, "Final Fantasy Pixel Remaster"],
        [9413, "Hissatsu Slot"],
        [9426, "Game Crossovers"],
        [9441, "Dead Before Release"],
        [9452, "Apple Arcade"],
        [9498, "Chernobyl Exclusion Zone"],
        [9617, "Voice Control"],
        [9626, "Nintendo Switch Exclusives"],
        [9628, "Free E-Books"],
        [9666, "Hacking"],
        [9669, "Windows 10 Only"],
        [9693, "Urophilia"],
        [9711, "Halo Novels"],
        [9729, "Mental Disorder"],
        [9772, "Grand Theft Auto: The Trilogy – The Definitive Edition"],
        [9788, "Let's Drown Out"],
        [9805, "Motorcycles"],
        [9814, "Underwater"],
        [9819, "The Powerpuff Girls"],
        [9820, "Moe"],
        [9821, "Ant Games"],
        [9824, "Backgammon Games"],
        [9826, "Sudoku Games"],
        [9831, "Stalin Games"],
        [9837, "Robin Hood "],
        [9838, "Hellboy"],
        [9839, "Truck Games"],
        [9840, "Titanic"],
        [10145, "Dreamcast Exclusives"],
        [10166, "Atari Lynx Collection"],
        [10320, "Machine Translation"],
        [10326, "2.5D"],
        [10342, "Clive Barker"],
        [10392, "Transported to Another World"],
        [10445, "Nonogram"],
        [10464, "Mars"],
        [10481, "V-Tuber (Virtual YouTuber)"],
        [10496, "Native Russian Visual Novels"],
        [10555, "Corruption (18+)"],
        [10563, "Steam Deck Verified"],
        [10638, "Child Protagonist"],
        [10641, "PC Ports by Decompilation"],
        [10666, "Video Game Remakes"],
        [10673, "Native Chinese Visual Novels"],
        [10744, "Biopunk Games"],
        [10858, "Kaiju"],
        [10864, "Epic MegaGrants"],
        [10887, "Vertical Shoot 'em ups"],
        [10918, "Native Korean Visual Novels"],
        [10931, "Cosa Nostra"],
        [10934, "Atari Recharged"],
        [10942, "AO-rated video games (ESRB)"],
        [10954, "MoMA: Never Alone - Video Games and Other Interactive Design"],
        [10963, "Reverse Tower Defense"],
        [10964, "Tug of War Strategy"],
        [10965, "Lane Defense"],
        [10966, "Boss Rush"],
        [10970, "(Incremental games with story / Complicated Clicker"],
        [10973, "Hand-drawn graphics"],
        [10980, "Xbox PC Game Pass"],
        [10981, "Point and Click: Adventure games"],
        [10988, "Unsearchable Games"],
        [11152, "Fables Mosaic"],
        [11241, "Found Footage"],
        [11255, "Hentai Expo 2023"],
        [11256, "Hentai Expo 2022"],
        [11261, "Nintendo VS. System"],
        [11272, "HGG2D Translated Game Archive"],
        [11277, "Photography games"],
        [11286, "Games for Learning Japanese"],
        [11289, "Guild 3DS Game Series"],
        [11294, "Games Removed From DLSite"],
        [11296, "Slavic Mythology"],
        [11305, "Banned in Germany"],
        [11320, "Horizontal Shoot 'em ups"],
        [11334, "Modern Board Game Adaptations"],
        [11336, "Censored Games"],
        [11341, "Avoidable Netorare"],
        [11350, "Chibi"],
        [11355, "Kinetic Novels"],
        [11379, "Scott Adams' Graphic Adventure Collection"],
        [11385, "PlayStation Portable Exclusives"],
        [11386, "Sega Saturn Exclusives"],
        [11398, "Space Pirates"],
        [11477, "Games With an Unofficial Korean Translation"],
        [11484, "3D Platformers"],
        [11506, "Deciphering Symbols/Languages/Number Systems"],
        [11519, "My Little Pony Fangames"],
        [11545, "Metal Gear Solid: Master Collection Vol.1"],
        [11546, "Club Nintendo rewards"],
        [11554, "Flying Character"],
        [11571, "SsethTzeentach's Featured Games"],
        [11615, "Nintendo Gamecube Exclusives"],
        [11642, "Tentacles (18+)"],
        [11751, "Hypnosis (18+)"],
        [11754, "Chikan (18+)"],
        [11769, "Harem"],
        [11770, "Time Stop"],
        [11781, "Wii U Exclusives"],
        [11800, "Set in a Death Game/Battle Royale"],
        [11801, "Combat Sex (18+)"],
        [11805, "Incest"],
        [11808, "Games Based on The Bible"],
        [11811, "Love Triangle"],
        [11820, "Prehistory"],
        [11822, "Unreleased/Cancelled Games (Only Available as Prototypes/Early Beta)"],
        [11827, "Traditional Roguelikes"],
        [11829, "AI Generated Art"],
        [11830, "Asset Flip"],
        [12086, "Games Based on Folklore/Fables"],
        [12089, "Greek Mythology"],
        [12096, "Vikings"],
        [12098, "Quick Time Events"],
        [12124, "Tricks"],
        [12127, "Twin stick Shoot'em ups"],
        [12146, "Werewolves"],
        [12235, "Political-themed Games"],
        [12236, "Aliens"],
        [12241, "PSX Style Horror Games"],
        [12475, "Robot/Android Protagonist"],
        [12668, "Parkour"],
        [12669, "Pregnancy (18+)"],
        [12914, "Fishing Minigame"],
        [13018, "Feudal Japan"],
        [13441, "Dystopian"],
        [13685, "Time Loop"],
        [13763, "Wii Exclusives"],



[14038, "Clothing Destruction"],
        [14039, "Day/Night Cycle"],
    ]);

    const adultThemes = new Set(
        [1793, 1794, 3039, 3041, 3185, 4908, 5129, 5366, 5844, 5845, 5846, 6233, 7831, 11341, 11642, 11751, 11754, 11769, 117770, 11801, 11805, 12669]
    );

    const enginesMap = new Map([
        ["Creation Engine", 175],
        ["ScummVM", 199],
        ["Unreal Engine", 245],
        ["REDengine", 252],
        ["Chrome Engine", 256],
        ["Rockstar Advanced Game Engine", 261],
        ["Unity", 263],
        ["Source", 265],
        ["Anvil", 290],
        ["CryEngine", 388],
        ["Dunia Engine", 389],
        ["Refractor Engine", 400],
        ["RenderWare", 405],
        ["UbiArt Framework", 410],
        ["LithTech", 412],
        ["Frostbite", 413],
        ["Adventure Game Studio (AGS)", 438],
        ["IW engine", 439],
        ["Build", 487],
        ["Telltale Tool", 507],
        ["PhysX Engine", 508],
        ["Ego Game Technology Engine", 509],
        ["Gamebryo", 510],
        ["Havok", 512],
        ["Multimedia Fusion (Clickteam Fusion)", 516],
        ["PhyreEngine", 520],
        ["Autodesk Stingray Engine", 538],
        ["GameMaker: Studio", 562],
        ["Fox Engine", 583],
        ["Ren'Py", 584],
        ["Monkey X", 588],
        ["4A Engine", 612],
        ["Infinity", 620],
        ["Unigine", 621],
        ["Microsoft XNA", 622],
        ["GoldSrc", 632],
        ["Vision", 634],
        ["Adobe Flash", 657],
        ["Adobe AIR", 658],
        ["Clausewitz Engine", 659],
        ["Irrlicht Engine", 660],
        ["Moai", 661],
        ["Sierra's Creative Interpreter (SCI)", 666],
        ["HPL Engine", 689],
        ["Visionaire", 693],
        ["Serious Engine", 702],
        ["Saber 3D Engine", 705],
        ["Road Hog Engine", 713],
        ["Silk Engine", 766],
        ["FNA", 789],
        ["id Tech 1 (Doom Engine)", 934],
        ["id Tech 2 (Quake Engine)", 935],
        ["id Tech 3 (Quake III Arena Engine)", 936],
        ["id Tech 4 (Doom 3 Engine)", 937],
        ["id Tech 5", 938],
        ["id Tech 6", 939],
        ["Nitrous", 945],
        ["RPG Maker", 1054],
        ["Northlight", 1079],
        ["Snowdrop", 1080],
        ["Dusk of the Gods Engine", 1135],
        ["jMonkeyEngine", 1149],
        ["Construct", 1250],
        ["KiriKiri", 1251],
        ["Crystal Tools", 1252],
        ["Vicious Engine", 1255],
        ["Torque", 1256],
        ["OGRE", 1257],
        ["MT Framework", 1258],
        ["Glacier", 1272],
        ["Virtual Theatre", 1445],
        ["Luminous Studio", 1454],
        ["libGDX", 1458],
        ["Decima", 1652],
        ["HydroEngine", 1835],
        ["DOSBox", 1880],
        ["Shine Engine", 2026],
        ["YU-RIS", 2159],
        ["LWJGL", 2196],
        ["Cocos2d", 2209],
        ["Treyarch NGL", 2219],
        ["Storm3D", 2231],
        ["Dark Alliance Game Engine", 2305],
        ["Jade", 2365],
        ["MonoGame", 2397],
        ["Dagor", 2398],
        ["mkxp", 2406],
        ["Infernal Engine", 2455],
        ["Buddha", 2477],
        ["Visual Novel Maker", 2589],
        ["LÖVE", 2692],
        ["Stencyl", 2708],
        ["Wintermute", 2753],
        ["MADNESS Engine", 2803],
        ["Enigma Engine (Blitzkrieg Engine)", 2877],
        ["YETI", 3105],
        ["ForzaTech", 3165],
        ["Box2D", 3187],
        ["Reaper", 3212],
        ["Quest3d", 3326],
        ["SAGE", 3374],
        ["Godot", 3384],
        ["Retro Engine", 3389],
        ["Nerlaska", 3418],
        ["ONScripter", 3501],
        ["3D Gamestudio", 3515],
        ["Diesel", 3518],
        ["NeoAxis", 3726],
        ["Darkplaces Engine", 3743],
        ["Slayer", 3765],
        ["Iriszoom", 3789],
        ["Wolf RPG Editor", 3818],
        ["Hexa Engine", 3827],
        ["Schmetterling", 3847],
        ["Corona", 3860],
        ["Cobra", 3877],
        ["Warscape", 3923],
        ["Phoenix3D", 4038],
        ["Asura", 4078],
        ["Gem", 4145],
        ["Evolution", 4195],
        ["Sith", 4198],
        ["Adobe Director", 4219],
        ["Apex", 4355],
        ["Wine", 4402],
        ["Ptero-Engine", 4468],
        ["Vector Engine", 4557],
        ["Genome", 4606],
        ["LyN", 4710],
        ["Essence Engine", 4772],
        ["Invictus Engine", 4878],
        ["NintendoWare Bezel Engine", 4911],
        ["RE Engine", 4912],
        ["Bluepoint", 5076],
        ["Real Virtuality", 5093],
        ["VRage", 5101],
        ["CloakNT", 5142],
        ["Iron Engine", 5228],
        ["Heaps", 5265],
        ["Void Engine", 5271],
        ["Vicious Engine 2", 5346],
        ["TheEngine", 5511],
        ["Traktor", 5523],
        ["Slipspace Engine", 5549],
        ["id Tech 7", 5558],
        ["Alchemy", 5575],
        ["Source 2", 5631],
        ["Kex Engine", 5767],
        ["HaxeFlixel", 5852],
        ["retouch", 5866],
        ["RealLive", 5867],
        ["CatSystem2", 5868],
        ["SiglusEngine", 5869],
        ["QLiE", 5873],
        ["Artemis Engine", 5880],
        ["AbbeyCore", 5962],
        ["OpenFL", 5983],
        ["Beard", 5999],
        ["NW.js", 6049],
        ["SCUMM", 6243],
        ["Kt (HD)", 6297],
        ["BlueStacks", 6371],
        ["Spark Casual Engine", 6446],
        ["GlyphX", 6580],
        ["Kt Engine", 6605],
        ["Orochi Engine", 6620],
        ["N2System", 6633],
        ["TOSHI", 6781],
        ["Genie", 6786],
        ["Touhou Danmakufu", 6868],
        ["Voxel Space", 6869],
        ["Open Dynamics Engine", 6884],
        ["TyranoScript", 7072],
        ["Ignite", 7139],
        ["Falco Engine", 7272],
        ["Virtools", 7342],
        ["XnGine", 7444],
        ["Ethornell", 7479],
        ["Nova Engine", 7530],
        ["Wolf3D", 7638],
        ["X-Ray Engine", 7850],
        ["Foundation Engine", 8502],
        ["Disrupt", 8507],
        ["Groovie", 8899],
        ["Titanium", 9139],
        ["Pico-8", 9302],
        ["EntisGLS", 9310],
        ["SystemAoi", 9316],
        ["Litiengine", 9327],
        ["Lectrote", 9335],
        ["Majiro", 9385],
        ["RealSpace", 9499],
        ["Ansel", 9501],
        ["Nsight Aftermath", 9502],
        ["FMOD", 9503],
        ["Adventure Game Interpreter (AGI)", 9543],
        ["Amazon Lumberyard", 9637],
        ["LiveMaker", 9657],
        ["AGOS", 9665],
        ["Dawn Engine", 9714],
        ["CodeX RScript", 9789],
        ["System-NNN", 9843],
        ["Kinetica Engine", 9857],
        ["Freescape", 10149],
        ["Stuff Script Engine", 10321],
        ["Wwise", 10396],
        ["Cinématique", 10408],
        ["Insomniac Engine", 10615],
        ["CTG", 10659],
        ["Defold", 10819],
        ["Omni3D", 10836],
        ["Pygame", 10845],
        ["Inglish", 10848],
        ["GDevelop", 10867],
        ["SoLoud", 11092],
        ["3D Octane", 11114],
        ["Pixel Game Maker MV", 11285],
        ["SRPG Studio", 11335],
        ["Silky Engine", 11372],
        ["OpenAL", 11411],
        ["Blender Game Engine", 11423],
        ["Solar2D", 11458],
        ["VOCALOID", 11523],
        ["Divinity Engine", 11613],
        ["mTropolis", 11815],
        ["Phaser Engine", 11882],
        ["Katana Engine", 12445],
        ["RapidFire", 12521],
        ["Simplygon", 12581],
        ["Miles Sound System", 12588],
        ["SpeedTree", 12641],
        ["Morpheme", 12652],
        ["Umbra 3", 12655],
        ["Zouna", 12666],
        ["Prism3D", 12671],
        ["ShiVa3D", 12754],
        ["Mages. Engine", 12761],
        ["Blazing Render", 12762],
        ["BlitzTech", 12879],
        ["AppGameKit Studio", 12937],
        ["The Forge", 12979],
        ["AppGameKit Studio", 12937],
        ["id Tech 8", 12988],
        ["INSANE", 13116],
        ["Carbon Engine", 13240],
        ["iFAction Game Maker", 13266],
        ["Genesis3D", 13414],
        ["PathEngine", 13454],
        ["Beast", 13455],
        ["Scaleform GFx", 13459],
        ["Bink Video", 13468],
        ["Newton Game Dynamics", 13657],
        ["EngineX", 13665],
        ["ImpactJS", 13700],
        ["Starling Framework", 13751],
        ["CRIWare", 13752],
        ["Demonware", 13753],
        ["Electron", 13754],
["GODS", 13783],
        ["Rendez-Vous", 13799],
        ["NGUI", 13812],
        ["RSD Game-Maker", 13815],
        ["Pie in the Sky", 13825],
        ["MVP GameBuilder", 13857],
        ["NVIDIA GameWorks", 14003],
        ["FairFight", 14005],
    ]);
const featuresMap = new Map([
        [23, "Cracked Online Multiplayer"],
        [39, "Games For Windows: LIVE"],
        [77, "LAN Compatible"],
        [201, "Instrument Controller Support"],
        [472, "2-Player Split Screen Multiplayer"],
        [473, "4-Player Split Screen Multiplayer"],
        [474, "Hackable Split Screen Multiplayer"],
        [475, "Single Screen Hot-Seat Multiplayer"],
        [476, "Single Screen Multiplayer"],
        [551, "Native Controller Support"],
        [559, "Virtual Reality (VR) Support"],
        [628, "NVIDIA 3D Vision Ready"],
        [738, "Oculus Rift Support"],
        [739, "HTC Vive Support"],
        [961, "Co-Op Support"],
        [962, "Local Co-op support"],
        [963, "Local Multiplayer"],
        [968, "OSVR Support"],
        [1074, "EyeToy Support"],
        [1105, "Kinect Support"],
        [1114, "Virtuix Omni Support"],
        [1115, "Cyberith Virtualizer Support"],
        [1116, "Oculus Touch Support"],
        [1117, "Seated VR Support"],
        [1118, "Standing VR Support"],
        [1119, "Room-Scale VR Support"],
        [1409, "Amiibo Support"],
        [1526, "Microtransactions"],
        [1608, "Buzz! buzzers"],
        [1670, "PlayStation Move Support"],
        [1671, "PlayStation Eye Support"],
        [1809, "Windows Mixed Reality Support"],
        [1884, "Tracked Motion Controllers"],
        [2487, "Direct Online Multiplayer"],
        [3345, "Touch-Friendly Desktop Games"],
        [3751, "Long-Wait Turn-Based Multiplayer"],
        [4141, "Tobii Eye Tracking"],
        [4795, "OpenVR"],
        [5200, "Light Gun Support"],
        [5407, "Crossplay LAN compatible"],
        [5679, "Valve Index Support"],
        [5913, "Level Editor"],
        [6823, "PlayStation Camera Support"],
        [6824, "PlayStation VR Support"],
        [6900, "Nvidia RTX Support"],
        [7176, "Massively Multiplayer Online Game"],
        [7339, "PlayLink for PS4"],
        [7477, "Big Head Mode"],
        [7649, "RetroAchievements Compatible"],
        [7671, "Xbox Live Vision"],
        [9461, "Animated Scenes"],
        [9718, "Power Pad/Family Trainer Support"],
        [9787, "Nucleus Co-op supported games"],
        [10393, "DK Bongo controller support "],
        [10604, "NVIDIA DLSS Support"],
        [10653, "Steering Wheel Support"],
        [11091, "uDraw GameTablet Support"],
        [11327, "Pocketstation"],
        [11405, "Dreamcast Live Compatible"],
        [11486, "AMD FSR Support"],
        [11547, "Intel XeSS Support"],
        [11661, "Oculus Quest 2"],
        [11935, "Starpath Supercharger"],
        [12428, "Photo Mode"],
        [12520, "Colorblind Mode"],
        [13726, "System Time Events"],
        [13748, "Developer Commentary"],
        [13860, "2600 Paddle Controller"],
        [13933, "TrackIR Support"],
    ]);

    const franchises = [
        [3, "Need for Speed "],
        [14, "Doom"],
        [16, "Diablo"],
        [19, "Resident Evil"],
        [29, "The Sims"],
        [32, "Hitman"],
        [42, "Lego"],
        [50, "Sonic the Hedgehog"],
        [52, "The Legend of Zelda"],
        [53, "Final Fantasy"],
        [55, "Mario"],
        [57, "Halo"],
        [58, "Mass Effect"],
        [64, "Castlevania"],
        [65, "Call of Duty"],
        [75, "Pokémon"],
        [87, "Teenage Mutant Ninja Turtles"],
        [91, "Cthulhu Mythos"],
        [96, "James Bond 007"],
        [97, "Black ★ Rock Shooter"],
        [100, "Rayman"],
        [126, "Star Trek"],
        [135, "Star Wars"],
        [179, "The Witcher"],
        [197, "Command & Conquer"],
        [198, "Tomb Raider"],
        [202, "Tom Clancy"],
        [203, "The Walking Dead"],
        [211, "Portal"],
        [215, "Angry Birds"],
        [335, "Gears of War"],
        [343, "Spyro the Dragon"],
        [344, "Crash Bandicoot"],
        [358, "Kirby"],
        [360, "Mega Man"],
        [414, "Dragon Quest"],
        [415, "Dragon Ball"],
        [417, "Mortal Kombat"],
        [420, "Monster Hunter"],
        [421, "Prince of Persia"],
        [428, "Puzzle Bobble"],
        [433, "Barbie"],
        [491, "StarCraft"],
        [498, "Might and Magic"],
        [499, "Total War"],
        [546, "Sakura"],
        [547, "Shadowrun"],
        [571, "Serious Sam"],
        [587, "Hyperdimension Neptunia"],
        [595, "Donkey Kong"],
        [606, "Dune"],
        [610, "One Piece"],
        [618, "Tetris"],
        [631, "Muv-Luv"],
        [643, "Minecraft"],
        [645, "Formula One (F1)"],
        [646, "Metal Slug"],
        [675, "NASCAR"],
        [676, "Batman"],
        [736, "Ghostbusters"],
        [737, "Jurassic Park"],
        [775, "Indiana Jones"],
        [780, "The Matrix"],
        [801, "Megami Tensei"],
        [828, "Alien"],
        [829, "Predator"],
        [830, "Alien vs. Predator"],
        [832, "Back to the Future"],
        [833, "Yakuza"],
        [836, "Yu-Gi-Oh!"],
        [842, "Duke Nukem"],
        [866, "Wario"],
        [868, "Drakengard"],
        [875, "Godzilla"],
        [879, "Hello Kitty"],
        [880, "The Simpsons"],
        [887, "Forza"],
        [896, "Pac-Man"],
        [909, "Spider-Man"],
        [922, "Sailor Moon"],
        [924, "Warcraft"],
        [966, "Game & Watch"],
        [970, "Frogger"],
        [984, "Transformers"],
        [986, "Hatsune Miku"],
        [1013, "Beatmania"],
        [1069, "Fullmetal Alchemist"],
        [1099, "Warhammer 40,000"],
        [1102, "World Rally Championship (WRC)"],
        [1108, "Sega Ages"],
        [1110, "Attack on Titan"],
        [1154, "Mickey Mouse"],
        [1160, "Zork"],
        [1170, "Magic: The Gathering"],
        [1184, "Warriors"],
        [1186, "Dungeons & Dragons"],
        [1375, "Monopoly"],
        [1507, "Discworld"],
        [1519, "South Park"],
        [1531, "The Idolmaster"],
        [1729, "Galapagos RPG"],
        [1802, "Greg Hastings' Paintball"],
        [1850, "JoJo's Bizarre Adventure"],
        [2117, "Warhammer"],
        [2137, "A Kiss for the Petals"],
        [2151, "Sam & Max"],
        [2289, "SteamWorld"],
        [2474, "DC Universe"],
        [2521, "Monster Girl Quest!"],
        [2564, "SpongeBob SquarePants"],
        [2582, "Peanuts"],
        [2606, "Cars"],
        [2773, "Sword Art Online"],
        [2894, "Asterix"],
        [2914, "Looney Tunes"],
        [2999, "Fancy Pants Adventures"],
        [3005, "The House of the Dead"],
        [3036, "Gauntlet"],
        [3155, "Prey"],
        [3243, "Front Mission"],
        [3439, "Brian Lara Cricket"],
        [3453, "Heavy Gear"],
        [3499, "Koihime Musou"],
        [3559, "Dream Club"],
        [3566, "Toy Story"],
        [3625, "Fate"],
        [3717, "Zoids"],
        [3731, "Conan the Barbarian"],
        [3822, "Naruto"],
        [3896, "Fighting Fantasy"],
        [3928, "Pathfinder"],
        [3976, "Rusty Lake"],
        [3996, "Science Adventure"],
        [4090, "Lips"],
        [4452, "Far Cry"],
        [4498, "Ben 10"],
        [4501, "Air Conflicts"],
        [4572, "Galaxian"],
        [4579, "Bibi Blocksberg"],
        [4661, "The Dark Eye"],
        [4967, "Honoo no Haramase"],
        [5030, "Alien Shooter"],
        [5070, "Just Questions"],
        [5181, "Grisaia"],
        [5199, "Kunio Kun (Nekketsu)"],
        [5227, "Battlestar Galactica"],
        [5269, "Rugby League"],
        [5276, "Borderlands"],
        [5336, "Love Live!"],
        [5389, "Disney Infinity"],
        [5400, "Backyard Sports"],
        [5416, "Viva Pinata"],
        [5458, "Hugo"],
        [5469, "Uta no Prince-sama"],
        [5525, "Benjamin the Elephant"],
        [5536, "Asdivine"],
        [5537, "AFL Live"],
        [5546, "My Coach"],
        [5556, "Baldur's Gate"],
        [5563, "Vampire: The Masquerade"],
        [5613, "Yo-kai Watch"],
        [5630, "Dota"],
        [5638, "Mobile Suit Gundam"],
        [5643, "Million Arthur"],
        [5693, "Atelier"],
        [5695, "Inuyasha"],
        [5701, "Blade Runner"],
        [5729, "Neon Genesis Evangelion"],
        [5822, "Lovely x Cation"],
        [5839, "Aneimo"],
        [5977, "This is the Police"],
        [5984, "You Don't Know Jack"],
        [6019, "Loli Dirty Talk"],
        [6028, "When They Cry"],
        [6042, "John Wick"],
        [6060, "Castle of Shikigami"],
        [6102, "Digimon"],
        [6112, "Ice Age"],
        [6117, "Shrek"],
        [6140, "Daisenryaku"],
        [6147, "Dakar"],
        [6170, "Evil Dead"],
        [6175, "Family Guy"],
        [6201, "Aladdin (Disney)"],
        [6202, "The Lion King (Disney)"],
        [6234, "Garfield"],
        [6267, "Fallout"],
        [6276, "Terminator"],
        [6293, "Sega GT"],
        [6349, "Granblue Fantasy"],
        [6387, "CSI: Crime Scene Investigation"],
        [6393, "Venus Blood"],
        [6407, "Hoyle"],
        [6410, "Blair Witch"],
        [6423, "Risk"],
        [6535, "Beyblade"],
        [6552, "Mystery Dungeon"],
        [6665, "Death Note"],
        [6722, "League of Legends"],
        [6752, "Simple"],
        [6766, "Cooking Mama"],
        [6801, "Deadliest Catch"],
        [6806, "Record of Lodoss War"],
        [6816, "Assassin's Creed"],
        [6838, "Amazing Adventures"],
        [6848, "Madness"],
        [6905, "Mechanized Assault & Exploration"],
        [6976, "Blood Bowl"],
        [7019, "Hello Kitty to Issho!"],
        [7066, "World of Tanks"],
        [7078, "M&M's"],
        [7127, "Shopping Clutter"],
        [7134, "Command"],
        [7150, "Dragon Age"],
        [7173, "Fist of the North Star"],
        [7178, "Fast & Furious"],
        [7200, "Shin Nippon Pro Wrestling"],
        [7213, "Siren"],
        [7255, "Wallace & Gromit"],
        [7271, "Pirates of the Caribbean"],
        [7277, "Peter Pan"],
        [7278, "Disney Fairies"],
        [7333, "3-D Ultra"],
        [7414, "Taimanin"],
        [7415, "FIFA"],
        [7422, "Darkstalkers (Vampire Savior)"],
        [7423, "Clayfighter"],
        [7425, "Rival Schools"],
        [7448, "Parodius"],
        [7460, "Pink Panther"],
        [7471, "Steampunk Series"],
        [7478, "Chronicles of Narnia"],
        [7489, "Department Heaven"],
        [7492, "Rance"],
        [7517, "Invizimals"],
        [7542, "BattleTech"],
        [7557, "Cuckolding Report"],
        [7561, "Tom and Jerry"],
        [7566, "Titus the Fox"],
        [7570, "Steel Battalion"],
        [7572, "Hamtaro"],
        [7581, "Inspector Gadget"],
        [7587, "Cabela's"],
        [7598, "J.League licensed video games"],
        [7606, "Master of Monsters"],
        [7613, "NBA"],
        [7616, "MLB"],
        [7621, "NHL"],
        [7636, "Apogee Rescue"],
        [7647, "Hayarigami"],
        [7659, "Zorro"],
        [7692, "Disgaea"],
        [7705, "Cave Story"],
        [7707, "3D Classics (Nintendo)"],
        [7708, "3D Classics (SEGA)"],
        [7722, "Klonoa"],
        [7726, "Skunny"],
        [7732, "Doraemon"],
        [7752, "Cardcaptor Sakura"],
        [7753, "Haruhi Suzumiya"],
        [7754, "Astro Boy"],
        [7755, "Love Hina"],
        [7756, "Detective Conan (Case Closed)"],
        [7757, "Hunter × Hunter"],
        [7758, "Berserk"],
        [7759, "Spice and Wolf"],
        [7760, "Bleach"],
        [7761, "Lucky Star"],
        [7762, "Rozen Maiden"],
        [7763, "Ghost in the Shell"],
        [7764, "Cowboy Bebop"],
        [7765, "Anpanman"],
        [7766, "Lupin the Third"],
        [7767, "Yu Yu Hakusho"],
        [7768, "Captain Tsubasa"],
        [7769, "Inazuma Eleven"],
        [7770, "Zatch Bell!"],
        [7771, "Ranma ½"],
        [7772, "Shaman King"],
        [7773, "Bakugan"],
        [7775, "Golgo 13"],
        [7777, "Azumanga Daioh"],
        [7779, "My Hero Academia"],
        [7780, "Macross"],
        [7781, "Accel World"],
        [7784, "Little Witch Academia"],
        [7841, "Shining"],
        [7843, "Toriko"],
        [7853, "Crayon Shin-chan"],
        [7863, "Leaf Visual Novel Series"],
        [7871, "Story of Seasons"],
        [7880, "PaRappa the Rapper"],
        [7885, "Wizarding World"],
        [7886, "X-Men"],
        [7908, "G.I. Joe"],
        [7915, "Chobits"],
        [7916, "Ashita no Joe"],
        [7917, "Urusei Yatsura"],
        [7918, "Bobobo-bo Bo-bobo"],
        [7919, "Kinnikuman"],
        [7920, "The Seven Deadly Sins"],
        [7921, "The Prince of Tennis"],
        [7922, "Rurouni Kenshin"],
        [7924, "Wing Commander"],
        [7963, "Space Pilgrim Saga"],
        [8021, "My Jigsaw Adventure"],
        [8139, "The Superlatives"],
        [8148, "Alice in Wonderland"],
        [8156, "Police Quest"],
        [8180, "Diva Girls"],
        [8182, "The Smurfs"],
        [8184, "Rugrats"],
        [8186, "Ren & Stimpy"],
        [8234, "Cyanide & Happiness"],
        [8250, "Trivial Pursuit"],
        [8306, "Outlaw Sports"],
        [8528, "Jane's Combat Simulations"],
        [8530, "Rock Band"],
        [8676, "Power Rangers"],
        [8809, "Rambo"],
        [8826, "Monster Jam"],
        [8840, "Street Fighter"],
        [8864, "The Game of Life"],
        [8897, "Sierra Discovery"],
        [8926, "Galaxy Angel"],
        [9019, "Dragonlance"],
        [9100, "Goosebumps"],
        [9138, "Kamen Rider"],
        [9176, "Yoshi"],
        [9203, "Top Gun"],
        [9206, "Spirit"],
        [9216, "Alex Kidd"],
        [9218, "Arthur"],
        [9300, "The Lord of the Rings"],
        [9311, "Princess Maker"],
        [9340, "The Adventures of Tintin"],
        [9341, "Thomas & Friends"],
        [9368, "Paw Patrol"],
        [9395, "Ultraman"],
        [9495, "XIII"],
        [9590, "Spore"],
        [9641, "Hot Wheels"],
        [9662, "Sesame Street"],
        [9686, "Demon Slayer: Kimetsu no Yaiba"],
        [9687, "Sylvanian Families"],
        [9694, "Peppa Pig"],
        [9717, "Super Robot Wars"],
        [9782, "Doctor Who"],
        [9804, "Everquest"],
        [9823, "Xenogears"],
        [9825, "Rocketbirds"],
        [9830, "Awesomenauts"],
        [9833, "Rochard"],
        [9835, "Superman"],
        [9836, "Homeworlds"],
        [9941, "Decisive Campaigns"],
        [9992, "Bob the Builder"],
        [10010, "GeGeGe no Kitarō"],
        [10033, "Hebereke"],
        [10050, "Heiwa"],
        [10051, "Compati Hero"],
        [10114, "Jissen Pachi-Slot Hisshouhou!"],
        [10163, "Tenchi o Kurau"],
        [10312, "Momotaro Dentetsu"],
        [10324, "Glover"],
        [10360, "Count Duckula"],
        [10372, "Hotel Transylvania"],
        [10373, "My Universe"],
        [10380, "Metal Gear"],
        [10386, "Pretty Cure"],
        [10387, "Mermaid Melody Pichi Pichi Pitch"],
        [10388, "Patlabor"],
        [10398, "Saint Seiya"],
        [10459, "Senran Kagura"],
        [10511, "BanG Dream!"],
        [10519, "Dungeon Fighter Online"],
        [10522, "Endless"],
        [10582, "Die Hard "],
        [10667, "Little League World Series Baseball (LLWS)"],
        [10725, "Shovel Knight"],
        [10843, "Utawarerumono"],
        [10860, "Starship Troopers"],
        [10865, "Cardfight!! Vanguard"],
        [10888, "Wildlife Park"],
        [10908, "Caesar's Palace"],
        [10911, "Pachiokun"],
        [10919, "KonoSuba"],
        [11095, "Monster High"],
        [11116, "Tokimeki Memorial"],
        [11271, "Moorhuhn - Crazy Chicken"],
        [11343, "Of Orcs and Men"],
        [11345, "V-Rally"],
        [11351, "Chibi Maruko-chan"],
        [11436, "Conglomerate 5"],
        [11476, "Gintama"],
        [11502, "My Little Pony"],
        [11517, "Puzzle League"],
        [11550, "Ensemble Stars"],
        [11576, "Modern Art"],
        [11850, "Zone of the Enders"],
        [11874, "Sker"],
        [11903, "Age of Empires"],
        [11920, "Q*bert"],
        [11922, "Berzerk (1980)"],
        [11923, "Centipede"],
        [11966, "E.T. The Extra-Terrestrial"],
        [12026, "TwinBee"],
        [12027, "WWE"],
        [12047, "Fairy Tail"],
        [12085, "The Flintstones"],
        [12087, "The Jetsons"],
        [12103, "Strawberry Shortcake"],
        [12104, "Care Bears"],
        [12135, "Nauseous Pines / Uriel's Chasm"],
        [12144, "Rocky Horror Show"],
        [12158, "Buck Rogers"],
        [12174, "World of Wilderness"],
        [12272, "Space Invaders"],
        [12273, "Yars' Revenge"],
        [12274, "Stargate"],
        [12308, "Return 2 Games"],
        [12315, "Adibou"],
        [12355, "Torrente"],
        [12399, "The Legend of Heroes"],
        [12406, "Umamusume Pretty Derby"],
        [12454, "He-Man & The Masters of the Universe"],
        [12478, "Until Dawn"],
        [12535, "Starcom"],
        [12545, "Sherlock Holmes"],
        [12547, "Rampage"],
        [12565, "Danganronpa"],
        [12569, "Ratchet & Clank"],
        [12795, "World of Aravorn"],
        [12798, "Avatar"],
        [12981, "Deep Rock Galactic"],
        [13089, "Elden Ring"],
        [13125, "Action Man"],
        [13299, "Drakar och Demoner"],
        [13355, "Judge Dredd"],
        [13360, "God Eater"],
        [13442, "Jinki"],
        [13559, "RoboCop"],
        [13612, "Perryversum"],
        [13615, "Cindy Universe"],
        [13641, "Ringworld"],
        [13701, "Legend of the Five Rings"],
        [13760, "Metaltech"],
        [13796, "Richard Scarry"],
        [13835, "My Cute Roommate"],
        [13848, "Your Shape"],
        [13855, "Game Party"],
        [13861, "Wii Sports"],
        [13863, "Omnitrend Universe"],
        [13864, "ALF"],
        [13889, "Xevious"],
        [13916, "Power Sports"],
        [14015, "Hello Neighbor"],
    ];

    const itchioThemes = new Map([
        ["female protagonist", 856],
        ["space", 6751],
        ["gay", 3033],
        ["furry", 7472],
        ["artgame", 7955],
        ["medieval", 5515],
        ["surreal", 6708],
        ["metroidvania", 155],
        ["physics", 5498],
        ["procedural generation", 902],
        ["shoot 'em up", 10887],
        ["slice of life", 4502],
        ["cyberpunk", 3622],
        ["otome", 3035],
        ["bara", 7831],
        ["halloween", 4924],
        ["endless", 7043],
        ["isometric", 131],
        ["post-apocalyptic", 585],
        ["zombies", 586],
        ["black and white", 3681],
        ["underwater", 9814],
        ["vampire", 3994],
        ["mechs", 5287],
        ["homebrew", 7068],
        ["remake", 10666],
        ["pirates", 6402],
        ["western", 6125],
        ["lovecraftian horror", 1989],
        ["kinetic novel", 11355],
        ["souls-like", 5711],
        ["touhou", 68],
        ["steampunk", 3169],
        ["flying", 4086],
        ["hacking", 9666],
        ["perma death", 2380],
        ["dinosaurs", 6453],
        ["kickstarter", 164],
        ["episodic", 5078],
        ["world war ii", 673],
        ["world war i", 3025],
        ["norse", 6012],
        ["voice-controlled", 9617],
        ["on-rails shooter", 6556],
        ["lgbt", 130],
        ["queer", 130],
        ["lgbtqia", 130],
        ["transgender", 130],

        ["yuri", 3032],
        ["lesbian", 3032],

        ["clicker", 10970],
        ["idle", 10970],
        ["incremental", 10970],

        ["turn-based", 3813],
        ["turn-based combat", 3813],
        ["turn-based strategy", 3813],

        ["folklore", 12086],
        ["twin stick shooter", 12127],
        ["aliens", 12236],
        ["pixel art", 8817],
        ["3d platformer", 11484],
        ["dystopian", 13441],
    ]);
const itchioFeatures = new Map([
        ["local multiplayer", 963],
        ["virtual reality (vr)", 559],
        ["co-op", 961],
        ["controller", 551],
        ["touch-friendly", 3345],
        ["level editor", 5913],
        ["split screen", 472],
        ["oculus rift", 738],

        ["mmorpg", 7176],
        ["massively multiplayer", 7176],
    ]);
const mobygamesThemes = new Map([
        ["gambling", 8307],
        ["japanese-style rpg (jrpg)", 1232],
        ["metroidvania", 155],
        ["rail shooter", 6556],
        ["voice control", 9617],
        ["mecha / giant robot", 5287],
        ["cyberpunk / dark sci-fi", 3622],
        ["egypt (ancient)", 9238],
        ["post-apocalyptic", 585],
        ["steampunk", 3169],
        ["western", 6125],
        ["world war i", 3025],
        ["world war ii", 673],

        ["clicker", 10970],
        ["idle", 10970],
        ["incremental", 10970],

        ["japan (ancient/classical/medieval)", 13018],
        ["medieval", 5515],

        ["turn-based", 3813],
        ["turn-based strategy (tbs)", 3813],
        ["turn-based tactics (tbt)", 3813],

        ["prehistoric", 5515],
        ["tricks / stunts", 12124],
    ]);

const mobygamesThemes_Groups = new Map([
        [11087, 68],
[14070, 130],
[9700, 164],
[8038, 586],
[9654, 12235],
[712, 856],
[11581, 902],
[8817, 902],
[2, 1989],
[10553, 2380],
[3043, 2515],
[5857, 2832],
[15257, 10145],
[15477, 11386],
[15633, 3232],
[15232, 3267],
[14766, 7194],
[14802, 7090],
[15476, 7590],
[16401, 7628],
[18937, 9626],
[18857, 11781],
[18857, 7590],
[18857, 11615],
[15022, 13763],
[6053, 3994],
[10848, 4924],
[11484, 5078],
[1553, 5174],
[14402, 5976],
[6157, 6012],
[5990, 6402],
[6344, 6453],
[9031, 6693],
[12719, 6751],
[9585, 6751],
[9584, 6751],
[9770, 7210],
[7286, 7826],
[4293, 7828],
[9039, 8035],
[9894, 8155],
[9200, 8307],
[7483, 8838],
[8241, 8913],
[16676, 9498],
[2730, 9666],
[12467, 9814],
[1537, 9819],
[9027, 9824],
[5832, 9826],
[1501, 9837],
[8410, 9838],
[3212, 9839],
[10033, 9840],
[418, 10342],
[8497, 10445],
[7614, 10464],
[7966, 10666],
[18242, 10858],
[9586, 10887],
[10383, 10963],
[4916, 11277],
[17206, 11296],
[17440, 11355],
[10860, 11519],
[9013, 11808],
[5165, 11808],
[8755, 11851],
[6200, 11858],
[3557, 9150],
[1541, 6826],
[9407, 3729],
[6335, 12086],
[7437, 12089],
[9161, 12098],
[9599, 12127],
[7907, 12146],
[9660, 12236],
[9663, 12475],
[8800, 12668],
[8793, 12914],
[3302, 13018],
[10137, 13018],
[17752, 13685],
[9162, 13748],
[10545, 14039],
]);
const mobygamesFeatures = new Map([
        [2421, 4141],
[138, 551],
[3040, 551],
[2025, 551],
[2371, 551],
[2379, 1884],
[2659, 10653],
[2374, 739],
[2559, 1809],
[2375, 738],
[2444, 968],
[3092, 5679],
[619, 961],
[156, 476],
[2373, 5940],
[2373, 683],
[2376, 1117],
[2377, 1118],
[2378, 1119],
[1657, 1526],
[1264, 3345],
]);

    const mobygamesFeatures_RowLabels = new Map([
        ["Gamepads Supported:", 551],
["Light Guns / Attachments Supported:", 5200],
]);

    const mobygamesTags = new Map([
        ["1st-person", ["first.person"]],
        ["3rd-person (other)", ["third.person"]],
        ["behind view", ["3d", "third.person"]],
        ["side view", ["2d", "side.scrolling"]],
        ["fixed / flip-screen", ["fixed.view"]],
    ]);

    const mobygamesTags_simple = new Set([
        "diagonal-down",
        "top-down",
        "rpg elements",
        "puzzle elements",
        "real-time",
        "turn-based",
    ]);
const pcgwThemes = new Map([
["Gambling/casino", 8307],
        ["JRPG", 1232],
        ["Metroidvania", 155],
        ["Rail shooter", 6556],
        ["Quick time events", 12098],
        ["tricks", 12124],

        ["Tactical RPG", 3813],
        ["TBS", 3813],

        ["Clicker", 10970],
        ["Idle", 10970],
["Turn-based", 3813],
["Isometric", 131],
["Naval/watercraft", 8195],
        ["Robot", 5287],
        ["Tank", 8194],
        ["Train", 7210],
        ["Truck", 9839],
["Cel-shaded", 2832],
        ["Pixel art", 8817],
        ["Voxel art", 8838],
["Cold War", 6803],
        ["Cyberpunk", 3622],
        ["Egypt", 9238],
        ["Interwar", 8035],
        ["LGBTQ", 130],
        ["Lovecraftian", 1989],
        ["Medieval", 5515],
        ["Piracy", 6402],
        ["Post-apocalyptic", 585],
        ["Space", 6751],
        ["Steampunk", 3169],
        ["Western", 6125],
        ["World War II", 673],
        ["World War I", 3025],
        ["Zombies", 586],
        ["Prehistoric", 11820],
        ["Japan", 13018],
    ]);

    const pcgwFeatures = new Map([
["Controller support", 551],
        ["Full controller support", 551],
        ["Tracked motion controllers", 1884],
        ["OculusVR", 738],
        ["Windows Mixed Reality", 1809],
        ["Tobii Eye Tracking", 4141],
        ["TrackIR", 1884],
        ["Play area seated", 1117],
        ["Play area standing", 1118],
        ["Play area room scale", 1119],
        ["Ray tracing", 6900],
        ["Color blind", 12520],
    ]);

    const pcgwFeatures_Substring = [

["Local players", "2", 472],
        ["Local players", "4", 473],
        ["Local modes", "Hot seat", 475],
        ["Local modes", "Co-op", 962],
        ["LAN modes", "Co-op", 963],
        ["Online modes", "Co-op", 961],
        ["Upscaling", "DLSS", 10604],
        ["Upscaling", "FSR", 11486],
    ];

    const steamThemes = new Map([
        ["pixel graphics", 8817],
        ["female protagonist", 856],
        ["physics", 5498],
        ["cyberpunk", 3622],
        ["automation", 1006],
        ["isometric", 131],
        ["procedural generation", 902],
        ["card battler", 7039],
        ["based on a novel", 8200],
        ["zombies", 586],
        ["souls-like", 5711],
        ["dinosaurs", 6453],
        ["pirates", 6402],
        ["perma death", 2380],
        ["cold war", 6803],
        ["2.5d", 10326],
        ["jrpg", 1232],
        ["metroidvania", 155],
        ["atmospheric adventures", 5144],
        ["hand-drawn graphics", 10973],
        ["lovecraftian", 1989],
        ["mechs", 5287],
        ["world war ii", 673],
        ["lgbtq+", 130],
        ["villain protagonist", 4859],
        ["remake", 10666],
        ["vampire", 3994],
        ["cats", 7826],
        ["world war i", 3025],
        ["shoot 'em up", 10887],
        ["shoot 'em up", 11320],
        ["gambling", 8307],
        ["hacking", 9666],
        ["mars", 10464],
        ["clicker", 10970],
        ["surrealism", 6708],
        ["on-rails shooter", 6556],
        ["boss rush", 10966],
        ["voice control", 9617],
        ["steampunk", 3169],
        ["post-apocalyptic", 585],
        ["western", 6125],

        ["space", 6751],
        ["spaceships", 6751],

        ["political", 624],
        ["politics", 624],
        ["political sim", 12235],
        ["diplomacy", 624],

        ["underwater", 9814],
        ["submarine", 9814],

        ["crowdfunded", 164],
        ["kickstarter", 164],

        ["turn-based combat", 3813],
        ["turn-based strategy", 3813],
        ["turn-based tactics", 3813],
        ["turn-based", 3813],

        ["traditional roguelike", 11827],
        ["vikings", 12096],
        ["twin stick shooter", 12127],
        ["werewolves", 12146],
        ["aliens", 12236],
        ["3d platformer", 11484],
        ["dystopian", 13441],
    ]);
const steamFeatures_Tags = new Map([
        ["vr", 559],
        ["level editor", 5913],
        ["co-op campaign", 961],
["touch-friendly", 3345],

        ["mmorpg", 7176],
        ["massively multiplayer", 7176],
    ]);
const steamFeatures = new Map([
        ["vr only", 683],
["vr supported", 559],
        ["online co-op", 961],
        ["lan co-op", 962],
        ["lan co-op", 963],
        ["lan pvp", 963],
        ["lan co-op", 77],
        ["shared/split screen pvp", 476],
        ["shared/split screen co-op", 476],
        ["shared/split screen", 476],
        ["tracked controller support", 1884],
        ["in-app purchases", 1526],
        ["includes level editor", 5913],
    ]);
const vndbThemes = new Map([
[31, ["action"]],
[2704, ["beat.em.up"]],
[34, ["simulation"]],
[39, ["dating.simulation"]],
[33, ["strategy"]],
[41, ["strategy", "turn.based"]],
[42, ["strategy", "real.time"]],
[35, ["role.playing.game"]],
[339, ["tactics", "turn.based.combat", "role.playing.game"]],
[350, ["adventure"]],
[3735, ["adventure"]],
[3736, ["adventure", "point.and.click"]],
[274, ["dungeon.crawler", "adventure"]],
[144, ["card.battler", "card.game"]],
[1233, ["poker", "card.game"]],
[437, ["platform"]],
[347, ["rhythm"]],
[1658, ["board.game"]],
[765, ["racing"]],
[864, ["puzzle"]],
[3876, ["puzzle", "jigsaw"]],
[2695, ["clicker"]],
[3650, ["sandbox"]],
[2362, ["card.game"]],
[1276, ["trivia"]],
[789, ["thriller"]],
[3600, ["auto.battler"]],
[545, ["roguelite"]],

[7, ["horror"]],
[960, ["horror"]],
[3520, ["horror"]],
[3324, ["horror"]],
[147, ["drama"]],
[168, ["drama"]],
[169, ["drama"]],
[431, ["drama"]],
[453, ["slice.of.life", "drama"]],
[3894, ["drama"]],
[19, ["mystery"]],
[153, ["mystery", "drama"]],
[323, ["mystery"]],
[324, ["mystery", "thriller"]],
[553, ["mystery"]],
[104, ["comedy"]],
[142, ["slice.of.life", "comedy"]],
[150, ["comedy"]],
[151, ["slice.of.life", "comedy"]],
[1445, ["comedy"]],
[336, ["love.triangle"]],
[337, ["love.triangle", "drama"]],
[338, ["love.triangle", "comedy"]],
[454, ["slice.of.life"]],
[455, ["slice.of.life"]],
[62, ["science.fiction", "futuristic"]],
[105, ["science.fiction", "futuristic"]],
[106, ["science.fiction", "futuristic"]],
[2, ["fantasy"]],
[4, ["fantasy"]],
[6, ["fantasy"]],
[54, ["fantasy"]],
[588, ["fantasy"]],
[128, ["fantasy"]],
[129, ["fantasy"]],
[131, ["fantasy"]],
[138, ["fantasy"]],
[211, ["fantasy"]],
[212, ["fantasy"]],
[213, ["fantasy"]],
[266, ["fantasy"]],
[185, ["fantasy"]],
[344, ["fantasy"]],
[353, ["fantasy"]],
[400, ["fantasy"]],
[554, ["fantasy"]],
[555, ["fantasy"]],
[568, ["fantasy"]],
[576, ["fantasy"]],
[586, ["fantasy"]],
[665, ["fantasy"]],
[666, ["fantasy"]],
[954, ["science.fiction", "fantasy"]],
[994, ["fantasy"]],
[1900, ["fantasy"]],
[3127, ["fantasy"]],
[3128, ["fantasy"]],
[3129, ["fantasy"]],
[1765, ["fantasy"]],
[1897, ["urban.fantasy"]],
[99, ["romance", "incest"]],
[100, ["romance", "incest"]],
[101, ["romance", "incest"]],
[2683, ["romance", "incest"]],
[3249, ["romance", "incest"]],
[3395, ["romance", "incest"]],
[96, ["romance"]],
[415, ["romance"]],
[552, ["romance"]],
[1529, ["romance"]],
[2835, ["romance"]],
[97, ["romance", "lesbian"]],
[98, ["romance", "gay"]],

[1675, ["city.building"]],
[709, ["kinetic.novel"]],
[3768, ["turn.based"]],
[3985, ["management", "simulation"]],
[356, ["parody"]],
[598, ["episodic.story"]],

[556, ["child.protagonist"]],
[2137, ["robot.protagonist"]],
[2621, ["animal.protagonist"]],
[341, ["villain.protagonist"]],
[354, ["villain.protagonist"]],
[134, ["female.protagonist"]],
[1869, ["female.protagonist"]],
[2125, ["female.protagonist"]],
[2229, ["female.protagonist"]],

[1749, ["mafia"]],
[1750, ["mafia"]],
[1864, ["mafia"]],
[216, ["crime"]],
[217, ["crime"]],
[322, ["crime"]],
[3649, ["crime"]],
[3996, ["crime"]],
[53, ["space"]],
[102, ["space"]],
[103, ["space"]],
[2569, ["space", "pirates"]],
[3531, ["space", "pirates"]],
[938, ["space", "vehicular.combat"]],
[14, ["mecha"]],
[377, ["mecha"]],
[761, ["mecha"]],
[764, ["mecha"]],
[2357, ["mecha"]],
[50, ["ninjas"]],
[120, ["ninjas"]],
[296, ["ninjas"]],
[1775, ["ninjas"]],
[345, ["aliens"]],
[509, ["aliens"]],
[1162, ["aliens"]],
[1270, ["aliens"]],
[969, ["pirates"]],
[970, ["pirates"]],
[971, ["pirates"]],
[1907, ["pirates"]],
[486, ["zombies"]],
[2026, ["zombies"]],
[2828, ["zombies"]],
[3611, ["zombies"]],
[4049, ["zombies"]],
[260, ["magical.girls"]],
[995, ["magical.girls"]],
[2403, ["gyaru"]],
[3495, ["gyaru"]],
[5, ["vampires", "fantasy"]],
[210, ["vampires", "fantasy"]],
[130, ["vampires", "fantasy"]],
[1113, ["vampires", "fantasy"]],
[1371, ["vampires", "fantasy"]],
[2120, ["vampires", "fantasy"]],
[2122, ["vampires", "fantasy"]],
[204, ["werewolf"]],
[1136, ["werewolf"]],
[1140, ["werewolf"]],
[1305, ["werewolf"]],
[473, ["kemonomimi"]],
[474, ["kemonomimi"]],
[482, ["kemonomimi"]],
[510, ["kemonomimi"]],
[529, ["kemonomimi"]],
[753, ["kemonomimi"]],
[936, ["kemonomimi"]],
[1149, ["kemonomimi"]],
[331, ["catgirls", "kemonomimi"]],

[560, ["monster.girls"]],
[892, ["monster.girls"]],


[1420, ["monster.girls"]],
[2142, ["monster.girls"]],
[3418, ["monster.girls"]],
[1217, ["ancient.china"]],
[1218, ["ancient.china"]],
[1714, ["ancient.egypt"]],
[57, ["norse.mythology"]],
[58, ["greek.mythology"]],
[3303, ["slavic.mythology"]],
[1969, ["feudal.japan"]],
[166, ["feudal.japan"]],
[3840, ["feudal.japan"]],
[2876, ["world.war.i"]],
[647, ["world.war.ii"]],
[301, ["medieval"]],
[61, ["medieval"]],
[918, ["western"]],
[772, ["dystopian"]],
[893, ["mars"]],
[68, ["post.apocalyptic"]],
[140, ["futuristic"]],

[2693, ["3dcg"]],
[3130, ["pixel.art"]],
[3663, ["ai.generated.art"]],
[3664, ["ai.generated.art"]],
[3684, ["ai.generated.art"]],
[3790, ["ai.generated.art"]],
[846, ["surreal"]],
[1662, ["black.and.white"]],

[1117, ["bdsm"]],
[1645, ["bdsm"]],
[1788, ["bdsm"]],
[2265, ["bdsm"]],
[2266, ["bdsm"]],
[2938, ["bdsm"]],
[3039, ["bdsm"]],
[3040, ["bdsm"]],
[3041, ["bdsm"]],
[3043, ["bdsm"]],
[3059, ["bdsm"]],
[86, ["incest"]],
[88, ["incest"]],
[89, ["incest"]],
[92, ["incest"]],
[93, ["incest"]],
[95, ["incest"]],
[414, ["incest"]],
[532, ["incest"]],
[992, ["incest"]],
[1296, ["incest"]],
[1318, ["incest"]],
[1522, ["incest"]],
[1693, ["incest"]],
[1702, ["incest"]],
[1703, ["incest"]],
[1704, ["incest"]],
[1705, ["incest"]],
[1706, ["incest"]],
[1707, ["incest"]],
[1809, ["incest"]],
[1821, ["incest"]],
[2483, ["incest"]],
[3319, ["incest"]],
[3330, ["incest"]],
[3383, ["incest"]],
[1189, ["incest", "gay"]],
[1697, ["incest", "gay"]],
[1698, ["incest", "gay"]],
[1708, ["incest", "gay"]],
[1942, ["incest", "gay"]],
[2031, ["incest", "gay"]],
[2206, ["incest", "gay"]],
[90, ["incest", "lesbian"]],
[91, ["incest", "lesbian"]],
[94, ["incest", "lesbian"]],
[3305, ["incest", "lesbian"]],
[84, ["rape"]],
[85, ["rape"]],
[117, ["rape"]],
[207, ["rape"]],
[511, ["rape"]],
[574, ["rape"]],
[575, ["rape"]],
[621, ["rape"]],
[663, ["rape"]],
[704, ["rape"]],
[939, ["rape"]],
[940, ["rape"]],
[1323, ["rape"]],
[1391, ["rape"]],
[1687, ["rape"]],
[1727, ["rape"]],
[1743, ["rape"]],
[1943, ["rape"]],
[1944, ["rape"]],
[2003, ["rape"]],
[2367, ["rape"]],
[2500, ["rape"]],
[2504, ["rape"]],
[2507, ["rape"]],
[2600, ["rape"]],
[2915, ["rape"]],
[2916, ["rape"]],
[2917, ["rape"]],
[2918, ["rape"]],
[2936, ["rape"]],
[2961, ["rape"]],
[2962, ["rape"]],
[3180, ["rape"]],
[3345, ["rape"]],
[3346, ["rape"]],
[3482, ["rape"]],
[3819, ["rape"]],
[3820, ["rape"]],
[3821, ["rape"]],
[3824, ["rape"]],
[3825, ["rape"]],
[4053, ["rape"]],
[1640, ["rape", "bestiality"]],
[987, ["rape", "tentacles"]],
[178, ["rape", "tentacles"]],
[261, ["rape", "female.domination"]],
[3123, ["rape", "shota"]],
[738, ["gay", "rape"]],
[2181, ["rape", "combat.sex"]],
[623, ["lesbian", "rape"]],
[82, ["lesbian"]],
[490, ["lesbian"]],
[1281, ["lesbian"]],
[1986, ["lesbian"]],
[2300, ["lesbian"]],
[3064, ["lesbian"]],
[3085, ["lesbian"]],
[3481, ["lesbian"]],
[3698, ["lesbian"]],
[3699, ["lesbian"]],
[83, ["gay"]],
[1328, ["gay"]],
[1820, ["gay"]],
[2002, ["gay"]],
[2234, ["gay"]],
[2846, ["gay"]],
[3065, ["gay"]],
[3084, ["gay"]],
[3674, ["gay"]],
[3690, ["gay"]],
[1930, ["lgbtq.characters"]],
[1932, ["lgbtq.characters"]],
[1933, ["lgbtq.characters"]],
[2076, ["lgbtq.characters"]],
[3178, ["lgbtq.characters"]],
[3700, ["lgbtq.characters"]],
[3935, ["lgbtq.characters"]],
[3936, ["lgbtq.characters"]],
[3937, ["lgbtq.characters"]],
[3939, ["lgbtq.characters"]],
[3940, ["lgbtq.characters"]],
[3941, ["lgbtq.characters"]],
[3942, ["lgbtq.characters"]],
[3943, ["lgbtq.characters"]],
[3944, ["lgbtq.characters"]],
[3945, ["lgbtq.characters"]],
[2047, ["shota", "gay"]],
[2272, ["loli", "lesbian"]],
[154, ["loli"]],
[156, ["loli"]],
[669, ["loli"]],
[1396, ["loli"]],
[3159, ["loli"]],
[184, ["shota"]],
[668, ["shota"]],
[2046, ["shota"]],
[434, ["harem"]],
[612, ["harem"]],
[1017, ["harem"]],
[1238, ["harem"]],
[1540, ["harem"]],
[1690, ["harem"]],
[1691, ["harem"]],
[413, ["futanari"]],
[625, ["futanari"]],
[1187, ["futanari"]],
[1857, ["futanari"]],
[2051, ["futanari"]],
[2363, ["futanari"]],
[2444, ["futanari"]],
[2471, ["futanari"]],
[2800, ["futanari"]],
[2801, ["futanari"]],
[3390, ["futanari"]],
[3952, ["futanari"]],
[4025, ["futanari"]],
[183, ["bestiality"]],
[988, ["bestiality"]],
[1300, ["bestiality"]],
[1422, ["bestiality"]],
[1644, ["bestiality"]],
[1996, ["bestiality"]],
[3392, ["bestiality"]],
[3393, ["bestiality"]],
[359, ["gender.bender"]],
[388, ["gender.bender"]],
[421, ["gender.bender"]],
[506, ["gender.bender"]],
[997, ["gender.bender"]],
[1046, ["gender.bender"]],
[1247, ["gender.bender"]],
[1840, ["gender.bender"]],
[1957, ["gender.bender"]],


[600, ["tentacles"]],
[989, ["tentacles"]],
[1606, ["tentacles"]],
[2301, ["tentacles"]],
[3227, ["tentacles"]],
[3500, ["tentacles"]],
[3501, ["tentacles"]],
[3507, ["tentacles"]],
[3627, ["tentacles"]],
[513, ["netorare"]],
[1313, ["netorare"]],
[1457, ["netorare"]],
[1458, ["netorare"]],
[1459, ["netorare"]],
[2028, ["netorare", "avoidable.netorare"]],
[3169, ["netorare"]],
[3828, ["netorare"]],
[2656, ["netorare", "gay"]],
[1627, ["netorare"], "lesbian"],
[514, ["netori"]],
[1663, ["netorase"]],
[3832, ["netorase"]],
[684, ["avoidable.netorare", "netorare"]],
[2158, ["urophilia"]],
[2953, ["urophilia"]],
[3063, ["urophilia"]],
[3150, ["urophilia"]],
[3662, ["urophilia"]],


[1425, ["pregnancy"]],
[1565, ["pregnancy"]],
[2554, ["pregnancy"]],
[411, ["chikan"]],
[521, ["chikan"]],
[1034, ["chikan"]],
[1685, ["chikan"]],
[2624, ["chikan"]],
[752, ["furry"]],
[2548, ["furry"]],
[3391, ["furry"]],
[3461, ["furry"]],
[23, ["eroge"]],
[214, ["nukige"]],
[596, ["nakige"]],
[542, ["otome"]],
[693, ["utsuge"]],
[162, ["guro"]],
[718, ["female.domination"]],
[3728, ["female.domination"]],
[1170, ["bara", "gay"]],
[1279, ["vore"]],
[3219, ["vore"]],
[2354, ["vore"]],
[897, ["scatological"]],
[2902, ["scatological"]],
[3494, ["scatological"]],
[531, ["hypnosis"]],
[3709, ["hypnosis"]],
[3105, ["corruption"]],
[3498, ["corruption"]],
[349, ["time.loop"]],
[364, ["espionage"]],
[417, ["3d"]],
[484, ["submarine"]],
[543, ["hacking"]],
[608, ["steampunk"]],
[626, ["aerial.combat"]],
[302, ["politics"]],
[955, ["politics"]],

[682, ["cyberpunk"]],
[1325, ["halloween"]],
[1364, ["time.stop"]],
[1567, ["photography"]],
[278, ["cats"]],
[1752, ["trains"]],
[2062, ["quick.time.events"]],
[2180, ["isekai"]],
[2377, ["naval"]],
[2856, ["dinosaurs"]],
[2890, ["kaiju"]],
[3301, ["underwater"]],
[3471, ["scp.foundation"]],
[664, 11800],
[3342, 11800],
[3116, 3729],
[3118, 3729],
[3119, 3729],
[1008, 12086],
[1205, 8200],
[3846, 6826],
[3280, 1989],
[55, 1989],
[3579, 10481],
[1813, 11519],
[1193, 68],
[2711, 1526],
[2777, 13726]
]);

    const vndbThemesExtra = new Map([
        [261, 5366],

        [3500, 11642],
        [178, 11642],
        [3501, 11642],
        [600, 11642],
        [3627, 11642],
        [3227, 11642],
        [3507, 11642],
    ]);
const vndbThemes_Traits = new Map([
        [1794, 2862],
[2946, 3721],
[342, 6702],
[677, 3034],
[2331, 11398],
[1219, 6701],
[2114, 6701],
[3411, 11770],
[706, 12146],
]);

    const tagConversionMap = new Map([
        [13372, ["cortex.classic"]],
        [13375, ["cortex.plus"]],
        [1123, ["vaporwave.aesthetics"]],
        [13376, ["fate.30.system"]],
        [11754, ["chikan"]],
        [3031, ["catgirls"]],
        [10638, ["child.protagonist"]],
        [2832, ["cel.shading"]],
        [12318, ["christmas"]],
        [4924, ["halloween"]],
        [12633, ["scp.foundation"]],
        [586, ["zombies"]],
        [3032, ["lesbian"]],
        [13157, ["year.zero.engine"]],
        [3033, ["gay"]],
        [673, ["world.war.ii"]],
        [3025, ["world.war.i"]],
        [6125, ["western"]],
        [12146, ["werewolves"]],
        [8838, ["voxel.art"]],
        [1792, ["visual.novel"]],
        [4859, ["villain.protagonist"]],
        [12096, ["vikings"]],
        [6646, ["vietnam.war"]],
        [10887, ["vertical.scrolling", "shoot.em.up"]],
        [5786, ["utsuge"]],
        [9693, ["urophilia"]],
        [12298, ["unreal.engine"]],
        [11911, ["unity.engine"]],
        [9814, ["underwater"]],
        [12127, ["twin.stick", "shoot.em.up"]],
        [10964, ["tug.of.war", "strategy"]],
        [9839, ["trucks"]],
        [12124, ["tricks"]],
        [10392, ["isekai"]],
        [7210, ["trains"]],
        [11827, ["traditional.roguelike"]],
        [13678, ["tinyd6"]],
        [11770, ["time.stop"]],
        [13685, ["time.loop"]],
        [11642, ["tentacles"]],
        [8194, ["tanks"]],
        [13137, ["system.agnostic"]],
        [6708, ["surreal"]],
        [9826, ["puzzle"]],
        [9826, ["sudoku"]],
        [13747, ["submarines"]],
        [3169, ["steampunk"]],
        [13282, ["stationary", "shooter"]],
        [11398, ["space", "pirates"]],
        [5711, ["souls.like"]],
        [13634, ["solo.playable.ttrpg"]],
        [4502, ["slice.of.life"]],
        [11296, ["slavic.mythology"]],
        [12461, ["simultaneous.turn.based"]],
        [3185, ["shota"]],
        [4908, ["scatological"]],
        [12475, ["robot.protagonist"]],
        [10963, ["reverse.tower.defense"]],
        [6556, ["rail.shooter"]],
        [12098, ["quick.time.events"]],
        [8114, ["psychedelia"]],
        [12241, ["psx.style", "horror", "low.polygon"]],
        [11820, ["prehistory"]],
        [12669, ["pregnancy"]],
        [13464, ["powered.by.zweihander"]],
        [8852, ["powered.by.the.apocalypse"]],
        [624, ["government.simulation"]],
        [12235, ["politics", "satire"]],
        [5498, ["physics.based"]],
        [6402, ["pirates"]],
        [11277, ["photography"]],
        [12668, ["parkour"]],
        [3035, ["otome"]],
        [12138, ["orchestral", "live.performance"]],
        [5174, ["olympic.games"]],
        [6012, ["norse.mythology"]],
        [10445, ["nonogram"]],
        [12886, ["non.euclidean.geometry"]],
        [89, ["new.world.of.darkness"]],
        [7043, ["never.ending"]],
        [5845, ["netori"]],
        [5846, ["netorase"]],
        [8195, ["naval"]],
        [6336, ["nasuverse"]],
        [5785, ["nakige"]],
        [9805, ["motorcycles"]],
        [911, ["middle.earth"]],
        [155, ["metroidvania"]],
        [9729, ["mental.illness"]],
        [5287, ["mecha"]],
        [6829, ["macro.environment"]],
        [13274, ["maze.tower.defense"]],
        [10464, ["mars"]],
        [6702, ["magical.girls"]],
        [11811, ["love.triangle"]],
        [3041, ["loli"]],
        [12544, ["liminal.space"]],
        [130, ["lgbtq.characters"]],
        [10965, ["lane.defense"]],
        [11355, ["kinetic.novel"]],
        [3034, ["kemonomimi"]],
        [10858, ["kaiju"]],
        [11881, ["japanese", "magazine"]],
        [8035, ["interwar.period"]],
        [1157, ["interactive.movie"]],
        [10970, ["clicker"]],
        [11805, ["incest"]],
        [11751, ["hypnosis"]],
        [11320, ["side.scrolling", "shoot.em.up"]],
        [12667, ["hidden.object.puzzle.book"]],
        [11904, ["hero.shooter"]],
        [11769, ["harem"]],
        [9666, ["hacking"]],
        [6701, ["gyaru"]],
        [13327, ["gumshoe.system"]],
        [13330, ["gumshoe.one.2.one.system"]],
        [12089, ["greek.mythology"]],
        [7060, ["grappling.hook"]],
        [6693, ["god.game"]],
        [13652, ["gmless"]],
        [5214, ["gender.bender"]],
        [7837, ["radio.controlled.cars"]],
        [3681, ["black.and.white"]],
        [11910, ["gamemaker.studio"]],
        [11927, ["gamebook"]],
        [8307, ["gambling"]],
        [3039, ["futanari"]],
        [7472, ["furry"]],
        [3497, ["full.motion.video"]],
        [11241, ["found.footage"]],
        [2515, ["forgotten.realms"]],
        [11554, ["flying.character"]],
        [4086, ["flying"]],
        [12914, ["fishing.minigame"]],
        [13626, ["firefighting"]],
        [13018, ["feudal.japan"]],
        [5366, ["female.domination"]],
        [7996, ["experimental"]],
        [13310, ["essence20.system"]],
        [11902, ["esports"]],
        [5078, ["episodic.story"]],
        [13441, ["dystopian"]],
        [6453, ["dinosaurs"]],
        [8155, ["dieselpunk"]],
        [623, ["dancing"]],
        [3622, ["cyberpunk"]],
        [10931, ["mafia"]],
        [11801, ["combat.sex"]],
        [6803, ["cold.war"]],
        [8913, ["clay.animation"]],
        [11350, ["chibi"]],
        [9829, ["chess"]],
        [12300, ["character.customization"]],
        [9498, ["chernobyl.exclusion.zone"]],
        [7826, ["cats"]],
        [10966, ["boss.rush"]],
        [11851, ["bridge.building"]],
        [7039, ["card.battler"]],
        [10744, ["biopunk"]],
        [6233, ["bestiality"]],
        [13151, ["barbarians.of.lemuria"]],
        [7831, ["bara"]],
        [9824, ["backgammon"]],
        [11341, ["avoidable.netorare"]],
        [1006, ["automation"]],
        [7955, ["art.game"]],
        [3721, ["anthropomorphic.animals"]],
        [9821, ["ants"]],
        [6109, ["animal.protagonist"]],
        [5129, ["rape"]],
        [9238, ["ancient.egypt"]],
        [11858, ["american.civil.war"]],
        [12570, ["airships"]],
        [11755, ["alternate.history"]],
        [2862, ["monster.girls"]],
        [5515, ["medieval"]],
        [3994, ["vampires"]],
        [8817, ["pixel.art"]],
        [856, ["female.protagonist"]],
        [11829, ["ai.generated.art"]],
        [12236, ["aliens"]],
        [3813, ["turn.based.combat"]],
        [902, ["procedural.generation"]],
        [11484, ["3d", "platform"]],
        [10555, ["corruption"]],
        [6448, ["3dcg"]],
        [10326, ["2.5d"]],
        [1793, ["eroge"]],
        [1794, ["nukige"]],
        [5844, ["netorare"]],
        [6751, ["space"]],
        [902, ["procedural.generation"]],
        [2380, ["permadeath"]],
        [12236, ["aliens"]],
        [585, ["post.apocalyptic"]],
        [10973, ["hand.drawn"]],
        [192, ["tycoon", "business.simulation"]],
        [131, ["isometric"]],
    ]);

    const adultTags = new Set([
        "eroge",
        "nukige",
        "rape",
        "loli",
        "corruption",
        "incest",
        "tentacles",
        "harem",
        "netorare",
        "female.domination",
        "futanari",
        "netori",
        "bestiality",
        "urophilia",
        "shota",
        "pregnancy",
        "hypnosis",
        "combat.sex",
        "avoidable.netorare",
        "scatological",
        "netorase",
        "chikan",
        "bdsm",
        "vore",
        "guro"
    ]);
const steamdb_sdkEngines = new Map([
        ["NWJS", "NW.js"],
        ["NVIDIA PhysX", "PhysX Engine"],
        ["WWise", "Wwise"],
        ["Adobe Flash", "Adobe Flash"],
        ["OpenAL", "OpenAL"],
        ["Bink Video", "Bink Video"],
        ["CRIWARE", "CRIWare"],
        ["Electron", "Electron"],
        ["FMOD", "FMOD"],
    ]);

    const steamdb_sdkFeatures = new Map([
        ["NVIDIA DLSS", 10604],
        ["Tobii", 4141],
        ["Intel XeSS", 11547],
        ["AMD FSR2", 11486],
    ]);

const settings = getSettings([
        ['columns', 3],
        ['refresh_after_submit', false],
        ['check_SteamDB', true],
    ]);

    let check_SteamDB = settings.check_SteamDB;

    if (location.href.includes('torrents.php?id=') && document.getElementById('groupplatform')) {
        if (groupContentDiv) {
            if (check_SteamDB) {
                GM_registerMenuCommand("Run (without SteamDB)", () => {
                    check_SteamDB = false;
                    main();
                });
            }

            createCornerButton('right', 'Collection Crawler', e => {
                e.target.remove();
                main();
            });
        }
    }

    if (location.href.includes('collections.php?action=new')) {
        GM_deleteValue('new_collection');
        const form = document.querySelector('#content form');
        form.addEventListener('submit', () => {
            if (['1', '7', '8', '9'].includes(form.querySelector('select').value))
                GM_setValue('new_collection', true);
        });

    }

    if (location.href.includes('collections.php?id=') && GM_getValue('new_collection', false)) {
        document.querySelector('.header').insertAdjacentHTML('afterbegin', `
    <h1 style="color: #f1c0c0">Tell <a href="/user.php?id=67369">ingts</a> in IRC or PM them about this new collection so that Collection Crawler can be updated</h1> `);
        GM_deleteValue('new_collection');
    }

    if (location.hostname === "steamdb.info" && GM_getValue('checking_steamdb', false)) {
        const infoTab = document.getElementById('info');
        if (infoTab) {
            const info = {};
            const techLink = infoTab.querySelector('tr a[href="/tech/"]');
            if (techLink) {
                info.tech = Array.from(techLink.closest('td').nextElementSibling
                    .querySelectorAll('a')).map(a => a.textContent);
            }

            info.deckVerified = !!document.querySelector("[aria-label='Steam Deck: Verified']");
            info.hasLinux = !!document.querySelector('.octicon-linux');

            GM_setValue('steamdb_info', info);
        }
    }

    async function main() {
        GM_addStyle(
`
            #cc label {
                display: flex;
                align-items: center;
            }

            #cc-content {
                display: grid;
                grid-template-columns: repeat(${settings.columns}, 1fr);
                row-gap: 2px
            }

            #cc-content a, span {
                flex: 1
            }

            #cc input[type=checkbox] {
                margin: 0 4% 0 0;
            }

            #cc-loading {
                font-size: 1.05rem;
                color: #cf9d5e;
            }

            #cc .exists {
                color: #999c9f;
            }

            #cc div.header {
                &:nth-of-type(1) {
                    margin-top: 0;
                }

                margin: 12px 0 3px 0;
                grid-column: span ${settings.columns};
                display: flex;
                align-items: center;

                h3 {
                    padding: 0;
                    font-size: 1.1rem;
                    width: max-content;

                    span {
                        font-size: 0.8rem;
                        color: #c9aadf;
                        font-weight: normal;
                    }

                    span.comma {
                        font-size: 0.8rem;
                        color: unset;
                    }
                }
            }

            #cc div.head a {
                margin-left: 10px;
                color: #79d179;
                font-size: 0.8rem;
            }

            #cc button {
                height: unset;
                padding: 6px;
                width: max-content;
            }
        `);


        document.getElementById('grouplinks').insertAdjacentHTML('afterend',
`
            <section id="cc" class="box">
                <div class="head" style="width: 100%;">
                    Collection Crawler
                </div>
                <div id="cc-content"></div>
                <h3 id="cc-loading">Loading</h3>
            </section>
        `);
        const section = document.getElementById('cc');
        const content = document.getElementById('cc-content');
        const header = document.querySelector('#cc div.head');

        const officialSiteLink = document.querySelector("a[title=GamesWebsite]")?.href;
        const aliases = document.getElementById('group_aliases')?.textContent;
        const DLsiteCodePattern = /[A-Z]{2}\d{4,}/;
        const DLsiteAliasMatch = DLsiteCodePattern.exec(aliases);

        const DLsiteCode = DLsiteAliasMatch && DLsiteAliasMatch[0]
            || (officialSiteLink?.includes('dlsite') && DLsiteCodePattern.exec(officialSiteLink)[0]);

        const wikipedia = document.querySelector("a[title=Wikipedia]");
        const websites = new Map([
            ["DLsite", DLsiteCode],
            ["Steam", document.querySelector("a[title=Steam]")],
            ["itch.io", document.querySelector("a[title=Itch]")],
            ["MobyGames", document.querySelector("a[title=MobyGames]")],
            ["PCGamingWiki", document.querySelector("a[title=PCGamingWiki]")],
            ["Wikipedia", wikipedia],
            ["VNDB", document.querySelector("a[title=VNDB]")],
        ]);

        if (!wikipedia?.href.includes('en.wikipedia'))
            websites.delete("Wikipedia");
        let noLink = true;

        websites.forEach((value, key) => {
            if (value) {
                header.insertAdjacentHTML('beforeend', `
<a id="cc-status-${key}" target="_blank"
href="${DLsiteCodePattern.test(value) ? `https://www.dlsite.com/home/work/=/product_id/${DLsiteCode}.html` : value.href}">${key}</a>`);
                noLink = false;
            }
        });

        if (noLink) {
            document.getElementById('cc-loading').remove();
            section.insertAdjacentHTML('beforeend', '<h1 style="color: red">No supported sites found</h1>');
            return
        }
const foundThemes = new Set(), foundFeatures = new Set();
let foundSeries = '';
let foundEngines = new Set(), foundDevelopers = new Set(), foundPublishers = new Set(),
            foundDesigners = new Set(), foundComposers = new Set(), foundTags = new Set();

        const platform = document.querySelector("#groupplatform > a").textContent.trim();
        const groupnameLower = document.getElementById('groupplatform').nextSibling.textContent.replace(/ - (.*) \(.*\).*/, '$1').toLowerCase();
        const parser = new DOMParser();

        function setErrorStatus(sitename) {
            document.getElementById(`cc-status-${sitename}`).style.color = 'red';
        }

        function parseDoc(response) {
            return parser.parseFromString(response.responseText, 'text/html')
        }

        function getLowercaseTextFromElements(element, selector, sitename = null) {
            const elements = element.querySelectorAll(selector);
            if (!elements) {
                if (sitename) setErrorStatus(sitename);
                return
            }
            return Array.from(elements, a => a.textContent.trim().toLowerCase())
        }

        function addCollectionIds(iterable, collectionsMap, addTo, parseAsNum = false, extraMap) {
            if (iterable.length < 1) return
            if (parseAsNum && typeof iterable[0] === 'string') {
                iterable = Array.from(iterable, str => parseInt(str.replace(/\D/g, '')));
            }

            for (const id of iterable) {
                const val = collectionsMap.get(id);

                if (Array.isArray(val)) {
                    val.forEach(v => foundTags.add(v));
                } else {
                    addTo.add(val);
                }

                if (extraMap) {
                    addTo.add(extraMap.get(id));
                }
            }
        }

        function addAllStrings(strings, addTo) {
            strings.forEach(s => addTo.add(s));
        }

        let promises = [];

        function processURL(sitename, func, url = websites.get(sitename).href, options = {}) {
            promises.push(promiseXHR(url, {...options, timeout: 8000})
                .then(res => {
                    if (res.status !== 200) {
                        console.error(res);
                        throw Error()
                    }
                    func(res, sitename);
                })
                .catch(e => {
                    console.error(`${sitename} error ${e}`);
                    setErrorStatus(sitename);
                })
            );
        }

        function getNodeByXPath(doc, expr) {
            return doc.evaluate(expr, doc.body,
                null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        }

        if (websites.get("DLsite")) {
            processURL("DLsite", r => {
                const {genres, maker_name, maker_name_en, site_id, options} = r.response[0];
                const maker = maker_name_en ?? maker_name;
                const genreIds = genres.map(i => i.id);
                if (site_id === "girls") foundThemes.add(3035);
if (site_id === "bl") foundThemes.add(3033);
if (options?.includes("AIP")) foundThemes.add(11829);
addCollectionIds(genreIds, DLsiteThemes, foundThemes, true, DlsiteThemesExtra);
                addCollectionIds(genreIds, DLsiteFeatures, foundFeatures, true);
                foundDevelopers.add(maker);
                foundPublishers.add(maker);
            }, `https://www.dlsite.com/home/api/=/product.json?
        workno=${DLsiteCode}&fields=genres,maker_name,maker_name_en,options`, {
                responseType: "json"
            });
        }

        if (websites.get("Steam")) {
            const steamId = /\d+/.exec(websites.get("Steam").href)[0];

            processURL("Steam", (r, sitename) => {
                const doc = parseDoc(r);
                const tags = getLowercaseTextFromElements(doc, '.glance_tags a', sitename);
                if (!tags) return
                addCollectionIds(tags, steamThemes, foundThemes);
                addCollectionIds(tags, steamFeatures_Tags, foundFeatures);
                if (doc.querySelector('.game_purchase_price')?.textContent.includes("Free")) foundThemes.add(156);
                if (doc.getElementById('earlyAccessHeader')) foundThemes.add(152);
                if (getNodeByXPath(doc, "//h2[text()='AI Generated Content Disclosure']")) foundThemes.add(11829);
            });

            processURL("Steam", r => {
                const {developers, publishers, controller_support, categories: features} = r.response[steamId].data;
                addAllStrings(developers, foundDevelopers);
                addAllStrings(publishers, foundPublishers);
                controller_support && foundFeatures.add(551);
                const lowerFeatures = features.map(i => i.description.toLowerCase());
                addCollectionIds(lowerFeatures, steamFeatures, foundFeatures);
                lowerFeatures.includes("shared/split screen co-op") && foundFeatures.add(962);
            }, `https://store.steampowered.com/api/appdetails?l=en&appids=${steamId}`, {responseType: "json"});

            if (check_SteamDB) {
                GM_deleteValue('steamdb_info');
                promises.push(new Promise(resolve => {
                    GM_setValue('checking_steamdb', 1);
                    const tab = GM_openInTab(`https://steamdb.info/app/${steamId}/info`);
                    const listener = GM_addValueChangeListener('steamdb_info', (key, oldValue, newValue) => {
                        resolve(1);
                        GM_removeValueChangeListener(listener);
                        tab.close();
                        const {tech, deckVerified, hasLinux} = newValue;
                        if (deckVerified) {
if (hasLinux) {
                                if (platform === 'Linux') foundThemes.add(10563);
                            } else if (platform === 'Windows') foundThemes.add(10563);
                        }
                        GM_deleteValue(key);
                        GM_deleteValue('checking_steamdb');
                        if (!tech) return
                        const engines = tech.filter(i => i.endsWith('Engine') || i.endsWith('Emulator')).map(i => i.replace('RenPy', "ren'py"));
                        addAllStrings(engines, foundEngines);

                        const sdks = tech.filter(i => i.endsWith('SDK')).map(s => s.replace(' SDK', ''));

                        sdks.forEach(t => {
                            foundEngines.add(steamdb_sdkEngines.get(t));
                            foundFeatures.add(steamdb_sdkFeatures.get(t));
                        });
                    });
                }));
            }
        }

        if (websites.get("itch.io")) {
            processURL("itch.io", (r, sitename) => {
                const doc = parseDoc(r);
                const tags = getLowercaseTextFromElements(doc, 'a[href*=tag-]', sitename);
                if (!tags) return
                addCollectionIds(tags, itchioThemes, foundThemes);
                if (tags.includes('horror')) {
                    if (tags.includes('ps1') || tags.includes('psx (playstation)')) {
                        foundThemes.add(12241);
}
                }
                addCollectionIds(tags, itchioFeatures, foundFeatures);

                const authors = getNodeByXPath(doc, ".//table//td[contains(text(), 'Author')]").nextElementSibling;
                authors.querySelectorAll('a').forEach(a => {
                    foundDevelopers.add(a.textContent);
                    foundPublishers.add(a.textContent);
                });

                const madeWithTd = getNodeByXPath(doc, ".//table//td[text()='Made with']");
                if (madeWithTd) {
                    const madeWith = getLowercaseTextFromElements(madeWithTd.nextElementSibling, 'a', sitename)
                        .filter(t => t !== 'blender');
addAllStrings(madeWith, foundEngines);
                }
            });
        }

        if (websites.get("MobyGames")) {
            processURL("MobyGames", (r, sitename) => {
                const doc = parseDoc(r);
                const genres = getLowercaseTextFromElements(doc, '.info-genres dd a', sitename);
                if (!genres) return
                const platformMap = new Map([
                    ["Mac", "Macintosh"],
                    ["Apple II", "Apple II"],
                    ["iOS", "iPhone"],
                    ["Apple Bandai Pippin", "Pippin"],
                    ["Android", "Android"],
                    ["DOS", "DOS"],
                    ["Windows", "Windows"],
                    ["Xbox", "Xbox"],
                    ["Xbox 360", "Xbox360"],
                    ["Game Boy", "Gameboy"],
                    ["Game Boy Advance", "Game Boy Advance"],
                    ["Game Boy Color", "Game Boy Color"],
                    ["NES", "NES"],
                    ["Nintendo 64", "Nintendo 64"],
                    ["Nintendo 3DS", "intendo 3DS"],
                    ["New Nintendo 3DS", "New Nintendo 3DS"],
                    ["Nintendo DS", "Nintendo DS"],
                    ["Nintendo GameCube", "GameCube"],
                    ["Pokemon Mini", "Pokémon Mini"],
                    ["SNES", "SNES"],
                    ["Switch", "Nintendo Switch"],
                    ["Virtual Boy", "Virtual Boy"],
                    ["Wii", "Wii"],
                    ["Wii U", "Wii U"],
                    ["PlayStation 1", "PlayStation"],
                    ["PlayStation 2", "PlayStation 2"],
                    ["PlayStation 3", "PlayStation 3"],
                    ["PlayStation 4", "PlayStation 4"],
                    ["PlayStation 5", "PlayStation 5"],
                    ["PlayStation Portable", "PSP"],
                    ["PlayStation Vita", "PS Vita"],
                    ["Dreamcast", "Dreamcast"],
                    ["Game Gear", "Game Gear"],
                    ["Master System", "SEGA Master System"],
                    ["Mega Drive", "Genesis"],
                    ["Pico", "SEGA Pico"],
                    ["SG-1000", "SG-1000"],
                    ["Saturn", "SEGA Saturn"],
                    ["Atari 2600", "Atari 2600"],
                    ["Atari 5200", "Atari 5200"],
                    ["Atari 7800", "Atari 7800"],
                    ["Atari Jaguar", "Jaguar"],
                    ["Atari Lynx", "Lynx"],
                    ["Atari ST", "Atari ST"],
                    ["Amstrad CPC", "Amstrad CPC"],
                    ["ZX Spectrum", "Zx Spectrum"],
                    ["MSX", "MSX"],
                    ["3DO", "3DO"],
                    ["Bandai WonderSwan", "WonderSwan"],
                    ["Bandai WonderSwan Color", "WonderSwan Color"],
                    ["Colecovision", "ColecoVision"],
                    ["Interactive DVD", "DVD Player"],
                    ["Commodore 64", "Commodore 64"],
                    ["Commodore 128", "Commodore 128"],
                    ["Amiga CD32", "Amiga CD32"],
                    ["Commodore Amiga", "Amiga"],
                    ["Commodore Plus-4", "Commodore 16, Plus/4"],
                    ["Commodore VIC-20", "VIC-20"],
                    ["NEC PC-98", "PC-98"],
                    ["NEC SuperGrafx", "SuperGrafx"],
                    ["Game.com", "Game.Com"],
                    ["Gizmondo", "Gizmondo"],
                    ["V.Smile", "V.Smile"],
                    ["CreatiVision", "CreatiVision"],
                    ["Linux", "Linux"],
                    ["Mattel Intellivision", "Intellivision"],
                    ["NEC PC-FX", "PC-FX"],
                    ["NEC TurboGrafx-16", "TurboGrafx-16"],
                    ["Nokia N-Gage", "N-Gage"],
                    ["Ouya", "Ouya"],
                    ["Sharp X1", "Sharp X1"],
                    ["Sharp X68000", "Sharp X68000"],
                    ["SNK Neo Geo", "Neo Geo"],
                    ["Tangerine Oric", "Oric"],
                    ["Thomson MO5", "Thomson MO"],
                    ["Watara Supervision", "Supervision"],
                    ["Casio Loopy", "Casio Loopy"],
                    ["Casio PV-1000", "Casio PV-1000"],
                    ["Emerson Arcadia 2001", "Arcadia 2001"],
                    ["Entex Adventure Vision", "Adventure Vision"],
                    ["Epoch Super Casette Vision", "Epoch Super Cassette Vision"],
                    ["Fairchild Channel F", "Channel F"],
                    ["Funtech Super Acan", "Super A'can"],
                    ["GamePark GP32", "GP32"],
                    ["General Computer Vectrex", "Vectrex"],
                    ["Magnavox-Phillips Odyssey", "Odyssey"],
["Memotech MTX", "Memotech MTX"],
                    ["Miles Gordon Sam Coupe", "SAM Coupé"],
                    ["Oculus Quest", "Quest"],
                    ["Philips Videopac+", "Videopac+ G7400"],
                    ["Philips CD-i", "CD-i"],
                    ["RCA Studio II", "RCA Studio II"],
                    ["SNK Neo Geo Pocket", "Neo Geo Pocket"],
                ]);
                addCollectionIds(genres, mobygamesThemes, foundThemes);
                addCollectionIds(genres, mobygamesTags, foundTags);

                for (const genre of genres) {
                    if (mobygamesTags_simple.has(genre)) {
                        foundTags.add(genre
                            .replace(' ', '')
                            .replace('-', '.'));
                    }
                }

                function addDevsPubs(list, addTo) {
                    list.forEach(a => {
                        const platforms = JSON.parse(a.dataset?.popover)?.platforms;
                        if (!platforms) {
                            addTo.add(a.textContent);
                            return
                        }
                        if (platforms.some(p => platformMap.get(platform) === p))
                            addTo.add(a.textContent);
                    });
                }

                addDevsPubs(doc.querySelectorAll('#developerLinks a'), foundDevelopers);
                addDevsPubs(doc.querySelectorAll('#publisherLinks a'), foundPublishers);
                const groups = Array.from(doc.querySelectorAll('.badge.text-ellipsis a'));
                groups.filter(group => {
                    if (['engine:', 'middleware:'].some(str => group.textContent.toLowerCase().includes(str))) {
                        foundEngines.add(group.textContent.replace(/^.*?: /, ''));
return false
                    }
                    if (group.textContent.includes('series')) {
                        foundSeries = group.textContent.replace('series', '').trim();
                        return false
                    }
                    switch (/\d+/.exec(group.href)[0]) {
                        case "11123":
foundFeatures.add(12428);
                            return false
                        case "14859":
foundFeatures.add(12520);
                            return false
                    }
                    return true
                });
                addCollectionIds(groups.map(a => /\d+/.exec(a.href)[0]), mobygamesThemes_Groups, foundThemes, true);

                const specsLink = doc.querySelector('span.text-nowrap')?.firstElementChild;
                if (!specsLink) return

                processURL("MobyGames", r => {
                    const doc = parseDoc(r);
                    const platformHeaderRow = getNodeByXPath(doc, `(.//table)[1]//h4[contains(text(), "${platformMap.get(platform)}")]/ancestor::tr`);
                    let currentRow = platformHeaderRow?.nextElementSibling;
                    const specIds = [];
                    while (currentRow && !currentRow.querySelector('h4')) {
                        currentRow.querySelectorAll('td').forEach((td, i) => {
                            if (i === 0) {
                                foundFeatures.add(mobygamesFeatures_RowLabels.get(td.textContent.trim()));
                            } else {
                                td.querySelectorAll('a').forEach(a => specIds.push(/\d+/.exec(a.href)[0]));
                            }
                        });
                        currentRow = currentRow.nextElementSibling;
                    }
                    if (specIds.includes(156)) {
foundFeatures.add(963);
foundFeatures.add(476);
}
                    addCollectionIds(specIds, mobygamesFeatures, foundFeatures, true);
                }, specsLink.href.replace('gazellegames.net', 'www.mobygames.com'));
            });
        }

        if (websites.get("PCGamingWiki")) {
            function addOthers(str, addTo) {
                str.split(',').forEach(t => addTo.add(t.replace(/^.*?:/, '')));
            }

            processURL("PCGamingWiki", (r, sitename) => {
                const result = r.response?.cargoquery;
if (!result || result.length < 1) {
                    setErrorStatus(sitename);
                    return
                }
                const themeKeys = new Set(["Genres", "Pacing", "Perspectives", "Vehicles", "Art styles", "Themes"]);
                const addedThemes = [];

                for (const [key, value] of Object.entries(result[0].title)) {
                    if (!value || value === "unknown") continue
                    if (themeKeys.has(key)) {
                        value.split(',').forEach(t => foundThemes.add(pcgwThemes.get(t)));
                        addedThemes.push(value);
                        continue
                    }
                    switch (key) {
                        case "Series":
                            foundSeries = value;
                            continue
                        case "Engines":
                            addOthers(value, foundEngines);
                            continue
                        case "Developers":
                            addOthers(value, foundDevelopers);
                            continue
                        case "Publishers":
                            addOthers(value, foundPublishers);
                            continue
                    }
                    if (value === "true") {
                        if (key === "Local") {
                            foundFeatures.add(963);
foundFeatures.add(476);
continue
                        }
                        if (key === "VR only") {
                            foundThemes.add(683);
                            continue
                        }
                        const m = pcgwFeatures.get(key);
                        if (m) {
                            foundFeatures.add(m);
                            continue
                        }
                    }
                    pcgwFeatures_Substring.forEach(([k, v, id]) => {
                        if (key === k && value.includes(v)) foundFeatures.add(id);
                    });
                }

                if (addedThemes.includes('Platform')
                    && ["Bird's-eye view", "First-person", "Third-person"].some(perspective => addedThemes.includes(perspective)))
                    foundThemes.add(11484);
}, `https://www.pcgamingwiki.com/w/api.php?action=cargoquery&
    tables=Infobox_game,VR_support,Input,Multiplayer,Video&
    fields=Infobox_game._pageName=Page,
    Infobox_game.Genres,
    Infobox_game.Pacing,
    Infobox_game.Perspectives,
    Infobox_game.Vehicles,
    Infobox_game.Art_styles,
    Infobox_game.Themes,
    Infobox_game.Series,
    Infobox_game.Engines,
    Infobox_game.Developers,
    Infobox_game.Publishers,
    Input.Tracked_motion_controllers,
    Input.Controller_support,
    Input.Full_controller_support,
    Multiplayer.Local,
    Multiplayer.Local_players,
    Multiplayer.Local_modes,
    Multiplayer.LAN_modes,
    Multiplayer.Online_modes,
    VR_support.OculusVR,
    VR_support.Windows_Mixed_Reality,
    VR_support.Tobii_Eye_Tracking,
    VR_support.TrackIR,
    VR_support.Play_area_seated,
    VR_support.Play_area_standing,
    VR_support.Play_area_room_scale,
    Video.Upscaling,
    Video.Ray_tracing,
    Video.Color_blind,
    &join_on=Infobox_game._pageName=VR_support._pageName,Infobox_game._pageName=Input._pageName,Infobox_game._pageName=Multiplayer._pageName,Infobox_game._pageName=Video._pageName&
    where=Infobox_game._pageName="${websites.get("PCGamingWiki").href.split('/')[4].replace(/_/g, ' ')}"&format=json`, {responseType: "json"});
        }

        if (websites.get("Wikipedia")) {
            function wikipediaAdd(node, addTo) {
                for (const child of node.childNodes) {
                    const textContent = child?.textContent;

                    if ((child.nodeType === Node.ELEMENT_NODE
                            && child.tagName === 'A'
                            && child.className === 'mw-redirect wl')
                        && child.parentNode?.className !== 'reference'
                        || (child.nodeType === Node.TEXT_NODE
                            && !/^[a-z]+$/.test(textContent)
&& /^[a-zA-Z]/.test(textContent)
                            && !/[A-Z]{2,3}$/.test(textContent))
) {
                        const text = textContent.replace(/[\[(].*?[\])]/g, '');
if (text === "a") continue
addTo instanceof Set ? addTo.add(text) : addTo = text;
                    }

                    wikipediaAdd(child, addTo);
                }
            }

            processURL("Wikipedia", (r, sitename) => {
                const doc = parseDoc(r);
                const infobox = doc.querySelector('table.infobox');
                if (!infobox) {
                    setErrorStatus(sitename);
                    return
                }
                infobox.querySelectorAll('tr:nth-child(2) ~ tr')
.forEach(tr => {
                        const children = tr.children;
                        switch (children[0].textContent) {
case 'Developer(s)':
                                wikipediaAdd(children[1], foundDevelopers);
                                break
                            case 'Publisher(s)':
                                wikipediaAdd(children[1], foundPublishers);
                                break
                            case 'Designer(s)':
                                wikipediaAdd(children[1], foundDesigners);
                                break
                            case 'Series':
                                wikipediaAdd(children[1], foundSeries);
                                break
                            case 'Composer(s)':
                                wikipediaAdd(children[1], foundComposers);
                                break
                            case 'Engine':
                                wikipediaAdd(children[1], foundEngines);
                                break
                        }
                    });
            });
        }

        if (websites.get("VNDB")) {
            const vnId = /v(\d+)/.exec(websites.get("VNDB"))[0];
const nativeLangMap = new Map([
                ["en", 1692],
                ["ru", 10496],
                ["zh-Hans", 10673],
                ["zh-Hant", 10673],
                ["ko", 10918],
            ]);
const unofficialTranslationMap = new Map([
                ["en", 5160],
                ["zh-Hans", 7870],
                ["zh-Hant", 7870],
                ["ko", 11477],
            ]);

            function setOptions(dataObject) {
                return {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    responseType: "json",
                    data: JSON.stringify(dataObject)
                }
            }

            processURL("VNDB", r => {
                const {developers, olang: originalLang, tags} = r.response.results[0];
                foundThemes.add(nativeLangMap.get(originalLang));
                const tagIds = tags.filter(i => i.rating >= 1 && i.spoiler < 2 && !i.lie).map(i => i.id);
                addCollectionIds(tagIds, vndbThemes, foundThemes, true, vndbThemesExtra);
                addAllStrings(developers.map(i => i.name), foundDevelopers);

                processURL("VNDB", r => {
                        let adult;
                        for (const {
                            engine,
                            languages,
                            official,
                            producers,
                            has_ero,
                            uncensored,
                            released
                        } of r.response.results) {
                            foundEngines.add(engine);
                            if (uncensored) foundThemes.add(4138);
if (has_ero) adult = true;
                            for (const {name, publisher} of producers) {
                                if (publisher && official)
                                    foundPublishers.add(name);
                            }

                            if (released !== 'TBA') {
                                const lang = languages[0].lang;
                                if (languages[0].mtl) foundThemes.add(10320);
if (lang === originalLang) continue
                                if (official) {
                                    if (lang === "en") foundThemes.add(62);
} else {
                                    foundThemes.add(unofficialTranslationMap.get(lang));
                                }
                            }
                        }
                        if (adult) {
                            foundThemes.add(1793);
foundThemes.delete(10638);
}
                    }, 'https://api.vndb.org/kana/release', setOptions({
                        "filters": ["and", ["vn", "=", ["id", "=", `${vnId}`]], ["platform", "=", `${ggnToVndbPlatform.get(platform)}`]],
                        "fields": "engine, languages.lang, languages.mtl, official, producers.publisher, producers.name, has_ero, uncensored, released",
                        "results": 100
                    })
                );
            }, 'https://api.vndb.org/kana/vn', setOptions({
                    "filters": ["id", "=", `${vnId}`],
                    "fields": "tags.id, developers.name, olang, tags.rating, tags.spoiler, tags.lie"
                }
            ));

            processURL("VNDB", r =>
                addCollectionIds(r.response.results.flatMap(i => i.traits.map(trait => trait.id)),
                    vndbThemes_Traits, foundThemes, true), 'https://api.vndb.org/kana/character', setOptions({
                "filters": ["vn", "=", ["id", "=", `${vnId}`]],
                "fields": "traits.id"
            }));
        }

        await Promise.allSettled(promises);
        await Promise.allSettled(promises);
const groupIsAdult = document.querySelector("#group_tags a[href*='adult']");
        const existingTags = Array.from(document.querySelectorAll('#group_tags a')).map(a => a.textContent);
        const existingIds = Array.from(
            document.querySelectorAll(".theme_collections a[href*='collections.php?id='], #sidebar_group_info a[href*='collections.php?id=']"))
            .map(a => /\d+/.exec(a.href)[0]);

        let curCheckboxes = [], curHeader;

        function addUncheckAllButton() {
            if (curCheckboxes.length > 1) {
                const button = document.createElement('button');
                curHeader.append(button);
                button.textContent = 'Uncheck All';
                button.style.marginLeft = 'auto';
                button.type = 'button';

                const _curCheckboxes = curCheckboxes;
                button.onclick = () => {
                    for (const checkbox of _curCheckboxes) {
                        checkbox.checked = false;
                    }
                };
            }

            curCheckboxes = [];
            curHeader = undefined;
        }
function insertHeader(headerText, extra) {
            const div = document.createElement('div');
            div.className = 'header';
            const heading = document.createElement('h3');
            div.append(heading);
            content.append(div);

            heading.textContent = headerText + ' ';
            if (extra) {
                Array.from(extra).forEach((name, index) =>
                    heading.insertAdjacentHTML('beforeend', `<span>${name}</span>${index !== extra.size - 1 ?
                    "<span class='comma'>, </span>" : ''}`));
            }
            curHeader = div;
        }

        const capsTagWords = new Set(['2d', '5d', '3d', 'ai', 'lgbtq', 'psx', '3dcg', 'scp', 'ii', 'rpg']);

        function createLabel(id, name, checked, isTag) {
            const isExisting = isTag ? existingTags.includes(name) : existingIds.includes(id.toString());
            const label = document.createElement('label');
            content.append(label);
            let displayName = name;
            if (isTag) {
                displayName = name.replace(/[^.]+/g, match => capsTagWords.has(match) ? match.toUpperCase()
                    : match.charAt(0).toUpperCase() + match.substring(1)).replaceAll('.', ' ');
            }

            label.insertAdjacentHTML('beforeend', `
<${isTag ? `span` : `a href="collections.php?id=${id}" target="_blank"`}${isExisting ? ` class=exists` : ''}>${displayName}</${isTag ? 'span' : 'a'}>`);

            if (!isExisting) {
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = checked;
                label.append(input);
                curCheckboxes.push(input);
                if (isTag) {
                    input.dataset.actualName = name;
                }
            }
        }

        function insertLabel(collectionId, name) {
            if (content.querySelector(`a[href='collections.php?id=${collectionId}']`)) return
            createLabel(collectionId, name, true);
        }

        function insertLabels(headerText, set, collectionMap, uncheckSet, isTags) {
            insertHeader(headerText);
            for (const idOrTag of set) {
                createLabel(idOrTag,
                    isTags ? idOrTag : collectionMap.get(idOrTag),
                    !uncheckSet.has(idOrTag), isTags);
            }
            addUncheckAllButton();
        }

        function insertNotFound() {
            addUncheckAllButton();
            if (notFound.size < 1) return
            content.insertAdjacentHTML('beforeend', `
<p style="color: #b7adb5; grid-column: span ${GM_getValue('columns')}">
<span style="font-weight: bold; color: inherit">Not Found</span>: ${Array.from(notFound).join("<span style='color: white;'>, </span>")}
</p>`);
            notFound.clear();
        }

        foundTags.delete(null);
        foundTags.delete(undefined);
        foundThemes.delete(null);
        foundThemes.delete(undefined);
        foundFeatures.delete(null);
        foundFeatures.delete(undefined);
        foundEngines.delete(null);
        foundEngines.delete(undefined);
        foundDevelopers.delete(null);
        foundDevelopers.delete(undefined);
        foundPublishers.delete(null);
        foundPublishers.delete(undefined);

        const suffixes = ["Inc", "LLC", "Ltd", "Co", "Corp", "Pvt", "PLC", "AG", "GmbH", "SA", "AB", "NV", "KG",
            "OG", "EOOD", "SRL", "BV", "SL", "AS", "A/S", "Pty", "Ltda", "Sdn", "Bhd", "PT", "Pte", "Ltd", "LLP",
            "LP", "SARL", "e.V", "SE", "Oy", "RF", "Lda", "SpA", "Kft", "Zrt", "AS", "d.o.o", "s.r.o", "o.o.",
            "OOO", "A.D.", "JSC", "P.J.S.C", "S.A.B.", "C.V.", "S.A.P.I.", "de C.V.", "S. de R.L.", "de C.V.",
            "S.A.P.I.", "B.V.", "N.V.", "S.A.", "S.C.A.", "S.C.R.L.", "S.C.S.", "S.N.C.", "intl", "international", "S.R.l"];
        const suffixPattern = new RegExp(`,?\\s?(?:Co\., Ltd|\\b(${suffixes.join("|")})\\b)\.?$`, "i");

        function standardise(set) {
            const lowerNoSuffix = new Set([...set].map(name => name.replace(suffixPattern, '').toLowerCase().trim()));

            const strs = Array.from(lowerNoSuffix).reduce((acc, str) => {
acc.push(str);
                if (/[a-z][A-Z]/.test(str)) {
                    const modifiedStr = str.replace(/([a-z])([A-Z])/g, '$1 $2');
                    acc.push(modifiedStr);
                }
                return acc
            }, []);
            return new Set(strs)
        }

        foundDevelopers = standardise(foundDevelopers);
        foundPublishers = standardise(foundPublishers);

        if (!groupIsAdult) {
            foundThemes.forEach(id => {
                if (adultThemes.has(id))
                    foundThemes.delete(id);
            });
            foundTags.forEach(tag => {
                if (adultTags.has(tag))
                    foundTags.delete(tag);
            });
        }

        let notFound = new Set();

        if (foundTags.has('gay') || foundTags.has('lesbian'))
            foundTags.add("lgbtq.characters");

        if (foundTags.has('cyberpunk'))
            foundTags.add("dystopian");

        if (foundFeatures.has(683)) {
foundFeatures.delete(683);
            foundThemes.add(683);
        }

        if (foundFeatures.has(5940)) {
foundFeatures.delete(5940);
            foundThemes.add(5940);
        }

        if (foundThemes.has(13726)) {
foundThemes.delete(13726);
            foundFeatures.add(13726);
        }

        if (existingIds.includes('152'))
foundThemes.add(5148);
if (foundThemes.size > 0) {
            if (foundThemes.has(1794))
foundThemes.delete(1793);
if (foundThemes.has(3032) || foundThemes.has(3033))
foundThemes.add(130);
if (foundThemes.has(10887) || foundThemes.has(11320)) {
foundThemes.add(10887);
foundThemes.add(11320);
}

            if (foundThemes.has(3622))
foundThemes.add(13441);
if (groupIsAdult)
                foundThemes.delete(1232);
const consoleExclusiveIds = [10145, 11386, 3232, 3267, 7194, 7090, 7590, 7628, 9626, 11781, 7590, 11615];
            const linkedGroups = Array.from(document.querySelectorAll('#grouplinks a div'));
            if (!linkedGroups.every(div => div.className === 'cats_ebooks' || div.className === 'cats_ost')) {
consoleExclusiveIds.forEach(id => foundThemes.delete(id));
            }

            const uncheck = new Set([
                1232,
10887,
                11320,
5160,
                7870,
                11477,
                10320,
]);

            if (foundThemes.has(11801)) {
foundThemes.add(14038);
                uncheck.add(14038);
}

            const tagsUncheck = new Set();

            for (const foundTheme of foundThemes) {
                const tagArr = tagConversionMap.get(foundTheme);
                if (!tagArr) continue
                foundThemes.delete(foundTheme);
                for (const tag of tagArr) {
                    foundTags.add(tag);
                    if (uncheck.has(foundTheme))
                        tagsUncheck.add(tag);
                }
            }


            if (foundTags.size > 0) {
                insertLabels('Tags', foundTags, undefined, tagsUncheck, true);
            }

            if (foundThemes.size > 0)
                insertLabels('Themes', foundThemes, themesMap, uncheck);
        }

        if (foundFeatures.size > 0) {
            if (foundFeatures.has(472)) {
foundFeatures.add(473);
foundFeatures.add(476);
}
            if (foundFeatures.has(476)) {
                foundFeatures.add(472);
                foundFeatures.add(473);
                foundFeatures.add(963);
            }
            if (foundFeatures.has(962)) {
foundFeatures.add(961);
foundFeatures.add(963);
}
            if (foundFeatures.has(961) && foundFeatures.has(963))
                foundFeatures.add(962);
            if (!['Windows', 'Linux', 'Mac'].includes(platform)) {
                foundFeatures.delete(551);
foundFeatures.delete(3345);
}
            const uncheck = new Set([
                472,
                473,
            ]);

            if (foundFeatures.size > 0)
                insertLabels('Features', foundFeatures, featuresMap, uncheck);
        }

        for (const [id, name] of franchises) {
            if (groupnameLower.includes(name.toLowerCase())) {
                insertHeader('Franchise');
                insertLabel(id, name);
                break
            }
            addUncheckAllButton();
        }

        if (foundEngines.size > 0) {
            if (foundEngines.has('CRI')) {
                foundEngines.delete('CRI');
                foundEngines.add('CRIWare');
            }

            if (foundEngines.has('KiriKiri / KAG')) {
                foundEngines.delete('KiriKiri / KAG');
                foundEngines.add('KiriKiri');
            }

            if (foundEngines.has('Multimedia Fusion / Clickteam Fusion 2.5')) {
                foundEngines.delete('Multimedia Fusion / Clickteam Fusion 2.5');
                foundEngines.add("Multimedia Fusion (Clickteam Fusion)");
            }

            let mappedEngines = [];

            foundEngines.forEach(name => {
                let found;
                for (const [collectionName, id] of enginesMap) {
                    const nameLower = name.toLowerCase();
                    const collectionNameLower = collectionName.toLowerCase();
                    let replacements = ['engine', /\d+/, ' ', '-'];
                    if (nameLower === 're engine') replacements.splice(0, 1);
                    if (collectionNameLower.includes(nameLower) ||
                        replacements.some(r =>
                            collectionNameLower.replace(r, '').trim().includes(nameLower.replace(r, '').trim())
                        )
                    ) {
                        found = true;
                        mappedEngines.push([id, collectionName]);
                    }
                }
                !found && notFound.add(name);
            });

            mappedEngines = mappedEngines
                .filter(ar => {
const hasRenpyId = mappedEngines.some(([id]) => id === 584);
                    return !(hasRenpyId && ar[0] === 10845)
                });

            insertHeader('Engine');
            for (const [id, collectionName] of mappedEngines) {
                insertLabel(id, collectionName);
            }
            insertNotFound();
        }

        async function findCollections(searchValue, func) {
            console.log('searching for', searchValue);
            await fetch(`ajax.php?action=collections_autocomplete&search=${encodeURIComponent(searchValue)}`,
            )
                .then(r => r.json())
                .then(r => {
                    let [, names, , path] = r;
                    const obj = names.map((n, i) => {
                        const [, name, category] = /(.*)\((.*?)\)$/.exec(n);
                        return {
                            category: category,
                            id: /\d+/.exec(path[i])[0],
                            name: name.trim()
                        }
                    }).filter(o => o.name.toLowerCase().startsWith(searchValue));
                    if (Object.keys(obj).length === 0) {
                        notFound.add(searchValue);
                        return
                    }
                    func(obj);
                })
                .catch(r => {
                    console.error(r);
                    alert(`Error occured while searching for ${searchValue}`);
                });
        }

        const foundPublishersArray = [...foundPublishers];
        let publishers = [];

        insertHeader('Developers', foundDevelopers);
        for (const devname of foundDevelopers) {
            let found;
            await findCollections(devname, r =>
                r.forEach(({category, id, name}) => {
                    if (category === 'Publisher') {
const index = foundPublishersArray.findIndex(
                            p => p.replace(/ /g, '').toLowerCase().startsWith(name.toLowerCase()));
                        if (index !== -1) {
                            foundPublishersArray.splice(index, 1);
                            publishers.push([id, name]);
                        }
                    } else if (category === 'Developer') {
                        found = true;
                        insertLabel(id, name);
                    }
                }));
            if (!found)
                notFound.add(devname);
        }
        insertNotFound();

        if (foundPublishers.size > 0 || publishers.length > 0) {
            insertHeader('Publishers', foundPublishers);
            for (const [id, name] of publishers) {
                insertLabel(id, name);
            }
            for (const pubname of foundPublishersArray) {
                await findCollections(pubname, r =>
                    r.forEach(({category, id, name}) => {
                        if (category === 'Publisher')
                            insertLabel(id, name);
                        else if (category !== 'Developer')
notFound.add(pubname);
                    }));
            }
            insertNotFound();
        }

        if (foundSeries) {
            insertHeader('Series');
            await findCollections(foundSeries, r => {
                const {category, id, name} = r[0];
                if (category === 'Series') {
                    insertLabel(id, name);
                } else notFound.add(name);
            });
            insertNotFound();
        }

        if (foundDesigners.size > 0) {
            insertHeader('Designer');
            for (const name of foundDesigners) {
                await findCollections(name, r =>
                    r.forEach(({category, id, name}) => {
                        if (category === 'Designer') {
                            insertLabel(id, name);
                        } else notFound.add(name);
                    }));
            }
        }
        insertNotFound();

        document.getElementById('cc-loading').remove();

        const labels = content.querySelectorAll('label a, label span');

        section.insertAdjacentHTML('beforeend',
            `<div style="margin: 20px auto 0 auto;width: max-content;">
<button type="button" id="cc-uncheck" style="margin-right: 10px;">Uncheck All</button>
<button type="button" id="cc-submit" ${labels.length < 1 ? 'style="display:none;"' : ''}>Submit</button>
</div>
`);

        document.getElementById('cc-uncheck').onclick = () => content.querySelectorAll('label input').forEach(c => c.checked = false);

        const submittedCollections = new Set();
        const submittedTags = new Set();

        function submitCollection(body, id) {
            return fetch('collections.php', {
                method: 'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: body
            })
                .then(r => {
                    if (!(r.ok && r.redirected)) {
                        console.warn(r);
                        throw Error
                    }
                    submittedCollections.add(id);
                })
                .catch(() => Promise.reject(`Error adding ${/collageid=(\d+)/.exec(body)[1]}`))
        }

        const submitButton = document.getElementById('cc-submit');
        submitButton.onclick = () => {
            const selectedIds = Array.from(content.querySelectorAll('label a'))
                .filter(a => a.nextElementSibling?.checked)
                .map(a => new URL(a.href).searchParams.get('id'))
                .filter(id => !submittedCollections.has(id));

            const selectedTags = [...content.querySelectorAll('input[data-actual-name]:checked')]
                .map(i => i.dataset.actualName)
                .filter(t => !submittedTags.has(t));

            if (selectedIds.length < 1 && selectedTags.length < 1) {
                alert('None selected');
                return
            }

            submitButton.textContent = 'Submitting';
            submitButton.style.backgroundColor = '#6e6937';
            submitButton.disabled = true;

            const submits = [];
            const groupId = /\d+/.exec(location.href)[0];

            selectedIds.forEach(id => {
                if (id === '5148') {
                    submits.push(submitCollection(`action=manage_handle&auth=${authkey}&collageid=152&remove[]=${groupId}&submit=Remove`), id);
}
                submits.push(submitCollection(`action=add_torrent&auth=${authkey}&collageid=${id}&url=${location.href}`), id);
            });

            if (selectedTags.length > 0) {
                submits.push(fetch('torrents.php?action=add_tag&ajax=2', {
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `groupid=${groupId}&tags=${selectedTags.join(', ')}`
                }));
            }

            for (const selectedTag of selectedTags) {
                submittedTags.add(selectedTag);
            }

            Promise.allSettled(submits).then(results => {
                submitButton.style.removeProperty('background-color');
                submitButton.textContent = 'Submit';
                submitButton.disabled = false;
                submitButton.style.outline = 'lightgreen 1px solid';

                const rejected = results.filter(r => r.status === "rejected");
                if (rejected.length > 0) {
                    rejected.forEach(i => console.warn(i.reason));
                    alert('Some failed to submit. Check the console');
                    return
                }
                if (settings.refresh_after_submit)
                    location.reload();
            });
        };
    }

})();