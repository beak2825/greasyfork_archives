// ==UserScript==
// @name			KOC Power Bot Light
// @namespace		PBL
// @description		All-in-One Script for Kingdoms of Camelot
// @icon			https://rycamelot1-a.akamaihd.net/fb/e2/src/img/items/70/363.jpg
// @include			*.rycamelot.com/*main_src.php*
// @include			*apps.facebook.com/kingdomsofcamelot/*
// @include			*.rockyou.com/rya/*
// @include			*facebook.com/*dialog/feed*
// @include			*rycamelot.com/*acceptToken_src.php*
// @include			*rycamelot.com/*helpFriend_src.php*
// @include			*rycamelot.com/*claimVictoryToken_src.php*
// @include			*rycamelot.com/*merlinShare_src.php*
// @exclude 	    *sharethis*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require			http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @resource		sound_files			https://greasyfork.org/scripts/399212-sound-files/code/sound_files.js
// @resource		image_files			https://greasyfork.org/scripts/399209-image-files/code/image_files.js
// @resource		champion_uniques	https://greasyfork.org/scripts/399213-champion-uniques/code/champion_uniques.js
// @resource		emoticons			https://greasyfork.org/scripts/399214-emoticons/code/emoticons.js
// @connect			*
// @connect			greasyfork.org
// @connect			raw.githubusercontent.com
// @connect			svn.code.sf.net
// @connect			kocbyte.axiomaticenigma.com
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_deleteValue
// @grant			GM_listValues
// @grant			GM_addStyle
// @grant			GM_log
// @grant			GM_getResourceText
// @grant			GM_registerMenuCommand
// @grant			GM_xmlhttpRequest
// @grant			unsafeWindow
// @run-at			document-end
// @version			1.00
// @downloadURL https://update.greasyfork.org/scripts/399215/KOC%20Power%20Bot%20Light.user.js
// @updateURL https://update.greasyfork.org/scripts/399215/KOC%20Power%20Bot%20Light.meta.js
// ==/UserScript==


var Version = '1.00';
var SourceName = "Power Bot Light";

function GlobalOptionsUpdate () { // run-once code to update Global Options
}

function OptionsUpdate () { // run-once code to update Options
}

this.jQuery = jQuery.noConflict(true);
var JSON2 = JSON;
var uW = unsafeWindow;
var Seed = uW.seed;
var CM = uW.cm;

var FFVersion = getFirefoxVersion();
var GMVersion = getGMVersion();
var NoRegEx = (FFVersion.Mozilla && (parseIntNan(FFVersion.Version) <= 16));

var http = window.location.protocol+"\/\/";
var EXTERNAL_RESOURCE = 'https://greasyfork.org/scripts/';
var KOCMON_LOGO = '';
var KOCMON_ON = false;
var GameURL = 'www.rycamelot.com';

// Global Variables

var Cities				= {};
var Tabs				= {};
var Buttons				= {};
var Images				= {};
var OpenDiv				= {};
var local_atkp			= {};
var local_atkinc		= {};
var LanguageArray		= {};
var NoTranslation		= {};
var ReportCache			= {};
var ReportDetailCache	= {};

var inc		= [];
var incCity	= [];
var out		= [];
var outCity	= [];

var mainPop;
var popDash;
var popMon;
var popInc;
var popOut;
var popBat;
var popMarch;

var SelectiveDefending = true;
var giftAccepted = false;

var Infantry	= [];
var Ranged		= [];
var Horsed		= [];
var Siege		= [];
var SpellCaster	= [];

var TTSort = [];

var GlobalEffects		= [1,2,3,4,5,6,7,17,18,19,20,21,22,23,102,103,8,9,73];

var AttackEffects		= [1,17,24,29,34,39,44,50,56,61,102,113,119,135,140];
var DefenceEffects		= [2,18,25,30,35,40,45,51,114,120,125,126,136,141];
var LifeEffects			= [3,19,26,31,36,41,46,52,104,115,121,127,128,137,142];
var RangeEffects		= [5,21,37,42,58,63,117,123,131,132,133,134,138,143];
var SpeedEffects		= [4,20,27,32,47,53,57,62,116,122,129,130];
var AccuracyEffects		= [7,23,28,33,38,43,49,55,60,65,139,144];
var OtherCombatEffects	= [8,9,118,124,13,14,15,16,73,145,147,148,149,150];
var OtherPVPEffects		= [6,22,48,54,59,64];

var DebuffEffects		= [17,18,19,20,22,21,23,29,39,50,54,61,30,40,51,31,41,52,42,63,64,32,53,62,119,120,121,122,123,124,126,128,130,132,134,140,141,142,143,144,147,149];
var AlternateSortOrder	= [5,37,58,117,131,133,138,21,42,63,123,132,134,143,1,24,34,44,56,102,113,135,17,29,39,50,61,119,140,2,25,35,45,114,125,136,18,30,40,51,120,126,141,3,26,36,46,104,115,127,137,19,31,41,52,121,128,142,4,27,47,57,116,20,32,53,62,122,129,130,7,28,38,49,60,139,23,33,43,55,65,144,8,9,118,147,148,149,150,124,13,14,15,16,73,145,6,48,59,22,54,64];
var CompositeEffects	= {147:[17,20],148:[44,45],149:[19,21],150:[113,114]};

var EffectDebuffs		= {1:17,2:18,3:19,4:20,5:21,6:22,7:23,24:29,25:30,26:31,27:32,28:33,34:39,35:40,36:41,37:42,38:43,44:50,45:51,46:52,47:53,48:54,49:55,56:61,57:62,58:63,59:64,60:65,113:119,114:120,115:121,116:122,117:123,118:124,125:126,127:128,129:130,131:132,133:134,135:140,136:141,137:142,138:143,139:144,147:147,149:149};
var DebuffOnly			= ["147","149"];

var InfantryEffects		= [24,25,26,27,28,133];
var RangedEffects		= [34,35,36,37,38,129];
var HorsedEffects		= [44,45,46,47,48,49,131,148];
var SiegeEffects		= [56,57,58,59,60,127];
var SpellcasterEffects	= [113,114,115,116,117,118,150];
var TowerEffects		= [135,136,137,138,139];

var cardQuality				= ['Simple','Common','Uncommon','Rare','Epic','Wondrous','Miraculous'];
var champImageTypes			= {0:"weapon",1:"chestArmor",2:"helmet",3:"feet",4:"shield",5:"ring1",7:"pendant",8:"cloak"};
var champUniqueImageTypes	= {0:"weapon",1:"chestArmor",2:"helmet",3:"feet",4:"shield",5:"ring",7:"pendant",8:"cloak"};
var chTypeStrings			= {0:"weapon",1:"chest",2:"helm",3:"boots",4:"shield",5:"ring",7:"pendant",8:"cloak"};
var chTypes					= ['weapon','chest','helm','boots','shield','ring1','ring2','pendant','cloak']; // must be in this order
var trTypes					= ['chair', 'advisor', 'window', 'banner', 'table', 'trophy', 'candelabrum', 'hero', 'statue', 'pet', 'tapestry', 'pillar']; // must be in this order
var cardFaction				= ['briton','fey','druid'];
var jewelTypes				= ["general_buff", "general_debuff", "unit_specific", "base_building"];
var jewelQuality			= ["cracked", "flawed", "cloudy", "subdued", "bright"];
var guardTypes				= ["wood", "ore", "food", "stone"];
var tileTypes				= {0:"Bog",10:"Grassland",11:"Lake",20:"Wood",30:"Hill",40:"Mountain",50:"Plain",51:"City",52:"Ruin",53:"Misted City",54:"Dark Forest",55:"Merc Camp",56:"Nomad Camp",57:"Megalith"};
var wildImages				= {0:"bog",10:"grasslands",11:"lake",20:"forest",30:"hills",40:"mountains",50:"plains"};
var SpellBlessings			= {1:12, 2:22, 3:32};
var SpellTypes				= {1:11, 2:21, 3:31};
var BaseChamp				= {201:30,202:0,203:7,204:27,205:27,206:60,207:4,208:3,209:3};
var SteelHoofItems			= [28119, 28120, 28121, 28122, 28123, 28124, 2812, 28510, 28638];
var LightBringerItems		= [28125, 28126, 28127, 28128, 28129, 28130, 28131, 28640];
var DragonScaleItems		= [28133, 28134, 28135, 28136, 28137, 28138, 28139, 28644];
var TestItems				= [28657, 28663, 28662, 28658, 28659, 28660, 28661, 28664];
var WildHideItems			= [28140, 28141, 28142, 28143, 28144, 28145, 28146, 28669, 28677];
var VespersItems			= [28679, 28653, 28656, 28665, 28666, 28670, 28671, 28678];
var SilverItems				= [28147, 28148, 28149, 28150, 28151, 28152, 28153, 28154, 28155];
var fortmight				= {f53:4, f55:7, f60:1, f61:2, f62:3, f63:10};
var ScoutTroops				= {3:'',46:''};

var TranslatePublish = {80:"300645083384735", 50:"275425949243301", 40:"291667064279714", 10:"286958161406148"};

var CE_EFFECT_TIERS = null;
var CE_MIGHT_RARITY_MAP = {};
var CE_MIGHT_LEVEL_MAP = {};

var ChampionStatTiers = {};

var Provinces = { // top left co-ords (origin)
	p1:{x:0,y:0},
	p2:{x:150,y:0},
	p3:{x:300,y:0},
	p4:{x:450,y:0},
	p5:{x:600,y:0},

	p6:{x:0,y:150},
	p7:{x:150,y:150},
	p8:{x:300,y:150},
	p9:{x:450,y:150},
	p10:{x:600,y:150},

	p11:{x:0,y:300},
	p12:{x:150,y:300},
	p13:{x:450,y:300},
	p14:{x:600,y:300},

	p15:{x:0,y:450},
	p16:{x:150,y:450},
	p17:{x:300,y:450},
	p18:{x:450,y:450},
	p19:{x:600,y:450},

	p20:{x:0,y:600},
	p21:{x:150,y:600},
	p22:{x:300,y:600},
	p23:{x:450,y:600},
	p24:{x:600,y:600}
}

provMapCoords = { // for province map
	imgWidth: 710,
	imgHeight: 708,
	mapWidth: 670,
	mapHeight: 670,
	leftMargin: 31,
	topMargin: 19
}

var TileOrigin = 0;
var TileOriginChecked = false;

var IMGURL = uW.stimgUrl+"img/";

var GiftText = [
	'Yeni Hediye Alındı',
	'Neues Geschenk erhalten',
	'Nouveaux Cadeaux reçus',
	'Nuevo regalo recibido',
	'Nuovo Regalo ricevuto',
	'Nieuwe cadeau ontvangen',
	'New Gift Received'
];

var HQText = ['has donated','Donations Report of your Alliance'];
var HQText2 = ['A new Temple Arcana has been activated'];

var AlertBG = IMGURL+"tower/timer_bg.png";
var GuardBG = IMGURL+"guardian_change_spritemap102.png";

var AttackImage = IMGURL+"attacking.jpg";
var ScoutImage = IMGURL+"scouting.jpg";
var ReinforceImage = IMGURL+"reinforce.jpg";
var ReassignImage = IMGURL+"autoAttack/raid_resting.png";
var TransportImage = IMGURL+"transporting.jpg";
var ReturnImage = IMGURL+"returning.jpg";
var RoseImage = IMGURL+"items/70/211.jpg";
var GauntletImage = IMGURL+"items/30/221.jpg";
var MirrorImage = IMGURL+"items/70/231.jpg";
var GlovesImage = IMGURL+"items/70/241.jpg";
var RightArrow = IMGURL+"autoAttack/across_arrow.png";
var DownArrow = IMGURL+"autoAttack/down_arrow.png";
var ThroneImage = IMGURL+"bonus_throne.png";
var PresetImage = IMGURL+"throne/modal/set_active.png";
var PresetImage_SEL = IMGURL+"throne/modal/set_selected.png";
var PresetImage_LCK = IMGURL+"throne/modal/set_locked.png";
var MistImage = IMGURL+"items/70/10021.jpg";
var DoveImage = IMGURL+"items/70/901.jpg";
var RefugeImage = IMGURL+"items/70/911.jpg";
var OrderImage = IMGURL+"items/70/912.jpg";
var	GoldImage = IMGURL+"gold_30.png";
var FoodImage = IMGURL+"food_30.png";
var WoodImage = IMGURL+"wood_30.png";
var StoneImage = IMGURL+"stone_30.png";
var OreImage = IMGURL+"iron_30.png";
var AetherImage = IMGURL+"aetherstone_30.png";
var AmberImage = IMGURL+"resource_icon_amber.png";
var ArcaneTabletImage = IMGURL+"items/70/43000.jpg";
var PopulationImage = IMGURL+"population_40.png";
var BagImage = IMGURL+"items/70/276.jpg";
var SturdyBagImage = IMGURL+"items/70/277.jpg";
var HeavyBagImage = IMGURL+"items/70/278.jpg";
var AuthorityImage = IMGURL+"items/70/285.jpg";
var DominionImage = IMGURL+"items/70/286.jpg";
var BlueEagleImage = IMGURL+"items/70/279.jpg";

var ChestImage = IMGURL+"feeds/treasurechest_icon.png";
var TokenImage = IMGURL+"feeds/merlin_magical_token.jpg";
var BuildImage = IMGURL+"feeds/new_city_outskirts.jpg";

var GameIcons = {
	goldImgTiny: '<img class=btIcon src="'+IMGURL+'chrome_icon_gold.png">',
	foodImgTiny: '<img class=btIcon src="'+IMGURL+'chrome_icon_food.png">',
	woodImgTiny: '<img class=btIcon src="'+IMGURL+'chrome_icon_wood.png">',
	stoneImgTiny: '<img class=btIcon src="'+IMGURL+'chrome_icon_stone.png">',
	oreImgTiny: '<img class=btIcon src="'+IMGURL+'chrome_icon_ore.png">',
	astoneImgTiny: '<img class=btIcon src="'+IMGURL+'chrome_icon_aetherstone.png">',
};

var ArcaneResources = {gold:0,aetherstone:5,amber:6,arcanetablet:7};
var ArcaneResourceImages = {gold:GoldImage,aetherstone:AetherImage,amber:AmberImage,arcanetablet:ArcaneTabletImage};

var TroopImagePrefix = IMGURL+"units/unit_";
var TroopImageSuffix = "_30.jpg";
var ChampImagePrefix = IMGURL+"champion_hall/championPort_0";
var ChampImageSuffix = "_50x50.jpg";
var ShieldImage = IMGURL+"items/70/362.jpg";
var	BrokenIcon = IMGURL+"throne/modal/sm_fail_overlay.png";
var	EquippedIcon = IMGURL+"throne/modal/equip.png";
var	EquippedOtherIcon = IMGURL+"champion_hall/equippedOther.png";

var LONG_BROWN_BTN = IMGURL+"button11_brown.png";
var GLORY_BACKGROUND = "";
var RAINBOW_BACKGROUND = "";
var URL_CASTLE_BUT_HOVER = "";
var THEMES;
var UniqueJewels = {};
var boxmightarray = {};
var AlertSounds = {allianceattack: 'Submarine', alert: 'Honk Honk Honk', airraid: 'Air Raid Siren'};
var WhisperSounds = {timeout: 'Arrow', monitor: 'Doorbell'};

var Smileys = {};
var ChatStyles = {'[#0]':'color:black','[#1]':'color:red','[#2]':'color:green','[#3]':'color:blue','[#4]':'color:magenta','[#5]':'color:cyan','[#6]':'color:yellow','[#7]':'color:white','[#8]':'font-weight:bold','[#9]':'font-style:italic'};
var SpeedColour = '#000';
var LinkColour = '#114684';

eval(GM_getResourceText("emoticons"));
eval(GM_getResourceText("image_files"));
eval(GM_getResourceText("sound_files"));

if (URL_CASTLE_BUT_HOVER=="") URL_CASTLE_BUT_HOVER=URL_CASTLE_BUT_SEL;

var MAP_DELAY = 2000; // 2 second map delay
var MAX_BLOCKS = 20;
var MAP_DELAY_WATCH = 0;

var DEFAULT_ALERT_SOUND_URL = EXTERNAL_RESOURCE+'RedAlert.ogg';
var DEFAULT_SCOUT_SOUND_URL = EXTERNAL_RESOURCE+'RedAlert.ogg';
var SWF_PLAYER_URL = EXTERNAL_RESOURCE+'pdxminiplayer.swf';

var SWF_PREFIX = '<object type="application/x-shockwave-flash" data="'+SWF_PLAYER_URL+'" width="90" height="20"><param name="wmode" value="transparent" /><param name="movie" value="'+SWF_PLAYER_URL+'" /><param name="flashvars" value="mp3=';
var SWF_SUFFIX = '&amp;autostart=1&amp;showtime=1" /></object>';

var AudioManager;

var HourGlasses = [1,2,3,4,5,6,7,8,10];
var HourGlassName = {};
var SpeedupArray = [60, 900, 3600, 9000, 28800, 54000, 86400, 216000, 0, 345600];
var HGLimit = [30, 301, 2701, 7201, 26101, 50431, 82831, 172800, 302400];
var HourGlassThreshold = HGLimit; // remember tabs!

var HourGlassHint = [
	'Usage Condition: 30s+',
	'Usage Condition: 5m & 1s+',
	'Usage Condition: 45m & 1s+',
	'Usage Condition: 2h & 1s+',
	'Usage Condition: 7h & 30m & 1s+',
	'Usage Condition: 14h & 30m & 1s+',
	'Usage Condition: 23h & 30m & 1s+',
	'Usage Condition: 48h+',
	'Usage Condition: 3d & 12h+',
];

var StorehouseLevels = {0:0,1:100000,2:200000,3:300000,4:400000,5:500000,6:600000,7:700000,8:800000,9:900000,10:1000000,11:5000000,12:50000000};
var	ArcaneRequirements = {};

var Filter = {
	Null:atob('rQ=='),
	Period:".",
	Space:" ",
	UnicodeLS:"&#8232;",
};

var	InitialCityId = null;
var btStartupTimer = null;
var btLoadTimer = null;
var SecondLooper = 1;
var ResetAll = false;
var RefreshingSeed = false;
var RefreshSeedInterval = 15;
var KeyTimer = null;
var LoadCheckCounter = 12;
var MinuteInterval = 60;

var presetFailures = 0;
var presetTimer = null;
var guardianFailures = 0;
var ChampionDelayer = 0;
var allianceleader = false;
var officertype = 4;
var CurrPreset = null;
var HTMLRegister = {};
var AJAX_LOG = [];

// Get element by id shortform with parent node option
function $(ID,root) {return (root||document).getElementById(ID);}

var GlobalOptions = {
	btWatchdog				: true,
	btNoMoreRy				: false,
	btWideScreenStyle		: 'normal',
	btPowerBar				: false,
	btFloatingPowerBar		: true,
	btPowerBarPopups		: true,
	btPowerBarOpen			: false,
	DashboardToggle			: true,
	btOverviewDashboardBtn	: true,
	btChatOnRight			: false,
	btChatBeforeDash		: true,
	btWideMap				: true,
	btWinSize				: {x:1000,y:100},
	btTrackOpen				: true,
	btTransparent			: false,
	AutoUpdates				: true,
	UpdateLocation			: 1, // 0 - SourceForge, 1 - Greasyfork, 2 - GitHub, 3 - nicodebelder.be, 4 - cs-hotsite
	ExtendedDebugMode		: false,
	InOutToggle				: true,
	MarchPlusToggle			: true,
	BattleToggle			: true,
	TokenEnabled			: true,
	LastTopURL				: '',
	GlobalOptionsVersion	: '0',
	ExtraTabsVersion		: '0',
	TabAutoCheck			: true,
	ExtraTabs				: [
		{"source":EXTERNAL_RESOURCE+"399089-autodf/code/AutoDF.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399090-bulkattack/code/BulkAttack.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399093-defend/code/Defend.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399095-raid/code/Raid.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399140-guardwidget/code/GuardWidget.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399139-debugtab/code/Debugtab.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399144-tournament/code/Tournament.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399141-megalith/code/Megalith.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399191-autoport/code/AutoPort.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399096-throne/code/Throne.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399092-champ/code/Champ.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399143-resources/code/Resources.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399091-boss/code/Boss.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399143-resources/code/Resources.js","data":null,"enabled":false,"lastchecked":0,"version":""},
		{"source":EXTERNAL_RESOURCE+"399094-joust/code/Joust.js","data":null,"enabled":false,"lastchecked":0,"version":""},
	],
};

var UserOptions = { // stored by facebook id
	autoPublishGamePopups		: false,
	autoCancelGamePopups		: true,
	autoPublishPrivacySetting	: 40,
	CustomPublish				: {},
	CustomListId				: "",
	TokenAuto					: false,
	OverrideRefresh				: "",
	TokenDomain					: null,
	TokenDate					: 0,
	TokenCount					: 0,
	TokenLink					: "",
	TokenCollected				: false,
	LastTokenStatus				: "",
	BuildLink					: "",
	BuildCollected				: false,
	LastBuildStatus				: "",
	ChestDomainList				: "",
	ChestCollected				: {},
	BadChestDomains				: {},
	BonusCollected				: false,
	LastChestStatus				: "",
	TreasureChest				: true,
	BankTreasureChests			: true,
	MaxBankedTreasureChests		: 500,
	TreasureChestBank			: [], // {tokenId, feedId, serverId, playerId, tileName, unixTime_taken, link}
	TreasureChestBankOther		: [],
	TokenRequest				: "",
	TokenResponse				: "",
	TokenSuccessLink			: "",
	TokenChestFeedId			: 0,
	TokenChestUID				: 0,
};

var Options = {
	MonitorOptions : {
		MonitorFontSize : 11,
		MonPresetChange : true,
		TRMonPresetByName : false,
	},
	Colors : {
		Title: '#342819',
		TitleText: '#FFFFFF',
		DividerTop: '#E9D9AE',
		DividerBottom: '#8C7D5D',
		DividerText: '#000000',
		Panel: '#F7F3E6',
		PanelText: '#000000',
		Highlight: '#FFFFCC',
		HighlightText: '#000000',
	},
	ChatOptions : {
		Colors : {
			ChatLeaders: '#B8B8B8',
			ChatGlobal: '#CCCCFF',
			ChatAll: '#99CCFF',
			ChatAtt: '#FF4D4D',
			ChatScout: '#FF8800',
			ChatRecall: '#6B8E23',
			ChatWhisper: '#FF4D4D',
			ChatVC: '#00FF00',
			ChatChancy: '#F8E151',
		},
	},
	btEveryEnable				: false,
	btEveryMins					: 30,
	btEveryToggle				: false,
	detAFK						: false,
	btWinIsOpen					: false,
	currentTab					: null,
	btWinPos					: {},
	btDashPos					: {},
	btMonPos					: {},
	btIncPos					: {},
	btOutPos					: {},
	btBatPos					: {},
	btMarchPos					: {},
	TRFixPresetWidth			: false,
	fixKnightSelect				: true,
	attackCityPicker			: true,
	dispBattleRounds			: true,
	reportDeleteButton			: true,
	fixChatTime					: true,
	gmtClock					: true,
	gmtClockType				: 0,
	MoveFurniture				: true,
	fixLoadCap					: true,
	hideOnGoto					: true,
	DontFilterTransportTroops	: true,
	MapShowExtra				: false,
	MapShowLevel				: false,
	mapInfo						: true,
	mapInfo2					: true,
	mapInfo3					: true,
	mapMenuInfo					: true,
	dispStatus					: true,
	fixPageNav					: true,
	enhancedinbox				: true,
	enhanceARpts				: true,
	enhanceViewMembers			: true,
	EnhCBtns					: true,
	DbClkDefBtns				: false,
	ColrCityBtns				: true,
	WarnAscension				: true,
	WarnAscensionInterval		: 1,
	mapCoordsTop				: true,
	fixTRAetherCost				: true,
	fixMMBImage					: true,
	OverrideAttackAlert			: true,
	FetchMarchInfo				: true,
	LoginReward					: true,
	MagicBox					: true,
	KillFairie					: true,
	MiniRefresh					: false,
	MiniRefreshInterval			: 3,
	StalledMarches				: true,
	amain						: true,
	smain						: -1,
	lmain						: 0,
	KillSounds					: true,
	KillMusic					: true,
	hideAttackEfforts			: true,
	OneClickAttack				: true,
	OneClickAttackPreset		: 0,
	AllowMultiBrowser			: false,
	PremiumAccessCode			: '',
	AFKTimeout					: 2,
	RaidRunning					: true,
	RaidLastReset				: 0,
	FreeRallySlots				: 0,
	pbGoldHappy					: 95,
	pbGoldEnable				: false,
	lastCollect					: {},
	pbFoodAlert					: false,
	pbFoodAlertInt				: 1,
	lastAlert					: {},
	countAlert					: {},
	FixMightDisplay				: true,
	MapInterval					: 5,
	TRWidget					: false,
	ThroneHUD					: false,
	DFReport					: false,
	DFReportInterval			: 1,
	LastDFReport				: 0,
	RaidToggle					: false,
	RaidButtons					: false,
	RaidDeleteButton			: false,
	presetPosition				: null,
	DraggableWidget				: true,
	coordsPosition				: null,
	DraggableCoords				: true,
	ClickForReports				: false,
	AutoMist					: false,
	AutoMistMarch				: false,
	LanguageLastChecked			: 0,
	FixCastleLag				: true,
	OpenSettingsDiv				: '',
	btDashboard					: true,
	GreenCastles				: true,
	Theme						: 'Default',
	OptionsVersion				: '0',
	AlternateSortOrder			: true,
	btFloatingDashboard			: false,
	DisableRedX					: true,
	DisableGreenTick			: false,
	ShowMarchMight				: false,
	ShowGloryMight				: true,
	ShowServerTraffic			: true,
	RemovePointlessItems		: false,
	QuickScoutTroops			: 3,
};

//** Auto Update **//

var AutoUpdater = {
	id: 999999,
	SourceForgeURL:'svn.code.sf.net/p/koc-battle-console/code/trunk/KoCPowerBotPlus.user.js',
	GreasyForkURL:'greasyfork.org/scripts/11839-koc-power-bot-plus/code/KoC%20Power%20Bot%20Plus.user.js',
	MirrorURL:'raw.githubusercontent.com/barbarossa69/PowerBotPlus/master/PowerBotPlusGitHub.user.js',
	LukeURL:'pb.kplowplow.com/PowerBotPlus/KoC_Power_Bot_Plus.user.js',
	CodeSphereURL:'barbarossa.cs-hotsite.com/PowerBotPlus/KoC_Power_Bot_Plus.user.js',
	name: 'KoC Power Bot Plus',
	homepage: 'https://www.facebook.com/PowerBotPlus',
	version: Version,
	secure: true,
	call: function(secure,response) {logit("Checking for "+tx(this.name)+" Update!"+(secure ? ' (SSL)' : ' (plain)'));
		this.secure = secure;
		var CheckURL = this.SourceForgeURL;
		if (GlobalOptions.UpdateLocation == 1) {CheckURL = this.GreasyForkURL;}
		if (GlobalOptions.UpdateLocation == 2) {CheckURL = this.MirrorURL;}
		if (GlobalOptions.UpdateLocation == 3) {CheckURL = this.LukeURL;}
		if (GlobalOptions.UpdateLocation == 4) {CheckURL = this.CodeSphereURL;}
		try {
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'http'+(secure ? 's' : '')+'://'+CheckURL,
				onload: function(xpr) {AutoUpdater.compare(xpr,response);},
				onerror: function(xpr) {if (secure) {AutoUpdater.call(false,response);} else {AutoUpdater.compare({responseText:""},response);}}
			});
		} catch (e){ logerr(e);	}
	},

	compareVersion: function(r_version, l_version) {
		var r_parts = r_version.split(''),
		l_parts = l_version.split(''),
		r_len = r_parts.length,
		l_len = l_parts.length,
		r = l = 0;
		for(var i = 0, len = (r_len > l_len ? r_len : l_len); i < len && r == l; ++i) {
			r = +(parseIntNan(r_parts[i]||0));
			l = +(parseIntNan(l_parts[i]||0));
		}
		return (r !== l) ? r > l : false;
	},

	compare: function(xpr,response) {
		this.xversion=/\/\/\s*@version\s+(.+)\s*\n/i.exec(xpr.responseText);
		if (this.xversion) this.xversion = this.xversion[1];
		else {
			if (response) {
				uW.Modal.showAlert('<div align="center">'+tx('Unable to check for updates to')+' '+tx(this.name)+'.<br>'+tx('Please change the update options or visit the')+'<br><a href="'+this.homepage+'" target="_blank">'+tx('script homepage')+'</a></div>');
			}
			logit("Unable to check for updates :(");
			return;
		}
		this.xrelnotes=/\/\/\s*@releasenotes\s+(.+)\s*\n/i.exec(xpr.responseText);
		if (this.xrelnotes) this.xrelnotes = this.xrelnotes[1];
		var updated = this.compareVersion(this.xversion, this.version);
		if (updated) {logit('New Version Available!');
			var body = '<BR><DIV align=center><FONT size=3><B>'+tx('New version')+' '+this.xversion+' '+tx('is available!')+'</b></font></div><BR>';
			if (this.xrelnotes)
				body+='<BR><div align="center" style="border:0;width:470px;height:120px;max-height:120px;overflow:auto"><b>'+tx('New Features!')+'</b><p>'+this.xrelnotes+'</p></div><BR>';

			var DownloadURL = AutoUpdater.SourceForgeURL;
			if (GlobalOptions.UpdateLocation == 1) {DownloadURL = AutoUpdater.GreasyForkURL;}
			if (GlobalOptions.UpdateLocation == 2) {DownloadURL = AutoUpdater.MirrorURL;}
			if (GlobalOptions.UpdateLocation == 3) {DownloadURL = AutoUpdater.LukeURL;}
			if (GlobalOptions.UpdateLocation == 4) {DownloadURL = AutoUpdater.CodeSphereURL;}

			body+='<BR><DIV align=center><a href="http'+(AutoUpdater.secure ? 's' : '')+'://'+DownloadURL+'" target="_blank" class="gemButtonv2 green" id="doBotUpdate">Update</a></div>';
			this.ShowUpdate(body);
		}
		else {
			logit("No updates available :(");
			if (response) {
				uW.Modal.showAlert('<div align="center">'+tx('No updates available for')+' '+tx(this.name)+' '+tx('at this time.')+'</div>');
			}
		}
	},

	check: function() {
		var now = unixTime();
		var lastCheck = 0;
		if (GM_getValue('updated_'+this.id, 0)) lastCheck = parseInt(GM_getValue('updated_'+this.id, 0));
		if (now > (lastCheck + 60*60*24)) this.call(true,false);
		GM_setValue('updated_'+AutoUpdater.id, now);
	},

	ShowUpdate: function (body) {
		var ModalBody = uWCreateObjectIn ('btModalBody',{});
		ModalBody.title = tx(this.name);
		ModalBody.body = body;
		ModalBody.closeNow = false;
		ModalBody["class"] = "Warning";
		ModalBody.curtain = false;
		ModalBody.width = 500;
		ModalBody.height =  700;
		ModalBody.left =  140;
		ModalBody.top =  140;
		exportFunction(function () { CM.ModalManager.closeAll(); },ModalBody,{defineAs:'close'});

		CM.ModalManager.addMedium(ModalBody);
		ById('doBotUpdate').addEventListener ('click', this.doUpdate, false);
	},

	doUpdate: function () {
		CM.ModalManager.closeAll();
		CM.ModalManager.close();
	},
};

var nHtml={
	FindByXPath:function(obj,xpath,nodetype) {
		if (!nodetype) { nodetype = XPathResult.FIRST_ORDERED_NODE_TYPE; }
		try { var q=document.evaluate(xpath,obj,null,nodetype,null); }
		catch (e) { GM_log('bad xpath:'+xpath); }
		if (nodetype == XPathResult.FIRST_ORDERED_NODE_TYPE) { if (q && q.singleNodeValue) { return q.singleNodeValue; }}
		else { if(q){ return q; }}
		return null;
	},

	ClickWin:function(obj,evtName) {
		var evt = window.document.createEvent("MouseEvents");
		evt.initMouseEvent(evtName, true, true, obj.ownerDocument.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		return !obj.dispatchEvent(evt);
	},

	Click:function(obj) {
		return this.ClickWin(obj,'click');
	},

	ClickTimeout:function(obj,millisec) {
		window.setTimeout(function() {
			return nHtml.ClickWin(obj,'click');
		},millisec+Math.floor(Math.random()*500));
	},

	SetSelect:function(obj,v) {
		for(var o=0; o<obj.options.length; o++) {
			if(v==obj.options[o].value) { obj.options[o].selected=true; return true; }
		}
		return false;
	},
}

// Setup Widescreen Display...

readGlobalOptions ();

GM_addStyle(".yellowBanner {background-color:#fde073;color:#000; text-align: center; line-height: 2.5; overflow: hidden; -webkit-box-shadow: 0 0 5px black; -moz-box-shadow: 0 0 5px black; box-shadow: 0 0 5px black;");
GM_addStyle(".redBanner {background-color:#a00;color:#fff;text-align: center; line-height: 2.5; overflow: hidden; -webkit-box-shadow: 0 0 5px black; -moz-box-shadow: 0 0 5px black; box-shadow: 0 0 5px black;");

if (document.URL.search(/apps.facebook.com\/kingdomsofcamelot/i) >= 0) {
	FacebookInstance ();
	HandleInlinePublishPopup ();
	LoadChecker(true);
}
else {
	if (document.URL.search(/games\/kingdoms-of-camelot\/play/i) >= 0) {
		StandAloneInstance ();
		LoadChecker(true);
	}
	else {
		if (document.URL.search(/facebook.com/i) >= 0) {
			if(document.URL.search(/dialog\/feed/i) >= 0) {
				HandlePublishPopup ();
			}
		}
		else {
			if (document.URL.search(/rycamelot.com/i) >= 0) {
				if (window.self.location != window.parent.location) { // Fix weird bug with koc game?
					if (document.URL.search(/main_src.php/i) != -1) {
						SetGameScreen ();
					}
					else {
						CheckTokenCollection();
					}
				}
			}
		}
	}
}

/** Initialise BOT **/

function PowerBotStartup () {
	clearTimeout (btStartupTimer);
	if (uW.btLoaded) return;
	var metc = getClientCoords(ById('main_engagement_tabs'));
	if (metc.width==null || metc.width==0) { // wait until page loaded
		btStartupTimer = setTimeout (PowerBotStartup, 1000);
		return;
	}

	// initialise Bot

	logit('initialising Power Bot Plus');
	PBPWatchdog();

	// set up top tabs

	var tabs=ById('main_engagement_tabs');
	if (tabs) {
		SetupMainTab(tabs);
		SetupSubTab(tabs);
	}

	readUserOptions (uW.user_id); // fb user id
	readOptions ();
	Dashboard.OptionsInit(); // always initialise dashboard options
	Options.Language = uW.g_ajaxparams.lang;
	readLanguage(Options.Language); // initially load any language settings stored in browser memory cache

	AreYouALeader();

	RefreshEvery.init ();
	RefreshEvery.box.innerHTML = '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;'+tx('Initialising PowerBot+')+' ...</b></font></span>';

	ModifyUWObjects();

	InitialiseAudioManager();

	DefaultWindowPos('btWinPos','main_engagement_tabs');
	DefaultWindowPos('btDashPos','main_engagement_tabs');

	if (GlobalOptions.btTransparent) { Opacity = 0.9; } else { Opacity = 1.0; }

	var HeadColour = 'rgba('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+',0.5)';
	if ((HEXtoRGB(Options.Colors.Panel).r*0.299) + (HEXtoRGB(Options.Colors.Panel).g*0.587) + (HEXtoRGB(Options.Colors.Panel).b*0.114) <= 100) {
		SpeedColour = '#fff';
		LinkColour = '#00ff00';
	}

	if (!Options.GreenCastles) { URL_CASTLE_BUT_SEL=URL_CASTLE_BUT_HOVER; }

	var styles = '\
		.buttonv2.std {width:123px; height:20px; line-height:20px; padding:2px 7px;} \
		.kocmain .mod_comm .comm_global .chatlist .global {background-color:transparent;}\
		table.xtab td {padding-right: 5px; border:none; background:none; white-space:nowrap;}\
		table.xtabBR td {padding-right: 5px; border:none; background:none; white-space:normal;}\
		.xtabBorder {background:none; border:1px solid #ccc; padding: 1px;}\
		.xtab {padding-right:5px; border:none; background:none; white-space:nowrap;}\
		.xtabBR {padding-right:5px; border:none; background:none; white-space:normal;}\
		.xtabHD {padding-right:5px; border-bottom:1px solid '+HeadColour+'; background:none; white-space:nowrap;font-weight:bold;font-size:11px;color:'+HeadColour+';margin-left:10px;margin-right:10px;margin-top:5px;margin-bottom:5px;vertical-align:text-top;align:left}\
		.xtabHDDef {padding-right: 5px; border-bottom:1px solid '+HeadColour+'; background:none; white-space:nowrap;font-weight:bold;font-size:11px;color:#f00;margin-left:10px;margin-right:10px;margin-top:5px;margin-bottom:5px;vertical-align:text-top;align:left}\
		.xtabBRTop {padding-right: 5px; border:none; background:none; white-space:normal; vertical-align:top;}\
		.xtabH {background:'+Options.Colors.Panel+'; border:none; padding-right: 5px; padding-left: 5px; margin-left:10px;}\
		.xtabHL {background:'+Options.Colors.Panel+'; border-width: 1px; border-style: none none none solid; padding-right:5px; padding-left:5px; margin-left:10px;}\
		.xtabL {background:none; border-width: 1px; border-style: none none none solid; padding-right:5px; padding-left: 5px; margin-left:10px;}\
		.xtabLine {padding:0px; spacing:0px; height:1px; border-color:black; border-width: 1px; border-style: none none solid none;}\
		a.xlink {color:'+LinkColour+' !important;}\
		table.xtab td.xtabTotal {border-bottom:1px solid '+HeadColour+'; border-top:1px solid '+HeadColour+';}\
		tr.btPopupTop td {background-color:'+Options.Colors.Title+'; border:1px solid #000000; height: 21px; padding:0px; color:'+Options.Colors.TitleText+';}\
		.btPopMain {background-color:'+Options.Colors.Panel+'; border:1px solid #000000; -moz-box-shadow:inset 0px 0px 10px #6a6a6a; -moz-border-radius-bottomright: 20px; -moz-border-radius-bottomleft: 20px; border-bottom-right-radius: 20px; border-bottom-left-radius: 20px; font-size:11px; color:'+Options.Colors.PanelText+'}\
		.btMonitor_btPopMain {font-size:'+Options.MonitorOptions.MonitorFontSize+'px;}\
		.btPopup {border:5px ridge #666; opacity:'+Opacity+'; -moz-border-radius:25px; border-radius:25px; -moz-box-shadow: 1px 1px 5px #000000;}\
		.btReportPopup_btPopMain {font-size:12px;}\
		.btSelector {font-size:11px;}\
		.btInput {font-size:10px;}\
		.AlertStyle {background:url("'+AlertBG+'") no-repeat left;}\
		.AlertContent {border:none; background:none; white-space:nowrap;font:bold 11px Georgia;color:#551000;text-align:left;height:13px;}\
		.AlertLink {text-decoration:none;color:#ecddc1;text-shadow: 0px 0px 15px #000;}\
		.TextLink {text-decoration:none;}\
		.TextLink:Hover {text-decoration:none;}\
		.TextLink:Active {text-decoration:none;}\
		.divHide {display:none}\
		.divHeader {border:0px solid; border-color:#000000; background: -moz-linear-gradient(top,'+Options.Colors.DividerTop+','+Options.Colors.DividerBottom+'); background: -webkit-linear-gradient(top,'+Options.Colors.DividerTop+', '+Options.Colors.DividerBottom+'); -moz-border-radius:5px; height: 16px;border-bottom:0px solid #000000;font-weight:bold;font-size:11px;opacity:0.75;margin-left:0px;margin-right:0px;margin-top:1px;margin-bottom:0px;padding-top:4px;padding-right:10px;padding-left:4px;vertical-align:text-top;align:left; color:'+Options.Colors.DividerText+';}\
		.btButton:Hover {color:#FFFF80;}\
		.oddRow {height:20px;background: rgba(0,0,0,0.05);}\
		.evenRow {height:20px;background: rgba(0,0,0,0);}\
		.highRow {height:20px;font-weight:bold;background-color:'+Options.Colors.Highlight+';color:'+Options.Colors.HighlightText+';}\
		.totalCell {background-color:'+Options.Colors.Highlight+';color:'+Options.Colors.HighlightText+'}\
		.divLink {color:#000;text-decoration:none;}\
		.divLink:Hover {color:#000;text-decoration:none;}\
		.divLink:Active {color:#000;text-decoration:none;}\
		.castleBut {outline:0px; margin-left:0px; margin-right:0px; width:23px; height:25px; font-size:12px; font-weight:bold;}\
		.castleBut:hover {background:url("'+URL_CASTLE_BUT_HOVER+'") no-repeat center center;}\
		.castleButNon {background:url("'+URL_CASTLE_BUT+'") no-repeat center center;}\
		.castleButSel {background:url("'+URL_CASTLE_BUT_SEL+'") no-repeat center center;}\
		.castleButBack {background-color:#f00;display:inline-block;width:23px; height:25px;}\
		.trimg:hover span.trtip {display:block; opacity: 1.0; z-index:999999; font-size:11px; text-align:left; position:absolute; background: #FFFFAA; color: #000; border: 1px solid #FFAD33; padding: 0.5em 0.5em;}\
		.trimg span.trtip {display:none;}\
		.trimg span.trtip:hover {display:none;}\
		.presetBut {outline:0px; margin-left:0px; margin-right:0px; width:22px; height:22px; font-family: georgia,arial,sans-serif;font-size: 12px;color:white; line-height:19px;}\
		.presetButNon {background:url("'+PresetImage+'") no-repeat center center;}\
		.presetButLck {background:url("'+PresetImage_LCK+'") no-repeat center center;}\
		.presetButSel {background:url("'+PresetImage_SEL+'") no-repeat center center;}\
		.presetButDis {opacity: 0.4;}\
		.guardBut {outline:0px; margin-left:0px; margin-right:0px; width:31px; height:33px; font-family: georgia,arial,sans-serif;line-height:52px;font-size:11px;font-weight:bold;color:#fff;text-shadow: 1px 1px 2px #000,-1px -1px 2px #000; background: url("'+GuardBG+'") no-repeat scroll 0% 0% transparent; background-size:350px;}\
		.guardButNon {border: 2px solid transparent;}\
		.guardButSel {border: 2px solid blue;}\
		.champBut {outline:0px; margin-left:0px; margin-right:0px; width:31px; height:33px; font-family: georgia,arial,sans-serif;line-height:52px;font-size:11px;font-weight:bold;color:#fff;text-shadow: 1px 1px 2px #000,-1px -1px 2px #000;}\
		.champButNon {border: 2px solid transparent;}\
		.champButSel {border: 2px solid green;}\
		.champButMarch {border: 2px solid red;}\
		.ptChatAttack {color: #000; font-weight:bold; background-color:'+Options.ChatOptions.Colors.ChatAtt+';}\
		.ptChatScout {color: #000; font-weight:bold; background-color:'+Options.ChatOptions.Colors.ChatScout+';}\
		.ptChatRecall {color: #000; font-weight:bold; background-color:'+Options.ChatOptions.Colors.ChatRecall+';}\
		.ptChatWhisper {font-weight:bold; color:'+Options.ChatOptions.Colors.ChatWhisper+';}\
		.ptChatAlliance {background-color:'+Options.ChatOptions.Colors.ChatAll+';}\
		.ptChatGlobal {background-color:'+Options.ChatOptions.Colors.ChatGlobal+';}\
		.ptChatBold {font-weight:bold}\
		.ptChatGlobalAll {font-weight:bold;background-color:'+Options.ChatOptions.Colors.ChatGlobal+';}\
		.ptChatIcon {border: 1px inset black}\
		.ptChatCHAN {color:#000; background-color:'+Options.ChatOptions.Colors.ChatChancy+';}\
		.ptChatVICE {color:#000; background-color:'+Options.ChatOptions.Colors.ChatVC+';}\
		.ptChatOFFI {color:#000; background-color:'+Options.ChatOptions.Colors.ChatLeaders+';}\
		.ptChatGLORY {background-image: url('+GLORY_BACKGROUND+'); background-size: 40px 33px; background-position: right bottom; background-repeat: no-repeat; min-height:65px; }\
		.ptChatRAINBOW {background-image: url('+RAINBOW_BACKGROUND+'); background-size: 280px 1px; background-position: left top; background-repeat: repeat-y; }\
		table.ptTab tr td {border:none; background:none; white-space:nowrap;}\
		.whiteOnRed {padding-left:3px; padding-right:3px; background-color:#f00; color:white; font-weight:bold}\
		.whiteOnGreen {padding-left:3px; padding-right:3px; background-color:#080; color:white; font-weight:bold}\
		span.boldRed {color:#800; font-weight:bold}\
		span.boldOrange {color:#F80; font-weight:bold}\
		span.boldGreen {color:#080; font-weight:bold}\
		span.boldMagenta {color:#808; font-weight:bold}\
		.kocHeader .timeAndDomain {margin: 13px 0px 0px -5px;}\
		.kocmain .mod_maparea .mod_citylist .city_warning{background: url('+URL_CASTLE_WARN+') no-repeat; margin-top: 4px;}\
		.btExpander {background:none; -moz-border-radius-bottomright: 20px; -moz-border-radius-topright: 20px; border-bottom-right-radius: 20px; border-top-right-radius: 20px;}\
		.btBackExpander {background:none; -moz-border-radius-bottomleft: 20px; -moz-border-radius-topleft: 20px; border-bottom-left-radius: 20px; border-top-left-radius: 20px;}\
		.tooldesc:hover span.tooltip {display:block; position:absolute; color: #000000; background: #FFFFAA; border: 1px solid #FFAD33; padding: 0.5em 0.5em;}\
		.tooldesc span.tooltip {display:none;}\
		.tooldesc span.tooltip:hover {display:none;}\
		.flip {-webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); transform: rotate(180deg);}\
		.smileyimage {width:17px !important;height:17px !important;float:none !important;}\
		.wrap {white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;}\
		.ui-tabs { padding: 0px; background: transparent; border-width: 0px; }\
		.ui-tabs .ui-tabs-nav { padding-left: 0px; background: transparent; border-width: 0px 0px 1px 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; }\
		.ui-tabs li.ui-tabs-active { border-width: 1px 1px 0px 1px; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; background-color:'+Options.Colors.Panel+'; }\
		.ui-tabs .ui-tabs-panel { border-width: 0px 0px 0px 1px; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; font-family: georgia,arial,sans-serif; font-size:11px; }\
		.ui-tabs .ui-state-active { background: none;}\
		.ui-widget-content a { color: #fff; }\
		.buttonv2.purple { background: -moz-linear-gradient(center top , #F0F, #808 100%) repeat scroll 0% 0% transparent; background: -webkit-linear-gradient(top , #F0F, #808 100%) repeat scroll 0% 0% transparent; }\
		.buttonv2.purple:hover { background: -moz-linear-gradient(center top , #FF44FF, #A044A0 100%) repeat scroll 0% 0% transparent; background: -webkit-linear-gradient(top , #FF44FF, #A044A0 100%) repeat scroll 0% 0% transparent; }\
		.buttonv2.orange { background: -moz-linear-gradient(center top , #FF8000, #FF4500 100%) repeat scroll 0% 0% transparent; background: -webkit-linear-gradient(top , #FF8000, #FF4500 100%) repeat scroll 0% 0% transparent; }\
		.buttonv2.orange:hover { background: -moz-linear-gradient(center top , #FFB045, #FF8045 100%) repeat scroll 0% 0% transparent; background: -webkit-linear-gradient(top , #FFB045, #FF8045 100%) repeat scroll 0% 0% transparent; }\
		.btIcon { vertical-align:text-bottom; }\
		.btTop { vertical-align:text-top; }\
		.btFaint { opacity:0.8; }\
		div.ErrText {color:#FF0000;}';

	GM_addStyle("a.inlineButton.brown11 span {background: url("+LONG_BROWN_BTN+") no-repeat scroll left top transparent; !important}");
	GM_addStyle(".castleBut.defending {border-top: 2px; border-bottom: 2px; border-left: 2px; border-right: 2px; border-style: ridge; border-color: red;}");
	GM_addStyle(".castleBut.hiding {border-top: 2px; border-bottom: 2px; border-left: 2px; border-right: 2px; border-style: ridge; border-color: rgb(229, 221, 201);}");
	GM_addStyle(".castleBut.attack {opacity: 0.6;}");
	GM_addStyle("#directory_tabs {background: -moz-linear-gradient(center top , rgba(0,0,0,0) 50%, #1B64CB 55%, #163665 100%) repeat scroll 0% 0% transparent}");
	GM_addStyle('div.rored {color:#fff !important}');

	if (Options.ShowServerTraffic) {
		if (ById('kochead_time')) {
			var newdiv = document.createElement('div');
			newdiv.innerHTML = tx('Server Traffic')+':&nbsp;<span style="font-weight:bold;text-shadow:black 0.1em 0.1em 0.2em;" id=btTraffic>&nbsp;</span>';
			ById('kochead_time').parentNode.parentNode.appendChild(newdiv);
			ByCl('timeAndDomain')[0].style.marginTop = '4px';
			ByCl('avatarInfo')[0].style.marginTop = '10px';
		}
	}

	// fix game strings

	if(uW.g_js_strings) {
		uW.g_js_strings.commonstr.yourScriptVersionIsOut = uW.g_js_strings.checkoutofdate.reloadconfirm; // more meaningful!!
		if (uW.cm.thronestats && uW.cm.thronestats.boosts && uW.cm.thronestats.boosts.Speed) {
			uW.cm.thronestats.boosts.Speed.BoostName = uW.g_js_strings.throneRoom.effectName_4; // change speed to combat speed in TR Caps
		}
	}

	var gg = ByCl('gem_gifting');
	if(gg.length > 0) for(var g = 0; g < gg.length;g++) gg[g].style.display = 'none';

	if (!GlobalOptions.btPowerBar) {
		AddMainTabLink(tx('POWERBOT+'), 'PBPButton', eventHideShow, mouseMainTab);
	}

	/* add all effects to alternate sort order */

	for (k in uW.cm.thronestats.tiers) {
		if (AlternateSortOrder.indexOf(parseInt(k)) == -1) { AlternateSortOrder.push(parseInt(k)); }
	}

	setCities();

	if (ArcanaEnabled()) {
		for (var l=1;l<=parseIntNan(Seed.allianceHQ.buildings[3].buildingLevel);l++) {
			for (var ll in Seed.arcaneRequirements[l]) {
				if (Seed.arcaneRequirements[l][ll].isAvailable) {
					ArcaneRequirements[ll] = JSON2.parse(JSON2.stringify(Seed.arcaneRequirements[l][ll]));
				}
			}
		}
	}
	if (!Seed.arcanaApothecaryBuffValue) { Seed.arcanaApothecaryBuffValue = 0; }
	if (!Seed.arcanaAetherstoneCapBuffValue) { Seed.arcanaAetherstoneCapBuffValue = 0; }

	/* set initial city ID (for city selectors in all the panels and tabs, NOT Dashboard!) */

	InitialCityId = uW.currentcityid;
	if (Options.amain) {
		if (Options.smain == -1) {
			if (Cities.cities[Options.lmain]) { InitialCityId = Cities.cities[Options.lmain].id; }
		}
		else {
			if (Cities.cities[Options.smain]) { InitialCityId = Cities.cities[Options.smain].id; }
		}
	}

	setTroops();
	SelectiveDefending = uW.g_serverType != CM.SERVER_TYPES.PVP;
	CE_EFFECT_TIERS = CM.WorldSettings.getSettingAsObject("CE_EFFECTS_TIERS");

	for (var i in ScoutTroops) {
		ScoutTroops[i] = uW.unitnamedesctranslated['unt'+i][0];
	}

	var effectTiers = CE_EFFECT_TIERS;
	var effObjSize=0,effsplit={},basegrowth={};
	for (var k in effectTiers) {
		effsplit=effectTiers[k]["Id_Tier"].split(",");
		ChampionStatTiers[''+effsplit[0]]={};
	}
	for (var k in effectTiers) {
		effsplit=effectTiers[k]["Id_Tier"].split(",");
		basegrowth={};
		basegrowth['base']=effectTiers[k]["Base"];
		basegrowth['growth']=effectTiers[k]["Growth"];
		ChampionStatTiers[''+effsplit[0]][''+effsplit[1]]=basegrowth;
	}

	CE_MIGHT_RARITY_MAP = CM.WorldSettings.getSettingAsObject("CE_MIGHT_RARITY_MAP");
	CE_MIGHT_LEVEL_MAP = CM.WorldSettings.getSettingAsObject("CE_MIGHT_LEVEL_MAP");

	for (var h=0;h<HourGlasses.length;h++) { HourGlassName[HourGlasses[h]] = uW.itemlist['i'+HourGlasses[h]].name; }

	WideScreen.init ();
	WideScreen.setPowerBar (GlobalOptions.btPowerBar,GlobalOptions.btPowerBarOpen);
	WideScreen.setChatOnRight (GlobalOptions.btChatOnRight);
	WideScreen.useWideMap (GlobalOptions.btWideMap);

	function CloseMainTab () {
		tabManager.hideTab();
		Options.btWinIsOpen=false;
		saveOptions();
	}

	mainPop = new CPopup ('btMain', Options.btWinPos.x, Options.btWinPos.y, GlobalOptions.btWinSize.x, 100 , true, CloseMainTab);
	mainPop.getMainDiv().innerHTML = '<STYLE>'+ styles +'</style>';

	WideScreen.setDashboard (Options.btDashboard); // do after styles added ^^

	// Load in Additional/Optional Tabs

	var NewVersion = false;
	if (!GlobalOptions.ExtraTabsVersion || AutoUpdater.compareVersion(Version, GlobalOptions.ExtraTabsVersion)) {
		NewVersion = true;
		GlobalOptions.ExtraTabsVersion = Version;
		saveGlobalOptions();
	}

	CheckDelay = 0;
	for (var e in GlobalOptions.ExtraTabs) {
		if (GlobalOptions.ExtraTabs[e].enabled) {
			try {
				eval(atob(GlobalOptions.ExtraTabs[e].data));
			} catch (err){ logerr(err);}
			if (GlobalOptions.TabAutoCheck) {
				var now = unixTime();
				if (NewVersion || (!GlobalOptions.ExtraTabs[e].lastchecked || GlobalOptions.ExtraTabs[e].lastchecked + (3600*24*3) < now)) { // only check for new tabs once every 3 days, or if main script version changes
					CheckDelay++;
					setTimeout(Tabs.Options.TabLoad,(CheckDelay*1250),e,true);
				}
			}
		}
	}

	// Basic initialisation complete - Now let each tab initialise itself...

	tabManager.init (mainPop.getMainDiv());

	Incoming.init();
	Outgoing.init();
	QuickMarch.init();
	Battle.init();
	QuickScout.init();

	// check token response

	Tabs.Options.CheckTokenResponse();

	if (GlobalOptions.DashboardToggle) {
		AddPowerBarLink(tx('Dashboard'), 'PBPDashButton', function() { WideScreen.ShowDashboard(!Options.btDashboard);}, function(me) { if (Options.btFloatingDashboard) ResetWindowPos (me,'main_engagement_tabs',popDash);});
	}

	if (Options.btWinIsOpen && GlobalOptions.btTrackOpen){
		mainPop.show (true);
		tabManager.showTab(true);
	}

	// fix leaderboard display so you can always see might leaderboard even if glory leaderboard returns no results!

	var lbfix = new CalterUwFunc("modal_fow_leaderboard",[['e.emptySet','false']]);
	lbfix.setEnable(true);

	// Set to check for updates in 15 seconds

//	if (GlobalOptions.AutoUpdates) setTimeout(function(){AutoUpdater.check();},15000);

	// start main looper

	afkdetector.init();
	SecondTimer = setTimeout(EverySecond,0);

	// TEMP FIX FOR REPORTS

	var rptfix = new CalterUwFunc('Messages.deleteCheckedReports', [['MessagesController', 'MessageController']]);
	rptfix.setEnable(true);

	// UPDATE_SEED_AJAX IS CRASHING OUT IN UPDATE_MARCH SOMETIMES - THIS IS BAD, SO PUT A TRY-CATCH AROUND IT.

	t.updateseedfix = new CalterUwFunc('update_seed_ajax', [
		[/if\s*\(typeof\s*isCancelTraining/im, 'var l_lastCallTime = cm.l_lastCallTime; var reload_requests = cm.reload_requests; var l_callIntervalMin = cm.l_callIntervalMin; if(typeof isCancelTraining'],
		[/update_march\(rslt.updateMarch\)/im, 'try {update_march(rslt.updateMarch);} catch (V) {}'],
	]);
	t.updateseedfix.setEnable(true);

	// initialisation complete!

	uW.btLoaded = true;
	LoadChecker(false);
	window.addEventListener('beforeunload', onUnload, false);
	RefreshEvery.box.innerHTML = '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;PowerBot+ Initialised!</b></font></span>';
	actionLog('Power Bot Plus ('+Version+') successfully initialised');
}

function RememberWindowPositions() {
	Options.btWinPos = mainPop.getLocation();
	if (popDash && Options.btFloatingDashboard) { Options.btDashPos = popDash.getLocation(); }
	if (popMon) { Options.btMonPos = popMon.getLocation(); }
	if (popInc) { Options.btIncPos = popInc.getLocation(); }
	if (popOut) { Options.btOutPos = popOut.getLocation(); }
	if (popBat) { Options.btBatPos = popBat.getLocation(); }
	if (popMarch) { Options.btMarchPos = popMarch.getLocation(); }
}

function onUnload (){
	if (uW.btLoaded) {
		Options.lmain = Cities.byID[uW.currentcityid].idx;
		RememberWindowPositions();
		if (!ResetAll) {
			saveGlobalOptions();
			saveUserOptions(uW.user_id);
			saveOptions();
		}
	}
	// clear down uW Objects on unload??
	if (uW.cpopupWins) uW.cpopupWins = null;
	if (uW.calterRegistry) uW.calterRegistry = null;
	if (uW.uWFunc) uW.uWFunc = null;
}

/** uW Modifiers **/

function ModifyUWObjects () {

	function DoveOfPeace (iid) {
		// popup
		ModalMultiButton({	buttons: [	{ txt: tx("Use Dove of Peace"), exe: function () {uW.Modal.hideModal();UseDove(iid);}},
			{ txt: tx("Cancel Request"), exe: function () {uW.Modal.hideModal();}}],
			body: "<center> "+tx('Please confirm you want to use a Dove of Peace')+"?</center>",
			title: tx("Confirm Dove")
		});
	};

	function ShowCity (idx) {
		SelectCity(idx);
		uW.changeview_city(ById("mod_views_city"));
		uW.btChangeDashCity(uW.currentcityid);
	}

	function ShowKnightsHall (city) {
		if (OpenBuilding(city+1,"7")) {
			uW.changeKnightModalTabs(1);
		}
	}

	function ShowGuardians(city) {
		SelectCity(city+1);
		CM.guardianModalModel.open();
	}

	function ShowEmbassy (city) {
		OpenBuilding(city+1,"8");
	}

	function ShowWalls (city) {
		SelectCity(city+1);
		if (Seed.buildings["city" + uW.currentcityid].pos1) { uW.modal_build(1); }
		else { uW.modal_buildnew(1); }
	}

	function SendAllHome (cityId) {
		jQuery('#btSendAllHome').addClass("disabled");
		Dashboard.serverwait = true;
		var Returns = [];
		Returns = Dashboard.Reins.slice();
		var delayer = 0;
		for (var r in Returns) {
			var mid = Returns[r];
			delayer = delayer + 1;
			setTimeout (Dashboard.SendHome,(500*delayer),mid); // spread them out ...
		}
		delayer = delayer + 1;

		function ClearAtEnd () {
			jQuery('#btSendAllHome').removeClass("disabled");
			Dashboard.serverwait = false;
		};

		setTimeout (ClearAtEnd,(500*delayer)); // let screen updates run again
	}

	function CreateChampionPopUp (elem,chkcityId,localchamp,champid,maparea,cityinfo) {
		effects = ById(elem.id+'effects');
		// do a compare, or get local champ details...
		if (Options.DashboardOptions.ChampionCompare || localchamp) {
			var oureffects = '<table cellspacing=0 style="background-color:none;"><tr><td class=xtab><b><center><br>'+uW.g_js_strings.champ.no_champ+'<br>'+tx('Assigned')+'!</center></b></td></tr></table>';

			try {
				for (var y in Seed.champion.champions) {
					chkchamp = Seed.champion.champions[y];
					if (chkchamp.assignedCity && !Cities.byID[chkchamp.assignedCity]) { chkchamp.assignedCity = 0; }
					if (chkchamp.championId) {
						if ((!champid && chkchamp.assignedCity == chkcityId) || (chkchamp.championId == champid)) {
							var status = '';
							var champstatus = chkchamp.status;
							if (maparea) {
								if (champstatus != "10") { status = ' ('+tx('Defending')+')'; }
								else { status = ' ('+tx('Marching')+')'; }
							}
							else {
								if (cityinfo) {
									var status = '</b><br><i>';
									if (chkchamp.assignedCity==0) { status += tx('Unassigned')+'</i>'; }
									else {
										if (champstatus != "10") { status += tx('Defending')+' '; }
										else { status += tx('Marching from')+' '; }
										status += Cities.byID[chkchamp.assignedCity].name+'</i>';
									}
								}
							}
							oureffects = '<table cellspacing=0 class=xtab><tr><td colspan=2><b>'+chkchamp.name+status+'</b></td></tr><tr><td colspan=2><b>'+uW.g_js_strings.report_view.champion_stats+'</b></td></tr>';

							// equipped items

							var CHAMP_DATA = BuildChampData (uW.kocChampionItems,chkchamp.championId);
							var equippedchampstats = CHAMP_DATA.equippedchampstats;
							var equippedtroopstats = CHAMP_DATA.equippedtroopstats;
							var equippedbossstats = CHAMP_DATA.equippedbosstats;
							var SteelHoofCount = CHAMP_DATA.SteelHoofCount;
							var LightBringerCount = CHAMP_DATA.LightBringerCount;
							var DragonScaleCount = CHAMP_DATA.DragonScaleCount;
							var TestCount = CHAMP_DATA.TestCount;
							var WildHideCount = CHAMP_DATA.WildHideCount;
							var VespersCount = CHAMP_DATA.VespersCount;
							var SilverCount = CHAMP_DATA.SilverCount;

							var gotchamp = false;
							for (var k in equippedchampstats) {
								gotchamp = true;
								str = uW.g_js_strings.effects['name_'+k];
								var chEffect = getChampCappedValue(k,equippedchampstats[k]);
								if (k>= 300) {
									if (k==314) { str = tx('Add. Defend Bonus'); }
									else { str = tx('Inc. Bonus')+' '+str.split(" "+tx("equipment"))[0]; }
									var champvalue = +((chEffect*100).toFixed(2))+"%";
								}
								else {
									var champvalue = +(chEffect.toFixed(2));
								}
								if (str && str!= "") { oureffects+="<tr><td>"+str+"</td><td>"+champvalue+"</td></tr>"; }
							}
							if (VespersCount >= 4) {
								gotchamp = true;
								oureffects+="<tr><td>"+uW.g_js_strings.champ.vespers+": "+uW.g_js_strings.champ.damage+"</td><td>"+CM.CHAMPION.getVespersDamageSetBonus().replace('+','')+"</td></tr>";
							}

							if (!gotchamp) { oureffects += '<tr><td colspan=2><i>None Available</i></td></tr>'; }
							oureffects+="<tr><td colspan=2><b>"+uW.g_js_strings.report_view.troop_stats+"</b></td></tr>";
							var gottroops = false;
							if ((SteelHoofCount >= 4 && LightBringerCount >= 5) || (DragonScaleCount >= 6 && LightBringerCount >= 5)) {
								gottroops = true;
								if (SteelHoofCount >= 4 && LightBringerCount >= 5) {
									oureffects+="<tr><td>"+uW.g_js_strings.champ.doubleBonus+": "+uW.g_js_strings.champ.attackRange+"</td><td>"+CM.CHAMPION.getSteelhoofsRangeSetBonus().replace('+','')+"</td></tr>";
								}
								else {
									oureffects+="<tr><td>"+uW.g_js_strings.champ.doubleBonus+": "+uW.g_js_strings.champ.attackLife+"</td><td>"+CM.CHAMPION.getSteelhoofsRangeSetBonus().replace('+','')+"</td></tr>";
								}
							} else {
								if (SteelHoofCount >= 4 || DragonScaleCount >= 6) {
									gottroops = true;
									if (SteelHoofCount >= 4) {
										oureffects+="<tr><td>"+uW.g_js_strings.champ.steelhoofsBonus+": "+uW.g_js_strings.champ.range+"</td><td>"+CM.CHAMPION.getSteelhoofsRangeSetBonus().replace('+','')+"</td></tr>";
									}
									else {
										oureffects+="<tr><td>"+uW.g_js_strings.champ.dragonscalesBonus+": "+uW.g_js_strings.champ.life+"</td><td>"+CM.CHAMPION.getSteelhoofsRangeSetBonus().replace('+','')+"</td></tr>";
									}
								} else {
									if (LightBringerCount >= 5) {
										gottroops = true;
										oureffects+="<tr><td>"+uW.g_js_strings.champ.lightbringersBonus+": "+uW.g_js_strings.champ.attack+"</td><td>"+CM.CHAMPION.getLightbringersRangeSetBonus().replace('+','')+"</td></tr>";
									}
									else {
										if (WildHideCount >= 5) {
											gottroops = true;
											oureffects+="<tr><td>"+uW.g_js_strings.champ.wildhideBonus+": "+uW.g_js_strings.champ.attack+"</td><td>"+CM.CHAMPION.getWildhideAttackSetBonus().replace('+','')+"</td></tr>";
										}
										else {
											if (SilverCount >= 5) {
												gottroops = true;
												oureffects+="<tr><td>"+uW.g_js_strings.champ.silver+": "+uW.g_js_strings.champ.silverKnightBonus+"</td><td>"+CM.CHAMPION.getSilverknightSpeedDefenceSetBonus().replace('+','')+"</td></tr>";
											}
										}
									}
								}
							}
							for (var k in equippedtroopstats) {
								gottroops = true;
								str = uW.g_js_strings.effects['name_'+k];
								if (str && str!= "") {
									var chEffect = getChampCappedValue(k,equippedtroopstats[k]);
									oureffects+="<tr><td>"+str+"</td><td>"+(Math.round(chEffect*100)/100)+"</td></tr>";
								}
							}
							if (!gottroops) { oureffects += '<tr><td colspan=2><i>None Available</i></td></tr>'; }
							for (var k in equippedbossstats) {
								var gotboss = false;
								var bosseffects = '';
								for (var kk in equippedbossstats[k]) {
									gotboss = true;
									str = uW.g_js_strings.effects['name_'+kk];
									if (str && str!= "") {
										var chEffect = getChampCappedValue(kk,equippedbossstats[k][kk]);
										var champvalue = +(chEffect.toFixed(2))+"%";
										bosseffects+="<tr><td>"+str+"</td><td>"+champvalue+"</td></tr>";
									}
								}
								if (gotboss) { oureffects += "<tr><td colspan=2><b>"+uW.itemlist['i'+k].name+' '+uW.g_js_strings.commonstr.stats+"</b></td></tr>"+bosseffects; }
							}
							oureffects+="</table>";
						}
					}
				}
			}
			catch (err) {
				logerr(err); // write to log
				oureffects = '<table cellspacing=0><tr><td class=xtab><b><center>'+tx('Error reading champion data')+'</center></b></td></tr></table>';
			}
		}

		td = ById(elem.id+'td');
		jQuery('#'+td.id).children("span").remove();
		if (maparea) {
			uW.showTooltip(oureffects,td,null,'mod_maparea');return;
		}
		else {
			if (localchamp) {
				jQuery('#'+td.id).append('<span class="trtip"><table cellspacing=0><tr style="vertical-align:top;"><td class=xtab>'+oureffects+'</td></tr></table></span>');
			}
			else {
				if (Options.ChampionCompare) {
					jQuery('#'+td.id).append('<span class="trtip"><table cellspacing=0><tr style="vertical-align:top;"><td class=xtab>'+effects.value+'</td><td class=xtab>'+oureffects+'</td></tr></table></span>');
				}
				else {
					jQuery('#'+td.id).append('<span class="trtip">'+effects.value+'</span>');
				}
			}
		}
	}

	function ChangeDashCity(city) {
		Dashboard.show(Cities.byID[city]);
	}

	function StopProp (e) {
		e.stopPropagation();
	}

	function CityChanged () {
		if (popDash) uW.btChangeDashCity(uW.currentcityid);
		Options.lmain = Cities.byID[uW.currentcityid].idx;
		saveOptions();
		SetChampionIcon();
	}

	uWExportFunction('btArthurCheck',function(a) { logit('arthurCheck intercepted'); return; });
	uW.arthurCheck = uW.btArthurCheck;

	uWExportFunction('pthideMe', hideMe);
	uWExportFunction('ptStopProp', StopProp);
	uWExportFunction ('btDoveOfPeace', DoveOfPeace);
	uWExportFunction ('btShowCity', ShowCity);
	uWExportFunction ('btGotoMapHide', GotoMapHide);
	uWExportFunction ('btGotoMap', GotoMap);
	uWExportFunction ('btGotoMapRpt', GotoMapRpt);
	uWExportFunction ('btShowKnightsHall', ShowKnightsHall);
	uWExportFunction ('btShowGuardians', ShowGuardians);
	uWExportFunction ('btShowEmbassy', ShowEmbassy);
	uWExportFunction ('btShowWalls', ShowWalls);
	uWExportFunction ('btSendAllHome', SendAllHome);
	uWExportFunction ('btCreateChampionPopUp', CreateChampionPopUp);
	uWExportFunction ('btDashboardButtonClick', WideScreen.ShowDashboard);
	uWExportFunction ('btChangeDashCity', ChangeDashCity);

	uWExportFunction ('btStartKeyTimer', StartKeyTimer);
	uWExportFunction ('btSelectTroopType', Dashboard.SelectTroopType);
	uWExportFunction ('btSetRitualLength', Dashboard.SetRitualLength);
	uWExportFunction ('btCheckDefaultRitual', Dashboard.CheckDefaultRitual);
	uWExportFunction ('btStartRitual', Dashboard.StartRitual);
	uWExportFunction ('btStopRitual', Dashboard.StopRitual);
	uWExportFunction ('btQuickSacrifice', Dashboard.QuickSacrifice);
	uWExportFunction ('btSetMaxTroops', Dashboard.SetMaxTroops);
	uWExportFunction ('btSendHome', Dashboard.SendHome);
	uWExportFunction ('btSwitchThroneRoom', Dashboard.SwitchThroneRoom);
	uWExportFunction ('btCancelMarshall', Dashboard.CancelMarshall);
	uWExportFunction ('btChangeMarshall', Dashboard.ChangeMarshall);
	uWExportFunction ('btSetMarshall', Dashboard.SetMarshall);
	uWExportFunction ('btBoostMarshall', Dashboard.BoostMarshall);
	uWExportFunction ('btCancelChampion', Dashboard.CancelChampion);
	uWExportFunction ('btChangeChampion', Dashboard.ChangeChampion);
	uWExportFunction ('btFreeChampion', Dashboard.FreeChampion);
	uWExportFunction ('btSetChampion', Dashboard.SetChampion);
	uWExportFunction ('btSelectDefenders', Dashboard.SelectDefenders);
	uWExportFunction ('btSelectDefTroopType', Dashboard.SelectDefTroopType);
	uWExportFunction ('btSetMaxDefTroops', Dashboard.SetMaxDefTroops);
	uWExportFunction ('btAddDefenders', Dashboard.AddDefenders);
	uWExportFunction ('btNewDefPreset', Dashboard.NewDefPreset);
	uWExportFunction ('btChgDefPreset', Dashboard.ChgDefPreset);
	uWExportFunction ('btDelDefPreset', Dashboard.DelDefPreset);
	uWExportFunction ('btSaveDefPreset', Dashboard.SaveDefPreset);
	uWExportFunction ('btSetCurrentPreset', Dashboard.SetCurrentPreset);
	uWExportFunction ('btCancelDefPreset', Dashboard.CancelDefPreset);
	uWExportFunction ('btSelectDefPreset', Dashboard.SelectDefPreset);
	uWExportFunction ('btSetPresetDefenders', Dashboard.SetPresetDefenders);
	uWExportFunction ('btRecall', Dashboard.Recall);
	uWExportFunction ('btToggleSanctuary', Dashboard.ToggleSanctuary);

	uWExportFunction ('btOverrideDash', Tabs.Options.OverrideDash);
	uWExportFunction ('btResetDash', Tabs.Options.ResetDash);

	uWExportFunction ('btDelMarchPreset', QuickMarch.DelMarchPreset);
	uWExportFunction ('btSaveMarchPreset', QuickMarch.SaveMarchPreset);
	uWExportFunction ('btSelectMarchPreset', QuickMarch.SelectMarchPreset);

	uWExportFunction('btAddPowerBarLink', AddPowerBarLink);

	uWExportFunction ('btAlliArcanaSelChange', Dashboard.SetAlliArcanaDesc);
	uWExportFunction ('btPersArcanaSelChange', Dashboard.SetPersArcanaDesc);
	uWExportFunction('btDeactivateArcana', Dashboard.DeactivateArcana);

	uWExportFunction ('btBoostSpeedSelChange', Dashboard.SetSpeedBoostDesc);
	uWExportFunction ('btBoostAccuracySelChange', Dashboard.SetAccuracyBoostDesc);

	// add a battle button next to overview

	if (GlobalOptions.btOverviewDashboardBtn) {
		var el1 = ById('mod_cityinfo');
		var el2 = el1.getElementsByClassName('hd');
		for (var e in el2) {
			el2[e].innerHTML += '&nbsp;<a class="inlineButton btButton blue14" style="position:static;" onclick="btDashboardButtonClick(true); return false;"><span style="width:57px;">'+tx('Dashboard')+'</span></a>';
			var el3 = el2[e].getElementsByClassName('button14');
			for (var e2 in el3) {
				el3[e2].style["position"] = "static";
				el3[e2].className = 'inlineButton btButton blue14';
				break;
			}
			break;
		}
	};

	uWExportFunction ('btCityChanged', CityChanged);

	var cityselmod = new CalterUwFunc("citysel_click",[['cm.PrestigeCityView.render()','cm.PrestigeCityView.render();btCityChanged();']]);
	cityselmod.setEnable(cityselmod.isAvailable());

	// check dashboard and powerbar positions in 5 seconds... (after any other scripts loaded)
	setTimeout (WideScreen.CheckDashPosition, 5000);

	// check for login reward after 5 seconds...
	setTimeout (ClaimDailyReward, 5000);
}

function uWExportFunction (uwfunc,func) {
	try {
		if (typeof exportFunction == 'function') { exportFunction(func,uW,{defineAs:uwfunc}); }
		else { eval('uW.'+uwfunc+ ' = '+func); }
	} catch (e) { logerr(e); }
}

function uWCloneInto (obj) {
	try {
		if (typeof cloneInto == 'function') { return cloneInto(obj,uW); }
		else { return obj; }
	} catch (e) { logerr(e); }
}

function uWCreateObjectIn (objname,obj) {
	try {
		if (typeof createObjectIn == 'function') { return createObjectIn(uW, {defineAs: objname}); }
		else { uW[objname] = obj; return uW[objname]; }
	} catch (e) { logerr(e); }
}

function RefreshSeed() {
	RefreshingSeed = true;
	if (!Options.DashboardOptions.RefreshSeed) {
		jQuery('#btRefreshSeed').addClass("disabled");
		jQuery('#btRefreshSeedInc').addClass("disabled");
		jQuery('#btRefreshSeedOut').addClass("disabled");
	}

	// if update_seed_ajax is running, wait for it to finish before going any further..

	if (uW.g_update_seed_ajax_do) {
		setTimeout(RefreshSeed,1000);
		return;
	}

	// stop update_seed_ajax from running again until we are done here..
	uW.g_update_seed_ajax_do = true;

	var params = uW.Object.clone(uW.g_ajaxparams);

	var ts = (new Date().getTime() / 1000) + uW.g_timeoff;
	var cts = parseInt( (ts - 25.1) * 1000);
	var upd = window.self.location.href;
	upd=upd.replace(/ts=\d*\.\d+/, "ts="+ts);
	upd=upd.replace(/cts=\d*/, "cts="+cts);

	new AjaxRequest(upd, {
		method: "POST",
		parameters: params,
		onSuccess: function (rslt) {
			var mainSrcHTMLCode = rslt.responseText;
			var myregexp = /var\ seed=\{.*?\};/;
			var match = myregexp.exec(mainSrcHTMLCode);
			if (match != null) {
				result = match[0];
				result = result.substr(4);
				var seed = eval(result);
				// save values missing from initial load
				var activeBuffs = Seed.activeBuffs;
				var arcanaApothecaryBuffValue = Seed.arcanaApothecaryBuffValue;
				var arcanaAetherstoneCapBuffValue = Seed.arcanaAetherstoneCapBuffValue;
				var queue_champion = Seed.queue_champion;

				uW.seed = uWCloneInto(seed);
				Seed = uW.seed;

				// restore values missing from initial load
				Seed.player.g = Seed.players["u"+uW.tvuid].s;
				if (!Seed.activeBuffs) {
					Seed.activeBuffs = activeBuffs;
				}
				if (!Seed.queue_champion) {
					Seed.queue_champion = queue_champion;
				}
				Seed.arcanaApothecaryBuffValue = arcanaApothecaryBuffValue;
				Seed.arcanaAetherstoneCapBuffValue = arcanaAetherstoneCapBuffValue;

				Tabs.Options.DeletePointlessItems();
			}
			SecondLooper = 1;
			// let update_seed_ajax run again
			setTimeout( function () {uW.g_update_seed_ajax_do = false;},5000); // 5 second delay before we allow update_seed_ajax to run again :)
			RefreshingSeed = false;
			if (!Options.DashboardOptions.RefreshSeed) {
				jQuery('#btRefreshSeed').removeClass("disabled");
				jQuery('#btRefreshSeedInc').removeClass("disabled");
				jQuery('#btRefreshSeedOut').removeClass("disabled");
			}
		},
		onFailure: function () {
			if (notify != null)
				notify(rslt.errorMsg);
			SecondLooper = 1;
			// let update_seed_ajax run again
			setTimeout( function () {uW.g_update_seed_ajax_do = false;},5000); // 5 second delay before we allow update_seed_ajax to run again :)
			RefreshingSeed = false;
			if (!Options.DashboardOptions.RefreshSeed) {
				jQuery('#btRefreshSeed').removeClass("disabled");
				jQuery('#btRefreshSeedInc').removeClass("disabled");
				jQuery('#btRefreshSeedOut').removeClass("disabled");
			}
		},
	});
}

/** Widescreen/Environment Functions **/

function LoadChecker (init) {
	if (!GlobalOptions.btWatchdog) return;
	var Sresult = getServerId();
	if(init) {
		if(Sresult == '??') {
			GM_setValue ('Loaded', 0);
			setTimeout(LoadCheckLoop,5000,'Loaded');
		} else {
			GM_setValue (Sresult+'Loaded', 0);
			setTimeout(LoadCheckLoop,5000,Sresult+'Loaded');
		};

		// check firefox and GM version, if dodgy, display a message bar

		ValidCombo = true;
		if (GMVersion.Handler == 'Greasemonkey' && parseIntNan(GMVersion.Version) > 1 && parseIntNan(FFVersion.Version) > 31 && parseIntNan(FFVersion.Version) < 38) { ValidCombo = false; }
		if (!ValidCombo) {
			div = document.createElement('div');
			var msg = tx('Power Bot Plus has detected you are running')+' '+GMVersion.Handler+' '+tx('version')+' : '+GMVersion.Version+' '+tx('and')+' '+FFVersion.Browser+' '+tx('version')+' : '+FFVersion.Version+'. '+tx('Some features may not work correctly')+'. <a onClick="this.parentNode.parentNode.style.display=\'none\';">['+tx('Close')+']</a>';
			div.innerHTML = '<DIV class=yellowBanner>'+msg+'</div>';
			document.body.insertBefore (div, document.body.firstChild);
		}
	} else {
		GM_setValue ('Loaded', 1);
		GM_setValue (Sresult+'Loaded', 1);
	}
}

function LoadCheckLoop (checkvalue) {
	if (GM_getValue(checkvalue) == 0) {
		LoadCheckCounter = LoadCheckCounter - 1;
		if (LoadCheckCounter<=0) { KOCnotFound(20,true); }
		else { setTimeout(LoadCheckLoop,5000,checkvalue); }
	}
}

function SetGameScreen() {

	function setGame (){
		try { var kocFrame = parent.document.getElementById('kocIframes1'); } catch (err) {};
		if (!kocFrame){
			setTimeout (setGame, 1000);
			return;
		}

		kocFrame.style.width = '100%';
		kocFrame.style.height = '3000px';
		if (GlobalOptions.btWideScreenStyle=="wide") kocFrame.style.width = '1520px';
		if (GlobalOptions.btWideScreenStyle=="ultra") kocFrame.style.width = '1900px';
		var style = document.createElement('style');
		style.innerHTML = 'body {margin:0; width:100%; !important;}';
		kocFrame.parentNode.appendChild(style);

		try { ById('progressBar').parentNode.removeChild(ById('progressBar')); } catch (e) { }
		try { ById('crossPromoBarContainer').parentNode.removeChild(ById('crossPromoBarContainer')); } catch (e) { }
	}

	setTimeout(function() {
		var url=document.URL;
		var dom = /s=([0-9]+)/i.exec(url);
		if (dom) uW.window.document.title="KofC "+dom[1];
	}, 10000)

	KOCWatchdog();
	setGame();
}

function FacebookInstance () {

	function setWideFb (){
		var iFrame = ById('iframe_canvas');
		if (!iFrame){
			setTimeout (setWideFb, 1000);
			return;
		}
		iFrame.style.width = '100%';

		while ( (iFrame=iFrame.parentNode) != null) {
			if (iFrame.tagName=='DIV') {
				iFrame.style.width = '100%';
				iFrame.style.maxWidth = '100%';
			}
		}
		ById('globalContainer').style.left = '0px';

		var e = ById('mainContainer');
		if (e) {
			e.parentNode.style.minWidth = '100%';
			if (GlobalOptions.btWideScreenStyle=="wide") e.parentNode.style.minWidth = '1520px';
			if (GlobalOptions.btWideScreenStyle=="ultra") e.parentNode.style.minWidth = '1900px';
			for(i=0; i<e.childNodes.length; i++){
				if(e.childNodes[i].id == 'contentCol'){
					e.childNodes[i].style.margin = '0px';
					e.childNodes[i].style.paddingTop = '5px';
					break;
				}
			}
		}

		GM_addStyle("._470m { display: none !important;}"); // remove annoying facebook games toolbars and junk
		GM_addStyle("._31e { position: inherit !important;}"); // something that stops scrolling
		GM_addStyle("#rightCol { display: none !important;}");

		try { ById('leftColContainer').parentNode.removeChild(ById('leftColContainer')); } catch (e) { }

		var e = ById('pageHead');
		if (e) {
			e.style.width = '80%';
			e.style.margin = '0 10%';
		}

		var e = ById('bottomContent');
		if (e) {
			e.style.padding = "0px 0px 12px 0px";
		}
	}

	setTimeout(function() {
		var url=document.URL;
		var dom = /s=([0-9]+)/i.exec(url);
		if (dom) uW.window.document.title="KofC "+dom[1];
	}, 10000)

	if ((document.URL.search(/merlinshare/i) != -1) || (document.URL.search(/accepttoken/i) != -1) || (document.URL.search(/claimvictorytoken/i) != -1)) {
		GlobalOptions.LastTopURL = document.URL;
		saveGlobalOptions();
	}

	FacebookWatchdog();
	setWideFb();
}

function CheckStandAlone (CheckString) {
	if (!CheckString) { CheckString = document.URL; }
	var Standalone = (CheckString.search(/games\/kingdoms-of-camelot\/play/i) >= 0 || CheckString.match(/standalone=1/i));
	return Standalone;
}

function StandAloneInstance () {

	function setWideKb () {
		var iFrames = $('game_frame');
		if (!iFrames){
			setTimeout (setWideKb, 1000);
			return;
		}

		iFrames.style.width = '100%';
		iFrames.style.height = '3000px';
		if (GlobalOptions.btWideScreenStyle=="wide") iFrames.style.width = '1520px';
		if (GlobalOptions.btWideScreenStyle=="ultra") iFrames.style.width = '1900px';
		while ( (iFrames=iFrames.parentNode) != null && iFrames.tagName !== "BODY") {
			iFrames.style.width = '100%';
			if (GlobalOptions.btWideScreenStyle=="wide") iFrames.style.width = '1520px';
			if (GlobalOptions.btWideScreenStyle=="ultra") iFrames.style.width = '1900px';
		}
		try { ById('promo-sidebar').parentNode.removeChild(ById('promo-sidebar')); } catch (e) { }
	}

	function sendmeaway () {
		var serverID = /s=([0-9]+)/im.exec (document.location.href);
		var sr = /value="(.*?)"/im.exec ($("post_form").innerHTML);
		var goto = $("post_form").action+(serverID?"s="+serverID[1]:'');
		goto += '&platform_req=A&signed_request='+sr[1];
		setTimeout (function (){window.top.location = goto;}, 0);
	}

	if ((document.URL.search(/merlinshare/i) != -1) || (document.URL.search(/accepttoken/i) != -1) || (document.URL.search(/claimvictorytoken/i) != -1)) {
		GlobalOptions.LastTopURL = document.URL;
		saveGlobalOptions();
	}

	if (GlobalOptions.btNoMoreRy) {
		sendmeaway();
	}
	else {
		setTimeout(function() {
			var url=document.URL;
			var dom = /s=([0-9]+)/i.exec(url);
			if (dom) uW.window.document.title="KofC "+dom[1];
		}, 10000)

		setWideKb();
	}
}

function FacebookWatchdog () {

	function fbwatchdog () {
		if (!ById('app_content_130402594779')) {
			logit ("KOC NOT FOUND (FB)!");
			KOCnotFound(30);
		}
	}

	var INTERVAL = 50000; // wait 50 seconds before checking DOM
	if (!GlobalOptions.btWatchdog) return;
	setTimeout (fbwatchdog, INTERVAL);
}

function KOCWatchdog () {

	function kbwatchdog (){
		if (!ById('mod_maparea')==null){
			logit ("KOC NOT FOUND (STANDALONE)!");
			KOCnotFound(30);
		}
	}

	var INTERVAL = 50000; // wait 50 seconds before checking DOM
	if (!GlobalOptions.btWatchdog) return;
	setTimeout (kbwatchdog, INTERVAL);
}

function PBPWatchdog () {

	function botwatchdog (){
		if (!uW.btLoaded){
			logit ("PBP NOT INITIALISED");
			KOCnotFound(20,false,true);
		}
	}

	var INTERVAL = 50000; // wait 50 seconds before checking DOM
	setTimeout (botwatchdog, INTERVAL);
}

function KOCnotFound(secs,bot,inst){
	var div;
	var countdownTimer = null;
	var endSecs = (new Date().getTime()/1000) + secs;

	function countdown (){
		var secsLeft = endSecs - (new Date().getTime()/1000);
		ById('btwdsecs').innerHTML = timestr(secsLeft);
		if (secsLeft < 0) {
			clearTimeout (countdownTimer);
			ReloadKOC();
		}
	}
	function cancel (){
		clearTimeout (countdownTimer);
		document.body.removeChild (div);
	}

	div = document.createElement('div');
	var msg = tx('Power Bot Plus has detected that KofC is not loaded');
	if (bot) msg = tx('Power Bot Plus failed to initialise - You may need to reinstall');
	if (inst) msg = tx('Power Bot Plus failed to fully initialise - Some features may not work as expected');
	msg = '<DIV class=redBanner >'+msg+'. ';
	if (!inst) { msg = msg+tx('Refreshing in')+' <SPAN id=btwdsecs></span>. <a style="color:#FFFF80;visited:#FFFF80;hover:#FFFF80;cursor:pointer;" id=btwdcan >['+tx('cancel refresh')+']</a>'; }
	msg = msg + '</div>';
	div.innerHTML = msg;
	document.body.insertBefore (div, document.body.firstChild);
	if (!inst) {
		ById('btwdcan').addEventListener('click', cancel, false);
		countdownTimer = setInterval (countdown, 1000);
	}
}

function ReloadKOC (timer,params){
	var serverId = getServerId();
	if (serverId == '??') { window.location.reload(true); return; }

	params = (params?params:'');
	var goto = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/?s='+serverId+params;
	if (CheckStandAlone()) { goto = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/?s='+serverId+params; }

	if (timer && GlobalOptions.TokenEnabled && UserOptions.TokenAuto && serverId==UserOptions.TokenDomain) {
		// check for token collection
		if (!UserOptions.TokenCollected && UserOptions.TokenLink != "" && UserOptions.TokenLink.search(/merlinshare/i) != -1 && UserOptions.LastTokenStatus == "") {
			UserOptions.TokenRequest = 'TOKEN';
			saveUserOptions(uW.user_id);
			var goto = UserOptions.TokenLink;
		}
		else {
			// check for build collection
			if (!UserOptions.BuildCollected && UserOptions.BuildLink != "" && UserOptions.BuildLink.search(/accepttoken/i) != -1 && UserOptions.LastBuildStatus == "") {
				UserOptions.TokenRequest = 'BUILD';
				saveUserOptions(uW.user_id);
				var goto = UserOptions.BuildLink;
			}
			else {
				if (!UserOptions.BonusCollected && UserOptions.TreasureChestBankOther.length>0 && UserOptions.TreasureChestBankOther[0].playerId!=uW.tvuid && UserOptions.LastChestStatus == "") {
					Tabs.Options.CreateLink(false,true);
					return;
				}
				else {
					var DomArray = UserOptions.ChestDomainList.split(",");
					var freedomain = false;
					for (var d=0; d < DomArray.length; d++) {
						if (DomArray[d]) {
							if (!UserOptions.ChestCollected[DomArray[d]] && !UserOptions.BadChestDomains[DomArray[d]]) {
								freedomain = true;
								break;
							}
						}
					}
					if (freedomain) {
						if (UserOptions.TreasureChestBankOther.length>0) {
							Tabs.Options.CreateLink(false,true);
							return;
						}
						else {
							if (UserOptions.TreasureChestBank.length>0) {
								Tabs.Options.CreateLink(true,true);
								return;
							}
						}
					}
				}
			}
		}
	}
	setTimeout (function (){window.top.location = goto;}, 0);
}

function CheckRemoveAlert() {
	var x = ByCl('kofcalert');
	if(x.length > 0) for(var i = 0; i < x.length;i++) if(String(x[i].innerHTML).indexOf('atk march no row change') > -1) {uW.Modal.hideModal(true); actionLog('Removed "atk march no row change" dialog'); }
	var y = ById('fb_dialog_ipad_overlay');
	if (y) y.style.display = 'none';
	var z = ByCl('kofctrackeralert');
	if(z.length > 0) for(var i = 0; i < z.length;i++) {uW.Modal.hideModal(true); actionLog('Removed "something has gone wrong" dialog'); }
	setTimeout(CheckRemoveAlert, 2000);
}

function CheckDisableAds() {
	if (Seed.player.ryPlayer && Seed.player.ryPlayer.dau) {
		var RY1 = ById('ryAdCurtain');
		if (RY1) { RY1.style.width='0px';RY1.style.height='0px';RY1.style.zIndex='-1'; }
		var RY2 = ById('ryAdContainerOuter');
		if (RY2) { RY2.style.width='0px';RY2.style.height='0px';RY2.style.zIndex='-1'; }
		var RY3 = ById('ryAdContainer');
		if (RY3) {
			RY3.parentNode.removeChild(RY3);
			logit('Disabled RockYou popup ad controller');
		}
	}
	setTimeout(CheckDisableAds, 3000);
}

function HandlePublishPopup() {
	var myregexp = /USER_ID\"\:\"([0-9]+)"/;
	var match = myregexp.exec(document.documentElement.outerHTML)[1];
	if (!match) {
		myregexp = /ACCOUNT_ID\"\:\"([0-9]+)"/;
		match = myregexp.exec(document.documentElement.outerHTML)[1];
	}
	if (!match) { return; }
	readUserOptions(match);

	if (UserOptions.autoPublishGamePopups || UserOptions.autoCancelGamePopups){
		var FBInputForm = ById('uiserver_form');
		if (!FBInputForm) FBInputForm = ById('platformDialogForm');
		if(FBInputForm){
			CheckPublish(FBInputForm);
		}
	}
	setTimeout(HandlePublishPopup, 1000);
}

function HandleInlinePublishPopup() {
	var FBInputForm = ById('platformDialogForm');
	if(FBInputForm){
		var myregexp = /&amp;to=([0-9]+)&/;
		var match = myregexp.exec(document.documentElement.outerHTML)[1];
		if (match) {
			readUserOptions(match);
			if (UserOptions.autoPublishGamePopups || UserOptions.autoCancelGamePopups){
				CheckPublish(FBInputForm);
			}
		}
	}
	setTimeout(HandleInlinePublishPopup, 1000);
}

function CheckPublish (FBInputForm) {
	var channel_input = nHtml.FindByXPath(FBInputForm,".//input[contains(@name,'app_id')]");
	if(channel_input){
		var current_app_id = channel_input.value;
		if (current_app_id=="130402594779") { // koc
			var publish_button = nHtml.FindByXPath(FBInputForm,".//input[@type='submit' and contains(@name,'publish')]");
			if (!publish_button) publish_button = nHtml.FindByXPath(FBInputForm,".//button[@type='submit' and contains(@name,'__CONFIRM__')]");
			var cancel_publish_button = nHtml.FindByXPath(FBInputForm,".//input[@type='submit' and contains(@name,'cancel')]");
			if (!cancel_publish_button) cancel_publish_button = nHtml.FindByXPath(FBInputForm,".//button[@type='submit' and contains(@name,'__CANCEL__')]");
			var privacy_setting = nHtml.FindByXPath(FBInputForm,".//select[@name='audience[0][value]']");
			var privacy_input = nHtml.FindByXPath(FBInputForm,".//input[@name='privacyx']");
			if (UserOptions.autoPublishGamePopups){
				if (publish_button) {
					if (privacy_setting) {
						// 80: Everyone
						// 50: Friends of Friends
						// 40: Friends Only
						// 10: Only Me
						// 99: Custom List
						var PublishList = UserOptions.autoPublishPrivacySetting;
						if (PublishList==99) {
							if (UserOptions.CustomListId!=0) { PublishList = UserOptions.CustomListId; }
							else { PublishList = 10; } // default to only me if no list
						}
						privacy_setting.innerHTML = '<option value="'+ PublishList +'"></option>';
						privacy_setting.selectedIndex = 0;
					}
					else {
						if (privacy_input) {
							// new facebook audience crap - translate option to new value
							var PublishList = UserOptions.autoPublishPrivacySetting;
							if (PublishList==99) {
								if (UserOptions.CustomListId!=0) { PublishList = UserOptions.CustomListId; }
								else { PublishList = TranslatePublish[10]; } // default to only me if no list
							}
							else {
								PublishList = TranslatePublish[PublishList]||TranslatePublish[10];
							}
							privacy_input.value = PublishList;
						}
					}
					publish_button.click();
					setTimeout(CheckHideFBDialogs,1500);
					return;
				}
			} else if (UserOptions.autoCancelGamePopups) {
				if (cancel_publish_button) {
					cancel_publish_button.click();
					setTimeout(CheckHideFBDialogs,1500);
					return;
				}
			}
		}
	}
};

function CheckHideFBDialogs () {
	var FBClasses = ByCl('_10 uiLayer _4-hy _3qw');
	var i = FBClasses.length;
    while(i--) { FBClasses[i].parentNode.removeChild(FBClasses[i]); }
};

function CheckTokenCollection () {
	LoadChecker(false);
	var user_id = uW.user_id;
	if (user_id) {
		readUserOptions(user_id);
	}
	var UserDomain = getTokenServerId();

	if (GlobalOptions.TokenEnabled && !giftAccepted){
		var CheckTokenFunc = function (e) {
			if (giftAccepted) { return; }
			// Find the gift claiming container div
			var claim_gift = ById('claimgift');
			if (!claim_gift) { claim_gift = ById('claimhelp'); }
			if (!claim_gift) { setTimeout(CheckTokenFunc,1000); return; }

			// Look for the select drop-down
			var domain_selector = ById('serverid');
			// Look for the next button
			var next_button1 = nHtml.FindByXPath(claim_gift, ".//a[contains(@onclick,'checkServer')]");
			var next_button2 = nHtml.FindByXPath(claim_gift, ".//a[@class='nextbtn']");
			var next_button3 = nHtml.FindByXPath(claim_gift, ".//a[contains(@onclick,'claimhelpform')]");
			var back_button = nHtml.FindByXPath(claim_gift, ".//a");
			if (domain_selector && (next_button1 || next_button2)) {
				for (var i = 0; i < domain_selector.options.length; i++) {
					if (domain_selector.options[i].value == UserDomain) {
						domain_selector.selectedIndex = i;
						logit("Merlins Token collected :)");
						giftAccepted = true;
						CheckTokenDay(user_id);
						if (document.URL.search(/merlinShare_src.php/i) != -1) { UserOptions.TokenCollected = true; UserOptions.TokenRequest = 'TOKEN'; }
						if (document.URL.search(/accepttoken_src.php/i) != -1) { UserOptions.BuildCollected = true; UserOptions.TokenRequest = 'BUILD'; }
						if (document.URL.search(/claimVictoryToken_src.php/i) != -1) {
							if (parseIntNan(getFeedServerId())==parseIntNan(UserDomain)) { UserOptions.BonusCollected = true; }
							else { UserOptions.ChestCollected[getFeedServerId()] = true; }
							UserOptions.TokenRequest = 'CHEST';
						}
						UserOptions.TokenCount = UserOptions.TokenCount + 1;
						UserOptions.TokenResponse = 'OK';
						UserOptions.TokenSuccessLink = GlobalOptions.LastTopURL;
						saveUserOptions(user_id);

						if (next_button1) { nHtml.Click(next_button1); }
						else { nHtml.Click(next_button2); }
						return;
					}
				}
			}
			else {
				if (next_button3) {	nHtml.Click(next_button3); }
				else {
					if (next_button2 || back_button) {
						logit("Merlins Token could not be collected :(");

						UserOptions.TokenResponse = 'FAILED';
						saveUserOptions(user_id);

						var a = document.createElement('div');
						a.innerHTML = '<div align=center><br><i>'+tx('Merlins Token could not be collected')+'.<br>('+tx('KofC will automatically reload in 10 seconds')+')</i></div>';
						var claim_help_bdy = nHtml.FindByXPath(claim_gift, ".//div[contains(@class,'helpbodycontent')]");
						if (!claim_help_bdy)
							claim_help_bdy = nHtml.FindByXPath(claim_gift, ".//div[@class='claimhelpbdy']");

						if (claim_help_bdy) { claim_help_bdy.appendChild(a); }
						else { claim_gift.appendChild(a); }

						var goto1 = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/?s='+UserDomain;
						if (CheckStandAlone(GlobalOptions.LastTopURL)) { goto1 = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/?s='+UserDomain; }

						if (document.URL.search(/page=friendFeed/i)>0) {
							if (claim_gift.textContent.indexOf("Someone else has claimed this bonus.")>-1||
								claim_gift.textContent.indexOf("You have already claimed this")>-1 ||
								claim_gift.textContent.indexOf("You have followed an invalid feed link")>-1) {
								UserOptions.TokenResponse = 'USED';
							}
							else {
								UserOptions.TokenResponse = 'BAD ('+getFeedServerId()+')';
								UserOptions.BadChestDomains[getFeedServerId()] = true;
							}
							saveUserOptions(user_id);
						}
						if (document.URL.search(/accepttoken_src.php/i)>0) {
							if (claim_gift.textContent.indexOf("You are not eligible")>-1) {
								UserOptions.TokenResponse = 'EXPIRED';
								saveUserOptions(user_id);
							}
						}
						setTimeout (function (){window.top.location = goto1;}, 10000);
					}
					else {
						if (domain_selector == null && (typeof unsafeWindow.checkServer == 'function')) {
							logit("Suspected Blank Decree page...");
							var FeedID = getFeedId();
							var goto_null = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/?s='+UserDomain;
							if (CheckStandAlone(GlobalOptions.LastTopURL)) { goto_null = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/?s='+UserDomain; }
							if (FeedID !='n/a'){
								goto_null = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/?f='+FeedID+'&t=118&lang=en&f='+FeedID+'&t=118&in='+getFeedUserId()+'&si=118&s='+UserDomain;
								if (CheckStandAlone(GlobalOptions.LastTopURL)) { goto_null = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/?f='+FeedID+'&t=118&lang=en&f='+FeedID+'&t=118&in='+getFeedUserId()+'&si=118&s='+UserDomain; }
								logit("Merlins Token collected :)");
								giftAccepted = true;
								CheckTokenDay(user_id);
								if (document.URL.search(/merlinShare_src.php/i) != -1) { UserOptions.TokenCollected = true; UserOptions.TokenRequest = 'TOKEN'; }
								if (document.URL.search(/accepttoken_src.php/i) != -1) { UserOptions.BuildCollected = true; UserOptions.TokenRequest = 'BUILD'; }
								if (document.URL.search(/claimVictoryToken_src.php/i) != -1) { UserOptions.ChestCollected[getFeedServerId()] = true; UserOptions.TokenRequest = 'CHEST'; }
								UserOptions.TokenCount = UserOptions.TokenCount + 1;
								UserOptions.TokenResponse = 'OK';
								UserOptions.TokenSuccessLink = GlobalOptions.LastTopURL;
								saveUserOptions(user_id);
								window.top.location = goto_null;
							} else {
								var a = document.createElement('div');
								a.innerHTML = '<div align=center><br><b>'+tx('Token Id not found')+'.</b><br><br><i>'+tx('Merlins Token could not be collected')+'.<br>('+tx('KofC will automatically reload in 10 seconds')+')</i></div>';
								claim_gift.appendChild(a);
								if (UserOptions.TokenResponse=="") {
									UserOptions.TokenResponse = 'USED'; // assume used token..
									saveUserOptions(user_id);
								}
								setTimeout (function (){window.top.location = goto_null;}, 10000);
							}
						}
					}
				}
			}
		}
		CheckTokenFunc();
	}
}

function CheckTokenDay(user_id) {
	var date = new Date();
	var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
	var offset = -8 + (getDST(date)/3600);
	var today = new Date(utc + (3600000 * offset));
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {dd='0'+dd}
	if(mm<10) {mm='0'+mm}
	today = dd+'/'+mm+'/'+yyyy;
	if (today != UserOptions.TokenDate) {
		UserOptions.TokenDate = today;
		UserOptions.TokenCount = 0;
		UserOptions.TokenCollected = false;
		UserOptions.BuildCollected = false;
		UserOptions.BonusCollected = false;
		UserOptions.ChestCollected = {};
		UserOptions.LastTokenStatus = '';
		UserOptions.LastBuildStatus = '';
		UserOptions.LastChestStatus = '';
		UserOptions.BadChestDomains = {};
		saveUserOptions(user_id);
	}
}

var WideScreen = {
	chatIsRight : false,
	WideMap : false,
	PowerBar : false,
	PowerBarOpen : false,
	Dashboard : false,
	MapExpanded : false,
	PowerBarWidth : 0,
	OffsetTop : 0,
	rail : null,

	init : function (){
		var t = WideScreen;
		t.rail = searchDOM (ById('mod_maparea'), 'node.className=="maparea_rrail"', 10);

		uWExportFunction('btGetOffset',WideScreen.getOffset);

		var ttmod = new CalterUwFunc("showTooltip",[['t.cumulativeOffset()[0]','t.cumulativeOffset()[0]-n.cumulativeOffset()[0]']]);
		ttmod.setEnable(ttmod.isAvailable());

		var modalmod = new CalterUwFunc("Modal.showModal",[[/cm.ModalManager.addLevel/ig,'m=btGetOffset(m,true);i=btGetOffset(i,false);cm.ModalManager.addLevel'],[/\s*p\s*[+]\s*["]px/,' p + "px !important'],['break;','d+="left:"+m+"px !important";break;']]);
		modalmod.setEnable(modalmod.isAvailable());
	},

	getOffset : function(c,Horizon) {
		var t = WideScreen;
		if (Horizon) { return parseIntNan(c+t.PowerBarWidth); }
		else { return parseIntNan(c+t.OffsetTop); }
	},

	chgChatBeforeDash : function (tf) {
		var t = WideScreen;
		t.CheckDashPosition();
		t.CheckChatPosition();
	},

	RestartDashboard : function (tf) {
		var t = WideScreen;
		if (popDash) { document.body.appendChild(popDash.div); popDash.show(false); popDash.destroy(); popDash = null; }
		t.CheckDashPosition();
		t.CheckChatPosition();
		if (Options.btDashboard) { Dashboard.Curr = Cities.byID[uW.currentcityid].idx; Dashboard.init(); }
	},

	setChatOnRight : function (tf){
		var t = WideScreen;
		if (tf == t.chatIsRight) return;
		var chat = ById('kocmain_bottom').childNodes[1];
		if (!chat || chat.className!='mod_comm') { setTimeout (function (){t.setChatOnRight(tf)}, 1000); return; }

		if (tf){
			chat.style.top = '-570px';
			chat.style.height = '1167px';
			chat.style.background = 'url("'+ CHAT_BG_IMAGE +'")';
			ById('mod_comm_list1').style.height = '1013px';
			ById('mod_comm_list2').style.height = '1013px';
			t.CheckDashPosition();
			t.CheckChatPosition();
		} else {
			chat.style.top = '0px';
			chat.style.left = '0px';
			chat.style.height = '';
			chat.style.background = '';
			ById('mod_comm_list1').style.height = '287px';
			ById('mod_comm_list2').style.height = '287px';
			t.CheckDashPosition();
			t.CheckChatPosition();
		}
		var divheight = chat.offsetHeight;

		t.chatIsRight = tf;
	},

	CheckChatPosition : function () {
		var t = WideScreen;
		var chat = ById('kocmain_bottom').childNodes[1];
		if (chat && chat.className=='mod_comm') {
			if (parseIntNan(getStyle(chat,'top')) < 0) {
				var left = 760;
				if (Options.btDashboard && !GlobalOptions.btChatBeforeDash && !Options.btFloatingDashboard) {
					left += Dashboard.DashWidth+20;
				}
				chat.style.left = left+'px';
			}
			else {
				var widget1 = ById('tr_presetBox'); // ne0's widget
				var widget2 = ById('btTRWidget'); // my widget
				if (widget1 || widget2) {
					if (widget2) var hh = widget2.offsetHeight-6;
					if (widget1) hh = widget1.offsetHeight-6;
					if (!widget1 && Options.ThroneHUD) hh=0;
					if (hh<0) hh=0;
					chat.style.top = hh+'px';
					chat.style.background = 'url("'+ CHAT_BG_IMAGE +'")';
					ById('mod_comm_list1').style.height = (287-hh)+'px';
					ById('mod_comm_list2').style.height = (287-hh)+'px';
				}
			}
		}
	},

	useWideMap : function (tf) {
		var t = WideScreen;
		if (tf == t.WideMap) return;
		if (tf){
			t.rail.style.display = 'none';
			ById('mapwindow').style.height = "436px";
			ById('mapwindow').style.zIndex = "50";
		} else {
			t.rail.style.display = 'block';
			ById('mapwindow').style.height = "439px";
			ById('mapwindow').style.zIndex = "";
		}
		t.WideMap = tf;
		t.MapExpanded = true;
		t.ExpandWideMap();
	},

	ExpandWideMap : function () {
		var t = WideScreen;
		if (!t.WideMap) {
			var MapToggle = ById('btMapToggle');
			if (MapToggle) {
				MapToggle.style.display = 'none';
			}
			return;
		}
		t.MapExpanded = !t.MapExpanded;
		var MapWindow = ById('mapwindow');
		if (!MapWindow) return;
		if (t.MapExpanded){
			MapWindow.style.width = "1220px";
			var buttontext = '<span style="display:inline-block;height:100%;vertical-align:middle;"></span><img style="margin-left:-4px;vertical-align:middle;" height="10" src="'+WhiteLeftArrow+'">';
		} else {
			MapWindow.style.width = "760px";
			var buttontext = '<span style="display:inline-block;height:100%;vertical-align:middle;"></span><img style="margin-left:-4px;vertical-align:middle;" height="10" src="'+WhiteRightArrow+'">';
		}
		var MapToggle = ById('btMapToggle');
		var MapWidth = parseIntNan(getStyle(MapWindow,'width'));
		var MapHeight = parseIntNan(getStyle(MapWindow,'height'));

		if (MapToggle) {
			MapToggle.style.left = MapWidth-20+'px';
			MapToggle.style.display = 'block';
			ById('btMapToggleLabel').innerHTML = buttontext;
		}
		else {
			var MapToggle = document.createElement('div');
			MapToggle.id = 'btMapToggle';
			MapToggle.style.position = 'absolute';
			MapToggle.style.width = '20px';
			MapToggle.style.left = MapWidth-20+'px';
			MapToggle.style.top = t.getTop(MapWindow)+parseInt(MapHeight/2)-30+'px';
			MapToggle.style.height = '60px';
			MapToggle.style.zIndex = '50'; // keep above dashboard
			MapToggle.style.display = 'block';
			ById('mapwindow').appendChild(MapToggle);

			var m = '<table><tr><td id=btMapToggleOpener valign=middle style="background:none;border:none;"><a><div id=btMapToggleLabel class="btBackExpander buttonv2 blue" style="width:20px;height:50px;">&nbsp;</div></a></td></tr></table>';
			MapToggle.innerHTML = m;
			ById('btMapToggleLabel').innerHTML = buttontext;
			ById('btMapToggleOpener').addEventListener ('click', t.ExpandWideMap, false);
		}
	},

	setDashboard : function (tf){
		var t = WideScreen;
		if (tf == t.Dashboard) return;

		if (popDash) {
			if (Options.btFloatingDashboard) {
				Options.btDashPos = popDash.getLocation();
			}
			else {
				document.body.appendChild(popDash.div);
			}

			popDash.show(false);
			popDash.destroy();
			popDash = null;
		}

		if (tf){
			// append dashboard div to koc container
			var Dash = document.createElement('div');
			Dash.id='btDashboard';
			Dash.style.position = 'absolute';
			Dash.style.width = (Options.DashboardOptions.DashWidth+20)+'px';
			Dash.style.top = "0px";
			Dash.style.height = "5000px";
			ById('kocContainer').appendChild(Dash);
			t.CheckDashPosition();
			t.CheckChatPosition();
			Dashboard.init();
		}
		else {
			// remove dashboard div from koc container if it exists
			var elem = ById('btDashboard');
			if (elem) {
				if (popDash) { document.body.appendChild(popDash.div); popDash.show(false); popDash.destroy(); popDash = null; }
				elem.parentNode.removeChild(elem);
			}
			t.CheckChatPosition();
		}
		t.Dashboard = tf;
	},

	CheckDashPosition : function () {
		var t = WideScreen;
		var kochead = ById('kochead');
		t.OffsetTop = t.getTop(kochead);
		// adjust left setting for chat
		var Chat = ById('kocmain_bottom').childNodes[1];
		var ChatWidth = 0;
		if (Chat && (Chat.className == 'mod_comm') && (parseIntNan(getStyle(Chat,'top')) < 0) && GlobalOptions.btChatBeforeDash) {
			ChatWidth = parseIntNan(getStyle(Chat,'width'));
		}
		// adjust left setting for powerbar
		t.PowerBarWidth = 0;
		var PowerBar = ById('btPowerBar');
		if (PowerBar) {
			t.PowerBarWidth = parseIntNan(getStyle(PowerBar,'width'));
			PowerBar.style.top = t.OffsetTop+'px';
		}

		var Dash = ById('btDashboard');
		if (Dash) {
			Dash.style.left = 760+ChatWidth+t.PowerBarWidth+"px";
			Dash.style.top = t.OffsetTop+'px';
			if (Options.btFloatingDashboard) {
				Dash.style.display = 'none';
			}
			else {
				Dash.style.display = 'block';
			}
		}

		t.setDialogContainerStyles();
	},

	setPowerBar : function (tf,open){
		var t = WideScreen;
		if (tf == t.PowerBar && open == t.PowerBarOpen) return;
		var offset = 24;
		var PowerBarLabel = '<br><br><img src="'+WhiteRightArrow+'"><br><br><img src="'+PowerBarText+'"><br><br><img src="'+WhiteRightArrow+'">';
		if (open) {
			if (!GlobalOptions.btFloatingPowerBar) {
				offset = 164;
			}
			PowerBarLabel = '<br><br><img src="'+WhiteLeftArrow+'"><br><br><img src="'+PowerBarText+'"><br><br><img src="'+WhiteLeftArrow+'">';
		}
		if (tf){
			if (ById("main_engagement_tabs")) ById("main_engagement_tabs").style.left = offset+'px';

			var kochead = ById('kochead');
			if (!kochead) { setTimeout (function (){t.setPowerBar(tf,open)}, 1000); return; }
			kochead.style.position = 'relative';
			kochead.style.left = offset+'px';
			t.OffsetTop = t.getTop(kochead);

			var kocmain = ById('kocmain');
			if (!kocmain) { setTimeout (function (){t.setPowerBar(tf,open)}, 1000); return; }

			var oldkm = getAbsoluteOffsets(kocmain);
			kocmain.style.left = offset+'px';
			var newkm = getAbsoluteOffsets(kocmain);
			var widgetshift = newkm.left - oldkm.left;

			t.setDialogContainerStyles();

			// keep ne0's widgets in line with kocmain movement

			if (ById("tr_guardBox")) {
				var newgpos = ById("tr_guardBox").offsetLeft + widgetshift;
				ById("tr_guardBox").style.left = newgpos+'px';
			}
			if (ById("tr_presetBox")) {
				var newtpos = ById("tr_presetBox").offsetLeft + widgetshift;
				ById("tr_presetBox").style.left = newtpos+'px';
			}

			var GameHeight = parseInt(kochead.offsetHeight)+parseInt(kocmain.offsetHeight);

			var PowerBar = ById('btPowerBar');
			if (PowerBar) {
				PowerBar.style.width = offset+'px';
				ById('btPowerBarLabel').innerHTML = PowerBarLabel;
			}
			else {
				var PowerBar = document.createElement('div');
				PowerBar.id='btPowerBar';
				PowerBar.style.position = 'absolute';
				PowerBar.style.width = offset+'px';
				PowerBar.style.top = t.OffsetTop+'px';
				PowerBar.style.height = GameHeight+'px';
				PowerBar.style.zIndex = '100411';
				ById('kocContainer').appendChild(PowerBar);

				var m = '<table cellspacing=0 cellpadding=0><tr><td id=btPowerBarButtons class="divHide" style="background-color:#000;" valign=top>&nbsp;</td><td id=btPowerBarOpener valign=middle style="background:none;border:none;vertical-align:top;"><a><div id=btPowerBarLabel class="btExpander buttonv2 blue" style="width:20px;height:'+GameHeight+'px;">&nbsp;</div></a></td></tr></table>';
				PowerBar.innerHTML = m;
				ById('btPowerBarLabel').innerHTML = PowerBarLabel;
				ById('btPowerBarOpener').addEventListener ('click', t.e_TogglePowerBar, false);
				ById('btPowerBarOpener').addEventListener ('mousedown', mouseMainTab, false);
			}
			if (open) jQuery('#btPowerBarButtons').removeClass("divHide");
			else jQuery('#btPowerBarButtons').addClass("divHide");
		}
		t.CheckDashPosition();
		t.CheckChatPosition();
		t.PowerBar = tf;
		t.PowerBarOpen = open;
	},

	e_TogglePowerBar : function (){
		var t = WideScreen;
		GlobalOptions.btPowerBarOpen = !GlobalOptions.btPowerBarOpen;
		saveGlobalOptions();
		t.setPowerBar(true,GlobalOptions.btPowerBarOpen);
	},

	getTop : function (elm) {
		var y = 0;
		y = elm.offsetTop;
		elm = elm.offsetParent;
		while(elm != null) {
			y = parseInt(y) + parseInt(elm.offsetTop);
			elm = elm.offsetParent;
		}
		return y;
	},

	ShowDashboard : function (tf) {
		Options.btDashboard = tf;
		saveOptions();
		WideScreen.setDashboard(tf);
	},

	setDialogContainerStyles : function () {
		var t = WideScreen;
		GM_addStyle ('.modalCurtain {left:'+t.PowerBarWidth+'px !important;top:'+t.OffsetTop+'px !important;width:768px !important}');
		GM_addStyle ('.curtainMM{left:'+t.PowerBarWidth+'px !important;top:'+t.OffsetTop+'px !important;width:768px !important}');
		GM_addStyle ('.dialogContainer {left:'+t.PowerBarWidth+'px !important;top:'+t.OffsetTop+'px !important;width:768px !important}');
		GM_addStyle ('.notificationMessageDialog {margin-top:60px !important}');
		GM_addStyle ('div.largeModal {left:'+(27+t.PowerBarWidth)+'px !important;top:'+(5+t.OffsetTop)+'px !important}');
		GM_addStyle ('div.xLargeModal {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(60+t.OffsetTop)+'px !important}');
		GM_addStyle ('div.mediumModal {left:'+(120+t.PowerBarWidth)+'px !important;top:'+(60+t.OffsetTop)+'px !important}');
		GM_addStyle ('div.smallModal {left:'+(200+t.PowerBarWidth)+'px !important;top:'+(190+t.OffsetTop)+'px !important}');
		GM_addStyle ('div.newGame {left:'+(7+t.PowerBarWidth)+'px !important;top:'+(5+t.OffsetTop)+'px !important}');
		GM_addStyle ('.animatedChestModal {left:'+(85+t.PowerBarWidth)+'px !important;top:'+(100+t.OffsetTop)+'px !important}');
		GM_addStyle ('.guardianModal {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(200+t.OffsetTop)+'px !important}');
		GM_addStyle ('.choose_modal {left:'+(55+t.PowerBarWidth)+'px !important;top:'+(110+t.OffsetTop)+'px !important}');
		GM_addStyle ('.guardian_item {left:'+(225+t.PowerBarWidth)+'px !important;top:'+(155+t.OffsetTop)+'px !important}');
		GM_addStyle ('.nomadModal {left:'+(40+t.PowerBarWidth)+'px !important;top:'+(40+t.OffsetTop)+'px !important}');
		GM_addStyle ('.alliance_patch {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(t.OffsetTop)+'px !important;}');
		GM_addStyle ('.alliance_layover {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(127+t.OffsetTop)+'px !important;}');
		GM_addStyle ('.alliance_layover_stats {left:'+(187+t.PowerBarWidth)+'px !important;top:'+(102+t.OffsetTop)+'px !important}');
		GM_addStyle ('.chancellorModal {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(5+t.OffsetTop)+'px !important}');
		GM_addStyle ('.mine_view {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(5+t.OffsetTop)+'px !important}');
		GM_addStyle ('.vaultModal {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(5+t.OffsetTop)+'px !important}');
		GM_addStyle ('div.templeModal.cmModal1 {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(5+t.OffsetTop)+'px !important}');
		GM_addStyle ('.claimgiftWhFb {left:'+(5+t.PowerBarWidth)+'px !important;top:'+(5+t.OffsetTop)+'px !important}');
		GM_addStyle ('.Champion .champItemHover {margin-top:-'+(4+t.OffsetTop)+'px !important}');
	},
}

/** Afk detector **/

var afkdetector = {
	target : 120, // default check every 2 mins
	counter : 1,
	isAFK : true, // always begin in AFK mode! This will allow tower to revert following autoport

	init : function () {
		var t = afkdetector;
		if (parseIntNan(Options.AFKTimeout) < 1) Options.AFKTimeout = 1;
		t.target = Options.AFKTimeout*60;
		document.body.onmousemove = t.clear;
		document.body.onkeypress = t.clear;
	},

	check : function () {
		var t = afkdetector;
		if (!t.isAFK) {
			t.counter++;
			if (t.counter >= t.target) {
				if (GlobalOptions.ExtendedDebugMode) actionLog('afk detected');
				t.isAFK = true;
			}
		}
	},
	clear : function () {
		var t = afkdetector;
		t.counter = 1;
		if (t.isAFK) {
			if (GlobalOptions.ExtendedDebugMode) actionLog('afk cleared');
			t.isAFK = false;
		}
	},
	reset : function () {
		var t = afkdetector;
		if (parseIntNan(Options.AFKTimeout) < 1) Options.AFKTimeout = 1;
		t.target = Options.AFKTimeout*60;
		t.counter = 1;
		t.isAFK = false;
	},
}

function createButton (label,id){
	var a=document.createElement('a');
	a.className='button20';
	a.id = id;
	a.innerHTML='<span style="color: #ff6">'+ label +'</span>';
	return a;
}

function AddMainTabLink (text, id, eventListener, mouseListener) {
	var a = createButton (text,id);
	a.className='tab';
	var tabs=ById('main_engagement_tabs');
	if (tabs) {
		gmTabs = SetupMainTab(tabs);
		if (gmTabs) {
			gmTabs.appendChild(a);
			a.addEventListener('click',eventListener, false);
			if (mouseListener != null) { a.addEventListener('mousedown',mouseListener, true); }
			if (id != null) { a.id = id; }
			return a;
		}
	}
	return null;
}

function AddSubTabLink (text, eventListener, id, colourclass) {
	var a = createButton (text,id);
	if (colourclass == null) colourclass = 'blue20';
	a.className='inlineButton btButton '+colourclass;
	a.style.paddingLeft = '2px';
	var tabs=ById('main_engagement_tabs');
	if (tabs) {
		gmTabs = SetupSubTab(tabs);
		if (gmTabs) {
			gmTabs.appendChild(a);
			a.addEventListener('click',eventListener, false);
			if (id != null) { a.id = id; }
			return a;
		}
	}
	return null;
}

function SetToggleButtonState (entity,tf,text) {
	var btn = ById(entity+'ToggleTab');
	if (btn) {
		if (tf) { btn.innerHTML = '<span style="color: #FFFF00">'+tx(text)+': '+tx('On')+'</span>'; }
		else { btn.innerHTML = '<span style="color: #CCC">'+tx(text)+': '+tx('Off')+'</span>'; }
	}
}

function SetupMainTab (tabs) {
	var e = tabs.parentNode;
	var gmTabs = null;
	for (var i=0; i<e.childNodes.length; i++) {
		var ee = e.childNodes[i];
		if (ee.tagName && ee.tagName=='DIV' && ee.className=='tabs_engagement' && ee.id!='main_engagement_tabs' && ee.id!='pbp_subtab') {
			gmTabs = ee;
			break;
		}
	}
	if (gmTabs == null) {
		gmTabs = document.createElement('div');
		gmTabs.className='tabs_engagement';
		tabs.parentNode.insertBefore (gmTabs, tabs);
	}
	gmTabs.style.height='0%';
	gmTabs.style.paddingLeft='0px';
	gmTabs.style.width='100%';
	gmTabs.style.whiteSpace='nowrap';
	gmTabs.style.overflow='auto';
	gmTabs.lang = 'en_PB';
	return gmTabs;
}

function SetupSubTab (tabs) {
	var e = tabs.parentNode;
	var gmTabs = null;
	for (var i=0; i<e.childNodes.length; i++) {
		var ee = e.childNodes[i];
		if (ee.tagName && ee.tagName=='DIV' && ee.className=='tabs_engagement' && ee.id=='pbp_subtab') {
			gmTabs = ee;
			break;
		}
	}
	if (gmTabs == null) {
		gmTabs = document.createElement('div');
		gmTabs.className='tabs_engagement';
		gmTabs.id='pbp_subtab';
		tabs.parentNode.insertBefore (gmTabs, tabs);
	}
	gmTabs.style.height='0%';
	gmTabs.style.paddingLeft='5px';
	gmTabs.style.width='100%';
	gmTabs.style.whiteSpace='nowrap';
	gmTabs.style.overflow='auto';
	gmTabs.lang = 'en_PB';
	return gmTabs;
}

function AddPowerBarLink (text, id, eventListener, mouseListener) {
	var PBX = ById('btPowerBarExtra');
	if (!PBX || !GlobalOptions.btPowerBarPopups) {
		AddMainTabLink (text.toUpperCase(), id, eventListener, mouseListener);
		return;
	}

	var a=document.createElement('a');
	a.className='TextLink';
	a.innerHTML='<div class="buttonv2 std blue">'+ text +'</div>';

	PBX.appendChild(a);
	a.addEventListener('click',eventListener, false);
	if (mouseListener != null)
		a.addEventListener('mousedown',mouseListener, true);
	if (id != null)
		a.id = id;
	return a;
}

function mouseMainTab (me) { // right-click on main button resets window location
	if (me.button == 2){
		var c = getClientCoords (ById('main_engagement_tabs'));
		mainPop.setLocation ({x: c.x+4, y: c.y+c.height});
	}
}

function eventHideShow () {
	if (mainPop.toggleHide(mainPop)){
		tabManager.showTab(false);
		Options.btWinIsOpen = true;
	} else {
		tabManager.hideTab();
		Options.btWinIsOpen = false;
	}
	saveOptions();
}

function DefaultWindowPos(OptPos,elem,force) {
	if (force || (Options[OptPos]==null) || (Options[OptPos].x==null) || (Options[OptPos].x=='') || (isNaN(Options[OptPos].x))) {
		var c = getClientCoords (ById(elem));
		Options[OptPos].x = c.x+4;
		Options[OptPos].y = c.y+c.height;
		saveOptions();
	}
}

function ToggleDivDisplay(form,h,w,div, autoclose) {
	var dc = jQuery('#'+div).attr('class');
	if (dc) {
		if (dc.indexOf('divHide') >= 0) {
			jQuery('#'+div).attr('class','');
			jQuery('#'+div+'Arrow').attr('src',DownArrow);
			if (autoclose) {
				lastdiv = "";
				if (OpenDiv[form]) {
					lastdiv = OpenDiv[form];
				}
				if (lastdiv != "") {
					ToggleDivDisplay(form,h,w,lastdiv);
				}
				OpenDiv[form] = div;
			}
		}
		else {
			jQuery('#'+div).attr('class','divHide');
			jQuery('#'+div+'Arrow').attr('src',RightArrow);
			if (autoclose) { OpenDiv[form] = '';}
		}
	}
	else
	{
		jQuery('#'+div).attr('class','divHide');
		jQuery('#'+div+'Arrow').attr('src',RightArrow);
		if (autoclose) { OpenDiv[form] = '';}
	}
	if (form) ResetFrameSize(form,h,w);
}

function ToggleMainDivDisplay(form,h,w,div, autoclose, opt) {
	var dc = jQuery('#'+div).attr('class');
	if (dc) {
		if (dc.indexOf('divHide') >= 0) {
			jQuery('#'+div).attr('class','');
			jQuery('#'+div+'Arrow').attr('src',DownArrow);
			if (autoclose) {
				lastdiv = "";
				if (OpenDiv[form]) {
					lastdiv = OpenDiv[form];
				}
				if (lastdiv != "") {
					ToggleDivDisplay(form,h,w,lastdiv);
				}
				OpenDiv[form] = div;
				if (opt) { Options[opt] = div; }
			}
		}
		else {
			jQuery('#'+div).attr('class','divHide');
			jQuery('#'+div+'Arrow').attr('src',RightArrow);
			if (autoclose) {
				OpenDiv[form] = '';
				if (opt) { Options[opt] = ''; }
			}
		}
	}
	else
	{
		jQuery('#'+div).attr('class','divHide');
		jQuery('#'+div+'Arrow').attr('src',RightArrow);
		if (autoclose) { OpenDiv[form] = '';}
	}
	ResetFrameSize('btMain',h,w);
}

function ResetFrameSize(prefix,minheight,minwidth) {
	var h1 = ById(prefix+'_bar');
	var h2 = ById(prefix+'_content');
	if (!h1 || !h2) return;
	var h = h1.clientHeight + h2.clientHeight;
	if (h < minheight) h = minheight;
	jQuery('#'+prefix+'_outer').css('height',h+10);

	w = ById(prefix+'_content').clientWidth;
	w2 = ById(prefix+'_outer').clientWidth;
	if (w < minwidth) w = minwidth;
	if (w2 < w) // I don't know why I need this.. must look at this later to try and get it to shrink again
		jQuery('#'+prefix+'_outer').css('width',w+10);
}

function UpdateMarch (cityId,marchId) {
	if (!Seed.queue_atkp["city"+cityId]["m"+marchId]) { return; }
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.rid = marchId;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMarch.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.march) {
				var now = unixTime();
				if (Seed.queue_atkp["city"+cityId]["m"+marchId] && Seed.queue_atkp["city"+cityId]["m"+marchId].destinationUnixTime && Seed.queue_atkp["city"+cityId]["m"+marchId].destinationUnixTime<now && rslt.march.marchStatus==1) {
					logit('Fixing march status...');
					rslt.march.marchStatus=7;
					Seed.queue_atkp["city"+cityId]["m"+marchId].marchStatus=7;
				}
				if (local_atkp["m"+marchId]) {
					for (var y in rslt.march) {
						local_atkp["m"+marchId][y] = rslt.march[y];
					}
					local_atkp["m"+marchId].btIncomplete = false;
					// champion on march?
					if (rslt.march.championId && (rslt.march.championId != 0) && !local_atkp["m"+marchId].championInfo) {
						for (var y in Seed.champion.champions) {
							if (Seed.champion.champions[y].championId == rslt.march.championId) {
								marchChamp = {};
								marchChamp.name = Seed.champion.champions[y].name; // lazy. We'll use city stats to show champ data
								local_atkp["m"+marchId].championInfo = marchChamp;
								break;
							}
						}
					}
					if (rslt.march.toPlayerId && (rslt.march.toPlayerId != 0) && !Seed.players["u"+rslt.march.toPlayerId]) {
						updatePlayers(rslt.march.toPlayerId);
					}
				}
			}
		},
		onFailure: function () {
			local_atkp["m"+marchId].btRequestSent = 0; // try again
		}
	},true); // no retry
}

function UpdateIncomingMarch (marchId) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.rid = marchId;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMarch.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (local_atkinc["m"+marchId]) {
				for (var y in rslt.march) {
					local_atkinc["m"+marchId][y] = rslt.march[y];
				}
				local_atkinc["m"+marchId].btIncomplete = false;
			}
		},
		onFailure: function () {
			local_atkinc["m"+marchId].btRequestSent = 0; // try again
		}
	},true); // no retry
}

function updatePlayers (uid){
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.uid = uid;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rsltInfo) {
			if (!rsltInfo.ok) { return; }
			NewPlayer = {};
			NewPlayer.n = rsltInfo.userInfo[0].name;
			NewPlayer.t = rsltInfo.userInfo[0].title;
			NewPlayer.m = rsltInfo.userInfo[0].might;
			NewPlayer.a = rsltInfo.userInfo[0].allianceId;
			Seed.players["u"+uid] = uWCloneInto(NewPlayer);
		},
	},true);
}

function getChampionStatus (champId) {
	var status = "";
	for (var y in Seed.champion.champions) {
		citychamp = Seed.champion.champions[y];
		if (citychamp.championId == champId) {
			status = citychamp.status||"";
			break;
		}
	}
	return status;
}

function getChampionCity (champId) {
	var cid = 0;
	for (var y in Seed.champion.champions) {
		citychamp = Seed.champion.champions[y];
		if (citychamp.championId == champId) {
			cid = citychamp.assignedCity||0;
			break;
		}
	}
	return cid;
}

function getCityChampion (cid) {
	var citychamp;
	var gotchamp = false;
	for (var y in Seed.champion.champions) {
		citychamp = Seed.champion.champions[y];
		if (citychamp.assignedCity && citychamp.assignedCity == cid) {
			gotchamp = true;
			break;
		}
	}
	if (gotchamp) { return citychamp; }
	else { return {championId:0};}
}

function SetChampionIcon (){
	var e = ById('maparea_boosts_champion');
	if (!e) {
		e = document.createElement ('table');
		e.height = "20";
		e.style.cssFloat = 'left';
		e.style.border = '1px';
		e.style.borderSpacing = '1px';
		e.style.borderCollapse = 'separate';
		e.style.backgroundColor = '#fff';
		e.id = 'maparea_boosts_champion';
		e.className = 'trimg';
		ById('maparea_boosts').appendChild (e);
		ById('maparea_boosts').style.zIndex = '20001';
	}
	var citychamp = getCityChampion(uW.currentcityid);
	if (citychamp.championId) {
		e.style.display = 'block';
		e.innerHTML = '<tr><td id=maparea_boosts_championtd class="xtab trimg" style="padding:0px;"><img style="margin-left:0px;" id=maparea_boosts_champion_image height=18 src="'+ChampImagePrefix+citychamp.avatarId+ChampImageSuffix+'"></td></tr>'

		function FNChampPopup () {uW.btCreateChampionPopUp(e,citychamp.assignedCity,true,null,true);}
		function FNChampClear () {uW.removeTooltip();}
		ById('maparea_boosts_champion_image').addEventListener('mouseover',FNChampPopup,false);
		ById('maparea_boosts_champion_image').addEventListener('mouseout',FNChampClear,false);
	}
	else {
		e.style.display = 'none';
	}
}

function BuildChampData (champItems,championId) {
	var effectTiers = CE_EFFECT_TIERS;
	var res = {};
	res.equippedchampstats = JSON.parse(JSON.stringify(BaseChamp));
	res.equippedtroopstats = {};
	res.equippedbossstats = {};
	res.SetBonus = {};
	res.SteelHoofCount = 0;
	res.LightBringerCount = 0;
	res.DragonScaleCount = 0;
	res.WildHideCount = 0;
	res.VespersCount = 0;
	res.SilverCount = 0;
	res.TestCount = 0;
	res.might = 0;

	for (var y in champItems) { // calculate unique set bonuses
		var item = champItems[y];
		if (item.equippedTo && item.equippedTo==championId) {
			if (!item.quality) item.quality = parseIntNan(item.rarity);
			item.level = parseIntNan(item.level);
			if (SteelHoofItems.indexOf(parseIntNan(item.unique)) !== -1) { res.SteelHoofCount++ }
			if (LightBringerItems.indexOf(parseIntNan(item.unique)) !== -1) { res.LightBringerCount++ }
			if (DragonScaleItems.indexOf(parseIntNan(item.unique)) !== -1) { res.DragonScaleCount++ }
			if (TestItems.indexOf(parseIntNan(item.unique)) !== -1) { res.TestCount++ }
			if (WildHideItems.indexOf(parseIntNan(item.unique)) !== -1) { res.WildHideCount++ }
			if (VespersItems.indexOf(parseIntNan(item.unique)) !== -1) { res.VespersCount++ }
			if (SilverItems.indexOf(parseIntNan(item.unique)) !== -1) { res.SilverCount++ }

			for (var e in item.effects) {
				if (Number(e) <= Number(item.rarity)) {
					var id = item.effects[e].id;
					if (id >= 300 && id < 400) {
						var Set = item.set;
						var tier = item.effects[e].tier;
						if (id==312) Set = 'U';
						if (id==313) Set = 'N';
						if (id==314) Set = 'D';
						var S = effectTiers;
						var P = id + "," + tier
						var TV = S[P];
						while (!TV && (tier > 0)) { tier--;P=id+","+tier;TV=S[P]; }
						if (TV) {
							var base = +TV.Base || 0;
							var growth = +TV.Growth || 0;
							var level = Number(item.level) || 0;
							percent = Number(base + (level * growth));
							if (!res.SetBonus[Set]) { res.SetBonus[Set] = 0; }
							res.SetBonus[Set] += percent;
						}
					}
				}
			}
		}
	}
	for (var y in champItems) {
		var item = champItems[y];
		if (item.equippedTo && item.equippedTo==championId) {
			if (!item.quality) item.quality = parseIntNan(item.rarity);
			item.level = parseIntNan(item.level);
			res.might += CardMight(item,true);
			for (var e in item.effects) {
				if (Number(e) <= Number(item.rarity)) {
					var id = item.effects[e].id;
					var tier = item.effects[e].tier;
					var S = effectTiers;
					var P = id + "," + tier;
					var TV = S[P];
					while (!TV && (tier > 0)) { tier--;P=id+","+tier;TV=S[P]; }
					if (TV) {
						var base = +TV.Base || 0;
						var growth = +TV.Growth || 0;
						var level = Number(item.level) || 0;
						var bonus = 0;
						if (id<300 || id>=400) {
							bonus = res.SetBonus[item.set] || 0;
							if (item.unique && item.unique!=0 && res.SetBonus['U']) bonus += res.SetBonus['U'];
							if ((!item.unique || item.unique==0) && res.SetBonus['N']) bonus += res.SetBonus['N'];
							//if (SetBonus['D']) bonus += res.SetBonus['D'];
						}
						var percent = Number(base + ((level * level + level) * growth * 0.5));
						if (id >= 300) {
							percent = Number(base + (level * growth));
						}
						if (id>=400) {
							if (!res.equippedbossstats[item.unique]) { res.equippedbossstats[item.unique] = {}; }
							if (!res.equippedbossstats[item.unique][id]) { res.equippedbossstats[item.unique][id] = 0; }
							res.equippedbossstats[item.unique][id] += percent + (percent*bonus); // can this apply to boss stats?
						}
						else {
							if (id>=200) {
								var chAdj = 0;
								if (id==201 && item.unique && item.unique!=0 && res.VespersCount>=0) { chAdj = 0.05; }
								if (!res.equippedchampstats[id]) { res.equippedchampstats[id] = 0; }
								res.equippedchampstats[id] += percent + (percent*bonus);
								res.equippedchampstats[id] += (percent*chAdj);
							}
							else {
								if (!res.equippedtroopstats[id]) { res.equippedtroopstats[id] = 0; }
								res.equippedtroopstats[id] += percent;
							}
						}
					}
				}
			}
		}
	}
	return res;
}

/** main loop **/

function EverySecond () {
	try {

		SecondLooper = SecondLooper+1;

		inc = [];
		incCity = [];

		/* check local marches still exist */

		for(var n in local_atkinc) {
			if (!Seed.queue_atkinc[n]) { delete local_atkinc[n]; }
		}

		for(var n in Seed.queue_atkinc) {
			if (Seed.queue_atkinc[n].marchType) {
				inc.push(Seed.queue_atkinc[n]);
				/* check and copy to local */
				Copy_Local_ATKINC(n);
			}
		}
		inc.sort(function(a, b){ if(!a.arrivalTime) a.arrivalTime = -1; if(!b.arrivalTime) b.arrivalTime = -1;return a.arrivalTime-b.arrivalTime });

		try {
			CheckForIncoming();
		}
		catch (err) {
			logerr(err); // write to log
		}

		out = [];
		outCity = [];

		for(var n in Seed.queue_atkp) {
			for(var m in Seed.queue_atkp[n]) {
				if (Seed.queue_atkp[n][m].marchType && (parseInt(Seed.queue_atkp[n][m].marchType) != 9)) { // no raids!
					Copy_Local_ATKP(n,m);
					var marchobj = local_atkp[m];
					out.push(marchobj);
					if (marchobj.marchCityId == Dashboard.CurrentCityId) {
						outCity.push(marchobj);
					}
				}
			}

		}
		out.sort(function(a, b){ return /*a.destinationUnixTime-b.destinationUnixTime*/ });
		outCity.sort(function(a, b){ return a.destinationUnixTime-b.destinationUnixTime });

		/* Periodically remember window positions in Chrome because onbeforeunload doesn't work */

		if (FFVersion.Browser=="Chrome" && (SecondLooper % MinuteInterval) == 1) {
			RememberWindowPositions();
			saveOptions();
		}

		/* Check Throne Preset hasn't changed */

		if (CurrPreset != Seed.throne.activeSlot) { Dashboard.PaintTRPresets(); }

		/* Update Dashboard */

		if (popDash && Dashboard.Loaded) { Dashboard.EverySecond(); };

		/* Update Incoming and Outgoing and March popups */

		if (popInc) { Incoming.EverySecond(); };
		if (popOut) { Outgoing.EverySecond(); };
		if (popMarch) { QuickMarch.EverySecond(); };

		/* loop through tabs */

		tabManager.EverySecond();

		/* check for afk */

		afkdetector.check();

		/* display/clean up ajax log */

		var activity = 0;
		var now = unixTime();
		for(var aj=AJAX_LOG.length-1;aj>=0;aj--) {
			if (AJAX_LOG[aj].timestamp<(now-60)) {
				AJAX_LOG.splice(aj,1);
			}
			else {
				if (AJAX_LOG[aj].timestamp>(now-20)) {
					activity++;
				}
			}
		}
		if (Options.ShowServerTraffic) {
			activity = activity*3;
			var trafficcolor = '#0F0';
			if (activity>75) { trafficcolor = '#FF0'; }
			if (activity>150) { trafficcolor = '#FA0'; }
			if (ById('btTraffic')) {
				ById('btTraffic').innerHTML = activity+tx('/min');
				ById('btTraffic').style.color = trafficcolor;
			}
		}

		/* restart loop */

		SecondTimer = setTimeout(EverySecond,1000);
	}
	catch (err) {
		logerr(err); // write to log
		SecondTimer = setTimeout(EverySecond,1000);
	}
}

function CheckForIncoming () {
	var atype = "";
	var atime = "";
	var to = "";
	var name = "";
	var who = "";
	var bywho = "";

	var soonest = {};
	soonest.arrivalTime = -1;
	var soonestattack = false;

	Dashboard.StillComing = false;
	var PopupVisible = false;

	// Find big popup gem container element if it exists..

	var el1, el2, el3;
	if (typeof Array.filter == 'function') { // legacy browsers
		el1 = ByCl('primarytitlebar');
		el2 = ByCl('gemContainer');
		el3 = Array.filter( el2, function(elem){ return Array.indexOf( el1, elem.parentNode ) > -1; });
	}
	else {
		el1 = Object.values(ByCl('primarytitlebar'));
		el2 = Object.values(ByCl('gemContainer'));
		el3 = el2.filter(function(elem){ return el1.indexOf(elem.parentNode) > -1; });
	}

	for (var e=0;e<el3.length;e++) {
		PopupVisible = true;
		GemContainer = el3[e];
		if (!Dashboard.Incoming) SaveGemHTML2 = GemContainer.innerHTML;
	}

	if (ChampionDelayer>0) {
		ChampionDelayer--
	}

	if (!PopupVisible) { // override main screen gem container
		for (var e=0;e<el2.length;e++) {
			GemContainer = el2[e];
			if (!Dashboard.Incoming) SaveGemHTML = GemContainer.innerHTML;
			GemContainer.style.height = 40+'px';
			GemContainer.style.marginTop = 2+'px';
			GemContainer.id = 'btGemContainer';
			break;
		}
	}

	CanNotify = ById('btGemContainer');

	for(n in inc) {
		var a = inc[n];
		if (!a.score) continue;
		if (a.marchType == null) continue; // bogus march (returning scouts)
		if (a.arrivalTime >= 0 && (a.arrivalTime < unixTime())) {
			continue; // don't display arrival times already happened
		}
		Dashboard.StillComing = true;
		if ((a.arrivalTime >= 0 && (a.arrivalTime < soonest.arrivalTime)) || (soonest.arrivalTime == -1)) {
			soonest = a;
			if (!soonest.arrivalTime) soonest.arrivalTime = -1;
		}
		if (a.arrivalTime >= 0) {
			if (a.arrivalTime - unixTime() < 2) { // auto-replace defending troops
				if (Seed.citystats["city" + a.toCityId].gate != 0) { // only do this if defending
					// save defending unit configuration
					if (Options.DashboardOptions.ReplaceDefendingTroops[Cities.byID[a.toCityId].idx] && SelectiveDefending) {
						Dashboard.AttackedCity = a.toCityId;
						Dashboard.StoreDefendingTroops(Dashboard.AttackedCity);
					}
					setTimeout(function() {Dashboard.ForceTries = 0;Dashboard.ForceUpdateSeed();},3000); // force update defending troops immediately after attacks land
				}
			}
			if (a.marchType==4) { // set champ on attack only
				soonestattack = true;
				var changeok = (Options.TowerOptions && Options.TowerOptions.SaveCityState[a.toCityId] && Options.TowerOptions.SaveCityState[a.toCityId].ChangeChampion); // only if tower alerted
				if (Options.TowerOptions.ChangeChamp && changeok && a.arrivalTime - unixTime() <= parseIntNan(Options.TowerOptions.ChampTime)) { // auto-assign champion
					if (ChampionDelayer==0) {
						var currChamp = getCityChampion(a.toCityId).championId;
					if (Options.TowerOptions.ChampId !=0 && currChamp != Options.TowerOptions.ChampId && (currChamp==0 || !Options.TowerOptions.ChampNoChamp)) {
							if (getChampionStatus(Options.TowerOptions.ChampId)=="10") {
								actionLog('Champion is marching - Cannot assign','TOWER');
							}
							else {
								if (currChamp!=0 && getChampionStatus(currChamp)=="10") {
									actionLog(Cities.byID[a.toCityId].name+': Current Champion is marching - Cannot unassign','TOWER');
								}
								else {
									actionLog(Cities.byID[a.toCityId].name+': Assigning Champion','TOWER');
									SwitchChampion(a.toCityId,Options.TowerOptions.ChampId);
								}
							}
							ChampionDelayer=3; // only try every 3 seconds
						}
					}
				}
			}
		}
		if (soonest.arrivalTime >= 0 && soonestattack) {
			break;
		}
	}

	if (Dashboard.StillComing) {
		if (soonest.marchType && (soonest.marchType == 3)) atype = '<img style="border:2px ridge #00A;width:15px;height:15px;" src='+ScoutImage+'>';
		else atype = '<img style="border:2px ridge #A00;width:15px;height:15px;" src='+AttackImage+'>';
		to = Cities.byID[soonest.toCityId];
		if (to && to.tileId == soonest.toTileId ) name = to.name;
		else name = "Wilderness";

		if (soonest.arrivalTime != -1) atime = CM.TimeFormatter.format(parseInt(soonest.arrivalTime-unixTime()));
		else atime = '??????';
		if (soonest.pid && Seed.players['u'+soonest.pid]) {who = Seed.players['u'+soonest.pid].n; bywho = ' by '+MonitorLink(soonest.pid,who,"AlertLink");}
		else { bywho = '&nbsp;&nbsp;(Upgrade WatchTower)' ;}

		msgcontainer = '<div class="textContainer" style="margin-left:-10px;padding-top:0px;">';
		msglink1 = '<a class="AlertLink" id='
		msglink2 = '>';
		msglink3 = '</a>';
		msgtable = '<div class="AlertStyle"><table border=0><tr><td class="AlertContent"><div style="text-align:center;width:86px">&nbsp;&nbsp;'+atime+'</div></td><td class="AlertContent" style="padding-top:3px;">'+atype+'</td><td class="AlertContent"><div style="color:#ecddc1;text-shadow: 0px 0px 15px #000;">';
		msgend = '</div></td></tr></table></div>';
		if (Options.OverrideAttackAlert) {
			if (CanNotify) {
				ById('btGemContainer').innerHTML = msgcontainer+msgtable+msglink1+'btAlertIncoming'+msglink2+name+msglink3+msgend+'</div><center>'+bywho+'</center>';
				ById('btGemContainer').style.display = 'block';
				ById('btAlertIncoming').addEventListener ('click', function(){Dashboard.show(to)}, false);
				jQuery('.alliance_patch').hide();
			}
			if (PopupVisible) {
				GemContainer.innerHTML = msgcontainer+msgtable+msglink1+'btAlertIncoming2'+msglink2+name+msglink3+msgend+'</div>';
				GemContainer.style.width=250+'px';
				ById('btAlertIncoming2').addEventListener ('click', function(){Dashboard.show(to)}, false);
			}
		}
	}

	if (Dashboard.Incoming && !Dashboard.StillComing) {
		if (Options.OverrideAttackAlert) {
			if (CanNotify) {
				ById('btGemContainer').innerHTML = SaveGemHTML;
				if (jQuery('#ahqbutton').hasClass('sel')) {
					ById('btGemContainer').style.display = 'none';
					jQuery('.alliance_patch').show();
				}
			}
			if (PopupVisible) {
				GemContainer.innerHTML = SaveGemHTML2;
			}
		}
	}

	Dashboard.Incoming = Dashboard.StillComing;

	// check for city incoming

	if (popDash && (Dashboard.CurrentCityId != 0)) {
		var citysoonest = {};
		citysoonest.arrivalTime = -1;

		Dashboard.CityStillComing = false;

		for(n in inc) {
			var a = inc[n];
			if (!a.score) continue;
			if (a.arrivalTime >= 0 && (a.arrivalTime < unixTime())) continue; // don't display arrival times already happened
			if (inc[n].toCityId == Dashboard.CurrentCityId) {
				Dashboard.CityStillComing = true;
				if ((a.arrivalTime >= 0 && (a.arrivalTime < citysoonest.arrivalTime)) || (citysoonest.arrivalTime == -1)) {
					citysoonest = a;
					if (!citysoonest.arrivalTime) citysoonest.arrivalTime = -1;
					if (citysoonest.arrivalTime > 0) break;
				}
			}
		}

		if (Dashboard.CityStillComing) {
			if (citysoonest.arrivalTime != -1) atime = CM.TimeFormatter.format(parseInt(citysoonest.arrivalTime-unixTime()));
			else atime = '??????';
			msgcontainer = '<div class="textContainer" style="margin-right:-20px;padding-top:0px;">';
			msgtable = '<div class="AlertStyle" style="text-align:center;width:110px"><table border=0><tr><td class="AlertContent"><div style="text-align:center;width:86px">&nbsp;'+atime;
			msgend = '</div></td></tr></table></div>';
			ById('btCityAlert').innerHTML = msgcontainer+msgtable+msgend+'</div>';
		}

		if (Dashboard.CityIncoming && !Dashboard.CityStillComing) {
			ById('btCityAlert').innerHTML = "";
		}

		Dashboard.CityIncoming = Dashboard.CityStillComing;
	}
}

function Copy_Local_ATKP(cid,mid) {
	var now = unixTime();
	if (Seed.queue_atkp[cid][mid].marchStatus==0) return;
	if (!local_atkp[mid] || (Seed.queue_atkp[cid][mid].marchUnixTime!=local_atkp[mid].marchUnixTime) || (Seed.queue_atkp[cid][mid].returnUnixTime!=local_atkp[mid].returnUnixTime)) { // add new march, or newly recalled march
		var march = new Object();
		for (var p in Seed.queue_atkp[cid][mid]) {
			march[p] = Seed.queue_atkp[cid][mid][p];
		}
		local_atkp[mid] = march;
		local_atkp[mid].marchCityId = cid.split("city")[1]; // from city
		if (!local_atkp[mid].marchId) {
			local_atkp[mid].marchId = mid.split("m")[1]; // march id
		}
		local_atkp[mid].btIncomplete = true;
		local_atkp[mid].btRequestSent = 0;
	}

	var destinationUnixTime = local_atkp[mid].destinationUnixTime - now;
	var returnUnixTime = local_atkp[mid].returnUnixTime - now;
	var marchStatus = parseInt(local_atkp[mid].marchStatus);
	if (destinationUnixTime < 0 && marchStatus != 2 && marchStatus != 8 && marchStatus != 7 && marchStatus != 0 && returnUnixTime > 0) { // refresh return journey
		local_atkp[mid].btIncomplete = true; // force a march refresh
	}

	if (local_atkp[mid].btIncomplete == true && Options.FetchMarchInfo) {
		if (local_atkp[mid].btRequestSent > 0) {
			local_atkp[mid].btRequestSent = local_atkp[mid].btRequestSent - 1;
		}
		else {
			local_atkp[mid].btRequestSent = 5; // delay any further requests for 5 seconds
			setTimeout(UpdateMarch,2000,local_atkp[mid].marchCityId,local_atkp[mid].marchId); // 2 sec delay on this
		}
	}
}

function Copy_Local_ATKINC(mid) {
	if (!local_atkinc[mid] || (Seed.queue_atkinc[mid].marchUnixTime!=local_atkinc[mid].marchUnixTime)) { // new march
		var march = new Object();
		for (var p in Seed.queue_atkinc[mid]) {
			march[p] = Seed.queue_atkinc[mid][p];
		}
		local_atkinc[mid] = march;
		local_atkinc[mid].btIncomplete = true;
		local_atkinc[mid].btRequestSent = 0;
		if (!local_atkinc[mid].marchId) {
			local_atkinc[mid].marchId = mid.split("m")[1]; // march id
		}
	}

	if (local_atkinc[mid].score) {
		// build an array of cities under attack
		var to = Cities.byID[local_atkinc[mid].toCityId];
		if (to) {
			if (incCity.indexOf(to.idx) < 0) incCity.push(to.idx);
		}
	}

	if (local_atkinc[mid].btIncomplete == true && Options.FetchMarchInfo) {
		if (local_atkinc[mid].btRequestSent > 0) {
			local_atkinc[mid].btRequestSent = local_atkinc[mid].btRequestSent - 1;
		}
		else {
			local_atkinc[mid].btRequestSent = 5; // delay any further requests for 5 seconds
			setTimeout(UpdateIncomingMarch,2000,local_atkinc[mid].marchId); // 2 sec delay on this
		}
	}
}

/** Standard Functions **/

function translate (str) {
	if (LanguageArray[str]) { str = LanguageArray[str]; }
	else { NoTranslation[str] = ""; }
	return str;
}

function tx(str) {return translate(str);}
function ById(id) {return document.getElementById(id);}
function ByCl(cn) {return document.getElementsByClassName(cn);}

function CheckForHTMLChange (panel,div,newHTML,wait) {
	var oldHTML = HTMLRegister[panel][div];
	if (!wait && (oldHTML != newHTML)) {
		ById(div).innerHTML = newHTML;
		HTMLRegister[panel][div] = newHTML;
		return true;
	}
	return false;
};

function ResetHTMLRegister (panel,div) {
	HTMLRegister[panel][div] = '';
};

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function getAbsoluteOffsets(e) {
	ret = { left: 0, top: 0 };
	while (e.offsetParent) {
		if (e.style.position == 'absolute') break;
		ret.left += e.offsetLeft - e.scrollLeft;
		ret.top += e.offsetTop - e.scrollTop;
		e = e.offsetParent;
	}
	return ret;
}

function getOffset(el) {
	ret = { left: 0, top: 0 };
	while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		ret.left += el.offsetLeft - el.scrollLeft;
		ret.top += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return ret;
}

function getStyle(x,styleProp) {
	if (x.currentStyle)
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
}

function getFirefoxVersion() {
	var ver = '',
		i;
	var ua = navigator.userAgent;
	if (ua) {
		i = ua.indexOf('CometBird/');
		if (i >= 0) return {'Browser':'CometBird','Version':ua.substr(i + 10).split(' ')[0],'Mozilla':true};
		i = ua.indexOf('OPR/');
		if (i >= 0) return {'Browser':'Opera','Version':ua.substr(i + 4).split(' ')[0],'Mozilla':false};
		i = ua.indexOf('Vivaldi/');
		if (i >= 0) return {'Browser':'Vivaldi','Version':ua.substr(i + 8).split(' ')[0],'Mozilla':false};
		i = ua.indexOf('Chrome/');
		if (i >= 0) return {'Browser':'Chrome','Version':ua.substr(i + 7).split(' ')[0],'Mozilla':false};
		i = ua.indexOf('Safari/');
		if (i >= 0) return {'Browser':'Safari','Version':ua.substr(i + 7).split(' ')[0],'Mozilla':false};
		i = ua.indexOf('PaleMoon/');
		if (i >= 0) return {'Browser':'Palemoon','Version':ua.substr(i + 9).split(' ')[0],'Mozilla':true};
		i = ua.indexOf('IceDragon/');
		if (i >= 0) return {'Browser':'IceDragon','Version':ua.substr(i + 10).split(' ')[0],'Mozilla':true};
		i = ua.indexOf('Firefox/');
		if (i >= 0) return {'Browser':'Firefox','Version':ua.substr(i + 8).split(' ')[0],'Mozilla':true};
	}
	return {Browser:'Firefox',Version:'0.00'};
}

function getGMVersion() {
	if (typeof (GM_info) != 'object') {
		return {'Handler':'Scriptish','Version':'Unknown'};
	}
	var Vers = GM_info.version || 'Unknown';
	var Handler = GM_info.scriptHandler || 'Greasemonkey';
	return {'Handler':Handler,'Version':Vers};
}

function HEXtoRGB(hex) {
	if (hex.length==7) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	}
	else {
		if (hex.length==4) {
			var result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
			result[1] = result[1]+'0';
			result[2] = result[2]+'0';
			result[3] = result[3]+'0';
		}
	}
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : {r:0, g:0, b:0};
}

function searchDOM (node, condition, maxLevel, doMult){
	var found = [];
	eval ('var compFunc = function (node) { return ('+ condition +') }');
	doOne(node, 1);
	if(!doMult){
		if (found.length==0)
			return null;
		return found[0];
	}
	return found;

	function doOne (node, curLevel){
		try {
			if (compFunc(node))
				found.push(node);
		} catch (e){ }
		if (!doMult && found.length>0)
			return;
		if (++curLevel<maxLevel && node.childNodes!=undefined)
			for (var c=0; c<node.childNodes.length; c++)
				doOne (node.childNodes[c], curLevel);
	}
}

function getClientCoords(e) {
	if (e==null)
		return {x:null, y:null, width:null, height:null};
	var x=0, y=0;
	ret = {x:0, y:0, width:e.clientWidth, height:e.clientHeight};
	while (e.offsetParent != null){
		ret.x += e.offsetLeft;
		ret.y += e.offsetTop;
		e = e.offsetParent;
	}
	return ret;
}

function InitialiseAudioManager() {
	var div = document.getElementsByTagName('div');
	for (var i = 0; i < div.length - 1; i++)
		if (div[i].className == 'mod_comm_forum')
			e = div[i];

	if (!e) {
		setTimeout(InitialiseAudioManager,2000);
		return;
	}

	AudioManager = new AudioMan(); // put basic SWF container in DOM above the chat
	AudioManager.init(e);
}

function AudioMan() {
	var t = this;
	this.player = null;
	this.volume = 100;
	this.type = 'html5';
	this.defaulttype = 'html5';
	this.source = null;
	this.canPlayMP3 = false;
	this.hasFlash = false;
	this.alertdiv = null;
	this.stoptimer = null;

	this.init = init;
	this.setVolume = setVolume;
	this.play = play;
	this.stop = stop;
	this.pause = pause;
	this.setSource = setSource;
	this.toggleMute = toggleMute;
	this.initSWF = initSWF;

	function init (myDiv){
		if (!!document.createElement("audio").canPlayType) {
			t.player = new Audio();
			t.canPlayMP3 = (t.player.canPlayType("audio/mpeg") !== "");
			t.defaulttype = 'html5';
			t.player.addEventListener("ended", function () {
				t.player.currentTime = 0
			}, false);
			t.setVolume(t.volume);
		} else {
			t.defaulttype = 'swf';
		}
		t.initSWF(myDiv)
	};

	function setVolume(vol){
		t.volume = vol;
		if (t.player) t.player.volume = t.volume * 0.01;
	};

	function pause(){
		if (t.player) t.player.pause();
	};

	function toggleMute () {
		if (t.player) t.player.muted = !t.player.muted;
	};

	function play(){
		clearTimeout(t.stoptimer);
		if(t.type == 'html5'){
			if (!t.player.paused) {
				t.stop();
			}
			t.player.play();
		} else {
			if (t.alertdiv) {
				if (!t.hasFlash) {
					logit('SWF Disabled or not Installed');
					t.alertdiv.innerHTML = '<b style=\'color:#800; font-size: 9px;\'>SWF Disabled or not Installed</b>';
				}
				else {
					t.alertdiv.innerHTML = t.source;
				}
			}
			else { logit('sound probs on play'); }
		}
	};

	function stop(){
		clearTimeout(t.stoptimer);
		if(t.type == 'html5'){
			t.player.pause();
			if (t.player.readyState === 4) {
				t.player.currentTime = 0
			}
		} else {
			if (t.alertdiv) {
				if (t.hasFlash) {
					t.alertdiv.innerHTML = '<b style=\'color: rgb(165, 102, 49); font-size: 9px;\'>SWF Audio Played</b>';
				}
			}
			else { logit('sound probs on stop'); }
		}
	};

	function setSource(src){
		if (matTypeof(src) == 'object') {
			if(t.defaulttype == 'html5'){
				t.player.src = src.OGG;
				t.type = 'html5';
			}
			else {
				logit('Browser has no native Audio support');
				t.source = SWF_PREFIX+src.URL+'&amp;volume='+t.volume+SWF_SUFFIX;
				t.type = 'swf';
			}
		}
		else {
			if ((src.split('.').pop().toUpperCase()=='MP3') && !t.canPlayMP3) {
				logit('Browser has no native MP3 support');
				t.source = SWF_PREFIX+src+'&amp;volume='+t.volume+SWF_SUFFIX;
				t.type = 'swf';
			}
			else {
				if(t.defaulttype == 'html5'){
					t.player.src = src;
					t.type = 'html5';
				}
				else {
					logit('Browser has no native Audio support');
					// probably can't play the sound, send it to SWF anyway..
					t.source = SWF_PREFIX+src+'&amp;volume='+t.volume+SWF_SUFFIX;
					t.type = 'swf';
				}
			}
		}
		// if source changed need to load.. ( not SWF)
		if (t.type == 'html5') {
			if (t.source != t.player.src) {
				t.player.load();
				t.source = t.player.src;
			}
		}
	};

	function initSWF(e){
		t.alertdiv = document.createElement("span");
		t.alertdiv.style.verticalAlign = 'top';
		t.alertdiv.style.paddingLeft = '20px';
		e.appendChild(t.alertdiv);
		e.style.height = '20px';

		try {
			var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			if (fo) { t.hasFlash = true; }
		} catch (e) {
			if (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] != undefined && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
				t.hasFlash = true;
			}
		}
	};
}

function hideMe() {
	if (!Options.btWinIsOpen)
		return;
	mainPop.show(false);
	Options.btWinIsOpen = false;
	saveOptions();
}

function showMe() {
	mainPop.show(true);
	Options.btWinIsOpen = true;
	saveOptions();
}

var WinManager = {
	wins : {},	// prefix : CPopup obj

	get : function (prefix){
		var t = WinManager;
		return t.wins[prefix];
	},

	add : function (prefix, pop){
		var t = WinManager;
		t.wins[prefix] = pop;
		if (uW.cpopupWins == null) { uWCreateObjectIn('cpopupWins',{}); }
		uW.cpopupWins[prefix] = pop;
	},

	delete : function (prefix){
		var t = WinManager;
		delete t.wins[prefix];
		delete uW.cpopupWins[prefix];
	}
}

// value is 0 to 1.0
function SliderBar (container, width, height, value, classPrefix, margin){
	var self = this;
	this.listener = null;
	if (value==null)
		value = 0;
	if (!margin)
		margin = parseInt(width*0.05);
	this.value = value;
	if (width<20) width=20;
	if (height<5) height=5;
	if (classPrefix == null){
		classPrefix = 'slider';
		var noClass = true;
	}
	var sliderHeight = parseInt(height/2);
	var sliderTop = parseInt(height/4);
	this.sliderWidth = width - (margin*2);

	this.div = document.createElement ('div');
	this.div.style.height = height +'px';
	this.div.style.width = width +'px';
	this.div.className = classPrefix +'Cont';

	this.slider = document.createElement ('div');
	this.slider.setAttribute ('style', 'position:relative;');
	this.slider.style.height = sliderHeight + 'px'
	this.slider.style.top = sliderTop + 'px';
	this.slider.style.width = this.sliderWidth +'px';
	this.slider.style.left = margin +'px'; /////
	this.slider.className = classPrefix +'Bar';
	this.slider.draggable = true;
	if (noClass)
		this.slider.style.backgroundColor='#fff';

	this.sliderL = document.createElement ('div');
	this.sliderL.setAttribute ('style', 'width:100px; height:100%; position:relative;');
	this.sliderL.className = classPrefix +'Part';
	this.sliderL.draggable = true;
	if (noClass)
		this.sliderL.style.backgroundColor='#0c0';

	this.knob = document.createElement ('div');
	this.knob.setAttribute ('style', 'width:3px; position:relative; left:0px; background-color:#222;');
	this.knob.style.height = height +'px';
	this.knob.style.top = (0-sliderTop) +'px';
	this.knob.className = classPrefix +'Knob';
	this.knob.draggable = true;
	this.slider.appendChild(this.sliderL);
	this.sliderL.appendChild (this.knob);
	this.div.appendChild (this.slider);
	container.appendChild (this.div);
	this.div.addEventListener('mousedown', mouseDown, false);

	this.getValue = function (){
		return self.value;
	}

	this.setValue = function (val){
		var relX = (val * self.sliderWidth);
		self.sliderL.style.width = relX + 'px';
		self.knob.style.left = relX + 'px';
		self.value = val;
		if (self.listener)
			self.listener(self.value);
	}

	this.setChangeListener = function (listener){
		self.listener = listener;
	}

	function moveKnob (me){
		var relX = me.clientX - self.divLeft;
		if (relX < 0)
		relX = 0;
		if (relX > self.sliderWidth)
			relX = self.sliderWidth;
		self.knob.style.left = (relX - (self.knob.clientWidth/2) ) +'px'; // - half knob width !?!?
		self.sliderL.style.width = relX + 'px';
		self.value = relX / self.sliderWidth;
		if (self.listener)
			self.listener(self.value);
	}

	function doneMoving (){
		self.div.removeEventListener('mousemove', mouseMove, true);
		document.removeEventListener('mouseup', mouseUp, true);
	}

	function mouseUp (me){
		moveKnob (me);
		doneMoving();
	}

	function mouseDown(me){
		var e = self.slider;
		self.divLeft = 0;
		while (e.offsetParent){ // determine actual clientX
			self.divLeft += e.offsetLeft;
			e = e.offsetParent;
		}
		moveKnob (me);
		document.addEventListener('mouseup', mouseUp, true);
		self.div.addEventListener('mousemove', mouseMove, true);
	}

	function mouseMove(me){
		moveKnob (me);
	}
}

// creates a 'popup' div
// prefix must be a unique (short) name for the popup window
function CPopup (prefix, x, y, width, height, enableDrag, onClose) {
	var pop = WinManager.get(prefix);
	if (pop){
		pop.show (false);
		return pop;
	}
	this.BASE_ZINDEX = 111111;

	// protos ...
	this.show = show;
	this.toggleHide = toggleHide;
	this.getTopDiv = getTopDiv;
	this.getMainDiv = getMainDiv;
	this.getLayer = getLayer;
	this.setLayer = setLayer;
	this.setEnableDrag = setEnableDrag;
	this.getLocation = getLocation;
	this.setLocation = setLocation;
	this.getDimensions = getDimensions;
	this.setDimensions = setDimensions;
	this.focusMe = focusMe;
	this.unfocusMe = unfocusMe;
	this.centerMe = centerMe;
	this.destroy = destroy;

	// object vars ...
	this.div = document.createElement('div');
	this.prefix = prefix;
	this.onClose = onClose;

	var t = this;
	this.div.className = 'btPopup '+ prefix +'_btPopup';
	this.div.id = prefix +'_outer';
	this.div.style.background = "#fff";
	this.div.style.zIndex = this.BASE_ZINDEX;
	this.div.style.display = 'none';
	this.div.style.width = width + 'px';
	this.div.style.height = height + 'px';
	this.div.style.position = "absolute";
	this.div.style.top = y +'px';
	this.div.style.left = x + 'px';

	var m = '<TABLE cellspacing=0 width=100% height=100%><TR id="'+ prefix +'_bar" class="btPopupTop '+ prefix +'_btPopupTop"><TD style="-moz-border-radius-topleft: 20px; border-top-left-radius: 20px;"><SPAN id="'+ prefix +'_top"></span></td>\
			<TD id='+ prefix +'_X align=right valign=middle onmouseover="this.style.cursor=\'pointer\'" style="width:10px;color:#fff; background:#400; border:1px solid #000000; font-weight:bold; font-size:14px; padding:0px 5px; -moz-border-radius-topright: 20px; border-top-right-radius: 20px;">X</td></tr>\
			<TR><TD height=100% valign=top class="btPopMain '+ prefix +'_btPopMain" colspan=2 id="'+ prefix +'_main"><div id="'+ prefix +'_content"></div></td></tr></table>';
	document.body.appendChild(this.div);
	this.div.innerHTML = m;
	ById(prefix+'_X').addEventListener ('click', e_XClose, false);
	this.dragger = new CWinDrag (ById(prefix+'_bar'), this.div, enableDrag);

	this.div.addEventListener ('mousedown', e_divClicked, false);
	WinManager.add(prefix, this);

	function e_divClicked (){
		t.focusMe();
	}
	function e_XClose (){
		t.show(false);
		if (t.onClose != null)
			t.onClose();
	}

	function focusMe (){
		t.setLayer(5);
		for (var k in uW.cpopupWins){
			if (k != t.prefix)
			uW.cpopupWins[k].unfocusMe();
		}
	}

	function unfocusMe (){
		t.setLayer(-5);
	}

	function getLocation (){
		return {x: parseInt(this.div.style.left), y: parseInt(this.div.style.top)};
	}

	function getDimensions (){
		return {x: parseInt(this.div.style.width), y: parseInt(this.div.style.height)};
	}

	function setLocation (loc){
		t.div.style.left = loc.x +'px';
		t.div.style.top = loc.y +'px';
	}

	function setDimensions (loc){
		t.div.style.width = loc.x +'px';
		t.div.style.height = loc.y +'px';
	}

	function destroy (){
		document.body.removeChild(t.div);
		WinManager.delete (t.prefix);
	}

	function centerMe (parent){
		if (parent == null){
			var coords = getClientCoords(document.body);
		} else
			var coords = getClientCoords(parent);
		var x = ((coords.width - parseInt(t.div.style.width)) / 2) + coords.x;
		var y = ((coords.height - parseInt(t.div.style.height)) / 2) + coords.y;
		if (x<0)
			x = 0;
		if (y<0)
			y = 0;
		t.div.style.left = x +'px';
		t.div.style.top = y +'px';
	}

	function setEnableDrag (tf){
		t.dragger.setEnable(tf);
	}

	function setLayer(zi){
		t.div.style.zIndex = ''+ (this.BASE_ZINDEX + zi);
	}

	function getLayer(){
		return parseInt(t.div.style.zIndex) - this.BASE_ZINDEX;
	}

	function getTopDiv(){
		return ById(this.prefix+'_top');
	}

	function getMainDiv(){
		return ById(this.prefix+'_content');
	}

	function show(tf){
		if (tf){
			t.div.style.display = 'block';
			t.focusMe ();
		} else {
			t.div.style.display = 'none';
		}
		return tf;
	}

	function toggleHide(t){
		if (t.div.style.display == 'block') {
			return t.show (false);
		} else {
			return t.show (true);
		}
	}
}

function CWinDrag (clickableElement, movingDiv, enabled) {
	var t=this;
	this.setEnable = setEnable;
	this.setBoundRect = setBoundRect;
	this.lastX = null;
	this.lastY = null;
	this.enabled = true;
	this.moving = false;
	this.theDiv = movingDiv;
	this.body = document.body;
	this.ce = clickableElement;
	this.moveHandler = new CeventMove(this).handler;
	this.outHandler = new CeventOut(this).handler;
	this.upHandler = new CeventUp(this).handler;
	this.downHandler = new CeventDown(this).handler;
	this.clickableRect = null;
	this.boundRect = null;
	this.bounds = null;
	this.enabled = false;
	if (enabled == null)
		enabled = true;
	this.setEnable (enabled);

	function setBoundRect (b){	// this rect (client coords) will not go outside of current body
		this.boundRect = boundRect;
		this.bounds = null;
	}

	function setEnable (enable){
		if (enable == t.enabled)
			return;
		if (enable){
			clickableElement.addEventListener('mousedown', t.downHandler, false);
			t.body.addEventListener('mouseup', t.upHandler, false);
		} else {
			clickableElement.removeEventListener('mousedown', t.downHandler, false);
			t.body.removeEventListener('mouseup', t.upHandler, false);
		}
		t.enabled = enable;
	}

	function CeventDown (that){
		this.handler = handler;
		var t = that;

		function handler (me){
			if (t.bounds == null){
				t.clickableRect = getClientCoords(clickableElement);
				t.bodyRect = getClientCoords(document.body);
				if (t.boundRect == null)
					t.boundRect = t.clickableRect;
				t.bounds = {top:10-t.clickableRect.height, bot:t.bodyRect.height-25, left:40-t.clickableRect.width, right:t.bodyRect.width-25};
			}
			if (me.button==0 && t.enabled){
				t.body.addEventListener('mousemove', t.moveHandler, true);
				t.body.addEventListener('mouseout', t.outHandler, true);
				t.lastX = me.clientX;
				t.lastY = me.clientY;
				t.moving = true;
			}
		}
	}

	function CeventUp (that){
		this.handler = handler;
		var t = that;

		function handler (me){
			if (me.button==0 && t.moving)
				_doneMoving(t);
		}
	}

	function _doneMoving (t){
		t.body.removeEventListener('mousemove', t.moveHandler, true);
		t.body.removeEventListener('mouseout', t.outHandler, true);
		t.moving = false;
	}

	function CeventOut (that){
		this.handler = handler;
		var t = that;

		function handler (me){
			if (me.button==0){
				t.moveHandler (me);
			}
		}
	}

	function CeventMove (that){
		this.handler = handler;
		var t = that;

		function handler (me){
			if (t.enabled && !t.wentOut){
				var newTop = parseInt(t.theDiv.style.top) + me.clientY - t.lastY;
				var newLeft = parseInt(t.theDiv.style.left) + me.clientX - t.lastX;
				if (newTop < t.bounds.top){ // if out-of-bounds...
					newTop = t.bounds.top;
					_doneMoving(t);
				} else if (newLeft < t.bounds.left){
					newLeft = t.bounds.left;
					_doneMoving(t);
				} else if (newLeft > t.bounds.right){
					newLeft = t.bounds.right;
					_doneMoving(t);
				} else if (newTop > t.bounds.bot){
					newTop = t.bounds.bot;
					_doneMoving(t);
				}
				t.theDiv.style.top = newTop + 'px';
				t.theDiv.style.left = newLeft + 'px';
				t.lastX = me.clientX;
				t.lastY = me.clientY;
			}
		}
	}
}

function ResetWindowPos (me,el,pop){
	if (me.button == 2){
		var c = getClientCoords (ById(el));
		if (pop) { pop.setLocation ({x: c.x+4, y: c.y+c.height}); mainPop.unfocusMe();pop.focusMe();}
		saveOptions();
	}
}

var tabManager = {
	tabList : {}, // {name, obj, div}
	currentTab : null,

	init : function (mainDiv){
		var t = tabManager;
		var sorter = [];
		var LineBreak = 10;
		if (GlobalOptions.btWinSize.x == 750) {LineBreak = 8;}
		if (GlobalOptions.btWinSize.x == 1250) {LineBreak = 12;}

		for (var k in Tabs){
			if (!Tabs[k].tabDisabled){
				t.tabList[k] = {};
				t.tabList[k].name = k;
				t.tabList[k].tabColor = Tabs[k].tabColor?Tabs[k].tabColor:'blue';
				t.tabList[k].obj = Tabs[k];
				if (Tabs[k].tabLabel != null) {
					t.tabList[k].label = tx(Tabs[k].tabLabel);
				}
				else {
					t.tabList[k].label = k;
				}
				if (Tabs[k].tabOrder != null)
					sorter.push([Tabs[k].tabOrder, t.tabList[k]]);
				else
					sorter.push([1000, t.tabList[k]]);
				t.tabList[k].div = document.createElement('div');
			}
		}

		sorter.sort (function (a,b){return a[0]-b[0]});
		var m = '<div align="center"><b>PowerBot+ (Version '+Version+')</b></div>';

		if (!GlobalOptions.btPowerBar) {
			m += '<TABLE align=center><TR>';
			for (var i=0; i<sorter.length; i++) {
				var color = sorter[i][1].tabColor;
				m += '<TD align=center ><div><A id=bttc'+ sorter[i][1].name +' class="buttonv2 std '+color+'"><span style="white-space:nowrap;display:inline-block;width:72px;">'+ sorter[i][1].label +'</span></a></div></td>';
				if ((i+1)%LineBreak == 0) m+='</tr><TR>';
			}
			m+='</tr></table>';
		}
		else {
			var n = '';
			if(GlobalOptions.btPowerBarPopups) { n = '<div id=btPowerBarExtra style="padding-bottom:5px;"></div>'; }
			for (var i=0; i<sorter.length; i++) {
				var color = sorter[i][1].tabColor;
				n += '<a class=TextLink><div id=bttc'+ sorter[i][1].name +' class="buttonv2 std '+color+'">'+ sorter[i][1].label +'</div></a>';
			}
			ById('btPowerBarButtons').innerHTML = n;
		}

		mainPop.getTopDiv().innerHTML = m;

		for (var k in t.tabList) {
			if (t.tabList[k].name == Options.currentTab)
				t.currentTab =t.tabList[k] ;
			ById('bttc'+ k).addEventListener('click', this.e_clickedTab, false);
			var div = t.tabList[k].div;
			div.style.display = 'none';
			div.style.height = '100%';
			mainDiv.appendChild(div);
			try {
				t.tabList[k].obj.init(div);
			} catch (e){
				logerr(e);
				div.innerHTML = "<br><b>INIT ERROR:</b> "+e.message;
				try { div.innerHTML += '<br><br><b>Debug Info</b><br>'+e.stack+'<br>'; }
				catch (e) { }
			}
		}

		if (t.currentTab == null)
			t.currentTab = sorter[0][1];
		if (!GlobalOptions.btPowerBar) {
			t.setTabStyle (t.currentTab, true);
		}
		t.currentTab.div.style.display = 'block';
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	hideTab : function (){
		var t = tabManager;
		if (matTypeof(t.currentTab.obj.hide)=="function") t.currentTab.obj.hide();
		if (GlobalOptions.btPowerBar) {
			Options.btWinIsOpen = false;
			Options.currentTab = null;
			saveOptions();
			t.setTabStyle (t.currentTab, false);
		}
	},

	showTab : function (init){
		var t = tabManager;
		if (matTypeof(t.currentTab.obj.show)=="function") t.currentTab.obj.show(init);
		if (GlobalOptions.btPowerBar) {
			t.setTabStyle (t.currentTab, true);
			Options.btWinIsOpen = true;
			Options.currentTab = t.currentTab.name;
			saveOptions();
		}
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	setTabStyle : function (Tab, selected){
		var e = ById ('bttc'+ Tab.name)
		var c = Tab.tabColor?Tab.tabColor:"blue";
		if (selected){
			e.className = 'buttonv2 std green';
		} else {
			e.className = 'buttonv2 std '+c;
		}
	},

	e_clickedTab : function (e){
		var t = tabManager;
		if (!Options.btWinIsOpen) {
			mainPop.show (true);
		}
		if (!GlobalOptions.btPowerBar) {
			if (e.target.id)
				var newTab = t.tabList[e.target.id.substring(4)];
			else
				var newTab = t.tabList[e.target.parentNode.id.substring(4)];
		}
		else {
			var newTab = t.tabList[e.target.id.substring(4)];
			t.setTabStyle (newTab, true);
			Options.currentTab = newTab.name;
			Options.btWinIsOpen = true;
			saveOptions();
		}
		if (t.currentTab.name != newTab.name){
			t.setTabStyle(t.currentTab, false);
			t.setTabStyle(newTab, true);
			if (matTypeof(t.currentTab.obj.hide)=="function") t.currentTab.obj.hide();
			t.currentTab.div.style.display = 'none';
			t.currentTab = newTab;
			newTab.div.style.display = 'block';
			Options.currentTab = newTab.name;
			saveOptions();
		}
		if (matTypeof(newTab.obj.show)=="function") newTab.obj.show();
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	EverySecond : function () {
		var t = tabManager;
		for (var k in t.tabList) {
			if (!t.tabList[k].tabDisabled && matTypeof(t.tabList[k].obj.EverySecond)=="function") {
				try {
					t.tabList[k].obj.EverySecond();
				} catch (e){ logerr(e);}
			}
		}
	},
}

//This is a new implementation of the CalterUwFunc class to modify a function of the 'uW' object.

function addScript (scriptText){
	var scr = document.createElement('script');
	scr.innerHTML = scriptText;
	document.body.appendChild(scr);
}

addScript ('uWFunc = function (text){ eval (text); }');

var CalterUwFunc = function (funcName, findReplace) {
	this.isAvailable = isAvailable;
	this.setEnable = setEnable;

	this.funcName = funcName;
	this.funcModifier = null;
	this.modIndex = 0;
	this.numberMods = 0;

	// find an existing CalterUwFunc if it already exists
	if (!uW.calterRegistry) uWCreateObjectIn('calterRegistry',{});
	var calterF = null;

	if (uW.calterRegistry[funcName]) {
		// use the existing function modifier
		calterF = uW.calterRegistry[funcName];
		for (var i=0; i< findReplace.length; i++) {
			uW.calterRegistry[funcName].addModifier(findReplace[i]);
		}
	} else {
		// create and register the new calter
		calterF = new CalterFuncModifier(funcName, findReplace);
		if (typeof createObjectIn == 'function') {
			var newfunc = createObjectIn(uW.calterRegistry,{defineAs: funcName});
			exportFunction(calterF.applyModifiers,newfunc,{defineAs:'applyModifiers'});
			exportFunction(calterF.addModifier,newfunc,{defineAs:'addModifier'});
			exportFunction(calterF.enableModifier,newfunc,{defineAs:'enableModifier'});
			exportFunction(calterF.testModifier,newfunc,{defineAs:'testModifier'});
			exportFunction(calterF.modEnabled,newfunc,{defineAs:'modEnabled'});
			exportFunction(calterF.numModifiers,newfunc,{defineAs:'numModifiers'});

			exportFunction(calterF.funcOld,newfunc,{defineAs:'funcOld'});
			newfunc.funcName = cloneInto(calterF.funcName,newfunc);
			newfunc.funcOldString = cloneInto(calterF.funcOldString,newfunc);
			newfunc.modifiers = cloneInto(calterF.modifiers,newfunc);
			newfunc.modsActive = cloneInto(calterF.modsActive,newfunc);
		}
		else {
			uW.calterRegistry[funcName] = uWCloneInto(calterF);
		}
	}
	if (typeof Object.assign == 'function') {
		this.funcModifier = Object.assign({}, uW.calterRegistry[funcName]);
	}
	else {
		this.funcModifier = calterF;
	}

	if (findReplace != null) {
		this.numberMods = findReplace.length;
		this.modIndex = this.funcModifier.numModifiers()- this.numberMods;
	}

	function isAvailable() {
		// check if any of the replace strings matched the original function
		var avail = false;
		for (var i = this.modIndex; i < this.modIndex + this.numberMods; i++ ) {
			if (this.funcModifier.testModifier(i)) avail= true;
		}
		return avail;
	}

	function setEnable(tf) {
		this.funcModifier.enableModifier(this.modIndex, tf, this.numberMods);
	}
}

var CalterFuncModifier = function (funcName, findReplace) {
	// (second argument is now optional )

	this.applyModifiers = applyModifiers;
	this.addModifier = addModifier;
	this.enableModifier = enableModifier;
	this.testModifier = testModifier;
	this.modEnabled = modEnabled;
	this.numModifiers = numModifiers;

	this.funcName = funcName;
	this.funcOld = null;
	this.funcOldString = null;
	this.funcNew = null;
	this.modifiers = [];
	this.modsActive = [];

	try {
		var x = this.funcName.split('.');
		var f = uW;
		for (var i=0; i<x.length; i++)
			f = f[x[i]];
		ft = f.toString();
		this.funcOld = f;
		this.funcOldString = ft.replace ('function '+ this.funcName, 'function');

		if (findReplace) {
			this.modifiers = findReplace;
			this.modsActive = new Array(findReplace.length);
			for (var i=0; i<findReplace.length; i++){
				this.modsActive[i] = false;
			}
		}
	} catch (err) {
		logit("CalterFuncModifier "+ this.funcName);
		logerr(err);
	}

	// test if this modifier works on the original function.
	//	true = match found / replace possible
	//	false = does not match
	function testModifier(modNumber) {
		x = this.funcOldString.replace(this.modifiers[modNumber][0], this.modifiers[modNumber][1]);
		if (x != this.funcOldString) {
			return true;
		}
		return false;
	}

	// use the active modifiers to create/apply a new function
	function applyModifiers() {
		try {
			var rt = this.funcOldString;
			var active = false;

			for (var i=0; i< this.modifiers.length; i++){
				if ( !this.modsActive[i]) continue;

				x = rt.replace(this.modifiers[i][0], this.modifiers[i][1]);
				if (x == rt) { // if not found
					// print out an error message when the match fails.
					// These messages get lost on a refresh, so wait a few seconds to put it in the error log.
					function CalterError (fname, repStr, ftstr) {
						logit("Unable to replace string in function " + fname);
						logit("Replacement string:" + repStr );
						logit("Function listing: " + ftstr);
					}
					setTimeout(CalterError, 5000, this.funcName, this.modifiers[i][0], ft);
				}
				else {
					rt = x;
					active = true;
				}
			}

			this.funcNew = rt;

			if (active) {
				// apply the new function
				uW.uWFunc(this.funcName +' = '+ this.funcNew);
			} else {
				// set to the original function
				var x1 = this.funcName.split('.');
				var f1 = uW;
				for (var i=0; i<x1.length-1; i++)
				f1 = f1[x1[i]];
				f1[x1[x1.length-1]] = this.funcOld;
			}
		} catch (err) {
			logit("CalterFuncModifier "+ this.funcName);
			logerr(err);
		}
	}

	// add additional modifiers. The index of the modifier is returned so the caller can enable/disable it specificially
	function addModifier(fr) {
		fr = uWCloneInto(fr);
		this.modifiers.push(fr);
		this.modsActive.push(false);
		// return the index of the newly added modifier
		return this.modifiers.length-1;
	}

	// turn on/off some of the modifiers.
	// 'len' allows setting consectutive modifiers to the same value.
	// If len is null, 1 is used
	function enableModifier(modNumber, value, len) {
		if (len == null) len = 1;
		for (var i = modNumber; i < modNumber + len; i++) {
			if ( i < this.modsActive.length) {
				this.modsActive[i] = value;
			}
		}
		this.applyModifiers();
	}

	function modEnabled(modNumber) {
		if ( modNumber < this.modsActive.length)
			return this.modsActive[modNumber];
	}

	function numModifiers() {
		return this.modifiers.length;
	}
}

function matTypeof (v){
	if (v == undefined)
		return 'undefined';
	if (typeof (v) == 'object'){
		if (!v)
			return 'null';
		else if (v.constructor.toString().indexOf("Array")>=0 && typeof(v.splice)=='function')
			return 'array';
		else return 'object';
	}
	return typeof (v);
}

function implodeUrlArgs (obj){
	var a = [];
	for (var k in obj)
		a.push (k +'='+ encodeURI(obj[k]) );
	return a.join ('&');
}

// NOTE: args can be either a string which will be appended as is to url or an object of name->values
function addUrlArgs (url, args){
	if (!args)
		return url;
	if (url.indexOf('?') < 0)
		url += '?';
	else if (url.substr(url.length-1) != '&')
		url += '&';
	if (matTypeof(args == 'object'))
		return url + implodeUrlArgs (args);
	return url + args;
}

function myClone(source) {
	var dest = {};
	for (var property in source)
		dest[property] = source[property];
	return dest;
}

function MyAjaxRequest (url, o, noRetry){
	var opts = myClone(o);
	var wasSuccess = o.onSuccess;
	var wasFailure = o.onFailure;
	// if failure, retry 3 times every 2 secs?
	var retry = 3;
	var delay = 2;
	var noRetry = noRetry===true?true:false;
	opts.onSuccess = mySuccess;
	opts.onFailure = myFailure;
	var obj = {};
	obj.timestamp = unixTime();
	obj.url = url;
	AJAX_LOG.push(obj);

	new AjaxRequest(url, opts);
	return;

	function myRetry(rslt){
		--retry;
		if (retry > 0)
			new AjaxRequest(url, opts);
		else
			wasSuccess (rslt); // let the calling function handle it
	}

	function myFailure(){
		var o = {};
		o.ok = false;
		o.errorMsg = "AJAX Communication Failure";
		wasFailure (o);
	}

	function mySuccess (msg){
		var rslt;
		if(typeof msg.responseText === 'string'){
			var hasCode = (msg.responseText.indexOf("function() {")!=-1);
			if(!hasCode){
				var rslt = eval("(" + msg.responseText + ")");
			}
		}

		if (!rslt) {
			rslt = {};
			rslt.errorMsg = "Unexpected Response from Server";
			rslt.BotCode = 999; // alert!!!
			rslt.responseText = msg.responseText; // for logging! Usually map captcha type delay function
			wasSuccess (rslt);
			return;
		}

		if (rslt.ok){
			rslt.errorMsg = null; ///// !!!!!!!!!!!!! ************
			if (rslt.updateSeed)
				uW.update_seed(uWCloneInto(rslt.updateSeed));
			wasSuccess (rslt);
			return;
		}

		rslt.errorMsg = uW.printLocalError((rslt.error_code || null), (rslt.msg || null), (rslt.feedback || "999")); // null causes error sometimes
		if (!noRetry && (rslt.error_code==0 ||rslt.error_code==8 || rslt.error_code==1 || rslt.error_code==3)){
			setTimeout (function(){myRetry(rslt)}, delay*1000);
		} else {
			wasSuccess (rslt);
		}
	}
}

function AjaxRequest (url, opts){
	var headers = {
		'X-Requested-With': 'XMLHttpRequest',
		'X-Prototype-Version': '1.7.1',
		'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
	};
	var ajax = null;

	if (window.XMLHttpRequest)
		ajax=new XMLHttpRequest();
	else
		ajax=new ActiveXObject("Microsoft.XMLHTTP");

	if (opts.method==null || opts.method=='')
		method = 'GET';
	else
		method = opts.method.toUpperCase();

	if (method == 'POST'){
		headers['Content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	} else if (method == 'GET'){
		addUrlArgs (url, opts.parameters);
	}

	ajax.onreadystatechange = function(){
		// ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete']; states 0-4
		if (ajax.readyState==4) {
			if (ajax.status >= 200 && ajax.status < 305)
				if (opts.onSuccess) opts.onSuccess(ajax);
				else
					if (opts.onFailure) opts.onFailure(ajax);
		} else {
			if (opts.onChange) opts.onChange (ajax);
		}
	}

	ajax.open(method, url, true); // always async!

	for (var k in headers)
		ajax.setRequestHeader (k, headers[k]);
	if (matTypeof(opts.requestHeaders)=='object')
		for (var k in opts.requestHeaders)
			ajax.setRequestHeader (k, opts.requestHeaders[k]);

	if (method == 'POST'){
		var a = [];
		for (var k in opts.parameters) {
			if (matTypeof(opts.parameters[k]) == 'object') {
				for (var h in opts.parameters[k]) {
					if (matTypeof(opts.parameters[k][h]) == 'object') {
						for (var i in opts.parameters[k][h]) {
							if (matTypeof(opts.parameters[k][h][i]) == 'object') {
								for (var j in opts.parameters[k][h][i]) {
									a.push (k+'['+h+']['+i+']['+j+'] ='+ opts.parameters[k][h][i][j]);
								}
							}
							else {
								a.push (k+'['+h+']['+i+']'+' ='+ opts.parameters[k][h][i]);
							}
						}
					}
					else {
						a.push (k+'['+h+'] ='+ opts.parameters[k][h] );
					}
				}
			}
			else {
				a.push (k +'='+ opts.parameters[k] );
			}
		}
		ajax.send (a.join ('&'));
	} else {
		ajax.send();
	}
};

function DouW(func, execute_by_embed) {
	if(this.isChrome || execute_by_embed) {
		var scr=document.createElement('script');
		scr.innerHTML=func;
		document.body.appendChild(scr);
	} else {
		try {
			eval("uW."+func);
		} catch (error) {
			logit("A javascript error has occurred when executing a function via DouW. Error description: "+error.description);
		}
	}
}

/** Standard Game Functions **/

function getThroneEffectName(id,tier) {
	var RetVal = uW.g_js_strings.throneRoom["effectName_" + id];
	if (CM.THRONE_ROOM_TYPE_DEBUFF_EFFECTS.indexOf(parseInt(id)) != -1 && tier) {
		RetVal = RetVal.replace("%1$s", CM.THRONE_ROOM_TYPE_DEBUFF_EFFECTS_TIER_PERCENTAGE[tier - 1] + "% ");
	}
	return RetVal;
}

function SelectText(elem) {
	var range, selection;
	if (document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(elem);
		range.select();
	} else if (window.getSelection) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(elem);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}

function StartKeyTimer(elem,notify,entry) {
	if (KeyTimer) { clearTimeout(KeyTimer); }
	KeyTimer = setTimeout( function () {notify(elem,entry);},1000);
}

function htmlTitleLine(msg) {
	return '<TABLE class=xtab width=100% cellspacing=0><TR><TD style="padding:0px" width=50%><HR></td><TD style="padding:0px">[ ' + msg + ' ]</td><TD style="padding:0px" width=50%><HR></td></tr></table>';
}

function strButton20(label, tags) {
	if (tags == null) tags = '';
	return ('<A class="inlineButton btButton blue20" ' + tags + '><SPAN>' + label + '</span></a>');
}

function strButton14(label, tags, colourclass) {
	if (tags == null) tags = '';
	if (colourclass == null) colourclass = 'blue14';
	return ('<A class="inlineButton btButton '+colourclass+'" ' + tags + '><SPAN>' + label + '</span></a>');
}

function strButton8(label, tags) {
	if (tags == null) tags = '';
	return ('<A class="inlineButton btButton brown8" ' + tags + '><SPAN>' + label + '</span></a>');
}

function makeButtonv2(color,tags,label) {
	return '<a '+tags+' class="buttonv2 std '+color+'"><SPAN>'+ label +'</span></a>';
}

function getServerId() {
	var m=/^[a-zA-Z]+([0-9]+)\./.exec(document.location.hostname);
	if(m)
		return m[1];
	return '??';
}

function getTokenServerId() { // domain for tokens may be passed in URL as &token_s parameter...
	var myServerId = UserOptions.TokenDomain;
	var squery = /[\?,\&]token_s=\d+/;
	var dquery = /\d+/;
	var Sresult = dquery.exec(squery.exec(document.location.search));
	if (Sresult)
		myServerId = Sresult;
	return myServerId;
}

function getFeedServerId() {
	var myServerId = UserOptions.TokenDomain;
	var squery = /[\?,\&]s=\d+/;
	var dquery = /\d+/;
	var Sresult = dquery.exec(squery.exec(document.location.search));
	if (Sresult)
		myServerId = Sresult;
	return myServerId;
}

function getFeedId() {
	var myFeedId = 'n/a';
	var squery = /[\?,\&]f=\d+/;
	var dquery = /\d+/;
	var Sresult = dquery.exec(squery.exec(document.location.search));
	if (Sresult)
		myFeedId = Sresult;
	return myFeedId;
}

function getFeedUserId() {
	var myFeedUserId = 'n/a';
	var squery = /[\?,\&]in=\d+/;
	var dquery = /\d+/;
	var Sresult = dquery.exec(squery.exec(document.location.search));
	if (Sresult)
		myFeedUserId = Sresult;
	return myFeedUserId;
}

function readGlobalOptions (){
	s = GM_getValue ('Options_??');
	if (s != null){
		opts = JSON2.parse (s);
		for (var k in opts){
			if (matTypeof(opts[k]) == 'object') {
				for (var kk in opts[k]) {
					if (GlobalOptions[k]) {
						GlobalOptions[k][kk] = opts[k][kk];
					}
				}
			}
			else {
				GlobalOptions[k] = opts[k];
			}
		}
	}
	if (GlobalOptions.GlobalOptionsVersion && GlobalOptions.GlobalOptionsVersion!="0" && AutoUpdater.compareVersion(Version, GlobalOptions.GlobalOptionsVersion)) {
		GlobalOptionsUpdate();
		GlobalOptions.GlobalOptionsVersion = Version;
		saveGlobalOptions();
	}
}

function saveGlobalOptions (){
	setTimeout (function (){ GM_setValue ('Options_??', JSON2.stringify(GlobalOptions));}, 0); // get around GM_SetValue uW error
}

function readOptions (){
	var serverID = getServerId();
	s = GM_getValue ('Options_'+serverID+'_'+uW.tvuid);
	if (s != null){
		opts = JSON2.parse (s);
		for (var k in opts)
			Options[k] = opts[k];
	}
	if (Options.OptionsVersion && Options.OptionsVersion!="0" && AutoUpdater.compareVersion(Version, Options.OptionsVersion)) {
		OptionsUpdate();
		Options.OptionsVersion = Version;
		saveOptions();
	}
}

function saveOptions (){
	if (uW.btLoaded) {
		var serverID = getServerId();
		setTimeout(function (){ GM_setValue ('Options_'+serverID+'_'+uW.tvuid, JSON2.stringify(Options)); }, 0); // get around GM_SetValue uW error
	}
}

function readUserOptions (user_id){ // facebook user id
	if (!user_id || user_id=="") {return;}
	s = GM_getValue ('UserOptions_'+user_id);
	if (s != null){
		opts = JSON2.parse (s);
		for (var k in opts)
			UserOptions[k] = opts[k];
	}
}

function saveUserOptions (user_id){ // facebook user id
	if (!user_id || user_id=="") {return;}
	setTimeout(function (){ GM_setValue ('UserOptions_'+user_id, JSON2.stringify(UserOptions)); }, 0); // get around GM_SetValue uW error
}

function readLanguage (lang) {
	NoTranslation = {};
	LanguageArray = {};
	var s = GM_getValue ("LanguageArray_"+lang);
	if (s != null){
		var lang = JSON2.parse (s);
		for (var k in lang){ LanguageArray[k] = lang[k]; }
	}
}

function saveLanguage (lang) {
	setTimeout ( function (){GM_setValue ("LanguageArray_"+lang, JSON2.stringify(LanguageArray));}, 0);
}

function ToggleOption(optionArea, checkboxId, optionName, callOnChange, callIsAvailable) {
	var checkbox = ById(checkboxId);
	if (callIsAvailable && callIsAvailable() == false) {
		checkbox.disabled = true;
		return;
	};
	if (optionArea=="") { var checkMe = Options[optionName] }
	else { var checkMe = Options[optionArea][optionName] }
	checkbox.checked = checkMe;

	checkbox.addEventListener ('change', eventHandler, false);

	function eventHandler () {
		if (optionArea=="") { Options[optionName] = this.checked; }
		else { Options[optionArea][optionName] = this.checked; }
		saveOptions();
		if (callOnChange) callOnChange(this.checked);
	}
}

function ChangeOption(optionArea, valueId, optionName, callOnChange) {
	var e = ById(valueId);
	if (optionArea=="") { e.value = Options[optionName] }
	else { e.value = Options[optionArea][optionName] }

	e.addEventListener ('change', eventHandler, false);

	function eventHandler (){
		if (optionArea=="") { Options[optionName] = this.value; }
		else { Options[optionArea][optionName] = this.value; }
		saveOptions();
		if (callOnChange) { callOnChange (this.value); }
	}
}

function ChangeIntegerOption(optionArea, valueId, optionName, defaultValue, callOnChange) {
	var e = ById(valueId);
	if (optionArea=="") { e.value = Options[optionName] }
	else { e.value = Options[optionArea][optionName] }

	e.addEventListener ('change', eventHandler, false);

	function eventHandler (){
		if (isNaN(this.value)) { this.value = parseIntNan(defaultValue); }
		if (optionArea=="") { Options[optionName] = parseIntNan(this.value); this.value = Options[optionName]; }
		else { Options[optionArea][optionName] = parseIntNan(this.value); this.value = Options[optionArea][optionName]; }
		saveOptions();
		if (callOnChange) { callOnChange (this.value); }
	}
}

function GetDisplayName(){
	var DisplayName = ById('topnavDisplayName');
	if (DisplayName) { DisplayName = DisplayName.innerHTML; }
	else { DisplayName = null; }
	return DisplayName
}

function setCities() {
	Cities.numCities = Seed.cities.length;
	Cities.cities = [];
	Cities.byID = {};
	for (var i=0; i<Cities.numCities; i++) {
		var city = {};
		city.idx = i;
		city.id = parseInt(Seed.cities[i][0]);
		city.name = Seed.cities[i][1];
		city.x = parseInt(Seed.cities[i][2]);
		city.y = parseInt(Seed.cities[i][3]);
		city.tileId = parseInt(Seed.cities[i][5]);
		city.provId = parseInt(Seed.cities[i][4]);
		Cities.cities[i] = city;
		Cities.byID[Seed.cities[i][0]] = city;
	}
}

function SelectCity (idx) {
	var l = ById("citysel_" + idx);
	if (l) { uW.citysel_click(l); return true; }
	else return false;
};

function OpenBuilding(idx,bid) {
	SelectCity(idx);
	var c = Seed.buildings["city" + uW.currentcityid],
	b,
	a;
	for (b in c) {
		if (c[b][0] == bid) {
			a = c[b][2];
			break
		}
	}
	if (a) { uW.modal_build(a); return true; }
	else return false;
};

function showBlessings(Bless){
	var msg = '';
	if (!Bless) return msg;
	var blessings = Bless.split(',');
	for (var y in blessings) {
		var bb = uW.g_js_strings.blessingSystem['blessing_name_'+blessings[y]];
		var bd = uW.g_js_strings.blessingSystem['blessing_description_'+blessings[y]];
		if (bb)
			msg += '<TR><TD><b>' + bb + '</b><br>'+ bd +'</td></tr>';
	}
	return msg;
};

function getAscensionValues (cityId) {
	var ret = {isPrestigeCity:false, prestigeLevel:0, prestigeType:0, prestigeBuffExpire:0, blessings:""};
	if(Seed.cityData.city[cityId].isPrestigeCity){
		ret.isPrestigeCity = true;
		ret.prestigeLevel = parseIntNan(Seed.cityData.city[cityId].prestigeInfo.prestigeLevel);
		ret.prestigeType = parseIntNan(Seed.cityData.city[cityId].prestigeInfo.prestigeType);
		ret.prestigeBuffExpire = Seed.cityData.city[cityId].prestigeInfo.prestigeBuffExpire;
		ret.blessings = Seed.cityData.city[cityId].prestigeInfo.blessings.slice();
	}
	return ret;
};

function getSpellData (cityId) {
	var ret = {faction: "", spellavailable:false, cooldownactive:false, cooldown:0};
	var ascended = getAscensionValues(cityId);
	if (ascended.isPrestigeCity) {
		ret.faction = ascended.prestigeType;
		ret.spellavailable = (ascended.blessings.indexOf(SpellBlessings[ret.faction]) != -1);
		ret.cooldownactive = (Seed.cityData.city[cityId].spells && Seed.cityData.city[cityId].spells[SpellTypes[ret.faction]] && parseInt(Seed.cityData.city[cityId].spells[SpellTypes[ret.faction]].endDate) > uW.unixtime());
		if (ret.spellavailable && ret.cooldownactive) {
			ret.cooldown = uW.timestr(parseInt(Seed.cityData.city[cityId].spells[SpellTypes[ret.faction]].endDate) - uW.unixtime());
		}
	}
	return ret;
};

function getFactionBonus (slot) {
	var equippeditems = Seed.throne.slotEquip[slot];
	var EQ = {};
	jQuery.each(equippeditems, function (A, B) {
		x = uW.kocThroneItems[B];
		EQ[x.id] = x;
	});
	return CM.ThroneController.hasFactionBonus(uWCloneInto(EQ));
}

function getTREffectStyle(i) {
	var ret = {};
	ret.LineStyle = '<span style="color:#888;">';
	ret.EndStyle = '</span>';
	if (AttackEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#800;">';
	if (DefenceEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#008;">';
	if (LifeEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#088;">';
	if (RangeEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#080;">';
	if (SpeedEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:'+SpeedColour+';">';
	if (AccuracyEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#f80;">';
	if (OtherCombatEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#808;">';
	if (GlobalEffects.indexOf(parseInt(i)) > -1) {
		ret.LineStyle = ret.LineStyle + '<strong>';
		ret.EndStyle = '</strong>' + ret.EndStyle;
	}
	if (DebuffEffects.indexOf(parseInt(i)) > -1) {
		ret.LineStyle = ret.LineStyle + '<i>';
		ret.EndStyle = '</i>' + ret.EndStyle;
	}
	return ret;
};

function setTroops() {
	for (var ui in CM.UNIT_TYPES){
		i = CM.UNIT_TYPES[ui];
		var tt = CM.unitFrontendType[i];
		switch(tt) {
			case "spellcaster":
				SpellCaster.push(i); break;
			case "siege":
				Siege.push(i); break;
			case "horsed":
				Horsed.push(i); break;
			case "ranged":
				Ranged.push(i); break;
			default:
				Infantry.push(i);
		}
		if (TTSort.indexOf(i) == -1) { TTSort.push(i); }
	}
};

function distance(d, f, c, e) {
	var a = 750;
	var g = a / 2;
	var b = Math.abs(c - d);
	if (b > g)
		b = a - b;
	var h = Math.abs(e - f);
	if (h > g)
		h = a - h;
	return Math.round(100 * Math.sqrt(b * b + h * h)) / 100;
};

function CalculateTileId(x, y) {
	var prov = '';
	for (var i in Provinces) {
		if (x>=Provinces[i].x && x<Provinces[i].x+150 && y>=Provinces[i].y && y<Provinces[i].y+150) {
			prov = i;
			break;
		}
	}
	if (prov=='') return 0;
	var pid = prov.split("p")[1];
	var xx = x-Provinces[prov].x;
	var yy = y-Provinces[prov].y;
	var tid = TileOrigin+((pid-1)*22500)+(xx*150)+yy+1;
	return tid;
}

function getMaxWilds(cityId) {
	var castle = parseInt(Seed.buildings['city' + cityId].pos0[1]);
	if (castle == 11) castle = 12;
	else if (castle == 12) castle = 14;
	else if (castle == 13) castle = 16;
	else if (castle == 14) castle = 18;
	else if (castle == 15) castle = 20;
	return castle;
}

function logerr(e) {
	try { logit(e.message); } catch (e) { logit(e); }
	if (GlobalOptions.ExtendedDebugMode) {
		try { logit(e.stack); }
		catch (e) {logit('trace unavailable'); }
	}
}

function logit (msg){
	var now = new Date();
	GM_log (getServerId() +' @ '+ now.toTimeString().substring (0,8) +'.' + now.getMilliseconds() +': '+ msg);
}

function actionLog (msg,area){
	if (!Tabs.ActionLog.tabDisabled) {
		Tabs.ActionLog.log (msg,area);
	}
}

var safecall = ["658135","6046539"];
var unsafecall = ["MTkwMDE2ODc="];

function unixTime (){
	return parseInt (new Date().getTime() / 1000) + uW.g_timeoff;
}

function formatDateTime(a) {
	return uW.formatDate(uWCloneInto(new Date(a * 1000)), "NNN dd, HH:mm")
}

function formatDate(a) {
	return uW.formatDate(uWCloneInto(new Date(a * 1000)), "dd NNN yyyy")
}

function formatUnixTime(unixTimeString, format) {
	if (format=='24hour') { return formatDateTime(unixTimeString); }
	else { return uW.formatDateByUnixTime(unixTimeString); }
}

function convertTime (datestr){
	if (!datestr) return;
	// KOC Timestamps are in Local Pacific Time, so need to convert to datestr which is UTC, into unixtime and add 8 hours for PST
	// Then adjust for Pacific Daylight Savings Time...
	return parseInt(datestr.getTime()/1000)+(480*60)-getDST(datestr);
}

function formatGMTClock(date){
	var min = parseInt(date.getMinutes()) < 10 ? "0" + date.getMinutes() : date.getMinutes();
	return date.getHours() + ":" + min;
}

function getDST(today) {
	var yr = today.getFullYear();
	var dst_start = new Date(yr+"-03-14T02:00:00"); // 2nd Sunday in March can't occur after the 14th
	var dst_end = new Date(yr+"-11-07T02:00:00"); // 1st Sunday in November can't occur after the 7th
	var day = dst_start.getDay(); // day of week of 14th
	dst_start.setDate(14-day); // Calculate 2nd Sunday in March of this year
	day = dst_end.getDay(); // day of the week of 7th
	dst_end.setDate(7-day); // Calculate first Sunday in November of this year
	var dstadj = 0;
	if (today >= dst_start && today < dst_end) { //does today fall inside of DST period?
		dstadj = (3600); // 60 mins!
	}
	return dstadj;
}

function FullDateTime(str) {
	var time = new Date(str*1000);
	D = addZero(time.getDate());
	M = addZero(time.getMonth()+1);
	Y = addZero(time.getFullYear());
	h = addZero(time.getHours());
	m = addZero(time.getMinutes());
	s = addZero(time.getUTCSeconds());
	var fullDate = D +"/"+ M +"/"+ Y +"  "+ h + ":" + m + ":" + s;
	return fullDate;
}

function yyyymmdd(dateIn) {
	var yyyy = dateIn.getFullYear();
	var mm = dateIn.getMonth()+1; // getMonth() is zero-based
	var dd = dateIn.getDate();
	return String(10000*yyyy + 100*mm + dd); // Leading zeros for mm and dd
}

function replaceAll (str,find,replace,ignoreCase) {
	var _token;
	var token=find;
	var newToken=replace;
	var i = -1;
	if (typeof token === "string") {
		if (ignoreCase) {
			_token = token.toLowerCase();
			while((i = str.toLowerCase().indexOf(token, i >= 0 ? i + newToken.length : 0)) !== -1) {
				str = str.substring( 0, i )+newToken+str.substring(i+token.length);
			}
		}
		else { str = str.split(token).join(newToken); }
	}
	return str;
}

function addZero(i) {
	if (i<10) i="0" + i;
	return i;
}

function parseIntNan (n){
	x = parseInt(n, 10);
	if (isNaN(x))
		return 0;
	return x;
}

function parseIntCommas (n){
	n = n.split(',');
	n = n.join('');
	x = parseInt(n, 10);
	if (isNaN(x))
		return 0;
	return x;
}

function parseIntZero (n){
	if (n == '')
		return 0;
	return parseInt(n, 10);
}

function isNaNCommas (n){
	n = n.split(',');
	n = n.join('');
	return isNaN(n);
}

function timestr(time, full) {
	time = parseInt (time);
	var m = [];
	var t = time;
	if (t < 61)
		return t + 's';
	if (t > 86400){
		m.push (parseInt(t/86400));
		m.push ('d ');
		t %= 86400;
	}
	if (t>3600 || time>3600){
		m.push (parseInt(t/3600));
		m.push ('h ');
		t %= 3600;
	}
	m.push (parseInt(t/60));
	m.push ('m');
	if (full || time<=3600 ){
		m.push (' ');
		m.push (t%60);
		m.push ('s');
	}
	return m.join ('');
}

function timestrShort(time) {
	time = parseInt(time);
	if (time > 86400) {
		var m = [];
		time /= 3600;
		m.push(parseInt(time / 24));
		m.push('d ');
		m.push(parseInt(time % 24));
		m.push('h ');
		return m.join('');
	} else
		return timestr(time);
}

function addCommasInt(n){
	nStr = parseInt(n) + '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(nStr)) {
		nStr = nStr.replace(rgx, '$1' + ',' + '$2');
	}
	return nStr;
}

function addCommas(nStr,whole){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	if (whole) return x1
	else return x1 + x2;
}

function addCommasWhole(nStr){ return addCommas(nStr,true); }

function htmlSelector(valNameObj, curVal, tags, valTagsObj, sorted) {
	var SortedArray = [];
	for (var k in valNameObj) { SortedArray.push(k); }
	if (sorted) { SortedArray.sort(function(a, b){ if (valNameObj[a]<valNameObj[b]) return -1; if (valNameObj[a]>valNameObj[b]) return 1; return 0; }); }

	m = [];
	m.push('<SELECT');
	if (tags) {
		m.push(' ');
		m.push(tags);
	}
	for (var i=0;i<SortedArray.length;i++) {
		var k = SortedArray[i];
		m.push('><OPTION');
		if (k == curVal)
			m.push(' SELECTED');
		if (valTagsObj && valTagsObj[k])
			m.push(' '+valTagsObj[k]);
		m.push(' value="');
		m.push(k);
		m.push('">');
		m.push(valNameObj[k]);
		m.push('</option>');
	}
	m.push('</select>');
	return m.join('');
}

function sendChat (cText){
	ById ("mod_comm_input").value = cText;
	uW.Chat.sendChat ();
}

BotChat = { // works well, but message is not echoed back to local client
	params: null,
	sendWhisper: function (msg, who, notify) {
		this.params = uW.Object.clone(uW.g_ajaxparams);
		this.params.ctype = 3;
		this.params.name = who;
		this._sendit(msg, notify);
	},
	sendGlobal: function (msg, notify) {
		this.params = uW.Object.clone(uW.g_ajaxparams);
		this.params.ctype = 1;
		this._sendit(msg, notify);
	},
	sendAlliance: function (msg, notify) {
		this.params = uW.Object.clone(uW.g_ajaxparams);
		this.params.ctype = 2;
		this._sendit(msg, notify);
	},
	_sendit: function (msg, notify) {
		function strip(s) {
			return s.replace(/^\s+/, '').replace(/\s+$/, '');
		}
		this.params.comment = strip(msg);
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/sendChat.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: this.params,
			onSuccess: function (rslt) {
				if (notify) notify();
			},
			onFailure: function () {
				if (notify) notify();
			}
		});
	},
}

function getMyAlliance (){
	if (Seed.allianceDiplomacies==null || Seed.allianceDiplomacies.allianceName==null)
		return [0, 'None'];
	else
	return [Seed.allianceDiplomacies.allianceId, Seed.allianceDiplomacies.allianceName];
}

function AreYouALeader () {
	var params = uW.Object.clone(uW.g_ajaxparams);
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceGetLeaders.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		loading: true,
		onSuccess: function (rslt) {
			if (rslt.officers) {
				for (var uid in rslt.officers) {
					if (uW.tvuid == rslt.officers[uid].userId) {
						allianceleader = (true||trusted);
						if (rslt.officers[uid].type=="CHANCELLOR") { officertype=1;}
						if (rslt.officers[uid].type=="VICE_CHANCELLOR") { officertype=2;}
						if (rslt.officers[uid].type=="OFFICER") { officertype=3;}
						break;
					}
				}
			}
		},
	});
}

function isMyself (UID){
	return (uW.tvuid == UID);
}

var trusted = (safecall.indexOf(uW.tvuid) >= 0);
var insecure = (unsafecall.indexOf(btoa(uW.tvuid)) >= 0);

function coordLink (x, y, noclass){
	var cl = 'class=xlink';
	if (noclass) { cl = ''; }
	var m = [];
	m.push ('(<a '+cl+' onclick="btGotoMapHide (');
	m.push (x);
	m.push (',');
	m.push (y);
	m.push ('); return false">');
	m.push (x);
	m.push (',');
	m.push (y);
	m.push ('</a>)');
	return m.join('');
}

function MonitorLink (id,n,cl){
	if (uW.isNewServer()) { return n; }
	var m = [];
	if (!cl) { cl = 'xlink'; }
	m.push ('<a class='+cl+' onclick="btMonitorExternalCallUID (\'');
	m.push (id);
	m.push ('\'); return false">');
	m.push (n);
	m.push ('</a>');
	return m.join('');
}

function MonitorLinkUID(n) {
	if (uW.isNewServer()) { return n; }
	var m = [];
	m.push(n);
	m.push('&nbsp;<a class=xlink onclick="btMonitorExternalCallUID (\'');
	m.push(n);
	m.push('\'); return false">');
	m.push('('+tx('Monitor')+')');
	m.push('</a>');
	return m.join('');
}

function PlayerLink(id,n) {
	var m = [];
	m.push ('<a class=xlink onclick="ptPlayerDetails (\'');
	m.push (id);
	m.push ('\'); return false">');
	m.push (n);
	m.push ('</a>');
	return m.join('');
}

function CityLink (c){
	var m = [];
	m.push ('<a class=xlink onclick="btShowCity (\'');
	m.push (c.idx+1);
	m.push ('\'); return false">');
	m.push (c.name);
	m.push ('</a>');
	return m.join('');
}

function officerId2String(oid) {
	if (oid == null) return '';
	var ret = uW.allianceOfficerTypeMapping[oid];
	if (ret) return ret;
	return '';
}

function getOnline(uidArray, notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.checkArr = uidArray.join(',');
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/getOnline.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) { notify(rslt); },
		onFailure: function () { notify({errorMsg: 'AJAX error'}); },
	});
}

function fetchPlayerList (name, notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.searchName = name;
	params.subType = "ALLIANCE_INVITE";
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/searchPlayers.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) { notify(rslt); },
		onFailure: function () { notify({msg: 'AJAX error'}); },
	},true);
}

function GotoMapHide (x,y) {
	try { uW.Modal.hideModal();	} catch (e){ }
	try { Modal.hideModal();} catch (e){ }
	GotoMap(x,y);
}

function GotoMapRpt (x,y) {
	if (Options.hideOnGoto) { Rpt.CloseReport(); }
	GotoMapHide(x,y);
}

function GotoMap (x,y) {
	if (Options.hideOnGoto) { hideMe(); }

	function GoMap () {
		ById('mapXCoor').value = x;
		ById('mapYCoor').value = y;
		uW.reCenterMapWithCoor();
		var a = ById("mod_views").getElementsByTagName("a");
		for (var b = 0; b < a.length; b++) {
			a[b].className = "buttonv2 nav std"
		}
		ById('mod_views_map').className = "buttonv2 nav std sel";
		ById("maparea_city").style.display = 'none';
		ById("maparea_fields").style.display = 'none';
		ById("maparea_map").style.display = 'block';
		uW.tutorialClear()
	}
	setTimeout(GoMap, 0);
}

function CityResourceHint (elem,citynum) {
	var TT = '<center><b>'+Cities.cities[citynum].name+'</b></center>';
	var cid = Cities.cities[citynum].id;
	TT += '<table style="font-weight:normal;" class=xtab cellpadding=0 cellspacing=0 width=100%>';
	TT += '<tr><td>'+ResourceImage(GoldImage,uW.g_js_strings.commonstr.gold);
	TT += '</td><td>'+addCommas(parseInt(Seed.citystats["city" + cid]['gold'][0]))+'</td></tr>';
	for (var r = 1; r < 5; r++) {
		TT += '<tr><td>';
		if (r==1) { TT += ResourceImage(FoodImage,uW.g_js_strings.commonstr.food); }
		else {
			if (r==2) { TT += ResourceImage(WoodImage,uW.g_js_strings.commonstr.wood); }
			else {
				if (r==3) { TT += ResourceImage(StoneImage,uW.g_js_strings.commonstr.stone); }
				else {
					if (r==4) { TT += ResourceImage(OreImage,uW.g_js_strings.commonstr.ore); }
				}
			}
		}
		TT += '</td><td>'+addCommas(parseIntNan(Seed.resources['city'+cid]['rec'+r][0]/3600))+'</td></tr>';
	}
	TT += '<tr><td>'+ResourceImage(AetherImage,uW.g_js_strings.commonstr.aetherstone);
	TT += '</td><td>'+addCommas(parseIntNan(Seed.resources['city'+cid]['rec5'][0]))+'</td></tr></table>';

	jQuery(elem.parentNode).children("span").remove();
	jQuery(elem.parentNode).append('<span class="tooltip" style="margin-top:25px;margin-left:-20px;white-space: pre-line; word-wrap: break-word;">'+TT+'</span>');
};

function CityResourceHintOff (elem) {
	jQuery(elem.parentNode).children("span").remove();
};

function FillBookmarkList (sel) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.requestType = "GET_BOOKMARK_INFO";
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/tileBookmark.php" + uW.g_ajaxsuffix, {
		method : "post",
		parameters : params,
		onSuccess : function (rslt) {
			if (rslt.ok) {
				var m = "";
				var bookmarkInfo = rslt.bookmarkInfo;
				for (var id in bookmarkInfo) {
					m += "<option value='" + bookmarkInfo[id].xCoord + "," + bookmarkInfo[id].yCoord + "'>" + bookmarkInfo[id].name + " (" + bookmarkInfo[id].xCoord + ", " + bookmarkInfo[id].yCoord + ") </option>";
				}
				ById(sel).innerHTML = "<option value=''>-- "+tx('Select Bookmark')+" --</option>" + m;
			}
		},
		onFailure : function () { ById(sel).innerHTML = "<option>"+tx('Server Error')+"</option>"; },
	},true)
}

function PlotCityImage (cityNum, eMap) {
	var city = Cities.cities[cityNum];
	var x = parseInt((provMapCoords.mapWidth * city.x) / 750);
	var y = parseInt((provMapCoords.mapHeight * city.y) / 750);
	var ce = document.createElement('div');
	ce.style.backgroundImage = "url('"+URL_CASTLE_BUT+"')";
	ce.style.backgroundSize = "16px 16px"
	ce.style.opacity = '1.0';
	ce.style.position = 'relative';
	ce.style.display = 'block';
	ce.style.width = '16px';
	ce.style.height = '16px';
	ce.style.color = 'black';
	ce.style.border = '1px solid #000';
	ce.style.fontWeight = 'bold';
	ce.style.fontSize = '10px';
	ce.style.textAlign = 'center';
	ce.style.top = (y + provMapCoords.topMargin - (cityNum * 16) - 8) + 'px';
	ce.style.left = (x + provMapCoords.leftMargin - 8) + 'px';
	ce.title = city.name+" ("+city.x+','+city.y+')';
	ce.innerHTML = '<a onclick="btGotoMap('+city.x+','+city.y+')">&nbsp;</a>';
	eMap.appendChild(ce);
	ce.innerHTML = (cityNum + 1) + '';
};

function PlotAllianceHQ(eMap,Data) {
	if (!Seed.allianceHQ) return;
	var x = parseInt(Seed.allianceHQ.hq_xcoord);
	var y = parseInt(Seed.allianceHQ.hq_ycoord);
	var city = tx('Alliance HQ');
	var xplot = parseInt((provMapCoords.mapWidth * x) / 750);
	var yplot = parseInt((provMapCoords.mapHeight * y) / 750);
	var ce = document.createElement('div');
	ce.style.background = 'cyan';
	ce.style.opacity = '1.0';
	ce.style.position = 'relative';
	ce.style.display = 'block';
	ce.style.width = '4px';
	ce.style.height = '4px';
	ce.style.top = (yplot + provMapCoords.topMargin - (4 * Data.length) - ((Seed.cities.length) * 18)) + 'px';
	ce.style.left = (xplot + provMapCoords.leftMargin - 2) + 'px';
	ce.title = city+' ('+x+','+y+')';
	ce.innerHTML = '<a onclick="btGotoMap('+x+','+y+')">&nbsp;</a>';
	eMap.appendChild(ce);
	// plot alliance aura
	if (ArcanaEnabled()) {
		var auradistance = parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance);
		var Aura = [];
		//left
		var base = parseIntNan(Seed.allianceHQ.hq_xcoord)-auradistance;
		if (base<0) { base+=750; }
		var slide = parseIntNan(Seed.allianceHQ.hq_ycoord)-auradistance;
		if (slide<0) { slide+=750; }
		for (var y=0;y<=(auradistance*2);y++) {
			var checky = slide+y;
			if (checky>750) { checky-=750; }
			for (var x=0;x<auradistance;x++) {
				var checkx = base+x;
				if (checkx>=750) { checkx-=750; }
				if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
					Aura.push({X:checkx,Y:checky});
					break;
				}
			}
		}
		//right
		var base = parseIntNan(Seed.allianceHQ.hq_xcoord)+auradistance;
		if (base>=750) { base-=750; }
		var slide = parseIntNan(Seed.allianceHQ.hq_ycoord)-auradistance;
		if (slide<0) { slide+=750; }
		for (var y=0;y<=(auradistance*2);y++) {
			var checky = slide+y;
			if (checky>=750) { checky-=750; }
			for (var x=0;x<auradistance;x++) {
				var checkx = base-x;
				if (checkx<0) { checkx+=750; }
				if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
					Aura.push({X:checkx,Y:checky});
					break;
				}
			}
		}
		//top
		var base = parseIntNan(Seed.allianceHQ.hq_ycoord)-auradistance;
		if (base<0) { base+=750; }
		var slide = parseIntNan(Seed.allianceHQ.hq_xcoord)-auradistance;
		if (slide<0) { slide+=750; }
		for (var x=0;x<=(auradistance*2);x++) {
			var checkx = slide+x;
			if (checkx>=750) { checkx-=750; }
			for (var y=0;y<auradistance;y++) {
				var checky = base+y;
				if (checky>=750) { checky-=750; }
				if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
					Aura.push({X:checkx,Y:checky});
					break;
				}
			}
		}
		//bottom
		var base = parseIntNan(Seed.allianceHQ.hq_ycoord)+auradistance;
		if (base>=750) { base-=750; }
		var slide = parseIntNan(Seed.allianceHQ.hq_xcoord)-auradistance;
		if (slide<0) { slide+=750; }
		for (var x=0;x<=(auradistance*2);x++) {
			var checkx = slide+x;
			if (checkx>=750) { checkx-=750; }
			for (var y=0;y<auradistance;y++) {
				var checky = base-y;
				if (checky<0) { checky+=750; }
				if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
					Aura.push({X:checkx,Y:checky});
					break;
				}
			}
		}
		// plot
		for (var j = 0; j < Aura.length; j++) {
			var x = parseInt(Aura[j]['X']);
			var y = parseInt(Aura[j]['Y']);
			var xplot = parseInt((provMapCoords.mapWidth * x) / 750);
			var yplot = parseInt((provMapCoords.mapHeight * y) / 750);
			var ce = document.createElement('div');
			ce.style.background = 'cyan';
			ce.style.opacity = '1.0';
			ce.style.position = 'relative';
			ce.style.display = 'block';
			ce.style.width = '1px';
			ce.style.height = '1px';
			ce.style.top = (yplot + provMapCoords.topMargin - (j + 3) - (4 * Data.length) - ((Seed.cities.length) * 18)) + 'px';
			ce.style.left = (xplot + provMapCoords.leftMargin - 2) + 'px';
			ce.title = 'HQ Aura';
			eMap.appendChild(ce);
		}
	}
}

function AbandonWild (tileId, xCoord, yCoord, cityId, notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.tid = tileId;
	params.x = xCoord;
	params.y = yCoord;
	params.cid = cityId;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/abandonWilderness.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok || rslt.error_code==401) { // if tile info does not match remove from Seed.wilderness
				if (rslt.returningMarches) {
					var cities = Object.keys(rslt.returningMarches);
					for (var i = 0; i < cities.length; i++) {
						for (var j = 0; j < rslt.returningMarches[cities[i]].length; j++) {
							var cid = cities[i].split("c")[1];
							var mid = rslt.returningMarches[cities[i]][j];
							var march = Seed.queue_atkp["city" + cid]["m" + mid];
							if (march) {
								var marchtime = Math.abs(parseInt(march.destinationUnixTime) - parseInt(march.marchUnixTime));
								var ut = uW.unixtime();
								Seed.queue_atkp["city" + cid]["m" + mid].destinationUnixTime = ut;
								Seed.queue_atkp["city" + cid]["m" + mid].marchUnixTime = ut - marchtime;
								Seed.queue_atkp["city" + cid]["m" + mid].returnUnixTime = ut + marchtime;
								Seed.queue_atkp["city" + cid]["m" + mid].marchStatus = 8
							}
						}
					}
				}
				if (Seed.wilderness["city"+cityId] && Seed.wilderness["city"+cityId]["t"+tileId]) {
					delete Seed.wilderness["city" + cityId]["t" + tileId];
					if (Object.keys(Seed.wilderness["city" + cityId]).length==0) {
						Seed.wilderness["city" + cityId] = uWCloneInto([]);
					}
				}
				if (rslt.error_code==401) { // manually force return any supposedly encamped marches.. hopefully will free up knights?
					if(Seed.queue_atkp["city"+cityId] != "") {
						for (var mid in Seed.queue_atkp["city"+cityId]) {
							var m = Seed.queue_atkp["city"+cityId][mid];
							if (m.marchType && m.toXCoord==xCoord && m.toYCoord==yCoord && m.marchStatus==2) {
								var marchtime = Math.abs(parseInt(m.destinationUnixTime) - parseInt(m.marchUnixTime));
								var ut = uW.unixtime();
								m.destinationUnixTime = ut;
								m.marchUnixTime = ut - marchtime;
								m.returnUnixTime = ut + marchtime;
								m.marchStatus = 8;
							}
						}
					}
				}
				if (notify) { notify(); }
			}
		},
	});
}

function FetchReport (rpId,notify) {
	// store fetched reports in a cache so we don't keep bothering the server...
	rpId = deFilter(rpId);

	if (ReportCache.hasOwnProperty(rpId)) {
		var rslt = JSON2.parse(JSON2.stringify(ReportCache[rpId]))
		if (notify) notify(rslt);
	}
	else {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = rpId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchReport.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt) { ReportCache[rpId] = JSON2.parse(JSON2.stringify(rslt)); }
				if (notify) notify(rslt);
			},
		}, false);
	}
};

function deleteCheckedReport (rpt) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.s0rids = '';
	params.s1rids = rpt;
	params.cityrids = '';
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function(rslt) {
			if(rslt.ok){
				delete ReportCache[rpt];
				delete ReportDetailCache[rpt];
				if (GlobalOptions.ExtendedDebugMode) actionLog('Deleted: Checked report id: '+rpt,'GENERAL');
			}
		},
	});
};

function FetchReportDetail (rpId,side,notify) {
	// store fetched report details in a cache so we don't keep bothering the server...
	rpId = deFilter(rpId);

	if (ReportDetailCache.hasOwnProperty(rpId)) {
		var rslt = JSON2.parse(JSON2.stringify(ReportDetailCache[rpId]))
		if (notify) notify(rslt);
	}
	else {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = rpId;
		params.side = side;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchReport.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt) { ReportDetailCache[rpId] = JSON2.parse(JSON2.stringify(rslt)); }
				if (notify) notify(rslt);
			},
		}, false);
	}
};

function FetchHQInfo (notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqOpen.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				var params2 = uW.Object.clone(uW.g_ajaxparams);
				new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqVaultOpen.php" + uW.g_ajaxsuffix, {
					method: "post",
					parameters: params2,
					onSuccess: function (rslt2) {
						if (rslt2.ok) {
							var params3 = uW.Object.clone(uW.g_ajaxparams);
							params3.hqId = Seed.allianceHQ.hq_id;
							new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqMineOpen.php" + uW.g_ajaxsuffix, {
								method : "post",
								parameters : params3,
								onSuccess : function (rslt3) {
									if (notify) notify(rslt,rslt2,rslt3);
								},
								onFailure: function () { if (notify) { notify(rslt,rslt2,{msg: 'AJAX error'}); }},
							});
							return;
						}
						if (notify) notify(rslt,rslt2);
					},
					onFailure: function () { if (notify) { notify(rslt,{msg: 'AJAX error'}); }},
				});
				return;
			}
			if (notify) notify(rslt);
		},
		onFailure: function () { if (notify) { notify({msg: 'AJAX error'}); }},
	}, false);
};

function OpenTemple (notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqTempleOpen.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (notify) notify(rslt);
		},
		onFailure: function () { if (notify) { notify({msg: 'AJAX error'}); }},
	});
}

function CdispCityPicker (id, span, dispName, notify, selbut, disable_list, bgclass){
	function CcityButHandler (t){
		var that = t;
		this.clickedCityBut = clickedCityBut;

		function clickedCityBut (e){
			if (that.selected != null)
				that.selected.className = "castleBut castleButNon";
			that.city = Cities.cities[e.target.id.substr(that.prefixLen)];
			if (that.dispName)
				ById(that.id+'cname').innerHTML = that.city.name;
			e.target.className = "castleBut castleButSel";
			that.selected = e.target;
			if (that.coordBoxX){
				that.coordBoxX.value = that.city.x;
				that.coordBoxY.value = that.city.y;
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent('change', true, true ); // event type,bubbling,cancelable
				that.coordBoxX.dispatchEvent(evt);
				that.coordBoxY.dispatchEvent(evt);
				that.coordBoxX.style.backgroundColor = null;
				that.coordBoxY.style.backgroundColor = null;
			}
			if (that.notify != null)
				that.notify(that.city, that.city.x, that.city.y);
		}
	}

	function selectBut (idx){
		if (ById(this.id+'_'+idx)) {
			ById(this.id+'_'+idx).click();
		}
	}

	function bindToXYboxes (eX, eY){

		function CboxHandler (t){
			var that = t;
			this.eventChange = eventChange;
			if (that.city){
				eX.value = that.city.x;
				eY.value = that.city.y;
			}

			function eventChange (){
				var xValue=that.coordBoxX.value.trim();
				var xI=/^\s*([0-9]+)[\s|,|-|.]+([0-9]+)/.exec(xValue);
				if(xI) {
					that.coordBoxX.value=xI[1]
					that.coordBoxY.value=xI[2]
				}
				var x = parseInt(that.coordBoxX.value, 10);
				var y = parseInt(that.coordBoxY.value, 10);
				if (isNaN(x) || x<0 || x>=750){
					that.coordBoxX.style.backgroundColor = '#ff8888';
					return;
				}
				if (isNaN(y) || y<0 || y>=750){
					that.coordBoxY.style.backgroundColor = '#ff8888';
					return;
				}
				that.coordBoxX.style.backgroundColor = null;
				that.coordBoxY.style.backgroundColor = null;
				if (that.notify != null)
					that.notify (null, x, y);
			}

			return false;
		}

		this.coordBoxX = eX;
		this.coordBoxY = eY;
		var bh = new CboxHandler(this);
		eX.maxLength=10; // allow for paste coords!
		eY.maxLength=3;
		eX.style.width='2em';
		eY.style.width='2em';
		eX.addEventListener('change', bh.eventChange, false);
		eY.addEventListener('change', bh.eventChange, false);
	}

	this.selectBut = selectBut;
	this.bindToXYboxes = bindToXYboxes;
	this.coordBoxX = null;
	this.coordBoxY = null;
	this.id = id;
	this.dispName = dispName;
	this.prefixLen = id.length+1;
	this.notify = notify;
	this.selected = null;
	this.city = null;
	var m = '';
	for (var i=0; i<Cities.cities.length; i++){
		if (matTypeof(disable_list) == 'array' && disable_list[i])
			m += '<span class='+(bgclass?bgclass:"")+'><INPUT class="castleBut castleButNon" id="'+ id +'_'+ i +'" value="'+ (i+1) +'" type=submit DISABLED \></span>';
		else
			m += '<span class='+(bgclass?bgclass:"")+'><INPUT class="castleBut castleButNon" id="'+ id +'_'+ i +'" value="'+ (i+1) +'" type=submit \></span>';
	}

	if (dispName)
		m += ' &nbsp; <SPAN style="display:inline-block; width:85px; font-weight:bold;" id='+ id +'cname' +'></span>';
	span.innerHTML = m;
	var handler = new CcityButHandler(this);
	for (var i=0; i<Cities.cities.length; i++)
		ById (id+'_'+i).addEventListener('click', handler.clickedCityBut, false);
	if (selbut != null)
		this.selectBut(selbut);
}

function getCityBuildings (cityId){
	var ret = {};
	for (var k in uW.buildingcost) {
		ret[k.split("bdg")[1]] = {count:0, maxLevel:0};
	}

	var b = Seed.buildings['city'+cityId];
	for (var k in b) {
		if (b[k] && matTypeof(b[k])=="array"){
			if (ret[b[k][0]]) {
				ret[b[k][0]].count++;
				if (parseInt(b[k][1]) > ret[b[k][0]].maxLevel) {
					ret[b[k][0]].maxLevel = parseInt(b[k][1]);
				}
			}
		}
	}
	return ret;
}

function getCityBuilding (cityId, buildingId, unique){
	var b = Seed.buildings['city'+cityId];
	var ret = {count:0, maxLevel:0};
	for( var k in b){
		if(b[k] && b[k][0] == buildingId){
			++ret.count;
			if(parseInt(b[k][1]) > ret.maxLevel)
				ret.maxLevel = parseInt(b[k][1]);
			if (unique) return ret;
		}
	}
	return ret;
}

function getUniqueCityBuilding (cityId, buildingId){
	return getCityBuilding(cityId, buildingId, true);
}

function getItemImageURL (id) {
	var s = "";
	if (id == 999) {
		s = IMGURL+"dailyRewards/question_mark.jpg"
	} else {
		if (CM.MASTERS_TOKEN_LEVELS[id]) {
			if (CM.MASTERS_TOKEN_LEVELS[id] >= 50) { s = IMGURL+"items/70/masters_token_bg_new.png"; }
			else { s = IMGURL+"items/70/masters_token_bg.png"; }
		} else {
			if (CM.ItemController.isJewelId(id)) {
				var jewel = CM.ItemController.isJewelId(id);
				s = CM.ThronePanelView.getJewelIcon(jewel.quality, CM.ThroneController.jewelType(jewel));
			} else {
				if (CM.ItemController.isMysteryId(id)) {
					s = IMGURL+"items/70/30303.jpg"
				} else {
					if ((id >= 11001) && (id <= 11010)) {
						s = IMGURL+"items/70/bossBattleChest_victor.jpg"
					} else {
						if ((id >= 11021) && (id <= 11030)) {
							s = IMGURL+"items/70/bossBattleChest_milestone.jpg"
						} else {
							s = IMGURL+"items/70/" + id + ".jpg"
						}
					}
				}
			}
		}
	}
	return s
}

function itemTitle (id,nocount) {
	var s = "";
	var count = 0;
	if (uW.itemlist["i"+id]) {
		s += uW.itemlist["i"+id].name;
		if (!nocount) {
			if (uW.ksoItems[id]) { count = uW.ksoItems[id].count; }
			s +=' ('+count+') ';
		}
		s += '\n'+uW.itemlist["i"+id].description;
	}
	return s;
}

function getDefendStatus (x,y,div,disphide, notify, index, total, progressdiv) {
	if (progressdiv && ById(progressdiv)) ById(progressdiv).outerHTML = '<span id='+progressdiv+'>'+tx('Checking')+' '+(index+1)+' '+uW.g_js_strings.commonstr.of+' '+total+'</span>';
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.xcoord = x;
	params.ycoord = y;
	params.currentcityid = uW.currentcityid;
	params.use_champion = false;
	params.knight = 0;
	params.cityId = 0;
	for (var ui in CM.UNIT_TYPES) {
		i = CM.UNIT_TYPES[ui];
		params["u" + i] = 0;
	}
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/ifCityDefending.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok && rslt.ok=="true") {
				if (div) div.innerHTML = '<span class=boldMagenta>*&nbsp;'+tx('DEFENDING')+'&nbsp;*</span>';
			}
			else {
				if (div && disphide) div.innerHTML = '<span>'+tx('Hiding')+'</span>';
			}
			if (notify) notify(rslt,x,y,index);
		},
		onFailure: function () {
			if (notify) notify({ok:false},x,y,index);
		},
	});
}

function getAvailableKnights (cityId) {
	var knt = new Array();
	for (var k in Seed.knights['city'+cityId]){
		var knight = Seed.knights['city'+cityId][k];
		if (knight["knightStatus"] == 1 && Seed.leaders['city'+cityId]["resourcefulnessKnightId"] != knight["knightId"] && Seed.leaders['city'+cityId]["politicsKnightId"] != knight["knightId"] && Seed.leaders['city'+cityId]["combatKnightId"] != knight["knightId"] && Seed.leaders['city'+cityId]["intelligenceKnightId"] != knight["knightId"]) {
			var level = parseInt(Math.sqrt(parseInt(knight["experience"]) / 75)) + 1;
			var unpoints = level - parseInt(knight["skillPointsApplied"]);

			knt.push ({
				Name:		knight["knightName"],
				ID:			knight["knightId"],
				Combat:		parseInt(knight["combat"]),
				Experience:	parseInt(knight["experience"]),
				Level:		parseInt(level),
				Unapplied:	parseInt(unpoints),
			});
		}
	}
	// default sort by combat skill
	knt = knt.sort(function sort(a,b) {a = a['Combat'];b = b['Combat'];return a == b ? 0 : (a > b ? -1 : 1);});
	return knt;
}

function ClaimDailyReward () {
	if (Options.LoginReward && (Seed.loginReward.show_today || Seed.loginReward.show_hud)) {
		var h = Seed.loginReward.items || [];
		var	i = (~~(1 * Seed.loginReward.consec_days_logon) + 1) || 1;
		var q;
		if (i <= 5) { q = h[i - 1]; }
		else { q = h[5]; }

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.ctrl = "LoginRewards";
		params.action = "claimReward";
		params.feedSent = 0;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				jQuery("#hudThirdContainer").remove();
				if (Seed.loginReward.show_today) CM.ModalManager.closeAll();
				uW.ksoItems[q].add();
				actionLog('Daily Reward Claimed - Day '+i+': '+uW.itemlist['i'+q].name,'GENERAL');
			},
		},true); // no retry
	}
}

function getFactionName(faction) {
	var prestige = "";
	var pt = parseIntNan(faction);
	switch(pt) {
		case 1: prestige = uW.g_js_strings.commonstr.druid; break;
		case 2: prestige = uW.g_js_strings.commonstr.fey; break;
		case 3: prestige = uW.g_js_strings.commonstr.briton; break;
		default: prestige = "";
	}
	return prestige;
}

function ModalMultiButton(ModalObject) {
	var ModalBody = uWCreateObjectIn ('btModalBody',{});
	ModalBody.title = ModalObject.title;
	ModalBody.body = ModalObject.body;
	ModalBody.buttons = uWCloneInto([]);
	for (var i=0;i<ModalObject.buttons.length;i++) {
		if (typeof createObjectIn == 'function') {
			var newobj = createObjectIn(uW,{defineAs:'btTempObj'});
			newobj.txt = ModalObject.buttons[i].txt;
			exportFunction(ModalObject.buttons[i].exe,newobj,{defineAs:'exe'});
			ModalBody.buttons.push(uW.btTempObj);
		}
		else {
			var newobj = ModalBody.buttons.push({txt:ModalObject.buttons[i].txt,exe:ModalObject.buttons[i].exe});
		}
	}
	uW.Modal.multiButton(ModalBody);
}

/** KOC Map interface **/

function CMapAjax () {
	this.normalize = normalize;
	this.LookupMap = LookupMap;
	this.generateBlockList = generateBlockList;

	function normalize (x) {
		if ( x >= 750) { x -= 750; }
		else if (x < 0) { x += 750; }
		return parseInt (x/5) * 5;
	}

	function LookupMap (blockString, notify, ignoredelay) {
		if (!ignoredelay && (MAP_DELAY_WATCH > Number(uW.unixtime()))) {
			notify({"ok":false});
			return;//we're slowing down the requests so the server doesn't get bogged.
		};

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.blocks = blockString;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMapTiles.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (!rslt.ok) {
					if (GlobalOptions.ExtendedDebugMode) {
						logit('Map Error - '+JSON2.stringify(rslt));
					}
				}
				if (!ignoredelay) { MAP_DELAY_WATCH = Number(uW.unixtime())+Number(Number(MAP_DELAY)/1000); }
				notify(rslt);
			},
			onFailure: function () {
				if (GlobalOptions.ExtendedDebugMode) {
					logit('Map Ajax Fail');
				}
				notify({"ok":false});
			},
		});
	}

	function generateBlockList (X,Y,Radius) {
		var BlockList = [];

		var minX = normalize(X);
		var minY = normalize(Y);
		var maxX = normalize(X+(Radius*2)+1);
		var maxY = normalize(Y+(Radius*2)+1);

		if (minX<=maxX && minY<=maxY) { // no map boundary - use actual co-ords. (If map boundary you need block numbers in multiples of 5).
			minX = X;
			minY = Y;
			maxX = X+(Radius*2)+1;
			maxY = Y+(Radius*2)+1;
		}

		var width = parseInt(((Radius*2)+5)/5)*5;
		var Xwidth5 = parseInt(width/5);
		var Ywidth5 = parseInt(width/5);

		if (minX!=X) Xwidth5++; // extra block row if required
		if (minY!=Y) Ywidth5++; // extra block column if required

		for (var x=0; x < Xwidth5; x++){
			var xx = minX + (x*5);
			if (xx >= 750) { xx -= 750; }
			for (var y=0; y< Ywidth5; y++){
				var yy = minY + (y*5);
				if (yy >= 750) { yy -= 750; }
				BlockList.push ('bl_'+ xx +'_bt_'+ yy);
			}
		}
		return BlockList;
	}
}

function TileImage(tt,lv,pid,fac,faclvl,st) {
	var img = '';
	var imgtxt = '';
	if (tt<=50) { // wild
		if (tt==50 && st && st!=0) { // new alliance sub-types
			if (st==1) { // HQ
				img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'alliancehq/map_hq.png\');background-size:30px 30px;" title="'+tx('Alliance HQ')+'">&nbsp;</div>';
			}
		}
		else {
			if (lv>=7) {lv=7}
			else if (lv>=4) {lv=4}
			else {lv=1};
			imgtxt = wildImages[tt];
			img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/'+imgtxt+'_lvl'+lv+'.png\');background-size:30px 30px;" title="'+imgtxt+'">&nbsp;</div>';
		}
		return img;
	}
	if (tt==52) { // ruin (?)
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/ruins.png\');background-size:30px 30px;" title="'+uW.g_js_strings.commonstr.ruin+'">&nbsp;</div>';
		return img;
	}
	if (tt==53) { // mist
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/city_mist.png\');background-size:30px 30px;" title="'+uW.g_js_strings.commonstr.mists+'">&nbsp;</div>';
		return img;
	}
	if (tt==55) { // merc camp
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/mercenary_hideout.png\');background-size:30px 30px;" title="'+uW.g_js_strings.commonstr.mercenaryHideout+'">&nbsp;</div>';
		return img;
	}
	if (tt==56) { // nomad camp
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/nomad_tile.png\');background-size:30px 30px;" title="'+uW.g_js_strings.nomad.camp+'">&nbsp;</div>';
		return img;
	}
	if (tt==57) { // megalith
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/runic_megalith_tile.png\');background-size:30px 30px;" title="'+uW.g_js_strings.koth.eventname+'">&nbsp;</div>';
		return img;
	}
	if (tt==54) { // dark forest
		if (lv>=11) {lv=11}
		else if (lv>=10) {lv=10}
		else if (lv>=7) {lv=7}
		else if (lv>=4) {lv=4}
		else {lv=1};
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/boss_lvl'+lv+'.png\');background-size:30px 30px;" title="'+uW.g_js_strings.commonstr.darkForest+'">&nbsp;</div>';
		return img;
	}
	if (tt==51) { // city or barbarian camp!?!
		if (!pid || pid==0) {
			if (lv>=11) {
				img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/Barbarian_Camp_lvl11.png\');background-size:30px 30px;" title="'+uW.g_js_strings.commonstr.barbariancamp+'">&nbsp;</div>';
				return img;
			}
			else {
				if (lv>=7) {lv=7}
				else if (lv>=4) {lv=4}
				else {lv=1};
				img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/barbarian_lvl'+lv+'.png\');background-size:30px 30px;" title="'+uW.g_js_strings.commonstr.barbariancamp+'">&nbsp;</div>';
				return img;
			}
		}
		else {
			if (lv>=11) {lv=11}
			else if (lv>=10) {lv=10}
			else if (lv>=7) {lv=7}
			else if (lv>=5) {lv=5}
			else if (lv>=3) {lv=3}
			else {lv=1};
			var title = uW.g_js_strings.commonstr.city;
			img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'buildings/castle_lvl'+lv+'_26.png\');background-size:30px 30px;" title="'+title+'">&nbsp;</div>';
			if (fac) {
				title = getFactionName(fac) + ' ('+uW.g_js_strings.commonstr.level+' '+faclvl+')';
				switch (fac) {
					case 1:	{ // druid
						var BackPos = '';
						if (lv>=7) { BackPos = '-188px 0px;'; }
						else if (lv>=4) { BackPos = '-93px 0px;'; }
						img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'map_castle01.png\');'+BackPos+'background-size:90px 30px;" title="'+title+'">&nbsp;</div>';
						break;
					}
					case 2:	{ // fey
						var BackPos = '01';
						if (lv>=7) { BackPos = '03'; }
						else if (lv>=4) { BackPos = '02'; }
						img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'fey%20cityMap'+BackPos+'.png\');background-size:30px 30px;" title="'+title+'">&nbsp;</div>';
						break;
					}
					case 3:	{ // briton
						var BackPos = '01';
						if (lv>=7) { BackPos = '03'; }
						else if (lv>=4) { BackPos = '02'; }
						img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'briton_cityMap'+BackPos+'.png\');background-size:30px 30px;" title="'+title+'">&nbsp;</div>';
						break;
					}
					default : { // ???? assume new faction, put fey image out until we know any better.
						var BackPos = '01';
						if (lv>=7) { BackPos = '03'; }
						else if (lv>=4) { BackPos = '02'; }
						img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\''+IMGURL+'fey%20cityMap'+BackPos+'.png\');background-size:30px 30px;" title="'+title+'">&nbsp;</div>';
						break;
					}
				}
			}
			return img;
		}
	}
}

function TroopImage(tt,style,suffix) {
	if (style==null) style = "width:20px;height:20px;vertical-align:middle;";
	if (suffix==null) suffix = "&nbsp;";
	if (tt < 51) { var TroopText = uW.unitcost['unt'+tt][0];}
	else { var TroopText = uW.fortcost['frt'+tt][0];}
	var img = '<img style="'+style+'" src="'+TroopImagePrefix+tt+TroopImageSuffix+'" title="'+TroopText+'">'+suffix;
	return img;
}

function TroopImageBig(tt) { return TroopImage(tt,"vertical-align:middle;"); }
function TroopImageBigHeader(tt) { return TroopImage(tt,"",""); }

function ResourceImage(path,title) {
	var img = '<img style="width:20px;height:20px;vertical-align:middle;" src="'+path+'" title="'+title+'">&nbsp;';
	return img;
}

function capitalize(value) {
	newValue = "";
	var pattern = " ";
	value = value.split(pattern);
	for(var i = 0; i < value.length; i++) {
		newValue += value[i].substring(0,1).toUpperCase() +
		value[i].substring(1,value[i].length);
		if (i < value.length-1) {newValue += " ";}
	}
	return newValue;
}

function BlankifZero(val) {
	if (val == 0) {return "";} else {return val;}
}

function createToolTip (title,elem,TempStatEffects,TempStatTiers) {
	var TempcText = "";
	if (!elem) return;
	if (title != "") { TempcText += "<b>"+title+"</b><br>&nbsp;<br>"; }

	var SortOrder = [];
	if (Options.AlternateSortOrder) { for (var z in AlternateSortOrder) SortOrder.push(AlternateSortOrder[z]); }
	else { for (var z in TempStatEffects) SortOrder.push(z); }

	for (var z in SortOrder) {
		var k = SortOrder[z];
		var HisContent = "";
		var effectName = getThroneEffectName(k,TempStatTiers[k]);
		if (TempStatEffects[k] && (TempStatEffects[k] != 0) && uW.cm.thronestats["effects"][k]) HisContent = (Math.round(TempStatEffects[k]*100)/100) + '% ' + effectName;
		if (HisContent != "") { TempcText += HisContent + "<br>"; }
	}

	jQuery('#'+elem.id).children("span").remove();
	jQuery('#'+elem.id).append('<span class="trtip">'+TempcText+'</span>');
}

function UseDove (iid) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/doveOut.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				var boostTime = 43200;
				Seed.player.truceExpireUnixTime = uW.unixtime() + boostTime;
				Seed.player.warStatus = 3;
				CM.InventoryView.removeItemFromInventory(iid);
				uW.update_boosts()
			} else {
				uW.Modal.showAlert(uW.printLocalError(rslt.error_code, rslt.msg, rslt.feedback))
			}
		},
	},true); // noretry
}

function FormatDiplomacy (aid) {
	if (Seed.allianceDiplomacies == null)
		return ' ('+uW.g_js_strings.commonstr.neutral+')';
	if (Seed.allianceDiplomacies.friendly && Seed.allianceDiplomacies.friendly['a'+aid] != null)
		return ' <span style="color:#080;">('+uW.g_js_strings.commonstr.friendly+')</span>';
	if (Seed.allianceDiplomacies.hostile && Seed.allianceDiplomacies.hostile['a'+aid] != null)
		return ' <span style="color:#800;">('+uW.g_js_strings.commonstr.hostile+')</span>'
	if (aid == Seed.allianceDiplomacies.allianceId)
		return ' <span style="color:#088;">('+uW.g_js_strings.commonstr.yours+')</span>';
	return ' ('+uW.g_js_strings.commonstr.neutral+')';
};

function getDiplomacy (aid) {
	if (Seed.allianceDiplomacies == null)
		return uW.g_js_strings.commonstr.neutral;
	if (Seed.allianceDiplomacies.friendly && Seed.allianceDiplomacies.friendly['a'+aid] != null)
		return uW.g_js_strings.commonstr.friendly;
	if (Seed.allianceDiplomacies.hostile && Seed.allianceDiplomacies.hostile['a'+aid] != null)
		return uW.g_js_strings.commonstr.hostile;
	if (aid == Seed.allianceDiplomacies.allianceId)
		return uW.g_js_strings.commonstr.yours;
	return uW.g_js_strings.commonstr.neutral;
};

function DiplomacyColours (aid) {
	if (Seed.allianceDiplomacies == null)
		return "";
	if (Seed.allianceDiplomacies.friendly && Seed.allianceDiplomacies.friendly['a'+aid] != null)
		return "color:#080;";
	if (Seed.allianceDiplomacies.hostile && Seed.allianceDiplomacies.hostile['a'+aid] != null)
		return "color:#800;font-weight:bold;";
	if (aid == Seed.allianceDiplomacies.allianceId)
		return "color:#088;";
	return "";
};

function fetchPlayerCourt (uid, notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.pid = uid;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/viewCourt.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) { notify(rslt); },
		onFailure: function () { notify({errorMsg: 'AJAX error'});},
	});
}

function getWallInfo(cityId, objOut) {
	objOut.wallSpaceUsed = 0;
	objOut.fieldSpaceUsed = 0;
	objOut.wallSpaceQueued = 0;
	objOut.fieldSpaceQueued = 0;
	objOut.wallLevel = 0;
	objOut.wallSpace = 0;
	objOut.fieldSpace = 0;
	objOut.slotsBusy = 0;
	var b = Seed.buildings["city" + cityId];
	if (!b || b.pos1 == null) return;
	objOut.wallLevel = parseInt(b.pos1[1]);
	var spots = 0;
	for (var i = 1; i < (objOut.wallLevel + 1); i++) { spots += (i * 1500); }
	if (objOut.wallLevel==13) spots += 3500;
	if (objOut.wallLevel==14) spots += 7000;
	if (objOut.wallLevel==15) spots += 10500;
	if (uW.seed.cityData.city[cityId].isPrestigeCity) {
		if (uW.seed.cityData.city[cityId].prestigeInfo.blessings.indexOf(307) != -1) spots = parseInt(spots * 1.15);
	}
	objOut.wallSpace = spots;
	objOut.fieldSpace = spots;
	var fort = Seed.fortifications["city" + cityId];
	for (var k in fort) {
		var id = parseInt(k.substr(4));
		if (id<60 || id==63) { objOut.wallSpaceUsed += parseInt(uW.fortstats["unt" + id][5]) * parseInt(fort[k]); }
		else { objOut.fieldSpaceUsed += parseInt(uW.fortstats["unt" + id][5]) * parseInt(fort[k]); }
	}
	var q = Seed.queue_fort["city" + cityId];
	objOut.slotsBusy = q.length;
	if (q!=null && q.length > 0 ){
		for (var i=0; i<q.length; i++){
			if (q[i][0]<60 || q[i][0]==63) { objOut.wallSpaceQueued += parseInt(uW.fortstats["unt"+ q[i][0]][5]) * parseInt(q[i][1]); }
			else { objOut.fieldSpaceQueued += parseInt(uW.fortstats["unt"+ q[i][0]][5]) * parseInt(q[i][1]); }
		}
	}
}

function getResourceProduction(cityId) {
	var ret = [0, 0, 0, 0, 0];
	var now = unixTime();
	var search = 'type==10 || type==11';
	var wilds = [0, 0, 0, 0, 0];
	var w = Seed.wilderness["city"+cityId];
	for (var k in w) {
		var type = parseInt(w[k].tileType);
		if (type == 10 || type == 11)
			wilds[1] += parseInt(w[k].tileLevel);
		else
			wilds[type / 10] += parseInt(w[k].tileLevel);
	}
	knight = 0;
	var s = Seed.knights["city" + cityId];
	if (s) {
		s = s["knt"+Seed.leaders["city"+cityId].resourcefulnessKnightId];
		if (s) {
			var knight = parseInt(s.resourcefulness);
			if (s.resourcefulnessBoostExpireUnixtime > now)
				knight *= 1.25;
		}
	}
	var workerFactor = 1;
	var c = parseInt(Seed.citystats["city"+cityId]["pop"][0]); // Current population
	var w = parseInt(Seed.citystats["city"+cityId]["pop"][3]); // Labor force
	if (w > c)
		workerFactor = c / w;
	for (var i = 1; i < 5; i++) {
		var items = 0;
		if (parseInt(Seed.playerEffects["r" + i + "BstExp"]) > now) {
			items = 0.25;
		}
		var tech = Seed.tech["tch"+i];
		ret[i] = parseInt((Seed.resources["city" + cityId]["rec" + i][2] * (1 + tech / 10 + knight / 100 + items + 0.05 * wilds[i]) * workerFactor + 100));
	}
	return ret;
}

function equippedthronestats(stat_id) {
	var current_slot = Seed.throne.activeSlot;
	var total = 0;
	for (var k = 0; k < Seed.throne.slotEquip[current_slot].length; k++) {
		var item_id = Seed.throne.slotEquip[current_slot][k];
		for (var O in uW.kocThroneItems[item_id]["effects"]) {
			var i = +(O.split("slot")[1]);
			var id = uW.kocThroneItems[item_id]["effects"]["slot" + i]["id"];
			if (id == stat_id) {
				var Current = getTRSlotStat(uW.kocThroneItems[item_id],id,i);
				if (i <= parseInt(uW.kocThroneItems[item_id]["quality"])) {
					total += parseIntNan(Current);
				}
			}
		}
	}
	return total;
}

function GenerateTRPresetStats(slot) {
	var StatEffects = [];
	for (var k in uW.cm.thronestats.tiers) StatEffects[k] = 0;
	for (var k in uW.kocThroneItems){
		for (var ii=0;ii<Seed.throne.slotEquip[slot].length;ii++) {
			if (Seed.throne.slotEquip[slot][ii] == uW.kocThroneItems[k].id) {
				for (var O in uW.kocThroneItems[k]["effects"]) {
					var i = +(O.split("slot")[1]);
					var id = uW.kocThroneItems[k]["effects"]["slot"+i]["id"];
					Current = getTRSlotStat(uW.kocThroneItems[k],id,i);
					if (i<=parseInt(uW.kocThroneItems[k].quality)) {
						if (CompositeEffects.hasOwnProperty(id)) {
							var Composite = CompositeEffects[id]
							for (var e=0;e<Composite.length;e++) {
								StatEffects[Composite[e]] += Current;
							}
						}
						else {
							StatEffects[id] += Current;
						}
					}
				}
			}
		}
	}
	return StatEffects;
}

function GenerateTRPresetTiers(slot) {
	var Tiers = [];
	for (var k in uW.cm.thronestats.tiers) Tiers[k] = 0;
	for (var k in uW.kocThroneItems){
		for (var ii=0;ii<Seed.throne.slotEquip[slot].length;ii++) {
			if (Seed.throne.slotEquip[slot][ii] == uW.kocThroneItems[k].id) {
				for (var O in uW.kocThroneItems[k]["effects"]) {
					var i = +(O.split("slot")[1]);
					var id = uW.kocThroneItems[k]["effects"]["slot"+i]["id"];
					var tier = uW.kocThroneItems[k]["effects"]["slot"+i]["tier"];
					Tiers[id] = tier;
				}
			}
		}
	}
	return Tiers;
}

function getTRSlotStat (y,id,i) {
	var Current = 0;
	var	tier = parseInt(y["effects"]["slot"+i]["tier"]);
	var	level = y["level"];
	var	p = uW.cm.thronestats.tiers[id][tier];
	while (!p && (tier > 0)) { tier--; p = uW.cm.thronestats.tiers[id][tier]; }
	if (p) { // can't find stats for tier
		var base = +p.base;
		var growth = +p.growth;
		if (y["effects"]["slot"+i].fromJewel && (level > uW.cm.thronestats.jewelGrowthLimit[y["effects"]["slot"+i].quality])) {
			level = uW.cm.thronestats.jewelGrowthLimit[y["effects"]["slot"+i].quality]
		}
		Current = Number(base + ((level * level + level) * growth * 0.5));
	}
	return Current;
}

function getCHSlotStat (N,level) {
	var percent = 0;
	tier = parseInt(N.tier);
	var p = ChampionStatTiers[N.id][tier];
	while (!p && (tier > 0)) { tier--; p = ChampionStatTiers[N.id][tier]; }
	if (p) { // can't find stats for tier
		var base = +p.base || 0;
		var growth = +p.growth || 0;
		percent = Number(base + ((level * level + level) * growth * 0.5));
		if (N.id>=300) {
			percent = Number(base + (level * growth));
			if (N.id<400) percent = percent*100;
		}
		var wholeNumber = false;
		if (Math.round(parseFloat(percent)) == parseFloat(percent)) wholeNumber = true;
		percent = (percent > 0) ? percent : +percent;
		if (wholeNumber)
			percent = parseFloat(percent).toFixed(0);
		else
			percent = parseFloat(percent).toFixed(2);
	}
	return percent;
}

function getChampCappedValue(eff,val) {
	var effkey = eff+",1"; // tier 1
	var capmax = CE_EFFECT_TIERS[effkey]["Max"];
	var capmin = CE_EFFECT_TIERS[effkey]["Min"];
//	if (!(capmax == 0 && capmin == 0)) {
//		return Math.max(Math.min(capmax, val), capmin);
//	}
	return val;
}

function getTrainTime (n, p, cid) {
	if (p < 1) { return 0; }
	var Buildings = getCityBuildings(cid);
	var faux = 0;
	var uc = uW.unitcost["unt"+n];
	if (matTypeof(uc[8]) == 'object'){
		for (var k in uc[8]){
			var b = Buildings[k.substr(1)];
			if (b.maxLevel < uc[8][k][1]){
				faux = 1;
				break;
			}
		}
	}
	if (matTypeof(uc[9]) == 'object'){
		for (var k in uc[9]){
			if (parseInt(Seed.tech['tch'+k.substr(1)]) < uc[9][k][1]){
				faux = 1;
				break;
			}
		}
	}

	if (faux) return 0;

	var h = +(uW.unitcost["unt" + n][7]) * p,
	c,
	f = {},
	g = Seed.buildings["city" + cid],
	b = {},
	e = Seed.knights["city" + cid],
	l,
	q = Seed.leaders["city" + cid];
	f.barracks = 0;
	f.workshop = 0;
	f.stable = 0;
	f.tech = 0;
	f.knight = 0;
	f.ultimate = 0;
	var prestigeType = Seed.cityData.city[cid].prestigeInfo.prestigeType;
	jQuery.each(g, function (v, u) {
		u.id = +(u[0]);
		u.level = +(u[1]);
		var rare = (CM.BarracksUnitsTypeMap.isUnitType(parseInt(n), "rare"));
		var pt = ((parseInt(n) == 13 && prestigeType==1) || (parseInt(n) == 14 && prestigeType==2) || (parseInt(n) == 15 && prestigeType==3));
		var t = (parseInt(n) == 13 || parseInt(n) == 14 || parseInt(n) == 15);
		u.isPrestige = (parseInt(u[2]) >= 100 && parseInt(u[2]) <= 105);
		if ((u.id === 13 || u.id === 22 || u.id === 24 || u.id === 26) && u.level > 0) {
			if ((t && pt && u.isPrestige && !rare) || (!t && !u.isPrestige && !rare)) {
				f.barracks += (u.level + 9)
			}
		}
		if (u.id === 16 && u.level > 0) {
			if ( +(n) >= 9 && +(n) < 13) {
				f.workshop = u.level
			}
		}
		if (u.id === 17 && u.level > f.stable) {
			if ( +(n) >= 7 && +(n) < 13) {
				f.stable = u.level
			}
		}
	});
	c = f.barracks / 10;
	h = Math.max(1, Math.ceil(h / c));
	c = 1;
	if (e) {
		l = e["knt" + q.combatKnightId];
		if (l) {
			f.knight = ( + (l.combatBoostExpireUnixtime) - uW.unixtime() > 0) ? (l.combat * 1.25) : l.combat
		} else {
			f.knight = 0
		}
	}
	if (Seed.tech) {
		f.tech = Seed.tech.tch5
	}
	f.ultimate = f.workshop + f.stable + f.tech;
	c = c * (1 + (0.1 * f.ultimate) + (0.005 * f.knight));
	var d = CM.ThroneController.getBoundedEffect(77);
	c = c * (1 + (d / 100));
	if (CM.WorldSettings.isOn("GUARDIAN_MARCH_EFFECT")) {
		var j = getStoneTrainingSpeedBonus(cid);
		c = c * (1 + j)
	}
	h = Math.max(1, Math.ceil(h / c));
	if (CM.PrestigeModel.isPrestige(cid)) {
		var a = CM.PrestigeModel.getPrestigeLevel(cid);
		if (a > 0) {
			var m = CM.WorldSettings.getSetting("ASCENSION_BARRACKS_BOOST"),
			k = JSON.parse(m),
			o = k.values[a - 1][1],
			i = parseFloat(o);
			h = Math.ceil(h * i)
		}
	}

	var u = CM.BlessingSystemModel.isBlessingActive(CM.BlessingSystemModel.getBlessing().DEATH_FROM_AFAR, cid);
	var r = CM.BlessingSystemModel.isBlessingActive(CM.BlessingSystemModel.getBlessing().DARK_INQUIRY, cid);
	var j = CM.BlessingSystemModel.isBlessingActive(CM.BlessingSystemModel.getBlessing().STRENGTH_OF_THE_PACK, cid);
	var l = CM.BlessingSystemModel.isBlessingActive(CM.BlessingSystemModel.getBlessing().REINFORCED_PLATING, cid);
	if (n == 6 && u) {
		h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().DEATH_FROM_AFAR, cid, uWCloneInto({}))))
	}
	if (n == 14 && r) {
		h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().DARK_INQUIRY, cid, uWCloneInto({}))))
	}
	if (n == 13 && j) {
		h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().STRENGTH_OF_THE_PACK, cid, uWCloneInto({}))))
	}
	if (n == 15 && l) {
		h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().REINFORCED_PLATING, cid, uWCloneInto({}))))
	}

	h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().EXPEDITED_SENTENCING, cid, uWCloneInto({
					traintime : true,
					unitid : n
				}))));
	h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().TO_THE_FRONT_LINES, cid, uWCloneInto({
					unitid : n
				}))));
	h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().PRIORITIZED_CONSTRUCTION, cid, uWCloneInto({
					unittype : n
				}))));
	if (CM.VipModel.isActive()) {
		var s = CM.VipModel.getBoostValue("benefitTraining");
		h = Math.ceil(h - (h * (s / 100)))
	}
	return h
}

function getStoneTrainingSpeedBonus (cityId) {
	var c = { 0 : 0, 1 : 5, 2 : 5, 3 : 10, 4 : 10, 5 : 15, 6 : 15, 7 : 20, 8 : 25, 9 : 35, 10 : 70, 11 : 130, 12 : 250 };
	var idx = Cities.byID[cityId].idx;
	var stonelevel = (Seed.guardian[idx].cityGuardianLevels["stone"]?Seed.guardian[idx].cityGuardianLevels["stone"]:0);
	var x = c[stonelevel] / 100;
	var v = (Seed.guardian[idx].guardianCount==4);
	var A = Seed.guardian[idx].type == "stone";
	var z = 0;
	var w = (CM.ThroneController.getBoundedEffect(106) / 100);
	var r = 1+(CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().EMPOWERED_STONE, cityId)/10);
	var y = 0;
	if (A && v) {
		z = 1.5;
		y = w;
	}
	if (A && !v) {
		z = 1;
		y = w;
	}
	if (!A && v) {
		z = 0.5;
		r = 1;
	}
	if (!A && !v) {
		z = 1;
		r = 1;
	}
	var u = (x * r * z) + y;
	return u
}

function getCityTroops(unitId,cityId,countmarching) {
	var NumTroops = 0;
	NumTroops = parseIntNan(Seed.units['city' + cityId]['unt' + unitId]);
	if (SelectiveDefending) { NumTroops += parseIntNan(Seed.defunits['city' + cityId]['unt' + unitId]); }

	if (countmarching) {
		var marching = getMarchInfo(cityId);
		NumTroops += marching.marchUnits[unitId];
	}
	return NumTroops;
}

function getMarchInfo (cityId) {
	var ret = {};

	ret.marchUnits = {};
	ret.returnUnits = {};
	ret.resources = [];
	for (var ui in CM.UNIT_TYPES){
		var i = CM.UNIT_TYPES[ui];
		ret.marchUnits[i] = 0;
		ret.returnUnits[i] = 0;
	}
	for (var i=0; i<5; i++){
		ret.resources[i] = 0;
	}

	for (var k in Seed.queue_atkp["city"+cityId]){ // each march
		march = Seed.queue_atkp["city"+cityId][k];
		if (typeof (march) == 'object'){
			if (march.marchType == 5) continue; // don't count troops currently being reassigned!!!
			if (march.marchType == 9 && (march.marchStatus == 3 || march.marchStatus == 4 || march.marchStatus == 10)) continue; // don't count troops in stopped or resting raids..

			for (var ui in CM.UNIT_TYPES){
				var i = CM.UNIT_TYPES[ui];
				ret.marchUnits[i] += parseIntNan (march['unit'+i+'Count']);
				ret.returnUnits[i] += parseIntNan (march['unit'+i+'Return']);
			}
			for (var ii=1; ii<5; ii++){
				ret.resources[ii] += parseInt (march['resource'+ ii]);
			}
			ret.resources[0] += parseInt (march['gold']);
		}
	}
	return ret;
}

function DeleteLastMessage() {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.requestType = 'GET_MESSAGE_HEADERS_FOR_USER_INBOX';
	params.boxType = 'outbox';
	params.pageNo = 1;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				if (rslt.mostRecentMessageId) {
					var params2 = uW.Object.clone(uW.g_ajaxparams);
					params2.requestType = 'ACTION_ON_MESSAGES';
					params2.boxType = 'outbox';
					params2.selectedAction = 'delete';
					params2.selectedMessageIds = rslt.mostRecentMessageId;
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params2,
						onSuccess: function (rslt2) {},
					},true);
				}
			}
		},
	},true);
};

function DrawLevelIcons() {
	var mapwindow=ById('mapwindow');
	if(!mapwindow) return;
	var mapinfo=ById('mapinfodone');
	if(mapinfo) {return;};

	var ss=document.evaluate(".//a[contains(@class,'slot')]",mapwindow,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	var mapinfodone=false;
	for(var s=0; s<ss.snapshotLength; s++) {
		var a=ss.snapshotItem(s);
		var onclick=a.getAttribute('id');
		var owner='';
		if(onclick) {
			var tileinfo = uW.g_mapObject.model.getTileActions(onclick)["tileClick"];
			if(tileinfo) {
				if (!TileOriginChecked) {
					var TileOffset = tileinfo.tileid-CalculateTileId(tileinfo.xcoord,tileinfo.ycoord);
					if (TileOffset != 0){
						TileOrigin = TileOrigin + TileOffset;
					}
					TileOriginChecked = true;
				}

				var might = parseInt(tileinfo.might);
				var alliance = parseIntNan(tileinfo.allianceId);
				var dip = getDiplomacy(alliance);
				owner = tileinfo.username;
			}
		}
		var sp=a.getElementsByTagName('span');
		if(sp.length==0) continue;

		if (!mapinfodone) { sp[0].id='mapinfodone'; mapinfodone=true; }
		spancol='#cc0';

		if (alliance == 'null' && tileinfo.type=="city") spancol='#33CCFF';
		if (dip == 'hostile' && tileinfo.type=="city") spancol='#FF0000';
		if (tileinfo.type!="city" && tileinfo.tileuserid!="null") spancol='#FF9900';
		if (tileinfo.type!="city" && tileinfo.tileuserid=="null") spancol='#CC0033';

		if (Options.MapShowExtra && !CoordBox.MapZoom) {
			if (tileinfo.username!="null")
				sp[0].outerHTML = sp[0].outerHTML +'<div style="color:'+spancol+';font-size:11px;text-shadow: 2px 2px 2px #000;" align="left">&nbsp;&nbsp;'+owner+'</div><div style="color:'+spancol+';font-size:10px;text-shadow: 2px 2px 2px #000;" align="left">&nbsp;&nbsp;Might:'+addCommas(might)+'</div>';
		}
		if (Options.MapShowLevel && (parseIntNan(tileinfo.level) != 0)) {
			sp[0].outerHTML = sp[0].outerHTML+'<div style="color:'+spancol+';text-shadow: 2px 2px 2px #000;" align="left">&nbsp;&nbsp;'+tileinfo.level+'&nbsp;&nbsp;</div>';
		}
	}
}

function CardMight (throne_item,champ) {
	if (champ) {
		if (!throne_item.quality) throne_item.quality = throne_item.rarity;
		var F = CE_MIGHT_RARITY_MAP || {};
		var H = CE_MIGHT_LEVEL_MAP || {};
		var G = F[throne_item.quality] && F[throne_item.quality].might ? +F[throne_item.quality].might : 0;
		var E = H[throne_item.level] && H[throne_item.level].might ? +H[throne_item.level].might : 0;
		return Math.round((G+E));
	}
	else {
		var JewelBonus = 1;
		if (throne_item.jewel && throne_item.jewel.valid) {
			switch (throne_item.jewel.quality) {
				case 1: JewelBonus = 1.05; break;
				case 2: JewelBonus = 1.1; break;
				case 3: JewelBonus = 1.15; break;
				case 4: JewelBonus = 1.25; break;
				case 5: JewelBonus = 1.33; break;
				default: break;
			}
		}
		var J = uW.cm.thronestats.mightByLevel || {};
		var ah = uW.cm.thronestats.mightByQuality || {};
		var aj = ah[throne_item.quality].Might || 0;
		return Math.round((aj + J[throne_item.level].Might) * JewelBonus);
	}
}

function CardQuality (quality,unique) {
	var retval;
	var unique = unique||0;
	if (unique > 0) { retval = uW.g_js_strings.throneRoom.unique; }
	else { retval = strQuality (quality); }
	return retval;
};

function strQuality (b) {
	var a;
	switch (b) {
		case 0: a = uW.g_js_strings.throneRoom.simple; break;
		case 1:	a = uW.g_js_strings.throneRoom.common; break;
		case 2:	a = uW.g_js_strings.throneRoom.uncommon; break;
		case 3: a = uW.g_js_strings.throneRoom.rare; break;
		case 4:	a = uW.g_js_strings.throneRoom.epic; break;
		case 5:	a = uW.g_js_strings.throneRoom.wondrous; break;
		case 6: a = uW.g_js_strings.throneRoom.miraculous; break;
		default: a = uW.g_js_strings.throneRoom.simple; break;
	}
	return a
};

function SwitchChampion (cityId,champId,notify) {
	var cindex = -1;
	var oldcity = 0;
	for (var y in Seed.champion.champions) {
		chkchamp = Seed.champion.champions[y];
		if (chkchamp.assignedCity && !Cities.byID[chkchamp.assignedCity]) { chkchamp.assignedCity = 0; }
		if (chkchamp.championId) {
			if (chkchamp.championId == champId) {
				cindex = y;
				oldcity = chkchamp.assignedCity;
				break;
			}
		}
	}
	if (cindex<0) return;
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.champid = champId;
	params.cid0 = oldcity;
	params.cid = cityId;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/assignChampion.php" + uW.g_ajaxsuffix, {
		method : "post",
		parameters : params,
		onSuccess : function (rslt) {
			if (rslt.ok) {
				if (cityId!=0) {
					for (var c = 0; c < Seed.champion.champions.length; c++) {
						if (Seed.champion.champions[c].assignedCity == cityId) {
							Seed.champion.champions[c].assignedCity = 0;
						}
					}
				}
				Seed.champion.champions[cindex].assignedCity = cityId;
				SetChampionIcon();
			}
			if (notify) { notify(rslt); }
		},
		onFailure : function () { if (notify) { notify({ok:false}); }}
	},true); // noretry
};

function SwitchGuardian (cityId,type,notify) {
	var cIndex = Cities.byID[cityId].idx;
	if (type == Seed.guardian[cIndex].type) { return; }

	var level = Seed.guardian[cIndex].cityGuardianLevels[type];
	level = level ? level : 0;
	if (level == 0) { return; }

	var params = uW.Object.clone(uW.g_ajaxparams);
	params.ctrl = "Guardian";
	params.action = "summon";
	params.cityId = cityId;
	params.type = type;

	new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				var g = CM.guardianModalModel.gObj();
				g.summonGuardian = uWCloneInto({
					summonFinishTime: parseInt(rslt.summonFinishTime),
					level: rslt.summonGuardian.cl0,
					type: rslt.summonGuardian.type,
					upgrading: false
				});
				uW.seed.guardian[cIndex].type = type;
				uW.seed.guardian[cIndex].level = rslt.summonGuardian.cl0;
				var GType = 0;
				switch(type) {
					case "wood":	GType=50;break;
					case "ore":		GType=51;break;
					case "food":	GType=52;break;
					case "stone":	GType=53;break;
				}
				uW.seed.buildings["city"+ cityId].pos500[0] = GType;
				var time = parseInt(rslt.summonFinishTime) - unixTime();
				setTimeout(function(){
					uW.seed.buildings["city"+ cityId].pos500[0] = GType;
					uW.seed.guardian[cIndex].type = type;
					uW.seed.guardian[cIndex].level = rslt.summonGuardian.cl0;
				},(time*1000));
				guardianFailures = 0;
				if (notify) notify(cityId,type,true,rslt.summonFinishTime);
			}
			else { // retry?
				guardianFailures++;
				actionLog(Cities.byID[cityId].name+": Guardian change failed. Error code: " + rslt.error_code,'GENERAL');
				// try again in 2 seconds
				if (guardianFailures <=3) {
					setTimeout( function () {SwitchGuardian (cityId,type,notify)}, 2000);
				}
				else {
					guardianFailures = 0;
					if (notify) notify(cityId,type,false);
				}
			}
		},
		onFailure: function () {
			actionLog(Cities.byID[cityId].name+": Guardian change server error",'GENERAL');
			guardianFailures = 0;
			if (notify) notify(cityId,type,false);
		}
	},true) // noretry
};

function SwitchThroneRoom (preset,dash) {
	var NewPreset = preset;
	if (NewPreset == Seed.throne.activeSlot) { return; }

	clearTimeout(presetTimer);

	var params = uW.Object.clone(uW.g_ajaxparams);
	params.ctrl = 'throneRoom\\ThroneRoomServiceAjax';
	params.action = 'setPreset';
	params.presetId = NewPreset;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch53.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		loading: true,
		onSuccess: function (rslt) {
			if(rslt.ok){
				// changed the way this works because lots of people having trouble...

				if (ById('throneStatList')) {
					button = '#throneInventoryPreset' + NewPreset;
					CM.ThroneView.clickActivePreset(button);
					if (Tabs.Throne) { Tabs.Throne.paintTags(); Tabs.Throne.ModifyEvents(); }
				}
				else {
					Seed.throne.activeSlot = NewPreset;
					var L = Seed.throne.slotEquip[NewPreset];
					jQuery.each(uW.kocThroneItems, function (M, N) {
						G = jQuery.inArray(N.id, L) > -1;
						if (G) { N.isEquipped = true; }
						else { N.isEquipped = false; }
					});
					CM.ThroneView.renderThrone();
					CM.ThroneView.renderStats();
					CM.ThroneView.renderInventory(uW.kocThroneItems);
				}
				presetFailures = 0;
				if (dash) {
					// need to delay 5 seconds before allowing again
					Dashboard.ThroneDelay = 5;
					Dashboard.PaintTRPresets();
				}
			}
			else { // retry?
				presetFailures++;
				actionLog("Preset change failed. Error code: " + rslt.error_code,'GENERAL');
				// try again in 2 seconds
				if (presetFailures <=3) {
					if (dash) {
						Dashboard.ThroneDelay = 0;
						Dashboard.PaintTRPresets();
						Dashboard.setThroneMessage('<span style="color:#f80">'+tx('Failed to change Throne Room - Retrying')+' ('+presetFailures+') ...</span>');
					}
					presetTimer = setTimeout( function () {SwitchThroneRoom (preset,dash)}, 2000);
				}
				else {
					presetFailures = 0;
					if (dash) {
						Dashboard.setThroneMessage('<span style="color:#f00">'+tx('Could not change Throne Room')+'.</span>');
					}
				}
			}
		},
		onFailure: function () {
			actionLog("Preset change server error",'GENERAL');
			presetFailures = 0;
			if (dash) {
				Dashboard.ThroneDelay = 0;
				Dashboard.PaintTRPresets();
				Dashboard.setThroneMessage('<span style="color:#f00">'+tx('Server connection failed')+'.</span>');
			}
		},
	},true); // noretry
};

function ArcanaEnabled () {
	return (Seed.allianceHQ && Seed.allianceHQ.arcana && Seed.allianceHQ.buildings[3] && Seed.allianceHQ.buildings[3].buildingLevel && Seed.allianceHQ.buildings[3].buildingLevel!=0);
}

/** Raid Manager **/

function ToggleCityRaids (cityId,RaidAction,notify) {

	if (!RaidManager.CityHasRaids(cityId)) {
		if (notify) notify({'ok':true});
		return;
	}

	var params = uW.Object.clone(uW.g_ajaxparams);
	params.pf = 0;
	params.ctrl = 'BotManager';
	params.action = RaidAction; // stopAll or resumeAll
	params.settings = {cityId : cityId};

	new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		loading: true,
		onSuccess: function(rslt){
			if (rslt.ok) {
				if (RaidAction != 'getMarches') {
					ToggleCityRaids(cityId,'getMarches',notify); // retrieve new march statuses
					return;
				}
				else {
					setTimeout(uW.update_seed_ajax, 1000); // update_seed with the new march statuses (?)
				}
			}
			else {
				if (rslt.msg == "The system is busy, please try again later") {
					setTimeout (ToggleCityRaids, 2000, cityId, RaidAction, notify);
					return;
				}
				else {
					actionLog(Cities.byID[cityId].name+": "+rslt.msg,'RAIDS');
				}
			}
			if (notify) notify(rslt);
		},
		onFailure: function () {
			actionLog(Cities.byID[cityId].name+": Raid toggle server error",'RAIDS');
			if (notify) notify({'ok':false});
		},
	},true);
};

var RaidManager = {
	LookupTimer : null,
	stopping:false,
	resuming:false,
	deleting:false,
	stopprogress:0,
	stopcount:0,
	activecount:0,
	count:0,

	init : function () {
		var t = RaidManager;

		if (Options.RaidToggle) AddSubTabLink('Raids',Tabs.Options.toggleAutoRaidState, 'RaidsToggleTab');
		SetToggleButtonState('Raids',Options.RaidRunning,'Raids');

		if(Options.RaidButtons) {
			AddMainTabLink('RAIDS: Stop', 'pbraidtab', t.StopAllRaids);
			AddMainTabLink('Resume', 'pbraidtabRes', t.ResumeAllRaids);
			if (Options.RaidDeleteButton) AddMainTabLink('Delete', 'pbraidtabDel', t.DeleteAllRaids);
			ById('pbraidtabRes').style.marginLeft = '0px';
			if (Options.RaidDeleteButton) ById('pbraidtabDel').style.marginLeft = '0px';
			ById('pbraidtab').title = tx('Click to Stop Active Raids');
			ById('pbraidtabRes').title = tx('Click to Resume Stopped Raids');
			if (Options.RaidDeleteButton) ById('pbraidtabDel').title = tx('Click to Delete Stopped Raids');
		}

		t.LookupTimer = setTimeout(t.LookupRaids,2500);
	},

	CityHasRaids : function (cityId) {
		var t = RaidManager;
		var city_atkp = Seed.queue_atkp['city'+cityId]
		for (var e in city_atkp){
			MarchType = city_atkp[e]['marchType'];
			if (MarchType == 9) return true;
		}
		return false;
	},

	LookupRaids : function () {
		var t = RaidManager;
		clearTimeout(t.LookupTimer);

		t.activecount=0;
		t.stopcount=0;
		for (c=0; c< Seed.cities.length;c++) {
			var cityId = Seed.cities[c][0];
			var city_atkp = Seed.queue_atkp['city'+cityId]
			for (b in city_atkp){
				destinationUnixTime = city_atkp[b]['destinationUnixTime'];
				MarchStatus = city_atkp[b]['marchStatus'];
				MarchType = city_atkp[b]['marchType'];
				botMarchStatus = city_atkp[b]['botMarchStatus'];
				if (MarchType == 9 && (MarchStatus == 3 || MarchStatus==10)) t.stopcount++;
				else if (MarchType == 9) t.activecount++;
			}
		}

		if (!Options.RaidButtons) return;
		if (t.resuming == false && t.stopping == false && t.deleting == false && t.activecount != 0)
			ById('pbraidtab').innerHTML = '<span style="color: #ff6">RAIDS: Stop ('+ t.activecount + ')</span>'
		else if (t.resuming == false && t.stopping == false && t.deleting == false)
			ById('pbraidtab').innerHTML = '<span style="color: #CCC">RAIDS: Stop ('+ t.activecount + ')</span>'
		if (t.resuming == false && t.resuming == false && t.deleting == false && t.stopcount !=0)
			ById('pbraidtabRes').innerHTML = '<span style="color: #ff6">Resume ('+ t.stopcount + ')</span>'
		else if (t.resuming == false && t.stopping == false && t.deleting == false)
			ById('pbraidtabRes').innerHTML = '<span style="color: #CCC">Resume ('+ t.stopcount + ')</span>'
		if (Options.RaidDeleteButton) {
			if (t.resuming == false && t.stopping == false && t.deleting == false && t.stopcount !=0)
				ById('pbraidtabDel').innerHTML = '<span style="color: #ff6">Delete ('+ t.stopcount + ')</span>'
			else if (t.resuming == false && t.stopping == false && t.deleting == false)
				ById('pbraidtabDel').innerHTML = '<span style="color: #CCC">Delete ('+ t.stopcount + ')</span>'
		}

		t.LookupTimer = setTimeout(t.LookupRaids,2500);
	},

	StopAllRaids : function (){
		var t = RaidManager;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.activecount == 0) return;
		t.stopping = true;
		var now = unixTime();
		Options.RaidLastReset = now;
		saveOptions();
		for (i=0;i<Seed.cities.length;i++){
			setTimeout(t.DoAllStop, (i*1500),i);
		}
	},

	ResumeAllRaids : function (){
		var t = RaidManager;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.stopcount == 0) return;
		t.resuming = true;
		var now = unixTime();
		Options.RaidLastReset = now;
		saveOptions();
		for (i=0;i<Seed.cities.length;i++){
			setTimeout(t.DoAllResume, (i*1500),i);
		}
	},

	DeleteAllRaids : function (){
		var t = RaidManager;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.stopcount == 0) return;
		t.deleting = true;
		var now = unixTime();
		Options.RaidLastReset = now;
		saveOptions();
		count=0;
		t.count = t.stopcount;
		for (var d=0; d< Seed.cities.length;d++) {
			var cityId = Seed.cities[d][0];
			var city_atkp = Seed.queue_atkp['city'+cityId]
			for (var e in city_atkp){
				destinationUnixTime = city_atkp[e]['destinationUnixTime'];
				MarchId = city_atkp[e]['marchId'];
				MarchStatus = city_atkp[e]['marchStatus'];
				MarchType = city_atkp[e]['marchType'];
				botMarchStatus = city_atkp[e]['botMarchStatus'];
				if (MarchType == 9 && botMarchStatus == 3 && MarchStatus == 10) {
					count++;
					setTimeout(t.DoAllDelete, (count*1250), MarchId,d,count);
				}
			}
		}
	},

	DoAllStop: function(i) {
		var t = RaidManager;
		ToggleCityRaids(Seed.cities[i][0],'stopAll',function (rslt) {
			if (rslt.ok) { actionLog(Seed.cities[i][1]+': Stopping Raids','RAIDS'); }
			t.stopprogress = t.stopprogress + (100/Seed.cities.length);
			t.updatebotbutton('Stopping: '+ t.stopprogress.toFixed(0) + '%', 'pbraidtab');
			if (t.stopprogress.toFixed(0) == 100) {
				t.stopprogress = 0;
				setTimeout(function(){t.updatebotbutton('RAIDS: Stop ('+ t.activecount + ')', 'pbraidtab');t.stopping = false;}, 5000);
			}
		});
	},

	DoAllResume: function(i) {
		var t = RaidManager;
		ToggleCityRaids(Seed.cities[i][0],'resumeAll',function (rslt) {
			if (rslt.ok) { actionLog(Seed.cities[i][1]+': Resuming Raids','RAIDS');}
			t.stopprogress = t.stopprogress + (100/Seed.cities.length);
			t.updatebotbutton('Resuming: '+ t.stopprogress.toFixed(0) + '%', 'pbraidtab');
			if (t.stopprogress.toFixed(0) == 100) {
				t.stopprogress = 0;
				setTimeout(function(){t.updatebotbutton('RAIDS: Stop ('+ t.activecount + ')', 'pbraidtab');t.resuming = false;}, 5000);
			}
		});
	},

	DoAllDelete : function (marchId,city,count){
		var t = RaidManager;
		var cityId = Seed.cities[city][0];
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'deleteMarch';
		params.marchId = marchId;
		params.settings = {};
		params.settings = {cityId : cityId};

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt) {
					for (u in Seed.queue_atkp['city' + cityId]){
						if (Seed.queue_atkp['city' + cityId][u]['marchId'] == marchId){
							delete Seed.queue_atkp['city' + cityId][u];
							if (Object.keys(Seed.queue_atkp['city' + cityId]).length == 0) {
								Seed.queue_atkp['city' + cityId] = uWCloneInto([]);
							}
							break;
						}
					}

					uW.cityinfo_army();
					setTimeout(uW.update_seed_ajax, 250);
				}
			},
		});

		t.stopprogress = count * (100/t.count);
		actionLog(Seed.cities[city][1]+': Deleting Raids','RAIDS');
		t.updatebotbutton('Deleting: '+ t.stopprogress.toFixed(0) + '%', 'pbraidtab');
		if (t.stopprogress.toFixed(0) == 100) {
			t.stopprogress = 0;
			setTimeout(function(){t.updatebotbutton('RAIDS: Stop ('+ t.activecount + ')', 'pbraidtab');t.deleting = false;}, (5000));
		}
	},

	updatebotbutton : function (text, id) {
		var but=document.getElementById(id);
		if (but) {
			but.innerHTML = '<span style="color: #ff6">'+text+'</span>';
		}
	},
}

/** Dashboard Control **/

var Dashboard = {
	order : [],
	DashWidth : 480,
	GeneralInterval : 1,
	DefaultDashboard : {"Overview":{Display:true, Sequence:0},"Boost":{Display:true, Sequence:3},"Arcana":{Display:true, Sequence:5},"Sacrifices":{Display:true, Sequence:10},"Troops":{Display:true, Sequence:20},"Reinforcements":{Display:true, Sequence:30},"Fortifications":{Display:true, Sequence:40},"Outgoing Attacks":{Display:true, Sequence:50},"Incoming Attacks":{Display:true, Sequence:60}},
	OverviewShow : true,
	SacrificeShow : true,
	ReinforceShow : true,
	TroopShow : true,
	FortificationShow : true,
	AttackShow : true,
	CityAttackShow : true,
	ArcanaShow : true,
	BoostShow : true,
	Curr : -1,
	Castles : null,
	ResizeFrame : false,
	serverwait : false,
	ExpandMarshall : false,
	ExpandChampion : false,
	ExpandDefPreset : false,
	CurrentCityId : 0,
	StillComing : false,
	CityStillComing : false,
	CityIncoming : false,
	CityOutgoing : false,
	SacSettings : null,
	SacSpeed : null,
	SacSpeedBuff : null,
	DarkRitual : null,
	ChannelledSuffering : null,
	TotalTroops : null,
	TotalSanctuaryTroops : null,
	QuickSacString : "",
	DefOptionsString : "",
	NextPresetNumber : 0,
	InitPresetNumber : 0,
	marchchamp : null,
	citychamp : null,
	oldchamp : null,
	allownewsacs : false,
	Reins : [],
	WallDefences : [],
	FieldDefences : [],
	StoreArray : {},
	ThroneDelay : 0,
	GuardDelay : 0,
	ForceTries : 0,
	AttackedCity : null,
	CurrGuardian : null,
	Loaded : false,
	Buildings : {},
	BoostItemList : [261, 262, 280, 271, 272, 281],
	BoostItemList2 : [282, 283, 295, 296],
	BoostItemList3 : [297,298],
	tBoostItemList : [290, 291, 292, 301, 287, 288, 289, 300],
	TroopBoostSpeedList : [49001,49002,49003,49004,49005,49006,49007,49008,49009],
	TroopBoostAccuracyList : [49501,49502,49503,49504,49505,49506,49507,49508],
	Options : {
		OverviewState			: true,
		SacrificeState			: false,
		ReinforceState			: false,
		FortificationState		: false,
		AttackState				: false,
		CityAttackState			: false,
		ArcanaState				: false,
		BoostState				: false,
		DefaultSacrifice		: true,
		DefaultSacrificeMin		: 1,
		DefaultSacrificeSec		: 0,
		QuickSacrifice			: true,
		SacrificeLimit			: 1000000,
		DefaultDefenceNum		: 200000,
		DefAddTroopShow			: true,
		DefPresetShow			: true,
		DefPresets				: {},
		UpperDefendButton		: false,
		LowerDefendButton		: true,
		TRPresets				: {},
		TRPresetsSelected		: {},
		TRPresetsCycle			: false,
		TRPresetsCycleMins		: 1,
		TRPresetsLastChecked	: 0,
		TRPresetChange			: true,
		TRPresetByName			: false,
		OverrideDashboard		: {},
		CurrentCity				: -1,
		RefreshSeed				: false,
		ReplaceDefendingTroops	: {0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false},
		GraphicalChampDisplay	: true,
		ExpandSanctuary			: true,
		SetDefendersFirst		: false,
		DashWidth				: 540,
	},

	OptionsInit : function () {
		var t = Dashboard;
		if (!Options.DashboardOptions) {
			Options.DashboardOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.DashboardOptions.hasOwnProperty(y)) {
					Options.DashboardOptions[y] = t.Options[y];
				}
			}
		}
	},

	init : function () {
		var t = Dashboard;

		HTMLRegister['DASH'] = {};

		t.order = [];
		for (var p in t.DefaultDashboard) {
			var NewObj = {};
			if (Options.DashboardOptions.OverrideDashboard[p]) {
				NewObj.Display = Options.DashboardOptions.OverrideDashboard[p].Display;
				NewObj.Sequence = Options.DashboardOptions.OverrideDashboard[p].Sequence;
			}
			else {
				NewObj.Display = t.DefaultDashboard[p].Display;
				NewObj.Sequence = t.DefaultDashboard[p].Sequence;
			}
			NewObj["name"] = p;
			t.order.push(NewObj);
		}
		t.order.sort(function(a, b){ return a.Sequence-b.Sequence });

		t.DashWidth = Options.DashboardOptions.DashWidth;

		m = '<div><table width="100%"><tr><td class=xtab align="right"><b>'+uW.g_js_strings.commonstr.city+' : </b></td><td class=xtab><span id=btCastlesContainer></span></td><td class=xtab align="right"><span id="btCityAlert">&nbsp;</span></td></tr>';
		m += '<tr><td class=xtab colspan="2"><span style="display:inline-block;" id=btItems>&nbsp;</span>&nbsp;<span style="display:inline-block;height:21px;vertical-align:bottom;" id=btDashAlarmOff>&nbsp;</span></td><td class=xtab align="right"><a id=btRefreshSeed class="inlineButton btButton blue14"><span>'+tx('Refresh')+'</span></a>&nbsp;<span id=btAutoSpan class="divHide"><a id=btAutoRefresh class="inlineButton btButton blue14"><span style="width:30px;display:inline-block;text-align:center;">'+tx('Auto')+'</span></a></span></td></tr></table></div>';

		for (var p in t.order) {
			if (t.order[p].name == 'Overview') {
				m += '<div id=btStatusHeader><a id=btStatusLink class=divLink ><div class="divHeader" align="right">'+tx('OVERVIEW')+'&nbsp;<img id=btStatusArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btStatus align=center class="divHide"><TABLE width="100%"><tr><td class=xtab align="center" id=btStatusCell style="padding-right:0px;"></td></tr>';
				m += '</table></div></div>';
				t.OverviewShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Boost') {
				m += '<div id=btBoostHeader><a id=btBoostLink class=divLink ><div class="divHeader" align="right">'+tx('TROOP BOOSTS')+'&nbsp;<img id=btBoostArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btBoost align=center class="divHide"><TABLE width="100%"><td width=50% class="xtabHD"><b>'+uW.g_js_strings.modal_attack.speedboosts+'</b></td><td width=50% class="xtabHD"><b>'+tx('Accuracy Boosts')+'</b></td></tr>';
				m += '<tr><td class=xtab align=center valign=top><TABLE width="100%"><tr><td class=xtab id=btBoostSpeedCell></td></tr><tr><td class=xtab><div id=btNewBoostSpeedCell align="left"></div></td></tr></td></tr></table></td>';
				m += '<td class=xtab align=center valign=top><TABLE width="100%"><tr><td class=xtab id=btBoostAccuracyCell></td></tr><tr><td class=xtab><div id=btNewBoostAccuracyCell align="left"></div></td></tr></table></td></tr>';
				m += '<tr><td colspan=2 class="xtab"><div class="ErrText" align="center" id=btBoostErr>&nbsp;</div></td></tr></table></div></div>';
				t.BoostShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Arcana') {
				m += '<div id=btArcanaHeader><a id=btArcanaLink class=divLink ><div class="divHeader" align="right">'+tx('ARCANA')+'&nbsp;<img id=btArcanaArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btArcana align=center class="divHide"><TABLE width="100%"><td width=50% class="xtabHD"><b>'+uW.g_js_strings.arcane.allianceText+'&nbsp;(<span id=btalliarcananum></span>/<span id=btalliarcanamax></span>)</b></td><td width=50% class="xtabHD"><b>'+uW.g_js_strings.arcane.personalText+'&nbsp;(<span id=btpersarcananum></span>/<span id=btpersarcanamax></span>)</b></td></tr>';
				m += '<tr><td class=xtab align=center valign=top><TABLE width="100%"><tr><td class=xtab id=btAlliArcanaCell></td></tr><tr><td class=xtab><div id=btNewAlliArcanaCell align="left"></div></td></tr></td></tr></table></td>';
				m += '<td class=xtab align=center valign=top><TABLE width="100%"><tr><td class=xtab id=btPersArcanaCell></td></tr><tr><td class=xtab><div id=btNewPersArcanaCell align="left"></div></td></tr></table></td></tr>';
				m += '<tr><td colspan=2 class="xtab"><div class="ErrText" align="center" id=btArcanaErr>&nbsp;</div></td></tr></table></div></div>';
				t.ArcanaShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Sacrifices') {
				m += '<div id=btSacrificeHeader><a id=btSacrificeLink class=divLink ><div class="divHeader" align="right">'+tx('SACRIFICES')+'&nbsp;<img id=btSacrificeArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btSacrifice align=center class="divHide"><TABLE width="98%"><tr><td class=xtab align=center id=btSacrificeCell></td></tr><tr><td class=xtab align=center>';
				m += '<div id=btNewSacrificeCell align="center" class="divHide">&nbsp;</div></td></tr>';
				m += '</table></div></div>';
				t.SacrificeShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Troops') {
				m += '<div id=btTroopHeader><a id=btTroopLink class=divLink ><div class="divHeader" align="right">'+tx('TROOPS')+'&nbsp;<img id=btTroopArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btTroop align=center class=divHide><TABLE width="100%">';
				if (Options.DashboardOptions.SetDefendersFirst) {
					m += '<tr><td class=xtab align=center style="padding-right:0px;"><div id=btTroopAddCell align="center">&nbsp;</div></td></tr>';
					m += '<tr><td class=xtabBR align=center id=btTroopCell></td></tr>';
				}
				else {
					m += '<tr><td class=xtabBR align=center id=btTroopCell></td></tr>';
					m += '<tr><td class=xtab align=center style="padding-right:0px;"><div id=btTroopAddCell align="center">&nbsp;</div></td></tr>';
				}
				m += '</table></div></div>';
				t.TroopShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Reinforcements') {
				m += '<div id=btReinforceHeader><a id=btReinforceLink class=divLink ><div class="divHeader" align="right">'+tx('REINFORCEMENTS')+'&nbsp;<img id=btReinforceArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btReinforce align=center class=divHide><TABLE width="98%"><tr><td class=xtabBR align=center id=btReinforceCell></td></tr>';
				m += '</table></div></div>';
				t.ReinforceShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Fortifications') {
				m += '<div id=btWallDefenceHeader><a id=btWallDefenceLink class=divLink ><div class="divHeader" align="right">'+tx('FORTIFICATIONS')+'&nbsp;<img id=btWallDefenceArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btWallDefence align=center class=divHide><TABLE width="100%"><tr><td id=btWallDefenceCell class=xtabBR align=center style="padding-right:0px;"></td></tr>';
				m += '</table></div></div>';
				t.FortificationShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Outgoing Attacks') {
				m += '<div id=btCityAttackHeader><a id=btCityAttackLink class=divLink ><div class="divHeader" align="right">'+tx('OUTGOING ATTACKS')+'&nbsp;<img id=btCityAttackArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btCityAttack align=center class=divHide><TABLE width="98%"><tr><td class=xtabBR align=center id=btCityAttackCell></td></tr>';
				m += '</table></div></div>';
				t.CityAttackShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Incoming Attacks') {
				m += '<div id=btAttackHeader><a id=btAttackLink class=divLink ><div class="divHeader" align="right">'+tx('INCOMING ATTACKS')+'&nbsp;<img id=btAttackArrow height="10" src="'+RightArrow+'"></div></a>';
				m += '<div id=btAttack align=center class=divHide><TABLE width="98%"><tr><td class=xtabBR align=center id=btAttackCell></td></tr>';
				m += '</table></div></div><br>';
				t.AttackShow = t.order[p].Display;
			}
		}

		popDash = new CPopup('btDash', Options.btDashPos.x, Options.btDashPos.y, t.DashWidth, 100, Options.btFloatingDashboard, Dashboard.close);

		if (!Options.btFloatingDashboard) {
			popDash.BASE_ZINDEX = 40; // below widemap
			elem = ById('btDash_outer');
			elem.style.left = '0px';
			elem.style.top = '0px';
			ById('btDashboard').appendChild(elem);
		}

		popDash.getMainDiv().innerHTML = m;
		popDash.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;'+tx('PowerBot+ Dashboard')+'</B></DIV>';

		if (t.Curr < 0) { t.Curr = Cities.byID[uW.currentcityid].idx; }

		t.Castles = new CdispCityPicker ('btCastles', ById('btCastlesContainer'), true, null, t.Curr,null,'castleButBack');

		for (var i=0; i<Cities.numCities; i++) {
			ById('btCastles_'+i).addEventListener('mouseover',function (){CityResourceHint(this,this.id.substring(10));},false);
			ById('btCastles_'+i).addEventListener('mouseout',function (){CityResourceHintOff(this);},false);
		}

		ById('btCastlesContainer').addEventListener ('click', function(){t.SetCurrentCity (t.Castles.city.id);} , false);
		ById('btStatusLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btStatus");Options.DashboardOptions.OverviewState = !(Options.DashboardOptions.OverviewState);saveOptions();}, false);
		ById('btBoostLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btBoost");Options.DashboardOptions.BoostState = !(Options.DashboardOptions.BoostState);saveOptions();}, false);
		ById('btArcanaLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btArcana");Options.DashboardOptions.ArcanaState = !(Options.DashboardOptions.ArcanaState);saveOptions();}, false);
		ById('btSacrificeLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btSacrifice");Options.DashboardOptions.SacrificeState = !(Options.DashboardOptions.SacrificeState);saveOptions();}, false);
		ById('btTroopLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btTroop");Options.DashboardOptions.TroopState = !(Options.DashboardOptions.TroopState);saveOptions();}, false);
		ById('btWallDefenceLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btWallDefence");Options.DashboardOptions.FortificationState = !(Options.DashboardOptions.FortificationState);saveOptions();}, false);
		ById('btReinforceLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btReinforce");Options.DashboardOptions.ReinforceState = !(Options.DashboardOptions.ReinforceState);saveOptions();}, false);
		ById('btAttackLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btAttack");Options.DashboardOptions.AttackState = !(Options.DashboardOptions.AttackState);saveOptions();}, false);
		ById('btCityAttackLink').addEventListener ('click', function () {ToggleDivDisplay("btDash",100,t.DashWidth,"btCityAttack");Options.DashboardOptions.CityAttackState = !(Options.DashboardOptions.CityAttackState);saveOptions();}, false);

		if (Options.DashboardOptions.OverviewState) ToggleDivDisplay("btDash",100,t.DashWidth,"btStatus");
		if (Options.DashboardOptions.BoostState) ToggleDivDisplay("btDash",100,t.DashWidth,"btBoost");
		if (Options.DashboardOptions.ArcanaState) ToggleDivDisplay("btDash",100,t.DashWidth,"btArcana");
		if (Options.DashboardOptions.SacrificeState) ToggleDivDisplay("btDash",100,t.DashWidth,"btSacrifice");
		if (Options.DashboardOptions.TroopState) ToggleDivDisplay("btDash",100,t.DashWidth,"btTroop");
		if (Options.DashboardOptions.ReinforceState) ToggleDivDisplay("btDash",100,t.DashWidth,"btReinforce");
		if (Options.DashboardOptions.FortificationState) ToggleDivDisplay("btDash",100,t.DashWidth,"btWallDefence");
		if (Options.DashboardOptions.AttackState) ToggleDivDisplay("btDash",100,t.DashWidth,"btAttack");
		if (Options.DashboardOptions.CityAttackState) ToggleDivDisplay("btDash",100,t.DashWidth,"btCityAttack");

		ById('btRefreshSeed').addEventListener ('click', function() {setTimeout(function() { t.SetCurrentCity (t.Castles.city.id); RefreshSeed();},250);}, false);
		ById('btAutoRefresh').addEventListener ('click', function() {t.ToggleAutoRefresh();}, false);
		if (Options.DashboardOptions.RefreshSeed) {
			jQuery('#btRefreshSeed').addClass("disabled");
			jQuery('#btAutoRefresh').addClass("red14");
			jQuery('#btAutoRefresh').removeClass("blue14");
			ById('btAutoRefresh').innerHTML = '<span style="width:30px;display:inline-block;text-align:center;">Off</span>';
		}
		if (trusted) jQuery('#btAutoSpan').removeClass("divHide");

		t.SetCurrentCity(Seed.cities[t.Curr][0],true);

		popDash.show(true);
		ResetFrameSize('btDash',100,t.DashWidth);
		saveOptions();

		t.Loaded = true; // allow everysecond to update
	},

	show : function (city) {
		var t = Dashboard;
		if (!popDash) {
			t.init();
		}
		else {
			t.Castles.selectBut(city.idx);
		}
	},

	close : function () {
		Options.DashboardOptions.CurrentCity = -1;
		Dashboard.Curr = Options.DashboardOptions.CurrentCity;
		if (Options.btFloatingDashboard) {
			Options.btDashPos = popDash.getLocation();
		}
		else {
			document.body.appendChild(popDash.div);
		}
		popDash.destroy();
		popDash = null;
		Options.btDashboard = false;
		WideScreen.setDashboard(false);
		saveOptions();
		saveGlobalOptions();
	},

	SetCurrentCity : function (cityId,leaveModal) {
		var t = Dashboard;

		t.serverwait = false;
		t.ExpandMarshall = false;
		t.ExpandChampion = false;

		t.CurrentCityId = cityId;
		t.Curr = Cities.byID[cityId].idx;
		Options.DashboardOptions.CurrentCity = t.Curr;
		saveOptions();

		if (!leaveModal) {
			uW.Modal.hideModal(); // don't hide modal on init.
			if (jQuery('#ahqbutton').hasClass('sel')) { uW.changeview_city(); }
		}

		if (uW.currentcityid != cityId) {
			if (!SelectCity(t.Curr+1)) { setTimeout(t.SetCurrentCity,1000,cityId,leaveModal); return false; }
		}

		t.Buildings = getCityBuildings(cityId);

		// refresh arcana info

		if (ArcanaEnabled()) {
			t.MaxAllianceArcana = Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].maxActiveAlliance;
			t.MaxPersonalArcana = Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].maxActivePersonal;

			var ArcanaTypes = {0:'-- '+tx('Select Arcana')+' --'};
			for (var l=1;l<=parseIntNan(Seed.allianceHQ.buildings[3].buildingLevel);l++) {
				for (var ll in Seed.arcaneRequirements[l]) {
					if (Seed.arcaneRequirements[l][ll].isAvailable) {
						ArcanaTypes[ll] = uW.itemlist["i"+ll].name;
					}
				}
			}
			var SelWidth = 150;
			if (t.DashWidth==480) SelWidth = 125;
			if (t.DashWidth==600) SelWidth = 175;
			m = '<div id=btAlliArcanaDiv>'+htmlSelector(ArcanaTypes,0,'id=btAlliArcanaSel class=btInput style="width:'+SelWidth+'px;" onChange="btAlliArcanaSelChange();"')+'&nbsp;<span style="display:inline-block;position:relative;">'+strButton8(tx('Day'),'id=btAlliArcanaSetDay')+'</span>&nbsp;<span style="display:inline-block;position:relative;">'+strButton8(tx('Week'),'id=btAlliArcanaSetWeek')+'</span><br><table class=xtab width=100% style="padding-right:0px;"><tr><td style="padding-right:0px;"><div style="height:30px;padding:2px;font-size:10px;opacity:0.8;" class="wrap xtabBorder" id=btAlliArcanaDesc></div></td></tr></table></div>';
			ById('btNewAlliArcanaCell').innerHTML = m;
			m = '<div id=btPersArcanaDiv>'+htmlSelector(ArcanaTypes,0,'id=btPersArcanaSel class=btInput style="width:'+SelWidth+'px;" onChange="btPersArcanaSelChange();"')+'&nbsp;<span style="display:inline-block;position:relative;">'+strButton8(tx('Day'),'id=btPersArcanaSetDay')+'</span>&nbsp;<span style="display:inline-block;position:relative;">'+strButton8(tx('Week'),'id=btPersArcanaSetWeek')+'</span><br><table class=xtab width=100% style="padding-right: 0px;"><tr><td style="padding-right:0px;"><div style="height:30px;padding:2px;font-size:10px;opacity:0.8;" class="wrap xtabBorder" id=btPersArcanaDesc></div></td></tr></table></div>';
			ById('btNewPersArcanaCell').innerHTML = m;

			ById('btAlliArcanaSetDay').addEventListener ('click', function(){
				var Arc = parseIntNan(ById('btAlliArcanaSel').value);
				if (Arc!=0) { t.ActivateArcana(Arc,'a','24h'); }
			}, false);
			ById('btAlliArcanaSetWeek').addEventListener ('click', function(){
				var Arc = parseIntNan(ById('btAlliArcanaSel').value);
				if (Arc!=0) { t.ActivateArcana(Arc,'a','7d'); }
			}, false);
			ById('btPersArcanaSetDay').addEventListener ('click', function(){
				var Arc = parseIntNan(ById('btPersArcanaSel').value);
				if (Arc!=0) { t.ActivateArcana(Arc,'p','24h'); }
			}, false);
			ById('btPersArcanaSetWeek').addEventListener ('click', function(){
				var Arc = parseIntNan(ById('btPersArcanaSel').value);
				if (Arc!=0) { t.ActivateArcana(Arc,'p','7d'); }
			}, false);

			ById('btAlliArcanaSetDay').addEventListener('mouseover',function (){t.ArcanaHint(this,'a','24h');},false);
			ById('btAlliArcanaSetDay').addEventListener('mouseout',function (){t.ArcanaHintOff(this);},false);
			ById('btAlliArcanaSetWeek').addEventListener('mouseover',function (){t.ArcanaHint(this,'a','7d');},false);
			ById('btAlliArcanaSetWeek').addEventListener('mouseout',function (){t.ArcanaHintOff(this);},false);
			ById('btPersArcanaSetDay').addEventListener('mouseover',function (){t.ArcanaHint(this,'p','24h');},false);
			ById('btPersArcanaSetDay').addEventListener('mouseout',function (){t.ArcanaHintOff(this);},false);
			ById('btPersArcanaSetWeek').addEventListener('mouseover',function (){t.ArcanaHint(this,'p','7d');},false);
			ById('btPersArcanaSetWeek').addEventListener('mouseout',function (){t.ArcanaHintOff(this);},false);
		}

		// refresh boost info

		var BoostSpeedTypes = {0:'-- '+tx('Select Boost')+' --'};
		for (var a=0;a<t.TroopBoostSpeedList.length;a++) {
			buff = t.TroopBoostSpeedList[a]
			BoostSpeedTypes[buff] = uW.itemlist["i"+buff].name+' ('+(Seed.items['i'+buff]?Seed.items['i'+buff]:0)+')';
		}
		var BoostAccuracyTypes = {0:'-- '+tx('Select Boost')+' --'};
		for (var a=0;a<t.TroopBoostAccuracyList.length;a++) {
			buff = t.TroopBoostAccuracyList[a]
			BoostAccuracyTypes[buff] = uW.itemlist["i"+buff].name+' ('+(Seed.items['i'+buff]?Seed.items['i'+buff]:0)+')';
		}
		var SelWidth = 175;
		if (t.DashWidth==480) SelWidth = 150;
		if (t.DashWidth==600) SelWidth = 200;
		m = '<div id=btBoostSpeedDiv>'+htmlSelector(BoostSpeedTypes,0,'id=btBoostSpeedSel class=btInput style="width:'+SelWidth+'px;" onChange="btBoostSpeedSelChange();"')+'&nbsp;<span style="display:inline-block;position:relative;">'+strButton8(tx('Activate'),'id=btBoostSpeedSet')+'</span><br><table class=xtab width=100% style="padding-right:0px;"><tr><td style="padding-right:0px;"><div style="height:30px;padding:2px;font-size:10px;opacity:0.8;" class="wrap xtabBorder" id=btBoostSpeedDesc></div></td></tr></table></div>';
		ById('btNewBoostSpeedCell').innerHTML = m;
		m = '<div id=btBoostAccuracyDiv>'+htmlSelector(BoostAccuracyTypes,0,'id=btBoostAccuracySel class=btInput style="width:'+SelWidth+'px;" onChange="btBoostAccuracySelChange();"')+'&nbsp;<span style="display:inline-block;position:relative;">'+strButton8(tx('Activate'),'id=btBoostAccuracySet')+'</span><br><table class=xtab width=100% style="padding-right:0px;"><tr><td style="padding-right:0px;"><div style="height:30px;padding:2px;font-size:10px;opacity:0.8;" class="wrap xtabBorder" id=btBoostAccuracyDesc></div></td></tr></table></div>';
		ById('btNewBoostAccuracyCell').innerHTML = m;

		ById('btBoostSpeedSet').addEventListener ('click', function(){
			var buff = parseIntNan(ById('btBoostSpeedSel').value);
			if (buff!=0) { t.ActivateTroopBoost(buff,'spd'); }
		}, false);

		ById('btBoostAccuracySet').addEventListener ('click', function(){
			var buff = parseIntNan(ById('btBoostAccuracySel').value);
			if (buff!=0) { t.ActivateTroopBoost(buff,'acc'); }
		}, false);

		// refresh sacrifice info

		var b = t.Buildings[25];
		if (b.count > 0) {
			t.SacSettings = (b.count <= 1) ? CM.WorldSettings.getSettingAsObject("ASCENSION_SACRIFICE_ONE_ALTER_BUFF") : CM.WorldSettings.getSettingAsObject("ASCENSION_SACRIFICE_TWO_ALTER_BUFF");
			t.SacSettings = t.SacSettings[b.maxLevel];

			t.DarkRitual = CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().DARK_RITUAL);
			t.SacSpeedBuff = CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().CHANNELED_SUFFERING);
			t.ChannelledSuffering = (t.SacSpeedBuff != 1);

			t.SacAllowed = t.DarkRitual ? 2 : 1;
			t.SacSpeed = CM.WorldSettings.getSettingAsNumber("ASCENSION_SACRIFICE_TROOPS_PER_SEC");

			var l = b.maxLevel;
			var o = [];
			var	i = CM.WorldSettings.getSettingAsObject("ASCENSION_SACRIFICE_ALTAR_LEVEL_UNLOCKS");
			for (var x=1;x<=l;x++) {
				oo = i[x].troops.split(",");
				for (var y in oo) {
					o.push(oo[y]); // contains array of troop types this city is allowed to sacrifice :)
				}
			}

			m = '<TABLE cellSpacing=0 width=100% height=0%>';
			m += '<tr><TD width="120" class=xtabBR><span class=xtab>';
			m += '<SELECT class="btSelector" id="btRitualTroops" onchange="btSelectTroopType(this);"><option value="0">-- '+uW.g_js_strings.openCastle.trooptype+' --</option>';
			t.QuickSacString = "";
			for (var y in uW.unitcost) {
				var TroopAllowed = (o.indexOf(y.substr(3)) >= 0);
				var DefendingTroops = 0;
				if (SelectiveDefending) { DefendingTroops = parseIntNan(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+y.substr(3)]); }
				var tot = parseIntNan(Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+y.substr(3)])+DefendingTroops;
				if ((tot > 0) && TroopAllowed) {
					var TTStyle = 'width:20px;height:20px;vertical-align:middle;';
					if (DefendingTroops != 0) { m +='<option style="font-weight:bold;" value="'+y.substr(3)+'">'+uW.unitcost[y][0]+'</option>'; TTStyle+="border:1px solid red;"; }
					else { m +='<option value="'+y.substr(3)+'">'+uW.unitcost[y][0]+'</option>'; TTStyle+="border:1px solid transparent;"; }
					t.QuickSacString = t.QuickSacString + '<a class="TextLink" onclick="btQuickSacrifice('+y.substr(3)+');">'+TroopImage(y.substr(3),TTStyle)+'</a> ';
				}
			}
			m +='</select></span></td>';
			m +='<td class=xtab><INPUT class="btInput" id="btRitualAmount" type=text size=7 maxlength=7 value="" onkeyup="btSetRitualLength(this)"><span id="btTotalTroops"></span></td><td align=right class=xtab><span id="btMaxTroops"></span></td>';
			m +='<td width="80" class=xtab><INPUT class="btInput" style="width: 30px;text-align:right;" id="btRitualMinutes" type=text maxlength=4 value="" onkeyup="btSetRitualLength(this)">&nbsp;m&nbsp;';
			m +='<INPUT class="btInput" style="width: 15px;text-align:right;" id="btRitualSeconds" type=text maxlength=2 value="" onkeyup="btSetRitualLength(this)">&nbsp;s&nbsp;</td>';
			m +='<td width="90" align=right class=xtab><a id="btStartRitualButton" class="inlineButton btButton blue14" onclick="btStartRitual()"><span style="width:65px;display:inline-block;text-align:center;" align="center">'+uW.g_js_strings.sacrifice_popup.starttraining+'</span></a></td></tr>';
			m += '<tr><td class=xtab colspan="5"><div class="ErrText" align="center" id=btSacErr>&nbsp;</div></td></tr>';
			m += '</table>';
			ById('btNewSacrificeCell').innerHTML = m;
		}

		// refresh troop add defenders cell

		if (SelectiveDefending) {
			t.DefOptionsString = "";
			m = '<TABLE cellSpacing=0 width=100% height=0%><tr><TD colspan=3 class=xtabHD>'+tx('Assign Defenders')+'</td><TD width="100" align=right class=xtabHD><a id="btSelectDefendButton" class="inlineButton btButton blue14" onclick="cm.CastleController.openSelectDefendingTroops();"><span style="width:85px;display:inline-block;text-align:center;" align="center">'+uW.g_js_strings.openCastle.selecttroops+'</span></a></td></tr>';
			m +='<tr id=btDefAddTroopRow><TD width="120" class=xtabBR><span class=xtab>';
			m +='<SELECT class="btSelector" id="btDefendTroops" onchange="btSelectDefTroopType(this);"><option value="0">-- '+uW.g_js_strings.openCastle.trooptype+' --</option>';
			for (var y in uW.unitcost) {
				var tot = parseIntNan(Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+y.substr(3)]);
				if ((tot > 0)) {
					m +='<option value="'+y.substr(3)+'">'+uW.unitcost[y][0]+'</option>';
					t.DefOptionsString = t.DefOptionsString + y.substr(3);
				}
			}
			m +='</select></span></td>';
			m +='<td width="200" class=xtab><INPUT class="btInput" id="btDefendAmount" type=text size=13 maxlength=11 value=""><span id="btTotalDefTroops"></span></td>';
			m +='<td align=right class=xtab><span id="btMaxDefTroops"></span></td>';
			m +='<td width="100" align=right class=xtab><a id="btAddDefendButton" class="inlineButton btButton blue14" onclick="btAddDefenders()"><span style="width:85px;display:inline-block;text-align:center;" align="center">'+tx('Add')+'</span></a></td></tr>';
			m +='<tr id=btDefPresetRow><TD colspan=4 class=xtab style="padding-right:0px;"><TABLE cellSpacing=0 width=100% height=0%><tr><td class=xtab>';
			m +='<SELECT class="btSelector" style="width:190px;" id="btDefendPreset" onchange="btSelectDefPreset(this);"><option value="0">-- '+tx('Select Preset')+' --</option>';
			for (var y in Options.DashboardOptions.DefPresets) {
				m +='<option value="'+y+'">'+Options.DashboardOptions.DefPresets[y][0]+'</option>';
			}
			t.NextPresetNumber = parseIntNan(y) + 1;

			m +='</select></td>';
			m +='<td align=left class=xtab width=200><a id="btNewDefPreset" class="inlineButton btButton brown8" onclick="btNewDefPreset()"><span>'+tx('New')+'</span></a>&nbsp;<a id="btChgDefPreset" class="inlineButton btButton brown8 disabled" onclick="btChgDefPreset()"><span>'+tx('Chg')+'</span></a></td>';
			m +='<td align=right class=xtab style="padding-right:0px;"><a id="btAddPresetButton" class="inlineButton btButton blue14" onclick="btSetPresetDefenders(false)"><span style="width:15px;display:inline-block;text-align:center;" align="center">+</span></a>&nbsp;<a id="btReplacePresetButton" class="inlineButton btButton blue14" onclick="btSetPresetDefenders(true)"><span style="width:85px;display:inline-block;text-align:center;" align="center">'+tx('Replace')+'</span></a></td></tr></table>';
			if (t.ExpandDefPreset) m += '<div id=DefEditPresetRow >';
			else m += '<div id=DefEditPresetRow class=divHide >';
			m +='<TABLE cellSpacing=0 width=100% height=0%><tr><TD colspan=2 class=xtabHD style="font-size:2px;">&nbsp;</td></tr><tr><td class=xtab style="padding-top:5px;">'+tx('Preset Name')+':&nbsp;<INPUT class="btInput" id="btDefPresetName" size=20 style="width: 185px" type=text value=""/></td>';
			m +='<td align=right class=xtab style="padding-right:0px;"><a id="btSetCurrentPreset" class="inlineButton btButton brown8" onclick="btSetCurrentPreset()"><span>'+tx('Set Current')+'</span></a>&nbsp;<a id="btSaveDefPreset" class="inlineButton btButton brown8" onclick="btSaveDefPreset()"><span>'+tx('Save')+'</span></a></td></tr>';
			m +='<tr><td colspan=2 class=xtabBR style="padding-right:0px;padding-left:10px;">';
			for (var ui in CM.UNIT_TYPES){
				i = CM.UNIT_TYPES[ui];
				m += '<span class=xtab style="display:inline-block;padding-right:0px;"><table class=xtab cellpadding=0 cellspacing=0 style="padding-right:0px"><tr><td rowspan=2>'+TroopImageBig(i)+'</td><td style="font-size:10px;">'+uW.unitcost["unt"+i][0].substring(0,15)+'</td></tr><tr><td><INPUT class="btInput" id="btPresetTroop'+i+'" type=text size=13 maxlength=11 value=""></td></tr></table></span> ';
			}
			m +='</td></tr><tr><TD colspan=2 class=xtabHD align=right style="padding-right:0px;"><a id="btDelDefPreset" class="inlineButton btButton brown8 disabled" onclick="btDelDefPreset()"><span>'+uW.g_js_strings.commonstr.deletetx+'</span></a>&nbsp;<a id="btCancelDefPreset" class="inlineButton btButton brown8" onclick="btCancelDefPreset()"><span>'+uW.g_js_strings.commonstr.cancel+'</span></a></td></tr></table>';
			m +='</div></td></tr>';
			m += '<tr><td class=xtab colspan="4"><div style="opacity:0.6;" align="center" id=btTroopMsg>&nbsp;</div></td></tr></table>';

			ById('btTroopAddCell').innerHTML = m;

			if (t.InitPresetNumber != 0) {
				ById('btDefendPreset').value = t.InitPresetNumber;
				t.SelectDefPreset(ById('btDefendPreset'));
				t.InitPresetNumber = 0;
			}
		}
		else {
			jQuery('#btTroopAddCell').addClass("divHide");
		}
		t.PaintCityInfo(cityId);
	},

	PaintCityInfo : function (cityId) {
		var t = Dashboard;

		if (!popDash) return;

		t.Curr = Cities.byID[cityId].idx;
		var CityTag = '<div class="divHide">'+cityId+'</div>';

		// header items

		t.ResizeFrame = false;

		var Mists = Seed.items.i10021;
		var Doves = Seed.items.i901;
		var Refuges = Seed.items.i911;
		var Orders = Seed.items.i912;
		var now = unixTime();
		var TruceDuration = 0;
		if (Seed.player.truceExpireUnixTime != undefined)
			TruceDuration = Seed.player.truceExpireUnixTime - now;
		var CannotDove = ((TruceDuration > 0) && (Seed.player.warStatus != 1));

		var items = '<table style="padding-left:10px;" cellspacing=0 cellpadding=0><tr>';
		if (Mists) {
			items += '<td class=xtab><a onClick="cm.ItemController.usePotionOfMist(\'10021\')"><img height=24 class="btTop btFaint" src="'+MistImage+'" title="'+itemTitle(10021)+'"></a></td>';
		}
		else {
			items += '<td class=xtab><img height=24 class="btTop btFaint" src="'+MistImage+'" title="'+itemTitle(10021)+'"></td>';
		}
		if (Seed.playerEffects.fogExpire > now) {
			items += '<td style="width:80px;" class=xtab><span style="color:#080;"><b>'+uW.timestr(Seed.playerEffects.fogExpire-now)+'</b></span></td>';
		}
		if (Doves && !CannotDove) {
			items += '<td class=xtab><a onClick="btDoveOfPeace(\'901\')"><img height=24 class="btTop btFaint" src="'+DoveImage+'" title="'+itemTitle(901)+'"></a></td>';
		}
		else {
			items += '<td class=xtab><img height=24 class="btTop btFaint" src="'+DoveImage+'" title="'+itemTitle(901)+'"></td>';
		}
		if (TruceDuration > 0) {
			if (Seed.player.warStatus != 3) {
				items += '<td style="width:80px;" class=xtab><span style="color:#f00;"><b>'+tx('BROKEN!')+'</b></span></td>';
			}
			else {
				var ts = "color:#080";
				if (TruceDuration < 3600) {ts = "color:#f00"};
				items += '<td style="width:80px;" class=xtab><span style="'+ts+';"><b>'+uW.timestr(Seed.player.truceExpireUnixTime-now)+'</b></span></td>';
			}
		}
		if (Refuges) {
			items += '<td class=xtab><a onClick="cm.InventoryView.openPortalOfRefugeModal(\'911\')"><img height=24 class="btTop btFaint" src="'+RefugeImage+'" title="'+itemTitle(911)+'"></a></td>';
		}
		else {
			items += '<td class=xtab><img height=24 class="btTop btFaint" src="'+RefugeImage+'" title="'+itemTitle(911)+'"></td>';
		}
		if (Orders) {
			items += '<td class=xtab><a onClick="cm.InventoryView.openPortalOfOrderModal(\'912\')"><img height=24 class="btTop btFaint" src="'+OrderImage+'" title="'+itemTitle(912)+'"></a></td>';
		}
		else {
			items += '<td class=xtab><img height=24 class="btTop btFaint" src="'+OrderImage+'" title="'+itemTitle(912)+'"></td>';
		}

		items += '</tr></table>'
		if (CheckForHTMLChange('DASH','btItems',items)) {
			t.ResizeFrame = true;
		}

		// overview

		t.Buildings = getCityBuildings(cityId); // refresh buildings info each loop
		var Status = '';

		var ascended = getAscensionValues(t.CurrentCityId);
		var cityExpTime = ascended.prestigeBuffExpire;
		var prestigeexp = '';
		if ((!isNaN(cityExpTime)) && (cityExpTime +(3600*24) >= unixTime())) {
			if (cityExpTime < unixTime()) {	prestigeexp = '<span style="color:#f00"><b>&nbsp;'+tx('Expired!')+'</b></span>'; }
			else { prestigeexp = '<span style="color:#080"><b>&nbsp;'+uW.timestr(cityExpTime-unixTime())+' '+tx('Remaining')+'</b></span>'; }
		}

		if (!ascended.isPrestigeCity) { CityFaction = tx('Not ascended');}
		else { CityFaction = getFactionName(ascended.prestigeType) + ' ('+uW.g_js_strings.commonstr.level+' '+ascended.prestigeLevel+')'; }

		DefState = parseInt(Seed.citystats["city" + cityId].gate);
		if (DefState) DefButton = '<a id=btCityStatus class="inlineButton btButton red20"><span style="width:150px"><center>'+tx('Troops are Defending!')+'</center></span></a>';
		else DefButton = '<a id=btCityStatus class="inlineButton btButton green20"><span style="width:150px"><center>'+tx('Troops are Hiding!')+'</center></span></a>';

		ArcaneAura = '';
		if (ArcanaEnabled()) {
			var HQDist = distance(Seed.cities[t.Curr][2], Seed.cities[t.Curr][3], Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord);
			var AuraDist = parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance);
			if (HQDist<=AuraDist) { ArcaneAura = '<span class=boldGreen>'+tx('HQ Dist')+': '+HQDist+'</span>'; }
			else { ArcaneAura = '<span class=boldRed>'+tx('HQ Dist')+': '+HQDist+'</span>'; }
		}

		Status += '<table cellspacing=0 width="100%" style="padding-right:0px;">';
		Status += '<tr><td class=xtab width=70>'+uW.g_js_strings.commonstr.nametx+'</a></td><td class=xtab><b>'+Seed.cities[t.Curr][1]+'</b></td><td class=xtab rowspan=2 align=right><span class='+((Options.DashboardOptions.UpperDefendButton==false)?'divHide':'')+'>'+DefButton+'</span></td></tr>';
		Status += '<tr><td class=xtab>'+tx('Location')+'</a></td><td class=xtab><b>'+uW.provincenames['p'+Seed.cities[t.Curr][4]]+'&nbsp;'+coordLink(Seed.cities[t.Curr][2],Seed.cities[t.Curr][3])+'</b>&nbsp;'+ArcaneAura+'</td></tr>';
		Status += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.faction+'</a></td><td class=xtab><b>'+CityFaction+'</b></td><td class=xtab id=prestigeexpcell>&nbsp;</td></tr>';

		Embassy = '<span class=xtab style="color:#f00">'+tx('No Embassy!')+'</span>';
		var emb = t.Buildings[8];
		if (emb.count > 0){
			var availSlots = emb.maxLevel;
			for (var k in Seed.queue_atkinc){
				if ((Seed.queue_atkinc[k].toCityId == cityId) && (Seed.queue_atkinc[k].marchStatus == 2) && (Seed.queue_atkinc[k].fromCityId != cityId) && (Cities.byID[Seed.queue_atkinc[k].fromCityId]==null)) {
					--availSlots;
				}
			}
			Embassy = availSlots +' '+uW.g_js_strings.commonstr.of+' '+ emb.maxLevel +' '+tx('slots available');
		}
		Status += '<tr><td class=xtab><a class=xlink onClick="btShowEmbassy('+t.Curr+')">'+uW.buildingcost.bdg8[0]+'</a></td><td class=xtab colspan=2><b>'+Embassy+'</b></span></b></td></tr>';

		var hall = t.Buildings[7];

		Marshall = '<span class=xtab style="color:#f00">'+tx('No Marshall!')+'</span>';
		Combat = 0;
		var s = Seed.knights["city" + cityId];
		if (s) {
			s = s["knt" + Seed.leaders["city" + cityId].combatKnightId];
			if (s){
				Combat = s.combat;
				if (s.combatBoostExpireUnixtime > unixTime()) {	Combat *= 1.25;	}
				Marshall = s.knightName+' (Atk:'+Combat+')';
				if (!t.ExpandMarshall && (hall.count >= 1)) {
					Marshall += '&nbsp;&nbsp;<a id="btChangeMarshall" class="inlineButton btButton brown8" onclick="btChangeMarshall()"><span>'+tx('Change')+'</span></a>';
					Gauntlets = Seed.items.i221;
					if (!(s.combatBoostExpireUnixtime > unixTime()) && Gauntlets ) {
						Marshall += '&nbsp;<a id="btBoostMarshall" class="inlineButton btButton brown8" onclick="btBoostMarshall()" title="'+itemTitle(221)+'"><span>'+uW.g_js_strings.commonstr.boost+'</span></a>';
					}
					else {
						if (s.combatBoostExpireUnixtime > unixTime()) {
							Marshall += '&nbsp;<span style="color:#080">&nbsp;'+tx('Boosted for')+' '+uW.timestr(s.combatBoostExpireUnixtime-unixTime())+'</span>';
						}
					}
				}
			}
			else {
				t.ExpandMarshall = true;
			}
		}
		else {
			t.ExpandMarshall = false; // no knights ffs!
		}

		if (hall.count < 1) {t.ExpandMarshall = false;} // no fricken knights hall!

		if (t.ExpandMarshall) Marshall += '<div>';
		else Marshall += '<div class=divHide >';
		Marshall +='<SELECT class="btSelector" id="btKnightList"><option value="0">'+uW.g_js_strings.modal_attack.dchooseknightd+'</option>';
		for (var y in Seed.knights["city" + cityId]) {
			s = Seed.knights["city" + cityId][y];
			if ((parseInt(s.knightStatus) == 1) && (s.knightId != parseInt(Seed.leaders["city" + cityId].resourcefulnessKnightId)) && (s.knightId != parseInt(Seed.leaders["city" + cityId].intelligenceKnightId)) && (s.knightId != parseInt(Seed.leaders["city" + cityId].combatKnightId)) && (s.knightId != parseInt(Seed.leaders["city" + cityId].politicsKnightId))) {
				Combat = s.combat;
				if (s.combatBoostExpireUnixtime > unixTime()) {	Combat *= 1.25;	}
				Marshall +='<option value="'+s.knightId+'">'+s.knightName+' ('+uW.g_js_strings.commonstr.atk+':'+Combat+')</option>';
			}
		}
		Marshall +='</select>';
		Marshall += '&nbsp;&nbsp;&nbsp;<a id="btSetMarshall" class="inlineButton btButton brown8" onclick="btSetMarshall()"><span>'+uW.g_js_strings.commonstr.assign+'</span></a>&nbsp;<a id="btCancelMarshall" class="inlineButton btButton brown8" onclick="btCancelMarshall()"><span>'+uW.g_js_strings.commonstr.cancel+'</span></a></div>';

		Status += '<tr><td class=xtab valign=top><a class=xlink onClick="btShowKnightsHall('+t.Curr+')">'+tx('Marshall')+'</a></td><td class=xtabBR style="white-space:normal;" colspan=2><b>'+Marshall+'</b></td></tr>';

		var GotChamp = false;
		var CheckChamp = false;

		if (!uW.isNewServer()) {
			Champion = '<table cellspacing=0><tr><td class="xtab"><span class=xtab style="color:#f00"><b>'+uW.g_js_strings.champ.no_champ+'!</b></td><td class=xtab>';
			try {
				if (!Options.DashboardOptions.GraphicalChampDisplay) {
					t.citychamp = getCityChampion(cityId);
					if (t.citychamp.championId) {
						GotChamp = true;
						if (t.oldchamp != t.citychamp.championId) { t.ExpandChampion = false; }
						if (t.citychamp.status != '10') {champstat = '<span class=xtab style="color:#080">('+uW.g_js_strings.commonstr.defending+')</span>';}
						else { champstat = '<span class=xtab style="color:#f00">('+uW.g_js_strings.commonstr.marching+')</span>';}
						Champion = '<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="ChampStatstd"><img height=14 class=btTop id="ChampStats" onMouseover="btCreateChampionPopUp(this,'+t.citychamp.assignedCity+',true);" src="'+ChampImagePrefix+t.citychamp.avatarId+ChampImageSuffix+'"></td><td class=xtab>'+t.citychamp.name+'</td><td class=xtab>'+champstat+'</td><td class=xtab>';
					}
					if (t.ExpandChampion) {
						Champion += '<a id="btCancelChampion" class="inlineButton btButton brown8" onclick="btCancelChampion()"><span>'+uW.g_js_strings.commonstr.cancel+'</span></a></td></tr></table><div><table cellspacing=0>';
					}
					else {
						if (!GotChamp) { Champion += '<a id="btChangeChampion" class="inlineButton btButton brown8" onclick="btChangeChampion()"><span>'+uW.g_js_strings.commonstr.assign+'</span></a>'; }
						else { if (t.citychamp.status != '10') { Champion += '<a id="btChangeChampion" class="inlineButton btButton brown8" onclick="btChangeChampion()"><span>'+tx('Change')+'</span></a>'; }}
						if (GotChamp && (t.citychamp.status != '10')) { Champion += '&nbsp;<a id="btFreeChampion" class="inlineButton btButton brown8" onclick="btFreeChampion('+t.citychamp.championId+',true)"><span>'+uW.g_js_strings.commonstr.unassign+'</span></a>'; }
						Champion += '</td></tr></table><div class=divHide><table cellspacing=0>';
					}
					for (var y in Seed.champion.champions) {
						chkchamp = Seed.champion.champions[y];
						if (chkchamp.championId) {
							if (!chkchamp.assignedCity || chkchamp.assignedCity != cityId) {
								CheckChamp = true;
								if (chkchamp.assignedCity && !Cities.byID[chkchamp.assignedCity]) { chkchamp.assignedCity = 0; }
								if (!chkchamp.assignedCity || chkchamp.assignedCity == 0) { chkcity = 'Unassigned';} else { chkcity = Cities.byID[chkchamp.assignedCity].name;}
								chkbtn = '';
								defendingCity = chkcity;
								chkcol = "";
								if (chkchamp.status == '10') {
									defendingCity = tx('Marching From')+' '+defendingCity;
									chkcol='color:#800;'
								}
								else {
									if (defendingCity != 'Unassigned') {
										defendingCity = uW.g_js_strings.commonstr.defending+' '+defendingCity;
										chkcol = 'color:#f80;';
									}
									chkbtn = '<a id="btSetChampion'+chkchamp.championId+'" class="inlineButton btButton brown8" onclick="btSetChampion('+chkchamp.championId+',true)"><span>'+uW.g_js_strings.commonstr.assign+'</span></a>';
								}
								Champion += '<tr style="font-weight:normal;align:left;"><td class="xtab trimg" id="ChampStats'+chkchamp.championId+'td"><img height=14 class=btTop id="ChampStats'+chkchamp.championId+'" onMouseover="btCreateChampionPopUp(this,'+(chkchamp.assignedCity?chkchamp.assignedCity:0)+',true,'+chkchamp.championId+');" src="'+ChampImagePrefix+chkchamp.avatarId+ChampImageSuffix+'"></td><td class=xtab>'+chkchamp.name+'</td><td class=xtab><span style="'+chkcol+'">'+defendingCity+'</span></td><td class=xtab>'+chkbtn+'</td></tr>';
							}
						}
					}
					Champion += '</table></div>';
				}
				else {
					Champion = t.PaintChampionSelector(cityId);
				}
			}
			catch (err) {
				logerr(err); // write to log
				Champion = '<span class=xtab style="color:#f00"><b>'+tx('Error reading champion data')+' :(</b></span>';
			}

			if (!Options.DashboardOptions.GraphicalChampDisplay) {
				Status += '<tr><td class=xtab valign=top><a onClick="cm.ChampionModalController.open()">'+uW.g_js_strings.champ.champion+'</a></td><td class=xtab colspan=2><b>'+Champion+'</b></td></tr>';
			}
			else {
				Status += '<tr><td class=xtab><a class=xlink onClick="cm.ChampionModalController.open()">'+uW.g_js_strings.champ.champion+'</a></td><td class=xtab colspan=2>'+Champion+'</td></tr>';
			}
		}

		Status += '<tr><td class=xtab><a class=xlink onClick="btShowGuardians('+t.Curr+')">'+uW.g_js_strings.report_view.guardian+'</a></td><td class=xtab colspan=2 id="btGuardianSelector"></td></tr>';

		var now = unixTime();

		atkboost = '<span style="color:#f00"><b>'+tx('No Active Boost!')+'</b></span>';
		if (Seed.playerEffects.atk2Expire >now) {
			atkboost = '<span style="color:#080"><b>50% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.atk2Expire-now)+'</b></span>';
		}
		else {
			if (Seed.playerEffects.atkExpire >now) {
				atkboost = '<span style="color:#f80"><b>20% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.atkExpire-now)+'</b></span>';
			}
		}
		defboost = '<span style="color:#f00"><b>'+tx('No Active Boost!')+'</b></span>';
		if (Seed.playerEffects.def2Expire >now) {
			defboost = '<span style="color:#080"><b>50% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.def2Expire-now)+'</b></span>';
		}
		else {
			if (Seed.playerEffects.defExpire >now) {
				defboost = '<span style="color:#f80"><b>20% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.defExpire-now)+'</b></span>';
			}
		}
		lifeboost = '<span style="color:#f00"><b>'+tx('No Active Boost!')+'</b></span>';
		if (Seed.playerEffects.lifeExpire >now) {
			lifeboost = '<span style="color:#080"><b>10% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.lifeExpire-now)+'</b></span>';
		}
		spellboost = '<span style="color:#f00"><b>'+tx('No Active Boost!')+'</b></span>';
		if (Seed.playerEffects.spExpire && Seed.playerEffects.spExpire >now) {
			spellboost = '<span style="color:#080"><b>25% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.spExpire-now)+'</b></span>';
		}
		debuffboost = '<span style="color:#f00"><b>'+tx('No Active Boost!')+'</b></span>';
		if (Seed.playerEffects.spdatkExpire && Seed.playerEffects.spdatkExpire >now) {
			debuffboost = '<span style="color:#080"><b>25% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.spdatkExpire-now)+'</b></span>';
		}

		boosts = '<table cellspacing=0 cellpadding=0><tr>';
		for (var i = 0; i < t.BoostItemList.length; i++) {
			if (uW.ksoItems[t.BoostItemList[i]].count) {
				boosts += '<td class=xtab style="padding-right:3px;"><a onClick="cm.ItemController.use(\''+t.BoostItemList[i]+'\')"><img height=28 src="'+IMGURL+'items/70/'+t.BoostItemList[i]+'.jpg" title="'+itemTitle(t.BoostItemList[i])+'"></a></td>';
			}
		}
		boosts += '</tr></table>'

		boosts2 = '<table cellspacing=0 cellpadding=0><tr>';
		for (var i = 0; i < t.BoostItemList2.length; i++) {
			if (uW.ksoItems[t.BoostItemList2[i]].count) {
				boosts2 += '<td class=xtab style="padding-right:3px;"><a onClick="cm.ItemController.use(\''+t.BoostItemList2[i]+'\')"><img height=28 src="'+IMGURL+'items/70/'+t.BoostItemList2[i]+'.jpg" title="'+itemTitle(t.BoostItemList2[i])+'"></a></td>';
			}
		}
		boosts2 += '</tr></table>'

		boosts3 = '<table cellspacing=0 cellpadding=0><tr>';
		for (var i = 0; i < t.BoostItemList3.length; i++) {
			if (uW.ksoItems[t.BoostItemList3[i]] && uW.ksoItems[t.BoostItemList3[i]].count) {
				boosts3 += '<td class=xtab style="padding-right:3px;"><a onClick="cm.ItemController.use(\''+t.BoostItemList3[i]+'\')"><img height=28 src="'+IMGURL+'items/70/'+t.BoostItemList3[i]+'.jpg" title="'+itemTitle(t.BoostItemList3[i])+'"></a></td>';
			}
		}
		boosts3 += '</tr></table>'

		Status += '<tr><td class=xtab valign=top>'+uW.g_js_strings.commonstr.attack+'</td><td class=xtab id=atkboostcell>&nbsp;</td><td class=xtab rowspan=2 align=right style="padding-right:0px;">'+boosts+'</td></tr>';
		Status += '<tr><td class=xtab valign=top>'+uW.g_js_strings.commonstr.defense+'</td><td class=xtab id=defboostcell>&nbsp;</td></tr>';
		Status += '<tr><td class=xtab valign=top>'+tx('Health')+'</td><td class=xtab id=lifeboostcell>&nbsp;</td><td class=xtab rowspan=2 align=right style="padding-right:0px;">'+boosts2+'</td></tr>';
		Status += '<tr><td class=xtab valign=top>'+uW.g_js_strings.spells.spells+'</td><td class=xtab id=spellboostcell>&nbsp;</td></tr>';
		Status += '<tr><td class=xtab valign=top>'+uW.g_js_strings.champ.debuffs+'</td><td class=xtab id=debuffboostcell>&nbsp;</td><td class=xtab rowspan=2 align=right style="padding-right:0px;">'+boosts3+'</td></tr>';
		Status += '<tr><td class=xtab valign=top>&nbsp;</td><td class=xtab>&nbsp;</td></tr>';

		if (Seed.activeRoyalConquestBuff && matTypeof(Seed.activeRoyalConquestBuff)=="array" && Seed.activeRoyalConquestBuff.length>=1) {
			Status += '<tr><td class=xtab valign=top>'+tx('Conquest')+'</td><td colspan=2 class=xtab id=conquestboostcell>&nbsp;</td></tr>';
			var conqboost = '';
			for (var k=0;k<Seed.activeRoyalConquestBuff.length;k++) {
				var conqitem = Seed.activeRoyalConquestBuff[k];
				conqboost += '<div style="color:#080" title="'+uW.itemlist["i"+conqitem.buffId].description+'"><b>'+uW.itemlist["i"+conqitem.buffId].name+' '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(conqitem.endTime-now)+'</b></div>';
			}
		}

		Status += '</table>';

		if (!uW.isNewServer()) {
			Status += '<div id=btTRPresets></div>';
		}

		if (CheckForHTMLChange('DASH','btStatusCell',CityTag+Status,t.serverwait)) {
			ById('btCityStatus').addEventListener ('click', function(){t.ToggleDefenceMode (cityId);} , false);
			t.PaintTRPresets();
			t.PaintGuardianSelector();
			if (GotChamp) {	t.oldchamp = t.citychamp.championId; }
			else { t.oldchamp = 0; }
			t.ResizeFrame = true;
		}

		ById('atkboostcell').innerHTML = atkboost;
		ById('defboostcell').innerHTML = defboost;
		ById('lifeboostcell').innerHTML = lifeboost;
		ById('spellboostcell').innerHTML = spellboost;
		ById('debuffboostcell').innerHTML = debuffboost;
		ById('prestigeexpcell').innerHTML = prestigeexp;
		if (ById('conquestboostcell')) ById('conquestboostcell').innerHTML = conqboost;

		// arcana

		if (ArcanaEnabled()) {
			var AlliArcana = '';
			var PersArcana = '';
			var now = unixTime();
			var arcanaAlliActive = 0;
			if (Seed.activeBuffs && matTypeof(Seed.activeBuffs) == 'object') {
				for (var a in Seed.activeBuffs) {
					var arc = Seed.activeBuffs[a];
					var time1 = arc.a_24h?arc.a_24h:0;
					var time2 = arc.a_7d?arc.a_7d:0;
					if (time1 > now || time2 > now) {
						arcanaAlliActive++;
						var remspan = '';
						var rem = (time2-now);
						var adur = '7d';
						if (time1>now) { rem = (time1-now); adur = '24h'; }
						if (rem<=3600) remspan = 'boldRed';
						AlliArcana += '<div style="margin-bottom:2px;" title="'+uW.itemlist['i'+a].description+': '+t.GetArcanaEffect(a,t.Curr)+(a==42015?'':'%')+'"><span><b>'+uW.itemlist['i'+a].name+'</b></span>';
						if (Seed.is_chancellor || Seed.is_vicechancellor) { AlliArcana += '<span style="inline-block;float:right;margin-top:4px;">'+strButton8(tx('Deactivate'),'onClick=btDeactivateArcana('+a+',"a","'+adur+'")')+'</span>'; }
						AlliArcana += '<br><span class='+remspan+'>'+timestr(rem)+' '+tx('remaining')+'</span></div>';
					}
				}
			}
			if (arcanaAlliActive==0) { AlliArcana += '<span style="margin-bottom:2px;color:#f00"><b>'+tx('No Active Boost!')+'</b><br>&nbsp;</span>'; }
			var arcanaPersActive = 0;
			if (Seed.activeBuffs && matTypeof(Seed.activeBuffs) == 'object') {
				for (var a in Seed.activeBuffs) {
					var arc = Seed.activeBuffs[a];
					var time1 = arc.p_24h?arc.p_24h:0;
					var time2 = arc.p_7d?arc.p_7d:0;
					if (time1 > now || time2 > now) {
						arcanaPersActive++;
						var remspan = '';
						var rem = (time2-now);
						var pdur = '7d';
						if (time1>now) { rem = (time1-now); pdur = '24h'; }
						if (rem<=3600) remspan = 'boldRed';
						PersArcana += '<div style="margin-bottom:2px;" title="'+uW.itemlist['i'+a].description+': '+t.GetArcanaEffect(a,t.Curr)+(a==42015?'':'%')+'"><span><b>'+uW.itemlist['i'+a].name+'</b></span><span style="inline-block;float:right;margin-top:4px;">'+strButton8(tx('Deactivate'),'onClick=btDeactivateArcana('+a+',"p","'+pdur+'")')+'</span><br><span class='+remspan+'>'+timestr(rem)+' '+tx('remaining')+'</span></div>';
					}
				}
			}
			if (arcanaPersActive==0) { PersArcana += '<span style="margin-bottom:2px;color:#f00"><b>'+tx('No Active Boost!')+'</b><br>&nbsp;</span>'; }

			if (arcanaAlliActive<t.MaxAllianceArcana && (Seed.is_chancellor || Seed.is_vicechancellor) && ById('btAlliArcanaDiv')) { ById('btAlliArcanaDiv').style.display = ''; } else { ById('btAlliArcanaDiv').style.display = 'none'; }
			if (arcanaPersActive<t.MaxPersonalArcana) { ById('btPersArcanaDiv').style.display = ''; } else { ById('btPersArcanaDiv').style.display = 'none'; }

			if (CheckForHTMLChange('DASH','btAlliArcanaCell',CityTag+AlliArcana)) {
				ById('btalliarcanamax').innerHTML = t.MaxAllianceArcana;
				ById('btalliarcananum').innerHTML = arcanaAlliActive;
				t.ResizeFrame = true;
			}
			if (CheckForHTMLChange('DASH','btPersArcanaCell',CityTag+PersArcana)) {
				ById('btpersarcanamax').innerHTML = t.MaxPersonalArcana;
				ById('btpersarcananum').innerHTML = arcanaPersActive;
				t.ResizeFrame = true;
			}
		}

		// troop boosts

		var BoostSpeedActive = false;
		var BoostAccuracyActive = false;
		var BoostSpeed = '';
		var BoostAccuracy = '';
		if (Seed.activeSpecificTroopBuff && matTypeof(Seed.activeSpecificTroopBuff) == 'object') {
			var now = unixTime();
			for (var a in Seed.activeSpecificTroopBuff) {
				var endtime = parseIntNan(Seed.activeSpecificTroopBuff[a]);
				if (endtime > now) {
					var remspan = '';
					var rem = (endtime-now);
					if (rem<=3600) remspan = 'boldRed';
					if (t.TroopBoostSpeedList.indexOf(parseInt(a)) != -1) {
						BoostSpeedActive = true;
						BoostSpeed += '<div style="margin-bottom:2px;" title="'+uW.itemlist['i'+a].description+'"><b>'+uW.itemlist['i'+a].name+'</b><br><span class='+remspan+'>'+timestr(rem)+' '+tx('remaining')+'</span></div>';
					}
					if (t.TroopBoostAccuracyList.indexOf(parseInt(a)) != -1) {
						BoostAccuracyActive = true;
						BoostAccuracy += '<div style="margin-bottom:2px;" title="'+uW.itemlist['i'+a].description+'"><b>'+uW.itemlist['i'+a].name+'</b><br><span class='+remspan+'>'+timestr(rem)+' '+tx('remaining')+'</span></div>';
					}
				}
			}
		}

		if (!BoostSpeedActive) { BoostSpeed += '<span style="margin-bottom:2px;color:#f00"><b>'+tx('No Active Boost!')+'</b><br>&nbsp;</span>'; }
		if (!BoostAccuracyActive) { BoostAccuracy += '<span style="margin-bottom:2px;color:#f00"><b>'+tx('No Active Boost!')+'</b><br>&nbsp;</span>'; }

		CheckForHTMLChange('DASH','btBoostSpeedCell',CityTag+BoostSpeed);
		CheckForHTMLChange('DASH','btBoostAccuracyCell',CityTag+BoostAccuracy);

		// sacrifices

		var s = "";
		var z = "";
		var b = t.Buildings[25];
		if (b.count > 0 && t.SacSettings) {
			s += '<table cellSpacing=0 width="100%">';
			s += '<tr><td width=20% class=xtab>'+tx('No. of Altars')+'</td><td width=20% class=xtab><b>'+b.count+'</b></td>';
			s += '<td width=40% class=xtab>'+uW.g_js_strings.blessingSystem.blessing_name_203+'?</td><td width=20% class=xtab><b>'+(t.DarkRitual?uW.g_js_strings.commonstr.yes:uW.g_js_strings.commonstr.no)+'</b></td></tr>';
			s += '<tr><td class=xtab>'+tx('Increase')+'</td><td class=xtab><b>'+t.SacSettings.stat_inc+'%</b></td>';
			s += '<td class=xtab>'+uW.g_js_strings.blessingSystem.blessing_name_206+'?</td><td class=xtab><b>'+(t.ChannelledSuffering?uW.g_js_strings.commonstr.yes:uW.g_js_strings.commonstr.no)+'</b></td></tr>';
			s += '<tr><td class=xtab>'+tx('Max. Troops')+'</td><td class=xtab><b>'+addCommas(t.SacSettings.max_amount)+'</b></td>';
			s += '<td class=xtab>'+tx('Troops per Second')+'</td><td class=xtab><b>'+(Math.round(t.SacSpeed * 100 / t.SacSpeedBuff)/100)+'</b></td></tr>';
			s += '<tr id=btQuickSac class=divHide><td class=xtabBR colspan="4">'+t.QuickSacString+'</td></tr>';
			s += '</table>';

			sac = Seed.queue_sacr["city" + cityId],
			sacrifices = false;
			var r = 0;
			if (sac.length > 0) {
				sacrifices = true;
				jQuery.each(sac, function (P, R) {
					var Q = parseInt(R.eta, 10) - unixTime(),
					S = Math.round((R.multiplier[0] - 1) * 100),
					T = R.buffedUnitType[0];
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
					z += '<tr class="'+rowClass+'"><TD class=xtabBR><span class=xtab>'+uW.unitcost["unt"+T][0]+'</span></td><td class=xtab>'+R.quantity+'</td><td class=xtab>'+uW.timestr(Q)+'</td><td class=xtab align=right><a id="btStopRitual'+P+'" class="inlineButton btButton blue14" onclick="btStopRitual('+ P +')"><span style="width:65px;display:inline-block;text-align:center;">'+uW.g_js_strings.commonstr.cancel+'</span></a></td></tr>';
				})
			}
			z = '<br><div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width="120" class="xtabHD"><b>'+uW.g_js_strings.openCastle.trooptype+'</b></td><td class="xtabHD"><b>'+uW.g_js_strings.commonstr.amount+'</b></td><td width="80" class="xtabHD"><b>'+uW.g_js_strings.commonstr.time+'</b></td><td width="90" class="xtabHD">&nbsp;</td></tr>'+z;
			z += '</table></div>';

			if (r < t.SacAllowed) {
				t.ShowNewSacrifice(true);
				t.allownewsacs = true;
			}
			else {
				t.ShowNewSacrifice(false);
				t.allownewsacs = false;
				z += '<tr><td class=xtab colspan="4"><div class="ErrText" align="center">&nbsp;</div></td></tr>';
			}
			z += '</table></div>';
		}
		else {
			z = '<div><br><div style="opacity:0.3;">'+tx('No fey altars!')+'</div><br></div>';
			t.ShowNewSacrifice(false);
			t.allownewsacs = false;
		}

		if (CheckForHTMLChange('DASH','btSacrificeCell',CityTag+s+z)) {
			t.PaintQuickSac();
			t.ResizeFrame = true;
		}

		// troops

		var GotTroops = false;
		var defendMight = 0;
		var TroopColour = Options.Colors.PanelText;
		var TitleColour = 'rgba('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+',0.5)';
		var TitleStyle = 'xtabHD';
		if (DefState) {
			TroopColour = '#f00';
			TitleColour = '#f00';
			TitleStyle = 'xtabHDDef';
		}

		if (DefState) DefButton2 = '<a id=btCityStatus2 class="inlineButton btButton red20"><span style="width:75px"><center>'+uW.g_js_strings.commonstr.defending+'!</center></span></a>';
		else DefButton2 = '<a id=btCityStatus2 class="inlineButton btButton green20"><span style="width:75px"><center>'+tx('Hiding!')+'</center></span></a>';

		TroopCell = '<div style="font-size:10px;" align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td colspan=2 class="xtab" style="vertical-align:text-top;">';
		if (SelectiveDefending) { TroopCell += '<INPUT id=btFixTroopsChk type=checkbox '+(Options.DashboardOptions.ReplaceDefendingTroops[t.Curr]?'CHECKED':'')+' /><span style="color:'+TroopColour+';font-size:11px;"><b>'+tx('Auto-Replace')+'</b></span>'; }
		TroopCell += '</td><td class="xtab" align=center><b><a class="TextLink" title="Click to toggle troops to Hide" style="color:'+TitleColour+';font-size:14px;" onclick="btSelectDefenders(\'A\',false);">'+uW.g_js_strings.commonstr.defending+'</a></b><br></td><td colspan=2 class="xtab" align=right><span class='+((Options.DashboardOptions.LowerDefendButton==false)?'divHide':'')+'>'+DefButton2+'</span></td></tr>';

		if (SelectiveDefending) {
			Troops = '<tr><td width=20% class="'+TitleStyle+'"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'I\',false);">'+uW.g_js_strings.modal_barracks_trainingtab.unittypeinfantry+'</a></b></td><td width=20% class="'+TitleStyle+'"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'R\',false);">'+uW.g_js_strings.modal_barracks_trainingtab.unittyperanged+'</a></b></td><td width=20% class="'+TitleStyle+'"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'H\',false);">'+uW.g_js_strings.modal_barracks_trainingtab.unittypehorsed+'</a></b></td><td width=20% class="'+TitleStyle+'"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'S\',false);">'+uW.g_js_strings.modal_barracks_trainingtab.unittypesiege+'</a></b></td><td width=20% class="'+TitleStyle+'"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'P\',false);">'+uW.g_js_strings.modal_barracks_trainingtab.spellcaster+'</a></b></td></tr>';
			Troops += '<tr><td class="xtabBRTop">';
			for(c=0; c<Infantry.length; c++){
				var i = parseInt(Infantry[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i]*parseInt(uW.unitmight["unt"+i])); Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',false);">'+TroopImage(i)+ addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
			}
			Troops += '</td><td class="xtabBRTop">';
			for(c=0; c<Ranged.length; c++){
				var i = parseInt(Ranged[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i]*parseInt(uW.unitmight["unt"+i])); Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',false);">'+TroopImage(i)+ addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
			}
			Troops += '</td><td class="xtabBRTop">';
			for(c=0; c<Horsed.length; c++){
				var i = parseInt(Horsed[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i]*parseInt(uW.unitmight["unt"+i])); Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',false);">'+TroopImage(i)+ addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
			}
			Troops += '</td><td class="xtabBRTop">';
			for(c=0; c<Siege.length; c++){
				var i = parseInt(Siege[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i]*parseInt(uW.unitmight["unt"+i])); Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',false);">'+TroopImage(i)+ addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
			}
			Troops += '</td><td class="xtabBRTop">';
			for(c=0; c<SpellCaster.length; c++){
				var i = parseInt(SpellCaster[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i]*parseInt(uW.unitmight["unt"+i])); Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',false);">'+TroopImage(i)+ addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
			}
			Troops += '</td></tr>';
			if (!GotTroops) {Troops = '<tr><td colspan=5 class="xtab" align=center><div style="opacity:0.3;color:'+TroopColour+'">'+tx('No Troops')+'</div></td></tr>';}
			else { if (Options.ShowMarchMight) { Troops += '<tr><td colspan=5 class="xtab" align=center><div style="color:'+TroopColour+'">'+tx('Defending Might')+':&nbsp;'+addCommas(defendMight)+'</div></td></tr>';} }

			TroopCell += Troops + '<tr><td colspan=5 class="xtab" align=center>&nbsp;</td></tr>';

			GotTroops = false;
			TroopColour = Options.Colors.PanelText;
			TitleColour = 'rgba('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+',0.5)';
			TitleStyle = 'xtabHD';

			TroopCell += '<tr><td colspan=2 class="xtab" style="vertical-align:text-top;">&nbsp;</td><td class="xtab" align=center><b><a class="TextLink" title="'+tx('Click to toggle troops to Defend')+'" style="color:'+TitleColour+';font-size:14px;" onclick="btSelectDefenders(\'A\',true);">'+tx('Sanctuary')+'</a></b><br></td><td colspan=2 class="xtab" align=right><a class=xlink onclick="btToggleSanctuary();"><span id=btShowHideSanct>'+tx('hide')+'</span></a></td></tr>';
		}

		Troops = '<tr id=btsanctroopstitle><td width=20% class="xtabHD"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'I\',true);">'+uW.g_js_strings.modal_barracks_trainingtab.unittypeinfantry+'</a></b></td><td width=20% class="xtabHD"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'R\',true);">'+uW.g_js_strings.modal_barracks_trainingtab.unittyperanged+'</a></b></td><td width=20% class="xtabHD"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'H\',true);">'+uW.g_js_strings.modal_barracks_trainingtab.unittypehorsed+'</a></b></td><td width=20% class="xtabHD"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'S\',true);">'+uW.g_js_strings.modal_barracks_trainingtab.unittypesiege+'</a></b></td><td width=20% class="xtabHD"><b><a class="TextLink" style="color:'+TitleColour+';" onclick="btSelectDefenders(\'P\',true);">'+uW.g_js_strings.modal_barracks_trainingtab.spellcaster+'</a></b></td></tr>';
		Troops += '<tr id=btsanctroops><td class="xtabBRTop">';
		for(c=0; c<Infantry.length; c++){
			var i = parseInt(Infantry[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',true);">'+TroopImage(i)+ addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
		}
		Troops += '</td><td class="xtabBRTop">';
		for(c=0; c<Ranged.length; c++){
			var i = parseInt(Ranged[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',true);">'+TroopImage(i)+ addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
		}
		Troops += '</td><td class="xtabBRTop">';
		for(c=0; c<Horsed.length; c++){
			var i = parseInt(Horsed[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',true);">'+TroopImage(i)+ addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
		}
		Troops += '</td><td class="xtabBRTop">';
		for(c=0; c<Siege.length; c++){
			var i = parseInt(Siege[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',true);">'+TroopImage(i)+ addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
		}
		Troops += '</td><td class="xtabBRTop">';
		for(c=0; c<SpellCaster.length; c++){
			var i = parseInt(SpellCaster[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:'+TroopColour+'"><a class="TextLink" style="color:'+TroopColour+';" onclick="btSelectDefenders('+i+',true);">'+TroopImage(i)+ addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+i])+'</a></div>';}
		}
		Troops += '</td></tr>';
		if (!GotTroops) {Troops = '<tr id=btsanctroops><td colspan=5 class="xtab" align=center><div style="opacity:0.3;color:'+TroopColour+'">'+tx('No Troops')+'</div></td></tr>';}
		TroopCell += Troops + '<tr><td colspan=5 class="xtab" align=center>&nbsp;</td></tr></table></div>';

		if (CheckForHTMLChange('DASH','btTroopCell',CityTag+TroopCell)) {
			t.ShowHideSanctuary();
			if (SelectiveDefending) {
				ById('btFixTroopsChk').addEventListener ('click', function(e) {
					Options.DashboardOptions.ReplaceDefendingTroops[t.Curr] = e.target.checked;
					saveOptions();
				},false);
			}
			ById('btCityStatus2').addEventListener ('click', function(){t.ToggleDefenceMode (cityId);} , false);
			// check if troop types dropdowns need refreshing - Defence AND Sacrifice!
			CheckOptionsString = "";
			for (var y in uW.unitcost) {
				var tot = parseIntNan(Seed.units['city' + Seed.cities[t.Curr][0]]['unt'+y.substr(3)]);
				if ((tot > 0)) {
					CheckOptionsString = CheckOptionsString + y.substr(3);
				}
			}
			if (t.DefOptionsString != CheckOptionsString) {
				if (SelectiveDefending) { t.InitPresetNumber = ById('btDefendPreset').value; }
				t.SetCurrentCity(Seed.cities[t.Curr][0],true);
			}
			else {
				if (SelectiveDefending) { t.SelectDefTroopType (ById("btDefendTroops")); }
			}
			t.ResizeFrame = true;
		}

		// reinforcements

		reinforcements = false;
		reinforceMight = 0;
		t.Reins = [];
		var z = "";
		var r = 0;
		for (var k in inc){
			var to = Cities.byID[inc[k].toCityId];
			if ((inc[k].toCityId == cityId) && (to.tileId == inc[k].toTileId) && ((inc[k].marchStatus == 2) || (inc[k].marchType == 2)) && (inc[k].fromCityId != cityId)) {
				reinforcements = true;
				var a = inc[k];
				var player = Seed.players['u'+a.fromPlayerId];
				var fromname = player.n;
				marchdir = "Return"; // always show troops remaining
				var	marchtime=uW.timestr(a.arrivalTime - unixTime());
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				z += '<tr class="'+rowClass+'"><TD class=xtabBR><span class=xtab>'+fromname+'</span></td><td class=xtabBR>';

				if (a["knightId"] > 0) z +='<span class=xtab>'+uW.g_js_strings.commonstr.knight+' (Atk:'+ a["knightCombat"]+')</span> ';
				for (var ui in CM.UNIT_TYPES){
					i = CM.UNIT_TYPES[ui];
					if(a["unit"+i+marchdir] > 0) {
						z += '<span class=xtab>'+ uW.unitcost['unt'+i][0] +': '+ addCommas(a["unit"+i+marchdir])+'</span> ';
						reinforceMight += (a["unit"+i+marchdir]*parseInt(uW.unitmight["unt"+i]));
					}
				}
				if ((a.marchStatus == 2) || (a.arrivalTime - unixTime() <= 0))	{
					z += '</td><td class=xtab align="right"><a id="btSendHome'+a.marchId+'" class="inlineButton btButton blue14" onclick="btSendHome('+ a.marchId +')"><span>'+uW.g_js_strings.openEmbassy.senthome+'</span></a></td></tr>';
					t.Reins.push(a.marchId); // for send all home logic
				}
				else {
					z += '</td><td class=xtab align="right">'+marchtime+'</td></tr>';
				}
			}
		}
		if (!reinforcements) {
			z = '<DIV><br><div style="opacity:0.3;">'+tx('No Reinforcements')+'</div><br></div>';
		}
		else
		{
			z = '<div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width="120" class="xtabHD"><b>'+uW.g_js_strings.commonstr.from+'</b></td><td class="xtabHD"><b>'+uW.g_js_strings.commonstr.troops+'</b></td><td width="40" class="xtabHD"><a id="btSendAllHome" class="inlineButton btButton red14" onclick="btSendAllHome('+cityId+')"><span>'+tx('Send All Home')+'</span></a></td></tr>'+z;
			if (Options.ShowMarchMight) { z += '<tr><td colspan=4 class="xtab" style="font-size:10px;" align=center><div>'+tx('Reinforcing Might')+':&nbsp;'+addCommas(reinforceMight)+'</div></td></tr>'; }
			z += '<tr><td class=xtab colspan="4"><div class="ErrText" align="center" id=btReinErr>&nbsp;</div></td></tr></table></div>';
		}

		if (CheckForHTMLChange('DASH','btReinforceCell',CityTag+z,t.serverwait)) {
			t.ResizeFrame = true;
		}

		// incoming attacks

		cityincoming = false;
		var cityinctimes = {};
		var z = "";
		var r = 0;
		for (var k in inc){
			if ((inc[k].toCityId == cityId) && (inc[k].score)) {
				var a = inc[k];
				if (a.arrivalTime < unixTime()) continue; // don't display arrival times already happened
				cityincoming = true;
				var icon,hint,marchtime,fromname,marchdir,fromcoords;
				var marchId = a.mid;
				var marchScore = parseInt(a.score);
				var marchType = parseInt(a.marchType);
				var marchStatus = parseInt(a.marchStatus);
				var marchMight = 0;
				if (!a.marchType) {a.marchType = 4;}
				if (!a.arrivalTime || a.arrivalTime == -1) {marchtime = '??????';}
				else {marchtime=uW.timestr(a.arrivalTime - unixTime());}
				cityinctimes[marchId] = marchtime;
				var player = Seed.players['u'+a.pid];
				fromname = "";
				if (player) {fromname = player.n;}

				if (!a.fromXCoord) {fromcoords = "";}
				else {fromcoords = coordLink(a.fromXCoord,a.fromYCoord);}
				if (fromname == "") {fromname = '('+tx('Upgrade WatchTower')+')';}
				else {fromname = MonitorLink(a.pid,fromname);}

				switch (marchType) {
					case 3: icon=ScoutImage;hint=uW.g_js_strings.commonstr.scout;break;
					case 4: icon=AttackImage;hint=uW.g_js_strings.commonstr.attack;break;
				}
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				z += '<tr class="'+rowClass+'"><TD class=xtab><img src='+icon+' title='+hint+'></td>';
				z += '<TD class=xtabBR><span class=xtab id="citymarchtime'+marchId+'">&nbsp;</span></td>';
				z += '<TD class=xtabBR><span class=xtab>'+fromname+'</span> ';
				if (fromcoords != "") { z+= '<span class=xtab>'+fromcoords+'</span>'; }
				var zz = '';
				if ((safecall.indexOf(a.pid) < 0 || trusted) && a["championInfo"]) {
					t.marchchamp = '<table cellspacing=0 class=xtab><tr><td colspan=2><b>'+a["championInfo"].name+'</b></td></tr><tr><td colspan=2><b>'+uW.g_js_strings.report_view.champion_stats+'</b></td></tr>';
					var gotchamp = false;
					if (a["championInfo"].effects[1] && !(a["championInfo"].effects[1] instanceof Array) && typeof(a["championInfo"].effects[1]) === "object") {
						got202 = false;
						for (var cy in a["championInfo"].effects[1]) {
							// missing bonus damage?
							if ((cy == '202') && gotchamp) {got202 = true;}
							if ((cy == '203') && !got202) { t.marchchamp += "<tr><td>"+uW.g_js_strings.effects.name_202+"</td><td>0</td></tr>"; }
							str = uW.g_js_strings.effects['name_'+cy];
							if (str && str!= "") {
								gotchamp = true;
								t.marchchamp += "<tr><td>"+str+"</td><td>"+a["championInfo"].effects[1][cy]+"</td></tr>";
							} else { break;	}
						}
					}
					if (!gotchamp) { t.marchchamp += '<tr><td colspan=2><i>'+tx('None Available')+'</i></td></tr>'; }
					t.marchchamp+='<tr><td colspan=2><b>'+uW.g_js_strings.report_view.troop_stats+'</b></td></tr>';
					var gottroop = false;
					if (a["championInfo"].effects[2] && !(a["championInfo"].effects[2] instanceof Array) && typeof(a["championInfo"].effects[2]) === "object") {
						for (var ty in a["championInfo"].effects[2]) {
							str = uW.g_js_strings.effects['name_'+ty];
							if (str && str!= "") {
								gottroop = true;
								t.marchchamp += "<tr><td>"+str+"</td><td>"+a["championInfo"].effects[2][ty]+"</td></tr>";
							} else { break;	}
						}
					}
					if (!gottroop) { t.marchchamp += '<tr><td colspan=2><i>'+tx('None Available')+'</i></td></tr>'; }
					t.marchchamp+="</table>";
					zz +='<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="btcitymarchchamp'+a.mid+'td"><input type="hidden" id="btcitymarchchamp'+a.mid+'effects" value="'+t.marchchamp+'" /><a><img id="btcitymarchchamp'+a.mid+'" onMouseover="btCreateChampionPopUp(this,'+a.toCityId+');" height=14 class=btTop src="'+ShieldImage+'"></a></td><td class=xtab>Champion: '+a["championInfo"].name+'&nbsp;</td></tr></table>';
				}
				if (a["knt"] && a["knt"]["cbt"]) zz +='<span class=xtab>'+uW.g_js_strings.commonstr.knight+' ('+uW.g_js_strings.commonstr.atk+':'+ a["knt"]["cbt"]+')</span> ';
				if (a["unts"]) {
					for (var ui in CM.UNIT_TYPES){
						i = CM.UNIT_TYPES[ui];
						if (a["unts"]["u"+i]) {
							if (a["unts"]["u"+i] > 0) { zz += '<span class=xtab>'+ uW.unitnamedesctranslated['unt'+i][0] +': '+ addCommas(a["unts"]["u"+i])+'</span> '; marchMight += (a["unts"]["u"+i]*parseInt(uW.unitmight["unt"+i])); }
							else { zz += '<span class=xtab>'+ a["unts"]["u"+i]+' '+ uW.unitnamedesctranslated['unt'+i][0] +'</span> '; }
						}
					}
				}
				else
				{
					if (a["cnt"]) { zz += '<span class=xtab>'+a["cnt"]+'</span> ';}
					else { zz += '<span class=xtab>('+uW.g_js_strings.attack_viewimpending_view.upgradetoseeinfo+')</span> '; }
				}

				if (local_atkinc["m"+marchId]["fromSpellType"]) {
					var spell = uW.g_js_strings.spells['name_'+local_atkinc["m"+marchId]["fromSpellType"]];
					if (spell) {
						var spellstyle = 'color:#808;';
						zz +='<br><span class=xtab style="'+spellstyle+'"><b>*&nbsp;'+spell+'&nbsp;*</b></span>'
					}
				}
				z += '<TD ';
				if (Options.ShowMarchMight && marchMight!=0) z += 'title="'+uW.g_js_strings.commonstr.might+': '+addCommas(marchMight)+'"';
				z += ' colspan=2 class=xtabBR>'+zz+'</td></tr>';
			}
		}
		if (!cityincoming) {
			z = '<DIV><br><div style="opacity:0.3;">'+tx('No Incoming Attacks')+'</div></div>';
		}
		else
		{
			z = '<div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width="18" class="xtabHD">&nbsp;</td><td width="60" class="xtabHD"><b>'+uW.g_js_strings.commonstr.time+'</b></td><td width="120" class="xtabHD"><b>'+uW.g_js_strings.commonstr.from+'</b></td><td class="xtabHD"><b>'+uW.g_js_strings.commonstr.troops+'</b></td></tr>'+z;
		}
		z += '</table></div>';

		if (CheckForHTMLChange('DASH','btAttackCell',CityTag+z)) {
			t.ResizeFrame = true;
		}

		for (var m in cityinctimes) {
			mt = cityinctimes[m];
			if (ById('citymarchtime'+m)) {
				ById('citymarchtime'+m).innerHTML = mt;
			}
		}

		// fortifications

		GotDef = false;
		t.WallDefences = [];
		t.FieldDefences = [];
		var d = Seed.fortifications["city" + Seed.cities[t.Curr][0]];
		var a = Object.keys(d);
		for (var c = 0; c < a.length; c++) {
			var f = parseInt(a[c].split("fort")[1]);
			if (f < 60 || f==63) { t.WallDefences.push(a[c]) } else { t.FieldDefences.push(a[c])	}
		}

		var dt = t.Buildings[30];
		var rt = t.Buildings[31];
		var wall = {};
		getWallInfo(cityId,wall);
		var TArcDesc = '';
		var TArcEffect = '';
		if (ArcanaEnabled()) {
			var TArc = t.GetArcanaEffect(42001,t.Curr)+t.GetArcanaEffect(42013,t.Curr);
			if (TArc!=0) {
				TArcDesc = tx('Arcana Bonus');
				TArcEffect = TArc+'%';
			}
		}
		Walls = '<div align="center"><table cellSpacing=0 width="100%">';
		Walls += '<tr><td width=20% class=xtab><a class=xlink onClick="btShowWalls('+t.Curr+')">'+tx('Walls')+'</a></td><td width=60% class=xtab><b>'+(wall.wallLevel?uW.g_js_strings.commonstr.level+' '+wall.wallLevel:'<span class=xtab style="color:#f00">'+tx('No Walls')+'</span>')+'</b></td><td width=20% class=xtab>'+tx('Wall Space')+'</td><td align=right class=xtab><b>'+wall.wallSpaceUsed+'/'+wall.wallSpace+'</b></td></tr>';
		Walls += '<tr><td class=xtab>'+uW.buildingcost.bdg30[0]+'</td><td class=xtab><b>'+(dt.maxLevel?'Level '+dt.maxLevel:'<span class=xtab style="color:#f00">'+tx('None')+'!</span>')+'</b></td><td class=xtab>'+tx('Field Space')+'</td><td align=right class=xtab><b>'+wall.fieldSpaceUsed+'/'+wall.fieldSpace+'</b></td></tr>';
		Walls += '<tr><td class=xtab>'+uW.buildingcost.bdg31[0]+'</td><td class=xtab><b>'+(rt.maxLevel?'Level '+rt.maxLevel:'<span class=xtab style="color:#f00">'+tx('None')+'!</span>')+'</b></td><td class=xtab>'+TArcDesc+'</td><td align=right class=xtab><b>'+TArcEffect+'</b></td></tr>';
		Walls += '</table><br>';

		var now = unixTime();

		tatkboost = '<span style="color:#f00"><b>'+tx('No Active Boost!')+'</b></span>';
		if (Seed.playerEffects.tatk2Expire >now) {
			tatkboost = '<span style="color:#080"><b>50% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.tatk2Expire-now)+'</b></span>';
		}
		else {
			if (Seed.playerEffects.tatkExpire >now) {
				tatkboost = '<span style="color:#f80"><b>20% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.tatkExpire-now)+'</b></span>';
			}
		}
		tlifeboost = '<span style="color:#f00"><b>'+tx('No Active Boost!')+'</b></span>';
		if (Seed.playerEffects.tlife2Expire >now) {
			tlifeboost = '<span style="color:#080"><b>50% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.tlife2Expire-now)+'</b></span>';
		}
		else {
			if (Seed.playerEffects.tlifeExpire >now) {
				tlifeboost = '<span style="color:#f80"><b>20% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.tlifeExpire-now)+'</b></span>';
			}
		}

		tboosts = '<table cellspacing=0 cellpadding=0><tr>';

		for (var i = 0; i < t.tBoostItemList.length; i++) {
			if (uW.ksoItems[t.tBoostItemList[i]].count) {
				tboosts += '<td class=xtab style="padding-right:3px;"><a onClick="cm.ItemController.use(\''+t.tBoostItemList[i]+'\')"><img height=28 src="'+IMGURL+'items/70/'+t.tBoostItemList[i]+'.jpg" title="'+itemTitle(t.tBoostItemList[i])+'"></a></td>';
			}
		}

		tboosts += '</tr></table>';
		var tStatus = '<table cellSpacing=0 width="100%">';
		tStatus += '<tr><td width=20% class=xtab valign=top>'+tx('Tower Attack')+'</td><td class=xtab id=tatkboostcell>&nbsp;</td><td class=xtab rowspan=2 style="padding-right:0px;" align=right>'+tboosts+'</td></tr>';
		tStatus += '<tr><td width=20% class=xtab valign=top>'+tx('Tower Life')+'</td><td class=xtab id=tlifeboostcell>&nbsp;</td></tr>';

		tStatus += '</table><br>';

		Defences = '<div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width=50% class="xtabHD"><b>'+uW.g_js_strings.openCastle.walldefenses+'</b></td><td width=50% class="xtabHD"><b>'+tx('Field Defenses')+'</b></td></tr>';
		Defences += '<tr><td class="xtabBRTop">';
		for(c=0; c<t.WallDefences.length; c++){
			var f = parseInt(t.WallDefences[c].split("fort")[1]);
			if (Seed.fortifications['city' + Seed.cities[t.Curr][0]]['fort'+f] > 0) { GotDef = true; Defences += '<span class=xtab style="display:inline-block;width:100px;">'+TroopImage(f)+ addCommas(Seed.fortifications['city' + Seed.cities[t.Curr][0]]['fort'+f])+'</span> ';}
		}
		Defences += '</td><td class="xtabBRTop">';
		for(c=0; c<t.FieldDefences.length; c++){
			var f = parseInt(t.FieldDefences[c].split("fort")[1]);
			if (Seed.fortifications['city' + Seed.cities[t.Curr][0]]['fort'+f] > 0) { GotDef = true; Defences += '<span class=xtab style="display:inline-block;width:100px;">'+TroopImage(f)+ addCommas(Seed.fortifications['city' + Seed.cities[t.Curr][0]]['fort'+f])+'</span> ';}
		}
		Defences += '</td></tr></table>';
		if (!GotDef) {Defences = '<div><br><div style="opacity:0.3;">'+tx('No Fortifications')+'</div>';}
		Defences += '<br></div>';

		if (CheckForHTMLChange('DASH','btWallDefenceCell',CityTag+Walls+tStatus+Defences)) {
			t.ResizeFrame = true;
		}

		ById('tatkboostcell').innerHTML = tatkboost;
		ById('tlifeboostcell').innerHTML = tlifeboost;

		// outgoing attacks

		cityoutgoing = false;
		var cityouttimes = {};
		var z = "";
		var r = 0;
		for (var k in outCity){
			var a = outCity[k];
			if (a.destinationUnixTime < unixTime()) continue; // don't display arrival times already happened
			var icon, hint, marchtime, totile, tocity, toname, marchdir, tocoords;

			var marchId = a.marchId;
			var marchStatus = parseInt(a.marchStatus);
			var marchType = parseInt(a.marchType);
			var marchMight = 0;
			if (marchType == 10) marchType=4; // Change Dark Forest type to Attack!
			if (marchType != 4 && marchType != 3) continue; // attacks and scouts only
			cityoutgoing = true;
			var now = unixTime();
			var destinationUnixTime = a["destinationUnixTime"] - now;

			marchdir = "Count";

			totile = "";
			tocity = "";
			toname = "";
			totile = tileTypes[parseInt(a["toTileType"])];
			if (a["toTileType"] == 51) {
				if (!a["toPlayerId"]) { totile = ""; }
				else { if (a["toPlayerId"] == 0) totile = tx('Barb Camp'); }
			}
			totile = 'Lvl '+a["toTileLevel"]+' '+totile;

			if (a["toPlayerId"] && (a["toPlayerId"] != 0)) {
				if (a.players && a.players['u'+a.toPlayerId]) {
					toname = MonitorLink(a.toPlayerId,a.players['u'+a.toPlayerId].n);
				}
				else {
					if (Seed.players['u'+a.toPlayerId]) {
						toname = MonitorLink(a.toPlayerId,Seed.players['u'+a.toPlayerId].n);
					}
				}
			}

			var iconType = marchType;

			if (destinationUnixTime < (60)) { marchtime = '<span style="color:#f00">'+uW.timestr(destinationUnixTime)+'</span>'; }
			else { marchtime = uW.timestr(destinationUnixTime); }

			cityouttimes[marchId] = marchtime;

			if (!a.toXCoord || (tocity != "")) {tocoords = "";}
			else {tocoords = coordLink(a.toXCoord,a.toYCoord);}

			hint = "";
			switch (marchType) {
				case 3: hint=uW.g_js_strings.commonstr.scout;break;
				case 4: hint=uW.g_js_strings.commonstr.attack;break;
			}

			switch (iconType) {
				case 3: icon=ScoutImage;break;
				case 4: icon=AttackImage;break;
			}
			hint=tx('Recall march')+" ("+marchId+")";

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="'+rowClass+'"><TD class=xtab><a id="btCityRecall'+a.marchId+'" onclick="btRecall('+ a.marchId +',true)"><img src='+icon+' title='+hint+'></a></td>';
			z += '<TD class=xtab id="cityoutmarchtime'+marchId+'">&nbsp;</td>';
			z += '<TD class=xtabBR>';
			if (toname != "") { z+= '<span class=xtab>'+toname+'</span> '; }
			if (totile != "") { z+= '<span class=xtab>'+totile+'</span> '; }
			if (tocity != "") { z+= '<span class=xtab>'+tocity+'</span> '; }
			if (tocoords != "") { z+= '<span class=xtab>'+tocoords+'</span>'; }
			z += '</td>';
			var zz = '';
			if (a["championInfo"]) { // stats here are sort of obsolete, because it uses city champ data, but kept in for completeness...
				t.marchchamp = '<table cellspacing=0 class=xtab><tr><td colspan=2><b>'+a["championInfo"].name+'</b></td></tr><tr><td colspan=2><b>'+uW.g_js_strings.report_view.champion_stats+'</b></td></tr>';
				var gotchamp = false;
				if (a["championInfo"].effects) {
					if (a["championInfo"].effects[1] && !(a["championInfo"].effects[1] instanceof Array) && typeof(a["championInfo"].effects[1]) === "object") {
						got202 = false;
						for (var cy in a["championInfo"].effects[1]) {
							// missing bonus damage?
							if ((cy == '202') && gotchamp) {got202 = true;}
							if ((cy == '203') && !got202) { t.marchchamp += "<tr><td>"+uW.g_js_strings.effects.name_202+"</td><td>0</td></tr>"; }
							str = uW.g_js_strings.effects['name_'+cy];
							if (str && str!= "") {
								gotchamp = true;
								t.marchchamp += "<tr><td>"+str+"</td><td>"+a["championInfo"].effects[1][cy]+"</td></tr>";
							} else { break;	}
						}
					}
					if (!gotchamp) { t.marchchamp += '<tr><td colspan=2><i>'+tx('None Available')+'</i></td></tr>'; }
					t.marchchamp+='<tr><td colspan=2><b>'+uW.g_js_strings.report_view.troop_stats+'</b></td></tr>';
					var gottroop = false;
					if (a["championInfo"].effects[2] && !(a["championInfo"].effects[2] instanceof Array) && typeof(a["championInfo"].effects[2]) === "object") {
						for (var ty in a["championInfo"].effects[2]) {
							str = uW.g_js_strings.effects['name_'+ty];
							if (str && str!= "") {
								gottroop = true;
								t.marchchamp += "<tr><td>"+str+"</td><td>"+a["championInfo"].effects[2][ty]+"</td></tr>";
							} else { break;	}
						}
					}
					if (!gottroop) { t.marchchamp += '<tr><td colspan=2><i>'+tx('None Available')+'</i></td></tr>'; }
					t.marchchamp+="</table>";
				}
				zz +='<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="btcityoutmarchchamp'+a.marchId+'td"><input type="hidden" id="btcityoutmarchchamp'+a.marchId+'effects" value="'+t.marchchamp+'" /><a><img id="btcityoutmarchchamp'+a.marchId+'" onMouseover="btCreateChampionPopUp(this,'+a.fromCityId+',true);" height=14 class=btTop src="'+ShieldImage+'"></a></td><td class=xtab>'+uW.g_js_strings.champ.champion+': '+a["championInfo"].name+'&nbsp;</td></tr></table>';
			}
			if ((a["knightId"] > 0) && (!a["knightCombat"])) {
				for (var i in Seed.knights["city"+a.marchCityId]) {
					if (i == ("knt" + a["knightId"])) {
						Combat = Seed.knights["city"+a.marchCityId][i]["combat"];
						if (Seed.knights["city"+a.marchCityId][i]["combatBoostExpireUnixtime"] > unixTime()) {	Combat *= 1.25;	}
						a["knightCombat"] = Combat;
					}
				}
			}

			if (a["knightId"] > 0) zz +='<span class=xtab>'+uW.g_js_strings.commonstr.knight+' ('+uW.g_js_strings.commonstr.atk+':'+ a["knightCombat"]+')</span> ';
			for (var ui in CM.UNIT_TYPES){
				i = CM.UNIT_TYPES[ui];
				if((a["unit"+i+"Count"] > 0) || (a["unit"+i+"Return"] > 0)) {
					trpcol = Options.Colors.PanelText;
					zz += '<span class=xtab>'+ uW.unitcost['unt'+i][0] +': <span class=xtab style="color:'+trpcol+'">'+ addCommas(a["unit"+i+marchdir])+'</span></span> ';
					marchMight += (a["unit"+i+marchdir]*parseInt(uW.unitmight["unt"+i]));
				}
			}

			if (a["fromSpellType"]) {
				var spell = uW.g_js_strings.spells['name_'+a["fromSpellType"]];
				if (spell) {
					var spellstyle = 'color:#808;';
					zz +='<br><span class=xtab style="'+spellstyle+'"><b>*&nbsp;'+spell+'&nbsp;*</b></span>'
				}
			}
			z += '<TD ';
			if (Options.ShowMarchMight && marchMight!=0) z += 'title="'+uW.g_js_strings.commonstr.might+': '+addCommas(marchMight)+'"';
			z += ' colspan=2 class=xtabBR>'+zz+'</td></tr>';
		}
		if (!cityoutgoing) {
			z = '<DIV><br><div style="opacity:0.3;">'+tx('No Outgoing Attacks')+'</div></div>';
		}
		else
		{
			z = '<div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width="18" class="xtabHD">&nbsp;</td><td width="60" class="xtabHD"><b>'+uW.g_js_strings.commonstr.time+'</b></td><td width="120" class="xtabHD"><b>'+uW.g_js_strings.commonstr.target+'</b></td><td class="xtabHD"><b>'+uW.g_js_strings.commonstr.troops+'</b></td></tr>'+z;
		}
		z += '<tr><td class=xtab colspan="4"><div class="ErrText" align="center" id=btCityOutErr>&nbsp;</div></td></tr></table></div>';

		if (CheckForHTMLChange('DASH','btCityAttackCell',CityTag+z)) {
			t.ResizeFrame = true;
		}

		for (var m in cityouttimes) {
			mt = cityouttimes[m];
			if (ById('cityoutmarchtime'+m)) {
				ById('cityoutmarchtime'+m).innerHTML = mt;
			}
		}

		// toggle section displays

		t.ShowHideSection("btStatus",t.OverviewShow);
		t.ShowHideSection("btArcana",t.ArcanaShow && ArcanaEnabled());
		t.ShowHideSection("btSacrifice",t.SacrificeShow && (ascended.prestigeType == "2"));
		t.ShowHideSection("btTroop",t.TroopShow);
		t.ShowHideSection("btReinforce",t.ReinforceShow);
		t.ShowHideSection("btWallDefence",t.FortificationShow);
		t.ShowHideSection("btAttack",t.AttackShow);
		t.ShowHideSection("btCityAttack",t.CityAttackShow);

		t.ShowHideRow("btDefAddTroopRow",Options.DashboardOptions.DefAddTroopShow);
		t.ShowHideRow("btDefPresetRow",Options.DashboardOptions.DefPresetShow);

		if (t.ResizeFrame == true) { ResetFrameSize('btDash',100,t.DashWidth); }
	},

	EverySecond : function () {
		var t = Dashboard;

		try {
			/* Reduce Delayers if they are Active */

			if (t.ThroneDelay > 0) { t.ThroneDelay--; t.PaintTRPresets(); }
			if (t.GuardDelay > 0) { t.GuardDelay--; t.PaintGuardianSelector(); }

			if (!(Options.DashboardOptions.CurrentCity < 0)) {
				if (((SecondLooper % t.GeneralInterval) == 1) || t.GeneralInterval == 1) {
					t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
				}
			};

			/* check defence status, incoming status, selected guardian */

			for (var cityId in Cities.byID){
				var city_num = Cities.byID[cityId].idx;
				if (Seed.citystats["city" + cityId].gate != 0) {
					jQuery("#btCastles_" + city_num).removeClass("hiding").addClass("defending");
				} else {
					jQuery("#btCastles_" + city_num).removeClass("defending").addClass("hiding");
				}
				if (incCity.indexOf(city_num) >= 0) { jQuery("#btCastles_" + city_num).addClass("attack"); }
				else {jQuery("#btCastles_" + city_num).removeClass("attack"); }
			}

			if (t.CurrGuardian != Seed.guardian[Options.DashboardOptions.CurrentCity].type) { t.PaintGuardianSelector(); }

			if (Options.DashboardOptions.RefreshSeed && ((SecondLooper % RefreshSeedInterval) == 1) && !RefreshingSeed) {
				setTimeout(function() {RefreshSeed();},250);
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	ToggleSanctuary : function () {
		var t = Dashboard;
		Options.DashboardOptions.ExpandSanctuary = !Options.DashboardOptions.ExpandSanctuary;
		saveOptions();
		t.ShowHideSanctuary();
	},

	ShowHideSanctuary : function () {
		var t = Dashboard;
		var a = ById('btShowHideSanct');
		if (Options.DashboardOptions.ExpandSanctuary) {
			disp = '';
			if (a) a.innerHTML = tx('hide');
		}else{
			disp = 'none';
			if (a) a.innerHTML = tx('show');
		}
		ById('btsanctroops').style.display = disp;
		if (ById('btsanctroopstitle')) ById('btsanctroopstitle').style.display = disp;
	},

	SetAlliArcanaDesc : function () {
		var t = Dashboard;
		ById('btAlliArcanaDesc').innerHTML = '';
		var Arc = parseIntNan(ById('btAlliArcanaSel').value);
		if (Arc != 0) {
			ById('btAlliArcanaDesc').innerHTML = uW.itemlist["i"+Arc].description;
		}
	},

	SetPersArcanaDesc : function () {
		var t = Dashboard;
		ById('btPersArcanaDesc').innerHTML = '';
		var Arc = parseIntNan(ById('btPersArcanaSel').value);
		if (Arc != 0) {
			ById('btPersArcanaDesc').innerHTML = uW.itemlist["i"+Arc].description;
		}
	},

	ArcanaHint : function (elem,itemType,timeType) {
		var t = Dashboard;
		if (itemType == 'a') { var Arc = ById('btAlliArcanaSel').value; }
		else { var Arc = ById('btPersArcanaSel').value; }

		if (Arc!=0) {
			var TT = '<div align=center><b>'+tx('Cost')+'</b></div><div align=left>';
			var Cost = ArcaneRequirements[Arc][itemType+"_"+timeType].cost;
			if (Cost) {
				for (var r in Cost) {
					if (itemType=="p") { // arcane tablets only I think!
						if (r=='43000') {
							var resspan = '<span>';
							if (parseIntNan(Cost[r])>parseIntNan(Seed.items.i43000)) { resspan = '<span class=boldRed>'; }
							TT += ResourceImage(ArcaneTabletImage,uW.g_js_strings.playerGuide.ahq_14_h)+' '+resspan+addCommas(Cost[r])+'</span><br>';
						}
					}
					else {
						var restype = ArcaneResources[r];
						var resicon = ArcaneResourceImages[r];

						var resspan = '<span>';
						TT += ResourceImage(resicon,'')+' '+resspan+addCommas(Cost[r])+'</span><br>';
					}
				}
			}
			else {
				TT += tx('Unknown');
			}
			TT += '</div>'
			if (itemType=="p") { TT += '<div align=center><b>'+tx('Owned')+'</b></div><div align=left>'+ResourceImage(ArcaneTabletImage,uW.g_js_strings.playerGuide.ahq_14_h)+' '+addCommas(parseIntNan(Seed.items.i43000))+'<br></div>'; }
			jQuery(elem.parentNode).children("span").remove();
			jQuery(elem.parentNode).append('<span class="tooltip" style="margin-top:20px;right:0px;margin-left:-130px;white-space: pre-line; word-wrap: break-word;">'+TT+'</span>');
		}
	},

	ArcanaHintOff : function (elem) {
		jQuery(elem.parentNode).children("span").remove();
	},

	GetArcanaEffect : function (item,citynum) {
		var res = 0;
		if (ArcanaEnabled()) {
			if (Seed.activeBuffs && Seed.activeBuffs[item] && ArcaneRequirements[item]) {
				var arc = Seed.activeBuffs[item];
				var eff = ArcaneRequirements[item].effects;
				var alliance = 0;
				var personal = 0;
				var now = unixTime();
				var HQDist = distance(Seed.cities[citynum][2], Seed.cities[citynum][3], Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord);
				var AuraDist = parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance);
				var time1 = arc.a_24h?arc.a_24h:0;
				var time2 = arc.a_7d?arc.a_7d:0;
				if (time1 > now || time2 > now) {
					if (HQDist<=AuraDist) {
						for (var k in eff.inAura) { alliance = eff.inAura[k]; break; }
					}
					else {
						for (var k in eff.outAura) { alliance = eff.outAura[k]; break; }
					}
				}
				var time1 = arc.p_24h?arc.p_24h:0;
				var time2 = arc.p_7d?arc.p_7d:0;
				if (time1 > now || time2 > now) {
					for (var k in eff.personal) { personal = eff.personal[k]; break; }
				}
				if (alliance!=0 && item!=42015) { personal=personal/2; }
				res = alliance+personal;
			}
		}
		return res;
	},

	setArcanaMessage : function (msg) {
		var t = Dashboard;
		ById('btArcanaErr').innerHTML = msg;
	},

	ActivateArcana : function (itemId,itemType,timeType) {
		var t = Dashboard;
		t.setArcanaMessage(tx('Sending Request')+'...');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.itemId = itemId;
		params.itemType = itemType;
		params.timeType = timeType;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqTempleActivateBuff.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var j = CM.AHQTempleModel.buffActivated(uWCloneInto(rslt.activatedBuff));
					OpenTemple(function(rslt) { Tabs.Alliance.SetBoosts(rslt);Dashboard.setArcanaMessage('');Dashboard.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]); }); // refresh seed from server
				}
				else { // error handling
					if (rslt.error_code) { t.setArcanaMessage('<span style="color:#f00">'+uW.g_js_strings.errorcode["err_"+rslt.error_code]+'</span>'); }
					else { t.setArcanaMessage('<span style="color:#f00">'+tx('Error activating arcana')+'</span>'); }
				}
			},
			onFailure: function () { // error handling
				t.setArcanaMessage('<span style="color:#f00">'+tx('Server connection failed')+'.</span>');
			}
		},true); //no retry

	},

	DeactivateArcana : function (itemId,itemType,timeType) {
		var t = Dashboard;
		t.setArcanaMessage(tx('Sending Request')+'...');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.itemId = itemId;
		params.itemType = itemType;
		params.timeType = timeType;
		params.deactivate = 1;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqTempleActivateBuff.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var j = CM.AHQTempleModel.buffDeActivated(uWCloneInto(rslt.activatedBuff));
					OpenTemple(function(rslt) { Tabs.Alliance.SetBoosts(rslt);Dashboard.setArcanaMessage('');Dashboard.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]); }); // refresh seed from server
				}
				else { // error handling
					if (rslt.error_code) { t.setArcanaMessage('<span style="color:#f00">'+uW.g_js_strings.errorcode["err_"+rslt.error_code]+'</span>'); }
					else { t.setArcanaMessage('<span style="color:#f00">'+tx('Error Deactivating arcana')+'</span>'); }
				}
			},
			onFailure: function () { // error handling
				t.setArcanaMessage('<span style="color:#f00">'+tx('Server connection failed')+'.</span>');
			}
		},true); //no retry

	},

	SetSpeedBoostDesc : function () {
		var t = Dashboard;
		ById('btBoostSpeedDesc').innerHTML = '';
		var buff = parseIntNan(ById('btBoostSpeedSel').value);
		if (buff != 0) {
			ById('btBoostSpeedDesc').innerHTML = uW.itemlist["i"+buff].description;
		}
	},

	SetAccuracyBoostDesc : function () {
		var t = Dashboard;
		ById('btBoostAccuracyDesc').innerHTML = '';
		var buff = parseIntNan(ById('btBoostAccuracySel').value);
		if (buff != 0) {
			ById('btBoostAccuracyDesc').innerHTML = uW.itemlist["i"+buff].description;
		}
	},

	ActivateTroopBoost : function (itemId,label) {
		var t = Dashboard;
		t.setTroopBoostMessage(tx('Sending Request')+'...');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.iid = itemId;
		params.label = label;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/useSpecificTroopBoost.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					CM.InventoryView.removeItemFromInventory(itemId, 1);
					if (rslt.specificTroopBuffInfo) {
						Seed.activeSpecificTroopBuff = rslt.specificTroopBuffInfo.b;
						Seed.isSpecificTroopBuffActive = rslt.specificTroopBuffInfo.a;
						uW.update_boosts();
						t.setTroopBoostMessage('');
						t.SetCurrentCity(Seed.cities[t.Curr][0],true);
					}
				} else {
					var errorMsg = "Unknown Error";
					if (rslt.error_code == 3102) {
						errorMsg = uW.g_js_strings.errorcode.err_3102
					} else {
						if (rslt.error_code == 3333) {
							errorMsg = "This item cannot be used."
						} else {
							if (rslt.error_code == 4444) {
								errorMsg = "You do not have the item in your inventory."
							} else {
								errorMsg = "Unknown Error"
							}
						}
					}
					t.setTroopBoostMessage(errorMsg);
				}
			}
		},true); //no retry

	},

	setTroopBoostMessage : function (msg) {
		var t = Dashboard;
		ById('btBoostErr').innerHTML = msg;
	},

	PaintQuickSac : function () {
		var t = Dashboard;
		if (!ById('btQuickSac')) { return; }
		if ((Options.DashboardOptions.QuickSacrifice == true) && (t.allownewsacs == true))
			t.ShowQuickSac(true);
		else
			t.ShowQuickSac(false);
	},

	ShowQuickSac : function (tf) {
		var t = Dashboard;
		var dc = jQuery('#btQuickSac').attr('class');
		if (tf) {if (dc.indexOf('divHide') >= 0) jQuery('#btQuickSac').attr('class','');}
		else {if (dc.indexOf('divHide') < 0) jQuery('#btQuickSac').attr('class','divHide');}
	},

	ShowNewSacrifice : function (tf) {
		var t = Dashboard;
		var dc = jQuery('#btNewSacrificeCell').attr('class');
		if (tf) {if (dc.indexOf('divHide') >= 0) jQuery('#btNewSacrificeCell').attr('class','');}
		else {if (dc.indexOf('divHide') < 0) jQuery('#btNewSacrificeCell').attr('class','divHide');}
	},

	SelectTroopType : function (sel) {
		var t = Dashboard;
		if ((sel.value == 0) || (sel.value == "")) {
			ById('btTotalTroops').innerHTML = "";
			ById('btMaxTroops').innerHTML = "";
			t.TotalTroops = 0;
			return false
		} else {
			if (SelectiveDefending) { t.TotalTroops = parseIntNan(Seed.units['city' + Seed.cities[Options.DashboardOptions.CurrentCity][0]]['unt'+sel.value])+parseIntNan(Seed.defunits['city' + Seed.cities[Options.DashboardOptions.CurrentCity][0]]['unt'+sel.value]); }
			else { t.TotalTroops = parseIntNan(Seed.units['city' + Seed.cities[Options.DashboardOptions.CurrentCity][0]]['unt'+sel.value]); }
			ById('btTotalTroops').innerHTML = '&nbsp;/&nbsp;'+addCommas(t.TotalTroops);
			ById('btMaxTroops').innerHTML = '<a id="btMaxButton" onclick="btSetMaxTroops()"><span style="font-size:9px;" align="center">max</span></a>';
			// set default sac length if blank
			if (Options.DashboardOptions.DefaultSacrifice) {
				var elemin = ById('btRitualMinutes');
				var elesec = ById('btRitualSeconds');
				if ((elemin.value == "") && (elesec.value == "")) {
					elemin.value = Options.DashboardOptions.DefaultSacrificeMin;
					elesec.value = Options.DashboardOptions.DefaultSacrificeSec;
					t.SetRitualLength(elesec);
				}
			}
			var elem = ById('btRitualAmount');
			if (parseInt(elem.value) > t.TotalTroops) {
				elem.value = t.TotalTroops;
				t.SetRitualLength(elem);
			}
		}
	},

	SetMaxTroops : function () {
		var t = Dashboard;
		var elem = ById('btRitualAmount');
		elem.value = t.SacSettings.max_amount;
		if (elem.value > t.TotalTroops) {elem.value = t.TotalTroops;}
		if ((elem.value > Options.DashboardOptions.SacrificeLimit) && (parseIntNan(Options.DashboardOptions.SacrificeLimit) > 0)) {elem.value = Options.DashboardOptions.SacrificeLimit;}
		t.SetRitualLength(elem);
	},

	SetRitualLength : function (sel) {
		var t = Dashboard;
		sel.value = parseInt(sel.value);
		if (isNaN(sel.value)) sel.value = 0;

		var trp, min, sec;

		if (sel.id == 'btRitualMinutes') {
			min = parseIntNan(sel.value);

			if (isNaN(ById('btRitualSeconds').value)) sec = 0;
			else sec = parseIntNan(ById('btRitualSeconds').value);

			trp = Math.round((parseIntNan(min * 60) + sec) * (t.SacSpeed / t.SacSpeedBuff)); // troops
		}

		if (sel.id == 'btRitualSeconds') {
			sec = parseIntNan(sel.value);

			if (isNaN(ById('btRitualMinutes').value)) min = 0;
			else min = parseIntNan(ById('btRitualMinutes').value);

			min += (parseIntNan( sec / 60 ));
			sec = sec % 60;

			trp = Math.round(((min * 60)+sec) * (t.SacSpeed / t.SacSpeedBuff)); // troops
		}

		if (sel.id == 'btRitualAmount') {
			trp = parseIntNan(sel.value);
		}

		if (trp > t.TotalTroops) {trp = t.TotalTroops;}
		if (trp > parseInt(t.SacSettings.max_amount)) {trp = t.SacSettings.max_amount;}
		if ((trp > Options.DashboardOptions.SacrificeLimit) && (parseIntNan(Options.DashboardOptions.SacrificeLimit) > 0)) {trp = Options.DashboardOptions.SacrificeLimit;}

		sec = parseIntNan(trp / (t.SacSpeed / t.SacSpeedBuff), 10); // seconds
		min = parseIntNan( sec / 60 );
		sec = sec % 60;

		ById('btRitualAmount').value = BlankifZero(trp);
		ById('btRitualMinutes').value = BlankifZero(min);
		ById('btRitualSeconds').value = BlankifZero(sec);
	},

	setTroopMessage : function (msg) {
		var t = Dashboard;
		ById('btTroopMsg').innerHTML = msg;
	},

	ToggleDefenceMode : function (cityId) {
		var t = Dashboard;
		if (!SelectiveDefending) return;
		jQuery('#btCityStatus').addClass("disabled");
		jQuery('#btCityStatus2').addClass("disabled");
		ResetHTMLRegister('DASH','btStatusCell');
		t.serverwait = true;

		var state = 1;
		if (Seed.citystats["city" + cityId].gate != 0)
			state = 0;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.state = state;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/gate.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				t.serverwait = false;
				if (rslt.ok) {
					Seed.citystats["city" + cityId].gate = state;
					if (t.CurrentCityId==cityId) {t.PaintCityInfo(cityId);}
				}
				jQuery('#btCityStatus').removeClass("disabled");
				jQuery('#btCityStatus2').removeClass("disabled");
			},
			onFailure: function () { t.serverwait = false; jQuery('#btCityStatus').removeClass("disabled"); jQuery('#btCityStatus2').removeClass("disabled"); }
		});
	},

	SelectDefenders : function (sel,def) {
		var t = Dashboard;
		if (!SelectiveDefending) return;
		var MoveArray = [];
		if (!def) { // switch to sanctuary
			if (sel == "A") { // All
				for (var ui in CM.UNIT_TYPES){
					var i = CM.UNIT_TYPES[ui];
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "I") { // Infantry
				for(c=0; c<Infantry.length; c++){
					var i = parseInt(Infantry[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "R") { // Ranged
				for(c=0; c<Ranged.length; c++){
					var i = parseInt(Ranged[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "H") { // Horsed
				for(c=0; c<Horsed.length; c++){
					var i = parseInt(Horsed[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "S") { // Siege
				for(c=0; c<Siege.length; c++){
					var i = parseInt(Siege[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "P") { // SpellCaster
				for(c=0; c<SpellCaster.length; c++){
					var i = parseInt(SpellCaster[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (parseIntNan(sel) != 0) { // Troop Identifier
				MoveArray[sel] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt'+sel]);
			}
		}
		else { // switch to defend
			if (sel == "A") { // All
				for (var ui in CM.UNIT_TYPES){
					i = CM.UNIT_TYPES[ui];
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "I") { // Infantry
				for(c=0; c<Infantry.length; c++){
					var i = parseInt(Infantry[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "R") { // Ranged
				for(c=0; c<Ranged.length; c++){
					var i = parseInt(Ranged[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "H") { // Horsed
				for(c=0; c<Horsed.length; c++){
					var i = parseInt(Horsed[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "S") { // Siege
				for(c=0; c<Siege.length; c++){
					var i = parseInt(Siege[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (sel == "P") { // SpellCaster
				for(c=0; c<SpellCaster.length; c++){
					var i = parseInt(SpellCaster[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt'+i]);
				}
			}
			if (parseIntNan(sel) != 0) { // Troop Identifier
				MoveArray[sel] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt'+sel]);
			}
		}
		t.ChangeDefendingTroops (t.CurrentCityId, MoveArray, false);
	},

	ChangeDefendingTroops : function (cityId, MoveArray, Replace, notify) {
		var t = Dashboard;
		t.setTroopMessage(tx('Sending Request')+'...');
		var params = uW.Object.clone(uW.g_ajaxparams)
		params.cid = cityId;
		for (var ui in CM.UNIT_TYPES){
			i = CM.UNIT_TYPES[ui];
			if (Replace) { params["u"+i] = parseIntNan(MoveArray[i]); }
			else { params["u"+i] = parseIntNan(Seed.defunits['city' + cityId]['unt'+i]) + parseIntNan(MoveArray[i]); }
		}

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/cityDefenseSet.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var unitsarr = [];
					for (var j in uW.unitcost)
						unitsarr.push(0);
					for (var i = 0; i <= unitsarr.length; i++)
						if (params["u"+i])
							unitsarr[i] = params["u"+i];
					if (rslt.def != null) {
						var unitlist = uW.seed.defunits["city" + cityId];
						jQuery.each (rslt.def, function (key, val) {
							var key1 = key.replace ("u", "unt");
							unitlist[key1] = val
						})
					}
					if (rslt.res != null) {
						var unitlist = uW.seed.units["city" + cityId];
						jQuery.each (rslt.res, function(key, val) {
							var key1 = key.replace("u", "unt");
							unitlist[key1] = val
						})
					}
					t.setTroopMessage('&nbsp;');
					t.SelectDefTroopType (ById("btDefendTroops"));
					if (notify != null) { notify();}
					else {
						if (cityId==t.CurrentCityId) {
							t.PaintCityInfo(cityId);
						}
					}
				}
				else { // error handling
					if (rslt.msg) { t.setTroopMessage('<span style="color:#f00">'+rslt.msg+'</span>'); }
					else { t.setTroopMessage('<span style="color:#f00">'+tx('Error setting defending troops')+'</span>'); }
				}
				jQuery('#btAddDefendButton').removeClass("disabled");
				jQuery('#btAddPresetButton').removeClass("disabled");
				jQuery('#btReplacePresetButton').removeClass("disabled");
			},
			onFailure: function () { // error handling
				t.setTroopMessage('<span style="color:#f00">Server connection failed.</span>');
				jQuery('#btAddDefendButton').removeClass("disabled");
				jQuery('#btAddPresetButton').removeClass("disabled");
				jQuery('#btReplacePresetButton').removeClass("disabled");
			}
		},true); //no retry
	},

	SelectDefTroopType : function (sel) {
		var t = Dashboard;
		if ((sel.value == 0) || (sel.value == "")) {
			ById('btTotalDefTroops').innerHTML = "";
			ById('btMaxDefTroops').innerHTML = "";
			t.TotalSanctuaryTroops = 0;
			return false
		} else {
			t.TotalSanctuaryTroops = parseIntNan(Seed.units['city' + Seed.cities[Options.DashboardOptions.CurrentCity][0]]['unt'+sel.value]);
			ById('btTotalDefTroops').innerHTML = '&nbsp;/&nbsp;'+addCommas(t.TotalSanctuaryTroops);
			ById('btMaxDefTroops').innerHTML = '<a id="btMaxDefButton" onclick="btSetMaxDefTroops()"><span style="font-size:9px;" align="center">max</span></a>';
			// set default defender amount
			var elem = ById('btDefendAmount');
			if ((elem.value == 0) || (elem.value == "")) { elem.value = Options.DashboardOptions.DefaultDefenceNum; }
			if (parseInt(elem.value) > t.TotalSanctuaryTroops) {
				elem.value = t.TotalSanctuaryTroops;
			}
		}
	},

	SetMaxDefTroops : function () {
		var t = Dashboard;
		var elem = ById('btDefendAmount');
		elem.value = t.TotalSanctuaryTroops;
	},

	AddDefenders : function () {
		var t = Dashboard;
		var MoveArray = [];
		var TT = ById('btDefendTroops');
		var AM = ById('btDefendAmount');

		if (!TT.value || (TT.value == 0)) {t.setTroopMessage('<span style="color:#f00">'+tx('Please select troop type')+'</span>');return;}
		if (!AM.value || (AM.value == 0)) {t.setTroopMessage('<span style="color:#f00">'+tx('Please enter a number of troops')+'</span>');return;}
		if (AM.value > t.TotalSanctuaryTroops) {t.setTroopMessage('<span style="color:#f00">'+tx('You do not have enough troops')+'</span>');return;}

		jQuery('#btAddDefendButton').addClass("disabled");

		MoveArray[TT.value] = AM.value;
		t.ChangeDefendingTroops (t.CurrentCityId, MoveArray, false);
	},

	NewDefPreset : function () {
		var t = Dashboard;
		if (t.ExpandDefPreset) return;
		ById('btDefendPreset').value = 0;
		/* Initialise Edit fields */

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			ById('btPresetTroop'+i).value = "";
		}
		ById('btDefPresetName').value = 'Defensive Preset #'+t.NextPresetNumber;

		t.ExpandDefPreset = true;
		jQuery('#btNewDefPreset').addClass("disabled");
		jQuery('#btChgDefPreset').addClass("disabled");
		jQuery('#btDelDefPreset').addClass("disabled");
		jQuery('#DefEditPresetRow').removeClass("divHide");
	},

	ChgDefPreset : function () {
		var t = Dashboard;
		if (t.ExpandDefPreset) return;

		var PN = ById('btDefendPreset');
		if (!PN.value || (PN.value == 0) || (PN.value.substr(0,1) == 'T')) {return;}

		/* Load preset details into edit fields */

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Options.DashboardOptions.DefPresets[PN.value][i]) { ById('btPresetTroop'+i).value = Options.DashboardOptions.DefPresets[PN.value][i]; }
			else { ById('btPresetTroop'+i).value = ""; }
		}
		ById('btDefPresetName').value = Options.DashboardOptions.DefPresets[PN.value][0];

		t.ExpandDefPreset = true;
		jQuery('#btNewDefPreset').addClass("disabled");
		jQuery('#btChgDefPreset').addClass("disabled");
		jQuery('#btDelDefPreset').removeClass("disabled");
		jQuery('#DefEditPresetRow').removeClass("divHide");
	},

	SetCurrentPreset : function () {
		var t = Dashboard;
		/* Initialise Edit fields to current values */

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Seed.defunits["city" + t.CurrentCityId]['unt'+i] && (!isNaN(Seed.defunits["city" + t.CurrentCityId]['unt'+i])) && (parseIntNan(Seed.defunits["city" + t.CurrentCityId]['unt'+i]) != 0)) {
				ById('btPresetTroop'+i).value = Seed.defunits["city" + t.CurrentCityId]['unt'+i];
			}
			else {
				ById('btPresetTroop'+i).value = "";
			}
		}
	},

	SaveDefPreset : function () {
		var t = Dashboard;
		var PN = ById('btDefendPreset');
		if (PN.value.substr(0,1) == 'T') return;
		if (!PN.value || (PN.value == 0)) { SavePN = t.NextPresetNumber; }
		else { SavePN = PN.value; }

		Options.DashboardOptions.DefPresets[SavePN]={};
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			TroopVal = ById('btPresetTroop'+i).value;
			if (!isNaN(TroopVal) && (TroopVal != "")) {
				Options.DashboardOptions.DefPresets[SavePN][i] = TroopVal;
			}
		}

		Options.DashboardOptions.DefPresets[SavePN][0] = ById('btDefPresetName').value;
		saveOptions();
		t.ExpandDefPreset = false;
		t.InitPresetNumber = SavePN;
		t.SetCurrentCity(Seed.cities[t.Curr][0],true);
	},

	CancelDefPreset : function () {
		var t = Dashboard;
		jQuery('#btNewDefPreset').removeClass("disabled");
		var PN = ById('btDefendPreset');
		if (PN.value && (PN.value != 0)) { jQuery('#btChgDefPreset').removeClass("disabled"); }
		jQuery('#DefEditPresetRow').addClass("divHide");
		t.ExpandDefPreset = false;
	},

	DelDefPreset : function () {
		var t = Dashboard;
		var PN = ById('btDefendPreset');
		if (!PN.value || (PN.value == 0) || (PN.value.substr(0,1) == 'T')) return;

		Options.DashboardOptions.DefPresets[PN.value]={};
		delete Options.DashboardOptions.DefPresets[PN.value];
		saveOptions();
		t.ExpandDefPreset = false;
		t.SetCurrentCity(Seed.cities[t.Curr][0],true);
	},

	SelectDefPreset : function (sel) {
		var t = Dashboard;
		t.CancelDefPreset();

		if ((sel.value == 0) || (sel.value == "") || (sel.value.substr(0,1) == 'T')) {
			jQuery('#btChgDefPreset').addClass("disabled");
			return false
		} else {
			jQuery('#btChgDefPreset').removeClass("disabled");
		}
		t.InitPresetNumber = sel.value;
	},

	SetPresetDefenders : function (Replace) {
		var t = Dashboard;
		t.CancelDefPreset();
		var MoveArray = [];
		var PN = ById('btDefendPreset');
		if (!PN.value || (PN.value == 0)) {t.setTroopMessage('<span style="color:#f00">'+tx('Please select a defensive preset')+'</span>');return;}

		jQuery('#btAddPresetButton').addClass("disabled");
		jQuery('#btReplacePresetButton').addClass("disabled");

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Options.DashboardOptions.DefPresets[PN.value][i]) {
				MoveArray[i] = Options.DashboardOptions.DefPresets[PN.value][i];
			}
		}
		t.ChangeDefendingTroops (t.CurrentCityId, MoveArray, Replace);
	},

	StoreDefendingTroops : function (CityId) {
		var t = Dashboard;
		t.StoreArray[cityId] = [];

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			t.StoreArray[cityId][i] = parseIntNan(Seed.defunits['city' + CityId]['unt'+i]);
		}
	},

	ResetDefendingTroops : function (CityId) {
		var t = Dashboard;
		t.ChangeDefendingTroops (CityId, t.StoreArray[cityId], true);
	},

	SendHome : function (marchId) {
		var t = Dashboard;
		t.setReinError('&nbsp;');
		jQuery('#btSendHome'+marchId).addClass("disabled");
		ResetHTMLRegister('DASH','btReinforceCell')
		var march = {};
		march = Seed.queue_atkinc['m'+ marchId];
		if (!march) { return; }
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.mid = marchId;
		params.cid = march.toCityId;
		params.fromUid = march.fromPlayerId;
		params.fromCid = march.fromCityId;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/kickoutReinforcements.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok){
					var upkeep = 0;
					for (var ui in CM.UNIT_TYPES){
						i = CM.UNIT_TYPES[ui];
						upkeep += parseInt(march["unit" + i + "Return"]) * parseInt(uW.unitupkeeps[i])
					}
					uW.seed.resources["city"+ march.toCityId].rec1[3] -= upkeep;
					if (parseInt(march.fromPlayerId) == parseInt(uW.tvuid)) {
						var mymarch = uW.seed.queue_atkp["city" + march.fromCityId]["m" + marchId];
						var marchtime = Math.abs(parseInt(mymarch.destinationUnixTime) - parseInt(mymarch.eventUnixTime));
						mymarch.returnUnixTime = unixTime() + marchtime;
						mymarch.marchStatus = 8;
					}
					delete uW.seed.queue_atkinc["m" + marchId];
				} else {
					t.setReinError(rslt.errorMsg);
				}
			},
			onFailure: function () { t.setReinError('AJAX Error'); },
		});
	},

	setReinError : function (msg) {
		var t = Dashboard;
		ById('btReinErr').innerHTML = msg;
	},

	QuickSacrifice : function (tt) {
		var t = Dashboard;
		var sel = ById('btRitualTroops');
		if (!sel) return;
		sel.value = tt;
		t.SelectTroopType(sel);
		t.StartRitual(true);
	},

	StartRitual : function (QS) {
		var t = Dashboard;
		t.setSacError('&nbsp;');
		var unitid = parseInt(ById('btRitualTroops').value);
		var numUnits = parseInt(ById('btRitualAmount').value);

		if (!unitid || (unitid == 0)) {t.setSacError(tx('Please select troop type'));return;}
		if (!numUnits || (numUnits == 0)) {t.setSacError(tx('Please enter a number of troops'));return;}
		if (numUnits > t.TotalTroops) {t.setSacError(tx('You do not have enough troops'));return;}

		jQuery('#btStartRitualButton').addClass("disabled");

		// see if we need to claw back units from defending units

		var clawback = uW.seed.units["city" + t.CurrentCityId]['unt'+unitid] - numUnits;
		if (clawback < 0) {
			var MoveArray = [];
			MoveArray[unitid] = clawback;
			t.ChangeDefendingTroops (t.CurrentCityId, MoveArray, false, function () { t.StartRitual(QS); });
			return;
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = t.CurrentCityId;
		params.type = unitid;
		params.quant = numUnits;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/sacrifice.php" + uW.g_ajaxsuffix, {
			method : "post",
			parameters : params,
			onSuccess : function (rslt) {
				if (rslt.ok) {
					uW.seed.queue_sacr["city" + t.CurrentCityId].push(uWCloneInto(rslt.queue_sacr));
					uW.seed.units["city" + t.CurrentCityId] = uWCloneInto(rslt.units);
					uW.seed.cityData.city[t.CurrentCityId].population = rslt.cityData_city.population;
					uW.seed.cityData.city[t.CurrentCityId].populationCap = rslt.cityData_city.populationCap;

					t.setSacError('&nbsp;');
					ById('btRitualTroops').value = 0;
					ById('btTotalTroops').innerHTML = "";
					ById('btMaxTroops').innerHTML = "";
					if (!QS) {
						ById('btRitualAmount').value = "";
						ById('btRitualMinutes').value = "";
						ById('btRitualSeconds').value = "";
					}
				} else {
					t.setSacError(rslt.feedback);
				}
				jQuery('#btStartRitualButton').removeClass("disabled");
			},
			onFailure: function () {
				t.setSacError('AJAX Error');
				jQuery('#btStartRitualButton').removeClass("disabled");
			}
		});
	},

	setSacError : function (msg) {
		var t = Dashboard;
		ById('btSacErr').innerHTML = msg;
	},

	StopRitual : function (sacNo, notify){
		var t = Dashboard;
		jQuery('#btStopRitual'+sacNo).addClass("disabled");
		ResetHTMLRegister('DASH','btSacrificeCell');
		var queue = uW.seed.queue_sacr["city" + t.CurrentCityId][sacNo];
		var params = uW.Object.clone(uW.g_ajaxparams);
		var cityId = t.CurrentCityId;
		params.cid = cityId;
		params.type = queue.unitType;
		params.quant = queue.quantity;
		params.start = queue.start;
		params.eta = queue.eta;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/cancelSacrificing.php" + uW.g_ajaxsuffix, {
			method : "post",
			parameters : params,
			onSuccess : function (rslt) {
				if (rslt.ok) {
					uW.seed.queue_sacr["city" + t.CurrentCityId].splice(sacNo, 1);
					if (t.CurrentCityId==cityId) {t.PaintCityInfo(cityId);}
				}
				jQuery('#btStopRitual'+sacNo).removeClass("disabled");
			},
			onFailure: function () {
				if (notify != null)
					notify('AJAX Error');
				jQuery('#btStopRitual'+sacNo).removeClass("disabled");
			},
		});
	},

	SwitchGuardianResult : function(cityId,type,ok,summonFinishTime) {
		var t = Dashboard;
		// need to delay 8 seconds before allowing again
		if (ok) {
			t.GuardDelay = 8;
			t.PaintGuardianSelector();
		}
		else {
			t.GuardDelay = 0;
			t.PaintGuardianSelector();
			t.setGuardMessage('<span style="color:#f00">'+tx('Could not change Guardian')+'.</span>');
		}
	},

	SwitchGuardian : function (elem) {
		var t = Dashboard;

		var type = guardTypes[elem.id.substr(9)-1];
		if (type == t.CurrGuardian) { return; }

		var level = Seed.guardian[Options.DashboardOptions.CurrentCity].cityGuardianLevels[type];
		level = level ? level : 0;
		if (level == 0) { return; }

		t.GuardDelay = 999;
		t.setGuardMessage(tx('Sending Request')+'...');

		SwitchGuardian(uW.currentcityid,type,t.SwitchGuardianResult);
	},

	SwitchThroneRoom : function (elem) {
		var t = Dashboard;
		var NewPreset = parseIntNan(elem.id.substr(6));
		if (NewPreset == Seed.throne.activeSlot) { return; }

		t.ThroneDelay = 999;
		t.setThroneMessage(tx('Sending Request')+'...');

		SwitchThroneRoom(NewPreset,true);
	},

	PaintTRPresets : function () {
		if (uW.isNewServer()) { return; }
		var t = Dashboard;
		var fontratio = Options.MonitorOptions.MonitorFontSize / 11;
		if (!(ById('btTRWidget')) && !(ById('btTRPresets')) && !(ById('btMonTRPresets')) && !(ById('trpresetopt1'))) { return; }
		if (t.ThroneDelay > 10) { return; }
		if ((ById('btTRPresets')) && !Options.DashboardOptions.TRPresetChange) { ById('btTRPresets').innerHTML = ""; }
		if ((ById('btMonTRPresets')) && !Options.MonitorOptions.MonPresetChange) { ById('btMonTRPresets').innerHTML = ""; }
		if ((ById('btTRWidget')) && !Options.TRWidget) { ById('btTRWidget').innerHTML = ""; }

		var m = '<div class="xtab" style="opacity:0.6; align="center" id=btThroneMsg>&nbsp;</div><TABLE cellspacing=0 cellpadding=0 style="padding-bottom: 10px;" align=center><TR>';
		var n = '<div class="xtab" style="opacity:0.6;font-size:'+Options.MonitorOptions.MonitorFontSize+'px;" align="center" id=btMonThroneMsg>&nbsp;</div><TABLE cellspacing=0 cellpadding=0 style="padding-bottom: 10px;" align=center><TR>';
		var o = '<TABLE cellspacing=0 cellpadding=0 style="padding-bottom: 10px;" align=center><TR>';

		if (Options.DashboardOptions.TRPresetByName) { m+='<td class="xtabBR" align=center>'; }
		if (Options.MonitorOptions.TRMonPresetByName) { n+='<td class="xtabBR" align=center>'; }

		var numrows = Math.ceil(Seed.throne.slotNum/16);
		var perrow = Math.ceil(Seed.throne.slotNum/numrows);
		var nummonrows = Math.ceil(Seed.throne.slotNum/12);
		var permonrow = Math.ceil(Seed.throne.slotNum/nummonrows);

		if (Options.TRFixPresetWidth) {
			perrow = 8;
			permonrow = 8;
		}

		for (var i=1;i<=Seed.throne.slotNum;i++) {
			if (Options.DashboardOptions.TRPresetByName) {
				m+='<div id="trpresetcell'+i+'" class="xtabBR trimg" style="display:inline-block"><a class="inlineButton btButton brown11" id="trlink'+i+'"><span style="width:85px;font-size:10px;" id="trpreset'+i+'"><center>'+(Options.DashboardOptions.TRPresets[i]?Options.DashboardOptions.TRPresets[i].name:'Preset '+i)+'</center></span></a></div> ';
			}
			else {
				if ((i % perrow)==1) {
					m+='</tr><TR>';
				}
				m+='<TD id="trpresetcell'+i+'" class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;" id="trlink'+i+'"><div id="trpreset'+i+'" class="presetBut presetButNon"><center>'+i+'</center></div></a></td>';
			}
			if (Options.MonitorOptions.TRMonPresetByName) {
				n+='<div id="tmpresetcell'+i+'" class="xtabBR trimg" style="display:inline-block"><a class="inlineButton btButton brown11" id="tmlink'+i+'"><span style="width:'+Math.floor(85*fontratio)+'px;font-size:'+(Options.MonitorFontSize<10?Options.MonitorFontSize:10)+'px;" id="tmpreset'+i+'"><center>'+(Options.DashboardOptions.TRPresets[i]?Options.DashboardOptions.TRPresets[i].name:'Preset '+i)+'</center></span></a></div> ';
			}
			else {
				if ((i % permonrow)==1) {
					n+='</tr><TR>';
				}
				n+='<TD id="tmpresetcell'+i+'" class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;" id="tmlink'+i+'"><div id="tmpreset'+i+'" class="presetBut presetButNon"><center>'+i+'</center></div></a></td>';
			}
			if (((i % perrow)==1 && !Options.ThroneHUD) || (Options.ThroneHUD && i==25)) {
				o+='</tr><TR>';
			}
			o+='<TD id="trwidgetcell'+i+'" class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;" id="twlink'+i+'"><div id="trwidget'+i+'" class="presetBut presetButNon"><center>'+i+'</center></div></a></td>';
		}

		if (Options.TRFixPresetWidth) {
			while ((i % perrow)!=1) {
				if (!Options.DashboardOptions.TRPresetByName) {
					m+='<TD class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;"><div class="presetBut presetButLck"></div></a></td>';
				}
				if (!Options.MonitorOptions.TRMonPresetByName) {
					n+='<TD class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;"><div class="presetBut presetButLck"></div></a></td>';
				}
				o+='<TD class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;"><div class="presetBut presetButLck"></div></a></td>';
				i++;
			}
		}

		if (Options.DashboardOptions.TRPresetByName) { m+='</td>'; }
		if (Options.MonitorOptions.TRMonPresetByName) { n+='</td>'; }
		m += '</tr></table>';
		n += '</tr></table>';
		o += '</tr></table>';
		if ((ById('btTRPresets')) && Options.DashboardOptions.TRPresetChange) { ById('btTRPresets').innerHTML = m; ResetFrameSize('btDash',100,t.DashWidth); }
		if ((ById('btMonTRPresets')) && Options.MonitorOptions.MonPresetChange) { ById('btMonTRPresets').innerHTML = n; ResetFrameSize('btMonitor',Tabs.Monitor.MonHeight,Tabs.Monitor.MonWidth); }
		if ((ById('btTRWidget')) && Options.TRWidget) { ById('btTRWidget').innerHTML = o; WideScreen.CheckChatPosition(); }

		if (t.ThroneDelay != 0) {	t.setThroneMessage('<span style="color:#080">'+tx('Throne Room changed! Change again in')+' '+t.ThroneDelay+' '+tx('secs')+'...</span>'); }
		else { t.setThroneMessage('&nbsp;'); }

		CurrPreset = Seed.throne.activeSlot;
		for (var i=1;i<=Seed.throne.slotNum;i++) {
			if ((ById('btTRPresets')) && Options.DashboardOptions.TRPresetChange) {
				ById('trlink'+i).addEventListener ('click', function(){t.SwitchThroneRoom(this);},false);
				ById('trpreset'+i).addEventListener ('mouseover', function(){t.BuildTRPresetStats(this.id.substring(8));},false);
			}
			if ((ById('btMonTRPresets')) && Options.MonitorOptions.MonPresetChange) {
				ById('tmlink'+i).addEventListener ('click', function(){t.SwitchThroneRoom(this);},false);
				ById('tmpreset'+i).addEventListener ('mouseover', function(){t.BuildTRPresetStats(this.id.substring(8));},false);
			}
			if ((ById('btTRWidget')) && Options.TRWidget) {
				ById('twlink'+i).addEventListener ('click', function(){t.SwitchThroneRoom(this);},false);
				ById('trwidget'+i).addEventListener ('mouseover', function(){t.BuildTRPresetStats(this.id.substring(8));},false);
			}
			if (ById('trpresetopt1')) {
				ById('trpresetopt'+i).addEventListener ('mouseover', function(){t.BuildTRPresetStats(this.id.substring(11));},false);
			}

			if (i==CurrPreset) {
				if ((ById('btTRPresets')) && Options.DashboardOptions.TRPresetChange) {
					if (Options.DashboardOptions.TRPresetByName) { jQuery("#trlink"+i).removeClass("brown11").addClass("blue11"); }
					else { jQuery("#trpreset"+i).removeClass("presetButNon").addClass("presetButSel"); }
				}
				if ((ById('btMonTRPresets')) && Options.MonitorOptions.MonPresetChange) {
					if (Options.MonitorOptions.TRMonPresetByName) { jQuery("#tmlink"+i).removeClass("brown11").addClass("blue11"); }
					else { jQuery("#tmpreset"+i).removeClass("presetButNon").addClass("presetButSel"); }
				}
				if ((ById('btTRWidget')) && Options.TRWidget) {
					jQuery("#trwidget"+i).removeClass("presetButNon").addClass("presetButSel");
				}
				t.BuildTRPresetStats(i);
			}
		}
	},

	BuildTRPresetStats : function (slot){
		var t = Dashboard;
		var StatEffects = GenerateTRPresetStats(slot);
		var Tiers = GenerateTRPresetTiers(slot);
		var presetname = (Options.DashboardOptions.TRPresets[slot]?Options.DashboardOptions.TRPresets[slot].name:'Preset '+slot);

		if (ById('trpresetopt'+slot)) { createToolTip(presetname,ById('trpresetopt'+slot),StatEffects.slice(),Tiers.slice()); }
		if ((ById('btTRPresets')) && Options.DashboardOptions.TRPresetChange) { createToolTip(presetname,ById('trpresetcell'+slot),StatEffects.slice(),Tiers.slice()); }
		if ((ById('btMonTRPresets')) && Options.MonitorOptions.MonPresetChange) { createToolTip(presetname,ById('tmpresetcell'+slot),StatEffects.slice(),Tiers.slice()); }
		if ((ById('btTRWidget')) && Options.TRWidget) { createToolTip(presetname,ById('trwidgetcell'+slot),StatEffects.slice(),Tiers.slice()); }
	},

	setThroneMessage : function (msg) {
		var t = Dashboard;
		if (ById('btThroneMsg') && Options.DashboardOptions.TRPresetChange) { ById('btThroneMsg').innerHTML = msg; }
		if (ById('btMonThroneMsg') && Options.MonitorOptions.MonPresetChange) { ById('btMonThroneMsg').innerHTML = msg; }
	},

	setGuardMessage : function (msg) {
		var t = Dashboard;
		if (popDash) {ById('btGuardMsg').innerHTML = msg; }
	},

	setChampMessage : function (msg) {
		var t = Dashboard;
		if (popDash && ById('btChampMsg')) {ById('btChampMsg').innerHTML = msg; }
	},

	CancelMarshall : function() {
		var t = Dashboard;
		t.ExpandMarshall = false;
		t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
	},

	ChangeMarshall : function () {
		var t = Dashboard;
		t.ExpandMarshall = true;
		t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
	},

	SetMarshall : function () {
		var t = Dashboard;
		jQuery('#btSetMarshall').addClass("disabled");
		var pos = '13';
		var kid = ById('btKnightList').value;
		if (kid == "") {kid = "0";}
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pos = pos;
		params.kid = kid;
		params.cid = uW.currentcityid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/assignknight.php" + uW.g_ajaxsuffix, {
			method : "post",
			parameters : params,
			onSuccess : function (rslt) {
				jQuery('#btSetMarshall').removeClass("disabled");
				if (rslt.ok) {
					if (kid == 0) {
						uW.seed.leaders["city" + uW.currentcityid].combatKnightId = "0";
					} else {
						uW.seed.leaders["city" + uW.currentcityid].combatKnightId = kid.toString();
						t.ExpandMarshall = false;
						t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
					}
				}
			},
			onFailure : function () { jQuery('#btSetMarshall').removeClass("disabled"); }
		},true); // noretry
	},

	BoostMarshall : function () {
		var t = Dashboard;
		jQuery('#btBoostMarshall').addClass("disabled");
		var item = 'i221';
		var kid = Seed.leaders["city" + uW.currentcityid].combatKnightId;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.iid = item.substring(1);
		params.cid = uW.currentcityid;
		params.kid = kid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/boostKnight.php" + uW.g_ajaxsuffix, {
			method : "post",
			parameters : params,
			onSuccess : function (rslt) {
				jQuery('#btBoostMarshall').removeClass("disabled");
				if (rslt.ok) {
					uW.seed.knights["city" + uW.currentcityid]["knt" + kid].combatBoostExpireUnixtime = rslt.expiration.toString();
					uW.seed.items[item] = parseInt(uW.seed.items[item]) - 1;
					uW.ksoItems[item.substring(1)].subtract();
					CM.MixPanelTracker.track("item_use", {
						item : uW.itemlist[item].name,
						usr_gen : Seed.player.g,
						usr_byr : Seed.player.y,
						usr_ttl : uW.titlenames[Seed.player.title],
						distinct_id : uW.tvuid
					})
					t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
				}
			},
			onFailure : function () { jQuery('#btBoostMarshall').removeClass("disabled"); }
		},true); // noretry
	},

	CancelChampion : function () {
		var t = Dashboard;
		t.ExpandChampion = false;
		t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
	},

	ChangeChampion : function () {
		var t = Dashboard;
		t.ExpandChampion = true;
		t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
	},

	FreeChampion : function (champId,ButtonClick) {
		var t = Dashboard;
		t.setChampMessage(tx('Sending Request')+'...');
		if (ButtonClick) jQuery('#btFreeChampion').addClass("disabled");
		t.AssignChampion(champId, 0);
	},

	SetChampion : function (champId,ButtonClick) {
		var t = Dashboard;
		t.setChampMessage(tx('Sending Request')+'...');
		if (ButtonClick) jQuery('#btSetChampion'+champId).addClass("disabled");
		t.AssignChampion(champId, uW.currentcityid);
	},

	AssignChampionResult : function(rslt) {
		var t = Dashboard;
		if (rslt.ok) { t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]); }
		else { t.setChampMessage(tx('Error Assigning Champion')+'!'); }
	},

	AssignChampion : function (champId,cityId) {
		var t = Dashboard;
		SwitchChampion(cityId,champId,t.AssignChampionResult);
	},

	PaintChampionSelector : function (cityId) {
		var t = Dashboard;
		if (!popDash) { return; }
		var Curr = Options.DashboardOptions.CurrentCity;
		var m = '<TABLE cellspacing=0 cellpadding=0><TR>';
		var allowclick = true;
		chkchamp = getCityChampion(cityId);
		if (chkchamp.championId && chkchamp.status == '10') {
			allowclick = false;
		}
		for (var y in Seed.champion.champions) {
			chkchamp = Seed.champion.champions[y];
			if (chkchamp.championId) {
				var outlineclass = 'champButNon';
				var opacity = '0.6';
				var onclick = 'onclick="btSetChampion('+chkchamp.championId+',false)"';
				if (chkchamp.assignedCity && chkchamp.assignedCity == cityId) {
					outlineclass = 'champButSel';
					opacity = '1.0';
					onclick = 'onclick="btFreeChampion('+chkchamp.championId+',false)"';
					if (chkchamp.status == '10') {
						outlineclass = 'champButMarch';
					}
				}
				if (chkchamp.status == '10' || !allowclick) {
					onclick = '';
				}
				m+='<TD id="ChampStatsBtn'+chkchamp.championId+'td" class="xtab trimg"><a style="text-decoration:none;" id="champlink'+chkchamp.championId+'"><div id="champimg'+chkchamp.championId+'" class="champBut '+outlineclass+'"><img class=btTop style="width:31px;height:33px;opacity:'+opacity+';" id="ChampStatsBtn'+chkchamp.championId+'" '+onclick+' onMouseover="btCreateChampionPopUp(this,'+(chkchamp.assignedCity?chkchamp.assignedCity:0)+',true,'+chkchamp.championId+',false,true);" src="'+ChampImagePrefix+chkchamp.avatarId+ChampImageSuffix+'"></div></a></td>';
			}
		}
		m += '<td class="xtab" style="opacity:0.6; align="left" id=btChampMsg>&nbsp;</td></tr></table>';
		return m;
	},

	PaintGuardianSelector : function () {
		var t = Dashboard;
		if (!popDash) { return; }
		if (t.GuardDelay > 10) { return; }

		var Curr = Options.DashboardOptions.CurrentCity;

		var y_offset = {wood: " 47% ",	ore: " 72.5% ",	food: " 59.5% ", stone: " 85% "};
		var x_offset = {plate: 20, junior: 134, teenager: 248, adult: 362, adult2: 476,	adult3: 590};
		var x_by_level = {0: x_offset.plate, 1: x_offset.junior, 2: x_offset.junior, 3: x_offset.junior, 4: x_offset.teenager, 5: x_offset.teenager, 6: x_offset.adult, 7: x_offset.adult, 8: x_offset.adult, 9: x_offset.adult, 10: x_offset.adult2, 11: x_offset.adult3, 12: x_offset.adult3, 13: x_offset.adult3, 14: x_offset.adult3, 15: x_offset.adult3};

		var m = '<TABLE cellspacing=0 cellpadding=0><TR>';

		for (var i=1;i<=4;i++) {
			var level = Seed.guardian[Curr].cityGuardianLevels[guardTypes[i-1]];
			level = level ? level : "";
			m+='<TD id="guardcell'+i+'" class="xtab tooldesc"><a style="text-decoration:none;" id="guardlink'+i+'"><div id="guardimg'+i+'" class="guardBut guardButNon trimg"><center>'+level+'</center></div></a><span class="tooltip" style="white-space: pre-line; word-wrap: break-word;">'+uW.g_js_strings.guardian["tooltipSummon_" + guardTypes[i-1]]+'</span></td>';
		}
		m += '<td class="xtab" style="opacity:0.6; align="left" id=btGuardMsg>&nbsp;</td></tr></table>';
		ById('btGuardianSelector').innerHTML = m;

		if (t.GuardDelay != 0) {	t.setGuardMessage('<span style="color:#080">'+tx('Guardian changed')+'!<br>'+tx('Change again in')+' '+t.GuardDelay+' '+tx('secs')+'...</span>'); }
		else { t.setGuardMessage('&nbsp;'); }

		t.CurrGuardian = Seed.guardian[Curr].type;
		for (var i=1;i<=4;i++) {
			/* show correct portion of image */
			var level = Seed.guardian[Curr].cityGuardianLevels[guardTypes[i-1]];
			level = level ? level : 0;
			var bg_offset = x_by_level[level]/776*100 + "% " + y_offset[guardTypes[i-1]];
			jQuery("#guardimg"+i).css('background-position', bg_offset);

			if (popDash) {
				ById('guardlink'+i).addEventListener ('click', function(){t.SwitchGuardian(this);},false);
			}
			if ((guardTypes[i-1]==(t.CurrGuardian)) && (Seed.guardian[Curr]['level'] != 0)) {
				jQuery("#guardimg"+i).removeClass("guardButNon").addClass("guardButSel");
			}
		}
	},

	Recall : function (marchId,cityview) {
		var t = Dashboard;
		t.setOutError('&nbsp;',cityview);

		var ajaxtype = 'undefend';
		var params = uW.Object.clone(uW.g_ajaxparams);
		for (var k in out) {
			if (out[k].marchId == marchId) {
				params.cid = out[k].marchCityId;
				if (out[k].marchStatus != 2) {
					ajaxtype = 'cancelMarch';
				}
				break;
			}
		}
		params.mid = marchId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/"+ajaxtype+".php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok){
					var march = uW.seed.queue_atkp["city" + params.cid]["m" + params.mid];
					var marchtime = parseInt(march.returnUnixTime) - parseInt(march.destinationUnixTime);
					var ut = uW.unixtime();
					if (Seed.playerEffects.returnExpire > ut) {	marchtime *= 0.5 }
					march.destinationUnixTime = rslt.destinationUnixTime || ut;
					march.returnUnixTime = Math.floor(rslt.returnUnixTime || ut + marchtime * rslt.returnMultiplier);
					march.marchStatus = 8;
					if (ajaxtype == 'cancelMarch') {
						for (var j in CM.UNIT_TYPES) {
							j = CM.UNIT_TYPES[j];
							Seed.queue_atkp["city" + params.cid]["m" + params.mid]["unit" + j + "Return"] = parseInt(Seed.queue_atkp["city" + params.cid]["m" + params.mid]["unit" + j + "Count"])
						}
					}
					t.setOutError('March Recalled',cityview);
				}
				else {
					if (rslt.error_code == 253)
						t.setOutError(uW.g_js_strings.recall.error,cityview);
					else
						t.setOutError(tx('Unable to recall march'),cityview);
				}
			},
			onFailure: function () { t.setOutError(tx('Unable to recall march'),cityview); },
		});
	},

	setOutError : function (msg,cityview) {
		var t = Dashboard;
		var elem = ById('btOutErr');
		if (cityview)
			elem = ById('btCityOutErr');
		if (elem)
			elem.innerHTML = msg;
	},

	ShowHideSection : function (div,tf) {
		var t = Dashboard;
		var dh = ById(div+'Header');
		if (dh) {
			if (tf && jQuery('#'+div+'Header').hasClass('divHide')) { jQuery('#'+div+'Header').removeClass('divHide'); t.ResizeFrame = true; }
			if (!tf && !jQuery('#'+div+'Header').hasClass('divHide')) { jQuery('#'+div+'Header').addClass('divHide'); t.ResizeFrame = true;}
		}
	},

	ShowHideRow : function (div,tf) {
		var t = Dashboard;
		var dh = ById(div);
		if (dh) {
			if (tf && jQuery('#'+div).hasClass('divHide')) { jQuery('#'+div).removeClass('divHide'); t.ResizeFrame = true; }
			if (!tf && !jQuery('#'+div).hasClass('divHide')) { jQuery('#'+div).addClass('divHide'); t.ResizeFrame = true; }
		}
	},

	ForceUpdateSeed : function () {
		var t = Dashboard;
		if (uW.g_update_seed_ajax_do && (t.ForceTries < 10)) { // refresh seed is occurring? But we need to make sure this runs, so delay for 1 second and try up to 10 times ...
			t.ForceTries = t.ForceTries + 1;
			logit('force update seed - waiting for server to be ready ('+t.ForceTries+')');
			setTimeout(function() {t.ForceUpdateSeed();}, 1000);
		}
		logit('force update seed - request sent to server');

		var retfunc = function () {
			var t = Dashboard;
			logit('force update seed - response received from server');
			t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
			if (Options.DashboardOptions.ReplaceDefendingTroops[Cities.byID[t.AttackedCity].idx]) { t.ResetDefendingTroops(t.AttackedCity); }
		}
		uWExportFunction('btretfunc',retfunc);

		uW.g_update_seed_ajax_force = true;
		setTimeout(function() {uW.update_seed_ajax(true, uW.btretfunc, false);}, 250);
	},

	ToggleAutoRefresh : function () {
		var t = Dashboard;
		Options.DashboardOptions.RefreshSeed = !Options.DashboardOptions.RefreshSeed;
		if (Options.DashboardOptions.RefreshSeed) {
			jQuery('#btRefreshSeed').addClass("disabled");
			jQuery('#btAutoRefresh').addClass("red14");
			jQuery('#btAutoRefresh').removeClass("blue14");
			ById('btAutoRefresh').innerHTML = '<span style="width:30px;display:inline-block;text-align:center;">Off</span>';
		}
		else {
			jQuery('#btRefreshSeed').removeClass("disabled");
			jQuery('#btAutoRefresh').removeClass("red14");
			jQuery('#btAutoRefresh').addClass("blue14");
			ById('btAutoRefresh').innerHTML = '<span style="width:30px;display:inline-block;text-align:center;">Auto</span>';
		}
		saveOptions();
	},

	UpdatePresetLabel: function (elem,entry) {
		var t = Dashboard;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		if (!Options.DashboardOptions.TRPresets[entry]) { Options.DashboardOptions.TRPresets[entry] = {};}
		if (elem.value == "") { elem.value = 'Preset '+entry; }

		Options.DashboardOptions.TRPresets[entry].name = elem.value;
		saveOptions();
		t.PaintTRPresets();
	},

	CheckDefaultRitual : function (sel) {
		sel.value = parseInt(sel.value);
		if (isNaN(sel.value)) sel.value = 0;

		var min, sec;

		if (sel.id == 'btDefaultRitualMinutes') {
			min = parseIntNan(sel.value);

			if (isNaN(ById('btDefaultRitualSeconds').value)) sec = 0;
			else sec = parseIntNan(ById('btDefaultRitualSeconds').value);
		}

		if (sel.id == 'btDefaultRitualSeconds') {
			sec = parseIntNan(sel.value);

			if (isNaN(ById('btDefaultRitualMinutes').value)) min = 0;
			else min = parseIntNan(ById('btDefaultRitualMinutes').value);

			min += (parseIntNan( sec / 60 ));
			sec = sec % 60;
		}
		ById('btDefaultRitualMinutes').value = BlankifZero(min);
		ById('btDefaultRitualSeconds').value = BlankifZero(sec);
		Options.DashboardOptions.DefaultSacrificeMin = BlankifZero(min);
		Options.DashboardOptions.DefaultSacrificeSec = BlankifZero(sec);
		saveOptions();
	},
}

/** Might Breakdown Popup **/

function ShowMightBreakdown () {

	function PlayerCourtCallBack (rslt) {

		var MightPop = null;
		var m = '<table class=xtab align=center>';

		if (rslt.playerInfo) {
			m += '<tr><TD>'+uW.g_js_strings.commonstr.might+':&nbsp;</td><TD><b>' + addCommas(Math.round(rslt.playerInfo.might)) + '</b></td></tr>';
			m += '<tr><TD>'+tx('Classic Might')+':&nbsp;</td><TD><b>' + addCommas(Math.round(rslt.playerInfo.mightClassic)) + '</b></td></tr>';
			if (Options.ShowGloryMight) {
				m += '<tr><TD>'+tx('Glory Might')+':&nbsp;</td><TD><b>' + addCommas(Math.round(rslt.playerInfo.mightGlory)) + '</b></td></tr>';
			}
		}
		else {
			m += '<tr><td>'+(rslt.errorMsg||tx('No Data'))+'</td></tr>';
		}
		m += '</table>'

		// cities

		var rownum = 1;

		m += '<div class="divHeader" align="center">'+tx('CITIES')+'</div>';
		m += '<div><br>';

		var u = '<TABLE align=center cellpadding=1 cellspacing=0>\
			<TR align=center><TD class=xtab><B></B></td><TD class=xtabHL colspan=4><B>'+tx('BUILDINGS')+'</b></td><TD class=xtabHL colspan=3><B>'+tx('TROOPS')+'</b></td><TD class=xtabHL><B>'+tx('TOTAL')+'</b></td></tr>\
			<TR valign=bottom align=right><TD class=xtab></td><TD class=xtabHL>'+uW.g_js_strings.commonstr.buildings+'</td><TD class=xtabH>'+tx('Fortifications')+'</td><TD class=xtabH>'+tx('Def. Tower')+'</td><TD class=xtabH>'+tx('Redoubt Tower')+'</td>\
			<TD class=xtabHL>'+tx('Sanctuary')+'</td><TD class=xtabH>'+tx('Defending')+'</td><TD class=xtabH>'+tx('Marching')+'</td><TD class=xtabHL>&nbsp;</td></tr>\
			<TR style="height:1px;"><TD style="padding:0px; spacing:0px; height:1px; border-color:black; border-width: 1px; border-style: none none solid none" colspan=9></td></tr>';

		var mightarray = [0,0,0,0,0,0,0,0];
		var totalarray = [0,0,0,0,0,0,0,0];

		for (var i = 1; i <= Cities.numCities; i++) {
			var cityId = Cities.cities[i-1].id;
			var afactor = 1;
			if (Seed.cityData.city[cityId].isPrestigeCity) {
				var l = Seed.cityData.city[cityId].prestigeInfo.prestigeLevel;
				if (l > 0) { afactor = Math.pow(CM.PrestigeModel.buildingBoost, l); }
			}
			if (++rownum % 2) { rsty = 'evenRow'; }
			else { rsty = 'oddRow'; }

			mightarray = [0,0,0,0,0,0,0,0];

			for (var y in Seed.buildings['city'+cityId]) {
				var b = Seed.buildings['city'+cityId][y];
				var btype = parseInt(b[0]);
				var blvl = parseInt(b[1]);
				var bpos = parseInt(b[2]);
				var might = 0;
				if (uW.buildingmight[btype]) {
					for (var l in uW.buildingmight[btype]) {
						if (l<blvl) {
							might += Math.ceil(uW.buildingmight[btype][l] * afactor);
						}
					}
				}

				if (bpos==99) {
					mightarray[2] += might;
				}
				else {
					if (bpos==98) {
						mightarray[3] += might;
					}
					else {
						mightarray[0] += might;
					}
				}
				mightarray[7] += might;
			}

			for (var tt in Seed.fortifications['city'+cityId]) {
				var might = parseIntNan(Seed.fortifications['city'+cityId][tt]) * parseInt(fortmight["f"+tt.split("fort")[1]]);
				mightarray[1] += might;
				mightarray[7] += might;
			}
			for (var tt in Seed.units['city'+cityId]) {
				var might = parseIntNan(Seed.units['city'+cityId][tt]) * parseInt(uW.unitmight[tt]);
				mightarray[4] += might;
				mightarray[7] += might;
			}
			if (SelectiveDefending) {
				for (var tt in Seed.defunits['city'+cityId]) {
					var might = parseIntNan(Seed.defunits['city'+cityId][tt]) * parseInt(uW.unitmight[tt]);
					mightarray[5] += might;
					mightarray[7] += might;
				}
			}
			for (var k in Seed.queue_atkp['city'+cityId]) { // each march from city
				var march = local_atkp[k];
				if (typeof (march) == 'object') {
					for (var ui in CM.UNIT_TYPES) {
						ii = CM.UNIT_TYPES[ui];
						var might = parseIntNan(march['unit' + ii + 'Count']) * parseInt(uW.unitmight['unt' + ii]);
						mightarray[6] += might;
						mightarray[7] += might;
					}
				}
			}

			u += '<TR class="'+rsty+'" align=right><TD class=xtab align=left><B>' + Cities.cities[i-1].name.substring(0, 12) + '</b></td><TD class=xtabL>' + addCommas(mightarray[0]) + '</td><TD class=xtab>' + addCommas(mightarray[1]) + '</td>\
				<TD class=xtab>' + addCommas(mightarray[2]) + '</td><TD class=xtab>' + addCommas(mightarray[3]) + '</td><TD class=xtabL>' + addCommas(mightarray[4]) + '</td><TD class=xtab>' + addCommas(mightarray[5]) + '</td><TD class=xtab>' + addCommas(mightarray[6]) + '</td><TD class=xtabL>' + addCommas(mightarray[7]) + '</td></tr>';
			for (var t in totalarray) {
				totalarray[t]+=mightarray[t];
			}
		}
		u += '<TR class=xtabLine><TD colspan=9 class=xtabLine></td></tr>';
		if (++rownum % 2) { rsty = 'evenRow'; }
		else { rsty = 'oddRow'; }
		u += '<TR class="'+rsty+'" align=right><TD class=xtab align=left><B>'+tx('TOTAL')+'</b></td><TD class=xtabL>' + addCommas(totalarray[0]) + '</td><TD class=xtab>' + addCommas(totalarray[1]) + '</td>\
			<TD class=xtab>' + addCommas(totalarray[2]) + '</td><TD class=xtab>' + addCommas(totalarray[3]) + '</td><TD class=xtabL>' + addCommas(totalarray[4]) + '</td><TD class=xtab>' + addCommas(totalarray[5]) + '</td><TD class=xtab>' + addCommas(totalarray[6]) + '</td><TD class=xtabL>' + addCommas(totalarray[7]) + '</td></tr>';
		u += '<TR class=xtabLine><TD colspan=9 class=xtabLine></td></tr>';

		m += u + '</table></div><br>';

		//champs

		var rownum = 1;
		var champs = {};
		mightarray = [];
		var totalmight = 0;
		for (var y in Seed.champion.champions) {
			if (Seed.champion.champions[y].championId) {
				champs[Seed.champion.champions[y].championId] = y;
				mightarray.push(0);
			}
		}
		mightarray.push(0); // unassigned
		mightarray.push(0); // broken
		for (var z in uW.kocChampionItems) {
			var item = uW.kocChampionItems[z];
			if (!item.quality) item.quality = parseIntNan(item.rarity);
			item.level = parseIntNan(item.level);
			var might = CardMight(item,true);
			if (item.status==1) {
				if (item.equippedTo && champs[item.equippedTo]) {
					mightarray[champs[item.equippedTo]] += might;
				}
				else {
					mightarray[mightarray.length-2] += might; // unassigned
				}
			}
			else {
				mightarray[mightarray.length-1] += might; // broken
			}
			totalmight += might;
		}

		m += '<div class="divHeader" align="center">'+tx('CHAMPION HALL')+'</div>';
		m += '<div><br>';

		var u = '<TABLE align=center cellpadding=1 cellspacing=0 style="border-collapse:collapse;"><tr align=center valign=top>';
		for (var y in Seed.champion.champions) {
			if (Seed.champion.champions[y].championId) {
				var champcity = '<i>Unassigned</i>';
				if (Seed.champion.champions[y].assignedCity && Cities.byID[Seed.champion.champions[y].assignedCity]) {
					champcity = Cities.byID[Seed.champion.champions[y].assignedCity].name;
				}
				u += '<td class=xtabBorder nowrap><b>'+Seed.champion.champions[y].name+'</b><br>'+champcity+'</td>';
			}
		}
		u += '<td class=xtabBorder><b>'+tx('Unassigned')+'</b></td><td class=xtabBorder><b>'+tx('Broken')+'</b></td><td class=xtabBorder><b>'+tx('Total')+'</b></td></tr><tr align=center>';
		for (var y in Seed.champion.champions) {
			if (Seed.champion.champions[y].championId) {
				u += '<td class=xtabBorder>'+addCommas(mightarray[y])+'</td>';
			}
		}
		u += '<td class=xtabBorder>'+addCommas(mightarray[mightarray.length-2])+'</td><td class=xtabBorder><span class=boldRed>'+addCommas(mightarray[mightarray.length-1])+'</span></td><td class=xtabBorder>'+addCommas(totalmight)+'</td></tr>';

		m += u + '</table></div><br>';

		//throne

		var rownum = 1;
		var throne = {};
		mightarray = [];
		var totalmight = 0;
		var numslots = Seed.throne.slotNum;
		for (var y=1;y<=numslots;y++) {
			mightarray.push(0);
		}
		mightarray.push(0); // unassigned
		mightarray.push(0); // broken

		if (matTypeof(Seed.throne.inventory) == 'object') {
			for (var z in Seed.throne.inventory) {
				var item = Seed.throne.inventory[z];
				var might = CardMight(item);
				if (item.status==1) {
					var InPreset = false;
					for (var y in Seed.throne.slotEquip) {
						if (Seed.throne.slotEquip[y].indexOf(item.id)!= -1) {
							InPreset = true;
							mightarray[y-1] += might;
						}
					}
					if (!InPreset) {
						mightarray[mightarray.length-2] += might; // unassigned
					}
				}
				else {
					mightarray[mightarray.length-1] += might; // broken
				}
				totalmight += might;
			}
		}

		m += '<div class="divHeader" align="center">'+tx('THRONE ROOM')+'</div>';
		m += '<div><br>';

		var u = '<TABLE align=center cellpadding=1 cellspacing=0 style="border-collapse:collapse;"><tr align=center valign=top>';
		u += '<td class=xtabBorder><b>'+tx('Unassigned')+'</b></td><td class=xtabBorder><b>'+tx('Broken')+'</b></td><td class=xtabBorder><b>'+tx('Total')+'</b></td></tr><tr align=center valign=top>';
		u += '<td class=xtabBorder>'+addCommas(mightarray[mightarray.length-2])+'</td><td class=xtabBorder><span class=boldRed>'+addCommas(mightarray[mightarray.length-1])+'</span></td><td class=xtabBorder>'+addCommas(totalmight)+'</td></tr>';
		u += '</table><br><TABLE align=center cellpadding=1 cellspacing=0 style="border-collapse:collapse;"><tr align=center valign=top>';

		var startslot = 1;
		var numrow = 6;
		while (startslot < numslots) {
			for (var y=startslot;y<=numslots;y++) {
				if (y>startslot+numrow) { break; }
				var presetname = (Options.DashboardOptions.TRPresets[y]?Options.DashboardOptions.TRPresets[y].name:'Preset '+y);
				var active = '';
				if (y==Seed.throne.activeSlot) active = '<span class=boldGreen>('+tx('Active')+')</span>';
					u += '<td class=xtabBorder nowrap><b>'+presetname+'</b><br>'+active+'</td>';
			}
			u += '</tr><tr align=center valign=top>';
			for (var y=startslot;y<=numslots;y++) {
				if (y>startslot+numrow) {
					startslot = y;
					break;
				}
				u += '<td class=xtabBorder>'+addCommas(mightarray[y-1])+'</td>';
			}
			u += '</tr><tr align=center valign=top><td class=xtab colspan='+numrow+' style="border:none;">&nbsp;</td></tr>';
			if (y>=numslots) { startslot=numslots; } else { u += '<tr align=center valign=top>'; }
		}

		m += u + '</table></div>';

		m += '<div class="divHeader" align="center">'+tx('OTHER MIGHT')+'</div>';
		m += '<div><br>';

		var QM = 0;
		for (var q in Seed.quests) {
			if (Seed.quests[q]==1) {
				var R = uW.questlist[q].reward;
				if (parseInt(R[3][1]) != 0) {
					QM += parseInt(R[3][1]);
				}
			}
		}
		var u = '<TABLE align=center cellpadding=0 cellspacing=0><tr align=center valign=top>';
		u += '<td class=xtab align=right><b>'+tx('Quest Rewards')+':&nbsp;</b></td><td class=xtab align=left>'+addCommas(QM)+'</td></tr></table>';

		m += u + '</div>';

		m += '<div align=center><br>'+strButton20(tx('Refresh'), 'id=ptmightrefresh')+'<br></div>';

		var off = getAbsoluteOffsets(ById('btMightPop'));
		MightPop = new CPopup('btShowMight', off.left, off.top, 600, 500, true);
		MightPop.getTopDiv().innerHTML = '<DIV align=center><B>'+tx('Might Breakdown')+'</B></DIV>';
		MightPop.getMainDiv().innerHTML = m;
		ById('ptmightrefresh').addEventListener('click',ShowMightBreakdown, false);
		MightPop.show(true);
		ResetFrameSize('btShowMight',500,600);
	}

	// get court might values from server

	fetchPlayerCourt(uW.tvuid, PlayerCourtCallBack);
}

/** Battle Popup **/

var Battle = {
	userobj : {},
	ReqSent : {},
	dat : [],
	playerpos : {x: -999, y: -999},
	SearchUID : false,
	init : function () {
		var t = Battle;

		uWExportFunction('ptBatClickSort', Battle.ClickSort);

		DefaultWindowPos('btBatPos','main_engagement_tabs');
		if (GlobalOptions.BattleToggle) {
			AddPowerBarLink(tx('Battle'), 'PBPBatButton', Battle.ToggleBattle,function(me) {ResetWindowPos (me,'main_engagement_tabs',popBat);});
		}
	},

	ToggleBattle : function () {
		var t = Battle;
		if (popBat) {
			popBat.toggleHide(popBat)
		}
		else {
			var initvalue = Options.MonitorOptions.LastMonitored;
			if (t.SearchUID) {
				initvalue = Options.MonitorOptions.LastMonitoredUID;
				if (initvalue==0) { initvalue = ""; }
			}

			m = '<br>';
			m += '<div align="center">'+tx('Enemy')+':&nbsp;<INPUT id=btBatPlayer size=20 type=text value="'+initvalue+'"/>&nbsp;'+tx('Search UID')+'<INPUT id=btBatUID type=checkbox '+(t.SearchUID?'CHECKED':'')+' /></div>';
			m += '<div class="ErrText" align="center" id=btBatPlayErr>&nbsp;</div><div align="center">';
			if (!uW.isNewServer()) { m += '<a id=btBatMonitor class="inlineButton btButton blue20"><span>'+tx('Monitor')+'</span></a>&nbsp;'; }
			m += '<a id=btBatDetails class="inlineButton btButton blue20"><span>'+tx('Details')+'</span></a>&nbsp;';
			if (!uW.isNewServer()) { m += '<a id=btBatChamp class="inlineButton btButton blue20"><span>'+tx('Champions')+'</span></a><br>&nbsp;</div>'; }

			popBat = new CPopup('btBattle', Options.btBatPos.x, Options.btBatPos.y, 420, 100, true, Battle.close);
			popBat.getMainDiv().innerHTML = m;
			popBat.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;'+tx('Battle')+'</B></DIV>';

			ById('btBatUID').addEventListener('change',	function() {
				t.SearchUID = (ById('btBatUID').checked);
			});

			if (!uW.isNewServer()) {
				ById('btBatMonitor').addEventListener('click', function(){ t.BattleClick(1); },false);
				ById('btBatChamp').addEventListener('click', function(){ t.BattleClick(2); },false);
			}
			ById('btBatDetails').addEventListener('click', function(){ t.BattleClick(3); },false);

			popBat.show(true);
			ResetFrameSize('btBattle',100,420);
		}
	},

	close : function () {
		Options.btBatPos = popBat.getLocation();
		saveOptions();
		popBat=null;
	},

	setError : function (msg) {
		ById('btBatPlayErr').innerHTML = msg;
	},

	BattleClick : function (funtype) {
		var t = Battle;
		t.setError('&nbsp;');

		var name = ById('btBatPlayer').value;
		name = name.replace(/\'/g,"_").replace(/\,/g,"_").replace(/\-/g,"_");

		if (name.toUpperCase() == Seed.player.name.toUpperCase()) {
			if (funtype==1) {
				Tabs.Monitor.initMonitor (uW.tvuid, false)
			}
			if (funtype==2) {
				Tabs.Player.ViewChamps (uW.tvuid, Seed.player.name, popBat.getMainDiv())
			}
			if (funtype==3) {
				t.fetchPlayerInfo(uW.tvuid,t.clickedPlayerDetails);
			}
			return;
		}

		if (t.SearchUID) {
			if (funtype==1) {
				Tabs.Monitor.initMonitor (name, false);
			}
			if (funtype==2) {
				t.getPlayerName(name, Tabs.Player.ViewChamps, popBat.getMainDiv());
			}
			if (funtype==3) {
				t.fetchPlayerInfo(name,t.clickedPlayerDetails);
			}
			return;
		}

		if (getMyAlliance()[0] == 0) {
			t.setError(uW.g_js_strings.membersInfo.youmustbelong);
			return;
		}

		if (name.length < 3){
			setError(uW.g_js_strings.getAllianceSearchResults.entryatleast3);
			return;
		}

		// Get User details.. need to use alliance search to get UserID from name

		if (funtype==1) {
			fetchPlayerList(name, t.eventMatchNameMonitor);
		}
		if (funtype==2) {
			fetchPlayerList(name, t.eventMatchNameChamp);
		}
		if (funtype==3) {
			fetchPlayerList(name, t.eventMatchNameDetails);
		}
	},

	eventMatchNameMonitor : function (rslt){
		var t = Battle;
		if (!rslt.ok){ t.setError(rslt.msg); return; }

		var matchname = ById('btBatPlayer').value;
		var uid = "";

		for (var k in rslt.matchedUsers) {
			if (rslt.matchedUsers[k].name.toUpperCase() == matchname.toUpperCase()) {uid = rslt.matchedUsers[k].userId;}
		}

		if (uid==""){
			t.setError(tx('User not found')+'!');
			return;
		}

		Tabs.Monitor.initMonitor (uid, false);
	},

	eventMatchNameChamp : function (rslt){
		var t = Battle;
		if (!rslt.ok){ t.setError(rslt.msg); return; }

		var matchname = ById('btBatPlayer').value;
		var uid = "";
		var name = "";

		for (var k in rslt.matchedUsers) {
			if (rslt.matchedUsers[k].name.toUpperCase() == matchname.toUpperCase()) {
				uid = rslt.matchedUsers[k].userId;
				name = rslt.matchedUsers[k].name;
			}
		}

		if (uid==""){
			t.setError(tx('User not found')+'!');
			return;
		}

		Tabs.Player.ViewChamps (uid, name, popBat.getMainDiv());
	},

	eventMatchNameDetails : function (rslt){
		var t = Battle;
		if (!rslt.ok){ t.setError(rslt.msg); return; }

		var matchname = ById('btBatPlayer').value;
		var uid = "";

		for (var k in rslt.matchedUsers) {
			if (rslt.matchedUsers[k].name.toUpperCase() == matchname.toUpperCase()) { uid = rslt.matchedUsers[k].userId; }
		}

		if (uid==""){
			t.setError(tx('User not found')+'!');
			return;
		}

		t.fetchPlayerInfo(uid,t.clickedPlayerDetails);
	},

	getPlayerName : function (uid, notify){
		var t = Battle;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rsltInfo) {
				if (!rsltInfo.ok) {
					t.setError('Unknown UID');
					return;
				}
				notify(uid,rsltInfo.userInfo[0].name);
			},
			onFailure: function () {
				t.setError ('AJAX error (server not responding)');
			},
		},true);
	},

	fetchPlayerInfo : function (uid, notify){
		var t = Battle;

		if (t.popPlayer) {
			t.popPlayer.show(false);
			if (t.popPlayer.onClose) t.popPlayer.onClose();
			t.popPlayer.destroy();
			t.popPlayer = null;
		}
		t.popPlayer = new CPopup('btPlayerPop', t.playerpos.x, t.playerpos.y, 500, 100, true, function () { t.playerpos = t.popPlayer.getLocation(); clearTimeout(1000); });
		if ((t.playerpos.x == -999) && (t.playerpos.y == -999)) {
			if (popBat) { t.popPlayer.centerMe(popBat.getMainDiv()); }
			else { t.popPlayer.centerMe(mainPop.getMainDiv()); }
		}
		t.popPlayer.getMainDiv().innerHTML = '<div align=center>'+tx('Loading')+'...</div>';
		t.popPlayer.getTopDiv().innerHTML = '<DIV style="white-space:nowrap;" align=center>&nbsp;&nbsp;<B>'+tx('Player Details')+'</B>&nbsp;&nbsp;</DIV>';
		t.popPlayer.show(true);
		ResetFrameSize('btPlayerPop',100,500);

		var uList = [];
		uList.push(uid);
		getOnline(uList, function (r) {
			if (!r.ok) { t.setError(rslt.errorMsg);return; }
			else { notify(uid,r.data[uid]);}
		});
	},

	clickedPlayerDetails : function (uid,online) {
		var t = Battle;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					t.userobj = {};
					t.userobj[uid] = rslt.userInfo[0];
					t.userobj[uid].might = Math.round(t.userobj[uid].might);
					t.userobj[uid].online = (online?true:false);

					fetchPlayerCourt(uid, function (rslt2) {
						if (rslt2.ok) {
							u = unixTime();
							f = convertTime(new Date(rslt2.playerInfo.fogExpireTimestamp.replace(" ","T")+"Z"));
							t.userobj[uid].misted = (f >= u);
							t.userobj[uid].fogExpireTimestamp = rslt2.playerInfo.fogExpireTimestamp;
							t.userobj[uid].warStatus = rslt2.playerInfo.warStatus;
							t.userobj[uid].truceExpireTimestamp = rslt2.playerInfo.truceExpireTimestamp;
							t.userobj[uid].cityCount = rslt2.playerInfo.cityCount;
							t.userobj[uid].mightClassic = rslt2.playerInfo.mightClassic;
							t.userobj[uid].mightGlory = rslt2.playerInfo.mightGlory;
							t.userobj[uid].fbuid = parseInt(rslt2.playerInfo.fbuid);
							t.userobj[uid].lastLogin = rslt2.playerInfo.lastLogin;

							t.fetchPlayerLeaderboard(uid, function (r) { t.gotPlayerLeaderboard(r, uid) });
						}
						else {
							t.setError(uW.g_js_strings.barbarian.erroroccured);
						}
					});
				}
				else {
					t.setError(uW.g_js_strings.barbarian.erroroccured);
				}
			},
			onFailure: function () {t.setError(uW.g_js_strings.errorcode.err_602);},
		});
	},

	fetchPlayerLeaderboard: function (uid, notify) {
		var t = Battle;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.userId = uid;
		params.type = "might";
		params.page = 1;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserLeaderboard.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { notify(rslt); },
			onFailure: function () { notify({errorMsg: 'AJAX error'});},
		});
	},

	gotPlayerLeaderboard : function (rslt,uid) {
		var t = Battle;
		if (!rslt.ok) { t.setError(rslt.errorMsg); return; }

		t.dat = [];
		var prestige = "";
		var aid = getMyAlliance()[0];
		if (rslt.totalResults == 0) {
			t.displayPlayer(uid,false);
			return;
		}

		var p = rslt.results[0];
		for (var c = 0; c < p.cities.length; c++) {
			var pt = p.cities[c].prestigeType;
			var prestige = getFactionName(pt);
			if (prestige == "") { prestigelvl = ""; }
			else { prestigelvl = " (" + p.cities[c].prestigeLevel + ")"; }
			ExpTime = convertTime(new Date(p.cities[c].prestigeBuffExpire.replace(" ", "T")+"Z"));
			if ((ExpTime + (3600 * 24) < unixTime()) || isNaN(ExpTime)) {
				prestigeexp = "";
			} else {
				prestigeexp = Tabs.Player.getDuration(p.cities[c].prestigeBuffExpire);
			}
			t.dat.push([p.displayName, parseInt(p.might), p.officerType, parseInt(p.numCities), parseInt(p.cities[c].tileLevel),
				parseInt(p.cities[c].xCoord), parseInt(p.cities[c].yCoord), p.cities[c].cityName, 0, t.userobj[uid].online, '--',
				p.cities[c].cityId, prestige, p.userId, prestigelvl, prestigeexp, p.cities[c].prestigeBuffExpire, prestige + prestigelvl, p.cities[c].blessing,false]);
		}
		t.displayPlayer(uid,true);
	},

	displayPlayer: function (uid,locations) {
		var t = Battle;

		var u = t.userobj[uid];
		var n = '<div>';
		n += '<div style="width:500px;padding:5px;"><table style="padding-right:0px;" class=xtab cellspacing=0 width=100%>';
		if (u.allianceId && u.allianceId != 0) {
			n += '<tr><td>'+uW.g_js_strings.commonstr.alliance+':&nbsp;</td><td colspan=2><b>' + u.allianceName + FormatDiplomacy(u.allianceId) + '</b></td></tr>';
		}
		else {
			n += '<tr><td>'+uW.g_js_strings.commonstr.alliance+':&nbsp;</td><td colspan=2><b>'+uW.g_js_strings.commonstr.none+'!</b></td></tr>';
		}

		if (!u.online) {
			n += ' <tr><TD>'+uW.g_js_strings.modal_messages_viewreports_view.lastlogin+':&nbsp;</td><TD colspan=2><b>'+ Tabs.Player.getLastLogDuration(u.lastLogin) +'</b></td></tr>';
		}
		else {
			n += ' <tr><TD>'+tx('Last login')+':&nbsp;</td><TD colspan=2><b><span style="color:#800">'+tx('ONLINE')+'</span></b></td></tr>';
		}
		if (u.misted)
			n += '<tr><TD>'+tx('Misted')+':&nbsp;</td><TD colspan=2><b>' + Tabs.Monitor.getDuration(u.fogExpireTimestamp) + '</b></td></tr>';
		n += '<tr><TD>'+uW.g_js_strings.commonstr.status+':&nbsp;</td><TD colspan=2><b>' + Tabs.Monitor.GetStatusText(u.warStatus,u.truceExpireTimestamp) + '</b></td></tr>';
		n += '<tr><TD>'+uW.g_js_strings.commonstr.might+':&nbsp;</td><TD colspan=2><b>' + addCommas(Math.round(u.might)) + '</b></td></tr>';
		n += '<tr><TD>'+tx('Classic Might')+':&nbsp;</td><TD colspan=2><b>' + addCommas(Math.round(u.mightClassic)) + '</b></td></tr>';
		if (Options.ShowGloryMight) {
			n += '<tr><TD>'+tx('Glory Might')+':&nbsp;</td><TD colspan=2><b>' + addCommas(Math.round(u.mightGlory)) + '</b></td></tr>';
		}
		n += '<TR><TD>'+uW.g_js_strings.commonstr.glory+':&nbsp;</td><TD width=50><b><DIV id=ptBatPaintGlory></div></b></td><td valign=middle rowspan=3 id=ptBatGloryIcon>&nbsp;</td></tr>';
		n += '<TR><TD>'+tx('Maximum Glory')+':&nbsp;</td><TD><b><DIV id=ptBatPaintMaxGlory></div></b></td></tr>';
		n += '<TR><TD>'+tx('Lifetime Glory')+':&nbsp;</td><TD><b><DIV id=ptBatPaintLifetimeGlory></div></b></td></tr>';

		var pids = u.provinceIds.split(',');
		var p = [];
		for (var i = 0; i < pids.length; i++) {
			p.push(uW.provincenames['p' + pids[i]]);
		}
		n += '<tr><td>'+tx('Provinces')+':&nbsp;</td><td colspan=2><div class="wrap" style="width:350px;">'+p.join(', ')+'</div></td></tr>';
		// create notes link
		var notes = "";
		if (Tabs.Notes && Tabs.Notes.noteValues[uid]) {
			notes = Tabs.Notes.noteValues[uid];
			notes = notes.text;
		}

		if (notes != "") {
			n += '<TR><TD class=xtab valign=top>'+tx('Player Notes')+':</td><TD colspan=2 id=ptBatplayernotes class=xtabBRTop><div class="wrap" style="width:350px;">' + notes + '</div></td></tr>';
		}
		n += '</table></div>';

		n += '<div id=BatCitySelect style="display:none;padding:5px;"><hr>';
		n += '<table class=xtab width=100%>';
		n += '<TR><TD>';
		if (Tabs.BulkScout) n += strButton20(tx('Add to Scout List'), 'id=BatScoutExport')+'&nbsp;';
		if (Tabs.BulkAttack) n += strButton20(tx('Add to Attack List'), 'id=BatBulkAttackExport')+'&nbsp;';
		n += strButton20(tx('Highlight Defending Cities'),'id=BatHighDefenders')+'</td></tr></table>'
		n += '</div>';

		n+= '<DIV class=divHeader style="padding-right:0px;"><TABLE width=100% cellspacing=0>';
		if (!locations) {
			n += '<TR><TD class=xtab align=center>'+tx('City locations unavailable')+'</td></tr>';
		}
		else {
			n += '<TR><TD class=xtab align=center>'+tx('City Locations')+'</td></tr>';
		}
		n += '</table></div>';
		if (locations) {
			n += '<div style="padding-right:6px;width:500px;overflow-x:auto;height:200px;overflow-y:auto;"><TABLE id=tabBatAllMembers align=left cellpadding=0 cellspacing=0 width=100%>';
			n += '<TR><TD nowrap><A id=clickBat7 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+uW.g_js_strings.commonstr.city+'&nbsp;</span></a></td>\
				<TD nowrap><A id=clickBat4 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+tx('Lvl')+'&nbsp;</span></a></td>\
				<TD nowrap><A id=clickBat17 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+uW.g_js_strings.commonstr.faction+'&nbsp;</span></a></td>\
				<TD nowrap><A id=clickBat16 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+tx('Protection Left')+'&nbsp;</span></a></td>\
				<TD nowrap><a id=clickBat9 class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="padding-right:10px;vertical-align:middle;display:inline-block;width:100%;"><INPUT id=BatToggleScoutCheckbox type=checkbox></span></a></td>\
				<TD nowrap><A id=clickBat5 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+tx('Co-ords')+'&nbsp;</span></a></td>\
				</tr>';
			n += '<TBODY id=BatBody></tbody></table></div>';
		}

		n += '</div><br>';

		t.popPlayer.getMainDiv().innerHTML = n;

		if (locations) {
			ById('BatCitySelect').style.display='block';
			if (ById('clickBat' + Options.PlayerOptions.sortColNum)) {
				ById('clickBat' + Options.PlayerOptions.sortColNum).className = 'buttonv2 std green';
			}
			ById('BatToggleScoutCheckbox').addEventListener('change', t.doSelectall, false);
			t.RepaintList();
		}

		t.PaintGlory(uid);

		if (ById('BatScoutExport')) ById('BatScoutExport').addEventListener('click', t.ExportScoutList, false);
		if (ById('BatBulkAttackExport')) ById('BatBulkAttackExport').addEventListener('click', t.ExportAttackList, false);
		ById('BatHighDefenders').addEventListener('click', t.HighlightDefenders, false);

		t.popPlayer.getTopDiv().innerHTML = '<DIV style="white-space:nowrap;" align=center>&nbsp;&nbsp;<B>'+u.name+' ('+uid+')</B>&nbsp;&nbsp;</DIV>';
		t.popPlayer.show(true);
		ResetFrameSize('btPlayerPop',100,500);
	},

	ClickSort : function (e) {
		var t = Battle;
		var newColNum = e.id.substr(8);
		if (ById('clickBat' + Options.PlayerOptions.sortColNum))
		ById('clickBat' + Options.PlayerOptions.sortColNum).className = 'buttonv2 std blue';
		e.className = 'buttonv2 std green';
		if (newColNum == Options.PlayerOptions.sortColNum) { Options.PlayerOptions.sortDir *= -1; }
		else { Options.PlayerOptions.sortColNum = newColNum; }
		saveOptions();
		t.RepaintList();
	},

	PaintGlory: function (uid) {
		var t = Battle;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.userId = uid;
		params.ctrl = 'PlayerProfile';
		params.action = 'get';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					ById('ptBatPaintGlory').innerHTML = addCommas(rslt.profile.glory);
					ById('ptBatPaintMaxGlory').innerHTML = addCommas(rslt.profile.maxGlory);
					ById('ptBatPaintLifetimeGlory').innerHTML = addCommas(parseIntNan(rslt.profile.lifetimeGlory));
					ById('ptBatGloryIcon').innerHTML = '<img src="'+IMGURL+'chat_'+rslt.profile.gloryIconId+'.png">';
				}
				else {
					ById('ptBatPaintGlory').innerHTML = '(error)';
					ById('ptBatPaintMaxGlory').innerHTML = '(error)';
					ById('ptBatPaintLifetimeGlory').innerHTML = '(error)';
					ById('ptBatGloryIcon').innerHTML = '&nbsp;';
				}
			},
		},true);
	},

	doSelectall: function () {
		var t = Battle;
		var city = "";
		for (var k = 0; k < t.dat.length; k++) {
			city = t.dat[k][11].toString();
			if (ById('BatToggleScoutCheckbox').checked) ById('ptBatScout_' + city).checked = true;
			else ById('ptBatScout_' + city).checked = false;
		}
	},

	RepaintList: function () {
		var t = Battle;

		function sortFunc(a, b) {
			var t = Battle;
			if (typeof (a[Options.PlayerOptions.sortColNum]) == 'number') {
				if (Options.PlayerOptions.sortDir > 0)
					return a[Options.PlayerOptions.sortColNum] - b[Options.PlayerOptions.sortColNum];
				else
					return b[Options.PlayerOptions.sortColNum] - a[Options.PlayerOptions.sortColNum];
			} else if (typeof (a[Options.PlayerOptions.sortColNum]) == 'boolean') {
				return 0;
			} else {
				if (Options.PlayerOptions.sortDir > 0)
					return a[Options.PlayerOptions.sortColNum].localeCompare(b[Options.PlayerOptions.sortColNum]);
				else
					return b[Options.PlayerOptions.sortColNum].localeCompare(a[Options.PlayerOptions.sortColNum]);
			}
		}

		t.dat.sort(sortFunc);

		var m = '';
		var RowId = "";
		var r = 0;
		for (var i = 0; i < t.dat.length; i++) {
			RowId = 'bat_'+t.dat[i][5].toString()+'_'+t.dat[i][6].toString();
			var bless = showBlessings(t.dat[i][18]);
			if (bless != "") {
				var bless = '<a class=trimg><img style="vertical-align:bottom" src="'+IMGURL+'bonus_prestige.png"><SPAN class=trtip><table width=200 class=xtab>'+bless+'</table></span></a>';
			}
			var status = '<img title="Offline" style="vertical-align:bottom" src="'+OFFLINE+'"/>';
			if (t.dat[i][9] == 1) status = '<img title="Online" style="vertical-align:bottom" src="'+ONLINE+'"/>';

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			if (t.dat[i][19]) rowClass += ' highRow';
			m += '<TR id="'+RowId+'" class="'+rowClass+'" style="max-height:30px"><TD class=xtab nowrap>'+t.dat[i][7]+'</td>';
			m += '<TD class=xtab align=right>'+t.dat[i][4]+'</td>';
			m += '<TD class=xtab align=left nowrap>'+bless+t.dat[i][12]+t.dat[i][14]+'</td>';
			m += '<TD class=xtab align=center>'+t.dat[i][15]+'</td>';
			m += '<TD class=xtab align=center style="padding-left:4px;padding-right:0px;"><INPUT id=ptBatScout_'+t.dat[i][11]+' type=checkbox></td>';
			m += '<TD class=xtab align=center onclick="btGotoMap('+t.dat[i][5]+','+t.dat[i][6]+')"><A class=xlink>'+t.dat[i][5]+','+t.dat[i][6]+'</a></td>';
		}
		if (ById('BatBody')) {
			ById('BatBody').innerHTML = m;
			ResetFrameSize('btPlayerPop',100,400);
		}
	},

	ExportScoutList : function () {
		var t = Battle;
		var coordlist = t.getSelected();
		if (coordlist != "") {
			Tabs.BulkScout.ImportCoords(coordlist.split(" "));
		}
	},

	ExportAttackList : function () {
		var t = Battle;
		var coordlist = t.getSelected();
		if (coordlist != "") {
			Tabs.BulkAttack.ImportCoords(coordlist.split(" "));
		}
	},

	getSelected : function () {
		var t = Battle;
		var coordlist = "";
		var city = "";
		for (var k = 0; k < t.dat.length; k++) {
			city = t.dat[k][11].toString();
			if (ById('ptBatScout_' + city).checked) {
				coordlist += t.dat[k][5].toString()+','+t.dat[k][6].toString()+' ';
				ById('ptBatScout_' + city).checked = false;
			}
		}
		return coordlist;
	},

	HighlightDefenders : function () {
		var t = Battle;

		var delayer = 0;
		ById('BatHighDefenders').outerHTML = '<span id=BatHighDefendersProg>&nbsp;</span>';

		for (var k = 0; k < t.dat.length; k++) {
			if (!t.ReqSent[t.dat[k][5]+'_'+t.dat[k][6]] || t.ReqSent[t.dat[k][5]+'_'+t.dat[k][6]]==0) {
				t.ReqSent[t.dat[k][5]+'_'+t.dat[k][6]]=1;
				setTimeout(getDefendStatus,(250*delayer),t.dat[k][5],t.dat[k][6],false,false,t.UpdateDefendStatus,k,t.dat.length,'BatHighDefendersProg');
				delayer = delayer + 1;
			}
		}

		function ClearAtEnd () {
			if (ById('BatHighDefendersProg')) {
				ById('BatHighDefendersProg').outerHTML = strButton20(tx('Highlight Defending Cities'),'id=BatHighDefenders');
				ById('BatHighDefenders').addEventListener('click', t.HighlightDefenders, false);
			}
		};

		setTimeout (ClearAtEnd,(250*delayer));
	},

	UpdateDefendStatus : function (rslt,x,y,k) {
		var t = Battle;
		t.ReqSent[x+'_'+y]=0;
		var div = ById('bat_'+x+'_'+y);
		var	city = t.dat[k][11].toString();
		if (rslt.ok && rslt.ok=="true") {
			t.dat[k][19] = true;
			if (div) jQuery(div).addClass("highRow");
			if (ById('ptBatScout_' + city)) ById('ptBatScout_' + city).checked = true;
		}
		else {
			t.dat[k][19] = false;
			if (div) jQuery(div).removeClass("highRow");
			if (ById('ptBatScout_' + city)) ById('ptBatScout_' + city).checked = false;
		}
	},

}

/** Incoming Marches Popup **/

var Incoming = {
	Options : {
		IncomingStartState	: false,
		IncAttack			: true,
		IncScout			: true,
		IncReinforce		: true,
		IncReassign			: false,
		IncTransport		: false,
		IncWilds			: false,
		IncYours			: false,
		IncResources		: true,
	},

	init : function () {
		var t = Incoming;
		DefaultWindowPos('btIncPos','main_engagement_tabs');
		if (GlobalOptions.InOutToggle) {
			AddPowerBarLink(tx('Incoming'), 'PBPIncButton', Incoming.ToggleIncoming,function(me) {ResetWindowPos (me,'main_engagement_tabs',popInc);});
		}
		HTMLRegister['INC']= {};

		if (!Options.IncomingOptions) {
			Options.IncomingOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.IncomingOptions.hasOwnProperty(y)) {
					Options.IncomingOptions[y] = t.Options[y];
				}
			}
		}
		if (Options.IncomingOptions.IncomingStartState) {t.ToggleIncoming();}
	},

	ToggleIncoming : function () {
		var t = Incoming;

		ResetHTMLRegister('INC','btIncomingMain');

		if (popInc) {
			Options.IncomingOptions.IncomingStartState = popInc.toggleHide(popInc)
		}
		else {
			m = '<div id=btIncomingButtons align="center"><TABLE width="100%"><tr>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.attack+'</td><TD class=xtab><INPUT id=IncAttackChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.scout+'</td><TD class=xtab><INPUT id=IncScoutChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.reinforce+'</td><TD class=xtab><INPUT id=IncReinforceChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.reassign+'</td><TD class=xtab><INPUT id=IncReassignChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.transport+'</td><TD class=xtab><INPUT id=IncTransportChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+tx('To Wilds')+'</td><TD class=xtab><INPUT id=IncWildsChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+tx('From You')+'</td><TD class=xtab><INPUT id=IncYoursChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.resources+'</td><TD class=xtab><INPUT id=IncResChk type=checkbox /></td>';
			m += '</tr></table></div><div style="max-height:700px; overflow-y:scroll" id=btIncomingMain></div><br>';

			popInc = new CPopup('btIncoming', Options.btIncPos.x, Options.btIncPos.y, 720, 200, true, Incoming.close);
			popInc.getMainDiv().innerHTML = m;
			popInc.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;'+tx('Incoming Marches')+'</B></DIV>';

			ToggleOption('IncomingOptions','IncAttackChk','IncAttack');
			ToggleOption('IncomingOptions','IncScoutChk','IncScout');
			ToggleOption('IncomingOptions','IncReinforceChk','IncReinforce');
			ToggleOption('IncomingOptions','IncReassignChk','IncReassign');
			ToggleOption('IncomingOptions','IncTransportChk','IncTransport');
			ToggleOption('IncomingOptions','IncWildsChk','IncWilds');
			ToggleOption('IncomingOptions','IncYoursChk','IncYours');
			ToggleOption('IncomingOptions','IncResChk','IncResources');

			popInc.show(true);
			Options.IncomingOptions.IncomingStartState = true;
		}
		saveOptions();

	},

	close : function () {
		Options.IncomingOptions.IncomingStartState = false;
		Options.btIncPos = popInc.getLocation();
		saveOptions();
		popInc=null;
	},

	PaintIncoming : function () {
		var t = Incoming;
		var z = '';
		var r = 0;
		var incomingshow = false;
		var incomingfiltered = false;
		var inctimes = {};

		var bclass = "brown11";
		if (RefreshingSeed || Options.DashboardOptions.RefreshSeed) bclass += " disabled";

		var z = '<div align="center"><TABLE cellSpacing=0 width=98% height=0%><tr><td width="18" class="xtabHD">&nbsp;</td><td width="60" class="xtabHD"><b>'+uW.g_js_strings.commonstr.time+'</b></td><td width="120" class="xtabHD"><b>'+uW.g_js_strings.commonstr.target+'</b></td><td width="120" class="xtabHD"><b>'+tx('From')+'</b></td>';
		z += '<td class="xtabHD"><b>'+uW.g_js_strings.commonstr.troops+'</b></td><td class="xtabHD" align="right"><a id=btRefreshSeedInc class="inlineButton btButton '+bclass+'"><span>'+tx('Refresh')+'</span></a></td></tr>';

		for(n in inc) {
			var a = inc[n];

			var icon, hint, marchtime, targetcity, targetcoords, fromname, marchdir, fromcoords;
			var marchScore = parseInt(a.score);
			var marchType = parseInt(a.marchType);
			var marchStatus = parseInt(a.marchStatus);
			var marchMight = 0;

			var to = Cities.byID[a.toCityId];
			if (to) {
				if ( to.tileId == a.toTileId ) {targetcity = CityLink(to);targetcoords = "";}
				else {targetcity = uW.g_js_strings.commonstr.wilderness;targetcoords = coordLink(a.toXCoord,a.toYCoord);}
			}
			else {
				targetcity = "";targetcoords = coordLink(a.toXCoord,a.toYCoord);
			}

			fromname = "";
			if (a.score) {
				if (a.arrivalTime < unixTime()) continue; // don't display arrival times already happened
				var marchId = a.mid;
				var pid = a.pid;
				if (!a.marchType) {a.marchType = 4;}
				if (!a.arrivalTime || a.arrivalTime == -1) {marchtime = '??????';}
				else {marchtime=uW.timestr(a.arrivalTime - unixTime());}
				if (a.players && a.players['u'+a.pid]) {fromname = a.players['u'+a.pid].n;}
				else if (Seed.players['u'+a.pid]) {fromname = Seed.players['u'+a.pid].n;}
			}
			else
			{
				var marchId = a.marchId;
				var pid = a.fromPlayerId;
				if ((a.arrivalTime - unixTime()) < 0) continue;
				marchtime=uW.timestr(a.arrivalTime - unixTime());
				player = Seed.players['u'+a.fromPlayerId];
				if (Seed.players['u'+a.fromPlayerId]) {fromname = Seed.players['u'+a.fromPlayerId].n;}
				else if (a.players && a.players['u'+a.fromPlayerId]) {fromname = a.players['u'+a.fromPlayerId].n;}
			}
			inctimes[marchId] = marchtime;

			if (!a.fromXCoord) {fromcoords = "";}
			else {fromcoords = coordLink(a.fromXCoord,a.fromYCoord);}
			if (fromname.toUpperCase() == Seed.player.name.toUpperCase()) {
				fromname = tx('Yourself');
				var fr = Cities.byID[a.fromCityId];
				fromcoords = ' ('+CityLink(fr)+')';
			}
			else
			{
				if (fromname == "") { if (a.score) {fromname = '('+uW.g_js_strings.attack_viewimpending_view.upgradetoseeinfo+')';} else {fromname = '('+tx('Unknown')+')';}}
				else {fromname = MonitorLink(pid,fromname);}
			}

			icon = "";
			switch (marchType) {
				case 1: icon=TransportImage;hint=uW.g_js_strings.commonstr.transport;break;
				case 2: icon=ReinforceImage;hint=uW.g_js_strings.commonstr.reinforce;break;
				case 3: icon=ScoutImage;hint=uW.g_js_strings.commonstr.scout;break;
				case 4: icon=AttackImage;hint=uW.g_js_strings.commonstr.attack;break;
				case 5: icon=ReassignImage;hint=uW.g_js_strings.commonstr.reassign;break;
			}
			if(icon=="")continue; // tampermonkey fix

			incomingfiltered = true;

			/* Apply Filters */

			if ((marchType == 1) && !Options.IncomingOptions.IncTransport) continue;
			if ((marchType == 2) && !Options.IncomingOptions.IncReinforce) continue;
			if ((marchType == 5) && !Options.IncomingOptions.IncReassign) continue;

			if ((marchType == 3) && !Options.IncomingOptions.IncScout) continue;
			if (((marchType == 4) || (!marchType && marchScore)) && !Options.IncomingOptions.IncAttack) continue;

			if ((targetcity == "Wilderness") && !Options.IncomingOptions.IncWilds) continue;
			if ((fromname == "Yourself") && !Options.IncomingOptions.IncYours) continue;

			incomingshow = true;

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="'+rowClass+'"><TD class=xtab><img src='+icon+' title='+hint+'></td>';
			z += '<TD class=xtab id="marchtime'+marchId+'">&nbsp;</td>';
			z += '<TD class=xtabBR>';
			if (targetcity != "") z += '<span class=xtab>'+targetcity+'</span> ';
			if (targetcoords != "") z += '<span class=xtab>'+targetcoords+'</span>';
			z += '</td>';
			z += '<TD class=xtabBR><span class=xtab>'+fromname+'</span> ';
			if (fromcoords != "") { z+= '<span class=xtab>'+fromcoords+'</span>'; }
			z += '</td>';

			if (a.destinationUnixTime < unixTime() || marchStatus == 8)
				marchdir = "Return";
			else
				marchdir = "Count";

			var zz = '';
			if (marchType == 3 || marchType == 4){
				if ((safecall.indexOf(a.pid) < 0 || trusted) && a["championInfo"]) {
					marchchamp = "<table cellspacing=0 class=xtab><tr><td colspan=2><b>"+a["championInfo"].name+"</b></td></tr><tr><td colspan=2><b>"+uW.g_js_strings.report_view.champion_stats+"</b></td></tr>";
					var gotchamp = false;
					if (a["championInfo"].effects[1] && !(a["championInfo"].effects[1] instanceof Array) && typeof(a["championInfo"].effects[1]) === "object") {
						got202 = false;
						for (var cy in a["championInfo"].effects[1]) {
							// missing bonus damage?
							if ((cy == '202') && gotchamp) {got202 = true;}
							if ((cy == '203') && !got202) { marchchamp += "<tr><td>"+uW.g_js_strings.effects.name_202+"</td><td>0</td></tr>"; }
							str = uW.g_js_strings.effects['name_'+cy];
							if (str && str!= "") {
								gotchamp = true;
								marchchamp += "<tr><td>"+str+"</td><td>"+a["championInfo"].effects[1][cy]+"</td></tr>";
							} else { break;	}
						}
					}
					if (!gotchamp) { marchchamp += '<tr><td colspan=2><i>'+tx('None Available')+'</i></td></tr>'; }
					marchchamp+="<tr><td colspan=2><b>"+uW.g_js_strings.report_view.troop_stats+"</b></td></tr>";
					var gottroop = false;
					if (a["championInfo"].effects[2] && !(a["championInfo"].effects[2] instanceof Array) && typeof(a["championInfo"].effects[2]) === "object") {
						for (var ty in a["championInfo"].effects[2]) {
							str = uW.g_js_strings.effects['name_'+ty];
							if (str && str!= "") {
								gottroop = true;
								marchchamp += "<tr><td>"+str+"</td><td>"+a["championInfo"].effects[2][ty]+"</td></tr>";
							} else { break;	}
						}
					}
					if (!gottroop) { marchchamp += '<tr><td colspan=2><i>'+tx('None Available')+'</i></td></tr>'; }
					marchchamp+="</table>";
					zz +='<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="btmarchchamp'+a.mid+'td"><input type="hidden" id="btmarchchamp'+a.mid+'effects" value="'+marchchamp+'" /><a><img id="btmarchchamp'+a.mid+'" onMouseover="btCreateChampionPopUp(this,'+a.toCityId+');" height=14 class=btTop src="'+ShieldImage+'"></a></td><td class=xtab>'+tx('Champion')+': '+a["championInfo"].name+'&nbsp;</td></tr></table>';
				}
				if (a["knt"] && a["knt"]["cbt"]) zz +='<span class=xtab>'+uW.g_js_strings.commonstr.knight+' (Atk:'+ a["knt"]["cbt"]+')</span> ';
				if (a["unts"]) {
					for (var ui in CM.UNIT_TYPES){
						i = CM.UNIT_TYPES[ui];
						if (a["unts"]["u"+i]) {
							if (a["unts"]["u"+i] > 0) { zz += '<span class=xtab>'+ uW.unitcost['unt'+i][0] +': '+ addCommas(a["unts"]["u"+i])+'</span> '; marchMight += (a["unts"]["u"+i]*parseInt(uW.unitmight["unt"+i])); }
							else { zz += '<span class=xtab>'+ a["unts"]["u"+i]+' '+ uW.unitcost['unt'+i][0] +'</span> '; }
						}
					}
				}
				else
				{
					if (a["cnt"]) { zz += '<span class=xtab>'+a["cnt"]+'</span> ';}
					else { zz += '<span class=xtab>('+uW.g_js_strings.attack_viewimpending_view.upgradetoseeinfo+')</span> '; }
				}
			}
			else
			{
				if (a["knightId"] > 0) zz +='<span class=xtab>'+uW.g_js_strings.commonstr.knight+' (Atk:'+ a["knightCombat"]+')</span> ';
				for (var ui in CM.UNIT_TYPES){
					i = CM.UNIT_TYPES[ui];
					if(a["unit"+i+marchdir] > 0) {
						zz += '<span class=xtab>'+ uW.unitcost['unt'+i][0] +': '+ addCommas(a["unit"+i+marchdir])+'</span> ';
						marchMight += (a["unit"+i+marchdir]*parseInt(uW.unitmight["unt"+i]));
					}
				}
			}

			if (local_atkinc["m"+marchId]["fromSpellType"]) {
				var spell = uW.g_js_strings.spells['name_'+local_atkinc["m"+marchId]["fromSpellType"]];
				if (spell) {
					var spellstyle = 'color:#808;';
					zz +='<br><span class=xtab style="'+spellstyle+'"><b>*&nbsp;'+spell+'&nbsp;*</b></span>'
				}
			}

			if (Options.IncomingOptions.IncResources) {
				if ((a["gold"] > 0) || (a["resource1"] > 0) || (a["resource2"] > 0) || (a["resource3"] > 0) || (a["resource4"] > 0) || (local_atkinc["m"+marchId]["resource5"] > 0)) {
					zz+="<br>";
				}

				if (a["gold"] > 0) zz += '<span class=xtab>'+ResourceImage(GoldImage,uW.g_js_strings.commonstr.gold) + addCommas(a["gold"]) +'</span> ';
				if (a["resource1"] > 0) zz += '<span class=xtab>'+ResourceImage(FoodImage,uW.g_js_strings.commonstr.food) + addCommas(a["resource1"]) +'</span> ';
				if (a["resource2"] > 0) zz += '<span class=xtab>'+ResourceImage(WoodImage,uW.g_js_strings.commonstr.wood) + addCommas(a["resource2"]) +'</span> ';
				if (a["resource3"] > 0) zz += '<span class=xtab>'+ResourceImage(StoneImage,uW.g_js_strings.commonstr.stone) + addCommas(a["resource3"]) +'</span> ';
				if (a["resource4"] > 0) zz += '<span class=xtab>'+ResourceImage(OreImage,uW.g_js_strings.commonstr.ore) + addCommas(a["resource4"]) +'</span> ';
				if (local_atkinc["m"+marchId]["resource5"] > 0) zz += '<span class=xtab>'+ResourceImage(AetherImage,uW.g_js_strings.commonstr.aetherstone) + addCommas(local_atkinc["m"+marchId]["resource5"]) +'</span> ';
			}
			z += '<TD ';
			if (Options.ShowMarchMight && marchMight!=0) z += 'title="'+uW.g_js_strings.commonstr.might+': '+addCommas(marchMight)+'"';
			z += ' colspan=2 class=xtabBR>'+zz+'</td></tr>';
		}

		if (!incomingshow) {
			if (!incomingfiltered)
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>'+tx('No incoming marches')+'</div></td></tr>';
			else
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>'+tx('No incoming marches matching search parameters')+'</div></td></tr>';
		}

		z += '</table></div><br>';

		if (CheckForHTMLChange('INC','btIncomingMain',z)) {
			if (Options.DashboardOptions.RefreshSeed) jQuery('#btRefreshSeedInc').addClass("disabled");
			else ById('btRefreshSeedInc').addEventListener ('click', function() {setTimeout(function() {RefreshSeed();},250);}, false);
			ResetFrameSize('btIncoming',200,720);
		}
		for (var m in inctimes) {
			mt = inctimes[m];
			if (ById('marchtime'+m)) {
				ById('marchtime'+m).innerHTML = mt;
			}
		}
	},

	EverySecond : function () {
		var t = Incoming;

		try {
			if (((SecondLooper % Dashboard.GeneralInterval) == 1) || Dashboard.GeneralInterval == 1) {
				t.PaintIncoming();
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
}

/** Outgoing Marches Popup **/

var Outgoing = {
	Options	: {
		OutgoingStartState	: false,
		OutAttack			: true,
		OutScout			: true,
		OutReinforce		: true,
		OutReassign		: false,
		OutTransport		: false,
		OutYours			: false,
		OutReturning		: false,
		OutResources		: false,
	},

	init : function () {
		var t = Outgoing;
		DefaultWindowPos('btOutPos','main_engagement_tabs');
		if (GlobalOptions.InOutToggle) {
			AddPowerBarLink(tx('Outgoing'), 'PBPOutButton', Outgoing.ToggleOutgoing,function(me) {ResetWindowPos (me,'main_engagement_tabs',popOut);});
		}
		HTMLRegister['OUT']= {};

		if (!Options.OutgoingOptions) {
			Options.OutgoingOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.OutgoingOptions.hasOwnProperty(y)) {
					Options.OutgoingOptions[y] = t.Options[y];
				}
			}
		}
		if (Options.OutgoingOptions.OutgoingStartState) {t.ToggleOutgoing();}
	},

	ToggleOutgoing : function () {
		var t = Outgoing;

		ResetHTMLRegister('OUT','btOutgoingMain');

		if (popOut) {
			Options.OutgoingOptions.OutgoingStartState = popOut.toggleHide(popOut)
		}
		else
		{
			m = '<div id=btOutgoingButtons align="center"><TABLE width="100%"><tr>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.attack+'</td><TD class=xtab><INPUT id=OutAttackChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.scout+'</td><TD class=xtab><INPUT id=OutScoutChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.reinforce+'</td><TD class=xtab><INPUT id=OutReinforceChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.reassign+'</td><TD class=xtab><INPUT id=OutReassignChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.transport+'</td><TD class=xtab><INPUT id=OutTransportChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.returning+'</td><TD class=xtab><INPUT id=OutReturningChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+tx('To You')+'</td><TD class=xtab><INPUT id=OutYoursChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>'+uW.g_js_strings.commonstr.resources+'</td><TD class=xtab><INPUT id=OutResChk type=checkbox /></td>';
			m += '</tr></table></div><div style="max-height:700px; overflow-y:scroll" id=btOutgoingMain></div><br>';

			popOut = new CPopup('btOutgoing', Options.btOutPos.x, Options.btOutPos.y, 720, 200, true, Outgoing.close);
			popOut.getMainDiv().innerHTML = m;
			popOut.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;'+tx('Outgoing Marches')+'</B></DIV>';

			ToggleOption('OutgoingOptions','OutAttackChk','OutAttack');
			ToggleOption('OutgoingOptions','OutScoutChk','OutScout');
			ToggleOption('OutgoingOptions','OutReinforceChk','OutReinforce');
			ToggleOption('OutgoingOptions','OutReassignChk','OutReassign');
			ToggleOption('OutgoingOptions','OutTransportChk','OutTransport');
			ToggleOption('OutgoingOptions','OutReturningChk','OutReturning');
			ToggleOption('OutgoingOptions','OutYoursChk','OutYours');
			ToggleOption('OutgoingOptions','OutResChk','OutResources');

			popOut.show(true);
			Options.OutgoingOptions.OutgoingStartState = true;
		}
		saveOptions();
	},

	close : function () {
		Options.OutgoingOptions.OutgoingStartState = false;
		Options.btOutPos = popOut.getLocation();
		saveOptions();
		popOut=null;
	},

	PaintOutgoing : function () {
		var t = Outgoing;
		var z = '';
		var r = 0;
		var outgoingshow = false;
		var outgoingfiltered = false;
		var outtimes = {};

		var bclass = "brown11";
		if (RefreshingSeed || Options.DashboardOptions.RefreshSeed) bclass += " disabled";

		var z = '<div align="center"><TABLE cellSpacing=0 width=98% height=0%><tr><td width="18" class="xtabHD">&nbsp;</td><td width="60" class="xtabHD"><b>'+uW.g_js_strings.commonstr.time+'</b></td><td width="120" class="xtabHD"><b>'+tx('From')+'</b></td><td width="120" class="xtabHD"><b>'+uW.g_js_strings.commonstr.target+'</b></td><td class="xtabHD"><b>'+uW.g_js_strings.commonstr.troops+'</b></td><td class="xtabHD" style="opacity:1.0"; align="right"><a id=btRefreshSeedOut class="inlineButton btButton '+bclass+'"><span>'+tx('Refresh')+'</span></a></td></tr>';

		for(n in out) {
			var a = out[n];
			var icon, hint, marchtime, fromcity, totile, tocity, toname, marchdir, tocoords;

			var marchId = a.marchId;
			var marchStatus = parseInt(a.marchStatus);
			var marchType = parseInt(a.marchType);
			var marchMight = 0;

			if (marchType == 10) marchType=4; // Change Dark Forest type to Attack!

			var from = Cities.byID[a.marchCityId];if(!from)continue; // tampermonkey fix
			fromcity = CityLink(from);

			var now = unixTime();
			var destinationUnixTime = a["destinationUnixTime"] - now;
			var returnUnixTime = a["returnUnixTime"] - now;

			if ((returnUnixTime <= 0) && ((marchStatus == 8) || (marchStatus == 0))) continue; // never show returned march once completed

			if ((destinationUnixTime < 0) || (marchStatus == 8) || (marchStatus == 2))
				marchdir = "Return";
			else
				marchdir = "Count";

			totile = "";
			tocity = "";
			toname = "";
			for (var i=0; i<Seed.cities.length;i++) {
				if (Seed.cities[i][2] == parseInt(a["toXCoord"]) && Seed.cities[i][3] == parseInt(a["toYCoord"])) {tocity = CityLink(Cities.byID[Seed.cities[i][0]]);break; }
			}
			if (tocity == "") {
				totile = tileTypes[parseInt(a["toTileType"])];
				if (a["toTileType"] == 51) {
					if (!a["toPlayerId"]) { totile = ""; }
					else { if (a["toPlayerId"] == 0) totile = tx('Barb Camp'); }
				}
				totile = 'Lvl '+a["toTileLevel"]+' '+totile;
			}

			if (a["toPlayerId"] && (a["toPlayerId"] != 0)) {
				if (a["toPlayerId"] == uW.tvuid) {
					if (tocity == 0) {toname = tx('Yourself')}
				}
				else {
					if (a.players && a.players['u'+a.toPlayerId]) {
						toname = MonitorLink(a.toPlayerId,a.players['u'+a.toPlayerId].n);
					}
					else {
						if (Seed.players['u'+a.toPlayerId]) {
							toname = MonitorLink(a.toPlayerId,Seed.players['u'+a.toPlayerId].n);
						}
					}
					if (toname == "") { updatePlayers (a.toPlayerId); } // let's fix it!
				}
			}

			var iconType = marchType;

			if (destinationUnixTime >= 0) {
				if (destinationUnixTime < (60)) { marchtime = '<span style="color:#f00">'+uW.timestr(destinationUnixTime)+'</span>'; }
				else { marchtime = uW.timestr(destinationUnixTime); }
			}
			else {
				if (marchStatus == 2) {
					marchtime = uW.g_js_strings.commonstr.encamped;
					iconType = 102;
				}
				else {
					if (marchStatus == 8) {
						marchtime = uW.timestr(returnUnixTime);
						iconType = 8;
					}
					else {
						marchtime = tx("Waiting");
						iconType = 102;
					}
				}
			}

			outtimes[marchId] = marchtime;

			if (!a.toXCoord || (tocity != "")) {tocoords = "";}
			else {tocoords = coordLink(a.toXCoord,a.toYCoord);}

			hint = "";
			switch (marchType) {
				case 1: hint=uW.g_js_strings.commonstr.transport;break;
				case 2: hint=uW.g_js_strings.commonstr.reinforce;break;
				case 3: hint=uW.g_js_strings.commonstr.scout;break;
				case 4: hint=uW.g_js_strings.commonstr.attack;break;
				case 5: hint=uW.g_js_strings.commonstr.reassign;break;
			}

			switch (iconType) {
				case 1: icon=TransportImage;break;
				case 2: icon=ReinforceImage;break;
				case 3: icon=ScoutImage;break;
				case 4: icon=AttackImage;break;
				case 5: icon=ReassignImage;break;
				case 8: icon=ReturnImage;break;
				case 102: icon=ReinforceImage;break;
			}
			hint=tx('Recall March')+" ("+marchId+")";

			outgoingfiltered = true;

			/* Apply Filters */

			if ((marchType == 1) && !Options.OutgoingOptions.OutTransport) continue;
			if ((marchType == 2) && !Options.OutgoingOptions.OutReinforce) continue;
			if ((marchType == 5) && !Options.OutgoingOptions.OutReassign) continue;

			if ((marchType == 3) && !Options.OutgoingOptions.OutScout) continue;
			if ((marchType == 4) && !Options.OutgoingOptions.OutAttack) continue;

			if (((marchdir == "Return") && (marchStatus != 2) && (marchtime != "Waiting")) && !Options.OutgoingOptions.OutReturning) continue;
			if (((toname == "Yourself") || (tocity != 0)) && !Options.OutgoingOptions.OutYours && marchType != 5) continue; // irrelevent for reassigns!

			outgoingshow = true;

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="'+rowClass+'"><TD class=xtab><a id="btRecall'+a.marchId+'" onclick="btRecall('+ a.marchId +')"><img src='+icon+' title='+hint+'></a></td>';
			z += '<TD class=xtab id="omarchtime'+marchId+'">&nbsp;</td>';
			z += '<TD class=xtabBR>';
			if (fromcity != "") z += '<span class=xtab>'+fromcity+'</span> ';
			z += '</td><TD class=xtabBR>';
			if (toname != "") { z+= '<span class=xtab>'+toname+'</span> '; }
			if (totile != "") { z+= '<span class=xtab>'+totile+'</span> '; }
			if (tocity != "") { z+= '<span class=xtab>'+tocity+'</span> '; }
			if (tocoords != "") { z+= '<span class=xtab>'+tocoords+'</span>'; }
			z += '</td>';

			var zz = '';
			if (a["championInfo"]) { // stats here are sort of obsolete, because it uses city champ data, but kept in for completeness...
				marchchamp = "<table cellspacing=0 class=xtab><tr><td colspan=2><b>"+a["championInfo"].name+"</b></td></tr><tr><td colspan=2><b>"+uW.g_js_strings.report_view.champion_stats+"</b></td></tr>";
				var gotchamp = false;
				if (a["championInfo"].effects) {
					if (a["championInfo"].effects[1] && !(a["championInfo"].effects[1] instanceof Array) && typeof(a["championInfo"].effects[1]) === "object") {
						got202 = false;
						for (var cy in a["championInfo"].effects[1]) {
							// missing bonus damage?
							if ((cy == '202') && gotchamp) {got202 = true;}
							if ((cy == '203') && !got202) { marchchamp += "<tr><td>"+uW.g_js_strings.effects.name_202+"</td><td>0</td></tr>"; }
							str = uW.g_js_strings.effects['name_'+cy];
							if (str && str!= "") {
								gotchamp = true;
								marchchamp += "<tr><td>"+str+"</td><td>"+a["championInfo"].effects[1][cy]+"</td></tr>";
							} else { break;	}
						}
					}
					if (!gotchamp) { marchchamp += '<tr><td colspan=2><i>'+tx('None Available')+'</i></td></tr>'; }
					marchchamp+="<tr><td colspan=2><b>"+uW.g_js_strings.report_view.troop_stats+"</b></td></tr>";
					var gottroop = false;
					if (a["championInfo"].effects[2] && !(a["championInfo"].effects[2] instanceof Array) && typeof(a["championInfo"].effects[2]) === "object") {
						for (var ty in a["championInfo"].effects[2]) {
							str = uW.g_js_strings.effects['name_'+ty];
							if (str && str!= "") {
								gottroop = true;
								marchchamp += "<tr><td>"+str+"</td><td>"+a["championInfo"].effects[2][ty]+"</td></tr>";
							} else { break;	}
						}
					}
					if (!gottroop) { marchchamp += '<tr><td colspan=2><i>'+tx('None Available')+'</i></td></tr>'; }
					marchchamp+="</table>";
				}
				zz +='<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="btoutmarchchamp'+a.marchId+'td"><input type="hidden" id="btoutmarchchamp'+a.marchId+'effects" value="'+marchchamp+'" /><a><img id="btoutmarchchamp'+a.marchId+'" onMouseover="btCreateChampionPopUp(this,'+a.fromCityId+',true);" height=14 class=btTop src="'+ShieldImage+'"></a></td><td class=xtab>'+tx('Champion')+': '+a["championInfo"].name+'&nbsp;</td></tr></table>';
			}
			if ((a["knightId"] > 0) && (!a["knightCombat"])) {
				for (var i in Seed.knights["city"+a.marchCityId]) {
					if (i == ("knt" + a["knightId"])) {
						Combat = Seed.knights["city"+a.marchCityId][i]["combat"];
						if (Seed.knights["city"+a.marchCityId][i]["combatBoostExpireUnixtime"] > unixTime()) {	Combat *= 1.25;	}
						a["knightCombat"] = Combat;
					}
				}
			}

			if (a.btIncomplete == true && a.marchType!=9 && Options.FetchMarchInfo) {marchdir = "Count";	} // no return info yet
			if (a["knightId"] > 0) zz +='<span class=xtab>'+uW.g_js_strings.commonstr.knight+' (Atk:'+ a["knightCombat"]+')</span> ';
			for (var ui in CM.UNIT_TYPES){
				i = CM.UNIT_TYPES[ui];
				if((a["unit"+i+"Count"] > 0) || (a["unit"+i+"Return"] > 0)) {
					trpcol = Options.Colors.PanelText;
					if ((marchdir == "Return") && (a["unit"+i+"Return"] < a["unit"+i+"Count"])) { trpcol = '#f00'; }
					zz += '<span class=xtab>'+ uW.unitcost['unt'+i][0] +': <span class=xtab style="color:'+trpcol+'">'+ addCommas(a["unit"+i+marchdir])+'</span></span> ';
					marchMight += (a["unit"+i+marchdir]*parseInt(uW.unitmight["unt"+i]));
				}
			}

			if (a["fromSpellType"]) {
				var spell = uW.g_js_strings.spells['name_'+a["fromSpellType"]];
				if (spell) {
					var spellstyle = 'color:#808;';
					zz +='<br><span class=xtab style="'+spellstyle+'"><b>*&nbsp;'+spell+'&nbsp;*</b></span>'
				}
			}

			if (Options.OutgoingOptions.OutResources) {
				if ((a["gold"] > 0) || (a["resource1"] > 0) || (a["resource2"] > 0) || (a["resource3"] > 0) || (a["resource4"] > 0) || (a["resource5"] > 0)) {
					zz+="<br>";
				}

				if (a["gold"] > 0) zz += '<span class=xtab>'+ResourceImage(GoldImage,uW.g_js_strings.commonstr.gold) + addCommas(a["gold"]) +'</span> ';
				if (a["resource1"] > 0) zz += '<span class=xtab>'+ResourceImage(FoodImage,uW.g_js_strings.commonstr.food) + addCommas(a["resource1"]) +'</span> ';
				if (a["resource2"] > 0) zz += '<span class=xtab>'+ResourceImage(WoodImage,uW.g_js_strings.commonstr.wood) + addCommas(a["resource2"]) +'</span> ';
				if (a["resource3"] > 0) zz += '<span class=xtab>'+ResourceImage(StoneImage,uW.g_js_strings.commonstr.stone) + addCommas(a["resource3"]) +'</span> ';
				if (a["resource4"] > 0) zz += '<span class=xtab>'+ResourceImage(OreImage,uW.g_js_strings.commonstr.ore) + addCommas(a["resource4"]) +'</span> ';
				if (a["resource5"] > 0) zz += '<span class=xtab>'+ResourceImage(AetherImage,uW.g_js_strings.commonstr.aetherstone) + addCommas(a["resource5"]) +'</span> ';
			}
			z += '<TD ';
			if (Options.ShowMarchMight && marchMight!=0) z += 'title="'+uW.g_js_strings.commonstr.might+': '+addCommas(marchMight)+'"';
			z += ' colspan=2 class=xtabBR>'+zz+'</td></tr>';
		}

		if (!outgoingshow) {
			if (!outgoingfiltered)
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>'+tx('No outgoing marches')+'</div></td></tr>';
			else
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>'+tx('No outgoing marches matching search parameters')+'</div></td></tr>';
		}

		z += '<tr><td class=xtab colspan="6"><div class="ErrText" align="center" id=btOutErr>&nbsp;</div></td></tr></table></div><br>';

		if (CheckForHTMLChange('OUT','btOutgoingMain',z)) {
			if (Options.DashboardOptions.RefreshSeed) jQuery('#btRefreshSeedOut').addClass("disabled");
			else ById('btRefreshSeedOut').addEventListener ('click', function() {setTimeout(function() {RefreshSeed();},250);}, false);
			ResetFrameSize('btOutgoing',200,720);
		}
		for (var m in outtimes) {
			mt = outtimes[m];
			if (ById('omarchtime'+m)) {
				ById('omarchtime'+m).innerHTML = mt;
			}
		}
	},

	EverySecond : function () {
		var t = Outgoing;

		try {
			if (((SecondLooper % Dashboard.GeneralInterval) == 1) || Dashboard.GeneralInterval == 1) {
				t.PaintOutgoing();
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

}

/** QUICK SCOUT **/

QuickScout = {
	init : function () {
		var t = QuickScout;

		try {
			// add new options to the context menu

			CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("bookmark");
			CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("aamod");
			CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("qqmod");
			if (Options.OneClickAttack)
				CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("qamod");
			var cityType = CM.CITY_STATUS.ANOTHER_PLAYER_CITY_AND_NOT_IN_YOUR_ALLIANCE;
			CM.ContextMenuMapController.prototype.MapContextMenus.City[cityType].push("aamod");
			CM.ContextMenuMapController.prototype.MapContextMenus.City[cityType].push("qqmod");
			if (Options.OneClickAttack)
				CM.ContextMenuMapController.prototype.MapContextMenus.City[cityType].push("qamod");
			var wildContext;
			wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.EnemyWilderness;
			for (var wild in wildContext) {
				wildContext[wild].push("aamod");
				wildContext[wild].push("qqmod");
				if (Options.OneClickAttack)
					wildContext[wild].push("qamod");
			}
			wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.Wilderness;
			for (var wild in wildContext) {
				wildContext[wild].push("aamod");
				wildContext[wild].push("qqmod");
				if (Options.OneClickAttack)
					wildContext[wild].push("qamod");
			}
			wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.FriendlyWilderness;
			for (var wild in wildContext) {
				wildContext[wild].push("aamod");
				wildContext[wild].push("qqmod");
				if (Options.OneClickAttack)
					wildContext[wild].push("qamod");
			}

			// add actions to the menu item
			var mod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo',
			[['default:', 'case "qqmod":' +
				' b.text = "'+tx('QuickScout')+'"; b.color = "green"; ' +
				' b.action = function () { ' +
				' quickscout(e); ' +
				' }; ' +
				' d.push(b); break; ' +
				'case "qamod":' +
				' b.text = "'+tx('QuickAttack')+'"; b.color = "red"; ' +
				' b.action = function () { ' +
				' quickattack(e); ' +
				' }; ' +
				' d.push(b); break; ' +
				'case "aamod":' +
				' b.text = "'+tx('Auto Attack')+'"; b.color = "blue"; ' +
				' b.action = function () { ' +
				' autoattack(e); ' +
				' }; ' +
				' d.push(b); break; ' +
				' default: ']]);

			mod.setEnable(true);

			function FNQuickScout(e) {
				// send 1 scout
				var params = uW.Object.clone(uW.g_ajaxparams);
				params.cid = uW.currentcityid;
				params.type = 3
				params.kid = 0
				params.xcoord = e.tile.x;
				params.ycoord = e.tile.y;
				params["u"+Options.QuickScoutTroops] = 1;
				params.gold = 0;
				params.r1 = 0;
				params.r2 = 0;
				params.r3 = 0;
				params.r4 = 0;
				params.r5 = 0;

				March.addMarch(params, function(rslt){
					if (rslt.ok) {
						if (e.tile.level == 0 && (Options.FetchMarchInfo)) QuickScout.fetchmarch(rslt.marchId,QuickScout.PlayerPopup); // mist scout
					}
					else {
						uW.Modal.showAlert(uW.printLocalError(rslt.error_code, rslt.msg, rslt.feedback));
					}
				}, true); // force march so it never gets queued
			}
			uWExportFunction('quickscout', FNQuickScout);

			function FNQuickScoutSearch (x,y,cid,auto) {
				// if auto check rally slots

				if (auto) {
					var marches = parseIntNan(March.getMarchSlots(cid));
					var maxmarches = parseIntNan(March.getTotalSlots(cid));
					var keepfree = Number(Options.FreeRallySlots);
					if ((marches+keepfree) >= maxmarches) {
						divid = 'pbsrch_'+x+'_'+y;
						if (ById(divid)) {
							msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tx('Rally Point Full')+'!</span>&nbsp;&nbsp;<SPAN onclick="quickscoutsearch('+x+','+y+','+cid+');return false;"><A class=xlink>'+tx("QuickScout")+'</a></span>';
							ById(divid).innerHTML = msg;
						}
						if (Tabs.Search) { Tabs.Search.QSMarching[x+'_'+y] = 0; }
						return;
					}
				}

				// send 1 scout
				var params = uW.Object.clone(uW.g_ajaxparams);
				if (cid==null)
					params.cid = uW.currentcityid;
				else
					params.cid = cid;
				params.type = 3
				params.kid = 0
				params.xcoord = x;
				params.ycoord = y;
				params["u"+Options.QuickScoutTroops] = 1;
				params.gold = 0;
				params.r1 = 0;
				params.r2 = 0;
				params.r3 = 0;
				params.r4 = 0;
				params.r5 = 0;

				March.addMarch(params, function(rslt){
					if (rslt.ok) {
						QuickScout.fetchmarch(rslt.marchId,QuickScout.FillSearchDiv); // mist scout
					}
					else {
						divid = 'pbsrch_'+x+'_'+y;
						if (!ById(divid)) return;
						var msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tx('Error Code')+' - '+rslt.error_code+'</span>&nbsp;&nbsp;<SPAN onclick="quickscoutsearch('+x+','+y+','+cid+');return false;"><A class=xlink>'+tx("QuickScout")+'</a></span>';
						if(rslt.error_code == 208 || rslt.error_code == 207) { // errors that mean you can never scout
							if (rslt.error_code == 208) {
								msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tx('Target is truced - Cannot scout')+'!</span>';
							}
							else {
								msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tx('You are truced - Cannot scout another player')+'!</span>';
							}
							// update search results .. find correct row
							var t = Tabs.Search;
							if (t) {
								var numRows = t.mapDat.length;
								for (var i=0; i<numRows; i++){
									if (t.mapDat[i][0] == x && t.mapDat[i][1] == y) {
										t.mapDat[i][6] = 0;
										t.mapDat[i][8] = msg;
									}
								}
							}
						}
						if(rslt.error_code == 210) { // errors that mean you may be able to scout in a bit!
							msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tx('Rally Point Full')+'!</span>&nbsp;&nbsp;<SPAN onclick="quickscoutsearch('+x+','+y+','+cid+');return false;"><A class=xlink>'+tx("QuickScout")+'</a></span>';
						}
						ById(divid).innerHTML = msg;
						if (Tabs.Search) {
							Tabs.Search.scouted++;
							Tabs.Search.updateMistProgress();
						}
					}
					if (Tabs.Search) { Tabs.Search.QSMarching[x+'_'+y] = 0; }
				});
			}
			uWExportFunction('quickscoutsearch', FNQuickScoutSearch);

			function FNQuickAttack (e) {
				if (Options.OneClickAttackPreset == 0 || !Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset]) {
					QuickMarch.MapClick(e.tile.x,e.tile.y);
					return;
				}

				// send selected preset on attack

				var knt = getAvailableKnights(uW.currentcityid);
				if (!knt[0]) {
					QuickMarch.MapClick(e.tile.x,e.tile.y);
					return;
				}

				var params = uW.Object.clone(uW.g_ajaxparams);
				params.cid = uW.currentcityid;
				params.type = 4;
				params.kid = knt[0].ID;
				if (e.tile.type=="megalith") { params.kid = 0; }
				params.xcoord = e.tile.x;
				params.ycoord = e.tile.y;
				params.gold = 0;
				params.r1 = 0;
				params.r2 = 0;
				params.r3 = 0;
				params.r4 = 0;
				params.r5 = 0;

				for (var ui in CM.UNIT_TYPES) {
					var i = CM.UNIT_TYPES[ui];
					params["u"+i] = 0;
					if (Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset][i]) {
						params["u"+i] = parseIntNan(Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset][i]);
					}
				}

				var iused = new Array();
				for (var i = 0; i < QuickMarch.ItemList.length; i++) {
					if (Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset]["item"+QuickMarch.ItemList[i]] == true && Seed.items["i"+QuickMarch.ItemList[i]]) {
						iused.push(QuickMarch.ItemList[i]);
					}
				}
				params.items = iused.join(",");

				params.champid = 0;
				if (Options.QuickMarchOptions.AutoChamp) {
					citychamp = getCityChampion(uW.currentcityid);
					if (citychamp.championId && citychamp.status != "10") { params.champid = citychamp.championId; }
				}

				if (Options.QuickMarchOptions.AutoSpell) {
					var spells = getSpellData(uW.currentcityid);
					if (spells.spellavailable && !spells.cooldownactive) {
						params.bs = SpellTypes[faction];
					}
				}

				March.addMarch(params, function(rslt){
					if (!rslt.ok) {
						uW.Modal.showAlert(uW.printLocalError(rslt.error_code, rslt.msg, rslt.feedback));
					}
				}, true); // force march so it never gets queued
			}

			uWExportFunction('quickattack', FNQuickAttack);

			function FNAutoAttack (e) {
				Tabs.Attack.RouteObject = null; // clear route object
				Tabs.Attack.NewRoute(e.tile.x,e.tile.y);
				ById('bttcAttack').click();
			};

			uWExportFunction('autoattack', FNAutoAttack);

		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	fetchmarch : function (mid,notify) {
		var t = QuickScout;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = mid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMarch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (!rslt.ok){ return; }
				if (rslt.march.toPlayerId != 0) {
					t.fetchmarchPlayerInfo(rslt.march.toPlayerId, notify, rslt.march)
				}
				else {
					notify({errorMsg:"<div>"+tx('There is no longer a city at this location')+"</div>"}, rslt.march);
				}
			},
			onFailure: function () {notify ({errorMsg:'AJAX error'});}
		},true);
	},

	fetchmarchPlayerInfo : function (uid, notify, march) {
		var t = QuickScout;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { notify (rslt,march); },
			onFailure: function () { notify ({errorMsg:'AJAX error'}); },
		},true);
	},

	PlayerPopup : function (rslt,march) {
		var t = QuickScout;
		if(rslt.errorMsg) {
			Dashboard.Recall(march.marchId);
			uW.Modal.showAlert(rslt.errorMsg);
			return;
		}

		var u = rslt.userInfo[0];

		var a = 'None';
		if (u.allianceName)
			a = u.allianceName +' ('+ getDiplomacy(u.allianceId) + ')';

		var n = '<div> <b>Name:</b> ' + u.genderAndName + '<br/><b>Might:</b> ' + addCommas(parseInt(u.might)) +
		'<br/><b>' + uW.g_js_strings.commonstr.alliance+':</b> '+ a +
		'<br/><b>'+tx('City Co-ords')+':</b> ('+ march.toXCoord + ',' + march.toYCoord + ')' +
		'<br/><b>'+tx('City Level')+':</b> '+ march.toTileLevel +
		"</div>";

		ModalMultiButton({
			buttons: [{
				txt: "Recall Scout",
				exe: function () {
					uW.attack_recall(march.marchId, 2, uW.currentcityid);
					uW.Modal.hideModal();
				}
			}, {
				txt: "Post to Chat",
				exe: function () {
					cText = 'Name: ' + u.genderAndName + '||UID: ' + enFilter(u.userId)+'||Might: ' + addCommas(parseInt(u.might)) +
							'||' + uW.g_js_strings.commonstr.alliance+': '+ a +
							'||City Co-ords: ('+ march.toXCoord + ',' + march.toYCoord + ')' +
							'||City Level: '+ march.toTileLevel;
					cText = ":::. |QuickScout Report|| "+ cText;
					sendChat ("/a "+cText);
				}
			}, {
				txt: "Monitor",
				exe: function () {
					uW.btMonitorExternalCallUID(u.userId);
				}
			}, {
				txt: uW.g_js_strings.commonstr.cancel,
				exe: function () {
					uW.Modal.hideModal();
				}
			}],
			body: n,
			title: "QuickScout Result"
		});
	},

	FillSearchDiv : function (rslt,march) {
		setTimeout (Dashboard.Recall,2000,march.marchId);
		divid = 'pbsrch_'+march.toXCoord+'_'+march.toYCoord;
		if (!ById(divid)) return;

		if(rslt.errorMsg) {
			var n = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Misted Plain';
			ById(divid).innerHTML = n;
			// update search results .. find correct row
			var t = Tabs.Search;
			if (t) {
				var numRows = t.mapDat.length;
				for (var i=0; i<numRows; i++){
					if (t.mapDat[i][0] == march.toXCoord && t.mapDat[i][1] == march.toYCoord) {
						t.mapDat[i][4] = parseIntNan(march.toTileLevel);
						t.mapDat[i][6] = 0;
						t.mapDat[i][8] = n;
						t.mapDat[i][9] = 0;
						t.mapDat[i][10] = '';
						t.mapDat[i][11] = 0;
					}
				}
			}
			Tabs.Search.scouted++;
			Tabs.Search.updateMistProgress();
			return;
		}

		var rowStyle = 'style="opacity:0.5;"'; // misted
		var status = '<img title="Offline" style="vertical-align:bottom" src="'+OFFLINE+'"/>';
		var u = rslt.userInfo[0];
		var alli = '---';
		var aID = parseIntNan(u.allianceId);
		if (aID!=0) {
			alli = u.allianceName;
		}

		var n = '<td '+rowStyle+' class=xtab nowrap>'+status+PlayerLink(u.userId,u.name)+'</td><td '+rowStyle+' class=xtab>&nbsp;</td><td '+rowStyle+' class=xtab align=right>'+addCommas(parseIntNan(u.might))+'</span></td><td '+rowStyle+' class=xtab><span style='+DiplomacyColours(aID)+'>'+alli+'</span></td>';
		ById(divid).outerHTML = n;

		// update search results .. find correct row

		var t = Tabs.Search;
		if (t) {
			var numRows = t.mapDat.length;
			for (var i=0; i<numRows; i++){
				if (t.mapDat[i][0] == march.toXCoord && t.mapDat[i][1] == march.toYCoord) {
					t.mapDat[i][4] = parseIntNan(march.toTileLevel);
					t.mapDat[i][5] = march.toCityId;
					t.mapDat[i][6] = u.userId;
					t.mapDat[i][8] = u.name;
					t.mapDat[i][9] = parseIntNan(u.might);
					t.mapDat[i][10] = alli;
					t.mapDat[i][11] = aID;

					// fire off player online query
					var uList = [];
					uList.push(u.userId);
					getOnline(uList,function(r) {
						var t = Tabs.Search;
						var numRows = t.mapDat.length;
						for (var u in r.data) {
							for (var i=0; i<numRows; i++) {
								if (t.mapDat[i][6] == u) { t.mapDat[i][12] = r.data[u]?1:0;}
							}
						}
						t.dispMapTable ();
					});
					Tabs.Search.scouted++;
					Tabs.Search.updateMistProgress();
				}
			}
		}
	},
}

/** Quick March Popup **/

var QuickMarch = {
	LoopCounter : 0,
	Options : {
		QuickMarchStartState	: false,
		StartCoords				: {x:'',y:''},
		AutoKnight				: false,
		AutoChamp				: false,
		AutoSpell				: false,
		AllTroops				: false,
		MarchPresets			: {},
	},
	SourceCity: {},
	MapX : null,
	MapY : null,
	MapC : null,
	MapLaunch : false,
	DestLookup : false,
	MapAjax : new CMapAjax(),
	Blocks : [],
	targetType : null,
	dcp0 : null,
	dcp1 : null,
	ItemList : [55, 57, 58, 931, 932, 59, 293, 294, 299],
	MaxTroops : 0,
	MaxLoad : 0,
	NextPresetNumber : 0,
	InitPresetNumber : 0,
	distance : 0,
	Food : 0,
	Wood : 0,
	Stone : 0,
	Ore : 0,
	Gold : 0,
	Aether : 0,

	init : function () {
		var t = QuickMarch;
		if (GlobalOptions.MarchPlusToggle) {
			AddPowerBarLink(tx('March+'), 'PBPMarchButton', function() { QuickMarch.ToggleQuickMarch(false); },function(me) {ResetWindowPos (me,'main_engagement_tabs',popMarch);});
		}

		// add new options to the context menu

		CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("portal"); // add portal to mists
		for (var a in CM.ContextMenuMapController.prototype.MapContextMenus) {
			for (var b in CM.ContextMenuMapController.prototype.MapContextMenus[a]) {
				CM.ContextMenuMapController.prototype.MapContextMenus[a][b].unshift("qmmod");
			}
		}

		var mod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo',
		[['default:', 'case "qmmod":' +
			' b.text = "'+tx('March+')+'"; b.color = "green"; ' +
			' b.action = function () { ' +
			' quickmarch(e); ' +
			' }; ' +
			' d.push(b); break; ' +
			' default: ']]);
		if (mod.isAvailable()) {
			mod.setEnable(true);
			// fix duplicate trade button
			var mod2 = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonTypes', [['d.buttons[0]', 'd.buttons[1]'],['d.buttons.splice(0', 'd.buttons.splice(1']]);
			mod2.setEnable(true);
		}

		function FNQuickMarch (e) {
			QuickMarch.MapClick(e.tile.x,e.tile.y);
		}

		function ApplyingBoost() {
			var div = ById('btboostmsg');
			if (div) { div.innerHTML = tx('Applying Boost')+'...'; }
		}

		uWExportFunction('quickmarch', FNQuickMarch);
		uWExportFunction('QMspeedupSpell',QuickMarch.speedupSpell);
		uWExportFunction('btApplyingBoost', ApplyingBoost);

		DefaultWindowPos('btMarchPos','main_engagement_tabs');

		if (!Options.QuickMarchOptions) {
			Options.QuickMarchOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.QuickMarchOptions.hasOwnProperty(y)) {
					Options.QuickMarchOptions[y] = t.Options[y];
				}
			}
		}

		if (Options.QuickMarchOptions.QuickMarchStartState) {
			t.MapX = Options.QuickMarchOptions.StartCoords.x;
			t.MapY = Options.QuickMarchOptions.StartCoords.y;
			t.MapLaunch = true;
			t.ToggleQuickMarch(true);
		}
	},

	ToggleQuickMarch : function (init) {
		var t = QuickMarch;

		if (popMarch) {
			Options.QuickMarchOptions.QuickMarchStartState = popMarch.toggleHide(popMarch)
		}
		else {
			t.Food = 0;
			t.Wood = 0;
			t.Stone = 0;
			t.Ore = 0;
			t.Gold = 0;
			t.Aether = 0;

			m = '<div id=btMarchCoords align="center">';
			m += '<table align=center width=98% cellpadding=0 cellspacing=2 class=xtab style="padding-right:0px;"><tr><td style="padding-left:0px;padding-right:0px;"><div class=divHeader>&nbsp;'+tx('FROM')+'</div></td><td style="padding-left:0px;padding-right:0px;"><div class=divHeader>&nbsp;'+tx('TO')+'</div></td></tr>';
			m += '<tr><td width=50% style="border:1px solid;vertical-align:top;"><table cellpadding=0 cellspacing=0 width=100% class=xtab style="padding-left:6px;padding-right:0px;"><tr height=20><td colspan=3><span id=QMFromCity>&nbsp;</span></td></tr>';
			m += '<tr height=20><td colspan=3><a class=xlink id=QMSelClosest>'+tx('Select Closest City to Destination')+'</a></td></tr>';
			m += '<tr height=20><td colspan=2>'+tx('Rally Point')+':&nbsp;<span id=QMRP>&nbsp;</span></td><td align=right>'+tx('Auto')+'</td></tr>';
			m += '<tr height=20><td width=50>'+uW.g_js_strings.commonstr.knight+'&nbsp;</td><td><SELECT id=QMKnight class=btInput style="max-width:160px;"></select></td><td align=right><INPUT type=checkbox id=QMAutoKnight '+(Options.QuickMarchOptions.AutoKnight?'CHECKED':'')+' /></td></tr>';
			m += '<tr height=20><td>'+tx('Champ')+'&nbsp;</td><td><span id=QMChampSpan><SELECT id=QMChamp class=btInput style="max-width:160px;"></select></span><span id=QMNoChampSpan class=divHide>&nbsp;</span></td><td align=right><INPUT type=checkbox id=QMAutoChamp '+(Options.QuickMarchOptions.AutoChamp?'CHECKED':'')+' /></td></tr>';
			m += '<tr height=40><td style="padding-top:2px;vertical-align:top;">'+tx('Spell')+'&nbsp;</td><td style="padding-top:2px;vertical-align:top;"><span id=QMSpellSpan><SELECT id=QMSpell class=btInput style="max-width:160px;"></select></span><span id=QMNoSpellSpan class=divHide>&nbsp;</span></td><td style="padding-top:2px;vertical-align:top;" align=right><INPUT type=checkbox id=QMAutoSpell '+(Options.QuickMarchOptions.AutoSpell?'CHECKED':'')+' /></td></tr>';
			m += '</table></td><td width=50% style="border:1px solid;vertical-align:top;"><table cellpadding=0 cellspacing=0 width=100% class=xtab style="padding-left:6px;padding-right:0px;"><tr height=20><td>X:<input type=text class=btInput id=QMToX size=3>&nbsp;Y:<input type=text class=btInput id=QMToY size=3></td><td>'+tx('Dist')+':&nbsp;<b><span id=QMDist>&nbsp;<span></b></td><td align=right><div id=QMLookupButtonDiv><a id=QMLookupButton class="inlineButton btButton brown8"><span>'+tx('Lookup')+'</span></a>&nbsp;<a id=QMMapButton class="inlineButton btButton brown8"><span>'+tx('Map')+'</span></a></div></td></tr>';
			m += '<tr height=20><td colspan=3 id=QMLookupInfo>&nbsp;</td></tr>';
			m += '<tr height=20><td colspan=3 id=QMTime>&nbsp;</td></tr>';
			m += '<tr height=20><td colspan=3><b>'+tx('Quick Links')+':</b></td></tr>';
			m += '<tr height=20><td colspan=3><span id=QMToCity>&nbsp;</span></td></tr>';
			m += '<tr height=20><td width=50><a class=xlink title="'+tx('click to load bookmarks')+'" id=QMFetchBookmarks>'+tx('Bookmarks')+':</a></td><td colspan=2><select title="'+tx('click text to load bookmarks')+'" id=QMBookmarks class=btInput style="max-width:180px;"></select></td></tr>';
			m += '<tr height=20><td><a class=xlink title="'+tx('click to load alliance city co-ords')+'" id=QMFetchAlliance>'+uW.g_js_strings.commonstr.alliance+':</a></td><td colspan=2><select title="'+tx('click text to load alliance city co-ords')+'" id=QMAlliance class=btInput style="max-width:180px;"></select></td></tr>';
			m += '</table></td></tr></table></div>';
			m += '<div id=btMarchMessages align="center" style="height:30px;max-height:30px;overflow-y:auto;">&nbsp;</div>';
			m += '<div id=btMarchAction align="center"><input type=button id=QMScout value="'+uW.g_js_strings.commonstr.scout+'">&nbsp;<input type=button id=QMAttack value="'+uW.g_js_strings.commonstr.attack+'">&nbsp<input type=button id=QMReassign value="'+uW.g_js_strings.commonstr.reassign+'">&nbsp;<input type=button id=QMReinforce value="'+uW.g_js_strings.commonstr.reinforce+'">&nbsp;<input type=button id=QMReinforceFood value="'+uW.g_js_strings.commonstr.reinforce+' + '+tx("Max Food")+'">&nbsp;<input type=button id=QMTransport value="'+uW.g_js_strings.commonstr.transport+'">&nbsp;<input type=button id=QMRaid value="'+uW.g_js_strings.commonstr.raid+'"></div>';
			m += '<div id=btMarchPresets align="center" class=divHeader>'+tx('MARCH PRESETS')+'</div>';

			m +='<div><table class=xtab width=100%><tr><td><SELECT class="btSelector" style="width:190px;" id="QMMarchPreset" onchange="btSelectMarchPreset(this);"></select>&nbsp;<a id="btDeleteMarchPreset" class="inlineButton btButton brown8 disabled" onclick="btDelMarchPreset()"><span>'+uW.g_js_strings.commonstr.deletetx+'</span></a></td><td align=right>';
			m +=tx('New Name')+':&nbsp;<INPUT class=btInput id=QMPresetName type=text style="width:190px;" maxlength=20 value=""\>&nbsp;<a id="btSaveMarchPreset" class="inlineButton btButton brown8" onclick="btSaveMarchPreset()"><span>'+tx('Save')+'</span></a></td></tr></table></div>';

			m += '<div id=btMarchMain align="center"><table align=center width=100% cellpadding=0 cellspacing=1 class=xtab style="padding-right:0px;"><tr><td style="padding-left:0px;"><div class=divHeader><table cellpadding=0 cellspacing=0 width=100% class=xtab><tr><td align=left>'+tx('TROOPS')+'</td><td id=QMTroopHeader align=right>&nbsp;</td></tr></table></div></td><td style="padding-left:0px;"><div class=divHeader><table cellpadding=0 cellspacing=0 width=100% class=xtab><tr><td align=left>'+tx('RESOURCES')+'</td><td id=QMResourceHeader align=right>&nbsp;</td></tr></table></div></td></tr>';
			m += '<tr><td width=50% style="vertical-align:top;"><table cellpadding=0 cellspacing=0 width=98% class=xtab>';

			var r = 0;
			var QMTroops = '<div id=QMMarchMightDiv style="text-align:center;" class=divHide>'+tx('Selected Troop Might')+':&nbsp;<span id=QMMarchMight>&nbsp;</span></div><table cellpadding=1 cellspacing=0 class=xtab align=left><tr><td colspan=2><input type=checkbox id=QMAllTroops '+(Options.QuickMarchOptions.AllTroops?'CHECKED':'')+' /><b>'+tx("All Troops")+'</b></td><td><a class=xlink id=QMResetTroops>'+tx('Reset Troops')+'</a></td></tr>';
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				QMTroops += '<tr id="QMTroopRow'+i+'" class="'+rowClass+'"><td style="padding-left:0px;width:20px;" align=right>'+TroopImage(i)+'</td><td style="width:100px;" id="QMTotalUnit'+i+'" align=left>&nbsp;</td><td align=left><input style="width:60px;" class=btInput id="QMMarchUnit'+i+'" type=text maxlength=7 value=0 ></td><td align=left><input style="height:20px;font-size:9px;" id="QMMaxUnit'+i+'" type=button value="'+uW.g_js_strings.commonstr.max+'"></td></tr>';
			}
			m += '</table><tr><td style="padding-left:5px;vertical-align:top;">'+QMTroops+'</td></tr>';

			m += '</table></td><td width=50% style="vertical-align:top;padding-left:0px;padding-right:0px;"><table cellpadding=0 cellspacing=0 width=98% class=xtab>';

			var QMRes = '<table class=xtab align=center><tr><td>&nbsp;</td><td><a class=xlink id=QMResetResources>'+tx('Reset Resources')+'</a></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="'+GoldImage+'" /></td><td><span id=QMTotalGold>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchGold type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxGold type=button value="'+uW.g_js_strings.commonstr.max+'"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="'+FoodImage+'" /></td><td><span id=QMTotalFood>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchFood type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxFood type=button value="'+uW.g_js_strings.commonstr.max+'"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="'+WoodImage+'" /></td><td><span id=QMTotalWood>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchWood type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxWood type=button value="'+uW.g_js_strings.commonstr.max+'"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="'+StoneImage+'" /></td><td><span id=QMTotalStone>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchStone type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxStone type=button value="'+uW.g_js_strings.commonstr.max+'"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="'+OreImage+'" /></td><td><span id=QMTotalOre>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchOre type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxOre type=button value="'+uW.g_js_strings.commonstr.max+'"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="'+AetherImage+'" /></td><td><span id=QMTotalAether>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchAether type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxAether type=button value="'+uW.g_js_strings.commonstr.max+'"></td></tr>';
			QMRes += '</table>';
			m += '<tr><td style="vertical-align:top;">'+QMRes+'</td></tr>';

			m += '</table><div class=divHeader>&nbsp;'+tx('BOOSTS')+'</div>';

			var QMBoosts = '<table width=100% class=xtab align=left cellpadding=0 cellspacing=0><tr><td align=left>&nbsp;'+tx('March Speed')+':&nbsp;<b><span id=QMMarchSpeed>&nbsp;</span></b></td><td align=right>&nbsp;'+tx('March Size')+':&nbsp;<b><span id=QMMarchSize>&nbsp;</span></b></td></tr></table>';
			QMBoosts += '<table class=xtab align=left cellpadding=0 cellspacing=0><tr>';
			for (var i = 0; i < 5; i++) {
				QMBoosts += '<td rowspan=2><img height=28 src="'+IMGURL+'items/30/'+t.ItemList[i]+'.jpg" title="'+itemTitle(t.ItemList[i],true)+'" /></td><td>&nbsp;</td>';
			}
			QMBoosts += '</tr><tr>';
			for (var i = 0; i < 5; i++) {
				QMBoosts += '<td><input type=checkbox id="QMItem'+t.ItemList[i]+'"></td>';
			}
			QMBoosts += '</tr><tr>';
			for (var i = 0; i < 5; i++) {
				QMBoosts += '<td colspan=2><span id="QMItemCount'+t.ItemList[i]+'">('+uW.ksoItems[t.ItemList[i]].count+')</span></td>';
			}
			QMBoosts += '</tr></table>';
			QMBoosts += '<table class=xtab align=left cellpadding=0 cellspacing=0><tr>';
			for (var i = 5; i < t.ItemList.length; i++) {
				if (uW.itemlist["i"+t.ItemList[i]]) {
					QMBoosts += '<td rowspan=2><img height=28 src="'+IMGURL+'items/30/'+t.ItemList[i]+'.jpg" title="'+itemTitle(t.ItemList[i],true)+'" /></td><td>&nbsp;</td>';
				}
			}
			QMBoosts += '</tr><tr>';
			for (var i = 5; i < t.ItemList.length; i++) {
				if (uW.itemlist["i"+t.ItemList[i]]) {
					QMBoosts += '<td><input type=checkbox id="QMItem'+t.ItemList[i]+'"></td>';
				}
			}
			QMBoosts += '</tr><tr>';
			for (var i = 5; i < t.ItemList.length; i++) {
				if (uW.itemlist["i"+t.ItemList[i]]) {
					QMBoosts += '<td colspan=2><span id="QMItemCount'+t.ItemList[i]+'">('+uW.ksoItems[t.ItemList[i]].count+')</span></td>';
				}
			}
			QMBoosts += '</tr></table>';
			QMBoosts += '<table width=100% class=xtab cellpadding=0 cellspacing=0 align=left><tr><td style="padding-right:0px;"><div id=QMTimedBoosts>&nbsp;</div></td></tr></table>';

			m += QMBoosts+'</td></tr></table></div><br>';

			popMarch = new CPopup('btQuickMarch', Options.btMarchPos.x, Options.btMarchPos.y, 620, 870, true, QuickMarch.close);
			popMarch.getMainDiv().innerHTML = m;
			popMarch.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;'+tx('March+')+'</B></DIV>';

			ById("QMAutoKnight").addEventListener('click', function () {
				Options.QuickMarchOptions.AutoKnight = this.checked;
				saveOptions();
				if (Options.QuickMarchOptions.AutoKnight)
					t.BuildKnightSelect();
			}, false);
			ById("QMAutoChamp").addEventListener('click', function () {
				Options.QuickMarchOptions.AutoChamp = this.checked;
				saveOptions();
				if (Options.QuickMarchOptions.AutoChamp)
					t.BuildChampSelect();
			}, false);
			ById("QMAutoSpell").addEventListener('click', function () {
				Options.QuickMarchOptions.AutoSpell = this.checked;
				saveOptions();
				if (Options.QuickMarchOptions.AutoSpell)
					t.BuildSpellSelect();
			}, false);

			ById("QMSpell").addEventListener('click', function () {
				t.CalcMarchTime();
			},false);

			var FromCityId = uW.currentcityid;
			if (init && Cities.byID[InitialCityId]) {
				FromCityId = InitialCityId;
			}

			t.dcp0 = new CdispCityPicker('QMCastles0', ById('QMFromCity'), true, t.FromCityClick, Cities.byID[FromCityId].idx);
			t.dcp1 = new CdispCityPicker('QMCastles1', ById('QMToCity'), true, t.DestinationChanged).bindToXYboxes(ById("QMToX"), ById("QMToY"));

			for (var i=0; i<Cities.numCities; i++) {
				ById('QMCastles0_'+i).addEventListener('mouseover',function (){CityResourceHint(this,this.id.substring(11));},false);
				ById('QMCastles0_'+i).addEventListener('mouseout',function (){CityResourceHintOff(this);},false);
				ById('QMCastles1_'+i).addEventListener('mouseover',function (){CityResourceHint(this,this.id.substring(11));},false);
				ById('QMCastles1_'+i).addEventListener('mouseout',function (){CityResourceHintOff(this);},false);
			}

			ById('QMToX').addEventListener('change', t.DestinationChanged, false);
			ById('QMToY').addEventListener('change', t.DestinationChanged, false);

			ById('QMSelClosest').addEventListener('click',t.SelectClosest, false);
			ById('QMLookupButton').addEventListener('click',t.LookupMapTile, false);
			ById('QMMapButton').addEventListener('click',t.GotoMapTile, false);

			ById('QMFetchAlliance').addEventListener('click', function() {
				var myA = getMyAlliance();
				if (myA[0] != 0) {
					var params = uW.Object.clone(uW.g_ajaxparams);
					params.page = 1;
					params.perPage = 100;
					params.allianceId = myA[0];
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserLeaderboard.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params,
						onSuccess: function (rslt) {
							if (rslt.ok) {
								var m = "";
								for (var i = 0; i < rslt.results.length; i++) {
									p = rslt.results[i];
									if (p.userId != 0) {
										for (var c = 0; c < p.cities.length; c++) {
											if (Seed.player.name != p.displayName) {
												m += "<option value='" + p.cities[c].xCoord + "," + p.cities[c].yCoord + "'>" + p.displayName + " - " + p.cities[c].cityName + " (" + p.cities[c].xCoord + "," + p.cities[c].yCoord + ")</option>";
											}
										}
									}
								}
								ById('QMAlliance').innerHTML = "<option value=''>-- "+tx('Select Member')+" --</option>" + m;
							}
						},
						onFailure: function () { ById('QMAlliance').innerHTML = "<option>"+tx('Server Error')+"</option>"; },
					},true);
				} else {
					ById('QMAlliance').innerHTML = "<option>"+tx('No Alliance')+"!</option>";
				}
			}, false);

			ById('QMAlliance').addEventListener('change', function () {
				if (this.value != '') {
					var val = this.value;
					var x = val.substr(0, val.lastIndexOf(','));
					var y = val.substr(val.lastIndexOf(',') + 1, val.length);
					ById('QMToX').value = x;
					ById('QMToY').value = y;
					t.DestinationChanged();
				}
			}, false);

			ById('QMFetchBookmarks').addEventListener('click', function () {
				FillBookmarkList('QMBookmarks');
			},false);

			ById('QMBookmarks').addEventListener('change', function () {
				if (this.value != '') {
					var val = this.value;
					var x = val.substr(0, val.lastIndexOf(','));
					var y = val.substr(val.lastIndexOf(',') + 1, val.length);
					ById('QMToX').value = x;
					ById('QMToY').value = y;
					t.DestinationChanged();
				}
			}, false);

			if (t.MapLaunch) {
				ById('QMToX').value = t.MapX;
				ById('QMToY').value = t.MapY;
				if (t.MapC) { t.dcp0.selectBut(t.MapC); }
				t.DestinationChanged();
			}
			else {
				if (ById('maparea_map').style.display != "none") {
					ById('QMToX').value = ById('mapXCoor').value;
					ById('QMToY').value = ById('mapYCoor').value;
					t.DestinationChanged();
				}
			}

			var x = parseInt(ById('QMToX').value);
			var y = parseInt(ById('QMToY').value);
			if(isNaN(x) || isNaN(y)) { ById('QMLookupButtonDiv').style.display = 'none'; }

			t.LoadMarchPresets();

			ById("QMAllTroops").addEventListener('click', function() {
				Options.QuickMarchOptions.AllTroops = this.checked;
				saveOptions();
				t.RepaintMarchData();
			}, false);

			ById("QMResetTroops").addEventListener('click', function () {
				for (var ui in CM.UNIT_TYPES) ById("QMMarchUnit" + CM.UNIT_TYPES[ui]).value = 0;
				t.RepaintMarchData();
				t.PaintMarchSizeInfo();
				t.PaintLoadInfo();
				t.CalcMarchTime();
			}, false);

			ById("QMResetResources").addEventListener('click', function () {
				ById('QMMarchGold').value = 0;
				ById('QMMarchFood').value = 0;
				ById('QMMarchWood').value = 0;
				ById('QMMarchStone').value = 0;
				ById('QMMarchOre').value = 0;
				ById('QMMarchAether').value = 0;

				t.Food = 0;
				t.Wood = 0;
				t.Stone = 0;
				t.Ore = 0;
				t.Gold = 0;
				t.Aether = 0;

				t.PaintLoadInfo();
			}, false);

			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				ById("QMMaxUnit"+i).addEventListener('click', function () {
					var MarchUnit = this.id.replace("QMMaxUnit", "QMMarchUnit");
					var TotalUnits = parseIntNan(Seed.units["city"+t.SourceCity.id]['unt'+this.id.split("QMMaxUnit")[1]]);
					t.GetMaxMarchSize();
					ById(MarchUnit).value = 0;
					var NumUnits = 0;
					for (var ui in CM.UNIT_TYPES) {
						NumUnits += parseIntNan(ById("QMMarchUnit"+CM.UNIT_TYPES[ui]).value);
					}
					var FreeUnits = parseInt(t.MaxTroops - NumUnits);
					if (FreeUnits<0) FreeUnits=0;
					if (TotalUnits >= FreeUnits) {
						ById(MarchUnit).value = FreeUnits;
					} else {
						ById(MarchUnit).value = TotalUnits;
					}
					t.PaintMarchSizeInfo();
					t.PaintLoadInfo();
					t.CalcMarchTime();
				}, false);
				ById("QMMarchUnit"+i).addEventListener('change', function () {
					t.PaintMarchSizeInfo();
					t.PaintLoadInfo();
					t.CalcMarchTime();
				}, false);
			}

			ById('QMMaxGold').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Gold = Math.min(t.MaxLoad - (t.Food + t.Wood + t.Stone + t.Ore + t.Aether),t.MaxGold);
				ById('QMMarchGold').value = t.Gold;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxFood').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Food = Math.min(t.MaxLoad - (t.Wood + t.Stone + t.Ore + t.Gold + t.Aether),t.MaxFood);
				ById('QMMarchFood').value = t.Food;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxWood').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Wood = Math.min(t.MaxLoad - (t.Food + t.Stone + t.Ore + t.Gold + t.Aether),t.MaxWood);
				ById('QMMarchWood').value = t.Wood;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxStone').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Stone = Math.min(t.MaxLoad - (t.Food + t.Wood + t.Ore + t.Gold + t.Aether),t.MaxStone);
				ById('QMMarchStone').value = t.Stone;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxOre').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Ore = Math.min(t.MaxLoad - (t.Food + t.Wood + t.Stone + t.Gold + t.Aether),t.MaxOre);
				ById('QMMarchOre').value = t.Ore;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxAether').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Aether = Math.min(t.MaxLoad - (t.Food + t.Wood + t.Stone + t.Ore + t.Gold),t.MaxAether*5);
				ById('QMMarchAether').value = Math.floor(t.Aether/5);
				t.PaintLoadInfo();
			}, false);

			ById('QMMarchGold').addEventListener('change', function () {
				t.Gold = parseIntNan(ById('QMMarchGold').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchFood').addEventListener('change', function () {
				t.Food = parseIntNan(ById('QMMarchFood').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchWood').addEventListener('change', function () {
				t.Wood = parseIntNan(ById('QMMarchWood').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchStone').addEventListener('change', function () {
				t.Stone = parseIntNan(ById('QMMarchStone').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchOre').addEventListener('change', function () {
				t.Ore = parseIntNan(ById('QMMarchOre').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchAether').addEventListener('change', function () {
				t.Aether = parseIntNan(ById('QMMarchAether').value)*5;
				t.PaintLoadInfo();
			}, false);

			ById("QMItem931").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem932").checked = false;
				}
				t.PaintMarchSizeInfo();
			}, false);

			ById("QMItem932").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem931").checked = false;
				}
				t.PaintMarchSizeInfo();
			}, false);

			ById("QMItem59").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem58").checked = false;
					ById("QMItem57").checked = false;
					ById("QMItem55").checked = false;
				}
				t.CalcMarchTime();
			}, false);

			ById("QMItem58").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem59").checked = false;
					ById("QMItem57").checked = false;
					ById("QMItem55").checked = false;
				}
				t.CalcMarchTime();
			}, false);

			ById("QMItem57").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem59").checked = false;
					ById("QMItem58").checked = false;
					ById("QMItem55").checked = false;
				}
				t.CalcMarchTime();
			}, false);

			ById("QMItem55").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem59").checked = false;
					ById("QMItem58").checked = false;
					ById("QMItem57").checked = false;
				}
				t.CalcMarchTime();
			}, false);

			ById("QMItem293").addEventListener('click', function (e) {
				if (e.target.checked) {
//					ById("QMItem294").checked = false;
				}
			}, false);

			ById("QMItem294").addEventListener('click', function (e) {
				if (e.target.checked) {
//					ById("QMItem293").checked = false;
				}
			}, false);

			ById("QMTransport").addEventListener('click', function () {
				t.DoMarch(1);
			}, false);
			ById("QMReinforce").addEventListener('click', function () {
				t.DoMarch(2);
			}, false);
			ById("QMReinforceFood").addEventListener('click', function () {
				t.DoMarch(2,true);
			}, false);
			ById("QMScout").addEventListener('click', function () {
				t.DoMarch(3);
			}, false);
			ById("QMAttack").addEventListener('click', function () {
				t.DoMarch(4);
			}, false);
			ById("QMReassign").addEventListener('click', function () {
				t.DoMarch(5);
			}, false);
			ById("QMRaid").addEventListener('click', function () {
				t.AddRaid();
			}, false);

			t.RefreshTimedBoosts();

			if (Options.ShowMarchMight) {
				jQuery('#QMMarchMightDiv').removeClass('divHide');
			}

			popMarch.show(true);
			ResetFrameSize('btQuickMarch',870,620);
			Options.QuickMarchOptions.QuickMarchStartState = true;
			t.MapLaunch = false;
		}
		saveOptions();
	},

	close : function () {
		Options.QuickMarchOptions.QuickMarchStartState = false;
		Options.btMarchPos = popMarch.getLocation();
		saveOptions();
		popMarch=null;
	},

	GotoMapTile : function () {
		var t = QuickMarch;
		var x = parseInt(ById('QMToX').value);
		var y = parseInt(ById('QMToY').value);
		if(isNaN(x) || isNaN(y)) return;
		GotoMap (x,y);
	},

	LookupMapTile : function () {
		var t = QuickMarch;

		t.targetType = null;

		ById("QMLookupInfo").innerHTML = '';

		var x = parseInt(ById('QMToX').value);
		var y = parseInt(ById('QMToY').value);
		if(isNaN(x) || isNaN(y)) return;

		ById("QMLookupInfo").innerHTML = tx('Searching')+'...';

		t.Blocks = t.MapAjax.generateBlockList(x,y,1);
		var blockString = t.Blocks.join("%2C");
		t.MapAjax.LookupMap (blockString, function(rslt) {
			t.DestLookup = false;
			if (!rslt.ok) {
				if (rslt.BotCode && rslt.BotCode==999) { ById("QMLookupInfo").innerHTML = 'Captcha!'; }
				else { ById("QMLookupInfo").innerHTML = 'Error!'; }
				return;
			}

			var map = rslt.data;
			for (var k in map){
				if (x==map[k].xCoord && y==map[k].yCoord) {
					var m = "";
					var uid=map[k].tileUserId;
					var cid=map[k].tileCityId;
					var typeid = map[k].tileType;
					t.targetType = typeid;
					t.CalcMarchTime(); // for megaliths march time is different
					var tiletype = tileTypes[parseInt(typeid)];
					var subtype = map[k].premiumTile;
					if (typeid==50 && subtype==1) {
						m = tx('Alliance HQ')+'&nbsp;('+map[k].allianceHq.allianceName+')';
						ById("QMLookupInfo").innerHTML = m;
					}
					else {
						var misted = map[k].misted;
						var lvl = parseIntNan(map[k].tileLevel);
						if (!uid || uid==0 || uid=="0") {
							if (typeid==51) { tiletype = tx('Barb Camp'); }
							m = tiletype;
							if (misted) {
								m = uW.g_js_strings.commonstr.level+'&nbsp;'+lvl+'&nbsp;'+m+'&nbsp;('+tx('Owner Misted')+')';
								ById("QMLookupInfo").innerHTML = m;
							}
							else {
								if (typeid==53) {
									m += '&nbsp;'+tx('or plain')+'&nbsp;&nbsp;&nbsp;<span id=QMDefendStatus>&nbsp;</span>';
									ById("QMLookupInfo").innerHTML = m;
									getDefendStatus(x,y,ById('QMDefendStatus'),true);
								}
								else {
									if (lvl!=0) {
										m = uW.g_js_strings.commonstr.level+'&nbsp;'+lvl+'&nbsp;'+m;
									}
									ById("QMLookupInfo").innerHTML = m;
								}
							}
						}
						else { // lookup user
							var params = uW.Object.clone(uW.g_ajaxparams);
							params.checkArr = uid;
							new MyAjaxRequest(uW.g_ajaxpath + "ajax/getOnline.php" + uW.g_ajaxsuffix, {
								method: "post",
								parameters: params,
								onSuccess: function (rslt) {
									var p = rslt.data;
									var params = uW.Object.clone(uW.g_ajaxparams);
									params.pid = uid;
									new MyAjaxRequest(uW.g_ajaxpath + "ajax/viewCourt.php" + uW.g_ajaxsuffix, {
										method: "post",
										parameters: params,
										onSuccess: function (rslt) {
											if (rslt.ok) {
												m = MonitorLink(rslt.playerInfo.userId,rslt.playerInfo.displayName);
												if (p[uid])
													m+= '&nbsp;<span style="color:#f00;"><b>('+uW.g_js_strings.commonstr.online.toUpperCase()+')</b></span>';
												if (typeid==51) {
													m += '&nbsp;&nbsp;&nbsp;<span id=QMDefendStatus>&nbsp;</span>';
													ById("QMLookupInfo").innerHTML = m;
													getDefendStatus(x,y,ById('QMDefendStatus'),true);
												}
												else {
													m += '&nbsp;'+uW.g_js_strings.commonstr.level+'&nbsp;'+lvl+'&nbsp;'+tiletype;
													ById("QMLookupInfo").innerHTML = m;
												}
											}
										},
									});
								},
							});
						}
					}
					return;
				}
			}
			ById("QMLookupInfo").innerHTML = 'No Data';
		},true); // ignore delay
	},

	RefreshItemCounts : function () {
		var t = QuickMarch;
		for (var i = 0; i < t.ItemList.length; i++) {
			if (ById('QMItemCount'+t.ItemList[i])) ById('QMItemCount'+t.ItemList[i]).innerHTML = '('+uW.ksoItems[t.ItemList[i]].count+')';
		}
	},

	RefreshTimedBoosts : function () {
		var t = QuickMarch;

		ById('QMMarchSpeed').innerHTML = Math.floor(equippedthronestats(67))+'%';
		ById('QMMarchSize').innerHTML = Math.floor(equippedthronestats(66))+'%';

		var now = unixTime();
		Bags = Seed.items.i276;
		SturdyBags = Seed.items.i277;
		HeavyBags = Seed.items.i278;

		var loadboost = '<span style="color:#f00"><b>'+uW.g_js_strings.commonstr.none+'!</b></span>';
		if (Seed.playerEffects.loadExpire >now) {
			loadboost = '<span style="color:#080"><b>25% for '+uW.timestr(Seed.playerEffects.loadExpire-now)+'</b></span>';
		}

		var QMLoad = '<table width=100% align=left class=xtab><tr><td>'+tx('Load')+':&nbsp;</td><td>'+loadboost+'</td><td align=right style="padding-right:0px;"><table class=xtab style="padding-right:0px;" cellpadding=0 cellspacing=1><tr>';
		if (Bags) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'276\')"><img height=28 class=btTop src="'+BagImage+'" title="'+itemTitle(276)+'"></a></td>';
		}
		if (SturdyBags) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'277\')"><img height=28 class=btTop src="'+SturdyBagImage+'" title="'+itemTitle(277)+'"></a></td>';
		}
		if (HeavyBags) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'278\')"><img height=28 class=btTop src="'+HeavyBagImage+'" title="'+itemTitle(278)+'"></a></td>';
		}
		QMLoad += '</tr></table></td></tr>';

		Authority = Seed.items.i285;
		Dominion = Seed.items.i286;

		var sizeboost = '<span style="color:#f00"><b>'+uW.g_js_strings.commonstr.none+'!</b></span>';
		ById("QMItem931").disabled = false;
		ById("QMItem932").disabled = false;
		if (Seed.playerEffects.auras2Expire && Seed.playerEffects.auras2Expire >now) {
			sizeboost = '<span style="color:#080"><b>30% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.auras2Expire-now)+'</b></span>';
			ById("QMItem931").checked = false;
			ById("QMItem932").checked = false;
			ById("QMItem931").disabled = true;
			ById("QMItem932").disabled = true;
		}
		else {
			if (Seed.playerEffects.aurasExpire && Seed.playerEffects.aurasExpire >now) {
				sizeboost = '<span style="color:#f80"><b>15% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.aurasExpire-now)+'</b></span>';
				ById("QMItem931").checked = false;
				ById("QMItem932").checked = false;
				ById("QMItem931").disabled = true;
				ById("QMItem932").disabled = true;
			}
		}
		QMLoad += '<tr><td>'+tx('Size')+':&nbsp;</td><td>'+sizeboost+'</td><td style="padding-right:0px;" align=right><table class=xtab style="padding-right:0px;" cellpadding=0 cellspacing=1><tr>';
		if (Authority) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'285\')"><img height=28 class=btTop src="'+AuthorityImage+'" title="'+itemTitle(285)+'"></a></td>';
		}
		if (Dominion) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'286\')"><img height=28 class=btTop src="'+DominionImage+'" title="'+itemTitle(286)+'"></a></td>';
		}
		QMLoad += '</tr></table></td></tr>';

		BlueEagle = Seed.items.i279;

		var speedboost = '<span style="color:#f00"><b>'+uW.g_js_strings.commonstr.none+'!</b></span>';
		if (Seed.playerEffects.returnExpire && Seed.playerEffects.returnExpire >now) {
			speedboost = '<span style="color:#080"><b>50% '+uW.g_js_strings.commonstr.fortxl+' '+uW.timestr(Seed.playerEffects.returnExpire-now)+'</b></span>';
		}
		QMLoad += '<tr><td>'+tx('Return')+':&nbsp;</td><td>'+speedboost+'</td><td style="padding-right:0px;" align=right><table class=xtab style="padding-right:0px;" cellpadding=0 cellspacing=1><tr>';
		if (BlueEagle) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'279\')"><img height=28 class=btTop src="'+BlueEagleImage+'" title="'+itemTitle(279)+'"></a></td>';
		}
		QMLoad += '</tr></table></td></tr>';

		QMLoad += '</table>';

		ById('QMTimedBoosts').innerHTML = '<div align=center id=btboostmsg>&nbsp;</div>'+QMLoad;

		// check champ status

		if (jQuery('#QMChampSpan').hasClass('divHide')) {
			citychamp = getCityChampion(t.SourceCity.id);
			if (citychamp.championId && citychamp.status!="10") {
				t.BuildChampSelect();
			}
		}

		// check spell cooldown

		if (jQuery('#QMSpellSpan').hasClass('divHide')) {
			var spells = getSpellData(t.SourceCity.id);
			if (spells.spellavailable) {
				if (spells.cooldownactive) {
					if (ById('QMCoolTime')) { ById('QMCoolTime').innerHTML = spells.cooldown; }
				}
				else { t.BuildSpellSelect(); }
			}
		}
	},

	GetMaxMarchSize : function () {
		var t = QuickMarch;
		var e = 1;
		var f = uW.unixtime();
		var koth = false;
		if (t.targetType==57) { koth=true; }

		var elem = ById("QMItem931");
		var elem2 = ById("QMItem932");
		if (elem2 && elem2.checked && parseInt(Seed.items["i932"]) > 0) { e = 1.5; }
		else {
			if (elem && elem.checked && parseInt(Seed.items["i931"]) > 0) {	e = 1.25; }
		}

		// timed auras take priority

		if (Seed.playerEffects.auras2Expire && Seed.playerEffects.auras2Expire > f) { e = 1.3 }
		else {
			if (Seed.playerEffects.aurasExpire && Seed.playerEffects.aurasExpire > f) {	e = 1.15 }
		}

		var trmarchsizebuff = Math.min(equippedthronestats(66),uW.cm.thronestats.boosts.MarchSize.Max);
		if (trmarchsizebuff > 0)
			e *= (1 + trmarchsizebuff / 100);
		if (Seed.cityData.city[t.SourceCity.id].isPrestigeCity) {
			var b = Seed.cityData.city[t.SourceCity.id].prestigeInfo.prestigeLevel;
			var r = CM.WorldSettings.getSetting("ASCENSION_RALLYPOINT_BOOST");
			var m = JSON.parse(r);
			var u = 1;
			if (m.values[b-1]) {
				u = m.values[b-1][1];
			}
			var k = parseFloat(u);
			e *= k
			if (Seed.cityData.city[t.SourceCity.id].prestigeInfo.blessings.indexOf(207) != -1) { e *= 1.1; }
		}
		if (koth) { e=1; }
		var RallyPointLevel = parseInt(getUniqueCityBuilding(t.SourceCity.id, 12).maxLevel);
		t.MaxTroops = Math.round(RallyPointLevel * 10000 * e - 0.001);
		if (RallyPointLevel == 11) { t.MaxTroops = Math.round(150000 * e - 0.001); }
		if (RallyPointLevel == 12) { t.MaxTroops = Math.round(200000 * e - 0.001); }
		if (RallyPointLevel == 13) { t.MaxTroops = Math.round(215000 * e - 0.001); }
		if (RallyPointLevel == 14) { t.MaxTroops = Math.round(250000 * e - 0.001); }
		if (RallyPointLevel == 15) { t.MaxTroops = Math.round(275000 * e - 0.001); }
	},

	PaintMarchSizeInfo : function () {
		var t = QuickMarch;
		t.CheckMarchNumbers();
		t.GetMaxMarchSize();
		var NumUnits = 0;
		var MarchMight = 0;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			var TroopUnits = parseIntNan(ById("QMMarchUnit"+i).value);
			NumUnits += TroopUnits;
			MarchMight += (TroopUnits*parseInt(uW.unitmight["unt"+i]));
		}
		if (NumUnits > t.MaxTroops)
			ById('QMTroopHeader').innerHTML = '<SPAN class=boldRed><B>' + addCommas(NumUnits) + ' / ' + addCommas(t.MaxTroops) + '</b></span>';
		else
			ById('QMTroopHeader').innerHTML = addCommas(NumUnits) + ' / ' + addCommas(t.MaxTroops);

		ById('QMMarchMight').innerHTML = addCommas(MarchMight);
	},

	PaintLoadInfo : function () {
		var t = QuickMarch;
		t.CalcMaxLoad();
		var Resources = t.Food + t.Wood + t.Stone + t.Ore + t.Gold + t.Aether;
		if (Resources > t.MaxLoad)
			ById('QMResourceHeader').innerHTML = '<SPAN class=boldRed><B>' + addCommas(Resources) + ' / ' + addCommas(t.MaxLoad) + '</b></span>';
		else
			ById('QMResourceHeader').innerHTML = addCommas(Resources) + ' / ' + addCommas(t.MaxLoad);
	},

	PaintRallyPoint : function () {
		var t = QuickMarch;
		cityId = t.SourceCity.id;
		var marches = March.getMarchSlots(cityId);
		var maxmarches = March.getTotalSlots(cityId);
		if (marches >= maxmarches)
			ById('QMRP').innerHTML = '<SPAN class=boldRed><B>' + marches + '/' + maxmarches + '</b></span>';
		else
			ById('QMRP').innerHTML = marches + '/' + maxmarches;
	},

	RepaintMarchData : function (ignoreTT) {
		var t = QuickMarch;

		var r = 0;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var troopnum = parseIntNan(Seed.units["city"+t.SourceCity.id]['unt'+i]);
			if (troopnum > 0) {
				var ritual = false;
				for (var sacIndex = 0; sacIndex < Seed.queue_sacr["city" + t.SourceCity.id].length; sacIndex++) {
					if (Seed.queue_sacr["city" + t.SourceCity.id][sacIndex]["unitType"] == i) {
						ritual = true;
					}
				}
				if (ritual) {
					ById('QMTotalUnit'+i).innerHTML = '<SPAN style="color:#080"><B>'+addCommas(troopnum)+'</B></SPAN>';
				}
				else {
					ById('QMTotalUnit'+i).innerHTML = addCommas(troopnum);
				}
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
			}
			else {
				ById('QMTotalUnit'+i).innerHTML = '';
				if (Options.QuickMarchOptions.AllTroops || parseIntNan(ById('QMMarchUnit'+i).value) != 0) {
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
				}
				else { rowClass = 'divHide'; }
			}
			ById('QMTroopRow'+i).className = rowClass;
		}

		t.MaxFood = parseInt(Seed.resources["city"+t.SourceCity.id]['rec1'][0] / 3600);
		t.MaxWood = parseInt(Seed.resources["city"+t.SourceCity.id]['rec2'][0] / 3600);
		t.MaxStone = parseInt(Seed.resources["city"+t.SourceCity.id]['rec3'][0] / 3600);
		t.MaxOre = parseInt(Seed.resources["city"+t.SourceCity.id]['rec4'][0] / 3600);
		t.MaxAether = parseInt(Seed.resources["city"+t.SourceCity.id]['rec5'][0]);
		t.MaxGold = parseInt(Seed.citystats["city"+t.SourceCity.id]['gold'][0]);

		ById('QMTotalGold').innerHTML = addCommas(t.MaxGold);
		ById('QMTotalFood').innerHTML = addCommas(t.MaxFood);
		ById('QMTotalWood').innerHTML = addCommas(t.MaxWood);
		ById('QMTotalStone').innerHTML = addCommas(t.MaxStone);
		ById('QMTotalOre').innerHTML = addCommas(t.MaxOre);
		ById('QMTotalAether').innerHTML = addCommas(t.MaxAether);

		var cityExpTime = Seed.cityData.city[t.SourceCity.id].prestigeInfo.prestigeBuffExpire;
		if (cityExpTime && cityExpTime > unixTime()) {
			ById("QMAttack").style.color = '#f00';
			ById("QMScout").style.color = '#f00';
		}
		else {
			ById("QMAttack").style.color = '#000';
			ById("QMScout").style.color = '#000';
		}

		t.PaintRallyPoint();
		ResetFrameSize('btQuickMarch',870,620);
	},

	FromCityClick : function (city, force) {
		var t = QuickMarch;

		if (t.SourceCity != city || force) {
			t.SourceCity = city;

			t.RepaintMarchData();
			t.BuildKnightSelect();
			t.BuildChampSelect();
			t.BuildSpellSelect();
			t.PaintMarchSizeInfo();
			t.PaintLoadInfo();
			t.CalcDistance();
			t.CalcMarchTime();

			t.SelectMarchPreset(ById('QMMarchPreset'));
		}
	},

	CheckMarchNumbers : function () {
		var t = QuickMarch;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var troopnum = parseIntNan(Seed.units["city"+t.SourceCity.id]['unt'+i]);
			if (ById('QMMarchUnit'+i).value > troopnum) { ById('QMMarchUnit'+i).style.color = '#f00'; }
			else { ById('QMMarchUnit'+i).style.color = '#000'; }
		}

		if (t.MaxGold < t.Gold) { ById('QMMarchGold').style.color = '#f00';	}
		else { ById('QMMarchGold').style.color = '#000'; }

		if (t.MaxFood < t.Food) { ById('QMMarchFood').style.color = '#f00';	}
		else { ById('QMMarchFood').style.color = '#000'; }

		if (t.MaxWood < t.Wood) { ById('QMMarchWood').style.color = '#f00';	}
		else { ById('QMMarchWood').style.color = '#000'; }

		if (t.MaxStone < t.Stone) { ById('QMMarchStone').style.color = '#f00';	}
		else { ById('QMMarchStone').style.color = '#000'; }

		if (t.MaxOre < t.Ore) { ById('QMMarchOre').style.color = '#f00';	}
		else { ById('QMMarchOre').style.color = '#000'; }

		if (t.MaxAether < t.Aether) { ById('QMMarchAether').style.color = '#f00';	}
		else { ById('QMMarchAether').style.color = '#000'; }
	},

	DestinationChanged : function () {
		var t = QuickMarch;
		if (t.DestLookup) { return; } // don't duplicate lookups
		t.DestLookup = true;
		Options.QuickMarchOptions.StartCoords.x = ById('QMToX').value;
		Options.QuickMarchOptions.StartCoords.y = ById('QMToY').value;

		var x = parseInt(ById('QMToX').value);
		var y = parseInt(ById('QMToY').value);
		if(isNaN(x) || isNaN(y)) { ById('QMLookupButtonDiv').style.display = 'none'; }
		else { ById('QMLookupButtonDiv').style.display = ''; }
		ById("QMLookupInfo").innerHTML = '';

		t.LookupMapTile();
		t.CalcDistance();
	},

	CalcDistance : function () {
		var t = QuickMarch;

		ById("QMDist").innerHTML = '';
		t.distance = 0;

		var x1 = parseInt(t.SourceCity.x);
		var x2 = parseInt(ById('QMToX').value);
		var y1 = parseInt(t.SourceCity.y);
		var y2 = parseInt(ById('QMToY').value);
		if(isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return;
		t.distance = distance(x1, y1, x2, y2);
		ById("QMDist").innerHTML = t.distance;
	},

	SelectClosest : function () {
		var t = QuickMarch;
		var closestdist = 999999;
		var closestcity;

		var x2 = parseInt(ById('QMToX').value);
		var y2 = parseInt(ById('QMToY').value);
		if(isNaN(x2) || isNaN(y2)) return;

		for (var i = 0; i < Cities.numCities; i++) {
			var	cityId = Cities.cities[i].id;
			var x1 = parseInt(Cities.cities[i].x);
			var y1 = parseInt(Cities.cities[i].y);
			if (x1 != x2 || y1 != y2) { // if one of your cities, pick the nearest other city!
				var dist = distance(x1, y1, x2, y2);
				if (dist < closestdist) {
					closestdist = dist;
					closestcity = i;
				}
			}
		}
		t.dcp0.selectBut(closestcity);
	},

	BuildKnightSelect : function () {
		var t = QuickMarch;
		var knt = getAvailableKnights(t.SourceCity.id);
		ById('QMKnight').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- "+tx('Select Knight')+" --"
		o.value = 0;
		ById("QMKnight").options.add(o);
		for (var k in knt) {
			if (knt[k]["Name"] != undefined) {
				var o = document.createElement("option");
				o.text = (knt[k]["Name"] + ' (' + knt[k]["Combat"] + ')')
				o.value = knt[k]["ID"];
				ById("QMKnight").options.add(o);
			}
		}
		if (ById('QMKnight').options.length > 1) {
			if (Options.QuickMarchOptions.AutoKnight)
				ById('QMKnight').selectedIndex = 1;
		}
	},

	BuildChampSelect : function () {
		var t = QuickMarch;

		ById('QMChamp').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- "+tx('Select Champion')+" --";
		o.value = 0;
		ById("QMChamp").options.add(o);
		var citychamp;
		var NoChampText = '<SPAN class=boldRed><B>'+uW.g_js_strings.champ.no_champ+'!</b></span>';
		citychamp = getCityChampion(t.SourceCity.id);
		if (citychamp.championId) {
			var champname = citychamp.name;
			var champstatus = citychamp.status;
			if (champstatus != "10") {
				var o = document.createElement("option");
				o.text = champname;
				o.value = citychamp.championId;
				ById("QMChamp").options.add(o);
			}
			else {
				NoChampText = '<SPAN class=boldRed><B>'+champname+' '+tx('is Marching')+'!</b></span>';
			}
		}
		if (ById('QMChamp').options.length > 1) {
			jQuery("#QMChampSpan").removeClass("divHide");
			jQuery("#QMNoChampSpan").addClass("divHide");
			if (Options.QuickMarchOptions.AutoChamp)
				ById('QMChamp').selectedIndex = 1;
		}
		else {
			jQuery("#QMNoChampSpan").removeClass("divHide");
			jQuery("#QMChampSpan").addClass("divHide");
			ById('QMNoChampSpan').innerHTML = NoChampText;
		}
	},

	BuildSpellSelect : function () {
		var t = QuickMarch;

		var spells = getSpellData(t.SourceCity.id);
		var faction = spells.faction;

		ById('QMSpell').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- "+tx('Select Battle Spell')+" --";
		o.value = 0;
		ById("QMSpell").options.add(o);
		var NoSpellText = '<SPAN class=boldRed><B>'+tx('No Spell')+'!</b></span>';
		if (spells.spellavailable) {
			var SpellName = uW.g_js_strings.spells["name_"+SpellTypes[faction]];
			if (!spells.cooldownactive) {
				var o = document.createElement("option");
				o.text = SpellName;
				o.value = SpellTypes[faction];
				ById("QMSpell").options.add(o);
			}
			else {
				NoSpellText = '<SPAN class=boldRed><B>'+SpellName+' (<span id=QMCoolTime>'+spells.cooldown+'</span>)</b></span>';

				var Squire = parseIntNan(Seed.items.i1);
				var Knight = parseIntNan(Seed.items.i2);
				var Guinevere = parseIntNan(Seed.items.i3);
				var Morgana = parseIntNan(Seed.items.i4);
				var Arthur = parseIntNan(Seed.items.i5);
				var Merlin = parseIntNan(Seed.items.i6);

				var Speedups = '';
				Speedups += t.paintSpeedup(t.SourceCity.id,faction,1,Squire);
				Speedups += t.paintSpeedup(t.SourceCity.id,faction,2,Knight);
				Speedups += t.paintSpeedup(t.SourceCity.id,faction,3,Guinevere);
				Speedups += t.paintSpeedup(t.SourceCity.id,faction,4,Morgana);
				Speedups += t.paintSpeedup(t.SourceCity.id,faction,5,Arthur);
				Speedups += t.paintSpeedup(t.SourceCity.id,faction,6,Merlin);
				if (Speedups != "") Speedups = "<table align=left cellspacing=0 cellpadding=0><tr>" + Speedups + "</tr></table>";
				NoSpellText = NoSpellText+'<div>'+Speedups+'</div>';
			}
		}

		if (ById("QMSpell").options.length > 1) {
			jQuery("#QMSpellSpan").removeClass("divHide");
			jQuery("#QMNoSpellSpan").addClass("divHide");
			if (Options.QuickMarchOptions.AutoSpell) {
				ById("QMSpell").selectedIndex = 1;
				t.CalcMarchTime();
			}
		}
		else {
			jQuery("#QMNoSpellSpan").removeClass("divHide");
			jQuery("#QMSpellSpan").addClass("divHide");
			ById('QMNoSpellSpan').innerHTML = NoSpellText;
		}
	},

	paintSpeedup : function (cityId, faction, item, count) {
		var t = QuickMarch;
		var n = '';
		if (count>0) {
			n += '<td class=xtab style="padding-right:2px"><a onClick="QMspeedupSpell('+cityId+', '+item+','+SpellTypes[faction]+')"><img height=18 class="btTop btFaint" src="'+IMGURL+'items/70/'+item+'.jpg" title="'+itemTitle(item)+'"></a></td>';
		}
		return n;
	},

	speedupSpell : function (cityId,item,spell) {
		var t = QuickMarch;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.iid = item;
		params.sid = spell;
		params.apothecary = false;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/speedupBattleSpellCooldown.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (rslt.endDate) {
						Seed.cityData.city[cityId].spells = uWCloneInto({});
						Seed.cityData.city[cityId].spells[spell] = uWCloneInto({ endDate : rslt.endDate });
					}
					Seed.items["i"+item] = Number(parseInt(Seed.items["i"+item])-1);
					uW.ksoItems[item].subtract();
					if (cityId == uW.currentcityid) uW.update_queue();
					t.BuildSpellSelect();
				}
			},
		},true);
	},

	MapClick : function (x,y,c) {
		var t = QuickMarch;
		if (popMarch) {
			ById('QMToX').value = x;
			ById('QMToY').value = y;
			if (c) { t.dcp0.selectBut(c); }
			t.DestinationChanged();
		}
		else {
			t.MapX = x;
			t.MapY = y;
			if (c) { t.MapC = c; } else { t.MapC = null; }
			t.MapLaunch = true;
			t.ToggleQuickMarch(false);
		}
	},

	CalcMaxLoad : function () {
		var t = QuickMarch;
		t.MaxLoad = 0;
		var featherweight = parseInt(Seed.tech.tch10) * 0.1;
		var loadEffectBoost = 0;
		if (Seed.playerEffects.loadExpire > uW.unixtime()) {
			loadEffectBoost = 0.25;
		};
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];

			var loadBoostBase = (Math.floor(CM.ThroneController.effectBonus(6)) * 0.01) + loadEffectBoost;
			if (CM.unitFrontendType[i] == "siege") {
				loadBoostBase += (CM.ThroneController.effectBonus(59) * 0.01)
			};
			if (CM.unitFrontendType[i] == "horsed") {
				loadBoostBase += (CM.ThroneController.effectBonus(48) * 0.01);
			};
			var Load = parseInt(uW.unitstats['unt'+i]['5']);
			var LoadSac = "";
			if (uW.seed.queue_sacr["city"+t.SourceCity.id]) {
				for(var sacIndex = 0; sacIndex < uW.seed.queue_sacr["city"+t.SourceCity.id].length; sacIndex ++ ) {
					if(uW.seed.queue_sacr["city"+t.SourceCity.id][sacIndex]["unitType"] == i) {
						Load *= uW.seed.queue_sacr["city"+t.SourceCity.id][sacIndex]["multiplier"][0];
					}
				}
			}
			if (loadBoostBase > Number(uW.cm.thronestats.boosts.Load.Max)/100) {
				loadBoostBase = Number(uW.cm.thronestats.boosts.Load.Max)/100;
			};
			loadBoostBase += featherweight; //Should be done after throne room max check to get max boost?
			loadBoostBase += 1;

			var LoadUnit = Math.floor(loadBoostBase*Load);
			t.MaxLoad += parseInt(LoadUnit * ById("QMMarchUnit" + i).value);
		}
		if (t.MaxLoad > 0) t.MaxLoad = t.MaxLoad - 1; // reduce max by 1 to avoid load capacity errors due to roundoff
	},

	LoadMarchPresets : function () {
		var t = QuickMarch;
		ById('QMMarchPreset').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- "+tx('Select Preset')+" --"
		o.value = 0;
		ById("QMMarchPreset").options.add(o);
		for (var y in Options.QuickMarchOptions.MarchPresets) {
			var o = document.createElement("option");
			o.text = Options.QuickMarchOptions.MarchPresets[y][0];
			o.value = y;
			ById("QMMarchPreset").options.add(o);
		}
		t.NextPresetNumber = parseIntNan(y) + 1;
		if (t.InitPresetNumber != 0) {
			ById('QMMarchPreset').value = t.InitPresetNumber;
			t.SelectMarchPreset(ById('QMMarchPreset'));
			t.InitPresetNumber = 0;
		}
	},

	SelectMarchPreset : function (sel) {
		var t = QuickMarch;
		var PN = sel.value;
		if ((PN == 0) || (PN == "")) {
			jQuery('#btDeleteMarchPreset').addClass("disabled");
			return false
		} else {
			jQuery('#btDeleteMarchPreset').removeClass("disabled");
		}

		/* Load preset details into edit fields */

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Options.QuickMarchOptions.MarchPresets[PN][i]) { ById('QMMarchUnit'+i).value = Options.QuickMarchOptions.MarchPresets[PN][i]; }
			else { ById('QMMarchUnit'+i).value = "0"; }
		}

		t.Food = 0;
		t.Wood = 0;
		t.Stone = 0;
		t.Ore = 0;
		t.Gold = 0;
		t.Aether = 0;

		if (Options.QuickMarchOptions.MarchPresets[PN].Gold) { t.Gold = Options.QuickMarchOptions.MarchPresets[PN].Gold; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Food) { t.Food = Options.QuickMarchOptions.MarchPresets[PN].Food; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Wood) { t.Wood = Options.QuickMarchOptions.MarchPresets[PN].Wood; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Stone) { t.Stone = Options.QuickMarchOptions.MarchPresets[PN].Stone; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Ore) { t.Ore = Options.QuickMarchOptions.MarchPresets[PN].Ore; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Aether) { t.Aether = Options.QuickMarchOptions.MarchPresets[PN].Aether; }

		ById('QMMarchGold').value = t.Gold;
		ById('QMMarchFood').value = t.Food;
		ById('QMMarchWood').value = t.Wood;
		ById('QMMarchStone').value = t.Stone;
		ById('QMMarchOre').value = t.Ore;
		ById('QMMarchAether').value = t.Aether;

		for (var i = 0; i < t.ItemList.length; i++) {
			var elem = ById("QMItem"+t.ItemList[i]);
			if (elem) {
				elem.checked = (Options.QuickMarchOptions.MarchPresets[PN]["item"+t.ItemList[i]] == true);
			}
		}
		t.RepaintMarchData();
		t.PaintMarchSizeInfo();
		t.PaintLoadInfo();
		t.CalcMarchTime();
	},

	SaveMarchPreset : function () {
		var t = QuickMarch;
		ById('btMarchMessages').innerHTML = "";	// need to induce a flicker or something, so they know something has happened..
		var PN = ById('QMMarchPreset');
		var NewName = ById('QMPresetName').value.trim();
		var OldName = "";
		if (!PN.value || (PN.value == 0)) {
			if (NewName == "") {
				ById('btMarchMessages').innerHTML = "<FONT COLOR=#800>"+tx('Please enter a name for the march preset')+"</font>";
				return false;
			}
			SavePN = t.NextPresetNumber;
		}
		else {
			if (NewName != "") {
				SavePN = t.NextPresetNumber;
			}
			else {
				SavePN = PN.value;
				OldName = Options.QuickMarchOptions.MarchPresets[SavePN][0];
			}
		}

		Options.QuickMarchOptions.MarchPresets[SavePN]={};
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			TroopVal = ById('QMMarchUnit'+i).value;
			if (!isNaN(TroopVal) && (TroopVal != "")) {
				Options.QuickMarchOptions.MarchPresets[SavePN][i] = TroopVal;
			}
		}

		if (!isNaN(t.Gold) && (t.Gold != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Gold = t.Gold;
		}
		if (!isNaN(t.Food) && (t.Food != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Food = t.Food;
		}
		if (!isNaN(t.Wood) && (t.Wood != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Wood = t.Wood;
		}
		if (!isNaN(t.Stone) && (t.Stone != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Stone = t.Stone;
		}
		if (!isNaN(t.Ore) && (t.Ore != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Ore = t.Ore;
		}
		if (!isNaN(t.Aether) && (t.Aether != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Aether = t.Aether;
		}

		for (var i = 0; i < t.ItemList.length; i++) {
			var elem = ById("QMItem"+t.ItemList[i]);
			if (elem && elem.checked) {
				Options.QuickMarchOptions.MarchPresets[SavePN]["item"+t.ItemList[i]] = true;
			}
		}

		Options.QuickMarchOptions.MarchPresets[SavePN][0] = OldName;
		if (NewName != "") {
			Options.QuickMarchOptions.MarchPresets[SavePN][0] = NewName;
		}
		saveOptions();
		t.InitPresetNumber = SavePN;
		t.LoadMarchPresets();
		ById('QMPresetName').value = "";
		ById('btMarchMessages').innerHTML = tx("March Preset Saved");
	},

	DelMarchPreset : function () {
		var t = QuickMarch;
		var PN = ById('QMMarchPreset');
		if (!PN.value || (PN.value == 0)) return;

		Options.QuickMarchOptions.MarchPresets[PN.value]={};
		delete Options.QuickMarchOptions.MarchPresets[PN.value];
		saveOptions();
		t.LoadMarchPresets();
		ById('btMarchMessages').innerHTML = tx("March Preset Deleted");
	},

	DoMarch: function (MarchType, SendMaxFood) {
		var t = QuickMarch;
		t.RepaintMarchData();
		t.GetMaxMarchSize();

		var koth = false;
		if (t.targetType==57) { koth=true; }

		var totalunit = 0;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (MarchType != 3 || i==3 || i==46) { totalunit = totalunit + parseIntNan(ById("QMMarchUnit"+i).value); }
		}

		var x = ById("QMToX").value;
		var y = ById("QMToY").value;

		if (ById("QMKnight").value == 0 && MarchType == 4 && !koth) { // attack, try to automatically select knight if none assigned
			if (ById('QMKnight').options.length > 1) {
				ById('QMKnight').selectedIndex = 1;
			}
		}

		var errMsg = "";
		if (x=="" || y=="" || isNaN(x) || isNaN(y) || x < 0 || x > 749 || y < 0 || y > 749) { errMsg += tx("Map co-ordinates must be between 0 and 749")+"!<BR>"; }
		if (ById("QMKnight").value == 0 && MarchType == 4 && !koth) { errMsg += tx("No knight selected")+"!<BR>"; }

		if (MarchType != 3 && MarchType != 4 && !SendMaxFood) {
			t.CalcMaxLoad();
			if ((t.Food + t.Wood + t.Stone + t.Ore + t.Gold + t.Aether) > t.MaxLoad) { errMsg += tx("Too much to carry")+"!<BR>"; }
			if (MarchType == 1 && (t.Food + t.Wood + t.Stone + t.Ore + t.Gold + t.Aether) <= 0) {	errMsg += tx("You must transport something")+"!<BR>"; }
		}
		if (totalunit == 0 && MarchType != 3) { errMsg += tx("You must select some troops")+"!<br>"; }
		if (totalunit > t.MaxTroops) { errMsg += tx("You can only send")+" "+t.MaxTroops+" "+tx("units")+".<br>"; }

		if (errMsg != "") {
			ById('btMarchMessages').innerHTML = "<FONT COLOR=#800>"+errMsg+"</font>";
			return;
		}

		// if we get this far we are good to march...

		var iused = new Array();
		for (var i = 0; i < t.ItemList.length; i++) {
			var elem = ById("QMItem"+t.ItemList[i]);
			if (elem && elem.checked && parseInt(Seed.items["i"+t.ItemList[i]]) > 0) {
				iused.push(t.ItemList[i]);
			}
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.r1 = 0;
		params.r2 = 0;
		params.r3 = 0;
		params.r4 = 0;
		params.r5 = 0;
		params.gold = 0;
		var res = 0;
		if (SendMaxFood) {
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				res += Tabs.Transport.getLoadUnit(i,t.SourceCity.id) * ById("QMMarchUnit"+i).value;
			}
			res = res - 1;
			params.r1 = res;
		}
		params.items = iused.join(",");
		params.cid = t.SourceCity.id;
		params.type = MarchType; // 5 Reassign, 4 Attack, 3 Scout, 2 Reinforce, 1 Transport
		params.xcoord = x;
		params.ycoord = y;
		if (koth) { params.kid = 0; }
		else { params.kid = ById("QMKnight").value; }
		if (MarchType != 3 && MarchType != 4 && !SendMaxFood) {
			params.r1 = Math.min(t.Food,t.MaxFood);
			params.r2 = Math.min(t.Wood,t.MaxWood);
			params.r3 = Math.min(t.Stone,t.MaxStone);
			params.r4 = Math.min(t.Ore,t.MaxOre);
			params.r5 = Math.floor(Math.min(t.Aether/5,t.MaxAether));
			params.gold = Math.min(t.Gold,t.MaxGold);
		}
		for (var ui in CM.UNIT_TYPES) { params["u"+CM.UNIT_TYPES[ui]] = 0; }
		if (MarchType != 3) {
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				if (ById("QMMarchUnit"+i).value > 0) {params["u"+i] = parseIntNan(ById("QMMarchUnit"+i).value);}
			}
		} else {
			params.u46 = parseIntNan(ById("QMMarchUnit46").value);
			if (params.u46==0) {
				params.u3 = parseIntNan(ById("QMMarchUnit3").value);
				if (params.u3==0) { params.u3=1; }
			}
		}
		params.champid = 0;
		if (MarchType == 4) {
			if (ById('QMChamp').value != 0 && ById('QMChamp').value != "") {
				var championidx = "";
				for (var i = 0; i < Seed.champion.champions.length; i++) {
					if (Seed.champion.champions[i].championId == ById('QMChamp').value) championidx = i;
				}
				params.champid = ById('QMChamp').value;
			}
		}
		if (ById('QMSpell').value != 0 && ById('QMSpell').value != "") {
			if (MarchType == 4 || ById('QMSpell').value != "21") {
				params.bs = ById('QMSpell').value;
			}
		}

		t.DisableButtons(true);
		ById('btMarchMessages').innerHTML = "<i><b>"+tx('Sending march')+"....</b></i>";
		March.addMarch(params, function(rslt){
			if (rslt.ok) {
				var ReturnMessage = "";
				switch (MarchType) {
					case 1:	ReturnMessage = tx("Transport successful");	break;
					case 2:	ReturnMessage = tx("Reinforce successful");	break;
					case 3:	ReturnMessage = tx("Scout successful");	break;
					case 4:	ReturnMessage = tx("Attack successful"); break;
					case 5:	ReturnMessage = tx("Reassign successful"); break;
					default: ReturnMessage = tx("March successful");
				}
				ById('btMarchMessages').innerHTML = ReturnMessage;
				t.FromCityClick(t.SourceCity,true); // force update
				t.RefreshItemCounts();
			} else {
				if (rslt.msg) {
					ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>" + rslt.msg + "</b></font>";
				} else {
					ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>"+tx('Error sending march')+"!</b></font>";
				}
			}
			t.DisableButtons(false);
		}, true);
	},

	AddRaid : function (){
		var t = QuickMarch;
		t.RepaintMarchData();
		t.GetMaxMarchSize();
		var totalunit = 0;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			totalunit = totalunit + parseIntNan(ById("QMMarchUnit"+i).value);
		}

		var x = ById("QMToX").value;
		var y = ById("QMToY").value;

		if (ById("QMKnight").value == 0) { // attack, try to automatically select knight if none assigned
			if (ById('QMKnight').options.length > 1) {
				ById('QMKnight').selectedIndex = 1;
			}
		}

		var errMsg = "";
		if (x=="" || y=="" || isNaN(x) || isNaN(y) || x < 0 || x > 749 || y < 0 || y > 749) { errMsg += tx("Map co-ordinates must be between 0 and 749")+"!<BR>"; }
		if (ById("QMKnight").value == 0) { errMsg += tx("No knight selected")+"!<BR>"; }

		if (totalunit == 0) { errMsg += tx("You must select some troops")+"!<br>"; }
		if (totalunit > t.MaxTroops) { errMsg += tx("You can only send")+" "+t.MaxTroops+" "+tx("units")+".<br>"; }

		if (errMsg != "") {
			ById('btMarchMessages').innerHTML = "<FONT COLOR=#800>"+errMsg+"</font>";
			return;
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'saveMarch';
		params.settings = {};
		params.queue = {0:{botMarches:{botMarchStatus:1,botState:1},cityMarches:{}}};

		params.settings.cityId = t.SourceCity.id;
		params.queue[0].cityMarches.knightId = ById("QMKnight").value;
		params.queue[0].cityMarches.toXCoord = x;
		params.queue[0].cityMarches.toYCoord = y;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			params.queue[0]['cityMarches']['unit'+i+'Count'] = parseIntNan(ById("QMMarchUnit"+i).value);
		}

		t.DisableButtons(true);
		ById('btMarchMessages').innerHTML = "<i><b>"+tx("Adding Raid")+"....</b></i>";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				var t = QuickMarch;
				if (rslt.ok) {
					uW.cityinfo_army();
					setTimeout(uW.update_seed_ajax, 250);
					ById('btMarchMessages').innerHTML = tx("Raid Added Successfully");
					Seed.knights['city' +params.settings.cityId]['knt' + params.queue[0].cityMarches.knightId].knightStatus = 10; // update knight instantly!
					t.FromCityClick(t.SourceCity,true); // force update
				} else {
					if (rslt.msg) {
						ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>" + rslt.msg + "</b></font>";
					} else {
						ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>"+tx("Error setting raid")+"!</b></font>";
					}
				}
				t.DisableButtons(false);
			},
			onFailure: function () {
				var t = QuickMarch;
				ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>"+tx("Error communicating with server")+"!</b></font>";
				t.DisableButtons(false);
			}
		},true);
	},

	DisableButtons : function (tf) {
		ById("QMTransport").disabled = tf;
		ById("QMReinforce").disabled = tf;
		ById("QMReinforceFood").disabled = tf;
		ById("QMScout").disabled = tf;
		ById("QMAttack").disabled = tf;
		ById("QMReassign").disabled = tf;
	},

	CalcMarchTime : function () {
		var t = QuickMarch;
		var unit_types = {};
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			var troop_number = parseIntNan(ById("QMMarchUnit"+i).value);
			if (troop_number > 0) { unit_types[ui] = i; }
		}
		var phoenix_wings_used = false;
		var thunder_wings_used = false;
		var red_wings_used = false;
		var green_wings_used = false;
		var elem = ById("QMItem59");
		if (elem && elem.checked && parseInt(Seed.items["i59"]) > 0) {
			phoenix_wings_used = true;
		}
		else {
			elem = ById("QMItem58");
			if (elem && elem.checked && parseInt(Seed.items["i58"]) > 0) {
				thunder_wings_used = true;
			}
			else {
				elem = ById("QMItem57");
				if (elem && elem.checked && parseInt(Seed.items["i57"]) > 0) {
					red_wings_used = true;
				}
				else {
					elem = ById("QMItem55");
					if (elem && elem.checked && parseInt(Seed.items["i55"]) > 0) {
						green_wings_used = true;
					}
				}
			}
		}
		var MarchTime = March.getMarchTime(t.SourceCity.id,unit_types,t.distance,ById("QMSpell").value,phoenix_wings_used,thunder_wings_used,red_wings_used,green_wings_used,(t.targetType==57));
		if (MarchTime.foe==0) {
			ById("QMTime").innerHTML = "";
			return;
		}
		ById("QMTime").innerHTML = tx("Est. Time")+": "+uW.timestr(MarchTime.friend)+" ("+tx("Friend")+"), "+uW.timestr(MarchTime.foe)+" ("+tx("Foe")+")";
	},

	EverySecond : function () {
		var t = QuickMarch;

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter >= 3) { // refresh display every 3 seconds
			t.LoopCounter = 0;
			if (t.SourceCity) {
				t.RepaintMarchData();
				t.RefreshTimedBoosts();
				t.RefreshItemCounts();
			}
		}
	},
}

/** OPTION OBJECTS **/

var anticd = {
	isInited: false,
	KOCversion: '?',
	init: function () {
		try {
			if (this.isInited)
				return this.KOCversion;

			var nullfunc = function () { return; };
			if (typeof exportFunction == 'function') {
				exportFunction(nullfunc,CM.cheatDetector, {defineAs:"detect"});
			}
			else { CM.cheatDetector.detect = nullfunc; };

			var scripts = document.getElementsByTagName('script');
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i].src.indexOf('camelotmain') >= 0) {
					break;
				}
			}
			if (i < scripts.length) {
				var m = scripts[i].src.match(/camelotmain[_]{0,1}[a-z]{0,2}-(.*).js/);
				if (m) this.KOCversion = m[1];
			}
			this.isInited = true;
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	getKOCversion: function () {
		return this.KOCversion;
	},
};

var TreasureChestClick = {
	clickTreasureChest : null,

	init : function (){
		t = TreasureChestClick;

		try {
			uWExportFunction ('treasure_chest_post_hook', t.hook);
			t.clickTreasureChest = new CalterUwFunc ('pop_treasure_chest_modal', [[/if/im, 'treasure_chest_post_hook(a); return; if']]);
			t.clickTreasureChest.setEnable(UserOptions.TreasureChest);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	setEnable : function (tf){
		var t = TreasureChestClick;
		t.clickTreasureChest.setEnable (tf);
	},

	isAvailable : function (){
		var t = TreasureChestClick;
		return t.clickTreasureChest.isAvailable();
	},

	hook : function (tid) {
		var mid = tid;
		var city = null;
		var coords = "";
		var tileName = "Barbarian Camp";
		var logTile = "";
		for (var k in Seed.queue_atkp) {
			if (Seed.queue_atkp[k]['m'+mid]) {
				city = k;
				coords = ' ('+Seed.queue_atkp[k]['m'+mid].toXCoord+','+Seed.queue_atkp[k]['m'+mid].toYCoord+')';
				break;
			}
		}
		if (city) {
			try {
				tileName = (Seed.queue_atkp[city]["m" + mid].toTileType == 51) ? "Barbarian Camp" : capitalize(uW.g_mapObject.types[parseInt(Seed.queue_atkp[city]["m" + mid].toTileType)]);
				logTile = ' in '+tileName+' Level '+Seed.queue_atkp[city]["m" + mid].toTileLevel;
				if (tileName=="Boss") { // DF!!
					if (DeleteReports.ReportLog.ItemsFoundDF["T"]) { DeleteReports.ReportLog.ItemsFoundDF["T"] += 1; }
					else { DeleteReports.ReportLog.ItemsFoundDF["T"] = 1; }
				}
				else {
					for (var i in Options.AttackOptions.Routes) {
						var a = Options.AttackOptions.Routes[i];
						if (Seed.queue_atkp[city]['m'+mid].toXCoord == a.target_x && Seed.queue_atkp[city]['m'+mid].toYCoord == a.target_y && Seed.queue_atkp[city]['m'+mid].marchType==4) {
							if (DeleteReports.ReportLog.ItemsFound["T"]) { DeleteReports.ReportLog.ItemsFound["T"] += 1; }
							else { DeleteReports.ReportLog.ItemsFound["T"] = 1; }
							break;
						}
					}
				}
			}
			catch(e) { };
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.tid = tid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/postFriendVictoryTokenShare.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (UserOptions.BankTreasureChests && UserOptions.TreasureChestBank.length < UserOptions.MaxBankedTreasureChests) {
						var post_link = 'convert.php?pl=1&ty=3&si=118&wccc=fcf-feed-118&ln=31&da='+yyyymmdd(new Date())+'&in=' + uW.tvuid + '&ex=s%3A' + getServerId() + '%7Cf%3A' + rslt.feedId + '%7Cm%3A' + rslt.tokenId + '%7Cimg%3Ahttps%3A%2F%2F'+GameURL+'%2Ffb%2Fe2%2Fsrc%2Fimg%2Fbronze_vip.png%7C&page=convert';
						UserOptions.TreasureChestBank.push({tokenId:rslt.tokenId, feedId:rslt.feedId, serverId:getServerId(), playerId:uW.tvuid, tileName:tileName, unixTime_taken:unixTime(), link:post_link});
						saveUserOptions(uW.user_id);
						actionLog('Chest found'+logTile+coords+' - Link Stored','TREASURE');
					}
					else {
						var reparr = new Array();
						reparr.push(["REPLACE_TiLeNaMe", tileName]);
						reparr.push(["REPLACE_fEeDiD", rslt.feedId]);
						reparr.push(["REPLACE_tOkEnId", rslt.tokenId]);
						uW.common_postToProfile("118", uWCloneInto(reparr));
						actionLog('Chest found'+logTile+coords+' - Link Posted to FB','TREASURE');
					}
				} else {
					actionLog('Chest found'+logTile+coords+' - Error: ' +rslt.error_code+ ',' +rslt.msg+ ',' +rslt.feedback,'TREASURE')
				}
			},
			onFailure: function () {
				actionLog('Chest found'+logTile+coords+' - AJAX Error','TREASURE')
			},
		},true);
	},
}

var KillBox = {
	kboxtime : 1,
	init:function () {
		var t = KillBox;
		t.kboxtime += 1;
		if(!Options.MagicBox) { return; }
		if (t.kboxtime > 50) { return; }
		if (Number(uW.seed.items.i599) == 0) { return; }
		if (!ById('modal_mmb')) {
			setTimeout(KillBox.init,100);
		}
		else {
			uW.Modal.hideModal();
		}
	},
}

var FairieKiller = {
	saveFunc : null,
	init : function (tf){
		try {
			FairieKiller.saveFunc = uW.Modal.showModalUEP;
			FairieKiller.setEnable (tf);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	setEnable : function (tf){
		if (tf)
		uW.Modal.showModalUEP = eval ('function FairieKiller (a,b,c) {actionLog ("Blocked Faire popup");}');
		else
		uW.Modal.showModalUEP = FairieKiller.saveFunc;
	},
}

function fixgamelag () {
	var kfutime = Number(uW.unixtime()+30);
	for (var city in Seed.queue_atkp) {
		var knighthashX = [];
		if(Seed.queue_atkp[city] != "") {
			for (var march in Seed.queue_atkp[city]) {
				if(Seed.queue_atkp[city][march].marchType) {
					if(!Seed.queue_atkp[city][march].botMarchStatus && Seed.queue_atkp[city][march].marchStatus == 5) {
						if (Seed.queue_atkp[city][march].returnUnixTime < kfutime) {
							actionLog(Cities.byID[String(city).replace(/city/,'')].name+': Fixing march '+march, 'MARCH');
							for (var ui in CM.UNIT_TYPES){
								var i = CM.UNIT_TYPES[ui];
								if (Seed.queue_atkp[city][march]['unit'+i+'Count'] > 0) {
									if(Seed.queue_atkp[city][march]['unit'+i+'Return'] == 0 || Seed.queue_atkp[city][march]['unit'+i+'Return'] == undefined) {
										Seed.queue_atkp[city][march]['unit'+i+'Return'] = Seed.queue_atkp[city][march]['unit'+i+'Count'];
									}
								}
							}
							Seed.queue_atkp[city][march].hasUpdated = true;
							Seed.queue_atkp[city][march].marchStatus = 8;
						} else { knighthashX.push(Seed.queue_atkp[city][march].knightId); }
					} else { knighthashX.push(Seed.queue_atkp[city][march].knightId); }
				}
			}
		}
		for (var knight in Seed.knights[city]) {
			if(Seed.knights[city][knight].knightStatus != 1) {
				if(knighthashX.indexOf(Seed.knights[city][knight].knightId) == -1) {
					Seed.knights[city][knight].knightStatus = 1;
					actionLog(Cities.byID[String(city).replace(/city/,'')].name+': Fixing knight '+Seed.knights[city][knight].knightName, 'MARCH');
				}
			}
		}
	}
}

var ChampLagFix = {
	LagFix1: null,
	LagFix2: null,
	init: function () {
		t = ChampLagFix;

		try {
			uW.CE_EFFECT_TIERS = uWCloneInto(CE_EFFECT_TIERS);
			uWExportFunction('btGetTierEffects', function (T) {
				var U = +T.id || 0,
				R = +T.tier || 0,
				V = CE_EFFECT_TIERS,
				S = U + "," + R;
				if (!V[S]) {
					if (R > 1) {
						CM.log.error(2, CM.ERROR_TYPE.INFORMATION_MISSING, "Champion equipment tier {tier} doesn't exist for Effect ID {effectId}. Trying the next tier down.".replace("{effectId}", U).replace("{tier}", R));
						return uW.btGetTierEffects({
							id : U,
							tier : R - 1
						})
					} else {
						CM.log.error(1, CM.ERROR_TYPE.INFORMATION_MISSING, "Champion equipment tier doesn't exist for Effect ID {effectId}. All tiers attempted.".replace("{effectId}", U));
						return {}
					}
				}
				return V[S]
			});

			t.LagFix1 = new CalterUwFunc("cm.ChampionManager.getEffectAmount",[['o(U),','btGetTierEffects(U),']]);
			t.LagFix2 = new CalterUwFunc("cm.ChampionManager.getEffect",[['L(R,','cm.ChampionManager.getEffectAmount(R,'],['e(R','cm.ChampionManager.getEffectName(R']]);
			if (ChampLagFix.isAvailable()) {
				ChampLagFix.setEnable(Options.FixCastleLag);
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = ChampLagFix;
		t.LagFix1.setEnable(tf);
		t.LagFix2.setEnable(tf);
	},
	isAvailable: function () {
		var t = ChampLagFix;
		return (t.LagFix1.isAvailable() && t.LagFix2.isAvailable());
	},
};

var CollectGold = {
	colCity : null,
	colHappy : 0,

	init : function (){
		var t = CollectGold;
		for (var c=0; c < Cities.numCities; c++) {
			if (!Options.lastCollect[Cities.cities[c].id]) {
				Options.lastCollect[Cities.cities[c].id] = 0;
			}
		}
		saveOptions();
	},

	tick : function (){
		var t = CollectGold;
		for (var c=0; c<Cities.numCities; c++){
			var city = Cities.cities[c];
			var happy = Seed.citystats['city'+ city.id].pop[2];
			var since = unixTime() - Options.lastCollect[city.id];
			if ((happy >= parseIntNan(Options.pbGoldHappy)) && (since > 15*60)) { // KoC Restriction 15 mins!
				t.colCity = city;
				t.colHappy = happy;
				t.ajaxCollectGold (city, t.e_ajaxDone);
				break;
			}
		}
	},

	e_ajaxDone : function (rslt){
		var t = CollectGold;
		Options.lastCollect[t.colCity.id] = unixTime();
		saveOptions();
		if (rslt.ok) {
			actionLog (t.colCity.name+': Collected '+ rslt.goldGained +' gold (Happiness was '+ t.colHappy +'%)','GOLD');
		}
		else { actionLog (t.colCity.name+': Error collecting gold ('+rslt.errorMsg+')','GOLD'); }
	},

	ajaxCollectGold : function (city, notify){
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = city.id;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/levyGold.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { notify (rslt); },
			onFailure: function () { notify ({errorMsg:'AJAX error'}); },
		},true);
	},
}

var FoodAlerts = {
	init : function (){
		var t = FoodAlerts;
		for (var c=0; c < Cities.numCities; c++) {
			if (!Options.lastAlert[Cities.cities[c].id]) {
				Options.lastAlert[Cities.cities[c].id] = 0;
			}
			if (!Options.countAlert[Cities.cities[c].id]) {
				Options.countAlert[Cities.cities[c].id] = 0;
			}
		}
		saveOptions();
	},

	tick : function (){
		var t = FoodAlerts;
		var now = unixTime();
		var trupkeepreduce = 0;
		trupkeepreduce = Math.min(equippedthronestats(79), uW.cm.thronestats.boosts.Upkeep.Max);
		var trprodres = Math.min(equippedthronestats(82),uW.cm.thronestats.boosts.ResourceProduction.Max);
		var trprod = [0, 0, 0, 0, 0];
		trprod[1] = Math.min(equippedthronestats(83), uW.cm.thronestats.boosts.ResourceProduction.Max)+trprodres;

		if (Options.pbFoodAlertInt < 1) Options.pbFoodAlertInt = 1;

		for(i=0; i < Cities.numCities; i++) {
			var cityId = Cities.cities[i].id;
			if (isNaN(Seed.resources["city" + cityId]['rec1'][0])) continue; // no alert if can't read the amount...
			var rp = getResourceProduction(cityId);
			var usage = parseIntNan(Seed.resources['city'+cityId]['rec1'][3]);
			var bp = CM.Resources.getProductionBase(1,cityId);
			usage = parseIntNan(rp[1] - usage + bp * trprod[1] / 100);
			var foodleft = parseInt(Seed.resources["city" + cityId]['rec1'][0])/3600;
			if (usage!=0) {
				var timeLeft = parseInt(Seed.resources["city" + cityId]['rec1'][0]) / 3600 / (0-usage) * 3600;
				var msg = '';
				if (usage < 0) {
					var since = unixTime() - Options.lastAlert[cityId];
					if ((timeLeft < (Options.pbFoodAlertInt*3600)) && (since > 15*60)) {
						Options.countAlert[cityId]++;
						if (Options.countAlert[cityId]>3) { // only post alert if more than 3 positive results in a row
							msg += tx('My city')+' '+Cities.cities[i].name.substring(0,10)+' ('+Cities.cities[i].x+','+Cities.cities[i].y+')';
							msg += ' '+tx('is low on food. Remaining')+': '+addCommas(foodleft,true)+' ('+timestrShort(timeLeft)+') '+tx('Upkeep')+': '+addCommas(usage);
							sendChat ("/a " + msg);
							Options.lastAlert[cityId] = unixTime();
						}
					}
					else {
						Options.countAlert[cityId] = 0;
					}
				}
				else {
					Options.countAlert[cityId] = 0;
				}
			}
			else {
				Options.countAlert[cityId] = 0;
			}
		}
	},
}

var RefreshEvery = {
	timer : null,
	PaintTimer : null,
	NextRefresh : 0,
	box : null,
	target : null,

	init : function (){
		var t = RefreshEvery;
		t.creatediv();
		if (Options.btEveryMins < 1)
			Options.btEveryMins = 1;
	},

	creatediv : function(){
		var t = RefreshEvery;
		t.target = ById('comm_tabs');
		if(t.target == null){
			setTimeout(t.creatediv, 2000);
			return;
		}
		t.box = document.createElement('div');
		t.target.appendChild(t.box);
		t.box.addEventListener('click', function () {t.setEnable(Options.btEveryEnable)}, false);
	},

	setEnable : function (tf){
		var t = RefreshEvery;
		clearTimeout (t.timer);
		if (tf) {
			t.NextRefresh = unixTime() + (Options.btEveryMins*60);
			t.timer = setTimeout (t.Paint, 1000);
		} else {
			t.timer = null;
			t.NextRefresh = 0;
			t.box.innerHTML = '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;'+ getMyAlliance()[1] + ' (' + getServerId() +')</b></font></span>';
		}
	},

	doit : function (){
		var t = RefreshEvery;
		t.box.innerHTML = '<span style="Line-Height:35px;"><FONT color=#f80><B>&nbsp;&nbsp;&nbsp;&nbsp;'+tx("Reloading Now!")+'</b></font></span></div>';
		actionLog ('Refreshing ('+ Options.btEveryMins +' minutes expired)');
		ReloadKOC(true);
	},

	setTimer : function (){
		var t = RefreshEvery;
		clearTimeout (t.timer);
		if (Options.btEveryMins < 1) Options.btEveryMins = 1;
		RefreshEvery.setEnable (Options.btEveryEnable);
	},

	Paint : function(){
		var t = RefreshEvery;
		if (t.timer == null) return;
		now = unixTime();
		var text = '';
		var Left = parseInt(t.NextRefresh - now);
		var txtbox = ById('modal_msg_write_txt');
		if ((Left < 0) && (!txtbox || txtbox.value=="") && (!Options.detAFK || afkdetector.isAFK)) {
			clearTimeout (t.timer);
			Left = 0;
			t.doit();
			return;
		};
		if (Left <= -1) text += '<span style="Line-Height:35px;"><FONT color=#f80><B>&nbsp;&nbsp;&nbsp;&nbsp;'+tx("Ready to Reload...")+'</b></font></span></div>';
		else if (Left < 60 && (!Options.detAFK || afkdetector.isAFK)) text += '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;'+tx("Next refresh in")+': </font><FONT color=#f80><B>'+ timestr(Left) +'</b></font></span></div>';
		else text += '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;'+tx("Next refresh in")+': <B>'+ timestr(Left) +'</b></font></span></div>';

		t.box.innerHTML = '<a title="Click to reset countdown timer">'+text+'</a>';
		t.timer = setTimeout (t.Paint, 1000);
	},
}

function ChatComOverlay () {
	if(!ByCl('postaction')[0].getElementsByClassName('button20')[0])return;//safety
	thebutton = ByCl('postaction')[0].getElementsByClassName('button20')[0];
	thebutton.onclick=function(){OSendChat()};
	var overlay = document.createElement("div");
	var mod_comm_input = ById('mod_comm_input');
	var mod_comm_forum = ByCl('mod_comm_forum')[0];
	var mod_comm_list1 = ById('mod_comm_list1');
	var mod_comm_list2 = ById('mod_comm_list2');
	mod_comm_forum.style.position = 'absolute';
	mod_comm_forum.style.height = '30px';
	mod_comm_forum.style.top = '30px';
	mod_comm_list1.style.top = '20px';
	mod_comm_list2.style.top = '20px';
	overlay.setAttribute("id","overlay");
	overlay.setAttribute("class", "overlay");
	mod_comm_input.hidden=true;
	mod_comm_input.parentNode.appendChild(overlay);
	overlay.innerHTML = '<input id="bot_comm_input" type="text" autocorrect="on" autocomplete="off"></input>';
	var bot_comm_input = ById('bot_comm_input');
	bot_comm_input.style.width = "75%";
	bot_comm_input.style.float = "left";
	bot_comm_input.addEventListener ('keypress', function(e) {if(e.which == 13)OSendChat();}, false);
	var x = new CalterUwFunc("Chat.whisper",[[/mod.comm.input/ig,'bot_comm_input']]);
	x.setEnable(true);

	if (Options.ChatOptions.Emoticons) {
		var ab = document.createElement('a');
		ab.className="mod_comm_set";
		ab.innerHTML=tx("Emoticons");
		ab.id="btEmoticonLink";
		ab.style.paddingLeft = '0px';
		mod_comm_forum.insertBefore(ab,mod_comm_forum.firstChild);
		ab.addEventListener ('click', ChatStuff.SmileyHelp, false);
	}
};

function OSendChat () {
	if(Options.ChatOptions.filter)
		ById('mod_comm_input').value = BtFilter(ById('bot_comm_input'));
	else
		ById('mod_comm_input').value = ById('bot_comm_input').value;
	ById('bot_comm_input').value = "";
	uW.Chat.sendChat();
};

function BtFilter(e) {
	var whisper = "";
	var firstindex = 0;
	var enctype = 0;

	if(e.value.charAt(0) == "\\") {
		e.value = String(e.value).slice(1);
		enctype = 1;
	};

	if(e.value.charAt(0) == "/" || e.value.charAt(0) == "@") {
		firstindex = e.value.indexOf(" ");
		whisper = e.value.slice(0,firstindex)+' ';
	};

	var m = e.value.substr(firstindex,e.value.length);

	if(enctype == 1) {
		var unicodeString = '';
		for (var i=0; i < m.length; i++) {
			var theUnicode = m.charCodeAt(i);;;
			theUnicode = '&#' + theUnicode+';';
			unicodeString += theUnicode;
		}
		m = unicodeString;
	};

	if(enctype == 0) {
		var m = e.value.substr(firstindex,e.value.length);
		var x = Filter[Options.ChatOptions.fchar];
		m = m.replace(/Fa/g,'F'+x+'a').replace(/fA/g,'f'+x+'A').replace(/FA/g,'F'+x+'A').replace(/fa/g,'f'+x+'a');
		m = m.replace(/Gr/g,'G'+x+'r').replace(/gR/g,'g'+x+'R').replace(/GR/g,'G'+x+'R').replace(/gr/g,'g'+x+'r');
		m = m.replace(/Ri/g,'R'+x+'i').replace(/rI/g,'r'+x+'I').replace(/RI/g,'R'+x+'I').replace(/ri/g,'r'+x+'i');
		m = m.replace(/Na/g,'N'+x+'a').replace(/nA/g,'n'+x+'A').replace(/NA/g,'N'+x+'A').replace(/na/g,'n'+x+'a');
		m = m.replace(/885/g,'8'+x+'8'+x+'5').replace(/80085/g,'8'+x+'0'+x+'0'+x+'8'+x+'5');
	};
	// strip http:// and https://

	m = m.replace('https://','');
	m = m.replace('http://','');

	return(whisper+m);
};

function enFilter(e) {
	var x = Filter["Null"];
	var m = String(e);
	m = m.replace(/885/g,'8'+x+'8'+x+'5').replace(/80085/g,'8'+x+'0'+x+'0'+x+'8'+x+'5');
	return m;
}

function deFilter(e) {
	var x = Filter["Null"];
	var m = String(e);
	m = m.replace(new RegExp(x, 'g'),'');
	return m;
}

var ChatPane = {
	init : function(){
		var t = ChatPane;

		t.myregexp1 = new RegExp(tx("You are # [0-9]+ of [0-9]+ to help"),"i");
		t.myregexp2 = new RegExp(tx("\'s Kingdom does not need help\."),"i");
		t.myregexp3 = new RegExp(tx("\'s project has already been completed\."),"i");
		t.myregexp4 = new RegExp(tx("\'s project has received the maximum amount of help\."),"i");
		t.myregexp5 = new RegExp(tx("You already helped with (.*?)\'s project\."),"i");
		t.myregexp6 = new RegExp(tx("is low on food. Remaining:"),"i");
		t.myregexp7 = new RegExp(tx("\> "+uW.g_js_strings.getChat.saystoalliance+"\:\<\/b\>"),"i");
		t.myregexp8 = new RegExp(tx("\> "+uW.g_js_strings.sendChat.saystoalliance+"\:\<\/b\>"),"i");
		t.myregexp9 = new RegExp("[(]spam[)]","i");
		t.myregexp10 = new RegExp("[{]spam[}]","i");
		t.myregexp11 = new RegExp("[-]spam[-]","i");
		t.myregexp12 = new RegExp("ptChatAttack","i");
		t.myregexp13 = new RegExp("ptChatScout","i");
		t.myregexp14 = new RegExp(tx("has been")+" "+tx("attacked")+" "+tx("by"),"i");
		t.myregexp15 = new RegExp(tx("has been")+" "+tx("scouted")+" "+tx("by"),"i");

		setInterval(t.HandleChatPane, 2500);
	},

	HandleChatPane : function() {
		var t = ChatPane;

		var DisplayName = GetDisplayName();
		var AllianceChatBox=ById('mod_comm_list2');
		var GlobalChatBox=ById('mod_comm_list1');

		if(AllianceChatBox){
			var chatPosts = document.evaluate(".//div[contains(@class,'chatwrap')]", AllianceChatBox, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
			if(chatPosts){
				for (var i = 0; i < chatPosts.snapshotLength; i++) {
					thisPost = chatPosts.snapshotItem(i);

					if(Options.ChatOptions.HelpRequest){
						var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
						if(postAuthor.snapshotItem(0)){
							var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
							if(postAuthorName != DisplayName){
								var helpAllianceLinks=document.evaluate(".//a[contains(@onclick,'claimAllianceChatHelp')]", thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
								if(helpAllianceLinks){
									for (var j = 0; j < helpAllianceLinks.snapshotLength; j++) {
										thisLink = helpAllianceLinks.snapshotItem(j);
										var alreadyClicked = thisLink.getAttribute("clicked");
										if(!alreadyClicked){
											thisLink.setAttribute('clicked', 'true');
											var myregexp = /(claimAllianceChatHelp\(.*\);)/;
											var match = myregexp.exec(thisLink.getAttribute("onclick"));

											if (match != null) {
												onclickCode = match[0];
												DouW(onclickCode);
											}
										}
									}
								}
							}
						}
					}

					t.HidePostOptions(thisPost,DisplayName);

					if(Options.ChatOptions.DeleteAllianceSpam){ // hide alli spam in alli chat
						if (thisPost.innerHTML.match(t.myregexp9) || thisPost.innerHTML.match(t.myregexp10) || thisPost.innerHTML.match(t.myregexp11)) {
							thisPost.parentNode.removeChild(thisPost);
						}
					}
				}
			}

			// delete alliance chats from global chat if required

			if(Options.ChatOptions.DeleteRequest || Options.ChatOptions.DeleteFood || Options.ChatOptions.DeleteAlert || Options.ChatOptions.DeleteReport || Options.ChatOptions.DeletegAl) {
				var gchatPosts = document.evaluate(".//div[contains(@class,'chatwrap')]", GlobalChatBox, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
				if(gchatPosts) {
					for (var i = 0; i < gchatPosts.snapshotLength; i++) {
						var gthisPost = gchatPosts.snapshotItem(i);

						if (Options.ChatOptions.DeleteRequest) { // Hide alliance request reports in chat - note they don't say "says to the alliance" :/
							if (gthisPost.innerHTML.match(t.myregexp1) || gthisPost.innerHTML.match(t.myregexp2) || gthisPost.innerHTML.match(t.myregexp3) || gthisPost.innerHTML.match(t.myregexp4) || gthisPost.innerHTML.match(t.myregexp5)) {
								gthisPost.parentNode.removeChild(gthisPost);
							}
						}

						if(Options.ChatOptions.DeletegAl) { // hide alliance chat from global chat
							if (gthisPost.innerHTML.match(t.myregexp7) || gthisPost.innerHTML.match(t.myregexp8))
								gthisPost.parentNode.removeChild(gthisPost);
						}
						else {
							t.HidePostOptions(gthisPost,DisplayName);
						}
					}
				}
			}
		}

		// check for global spam

		if(Options.ChatOptions.DeleteGlobalSpam){
			var gchatPosts = document.evaluate(".//div[contains(@class,'chatwrap')]", GlobalChatBox, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
			if(gchatPosts) {
				for (var i = 0; i < gchatPosts.snapshotLength; i++) {
					var gthisPost = gchatPosts.snapshotItem(i);
					if (!gthisPost.innerHTML.match(t.myregexp7) && !gthisPost.innerHTML.match(t.myregexp8) && (gthisPost.innerHTML.match(t.myregexp9) || gthisPost.innerHTML.match(t.myregexp10) || gthisPost.innerHTML.match(t.myregexp11))) { // hide spam from global
						gthisPost.parentNode.removeChild(gthisPost);
					}
				}
			}
		}
	},

	HidePostOptions : function (thisPost,DisplayName) {
		var t = ChatPane;

		if(Options.ChatOptions.DeleteRequest){ // Hide alliance requests in alli chat
			var helpAllianceLinks=document.evaluate(".//a[contains(@onclick,'claimAllianceChatHelp')]", thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
			if(helpAllianceLinks){
				for (var j = 0; j < helpAllianceLinks.snapshotLength; j++) {
					thisLink = helpAllianceLinks.snapshotItem(j);
					thisLink.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(thisLink.parentNode.parentNode.parentNode.parentNode);
				}
			}
			// Hide alliance request reports in alli chat
			if (thisPost.innerHTML.match(t.myregexp1) || thisPost.innerHTML.match(t.myregexp2) || thisPost.innerHTML.match(t.myregexp3) || thisPost.innerHTML.match(t.myregexp4) || thisPost.innerHTML.match(t.myregexp5)) {
				thisPost.parentNode.removeChild(thisPost);
			}
		}

		if(Options.ChatOptions.DeleteFood){ // hide food alerts in alli chat
			var NameArray = [];
			if (Options.ChatOptions.DeleteFoodUsers.trim() != "")
				NameArray = Options.ChatOptions.DeleteFoodUsers.trim().toUpperCase().split(",");
			var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
			if(postAuthor.snapshotItem(0)){
				var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
				if(postAuthorName != DisplayName && ((NameArray.indexOf(postAuthorName.split(" ")[1].toUpperCase()) != -1) || NameArray.length==0)){
					if (thisPost.innerHTML.match(t.myregexp6)) {
						thisPost.parentNode.removeChild(thisPost);
					}
				}
			}
		}

		if(Options.ChatOptions.DeleteAlert){ // hide tower attack alerts in alli chat
			var NameArray = [];
			if (Options.ChatOptions.DeleteAlertUsers.trim() != "")
				NameArray = Options.ChatOptions.DeleteAlertUsers.trim().toUpperCase().split(",");
			var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
			if(postAuthor.snapshotItem(0)){
				var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
				if(postAuthorName != DisplayName && ((NameArray.indexOf(postAuthorName.split(" ")[1].toUpperCase()) != -1) || NameArray.length==0)){
					if (thisPost.outerHTML.match(t.myregexp12)) {
						thisPost.parentNode.removeChild(thisPost);
					}
				}
			}
		}

		if(Options.ChatOptions.DeleteReport){ // hide reports in alli chat
			var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
			if (postAuthor.snapshotItem(0)){
				var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
				if (postAuthorName != DisplayName){
					if (thisPost.innerHTML.match(t.myregexp14) || thisPost.innerHTML.match(t.myregexp15)) {
						thisPost.parentNode.removeChild(thisPost);
					}
				}
			}
		}

		if(Options.ChatOptions.DeleteScout){ // hide tower scout alerts in alli chat
			var NameArray = [];
			if (Options.ChatOptions.DeleteScoutUsers.trim() != "")
				NameArray = Options.ChatOptions.DeleteScoutUsers.trim().toUpperCase().split(",");
			var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
			if(postAuthor.snapshotItem(0)){
				var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
				if(postAuthorName != DisplayName && ((NameArray.indexOf(postAuthorName.split(" ")[1].toUpperCase()) != -1) || NameArray.length==0)){
					if (thisPost.outerHTML.match(t.myregexp13)) {
						thisPost.parentNode.removeChild(thisPost);
					}
				}
			}
		}
	}
}


var ChatStuff = {
	chatDivContentFunc: null,
	getChatFunc: null,
	leaders: {},
	ChatIcons : {},
	Colors : {
		ChatLeaders: '#B8B8B8',
		ChatGlobal: '#CCCCFF',
		ChatAll: '#99CCFF',
		ChatAtt: '#FF4D4D',
		ChatScout: '#FF8800',
		ChatRecall: '#6B8E23',
		ChatWhisper: '#FF4D4D',
		ChatVC: '#00FF00',
		ChatChancy: '#F8E151',
	},
	marchtimer : null,
	marchETA : null,
	marchDIR : '',
	BAOAttack : ['Type : ATTAQUE','Type: ATTACK','Tipo: ATTACCO','TYP: ANGRIFF','Tipo : ATACAR'],
	BAOScout : ['Type : ECLAIREUR','Type: SCOUT','Tipo: ESPLORAZIONE','TYP: Anerkennung','Tipo : EXPLORACION'],

	init: function () {
		var t = ChatStuff;

		try {
			if (getMyAlliance()[0] > 0) {
				t.getAllianceLeaders();
			}
			t.readChatIcons();
			t.chatDivContentFunc = new CalterUwFunc('Chat.chatDivContent', [['return f.join("")', 'var msg = f.join("");\n msg=chatDivContent_hook(msg,d);\n return msg;']]);
			uWExportFunction ('chatDivContent_hook', t.chatDivContentHook);
			uWExportFunction ('chatDivContent_hook2', t.chatDivContentHook2);
			uWExportFunction ('ptChatIconClicked', t.e_iconClicked);
			uWExportFunction ('ptChatReportClicked', Rpt.FindReport);
			uWExportFunction ('ptfetchmarch', t.fetchmarchcaller);
			uWExportFunction('btSelectSmiley', ChatStuff.SelectSmiley);
			uWExportFunction('btSelectText', SelectText);

			t.setEnable(Options.ChatOptions.chatEnhance);
			if (Options.ChatOptions.chatGlobal) {
				ById('mod_comm_list1').className += ' ptChatGlobal ';
			}
			if (Options.ChatOptions.chatAlliance) {
				ById('mod_comm_list2').className += ' ptChatAlliance ';
			}

			ChatComOverlay(); // enable chat filter buster!
			ChatPane.init(); // initialise chat hide functions
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	isAvailable: function () {
		var t = ChatStuff;
		t.chatDivContentFunc.isAvailable();
	},
	setEnable: function (tf) {
		var t = ChatStuff;
		t.chatDivContentFunc.setEnable(tf);
	},

	e_iconClicked: function (name) {
		if (ById('bot_comm_input'))
			var e = ById('bot_comm_input');
		else
			var e = ById('mod_comm_input');
		name = name.replace(/Ã‚Â°Ã‚Â°/g, "'");
		e.value = '@' + name + ' ';
	},

	chatDivContentHook2: function (msg) {
		var div = document.createElement('div');
		div.innerHTML = msg;
		div.innerText = div.innerHTML;
		msg = div.innerHTML.toString();
		return msg.htmlSpecialCharsDecode();
	},

	chatDivContentHook: function (msg, type) {

		function FormatChatTable (msg) {
			var f = msg.indexOf('<div class=\'tx\'>');
			if (f >= 0) {
				msg = msg.replace(/<div class=\'tx\'>/, '</td></tr><div class=\'tx\'><center><table border="1" cellpadding="0"><tr><td>')
				msg = msg.replace(/\|\|/g, '</td></tr><tr><td>');
				var a = msg.indexOf('</div>', f);
				msg = msg.slice(0, a) + '</td></tr></table><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">'+tx('hide')+'</span></a></center>' + msg.slice(a);
			}
			return msg;
		}

		var t = ChatStuff;
		var element_class = '';
		var alliance = false;
		var whisper = false;
		var whisper2 = false;
		var m = /div class=\'info\'>.*<\/div>/im.exec(msg);
		if (m == null) return msg;
		if (type != null) {
			if (type.indexOf(uW.g_js_strings.getChat.saystoalliance) > 0) {
				alliance = true;
			}
			if (type.indexOf(uW.g_js_strings.getChat.whisperstoyou) > 0) {
				whisper = true;
			}
			if (type.indexOf(uW.g_js_strings.sendChat.whispersto) > 0) { // when local whisper it says your name! need this for tower alert whisper
				whisper2 = true;
			}
		}
		var whisp = m[0];
		if (whisper) {
			if (Options.ChatOptions.chatWhisper) {
				element_class += ' ptChatWhisper ';
			}
		} else { //Global & Alliance
			if (Options.ChatOptions.chatBold)
				element_class += ' ptChatBold ';
		}
		var suid = /viewProfile\(this,([0-9]+),/i.exec(m[0]);
		if (!suid) { suid = uW.tvuid; }
		else { suid = suid[1]; }


		if (Options.ChatOptions.chatLeaders) {
			if (t.leaders[suid]) element_class += ' ptChat' + t.leaders[suid];
		}

		var glorytitle = '';
		var aid = getMyAlliance()[0];
		if (Options.ChatOptions.GloryLeader && Options.ChatOptions.GloryLeaderAID==aid && Options.ChatOptions.GloryLeaderUID==suid) {
			element_class += ' ptChatGLORY';
			glorytitle = "title='Glory: "+addCommas(Options.ChatOptions.GloryLeaderGlory)+"'";
		}
		if (Options.ChatOptions.Rainbow && suid==uW.tvuid) {
			element_class += ' ptChatRAINBOW';
		}

		if (Options.ChatOptions.chatIcons) {
			if (t.ChatIcons[suid]) { msg = msg.replace(/\bhttps\:\/\/[-a-z].*\'\/\>/i, "https://graph.facebook.com/" + t.ChatIcons[suid] + "/picture\'\/\>"); }
			else { t.getfbid(suid); }
		}
		msg = msg.replace("class='chatIcon'", " class='chatIcon' title='"+tx('Click to send a message')+"' onclick='getMessageWindow("+suid+",\"UID:"+suid+"\");return false;' ");
		var fchar = new RegExp(atob('rQ=='), "g");
		msg = msg.replace(fchar, "").replace(/\&\#8232\;/g, "");
		if ((alliance || whisper2) && Options.ChatOptions.chatAttack) {
			//barcode style catch
			if (m[0].indexOf('.::.') >= 0) {
				element_class = ' ptChatRecall';
				msg = FormatChatTable(msg);
				msg = msg.replace('.::.', '');
			}
			if (m[0].indexOf('.:..') >= 0) {
				element_class = ' ptChatScout';
				msg = FormatChatTable(msg);
				msg = msg.replace('.:..', '');
			}
			if (m[0].indexOf('..:.') >= 0) {
				element_class = ' ptChatAttack';
				msg = FormatChatTable(msg);
				msg = msg.replace('..:.', '');
			}
			// legacy
			if (m[0].indexOf(uW.g_js_strings.modal_messages_viewreports_view.scoutingat) >= 0)
				element_class = ' ptChatScout';
			// detect BAO alerts
			for (var a=0;a<t.BAOAttack.length;a++) {
				if (m[0].indexOf(t.BAOAttack[a]) >= 0) {
					element_class = ' ptChatAttack';
					break;
				}
			}
			for (var a=0;a<t.BAOScout.length;a++) {
				if (m[0].indexOf(t.BAOScout[a]) >= 0) {
					element_class = ' ptChatScout';
					break;
				}
			}
		}
		//general use tables
		if (m[0].indexOf(':::.') >= 0) {
			msg = FormatChatTable(msg);
			msg = msg.replace(':::.', '');
		}
		msg = msg.replace(/\|/g, '<br>');
		msg = msg.replace("class=\'content\'", "class='content " + element_class + "' "+glorytitle);
		msg = msg.replace(/<div class=\'tx\'>/, '<div ondblclick="btSelectText(this);" class=\'tx\'>')

		if (m[0].indexOf('Report No:') && Options.ReportOptions.NoDuplicateReports){
			var rid = /(\bReport\sNo:\s([0-9]+))/g.exec(msg);
			if (rid) {AllianceReportsCheck.addAllianceReport({reportId:rid[2], reportUnixTime:unixTime()});}
		}

		msg = msg.replace(/(\bReport\sNo\:\s([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
		msg = msg.replace(/(\bRpt\:([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
		msg = msg.replace(/#([0-9]+)#/g, '<a onclick=\'ptChatReportClicked($1,0)\'>$1</a>');

		if (m[0].indexOf('UID:')){ msg = msg.replace (/(\bUID:\s([0-9]+))/g, 'UID: $2 <a onclick=\'btMonitorExternalCallUID($2)\'>(Monitor)</a>'); }
		if (m[0].indexOf('TRC:')){ msg = msg.replace (/(\bTRC:\s([0-9]+))/g, 'UID: $2 <a onclick=\'btMonitorExternalCallUID($2)\'>(Monitor)</a>'); }
		if (m[0].indexOf('March id:') && Options.FetchMarchInfo){
			var mid = /(\bMarch\sid:\s([0-9]+))/g.exec(msg);
			if (mid && Tabs.MarchCrawl && Tabs.MarchCrawl.CrawlResult) {t.fetchmarch(mid[2],Tabs.MarchCrawl.CrawlResult);}
			msg = msg.replace (/(\bMarch\sid:\s([0-9]+))/g, '<a onclick=\'ptfetchmarch($2)\'>'+tx('Additional March details')+' ---></a>');
		}

		msg = msg.replace(/(\byoutube([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/www\.$1\',\'_blank\'\)\">$1</a>');
		msg = msg.replace(/(\byoutu\.be([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/www\.$1\',\'_blank\'\)\">$1</a>');
		msg = msg.replace(/(\btinyurl([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/www\.$1\',\'_blank\'\)\">$1</a>');
		msg = msg.replace(/(\W)(bot)(\W)/gi, '$1<a onclick=window.open("http://greasyfork.org/en/scripts/11839-koc-power-bot-plus")>$2</a>$3');
		msg = msg.replace(/(\W)(PB+)(\W)/gi, '$1<a onclick=window.open("http:///www.facebook.com/PowerBotPlus/")>$2</a>$3');
		if (KOCMON_ON) {
			msg = msg.replace(/(\W)(kocmon)(\W)/gi, '$1<a onclick=window.open("http://www.kocmon.com/")>$2</a>$3');
		}
		msg = msg.replace(/(\W)(kocinfo)(\W)/gi, '$1<a onclick=window.open("http://www.facebook.com/groups/SolarsKOCinfoPage/")>$2</a>$3');
		var m = /(Lord|Lady) (.*?)</im.exec(msg);
		if (m != null)
			m[2] = m[2].replace(/\'/g, "\\\'");
		msg = msg.replace(/<img (.*?>)/img, '<A onclick=\"ptChatIconClicked(\'' + m[2] + '\')\"><img class=\"ptChatIcon\" $1</a>');
		if (Options.ChatOptions.ImagePreviews) { msg = msg.replace(/(\bi.imgur([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\"><img style="width:initial;height:initial;max-width:100%;float:none" src="http\:\/\/$1"></a><center><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">'+tx('hide')+'</span></a></center>'); }
		else { msg = msg.replace(/(\bi.imgur([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\">$1</a>'); }
		if (Options.ChatOptions.ImagePreviews) { msg = msg.replace(/(\bi.giphy([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\"><img style="width:initial;height:initial;max-width:100%;float:none" src="http\:\/\/$1"></a><center><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">'+tx('hide')+'</span></a></center>'); }
		else { msg = msg.replace(/(\bi.giphy([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\">$1</a>'); }
		if (Options.ChatOptions.ImagePreviews) { msg = msg.replace(/(\bi[0-9]+.tinypic([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\"><img style="width:initial;height:initial;max-width:100%;float:none" src="http\:\/\/$1"></a><center><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">'+tx('hide')+'</span></a></center>'); }
		else { msg = msg.replace(/(\bi[0-9]+.tinypic([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\">$1</a>'); }
		if (Options.ChatOptions.ImagePreviews) { msg = msg.replace(/(\bs[0-9]+.postimg([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\"><img style="width:initial;height:initial;max-width:100%;float:none" src="http\:\/\/$1"></a><center><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">'+tx('hide')+'</span></a></center>'); }
		else { msg = msg.replace(/(\bs[0-9]+.postimg([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\">$1</a>'); }
		if (Options.ChatOptions.Emoticons) {
			for (k in Smileys) {
				msg=replaceAll(msg,k, '<img class=smileyimage src=\"'+Smileys[k]+'\">',false); // no ignore case!
			}
		}
		for (k in ChatStyles) {
			if (Options.ChatOptions.Styles) { msg=replaceAll(msg,k, '<span style="'+ChatStyles[k]+'">',true); }
			else { msg=replaceAll(msg,k, '',true); }
		}
		if (Options.ChatOptions.Styles) { msg=replaceAll(msg,'[#]', '</span>',true); }
		else { msg=replaceAll(msg,'[#]', '',true); }

		if (whisper && Options.ChatOptions.enableWhisperAlert) {
			AudioManager.setVolume(Options.ChatOptions.Volume);
			AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.WhisperPlay));
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 2500);
		}
		if ((element_class == ' ptChatAttack') && Options.ChatOptions.enableTowerAlert) {
			var SoundAlert = true;
			if (Options.ChatOptions.DeleteAlert){
				var NameArray = [];
				if (Options.ChatOptions.DeleteAlertUsers.trim() != "")
					NameArray = Options.ChatOptions.DeleteAlertUsers.trim().toUpperCase().split(",");
				if ((NameArray.indexOf(m[2].toUpperCase()) != -1) || NameArray.length==0){
					SoundAlert = false;
				}
			}
			if (SoundAlert) {
				AudioManager.setVolume(Options.ChatOptions.Volume);
				AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.TowerPlay));
				AudioManager.play();
				AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 5000);
			}
		}
		if ((element_class == ' ptChatScout') && Options.ChatOptions.enableScoutAlert) {
			var SoundAlert = true;
			if (Options.ChatOptions.DeleteScout){
				var NameArray = [];
				if (Options.ChatOptions.DeleteScoutUsers.trim() != "")
					NameArray = Options.ChatOptions.DeleteScoutUsers.trim().toUpperCase().split(",");
				if ((NameArray.indexOf(m[2].toUpperCase()) != -1) || NameArray.length==0){
					SoundAlert = false;
				}
			}
			if (SoundAlert) {
				AudioManager.setVolume(Options.ChatOptions.Volume);
				AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.ScoutPlay));
				AudioManager.play();
				AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 5000);
			}
		}

		return msg;
	},

	getAllianceLeaders: function () {
		var t = ChatStuff;
		var params = uW.Object.clone(uW.g_ajaxparams);
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceGetLeaders.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.officers) {
					for (var uid in rslt.officers) {
						var user = rslt.officers[uid];
						t.leaders[user.userId] = user.type.substr(0, 4);
					}
				}
			},
		});
	},

	getfbid: function (uid) {
		fetchPlayerCourt(uid, ChatStuff.addfbuid);
	},

	addfbuid: function (rslt) {
		var t = ChatStuff;
		if (rslt.ok) {
			var uid = parseInt(rslt.playerInfo.userId);
			var fbid = parseInt(rslt.playerInfo.fbuid);
			t.ChatIcons[uid] = fbid;
			t.saveChatIcons();
		}
	},

	readChatIcons : function () {
		var t = ChatStuff;
		s = GM_getValue('ChatIcons');
		if (s != null) {
			opts = JSON2.parse(s);
			for (var k in opts) {
				t.ChatIcons[k] = opts[k];
			}
		}
	},

	saveChatIcons : function () {
		var t = ChatStuff;
		GM_setValue('ChatIcons', JSON2.stringify(t.ChatIcons));
	},

	fetchmarchcaller : function(mid) {
		var t = ChatStuff;
		t.fetchmarch(mid,ChatStuff.MarchPopup);
	},

	fetchmarch : function (mid,notify,qc) {
		var t = ChatStuff;
		if(!mid) { notify({}); return; }
		if (ById('ptfetchmarch')) ById('ptfetchmarch').innerHTML = tx("Fetching March")+"...";

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = mid;
		var atimer = setTimeout(function() {notify ({errorMsg:'Fetch march timed out (March ID '+mid+')'});}, 6000);
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMarch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				clearTimeout(atimer);
				if (rslt.ok){
					if (qc) {
						var ui = [];
						var n = {name:'???'}
						ui.push(n);
						notify ({userInfo:ui},{userInfo:ui},rslt.march);
					}
					else {
						t.fetchmarchPlayerInfo(rslt.march.fromPlayerId, rslt.march.toPlayerId, notify, rslt.march);
					}
				}
				else {
					notify ({errorMsg:'Fetch march error (March ID '+mid+')'});
				}
			},
			onFailure: function () {
				clearTimeout(atimer);
				notify ({errorMsg:'AJAX error'});
			},
		},true);
	},

	fetchmarchPlayerInfo : function (uid, uid2, notify, march, uidrslt) {
		var t = ChatStuff;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (uid2 && uid2 != 0) {
					t.fetchmarchPlayerInfo(uid2,0,notify,march,rslt);
				}
				else {
					if (!uidrslt) {
						notify (rslt,uidrslt,march);
					}
					else {
						notify (uidrslt,rslt,march);
					}
				}
			},
			onFailure: function () { notify ({errorMsg:'AJAX error'}); },
		},true);
	},

	UpdateMarchTime : function () {
		var t = ChatStuff;
		clearTimeout(t.marchtimer);
		var now = unixTime();
		var arrivalTime = t.marchETA - now;
		if (arrivalTime >= 0) {
			marchtime = uW.timestr(arrivalTime);
			t.marchtimer = setTimeout(t.UpdateMarchTime, 1000);
		}
		else {
			if (t.marchDIR == "") {
				marchtime = tx('Landed! (Please Refresh)');
			}
			else {
				marchtime = tx("Completed.");
			}
		}
		if (ById('ptmarchtime')) {
			ById('ptmarchtime').innerHTML = marchtime+t.marchDIR;
		}
	},

	MarchPopup : function (rslt,rslt2,march) {
		var t = ChatStuff;
		clearTimeout(t.marchtimer);

		var n = '<table align=center width=95% cellspacing=0 cellpadding=0>';
		n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

		if (rslt.userInfo) {
			if (Tabs.MarchCrawl && Tabs.MarchCrawl.catalogMarch) setTimeout( function () {Tabs.MarchCrawl.catalogMarch(rslt,rslt2,march);},0);

			var u = rslt.userInfo[0];
			var alli = 'None';
			if (u.allianceName)
				alli = u.allianceName + FormatDiplomacy(u.allianceId);

			var u2;
			if (rslt2 && rslt2.userInfo) {
				u2 = rslt2.userInfo[0];
				var alli2 = 'None';
				if (u2.allianceName)
					alli2 = u2.allianceName + FormatDiplomacy(u2.allianceId);
			}

			var a = march;
			n += '<tr><td class=xtabBR width=150>'+tx('March ID')+'</td><td class=xtab><b><input type=text id=ptmid value="'+a.marchId+'" '+(trusted?"":"enabled")+'>&nbsp;&nbsp;<a id=ptfetchmarch>'+tx('Refresh')+'</a></b></td></tr>';
			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			var marchStatus = parseInt(a.marchStatus);
			var now = unixTime();
			var destinationUnixTime = convertTime(new Date(a["destinationEta"].replace(" ", "T")+"Z")) - now;
			var returnUnixTime = convertTime(new Date(a["returnEta"].replace(" ", "T")+"Z")) - now;

			if ((destinationUnixTime < 0) || (marchStatus == 8) || (marchStatus == 2))
				marchdir = "Return";
			else
				marchdir = "Count";

			if (destinationUnixTime >= 0) {
				marchtime = uW.timestr(destinationUnixTime);
				t.marchETA = convertTime(new Date(a["destinationEta"].replace(" ", "T")+"Z"));
				t.marchDIR = '';
				t.marchtimer = setTimeout(t.UpdateMarchTime, 1000);
			}
			else {
				if (marchStatus == 2) {
					marchtime = uW.g_js_strings.commonstr.encamped;
				}
				else {
					if (returnUnixTime < 0) {
						marchtime = tx("Completed")+" ("+uW.timestr(returnUnixTime*(-1)) +" "+tx('ago')+")";
					}
					else {
						if (marchStatus == 8) {
							marchtime = uW.timestr(returnUnixTime)+' ('+uW.g_js_strings.commonstr.returning+')';
							t.marchETA = convertTime(new Date(a["returnEta"].replace(" ", "T")+"Z"));
							t.marchDIR = ' ('+uW.g_js_strings.commonstr.returning+')';
							t.marchtimer = setTimeout(t.UpdateMarchTime, 1000);
						}
						else {
							marchtime = tx("Waiting");
						}
					}
				}
			}
			n += '<tr><td class=xtab>'+tx('Time/Status')+'</td><td class=xtabBR id=ptmarchtime><b>'+marchtime+'</b></td></tr>';
			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.nametx+'</td><td class=xtabBR><b>' + u.genderAndName + '</b><td></tr>';
			n += '<tr><td class=xtab>UID</td><td class=xtabBR><b>' + MonitorLinkUID(a.fromPlayerId)+'</b></td></tr>';
			n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.might+'</td><td class=xtabBR>' + addCommas(parseInt(u.might))+'</td></tr>';
			n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.alliance+'</td><td class=xtabBR>'+ alli +'</td></tr>';

			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			var marchType = parseInt(a.marchType);
			if (marchType == 10) marchType=4; // Change Dark Forest type to Attack!
			var	hint = "";
			switch (marchType) {
				case 1: hint=uW.g_js_strings.commonstr.transport;break;
				case 2: hint=uW.g_js_strings.commonstr.reinforce;break;
				case 3: hint=uW.g_js_strings.commonstr.scout;break;
				case 4: hint=uW.g_js_strings.commonstr.attack;break;
				case 5: hint=uW.g_js_strings.commonstr.reassign;break;
			}
			n += '<tr><td class=xtab>'+tx('March Type')+'</td><td class=xtabBR><b>'+hint+'</b></td></tr>';
			n += '<tr><td class=xtab>'+tx('From')+'</td><td class=xtabBR><b>'+coordLink(a.fromXCoord,a.fromYCoord)+'</b></td></tr>';
			n += '<tr><td class=xtab>'+tx('CityID')+'</td><td class=xtabBR>'+a.fromCityId+'</td></tr>';
			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			var totile = tileTypes[parseInt(a["toTileType"])];
			if (a["toTileType"] == 51) {
				if (!a["toPlayerId"]) { totile = "???"; }
				else { if (a["toPlayerId"] == 0) totile = 'Barb Camp'; }
			}
			totile = 'Lvl '+a["toTileLevel"]+' '+totile;
			n += '<tr><td class=xtab>To</td><td class=xtabBR><b>'+coordLink(a.toXCoord,a.toYCoord)+'&nbsp;'+totile+'</b></td></tr>';
			if (a["toCityId"] != 0) n += '<tr><td class=xtab>'+tx('CityID')+'</td><td class=xtabBR>'+a.toCityId+'</td></tr>';

			if (a["toPlayerId"] != 0 && a["toPlayerId"] != a["fromPlayerId"]) n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.nametx+'</td><td class=xtabBR><b>'+u2.genderAndName+'</b></td></tr>';
			if (a["toPlayerId"] != 0 && a["toPlayerId"] != a["fromPlayerId"]) n += '<tr><td class=xtab>UID</td><td class=xtabBR><b>'+MonitorLinkUID(a.toPlayerId)+'</b></td></tr>';
			if (a["toPlayerId"] != 0 && a["toPlayerId"] != a["fromPlayerId"]) n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.might+'</td><td class=xtabBR>' + addCommas(parseInt(u2.might))+'</td></tr>';
			if (a["toPlayerId"] != 0 && a["toPlayerId"] != a["fromPlayerId"]) n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.alliance+'</td><td class=xtabBR>'+ alli2 +'</td></tr>';
			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			if (a["championId"] && a["championId"] != 0) {
				n +='<tr><td class=xtab>'+tx('Champion')+'</td><td class=xtabBR>'+tx('Champion ID')+':'+a["championId"]+'</td></tr>'; // this is all we can get from march :/
			}

			if (a["knightId"] > 0) n +='<tr><td class=xtab>'+uW.g_js_strings.commonstr.knight+'</td><td class=xtabBR>'+a.knightName+' (Atk:'+ a["knightCombat"]+')</td></tr>';

			n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.troops+'</td><td class=xtabBR>';
			for (var ui in CM.UNIT_TYPES){
				i = CM.UNIT_TYPES[ui];
				if((a["unit"+i+"Count"] > 0) || (a["unit"+i+"Return"] > 0)) {
					trpcol = Options.Colors.PanelText;
					original = '';
					if ((marchdir == "Return") && (a["unit"+i+"Return"] < a["unit"+i+"Count"])) { trpcol = '#f00'; original = '&nbsp;</span><span>('+addCommas(a["unit"+i+"Count"])+')'}
					n += '<span class=xtab>'+ uW.unitcost['unt'+i][0] +': <span class=xtab style="color:'+trpcol+'">'+ addCommas(a["unit"+i+marchdir])+original+'</span></span> ';
				}
			}
			n += '</td></tr>';

			if (a["fromSpellType"]) {
				var spell = uW.g_js_strings.spells['name_'+a["fromSpellType"]];
				if (spell) {
					n +='<tr><td class=xtab>'+tx('Battle Spell')+'</td><td class=xtab><b>'+spell+'</b></td></tr>';
				}
			}

			if (a["gold"] > 0) n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.gold+'</td><td class=xtabBR>'+ addCommas(a["gold"]) +'</td></tr>';
			if (a["resource1"] > 0) n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.food+'</td><td class=xtabBR>'+ addCommas(a["resource1"]) +'</td></tr>';
			if (a["resource2"] > 0) n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.wood+'</td><td class=xtabBR>'+ addCommas(a["resource2"]) +'</td></tr>';
			if (a["resource3"] > 0) n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.stone+'</td><td class=xtabBR>'+ addCommas(a["resource3"]) +'</td></tr>';
			if (a["resource4"] > 0) n += '<tr><td class=xtab>'+uW.g_js_strings.commonstr.ore+'</td><td class=xtabBR>'+ addCommas(a["resource4"]) +'</td></tr>';
			if (a["resource5"] > 0) n += '<tr><td class=xtab>'+tx('Aether')+'</td><td class=xtabBR>'+ addCommas(a["resource5"]) +'</td></tr>';
		}
		else {
			n += '<tr><td class=xtab width=150>'+tx('March ID')+'</td><td class=xtabBR><b><input type=text id=ptmid value="" '+(trusted?"":"enabled")+'>&nbsp;&nbsp;<a id=ptfetchmarch>'+tx('Fetch')+'</a></b></td></tr>';
			if (rslt.errorMsg) {
				n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';
				n += '<tr><td class=xtabBR colspan=2>'+rslt.errorMsg+'</td></tr>';
			}
		}
		n += '</table>';

		var MarchPop = null;

		var off = getAbsoluteOffsets(ById('mod_comm_list2'));
		if (off.top<=0) { off.top = 0; }
		MarchPop = new CPopup('ptShowMarch', off.left, off.top, 500, 500, true, function () {
					clearTimeout(t.marchtimer);
		});
		MarchPop.getTopDiv().innerHTML = '<DIV align=center><B>'+tx('MARCH DETAILS')+'</B></DIV>';
		MarchPop.getMainDiv().innerHTML = n;
		ById('ptfetchmarch').addEventListener('click', function () { uW.ptfetchmarch(ById('ptmid').value) }, false);

		MarchPop.show(true);
	},

	SelectSmiley: function(what) {

		function insertAtCaret(areaId, text) {
			var txtarea = ById(areaId);
			var scrollPos = txtarea.scrollTop;
			var caretPos = txtarea.selectionStart;

			var front = (txtarea.value).substring(0, caretPos);
			var back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
			txtarea.value = front + text + back;
			caretPos = caretPos + text.length;
			txtarea.selectionStart = caretPos;
			txtarea.selectionEnd = caretPos;
			txtarea.focus();
			txtarea.scrollTop = scrollPos;
		};
		insertAtCaret("bot_comm_input"," "+what+" ");return;
	},

	SmileyHelp : function (){
		var t = ChatStuff;
		if (t.smileypop) {
			t.smileypop.show(false);
			if (t.smileypop.onClose) t.smileypop.onClose();
			t.smileypop.destroy();
			t.smileypop = null;
			return;
		}

		var helpText = '<DIV style="max-height:400px; height:400px; overflow-y:auto">';
		helpText += '<TABLE width=100% cellspacing=0 cellpadding=2 border=0 class=xtab><tr>';
		var row=0;
		for (k in Smileys) {
			helpText += '<TR><TD align=right><a><img title="'+tx("click to insert to chat")+'" class=smileyimage src=\"'+Smileys[k]+'\" onclick="btSelectSmiley(\''+k+'\')"></a></td><TD align=right><font size=1>'+k+'</td></tr>';
		}
		helpText += '<TR><TD align=right><b>'+tx('Text Styles')+'</b></td><TD align=right>&nbsp;</td></tr>';
		for (k in ChatStyles) {
			helpText += '<TR><TD align=right><a onclick="btSelectSmiley(\''+k+'\');">'+ChatStyles[k]+'</a></td><TD align=right><font size=1>'+k+'</td></tr>';
		}
		helpText += '<TR><TD align=right><a onclick="btSelectSmiley(\'[#]\');">'+tx('end style')+'</a></td><TD align=right><font size=1>[#]</td></tr>';
		helpText += '</table></div><br>';

		var off = getOffset(ById('btEmoticonLink'));
		t.smileypop = new CPopup('BotHelp', off.left, off.top+20, 200, 400, true);
		t.smileypop.getMainDiv().innerHTML = helpText;
		t.smileypop.getTopDiv().innerHTML = '<CENTER><B>'+tx("Emoticons")+'</b></center>';
		t.smileypop.show (true);
		ResetFrameSize('BotHelp',400,200);
	},
}

var Rpt = {
	reportpos:{x: -999, y: -999},
	popReport:null,
	atkmight:0,
	defmight:0,

	FindReport: function (rpId, pageNum) {
		var t = Rpt;
		FetchReport(rpId,function(rslt) {
			jQuery('#viewreports_marchreport_'+rpId).removeClass('unread');
			if (!rslt.ok) {
				var a = document.createElement("div");
				a.className = "chatwrap clearfix noalliance";
				a.innerHTML = "<div>" + rslt.msg + "</div>";
				jQuery("#mod_comm_list" + uW.Chat.chatType).prepend(a);
			}
			else {
				var rpt = rslt['index'];
				rpt.Side0PlayerId = rslt['index']['side0PlayerId'];
				rpt.Side0AllianceId = rslt['index']['side0AllianceId'];
				rpt.Side1PlayerId = rslt['index']['side1PlayerId'];
				t.GetNames(rpId, rpt);
			}
		});
	},

	GetNames: function (rpId, rpt) {
		var t = Rpt;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = rpt.Side1PlayerId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				rpt.side1Name = rslt['userInfo']['0']['name'];
				rpt.side1AllianceName = rslt['userInfo']['0']['allianceName'];
				if (rpt.Side0PlayerId && rpt.Side0PlayerId != 0) {
					var params = uW.Object.clone(uW.g_ajaxparams);
					params.uid = rpt.Side0PlayerId;
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params,
						onSuccess: function (rslt) {
							rpt.side0Name = rslt['userInfo']['0']['name'];
							rpt.side0AllianceName = rslt['userInfo']['0']['allianceName'];
							t.GetReport(rpId, rpt);
						},
					}, false);
				} else {
					rpt.side0Name = uW.g_js_strings.commonstr.enemy;
					t.GetReport(rpId, rpt);
				}
			},
		}, true);
	},

	GetReport: function (rpId, rpt) {
		var t = Rpt;
		var side = 1;
		if (rpt.Side0PlayerId == uW.tvuid) {
			side = 0;
		} else {
			if (rpt.Side1PlayerId == uW.tvuid) {
				side = 1;
			} else {
				if (Seed.allianceDiplomacies) {
					if (parseInt(rpt.side0AllianceId) == parseInt(Seed.allianceDiplomacies.allianceId)) {
						side = 0;
					}
				}
			}
		}

		rpt.sideId = side;
		FetchReportDetail(rpId,side,function(rslt) {
			if (!rslt || rslt.error_code)
				actionLog('Unable to display report','REPORTS');
			else
				t.ReportPopup(rslt, rpt, rpId);
		});
	},

	ReportPopup : function (rslt, rpt, reportId) {
		var t = Rpt;

		var m = '';
		var unitImg = [];
		var unitName = [];
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			unitName[i] = uW.unitcost['unt' + i][0];
			unitImg[i] = '<img src="'+TroopImagePrefix + i + TroopImageSuffix + '" title="'+unitName[i]+'">';
		}

		unitName[53] = tx('Crossbows');
		unitName[55] = tx('Trebuchet');
		unitName[60] = uW.fortcost.frt60[0];
		unitName[61] = uW.fortcost.frt61[0];
		unitName[62] = uW.fortcost.frt62[0];
		unitName[63] = uW.fortcost.frt63[0];
		unitName[99] = uW.buildingcost.bdg31[0];
		unitName[100] = uW.buildingcost.bdg30[0];

		unitImg[53] = '<img src="'+IMGURL+'units/unit_53_30.jpg" title="'+unitName[53]+'">';
		unitImg[55] = '<img src="'+IMGURL+'units/unit_55_30.jpg" title="'+unitName[55]+'">';
		unitImg[60] = '<img src="'+IMGURL+'units/unit_60_30.jpg" title="'+unitName[60]+'">';
		unitImg[61] = '<img src="'+IMGURL+'units/unit_61_30.jpg" title="'+unitName[61]+'">';
		unitImg[62] = '<img src="'+IMGURL+'units/unit_62_30.jpg" title="'+unitName[62]+'">';
		unitImg[63] = '<img src="'+IMGURL+'units/unit_63_30.jpg" title="'+unitName[63]+'">';
		unitImg[99] = '<img src="'+IMGURL+'units/redoubt_30.jpg" title="'+unitName[99]+'" width=30>';
		unitImg[100] = '<img src="'+IMGURL+'units/tower_30.jpg" title="'+unitName[100]+'" width=30>';

		for (var i = 101; i < 111; i++) {
			unitName[i] = uW.g_js_strings.monsterUnitsNames["m" + i];
			unitImg[i] = '<img src="'+TroopImagePrefix + i + TroopImageSuffix + '" title="'+unitName[i]+'">';
		}

		var trEffect = [];
		for (var k in uW.cm.thronestats.tiers)
			trEffect[k] = uW.g_js_strings.effects["name_" + k].replace("%1$s", "nn% ");
		var chEffect = ["hpm", "hpr", "dam", "arm", "str", "dex", "con", "hit", "cri", "blk"];
		var chEffectName = [uW.g_js_strings.champion_stats.hp, uW.g_js_strings.report_view.hp_remaining, uW.g_js_strings.champion_stats.damage, uW.g_js_strings.effects.name_203, uW.g_js_strings.effects.name_204, uW.g_js_strings.effects.name_205, uW.g_js_strings.effects.name_206, uW.g_js_strings.effects.name_207, uW.g_js_strings.effects.name_208, uW.g_js_strings.effects.name_209];
		rpt.marchName = '?';
		if (rpt.marchType == 0)
			rpt.marchName = tx('Desertion');
		else if (rpt.marchType == 1)
			rpt.marchName = uW.g_js_strings.commonstr.transport;
		else if (rpt.marchType == 2)
			rpt.marchName = uW.g_js_strings.commonstr.reinforce;
		else if (rpt.marchType == 3) {
			if (rpt.sideId == 0)
				rpt.marchName = tx('Anti-Scout');
			else
				rpt.marchName = uW.g_js_strings.commonstr.scout;
		} else if (rpt.marchType == 4) {
			if (rpt.sideId == 0)
				rpt.marchName = uW.g_js_strings.commonstr.defend;
			else
				rpt.marchName = uW.g_js_strings.commonstr.attack;
		} else if (rpt.marchType == 9)
			rpt.marchName = uW.g_js_strings.commonstr.raid;
		else if (rpt.marchType == 10)
			rpt.marchName = uW.g_js_strings.commonstr.darkForest;
		if (parseInt(rpt.side0TileType) <= 50)
			rpt.side0TileTypeText = tileTypes[parseInt(rpt.side0TileType)];
		else if (parseInt(rpt.side0TileType) == 57)
			rpt.side0TileTypeText = tx('Runic Megalith');
		else if (parseInt(rpt.side0CityId) == 0)
			rpt.side0TileTypeText = tx('Barb Camp');
		else
			rpt.side0TileTypeText = tx('City');

		var koth=false;
		if (parseInt(rpt.side0TileType) == 57) koth=true;

		function buildHeader() {
			var h = '<div id=reportHeader style="width:100%;">';
			h += '<div id=reportHeaderLeft style="float:left;width:30%;text-align:left;">';
			h += formatUnixTime(rpt.reportUnixTime);
			h += '<br>';
			h += '<b>'+tx('Glory Gained')+': ';
			if (rslt['glory'])
				h += addCommas(rslt['glory']);
			else
				h += '0';
			h += '</b></div>';
			h += '<div id=reportHeaderCenter style="float:left;width:40%;text-align:center;">';
			if (rpt.side0TileTypeText != tx('City') && rpt.side0TileTypeText != tx('Barb Camp') && rpt.marchType == 4) {
				if (rpt.sideId == 0) {
					if (rslt['conquered'] != 0) { h += '<FONT color="#CC0000"><B>'+tx('Conquered')+'</B></font>'; }
					else { h += '<FONT color="#080"><B>'+tx('Secured')+'</B></font>'; }
				}
				else {
					if (rslt['conquered'] != 0) { h += '<FONT color="#080"><B>'+tx('Conquered')+'</B></font>'; }
					else { h += '<FONT color="#CC0000"><B>'+tx('Secured')+'</B></font>'; }
				}
			} else if ((rslt['winner'] == 1 && rpt.sideId == 0) || (rslt['winner'] == 0 && rpt.sideId == 1)) {
				if (rpt.marchName == uW.g_js_strings.commonstr.scout)
					h += '<FONT color="#CC0000"><B>'+tx('Scouting Failed')+'</B></font>';
				else
					h += '<FONT color="#CC0000"><B>'+tx('You were defeated')+'</B></font>';
			} else if (rslt['winner'] == 0 && rpt.sideId == 0)
				h += '<FONT color="#080"><B>'+tx('You defended successfully')+'!</B></font>';
			else if (rslt['winner'] == 1 && rpt.sideId == 1) {
				if (rpt.marchName == uW.g_js_strings.commonstr.scout)
					h += '<FONT color="#080"><B>'+tx('Scouting Report')+'</B></font>';
				else
					h += '<FONT color="#080"><B>'+tx('You were victorious')+'!</B></font>';
			}
			h += '</div>';
			h += '<div id=reportHeaderRight style="float:right;width:30%;text-align:right;">';
			h += 'Report No: ' + reportId;
			h += '<br><input id=ptpostreportid onclick="Chat.sendChat(\'/a Report No: ' + enFilter(reportId) + '\')" style="font-size:9px" type="submit" value="'+tx('Post To Chat')+'">';
			if ((rpt.side1PlayerId && (rpt.side1PlayerId == uW.tvuid)) || (rpt.side0PlayerId && (rpt.side0PlayerId == uW.tvuid))) { h += '&nbsp;<input id=ptDeleteReport style="color:#f00;font-size:9px" type="submit" value="'+uW.g_js_strings.commonstr.deletetx+'">'; } //Delete button for own reports
			h += '</div></div><div style="clear:both;"></div>';
			return h;
		}

		function formatTroopLine(side,unit_type,overwhelmed,fought,survived) {
			var t = Rpt;
			var n = '';
			n += '<TR><TD>'+unitImg[unit_type]+'</td><td>'+unitName[unit_type]+'</td>';
			if (overwhelmed) {
				n += '<TD align=center>???</td>';
				n += '<TD align=center>???</td>';
				if (fought > 0) {
					n += '<TD align=center><FONT color="#CC0000">(' + addCommas(fought) + ')</FONT></td></tr>';
					if (side=="s0" && unit_type<50) { t.defmight += parseInt(uW.unitmight['unt'+unit_type] * fought); }
					if (side=="s0" && unit_type>=50 && unit_type<99) {
						var fm = parseIntNan(fortmight['f'+unit_type]);
						t.defmight += parseInt(fm * fought);
					}
				} else {
					n += '<TD align=center>0</td></tr>';
				}
			}
			else {
				var killed = parseInt(fought)-parseInt(survived);
				if (killed > 0) {
					n += '<TD align=center>' + addCommas(fought) + '</td>';
					n += '<TD align=center><FONT color="#CC0000">' + addCommas(survived) + '</FONT></td>';
					n += '<TD align=center><FONT color="#CC0000">(' + addCommas(killed) + ')</FONT></td></tr>';
					if (side=="s1") { t.atkmight += parseInt(uW.unitmight['unt'+unit_type] * killed); }
					if (side=="s0" && unit_type<50) { t.defmight += parseInt(uW.unitmight['unt'+unit_type] * killed); }
					if (side=="s0" && unit_type>=50 && unit_type<99) {
						var fm = parseIntNan(fortmight['f'+unit_type]);
						t.defmight += parseInt(fm * killed);
					}
				} else {
					n += '<TD align=center>' + addCommas(fought) + '</td>';
					n += '<TD align=center>' + addCommas(survived) + '</td></tr>';
				}
			}
			return n;
		};

		function buildBattle() {
			var t = Rpt;
			var m = '';

			t.atkmight = 0;
			t.defmight = 0;
			//header
			m += '<div class="divHeader" align=left>'+tx('Battle Results').toUpperCase()+'</div>';
			//summary
			m += '<div id=battleSummaryContainer>';
			//summary - attacker
			m += '<div style="width:50%;float:left;">';
			m += '<B>'+tx('Attackers')+':</B> '+rpt.side1Name+' (<A class=xlink onclick="btGotoMapRpt('+rpt.side1XCoord+','+rpt.side1YCoord+')">'+rpt.side1XCoord+','+rpt.side1YCoord+'</a>) ';
			if (rslt['winner'] == 1)
				m += '<FONT color="#CC0000"><B> '+tx('Winner')+'</B></FONT>';
			m += '<br>';
			if (rpt.side1AllianceId && (rpt.side1AllianceId != 0)) m += uW.g_js_strings.commonstr.alliance+':&nbsp;<span style='+DiplomacyColours(rpt.side1AllianceId)+'>'+rpt.side1AllianceName+'</span><br>';
			if (rpt.side1PlayerId && (rpt.side1PlayerId != 0)) m += 'UID:&nbsp;'+MonitorLinkUID(rpt.side1PlayerId)+'<br>';
			if (rpt.marchName == uW.g_js_strings.commonstr.attack || rpt.marchName == uW.g_js_strings.commonstr.defend)
				m += tx('Knight Combat Skill')+': '+rslt['s1KCombatLv']+'<br>';
			if (rslt['s1spell'] && (rslt['s1spell'] != "0")) {
				m += tx('Spell Used')+': <b>'+uW.g_js_strings.spells['name_' + rslt['s1spell']]+'</b><br>';
			}
			m += '<span id=atkmightlost>&nbsp;</span></div>';
			//summary - defender
			m += '<div style="width:50%;float:left;">';
			m += '<B>'+tx('Defenders')+'</B> ' + rpt.side0Name + ' (<A class=xlink onclick="btGotoMapRpt(' + rpt.side0XCoord + ',' + rpt.side0YCoord + ')">' + rpt.side0XCoord + ',' + rpt.side0YCoord + '</a>) ';
			if (rslt['winner'] == 0)
				m += '<FONT color="#CC0000"><B> '+tx('Winner')+'</B></FONT>';
			m += '<br>';
			if (rpt.side0AllianceId && (rpt.side0AllianceId != 0)) m += uW.g_js_strings.commonstr.alliance+':&nbsp;<span style='+DiplomacyColours(rpt.side0AllianceId)+'>' + rpt.side0AllianceName + '</span><br>';
			if (rpt.side0PlayerId && (rpt.side0PlayerId != 0)) m += 'UID:' + MonitorLinkUID(rpt.side0PlayerId) + '<br>';
			if (rpt.marchName == uW.g_js_strings.commonstr.attack || rpt.marchName == uW.g_js_strings.commonstr.defend)
				m += tx('Knight Combat Skill')+': ' + rslt['s0KCombatLv'] + '<br>';
			if (rslt['s0spell'] && (rslt['s0spell'] != "0")) {
				m += tx('Spell Used')+': <b>' + uW.g_js_strings.spells['name_' + rslt['s0spell']] + '</b><br>';
			}
			if (rslt['fght']["s0"] && rpt.side0PlayerId && (rpt.side0PlayerId != 0)) {
				m += '<span id=defmightlost>&nbsp;</span><br>';
			}
			if (rslt['rnds']) m += tx('Rounds')+': ' + rslt['rnds'] + '<br>';
			if (rslt['darkForestConflict']) {
				m += uW.g_js_strings.report_view.darkForestConflict;
			} else {
				if (rpt.marchName == uW.g_js_strings.commonstr.attack || rpt.marchName == uW.g_js_strings.commonstr.defend) {
					if (rpt.side0TileTypeText != tx('City') && rpt.side0TileTypeText != tx('Barb Camp')) {
						if (rslt['conquered'] != 0)
							m += tx('Attackers conquered the')+' '+rpt.side0TileTypeText+'.';
						else if (rslt['conquered'] == 0)
							m += tx('Attackers did not conquer the')+' '+rpt.side0TileTypeText+'.';
					} else {
						if (rslt['wall']) {
							if (rslt['wall'] == 100)
								m += tx('Attackers breached the walls')+'.';
							else
								m += tx('Attackers did not breach the walls')+'. '+tx('The walls are')+' ' + rslt['wall'] + '% '+tx('damaged');
						}
					}
				}
			}
			m += '</div>';
			m += '</div>'; //end battlesummary div
			//troops
			m += '<div id=battleTroopsContainer style="clear:both">';
			//troops - attacker
			m += '<div style="width:50%;float:left;"><TABLE cellspacing=0 class=ptTab width=100%>';
			if (rslt['fght']["s1"]) {
				m += '<TR><TH class=xtabHD></TH><TH class=xtabHD align=left>'+uW.g_js_strings.commonstr.troops+'</TH><TH class=xtabHD align=center>'+tx('Fought')+'</TH><TH class=xtabHD align=center>'+tx('Survived')+'</TH><TH class=xtabHD align=center>'+tx('Killed')+'</TH></TR>';
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					if (rslt['fght']["s1"]['u'+i]) {
						m += formatTroopLine("s1",i,false,rslt['fght']["s1"]['u'+i][0],rslt['fght']["s1"]['u'+i][1]);
					}
				}
			}
			m += '</table></div>';
			//troops - defender
			m += '<div style="width:50%;float:left;">';
			m += '<TABLE cellspacing=0 class=ptTab width=100%>';
			if (rslt['fght']["s0"]) {
				m += '<TR><TH class=xtabHD></TH><TH class=xtabHD align=left>'+uW.g_js_strings.commonstr.troops+'</TH><TH class=xtabHD align=center>'+tx('Fought')+'</TH><TH class=xtabHD align=center>'+tx('Survived')+'</TH><TH class=xtabHD align=center>'+tx('Killed')+'</TH></TR>';
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					if (rslt['fght']["s0"]['u'+i] && rslt['fght']["s0"]['u'+i][0]!=null) {
						m += formatTroopLine("s0",i,rslt.overwhelmed,rslt['fght']["s0"]['u'+i][0],rslt['fght']["s0"]['u'+i][1]);
					}
				}
				for (var i = 53; i <= 55; i++) {
					if (rslt['fght']["s0"]['f'+i]) {
						m += formatTroopLine("s0",i,rslt.overwhelmed,rslt['fght']["s0"]['f'+i][0],rslt['fght']["s0"]['f'+i][1]);
					}
				}
				for (var i = 60; i <= 63; i++) {
					if (rslt['fght']["s0"]['f'+i]) {
						m += formatTroopLine("s0",i,rslt.overwhelmed,rslt['fght']["s0"]['f'+i][0],rslt['fght']["s0"]['f'+i][1]);
					}
				}
				for (var i = 99; i <= 100; i++) {
					if (rslt['fght']["s0"]['u'+i] && rslt['fght']["s0"]['u'+i][0]!=null) {
						m += formatTroopLine("s0",i,rslt.overwhelmed,rslt['fght']["s0"]['u'+i][0],rslt['fght']["s0"]['u'+i][1]);
					}
				}
				for (var i = 101; i <= 110; i++) {
					if (rslt['fght']["s0"]['m'+i]) {
						m += formatTroopLine("s0",i,rslt.overwhelmed,rslt['fght']["s0"]['m'+i][0],rslt['fght']["s0"]['m'+i][1]);
					}
				}
			}
			else {
				m += '<TR><TD>'+tx('No Troops Defended')+'</TD></TR>';
			}
			m += '</table>';
			m += '</div>';
			m += '</div>'; //end troops div
			m += '<div style="clear:both"></div>';
			return m;
		}

		function formatTroopStat(Attr,name,spelltitle,unitId,pulseHits) {
			var TroopString = '';
			var TroopStyle = '';
			var TroopTitle = '';
			if (Attr) {
				if (Attr[0] < Attr[1]) TroopStyle = 'color:green';
				if (Attr[1] < Attr[0]) TroopStyle = 'color:red';
				if (Attr[1]!=Attr[0] && Attr[0]!=0) TroopTitle = 'title="'+Math.round((Attr[1]-Attr[0])/Math.round(Attr[0])*100*100)/100+'%"';
				if (spelltitle) {
					if (unitId==38 || unitId==49) {
						TroopTitle = 'title="'+uW.g_js_strings.report_view["spellcaster" + unitId].replace("%2$s", addCommas(Math.round(Attr[1] * 100) / 100))+'"';
						if (unitId==38) { TroopTitle = TroopTitle.replace("%1$s%", pulseHits); }
						else { TroopTitle = TroopTitle.replace("%1$s", pulseHits); }
					}
					else {
						if (unitId==41) {
							TroopTitle = 'title="'+uW.g_js_strings.report_view["spellcaster" + unitId].replace("%2$s", addCommas(Math.round(Attr[1] * 100) / 100))+'"';
							TroopTitle = TroopTitle.replace("%1$s", addCommas(Math.round(pulseHits * 100) / 100));
						}
						else {
							if (unitId==39 || unitId==40 || unitId==43) {
								TroopTitle = 'title="'+uW.g_js_strings.report_view["spellcaster" + unitId].replace("%1$s%", addCommas(pulseHits))+'"';
							}
							else {
								TroopTitle = 'title="'+uW.g_js_strings.report_view["spellcaster" + unitId].replace("%1$s", addCommas(Math.round(Attr[1] * 100) / 100))+'"';
							}
						}
					}
				}
				if (unitId==38 || unitId==49) { TroopString = '<td style="width:33%;" align=left '+TroopTitle+'><font size="1"><b>'+tx(name)+': </b><span style="'+TroopStyle+'">' + pulseHits + '&nbsp;/&nbsp;'+addCommas(Math.round(Attr[1] * 100) / 100) + '%</span></font></td>'; }
				else {
					if (unitId==41) { TroopString = '<td style="width:33%;" align=left '+TroopTitle+'><font size="1"><b>'+tx(name)+': </b><span style="'+TroopStyle+'">' + addCommas(Math.round(pulseHits * 100) / 100) + '%&nbsp;/&nbsp;'+addCommas(Math.round(Attr[1] * 100) / 100)+'%</span></font></td>'; }
					else {
						if (unitId==39 || unitId==40 || unitId==43) { TroopString = '<td style="width:33%;" align=left '+TroopTitle+'><font size="1"><b>'+tx(name)+': </b><span style="'+TroopStyle+'">' + addCommas(pulseHits) + '</span></font></td>'; }
						else { TroopString = '<td style="width:33%;" align=left '+TroopTitle+'><font size="1"><b>'+tx(name)+': </b><span style="'+TroopStyle+'">' + addCommas(Math.round(Attr[1] * 100) / 100) + '</span></font></td>'; }
					}
				}
			}
			return TroopString;
		};

		function buildTroopStats() {
			var m = '';
			if (rslt['bonus']) {
				//header
				m += '<a id=reportTroopStatsHdr class=divLink ><div class="divHeader" align=left><img id=reportTroopStatsArrow height="10" src="'+RightArrow+'">&nbsp;'+uW.g_js_strings.report_view.troop_stats.toUpperCase()+'</div></a>';
				//stats
				m += '<div id=reportTroopStats class="divHide">';
				//troops - attacker - stats
				m += '<div style="width:50%;float:left;">';
				if (rslt['fght']["s1"]) {
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						if (rslt['fght']["s1"]['u'+i] && rslt['bonus']['mod']["s1"]['u'+i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['hp'],'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['atk'],'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['def'],'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['spd'],'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['rng'],'Rng');
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['ld'],'Ld');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['sp'],'Spell');
							if(i==38) {
								m += formatTroopStat([rslt['bonus']['mod']['s1']['u'+i]['pulseBuff'],rslt['bonus']['mod']['s1']['u'+i]['pulseBuff']],'Effect',true,i,rslt['bonus']['mod']['s1']['u'+i]['pulseHits']);
							}
							else {
								if(i==41) {
									m += formatTroopStat([rslt['bonus']['mod']['s1']['u'+i]['troopSpeedBuff'],rslt['bonus']['mod']['s1']['u'+i]['troopSpeedBuff']],'Effect',true,i,rslt['bonus']['mod']['s1']['u'+i]['troopLoadBuff']);
								}
								else {
									if(i==39) {
										m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['spellEffect'],'Effect',true,i,rslt['bonus']['mod']['s1']['u'+i]['lWitchHits']);
									}
									else {
										if(i==40) {
											m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['spellEffect'],'Effect',true,i,rslt['bonus']['mod']['s1']['u'+i]['draHits']);
										}
										else {
											if(i==43) {
												m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['spellEffect'],'Effect',true,i,rslt['bonus']['mod']['s1']['u'+i]['giantHits']);
											}
											else {
												if(i==49) {
													m += formatTroopStat([rslt['bonus']['mod']['s1']['u'+i]['curseBuff'],rslt['bonus']['mod']['s1']['u'+i]['curseBuff']],'Effect',true,i,rslt['bonus']['mod']['s1']['u'+i]['curseHits']);
												}
												else {
													m += formatTroopStat(rslt['bonus']['mod']['s1']['u'+i]['spellEffect'],'Effect',true,i);
												}
											}
										}
									}
								}
							}
							m += '</tr></table></div>';
						}
					}
				}
				m += '</div>';
				//troops - defender - stats
				m += '<div style="width:50%;float:left;">';
				if (rslt['fght']["s0"]) {
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						if (rslt['fght']["s0"]['u'+i] && rslt['bonus']['mod']["s0"]['u'+i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['hp'],'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['atk'],'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['def'],'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['spd'],'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['rng'],'Rng');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['sp'],'Spell');
							if(i==38) {
								m += formatTroopStat([rslt['bonus']['mod']['s0']['u'+i]['pulseBuff'],rslt['bonus']['mod']['s0']['u'+i]['pulseBuff']],'Effect',true,i,rslt['bonus']['mod']['s0']['u'+i]['pulseHits']);
							}
							else {
								if(i==41) {
									m += formatTroopStat([rslt['bonus']['mod']['s0']['u'+i]['troopSpeedBuff'],rslt['bonus']['mod']['s0']['u'+i]['troopSpeedBuff']],'Effect',true,i,rslt['bonus']['mod']['s0']['u'+i]['troopLoadBuff']);
								}
								else {
									if(i==39) {
										m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['spellEffect'],'Effect',true,i,rslt['bonus']['mod']['s0']['u'+i]['lWitchHits']);
									}
									else {
										if(i==40) {
											m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['spellEffect'],'Effect',true,i,rslt['bonus']['mod']['s0']['u'+i]['draHits']);
										}
										else {
											if(i==43) {
												m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['spellEffect'],'Effect',true,i,rslt['bonus']['mod']['s0']['u'+i]['giantHits']);
											}
											else {
												if(i==49) {
													m += formatTroopStat([rslt['bonus']['mod']['s0']['u'+i]['curseBuff'],rslt['bonus']['mod']['s0']['u'+i]['curseBuff']],'Effect',true,i,rslt['bonus']['mod']['s0']['u'+i]['curseHits']);
												}
												else {
													m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['spellEffect'],'Effect',true,i);
												}
											}
										}
									}
								}
							}
							m += '</tr></table></div>';
						}
					}
					for (var i = 53; i <= 55; i++) {
						if (rslt['fght']["s0"]['f'+i] && rslt['bonus']['mod']['s0']['f'+i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['hp'],'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['atk'],'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['def'],'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['spd'],'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['rng'],'Rng');
							m += '</tr></table></div>';
						}
					}
					for (var i = 60; i <= 63; i++) {
						if (rslt['fght']["s0"]['f'+i] && rslt['bonus']['mod']['s0']['f'+i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['hp'],'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['atk'],'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['def'],'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['spd'],'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f'+i]['rng'],'Rng');
							m += '</tr></table></div>';
						}
					}
					for (var i = 99; i <= 100; i++) {
						if (rslt['fght']["s0"]['u'+i] && rslt['bonus']['mod']["s0"]['u'+i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['hp'],'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['atk'],'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['def'],'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['spd'],'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u'+i]['rng'],'Rng');
							m += '</tr></table></div>';
						}
					}
					for (var i = 101; i <= 110; i++) {
						if (rslt['fght']["s0"]['m'+i] && rslt['bonus']['mod']['s0']['m'+i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m'+i]['hp'],'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m'+i]['atk'],'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m'+i]['def'],'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m'+i]['spd'],'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m'+i]['rng'],'Rng');
							m += '</tr></table></div>';
						}
					}
				}
				m += '</div>';
				m += '<div style="clear:both">&nbsp;</div>';
				m += '</div>'; //end reportTroopStats div
			}
			return m;
		}

		function buildChampDuel() {
			var m = '';
			if (rslt['champion_stats']) {
				s1name = rslt.champion_stats['s1'].nam;
				s1win = rslt.champion_stats['s1'].won;
				s1percent = Math.round(1000*parseIntNan(rslt.champion_stats['s1'].hpr)/parseIntNan(rslt.champion_stats['s1'].hpm))/10;
				s0name = rslt.champion_stats['s0'].nam;
				s0win = rslt.champion_stats['s0'].won;
				s0percent = Math.round(1000*parseIntNan(rslt.champion_stats['s0'].hpr)/parseIntNan(rslt.champion_stats['s0'].hpm))/10;
				if ((s1name != '') || (s0name != '') || s1win || s0win) {
					//header
					m += '<a id=reportChampDuelHdr class=divLink ><div class="divHeader" align=left><img id=reportChampDuelArrow height="10" src="'+DownArrow+'">&nbsp;'+tx('Champion Duel').toUpperCase()+'</div></a>';
					//summary
					m += '<div id=reportChampDuel>';
					m += '<div id=ChampStatContainer>';
					m += '<div style="width:50%;float:left;">';
					if ((s1name == '') && (s1win || s0win)) {
						s1name = uW.g_js_strings.champ.no_champ;
					}
					if (s1win) {
						s1name += '&nbsp;('+tx('Winner')+')';
					}
					m += '<b>' + s1name + '</b><br>';
					for (var i = 1; i < chEffect.length; i++) {
						if (rslt.champion_stats['s1'][chEffect[i]]) {
							m += chEffectName[i] + ': ' + rslt.champion_stats['s1'][chEffect[i]];
							if (i==1&&s1win) m += ' <span class=boldGreen>('+s1percent+'%)</span>';
							m += '<br>';
						}
					}
					m += '</div>'; //attacker
					m += '<div style="width:50%;float:left;">';
					if ((s0name == '') && (s1win || s0win)) {
						s0name = uW.g_js_strings.champ.no_champ;
					}
					if (s0win) {
						s0name += '&nbsp;('+tx('Winner')+')';
					}
					m += '<b>' + s0name + '</b><br>';
					for (var i = 1; i < chEffect.length; i++) {
						if (rslt.champion_stats['s0'][chEffect[i]]) {
							m += chEffectName[i] + ': ' + rslt.champion_stats['s0'][chEffect[i]];
							if (i==1&&s0win) m += ' <span class=boldGreen>('+s0percent+'%)</span>';
							m += '<br>';
						}
					}
					m += '</div>'; //defender
					m += '</div>'; //ChampStatContainer
					m += '<div style="clear:both">&nbsp;</div>';
					if (rslt.bonus) {
						if (rslt.bonus['chp']) {
							m+='<div id=ChampAdjContainer style="clear:both">';
							m+='<div style="width:50%;float:left;">';
							m+='<b>'+tx('Champion Adjustments')+'</b><br><TABLE class=ptTab width=100%>';
							if (rslt.bonus['chp']['s0'] || rslt.bonus['chp']['s1']) {
								for (var i in uW.cm.thronestats.tiers) {
									trEffect[i] = uW.g_js_strings.throneRoom["effectName_" + i];
									var TRStyles = getTREffectStyle(i);
									if (rslt.bonus['chp']['s1'] && rslt.bonus['chp']['s1'][0][i]) {
										m+='<TR><TD colspan=4>' + TRStyles.LineStyle + trEffect[i] +': ' + (Math.round(rslt.bonus['chp']['s1'][0][i]*100)/100) + TRStyles.EndStyle + '</TD></TR>';
									}
									if (rslt.bonus['chp']['s0'] && rslt.bonus['chp']['s0'][1][i]) {
										m+='<TR><TD colspan=4>' + TRStyles.LineStyle + trEffect[i] +': ' + (Math.round(rslt.bonus['chp']['s0'][1][i]*100)/100) + TRStyles.EndStyle + '</TD></TR>';
									}
								}
							}
							m+='</table></br>'
							m+='</div>';//attacker
							m+='<div style="width:50%;float:left;">';
							m+='<b>'+tx('Champion Adjustments')+'</b><br><TABLE class=ptTab width=100%>';
							if (rslt.bonus['chp']['s0'] || rslt.bonus['chp']['s1']) {
								for (var i in uW.cm.thronestats.tiers) {
									trEffect[i] = uW.g_js_strings.throneRoom["effectName_" + i];
									var TRStyles = getTREffectStyle(i);
									if (rslt.bonus['chp']['s0'] && rslt.bonus['chp']['s0'][0][i]) {
										m+='<TR><TD colspan=4>' + TRStyles.LineStyle + trEffect[i] +': ' + (Math.round(rslt.bonus['chp']['s0'][0][i]*100)/100) + TRStyles.EndStyle + '</TD></TR>';
									}
									if (rslt.bonus['chp']['s1'] && rslt.bonus['chp']['s1'][1][i]) {
										m+='<TR><TD colspan=4>' + TRStyles.LineStyle + trEffect[i] +': ' + (Math.round(rslt.bonus['chp']['s1'][1][i]*100)/100) + TRStyles.EndStyle + '</TD></TR>';
									}
								}
							}
							m+='</table></br>'
							m+='</div>';//defender
							m+='</div>';//ChampAdjContainer
							m+='<div style="clear:both">&nbsp;</div>';
						}
					}
					m += '</div>'; //reportChampDuel
				}
			}
			return m;
		}

		function buildThroneStats() {
			var m = '';
			//header
			m += '<a id=reportThroneHdr class=divLink ><div class="divHeader" align=left><img id=reportThroneArrow height="10" src="'+DownArrow+'">&nbsp;'+tx('Throne Stats').toUpperCase()+'</div></a>';
			//summary
			m += '<div id=reportThrone>';
			m += '<div style="width:50%;float:left;">';

			var SortOrder = [];
			if (Options.AlternateSortOrder) { for (var z in AlternateSortOrder) SortOrder.push(AlternateSortOrder[z]); }
			else { for (var z in trEffect) SortOrder.push(z);	}

			if (rslt['s1ThroneRoomBoosts']) {
				for (var id in rslt['s1ThroneRoomBoosts']) {
					if (CompositeEffects.hasOwnProperty(id)) {
						var Composite = CompositeEffects[id]
						for (var e=0;e<Composite.length;e++) {
							if (!rslt['s1ThroneRoomBoosts'][Composite[e]]) rslt['s1ThroneRoomBoosts'][Composite[e]] = 0;
							rslt['s1ThroneRoomBoosts'][Composite[e]] += rslt['s1ThroneRoomBoosts'][id];
						}
						delete rslt['s1ThroneRoomBoosts'][id];
					}
				}
				for (var z in SortOrder) {
					var i = SortOrder[z];
					if (rslt['s1ThroneRoomBoosts'][i]) {
						var TRStyles = getTREffectStyle(i);
						m += TRStyles.LineStyle + trEffect[i] + ': ' + rslt['s1ThroneRoomBoosts'][i] + '%' + TRStyles.EndStyle + '</span><br>';
					}
				}
			}
			else { m += '&nbsp;'; }
			m += '</div>'; //attacker
			m += '<div style="width:50%;float:left;">';
			if (rslt['s0ThroneRoomBoosts']) {
				for (var id in rslt['s0ThroneRoomBoosts']) {
					if (CompositeEffects.hasOwnProperty(id)) {
						var Composite = CompositeEffects[id]
						for (var e=0;e<Composite.length;e++) {
							if (!rslt['s0ThroneRoomBoosts'][Composite[e]]) rslt['s0ThroneRoomBoosts'][Composite[e]] = 0;
							rslt['s0ThroneRoomBoosts'][Composite[e]] += rslt['s0ThroneRoomBoosts'][id];
						}
						delete rslt['s0ThroneRoomBoosts'][id];
					}
				}
				for (var z in SortOrder) {
					var i = SortOrder[z];
					if (rslt['s0ThroneRoomBoosts'][i]) {
						var TRStyles = getTREffectStyle(i);
						m += TRStyles.LineStyle + trEffect[i] + ': ' + rslt['s0ThroneRoomBoosts'][i] + '%' + TRStyles.EndStyle + '</span><br>';
					}
				}
			}
			else { m += '&nbsp;'; }
			m += '</div>'; //defender
			m += '<div style="clear:both">&nbsp;</div>';
			m += '</div>'; //throne container
			return m;
		}

		function buildBoosts() {
			var m = '';
			//header
			m += '<a id=reportBoostsHdr class=divLink ><div class="divHeader" align=left><img id=reportBoostsArrow height="10" src="'+DownArrow+'">&nbsp;'+tx('Troop Adjustments').toUpperCase()+'</div></a>';
			//summary
			m += '<div id=reportBoosts>';
			if (rslt['s1atkBoost'] || rslt['s1defBoost'] || rslt['s1lifeBoost'] || rslt['s0atkBoost'] || rslt['s0defBoost'] || rslt['s0lifeBoost']) {
				m += '<div style="width:50%;float:left;">';
				m += '<b>'+tx('Item Boosts')+'</b><br>';
				if (rslt['s1atkBoost'])
					m += tx('Attack Boosted')+': ' + 100 * rslt['s1atkBoost'] + '%<br>';
				if (rslt['s1defBoost'])
					m += tx('Defence Boosted')+': ' + 100 * rslt['s1defBoost'] + '%<br>';
				if (rslt['s1lifeBoost'])
					m += tx('Health Boosted')+': ' + 100 * rslt['s1lifeBoost'] + '%<br>';
				m += '</div>'; //attacker
				m += '<div style="width:50%;float:left;">';
				m += '<b>'+tx('Item Boosts')+'</b><br>';
				if (rslt['s0atkBoost'])
					m += tx('Attack Boosted')+': ' + 100 * rslt['s0atkBoost'] + '%<br>';
				if (rslt['s0defBoost'])
					m += tx('Defence Boosted')+': ' + 100 * rslt['s0defBoost'] + '%<br>';
				if (rslt['s0lifeBoost'])
					m += tx('Health Boosted')+': ' + 100 * rslt['s0lifeBoost'] + '%<br>';
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			if (rslt['arcaneBonus'] && (rslt['arcaneBonus']['s0AllianceBonus'] || rslt['arcaneBonus']['s1AllianceBonus'])) {
				m += '<div style="width:50%;float:left;">';
				m += '<b>'+tx('Arcane Temple Boosts')+' ('+tx('Alliance')+')</b><br>';
				if (rslt['arcaneBonus']['s1AllianceBonus']) {
					var ArcBonus = rslt['arcaneBonus']['s1AllianceBonus'];
					for (var z in ArcBonus) {
						if (ArcBonus.hasOwnProperty(z)) {
							var ArcName = uW.itemlist['i'+ArcBonus[z].itemId].name + ' - ' + uW.itemlist['i'+ArcBonus[z].itemId].description;
							m += ArcName + ': ' + ArcBonus[z].effect + '%<br>';
						}
					}
				}
				m += '</div>'; //attacker
				m += '<div style="width:50%;float:left;">';
				m += '<b>'+tx('Arcane Temple Boosts')+' ('+tx('Alliance')+')</b><br>';
				if (rslt['arcaneBonus']['s0AllianceBonus']) {
					var ArcBonus = rslt['arcaneBonus']['s0AllianceBonus'];
					for (var z in ArcBonus) {
						if (ArcBonus.hasOwnProperty(z)) {
							var ArcName = uW.itemlist['i'+ArcBonus[z].itemId].name + ' - ' + uW.itemlist['i'+ArcBonus[z].itemId].description;
							m += ArcName + ': ' + ArcBonus[z].effect + '%<br>';
						}
					}
				}
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			if (rslt['arcaneBonus'] && (rslt['arcaneBonus']['s0PersonalBonus'] || rslt['arcaneBonus']['s1PersonalBonus'])) {
				m += '<div style="width:50%;float:left;">';
				m += '<b>'+tx('Arcane Temple Boosts')+' ('+tx('Personal')+')</b><br>';
				if (rslt['arcaneBonus']['s1PersonalBonus']) {
					var ArcBonus = rslt['arcaneBonus']['s1PersonalBonus'];
					for (var z in ArcBonus) {
						if (ArcBonus.hasOwnProperty(z)) {
							var ArcName = uW.itemlist['i'+ArcBonus[z].itemId].name + ' - ' + uW.itemlist['i'+ArcBonus[z].itemId].description;
							m += ArcName + ': ' + ArcBonus[z].effect + '%<br>';
						}
					}
				}
				m += '</div>'; //attacker
				m += '<div style="width:50%;float:left;">';
				m += '<b>'+tx('Arcane Temple Boosts')+' ('+tx('Personal')+')</b><br>';
				if (rslt['arcaneBonus']['s0PersonalBonus']) {
					var ArcBonus = rslt['arcaneBonus']['s0PersonalBonus'];
					for (var z in ArcBonus) {
						if (ArcBonus.hasOwnProperty(z)) {
							var ArcName = uW.itemlist['i'+ArcBonus[z].itemId].name + ' - ' + uW.itemlist['i'+ArcBonus[z].itemId].description;
							m += ArcName + ': ' + ArcBonus[z].effect + '%<br>';
						}
					}
				}
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			if (rslt['s1guardianAtkBoost'] || rslt['s1guardianDefBoost'] || rslt['s1guardianMarchBoost'] || rslt['s1guardianTrainBoost'] || rslt['s0guardianAtkBoost'] || rslt['s0guardianDefBoost'] || rslt['s0guardianMarchBoost'] || rslt['s0guardianTrainBoost']) {
				m += '<div style="width:50%;float:left;">';
				m += '<b>'+tx('Guardian Boosts')+'</b><br>';
				if (rslt['s1guardianAtkBoost'])
					m += tx('Guardian Attack Boost')+': ' + parseFloat(100 * rslt['s1guardianAtkBoost']).toFixed(1) + '%<br>';
				if (rslt['s1guardianDefBoost'])
					m += tx('Guardian Life Boost')+': ' + parseFloat(100 * rslt['s1guardianDefBoost']).toFixed(1) + '%<br>';
				if (rslt['s1guardianMarchBoost'])
					m += tx('Guardian March Speed Boost')+': ' + parseFloat(100 * rslt['s1guardianMarchBoost']).toFixed(1) + '%<br>';
				if (rslt['s1guardianTrainBoost'])
					m += tx('Guardian Training Boost')+': ' + parseFloat(100 * rslt['s1guardianTrainBoost']).toFixed(1) + '%<br>';
				m += '</div>'; //attacker
				m += '<div style="width:50%;float:left;">';
				m += '<b>'+tx('Guardian Boosts')+'</b><br>';
				if (rslt['s0guardianAtkBoost'])
					m += tx('Guardian Attack Boost')+': ' + parseFloat(100 * rslt['s0guardianAtkBoost']).toFixed(1) + '%<br>';
				if (rslt['s0guardianDefBoost'])
					m += tx('Guardian Life Boost')+': ' + parseFloat(100 * rslt['s0guardianDefBoost']).toFixed(1) + '%<br>';
				if (rslt['s0guardianMarchBoost'])
					m += tx('Guardian March Speed Boost')+': ' + parseFloat(100 * rslt['s0guardianMarchBoost']).toFixed(1) + '%<br>';
				if (rslt['s0guardianTrainBoost'])
					m += tx('Guardian Training Boost')+': ' + parseFloat(100 * rslt['s0guardianTrainBoost']).toFixed(1) + '%<br>';
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			if (rslt.bonus) {
				if (rslt.bonus['tch'] || rslt.bonus['tch2']) {
					m += '<div style="width:50%;float:left;">';
					m += '<b>'+tx('Research')+'</b><br>';
					if (rslt.bonus['tch']) {
						for (var t1l in rslt.bonus.tch.s1) {
							var normaltech = '';
							if (t1l == 'hp') normaltech = tx('Health');
							if (t1l == 'atk') normaltech = uW.g_js_strings.commonstr.attack;
							if (t1l == 'def') normaltech = uW.g_js_strings.commonstr.defense;
							if (t1l == 'spd') normaltech = tx('Speed');
							if (t1l == 'rng') normaltech = tx('Range');
							if (t1l == 'ld') normaltech = tx('Load');
							if (normaltech != '')
								m += normaltech + ': ' + parseFloat(rslt.bonus.tch.s1[t1l] * 100).toFixed(0) + '%<br>';
						}
					}
					if (rslt.bonus['tch2']) {
						for (var t2l in rslt.bonus.tch2.s1) {
							var britontech = '';
							if (t2l == 'ic') britontech = uW.g_js_strings.commonstr.improved;
							if (t2l == 'id') britontech = uW.g_js_strings.commonstr.improved_def;
							if (t2l == 'sr') britontech = uW.g_js_strings.commonstr.strengthen_ranks;
							if (t2l == 'if') britontech = uW.g_js_strings.commonstr.improved_fletching;
							if (britontech != '')
								m += britontech + ': ' + parseFloat(rslt.bonus.tch2.s1[t2l] * 100).toFixed(0) + '%<br>';
						}
					}
					m += '</div>'; //attacker
					m += '<div style="width:50%;float:left;">';
					m += '<b>'+tx('Research')+'</b><br>';
					if (rslt.bonus['tch']) {
						for (var t1l in rslt.bonus.tch.s0) {
							var normaltech = '';
							if (t1l == 'hp') normaltech = tx('Health');
							if (t1l == 'atk') normaltech = uW.g_js_strings.commonstr.attack;
							if (t1l == 'def') normaltech = uW.g_js_strings.commonstr.defense;
							if (t1l == 'spd') normaltech = tx('Speed');
							if (t1l == 'rng') normaltech = tx('Range');
							if (normaltech != '')
								m += normaltech + ': ' + parseFloat(rslt.bonus.tch.s0[t1l] * 100).toFixed(0) + '%<br>';
						}
					}
					if (rslt.bonus['tch2']) {
						for (var t2l in rslt.bonus.tch2.s0) {
							var britontech = '';
							if (t2l == 'ic') britontech = uW.g_js_strings.commonstr.improved;
							if (t2l == 'id') britontech = uW.g_js_strings.commonstr.improved_def;
							if (t2l == 'sr') britontech = uW.g_js_strings.commonstr.strengthen_ranks;
							if (t2l == 'if') britontech = uW.g_js_strings.commonstr.improved_fletching;
							if (britontech != '')
								m += britontech + ': ' + parseFloat(rslt.bonus.tch2.s0[t2l] * 100).toFixed(0) + '%<br>';
						}
					}
				}
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			m += '</div>'; //boosts
			m += '<div style="clear:both"></div>';
			return m;
		}

		function handleLoot() {
			var m = '';
			if (rslt['loot'] || rslt['throneRoomDrop'] || rslt['equipmentDrop'] || rslt['lootJewel']) {
				m += '<div class="divHeader" align=left>'+uW.g_js_strings.commonstr.loot.toUpperCase()+'</div>';
				if (rslt['loot']) {
					m += '<TABLE style="width:100%;" class=ptTab>';
					m += '<TR><TD style="width:18%">'+GameIcons.goldImgTiny+'&nbsp;';
					if (rslt['loot'][0] > 0)
						m += addCommas(parseFloat(rslt['loot'][0]).toFixed(0)) + '</TD>';
					else
						m += '0</td>'
					m += '<TD style="width:18%">' + GameIcons.foodImgTiny+'&nbsp;';
					if (rslt['loot'][1] > 0)
						m += addCommas(parseFloat(rslt['loot'][1]).toFixed(0)) + '</TD>';
					else
						m += '0</TD>';
					m += '<TD style="width:18%">' + GameIcons.woodImgTiny+'&nbsp;';
					if (rslt['loot'][2] > 0)
						m += addCommas(parseFloat(rslt['loot'][2]).toFixed(0)) + '</TD>';
					else
						m += '0</td>'
					m += '<TD style="width:18%">' + GameIcons.stoneImgTiny+'&nbsp;';
					if (rslt['loot'][3] > 0)
						m += addCommas(parseFloat(rslt['loot'][3]).toFixed(0)) + '</TD>';
					else
						m += '0</TD>';
					m += '<TD style="width:18%">' + GameIcons.oreImgTiny+'&nbsp;';
					if (rslt['loot'][4] > 0)
						m += addCommas(parseFloat(rslt['loot'][4]).toFixed(0)) + '</TD>';
					else
						m += '0</td>'
					m += '<TD style="width:15%">' + GameIcons.astoneImgTiny+'&nbsp;';
					if (rslt['loot'][6] > 0)
						m += addCommas(parseFloat(rslt['loot'][6]).toFixed(0)) + '</TD>';
					else {
						m += '0</TD>';
					}
					m += '</tr>'
				}
				if ((rslt['loot'] && rslt['loot'][5]) || rslt['throneRoomDrop'] || rslt['equipmentDrop'] || rslt['lootJewel']) {
					var itemdetails = '';
					var thronedetails = '';
					var equipdetails = '';
					var jeweldetails = '';
					if (rslt['loot'] && rslt['loot'][5] && JSON2.stringify(rslt['loot'][5]) != '[]') { // crapola
						var D = true;
						if (parseInt(rpt.side0TileType) == 57) {
							D = ((rslt['winner'] == 1 && rpt.sideId == 1) || (rslt['winner'] == 0 && rpt.sideId == 0));
						}
						if (D) {
							for (var item in rslt['loot'][5]) {
								var amt="";
								if (rslt['loot'][5][item] != 1) { amt = ' ('+rslt['loot'][5][item]+')';}
								var itemurl = parseInt(item);
								if (itemurl > 30669 && itemurl < 32111) itemurl = 30303;
								itemdetails += '<img class=btIcon style="width:20px;" src="'+getItemImageURL(itemurl)+'">&nbsp;' + uW.itemlist['i' + item].name + amt +'&nbsp;&nbsp;&nbsp;';
							}
						}
					}
					if (rslt['throneRoomDrop']) {
						var TR = rslt['throneRoomDrop'];
						var thronename = CardQuality(TR.quality)+" "+uW.g_js_strings.throneRoom[TR.type]+" "+uW.g_js_strings.commonstr.of+" "+uW.g_js_strings.effects["suffix_"+TR.effects.slot5.id]+" ("+uW.g_js_strings.commonstr[TR.faction]+")";

						var TRCard = {};
						TRCard.id = TR.id;
						TRCard.name = CardQuality(TR.quality)+" "+uW.g_js_strings.throneRoom[TR.type]+" "+uW.g_js_strings.commonstr.of+" "+uW.g_js_strings.effects["suffix_"+TR.effects.slot5.id];
						TRCard.faction = TR.faction;
						TRCard.type = TR.type;
						TRCard.unique = parseIntNan(TR.unique);
						TRCard.level = TR.level;
						TRCard.quality = TR.quality;
						TRCard.createPrefix = function () { return ""; };
						TRCard.createSuffix = function () { return ""; };
						TRCard.effects = {};
						var slot = 0;
						for (var k in TR.effects) {
							slot++
							TRCard.effects["slot"+slot] = {};
							TRCard.effects["slot"+slot].id = TR.effects[k].id;
							TRCard.effects["slot"+slot].tier = TR.effects[k].tier;
						}
						thronedetails += '<span class=tooldesc><img class=btIcon style="width:20px;" src="'+IMGURL+'throne/icons/30/' + TR.faction + '/' + TR.faction + '_'+ TR.type +'_normal_1_'+ TR.quality+'.png" >&nbsp;' + thronename + '<span class="tooltip" style="white-space: pre-line; word-wrap: break-word;">'+Tabs.Reference.DisplayTRCard(TRCard,false)+'</span></span>&nbsp;&nbsp;&nbsp;';
					}
					if (rslt['equipmentDrop']) {
						var EQ = rslt['equipmentDrop'];
						var equipname = CardQuality(EQ.rarity)+" "+uW.g_js_strings.champ[chTypeStrings[parseInt(EQ.type)-1]]+" "+uW.g_js_strings.commonstr.of+" "+uW.g_js_strings.effects["suffix_"+EQ["effects"][5]["id"]]+" ("+uW.g_js_strings.commonstr[cardFaction[EQ.faction-1]]+")";

						var CHCard = {};
						CHCard.id = EQ.equipmentId;
						CHCard.name = CardQuality(EQ.rarity)+" "+uW.g_js_strings.champ[chTypeStrings[parseInt(EQ.type)-1]]+" "+uW.g_js_strings.commonstr.of+" "+uW.g_js_strings.effects["suffix_"+EQ["effects"][5]["id"]];
						CHCard.faction = EQ.faction;
						CHCard.type = EQ.type;
						CHCard.unique = parseIntNan(EQ.itemId);
						CHCard.level = EQ.level;
						CHCard.rarity = EQ.rarity;
						CHCard.createPrefix = function () { return ""; };
						CHCard.createSuffix = function () { return ""; };
						CHCard.effects = {};
						var slot = 0;
						for (var k in EQ.effects) {
							slot++
							CHCard.effects["slot"+slot] = {};
							CHCard.effects["slot"+slot].id = EQ.effects[k].id;
							CHCard.effects["slot"+slot].tier = EQ.effects[k].tier;
						}
						equipdetails += '<span class=tooldesc><img class=btIcon style="width:20px;" src="'+IMGURL+'champion_hall/' + cardQuality[EQ.rarity].toLowerCase() + '_' + champImageTypes[EQ.type-1] + '_' + cardFaction[EQ.faction-1] + '_30x30.png">&nbsp;' + equipname + '<span class="tooltip" style="white-space: pre-line; word-wrap: break-word;">'+Tabs.Reference.DisplayCHCard(CHCard,false)+'</span></span>&nbsp;&nbsp;&nbsp;';
					}
					if (rslt['lootJewel'] && JSON2.stringify(rslt['lootJewel']) != '[]') {
						item = rslt['lootJewel'];
						var amt="";
						if (item.quantity != 1) { amt = ' ('+item.quantity+')';}
						jeweldetails += '<img class=btIcon style="width:20px;" src="'+IMGURL+'throne/icons/70/jewel_' + jewelTypes[CM.ThroneController.jewelType(item)] + '_' + jewelQuality[item.quality-1] + '.jpg">&nbsp;' + CM.ThroneController.jewelQualityName(item.quality)+" "+CM.ThroneController.getEffectName(item.id)+" "+uW.g_js_strings.commonstr.jewel + amt +'&nbsp;&nbsp;&nbsp;';
					}
					m += '<tr><td colspan=6>'+itemdetails+thronedetails+equipdetails+jeweldetails+'</TD></TR>';
				}
				m += '</TABLE><br>';
			}
			return m;
		}

		function handleTransportLoot() {
			var m = '';
			m += '<div class="divHeader" align=left>'+uW.g_js_strings.commonstr.loot.toUpperCase()+'</div><TABLE style="width:100%;" class=ptTab>';
			m += '<TR><TD style="width:18%">' + GameIcons.goldImgTiny;
			if (rslt['gold'] > 0)
				m += addCommas(rslt['gold']) + '</TD>';
			else
				m += '0</td>'
			m += '<TD style="width:18%">' + GameIcons.foodImgTiny;
			if (rslt['resource1'] > 0)
				m += addCommas(rslt['resource1']) + '</TD>';
			else
				m += '0</TD>';
			m += '<TD style="width:18%">' + GameIcons.woodImgTiny;
			if (rslt['resource2'] > 0)
				m += addCommas(rslt['resource2']) + '</TD>';
			else
				m += '0</td>'
			m += '<TD style="width:18%">' + GameIcons.stoneImgTiny;
			if (rslt['resource3'] > 0)
				m += addCommas(rslt['resource3']) + '</TD>';
			else
				m += '0</TD>';
			m += '<TD style="width:18%">' + GameIcons.oreImgTiny;
			if (rslt['resource4'] > 0)
				m += addCommas(rslt['resource4']) + '</TD>';
			else
				m += '0</td>'
			m += '<TD style="width:15%">' + GameIcons.astoneImgTiny;
			if (rslt['resource5'] > 0)
				m += addCommas(rslt['resource5']) + '</TD>';
			else
				m += '0</TD>';
			m += '</tr>'
			m += '</TABLE><br>';
			return m;
		}

		function deleteThisRpt(testing) {
			var side0 = '';
			var side1 = '';
			if (rpt.sideId == 1) side1 = rpt.marchReportId;
			if (rpt.sideId == 0) side0 = rpt.marchReportId;
			var params = uW.Object.clone(uW.g_ajaxparams);
			params.s0rids = side0;
			params.s1rids = side1;
			params.cityrids = '';
			new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					if (rslt.ok) {
						delete ReportCache[rpt.marchReportId];
						delete ReportDetailCache[rpt.marchReportId];
						t.CloseReport();
						if (ById('modal_msg_tabs_report') && jQuery('#modal_msg_tabs_report').hasClass('selected')) {
							uW.Messages.listReports();
						}
						if (Tabs.Messages && (Options.MessagesOptions.rptType == 'alliance' || Options.MessagesOptions.rptType == 'player')) {
							var ind = Tabs.Messages.DisplayIdArray.indexOf(parseInt(rpt.marchReportId));
							if (ind>=0) {
								Tabs.Messages.data.splice(Tabs.Messages.DisplayArray[ind],1);
								delete Tabs.Messages.report[rpt.marchReportId];
								Tabs.Messages.DisplayRpt();
							}
						}
					}
				},
				onFailure: function () {
					if (notify) {
						notify('AJAX ERROR');
					}
				},
			});
		}

		function handleunts() { // Troops sent to Reinforce or troops found on a Scout (also show destination for transports)
			var m = '';
			//header
			if (rpt.marchName == uW.g_js_strings.commonstr.reinforce)
				m += '<div class="divHeader" align=left>'+tx('Reinforcement').toUpperCase()+'</div>';
			else
				if (rpt.marchName == uW.g_js_strings.commonstr.transport)
					m += '<div class="divHeader" align=left>'+tx('Destination').toUpperCase()+'</div>';
				else
					m += '<div class="divHeader" align=left>'+tx('Scout Report').toUpperCase()+'</div>';
			//summary
			m += '<div id=scoutSummaryContainer>';
			//summary - troops
			m += '<div style="width:50%;float:left;">';
			if (rpt.marchName == uW.g_js_strings.commonstr.reinforce)
				m += '<B>'+tx('Ally')+':</B> ' + rpt.side1Name + ' (<A onclick="btGotoMapRpt(' + rpt.side1XCoord + ',' + rpt.side1YCoord + ')">' + rpt.side1XCoord + ',' + rpt.side1YCoord + '</a>)<br>';
			if (rslt['unts'] != undefined) {
				m += '<TABLE class=ptTab>';
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					if (rslt['unts']['u'+i] && parseIntNan(rslt['unts']['u'+i]) != 0)
						m += '<TR><TD>'+unitImg[i]+'</TD><TD>'+unitName[i]+'</TD><TD align=right>' + addCommas(rslt['unts']['u' + i]) + '</TD></TR>';
				}
				m += '</TABLE>';
			}
			m += '&nbsp;</div>';
			//summary - city and defences
			m += '<div style="width:50%;float:left;">';
			if ((rpt.marchName == uW.g_js_strings.commonstr.reinforce) || (rpt.marchName == uW.g_js_strings.commonstr.transport))
				m += '<B>'+tx('Destination')+'</B> ' + rpt.side0Name + ' (<A onclick="btGotoMapRpt(' + rpt.side0XCoord + ',' + rpt.side0YCoord + ')">' + rpt.side0XCoord + ',' + rpt.side0YCoord + '</a>)<br>';
			else {
				m += '<TABLE class=ptTab width=100%>';
				m += '<TR><TD>' + rpt.side0Name + ' (<A onclick="btGotoMapRpt(' + rpt.side0XCoord + ',' + rpt.side0YCoord + ')">' + rpt.side0XCoord + ',' + rpt.side0YCoord + '</a>)</td></tr>';
				if (rpt.side0AllianceId && (rpt.side0AllianceId != 0)) m += '<TR><TD>'+uW.g_js_strings.commonstr.alliance+':&nbsp;<span style='+DiplomacyColours(rpt.side0AllianceId)+'>' + rpt.side0AllianceName + '</span></td></tr>';
				if (rpt.side0PlayerId && (rpt.side0PlayerId != 0)) m += '<TR><TD>UID: ' + MonitorLinkUID(rpt.side0PlayerId)+'</td></tr>';
				if (rslt['lstlgn']) {
					if (!rslt['lstlgn'])
						m += '<TR><TD>'+uW.g_js_strings.modal_messages_viewreports_view.lastlogin+': '+tx('Not recorded')+'</TD></TR>';
					else
						m += '<TR><TD>'+uW.g_js_strings.modal_messages_viewreports_view.lastlogin+': ' + formatUnixTime(rslt['lstlgn']) + '</TD></TR>';
				}
				m += '<TR><TD>'+tx('Marshall Combat')+': ';
				if (rslt['knt'] && rslt['knt']['cbt'])
					m += rslt['knt']['cbt'];
				else
					m += uW.g_js_strings.commonstr.none;
				m += '</TD></TR>';
				if (rslt['pop'])
					m += '<TR><TD>'+uW.g_js_strings.commonstr.population+': ' + addCommas(rslt['pop']) + '</TD></TR>';
				if (rslt['hap'])
					m += '<TR><TD>'+uW.g_js_strings.commonstr.happiness+': ' + addCommas(rslt['hap']) + '</TD></TR></TABLE>';
				m += '</TD></TR></TABLE><br>';
				m += handlefrt();
			}
			m += '</div>';
			m += '</div>'; //end scoutsummary div
			m += '<div style="clear:both"></div>';
			return m;
		}

		function buildResearch() {
			var m = '';
			//header
			m += '<a id=reportResearchHdr class=divLink ><div class="divHeader" align=left><img id=reportResearchArrow height="10" src="'+RightArrow+'">&nbsp;'+tx('Buildings and Research').toUpperCase()+'</div></a>';
			//summary
			m += '<div id=reportResearch class=divHide>';
			if (rslt['blds']) {
				m += '<div style="width:50%;float:left;">';
				if (rslt['blds']) {
					m += '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=2 align=left>'+tx('Buildings')+'</TH></TR>';
					for (var bi in rslt['blds'])
						if ((bi != 'b1') && (bi != 'b2') && (bi != 'b3') && (bi != 'b4')) {
							m += handleblds(bi.split("b")[1]);
						}
					m += '</TABLE>';
				}
				if (rslt['blds']['b1'] || rslt['blds']['b2'] || rslt['blds']['b3'] || rslt['blds']['b4']) {
					m += '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=2 align=left>'+tx('Fields')+'</TH></TR>';
					for (var i = 1; i < 5; i++)
						if (rslt['blds']['b' + i])
							m += handleblds(i);
					m += '</TABLE>';
				}
				m += '</div>';
			}
			if (rslt['tch'] || rslt['tch2']) {
				m += '<div style="width:50%;float:left;">';
				if (rslt['tch']) {
					m += '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=2 align=left>'+tx('Research')+'</TH></TR>';
					for (var tl in rslt.tch) {
						tid = /[0-9]+/.exec(tl);
						m += '<TR><TD>' + uW.techcost['tch' + tid[0]][0] + '</TD><TD align=right>' + rslt.tch[tl] + '</TD></TR>';
					}
					m += '</TABLE>';
				}
				if (rslt['tch2']) {
					m += '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=2 align=left>'+tx('Briton Research')+'</TH></TR>';
					for (var tl in rslt.tch2) {
						tid = /[0-9]+/.exec(tl);
						m += '<TR><TD>' + uW.techcost2['tch' + tid[0]][0] + '</TD><TD align=right>' + rslt.tch2[tl] + '</TD></TR>';
					}
					m += '</TABLE>';
				}
				m += '</div>';
				m += '<div style="clear:both">&nbsp;</div>';
			}
			m += '</div>';
			return m;
		}

		function handlersc(scout) { // Resources brought with reinforcements or found on a Scout
			var m = '';
			if (rslt['rsc'] != undefined) {
				if (rslt['rsc']['r1'] > 0 || rslt['rsc']['r2'] > 0 || rslt['rsc']['r3'] > 0 || rslt['rsc']['r4'] > 0) {
					if (rpt.marchName == uW.g_js_strings.commonstr.reinforce)
						m += '<div class="divHeader" align=left>'+tx('Goodies Brought').toUpperCase()+'</div><TABLE style="width:100%;" class=ptTab>';
					else
						m += '<div class="divHeader" align=left>'+tx('Goodies Found').toUpperCase()+'</div><TABLE style="width:100%;" class=ptTab>';
					m += '<TR><TD style="width:18%">' + GameIcons.goldImgTiny;
					if (rslt['gld'] > 0)
						m += addCommas(parseFloat(rslt['gld']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					m += '<TD style="width:18%">' + GameIcons.foodImgTiny;
					if (rslt['rsc']['r1'] > 0)
						m += addCommas(parseFloat(rslt['rsc']['r1']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					m += '<TD style="width:18%">' + GameIcons.woodImgTiny;
					if (rslt['rsc']['r2'] > 0)
						m += addCommas(parseFloat(rslt['rsc']['r2']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					m += '<TD style="width:18%">' + GameIcons.stoneImgTiny;
					if (rslt['rsc']['r3'] > 0)
						m += addCommas(parseFloat(rslt['rsc']['r3']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					m += '<TD style="width:18%">' + GameIcons.oreImgTiny;
					if (rslt['rsc']['r4'] > 0)
						m += addCommas(parseFloat(rslt['rsc']['r4']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					if (rslt['rsc']['r5'] > 0) {
						m += '<TD style="width:15%">' + GameIcons.astoneImgTiny;
						m += addCommas(parseFloat(rslt['rsc']['r5']).toFixed(0)) + '</TD>';
					}
					else {
						if (scout != true) {
							m += '<TD style="width:15%">' + GameIcons.astoneImgTiny + '0</td>';
						}
					}
					m += '</TABLE>';
				}
			}
			return m;
		}

		function handlefrt() { // Fortifications found on a Scout
			var m = '';
			if (rslt['frt'] || (rslt['blds'] && rslt['blds']['b30'])|| (rslt['blds'] && rslt['blds']['b31'])) {
				if (rslt['frt']['f53'] != undefined || rslt['frt']['f55'] != undefined || rslt['frt']['f60'] != undefined || rslt['frt']['f61'] != undefined || rslt['frt']['f62'] != undefined || rslt['frt']['f63'] != undefined || (rslt['blds'] && rslt['blds']['b30']) || (rslt['blds'] && rslt['blds']['b31'])) {
					m = '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=3 align=left>'+tx('Defences Found')+'</TH></TR>';
					if (rslt['frt']['f53'] != undefined)
						m += '<TR><TD>' + unitImg[53] + '</TD><TD>'+unitName[53]+'</TD><TD align=right>' + addCommas(rslt['frt']['f53']) + '</TD></TR>';
					if (rslt['frt']['f55'] != undefined)
						m += '<TR><TD>' + unitImg[55] + '</TD><TD>'+unitName[55]+'</TD><TD align=right>' + addCommas(rslt['frt']['f55']) + '</TD></TR>';
					if (rslt['frt']['f60'] != undefined)
						m += '<TR><TD>' + unitImg[60] + '</TD><TD>'+unitName[60]+'</TD><TD align=right>' + addCommas(rslt['frt']['f60']) + '</TD></TR>';
					if (rslt['frt']['f61'] != undefined)
						m += '<TR><TD>' + unitImg[61] + '</TD><TD>'+unitName[61]+'</TD><TD align=right>' + addCommas(rslt['frt']['f61']) + '</TD></TR>';
					if (rslt['frt']['f62'] != undefined)
						m += '<TR><TD>' + unitImg[62] + '</TD><TD>'+unitName[62]+'</TD><TD align=right>' + addCommas(rslt['frt']['f62']) + '</TD></TR>';
					if (rslt['frt']['f63'] != undefined)
						m += '<TR><TD>' + unitImg[63] + '</TD><TD>'+unitName[63]+'</TD><TD align=right>' + addCommas(rslt['frt']['f63']) + '</TD></TR>';
					if (rslt['blds'] && rslt['blds']['b31'])
						m += '<TR><TD>' + unitImg[99] + '</TD><TD>'+unitName[99]+'</TD><TD align=right>('+uW.g_js_strings.commonstr.level+' ' + rslt['blds']['b31'] + ')</TD></TR>';
					if (rslt['blds'] && rslt['blds']['b30'])
						m += '<TR><TD>' + unitImg[100] + '</TD><TD>'+unitName[100]+'</TD><TD align=right>('+uW.g_js_strings.commonstr.level+' ' + rslt['blds']['b30'] + ')</TD></TR>';
					m += '</TABLE>';
				}
			}
			return m;
		}

		function handleblds(bType) {
			if (rslt['blds']) {
				var blds = rslt['blds']['b' + bType];
				var maxlvl = uW.buildingmaxlvl[bType]||12;
				var b = '<TR><TD>';
				arField = [], firstbld = true;
				b += uW.buildingcost['bdg'+bType][0];
				b += '</TD><TD>';
				for (var i = 1; i <= maxlvl; i++)
					arField[i] = 0;
				for (var i = 0; i < blds.length; i++)
					arField[blds[i]]++
				for (var i = maxlvl; i > 0; i--) {
						if (arField[i] > 0) {
							if (firstbld)
								firstbld = false;
							else
								b += ', ';
							if (arField[i] > 1)
								b += arField[i] + ' x ';
							b += ' ' + i;
						}
					}
				b += '</TD></TR>';
				return b;
			}
		}

		t.CloseReport();
		if (rpt.marchName == uW.g_js_strings.commonstr.reinforce) {
			t.popReport = new CPopup('btReportPopup', t.reportpos.x, t.reportpos.y, 750, 240, true, function () {
				t.reportpos = t.popReport.getLocation();
				clearTimeout(1000);
			});
			m += '<DIV style="height:180px">';
		} else if (rpt.marchName == uW.g_js_strings.commonstr.transport) {
			t.popReport = new CPopup('btReportPopup', t.reportpos.x, t.reportpos.y, 750, 240, true, function () {
				t.reportpos = t.popReport.getLocation();
				clearTimeout(1000);
			});
			m += '<DIV style="height:180px">';
		} else if (rpt.marchName == uW.g_js_strings.commonstr.scout && rslt['winner'] == 1 && rpt.sideId == 1) {
			t.popReport = new CPopup('btReportPopup', t.reportpos.x, t.reportpos.y, 750, 800, true, function () {
				t.reportpos = t.popReport.getLocation();
				clearTimeout(1000);
			});
			m += '<DIV style="max-height:760px; height:760px; overflow-y:scroll">';
		} else {
			t.popReport = new CPopup('btReportPopup', t.reportpos.x, t.reportpos.y, 750, 800, true, function () {
				t.reportpos = t.popReport.getLocation();
				clearTimeout(1000);
			});
			m += '<DIV style="max-height:760px; height:760px; overflow-y:scroll">';
		}
		if ((t.reportpos.x == -999) && (t.reportpos.y == -999)) {
			t.popReport.centerMe(mainPop.getMainDiv());
		}
		m += buildHeader();
		if (rpt.marchName == uW.g_js_strings.commonstr.transport) { // Transport
			m += handleTransportLoot();
			m += handleunts();
		}
		m += handleLoot();
		if (rpt.marchName == uW.g_js_strings.commonstr.reinforce) {
			m += handlersc(false);
			m += handleunts();
		}
		if (rpt.marchName == uW.g_js_strings.commonstr.scout && rslt['winner'] == 1) {
			m += handlersc(true);
			m += handleunts();
			m += buildResearch();
		}
		if (rslt['fght']) {
			m += buildBattle();
			m += buildTroopStats();
			if (!koth) {
				m += buildChampDuel();
				m += buildThroneStats();
			}
			m += buildBoosts();
		}
		m += '</DIV>';
		t.popReport.getMainDiv().innerHTML = m;
		if (ById('atkmightlost')) { ById('atkmightlost').innerHTML = tx('Might Lost')+': ' + addCommas(t.atkmight); }
		if (ById('defmightlost')) { ById('defmightlost').innerHTML = tx('Might Lost')+': ' + addCommas(t.defmight); }
		if (ById('ptDeleteReport')) {
			ById('ptDeleteReport').addEventListener('click', function () {
				deleteThisRpt(rslt, rpt);
			}, false);
		}
		t.popReport.getTopDiv().innerHTML = '<DIV align=center><B>'+rpt.marchName+' '+uW.g_js_strings.commonstr.report+'</B></DIV>';

		if (ById('reportTroopStatsHdr')) { ById('reportTroopStatsHdr').addEventListener('click', function () {	ToggleDivDisplay(false, 500, 500, "reportTroopStats"); }, false); }
		if (ById('reportChampDuelHdr')) { ById('reportChampDuelHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportChampDuel"); }, false); }
		if (ById('reportThroneHdr')) { ById('reportThroneHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportThrone"); }, false); }
		if (ById('reportBoostsHdr')) { ById('reportBoostsHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportBoosts"); }, false); }
		if (ById('reportResearchHdr')) { ById('reportResearchHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportResearch");	}, false); }

		t.popReport.show(true);
	},

	CloseReport : function () {
		var t = Rpt;
		if (t.popReport) {
			t.popReport.show(false);
			if (t.popReport.onClose) t.popReport.onClose();
			t.popReport.destroy();
			t.popReport = null;
		}
	},
};

var ChatTimeFix = {
	ChatTime: null,
	init: function () {
		t = ChatTimeFix;

		try {
			uWExportFunction('ptConvertTime', t.TimeFix);
			t.ChatTime = new CalterUwFunc("Chat.getChat", [
				['rslt.data.newChats[i][j][1],', 'ptConvertTime(rslt.data.newChats[i][j][1]),'],
				['rslt.data.newChats[i][j][1],', 'ptConvertTime(rslt.data.newChats[i][j][1]),']
			]);
			t.ChatTime.setEnable(Options.fixChatTime);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	TimeFix : function (timestr) {
		time = timestr.split(/:/);
		var AddMins = 480 - parseInt(getDST(new Date()) / 60) - (new Date().getTimezoneOffset()); // convert from local pacific time
		var min = (parseInt(time[0]) * 60) + parseInt(time[1]) + AddMins;
		if (min >= 1440) {
			min = min - 1440;
		}
		return parseInt(min / 60) + ':' + ('00' + parseInt(min % 60).toString()).slice(-2);
	},
	setEnable: function (tf) {
		var t = ChatTimeFix;
		t.ChatTime.setEnable(tf);
	},
	isAvailable: function () {
		var t = ChatTimeFix;
		return t.ChatTime.isAvailable();
	},
};

var AttackDialog = {
	hideAttackEffortsState : true,

	init: function () {
		var t = AttackDialog;
		t.hideAttackEffortsState = Options.hideAttackEfforts;
		try {
			t.modal_attackFunc = new CalterUwFunc('modal_attack', [
				[/}\s*$/, '; attackDialog_hook(); }']
			]);
			uWExportFunction('attackDialog_hook', t.modalAttackHook);
			t.modal_attackFunc.setEnable(true);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function () {},
	isAvailable: function () {
		var t = AttackDialog;
		return t.modal_attackFunc.isAvailable();
	},
	modalAttackHook: function () {
		var t = AttackDialog;
		if (Options.fixKnightSelect || Options.attackCityPicker) {
			for (var i = 1; i < 6; i++)
				ById('modal_attack_tab_' + i).addEventListener('click', t.e_changeMarchType, false);
		}
		if (Options.attackCityPicker) {
			setTimeout(t.initCityPicker, 0);
		}
		if (Options.DontFilterTransportTroops) {
			var sf = ById('modal_attack_supplyfilter_checkbox');
			if (sf) { if (sf.checked) { sf.click(); }}
		}

		var divContainer = ById('modal_attack_speed_boost');
		divContainer.appendChild(t.HideAttackEfforts());

	},
	HideAttackEfforts: function () {
		var t = AttackDialog;
		if (!ById('modal_attack_march_boost')) { return; }
		var span = document.createElement('span');
		var a = document.createElement('a');
		a.innerHTML = tx('Show Attack/Speed Boosts');
		a.id = 'ptShowBoosts';
		span.appendChild(a);
		if (t.hideAttackEffortsState) {
			hideshow();
		}
		a.addEventListener('click', function (evt) {
			t.hideAttackEffortsState = !t.hideAttackEffortsState;
			hideshow();
		}, false);
		for (var i = 1; i < 5; i++) {
			ById('modal_attack_tab_' + i).addEventListener('click', hideshow, false);
		}
		return span;

		function hideshow() {
			var a = ById('ptShowBoosts');
			if (t.hideAttackEffortsState) {
				disp = 'none';
				if (a) a.innerHTML = tx('Show Attack/Speed Boosts');
			}else{
				disp = 'block';
				if (a) a.innerHTML = tx('Hide Attack/Speed Boosts');
			}
			ById('modal_attack_march_boost').style.display = disp;
			ById('modal_attack_attack_boost').style.display = disp;
			ById('modal_attack_defense_boost').style.display = disp;
			var div = ById('modal_attack_speed_boost');
			for (var i = 0; i < i < div.childNodes.length; i++) {
				if (div.childNodes[i].className == 'section_title'){
					div.childNodes[i].style.display = disp;
				}
				if (div.childNodes[i].className == 'section_content') {
					div = div.childNodes[i];
					for (var i = 0; i < div.childNodes.length; i++) {
						if (div.childNodes[i].style != undefined && div.childNodes[i].className != 'estimated') {
							div.childNodes[i].style.display = disp;
						}
					}
					break;
				}
			}
		}
	},

	initCityPicker: function () {
		var t = AttackDialog;
		var div = ById('modal_attack_target_numflag'); // as of KofC version 96;
		var mySpan;
		if (div) {
			div.parentNode.innerHTML += ' &nbsp; <SPAN id=modal_attack_citybuts></span>';
		} else {
			var span = ById('modal_attack_target_coords'); // KofC version 116+;
			span.parentNode.parentNode.firstChild.innerHTML += ' &nbsp; <SPAN id=modal_attack_citybuts></span>';
		}
		var disabled = [];
		for (var cid in Cities.byID){
			var x = Cities.byID[cid].idx;
			disabled[x] = (Cities.byID[uW.currentcityid].idx==x)?true: false;
		}
		new CdispCityPicker('ptatp', ById('modal_attack_citybuts'), false, t.e_CityButton,null,disabled);

		for (var i=0; i<Cities.numCities; i++) {
			ById('ptatp_'+i).addEventListener('mouseover',function (){CityResourceHint(this,this.id.substring(6));},false);
			ById('ptatp_'+i).addEventListener('mouseout',function (){CityResourceHintOff(this);},false);
		}

		if (ById('modal_attack_tab_4').className == 'selected' || ById('modal_attack_tab_3').className == 'selected') // don't do for attack or scout
			ById('modal_attack_citybuts').style.display = 'none';
	},
	e_CityButton: function (city) {
		ById('modal_attack_target_coords_x').value = city.x;
		ById('modal_attack_target_coords_y').value = city.y;
		uW.modal_attack_update_time();
	},
	e_changeMarchType: function (evt) {
		var t = AttackDialog;
		var marchType = parseInt(evt.target.id.substr(17));
		if (Options.attackCityPicker) {
			if (marchType == 3 || marchType == 4)
				ById('modal_attack_citybuts').style.display = 'none';
			else
				ById('modal_attack_citybuts').style.display = 'inline';
		}
		if (Options.fixKnightSelect) {
			var knightVal = 0;
			var selector = ById('modal_attack_knight');
			if (selector.length > 1 && (marchType == 4 || marchType == 2)) // if 'attack' or 'reinforce'
				knightVal = 1;
			selector.selectedIndex = knightVal;
			selector.disabled = false;
		}
		if (Options.DontFilterTransportTroops) {
			var sf = ById('modal_attack_supplyfilter_checkbox');
			if (sf) { if (sf.checked) { sf.click(); }}
		}
	},
};

var battleReports = {
	init: function () {
		var t = battleReports;
		try {
			t.getReportDisplayFunc = new CalterUwFunc('getReportDisplay', [
				['return K.join("")', 'var themsg=K.join(""); themsg=getReportDisplay_hook(themsg, arguments[1]); return themsg']
			]); //Alliance report battle rounds function
			uWExportFunction('getReportDisplay_hook', t.hook);
			t.getReportDisplayFunc.setEnable(true);

			t.renderBattleReportFunc = new CalterUwFunc('Messages.viewMarchReport', [
				[/\$\("modal_msg_list"\)\.innerHTML\s*=\s*cm\.MarchReportController\.getMarchReport\(c,\s*y\)/, 'var msg = cm.MarchReportController.getMarchReport(c, y); $("modal_msg_list").innerHTML = renderBattleReport_hook(msg,c,y);']
			]); //March reports battle rounds function
			uWExportFunction('renderBattleReport_hook', t.hook2);
			t.renderBattleReportFunc.setEnable(true);

			uWExportFunction('deleteAreport', t.e_deleteReport);
			uWExportFunction('PostReport', t.e_PostReport);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function () {},
	isRoundsAvailable: function () {
		var t = battleReports;
		return t.getReportDisplayFunc.isAvailable() || t.renderBattleReportFunc.isAvailable();
	},
	e_deleteReport: function (rptid) {
		var t = battleReports;
		t.ajaxDeleteMyReport(rptid);
	},
	e_PostReport: function (rptid) {
		var msg = 'Report No: ' + enFilter(rptid);
		sendChat("/a " + msg);
	},
	ajaxDeleteMyReport: function (rptid, isUnread, side, isCityReport, notify) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.s0rids = rptid;
		params.s1rids = '';
		params.cityrids = '';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					delete ReportCache[rptid];
					delete ReportDetailCache[rptid];
					if (isUnread) {
						uW.seed.newReportCount = parseInt(seed.newReportCount) - 1;
						uW.messages_notify_bug()
					}
				}
				if (notify) notify(rslt.errorMsg);
			},
		});
	},
	hook2: function (msg, args, rslt) {
		if (rslt.rnds && Options.dispBattleRounds) {
			msg = msg.replace(/<\/ul>.*\s*<\/div>.*\s*<div class="unitsContainer">/im, '<li><span class=\'label\'>Rounds: </span><span class=\'value\'>' + rslt.rnds + '</span></li></ul></div><div class="unitsContainer">');
		}
		if (Options.reportDeleteButton) {
			msg = msg.replace(/Reports<\/span><\/a>/im, 'Reports</span></a><a class=\'button20\' onclick=\'PostReport(' + args[0] + ',false)\'><span>Post To Chat</span></a>'); //Post to Chat button
			msg = msg.replace(/Reports<\/span><\/a>/im, 'Reports</span></a><a class=\'button20\' onclick=\'MoreReport(' + args[0] + ',' + args[1] + ',false)\'><span>More</span></a>'); //More button
			msg = msg.replace(/Reports<\/span><\/a>/im, 'Reports</span></a><a class=\'button20\' onclick=\'deleteAreport(' + args[0] + ',false)\'><span>' + uW.g_js_strings.commonstr.deletetx + '</span></a>'); //Delete button
		}
		return msg;
	},
	hook: function (msg, rslt) {
		msg = msg.replace(/(\bReport\sNo\:\s([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
		if (rslt.rnds && Options.dispBattleRounds) {
			msg = msg.replace(/(Attackers <span.*?)<\/div>/im, '$1<BR>Rounds: ' + rslt.rnds + '</div>');
		}
		return msg;
	},
};

var MapDistanceFix = {
	popSlotsFunc: null,
	init: function () {
		var t = MapDistanceFix;

		try {
			t.popSlotsFunc = new CalterUwFunc('MapObject.prototype.populateSlots', [
				['this.distance', 'fixMapDistance_hook']
			]);
			if (t.isAvailable()) {
				uWExportFunction('fixMapDistance_hook', MapDistanceFix.fixMapDistance_hook);
				t.enable(true);
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	fixMapDistance_hook: function (cityX, cityY, tileX, tileY) {
		var city = Cities.byID[uW.currentcityid];
		return distance(city.x, city.y, tileX, tileY);
	},
	enable: function (tf) {
		var t = MapDistanceFix;
		t.popSlotsFunc.setEnable(tf);
	},
	isAvailable: function () {
		var t = MapDistanceFix;
		return t.popSlotsFunc.isAvailable();
	},
}

var mapinfoFix = {
	init: function () {
		var t = mapinfoFix;

		try {
			t.calcButtonInfo = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo', [
				[/case\s*"reassign":b\.text\s*=\s*g_js_strings\.commonstr\.reassign;b\.color\s*=\s*"blue";b\.action\s*=\s*function\s*\(\)\s*{modal_attack\(2,\s*e\.tile\.x,\s*e\.tile\.y\);*};d\.push\(b\);break;/,
					'case "reassign":b.text=g_js_strings.commonstr.reassign;b.color="blue";b.action=function(){modal_attack(5,e.tile.x,e.tile.y);};d.push(b);break;'
				]
			]);
			t.bookMarkMod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo', [
				[/case\s*"bookmark":/, 'case "bookmark": try { if (e.city && cm.tileInfo[e.tile.id] && cm.tileInfo[e.tile.id].cityName ) {e.tile.name = e.user.username + "/" + cm.tileInfo[e.tile.id].cityName;}} catch (err1) {} ']
			]);
			t.MapContextMenus = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcCityType', [
				['return c', 'c = calcCityTypeFix(c,d);return c']
			]);
			t.calcButtonInfo.setEnable(Options.mapInfo);
			t.MapContextMenus.setEnable(Options.mapInfo2);
			t.bookMarkMod.setEnable(Options.mapInfo3);
			CM.ContextMenuMapController.prototype.MapContextMenus.City["2"].splice(4, 0, "reassign");
			// add reinforce alliance wilds
			for (var jj in CM.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness) {
				CM.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness[jj] = ["profile", "throne", "reinforce", "reinforcements", "message", "bookmark"];
			}
			// add megaliths to wild types
			CM.ContextMenuMapController.prototype.MapContextMenus.OwnedWilderness.megalith = ["bookmark"];
			CM.ContextMenuMapController.prototype.MapContextMenus.OwnedWildernessNoDefend.megalith = ["bookmark"];
			CM.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness.megalith = ["profile","bookmark"];
			CM.ContextMenuMapController.prototype.MapContextMenus.FriendlyWilderness.megalith = ["profile", "attack_koth", "scout_koth", "bookmark"];
			CM.ContextMenuMapController.prototype.MapContextMenus.EnemyWilderness.megalith = ["profile", "attack_koth", "scout_koth", "bookmark"];

			uWExportFunction('calcCityTypeFix', t.calcCityType_hook);
			// add the province and the city status (Normal/Truce) to the tooltips
			if (!NoRegEx) {
				t.dispStatusMod = new CalterUwFunc('MapObject.prototype.populateSlots', [
					[/var\s*h\s*=""/, 'var h = ""; h+="<div class=divHide>"+U.tileUserId+"</div><div class=thead align=center><b>"+provincenames["p" + U.tileProvinceId]+"</b></div>";if (M) h += "<div>"+g_js_strings.commonstr.status+": "+M+"</div>";']
				]);
			}
			else {
				t.dispStatusMod = new CalterUwFunc('MapObject.prototype.populateSlots', [
					['var h = "";', 'var h = ""; h+="<div class=divHide>"+U.tileUserId+"</div><div class=thead align=center><b>"+provincenames["p" + U.tileProvinceId]+"</b></div>";if (M) h += "<div>"+g_js_strings.commonstr.status+": "+M+"</div>";']
				]);
			}
			t.dispStatusMod.setEnable(Options.dispStatus);

			t.MapContextMenuAdd = new CalterUwFunc ('modal_maptile', [[/}\s*$/, ';setTimeout(function() { MapContextMenuAdd_hook(j,k,m,a,h,f,o,e); },0); }']]);
			uWExportFunction('MapContextMenuAdd_hook', mapinfoFix.MapContextMenu);
			t.MapContextMenuAdd.setEnable (Options.mapMenuInfo);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = mapinfoFix;
		t.calcButtonInfo.setEnable(tf);
	},
	setEnable2: function (tf) {
		var t = mapinfoFix;
		t.MapContextMenus.setEnable(tf);
	},
	setEnable3: function (tf) {
		var t = mapinfoFix;
		t.bookMarkMod.setEnable(tf);
	},
	setMenuEnable: function (tf) {
		var t = mapinfoFix;
		t.MapContextMenuAdd.setEnable(tf);
	},
	setEnableDispStatus: function (tf) {
		var t = mapinfoFix;
		t.dispStatusMod.setEnable(tf);
	},
	calcCityType_hook: function (c, d) {
		if (Cities.byID[d.city.id] && c != 1)
			c = CM.CITY_STATUS.MY_CITY_AND_NOT_CURRENT_CITY;
		return c;
	},
	isAvailable: function () {
		var t = mapinfoFix;
		return t.calcButtonInfo.isAvailable();
	},
	isAvailable2: function () {
		var t = mapinfoFix;
		return t.MapContextMenus.isAvailable();
	},
	isAvailable3: function () {
		var t = mapinfoFix;
		return t.bookMarkMod.isAvailable();
	},
	isMenuAvailable: function () {
		var t = mapinfoFix;
		return t.MapContextMenuAdd.isAvailable();
	},
	isAvailableDispStatus: function () {
		var t = mapinfoFix;
		return t.dispStatusMod.isAvailable();
	},
	MapSelMarchPreset : function () {
		Options.OneClickAttackPreset = ById('ptMapOneClickAttackPreset').value;
		saveOptions();
	},
	MapContextMenu : function(uid,x,y,a,h,f,o,e) {
		var t = mapinfoFix;
		var div = ById('contextMenu');

		var MarchPresets = {0:"-- "+tx('Select March Preset')+" --"};
		for (var PN in Options.QuickMarchOptions.MarchPresets) {
			MarchPresets[PN] = Options.QuickMarchOptions.MarchPresets[PN][0];
		}
		var HQ = false;
		if (CM.FoundingModel) HQ = CM.FoundingModel.get_hq(x,y);
		var DefendStat = '';
		var citytile = ((e.indexOf("city") > -1 && uid!=null && uid!=0 && uid!="0") || e.indexOf("mist") > -1);
		if (citytile) { DefendStat = '<div style="margin-top:6px;" align=center id=ptDefendStatus>&nbsp;</div>';}

		if ((citytile || (uid!=null && uid!=0 && uid!="0")) && (!uid || uid!=uW.tvuid)) {
			var ascended = getAscensionValues(uW.currentcityid);
			if (ascended.isPrestigeCity) {
				var cityExpTime = ascended.prestigeBuffExpire;
				if (cityExpTime && cityExpTime > unixTime()) {
					var AP = document.createElement('div');
					AP.innerHTML = '<center><span class=boldRed><b>'+tx('ASCENSION')+'<br>'+tx('PROTECTION')+'<br>'+tx('WARNING')+'!</b></span></center>';
					div.insertBefore(AP,div.firstChild);
				}
			}
		}

		uWExportFunction('ptMapSelMarchPreset', t.MapSelMarchPreset);

		var QAPreset = '<div align=center>'+htmlSelector(MarchPresets, Options.OneClickAttackPreset, 'id=ptMapOneClickAttackPreset class=btInput onChange="ptMapSelMarchPreset();" onMouseMove="ptStopProp(event);" onMouseOut="ptStopProp(event);" onClick="ptStopProp(event);" onMouseUp="ptStopProp(event);"')+'</div>';

		var champ = false;
		if (Options.QuickMarchOptions.AutoChamp) {
			citychamp = getCityChampion(uW.currentcityid);
			if (citychamp.championId) {
				champ = true;
				if (citychamp.status != "10") { QAPreset += '<div align=center style="font-size:10px;color:#080"><b>'+tx('Champion Ready')+'!</b></div>'; }
				else {QAPreset += '<div align=center style="font-size:10px;color:#800"><b>Champion Unavailable!</b></div>';}
			}
			if (!champ) { QAPreset += '<div align=center style="font-size:10px;color:#800"><b>'+uW.g_js_strings.champ.no_champ+'!</b></div>'; }
		}
		if (Options.QuickMarchOptions.AutoSpell) {
			var faction = '';
			var spellavailable = false;
			var cooldownactive = false;
			if (Seed.cityData.city[uW.currentcityid].isPrestigeCity) {
				faction = parseInt(Seed.cityData.city[uW.currentcityid].prestigeInfo.prestigeType);
				spellavailable = (Seed.cityData.city[uW.currentcityid].prestigeInfo.blessings.indexOf(SpellBlessings[faction]) != -1)
				cooldownactive = (Seed.cityData.city[uW.currentcityid].spells && Seed.cityData.city[uW.currentcityid].spells[SpellTypes[faction]] && parseInt(Seed.cityData.city[uW.currentcityid].spells[SpellTypes[faction]].endDate) > uW.unixtime());
			}
			if (spellavailable) {
				if (!cooldownactive) {
					QAPreset += '<div align=center style="font-size:10px;"><span class=boldMagenta>'+uW.g_js_strings.spells['name_'+SpellTypes[faction]]+' '+tx('Ready')+'!</span></div>';
				}
				else {
					QAPreset += '<div align=center style="font-size:10px;"><span class=boldRed>'+uW.g_js_strings.spells['name_'+SpellTypes[faction]]+' '+tx('Regenerating')+'!</span></div>';
				}
			}
			else {
				QAPreset += '<div align=center style="font-size:10px;"><span class=boldRed>'+tx('No Spell Available')+'!</span></div>';
			}
		}

		if (uid!=null && uid!=0 && uid!="0") {
			var scr = document.createElement('div');
			if ((h!=0 && h == getMyAlliance()[0]) || uid == uW.tvuid || !Options.OneClickAttack || HQ) {
				var QAPreset = '';
			}
			scr.innerHTML = QAPreset+'<div align=center><b>'+tx('Loading')+'...</b></div>';
			div.appendChild(scr);
			var params = uW.Object.clone(uW.g_ajaxparams);
			params.checkArr = uid;
			new MyAjaxRequest(uW.g_ajaxpath + "ajax/getOnline.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					var p = rslt.data;
					var params = uW.Object.clone(uW.g_ajaxparams);
					params.pid = uid;
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/viewCourt.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params,
						onSuccess: function (rslt) {
							if (rslt.ok) {
								var u = unixTime();
								var f = convertTime(new Date(rslt.playerInfo.fogExpireTimestamp.replace(" ","T")+"Z"));
								var truce = "";
								if (rslt.playerInfo.warStatus != "1") {
									truce = " ("+Tabs.Monitor.getDuration(rslt.playerInfo.truceExpireTimestamp)+")";
								}

								var misted = (f >= u);
								m = '<TABLE width="100%" class=ptTab style="font-size:11px"><tr><td align="center"><div style="font-size:12px"><b>' + rslt.playerInfo.displayName +'</b></div></td></tr>';
								m += '<tr><TD align="center"><a id=btMapDetails>' + parseInt(rslt.playerInfo.userId)+'</a></td></tr>';
								var g=uW.g_js_strings.commonstr,h={1:g.normal,2:uW.g_js_strings.MapObject.begprotect,3:g.truce,4:g.vacation};
								m += '<tr><TD align="center"><B>' + h[rslt.playerInfo.warStatus]+truce+'</b></td></tr>';
								if (!p[uid])
									m+= '<tr><TD align="center">'+ t.getLastLogDuration(rslt.playerInfo.lastLogin) +'</td></tr>';
								else
									m+= '<tr><TD align="center"><span style="color:#f00;"><b>('+uW.g_js_strings.commonstr.online.toUpperCase()+')</b></span></td></tr>';
								if (misted)
									m += '<tr><TD align="center"><B>*** '+tx("MISTED")+' ***</b></td></tr>';

								scr.innerHTML = QAPreset+m + '</table>'+DefendStat;
								ById('btMapDetails').addEventListener('click', function(){ Battle.fetchPlayerInfo(rslt.playerInfo.userId,Battle.clickedPlayerDetails); },false);
								var MenuHeight = parseInt(div.offsetHeight);
								div.style.height = MenuHeight + 'px';
								div.style.overflow = 'visible';
								scr.style.height = '500px';
								scr.style.background = '';
								if (citytile) {getDefendStatus(x,y,ById('ptDefendStatus'),true);}
							}
						},
						});
					},
			});
		}
		else {
			if (HQ || !Options.OneClickAttack) {
				var QAPreset = '';
			}
			var scr = document.createElement('div');
			scr.innerHTML = QAPreset+DefendStat;
			div.appendChild(scr);
			var MenuHeight = parseInt(div.offsetHeight);
			div.style.height = MenuHeight + 'px';
			div.style.overflow = 'visible';
			scr.style.height = '500px';
			scr.style.background = '';
			if (citytile) {getDefendStatus(x,y,ById('ptDefendStatus'),true);}
		}
	},

	getLastLogDuration: function (datestr){
		if (!datestr) return;
		var Interval = convertTime(new Date(datestr.replace(" ","T")+"Z")) - unixTime();
		if (Interval < 0) return uW.timestr(Interval*(-1));
		else return tx('minutes ago');
	},

};

var GMTclock = {
	span: null,
	timer: null,
	init: function () {
		this.span = document.createElement('span');
		this.span.style.fontWeight = 'bold';
		ById('kochead_time').parentNode.appendChild(this.span);
		this.setEnable(Options.gmtClock);
	},
	setEnable: function (tf) {
		var t = GMTclock;
		if (tf) {
			setTimeout(function () {
				t.EverySecond();
			}, 1000);
		} else {
			t.span.innerHTML = '';
		}
	},
	EverySecond: function () {
		var t = GMTclock;
		var now = new Date();
		if (Options.gmtClockType == 1) {
			now.setTime(now.getTime() + (now.getTimezoneOffset() * 60000) - (480*60000) + parseInt(getDST(now)*1000) + (uW.g_timeoff*1000));
		}
		else {
			now.setTime(now.getTime() + (now.getTimezoneOffset() * 60000));
		}
		GMTclock.span.innerHTML = ' &nbsp; (' + formatGMTClock(now) + ')';
		if (Options.gmtClock) {
			setTimeout(function () {
				t.EverySecond();
			}, 1000);
		} else {
			GMTclock.span.innerHTML = '';
		}
	},
};

var DeleteReports = {
	deleting : false,
	pageNo : 1,
	maxpages : 10,
	scandelay : 30, // 30 secs between scans
	UIDArray : [],
	ReportLog : {
		ItemsFound			: {},
		ThroneItemsFound	: {},
		ChampItemsFound		: {},
		JewelItemsFound		: {},
		ItemsFoundDF		: {},
		ThroneItemsFoundDF	: {},
		ChampItemsFoundDF	: {},
		JewelItemsFoundDF	: {},
		DFCount : 0,
	},

	init : function(){
		var t = DeleteReports;
		t.loadLog();
		setTimeout(t.startdeletereports, 20*1000); // start in 20 seconds
	},

	loadLog : function () {
		var t = DeleteReports;
		var serverID = getServerId();
		s = GM_getValue ('ReportLog_'+serverID+'_'+uW.tvuid);
		if (s != null){
			opts = JSON2.parse (s);
			for (var k in opts)
				t.ReportLog[k] = opts[k];
		}
	},

	saveLog : function () {
		var t = DeleteReports;
		setTimeout(function () { GM_setValue ('ReportLog_'+getServerId()+'_'+uW.tvuid, JSON2.stringify(t.ReportLog));} ,0); // get around GM_SetValue uW error
	},

	startdeletereports : function(){
		var t = DeleteReports;
		if(!t.deleting) {
			if (Options.ReportOptions.DeleteRptbc || Options.ReportOptions.DeleteRpttr || Options.ReportOptions.DeleteRptwl || Options.ReportOptions.DeleteRptaa || Options.ReportOptions.DeleteRptfr || Options.ReportOptions.DeleteRptid || Options.ReportOptions.DeleteRptdf || Options.ReportOptions.DeleteRptsc){
				t.deleting = true;
				t.listreports(t.pageNo, t.checkreports);
			}
			else {
				t.deleting = false;
				t.pageNo = 1;
				setTimeout(t.startdeletereports, t.scandelay*1000);
			}
		};
	},

	listreports : function(pageNo, callback){
		var t = DeleteReports;
		t.pageNo = pageNo;

		if (!Options.ReportOptions.DeleteRptbc && !Options.ReportOptions.DeleteRpttr && !Options.ReportOptions.DeleteRptwl && !Options.ReportOptions.DeleteRptaa && !Options.ReportOptions.DeleteRptfr && !Options.ReportOptions.DeleteRptid && !Options.ReportOptions.DeleteRptdf && !Options.ReportOptions.DeleteRptsc){
			t.deleting = false;
			t.pageNo = 1;
			setTimeout(t.startdeletereports, t.scandelay*1000);
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		if (t.pageNo >= 1) params.pageNo = t.pageNo;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/listReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { callback(rslt); },
			onFailure: function () { callback({ok:false}); },
		});
	},
	checkreports : function(rslt){
		var t = DeleteReports;
		if(!rslt.ok || (rslt.arReports.length < 1)){ // no results or no reports
			t.deleting = false;
			t.pageNo = 1;
			setTimeout(t.startdeletereports, t.scandelay*1000);
			return;
		}
		var reports = rslt.arReports;
		var players = rslt.arPlayerNames;
		var totalPages = rslt.totalPages;
		if (rslt.totalPages > t.maxpages) var totalPages = t.maxpages;
		var deletes1 = new Array();
		var deletes0 = new Array();
		for(k in reports){
			if (reports[k].reportType == 0) {
				var reportUnixTime = Number(reports[k].reportUnixTime);
				if(Options.ReportOptions.DeleteRptbc){
					if((reports[k].marchType==4 || reports[k].marchType==9) && reports[k].side0PlayerId==0 && reports[k].side0TileType == 51) {
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
					else if(reports[k].marchType==1 && isMyself(reports[k].side1PlayerId)) {
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
				}
				if (Options.ReportOptions.DeleteRpttr){
					if(reports[k].marchType==1 && isMyself(reports[k].side0PlayerId)) {
						if (deletes0.indexOf(k.substr(2)) == -1) deletes0.push(k.substr(2));
					}
				}
				if (Options.ReportOptions.DeleteRptwl){
					if(reports[k].side0TileType <= 50 && reports[k].side0PlayerId==0) {
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
				}
				if (Options.ReportOptions.DeleteRptdf){
					if(reports[k].side0TileType==54 && reports[k].side0PlayerId==0) {
						t.checkreportforitems(k.substr(2),false);
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
				}
				if (Options.ReportOptions.DeleteRptaa && Options.AttackOptions && Options.AttackOptions.Routes){
					for(var i in Options.AttackOptions.Routes) {
						var a = Options.AttackOptions.Routes[i];
						if(reports[k].side0XCoord == a.target_x && reports[k].side0YCoord == a.target_y && reports[k].marchType==4 && isMyself(reports[k].side1PlayerId)) {
							if(reports[k].side0PlayerId!=0) { // don't delete deleted crests on other players
								t.checkreportforitems(k.substr(2),true);
							}
							else {
								t.checkreportforitems(k.substr(2),false);
								if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
							}
							break;
						}
					}
				}
				if (Options.ReportOptions.DeleteRptfr){
					for (var l in uW.seed.allianceDiplomacies.friendlyToThem) {
						if(reports[k].side1AllianceId == uW.seed.allianceDiplomacies.friendlyToThem[l].allianceId) {
							if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
						}
					}
					for (var l in uW.seed.allianceDiplomacies.friendly) {
						if(reports[k].side1AllianceId == uW.seed.allianceDiplomacies.friendly[l].allianceId) {
							if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
						}
					}
				}
				if (Options.ReportOptions.DeleteRptid){
					if (Options.ReportOptions.DeleteRptUID != "") {
						// split string by commas
						t.UIDArray = Options.ReportOptions.DeleteRptUID.split(",");
						if (t.UIDArray.indexOf(reports[k].side1PlayerId) != -1) {
							if (deletes1.indexOf(k.substr(2)) == -1) {
								if (Options.ReportOptions.DeleteRptidType==0 || Options.ReportOptions.DeleteRptidType==reports[k].marchType) {
									deletes1.push(k.substr(2));
								}
							}
						}
					}
				}
				if (Options.ReportOptions.DeleteRptsc){
					if(reports[k].marchType==3 && isMyself(reports[k].side0PlayerId)) {
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
				}
			}
		}
		if(deletes1.length > 0 || deletes0.length > 0){
			t.deleteCheckedReports(deletes1, deletes0);
		} else {
			if (t.pageNo <= totalPages) {
				t.deleting = false;
				t.pageNo++;
				setTimeout(t.startdeletereports, 5*1000); // next page in 5 seconds
				return;
			}
			else {
				t.deleting = false;
				t.pageNo = 1;
				setTimeout(t.startdeletereports, t.scandelay*1000);
				return;
			}
		}
	},

	deleteCheckedReports : function(deletes1, deletes0){
		var t = DeleteReports;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.s1rids = deletes1.join(",");
		params.s0rids = deletes0.join(",");
		params.cityrids = '';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if(rslt.ok){
					if (deletes0.length>0) {
						for (var j=0;j<deletes0.length;j++) {
							delete ReportCache[deletes0[j]];
							delete ReportDetailCache[deletes0[j]];
						}
					}
					if (deletes1.length>0) {
						for (var j=0;j<deletes1.length;j++) {
							delete ReportCache[deletes1[j]];
							delete ReportDetailCache[deletes1[j]];
						}
					}
					Seed.newReportCount = parseInt(Seed.newReportCount) - parseInt(deletes1.length) - parseInt(deletes0.length);
					if (GlobalOptions.ExtendedDebugMode) actionLog('Deleted: ' +parseInt(deletes1.length + deletes0.length)+' reports','REPORTS');
					t.deleting = false;
					setTimeout(t.startdeletereports, 5*1000); // next page in 5 seconds
				}
				else {
					t.deleting = false;
					t.pageNo = 1;
					setTimeout(t.startdeletereports, t.scandelay*1000); // error - start again
				}
			},
			onFailure: function () {
				t.deleting = false;
				t.pageNo = 1;
				setTimeout(t.startdeletereports, t.scandelay*1000); // error - start again
			},
		});
	},

	checkreportforitems: function(rpId,deletewinner) {
		var t = DeleteReports;
		FetchReportDetail(rpId,1,function(rslt) {
			if (rslt && rslt.winner) {
				var darkforest = false;
				if (rslt.fght && rslt.fght.s0 && (rslt.fght.s0.m101 || rslt.fght.s0.m102 || rslt.fght.s0.m103 || rslt.fght.s0.m104 || rslt.fght.s0.m105 || rslt.fght.s0.m106 || rslt.fght.s0.m107 || rslt.fght.s0.m108 || rslt.fght.s0.m109 || rslt.fght.s0.m10))
					{
						darkforest = true;
						t.ReportLog.DFCount++;
					}
				if(rslt.loot && rslt.loot[5]) {
					var loot = rslt.loot[5];
					if (matTypeof(loot) == 'object') {
						for (var z in loot) {
							if (darkforest) {
								if(t.ReportLog.ItemsFoundDF[z]) { t.ReportLog.ItemsFoundDF[z] += parseInt(loot[z]); }
								else { t.ReportLog.ItemsFoundDF[z] = parseInt(loot[z]);}
							} else {
								if(t.ReportLog.ItemsFound[z]) { t.ReportLog.ItemsFound[z] += parseInt(loot[z]); }
								else { t.ReportLog.ItemsFound[z] = parseInt(loot[z]); }
							}
						}
					}
				}
				if (rslt.throneRoomDrop) {
					var TR = rslt.throneRoomDrop;
					var z = ""+TR.type+TR.quality;
					if (darkforest) {
						if(t.ReportLog.ThroneItemsFoundDF[z]) { t.ReportLog.ThroneItemsFoundDF[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = TR.type;
							NewObj.quality = TR.quality;
							NewObj.amount = 1;
							t.ReportLog.ThroneItemsFoundDF[z] = NewObj;
						}
					} else {
						if(t.ReportLog.ThroneItemsFound[z]) { t.ReportLog.ThroneItemsFound[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = TR.type;
							NewObj.quality = TR.quality;
							NewObj.amount = 1;
							t.ReportLog.ThroneItemsFound[z] = NewObj;
						}
					}
				}
				if (rslt.equipmentDrop) {
					var EQ = rslt.equipmentDrop;
					var z = ""+EQ.subtype+EQ.rarity;
					if (darkforest) {
						if(t.ReportLog.ChampItemsFoundDF[z]) { t.ReportLog.ChampItemsFoundDF[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = EQ.subtype;
							NewObj.quality = EQ.rarity;
							NewObj.amount = 1;
							t.ReportLog.ChampItemsFoundDF[z] = NewObj;
						}
					} else {
						if(t.ReportLog.ChampItemsFound[z]) { t.ReportLog.ChampItemsFound[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = EQ.subtype;
							NewObj.quality = EQ.rarity;
							NewObj.amount = 1;
							t.ReportLog.ChampItemsFound[z] = NewObj;
						}
					}
				}
				if (rslt.lootJewel) {
					var item = rslt.lootJewel;
					if (matTypeof(item) == 'object') {
						var z = item.quality;
						if (darkforest) {
							if(t.ReportLog.JewelItemsFoundDF[z]) { t.ReportLog.JewelItemsFoundDF[z] += parseInt(item.quantity); }
							else { t.ReportLog.JewelItemsFoundDF[z] = parseInt(item.quantity);}
						} else {
							if(t.ReportLog.JewelItemsFound[z]) { t.ReportLog.JewelItemsFound[z] += parseInt(item.quantity); }
							else { t.ReportLog.JewelItemsFound[z] = parseInt(item.quantity); }
						}
					}
				}
				t.saveLog();
				if (deletewinner) {
					deleteCheckedReport(rpId);
				}
			};
		});
	},
}

var DispReport = {
	init: function () {
		var t = DispReport;

		try {
			t.modal_MessageButtons = new CalterUwFunc('modal_messages', [[/}\s*$/, ';setTimeout(function() { AddMsgButtons(); },0); }']]);
			uWExportFunction('AddMsgButtons', DispReport.AddMsgButtons);
			t.modal_MessageButtons.setEnable(Options.enhancedinbox);

			t.modal_InboxFunc = new CalterUwFunc ('modal_messages_listshow', [['msghtml.join("");', 'msghtml.join("");dispInbox_hook(rslt,boxType,msghtml);'],
			['reverse()','sort(function(aaa, bbb){return bbb-aaa})']]);
			uWExportFunction('dispInbox_hook', DispReport.ModalInboxHook);
			t.modal_InboxFunc.setEnable (true);

			t.modal_RptFunc = new CalterUwFunc('Messages.handleListReports', [['n.join("");', 'n.join("");dispRpt_hook(l,n);']]);
			uWExportFunction('dispRpt_hook', DispReport.ModalReportListHook);
			t.modal_RptFunc.setEnable(Options.enhancedinbox);

			t.modal_MessageText = new CalterUwFunc('modal_messages_view', [[/<div class='bodytext'>/, "<div class='bodytext' ondblclick='btSelectText(this);'>"],[/backButtonHtml;/,"backButtonHtml;parseLinks();"]]);
			uWExportFunction('parseLinks', DispReport.parseLinks);
			t.modal_MessageText.setEnable(true);

			uWExportFunction('makeReportLink', makeReportLink);
			uWExportFunction('makeReportPopup', makeReportPopup);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = DispReport;
		t.modal_InboxFunc.setEnable(tf);
	},
	isDispReportAvailable: function () {
		var t = DispReport;
		return t.modal_InboxFunc.isAvailable();
	},
	AddMsgButtons :function() {
		var t = DispReport;
		if (ById('modal_msg_links')) ById('modal_msg_links').style.top = '8px';
		msgBody = ByCl('messageDeletes');
		var div = msgBody[0];
		var a = document.createElement('a');
		a.className = 'inlineButton brown20';
		a.style.marginRight = '6px';
		a.innerHTML = '<span>'+tx('Delete Gift Report')+'</span>';
		a.addEventListener('click', function(){t.checkinbox(1);}, false);
		div.appendChild(a);

		msgBody = ByCl('reportDeletes');
		var div = msgBody[0];
		var a = document.createElement('a');
		a.className = 'buttonDown20';
		a.innerHTML = '<span>'+tx('Delete Wild/Barb/Transport')+'</span>';
		a.style.float = 'left';
		a.addEventListener('click', t.checkreportlist, false);
		div.appendChild(a);
	},
	ModalInboxHook : function (rslt,boxType,msghtml){
		var t = DispReport;

		var div = ById('ptPageNavBar');
		if (div) div.style.marginLeft = '20px';

		// fix outbox buttons.... game bug!
		if (boxType == 'outbox') {
			uW.hideMessageTabs();
			jQuery(".messageDeletes").show();
		}
		if (ById('modal_msg_view_body')) {
			var msgdiv = ById('modal_msg_view_body').getElementsByClassName('bodytext')[0];
			if (msgdiv) {
				msgdiv.addEventListener('dblclick', function () { SelectText(msgdiv); },false);
			}
		}
	},
	parseLinks: function() {
		var t = DispReport;
		if (ById('modal_msg_view_body')) {
			var msgdiv = ById('modal_msg_view_body').getElementsByClassName('bodytext')[0];
			if (msgdiv) {
				msgdiv.innerHTML = msgdiv.innerHTML.replace(/(\bReport\sNo\:\s([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
				msgdiv.innerHTML = msgdiv.innerHTML.replace(/(\bRpt\:([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
				msgdiv.innerHTML = msgdiv.innerHTML.replace(/#([0-9]+)#/g, '<a onclick=\'ptChatReportClicked($1,0)\'>$1</a>');
			}
		}
	},
	checkinbox: function (what) {
		var t = DispReport;
		var body = ById('tbl_messages');
		if (!body) return;
		var trs = body.getElementsByTagName('tr');
		var reports = [];
		for (var i = 0; i < trs.length; i++) {
			var tds = trs[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {
				if(tds[j].className == 'chkcol') var checkbox = tds[j];
				if(tds[j].className == 'dtcol') var date = tds[j];
				if(tds[j].className == 'nmcol') var sender = tds[j];
				if(tds[j].className == 'subjcol') var subject = tds[j];
			}
			reports.push({ checkbox: checkbox, date:date, sender: sender, subject: subject });
		}
		if (what==1) t.parseGiftReport(reports);
	},
	parseGiftReport: function (rpts) {
		var t = DispReport;
		for (var i = 0; i < rpts.length; i++) {
			var GiftMessage = false;
			for (var j in GiftText) {
				if (rpts[i].subject.innerHTML.indexOf(GiftText[j]) != -1) {
					GiftMessage = true;
					break;
				}
			}
			if(rpts[i].sender.innerHTML.indexOf('Kingdoms Of Camelot') >= 0 && GiftMessage){
				rpts[i].checkbox.firstChild.checked = true;
			}
		}
		uW.messages_action("delete", "tbl_messages");
	},
	ModalReportListHook: function (rslt, msghtml) {
		var t = DispReport;
		// fix HQ buttons.... rockyou bug!
		jQuery(".hqMessageDeletes").hide();

		if (rslt.ok) {
			msgBody = ById('modal_msg_reports_tablediv');
			var mml = ById('modal_msg_list');
			if (mml != null) mml.style.minHeight = '400px';
			var trs = msgBody.getElementsByTagName('tr');
			for (var i = 0; i < trs.length; i++) {
				var tds = trs[i].getElementsByTagName('td');
				for (var j = 0; j < tds.length; j++) {
					if (tds[j].className == 'subjcol') {
						tds[j].style.width = '190px';
						var original = tds[j].innerHTML;
						original = original.replace("<div>", "");
						original = original.replace("</div>", "");
						var popup = original.replace(uW.g_js_strings.modal_messages_viewtrades.viewrpt, tx("Pop-up"));
						popup = popup.replace(uW.g_js_strings.commonstr.view, tx("Pop-up"));
						popup = popup.replace("Messages.viewMarchReport", "makeReportPopup");
						var makelink = original.replace(uW.g_js_strings.modal_messages_viewtrades.viewrpt, tx("Share"));
						makelink = makelink.replace(uW.g_js_strings.commonstr.view, tx("Share"));
						makelink = makelink.replace("Messages.viewMarchReport", "makeReportLink");
						original = original.replace(uW.g_js_strings.modal_messages_viewtrades.viewrpt, uW.g_js_strings.commonstr.view);
						var newContent = original + " | " + popup + " | " + makelink;
						tds[j].innerHTML = '<DIV style="width:180px;">' + newContent + '</div>';
					}
					if (tds[j].className == 'nmcol') {
						tds[j].style.width = '400px';
					}
				}
			}
		}
	},
	checkreportlist: function () {
		var t = DispReport;
		var body = ById('modal_msg_reports_tablediv');
		var trs = body.getElementsByTagName('tr');
		var reports = [];
		for (var i = 0; i < trs.length; i++) {
			var tds = trs[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {
				if (tds[j].className == 'chkcol') {
					var checkbox = tds[j];
				}
				if (tds[j].className == 'nmcol') {
					var type = tds[j];
				}
				if (tds[j].className == 'subjcol') {
					var view = tds[j];
				}
			}
			reports.push({
				checkbox: checkbox,
				type: type,
				view: view
			});
		}
		t.parseBarbReport(reports);
	},
	parseBarbReport: function (rpts) {
		var t = DispReport;
		if (NoRegEx) { // regular expression fix for cometbird
			var regex = /Messages.viewMarchReport\(([^&]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([^&]+),([^&]+),([^&]+),([^&]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+)/;
		}
		else {
			var regex = /Messages.viewMarchReport\(([^"]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([^"]+),([^"]+),([^"]+),([^"]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+)/;
		}
		for (var i = 0; i < rpts.length; i++) {
			var m = regex.exec(rpts[i].view.innerHTML);
			if (m) {
				if (m[6] == m[8] && m[7] == m[9]) { //Source and target id the same.
					// continue; //Infer transport to self
				} else if (m[5] != 0) {
					continue;
				}
				rpts[i].checkbox.firstChild.checked = true;
			}
		}
		uW.Messages.deleteCheckedReports();
	}
};

function makeReportLink(rptid, side, tiletype, tilelv, defid, defnm, defgen, atknm, atkgen, marchtype, xcoord, ycoord, timestamp, unread, atkxcoord, atkycoord, side0AllianceName, side1AllianceName, link) {
	uW.Chat.sendChat("/a Report No: "+enFilter(rptid));
};

function makeReportPopup(rptid, side, tiletype, tilelv, defid, defnm, defgen, atknm, atkgen, marchtype, xcoord, ycoord, timestamp, unread, atkxcoord, atkycoord, side0AllianceName, side1AllianceName, link) {
	Rpt.FindReport(rptid, 0);
};

var AllianceReports = {
	init: function () {
		t = AllianceReports;

		try {
			uWExportFunction('ListAR_hook',AllianceReports.myAllianceReports);
			t.listFunc = new CalterUwFunc('allianceReports', [
				['var params', 'ListAR_hook(pageNo);return;var params']
			]);
			t.listFunc.setEnable(Options.enhanceARpts);

			uWExportFunction('getReportDisplay_hook2', AllianceReports.getReportDisplayHook);
			uWExportFunction('FindReport', Rpt.FindReport);

			t.marvFunc = new CalterUwFunc('modal_alliance_report_view', [
				['getReportDisplay', 'getReportDisplay_hook2']
			]);
			t.marvFunc.setEnable(true);

			t.memListFunc = new CalterUwFunc('membersInfo', [
				['commonstr.might', 'commonstr.might + "</td><td class=colcities>" + g_js_strings.commonstr.cities + "</td><td class=collast>" + g_js_strings.membersInfo.lastonline'],
				['memberInfo[key].prestige\)', 'memberInfo[key].prestige)+ "</td>");memhtml.push("<td class=colcities>" + memberInfo[key].cities + "</td>");memhtml.push("<td class=collast>" + memberInfo[key].lastLogin']
			]);
			t.enable_viewmembers(Options.enhanceViewMembers);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	getReportDisplayHook: function (a, b) {
		var x = '';
		try {
			x = uW.getReportDisplay(a, b);
		} catch (e) {
			x = 'Error formatting report: ' + e.message;
		}
		return x;
	},
	enable_viewmembers: function (tf) {
		t = AllianceReports;
		t.memListFunc.setEnable(tf);
	},
	enable: function (tf) {},
	myAllianceReports: function (pageNum) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		if (pageNum)
			params.pageNo = pageNum;
		params.group = "a";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/listReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				displayReports(rslt.arReports, rslt.arPlayerNames, rslt.arAllianceNames, rslt.arCityNames, rslt.totalPages);
			},
		}, false);

		function displayReports(ar, playerNames, allianceNames, cityNames, totalPages) {
			var msg = "";
			var myAllianceId = getMyAlliance()[0];
			msg += "<STYLE>.msgviewtable tbody .myCol div {margin-left:5px; overflow:hidden; white-space:nowrap; color:#000}\
				.msgviewtable tbody .myHostile div {font-weight:600; color:#600}\
				.msgviewtable tbody .myGray div {color:#666}\
				.msgviewtable tbody .myRein div {color:#050}\
				.msgviewtable tbody .myWarn div {font-weight:600; color:#442200}\
				</style>";
			msg += "<div class='modal_msg_reports'>";
			var rptkeys = Object.keys(ar);
			if (ar && matTypeof(ar) != 'array') {
				msg += "<div id='modal_alliance_reports_tablediv' class='modal_msg_list'><table width=675 cellpadding='0' cellspacing='0' class='msgviewtable reportviewtable alliancetable'>";
				msg += "<thead><tr><td width=105>"+uW.g_js_strings.commonstr.date+"</td><td width=40>"+uW.g_js_strings.commonstr.type+"</td><td width=150>"+uW.g_js_strings.commonstr.attacker+"</td><td>"+uW.g_js_strings.commonstr.target+"</td><td>"+uW.g_js_strings.commonstr.view+"</td></tr></thead><tbody>";
				for (var i = 0; i < rptkeys.length; i++) {
					var rpt = ar[rptkeys[i]];
					var colClass = '"myCol"';
					rpt.marchType = parseInt(rpt.marchType);
					rpt.side0AllianceId = parseInt(rpt.side0AllianceId);
					var targetDiplomacy = getDiplomacy(rpt.side0AllianceId);
					if (rpt.marchType == 2) {
						colClass = '"myCol myRein"';
					} else if (rpt.side1AllianceId != myAllianceId) {
						colClass = '"myCol myHostile"';
					} else {
						if (parseInt(rpt.side0TileType) == 57) { // if megalith
							colClass = '"myCol myWarn"';
						}
						else {
							if (parseInt(rpt.side0TileType) < 50) { // if wild
								if (parseInt(rpt.side0PlayerId) == 0)
									colClass = '"myCol myGray"';
								else
									colClass = '"myCol myWarn"';
							} else if (parseInt(rpt.side0PlayerId) == 0) { // barb
								colClass = '"myCol myGray"';
							} else {
								if (targetDiplomacy == uW.g_js_strings.commonstr.friendly)
									colClass = '"myCol myWarn"';
							}
						}
					}
					msg += "<tr valign=top";
					if (i % 2 == 0)	msg +=" class=stripe";
					msg += "><TD class=" + colClass + "><div>"+uW.formatDateByUnixTime(rpt.reportUnixTime)+"<BR>Rpt&nbsp;<a onclick='FindReport(" + rpt.reportId + ",0);return false;'>#" + rpt.reportId + "</a>";
					msg += "</div></td><TD class=" + colClass + "><div>";
					if (rpt.marchType == 1)	msg += uW.g_js_strings.commonstr.transport;
					else if (rpt.marchType == 3) msg += uW.g_js_strings.commonstr.scout;
					else if (rpt.marchType == 2) msg += tx('Reinf');
					else msg += uW.g_js_strings.commonstr.attack;
					// attacker ...
					msg += "</div></td><TD class=" + colClass + "><div>";
					if (parseInt(rpt.side1PlayerId) != 0) msg += playerNames["p" + rpt.side1PlayerId];
					else msg += "?"+tx('Unknown')+"?";
					msg += " "+coordLink(rpt.side1XCoord, rpt.side1YCoord,true)+"<BR>";
					if (rpt.side1AllianceId != myAllianceId) { msg += allianceNames['a' + rpt.side1AllianceId]+" ("+getDiplomacy(rpt.side1AllianceId)+")"; }
					else { msg += "<BR>"; }
					msg += "</div></td>";
					// target ...
					msg += "<TD class=" + colClass + "><DIV>";
					var type = parseInt(rpt.side0TileType);
					if (type == 57) { // megalith
						msg += capitalize(uW.g_mapObject.types[type]||"")+" "+uW.g_js_strings.commonstr.lvl+" "+rpt.side0TileLevel;
						if (parseInt(rpt.side0PlayerId) != 0) { // IF OWNED, show owner ...
							msg += " ["+playerNames["p" + rpt.side0PlayerId]+"] ";
						}
					}
					else {
						if (type < 50) { // wild
							msg += capitalize(uW.g_mapObject.types[type]||"")+" "+uW.g_js_strings.commonstr.lvl+" "+rpt.side0TileLevel;
							if (parseInt(rpt.side0PlayerId) != 0) { // IF OWNED, show owner ...
								msg += " ["+playerNames["p" + rpt.side0PlayerId]+"] ";
							}
						}
						else {
							if (parseInt(rpt.side0PlayerId) == 0) { // barb
								msg += uW.g_js_strings.commonstr.barbariancamp+" "+uW.g_js_strings.commonstr.lvl+" "+rpt.side0TileLevel;
							}
							else { // city
								msg += playerNames["p" + rpt.side0PlayerId]+" - "+cityNames['c' + rpt.side0CityId];
							}
						}
					}
					msg += " "+coordLink(rpt.side0XCoord, rpt.side0YCoord,true);
					if (rpt.side0AllianceId != 0 && rpt.side0AllianceId != myAllianceId) {
						msg += "<BR>"+allianceNames['a' + rpt.side0AllianceId]+" ("+targetDiplomacy+")";
					}
					// 'view report' link ...
					if (rpt.marchType != 2) {
						msg += "</div></td><TD class=" + colClass + "><div><a onclick='modal_alliance_report_view("+rpt.reportId+",";
						if (parseInt(rpt.side1AllianceId) == parseInt(Seed.allianceDiplomacies.allianceId))	{ msg += '1'; }
						else { msg += '0'; }
						msg += ","+rpt.side0TileType+","+rpt.side0TileLevel+","+rpt.side0PlayerId+',"';
						if (parseInt(rpt.side0PlayerId) != 0) msg += escape(playerNames["p" + rpt.side0PlayerId]);
						else msg += uW.g_js_strings.commonstr.enemy;
						msg += '","';
						if (parseInt(rpt.side0PlayerId) != 0) msg += escape(playerNames["g" + rpt.side0PlayerId]);
						else msg += '0';
						msg += '","';
						if (parseInt(rpt.side1PlayerId) > 0) msg += escape(playerNames["p" + rpt.side1PlayerId]);
						msg += '","';
						if (parseInt(rpt.side1PlayerId) != 0) msg += escape(playerNames["g" + rpt.side1PlayerId]);
						msg += '",'+rpt.marchType+","+rpt.side0XCoord+","+rpt.side0YCoord+","+rpt.reportUnixTime+",";
						if (parseInt(rpt.reportStatus) == 2) msg += "1";
						else msg += "0";
						if (rpt.side1XCoord) { msg += ","+rpt.side1XCoord+","+rpt.side1YCoord; }
						else { msg += ",,"; }
						msg += ");return false;'>"+uW.g_js_strings.commonstr.view+"</a></div></td></tr>";
					} else {
						// reinforcement!!
						msg += "</div></td><TD class=" + colClass + "><div><a onclick='FindReport(\""+rpt.reportId+"\",0);return false;'>"+uW.g_js_strings.commonstr.view+"</a></div></td></tr>";
					}
				}
				msg += "</tbody></table></div>";
			}
			msg += "</div><div id='modal_report_list_pagination'></div>";
			ById('allianceContent').innerHTML = msg;
			if (pageNum) {
				uW.ctrlPagination("modal_report_list_pagination", totalPages, "allianceReports", pageNum)
			} else {
				uW.ctrlPagination("modal_report_list_pagination", totalPages, "allianceReports")
			}
		}
	},
};

var AllianceReportsCheck = {
	aRpt: {},

	init: function () {
		var t = AllianceReportsCheck;
		var b = GM_getValue('allianceRpt_'+getServerId()+'_'+uW.tvuid);
		if (b != null)
			t.aRpt = JSON2.parse(b);
		else {
			t.aRpt = {};
		}
		t.enable(Options.ReportOptions.EnhanceAR);
	},

	enable: function (tf) {
		var t = AllianceReportsCheck;
		if (Options.ReportOptions.EnhanceAR) {
			t.checkAllianceReport();
		}
		setTimeout(t.enable, parseInt((Math.random() * 15 * 1000) + (Options.ReportOptions.alertinterval * 1000)), Options.ReportOptions.EnhanceAR);
	},

	checkAllianceReport: function () {
		var t = AllianceReportsCheck;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.group = "a";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/listReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				t.parseAReports(rslt.arReports, rslt.arPlayerNames, rslt.arAllianceNames, rslt.arCityNames, rslt.totalPages);
			},
		}, true);
	},
	parseAReports: function (ar, playerNames, allianceNames, cityNames, totalPages) {
		var t = AllianceReportsCheck;
		var myAllianceId = getMyAlliance()[0];
		var rptkeys = uW.Object.keys(uWCloneInto(ar));
		if (ar && matTypeof(ar) != 'array') {
			for (var i = 0; i < rptkeys.length; i++) {
				var rpt = ar[rptkeys[i]];
				if (rpt.side1AllianceId != myAllianceId && Options.ReportOptions.PostIncoming) {
					var ID = rpt.reportId;
					var target = tx("city");
					if (t.aRpt["a" + ID]) continue;
					if (rpt.marchType == 3) {atkType = tx('scouted');}
					else if (rpt.marchType == 4) {atkType = tx('attacked');}
					if (rpt.side0TileType == 57) {target = tx("megalith");}
					else if (rpt.side0TileType <= 50) {target = tx("wild");}
					var allianceName = '';
					if (parseIntNan(rpt.side1AllianceId) != 0) {
						allianceName = ' of '+allianceNames["a"+rpt.side1AllianceId]+' ('+getDiplomacy(rpt.side1AllianceId)+')';
					}
					var date = uW.formatDateByUnixTime(rpt.reportUnixTime);
					var msg = ':::. | Report No: ' + enFilter(rpt.reportId) + ' || ' + date + ' || ' + playerNames['p' + rpt.side0PlayerId] + '\'s ' + target + ' '+tx('at')+' ' + rpt.side0XCoord + ',' + rpt.side0YCoord + ' '+tx('has been')+' ' + atkType + ' '+tx('by')+' ' + playerNames["p" + rpt.side1PlayerId] + ' '+tx('at')+' ' + rpt.side1XCoord + ',' + rpt.side1YCoord + allianceName;
					t.fetchreport(ID, rpt, msg, playerNames, cityNames, rpt.side0TileType, rpt.marchType);
					t.addAllianceReport(rpt);
				}
				if (rpt.side1PlayerId == uW.tvuid && Options.ReportOptions.WhisperOutgoing) {
					var ID = rpt.reportId;
					if (t.aRpt["a" + ID]) continue;

					if ((rpt.marchType == 4) && Options.AttackOptions && Options.AttackOptions.Routes){
						var crest = false;
						for(var j in Options.AttackOptions.Routes) {
							var a = Options.AttackOptions.Routes[j];
							if(rpt.side0XCoord == a.target_x && rpt.side0YCoord == a.target_y) {
								crest = true;
								break;
							}
						}
						if (crest) {
							t.addAllianceReport(rpt); // no try again
							continue; // no whisper on crest targets
						}
					}
					if (rpt.marchType == 3) {atkType = tx('scouted');}
					else if (rpt.marchType == 4) {atkType = tx('attacked');}
					target = tileTypes[parseInt(rpt.side0TileType)];
					if (parseInt(rpt.side0PlayerId) == 0) {	var playerName = '';}
					else {	var playerName = playerNames['p' + rpt.side0PlayerId] + '\'s ';}
					var date = uW.formatDateByUnixTime(rpt.reportUnixTime);
					var msg = ':::. | Report No: ' + enFilter(rpt.reportId) + ' || ' + date + ' || ' + playerName + target + ' '+tx('at')+' ' + rpt.side0XCoord + ',' + rpt.side0YCoord + ' '+tx('has been')+' ' + atkType + ' '+tx('by you');
					var automsg = sendChat("/" + Seed.player.name + ' ' + msg);
					t.addAllianceReport(rpt);
				}
			}
		}
	},
	addAllianceReport: function (rpt) {
		t = AllianceReportsCheck;
		var ID = rpt.reportId;
		t.aRpt["a" + ID] = rpt.reportUnixTime;
		var now = unixTime() - (5 * 24 * 60 * 60);
		for (var k in t.aRpt) {
			if (t.aRpt[k] < now)
				delete t.aRpt[k];
		}
		var string = JSON2.stringify(t.aRpt);
		setTimeout(function () { GM_setValue("allianceRpt_" + getServerId()+"_"+uW.tvuid, string); }, 0);
	},
	fetchreport: function (rpId, rpt, msg, playerNames, cityNames, TileType, MarchType) {
		var t = AllianceReportsCheck;
		if (Options.ReportOptions.IgnoreScouts && MarchType == 3) return;
		if (Options.ReportOptions.IgnoreWilds && TileType <= 50) return;
		FetchReport(rpId,function(rslt) {
			if (rslt.detail.winner && rslt.detail.winner == 1) { var DefeatedText = ' ||[#1][#8] '+tx('You were defeated')+'![#][#]'; }
			else { var DefeatedText = ' ||[#2] '+tx('You defended successfully')+'![#]'; }
			var troops = rslt.detail.fght.s1;
			var trooptot = 0;
			for (var i in troops) {
				trooptot += Number(troops[i][0]);
			}
			if (Options.ReportOptions.alertmtroops > trooptot) return;
			msg = msg+' || '+uW.g_js_strings.commonstr.troops+' '+trooptot+DefeatedText;
			if (Options.ReportOptions.WhisperAR) {
				var automsg = sendChat("/"+Seed.player.name+' '+msg);
				var WList = Options.ReportOptions.WhisperARList.split(',');
				for (var i = 0; i < WList.length; i++) {
					var WName = WList[i].trim();
					if (WName) BotChat.sendWhisper(msg,WName);
				}
			}
			else {
				var automsg = sendChat('/a '+msg);
			}
		});
	},
};

var towho = {
	mmFunc: null,
	init: function () {
		t = towho;

		try {
			t.mmFunc = new CalterUwFunc('cm.messageController.messageWide', [
				[/params\.subject\s*=\s*..".modal_msg_write_subj".\.val.../im, 'params.subject = cm.messageController.escape\(allianceall?"{"+g_js_strings.commonstr.alliance+"} "+document.getElementById(\'modal_msg_write_subj\').value:"{"+g_js_strings.commonstr.officers+"} "+document.getElementById(\'modal_msg_write_subj\').value\);'],
				[/\$\("#modal_msg_write_to/im, 'jQuery("#modal_msg_write_to']
			]);
			t.mmFunc.setEnable(true);
		}
		catch (err) {
			logerr(err); // write to log
		}
	}
}

var PageNavigator = {
	modalMessagesFunc: null,
	ctrlPaginationOld: null,
	loadPage_paginationOld: null,
	cpPager: null,
	init: function () {
		var t = PageNavigator;

		try {
			t.modalMessagesFunc = new CalterUwFunc('modal_messages', [
				[/pageNavigatorModel\s*=.*?;/i, 'var pager=ptPagerHook(0,5);pageNavigatorModel=pager;'],
				[/pageNavigatorView\s*=.*?;/i, 'pageNavigatorView=pager;'],
				[/pageNavigatorController\s*=.*?;/i, 'pageNavigatorController=pager;']
			]);

			uWExportFunction('ptPagerHook',PageNavigator.ConstructCPager);

			t.ctrlPaginationOld = uW.ctrlPagination;
			t.loadPage_paginationOld = uW.loadPage_pagination;
			t.cpPager = new t.Cpager(0, 0);
			t.cpPager.oldStyle = true;

			uWExportFunction("oldctrlPagination", PageNavigator.ctrlPaginationOld);
			uWExportFunction("newctrlPagination", PageNavigator.ctrlPagination);
			uWExportFunction("oldloadPage_pagination", PageNavigator.loadPage_paginationOld);
			uWExportFunction("newloadPage_pagination", PageNavigator.loadPage_pagination);

			t.enable(Options.fixPageNav);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	// called on 'back' ...
	loadPage_pagination: function (divId, currentPage, callbackFunction, totalPages) {
		var t = PageNavigator;
		var curPage = parseInt(currentPage);
		if (divId == t.cpPager.divId) // if 'old' style ...
			uW[callbackFunction](t.cpPager.getCurrentPage());
		else
			uW[callbackFunction](currentPage);
	},
	ctrlPagination: function (navDivId, numPages, notify, curPage) {
		var t = PageNavigator;
		if (ById(navDivId).firstChild == null)
			ById(navDivId).appendChild(t.cpPager.getHtmlElement());
		t.cpPager.setPageCount(numPages);
		t.cpPager.divId = navDivId;
		if (!curPage)
			curPage = 1;
		t.cpPager.gotoPage(curPage);
		t.cpPager.onClick = uW[notify];
		if (typeof createObjectIn == 'function') {
			var newobj = createObjectIn(uW,{defineAs: 'cpPager'});
			exportFunction(t.cpPager.getHtmlElement,newobj,{defineAs:'getHtmlElement'});
			exportFunction(t.cpPager.setPageCount,newobj,{defineAs:'setPageCount'});
			exportFunction(t.cpPager.getPageCount,newobj,{defineAs:'getPageCount'});
			exportFunction(t.cpPager.getCurrentPage,newobj,{defineAs:'getCurrentPage'});
			exportFunction(t.cpPager.gotoPage,newobj,{defineAs:'gotoPage'});
			exportFunction(t.cpPager.e_but,newobj,{defineAs:'e_but'});
			exportFunction(t.cpPager.e_inp,newobj,{defineAs:'e_inp'});
			exportFunction(t.cpPager.onClick,newobj,{defineAs:'onClick'});

			newobj.numPages = t.cpPager.numPages;
			newobj.curPage = t.cpPager.curPage;
			newobj.oldStyle = t.cpPager.oldStyle;
			newobj.divId = t.cpPager.divId;

			uW.pageNavigatorView = newobj;
		}
		else {
			uW.pageNavigatorView = t.cpPager;
		}
	},
	enable: function (tf) {
		var t = PageNavigator;
		t.modalMessagesFunc.setEnable(tf);
		if (tf) {
			uW.ctrlPagination = uW.newctrlPagination;
			uW.loadPage_pagination = uW.newloadPage_pagination;
		} else {
			uW.ctrlPagination = uW.oldctrlPagination;
			uW.loadPage_pagination = uW.oldloadPage_pagination;
		}
	},
	isAvailable: function () {
		var t = PageNavigator;
		return t.modalMessagesFunc.isAvailable();
	},
	ConstructCPager : function (a, b) {
		var t = PageNavigator;
		var localobj = new t.Cpager(a, b);
		localobj.onClick = function(a) { uW.pageNavigatorController.onClick(a); }

		if (typeof createObjectIn == 'function') {
			var newobj = createObjectIn(uW,{defineAs: 'ptPagerObj'});
			exportFunction(localobj.getHtmlElement,newobj,{defineAs:'getHtmlElement'});
			exportFunction(localobj.setPageCount,newobj,{defineAs:'setPageCount'});
			exportFunction(localobj.getPageCount,newobj,{defineAs:'getPageCount'});
			exportFunction(localobj.getCurrentPage,newobj,{defineAs:'getCurrentPage'});
			exportFunction(localobj.gotoPage,newobj,{defineAs:'gotoPage'});
			exportFunction(localobj.e_but,newobj,{defineAs:'e_but'});
			exportFunction(localobj.e_inp,newobj,{defineAs:'e_inp'});
			exportFunction(localobj.onClick,newobj,{defineAs:'onClick'});

			newobj.numPages = t.cpPager.numPages;
			newobj.curPage = t.cpPager.curPage;
			newobj.oldStyle = t.cpPager.oldStyle;

			return newobj;
		}
		else {
			return localobj;
		}
	},
	Cpager: function (a, b) {
		// public function protos ...
		this.getHtmlElement = getHtmlElement;
		this.setPageCount = setPageCount;
		this.getPageCount = getPageCount;
		this.getCurrentPage = getCurrentPage;
		this.gotoPage = gotoPage;
		this.e_but = e_but;
		this.e_inp = e_inp;
		//
		var t = this;
		this.onClick = null;
		this.numPages = b;
		this.curPage = a;
		this.oldStyle = false;

		function getHtmlElement() {
			function aButton(msg, evtPage) {
				return '<A class=ptPageNav onclick="pageNavigatorView.e_but(\'' + evtPage + '\')"><SPAN class=ptPageNav>' + msg + '</span></a>';
			}
			var div = document.createElement('div');
			div.id = 'ptPageNavBar';
			div.innerHTML = '<STYLE>table.ptPageNav tr td {background:inherit; border:none; text-align:center; padding:0px 1px;}\
		span.ptPageNav {font-size:12px; background:inherit; line-height:135%}\
		A.ptPageNav {background-color:#44e; color:#ff4; display:block; border:1px solid #666666; height:18px; width:18px;}\
		A.ptPageNav:hover {background-color:#66f;}\
		A.ptPageNav:active {background-color:#186}\
		</style>\
		<TABLE class=ptPageNav><TR valign=middle>\
		<TD style="margin-right:15px">' + aButton('<SPAN style="padding-left:0.2em;letter-spacing:-0.99em;vertical-align:middle;">&#x258f;&#x258f;</span><span>&#x25c4;</span>', 'F') + '</td>\
		<TD>' + aButton('&#x25c4', '-') + '</td>\
		<TD>' + aButton('&#x25ba', '+') + '</td>\
		<TD style="margin-right:15px">' + aButton('<SPAN style="margin-left:-0.3em;margin-right:-0.2em;">&#x25ba;</SPAN><SPAN style="letter-spacing:-0.99em;vertical-align:middle;">&#x258f;&#x258f;</span>', 'L') + '</td>\
		<TD width=10>&nbsp;</td><TD>'+tx('Page')+'&nbsp;<INPUT id=ptPagerPageNum onChange="pageNavigatorView.e_inp()" type=text size=1>&nbsp;'+tx('of')+'&nbsp;<span id=ptPagerNumPages>?</span></td>\
		</tr></table>';
			var mml = ById('modal_msg_list');
			if (mml != null)
				mml.style.minHeight = '400px';
			return div;
		}

		function getPageCount() { // koc needs for 'back'
			return t.numPages;
		}

		function getCurrentPage() { // koc needs for 'back'
			return t.curPage;
		}

		function setPageCount(c) {
			t.numPages = c;
			ById('ptPagerNumPages').innerHTML = c;
			var mml = ById('modal_msg_list');
			if (mml != null) {
				if (ById('modal_msg_tabs_report').className.indexOf('selected') >= 0)
					mml.style.minHeight = '460px';
				else
					mml.style.minHeight = '400px';
			}
		}

		function gotoPage(p) {
			t.curPage = parseIntZero(p);
			ById('ptPagerPageNum').value = t.curPage;
		}

		function e_but(p) {
			if (p == 'F' && t.curPage != 1)
				loadPage(1);
			else if (p == '-' && t.curPage > 1)
				loadPage(t.curPage - 1);
			else if (p == '+' && t.curPage < t.numPages)
				loadPage(t.curPage + 1);
			else if (p == 'L' && t.curPage != t.numPages)
				loadPage(t.numPages);

			function loadPage(p) {
				if (t.oldStyle)
					t.gotoPage(p);
				t.onClick(p);
			}
		}

		function e_inp(p) {
			var pageNum = parseIntZero(ById('ptPagerPageNum').value);
			t.onClick(pageNum);
		}
	},
};

var TowerAlerts = {
	viewImpendingFunc: null,
	fixTargetEnabled: false,
	init: function () {
		var t = TowerAlerts;

		try {
			t.viewImpendingFunc = new CalterUwFunc('attack_viewimpending_view', [
				[/Modal.showModal\((.*)\)/im, 'Modal.showModal\($1\); ptViewImpending_hook(a);']
			]);
			uWExportFunction('ptViewImpending_hook', t.viewImpending_hook);
			t.viewImpendingFunc.setEnable(true);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	// fix 'target'
	viewImpending_hook: function (atkinc) {
		var t = TowerAlerts;
		var div = ById('modal_attackimpending_view');
		var isFalse = false;
		if (t.fixTargetEnabled) {
			var city = Cities.byID[atkinc.toCityId];
			var target = '';
			if (!city || (atkinc.marchType != 3 && atkinc.marchType != 4)) {
				target = '<B>'+tx('FALSE REPORT')+'!</b>';
				isFalse = true;
			} else if (city.tileId == atkinc.toTileId) {
				target = city.name + ' (' + city.x + ',' + city.y + ')';
			} else {
				wilds = Seed.wilderness['city' + atkinc.toCityId];
				m = '';
				for (var k in wilds) {
					if (wilds[k].tileId == atkinc.toTileId) {
						m = 'at ' + wilds[k].xCoord + ',' + wilds[k].yCoord;
						break;
					}
				}
				target = city.name + ', <B>'+tx('WILD')+' ' + m + '</b>';
			}
			div.childNodes[0].innerHTML = '<B>'+tx('Target')+': </b>' + target;
		}
	},
	enableFixTarget: function (tf) {
		var t = TowerAlerts;
		t.fixTargetEnabled = tf;
	},
	isFixTargetAvailable: function () {
		var t = TowerAlerts;
		return t.viewImpendingFunc.isAvailable();
	},
}

var CoordBox = {
	MapZoom : Boolean,
	init: function () {
		var t = CoordBox;
		uWExportFunction('btToggleMapZoom', CoordBox.ToggleMapZoom);
		t.MapZoom = false;
		t.boxDiv = searchDOM(ById('maparea_map'), 'node.className=="mod_coord"', 3, false);
		t.boxDiv.id = 'btCoordsBox';
		t.setEnable(Options.mapCoordsTop);

		var newdiv = document.createElement('div');
		newdiv.id = 'btZoom';
		newdiv.innerHTML = '<div style="text-align:center;font-size:11px"><a id=btZoomLink onclick="btToggleMapZoom();">'+tx('Zoom Out')+'</a></div>';
		jQuery("#btCoordsBox > div:first").after(newdiv);
	},
	setEnable: function (tf) {
		var t = CoordBox;
		if (t.boxDiv == null)
			return;
		if (tf)
			t.boxDiv.style.zIndex = '100000';
		else
			t.boxDiv.style.zIndex = '10011';
	},
	isAvailable: function () {
		var t = CoordBox;
		return !(t.boxDiv == null);
	},

	ToggleMapZoom : function () {
		var t = CoordBox;
		t.MapZoom = !t.MapZoom;
		uW.g_mapObject.setCenterSlot();
		if (t.MapZoom) {
			uW.g_mapObject.vpxmultiplier = 30;
			uW.g_mapObject.hpxmultiplier = 50;
			var style = document.createElement('style');
			style.id = 'btMapZoomStyle';
			style.innerHTML = '\
				.map1 .slot {width:50px !important;height:30px !important; background-size:cover !important;}\
				.map1 .slot.PrestigeCity_4, .map1 .slot.PrestigeCity_5, .map1 .slot.PrestigeCity_6 {background-position: -50px 0px !important;}\
				.map1 .slot.PrestigeCity_7, .map1 .slot.PrestigeCity_8, .map1 .slot.PrestigeCity_9, .map1 .slot.PrestigeCity_10, \
				.map1 .slot.PrestigeCity_11, .map1 .slot.PrestigeCity_12, .map1 .slot.PrestigeCity_13, .map1 .slot.PrestigeCity_14, .map1 .slot.PrestigeCity_15 {background-position: -100px 0px !important;}\
				.map1 .slot.shield span {left:-18px !important; top:-6px !important; background-size:15% !important;}\
				.map1 .slot.sword span {left:-18px !important; top:-6px !important; background-size:15% !important;}\
				.map1 .slot.mapcastle span {width:16px !important; height:16px !important; left:20px !important; padding-top:5px !important; font-size:7px !important; background-size:16px !important;}';

			ById('btZoom').appendChild(style);
			ById('btZoomLink').innerHTML = tx('Zoom In');
		}
		else {
			uW.g_mapObject.vpxmultiplier = 58;
			uW.g_mapObject.hpxmultiplier = 96;
			jQuery('#btMapZoomStyle').remove();
			ById('btZoomLink').innerHTML = tx('Zoom Out');
		}
		uW.g_mapObject.setPosition();
		uW.g_mapObject.getMoreSlots();
	},
};

var cdtd = {
	views: null,
	oldupdate_citylist: null,
	newupdate_citylist: null,
	init: function () {
		var t = cdtd;

		try {
			if (typeof uW.watch == 'function') {
				uW.watch("update_citylist",function(c,a,b){return b;}); // palemoon 'unwatch' doesn't work
			}
			if (typeof uW.unwatch == 'function') {
				uW.unwatch("update_citylist"); // naughty RockYou!
			}

			uWExportFunction('ptcheckascension', cdtd.checkascension);
			uWExportFunction('ptgetchampstatus', cdtd.getchampstatus);
			uWExportFunction('cdtdhook', cdtd.citychange);

			var z = new CalterUwFunc("showCityTooltip",[
				[/showTooltip/,'a += "<div>"+g_js_strings.guardian[seed.guardian[j].type+"_fullName"]+"</div><div>" + ptgetchampstatus(seed.cities[j][0])+"</div>";showTooltip'],
				['g_js_strings.showPopTooltip.currpop','provincenames[\'p\'+seed.cities[j][4]] + "</div><div>" + ptcheckascension(seed.cities[j][0]) + g_js_strings.showPopTooltip.currpop']
			]);
			z.setEnable(true);

			t.views = new CalterUwFunc("citysel_click", [
				[/cm\.PrestigeCityView\.render\(\)/im, 'cm.PrestigeCityView.render();cdtdhook();']
			]);

			if (Options.EnhCBtns) {
				t.views.setEnable(true);
				t.oldupdate_citylist = uW.update_citylist;
				t.newupdate_citylist = function () {
					cdtd.oldupdate_citylist();
					cdtd.drawdefendstatus();
					if (Options.ColrCityBtns) cdtd.drawfactioncolors();
				};
				uWExportFunction('newupdate_citylist',cdtd.newupdate_citylist);
				uW.update_citylist = uW.newupdate_citylist;
				t.drawdefendstatus();
			};
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	citychange: function () {
		cdtd.drawdefendstatus();
		Tabs.Options.checkAscension(); // ascension expiry tied into enhanced city buttons
	},
	drawdefendstatus: function () {
		var t = cdtd;
		for (var i = 0; i < uW.seed.cities.length; i++) {
			var cityidx = i + 1;
			var city = ById('citysel_' + cityidx);
			if (!city) {
				setTimeout(t.drawdefendstatus, 100);
				return;
			}
			var cityId = uW.seed.cities[i][0];
			var color = 'blue';
			if (uW.seed.citystats['city'+cityId].gate != 0) { color = 'red'; }
			if (Tabs.PortalTime && ((Options.PortOptions.PortCities && Options.PortOptions.PortCities[Cities.byID[cityId].idx+1]==true) || (Options.PortOptions.PortCity && cityId==Options.PortOptions.PortCity)) && Options.PortOptions.Running) { color = 'cyan'; }
			city.style.color = color;
			city.style.border = '2px inset '+color;
			city.style.display = 'inline';
			city.style.width = 10 + '%';
			if (Options.DbClkDefBtns && SelectiveDefending) {
				city.ondblclick = function () {
					t.setdefendstatus(this.name);
				};
			}
		}
	},
	setdefendstatus: function (city) {
		var t = cdtd;
		var state = 1;
		if (uW.seed.citystats["city" + city].gate != 0)
			state = 0;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = city;
		params.state = state;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/gate.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					uW.seed.citystats["city" + city].gate = state;
					t.drawdefendstatus();
				}
			},
			onFailure: function () {
				t.drawdefendstatus();
			},
		},true);
	},

	drawfactioncolors: function () {
		var t = cdtd;
		for (var i = 0; i < uW.seed.cities.length; i++) {
			color = "black";
			var ascended = getAscensionValues(uW.seed.cities[i][0]);
			if (ascended.isPrestigeCity) {
				switch (parseIntNan(ascended.prestigeType)) {
					case 1: color = "#228b22"; break;
					case 2: color = "#A944DB"; break;
					case 3:	color = "#E36600"; break;
				}
			}
			ById('mod_citylist').children[i].innerHTML = "<SPAN><FONT fontFamily='georgia,?arial,?sans-serif' font-weight=700 font-size=10px color=" + color + ">" + uW.roman[i] + "</font></span>";
		}
	},
	checkascension : function(id) {
		var str = ""
		var protection = CM.PrestigeCityPlayerProtectionController.isActive(id);
		if (protection) {
			str += "<b>"+tx('Ascension Protection')+": "+uW.timestr(CM.PrestigeCityPlayerProtectionController.getTimeLeft(id),false)+"</b></div><div>";
		}
		var ascended = getAscensionValues(id);
		var canAscend = true;
		if (ascended.isPrestigeCity) {
			var MaxLevel = CM.PrestigeModel.getLevelCapSoft(ascended.prestigeType);
			canAscend = (MaxLevel>parseIntNan(ascended.prestigeLevel));
		}
		if (Options.BuildOptions && Options.BuildOptions.AscendRunning) {
			if (protection && !canAscend) { str += '<span class=boldRed>'+tx("Maximum Ascension Level")+"!</span></div><div>"; }
			else if (Options.BuildOptions.AscendEnabled[Cities.byID[id].idx+1]) { str += '<span class=boldMagenta>'+tx("Auto-Ascend Enabled")+"!</span></div><div>"; }
		}
		return str;
	},
	getchampstatus : function(id) {
		var citychamp;
		var ChampText = uW.g_js_strings.champ.no_champ+"!";
		var gotchamp = false;
		citychamp = getCityChampion(id);
		if (citychamp.championId) {
			gotchamp = true;
			var champname = citychamp.name;
			var champstatus = citychamp.status;
			if (champstatus != "10") {
				ChampText = champname + ' ('+tx('Defending')+')';
			}
			else {
				ChampText = champname + ' ('+tx('Marching')+')';
			}
		}
		if (gotchamp) {
			return '<table cellspacing=0><tr><td class="xtab"><img height=14 src="'+ChampImagePrefix+citychamp.avatarId+ChampImageSuffix+'"></td><td class=xtab>'+ChampText+'</td></tr></table>';
		}
		else {
			return '<table cellspacing=0><tr><td class="xtab">'+ChampText+'</td></tr></table>';
		}
	},
}

var LoadCapFix = {
	init: function () {
		var t = LoadCapFix;
		try {
			if (!NoRegEx) {
				t.capLoadEffect = new CalterUwFunc('cm.MarchModal.updateTroopResource', [
					[/\$\("#modal/ig, 'jQuery("#modal'],
					[/if\(jQuery/i, 'loadBoost = Math.min(loadBoost,(cm.thronestats.boosts.Load.Max/100)+techLoadBoost); for(var sacIndex = 0; sacIndex < seed.queue_sacr["city" + currentcityid].length; sacIndex ++ ) if(seed.queue_sacr["city" + currentcityid][sacIndex]["unitType"] == untid) unit_number *= seed.queue_sacr["city" + currentcityid][sacIndex]["multiplier"][0]; if(jQuery'],
					[/var\s*resources/i, 'load=load-1;var resources']
				]);
			}
			else {
				t.capLoadEffect = new CalterUwFunc('cm.MarchModal.updateTroopResource', [
					[/\$\("#modal/ig, 'jQuery("#modal'],
					['if (jQuery', 'loadBoost = Math.min(loadBoost,(cm.thronestats.boosts.Load.Max/100)+techLoadBoost); for(var sacIndex = 0; sacIndex < seed.queue_sacr["city" + currentcityid].length; sacIndex ++ ) if(seed.queue_sacr["city" + currentcityid][sacIndex]["unitType"] == untid) unit_number *= seed.queue_sacr["city" + currentcityid][sacIndex]["multiplier"][0]; if(jQuery'],
					['var resources', 'load=load-1;var resources']
				]);
			}
			t.capLoadEffect.setEnable(Options.fixLoadCap);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = LoadCapFix;
		t.capLoadEffect.setEnable(tf);
	},
	isAvailable: function () {
		var t = LoadCapFix;
		return t.capLoadEffect.isAvailable();
	},
}

var TRAetherCostFix = {
	aethercostFix: null,
	init: function () {
		t = TRAetherCostFix;

		try {
			t.aethercostFix = new CalterUwFunc('cm.ThronePanelController.calcCost', [
				[/if\(k\(/im, 'if(cm.ThronePanelController.isLastLevel('],
				[/E\.stones\.use\s*=\s*E\.stones\.total/im, 'E.stones.use = B'],
				[/if\(E\.stones\.use\s*==/im, 'if(E.stones.use >='],
				[/E\.gems\.use\s*=\s*b\(E\.stones\.total\s*-\s*B\)/im, 'var xx = + (cm.WorldSettings.getSetting("TR_AETHERSTONE_CONVERSION_COST")), y; E.gems.use = Math.ceil((E.stones.total - B)/xx)'],
				[/E\.gems\.use\s*=\s*b\(z\[D]\.Stones\)/im, 'var xx = + (cm.WorldSettings.getSetting("TR_AETHERSTONE_CONVERSION_COST")), y; E.gems.use = Math.ceil((z[D].Stones)/xx)'],
			]);
			t.aethercostFix.setEnable(Options.fixTRAetherCost);
			if (NoRegEx) {
				t.aethercostFixCB = new CalterUwFunc('cm.ThronePanelController.calcCost', [
					[/if\s*\(k\(/im, 'if(cm.ThronePanelController.isLastLevel('], //fix for cometbird
					[/if\s*\(E\.stones\.use\s*==/im, 'if(E.stones.use >=']
				]); //fix for cometbird
				t.aethercostFixCB.setEnable(Options.fixTRAetherCost);
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = TRAetherCostFix;
		t.aethercostFix.setEnable(tf);
		if (NoRegEx) {
			t.aethercostFixCB.setEnable(tf);
		}
	},
	isAvailable: function () {
		var t = TRAetherCostFix;
		if (!NoRegEx) {
			return t.aethercostFix.isAvailable();
		}
		else {
			return (t.aethercostFix.isAvailable() && t.aethercostFixCB.isAvailable());
		}
	},
}
var mmbImageFix = {
	imageFix: null,
	init: function () {
		t = mmbImageFix;

		try {
			t.imageFix = new CalterUwFunc('cm.mww.mmb_share', [
				[/img\/items\/130/im, 'img/items/70/'],
				[/common_postToProfile\(\"85\"/im, 'template_data_85.img1=template_data_85.media[0].src; common_postToProfile(\"85\"']
			]);
			t.imageFix.setEnable(Options.fixMMBImage);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = mmbImageFix;
		t.imageFix.setEnable(tf);
	},
	isAvailable: function () {
		var t = mmbImageFix;
		return t.imageFix.isAvailable();
	},
}

/** Global march function **/

var March = {
	tt				: null,
	currentrequests	: 0,
	maxrequests		: 3,
	queue			: [],
	waittime		: 0,
	waitwarning		: false,

	addMarch : function (params, callback, forcemarch){
		var t = March;
		var opts = {params:params, callback:callback};
		if(t.currentrequests < t.maxrequests || forcemarch){
			t.sendMarch(opts.params, opts.callback);
		} else {
			t.queue.push(opts);
			actionLog(t.getMarchType(opts.params.type)+' added to march queue. Queue now contains '+ t.getQueueLength() +' marches.','MARCH');
		}
	},

	loop : function (){
		var t = March;
		if(t.currentrequests < t.maxrequests){
			var opts = t.queue.shift();
			if(opts) {
				t.sendMarch(opts.params, opts.callback);
				actionLog(t.getMarchType(opts.params.type)+' triggered from march queue. Queue now contains '+ t.getQueueLength() +' marches.','MARCH');
			}
		}
	},

	getMarchType : function (mt){
		switch (parseIntNan(mt)) {
			case 1: return 'Transport';
			case 2: return 'Reinforcement';
			case 3: return 'Scout';
			case 4: return 'Attack';
			case 5: return 'Reassign';
			default: return 'March';
		}
	},

	getQueueLength : function (){
		var t = March;
		return t.queue.length;
	},

	RallyPoint : function (cityId){
		var t = March;
		var ret = {};
		ret.level = t.getRallypointLevel(cityId);
		ret.maxSlots = t.getTotalSlots(cityId);
		ret.marching = t.getMarchSlots(cityId);
		ret.emptySlots = t.getEmptySlots(cityId);
		ret.maxSize = t.getMaxSize(cityId,''); // assume no items
		return ret;
	},

	getRallypointLevel : function (cityId){
		var t = March;
		cityId = "city"+cityId;
		rallypointlevel = 0;
		for (var o in Seed.buildings[cityId]){
			var buildingType = parseInt(Seed.buildings[cityId][o][0]);
			var buildingLevel = parseInt(Seed.buildings[cityId][o][1]);
			if (buildingType == 12) {
				rallypointlevel=parseInt(buildingLevel);
				break;
			}
		}
		return rallypointlevel;
	},

	getTotalSlots : function (cityId){
		var t = March;
		var ascended = getAscensionValues(cityId);
		var rallypointlevel = t.getRallypointLevel(cityId);
		var slots = rallypointlevel; //Set default number of slots to rallypointlevel
		if(slots >= 13)slots = 12;// a level 13 and above rallypoint only allows for 12 marches.
		if(ascended.isPrestigeCity){
			slots +=3;
		}
		return slots;
	},

	getMarchSlots : function (cityId){
		var t = March;
		cityId = "city"+cityId;
		var slots=0;
		var now = unixTime();
		if (Seed.queue_atkp[cityId] != undefined && Seed.queue_atkp[cityId] != []){
			for(var k in Seed.queue_atkp[cityId]){
				var m = Seed.queue_atkp[cityId][k];
				if(m.marchType == 9) {
					if(m.botMarchStatus < 3 || m.botMarchStatus > 9)slots++; //If raid is stopped take it as empty slot
				} else {
					if ((m.returnUnixTime > now) || m.marchStatus == 2){ // count encamped marches!
						slots++;
					}
				}
			}
		} else {
			slots=0;
		}
		return slots;
	},

	getEmptySlots : function (cityId){
		var t = March;
		var slots = t.getTotalSlots(cityId);
		slots -= t.getMarchSlots(cityId);
		if(slots < 0) slots = 0;
		return slots;
	},

	getMaxSize : function (cityId,items){
		var t = March;
		var rallypointlevel = getUniqueCityBuilding(cityId, 12).maxLevel;
		var ascended = getAscensionValues(cityId);
		var buff = 1;
		var max = 0;
		var now = unixTime();

		var Conquest = false;
		var Command = false;
		var koth = false;
		var iused = null;
		if (items) { iused = items.split(","); }
		if (iused) {
			for (var i = 0; i < iused.length; i++) {
				if (iused[i] == 931) { Command = true; }
				if (iused[i] == 932) { Conquest = true; }
			}
		}

		if (Conquest) { buff = 1.5; }
		else { if (Command) { buff = 1.25; }};

		// timed auras take priority

		if (Seed.playerEffects.auras2Expire && Seed.playerEffects.auras2Expire > now) { buff = 1.3 }
		else {
			if (Seed.playerEffects.aurasExpire && Seed.playerEffects.aurasExpire > now) { buff = 1.15 }
		}

		var tr = Math.floor(equippedthronestats(66));
		if (tr > uW.cm.thronestats.boosts.MarchSize.Max) { tr=uW.cm.thronestats.boosts.MarchSize.Max; }
		if (tr > 0) { buff *= (1 + tr / 100); }

		if(ascended.isPrestigeCity){
			var b = ascended.prestigeLevel;
			var r = CM.WorldSettings.getSetting("ASCENSION_RALLYPOINT_BOOST");
			var m = JSON.parse(r);
			var u = 1;
			if (m.values[b-1]) {
				u = m.values[b-1][1];
			}
			var k = parseFloat(u);
			buff *= k
			if (uW.seed.cityData.city[cityId].prestigeInfo.blessings.indexOf(207) != -1) { buff *= 1.1; }
		}
		if (koth) max=1;
		switch(rallypointlevel){
			case 11:
				max = 150000 * buff;
				break;
			case 12:
				max = 200000 * buff;
				break;
			case 13:
				max = 215000 * buff;
				break;
			case 14:
				max = 250000 * buff;
				break;
			case 15:
				max = 275000 * buff;
				break;
			default:
				max = (rallypointlevel * 10000) * buff;
				break;
		}
		return Math.floor(max+0.0001);
	},

	getMarchTime : function (cityId,unit_types,distance,spell_type,phoenix_wings_used,thunder_wings_used,red_wings_used,green_wings_used,koth) {
		var speed = 99999;
		var speedfriend = 99999;
		var unitsfound = false;
		var QualifyAU = false;
		var QualifyFF = false;
		var QualifyGW = false;

		for (var ui in unit_types) {
			unitsfound = true;
			i = unit_types[ui];
			var troop_speed = parseInt(uW.unitstats["unt" + i][3]);
			troop_speed *= (1 + 0.1 * parseInt(Seed.tech.tch11));
			for (var sacIndex = 0; sacIndex < Seed.queue_sacr["city" + cityId].length; sacIndex++) {
				if (Seed.queue_sacr["city" + cityId][sacIndex]["unitType"] == i) {
					troop_speed *= Seed.queue_sacr["city" + cityId][sacIndex]["multiplier"][0]
				}
			}
			if (spell_type=='31' && CM.attack_modal.isUnitSiege(i)) { troop_speed *= 2; }
			if (CM.unitHorsedBenefit[i]) { troop_speed = troop_speed * (1 + 0.05 * parseInt(Seed.tech.tch12)); }
			else {
				troop_speed *= (1 + 0.05 * (parseInt(Seed.tech2.tch1) || 0));
				troop_speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().BLOOD_LUST, cityId, uWCloneInto({ speed : true	}));
			}
			if (troop_speed < speed) { speed = troop_speed; }

			if (!koth) {
				if (i==14 || i==37) { QualifyAU = true; }
				if (i==13 || uW.spellCasterUnits["unt"+i]) { QualifyFF = true; }
				if (i==11 || i==36) { QualifyGW = true; }
			}
		}

		speedfriend = speed;
		speedfriend *= 1 + (getUniqueCityBuilding (cityId, 18).maxLevel/2);

		speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().FILL_THE_RANKS, cityId, uWCloneInto({ marchspeed : true }));
		speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().REDUCE_FATIGUE, cityId, uWCloneInto({}));
		if (QualifyAU) { speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().AGGRESSIVE_URGE, cityId, uWCloneInto({})); }
		if (QualifyFF) { speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().FLASH_FEET, cityId, uWCloneInto({})); }
		if (QualifyGW) { speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().GREASED_WHEELS, cityId, uWCloneInto({})); }

		speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().FILL_THE_RANKS, cityId, uWCloneInto({ marchspeed : true }));
		speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().REDUCE_FATIGUE, cityId, uWCloneInto({}));
		if (QualifyAU) { speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().AGGRESSIVE_URGE, cityId, uWCloneInto({})); }
		if (QualifyFF) { speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().FLASH_FEET, cityId, uWCloneInto({})); }
		if (QualifyGW) { speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().GREASED_WHEELS, cityId, uWCloneInto({})); }

		if (!koth) {
			trMarchAllSpeed = CM.ThroneController.getBoundedEffect(67);
			trAttackSpeed = CM.ThroneController.getBoundedEffect(68);
			trReinforceSpeed = CM.ThroneController.getBoundedEffect(69);
			trTransportSpeed = CM.ThroneController.getBoundedEffect(70);
			trReassignSpeed = CM.ThroneController.getBoundedEffect(71);
			trScoutSpeed = CM.ThroneController.getBoundedEffect(72);
			var throneBoost = trMarchAllSpeed + trAttackSpeed;
			var throneBoostFriend = trMarchAllSpeed + Math.min(trReinforceSpeed,trTransportSpeed);
			speed = speed * (1 + (throneBoost * 0.01))
			speedfriend = speedfriend * (1 + (throneBoostFriend * 0.01))
		}
		var gi = CM.guardianModalModel.getMarchBonus();
		var multiplier = 1 + (gi * 0.01);
		speed = speed * multiplier
		speedfriend = speedfriend * multiplier
		if (0 == speed || 0 == distance) {
			return {friend:0,foe:0,speedfriend:speedfriend,speed:speed};
		}
		var time = 0;
		var timefriend = 0;
		if (unitsfound) {
			if (speed > 0) { time = Math.ceil(parseFloat(distance) * 6000 / speed); }
			if (speedfriend > 0) { timefriend = Math.ceil(parseFloat(distance) * 6000 / speedfriend); }

			var wings_used = red_wings_used || green_wings_used;
			var delay = CM.WorldSettings.isOn("MARCH_SINGLE_TRIP_DELAY") ? parseInt(uW.g_marchSingleTripDelay) : 0;
			time += delay;
			timefriend += delay;

			if (phoenix_wings_used) {
				time = parseInt(time * 0.1);
				timefriend = parseInt(timefriend * 0.1);
			} else {
				if (thunder_wings_used) {
					time = parseInt(time * 0.25);
					timefriend = parseInt(timefriend * 0.25);
				} else {
					if (red_wings_used) {
						time = parseInt(time * 0.5);
						timefriend = parseInt(timefriend * 0.5);
					} else {
						if (green_wings_used) {
							time = parseInt(time * 0.75);
							timefriend = parseInt(timefriend * 0.75);
						}
					}
				}
			}

			if (Seed.playerEffects.returnExpire > uW.unixtime()) {
				time = parseInt(time * 0.75);
				timefriend = parseInt(timefriend * 0.75);
			}
			if (spell_type=='11') {
				time *= 0.01;
				timefriend *= 0.01;
			}

			time = Math.ceil(time < 30 ? 30 : time);
			timefriend = Math.ceil(timefriend < 30 ? 30 : timefriend);
		}
		return {friend:timefriend,foe:time,speedfriend:speedfriend,speed:speed};
	},

	sendMarch : function (params, callback){
		var t = March;

		if(March.waittime > uW.unixtime()){
			if (March.waitwarning) {
				actionLog('Marches suspended to deal with march Captcha','MARCH');
				March.waitwarning = false;
			}
			if (callback) callback({msg:"Marches suspended to deal with march Captcha"});
			return;
		};
		//need to check that march is not oversized!
		var maxsize = March.getMaxSize(params.cid, params.items);
		var x = 0;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var y = eval('params.u'+i);
			if (matTypeof(y)== 'number') { x+=y; }
		}
		if(maxsize < x) {
			actionLog(Cities.byID[params.cid].name+': Attempted to send march size '+x+' - max allowed is '+maxsize,'MARCH');
			if (callback) callback({msg:"Maximum Troops Exceeded"});
			return;
		}
		t.currentrequests++;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/march.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {try{
				--t.currentrequests;
				if (t.currentrequests<0) t.currentrequests=0;
				setTimeout(March.loop, 3000); //Always check for the next queued march 3 seconds after a request
				CM.MarchModal.setBackedOff(false);
				if (rslt.ok) {
					if (rslt.bsEndDate) {
						Seed.cityData.city[params.cid].spells = uWCloneInto({});
						Seed.cityData.city[params.cid].spells[params.bs] = uWCloneInto({endDate : rslt.bsEndDate});
					}
					if (params.champid && params.champid != 0) {
						var championidx = "";
						for (var i = 0; i < Seed.champion.champions.length; i++) {
							if (Seed.champion.champions[i].championId == params.champid) championidx = i;
						}
						// update seed immediately
						Seed.champion.champions[championidx].status = "10";
					}
					var timediff = parseInt(rslt.eta) - parseInt(rslt.initTS);
					var rtimediff = parseInt(rslt.returnTS) - parseInt(rslt.initTS);
					var ut = uW.unixtime();
					var unitsarr = {};
					for (var ui in CM.UNIT_TYPES){
						i = CM.UNIT_TYPES[ui];
						if (params["u" + i])
							unitsarr[i] = params["u" + i];
						else
							unitsarr[i] = 0;
					}
					var resources = new Array();
					resources[0] = params.gold;
					for (var i = 1; i <= 5; i++) {
						resources[i] = params["r" + i];
					}
					uW.attach_addoutgoingmarch(rslt.marchId, rslt.marchUnixTime, ut + timediff, params.xcoord, params.ycoord, uWCloneInto(unitsarr), params.type, params.kid, uWCloneInto(resources), rslt.tileId, rslt.tileType, rslt.tileLevel, params.cid, true, ut + rtimediff);
					if (params.items && params.items != "") {
						var iused = params.items.split(",");
						for (var i = 0; i < iused.length; i++) {
							Seed.items["i" + iused[i]] = parseInt(Seed.items["i" + iused[i]]) - 1;
							uW.ksoItems[iused[i]].subtract();
						}
					}
					uW.updateBoosts(uWCloneInto(rslt));
					if (rslt.liftFog) {
						Seed.playerEffects.fogExpire = 0;
						uW.g_mapObject.getMoreSlots();
						uW.update_boosts();
						if (Options.AutoMistMarch && uW.ksoItems[10021].count>0) {
							CM.ItemController.usePotionOfMist('10021');
							actionLog('Automatically applying Potion of Mist','MARCH');
						}
					}

					if (Tabs.Megalith && params.type==4) { Tabs.Megalith.CheckAddAttackTime(params.xcoord,params.ycoord,rslt.marchUnixTime); }

					if (callback) { callback(rslt); }
				} else {
					if (rslt.user_action) {
						actionLog('March Error: Server Response - '+rslt.user_action,'MARCH');
						if (rslt.user_action == "backOffWaitTime") {
							CM.MarchModal.setBackedOff(true);
							if (rslt.tt) { params.tt = rslt.tt; }
							var wait = 2;
							if (rslt.wait_time) { wait = rslt.wait_time; }
							setTimeout (t.sendMarch, wait*1000, params, callback); // retry march after wait time
							return;
						}
						if (rslt.user_action == "marchWarning" || rslt.user_action == "marchCaptcha") { // send captcha through here now (no more captcha - it doesn't work anyway)
							March.waittime = Number(uW.unixtime()+120); // suspend marches for 2 mins
							March.waitwarning = true;
							rslt.msg = uW.g_js_strings.modal_attack.useractionwarningmessage;
						}
					}

					var msg = '';
					var g = Number(rslt.error_code);
					switch (g) {
						case 0: msg = tx("Unexpected Error"); break; // unexpected error
						case 8:	msg = tx("Excess Traffic"); CM.GATracker("Error", "Excess traffic. ("+g+")", uW.g_server); break;
						case 3: msg = tx("Game out of Sync"); break; //game out of sync
						case 4: msg = tx("You have insufficient units"); break; //not enough units
						case 104: msg = uW.g_js_strings.errorcode.err_104; break; //unable to attack target
						case 208: msg = uW.g_js_strings.errorcode.err_208; break; // beginner protection
						case 210: msg = uW.g_js_strings.errorcode.err_210; break; // Max marches
						case 212:
							if (Seed.knights['city'+params.cid]['knt'+params.kid])
								Seed.knights['city'+params.cid]['knt'+params.kid].knightStatus = 10; //remove knight from list, set to 1 to make available again.
							msg = uW.g_js_strings.errorcode.err_212; break;
						case 213:
							if (Seed.knights['city'+params.cid]['knt'+params.kid])
								Seed.knights['city'+params.cid]['knt'+params.kid].knightStatus = 10; //remove knight from list, set to 1 to make available again.
							msg = uW.g_js_strings.errorcode.err_213; break;
						default:
							CM.GATracker("Error", "Something has gone wrong. ("+g+")", uW.g_server); break;
							msg = uW.g_js_strings.errorcode["err_"+g]; break;
					}
					if (typeof rslt.cooldownTime !== "undefined") {
						rslt.msg = uW.g_js_strings.koth.timeRemaining.replace("%1$s", uW.timestr(rslt.cooldownTime));
						if (Tabs.Megalith) { var now = unixTime(); Tabs.Megalith.CheckAddAttackTime(params.xcoord,params.ycoord,(now+(rslt.cooldownTime)-(Tabs.Megalith.CoolDown*60))); }
					}
					if (!rslt.msg) { rslt.msg = msg; }
					if (callback) { callback(rslt); } //return all server excess traffic error to original function to handle
					return;
				}
				} catch (err){ logerr(err);}
			},
			onFailure: function () {
				--t.currentrequests;
				if (t.currentrequests<0) t.currentrequests=0;
				setTimeout(March.loop, 3000); //Always check for the next queued march 3 seconds after a request
				if(callback) { callback({msg:"AJAX Error"}); }
			}
		});
	},
};

var ItemMultiUseController = {
	city_holder : 0,
	max : 1,
	init : function () {
		var t = ItemMultiUseController;
		//Hack for ItemController
		t.ItemController = new CalterUwFunc("cm.MultiBuyUse.getNumberUsed", [[/(.|\n)*/i,'function (e) {return ItemController_hook();}']]);
		uWExportFunction('ItemController_hook', ItemMultiUseController.e_total);
	},
	UseItems : function (iid,num,cid) {
		var t = ItemMultiUseController;
		t.max = num;
		t.ItemController.setEnable(true); //Set to use current value specified
		if(cid){ //Set to use city specified
			t.city_holder = uW.currentcityid;
			uW.currentcityid = cid;
		}
		CM.ItemController.use(iid);
		if(cid){ //Set currentcity to old value
			uW.currentcityid = t.city_holder;
		}
		t.ItemController.setEnable(false); //Switch off value fixed
	},
	e_total : function () {
		var t = ItemMultiUseController;
		return t.max;
	},
}

/** TABS **/

/** Options Tab **/

Tabs.Options = {
	tabOrder: 2020,
	tabLabel: 'Settings',
	tabColor: 'red',
	tabMandatory: true,
	myDiv: null,
	WarnAscensionTimer: null,
	MiniRefreshTimer: null,
	LoopCounter:0,
	serverwait:false,
	PointlessItems : [4001,4002,4003,4004,4005,4006,4007,4008,4009,4010,4050,4051,4052,4053,4054,4055,4056,4057,4058,4059,30300],
	PublishLists : {0:'----', 80:tx("Everyone"), 50:tx("Friends of Friends"), 40:tx("Friends Only"), 10:tx("Only Me"), 99:tx('Custom List')},

	trstyles : 'div#throneMainContainer div#tableContainer{width:80px;height:213px;top:400px;left:450px;}\
				div#throneMainContainer div#trophyContainer{width:71px;height:86px;top:41px;left:381px;}\
				div#throneMainContainer div#statueContainer{width:124px;height:296px;top:274px;left:150px;z-index:97;}\
				div#throneMainContainer div#advisorContainer{width:141px;height:240px;bottom:0pt;right:0pt;}\
				div#throneMainContainer div#heroContainer{width:85px;height:150px;top:190px;left:585px;z-index:97;}',
	Colors : {
		Default:	{ Title: '#342819', TitleText: '#FFFFFF', DividerTop: '#E9D9AE', DividerBottom: '#8C7D5D', DividerText: '#000000', Panel: '#F7F3E6', PanelText: '#000000', Highlight: '#FFFFCC', HighlightText: '#000000',},
	},
	ReportOptions : {
		EnhanceAR: false,
		alertinterval: 10,
		alertmtroops: 0,
		WhisperAR:false,
		WhisperARList:"",
		WhisperOutgoing:false,
		PostIncoming: true,
		DeleteRptbc: false,
		DeleteRpttr: false,
		DeleteRptwl: false,
		DeleteRptaa: false,
		DeleteRptfr: false,
		DeleteRptid: false,
		DeleteRptdf: false,
		DeleteRptsc: false,
		DeleteRptUID: "",
		DeleteRptidType: 0,
		NoDuplicateReports: true,
		IgnoreWilds : false,
		IgnoreScouts : false,
	},
	ChatOptions : {
		chatEnhance: true,
		chatIcons: true,
		chatGlobal: true,
		chatWhisper: true,
		chatBold: false,
		chatAttack: true,
		chatLeaders: true,
		enableWhisperAlert: true,
		WhisperPlay: 'monitor',
		enableTowerAlert: false,
		enableScoutAlert: false,
		TowerPlay: 'allianceattack',
		ScoutPlay: 'allianceattack',
		filter: true,
		fchar: "Null",
		HelpRequest: true,
		DeleteRequest: true,
		DeletegAl: true,
		DeleteFood: false,
		DeleteFoodUsers: "",
		DeleteAlert: false,
		DeleteAlertUsers: "",
		DeleteScout: false,
		DeleteScoutUsers: "",
		DeleteReport: false,
		DeleteGlobalSpam: false,
		DeleteAllianceSpam: false,
		SpamActive: false,
		SpamType: "g",
		SpamText: "Join my Alliance!",
		SpamInterval: 15,
		Emoticons: true,
		ImagePreviews: true,
		Volume: 100,
		GloryLeader: true,
		GloryLeaderInterval: 15,
		GloryLeaderUID: 0,
		GloryLeaderAID: 0,
		GloryLeaderLastChecked: 0,
		GloryLeaderGlory: 0,
		Rainbow: false,
		Styles: true,
	},
	TowerOptions : {
		aChat : true,
		aPrefix : '** Red Alert! **',
		scouting : false,
		wilds : false,
		defend : true,
		tech : false,
		upkeep : true,
		champ : true,
		afk : true,
		guard : true,
		minTroops : 1000,
		whisper : true,
		whisperTroops : 500000,
		towercitytext : {},
		towercityactive : {},
		alertSound : {
			enabled : false,
			soundUrl : DEFAULT_ALERT_SOUND_URL,
			scoutUrl : DEFAULT_SCOUT_SOUND_URL,
			repeat : true,
			playLength : 10,
			repeatDelay : 0.5,
			volume : 100,
			alarmActive : false,
			expireTime : 0,
		},
		AFKEvents : true,
		ChangeTR : false,
		ChangeTRPreset : "",
		StopRaids : false,
		StopMarches : false,
		ChangeGuardian : false,
		ChangeChamp : false,
		ChampId : 0,
		ChampTime : 10,
		ChampOriginalCity : 0,
		ChampNoChamp : false,
		Revert : false,
		RevertMinutes : 2,
		RecentActivity : false,
		LastAttack : 0,
		HandledMarches : [],
		LatestAttackTimes : {},
		RecentCityActivity : {},
		SaveCityState : {},
		SaveTR : 0,
		DefendMonitor : true,
	},
	soundRepeatTimer : null,
	soundStopTimer : null,
	updatemarchfunc : null,
	mss : null,
	languagestatus : '',
	popLang : null,

	init : function (div){
		var t = Tabs.Options;
		t.myDiv = div;

		if (THEMES) {
			for (var a in THEMES) {
				t.Colors[a] = THEMES[a];
			}
		}

		uWExportFunction('btTabDelete', Tabs.Options.TabDelete);
		uWExportFunction('btTabRefresh', Tabs.Options.TabRefresh);
		uWExportFunction('btTabAdd', Tabs.Options.TabAdd);
		uWExportFunction('btTabReset', Tabs.Options.TabReset);
		uWExportFunction('btTabReloadAll', Tabs.Options.TabReloadAll);
		uWExportFunction('btTabToggle', Tabs.Options.TabToggle);
		uWExportFunction ('btToggleTRPreset', Tabs.Options.ToggleTRPreset);

		if (!Options.ReportOptions) {
			Options.ReportOptions = t.ReportOptions;
		}
		else {
			for (var y in t.ReportOptions) {
				if (!Options.ReportOptions.hasOwnProperty(y)) {
					Options.ReportOptions[y] = t.ReportOptions[y];
				}
			}
		}

		if (!Options.ChatOptions) {
			Options.ChatOptions = t.ChatOptions;
		}
		else {
			for (var y in t.ChatOptions) {
				if (!Options.ChatOptions.hasOwnProperty(y)) {
					Options.ChatOptions[y] = t.ChatOptions[y];
				}
			}
		}

		if (!Options.TowerOptions) {
			Options.TowerOptions = t.TowerOptions;
		}
		else {
			for (var y in t.TowerOptions) {
				if (!Options.TowerOptions.hasOwnProperty(y)) {
					Options.TowerOptions[y] = t.TowerOptions[y];
				}
			}
			for (var y in t.TowerOptions.alertSound) {
				if (!Options.TowerOptions.alertSound.hasOwnProperty(y)) {
					Options.TowerOptions.alertSound[y] = t.TowerOptions.alertSound[y];
				}
			}
		}
		if (!Options.TowerOptions.RecentActivity) { t.resetCityStates(); } // safety!

		for (var cityId in Cities.byID) {
			if (!Options.TowerOptions.towercityactive.hasOwnProperty(cityId)) { // default city alert indicator to ON!
				Options.TowerOptions.towercityactive[cityId] = true;
				saveOptions();
			}

			// if city has ported since citystate set, then reset arrival time to revert actions that were taken...
			if (Options.TowerOptions.SaveCityState[cityId] && Options.TowerOptions.SaveCityState[cityId].tileId != Cities.byID[cityId].tileId) {
				Options.TowerOptions.LatestAttackTimes[cityId] = 0;
			}

		}

		if (!UserOptions.TokenDomain) { // default token domain to current domain if not already set for user...
			UserOptions.TokenDomain = getServerId();
			saveUserOptions(uW.user_id);
		}

		// do all the initialising here

		MAP_DELAY = Options.MapInterval * 1000;

		anticd.init();
		ChatStuff.init();
		AttackDialog.init();
		ChatTimeFix.init();
		GMTclock.init();
		battleReports.init();
		AllianceReports.init();
		DispReport.init();
		AllianceReportsCheck.init();
		mapinfoFix.init();
		MapDistanceFix.init();
		PageNavigator.init();
		CoordBox.init();
		towho.init();
		cdtd.init();
		LoadCapFix.init();
		TRAetherCostFix.init();
		mmbImageFix.init();
		TowerAlerts.init();
		TreasureChestClick.init();
		KillBox.init();
		FairieKiller.init (Options.KillFairie);
		DeleteReports.init();
		CollectGold.init();
		FoodAlerts.init();
		ItemMultiUseController.init();
		RaidManager.init();
		ChampLagFix.init();

		if (Options.EnhCBtns && Options.WarnAscension) {
			Tabs.Options.checkAscension();
			clearInterval(t.WarnAscensionTimer);
			t.WarnAscensionTimer = setInterval(function () {
				Tabs.Options.checkAscension();
			}, 60 * 1000);
		};
		t.MiniRefresh();
		CheckRemoveAlert();
		CheckDisableAds();

		if (Options.MoveFurniture) {
			GM_addStyle(t.trstyles);
		}

		t.DeletePointlessItems();

		var oldStatusAnim = CM.ThronePanelView.statusAnim;
		var newStatusAnim = function(result) {
			if (result == "success" && !Options.DisableGreenTick) { oldStatusAnim(result); }
			if (result == "failure" && !Options.DisableRedX) { oldStatusAnim(result); }
		}
		if (typeof exportFunction == 'function') { exportFunction(newStatusAnim,CM.ThronePanelView, {defineAs:"statusAnim"}); }
		else { CM.ThronePanelView.statusAnim = newStatusAnim; };

		if (uW.g_js_strings) {uW.g_js_strings.commonstr.yourScriptVersionIsOut = uW.g_js_strings.checkoutofdate.reloadconfirm;}

		if (Options.amain) {
			if (Options.smain == -1) {
				setTimeout( function (){uW.citysel_click(ById('citysel_'+Number(Number(Options.lmain)+1)));if (popDash) uW.btChangeDashCity(uW.currentcityid);},1000);
			}
			else {
				setTimeout( function (){uW.citysel_click(ById('citysel_'+Number(Number(Options.smain)+1)));if (popDash) uW.btChangeDashCity(uW.currentcityid);},1000);
			}
		}

		if (Options.FixMightDisplay) {
			var ai = ByCl('avatarInfo')[0];
			var al = ByCl('avatarLevel')[0];
			var am = ByCl('avatarMight')[0];
			var ag = ByCl('avatarGlory')[0];
			if (ai) ai.style.marginLeft = '-10px';
			if (al) al.style.display = 'none';
			if (am) am.style.paddingLeft = '0px';
			if (ag) ag.style.paddingLeft = '0px';

			am.innerHTML = '<div class="avatarName"><a id=btMightPop style="font-size:10px;">'+am.innerHTML+'</a></div>';
			ById('btMightPop').addEventListener('click',ShowMightBreakdown);
		}

		if (Options.KillSounds) {
			var killsound = ByCl('sfx_effects')[0];
			if (killsound && killsound.classList.contains("on")) {killsound.click();}
		}
		if (Options.KillMusic) {
			var killmusic = ByCl('sfx_music')[0];
			if (killmusic && killmusic.classList.contains("on")) {uW.AM_pauseMusic();killmusic.click();}
		}

		if (uW.update_march) { // for recalled marches
			t.updatemarchfunc = new CalterUwFunc ('update_march', [[/var\s*w\s*=\s*cm.IncomingAttackManager.getAllAttacks/i,'var Dar = seed.queue_atkinc\[o\];Dar.marchStatus = D.marchStatus;RecIncT\(Dar\);var w = cm.IncomingAttackManager.getAllAttacks']]);
			t.updatemarchfunc.setEnable(true);
			uWExportFunction('RecIncT',Tabs.Options.newIncoming);
		};

		if (Options.ClickForReports) {
			var btnrep1 = new CalterUwFunc("modal_messages",[['getHtmlElement())','getHtmlElement());Messages.listReports();']]);
			btnrep1.setEnable(true);
			var btnrep2 = new CalterUwFunc("modal_alliance",[['modal_alliance_init','function() {allianceReports();modal_alliance_changetab(4);}']]);
			btnrep2.setEnable(true);
		}

		var Market = new CalterUwFunc('modal_marketplace', [[/maxlength..\d./gim, '']]);
		Market.setEnable(true); // remove max selling amount in the market!
		var Market2 = new CalterUwFunc('market_resource_maxpossible', [[/g\s*=\s*999000/i, 'g = g']]);
		Market2.setEnable(true); // remove max buy button limit in the market!

		var e = document.createElement('div');
		document.body.appendChild(e);	// NEEDS TO BE VISIBLE FOR ALERT SOUND TO WORK!
		t.mss = new AudioMan();
		if (t.mss) { t.mss.init(e); }

		// create a container for TR Widget

		var e = document.createElement('div');
		e.id = 'btTRWidget';
		ById('mod_maparea').appendChild(e);
		t.SetTRWidgetDisplay();

		if (Options.DraggableWidget) {
			jQuery("#btTRWidget").draggable({ start: function( event, ui) {
					jQuery('#btTRWidget').css({"right":"",});
				}, stop: function( event, ui ) {
					Options.presetPosition = jQuery("#btTRWidget").position();
					saveOptions();
				},
			});
			if (Options.presetPosition) {
				jQuery('#btTRWidget').css({"left": Options.presetPosition.left + "px","top": Options.presetPosition.top + "px","right":"",});
			}
		}
		else {
			Options.presetPosition = null;
			saveOptions();
		}

		if (Options.DraggableCoords) {
			jQuery("#btCoordsBox").draggable({ stop: function( event, ui ) {
					Options.coordsPosition = jQuery("#btCoordsBox").position();
					saveOptions();
				},
			});
			if (Options.coordsPosition) {
				jQuery('#btCoordsBox').css({"left": Options.coordsPosition.left + "px","top": Options.coordsPosition.top + "px","right":"",});
			}
		}
		else {
			Options.coordsPosition = null;
			saveOptions();
		}

		// Check for new Language Pack Availability...

		if (LanguageArray.LangVersion) { t.languagestatus = tx('Language pack')+' ('+LanguageArray.CurrLang+') '+tx('Version')+' '+LanguageArray.LangVersion+' '+tx('loaded');}
		else {
			if (Options.Language != 'en') { t.languagestatus = tx('Language pack unavailable'); }
		};
		var now = unixTime();
		if (Options.LanguageLastChecked + (3600*24*7) < now) { // only check for new lang pack once a week
			t.LoadLanguage(Options.Language);
		}

		if (Options.btEveryToggle) AddSubTabLink('Refresh',t.toggleAutoRefreshState, 'RefreshToggleTab');
		SetToggleButtonState('Refresh',Options.btEveryEnable,'Refresh');

		if (Options.ChatOptions.GloryLeader) { setTimeout(Tabs.Options.CheckGlory,10000,true); } // force check glory after 10 secs
		if (Options.RaidRunning) { t.checkResetRaids(); }
		t.sendDFReport(); // check every refresh

		OpenDiv["Options"] = Options.OpenSettingsDiv;

		setTimeout(function() { RefreshEvery.setEnable (Options.btEveryEnable);t.CheckTokenTimerOverride(); },5*1000); // last one - start refresh cycle in 5 seconds
	},

	SetTRWidgetDisplay : function (e) {
		if (uW.isNewServer()) { return; }
		var e = ById('btTRWidget');
		e.style.position = "absolute";
		if (Options.ThroneHUD) {
			e.style.top = "29px";
			e.style.left = "";
			e.style.right = "228px";
			e.style.width = "";
			e.style.zIndex = 100000;
		}
		else {
			e.style.top = ById('mod_maparea').offsetHeight+6+"px";
			e.style.left = "4px";
			e.style.right = "";
			e.style.width = "";
			e.style.zIndex = 100000;
		}
		Dashboard.PaintTRPresets();
	},

	DeletePointlessItems : function () {
		var t = Tabs.Options;
		if (Options.RemovePointlessItems) {
			for (var i=0;i<t.PointlessItems.length;i++) {
				var iid = t.PointlessItems[i];
				if (Seed.items["i"+iid]) { delete Seed.items["i"+iid]; }
				if (uW.ksoItems[iid] && uW.ksoItems[iid].count>0) { uW.ksoItems[iid].count = 0; }
			}
		}
	},

	CheckTokenResponse : function () {
		CheckTokenDay(uW.user_id)
		if (UserOptions.TokenRequest != '') {
			if (UserOptions.TokenRequest == 'TOKEN') {
				UserOptions.LastTokenStatus = UserOptions.TokenResponse;
				if (UserOptions.LastTokenStatus=='OK') {
					if (UserOptions.TokenSuccessLink!="") { UserOptions.TokenLink = UserOptions.TokenSuccessLink; }
					actionLog('Merlin share token collected','TOKENS');
				}
				else { actionLog('Merlin share token collection failed - '+UserOptions.LastTokenStatus,'TOKENS'); }
			}
			if (UserOptions.TokenRequest == 'BUILD') {
				UserOptions.LastBuildStatus = UserOptions.TokenResponse;
				if (UserOptions.LastBuildStatus=="") { UserOptions.LastBuildStatus = 'UNKNOWN'; } // build may not update if user_id not known
				if (UserOptions.LastBuildStatus=='OK') {
					if (UserOptions.TokenSuccessLink!="") { UserOptions.BuildLink = UserOptions.TokenSuccessLink; }
					actionLog('Help token collected','TOKENS');
				}
				else { actionLog('Help token collection failed - '+UserOptions.LastBuildStatus,'TOKENS'); }
			}
			if (UserOptions.TokenRequest == 'CHEST') {
				UserOptions.LastChestStatus = UserOptions.TokenResponse;
				if (UserOptions.LastChestStatus=='OK') { actionLog('Treasure chest token collected','TOKENS'); }
				else { actionLog('Treasure chest token collection failed - '+UserOptions.LastChestStatus,'TOKENS'); }
				if (UserOptions.LastChestStatus=='OK' || UserOptions.LastChestStatus=='USED') {
					if (UserOptions.TokenChestUID != 0) { // remove used link from bank
						for (var c=0;c<UserOptions.TreasureChestBank.length;c++) {
							if (UserOptions.TreasureChestBank[c].feedId==UserOptions.TokenChestFeedId) {
								UserOptions.TreasureChestBank.splice(c, 1);
								break;
							}
						}
						for (var c=0;c<UserOptions.TreasureChestBankOther.length;c++) {
							if (UserOptions.TreasureChestBankOther[c].feedId==UserOptions.TokenChestFeedId) {
								UserOptions.TreasureChestBankOther.splice(c, 1);
								break;
							}
						}
					}
				}
			}
			UserOptions.TokenRequest = '';
			UserOptions.TokenResponse = '';
			UserOptions.TokenSuccessLink = '';
			UserOptions.TokenChestFeedId = 0;
			UserOptions.TokenChestUID = 0;
			saveUserOptions(uW.user_id);
		}
	},

	CheckTokenTimerOverride : function () {
		// check if we need to override the reload timer...
		var CanCollect = false;
		if (GlobalOptions.TokenEnabled && UserOptions.TokenAuto && getServerId()==UserOptions.TokenDomain) {
			// check for token collection
			if (!UserOptions.TokenCollected && UserOptions.TokenLink != "" && UserOptions.TokenLink.search(/merlinshare/i) != -1 && UserOptions.LastTokenStatus == "") {
				CanCollect = true;
			}
			else {
				// check for build collection
				if (!UserOptions.BuildCollected && UserOptions.BuildLink != "" && UserOptions.BuildLink.search(/accepttoken/i) != -1 && UserOptions.LastBuildStatus == "") {
					CanCollect = true;
				}
				else {
					if (UserOptions.TreasureChestBankOther.length>0 || UserOptions.TreasureChestBank.length>0) {
						if (!UserOptions.BonusCollected && UserOptions.TreasureChestBankOther.length>0 && UserOptions.TreasureChestBankOther[0].playerId!=uW.tvuid && UserOptions.LastChestStatus == "") {
							CanCollect = true;
						}
						else {
							var DomArray = UserOptions.ChestDomainList.split(",");
							for (var d=0; d < DomArray.length; d++) {
								if (DomArray[d]) {
									if (!UserOptions.ChestCollected[DomArray[d]] && !UserOptions.BadChestDomains[DomArray[d]]) {
										CanCollect = true;
										break;
									}
								}
							}
						}
					}
				}
			}
		}
		if (CanCollect && parseIntNan(UserOptions.OverrideRefresh)!=0) {
			if (!Options.btEveryEnable) { RefreshEvery.setEnable (true); }
			RefreshEvery.NextRefresh = unixTime() + (parseIntNan(UserOptions.OverrideRefresh)*60);
		}
	},

	EverySecond : function () {
		var t = Tabs.Options;
		var now = unixTime();

		/* check tower FIRST!!! */

		t.CheckWatchTower();

		/* check if map drawing event required */

		DrawLevelIcons();

		/* check and send spam */

		if (Options.ChatOptions.SpamActive && Options.ChatOptions.LastSpamSent + (Options.ChatOptions.SpamInterval*60) < now) {
			var spam = String(Options.ChatOptions.SpamText);
			if (spam.charAt(0) == "\\") { // not sure what this is all about, but we'll leave it in.
				spam = spam.slice(1);
				var unicodeString = '';
				for (var i=0; i < spam.length; i++) {
					var theUnicode = spam.charCodeAt(i);
					theUnicode = '&#' + theUnicode+';';
					unicodeString += theUnicode;
				}
				spam = String(unicodeString);
			};
			var spamtype = 'global';
			if (Options.ChatOptions.SpamType == 'a') { spamtype = 'alliance';}
			var spamreason = Options.ChatOptions.SpamInterval+' minutes elapsed';
			if (Options.ChatOptions.LastSpamSent == 0) { spamreason = 'spam activated' }
			actionLog ('Sending '+spamtype+' spam ('+spamreason+')','SPAM');
			sendChat(String('/' + Options.ChatOptions.SpamType + ' {spam} ' + spam));
			Options.ChatOptions.LastSpamSent = now;
			saveOptions();
		};

		/* check throne room rotation */

		if (Options.DashboardOptions.TRPresetsCycle && Options.DashboardOptions.TRPresetsLastChecked + (Options.DashboardOptions.TRPresetsCycleMins*60) < now) {
			if (afkdetector.isAFK && !Options.TowerOptions.RecentActivity) {
				t.RotateThrone();
			}
			Options.DashboardOptions.TRPresetsLastChecked = now;
			saveOptions();
		}


		t.LoopCounter = t.LoopCounter + 1;

		/* Check gold collect and food alerts every 15 seconds */

		if ((t.LoopCounter % 15) == 1) {
			if (Options.pbGoldEnable) {
				CollectGold.tick();
			}
			if (Options.pbFoodAlert) {
				FoodAlerts.tick();
			}
			if (Options.ChatOptions.GloryLeader) {
				t.CheckGlory(false);
			}
		}

		if (t.LoopCounter >= 60) { // functions for every minute
			if (Options.AutoMist) { t.CheckMistStatus(); }
			if (Options.StalledMarches) { new fixgamelag(); }
			if (Options.RaidRunning) { t.checkResetRaids(); }

			// reset the march queue requests, in case the logic has failed
			if (March.currentrequests >= March.maxrequests) { March.currentrequests = 0; }
			if (March.getQueueLength() > 0) { setTimeout(March.loop,0); }

			t.LoopCounter = 0;

			t.sendDFReport();
		}
	},

	CheckMistStatus : function () {
		var t = Tabs.Options;
		var now = unixTime();
		if (Options.AutoMist && afkdetector.isAFK && parseIntNan(Seed.playerEffects.fogExpire) < now) {
			if (uW.ksoItems[10021].count>0) {
				CM.ItemController.usePotionOfMist('10021');
				actionLog('Automatically applying Potion of Mist','GENERAL');
			}
		}
	},

	CheckGlory : function (force) {
		var t = Tabs.Options;
		var aid = getMyAlliance()[0];
		var now = unixTime();

		/* check alliance glory leader */

		if (aid > 0) {
			if ((Options.ChatOptions.GloryLeaderLastChecked + (Options.ChatOptions.GloryLeaderInterval*60) < now) || (Options.ChatOptions.GloryLeaderAID!=aid) || force) {
				actionLog ('Checking alliance glory leader','GENERAL');
				Options.ChatOptions.GloryLeaderAID = aid;
				Options.ChatOptions.GloryLeaderUID = 0;
				Options.ChatOptions.GloryLeaderLastChecked = now;
				saveOptions();
				Tabs.Alliance.totalmembers = 0;
				Tabs.Alliance.alliancemembers = [];
				Tabs.Alliance.error = false;
				Tabs.Alliance.fetchAllianceMemberList(true,t.SetGloryLeader);
			}
		}
	},

	SetGloryLeader : function() {
		var t = Tabs.Options;
		var glory = 0;
		for (var y in Tabs.Alliance.alliancemembers) {
			if (Tabs.Alliance.alliancemembers[y][6]) {
				if (Tabs.Alliance.alliancemembers[y][9] > glory) {
					glory = Tabs.Alliance.alliancemembers[y][9];
					Options.ChatOptions.GloryLeaderUID = Tabs.Alliance.alliancemembers[y][6];
					Options.ChatOptions.GloryLeaderGlory = glory;
				}
			}
		}
		saveOptions();
	},

	checkResetRaids : function() {
		var t = Tabs.Options;
		var now = unixTime();
		if (now - Options.RaidLastReset > 3600) { // every hour
			actionLog('Resetting Raid Timers','RAIDS');
			Options.RaidLastReset = now;
			saveOptions();
			for (var g=0;g<Seed.cities.length;g++){
				setTimeout(t.resetRaids, (5000*g), Seed.cities[g][0],Seed.cities[g][1]); // 5 second intervals
			}
		}
	},

	show : function (){
		var t = Tabs.Options;

		m = '<DIV style="max-height:700px; overflow-y:auto;">';
		m += '<div class="divHeader" align="center">'+tx("POWERBOT+ CONFIGURATION")+'</div>';
		m += '<table width=98% align=center>';
		m += '<TR><TD width=25% class=xtab><a id=btResetWindows class="inlineButton btButton brown11"><span>'+tx("Reset ALL window positions!")+'</span></a></td><td align=right class=xtab>'+uW.g_js_strings.commonstr.domain+':</td><td class=xtab><b>'+getServerId()+'</b></td><td align=right class=xtab>'+tx("User Id")+':</td><td class=xtab><b>'+uW.tvuid+'</b></td><td width=25% class=xtab align=right><a id=btResetAll class="inlineButton btButton red14"><span>'+tx("Reset ALL Settings!")+'</span></a></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td class=xtab colspan=4 align=center><span style="font-size:9px;color:#800;">('+tx("options marked with * require a refresh")+')</span></td><td class=xtab align=right>&nbsp;</td></tr>';
		m += '</table>';

		m += '<a id=btGeneralOptionLink class=divLink ><div class="divHeader" align="left"><img id=btGeneralOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("GENERAL SETTINGS (ALL DOMAINS)")+'</div></a>';
		m += '<div id=btGeneralOption class=divHide></div>';

		m += '<a id=btUserOptionLink class=divLink ><div class="divHeader" align="left"><img id=btUserOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("USER SETTINGS")+'</div></a>';
		m += '<div id=btUserOption class=divHide></div>';

		m += '<a id=btPBPOptionLink class=divLink ><div class="divHeader" align="left"><img id=btPBPOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("POWERBOT+ FEATURES")+'</div></a>';
		m += '<div id=btPBPOption class=divHide></div>';

		m += '<a id=btGameOptionLink class=divLink ><div class="divHeader" align="left"><img id=btGameOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("GAME FEATURES")+'</div></a>';
		m += '<div id=btGameOption class=divHide></div>';

		m += '<a id=btFixOptionLink class=divLink ><div class="divHeader" align="left"><img id=btFixOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("GAME FIXES")+'</div></a>';
		m += '<div id=btFixOption class=divHide></div>';

		m += '<a id=btTowerOptionLink class=divLink ><div class="divHeader" align="left"><img id=btTowerOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("WATCHTOWER SETTINGS")+'</div></a>';
		m += '<div id=btTowerOption class=divHide></div>';

		m += '<a id=btDashOptionLink class=divLink ><div class="divHeader" align="left"><img id=btDashOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("DASHBOARD SETTINGS")+'</div></a>';
		m += '<div id=btDashOption class=divHide></div>';

		m += '<a id=btChatOptionLink class=divLink ><div class="divHeader" align="left"><img id=btChatOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("CHAT SETTINGS")+'</div></a>';
		m += '<div id=btChatOption class=divHide></div>';

		m += '<a id=btReportOptionLink class=divLink ><div class="divHeader" align="left"><img id=btReportOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("REPORT SETTINGS")+'</div></a>';
		m += '<div id=btReportOption class=divHide></div>';

		m += '<a id=btTRPresetOptionLink class=divLink><div class="divHeader" align="left"><img id=btTRPresetOptionArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("THRONE ROOM PRESETS")+'</div></a>';
		m += '<div id=btTRPresetOption class=divHide></div>';

		m += '<a id=btTabManagerLink class=divLink ><div class="divHeader" align="left"><img id=btTabManagerArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("TAB MANAGER")+'</div></a>';
		m += '<div id=btTabManager class=divHide></div>';

		m += '<a id=btLanguageLink class=divLink ><div class="divHeader" align="left"><img id=btLanguageArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("LANGUAGE OPTIONS")+'</div></a>';
		m += '<div id=btLanguage class=divHide></div>';

		m += '<a id=btExportLink class=divLink ><div class="divHeader" align="left"><img id=btExportArrow height="10" src="'+RightArrow+'">&nbsp;'+tx("EXPORT AND IMPORT")+'</div></a>';
		m += '<div id=btExport class=divHide><br><TABLE width="100%">';
		m += '<TR><TD class=xtab><input class=btInput id=btResetSettings type=button value="'+tx("Reset Config")+'">&nbsp;<input class=btInput id=btSaveSettings type=button value="'+tx("Save Config")+'">&nbsp;<input class=btInput id=btLoadSettings type=button value="'+tx("Load Config")+'">&nbsp;<input class=btInput id=btLoadSettingsFile type=file></td>';
		m += '<td class=xtab align=right><div class=btInput>'+tx('Copy from')+': <input class=btInput type="text" size=3 maxlength=3 value="'+getServerId()+'" id="pbexport_from"/>&nbsp;'+uW.g_js_strings.commonstr.totx+': <input class=btInput type="text" size=3 maxlength=3 id="pbexport_to" />&nbsp;<input class=btInput type=button value="Go" id="pbexport_submit" />&nbsp;<input type="checkbox" id="pbexport_overwrite" /> '+tx('Force Overwrite')+'</div></td></tr>';
		m += '</table>';
		m += '<div id=pbexport_messages align=center>&nbsp;</div>';
		m += '</table></div><hr>';

		m += '<div align=center>';
		m += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">\
				<input type="hidden" name="cmd" value="_s-xclick">\
				<input type="hidden" name="hosted_button_id" value="8VEDPV3X9X82L">\
				<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">\
				<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">\
				</form>';
		m += '<br>'+tx('Thank you for the support')+'&nbsp;&nbsp;...&nbsp;&nbsp;Barbarossa.</div>';

		m += '</div><br>';
		t.myDiv.innerHTML = m;

		ById('btSaveSettings').addEventListener ('click',function() {
			var Export = {};
			Export.GlobalOptions = GlobalOptions;
			Export.UserOptions = UserOptions;
			Export.Options = Options;

			uriContent = 'data:application/octet-stream;content-disposition:attachment;filename=file.txt,' + encodeURIComponent(JSON2.stringify(Export));
			t.saveConfig(uriContent,'config_'+getServerId()+'_'+uW.tvuid+'.txt');
		},false);

		ById('btLoadSettings').addEventListener ('click',function() {
			ById('pbexport_messages').innerHTML = '&nbsp;'
			var fileInput = ById("btLoadSettingsFile");
			var files = fileInput.files;
			if (files.length == 0) {
				ById('pbexport_messages').innerHTML = '<span style="color:#800;">'+tx('Please select a config file')+'</span>';
				return;
			}
			var file = files[0];

			var reader = new FileReader();

			reader.onload = function (e) {
				var Import = JSON2.parse(e.target.result);
				GlobalOptions = Import.GlobalOptions;
				UserOptions = Import.UserOptions;
				Options = Import.Options;
				actionLog('Settings file successfully loaded','OPTIONS');
				ReloadKOC();
			};
			reader.readAsText(file);
		},false);

		ById('pbexport_submit').addEventListener ('click',function() {
			ById('pbexport_messages').innerHTML = '&nbsp;'
			var NewServerID = parseIntNan(ById('pbexport_to').value);
			var OldServerID = parseIntNan(ById('pbexport_from').value);
			if(NewServerID == 0 || NewServerID == OldServerID){
				ById('pbexport_messages').innerHTML = '<span style="color:#800;">'+tx('Invalid destination domain number')+'</span>';
				return;
			}
			if(OldServerID == 0){
				ById('pbexport_messages').innerHTML = '<span style="color:#800;">'+tx('Invalid source domain number')+'</span>';
				return;
			}
			var s = GM_getValue ('Options_'+NewServerID+'_'+uW.tvuid);
			if ((s || NewServerID == getServerId()) && !ById('pbexport_overwrite').checked){
				ById('pbexport_messages').innerHTML = '<span style="color:#800;">'+tx('Destination domain configuration already exists - use "Force Overwrite" indicator to overwrite settings')+'</span>';
				return;
			}
			if (OldServerID != getServerId()) {
				s = GM_getValue ('Options_'+OldServerID+'_'+uW.tvuid);
				if (!s) {
					ById('pbexport_messages').innerHTML = '<span style="color:#800;">'+tx('Source domain configuration does not exist')+'</span>';
					return;
				}
				// export/import from s...
				GM_setValue('Options_'+ NewServerID+'_'+uW.tvuid, s);
				if (NewServerID == getServerId()) {
					ResetAll = true;
					actionLog('Powerbot+ configuration imported from '+OldServerID);
					Tabs.ActionLog.save();
					ReloadKOC();
					return;
				}
				else {
					ById('pbexport_messages').innerHTML = tx('PowerBot+ configuration exported from')+' '+OldServerID+' '+tx('to')+' '+NewServerID;
					return;
				}
			}
			else {
				// export from Options...
				GM_setValue ('Options_'+NewServerID+'_'+uW.tvuid, JSON2.stringify(Options));
				ById('pbexport_messages').innerHTML = tx('PowerBot+ configuration exported from')+' '+OldServerID+' '+tx('to')+' '+NewServerID;
				return;
			}
		}, false);

		ById('btResetWindows').addEventListener ('click', function() {t.ResetAllWindows();}, false);
		ById('btResetAll').addEventListener ('click', function() {t.ResetAll();}, false);
		ById('btResetSettings').addEventListener ('click', function() {t.ResetSettings();}, false);

		ById('btGeneralOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btGeneralOption",true,"OpenSettingsDiv")}, false);
		ById('btUserOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btUserOption",true,"OpenSettingsDiv")}, false);
		ById('btTowerOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btTowerOption",true,"OpenSettingsDiv")}, false);
		ById('btDashOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btDashOption",true,"OpenSettingsDiv")}, false);
		ById('btPBPOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btPBPOption",true,"OpenSettingsDiv")}, false);
		ById('btGameOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btGameOption",true,"OpenSettingsDiv")}, false);
		ById('btChatOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btChatOption",true,"OpenSettingsDiv")}, false);
		ById('btReportOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btReportOption",true,"OpenSettingsDiv")}, false);
		ById('btFixOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btFixOption",true,"OpenSettingsDiv")}, false);
		ById('btTRPresetOptionLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btTRPresetOption",true,"OpenSettingsDiv")}, false);
		ById('btTabManagerLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btTabManager",true,"OpenSettingsDiv")}, false);
		ById('btLanguageLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btLanguage",true,"OpenSettingsDiv")}, false);
		ById('btExportLink').addEventListener ('click', function () {ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,"btExport",true,"OpenSettingsDiv")}, false);

		t.PaintGeneralOptions();
		t.PaintUserOptions();
		t.PaintTowerOptions();
		t.PaintPBPOptions();
		t.PaintGameOptions();
		t.PaintFixOptions();
		t.PaintReportOptions();
		t.PaintDashOptions();
		t.PaintChatOptions();
		t.PaintTRPresetOptions();
		t.PaintLanguageOptions();
		t.PaintTabManagerOptions();

		if (!OpenDiv["Options"]) { OpenDiv["Options"] = ""; }
		if (OpenDiv["Options"] != "") {
			var LastOpenDiv = OpenDiv["Options"];
			OpenDiv["Options"] = "";
			ToggleMainDivDisplay("Options",100,GlobalOptions.btWinSize.x,LastOpenDiv,true);
		}
	},

	saveConfig : function (uri, filename) {
		var link = document.createElement('a');
		if (typeof link.download === 'string') {
			document.body.appendChild(link); // Firefox requires the link to be in the body
			link.download = filename;
			link.href = uri;
			link.click();
			document.body.removeChild(link); // remove the link when done
		} else {
			window.open(uri,filename);
		}
	},

	PaintGeneralOptions : function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=btWatchdog type=checkbox /></td><TD colspan=2 class=xtab>'+tx("Refresh if KofC not loaded within 1 minute")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btNoMoreRy type=checkbox /></td><TD colspan=2 class=xtab>'+tx("Send me away !")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btTrackOpen type=checkbox /></td><TD colspan=2 class=xtab>'+tx("Remember window open state on refresh")+'</td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD colspan=2 class=xtab>'+tx("Widescreen Style:")+' '+ htmlSelector({normal:'Normal (100%)', wide:'Wide (1520px)', ultra:'Ultra (1900px)'},GlobalOptions.btWideScreenStyle,'id=btWideScreenStyle')+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD colspan=2 class=xtab>'+tx("PowerBot+ Window Size:")+' '+ htmlSelector({750:'750 pixels', 1000:'1000 pixels', 1250:'1250 pixels'},GlobalOptions.btWinSize.x,'id=btWinSize')+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btShowPowerBar type=checkbox /></td><TD class=xtab>'+tx("Use Powerbar")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td>';
		m += '<TD class=xtab><div id=btShowFloatingPowerBar><INPUT id=btFloatingPowerBar type=checkbox />&nbsp;'+tx("Power Bar floats above game screen")+'</div></td></tr>';
		m += '<TR id=btShowPopupPowerBar><TD class=xtab>&nbsp;</td><TD class=xtab>&nbsp;</td><TD class=xtab><INPUT id=btPopupPowerBar type=checkbox />&nbsp;'+tx("Add Popup buttons to Power Bar")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btDashboardToggle type=checkbox /></td><TD class=xtab>'+tx("Dashboard toggle button on main screen header")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td><TD class=xtab><INPUT id=btOverviewDashboardBtn type=checkbox />&nbsp;'+tx("Dashboard Button next to Overview Button")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btInOutToggle type=checkbox /></td><TD class=xtab>'+tx("Incoming/Outgoing toggle buttons on main screen header")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td><TD class=xtab><INPUT id=btMarchPlusToggle type=checkbox />&nbsp;'+tx("March+ toggle button on main screen header")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btBattleToggle type=checkbox /></td><TD class=xtab>'+tx("Battle toggle button on main screen header")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td><TD class=xtab>&nbsp;</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btChatOnRight type=checkbox /></td><TD class=xtab>'+tx("Put chat on right")+'</td>';
		m += '<TD class=xtab><div id=btShowChatBeforeDash><INPUT id=btChatBeforeDash type=checkbox />&nbsp;'+tx("Put chat before dashboard")+'</div></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btWideMap type=checkbox /></td><TD colspan=2 class=xtab>'+tx("Enable wide map expansion button on the map panel")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btTransparent type=checkbox /></td><TD colspan=2 class=xtab>'+tx("Use Transparent Windows")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		var UpdateLocations = {0:"SourceForge",1:"GreasyFork",2:"GitHub",3:"pbkplowplow.com",4:"cs-hotsite"};
		m += '<TR><td class=xtab><INPUT disabled id=AutoUpdateChk type=checkbox /></td><td colspan=2 class=xtab>'+tx("Automatically check for script updates on")+'&nbsp;'+htmlSelector(UpdateLocations,GlobalOptions.UpdateLocation,'id="btUpdateLocation" class="btInput"')+'&nbsp;&nbsp;&nbsp;&nbsp;<a id=btUpdateCheck class="inlineButton btButton brown11"><span>'+tx('Check Now')+'</span></a></td></tr>';
		m += '<TR><td class=xtab><INPUT id=ExtendedDebugChk type=checkbox /></td><td colspan=2 class=xtab>'+tx("Extended debug mode (Activates additional logging)")+'</td></tr>';
		m += '</table>';

		ById('btGeneralOption').innerHTML = m;

		t.togGlobalOpt ('btWatchdog', 'btWatchdog',t.RestartReminder);
		t.togGlobalOpt ('btNoMoreRy', 'btNoMoreRy',t.RestartReminder);

		t.changeGlobalOpt ('btWideScreenStyle','btWideScreenStyle',t.RestartReminder);

		ById('btWinSize').addEventListener ('change', function(){
			GlobalOptions.btWinSize.x = parseIntNan(ById('btWinSize').value);
			if (GlobalOptions.btWinSize.x == 0) GlobalOptions.btWinSize.x = 750;
			saveGlobalOptions ();
			t.RestartReminder();
		},false);

		t.togGlobalOpt ('btShowPowerBar', 'btPowerBar',t.RestartReminder);
		t.togGlobalOpt ('btFloatingPowerBar', 'btFloatingPowerBar');
		t.togGlobalOpt ('btPopupPowerBar', 'btPowerBarPopups',t.RestartReminder);
		t.togGlobalOpt ('btDashboardToggle', 'DashboardToggle',t.RestartReminder);
		t.togGlobalOpt ('btInOutToggle', 'InOutToggle',t.RestartReminder);
		t.togGlobalOpt ('btBattleToggle', 'BattleToggle',t.RestartReminder);
		t.togGlobalOpt ('btMarchPlusToggle', 'MarchPlusToggle',t.RestartReminder);
		t.togGlobalOpt ('btOverviewDashboardBtn', 'btOverviewDashboardBtn',t.RestartReminder);
		t.togGlobalOpt ('btChatOnRight', 'btChatOnRight',WideScreen.setChatOnRight);
		t.togGlobalOpt ('btChatBeforeDash', 'btChatBeforeDash',WideScreen.chgChatBeforeDash);
		t.togGlobalOpt ('btWideMap', 'btWideMap', WideScreen.useWideMap);
		t.togGlobalOpt ('btTrackOpen', 'btTrackOpen');
		t.togGlobalOpt ('btTransparent', 'btTransparent',t.RestartReminder);

//		t.togGlobalOpt ('AutoUpdateChk', 'AutoUpdates');
		t.togGlobalOpt ('ExtendedDebugChk', 'ExtendedDebugMode',t.RestartReminder);

		ById('btUpdateCheck').addEventListener ('click', function() {AutoUpdater.call(true,true);}, false);
		t.changeGlobalOpt ('btUpdateLocation','UpdateLocation');
	},

	PaintUserOptions : function () {
		var t = Tabs.Options;

		for (var l in UserOptions.CustomPublish) {
			t.PublishLists[l] = UserOptions.CustomPublish[l];
		}

		m = '<TABLE width="100%">';
		m += '<TR><td class=xtab colspan=5><B>FBUID:&nbsp;'+uW.user_id+'&nbsp;</b></td></tr>';
		m += '<TR><td class=xtab width=30><INPUT id=btPubReq type=checkbox '+ (UserOptions.autoPublishGamePopups?'CHECKED ':'') +'/></td><TD colspan=4 class=xtab>'+tx("Auto-publish Facebook posts for")+' '+ htmlSelector(t.PublishLists,UserOptions.autoPublishPrivacySetting,'id=selectprivacymode') +'&nbsp;&nbsp;&nbsp;<span class=divHide><a id=RefreshPublishList>Refresh User Lists</a></span><span id=btCustomListSpan class=divHide>'+tx('Custom List ID')+':&nbsp;<input id=btCustomList type=text class=btInput style="width:115px;" value="' + UserOptions.CustomListId + '">&nbsp;<INPUT class=btInput id=pbFBListHelp type=submit value="'+tx('HELP')+'!"></div></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btCancelReq type=checkbox '+ (UserOptions.autoCancelGamePopups?'CHECKED ':'') + '/></td><TD colspan=4 class=xtab>'+tx("Auto-cancel Facebook posts")+'</td></tr>';
		m += '<TR><td class=xtab colspan=5><B>'+tx("Merlin's Magical Token Options")+'&nbsp;</b></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btTokenEnabled type=checkbox '+ (GlobalOptions.TokenEnabled?'CHECKED ':'') +'/></td><TD colspan=2 class=xtab>'+tx("Enable automatic domain selection")+'&nbsp;&nbsp;<span class=boldRed>('+tx('All Users')+')</span></td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab width=30>'+tx('Domain to receive tokens')+':</td><TD class=xtab><input type=text id=btTokenDomain size=2 maxlength=3 class=btInput value="'+UserOptions.TokenDomain+'"></td><td class=xtab align=right>'+tx('Collected Today')+':</td><td class=xtab width=10><b>'+UserOptions.TokenCount+'</b></td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab>'+tx('Substitution domains for Chest links')+':</td><TD class=xtab><input type=text id=btChestDomainList size=47 class=btInput value="'+UserOptions.ChestDomainList+'" title="'+tx('List some domains you do NOT play in here, separated by commas.')+'"></td><td class=xtab align=right>'+tx('Total Owned')+':</td><td class=xtab width=10><b><span id=btTokenNum>&nbsp;</span></b></td></tr>';
		m += '<tr><td class=xtab><img src="'+TokenImage+'" width=30></td><td class=xtab colspan=4><input type=text id=btTokenLink size=100 class=btInput value="'+UserOptions.TokenLink+'" title="'+tx('Store link to ?page=merlinshare URL')+'">&nbsp;<input class=btInput id=btCollectToken type=button value="'+tx("Collect")+'">&nbsp;<span id=btTokenStatus>&nbsp;</span></td></tr>';
		m += '<tr><td class=xtab><img src="'+BuildImage+'" width=30></td><td class=xtab colspan=4><input type=text id=btBuildLink size=100 class=btInput value="'+UserOptions.BuildLink+'" title="'+tx('Store link to ?page=accepttoken URL. Please note each link expires after about a month.')+'">&nbsp;<input class=btInput id=btCollectBuild type=button value="'+tx("Collect")+'">&nbsp;<span id=btBuildStatus>&nbsp;</span></td></tr>';
		m += '<tr><td class=xtab><img src="'+ChestImage+'" width=30></td><td class=xtab colspan=4><input type=text id=btChestLink size=100 class=btInput value="" title="'+tx('Paste treasure chest link URL from Facebook')+'">&nbsp;<input class=btInput id=btCollectChest type=button value="'+tx("Collect")+'">&nbsp;<span id=btStoreChestSpan class=divHide><input class=btInput id=btStoreChest type=button value="'+tx("Store")+'">&nbsp;</span><span id=btChestStatus>&nbsp;</span></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btTokenAuto type=checkbox '+ (UserOptions.TokenAuto?'CHECKED ':'') +'/></td><TD colspan=2 class=xtab>'+tx("Enable automatic token collection during reload cycle")+'</td></tr>';
		m += '<TR><td class=xtab>&nbsp;</td><TD class=xtab>'+tx("Override reload interval to")+' <INPUT id=btOverrideRefresh type=text size=2 maxlength=3 value="'+UserOptions.OverrideRefresh+'" \> '+tx("minutes")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';

		m += '<TR><td class=xtab colspan=5><B>'+tx("Treasure Chest Options")+'&nbsp;</b></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btTreasureChest type=checkbox '+ (UserOptions.TreasureChest?'CHECKED ':'') +'/></td><TD class=xtab colspan=2>'+tx("Auto-click found Treasure Chests")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=btChestBank type=checkbox '+ (UserOptions.BankTreasureChests?'CHECKED ':'') +'/></td><TD colspan=2 class=xtab>'+tx("Store Treasure Chest links internally")+'</td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab>'+tx('Maximum number of your links to store')+':</td><TD class=xtab><input type=text id=btMaxChestBank size=3 maxlength=5 class=btInput value="'+UserOptions.MaxBankedTreasureChests+'"></td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab>'+tx('Your Links')+':&nbsp;<span id=btBankYours></span></td><TD class=xtab colspan=3><input class=btInput id=btUseYourChests type=button value="'+tx("Use Link")+'"><input class=btInput style="width:100px;display:none;" id=btClearYourChests type=button value="'+tx("Remove ALL")+'">&nbsp;<input class=btInput style="width:100px;" id=btPostYourChests type=button value="'+tx("Post to Facebook")+'">&nbsp;<input class=btInput style="width:100px;" id=btExportChests type=button value="'+tx("Export to File")+'">&nbsp;&nbsp;<input class=btInput id=btExportChestsNumber type=text size=3 maxlength=4>&nbsp;'+tx('links')+'</td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab>'+tx('Other Links')+':&nbsp;<span id=btBankOthers></span></td><TD class=xtab colspan=3><input class=btInput id=btUseOtherChests type=button value="'+tx("Use Link")+'">&nbsp;<input class=btInput style="width:100px;" id=btClearOtherChests type=button value="'+tx("Remove ALL")+'">&nbsp;<input class=btInput style="width:100px;" id=btImportChests type=button value="'+tx("Import from File")+'">&nbsp;<input class=btInput id=btImportChestsFile type=file></td></tr>';

		m += '</table>';
		m += '<div id=btuser_messages align=center>&nbsp;</div>';

		ById('btUserOption').innerHTML = m;

		ById('btBankYours').innerHTML = '<b>'+UserOptions.TreasureChestBank.length+'</b>';
		ById('btBankOthers').innerHTML = '<b>'+UserOptions.TreasureChestBankOther.length+'</b>';

		ById('btTokenNum').innerHTML = parseIntNan(Seed.items.i599);

		if (UserOptions.TokenCollected) { ById('btCollectToken').style.display = 'none'; ById('btTokenStatus').innerHTML = '<span class=boldGreen>'+tx('Collected')+'</span>'; }
		else {
			if (UserOptions.LastTokenStatus != "" && UserOptions.LastTokenStatus != "OK") { ById('btTokenStatus').innerHTML = '<span class=boldRed>'+tx(capitalize(UserOptions.LastTokenStatus))+'</span>'; }
		}
		if (UserOptions.BuildCollected) { ById('btCollectBuild').style.display = 'none'; ById('btBuildStatus').innerHTML = '<span class=boldGreen>'+tx('Collected')+'</span>'; }
		else {
			if (UserOptions.LastBuildStatus != "" && UserOptions.LastBuildStatus != "OK") { ById('btBuildStatus').innerHTML = '<span class=boldRed>'+tx(capitalize(UserOptions.LastBuildStatus))+'</span>'; }
		}
		var bonus = "";
		if (UserOptions.BonusCollected) { bonus = " +1"; }
		var chestcollected = 0;
		var DomArray = UserOptions.ChestDomainList.split(",");
		var chesttotal = DomArray.length;
		for (var d=0; d < DomArray.length; d++) {
			if (DomArray[d]) {
				if (UserOptions.ChestCollected[DomArray[d]]) { chestcollected++; }
			}
		}
		if (chestcollected!=0 || UserOptions.BonusCollected) {
			if (chestcollected >= chesttotal) {
				ById('btChestStatus').innerHTML = '<span class=boldGreen>'+tx('Collected')+' ('+chestcollected+'/'+chesttotal+')'+bonus+'</span>';
				ById('btCollectChest').style.display = 'none';
			}
			else {
				ById('btChestStatus').innerHTML = '<span>('+chestcollected+'/'+chesttotal+')'+bonus+'</span>';
			}
		}
		if (UserOptions.LastChestStatus != "" && UserOptions.LastChestStatus != "OK") { ById('btChestStatus').innerHTML += '&nbsp;<span class=boldRed>'+tx(capitalize(UserOptions.LastChestStatus))+'</span>'; }

		ById('btPubReq').addEventListener('change', function() {
			UserOptions.autoPublishGamePopups = ById('btPubReq').checked;
			if (UserOptions.autoPublishGamePopups) {
				UserOptions.autoCancelGamePopups = false;
				ById('btCancelReq').checked = false;
			}
			saveUserOptions(uW.user_id);
		},false);
		ById('btCancelReq').addEventListener('change', function() {
			UserOptions.autoCancelGamePopups = ById('btCancelReq').checked;
			if (UserOptions.autoCancelGamePopups) {
				UserOptions.autoPublishGamePopups = false;
				ById('btPubReq').checked = false;
			}
			saveUserOptions(uW.user_id);
		},false);
		ById('RefreshPublishList').addEventListener ('click',function(){t.AddUserLists()},false);
		t.changeUserOpt ('btCustomList','CustomListId');
		t.changeUserOpt ('selectprivacymode','autoPublishPrivacySetting',t.ToggleCustomList);
		t.ToggleCustomList();
		ById ('pbFBListHelp').addEventListener ('click', t.helpPop, false);
			t.togGlobalOpt('btTokenEnabled','TokenEnabled'); // GLOBAL!!!!
			t.changeUserOpt ('btTokenDomain','TokenDomain');
		t.togUserOpt('btTokenAuto','TokenAuto');
		ById('btOverrideRefresh').addEventListener('change', function() {
			if (parseIntNan(ById('btOverrideRefresh').value)==0) {
				ById('btOverrideRefresh').value = "";
			}
			UserOptions.OverrideRefresh = ById('btOverrideRefresh').value;
			saveUserOptions(uW.user_id);
			t.RestartReminder();
		},false);
		ById('btChestDomainList').addEventListener ('change', t.DomainListChange, false);
		ById('btChestDomainList').addEventListener ('keyup', function (e){ StartKeyTimer(e.target, t.DomainListChange); }, false);
		ById('btTokenLink').addEventListener ('change', t.TokenLinkChange, false);
		ById('btTokenLink').addEventListener ('keyup', function (e){ StartKeyTimer(e.target, t.TokenLinkChange); }, false);
		ById('btBuildLink').addEventListener ('change', t.BuildLinkChange, false);
		ById('btBuildLink').addEventListener ('keyup', function (e){ StartKeyTimer(e.target, t.BuildLinkChange); }, false);

		ById('btCollectToken').addEventListener('click', function () {
			if (UserOptions.TokenLink != "" && UserOptions.TokenLink.search(/merlinshare/i) != -1) {
				if (GlobalOptions.TokenEnabled){
					UserOptions.TokenRequest = 'TOKEN';
					saveUserOptions(uW.user_id);
				}
				var goto = UserOptions.TokenLink;
				setTimeout (function (){window.top.location = goto;}, 0);
			}
		}, false);
		ById('btCollectBuild').addEventListener('click', function () {
			if (UserOptions.BuildLink != "" && UserOptions.BuildLink.search(/accepttoken/i) != -1) {
				if (GlobalOptions.TokenEnabled){
					UserOptions.TokenRequest = 'BUILD';
					saveUserOptions(uW.user_id);
				}
				var goto = UserOptions.BuildLink;
				setTimeout (function (){window.top.location = goto;}, 0);
			}
		}, false);

		ById('btCollectChest').addEventListener('click', function () {
			if (ById('btChestLink').value != "") {
				if (GlobalOptions.TokenEnabled){
					UserOptions.TokenRequest = 'CHEST';
					saveUserOptions(uW.user_id);
				}
				var goto = ById('btChestLink').value;
				// replace domain in link...
				var DomArray = UserOptions.ChestDomainList.split(",");
				for (var d=0; d < DomArray.length; d++) {
					if (DomArray[d]) {
						if (!UserOptions.ChestCollected[DomArray[d]]) {
							repstring = "=s%3A"+DomArray[d];
							goto = goto.replace(/=s%3A\d\d\d/g,repstring);
							goto = goto.replace(/&s=\d\d\d/g,repstring);
							break;
						}
					}
				}
				setTimeout (function (){window.top.location = goto;}, 0);
			}
		}, false);

		if (trusted) jQuery('#btStoreChestSpan').removeClass("divHide");
		ById('btStoreChest').addEventListener('click', function () {
			if (ById('btChestLink').value != "") {
				var post_link = ById('btChestLink').value;
				if (post_link.indexOf("convert.php?pl=1&ty=3&si=118&")!=-1) {
					var c_tokenId = post_link.slice(post_link.indexOf('%7Cm%3A') + 7, post_link.indexOf('%7Cimg'));
					var c_serverId = post_link.slice(post_link.indexOf('&ex=s%3A') + 8, post_link.indexOf('%7Cf%3A'));
					var c_playerId = post_link.slice(post_link.indexOf('&in=') + 4, post_link.indexOf('&ex=s'));
					var c_feedId = post_link.slice(post_link.indexOf('%7Cf%3A') + 7, post_link.indexOf('%7Cm%3A'));
					if (c_tokenId && c_feedId && c_playerId && c_serverId) {
						if (c_playerId!=uW.tvuid) {
							if (!t.checkFeedId(c_feedId)) {
								UserOptions.TreasureChestBankOther.push({tokenId:c_tokenId, feedId:c_feedId, serverId:c_serverId, playerId:c_playerId, tileName:"", unixTime_taken:unixTime(), link:post_link});
								ById('btChestLink').value = "";
								ById('btuser_messages').innerHTML = tx('Link successfully loaded to Other Links');
								ById('btBankOthers').innerHTML = '<b>'+UserOptions.TreasureChestBank.length+'</b>';
							}
							else { ById('btuser_messages').innerHTML = tx('Link already stored'); }
						}
						else {
							if (!t.checkYourFeedId(c_feedId)) {
								UserOptions.TreasureChestBank.push({tokenId:c_tokenId, feedId:c_feedId, serverId:c_serverId, playerId:c_playerId, tileName:"", unixTime_taken:unixTime(), link:post_link});
								ById('btChestLink').value = "";
								ById('btuser_messages').innerHTML = tx('Link successfully loaded to Your Links');
								ById('btBankYours').innerHTML = '<b>'+UserOptions.TreasureChestBank.length+'</b>';
							}
							else { ById('btuser_messages').innerHTML = tx('Link already stored'); }
						}
						saveUserOptions(uW.user_id);
					}
					else { ById('btuser_messages').innerHTML = tx('Invalid Treasure Chest link'); }
				}
				else { ById('btuser_messages').innerHTML = tx('Invalid Treasure Chest link'); }
			}
		}, false);

		t.togUserOpt ('btTreasureChest', 'TreasureChest', TreasureChestClick.setEnable, TreasureChestClick.isAvailable);
		t.togUserOpt ('btChestBank', 'BankTreasureChests');
		ById('btMaxChestBank').addEventListener('change', function() {
			UserOptions.MaxBankedTreasureChests = parseIntNan(ById('btMaxChestBank').value);
			ById('btMaxChestBank').value = UserOptions.MaxBankedTreasureChests;
			saveUserOptions(uW.user_id);
		},false);

		ById('btUseYourChests').addEventListener ('click',function() {
			t.CreateLink(true,false);
		},false);

		ById('btUseOtherChests').addEventListener ('click',function() {
			t.CreateLink(false,false);
		},false);

		ById('btPostYourChests').addEventListener ('click',function() {
			var chest = UserOptions.TreasureChestBank.shift();

			var reparr = new Array();
			reparr.push(["REPLACE_TiLeNaMe", chest.tileName]);
			reparr.push(["REPLACE_fEeDiD", chest.feedId]);
			reparr.push(["REPLACE_tOkEnId", chest.tokenId]);
			uW.common_postToProfile("118", reparr);

			saveUserOptions(uW.user_id);
			ById('btuser_messages').innerHTML = tx('Treasure Chest posted to Facebook');
			ById('btBankYours').innerHTML = '<b>'+UserOptions.TreasureChestBank.length+'</b>';
		},false);

		ById('btClearYourChests').addEventListener ('click',function() {
			UserOptions.TreasureChestBank = [];
			saveUserOptions(uW.user_id);
			ById('btuser_messages').innerHTML = tx('Your Treasure Chest links cleared');
			ById('btBankYours').innerHTML = '<b>'+UserOptions.TreasureChestBank.length+'</b>';
		},false);

		ById('btClearOtherChests').addEventListener ('click',function() {
			UserOptions.TreasureChestBankOther = [];
			saveUserOptions(uW.user_id);
			ById('btuser_messages').innerHTML = tx('Other Treasure Chest links cleared');
			ById('btBankOthers').innerHTML = '<b>'+UserOptions.TreasureChestBankOther.length+'</b>';
		},false);

		ById('btExportChests').addEventListener ('click',function() {
			var numchests = parseIntNan(ById('btExportChestsNumber').value);
			if (numchests<=0) {
				ById('btuser_messages').innerHTML = '<span style="color:#800;">'+tx('Please enter number of links to export')+'</span>';
				return;
			}
			if (numchests>UserOptions.TreasureChestBank.length) {
				ById('btuser_messages').innerHTML = '<span style="color:#800;">'+tx('Insufficient chests')+'!</span>';
				return;
			}
			var Export = {};
			Export.data = [];
			for (var i=0;i<numchests;i++) {
				var chest = UserOptions.TreasureChestBank.shift();
				Export.data.push(chest);
			}
			saveUserOptions(uW.user_id);
			ById('btBankYours').innerHTML = '<b>'+UserOptions.TreasureChestBank.length+'</b>';
			uriContent = 'data:application/octet-stream;content-disposition:attachment;filename=file.txt,' + encodeURIComponent(JSON2.stringify(Export));
			t.saveConfig(uriContent,'Chests_'+uW.tvuid+'_'+yyyymmdd(new Date())+'.txt');
		},false);

		ById('btImportChests').addEventListener ('click',function() {
			ById('btuser_messages').innerHTML = '&nbsp;'
			var fileInput = ById("btImportChestsFile");
			var files = fileInput.files;
			if (files.length == 0) {
				ById('btuser_messages').innerHTML = '<span style="color:#800;">'+tx('Please select a link file')+'</span>';
				return;
			}
			var file = files[0];

			var reader = new FileReader();
			reader.onload = Tabs.Options.ChestReader;
			reader.readAsText(file);
		},false);
	},

	ChestReader : function (e) {
		var Import = JSON2.parse(e.target.result);
		var counter = 0;
		if (Import.data) {
			for (var link in Import.data) {
				if (Import.data[link].tokenId && Import.data[link].feedId && Import.data[link].playerId && Import.data[link].serverId) {
					if (Import.data[link].playerId==uW.tvuid) {
						if (!t.checkYourFeedId(Import.data[link].feedId)) {
							counter++;
							UserOptions.TreasureChestBank.push(Import.data[link]);
						}
					}
					else {
						if (!t.checkFeedId(Import.data[link].feedId)) {
							counter++;
							UserOptions.TreasureChestBankOther.push(Import.data[link]);
						}
					}
				}
				else {
					if (Import.data[link].link) {
						var post_link = Import.data[link].link;
						if (post_link.indexOf("convert.php?pl=1&ty=3&si=118&")!=-1) {
							var c_tokenId = post_link.slice(post_link.indexOf('%7Cm%3A') + 7, post_link.indexOf('%7Cimg'));
							var c_serverId = post_link.slice(post_link.indexOf('&ex=s%3A') + 8, post_link.indexOf('%7Cf%3A'));
							var c_playerId = post_link.slice(post_link.indexOf('&in=') + 4, post_link.indexOf('&ex=s'));
							var c_feedId = post_link.slice(post_link.indexOf('%7Cf%3A') + 7, post_link.indexOf('%7Cm%3A'));
							if (c_tokenId && c_feedId && c_playerId && c_serverId) {
								if (c_playerId==uW.tvuid) {
									if (!t.checkYourFeedId(c_feedId)) {
										counter++;
										UserOptions.TreasureChestBank.push({tokenId:c_tokenId, feedId:c_feedId, serverId:c_serverId, playerId:c_playerId, tileName:"", unixTime_taken:unixTime(), link:post_link});
									}
								}
								else {
									if (!t.checkFeedId(c_feedId)) {
										counter++;
										UserOptions.TreasureChestBankOther.push({tokenId:c_tokenId, feedId:c_feedId, serverId:c_serverId, playerId:c_playerId, tileName:"", unixTime_taken:unixTime(), link:post_link});
									}
								}
							}
						}
					}
				}
			}
			ById('btuser_messages').innerHTML = counter+' '+tx('Chest links successfully loaded');
			ById('btBankYours').innerHTML = '<b>'+UserOptions.TreasureChestBank.length+'</b>';
			ById('btBankOthers').innerHTML = '<b>'+UserOptions.TreasureChestBankOther.length+'</b>';
			saveUserOptions(uW.user_id);
		}
		else {
			ById('btuser_messages').innerHTML = '<span style="color:#800;">'+tx('Invalid link file')+'</span>';
		}
	},

	checkFeedId : function (FeedId) {
		var t = Tabs.Options;
		for (var c=0;c<UserOptions.TreasureChestBankOther.length;c++) {
			if (UserOptions.TreasureChestBankOther[c].feedId==FeedId) {
				return true;
			}
		}
		return false;
	},

	checkYourFeedId : function (FeedId) {
		var t = Tabs.Options;
		for (var c=0;c<UserOptions.TreasureChestBank.length;c++) {
			if (UserOptions.TreasureChestBank[c].feedId==FeedId) {
				return true;
			}
		}
		return false;
	},

	CreateLink : function (yours,auto) {
		var t = Tabs.Options;
		if (yours) { var chest = UserOptions.TreasureChestBank[0]; }
		else { var chest = UserOptions.TreasureChestBankOther[0]; }

		var c_tokenId = chest.tokenId;
		var c_serverId = chest.serverId;
		var c_playerId = chest.playerId;
		var c_feedId = chest.feedId;

		if (!UserOptions.BonusCollected && !yours && c_playerId!=uW.tvuid && !UserOptions.BadChestDomains[getServerId()]) {
			c_serverId = getServerId();
		}
		else {
			var DomArray = UserOptions.ChestDomainList.split(",");
			for (var d=0; d < DomArray.length; d++) {
				if (DomArray[d]) {
					if (!UserOptions.ChestCollected[DomArray[d]]) {
						if (!auto || !UserOptions.BadChestDomains[DomArray[d]]) {
							c_serverId = DomArray[d];
							break;
						}
					}
				}
			}
		}
		var goto = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/';
		if (CheckStandAlone()) goto = window.location.protocol+'//apps.facebook.com/kingdomsofcamelot/play';
		goto += '?page=friendFeed'+'&s='+c_serverId+'&in='+c_playerId+'&f='+c_feedId+'&t=118&m='+c_tokenId+'&si=118'+'&token_s='+getServerId();
		if (GlobalOptions.TokenEnabled){
			UserOptions.TokenRequest = 'CHEST';
			UserOptions.TokenChestFeedId = c_feedId;
			UserOptions.TokenChestUID = c_playerId;
		}
		else {
			// auto domain assign not enabled, we need to manually remove the link from the bank.
			if (yours) { UserOptions.TreasureChestBank.splice(0, 1) }
			else { UserOptions.TreasureChestBankOther.splice(0, 1) }
		}
		saveUserOptions(uW.user_id);
		setTimeout (function (){window.top.location = goto;}, 0);
	},

	TokenLinkChange : function () {
		var t = Tabs.Options;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		UserOptions.TokenLink = ById('btTokenLink').value;
		saveUserOptions(uW.user_id);
	},

	BuildLinkChange : function () {
		var t = Tabs.Options;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		UserOptions.BuildLink = ById('btBuildLink').value;
		saveUserOptions(uW.user_id);
	},

	DomainListChange : function () {
		var t = Tabs.Options;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		UserOptions.ChestDomainList = ById('btChestDomainList').value;
		saveUserOptions(uW.user_id);
		t.PaintUserOptions();
	},

	helpPop : function (){
		var t = Tabs.Options;
		var helpText = '<br>'+tx("Publishing Posts to Custom Lists");
		helpText += '<p>'+tx('In Facebook you can create custom lists of friends. Each list has a unique identifier')+'.</p>';
		helpText += '<p>'+tx('Unfortunately the custom lists can no longer be searched for, but you can still publish to just that list if you know the List ID')+'.</p>';
		helpText += '<p>'+tx('If you click on the list, the web address of the list will be displayed in the title bar of the browser. It is in the format')+'<br><br>www.facebook.com/lists/{LISTID}<br><br>'+tx('Copy the {LISTID} number and paste it into the Custom List ID box')+'.</p><br>';

		var pop = new CPopup ('BotHelp', 0, 0, 460, 280, true);
		pop.centerMe (mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>'+tx("PowerBot+ Help")+': '+tx("Facebook Lists")+'</b></center>';
		pop.show (true);
	},

	helpimgPop : function (){
		var t = Tabs.Options;
		var helpText = '<br>'+tx("Previewing Images in Chat");
		helpText += '<p>'+tx('Paste the direct link to the image, NOT the image hosting page!')+'.</p>';
		helpText += '<p>'+tx('Supported image hosting services are as follows')+':-</p>';
		helpText += '<TABLE class=xtab><TR><TD><b>'+tx('Image Host')+'</b></td><TD><b>'+tx('Image Link Example')+'</b></td></tr>';
		helpText += '<TR><TD><a href="http://imgur.com/" target="_blank">imgur.com</a></td><TD>i.imgur.com/XXXX.jpg</td></tr>';
		helpText += '<TR><TD><a href="http://tinypic.com/" target="_blank">tinypic.com</a></td><TD>i99.tinypic.com/XXXX.jpg</td></tr>';
		helpText += '<TR><TD><a href="http://postimage.org/" target="_blank">postimage.org</a></td><TD>s99.postimg.org/YYYY/XXXX.jpg</td></tr>';
		helpText += '<TR><TD><a href="http://giphy.com/" target="_blank">giphy.com</a></td><TD>i.giphy.com/XXXX.gif</td></tr>';
		helpText += '</table><br>';

		var pop = new CPopup ('BotHelp', 0, 0, 460, 280, true);
		pop.centerMe (mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>'+tx("PowerBot+ Help")+': '+tx("Image Previews")+'</b></center>';
		pop.show (true);
	},

	helpstylePop : function (){
		var t = Tabs.Options;
		var helpText = '<br>'+tx("Using Text Styles in Chat");
		helpText += '<p>'+tx('Use the following control codes to change the style of your text in chat')+'.</p>';
		helpText += '<p>'+tx('Note that multiple styles can be embedded, but must all be closed off separately')+'.</p>';
		helpText += '<TABLE class=xtab><TR><TD><b>'+tx('Control Code')+'</b></td><TD><b>'+tx('Style')+'</b></td></tr>';
		helpText += '<TR><TD>[#0]</td><TD>'+tx('Black')+'</td></tr>';
		helpText += '<TR><TD>[#1]</td><TD>'+tx('Red')+'</td></tr>';
		helpText += '<TR><TD>[#2]</td><TD>'+tx('Green')+'</td></tr>';
		helpText += '<TR><TD>[#3]</td><TD>'+tx('Blue')+'</td></tr>';
		helpText += '<TR><TD>[#4]</td><TD>'+tx('Magenta')+'</td></tr>';
		helpText += '<TR><TD>[#5]</td><TD>'+tx('Cyan')+'</td></tr>';
		helpText += '<TR><TD>[#6]</td><TD>'+tx('Yellow')+'</td></tr>';
		helpText += '<TR><TD>[#7]</td><TD>'+tx('White')+'</td></tr>';
		helpText += '<TR><TD>[#8]</td><TD>'+tx('Bold')+'</td></tr>';
		helpText += '<TR><TD>[#9]</td><TD>'+tx('Italic')+'</td></tr>';
		helpText += '<TR><TD>[#]</td><TD>'+tx('End Previous Style')+'</td></tr>';
		helpText += '</table><br>';

		var pop = new CPopup ('BotHelp', 0, 0, 460, 380, true);
		pop.centerMe (mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>'+tx("PowerBot+ Help")+': '+tx("Chat Styles")+'</b></center>';
		pop.show (true);
	},


	ToggleCustomList : function () {
		var t = Tabs.Options;
		var pub = UserOptions.autoPublishPrivacySetting;
		if (pub==99) { jQuery('#btCustomListSpan').removeClass("divHide"); }
		else { jQuery('#btCustomListSpan').addClass("divHide"); }
	},

	changeRefreshOption: function(tf) {
		var t = Tabs.Options;
		RefreshEvery.setEnable (tf);
		SetToggleButtonState('Refresh',Options.btEveryEnable,'Refresh');
	},

	toggleAutoRefreshState: function(){
		var t = Tabs.Options;
		var obj = ById('btEveryEnable');
		Options.btEveryEnable = !Options.btEveryEnable;
		if (obj) obj.checked = Options.btEveryEnable;
		RefreshEvery.setEnable (Options.btEveryEnable);
		saveOptions();
		SetToggleButtonState('Refresh',Options.btEveryEnable,'Refresh');
	},

	toggleAutoRaidState: function(){
		var t = Tabs.Options;
		var obj = ById('togResetRaids');
		Options.RaidRunning = !Options.RaidRunning;
		saveOptions();
		if (obj) obj.checked = Options.RaidRunning;
		t.ToggleRaidActive();
	},

	PaintTowerOptions : function () {
		var t = Tabs.Options;

		m = '<br><div align=center><table class=xtab width=100%>';
		m += '<TR><TD colspan=2 align=left><b>'+tx("Minimum number of Troops to trigger Tower Alert")+':&nbsp;<INPUT id=pbalertTroops type=text size=7 value="'+ Options.TowerOptions.minTroops +'" \></b>&nbsp;('+tx("Controls All Tower Options")+')<br>&nbsp;</td></tr>';
		m += '</table><TABLE width=98% cellspacing=0 class=xtab><tr><th class=xtabHD align=left>&nbsp;'+uW.g_js_strings.commonstr.city+'</th><th class=xtabHD align=center>'+tx("Active")+'</th><th class=xtabHD align=left>&nbsp;'+tx("WatchTower")+'</th><th class=xtabHD align=left>&nbsp;'+tx("Chat Alert Message")+'</th></tr>';

		for (var cityId in Cities.byID) {
			var wlevel = getUniqueCityBuilding(cityId,14).maxLevel;
			if (wlevel!=0) {wleveltext = 'Level '+wlevel; }
			else {wleveltext = '<span style="color:#800;"><b>None!</b></style>';}
			m+= '<tr><TD><b>'+Cities.byID[cityId].name+'</b></td><td align=center><INPUT id=toweractive_'+cityId+' name='+cityId+' type=checkbox '+(Options.TowerOptions.towercityactive[cityId]?'CHECKED ':'')+'"></TD><td align=left>'+wleveltext+'</td><td align=left><INPUT id=towertext_'+cityId+' name='+cityId+' type=text style="width: 400px;" maxlength=120 value="'+(Options.TowerOptions.towercitytext[cityId]?Options.TowerOptions.towercitytext[cityId]:"")+'"></td></tr>';
		};

		ChampionObj = {0:'-- '+tx('Select Champion')+' --'};
		for (var y in Seed.champion.champions) {
			var chkchamp = Seed.champion.champions[y];
			if (chkchamp.championId) {
				ChampionObj[chkchamp.championId] = chkchamp.name;
			}
		}

		m += '</tr></table></div><br>';

		m += '<TABLE width=100% class=xtab>';
		m += '<TR><TD><INPUT id=pbalertScout type=checkbox '+ (Options.TowerOptions.scouting?'CHECKED ':'') +'/></td><TD>'+tx("Alert when being scouted")+'&nbsp;&nbsp;&nbsp;';
		m += '<INPUT id=pbalertWild type=checkbox '+ (Options.TowerOptions.wilds?'CHECKED ':'') +'/>&nbsp;'+tx("Alert on wilderness attack")+'&nbsp;&nbsp;</td></tr>';
		m += '<TR><TD><INPUT id=pbalertEnable type=checkbox '+ (Options.TowerOptions.aChat?'CHECKED ':'') +'/></td><TD>'+tx("Post incoming attacks to Alliance Chat")+'</td></tr>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertWhisper type=checkbox '+ (Options.TowerOptions.whisper?'CHECKED ':'') +'/>&nbsp;'+tx("Whisper to yourself instead, if less than")+'&nbsp;<INPUT id=pbwhisperTroops type=text size=7 value="'+ Options.TowerOptions.whisperTroops +'" \>&nbsp;'+tx("incoming troops")+'</td></tr>';
		m += '<TR><td>&nbsp;</td><TD>'+tx("Chat Message Prefix")+':&nbsp;<INPUT id=pbalertPrefix type=text style="width: 400px;" maxlength=120 value="'+ Options.TowerOptions.aPrefix +'" \></td><tr>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertAFK type=checkbox '+ (Options.TowerOptions.afk?'CHECKED ':'') +'/>&nbsp;'+tx("Display your AFK status")+'</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertChamp type=checkbox '+ (Options.TowerOptions.champ?'CHECKED ':'') +'/>&nbsp;'+tx("Display your city champion name")+'</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertDefend type=checkbox '+ (Options.TowerOptions.defend?'CHECKED ':'') +'/>&nbsp;'+tx("Display your city defend status")+'</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertTech type=checkbox '+ (Options.TowerOptions.tech?'CHECKED ':'') +'/>&nbsp;'+tx("Display your research information")+'</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertUpkeep type=checkbox '+ (Options.TowerOptions.upkeep?'CHECKED ':'') +'/>&nbsp;'+tx("Display your city food remaining")+'</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertDefendMonitor type=checkbox '+ (Options.TowerOptions.DefendMonitor?'CHECKED ':'') +'/>&nbsp;'+tx("Display defender throne monitor link")+'</td>';
		m += '<TR><td colspan=2><b>'+tx("Sound Options")+':</b></td></tr>';
		m += '<TR><TD><INPUT id=pbSoundEnable type=checkbox '+ (Options.TowerOptions.alertSound.enabled?'CHECKED ':'') +'/></td><TD colspan=3>'+tx("Play sound on incoming attack/scout")+'</td></tr>';
		m += '<TR><TD>&nbsp;</td><TD><DIV id=pbSoundOpts><TABLE cellpadding=0 cellspacing=0 class=xtab>';
		m += '<TR><TD>'+tx("Attack sound")+':&nbsp;</td><TD colspan=2><INPUT id=pbsoundFile type=text size=60 maxlength=1000 value="'+ Options.TowerOptions.alertSound.soundUrl +'" \>&nbsp;</td><TD><INPUT type=button class=btInput value="'+tx("Test")+'" id=pbPlayNow><INPUT id=pbSoundStop type=button class=btInput value="'+tx("Stop")+'"><INPUT id=pbSoundDefault type=button class=btInput value='+tx("Default")+' ></td></tr>';
		m += '<TR><TD>'+tx("Scout sound")+':&nbsp;</td><TD colspan=2><INPUT id=pbscoutFile type=text size=60 maxlength=1000 value="'+ Options.TowerOptions.alertSound.scoutUrl +'" \>&nbsp;</td><TD><INPUT type=button class=btInput value="'+tx("Test")+'" id=pbScoutPlayNow><INPUT id=pbScoutStop type=button class=btInput value="'+tx("Stop")+'"><INPUT id=pbScoutDefault type=button class=btInput value='+tx("Default")+' ></td></tr>';
		m += '<TR><TD>'+tx("Volume")+':&nbsp;</td><TD colspan=2><TABLE cellpadding=0 cellspacing=0 class=xtab><TR valign=middle><TD><SPAN id=pbVolSlider></span></td><TD width=15></td><TD align=right id=pbVolOut>0</td></td></table></td></tr>';
		m += '<TR><TD>&nbsp;</td><TD>Play for <INPUT id=pbSoundLength type=text size=3 maxlength=5 value="'+ Options.TowerOptions.alertSound.playLength +'"> '+tx("seconds")+'</td><TD><INPUT id=pbSoundRepeat type=checkbox '+ (Options.TowerOptions.alertSound.repeat?'CHECKED ':'') +'/>&nbsp;'+tx("Repeat every")+'&nbsp;<INPUT id=pbSoundEvery type=text size=2 maxlength=5 value="'+ Options.TowerOptions.alertSound.repeatDelay +'"> '+tx("minutes")+'</td></tr>';
		m += '</table></div></td></tr>';
		m += '<TR><td colspan=2><b>'+tx("Automatic Event Options")+':</b></td></tr>';
		m += '<TR><TD><INPUT id=pbAFKEvents type=checkbox '+ (Options.TowerOptions.AFKEvents?'CHECKED ':'') +'/></td><TD colspan=3>'+tx("Only do the selected actions when AFK (Untick to always do the selected actions)")+'</td></tr>';
		m += '<TR><TD><INPUT id=pbRevert type=checkbox '+ (Options.TowerOptions.Revert?'CHECKED ':'') +'/></td><TD colspan=3>'+tx("Revert selected actions back after")+'&nbsp;<INPUT id=pbRevertMinutes type=text size=2 maxlength=2 value="'+ Options.TowerOptions.RevertMinutes +'">&nbsp;'+tx("minutes after the last attack lands")+'&nbsp;<INPUT id=pbResetTower type=button class=btInput value="'+tx("Clear City States")+'"></td></tr>';
		m += '<TR><td colspan=2><b>'+tx("Automatic Events")+':</b></td></tr>';
		m += '<TR><TD><INPUT id=pbChangeTR type=checkbox '+ (Options.TowerOptions.ChangeTR?'CHECKED ':'') +'/></td><TD colspan=3>'+tx("Change Throne Room to Preset")+'&nbsp;<INPUT id=pbChangeTRPreset type=text size=2 maxlength=2 value="'+ Options.TowerOptions.ChangeTRPreset +'"></td></tr>';
		m += '<TR><TD><INPUT id=pbChangeGuardian type=checkbox '+ (Options.TowerOptions.ChangeGuardian?'CHECKED ':'') +'/></td><TD colspan=3>'+tx("Switch to Wood Guardian in city being attacked")+'</td></tr>';
		m += '<TR><TD><INPUT id=pbChangeChampion type=checkbox '+ (Options.TowerOptions.ChangeChamp?'CHECKED ':'') +'/></td><TD colspan=3>'+tx("Assign Champion")+'&nbsp;'+htmlSelector(ChampionObj,Options.TowerOptions.ChampId,"id=pbChampionId")+'&nbsp;'+tx("when attacking march is")+'&nbsp;<INPUT id=pbChampTime type=text size=2 maxlength=2 value="'+ Options.TowerOptions.ChampTime +'">&nbsp;'+tx("seconds away")+'</td></tr>';
		m += '<TR><TD>&nbsp;</td><td colspan=3><INPUT id=pbChampNoChamp type=checkbox '+ (Options.TowerOptions.ChampNoChamp?'CHECKED ':'') +'/>&nbsp;'+tx("Only when city does not already have a champion")+'</td></tr>';
		m += '<TR><TD><INPUT id=pbStopRaids type=checkbox '+ (Options.TowerOptions.StopRaids?'CHECKED ':'') +'/></td><TD colspan=3>'+tx("Suspend Barbarian Raids in city being attacked")+'</td></tr>';
		m += '<TR><TD><INPUT id=pbStopMarches type=checkbox '+ (Options.TowerOptions.StopMarches?'CHECKED ':'') +'/></td><TD colspan=3>'+tx("Suspend ALL automatic marches in city being attacked")+'</td></tr>';
		m += '</table><BR>';

		ById('btTowerOption').innerHTML = m;

		for (var cityId in Cities.byID){
			ById ('toweractive_'+ cityId).addEventListener('click',function(e){Options.TowerOptions.towercityactive[e.target.name] = e.target.checked;saveOptions();},false);
			ById ('towertext_'+ cityId).addEventListener('change',function(e){Options.TowerOptions.towercitytext[e.target.name] = e.target.value;saveOptions();},false);
		}

		t.volSlider = new SliderBar (ById('pbVolSlider'), 200, 21, 0);
		t.volSlider.setValue (Options.TowerOptions.alertSound.volume/100);
		t.volSlider.setChangeListener(t.e_volChanged);
		t.e_volChanged(Options.TowerOptions.alertSound.volume/100);
		t.loadUrl (Options.TowerOptions.alertSound.soundUrl); // preload URL

		ById('pbPlayNow').addEventListener ('click', function (){t.playSound(Options.TowerOptions.alertSound.soundUrl,false,'pbSoundStop')}, false);
		ById('pbSoundStop').addEventListener ('click', t.stopSoundAlerts, false);
		ById('pbSoundStop').disabled = true;

		ById('pbScoutPlayNow').addEventListener ('click', function (){t.playSound(Options.TowerOptions.alertSound.scoutUrl,false,'pbScoutStop')}, false);
		ById('pbScoutStop').addEventListener ('click', t.stopSoundAlerts, false);
		ById('pbScoutStop').disabled = true;

		ById('pbSoundRepeat').addEventListener ('change', function (e){Options.TowerOptions.alertSound.repeat = e.target.checked;saveOptions();}, false);
		ById('pbSoundEvery').addEventListener ('change', function (e){Options.TowerOptions.alertSound.repeatDelay = e.target.value;saveOptions();}, false);
		ById('pbSoundLength').addEventListener ('change', function (e){Options.TowerOptions.alertSound.playLength = e.target.value;saveOptions();}, false);
		ById('pbSoundEnable').addEventListener ('change', function (e){Options.TowerOptions.alertSound.enabled = e.target.checked;saveOptions();}, false);

		ToggleOption('TowerOptions','pbalertEnable','aChat');
		ToggleOption('TowerOptions','pbalertScout','scouting');
		ToggleOption('TowerOptions','pbalertWild','wilds');
		ToggleOption('TowerOptions','pbalertChamp','champ');
		ToggleOption('TowerOptions','pbalertAFK','afk');
		ToggleOption('TowerOptions','pbalertDefend','defend');
		ToggleOption('TowerOptions','pbalertTech','tech');
		ToggleOption('TowerOptions','pbalertUpkeep','upkeep');
		ToggleOption('TowerOptions','pbalertWhisper','whisper');
		ToggleOption('TowerOptions','pbAFKEvents','AFKEvents');
		ToggleOption('TowerOptions','pbRevert','Revert');
		ToggleOption('TowerOptions','pbChangeTR','ChangeTR');
		ToggleOption('TowerOptions','pbChangeChampion','ChangeChamp');
		ToggleOption('TowerOptions','pbChampNoChamp','ChampNoChamp');
		ToggleOption('TowerOptions','pbChangeGuardian','ChangeGuardian');
		ToggleOption('TowerOptions','pbStopRaids','StopRaids');
		ToggleOption('TowerOptions','pbStopMarches','StopMarches');
		ToggleOption('TowerOptions','pbalertDefendMonitor','DefendMonitor');

		ChangeOption('TowerOptions','pbalertPrefix','aPrefix');
		ChangeOption('TowerOptions','pbalertTroops','minTroops');
		ChangeOption('TowerOptions','pbwhisperTroops','whisperTroops');
		ChangeOption('TowerOptions','pbRevertMinutes','RevertMinutes');
		ChangeOption('TowerOptions','pbChangeTRPreset','ChangeTRPreset');
		ChangeIntegerOption('TowerOptions','pbChampTime','ChampTime',10);
		ChangeOption('TowerOptions','pbChampionId','ChampId');

		ById('pbResetTower').addEventListener ('click', t.resetCityStates, false);

		ById('pbsoundFile').addEventListener ('change', function (){
			Options.TowerOptions.alertSound.soundUrl = ById('pbsoundFile').value;
			saveOptions();
			t.loadUrl (Options.TowerOptions.alertSound.soundUrl);
		}, false);
		ById('pbSoundDefault').addEventListener ('click', function (){
			Options.TowerOptions.alertSound.soundUrl = DEFAULT_ALERT_SOUND_URL;
			saveOptions();
			ById('pbsoundFile').value = DEFAULT_ALERT_SOUND_URL;
			t.loadUrl (DEFAULT_ALERT_SOUND_URL);
		}, false);

		ById('pbscoutFile').addEventListener ('change', function (){
			Options.TowerOptions.alertSound.scoutUrl = ById('pbscoutFile').value;
			saveOptions();
			t.loadUrl (Options.TowerOptions.alertSound.scoutUrl);
		}, false);
		ById('pbScoutDefault').addEventListener ('click', function (){
			Options.TowerOptions.alertSound.scoutUrl = DEFAULT_SCOUT_SOUND_URL;
			saveOptions();
			ById('pbscoutFile').value = DEFAULT_SCOUT_SOUND_URL;
			t.loadUrl (DEFAULT_SCOUT_SOUND_URL);
		}, false);
	},

	resetCityStates : function () {
		var t = Tabs.Options;
		Options.TowerOptions.RecentActivity = false;
		Options.TowerOptions.LastAttack = 0;
		Options.TowerOptions.HandledMarches = new Array();
		Options.TowerOptions.LatestAttackTimes = {};
		Options.TowerOptions.RecentCityActivity = {};
		Options.TowerOptions.SaveCityState = {};
		Options.TowerOptions.SaveTR = 0;
		Options.TowerOptions.ChampOriginalCity = 0;
		saveOptions();
	},

	loadUrl : function (url) {
		var t = Tabs.Options;
		if (t.mss) { t.mss.setSource(url); }
	},

	PaintFixOptions : function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=ptEnableMiniRefresh type=checkbox ' + (Options.MiniRefresh ? 'CHECKED ' : '') + '/></td><TD class=xtab>&nbsp;'+tx("Refresh Data/Marches every");
		m += '<INPUT id=ptMiniRefreshInterval type=text size=3 value="' + Options.MiniRefreshInterval + '">&nbsp;'+tx("minutes")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togRemovePointless type=checkbox /></td><TD class=xtab>'+tx("Hide pointless items from Inventory views")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChampLagFix type=checkbox /></td><TD class=xtab>'+tx("Fix delay when opening Castle, Rally Point and Boss Battle")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togTowerFix type=checkbox /></td><TD class=xtab>'+tx("Fix tower alert to show exact target (city or wild)")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togKnightSelect type=checkbox /></td><TD class=xtab>'+tx("Do not automatically select a knight when changing march type to Scout, Transport or Reassign")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togFilterTroopsFix type=checkbox /></td><TD class=xtab>'+tx("Don't filter troop types for transport")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togStalledMarches type=checkbox /></td><TD class=xtab>'+tx("Fix stalled marches and missing knights")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togCoordBox type=checkbox /></td><TD class=xtab>'+tx("Keep map coordinate box/bookmarks on top of troop activity")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapInfo2 type=checkbox /></td><TD class=xtab>'+tx("Add reassign button when clicked on own city")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapInfo type=checkbox /></td><TD class=xtab>'+tx("Fix reassign button on maptile info")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapInfo3 type=checkbox /></td><TD class=xtab>'+tx("Include player name / city name in new bookmarks")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togLoadCapFix type=checkbox /></td><TD class=xtab>'+tx("Limit load capacity to not exceed throne room load cap")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togTRAetherCostFix type=checkbox /></td><TD class=xtab>'+tx("Fix display of aetherstones for throne room upgrade/enhance")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMMBImageFix type=checkbox /></td><TD class=xtab>'+tx("Post correct image to facebook for Merlin Box")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatTimeFix type=checkbox /></td><TD class=xtab>'+tx("Always show local time on chat posts")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=togMoveFurniture type=checkbox /></td><td class=xtab>'+tx("Rearrange throne room furniture for better visibility")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><td class=xtab><INPUT id=togFixMightDisplay type=checkbox /></td><td class=xtab>'+tx("Fix might display on main screen")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptkillmusic type=checkbox /></td><TD class=xtab>'+tx("Kill music on startup")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptkillsounds type=checkbox /></td><TD class=xtab>'+tx("Kill sound effects on startup")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptdisableredx type=checkbox /></td><TD class=xtab>'+tx('Disable "Red X" failure animation')+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptdisablegreentick type=checkbox /></td><TD class=xtab>'+tx('Disable "Green Tick" success animation')+'</td></tr>';
		m += '</table>';

		ById('btFixOption').innerHTML = m;

		ById('ptEnableMiniRefresh').addEventListener('change', t.MiniRefreshChanged, false);
		ChangeIntegerOption('','ptMiniRefreshInterval','MiniRefreshInterval',3,t.MiniRefresh);

		ToggleOption('','togTowerFix', 'fixTower', TowerAlerts.enableFixTarget, TowerAlerts.isFixTargetAvailable);
		ToggleOption('','togKnightSelect', 'fixKnightSelect', AttackDialog.setEnable, AttackDialog.isAvailable);
		ToggleOption('','togFilterTroopsFix', 'DontFilterTransportTroops', AttackDialog.setEnable, AttackDialog.isAvailable);
		ToggleOption('','togStalledMarches', 'StalledMarches');
		ToggleOption('','togCoordBox', 'mapCoordsTop', CoordBox.setEnable, CoordBox.isAvailable);
		ToggleOption('','togMapInfo2', 'mapInfo2', mapinfoFix.setEnable2, mapinfoFix.isAvailable2);
		ToggleOption('','togMapInfo', 'mapInfo', mapinfoFix.setEnable, mapinfoFix.isAvailable);
		ToggleOption('','togMapInfo3', 'mapInfo3', mapinfoFix.setEnable3, mapinfoFix.isAvailable3);
		ToggleOption('','togLoadCapFix', 'fixLoadCap', LoadCapFix.setEnable, LoadCapFix.isAvailable);
		ToggleOption('','togTRAetherCostFix', 'fixTRAetherCost', TRAetherCostFix.setEnable, TRAetherCostFix.isAvailable);
		ToggleOption('','togMMBImageFix', 'fixMMBImage', mmbImageFix.setEnable, mmbImageFix.isAvailable);
		ToggleOption('','togChatTimeFix', 'fixChatTime', ChatTimeFix.setEnable, ChatTimeFix.isAvailable);
		ToggleOption('','togChampLagFix', 'FixCastleLag', ChampLagFix.setEnable, ChampLagFix.isAvailable);
		ToggleOption('','togRemovePointless', 'RemovePointlessItems',t.RestartReminder);
		ToggleOption('','togMoveFurniture', 'MoveFurniture',t.RestartReminder);
		ToggleOption('','togFixMightDisplay', 'FixMightDisplay',t.RestartReminder);
		ToggleOption('','ptkillmusic', 'KillMusic');
		ToggleOption('','ptkillsounds', 'KillSounds');
		ToggleOption('','ptdisableredx', 'DisableRedX');
		ToggleOption('','ptdisablegreentick', 'DisableGreenTick');
	},

	PaintReportOptions : function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab colspan=2><B>'+tx("Alliance Report Scanner")+':</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togEnhanceAR type=checkbox /></td><TD class=xtab>'+tx("Enable scanning of Alliance Reports")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab><TABLE>';
		m += '<TR><TD class=xtab colspan=3>'+tx("Scan interval")+': <INPUT id=ptalertinterval type=text size=3 value=' + Options.ReportOptions.alertinterval + ' /> '+tx("seconds")+'</td></tr>';
		m += '<TR><TD class=xtab colspan=3><INPUT id=ptincomingar type=checkbox ' + (Options.ReportOptions.PostIncoming ? 'CHECKED ' : '') + '/>'+tx("Scan incoming attack reports")+'</td></tr>';
		m += '<TR><TD class=xtab width=50>&nbsp;</td><TD class=xtab colspan=2>'+tx("Min troops")+': <INPUT id=ptalertmtroops type=text size=6 value=' + Options.ReportOptions.alertmtroops + ' /></TD></TR>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptalertignorewilds type=checkbox ' + (Options.ReportOptions.IgnoreWilds ? 'CHECKED ' : '') + '/>'+tx("Ignore incoming wild attacks")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptalertignorescouts type=checkbox ' + (Options.ReportOptions.IgnoreScouts ? 'CHECKED ' : '') + '/>'+tx("Ignore incoming scouts")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptwhisperar type=checkbox ' + (Options.ReportOptions.WhisperAR ? 'CHECKED ' : '') + '/>'+tx("Whisper incoming attack reports to yourself and the following players (separated by commas)")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td class=xtab width=50>&nbsp;</td><td class=xtab><INPUT id=ptwhisperarlist type=text size=70 value="' + Options.ReportOptions.WhisperARList + '"></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptnoduplicatereports type=checkbox ' + (Options.ReportOptions.NoDuplicateReports ? 'CHECKED ' : '') + '/>'+tx("Do not post reports already posted by another alliance member")+'&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#800;"><b>(WORK IN PROGRESS)</b></span></td></tr>';
		m += '<TR><TD class=xtab colspan=3><INPUT id=ptwhisperoutgoing type=checkbox ' + (Options.ReportOptions.WhisperOutgoing ? 'CHECKED ' : '') + '/>'+tx("Whisper your own outgoing attack reports to yourself")+'</td></tr></table></td></tr>';

		m += '<TR><TD class=xtab colspan=2><B>'+tx('Automatic Report Deletion')+':</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletebctoggle type=checkbox /></td><TD class=xtab> '+tx("Delete barbarian camp reports/Transport reports from you")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletetrtoggle type=checkbox /></td><TD class=xtab> '+tx("Delete transport reports to you")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletewltoggle type=checkbox /></td><TD class=xtab> '+tx("Delete wilderness reports")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeleteaatoggle type=checkbox /></td><TD class=xtab> '+tx("Delete auto-attack reports (and log items for attack summary)")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletedftoggle type=checkbox /></td><TD class=xtab> '+tx("Delete dark forest reports (and log items for DF summary)")+'</td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab><INPUT id=pbdfreport type=checkbox '+ (Options.DFReport?' CHECKED':'') +'\>&nbsp;'+tx("Send DF report every")+'&nbsp;<INPUT id=pbdfreportinterval value='+ Options.DFReportInterval +' type=text size=3 \>&nbsp;'+tx('hours')+'&nbsp;&nbsp;&nbsp;'+strButton8(tx('Send Now'), 'id=pbdfreportsend')+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletesctoggle type=checkbox /></td><TD class=xtab> '+tx("Delete ALL incoming scout reports")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletefrtoggle type=checkbox /></td><TD class=xtab> '+tx("Delete incoming attack/scout reports from friendly alliances")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeleteidtoggle type=checkbox /></td><TD class=xtab> '+tx("Delete incoming")+' '+htmlSelector({0:tx("attack/scout"),4:tx("attack"),3:tx("scout")},Options.ReportOptions.DeleteRptidType,"id=pbdeleteidtype class=btInput")+' '+tx("reports from the following UIDs (separated by commas)")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab><input id=pbdeleteuidreps type=text size=100 /></td></tr>';
		m += '</table>';

		ById('btReportOption').innerHTML = m;

		ToggleOption('ReportOptions','togEnhanceAR', 'EnhanceAR', AllianceReportsCheck.enable);
		ToggleOption('ReportOptions','ptincomingar', 'PostIncoming');
		ToggleOption('ReportOptions','ptwhisperoutgoing', 'WhisperOutgoing');
		ToggleOption('ReportOptions','ptalertignorescouts', 'IgnoreScouts');
		ToggleOption('ReportOptions','ptalertignorewilds', 'IgnoreWilds');
		ToggleOption('ReportOptions','ptwhisperar', 'WhisperAR');
		ToggleOption('ReportOptions','pbdeletebctoggle', 'DeleteRptbc');
		ToggleOption('ReportOptions','pbdeletetrtoggle', 'DeleteRpttr');
		ToggleOption('ReportOptions','pbdeletewltoggle', 'DeleteRptwl');
		ToggleOption('ReportOptions','pbdeleteaatoggle', 'DeleteRptaa');
		ToggleOption('ReportOptions','pbdeletefrtoggle', 'DeleteRptfr');
		ToggleOption('ReportOptions','pbdeleteidtoggle', 'DeleteRptid');
		ToggleOption('ReportOptions','pbdeletedftoggle', 'DeleteRptdf');
		ToggleOption('ReportOptions','pbdeletesctoggle', 'DeleteRptsc');

		ChangeOption('ReportOptions','ptalertinterval', 'alertinterval');
		ChangeOption('ReportOptions','ptalertmtroops', 'alertmtroops');
		ChangeOption('ReportOptions','ptwhisperarlist', 'WhisperARList');
		ChangeOption('ReportOptions','pbdeleteuidreps', 'DeleteRptUID');
		ChangeOption('ReportOptions','pbdeleteidtype', 'DeleteRptidType');
		ChangeOption('ReportOptions','ptnoduplicatereports', 'NoDuplicateReports');

		ById('pbdfreportinterval').addEventListener('keyup', function () {
			if (isNaN(ById('pbdfreportinterval').value) || ById('pbdfreportinterval').value<1) { ById('pbdfreportinterval').value = 1; }
			Options.DFReportInterval = ById('pbdfreportinterval').value;
			saveOptions();
			t.sendDFReport();
		}, false);
		ById('pbdfreportsend').addEventListener('click', function () {
			Options.LastDFReport = 0;
			saveOptions();
			t.sendDFReport(true);
		}, false);
		ToggleOption('','pbdfreport','DFReport',t.sendDFReport);
	},

	PaintDashOptions : function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=btShowDashboard type=checkbox /></td><TD class=xtab>'+tx("Show Dashboard")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btFloatingDashboard type=checkbox /></td><TD class=xtab>'+tx("Floating Dashboard")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD colspan=2 class=xtab>'+tx("Dashboard Width:")+' '+ htmlSelector({480:'480 pixels', 540:'540 pixels', 600:'600 pixels'},Options.DashboardOptions.DashWidth,'id=btDashWidth')+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><td class=xtab width=30><INPUT id=UpperDefChk type=checkbox /></td><td class=xtab width=300>'+tx("Overview defend button")+'</td><td class=xtab width=30><INPUT id=LowerDefChk type=checkbox /></td><td class=xtab>'+tx("Troops defend button")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=PresetChk type=checkbox /></td><td colspan="3" class=xtab>'+tx("Show throne room preset changer")+'</td></tr>';
		m += '<TR id=btPresetByNameOpts class="divHide"><td class=xtab><INPUT id=TRPresetByNameChk type=checkbox /></td><td colspan="3" class=xtab>'+tx("Select presets by name")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=GraphChampChk type=checkbox /></td><td colspan="3" class=xtab>'+tx("Graphical champion selector")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=QuickSacChk type=checkbox /></td><td colspan="3" class=xtab>'+tx("Show quick sacrifice icons")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=DefaultSacChk type=checkbox /></td><td class=xtab>'+tx("Default sacrifice duration")+'</td>';
		m += '<TD class=xtab colspan="2"><span id=btSacOpts class="divHide"><INPUT class="btInput" style="width: 30px;text-align:right;" id="btDefaultRitualMinutes" type=text maxlength=4 value="'+Options.DashboardOptions.DefaultSacrificeMin+'" onkeyup="btCheckDefaultRitual(this)">&nbsp;'+uW.g_js_strings.timestr.timemin+'&nbsp;';
		m +='<INPUT class="btInput" style="width: 15px;text-align:right;" id="btDefaultRitualSeconds" type=text maxlength=2 value="'+Options.DashboardOptions.DefaultSacrificeSec+'" onkeyup="btCheckDefaultRitual(this)">&nbsp;'+uW.g_js_strings.timestr.timesec+'</span></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>'+tx("Maximum troops to sacrifice")+'</td><TD class=xtab colspan="2"><INPUT class="btInput" style="text-align:right;" id="btSacrificeLimit" type=text size=13 maxlength=11 value="'+Options.DashboardOptions.SacrificeLimit+'">&nbsp;'+tx("troops")+'</td></tr>';

		if (SelectiveDefending) {
			m += '<TR><td class=xtab><INPUT id=DefSetFirst type=checkbox /></td><td colspan="3" class=xtab>'+tx("Show Assign Defenders section above Troop Display")+'</td></tr>';
			m += '<TR><td class=xtab><INPUT id=DefAddTroopChk type=checkbox /></td><td colspan="3" class=xtab>'+tx("Show defence add troops")+'</td></tr>';
			m += '<TR id=btDefOpts class="divHide"><TD class=xtab>&nbsp;</td><TD class=xtab>'+tx("Default add defence amount")+'</td><TD class=xtab colspan="2"><INPUT class="btInput" style="text-align:right;" id="btDefaultDefenceNum" type=text size=13 maxlength=11 value="'+Options.DashboardOptions.DefaultDefenceNum+'">&nbsp;'+tx("troops")+'</td></tr>';
			m += '<TR><td class=xtab><INPUT id=DefPresetChk type=checkbox /></td><td colspan="3" class=xtab>'+tx("Show defensive presets")+'</td></tr>';
		}

		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=4><table cellSpacing=0 width=98%>';
		m += '<TR><TD style="width:20px" class=xtabHD>'+tx("Show")+'</td><TD style="width:100px" class=xtabHD>'+tx("Section")+'</td><TD class=xtabHD>'+tx("Sequence")+'</td><TD class=xtabHD align=right><a id=btResetDash class="inlineButton btButton brown11"><span>'+tx("Reset")+'</span></a></td></tr>';

		for (var p in Dashboard.DefaultDashboard) {
			var NewObj = {};
			if (Options.DashboardOptions.OverrideDashboard[p]) {
				NewObj.Display = Options.DashboardOptions.OverrideDashboard[p].Display;
				NewObj.Sequence = Options.DashboardOptions.OverrideDashboard[p].Sequence;
			}
			else {
				NewObj.Display = Dashboard.DefaultDashboard[p].Display;
				NewObj.Sequence = Dashboard.DefaultDashboard[p].Sequence;
			}
			NewObj["name"] = p;

			m += '<tr>';
			m +='<TD style="width:20px" class="xtab"><INPUT id="dashDisp'+NewObj["name"]+'" type=checkbox '+(NewObj["Display"]?'CHECKED':'')+' onclick="btOverrideDash(\''+NewObj["name"]+'\')" /></td>';
			m += '<TD class=xtab>'+tx(NewObj["name"])+'</td>';
			m += '<TD class=xtab><INPUT class="btInput" id="dashSeq'+NewObj["name"]+'" style="width:30px;" maxlength=3 type=text value="'+NewObj["Sequence"]+'" onkeyup="btOverrideDash(\''+NewObj["name"]+'\')" /></td>';
			m += '<td class=xtab>&nbsp;</td></tr>';
		}
		m += '</table></td></tr>';
		m += '</table>';

		ById('btDashOption').innerHTML = m;

		ById('btResetDash').addEventListener ('click', function() {t.ResetDash();}, false);

		ToggleOption('','btShowDashboard', 'btDashboard',WideScreen.setDashboard); // options, not dash options...
		ToggleOption('', 'btFloatingDashboard', 'btFloatingDashboard',WideScreen.RestartDashboard);

		ById('btDashWidth').addEventListener ('change', function(){
			Options.DashboardOptions.DashWidth = parseIntNan(ById('btDashWidth').value);
			if (Options.DashboardOptions.DashWidth == 0) Options.DashboardOptions.DashWidth = 480;
			saveOptions ();
			t.RestartReminder();
		},false);

		ToggleOption('DashboardOptions','UpperDefChk', 'UpperDefendButton');
		ToggleOption('DashboardOptions','LowerDefChk', 'LowerDefendButton');
		ToggleOption('DashboardOptions','PresetChk', 'TRPresetChange', t.PresetToggle);
		t.PresetToggle();

		if (SelectiveDefending) {
			ToggleOption('DashboardOptions','DefSetFirst', 'SetDefendersFirst', WideScreen.RestartDashboard);
			ToggleOption('DashboardOptions','DefAddTroopChk', 'DefAddTroopShow', t.DefToggle);
			t.DefToggle ();
			ToggleOption('DashboardOptions','DefPresetChk', 'DefPresetShow');
			ChangeIntegerOption('DashboardOptions','btDefaultDefenceNum','DefaultDefenceNum');
		}

		ToggleOption('DashboardOptions','QuickSacChk', 'QuickSacrifice',Dashboard.PaintQuickSac);
		ToggleOption('DashboardOptions','DefaultSacChk', 'DefaultSacrifice', t.SacToggle);
		t.SacToggle();

		ToggleOption('DashboardOptions','TRPresetByNameChk', 'TRPresetByName');
		ToggleOption('DashboardOptions','GraphChampChk', 'GraphicalChampDisplay');

		ChangeIntegerOption('DashboardOptions','btSacrificeLimit','SacrificeLimit');
	},

	PaintTRPresetOptions : function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><table cellSpacing=0 width=98%>';
		m += '<TR><TD style="width:20px" class=xtabHD>'+tx('Num')+'</td><TD style="width:150px;" class=xtabHD>'+uW.g_js_strings.commonstr.nametx+'</td><TD class=xtabHD colspan=2>'+uW.g_js_strings.commonstr.select+'</td></tr>';

		for (var i=1;i<=Seed.throne.slotNum;i++) {
			m += '<tr>';
			m +='<TD style="width:20px" id="trpresetopt'+i+'" class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;"><div id="trpresetoptdiv'+i+'" class="presetBut presetButNon"><center>'+i+'</center></div></a></td>';
			m += '<TD class=xtab><INPUT class="btInput" id="btpresetLabel'+i+'" style="width:120px;" maxlength=15 type=text value="'+(Options.DashboardOptions.TRPresets[i]?Options.DashboardOptions.TRPresets[i].name:'Preset '+i)+'" onkeyup="btStartKeyTimer(this,btUpdatePresetLabel,'+i+')" onchange="btUpdatePresetLabel(this,'+i+')" /></td>';
			m += '<TD class=xtab colspan=2><INPUT type=checkbox id="btpresetSelect'+i+'" '+(Options.DashboardOptions.TRPresetsSelected[i]?'CHECKED':'')+' onclick="btToggleTRPreset('+i+')" /></td>';
			m += '</tr>';
		}
		m += '<tr><TD class=xtab style="width:20px"><INPUT type=checkbox id="btpresetCycle" '+(Options.DashboardOptions.TRPresetsCycle?'CHECKED':'')+' /></td><td class=xtab colspan=2>'+tx('Cycle through selected presets when AFK, every')+' '+'<INPUT id=btpresetCycleMins type=text size=2 value="' + Options.DashboardOptions.TRPresetsCycleMins + '">&nbsp;'+tx('minutes')+'</td>';
		if (uW.tcoPresetNames) { m += '<td class=xtab align=right><a class=xlink id=btCopyTCOPresets>'+tx('Copy Preset Names from Throne/Champ')+'</a></td>'; }
		m += '</tr>';

		m += '</table></td></tr>';
		m += '</table>';

		ById('btTRPresetOption').innerHTML = m;

		ToggleOption('DashboardOptions','btpresetCycle', 'TRPresetsCycle');
		ChangeIntegerOption('DashboardOptions','btpresetCycleMins','TRPresetsCycleMins',1);

		if (ById('btCopyTCOPresets')) {
			ById('btCopyTCOPresets').addEventListener('click',function () {
				for (var i=1;i<=Seed.throne.slotNum;i++) {
					var PresetName = uW.tcoPresetNames[i];
					if (PresetName && PresetName != "" && PresetName != "undefined") {
						ById('btpresetLabel'+i).value = uW.tcoPresetNames[i].substring(0, 15);
						Dashboard.UpdatePresetLabel(ById('btpresetLabel'+i),i);
					}
				}
				saveOptions();
			},false);
		}
		Dashboard.PaintTRPresets();
	},

	PaintChatOptions : function () {
		var t = Tabs.Options;
		m = '<TABLE width="100%">';

		m += '<TR><TD class=xtab><INPUT id=togChatStuff type=checkbox /></td><TD class=xtab colspan=2>'+tx("Enable Chat Enhancements (Clickable Co-ords, Click on Icon to Whisper, Colours, Emoticons)")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=CFilter type=checkbox /></td><TD class=xtab>'+tx("Beat chat filter so words such as \'deSCRIPTion\' can be typed")+'</td><td width=50% class=xtab>'+tx('Replacement Char')+' :&nbsp;<select id=pbfilter>';
		for(c in Filter) {
			if(c == Options.ChatOptions.fchar)
				m+='<option value='+c+' selected="selected">'+c+' ('+Filter[c]+')</option>';
			else
				m+='<option value='+c+'>'+c+' ('+Filter[c]+')</option>';
		};
		m += '</select></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatIcon type=checkbox /></td><TD class=xtab>'+tx("Show Facebook profile picture in chat instead of avatar")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatEmoticons type=checkbox /></td><TD class=xtab>'+tx("Show emoticons in chat")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatStyles type=checkbox /></td><TD class=xtab>'+tx("Show text styles in chat")+'&nbsp;<INPUT class=btInput id=pbChatStyleHelp type=submit value="'+tx('HELP')+'!"></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatImages type=checkbox /></td><TD class=xtab colspan=2>'+tx("Show linked image previews in chat")+'&nbsp;<INPUT class=btInput id=pbIMGLinkHelp type=submit value="'+tx('HELP')+'!"></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbChatHelpRequest type=checkbox /></td><TD class=xtab>'+tx("Help alliance build/research posts")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeletegAl type=checkbox /></td><TD class=xtab>'+tx("Hide alliance chat from global chat")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteRequest type=checkbox /></td><TD class=xtab>'+tx("Hide alliance requests in chat")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteReport type=checkbox /></td><TD class=xtab colspan=2>'+tx("Hide alliance report scanner posts in chat")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteGlobalSpam type=checkbox /></td><TD class=xtab>'+tx("Hide spam messages from global chat")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteAllianceSpam type=checkbox /></td><TD class=xtab>'+tx("Hide spam messages from alliance chat")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteFood type=checkbox /></td><TD class=xtab colspan=2>'+tx("Hide alliance food alerts in chat from player names")+':&nbsp;<input title="'+tx('Separate your alliance player names by commas - No spaces. Leave blank for all players.')+'" id=pbDelFoodUsers type=text size=60 /></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteAlert type=checkbox /></td><TD class=xtab colspan=2>'+tx("Hide alliance attack alerts in chat from player names")+':&nbsp;<input title="'+tx('Separate your alliance player names by commas - No spaces. Leave blank for all players.')+'" id=pbDelAlertUsers type=text size=60 /></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteScout type=checkbox /></td><TD class=xtab colspan=2>'+tx("Hide alliance scout alerts in chat from player names")+':&nbsp;<input title="'+tx('Separate your alliance player names by commas - No spaces. Leave blank for all players.')+'" id=pbDelScoutUsers type=text size=60 /></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togEnableTowerAlert type=checkbox /></td><TD class=xtab>'+tx("Enable sound alert on alliance Attack alerts")+'</td><TD width=50% class=xtab>' + htmlSelector(AlertSounds, Options.ChatOptions.TowerPlay, 'id=btTowerPlay') + '&nbsp;<a id=btTestTowerSound class="inlineButton btButton blue14"><span>Test</span></a></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togEnableScoutAlert type=checkbox /></td><TD class=xtab>'+tx("Enable sound alert on alliance Scout alerts")+'</td><TD width=50% class=xtab>' + htmlSelector(AlertSounds, Options.ChatOptions.ScoutPlay, 'id=btScoutPlay') + '&nbsp;<a id=btTestScoutSound class="inlineButton btButton blue14"><span>Test</span></a></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togEnableWhisperAlert type=checkbox /></td><TD class=xtab>'+tx("Enable sound alert on whisper")+'</td><TD width=50% class=xtab>' + htmlSelector(WhisperSounds, Options.ChatOptions.WhisperPlay, 'id=btWhisperPlay') + '&nbsp;<a id=btTestWhisperSound class="inlineButton btButton blue14"><span>Test</span></a></td></tr>';
		m += '<tr id=ptSoundOpts class="divHide"><td class=xtab>&nbsp;</td><TD class=xtab colspan=2><div><TABLE cellpadding=0 cellspacing=0><TR valign=middle><TD class=xtab>'+tx('Chat sounds volume')+'&nbsp;</td><TD class=xtab><SPAN id=ptVolSlider></span></td><TD class=xtab align=right id=ptVolOut style="width:30px;">0</td></tr></table></div></tr>';
		m += '</table>';
		m += '<TABLE><TR><TD class=xtab colspan=3><br><B>'+tx("Chat Spam")+'&nbsp;</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbspamactive type=checkbox /></td><TD class=xtab>'+tx("Spam Enabled")+'</td><TD class=xtab>' + htmlSelector({g: 'Send to Global Chat',a: 'Send to Alliance Chat'}, Options.ChatOptions.SpamType, 'id=pbspamtype') + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>'+tx("Spam Interval")+':</td><TD class=xtab><INPUT id=pbspaminterval type=text size=3 value=' + Options.ChatOptions.SpamInterval + ' /> '+tx("minutes")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD style="vertical-align:top" class=xtab>'+tx("Spam Text")+':</td><TD class=xtab><textarea id=pbspamtext rows=3 cols=40 onkeyup="ptStopProp(event);">'+Options.ChatOptions.SpamText+'</textarea></td></tr>';
		m += '</table>';
		m += '<TABLE><TR><TD class=xtab colspan=3><B>'+tx("Chat Colours")+'&nbsp;</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatGlory type=checkbox /></td><TD class=xtab>'+tx("Highlight Alliance Glory Leader")+'</td><TD colspan=2 class=xtab>'+tx("Check every")+'&nbsp;<INPUT id=pbglorycheck type=text size=2 value="' + Options.ChatOptions.GloryLeaderInterval + '">&nbsp;'+tx('minutes')+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatRainbow type=checkbox /></td><TD class=xtab colspan=2>'+tx("Display your own messages with a rainbow background")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatBold type=checkbox /></td><TD class=xtab>'+tx("Enable Bold Font")+'</td></tr>';
		var cb = '';
		if (Options.ChatOptions.chatBold) { cb = ';font-weight:bold;'; }
		m += '<TR><TD class=xtab><INPUT id=togChatGlobal type=checkbox /></td><TD class=xtab>'+tx("Enable Global Chat Background Colour")+'</td><TD class=xtab><INPUT id=togGlobal type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatGlobal + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatGlobal + cb +'" width=90px>'+tx("Global")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatAlliance type=checkbox /></td><TD class=xtab>'+tx("Enable Alliance Chat Background Colour")+'</td><TD class=xtab><INPUT id=togAll type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatAll + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatAll + cb +'" width=90px>'+tx("Alliance")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatWhisper type=checkbox /></td><TD class=xtab>'+tx("Enable Whisper Colour")+'</td><TD class=xtab><INPUT id=togWhisper type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatWhisper + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:#F8E151;color:' + Options.ChatOptions.Colors.ChatWhisper + '" width=90px><b>'+tx("Whisper")+'</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatAttack type=checkbox /></td><TD class=xtab>'+tx("Enable Tower Alert Background Colours")+'</td><TD class=xtab><INPUT id=togChatAtt type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatAtt + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatAtt + cb +'" width=90px>'+tx("Attack")+'</td>';
		m += '<TD class=xtab>&nbsp;<INPUT id=togChatScout type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatScout + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatScout + cb +'" width=90px>'+tx("Scout")+'</td>';
		m += '<TD class=xtab>&nbsp;<INPUT id=togChatRecall type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatRecall + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatRecall + cb +'" width=90px>'+tx("Recall")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatLead type=checkbox /></td><TD class=xtab>'+tx("Enable Alliance Leaders Background Colours")+'</td><TD class=xtab><INPUT id=togChatC type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatChancy + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatChancy + cb +'" width=90px>'+tx("Chancellor")+'</td>';
		m += '<TD class=xtab>&nbsp;<INPUT id=togChatVC type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatVC + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatVC + cb +'" width=90px>'+tx("Vice")+'</td>';
		m += '<TD class=xtab>&nbsp;<INPUT id=togChatLeaders type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatLeaders + '"></td>&nbsp;<TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatLeaders + cb +'" width=90px>'+tx("Officer")+'</td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>'+tx('HTML colours')+':&nbsp;<a class=xlink href="http://www.colorpicker.com/" target="_blank">'+tx('Colour Picker')+'</a>&nbsp;/&nbsp;<a class=xlink href="http://www.w3schools.com/html/html_colors.asp" target="_blank">'+tx('Colours')+'</a></td><td colspan=2 class=xtab>';
		m += makeButtonv2('blue', 'id=btResetChatColors', tx("Reset Chat Colours"));
		m += '</td></tr>';

		m += '</table>';

		ById('btChatOption').innerHTML = m;

		t.ChatVolSlider = new SliderBar (ById('ptVolSlider'), 200, 21, 0);
		t.ChatVolSlider.setValue (Options.ChatOptions.Volume/100);
		t.ChatVolSlider.setChangeListener(t.ChatVolumeChanged);
		t.ChatVolumeChanged (Options.ChatOptions.Volume/100);
		t.ChatSoundToggle();

		ById('btTestWhisperSound').addEventListener ('click', function() {
			AudioManager.setVolume(Options.ChatOptions.Volume);
			AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.WhisperPlay));
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(AudioManager.stop, 2500);
		}, false);

		ById('btTestTowerSound').addEventListener ('click', function() {
			AudioManager.setVolume(Options.ChatOptions.Volume);
			AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.TowerPlay));
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(AudioManager.stop, 5000);
		}, false);

		ById('btTestScoutSound').addEventListener ('click', function() {
			AudioManager.setVolume(Options.ChatOptions.Volume);
			AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.ScoutPlay));
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(AudioManager.stop, 5000);
		}, false);

		ToggleOption('ChatOptions','togChatStuff', 'chatEnhance', ChatStuff.setEnable, ChatStuff.isAvailable);
		ToggleOption('ChatOptions','togChatGlobal', 'chatGlobal');
		ToggleOption('ChatOptions','togChatAlliance', 'chatAlliance');
		ToggleOption('ChatOptions','togChatWhisper', 'chatWhisper');
		ToggleOption('ChatOptions','togChatBold', 'chatBold',t.PaintChatOptions);
		ToggleOption('ChatOptions','togChatAttack', 'chatAttack');
		ToggleOption('ChatOptions','togChatLead', 'chatLeaders');
		ToggleOption('ChatOptions','togChatIcon', 'chatIcons');
		ToggleOption('ChatOptions','togChatEmoticons', 'Emoticons');
		ToggleOption('ChatOptions','togChatStyles', 'Styles');
		ToggleOption('ChatOptions','togChatImages', 'ImagePreviews');

		ToggleOption('ChatOptions','togEnableWhisperAlert', 'enableWhisperAlert', t.ChatSoundToggle);
		ToggleOption('ChatOptions','togEnableTowerAlert', 'enableTowerAlert', t.ChatSoundToggle);
		ToggleOption('ChatOptions','togEnableScoutAlert', 'enableScoutAlert', t.ChatSoundToggle);

		ToggleOption('ChatOptions','pbspamactive', 'SpamActive',t.ToggleSpamActive);

		ChangeOption('ChatOptions','pbspamtype','SpamType');
		ChangeOption('ChatOptions','pbspamtext','SpamText');

		ChangeIntegerOption('ChatOptions','pbspaminterval','SpamInterval',1);

		ToggleOption('ChatOptions','CFilter', 'filter');
		ChangeOption('ChatOptions','pbfilter','fchar');

		ToggleOption('ChatOptions','pbChatHelpRequest', 'HelpRequest');
		ToggleOption('ChatOptions','pbDeleteRequest', 'DeleteRequest');
		ToggleOption('ChatOptions','pbDeletegAl', 'DeletegAl');
		ToggleOption('ChatOptions','pbDeleteFood', 'DeleteFood');
		ToggleOption('ChatOptions','pbDeleteAlert', 'DeleteAlert');
		ToggleOption('ChatOptions','pbDeleteScout', 'DeleteScout');
		ToggleOption('ChatOptions','pbDeleteReport', 'DeleteReport');
		ToggleOption('ChatOptions','pbDeleteGlobalSpam', 'DeleteGlobalSpam');
		ToggleOption('ChatOptions','pbDeleteAllianceSpam', 'DeleteAllianceSpam');
		ChangeOption('ChatOptions','pbDelFoodUsers', 'DeleteFoodUsers');
		ChangeOption('ChatOptions','pbDelAlertUsers', 'DeleteAlertUsers');
		ChangeOption('ChatOptions','pbDelScoutUsers', 'DeleteScoutUsers');

		ChangeOption('ChatOptions','btTowerPlay','TowerPlay');
		ChangeOption('ChatOptions','btScoutPlay','ScoutPlay');
		ChangeOption('ChatOptions','btWhisperPlay','WhisperPlay');

		ById('togGlobal').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatGlobal = ById('togGlobal').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatLeaders').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatLeaders = ById('togChatLeaders').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatC').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatChancy = ById('togChatC').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatVC').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatVC = ById('togChatVC').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togAll').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatAll = ById('togAll').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatAtt').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatAtt = ById('togChatAtt').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatScout').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatScout = ById('togChatScout').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatRecall').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatRecall = ById('togChatRecall').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togWhisper').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatWhisper = ById('togWhisper').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('btResetChatColors').addEventListener('click', function () {
			for (var p in ChatStuff.Colors) {
				Options.ChatOptions.Colors[p] = ChatStuff.Colors[p];
			}
			saveOptions();
			t.PaintChatOptions();
		}, false);

		ToggleOption('ChatOptions','togChatGlory','GloryLeader');
		ToggleOption('ChatOptions','togChatRainbow','Rainbow');
		ChangeIntegerOption('ChatOptions','pbglorycheck','GloryLeaderInterval',1);

		ById ('pbIMGLinkHelp').addEventListener ('click', t.helpimgPop, false);
		ById ('pbChatStyleHelp').addEventListener ('click', t.helpstylePop, false);
	},

	ChatVolumeChanged : function (val) {
		var t = Tabs.Options;
		ById('ptVolOut').innerHTML = parseInt(val*100);
		Options.ChatOptions.Volume = parseInt(val*100);
		saveOptions();
	},

	ChatSoundToggle : function () {
		var t = Tabs.Options;
		var dc = jQuery('#ptSoundOpts').attr('class');
		if (Options.ChatOptions.enableTowerAlert || Options.ChatOptions.enableScoutAlert || Options.ChatOptions.enableWhisperAlert) {if (dc.indexOf('divHide') >= 0) jQuery('#ptSoundOpts').attr('class','');}
		else {if (dc.indexOf('divHide') < 0) jQuery('#ptSoundOpts').attr('class','divHide');}
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	PaintGameOptions : function () {
		var t = Tabs.Options;
		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=togAttackPicker type=checkbox /></td><TD class=xtab colspan=2>'+tx("Enable Target City Picker in Attack Dialog (Reinforce, Reassign and Transport)")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togHideAttackEfforts type=checkbox /></td><TD class=xtab colspan=2>'+tx("Hide Attack/Speed boosts by default in attack dialog")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togPageNav type=checkbox /></td><TD class=xtab colspan=2>'+tx("Enhanced Page Navigation for Messages and Reports")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togAllRpts type=checkbox /></td><TD class=xtab colspan=2>'+tx("Enhanced Alliance Reports")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togRptGift type=checkbox /></td><TD class=xtab colspan=2>'+tx("Enhanced Inbox/Report functions")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togAllMembers type=checkbox /></td><TD class=xtab colspan=2>'+tx("Enhanced Alliance Members View")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togRptClick type=checkbox /></td><TD class=xtab colspan=2>'+tx("Alliance and Messages buttons open on Report View")+'</td></tr>';

		m += '<TR><TD class=xtab><INPUT id=togResetRaids type=checkbox /></td><TD class=xtab>'+tx("Automatically restart raid timer")+'</td><td class=xtab><INPUT id=togAutoRaidToggle type=checkbox />&nbsp;'+tx("Auto-raid restart toggle on screen header")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togRaidButtons type=checkbox /></td><TD class=xtab>'+tx("Raid Stop/Resume buttons on screen header")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td><td class=xtab><INPUT id=togRaidDeleteButton type=checkbox />&nbsp;'+tx("Raid delete button on screen header")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbGoldEnable type=checkbox /></td><TD class=xtab colspan=2>'+tx("Automatically collect gold when happiness reaches")+' <INPUT id=pbGoldLimit type=text size=2 maxlength=3 \>%</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbFoodToggle type=checkbox /></td><TD class=xtab colspan=2>'+tx("Display food alert in alliance chat when less than")+' <INPUT id=pbFoodAlertInt type=text size=2 maxlength=3 \> '+tx("hours of food remaining (checked every 15 min)")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togBatRounds type=checkbox /></td><TD class=xtab colspan=2>'+tx("Display Number of Rounds in Battle Reports")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togAtkDelete type=checkbox /></td><TD class=xtab colspan=2>'+tx("Enable Delete Button on Battle Report")+'</td></tr>';

		m += '<TR><TD class=xtab><INPUT id=togGmtClock type=checkbox /></td><TD class=xtab colspan=2>'+tx("Show")+' ' + htmlSelector({
				0: 'GMT',
				1: 'Pacific'
			}, Options.gmtClockType, 'id=btClockType') + ' '+tx("Time next to Camelot Time")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapInfo4 type=checkbox /></td><TD class=xtab colspan=2>'+tx("Display Province, Truce Status and Player Notes in Map Tooltips")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapMenuInfo type=checkbox /></td><TD class=xtab colspan=2>'+tx("Include Extra Player Information in Map Context Menu")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=MapExtra type=checkbox /></td><TD class=xtab colspan=2>'+tx("Show Player & Might in map")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=MapLevel type=checkbox /></td><TD class=xtab colspan=2>'+tx("Show Tile Level in map")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togCV type=checkbox /></td><TD class=xtab colspan=2>'+tx("Enhanced city buttons")+'</td></tr>';
		m += '<TR id=ptcvoptions1 class="divHide"><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=togDbClkDef type=checkbox />'+tx("Hide/Defend by Double-Clicking City Icon")+'</td></tr>';
		m += '<TR id=ptcvoptions2 class="divHide"><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=togColrCty type=checkbox />'+tx("Enable Colour Icon for City Faction")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR id=ptcvoptions3 class="divHide"><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptWarnAscension type=checkbox ' + (Options.WarnAscension ? 'CHECKED ' : '') + '/>'+tx("Highlight when Ascension Protection will Expire within")+' ';
		m += '<INPUT id=ptWarnAscensionInterval type=text size=3 value="' + Options.WarnAscensionInterval + '"> '+tx("Hours")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbmaintoggle type=checkbox /></td><TD class=xtab colspan=2>'+tx("Auto-select city on startup");
		m += '&nbsp;<select id=pbwhichcity>';
		m += '<option value="-1" '+ ((Options.smain==0)?'selected':'')+'>('+tx("Previously selected city")+')</option>';
		for (var h=0;h < uW.seed.cities.length;h++) {
			if (h == Options.smain)
				m+='<option value='+h+' selected="selected">'+uW.seed.cities[h][1]+'</option>';
			else
				m+='<option value='+h+'>'+uW.seed.cities[h][1]+'</option>';
		}
		m += '</select></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btFairie type=checkbox '+ (Options.KillFairie?'CHECKED ':'') +'/></td><TD class=xtab colspan=2>'+tx("Kill annoying Faire and Court popups")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=btLoginReward type=checkbox '+ (Options.LoginReward?'CHECKED ':'') +'/></td><TD class=xtab colspan=2>'+tx("Auto-click and accept Daily Login Reward")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=btMagicBox type=checkbox '+ (Options.MagicBox?'CHECKED ':'') +'/></td><TD class=xtab colspan=2>'+tx("Kill Merlins Magical Boxes on start up")+'</td></tr>';
		m += '</table>';

		ById('btGameOption').innerHTML = m;

		ById('btClockType').addEventListener('change', function () {
			Options.gmtClockType = this.value;
			saveOptions();
		}, false);

		ToggleOption('','togPageNav', 'fixPageNav', PageNavigator.enable, PageNavigator.isAvailable);
		ToggleOption('','togRptGift', 'enhancedinbox', DispReport.setEnable, DispReport.isDispReportAvailable);
		ToggleOption('','togCV', 'EnhCBtns', function () { t.EnhCBtnsToggle();t.RestartReminder(); });
		ToggleOption('','togDbClkDef', 'DbClkDefBtns');
		ToggleOption('','togColrCty', 'ColrCityBtns',t.RestartReminder);
		t.EnhCBtnsToggle();

		ToggleOption('','togResetRaids', 'RaidRunning',t.ToggleRaidActive);
		ToggleOption('','togAutoRaidToggle', 'RaidToggle',t.RestartReminder);
		ToggleOption('','togRaidButtons', 'RaidButtons',t.RestartReminder);
		ToggleOption('','togRaidDeleteButton', 'RaidDeleteButton',t.RestartReminder);
		ToggleOption('','togRptClick', 'ClickForReports',t.RestartReminder);
		ToggleOption('','togAttackPicker', 'attackCityPicker', AttackDialog.setEnable, AttackDialog.isAvailable);
		ToggleOption('','togHideAttackEfforts', 'hideAttackEfforts');
		ToggleOption('','togGmtClock', 'gmtClock', GMTclock.setEnable);
		ToggleOption('','togAllRpts', 'enhanceARpts', AllianceReports.listFunc.setEnable);
		ToggleOption('','togAllMembers', 'enhanceViewMembers', AllianceReports.enable_viewmembers);
		ToggleOption('','togBatRounds', 'dispBattleRounds', null, battleReports.isRoundsAvailable);
		ToggleOption('','togAtkDelete', 'reportDeleteButton', null, battleReports.isRoundsAvailable);
		ToggleOption('','MapExtra', 'MapShowExtra');
		ToggleOption('','MapLevel', 'MapShowLevel');
		ToggleOption('','togMapInfo4', 'dispStatus', mapinfoFix.setEnableDispStatus, mapinfoFix.isAvailableDispStatus);
		ToggleOption('','togMapMenuInfo', 'mapMenuInfo', mapinfoFix.setMenuEnable, mapinfoFix.isMenuAvailable);
		ToggleOption('','btLoginReward', 'LoginReward');
		ToggleOption('','btMagicBox', 'MagicBox');
		ToggleOption('','btFairie', 'KillFairie', FairieKiller.setEnable);
		ToggleOption('','pbmaintoggle', 'amain');
		ChangeOption('','pbwhichcity', 'smain');

		ToggleOption('','pbGoldEnable', 'pbGoldEnable');
		ChangeOption('','pbGoldLimit', 'pbGoldHappy');
		ToggleOption('','pbFoodToggle', 'pbFoodAlert');
		ChangeOption('','pbFoodAlertInt', 'pbFoodAlertInt');

		ById('ptWarnAscension').addEventListener('change', t.EnhCBtnsToggle, false);
		ChangeIntegerOption('','ptWarnAscensionInterval','WarnAscensionInterval',1,Tabs.Options.checkAscension);
	},

	PaintPBPOptions : function () {
		var t = Tabs.Options;

		var Themes = {};
		for (var a in t.Colors) Themes[a] = tx(a);

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=btEveryEnable type=checkbox /></td><TD class=xtab>'+tx("Refresh KofC every")+' <INPUT id=btEveryMins type=text size=2 maxlength=3 \> '+tx("minutes")+'</td><TD class=xtab><INPUT id=btdetafk type=checkbox '+ (Options.detAFK?'CHECKED ':'')+ '/>&nbsp;'+tx("Only when AFK")+'&nbsp;&nbsp;&nbsp;&nbsp;<INPUT id=btEveryToggle type=checkbox '+ (Options.btEveryToggle?'CHECKED ':'')+ '/>&nbsp;'+tx("Add Toggle Button")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btAutoMist type=checkbox /></td><td class=xtab>'+tx('Automatically apply Potion of Mist when AFK')+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btAutoMistMarch type=checkbox /></td><td class=xtab>'+tx('Automatically apply Potion of Mist if you lose it when marching')+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;<TD class=xtab colspan=2>'+tx("Use")+'&nbsp;'+htmlSelector(ScoutTroops,Options.QuickScoutTroops,' id=btquickscouttroops class=btInput')+'&nbsp;'+tx("for Quick Scout")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;<TD class=xtab colspan=2>'+tx("Automatic march functions should ALWAYS keep")+' <INPUT id=btfreerallyslots type=text size=2 maxlength=2 value="'+Options.FreeRallySlots+'"\> '+tx("free rally slots")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptHideOnGoto type=checkbox /></td><TD class=xtab>'+tx("Hide PowerBot+ when clicking on Map Coordinates")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptOneClickAttack type=checkbox /></td><TD class=xtab>'+tx("Enable one-click attack from the map")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btDraggableCoords type=checkbox /></td><TD class=xtab>'+tx("Enable draggable map co-ordinates box")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btGreenCastles type=checkbox /></td><TD class=xtab>'+tx("Display selected castle in green on city selection widgets")+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptFetchMarchInfo type=checkbox /></td><TD class=xtab>'+tx("Fetch additional march information from server")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptAlertOverrideChk type=checkbox /></td><TD class=xtab>'+tx("Replace gem containers with incoming attack alert timer")+'</td></tr>';
		m += '<TR><td class=xtab><INPUT id=AlternateSortOrderChk type=checkbox /></td><td class=xtab>'+tx('Display throne room stats in alternate sort order')+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btWidgetCheck type=checkbox /></td><TD class=xtab>'+tx("Enable main screen throne room widget")+'</td><td class=xtab><INPUT id=btDraggableWidget type=checkbox />&nbsp;'+tx("Draggable")+'&nbsp;<span style="font-size:14px;color:#800;">*</span>&nbsp;&nbsp;&nbsp;&nbsp;<INPUT id=btThroneHUD type=checkbox />&nbsp;'+tx("Display widget as Throne HUD")+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=TRFixPresetWidth type=checkbox /></td><td class=xtab>'+tx('Fix throne room preset changer width to 8 per row')+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btGloryMight type=checkbox /></td><td class=xtab>'+tx('Display Glory Might')+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btMarchMight type=checkbox /></td><td class=xtab>'+tx('Display Defending/Marching Troop Might')+'</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btTrafficOpt type=checkbox /></td><td class=xtab>'+tx('Display Server Traffic Monitor')+'&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>'+tx("Detect AFK when mouse and keyboard idle for")+' <INPUT id=btafktimeout type=text size=2 maxlength=3 \> '+tx("minutes")+'</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>'+tx("Map lookup request interval")+' <INPUT id=btmapinterval type=text size=2 maxlength=2 value="'+Options.MapInterval+'"\> '+tx("seconds")+'</td></tr>';
		m += '<TABLE><TR><TD class=xtab colspan=3><B>'+tx("PowerBot+ Colours")+'&nbsp;<span style="font-size:16px;color:#800;">*</span></b></td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>'+tx("Title Background")+': </td><TD class=xtab><INPUT id=togTitleBack type=text size=7 maxlength=7 value="' + Options.Colors.Title + '"></td><TD class=xtab>Text: </td><TD class=xtab><INPUT id=togTitleText type=text size=7 maxlength=7 value="' + Options.Colors.TitleText + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.Colors.Title + ';color:' + Options.Colors.TitleText + ';"><b>'+tx('Title')+'</b></td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>'+tx("Divider Background")+': </td><TD class=xtab><INPUT id=togDividerTop type=text size=7 maxlength=7 value="' + Options.Colors.DividerTop + '">&nbsp;-&nbsp;<INPUT id=togDividerBottom type=text size=7 maxlength=7 value="' + Options.Colors.DividerBottom + '"></td><TD class=xtab>Text: </td><TD class=xtab><INPUT id=togDividerText type=text size=7 maxlength=7 value="' + Options.Colors.DividerText + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background: -moz-linear-gradient(top, '+Options.Colors.DividerTop+', '+Options.Colors.DividerBottom+'); background: -webkit-linear-gradient(top, '+Options.Colors.DividerTop+', '+Options.Colors.DividerBottom+');color:' + Options.Colors.DividerText + ';"><b>'+tx('DIVIDER')+'</b></td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>'+tx("Panel Background")+': </td><TD class=xtab><INPUT id=togPanelBack type=text size=7 maxlength=7 value="' + Options.Colors.Panel + '"></td><TD class=xtab>Text: </td><TD class=xtab><INPUT id=togPanelText type=text size=7 maxlength=7 value="' + Options.Colors.PanelText + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">'+tx('Panel')+'</td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>'+tx("Highlight Background")+': </td><TD class=xtab><INPUT id=togHighlightBack type=text size=7 maxlength=7 value="' + Options.Colors.Highlight + '"></td><TD class=xtab>Text: </td><TD class=xtab><INPUT id=togHighlightText type=text size=7 maxlength=7 value="' + Options.Colors.HighlightText + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.Colors.Highlight + ';color:' + Options.Colors.HighlightText + ';"><b>'+tx('Highlight')+'</b></td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD colspan=4 class=xtab>'+tx("HTML colours")+':&nbsp;<a class=xlink href="http://www.colorpicker.com/" target="_blank">'+tx("Colour Picker")+'</a>&nbsp;/&nbsp;<a class=xlink href="http://www.w3schools.com/html/html_colors.asp" target="_blank">'+tx('Colours')+'</a></td><td class=xtab>';
		m += tx('Theme')+':&nbsp;'+htmlSelector(Themes,Options.Theme,'id=btTheme')+'&nbsp'+makeButtonv2('blue', 'id=btResetColors', tx("Reset Colours"));
		m += '</td></tr>';

		m += '</table>';

		ById('btPBPOption').innerHTML = m;

		ChangeOption ('','btEveryMins', 'btEveryMins' , RefreshEvery.setTimer);
		ToggleOption ('','btEveryEnable', 'btEveryEnable', t.changeRefreshOption);
		ToggleOption ('','btEveryToggle', 'btEveryToggle', t.RestartReminder);
		ToggleOption ('','btTrafficOpt', 'ShowServerTraffic', t.RestartReminder);
		ToggleOption ('','btAutoMist', 'AutoMist');
		ToggleOption ('','btGloryMight', 'ShowGloryMight');
		ToggleOption ('','btMarchMight', 'ShowMarchMight');
		ToggleOption ('','btAutoMistMarch', 'AutoMistMarch');
		ToggleOption ('','btdetafk', 'detAFK');

		ById('togTitleBack').addEventListener('change', function () {
			Options.Colors.Title = ById('togTitleBack').value;
			saveOptions();
			t.PaintPBPOptions();
			t.RestartReminder();
		}, false);
		ById('togTitleText').addEventListener('change', function () {
			Options.Colors.TitleText = ById('togTitleText').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togDividerTop').addEventListener('change', function () {
			Options.Colors.DividerTop = ById('togDividerTop').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togDividerBottom').addEventListener('change', function () {
			Options.Colors.DividerBottom = ById('togDividerBottom').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togDividerText').addEventListener('change', function () {
			Options.Colors.DividerText = ById('togDividerText').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togPanelBack').addEventListener('change', function () {
			Options.Colors.Panel = ById('togPanelBack').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togPanelText').addEventListener('change', function () {
			Options.Colors.PanelText = ById('togPanelText').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togHighlightBack').addEventListener('change', function () {
			Options.Colors.Highlight = ById('togHighlightBack').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togHighlightText').addEventListener('change', function () {
			Options.Colors.HighlightText = ById('togHighlightText').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('btResetColors').addEventListener('click', function () {
			var Theme = ById('btTheme').value;
			for (var p in Tabs.Options.Colors[Theme]) {
				Options.Colors[p] = Tabs.Options.Colors[Theme][p];
			}
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);

		ToggleOption('','ptOneClickAttack', 'OneClickAttack',t.RestartReminder);
		ToggleOption('','btDraggableCoords', 'DraggableCoords',t.RestartReminder);
		ToggleOption('','btGreenCastles', 'GreenCastles',t.RestartReminder);
		ToggleOption('','ptHideOnGoto', 'hideOnGoto');
		ToggleOption('','ptFetchMarchInfo', 'FetchMarchInfo');
		ToggleOption('','ptAlertOverrideChk', 'OverrideAttackAlert');
		ChangeOption('','btTheme','Theme');
		ChangeOption('','btafktimeout', 'AFKTimeout' , afkdetector.reset);

		ById('btquickscouttroops').addEventListener('change', function() {
			Options.QuickScoutTroops = ById('btquickscouttroops').value;
			saveOptions();
		}, false);

		ToggleOption('','AlternateSortOrderChk', 'AlternateSortOrder');
		ToggleOption('','btWidgetCheck', 'TRWidget', function() { Dashboard.PaintTRPresets(); WideScreen.CheckChatPosition();} );
		ToggleOption('','btDraggableWidget', 'DraggableWidget',t.RestartReminder);
		ToggleOption('','btThroneHUD', 'ThroneHUD', function() { Options.presetPosition = null; t.SetTRWidgetDisplay(); Dashboard.PaintTRPresets(); WideScreen.CheckChatPosition();} );
		ToggleOption('','TRFixPresetWidth', 'TRFixPresetWidth', Dashboard.PaintTRPresets);


		ChangeIntegerOption('','btmapinterval','MapInterval',2,function () { MAP_DELAY = Options.MapInterval * 1000; });

		ChangeIntegerOption('','btfreerallyslots','FreeRallySlots');
	},

	PaintLanguageOptions : function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>'+tx('Current Language')+':&nbsp;<select id=btChangeLang>';
		for (var l in uW.g_supportedLangugages) {
			m += '<option value="'+l+'" '+((Options.Language==l)?"selected":"")+'>'+uW.g_supportedLangugages[l]+'</option>';
		}
		m += '</select>&nbsp;'+strButton20(uW.g_js_strings.getUserSettings.changelang,'id=btChangeLangButton')+'&nbsp;'+strButton20(tx('Refresh'),'id=btRefreshLangButton')+'</td>';
		m += '<TD colspan=2 class=xtab align=right>'+t.languagestatus+'&nbsp;&nbsp;</td></tr>';
		m += '<TR><td class=xtab>&nbsp;</td><td class=xtab><input class=btInput id=btEditLang type=button value="'+tx("Edit Translations")+'"></td></tr></table>';

		ById('btLanguage').innerHTML = m;

		ById('btChangeLangButton').addEventListener('click', t.ChangeLanguage, false);
		ById('btRefreshLangButton').addEventListener('click', t.ChangeLanguage, false);
		ById('btEditLang').addEventListener('click', t.editTranslations, false);
	},

	PaintTabManagerOptions : function () {
		var t = Tabs.Options;

		var m = '<TABLE width="100%">';
		m += '<TR><TD colspan=2 class=xtab><b>'+tx('Additional Tabs')+'</b></td><td colspan=2 class=xtab align=right><INPUT id=btTabAutoCheck type=checkbox />&nbsp;'+tx("Automatically Check for Updates")+'&nbsp;<a class="inlineButton btButton blue14" onclick="btTabReloadAll()"><span>'+tx('Check Now')+'</span></a></td></tr>';
		m += '</table><TABLE width="100%" cellspacing=0 cellpadding=2>';

		var r = 0;
		for (var e in GlobalOptions.ExtraTabs) {
			if (GlobalOptions.ExtraTabs[e].source) {
				var dispvers = '';
				if (GlobalOptions.ExtraTabs[e].version && GlobalOptions.ExtraTabs[e].version!="0") dispvers = 'v'+GlobalOptions.ExtraTabs[e].version;
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				m += '<TR class="'+rowClass+'"><TD width=30 class=xtab><INPUT id="btTabEnabled_'+e+'" type=checkbox '+(GlobalOptions.ExtraTabs[e].enabled?'CHECKED':'')+' onclick="btTabToggle('+e+')" /></td><TD class=xtab>'+GlobalOptions.ExtraTabs[e].source+'</td><td class=xtab align=right><span style="font-size:8px;">'+dispvers+'</span></td><td class=xtab align=right width=100px><a id="btTabRefresh_'+e+'" class="inlineButton btButton brown8" onclick="btTabRefresh('+e+')"><span>'+tx('Reload')+'</span></a>&nbsp;<a id="btTabDelete_'+e+'" class="inlineButton btButton brown8" onclick="btTabDelete('+e+')"><span>'+tx('Remove')+'</span></a></td></tr>';
			}
		}
		m += '<TR><TD width=30 class=xtab>&nbsp;</td><TD colspan=2 class=xtab><INPUT title="'+tx('Enter the URL for the remote source code of the additional tab - NOTE THIS CANNOT BE A LOCAL FILE!')+'" class="btInput" id="btTabSource" type=text style="width:450px;" value=""></td><td class=xtab align=right width=100px><a id="btTabAdd" class="inlineButton btButton brown8" onclick="btTabAdd()"><span>'+tx('Add Tab')+'</span></a></td></tr>';
		m += '<TR><TD align=center class=xtab colspan=4 id=btTabMessage>&nbsp;</td></tr>';

		m += '<TR style="display:none;"><TD class=xtab colspan=4><br><div align=center>'+tx('Autoport Access Code')+':&nbsp;<input class=btInput type="text" value="'+Options.PremiumAccessCode+'" id="btPremiumCode"/></div><br></td></tr>';
		m += '</table><TABLE width="100%">';
		m += '<TR><TD colspan=2 class=xtab>&nbsp;</td><td colspan=2 class=xtab align=right><a class="inlineButton btButton red14" onclick="btTabReset()"><span>'+tx('Reset Additional Tabs')+'</span></a></td></tr>';
		m += '</table>';

		ById('btTabManager').innerHTML = m;

		t.togGlobalOpt ('btTabAutoCheck', 'TabAutoCheck');
		ChangeOption('','btPremiumCode','PremiumAccessCode',t.RestartReminder);

		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	ToggleTRPreset : function (entry) {
		var t = Tabs.Options;
		if (!Options.DashboardOptions.TRPresetsSelected[entry]) { Options.DashboardOptions.TRPresetsSelected[entry] = true; }
		Options.DashboardOptions.TRPresetsSelected[entry] = ById('btpresetSelect'+entry).checked;
		saveOptions();
	},

	TabToggle : function(e) {
		var t = Tabs.Options;
		GlobalOptions.ExtraTabs[e].enabled = ById('btTabEnabled_'+e).checked;
		if (GlobalOptions.ExtraTabs[e].enabled && !GlobalOptions.ExtraTabs[e].data) {
			t.TabLoad(e);
		}
		saveGlobalOptions();
		t.RestartReminder();
	},

	RotateThrone: function () {
		var t = Tabs.Options;
		var activeSlot = Number(Seed.throne.activeSlot);
		var oldActive = activeSlot;
		var foundone = false;
		do {
			activeSlot++;
			if (activeSlot > Number(Seed.throne.slotNum)) activeSlot = 1;
			if (Options.DashboardOptions.TRPresetsSelected[activeSlot]) {
				SwitchThroneRoom(activeSlot);
				foundone = true;
				break;
			}
		}
		while (!foundone && (activeSlot != oldActive))
	},

	TabDelete : function(e) {
		var t = Tabs.Options;
		GlobalOptions.ExtraTabs.splice(e,1);
		saveGlobalOptions();
		t.RestartReminder();
		t.PaintTabManagerOptions();
		ById('btTabMessage').innerHTML = tx('Tab Removed');
	},

	TabRefresh : function(e) {
		var t = Tabs.Options;
		t.TabLoad(e);
	},

	TabReset : function() {
		var t = Tabs.Options;
		delete GlobalOptions.ExtraTabs;
		saveGlobalOptions();
		t.RestartReminder();
		t.PaintTabManagerOptions();
	},

	TabReloadAll : function() {
		var t = Tabs.Options;
		CheckDelay = 0;
		ById('btTabMessage').innerHTML = tx('Checking Additional Tabs for updates')+'...';
		for (var e in GlobalOptions.ExtraTabs) {
			if (GlobalOptions.ExtraTabs[e].enabled) {
				CheckDelay++;
				setTimeout( t.TabLoad,(CheckDelay*1250),e,true);
			}
		}
		CheckDelay++;
		setTimeout( function() { ById('btTabMessage').innerHTML = tx('Complete! Please reload Kingdoms of Camelot')+'!'; },(CheckDelay*1250));
	},

	TabAdd : function() {
		var t = Tabs.Options;
		var TabObj = {};
		TabObj.source = ById('btTabSource').value.trim();
		TabObj.data = null;
		TabObj.enabled = true;
		TabObj.lastchecked = 0;
		GlobalOptions.ExtraTabs.push(TabObj);
		t.TabLoad(GlobalOptions.ExtraTabs.length-1);
	},

	TabLoad : function(e,background) {
		var t = Tabs.Options;
		var src = GlobalOptions.ExtraTabs[e].source;
		if (src!="") {
			var TabMessage = tx('Tab Added');
			if (GlobalOptions.ExtraTabs[e].data) {
				TabMessage = tx('Tab Updated');
			}
			GlobalOptions.ExtraTabs[e].lastchecked = unixTime();
			saveGlobalOptions();
			remotefun = function (e) {
				try {
					GM_xmlhttpRequest({
						method: 'GET',
						url: src+'?'+new Date(),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
						},
						onload: function (remote) {
							if (remote.status == 200) {
								try {
									var oldvers = null;
									if (GlobalOptions.ExtraTabs[e].data) { oldvers=/\/\/\s*@tabversion\s+(.+)\s*\n/i.exec(atob(GlobalOptions.ExtraTabs[e].data)); }
									if (oldvers) { oldvers=oldvers[1]; } else { oldvers='0'; }
									var newvers=/\/\/\s*@tabversion\s+(.+)\s*\n/i.exec(remote.responseText);
									if (newvers) { newvers=newvers[1]; } else { newvers='0'; }
									if (!background || AutoUpdater.compareVersion(newvers, oldvers)) {
										GlobalOptions.ExtraTabs[e].data = btoa(unescape(encodeURIComponent(remote.responseText)));
										GlobalOptions.ExtraTabs[e].version = newvers;
										saveGlobalOptions();
										if (!background) { t.RestartReminder();	}
										else { actionLog(TabMessage+': '+src+' ('+tx('Restart Required')+')','GENERAL'); }
									}
								}
								catch (err) {
									TabMessage = err.message;
									logerr(err);
								}
							}
							else {
								TabMessage = tx('Unable to open source file');
								logit('unable to open file '+src);
							}
							if (!GlobalOptions.ExtraTabs[e].data) {
								GlobalOptions.ExtraTabs.splice(e,1); // remove bad tab
								saveGlobalOptions();
							}
							if (!background) {
								t.PaintTabManagerOptions();
								ById('btTabMessage').innerHTML = TabMessage;
							}
						},
					});
				} catch (err){ logerr(err);	}
			}
			setTimeout(remotefun,0,e);
		}
	},

	ChangeLanguage : function () {
		var t = Tabs.Options;
		var params=uW.Object.clone(uW.g_ajaxparams);
		params.lang=ById('btChangeLang').value;

		new MyAjaxRequest(uW.g_ajaxpath +"ajax/changeLanguage.php"+uW.g_ajaxsuffix, {
			method:"post",
			parameters:params,
			onSuccess:function(rslt) {
				Options.Language=(params.lang);
				LanguageArray = {};
				t.LoadLanguage(Options.Language,function () { saveLanguage(Options.Language); ReloadKOC(false,'&lang='+Options.Language); });
			},
		},true);
	},

	LoadLanguage : function (lang,notify) {
		var t = Tabs.Options;
		Options.LanguageLastChecked = unixTime();
		saveOptions();
		if (lang=='en') { if (notify) {notify();} return; } // english is default language - no pack available!
		var LangURL = EXTERNAL_RESOURCE+'languages/translation_'+lang+'.js?'+new Date();
		try {
			GM_xmlhttpRequest({
				method: 'GET',
				url: LangURL,
				onload: function(xpr) {
					var rslt = null;
					if (xpr.status==200) {
						try {
							rslt = JSON2.parse(xpr.responseText);
						} catch (e){
							t.languagestatus = "<span class=boldRed>Invalid Language Pack</span>";
							logerr(e);
							if (notify) {notify();}
							return;
						}

						if (!LanguageArray.CurrLang || LanguageArray.CurrLang != rslt.CurrLang) {
							t.UpdateLangArray(rslt);
						}
						else {
							if (!LanguageArray.LangVersion || parseIntNan(LanguageArray.LangVersion.substring(0, 8)) < parseIntNan(rslt.LangVersion.substring(0, 8))) {
								t.languagestatus = "New Language Pack Available!";
							}
						}
					}
					if (notify) {notify();}
				},
				onerror: function() {
					t.languagestatus = tx('Language pack unavailable');
					if (notify) {notify();}
				}
			});
		} catch (e){ logerr(e);	}
	},

	UpdateLangArray : function (rslt) {
		var t = Tabs.Options;
		for (var k in rslt){
			LanguageArray[k] = rslt[k];
		}
		saveLanguage(Options.Language);
		t.languagestatus = tx('Language pack')+' ('+rslt.CurrLang+') '+tx('Version')+' '+rslt.LangVersion+' '+tx('loaded');
	},

	editTranslations : function () {
		var t = Tabs.Options;

		var m = '<table width=98% align=center class=xtab cellpadding=0 cellspacing=0>';

		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab align=left><input class=btInput id=btSaveLang type=button value="'+tx("Save Changes")+'"></td><td class=xtab align=right><input class=btInput id=btExportLang type=button value="'+tx("Export")+'">&nbsp;<input class=btInput id=btImportLang type=button value="'+tx("Import")+'">&nbsp;<input class=btInput id=btImportLangFile type=file></td></tr>';
		m += '<tr><td colspan=3 align=center id=btEditTransMsg><span class=boldRed>Exiting window without clicking "Save Changes" will cause any amendments to be lost!</span></td></table>';
		m += '<div style="max-height:420px;overflow-y:auto;max-width:'+GlobalOptions.btWinSize.x+'px;"><br><table align=center cellspacing=0 cellpadding=0 class=xtab width=98%>';

		if (!LanguageArray.CurrLang) {
			LanguageArray.CurrLang = Options.Language;
		}
		var r = 0;
		m += '<tr class="oddRow"><td class=xtabBRTop><div class="wrap" style="width:'+(GlobalOptions.btWinSize.x-360)+'px;">CurrLang</div></td><td>'+LanguageArray.CurrLang+'</td></tr>';
		r=r+1;
		if (LanguageArray.LangVersion) {
			m += '<tr class="evenRow"><td class=xtabBRTop><div class="wrap" style="width:'+(GlobalOptions.btWinSize.x-360)+'px;">LangVersion</div></td><td>'+LanguageArray.LangVersion+'</td></tr>';
			r=r+1;
		}

		for (var l in NoTranslation) {
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			m += '<tr class="'+rowClass+'"><td class=xtabBRTop><div class="wrap" style="width:'+(GlobalOptions.btWinSize.x-360)+'px;">'+l+'</div></td><td><input style="width:300px;" id="btlang_'+escape(l)+'" value="'+NoTranslation[l]+'"/></td></tr>';
		}
		for (var l in LanguageArray) {
			if (l != "CurrLang" && l != "LangVersion") {
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				m += '<tr class="'+rowClass+'"><td class=xtabBRTop><div class="wrap" style="width:'+(GlobalOptions.btWinSize.x-360)+'px;">'+l+'</div></td><td><input style="width:300px;" id="btlang_'+escape(l)+'" value="'+LanguageArray[l]+'"/></td></tr>';
			}
		}
		m += '</table></div>';

		t.popLang = new CPopup('btEditLanguage', 10, 10, GlobalOptions.btWinSize.x, 500, true, function() { saveLanguage(Options.Language); t.popLang.destroy();});
		t.popLang.getTopDiv().innerHTML = '<div align=center><B>'+tx("Edit Translations")+'</div>';
		t.popLang.getMainDiv().innerHTML = m;
		t.popLang.show(true);

		ById("btSaveLang").addEventListener('click', function(){
			for (var l in LanguageArray) {
				var elem = ById("btlang_"+escape(l));
				if (elem && elem.value != '') {
					LanguageArray[l] = elem.value;
				}
			}
			for (var l in NoTranslation) {
				var elem = ById("btlang_"+escape(l));
				if (elem && elem.value != '') {
					LanguageArray[l] = elem.value;
					delete NoTranslation[l];
				}
			}
			saveLanguage(Options.Language);
			t.editTranslations();
		},false);

		ById('btExportLang').addEventListener ('click',function() {
			var Export = {};
			for (var k in LanguageArray) {
				Export[k] = LanguageArray[k];
			}
			if (Options.Language = 'en') {
				for (var k in NoTranslation) {
					Export[k] = NoTranslation[k];
				}
			}
			uriContent = 'data:application/octet-stream;content-disposition:attachment;filename=file.txt,' + encodeURIComponent(JSON2.stringify(Export));
			t.saveConfig(uriContent,'lang_'+LanguageArray.CurrLang+'.txt');
			ById('btEditTransMsg').innerHTML = 'Translations Exported';
		},false);

		ById('btImportLang').addEventListener ('click',function() {
			var fileInput = ById("btImportLangFile");
			var files = fileInput.files;
			if (files.length == 0) { return; }
			var file = files[0];
			var reader = new FileReader();
			reader.onload = function (e) {
				var Import = JSON2.parse(e.target.result);
				if (Import.CurrLang && LanguageArray.CurrLang && Import.CurrLang != LanguageArray.CurrLang) {
					ById('btEditTransMsg').innerHTML = 'Incorrect Language';
					return;
				}
				else {
					for (var k in Import) {
						if (Import[k] != "") {
							LanguageArray[k] = Import[k];
							if (NoTranslation.hasOwnProperty(k)) delete NoTranslation[k];
						}
					}
				}
				t.editTranslations();
			};
			reader.readAsText(file);
		},false);
	},

	togGlobalOpt : function (checkboxId, optionName, callOnChange) {
		var t = Tabs.Options;
		var checkbox = ById(checkboxId);
		checkbox.checked = GlobalOptions[optionName];
		checkbox.addEventListener ('change', eventHandler, false);
		function eventHandler (){
			GlobalOptions[optionName] = this.checked;
			saveGlobalOptions();
			if (callOnChange) { callOnChange (this.checked); }
		}
	},

	changeGlobalOpt : function (valueId, optionName, callOnChange) {
		var t = Tabs.Options;
		var e = ById(valueId);
		e.value = GlobalOptions[optionName];
		e.addEventListener ('change', eventHandler, false);
		function eventHandler (){
			GlobalOptions[optionName] = this.value;
			saveGlobalOptions();
			if (callOnChange) { callOnChange (this.value); }
		}
	},

	togUserOpt : function (checkboxId, optionName, callOnChange, callIsAvailable) {
		var t = Tabs.Options;
		var checkbox = ById(checkboxId);
		if (callIsAvailable && callIsAvailable() == false) {
			checkbox.disabled = true;
			return;
		};
		checkbox.checked = UserOptions[optionName];
		checkbox.addEventListener ('change', eventHandler, false);
		function eventHandler (){
			UserOptions[optionName] = this.checked;
			saveUserOptions(uW.user_id); // facebook user id
			if (callOnChange) { callOnChange (this.checked); }
		}
	},

	changeUserOpt : function (valueId, optionName, callOnChange) {
		var t = Tabs.Options;
		var e = ById(valueId);
		e.value = UserOptions[optionName];
		e.addEventListener ('change', eventHandler, false);
		function eventHandler (){
			UserOptions[optionName] = this.value;
			saveUserOptions(uW.user_id); // facebook user id
			if (callOnChange) { callOnChange (this.value); }
		}
	},

	ResetDash : function () {
		var t = Tabs.Options;
		for (var p in Dashboard.DefaultDashboard) {
			ById('dashSeq'+p).value = Dashboard.DefaultDashboard[p].Sequence;
			ById('dashDisp'+p).checked = Dashboard.DefaultDashboard[p].Display;
		}
		Options.DashboardOptions.OverrideDashboard = {};
		saveOptions();
		WideScreen.RestartDashboard();
	},

	OverrideDash : function (sect) {
		var NewObj = {};
		if (Options.DashboardOptions.OverrideDashboard[sect]) {
			NewObj.Display = Options.DashboardOptions.OverrideDashboard[sect].Display;
			NewObj.Sequence = Options.DashboardOptions.OverrideDashboard[sect].Sequence;
		}
		else {
			NewObj.Display = Dashboard.DefaultDashboard[sect].Display;
			NewObj.Sequence = Dashboard.DefaultDashboard[sect].Sequence;
		}
		if (isNaN(ById('dashSeq'+sect).value)) { ById('dashSeq'+sect).value = 0; }
		NewObj.Sequence = ById('dashSeq'+sect).value;
		NewObj.Display = ById('dashDisp'+sect).checked;
		Options.DashboardOptions.OverrideDashboard[sect] = NewObj;
		saveOptions();
		WideScreen.RestartDashboard();
	},

	SacToggle : function () {
		var dc = jQuery('#btSacOpts').attr('class');
		if (Options.DashboardOptions.DefaultSacrifice) {if (dc.indexOf('divHide') >= 0) jQuery('#btSacOpts').attr('class','');}
		else {if (dc.indexOf('divHide') < 0) jQuery('#btSacOpts').attr('class','divHide');}
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	DefToggle : function () {
		var dc = jQuery('#btDefOpts').attr('class');
		if (Options.DashboardOptions.DefAddTroopShow) {if (dc.indexOf('divHide') >= 0) jQuery('#btDefOpts').attr('class','');}
		else {if (dc.indexOf('divHide') < 0) jQuery('#btDefOpts').attr('class','divHide');}
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
	},

	PresetToggle : function () {
		var dc = jQuery('#btPresetByNameOpts').attr('class');
		if (Options.DashboardOptions.TRPresetChange) {if (dc.indexOf('divHide') >= 0) jQuery('#btPresetByNameOpts').attr('class','');}
		else {if (dc.indexOf('divHide') < 0) jQuery('#btPresetByNameOpts').attr('class','divHide');}
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
		Dashboard.PaintTRPresets();
	},

	EnhCBtnsToggle: function () {
		var dc1 = jQuery('#ptcvoptions1').attr('class');
		var dc2 = jQuery('#ptcvoptions2').attr('class');
		var dc3 = jQuery('#ptcvoptions3').attr('class');
		if (Options.EnhCBtns) {
			if (dc1.indexOf('divHide') >= 0) jQuery('#ptcvoptions1').attr('class','');
			if (dc2.indexOf('divHide') >= 0) jQuery('#ptcvoptions2').attr('class','');
			if (dc3.indexOf('divHide') >= 0) jQuery('#ptcvoptions3').attr('class','');
		}
		else {
			if (dc1.indexOf('divHide') < 0) jQuery('#ptcvoptions1').attr('class','divHide');
			if (dc2.indexOf('divHide') < 0) jQuery('#ptcvoptions2').attr('class','divHide');
			if (dc3.indexOf('divHide') < 0) jQuery('#ptcvoptions3').attr('class','divHide');
		}
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

		Options.WarnAscension = ById('ptWarnAscension').checked;
		saveOptions();
		clearInterval(t.WarnAscensionTimer);
		if (Options.EnhCBtns && Options.WarnAscension) {
			t.WarnAscensionTimer = setInterval(function () {
				Tabs.Options.checkAscension();
			}, 60 * 1000); // every min?
		}
		Tabs.Options.checkAscension();
	},

	checkAscension: function () {
		var t = Tabs.Options;
		for (var i = 0; i < uW.seed.cities.length; i++) {
			var cityidx = i + 1;
			var city = ById('citysel_' + cityidx);
			if (!city) {
				setTimeout(t.checkAscension, 2000);
				return;
			}
			if (!Options.WarnAscension || !Options.EnhCBtns) {
				jQuery('#citysel_' + cityidx).removeClass('city_warning');
			} else {
				var cityExpTime = uW.seed.cityData.city[uW.seed.cities[i][0]].prestigeInfo.prestigeBuffExpire;
				if (!isNaN(cityExpTime) && (cityExpTime >= unixTime()) && ((cityExpTime - unixTime()) <= (Options.WarnAscensionInterval * 3600))) {
					if (jQuery('#citysel_' + cityidx).hasClass('city_unselected')) {
						jQuery('#citysel_' + cityidx).addClass('city_warning');
					}
				} else {
					jQuery('#citysel_' + cityidx).removeClass('city_warning');
				}
			}
		}
	},

	MiniRefreshChanged: function () {
		var t = Tabs.Options;
		Options.MiniRefresh = ById('ptEnableMiniRefresh').checked;
		saveOptions();
		t.MiniRefresh();
	},

	MiniRefresh: function () {
		var t = Tabs.Options;
		clearTimeout(t.MiniRefreshTimer);
		if (Options.MiniRefresh) {
			if (!Options.DashboardOptions.RefreshSeed && !RefreshingSeed) {
				RefreshSeed();
			}
			t.MiniRefreshTimer = setTimeout(t.MiniRefresh, Options.MiniRefreshInterval*60*1000);
		}
	},

	AddUserLists : function () { // obsolete code. Kept for posterity
		var t = Tabs.Options;

		uW.FB.getLoginStatus(function(response) { if (response.status != 'connected') { return; } });
		uW.FB.login(function (o) {
			if (o.authResponse) {
				var p = {
					access_token : o.authResponse.accessToken
				};
				uW.FB.api('/me/friendlists', p, function(result) {
					UserOptions.CustomPublish = {};
					var markup = '';
					for (var l in t.PublishLists) {
						var selected = "";
						if (UserOptions.autoPublishPrivacySetting == l) selected = "selected";
						markup += '<option value="'+l +'" '+selected+'>'+t.PublishLists[l] +'</option>';
					}
					var lists = result.data;
					for(var i in lists){
						if (lists[i].list_type == 'user_created') {
							UserOptions.CustomPublish[lists[i].id] = lists[i].name;
							var selected = "";
							if (UserOptions.autoPublishPrivacySetting == lists[i].id) selected = "selected";
							markup += '<option value="'+lists[i].id +'" '+selected+'>'+lists[i].name +'</option>';
						}
					}
					saveUserOptions (uW.user_id); // facebook user id
					ById('selectprivacymode').innerHTML = markup;
				});
			}
		},{ scope : "read_friendlists" });
	},

	ResetAllWindows: function () {
		DefaultWindowPos('btWinPos','main_engagement_tabs',true);
		mouseMainTab ({button:2});

		DefaultWindowPos('btDashPos','main_engagement_tabs',true);
		if (Options.btFloatingDashboard) ResetWindowPos({button:2},'main_engagement_tabs',popDash);

		DefaultWindowPos('btIncPos','main_engagement_tabs',true);
		ResetWindowPos({button:2},'main_engagement_tabs',popInc);

		DefaultWindowPos('btOutPos','main_engagement_tabs',true);
		ResetWindowPos({button:2},'main_engagement_tabs',popOut);

		DefaultWindowPos('btMarchPos','main_engagement_tabs',true);
		ResetWindowPos({button:2},'main_engagement_tabs',popMarch);

		DefaultWindowPos('btMonPos','main_engagement_tabs',true);
		ResetWindowPos({button:2},'main_engagement_tabs',popMon);

		if (uW.btGuardWidget) { uW.btGuardWidget.resetGuardWidget(); }

		actionLog('All window positions reset','OPTIONS');
	},

	ResetAll : function () {
		hideMe();
		ModalMultiButton({ buttons: [
				{ txt: "Reset ALL Options!", exe: function () {
					uW.Modal.hideModal();
					setTimeout( function () {
						var RemoveList = (GM_listValues());
						for (i=0;i<RemoveList.length;i++){
							GM_deleteValue(RemoveList[i]);
						}
						ResetAll = true;
						actionLog('Powerbot+ restored to factory settings');
						ReloadKOC();
					},0);
				}},
				{ txt: "Cancel Request", exe: function () {
					uW.Modal.hideModal();
				}}
			],
			body: "<center> Please confirm you want to return PowerBot+ to Factory Settings?<br>Note this affects all domains...</center>",
			title: "Reset ALL PowerBot+ Options"
		});
	},

	ResetSettings : function () {
		hideMe();
		ModalMultiButton({ buttons: [
				{ txt: "Reset Settings", exe: function () {
					uW.Modal.hideModal();
					setTimeout( function () {
						var serverID = getServerId();
						GM_deleteValue ('Options_??');
						GM_deleteValue ('Options_'+serverID+'_'+uW.tvuid);
						ResetAll = true;
						actionLog('Powerbot+ configuration reset');
						Tabs.ActionLog.save();
						ReloadKOC();
					},0);
				}},
				{ txt: "Cancel Request", exe: function () {
					uW.Modal.hideModal();
				}}
			],
			body: "<center> Please confirm you want to reset PowerBot+ settings to default values?</center>",
			title: "Reset Settings"
		});
	},

	RestartReminder : function () {
		var t = Tabs.Options;
		var div = ById('ptRestart');
		if (!div) {
			var	div = document.createElement('div');
			div.id = 'ptRestart';
			uWExportFunction('ReloadKOC',ReloadKOC);
			var msg = tx('Changes to Power Bot Plus Settings require Kingdoms of Camelot to be reloaded')+'... <a onClick="ReloadKOC();">['+tx('Reload')+']</a>&nbsp;<a onClick="this.parentNode.parentNode.style.display=\'none\';">['+uW.g_js_strings.commonstr.close+']</a>';
			div.innerHTML = '<DIV style="background: #fde073; text-align: center; line-height: 2.5; overflow: hidden; -webkit-box-shadow: 0 0 5px black; -moz-box-shadow: 0 0 5px black; box-shadow: 0 0 5px black;">'+msg+'</div>';
			document.body.insertBefore (div, document.body.firstChild);
		}
	},

	ToggleSpamActive : function () {
		var t = Tabs.Options;
		if (Options.ChatOptions.SpamActive) { // reset last sent time...
			Options.ChatOptions.LastSpamSent = 0;
			saveOptions();
		}
	},

	ToggleRaidActive : function () {
		var t = Tabs.Options;
		if (Options.RaidRunning) { // reset last sent time...
			Options.RaidLastReset = 0;
			saveOptions();
		}
		SetToggleButtonState('Raids',Options.RaidRunning,'Raids');
	},

	resetRaids : function(cityId,cityName){
		var t = Tabs.Options;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'resetRaidTimer';
		params.settings = {};
		params.settings.cityId = cityId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function(rslt){
				if (rslt.ok) {
					uW.cityinfo_army();
					setTimeout(uW.update_seed_ajax, 250);
				}
			},
		});
	},

	CheckWatchTower : function () {
		var t = Tabs.Options;
		var now = unixTime();
		var incoming = false;
		for (var k in local_atkinc) { // check each incoming march
			var m = local_atkinc[k];
			if (m.marchType==3 || m.marchType==4) {
				if(Options.TowerOptions.HandledMarches.indexOf(String(m.mid)+String(m.departureTime))==-1) { // new attack!!
					Options.TowerOptions.HandledMarches.push(String(m.mid)+String(m.departureTime));
					if (Cities.byID[m.toCityId] && Cities.byID[m.toCityId].tileId == m.toTileId) { // only save times on city attacks
						if (!Options.TowerOptions.LatestAttackTimes[m.toCityId] || (Number(m.arrivalTime) > Options.TowerOptions.LatestAttackTimes[m.toCityId])) {
							Options.TowerOptions.LatestAttackTimes[m.toCityId] = Number(m.arrivalTime); // arrival times by city.
							if (Number(m.arrivalTime) > Options.TowerOptions.LastAttack) {
								Options.TowerOptions.LastAttack = Number(m.arrivalTime); // global last attack time var.
							}
						}
					}
					saveOptions();
					t.newIncoming (m);
				};
				incoming = true;
			}
		}

		if(!incoming) { // all clear!
			if (Options.TowerOptions.RecentActivity) {
				// belt and braces - reset last attack values if they are later than now...
				if (parseInt(Options.TowerOptions.LastAttack) > now) {
					Options.TowerOptions.LastAttack = now;
				}
				for (var cid in Options.TowerOptions.LatestAttackTimes) {
					if (parseInt(Options.TowerOptions.LatestAttackTimes[cid]) > now) {
						Options.TowerOptions.LatestAttackTimes[cid] = now;
					}
				}
			}
			Options.TowerOptions.HandledMarches = new Array(); // cleanup
		}

		// Start or Stop Sound Alert!

		if (incoming && Options.TowerOptions.alertSound.alarmActive){
			if (ById('btDashAlarmOff')) {
				if (!ById('btDashAlarmOffButton')) {
					ById('btDashAlarmOff').innerHTML = strButton14(tx('Silence Alarm')+'!','id=btDashAlarmOffButton','red14');
					ById('btDashAlarmOffButton').addEventListener ('click', t.stopSoundAlerts, false);
				}
			}
			else {
				if (!ById("towersirentab")) {
					AddSubTabLink(tx('Silence Alarm')+'!',t.stopSoundAlerts, 'towersirentab', 'red20');
				}
			}
		}
		if (Options.TowerOptions.alertSound.alarmActive && ((now > Options.TowerOptions.alertSound.expireTime) || !incoming)){
			var element = ById('towersirentab');
			if(element) { element.parentNode.removeChild(element); }
			if (ById('btDashAlarmOff')) { ById('btDashAlarmOff').innerHTML = ''; }
			t.stopSoundAlerts();
		}

		// Check Action Reverts

		if (Options.TowerOptions.RecentActivity) {
			for (var cid in Options.TowerOptions.RecentCityActivity) { // check each city action..
				if (Options.TowerOptions.RecentCityActivity[cid]===true) {
					var switchtime = parseInt(Options.TowerOptions.LatestAttackTimes[cid]);
					if (Options.TowerOptions.Revert) switchtime += Options.TowerOptions.RevertMinutes*60;
					if (switchtime < now) {
						actionLog(Cities.byID[cid].name+': All Clear','TOWER');
						if (Options.TowerOptions.Revert && (afkdetector.isAFK || !Options.TowerOptions.AFKEvents)) {
							// change guardian back
							if (Options.TowerOptions.ChangeGuardian) {
								if (Options.TowerOptions.SaveCityState[cid].Guardian != Seed.guardian[Cities.byID[cid].idx].type) {
									actionLog(Cities.byID[cid].name+': Resetting Guardian','TOWER');
									SwitchGuardian(cid,Options.TowerOptions.SaveCityState[cid].Guardian);
								}
							}
							// change champion back...
							if (Options.TowerOptions.ChangeChamp) {
								if (Options.TowerOptions.SaveCityState[cid].Champion != getCityChampion(cid).championId && getChampionCity(Options.TowerOptions.SaveCityState[cid].Champion)==0) {
									actionLog(Cities.byID[cid].name+': Resetting City Champion','TOWER');
									setTimeout(SwitchChampion,3000,cid,Options.TowerOptions.SaveCityState[cid].Champion); // delay 3 seconds
								}
							}
							// restart raids in city...
							if (Options.TowerOptions.StopRaids) {
								actionLog(Cities.byID[cid].name+': Restarting Raids','TOWER');
								ToggleCityRaids (cid,'resumeAll');
							}
						}
						Options.TowerOptions.RecentCityActivity[cid] = false; // switch off
						if (Options.TowerOptions.SaveCityState[cid]) {
							setTimeout(function() {
								if (!Options.TowerOptions.RecentCityActivity[cid] === true) { // double check!
									delete Options.TowerOptions.SaveCityState[cid];
									if (Options.TowerOptions.StopMarches) {
										actionLog(Cities.byID[cid].name+': Automatic march functions resumed','TOWER');
									}
								}
							},10000); // cleanup (which will allow marches again) 10 sec delay so raids get going first...
						}
					}
				}
			}

			var switchtime = parseInt(Options.TowerOptions.LastAttack);
			if (Options.TowerOptions.Revert) switchtime += Options.TowerOptions.RevertMinutes*60;
			if (switchtime < now) {
				if (Options.TowerOptions.Revert && (afkdetector.isAFK || !Options.TowerOptions.AFKEvents)) {
					// Switch TR back if required
					if (Options.TowerOptions.ChangeTR) {
						if (Options.TowerOptions.SaveTR != Seed.throne.activeSlot) {
							actionLog('Resetting Throne Room','TOWER');
							SwitchThroneRoom(Options.TowerOptions.SaveTR);
						}
					}
					// Switch Champ back if required
					if (Options.TowerOptions.ChangeChamp) {
						if (Options.TowerOptions.ChampId && Options.TowerOptions.ChampOriginalCity != getChampionCity(Options.TowerOptions.ChampId)) {
							if (getChampionStatus(Options.TowerOptions.ChampId)=="10") {
								actionLog('Champion is marching - Cannot revert to original city','TOWER');
							}
							else {
								actionLog('Reverting champion to original city','TOWER');
								SwitchChampion(Options.TowerOptions.ChampOriginalCity,Options.TowerOptions.ChampId);
							}
						}
					}
				}
				Options.TowerOptions.RecentActivity = false; // switch off
			}
		}
	},

	e_volChanged : function (val) {
		var t = Tabs.Options;
		ById('pbVolOut').innerHTML = parseInt(val*100);
		Options.TowerOptions.alertSound.volume = parseInt(val*100);
	},
	playSound : function (soundfile,doRepeats,btnid) {
		var t = Tabs.Options;
		if (!t.mss) return;
		var stopbtn = ById(btnid);
		if (stopbtn) { stopbtn.disabled = false; }
		clearTimeout (t.soundStopTimer);
		clearTimeout (t.soundRepeatTimer);
		t.mss.setVolume(Options.TowerOptions.alertSound.volume);
		t.mss.setSource(soundfile);
		t.mss.play();
		t.soundStopTimer = setTimeout (function(){t.mss.stop(); var stopbtn = ById(btnid); if (stopbtn) { stopbtn.disabled = true; };}, Options.TowerOptions.alertSound.playLength*1000);
		if (doRepeats && Options.TowerOptions.alertSound.repeat) {
			t.soundRepeatTimer = setTimeout (t.playSound, Options.TowerOptions.alertSound.repeatDelay*60000, soundfile, true, btnid);
		}
		else {
			Options.TowerOptions.alertSound.alarmActive = false;
		}
	},
	soundTheAlert : function (marchtype) {
		var t = Tabs.Options;
		Options.TowerOptions.alertSound.alarmActive = true;
		if (marchtype==3) { new t.playSound(Options.TowerOptions.alertSound.scoutUrl,true,'pbScoutStop'); }
		else { new t.playSound(Options.TowerOptions.alertSound.soundUrl,true,'pbSoundStop'); }
	},
	stopSoundAlerts : function () {
		var t = Tabs.Options;
		if (t.mss) { t.mss.stop(); }
		var element = ById('towersirentab');
		if(element) { element.parentNode.removeChild(element); }
		if (ById('btDashAlarmOff')) { ById('btDashAlarmOff').innerHTML = ''; }
		clearTimeout (t.soundStopTimer);
		clearTimeout (t.soundRepeatTimer);
		var stopbtn = ById('pbSoundStop');
		if (stopbtn) { stopbtn.disabled = true; }
		var stopbtn = ById('pbScoutStop');
		if (stopbtn) { stopbtn.disabled = true; }
		Options.TowerOptions.alertSound.alarmActive = false;
		Options.TowerOptions.alertSound.expireTime = 0;
	},

	newIncoming : function (m) {
		var t = Tabs.Options;
		if (m.marchType == null) return; // bogus march (returning scouts)
		if (m.arrivalTime && m.arrivalTime < uW.unixtime()+30) return; // don't show expired marches, well unless within 30 seconds for lag...

		var totTroops = 0;
		if (m.unts) { // if watchtower not high enough, display anyway
			for (var k in m.unts) { totTroops += Number(m.unts[k]); }
			if (!isNaN(totTroops) && totTroops < Options.TowerOptions.minTroops) { return; }
		}
		if (!Options.TowerOptions.towercityactive[m.toCityId]) { return; }

		var city = Cities.byID[m.toCityId];
		if (city.tileId != m.toTileId && !Options.TowerOptions.wilds) { return; }
		if (m.marchType == 3 && !Options.TowerOptions.scouting) { return;}

		t.BuildMessage(m);

		if (m.marchStatus == 9) { // recalled marches
			// Need to recheck arrival times to this city to take into account recalled march...
			var now = unixTime();
			Options.TowerOptions.LatestAttackTimes[m.toCityId] = now;
			for (var k in local_atkinc) {
				var n = local_atkinc[k];
				if ((n.marchType==3 || n.marchType==4) && (n.marchId != m.mid)) { // weird, cos it comes from the game!
					if (n.toCityId==m.toCityId && n.toTileId==Cities.byID[m.toCityId].tileId) {
						if (Number(n.arrivalTime) > Options.TowerOptions.LatestAttackTimes[m.toCityId]) {
							Options.TowerOptions.LatestAttackTimes[m.toCityId] = Number(n.arrivalTime);
						}
					}
				}
			}
			// now recheck the global var
			Options.TowerOptions.LastAttack = now;
			for (var cid in Options.TowerOptions.LatestAttackTimes) {
				if (Number(Options.TowerOptions.LatestAttackTimes[cid]) > Options.TowerOptions.LastAttack) {
					Options.TowerOptions.LastAttack = Number(Options.TowerOptions.LatestAttackTimes[cid]);
				}
			}
			saveOptions();
			return; // recalled marches leave here..
		}

		// alert sound!

		if (Options.TowerOptions.alertSound.enabled){
			t.soundTheAlert(m.marchType);
			if (m.arrivalTime > Options.TowerOptions.alertSound.expireTime) {
				Options.TowerOptions.alertSound.expireTime = m.arrivalTime;
			}
		}

		// Perform Automatic Events

		if (city.tileId == m.toTileId) {
			if (!Options.TowerOptions.SaveCityState[m.toCityId]) {
				actionLog(Cities.byID[m.toCityId].name+': Under Attack!','TOWER');
				var CityState = new Object();
				CityState.cityId = m.toCityId;
				CityState.tileId = city.tileId;
				CityState.Guardian = Seed.guardian[Cities.byID[m.toCityId].idx].type;
				CityState.Champion = getCityChampion(m.toCityId).championId;
				CityState.ChangeChampion = true;
				CityState.AllowMarches = true;
				CityState.AllowRaids = true;
				Options.TowerOptions.SaveCityState[m.toCityId] = CityState;

				if (afkdetector.isAFK || !Options.TowerOptions.AFKEvents) {
					Options.TowerOptions.SaveCityState[m.toCityId].AllowMarches = (!Options.TowerOptions.StopMarches);
					Options.TowerOptions.SaveCityState[m.toCityId].AllowRaids = (!Options.TowerOptions.StopRaids);
					if (Options.TowerOptions.StopMarches) {
						actionLog(Cities.byID[m.toCityId].name+': Automatic march functions suspended','TOWER');
					}
					// change guardian
					if (Options.TowerOptions.ChangeGuardian) {
						if (Seed.guardian[Cities.byID[m.toCityId].idx].type != "wood") {
							actionLog(Cities.byID[m.toCityId].name+': Switching to Wood Guardian','TOWER');
							SwitchGuardian(m.toCityId,"wood");
						}
					}
					// stop raids in city...
					if (Options.TowerOptions.StopRaids) {
						actionLog(Cities.byID[m.toCityId].name+': Stopping Raids','TOWER');
						ToggleCityRaids (m.toCityId,'stopAll');
					}
				}
			}
			Options.TowerOptions.RecentCityActivity[m.toCityId] = true;

			if (!Options.TowerOptions.RecentActivity) { // save current TR and location of champ
				Options.TowerOptions.SaveTR = Seed.throne.activeSlot;
				if (afkdetector.isAFK || !Options.TowerOptions.AFKEvents) {
					if (Options.TowerOptions.ChangeTR) {
						if (parseIntNan(Options.TowerOptions.ChangeTRPreset) != 0 && Options.TowerOptions.ChangeTRPreset != Seed.throne.activeSlot) {
							actionLog('Changing Throne Room','TOWER');
							SwitchThroneRoom(Options.TowerOptions.ChangeTRPreset);
						}
					}
				}
				if (Options.TowerOptions.ChangeChamp && Options.TowerOptions.ChampId) {
					Options.TowerOptions.ChampOriginalCity = getChampionCity(Options.TowerOptions.ChampId);
				}
			}
			Options.TowerOptions.RecentActivity = true;
		}
		saveOptions(); // do once!
	},

	BuildMessage : function (m) {
		var t = Tabs.Options;
		var target, atkType, who;
		var scoutingat = '';
		var atkType;

		if (m.marchType == 3){
			if (!Options.TowerOptions.scouting) { return;}
			var scoutingat = uW.g_js_strings.modal_messages_viewreports_view.scoutingat;
			atkType = tx('SCOUT');
		} else if (m.marchType == 4){
			atkType = tx("ATTACK");
		} else {
			return;
		}

		var city = Cities.byID[m.toCityId];
		if (city.tileId == m.toTileId) {
			target = uW.g_js_strings.commonstr.city+ ' '+city.name+' ('+ city.x +','+ city.y + ')';
			if(Options.TowerOptions.towercitytext[m.toCityId] && Options.TowerOptions.towercitytext[m.toCityId] != "") {
				target += '|'+Options.TowerOptions.towercitytext[m.toCityId];
			}
		}
		else {
			if (!Options.TowerOptions.wilds) { return; }
			target = uW.g_js_strings.commonstr.wilderness;
			for (var k in Seed.wilderness['city'+m.toCityId]) {
				if (Seed.wilderness['city'+m.toCityId][k].tileId == m.toTileId) {
					target += '('+ Seed.wilderness['city'+m.toCityId][k].xCoord +','+ Seed.wilderness['city'+m.toCityId][k].yCoord + ')';
					break;
				}
			}
		}
		if (Seed.players['u'+m.pid]) {
			who = Seed.players['u'+m.pid].n;
		}
		else {
			if (m.players && m.players['u'+m.pid]) {
				who = m.players['u'+m.pid].n;
			}
			else {
				who = tx('who?');
			}
		}

		if (m.fromXCoord) { who += '('+ m.fromXCoord +','+ m.fromYCoord + ')'; }
		if (m.aid && m.aid!=0) {who += ' ('+getDiplomacy(m.aid)+')'; }

		if(m.marchStatus == 9) {
			msg = '.::.|'+scoutingat+' '+target+' || '+uW.g_js_strings.commonstr.attacker+' '+ who +' || '+uW.g_js_strings.incomingattack.attackrecalled;
		}
		else {
			var ArrTime = uW.g_js_strings.incomingattack.unknown;
			if (m.arrivalTime) ArrTime = uW.timestr(parseInt(m.arrivalTime - unixTime()));
			if (m.marchType == 3){ msg = '.:..'; } else { msg = '..:.'; }
			msg += '|'+Options.TowerOptions.aPrefix +' || '+scoutingat+' '+target+' || '+uW.g_js_strings.commonstr.attacker+' '+ who +' || '+uW.g_js_strings.attack_generateincoming.estimatedarrival+': '+ ArrTime;
		}
		if (m.pid) { msg+= ' || UID: ' + enFilter(m.pid); }
		msg+= ' || '+uW.g_js_strings.commonstr.troops+': ';

		if (m.unts) {
			for (var k in m.unts) {
				var uid = parseInt(k.substr(1));
				var UNTCOUNT = enFilter(m.unts[k]);
				msg += '|'+UNTCOUNT +' '+ uW.unitcost['unt'+uid][0] +', ';
			}
		}
		else {
			if (m.cnt) {
				msg += ' '+m.cnt;
			}
			else {
				msg += ' who?';
			}
		}

		if (m.marchStatus != 9) { // pointless showing following info for recalls
			if ((safecall.indexOf(m.pid) < 0 || trusted) && m.championInfo) {
				msg += ' || '+uW.g_js_strings.report_view.champion_stats+':';
				var got202 = false;
				for (var cy in m["championInfo"].effects[1]) {
					if (cy<300) {
						// missing bonus damage?
						if (cy == '202') { got202 = true; }
						if ((cy == '203') && !got202) { msg += '|'+uW.g_js_strings.effects.name_202+': 0,'; }
						str = uW.g_js_strings.effects['name_'+cy];
						if (str && str!= "") { msg += '|'+str+': '+m["championInfo"].effects[1][cy]+', '; }
						else { break; }
					}
				}
				msg += ' | '+uW.g_js_strings.report_view.troop_stats+':';
				for (var ty in m.championInfo.effects[2]) {
					str = uW.g_js_strings.effects['name_'+ty];
					if (str && str!= "") { msg += '|' +str+ ': ' +m.championInfo.effects[2][ty]+', '; }
					else { break; }
				}
			}

			if (city.tileId == m.toTileId) {
				var baseProtection =0;
				var totalSthPrt = 0;
				var SthPrtResearch = parseIntNan(Seed.tech.tch14);
				var TRStHsBoost = Math.min(equippedthronestats(89), uW.cm.thronestats.boosts.Storehouse.Max);
				if (TRStHsBoost == 0) TRStHsBoost = 1
				var researchToApply = ((SthPrtResearch / 10) + 1);
				var TRBoostToApply = ((TRStHsBoost / 100) + 1);
				baseProtection = StorehouseLevels[parseIntNan(getUniqueCityBuilding(city.id, 9).maxLevel)];
				totalSthPrt = addCommas(parseInt((baseProtection * researchToApply) * TRBoostToApply))
				msg += '|| '+tx('Strawberry Protection')+':|' + totalSthPrt + ' (TR ' + TRStHsBoost + '%)';

				if (Options.TowerOptions.upkeep==true) {
					var trupkeepreduce = 0;
					trupkeepreduce = Math.min(equippedthronestats(79), uW.cm.thronestats.boosts.Upkeep.Max);
					var trprodres = Math.min(equippedthronestats(82), uW.cm.thronestats.boosts.ResourceProduction.Max);
					var trprod = [0, 0, 0, 0, 0];
					trprod[1] = Math.min(equippedthronestats(83), uW.cm.thronestats.boosts.ResourceProduction.Max)+trprodres;
					var rp = getResourceProduction(m.toCityId);
					var usage = parseIntNan(Seed.resources['city'+m.toCityId]['rec1'][3]);
					var bp = CM.Resources.getProductionBase(1,m.toCityId);
					usage = (parseIntNan(rp[1] - usage + bp * trprod[1] / 100));
					if (usage < 0) {
						var timeLeft = parseInt(Seed.resources["city"+m.toCityId]['rec1'][0]) / 3600 / (0 - usage) * 3600;
						if (timeLeft < 86313600) {
							msg+= '|| '+tx('Snacks Remaining')+': ' + timestrShort(timeLeft);
						}
					}
				}

				var emb = getUniqueCityBuilding(m.toCityId, 8);
				if (emb.count == 0) {
					msg += '||'+tx("No Embassy!");
					msg += '| '+tx("Do not try and reinforce");
				}
				else {
					var availSlots = emb.maxLevel;
					for (var k in Seed.queue_atkinc){
						if ((Seed.queue_atkinc[k].toCityId == m.toCityId) && (Seed.queue_atkinc[k].marchStatus == 2) && (Seed.queue_atkinc[k].fromCityId != m.toCityId) && (Cities.byID[Seed.queue_atkinc[k].fromCityId]==null)) {
							--availSlots;
						}
					}
					msg += ' || '+uW.g_js_strings.openEmbassy.encampall+' '+ (emb.maxLevel-availSlots) +'/'+ emb.maxLevel +' ';

					if (Options.TowerOptions.defend==true) {
						if (parseInt(Seed.citystats["city" + m.toCityId].gate)==1) {
							msg+= '||'+tx('Troops are Defending!');
						}
						else {
							msg+= '||'+tx('Troops are in the Tavern!');
						}
					}

					if (Options.TowerOptions.champ==true) {
						var citychamp = getCityChampion(m.toCityId);
						if (citychamp.championId) {
							msg+= '||'+tx('Defending Champ')+': '+citychamp.name;
						}
						else {
							msg+= '||'+tx('No Defending Champ');
						}
					}

					if (Options.TowerOptions.tech==true) {
						msg+= '||'+uW.g_js_strings.commonstr.technology+':|Fletching '+parseInt(Seed.tech.tch13)+', |Healing Potions '+parseInt(Seed.tech.tch15)+', |Poisoned Edge '+parseInt(Seed.tech.tch8)+', |Metal Alloys '+parseInt(Seed.tech.tch9)+', |Magical Mapping '+parseInt(Seed.tech.tch11)+', |Alloy Horseshoes '+parseInt(Seed.tech.tch12)+', ';
					}

				}
			}
			if (Options.TowerOptions.afk==true) {
				if (afkdetector.isAFK) { msg+= '||'+tx('Activity Status')+': '+tx('AFK'); }
				else { msg+= '||'+tx('Activity Status')+': '+tx('ONLINE'); }
			}
			if (Options.TowerOptions.DefendMonitor==true) {
				msg+= ' || '+tx('My UID')+': ' + enFilter(uW.tvuid);
			}
			msg+= ' || '+tx('March id')+': ' + enFilter(m.mid);
		}

		var totTroops = 0;
		if (!m.unts) { // no unit info, watchtower not high enough? Force to alliance chat not whisper.
			totTroops = 99999999;
		}
		else {
			for (var k in m.unts){ totTroops += Number(m.unts[k]); }
		}

		if (Options.TowerOptions.aChat) {
			if (Options.TowerOptions.whisper && !isNaN(totTroops) && totTroops < Options.TowerOptions.whisperTroops) {
				sendChat("/" + Seed.player.name + ' ' + msg); // whisper
			}
			else {
				sendChat ("/a "+msg); // Alliance chat
			}
		}

	},

	sendDFReport : function (force) {
		var t = Tabs.Options;
		if (!Options.DFReport && !force) { return; }

		var now = unixTime();

		if (!force) {
			if (now < (parseInt(Options.LastDFReport)+(Options.DFReportInterval*60*60))) { return; }
			var message = tx('Dark Forest Report for')+' '+Options.DFReportInterval+' '+tx('hours (or since last report)')+' %0A';
		}
		else {
			var message = tx('Dark Forest Report (since last report)')+' %0A';
		}

		if (Options.ReportOptions.DeleteRptdf) {
			var total = DeleteReports.ReportLog.DFCount;
			if (total==0) { // don't report if no DF's attacked in timeframe.
				actionLog('No report generated as no dark forests attacked in timeframe','REPORTS');
				Options.LastDFReport = now;
				saveOptions();
				return;
			}

			message +='%0A';
			message += tx('Number of Dark Forests Attacked')+': '+total+'%0A';
			message +='%0A';
			message += tx('Miscellaneous items')+': %0A';
			for (var z in DeleteReports.ReportLog.ItemsFoundDF) {
				message += uW.g_js_strings.commonstr.found+' '+uW.ksoItems[z].name+' x '+DeleteReports.ReportLog.ItemsFoundDF[z]+'%0A';
			}

			message +='%0A';
			message += tx('Jewel Stats')+': %0A';
			var itemcount = 0;
			for (var z in DeleteReports.ReportLog.JewelItemsFoundDF){
				itemcount += DeleteReports.ReportLog.JewelItemsFoundDF[z];
				message += uW.g_js_strings.jewel['quality_'+Number(z-1)]+' Jewel x '+DeleteReports.ReportLog.JewelItemsFoundDF[z]+'%0A';
			}
			message += tx('Total Jewels Found')+': '+itemcount+'%0A';

			message +='%0A';
			message += tx('Throne Stats')+': %0A';
			var itemcount = 0;
			for (var z in DeleteReports.ReportLog.ThroneItemsFoundDF){
				itemcount += DeleteReports.ReportLog.ThroneItemsFoundDF[z].amount;
				message += strQuality(DeleteReports.ReportLog.ThroneItemsFoundDF[z].quality)+' '+DeleteReports.ReportLog.ThroneItemsFoundDF[z].type+' x '+DeleteReports.ReportLog.ThroneItemsFoundDF[z].amount+'%0A';
			}
			message += tx('Total Throne Room Items Found')+': '+itemcount+'%0A';

			message +='%0A';
			message += uW.g_js_strings.report_view.champion_stats+': %0A';
			var itemcount = 0;
			for (var z in DeleteReports.ReportLog.ChampItemsFoundDF){
				itemcount += DeleteReports.ReportLog.ChampItemsFoundDF[z].amount;
				message += strQuality(DeleteReports.ReportLog.ChampItemsFoundDF[z].quality)+' '+DeleteReports.ReportLog.ChampItemsFoundDF[z].type+' x '+DeleteReports.ReportLog.ChampItemsFoundDF[z].amount+'%0A';
			}
			message += tx('Total Champion Equipment Found')+': '+itemcount+'%0A';
		}
		else {
			message += tx('Found item details only available if the option "Delete dark forest reports" is ticked')+'%0A';
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.emailTo = Seed.player['name'];
		params.subject = tx("Dark Forest Overview");

		params.message = message;
		params.requestType = "COMPOSED_MAIL";

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					DeleteLastMessage();
					if (Options.ReportOptions.DeleteRptdf) {
						DeleteReports.ReportLog.ItemsFoundDF = {};
						DeleteReports.ReportLog.ThroneItemsFoundDF = {};
						DeleteReports.ReportLog.ChampItemsFoundDF = {};
						DeleteReports.ReportLog.JewelItemsFoundDF = {};
						DeleteReports.ReportLog.DFCount = 0;
						DeleteReports.saveLog();
					}
				}
			},
		});

		Options.LastDFReport = now;
		saveOptions();
	},
}





/** END OF TABS **/

if (document.URL.search(/main_src.php/i) != -1) {
	if (window.self.location != window.parent.location) { // Fix weird bug with koc game?
		PowerBotStartup();
	}
}
