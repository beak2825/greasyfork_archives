// ==UserScript==
// @name            Custom - XXX Release Hider
// @namespace       http://tampermonkey.net/
// @version         1.5.4
// @description     Hides XXX releases based on a simple text match. Works on 0xxx.ws, 1337x.to, ero-torrent.net, hotpornfile.org, naughtyblog.org, pornchil.com, ptorrents.com, pxxbay.com, torrentgalaxy.to and xxxclub.to.
// @homepage        https://greasyfork.org/en/scripts/472026-custom-xxx-release-hider
// @author          KeratosAndro4590
// @match           https://0xxx.me/*
// @match           https://0xxx.nu/*
// @match           https://0xxx.ws/*
// @match           https://1337x.to/cat/XXX/*
// @match           https://1337x.to/popular-xxx/
// @match           https://1337x.to/search/*
// @match           https://1337x.to/sub/48/*
// @match           https://ero-torrent.net/*
// @match           https://ero-torrent.net/tags/*
// @match           https://pornchil.com/*
// @match           https://ptorrents.com/*
// @match           https://torrentgalaxy.to/*
// @match           https://torrentgalaxy.to/torrents.php*
// @match           https://www.hotpornfile.org/
// @match           https://www.hotpornfile.org/?s=*
// @match           https://www.hotpornfile.org/category/*
// @match           https://www.hotpornfile.org/page*
// @match           https://www.naughtyblog.org/
// @match           https://www.naughtyblog.org/*
// @match           https://www.naughtyblog.org/page/*
// @match           https://www.ptorrents.com/*
// @match           https://www.pxxbay.com/
// @match           https://www.pxxbay.com/?s=*
// @match           https://www.pxxbay.com/category/scenes/*
// @match           https://www.pxxbay.com/page/*
// @match           https://xxxclub.to/torrents/*
// @exclude-match   https://www.pxxbay.com/category/movies/1080p-movies
// @exclude-match   https://www.pxxbay.com/category/movies/1080p-movies/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hotpornfile.org
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/472026/Custom%20-%20XXX%20Release%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/472026/Custom%20-%20XXX%20Release%20Hider.meta.js
// ==/UserScript==

// This script works using just pure JavaScript intended for use in a stable release of a modern browser.

(function () {
    'use strict';

    // The default entries block lame, boring or uninteresting releases and low quality terms

    let boolLogAll = false; // Default: false (whether to log all actions or not)
    let boolShowVerticalVideos = false; // Default: false (whether to show vertical videos or not)
    let boolDimOrHide = false; // True = dim, False = hide (whether to dim or hide elements)
    let boolRemovePornstarCollections = true; // Removes Pornstar Collections for https://www.naughtyblog.org

    let verticalVideoHeight = 310; // Default: 310 (the height of the thumbnails of vertical videos)
    let opacityValue = '0.15'; // Default: '0.15' (the opacity level of dimmed elements)
    let fadeOutDuration = '2s'; // Default: '2s' (the duration of fading out elements)

    let borderStyle = '0.1rem outset #c61124'; // the border style to use for blocked elements
    let textColor = 'red'; // the text color to use for blocked elements
    let textDecoration = 'line-through'; // crosses through text titles
    let pageTitle = "";

    // ace78fcf-312f-427d-b848-a0addc9e11e0

    /*
    VITAL: Avoid using pornstar names to keep consistency.
    Be sure to edit the "blockedItems" array to your own custom preferences.
    You may need to use a - instead of a space for some terms.
    */

    // Array of items that are allowed
    let allowedItems =
    [
        'Pack',
        'KayLovely',
        'LetsPostIt',
        'MissaX',
        'PureTaboo'
    ]

    // Array of items that are to be blocked (dimmed or hidden)
    let blockedItems =
    [
        'KeptSecret',
        'Kamiki',
        'Hajime',
        'DickHDDaily',
        'Dire-Desires',
        'DireDesires',
        'WivesOnVacation',
        'Manko88',
        '1PondoTV',
        'MyMilfz',
        'BaxtersBlowies',
        'HesGotRizz',
        'Muscle,',
        'Hunks,',
        'IntimacyProductions',
        'VibeWithMommy',
        'Bellesa',
        'LesbianSummer',
        'ExploitedTeens',
        'LegendaryX',
        'фото',
        'Bears,',
        'ShadySpa',
        'DigitalDesire',
        'AnalJesse',
        'Wanilianna',
        'JerkOffWithMe',
        '(Lesbian)',
        '-TS-',
        '-uncen',
        '10musume',
        '1111Customs',
        '1280p',
        '18Lust',
        '1pondo',
        '21-Foot-Art',
        '21EroticAnal',
        '240p',
        '2Poles1Hole',
        '360p',
        '3DCG',
        '480p',
        '4KCFNM',
        '540p',
        '544p',
        '608p',
        '720p HD mp4',
        '720p',
        'A-Girl-Knows',
        'AFourChamberedHeart-com',
        'AGirlKnows',
        'ALSAngels',
        'ALSScan',
        'ASMR',
        'ASMRMaddy',
        'ATKExotics',
        'ATKGalleria',
        'ATKGirlfriends',
        'ATKHairy',
        'Aaliyah-Yasin',
        'AbbieMaley',
        'AbbyWinters',
        'Abigailmorris',
        'Addicted2Girls',
        'AdelleSabelle',
        'AdrienneLuxe',
        'Aeriessteele',
        'AeryTiefling',
        'AfricanCasting',
        'AgedLove',
        'Aglaea-Productions',
        'Akagi',
        'Akari',
        'Albythegoat',
        'AlettaOceanLive',
        'Alexa-Nasha',
        'Alexxa-Vice',
        'AliceBong',
        'AliceNZ',
        'Alissa-Ryan',
        'All-Over-30',
        'AllBlackX',
        'AllGirlMassage',
        'AllHerLuv',
        'AllOver30',
        'AltErotic',
        'Alterotic',
        'Amakawa',
        'AmateurCFNM',
        'AmazingFilms',
        'Ameena-Green',
        'AmelieLou',
        'Amyyyoxxo',
        'Ana-Foxxx',
        'Anal-Angels',
        'Anal-Beauty',
        'AnalOverdose',
        'AnalVids',
        'Angel Nura',
        'Angel The Dreamgirl',
        'Angel-Luv',
        'Angel-Windell',
        'AngelsLove',
        'Anilos',
        'Annabelle-Rogers',
        'Annaplusone',
        'Anuskatzz',
        'Aoi',
        'Apollostone1776',
        'AprilOlsen',
        'Arabelle-Raphael',
        'ArabellesPlayground',
        'Areallyweakguy',
        'Argentina-Casting',
        'Arousins',
        'Asagiri',
        'Asia-XXX-Tour',
        'AsiaXXXTour',
        'Asian-Hidden-Camera',
        'Asian-Sex-Diary',
        'Asian-Street-Meat',
        'AsianSexDiary',
        'AsianStreetMeat',
        'Asianonrice',
        'Asians-Exploited',
        'Assylum',
        'AstekAngel',
        'AstroDomina',
        'Asuna',
        'Athenea-Rose',
        'AuntJudys',
        'AuntJudysXXX',
        'Auror-Anarchy',
        'AussieFellatioQueens',
        'Ava-Moore',
        'AveragePOV',
        'Azure-Sky-Films',
        'AzureSkyFilms',
        'Azusa',
        'Azzy-Star',
        'BBCSurprise',
        'BBW,',
        'BBW-Highway',
        'BBWHighway',
        'BDRiP',
        'BDSMBoxxx',
        'BJRaw',
        'BJWorld',
        'BLACKED-RAW',
        'BLURAY-H264-UNDERTAKERS',
        'BRRipx264-VXT',
        'BTS',
        'BTSXXX1080pMP4',
        'BaDoinkVR',
        'Babesafreak',
        'Babi-Star',
        'Babyfooji',
        'BackdoorPOV',
        'BackroomCastingCouch',
        'Banana-Fever',
        'BananaFever',
        'Bang Bus',
        'BangBus',
        'Banned-Stories',
        'BannedStories',
        'Bear,',
        'Beauty-Angels',
        'BecomingFemme.com',
        'Bellesa-Blind-Date',
        'BellesaPlus',
        'BenefitMonkey',
        'BennyGreen',
        'BiGuysFuck',
        'Big-Booty-Bailey',
        'Big-Gulp-Girls',
        'BigBootyBailey',
        'BigBootyTGirls',
        'BigGulpGirls',
        'Bionixxx',
        'Black-TGirls',
        'BlackAmbush',
        'BlackBullChallenge',
        'BlackPayBack',
        'BlackedRaw',
        'BlackpantherXXX',
        'BlowBangGirls',
        'BluRayx265-VXT',
        'BradMontana',
        'BrandNewAmateurs',
        'BreedMe',
        'BrokenLatinaWhores',
        'BrookelynneBriar',
        'BrothaLovers',
        'BrownBunnies',
        'BruceAndMorgan',
        'BundangCouple',
        'BunnyBlondyX',
        'BustyMara',
        'CAMSHOWS.TV',
        'Cam-Damage',
        'CamillaSweetheart',
        'Caribbeancom',
        'CarmelaClutch',
        'Cassidy-Luxe',
        'Cassie Bender',
        'CatCoxx',
        'CatchingGoldDiggers',
        'CathysCraving',
        'Celina-Powell',
        'CentoxCento',
        'Chantal-Danielle',
        'ChantalDanielle',
        'CharmModels',
        'Chloe-Surreal',
        'Christina-Savoy',
        'Ciara-Levi',
        'Cj Miles',
        'Clara-Mia',
        'ClaudiaMarie',
        'ClubCastings',
        'ClubSweethearts',
        'ClubTug',
        'CockyBoys.com',
        'Compilation XXX',
        'Connell Twins',
        'Cosmid',
        'Cospuri',
        'Creampie-Angels',
        'CreepyPA',
        'Cuck',
        'CuckHunter',
        'CuckoldSessions',
        'CumPerfection',
        'Cumpsters',
        'Cupacakeus',
        'CutieGingerAna',
        'CyberlyCrush',
        'Czech-Sex-Casting',
        'CzechBoobs',
        'CzechCaravan',
        'CzechSexCasting',
        'CzechVR.com',
        'CzechVRFetish.com',
        'DASD',
        'DFWKnight',
        'DPDiva',
        'DPFanatics',
        'DVD5',
        'DVDRiP',
        'DVDRip',
        'DVDRip',
        'Dad and Son',
        'DadsLovePorn',
        'DanaxMusclesXX',
        'DareWeShare',
        'DarkRoomVR',
        'DeepLush',
        'DeepThroatFrenzy',
        'Deeper-',
        'Deepthroatsirens',
        'DefeatedSexFight',
        'Defloration',
        'DelightfulHug',
        'Demi-Sutra',
        'Desi-Bang',
        'DesiBang',
        'DesperateAmateurs',
        'Destinationkat',
        'Destiny-Mira',
        'DevilsTGirls',
        'Diapered',
        'DickDrainers',
        'DickRides.com',
        'DickdrainersX',
        'Distorded',
        'Divine-DD',
        'DivineBitches',
        'DoTheWife',
        'Dolly-Dyson',
        'Domaicom',
        'DomingoView',
        'DorcelClub',
        'DownBlouseLoving-com',
        'DreamNet',
        'DreamTranny.com',
        'DrillMyHole.com',
        'DungeonSex',
        'Dyke4K',
        'EastCoastXXX',
        'Elana-Bunnz',
        'ElegantRaw',
        'Elfie-Eva',
        'Emma-Choice',
        'Emma-Nightgirl',
        'Enafox',
        'Erito',
        'EroticSpice',
        'EroticaX',
        'Ersties',
        'Eru',
        'Espi-Kvlt',
        'EternalDesire',
        'Eva-Ray',
        'EvaDeVil',
        'EverythingButt',
        'EvilErotic',
        'Evolved-Fights-Lez',
        'EvolvedFights',
        'EvolvedFightsLez',
        'ExCoGi-Girls',
        'ExCoGiGirls',
        'ExploitedCollegeGirls',
        'FC2-PPV-',
        'FC2PPV',
        'FTVGirls',
        'FTVMilfs',
        'FaceFuckTour',
        'FaceSittingFreaks.com',
        'Facial-Abuse',
        'FacialAbuse',
        'Faith-Vixxen',
        'FamilyDick.com',
        'FamilyScrew',
        'FanFuckers',
        'Fancysteel.com',
        'Fansly',
        'FemJoy',
        'Femdom',
        'FemdomEmpire',
        'FiNNiSH XXX',
        'Filoufitt',
        'FilthyGapers',
        'FinishHim',
        'Fiona-Dagger',
        'FirstAnalQuest',
        'FirstAnalTeens',
        'FirstBGG',
        'FirstClassPOV',
        'FisterTwister',
        'Fitandflirtyhotwife',
        'FitnessRooms',
        'Fitting-Room',
        'FlexiDolls',
        'ForPlayFilms',
        'ForeignAffairsXXX',
        'FoxxedUp',
        'Freak-Mob-Media',
        'FreakMobMedia',
        'FreakyT',
        'FreeUseFantasy',
        'FreeUseMILF',
        'Freeuse',
        'FreeuseFantasy.com',
        'Freeze-24',
        'Freeze-25',
        'Freeze.xxx',
        'FrolicMe',
        'FuckStudies',
        'FuckerMate',
        'FuckingPornstars',
        'Fujita',
        'Fukiishi',
        'FunDorado',
        'Funsizedasian',
        'Funsizedmegan',
        'Futa/',
        'Futanari',
        'GabbieCarterTV',
        'GangbangCreampie',
        'Geishakyd',
        'GenderX',
        'Ghetto-Gaggers',
        'GhettoGaggers',
        'Ghomestory',
        'GilfAF',
        'GinaGersonXXX',
        'Girl-Girl-XXX',
        'Girl/Girl',
        'GirlBullies',
        'GirlGirlXXX',
        'GirlfriendsFilms',
        'Girls-Only-Porn',
        'Girls-Out-West',
        'Girls-Way',
        'Girls-Way',
        'Girls-Way',
        'GirlsDeep',
        'GirlsGonePink',
        'GirlsOnlyPorn',
        'GirlsOutWest',
        'GirlsWay',
        'GloryHoleSecrets',
        'Glowupz',
        'Goddess-Evelyn',
        'Goddess-Maeve',
        'Goddexx',
        'Gothjock',
        'Grand-Mams',
        'GrandMams',
        'GrandParentsX',
        'GroobyGirls.com',
        'GroupBanged',
        'Gyno-Exclusive',
        'GynoExclusive',
        'H264AAC-VXT',
        'Hamasaki',
        'HardWerk',
        'HarleySpencer',
        'Hayleyxyz',
        'Hegre',
        'Heyzo-com',
        'Hibino',
        'Hidden-Zone',
        'Hiiragi',
        'Hijab',
        'HijabHookup',
        'Himari',
        'Hime-Tsu',
        'Hirose',
        'Hirosue',
        'Hitzefrei',
        'HogTied',
        'HollandschePassie',
        'HollyRandall',
        'HoneyTrans.com',
        'Hongkongdoll',
        'HookupHotshot',
        'HornyDreamBabeZ',
        'Hot-Guys-Fuck',
        'HotAndMean',
        'HotBoys.com.br',
        'HotGirlsGame',
        'HotGirlsRAW',
        'HotGirlsRaw',
        'HotGuysFuck',
        'HotMILFsFuck',
        'HotWifeRio',
        'HouseHumpers',
        'How-Women-Orgasm',
        'HowWomenOrgasm',
        'HuCows',
        'HungLow',
        'Hungry4Cum',
        'IAnalXXX',
        'IMadePorn',
        'ISmashedXXX',
        'ISuckXXX',
        'Igarashi',
        'Ignore4K',
        'InTheCrack',
        'IndustryInvaders',
        'Inked',
        'InkedMonster',
        'InkedPOV',
        'Innocenthotwifexxx',
        'Insex',
        'InterracialBlowbang',
        'InterracialPass',
        'InterracialVision',
        'IsiahMaxwellXXX',
        'ItsMeCat',
        'Itsukaichi',
        'IzzyBunnies',
        'IzzyFit',
        'Izzybunnies',
        'JAV BluRay 1080p',
        'JAVHub',
        'JOIBabes',
        'JUQ-',
        'Jack-And-Jill',
        'JackOffGirls',
        'JackRipherxxx',
        'Jacquie-Et-Michel-TV',
        'JacquieEtMichelTV',
        'Jadeteen',
        'Jana-JJ',
        'Jap+E',
        'Japan-HDV',
        'JapanHDV',
        'JapanVR',
        'Jarushka-Ross',
        'JawBreakerz',
        'Jax-Slayher-TV',
        'JaxSlayher',
        'JaxSlayherTV',
        'Jesse-Pony',
        'Jessica-Azul',
        'Jessica-Borga',
        'JessicaCute',
        'JoannaJet',
        'JoePusher',
        'Jolie-Lyon',
        'JoshuaLewis-Presents',
        'JoyMii.com',
        'Joymii',
        'Jude-Ryan',
        'JuliAleXXX',
        'JuliaAnnLive',
        'Julie-Jess',
        'JustPOV',
        'K8sarkissian',
        'KUNK-',
        'Kama-Oxi',
        'Kamisaka',
        'Karen-Fernando',
        'KarmaRX',
        'KarupsHA',
        'KarupsOW',
        'KarupsPC',
        'Kashiwagi',
        'Katerina-Hartlova',
        'Katopunk',
        'Katty-Blake',
        'Kawai',
        'Kawaii',
        'Kawashima',
        'Keiko',
        'Kelly-Nixe',
        'Khlo-X',
        'Kiittenymph',
        'Killaabunny',
        'KimberLeeLive',
        'KimberleyJx',
        'Kin8tengoku',
        'KingBBC',
        'KingNoireXXX',
        'KittyxKum',
        'Kobayakawa',
        'Komatsu',
        'Kona-Jade',
        'Ksu-Colt',
        'Kumiko',
        'KxngUnkasaxXx',
        'LA-New-Girl',
        'LANewGirl',
        'La-Tina-Hotwife',
        'Lacey-London',
        'Lady-Blondie',
        'Lady-Lyne',
        'Lady-Voyeurs',
        'LadyLyne',
        'LadyVoyeurs',
        'Ladyboy',
        'LadyboyObsession.com',
        'Lana-Rain',
        'LatinaCasting',
        'LatinaFuckTour',
        'LatinaMILF',
        'LatinaRAW',
        'LatinaRaw',
        'LegalPorno',
        'Legalporno.com',
        'LegendaryLootz',
        'Legendarylootz',
        'Lesbea',
        'Lesbian X',
        'Lesbian,',
        'LesbianX',
        'LetsPostIt',
        'LetsTryHard',
        'Lewdestbunnie',
        'LezBeBad',
        'LezCuties',
        'LezDom',
        'LezKey',
        'Lianna-Lawson',
        'LifeSelector',
        'LilSushiRoll',
        'Lilah-Lovesyou',
        'Lilmochidoll',
        'Lily-Lane',
        'LilyKawaii',
        'LilyThot',
        'Linux,',
        'Little Puck',
        'Little-Bunny-B',
        'Little-Puck',
        'LittleCaprice-Dreams',
        'LittlePuck',
        'Littlepolishangel',
        'Livecleo',
        'Lola-Crystals',
        'Lola-James',
        'LoneMilf',
        'LouisaMay',
        'Loveless-XXX',
        'Lucid-Flix',
        'LucidFlix',
        'Luna-Baby',
        'Luna-Okko',
        'LunaRoulette',
        'Lustery',
        'Lustfullovers',
        'Luxure',
        'MILFOverload',
        'MYLKED',
        'MadBros',
        'Madison Moores',
        'Male Fucks Trans',
        'MamboPerv',
        'MamsCasting',
        'ManuelFerraraTV',
        'ManyVids 2023 Lana Rain',
        'ManyVids 2023 Mama Fiona',
        'ManyVids 2023 Sonya Vibe',
        'ManyVids-2023-Brooke-Woods',
        'ManyVids2-023-Sexyandmarried',
        'MariskaX',
        'MarsFoxxx',
        'Mature-NL',
        'Mature4K',
        'MatureFetish',
        'MatureGapers',
        'MatureGynoExam',
        'MatureNL',
        'MatureVan',
        'MaxCartel',
        'MaxineX',
        'Maycontaingirl.com',
        'Megan-Inky',
        'MeidenVanHolland',
        'Melina-May',
        'MelinaMay',
        'Melissa-Stratton',
        'MenAtPlay',
        'Met-Art-X',
        'MetArt',
        'MetArtFilms',
        'MetArtX',
        'Mia-Molotov',
        'Mila-Azul',
        'MilfAF',
        'MilkyPeru',
        'Mimi-Malibu',
        'Minahata',
        'MinnieStClaire',
        'Miss Mallorie Switch',
        'Miss-Lexa',
        'Miss-Roper',
        'MissPrincessKay',
        'MissPussyCat',
        'MissVioletStarr',
        'Mistress-Alina',
        'Mitsuki',
        'MixedX',
        'Mizuki',
        'MoRina',
        'MollyMoonn',
        'MollyRedWolf',
        'MomIsHorny',
        'MommyBlowsBest',
        'MommyJOI',
        'MommysGirl',
        'Momozono',
        'Moms-Lick-Teens',
        'MomsLickTeens',
        'MomsOnMoms',
        'Monami',
        'Monger-In-Asia',
        'MongerInAsia',
        'Monika-Smith',
        'Morgpie',
        'Morisawa',
        'MrLuckyLife',
        'MrLuckyRaw',
        'MuchaSexo',
        'Mukai',
        'Muscles,',
        'Mvngokitty',
        'MyBestSexLife',
        'MyDirtyHobby 2023 DollyDyson',
        'MyDirtyHobby',
        'MyPOVFam',
        'MySexMobile',
        'MySweetApple',
        'MylfSelects',
        'MylfXSparksEntertainment',
        'Nadine-J',
        'Nakayama',
        'Nanatsumori',
        'Naomih666',
        'Narumi',
        'Narumiya',
        'Natalia-Forrest',
        'Nebraska-Coeds',
        'NebraskaCoeds',
        'Net-Video-Girls',
        'NetGirl',
        'NetVideoGirls',
        'Nicci-Azzy',
        'NiceAndSlutty',
        'NickMarxx',
        'NikkiZeeXXX',
        'NiksIndian',
        'NinaKayy',
        'Ninomiya',
        'NoFaceMom77',
        'Nookies',
        'NookiesOriginals',
        'Noriko',
        'Nozomi',
        'Nubiles',
        'Nutaku',
        'NylonPerv',
        'Octokuro',
        'OfficePOV',
        'Ogirls',
        'OhMyHoles',
        'OldYoungLesbianLove',
        'Oliviamaebaee',
        'OnlyBBC',
        'OnlyFans 2023 Dainty Wilder',
        'OnlyFans 2023 EnaFox',
        'OnlyFans 2023 Hidori',
        'OnlyFans 2023 LegendaryLootz',
        'OnlyFans 2023 OnlyTwins',
        'OnlyFans 2023 Thestartofus',
        'OnlyFans',
        'OnlyFans-2023-Sweetie-Fox',
        'OnlyTarts',
        'OnlyTeenBlowJobs',
        'Oopsie',
        'OralOverdose',
        'Otokonoko',
        'Over40Handjobs',
        'OyeMami',
        'PAWGNextDoor',
        'PKFStudios',
        'PMS-',
        'Parasited',
        'PassionsOnly',
        'Pawged',
        'Peachjars',
        'Pegging',
        'Perfect18',
        'PervPrincipal',
        'Philavise',
        'Pink-Drip',
        'Pink-Milk',
        'PinkOTgirls.com',
        'PinkoTGirls',
        'PinupFiles',
        'PissVids',
        'Playboy-Plus',
        'PlayboyPlus',
        'Plumper-Pass',
        'PlumperPass',
        'PornDudeCasting',
        'PornMegaLoad',
        'PremiumBukkake',
        'Primals-Teasing-Edging',
        'PrimeLesbian',
        'Princess-Handjobs',
        'PrincessLexiePresents',
        'Private-Society',
        'PrivateSociety',
        'Prostate Milking',
        'Psycho-ThrillersFilms',
        'PsychopornTW',
        'PublicHandjobs',
        'Puke',
        'Puppy-Girlfriend',
        'PuppyGirlfriend',
        'Pure-BBW',
        'Pure-ts.com',
        'PureCFNM',
        'PureXXX',
        'Purple-Bitch',
        'PutaLocura',
        'REMASTERED-XXX',
        'RRFox',
        'RawWhiteMeat',
        'RazorCandi',
        'RealGirlsGoneBad',
        'RealTimeBondage.com',
        'Red-XXX',
        'Reducing Mosaic',
        'Reislin',
        'RichardMannsWorld',
        'Ricky\'s-Room',
        'RickysRoom',
        'RomeMajor',
        'Rosarosebud',
        'RyAnneRedd',
        'Ryan-Reid',
        'S3XUS',
        'S3xus',
        'SDMP4',
        'SODVR',
        'Sabina-Leigh',
        'Sakura',
        'Sammm-Next-Door',
        'Saori',
        'Sapphic',
        'Sarah-Calanthe',
        'Sasaki',
        'Sasha-Strokes',
        'Sassy-Pantz',
        'SavageGangbang',
        'Saviorangel',
        'Scat',
        'SeanCody.com',
        'SeducedByACougar',
        'See-Him-Fuck',
        'SeeHIMFuck',
        'SeeHimFuck',
        'SeeMomSuck',
        'SelfieSuck',
        'Selina-Imai',
        'SensualHeat',
        'SensualLove',
        'Serenity-Cox',
        'Seska',
        'Sex-Art',
        'Sex-With-Muslims',
        'SexArt',
        'SexLikeReal',
        'SexWithMuslims',
        'Sexycuteisa',
        'Shame4K',
        'Shannon-Huxley',
        'SheMaleStrokers.com',
        'SheSeducedMe',
        'Shemale',
        'Shinaryen',
        'Shinomiya',
        'Shiori',
        'Shirakawa',
        'Shrooms Q',
        'Shrooms-Q',
        'Sia-Siberia',
        'Sia_Siberia',
        'SimplyAnal',
        'SinfulXXX',
        'Sinfuldeeds',
        'SinnSage',
        'SissyPOV.com',
        'Slant-Eyed-Asian-Hoe',
        'Slayed',
        'Slim4K',
        'SlipperyMassage',
        'SlutInspection',
        'SlutsAroundTown',
        'Snowdeville',
        'SofieMarieXXX',
        'SpicyBooty',
        'Starry-Night-Flower',
        'Strap-Lez',
        'StrapLez',
        'StrapLezz',
        'StrapLezz.Com',
        'StrapLezz21',
        'Stunning18',
        'SubSluts',
        'Subgirl0831',
        'SugarDaddyPORN',
        'SugarbabesTV',
        'SummerSinners',
        'Superbe',
        'Suzuki',
        'Swallow4fun',
        'Swallowed',
        'SweetKiss69',
        'Sweetheart-Video',
        'Sweetie-Fox',
        'Swhores',
        'SybilRAW',
        'SybilRaw',
        'SydneyHail',
        'TGirl',
        'TGirlJapan.com',
        'TGirls.porn',
        'TGirls.xxx',
        'TS-Divas',
        'TSRAW.com',
        'TSRaw.com',
        'TXVLOG',
        'Tabbynoname',
        'Tabitha-Poison',
        'TabithaXXX',
        'Tadokoro',
        'Tadpole-X-Studio',
        'TadpolexStudio',
        'Takarada',
        'Tanaka',
        'Tanya-Virago',
        'Tatum-Christine',
        'TeamSkeetXImMayBee',
        'TeamSkeetXLuxuryGirl',
        'TeamSkeetXManko88',
        'TeamSkeetXTenshigao',
        'TeamskeetXModelMediaASIA',
        'TeasePOV',
        'TeenFromBohemia',
        'TeenSexMania',
        'TeenSexMovs',
        'Teenikini',
        'TeenyLovers',
        'TeenyTaboo',
        'Test-Shoots',
        'TexasBukkake',
        'Thai',
        'ThaiGirlsWild',
        'That-Kinky-Girl',
        'The-Flourish-XXX',
        'The-Life-Erotic',
        'TheFlourishEntertainment',
        'TheFlourishFetish',
        'TheFlourishPOV',
        'TheFlourishXXX',
        'TheHabibShow',
        'TheLesbianExperience',
        'TheLifeErotic',
        'ThePOVGod',
        'TheSlutsNextDoor',
        'Thecosmonaut',
        'Thedongkinger',
        'Thiccvision',
        'ThisGirlSucks',
        'Throated',
        'Tiana-Blow-',
        'Tiger-Lilly',
        'Tiger-Moms',
        'TigerMoms',
        'Tigerlilly',
        'Titi-Ramone',
        'TmwPOV',
        'TobyDickStudio',
        'Tomino',
        'TouchMyWife',
        'Trans,',
        'Trans-',
        'Trans500',
        'TransAngels',
        'Transexual',
        'Transfixed',
        'Transgressive',
        'Transsensual.com',
        'Transsexuals.com',
        'Trike',
        'TrikePatro',
        'Trip-For-Fuck',
        'TripForFuck',
        'Trippie-Bri',
        'TrippyMMs',
        'TrophyWifeNat',
        'TrueLesbian',
        'Try-on-haul',
        'TsLunaSnow',
        'TsPov.com',
        'Tsubasa',
        'Tsubomi',
        'Tsukimoto',
        'TugCasting',
        'Tuk-Tuk',
        'TukTuk-Patrol',
        'TukTukPatro',
        'TurningTwistys',
        'Tushy-Raw',
        'TushyRaw',
        'Twink',
        'Twistys',
        'Uncensored',
        'Usami',
        'Use-POV',
        'UsePOV',
        'Uyoshi',
        'VHSRip',
        'VIPissy',
        'VMVideo',
        'VR',
        'VR180',
        'VRConk.com',
        'VRLatina.com',
        'Verashia',
        'VickyAtHome',
        'Victoria-May',
        'VirtualReal',
        'VirtualRealPorn.com',
        'VirtualTaboo.com',
        'Viv-Thomas',
        'VivThomas',
        'Vmvideo',
        'Vomit',
        'Voodooed',
        'Vored',
        'VurigVlaanderen',
        'WEBRip-MP4-LEWD',
        'WaifuMiia',
        'Waifumiia',
        'WankItNow',
        'WankzVR',
        'Watch4Beauty',
        'WatchYouCheat',
        'Water Melonsugar3',
        'WeFuckBlackGirls',
        'WeLikeToSuck',
        'WeLiveTogether',
        'WebYoung',
        'WetAndPissy',
        'WetAndPuffy',
        'WettMelons',
        'Wettmelons',
        'When-Girls-Play',
        'WhenGirlsPlay',
        'WhippedAss',
        'WhiteNblack',
        'WhoaBoyz',
        'Whoahannahjo',
        'WhornyFilms',
        'WifeysWorld',
        'Wild-On-Cam',
        'WildOnCam',
        'Will-Tile-XXX',
        'WillTileXXX',
        'Windows,',
        'Wisconsin-Tiff',
        'Women-Seeking-Women',
        'WoodmanCastingX',
        'WowGirls',
        'X-Angels',
        'X-Sensual',
        'XXX WEB-DL SPLIT SCENES',
        'Xingkong',
        'Xlovelyadrianax',
        'XvideosRED',
        'Xwife-Karen',
        'XxxTabithaxxx',
        'Yasmina-Khan',
        'Yatsugake',
        'Yayoi',
        'YesGirlz',
        'Yinyleon',
        'Yogabella',
        'YoungCourtesans',
        'YoungSexParties',
        'Your Submissive Doll',
        'YourFavoriteMommy',
        'YourStepSis',
        'YouthLust',
        'Yua-Mikami',
        'Yuahentai',
        'Yui',
        'Yukino',
        'Yuna',
        'Yurizan-Beltran_',
        'Yuzuki',
        'Z-Films-Originals',
        'Z-Filmz',
        'Z-Filmz-Originals-com',
        'Z-FilmzOriginals',
        'Zaawaadi',
        'Zdank',
        'ZebraGirls',
        'Zirael-Rem',
        '[3D ART]',
        '[548p]',
        '[ART]',
        '[Cen]',
        '[HotBoys.com.br]',
        '[MetartNetwork.com]',
        '[Realjamvr.com]',
        '[Seehimfuck.com]',
        '[cen]',
        '[uncen]',
        'bella-joie',
        'cen-',
        'cgi',
        'chaturbate',
        'cocobae96',
        'domestic-Personal-Selection-Collection',
        'domestic-original-collection',
        'ernaburn',
        'hexx_girl',
        'jav',
        'la_tina_hotwife',
        'patreon-com',
        'reflectivedesire.com',
        'scat',
        'solo',
        'uncen',
        'uncen-',
        'virtualtaboo',
        'your_submissive_doll',
        '¥',
        '【8K VR】',
        'お',
        'の',
        '一',
        '不',
        '个',
        '为',
        '之',
        '了',
        '二',
        '人',
        '他',
        '会',
        '入',
        '出',
        '力',
        '十',
        '国',
        '在',
        '大',
        '奴',
        '市',
        '年',
        '我',
        '日',
        '是',
        '有',
        '本',
        '生',
        '的',
        '行',
        '这',
        '退',
        '金',
        '長',
        '高'
    ];

    if(boolRemovePornstarCollections == true)
    {
        blockedItems.push('Pornstar Collection');
    }

    // Combines arrays and then sorts the final array
    blockedItems.filter(String);
    blockedItems.sort();
    blockedItems = [...new Set(blockedItems)]; // Removes duplicate items
    // console.log(blockedItems); // Copy from dev console to grab sorted

    console.clear();

    if(boolDimOrHide === true)
        {
        console.group("Dimming porn releases for " + window.location.hostname);
        }
    else
        {
        console.group("Hiding porn releases for " + window.location.hostname);
        }

    // Creates a new clean array
    let itemsToBlock = blockedItems;

    // Logs the detected site to the Developer Console
    console.info("🌏 " + window.location.hostname);

    let hostName = window.location.hostname;

    function editTitle(selectorForTitle, titleTextInner, styleColor)
    {
        pageTitle = document.querySelector(selectorForTitle);
        if (pageTitle != null) {
            pageTitle.innerText = titleTextInner;
            pageTitle.style.color = styleColor;
        }
    }

    // Initializes all main variables
    let node = "", item = "", selector = "";

    switch (hostName) {
        case 'www.hotpornfile.org': {
            // Sets the page title to show the script has applied
            editTitle('body > div.off-canvas-wrap > div > div > nav > ul > li > h1 > a', 'HPF 🧽', 'pink');
            for (var i of itemsToBlock) {
                // console.log(i);
                i = (i != null) ? i.toLowerCase() : '';
                selector = 'div[id^="post-"] > div > div > h2 > a[href*="' + i + '"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0) {
                    node.forEach(function (item) {
                    item.style.color = textColor;
                    item.style.textDecoration = textDecoration;
                    let itemParent = item.parentElement.parentElement.parentElement;
                    itemParent.style.border = borderStyle;
                    itemParent.style.opacity = opacityValue;
                    itemParent.style.transition = fadeOutDuration;
                    if(boolDimOrHide == false){itemParent.style.display = "none";}
                    console.info('⛔ ' + i);
                    // Logging all enabled?
                    if (boolLogAll == true) {
                        console.warn(i + ' not found on page.');
                    }
                    node = '';
                    });
                }
            }
            // Hides vertical videos
            if (boolShowVerticalVideos == false) {
                // Fades out vertical videos (height larger than 174)
                selector = 'div[id^="post-"] > div > a > img';
                node = document.querySelectorAll(selector);
                if (node.length > 0) {
                    node.forEach(function (item) {
                    if (item.height > verticalVideoHeight) {
                        item.style.opacity = opacityValue;
                        //(boolDimOrHide == false) ? item.hide();
                        if(boolDimOrHide == false){item.style.display = "none";}
                    }
                    });
                }
            }
            break;
        }
        case 'www.pxxbay.com': {
            // Sets the page title to show the script has applied
            editTitle('div.gridmax-logo > div > h1 > a', 'pxxbay 🧽', 'white');
            // Sets the page title to show the script has applied (attempt 2)
            editTitle('#gridmax-head-content > div > div > div > div > div.gridmax-logo > div > p.gridmax-site-title > a', 'pxxbay 🧽', 'white');
            allowedItems = allowedItems.map(word => word.toLowerCase()); // Makes all items lowercase
            for (var i of itemsToBlock) {
                i = (i != null) ? i.toLowerCase() : '';
                selector = 'h3 > a[href*="' + i + '"]';
                //selector = 'div > div.gridmax-grid-post-details.gridmax-grid-post-block > h3 > a[href*="' + i + '"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                    node.forEach(function (item) {
                    item.style.color = textColor;
                    item.style.textDecoration = textDecoration;
                    let itemParent = item.parentElement.parentElement.parentElement.parentElement;
                    itemParent.style.border = borderStyle;
                    itemParent.style.opacity = opacityValue;
                    itemParent.style.transition = fadeOutDuration;
                    if(boolDimOrHide == false){itemParent.style.display = "none";}
                      //item.parentElement.parentElement.parentElement.parentElement.style.filter = "grayscale(var(--value, 100%))";
                    console.info('⛔ ' + i);
                    // Logging all enabled?
                    if (boolLogAll == true) {
                        console.warn(i + ' not found on page.');
                    }
                    node = '';
                    });
                }
            }
            // Hides the Trending section
            selector = '#gridmax-grid-posts-widget-id-3';
            let trendingElement = document.querySelector(selector);
            if (trendingElement != null) {
                trendingElement.style.display = "none";
            }
              // Hides vertical videos
            if (boolShowVerticalVideos == false) {
                // Fades out vertical videos (height larger than 174)
                selector = 'a > img';
                node = document.querySelectorAll(selector);
                if (node.length > 0) {
                    node.forEach(function (item) {
                    if (item.height > verticalVideoHeight) {
                        item.style.opacity = opacityValue;
                        item.style.transition = fadeOutDuration;
                        if(boolDimOrHide == false){item.parentElement.parentElement.parentElement.parentElement.style.display = "none";}
                        //item.style.filter = "grayscale(var(--value, 100%))";
                    }
                    });
                }
            }
            break;
        }
        case 'ero-torrent.net': {
            for (var i of itemsToBlock) {
                // Selects links that have matching text
                selector = 'a > img[alt*="' + i + '"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                node.forEach(function (item) {
                    item.style.color = textColor;
                    item.style.textDecoration = textDecoration;
                    item.style.border = borderStyle;
                    item.style.opacity = opacityValue;
                    item.style.transition = fadeOutDuration;
                    console.info('⛔ ' + i);
                    // Logging all enabled?
                    if (boolLogAll == true) {
                        console.warn(i + ' not found on page.');
                    }
                    node = '';
                });
            }
            }
            break;
        }
        case '0xxx.ws': {
            for (var i of itemsToBlock) {
            // Selects links that have matching text
            selector = 'td.title > a[href*="' + i + '"]';
            node = document.querySelectorAll(selector);
            if (node.length > 0 && !(allowedItems.includes(i))) {
                node.forEach(function (item) {
                    item.style.color = textColor;
                    item.style.textDecoration = textDecoration;
                    let itemParent = item.parentElement.parentElement;
                    itemParent.style.border = borderStyle;
                    itemParent.style.opacity = opacityValue;
                    itemParent.style.transition = fadeOutDuration;
                    if(boolDimOrHide == false){itemParent.style.display = "none";}
                    console.info('⛔ ' + i);
                    // Logging all enabled?
                    if (boolLogAll == true) {
                        console.warn(i + ' not found on page.');
                    }
                    node = '';
                });
            }
            }
            break;
        }
        case '0xxx.nu': {
            for (var i of itemsToBlock) {
            // Selects links that have matching text
            selector = 'td.title > a[href*="' + i + '"]';
            node = document.querySelectorAll(selector);
            if (node.length > 0 && !(allowedItems.includes(i))) {
                node.forEach(function (item) {
                    item.style.color = textColor;
                    item.style.textDecoration = textDecoration;
                    let itemParent = item.parentElement.parentElement;
                    itemParent.style.border = borderStyle;
                    itemParent.style.opacity = opacityValue;
                    itemParent.style.transition = fadeOutDuration;
                    if(boolDimOrHide == false){itemParent.style.display = "none";}
                    console.info('⛔ ' + i);
                    // Logging all enabled?
                    if (boolLogAll == true) {
                        console.warn(i + ' not found on page.');
                    }
                    node = '';
                });
            }
            }
            break;
        }
        case '0xxx.me': {
            for (var i of itemsToBlock) {
            // Selects links that have matching text
            selector = 'td.title > a[href*="' + i + '"]';
            node = document.querySelectorAll(selector);
            if (node.length > 0 && !(allowedItems.includes(i))) {
                node.forEach(function (item) {
                    item.style.color = textColor;
                    item.style.textDecoration = textDecoration;
                    let itemParent = item.parentElement.parentElement;
                    itemParent.style.border = borderStyle;
                    itemParent.style.opacity = opacityValue;
                    itemParent.style.transition = fadeOutDuration;
                    if(boolDimOrHide == false){itemParent.style.display = "none";}
                    console.info('⛔ ' + i);
                    // Logging all enabled?
                    if (boolLogAll == true) {
                        console.warn(i + ' not found on page.');
                    }
                    node = '';
                });
            }
            }
            break;
        }
        case 'torrentgalaxy.to': {
            // Sets the page title to show the script has applied
            editTitle('#quicksearchgroup > span.input-group-btn > button', 'Search 🧽', '#efc800');
            editTitle('table:nth-child(1) > tbody > tr > td:nth-child(2) > div > div > button', 'Search 🧽', '#efc800');
            for (var i of itemsToBlock) {
                selector = '#click > div > a[title*="' + i + '"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                    node.forEach(function (item) {
                        item.style.color = textColor;
                        item.style.textDecoration = textDecoration;
                        let itemParent = item.parentElement.parentElement.parentElement;
                        itemParent.style.border = borderStyle;
                        itemParent.style.opacity = opacityValue;
                        itemParent.style.transition = fadeOutDuration;
                        if(boolDimOrHide == false){itemParent.style.display = "none";}
                        console.info('⛔ ' + i);
                        // Logging all enabled?
                        if (boolLogAll == true) {
                            console.warn(i + ' not found on page.');
                        }
                        node = '';
                    });
                }
            }
            break;
        }
        case 'pornchil.com': {
            for (var i of itemsToBlock) {
                i = (i != null) ? i.toLowerCase() : '';
                i = encodeURI(i);
                allowedItems = allowedItems.map(word => word.toLowerCase()); // Makes all items lowercase
                selector = 'div > header > h2 > a[href*="'+i+'"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                    node.forEach(function (item) {
                        item.style.color = textColor;
                        item.style.textDecoration = textDecoration;
                        let itemParent = item.parentElement.parentElement.parentElement;
                        itemParent.style.border = borderStyle;
                        itemParent.style.opacity = opacityValue;
                        itemParent.style.transition = fadeOutDuration;
                        if(boolDimOrHide == false){itemParent.style.display = "none";}
                        console.info('⛔ ' + i);
                        // Logging all enabled?
                        if (boolLogAll == true) {
                            console.warn(i + ' not found on page.');
                        }
                        node = '';
                    });
                }
            }
            break;
        }
        case 'www.ptorrents.com': {
            for (var i of itemsToBlock) {
                i = (i != null) ? i.toLowerCase() : '';
                i = encodeURI(i);
                allowedItems = allowedItems.map(word => word.toLowerCase()); // Makes all items lowercase
                selector = 'div > div > figcaption > h3 > a[href*="'+i+'"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                    node.forEach(function (item) {
                        item.style.color = textColor;
                        item.style.textDecoration = textDecoration;
                        let itemParent = item.parentElement.parentElement.parentElement.parentElement.parentElement;
                        itemParent.style.border = borderStyle;
                        itemParent.style.opacity = opacityValue;
                        itemParent.style.transition = fadeOutDuration;
                        if(boolDimOrHide == false){itemParent.style.display = "none";}
                        console.info('⛔ ' + i);
                        // Logging all enabled?
                        if (boolLogAll == true) {
                            console.warn(i + ' not found on page.');
                        }
                        node = '';
                    });
                }
            }
            break;
        }
        case 'ptorrents.com': {
            for (var i of itemsToBlock) {
                i = (i != null) ? i.toLowerCase() : '';
                i = encodeURI(i);
                allowedItems = allowedItems.map(word => word.toLowerCase()); // Makes all items lowercase
                selector = 'div > div > figcaption > h3 > a[href*="'+i+'"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                    node.forEach(function (item) {
                        item.style.color = textColor;
                        item.style.textDecoration = textDecoration;
                        let itemParent = item.parentElement.parentElement.parentElement.parentElement.parentElement;
                        itemParent.style.border = borderStyle;
                        itemParent.style.opacity = opacityValue;
                        itemParent.style.transition = fadeOutDuration;
                        if(boolDimOrHide == false){itemParent.style.display = "none";}
                        console.info('⛔ ' + i);
                        // Logging all enabled?
                        if (boolLogAll == true) {
                            console.warn(i + ' not found on page.');
                        }
                        node = '';
                    });
                }
            }
            break;
        }
        case 'www.naughtyblog.org': {
            for (var i of itemsToBlock) {
                i = (i != null) ? i.toLowerCase() : '';
                i = i.replace(' ','-');
                allowedItems = allowedItems.map(word => word.toLowerCase()); // Makes all items lowercase
                selector = 'div.post-header-overview > h2 > a[href*="'+i+'"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                    node.forEach(function (item) {
                        item.style.color = textColor;
                        item.style.textDecoration = textDecoration;
                        let itemParent = item.parentElement.parentElement.parentElement;
                        itemParent.style.border = borderStyle;
                        itemParent.style.opacity = opacityValue;
                        itemParent.style.transition = fadeOutDuration;
                        if(boolDimOrHide == false){itemParent.style.display = "none";}
                        console.info('⛔ ' + i);
                        // Logging all enabled?
                        if (boolLogAll == true) {
                            console.warn(i + ' not found on page.');
                        }
                        node = '';
                    });
                }
            }
            break;
        }
        case '1337x.to': {
            // New in v1.3.0
            editTitle('body > header > div > nav > ul > li.active > a', 'HOME 🧽', 'white');
            for (var i of itemsToBlock) {
                if(i)
                {
                    //i = i.toLowerCase();
                    i = i.replace(' ','-');
                }
                selector = 'table > tbody > tr > td.coll-1.name > a[href*="'+i+'"]';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                    node.forEach(function (item) {
                        item.style.color = textColor;
                        item.style.textDecoration = textDecoration;
                        let itemParent = item.closest("tr");
                        itemParent.style.border = borderStyle;
                        itemParent.style.opacity = opacityValue;
                        itemParent.style.transition = fadeOutDuration;
                        if(boolDimOrHide == false){itemParent.style.display = "none";}
                        console.info('⛔ ' + i);
                        // Logging all enabled?
                        if (boolLogAll == true) {
                            console.warn(i + ' not found on page.');
                        }
                        node = '';
                    });
                }
            }
            break;
        }
        case 'xxxclub.to': {
            // New in v1.4.0
            //editTitle('body > header > div > nav > ul > li.active > a', 'HOME 🧽', 'white');
            for (var i of itemsToBlock) {
                if(i)
                {
                    //i = i.toLowerCase();
                    i = i.replace(' ','-');
                }
                selector = 'body > div > div.middle > div.main-content > div > div.browsetablediv > div > div > ul > li > span:nth-child(2)';
                node = document.querySelectorAll(selector);
                if (node.length > 0 && !(allowedItems.includes(i))) {
                    node.forEach(function (item) {
                        if(item.innerText.includes(i))
                        {
                            item.style.color = textColor;
                            item.style.textDecoration = textDecoration;
                            let itemParent = item.parentElement;
                            itemParent.style.border = borderStyle;
                            itemParent.style.opacity = opacityValue;
                            itemParent.style.transition = fadeOutDuration;
                            if(boolDimOrHide == false){itemParent.style.display = "none";}
                            console.info('⛔ ' + i);
                            // Logging all enabled?
                            if (boolLogAll == true) {
                                console.warn(i + ' not found on page.');
                            }
                            node = '';
                        }
                    });
                }
            }
            break;
        }
    }

    console.groupEnd();

    if(boolDimOrHide === true)
    {
        console.info("Dimmed porn releases for " + window.location.hostname);
    }
    else
    {
        console.info("Hid porn releases for " + window.location.hostname);
    }

/*

CHANGELOG:
    1.5.4
    - Added more rules
    1.5.3
    - Added more rules
    1.5.2
    - Added boolean "boolRemovePornstarCollections" option that toggles removal of Pornstar Collections for https://www.naughtyblog.org
    - Added more rules
    1.5.1
    - Added allow list array for special exceptions
    - Added more rules
    1.5.0
    - Added homepage to metadata
    - Added more rules
    1.4.0
    - Fixed the search results page for : 1337x.to
    - Added support for : xxxclub.to
    - Added more rules
    1.3.0
    - Fixed document formatting using VSCode
    - Cleaned code and made the script consistent throughout
    - Fixed the incorrect and wasteful looping (should have an nice performance improvement)
    - Added support for : 1337x.to
    - Added more rules
    1.2.9
    - Added more rules
    1.2.8
    - Added more rules
    1.2.7
    - Added more meaningful console messages (logic and emoji)
    - Added more rules
    1.2.6
    - Added more rules
    1.2.5
    - Added more rules
    1.2.4
    - Added support for: naughtyblog.org
    - Fixed vertical video detection for: pxxbay.com
    - Added more rules
    1.2.3
    - Fixed encoded URI characters for ptorrents.com
    - Fixed www. prefix for ptorrents.com
    - Added more rules
    1.2.2
    - Added support for: ptorrents.com
    - Added more rules
    1.2.1
    - Added the ability to dim or hide elements (dim is the default)
    - Improved variable default value comments
    - Minor changes
    1.2
    - Added support for: pornchil.com
    - Added support for 0xxx alternative domains
    - Minor changes
    1.1.9
    - Added fadeOutDuration for smooth animation
    - Changed red border style slightly
    - Cleaned code up
    - Fixed vertical video hider for: https://www.pxxbay.com/category/movies/1080p-movies
    - Other minor changes
    1.1.7
    - Minor changes
    1.1.6
    - Minor changes
    1.1.5
    - Fixed vertical video height for pxxbay.com
    - Code cleaned up
    1.1.4
    - Improvements for: pxxbay.com
    - Improved structure of code
    - Improved handling of null value elements (not found in page)
    1.1.3
    - Fixed annoying pagination bug for: www.pxxbay.com
    - Added support for : torrentgalaxy.to
    - Added changelog to bottom of the script
    1.1.2
    - Added setting for hiding vertical videos for: https://www.hotpornfile.org
    1.1.0
    - No longer supports: xxxadulttorrent.org
    - Cleaned up code
    - Switched to just use pure JavaScript (no jquery)
    1.0.2
    - fixed @match for: https://www.hotpornfile.org/
    1.0.1
    - Fixed 'Bad pattern: missing "/" for path for: https://www.hotpornfile.org'

*/

})();