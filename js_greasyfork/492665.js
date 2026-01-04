    // ==UserScript==
    // @name           battleHelper (fixed)
    // @author         
    // @namespace      
    // @description    Исправленный и рабочий battleHelper
    // @version        0.38
    // @include        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(war|warlog|leader_guild|leader_army|inventory).php(?!.?setkamarmy)/
    // @grant          GM_xmlhttpRequest
    // @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492665/battleHelper%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492665/battleHelper%20%28fixed%29.meta.js
    // ==/UserScript==
     
    (function() {
        if (location.pathname.indexOf("leader_guild.php") >= 0) {
            var turnId = {amummy:{id:933,hp:80},acrossbowman:{id:1021,hp:24},air:{id:153,hp:30},ancienent:{id:238,hp:181},ancientpig:{id:691,hp:15},angel:{id:132,hp:180},anubis:{id:917,hp:160},arcaneelf:{id:261,hp:12},archer:{id:2,hp:7},archlich:{id:146,hp:55},archmage:{id:104,hp:30},armorgnom:{id:982,hp:55},assassin:{id:56,hp:14},assida:{id:847,hp:30},axegnom:{id:985,hp:10},banditka:{id:729,hp:8},banshee:{id:515,hp:110},battlegriffin:{id:36,hp:35},battlegriffon:{id:493,hp:52},battlemage:{id:578,hp:29},battlerager:{id:960,hp:30},bear:{id:172,hp:22},bearrider:{id:161,hp:25},behemoth:{id:131,hp:210},berserker:{id:163,hp:25},bigspider:{id:724,hp:55},blackbearrider:{id:162,hp:30},blackknight:{id:272,hp:90},blackwidow:{id:661,hp:14},bloodsister:{id:315,hp:24},boar:{id:690,hp:17},boarrider:{id:318,hp:14},bobbit:{id:895,hp:6},bonedragon:{id:133,hp:150},brawler:{id:114,hp:20},brigand:{id:725,hp:5},briskrider:{id:316,hp:50},brute:{id:254,hp:8},cavalier:{id:90,hp:90},cbal:{id:791,hp:65},cerberus:{id:75,hp:15},champion:{id:495,hp:100},chieftain:{id:436,hp:48},colossus:{id:106,hp:175},conscript:{id:34,hp:6},cpirate:{id:677,hp:4},crossman:{id:257,hp:8},crusader:{id:672,hp:30},cursed:{id:522,hp:20},cursedent:{id:664,hp:215},cyclop:{id:89,hp:85},cyclopking:{id:237,hp:95},cyclopod:{id:537,hp:100},dancer:{id:25,hp:12},darkbird:{id:544,hp:60},darkrider:{id:51,hp:40},ddhigh:{id:587,hp:34},deephydra:{id:149,hp:125},defender:{id:157,hp:7},devil:{id:82,hp:166},dgolem:{id:520,hp:350},diamondgolem:{id:660,hp:60},djinn:{id:39,hp:40},djinn_sultan:{id:105,hp:45},djinn_vizier:{id:579,hp:50},druid:{id:26,hp:34},druideld:{id:120,hp:38},dryad:{id:255,hp:6},eadaughter:{id:333,hp:35},earth:{id:154,hp:75},efreeti:{id:280,hp:90},elf:{id:19,hp:10},elgargoly:{id:256,hp:16},enforcer:{id:35,hp:7},executioner:{id:335,hp:40},familiar:{id:80,hp:6},fatpirate:{id:651,hp:100},fatpirateup:{id:652,hp:120},fcentaur:{id:310,hp:6},fire:{id:155,hp:43},firebird:{id:536,hp:65},firedragon:{id:168,hp:230},flamelord:{id:958,hp:120},footman:{id:10,hp:16},foulhydra:{id:746,hp:125},foulwyvern:{id:337,hp:105},fury:{id:53,hp:16},ghost:{id:11,hp:8},giant:{id:792,hp:100},giantarch:{id:817,hp:100},gnomon:{id:728,hp:9},goblin:{id:14,hp:3},goblinarcher:{id:314,hp:3},goblinmag:{id:545,hp:3},goblinus:{id:329,hp:3},gogachi:{id:285,hp:13},greendragon:{id:103,hp:200},gremlin:{id:9,hp:5},griffon:{id:3,hp:30},grimrider:{id:121,hp:50},harpooner:{id:378,hp:10},harpy:{id:200,hp:15},harpyhag:{id:201,hp:15},hellcharger:{id:76,hp:50},hellhound:{id:74,hp:15},hellkon:{id:290,hp:66},highwayman:{id:730,hp:24},hobgoblin:{id:33,hp:4},horneddemon:{id:77,hp:13},hornedoverseer:{id:79,hp:13},hotdog:{id:288,hp:15},hydra:{id:50,hp:80},hyenarider:{id:859,hp:14},imp:{id:78,hp:4},impergriffin:{id:117,hp:35},inquisitor:{id:145,hp:80},iron_golem:{id:12,hp:18},jdemon:{id:289,hp:13},kachok:{id:601,hp:50},kamneed:{id:202,hp:45},kamnegryz:{id:203,hp:55},leprekon:{id:610,hp:7},lich:{id:29,hp:50},mage:{id:16,hp:18},magneticgolem:{id:259,hp:28},maiden:{id:49,hp:16},manticore:{id:754,hp:80},marksman:{id:42,hp:10},mastergremlin:{id:32,hp:6},masterhunter:{id:72,hp:14},masterlich:{id:341,hp:55},matriarch:{id:239,hp:90},mauler:{id:320,hp:12},mcentaur:{id:309,hp:10},medusa:{id:752,hp:25},medusaup:{id:753,hp:30},megogachi:{id:287,hp:13},mercarcher:{id:20,hp:8},mercfootman:{id:21,hp:24},minotaur:{id:55,hp:31},minotaurguard:{id:70,hp:35},mistress:{id:745,hp:100},mountaingr:{id:339,hp:12},mummy:{id:268,hp:50},ncentaur:{id:311,hp:9},negro:{id:849,hp:17},nightmare:{id:150,hp:66},nomad:{id:897,hp:30},obsgargoyle:{id:44,hp:20},ocean:{id:848,hp:30},ogre:{id:24,hp:50},ogrebrutal:{id:535,hp:70},ogremagi:{id:119,hp:65},ogreshaman:{id:855,hp:55},orc:{id:23,hp:12},orcchief:{id:73,hp:18},orcrubak:{id:534,hp:20},orcshaman:{id:546,hp:13},outlaw:{id:727,hp:6},outlawup:{id:896,hp:8},peasant:{id:4,hp:4},pegasus:{id:625,hp:30},pikeman:{id:1004,hp:15},piratemonster:{id:644,hp:190},piratka:{id:649,hp:10},piratkaup:{id:650,hp:12},pitfiend:{id:83,hp:110},pitlord:{id:236,hp:120},pity:{id:291,hp:140},pixel:{id:17,hp:5},plaguezombie:{id:40,hp:17},plant:{id:624,hp:60},poltergeist:{id:512,hp:20},priest:{id:37,hp:54},priestess:{id:852,hp:35},priestessup:{id:853,hp:35},pristineunicorn:{id:588,hp:80},rakshasa_kshatra:{id:580,hp:135},rakshasa_raja:{id:108,hp:140},rakshasa_rani:{id:93,hp:120},rapukk:{id:283,hp:99},reptiloid:{id:850,hp:80},reptiloidup:{id:851,hp:90},robber:{id:726,hp:5},rocbird:{id:30,hp:55},rotzombie:{id:270,hp:23},runekeeper:{id:961,hp:65},runepatriarch:{id:165,hp:70},runepriest:{id:164,hp:60},saboteurgremlin:{id:253,hp:6},satyr:{id:626,hp:36},savageent:{id:589,hp:175},sceletonwar:{id:267,hp:5},scout:{id:52,hp:10},sdaughter:{id:332,hp:35},seducer:{id:485,hp:26},shadowdragon:{id:102,hp:200},shadow_witch:{id:94,hp:80},shamancyclop:{id:860,hp:105},shamaness:{id:331,hp:30},shieldguard:{id:158,hp:12},shootpirate:{id:646,hp:15},shootpirateup:{id:647,hp:18},silverunicorn:{id:147,hp:77},skeleton:{id:1,hp:4},skeletonarcher:{id:28,hp:4},skeletonpirate:{id:604,hp:4},skeletonpirateup:{id:606,hp:4},skirmesher:{id:160,hp:12},skmarksman:{id:340,hp:6},slayer:{id:334,hp:34},snowwolf:{id:942,hp:50},spearwielder:{id:159,hp:10},spectre:{id:68,hp:19},spegasus:{id:629,hp:30},spider:{id:198,hp:9},spiderpois:{id:199,hp:11},sprite:{id:31,hp:6},squire:{id:71,hp:26},stalker:{id:696,hp:15},steelgolem:{id:69,hp:24},stone_gargoyle:{id:8,hp:15},succubus:{id:81,hp:20},succubusmis:{id:122,hp:30},taskmaster:{id:317,hp:40},tengu:{id:793,hp:45},thane:{id:166,hp:100},thiefarcher:{id:124,hp:40},thiefmage:{id:125,hp:30},thiefwarrior:{id:123,hp:45},throwgnom:{id:993,hp:24},thunderbird:{id:148,hp:65},thunderlord:{id:167,hp:120},trapper:{id:386,hp:7},treant:{id:92,hp:175},troglodyte:{id:750,hp:5},troglodyteup:{id:751,hp:6},troll:{id:204,hp:150},unicorn:{id:38,hp:57},vampire:{id:15,hp:30},vampirelord:{id:118,hp:35},vampireprince:{id:513,hp:40},vermin:{id:281,hp:6},vindicator:{id:260,hp:23},vulture:{id:731,hp:40},wardancer:{id:41,hp:12},warmong:{id:330,hp:20},warrior:{id:319,hp:12},water:{id:156,hp:43},wdancer:{id:258,hp:14},whitebearrider:{id:959,hp:30},wight:{id:91,hp:95},wolfraider:{id:43,hp:12},wolfrider:{id:18,hp:10},wraith:{id:235,hp:100},wyvern:{id:336,hp:90},zealot:{id:494,hp:80},zombie:{id:5,hp:17},zpirate:{id:679,hp:150},archangel:{id:249,hp:220},seraph2:{id:496,hp:220},spectraldragon:{id:300,hp:160},ghostdragon:{id:514,hp:150},titan:{id:107,hp:190},stormtitan:{id:581,hp:190},emeralddragon:{id:100,hp:200},crystaldragon:{id:590,hp:200},ancientbehemoth:{id:301,hp:250},dbehemoth:{id:538,hp:280},cursedbehemoth:{id:861,hp:250},blackdragon:{id:101,hp:240},reddragon:{id:747,hp:235},archdevil:{id:292,hp:199},archdemon:{id:293,hp:211},magmadragon:{id:169,hp:280},lavadragon:{id:962,hp:275},untamedcyc:{id:433,hp:225},bloodeyecyc:{id:399,hp:235},cyclopus:{id:397,hp:220},paladin:{id:234,hp:100},efreetisultan:{id:282,hp:100},naga:{id:673,hp:110},golddragon:{id:609,hp:169},pharaoh:{id:269,hp:70},deadknight:{id:273,hp:100},zhryak:{id:284,hp:99},ballista:{id:85,hp:200},tent:{id:0,hp:0},piratemonsterup:{id:645,hp:200},blacktroll:{id:205,hp:180},zasad:{id:1047,hp:70},magicel:{id:662,hp:80},scorp:{id:923,hp:4},duneraider:{id:921,hp:12},scorpup:{id:924,hp:5},dromad:{id:919,hp:40},duneraiderup:{id:922,hp:12},shakal:{id:925,hp:24},slon:{id:931,hp:100},priestmoon:{id:929,hp:50},slonup:{id:932,hp:110},shakalup:{id:926,hp:30},dromadup:{id:920,hp:45},priestsun:{id:930,hp:55},anubisup:{id:918,hp:200},scarab:{id:927,hp:6},scarabup:{id:928,hp:6},tenguup:{id:937,hp:60},gnoll:{id:1041,hp:6},brigandup:{id:1038,hp:6},verblud:{id:1060,hp:35},gnollum:{id:1042,hp:6},krokodil:{id:1067,hp:70},krokodilup:{id:1068,hp:80},gnollsh:{id:1089,hp:6},smaster:{id:1095,hp:84},manticoreup:{id:755,hp:80},apirate:{id:612,hp:13},bpirate:{id:611,hp:16},wendigoup:{id:945,hp:35},whitetiger:{id:631,hp:35},dgolemup:{id:521,hp:400},exile:{id:1040,hp:28},banditkaup:{id:936,hp:9},nomadup:{id:938,hp:33},spearthrower:{id:1114,hp:19},gatekeeper:{id:1132,hp:120},gnollup:{id:1138,hp:9},gnollka:{id:1139,hp:6},gnollboss:{id:1140,hp:36},pushkar:{id:1055,hp:64},robberup:{id:1044,hp:6},sekhmet:{id:1062,hp:50},valkyrie:{id:1185,hp:61},goblinshaman:{id:1193,hp:5},poukai:{id:1194,hp:120},monk:{id:1221,hp:20},warden:{id:1223,hp:39},snowwolfup:{id:1165,hp:53},necrodogup:{id:1325,hp:9},necrodog:{id:1324,hp:8},blackarcher:{id:1311,hp:13},deadarcher:{id:1312,hp:16},ork:{id:1346,hp:24},grib:{id:1187,hp:20},gribok:{id:1188,hp:16}};
            var imgId = {mundus:'acrossbowman',assasin:'assassin',ocean:'assida',knight:'cavalier',crossbowman:'crossman',cursed_:'cursed',cyclopod_:'cyclopod',lizardrider:'darkrider',dd_:'druid',ddeld:'druideld',dryad_:'dryad',firebird_:'firebird',gog:'gogachi',nightmare:'hellcharger',demondog:'hellhound',hellstallion:'hellkon',hdemon:'horneddemon',fdemon:'hornedoverseer',firehound:'hotdog',golem:'iron_golem',lepr:'leprekon',hunterelf:'masterhunter',magog:'megogachi',minotaurguard_:'minotaurguard',stallion:'nightmare',obsgargoly:'obsgargoyle',assida:'ocean',paesant:'peasant',pitfiend_:'pitfiend',pitlord_:'pitlord',pitspawn:'pity',pp:'pixel',rakshas:'rakshasa_rani',roc:'rocbird',witch:'shadow_witch',cyclopshaman:'shamancyclop',sceleton:'skeleton',sceletonarcher:'skeletonarcher',dpirate:'skeletonpirate',dpirateup:'skeletonpirateup',swordman:'squire',gargoly:'stone_gargoyle',succub:'succubus',succubusm:'succubusmis',ent:'treant',bladedancer:'wardancer',winddancer:'wdancer',hobwolfrider:'wolfraider',abehemoth:'ancientbehemoth',bbehemoth:'cursedbehemoth',zhrica:'priestmoon',zhricaup:'priestsun',mmaster:'smaster',jpirate:'spearthrower',witchdoctor:'goblinshaman',paokai:'poukai',deaddog:'necrodogup',blackdog:'necrodog'};
            let tr = document.getElementById("gl_tasks").getElementsByTagName("tr");
            for (let i = 0; i < tr.length; i++) {
                if (tr[i].childNodes.length != 1) {
                    continue;
                }
                let cre = tr[i].getElementsByClassName("cre_creature");
                let checkSum = 0;
                let hp = 0;
                let f = true;
                for (let j = 0; j < cre.length; j++) {
                    let id = cre[j].innerHTML.match(/name=([^\"]+)/)[1];
                    let count = cre[j].querySelector("#add_now_count").innerHTML;
                    checkSum += turnId[id].id*count;
                    hp += turnId[id].hp*count;
                }
                if ((checkSum > 0) && (hp > 0)) {
                    // tr[i].querySelector("td").innerHTML += "<div style = 'margin-left:10px'><a href = 'https://daily.heroeswm.ru/leader/bandits.php?hp=" + hp + "&sum=" + checkSum + "'>Поиск боя на Daily</a></div>";
                }
            }
        }
        if (((location.pathname.indexOf("war.php") >= 0)||(location.pathname.indexOf("warlog.php") >= 0))&&(location.href.indexOf("show_enemy") == -1)) {
            var timerIdn = setInterval(check, 100);
        }
        function check() {
            if (document.getElementById("play_button").style.display == 'none') {
                window.gpause = false;
            }
            if ((typeof(stage) !== 'undefined') && (typeof(stage.pole) !== 'undefined') && (typeof(stage.pole.onMouseMoveFlash) === "function")) {
                clearInterval(timerIdn);
                if (typeof(setshadAbs) !== 'undefined') {
                    return 0;
                } 
                window.spell_type = {'raisedead': '1', 'magicfist': '1', 'lighting': '2', 'magicarrow': '2', 'slow': '4', 'fast': '3', 'swarm': '1', 'curse': '4', 'bless': '3', 'stoneskin': '3', 'stonespikes': '2', 'poison': '4', 'mfast': '3', 'mbless': '3', 'mstoneskin': '3', 'dispel': '3', 'dray': '4', 'icebolt': '2', 'fireball': '2', 'mdispel': '3', 'righteous_might': '3', 'deflect_missile': '3', 'suffering': '4', 'confusion': '4', 'circle_of_winter': '2', 'phantom_forces': '1', 'mslow': '4', 'mcurse': '4', 'mpoison': '4', 'mdray': '4', 'msuffering': '4', 'mconfusion': '4', 'mrighteous_might': '3', 'mdeflect_missile': '3', 'armageddon': '2', 'blind': '4', 'frenzy': '4', 'teleport': '3', 'meteor': '2', 'chainlighting': '2', 'summonel': '1', 'antimagic': '3', 'firewall': '1', 'earthquake': '1', 'summonphoenix': '1', 'arcanearmor': '1', 'resurrection2': '3', 'divinevengeance': '3', 'divinev': '3', 'summonel_f': '1', 'summonel_a': '1', 'summonel_w': '1', 'summonel_e': '1'}
                window.magicbookspells_new = [];
                for (let i = 0; i <= 4; i++) {
                    for (let j in magicbookspells) {
                        let type = 0;
                        if (spell_type[magicbookspells[j]]) {
                            type = spell_type[magicbookspells[j]];
                        }
                        if (type == i) {
                            magicbookspells_new.push(magicbookspells[j]);
                        }
                    }
                }
                stage.pole.showmagicbook = function (page, iszak, check_spell) {
                    let actMiniSpells = (hwm_set['miniSpells']);
                    spell_per_page = (actMiniSpells ? 16 : 6);
                    var cm = magicbookspells_new.length;
                    let count = 0;			
                    for (i = 0; i < cm; i++) {
                        if (hwm_set["spellsOrder"]) {
                            s = magicbookspells_new[i];
                        } else {
                            s = magicbookspells[i];
                        }			
                        if (((this.obj[activeobj][s] == 1) || ((s == 'gating') && (magic[activeobj]['dem']) && (magic[activeobj]['dem']['effect'] == 1)))) {
                            if ((s == 'gating') && (this.obj[activeobj].alreadysummon)) {
                                continue;
                            };
                            if (s == 'firstblood') {
                                continue;
                            };
                            if ((s == 'explosion') && (this.obj[activeobj].nowmanna == 0)) {
                                continue;
                            };
                            if ((s == 'teleport') && (this.obj[activeobj].demonic)) {
                                continue;
                            };
                            if ((s == 'summonpitlords') && (magic[activeobj]['pit'])) {
                                continue;
                            };
                            if ((s == 'invisibility') && (magic[activeobj]['2in']) && (magic[activeobj]['2in']['effect'] == 1)) {
                                continue;
                            };
                            if ((s == 'seduction') && (magic[activeobj]['usd'])) {
                                continue;
                            };
                            if ((s == 'manafeed') && (this.obj[activeobj].nowmanna == 0)) {
                                continue;
                            };
                            count++;
                        }
                        if ((this.obj[activeobj].darkpower) && (this.obj[activeobj][s] == 1) && (magicbookchaos[magicbookspells.indexOf(s)]) && (k >= page) && (k < page + spell_per_page)) {
                            count++;
                        }
                        if (this.check_mass_day_or_night(activeobj, s)) {
                            if ((k >= page) && (k < page + spell_per_page)) {
                                var scut = s.substr(1);
                                count++;
                            }
                        }
                    }
                    actMiniSpells = (count > 6 ? actMiniSpells : 0);
                    if (!android) {
                        spell_per_page = actMiniSpells ? 16 : 6;
                    } else {
                        spell_per_page = 4;
                    }
                    var k = 0,
                        j = 0,
                        s = '',
                        so = '',
                        book_txt = '',
                        was_spell = 0;
                    lastpage = page;
                    if (iszak != 1) zakarrow = false;
        
                    function proccedinbook(so, powered, showed_cnt) {
                        if ((so == 'zakarrow') && ((zakarrow == true) || ((magic[activeobj]['za2']) && (magic[activeobj]['za2']['effect'] > 0)))) return 0;
                        j = k % spell_per_page;
                        var cost = stage[war_scr].obj[activeobj][s + 'cost'];
                        if (powered) {
                            cost *= 2;
                        };
                        kz = 1;
                        var kz2 = 1;
                        if ((isperk(activeobj, 110)) && (stage[war_scr].obj[activeobj].hero)) {
                            kz *= 0.8
                        };
                        if ((isperk(activeobj, 87)) && (!stage[war_scr].obj[activeobj].hero)) {
                            kz = 0.5
                        };
                        if ((isperk(activeobj, 111)) && (stage[war_scr].obj[activeobj].hero)) {
                            kz *= 0.8;
                        };
                        if (magic[activeobj]['dnn']) {
                            var sp_bonus = 1.03 + umelka[stage[war_scr].obj[activeobj]['owner']][10] * 0.03;
                            if (is_day_or_night(activeobj, s)) {
                                kz2 /= sp_bonus;
                            }
                        }
                        cost = Math.round(cost * kz);
                        cost = Math.round(cost * eco * kz2);
                        if (s == 'manafeed') {
                            cost = Math.min(stage[war_scr].obj[activeobj].nowmanna, stage[war_scr].obj[activeobj].nownumber);
                        };
                        if (s == 'explosion') {
                            cost = '';
                        };
                        if (s == 'invisibility') {
                            cost = '';
                        };
                        if (s == 'channeling') {
                            cost = '';
                        };
                        if (s == 'siphonmana') {
                            cost = '';
                        };
                        if (s == 'leap') {
                            cost = '';
                        };
                        if (s == 'leap6') {
                            cost = '';
                        };
                        if (s == 'sacrificegoblin') {
                            cost = '';
                        };
                        if (s == 'gating') {
                            cost = '';
                        };
                        if (s == 'summonpitlords') {
                            cost = '';
                        };
                        if (s == 'seduction') {
                            cost = '';
                        };
                        if (s == 'teleportother') {
                            cost = '';
                        };
                        if ((s == 'consumecorpse') || (s == 'benediction')) {
                            cost = '';
                        };
                        if ((cost > stage[war_scr].obj[activeobj].nowmanna) || ((cost == 0) && (s == 'manafeed'))) {
                            var disabled = true;
                        } else {
                            var disabled = false;
                            was_spell = 1;
                        }
                        if (check_spell) {
                            return 0;
                        };
                        var s_name = "";
                        if (magicbooknames[magicbookspells.indexOf(s)].includes("Mass ")) {
                            s_name += "Mass";
                        }
                        if (magicbooknames[magicbookspells.indexOf(s)].includes("Массов")) {
                            s_name += "Массовое";
                        }				
                        var nametxt = magicbooknames[magicbookspells.indexOf(s)];
                        if ((powered) || (is_day_or_night(activeobj, s))) {
                            switch (lang) {
                                case 0:
                                    nametxt += ' (усиленное)';
                                    s_name += ' Усиленное';
                                    break;
                                case 1:
                                    nametxt += ' (empowered)';
                                    s_name += '(emp)';
                                    break;
                            };
                        };
                        if (s == 'angerofhorde') {
                            eff = 0;
                            var len = stage[war_scr].obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                var k = stage[war_scr].obj_array[k1];
                                if ((stage[war_scr].obj[k]['owner'] == stage[war_scr].obj[activeobj]['owner']) && (!stage[war_scr].obj[k]['hero']) && (!stage[war_scr].obj[k]['warmachine'])) {
                                    eff += stage[war_scr].obj[k]['nownumber'];
                                };
                            };
                            stage[war_scr].obj[activeobj][s + 'effmain'] = eff;
                        };
                        if (stage[war_scr].obj[activeobj][s + 'effmain'] > 0) {
                            if (stage[war_scr].obj[activeobj].hero) {
                                var s1 = 0;
                                if ((isperk(activeobj, 93)) && ((s == 'magicfist') || (s == 'raisedead'))) {
                                    s1 = 4;
                                };
                                if ((isperk(activeobj, 78)) && ((s == 'poison') || (s == 'mpoison'))) {
                                    s1 += 5;
                                };
                                if ((isperk(activeobj, 89)) && ((s == 'poison') || (s == 'mpoison'))) {
                                    s1 += 3;
                                };
                                eff = (stage[war_scr].obj[activeobj][s + 'effmain'] + stage[war_scr].obj[activeobj][s + 'effmult'] * (stage[war_scr].getspellpower(activeobj, s) + s1));
                                if (stage[war_scr].obj[activeobj][s + 'effmult'] == 1.5) {
                                    eff = Math.round(eff);
                                };
                                var teff = eff;
                                if (powered) {
                                    eff = Math.round(eff * 1.5);
                                };
                            } else {
                                eff = Math.round(stage[war_scr].obj[activeobj][s + 'effmain'] + stage[war_scr].obj[activeobj][s + 'effmult'] * Math.pow(stage[war_scr].obj[activeobj]['nownumber'], 0.7));
                                if (s == 'blind') {
                                    eff = Math.round(stage[war_scr].obj[activeobj][s + 'effmain'] + stage[war_scr].obj[activeobj][s + 'effmult'] * stage[war_scr].obj[activeobj]['nownumber']);
                                };
                                var teff = eff;
                            }
                            if (!powered) stage[war_scr].obj[activeobj][s + '_magiceff'] = eff;
                            if ((stage[war_scr].obj[activeobj][s + 'time'] > 0) && (stage[war_scr].obj[activeobj][s + 'effmain'] > 15) && (s != 'antimagic')) {
                                eff = stage[war_scr].obj[activeobj][s + 'effmain'] + '%';
                            }
                            if (s.substr(0, s.length - 1) == 'summoncreature') {
                                if (magic[activeobj]['suc']) {
                                    eff = Math.floor(eff * Math.pow(0.9, magic[activeobj]['suc']['effect']));
                                }
                            }
                            efftxt = eff;
                        } else {
                            efftxt = '';
                            if (s == 'explosion') {
                                eff = Math.round(9 + 9 * Math.pow(stage[war_scr].obj[activeobj]['nownumber'], 0.7));
                                efftxt = eff;
                            };
                            if (s == 'channeling') {
                                eff = Math.max(1, Math.floor(stage[war_scr].obj[activeobj]['nownumber'] * 0.5));
                                efftxt = eff;
                            };
                        };
                        if (stage[war_scr].obj[activeobj][s + 'time'] > 0) {
                            if ((stage[war_scr].obj[activeobj].hero) || (magic[activeobj]['her'])) {
                                eff = stage[war_scr].getspellpower(activeobj, s);
                                if (isperk(activeobj, 89)) {
                                    eff += 3;
                                };
                                if ((isperk(activeobj, 78)) && (checkdark(s))) {
                                    eff += 5;
                                };
                            } else {
                                eff = stage[war_scr].obj[activeobj]['nownumber'];
                                if (magic[activeobj]['bhr']) {
                                    eff = Math.max(eff, Math.floor(stage[war_scr].obj[activeobj]['maxmanna'] / 5));
                                }
                            }
                            if (eff == 0) {
                                eff = 0.5;
                            }
                            durationtxt = eff;
                        } else {
                            durationtxt = '';
                        }
                        var add_desktop = '';
                        if (!android) add_desktop = '_Desktop';
                        book_txt += '<div' + (actMiniSpells ? "" : " title = '" + nametxt + "'" ) + ' class="book_skill_block' + add_desktop + '" id="spell_block' + showed_cnt + '" style="background-image:url(' + stage[war_scr].subpath + 'combat/magicbook/' + so + '.png?v=' + image_ver + ');';
                        if (disabled == false) {
                            book_txt += '"><div class="spell_btn' + add_desktop + '" id="spell' + showed_cnt + '" attr_disabled="0" style="cursor: pointer;" ';
                        } else {
                            book_txt += 'opacity: 0.3;"><div attr_disabled="1" style="cursor: auto;"';
                        };
                        spell_id[showed_cnt] = so;
                        spell_powered[showed_cnt] = powered;
                        let style = (actMiniSpells ? "font-size: 0.8rem;line-height: 1;" : "");
                        book_txt += '></div><div class="book_skill_block_container"><div class="book_skill_block_amounts book_skill_block_name" style = "' + style + '">' + (actMiniSpells ? s_name : nametxt) + '</div>';
                        if (cost != '') book_txt += '<div class="book_skill_block_amounts book_skill_block_effects">' + cost + '</div>';
                        if (efftxt != '') book_txt += '<div class="book_skill_block_amounts book_skill_block_cost">' + efftxt + '</div>';
                        if (durationtxt != '') book_txt += '<div class="book_skill_block_amounts book_skill_block_durt">' + durationtxt + '</div>';
                        book_txt += '</div></div>';
                    };
                    page = page * spell_per_page;
                    var eco = 1;
                    if (this.obj[activeobj]['hero']) {
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((this.obj[i]['energychannel']) && (this.obj[i]['nownumber'] > 0) && (this.obj[i]['owner'] == this.obj[activeobj]['owner'])) {
                                eco = 0.75;
                            };
                        };
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((this.obj[i]['manaeater']) && (this.obj[i]['nownumber'] > 0) && (this.obj[i]['side'] != this.obj[activeobj]['side'])) {
                                eco = 1.3;
                            };
                        };
                    } else {
                        var len = this.obj_array.length;
                        var max = 0;
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((this.obj[i]['manacurser']) && (this.obj[i]['nownumber'] > 0) && (this.obj[i]['side'] != this.obj[activeobj]['side'])) {
                                max = Math.max(max, this.obj[i]['nownumber']);
                            };
                        };
                        max = Math.min(40, max);
                        eco *= (1 + max / 100);
                    };
                    var cm = magicbookspells_new.length;
                    for (zz = 0; zz <= 1; zz++) {
                        var showed_cnt = 0;
                        k = 0;
                        for (i = 0; i < cm; i++) {
                            if (hwm_set["spellsOrder"]) {
                                s = magicbookspells_new[i];
                            } else {
                                s = magicbookspells[i];
                            }
                            if (((this.obj[activeobj][s] == 1) || ((s == 'gating') && (magic[activeobj]['dem']) && (magic[activeobj]['dem']['effect'] == 1))) && (((k >= page) && (k < page + spell_per_page)) || (check_spell))) {
                                if ((s == 'gating') && (this.obj[activeobj].alreadysummon)) {
                                    continue;
                                };
                                if (s == 'firstblood') {
                                    continue;
                                };
                                if ((s == 'explosion') && (this.obj[activeobj].nowmanna == 0)) {
                                    continue;
                                };
                                if ((s == 'teleport') && (this.obj[activeobj].demonic)) {
                                    continue;
                                };
                                if ((s == 'summonpitlords') && (magic[activeobj]['pit'])) {
                                    continue;
                                };
                                if ((s == 'invisibility') && (magic[activeobj]['2in']) && (magic[activeobj]['2in']['effect'] == 1)) {
                                    continue;
                                };
                                if ((s == 'seduction') && (magic[activeobj]['usd'])) {
                                    continue;
                                };
                                if ((s == 'manafeed') && (this.obj[activeobj].nowmanna == 0)) {
                                    continue;
                                };
                                showed_cnt++;
                                proccedinbook(s, 0, showed_cnt);
                            }
                            if ((this.obj[activeobj][s] == 1) || ((s == 'gating') && (magic[activeobj]['dem']) && (magic[activeobj]['dem']['effect'] == 1))) {
                                k++;
                            }
                            if ((this.obj[activeobj].darkpower) && (this.obj[activeobj][s] == 1) && (magicbookchaos[magicbookspells.indexOf(s)]) && (k >= page) && (k < page + spell_per_page)) {
                                showed_cnt++;
                                proccedinbook(s, 1, showed_cnt);
                            }
                            if ((this.obj[activeobj].darkpower) && (this.obj[activeobj][s] == 1) && (magicbookchaos[magicbookspells.indexOf(s)])) {
                                k++;
                            }
                            if (this.check_mass_day_or_night(activeobj, s)) {
                                if ((k >= page) && (k < page + spell_per_page)) {
                                    var scut = s.substr(1);
                                    showed_cnt++;
                                    this.obj[activeobj][s + 'cost'] = this.obj[activeobj][scut + 'cost'] * 2;
                                    this.obj[activeobj][s + 'effmain'] = this.obj[activeobj][scut + 'effmain'];
                                    this.obj[activeobj][s + 'effmult'] = this.obj[activeobj][scut + 'effmult'];
                                    this.obj[activeobj][s + 'time'] = this.obj[activeobj][scut + 'time'];
                                    proccedinbook(s, 0, showed_cnt);
                                };
                                k++;
                            }
                        }
                        if ((k > page) || (k == 0)) break;
                        else {
                            page = 0;
                            bookpage = 0;
                        }
                    }
                    if (check_spell) {
                        return was_spell;
                    }
                    if (actMiniSpells) {
                        book_txt += "<style>.book_skill_block_amounts {font-weight:bold;}.book_skill_block_Desktop{width:25% !important;height: 17vh !important;} .book_skills_container_Desktop{margin-left: 5%;margin-right: 5%;}</style>";
                    }
                    document.getElementById('magic_book_page').innerHTML = book_txt;
                    document.getElementById('book_mana').innerHTML = '<div>' + this.obj[activeobj].nowmanna + ' / ' + this.obj[activeobj].maxmanna + '</div>';
                    for (i = 1; i <= spell_per_page; i++) {
                        if (document.getElementById('spell' + i)) {
                            if (magic_book_hints) {
                                var disabled = tointeger(document.getElementById('spell' + i).getAttribute("attr_disabled"));
                                if (disabled != 1) {
                                    show_div_arrow('spell_block' + i, '', 'position: absolute;   left: calc(50% - 25px);   top: 90%;   width: 50px;   height: 50px;   pointer-events: none;   display: block;  transform: rotate(270deg);');
                                } else {
                                    hide_div_arrow('spell_block' + i);
                                }
                            }
                            document.getElementById('spell' + i).addEventListener("mouseup", spell_button_release.bind(null, i));
                        }
                    }
                }
                        
                
                
                
                //
                
                
                window.hwm_set = {miniSpells:false, atbStartDisplay:false, spellsOrder:false};
                for (i in hwm_set) {
                    hwm_set[i] = localStorage.getItem(i);
                    if ((hwm_set[i] === null) || (hwm_set[i] === undefined) || (hwm_set[i] === "1") || (hwm_set[i] === "0") || (hwm_set[i] === 1) || (hwm_set[i] === 0)) {
                        hwm_set[i] = false;
                    }
                }
                window.checkTrue = function(name) {
                    return (hwm_set[name] === true) || (hwm_set[name] === 'true');
                }
                window.setAtbStyle = function() {
                    let elems = document.getElementsByClassName("atb-info");
                    for (let i = 0; i < elems.length; i++) {
                        elems[i].style.display = checkTrue('atbStartDisplay') ? "block" : "none";
                    }
                }
                setAtbStyle();
                window.checkSet = function(name) {
                    document.getElementById(name + "_checkbox").checked = (checkTrue(name) ? true : false);
                    localStorage.setItem(name, (checkTrue(name) ? false : true));
                    hwm_set[name] = (checkTrue(name) ? false : true);
                    if (name == "atbStartDisplay") {
                        setAtbStyle();
                    }
                }
                window.chatMode = function() {
                    return chat.className.substring(chat.className.length - 1);
                }
                
                let divs = [], divc = [], divt = [];
                let backgroundColors = ['', '#991515', '#4b66ff', '#25C953', '#BD8500', '#B000FF', '#005C13'];
                for (let i = (btype == 145 ? 6 : 2); i >= 1; i--) {
                    divs[i] = document.createElement('div');
                    divs[i].setAttribute('id', 'hp' + i);
                    divs[i].classList.add("hp");
        
                    divc[i] = document.createElement('div');
                    divc[i].style.backgroundColor = backgroundColors[i];	
                    divc[i].setAttribute('id', 'hp' + i + 'c');
                    divc[i].classList.add("hpc");
        
                    divt[i] = document.createElement('div');
                    divt[i].setAttribute('id', 'hp' + i + 't');
                    divt[i].classList.add("hpt");
                    
                    if (i > 1) {
                        divs[i].style.marginTop = "3px";
                    }				
                    document.querySelector("#chat_format").prepend(divs[i]);			
                    divs[i].prepend(divc[i]);
                    divs[i].prepend(divt[i]);			
                }	
                div = document.createElement('div');
                div.innerHTML = "<div class='info_row' id='atb-start-bonus' onmouseup = 'checkSet(\"atbStartDisplay\")'><label class='checkbox_container'>Стартовый бонус АТБ<input type='checkbox'" + (checkTrue("atbStartDisplay") ? " checked ":"") + "id='atbStartDisplay_checkbox'><span class='checkbox_checkmark'></span></label></div><br>"
                document.getElementById("win_Settings").getElementsByTagName("form")[0].querySelector("#webgl_settings_whole").after(div);	
                global_init = 0;
                window.firsTurnShow = tointeger(command.substr(1, command.indexOf(':') - 1)) <= 1 ? true : false;
                window.btime = false;
                window.fireInfo = false;
                window.skillProbability = "";
                window.luckProbability = 0;
                window.curAbil = "";
                window.last_line3 = "";
                window.phm = {};
                window.psc = {};
                window.psa = {};
                window.sHP = [0, 0];
                window.nHP = [0, 0];
                //window.gate = {};
                window.lastChain = 0;
                window.damageTable = "";
                window.damage = [[],[]];
                window.targetMagicdamage = 0;
                window.targetMagickills = 0;
                window.test_temp = 0;
                window.addSpeedLastTurn = 0;
                window.addIniLastTurn = 0;
                window.lastRaidsCount = 0;
                window.raidsCurrentWave = 0;
                damageTableStyle = document.createElement('style');
                damageTableStyle.innerHTML = "#win_BattleResult{max-height:90%} #damageTable td {vertical-align: baseline; font-size:90%} #damageTable {max-height: 30vh;overflow: auto;}";
                damageTableStyle.innerHTML += "#test table {width:100%;margin-left:3px;} #test {padding-left:5px;font-weight:bold;height:100%;width:100%;position: absolute;top:0;right: 0;background: #151313;font-size: 0.9em;z-index:101;}";
                damageTableStyle.innerHTML += "#effectsDisplay:hover{filter: brightness(1500%) drop-shadow(0 0 10px #fff);} #effectsDisplay {display: inline-block;float: right;height: 26px;cursor: pointer;line-height: 26px;color:#979797;font-size:12px}";        
                damageTableStyle.innerHTML += "#dop-info img {filter: drop-shadow(#000 0px 0px 0.1em);margin-left:-2px;vertical-align: baseline;} #dop-info {position:absolute;font-family: Arial;position: absolute;text-align: right;text-shadow: -0   -0.03em 0.03em #000, 0   -0.03em 0.03em #000,-0    0.03em 0.03em #000, 0    0.03em 0.03em #000,-0.03em -0   0.03em #000, 0.03em -0   0.03em #000,-0.03em  0   0.03em #000, 0.03em  0   0.03em #000,-0.03em -0.03em 0.03em #000, 0.03em -0.03em 0.03em #000,-0.03em  0.03em 0.03em #000, 0.03em  0.03em 0.03em #000,-0.03em -0.03em 0.03em #000, 0.03em -0.03em 0.03em #000,-0.03em  0.03em 0.03em #000, 0.03em  0.03em 0.03em #000;color: #fff;font-size:130%}";
                damageTableStyle.innerHTML += ".hp {width:100%; height:15px; border: 1px solid #fff; border-radius: 5px; color:#fff; position:relative;}";
                damageTableStyle.innerHTML += ".hpt {width:100%; height:100%; text-align:center; line-height:15px; font-size:13px; font-weight:bold; color:#fff; position:absolute; z-index:1;}";
                damageTableStyle.innerHTML += ".hpc {width:100%; height:100%; border-radius: 5px; position:absolute;}";
        
                document.head.appendChild(damageTableStyle);
                effectsDisplay = document.createElement('div');
                effectsDisplay.setAttribute('id', 'effectsDisplay');
                effectsDisplay.innerHTML = "Эффекты";
                effectsDisplay.setAttribute("title", "Отображать в окне чата бафы и дебафы существ при наведении курсора");
                effectsDisplay.setAttribute("onclick", "setEffectDisplay()");
                document.getElementById("chat_panelPosition_btn1").before(effectsDisplay);	
                dopInfoPanel = document.createElement('div');
                dopInfoPanel.setAttribute('id', 'dop-info');
                window.lastFire = 0;
                document.getElementById("timer").after(dopInfoPanel);	
                window.testBlock = function(i = 0, firewall = false) {		
                    if (chatMode() == "V") {
                        return 0;
                    }
                    let div = document.getElementById("test");
                    if ((firewall == true) && (i != lastFire) && (i > 0)) {
                        div.style.height = "100%";
                        div.innerHTML = "<center>Огнестенка " + i + " ход.</center>";	
                        lastFire = i;
                        fireInfo = true;
                    } else if (firewall == false) {
                        fireInfo = false;
                        if ((i == 0) || (stage.pole.showmagicinfo(i, 1).indexOf("Эффекты отсутствуют") != -1)) {
                            div.innerHTML = "";
                            div.style.height = "0";
                            lastFire = 0;
                            return 0;
                        }
                        div.style.height = "100%";
                        if (lastFire == 0) {
                            div.innerHTML = "";
                        }
                        div.innerHTML += "<center>" + stage.pole.get_name_html(i) + "</center>";
                        let str = stage.pole.showmagicinfo(i, 1);
                        div.innerHTML += str;
                    }
                }
                window.updateBar = function(ch = 2) {
                    sHP = [0, 0, 0, 0, 0, 0];
                    nHP = [0, 0, 0, 0, 0, 0];
                    for (k in stage.pole.obj) {
                        let ow = (ch == 2 ? stage.pole.obj[k].owner%2*(-1) + 1 : +stage.pole.obj[k].owner - 1);	
                        if ((stage.pole.obj[k].hero != undefined) || (stage.pole.obj[k].warmachine != undefined) || (stage.pole.obj[k].building != undefined))
                            continue;  		
                        sHP[ow] += stage.pole.obj[k].maxnumber*stage.pole.obj[k].maxhealth;
                        nHP[ow] += Math.max((stage.pole.obj[k].nownumber - 1), 0)*stage.pole.obj[k].maxhealth + stage.pole.obj[k].nowhealth;
                    }
                    for (let i = 1; i <= ch; i++) {
                        document.getElementById("hp" + i + "t").innerHTML = "" + nHP[i - 1] + "/" + sHP[i - 1] + " (" + Math.round(nHP[i - 1]/sHP[i - 1]*100) + "%)";;	
                        document.getElementById("hp" + i + "c").style.width = "" + Math.round(nHP[i - 1]/sHP[i - 1]*100) + "%";			
                    }
                }
                window.infoBlock = function(i = 0) {
                    let div = document.getElementById("dop-info");
                    if (i == 0) {
                        div.innerHTML = "";
                        return 0;
                    }
                    let str = "";
                    let h = Math.round(atb_scaling*atb_height*stage.pole.scaling*(1/MainPixelRatio)/3);
                    if (stage.pole.luckMoraleProbability(i, 'morale') > 0) {
                        str += "<div style = 'line-height:" + (h - 2) + "px;height:" + (h) + "px;'><img align='absmiddle' height = '" + (h - 4) + "px' src = 'https://dcdn.heroeswm.ru/i/icons/attr_morale.png'>&#8201;" + stage.pole.luckMoralePerc(i, 'morale') + "</div>";
                    }
                    if (stage.pole.luckMoraleProbability(i, 'luck') > 0) {
                        str += "<div style = 'line-height:" + (h - 2) + "px;height:" + (h) + "px;'><img align='absmiddle' height = '" + (h - 4) + "px' src = 'https://dcdn.heroeswm.ru/i/icons/attr_fortune.png'>&#8201;" + stage.pole.luckMoralePerc(i, 'luck') + "</div>";
                    }
                    if ((str != "") && (time > 0)) {
                        str += "<style>#timer {opacity:0.3}</style>";
                    }
                    div.innerHTML = str;
                }
                let damageTableDisplay = localStorage.getItem('damage-table-display');
                if ((damageTableDisplay === null) || (damageTableDisplay === undefined)) {
                    damageTableDisplay = "table";
                }
                let spanHTML = (damageTableDisplay == "table" ? "(скрыть)" : "(показать)");
                let effectDisplay = localStorage.getItem('effect-display');
                if ((effectDisplay === null) || (effectDisplay === undefined)) {
                    effectDisplay = "block";
                }
                div = document.createElement('div');
                div.setAttribute('id', 'test');
                div.style.height = "0";
                div.style.display = effectDisplay;
                document.getElementById("effectsDisplay").style.textDecoration = (effectDisplay == "none" ? "line-through" : "none");
                document.getElementById("chat_format").prepend(div);
                window.setEffectDisplay = function() {
                    effectDisplay = (effectDisplay == "none" ? "block" : "none");
                    localStorage.setItem('effect-display', effectDisplay);
                    document.getElementById("test").style.display = effectDisplay;
                    document.getElementById("effectsDisplay").style.textDecoration = (effectDisplay == "none" ? "line-through" : "none");
                }
                window.setDamageTableDisplay = function() {
                    damageTableDisplay = (damageTableDisplay == "table" ? "none" : "table");
                    localStorage.setItem('damage-table-display', damageTableDisplay);
                    document.getElementById("win_BattleResult").querySelector("table").style.display = damageTableDisplay;
                    spanHTML = (damageTableDisplay == "table" ? "(скрыть)" : "(показать)");
                    updateDamageData();
                }
                window.updateDamageData = function() {
                    if (damageTable == "") {
                        damageTable = document.createElement('div');
                        damageTable.setAttribute('id', 'damageTable');
                        document.getElementById("win_BattleResult").querySelector("#btn_watch_WatchBattle").before(damageTable);
                    }
                    let txt = "<B>Нанесённый урон</B> <span onclick = 'setDamageTableDisplay()' title 'скрыть/показать' style = 'font-size:80%;cursor:pointer'>" + spanHTML + "</span><table width = 100% style = 'display:" + damageTableDisplay + "'><tbody><tr>";
                    for (let i = 0; i < 2; i++) {
                        if (damage[i].length == 0) {
                            continue;
                        }
                        txt += "<td width = 50%><table width = 95%><tbody>";
                        damage[i].sort((a, b) => a.s < b.s ? 1 : -1);
                        for (let j = 0; j < damage[i].length; j++) {
                            txt += "<tr><td align = left>" + stage.pole.html('name', damage[i][j]['id']) + "</td><td align = right>" + damage[i][j]['s'] + "</td></tr>";
                        }
                        txt += "</tbody></table></td>";
                    }
                    txt += "</tr></tbody></table>";
                    document.getElementById("damageTable").innerHTML = txt;
                }
                stage.pole.procceddamage = window.procceddamage = function(i) {
                    realDamage = Math.min(this.obj[i].damage, (this.obj[i].nownumber - 1) * this.obj[i].maxhealth + this.obj[i].nowhealth);
                    if ((this.obj[this.obj[i].damaged] !== undefined) || (this.obj[i].damaged == -2) || (this.obj[i].damaged == -1) || (this.obj[i].damaged == -9)) {
                        let id = 0;
                        if ((this.obj[i].damaged == -9)&&(psa[i] !== "undefined")) {
                            // id = psa[i];
                        } else if ((this.obj[i].damaged == -1)&&(psc[i] !== "undefined")) {
                            id = psc[i];
                        } else if (this.obj[i].damaged == -2) {
                            let x = tointeger(tmp.substr(6, 2));
                            let y = tointeger(tmp.substr(8, 2));
                            id = Math.floor(firewalls[x + y * defxn] / 100);
                        } else {
                            id = this.obj[i].damaged;
                        }
                        if ((id > 0) && this.obj[id] && this.obj[id].owner) {
                            let owner = (this.obj[id].owner);
                            let side = (this.obj[id].owner) % 2 * -1 + 1;
                            let name = (this.obj[id].nametxt);
                            let f = false;
                            for (let j = 0; j < damage[side].length; j++) {
                                if ((damage[side][j]['name'] == name) && (damage[side][j]['owner'] == owner)) {
                                    f = true;
                                    damage[side][j]['s'] += realDamage
                                }
                            }
                            if (f == false) {
                                let o = {
                                    "id": id,
                                    "s": realDamage,
                                    "name": name,
                                    "owner": owner
                                }
                                damage[side].push(o);
                            }
                            updateDamageData();
                        }
                    }
                    if (this.obj[this.obj[i].damaged] !== undefined) {
                        if ((this.obj[this.obj[i].damaged].separhsum === null) || (this.obj[this.obj[i].damaged].separhsum === undefined)) {
                            this.obj[this.obj[i].damaged].separhsum = 0;
                        }
                        let s = 0;
                        if (realDamage >= this.obj[i].nowhealth) {
                            s += this.obj[i].level;
                            if (realDamage - this.obj[i].nowhealth > 0) {
                                s *= Math.floor((realDamage - this.obj[i].nowhealth) / this.obj[i].maxhealth) + 1;
                            }
                            this.obj[this.obj[i].damaged].separhsum += s;
                        }
                        if (stage.pole.obj[this.obj[i].damaged]['hitcount'] === undefined) {
                            stage.pole.obj[this.obj[i].damaged]['hitcount'] = 0;
                            stage.pole.obj[this.obj[i].damaged]['luckcount'] = 0;
                        }
                        if ((this['nowhit'] != this.obj[i].damaged) && (!this.obj[i].magicdamage)) {
                            let curName = curAbil.substr(0, 3);
                            if ((curAbil == "") || (parseInt(curAbil.substr(3, 3)) != this.obj[i].damaged) || ((curName != "stb") && (curName != "htc") && (curName != "blh") && (curName != "dwl") && (curName != "ltn") && (curName != "clt") && (curName != "lep") && (curName != "spk") && (curName != "bdd") && (curName != "rs2") && (curName != "ooc") && (curName != "fls"))) {
                                    if ((magic[this.obj[i].damaged])&&(magic[this.obj[i].damaged]['hyp'])&&(magic[this.obj[i].damaged]['hyp']['nowinit'] > 0)) {
                                    } else {
                                        this.obj[this.obj[i].damaged]['hitcount'] += 1;
                                    }	
                                this['nowhit'] = this.obj[i].damaged;
                            }
                            curAbil = "";
                        }
                    }
                    curshowmagic = '';
                    if (this.obj[i].damaged > 0) {
                        this.obj[this.obj[i].damaged].att = true;
                    }
                    if ((this.obj[i].damage != 0) || (!this.obj[i].runaway)) {
                        this.obj[i].donow = "b";
                        if (this.obj[i].incorporeal) {
                            if ((this.obj[i].magicdamage) && (this.obj[i].magicdamage != "Магический кулак")) {
                                this.obj[i].misscount = 0;
                            } else {
                                if (this.obj[i].damage == 0) {
                                    if ((this.obj[i].misscount === undefined) || (this.obj[i].misscount == 0)) {
                                        this.obj[i].misscount = -1;
                                    } else {
                                        if (this.obj[i].misscount == -1) {
                                            this.obj[i].misscount = -2;
                                        } else {
                                            this.obj[i].misscount = -1;
                                        }
                                    }
                                } else {
                                    if ((this.obj[i].misscount === undefined) || (this.obj[i].misscount == 0)) {
                                        this.obj[i].misscount = 1;
                                    } else {
                                        if (this.obj[i].misscount == 1) {
                                            this.obj[i].misscount = 2;
                                        } else {
                                            this.obj[i].misscount = 1;
                                        }
                                    }
                                }
                            }
                        }
                        if ((this.obj[i].damage == 0) && (magic[i]['phm'])) {
                            this.obj[i].donow = "";
                        } else {
                            if (this.obj[i].damaged > 0) {
                                this.obj[i].destx = this.obj[this.obj[i].damaged].x;
                            }
                            if (this.obj[i].damaged > 0) {
                                this.obj[i].desty = this.obj[this.obj[i].damaged].y;
                            }
                            this.obj[i].active = true;
                            someactive = true;
                        }
                    }
                    this.obj[i]["needSetNumber"] = 0;
                    this.calcdamage(i);
                }
                stage.pole.process_luck = window.process_luck = function(current) {
                    var lucky = command.substring(4, command.indexOf('^'));
                    playsound(current, lucky, 70);
                    if (lucky == 'badmorale') {
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' ожидают в страхе' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' freeze in fear.' + this.html('end');
                                break;
                        }
                        showtext();
                        showdefwait(current, 'unmorale');
                    }
                    if (lucky == 'morale') {
                        this.incrementParam(current, "moraleCount");
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' рвутся в бой!' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' are bursting for more action!' + this.html('end');
                                break;
                        }
                        showtext();
                        showdefwait(current, 'morale');
                    }
                    if (lucky == 'luck') {
                        if (stage.pole.obj[current]['hitcount'] === undefined) {
                            stage.pole.obj[current]['hitcount'] = 0;
                            stage.pole.obj[current]['luckcount'] = 0;
                        }
                        stage.pole.obj[current]['luckcount'] += 1;
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' посетила удача!' + this.html('end');
                                break;
                            case 1:
                                htmllog += 'Luck befalls ' + this.html('name', current) + '!' + this.html('end');
                                break;
                        }
                        showtext();
                        showdefwait(current, 'luck');
                    }
                    if (lucky == 'unluck') {
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' посетила неудача.' + this.html('end');
                                break;
                            case 1:
                                htmllog += 'Bad luck befalls ' + this.html('name', current) + '.' + this.html('end');
                                break;
                        }
                        showtext();
                        showdefwait(current, 'unluck');
                    }
                    if (lucky == 'critical') {
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' - критический удар по заклятому врагу.' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' deal critical damage to favoured enemy.' + this.html('end');
                                break;
                        }
                        showtext();
                        showdefwait(current, 'crit');
                    }
                    if (lucky == 'drunk') {
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' - самоуправство.' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' - independence.' + this.html('end');
                                break;
                        }
                        showtext();
                        showdefwait(current, 'rage', 0);
                    }
                    command = command.substr(command.indexOf('^') + 1);
                }
                stage.pole.luckMoraleProbability = function(i, name) {		
                    let probability = 0;
                    if (!firsTurnShow) {
                        return 0;
                    }
                    let cre = stage.pole.obj[i];
                    if (cre === undefined) {
                        return 0;
                    }	
                    let allCount = "";
                    let yesCount = "";
                    let lastValue = "";
                    let luck = 0;
                    if (name == 'morale') {
                        allCount = "turnCount";
                        yesCount = "moraleCount";
                        lastValue = "lastMorale";
                        luck = stage.pole.getMoraleN(i);
                    } else if (name == 'luck') {
                        allCount = "hitcount";
                        yesCount = "luckcount";
                        lastValue = "lastluck";	
                        luck = cre['luck'] + cre['luckaddon'];				
                    }	
                    if (cre[allCount] === undefined) {
                        cre[allCount] = 0;
                    }
                    if (cre[yesCount] === undefined) {
                        cre[yesCount] = 0;
                    }
                    
                    if ((cre["checkMrl"] !== undefined) && (cre["checkMrl"] == 1)) {
                        if (magic[i]["mrl"] === 0) {
                            stage.pole.clearPar(i, "morale");
                            cre["checkMrl"] = 0;
                        }
                    }
                    if ((cre[lastValue] !== undefined) && (luck != cre[lastValue])) {
                        stage.pole.clearPar(i, name);
                    }
                    cre[lastValue] = luck;	
                    luck = Math.max(0, Math.min(luck * 0.1, 0.5));
                    if (cre['hero'] != 1) {
                        probability = Math.min(Math.pow(luck, 1 + cre[yesCount] - (cre[allCount] - cre[yesCount]) * luck / (1 - luck)), 1);
                    }
                    if (probability >= 0.1) {
                        return probability.toFixed(2);
                    } else {
                        return probability.toFixed(3);
                    }
                }
                stage.pole.luckMoralePerc = function(i, name) {
                    let prob = this.luckMoraleProbability(i, name);
                    if (prob >= 0.1) {
                        return (prob*100).toFixed(0) + "%";
                    } else {
                        return (prob*100).toFixed(1) + "%";
                    }
                }
                stage.pole.snaresPossible = window.snaresPossible = function(attacker, defender) {
                    let n = Math.floor(attacker.nownumber / 25) - (defender.level + Math.floor(defender.nownumber * defender.maxhealth / (80 + defender.level * 20)));
                    let possible = [25, 25, 25, 25];
                    let b = n;
                    if (n > 0) {
                        for (let i = 3; i >= 1; i--) {
                            while ((possible[i] > 5) && (n > 0)) {
                                possible[0] += 5;
                                possible[i] -= 5;
                                n -= 1;
                            }
                        }
                    }
                    if (n < 0) {
                        for (let i = 0; i <= 2; i++) {
                            while ((possible[i] > 5) && (n < 0)) {
                                possible[3] += 5;
                                possible[i] -= 5;
                                n += 1;
                            }
                        }
                    }
                    return (possible[0] + possible[1] + possible[2]) + "%";
                }
                stage.pole.checkProbabilitySkill = window.checkProbabilitySkill = function(attacker, attackx, attacky, ax, ay, range = 0) {
                    window.skillProbability = "";
                    if ((!this.obj[attacker]) || (!this.obj[attacker].hasOwnProperty('nownumber'))) {
                        return false;
                    }
                    var defender = mapobj[ax + ay * defxn];
                    if ((!this.obj[defender]) || (!this.obj[defender].hasOwnProperty('nownumber'))) {
                        return false;
                    }
                    let hpa = (this.obj[attacker].nownumber - 1) * this.obj[attacker].maxhealth + this.obj[attacker].nowhealth;
                    let hpd = (this.obj[defender].nownumber - 1) * this.obj[defender].maxhealth + this.obj[defender].nowhealth;
                    let soldiersLuck = 0;
                    if (heroes[this.obj[activeobj]['owner']] > 0) {
                        let h = heroes[this.obj[activeobj]['owner']];
                        if (isperk(activeobj, 33)) {
                            soldiersLuck = 1;
                        }
                    }
                    if ((this.obj[attacker]['blinding_attack']) && (this.obj[defender]['alive']) && (!this.obj[defender]['warmachine']) && (!this.obj[defender]['iblind']) && (!this.obj[defender]['imind']) && (!this.obj[defender]['twistedmind']) && (!this.obj[defender]['absolutepurity']) && (!this.obj[defender]['enchantedarmor'])) {
                        skillProbability = getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage));
                        if (skillProbability != getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage2))) {
                            skillProbability = skillProbability + "% - " + getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage2));
                        }
                    }
                    if ((this.obj[attacker]['fearattack']) && (this.obj[defender]['alive']) && (!this.obj[defender]['imind']) && (!this.obj[defender]['twistedmind']) && (!this.obj[defender]['absolutepurity'])) {
                        skillProbability = getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage));
                        if (skillProbability != getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage2))) {
                            skillProbability = skillProbability + "% - " + getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage2));
                        }
                    }
                    if ((this.obj[attacker]['flamewave']) || ((this.obj[attacker]['shootbash']) && (range == 1)) || (this.obj[attacker]['shieldbash']) || (this.obj[attacker]['deathattack']) || (this.obj[attacker]['wardingarrows']) && (!this.obj[defender]['warmachine']) && (!this.obj[defender]['mechanical'])) {
                        skillProbability = getSkillProbability(hpa, hpd);
                    }
                    if ((this.obj[attacker]['torpor']) && (this.obj[defender]['alive']) && (!this.obj[defender]['warmachine']) && (!this.obj[defender]['absolutepurity'])) {
                        skillProbability = getSkillProbability(hpa, hpd);
                    }
                    if (this.obj[attacker]['pawstrike']) {
                        let len = wmap2[attacky * defxn + attackx];
                        let spd = Math.max(0, Math.round((this.obj[attacker].speed + this.obj[attacker]['ragespeed'] + this.obj[attacker]['speedaddon']) * this.obj[attacker].speedmodifier));
                        if ((magic[attacker]['ent']) && (magic[attacker]['ent']['nowinit'] > 0)) {
                            spd = 0;
                        }
                        if ((this.obj[attacker].x == attackx) && (this.obj[attacker].y == attacky)) {
                            len = spd;
                        }
                        let movelen = spd - len;
                        skillProbability = getSkillProbability(hpa, hpd, Math.floor(movelen));
                    }
                    if (((this.obj[attacker]['bindshot']) && (range == 1)) || ((this.obj[attacker]['bindingstrike']) && (range == 0))) {
                        skillProbability = getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage), 2);
                        if (skillProbability != getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage2), 2)) {
                            skillProbability = skillProbability + "% - " + getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage2), 2);
                        }
                    }
                    if ((this.obj[attacker]['purge']) || (this.obj[attacker]['cripplingwound']) || (this.obj[attacker]['assault']) || ((this.obj[attacker]['markoffire']) && (range == 1)) || ((this.obj[attacker]['powerstrike']) && (!this.obj[defender]['big'])) || (this.obj[attacker]['lighting_attack']) || ((this.obj[attacker]['whipstrike']) && (range == 0)) || ((this.obj[attacker]['forcearrow']) && (range == 1)) || ((this.obj[attacker]['stoning']) && (range == 0)) || (this.obj[attacker]['paralyzing']) || (this.obj[attacker]['hexingattack'])) {
                        skillProbability = getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage));
                        if (skillProbability != getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage2))) {
                            skillProbability = skillProbability + "% - " + getSkillProbability(hpa, Math.max(1, hpd - tPhysicalDamage2));
                        }
                    }
                    function getSkillProbability(hpa, hpd, attempt = 1) {
                        let skillProbability = 0;
                        if (hpa > hpd) {
                            skillProbability = 25 + 3 * (hpa / hpd);
                        } else {
                            skillProbability = 25 - 3 * (hpd / hpa);
                        }
                        skillProbability = Math.min(75, Math.max(5, skillProbability));
                        skillProbability = Math.round((1 - Math.pow((1 - skillProbability / 100), attempt * (soldiersLuck + 1))) * 100);
                        return skillProbability;
                    }
                }
                window.showuron = function(mag, effect = "") {
                    if (myuron.line3 === undefined) {
                        var ttext = Make_Text('', uron_data);
                        set_X(ttext, uron_data.x);
                        set_Y(ttext, uron_data.y + 69);
                        myuron.line3 = ttext;
                        Make_addChild(myuron2, ttext);
                        option = {
                            offsetX: -razmetka['war_images'][24][mqc['sdx']],
                            offsetY: -razmetka['war_images'][24][mqc['sdy']] - (razmetka['war_images'][19][mqc['ys']] + razmetka['war_images'][24][mqc['y']]),
                            image: stage.pole.ground['war_images'],
                            width: razmetka['war_images'][24][mqc['xs']],
                            height: razmetka['war_images'][24][mqc['ys']],
                            crop: {
                                x: razmetka['war_images'][24][mqc['x']],
                                y: razmetka['war_images'][24][mqc['y']],
                                width: razmetka['war_images'][24][mqc['xs']],
                                height: razmetka['war_images'][24][mqc['ys']],
                                visible: 1
                            },
                            listening: false
                        }
                        var img_temp = My_Image(option);
                        img_temp.option = option;
                        set_visible(img_temp, 1);
                        Make_addChild(myuron2, img_temp);
                        set_scaleX(img_temp, sub_scale * 0.4);
                        set_scaleY(img_temp, sub_scale * 0.4);
                    }
                    var line1 = 0;
                    var line2 = 0;
                    var line3 = stage.pole.luckMoraleProbability(activeobj, "luck");
                    if (umelka[1][0] == undefined) {
                        return 0;
                    }
                    if (effect != "") {
                        line1 = "";
                        line2 = effect;
                    } else if (mag == 1) {
                        if ((ctrldown)&&(targetMagicdamage > 0)) {
                            line2 = targetMagicdamage;
                            line1 = targetMagickills;					
                        } else {
                            line2 = Totalmagicdamage;
                            line1 = Totalmagickills;
                        }
                    } else {
                        if (ctrldown) {
                            line1 = Uronkills;
                            if (Uronkills != Uronkills2) line1 += ' - ' + Uronkills2;
                            line2 = PhysicalDamage;
                            if (PhysicalDamage != PhysicalDamage2) line2 += ' - ' + PhysicalDamage2;
                        } else {
                            line1 = tUronkills;
                            if (tUronkills != tUronkills2) {
                                line1 += ' - ' + tUronkills2;
                            }
                            line2 = tPhysicalDamage;
                            if (tPhysicalDamage != tPhysicalDamage2) {
                                line2 += ' - ' + tPhysicalDamage2;
                            }
                            if (skillProbability != "") {
                                line2 += ' (' + skillProbability + "%)";
                            }
                        }
                    }
                    var scale = Math.max(min_uron_scale, stage[war_scr].scaling_ratio) * MainPixelRatio;
                    set_scaleX(myuron2, scale);
                    set_scaleY(myuron2, scale);
                    if ((last_line1 != line1) || (last_line2 != line2) || (last_line3 != line3)) {
                        last_line1 = line1;
                        last_line2 = line2;
                        last_line3 = line3;
                        set_cache(myuron, false);
                        set_text(myuron.line1, line1 + ' ');
                        set_text(myuron.line2, line2 + ' ');
                        luckProbability = stage.pole.luckMoraleProbability(activeobj, "luck");
                        if ((mag == 1) || (luckProbability == 0) || (magicuse == "leap") || (magicuse == "leap6")) {
                            myuron2.children[4].visible = 0;
                            myuron.line3.visible = 0;
                        } else {					
                            myuron2.children[4].visible = 1;
                            myuron.line3.visible = 1;
                            set_text(myuron.line3, stage.pole.luckMoralePerc(activeobj, "luck"));
                        }
                        set_visible(myuron, 1);
                        set_strokeThickness(myuron.line1, Math.round(uron_stroke_width * Math.min(1, scale)));
                        set_strokeThickness(myuron.line2, Math.round(uron_stroke_width * Math.min(1, scale)));
                        set_strokeThickness(myuron.line3, Math.round(uron_stroke_width * Math.min(1, scale)));
                        //		myuron.cacheAsBitmap = true;
                    }
                    set_visible(myuron, 1);
                    //	set_cache(myuron, true);
                    var sc = 1;
                    var ratio = getDevicePixelRatio();
                    //	if (android)
                    //	{
                    var sc = stage[war_scr].scaling * ratio;
                    //	}				
                    var rect = get_clientRect(myuron);
                    if (currentTip == 1) {
                        rect.width *= scale;
                        rect.height *= scale;
                    }
                    if ((currentTip == 1) && ((rect.x > 6000) || (rect.width > 2000) || (rect.height > 200))) {
                        rect.width = Math.min(300, (Math.max(myuron.line1.width, myuron.line2.width) + 20)) * stage[war_scr].scaling;
                        rect.height = Math.min(100, (myuron.line1.height * 2 + 5)) * stage[war_scr].scaling;
                    }
                    var gscaling = stage[war_scr].scaling;
                    var xx2 = scr_xmouse;
                    var max_x = original_width;
                    if ((android) && (stage_width > stage_height)) {
                        max_x = original_width - pole_left - pole_right;
                    }
                    if (xx2 + get_width(myuron) > max_x * gscaling) {
                        xx2 = max_x * gscaling - get_width(myuron);
                    }
                    var xx = xx2;
                    var yy = (scr_ymouse);
                    if (!android) {
                        xx -= cursor_width * scale;
                        yy += cursor_height * 1.5 * scale;
                    } else {
                        xx -= cursor_width * scale;
                        yy -= cursor_height * 4 * scale;
                        if (yy < 3) yy = 3;
                    }
                    if (yy + get_height(rect) * 1.2 > atby) {
                        yy = atby - get_height(rect) * 1.2;
                    }
                    if (xx + get_width(rect) * 1.1 > stage_width) {
                        xx = stage_width - get_width(rect) * 1.1;
                    }
                    set_X(myuron, Math.round(xx));
                    set_Y(myuron, Math.round(yy));
                }
                stage.pole.onMouseMoveFlash = window.onMouseMoveFlash = function(from_event, xmouse, ymouse, force, reset, lastcoords) {				
                    attack_xr = 0;
                    attack_yr = 0;
                    targetMagicdamage = 0;
                    targetMagickills = 0;
                    if (buttons_visible['win_dialog']) return 0;
                    if (buttons_visible['scroll_runes']) return 0;
                    if (buttons_visible['magic_book']) return 0;
                    if (buttons_visible['win_SeparateArmy']) return 0;
                    if (buttons_visible['win_Mission']) return 0;
                    if (buttons_visible['win_Settings']) return 0;
                    if (total_delta > 20) return 0;
                    if (typeof csword === 'undefined') return 0;
                    shiftdown = false;
                    ctrldown = false;		
                    if (!android) {
                        var isRightMB = false;
                        var e = 0;
                        if (((typeof event !== 'undefined') && (event)) || (from_event)) {
                            var e = from_event;
                            if ((typeof event !== 'undefined') && (event)) e = event;
                            if (e.which) {
                                if ((e.which == 2) || (e.which == 3)) {
                                    isRightMB = 1;
                                }
                            } else if (e.button)
                                isRightMB = e.button >= 2;
                        }
                        if (KeyisDown(16)) shiftdown = true;
                        else shiftdown = false;
                        if ((KeyisDown(17)) || (isRightMB)) ctrldown = true;
                        else ctrldown = false;
                    }
                    shiftdown = (shiftdown || shift_button) && (shift_ok);
                    ctrldown = ctrldown || info_button;
                    if ((activeobj > 0) && (this.obj[activeobj])) {
                        if (this.obj[activeobj]['was_atb'] > 0) {
                            this.reset_temp_magic();
                            this.showatb();
                            this.obj[activeobj]['was_atb'] = 0;
                        }
                        if ((magicuse != '') && (this.obj[activeobj][magicuse + 'elem'] == 'air') && (((this.obj[activeobj]['hero']) && (isperk(activeobj, 100))) || (this.obj[activeobj]['master_of_storms']))) {
                            this.reset_temp_magic();
                            this.showatb();
                        }
                        if ((magicuse != '') && ((magicuse == 'circle_of_winter') || (magicuse == 'icebolt')) && (((this.obj[activeobj]['hero']) && (isperk(activeobj, 99))) || (this.obj[activeobj]['master_of_ice']))) {
                            this.reset_temp_magic();
                            this.showatb();
                        }
                    }
                    movecounter++;
                    var i = 0,
                        bigok = false,
                        len = 0,
                        xk = 0,
                        yk = 0,
                        range = 0,
                        xaa = 0,
                        yaa = 0,
                        x = 0,
                        y = 0,
                        xr = 0,
                        yr = 0,
                        a = 0,
                        ab = 0,
                        ac = 0,
                        xb = 0,
                        yb = 0,
                        res = 0,
                        ok = false;
                    if (onrune) {
                        if (lastshad > 0) {
                            set_visible(shado[lastshad], 0);
                            set_visible(shado[lastshad + 1], 0);
                            set_visible(shado[lastshad + 1 + defxn], 0);
                            set_visible(shado[lastshad + defxn], 0);
                        }
                        lastshad = 0;
                        return 0;
                    }
                    if (itrunepanel()) {
                        return 0;
                    }
                    attackx = 0;
                    attacky = 0;
                    movex = 0;
                    movey = 0;
                    magicx = -1;
                    magicy = 0;
                    scr_ymouse = ymouse;
                    scr_xmouse = xmouse;
                    if (lastcoords == true) {
                        scr_ymouse = scr_ymouselast;
                        scr_xmouse = scr_xmouselast;
                    }
                    scr_ymouselast = scr_ymouse;
                    scr_xmouselast = scr_xmouse;
                    var r = getxa_from(scr_xmouse, scr_ymouse);
                    x = r.x + 1;
                    y = r.y + 1;
                    xr = Math.ceil(r.x);
                    yr = Math.ceil(r.y);
                    if (interactive_obj > 0) {
                        if ((xr > 0) && (yr > 0) && (xr <= defxn - 2) && (yr <= defyn) && (mapobj[yr * defxn + xr] == interactive_obj)) {} else {
                            xr = this.obj[interactive_obj].x;
                            yr = this.obj[interactive_obj].y;
                        }
                    }
                    xr_last = xr;
                    yr_last = yr;
                    
                    xr_z = scr_xmouse;
                    yr_z = scr_ymouse;
                    if (reset) {
                        xr_z = -100;
                        yr_z = -100;
                        xr = -5;
                        yr = -5;
                    }
                    if (buttons_visible['win_InfoCreatureEffect']) return 0;
                    if (buttons_visible['win_InfoHero']) return 0;
                    if (buttons_visible['win_InfoHero2']) return 0;
                    if (buttons_visible['win_InfoCreature']) return 0;
                    if ((xr > 0) && (yr > 0) && (xr <= defxn - 2) && (yr <= defyn)) {
                        show_coords(xr, yr);
                        if (firewalls[yr * defxn + xr] > 0) {
                            let lifeTime = (magic[Math.floor(firewalls[yr * defxn + xr]/100)]['F' + (firewalls[yr * defxn + xr]%100 + "").padStart(2, '0')]["nowinit"]/100).toFixed(2);
                            testBlock(lifeTime, true);
                        } else if (fireInfo) {
                            testBlock();
                        }
                    } else {
                        show_coords(0, 0);
                    }
                    if ((loader.loading) || (((someactive) || (command != "")) && (!gpause)) || (buttons_visible['magic_book']) || (buttons_visible['scroll_runes'])) {
                        return 0;
                    }
                    if ((!inserted) && (inssubmit)) {
                        return 0;
                    }
                
                    
                    if ((!inserted) && (!inssubmit)) {
                        if (reset) {
                            xr = -5;
                            yr = -5;
                        }
                        if (activestek <= 0) {
                            lastshad = -1;
                        }
                        if (xr + (yr) * defxn != lastshad) {
                            if (shado[lastshad]) set_visible(shado[lastshad], 0);
                            if (shado[lastshad + 1]) set_visible(shado[lastshad + 1], 0);
                            if (shado[lastshad + 1 + defxn]) set_visible(shado[lastshad + 1 + defxn], 0);
                            if (shado[lastshad + defxn]) set_visible(shado[lastshad + defxn], 0);
                            lastshad = xr + (yr) * defxn;
                            if ((activestek > 0)) {
                                if (stekx[activestek] > 0) {
                                    set_visible(shado[stekx[activestek] + (steky[activestek]) * defxn], 1);
                                    if (this.obj[activestek].big) {
                                        set_visible(shado[stekx[activestek] + (steky[activestek]) * defxn + 1], 1);
                                        set_visible(shado[stekx[activestek] + (steky[activestek]) * defxn + 1 + defxn], 1);
                                        set_visible(shado[stekx[activestek] + (steky[activestek]) * defxn + defxn], 1);
                                    }
                                    if (this.obj[activestek].bigx) {
                                        set_visible(shado[stekx[activestek] + (steky[activestek]) * defxn + 1], 1);
                                    }
                                    if (this.obj[activestek].bigy) {
                                        set_visible(shado[stekx[activestek] + (steky[activestek]) * defxn + defxn], 1);
                                    }
                                }
                                po = Math.floor((playero - 1) / 2);
                                if ((getbtype(btype) == 1) || (getbtype(btype) == 3)) {
                                    if (playero > 2) {
                                        playero1 = playero + 1;
                                    } else {
                                        playero1 = playero;
                                    }
                                    t1 = 0;
                                    t2 = 0;
                                    t11 = 0;
                                    t21 = 0;
                                    k = playero;
                                    k1 = playero1;
                                    if (isperk(0, 12, k)) {
                                        if (k % 2 == 0) {
                                            t1 = -1;
                                        } else {
                                            t2 = 1;
                                        }
                                        if (k1 % 2 == 0) {
                                            t11 = -1;
                                        } else {
                                            t21 = 1;
                                        }
                                    }
                                    for (x = 9 - (playero % 2) * 8 + t1; x <= 9 - (playero % 2) * 8 + 3 + t2; x++) {
                                        for (y = (defyn - 4) * ((playero1 + 1) % 2) + 1 + t11; y <= (defyn - 4) * ((playero1 + 1) % 2) + 4 + t21; y++) {
                                            setmap(x, y, 250);
                                        }
                                    }
                                } else {
                                    if ((getbtype(btype) == NEWKZS) || (btype == _PIRATE_NEW_EVENT) || (winter == 'arena8') || (btype == _VILLAGE_EVENT)) {
                                        setpole(btype, 250, playero, yourside, defxn - 2, defyn);
                                    } else
                                    if ((getbtype(btype) == 4) || (getbtype(btype, defxn - 2, defyn) == _NEWTHIEF) || (getbtype(btype) == _NECR_EVENT2) || (btype == _ELKA_DEFENSE)) {
                                        setpole(btype, 250, playero, yourside, defxn - 2, defyn, po);
                                    } else {
                                        t1 = 0;
                                        t2 = 0;
                                        k = playero;
                                        if (isperk(0, 12, k)) {
                                            if ((k + camp_mirror) % 2 == 0) {
                                                t1 = -1;
                                            } else {
                                                t2 = 1;
                                            }
                                        }
                                        y1 = Math.floor(po * defyn / yourside + 1);
                                        y2 = Math.floor((po + 1) * defyn / yourside);
                                        if (fullinsert) {
                                            y1 = 1;
                                            y2 = defyn;
                                        }
                                        for (x = defxn - 3 - ((playero + camp_mirror) % 2) * (defxn - 4) + t1; x <= defxn - 3 - ((playero + camp_mirror) % 2) * (defxn - 4) + 1 + t2; x++) {
                                            for (y = y1; y <= y2; y++) {
                                                setmap(x, y, 250);
                                            }
                                        }
                                    }
                                }
                                this.setotherobjs();
                                for (k = 1; k <= Math.max(7, stackcount); k++) {
                                    if (k != activestek) {
                                        setmap(stekx[k], steky[k], 210);
                                        if (this.obj[k]) {
                                            if (this.obj[k].big) {
                                                setmap(stekx[k] + 1, steky[k], 210);
                                                setmap(stekx[k] + 1, steky[k] + 1, 210);
                                                setmap(stekx[k], steky[k] + 1, 210);
                                            }
                                            if (this.obj[k].bigx) {
                                                setmap(stekx[k] + 1, steky[k], 210);
                                            }
                                            if (this.obj[k].bigy) {
                                                setmap(stekx[k], steky[k] + 1, 210);
                                            }
                                        }
                                    }
                                }
                                var bigx = this.obj[activestek]['big'];
                                var bigy = this.obj[activestek]['big'];
                                if (this.obj[activestek]['bigx']) bigx = 1;
                                if (this.obj[activestek]['bigy']) bigy = 1;
                                var cnt = 0;
                                var xp = Array(0, -1, 0, -1);
                                var yp = Array(0, 0, -1, -1);
                                var xro = xr,
                                    yro = yr;
                                if (this.obj[activestek]['big']) cnt = 3;
                                for (k = 0; k <= cnt; k++) {
                                    ok = true;
                                    xr = xro + xp[k];
                                    yr = yro + yp[k];
                                    xr_last = xr;
                                    yr_last = yr;
                                    for (x = 0; x <= bigx; x++) {
                                        for (y = 0; y <= bigy; y++) {
                                            if (getmap((x + xr), (y + yr)) != 250) {
                                                ok = false;
                                            }
                                        }
                                    }
                                    if (ok) break;
                                }
                                if ((ok) && ((xr != stekx[activestek]) || (yr != steky[activestek]))) {
                                    lastshad = xr + (yr) * defxn;
                                    setstekx = xr;
                                    setsteky = yr;
                                    set_visible(shado[xr + (yr) * defxn], 1);
                                    if (this.obj[activestek].big) {
                                        set_visible(shado[xr + (yr) * defxn + 1], 1);
                                        set_visible(shado[xr + (yr) * defxn + 1 + defxn], 1);
                                        set_visible(shado[xr + (yr) * defxn + defxn], 1);
                                    }
                                    if (this.obj[activestek].bigx) {
                                        set_visible(shado[xr + (yr) * defxn + 1], 1);
                                    }
                                    if (this.obj[activestek].bigy) {
                                        set_visible(shado[xr + (yr) * defxn + defxn], 1);
                                    }
                                } else {
                                    setstekx = -1;
                                    setsteky = -1;
                                }
                            }
                        }
                        var i = mapobj[yr * defxn + xr];
                        if (i > 0) {
                            if (((activeobj > 0) || (someactive == false) || (gpause)) && (this.obj[i].doing != "walk") && ((activeobj != i) || (gpause)) && (!this.obj[i].hero) && (showway)) {					
                                this.showposway(i, 0, activeobj);
                                if (!gpause) this.checkthrower(activeobj);
                            }		
                        } else {
                            var was = 0,
                                m = 0;
                            lastpole = 0;
                            if (this.shadows)
                                for (x = 0; x <= defxn + 1; x++) {
                                    if (!this.shadows.shad1[x]) continue;
                                    for (y = 1; y <= defyn; y++) {
                                        if (!this.shadows.shad1[x][y]) continue;								
                                        m = getmap(x, y);
                                        if (m == 210) {
                                            m = 250;
                                        }
                                        if ((m == 200) || (m == 250) || (mapzz[y * defxn + x] == 240)) {
                                            if (!was) set_visible(this.shadows.shadow1, 1);
                                            was = 1;
                                        }
                                        if (this.shadows.shad1[x][y].shadowed == 1) {
                                            set_Alpha(this.shadows.shad1[x][y], 0.3);
                                        }
                                        if (mapzz[y * defxn + x] == 240) {
                                            set_Alpha(this.shadows.shad1[x][y], 0.5);
                                            this.shadows.shad1[x][y].shadowed = 1;
                                        }
                                        if ((m == 200) && (gpause)) continue;
                                        if ((m == 200) || (m == 250) || (mapzz[y * defxn + x] == 240)) {
                                            set_visible(this.shadows.shad1[x][y], 1);
                                        } else {
                                            set_visible(this.shadows.shad1[x][y], 0);							
                                        }
                                    }
                                }
                            this.shadows.shadow1.no_filter = true;
                            if (shadow_cache) set_cache(this.shadows.shadow1, true, 1);
                        }
                        return 0;
                    }
                    var cur_atb = this.get_cur_atb(scr_xmouse, scr_ymouse);
                    if ((cur_atb > 0) && (zoomed == false)) {
                        if (combat_zoom_timeout > 0) {
                            clearTimeout(combat_zoom_timeout);
                            combat_zoom_timeout = 0;
                        }
                        k = cur_atb - 1;
                        for (var kk = 0; kk <= atb_cnt; kk++) {
                            if (kk != k) {
                                if ((typeof this.p_array === "undefined") || (!this.portraits[this.p_array[kk]])) continue;
                                showshadow(this.portraits[this.p_array[kk]].under, false);
                            }
                        }
                        if ((this.obj[atb[k + atbsd]]) && (!this.obj[atb[k + atbsd]].shadowed) && (!someactive)) {
                            this.showmi(atb[k + atbsd]);
                            var i = atb[k + atbsd];
                            showshadow(this.obj[atb[k + atbsd]], true);
                            lasti = atb[k + atbsd];
                            showshadow(this.portraits[this.p_array[k]].under, true);
                            if ((this.obj[atb[k + atbsd]].nownumber > 0) && (!this.obj[atb[k + atbsd]].stone) && (!this.obj[atb[k + atbsd]].portal)) {
                                this.obj[atb[k + atbsd]].ontop = 1;
                                this.obj[atb[k + atbsd]].get_obj_z(this.obj[atb[k + atbsd]].y);
                                if (this.obj[atb[k + atbsd]].hero) {
                                    set_visible(this.obj[atb[k + atbsd]].number, 1);
                                }
                                showshadow(this.obj[atb[k + atbsd]], true);
                                need_sort = true;
                            }
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((i != atb[k + atbsd]) && (this.obj[i].shadowed)) {
                                    clearpole2();
                                    if ((this.obj[i].nownumber > 0) && (!this.obj[i].stone) && (!this.obj[i].portal)) {
                                        this.obj[i].ontop = 0;
                                        this.obj[i].get_obj_z(this.obj[i].y);
                                        if (this.obj[i].hero) {
                                            set_visible(this.obj[i].number, 0);
                                        }
                                        need_sort = true;
                                    }
                                    showshadow(this.obj[i], false);
                                }
                            }
                        }
                        if (lastk != k) re_cache_atb();
                        lastk = k;
                        if (inserted) {
                            set_cursor(0);
                            if (myuron) set_visible(myuron, 0);
                            if (csword) set_visible(csword, 0);
                            clearshado();
                            clearshadway();
                        }
                        return 0;
                    }
                    lastk = -1;
                    if (reset) {
                        xr = -5;
                        yr = -5;
                    }
                    mishowed = false;
                    var i = mapobj[yr * defxn + xr];
                    var nowi = 0;
                    if ((lasti > 0) && (lasti != i) && (this.obj[lasti].shadowed)) {
                        i = lasti;
                        lasti = 0;
                        for (k = 0; k <= atb_cnt; k++) {
                            if (atb[k + atbsd] == i) {
                                showshadow(this.portraits[this.p_array[k]].under, false);
                            }
                        }
                        if (!mishowed) {
                            set_visible(mini_info_panel, 0);
                            this.showmi(-1);
                            if ((btype == 20) || (btype == _SURVIVAL_GNOM) || (btype == _2SURVIVAL)) {
                                this.showmitnv();
                            }
                            if (btype == 8) {
                                this.showmitnv(1);
                            }
                            if (btype == 119) {
                                // this.showmitnv(2);
                            }
                            clearpole2();
                        }
                        if ((this.obj[i].nownumber > 0) && (!this.obj[i].stone) && (!this.obj[i].portal)) {
                            this.obj[i].ontop = 0;
                            this.obj[i].get_obj_z(this.obj[i].y);
                            if (this.obj[i].hero) {
                                set_visible(this.obj[i].number, 0);
                            }
                            need_sort = true;
                        }
                        showshadow(this.obj[i], false);
                        if (!(mapobj[yr * defxn + xr] > 0)) re_cache_atb();
                    }
                    if (gpause) this.fill_mapobj();
                    if (i > 0) {
                        bigok = false;
                        if (this.obj[i].big) {
                            if ((this.obj[i].x <= xr) && (this.obj[i].x + 1 >= xr) && (this.obj[i].y <= yr) && (this.obj[i].y + 1 >= yr)) {
                                bigok = true;
                            }
                        }
                        if (this.obj[i].bigx) {
                            if ((this.obj[i].x <= xr) && (this.obj[i].x + 1 >= xr) && (this.obj[i].y == yr)) {
                                bigok = true;
                            }
                        }
                        if (this.obj[i].bigy) {
                            if ((this.obj[i].y <= yr) && (this.obj[i].y + 1 >= yr) && (this.obj[i].x == xr)) {
                                bigok = true;
                            }
                        }
                        if ((!this.obj[i].rock) && (this.obj[i].nownumber > 0) && ((!someactive) || (gpause)) && (((this.obj[i].x == xr) && (this.obj[i].y == yr)) || (bigok))) {
                            nowi = i;
                            if ((!this.obj[i].shadowed) && (this.obj[i].inited_show)) {
                                if ((!this.obj[i].stone) && (!this.obj[i].portal)) {
                                    this.obj[i].ontop = 1;
                                    this.obj[i].get_obj_z(this.obj[i].y);
                                    if (this.obj[i].hero) {
                                        set_visible(this.obj[i].number, 1);
                                    }
                                    need_sort = true;
                                }
                                mishowed = true;
                                this.showmi(i);
                                showshadow(this.obj[i], true);
                                if (((activeobj > 0) || (someactive == false) || (gpause)) && (this.obj[i].doing != "walk") && ((activeobj != i) || (gpause)) && (!this.obj[i].hero) && (showway)) {
                                    this.showposway(i, 0, activeobj);
                                    if (!gpause) this.checkthrower(activeobj);
                                }
                                for (k = 0; k <= atb_cnt; k++) {
                                    if (atb[k + atbsd] == i) {
                                        showshadow(this.portraits[this.p_array[k]].under, true);
                                    }
                                }
                            }
                        }
                        if (lasti != i) re_cache_atb();
                    }
                    if (i > 0) lasti = i;
                    else lasti = 0;
                    crun_visible2 = true;
                    if (typeof myuron !== 'undefined') set_visible(myuron, 0);
                    k = getmap(xr, yr);
                    clearshado();
                    if (k == 200) {
                        k = 250;
                    }
                    if ((xr > defxn - 1) || (xr < 0)) {
                        k = 0;
                    }
                    if ((magicuse != '') && (magicuse != 'layhands') && (magicuse != 'orderofchief') && (magicuse != 'harmtouch') && (magicuse != 'hailstorm') && (magicuse != 'allaroundslash') && (magicuse != 'feralcharge') && (magicuse != 'slam') && (magicuse != 'unstoppablecharge') && (magicuse != 'mightyslam') && (magicuse != 'incinerate') && (magicuse != 'leap') && (magicuse != 'leap6') && (magicuse != 'harpoonstrike')) {
                        k = magicuse;
                    }
                    if (magicuse == 'ssh') {
                        if ((xr >= 1) && (xr <= defxn - 2) && (yr >= 1) && (yr <= defyn) && ((Math.abs(xr - this.obj[activeobj].x) > 1) || (Math.abs(yr - this.obj[activeobj].y) > 1))) {
                            k = 'ssh';
                        } else {
                            k = 0;
                        }
                    }
                    if ((k == 'mdispel') || (k == 'mstoneskin') || (k == 'mbless') ||
                        (k == 'mrighteous_might') || (k == 'mdeflect_missile') || (k == 'mskyandearth')) {
                        k = 'mfast';
                    }
                    if ((k == 'mslow') || (k == 'mcurse') || (k == 'mdray') || (k == 'msuffering') || (k == 'mconfusion')) {
                        k = 'mslow';
                    }
                    if ((k == 'knightmark') || (k == 'necr_soul')) {
                        k = 'knightmark';
                    }
                    if ((k == 'righteous_might') || (k == 'deflect_missile') || (k == 'antimagic')) {
                        k = 'fast';
                    }
                    if (k == 'implosion') {
                        k = 'lighting';
                    }
                    if (k == 'divinev') {
                        k = 'angerofhorde';
                    }
                    if ((k == 'suffering')) {
                        k = 'curse';
                    }
                    var enemy = 210;
                    if (magicuse == 'layhands') enemy = 211;
                    if (magicuse == 'orderofchief') enemy = 211;
                    switch (k) {
                        case 'magicfist':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'magicfist';
                            magicx = xr;
                            magicy = yr;
                            this.calcmagic(activeobj, xr, yr, magicuse);
                            break;
                        case 'lighting':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'lighting';
                            magicx = xr;
                            magicy = yr;
                            this.calcmagic(activeobj, xr, yr, magicuse);
                            break;
                        case 'chainlighting':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                    lastshad = -2;
                                    clearshado();
                                    var len = this.obj_array.length;
                                    for (var k = 0; k < len; k++) {
                                        i = this.obj_array[k];
                                        if ((this.obj[i].inited_image == true) && (this.obj[i].inited_show)) {
                                            this.obj[i].set_number();
                                        }
                                    }
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'chainlighting';
                            magicx = xr;
                            magicy = yr;
                            this.calcchainlighting(activeobj, xr, yr, magicuse);
                            lastChain = activeobj;
                            break;
                        case 'knightmark':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((!this.obj[i].warmachine) && (!this.obj[i].hero) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].owner == this.obj[activeobj].owner) && (this.obj[i].nownumber > 0) && (!magic[i]['sum'])) {
                                    ok = true;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'fast';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'dispel':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((i == mapobj[xr + (yr) * defxn]) && (this.obj[i].nownumber > 0) && (!this.obj[i].hero)) {
                                    ok = true;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'fast';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'mfast':
                            set_cursor(6);
                            var p = 2;
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(-1, -1, p, p, false);
                                }
                            }
                            if (magicuse == 'mfast') {
                                this.reset_temp_magic();
                                this.showatb();
                            }
                            if ((xr > 0) && (xr <= defxn - 2) && (yr > 0) && (yr <= defyn)) {} else {
                                return 0;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(-1, -1, p, p, true);
                            if (magicuse == 'mfast') {
                                this.reset_temp_magic();
                                for (var xrr = xr - 1; xrr <= xr + p; xrr++)
                                    for (var yrr = yr - 1; yrr <= yr + p; yrr++) {
                                        var i = mapobj[xrr + (yrr) * defxn];
                                        if ((i > 0) && (i < 1000) && (!this.obj[i].warmachine) && (!this.obj[i].immunity) && (!this.obj[i].enchantedarmor) && (!this.obj[i].hero) && (this.obj[i].side == this.obj[activeobj].getside()) && (this.obj[i].nownumber > 0)) {
                                            setn_temp_magic(i, 'fst');
                                        }
                                    }
                                this.showatb();
                            }
                            res = 'mfast';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'mslow':
                            set_cursor(6);
                            var p = 2;
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(-2, -2, p, p, false);
                                }
                            }
                            if (magicuse == 'mslow') {
                                this.reset_temp_magic();
                                this.showatb();
                            }
                            if ((xr > 0) && (xr <= defxn - 2) && (yr > 0) && (yr <= defyn)) {} else {
                                return 0;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(-2, -2, p, p, true);
                            if (magicuse == 'mslow') {
                                this.reset_temp_magic();
                                for (var xrr = xr - 2; xrr <= xr + p; xrr++)
                                    for (var yrr = yr - 2; yrr <= yr + p; yrr++) {
                                        var i = mapobj[xrr + (yrr) * defxn];
                                        if ((i > 0) && (!this.obj[i].warmachine) && (!this.obj[i].islow) && (!this.obj[i].immunity) && (!this.obj[i].absolutepurity) && (!this.obj[i].enchantedarmor) && (!this.obj[i].hero) && (this.obj[i].side != this.obj[activeobj].getside()) && (this.obj[i].nownumber > 0)) {
                                            setn_temp_magic(i, 'slw');
                                        }
                                    }
                                this.showatb();
                            }
                            res = 'mslow';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'mpoison':
                            set_cursor(6);
                            var p = 1;
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(-1, -1, p, p, false);
                                }
                            }
                            if ((xr > 0) && (xr <= defxn - 2) && (yr > 0) && (yr <= defyn)) {} else {
                                return 0;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(-1, -1, p, p, true);
                            res = 'mfast';
                            magicx = xr;
                            magicy = yr;
                            this.calcmagic(activeobj, xr, yr, magicuse);
                            break;
                        case 'phantom_forces':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((!this.obj[i].hero) && (!this.obj[i].warmachine) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].owner == this.obj[activeobj].owner) && (this.obj[i].nownumber > 0) &&
                                    (!magic[i]['sum']) &&
                                    (!magic[i]['phm']) &&
                                    (!magic[i]['whp']) &&
                                    (this.obj[i].level <= this.obj[activeobj]['phantom_forceseffmain'])
                                ) {
                                    j = i;
                                    ok = true;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            xo = this.obj[j].x;
                            yo = this.obj[j].y;
                            b = 0;
                            var bigx = this.obj[j]['big'];
                            var bigy = this.obj[j]['big'];
                            if (this.obj[j]['bigx']) bigx = 1;
                            if (this.obj[j]['bigy']) bigy = 1;
                            ok = false;
                            i = activeobj;
                            setmap(this.obj[i].x, this.obj[i].y, 210, i);
                            if (this.obj[i].big) {
                                setmap(this.obj[i].x, this.obj[i].y + 1, 210, i);
                                setmap(this.obj[i].x + 1, this.obj[i].y + 1, 210, i);
                                setmap(this.obj[i].x + 1, this.obj[i].y, 210, i);
                            }
                            if (this.obj[i].bigx) {
                                setmap(this.obj[i].x + 1, this.obj[i].y, 210, i);
                            }
                            if (this.obj[i].bigy) {
                                setmap(this.obj[i].x, this.obj[i].y + 1, 210, i);
                            }
                            for (x = xo - 1 - bigx; x <= xo + 1 + bigx; x++) {
                                for (y = yo - 1 - bigy; y <= yo + 1 + bigy; y++) {
                                    ok2 = true;
                                    for (xz = x; xz <= x + bigx; xz++) {
                                        for (yz = y; yz <= y + bigy; yz++) {
                                            if ((xz < 1) || (yz < 1) || (yz > defyn) || (xz > defxn - 2) || (getmap(xz, yz) == 210) || (getmap(xz, yz) == 211)) {
                                                ok2 = false;
                                            }
                                        }
                                    }
                                    if (ok2) {
                                        ok = true;
                                    }
                                }
                            }
                            i = activeobj;
                            setmap(this.obj[i].x, this.obj[i].y, 0, i);
                            if (this.obj[i].big) {
                                setmap(this.obj[i].x, this.obj[i].y + 1, 0, i);
                                setmap(this.obj[i].x + 1, this.obj[i].y + 1, 0, i);
                                setmap(this.obj[i].x + 1, this.obj[i].y, 0, i);
                            }
                            if (this.obj[i].bigx) {
                                setmap(this.obj[i].x + 1, this.obj[i].y, 0, i);
                            }
                            if (this.obj[i].bigy) {
                                setmap(this.obj[i].x, this.obj[i].y + 1, 0, i);
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'phantom_forces';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'bless':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((!this.obj[i].hero) && (!this.obj[i].warmachine) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].side == this.obj[activeobj].getside()) && (this.obj[i].nownumber > 0)) {
                                    ok = true;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'bless';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'divine_guidance':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((!this.obj[i].hero) && (!this.obj[i].warmachine) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].side == this.obj[activeobj].getside()) && (this.obj[i].nownumber > 0)) {
                                    ok = true;
                                    objset = i;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                this.reset_temp_magic();
                                this.showatb();
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'divine_guidance';
                            magicx = xr;
                            magicy = yr;
                            this.reset_temp_magic();
                            var init = this.obj[activeobj]['divine_guidanceeffmain'];
                            var init = 33;
                            var j = mapobj[yr * defxn + xr];
                            if (this.obj[j]['nowinit'] - init < this.obj[activeobj]['nowinit']) {
                                init = Math.floor(this.obj[j]['nowinit'] - this.obj[activeobj]['nowinit']);
                            }
                            this.obj[j]['reset_init'] = -init;
                            this.showatb();
                            break;
                        case 'stoneskin':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((!this.obj[i].warmachine) && (!this.obj[i].hero) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].side == this.obj[activeobj].getside()) && (this.obj[i].nownumber > 0)) {
                                    ok = true;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'stoneskin';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'blind':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            this.reset_temp_magic();
                            this.showatb();
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            ok = true;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if (((this.obj[i].hero) || (this.obj[i].warmachine) || (!this.obj[i].alive) || (this.obj[i].iblind) || (this.obj[i].imind) || (this.obj[i].twistedmind) || ((magic[i]['wfr']) && (magic[i]['wfr']['effect'] == 1)) || (this.obj[i].absolutepurity) || (this.obj[i].immunity) || (this.obj[i].enchantedarmor)) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].nownumber > 0)) {
                                    ok = false;
                                    break;
                                }
                            }
                            if ((ok) && (btype == _PVP_DIAGONAL_EVENT) && (checkwall2(this.obj[activeobj]['x'], this.obj[activeobj]['y'], xr, yr, activeobj))) {
                                ok = false;
                                break;
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            this.reset_temp_magic();
                            var uo = mapobj[lastshad];
                            setn_temp_magic(uo, 'bld');
                            this.showatb();
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'blind';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'seduction':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            ok = true;
                            if (((this.obj[mapobj[yr * defxn + xr]].hero) || (this.obj[mapobj[yr * defxn + xr]].immunetohypnos) || (this.obj[mapobj[yr * defxn + xr]].immunity) || (this.obj[mapobj[yr * defxn + xr]].warmachine) || (!this.obj[mapobj[yr * defxn + xr]].alive) || (this.obj[mapobj[yr * defxn + xr]].imind) || (this.obj[mapobj[yr * defxn + xr]].twistedmind) || ((magic[mapobj[yr * defxn + xr]]['wfr']) && (magic[mapobj[yr * defxn + xr]]['wfr']['effect'] == 1)) || (this.obj[mapobj[yr * defxn + xr]].absolutepurity)) && (this.obj[mapobj[yr * defxn + xr]].nownumber > 0)) {
                                ok = false;
                                break;
                            }
                            var s = 'seduction';
                            hpa = ((this.obj[activeobj].nownumber - 1) * this.obj[activeobj].maxhealth + this.obj[activeobj].nowhealth) / ((this.obj[mapobj[yr * defxn + xr]].nownumber - 1) * this.obj[mapobj[yr * defxn + xr]].maxhealth + this.obj[mapobj[yr * defxn + xr]].nowhealth)
                            if ((hpa <= 0.25) || (Math.floor((2 + Math.log(hpa) / Math.log(2)) * 100) <= 0)) {
                                ok = false;
                                break;
                            }
                            if ((ok) && (btype == _PVP_DIAGONAL_EVENT) && (checkwall2(this.obj[activeobj]['x'], this.obj[activeobj]['y'], xr, yr, activeobj))) {
                                ok = false;
                                break;
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'seduction';
                            magicx = xr;
                            magicy = yr;
                            showuron(1, Math.min((2 + Math.log(hpa) / Math.log(2)).toFixed(2), 4))
                            break;
                        case 'randl':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if (((!this.obj[i].hero) && (!this.obj[i].warmachine) && (!this.obj[i].rock)) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].nownumber > 0)) {
                                    ok = true;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'randl';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'flamestrike':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            ok = true;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((this.obj[i].hero) && (i == mapobj[xr + (yr) * defxn])) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'stormbolt';
                            magicx = xr;
                            magicy = yr;
                            this.calcflamestrike(activeobj, xr, yr, "flamestrike", 1.2);
                            break;
                        case 'stormbolt':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            ok = true;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((this.obj[i].hero) && (i == mapobj[xr + (yr) * defxn])) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'stormbolt';
                            magicx = xr;
                            magicy = yr;
                            this.calcflamestrike(activeobj, xr, yr, "stormbolt", 0.5);
                            break;
                        case 'randd':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            ok = true;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if (((this.obj[i].hero) || (this.obj[i].warmachine) || (this.obj[i].absolutepurity)) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].nownumber > 0)) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'randd';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'poison':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            ok = true;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((i == mapobj[xr + (yr) * defxn]) && (this.obj[i].absolutepurity) && (this.obj[i].nownumber > 0)) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'poison';
                            magicx = xr;
                            magicy = yr;
                            this.calcmagic(activeobj, xr, yr, magicuse);
                            break;
                        case 'magicarrow':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'magicarrow';
                            magicx = xr;
                            magicy = yr;
                            this.calcmagic(activeobj, xr, yr, magicuse);
                            break;
                        case 'firearrow':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'firearrow';
                            magicx = xr;
                            magicy = yr;
                            this.calcmagic(activeobj, xr, yr, magicuse);
                            break;
                        case 'icebolt':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'icebolt';
                            magicx = xr;
                            magicy = yr;
                            this.calcmagic(activeobj, xr, yr, magicuse);
                            break;
                        case 'dray':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            if (getmap(xr, yr) != 210) {
                                res = 0;
                                break;
                            }
                            ok = true;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if (((((this.obj[i].hero) || (this.obj[i].warmachine) || (this.obj[i].absolutepurity)) && (this.obj[i].nownumber > 0)) ||
                                        ((mapobj[yr * defxn + xr] > 0) && ((this.obj[mapobj[yr * defxn + xr]].armoured) || (this.obj[mapobj[yr * defxn + xr]].organicarmor)))) && (i == mapobj[xr + (yr) * defxn])) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'dray';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'raisedead':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            big = false;
                            bigf = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if (((this.obj[i].undead) || (this.obj[i].alive)) && (!magic[i]['phm']) && (!magic[i]['sum']) && (xr >= this.obj[i].x) && (xr <= this.obj[i].x + this.obj[i].big) && (yr >= this.obj[i].y) && (yr <= this.obj[i].y + this.obj[i].big) && (this.obj[i].owner == this.obj[activeobj].owner) && (!this.obj[i].hero) && ((this.obj[i].nownumber < this.obj[i].maxnumber) || (this.obj[i].nowhealth < this.obj[i].maxhealth)) && (getmap(xr, yr) != 210) && ((mapobj[yr * defxn + xr] == undefined) || (mapobj[yr * defxn + xr] <= 0) || (this.obj[mapobj[yr * defxn + xr]].owner == this.obj[activeobj].owner))) {
                                    big = false;
                                    if ((this.obj[i].big) && (this.obj[i].nownumber == 0)) {
                                        big = true;
                                    }
                                    bigf = false;
                                    if (this.obj[i].nownumber) {
                                        bigf = true;
                                    }
                                    ok2 = true;
                                    if ((big) && (!bigf)) {
                                        var x1 = this.obj[i].x;
                                        var y1 = this.obj[i].y;
                                        if (((mapobj[x1 + y1 * defxn] > 0) && (mapobj[x1 + y1 * defxn] != i)) || ((mapobj[x1 + y1 * defxn + 1] > 0) && (mapobj[x1 + y1 * defxn + 1] != i)) || ((mapobj[x1 + (y1 + 1) * defxn + 1] > 0) && (mapobj[x1 + (y1 + 1) * defxn + 1] != i)) || ((mapobj[x1 + (y1 + 1) * defxn] > 0) && (mapobj[x1 + (y1 + 1) * defxn] != i))) {
                                            ok2 = false;
                                        }
                                    }
                                    if ((this.obj[i].bigx) && (this.obj[i].nownumber == 0) && (!bigf)) {
                                        if ((getmap(xr + 1, yr) == 211) || (getmap(xr + 1, yr) == 210)) {
                                            ok2 = false;
                                        }
                                    }
                                    if ((this.obj[i].bigy) && (this.obj[i].nownumber == 0) && (!bigf)) {
                                        if ((getmap(xr, yr + 1) == 211) || (getmap(xr, yr + 1) == 210)) {
                                            ok2 = false;
                                        }
                                    }
                                    if (!ok) {
                                        ok = ok2;
                                    }
                                    big = false;
                                    bigf = false;
                                }
                            }
                            if (!ok) {
                                if (xr + (yr) * defxn != lastshad) this.showatb();
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            this.show_atb_raisedead(xr, yr);
                            setshad(0, 0, 0, 0, true);
                            res = 'raisedead';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'heal':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            big = false;
                            bigf = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((this.obj[i].alive) && (!magic[i]['phm']) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].owner == this.obj[activeobj].owner) && (!this.obj[i].hero) && (this.obj[i].nownumber > 0) && ((this.obj[i].nownumber < this.obj[i].maxnumber) || (this.obj[i].nowhealth < this.obj[i].maxhealth)) && (getmap(xr, yr) != 210) && ((mapobj[yr * defxn + xr] == undefined) || (mapobj[yr * defxn + xr] <= 0) || (this.obj[mapobj[yr * defxn + xr]].owner == this.obj[activeobj].owner))) {
                                    if ((this.obj[i].big) && (this.obj[i].nownumber == 0)) {
                                        big = true;
                                    }
                                    if (this.obj[i].nownumber) {
                                        bigf = true;
                                    }
                                    ok2 = true;
                                    if ((big) && (!bigf)) {
                                        if ((getmap(xr + 1, yr + 1) == 211) || (getmap(xr + 1, yr + 1) == 210) || (getmap(xr, yr + 1) == 211) || (getmap(xr, yr + 1) == 210) || (getmap(xr + 1, yr) == 211) || (getmap(xr + 1, yr) == 210)) {
                                            ok2 = false;
                                        }
                                    }
                                    if ((this.obj[i].bigx) && (this.obj[i].nownumber == 0) && (!bigf)) {
                                        if ((getmap(xr + 1, yr) == 211) || (getmap(xr + 1, yr) == 210)) {
                                            ok2 = false;
                                        }
                                    }
                                    if ((this.obj[i].bigy) && (this.obj[i].nownumber == 0) && (!bigf)) {
                                        if ((getmap(xr, yr + 1) == 211) || (getmap(xr, yr + 1) == 210)) {
                                            ok2 = false;
                                        }
                                    }
                                    if (!ok) {
                                        ok = ok2;
                                    }
                                    big = false;
                                    bigf = false;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'heal';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'summonpit':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            big = false;
                            bigf = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((this.obj[i].alive) && (!magic[i]['phm']) && (!magic[i]['sum']) && (this.obj[i].x == xr) && (this.obj[i].y == yr) && (this.obj[i].owner == this.obj[activeobj].owner) && (!this.obj[i].hero) && (this.obj[i].nownumber <= 0) && (getmap(xr, yr) != 210) && ((mapobj[yr * defxn + xr] == undefined) || (mapobj[yr * defxn + xr] <= 0) || (this.obj[mapobj[yr * defxn + xr]].owner == this.obj[activeobj].owner))) {
                                    if ((this.obj[i].big) && (this.obj[i].nownumber == 0)) {
                                        big = true;
                                    }
                                    ok2 = true;
                                    if ((big) && (!bigf)) {
                                        if ((getmap(xr + 1, yr + 1) == 211) || (getmap(xr + 1, yr + 1) == 210) || (getmap(xr, yr + 1) == 211) || (getmap(xr, yr + 1) == 210) || (getmap(xr + 1, yr) == 211) || (getmap(xr + 1, yr) == 210)) {
                                            ok2 = false;
                                        }
                                    }
                                    if ((this.obj[i].bigx) && (this.obj[i].nownumber == 0) && (!bigf)) {
                                        if ((getmap(xr + 1, yr) == 211) || (getmap(xr + 1, yr) == 210)) {
                                            ok2 = false;
                                        }
                                    }
                                    if ((this.obj[i].bigy) && (this.obj[i].nownumber == 0) && (!bigf)) {
                                        if ((getmap(xr, yr + 1) == 211) || (getmap(xr, yr + 1) == 210)) {
                                            ok2 = false;
                                        }
                                    }
                                    if (Math.min(this.obj[i]['maxhealth'], 120) * this.obj[i]['maxnumber'] < 120) ok2 = false;
                                    if (!ok) {
                                        ok = ok2;
                                    }
                                    big = false;
                                    bigf = false;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'summonpit';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'gating':
                            set_cursor(6);
                            var bigx = this.obj[activeobj]['big'];
                            var bigy = this.obj[activeobj]['big'];
                            if (this.obj[activeobj]['bigx']) bigx = 1;
                            if (this.obj[activeobj]['bigy']) bigy = 1;
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, bigx, bigy, false);
                                }
                            }
                            ok = false;
                            ok = true;
                            for (x = 0; x <= bigx; x++) {
                                for (y = 0; y <= bigy; y++) {
                                    if (mapg[(xr + x) + (yr + y) * defxn] != 0) {
                                        ok = false;
                                    }
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, bigx, bigy, true);
                            res = 'gating';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'repair':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((this.obj[i].mechanical) && (this.obj[i].x == xr) && (this.obj[i].y == yr) && (this.obj[i].side == this.obj[activeobj].getside()) && (!this.obj[i].hero) && ((this.obj[i].nownumber < this.obj[i].maxnumber) || (this.obj[i].nowhealth < this.obj[i].maxhealth)) && (getmap(xr, yr) != 210) && (((this.obj[i].nownumber == 0) && (getmap(xr, yr) != 211)) || ((this.obj[i].nownumber > 0) && (getmap(xr, yr) == 211)))) {
                                    ok = true;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'repair';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'firstaid':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                            }
                            ok = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if ((!this.obj[i].warmachine) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].owner == this.obj[activeobj].owner) && (!this.obj[i].hero) && ((this.obj[i].nownumber < this.obj[i].maxnumber) || (this.obj[i].nowhealth < this.obj[i].maxhealth)) && (getmap(xr, yr) != 210) && (((this.obj[i].nownumber > 0) && (getmap(xr, yr) == 211)))) {
                                    ok = true;
                                }
                            }
                            if (!ok) {
                                res = 0;
                                break;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'firstaid';
                            magicx = xr;
                            magicy = yr;
                            break;
                        case 'teleport':
                            if (carryo == -1) {
                                var s = 'teleport';
                                if ((xr <= 0) || (yr <= 0) || (xr > defxn - 2) || (yr > defyn)) {
                                    res = 0;
                                    break;
                                }
                                var len = this.obj_array.length;
                                for (var k1 = 0; k1 < len; k1++) {
                                    i = this.obj_array[k1];
                                    if ((!this.obj[i].warmachine) && (!magic[i]['ent']) && (i == mapobj[xr + (yr) * defxn]) && (!this.obj[i].hero) && (this.obj[i]['nownumber'] > 0) && (this.obj[i].side == this.obj[activeobj].getside()) && (Math.floor(10 * (this.obj[activeobj][s + 'effmain'] + this.obj[activeobj].maxnumber * this.obj[activeobj][s + 'effmult']) / ((this.obj[i].nownumber - 1) * this.obj[i].maxhealth + this.obj[i].nowhealth)) > 0)) {
                                        set_cursor(6);
                                        res = 'teleport';
                                    }
                                }
                            } else {
                                var b = 0;
                                if (carryo > 0) {
                                    if (this.obj[carryo].big) {
                                        setmap(this.obj[carryo].x + 1, this.obj[carryo].y + 1, 0);
                                        setmap(this.obj[carryo].x + 1, this.obj[carryo].y, 0);
                                        setmap(this.obj[carryo].x, this.obj[carryo].y + 1, 0);
                                    }
                                    if (this.obj[carryo].bigx) {
                                        setmap(this.obj[carryo].x + 1, this.obj[carryo].y, 0);
                                    }
                                    if (this.obj[carryo].bigy) {
                                        setmap(this.obj[carryo].x, this.obj[carryo].y + 1, 0);
                                    }
                                }
                                var bigx = this.obj[carryo]['big'];
                                var bigy = this.obj[carryo]['big'];
                                if (this.obj[carryo]['bigx']) bigx = 1;
                                if (this.obj[carryo]['bigy']) bigy = 1;
                                ok = true;
                                for (var xrr = xr; xrr <= xr + bigx; xrr++) {
                                    for (var yrr = yr; yrr <= yr + bigy; yrr++) {
                                        if ((carryo > 0) && ((xr != this.obj[carryo].x) || (yr != this.obj[carryo].y)) && (getmap(xrr, yrr) != 200) && (getmap(xrr, yrr) != 210) && ((getmap(xrr, yrr) != 211) || (mapobj[xrr + (yrr) * defxn] == carryo)) && (xr > 0) && (yr > 0) && (xr <= defxn - 2 - bigx) && (yr <= defyn - bigy)) {} else {
                                            ok = false;
                                            break;
                                        }
                                    }
                                }
                                var s = 'teleport';
                                if (carryo <= 0) {
                                    var r = 0;
                                    var r1 = 1;
                                } else {
                                    var r = Math.floor(10 * (this.obj[activeobj][s + 'effmain'] + (this.getspellpower(activeobj, s) + isperk(activeobj, 89) * 3) * this.obj[activeobj][s + 'effmult']) / ((this.obj[carryo].nownumber - 1) * this.obj[carryo].maxhealth + this.obj[carryo].nowhealth));
                                    var r1 = (xr - this.obj[carryo].x) * (xr - this.obj[carryo].x) + (yr - this.obj[carryo].y) * (yr - this.obj[carryo].y);
                                }
                                if (r1 > r * r) {
                                    ok = false;
                                }
                                if (ok) {
                                    set_cursor(6);
                                    if (xr + (yr) * defxn != lastshad) {
                                        if (lastshad > 0) {
                                            setshad(0, 0, bigx, bigy, false);
                                        }
                                        lastshad = xr + (yr) * defxn;
                                        setshad(0, 0, bigx, bigy, true);
                                    }
                                    magicx = xr;
                                    magicy = yr;
                                    res = 'teleport';
                                } else {
                                    res = 0;
                                    if (lastshad > 0) {
                                        setshad(0, 0, bigx, bigy, false);
                                    }
                                    lastshad = -1;
                                }
                                var lastshadt = lastshad;
                                if (carryo > 0) {
                                    lastshad = this.obj[carryo].x + this.obj[carryo].y * defxn;
                                    setshad(0, 0, bigx, bigy, true);
                                    lastshad = lastshadt;
                                    if ((bigx == 1) && (bigy == 1)) {
                                        setmap(this.obj[carryo].x + 1, this.obj[carryo].y + 1, 211);
                                        setmap(this.obj[carryo].x + 1, this.obj[carryo].y, 211);
                                        setmap(this.obj[carryo].x, this.obj[carryo].y + 1, 211);
                                    }
                                    if (bigx == 1) {
                                        setmap(this.obj[carryo].x + 1, this.obj[carryo].y, 211);
                                    }
                                    if (bigy == 1) {
                                        setmap(this.obj[carryo].x, this.obj[carryo].y + 1, 211);
                                    }
                                }
                            }
                            break;
                        case 'carry':
                            spd = Math.max(0, Math.round((this.obj[activeobj].speed + this.obj[activeobj]['ragespeed'] + this.obj[activeobj]['speedaddon']) * this.obj[activeobj].speedmodifier));
                            if (magic[activeobj]['ent']) {
                                spd = 0;
                            }
                            xr1 = xr;
                            yr1 = yr;
                            if (xr1 > this.obj[activeobj]['x']) {
                                xr1--;
                            }
                            if (yr1 > this.obj[activeobj]['y']) {
                                yr1--;
                            }
                            if (Math.abs(Math.abs(this.obj[activeobj]['x'] - xr1) - Math.abs(this.obj[activeobj]['y'] - yr1)) +
                                1.5 * (Math.max(Math.abs(this.obj[activeobj]['x'] - xr1), Math.abs(this.obj[activeobj]['y'] - yr1)) -
                                    Math.abs(Math.abs(this.obj[activeobj]['x'] - xr1) - Math.abs(this.obj[activeobj]['y'] - yr1))) <=
                                spd) {} else {
                                res = 0;
                                break;
                            }
                            if (carryo == -1) {
                                if ((xr <= 0) || (yr <= 0) || (xr > defxn - 2) || (yr > defyn)) {
                                    res = 0;
                                    break;
                                }
                                var len = this.obj_array.length;
                                for (var k1 = 0; k1 < len; k1++) {
                                    i = this.obj_array[k1];
                                    if ((!this.obj[i].warmachine) && ((!magic[i]['inv']) || (magic[i]['inv']['effect'] != 1)) && (!magic[i]['ent']) && (i == mapobj[xr + (yr) * defxn]) && (!this.obj[i].big) && (!this.obj[i].bigx) && (!this.obj[i].bigy) && (!this.obj[i].hero) && (this.obj[activeobj]['nownumber'] * 2 >= this.obj[i]['nownumber']) && (this.obj[i]['nownumber'] > 0) && (this.obj[i].side == this.obj[activeobj].getside())) {
                                        set_cursor(6);
                                        res = 'carry';
                                    }
                                }
                            } else {
                                if ((getmap(xr, yr) != 200) && (getmap(xr, yr) != 210) && (getmap(xr, yr) != 211)) {
                                    set_cursor(6);
                                    if (xr + (yr) * defxn != lastshad) {
                                        if (lastshad > 0) {
                                            setshad(0, 0, 0, 0, false);
                                        }
                                        lastshad = xr + (yr) * defxn;
                                        setshad(0, 0, 0, 0, true);
                                    }
                                    magicx = xr;
                                    magicy = yr;
                                    res = 'carry';
                                }
                            }
                            break;
                        case 'fireball':
                            set_cursor(6);
                            if (xr + (yr) * defxn != lastshad) {
                                if (lastshad > 0) {
                                    setshad(-1, -1, 1, 1, false);
                                }
                                if ((xr <= 0) || (yr <= 0) || (xr > defxn - 2) || (yr > defyn)) {
                                    res = 0;
                                    break;
                                }
                                lastshad = xr + (yr) * defxn;
                                setshad(-1, -1, 1, 1, true);
                            }
                            magicx = xr;
                            magicy = yr;
                            res = 'fireball';
                            this.calcmagic(activeobj, xr, yr, magicuse);
                            break;
                    }
                    if (k == 250) {
                        ok = true;
                        if ((activeobj > 0) && (this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr) && ((!android) || (!android_submit) || (this.obj[activeobj].hero) || (this.obj[activeobj].warmachine))) {
                            ok = false;
                        } else {
                            xrr = -1;
                            yrr = -1;
                            len = 100;
                            movex = xr;
                            movey = yr;
                            if ((activeobj > 0) && (this.obj[activeobj].big)) {
                                if ((wmap2[(xr) + (yr) * defxn] >= 0) && (!this.obj[activeobj].flyer)) {} else {
                                    if (this.obj[activeobj].flyer) {
                                        i = activeobj;
                                        setmap(this.obj[i].x, this.obj[i].y, 250);
                                        setmap(this.obj[i].x, this.obj[i].y + 1, 250);
                                        setmap(this.obj[i].x + 1, this.obj[i].y + 1, 250);
                                        setmap(this.obj[i].x + 1, this.obj[i].y, 250);
                                    }
                                    for (xk = xr - 1; xk <= xr; xk++) {
                                        for (yk = yr - 1; yk <= yr; yk++) {
                                            if (wmap2[(xk) + (yk) * defxn] >= 0) {
                                                if ((xr - xk) * (xr - xk) + (yr - yk) * (yr - yk) < len) {
                                                    xrr = xk;
                                                    yrr = yk;
                                                    len = (xr - xk) * (xr - xk) + (yr - yk) * (yr - yk);
                                                }
                                            }
                                        }
                                    }
                                    if (xrr != -1) {
                                        xr = xrr;
                                        yr = yrr;
                                        xr_last = xr;
                                        yr_last = yr;
                                        movex = xr;
                                        movey = yr;
                                        if ((this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr) && (!android)) {
                                            movex = 0;
                                            movey = 0;
                                            res = 0;
                                            ok = false;
                                        }
                                    } else {
                                        movex = 0;
                                        movey = 0;
                                        res = 0;
                                        ok = false;
                                    }
                                }
                            }
                            if ((activeobj > 0) && (this.obj[activeobj].bigx) && (ok)) {
                                if ((wmap2[(xr) + (yr) * defxn] >= 0) && (!this.obj[activeobj].flyer)) {} else {
                                    if (this.obj[activeobj].flyer) {
                                        i = activeobj;
                                        setmap(this.obj[i].x, this.obj[i].y, 250);
                                        setmap(this.obj[i].x + 1, this.obj[i].y, 250);
                                    }
                                    for (xk = xr - 1; xk <= xr + 1; xk++) {
                                        for (yk = yr - 1; yk <= yr + 1; yk++) {
                                            if (wmap2[(xk) + (yk) * defxn] >= 0) {
                                                if ((xr - xk) * (xr - xk) + (yr - yk) * (yr - yk) < len) {
                                                    if (this.obj[activeobj].flyer) {
                                                        if ((getmap(xk, yk) != 250) || (getmap(xk + 1, yk) != 250)) {
                                                            continue;
                                                        }
                                                        xrr = xk;
                                                        yrr = yk;
                                                        len = (xr - xk) * (xr - xk) + (yr - yk) * (yr - yk);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (xrr != -1) {
                                        xr = xrr;
                                        yr = yrr;
                                        xr_last = xr;
                                        yr_last = yr;
                                        movex = xr;
                                        movey = yr;
                                        if ((this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr)) {
                                            movex = 0;
                                            movey = 0;
                                            res = 0;
                                            ok = false;
                                        }
                                    } else {
                                        movex = 0;
                                        movey = 0;
                                        res = 0;
                                        ok = false;
                                    }
                                }
                            }
                            if ((activeobj > 0) && (this.obj[activeobj].bigy) && (ok)) {
                                if ((wmap2[(xr) + (yr) * defxn] >= 0) && (!this.obj[activeobj].flyer)) {} else {
                                    if (this.obj[activeobj].flyer) {
                                        i = activeobj;
                                        setmap(this.obj[i].x, this.obj[i].y, 250);
                                        setmap(this.obj[i].x, this.obj[i].y + 1, 250);
                                    }
                                    for (xk = xr - 1; xk <= xr + 1; xk++) {
                                        for (yk = yr - 1; yk <= yr + 1; yk++) {
                                            if (wmap2[(xk) + (yk) * defxn] >= 0) {
                                                if ((xr - xk) * (xr - xk) + (yr - yk) * (yr - yk) < len) {
                                                    if (this.obj[activeobj].flyer) {
                                                        if ((getmap(xk, yk) != 250) || (getmap(xk, yk + 1) != 250)) {
                                                            continue;
                                                        }
                                                        xrr = xk;
                                                        yrr = yk;
                                                        len = (xr - xk) * (xr - xk) + (yr - yk) * (yr - yk);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (xrr != -1) {
                                        xr = xrr;
                                        yr = yrr;
                                        xr_last = xr;
                                        yr_last = yr;
                                        movex = xr;
                                        movey = yr;
                                        if ((this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr)) {
                                            movex = 0;
                                            movey = 0;
                                            res = 0;
                                            ok = false;
                                        }
                                    } else {
                                        movex = 0;
                                        movey = 0;
                                        res = 0;
                                        ok = false;
                                    }
                                }
                            }
                        }
                        if ((ok) && (activeobj > 0)) {
                            if ((magicuse == 'leap') || (magicuse == 'leap6')) {
                                res = 0;
                                ok = false;
                            }
                            if (ok) {
                                set_cursor(1);
                                xr_go = xr;
                                yr_go = yr;
                                if (xr + (yr) * defxn != lastshad) {
                                    if ((lastshad > 0) && (shado[lastshad])) {
                                        set_visible(shado[lastshad], 0);
                                        if (this.obj[activeobj].big) {
                                            if (shado[lastshad + 1 + defxn]) {
                                                set_visible(shado[lastshad + 1], 0);
                                                set_visible(shado[lastshad + 1 + defxn], 0);
                                                set_visible(shado[lastshad + defxn], 0);
                                            }
                                        }
                                        if (this.obj[activeobj].bigx) {
                                            set_visible(shado[lastshad + 1], 0);
                                        }
                                        if (this.obj[activeobj].bigy) {
                                            set_visible(shado[lastshad + defxn], 0);
                                        }
                                    }
                                    lastshad = xr + (yr) * defxn;
                                    set_visible(shado[xr + (yr) * defxn], 1);
                                    if (this.obj[activeobj].big) {
                                        set_visible(shado[xr + (yr) * defxn + 1], 1);
                                        set_visible(shado[xr + (yr) * defxn + 1 + defxn], 1);
                                        set_visible(shado[xr + (yr) * defxn + defxn], 1);
                                    }
                                    if (this.obj[activeobj].bigx) {
                                        set_visible(shado[xr + (yr) * defxn + 1], 1);
                                    }
                                    if (this.obj[activeobj].bigy) {
                                        set_visible(shado[xr + (yr) * defxn + defxn], 1);
                                    }
                                }
                                res = 250;
                            }
                        }
                    }
                    resa = this.in_mousemove(xr, yr, k, magicuse);
                    if (resa['res'] != 0) {
                        res = resa['res'];
                        magicx = resa['magicx'];
                        magicy = resa['magicy'];
                    }
                    if (k == 'frenzy') {
                        ok = true;
                        set_cursor(6);
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        if (getmap(xr, yr) != 210) {
                            res = 0;
                            ok = false;
                        }
                        if (ok) {
                            if (((this.obj[mapobj[yr * defxn + xr]].hero) || (this.obj[mapobj[yr * defxn + xr]].warmachine) || (!this.obj[mapobj[yr * defxn + xr]].alive) || (this.obj[mapobj[yr * defxn + xr]].imind) || (this.obj[mapobj[yr * defxn + xr]].twistedmind) || ((magic[mapobj[yr * defxn + xr]]['wfr']) && (magic[mapobj[yr * defxn + xr]]['wfr']['effect'] == 1)) || (this.obj[mapobj[yr * defxn + xr]].absolutepurity) || (this.obj[mapobj[yr * defxn + xr]].ifrenzy)) && (this.obj[mapobj[yr * defxn + xr]].nownumber > 0)) {
                                ok = false;
                            }
                            if ((ok) && (btype == _PVP_DIAGONAL_EVENT) && (checkwall2(this.obj[activeobj]['x'], this.obj[activeobj]['y'], xr, yr, activeobj))) {
                                ok = false;
                            }
                            if (ok) {
                                var s = 'frenzy';
                                var addeff = 0;
                                if (this.obj[activeobj].hero) {
                                    if (isperk(activeobj, 78)) {
                                        addeff += 5;
                                    }
                                    if (isperk(activeobj, 89)) {
                                        addeff += 3;
                                    }
                                }
                                var th = (this.obj[mapobj[yr * defxn + xr]].nownumber - 1) * this.obj[mapobj[yr * defxn + xr]].maxhealth + this.obj[mapobj[yr * defxn + xr]].nowhealth;
                                var pff = getimmune2(activeobj, mapobj[yr * defxn + xr]) * (this.obj[activeobj][s + 'effmain'] + (this.getspellpower(activeobj, magicuse) + addeff) * this.obj[activeobj][s + 'effmult']);
                                if (th > pff) ok = false;
                                if (!ok) {
                                    res = 0;
                                } else {
                                    lastshad = xr + (yr) * defxn;
                                    setshad(0, 0, 0, 0, true);
                                    res = 'frenzy';
                                    magicx = xr;
                                    magicy = yr;
                                }
                            }
                        }
                        if (!ok) res = 0;
                    }
                    if (k == 'battledive') {
                        set_cursor(8);
                        ok = true;
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                            if ((xr <= 0) || (yr <= 0) || (xr > defxn - 2) || (yr > defyn)) {
                                res = 0;
                                ok = false;
                            }
                            if (ok) {
                                lastshad = xr + (yr) * defxn;
                                setshad(0, 0, 0, 0, true);
                            }
                        }
                        if (ok) {
                            magicx = xr;
                            magicy = yr;
                            res = 'battledive';
                            defender = mapobj[yr * defxn + xr];
                            if ((defender > 0) && (defender < 1000)) this.attackmonster(activeobj, xr, yr, xr, yr, defender);
                        }
                    }
                    if (k == 'circle_of_winter') {
                        set_cursor(6);
                        ok = true;
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(-1, -1, 1, 1, false);
                            }
                            if ((xr <= 0) || (yr <= 0) || (xr > defxn - 2) || (yr > defyn)) {
                                res = 0;
                                ok = false;
                            }
                            if (ok) {
                                lastshad = xr + (yr) * defxn;
                                setshad(-1, -1, 1, 1, true);
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        if (ok) {
                            magicx = xr;
                            magicy = yr;
                            res = 'circle_of_winter';
                            this.calcmagic(activeobj, xr, yr, magicuse);
                        }
                    }
                    if (k == 'stonespikes') {
                        set_cursor(6);
                        ok = true;
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                                lastshad--;
                                setshad(0, 0, 0, 0, false);
                                lastshad += 2;
                                setshad(0, 0, 0, 0, false);
                                lastshad--;
                                lastshad -= defxn;
                                setshad(0, 0, 0, 0, false);
                                lastshad += 2 * defxn;
                                setshad(0, 0, 0, 0, false);
                                lastshad -= defxn;
                            }
                            if ((xr <= 0) || (yr <= 0) || (xr > defxn - 2) || (yr > defyn)) {
                                res = 0;
                                ok = false;
                            }
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            lastshad--;
                            setshad(0, 0, 0, 0, true);
                            lastshad += 2;
                            setshad(0, 0, 0, 0, true);
                            lastshad--;
                            lastshad -= defxn;
                            setshad(0, 0, 0, 0, true);
                            lastshad += 2 * defxn;
                            setshad(0, 0, 0, 0, true);
                            lastshad -= defxn;
                        }
                        if (ok) {
                            magicx = xr;
                            magicy = yr;
                            res = 'stonespikes';
                            this.calcmagic(activeobj, xr, yr, magicuse);
                        }
                    }
                    if (k == 'wordofchief') {
                        set_cursor(6);
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        ok = false;
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((!this.obj[i].warmachine) && (!this.obj[i].hero) && (i == mapobj[xr + (yr) * defxn]) && (this.obj[i].side == this.obj[activeobj].getside()) && (this.obj[i].nownumber > 0)) {
                                ok = true;
                                break;
                            }
                        }
                        if (!ok) {
                            res = 0;
                            this.reset_temp_magic();
                            this.showatb();
                        } else {
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'wordofchief';
                            magicx = xr;
                            magicy = yr;
                            var eff = this.obj[activeobj][magicuse + 'effmain'];
                            var init = eff * 100;
                            var j = mapobj[lastshad];
                            if (this.obj[j]['nowinit'] - init < this.obj[activeobj]['nowinit']) {
                                init = Math.floor(this.obj[j]['nowinit'] - this.obj[activeobj]['nowinit']);
                            }
                            this.reset_temp_magic();
                            this.obj[mapobj[yr * defxn + xr]]['reset_init'] = -init;
                            this.showatb();
                        }
                    }
                    if (k == 'wheeloffortune') {
                        set_cursor(6);
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        ok = false;
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((i == mapobj[xr + (yr) * defxn]) && (this.obj[i].nownumber > 0) && (!this.obj[i].hero) && (i != activeobj)) {
                                ok = true;
                            }
                        }
                        if (!ok) {
                            res = 0;
                        } else {
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'wheeloffortune';
                            magicx = xr;
                            magicy = yr;
                        }
                    }
                    if (k == 'corpseeater') {
                        set_cursor(6);
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        var maxh = this.obj[activeobj]['maxnumber'] * this.obj[activeobj]['maxhealth'];
                        var nowh = (this.obj[activeobj]['nownumber'] - 1) * this.obj[activeobj]['maxhealth'] + this.obj[activeobj]['nowhealth'];
                        big2 = 0;
                        if (this.obj[activeobj].big) big2 = 1;
                        var ok1 = false;
                        if (nowh < maxh) {
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                var k = this.obj_array[k1];
                                var big = 0;
                                if (this.obj[k]['big']) big = 1;
                                if ((this.obj[k]['nownumber'] == 0) && (this.obj[k]['alive']) && (!this.obj[k]['warmachine']) && (!this.obj[k]['hsm']) && (this.obj[k].x >= xr) && (this.obj[k].x <= xr + big) && (this.obj[k].y >= yr) && (this.obj[k].y <= yr + big)) {
                                    var ok = false;
                                    for (var x1 = this.obj[k]['x'] - 1 - big2; x1 <= this.obj[k]['x'] + 1 + big; x1++) {
                                        for (var y1 = this.obj[k]['y'] - 1 - big2; y1 <= this.obj[k]['y'] + 1 + big; y1++) {
                                            if ((wmap2[(x1) + (y1) * defxn] >= 0)) {
                                                ok = true;
                                                break;
                                            }
                                        }
                                        if (ok) break;
                                    }
                                    if (!ok) continue;
                                    var ok1 = true;
                                    for (var x1 = this.obj[k]['x']; x1 <= this.obj[k]['x'] + big; x1++) {
                                        for (var y1 = this.obj[k]['y']; y1 <= this.obj[k]['y'] + big; y1++) {
                                            if (mapobj[yr * defxn + xr] > 0) ok1 = false;
                                        }
                                    }
                                    if (ok1) break;
                                }
                            }
                        }
                        if (!ok1) {
                            res = 0;
                        } else {
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'corpseeater';
                            magicx = xr;
                            magicy = yr;
                        }
                    }
                    if (k == 'wavesofrenewal') {
                        set_cursor(6);
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        ok = false;
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((i == mapobj[xr + (yr) * defxn]) && (this.obj[i].nownumber > 0) && (!this.obj[i].hero) && (this.obj[i].side == this.obj[activeobj].getside())) {
                                ok = true;
                            }
                        }
                        if (!ok) {
                            res = 0;
                        } else {
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'wavesofrenewal';
                            magicx = xr;
                            magicy = yr;
                        }
                    }
                    if (k == 'angerofhorde') {
                        set_cursor(6);
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        if (getmap(xr, yr) != 210) {
                            res = 0;
                        } else {
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'angerofhorde';
                            magicx = xr;
                            magicy = yr;
                            if (stage.pole.obj[activeobj]["divinev"]) {
                                this.calcdivinev(activeobj, xr, yr);
                            } else {
                                this.calcmagic(activeobj, xr, yr, magicuse);
                            }
                        }
                    }
                    if (k == 'spiritlink') {
                        set_cursor(6);
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        ok = false;
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((!this.obj[i].warmachine) && (!this.obj[i].immunity) && (!this.obj[i].enchantedarmor) && (!this.obj[i].hero) && (i == mapobj[xr + (yr) * defxn]) && (i != activeobj) && (this.obj[i].side == this.obj[activeobj].getside()) && (this.obj[i].nownumber > 0)) {
                                ok = true;
                                break;
                            }
                        }
                        if (!ok) {
                            res = 0;
                        } else {
                            lastshad = xr + (yr) * defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'spiritlink';
                            magicx = xr;
                            magicy = yr;
                        }
                    }
                    if (k == 'setsnares') {
                        set_cursor(6);
                        ok = true;
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                            if ((xr <= 0) || (yr <= 0) || (xr > defxn - 2) || (yr > defyn) || ((getmap(xr, yr) != 250) && (getmap(xr, yr) != 0))) {
                                res = 0;
                                ok = false;
                                if (getmap(xr, yr) == 210) {
                                    showuron(1, snaresPossible(this.obj[activeobj], this.obj[mapobj[yr * defxn + xr]]));
                                }
                            } else {
                                lastshad = xr + (yr) * defxn;
                                setshad(0, 0, 0, 0, true);
                            }
                        }
                        if (ok) {
                            magicx = xr;
                            magicy = yr;
                            res = 'setsnares';
                        }
                    }
                    if (k == 'setmagicmine') {
                        set_cursor(6);
                        ok = true;
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                            if ((xr <= 0) || (yr <= 0) || (xr > defxn - 2) || (yr > defyn) || ((getmap(xr, yr) != 250) && (getmap(xr, yr) != 0))) {
                                res = 0;
                                ok = false;
                            } else {
                                lastshad = xr + (yr) * defxn;
                                setshad(0, 0, 0, 0, true);
                            }
                        }
                        if (ok) {
                            magicx = xr;
                            magicy = yr;
                            res = 'setmagicmine';
                        }
                    }
                    if (k == 'fearmyroar') {
                        set_cursor(6);
                        if (xr + (yr) * defxn != lastshad) {
                            if (lastshad > 0) {
                                setshad(0, 0, 0, 0, false);
                            }
                        }
                        this.reset_temp_magic();
                        this.showatb();
                        if (getmap(xr, yr) != 210) {
                            res = 0;
                        } else {
                            ok = true;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                i = this.obj_array[k1];
                                if (((this.obj[i].hero) || (this.obj[i].warmachine) || (this.obj[i].absolutepurity) || (!this.obj[i].alive) || (this.obj[i].imind) || (this.obj[i].twistedmind) || ((magic[i]['wfr']) && (magic[i]['wfr']['effect'] == 1))) && (mapobj[yr * defxn + xr] == i) && (this.obj[i].nownumber > 0)) {
                                    ok = false;
                                    break;
                                }
                                if (((this.obj[i].nownumber - 1) * this.obj[i].maxhealth + this.obj[i].nowhealth > this.obj[activeobj]['fearmyroar' + 'effmain']) && (this.obj[i].nownumber > 0) && (mapobj[yr * defxn + xr] == i)) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (!ok) {
                                res = 0;
                            } else {
                                lastshad = xr + (yr) * defxn;
                                var defender = mapobj[lastshad];
                                if (this.obj[defender]['nowinit'] < 100) {
                                    var init = 100;
                                    if (this.obj[defender]['nowinit'] - this.obj[activeobj]['nowinit'] + init > 100) {
                                        init = Math.max(0, Math.floor(100 + this.obj[activeobj]['nowinit'] - this.obj[defender]['nowinit']));
                                    }
                                    this.reset_temp_magic();
                                    this.obj[defender]['reset_init'] = init;
                                    this.showatb();
                                }
                                setshad(0, 0, 0, 0, true);
                                res = 'curse';
                                magicx = xr;
                                magicy = yr;
                            }
                        }
                    }
                    tUronkills = 0;
                    tUronkills2 = 0;
                    tPhysicalDamage = 0;
                    tPhysicalDamage2 = 0;
                    res = this.checkcast(k, res, xr, yr);
                    if ((magicuse != '') && (this.obj[activeobj]['hero']) && (magicuse != 'raisedead') && (magicuse != 'resurrection')) {
                        var plus = 100;
                        if (isperk(activeobj, 105)) plus = 90;
                        if (isperk(activeobj, 106)) plus = 80;
                        if (isperk(activeobj, 107)) plus = 70;
                        if ((isperk(activeobj, 85)) && ((magicuse == 'mbless') || (magicuse == 'mdispel'))) {
                            plus = 50;
                        }
                        if ((isperk(activeobj, 84)) && ((magicuse == 'mstoneskin') || (magicuse == 'mdeflect_missile'))) {
                            plus = 50;
                        }
                        if ((isperk(activeobj, 86)) && ((magicuse == 'mfast') || (magicuse == 'mrighteous_might'))) {
                            plus = 50;
                        }
                        if ((isperk(activeobj, 75)) && ((magicuse == 'mcurse') || (magicuse == 'msuffering'))) {
                            plus = 50;
                        }
                        if ((isperk(activeobj, 76)) && ((magicuse == 'mslow') || (magicuse == 'mconfusion'))) {
                            plus = 50;
                        }
                        if ((isperk(activeobj, 77)) && (magicuse == 'mdray')) {
                            plus = 50;
                        }
                        if ((magicuse == 'raisedead') && (umelka[this.obj[activeobj]['owner']][0] == 2) && (!magic[activeobj]['nps']) && (this.obj[activeobj]['hero']) && (magic[activeobj]['cls']) && (magic[activeobj]['cls']['effect'] == 1)) {
                            kk = (1 - 0.03 * umelka[this.obj[activeobj]['owner']][2]);
                            plus = Math.round(plus * kk);
                        }
                        if (plus != 100) {
                            this.obj[activeobj]['reset_init'] = 0;
                            this.obj[activeobj]['plus_init'] = plus;
                            this.showatb(activeobj);
                            this.obj[activeobj]['was_atb'] = 1;
                        }
                    }
                    var a = 1;
                    switch (a) {
                        case 1:
                            if (k == enemy) {
                                if ((activeobj > 0) && (magic[activeobj]['noa']) && (magic[activeobj]['noa']['nowinit'] > 0)) {
                                    clearshadway();
                                    set_visible(csword, 0);
                                    set_cursor(5);
                                    res = 200;
                                    return 0;
                                }
                                if ((activeobj > 0) && (this.obj[activeobj].shooter) && (this.obj[activeobj].shots > 0) && (((!shiftdown) && (likeshift <= shiftcount)) || (this.obj[activeobj].hero))) {
                                    xaa = this.obj[activeobj].x;
                                    yaa = this.obj[activeobj].y;
                                    xaa1 = xaa;
                                    yaa1 = yaa;
                                    b = 0;
                                    if (this.obj[activeobj].big) {
                                        if (xaa < xr) {
                                            xaa++
                                        }
                                        if (yaa < yr) {
                                            yaa++
                                        }
                                    }
                                    if (this.obj[activeobj].bigx) {
                                        if (xaa < xr) {
                                            xaa++
                                        }
                                    }
                                    if (this.obj[activeobj].bigy) {
                                        if (yaa < yr) {
                                            yaa++
                                        }
                                    }
                                    var bigx = this.obj[activeobj]['big'];
                                    var bigy = this.obj[activeobj]['big'];
                                    if (this.obj[activeobj]['bigx']) bigx = 1;
                                    if (this.obj[activeobj]['bigy']) bigy = 1;
                                    range = (xaa - xr) * (xaa - xr) + (yaa - yr) * (yaa - yr);
                                    ok = true;
                                    for (xb = -1; xb <= 1 + bigx; xb++) {
                                        for (yb = -1; yb <= 1 + bigy; yb++) {
                                            if ((yb + yaa1 >= 1) && (yb + yaa1 <= defyn) && (xaa1 + xb >= 0) && (xaa1 + xb <= defxn - 1) && (getmap(xaa1 + xb, yaa1 + yb) == 210) && (mapobj[xaa1 + xb + (yaa1 + yb) * defxn] > 0) && (this.obj[mapobj[xaa1 + xb + (yaa1 + yb) * defxn]].statix != 1)) {
                                                ok = false;
                                            }
                                        }
                                    }
                                    if (((range > 2) && (ok)) || (this.obj[activeobj].hero) || (this.obj[activeobj].ballista) || (this.obj[activeobj].warmachine)) {
                                        if (!this.obj[activeobj].hero) {
                                            if (((Math.sqrt(range) > this.obj[activeobj].range) && (!this.obj[activeobj].shadowattack)) || ((iswalls) && (!this.obj[activeobj].hero) && (checkwall(xaa, yaa, xr, yr))) ||
                                                ((((!this.obj[activeobj].siegewalls) || (btype == 118)) || (!this.obj[mapobj[yr * defxn + xr]].stone)) && (iswalls2) && (!this.obj[activeobj].hero) && (checkwall2(xaa, yaa, xr, yr, activeobj)))) {
                                                set_cursor(4);
                                            } else {
                                                set_cursor(3);
                                            }
                                        }
                                        if (this.obj[activeobj].hero) {
                                            set_cursor(2);
                                            if ((this.obj[activeobj].id == 59) || (this.obj[activeobj].id == 54) || (this.obj[activeobj].id == 48)) {
                                                set_cursor(3);
                                            }
                                        }
                                        if ((this.obj[activeobj].magicattack) || (this.obj[activeobj].piercingbolt)) {
                                            lastmag = xr + yr * defxn;
                                            lastshad = -2;
                                            this.magshot(xr, yr);
                                        }
                                        attackx = xaa1;
                                        attacky = yaa1;
                                        res = 210.5;
                                        if (magicuse == 'harpoonstrike') {
                                            set_cursor(8);
                                            magicx = attackx;
                                            magicy = attacky;
                                        }
                                        if ((cur_cursor == 2) || (cur_cursor == 4) || (cur_cursor == 3)) {
                                            if ((this.obj[activeobj]['hero']) && (magic[activeobj]['brb'])) {
                                                var init = 20;
                                                var defender = mapobj[xr + yr * defxn];
                                                if (this.obj[defender]['nowinit'] - this.obj[activeobj]['nowinit'] + init > 100) {
                                                    init = Math.max(0, Math.floor(100 + this.obj[activeobj]['nowinit'] - this.obj[defender]['nowinit']));
                                                }
                                                this.reset_temp_magic();
                                                this.obj[defender]['reset_init'] = init;
                                                this.showatb();
                                                this.obj[activeobj]['was_atb'] = 1;
                                            }
                                            this.check_shoot_abilities(activeobj, this.obj[activeobj].x, this.obj[activeobj].y, xr, yr);							
                                            this.attackmonster(activeobj, xr, yr, this.obj[activeobj].x, this.obj[activeobj].y, mapobj[yr * defxn + xr], 1);									
                                            this.checkProbabilitySkill(activeobj, attackx, attacky, xr, yr, 1);
                                            showuron();													
                                        }
                                        break;
                                    }
                                }
                                var def = mapobj[yr * defxn + xr];
                                if ((range <= 2) && (magicuse == 'harpoonstrike')) return 0;
                                if ((def <= 0) || (!this.obj[def])) return 0;
                                if ((activeobj > 0) && (this.obj[activeobj].shootonly)) {
                                    set_visible(csword, 0);
                                    set_cursor(5);
                                    res = 200;
                                    return 0;
                                }
                                if (((magicuse == 'harmtouch') && ((this.obj[def].warmachine) || (this.obj[def].stone) || (this.obj[def].portal) || (this.obj[def].maxhealth >= 400))) ||
                                    ((magicuse == 'layhands') && ((!this.obj[def].alive) || (def == activeobj))) || ((magicuse == 'orderofchief') && (def == activeobj))) {
                                    set_cursor(0);
                                    crun_visible2 = false;
                                    clearshadway();
                                    return 0;
                                }
                                set_cursor(2);
                                if ((activeobj > 0) && (this.obj[activeobj].strikeandreturn) && ((shiftdown) || (likeshift > shiftcount))) {
                                    set_cursor(7);
                                }
                                var xo = this.obj[def].x;
                                var yo = this.obj[def].y;
                                var xp = 0,
                                    yp = 0,
                                    xpp = 0,
                                    ypp = 0,
                                    dd = 0,
                                    bdd = 100000,
                                    bxp = 0,
                                    byp = 0;
                                var bigx = 0,
                                    bigy = 0,
                                    bxr = 0,
                                    byr = 0;
                                if (this.obj[def].bigx || this.obj[def].big) bigx = 1;
                                if (this.obj[def].bigy || this.obj[def].big) bigy = 1;
                                var one_place = 0;
                                if (xr_go > 0) {
                                    for (var xt = xo; xt <= xo + bigx; xt++)
                                        for (var yt = yo; yt <= yo + bigy; yt++)
                                            for (xp = -1 - this.obj[activeobj].big + xt; xp <= xt + 1; xp++)
                                                for (yp = -1 - this.obj[activeobj].big + yt; yp <= yt + 1; yp++)
                                                    if ((xr_go == xp) && (yr_go == yp)) one_place = 1;
                                }
                                if (one_place == 0) {
                                    xr_go = -1;
                                    yr_go = -1;
                                }
                                if (activeobj > 0) {
                                    for (var xt = xo; xt <= xo + bigx; xt++)
                                        for (var yt = yo; yt <= yo + bigy; yt++)
                                            for (xp = -1 - this.obj[activeobj].big + xt; xp <= xt + 1; xp++)
                                                for (yp = -1 - this.obj[activeobj].big + yt; yp <= yt + 1; yp++) {
                                                    if (wmap_a[yp * defxn + xp] >= 0) {
                                                        if ((magicuse == 'incinerate') && ((xp != this.obj[activeobj].x) || (yp != this.obj[activeobj].y))) continue;
                                                        xpp = (xp - xt + 1 + this.obj[activeobj].big + 0.5) / (3 + this.obj[activeobj].big);
                                                        ypp = (yp - yt + 1 + this.obj[activeobj].big + 0.5) / (3 + this.obj[activeobj].big);
                                                        dd = (xt - 1 + xpp - r.x) * (xt - 1 + xpp - r.x) + (yt - 1 + ypp - r.y) * (yt - 1 + ypp - r.y);
                                                        if ((android) && (one_place) && ((xr_go != xp) || (yr_go != yp))) continue;
                                                        if (dd < bdd) {
                                                            bdd = dd;
                                                            bxp = xp;
                                                            byp = yp;
                                                            bxr = xt + xpp;
                                                            byr = yt + ypp;
                                                        }
                                                    }
                                                }
                                } else {
                                    break;
                                }
                                ac = 200;
                                set_visible(csword, 1);
                                if (bdd < 100000) {
                                    ac = 0;
                                    xr = Math.floor(bxr);
                                    yr = Math.floor(byr);
                                    xr_last = xr;
                                    yr_last = yr;
                                    xb = bxp - xr;
                                    yb = byp - yr;
                                    xt = xr;
                                    yt = yr;
                                    xt2 = r.x + 1;
                                    yt2 = r.y + 1;
                                    xt2 = bxr;
                                    yt2 = byr;
                                    ac = Math.atan((yt + 0.5 - yt2) / (xt + 0.5 - xt2)) * 180 / Math.PI;
                                    if ((xt + 0.5 - xt2) >= 0) ac = 180 + ac;
                                }
                                if (ac == 200) {
                                    set_visible(csword, 0);
                                    set_cursor(5);
                                    res = 200;
                                    break;
                                }
                                a = ac;
                                if (xr + xb + (yr + yb) * defxn != lastshad) {
                                    if (lastshad > 0) {
                                        set_visible(shado[lastshad], 0);
                                        if (this.obj[activeobj].big) {
                                            if (shado[lastshad + 1]) set_visible(shado[lastshad + 1], 0);
                                            if (shado[lastshad + 1 + defxn]) set_visible(shado[lastshad + 1 + defxn], 0);
                                            if (shado[lastshad + defxn]) set_visible(shado[lastshad + defxn], 0);
                                        }
                                        if (this.obj[activeobj].bigx) {
                                            set_visible(shado[lastshad + 1], 0);
                                        }
                                        if (this.obj[activeobj].bigy) {
                                            set_visible(shado[lastshad + defxn], 0);
                                        }
                                    }
                                    lastshad = xr + xb + (yr + yb) * defxn;
                                    set_visible(shado[xr + xb + (yr + yb) * defxn], 1);
                                    if (this.obj[activeobj].big) {
                                        set_visible(shado[xr + xb + (yr + yb) * defxn + 1], 1);
                                        set_visible(shado[xr + xb + (yr + yb) * defxn + 1 + defxn], 1);
                                        set_visible(shado[xr + xb + (yr + yb) * defxn + defxn], 1);
                                    }
                                    if (this.obj[activeobj].bigx) {
                                        set_visible(shado[xr + xb + (yr + yb) * defxn + 1], 1);
                                    }
                                    if (this.obj[activeobj].bigy) {
                                        set_visible(shado[xr + xb + (yr + yb) * defxn + defxn], 1);
                                    }
                                }
                                attack_xr = xr;
                                attack_yr = yr;
                                xr_last = xr;
                                yr_last = yr;
                                attackx = xr + xb;
                                attacky = yr + yb;
                                if ((magicuse == 'harmtouch') || (magicuse == 'feralcharge') || (magicuse == 'unstoppablecharge') || (magicuse == 'allaroundslash') || (magicuse == 'slam') || (magicuse == 'mightyslam') || (magicuse == 'layhands') || (magicuse == 'orderofchief') || (magicuse == 'leap') || (magicuse == 'leap6') || (magicuse == 'incinerate')) {
                                    if ((magicuse == 'leap') || (magicuse == 'leap6') || (magicuse == 'feralcharge') || (magicuse == 'unstoppablecharge') || (magicuse == 'allaroundslash') || (magicuse == 'slam') || (magicuse == 'mightyslam') || (magicuse == 'harpoonstrike') || (magicuse == 'incinerate')) {
                                        set_cursor(8);
                                    } else {
                                        set_cursor(6);
                                    }
                                    magicx = attackx;
                                    magicy = attacky;
                                    set_visible(csword, 0);
                                }
                                if (magicuse == 'hailstorm') {
                                    magicx = attackx;
                                    magicy = attacky;
                                }
                                this.check_abilities(activeobj, attackx, attacky, xr, yr);
                                if ((cur_cursor == 2) || (cur_cursor == 7)) {
                                    this.attackmonster(activeobj, xr, yr, attackx, attacky, def, 0);
                                    this.checkProbabilitySkill(activeobj, attackx, attacky, xr, yr);
                                    showuron();
                                }
                                if (magicuse == 'leap') {
                                    tUronkills = 0;
                                    tUronkills2 = 0;
                                    tPhysicalDamage = 0;
                                    tPhysicalDamage2 = 0;
                                    var dx = Math.abs(this.obj[activeobj]['x'] - attackx);
                                    var dy = Math.abs(this.obj[activeobj]['y'] - attacky);
                                    var diag = Math.abs(dx - dy) + 1.5 * (Math.max(dx, dy) - Math.abs(dx - dy));
                                    var monatt = Math.floor((this.obj[activeobj]['attack'] + this.obj[activeobj]['attackaddon'] + this.obj[activeobj]['rageattack']) * diag * 0.1);
                                    this.obj[activeobj]['attackaddon'] += monatt;
                                    setmap(this.obj[activeobj].x, this.obj[activeobj].y, 1, false);
                                    this.attackmonster(activeobj, xr, yr, attackx, attacky, def, 0);
                                    this.obj[activeobj]['attackaddon'] -= monatt;
                                    showuron();
                                }
                                if (magicuse == 'leap6') {
                                    tUronkills = 0;
                                    tUronkills2 = 0;
                                    tPhysicalDamage = 0;
                                    tPhysicalDamage2 = 0;
                                    var dx = Math.abs(this.obj[activeobj]['x'] - attackx);
                                    var dy = Math.abs(this.obj[activeobj]['y'] - attacky);
                                    var diag = Math.abs(dx - dy) + 1.5 * (Math.max(dx, dy) - Math.abs(dx - dy));
                                    var koef = 1 + diag * 0.05;
                                    setmap(this.obj[activeobj].x, this.obj[activeobj].y, 1, false);
                                    this.attackmonster(activeobj, xr, yr, attackx, attacky, def, 0, koef, 'lep');
                                    showuron();
                                }
                                set_angle(csword, (Math.round(a)));
                                var b = getxa(xr, yr);
                                xsize2 = (b.x[2] - b.x[3]);
                                var scale = this.scaling;
                                set_scaleX(csword, scale);
                                set_scaleY(csword, scale);
                                set_X(csword, ((b.x[3] + b.x[2]) / 2 + Math.cos(a / 180 * Math.PI) * xsize2 / 2));
                                set_Y(csword, ((b.y[3] + b.y[1]) / 2 + Math.sin(a / 180 * Math.PI) * (b.y[1] - b.y[3]) / 2));
                                res = 210;
                            }
                            break;
                    }
                    if (res == 0) {
                        crun_visible2 = false;
                        xr_go = -1;
                        yr_go = -1;
                        set_cursor(0);
                    }
                    if (res != 210) {
                        set_visible(csword, 0);
                    }
                    if ((res == 0) || (res == 210.5) || (res == 200)) {
                        clearshadway();
                    }
                    if ((res == 200) && (cancelway)) {
                        this.getnearpos(xr, yr);
                    }
                    this.check_uron_abil(res, xr, yr);
                    if (crun_visible2) {} else {
                        set_cursor(0);
                    }
                    draw_ground();
                }
                stage.pole.commandsproc = window.commandsproc = function() {
                    ccounter++;
                    if ((!android) && (inserted) && (ccounter % 4 == 0)) {
                        ccounter = 0;
                        if (KeyisDown(16)) shiftdown = true;
                        else shiftdown = false;
                        if (KeyisDown(17)) {
                            ctrldown = true;
                            this.onMouseMoveFlash(false, mousePos.x, mousePos.y, 1);
                        } else {
                            ctrldown = false;
                        }
                        if (lastshiftdown != shiftdown) {
                            lastshiftdown = shiftdown;
                            movecounter = 0;
                        }
                    }
                    movecounter++;
                    if ((activeobj) && (this.obj[activeobj]) && (this.obj[activeobj].firstaid)) {
                        magicuse = 'firstaid';
                    }
                    if (!loading) {
                        if ((btype == 86) || (btype == 87)) {
                            soundon = false;
                        }
                        if ((soundeff == -1) && (btype != 86) && (btype != 87) && (btype != 82)) {
                            mousevisible = true;
                        }
                    }
                    if (!initialized) {
                        return 0;
                    }
                    if ((soundeff == -1) && (btype != 86) && (btype != 87) && (btype != 82)) {
                        if ((typeof cordova_client != 'undefined') && (cordova_client)) {
                            soundeff = 1;
                        } else {
                            show_sound_dialog();
                        }
                    }
                    if ((firstbattle) && (!buttons_visible['win_dialog'])) {
                        if ((firstbattle == 2) && (btype == 87)) {
                            if ((!buttons_visible['win_Mission']) && (!finished) && (showed_hint[2] == 0) && (activeobj > 0) && (inserted)) {
                                fastloadmy('battle.php?reg_loaded=2&pl_id=' + player + '&warid=' + warid + '&rand=' + mathrandom());
                                showed_hint[2] = 1;
                                hide_button('info_on');
                                hide_war_buttons(1);
                                show_button('win_Mission');
                                if (lang == 0) {
                                    document.getElementById('mission_header').innerHTML = 'Р—Р°РґР°РЅРёРµ: Р·Р°С…РІР°С‚РёС‚СЊ С€Р°С…С‚Сѓ';
                                    document.getElementById('win_Mission_txt').innerHTML = 'РўРµРїРµСЂСЊ РІ РІР°С€РµРј СЂР°СЃРїРѕСЂСЏР¶РµРЅРёРё С†РµР»Р°СЏ Р°СЂРјРёСЏ, СЃРѕСЃС‚РѕСЏС‰Р°СЏ РёР· СЂР°Р·Р»РёС‡РЅС‹С… РѕС‚СЂСЏРґРѕРІ. РўРµРєСѓС‰Р°СЏ Р·Р°РґР°С‡Р° - СЂР°Р·РіСЂРѕРјРёС‚СЊ РїРѕРіСЂР°РЅРёС‡РЅРёРєРѕРІ Рё Р·Р°С…РІР°С‚РёС‚СЊ С€Р°С…С‚Сѓ. \n\nР’С‹ РјРѕР¶РµС‚Рµ СЃР°РјРё РЅР°РЅРѕСЃРёС‚СЊ СѓРґР°СЂС‹ РЅР° СЂР°СЃСЃС‚РѕСЏРЅРёРё, Р° С‚Р°Рє Р¶Рµ РґР°РІР°С‚СЊ Р»СЋР±С‹Рµ СѓРєР°Р·Р°РЅРёСЏ СЃРІРѕРёРј РѕС‚СЂСЏРґР°Рј.\nР’Р°С€ СЃРѕСЋР·РЅРёРє-СЌР»СЊС„РёР№РєР° РїРѕРјРѕР¶РµС‚ РїРѕР±РµРґРёС‚СЊ!';
                                }
                                if (lang == 1) {
                                    document.getElementById('mission_header').innerHTML = 'Mission: Break through the security';
                                    document.getElementById('win_Mission_txt').innerHTML = 'You have an army of several different units at your disposal.\n\nCurrent mission - Defeat the Imperial border guards and occupy the sawmill. Your hero can strike them from a safe distance and order the units under your command. Your partner, the she-elf, will help you in your mission.';
                                }
                            }
                        } else
                        if (firstbattle == 2) {
                            if ((!buttons_visible['win_Mission']) && (!finished) && (showed_hint[2] == 0) && (activeobj > 0) && (inserted)) {
                                if (!no_reg_stat) {
                                    fastloadmy('battle.php?reg_anim_finish=1&pl_id=' + player + '&warid=' + warid + '&rand=' + mathrandom());
                                }
                                showed_hint[2] = 1;
                                hide_button('info_on');
                                hide_war_buttons(1);
                                show_button('win_Mission');
                                if (lang == 0) {
                                    document.getElementById('mission_header').innerHTML = 'Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ РІ РјРёСЂ Р“РµСЂРѕРµРІ!';
                                    var txts = 'Р­С‚Рѕ СѓРІР»РµРєР°С‚РµР»СЊРЅР°СЏ РёРіСЂР° СЃ СЂР°Р·РЅРѕРѕР±СЂР°Р·РЅС‹РјРё Р±РѕСЏРјРё, РіРёР»СЊРґРёСЏРјРё, РєРІРµСЃС‚Р°РјРё Рё РєР°РјРїР°РЅРёСЏРјРё. Р’ РЅРµС‘ РјРѕР¶РЅРѕ РёРіСЂР°С‚СЊ РЅР° Р»СЋР±РѕРј СѓСЃС‚СЂРѕР№СЃС‚РІРµ - РєРѕРјРїСЊСЋС‚РµСЂРµ Рё С‚РµР»РµС„РѕРЅРµ.<br><br><b>РџСЂРµРёРјСѓС‰РµСЃС‚РІРѕ РїРµСЂРµРґ РґСЂСѓРіРёРјРё РѕРЅР»Р°Р№РЅ-РёРіСЂР°РјРё:<br>1. Р РµРіСѓР»СЏСЂРЅРѕ РїСЂРѕС…РѕРґСЏС‚ Р±РѕРµРІС‹Рµ РёРІРµРЅС‚С‹;<br>2. РќРµ РЅСѓР¶РЅРѕ Р±С‹С‚СЊ С‚РѕРї-РёРіСЂРѕРєРѕРј РёР»Рё РІС‹СЃРѕРєРёРј СѓСЂРѕРІРЅРµРј, С‡С‚РѕР±С‹ РїРѕРєР°Р·С‹РІР°С‚СЊ РѕС‚Р»РёС‡РЅС‹Рµ СЂРµР·СѓР»СЊС‚Р°С‚С‹ РІ РёРІРµРЅС‚Рµ;<br>3. Р Р°Р·РЅРѕРѕР±СЂР°Р·РЅС‹Р№ РёРіСЂРѕРІРѕР№ РјРёСЂ (Р±РѕРё, РєРІРµСЃС‚С‹, РєР°СЂС‚С‹, СЂСѓР»РµС‚РєР°, СЌРєРѕРЅРѕРјРёРєР° Рё С‚.Рї.)<br>4. РќРµ С‚СЂРµР±СѓРµС‚ СЂРµР°Р»СЊРЅС‹С… РґРµРЅРµРі.</b><br><br>Рђ РїРѕРєР° РІР°Рј РЅРµРѕР±С…РѕРґРёРјРѕ РїРѕРґРѕР№С‚Рё Рё СЂР°Р·РіСЂРѕРјРёС‚СЊ РІСЂР°Р¶РµСЃРєСѓСЋ РЅРµР¶РёС‚СЊ.';
                                    document.getElementById('win_Mission_txt').innerHTML = txts;
                                }
                                if (lang == 1) {
                                    document.getElementById('mission_header').innerHTML = 'Welcome to the world of heroes!';
                                    var txts = 'This is a fascinating game with various battles, guilds, quests and campaigns. You may enjoy it on your phone or computer. Whichever suits you best.<br><br><b>Advantages over other online games:<br>1. Scheduled regular combat events;<br>2. No need to be among the top players to demonstrate great results in event battles;<br>3. Diverse gaming experience (PVP battles, quests, campaigns, card game, economy and many more);<br>4) Free to play. You can be top player without donations!</b><br><br>Will you join now and annihilate this army of the undead?';
                                    document.getElementById('win_Mission_txt').innerHTML = txts;
                                }
                                if (document.getElementById('win_Mission_txt').offsetHeight > document.getElementById('MissionItem_txt').offsetHeight * 1.22) {
                                    document.getElementById('win_Mission_txt').style['font-size'] = '65%';
                                }
                            }
                        } else {
                            if ((initialized) && (showed_hint[1] == 0) && (!inserted)) {
                                showhint(1);
                            } else
                            if ((!buttons_visible['win_Mission']) && (showed_hint[2] == 0) && (activeobj > 0) && (inserted)) {
                                if ((demomode) && (lang == 0)) {
                                    document.getElementById('mission_header').innerHTML = 'РџСЂРѕР±РЅС‹Р№ Р±РѕР№';
                                    texts[2] = 'Р’С‹ РЅР°С…РѕРґРёС‚РµСЃСЊ РІ РЅРѕРІРѕР№ РёРіСЂРµ Р“РµСЂРѕРё Р’РѕР№РЅС‹ Рё Р”РµРЅРµРі. Р­С‚Рѕ С‚Р°РєС‚РёС‡РµСЃРєР°СЏ СЃС‚СЂР°С‚РµРіРёСЏ СЃ СЌР»РµРјРµРЅС‚Р°РјРё RPG Рё СЌРєРѕРЅРѕРјРёРєРё. Р—РґРµСЃСЊ РІС‹ СЃРјРѕР¶РµС‚Рµ СЂРµР°Р»РёР·РѕРІР°С‚СЊ РІСЃРµ СЃРІРѕРё СЃРїРѕСЃРѕР±РЅРѕСЃС‚Рё, РїРѕСЃС‚РѕСЏРЅРЅРѕ СЂР°Р·РІРёРІР°СЏСЃСЊ Рё СѓР»СѓС‡С€Р°СЏ СЃРІРѕРё РЅР°РІС‹РєРё. Р РµРіСѓР»СЏСЂРЅС‹Рµ РѕР±РЅРѕРІР»РµРЅРёСЏ СЃРѕС…СЂР°РЅСЏС‚ РІР°С€ РёРЅС‚РµСЂРµСЃ Рє РёРіСЂРµ РЅР°РґРѕР»РіРѕ.\n\nРџРѕР±РµРґРё РІ Р±РѕСЋ Рё РЅР°С‡РёРЅР°Р№ РёРіСЂР°С‚СЊ!';
                                }
                                if ((demomode) && (lang == 1)) {
                                    document.getElementById('mission_header').innerHTML = 'Demo combat';
                                    texts[2] = 'You have embarked on a new journey with this game - Lords of War and Money. This is a tactical strategy game with RPG elements and a world with well-developed self-sustaining economy. Here, you can realize all your fantasies, constantly developing and improving your skills. Regular updates will keep you interested forever. Wait no longer and into battle!';
                                }
                                showhint(2);
                            } else
                            if ((!buttons_visible['win_Mission']) && (demomode != 1) && (showed_hint[3] == 0) && (showed_hint[2] == 1) && (activeobj > 0) && (inserted)) {
                                showhint(3);
                            } else
                            if ((!buttons_visible['win_Mission']) && (demomode != 1) && (showed_hint[4] == 0) && (showed_hint[3] == 1) && (activeobj > 0) && (inserted) &&
                                (this.obj[activeobj].hero != 1) && (this.obj[activeobj].shooter != 1)) {
                                showhint(4);
                            } else
                            if ((!buttons_visible['win_Mission']) && (showed_hint[5] == 0) && ((showed_hint[3] == 1) || (demomode)) && (activeobj > 0) && (inserted) &&
                                (this.obj[activeobj].hero == 1)) {
                                showhint(5);
                            } else
                            if ((!buttons_visible['win_Mission']) && (showed_hint[6] == 0) && ((showed_hint[3] == 1) || (demomode)) && (activeobj > 0) && (inserted) &&
                                (this.obj[activeobj].hero != 1) && (this.obj[activeobj].shooter == 1)) {
                                showhint(6);
                            }
                        }
                    }
                    if (gpause) {
                        return 0;
                    }
                    if (someactive) {
                        ok = false;
                        for (i = 1; i <= magicscount; i++) {
                            if ((((magics[i].doing != '') && (magics[i].doing != undefined)) || ((magics[i].cmd != '') && (magics[i].cmd != undefined))) && (magics[i] != undefined)) {
                                ok = true;
                                break;
                            }
                        }
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((this.obj[i].active) || ((this.obj[i].doing != "") && (this.obj[i].doing != undefined)) || (this.obj[i].donow2 == 1)) {
                                if (this.obj[i].bomb) continue;
                                ok = true;
                                break;
                            }
                        }
                        someactive = ok;
                    }
                    if (!someactive) {
                        this['nowhit'] = -1;
                    }
                    if (command != '') {
                        k = tointeger(command.substr(1, 3));
                        current = k;
                        cmd = command.substr(0, 1);
                        if ((cmd == 'S') && (!someactive)) {
                            tmp = command.substr(1, 18);
                            curAbil = tmp;
                        }
                    }
                    let command_copy = command;
                    if ((command_copy.indexOf("psc") != -1) && (!someactive)) {
                        let phmCommand = command_copy.substr(command_copy.indexOf("psc"), 18);
                        let a = tointeger(phmCommand.substr(3, 3));
                        let d = tointeger(phmCommand.substr(6, 3));
                        psc[d] = a;
                    }
                    if ((command_copy.indexOf("psa") != -1) && (!someactive)) {
                        let phmCommand = command_copy.substr(command_copy.indexOf("psa"), 18);
                        let a = tointeger(phmCommand.substr(3, 3));
                        let d = tointeger(phmCommand.substr(6, 3));
                        psa[d] = a;
                    }
                    if ((command_copy.indexOf("Sphm") != -1) && (!someactive)) {
                        let phmCommand = command_copy.substr(command_copy.indexOf("Sphm"), 18);
                        let source = Number(phmCommand.substr(12, 3));
                        let phantom = Number(phmCommand.substr(7, 3));
                        if (phm[phantom] === undefined) {
                            phm[phantom] = source;
                        }
                    }
                    while ((command_copy.substr(0, 1) == "S") && (!someactive)) {
                        if (command_copy.substr(1, 3) == "lzb") {
                            stage.pole.incrementParam(Number(command_copy.substr(4, 3)), "hitcount", -1);
                        }
                        command_copy = command_copy.substr(19);
                    }
                    
                    for (i in this.obj) {
                        if ((this.obj[phm[i]] !== undefined) && (this.obj[i].data_string !== undefined) && (this.obj[i].data_string.indexOf("phm100000000001") != -1) && (this.obj[i]["phm"] === undefined)) {
                            this.obj[i]["luckcount"] = this.obj[phm[i]]["luckcount"] === undefined ? 0 : this.obj[phm[i]]["luckcount"];
                            this.obj[i]["hitcount"] = this.obj[phm[i]]["hitcount"] === undefined ? 0 : this.obj[phm[i]]["hitcount"];
                            this.obj[i]["turnCount"] = this.obj[phm[i]]["turnCount"] === undefined ? 0 : this.obj[phm[i]]["turnCount"];
                            this.obj[i]["moraleCount"] = this.obj[phm[i]]["moraleCount"] === undefined ? 0 : this.obj[phm[i]]["moraleCount"];
                            this.obj[i]["phm"] = 1;
                        }
                        // if ((this.obj[gate[i]] !== undefined) && (magic[i]) && (magic[i]['sum']) && (magic[i]['sum']['effect'] == 2) && (this.obj[i]["gate"] === undefined)) {
                            // this.obj[i]["luckcount"] = this.obj[gate[i]]["luckcount"] === undefined ? 0 : this.obj[gate[i]]["luckcount"];
                            // this.obj[i]["hitcount"] = this.obj[gate[i]]["hitcount"] === undefined ? 0 : this.obj[gate[i]]["hitcount"];
                            // this.obj[i]["gate"] = 1;
                        // }
                    }
                    this.calcComs_new();
                    this.calcComs();
                    if ((srcafterload != undefined) && (srcafterload != '')) {
                        srcafterload = '';
                    }
                }
                stage.pole.addself = window.addself = function(i, mname, init, eff, caster) {
                    if ((mname == "lcr") || (mname == "wof")) {
                        let cre = stage.pole.obj[i];
                        cre['hitcount'] = 0;
                        cre['luckcount'] = 0;
                    }
                    if ((mname == "mrl")) {
                        stage.pole.clearPar(i, 'morale');
                        if ((stage.pole.obj[i]["checkMrl"] === undefined)||(stage.pole.obj[i]["checkMrl"] == 0)) {
                            stage.pole.obj[i]["checkMrl"] = 1;
                        }
                    }
                    if ((mname == "usd")&&(stage.pole.obj[i].id != 579)) { //djinn_vizier ?
                        console.log("1");
                        stage.pole.incrementParam(i, "turnCount", -1);
                    }
                    var s = '',
                        mn = '',
                        meffect = '';
                    if (!magic[i]) return false;
                    if (magic[i][mname]) {
                        if (mname != 'brf') {
                            stage[war_scr].dispelmagic(i, mname, magic[i][mname]['effect']);
                        }
                    }
                    magic[i][mname] = Array();
                    magic[i][mname]['nowinit'] = init;
                    magic[i][mname]['effect'] = eff;
                    if (caster) {
                        magic[i][mname]['caster'] = caster;
                    }
                    if (init <= 0) {
                        magic[i][mname] = 0;
                    }
                    stage[war_scr].convertfromselfmagic(i, 1);
                }
                stage.pole.showmagicinfo = window.showmagicinfo = function(i, t = 0) {
                    var k = 0,
                        bit = 0;
                    mcount = -1
                    mname = [], minit = [], meffect = [], mcast = [], mdo = [], mtype = [], mperc = [], out = '';
                    var showeff = 1;
                    mcount = -1;
                    var tmp = i;
                    convertfromselfmagic2(i);
                    var len = this.obj_array.length;
                    if (!this.obj[i].hero)
                        for (var k1 = 0; k1 < len; k1++) {
                            k = this.obj_array[k1];
                            if ((this.obj[k].owner == this.obj[i].owner) && (this.obj[k].hero)) {
                                i = k;
                                convertfromselfmagic2(i);
                                break;
                            }
                        }
                    var plus = '',
                        color = 0;
                    var dat = '<table>';
                    i = tmp;
                    var enter = false;
                    if (!enter) {
                        if (lang == 0) {
                            dat += '<tr><td>Тип</td><td width=10></td><td>Эффект</td><td width=10></td><td>Время</td></tr>';
                        }
                        if (lang == 1) {
                            dat += '<tr><td>Type</td><td width=10></td><td>Effect</td><td width=10></td><td>Time</td></tr>';
                        }
                    }
                    if (this.obj[tmp].hero) {
                        make_perks_html(this.obj[i].owner, stage[war_scr].subpath);
                    } else {
                        if (document.getElementById('hero_info_perks')) {
                            document.getElementById('hero_info_perks').innerHTML = '';
                            document.getElementById('hero_info_perks').style.display = 'none';
                        }
                    }
                    combat_was_vrag = Array();
                    for (k = 0; k <= mcount; k++) {
                        this.detectmagic(mname[k], k, tmp);
                        if ((minit[k] == 100000) && (t == 1)) {
                            continue;
                        }
                        if ((minit[k] > 0) && (mdo[k] != '') && ((meffect[k] > 0) || (meffect[k] == ' ') || (mname[k] == 'hyp'))) {
                            enter = true;
                            plus = '';
                            if (mtype[k] == 0) {
                                color = '#0105b4';
                            }
                            if (mtype[k] == -1) {
                                color = (t ? '#ef312c' : "#b40501");
                            }
                            if (mtype[k] == 1) {
                                color = (t ? '#649615' : "#3f5b13");
                            }
                            if (mtype[k] == 1) {
                                plus = '+';
                            }
                            if ((mtype[k] == -1) && (mname[k] != 'mmn')) {
                                plus = '-';
                            }
                            if (mname[k] == "frd") {
                                mcast[k] = lang ? "Defense" : "Защита";
                            }
                            dat += '<tr style="color: ' + color + ';"><td>' + mcast[k] + '</td><td></td>';
                            dat += '<td>';
                            if (mtype[k] == 0) {} else {
                                if (meffect[k] == ' ') {
                                    meffect[k] = '';
                                    plus = '';
                                    mperc[k] = '';
                                }
                                let d = t;
                                if (mname[k] == "wof") {
                                    d = 0;
                                }
                                dat += (d != 1 ? mdo[k] : "") + '&nbsp;' + plus + meffect[k] + mperc[k];
                            }
                            dat += '</td><td> </td>';
                            if (minit[k] == 100000) {
                                dat += '<td>-</td></tr>';
                            } else {
                                dat += '<td>' + (minit[k] / 100).toFixed(2) + '</td></tr>';
                            }
                        }
                    }
                    if (!enter) {
                        if (lang == 0) {
                            dat = '<tr><td>Эффекты отсутствуют</td></tr>';
                        }
                        if (lang == 1) {
                            dat = '<tr><td>No effects</td></tr>';
                        }
                    }
                    dat += '</table>';
                    document.getElementById('effects_list').innerHTML = dat;
                    document.getElementById('effects_info_head').innerHTML = this.get_name_html(i);
                    return dat;
                }
                stage.pole.calcdivinev = window.calcdivinev = function(i, xr, yr) {
                    Totalmagicdamage = 0;
                    Totalmagickills = 0;
                    var ok = false;
                    var xx = 0,
                        yy = 0,
                        xp = 0,
                        yp = 0;
                    mul = 1;
                    var len = this.obj_array.length;
                    for (var k1 = 0; k1 < len; k1++) {
                        var j = this.obj_array[k1];
                        this.obj[j]['attacked'] = 1;
                        this.obj[j]['attacked2'] = 1;
                    }
                    var separhsum = (this.obj[mapobj[xr + yr * defxn]].separhsum ?? 0);
                    var eff = (this.obj[i]['divineveffmain'] + Math.round(this.obj[i]['divineveffmult']*Math.pow(this.obj[i]['nownumber'], 0.7))) * Math.sqrt(separhsum);
                    this.attackmagic(i, mapobj[xr + yr * defxn], eff, 'other', 'divinev', 0, 0, 0);
                    showuron(1);
                }
                stage.pole.calcflamestrike = window.calcflamestrike = function(i, xr, yr, magicuse, koef) {
                    Totalmagicdamage = 0;
                    Totalmagickills = 0;
                    var ok = false;
                    var xx = 0,
                        yy = 0,
                        xp = 0,
                        yp = 0;
                    mul = 1;
                    var len = this.obj_array.length;
                    for (var k1 = 0; k1 < len; k1++) {
                        var j = this.obj_array[k1];
                        this.obj[j]['attacked'] = 1;
                        this.obj[j]['attacked2'] = 1;
                    }
                    var herd = 0;
                    var hera = 0;
                    for (var k1 = 0; k1 < len; k1++) {
                        k = this.obj_array[k1];
                        if ((this.obj[k].hero) && (this.obj[k].owner == this.obj[mapobj[xr + yr * defxn]].owner)) herd = k;
                        if ((this.obj[k].hero) && (this.obj[k].owner == this.obj[i].owner)) hera = k;
                    }
                    let b = 0;
                    if ((magic[hera]) && (magic[hera]['mle'])) {
                        b = magic[hera]['mle']['effect'];
                        magic[hera]['mle']['effect'] = 0;
                    }
                    if ((magic[herd]) && (magic[herd]['msk'])) {
                        if (magic[herd]['mld']) {
                            let b = magic[herd]['mld']['effect'];
                            magic[herd]['mld']['effect'] = magic[herd]['msk']['effect'];
                            this.attackmonster(i, xr, yr, xr, yr, mapobj[xr + yr * defxn], 0, koef);
                            magic[herd]['mld']['effect'] = b;
                        } else {
                            magic[herd]['mld'] = [];
                            magic[herd]['mld']['effect'] = magic[herd]['msk']['effect'];
                            this.attackmonster(i, xr, yr, xr, yr, mapobj[xr + yr * defxn], 0, koef);
                            delete magic[herd]['mld'];
                        }
                    } else {
                        this.attackmonster(i, xr, yr, xr, yr, mapobj[xr + yr * defxn], 0, koef);
                    }
                    if (b != 0) {
                        magic[hera]['mle']['effect'] = b;
                    }
                    showuron();
                }
                stage.pole.walk = window.walk = function(x, y) {
                    loadmy('battle.php?warid=' + warid + '&move=1&pl_id=' + player + '&my_monster=' + activeobj + '&x=' + x + '&y=' + y + '&lastturn=' + lastturn + '&lastmess=' + lastmess + '&lastmess2=' + lastmess2 + '&rand=' + mathrandom())
                }
                stage.pole.calcchainlighting = window.calcchainlighting = function(i, xr, yr, magicuse) {
                    Totalmagicdamage = 0;
                    Totalmagickills = 0;
                    var ok = false;
                    var xx = 0,
                        yy = 0,
                        xp = 0,
                        yp = 0;
                    mul = 1;
                    if (magicpower == true) mul = 1.5;
                    var len = this.obj_array.length;
                    for (var k1 = 0; k1 < len; k1++) {
                        var j = this.obj_array[k1];
                        this.obj[j]['attacked'] = 1;
                        this.obj[j]['attacked2'] = 1;
                    }
                    var xx = 0,
                        yy = 0,
                        xp = 0,
                        yp = 0;
                    if (magicuse == 'chainlighting') {
                        var lasto = mapobj[xr + yr * defxn];
                        var j = lasto;
                        this.obj[j]['attacked2'] = 0;
                        var eff = this.obj[activeobj][magicuse + '_magiceff'];
                        if (this.obj[activeobj]['spmult'] > 1) {
                            eff = Math.round(this.obj[activeobj]['spmult'] * (this.obj[activeobj]['chainlightingeffmain'] + this.obj[activeobj]['chainlightingeffmult'] * Math.pow(this.obj[activeobj]['nownumber'], 0.7)));
                        }
                        this.attackmagic(i, mapobj[xr + yr * defxn], Math.round(eff * mul), 'air', 'lighting', 0, 0, 0);
                        let b = this.obj[j]['nownumber'];
                        this.obj[j]['nownumber'] = this.obj[j]['nownumber'] + "\n#" + (1);
                        this.obj[j].set_number();
                        this.obj[j]['nownumber'] = b;
                        let bDamage = Totalmagicdamage;
                        targetMagicdamage = Totalmagicdamage;
                        let totalh = (this.obj[j]['nownumber'] - 1) * this.obj[j]['maxhealth'] + this.obj[j]['nowhealth'];
                        targetMagickills = Math.floor(Math.min(targetMagicdamage, totalh) / this.obj[j]['maxhealth']);
                        let nowhealth = this.obj[j]['nowhealth'] - (Math.min(targetMagicdamage, totalh) - targetMagickills * this.obj[j]['maxhealth']);
                        if (nowhealth <= 0) targetMagickills++;
                        this.obj[j]['nownumber'] = b;
                        var penalty = Array(1, 0.5, 0.25, 0.125);
                        let ambiguity = [];
                        let f = true;
                        for (var zz = 1; zz <= 3; zz++) {
                            this.obj[lasto]['attacked'] = 0;
                            br = 0;
                            bj = 0;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                j = this.obj_array[k1];
                                rr = (this.obj[lasto]['x'] - this.obj[j]['x']) * (this.obj[lasto]['x'] - this.obj[j]['x']) +
                                    (this.obj[lasto]['y'] - this.obj[j]['y']) * (this.obj[lasto]['y'] - this.obj[j]['y']);
                                if (((rr <= br) || (br == 0)) && (this.obj[j]['nownumber'] > 0) && (this.obj[j]['x'] < 20) && (!this.obj[j]['hero']) && (!this.obj[j]['stone']) && (this.obj[j]['y'] >= 0) && (!this.obj[j]['rock']) && (this.obj[j]['attacked2'] == 1)) {							
                                    if (rr == br) {
                                        ambiguity.push(j);
                                    } else {
                                        ambiguity = [j];
                                    }							
                                    br = rr;
                                    bj = j;
                                }
                            }
                            if (zz == 1) {
                                console.log(ambiguity);
                                console.log(br);
                            }
                            if (bj > 0) {
                                lasto = bj;
                                x1 = this.obj[bj]['x'];
                                y1 = this.obj[bj]['y'];
                                j = bj;
                                this.obj[j]['attacked2'] = 0;
                                this.attackmagic(i, j, Math.floor(Math.round(eff * mul) * penalty[zz]), 'air', 'lighting', 0, 0, 0);				
                                let b = this.obj[j]['nownumber'];
                                bDamage = Totalmagicdamage;
                                if (!f) {
                                    continue;
                                }
                                if (ambiguity.length > 1) {
                                    f = false;
                                    for (let i in ambiguity) {
                                        let b1 = this.obj[ambiguity[i]]['nownumber'];
                                        this.obj[ambiguity[i]]['nownumber'] = this.obj[ambiguity[i]]['nownumber'] + "\n#" + (zz + 1) + " ???";
                                        this.obj[ambiguity[i]].set_number();
                                        this.obj[ambiguity[i]]['nownumber'] = b1;
                                        setshadAbs(this.obj[ambiguity[i]]['x'], this.obj[ambiguity[i]]['y'], 1);
                                        this.obj[ambiguity[i]]["needSetNumber"] = 1;
                                    }
                                } else {
                                    this.obj[j]['nownumber'] = this.obj[j]['nownumber'] + "\n#" + (zz + 1);
                                    setshadAbs(x1, y1, 1);
                                    this.obj[j].set_number();
                                    this.obj[j]['nownumber'] = b;
                                }
                            }
                        }
                        ok = true;
                    }
                    if ((ok) && (magicuse != '') && ((magicuse == 'circle_of_winter') || (magicuse == 'icebolt')) && (((this.obj[activeobj]['hero']) && (isperk(activeobj, 99))) || (this.obj[activeobj]['master_of_ice']))) {
                        this.showatb();
                    }
                    if ((ok) && (magicuse != '') && (this.obj[activeobj][magicuse + 'elem'] == 'air') && (((this.obj[activeobj]['hero']) && (isperk(activeobj, 100))) || (this.obj[activeobj]['master_of_storms']))) {
                        this.showatb();
                    }
                    if (ok) showuron(1);
                }
                window.setshadAbs = function(x, y, vis) {
                    if (!initialized) return 0;
                    if (shado[y * defxn + x]) {
                        set_visible(shado[y * defxn + x], vis);
                    }	
                }		
                window.oneskill_button_release_test = function() {
                    if ((is_visible_element('magic_book')) || (buttons_visible['scroll_runes'])) {
                        return 0;
                    }
                    if ((someactive) || (!inserted)) {
                        return 0;
                    }
                    if ((activeobj == 0)) {
                        return 0;
                    }
                    if ((activeobj > 0)&&(stage.pole.obj[activeobj]['dash'])&&((magic[activeobj]['dsh'] === "undefined")||(magic[activeobj]['dsh'] === 0))) {	
                        stage.pole.obj[activeobj].maxinit *= 2;
                        stage[war_scr].showatb(activeobj, 100);
                        stage.pole.obj[activeobj].maxinit /= 2;
                    }
                }
                stage.pole.calcComs_new = function() {
                    command_new = command;
                    var b = 0,
                        i = 0,
                        j = 0,
                        x = 0,
                        y = 0,
                        k = 0,
                        ok = false,
                        time = 0,
                        ii = false;
                    var cmd = '';
                    if ((Date.now() < waittimer) && (!finished)) return 0;
                    if (!initialized) return 0;
                    if (someactive) {
                        ok = false;
                        for (i = 1; i <= magicscount; i++) {
                            if ((((magics[i].doing != '') && (magics[i].doing != undefined)) || ((magics[i].cmd != '') && (magics[i].cmd != undefined))) && (magics[i] != undefined)) {
                                ok = true;
                                break;
                            }
                        }
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            i = this.obj_array[k1];
                            if ((this.obj[i].active) || ((this.obj[i].doing != "") && (this.obj[i].doing != undefined)) || (this.obj[i].donow2 == 1)) {
                                if (this.obj[i].donow2 == 1) {
                                    this.obj[i].donow2c++;
                                    if ((this.obj[i].donow2 == 1) && (this.obj[i].donow2c > 30)) {
                                        this.obj[i].x = Math.round(this.obj[i].destxx);
                                        this.obj[i].y = Math.round(this.obj[i].destyy);
                                        this.obj[i].donow2 = 0;
                                        this.obj[i].donow2c = 0;
                                        this.obj[i].set_pole_pos(this.obj[i].x, this.obj[i].y);
                                    }
                                }
                                if (this.obj[i].bomb) continue;
                                ok = true;
                                break;
                            }
                        }
                        someactive = ok;
                    }
                    if (command_new == '') return 0;
                    k = tointeger(command_new.substr(1, 3));
                    current = k;
                    cmd = command_new.substr(0, 1);	
                    if (loading) return 0;
                    while ((cmd == 'S') && ((command_new.substr(1, 3) == 'at3') || (command_new.substr(1, 4) == 'dsp-') || (command_new.substr(1, 4) == 'ds2-') || (((lastmagic == 'rag') || (lastmagic == 'ral') || (lastmagic == 'raa') || (lastmagic == 'ra2')) && ((command_new.substr(1, 3) == prelastmagic) && (prelastmagic != 'rgl'))) || (command_new.substr(1, 3) == 'sld') || (command_new.substr(1, 3) == 'aci') || (command_new.substr(1, 3) == 'prt') || (command_new.substr(1, 3) == 'scd') || (command_new.substr(1, 3) == 'rnm') || (command_new.substr(1, 3) == 'spc') || (command_new.substr(1, 3) == 'wnd') || (command_new.substr(1, 3) == 'bsh') || (command_new.substr(1, 3) == 'net') || (command_new.substr(1, 3) == 'rn4') || (command_new.substr(1, 3) == 'enr') || (command_new.substr(1, 3) == 'ass') || (command_new.substr(1, 3) == 'btt') || (command_new.substr(1, 3) == 'aim') || (command_new.substr(1, 3) == 'mfc') || (command_new.substr(1, 3) == 'zat') || (command_new.substr(1, 3) == 'prp') || (command_new.substr(1, 3) == 'eye') || (command_new.substr(1, 3) == 'raa') || (command_new.substr(1, 3) == 'fbd') || (command_new.substr(1, 3) == 'wfr') || (command_new.substr(1, 3) == 'rag') || (command_new.substr(1, 3) == 'ral') || (command_new.substr(1, 3) == 'ra2') || (command_new.substr(1, 3) == 'mga') || (command_new.substr(1, 3) == 'enc') || (command_new.substr(1, 3) == 'rg2') || (command_new.substr(1, 3) == 'mof') || (command_new.substr(1, 3) == 'blt') || (command_new.substr(1, 3) == 'ent') || (command_new.substr(1, 3) == 'nmc') || (command_new.substr(1, 3) == 'hfr') || (command_new.substr(1, 3) == 'tob') || (command_new.substr(1, 3) == 'cha') || (command_new.substr(1, 3) == 'frz') || (command_new.substr(1, 3) == 'wfr') || (command_new.substr(1, 3) == 'blb') || (command_new.substr(1, 3) == 'msl') || (command_new.substr(1, 3) == 'slm') || (command_new.substr(1, 3) == 'hsa') || (command_new.substr(1, 3) == 'mlg') || (command_new.substr(1, 3) == 'mvd') || (command_new.substr(1, 3) == 'spi') || (command_new.substr(1, 3) == 'mnl') || (command_new.substr(1, 3) == 'eod') || (command_new.substr(1, 3) == 'fod') || (command_new.substr(1, 3) == 'fo2') || (command_new.substr(1, 3) == 'wss') || (command_new.substr(1, 3) == 'dtd') || (command_new.substr(1, 3) == 'inv') || (command_new.substr(1, 3) == 'irr') || (command_new.substr(1, 3) == 'btr') || (command_new.substr(1, 3) == 'flw') || (command_new.substr(1, 3) == 'brf') || (command_new.substr(1, 3) == 'chm') || (command_new.substr(1, 3) == 'ard') || (command_new.substr(1, 3) == 'rn9') || (command_new.substr(1, 3) == 'def') || (command_new.substr(1, 3) == 'dat') || (command_new.substr(1, 3) == 'mrb') || (command_new.substr(1, 3) == 'abs') || (command_new.substr(1, 3) == 'cut') || (command_new.substr(1, 3) == 'add') || ((lastmagic != 'rgl') && ((lastmagic == command_new.substr(1, 3) || ((lastmagic.substr(0, 2) == 'ds') && (command_new.substr(1, 2) == 'ds')))) && ((lastcaster == command_new.substr(4, 3)) && (command_new.substr(1, 3) != 'pss') && (command_new.substr(1, 3) != 'paa'))))) {
                        var obj_id = tointeger(command_new.substr(4, 3));
                        if (command_new.substr(1, 3) == "def") {
                            console.log("2");
                            this.incrementParam(obj_id, "turnCount", -1);
                        }
                        command_new = command_new.substr(19);
                        cmd = command_new.substr(0, 1);
                        k = tointeger(command_new.substr(1, 3));
                        current = k;
                    }
                    
                    if (((!someactive) || (cmd == 'P')) && ((!spellactive) || (flamewave_active)) && (command_new.length > 1) && (loadcommand == '') && ((!loading) || (cmd == 'P')) && (initialized) && (waitingcounter > 10)) {			
                        if (cmd == 'S') {
                            if ((command_new.substr(1, 3) == "sac") && (tointeger(command_new.substr(13, 1)) == 1)) {
                                let objId = tointeger(command_new.substr(4, 3));
                                if ((stage.pole.obj[objId]["checkTurn"] === undefined)||(stage.pole.obj[objId]["checkTurn"] == 0)) {
                                    //stage.pole.obj[objId]["checkTurn"] = 1;
                                }
                            }
                        }
                        
                        if (cmd == 'r') {
                            if (lastRaidsCount != stage.pole.obj[current]['nownumber']) {
                                raidsCurrentWave++;
                                stage.pole.showmitnv(1);
                                lastRaidsCount = stage.pole.obj[current]['nownumber'];
                            }
                        }
                        if (cmd == 'w') {
                            this.incrementParam(current, "turnCount", -1);
                        }
                        if ((cmd == 'u')&&(!stage.pole.obj[current]['endurance'])) {		
                            let u = new Date(Date.now());
                            let time = u.getHours() + ":" + ("0" + u.getMinutes()).substr(-2) + ":" + ("0" + u.getSeconds()).substr(-2);				
                            let new_content = "[" + time + "] Скорость мобов +1";
                            let chat_id = classic_chat ? "chat_classic_inside" : "chat_inside";
                            if (addSpeedLastTurn != nowturn) {
                                add_newtext(chat_id, new_content);	
                                addSpeedLastTurn = nowturn;
                            }							
                        }
                        if (command_new.substr(0, 4) == 'Sini') {		
                            let u = new Date(Date.now());
                            let time = u.getHours() + ":" + ("0" + u.getMinutes()).substr(-2) + ":" + ("0" + u.getSeconds()).substr(-2);				
                            let new_content = "[" + time + "] Иня мобов +1";
                            let chat_id = classic_chat ? "chat_classic_inside" : "chat_inside";
                            if (addIniLastTurn != nowturn) {
                                add_newtext(chat_id, new_content);	
                                addIniLastTurn = nowturn;
                            }							
                        }
                        if (cmd == 'i') {
                            j = tointeger(command_new.substr(4, 4));
                            if ((current != -1) && (current > 0)) {
                                if ((this.obj[current].nowinit <= 0)&&(this.obj[current].nowinit + j > 0)) {
                                    if ((magic[current])&&(magic[current]['hyp'])&&(magic[current]['hyp']['nowinit'] > 0)) {
                                        return 0;
                                    }
                                    this.incrementParam(current, "turnCount");
                                }
                            }		
                        }
                        if ((cmd == 's') && (!someactive) && (!loading)) { //gating
                            if (this.obj[current].x >= 100) {
                                //gate[current] = activeobj;
                                this.incrementParam(activeobj, "turnCount", -1);	
                            } else {
                                k = tointeger(command_new.substr(8, 5));
                                if ((this.obj[current].id != 347) && (this.obj[current].id != 349) && (!this.obj[current].bonus)) {
                                    if (k == 0) {
                                        this.incrementParam(activeobj, "turnCount", -1);
                                        return 0;
                                    }
                                    this.incrementParam(current, "turnCount", -1);
                                }
                            }
                        }
                    }
                }
                stage.pole.incrementParam = function(i, name, value = 1) {
                    let cre = this.obj[i];
                    if (cre === undefined) {
                        return 0;
                    }
                    if (cre[name] === undefined) {
                        cre[name] = 0;
                    }
                    cre[name] += value;
                }
                stage.pole.setParam = function(i, name, value = 0) {
                    let cre = this.obj[i];
                    if (cre === undefined) {
                        return 0;
                    }
                    cre[name] = value;
                }
                stage.pole.atb_scale = function(anyway) {
                    document.getElementById("effectsDisplay").style.display = (chatMode() == "V" ? "none" : "");
                    cur_scaling = 1;
                    atby = Math.round(scr_top + pole_top_now + pole_height + (atb_top) * this.scaling);
                    atbx = Math.round((stage_width - scr_left - scr_right) / 2 + scr_left - atb_width * atb_scaling * atb_count / 2 * this.scaling);
                    if (!this.setted_atb) return 0;
                    if (!this.showed_atb) return 0;
                    this.atbg.x1 = (Math.floor(atbx));
                    this.atbg.y1 = (Math.floor(atby));
                    var sc = atb_cnt;
                    if (!inserted) {
                        sc = stackcount - 1;
                        atb_n_x = atbx + ((atb_count - stackcount) * atb_width * atb_scaling / 2) * cur_scaling * this.scaling;
                        this.atbg.x1 = (Math.floor(atb_n_x));
                    }
                    set_scaleX(this.atbg2, this.scaling);
                    set_scaleY(this.atbg2, this.scaling);
                    set_X(this.atbg, Math.floor(this.atbg.x1));
                    set_Y(this.atbg, Math.floor(this.atbg.y1));
                    var k = cur_scaling * 90;
                    if (k < 20) {
                        k = 20;
                    }
                    if (atbsd > 0) {
                        set_fontSize(this.ochered, k * atb_scaling);
                        set_strokeThickness(this.ochered, k / atb_font_size * atb_stroke_width * atb_scaling);
                        set_X(this.ochered, Math.floor(10 * cur_scaling * atb_scaling) + Math.round(atb_scroll_x * cur_scaling));			
                        set_Y(this.ochered, Math.round(1 * cur_scaling));
                    }
                    let flag = true;
                    let dop = 40;
                    for (var j = 0; j <= atb_count; j++) {
                        i = this.p_array[j];
                        if (j > sc) {
                            set_visible(this.ntext[j], 0);
                            set_visible(this.portraits[j], 0);
                            continue;
                        } else {
                            set_visible(this.portraits[j], 1);
                        }
                        if (this.ntext[i]) {
                            var ntext_vis = get_visible(this.ntext[i]);
                            if (ntext_vis) {
                                var k = cur_scaling * 50 * atb_scaling;
                                if (k < 14) {
                                    k = 14;
                                }
                                set_fontSize(this.ntext[i], k);
                                while ((get_width(this.ntext[i]) > (atb_width * atb_scaling - 16) * cur_scaling) && (k > 5)) {
                                    k--;
                                    set_fontSize(this.ntext[i], k);
                                }
                                set_strokeThickness(this.ntext[i], k / atb_font_size * atb_stroke_width);
                                if ((this.ntext[i].need_cache) || (anyway)) {
                                    this.ntext[i].need_cache = 0;
                                }
                                set_X(this.ntext[i], Math.round(atb_width * atb_scaling * (j + 1) * cur_scaling - get_width(this.ntext[i]) - 8 * cur_scaling * atb_scaling));
                                set_Y(this.ntext[i], Math.round(atb_height * atb_scaling * cur_scaling - get_height(this.ntext[i]) * 0.98));
                                if (flag === true) {
                                    flag = false;
                                    //dop = Math.round(atb_width * atb_scaling * cur_scaling - get_width(this.ntext[i]) - 8 * cur_scaling * atb_scaling)/2;	
                                }
                            }
                        }
                        if (!this.portraits[i]) {
                            continue;
                        }
                        set_X(this.portraits[i], Math.round(j * atb_width * atb_scaling * cur_scaling ));
                        set_visible(this.portraits[i], 1);
                        if (this.portraits[i].img.show_it) set_visible(this.portraits[i].img, 1);
                    }
                    document.getElementById("dop-info").style.top = (this.atbg.y1*(1/MainPixelRatio)) + "px";
                    document.getElementById("dop-info").style.width = stage.pole.atbg.x1*(1/MainPixelRatio) + "px"
                    document.getElementById("dop-info").style.fontSize = Math.round(atb_scaling*atb_height*stage.pole.scaling*(1/MainPixelRatio)/3 + 1) + "px";
                    document.getElementById("dop-info").style.left = "0px";					
                    re_cache_atb();
                }
                stage.pole.getMoraleN = function(i) {
                    if (!this.obj[i].hasOwnProperty('nametxt')) return 0;
                    var festering = false;
                    var deathstare = false;
                    let mimmune = false;
                    if (inserted) {
                        mimmune = false;
                        if ((magic[i]) && (magic[i]['wfr']) && (magic[i]['wfr']['effect'] == 1)) mimmune = true;
                        if (this.obj[i]['twistedmind'] == 1) mimmune = true;
                        var k = 0;
                        var x = 0,
                            y = 0,
                            b = 0,
                            x2 = 0,
                            y2 = 0,
                            b2 = 0;
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            k = this.obj_array[k1];
                            if ((this.obj[k].festeringaura) && (!this.obj[i].undead) && (this.obj[k].nownumber > 0) && (this.obj[i].side != this.obj[k].side)) {
                                var bigx = this.obj[i]['big'];
                                var bigy = this.obj[i]['big'];
                                if (this.obj[i]['bigx']) bigx = 1;
                                if (this.obj[i]['bigy']) bigy = 1;
                                var bigkx = this.obj[k]['big'];
                                var bigky = this.obj[k]['big'];
                                if (this.obj[k]['bigx']) bigkx = 1;
                                if (this.obj[k]['bigy']) bigky = 1;
                                for (x = this.obj[i].x; x <= this.obj[i].x + bigx; x++) {
                                    for (y = this.obj[i].y; y <= this.obj[i].y + bigy; y++) {
                                        for (x2 = this.obj[k].x; x2 <= this.obj[k].x + bigkx; x2++) {
                                            for (y2 = this.obj[k].y; y2 <= this.obj[k].y + bigky; y2++) {
                                                if ((Math.abs(x - x2) <= 1) && (Math.abs(y - y2) <= 1)) {
                                                    festering = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }	
                    if (inserted) {
                        mimmune = false;
                        if ((magic[i]) && (magic[i]['wfr']) && (magic[i]['wfr']['effect'] == 1)) mimmune = true;
                        if (this.obj[i]['twistedmind'] == 1) mimmune = true;
                    }
                    var morale = 0;
                    var day = 0;
                    if ((heroes[this.obj[i].owner]) && (magic[heroes[this.obj[i].owner]]['day'])) {
                        day = magic[heroes[this.obj[i].owner]]['day']['effect'];
                    }
                    if ((this.obj[i].stone) || (this.obj[i].statix) || (this.obj[i].portal) || ((day != 1) && ((this.obj[i].undead) || (this.obj[i].elemental) || (this.obj[i].mechanical) || (this.obj[i].warmachine) || (magic[i]['und'])))) {
                        morale = 0;
                    } else {
                        ma = 0;
                        if (this.obj[i].moraleaddon) ma = this.obj[i].moraleaddon;
                        var m = ma;
                        if (this.obj[i].packpower) {
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                k = this.obj_array[k1];
                                if ((k != i) && (this.obj[k].packpower) && (this.obj[k].nownumber > 0) && (this.obj[k].side == this.obj[i].side) && (this.obj[k].x <= defxn)) {
                                    m++;
                                    if (this.obj[k].packboss) m++;
                                }
                            }
                        }
                        if (inserted) {
                            var k = 0;
                            var x = 0,
                                y = 0,
                                b = 0,
                                x2 = 0,
                                y2 = 0,
                                b2 = 0;
                            var frig = false;
                            var brave = false;
                            var deathstare = false;
                            var set_zero_morale = false;
                            var len = this.obj_array.length;
                            for (var k1 = 0; k1 < len; k1++) {
                                k = this.obj_array[k1];
                                if ((this.obj[k].deathstare) && (this.obj[k].side != this.obj[i].side) && (this.obj[k].nownumber > 0) && (!mimmune)) deathstare = true;
                                if ((this.obj[k].frightful_aura) && (this.obj[k].side != this.obj[i].side) && (this.obj[k].nownumber > 0) && (!mimmune)) {
                                    var bigx = this.obj[i]['big'];
                                    var bigy = this.obj[i]['big'];
                                    if (this.obj[i]['bigx']) bigx = 1;
                                    if (this.obj[i]['bigy']) bigy = 1;
                                    var bigkx = this.obj[k]['big'];
                                    var bigky = this.obj[k]['big'];
                                    if (this.obj[k]['bigx']) bigkx = 1;
                                    if (this.obj[k]['bigy']) bigky = 1;
                                    for (x = this.obj[i].x; x <= this.obj[i].x + bigx; x++) {
                                        for (y = this.obj[i].y; y <= this.obj[i].y + bigy; y++) {
                                            for (x2 = this.obj[k].x; x2 <= this.obj[k].x + bigkx; x2++) {
                                                for (y2 = this.obj[k].y; y2 <= this.obj[k].y + bigky; y2++) {
                                                    if ((Math.abs(x - x2) <= 1) && (Math.abs(y - y2) <= 1)) {
                                                        frig = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if ((this.obj[k].auraofbravery) && (this.obj[k].side == this.obj[i].side) && (this.obj[k].nownumber > 0)) {
                                    var bigx = this.obj[i]['big'];
                                    var bigy = this.obj[i]['big'];
                                    if (this.obj[i]['bigx']) bigx = 1;
                                    if (this.obj[i]['bigy']) bigy = 1;
                                    var bigkx = this.obj[k]['big'];
                                    var bigky = this.obj[k]['big'];
                                    if (this.obj[k]['bigx']) bigkx = 1;
                                    if (this.obj[k]['bigy']) bigky = 1;
                                    for (x = this.obj[i].x; x <= this.obj[i].x + bigx; x++) {
                                        for (y = this.obj[i].y; y <= this.obj[i].y + bigy; y++) {
                                            for (x2 = this.obj[k].x; x2 <= this.obj[k].x + bigkx; x2++) {
                                                for (y2 = this.obj[k].y; y2 <= this.obj[k].y + bigky; y2++) {
                                                    if ((Math.abs(x - x2) <= 1) && (Math.abs(y - y2) <= 1)) {
                                                        brave = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (((this.obj[i].morale > 0) || (m > 0)) && (!this.obj[i].bravery) && (!mimmune) && (this.obj[k].menacinglook) && (this.obj[k].side != this.obj[i].side) && (this.obj[k].nownumber > 0)) {
                                    var bigx = this.obj[i]['big'];
                                    var bigy = this.obj[i]['big'];
                                    if (this.obj[i]['bigx']) bigx = 1;
                                    if (this.obj[i]['bigy']) bigy = 1;
                                    var bigkx = this.obj[k]['big'];
                                    var bigky = this.obj[k]['big'];
                                    if (this.obj[k]['bigx']) bigkx = 1;
                                    if (this.obj[k]['bigy']) bigky = 1;
                                    for (x = this.obj[i].x; x <= this.obj[i].x + bigx; x++) {
                                        for (y = this.obj[i].y; y <= this.obj[i].y + bigy; y++) {
                                            for (x2 = this.obj[k].x; x2 <= this.obj[k].x + bigkx; x2++) {
                                                for (y2 = this.obj[k].y; y2 <= this.obj[k].y + bigky; y2++) {
                                                    if ((Math.abs(x - x2) <= 1) && (Math.abs(y - y2) <= 1)) {
                                                        m = 0;
                                                        set_zero_morale = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (frig) {
                                m -= 3;
                                this.clearPar(i, 'morale');
                            }
                        }
                        if ((!mimmune) && (festering)) {//+
                            m -= 2;
                            this.clearPar(i, 'morale');
                        }
                        if ((!mimmune) && (deathstare)) {
                            m -= 1;
                        }			
                        morale = (this.obj[i].morale + m);
                        if (set_zero_morale) {
                            morale = 0;
                            brave = false;
                        }
                        if ((this.obj[i].morale + m < 3) && (this.obj[i].bravery)) {
                            morale = 3;
                        }
                        if ((this.obj[i].morale + m < 3) && (brave)) {
                            if ((!this.obj[i].bravery)&&(!this.obj[i].auraofbravery)) {
                                this.clearPar(i, 'morale');
                            }
                            morale = 3;
                        }
                    }
                    if ((magic[i])&&(magic[i]['hyp'])&&(magic[i]['hyp']['nowinit'] > 0)) {
                        morale = Math.min(0, morale);
                    }
                    return morale;			
                }	
                stage.pole.clearPar = function(i, name) {
                    if (this.obj[i] === "undefined") {
                        return 0;
                    }
                    if (name == "morale") {
                        this.obj[i].moraleCount = 0;
                        this.obj[i].turnCount = 0;
                    }
                    if (name == "luck") {
                        this.obj[i].luckcount = 0;
                        this.obj[i].hitcount = 0;
                    }
                }		
                stage.pole.showmi = window.showmi = function(i) {
                    if (typeof mini_info_panel === 'undefined') return 0;	
                    if (i > 0) {
                        testBlock(i);
                        infoBlock(i);
                    } else {
                        testBlock();
                        infoBlock();				
                    }
                    if (i == -1) {
                        return 0;
                    }
                    if (typeof mini_info_panel.miss === 'undefined') {
                        var stat = "miss";
                        var temp = Make_Sprite();
                        temp.inited_show = true;
                        temp.r = 0;
                        temp.aaa = "miss";
                        set_visible(temp, 0);	
                        var img_temp = My_Image({offsetX: -razmetka['war_images'][17][mqc['sdx']], offsetY: -razmetka['war_images'][17][mqc['sdy']], image: stage.pole.ground['war_images'], 
                            width: razmetka['war_images'][19][mqc['xs']], height: razmetka['war_images'][19][mqc['ys']]/2, 
                            crop:{x: razmetka['war_images'][19][mqc['x']], y: razmetka['war_images'][19][mqc['y']] + razmetka['war_images'][19][mqc['ys']]/2, width: razmetka['war_images'][19][mqc['xs']], 
                            height: razmetka['war_images'][19][mqc['ys']]/2, visible: 1}, listening: false});
                        Make_addChild(temp, img_temp);						
                        mini_info_panel[stat] = temp;
                        var ttext = Make_Text('', {
                              x: 55,
                              y: 0,
                              fontFamily: 'Arial',
                              fontStyle_konva: 'Bold',
                              fontSize: mini_info_font_size,
                              fill: 0xFFFFFF,
                              stroke: 0x000000,
                              strokeThickness: miniinfo_stroke_width,
        //						  strokeThickness: 0.5,
                              shadowForStrokeEnabled: false,
        //						  textBaseline: 'middle',
                              dropShadowColor: 0x000000,
                              dropShadowAlpha: 1,
                              dropShadowBlur: 2,
                              dropShadow: true, dropShadowDistance: 0, dropShadowAngle: 0
                        });
                        set_X(ttext, 55);
                        set_Y(ttext, 0);
                        temp.line = ttext;
                        Make_addChild(temp, ttext);
                        Make_addChild(mini_info_panel, temp);
                    }
                        var y=Array(-7.45,0.5,9.05,18.5);
                        var k=0;
                        if ((!this.obj[i].mvisible)||(this.obj[i].nownumber<=0)/*||(this.obj[i]._x<0)*/)return 0;
                        var stats = ['tnv', 'wave', 'health', 'blood', 'mana', 'arrow', 'miss'];
                        this.mini_info_panel_scale();
                        var s_stats = Array();
                        for (var j=0;j<stats.length;j++)
                        {
                            if (mini_info_panel[stats[j]]){
                                set_visible(mini_info_panel[stats[j]], 0);
                            }
                            s_stats[stats[j]] = '';
                        }
                        set_visible(mini_info_panel, 1);
                        var ntxt = '';
                    if (this.obj[i].hero){
                        switch (lang){
                            case 0:
                                    ntxt = this.obj[i].nametxt+' ['+this.obj[i].maxhealth+' ур.]';
                            break;
                            case 1:
                                    ntxt = this.obj[i].nametxt+' ['+this.obj[i].maxhealth+' lev.]';
                            break;
                        }
                        if ((this.obj[i].maxmanna>0)||(this.obj[i].nowmanna>0)){
                            s_stats['mana'] = this.obj[i].nowmanna+'/'+this.obj[i].maxmanna;
                        }			
                        if (magic[i]['tur']){
                            s_stats['tnv'] = magic[i]['tur']['effect']+'%';
                        }	
                    } else {
                        if (this.obj[i].boss>0){
                            switch (lang){
                                case 0:
                                        ntxt = this.obj[i].nametxt+' ['+this.obj[i].boss+' ур.]';
                                break;
                                case 1:
                                        ntxt = this.obj[i].nametxt+' ['+this.obj[i].boss+' lev.]';
                                break;
                            }			
                        } else {
                            ntxt=this.obj[i].nametxt;
                            if (this.obj[i].nownumber>0){
                                var addinf=' ['+this.obj[i].nownumber+']';
                                if ((this.obj[i].stone)||(this.obj[i].statix)||(this.obj[i].warmachine)||(this.obj[i].portal)||(magic[i]['nnm'])||(magic[i]['BLD'])){
                                    addinf='';
                                }
                                ntxt = this.obj[i].nametxt+addinf;			
                            } else {
                                ntxt = this.obj[i].nametxt+' ['+this.obj[i].maxnumber+']';			
                            }
                            if (magic[i]['lev']) {
                                switch (lang){
                                case 0:
                                    ntxt += '('+magic[i]['lev']['effect']+' ур)';
                                break;
                                case 1:
                                    ntxt += '('+magic[i]['lev']['effect']+' lev)';
                                break;
                                }		
                            }				
                        }
                        s_stats['health'] = (this.obj[i].nowhealth)+'/'+(this.obj[i].maxhealth);		
                        if ((this.obj[i].shooter)&&(!this.obj[i].shadowattack)){
                            s_stats['arrow'] = this.obj[i].shots;
                        }
                        if ((this.obj[i].caster)&&(this.obj[i].caster!='')&&(!this.obj[i].randomcasterd)&&(!this.obj[i].crystal)){
                            s_stats['mana'] = this.obj[i].nowmanna+'/'+this.obj[i].maxmanna;
                        }
                        if ((magic[i]['rag'])&&(this.obj[i]['ragingblood'])) {
                            var rlevel=Array(-10000, 200, 500, 1000);
                            var lev=1;
                            for (var z=1;z<=2;z++){
                                if (rlevel[z]<=magic[i]['rag']['effect']) lev=z+1;
                            }
                            var her = 0, herolevel=0;
                            var len = this.obj_array.length;
                            for (var k1=0;k1<len;k1++)
                            {
                                var z = this.obj_array[k1];
                                if ((this.obj[z].hero)&&(this.obj[z].owner==this.obj[i].owner)) her=z;
                            }
                            if (her>0) herolevel=this.obj[her].maxhealth;
                            s_stats['blood'] = magic[i]['rag']['effect']+' / '+rlevel[lev];
                            k++;
                        }
                        s_stats['miss'] = "";
                        if (this.obj[i].incorporeal){
                            if (this.obj[i].misscount == 1) {
                                s_stats['miss'] = '50% +'
                            } else if (this.obj[i].misscount == 2) {
                                s_stats['miss'] = '0%'
                            } else if (this.obj[i].misscount == -1) {
                                s_stats['miss'] = '50% -'
                            } else if (this.obj[i].misscount == -2) {
                                s_stats['miss'] = '100%'
                            } else {
                                s_stats['miss'] = '50%'
                            }
                        }
                    }
                    ntxt = '';
                    set_text(mini_info_panel.name_text, ntxt);
                    var y = 0;
                    for (var j=0;j<stats.length;j++) {
                        if (s_stats[stats[j]] != ''){
                            set_visible(mini_info_panel[stats[j]], 1);
                            set_Y(mini_info_panel[stats[j]], y-5);				
                            set_Y(mini_info_panel[stats[j]].line, 5);
                            set_text(mini_info_panel[stats[j]].line, s_stats[stats[j]]);
                            set_fontSize(mini_info_panel[stats[j]].line, mini_info_font_size);
                            var k = mini_info_font_size;
                            var p_height = get_height(mini_info_panel[stats[j]].line);
                            while ((get_width(mini_info_panel[stats[j]].line)>180)&&(k>3)){
                                k--;
                                set_fontSize(mini_info_panel[stats[j]].line, k);
                            }
                            p_height -= get_height(mini_info_panel[stats[j]].line);
                            set_Y(mini_info_panel[stats[j]].line, 5 + Math.floor(p_height/2));
                            set_strokeThickness(mini_info_panel[stats[j]].line,  k/mini_info_font_size*miniinfo_stroke_width);
                            yplus = 40;
                            y+=yplus;
                            if (y>=yplus*3) break;
                        }
                    }
                }
                window.raidsCountWaves = 0;
                if (btype == 8) {
                    let lastCount = 0;
                    for (i in stage.pole.obj) {
                        if ((stage.pole.obj[i].owner == 2)&&(lastCount != stage.pole.obj[i].nownumber)) {
                            raidsCountWaves++;
                            lastCount = stage.pole.obj[i].nownumber;
                        }			
                    }
                }
                stage.pole.showmitnv = function(raids = 0) {
                    if (typeof mini_info_panel === 'undefined') return 0;
                    if ((tnvscore == 0)&&(raids == 0)) return 0;
                    var y = Array(-7.45, 0.5, 9.05, 18.5);
                    var k = 0;
                    this.mini_info_panel_scale();
                    var s_stats = Array();
                    var stats = ['tnv', 'health', 'blood', 'mana', 'arrow'];
                    for (var j = 0; j < stats.length; j++) {
                        set_visible(mini_info_panel[stats[j]], 0);
                        s_stats[stats[j]] = '';
                    }
                    set_visible(mini_info_panel, 1);
                    var stats = ['tnv', 'wave'];
                    var y = 10;
                    var txt = Array();
                    txt[0] = tnvscore;
                    if (raids == 1) {
                        txt[1] = raidsCurrentWave + "/" + raidsCountWaves;
                    } else if (raids == 2) {
                        txt[1] = global_init/100 + " time";
                    } else {
                        txt[1] = tnvwave
                    }
                    set_text(mini_info_panel.name_text, '');
                    for (var j = Math.ceil(raids/10); j <= 1; j++) {
                        set_visible(mini_info_panel[stats[j]], 1);
                        set_X(mini_info_panel[stats[j]], 5);
                        set_Y(mini_info_panel[stats[j]], y - 5);
                        set_Y(mini_info_panel[stats[j]].line, 5);
                        set_text(mini_info_panel[stats[j]].line, ' ' + txt[j]);
                        set_fontSize(mini_info_panel[stats[j]].line, mini_info_font_size);
                        var k = mini_info_font_size;
                        while ((get_width(mini_info_panel[stats[j]].line) > 175) && (k > 3)) {
                            k--;
                            set_fontSize(mini_info_panel[stats[j]].line, k);
                        }
                        set_strokeThickness(mini_info_panel[stats[j]].line, k / mini_info_font_size * miniinfo_stroke_width);
                        yplus = 60;
                        y += yplus;
                    }
                }
                document.getElementById('oneskill_button').addEventListener("mouseover", oneskill_button_release_test);
                document.getElementById('oneskill_button').addEventListener("mouseout", waitbutton_onRollOut);
                document.getElementById('oneskill_button2').addEventListener("mouseover", oneskill_button_release_test);
                document.getElementById('oneskill_button2').addEventListener("mouseout", waitbutton_onRollOut);
                stage.pole.atb_scale();		
                window.timer_show_army = function() {
                    nframe++;
                    var time_now = Date.now();
                    if (last_timer_in == 0) last_timer_in = time_now;
                    var skip_frame = Math.min(1, Math.max(0, Math.floor((time_now - last_timer_in) / timer_interval) - 1));
                    var fps_l = 1000 / (time_now - last_timer_in);
                    if (fps_long == 0) {
                        fps_long = fps_l;
                    } else {
                        fps_long = Math.min(fps_l, fps_long);
                    }
                    if (war_scr == '') return 0;
                    if (!was_benchmark) return 0;
                    if ((animspeed_def < 1) && (nframe % 2 == 0) && (skip_frame == 0)) {
                        next_timer();
                        return 0;
                    }
                    animspeed = Math.max(1, animspeed_def) * (skip_frame + 1);
                    last_timer_in = time_now;
                    if (skip_frame) {
                        total_skips++;
                        total_skips2++;
                    } else {
                        total_skips = 0;
                    }
                    if (total_skips > 1) {
                        skip_frame = 0;
                        total_skips = 0;
                    }
                    was_skip_frame = skip_frame;
                    try {
                        if (typeof stage[war_scr].animate_army === 'function') {
                            stage[war_scr].animate_army(nframe, skip_frame);					
                            updateBar(btype == 145 ? 6 : 2);
                            if ((typeof(mini_info_panel) !== 'undefined')&&(!mini_info_panel.visible)) {
                                testBlock();
                                infoBlock();							
                            }
                            for (k in stage.pole.obj) {
                                if (stage.pole.obj[k].hero != undefined)
                                    continue;  
                                stage.pole.luckMoraleProbability(k, 'morale');
                                if ((((stage.pole.obj[k].nownumber == 0) && (stage.pole.obj[k].gate != 1)) || ((stage.pole.obj[k].nowhealth == 0) && (stage.pole.obj[k].last_dead != 1) && (stage.pole.obj[k].gate == 1))) && ((inserted) || (stage.pole.obj[k].owner == 2) || (btype == _QUESTWAR) || (btype == _VILLAGE_EVENT)) && (!stage.pole.obj[k].rock)) {
                                    if (magic[k].def !== undefined) {
                                        delete magic[k].def;
                                    }
                                }						
                            }
                            if (magicuse != "chainlighting") {
                                for (let i in stage.pole.obj) {
                                    if ((lastChain != 0)&&(stage.pole.obj[lastChain].chain)&&(stage.pole.obj[i].needSetNumber == 1)&&(stage.pole.obj[lastChain].chain.indexOf(parseInt(i)) == -1)) {
                                        stage.pole.obj[i].set_number();
                                        stage.pole.obj[i].needSetNumber = 0;
                                    }
                                }				
                            }
                            if ((btime != global_init)&&(btype == 119)) {
                                // stage.pole.showmitnv(2);
                                btime = global_init;
                            }
                        }
                    } catch (e) {
                        my_alert(e.stack + ' ' + war_scr);
                    }
                }
                stage.pole.getmorale = stage.pole.getMoraleN;		
            }	
        }
     
        if (location.pathname.indexOf("inventory.php") >= 0) {
            var inp = "";
            var bt = "";
            function inv_art_search_show() {
                let info = document.getElementById('inv_art_amount');
                for (let i = 0; i < info.children.length; i++) {
                    info.children[i].style.display = "none";
                }
                if (inp == "") {
                    inp = document.createElement("input");
                    inp.setAttribute("placeholder", "Поиск по названию");
                    inp.setAttribute("type", "text");
                    inp.setAttribute("id", "inp_search");
                    info.append(inp);
                    inp.addEventListener('input', search);
                    inp.style.display = "inline-block";
                    bt = document.createElement("button")
                    bt.innerHTML = "Скрыть поиск";
                    bt.setAttribute("id", "bt_search");
                    info.append(bt);
                    bt.addEventListener('click', hide_search);
                    bt.style.display = "inline-block";
                } else {
                    bt.style.display = "inline-block";
                    inp.style.display = "inline-block";
                }
                start_hide_hwm_hint();
            }
            function hide_search() {
                let info = document.getElementById('inv_art_amount');
                for (let i = 0; i < info.children.length; i++) {
                    info.children[i].style.display = (info.children[i].tagName == "DIV") ? "inline-block" : "none";
                }
            }
            function search() {
                let s = document.getElementById("inp_search").value;
                let el = document.getElementById("inventory_block");
                for (let i = 0; i < el.children.length; i++) {
                    let id = el.children[i].getAttribute("art_idx");
                    if (id == null) {
                        continue;
                    }
                    el.children[i].style.display = (arts[id].name.toLowerCase().includes(s.toLowerCase())) ? "block" : "none";
                }
            }
            let sDiv = document.createElement("div");
            let sImg = document.createElement("img");
            sImg.setAttribute("src", dailyURL + "i/search_logo.png");
            sImg.setAttribute("class", "inv_100mwmh");
            sDiv.append(sImg);
            sDiv.classList.add("divs_inline_right_24");
            sDiv.classList.add("btn_hover");
            sDiv.classList.add("show_hint");
            sDiv.style.right = "28px";
            document.getElementById("inv_art_amount").append(sDiv);
            sDiv.setAttribute("hint", "Поиск по названию");
            sDiv.setAttribute("hwm_hint_added", 1);
            sDiv.addEventListener('mousemove', show_hwm_hint);
            sDiv.addEventListener('touchstart', show_hwm_hint);
            sDiv.addEventListener('mouseout', hide_hwm_hint);
            sDiv.addEventListener('touchend', hide_hwm_hint);
            sDiv.addEventListener('click', inv_art_search_show);
        }
        if ((location.pathname.indexOf("war.php") >= 0)||(location.pathname.indexOf("warlog.php") >= 0)) {
            let timer = setInterval(check_start, 10);
            function check_start() {
                //if (unsafeWindow.gpause == false) {
                //    unsafeWindow.gpause = true;
                //    clearInterval(timer);
                //}
            }
            var warid = location.search.match(/warid=([0-9]+)/)[1];
            var key = "";
            if (location.search.match(/show_for_all=([0-9a-zA-Z]+)/)) {
                key = location.search.match(/show_for_all=([0-9a-zA-Z]+)/)[1];
            };
            var att = 0;
            var unit = ["", "", "", "", "", "", "", ""];
            getAtb(0);
            document.getElementById("confirm_ins").addEventListener("click", function () {setTimeout (getAtb(1), 4000);}, false);
            function getAtb(r) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "/battle.php?lastturn=-3&warid=" + warid + "&show_for_all=" + key,
                    onload: function(res) {
                        let info = "<style>.cont{position:relative;display:inline-block}.count {position: absolute;right: 0;bottom: 0;color: #f5c140;text-shadow: 0px 0px 3px #000, 0px 0px 3px #000, 0px 0px 3px #000, 0px 0px 3px #000;font-size: 1rem;font-weight: bold;}</style>";
                        info += "<b>Стартовый бонус АТБ</b><BR>";
                        if (res.responseText == "t=950turns=") {
                            if (r == 1) {
                                info += "Ошибка загрузки, начните бой и обновите страницу!";
                            } else {
                                return false;
                            }
                        }
                        let data = res.responseText.substring(res.responseText.indexOf(";/") + 2).split(";");
                        for (let i = 0; i < data.length - 1; i++) {
                            if (data[i].indexOf("|rock|") != -1) {
                                continue;
                            }
                            let unitNum = Number(data[i].substring(1, 3));
                            let armyNum = Number(data[i].substring(5 + 0*6, 5 + 1*6)) - 1;
                            let count = Number(data[i].substring(5 + 12*6, 5 + 13*6));
                            let startAtb = 100 - Number(data[i].substring(5 + 9*6, 5 + 10*6));
                            let img;
                            if (data[i].indexOf("|hero|") == -1) {
                                img = data[i].substring(5 + 24*6, data[i].indexOf("|"));
                            } else {
                                img = data[i].split("|")[8].substring(1);
                            }
                            img = img.substring(0, img.length - 3);
                            unit[armyNum] += "<div class = 'cont'><img width = '40px' src='/i/portraits/" + img + "anip40.png'><div class = 'count'>" + startAtb + "</div></div>";
                        }
                        for (let i = 0; i < unit.length; i++) {
                            if (unit[i] != "") {
                                info += "Команда №" + (i + 1) + "<BR>" + unit[i] + "<BR>";
                            }
                        }
                        let elem = [];
                        elem[0] = document.querySelector("#chat_format");
                        elem[1] = document.querySelector("#chat_format_classic");
                        elem[0].innerHTML = info + elem[0].innerHTML;
                        elem[1].innerHTML = info + elem[1].innerHTML;
                        //elem[0].innerHTML = "<div class = 'atb-info' style = 'display:none'>" + info + "</div>" + elem[0].innerHTML;
                        //elem[1].innerHTML = "<div class = 'atb-info' style = 'display:none'>" + info + "</div>" + elem[1].innerHTML;
                    }
                });
            }
        }
    })();