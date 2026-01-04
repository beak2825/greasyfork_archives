// ==UserScript==
// @name           HuntHelperEN
// @namespace      https://greasyfork.org/ru/scripts/419814-hunthelperen
// @description    Hunt Helper (upd 2020.12.30)
// @author         achepta
// @version        0.1
// @include        https://www.lordswm.com/group_wars.php*
// @include        https://www.lordswm.com/plstats_hunters.php*
// @include        https://www.lordswm.com/home.php*
// @include        https://www.lordswm.com/map.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @icon           https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @downloadURL https://update.greasyfork.org/scripts/419814/HuntHelperEN.user.js
// @updateURL https://update.greasyfork.org/scripts/419814/HuntHelperEN.meta.js
// ==/UserScript==

// Update by CheckT
// небольшая доработка скрипта hwm_GO_exp от ElMarado (Based on script Mantens)
//    - хранение настроек независимо по игрокам
//    - кнопка "пометить всех птиц"
// Оригинал https://greasyfork.org/ru/scripts/11692-hwm-go-exp

(function () {

//****************************************************
    let mob_rus_exp = {   //Cтруктура: [опыт,HP,код,птица]
        "Pirate Fighters": [30, 16, "bpirate", 0],
        "Exorcists": [121, 80, "zealot", 0],
        "Hell horses": [136, 50, "hellcharger", 0],
        "Hell reapers": [250, 99, "zhryak", 0],
        "Wolfhounds": [33, 15, "hellhound", 0],
        "Iceberg elementals": [50, 90, "iceelb", 1],
        "Angels": [330, 180, "angel", 1],
        "Crossbowmen": [19, 10, "marksman", 0],
        "Archangels": [390, 220, "archangel", 1],
        "Antichrists": [312, 211, "archdemon", 0],
        "Archdevils": [311, 199, "archdevil", 0],
        "Archliches": [110, 55, "archlich", 0],
        "Lorekeepers": [70, 30, "archmage", 0],
        "Poisoners": [33, 14, "assassin", 0],
        "Ayssids": [53, 30, "assida", 1],
        "Mirage dragons": [310, 150, "ghostdragon", 1],
        "Death proclaimers": [205, 110, "banshee", 0],
        "Behemoths": [350, 210, "behemoth", 0],
        "Berserkers": [42, 25, "berserker", 0],
        "Rogues": [30, 16, "maiden", 0],
        "Imps": [6, 4, "imp", 0],
        "Beholders": [33, 22, "beholder", 0],
        "Frenzied griffins": [45, 35, "battlegriffin", 1],
        "Brilliant unicorns": [135, 77, "silverunicorn", 0],
        "Tempered centaurs": [21, 10, "mcentaur", 0],
        "Battlemagi": [72, 29, "battlemage", 0],
        "Fighting elephants": [120, 100, "slon", 0],
        "Vampires": [68, 30, "vampire", 0],
        "Protectors": [36, 20, "warmong", 0],
        "Cursed witches": [30, 20, "cursed_", 1],
        "Sea witches": [70, 35, "priestessup", 0],
        "Trashers": [160, 100, "giant", 0],
        "Giant archers": [130, 100, "giantarch", 0],
        "Great leviathans": [300, 250, "upleviathan", 0],
        "Anchorites": [101, 38, "druideld", 0],
        "Death heralds": [205, 100, "wraith", 0],
        "Tamed wyverns": [170, 90, "wyvern", 1],
        "Fortune genies": [110, 50, "djinn_vizier", 1],
        "Dark sibyls": [185, 90, "matriarch", 0],
        "Water elementals": [57, 43, "water", 0],
        "Chieftains": [100, 48, "chieftain", 0],
        "Air elementals": [59, 30, "air", 1],
        "Mercenary warriors": [25, 24, "mercfootman", 0],
        "Veterans": [12, 12, "shieldguard", 0],
        "Faerie dragons": [800, 500, "faeriedragon", 1],
        "Renegade magicians": [35, 30, "thiefmage", 0],
        "Renegade scouts": [35, 45, "thiefwarrior", 0],
        "Renegade thugs": [35, 40, "thiefarcher", 0],
        "Thrones": [390, 220, "seraph2", 1],
        "Vampire counts": [70, 35, "vampirelord", 0],
        "Demiliches": [100, 55, "masterlich", 0],
        "Harpies": [29, 15, "harpy", 1],
        "Raiding harpies": [45, 15, "harpyhag", 1],
        "Harpooners": [18, 10, "harpooner", 0],
        "Giant lizards": [25, 25, "lizard", 0],
        "Hydras": [108, 80, "hydra", 0],
        "Shadow eyes": [33, 26, "darkeye", 0],
        "Voracious anglerfish": [140, 105, "upseamonster", 0],
        "Ghouls": [17, 23, "rotzombie", 0],
        "Goblins": [5, 3, "goblin", 0],
        "Goblin archers": [9, 3, "goblinarcher", 0],
        "Goblin warlocks": [9, 3, "goblinmag", 0],
        "Goblin trappers": [15, 7, "trapper", 0],
        "Gogs": [13, 13, "gogachi", 0],
        "Death golems": [329, 350, "dgolem", 0],
        "Brutes": [6, 8, "brute", 0],
        "Mountain sentries": [24, 12, "mountaingr", 0],
        "Gremlins": [5, 5, "gremlin", 0],
        "Gremlin wreckers": [9, 6, "saboteurgremlin", 0],
        "Griffins": [59, 30, "griffon", 1],
        "Invokers": [162, 120, "thunderlord", 0],
        "Mistresses": [67, 30, "succubusmis", 0],
        "Lizard cubs": [13, 13, "smalllizard", 0],
        "Genies": [103, 40, "djinn", 1],
        "Senior genies": [110, 45, "djinn_sultan", 1],
        "Savage Treant": [210, 175, "savageent", 0],
        "Earth shamans": [72, 35, "eadaughter", 0],
        "Sky shamans": [75, 35, "sdaughter", 0],
        "Ancient Behemoths": [390, 250, "ancientbehemoth", 0],
        "Ancient mummies": [135, 80, "amummy", 0],
        "Ironroot treefolk": [210, 181, "ancienent", 0],
        "Sprites": [20, 6, "sprite", 1],
        "Druids": [74, 34, "druid", 0],
        "Poltergeists": [27, 20, "poltergeist", 1],
        "Devils": [245, 166, "devil", 0],
        "Vermins": [10, 6, "vermin", 0],
        "Unicorns": [124, 57, "unicorn", 0],
        "Golems": [33, 18, "iron_golem", 0],
        "Priests": [59, 60, "runepriest", 0],
        "Moon Priestesses": [60, 50, "priestmoon", 0],
        "Sun Priestesses": [70, 55, "priestsun", 0],
        "Crusaders": [20, 23, "vindicator", 0],
        "Sentries": [7, 7, "defender", 0],
        "Green dragons": [350, 200, "greendragon", 1],
        "Earth elementals": [63, 75, "earth", 0],
        "Злая крыса 2020": [20, 20, "rat2020", 0],
        "Evil eyes": [33, 22, "evileye", 0],
        "Zombies": [11, 17, "zombie", 0],
        "Jade dragons": [400, 200, "emeralddragon", 1],
        "Royal griffins": [62, 35, "impergriffin", 1],
        "Clerics": [121, 80, "inquisitor", 0],
        "Temptresses": [65, 26, "seducer", 0],
        "Efreeti": [200, 90, "efreeti", 1],
        "Efreeti sultans": [250, 100, "efreetisultan", 1],
        "Gargoyles": [16, 15, "stone_gargoyle", 1],
        "Stone monsters": [20, 28, "kammon", 0],
        "Stonegnawers": [67, 55, "kamnegryz", 0],
        "Stoneeaters": [56, 45, "kamneed", 0],
        "Centaurs": [13, 6, "fcentaur", 0],
        "Dreadlords": [70, 40, "vampireprince", 0],
        "Giants": [350, 175, "colossus", 0],
        "Searing horses": [138, 66, "hellkon", 0],
        "Women corsairs": [32, 12, "piratkaup", 0],
        "Corsairs": [16, 13, "apirate", 0],
        "Brawlers": [27, 20, "brawler", 0],
        "Skeletal dragons": [280, 150, "bonedragon", 1],
        "Centaur outriders": [20, 9, "ncentaur", 0],
        "Nightmares": [140, 66, "nightmare", 0],
        "Red dragons": [400, 235, "reddragon", 1],
        "Farmers": [5, 4, "peasant", 0],
        "Crystal Dragons": [400, 200, "crystaldragon", 1],
        "Vampiric lizards": [30, 35, "redlizard_", 0],
        "Tribal beholders": [500, 235, "bloodeyecyc", 0],
        "Sphynx immortals": [162, 135, "rakshasa_kshatra", 0],
        "Core dragons": [329, 275, "lavadragon", 0],
        "Bandits": [20, 10, "scout", 0],
        "Guardians": [21, 26, "squire", 0],
        "Leviathans": [250, 200, "leviathan", 0],
        "Ice elementals": [50, 45, "iceel", 1],
        "Leprechauns": [11, 7, "leprekon", 0],
        "Sharpshooters": [42, 12, "arcaneelf", 0],
        "Forest hobbits": [9, 6, "bobbit", 0],
        "Liches": [87, 50, "lich", 0],
        "Stalkers": [34, 15, "stalker", 0],
        "Bowmen": [15, 7, "archer", 0],
        "Magi": [63, 18, "mage", 0],
        "Magma dragons": [329, 280, "magmadragon", 0],
        "Lodestone golems": [57, 28, "magneticgolem", 0],
        "Magogs": [16, 13, "megogachi", 0],
        "Manticores": [130, 80, "manticore", 1],
        "Master spearmen": [17, 12, "skirmesher", 0],
        "Grandmaster bowmen": [42, 14, "masterhunter", 0],
        "Termagants": [49, 24, "bloodsister", 0],
        "Bears": [22, 22, "bear", 0],
        "Medusas Queens": [55, 30, "medusaup", 0],
        "Spearmen": [11, 10, "spearwielder", 0],
        "Tamed minotaurs": [39, 31, "minotaur", 0],
        "Minotaur soldiers": [56, 35, "minotaurguard", 0],
        "Minotaur gladiators": [56, 40, "taskmaster", 0],
        "Sepulcher golems": [400, 400, "dgolemup", 0],
        "Warhammerers": [12, 9, "gnomon", 0],
        "Monks": [101, 54, "priest", 0],
        "Sailors` devil": [300, 190, "piratemonster", 0],
        "Anglerfish": [120, 90, "seamonster", 0],
        "Mummies": [115, 50, "mummy", 0],
        "Sphynx mummies": [135, 70, "pharaoh", 0],
        "Rebels": [10, 7, "enforcer", 0],
        "Nagas": [160, 110, "naga", 0],
        "Camel riders": [60, 40, "dromad", 0],
        "Wolf Riders": [20, 10, "wolfrider", 0],
        "Hyena riders": [31, 13, "hyenarider", 0],
        "Boar riders": [31, 14, "boarrider", 0],
        "Dwarven ursary": [24, 25, "bearrider", 0],
        "Lizard cavalry": [65, 40, "darkrider", 0],
        "Camel raiders": [70, 45, "dromadup", 0],
        "Wolf Raiders": [31, 12, "wolfraider", 0],
        "Dryads": [20, 6, "dryad", 1],
        "Enchanted gargoyles": [26, 20, "obsgargoyle", 1],
        "Blazing hounds": [36, 15, "hotdog", 0],
        "Incendiaries": [23, 13, "hornedoverseer", 0],
        "Lava dragons": [255, 230, "firedragon", 0],
        "Firebirds": [117, 65, "firebird", 1],
        "Fire elementals": [60, 43, "fire", 0],
        "Ogres": [60, 50, "ogre", 0],
        "Ogre trophy-hunters": [75, 70, "ogrebrutal", 0],
        "Ogre magi": [74, 65, "ogremagi", 0],
        "Ogre shamans": [74, 55, "ogreshaman", 0],
        "One-eyed pirates": [190, 120, "fatpirateup", 0],
        "Recruits": [7, 6, "conscript", 0],
        "Orcs": [29, 12, "orc", 0],
        "Orc chiefs": [38, 18, "orcchief", 0],
        "Orc tyrants": [38, 20, "orcrubak", 0],
        "Orc shamans": [33, 13, "orcshaman", 0],
        "Paladins": [262, 100, "paladin", 0],
        "Warlords": [83, 40, "executioner", 0],
        "Spiders": [15, 9, "spider", 0],
        "Swordsmen": [17, 16, "footman", 0],
        "Pit demons": [195, 120, "pitlord", 0],
        "Ladons": [115, 125, "deephydra", 0],
        "Cave demons": [157, 110, "pitfiend", 0],
        "Abyss demons": [165, 140, "pity", 0],
        "Women pirates": [20, 10, "piratka", 0],
        "Zombie pirates": [200, 150, "zpirate", 0],
        "Pirates of Cthulhu": [350, 200, "piratemonsterup", 0],
        "Pyromaniacs": [10, 20, "piroman", 0],
        "Ghosts": [26, 8, "ghost", 1],
        "Apparitions": [27, 19, "spectre", 1],
        "Ghosts of pirates": [17, 8, "gpiratka", 1],
        "Shadow dragons": [310, 160, "spectraldragon", 1],
        "Sphynx guardians": [155, 120, "rakshasa_rani", 0],
        "Lizard chargers": [94, 50, "briskrider", 0],
        "Cursed behemoths": [400, 250, "cursedbehemoth", 0],
        "Cursed Gargoyles": [25, 35, "predator", 1],
        "Thunderbirds": [115, 65, "thunderbird", 1],
        "Dark rocs": [120, 60, "darkbird", 1],
        "Dune raiders": [22, 12, "duneraider", 0],
        "Dune assassins": [24, 12, "duneraiderup", 0],
        "Sphynx warriors": [160, 140, "rakshasa_raja", 0],
        "Demons": [14, 13, "horneddemon", 0],
        "Horned reapers": [200, 99, "rapukk", 0],
        "Rocs": [104, 55, "rocbird", 1],
        "Cavalry": [232, 90, "cavalier", 0],
        "Unholy knights": [190, 100, "deadknight", 0],
        "Black knights": [160, 90, "blackknight", 0],
        "Pristine Unicorns": [135, 80, "pristineunicorn", 0],
        "Infuriated behemoths": [410, 280, "dbehemoth", 0],
        "Unfettered cyclops": [700, 225, "untamedcyc", 0],
        "Rearguard ursary": [36, 30, "whitebearrider", 0],
        "Silver pegasus": [50, 30, "spegasus", 1],
        "Strongmen": [20, 50, "kachok", 0],
        "Sirens": [60, 20, "siren", 0],
        "Seducing sirens": [70, 24, "upsiren", 0],
        "Skeletons": [6, 4, "skeleton", 0],
        "Skeletal crossbowmen": [12, 6, "skmarksman", 0],
        "Skeletal legionnaires": [10, 5, "sceletonwar", 0],
        "Skeletal corsairs": [10, 4, "skeletonpirateup", 0],
        "Skeleton sailor": [6, 4, "cpirate", 0],
        "Skeletal bowmen": [10, 4, "skeletonarcher", 0],
        "Skeletal pirates": [7, 4, "skeletonpirate", 0],
        "Scorpions": [6, 4, "scorp", 0],
        "Anubises avatar": [390, 160, "anubis", 0],
        "Snow warriors": [35, 27, "chuvak", 0],
        "Modern golems": [54, 24, "steelgolem", 0],
        "Patriarchs": [100, 70, "runepatriarch", 0],
        "Gremlin engineers": [9, 6, "mastergremlin", 0],
        "Fiends": [20, 13, "jdemon", 0],
        "High Druids": [101, 34, "ddhigh", 0],
        "Enforcers": [23, 12, "mauler", 0],
        "Invaders": [21, 12, "warrior", 0],
        "Plains wolves": [20, 25, "swolf", 0],
        "Tribal goblins": [5, 3, "goblinus", 0],
        "Tribal cyclops": [390, 220, "cyclopus", 0],
        "Grotesques": [25, 16, "elgargoly", 1],
        "Wardens": [16, 8, "crossman", 0],
        "Mercenary archers": [15, 8, "mercarcher", 0],
        "Succubi": [61, 20, "succubus", 0],
        "Dark witches": [157, 80, "shadow_witch", 0],
        "Twilight dragons": [350, 200, "shadowdragon", 1],
        "Forest brethren": [33, 14, "wdancer", 0],
        "Forest keepers": [20, 12, "dancer", 0],
        "Elite forest keepers": [33, 12, "wardancer", 0],
        "Dreadbanes": [131, 100, "thane", 0],
        "Venomous wyverns": [195, 105, "foulwyvern", 1],
        "Lizard assailants": [94, 50, "grimrider", 0],
        "Foul hydras": [115, 125, "foulhydra", 0],
        "Dark Gargoyles": [21, 30, "burbuly", 1],
        "Titans": [400, 190, "titan", 0],
        "Stormcallers": [400, 190, "stormtitan", 0],
        "Troglodytes": [5, 5, "troglodyte", 0],
        "Trolls": [150, 150, "troll", 0],
        "Tengu": [100, 45, "tengu", 1],
        "Commanders": [70, 34, "slayer", 0],
        "Death envoys": [165, 95, "wight", 0],
        "Faeries": [12, 5, "pixel", 1],
        "Phoenixes": [600, 777, "phoenix", 1],
        "Flibustiers": [75, 18, "shootpirateup", 0],
        "Shrews": [49, 16, "fury", 0],
        "Waspworts": [92, 60, "plant", 0],
        "Hobgoblins": [9, 4, "hobgoblin", 0],
        "Frontier ursary": [36, 30, "blackbearrider", 0],
        "Shadow mistresses": [185, 100, "mistress", 0],
        "Cerberi": [41, 15, "cerberus", 0],
        "Cyclops": [172, 85, "cyclop", 0],
        "Cyclop generals": [187, 100, "cyclopod", 0],
        "Cyclop kings": [182, 95, "cyclopking", 0],
        "Cyclops shamans": [190, 105, "shamancyclop", 0],
        "Mercenary sorcerers": [35, 36, "mercwizard", 0],
        "Chargers": [252, 100, "champion", 0],
        "Black scorpions": [9, 5, "scorpup", 0],
        "Crazed trolls": [180, 180, "blacktroll", 0],
        "Spawns": [10, 6, "familiar", 0],
        "Black dragons": [400, 240, "blackdragon", 1],
        "Infected zombies": [15, 17, "plaguezombie", 0],
        "Jackals": [30, 24, "shakal", 0],
        "Jackals-warriors": [45, 30, "shakalup", 0],
        "Shamans": [66, 30, "shamaness", 0],
        "Wild griffins": [62, 52, "battlegriffon", 1],
        "Assault elephants": [150, 110, "slonup", 0],
        "Elven bowmen": [38, 10, "elf", 0],
        "Treefolk": [187, 175, "treant", 0],
        "Venomous spiders": [30, 14, "spiderpois", 0]
//  "Злой Петушок 2017":[60,77,"rooster",1],
//  "Злой пёс 2018":[100,88 ,"evildog",0],
//  "Свин 2019":[16,19,"pig2019",0],
    };
    const gm_prefix = `go_${getPlayerId()}_`;

    const max_exp = 0;
    const version = "0.1";
    const url_cur = location.href;
    const url_home = "home.php";
    const url_map = "map.php";
    const url_war = "group_wars.php";
    const all_tables = document.getElementsByTagName('div');
    let enable_Exp_Half = gm_get("enable_Exp_Half");
    let enable_5_procent = gm_get("enable_5_procent");
    let only_Gud_ExpUm = gm_get("only_Gud_ExpUm");
    let find_Hunt = gm_get("find_Hunt");
    let beep_if_free = gm_get("beep_if_free");
    let grin_Pis = gm_get("grin_Pis");
    let pic_enable = gm_get("pic_enable");
    let show_HP = gm_get("show_HP", true);
    let skip_no_half = gm_get("skip_no_half");
    let pl_level = gm_get("hunt_exp_pl_level", "none");
    let koef = gm_get("koef_dop_exp", 1.0);         //коэф перекача
    let limit_exp = gm_get("limit_exp", 0);              //С какого порога опыта пропускать охоты
    limit_exp = "0" ? 0 : limit_exp
    let skip_mode = gm_get("skip_mode", true);      //Пропускать по опыту или по списку: true - опыт, false - список
    let skip_base = gm_get("skip_base", {});             //h база пропусков на существ: 0 - пропускать, 1 - оставить
    let isSettingsOpened = gm_get("isSettingsOpened", false)


//***********************************************************
    function show_List() {
        let settingsButtonTarget = document.querySelector("#hwm_for_zoom > div.map_text_margin");
        if (url_cur.indexOf('map.php') === -1) return;
        if (skip_mode) {
            let elem = document.getElementById("set_list");
            if (elem != null) {
                removeNode(elem)
            }
            return;
        }
        let settingsButton = `
            <img 
                id="set_list"
                src="https://dcdn.heroeswm.ru/i/combat/btn_chatMessSend.png?v=6" 
                height="18" 
                alt="Hunt settings"
                style="position: relative; margin-bottom: -4px;"
                title="Hunt settings"
            >`;
        if (settingsButtonTarget) {
            settingsButtonTarget.insertAdjacentHTML("beforeend", settingsButton);
        } else {
            return
        }
        addEvent($("set_list"), "click", settings_list);
//************
        function list_close() {
            removeNode($('bgOverlay'))
            removeNode($('bgCenter'))
        }

//************
        function settings_list() {
            let bg = $('bgOverlay');
            let bgc = $('bgCenter');
            const bg_height = ScrollHeight();
            if (!bg) {
                bg = document.createElement('div');
                document.body.appendChild(bg);
                bgc = document.createElement('div');
                document.body.appendChild(bgc);
            }
            bg.id = 'bgOverlay';
            bg.style.position = 'absolute';
            bg.style.left = '0px';
            bg.style.width = '100%';
            bg.style.background = "#000000";
            bg.style.opacity = "0.5";
            bg.style.zIndex = "1100";
            bg.style.top = '0px';
            bg.style.height = `${bg_height}px`;
            bg.style.display = '';
            bgc.id = 'bgCenter';
            bgc.style.position = 'absolute';
            bgc.style.left = `${(ClientWidth() - 420) / 2}px`;
            bgc.style.width = '475px';
            bgc.style.height = '475px';
            bgc.style.overflow = 'auto';            //scrolling
            bgc.style.background = "#F6F3EA";
            bgc.style.zIndex = "1105";
            bgc.style.top = `${window.pageYOffset + 155}px`;
            bgc.style.display = '';
            addEvent(bg, "click", list_close);
            const s_style = `
<style>
.cre_mon_image2 {position:absolute;top:0;left:0;}
.cre_creature {font-weight:400;font-family: 'Arial',sans-serif; width: 60px; position: relative; letter-spacing: normal;font-size: 16px; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; display:inline-block;}
</style>`;
            let s_innerHTML = `
${s_style}
<div style="border:0 solid #abc;padding:5px;margin:2px;">
<div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr2" title="Close">x</div>
<table>
    <tr>
        <td colspan=2>
            <b>Choose creatures. There are <span style="color:#FF0000;"> ${amountOfMonsters}</span> of them.</b>
            <hr/>
        </td>
    </tr>
    <tr>
        <td colspan=2>
            <input type="submit" id="set_all_mark_ok"   value="All">
            <input type="submit" id="set_all_flying_ok" value="Flying">
            <input type="submit" id="set_all_noflying_ok" value="Except flying">
            <input type="submit" id="set_all_unmark_ok" value="Unmark all">
        </td>
    </tr>`;
            let n_m = 0;
            let s_bgcolor;
            let s_pic_out = "";
            for (let key in mob_rus_exp) {
                if (skip_base[n_m] === "1") {
                    s_bgcolor = `style=background-color:#B0FFB0;`;
                } else {
                    s_bgcolor = "";
                }
                if (pic_enable) {
                    s_pic_out = `
                    <tr>
                        <td>
                            <div class="cre_creature">
                            <img width="60" height="50" src="https://dcdn1.heroeswm.ru/i/portraits/${mob_rus_exp[key][2]}anip33.png" alt=""> 
                            <img class="cre_mon_image2" width="60" height="50" src="https://dcdn1.heroeswm.ru/i/army_html/frame_lvl1_120x100_woa.png?v=1" alt="">
                            </div>
                        </td>`;
                }
                s_innerHTML += `
                        ${s_pic_out}
                        <td ${s_bgcolor} id=cell_${n_m}>
                            <label><input type=checkbox ${skip_base[n_m] == 1 ? "checked" : ""} id=set_monstr_${n_m}><span style="font-size:16px; vertical-align:center">${key}</span></label>
                        </td>
                    </tr>`;
                n_m++;
            }
            s_innerHTML += '</table></div>';
            bgc.innerHTML = s_innerHTML;
            n_m = 0;
//********* назначение событий *******
            for (let key in mob_rus_exp) {
                appendEvent(n_m++);
            }
            document.getElementById('set_all_mark_ok').onclick = function () {
                all_mark_ok("F")
            };        //Пометить все
            document.getElementById('set_all_flying_ok').onclick = function () {
                all_flying_mark()
            };     //Пометить летающих
            document.getElementById('set_all_noflying_ok').onclick = function () {
                all_noflying_mark()
            }; //Кроме летающих
            document.getElementById('set_all_unmark_ok').onclick = function () {
                all_mark_ok("0")
            };      //Сбросить все
            addEvent($("bt_close_tr2"), "click", list_close);
        }

//********* обработчики полей ввода *******
        function appendEvent(n) {
            document.getElementById(`set_monstr_${n}`).onclick = function () {
                change_enable_mostr(n)
            };
        }

        function change_enable_mostr(n) {
            let s_bgcolor;
            skip_base = skip_base.substr(0, n) + (1 - skip_base[n]) + skip_base.substr(n + 1);
            if (skip_base[n] === "1") s_bgcolor = "#B0FFB0"; else s_bgcolor = "";
            document.getElementById(`cell_${n}`).style.backgroundColor = s_bgcolor;
            gm_set("skip_base", skip_base);
        }

        function all_mark_ok(zn) {
            let n = 0;
            let s_bgcolor;
            let bool = true;
            if (zn === "0") bool = false;
            for (let key in mob_rus_exp) {
                if (skip_base[n] === "1") s_bgcolor = "#B0FFB0"; else s_bgcolor = "";
                document.getElementById(`cell_${n}`).style.backgroundColor = s_bgcolor;
                document.getElementById('set_monstr_' + n++).checked = bool;
            }
            gm_set("skip_base", skip_base);
        }

        function all_flying_mark() {
            let n = 0;
            for (let key in mob_rus_exp) {
                if (mob_rus_exp[key][3] === 1) {
                    skip_base = `${skip_base.substr(0, n)}1${skip_base.substr(n + 1)}`;
                    document.getElementById(`cell_${n}`).style.backgroundColor = "#B0FFB0";
                    document.getElementById(`set_monstr_${n}`).checked = true;
                }
                n++;
            }
            gm_set("skip_base", skip_base);
        }

        function all_noflying_mark() {
            let n = 0;
            for (let key in mob_rus_exp) {
                if (mob_rus_exp[key][3] === 0) {
                    skip_base = `${skip_base.substr(0, n)}1${skip_base.substr(n + 1)}`;
                    document.getElementById(`cell_${n}`).style.backgroundColor = "#B0FFB0";
                    document.getElementById(`set_monstr_${n}`).checked = true;
                }
                n++;
            }
            gm_set("skip_base", skip_base);
        }

//************
        function $(id) {
            return document.querySelector(`#${id}`);
        }

        function addEvent(elem, evType, fn) {
            elem.addEventListener(evType, fn, false)
        }

        function ClientWidth() {
            return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
        }

        function ScrollHeight() {
            return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        }
    }

//************  Начало фрагментов кода от (C) Demin с моими вставками и комментариями **********************************
    function showSettings() {
        let settingsButtonTarget = document.querySelector("#hwm_for_zoom > div.map_text_margin");
        let settingsButton = `
            <img 
                id="set_go" 
                src="https://dcdn3.heroeswm.ru/i/combat/btn_settings.png?v=8" 
                height="18" 
                alt="Hunt settings"
                style="position: relative; margin-bottom: -4px; filter: drop-shadow(0.01rem 0.01rem 0 black) drop-shadow(-0.01rem -0.01rem 0 black);"
                title="Hunt settings"
            > ${isSettingsOpened ? "" : " <---- HUNT SETTINGS"}`;
        if (settingsButtonTarget) {
            settingsButtonTarget.insertAdjacentHTML("beforeend", settingsButton);
        } else {
            return
        }
        addEvent($("set_go"), "click", settings_go);
//************
        function settings_go_close() {
            removeNode($('bgOverlay'))
            removeNode($('bgCenter'))
        }

//************
        function settings_go() {
            if (!isSettingsOpened) {
                gm_set("isSettingsOpened", true)
            }
            let bg = $('bgOverlay');
            let bgc = $('bgCenter');
            const bg_height = ScrollHeight();
            if (!bg) {
                bg = document.createElement('div');
                document.body.appendChild(bg);
                bgc = document.createElement('div');
                document.body.appendChild(bgc);
            }
            bg.id = 'bgOverlay';
            bg.style.position = 'absolute';
            bg.style.left = '0px';
            bg.style.width = '100%';
            bg.style.background = "#000000";
            bg.style.opacity = "0.5";
            bg.style.zIndex = "1100";
            bgc.id = 'bgCenter';
            bgc.style.position = 'absolute';
            bgc.style.left = `${(ClientWidth() - 600) / 2}px`;
            bgc.style.width = '600px';
            bgc.style.background = "#F6F3EA";
            bgc.style.zIndex = "1105";
            addEvent(bg, "click", settings_go_close);
            //форма и внешний вид окно настроек
            //общая рамка
            bgc.innerHTML = `
<div style="border:1px solid #abc;padding:5px;margin:2px;">
    <table>
        <tr>
            <td colspan=3><b>Hunt Helper. version: <span style="color:#0070FF;">${version}</span>. <span style="color:#FF0000;">${amountOfMonsters}</span> creatures.</b>
                <div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr" title="Close">x</div>
                <hr/>
                <label><input type=checkbox ${html_if_checked(show_HP)} id=set_show_HP title=""> Show <b>total HP of creatures</b></label>
                <br>
                <label><input type=checkbox ${html_if_checked(enable_Exp_Half)} id=set_enable_Exp_Half title=""> Show <b>exp with partner</b>, if both kill 50%</label>
                <br>
                <label><input type=checkbox ${html_if_checked(enable_5_procent)} id=set_enable_5_procent title=""> SHow how many to kill <b>for minimum growth</b></label>
                <hr/>
                <label><input type=checkbox ${html_if_checked(only_Gud_ExpUm)} id=set_only_Gud_ExpUm title=""> Highlight <b>hunts with good exp ratio</b> <span style="color: grey; ">(on combats page)</span></label>
                <br>
                <label><input type=checkbox ${html_if_checked(find_Hunt)} id=set_find_Hunt title=""> <b>Fing hunts on combats page</b>. Reload: <b>5с.</b> </label>
                <label>If found, <b>make sound</b>:<input type=checkbox ${html_if_checked(beep_if_free)} id=set_beep_if_free title=""></label>
                <hr/>
                <label><input type=checkbox ${html_if_checked(grin_Pis)} id=set_Grin_Pis title=""> <b><span  style="color: green; font-size: small; ">&nbspGreenPeace&nbsp</span></b>(remove hunts)</label>
                <hr/>
            </td>
        </tr>
        <tr>
            <td colspan=3>Additional exp koef:&nbsp<span style="color:#0070FF;"><b id=k_p>${Number(koef).toFixed(4)}</b></span>
                <br>Write new additional exp koef от 1.0 до 9.9999: <input id="set_koef" value="${Number(koef).toFixed(4)}" size="4" maxlength="6"> <input type="submit" id="set_koef_ok" value="OK">
                <hr/>Skip creatures: 
                <label><input type=checkbox ${skip_mode === true ? "checked" : ""} id=set_skip_mode1 title="">by exp or </label>
                <label><input type=checkbox ${skip_mode === false ? "checked" : ""} id=set_skip_mode2 title="">by list </label>
                <label> and <b><span style="color: royalblue; ">(</span></b>keep [1/2] or <img width="16" height="16" title="Diamonds" src="https://dcdn.heroeswm.ru/i/r/48/diamonds.png?v=3.23de65" alt="Diamonds">
                <input type=checkbox ${skip_no_half === 1 ? "checked" : ""} id=set_skip_no_half title=""><b><span style="color:#4169E1;">)</span></b></label>
            </td>
        </tr>
        <tr>
            <td>Skip fith exp higher than:</td>
            <td colspan=2 title="If 0, then not applicable"> <input id="set_limit_exp" value="${limit_exp}" size="5" maxlength="6"><input type="submit" id="set_limit_exp_ok" value="OK"></td>
        </tr>
        <tr>
            <td colspan=3><label><input type=checkbox ${html_if_checked(pic_enable)} id=set_pic_enable title=""> Show pictures in the list</label>
                
            </td>
        </tr>
    </table>
</div>`;

            //назначение вызова функция при событиях кнопок и чекбоксов
            addEvent($("bt_close_tr"), "click", settings_go_close);       //крестик в углу
            addEvent($("set_enable_Exp_Half"), "click", change_enable_Exp_Half);  //чек-бокс
            addEvent($("set_enable_5_procent"), "click", change_enable_5_procent); //чек-бокс
            addEvent($("set_only_Gud_ExpUm"), "click", change_only_Gud_ExpUm);   //чек-бокс
            addEvent($("set_find_Hunt"), "click", change_find_Hunt);        //чек-бокс
            addEvent($("set_beep_if_free"), "click", change_beep_if_free);     //чек-бокс
            addEvent($("set_show_HP"), "click", change_show_HP);          //чек-бокс
            addEvent($("set_Grin_Pis"), "click", change_Grin_Pis);         //чек-бокс
            addEvent($("set_koef_ok"), "click", change_koef);             //поле ввода
            addEvent($("set_limit_exp_ok"), "click", change_limit_exp);        //поле ввода
            addEvent($("set_skip_mode1"), "click", change_skip_mode);        //радио
            addEvent($("set_skip_mode2"), "click", change_skip_mode);        //радио
            addEvent($("set_skip_no_half"), "click", change_skip_no_half);     //радио
            addEvent($("set_pic_enable"), "click", change_pic_enable);       //чек-бокс
            bg.style.top = '0px';
            bg.style.height = `${bg_height}px`;
            bgc.style.top = `${window.pageYOffset + 155}px`;
            bg.style.display = '';
            bgc.style.display = '';
        }

//********* обработчики полей ввода *******
        function change_skip_mode() {
            skip_mode = !skip_mode;
            document.getElementById('set_skip_mode1').checked = skip_mode;
            document.getElementById('set_skip_mode2').checked = !skip_mode;
            show_List();
            gm_set("skip_mode", skip_mode);
        }

        function change_koef() {
            if (Number($("set_koef").value) >= 1) koef = $("set_koef").value; else koef = Number(1.0);
            document.getElementById('k_p').innerHTML = Number(koef).toFixed(4);
            gm_set("koef_dop_exp", koef);
        }

        function change_limit_exp() {
            if (Number($("set_limit_exp").value) >= 0) {
                limit_exp = Number($("set_limit_exp").value).toFixed(0);
            } else {
                limit_exp = 0;
            }
            gm_set("limit_exp", limit_exp);
        }

//*********** обработчики чек-боксов *****
        function change_skip_no_half() {
            gm_set("skip_no_half", skip_no_half = !skip_no_half);
        }

        function change_enable_Exp_Half() {
            gm_set("enable_Exp_Half", enable_Exp_Half = !enable_Exp_Half);
        }

        function change_enable_5_procent() {
            gm_set("enable_5_procent", enable_5_procent = !enable_5_procent);
        }

        function change_only_Gud_ExpUm() {
            gm_set("only_Gud_ExpUm", only_Gud_ExpUm = !only_Gud_ExpUm);
        }

        function change_find_Hunt() {
            gm_set("find_Hunt", find_Hunt = !find_Hunt);
        }

        function change_beep_if_free() {
            gm_set("beep_if_free", beep_if_free = !beep_if_free);
        }

        function change_show_HP() {
            gm_set("show_HP", show_HP = !show_HP);
        }

        function change_Grin_Pis() {
            gm_set("grin_Pis", grin_Pis = !grin_Pis);
        }

        function change_pic_enable() {
            gm_set("pic_enable", pic_enable = !pic_enable);
        }

//********** непонятно что, взято 1:1 у Demin ******
        function $(id) {
            return document.querySelector(`#${id}`);
        }

        function addEvent(elem, evType, fn) {
            elem.addEventListener(evType, fn, false)
        }

        function ClientWidth() {
            return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
        }

        function ScrollHeight() {
            return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        }
    }

//************  Конец фрагментов кода от (C) Demin **********************************
    const sectors = {
        "cx=50&cy=50": 1,  //Empire Capital
        "cx=51&cy=50": 2,  //East River
        "cx=50&cy=49": 3,  //Tiger Lake
        "cx=51&cy=49": 4,  //Rogues' Wood
        "cx=50&cy=51": 5,  //Wolf Dale
        "cx=50&cy=48": 6,  //Peaceful Camp
        "cx=49&cy=51": 7,  //Lizard Lowland
        "cx=49&cy=50": 8,  //Green Wood
        "cx=49&cy=48": 9,  //Eagle Nest
        "cx=50&cy=52": 10, //Portal Ruins
        "cx=51&cy=51": 11, //Dragon Caves
        "cx=49&cy=49": 12, //Shining Spring
        "cx=48&cy=49": 13, //Sunny Sity
        "cx=52&cy=50": 14, //Magma Mines
        "cx=52&cy=49": 15, //Bear Mountain
        "cx=52&cy=48": 16, //Fairy Trees
        "cx=53&cy=50": 17, //Harbour City (Port City)
        "cx=53&cy=49": 18, //Mithril Coast
        "cx=51&cy=52": 19, //GreatWall
        "cx=51&cy=53": 20, //Titans' Valley
        "cx=52&cy=53": 21, //Fishing Village
        "cx=52&cy=54": 22, //Kingdom Capital
        "cx=48&cy=48": 23, //Ungovernable Steppe
        "cx=51&cy=48": 24, //Crystal Garden
        "cx=53&cy=52": 25, //East Island
        "cx=49&cy=52": 26, //The Wilderness
        "cx=48&cy=50": 27  //Sublime Arbor
    };
    let amountOfMonsters = Object.keys(mob_rus_exp).length;

// ********* считывание уровня героя **********
    function getLevel() {
        if (!url_cur.includes(url_home)) {
            return;
        }
        gm_set("hunt_exp_pl_level", document.body.innerText.match(/(Боевой уровень|Combat level): (\d{1,2})/)[2]);
    }

// ***************************************************
    function needSkip(skip, mob, experience, half)  //нужно ли пропускать моба?
    {
        if ((!skip_no_half) || (half)) {  //Если режим поиска половинок, а это не половинка, то пропускаем
            if (skip_mode) {
                if ((limit_exp === 0) || (experience * 1 <= limit_exp * 1)) skip = false;
            } else {
                let n = 0;
                for (let key in mob_rus_exp) {
                    if ((key === mob) && (skip_base[n] === "1")) {
                        skip = false;
                        return skip;
                    }
                    n++;
                }
            }
        }
        return skip;
    }

//****************************************************
    function skip_hunt() {  //пропустить охоту
        const x = document.querySelector("div >a[href*='ecostat.php']");
        if (x == null) return;
        document.title = "ГO. Охоту пропускаю.";
        setTimeout(function () {
            window.location.href = `${location.protocol}//${location.hostname}/map.php?action=skip`;
        }, 2000);
    }

// ***************************************************
    function showExperience() {
        if (url_cur.indexOf(url_map) === -1) {
            return;
        }
        let total_exp, full_exp, next_count, exp_with_helper, next_half_count, min_count, exp_min_count,
            next_min_count, mob_HP;
        let str_hunt, str_total_exp, next_level;//, min_kills, exp_min_kills;
        let mob_name = "";
        let str_dop = "";
        let mob_exp = 0;
        let hunt_available = false;
        let half_hunt = false;
        let diamand_hunt = false;
        let half_diamond_hunt = false;
        let skip_all_mob = true;
        for (let k = 0; k < all_tables.length; k++) {
            if (all_tables[k].className === "wbwhite ohota_block map_table_margin") {
                // if (all_tables[k].childNodes[1].childNodes[0].childNodes[0].childNodes[0].tagName != "DIV") continue;
                // if (all_tables[k].childNodes[1].childNodes[0].children.length < 2) {break;}
                // my_td_danger = all_tables[k].childNodes[1];
                //if (!my_td_danger){ return; } //no hunt...

                str_hunt = all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML;
                const mob_count_b = all_tables[k].childNodes[1].childNodes[0].childNodes[0].childNodes[3].innerHTML;
                half_hunt = str_hunt.indexOf("[1/2]") !== -1; //это половинка?
                diamand_hunt = str_hunt.indexOf("diamonds") !== -1; //это brilliant?
                half_diamond_hunt = diamand_hunt || half_hunt;

                let mob_count = mob_count_b
                mob_name = all_tables[k].childNodes[1].childNodes[0].childNodes[0].childNodes[1].innerText;
                let mob_data = mob_rus_exp[mob_name];
                if (!mob_data) {
                    //новый моб
                    mob_data = [0, 0, "new mob", 0];
                }
                if (show_HP) {
                    mob_HP = mob_data[1] * mob_count;
                    str_hunt = str_hunt.replace("шт.", `шт. <span style="font-size:10px;color:#CD00CD">HP:<B>${mob_HP}</B></span>`);
                    all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML = str_hunt;
                }
                mob_exp = mob_data[0];
                hunt_available = true;

                total_exp = Math.round(mob_exp * mob_count / 5);          //Полный опыт в одиночку
                full_exp = total_exp;
                next_count = (mob_count * 1.3).toFixed(0);         //Прирост при победе в одиночку

                exp_with_helper = (total_exp / 2).toFixed(0);           //Опыт с помощником (50/50)
                next_half_count = (mob_count * Math.pow(1.3, 0.5)).toFixed(0);        //Прирост при победе с помощником (50/50)

                min_count = (mob_count / 5 - 0.5).toFixed(0);       //Для минимального 5% прироста
                exp_min_count = (Math.floor(mob_exp * min_count / 5)).toFixed(0);     //Опыт при минимальном приросте
                next_min_count = (mob_count * Math.pow(1.3, 0.2)).toFixed(0);        //Прирост при убийстве <=20% будет ~5.4%
                total_exp = total_exp > pl_level * 500 ? pl_level * 500 : total_exp;      //Если опыт больше верхней отсечки по уровню
                exp_with_helper = exp_with_helper > pl_level * 500 ? pl_level * 500 : exp_with_helper;
                exp_min_count = exp_min_count > pl_level * 500 ? pl_level * 500 : exp_min_count;
                if (pl_level > 2) {                   //Если опыт меньше нижней отсечки по уровню (3+ уровни)
                    total_exp = total_exp < pl_level * 100 ? pl_level * 100 : total_exp;
                    exp_with_helper = exp_with_helper < pl_level * 35 ? pl_level * 35 : exp_with_helper;
                    exp_min_count = exp_min_count < pl_level * 14 ? pl_level * 14 : exp_min_count;
                }
                total_exp = (total_exp * koef).toFixed(0);
                exp_with_helper = (exp_with_helper * koef).toFixed(0);
                exp_min_count = (exp_min_count * koef).toFixed(0);
//-------------- Вставим кусок кода ---------------
                skip_all_mob = needSkip(skip_all_mob, mob_name, full_exp, half_diamond_hunt);
//alert(needSkip(true,mob_name,full_exp,half_hunt)+' skip_mode: '+skip_mode);
                if ((!needSkip(true, mob_name, full_exp, half_diamond_hunt))) {//&& (!skip_mode)) { //Если есть ли моб в нашем списке
                    all_tables[k].childNodes[1].style.background = "#d1ffd1";
                }
//-------------------------------------------------
// total_exp - опыт с учетом коэф. перекача
                str_total_exp = total_exp;
                next_level = Number(pl_level) + 1;
                if (total_exp > max_exp && max_exp > 0) {
                    all_tables[k].childNodes[0].style.background = '#FFA07A';
                }
                if (total_exp !== full_exp) str_dop = ' (of ' + full_exp + ')'; else str_dop = "";
                str_total_exp = `<br> <span style="font-size:10px;color:#0000CD">You will get<b> ${str_total_exp}${str_dop} </b> exp from them. After killing they will be ~${next_count}</span>`;
                if ((total_exp < next_level * 100) && (pl_level > 1)) {
                    str_total_exp += `<br> <span style="color:#0000CD">Kill now! On ${next_level} CL you will get <b> ${next_level * 100} </b> exp.</span>`;
                }

                if (enable_Exp_Half) {
                    str_total_exp = `${str_total_exp}<br> <span style="font-size:10px;color:#CD00CD">With partner (50/50) you will get <b> ${exp_with_helper} </b> exp. After killing they will be ~${next_half_count}</span>`
                }

                if (enable_5_procent) {
                    str_total_exp = `${str_total_exp}<span style="font-size:11px;color:#007FFF"><i style="text-align: center;">for Min (~5%) growth you need to kill ${min_count} of them (${exp_min_count} exp). After killing they will be ~${next_min_count}</i></span>`
                }

                all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML = str_hunt + str_total_exp;
            }
        }
        if (skip_all_mob && hunt_available) {
            skip_hunt();
        }
        if (!skip_all_mob && hunt_available && ((limit_exp !== 0) || (!skip_mode))) {
            document.title = "ГO. Охота найдена.";
        }
    }

//****************************************************
    function helpers() { //анализ страницы групповых боев
        if (url_cur.indexOf(url_war) === -1) {
            return;
        }
        let elem, elem2, str_hunt, mob_count, mob_name, total_exp, backgrn, sect, s_sect;
        let dt = 3000;
//var alr = 0;


        let ems = document.querySelectorAll("a[href*='map.php?cx']");
        for (let i = 0; i < ems.length; i++) {
            if (!ems[i].parentNode.parentNode.childNodes[6].childNodes[4]) {
                elem = ems[i].parentNode.parentNode.childNodes[6].childNodes[3].childNodes[0]; //odin v drugom sektore ili inoi level
            } else if (!ems[i].parentNode.parentNode.childNodes[6].childNodes[6]) {
                elem = ems[i].parentNode.parentNode.childNodes[6].childNodes[5].childNodes[0]; //odin v moem sektore
                elem2 = elem.parentNode.parentNode.childNodes[3].childNodes[0]; //
                if ((beep_if_free) && (elem2.tagName === 'B')) {
                    new Audio("http://www.soundjay.com/button//button-46.mp3").play().then(null); //button-46,47, beep-027
                    dt = 15000;
                }
            } else {
                elem = ems[i].parentNode.parentNode.childNodes[6].lastChild.childNodes[0]; //dvoe v moem ili drugom sektore
            }
            str_hunt = elem.innerHTML;
            mob_count = str_hunt.substring(str_hunt.search(/\(/) + 1, str_hunt.search(/\)/));
            mob_name = str_hunt.substring(0, str_hunt.search(/\(/));
            total_exp = Math.floor(mob_rus_exp[mob_name][0] * mob_count / 5);
            backgrn = '';
            if (elem.parentNode.parentNode.childElementCount !== 5) {
                s_sect = ems[i].href;
                sect = s_sect.substring(s_sect.lastIndexOf("?") + 1, s_sect.length);
                s_sect = s_sect.replace(`map.php?${sect}`, `move_sector.php?id=${sectors[sect]}`);
                ems[i].innerHTML += '<br><span style="color:#FF3244;"><b>Перейти</b></span>';
                ems[i].href = s_sect;
            }
            if (only_Gud_ExpUm && (total_exp < pl_level * 133)) {
                backgrn = ' background:#cfd';
            }
            if (only_Gud_ExpUm && (total_exp < pl_level * 100)) {
                backgrn = ' background:#0f0';
            }
            elem.innerHTML += `<span style="font-size:12px; color:#013220;${backgrn}"><b> ${total_exp}</b></span>&nbspопыта.`;
            if (show_HP) {
                const mob_data = mob_rus_exp[mob_name];
                let mob_HP = mob_data[1] * mob_count;
                elem.innerHTML += ` <span style="font-size:10px;color:#CD00CD">HP:<B>${mob_HP}</B></span>`
            }
        }
        if (find_Hunt) setTimeout(function () {
            window.location.href = `${location.protocol}//${location.hostname}/group_wars.php?filter=hunt`;
        }, dt);
    }

//****************************************************
    function hideHunt() { //режим гринпис - скрытие отображения охот
        Array
            .from(document.getElementsByClassName("ohota_block"))
            .forEach(hunt => hunt.parentNode.removeChild(hunt))
    }

//****************************************************
    function highlightHuntHref() { //заменяет ссылку в групповые бои на такую же с выделением свободных охот
        Array
            .from(document.getElementsByTagName("a"))
            .filter(a => a.href.match("group_wars.php"))
            .forEach(a => a.href += "?filter=hunt")
    }

//****************************************************
    getLevel();
    showSettings();
    show_List();
    grin_Pis ? hideHunt() : showExperience();
    helpers();
    highlightHuntHref();

    function gm_get(key, def) {
        let result = JSON.parse(localStorage[gm_prefix + key] === undefined ? null : localStorage[gm_prefix + key]);
        return  result == null ? def : result;

    }

    function gm_set(key, val) {
        localStorage[gm_prefix + key] = JSON.stringify(val);
    }

    function getPlayerId() {
        return getCookie("pl_id")
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function removeNode(node) {
        node.parentNode.removeChild(node)
    }
    function html_if_checked(val) {
        return val ? ' checked' : '';
    }
})();