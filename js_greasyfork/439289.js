// ==UserScript==
// @name         MunzeeMapFilter V4.2.40
// @namespace    http://tampermonkey.net/
// @match        https://www.munzee.com/map*
// @version      4.2.40
// @author       hunzee
// @description  filter for munzee map and virtual gardens
// @icon         https://www.google.com/s2/favicons?domain=munzee.com
// @update       https://greasyfork.org/hu/scripts/439289-munzeemapfilter-v4-2-40
// @downloadURL https://update.greasyfork.org/scripts/439289/MunzeeMapFilter%20V4240.user.js
// @updateURL https://update.greasyfork.org/scripts/439289/MunzeeMapFilter%20V4240.meta.js
// ==/UserScript==
//basedon: original munzee specials filter
//basedon: https://greasyfork.org/en/scripts/11662-munzeemapv2
//basedon: https://greasyfork.org/en/scripts/373493-munzeemapfilterv3

$("#footer").remove();
$('head').append($("<style> .ico_hide{opacity:0.4;} .filter_icon{padding: 0 1px 0 0;} .filter_icon > div{text-align: center;} .filter_icon > img{height:30px;cursor:pointer; border-radius: 5px} .filter_icon > img.img_hide{opacity:0.4;} #filterIcons{padding: 5px;background: white} #inputbar{background: white;top:30px;border-top: 1px solid #ffffff;} </style>"));
$(".panel.panel-default").css('margin-bottom', '0');
$('.row').css('margin', '0');
$('.panel-body').css('padding-left', '0').css('padding-right', '0');

var inputbar = $('#inputbar');
var buttonbar = $('<div id="buttonbar" class="btn-group" data-toggle="buttons"></div>');
var filterIcons = $('<div id="filterIcons"></div>');
inputbar.append(buttonbar);
inputbar.append(filterIcons);
var rightsidemenu = $('.map-box-right-side-menu');
var newmenu = $('<section><section>');
rightsidemenu.append(newmenu);
var mappage = $('#map-page');
var patient = $('<div id="patient" style="position: fixed; z-index: 9997; right: 0; bottom: 0; top: 0; left: 0; background-color: rgba(0,0,0,0.6); display: block;"><div style="position: fixed; top: 50%; left: 50%; width: 200px; margin-left: -100px; height: 100px; margin-top: -50px; background-color: rgba(0,0,0,0.4);"><div style="position: fixed; top: 50%; left: 50%; margin-top: -19px; margin-left: -69px; display: block; font-size: 32px; color: white;">be patient</div></div></div>');
mappage.append(patient);
var gotmpic = $('<div id="gotm" style="position: fixed; z-index: 9999; right: 0; bottom: 0; width: 100px; height: 400px; display: none;"><a id="gotmlink" href="" target="_blank"><img id="gotmpic" src="" width="100" height="100"></a></div>');
mappage.append(gotmpic);

//
var display = 'block';
//var display = 'none';

var GSheetUrl = 'https://docs.google.com/spreadsheets/d/';
var MSheetUrl = 'https://onedrive.live.com/view.aspx?resid=';
var mapUrl = 'https://www.munzee.com/map/';

var iconCounter = {};
var disabledIcons = [];
var imgSRC = "";
var iLoop;

var munzeeGroups = {
'ZodiacsIcons': ['scorpio','sagittarius','capricorn','aquarius','pisces','aries','taurus','gemini','cancer','leo','virgo','libra','dogchinesezodiac','pigchinesezodiac','ratchinesezodiac','oxchinesezodiac','tigerchinesezodiac','rabbitchinesezodiac','dragonchinesezodiac','snakechinesezodiac','horsechinesezodiac','goatchinesezodiac','monkeychinesezodiac','roosterchinesezodiac','nile','amon-ra','geb','mut','osiris','isis','thoth','horus','anubis','seth','bastet','sekhmet','celticwolf','celticfalcon','celticstag','celticcat','celticadder','celticfox','celticbull','celticseahorse','celticwren','celtichorse','celticsalmon'],
'PlacesIcons': ['poiairport','poisports','poiuniversity','poimuseum','poiwildlife','poihistoricalplace','poilibrary','poifirstresponders','poifaithplace','poihospital','poipostoffice','poicemetery','poiuniqueattraction','poivirtualgarden','poicinema','poitransportation','poiplaypark','poibank','poibeach','poicampground','poigolf','poidrinkdepot','poientertainment','poipet','poimemorial','poigym','poipharmacy'],
'FlatsIcons': ['flatrob','mhqflatrob','flatmatt','mhqflatmatt','flatlou','towerbridgeflatlou','flathammock','gettysburgflathammock','flatdhs','flatdiscgolfbasket','flatflashlight','flattypewriter','flatmurray','flatrum','flatcats','flatvan','flatcup'],
'MysteriesIcons': ['mystery','firemystery','icemystery','earthmystery','watermystery','airmystery','electricmystery','voidmystery'],
'VirtualsIcons': ['virtual','virtual_rainbow','virtual_timberwolf','virtual_silver','virtual_gray','virtual_black','virtual_orchid','virtual_wisteria','virtual_purple_mountains_majesty','virtual_violet','virtual_plum','virtual_blue_violet','virtual_blue','virtual_cadet_blue','virtual_periwinkle','virtual_cornflower','virtual_blue_green','virtual_pacific_blue','virtual_cerulean','virtual_robin_egg_blue','virtual_indigo','virtual_turquoise_blue','virtual_sea_green','virtual_granny_smith_apple','virtual_green','virtual_forest_green','virtual_asparagus','virtual_olive_green','virtual_yellow_green','virtual_green_yellow','virtual_spring_green','virtual_gold','virtual_yellow','virtual_goldenrod','virtual_dandelion','virtual_orange','virtual_burnt_orange','virtual_melon','virtual_pink','virtual_carnation_pink','virtual_mauvelous','virtual_salmon','virtual_tickle_me_pink','virtual_magenta','virtual_wild_strawberry','virtual_violet_red','virtual_red_violet','virtual_apricot','virtual_peach','virtual_macaroni_and_cheese','virtual_tan','virtual_burnt_sienna','virtual_bittersweet','virtual_red_orange','virtual_scarlet','virtual_red','virtual_brick_red','virtual_mahogany','virtual_chestnut','virtual_tumbleweed','virtual_raw_sienna','virtual_brown'],
'CreaturesIcons': ['gleamingmuru','gleamingmuruchi','gleamingmurutain','gleamingtuli','gleamingtulimber','gleamingtuliferno','gleamingvesi','gleamingvesial','gleamingvesisaur','ohkmegu','murinmegu','urgasmegu','koobas','kartus','kabuhirm'],
'EvolutionsIcons': ['tomatoseed','tomatoplant','tomato','cornseed','cornstalk','earofcorn','carrotseed','carrotplant','carrot','peasseed','peasplant','peas','goldencarrotseed','goldencarrotplant','goldencarrot','calf','cow','milk','piglet','pig','bacon','colt','racehorse','championshiphorse','chick','chicken','eggs','lean-toshed','gardenshed','barn','hoe','plow','tractor','farmer','farmerandwife','family','pottedplant','garden','field','ducknest','duckegg','duckling','seaweed','fish','shark','canoe','motorboat','submarine','egg','dinosaur','bones','firstwheel','penny-farthingbike','musclecar','lioncub','lion','kingofthejungle','safaritruck','safarivan','safaribus','antiquephone','rotarydialphone','brickphone','zphone','mainframe','pc','laptop','tablet','cowryshell','goldnuggets','papermoney','creditcard','handwrittenletter','carrierpigeon','telegram','email','roseseed','rosegermination','rosegrowth','rosebud','rose','redroseblossom','violetroseblossom','whiteroseblossom','yellowroseblossom','tulipseed','tulipgermination','tulipgrowth','tulipbud','tulip','bluetulipblossom','pinktulipblossom','whitetulipblossom','lilyseed','lilygermination','lilygrowth','lilybud','lily','pinklilyblossom','violetlilyblossom','whitelilyblossom','carnationseed','carnationgermination','carnationgrowth','carnationbud','carnation','pinkcarnationblossom','redcarnationblossom','violetcarnationblossom','whitecarnationblossom','yellowcarnationblossom','butterflyegg','caterpillar','chrysalis','hatchedchrysalis','frogegg','tadpole','pollywog','froglet','turtleegg','turtlehatchling','juvenileturtle','adultturtle','planulalarva','polyp','polypwithbulbs','ephyralarva','beeeggs','beelarvae','beepupae','emptyhoneycomb','coin','bagofcoins','treasurechest'],
'JewelsIcons': ['diamond','ruby','aquamarinemunzee','topaz','pinkdiamond','virtualemerald','virtual_amethyst','virtualsapphire','virtualcitrine','virtualonyx'],
'GamingIcons': ['surprise','prizewheel','scatter','rockpaperscissors','bowlingball','urbanfit','joystickphysical','joystickvirtual','sirprizewheel','walnutchessset','maplechessset'],
'DestinationsIcons': ['motel','motelroom','1starmotel','2starmotel','3starmotel','1starmotelroom','2starmotelroom','3starmotelroom','hotel','hotelroom','2starhotel','3starhotel','4starhotel','2starhotelroom','3starhotelroom','4starhotelroom','virtual_resort','virtual_resortroom','3starresort','4starresort','5starresort','3starresortroom','4starresortroom','5starresortroom','timesharemunzee','timeshareroom','vacationcondo','vacationcondoroom','treehouse','treehouse1','treehouse2','treehouse3','treehouse4','treehouse5','treehouse6','treehouse7','premiumtreehouse','premiumtreehouse1','premiumtreehouse2','premiumtreehouse3','premiumtreehouse4','premiumtreehouse5','premiumtreehouse6','premiumtreehouse7','skyland','skyland1','skyland2','skyland3','skyland4','skyland5','skyland6','skyland7','premiumskyland','premiumskyland1','premiumskyland2','premiumskyland3','premiumskyland4','premiumskyland5','premiumskyland6','premiumskyland7'],
'ClanWeaponsIcons': ['mace','longsword','battleaxe','thehammer','crossbow','catapult','shield','brokenshield'],
'ZeecretWeaponsIcons': ['briefcase','nightvisiongoggles','walkietalkiewatch'],
'TemporaryIcons': ['envelope','temporaryvirtual','tpobpub','tpobpub1','tpobpub2','tpobpub3','tpobpub4','tpobpub5','tpobpub6','scrapstar','scrapstar1','scrapstar2','scrapstar3','scrapstar4','scrapstar5','scrapstar6','teapob','teapob1','teapob2','teapob3','teapob4','teapob5','teapob6','gingerbouncehouse','gingerbouncehouse1','gingerbouncehouse2','gingerbouncehouse3','gingerbouncehouse4','gingerbouncehouse5','gingerbouncehouse6','gingerbouncehouse7','tunnelofhugz','tunnelofhugz1','tunnelofhugz2','tunnelofhugz3','tunnelofhugz4','tunnelofhugz5','tunnelofhugz6','tunnelofhugz7'],
'TourismIcons': ['txhistoricallocation','flhistoricallocation','cahistoricallocation','worldheritagehistoricallocation','greatbritainiconiclocation','czechrepubliciconiclocation','slovakiaiconiclocation','washingtoniconiclocation','newhampshireiconiclocation','newmexicoiconiclocation','australiaiconiclocation','minnesotaiconiclocation'],
'ResellersIcons': ['reseller','virtualreseller','munzeemadnessreseller','geostuffreseller','geohobbiesreseller','ddcardsreseller','negsreseller','virtualnegsreseller','geologgersreseller','virtualgeologgersreseller','mmcocoabeachreseller','rujareseller','laupereseller','scgsreseller','virtualscgsreseller','virtualgoldncoinsreseller'],
'MiscIcons': ['springseasonalmunzee','summerseasonalmunzee','fallseasonalmunzee','winterseasonalmunzee','seasonal','munzee','premium','social','trail','personalmunzee','virtual_trail','shamrock','eventpin','eventindicator','virtualshamrock','eventtrail','premiumpersonal','qrewzee','renovation','sleepzee','waywardnation','whompnation','internationelles','internationellesvirtual','roadwarriors2022','eventhostlounge'],
'Mailbox': ['merrymisermailbox','wonderfulwizardmailbox','darksidemailbox'],
'11111': ['universal_bash','oktoberfestbash-beerboot','pillow_physical','pillow_virtual','dicetower'],
'Bouncers': ['beachflatrob','coldflatrob','tuxflatrob','robastzee','face-offflatmatt','footyflatmatt','matt\'erupflatmatt','internationellesflatlou','teamgbflatlou','polkadotflatlou','phantomflatrob','phantomflatmatt','phantomflatlou','theunicorn','leprechaun','dragon','yeti','faun','hydra','pegasus','cyclops','mermaid','fairy','banshee','nymph','poseidon','aphrodite','hades','zeus','jabberwock','treefolk','owlbear','dryadfairy','wildfirefairy','battleunicorn','hippocampunicorn','dwarfleprechaun','goblinleprechaun','hotspringmermaid','melusinemermaid','chinesedragon','wyverndragon','lycanthropeyeti','reptoidyeti','griffinpegasus','alicornpegasus','centaurfaun','krampusfaun','cerberushydra','cthulhuhydra','harpybanshee','witchbanshee','minotaurcyclops','balorcyclops','vampirenymph','elfnymph','dodecahedron','candycornunicorn','leprecorn','monsteryeti','nightmarepegasus','midnightdragon','snowqueen','merrymermaid','ghostofchristmasfuture','sugarplumfairy','ladyleprechaun','oillipheisthydra','fardarrigfaun','recyclops','whiterabbit','kingofheartsfaun','queenofheartsbanshee','skeleunicorn','skelecyclops','skelehydra','skelemermaid','skatingunicorn','joggingyeti','fitnessfaun','aquarobicsmermaid','s83Gnwh9i0Wyr4bFQh41z','k9G2vYr7tzE9jbF24p1es','u8bD2jH1vosFq9lmR3x82','j2b8M9stR1zogH9w1Yve6','n4K2c8hdP5qy3Fx8hfDw8','l9fJ2nY74naE7hf1wZ9ju','n3bT8xUw29Lvrp4Nsw01nb','q8xo3F1Md0F2s9wK8cTe1m','h3sOn8cF1x9pG4buf18Seb','d9H2nFq8p4Vyrh1Au7kxef','wF8b2z9fH3Qpr7nGd8kYw3','legacyunicorn','legacydragon','legacyleprechaun','legacyyeti','legacypegasus','legacyfaun','legacyhydra','legacycyclops','campcap-a-lotcounselor','campqrantinecounselor','campfreezcounselor','campkennezeecounselor','rainbowunicorn','gnomeleprechaun','icedragon','sasquatchyeti','firepegasus','cherub','ogre','chimera','siren','fairygodmother','gorgon','motherearth','retiredunicorn','retiredleprechaun','retireddragon','retiredyeti','retiredfaun','retiredhydra','retiredmermaid','retiredpegasus','retiredcyclops','retiredfairy','retiredbanshee','retirednymph','nomad','nomadvirtual','nomadmystery','bellhopnomad','piratenomad','travelernomad','seasonalnomad','virtualflatnomad','zeecretagentnomad','gamingnomad','jewelthiefnomad','warriornomad','coupechampionnomad','jason4zees','jason4zeesnomad','coupechampions%231','coupechampions%232','coupechampions%233','coupechampions%234','coupechampions%235','coupechampions%236','coupechampions%237','coupechampions%238','coupechampions%239','coupechampions%2310','coupechampions%2311','coupechampions%2312','coupechampions%2313','coupechampions%2314','coupechampions%2315','coupechampions%2316','coupechampions%2317','coupechampions%2318','coupechampions%2319','coupechampions%2320','coupechampions%2321','coupechampions%2322','coupechampions%2323','tuli','tulimber','tuliferno','vesi','vesial','vesisaur','muru','muruchi','murutain','hadavale','pimedus','mitmegu','jootmegu','rohimegu','lokemegu','puffle','pufrain','puflawn','elekter','elekjoud','elektrivool','magnetus','sparbee','sparfox','zombietuli','zombievesi','zombiemuru','zombieelekter','zombiemagnetus','zombiepimedus','zombiepuffle','mallard','quack','swan','morphobutterfly','monarchbutterfly','limebutterfly','treefrog','poisondartfrog','tomatofrog','seaturtle','snappingturtle','taekwondotortoise','boxjellyfish','goldenjellyfish','pb&jellyfish','honeybee','queenbee','wallabee','topaas','ametust','oniks','teemant','smaragd','akvamariin','rubiin','safiir','roosa','tsitriin','vikerkaar','bowling-1stroll','bowling-2ndroll','1stroll','2ndroll','runzeerob','goldcoin','leapfrog','fly','munch-man','ghostzee','walnutpawn','walnutknight','walnutbishop','walnutrook','walnutqueen','walnutking','maplepawn','mapleknight','maplebishop','maplerook','maplequeen','mapleking','trojanunicorn','spyderbot','squashedspyderbot','lasershark','brokenlasershark','goldenlasershark','brokengoldenlasershark','arcticlasershark','brokenarcticlasershark','gingermechman','fr057y','brokenfr057y','mumm33','brokenmumm33','mechanic4k3','mechanic4k3_crumbled','s4rc0ph4gus','monk3y','prim8','kingc0g','kingc0g_crushed','steinbot','steinbot_empty','carafeborg','carafeborgempty','carafeborg_empty','h3adl3ssh0rs3man','h3adl3ssh0rs3mansmashed','tr33t0pp3r','tr33t0pp3rtakeoff','loc04lmotive','loc04lmotiveoverheated','gwrench','gwrenchcombusted','abominablesn0wmachine','abominablesn0wmachinefrostbitten','breadbot','burntbreadbot','eros404','heartbrokeneros404','xbot','xhaustedxbot','obot','offbalanceobot','shamrocknrolla','smashedshamrocknrolla','m0th3rb04rd','burntm0th3rb04rd','fathertim3','dizzyfathertim3','bananaborg','brownbananaborg','p3n9u1n','frozenp3n9u1n','emperorp3n9u1n','frozenemperorp3n9u1n','r3x-0-skeleton','shippedr3x-0-skeleton','cappi','sleepmodecappi','arf2d2','swampyarf2d2','zee-3p0','zee-3p0scraps','robocado','brownrobocado','s33dl1n9','spr0u7','7ul1p','bl0ss0m','sun','r053','paintedr053','ch3shirecat','floatingch3shirecat','c4t3rp1ll4r','butt3rfry','hibernatingbutt3rfry','m1lkman','missingm1lkman','h0ta1rballoon','deflatedh0ta1rballoon','chugboat','wreckedchugboat','lanchop','burntlanchop','countcalcula','nestingcountcalcula','screwge','hauntedscrewge','turkey','turkeystrike','sugarsentry','crashedsugarsentry','kitchens1nk','overflowingkitchens1nk','goldncoinsrumbot','brokengoldncoinsrumbot','geologgersrumbot','brokengeologgersrumbot','negsrumbot','brokennegsrumbot','scgsrumbot','brokenscgsrumbot','b00mbox','deadliftingb00mbox','freddifr0g','freddifr0goutline','y1n','catnappingy1n','y4ng','chargingmodey4ng','y1ny4ng','deconstructedy1ny4ng','t0t0','basketcaset0t0','wingedmonkey','twist3dsist3r','crashlandedtwist3dsist3r','d4rthvardeman','scrappedd4rthvardeman','c++b1scu1t','gluedc++b1scu1t','pr1nc3sslou-a','hologrampr1nc3sslou-a','runedtable','roundtable','frogcubimal','smugglercubimal','rubecubimal','foxcubimal','greeterbotcubimal','firebogcubimal','chickcubimal','bureaucratcubimal','ilmenskiejonescubimal','emo-bearcubimal','cactuscubimal','piggycubimal','gnomecubimal','maintenancebotcubimal','cybersaurusrex','brokencybersaurusrex','cyborgsanta','brokencyborgsanta','gingermechman','gingersnappedman','31f','broken31f','reindroid','fleetingreindroid','rud01ph','fleetingrud01ph','krampbot','krushedkrampbot','rainbowsnowcone','christmaztree','pixelpresent','christmazpickle','putridpresent','snowball','fr057y','brokenfr057y','gardengnome','icehockeygardengnome','archerygardengnome','basketballgardengnome','runninggardengnome','soccergardengnome','skateboardinggardengnome','baseballgardengnome','awardshowgardengnome','cricketgardengnome','footballgardengnome','cyclinggardengnome','esportsgardengnome','skiinggardengnome','stonegardengnome','newyearsevegardengnome','aussieexplorergardengnome','goldminergardengnome','queen\'sguardsmangardengnome','astronautgardengnome','gardenflamingo','newyeargardenflamingo','valentinesgardenflamingo','luckygardenflamingo','foolishgardenflamingo','graduategardenflamingo','marchharegardenflamingo','alohagardenflamingo','birthdaygardenflamingo','motoristgardenflamingo','oktoberfestgardenflamingo','flaminghost','gobblinggardenflamingo','giftinggardenflamingo','aussieexplorergardenflamingo','goldminergardenflamingo','queen\'sguardsmangardenflamingo','astronautgardenflamingo','unicornflamingofloatie','flamingofloatie','hummingbird','munzeemascot','wallabeemascot','dinerjukebox','sodafountainjukebox','gardenhedge','godzeelagardenhedge','rabbitgardenhedge','froggardenhedge','fishgardenhedge','liongardenhedge','kangaroogardenhedge','dragongardenhedge','beargardenhedge','spacemanateegardenhedge','swangardenhedge','fishgardenhedge','unicorngardenhedge','elephantgardenhedge','quacknifyingglass','webbedfingerprints','flatsherquackholmes','flatgooseface','flatduckprez','flatduckcyclist','flatduckcowboy','flatduckunicorn','flatduckdog','flatduckcats','flatduckwriter','flatduckdiscgolfer','flatducktapehead','flatduckraver','flatduckpirate','charmbox','charmcase','luckzee_charms_universal','flatfield','flatfarm','telescope','spyglass'],
'Scatters': ['ankhartifact','ouroborosartifact','djedartifact','scarabartifact','shenartifact','eyeofraartifact','tyetartifact','eyeofhorusartifact','sistrumartifact','canopicjarartifact','wasscepterartifact','sesenartifact','celticcrossknot','trinityknot','loveknot','daraknot','sailor\'sknot','spiralknot','solomon\'sknot','shieldknot','fire','frozengreenie','tree','cherryblossom','redapple','peach','pear','pecan','acorn','deadbranch','cardinalfeather','ice_bucket','waterdroplet','feather','goldenfeather','charge','blackhole','planet','spaceship','lostsock','can','meteor','boulder','flamingarrow','laserpen','lasertrail1','lasertrail2','lasertrail3','trident','lifebuoy','glasses','shell-phone','bident','firestarter','lightningbolt','multimeter','vorpalsword','ironroot','owlbeareggs','deye','sc4rab','killermask','botwurst','dronut','flamingpumpkin','n1nj4st4r','wr3nch','sn0wbomb','toast33','l0v3bug','heartthrobots','rougebot','blarneybeats','c00k13s','hourglass','p33l','m4ck3rel','kingm4ck3rel','f0ssil','leashsaber','tintopper','pitt','purplepetal','pinkpetal','redpetal','yellowpetal','wiltedfl0w3r','floatinghead','sm0kemessage','sm0kesong','spiltmilk','pyropellar','ancore','grillguy','battery','candlestick','turkeyring','pepperminuteman','b0wl','cu9','pl8','t4p3','bloterfly','str1p3','sc4l3','rubyscripter','poppyflower','psyclone','bread-and-butterfly','paintedpetal','lookingglass','metalcarpals','lasersaber','sugarcubed^','bikebuns','runedstaff','undercoveragent','liaisonagent','cloverleaf','goldenclover','scattered','dossier','infraredvirtual','bident','tree','eatmecookie','sweettreats','rainbowsnowcone','christmazpickle','gold\'ncoinsresellerpackage','goldncoinsresellerpackage','scgsresellerpackage','negsresellerpackage','geologgersresellerpackage','gnomehockeyhelmet','gnomearcheryhood','gnomenogginnet','gnomeheadphones','gnomeheaderhat','gnomeheelfliphat','gnomecatcherscap','10thmunzeebirthdayhat','gnomeclubcap','gnometouchdowntopper','cyclingcasquette','gnomegamingheadset','gnometoquetopper','gnomecountdowncap','madhattergnomehat','gnomeexplorerhat','gnomeminerhat','gnomebearskinhat','gnomeastronauthelmet','flatfindertape','specterdirectortape','qretaceouscamptape','backtozeefuturetape','festivefeathers','lovelyfeathers','fortunefeathers','funnyfeathers','goldsealfeathers','madfeathers','tropicalfeathers','confettifeathers','fearlessfeathers','bavarianfeathers','spookyfeathers','paperfeathers','holly-dayfeathers','crikeyfeathers','flannelfeathers','bearskinfeathers','spaceflightfeathers','frozenflocktail','flocktail','screamingballoon','bee-ball','robastzee-nevergonnagivelouup','zeezeetop','themunzees','zeetles-evosubmarine','thecapenters','thepremiums-meetthepremiums','capthemagicdragon','pinkfloymingo','munz&roses-welcometozeejungle','bonjozee-wantedzedoralive','nullvana-mythslikezeespirit','gnomedoubt','queen(ofhearts)','u.t.l.-straightouttacapons','n\'zeenc','momunzees,mocaproblems','zeezer-greeniealbum','capontherooftop','rovertherednosedreindog','zeenglebells','greeniechristmas','you\'reameanonemrgwrench','mechthehalls','rockin\'aroundzeechristmastree(house)','grandmagotrunoverbyareindroid','lastchristmas(igaveyoumycard)','alliwantforchristmasislou!','auldlangsigningoff','islandofmythsfittoys','themunzeesflashlight','deezcoballflashlight','lightzaberflashlight','zailormoonflashlight','firelily','bunnybloom','johnnyjumpupflower','waterlilyflower','dandelionflower','kangaroopaws','dragonlily','teddybearsunflower','alienflower','swanflower','waterlilyflower','hydrangeaflower','elephantheadflower','heartcharm','teddybearcharm','rosecharm','diamondringcharm','dramamaskscharm','jesterhatcharm','mardigrasmaskcharm','fluer-de-lischarm','phonecharm','unicorncharm','globecharm','gpspincharm','diplomacharm','rubyslipperscharm','medalofcouragecharm','heartshapedclockcharm','leprechaunhatcharm','shamrockcharm','rainbowcharm','beercharm','rubberchickencharm','hahacharm','googlyglassescharm','bananapeelcharm','acousticguitarcharm','electricguitarcharm','ukulelecharm','keytarcharm','mooncharm','spaceshuttlecharm','satellitecharm','astronauthelmetcharm','flyingsaucercharm','alienplanetcharm','littlegreenmancharm','robotcharm','flamingofeather','@-@walker','scrapdestroyer','i-fighter','z-wing','flathound','flatdoxy','flatrooster','flathen','flatduck','flatsheep','flatcamel','flatwallabee','flatfrog','flatalpaca','flatgoat','flatsquirrel','flatfindertape','specterdirectortape','qretaceouscamptape','backtozeefuturetape','lenscap','blurredview','lensflare','closeup','smudgedview','moondebrie','crackedspyglass','unicornisconstellation','leipreachanconstellation','consolationprize','dracoconstellation','yaticonstellation','pigasosconstellation','favnosconstellation','ydraconstellation','kyklopasconstellation','meerminconstellation','nymficonstellation','beansidheconstellation','faerieconstellation','putterdisc','mid-rangedisc','driverdisc'],
'UncategorisedIcons': ['magenta','business','maintenance','virtualmasterofdisguise','physicalmasterofdisguise','goldenticket','unbirthdaymailbox','roadwarriors2022','landingpad','gold'],
'ismeretlen': ['drinkmepotion','event_trail','ms.munchman','treat','trick','mythicalbandaidz','rainbowmythicalbandaidz','assortedchocolate','chocolatecoveredcherry','coexist','pixelcupid','sweettreats','eventzeeeventattendee','taekwondotortoise','magic8ball-askrob','magic8ball-growthemap!','magic8ball-nope','magic8ball-expecttheunexpected!','magic8ball-1000hours','magic8ball-blamescott','magic8ball-thisisfine','hatchedredegg','hatchedblueegg','hatchedyellowegg','hatchedwhiteegg','a.partridge','accessibility','diabetesawarenesscharity','talonprint','hoofprint','clawprint','pawprint','footprint','bcapin','mulligan','satellite','lostkey','greenheartbreaker','pinkheartbreaker','redheartbreaker','yellowheartbreaker','tophat','virtual_shamrock_2016','rmh_virtual','2015heartpink','2015heartorange','2015heartgreen','2015heartyellow','pawgarden','bcagarden','passport','travelerscheck','ghostofchristmaspast','ghostofquizmunzeespast','ghostofnfcmunzeespast','ghostofbusinessmunzeespast','ghostofsurprisemunzeespresent','ghostoftrailmunzeespresent','ghostoftemporarymunzeespresent','ghostofchristmaspresent','ghostofnegativemunzeesyettocome','ghostofdeletemunzeesyettocome','ghostofchristmasyettocome','ghostofnukemunzeesyettocome','event','partyqrashercastle'],
'Cards': ['a+card','a+_card','a%2Bcard','a%2B_cardapplecard','apple_card','bookwormcard','bookworm_card','scroogecard','scrooge_card','tophatcard','top_hat_card','donationcard','donation_card','dinnerinvitecard','dinner_invite_card','boilercard','boiler_card','knockercard','knocker_card','bitofbeefcard','bit_of_beef_card','pajamascard','pajamas_card','chainmailcard','chain_mail_card','ghostofmarleycard','ghost_of_marley_card','wingsofthepastcard','wings_of_the_past_card','schoolbookscard','school_books_card','friendscard','friends_card','familycard','family_card','feelingscard','feelings_card','laurelpresentcard','laurel_present_card','cratchitcard','cratchit_card','tinytimcard','tiny_tim_card','christmaspartycard','christmas_party_card','ignorancecard','ignorance_card','wantcard','want_card','shroudsofthefuturecard','shrouds_of_the_future_card','belongingscard','belongings_card','flowerscard','flowers_card','gravestonecard','gravestone_card','christmasturkeycard','christmas_turkey_card','freshaircard','fresh_air_card','whitechristmascard','white_christmas_card','sledcard','sled_card','workfriendscard','work_friends_card','festivefeastcard','festive_feast_card','blessingscard','blessings_card','prairiecard','prairie_card','dorothycard','dorothy_card','totocard','toto_card','overtherainbowcard','over_the_rainbow_card','flyinghousecard','flying_house_card','rubyslipperscard','ruby_slippers_card','wickedwitchofthewestcard','wicked_witch_of_the_west_card','goodwitchofthenorthcard','good_witch_of_the_north_card','scarecrowcard','scarecrow_card','tinwoodmancard','tin_woodman_card','cowardlylioncard','cowardly_lion_card','thegreatozcard','the_great_oz_card','hourglasscard','hourglass_card','waterbucketcard','water_bucket_card','winkieguardcard','winkie_guard_card','theresnoplacelikehomecard','theres_no_place_like_home_card','cloudcitycard','cloud_city_card','echobasecard','echo_base_card','twinsunscard','twin_suns_card','skifortresscard','ski_fortress_card','snowcamelcard','snow_camel_card','fullbodybathcard','full_body_bath_card','luckyyetiarmcard','lucky_yeti_arm_card','ispycard','ispy_card','tripwirecard','trip_wire_card','spacewormcard','space_worm_card','cloudycapecard','cloudy_cape_card','spacepokercard','space_poker_card','bountyhuntercard','bounty_hunter_card','iloveyoucard','i_love_you_card','iknowcard','i_know_card','stonecoldsleepcard','stone_cold_sleep_card','hyperspeedcard','hyperspeed_card','hardheadedcard','hard_headed_card','swampstopcard','swamp_stop_card','yoduhcard','yo_duh_card','spacesnackscard','space_snacks_card','forcetrainingcard','force_training_card','bucketheadcard','buckethead_card','spacespiritcard','space_spirit_card','aaacard','aaa_card','droidrepaircard','droid_repair_card','sharpshootercard','sharpshooter_card','willrowhoodcard','willrow_hood_card','spaceswordsmencard','space_swordsmen_card','daddyissuescard','daddy_issues_card','givehimahandcard','give_him_a_hand_card','spaceracecard','space_race_card','barbariancharactercard','barbarian_character_card','elfcharactercard','elf_character_card','magecharactercard','mage_character_card','warriorcharactercard','warrior_character_card']
};

var buttonsGroups = {
    'player' : ['ClanWeaponsIcons','ZeecretWeaponsIcons','FlatsIcons','VirtualsIcons','EvolutionsIcons','ZodiacsIcons','DestinationsIcons','PlacesIcons','GamingIcons','MysteriesIcons','JewelsIcons','ResellersIcons','TourismIcons','MiscIcons','Mailbox','11111','UncategorisedIcons','ismeretlen','Cards','Universals'
//'Bouncers','CreaturesIcons'
//'Scatters'
//'TemporaryIcons'
    ],
    'bouncers' : ['Bouncers','CreaturesIcons'],
    'weapons' : ['ClanWeaponsIcons','ZeecretWeaponsIcons'],
    'flats' : ['FlatsIcons'],
    'colors' : ['VirtualsIcons'],
    'evolutions' : ['EvolutionsIcons'],
    'zodiacs' : ['ZodiacsIcons'],
    'destinations' : ['DestinationsIcons'],
    'places' : ['PlacesIcons'],
    'gaming' : ['GamingIcons'],
    'scatters' : ['Scatters'],
    'mysteries' : ['MysteriesIcons'],
    'jewels' : ['JewelsIcons'],
    'resellers' : ['ResellersIcons'],
    'tourism' : ['TourismIcons'],
    'temporarys' : ['TemporaryIcons'],
    'other' : ['MiscIcons','Mailbox','11111','UncategorisedIcons','ismeretlen','Cards','Universals'],
    'gardens' : []
}
var buttonsName = [];
var buttons = {};
for (iLoop in buttonsGroups) {
    buttons[iLoop] = false;
    buttonsName.push(iLoop);
}
var setGardensButton = false;
//var sheetButton = false;

var playerButtons = ['weapons','flats','colors','evolutions','zodiacs','destinations','places','gaming','mysteries','jewels','resellers','tourism','other'];
var gardenPoints = [];
var categories = {'by garden': 'sort by garden', 'by city': 'sort by city', 'by owner': 'sort by owner', 'by topic': 'sort by topic'};
var GOTMlinks = {
    '2307': 'july-2023-gotm-winners',
    '2306': 'june-2023-gotm-winners',
    '2305': 'may-2023-gotm-winners',
    '2304': 'april-2023-gotm-winners',
    '2303': 'march-2023-gotm-winners',
    '2302': 'february-2023-gotm-winners',
    '2301': 'january-2023-gotm-winners',
    '2212': 'december-2022-gotm-winners',
    '2211': 'november-2022-gotm-winners',
    '2210': 'october-2022-gotm-winners',
    '2209': 'september-2022-gotm-winners',
    '2208': 'august-2022-gotm-winners',
    '2207': 'july-2022-gotm-winners',
    '2206': 'june-2022-gotm-winners',
    '2205': 'may-2022-gotm-winners',
    '2204': 'april-2022-gotm-winners',
    '2203': 'march-2022-gotm-winners',
    '2202': 'february-2022-gotm-winners',
    '2201': 'january-2022-gotm-winners',
    '2112': 'december-2021-gotm-winners',
    '2111': 'november-2021-gotm-winners',
    '2110': 'october-2021-gotm-winners',
    '2109': 'september-2021-gotm-winners',
    '2108': 'august-2021-gotm-winners',
    '2107': 'july-2021-gotm-winners',
		// Rob Hearts Lou by Buckeyecacher111 in Greenville, OH
    '2106': 'june-2021-gotm-winners',
    '2105': 'may-2021-gotm-winners',
    '2104': 'april-2021-gotm-winners',
    '2103': 'march-2021-gotm-winners',
    '2102': 'february-2021-gotm-winners',
    '2101': 'january-2021-gotm-winners',
		// Charlotte Electric Lightbulb by MrsHB31 in Charlotte, NC
    '2012': 'december-2020-gotm-winners-the-future-of-potm',
    '2011': 'november-2020-gotm-winners-december-potm-requirements',
    '2010': 'october-2020-gotm-winners-november-potm-requirements',
    '2009': 'september-2020-gotm-winners-october-potm-requirements',
    '2008': 'august-2020-gotm-winners-september-potm-requirements',
    '2007': 'july-2020-gotm-winners-august-potm-requirements',
    '2006': 'june-2020-gotm-winners-july-potm-requirements',
    '2005': 'may-2020-gotm-winners-june-potm-requirements',
    '2004': 'april-2020-gotm-winners-may-potm-requirements',
		// Circus Carousel Garden by dt07751 & hunniees in University Park, FL
		// Easter Lily Garden by markcase in Burlington, NC
    '2003': 'march-2020-gotm-winners-april-potm-requirements',
    '2002': 'february-2020-gotm-winners',
    '2001': 'january-2020-gotm-winners',
    '1912': 'december-gotm-winners',
    '1911': 'november-gotm-and-potm-winners',
    '1910': 'october-gotm-and-potm-winners',
    '1909': 'celebrating-september-potm-and-gotm-winners',
		// Casa de Santana by Cidinho in the Madeira Islands
    '1908': 'announcing-august-gotm-and-potm-winners',
        // Sunflower Garden by wemissmo in Fort Myers, Florida
    '1907': 'july-gotm-is-twice-as-nice-with-double-the-winning-gardens',
    '1906': 'announcing-june-potm-and-gotm-winners-qrazy-challenge',
    '1905': 'garden-of-the-month-may-winners-revealed',
    '1904': 'april-gardens-of-the-month-winners-revealed',
    '1903': 'march-gotm-winners-revealed',
    '1902': 'february-garden-of-the-month-winners-revealed',
    '1901': 'first-ever-gardens-of-the-month-winners-revealed'
		// Burger and Pizza Garden organized by Mnbball in Minneapolis, Minnesota
};

var PushData = { // xx.x -> xx.x009
    'Australia_Casino Lucky Star': ['flats'],
    'Australia_Flat Rob Berwick': ['flats'],
    'Australia_Flat Rob Berwick (Flats)': ['colors'],
    'Australia_Gatton Arrows - Arrow4': ['flats'],
        'Gatton_Gatton Arrows - Arrow4': ['flats'],
        'BonnieB1_Gatton Arrows - Arrow4': ['flats'],
        'Chandabelle_Gatton Arrows - Arrow4': ['flats'],
    'Australia_Gatton Arrows - Arrow5': ['colors','jewels','gaming'],
        'Gatton_Gatton Arrows - Arrow5': ['colors','jewels','gaming'],
        'BonnieB1_Gatton Arrows - Arrow5': ['colors','jewels','gaming'],
        'Chandabelle_Gatton Arrows - Arrow5': ['colors','jewels','gaming'],
    'Canada_Fabulous February Fete Heart': ['flats'],
        'Vancouver_Fabulous February Fete Heart': ['flats'],
    'Canada_Fabulous February Fete (Flats)': ['colors'],
        'Vancouver_Fabulous February Fete (Flats)': ['colors'],
    'Finland_Espoon vaakuna Herald of Espoo': ['flats'],
        'mandello_Espoon vaakuna Herald of Espoo': ['flats'],
    'Finland_Espoon vaakuna Herald of Espoo (Flats)': ['colors'],
        'mandello_Espoon vaakuna Herald of Espoo (Flats)': ['colors'],
    'Finland_Kalevankankaan ankkuri': ['flats'],
    'Finland_Tampere electric': ['flats'],
        'Tampere_Tampere electric': ['flats'],
    'Germany_Appenzeller Sennenhund RT': ['flats'],
        'Reutlingen_Appenzeller Sennenhund RT': ['flats'],
        'geckofreund_Appenzeller Sennenhund RT': ['flats'],
    'Germany_Flats @ Appenzeller RT': ['colors','gaming','mysteries','jewels'],
        'Reutlingen_Flats @ Appenzeller RT': ['colors','gaming','mysteries','jewels'],
        'geckofreund_Flats @ Appenzeller RT': ['colors','gaming','mysteries','jewels'],
    'Netherlands_Grabbelton Reeuwijk': ['flats'],
    'Netherlands_Grabbelton Reeuwijk (Flats)': ['weapons','colors','evolutions','gaming','mysteries','jewels'],
    'Netherlands_Gouda': ['flats'],
    'Netherlands_Heerlens drieluik': ['flats'],
    'Netherlands_Heerlens drieluik (Flats)': ['weapons','colors','evolutions','zodiacs','gaming','mysteries','jewels','resellers','other'],
    'New Zealand_Howick Jewel Art #1': ['flats'],
        '321Cap_Howick Jewel Art #1': ['flats'],
    'New Zealand_Howick Jewel Art #1 (Flats)': ['colors','mysteries','jewels'],
        '321Cap_Howick Jewel Art #1 (Flats)': ['colors','mysteries','jewels'],
    'New Zealand_Grafton Star': ['flats'],
    'New Zealand_Grafton Star (Flats)': ['weapons','colors','evolutions','gaming','jewels'],
    'New Zealand_Welcome Home Moira': ['flats'],
    'New Zealand_Welcome Home Moira (Flats)': ['colors','gaming'],
    'Slovakia_QRate Opener DNV': ['other'],
    'Slovakia_Shamrock Ihro': ['flats'],
        'Bratislava_Shamrock Ihro': ['flats'],
        'Rikitan_Shamrock Ihro': ['flats'],
    'Slovakia_Shamrock Ihro (Flats)': ['colors','jewels','other'],
        'Bratislava_Shamrock Ihro (Flats)': ['colors','jewels','other'],
        'Rikitan_Shamrock Ihro (Flats)': ['colors','jewels','other'],
    'United Kingdom_Boba Fett Halifax': ['flats'],
    'United Kingdom_Boba Fett Halifax (Flats)': ['colors'],
    'United Kingdom_Leeds Beckett University Places': ['flats'],
    'United Kingdom_Leeds Beckett University Places (Flats)': ['colors'],
    'United Kingdom_Leeds Love Munzee': ['flats'],
    'United Kingdom_Leeds Love Munzee (Flats)': ['colors'],
    'United Kingdom_Woodhouse Moor Owl': ['flats'],
    'United Kingdom_Woodhouse Moor Owl (Flats)': ['colors','gaming','jewels'],
    'USA_2nd Annual CuriosiTea Party x 2': ['flats'],
    'USA_Baby Groot!': ['flats'],
        'Weatherford_Baby Groot!': ['flats'],
        'denali0407_Baby Groot!': ['flats'],
    'USA_Bright Colored Horse': ['flats'],
        'FortWorth_Bright Colored Horse': ['flats'],
    'USA_Bright Colored Horse (Flats)': ['colors'],
        'FortWorth_Bright Colored Horse (Flats)': ['colors'],
    'USA_Columbia Flat Lou': ['colors'],
        'Columbia_Columbia Flat Lou': ['colors'],
    'USA_Columbia Flat Lou (Pink)': ['flats'],
        'Columbia_Columbia Flat Lou (Pink)': ['flats'],
    'USA_CR Jones Park Birthday 7': ['flats'],
        'CedarRapids_CR Jones Park Birthday 7': ['flats'],
        'rodrico101_CR Jones Park Birthday 7': ['flats'],
    'USA_CR Jones Park Birthday 7 (Flats)': ['colors'],
        'CedarRapids_CR Jones Park Birthday 7 (Flats)': ['colors'],
        'rodrico101_CR Jones Park Birthday 7 (Flats)': ['colors'],
    'USA_Crossbow Shield': ['flats'],
    'USA_Crossbow Shield (Flats)': ['colors','weapons'],
    'USA_Ellis Creek Owl': ['flats'],
        'Weatherford_Ellis Creek Owl': ['flats'],
        'denali0407_Ellis Creek Owl': ['flats'],
    'USA_Ellis Creek Owl (Flats)': ['colors','jewels',],
        'Weatherford_Ellis Creek Owl (Flats)': ['colors','jewels','weapons'],
        'denali0407_Ellis Creek Owl (Flats)': ['colors','jewels','weapons'],
    'USA_Evolution of Beaumont Texas': ['flats'],
    'USA_Evolution of Beaumont Texas (Flats)': ['evolutions'],
    'USA_Flat Lou in St Lou': ['colors'],
    'USA_Flat Lou in St Lou (Pink)': ['flats'],
    'USA_Flats gone fishin`': ['colors'],
    'USA_Flats in The Bone Pile': ['weapons','colors','evolutions'],
    'USA_Fort Worth Longhorn': ['flats'],
        'FortWorth_Fort Worth Longhorn': ['flats'],
        'denali0407_Fort Worth Longhorn': ['flats'],
    'USA_Fort Worth, TX Cowboy Boots': ['flats'],
        'FortWorth_Fort Worth, TX Cowboy Boots': ['flats'],
    'USA_G Bypass Mixed': ['flats'],
        'Georgetown_G Bypass Mixed': ['flats'],
    'USA_G Candy Cane': ['flats'],
    'USA_G Candy Cane (Flats)': ['colors'],
    'USA_G Cardinal': ['flats'],
        'Georgetown_G Cardinal': ['flats'],
    'USA_G Cardinal (Flats)': ['colors'],
        'Georgetown_G Cardinal (Flats)': ['colors'],
    'USA_G Harmony': ['flats'],
        'Georgetown_G Harmony': ['flats'],
    'USA_G Harmony (Flats)': ['colors','gaming','mysteries','jewels'],
        'Georgetown_G Harmony (Flats)': ['colors','gaming','mysteries','jewels'],
    'USA_G Jewel Belt': ['flats'],
        'Georgetown_G Jewel Belt': ['flats'],
    'USA_G Pumpkin': ['flats'],
        'Georgetown_G Pumpkin': ['flats'],
    'USA_G Pumpkin (Flats)': ['colors'],
        'Georgetown_G Pumpkin (Flats)': ['colors'],
    'USA_G Shamrock': ['flats'],
        'Georgetown_G Shamrock': ['flats'],
    'USA_G Shamrock (Flats)': ['colors'],
        'Georgetown_G Shamrock (Flats)': ['colors'],
    'USA_G Toyota': ['flats'],
        'Georgetown_G Toyota': ['flats'],
    'USA_G Toyota (Flats)': ['colors'],
        'Georgetown_G Toyota (Flats)': ['colors'],
    'USA_Grand Rapids Flats and Weapons': ['flats'],
    'USA_Grand Rapids Flats and Weapons (Flats)': ['weapons'],
    'USA_Hazard Spur Campton': ['flats'],
    'USA_Hazard Spur Campton (Flats)': ['weapons','colors','evolutions','zodiacs','jewels','gaming','mysteries','resellers'],
    'USA_Jewels at BBGH': ['flats'],
    'USA_Jewels at BBGH (Flats)': ['jewels','gaming'],
    'USA_Koopa Shell': ['flats'],
    'USA_Lakeville`s Sea Turtle': ['flats'],
        'squirreledaway_Lakeville`s Sea Turtle': ['flats'],
    'USA_Lakeville`s Sea Turtle (Flats)': ['weapons','colors','evolutions','mysteries','jewels'],
        'squirreledaway_Lakeville`s Sea Turtle (Flats)': ['weapons','colors','evolutions','mysteries','jewels'],
    'USA_Mason M': ['flats'],
    'USA_Montgomery baseball': ['flats'],
    'USA_Montgomery baseball (Flats)': ['colors'],
    'USA_Noelridge Mystery': ['flats'],
        'CedarRapids_Noelridge Mystery': ['flats'],
        'rodrico101_Noelridge Mystery': ['flats'],
    'USA_Noelridge Mystery (Flats)': ['colors'],
      'CedarRapids_Noelridge Mystery (Flats)': ['colors'],
      'rodrico101_Noelridge Mystery (Flats)': ['colors'],
    'USA_Owensboro Riverboat': ['flats'],
        'Owensboro_Owensboro Riverboat': ['flats'],
    'USA_Owensboro Riverboat (Flats)': ['colors','mysteries'],
        'Owensboro_Owensboro Riverboat (Flats)': ['colors','mysteries'],
    'USA_Pumpkin Spice Owl': ['flats'],
        'Weatherford_Pumpkin Spice Owl': ['flats'],
        'denali0407_Pumpkin Spice Owl': ['flats'],
    'USA_Pumpkin Spice Owl (Flats)': ['weapons','colors','mysteries','jewels'],
        'Weatherford_Pumpkin Spice Owl (Flats)': ['weapons','colors','mysteries','jewels'],
        'denali0407_Pumpkin Spice Owl (Flats)': ['weapons','colors','mysteries','jewels'],
    'USA_Rob vs Matt': ['other'],
    'USA_Secondary Complex Everything': ['flats'],
    'USA_Secondary Complex Everything (Flats)': ['weapons','colors','evolutions','jewels'],
    'USA_StL Flat Rob': ['flats'],
        'SaintPeters_StL Flat Rob': ['flats'],
    'USA_StL Flat Rob (Flats)': ['colors'],
        'SaintPeters_StL Flat Rob (Flats)': ['colors'],
    'USA_Texas Geowoodstock ~ 2019': ['flats'],
    'USA_Texas Golden Ticket': ['flats'],
        'FortWorth_Texas Golden Ticket': ['flats'],
        'denali0407_Texas Golden Ticket': ['flats'],
    'USA_Texas Golden Ticket (Flats)': ['colors','jewels','mysteries'],
        'FortWorth_Texas Golden Ticket (Flats)': ['colors','jewels','mysteries'],
        'denali0407_Texas Golden Ticket (Flats)': ['colors','jewels','mysteries'],
    'USA_The Finale of The Bone Pile': ['flats'],
    'USA_Tlinget Salmon': ['flats'],
    'USA_Tucson Jewel - PCC West': ['flats'],
    'USA_Tucson Jewel - PCC West (Flats)': ['jewels','gaming'],
    'USA_Turtle Turtle': ['flats'],
    'USA_Turtle Turtle (Flats)': ['weapons','colors','evolutions','gaming','jewels'],
    'USA_Uncut Diamond': ['flats'],
        'Weatherford_Uncut Diamond': ['flats'],
        'denali0407_Uncut Diamond': ['flats'],
    'USA_Uncut Diamond (Flats)': ['colors'],
        'Weatherford_Uncut Diamond (Flats)': ['colors'],
        'denali0407_Uncut Diamond (Flats)': ['colors']
};
var gardenPush;

var PngData = [
//    'Hungary_MinerSymbol'
];
var changePng = null;

var gardensData = {
    'by garden': {
        'GOTM': {
            'Australia': {
                'Huntfield Heights Dog': ['HuntfieldHeightsDog', 'r1dxbpf50/16.2', '', '1903', 'Australia_HuntfieldHeightsDog'], // Adelaide
                'Laidley Bee Love': ['LaidleyBeeLove', 'r7h6ewegy/16.3', '', '2103', 'Australia_LaidleyBeeLove'], // BonnieB1
                'Pirate Pete`s Parrot': ['PiratePetesParrot', 'r1prduegj/16.3', '', '2206', 'Australia_PiratePetesParrot'], // Melbourne
                'Queensland Koala': ['QueenslandKoala', 'r7hug0cqd/16.4', '', '2012', 'Australia_QueenslandKoala'], // BonnieB1, Brisbane
                'Somerville Specials': ['SomervilleSpecials', 'r1pnx1x9p/16.4', '', '2009', 'Australia_SomervilleSpecials'], // Melbourne
                'We Love 10pmMeerkat': ['WeLove10pmMeerkat', 'r1r0m6jks/15.5', '', '2307', 'Australia_WeLove10pmMeerkat'], // Melbourne
            },
            'Canada': {
                'Adventure Garden For Bluestreek': ['AdventureGardenForBluestreek', 'c28xrw2g2/15.4', '', '2301', 'Canada_AdventureGardenForBluestreek'],
                'Christmas in Ottawa': ['ChristmasInOttawa', 'f2469dret/16.0', '', '2112', 'Canada_ChristmasInOttawa'], // Ottawa, Jeffeth, topic (seasons, holidays)
                'Claire`s Candy Canes': ['ClairesCandyCanes', 'f247ndq30/16.0', '', '2011', 'Canada_ClairesCandyCanes'], // Clarence-Rockland, Jeffeth
                'Halloween in Ottawa': ['HalloweenInOttawa', 'f246dqzzt/16.0', '', '2210', 'Canada_HalloweenInOttawa'], // Ottawa, Jeffeth, topic (seasons, holidays)
                'Munzball Machine': ['MunzballMachine', 'f247pwy98/16.2', '', '2107', 'Canada_MunzballMachine'], // Clarence-Rockland, Jeffeth
                'Munzee Love': ['MunzeeLove', 'f246uwk1x/16.1', '', '2202', 'Canada_MunzeeLove'], // Ottawa, Jeffeth
                'Save the Monarchs': ['SaveTheMonarchs', 'f246d5kdy/16.0', '', '2305', 'Canada_SaveTheMonarchs'], // Ottawa, Jeffeth
                'Secret Valentine': ['SecretValentine', 'f247pk9h9/16.2', '', '2102', 'Canada_SecretValentine'] // Clarence-Rockland, Jeffeth
            },
            'Cyprus': {
                'Aphrodite`s Cat': ['AphroditesCat', 'swpmm1cyu/16.2', '', '2204', 'Cyprus_AphroditesCat'] // purplecourgette
            },
            'Denmark': {
                'Grenaa City`s Coat of Arms': ['GrenaaCitysCoatOfArms', 'u4p8zgw2n/14.5', '', '1906', 'Denmark_GrenaaCitysCoatOfArms'], // Grenaa, RUJA
                'Nessie in Grenaa': ['NessieInGrenaa', 'u4pbbjhsw/15.8', '', '2203', 'Denmark_NessieInGrenaa'] // Grenaa, MetteS
            },
            'Finland': {
                '7th Birthday': ['7thBirthday', 'ud9y9snw2/14.9', '', '1907', 'Finland_7thBirthday'], // Helsinki, Jesnou, Neesu, Sivontim, mandello
                'Helsinki Colour': ['HelsinkiColour', 'ud9y2q5jc/15.1', '', '2001', 'Finland_HelsinkiColour'], // Helsinki, Jesnou, Neesu, Sivontim, mandello
                'Kameleontti': ['Kameleontti', 'u6zb1ebg3/15.0', '', '2104', 'Finland_Kameleontti'], // RePe
                'Palmuranta': ['Palmuranta', 'udc8udkum/15.7', '', '2203', 'Finland_Palmuranta'] // Hyvinkää, tartu61
            },
            'Germany': {
                'Abstatt Tomcat': ['AbstattTomcat', 'u0wx5evsq/14.7', '', '1910', 'Germany_AbstattTomcat'], //ChandaBelle
                'Berlin Bat - Berliner Fledermaus': ['BerlinBat-BerlinerFledermaus', 'u336vvjuz/15.6', '', '2010', 'Germany_BerlinBat-BerlinerFledermaus'], // Berlin, 123xilef
                'Berlin - Capital of spies': ['Berlin-CapitalOfSpies', 'u33de1r9d/15.8', '', '2009', 'Germany_Berlin-CapitalOfSpies'], // Berlin, 123xilef
                'Charles Darwin': ['CharlesDarwin', 'u1q0145hh/15.3', '', '2108', 'Germany_CharlesDarwin'], // Bielefeld, paupau
                'Diezer Grafenschloss': ['DiezerGrafenschloss', 'u0vww3nk4/15.4', '', '1909', 'Germany_DiezerGrafenschloss'],
                'Fasanerie Darmstadt': ['FasanerieDarmstadt', 'u0y5vd7zs/15.2', '', '2105', 'Germany_FasanerieDarmstadt'], // stineB
                'Flat-O-Fant': ['Flat-O-Fant', 'u0wn8q7u2/15.5', '', '2008', 'Germany_Flat-O-Fant'], // Karlsruhe, volki2000
                'Happy Birthday Karte': ['HappyBirthdayKarte', 'u0wtdmw55/14.4', '', '1907', 'Germany_HappyBirthdayKarte'],
                'John - the Fab 4/1': ['JohnTheFab41', 'u0w7vzm9n/15.4', '', '2211', 'Germany_JohnTheFab41'], // topic (The FAB), Tübingen, geckofreund
                'Lou [and Rob]': ['Lou[andRob]', 'u1npe380n/15.2', '', '2103', 'Germany_Lou[andRob]'], // Bielefeld, paupau
                'Munzee Logo': ['MunzeeLogo', 'u1hbrymvt/15.4', '', '1907', 'Germany_MunzeeLogo'], // Bonn
                'Papagei Crumstadt': ['PapageiCrumstadt', 'u0y53se24/15.7', '', '2206', 'Germany_PapageiCrumstadt'], // stineB
                'Pinguin Sennelager': ['PinguinSennelager', 'u1nnw66pp/15.2', '', '1912', 'Germany_PinguinSennelager'],
                'QR Code': ['QRCode', 'u1j02rpfx/15.9', '', '1903', 'Germany_QRCode'], // Bonn
                'Skylark/Feldlerche': ['SkylarkFeldlerche', 'u33d8ch15/14.8', '', '1911', 'Germany_SkylarkFeldlerche'], // Berlin
                'The Garden Hedge': ['TheGardenHedge', 'u1j55qjjc/15.5', '', '2303', 'Germany_TheGardenHedge']
            },
            'Hungary': {
                'Flower at Fort Monostor': ['FlowerAtFortMonostor', 'u2kzeueyv/16.2', '', '2005', 'Hungary_FlowerAtFortMonostor'], // Komárom, Laczy76
                'Goldfish': ['Goldfish', 'u2nr55p9z/16.1', '', '2006', 'Hungary_Goldfish'], // Szeged
                'Pegasus': ['Pegasus', 'u2nr4fkzr/15.7', '', '1908', 'Hungary_Pegasus'] // Szeged, zsomborpeto
            },
            'Japan': {
                'Torii Gate': ['ToriiGate', 'wypvq9k3u/16.2', '', '2109', 'Japan_ToriiGate']
            },
            'Lithuania': {
                'Scared Kitty': ['ScaredKitty', 'u99zqup56/15.8', '', '2003', 'Lithuania_ScaredKitty'] // Vilnius
            },
            'Netherlands': {
                'Boogie Woogie': ['BoogieWoogie', 'u171jxtkq/16.0', '', '1904', 'Netherlands_BoogieWoogie'], // Noordwijk, destrandman
                'Flamingo @ Den Treek Leusden': ['FlamingoDenTreekLeusden', 'u17b6xbuy/14.8', '', '2201', 'Netherlands_FlamingoDenTreekLeusden'],
                'Honey Bee': ['HoneyBee', 'u15p7dytj/15.4', '', '2305', 'Netherlands_HoneyBee'], // Schiedam, Belugue
                'Mystery Bike Field': ['MysteryBikeField', 'u15pksmmy/16.0', '', '1905', 'Netherlands_MysteryBikeField']
            },
            'Poland': {
                'Zamek Piastów': ['ZamekPiastow', 'u357rbhkt/16.2', '', '2209', 'Poland_ZamekPiastow'] // Legnica
            },
            'Slovakia': {
                'Black Moth Squad': ['BlackMothSquad', 'u2s1vx5xv/16.0', '', '2110', 'Slovakia_BlackMothSquad'], // Bratislava, Rikitan
                'Folk CrossBow': ['FolkCrossBow', 'u2s4jcj5k/16.1', '', '2102', 'Slovakia_FolkCrossBow'], // Bratislava, Neloras
                'Hungry Bat Terry': ['HungryBatTerry', 'u2s1yt9t7/16.0', '', '2210', 'Slovakia_HungryBatTerry'], // Bratislava, Neloras, Rikitan
                'Icemen in love': ['IcemenInLove', 'u2s1yzv55/16.2', '', '2212', 'Slovakia_IcemenInLove'], // Neloras, Bratislava
                'Jewels Note': ['JewelsNote', 'u2s1zefpc/16.0', '', '2010', 'Slovakia_JewelsNote'], // Bratislava, Neloras
                'Ladybug': ['Ladybug', 'u2kzsw0xu/16.0', '', '2007', 'Slovakia_Ladybug'], // Laczy76
                'Night Vision Agent': ['NightVisionAgent', 'u2s1vv279/16.2', '', '2101', 'Slovakia_NightVisionAgent'], // Bratislava, Rikitan
                'Trpaslík :: Gnomie Vrútky': ['TrpaslikGnomieVrutky', 'u2trqesyc/15.5', '', '2107', 'Slovakia_TrpaslikGnomieVrutky'] // Vrútky, kepke3, Mon4ikaCriss
            },
            'Spain': {
                'Wine O`Clock': ['WineOClock', 'ezmmh43by/16.0', '', '2302', 'Spain_WineOClock']
            },
            'Switzerland': {
                'Owlgarden Zürich': ['OwlgardenZurich', 'u0qj6gm2h/15.9', '', '1911', 'Switzerland_OwlgardenZurich']
            },
            'United Kingdom': {
                'BeachUmbrella': ['BeachUmbrella', 'gcn8sbhwp/15.5', '', '2205', 'UnitedKingdom_BeachUmbrella'], // Bournemouth, BonnieB1
                'Downham Cheshire Cat': ['DownhamCheshireCat', 'u12723r3k/16.0', '', '2208', 'UnitedKingdom_DownhamCheshireCat'],
                'EyUpMeDuck': ['EyUpMeDuck', 'gcrj5dn8x/15.7', '', '2109', 'UnitedKingdom_EyUpMeDuck'], // BenandJules
                'HeartBeatz': ['HeartBeatz', 'u122rjm0e/15.6', '', '2302', 'UnitedKingdom_HeartBeatz'], // Waves117
                'Horatio the Hermit Crab': ['HoratioTheHermitCrab', 'u12vje1zv/15.5', '', '2205', 'UnitedKingdom_HoratioTheHermitCrab'], // Cromer, Waves117
                'Masquerade Hare': ['MasqueradeHare', 'gcr8h8ghq/15.8', '', '2105', 'UnitedKingdom_MasqueradeHare'], // purplecourgette
                'Sandcastle in Sheringham': ['SandcastleInSheringham', 'u12v5qq8k/16.2', '', '2106', 'UnitedKingdom_SandcastleInSheringham'], // Sheringham, Waves117
                'Shire Horse Sanctuary': ['ShireHorseSanctuary', 'u12vhk7nm/15.3', '', '2302', 'UnitedKingdom_ShireHorseSanctuary'], // Waves117
                'The Queen’s Crown': ['TheQueensCrown', 'gcjuhy4jd/16.0', '', '2209', 'UnitedKingdom_TheQueensCrown'],
                'The Yellow Submarine': ['TheYellowSubmarine', 'u12v57yrs/16.0', '', '2211', 'UnitedKingdom_TheYellowSubmarine'], // Sheringham, Waves117
                'Tiffy the Newmarket Tabby Cat': ['TiffyTheNewmarketTabbyCat', 'u1231n464/15.9', '', '2306', 'UnitedKingdom_TiffyTheNewmarketTabbyCat'],
                'Xmas Knole Deer': ['XmasKnoleDeer', 'u105sdvy2/15.6', '', '2012', 'UnitedKingdom_XmasKnoleDeer'] // Maattmoo
            },
            'USA': {
                'Anaheim Sapphire': ['AnaheimSapphire', '9qh0s9gx9/16.0', '', '2002', 'USA_AnaheimSapphire'],
                'Bearmomscouter`s Xmas Polar Bear': ['BearmomscoutersXmasPolarBear', 'dr4uw91wq/16.3', '', '1912', 'USA_BearmomscoutersXmasPolarBear'],
                'Brandon Peacock': ['BrandonPeacock', 'dhvrnhzp5/15.2', '', '2304', 'USA_BrandonPeacock'],
                'Burkes Park Orange': ['BurkesParkOrange', 'djj931mef/16.0', '', '2106', 'USA_BurkesParkOrange'],
                'Butterfly': ['Butterfly', 'dhv9u994w/15.9', '', '1904', 'USA_Butterfly'],
                'Cape Canaveral Hummingbird': ['CapeCanaveralHummingbird', 'djn9mzsny/16.3', '','2108', 'USA_CapeCanaveralHummingbird'],
                'Caretta Sea Turtle': ['CarettaSeaTurtle', 'djf8m22fr/15.4', '', '2301', 'USA_CarettaSeaTurtle'], // Montgomery, tlmeadowlark
                'Cedar Rapids Pumpkin': ['CedarRapidsPumpkin', '9zqyb9s0m/15.9', '', '1910', 'USA_CedarRapidsPumpkin'], // Cedar Rapids, rodrico101
                //            'Charlotte Electric Lightbulb': ['Charlotte Electric Lightbulb', 'dnnx6p04d/16.3', ''], // by MrsHB31 in Charlotte, NC
                // 202101;
                'Corgi': ['Corgi', 'dhvxycns2/16.0', '', '2207', 'USA_Corgi'], // Lakeland, CoalCracker7
                'Dog days of summer!': ['DogDaysOfSummer', '9zvx4cm5j/16.1', '', '2306', 'USA_DogDaysOfSummer'], // Bloomington, geomatrix
                'Egyptian Cat': ['EgyptianCat', '9vf6qtn7g/15.8', '', '2204', 'USA_EgyptianCat'], // Weatherford, BonnieB1, denali0407
                'Florida Flamingo': ['FloridaFlamingo', 'dhvrtvsmu/16.1', '', '2201', 'USA_FloridaFlamingo'],
                'Fort Worth Longhorn': ['FortWorthLonghorn', '9vf9znt4b/15.7', '', '1906', 'USA_FortWorthLonghorn'], // [push], FortWorth, denali0407
                'G Cardinal': ['GCardinal', 'dngcs0epy/16.0', '', '1905', 'USA_GCardinal'], // [push], Georgetown
                'Giraffe In Gadsden': ['GiraffeInGadsden', 'dn4c7jkn0/16.1', '', '2008', 'USA_GiraffeInGadsden'],
                'I Heart Munzee': ['IHeartMunzee', 'dr8h81hwr/15.7', '', '1907', 'USA_IHeartMunzee'],
                'MOA Christmas Card': ['MOAChristmasCard', '9zvxjfwnt/16.1', '', '2212', 'USA_MOAChristmasCard'], // Bloomington, geomatrix
                'MOA Unicorn': ['MOAUnicorn', '9zvxn49zw/16.1', '', '2005', 'USA_MOAUnicorn'], // Bloomington, geomatrix
                'North Carolina Jester Hat': ['NorthCarolinaJesterHat', 'dnrmpzbjf/16.1', '', '2104', 'USA_NorthCarolinaJesterHat'], // Burlington
                'O` Christmas Tree': ['OChristmasTree', '9zqz5dsj1/15.7', '', '2112', 'USA_OChristmasTree'], // Marion, markayla
                //            'Pirate`s Treasure': ['Pirate`s Treasure', 'dr6hj2825/16.1', ''] // by gargoyle18 in Clarks Summit, PA
                // 202111;
                'Pirate`s Treasure': ['PiratesTreasure', 'dr6hj22x9/16.2', '', '2111', 'USA_PiratesTreasure'],
                'Pirates Treasure Map': ['PiratesTreasureMap', '9yzssw2zx/16.2', '', '2111', 'USA_PiratesTreasureMap'],
                'Pot o`Zees': ['PotOZees', 'cbj8qfh3r/15.9', '', '2303', 'USA_PotOZees'], // geomatrix
                'Purple Heart Park': ['PurpleHeartPark', '9t9nxh31z/16.3', '', '2202', 'USA_PurpleHeartPark'],
                'Richard Petty': ['RichardPetty', 'dnrk0jetq/16.0', '', '1902', 'USA_RichardPetty'],
                'Rob Hearts Lou': ['RobHeartsLou', 'dp5u1zx1e/16.5', '', '2107', 'USA_RobHeartsLou'], // Greenville
                'Scooter': ['Scooter', 'dprwp4pjw/16.0', '', '2302', 'USA_Scooter'],
                'Seashell': ['Seashell', 'dhvqqjdr7/16.4', '', '2006', 'USA_Seashell'],
                'Smile': ['Smile', 'dr09w6zzu/16.5', '', '2001', 'USA_Smile'],
                'Sprinkle Cupcake': ['SprinkleCupcake', 'dhvx46v6v/15.9', '', '2208', 'USA_SprinkleCupcake'], // PlantCity, CoalCracker7
                'Sunset Cowboy': ['SunsetCowboy', '9vff269xn/16.1', '', '1901', 'USA_SunsetCowboy'], // FortWorth, Brandikorte
                'Teddy Bear': ['TeddyBear', 'dr14d6kgc/16.0', '', '2011', 'USA_TeddyBear'], // CoalCracker7
                'The Greer Train': ['TheGreerTrain', 'dnjw9rbk7/15.4', '', '1902', 'USA_TheGreerTrain'],
                'The Saginaw Heart': ['TheSaginawHeart', '9vfg0dzbq/16.4', '', '2002', 'USA_TheSaginawHeart'], // Brandikorte
                'Tlinget Salmon': ['TlingetSalmon', '9ytev0ux1/16.0', '', '2304', 'USA_TlingetSalmon'], // [push]
                'Tokay Gecko': ['TokayGecko', '9tbe0rw98/15.9', '', '2307', 'USA_TokayGecko'],
                'Witchy Pumpkin': ['WitchyPumpkin', 'dnrj6jgdn/16.2', '', '2110', 'USA_WitchyPumpkin'],
                'XI Birthday Mad Hatter': ['XIBirthdayMadHatter', '9zvxmdpr9/15.8', '', '2207', 'USA_XIBirthdayMadHatter'] // geomatrix
            }
        },
        'Completed': {
            'Australia': {
                '9th Birthday in Queensland': ['9thBirthdayInQueensland', 'r7hu2gjst/16.4', '', '', ''], // Brisbane
                'AE2 Submarine': ['AE2Submarine', 'r3grt6gby/16.2', '', '', ''], // Sydney, BonnieB1
                'AussiePossum': ['AussiePossum', 'r652njr19/16.2', '', '', ''], // Sydney, BonnieB1
                'Australian Dingo': ['AustralianDingo', 'r1r0kjse2/16.0', '', '', ''], // Melbourne
                'Bee Flats': ['BeeFlats', 'r7h6g02c3/16.4', '', '', ''], // Laidley Heights, BonnieB1
                'Bee Flowers': ['BeeFlowers', 'r7h6erkpu/16.0', '', '', ''], // Laidley Heights, BonnieB1
                'Bee Lucky': ['BeeLucky', 'r7h6eqkm5/16.2', '', '', ''], // BonnieB1
                'Bee Queen': ['BeeQueen', 'r7h6g0w0p/16.3', '', '', ''], // Laidley Heights, BonnieB1
                'Bee Santa': ['BeeSanta', 'r7h6sj88v/16.2', '', '', ''], // Laidley, BonnieB1
                'BeeJewelled!': ['BeeJewelled', 'r7h6gk67j/16.3', '', '', ''], // Laidley Heights, BonnieB1
                'BeeTree': ['BeeTree', 'r7h6dzurf/16.3', '', '', ''], // Laidley Heights, BonnieB1
                'Bendigo Icy Pole': ['BendigoIcyPole', 'r1qwfff97/16.2', '', '', ''],
                'Brisbane Heart Pop Up': ['BrisbaneHeartPopUp', 'r7hg9yzzd/16.6', '', '', ''], // Brisbane
                'BuzzzBee': ['BuzzzBee', 'r7h6exz90/15.4', '', '', ''], // Laidley, BonnieB1
                'CarsBoy`s first car': ['CarsBoysFirstCar', 'r6ugfd6yw/16.2', '', '', ''], // BonnieB1
                'Casino Lucky Star': ['CasinoLuckyStar', 'r6ugfw28z/16.3', '', '', ''], // [push]
                'Collingwood FC Magpie': ['CollingwoodFCMagpie', 'r1r0gqxx4/15.4', '', '', ''], // Melbourne
                'Cottesloe Beach': ['CottesloeBeach', 'qd63czx0b/16.0', '', '', ''],
                'Croc of Munzees': ['CrocOfMunzees', 'rhzxv1907/16.2', '', '', ''], // BonnieB1
                'DroughtAngel': ['DroughtAngel', 'r7j0e90x9/16.0', '', '', ''],
                'Egyptian Mask': ['EgyptianMask', 'r7hu4xdc9/15.8', '', '', ''], // Brisbane, BonnieB1
                'Emu in Canberra': ['EmuInCanberra', 'r3dp4qcmk/16.0', '', '', ''], // BonnieB1
                'Eureka Flag': ['EurekaFlag', 'r1q63ke7v/16.0', '', '', ''],
                'Fairy Wren': ['FairyWren', 'r7hucu2rc/16.5', '', '', ''], // Brisbane, BonnieB1
                'FlatsFlyAKite': ['FlatsFlyAKite', 'r7h6ts8z3/16.2', '', '', ''], // BonnieB1
                'FlatterBee': ['FlatterBee', 'r7h6g9pnh/15.7', '', '', ''], // Laidley Heights, BonnieB1
                'Frank Memorial 2017': ['FrankMemorial2017', 'rk4pdwyzn/16.6', '', '', ''], // topic (memorial)
                'Gatton Arrows - Arrow1': ['GattonArrowsArrow1', 'r7h71n6fd/16.0', '', '', ''], // Gatton, BonnieB1, ChandaBelle
                'GoldCoast Ghost': ['GoldCoastGhost', 'r7j12sz6h/15.9', '', '', ''],
                'HappyTenMunzee!': ['HappyTenMunzee', 'r7hu2zgws/16.3', '', '', ''], // BonnieB1, Brisbane
                'Haunted House!': ['HauntedHouse', 'r7j10yfh2/16.2', '', '', ''], // BonnieB1
                'Here bee Zodiacs!': ['HereBeeZodiacs', 'r7h6gff7q/16.2', '', '', ''], // Laidley, BonnieB1
                'Honeycomb': ['Honeycomb', 'r7h6gc4z9/16.2', '', '', ''], // Laidley, BonnieB1
                'HoneyDipper': ['HoneyDipper', 'r7h6gbq0x/15.9', '', '', ''], // Laidley, BonnieB1
                'Jubilee Butterfly': ['JubileeButterfly', 'r1r2bfgd3/16.2', '', '', ''], // Melbourne
                'Kidney Awareness Ribbon': ['KidneyAwarenessRibbon', 'r1pr1vuwq/15.9', '', '', ''], // Melbourne
                'Laidley BeeHive': ['LaidleyBeeHive', 'r7h6ewqcc/16.5', '', '', ''], // Laidley, BonnieB1
                'Laidley Bees': ['LaidleyBees', 'r7h6eys0v/16.2', '', '', ''], // Laidley, BonnieB1
                'LismorePie': ['LismorePie', 'r6uup96ut/16.3', '', '', ''], // BonnieB1
                'Mario': ['Mario', 'qd63xvhmk/16.2', '', '', ''],
                'Mawson Lakes DHS tape': ['MawsonLakesDHSTape', 'r1f9fqktr/16.3', '', '', ''], // Adelaide, BonnieB1
                'MayPole': ['MayPole', 'r7hgckc49/16.3', '', '', ''], // BonnieB1, Brisbane
                'MiniPortal1': ['MiniPortal1', 'r6ugfkzsp/16.5', '', '', ''],
                'Mount Gambier Star': ['MountGambierStar', 'r1k0gmp52/16.5', '', '', ''],
                'Munzee`s 12 Birthday CupCakes': ['Munzees12BirthdayCupCakes', 'r1r1pu28q/16.3', '', '', ''], // Melbourne
                'Narre Warren Crossbow': ['NarreWarrenCrossbow', 'r1prd1grh/15.7', '', '', ''], // Melbourne
                'Over the Rainbow': ['OverTheRainbow', 'r1pr4h5du/16.0', '', '', ''], // Melbourne
                'Pyramid O` Badges': ['PyramidOBadges', 'r7hu4rrrn/16.5', '', '', ''], // BonnieB1, Brisbane
                'QLD-Dingo': ['QLD-Dingo', 'r7hu60rxr/16.4', '', '', ''], // BonnieB1, Brisbane
                'QldJacaranda': ['QldJacaranda', 'r7hucvdgx/16.1', '', '', ''], // Brisbane, BonnieB1
                'Redbull Formula 1': ['RedbullFormula1', 'r1r0duw94/15.4', '', '', ''], // Melbourne
                'Roo in Canberra': ['RooInCanberra', 'r3dp4qvkn/16.0', '', '', ''],
                'RUMble Bee!': ['RUMbleBee', 'r7h6sugpe/16.2', '', '', ''], // BonnieB1
                'RUMportal': ['RUMportal', 'r1pm0nwy0/16.2', '', '', ''], // BonnieB1
                'SA Party Hat': ['SAPartyHat', 'r1fdh7cdx/16.0', '', '', ''], // Adelaide, BonnieB1
                'Shamrock, Hackham': ['ShamrockHackham', 'r1f801pw9/16.0', '', '', ''], // Adelaide
                'Shepparton Rainbow Shoelace': ['SheppartonRainbowShoelace', 'r1x3h2266/14.6', '', '', ''],
                'Shepparton/Tatura Vanilla Slice': ['SheppartonTaturaVanillaSlice', 'r1x28xvc9/15.9', '', '', ''],
                'Smile Mackay': ['SmileMackay', 'rk4pdey3m/16.5', '', '', ''],
                'Snow bee Melting': ['SnowBeeMelting', 'r7h6g4j12/16.2', '', '', ''], // Laidley Heights, BonnieB1
                'SoonBeeSpring!': ['SoonBeeSpring', 'r7h6g4uvh/16.5', '', '', ''], // Laidley Heights, BonnieB1
                'South Beach': ['SouthBeach', 'qd63d0e94/16.3', '', '', ''],
                'Southern Cross Kite': ['SouthernCrossKite', 'r7h6tsg3e/16.2', '', '', ''], // BonnieB1
                'Stroopwafel invasion in Browns Plains': ['StroopwafelInvasionInBrownsPlains', 'r7hfdck60/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Morayfield': ['StroopwafelInvasionInMorayfield', 'r7hv8p6d2/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Onkaparinga Hills': ['StroopwafelInvasionInOnkaparingaHills', 'r1f80ddey/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Perth': ['StroopwafelInvasionInPerth', 'qd66gpc0e/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Shepparton': ['StroopwafelInvasionInShepparton', 'r1x2uxm5r/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Superstar`s Puppy': ['SuperstarsPuppy', 'r1prepkf1/15.9', '', '', ''], // Melbourne
                'TicTacMunzee!': ['TicTacMunzee', 'r7hg9jecp/16.7', '', '', ''], // BonnieB1
                'Time2Munzee - Lilydale': ['Time2MunzeeLilydale', 'r1r35ck3u/16.3', '', '', ''], // Melbourne, BonnieB1
                'Trojan Kitty': ['TrojanKitty', 'rk4pdkx91/16.5', '', '', ''], // BonnieB1
                'Tulips!': ['Tulips', 'r1pre7s7r/16.3', '', '', ''], // Melbourne, BonnieB1
                'Unicorn in The Park': ['UnicornInThePark', 'r7hugvyj7/16.4', '', '', ''], // BonnieB1
                'We Bee Pawns': ['WeBeePawns', 'r7h6fcj3s/16.0', '', '', ''], // Laidley Heights, BonnieB1
                'Where Is Warner?': ['WhereIsWarner', 'r7hu8s968/16.3', '', '', ''], // Brisbane
                'Zaidee`s Other Rainbow Shoelace': ['ZaideesOtherRainbowShoelace', 'r1x2vhk0g/15.1', '', '', '']
            },
            'Belgium': {
                'Stroopwafel invasion in Vosselaar': ['StroopwafelInvasionInVosselaar', 'u157znxun/16.3', '', '', ''], // topic (Stroopwafel invasion)
            },
            'Canada': {
                'Adventures in Rockland': ['AdventuresInRockland', 'f247p1fwh/16.1', '', '', ''], // Clarence-Rockland, Jeffeth
                'Banana Bread': ['BananaBread', 'f2469yxfs/16.1', '', '', ''], // Jeffeth, Ottawa
                'Bee Strong Jeffeth': ['BeeStrongJeffeth', 'f244q96q7/16.1', '', '', ''], // Ottawa, BonnieB1
                'Bread in Rockland': ['BreadInRockland', 'f247pgbcs/16.1', '', '', ''], // Clarence-Rockland, Jeffeth
                'Brooklin`s Gumball Machine': ['BrooklinsGumballMachine', 'dpzf53dbq/16.2', '', '', ''],
                'Canada Celebrates 150+ Years!': ['CanadaCelebrates150Years', 'c2b2q9w9t/16.0', '', '', ''], // Vancouver
                'Claire`s Cake': ['ClairesCake', 'f247nuu26/16.1', '', '', ''], // Clarence-Rockland, Jeffeth
                'Elephriends': ['Elephriends', 'f246dr30m/16.1', '', '', ''], // Jeffeth, Ottawa
                'Event Pin': ['EventPin', 'dpwycsj12/16.0', '', '', ''],
                'Fluttering by Orleans': ['FlutteringByOrleans', 'f24699gjw/16.0', '', '', ''], // Ottawa
                'Gatineau Scarlet Tulip': ['GatineauScarletTulip', 'f244tscr5/16.3', '', '', ''],
                'Hospital Love': ['HospitalLove', 'f246f0k0b/16.3', '', '', ''], // Jeffeth, Ottava
                'Jeff`s Farm': ['JeffsFarm', 'f246dz5s1/16.1', '', '', ''], // Jeffeth, Ottawa
                'Jewel Cube': ['JewelCube', 'dpzctj6mb/16.2', '', '', ''],
                'Jimmy`s Boat': ['JimmysBoat', 'f247pv3tg/16.0', '', '', ''], // Clarence-Rockland, Jeffeth
                'Jimmy`s Dog': ['JimmysDog', 'f241grtv1/16.0', '', '', ''], // Ottawa, Jeffeth
                'Jimmy`s Rocket': ['JimmysRocket', 'f247n7w4p/16.1', '', '', ''], // Clarence-Rockland, Jeffeth
                'Jimmy`s Tractor': ['JimmysTractor', 'f246vxw9k/16.1', '', '', ''], // Clarence-Rockland, Jeffeth
                'Jumping January Jamboree': ['JumpingJanuaryJamboree', 'c2b2pjdsr/16.1', '', '', ''], // Vancouver
                'Lizzy`s Elephant': ['LizzysElephant', 'f247n6m7r/16.0', '', '', ''], // Clarence-Rockland, Jeffeth
                'Lizzy`s Goldfish': ['LizzysGoldfish', 'f247n3hv1/16.0', '', '', ''], // Clarence-Rockland, Jeffeth
                'Lizzy`s Kitty': ['LizzysKitty', 'f247pj9t1/16.0', '', '', ''], // Clarence-Rockland, Jeffeth
                'Lizzy`s Unicorn': ['LizzysUnicorn', 'f246dxcww/16.1', '', '', ''], // Jeffeth, Ottawa
                'Mad March Pi': ['MadMarchPi', 'c2b80njfe/16.0', '', '', ''], // Vancouver
                'Maillardville Christmas': ['MaillardvilleChristmas', 'c2b8h5eh7/15.9', '', '', ''],
                'Marching Flats': ['MarchingFlats', 'f247p7yfn/15.3', '', '', ''], // Clarence-Rockland, Jeffeth
                'Munzee Drum Set': ['MunzeeDrumSet', 'f246d67y3/16.0', '', '', ''], // Ottawa, Jeffeth
                'Munzee Guitar': ['MunzeeGuitar', 'f246d1eun/16.0', '', '', ''], // Ottawa, Jeffeth
                'Munzee Snowglobe': ['MunzeeSnowglobe', 'f246gv5nv/16.0', '', '', ''], // Ottawa, Jeffeth
                'Munzee Trumpet': ['MunzeeTrumpet', 'f246e5djy/16.0', '', '', ''], // Ottawa, Jeffeth
                'Munzee Violin': ['MunzeeViolin', 'f246dgvh4/16.0', '', '', ''], // Ottawa, Jeffeth
                'Mystery Boat': ['MysteryBoat', 'f246dubv1/16.0', '', '', ''], // Ottawa, Jeffeth
                'Mystery Keyboard': ['MysteryKeyboard', 'f246ddyqk/16.0', '', '', ''], // Ottawa, Jeffeth
                'Ottawa Cancer Ribbon': ['OttawaCancerRibbon', 'f2469w9ut/16.1', '', '', ''], // Jeffeth, Ottawa
                'Ottawa Cross': ['OttawaCross', 'f246dvryt/16.1', '', '', ''], // Ottawa, Jeffeth
                'Ottawa Fireworks': ['OttawaFireworks', 'f246f3yj9/16.0', '', '', ''], // Jeffeth, Ottava
                'Ottawa Goldfish': ['OttawaGoldfish', 'f2469ybkn/16.1', '', '', ''], // Jeffeth, Ottawa
                'Ottawa Leprechaun': ['OttawaLeprechaun', 'f246fgx9e/16.0', '', '', ''], // Ottawa, Jeffeth
                'Ottawa New Years': ['OttawaNewYears', 'f24697y7y/16.0', '', '', ''], // Jeffeth, Ottava
                'Ottawa Tornado': ['OttawaTornado', 'f246gefs4/15.7', '', '', ''], // Ottawa, Jeffeth
                'Rainbow Star': ['RainbowStar', 'f246un1w9/16.3', '', '', ''], // Ottawa, Jeffeth
                'Richmond Hill Moosemate': ['RichmondHillMoosemate', 'dpz92v8es/16.0', '', '', ''],
                'Rockland Easter Eggs': ['RocklandEasterEggs', 'f247nt1es/16.0', '', '', ''], // Clarence-Rockland, Jeffeth
                'Rockland Heart': ['RocklandHeart', 'f247p5p08/16.1', '', '', ''], // Clarence-Rockland
                'Rockland Tree': ['RocklandTree', 'f247nevxk/16.0', '', '', ''], // Clarence-Rockland, Jeffeth
                'Rubik`s Cube': ['RubiksCube', 'dpzf4gjx4/16.1', '', '', ''],
                'Rumball Machine': ['RumballMachine', 'f246ffb0f/16.3', '', '', ''], // Jeffeth, Ottava
                'Sandcastle Fun': ['SandcastleFun', 'f246fhn3x/16.0', '', '', ''], // Ottawa, Jeffeth
                'Secret Lantern': ['SecretLantern', 'f246dmm85/16.0', '', '', ''], // Ottawa, Jeffeth
                'Secret Love': ['SecretLove', 'f247n9916/16.1', '', '', ''], // Clarence-Rockland, Jeffeth
                'Skull': ['Skull', 'f2h5esd2j/16.0', '', '', ''],
                'Spring in Ottawa': ['SpringInOttawa', 'f2469zt39/16.0', '', '', ''], // Ottava, Jeffeth, topic (seasons, holidays)
                'Stanley for Dad': ['StanleyForDad', 'f247phkyn/16.1', '', '', ''], // Clarence-Rockland, Jeffeth
                'Ste-Julie 2023': ['SteJulie2023', 'f25g71uhb/16.1', '', '', ''],
                'Stroopwafel invasion in Brossard': ['StroopwafelInvasionInBrossard', 'f25f8m2hv/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Georgetown': ['StroopwafelInvasionInGeorgetown', 'dpz0jxyv6/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Summer in Ottawa': ['SummerInOttawa', 'f246ds0e9/16.0', '', '', ''], // Ottava, Jeffeth, topic (seasons, holidays)
                'The Secret Egg': ['TheSecretEgg', 'f246vjvy0/16.0', '', '', ''], // Clarence-Rockland, Jeffeth
                'Warbler`s Square': ['WarblersSquare', 'dpz8e29qd/16.0', '', '', ''],
                'West Branch Ponds': ['WestBranchPonds', 'dpz0m8p0d/16.2', '', '', '']
            },
            'China': {
                'Shenzhen M': ['ShenzhenM', 'wecpbjjy5/16.0', '', '', '']
            },
            'Croatia': {
                'Croatia Locket Heart': ['CroatiaLocketHeart', 'srsn75467/16.3', '', '', ''],
                'Rijeka Gift - 2023 Christmas': ['RijekaGift2023Christmas', 'u243bez8s/16.0', '', '', ''] // Balazs80
            },
            'Cyprus': {
                'Cyprus Piggy': ['CyprusPiggy', 'swpmkbrbe/16.3', '', '', ''] // [*]
            },
            'Denmark': {
                'Aarhus Rose': ['AarhusRose', 'u1zprxesu/15.1', '', '', ''], // Aarhus
                'Apple in Aarhus': ['AppleInAarhus', 'u1zr85dyw/16.0', '', '', ''], // Aarhus
                'Christmastree in Hillerød': ['ChristmastreeInHilleroed', 'u3bwpz4em/16.0', '', '', ''], // Hillerød
                'Det spøger i Haslev': ['DetSpogerIHaslev', 'u3b6xxv9f/16.0', '', '', ''],
                'Drikkehorn': ['Drikkehorn', 'u3b6kzwtk/16.0', '', '', ''],
                'Emerald in Hilleroed': ['EmeraldInHilleroed', 'u3by0p0uw/15.5', '', '', ''], // Hillerød
                'F-Bomb - Hammel': ['FBombHammel', 'u1zpbx5gt/15.9', '', '', ''], // Hammel, topic (F-Bomb)
                'Flat Hammel': ['FlatHammel', 'u4p003mrr/16.0', '', '', ''], // Hammel
                'Flat Square': ['FlatSquare', 'u3by0rexn/16.0', '', '', ''], // Hillerød
                'Flat, Fensmark': ['FlatFensmark', 'u3b6kxrtm/16.1', '', '', ''],
                'Garden of Jewels': ['GardenOfJewels', 'u1zr85me8/16.0', '', '', ''], // Aarhus
                'Grenaa Amethyst': ['GrenaaAmethyst', 'u4p8zxcm7/16.0', '', '', ''], // Grenaa
                'Grenaa Big Amethyst': ['GrenaaBigAmethyst', 'u4p8znju6/15.8', '', '', ''], // Grenaa
                'Grenaa Ferry': ['GrenaaFerry', 'u4pbbt4gq/15.7', '', '', ''], // Grenaa, RUJA
                'Grenaa Heart 2022': ['GrenaaHeart2022', 'u4p8zkw70/16.0', '', '', ''], // Grenaa
                'Grenaa Sapphire and Amethyst': ['GrenaaSapphireAndAmethyst', 'u4p8zwhpp/16.0', '', '', ''], // Grenaa, RUJA
                'Heart of Valentine': ['HeartOfValentine', 'u1zpbx2nw/16.0', '', '', ''], // Hammel
                'Juletræ i Viby': ['JuletraeIViby', 'u3becz31u/16.0', '', '', ''],
                'MiniPortal2': ['MiniPortal2', 'u4p001h4e/16.0', '', '', ''], // Hammel, BonnieB1
                'Next stop Tilst': ['NextStopTilst', 'u1zptuunw/16.0', '', '', ''], // Aarhus
                'Nonne - Maribo': ['NonneMaribo', 'u38pw6e8n/15.6', '', '', ''],
                'NV Goggles, Sorø': ['NVGogglesSoro', 'u3b5qfseg/16.0', '', '', ''],
                'Onyx Citrine Park in Hammel': ['OnyxCitrineParkInHammel', 'u4p002e26/15.2', '', '', ''], // Hammel
                'Silkeborg Coat of Arms': ['SilkeborgCoatOfArms', 'u1yz935ce/15.8', '', '', ''], // Silkeborg, jacobsedk
                'Silkeborg Hexagon': ['SilkeborgHexagon', 'u1yz91p0q/16.0', '', '', ''], // Silkeborg, jacobsedk
                'Silkeborg Mario': ['SilkeborgMario', 'u1yz3x8z1/15.9', '', '', ''], // Silkeborg, jacobsedk
                'Silkeborg Night Owl': ['SilkeborgNightOwl', 'u1yz90x8u/16.0', '', '', ''], // Silkeborg, jacobsedk
                'Silkeborg Owl': ['SilkeborgOwl', 'u1yz929gr/16.0', '', '', ''], // Silkeborg, jacobsedk
                'Silkeborg Rainbow Unicorn': ['SilkeborgRainbowUnicorn', 'u1yz90pxh/16.0', '', '', ''], // Silkeborg, jacobsedk
                'Søparken - Maribo': ['SoparkenMaribo', 'u38ptekkf/16.0', '', '', ''],
                'Tranbjerg Butterfly': ['TranbjergButterfly', 'u1zpn4juj/16.0', '', '', ''],
                'True Forest Fish': ['TrueForestFish', 'u1zptc9xn/16.0', '', '', ''], // Aarhus, MetteS
                'True Forest Surprise': ['TrueForestSurprise', 'u1zpw1bck/16.0', '', '', ''], // Aarhus, MetteS
                'Zeecret, Appenæs': ['ZeecretAppenaes', 'u3b653rf2/16.0', '', '', ''], // topic (Zeecret)
                'Zeecret, Fensmark': ['ZeecretFensmark', 'u3b6kqsbz/16.0', '', '', ''], // topic (Zeecret)
                'Zeecret, Frederiksberg': ['ZeecretFrederiksberg', 'u3b5nznf2/16.0', '', '', ''], // topic (Zeecret)
                'Zeecret, Hillerød': ['ZeecretHilleroed', 'u3by0xm2f/16.0', '', '', ''], // Hillerød, topic (Zeecret)
                'Zeecret, Sundby': ['ZeecretSundby', 'u38rt9mqj/16.0', '', '', ''], // topic (Zeecret)
                'Zeecret, Viby': ['ZeecretViby', 'u3becrqvc/16.0', '', '', ''] // topic (Zeecret)
            },
            'Finland': {
                '102nd Independence Day': ['102ndIndependenceDay', 'udbvthz50/15.7', '', '', ''], // Tampere
                'Crazy Ghost': ['CrazyGhost', 'udf3cy0um/15.3', '', '', ''], // Jesnou, Sivontim
                'Christmas Candle': ['ChristmasCandle', 'ue27jfsgj/15.3', '', '', ''], // Kokkola, katinka3
                'Drive': ['Drive', 'ud9wrfgwv/15.7', '', '', ''], // Helsinki, Sivontim
                'Easter Bunny': ['EasterBunny', 'ud9wqgnsc/15.8', '', '', ''], // Helsinki, Jesnou, Neesu, Sivontim
                'Espoon vaakuna Herald of Espoo': ['EspoonVaakunaHeraldOfEspoo', 'ud9w7f5gq/15.9', '', '', ''], // [push], Espoo, mandello
                'Evopuisto': ['Evopuisto', 'u6xzgfrs4/15.6', '', '', ''], // Turku, RePe, tcguru
                'Flag of Finland': ['FlagOfFinland', 'ue5ttrjsm/15.5', '', '', ''], // Jesnou
                'Flat Rob/Matt in Kokkola': ['FlatRobMattInKokkola', 'ue27nhr6k/15.7', '', '', ''], // Kokkola
                'Google': ['Google', 'udf4xgjjf/15.8', '', '', ''], // Lahti
                'Helsinki Surprise': ['HelsinkiSurprise', 'ud9wrdrqb/15.8', '', '', ''], // Helsinki, Sivontim
                'Hyvinkään lumihiutale': ['HyvinkaanLumihiutale', 'udc8uew15/15.8', '', '', ''], // Hyvinkää, katinka3
                'Juna jyskyttää': ['JunaJyskyttaa', 'ue27nsdt9/15.0', '', '', ''], // Kokkola, katinka3
                'Kalevankankaan ankkuri': ['KalevankankaanAnkkuri', 'udbvvd9u5/15.7', '', '', ''], // Tampere
                'Kalevankankaan sydän': ['KalevankankaanSydan', 'udbvv69k1/15.7', '', '', ''], // Tampere, Lissu
                'Kokkola': ['Kokkola', 'ue27jz0bs/15.7', '', '', ''], // Kokkola, katinka3
                'Kokkola Clown': ['KokkolaClown', 'ue27n5x3j/15.3', '', '', ''], // Kokkola, malof
                'Kokkola Surprise': ['KokkolaSurprise', 'ue27jvu38/15.7', '', '', ''], // Kokkola, malof
                'Kokkola Virtual Sapphire': ['KokkolaVirtualSapphire', 'ue27njxxh/15.7', '', '', ''], // Kokkola, malof
                'Kokkolan asepuisto': ['KokkolanAsepuisto', 'ue27ny4r1/15.7', '', '', ''], // Kokkola, katinka3
                'Kokkolan kurpitsainen': ['KokkolanKurpitsainen', 'ue27mb89n/15.2', '', '', ''], // Kokkola, katinka3
                'Kokkolan Vaakuna': ['KokkolanVaakuna', 'ue27pnc37/15.0', '', '', ''], // Kokkola, malof
                'Kuopio Surprise Trail': ['KuopioSurpriseTrail', 'ue5tv9qhb/14.3', '', '', ''], // Jesnou
                'Kupittaa`s football': ['KupittaasFootball', 'u6xzg7szq/15.7', '', '', ''], // Turku, RePe
                'Lahden Air Mystery Trail': ['LahdenAirMysteryTrail', 'udf4zvjqb/15.0', '', '', ''], // Lahti
                'Lahden Crossbow': ['LahdenCrossbow', 'udf4zujfm/15.7', '', '', ''], // Lahti
                'Lahti Amethyst': ['LahtiAmethyst', 'udf4xk2p7/15.8', '', '', ''], // Lahti
                'Lahti Farm': ['LahtiFarm', 'udf4zucyw/15.8', '', '', ''], // Lahti
                'Lahti Flat Rob': ['LahtiFlatRob', 'udf4xhu3x/15.8', '', '', ''], // Lahti
                'Lahti Surprise': ['LahtiSurprise', 'udf4xhg1r/15.7', '', '', ''], // Lahti
                'Lahti Vm': ['LahtiVm', 'udf4xsdk1/15.8', '', '', ''], // Lahti
                'Mermaid': ['Mermaid', 'ud9wk45jn/15.0', '', '', ''], // Espoo, Jesnou, Neesu, Sivontim, mandello
                'mUnZee10 Birthday': ['mUnZee10Birthday', 'ud9wz1kgz/15.6', '', '', ''], // Helsinki, Jesnou, Neesu, Sivontim, mandello
                'Oneplus': ['Oneplus', 'udf6bte57/15.8', '', '', ''], // Lahti
                'Reksun Vm': ['ReksunVm', 'udf4xs55s/15.8', '', '', ''], // Lahti
                'Sapphire, Helsinki': ['SapphireHelsinki', 'ud9wrd2x7/15.8', '', '', ''], // Helsinki
                'Snowman': ['Snowman', 'ue27htg20/15.6', '', '', ''], // Kokkola
                'Suomi100': ['Suomi100', 'ue27r01dg/14.8', '', '', ''], // Kokkola, katinka3
                'TPS Jaanilla - Hockey Team': ['TPSJaanillaHockeyTeam', 'u6xzumc3p/15.8', '', '', ''], // Turku
                'Turun Yliopisto': ['TurunYliopisto', 'u6xzfvxuz/15.6', '', '', ''], // Turku, taiska1255
                'Valentine Heart, Kokkola': ['ValentineHeartKokkola', 'ue27j4bks/15.6', '', '', ''], // Kokkola
                'Xmas Stocking': ['XmasStocking', 'ud9y8yqyr/15.7', '', '', ''], // Helsinki, Jesnou, Neesu, Sivontim, mandello
                'YinYang': ['YinYang', 'udf685chb/15.8', '', '', ''] // Lahti
            },
            'France': {
                'France`s First Player-made': ['FrancesFirstPlayerMadeDinan', 'gbwe9p554/16.2', '', '', ''] // topic (Buckeye`s European Invasion)
            },
            'Germany': {
                '9th Birthday in Berlin': ['9thBirthdayInBerlin', 'u336ykze2/15.8', '', '', ''], // Berlin
                'Berlin - BYOG 2020': ['BerlinBYOG2020', 'u337njw0q/16.0', '', '', ''], // Berlin, 123xilef
                'Berlin - High Voltage': ['Berlin-HighVoltage', 'u336ws3eq/15.4', '', '', ''], // Berlin, 123xilef
                'Berlin Cards Pin': ['BerlinCardsPin', 'u336z2hgg/16.1', '', '', ''], // Berlin, 123xilef
                'Berlin Evo Garden - Potsdamer Platz': ['BerlinEvoGarden-PotsdamerPlatz', 'u33d8qm65/16.1', '', '', ''], // Berlin
                'BTHVN 2020': ['BTHVN2020', 'u1j06c9wg/15.9', '', '', ''], // Bonn
                'Bullseye': ['Bullseye', 'u336wpc2q/15.3', '', '', ''], // Berlin
                'Colors @Bonn': ['ColorsBonn', 'u1j02nz06/16.1', '', '', ''], // Bonn
                'Colours of Berlin': ['ColoursOfBerlin', 'u336z06cn/15.7', '', '', ''], // 123xilef, Berlin
                'Crossbow Pin': ['CrossbowPin', 'u336wt64s/16.0', '', '', ''], // Berlin
                'Crossbow Shield': ['CrossbowShield', 'u33dbv6xm/15.6', '', '', ''], // Berlin
                'Ernie in Volksdorf': ['ErnieInVolksdorf', 'u1x1pjrgy/14.9', '', '', ''], // topic (Sesamstreet
                'Euro MVM Flags - Bosnia & Herzegovina': ['EuroMVMFlagsBosniaHerzegovina', 'u1h2f9dte/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Bulgaria': ['EuroMVMFlagsBulgaria', 'u1h2f91q8/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Croatia': ['EuroMVMFlagsCroatia', 'u1h2f2rqk/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Czech Republic': ['EuroMVMFlagsCzechRepublic', 'u1h2dqv97/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Denmark': ['EuroMVMFlagsDenmark', 'u1h2dpnm7/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Estonia': ['EuroMVMFlagsEstonia', 'u1h2dxfsz/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Europe': ['EuroMVMFlagsEurope', 'u1h2dwn93/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Finland': ['EuroMVMFlagsFinland', 'u1h2dny3z/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - France': ['EuroMVMFlagsFrance', 'u1h2dzm5t/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Great Britain': ['EuroMVMFlagsGreatBritain', 'u1h2dn3gq/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Greek': ['EuroMVMFlagsGreek', 'u1h2drcjq/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Hungary': ['EuroMVMFlagsHungary', 'u1h2drpdv/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Italy': ['EuroMVMFlagsItaly', 'u1h2dnewx/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Lithuania': ['EuroMVMFlagsLithuania', 'u1h2f8e8y/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Norway': ['EuroMVMFlagsNorway', 'u1h2dpx2y/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Poland': ['EuroMVMFlagsPoland', 'u1h2f81vz/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Portugal': ['EuroMVMFlagsPortugal', 'u1h2f24je/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Russia': ['EuroMVMFlagsRussia', 'u1h29yp2g/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Serbia': ['EuroMVMFlagsSerbia', 'u1h2f8b48/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Spain': ['EuroMVMFlagsSpain', 'u1h2f2hg6/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Sweden': ['EuroMVMFlagsSweden', 'u1h2dye8t/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Switzerland': ['EuroMVMFlagsSwitzerland', 'u1h2dqf52/16.0', '', '', ''], // Aachen
                'Euro MVM Flags - Ukraine': ['EuroMVMFlagsUkraine', 'u1h29ymk0/16.0', '', '', ''], // Aachen
                'Event Pin': ['EventPin', 'u1j09d1xz/15.4', '', '', ''], // Bonn, Bonn
                'Evo in Berlin Steglitz': ['EvoInBerlinSteglitz', 'u336rn5c1/15.6', '', '', ''], // Berlin
                'F-Bomb - Berlin': ['FBombBerlin', 'u336wckkv/15.9', '', '', ''], // topic (F-Bomb)
                'Flat Hammock Pin': ['FlatHammockPin', 'u336wv7qr/16.0', '', '', ''], // Berlin
                'Flat Lou Pin': ['FlatLouPin', 'u336wt0df/16.0', '', '', ''], // Berlin
                'Flat Rob Pin': ['FlatRobPin', 'u336wv919/16.0', '', '', ''], // Berlin
                'German Beer': ['GermanBeer', 'u0zchy9hm/15.9', '', '', ''],
                'German Heart': ['GermanHeart', 'u33dukpdk/16.0', '', '', ''], // Berlin, BonnieB1
                'Goethe am Turm': ['GoetheAmTurm', 'u0yhyq604/15.8', '', '', ''],
                'Greenie Pin': ['GreeniePin', 'u336wmp7k/16.0', '', '', ''], // Berlin
                'Marzahner Bockwindmühle': ['MarzahnerBockwindmuhle', 'u33dutke7/16.0', '', '', ''], // Berlin
                'Matt Pin': ['MattPin', 'u336wmhfr/16.0', '', '', ''], // Berlin
                'Mixed Garden RT': ['MixedGardenRT', 'u0weck999/16.1', '', '', ''], // Reutlingen, geckofreund, NoahCache
                'Mystery Pin': ['MysteryPin', 'u336wtw14/16.0', '', '', ''], // Berlin
                'Patchwork-Dußlingen': ['PatchworkDusslingen', 'u0w7w7x2x/15.9', '', '', ''],
                'Pretzel': ['Pretzel', 'u336we05x/15.9', '', '', ''], // Berlin, BonnieB1
                'Quietscheentchen': ['Quietscheentchen', 'u1x1ps8ct/15.8', '', '', ''], // topic (Sesamstreet
                'Sparrenburg in Bielefeld': ['SparrenburgInBielefeld', 'u1np9ww9g/15.2', '', '', ''], // Bielefeld
                'Sperenberg Teddy': ['SperenbergTeddy', 'u338852tq/16.0', '', '', ''],
                'Stroopwafel invasion in Berlin': ['StroopwafelInvasionInBerlin', 'u33e0rucx/16.3', '', '', ''], // Berlin, topic (Stroopwafel invasion)
                'Stroopwafel invasion in Chemnitz': ['StroopwafelInvasionInChemnitz', 'u311ncc6x/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Sweet Heart': ['SweetHeart', 'u336v9wb8/16.0', '', '', ''], // Berlin
                'Waffenkammer in Bielefeld': ['WaffenkammerInBielefeld', 'u1np9gg86/15.5', '', '', ''], // Bielefeld
                'We Love Munzee': ['WeLoveMunzee', 'u0wt89mzs/16.0', '', '', ''],
                'Wedding Day': ['WeddingDay', 'u0webcwke/16.1', '', '', ''] // Reutlingen, geckofreund, NoahCache
            },
            'Greece': {
                'The Lighthouse of Chania': ['TheLighthouseOfChania', 'sw344d4gm/16.3', '', '', ''], // Rikitan
                'Zakynthos': ['Zakynthos', 'sqwz4ft79/16.5', '', '', '']
            },
            'Hungary': {
                '10th Birthday Cake': ['10thBirthdayCake', 'u2nr4gcmd/16.1', '', '', ''], // Szeged
                '60 Color': ['60Color', 'u2rqk5m6n/16.2', '', '', ''], // Debrecen, Norbee97
                '60 Flat': ['60Flat', 'u2rqk5m38/16.3', '', '', ''], // Debrecen, Norbee97
                '64color': ['64color', 'u2mw4qzsx/16.4', '', '', ''], // Budapest
                '64color, Szeged': ['64colorSzeged', 'u2nr4gmsq/16.0', '', '', ''], // Szeged
                'Audi': ['Audi', 'u2kx32e7c/16.0', '', '', ''], // Balazs80
                'Beagle': ['Beagle', 'u2rqe9sxg/16.1', '', '', ''], // Debrecen, delfin13
                'Black Cat': ['BlackCat', 'u2mw19v40/16.1', '', '', ''], // Budapest
                'Cata-Joy': ['Cata-Joy', 'u2rq7208j/15.9', '', '', ''], // Debrecen, Norbee97
                'Chain Bridge': ['ChainBridge', 'u2mw1spfx/15.4', '', '', ''], // Budapest
                'Christmas Tree in Budapest': ['ChristmasTreeInBudapest', 'u2mw74ev2/16.1', '', '', ''], // Budapest
                'Cimbi': ['Cimbi', 'u2rq7vk57/16.0', '', '', ''], // Debrecen, delfin13
                'Colors': ['Colors', 'u2rqe2txv/15.9', '', '', ''], // Debrecen, delfin13
                'Crossbow on Hármashatárhegy': ['CrossbowOnHarmashatarhegy', 'u2mqx8zje/15.3', '', '', ''], // Budapest, zsomborpeto
                'Debrecen': ['Debrecen', 'u2rqsnxbs/14.6', '', '', ''], // Debrecen
                'Debreceni kereszt': ['DebreceniKereszt', 'u2rqk7rjj/16.3', '', '', ''], // Debrecen, Norbee97
                'DeoCaching Clan': ['DeoCachingClan', 'u2rqs7b4m/15.7', '', '', ''], // Debrecen
                'Duck at Balaton': ['DuckAtBalaton', 'u2kd7bxkz/16.0', '', '', ''],
                'Evolution': ['EvolutionDebrecen', 'u2rqk5174/16.3', '', '', ''], // Debrecen, Norbee97
                'Eyes in the night': ['EyesInTheNight', 'u2mqq3rzy/16.0', '', '', ''],
                'F-Bomb - Budapest': ['FBombBudapest', 'u2mw4erzn/15.9', '', '', ''], // topic (F-Bomb)
                'Flags in Budapest': ['FlagsInBudapest', 'u2mw9m10r/14.9', '', '', ''], // Budapest
                'Flower Carnival in Debrecen': ['FlowerCarnivalInDebrecen', 'u2rqs2c96/14.5', '', '', ''], // Debrecen
                'Frog in Budaörs': ['FrogInBudaors', 'u2mqp3rcd/16.0', '', '', ''],
                'Grail': ['Grail', 'u2mw30kw9/16.2', '', '', ''], // Budapest, Norbee97
                'Great Church': ['GreatChurch', 'u2rqkszmr/16.1', '', '', ''], // Debrecen
                'győr vg farm': ['GyorVgFarm', 'u2kx642nx/16.2', '', '', ''],
                'győri vasúti kert': ['GyoriVasutiKert', 'u2kx609yv/16.2', '', '', ''],
                'Honey': ['Honey', 'u2rqkq0ze/16.0', '', '', ''], // Debrecen, delfin13
                'Húsvéti piros tojás': ['HusvetiPirosTojas', 'u2mw6bsm1/16.0', '', '', ''], // Budapest
                'Jewel & Color': ['JewelAndColor', 'u2mw6egv5/16.0', '', '', ''], // Budapest, Norbee97
                'Kavicsbánya Kecskemét': ['KavicsbanyaKecskemet', 'u2mfztk6u/16.1', '', '', ''], // Kecskemét
                'Kodály`s Violin': ['KodalysViolin', 'u2q4b5j10/16.1', '', '', ''], // Kecskemét, Norbee97
                'Lovagok kertje': ['LovagokKertje', 'u2mw68gkq/16.1', '', '', ''], // Budapest
                'MaXGarden': ['MaXGarden', 'u2mndcvk0/15.7', '', '', ''], // Tatabánya
                'MH felirat': ['MHFelirat', 'u2mw4g06j/15.7', '', '', ''], // Budapest, Balazs80
                'Mini': ['Mini', 'u2jqxx3r0/16.2', '', '', ''], // Balazs80
                'Minimal ice cube in Baja': ['MinimalIceCubeInBaja', 'u2jqxn63r/16.1', '', '', ''],
                'Munzee Logo': ['MunzeeLogo', 'u2mtbxcxh/15.8', '', '', ''], // Budapest
                'Picu': ['Picu', 'u2rqkn2gm/16.0', '', '', ''], // Debrecen, delfin13
                'Pomáz Locomotiv': ['PomazLocomotiv', 'u2mwcrb2b/14.4', '', '', ''],
                'Q94': ['Q94', 'u2mw4g3wx/16.0', '', '', ''], // Budapest
                'QR': ['QR', 'u2rqkgr9r/15.8', '', '', ''], // Debrecen, delfin13
                'RWG': ['RWG', 'u2mw70355/16.0', '', '', ''], // Budapest
                'Santa`s Sledge': ['SantasSledge', 'u2mw44m62/15.7', '', '', ''], // Budapest
                'Santa Claus`s sack Kecskemét': ['SantaClaussSackKecskemet', 'u2q4bp67c/16.1', '', '', ''], // Kecskemét
                'Snoopy in Budapest': ['SnoopyInBudapest', 'u2mtdj0e2/15.9', '', '', ''], // Budapest, Bambusznad
                'Steamship on Danube': ['SteamshipOnDanube', 'u2mw1t103/16.0', '', '', ''], // Budapest
                'Stroopwafel invasion in Felsőgalla': ['StroopwafelInvasionInFelsogalla', 'u2mn7yzxz/16.3', '', '', ''], // Tatabánya, topic (Stroopwafel invasion)
                'Surprise Car': ['SurpriseCar', 'u2mw772ht/16.3', '', '', ''], // Budapest
                'Surprise in Budapest': ['SurpriseInBudapest', 'u2mw18ymw/16.0', '', '', ''], // Budapest, Laczy76
                'Swans by the Danube': ['SwansByTheDanube', 'u2mtdufs5/15.9', '', '', ''], // Budapest, Bambusznad
                'Szeged a Napfény Városa': ['SzegedANapfenyVarosa', 'u2nr4s236/16.0', '', '', ''], // Szeged
                'Szeged felirat': ['SzegedFelirat', 'u2nr4dvn4/15.7', '', '', ''], // Szeged
                'Szigetszentmiklósi Kőbánya': ['SzigetszentmiklosiKobanya', 'u2mt3rnpx/16.1', '', '', ''],
                'Szombathelyi villamos 2': ['SzombathelyiVillamos2', 'u27udr4sc/16.0', '', '', ''],
                'Tank': ['Tank', 'u2mqr80z7/16.2', '', '', ''], // Budapest
                'Tisza': ['Tisza', 'u2nr4eskk/16.0', '', '', ''], // Szeged
                'Tócóskert`s Arrows': ['TocoskertsArrows', 'u2rq7shg2/15.91', '', '', ''], // Debrecen
                'Tócóskert`s Arrows 2': ['TocoskertsArrows2', 'u2rq7shg2/15.92', '', '', ''] // Debrecen, Norbee97
            },
            'Japan': {
                'Osaka Octopus': ['OsakaOctopus', 'xn0mk4guq/16.2', '', '', '']
            },
            'Jersey': {
                'St Ouen': ['StOuen', 'gby2jfhw2/16.1', '', '', '']
            },
            'Lithuania': {
                'Akmenynas': ['Akmenynas', 'u9c2h7epw/15.7', '', '', ''], // Kaišiadorys
                'Baltic Way 30': ['BalticWay30', 'u9c2hu8uh/16.0', '', '', ''], // Kaišiadorys
                'Kaišiadorys Crossbow': ['KaisiadorysCrossbow', 'u9c2huzrg/15.6', '', '', ''], // Kaišiadorys
                'Kaišiadorys Hammer': ['KaisiadorysHammer', 'u9c25u5tp/15.8', '', '', ''], // Kaišiadorys
                'Kaišiadorys Mini Electric': ['KaisiadorysMiniElectric', 'u9c2hhy9b/15.9', '', '', ''], // Kaišiadorys
                'Kaunas Green Leaf': ['KaunasGreenLeaf', 'u9c03mku3/15.9', '', '', ''], // Kaunas
                'Kaunas Scatter 1': ['KaunasScatter1', 'u9c06nf52/16.1', '', '', ''], // Kaunas
                'Lukiskes Square': ['LukiskesSquare', 'u99zp5cqw/15.9', '', '', ''], // Vilnius
                'OZO Parkas': ['OZOParkas', 'u99zr35t2/16.0', '', '', ''], // Vilnius
                'Pistachio Ice Cream in Kaunas': ['PistachioIceCreamInKaunas', 'u9c03q762/15.6', '', '', ''], //Kaunas
                'Rotuses Square Kaunas': ['RotusesSquareKaunas', 'u9bbr99v5/16.0', '', '', ''], // Kaunas
                'Virus Bomb': ['VirusBomb', 'u9c2h7w98/16.0', '', '', ''] // Kaišiadorys
            },
            'Netherlands': {
                'Amsterdam Surprise2': ['AmsterdamSurprise2', 'u173wm04m/16.0', '', '', ''], // Marnic
                'Anker / Anchor': ['AnkerAnchor', 'u173vy0ff/16.0', '', '', ''], // Amsterdam
                'Cars Flat': ['CarsFlat', 'u15p7thk4/16.0', '', '', ''], // Schiedam
                'Cars Schiedam': ['CarsSchiedam', 'u15p7v3c1/15.8', '', '', ''], // Schiedam
                'Cars Virtual': ['CarsVirtual', 'u15p7thkj/16.0', '', '', ''], // Schiedam
                'Catch the black sheep!': ['CatchTheBlackSheep', 'u171jw7ts/15.7', '', '', ''], // Noordwijk, destrandman
                'Cittaslow - Echt': ['CittaslowEcht', 'u1h4vc86y/15.9', '', '', ''], // Echt, Roger6102
                'Crossbow Garden Echt': ['CrossbowGardenEcht', 'u1h4tqutt/16.0', '', '', ''], // Echt, Roger6102
                'Crossbow Heerlen': ['CrossbowHeerlen', 'u1h327qym/15.5', '', '', ''], // [push]
                'Crossbows Beeckestijn': ['CrossbowsBeeckestijn', 'u1763sspe/15.7', '', '', ''], // Beeckestijn, Marnic
                'Cybertruck': ['Cybertruck', 'u171jq7yk/15.9', '', '', ''], // Noordwijk, destrandman
                'Dark Side Of The Moon': ['DarkSideOfTheMoon', 'u15p7whzh/16.0', '', '', ''], // Schiedam
                'Duckling': ['Duckling', 'u1hr835tf/15.7', '', '', ''],
                'Erensteiner Easter Eggs 2': ['ErensteinerEasterEggs2', 'u1h33v2d4/16.0', '', '', ''], // WandelKuub
                'Escher vs Mondriaan': ['EscherVsMondriaan', 'u171jx5qv/15.9', '', '', ''], // Noordwijk, destrandman
                'EVO1 Kerkrade': ['EVO1Kerkrade', 'u1h365e4v/16.0', '', '', ''], // WandelKuub
                'EVO2 Kerkrade': ['EVO2Kerkrade', 'u1h36h5eg/15.6', '', '', ''], // WandelKuub
                'EvoApple Ech': ['EvoAppleEch', 'u1h4tr7p2/16.1', '', '', ''], // Echt, Roger6102
                'Evolapje Schinnen': ['EvolapjeSchinnen', 'u1h1y4hf3/16.0', '', '', ''],
                'Evolution Beeckestijn': ['EvolutionBeeckestijn', 'u1763u3rj/15.1', '', '', ''], // Beeckestijn, Marnic
                'Evolution-1 Ruige Riet': ['Evolution1RuigeRiet', 'u173vmynm/16.0', '', '', ''], // Amsterdam
                'Evolution-2 Ruige Riet': ['Evolution2RuigeRiet', 'u173vmw5w/16.0', '', '', ''], // Amsterdam
                'FlatFriendsM': ['FlatFriendsM', 'u1h1uk3x0/16.0', '', '', ''],
                'Fruit in Limburg 1': ['FruitInLimburg1', 'u1h1gghn0/16.0', '', '', ''],
                'Fruit in Limburg 3': ['FruitInLimburg3', 'u1h1u7nwd/16.0', '', '', ''],
                'Fruit in Limburg 4': ['FruitInLimburg4', 'u1h1um32t/15.4', '', '', ''],
                'Fruit in Limburg 5': ['FruitInLimburg5', 'u1h1u79pf/16.0', '', '', ''],
                'Go Green Noordwijk': ['GoGreenNoordwijk', 'u171jr08j/15.8', '', '', ''], // Noordwijk, destrandman
                'Goggle Ghost': ['GoggleGhost', 'u1h1usjuc/16.0', '', '', ''],
                'Gouda': ['Gouda', 'u15rfvwe5/15.9', '', '', ''], // [push]
                'Grabbelton Reeuwijk': ['GrabbeltonReeuwijk', 'u1725vdkc/14.9', '', '', ''], // [push]
                'Grabbelton Reeuwijk (Flats)': ['GrabbeltonReeuwijkFlats', 'u1725vdkc/14.9009', '', '', ''], // [push]
                'Groene Stroom': ['GroeneStroom', 'u1khdnhch/15.8', '', '', ''], // Lemmer, NikitaStolk
                'Honeycombs Schiedam': ['HoneycombsSchiedam', 'u15p7fguu/15.4', '', '', ''], // Schiedam, Belugue
                'Honeycombs-2 Schiedam': ['Honeycombs2Schiedam', 'u15p7g567/15.2', '', '', ''], // Schiedam, Belugue
                'Kabouter': ['Kabouter', 'u15pkmws3/15.4', '', '', ''],
                'Kerkrade Jewel': ['KerkradeJewel', 'u1h36525q/16.0', '', '', ''], // WandelKuub
                'Kerkrade Surprise': ['KerkradeSurprise', 'u1h365kun/16.0', '', '', ''], // WandelKuub
                'Klomp': ['Klomp', 'u1kh9ggr7/16.0', '', '', ''], // Lemmer, NikitaStolk
                'Kruisboog / Crossbow': ['KruisboogCrossbow', 'u173vkvyt/15.7', '', '', ''], // Amsterdam
                'Kruisboog / Crossbow2': ['KruisboogCrossbow2', 'u173vszfq/15.7', '', '', ''], // Amsterdam
                'Kruisboog / Crossbow4': ['KruisboogCrossbow4', 'u173vsjv8/15.7', '', '', ''], // Amsterdam
                'Krúsbôge Oertún': ['KrusbogeOertun', 'u1kjpyfy1/15.4', '', '', ''], // Heerenveen
                'Krúsbôgetún it Kanaal': ['KrusbogetunItKanaal', 'u1kjq5k8x/15.3', '', '', ''], // Heerenveen, FRLK
                'Lucky Clover': ['LuckyClover', 'u1763sv5g/15.7', '', '', ''], // Beeckestijn, Marnic
                'Mario Kart': ['MarioKart', 'u15p7veys/15.0', '', '', ''], // Schiedam
                'Market MVM': ['MarketMVM', 'u1h33gy9q/16.0', '', '', ''], // WandelKuub
                'Museum Belvédère': ['MuseumBelvedere', 'u1kjr9h36/15.7', '', '', ''], // Heerenveen
                'Music Triangle': ['MusicTriangle', 'u1h1us5qq/16.0', '', '', ''],
                'Netherlands Tulip': ['NetherlandsTulipAmstelveen', 'u173wggyh/16.0', '', '', ''], // topic (Buckeye`s European Invasion)
                'Pin-NL': ['PinNL', 'u173vdujq/15.7', '', '', ''], // Amsterdam
                'Pompeblêd Palet': ['PompebledPalet', 'u1khd5y3q/16.3', '', '', ''], // Lemmer, NikitaStolk
                'QR-Spaarnwoude': ['QR-Spaarnwoude', 'u1766fj3h/15.3', '', '', ''], // Marnic
                'Rob And Louise': ['RobAndLouise', 'u15s8jx51/15.7', '', '', ''],
                'Roodborstje / Robin': ['RoodborstjeRobin', 'u173vucc9/15.9', '', '', ''], // Amsterdam
                'Rotterdam Snowman': ['RotterdamSnowman', 'u15pkt48t/15.7', '', '', ''],
                'Slak / Snail': ['SlakSnail', 'u173vrytn/15.9', '', '', ''], // Amsterdam
                'Surprise': ['Surprise', 'u173vt3u1/15.9', '', '', ''], // Amsterdam
                'Stroopwafel invasion in Arnhem': ['StroopwafelInvasionInArnhem', 'u1hpz6kq2/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Gouda': ['StroopwafelInvasionInGouda', 'u15rfnm03/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Groningen': ['StroopwafelInvasionInGroningen', 'u1kwvu195/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Hoofddorp': ['StroopwafelInvasionInHoofddorp', 'u173d4yds/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Ospel': ['StroopwafelInvasionInOspel', 'u1h5gdgny/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Superman vs Batman': ['SupermanVsBatman', 'u171jz6j8/15.3', '', '', ''], // Noordwijk, destrandman
                'Tea at Grandma': ['TeaAtGrandma', 'u1kh9uc8m/15.7', '', '', ''], // Lemmer, NikitaStolk
                'The Wall': ['TheWall', 'u1kh9upnp/15.9', '', '', ''], // Lemmer, NikitaStolk
                'Two Smileys': ['TwoSmileys', 'u1kc2gv15/15.9', '', '', ''],
                'Uil / Owl': ['UilOwl', 'u173vsbr2/15.9', '', '', ''], // Amsterdam
                'Vlag Echt': ['VlagEcht', 'u1h4vf56p/16.0', '', '', ''] // Echt, Roger6102
            },
            'New Zealand': {
                'Brooklyn Queen`s Gambit': ['BrooklynQueensGambit', 'rbsm0b9hk/16.3', '', '', ''],
                'Grafton Star': ['GraftonStar', 'rckq2cs4g/16.3', '', '', ''], // [push], Auckland
                'Grafton Star (Flats)': ['GraftonStarFlats', 'rckq2cs4g/16.3009', '', '', ''], // [push], Auckland
                'Howick Jewel Art #1': ['HowickJewelArt1', 'rckqh6yb4/16.2', '', '', ''], // [push], Auckland, 321Cap
                'Howick Jewel Art #2': ['HowickJewelArt2', 'rckqh6qzf/16.2', '', '', ''], // Auckland, 321Cap
                'Howick Night Vision Goggle Square': ['HowickNightVisionGoggleSquare', 'rckqh4pxn/16.2', '', '', ''], // Auckland, 321Cap
                'Remuera / SH1 Munzee Art': ['RemueraSH1MunzeeArt', 'rckq1mp5r/16.2', '', '', ''], // Auckland, 321Cap
                'Virtual Kiwi': ['VirtualKiwi', 'rckq3ry2v/16.1', '', '', ''], // Auckland
                'Western Park Scatter': ['WesternParkScatter', 'rckq2ddet/16.2', '', '', ''] // Auckland
            },
            'Norway': {
                'Kongsvinger Rainbow': ['KongsvingerRainbow', 'u68w3j7ku/15.7', '', '', ''], // [*]
                'Norwegian Dog Breeds': ['NorwegianDogBreeds', 'u4x2gjyed/15.5', '', '', ''],
                'Purple Dream': ['PurpleDream', 'u68tgxqzh/15.5', '', '', ''],
                'Super Mushroom': ['SuperMushroom', 'ukhm1uzdy/15.3', '', '', '']
            },
            'Poland': {
                '2021 Tweedle-Dee': ['2021TweedleDee', 'u3hb33uwv/16.0', '', '', ''], // Opole
                'Birthday Cake': ['BirthdayCake', 'u2z5jbuze/15.9', '', '', ''],
                'Easter Egg': ['EasterEgg', 'u3h4efqv1/16.0', '', '', ''], // Wrocław
                'Electric': ['Electric', 'u3h4e7pyw/16.0', '', '', ''], // Wrocław
                'Fala': ['Fala', 'u3h4ezk0r/16.0', '', '', ''], // Wrocław
                'Jewel': ['Jewel', 'u3h4u8rfs/16.0', '', '', ''], // Wroclaw
                'Klayman': ['Klayman', 'u2vm6s1uz/15.8', '', '', ''],
                'Minecraft Sword': ['MinecraftSword', 'u357rcyex/15.9', '', '', ''], // Legnica, Grusierp
                'Muzyczne Nutki': ['MuzyczneNutki', 'u357r4tw6/15.9', '', '', ''], // Legnica, Grusierp
                'My World': ['MyWorld', 'u3h4g4ngg/16.0', '', '', ''], // Wrocław, Lumen
                'No i Gitara!': ['NoIGitara', 'u3h4u34bc/16.0', '', '', ''], // Wrocław, Lumen
                'Piernikowa Chatka': ['PiernikowaChatka', 'u357rg2hd/15.9', '', '', ''], // Legnica, Grusierp
                'Pisanka Wielkanocna': ['PisankaWielkanocna', 'u35e21hpm/15.9', '', '', ''], // Legnica, Grusierp
                'Reksio': ['Reksio', 'u3h4fk4fw/15.3', '', '', ''], // Wroclaw
                'Stay at Home': ['StayAtHome', 'u3h4ffh2k/16.0', '', '', ''], // Wrocław
                'W': ['W', 'u3h4ezyqf/16.0', '', '', ''], // Wrocław
                'Welonka': ['Welonka', 'u3h4ese4q/16.0', '', '', ''], // Wrocław, Lumen
                'Wro Tram': ['WroTram', 'u3h4fdu03/16.0', '', '', ''] // Wrocław, Lumen
            },
            'Portugal': {
                '1˚ Madeira Sapphires Twin': ['1MadeiraSapphiresTwin', 'etgcxrry9/16.3', '', '', ''], // Funchal
                'CR7 Airport - Madeira': ['CR7AirportMadeira', 'etu1fr9de/16.3', '', '', ''],
                'High Voltage Madeira Island': ['HighVoltageMadeiraIsland', 'etgcz3tw7/16.3', '', '', ''], // Funchal
                'Largo da Paz': ['LargoDaPaz', 'etgcwykmg/16.5', '', '', ''], // Funchal
                'Madeira Islands Flag': ['MadeiraIslandsFlag', 'etu18mzw6/16.3', '', '', ''],
                'Madeira Monumental': ['MadeiraMonumental', 'etgcwtt9u/16.5', '', '', ''], // Funchal
                'Portinho': ['Portinho', 'etu1c0rbz/16.3', '', '', ''],
                'Saab9x in Madeira': ['Saab9xInMadeira', 'etu1c7ttr/16.3', '', '', ''],
                'Ship `Caniçal`': ['ShipCanical', 'etu472udw/16.5', '', '', '']
            },
            'Serbia': {
                'Japanse Maple': ['JapanseMaple', 'srxw6nrvg/16.4', '', '', ''] // Neloras
            },
            'Slovakia': {
                '1st Day Evo': ['1stDayEvo', 'u2s1v068r/16.1', '', '', ''], // Bratislava, Neloras
                'Agent Sun': ['AgentSun', 'u2s1zptrk/16.1', '', '', ''], // Bratislava
                'Alfred Wetzler Mini Flat': ['AlfredWetzlerMiniFlat', 'u2s1ywfxk/16.0', '', '', ''], // Bratislava, Neloras
                'Alien': ['Alien', 'u2s1v1wd3/15.1', '', '', ''], // Bratislava
                'BB Train': ['BBTrain', 'u2ttk0jmm/16.0', '', '', ''], // kepke3
                'Bike Kolónka': ['BikeKolonka', 'u2trqke30/15.6', '', '', ''], // Vrútky, kepke3
                'Bosnia Flag in Bratislava': ['BosniaFlagInBratislava', 'u2s1yrt3z/16.1', '', '', ''], // Bratislava, Neloras
                'Bratislava': ['Bratislava', 'u2s1v79nt/16.2', '', '', ''], // Bratislava
                'Candle Tombstone': ['CandleTombstone', 'u2s1zhnn4/16.1', '', '', ''], // Bratislava
                'Charge Bratislava': ['ChargeBratislava', 'u2s1vyxmx/16.2', '', '', ''], // Bratislava, Rikitan
                'Chick, Vrútky': ['ChickVrutky', 'u2trqswgh/16.0', '', '', ''], // Vrútky, Mon4ikaCriss
                'Christmas Stable': ['ChristmasStable', 'u2s1uyuvm/15.4', '', '', ''], // Bratislava, Rikitan
                'Crazy Frog': ['CrazyFrog', 'u2trqbknm/16.0', '', '', ''], // Martin, kepke3, Mon4ikaCriss
                'Devín Castle': ['DevinCastle', 'u2s443y3v/16.1', '', '', ''], // Bratislava
                'Edison Light Bulb': ['EdisonLightBulb', 'u2trqkz7x/16.0', '', '', ''], // Vrútky
                'Electric (Letters)': ['ElectricLetters', 'u2s45fecu/16.0', '', '', ''], // Bratislava
                'Evo Flower Bratislava': ['EvoFlowerBratislava', 'u2s1vsd96/16.1', '', '', ''], // Bratislava
                'Flora Orientalis in Ždiar': ['FloraOrientalisInZdiar', 'u2y2m191d/16.0', '', '', ''], // kepke3
                'Hexagons of Vrutky': ['HexagonsOfVrutky', 'u2trqsut8/16.0', '', '', ''], // Vrútky, Rikitan
                'Le Petit Prince': ['LePetitPrince', 'u2s1yxmhk/15.8', '', '', ''], // Bratislava, Rikitan
                'Little Owl in Rožňava': ['LittleOwlInRoznava', 'u2wsg4kkz/16.1', '', '', ''], // kepke3
                'QRate Opener DNV': ['QRateOpenerDNV', 'u2s46fprf/16.0', '', '', ''],
                'Shisha BazHookah': ['ShishaBazHookah', 'u2s1ykf3k/15.9', '', '', ''], // Bratislava
                'Space Invader Prievidza': ['SpaceInvaderPrievidza', 'u2tjrpt60/16.0', '', '', ''],
                'Srdce pre Moni': ['SrdcePreMoni', 'u2trn9u68/16.0', '', '', ''], // Martin
                'The Owlet Bubolet': ['TheOwletBubolet', 'u2tx23vx9/16.0', '', '', ''],
                'Train Martin': ['TrainMartin', 'u2trn7vez/15.7', '', '', ''], // Martin, kepke3
                'Virtual Joy': ['VirtualJoy', 'u2s45g9ze/16.0', '', '', ''] // Bratislava
            },
//            'Spain': {
//            },
            'Sweden': {
                'Crossbow Sundfiske': ['CrossbowSundfiske', 'u6ert806w/15.7', '', '', ''],
                'Stroopwafel invasion in Götenborg': ['StroopwafelInvasionInGotenborg', 'u60ryyzf8/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Sunny Sala`s Sensational Silver Owl': ['SunnySalasSensationalSilverOwl', 'u6eucsndb/15.8', '', '', ''],
                'Swedish Flag': ['SwedishFlag', 'u6sce88js/15.7', '', '', ''],
                'Zeecret, Arboga': ['ZeecretArboga', 'u6e601wu6/15.6', '', '', '']
            },
            'United Kingdom': {
                'Alyn Waters Easter MiniEgg': ['AlynWatersEasterMiniEgg', 'gcmy5cst8/15.9', '', '', ''],
                'Ashford Variety': ['AshfordVariety', 'u10dgtvx7/16.1', '', '', ''],
                'Balloch Ice Cream': ['BallochIceCream', 'gcuwx7r78/15.9', '', '', ''],
                'Boba Fett Halifax': ['BobaFettHalifax', 'gcw9t3gcu/15.7', '', '', ''], // [push]
                'Bonfire': ['Bonfire', 'gcn22p1cr/16.0', '', '', ''],
                'Bournemouth Beach huts!': ['BournemouthBeachHuts', 'gcn8w32ez/15.9', '', '', ''], // Bournemouth, BonnieB1
                'Brockenhurst Topaz': ['BrockenhurstTopaz', 'gcnchhmp0/16.0', '', '', ''],
                'Canterbury Victoria Park': ['CanterburyVictoriaPark', 'u10g8prc0/16.0', '', '', ''],
                'Cazmo`s celebration garden': ['CazmosCelebrationGarden', 'gcqp3evbc/16.0', '', '', ''],
                'Chalk Reef Scuba Diver': ['ChalkReefScubaDiver', 'u12vhuhmb/15.7', '', '', ''],
                'Cherry Lane Cemetery - Cross Garden': ['CherryLaneCemetery-CrossGarden', 'gcpsvygmw/16.2', '', '', ''], // London, Peter1980
                'Christmas Gingerbread Man': ['ChristmasGingerbreadMan', 'u12gkvmdg/16.0', '', '', ''],
                'Cromer England Snowman': ['CromerEnglandSnowman', 'u12vjewup/16.0', '', '', ''], // Cromer
                'Cromer Jewel Triangle': ['CromerJewelTriangle', 'u12vhczs4/15.9', '', '', ''], // Cromer
                'Cromers Gingerbread Man': ['CromersGingerbreadMan', 'u12vjk6d6/16.0', '', '', ''], // Cromer, Waves117
                'CuppaCazmo': ['CuppaCazmo', 'gcqp37e4w/16.0', '', '', ''], // BonnieB1
                'Denver Windmill': ['DenverWindmill', 'u1270tyw4/16.0', '', '', ''],
                'Devon Flag': ['DevonFlag', 'gbvn7jjnr/15.7', '', '', ''],
                'Every Colour': ['EveryColour', 'u134rt8cr/16.0', '', '', ''], // Lowestoft
                'Evo Plus Garden': ['EvoPlusGarden', 'u10j3w0hv/16.0', '', '', ''], // London
                'Evolution Flower': ['EvolutionFlower', 'gcptn1qdm/15.9', '', '', ''], // London
                'Evolution Rainbow': ['EvolutionRainbow', 'gcpsvzrbd/16.0', '', '', ''], // London
                'Evolution Strip': ['EvolutionStrip', 'gcpsys5xc/15.5', '', '', ''], // London, Peter1980
                'Faversham Crossbow': ['FavershamCrossbow', 'u10eukvbt/16.0', '', '', ''], // Maattmoo
                'Faversham Father Xmas': ['FavershamFatherXmas', 'u10eumg3f/16.4', '', '', ''], // Maattmoo
                'FlatFlying': ['FlatFlying', 'gcp1856s3/16.0', '', '', ''], // BonnieB1
                'FlatsHideNSeek': ['FlatsHideNSeek', 'gcn8wmup6/15.9', '', '', ''], // Bournemouth, BonnieB1
                'FlatSledding!': ['FlatSledding', 'gcn8uzjcb/16.0', '', '', ''], // BonnieB1
                'Geckos on Parade': ['GeckosOnParade', 'u1232bsvc/15.3', '', '', ''],
                'Greenman': ['Greenman', 'gcn8vp8ek/16.0', '', '', ''],
                'Griff Memorial': ['GriffMemorial', 'gbyr8kfy6/15.3', '', '', ''], // topic (memorial)
                'Hayes Rainbow': ['HayesRainbow', 'gcpsyqekv/16.1', '', '', ''], // London, Peter1980
                'Heathrow Airport Kingfisher': ['HeathrowAirportKingfisher', 'gcpsydds3/16.0', '', '', ''], // London, Peter1980
                'Heathrow Crossbow Arrow': ['HeathrowCrossbowArrow', 'gcpsyt1y9/15.5', '', '', ''], // London, Peter1980
                'Hendon Circle': ['HendonCircle', 'gcpv7n9j7/16.2', '', '', ''], // London
                'In Memory of Pam': ['InMemoryOfPam', 'u12gt4cyv/16.0', '', '', ''],
                'January Garden 2022': ['JanuaryGarden2022', 'u10dghyg5/16.3', '', '', ''],
                'Kenny in South Park': ['KennyInSouthPark', 'gcqrw1dm1/15.8', '', '', ''],
                'Kent Queen`s Crown': ['KentQueensCrown', 'u10k2vf4s/16.0', '', '', ''],
                'Lost Jellyfish in Bournemouth': ['LostJellyfishInBournemouth', 'gcn8w3x64/15.8', '', '', ''], // Bournemouth, BonnieB1
                'Lost Turtle in Ferndown': ['LostTurtleInFerndown', 'gcn9j1kg4/16.0', '', '', ''], // BonnieB1
                'Maattmoo`s Moo': ['MaattmoosMoo', 'u10s42d6w/16.0', '', '', ''], // Maattmoo
                'MiniPortal3': ['MiniPortal3', 'gcn8t1y5g/16.0', '', '', ''], // Bournemouth, BonnieB1
                'Monk Stray Monk': ['MonkStrayMonk', 'gcx5pc4u3/15.7', '', '', ''],
                'More Beach Huts': ['MoreBeachHuts', 'gcn8x8fw5/16.0', '', '', ''], // Bournemouth, BonnieB1
                'Naomi`s Sloth': ['NaomisSloth', 'u134rjr6e/16.0', '', '', ''], // Lowestoft
                'Nipper': ['Nipper', 'gcptn245e/16.0', '', '', ''], // London, Peter1980
                'NVG': ['NVG', 'u134rx46d/16.0', '', '', ''], // Lowestoft
                'Ohio Flag': ['OhioFlagLondon', 'gcpstztrd/16.0', '', '', ''], // London, tpics (Buckeye`s European Invasion)
                'Pastebucket Memorial': ['PastebucketMemorial', 'gcrmvk8te/15.1', '', '', ''], // BenandJules
                'Percy the Penguin visits the Seaside': ['PercyThePenguinVisitsTheSeaside', 'u12vj96p3/14.8', '', '', ''], // Cromer
                'Pompey': ['Pompey', 'gcp2bnhbz/15.7', '', '', ''], // BonnieB1
                'Queen`s baton': ['QueensBaton', 'u10uq9cxd/15.9', '', '', ''],
                'Rainbow Heart': ['RainbowHeart', 'u10gb0m7r/15.7', '', '', ''],
                'Rainbow Unicorn': ['RainbowUnicorn', 'gcqrw8mth/15.8', '', '', ''],
                'Retro Bunzee': ['RetroBunzee', 'u1270rj7d/16.0', '', '', ''],
                'RIP Queen Elizabeth II Crown': ['RIPQueenElizabethIICrown', 'gcpsf5c85/15.7', '', '', ''],
                'Romsey Rainbow': ['RomseyRainbow', 'gcnfn417u/16.0', '', '', ''], // Romsey
                'Romsey Rainbow Unicorn': ['RomseyRainbowUnicorn', 'gcnfnmn82/16.0', '', '', ''], // Romsey
                'Rosemary Buchanan': ['RosemaryBuchanan', 'gcndwvnnp/16.0', '', '', ''],
                'Rule Britannia Arrow': ['RuleBritanniaArrow', 'gcpvhqm6w/16.0', '', '', ''], // London
                'Sailing Boat': ['SailingBoat', 'u10j6x1kx/15.1', '', '', ''], // London
                'Shades Garden': ['ShadesGarden', 'gcpsvv5fn/16.0', '', '', ''], // London
                'Stroopwafel invasion in Bedford': ['StroopwafelInvasionInBedford', 'gcr8mrunx/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Plympton': ['StroopwafelInvasionInPlympton', 'gbvnevyqm/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Sunny Rainbow': ['SunnyRainbow', 'u10s19euj/16.0', '', '', ''], // Maattmoo
                'The Bunny Fields': ['TheBunnyFields', 'gcpsyn7wf/15.8', '', '', ''], // London, Peter1980
                'Union Jack': ['UnionJack', 'gcpsvs5k3/16.0', '', '', ''], // London, Peter1980
                'West London Jewel': ['WestLondonJewel', 'gcpsywswp/16.1', '', '', ''], // London, Peter1980
                'WinterSolstice': ['WinterSolstice', 'gcn9hbuf4/15.4', '', '', ''], // BonnieB1
                'Worstead for Norkie': ['WorsteadForNorkie', 'u13h20y1n/16.0', '', '', ''],
                'Yelverton Rover': ['YelvertonRover', 'gbvp4z6kd/15.7', '', '', ''],
                'Yoda visits Downham Market': ['YodaVisitsDownhamMarket', 'u1272bryh/16.0', '', '', '']
            },
            'USA': {
                '2nd Annual CuriosiTea Party x 2': ['2ndAnnualCuriosiTeaParty2', 'dp2wschgs/16.0', '', '', ''], // [push]
                '80`s Cube': ['80sCube', '9zqz5kqsw/16.0', '', '', ''], // Marion, rodrico101
                '9 Mile': ['9Mile', '9yzg2dt8r/16.2', '', '', ''],
                'A Bunny Rabbit': ['ABunnyRabbit', 'dpehhgy4c/16.0', '', '', ''],
                'A Decatur Valentine': ['ADecaturValentine', 'dp0epenzc/16.1', '', '', ''],
                'A Grand Rapids Valentine': ['AGrandRapidsValentine', 'dpehj7med/16.0', '', '', ''],
                'A Moo Cow': ['AMooCow', 'dpehj5yg3/16.2', '', '', ''],
                'Acorn Mini': ['AcornMini', '9yzse6tf8/16.2', '', '', ''], // Saint Charles
                'Affton Horse': ['AfftonHorse', '9yzg21rxs/16.2', '', '', ''],
                'Apple Mini': ['AppleMini', '9yzse4pep/16.2', '', '', ''], // Saint Charles
                'Apple Valley - Evolutionary Flower': ['AppleValley-EvolutionaryFlower', '9zvwqtjtx/15.6', '', '', ''], // Apple Valley, squirreledaway
                'April Showers': ['AprilShowers', 'cbj83kzvd/15.5', '', '', ''], // geomatrix
                'Archdale Butterfly': ['ArchdaleButterfly', 'dnrhk1vkf/16.1', '', '', ''],
                'Arizona Cactus': ['ArizonaCactus', '9w0223h6h/16.2', '', '', ''], // BonnieB1
                'Autumn Moon': ['AutumnMoon', '9yzserg07/16.2', '', '', ''], // Saint Charles
                'Autumn Tree': ['AutumnTree', '9yzse63z5/16.2', '', '', ''], // Saint Charles, topic (Tree in seasons)
                'B52': ['B52', 'djn1vhq1m/15.9', '', '', ''], // Orlando
                'Baby Groot!': ['BabyGroot', '9vf6qxdkf/16.3', '', '', ''], // [push], Weatherford, denali0407
                'Baby Yoda Loves Munzee Mania 2020': ['BabyYodaLovesMunzeeMania2020', '9zvwm7nt6/16.0', '', '', ''], // Apple Valley
                'Bevo Mill': ['BevoMill', '9yzg3zu2y/16.2', '', '', ''], // Saint Louis
                'Birdhouse': ['Birdhouse', '9yzdzxgvz/16.2', '', '', ''], // Concord
                'Birdhouse`s Goldfinch': ['BirdhousesGoldfinch', '9yzep3hy1/16.2', '', '', ''], // Concord
                'Birthday Clown': ['BirthdayClown', '9zvz80ycg/16.0', '', '', ''], // Saint Paul
                'Black Cat': ['BlackCat', '9yuwp8m1z/16.2', '', '', ''], // Kansas City
                'Blossom Mini': ['BlossomMini', '9yzsdfxk2/16.2', '', '', ''], // Saint Peters
                'Bobby the Zombie': ['BobbyTheZombie', 'cbjb28d2h/15.9', '', '', ''], // Brandikorte
                'Bohrer Park': ['BohrerPark', '9yzepurxg/16.2', '', '', ''], // Concord
                'Bowlero Laser Tag': ['BowleroLaserTag', '9yzs8z8k3/16.2', '', '', ''], // O’Fallon
                'Bowling Bash': ['BowlingBash', '9zfzsg1dq/16.2', '', '', ''], // Watertown
                'Bread Co': ['BreadCo', '9yzeqd37q/16.2', '', '', ''],
                'Bundtini Trail': ['BundtiniTrail', '9vf6q2m4e/16.2', '', '', ''], // Weatherford, knotmunz
                'Burger': ['Burger', '9zvwdxwy6/16.0', '', '', ''], // Savage
                'Burlington Flamingo': ['BurlingtonFlamingo', 'dnrmnmz0r/15.7', '', '', ''], // Burlington
                'Calvary or Cedar Lawn Cemetery': ['CalvaryOrCedarLawnCemetery', 'dr728vn7g/14.8', '', '', ''],
                'Campfire': ['Campfire', '9yzsg564x/16.2', '', '', ''], // Saint Peters
                'Camping at the Lake': ['CampingAtTheLake', '9yzsfgngt/16.2', '', '', ''], // Saint Peters
                'Candy Cane Lane': ['CandyCaneLane', '9yzg90fud/16.2', '', '', ''], // Saint Louis
                'CandyCaneZee': ['CandyCaneZee', 'dp88ztvgz/16.3', '', '', ''],
                'Cardinals': ['Cardinals', '9yzgewdcn/16.2', '', '', ''], // Saint Louis
                'Catapult Pit': ['CatapultPit', '9zfzqxujb/16.0', '', '', ''], // Watertown
                'CCTX ZeeCret': ['CCTXZeeCret', '9ufv85zsj/16.4', '', '', ''],
                'Cedar Rapids Barnyard': ['CedarRapidsBarnyard', '9zqy6qe13/16.3', '', '', ''], // Cedar Rapids, rodrico101
                'Cherry Bomb, Amesbury': ['CherryBomb', 'drte9zeq3/16.0', '', '', ''], // Amesbury
                'Cherry Bomb, Cedar Rapids': ['CherryBombCedarRapids', '9zqyb0gm4/16.1', '', '', ''], // Cedar Rapids, rodrico101
                'Cherry Mini': ['CherryMini', '9yzse56kh/16.2', '', '', ''], // Saint Peters
                'Chickadee': ['Chickadee', '9yzep8yfh/16.1', '', '', ''], // Concord
                'Cinco de Mayo Taco': ['CincoDeMayoTaco', '9yzku1q8s/16.2', '', '', ''],
                'Christmas in Webster Groves': ['ChristmasInWebsterGroves', '9yzg82gvn/16.2', '', '', ''],
                'Christmas Sleigh': ['ChristmasSleigh', '9yzss9srx/16.2', '', '', ''], // Saint Charles
                'Christmas Snowman': ['ChristmasSnowman', '9zvxjdffs/16.3', '', '', ''], // Bloomington, geomatrix
                'Christmas Tree': ['ChristmasTree', '9zvzfs0pz/15.8', '', '', ''],
                'Christmas Wreath': ['ChristmasWreath', '9zvwqwvbs/16.3', '', '', ''], // Apple Valley
                'Chuck E Cheese Pizza': ['ChuckECheesePizza', '9yzss5rpx/16.2', '', '', ''], // Saint Charles
                'Color, St. Peters': ['ColorStPeters', '9yzsd7947/16.2', '', '', ''], // Saint Peters
                'Commerce Barnyard': ['CommerceBarnyard', 'dnhdug6cs/15.7', '', '', ''], // tlmeadowlark
                'Como Evo Flowers': ['ComoEvoFlowers', '9zvzb5fqd/16.3', '', '', ''], // Saint Paul, geomatrix
                'Concord Hearts': ['ConcordHearts', '9yzg0jgfv/16.1', '', '', ''], // Concord
                'Cornucopia': ['Cornucopia', '9yzg9um8k/16.1', '', '', ''], // Saint Louis
                'Cottleville Dragonfly': ['CottlevilleDragonfly', '9yzs2qnqb/16.2', '', '', ''], // Cottleville
                'Cottleville Post': ['CottlevillePost', '9yzs3jkzp/16.1', '', '', ''], // Cottleville
                'Cowtown': ['Cowtown', '9vff88tju/15.9', '', '', ''], // Fort Worth, Brandikorte
                'CR Air Mystery Trail': ['CRAirMysteryTrail', '9zqz461u7/15.7', '', '', ''], // Cedar Rapids, rodrico101
                'CR April': ['CRApril', '9zqy6tdmm/16.3', '', '', ''], // Cedar Rapids, rodrico101
                'CR Egyptian Zodiac': ['CREgyptianZodiac', '9zqy9vbz4/16.1', '', '', ''], // Cedar Rapids, rodrico101
                'CR Electric Mystery': ['CRElectricMystery', '9zqy9w1zy/16.3', '', '', ''], // Cedar Rapids
                'CR Farmer`s Field': ['CRFarmersField', '9zqy6mwek/16.0', '', '', ''], // Cedar Rapids, rodrico101
                'CR Feather': ['CRFeather', '9zqydmwhp/15.9', '', '', ''], // Cedar Rapids, rodrico101
                'CR Flat Matt Loves Baseball': ['CRFlatMattLovesBaseball', '9zqyfm0r7/16.3', '', '', ''], // Cedar Rapids, rodrico101
                'CR Holiday Pizza': ['CRHolidayPizza', '9zqy8y2d6/16.1', '', '', ''], // Cedar Rapids, rodrico101
                'CR Honor Cross': ['CRHonorCross', '9zqy9whw6/16.0', '', '', ''], // Cedar Rapids, rodrico101
                'CR Jones Park Birthday 7': ['CRJonesParkBirthday7', '9zqydku0v/16.3', '', '', ''], // [push], Cedar Rapids, rodrico101
                'CR Jones Park Birthday 7 (Flats)': ['CRJonesParkBirthday7Flats', '9zqydku0v/16.3009', '', '', ''], // [push], Cedar Rapids, rodrico101
                'CR Munzee 6th Birthday': ['CRMunzee6thBirthday', '9zqyctfv9/16.0', '', '', ''], // Cedar Rapids, rodrico101
                'CR MunzFit 2.0': ['CRMunzFit20', '9zqz1svxg/16.2', '', '', ''], // Cedar Rapids
                'CR Muscle Car': ['CRMuscleCar', '9zqy6kzhw/16.3', '', '', ''], // Cedar Rapids, rodrico101
                'CR Rose': ['CRRose', '9zqyc08tb/15.6', '', '', ''], // Cedar Rapids, rodrico101
                'CR Safari': ['CRSafari', '9zqy6tnvg/16.3', '', '', ''], // Cedar Rapids, rodrico101
                'CR Submarine': ['CRSubmarine', '9zqy6mkwx/16.3', '', '', ''], // Cedar Rapids, rodrico101
                'CR Vegetable': ['CRVegetable', '9zqy6q5vz/16.3', '', '', ''], // Cedar Rapids, rodrico101
                'Cresting Wave at Sunset': ['CrestingWaveAtSunset', 'djn1qk695/16.3', '', '', ''], // Orlando
                'Crossbow Shield': ['CrossbowShield', 'djn4kj9j2/16.2', '', '', ''], // [push], Orlando
                'Crossbow Shield (Flats)': ['CrossbowShieldFlats', 'djn4kj9j2/16.2009', '', '', ''], // [push], Orlando
                'Crossbow, Orlando': ['CrossbowOrlando', 'djn1vtf6d/16.3', '', '', ''], // Orlando
                'Daisy Chain': ['DaisyChain', '9yzsdqwqc/16.0', '', '', ''], // Saint Peters
                'Decatur Bait Patch': ['DecaturBaitPatch', 'dp0drxy9t/16.2', '', '', ''], // Decatur
                'Decatur Cornucopia': ['DecaturCornucopia', 'dp0drqzps/16.2', '', '', ''], // Decatur
                'Decatur Farm': ['DecaturFarm', 'dp0dx9q1p/16.2', '', '', ''], // Decatur
                'Decatur Hearts': ['DecaturHearts', 'dp0dxenc6/16.4', '', '', ''], // Decatur
                'Dorothy to the Emerald': ['DorothyToTheEmerald', '9zvwy826s/15.7', '', '', ''],
                'Dropping the f-bomb on this blasted virus': ['DroppingTheFbombOnThisBlastedVirus', '9vf6nvgj6/16.2', '', '', ''], // Weatherford
                'Duluth Anchor': ['DuluthAnchor', 'cbqd308e5/16.0', '', '', ''],
                'Eagles v. Patriots': ['EaglesVPatriots', '9zvxy0jfp/15.6', '', '', ''], // Minneapolis
                'Eeyore': ['Eeyore', 'djn45tq21/15.5', '', '', ''],
                'Ellis Creek Owl': ['EllisCreekOwl', '9vf6wcht4/16.4', '', '', ''], // [push], Weatherford, denali0407
                'Emoji': ['Emoji', '9zvwzm81g/16.0', '', '', ''],
                'Evo Hedgehog': ['EvoHedgehog', '9vffcpcfg/16.3', '', '', ''], // Fort Worth
                'F-Bomb - Cedar Rapids': ['FBombCedarRapids', '9zqy9z1s5/15.9', '', '', ''], // Cedar Rapids, topic (F-Bomb)
                'F-Bomb - McKinney': ['FBombMcKinney', '9vghxt5yq/15.9', '', '', ''], // McKinney, topic (F-Bomb)
                'F-Bomb - Tampa': ['FBombTampa', 'djj2j8ht8/15.9', '', '', ''], // topic (F-Bomb)
                'Flaming Jalapeño Popper': ['FlamingJalapenoPopper', '9vfdmfyjp/16.0', '', '', ''],
                'Flat Dog Bone': ['FlatDogBone', '9yzser03w/16.1', '', '', ''], // Saint Charles
                'Flat Friends': ['FlatFriends', '9yzse5st1/16.2', '', '', ''], // Saint Charles
                'Flat Lou in St Lou': ['FlatLouInStLou', '9yzsk2db8/16.0', '', '', ''], // [push]
                'Flat Rob Birthday': ['FlatRobBirthday', '9zqyctk1k/15.7', '', '', ''], // Cedar Rapids, rodrico101
                'Folkston Tomahawk': ['FolkstonTomahawk', 'djmxmysxv/16.0', '', '', ''],
                'Fort Worth Succulents': ['FortWorthSucculents', '9vff272ph/16.3', '', '', ''], // Fort Worth
                'Frankie Martin`s Food Truck - Hot Dog': ['FrankieMartinsFoodTruckHotDog', '9yzs3jum0/16.2', '', '', ''], // Cottleville
                'Frankie Martin`s Food Truck - Ice Cream': ['FrankieMartinsFoodTruckIceCream', '9yzs3jg6s/16.2', '', '', ''], // Cottleville
                'Frankie Martin`s Food Truck - Mug': ['FrankieMartinsFoodTruckMug', '9yzs3jsju/16.2', '', '', ''], // Cottleville
                'Frankie Martin`s Food Truck - Pizza': ['FrankieMartinsFoodTruckPizza', '9yzs3juf5/16.2', '', '', ''], // Cottleville
                'Friendship': ['Friendship', '9yzku9nfk/16.0', '', '', ''],
                'Friendship Fli Hi Brewery': ['FriendshipFliHiBrewery', '9yzmh23dv/16.1', '', '', ''],
                'Frisco Park': ['FriscoPark', 'dn8008h4k/16.2', '', '', ''],
                'Frisco Train': ['FriscoTrain', '9yzerz82b/16.2', '', '', ''], // Webster Groves
                'G Bypass Mixed': ['GBypassMixed', 'dngce1ppv/15.1', '', '', ''], // [push], Georgetown
                'G Candy Cane': ['GCandyCane', 'dngch37ny/16.1', '', '', ''], // [push]
                'G Cardinal (Flats)': ['GCardinalFlat', 'dngcs0epy/16.0009', '', '', ''], // [push], Georgetown
                'G Harmony': ['GHarmony', 'dngc5yuwh/16.3', '', '', ''], // [push], Georgetown
                'G Jewel Belt': ['GJewelBelt', 'dngc74908/15.0', '', '', ''], // [push], Georgetown
                'G Pumpkin': ['GPumpkin', 'dngce8yzz/16.2', '', '', ''], // [push], Georgetown
                'G Shamrock': ['GShamrock', 'dngckpu1t/16.2', '', '', ''], // [push], Georgetown
                'G Toyota': ['GToyota', 'dngcs2y4b/15.8', '', '', ''], // [push], Georgetown
                'Garden Girl': ['GardenGirl', '9vf6wcgyj/16.2', '', '', ''], // Weatherford
                'Gentle Doctor Animals': ['GentleDoctorAnimals', '9yzs2p2g6/16.2', '', '', ''], // O’Fallon
                'Geowoodstock 2019': ['Geowoodstock2019', '9vff24s1z/15.6', '', '', ''], // Fort Worth
                'Gift of Life': ['GiftOfLife', '9yzseje93/16.2', '', '', ''], // Saint Charles
                'Gingerbread Man - Edina': ['GingerbreadMan_Edina', '9zvxhphvg/15.6', '', '', ''],
                'Gingerbread Man - Walkertown': ['GingerbreadMan', 'dnrjb0hqv/16.3', '', '', ''],
                'Golden Carrot Rabbit': ['GoldenCarrotRabbit', '9yzse0729/16.0', '', '', ''], // Saint Peters
                'Grand Rapids Color': ['GrandRapidsColor', 'dpehkx2pp/16.2', '', '', ''],
                'Grand Rapids Cornucopia': ['GrandRapidsCornucopia', 'dpehhx00n/16.1', '', '', ''],
                'Grand Rapids Flats and Weapons': ['GrandRapidsFlatsAndWeapons', 'dpehs7h6c/16.2', '', '', ''], // [push]
                'Grand Rapids Flats and Weapons (Flats)': ['GrandRapidsFlatsAndWeaponsFlats', 'dpehs7h6c/16.2009', '', '', ''], // [push]
                'Green SpyFrog': ['GreenSpyFrog', 'djf8je247/16.1', '', '', ''], // Montgomery, tlmeadowlark
                'Greenville Clover Leaf': ['GreenvilleCloverLeaf', 'dp5u4gsgr/16.2', '', '', ''], // Greenville
                'Greenville Flamingo Feather': ['GreenvilleFlamingoFeather', 'dp5u6cvzq/16.1', '', '', ''], // Greenville
                'Greenville Green Wave': ['GreenvilleGreenWave', 'dp5u47vck/16.2', '', '', ''], // Greenville
                'Greenville Zodiac Wheels': ['GreenvilleZodiacWheels', 'dp5u4ruez/16.1', '', '', ''], // Greenville
                'Greenville`s Amethyst Road': ['GreenvillesAmethystRoad', 'dp5u4wnun/16.2', '', '', ''], // Greenville
                'Gumball Machine': ['GumballMachine', 'dhvx4dbwu/16.2', '', '', ''], // PlantCity
                'GV Esperanza Rainbow': ['GVEsperanzaRainbow', '9t9j639hh/16.3', '', '', ''],
                'GV Transportation Evo': ['GVTransportationEvo', '9t9j60ntr/16.3', '', '', ''],
                'H Owl oween': ['HOwlOween', 'dr4g92jyg/16.1', '', '', ''],
                'Halloween': ['Halloween', '9yzsg8k4g/16.2', '', '', ''], // Saint Charles
                'Happy Kraut Memorial': ['HappyKrautMemorial', '9yzs3t7ge/16.2', '', '', ''], // Saint Peters
                'Hayes Battlefield': ['HayesBattlefield', '9zqydntth/16.2', '', '', ''], // Cedar Rapids
                'Heart Crossbows': ['HeartCrossbows', '9zvxxuuu3/14.7', '', '', ''], // Saint Paul, geomatrix
                'Heart of St. Charles': ['HeartOfStCharles', '9yzsscd8m/16.2', '', '', ''], // Saint Charles
                'Heavy Smoke BBQ': ['HeavySmokeBBQ', '9yzsdz07k/16.2', '', '', ''], // Saint Peters
                'Hey Cup Cake!': ['HeyCupCake', '9vf6qdvv2/16.2', '', '', ''], // Weatherford, knotmunz
                'Hiawatha Crossbows': ['HiawathaCrossbows', '9zvxwmgw4/16.0', '', '', ''], //Minneapolis, geomatrix
                'Horsing Around Aggieland': ['HorsingAroundAggieland', '9v7qp5ne1/16.3', '', '', ''],
                'Hotel Evo': ['HotelEvo', '9zqy6k6uy/16.4', '', '', ''], // Cedar Rapids, rodrico101
                'Hutchinson Snowflake': ['HutchinsonSnowflake', '9zuzkev75/16.0', '', '', ''],
                'Ice Cream Eagan': ['IceCreamEagan', '9zvxpct2h/16.3', '', '', ''],
                'Ikea chair': ['IkeaChair', '9yzgf3q0f/16.2', '', '', ''], // Saint Louis
                'Iowa Goldfinch': ['IowaGoldfinch', '9zqyb3kzv/16.0', '', '', ''], // Cedar Rapids, rodrico101
                'It`s Still Bread Co!': ['ItsStillBreadCo', '9yzem0n2n/16.2', '', '', ''],
                'Jack-O & ZEEacula': ['JackOZEEacula', '9zvxx1c0y/16.0', '', '', ''], // Minneapolis, geomatrix
                'Jacob L Loose Park': ['JacobLLoosePark', '9yuwp3nk2/16.0', '', '', ''], // Kansas City
                'Jewel of a Heart': ['JewelOfAHeart', '9vf6q7snp/16.4', '', '', ''], // Weatherford, knotmunz
                'Jewels at BBGH': ['JewelsAtBBGH', '9xqze55tv/15.1', '', '', ''], // [push]
                'Jewels at BBGH (Flats)': ['JewelsAtBBGHFlats', '9xqze55tv/15.1009', '', '', ''], // [push]
                'Jimmy Beagle': ['JimmyBeagle', '9yzs9xw9j/16.2', '', '', ''], // Saint Peters
                'Jordan J': ['JordanJ', '9zvqj15c7/16.0', '', '', ''],
                'Julbock': ['Julbock', '9v6tc48md/16.3', '', '', ''], // BonnieB1, knotmunz
                'Kauffman Legacy Park Quilt': ['KauffmanLegacyParkQuilt', '9yuwpfuxt/16.0', '', '', ''], // Kansas City
                'KC American Flag': ['KCAmericanFlag', '9yutzgzxn/15.7', '', '', ''], // Kansas City
                'KC Egyptian Zodiac (Expanded)': ['KCEgyptianZodiacExpanded', '9yuwpc9wb/16.3', '', '', ''], // Kansas City
                'KC Night Lights #1': ['KCNightLights1', '9yuwp35ek/16.3', '', '', ''], // Kansas City, topic (KC Night Lights)
                'KC Night Lights #2': ['KCNightLights2', '9yuttgdt6/16.3', '', '', ''], // topic (KC Night Lights)
                'KC Night Lights #3': ['KCNightLights3', '9yutzxumv/16.3', '', '', ''], // Kansas City, topic (KC Night Lights)
                'KC Night Lights #4': ['KCNightLights4', '9yutvf65z/16.3', '', '', ''], // topic (KC Night Lights)
                'KC Night Lights #5': ['KCNightLights5', '9yuvbt02e/16.3', '', '', ''], // Kansas City, topic (KC Night Lights)
                'Kirkwood Anchor': ['KirkwoodAnchor', '9yzerj220/16.2', '', '', ''], // Kirkwood
                'Kirkwood vs Webster Groves': ['KirkwoodVsWebsterGroves', '9yzermbkx/16.2', '', '', ''],
                'Kirkwood, Evolutions - 6': ['KirkwoodEvolutions6', '9yzew8k2u/16.0', '', '', ''], // Kirkwood
                'Koopa Shell': ['KoopaShell', '9yte7d5dm/16.3', '', '', ''], // [push]
                'Lake Nona Cowbell': ['LakeNonaCowbell', 'djn1rhdwf/16.0', '', '', ''], // Orlando
                'Lake Nona Longhorn': ['LakeNonaLonghorn', 'djn1qu4p9/16.3', '', '', ''], // Orlando
                'Lakeland Candy Corn': ['LakelandCandyCorn', 'dhvxyb7r1/16.0', '', '', ''], // Lakeland
                'Lakeville`s Sea Turtle': ['LakevillesSeaTurtle', '9zvwq5uf3/15.4', '', '', ''], // [push], squirreledaway
                'Lets Talk A-bundt Love': ['LetsTalkAbundtLove', '9vf6q88ed/16.3', '', '', ''], // Weatherford, knotmunz
                'Lightning Bolt in Sapphire': ['LightningBoltInSapphire', '9zvwq4veb/16.0', '', '', ''], // squirreledaway
                'Log Cabin Quilt': ['LogCabinQuilt', '9yzssgw8q/16.2', '', '', ''], // Saint Charles
                'Long Lake Butterflies': ['LongLakeButterflies', 'cbj8rkf6w/16.0', '', '', ''], // geomatrix
                'Lost Golden Jellyfish': ['LostGoldenJellyfish', '9ymn9pbz6/16.3', '', '', ''], // BonnieB1
                'Lost PBJellyfish in Rogers': ['LostPBJellyfishInRogers', '9ymnbbh19/16.3', '', '', ''], // BonnieB1
                'LRT EVO Train': ['LRTEVOTrain', '9zvz8rvx1/16.0', '', '', ''], // Saint Paul, geomatrix
                'LRT Snowflake': ['LRTSnowflake', '9zvxz44h1/14.9', '', '', ''], // Saint Paul, geomatrix
                'Lubbock Rainbow': ['LubbockRainbow', '9tzx44196/16.3', '', '', ''],
                'Mama T`s ladybug': ['MamaTsLadybug', 'djf8nx300/16.3', '', '', ''], // Montgomery
                'Manhattan KS Frog Pop Up': ['ManhattanKSFrogPopUp', '9ygqfhcr5/16.1', '', '', ''],
                'March Mini': ['MarchMini', '9yzse4fsu/16.2', '', '', ''], // Saint Peters
                'Marion': ['Marion', '9zqz5cxxw/16.0', '', '', ''], // Marion, markayla
                'Marion 4 Leaf Clover': ['Marion4LeafClover', '9zqz5c5fx/16.3', '', '', ''], // Marion, markayla
                'Marshall Mallard!': ['MarshallMallard', '9vf6qwe4e/16.5', '', '', ''], // Weatherford, denali0407
                'Maryland Heights MO RUM': ['MarylandHeightsMORUM', '9yzsjvdwf/16.2', '', '', ''],
                'Mason M': ['MasonM', 'dpefnqz34/16.1', '', '', ''], // [push]
                'Mauhaus': ['Mauhaus', '9yzg8sq7e/16.2', '', '', ''],
                'MaxZee': ['MaxZee', 'cbj972b8f/16.1', '', '', ''],
                'May the 4th Be With You': ['MayThe4thBeWithYou', '9yymeuhrq/16.2', '', '', ''], // Columbia
                'Mermaid Tail': ['MermaidTail', 'dhvqrppwd/15.8', '', '', ''],
                'MHQ Bash4 Casino': ['MHQBash4Casino', '9vgm17mhu/16.1', '', '', ''], //McKinney
                'MHQ V4 Pin': ['MHQV4Pin', '9vgkbvept/16.3', '', '', ''], // McKinney
                'Mini Snowflake 2': ['MiniSnowflake2', '9yzsdf25h/16.2', '', '', ''], // Saint Peters
                'Minion': ['Minion', '9zvwtc1re/16.1', '', '', ''],
                'MiniPortal4': ['MiniPortal4', 'dngc7gdxv/16.3', '', '', ''], // Georgetown, BonnieB1
                'Minnesota': ['Minnesota', '9zvxqwvpp/14.1', '', '', ''], // Minneapolis
                'Minnesota `M`': ['MinnesotaM', '9zvx4j90x/16.0', '', '', ''],
                'Minnesota Moose': ['MinnesotaMoose', '9zvxqxry4/16.0', '', '', ''], // Minneapolis, geomatrix
                'Missouri Bluebird': ['MissouriBluebird', '9yzdzvcr7/16.2', '', '', ''],
                'MOA Dwarf Leprechaun': ['MOADwarfLeprechaun', '9zvxn73ke/15.9', '', '', ''], // Bloomington, geomatrix
                'MOA Electric Monster': ['MOAElectricMonster', '9zvxn51xy/16.3', '', '', ''], // Bloomington, geomatrix
                'MOA Flower': ['MOAFlower', '9zvxjgnp0/16.3', '', '', ''], // Bloomington, geomatrix
                'MOA MN Crossbow': ['MOAMNCrossbow', '9zvxn5bhq/15.9', '', '', ''], // Bloomington
                'MOA Nutcracker': ['MOANutcracker', '9zvxnhr2r/15.9', '', '', ''], // Bloomington, geomatrix
                'MOA Penguin': ['MOAPenguin', '9zvxn5vvf/15.9', '', '', ''], // Bloomington, geomatrix
                'MOA Yeti': ['MOAYeti', '9zvxjuwtm/16.1', '', '', ''], // Bloomington, geomatrix
                'Montgomery baseball': ['MontgomeryBaseball', 'djf8hp7k0/16.4', '', '', ''], // [push], Montgomery
                'Mother`s Day Basket': ['MothersDayBasket', '9yzsdnv17/16.1', '', '', ''], // Saint Peters
                'Mothers Day Flower Pot': ['MothersDayFlowerPot', '9yzsetr9v/16.2', '', '', ''], // Saint Charles
                'Munzee 10': ['Munzee10', '9yzg26h7d/16.2', '', '', ''],
                'Munzee 11': ['Munzee11', '9yzg8bwjs/16.1', '', '', ''], // Saint Louis
                'Munzee Logo History': ['MunzeeLogoHistory', '9vgkbt4m4/16.3', '', '', ''], // McKinney
                'Munzee Madness MVM`s': ['MunzeeMadnessMVMs', '9qh0y5eyz/15.7', '', '', ''],
                'Munzee X': ['MunzeeX', 'dqctz2pgz/16.2', '', '', ''],
                'Munzee`s X birthday': ['MunzeesXBirthday', 'cbjb40uyp/16.1', '', '', ''], // geomatrix
                'Mushroombuilding': ['Mushroombuilding', 'cbhbw08rh/16.0', '', '', ''],
                'Nob Hill Fish Tank': ['NobHillFishTank', '9yzsdg9sm/16.2', '', '', ''], // Saint Peters
                'Noelridge Mystery': ['NoelridgeMystery', '9zqz432fm/16.0', '', '', ''], // [push], Cedar Rapids, rodrico101
                'Noelridge Mystery (Flats)': ['NoelridgeMysteryFlats', '9zqz432fm/16.0009', '', '', ''], // [push], Cedar Rapids, rodrico101
                'Nona SirPrizewheel': ['NonaSirPrizewheel', 'djn1qsg15/14.0', '', '', ''], // Orlando
                'nyisutter bday': ['NyisutterBday', '9yzsemrcz/16.1', '', '', ''], // Saint Charles
                'O`Fallon Soccer': ['OFallonSoccer', '9yzs2hm65/16.2', '', '', ''], // O’Fallon
                'October Pumpkin': ['OctoberPumpkin', 'dqctwugjz/16.3', '', '', ''], // HiTechMD
                'Overland Car': ['OverlandCar', '9yzspfdcb/16.2', '', '', ''],
                'Pecan Mini': ['PecanMini', '9yzsdfrjc/16.2', '', '', ''], // Saint Peters
                'Pi Day 2022': ['PiDay2022', '9yzerqq4b/16.2', '', '', ''], // Webster Groves
                'Pi Day 2023': ['PiDay2023', '9yzsdfu0q/16.2', '', '', ''], // Saint Peters
                'Pi Day Pie': ['PiDayPie', '9yzssh333/16.2', '', '', ''], // Saint Charles
                'Picasso Rob': ['PicassoRob', '9yuwpepc9/16.3', '', '', ''], // Kansas City
                'Pieces Meeple': ['PiecesMeeple', '9yzgekym8/16.2', '', '', ''], // Saint Louis
                'Pikachu Lake Eola': ['PikachuLakeEola', 'djn4khqqz/15.9', '', '', ''], // Orlando
                'Pirate Axe': ['PirateAxe', '9yzssnpud/16.2', '', '', ''], // Saint Charles
                'Pirate Couch Potato Patch': ['PirateCouchPotatoPatch', '9yzg871rx/16.2', '', '', ''],
                'Pirate Crossbow': ['PirateCrossbow', '9yzsu639f/16.2', '', '', ''], // Saint Charles
                'Pirate Longsword': ['PirateLongsword', '9yzsu2d5k/16.2', '', '', ''], // Saint Charles
                'Pirate`s Cannon': ['PiratesCannon', '9yzsu8ku4/16.1', '', '', ''], // Saint Charles
                'Pirate`s Rum': ['PiratesRum', '9yzssr8dc/16.2', '', '', ''], // Saint Charles
                'Pirates Flag': ['PiratesFlag', '9vgkbbfrx/16.3', '', '', ''], // McKinney
                'Pizza': ['Pizza', '9zvwf8p7n/16.0', '', '', ''], // Savage
                'Pizza on the Hill': ['PizzaOnTheHill', '9yzg9wjq0/16.2', '', '', ''], // Saint Louis
                'Pokeball Lake Eola': ['PokeballLakeEola', 'djn4khrxq/15.9', '', '', ''], // Orlando
                'Prize Wheel': ['PrizeWheel', '9vfdq473e/16.3', '', '', ''],
                'Pumpkin Spice Owl': ['PumpkinSpiceOwl', '9vf6ppgy2/16.5', '', '', ''], // [push], Weatherford, denali0407
                'Pumpkin Spice Owl (Flats)': ['PumpkinSpiceOwlFlats', '9vf6ppgy2/16.5009', '', '', ''], // [push], Weatherford, denali0407
                'R2-D2': ['R2D2', '9zvwqnkce/16.0', '', '', ''], // Apple Valley
                'Reindeer in Kentucky': ['ReindeerInKentucky', 'dngckqfgd/16.3', '', '', ''], // Georgetown, BonnieB1
                'Research Hospital': ['ResearchHospital', '9yuvbm846/15.8', '', '', ''], // Kansas City
                'Ring': ['Ring', '9yzkxz5qh/16.2', '', '', ''], // O’Fallon
                'RockingHorse in Ohio': ['RockingHorseInOhio', 'dp5u4cvsd/16.2', '', '', ''], // BonnieB1
                'Rosesquirrel': ['Rosesquirrel', '9yzse7m02/16.2', '', '', ''], // Saint Charles
                'Rosesquirrel`s Autism Puzzle Piece': ['RosesquirrelsAutismPuzzlePiece', '9yzse5kyt/16.2', '', '', ''], // Saint Charles
                'Saint Mary`s Heart': ['SaintMarysHeart', 'dp5u68q9p/16.1', '', '', ''], // Greenville
                'Santa Sir Prize': ['SantaSirPrize', 'cbjb5sy15/15.6', '', '', ''],
                'Schaefer Park Bugs': ['SchaeferParkBugs', '9yzs7qfvt/16.2', '', '', ''], // Saint Charles
                'Schildberg`s Duck Walk': ['SchildbergsDuckWalk', '9zk7tgc0t/15.9', '', '', ''],
                'Seahorse by the SeaShore': ['SeahorseByTheSeaShore', 'dj3shdv4f/16.2', '', '', ''], // tlmeadowlark
                'Shamrock`s Mug': ['ShamrocksMug', '9yzs9t776/16.2', '', '', ''], // Saint Peters
                'Shaw`s Garden Rose': ['ShawsGardenRose', '9yzgdjbu1/16.0', '', '', ''], // Saint Louis
                'Shrewsbury Night Vision Goggles': ['ShrewsburyNightVisionGoggles', '9yzg89gbv/16.2', '', '', ''],
                'Simpsons Donut': ['SimpsonsDonut', '9zvww043h/15.4', '', '', ''],
                'Snowflake': ['Snowflake', '9yzsdf8e1/16.2', '', '', ''], // Saint Peters
                'Snowman - West Galloway': ['Snowman', 'dqcutr567/16.3', '', '', ''], // HiTechMD
                'Snowman - Saint Peters': ['SnowmanSaintPeters', '9yzsdcgz9/16.2', '', '', ''], // Saint Peters
                'Snoopy': ['Snoopy', '9zvwdyxm6/15.8', '', '', ''], // Savage
                'South County Christmas Tree': ['SouthCountyChristmasTree', '9yzdzmbdj/16.2', '', '', ''],
                'Spongy Memorial': ['SpongyMemorial', '9yzen3dve/16.2', '', '', ''], // topic (memorial)
                'Spring Cherry Blossom': ['SpringCherryBlossom', '9yzse53wq/16.2', '', '', ''], // Saint Peters
                'Spring Tree': ['SpringTree', '9yzse4bfp/16.2', '', '', ''], // Saint Peters, topic (Tree)
                'Spy Glass': ['SpyGlass', 'dnrmhsuv8/16.0', '', '', ''],
                'Spy Train': ['SpyTrain', 'dpehs3s8e/16.1', '', '', ''],
                'St. Charles Anchor': ['StCharlesAnchor', '9yzsss1ws/16.2', '', '', ''], // Saint Charles
                'St. Louis Airplane': ['StLouisAirplane', '9yzsrkdby/16.1', '', '', ''],
                'St. Louis Cardinals O`Fallon': ['StLouisCardinalsOFallon', '9yzs8x3g8/16.2', '', '', ''], // O’Fallon
                'St. Louis Christmas Stocking': ['StLouisChristmasStocking', '9yzs9zjbq/16.2', '', '', ''], // Saint Peters
                'St. Louis Flamingo': ['StLouisFlamingo', '9yzg34cq3/16.2', '', '', ''],
                'St. Louis Parrot': ['StLouisParrot', '9yzssztbj/16.2', '', '', ''], // Saint Charles
                'St. Louis Robin': ['StLouisRobin', '9yzdzrdv0/16.1', '', '', ''], // Concord
                'St. Mary`s Battleground Weapon': ['StMarysBattlegroundWeapon', '9zvxtcg21/16.0', '', '', ''], // Minneapolis
                'St. Paul Shamrock': ['StPaulShamrock', '9zvz9m4w8/15.7', '', '', ''], // Saint Paul, geomatrix
                'St. Peters Chess': ['StPetersChess', '9yzs9p60c/16.2', '', '', ''], // O’Fallon
                'St. Peters NVG': ['StPetersNVG', '9yzs8v6bn/16.1', '', '', ''], // Saint Peters
                'Stacy Park Flower': ['StacyParkFlower', '9yzezpc7r/16.2', '', '', ''],
                'StL Flat Rob (Flats)': ['StLFlatRobFlats', '9yzsdvgr3/16.0009', '', '', ''], // [push], Saint Peters
                'Stormtrooper, Anaheim': ['Stormtrooper', '9qh0k2zvk/15.7', '', '', ''], // Anaheim
                'Stormtrooper, Savage': ['StormtrooperSavage', '9zvwdyw64/15.6', '', '', ''], // Savage
                'Stroopwafel invasion in Desert Lodge': ['StroopwafelInvasionInDesertLodge', '9mvkbt7mw/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Escondido': ['StroopwafelInvasionInEscondido', '9musx254q/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Glen Oaks': ['StroopwafelInvasionInGlenOaks', '9mufvb1e5/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in MHQ': ['StroopwafelInvasionInMHQ', '9vgkbm7fn/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Raleigh': ['StroopwafelInvasionInRaleigh', 'dnrfx480t/16.3', '', '', ''], // topic (Stroopwafel invasion)
                'Summer Sun': ['SummerSun', '9yzsdcnv1/16.2', '', '', ''], // Saint Peters
                'Summer Tree': ['SummerTree', '9yzsdc5rv/16.1', '', '', ''], // Saint Peters, topic (Tree in seasons)
                'Super Bowl LII': ['SuperBowlLII', '9zvxy0n58/16.0', '', '', ''], // Minneapolis, geomatrix
                'SuperChucker Shield': ['SuperChuckerShield', '9zvwdtx7f/16.1', '', '', ''], // Savage
                'Swon': ['Swon', '9yzexbq14/16.2', '', '', ''], // Webster Groves
                'Sybergs Shark': ['SybergsShark', '9yzg3hn9j/16.2', '', '', ''], // Saint Louis
                'Tattooed Dog': ['TattooedDog', '9yzku2pkx/16.2', '', '', ''],
                'Texas Geowoodstock ~ 2019': ['TexasGeowoodstock2019', '9vfdmb7wb/15.7', '', '', ''], // [push]
                'Texas Golden Ticket': ['TexasGoldenTicket', '9vfdhhkk9/16.3', '', '', ''], // [push], Fort Worth, denali0407
                'Texas State Flag': ['TexasStateFlag', '9vfdq1jxx/16.0', '', '', ''],
                'Thank you Truckers!': ['ThankYouTruckers', '9yzkxr91v/16.2', '', '', ''], // O’Fallon
                'The Apple Valley Apple': ['TheAppleValleyApple', '9zvwrj4rs/16.3', '', '', ''], // Apple Valley, squirreledaway
                'The Lucky Fungi': ['TheLuckyFungi', 'djf8kbee5/16.3', '', '', ''], // Montgomery, tlmeadowlark
                'The Round Rock… of Round Rock': ['TheRoundRockOfRoundRock', '9v6tdk2ch/16.2', '', '', ''],
                'Thomas Park Flats': ['ThomasParkFlats', '9zqz57639/16.3', '', '', ''], // Marion, rodrico101
                'Tiemeyer Patch': ['TiemeyerPatch', '9yzsr0eyr/16.2', '', '', ''],
                'Tower Grove Park': ['TowerGrovePark', '9yzgd7v6g/16.2', '', '', ''], // Saint Louis
                'Tucson Jewel - PCC West': ['TucsonJewelPCCWest', '9t9p3fb13/15.1', '', '', ''], // [push]
                'Tucson Jewel - PCC West (Flats)': ['TucsonJewelPCCWestFlats', '9t9p3fb13/15.1009', '', '', ''], // [push]
                'Tulip': ['Tulip', '9zvqj7tzx/16.0', '', '', ''],
                'Turtle Park': ['TurtlePark', '9yzgc2dz5/16.2', '', '', ''], // Saint Louis
                'Twin Cities Snowman': ['TwinCitiesSnowman', '9zvww0pfz/15.2', '', '', ''], // Apple Valley
                'Uncut Diamond': ['UncutDiamond', '9vf6wbvcj/16.4', '', '', ''], // [push], Weatherford, denali0407
                'Uncut Diamond (Flats)': ['UncutDiamondFlats', '9vf6wbvcj/16.4009', '', '', ''], // [push], Weatherford, denali0407
                'Valentine Heart Cape Canaveral': ['ValentineHeartCapeCanaveral', 'djn9mz3s4/16.7', '', '', ''],
                'Vanderbilt Puppy': ['VanderbiltPuppy', '9yzsdjm1y/16.2', '', '', ''], // Saint Peters
                'Walkie Talkie Watch': ['WalkieTalkieWatch', '9yzs8td5m/16.1', '', '', ''], // O’Fallon
                'Walpelhorst Horse': ['WalpelhorstHorse', '9yzse9910/16.2', '', '', ''], // Saint Charles
                'Warrior Spear': ['WarriorSpear', '9yzssp84g/16.2', '', '', ''], // Saint Charles
                'Watertown Shammy': ['WatertownShammy', '9zfzw2yck/15.8', '', '', ''], // Watertown
                'Weatherford Emerald Square': ['WeatherfordEmeraldSquare', '9vf6q4zrb/16.3', '', '', ''], // Weatherford, Brandikorte
                'Weatherford St. Patrick`s Owl': ['WeatherfordStPatricksOwl', '9vf6q0md5/16.4', '', '', ''], // Weatherford, denali0407
                'Weatherford Xmas Owl': ['WeatherfordXmasOwl', '9vf6qfj00/16.3', '', '', ''], // Weatherford, denali0407
                'Webster Groves Statesmen': ['WebsterGrovesStatesmen', '9yzg80e80/16.2', '', '', ''], // Webster Groves
                'Weldon Spring Nuclear Waste': ['WeldonSpringNuclearWaste', '9yzkpkruw/16.3', '', '', ''],
                'West Covina California Frog': ['WestCovinaCaliforniaFrog', '9qh1u4k4p/16.1', '', '', ''],
                'Westport Specials': ['WestportSpecials', '9yzsjvkn7/16.3', '', '', ''],
                'White Castle Valentine': ['WhiteCastleValentine', '9yzeqgbyc/16.2', '', '', ''], // Kirkwood
                'Wichita Flag': ['WichitaFlag', '9ydysevbz/15.9', '', '', ''],
                'Winter Cardinal Feather': ['WinterCardinalFeather', '9yzsdcxnq/16.0', '', '', ''], // Saint Peters
                'Winter Dead Branch': ['WinterDeadBranch', '9yzsdc906/16.2', '', '', ''], // Saint Peters
                'Winter Olympics 2018': ['WinterOlympics2018', '9zvwqqu74/16.2', '', '', ''], // Apple Valley
                'Winter Tree': ['WinterTree', '9yzsdf0b7/16.2', '', '', ''], // Saint Peters, topic (Tree in seasons)
                'Witch Hat': ['WitchHat', '9zvxyf7hg/16.0', '', '', ''], // Minneapolis
                'WYMM': ['WYMM', '9yzgdhpf0/16.0', '', '', ''], // Saint Louis
                'XII Birthday Fish Garden Hedge': ['XIIBirthdayFishGardenHedge', '9zvxzc3wj/15.6', '', '', ''], // Saint Paul, geomatrix
                'Yankton Ice Cream': ['YanktonIceCream', '9zdezvx58/16.1', '', '', ''],
                'Z Briefcase': ['ZBriefcase', '9yzs8jtyc/16.1', '', '', ''], // O’Fallon
                'ZeeOps': ['ZeeOps', '9yzs8pe34/16.0', '', '', ''], // O’Fallon
                'ZeeSpy Hat': ['ZeeSpyHat', '9yzs8r9db/16.0', '', '', ''] // O’Fallon
            }
        },
        'empty spots': {
            'Australia': {
                'Adelaide Wizard': ['AdelaideWizard', 'r1f88fnzf/16.1', '1y4CODTqesKPAV6Fjm5yS3cQigk3AocBE1vJK8JTasO8', '', ''], // Adelaide
                'Adelaide`s Butterfly': ['AdelaidesButterfly', 'r1f93ykp3/16.1', '1Aja8OGPlEDNzkFHecJbfZTTHyLpn4jEQm4bUfgSCTYI', '', ''], // Adelaide
                'Arthur Seat Tower': ['ArthurSeatTower', 'r1pjdn6fn/15.0', '1EYXPfBZ3KRWHcQ_knyxWwMeuSWclS8oRV8kv5Qmm8ko', '', ''], // Melbourne
                'Aussie BOOM!erang': ['AussieBOOMerang', 'r1r14c0pk/14.1', '1Tfl9TljQFcy6Xd2biYAHWQwqLvnyl-MSoHC4eEXk9ZI', '', ''], // Melbourne
                'Australian Captial Territory': ['AustralianCaptialTerritory', 'r3dp3xcg6/16.0', '1o45NhX-LD3uQUUnMBF2BKT21T3xZydYHfvBTNQIDyfU', '', ''],
                'Australian Flag': ['AustralianFlag', 'r3gx2vp7r/15.7', '1seAyy_nkniGuKzGZxPG282hqyOKNPEX7kOXo_SP7dCc', '', ''], // Sydney
                'Ballarat Gold Rush 1851': ['BallaratGoldRush1851', 'r1q63xq4u/15.6', '1bYK35_8ylx08Vw9FkRfYlAF9RLHREdNHn4kx7bBbqQw', '', ''],
                'Bayswater Boa': ['BayswaterBoa', 'qd66munz4/15.6', '1MLs_ztQCjYYCwnr-Lw5X6IxvFLgkPyZ8faKm6m2w5V8', '', ''],
                'Boxing Kangaroo': ['BoxingKangaroo', 'r1r1kx9yr/14.7', '1dKhYKFBRxiTybwFlioKS6sNa6z1I77b_9W7KKMikWrE', '', ''], // Melbourne
                'Breast Cancer Network of Australia Logo': ['BreastCancerNetworkOfAustraliaLogo', 'r1r1hy6zj/15.5', '1m1nxcl_e0kw3TR_E_WKAfDCvjJ3Q5KVWS0U-f_c-ULc', '', ''], // Melbourne
                'Brisbane': ['Brisbane', 'r7hg9wruj/14.9', '1kZaHTAKIsFnzcdTZCw13KaPLWwYWB_QEBmS19-HdapQ', '', ''], // Brisbane
                'Camp Freez': ['CampFreez', 'r1pr61317/14.1', '1gyGjG7h4rS34hlYomsfLDZtG-b9M_jI_WT-ZFDPjnUA', '', ''], // Melbourne
                'Cranbourne Softball': ['CranbourneSoftball', 'r1pr6810e/16.3', '1NZo1NI8Y3OsT1i-T2zhZaB7sc2QJGNlRCCLsVnZpHvE', '', ''], // Melbourne
                'Ellenbrook ROYG': ['EllenbrookROYG', 'qd67nypxv/16.0', '11w6haBUb06cmibs5ikOJZ5yl11H_Hmp7yWejJTK6ssc', '', ''],
                'Evolutionary Camp sign': ['EvolutionaryCampSign', 'r1pr9w1zc/16.1', '1JEljtiVnSoT-dmdZ60XnoCIQe-Kcjd3H3-e6nctOdVg/edit#gid=1620937488&range=A1', '', ''], // Melbourne
                'Evolutionary Caravan': ['EvolutionaryCaravan', 'r1pr9e9y8/16.1', '1JEljtiVnSoT-dmdZ60XnoCIQe-Kcjd3H3-e6nctOdVg/edit#gid=55938854&range=A1', '', ''], // Melbourne
                'Evolutionary Ducky': ['EvolutionaryDucky', 'r1pr9sc0p/15.8', '1yg2dkXsfPltexsK9CMZOivmWgdZLf2G6igc_fxtCuOk', '', ''], // Melbourne
                'Evolutionary Envelope': ['EvolutionaryEnvelope', 'r1pr9kmuj/15.7', '1ImGTAk2AWozGajcx0mDg21SMew627ASbOBb-RgHD5E0', '', ''], // Melbourne
                'Evolutionary Fish': ['EvolutionaryFish', 'r1pr9txcj/16.1', '1JEljtiVnSoT-dmdZ60XnoCIQe-Kcjd3H3-e6nctOdVg/edit#gid=928262580&range=A1', '', ''], // Melbourne
                'Evolutionary Sea Horse': ['EvolutionarySeaHorse', 'r1pr9m57g/16.2', '1JEljtiVnSoT-dmdZ60XnoCIQe-Kcjd3H3-e6nctOdVg/edit#gid=19787765&range=A1', '', ''], // Melbourne
                'First of Many South Australia Event': ['FirstOfManySouthAustraliaEvent', 'r1f91z7z2/16.0', '1wOmBY41Gwnw_MKtpv4kN2s3rYg4fxtI8r-HMavbe2o0', '', ''], // Adelaide
                'Flat Rob and Flatt Matt at Lilydale Lake': ['FlatRobAndFlattMattAtLilydaleLake', 'r1r35sct9/15.3', '', '', ''], // Melbourne
                'Flat Rob Berwick': ['FlatRobBerwick', 'r1prdxwtr/15.8', '1H0IvTf6fJGSfBY6q8YgRYxdRoRpacz07euV9MnVJWqA/edit#gid=333255779&range=A1', '', ''], // [push], Melbourne
                'Flat Rob Berwick (Flats)': ['FlatRobBerwickFlats', 'r1prdxwtr/15.8009', '1H0IvTf6fJGSfBY6q8YgRYxdRoRpacz07euV9MnVJWqA/edit#gid=1448661812&range=A1', '', ''], // [push], Melbourne
                'Freddo Faces': ['FreddoFaces', 'r1prcsnq9/15.9', '1TvlpMX61-h_kzLwxOmDxg9rsck8LXuw1DiQqzCZ16Hw', '', ''], // Melbourne
                'Fremantle Dockers Emblem': ['FremantleDockersEmblem', 'qd63hpz2j/15.7', '1MkbrebtthxetN6wU0C4_FBRPN-b88_Hdy4iWjpMu5ME', '', ''],
                'Gatton Arrows - Arrow2': ['GattonArrowsArrow2', 'r7h71r6gq/16.0', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=2054923152&range=A1:G1', '', ''], // Gatton, BonnieB1, ChandaBelle
                'Gatton Arrows - Arrow3': ['GattonArrowsArrow3', 'r7h71q6jx/16.0', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=560099315&range=A1:G1', '', ''], // Gatton, BonnieB1, ChandaBelle
                'Gatton Arrows - Arrow4': ['GattonArrowsArrow4', 'r7h71k8tr/16.0', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1844433261&range=A1:G1', '', ''], // [push], Gatton, BonnieB1, ChandaBelle
                'Gatton Arrows - Arrow5': ['GattonArrowsArrow5', 'r7h71k8m5/16.0', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1661210718&range=A1:G1', '', ''], // [push], Gatton, BonnieB1, ChandaBelle
                'Gold Coast 2018 Commonwealth Games': ['GoldCoast2018CommonwealthGames', 'r7j09vhbv/16.3', '1EHMTPnWwFhLBue2Z3d4fQRnqFMXshs7jDyoeCCq5z0U', '', ''], // BonnieB1
                'Hampton Park Jelly Fish': ['HamptonParkJellyFish', 'r1pr9q51t/15.8', '1ry91Bx5Hq2ZFFe9Gwxbp48pgsRU3_41DsAeTg0hhyjw', '', ''], // Melbourne
                'Kelmscott Western Australia Farm': ['KelmscottWesternAustraliaFarm', 'qd6920kq8/16.0', '1b5SPa6gGXIedLkoc6mz_ihCVSB9TG1nt6kOmjyAVSJU', '', ''],
                'Leprechaun hat': ['LeprechaunHat', 'r1f803307/16.0', '1rwAWiGr8XtRL9lMBMHBuBfEQ2AJgx9A9EaW6XP9fYic', '', ''], // Adelaide
                'Maleny Trees': ['MalenyTrees', 'r7hxy0v52/16.4', '1OsjsaLbsUzhMr-LYGkwSkAonbqr8xZJd89ppLJjomDc', '', ''], // BonnieB1
                'Melbourne Mystery Heart': ['MelbourneMysteryHeart', 'r1r142pez/15.9', '1Rt3thckTanpKtvHL3GwM1FDgGYmTot1RR3LNObv-Kvw', '', ''], // Melbourne
                'Mount Gambier Heart': ['MountGambierHeart', 'r1k0g1e3k/16.0', '1HJQpsRGmFrUTchesTPYknkoXAYYvlszeJH7V5TKA7_c', '', ''],
                'Mulgrave Amethysts': ['MulgraveAmethysts', 'r1r20nv7k/14.0', '1-bbl8B58Fwk6ZUZCjdlHwdrru-nMhXex2d2lNAzjHm4', '', ''], // Melbourne
                'Munzee Pin': ['MunzeePin', 'r1r07ke9r/15.9', '1tEP0N1XGjntMrz2qQNQaaQ3OQd696LIm3evbB79IV1Y', '', ''], // Melbourne
                'Mystery Wagga': ['MysteryWagga', 'r3bb1wgqx/16.0', '0Asv9Bpwt_1P4dGJHOWxJaVFkUDZtY0VhVXpWc2FoMEE', '', ''],
                'MysteryPerth V1.0': ['MysteryPerthV10', 'qd66hxpc5/16.8', '15SAaulgyEKTWw2q83CcTjo2IcGQ2Ss8bUi0-P04rrHo', '', ''],
                'Newcastle`s First': ['NewcastlesFirst', 'r65utksz5/16.3', '1_kWJOZhx51Dcj4vetDHVKY52t3Lzd3sq4q3As7N2kkA', '', ''],
                'Onkaparinga Crab': ['OnkaparingaCrab', 'r1dryzzp1/16.0', '1X7m9bjQshuTPEiPGaPpunJ_hxJUxzeIngMfeLOzzgYU', '', ''], // Adelaide
                'Perth': ['Perth', 'qd66hgdqv/15.4', '1heSOa2RG4WkzySStotjTT9NcnAc3DbH19CDd6e0K1IY', '', ''],
                'Phillip Island Penguins': ['PhillipIslandPenguins', 'r1pkg1ct7/14.1', '14ldk4xgUzj6shIVi4qYibdCGgFFWqxga-CVVhfQIVHw', '', ''],
                'Place of Many Crows - Crow 1': ['PlaceOfManyCrowsCrow1', 'r38zcvsxt/15.6', '1tbNJWAvuGxROLjktkRlkSKwrhrFxpTMa3Rjjt1zSdRw/edit#gid=0&range=A4', '', ''],
                'Pot of gold': ['PotOfGold', 'r1f801ztg/16.0', '1rwAWiGr8XtRL9lMBMHBuBfEQ2AJgx9A9EaW6XP9fYic', '', ''], // Adelaide
                'QLD Perm-Temp': ['QLDPerm-Temp', 'r7hu62k18/16.4', '1i5EvqfN3JXc-fe_ufgWJSt_0WXvgNZQOOeHILhl7I9o', '', ''], // Brisbane, BonnieB1
                'Queens Gambit - Horse': ['QueensGambit-Horse', 'r1prds3cr/16.3', '1k1SRlj7s8EVc2h7UZqIxmwh0d_4DZnljIW5mLDbi-sk', '', ''], // Melbourne
                'Rivergum Creek Reserve Evolutions': ['RivergumCreekReserveEvolutions', 'r1pr9ezes/15.5', '1w4Dr3PcdZDya6poBr30pniEvWw1-z0Xp43IQjKJfPOs', '', ''], // Melbourne
                'Sapphire of Lynbrook': ['SapphireOfLynbrook', 'r1pr90vxq/14.6', '19y13jN0cvu5aq2vMzP9DZlpAKEmhOCP6vlE4K0neLcc', '', ''], // Melbourne
                'Scoresby Easter Egg': ['ScoresbyEasterEgg', 'r1r22v2gv/16.3', '1mRrf6PhFYIWW_-sVaUKoCdSLuST4ARpWCwqer3r5aY4', '', ''], // Melbourne
                'Shell Harbour Logo': ['ShellHarbourLogo', 'r3g72zv7q/15.8', '10z1VKz2jQOzV8cT6kMWzLElQD_bdwSI5_u490xGuDLk', '', ''],
                'Stroopwafel invasion in Dapto': ['StroopwafelInvasionInDapto', 'r3g5z9k30/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Kelmscott': ['StroopwafelInvasionInKelmscott', 'qd63rd421/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Norlane': ['StroopwafelInvasionInNorlane', 'r1nxks295/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Wonthaggi': ['StroopwafelInvasionInWonthaggi', 'r1ps2ge1w/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Sydney Swans FC Guernsey': ['SydneySwansFCGuernsey', 'r3gx1q2y2/16.0', '1Je3g3HwzEdMElut80We8GUNcZH-inLREJjGdFRMjinM', '', ''], // Sydney
                'Tasmanian Prawn': ['TasmanianPrawn', 'r22u177u3/16.0', '111zfmTcn_eBbllRcZktzt5VlpRlDA8TGeZrYDZuU51k', '', ''],
                'The Australian Santa Clause (St. Nick)': ['TheAustralianSantaClauseStNick', 'r1pr7p148/15.2', '19uTRzwZ8HVyBAQEbGlbFwUXnlrAA_qoJUNxZO6rDIJk', '', ''], // Melbourne
                'Toowoomba Rose': ['ToowoombaRose', 'r7h5324hk/16.2', '1B2jF7OTxhp1yDCHcSdObhojuaUejO5GqVRW_7pC32xA', '', ''], // BonnieB1
                'Tour Down Under': ['TourDownUnder', 'r1dx8mjsf/15.3', '10MsleOyp7WE2Lk9uQ5unCbXVE6dMe6gbi1aAvsws8oQ', '', ''],
                'TwoBeeOrKnot?': ['TwoBeeOrKnot', 'r7h6gcrmm/16.1', '1QeWV421cytXf8r6XdxlbS1e3RPpuramAhrUmm4jkcSk', '', ''], // Laidley, BonnieB1
                'Unicorn Munzee': ['UnicornMunzee', 'r1nxsuy5s/15.8', '1tawi8UVL89P96tvRmQSFZEfiG0Hb4ATjbRRnLMl1T9c', '', ''],
                'Vegemite': ['Vegemite', 'r1r07ufj4/15.8', '', '', ''], // Melbourne
                'Welcome to Perth': ['WelcomeToPerth', 'qd66huzh2/15.7', '1OOy-B3kO_TsKQ3Tihl139fswP8Amw7fRA5dov63roHY/edit#gid=1513530787&range=A1:P1', '', ''],
                'West Coast Eagles': ['WestCoastEagles', 'qd624ef1w/15.9', '1ZwCQL6OBOkM9QJ_qkPkp9puFRMmyPGT8IycMkZCTEWc', '', ''],
                'Windang Whale': ['WindangWhale', 'r3g78bxdy/16.3', '17Vc7Q5tuzDmM2tSFhvomMomRlRZww5cmEpYyxmvUqpA', '', ''],
                'Winnie the Pooh Bear': ['WinnieThePoohBear', 'r1r1ktq9x/15.7', '172li9iyt9NjJu7dIQ0tkZLBVkxpUI5nozBww92O0ugI', '', ''], // Melbourne
                'Wollongong Violin': ['WollongongViolin', 'r3gk1e1ck/16.3', '1UfqHwGcNe6YyHNbBJVSHh8vN3uiuc_kZJYtsZ3mdm7Y', '', ''],
                'You`re a Star': ['YoureAStar', 'qd69bvq0m/16.0', '1OBu00mOYyB7sUz2d37bvH9E5WC1xZIh1vElMm0rLJ-o', '', '']
            },
            'Austria': {
                'Frauenkirchen Owl': ['FrauenkirchenOwl', 'u2s01hxq5/16.2', '1RCbwcIi0P_x0x9GZhbu5bHcpUT-3U230-flKMCVL9gw', '', ''],
            },
            'Belgium': {
                'Knokke-Heist': ['KnokkeHeist', 'u14k4sk02/16.0', '126NrDWA4M1YhK5yVTAMWLnJwCI2FA_CIfVr1AqO1_SU', '', '']
            },
            'Bosnia Herzegovina': {
                'Panonska Jezera Tuzla': ['PanonskaJezeraTuzla', 'srvm35ezk/16.4', '1sfoLteib7UBRWSjfHjg5SQNn-DCy8U7Df5SkjNhZn30', '', ''] // Neloras
            },
            'Canada': {
                'C-AL-M Scarborough': ['CALMScarborough', 'dpz8v19k2/15.5', '1l_gCM6LeiJu6BLl1Ao5RqJtAlXKuFHhPr7hA9O-xK3I', '', ''],
                'Dinosaur Park': ['DinosaurPark', 'dpwhwg9ts/15.7', '1axqpbKHhhIXGifpEfRZ-do7_B84IVepwyMg3HrvNg0Y', '', ''],
                'Doolin`s Temp Virtual Hourglass': ['DoolinsTempVirtualHourglass', 'dpzcvm16r/16.0', '1L8GmPUgYoUw6xvgtyLSIXsE5SNF4ahU7zTf0Uj1_jv0', '', ''],
                'Fabulous February Fete Heart': ['FabulousFebruaryFeteHeart', 'c2b2phnvx/16.0', '1CbvRTggg1yDZZJDyZatJJXEzGkJijqzL_4LvGvhnQGc', '', ''], // [push], Vancouver
                'Fabulous February Fete (Flats)': ['FabulousFebruaryFeteFlat', 'c2b2phnvx/16.0009', '1CbvRTggg1yDZZJDyZatJJXEzGkJijqzL_4LvGvhnQGc', '', ''], // [push], Vancouver
                'Feb 2023 Heart Garden': ['Feb2023HeartGarden', 'c2b82cefg/16.0', '1dSoK55XEka6eqa1bqi5p0hsszJJanugy-haDVuR3MG0', '', ''], // Vancouver
                'Gatineau Evo': ['GatineauEvo', 'f244tv1bn/15.7', '1GMUAllJKdyGX7RDygJhAuUJBTcwR7eAUN0oiIf8eLOM', '', ''],
                'Gatineau FMG Garden': ['GatineauFMGGarden', 'f244tegjx/15.7', '1IwYqjgl1xdhpmaYYTaeK0FVts5eX3HOTQgrmjH-mnxs', '', ''],
                'Kits Beach Rubber Ball': ['KitsBeachRubberBall', 'c2b2md7xf/16.0', '1scgbKOetRFMELGRkfVxnjRDBY9sVXGc6UhZWUPcrRlo', '', ''], // Vancouver
                'Mario': ['Mario', 'c342ktpxw/16.0', '1s9EftQ87Mq2jb7blXSYrFeBx0PsLSO5OPpQfBCxoY-g', '', ''],
                'Mario Cart': ['MarioCart', 'c29p2x1nw/15.8', '1a-0IvUbD_NWrjPF088LhJb4XVw9DM41q9OaU961YL-w', '', ''],
                'Montreal Logo at Vendome': ['MontrealLogoAtVendome', 'f25dsywwc/16.0', '181HleJPn_HOSDvek40VwO7Yreuiys-RxWXOeYAjodKo', '', ''],
                'Mushroom': ['Mushroom', 'c342ksxyb/16.0', '1tT-dKqi3_Ucn6ExOh-1FIWWBJoM7wHBIT-CvSh90Lt4', '', ''],
                'NuPeterland': ['NuPeterland', 'cbfgwknce/16.0', '1549S43NhkKW03KHTLUcU0aoSv7jqdxmBPitcQ7jROoQ', '', ''],
                'Orca': ['Orca', 'c28qyeuy0/15.8', '19mAuUjab70kUtj4GrTqRQBPjtpPVXZgMJ2IB9fNxnU0', '', ''],
                'Plant': ['Plant', 'c342kugn5/16.0', '1-SiQkVtBbByeBK254p3MyGIHWIpwOQ4yv9038AFqywQ', '', ''],
                'Rover': ['Rover', 'dpwyf68zp/16.0', '1k52o0a6hDANpEEIA7TP302IzI3N9hA21ViPyd4-NjCY', '', ''],
                'Sailboat Rainbow': ['SailboatRainbow', 'dpz82rhb6/16.1', '1SKCEYnsBPcngF10-pXyeC_VgdMivEzoWeBEpBVyWyzA', '', ''],
                'Snoopy': ['Snoopy', 'c9k0twsm1/15.9', '1RqdQBLa84T85fpSY22QnRMfPwor13WQ2tp8vCtWiKL4', '', ''],
                'Stroopwafel invasion in New Westminster': ['StroopwafelInvasionInNewWestminster', 'c28xfy4xj/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Surrey Valentine`s Heart': ['SurreyValentinesHeart', 'c28xy9600/14.8', '1FSxNfq86xDBllNjiV-IMY57RUXzf4JgZY7LbXsdip00', '', ''],
                'The Party Wizard': ['ThePartyWizard', 'dpzf56v3n/15.8', '1_DKoKsFMjKfrZ_-c6q4dMeeB3XNsc54vDG7I4-aRzLc', '', ''],
                'The Road Runner': ['TheRoadRunner', 'dpzcsm48f/16.1', '1YgxHDLAYt57AaYJL9a4BVOdmDJ7NrJdEyGXC1Y1niow', '', ''],
                'Yellow Warbler': ['YellowWarbler', 'dpz8e1rg8/15.3', '1PmmMcBmYhE386DXfsPUX8AhmASgDdTiU8XtAlAPEMB8', '', '']
            },
            'Czechia': {
                'KM ZNAK': ['KMZNAK', 'u2u27hu5m/14.8', '15vaOrWQAsP_lkS2ZP_g8yJvsj2A3ORMQONo04LHeQ_w', '', '']
            },
            'Denmark': {
                'Agriculture Field in Hillerød': ['AgricultureFieldInHilleroed', 'u3by0nen4/15.9', '1u09UO70S-1AcDivV95mBVlLIdSq1c2Q-y_iueM0Z2tU', '', ''], // Hillerød
                'Animal Farm - Hillerød': ['AnimalFarmHilleroed', 'u3by0wys4/16.0', '1NZiz-rgBN3FUepvTGyiNnNMpq2u5OmAnyN_kl5tKDjs', '', ''], // Hillerød
                'Evolution 2019 Hammel': ['Evolution2019Hammel', 'u4p008csn/16.0', '1leD1dhMG_2z695GP0uY7TBx8DT4aAkMxBGObQrPW8uc', '', ''], // Hammel
                'Evolutionpark in Roskilde': ['EvolutionparkInRoskilde', 'u3bse1cwp/15.5', '1CJlbrAfpQh0hdhIMf6RTybGLymYbuXHjVB_xrqHJbyw', '', ''],
                'Favrskov Coat of Arms': ['FavrskovCoatOfArms', 'u4p001y5y/14.9', '1w-93kKMC93WupJ8Mdv2OAYb_EwsuWig07KPPADvkVfg', '', ''], // Hammel
                'FC Midtjylland': ['FCMidtjylland', 'u1yr5xe7p/15.6', '1xdNxBbqRetikpJo7rogSAU5bh3_o_D6OUr1tBo0PUqk', '', ''],
                'Fjer Nykøbing': ['FjerNykobing', 'u38rw3795/14.3', '1O3Gpjuo2NAruz3ls1K91uaF20uwQMo54NTAZKfIOZ9c', '', ''],
                'Ghost in Hilleroed': ['GhostInHilleroed', 'u3bwrbnce/15.5', '1ykKLVDJmjKtjT3xyhTm0iuu4Pbtw3QBzXJPZ6SUU4Qc', '', ''], // Hillerød
                'Isvaffel in Hilleroed': ['IsvaffelInHilleroed', 'u3bwpzm7s/15.6', '1n7ipZpm9CU4BTfyVtRfB5Ib2HmVCGRhU-npq0ZRld30', '', ''], // Hillerød
                'Randers Regnskov': ['RandersRegnskov', 'u4p1hxjdu/15.9', '1vsABF-BXl3GnpCfirs6VI0lN-sPt-Ijb7tTat_gXR7U', '', ''], // MetteS
                'Randers Snowy': ['RandersSnowy', 'u4p1j0qg2/16.0', '1oa0DPVju2G4_YkhAEpgozQQBcRpcTZeVaIUd1FYEtkA', '', ''], // jacobsedk
                'Sonic Randers': ['SonicRanders', 'u4p1kkb66/15.0', '1QisXL5LrGmGIu0eF-jYeIBahVTqFEPj3HAJJFBqGHR8', '', ''], // RUJA
                'Spejdernes Lejr 2022': ['SpejdernesLejr2022', 'u3bsmp537/14.6', '1v8FoOwzY2Q_XtfRaKHfpBG002K7s0mqmHGQ2F96I_Q0', '', ''],
                'The Rainbowwave in Hillested': ['TheRainbowwaveInHillested', 'u38ps1mck/15.6', '1V8qn6Rv3qei2IoABaAIW25Xw9l3Mc1I3G3lRBIn7oKI', '', ''],
                'The Swan in Hillerød': ['TheSwanInHilleroed', 'u3by0pf05/15.2', '1IQB1OpAltjJsAMlrdx3OjwcupfMADu1uGQLMj3a8zPo', '', ''] // Hillerød
            },
            'Finland': {
                'Autumn Maple': ['AutumnMaple', 'u6z79xwt1/15.7', '1seOqnPl7l8KR6oCtQmcf9cO2n0w4F3VjXjBzm-AdIKI', '', ''],
                'BioÖtökkä': ['BioOtokka', 'u6xzu1e7e/15.1', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE', '', ''], // Turku, RePe
                'Color': ['Color', 'ud9wsdhe6/15.8', '18cdsLd2xHskqliDWERU_0MBdU5dF3gVr_uizhnapTdg', '', ''], // Espoo
                'Easter egg of Turku': ['EasterEggOfTurku', 'u6xzg3k3w/15.5', '1CcyugnXYcA28PbpC7xP6RK4Wn-N82F98FiZ8iqvuw9Q', '', ''], // Turku, RePe
                'Espoon vaakuna Herald of Espoo (Flats)': ['EspoonVaakunaHeraldOfEspooFlats', 'ud9w7f5gq/15.9009', '1qs-96z6Pm46aOHJ8fAn3r_nzzJSJ76d-0lw-VsXtnPo/edit#gid=863805160&range=A1', '', ''], // [push], Espoo, mandello
                'Evolution Field': ['EvolutionField', 'ud9wrdhs8/14.4', '1WPgjj8Jir64XXPIDTKH8XDtpEvA3yPFzbjW_J80K2U8', '', ''], // Helsinki, Neesu, Sivontim
                'Flat Holm, Larsmo': ['FlatHolmLarsmo', 'ue24tw51e/15.7', '1UOjaA5hS5qB8s5yQHb7Ah7aTDSkxCC0NcsWBtoAc2Dk', '', ''], // malof
                'Flat Matt, Orimattila': ['FlatMattOrimattila', 'udf3ckgsh/15.5', '1qf0I7z-cIdcNnY0o3X6VUY7PKsQAZWBkfiJ2ja4Uce8', '', ''],
                'Halkokarin evovene': ['HalkokarinEvovene', 'ue27q1nvm/15.2', '10_qtoRDi_kb-OJnqpbd07zPBW63oL83fsIzVDfKwDHY', '', ''], // Kokkola
                'Hibiscus-flowers on highway': ['HibiscusFlowersOnHighway', 'udbvsuwsd/15.6', '1LtxjaPdYxKAw7_h6MOtAkESKg4nFoebLwyVjf4Up7RE', '', ''], // Tampere
                'Honor': ['Honor', 'udf6btcu8/15.7', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=2001064450&range=A1:E3', '', ''], // Lahti
                'Huuhkaja': ['Huuhkaja', 'udbvwptz7/15.0', '1opyEvj9vQbwXO87q6E0-TlicaLr-MDeenNcpOTjiXRQ', '', ''], //Tampere
                'Hyvinkää': ['Hyvinkaa', 'udc8vwrpv/15.2', '15uMn7URcyjLdcJKTnkQKyCIAcZS8s8033KqARR3kBlQ', '', ''], // Hyvinkää, tartu61
                'Ideapark and Realpark': ['IdeaparkAndRealpark', 'udbvje7hu/15.7', '1zkDItKXQMg1A56Itb888VH9ICUiFCkn3GnqdeOix3sQ', '', ''], // Lissu
                'Itäharjun flättiparkki': ['ItaharjunFlattiparkki', 'u6xzgsx87/15.9', '18xH9nXVYaMD9MwagAaRQABiLiSQ2yK6K6P_pLVX6jBQ', '', ''], // Turku
                'Jeppis': ['Jeppis', 'ue24k0dbq/15.5', '151EoTkql5MBXsjI6Ret6DEMy1CCbNQQX3kmcEDplKo0', '', ''], // malof
                'Kärsämäen Klaanimiekka': ['KarsamaenKlaanimiekka', 'u6zb54227/15.7', '1cWEdoEehihTMaMhvVmnmjD1oprtRRNKopedwcnDGkIA', '', ''], // Turku, taiska1255
                'Kehäkukka(nen)': ['Kehakukka', 'u6zb5jhp8/15.7', '1vA0FbAFPNzRkdOwjxv6duE68NO0YJVVH', '', ''], // Turku, taiska1255
                'Koroisten kolmiot': ['KoroistenKolmiot', 'u6zb52m80/15.4', '1618ksqdch_9thvjWbXgczj_BxiESB0me2zUuq1iLf34', '', ''], // Turku, taiska1255
                'Kukkapuisto': ['Kukkapuisto', 'udbvv7158/15.7', '1c3sjAVuZ1foqW-eDDp-7XJpFKit7z1pXhedmLeEsxQs', '', ''], // Tampere, Lissu
                'Kuralan Kylämäen Evolato': ['KuralanKylamaenEvolato', 'u6xzuqbsg/15.7', '1PycvsIGRJ_SkpzvmtCD9iTd7wmFJupojCnP8Zwx0UFg', '', ''], // Turku, taiska1255
                'Lahden Catapult': ['LahdenCatapult', 'udf4zuz9w/15.7', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1808201876&range=A1:E3', '', ''], // Lahti
                'Lahden Crossbow 2.0': ['LahdenCrossbow20', 'udf4zgxhk/14.3', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1192989064&range=A1:E7', '', ''], // Lahti
                'Lahden Flat Lou': ['LahdenFlatLou', 'udf4zvr1z/15.7', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1210090860&range=A1:E3', '', ''], // Lahti
                'Lahden FlatRobe/Matt': ['LahdenFlatRobeMatt', 'udf6bm1tf/15.8', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=906470508&range=A1:E3', '', ''], //Lahti
                'Lahden Vaakuna': ['LahdenVaakuna', 'udf4zsnx8/15.3', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=2051955715&range=A1:E3', '', ''], // Lahti
                'Lahti Farm 2': ['LahtiFarm2', 'udf6bvkhu/15.0', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=947054694&range=A1:E4', '', ''], // Lahti
                'Lahti Virtual Specials': ['LahtiVirtualSpecials', 'udf6bjje1/15.7', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1089618765&range=A1:E3', '', ''], // Lahti
                'Lifebuoy': ['Lifebuoy', 'u6xzcg30d/15.7', '18eZAN9ljk6PzINpcZr5RdfPCKtO5N0nxBHg2tMlR1dc', '', ''], // Turku, RePe
                'Malec`s Angelic Rainbow': ['MalecsAngelicRainbow', 'u6zb5fdmy/14.8', '1d5y5cy_633EqYFF4DkJ5dDQOizgr2-2k', '', ''], // Turku, taiska1255
                'Matryoshka Doll': ['MatryoshkaDoll', 'udbccr2pf/15.7', '1TGePSNhlNTVje2FxhNzab6DI1n3QTrG4NxRZr35uILw', '', ''],
                'Meritullin evopuisto': ['MeritullinEvopuisto', 'ued1g7h9x/15.7', '1zuyTEdtun2JqhC7kxGRsS4fLzSU8-60j4LaUwOOXobk', '', ''], // katinka3
                'Nurmijärvi': ['Nurmijarvi', 'ud9xe05ek/15.5', '1IGax3NnQABQPaXUSVltgSRPZrYkswMEazcpaLNYIlAI', '', ''],
                'Olari evo': ['OlariEvo', 'ud9w6gkqp/15.8', '1n8oUrfy2DqdMcH5ihJhC_NfTgj-S8CVTKhHd6kJS9Qo', '', ''], // Espoo, mandello
                'Reksun Trail': ['ReksunTrail', 'udf4xem0k/15.6', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1826328061&range=A1:E3', '', ''], // Lahti, Jesnou
                'Royal Bear': ['RoyalBear', 'u6zmze5hg/15.3', '14ajhkzDLsVoi8xisq13gWF-IBrJ3W4fN5emBDgDh4WY', '', ''],
                'Sharpei': ['Sharpei', 'u6zb597d6/15.8', '1XhMBO2VOe1Y2X3uG2gpegvwy-7-JSevt', '', ''], // Turku, taiska1255
                'Smiley': ['Smiley', 'u6xzfkb82/15.8', '14uzB9BF1k_3MF_L3aMuEWYxCpaifnfGSBcAfA5GB8cs', '', ''], // Turku, RePe
                'Solros Jakobstad': ['SolrosJakobstad', 'ue24huudj/15.2', '1SGoymkmBRsPbYh_uGEXo4DTxyFs7zCLZVKSi6Zb4Alc', '', ''], // malof
                'Tampere electric': ['TampereElectric', 'udbvv1pgw/14.9', '1gtbYindXub8zsIDet7PwqQbzp6fvun-7dsxdxLEwIdw', '', ''], // [push], Tampere
                'Tappara': ['Tappara', 'udbvvgyd8/15.3', '19XoMcx8DoNJzlWsRcxqdaWH1eZZITqrGkhcJQO6B278', '', ''], // Tampere, Lissu
                'The Finnhorse': ['TheFinnhorse', 'ue27q65pp/15.3', '168rVifRDgUzWfdkLqLJwfdhcQY3aP09xmRHQ0v_f4wo', '', ''], // Kokkola
                'Turvesuon Puisto': ['TurvesuonPuisto', 'ud9w7vj28/14.6', '1FFXXZPbhXSBezTaIKUfRQuyo6xaZnQlSzNMP8wDMhgU', '', ''], // Espoo, mandello
                'UUSI - Evopuisto': ['UUSIEvopuisto', 'u6xzu0zh8/15.7', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE/edit#gid=627456412&range=A1:A2', '', ''], // Turku, RePe, tcguru
                'Vaakuna Amethyst': ['VaakunaAmethyst', 'udf4zs141/15.7', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=2114411203&range=A1:D3', '', ''], // Lahti
                'Virtual Magnet': ['VirtualMagnet', 'udf4xwrjr/15.7', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=2064545141&range=A1:E2', '', ''] // Lahti
            },
            'Germany': {
                '10th Birthday, Berlin': ['10thBirthdayBerlin', 'u336ymvtx/16.0', '1tVQsiqPiwc5cMzzfFJuqf8YCYoIr9RVl73HpGf0_0KM', '', ''], // Berlin
                '2018 Catapult': ['2018Catapult', 'u0zckrtpk/16.0', '1x3GX_TLWRZESk1KnDHuz9h4CVukw9bqzeDUvn7XaNWQ', '', ''],
                'Adler - Katapulte': ['AdlerKatapulte', 'u0ws6ed47/16.1', '1psUK6cjMwCKECbk8oGkG3PwnScPAO01pUL1C4lpYIfc', '', ''],
                'Adventure Portal 2': ['AdventurePortal2', 'u336wpx05/16.0', '1ivw2wLAerMP12SUdmvBHu03atNBSZLE38TMv8YQpCa0', '', ''], // Berlin, BonnieB1
                'Appenzeller Sennenhund RT': ['AppenzellerSennenhundRT', 'u0wecspcn/14.5', '1-AvO8enz9WYlMpeekGWPkVxNvZ-f63S0L3yfu1YfDxw', '', ''], // [push], Reutlingen, geckofreund
                'Are you X-Zee-perienced': ['AreYouXZeePerienced', 'u0weber3n/14.8', '102QHEKr1_eHzeED1o26_qgWUMfDFC7S_rwAYsQRQyA8', '', ''], // Reutlingen, geckofreund, NoahCache
                'Barockstadt Fulda': ['BarockstadtFulda', 'u0yzs5quj/16.0', '1uHGP91xCjCvwxce0hP-iZgRAfG69OyMIEAt0PVLtl54', '', ''],
                'Berlin Bear': ['BerlinBear', 'u336sed86/14.3', '1IEStyNlt7Yv3sJfQLIYap9kFyMNvA9VghZQxcWsEGYc', '', ''],
                'Berlin Munzee Pin': ['BerlinMunzeePin', 'u336wu8b1/15.1', '1iOg2UxMXGecfZXII9nsQE4Ou48JQNvvhJhIuM_khXF8', '', ''], // Berlin
                'Berlin Void & Maple Chess': ['BerlinVoidMapleChess', 'u336tzs18/16.0', '1I7JZXb1MN4sA5S3JFYAxTWDxeVDMXSuyJ7GHWytYmp0', '', ''], // Berlin, 123xilef
                'Diamant Berlin': ['DiamantBerlin', 'u33df7ttu/15.9', '1aZOLQqKAnsoDzT8ZuGcJGnUTLnSjMXv76NvVISz-k1M', '', ''],
                'Euro MVM Flags - Austria': ['EuroMVMFlagsAustria', 'u1h2dw99w/16.0', '16XHN5AxYt4WkkcyroSbC7S_mO2ZXb5ObQp3H1YDyONc/edit#gid=0&range=D446', '', ''], // Aachen
                'Euro MVM Flags - Germany/Netherlands/Belgium': ['EuroMVMFlagsGermanyNetherlandsBelgium', 'u1h2dxb86/15.6', '16XHN5AxYt4WkkcyroSbC7S_mO2ZXb5ObQp3H1YDyONc/edit#gid=0&range=D9', '', ''], // Aachen
                'FC Bayern': ['FCBayern', 'u28629243/16.0', '17UPjILKOKreZ4FvnlGx6ygx5mq6pX_TZG_0qqOn5Mfc', '', ''],
                'FC St Pauli': ['FCStPauli', 'u1x076pj4/14.7', '1pUhAyQh_NdF81ylJuyMYgHmKZORgNwpZfp-bEI6W3Rw', '', ''],
                'Flat Rob & Flat Matt Drive In': ['FlatRobAndFlatMattDriveIn', 'u0zcnb5ry/16.0', '12Ceq3n8UZNUdjZDI8H2BLxjiaCDwxIz_WX1OTFTnPGY', '', ''],
                'Flats @ Appenzeller RT': ['FlatsAppenzellerRT', 'u0wecspcn/14.51', '1M-9WjrBwHgMI7UEQybxwY9m5QzD-xlodk_m6EeZiFSc', '', ''], // [push], Reutlingen, geckofreund, NoahCache
                'George - the Fab 4/2': ['GeorgeTheFab42', 'u0w7yp6un/15.4', '1whtNX40rfK72iTvKxaaEd5rZLpq6_iXZ5V6NSzJ4vZA', '', ''], // topic (The FAB), Tübingen, geckofreund
                'Hammaburg': ['Hammaburg', 'u1x0es633/16.0', '1BUUlu2R9-Dxi42Mhwv0TV2GQaKyueuFCsp6fXA2ICkw', '', ''],
                'Heart of Bavaria': ['HeartOfBavaria', 'u28jjh79j/16.0', '1kTn2WvVR0ppcpsYGEgVPr22YcuwReD6r_Faxcf0ibBw', '', ''],
                'Hönow Wappen': ['HonowWappen', 'u33dys629/16.2', '1awzh00aGcbXrffVi_470G9rYoPf5tiiRilFGVcgrKGE', '', ''],
                'Karlsruhe - Stadt des Rechts': ['Karlsruhe-StadtDesRechts', 'u0tyyfy7z/14.9', '1jewr3-fxxXn6HPgNi4zSOe8ydN_cORi7QmyZvnDd_vg', '', ''], // Karlsruhe, volki2000
                'Logo of German Soccer Club': ['LogoOfGermanSoccerClub', 'u38eejzgu/15.8', '16kUYcxvfVktkxZIkKiJnpeElg7H-sdSldS5FPoiiMA4', '', ''],
                'Paul - the Fab 4/3': ['PaulTheFab43', 'u0w7yrd1n/15.4', '1wlcEVbnafMexotRJMsSHxFtWLaLl-hvg7gayoIOYBCs', '', ''], // topic (The FAB), Tübingen, geckofreund
                'Patchwork RT': ['PatchworkRT', 'u0wec7dyv/15.3', '12xqliOfumxZbSSNi6p7r0pjr7-gbCzyhioJ-DykF2lA', '', ''], // Reutlingen, geckofreund
                'Peace': ['Peace', 'u0we8z9mh/14.7', '1kz_9X3qo6HXUuEyMn9ZP9m2dcWwOk5y0xV45GJo6dxQ', '', ''], // Reutlingen, ChandaBelle
                'Rainbow Diez': ['RainbowDiez', 'u0vww4w5x/15.4', '1bmWnFIwERR1M71u83XTo4HBxJIKXqPi5vMP6KhAo7JA', '', ''],
                'Ringo - the Fab 4': ['RingoTheFab4', 'u0w7yn1s8/15.4', '1iljO6wikjSvOBmfUp4Qt9bxKCe9wSDheoMkYEVfyUn0', '', ''], // topic (The FAB), Tübingen, geckofreund, NoahCache
                'Smells like ZeeSpirit - Kurt Cobain': ['SmellsLikeZeeSpiritKurtCobain', 'u0ws1b5wm/14.7', '1CP8x9y0IyA_NYHi58nhQHU7reAYefkcq8AihMwt-ayg', '', ''], // Reutlingen, geckofreund, NoahCache
                'Sportpark Evolutions RT 1': ['SportparkEvolutionsRT1', 'u0wec15u9/15.7', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''], // Reutlingen, geckofreund, NoahCache
                'Sportpark Evolutions RT 2': ['SportparkEvolutionsRT2', 'u0wec1kg4/16.0', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''], // Reutlingen, geckofreund, NoahCache
                'Stroopwafel invasion in Meitingen': ['StroopwafelInvasionInMeitingen', 'u0xspjjng/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Tresor ICE Limburg': ['TresorICELimburg', 'u0vy8h29n/15.3', '1jjosyeCxF8c0FC7c5MjgK_2JG6MBk_DNUypbFvucxNs', '', ''],
                'Wappen Halberstadt': ['WappenHalberstadt', 'u1pz5x8s1/15.7', '1acHEqnuAZw6D4Gz2S0DryqX06abhLrEAO0pfGEyxiH4', '', ''],
                'Wappen von Winkel': ['WappenVonWinkel', 'u0vsqpp1r/16.0', '1eSGm5lg07scpOoG6_ONhTs6XPuvLwTClDjMmPvQvBUk', '', ''],
                'Wipperfürther Sternchen': ['WipperfurtherSternchen', 'u1j6b98kn/16.2', '17VGHZ2i9CDf93LhyKI3lbe02mAi7xBLRDYvCj7Cg0dA', '', ''],
                'Wittenauer MischMasch': ['WittenauerMischMasch', 'u337pnnqb/16.1', '1TvCn4zYgpMXHKv4K0PBnjMa76NePegF4jjTB_cvGfwM', '', ''], // Berlin, 123xilef
                'Yin Yang Neustadt': ['YinYangNeustadt', 'u1xey2pvq/16.0', '10d5BO3DTeQNBbUFntPyXUMfMG68ZXVCrZZPo9gTxUWU', '', '']
            },
            'Hungary': {
                'Alsógalla JoyPrize': ['AlsogallaJoyPrize', 'u2mne5ju5/14.9', '18yKphmI_Ds9ThkWVnU3F1D40U-BrpuGMhDx9-lnEmp8', '', ''], // Tatabánya, Norbee97
                'Avasi kilátó': ['AvasiKilato', 'u2wc8ezzm/16.0', '1o9A2OTZ-x9LAvWSaRIjNbobj-c-t6cZANGzi2nHGPAk', '', ''],
                'Brigetio': ['Brigetio', 'u2kzt1v7q/16.1', '1lalErwcZmw8n-LJbHCjs0w_-VoR3g6nUkKICXTQ-Cyk', '', ''], // Komárom, Norbee97
                'Budapest Easter': ['BudapestEaster', 'u2mw6bs9y/15.4', '13ujSRsUp1jBDOcZj41XOc8HDbwr7yuNoAmg6HxrDUpk', '', ''], // Budapest
                'Castle of Diósgyőr': ['CastleOfDiosgyor', 'u2w9wsmeg/16.0', '151MJBVtOmlGWHD2Pct4xgJNHbbP4A51bwEfQ8ykYdf4', '', ''],
                'Crossbow in Szeged': ['Crossbow', 'u2nr4hjvw/15.7', '1KVAR7uRR3DQhAvpNA034pFOwllbzRVTYw3aVpzY0S2s', '', ''], // Szeged
                'Crossbow in Tatabánya': ['Crossbow_Tatabanya', 'u2mne32nt/15.5', '1bZK5HinI4dsTlBpcMayie9BZTedIqqOtM0TCzmXx0UE', '', ''], // Tatabánya, Norbee97
                'Csepel Öböl': ['CsepelObol', 'u2mtfhmhq/15.7', '1oDPowweH8xpUpndJohFO2KS6CAlmSaVv2o9O8ArInjY', '', ''], // Budapest
                'Csepel Vas és Fémművek Logó': ['CsepelVasEsFemmuvekLogo', 'u2mtcd7c8/15.2', '1nRGY4F_IcGyf8IerM5L_OTTeczAYARho3I78Jp9HQyo', '', ''], // Budapest
                'Debrecen 2202': ['Debrecen2202', 'u2rqk5cfd/16.2', '1PqIFXwIVCj2vF0Wn7lirVxmaxHGuw35RuwuPeX4RC6I', '', ''], // Debrecen, Norbee97
                'Dunakeszi': ['Dunakeszi', 'u2mwujkgx/14.4', '1n3igky680fKt8x0E0x_9vE9NmadrQYJuFwCM3mVA40c', '', ''],
                'DVTK in Miskolc': ['DVTKInMiskolc', 'u2w9xkpr1/16.2', '1rgrq5GTqAXGdL_Ties_nNDJXh3TxJJGv4D1N2_nskKg', '', ''],
                'Electric Debrecen': ['ElectricDebrecen', 'u2rq7fsvq/15.2', '1_f4qfJlP9VX9-uZrfOiyh88tswVDqqiZTcSUXHfIOnw', '', ''], // Debrecen, Norbee97
                'Evolution': ['Evolution', 'u2nr562g8/15.6', '1pUHXEhV7x4A6N9E298d5ZwoERMkOZUCf-4tSb4jYNzQ', '', ''], // Szeged
                'Farkas-erdő': ['Farkas-erdo', 'u2mwdz3qh/16.0', '1ILnAOLZb5gDoCOY6ujrRm7vdjB7mYDuI5VYiSaLLJjU', '', ''], // Budapest
                'Flat Debrecen': ['FlatDebrecen', 'u2rqk56jy/16.3', '1AVig5lE1FL7Wa9g7V3QpIIqhr45MYpFuBwnvpqp_8XM', '', ''], // Debrecen, Norbee97
                'Flat Matt in Budapest': ['FlatMattInBudapest', 'u2mw1keu9/15.8', '1pJ_dxZucfNRFVqDH1vY4Ot9HzrwgZco_7HpxwehOHIs', '', ''], // Budapest
                'Goat in Kecskemét': ['GoatInKecskemet', 'u2mfzfbg7/16.0', '1gV4BtG930czWJFu2EqmlC7QnhB0M-ehCzv94rnMKZMc', '', ''], // Kecskemét
                'Gyula Castle': ['GyulaCastle', 'u2r1kkt2h/15.3', '1PsyWUnT609Y6FdQcIEG5oJXgn_KrlRadTAZE57cfQ-A', '', ''],
                'Jewel Sandwich': ['JewelSandwich', 'u2rqk555v/16.3', '1bB12wFOBvHDW7caPKFjbdUEcgTmc6jCCuPzXMXH8uyg', '', ''], // Debrecen, Norbee97
                //        'Hungarian National Flag': ['Hungarian National Flag', 'u2mw4xttp/16'], // Budapest
                'Mario in Vác': ['MarioInVac', 'u2mxg2dwj/16.0', '1qQVejrZhpbOYeWsm9eGjqkLJaUvWVAA9nYA8zXwlKQc', '', ''],
                'Miner Symbol': ['MinerSymbol', 'u2mndxhne/16.0', '1AgZ-dxeHxt-WRCGsHA5hlTkQ9UzuD5KAFNiq5VtZlpk', '', ''], // Tatabánya
                //            'Pyxis': ['Pyxis', 'u2mw4u59g/15.7', ''], // Budapest
                'Rubik`s Cube': ['RubiksCube', 'u2mw353ed/15.8', '1HFM0MU5MWWUI3ysgdUh-yCu2mIB0p7qCIVQcmAtk7J8', '', ''], // Budapest
                'Sailboat at Lake Balaton': ['SailboatAtLakeBalaton', 'u2kd4jhcs/16.0', '1V7bQncBJyK8gCQPEmv8qNuflSHNDlQp-zE3FUzwr4_8', '', ''],
                'Sanyi The Owl': ['SanyiTheOwl', 'u2kx1ty6b/15.9', '1MWXmDPFZj9H0R3DZAGwc9ZUK-9_wnRvI', '', ''],
                'Shield Budapest': ['ShieldBudapest', 'u2mw3fteq/16.3', '1X7mBO_kcJhePqIVaVY_s7WrDhlR050CM0nrR4RxO2Sk', '', ''], // Budapest
                'Shield Eger': ['ShieldEger', 'u2w2rz2pb/16.3', '1WrcvlzijNdJkxOyi-1QtSldpryTVCfBM8-9VmAIV344', '', ''],
                'Shield Kecskemét': ['ShieldKecskemet', 'u2q4bk348/16.2', '1p8pP3IDh0Bvpqht38rQp5Xd6Nkjj-OpDtaVx7HkFEAo', '', ''], // Kecskemét
                'Shield Miskolc': ['ShieldMiskolc', 'u2w9xugxp/16.3', '1Cn92ZYbfV7fSsMc3EYBYCBy_R6Ak2kNtnO9KYjxHi0k', '', ''],
                'Surprise Airline': ['SurpriseAirline', 'u2mwhznbx/16.0', '1uwCGphmz2YC44lvl9CsMypbzMhHyjaEJY2Qnz2XYTlo', '', ''], // Budapest
                'SZTE': ['SZTE', 'u2nr474hq/16.1', '1EGN8vHhCLjjeRImTOcc3F8rZziZUZsNlL_wCkdm2l-o', '', ''], // Szeged
                'Taska`s Smiley': ['TaskasSmiley', 'u2mxgdrju/16.1', '182gtF7Iydd8r4zbYRDl-TGF-fzu0kjuvk1npaJluHHU', '', ''],
                'Tatabanya Blackhole': ['TatabanyaBlackhole', 'u2mndeqbd/15.3', '14HW0wCb9TEP6ThgSLTSeLjNwAgwJhxUnQkXX0o_not4', '', ''], // Tatabánya
                'Tócóskert`s Arrows 3': ['TocoskertsArrows3', 'u2rq7shg2/15.93', '1YNXFNfzN6kCH0Z10sonYsZb8qaDhzBGa5QvwtC8sARM', '', ''], // Debrecen, Norbee97
                'Votive Church': ['VotiveChurch', 'u2nr55dy9/15.2', '1IxdGbOYKkchcyuJ9l3h8a5veZEPAq-YlQEjkWaKYyjA', '', ''] // Szeged
            },
            'Jersey': {
                'Jerzee Clan': ['JerzeeClan', 'gbwrzrz7x/15.0', '1xawAGIs670rwVeJjBVfcLOQOOTxo0IRhUy2GLx6MM3E', '', ''],
                'Jersey Color Paw': ['JerseyColorPaw', 'gbwxb6e5p/15.7', '1zGv0_sGxYhwhRUt5SGKMRTigRYLnfAUDJS42LJDpuCI', '', '']
            },
            'Latvia': {
                'Riga First': ['RigaFirst', 'ud1hh8ntg/16.0', '1w5erXITQuaNHZRrflWcgA7oXpmhTZxZzgu6svzBLEoY', '', '']
            },
            'Lithuania': {
                'February Event': ['FebruaryEvent', 'u9c03tcwt/16.0', '1dAfI8coAEX87J3UEW2n-hcIAeYz4VdfbT0a9PtFIHeA', '', ''], // Kaunas
                'Kaunas Basketball': ['KaunasBasketball', 'u9c020cgg/15.6', '1s70ce7vPCLgfIw8W_nheAe6rMB7P1t89RSSRaUY6_44', '', ''], // Kaunas
                'Kaunas Lightning': ['KaunasLightning', 'u9c03z4uv/16.0', '1BXiUc9pI1ZSIbVs4P2dqSqXHl91p0sWY7jkjdEmzW34', '', ''], // Kaunas
                'Kaunas Magnet': ['KaunasMagnet', 'u9c03t0v3/15.9', '1reQrPZ1HfXBS35tAVPHAGVhJXHhKGW3hFzUq8fwbHx0', '', ''], // Kaunas
                'Kaunas Scatter 2': ['KaunasScatter2', 'u9c03wx5s/16.0', '1ABpXI8_tjp5PxzTKDiHzWt2QB-EUSHYvM3mbMo2Va7I', '', ''], // Kaunas
                'Ozo Park Flats': ['OzoParkFlats', 'u99zr1nu7/16.0', '1Y0HmRjQhxLNTZ_XQttJLtiWUxC-T61s1GNL-K5Z1NWs', '', ''], // Vilnius
                'Šeškinės skulptūrų parkas': ['SeskinesSkulpturyParkas', 'u99zq1jmb/15.9', '1LFMjat3E_5eUF1dMwy8L6sLidpWUomdWUPH7ztg6t5M', '', ''] // Vilnius
            },
            'Luxembourg': {
                'Luxembourg Flag': ['LuxembourgFlag', 'u0u67c6sw/16.0', '1-LiKKpJv5FZRw3sc7tjz_3TmHVVAfzUgRz13CpdmmYo', '', ''],
                'Luxemburgse Flag': ['LuxemburgseFlag', 'u0u7swpme/16.0', '1fMpRjvmY1hiDdBB3EDBubklAlxzbwX4nRANX8U2Yz68', '', ''] // FRLK
            },
            'Netherlands': {
                'Air Brush Palet': ['AirBrushPalet', 'u1kjmg4vf/14.5', '1m9wvpVxz1C65NZaIQTN3CAzz-ElYUSLBGvw-Ic5QMmw', '', ''], // Heerenveen, FRLK
                'Borromean rings': ['BorromeanRings', 'u1kc3h918/15.3', '1HPR7SWZKgXAZiXSxI7IW0QdjHcYUVp5dShUoIVyDOJI', '', ''],
                'EVO Keunst Tún': ['EVOKeunstTun', 'u1kjq3cr1/14.9', '1OzvH9-QHKyj4KQOMv91leNZX3byA838i2nPgdCuoTHY', '', ''], // Heerenveen, FRLK
                'Evolution-3 Ruige Riet': ['Evolution3RuigeRiet', 'u173vmmuc/16.0', '1d1WccASOINUviij2ISYr0Oy61S0KZcwVwSMXxVQ9qx4', '', ''], // Amsterdam
                'Flash-Eiland van de Meijer': ['FlashEilandVanDeMeijer', 'u14gb5my1/15.9', '1QHXa1obEZSuL_6qusb8V4_0cFAiGh3b2GXnAJoJfV9s', '', ''],
                'Flats Heerlen': ['FlatsHeerlen', 'u1h327qtz/15.7', '1SyGzorRnvHGwpbY0dHDJ9DSF3WkvI4dgiSZs1GIl2jE', '', ''],
                'Groningen Flag': ['GroningenFlag', 'u1kwwvjb9/15.0', '1OEsTBJOsWcnF6QGrsyrK2wIPUqC85DzD08D5o89RyV0', '', ''],
                'Heerlens drieluik': ['HeerlensDrieluik', 'u1h32df8r/15.4', '166PbAS83oFGo2mE_Z4cgo7UniFbutIZy4vgcbZJrPY4/edit#gid=1980231199&range=A13', '', ''], // [push]
                'Heerlens drieluik (Flats)': ['HeerlensDrieluikFlats', 'u1h32df8r/15.4009', '166PbAS83oFGo2mE_Z4cgo7UniFbutIZy4vgcbZJrPY4/edit#gid=2006395407&range=A1', '', ''], // [push]
                'Jewel Face': ['JewelFace', 'u1kjq1fks/15.0', '1ciDwGIghYKZibvp-9jg_xbEN7J1-rb6Y4sviwbbpIAQ', '', ''], // Heerenveen, FRLK
                'Pac Man, Schiedam': ['PacManSchiedam', 'u15p7t3y2/15.1', '1TWlIcAKYRzh_7T4ZNyI7PZO8ffUNZTI9EYrZLTBd4ys', '', ''], // Schiedam
                'PacMunzee': ['PacMunzee', 'u1k30tn4b/15.9', '1iGH8llSHwlpqu5cCNg9uMvQ77r4lxt6g1YduRomahjc', '', ''],
                'The Flats': ['TheFlats', 'u1kjr2qnz/14.3', '1_WtHLHF5OVLjYs56mZrvFJNKh6dbvgDo9sOc0fRqlF4', '', ''], // Heerenveen, FRLK
                'Unicorn Hoorn': ['UnicornHoorn', 'u17e6nn5m/15.7', '1bVwmR6jk0aJXplng_fHQZx7gV7heITyWYkCSHDy67UQ', '', ''], // Marnic
                'Vlinderhoven Flat': ['VlinderhovenFlat', 'u15p7xqxj/15.5', '1eL7lJ5MGhxQaDQo-_PhTLPnIr3t4ARicTsH-SYo2IeQ', '', ''], // Schiedam
                'Vlinderhoven Schiedam': ['VlinderhovenSchiedam', 'u15p7xtxw/14.8', '1zrCfmFAlu1a5jgf3wDdCOBvUs_b2TRwIfTsvaSX1qlk', '', ''], // Schiedam
                'Wapen van Enkhuizen': ['WapenVanEnkhuizen', 'u17gbh505/15.3', '1uypDR_0Q1XJWniT5ZJO8W34-CMNyE9DxgUa_odiR38w', '', ''],
                'Yin Yang': ['YinYang', 'u1kc2gkpj/15.9', '1sEoal3lN9GWAk1tLmbThVWWuGzLVKKYX4ILg1e1iRvA', '', '']
            },
            'New Zealand': {
                //            'Lloyd Elsmore NV Goggles': ['LloydElsmoreNVGoggles', '', '1FU23ClfXK3IoNCIk6ZS5TJH3jpzheNHzP7vouGKtm-0'],
                'Auckland Anzac Poppy': ['AucklandAnzacPoppy', 'rckq1twss/15.6', '1qP452Ii_JIggfMDTg5TKaXTJ3iN10bOHlYQkPx1Yitw/edit#gid=941530303&range=A4', '', ''], // Auckland
                'Auckland Anzac Poppy Title': ['AucklandAnzacPoppyTitle', 'rckq1wncw/16.2', '1qP452Ii_JIggfMDTg5TKaXTJ3iN10bOHlYQkPx1Yitw/edit#gid=274990366&range=A4', '', ''], // Auckland
                'Auckland Pohutukawa Flower': ['AucklandPohutukawaFlower', 'rckq9hfrc/16.2', '12OabYBKTWzlA1BNqIoNTA3hKZhLvBjeRZtHMFQwHSsI', '', ''], // [*], Auckland
                'Creed in Tawa': ['CreedInTawa', 'rbsmdpjvg/16.0', '1Tb5LdESXGsWauqTrNY0moNvaAXBt5CS5ijYM5_NO-Gc', '', ''],
                'Howick Beach Boat': ['HowickBeachBoat', 'rckqhgfu4/16.3', '117tNzujMC6Rhnd88argwafssHWuo_jq3lYwAv1UVJ74', '', ''], // Auckland, 321Cap
                'Howick Jewel Art #1 (Flats)': ['HowickJewelArt1Flats', 'rckqh6yb4/16.2009', '1lugsFfQJ09pV26JwYPeWQ0V3QUXQBc2rwh7EzND2R4s/edit#gid=1511359877&range=B1:K1', '', ''], // [push],Auckland, 321Cap
                'Howick Munzee Triangle': ['HowickMunzeeTriangle', 'rckqhu88r/16.0', '1OClN5OWqvsJssXZoqODDyWhP82roa4q38c4EvPfjCH4', '', ''], // Auckland, 321Cap
                'Howick Pine Tree': ['HowickPineTree', 'rckqhd3yz/16.2', '1MUqJQFtsFUdwlhOV9hhbAs9shylMivReUGkBaGPItPw', '', ''], // Auckland, 321Cap
                'Howick RUM Patch': ['HowickRUMPatch', 'rckqhevs6/16.2', '1SATC7p0SEzwL-KsTW15Dub3YTUUSY3CMLGXnMj0N7eE', '', ''], // Auckland, 321Cap
                'Lloyd Elsmore Evolutions': ['LloydElsmoreEvolutions', 'rckq5cw4n/16.2', '17v6TlhvZaBt2O0bQ5jBcCapzUWf-K_0_fY81Vmdj2VM', '', ''], // Auckland, 321Cap
                'Lloyd Elsmore Jewels': ['LloydElsmoreJewels', 'rckq5fpze/16.2', '1yUdQbvXSFie3wK2eCobQcDWOWi34OTSWOTzOiY_ykxk', '', ''], // Auckland, 321Cap
                'Musick Point Golf Tee': ['MusickPointGolfTee', 'rckq7fpwv/16.2', '12IhFKlHL0ato5b0L9k31E_HXXnb2mkMSylB5UHA-yTc', '', ''], // Auckland, 321Cap
                'Newmarket Bowling': ['NewmarketBowling', 'rckq307y5/16.2', '1pA6MpRK-2E0uFY6EYbwAvugzh7To63QHHtXG7F5Y85k', '', ''], // Auckland, 321Cap
                'Welcome Home Moira': ['WelcomeHomeMoira', 'rbskc45r2/15.5', '1hwOuDnUbkwTmwbNIx3R25ECSlS3lw6SANvHDG_Sv61k/edit#gid=585789369&range=A1', '', ''], // [push]
                'Welcome Home Moira (Flats)': ['WelcomeHomeMoiraFlats', 'rbskc45r2/15.5009', '1hwOuDnUbkwTmwbNIx3R25ECSlS3lw6SANvHDG_Sv61k/edit#gid=1509675615&range=A1', '', ''] // [push]
            },
            'Norway': {
                'Ormen Lange': ['OrmenLange', 'u68tex91z/14.3', '12I4c4QK6Th-SiZO9zOs6vrJOFRWqGmQkvzMJJfQenRQ', '', ''], // [*]
                'Quilt Garden': ['QuiltGarden', 'u5q2nby98/15.5', '103TbFcOw2MK6DFSIK5RUBga6HoH5aApBvMIMkz7-dRM', '', ''],
                'Rissa Variety': ['RissaVariety', 'u5r1dwczy/15.6', '1Myxc9UzbSO3MA2SUJfrCRx45pj749JwNzHQHzOGKuJc/edit#gid=0&range=B2', '', '']
            },
            'Poland': {
                '2022 ForgetMeNot': ['2022ForgetMeNot', 'u3hb2c6y3/16.0', '1WDACqgB5Dq0j5_mdZ20vXTqqgZODlu7gy9MUPzs7Ckw', '', ''], // Opole
                'Creepy Eyeball': ['CreepyEyeball', 'u37fp1ebk/15.2', '1c53taV7oN7jdM847FDRfSIZP3mAArOSHdiTdaICEsXc', '', ''],
                'Diamond in the Rough': ['DiamondInTheRough', 'u3hb2bdbc/15.5', '1C5C0CbNVuUS9GYYNP1cBp9_FY0ifbuWgrDq1cwJtT2k', '', ''], // Opole
                'Górnicze Katowice': ['GorniczeKatowice', 'u2vtch5kr/15.9', '14UCoeAR7sWntM9GLX_czwX-m_dYv9MIezgQbF3iWKkw', '', ''],
                'Krasnal wrocławski': ['KrasnalWroclawski', 'u3h4u9jw3/15.0', '1hqOMr6MnWbsAYV2OL-Q6d2P-lTTSmCpAwvoV37CU02s', '', ''], // Wrocław
                'Legnicki gołąbek': ['LegnickiGolabek', 'u35e26neh/15.8', '1KvU887pfqyJMbAdj_Wr0VTLdxIX1_ZkHLQYRQ3d1dmM', '', ''], // Legnica, Grusierp
                'Mickey': ['Mickey', 'u3h8rbvr7/15.7', '1ogMoXJb_YHyjdBEaa4P4IXxLBomp37wZYu27iew1kNA', '', ''], // Opole
                'Opole Rocks!': ['OpoleRocks', 'u3h8px680/15.6', '1BhdCh0udXrBuboHdAk8okDuGehW7IAY1VrXKeaEbacY', '', ''], // Opole
                'PacMunzee': ['PacMunzee', 'u3h4uc3fn/16.0', '1Uv1kI2-qpMQ9jTCz3-NYgPrle2v--Brm07lEikFcW-o', '', ''], // Wrocław, Lumen
                'Wiosenna Pszczółka': ['WiosennaPszczolka', 'u35e2b83d/15.5', '1H2TW70BiI3qIiNzILwHbLOaCSoO8EH3mWtlKTaHN3Ec', '', ''], // Legnica
                'Wroclove': ['Wroclove', 'u3h4epv9h/16.0', '15DQ_kqxP33dX29YI9nuESwgz0BALAQ0HwBKugPnQWgc', '', ''] // Wrocław
            },
            'Portugal': {
                'Porto Novo High Voltage': ['PortoNovoHighVoltage', 'etu1c3y5q/16.4', '1tm6vc5skLo3eK_Epgc-BtZigxyI5jI5LOu8EwyxtRHk', '', '']
            },
            'Slovakia': {
                'Bojnice Castle': ['BojniceCastle', 'u2tjwb13q/16.0', '1_FGafoNwHBiDVjQ9ht74g17iysRrI89RHnClaiQ7hNg', '', ''], // Rikitan
                'Chilli Killer': ['ChilliKiller', 'u2s1yptfq/16.0', '1zl82l1o9AL3OJQoczvnjO8XLxrMnmrPwaClohQUQQf8', '', ''], // Bratislava, Neloras
                'Flag of Slovakia': ['FlagOfSlovakia', 'u2s1v26gn/15.7', '1Xq_qtFVPmjGHdFagab43wfxv6tA9zcM3xHeuJMfHBeg', '', ''],
                'Fortress Maze Party': ['FortressMazeParty', 'u2s1vzfpn/15.8', '1uFeynxkjT8AuMv-jG68bQmBaLuoabEL5aBdJJXUNFCE', '', ''], // Neloras
                'Giraffe': ['Giraffe', 'u2trnx81p/15.5', '1tLsNoogFtgYss2zsf6TNts7mfL31RYNgt7xbseGEVjc', '', ''], // Martin
                'Key to the Happiness': ['KeyToTheHappiness', 'u2tmv8cqk/16.0', '1QDKLuJ7YS9i2ijH50CrZvoivZnDR5wVhOMbyk8oPxM4', '', ''], // kepke3
                'KUMA Bear Rača': ['KUMABearRaca', 'u2s4q3jtk/16.0', '1OsJhpQ0groKCQrGBhKmZjcTM1226-g9QxegeG5k5Fpk', '', ''], // Rikitan
                'Lake Lighthouse Painting': ['LakeLighthousePainting', 'u2s1yq0c2/16.0', '1uPcuR_pfgSrZkRT_vobeQT5WyA9cA77whn_SjFSFfPM', '', ''], // Bratislava, Neloras, Rikitan
                'Lucky Clover': ['LuckyClover', 'u2trqgg7h/16.0', '1SAr3RxeVvd-wpEl_LPLoWwPwFgIpZ1vyxQNvihrkMfs', '', ''], // Vrútky
                'Shamrock Ihro': ['ShamrockIhro', 'u2s1yz6kg/16.0', '1WPDM7GblL8P73VyCqD-zTahkWBatOxTEzAyct-PKP3s/edit#gid=1953223548&range=A8', '', ''], // [push], Bratislava, Rikitan
                'Shamrock Ihro (Flats)': ['ShamrockIhroFlats', 'u2s1yz6kg/16.0009', '1WPDM7GblL8P73VyCqD-zTahkWBatOxTEzAyct-PKP3s/edit#gid=1143462191&range=A8', '', ''], // [push], Bratislava, Rikitan
                'Trenčín Castle': ['TrencinCastle', 'u2sy4ktgb/16.2', '1EShM7fInXsbiHaGuYWNya_LhDxsFYeSVWR04UXkDNMA', '', ''], // Rikitan
                'Void pin Vrútky': ['VoidPinVrutky', 'u2trqv03k/16.0', '1WBF6pKlaFkEvN5KboWCw7XN_vw1FnhFZbylaVMkkLPA', '', ''] // Vrútky, kepke3
            },
            'Spain': {
                'Palma de Mallorca - Official Flag': ['PalmaDeMallorca-OfficialFlag', 'sp1ch758h/16.4', '1BtD1mbcL9cLCHKMEJ1GqJXbmRYkvNiQACS7sUid4SFA', '', ''] // Peter1980
            },
            'Sweden': {
                'Garden Gnome in Arvika': ['GardenGnomeInArvika', 'u68gqhybm/14.8', '1PBEmCTCHOXr5pgWkBndufM8PQLct0OJhxYwbgn4j97g', '', ''],
                'Stroopwafel invasion in Linköping': ['StroopwafelInvasionInLinkoping', 'u67hj4225/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''] // topic (Stroopwafel invasion)
            },
            'Switzerland': {
                'FC Basel': ['FCBasel', 'u0mqmx44v/14.1', '12raP4uocN1eED5VljBUaSKtovoVkkeMv9g4b64cuU9s', '', ''],
                'Giddy Up Go': ['GiddyUpGo', 'u0ms33ydb/16.3', '1cXNe9coh4FoJhVw-nY9YFr3Jfu5ibHUrAzyaSOoIC6w', '', ''],
                'Mythological Eye in Zurich': ['MythologicalEyeInZurich', 'u0qj986se/15.7', '1T5fdTCjEsIkXJZjosX9oUtWRAxXk1vQDhd6EPf1fi6U', '', ''],
                'Stettbach': ['Stettbach', 'u0qjeth3w/15.6', '1UEKE3NvB8U0g4-LF2tBsZeDW0YustmbwxGNZX-QU-rM', '', '']
            },
            'United Kingdom': {
                'Accrington Pals': ['AccringtonPals', 'gcw3f74r7/15.9', '1eD3mW4bJSkEpjqtOPV5J2Ycj_-fgKAyP38GyKJIgVFw', '', ''],
                'Addington Sunflower Garden': ['AddingtonSunflowerGarden', 'gcpupqjhp/16.0', '13giemkWpIS8chxoir_IfDptsI2AqJt0Of-WygIGebxU', '', ''], // London
                'Alyn Waters Easter Basket': ['AlynWatersEasterBasket', 'gcmvgr3n4/15.9', '1bKh96XwYzAgneDHmL8evwJrh4X8PJId9dvOQb6g5ZXM', '', ''],
                'Alyn Waters Easter Chick': ['AlynWatersEasterChick', 'gcmvgxw4b/15.9', '1NQAoDsA4ud0qnSOr-vOrp2nklyPPT2w-zDS8NEJrwUY', '', ''],
                'Alyn Waters Hot Cross Bun': ['AlynWatersHotCrossBun', 'gcmy5c1zh/16.0', '1tLu3KU7fBkmcHahnP3XJbvk-UPMYjkq2KqPNL9LM8WE', '', ''],
                'Angel Memorial': ['AngelMemorial', 'gcrwd62un/16.0', '1NBjLA2odEERxgw8Ku8_NyhTh5h7u-6jUxO1qlRRyxGk', '', ''], // [topic, memorial]
                'Ashford, Kent Clan Wars': ['AshfordKentClanWars', 'u10dgzhgs/16.1', '1KtmWM7NKEKMf9nhb2Zg3Kcz4ci9KAZXDZpRadbX2qTc', '', ''],
                'Bath Boat': ['BathBoat', 'gcnk3781r/15.9', '1ym8Sqb-aaP2fqDFCWFBvxDzS0kWAeIJyzJTY3ix1aSU', '', ''],
                'Bluewater Flat Blue Whale': ['BluewaterFlatBlueWhale', 'u10hwhngp/15.9', '1hE8-0N5yBKZBofJM-hs0tPJGfhOlZcjpat5y5uUhSWw', '', ''],
                'Boba Fett Halifax (Flats)': ['BobaFettHalifaxFlats', 'gcw9t3gcu/15.7009', '1Pf03otK63zDIMrM2H9z6aHglvQkTgVtuGKoiyouP6QY/edit#gid=760398990&range=A1', '', ''], // [push]
                'Bradford Pals': ['BradfordPals', 'gcwf32bek/15.9', '1AqE5f5M5Jlc3NLKzPLP5nBQ4YVf9Klos_sS9YPPOgUc', '', ''],
                'Bristol Balloon': ['BristolBalloon', 'gcnheuyvw/15.7', '14_kUt3Au3VeKsWkmvFt6Kw67OFdSXx80-IqzC_JGqhQ', '', ''],
                'Canvey Island Crest': ['CanveyIslandCrest', 'u10mjf4qz/15.7', 'A0CDC9FAD1654B12!2005&ithint=file%2cxlsx&authkey=!APVhYnV9od86yaw', '', ''],
                'Cavendish Kaleidoscope': ['CavendishKaleidoscope', 'u122q6hhk/16.0', '1gjpmWSbtcxZo1V6bb2P2x9wMUZ9Y9l5a_VzvP0iTNXg', '', ''],
                'Challock Chimp': ['ChallockChimp', 'u10ek7jr6/15.9', '1nDwoP3x0vl7hF6XRMQb7eN-ruuuGZCLpt_KDdIVoKfU', '', ''],
                'Coventry': ['Coventry', 'gcqfj58tr/15.6', '1zU3ETV2p8K2XFT9qxpF1_RbukMiRR0AXhP5eiyW5DoA', '', ''],
                'Dementia/Alzheimers Forget Me Not': ['DementiaAlzheimersForgetMeNot', 'gcrjbzyxv/15.8', '1O7W39uer11jQq-rBGPpQVP3lyLW_hWsZrJGtbXN86HU', '', ''],
                'Dorset Flag': ['DorsetFlag', 'gcn8tuz0f/16.0', '1nDx4cElvYmOGRL2wvZ1Xrp7iXxoqMbAuJXK9V1HLhKg', '', ''], // Bournemouth
                'Gillwell Park': ['GillwellPark', 'gcpvzftvj/15.2', '1KpL_cSZ8bjOGT8naLKlp92y7u4VIyeucirHWSBI3CHk', '', ''],
                'Golden Acre Park Allotment': ['GoldenAcreParkAllotment', 'gcwf7zj92/15.9', '1UJlkB0GJX-rQm5RSRvFipEQl1veUcLiEoGmY47AfhHk', '', ''],
                'Heathrow Flat Squares': ['HeathrowFlatSquares', 'gcpsykxuu/16.1', '1I5mgm7XWvPd9ZX93ZEDP3aHkvCXhBHNBpZFJlXyhvN4', '', ''], // London, Peter1980
                'Help for Hingham': ['HelpForHingham', 'u12en7fnd/16.0', '1YEL4efPszEmguM3XORlhbS4cbwtzL-5pSPlRkECRNyU', '', ''], // Maattmoo
                'HMS Victory': ['HMSVictory', 'u1270xz7f/16.0', '17xLZGOsbotBCSywsr7jJKRSoFhwMBz5fKAJhwokV8I0', '', ''],
                'I Spy A Spy in Stockport': ['ISpyASpyInStockport', 'gcqx85gu8/16.1', '1MhMdBK0usNl1kcvcZBwxMg2VQWXyMr6CTuF8MmOrJv4', '', ''],
                'Ice Cream Cone': ['IceCreamCone', 'u12v5t3b7/16.0', '18buO5-KO-MKNQLz2ceTLGauwRsvTcrG6B41RNNK0cvA', '', ''], // Sheringham
                'Just Smile London': ['JustSmileLondon', 'gcpvn9cq4/15.4', '1wmOlz3SOWBySUsdwzMn7r3baxoXeeIp5Gsa0S04SZyE', '', ''], // London
                'Lancashire Red Rose': ['LancashireRedRose', 'gcw3vt940/15.3', '1u4E41VmUxBWHBPL3G2FTT8Rtp1Sj72j7CDjuQVhRlT4', '', ''],
                'Leeds Beckett University Places': ['LeedsBeckettUniversityPlaces', 'gcwf5wwvy/15.7', '1CHtWzGnS348XHEMAb3_cbCy2dXxfWYLVaTkhJxpCd6E/edit#gid=3070864&range=G9', '', ''], // [push]
                'Leeds Beckett University Places (Flats)': ['LeedsBeckettUniversityPlacesFlats', 'gcwf5wwvy/15.7009', '1CHtWzGnS348XHEMAb3_cbCy2dXxfWYLVaTkhJxpCd6E/edit#gid=3070864&range=L9', '', ''], // [push]
                'Leeds Love Munzee': ['LeedsLoveMunzee', 'gcwfmbuwg/14.7', '1AwO3djDPwNpSXCBikoDsEhTmqH8vvXYmNBgIXBIp8U8/edit#gid=1129586155&range=A1:J1', '', ''], // [push]
                'Leeds Love Munzee (Flats)': ['LeedsLoveMunzeeFlats', 'gcwfmbuwg/14.7009', '1AwO3djDPwNpSXCBikoDsEhTmqH8vvXYmNBgIXBIp8U8/edit#gid=1236906681&range=A1:J1', '', ''], // [push]
                'Leeds Rifles': ['LeedsRifles', 'gcwfhgkdy/15.9', '1264P4xiyEn3SwElUroibP3X-_Hh0gsKlKm-NerWYOfo', '', ''],
                'LFC Bebington': ['LFCBebington', 'gcmze3dvm/14.8', '1XsQp1yAwG4QlnEKqKTGFLDfQu_45bI2bOPec1S11yjA', '', ''],
                'Little Burton Apple': ['LittleBurtonApple', 'u10eh36up/16.0', '1PTkJ4SfpTq_Lpiy-xuB56mdgC7XDHFdLoN3UhkNfQHw', '', ''],
                'LittleLotties 1st': ['LittleLotties1st', 'u134ceskk/16.0', '1RgbnfKSXNvOhiYQ_g98lbLycHiDdzOQb6zVgiT3TfXY', '', ''],
                'London Underground': ['LondonUnderground', 'gcpvk3gxr/15.1', '1Q2se3clBxfaFPRG99sHxwTikCuBrXhplE_BuZkiyKRM', '', ''], // London
                'Love Lane Patchwork': ['LoveLanePatchwork', 'u10eus8mg/16.0', '18tlb5bq13V3YcxaGaAyu1ZG9LG_4lCOlf7WOKOHUvPA', '', ''], // Maattmoo
                'Mad Hatter!': ['MadHatter', 'u134xd12c/16.0', '1qCkcX7ZcKITBbsnprkOWqgHLsEzdOSxq2u2dFstvdWI', '', ''], // Lowestoft
                'Monster Munch Minion': ['MonsterMunchMinion', 'gcwdnhxtq/15.7', '1lTC_T9mTKs3P_o1Tze26mEV3IgYSPtmSu34U_JhUEiU', '', ''],
                'Moo New House': ['MooNewHouse', 'u10hxcbzj/16.0', '1-OyD5skhIvadsgKtX6sX6u1BUxwuIqIxo47Z2hb55ig', '', ''],
                'Monk Stray Monk (Flats)': ['MonkStrayMonkFlats', 'gcx5pc4u3/15.7009', '1PV8v5BShVCdxvVmpaINRtCmjlaRg8J8vsZTcw2ff9tI/edit#gid=732562682&range=A1', '', ''],
                'Mr Know It Owl': ['MrKnowItOwl', 'u10g8jd71/16.0', '1ugXnAvsxf4FC3uYsPGGIkHEK1-KHDKDXsU8U1utDavM', '', ''],
                'Mr Nimby': ['MrNimby', 'gcwdmrzdv/15.2', '1hBrKYXgzdVYr_ndr4YaubPnQogYzRikQUGMjZBQHNN4', '', ''], // [topics] memorial
                'Nintendo Game-Boy': ['NintendoGameBoy', 'gcwdz3kh8/15.9', '1oNUhWu8bWnxn4BMFYmaITcGeXvyZzW93LwJGX8Yk8oM', '', ''],
                'Norfolk12 Memorial': ['Norfolk12Memorial', 'gcr2nzp5s/16.0', '10B-iuB6ERfSQMEJfJ-waT54QYhTQopEByvK4GY1b_OY', '', ''], // [topics] memorial
                'Northern Soul Keep the Faith': ['NorthernSoulKeepTheFaith', 'gcw0sj0d2/15.9', '1oRTtaFVn6FimZrY8AZszK99HbEYD6rCJ7n0r2CgDEcI', '', ''],
                'Northfields London Underground Station': ['NorthfieldsLondonUndergroundStation', 'gcpubz19c/16.0', '1y2ehQRDEpGwko_XWESY7hFvMD-DvPWihemuSoMmTUfc', '', ''], // London
                'Not Rudolph': ['NotRudolph', 'u134x3bsx/16.0', '1SQxGdZvyziZMdvvEjRtwJm_Oh_iLJqbhvJbcKW93EyU', '', ''], // Lowestoft
                'Oakwell Hall - What you Want': ['OakwellHallWhatYouWant', 'gcwc9yyp3/15.6', '1oFxND5qFQaaWIkwQ_OTUgGW1w0vTPa-1ohb0cU1LHLQ', '', ''],
                'Pegasus Lure, Rochford': ['PegasusLure', 'u10mrm5db/16.0', '1OIWGXfkQ1RmZHzNRcv3aoDC3TGsmGu5y17mkCfLXBQI', '', ''],
                'Pegasus Lure, Bedford': ['PegasusLureBedford', 'gcr8mpzxd/16.0', '1qouCAN_3mrfWtoj-yW_4dqNZBbufmXvbRtUqH_uzbro', '', ''],
                'Rekuci`s Butterfly': ['RekucisButterfly', 'gcpkjs74e/14.6', '1bDD9raLKauJSXr_k__KZkXI0al6Hz6vgmNC60jQl7tw', '', ''],
                'Robin Redbreast': ['RobinRedbreast', 'u12v5jy51/16.0', '1FB-p_ck3B0EvkLVAeVOcTfpZ3QnIvWRhpN0xBI83vsI', '', ''], // Sheringham
                'Royal Anglian 3rd Battalion': ['RoyalAnglian3rdBattalion', 'u12gmyvv8/15.9', '1-5UCwmxZmwft_Pw3G2ODRc_wj1H2KhdUYQGmoliQ6eU', '', ''],
                'Royston Rocket': ['RoystonRocket', 'gcrbpd4n1/15.9', '1KLz5olNq99KYcxcpHqNpNdhinirhSBqNK0MOfdbxIQ0', '', ''],
                'SCG Virtual Field': ['SCGVirtualField', 'u10t0j8cw/15.0', '1lPYtVMis22edg_zTWFSVnESCkh4YyAHwUtXqj3cYrL8', '', ''],
                'Seaside Ices in Cromer': ['SeasideIcesInCromer', 'u12vj9w2c/16.0', '1RLh4ISndbFYrGsLtvYkzCkUp-xM-o6RRpVWYI68LCqw', '', ''], // Cromer
                'Sheringham Jewel Square': ['SheringhamJewelSquare', 'u12v5m5ps/16.0', '17Bo4pFQuZgd4JfeoPkdrDoIZEEaw8iUNzJE0eQq26p4', '', ''], // Sheringham
                'Shoebury Virtuals': ['ShoeburyVirtuals', 'u10t1z1gj/16.1', '1HkIz8envkgyX2fbmgrioa-gEpovrxggKj6QdiCAjUCc', '', ''],
                'SouthStoke': ['SouthStoke', 'gcnk1sqv2/15.3', '1kinCWdN5SgtXUFdDx-Ys42RGRiowBsUrQk88K02xOk4', '', ''],
                'Special Olympics 2017': ['SpecialOlympics2017', 'gcqzw7tw0/15.2', '14MsPHkDMQ4W71hyIFuxV5BZx7bFDhmYhkAlgpdjhOOU', '', ''],
                'Stripy Flag': ['StripyFlag', 'gcpry9eun/16.0', '1-LBDF51YiRvAO8ts_AG82VX7JQgh4P3uDw-v_1H9l0U', '', ''],
                'Stroopwafel invasion in Andover': ['StroopwafelInvasionInAndover', 'gcngq3xm7/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Kingswood': ['StroopwafelInvasionInKingswood', 'gcnhxpp6s/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Thringstone': ['StroopwafelInvasionInThringstone', 'gcrh0updg/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Superpeggy`s Virtual': ['SuperpeggysVirtual', 'u134f33k3/16.0', '1ekP4hkILd3RlOaBYquf_aqzX965GU9o9YCzXBrpUO8s', '', ''],
                'Tadley JoyCon': ['TadleyJoyCon', 'gcphnhsrt/16.0', '16ENXTzq1Vi2_ze6aHaDX1lh-BfH89jRGMJa7Jb2GkMQ', '', ''],
                'The London Donut Cat': ['TheLondonDonutCat', 'gcpvr83c6/15.3', '1_cmHCdBfJC9ps3hxiPszz-8AVGHjEC0dEGGTgqaq82s', '', ''], // London
                'Todmorden Glider': ['TodmordenGlider', 'gcw984uvp/15.9', '1qfE4HZgebmqPp-XI3d-UbvyNcky5pLQLsuPnySf0WtQ', '', ''],
                'Uddersfield': ['Uddersfield', 'gcw9pns04/15.7', '1_LjmB_N5fbkPWKchLGDKPvPi_m8ss1y_2iXfFgSjjbw', '', ''],
                'Virtual Jewels': ['VirtualJewels', 'u134rkmgd/16.0', '1DckwKQHiVOHiSv15-NX7mzfzatXumsTYEDZ-9U1i6zA', '', ''], // Lowestoft
                'Virtual Love': ['VirtualLove', 'u12v5ubbu/16.0', '1ERVj0mTf1ASlIzK-H_GKqAlV9D6T-5mYRHRFC5EMv9s', '', ''], // Sheringham, Waves117
                '`Walkies` in Sheringham': ['WalkiesInSheringham', 'u12v56xvy/15.7', '1SjZ7uA9CmvxBYdkba69LTrvRV27MiAbTtAN_J-s0WHo', '', ''],
                'Whats that coming over the NVGE is it a ...': ['WhatsThatComingOverTheNVGEIsItA', 'gcpcmgtfq/16.0', '1oT6OATCr10PHrRqqOBsOrYfZLybudp8MMfguVgTzY6U', '', ''],
                'Woodhouse Moor Owl': ['WoodhouseMoorOwl', 'gcwfhkp5d/14.9', '1LN0ct_Kr_H8pwo1aXlOOT2iAjaxttjmWdU11Qxw5ru0/edit#gid=2072564893&range=A1:K1', '', ''], // [push]
                'Woodhouse Moor Owl (Flats)': ['WoodhouseMoorOwlFlats', 'gcwfhkp5d/14.9009', '1LN0ct_Kr_H8pwo1aXlOOT2iAjaxttjmWdU11Qxw5ru0/edit#gid=1683477247&range=A1:I1', '', ''], // [push]
                'Woodland Animals - Badger': ['WoodlandAnimals-Badger', 'gcpupxnwb/15.9', '1dIki24JeaqkH-PupNFBSKFMutF-DthT6wIzcHykbZVE', '', ''], // London
                'Woodland Animals - Fox': ['WoodlandAnimals-Fox', 'gcpupqxt9/15.9', '1dIki24JeaqkH-PupNFBSKFMutF-DthT6wIzcHykbZVE', '', ''] // London
            },
            'USA': {
                '2019 Texas Challenge': ['2019TexasChallenge', '9v6262nt3/15.9', '1Ot722Bm6rQ9dauli6jW995zdmNuxE2FCS-poQdoQvJg', '', ''],
                'Airport Lakes Park': ['AirportLakesPark', 'djn1vt5d5/16.5', '1AM3e8pQ-XPh_w7WqenZK9xIKsCSktFo3sKTZs1D9tYY', '', ''], // Orlando
                'Altoona Evos': ['AltoonaEvos', '9zmsbkdmd/16.3', '10Qe_IOxfh9SzZmqDBqWVTHNbfxPYuA-0i1tuykdOC2o', '', ''], // llamah, PeachesnCream
                'Apple Valley Eagle': ['AppleValleyEagle', '9zvww81r8/16.1', '19ws6xk_eFxgtADPCZfxp_oouQdYvQKVPGfQsCVK9lLY', '', ''], // Apple Valley
                'Atlantic Duck': ['AtlanticDuck', '9zk7tg974/15.7', '1EqalucVuUzDVYn1LCbvbhw2Xl6_ggZW_C8b0Rt-vGzE', '', ''],
                'Avocato': ['Avocato', '9vf6qbc6f/16.4', '1ksqeWGKy4yylwzUEjErfq05dCbs-ghMaJ296eJrGtI4', '', ''], // Weatherford, denali0407
                'Blues Munzee': ['BluesMunzee', '9yzgd9yne/15.3', '1CUmomkr2rPp3ZCij_Sup2fKbAAcZd5wlWf013qIvupM', '', ''], // Saint Louis
                'Brandi`s Butterfly': ['BrandisButterfly', '9t9pegnty/16.2', '1Mye8Z3rOYIyMMhozr7-RYKn5R-iOvG-5aAdthsIV6WQ', '', ''],
                'Breakfast Time!': ['BreakfastTime', '9yzs200er/16.2', '1tT0FZFseBSvSQhNPQHBTmB4TXqyXFiIXynDI2r1D6OA', '', ''], // O’Fallon
                'Bright Colored Horse': ['BrightColoredHorse', '9vfdprxcn/16.1', '1FVne3eZU0yA8ZnkDoYccQ_D_Yf7nnpHsH7zrFXuSK2Q', '', ''], // [push], Fort Worth
                'Bright Colored Horse (Flats)': ['BrightColoredHorseFlats', '9vfdprxcn/16.1009', '1FVne3eZU0yA8ZnkDoYccQ_D_Yf7nnpHsH7zrFXuSK2Q', '', ''], // [push], Fort Worth
                'Bubbles': ['Bubbles', 'dnq95mfwp/16.0', '1alJZ-mOETcHJLlNpGz2v_j-EHddc4SjNn9ZFUsoOBJ4', '', ''], // Concord
                'Buckeye`s Grad Cap': ['BuckeyesGradCap', 'dp5u4kbq4/16.2', '1IlP89mLDHFYeq5imuVkNdwICLvhMekfph5WZjQaBkAM', '', ''], // Greenville
                'Camo Heart': ['CamoHeart', '9yymdqj77/16.1', '1_t7cVP8kUHumt1yBeBPUgdzcQw8zCZLOo88_-XDKXhs', '', ''], // Columbia
                'Canon City': ['CanonCity', '9wv4y54hc/15.9', '1dGEdc4L7fju9sMqDS4Xpb8k1n-EGvi4ikAIprZSbjTA', '', ''],
                'Cedar Rapids, IA Flag': ['CedarRapidsIAFlag', '9zqy9ykqt/16.1', '1AFYsCyZ2Q7zXRSy33503bpFcvUj0RqgeHYft-v6Uu6U', '', ''], // Cedar Rapids, rodrico101
                'Celtic Knot': ['CelticKnot', '9yzs2r3b7/16.0', '1Ayk16teU9Un5ignws3sti5ObAW26QzKVAk5IsmitLMc', '', ''], // Cottleville
                'CelticSnake': ['CelticSnake', '9vk4uqw9m/16.2', '16_IPkJ87HAsJ7ZKB0yAk1v2n1PCJ9BpJ0AoXGx_tX6I', '', ''], // BonnieB1
                'CF Pumpkin': ['CFPumpkin', '9zw3b0pd4/15.8', '1RWBmeFYaQOMbyiADiP1d7vAoXM1uQnmhC6UEOoR89hU', '', ''], //markayla
                'Chili Pepper Fort Worth Mega': ['ChiliPepperFortWorthMega', '9vfd39c67/16.2', '1nDxPYLXaMCTmidIjc4Bxkz-lUgQk1uQbZlc_LmIvttM', '', ''],
                'Color the zoo': ['ColorTheZoo', 'djf8kvc9m/16.2', '1_URJCQ6efxulNSwZiXHFVlPWZhMYgb9jl7q_EMSsNKc', '', ''], // Montgomery
                'Columbia Flat Lou': ['ColumbiaFlatLou', '9yymdc1x9/16.2', '1X02S79bhEfvNDvIo1DUc5NqvP4JiQdGY47PepOS-C6I/edit#gid=826230316&range=A1', '', ''], // [push], Columbia
                'Columbia Flat Lou (Pink)': ['ColumbiaFlatLouPink', '9yymdc1x9/16.2009', '1X02S79bhEfvNDvIo1DUc5NqvP4JiQdGY47PepOS-C6I/edit#gid=1646850004&range=A1', '', ''], // [push], Columbia
                'Como Park Shamrock': ['ComoParkShamrock', '9zvzb7crp/15.4', '1Cf-nXNodpSRRVbCSQFTjv4JDJAi3UDkw7De9aJtEZ-E', '', ''], // Saint Paul
                'CR Frankenstein': ['CRFrankenstein', '9zqyb98mv/16.1', '1Xjchz0lat1rb44QSGVuOUCpJmYjko7mnehr9gI_KCRg', '', ''], // Cedar Rapids, rodrico101
                'Crahen Valley Rainbow': ['CrahenValleyRainbow', 'dpehscnex/16.0', '1-PryQX-fh1F48d97CJEIuSNJG1VnVmk2p_6EUlVE5CM', '', ''],
                'Crossbow': ['Crossbow', '9zfzt6nct/15.7', '1hcloNWsU1z-mb80ARbm4mq1i-vpDUL1MXzu8rgAcYrg', '', ''], // Watertown
                'Crossed Arrows Owensboro': ['CrossedArrowsOwensboro', 'dndnc6w0p/16.3', '16TvtDToPVIkgs_UD7F1xk-PRwyPhkmE7m9y-Wcgrwz8', '', ''], // Owensboro
                'Crowing Rooster - Dassel': ['CrowingRoosterDassel', 'cbhbtb6qs/15.6', '19a8-ismevKB4ZmtSduXRpL1V5qVpkoLHpQWoMJCV-tY', '', ''],
                'Curiositea 7 Buffalo Creek': ['Curiositea7BuffaloCreek', 'dp3rvfbtc/16.1', '1qj2JUf9KRW5I1zYn76HA9MGH1PiR0T39tcPtzi-VeJI', '', ''],
                'Des Moines Greeting Cards': ['DesMoinesGreetingCards', '9zmktsu71/16.3', '1poXAf6ytli4KOQt8LlEraX92yE3hBrjklI7tvv1xAQY', '', ''],
                'Des Moines Rover': ['DesMoinesRover', '9zmkz1quq/16.0', '16jElpgf4ojbsoFXCeBDhDxUDDeJCsZ2jQ4dZkNLesmA', '', ''],
                'DSM Halloween Witch': ['DSMHalloweenWitch', '9zmkmud77/16.2', '1Z2gg91m-iCidadfBoLRvN7DpE16bpsQXwwkvU-_EB6I', '', ''], // llamah, PeachesnCream
                'Dragonfly': ['Dragonfly', '9zr0ny7yb/15.7', '1e45awLuhtC0xWY-Po7r6EXWXuG2sjSLtuvUBDY5wquQ', '', ''],
                'Duck Hunt 2.0': ['DuckHunt20', '9yteew1jy/16.3', '1LHYKJGsdCbIfbJ3qYSktL5_qbjra2caGbH4tUnntGkI', '', ''],
                'Easter Munzee Pin': ['EasterMunzeePin', 'dnqg4z2cq/15.7', '1icdx_hx6MYGoJs9jGLvdaiJ0loVUeSh1G_5EAvqHfGY', '', ''],
                'Electric J-Hawk': ['ElectricJHawk', '9zqy9rtfs/16.2', '1vFTvCmsllsDlou539rujoNMaH-R81m4j7lRqlPrc3hs', '', ''], // Cedar Rapids
                'Electrical Evolution': ['ElectricalEvolution', '9z7dvdwq0/16.3', '1hBVM8zHQRRhIyUQ8a-RxrTN9bO-oOwp9ZpfI9CIrdcs', '', ''],
                'Ellis Creek Owl (Flats)': ['EllisCreekOwlFlats', '9vf6wcht4/16.4009', '1Vw34xTOP8v3fQuWM2NaXecX-7wEMcGUsfLqjatjDHnM', '', ''], // [push], Weatherford, denali0407
                'Elvis is Hot Mega': ['ElvisIsHotMega', '9vf9zjr5y/16.2', '1vGrEfMAgrenALb4jFybDLJxzlwP96KCYfsshXuf7Beg', '', ''], // Fort Worth
                'EMS Star Of Life': ['EMSStarOfLife', 'djq52wmkd/15.7', '1rtGrVXgB41c6UgMugAbToH80JqWvbFDKWWejHILEWqY', '', ''],
                'Evolution of Beaumont Texas': ['EvolutionOfBeaumontTexas', '9vmh03g67/16.2', '1-UZyDojujZBBJVIzDrRp-p9ZHPhOxK6u4VRLCUGjuq8/edit#gid=0&range=A11', '', ''], // [push]
                'Evolution of Beaumont Texas (Flats)': ['EvolutionOfBeaumontTexasFlats', '9vmh03g67/16.2009', '1-UZyDojujZBBJVIzDrRp-p9ZHPhOxK6u4VRLCUGjuq8/edit#gid=1459448322&range=A11', '', ''], // [pushg
                'Farmington Tiger': ['FarmingtonTiger', '9zvy07ef6/16.1', '1wDuhgJMDbguJ9nTOZG6E8NxLXi9EkJQHBDUpcIR9mLA', '', ''],
                'Flaming Jalapeño Popper (Flats)': ['FlamingJalapenoPopperFlats', '9vfdmfyjp/16.0009', '1MKVpEznMHHxNBYp03H47WeUKBr4FP1Qy0EwO_Od3EVg/edit#gid=588617462&range=A1', '', ''],
                'Flat Lou in St Lou (Pink)': ['FlatLouInStLouPink', '9yzsk2db8/16.0009', '1DDC9ld4HjJzLCUCdtxgsJyyVng0e5-0ZpdDNgZFGg3s/edit#gid=359968140&range=A1', '', ''], // [push]
                'Flat Object Annex': ['FlatObjectAnnex', '9yzse5epk/16.1', '143ygYtqFYivC4xewkqsiU5VEp5NX8BcQ7DQgMRDxuxI', '', ''], // Saint Charles
                'FlatDancing': ['FlatDancing', '9vf9zm46j/15.6', '1CVyPfKnUQ8-pBfy-CEDybNQd7Q6EGAO5hfkQqXaVCFk', '', ''], // Fort Worth, BonnieB1
                'Flats gone fishin`': ['FlatsGoneFishin', '9ytev0ux1/16.0009', '1YSbopLgPlNhUKRA0FkD-p9U6NPF9rAlI9tS0mItLSFc', '', ''], // [push]
                'Flats in The Bone Pile': ['FlatsInTheBonePile', 'c815cdfpf/16.1009', '1MDUEBlnbq_o30SaF3xKZpfdGrrZEDj4i2v-mfWZmDBc/edit#gid=743080247&range=A1', '', ''], // [push]
                'Fleur De Lis': ['FleurDeLis', '9zveve6e0/16.0', '1VJvb1iqFJYPtYE0TC8rQihCbcjcLkmRKrVZjLm7N-v4', '', ''],
                'Flying MUNZkey': ['FlyingMUNZkey', 'dppmnj0jq/16.1', '1gIvUz2E5123w3dXul8P3WOUjbLNjSBpdKljRDNU5y8M', '', ''],
                'Fort Myers Alligator': ['FortMyersAlligator', 'dhtz1nqsr/15.9', '1z93Y4-SJJvF3xiPKW45lDEC5c6krtXFu03abyzZp9h4', '', ''],
                'Fort Worth 2020 Dumpster Fire': ['FortWorth2020DumpsterFire', '9vf9xtnkc/16.0', '1I8FNMAO2Rq_xxUR48zFk_1UDxnKSGTJEz_quTOijDbk', '', ''], // FortWorth
                'Fort Worth Fighter Jet': ['FortWorthFighterJet', '9vfdr7e5w/15.2', '1gNBZZ-YoPrP7cwfNnRRFISlsyi3mAbdc8QbLOpvMxDs', '', ''],
                'Fort Worth Rootin` Tootin` Munzee Cow': ['FortWorthRootinTootinMunzeeCow', '9vff34f4q/16.3', '1RbaihJYzfxQsejWnvlfav36Rw8PTvu37dUB_gsUhBUA', '', ''], // Fort Worth
                'Fort Worth, TX Cowboy Boots': ['FortWorthTXCowboyBoots', '9vff2xznz/16.0', '1UBt9WaCiisz6DH6uJCjr83IB5WI91TyGhu04CbIA2IE', '', ''], // [push], Fort Worth
                'Fox Hill Fit': ['FoxHillFit', '9yzsuf5pu/16.2', '1W9i6GBq0KmDd--2rFH9o2r_uNoyCtMMg77tg7QyzkUQ', '', ''], // Saint Charles
                'G 62 West Evo': ['G62WestEvo', 'dngc4yqbr/15.8', '1YAa0cODBQ7IIUYG4Tm0SPsGTTxs6Vq1gX6OPEE1aHho', '', ''], // Georgetown
                'G Candy Cane (Flats)': ['GCandyCaneFlats', 'dngch37ny/16.1009', '11WfZ_IHWVNq9GMsLvpmMdzn-d-eoc0BDwSdlQhhiik8', '', ''], // [push]
                'G CHampion Way': ['GCHampionWay', 'dngcknw6w/14.8', '1sX9jw3-LoovXR6OqWNl03qCPV-YXZCtjHT8J7damks0', '', ''], // Georgetown
                'G Evo Belt': ['GEvoBelt', 'dngc72cf6/15.3', '1qkOia7uQqWG7eLc9h5aROIBiOb5mV7v7yqEkRSWv7o8', '', ''], // Georgetown
                'G Gaming Table': ['GGamingTable', 'dngckw4bb/15.5', '1AllrdEEz2uks6Vnh7Q5tt0ZthrxNZi_iACo7EL7hrkA', '', ''], // Georgetown
                'G Harmony (Flats)': ['GHarmonyFlats', 'dngc5yuwh/16.3009', '12sc9F3P2wWD_kOh_focOhL1nZJFKmYBPArI0RmCH-_g', '', ''], // [push], Georgetown
                'G Morning': ['GMorning', 'dngckp9qj/15.1', '1mMbwafIGb8VcCoH-_fIPJkR7X79yYXsTdl8dB8OJ6gs', '', ''], // Georgetown
                'G Pumpkin (Flats)': ['GPumpkinFlats', 'dngce8yzz/16.2009', '1nmIfJmtDZ9eTvOrdvrG0gS1Wvmqbd9rox5iAc2BCRW0', '', ''], // [push], Georgetown
                'G Shamrock (Flats)': ['GShamrockFlats', 'dngckpu1t/16.2009', '1kOHvBUG-odmV77-dldLVfSrm9fIIkjtw1GRq0k_XciE', '', ''], // [push], Georgetown
                'G Shifty Jewels 62 West': ['GShiftyJewels62West', 'dngc70vt6/15.1', '15y_jeT6br47df19ok2qiQtDYCnvE6i-Ou2qBQ7xc_P0', '', ''], // Georgetown
                'G Southland': ['GSouthland', 'dngck0p7f/16.0', '17Ku7M9_dyNMiLC-tnstUp4RLoU7EtVdIo4E_expVn14', '', ''], // Georgetown
                'G Toyota Crossbows': ['GToyotaCrossbows', 'dngck5pff/14.2', '1L8PFohApybBqAm1omOYQZgrNjm4fq-wZ8fQfLnbMq98', '', ''], // Georgetown
                'G Toyota Crossbows Biggy': ['GToyotaCrossbowsBiggy', 'dngck1ncz/15.2', '1W2V8pBW9EuqEZm-utGkxyF3vqhq2QonajD2-2ew7y6I', '', ''], // Georgetown
                'G Toyota (Flats)': ['GToyotaFlats', 'dngcs2y4b/15.8009', '1ufiZlfwEG2MsWcBMBHVu6fI3Jc38ktxJ--3bWqMy7OY', '', ''], // [push], Georgetown
                'Geowoodstock XVII Texas': ['GeowoodstockXVIITexas', '9vfcbxwtn/15.8', '1kHK_RqTkm9DPx1obT4BobMVEN8kExuXABAGola9CRZI', '', ''], // Fort Worth
                'Get Well': ['GetWell', '9yzgf1b6z/16.2', '1wnKEAUFPm_xwiiy4zguvpTg8-ZLz4xdFc3jIf_dzSGA', '', ''], // Saint Louis
                'GR Meijer Farm': ['GRMeijerFarm', 'dpehjsmjd/16.1', '1KGbCzJg-sfUSaw6EWU9IMgJHakaYlM019IQTp6HpbE4', '', ''],
                'Greenville Evolution Square': ['GreenvilleEvolutionSquare', 'dp5u3bp1f/16.2', '1ENPBe2iWqUbIFBQaN-kaDEnQElUV7eMpYe9Jt56jCDQ', '', ''], // Greenville
                'Greenville Flat Surprise': ['GreenvilleFlatSurprise', 'dp5u4p5bc/16.2', '1xLM0yOuVYNWWw_ChP3oDnT8mf4XQjQxj_qgGeJiNCEg', '', ''], // Greenville
                'Greenville Ohio Lightbulb': ['GreenvilleOhioLightbulb', 'dp5u4jdkx/15.7', '1DZajKWnzX7Gubom5NLxwaHIrCgWoLo0JggTPNLICXJc', '', ''], // Greenville
                'Greenville Ohio Spirit Trophy': ['GreenvilleOhioSpiritTrophy', 'dp5u4pntu/16.1', '1OqNIPovIvBBlaS0KtZStTMkaesEEQCXnC69MfpMXoNQ', '', ''], // Greenville
                'Greenville RUM Circle': ['GreenvilleRUMCircle', 'dp5u45yhh/16.2', '1SkQTcWzNLVGc0BGJaGbcQvn86l2E3Mkwcpjos0p139c', '', ''], // Greenville
                'Greenville South Carolina': ['GreenvilleSouthCarolina', 'dp5u60nmr/16.1', '1tBYYWU4hcmSCEo_jddPr85hmpjJrtvh9_nsKBmdJaG4', '', ''], // Greenville
                'HGH2 Memorial': ['HGH2Memorial', '9vffcyrdj/16.4', '1L4fdYDRPxZbdHM5ggDBtBaQYbl1sxmClwHYy1z2tkEQ', '', ''], // Fort Worth, topic (memorial)
                'Hank`s Boots': ['HanksBoots', 'djf8hr6up/16.2', '1zUG6-mHwovUCUDBKb4XlCzi_Rdscuu-z6gRjSaeCxkE', '', ''], // Montgomery
                'Happy Holiday 20': ['HappyHoliday20', 'dng1swr9f/15.5', '1bvkFI3tadgkfDFoESP-2WxlSXzHewuAfirj2EqTVLgk', '', ''],
                'Hawk Hill': ['HawkHill', 'c80gjz16x/16.0', '1AL_RRB6vVhmUVsiUpj5GdMeu74F-oC_Atn9e0hQyMmM', '', ''],
                'Hazard Spur Campton': ['HazardSpurCampton', 'dnswdtbdw/16.2', '1M8HyfteJKT4ckhnlIRiVZ86GGbOEXOGhZJs1Sh2PB6E', '', ''], // [push]
                'Hazard Spur Campton (Flats)': ['HazardSpurCamptonFlats', 'dnswdtbdw/16.2009', '1M8HyfteJKT4ckhnlIRiVZ86GGbOEXOGhZJs1Sh2PB6E', '', ''], // [push]
                'Heart of Spring Hill': ['HeartOfSpringHill', 'djj3c8xm5/15.6', '1uao99lFSqHEyRpq8PKdHxDNKpA4G2IltN3xIz7kK_7A', '', ''],
                'Hey CupCake, Burnsville': ['HeyCupCakeBurnsville', '9zvwtfcc2/16.1', '1FLgPKNN4_fPn_k72G9Bt1tij5LNzra9ipL52hpaCC-Q', '', ''],
                'HowellViking': ['HowellViking', '9yzs2dshg/16.2', '1TBhbKJFBVx7j4hlycw7ySW7jQPrsGVoYgTdxmp4DajY', '', ''],
                'Ice Cream Cone': ['IceCreamCone', '9zmkr13zc/15.9', '1VsrxHD1goB-0CGfAB0RSlv0yWRwprQMaQ76r75rjPnQ', '', ''],
                'Iowa Veterans Cemetery': ['IowaVeteransCemetery', '9zmhq5k8w/15.8', '18hKQff6VoJT7jGN_sounTkqKPwBKR7g7n9fKfrNTY0A', '', ''],
                'Jax Football 2014': ['JaxFootball2014', 'djmuw23fh/16.1', '1Nyeo4JzE6cVbg8MgdwKaqyFs2Lef3hZKKp4JoyR_gUg', '', ''],
                'Jaysville Flat Circles': ['JaysvilleFlatCircles', 'dp5u6betv/14.4', '1OxMrmq1d-knvO0tdyGBpqsLDQr7PFcomG60mBH68Rjk', '', ''], // Greenville
                'Jewel Jack-o-Lantern': ['JewelJack-o-Lantern', '9vfg0svk5/16.2', '1AGl8NxV-uyk0bNf1WxrzPK_LvvWXV83jCfqenf_4yYg', '', ''],
                'JunkArt': ['JunkArt', 'dp2wth50p/15.6', '13uR4YVcTZS5F9HOTrtKaAgYESHrBtyrPb1sUa7Eoy0k', '', ''],
                'Kansas City Panda': ['KansasCityPanda', '9yuvbucpq/16.3', '1cBRYXhTdBsqTB83TN6Vxfhm40pqkYUaabbjxGlEVJDo', '', ''], // Kansas City
                'KC Shield': ['KCShield', '9yuwr9rt5/15.9', '12Sg4ikZdcF0ej4u4MTnx_L496oyk9RG5qXl7OWFuRR8', '', ''], // Kansas City
                'Kirkwood, Evolutions - 1': ['KirkwoodEvolutions1', '9yzeqxeqn/16.0', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=0&range=A1', '', ''], // Kirkwood
                'Kirkwood, Evolutions - 2': ['KirkwoodEvolutions2', '9yzew8ewz/16.0', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=707330650&range=A1', '', ''], // Kirkwood
                'Kirkwood, Evolutions - 3': ['KirkwoodEvolutions3', '9yzew83ct/16.0', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=276667766&range=A1', '', ''], // Kirkwood
                'Kirkwood, Evolutions - 4': ['KirkwoodEvolutions4', '9yzew3ppm/16.0', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=842989634&range=A1', '', ''], // Kirkwood
                'Kirkwood, Evolutions - 5': ['KirkwoodEvolutions5', '9yzewbe6d/16.0', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=1278849387&range=A1', '', ''], // Kirkwood
                'Kirkwood, Evolutions - 7': ['KirkwoodEvolutions7', '9yzew9k4j/16.0', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=1456234098&range=A1', '', ''], // Kirkwood
                'Lake Forest Mixture': ['LakeForestMixture', 'dn4m4d3gj/15.2', '14ucWXy-jMb5DUefu_E-_iBwkfb2UAMDWv-_SmNvq9lM', '', ''],
                'Lakeland, FL Honeycomb': ['LakelandFLHoneycomb', 'dhvxrn9jn/15.6', '1U7B_lFvSelY8_10rthYewsiXHZS4MuZttq-M5GNQWtI', '', ''], // Lakeland
                'Lakeville`s Sea Turtle (Flats)': ['LakevillesSeaTurtleFlats', '9zvwq5uf3/15.4009', '1BdmycjSniytBg9rbDo1ABVIyrNM7KkwZZSbADIp43vs/edit#gid=2044209526&range=A1:H1', '', ''], // squirreledaway
                'Lakewood Prizewheel': ['LakewoodPrizewheel', '9zvxsgvmr/15.1', '17xRj9aYg5D6cKwyocOwZX09Z8CYP5jwXqgXvbbYoLXg', '', ''], // Minneapolis
                'Lexington Surprise': ['LexingtonSurprise', 'dnqg4zcny/16.3', '1UpNAML5v2zrJCPecS41Khi9_vpV9unq_LZ95FFJLoNc', '', ''],
                'Lightek`s Minnesota Wild': ['LighteksMinnesotaWild', '9zvwrt9px/15.7', '1JcZulDF5GjpPuGL5l0xn45xI9SpmaWhpSLNL3w0d_es', '', ''], // Apple Valley
                'LOL Evolutions': ['LOLEvolutions', 'djj2g0xuv/16.3', '1gs71OHcSQCFZd42t-8gTID6Giv65E9ZsnyXmrYTN7YY/edit#gid=1400258494&range=A1', '', ''],
                'LOL Weapons': ['LOLWeapons', 'djj2e8fc5/16.4', '1gs71OHcSQCFZd42t-8gTID6Giv65E9ZsnyXmrYTN7YY/edit#gid=0&range=A1', '', ''],
                'Maine Weather Balloon': ['MaineWeatherBalloon', 'dryg6gxs7/16.3', '1PYF9CIibrvJWR65rKvyISYslFZWLJAlH0eQZNHaB6EE', '', ''],
                'Mansfield Muru': ['MansfieldMuru', '9vfcmc50m/16.0', '1wrVzoq2-YQb8oJKOndAIVK41maA0KSsZDVJ9KX7XHE0', '', ''],
                'MapleGolf': ['MapleGolf', '9z7duvhge/15.7', '13et59DMhefKqwdhZ1GhYkFlsXtQIwq7OrtTN2u1mch0', '', ''],
                'Mario Fireball Void': ['MarioFireballVoid', 'drtedxmgm/16.0', '1AOUKyBI2GWTI8iMaUMRPM-TjSwlSEjCpu7LbHMup7co', '', ''], // Amesbury
                'Mario World': ['MarioWorld', '9yte5xdfd/14.9', '1Sol4LGKK1HoZbZFs30KNKvZajyrFXBFiOJYdAKMX7Dg', '', ''],
                'May Birthday Candle': ['MayBirthdayCandle', '9zmkz4xx8/15.9', '1xw0rd6mOAIxFtUQMK-PAPBx3eK7WeoUP8Nvfa3fb-PM', '', ''],
                'Mermaid Park Hibiscus': ['MermaidParkHibiscus', 'djj60zrxf/16.3', '1_y5QuFf5bUueMh5gVG4MBhhl86w3k_5GPKMrFm7QkYo', '', ''],
                'Michael Myers Halloween': ['MichaelMyersHalloween', '9vghzj03h/15.2', '1FxjwGUuKym6YcNTesdoRq1-Y-fbUQJpM9RGi9E-Q7XM', '', ''], // McKinney
                'Mizzou Tiger': ['MizzouTiger', '9yymdf9bz/16.0', '1km5kfHyZHz2-SpvRwITpTrXYV1Kh12JjL4UXbXT4vXQ', '', ''], // Columbia
                'Monrose Rose': ['MonroseRose', '9zmkq7wrp/15.7', '1EsUyY_bmTcMvttmEXuMHWsjWl5oyJBEHZplYmLq8wf4', '', ''],
                'Montani Semper Liberi': ['MontaniSemperLiberi', 'dpp1s833q/16.1', '1fkiDWSKGKce2BVV6adFHyI9rMNe0a09pyJjdrR5m59M', '', ''],
                'Montgomery baseball (Flats)': ['MontgomeryBaseballFlats', 'djf8hp7k0/16.4009', '1zWLEIVL9XaaMNzSyWlMErhCmldS5UN3kbWsSYqVWoYA/edit#gid=694393706&range=A1', '', ''], // Montgomery
                'Montgomery Chili Pepper': ['MontgomeryChiliPepper', 'djf8jkbv0/16.1', '1-CT-Zi3_NXCUHSvnA2fUOBCcJqcDKSPcmrlqcYp204c', '', ''], // Montgomery
                'Munzee Birthday Cake': ['MunzeeBirthdayCake', '9zmkq8tny/16.0', '1r7iX4_rgO-_zKnU1BWU4_9qlFjoQR4pTn3dSxux3OhY', '', ''],
                'Munzee Logo': ['MunzeeLogo', '9qh0kzrek/15.6', '1gJ-XzslXgPFfcYPtWQ1VgZ5c_a680S-_K2F-b5W5XBU', '', ''], // Anaheim
                'Munzee Mania 2019': ['MunzeeMania2019', '9zvwzxy7x/15.8', '1W7wvV3ViY-t9Mtala-21gg3gTkaAdQ-W6K_eJEOyPHM', '', ''],
                'Mystery Machine': ['MysteryMachine', '9vfdpwx10/16.2', '1GBfeZaUSk70kY24P3Tl8w99wf0GziR4CjaxngJ5S2dU', '', ''], // Fort Worth
                'Napa Wine': ['NapaWine', '9qc407rks/16.1', '1LBzuqrKTYyxFc9Xx2sFULS4qPQ-_7eLwN4AkswoRudM', '', ''],
                'NE One Alien?': ['NEOneAlien', 'cbj8nmyg8/16.0', '1g2bmVnx42Os9gct3dNZWWXFX1sD0LIDXS059WcE_B6c', '', ''], // Minneapolis
                'Noblesville Taco': ['NoblesvilleTaco', 'dp4gfcyd1/16.1', '16PpPHxDKVuZBzE2XPNnyGcCLnScFCCERrFfzILQ-6Mo', '', ''],
                'Officer Down': ['OfficerDown', '9qh0wz62r/15.6', '1rD2Q_V2xE5j2zAIJJaIFLOle-lIIDVqN9dnZ0DKhefE', '', ''],
                'Owensboro Riverboat': ['OwensboroRiverboat', 'dndncu1bx/15.3', '1rOi0cu_ORxL65jAbSmHI_1VVk_LY_S3AmvNjuOtFaSI', '', ''], // [push], Owensboro
                'Owensboro Riverboat (Flats)': ['OwensboroRiverboatFlats', 'dndncu1bx/15.3009', '1O9KwjRx7Fp5yBAMzEXFVkgsxXsQe_jtA4zXwmHOnkXA', '', ''], // [push], Owensboro
                'Pirate Hammer': ['PirateHammer', '9yzseyjy6/16.2', '1bINIVmmlredD41Go-9tz4RkLoPbcOe191IxZcwPeuzI', '', ''], // Saint Charles
                'Popcorn': ['Popcorn', '9zqz553b0/16.3', '151TcN_THK90rRR_qCXBDDTIVRc_3wvJX95V3t4bdkXk', '', ''], // Marion, markayla
                'Pot of Gold': ['PotOfGold', 'dngckkwpb/16.2', '1XVE-7bFFrNj_qv-gkIJsBKefEGGvPqQTHnmVY8VY4rM', '', ''], // Georgetown
                'Prattville Pansy': ['PrattvillePansy', 'djf88xhm3/16.2', '15Tp1VCvE12hCnT0GEUIHj3njAyizKD47kWn5Ch7RU7A', '', ''], // Prattville
                'Prattville Trillium': ['PrattvilleTrillium', 'djf8bbhmk/16.0', '1tmd3qEP_424x_NqrkGLLYaSchvRYNTZcPh7voIf0ZSI', '', ''], // Prattville
                'Prescott Cardinals': ['PrescottCardinals', '9zyn8e7ff/15.6', '1ceMtwRH-YelhhanMQUcrP6OWm5e66UogdW-MM5qjFLc', '', ''],
                'Puppy Play Pen': ['PuppyPlayPen', '9zvz1pm3j/16.1', '19AQkmlf0_oCvIItX_ZIRHkp4BfEw8NiZzKcS1PSyZ4I', '', ''],
                'Rabbit Hedge': ['RabbitHedge', 'drsbweu15/15.2', '1-w6DXflgiEXL6ipbURvX2wKNHt8kmuRAEOVsZp37XXw', '', ''],
                'RIP Terry - Palmetto, FL': ['RIPTerryPalmettoFL', 'dhvhxu07j/16.1', '1stUC8wTQl2eGekLE6kJRx-DJsUVozZgCgin3HDeqLMU', '', ''], // topic (memorial)
                'Rob vs Matt': ['RobVsMatt', '9vfdmckq6/16.3', '1SBsD1orO1d2LluaYjDXvsYf-Lco1soaIsB-FzxLX26Y', '', ''], // [push]
                'Rochester`s Corn Water Tower': ['RochestersCornWaterTower', '9zy62tt99/16.1', '1q5P-6nqvzoWCJLymjDQHG6xxMgHcSNSo01o8pMSMUtU', '', ''],
                'Rocket23': ['Rocket23', 'dqf60rz1x/16.1', '1iPaL--7DiS4ToFEYgzYf8yJpcGnD613SrDnsk0JCrBA', '', ''], // HiTechMD
                'Rover Pin': ['RoverPin', '9vgk91cyc/14.2', '1osdfjUjcA7LaD6cVHs_qhQmQLqFCp6RpskyLIZxE32I', '', ''], // McKinney
                'Ruh-roh--RAGGY!!!': ['RuhRohRAGGY', '9vfdpmzmh/15.5', '1tzaw2r72P5iGlAQFaeQGkCYGjQrB2OrJvG2Q89AdkXc', '', ''], // Fort Worth
                'Rum Border': ['RumBorder', '9yzssr8dc/16.21', '1EHZt81jClIKFvM21IIey4TeD6t93MGBwu7mRkU1ye7s', '', ''], // Saint Charles
                'Ryan Hummert Memorial': ['RyanHummertMemorial', '9yzg8tzc6/16.3', '1NrEISzPaFF91XVFUBI5eCcAfi5m-i8zydJiCSE1bL3U', '', ''],
                'Scooby Doo Crossbow': ['ScoobyDooCrossbow', '9vff0pt1t/15.2', '1gPr_DrteOSaQ93ZlcxzLAsP5sAnDO4QTx0k_hcmLTgQ', '', ''], // Fort Worth
                'Seattle Crossbow': ['SeattleCrossbow', 'c23p1jkzk/16.0', '1W1P9SMl2hMOEnFVrJdHX37-NkXFm7jADbdjN--fJzZ0', '', ''],
                'Secondary Complex Everything': ['SecondaryComplexEverything', 'dpefc2mr0/16.2', '1JlYvGwxfPDw00aSXdX8laB6jLzxKRIPFZessY4hScSo/edit#gid=1604873902&range=A1', '', ''], // [push]
                'Secondary Complex Everything (Flats)': ['SecondaryComplexEverythingFlats', 'dpefc2mr0/16.2009', '1JlYvGwxfPDw00aSXdX8laB6jLzxKRIPFZessY4hScSo/edit#gid=1033329138&range=A1', '', ''], // [push]
                'Shaggy': ['Shaggy', '9vfdpzmgu/15.6', '1WCFA-GKfaX15o3Q7IdHVUYMvCW7d_AeuSTZ5SolSXls', '', ''], // Fort Worth
                'South Padre Island KOA': ['SouthPadreIslandKOA', '9udukgtf8/16.5', '1Mjlw74tPEJ05UJN-qRHHlfvb3w4H_0X3ss5jTH-6Iv4', '', ''],
                'Springfield is Evolutionary!': ['SpringfieldIsEvolutionary', '9ytet547j/16.1', '1AXJooie8CqLCQhRgxg5ovavMkEK10x4ccopB1afZClE', '', ''],
                'Spy Goggles': ['SpyGoggles', 'drtef1j4r/16.3', '1U-K5KqdO57azZKaBAvpWY3v0Jqv8OBBA8np9Y1lkicA', '', ''], // Amesbury
                'St. Augustine Pirate Ship': ['StAugustinePirateShip', 'djq1y8v3x/16.1', '1LFEYNFyA8vUXSDOm1Fz7Kwc6oxS8hyk_sYoOoftO6VI', '', ''],
                'St. Louis Cardinals Part 2': ['StLouisCardinalsPart2', '9yzgew5sq/16.2', '1-h2fgEIqwtsMEeAgJvv21idGfB4Wr9XR7jUfNfyGGk0', '', ''], // Saint Louis
                'Stained Glass House': ['StainedGlassHouse', 'djn1qvwhs/16.0', '1oYew6Zp0pxU2-oqB2N_iZYAZ7KniOOtwccXktkh_VSY', '', ''],
                'StL Flat Rob': ['StLFlatRob', '9yzsdvgr3/16.0', '1OinWpDJIDhBDBCD_0cE2C-4g3VjiTfl4scc6VFY6qaA/edit#gid=1191342418&range=A1', '', ''], // [push], Saint Peters
                'STL Pirate Ship': ['STLPirateShip', '9yzssvpyq/15.9', '1YSzpO21Qd95-1ErmJ4zMiih_qQdwTcFsoAxN2_uyiws', '', ''], // Saint Charles
                'STLPokeball': ['STLPokeball', '9yzg3ukw5/16.2', '1Z5_NyDJk9nwrT-duWpS5AExm2xg49xfiD6zxKnHDq2Q', '', ''], // Saint Louis
                'STLTardis': ['STLTardis', '9yzg3wnjp/16.1', '1UD2jwq1xv8af0QOoBuxUjNv666tzUY9rVn7edZO20kY', '', ''], // Saint Louis
                'Stripe of Jewels': ['StripeOfJewels', 'dr1hxcjyq/16.2', '1vf28qdgJL1BAcnIpRy1TCG-dSjQosO8Hw-6kh520hEk', '', ''],
                'Stroopwafel invasion in Falling Waters': ['StroopwafelInvasionInFallingWaters', 'dr095u8tn/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Stroopwafel invasion in Hagerstown': ['StroopwafelInvasionInHagerstown', 'dr09wfndy/16.3', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // topic (Stroopwafel invasion)
                'Sun and Moon': ['SunAndMoon', 'dnqgddz23/16.3', '1tIUrGjLipUxLUz09XRikOWauB0q_CQn0WLkKXaSlejo', '', ''],
                'SunFlake': ['SunFlake', 'cbq3yt42q/16.0', '1SSoeWzTY-PBR3iq5C78FO8uJ8ACM4D7ziLw3lpEYbqQ', '', ''],
                'Tampa Cat': ['TampaCat', 'dhvr2z0uk/15.9', '19vSSE4W-CSAklHhBliwix4IPSs41TtL2V3AUeU_YtQs', '', ''],
                'Taylor Swift - The Eras': ['TaylorSwiftTheEras', 'dp5gfxzt7/16.1', '1fX4tp1PjGgu5UZa10wn4cmPKX-WzhxbslerpBpGrJgU', '', ''], // Greenville
                'TCU Horned Frogs': ['TCUHornedFrogs', '9vff0931z/15.4', '1ODvwsf455ozeqDfprLG7jlOP9ylhMIuxKOroJdlyFDI', '', ''], // Fort Worth
                'Teenage Mutant Ninja Turtles': ['TeenageMutantNinjaTurtles', '9vghxwwmw/16.0', '1QU5oe70bZw-FomLhZsOrNHerQVlQYWwUm5Xrkho259o', '', ''], // McKinney
                'Texas Golden Ticket (Flats)': ['TexasGoldenTicketFlats', '9vfdhhkk9/16.3009', '1fAwIoOdHKk7EH6cIL28nxUYBTBCdlvM_p0zMHf0EIGI', '', ''], // [push], Fort Worth, denali0407
                'The Beginnings of The Bone Pile': ['TheBeginningsOfTheBonePile', 'c815cd6m0/16.1', '1MDUEBlnbq_o30SaF3xKZpfdGrrZEDj4i2v-mfWZmDBc/edit#gid=0&range=A1', '', ''],
                'The Belly of The Bone Pile': ['TheBellyOfTheBonePile', 'c815cddjw/16.1', '1MDUEBlnbq_o30SaF3xKZpfdGrrZEDj4i2v-mfWZmDBc/edit#gid=1702717831&range=A1', '', ''],
                'The Finale of The Bone Pile': ['TheFinaleOfTheBonePile', 'c815cdfpf/16.1', '1MDUEBlnbq_o30SaF3xKZpfdGrrZEDj4i2v-mfWZmDBc/edit#gid=933750132&range=A1', '', ''], // [push]
                'The Oswego Jewel': ['TheOswegoJewel', 'dp3jnn256/16.2', '111V2uhBpwhMAOeAgtkRxos93zMaCGiYJXvzFY8-TB1U', '', ''],
                'The Swan': ['TheSwan', '9zrvfkctm/15.4', '11PrQ8o3OL3CupnqfuKd5dFA4Qw8AZF0uS3SZeOTSOP4', '', ''],
                'Tied up in Knotz in Round Rock': ['TiedUpInKnotzInRoundRock', '9v6tbuxnn/16.4', '1zuJL1OfsnYgzGr8CS3Cck2SQDetTwnViCLcZP3kcpIs', '', ''], // knotmunz
                'Tied up in Knotz in Weatherford...Ireland?': ['TiedUpInKnotzInWeatherfordIreland', '9vf6npmgv/16.4', '1zuJL1OfsnYgzGr8CS3Cck2SQDetTwnViCLcZP3kcpIs', '', ''], // Weatherford, denali0407
                'Tiger King': ['TigerKing', '9vfcfhj93/16.2', '10AYhujmVdmQJeag_7vltMnei94lP3y7c7TeWT0PmPsY', '', ''], // Fort Worth
                'Tucson Chess': ['TucsonChess', '9t9pk40vz/15.9', '1rKb80qKGe9TKmJos0sIDUH0gXdGyIIqXyTJqmzUpj78', '', ''],
                'Turtle': ['Turtle', 'dhv9d3vyu/15.8', '1xCW85xP9S2-65fqfEElie9SI87-AAEklNepQ-ezXChI', '', ''],
                'Turtle Turtle': ['TurtleTurtle', '9tbt6my0z/16.0', '1QxMGg3FT5O5bfhjW1ZbYjITLsVWakr8_Kmn16pnwtpQ', '', ''],
                'Turtle Turtle (Flats)': ['TurtleTurtle', '9tbt6my0z/16.0009', '1QxMGg3FT5O5bfhjW1ZbYjITLsVWakr8_Kmn16pnwtpQ', '', ''],
                'Unofficial CR Evo': ['UnofficialCREvo', '9zqyd8hgw/16.0', '1TnyQsvsR0ZBkJuuAFW03Pe4qzCrYJzNLwed838pIMrg', '', ''], // Cedar Rapids, rodrico101
                'USM Golden Eagles': ['USMGoldenEagles', 'dj86pp7dz/16.0', '1wGJYSZiTwc6oDcEZxXgayCbPOH4D-aZ-eLDGpG1ovXA', '', ''],
                'Utah Beehive': ['UtahBeehive', '9x0x01tcy/16.2', '1JCsaT8XE6XHQ5kJ-VExPaDXSeTvrEytqWBjFQKqLQdo', '', ''],
                'Velma Crossbow': ['VelmaCrossbow', '9vff0n39v/15.8', '1Ce1o-NLHT2aBBTFiVWIdOjDP5AofVXkg9d0vXZ3xbCM', '', ''], // Fort Worth
                'Waluigi': ['Waluigi', '9ytewnbju/16.0', '1Pux_hQWNqre756bExvb91vS48xpNVNQsYYSZV62dvvY', '', ''],
                'West Des Moines Pac Man': ['WestDesMoinesPacMan', '9zmk6nyww/15.0', '1MkElqI5MUYQvvXxhKV0f4aWdOMZc35EVOlFNDZ6avKk', '', ''], // llamah, PeachesnCream
                'West Des Moines Shark': ['WestDesMoinesShark', '9zmk6hw2m/15.8', '1Wc-tWKKiNJbgcAtwyMZkoOgYTIjkcowb4QInou1E3NQ', '', ''], // llamah, PeachesnCream
                'West Des Moines Strawberry': ['WestDesMoinesStrawberry', '9zmk65e9v/16.1', '11ElTupqSSPj0pXyhWV26fuNlJmxR6o-Dsz-mFpUfRME', '', ''], // llamah, PeachesnCream
                'What`s in Town?': ['WhatsInTown', 'dr33fedfg/16.0', '1yGu0wPExhYTs-TM2hMG-T-qNxO0YNg0m-6bmBTqWQuU', '', ''],
                'Wildcat Stripe': ['WildcatStripe', 'dppt1y0cx/16.3', '1FAfil_LgfHA9Wzj6jweQfLsvxt_e8haTAjWimJJfing', '', ''],
                'Witch`s Hat': ['WitchsHat', 'dngc7uuuy/15.9', '1wkbDDiCS_nNucyISYSX9A2FgZHc1-dNogxLH0wr-aCs', '', ''], // Georgetown
                'Woodpecker': ['Woodpecker', '9yzep995f/16.1', '1gWPfPPIW7hkUKfyVyAb7Vf2H79lVRAATnHAWGAjS-Jk', '', ''], // Concord
                'Zee Knight': ['ZeeKnight', '9vgk3n3mg/15.5', '1BfXO5xZ_peEyc9J-5LIzklvo3ox0EJXO9jepz4sTuI8', '', ''], // McKinney
                'Zeecret Briefcase in Indpendence': ['ZeecretBriefcaseInIndpendence', 'dpmgqpgp3/16.0', '1_L2a8yk2xQd9O9YcupWNFZtLY-2islH6uOT4ZWeo4mk', '', ''],
                'Zelda': ['Zelda', '9vgk9ry7y/16.1', '1emGCfTxs-08ejJDND2YtczK5DCjDr7EAUTiY8rtFl2I', '', ''] // McKinney
            }
        },
    },
    'by city': {
        'Australia': {
            'Adelaide': {
                'Adelaide Wizard': ['city_Adelaide', 'r1f88fnzf/14.999', '1y4CODTqesKPAV6Fjm5yS3cQigk3AocBE1vJK8JTasO8', '', ''],
                'Adelaide`s Butterfly': ['city_Adelaide', 'r1f93ykp3/14.999', '1Aja8OGPlEDNzkFHecJbfZTTHyLpn4jEQm4bUfgSCTYI', '', ''],
                'First of Many South Australia Event': ['city_Adelaide', 'r1f91z7z2/14.999', '1wOmBY41Gwnw_MKtpv4kN2s3rYg4fxtI8r-HMavbe2o0', '', ''],
                'Huntfield Heights Dog': ['city_Adelaide', 'r1dxbpf50/14.999', '', '1903', 'Australia_HuntfieldHeightsDog'], // [*]
                'Leprechaun hat': ['city_Adelaide', 'r1f803307/14.999', '1rwAWiGr8XtRL9lMBMHBuBfEQ2AJgx9A9EaW6XP9fYic', '', ''],
                'Mawson Lakes DHS tape': ['city_Adelaide', 'r1f9fqktr/14.999', '', '', ''],
                'Onkaparinga Crab': ['city_Adelaide', 'r1dryzzp1/14.999', '1X7m9bjQshuTPEiPGaPpunJ_hxJUxzeIngMfeLOzzgYU', '', ''],
                'Pot of gold': ['city_Adelaide', 'r1f801ztg/14.999', '1rwAWiGr8XtRL9lMBMHBuBfEQ2AJgx9A9EaW6XP9fYic', '', ''],
                'SA Party Hat': ['city_Adelaide', 'r1fdh7cdx/14.999', '', '', ''],
                'Shamrock, Hackham': ['city_Adelaide', 'r1f801pw9/14.999', '', '', '']
            },
            'Brisbane': {
                '9th Birthday in Queensland': ['city_Brisbane', 'r7hu2gjst/14.999', '', '', ''], // completed
                'Brisbane': ['city_Brisbane', 'r7hg9wruj/14.999', '1kZaHTAKIsFnzcdTZCw13KaPLWwYWB_QEBmS19-HdapQ', '', ''], // empty
                'Brisbane Heart Pop Up': ['city_Brisbane', 'r7hg9yzzd/14.999', '', '', ''], // completed
                'Egyptian Mask': ['city_Brisbane', 'r7hu4xdc9/14.999', '', '', ''],
                'Fairy Wren': ['city_Brisbane', 'r7hucu2rc/14.999', '', '', ''], // completed
                'HappyTenMunzee!': ['city_Brisbane', 'r7hu2zgws/14.999', '', '', ''], // completed
                'MayPole': ['city_Brisbane', 'r7hgckc49/14.999', '', '', ''], // completed
                'Pyramid O` Badges': ['city_Brisbane', 'r7hu4rrrn/14.999', '', '', ''], // completed
                'QLD Perm-Temp': ['city_Brisbane', 'r7hu62k18/14.999', '1i5EvqfN3JXc-fe_ufgWJSt_0WXvgNZQOOeHILhl7I9o', '', ''], // empty
                'QLD-Dingo': ['city_Brisbane', 'r7hu60rxr/14.999', '', '', ''], // completed
                'QldJacaranda': ['city_Brisbane', 'r7hucvdgx/14.999', '', '', ''], // completed
                'Queensland Koala': ['city_Brisbane', 'r7hug0cqd/14.999', '', '2012', 'Australia_QueenslandKoala'],
                'Where Is Warner?': ['city_Brisbane', 'r7hu8s968/14.999', '', '', '']
            },
            'Gatton': {
                'Gatton Arrows - Arrow1': ['city_Gatton', 'r7h71n6fd/14.999', '', '', ''], // [*]
                'Gatton Arrows - Arrow2': ['city_Gatton', 'r7h71r6gq/14.999', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=2054923152&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow3': ['city_Gatton', 'r7h71q6jx/14.999', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=560099315&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow4': ['city_Gatton', 'r7h71k8tr/14.999', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1844433261&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow5': ['city_Gatton', 'r7h71k8m5/14.999', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1661210718&range=A1:G1', '', '']
            },
            'Laidley': {
                'Bee Santa': ['city_Laidley', 'r7h6sj88v/14.999', '', '', ''],
                'BuzzzBee': ['city_Laidley', 'r7h6exz90/14.999', '', '', ''],
                'Here bee Zodiacs!': ['city_Laidley', 'r7h6gff7q/14.999', '', '', ''],
                'Honeycomb': ['city_Laidley', 'r7h6gc4z9/14.999', '', '', ''],
                'HoneyDipper': ['city_Laidley', 'r7h6gbq0x/14.999', '', '', ''],
                'Laidley BeeHive': ['city_Laidley', 'r7h6ewqcc/14.999', '', '', ''],
                'Laidley Bees': ['city_Laidley', 'r7h6eys0v/14.999', '', '', ''], // [*]
                'TwoBeeOrKnot?': ['city_Laidley', 'r7h6gcrmm/14.999', '1QeWV421cytXf8r6XdxlbS1e3RPpuramAhrUmm4jkcSk', '', '']
            },
            'Laidley Heights': {
                'Bee Flats': ['city_LaidleyHeights', 'r7h6g02c3/14.999', '', '', ''],
                'Bee Flowers': ['city_LaidleyHeights', 'r7h6erkpu/14.999', '', '', ''],
                'BeeJewelled!': ['city_LaidleyHeights', 'r7h6gk67j/14.999', '', '', ''],
                'Bee Queen': ['city_LaidleyHeights', 'r7h6g0w0p/14.999', '', '', ''],
                'BeeTree': ['city_LaidleyHeights', 'r7h6dzurf/14.999', '', '', ''],
                'FlatterBee': ['city_LaidleyHeights', 'r7h6g9pnh/14.999', '', '', ''], // [*]
                'Snow bee Melting': ['city_LaidleyHeights', 'r7h6g4j12/14.999', '', '', ''],
                'SoonBeeSpring!': ['city_LaidleyHeights', 'r7h6g4uvh/14.999', '', '', ''],
                'We Bee Pawns': ['city_LaidleyHeights', 'r7h6fcj3s/14.999', '', '', '']
            },
            'Melbourne': {
                'Arthur Seat Tower': ['city_Melbourne', 'r1pjdn6fn/14.999', '1EYXPfBZ3KRWHcQ_knyxWwMeuSWclS8oRV8kv5Qmm8ko', '', ''],
                'Aussie BOOM!erang': ['city_Melbourne', 'r1r14c0pk/14.999', '1Tfl9TljQFcy6Xd2biYAHWQwqLvnyl-MSoHC4eEXk9ZI', '', ''],
                'Australian Dingo': ['city_Melbourne', 'r1r0kjse2/14.999', '', '', ''],
                'Boxing Kangaroo': ['city_Melbourne', 'r1r1kx9yr/14.999', '1dKhYKFBRxiTybwFlioKS6sNa6z1I77b_9W7KKMikWrE', '', ''],
                'Breast Cancer Network of Australia Logo': ['city_Melbourne', 'r1r1hy6zj/14.999', '1m1nxcl_e0kw3TR_E_WKAfDCvjJ3Q5KVWS0U-f_c-ULc', '', ''],
                'Camp Freez': ['city_Melbourne', 'r1pr61317/14.999', '1gyGjG7h4rS34hlYomsfLDZtG-b9M_jI_WT-ZFDPjnUA', '', ''],
                'Collingwood FC Magpie': ['city_Melbourne', 'r1r0gqxx4/14.999', '', '', ''],
                'Cranbourne Softball': ['city_Melbourne', 'r1pr6810e/14.999', '1NZo1NI8Y3OsT1i-T2zhZaB7sc2QJGNlRCCLsVnZpHvE', '', ''],
                // 'Australia_EmeraldInMelbourne',
                'Evolutionary Camp sign': ['city_Melbourne', 'r1pr9w1zc/14.999', '1JEljtiVnSoT-dmdZ60XnoCIQe-Kcjd3H3-e6nctOdVg/edit#gid=1620937488&range=A1', '', ''],
                'Evolutionary Caravan': ['city_Melbourne', 'r1pr9e9y8/14.999', '1JEljtiVnSoT-dmdZ60XnoCIQe-Kcjd3H3-e6nctOdVg/edit#gid=55938854&range=A1', '', ''],
                'Evolutionary Ducky': ['city_Melbourne', 'r1pr9sc0p/14.999', '1yg2dkXsfPltexsK9CMZOivmWgdZLf2G6igc_fxtCuOk', '', ''],
                'Evolutionary Envelope': ['city_Melbourne', 'r1pr9kmuj/14.999', '1ImGTAk2AWozGajcx0mDg21SMew627ASbOBb-RgHD5E0', '', ''],
                'Evolutionary Fish': ['city_Melbourne', 'r1pr9txcj/14.999', '1JEljtiVnSoT-dmdZ60XnoCIQe-Kcjd3H3-e6nctOdVg/edit#gid=928262580&range=A1', '', ''],
                'Evolutionary Sea Horse': ['city_Melbourne', 'r1pr9m57g/14.999', '1JEljtiVnSoT-dmdZ60XnoCIQe-Kcjd3H3-e6nctOdVg/edit#gid=19787765&range=A1', '', ''],
                'Flat Rob and Flatt Matt at Lilydale Lake': ['city_Melbourne', 'r1r35sct9/14.999', '', '', ''],
                'Flat Rob Berwick': ['city_Melbourne', 'r1prdxwtr/14.999', '1H0IvTf6fJGSfBY6q8YgRYxdRoRpacz07euV9MnVJWqA/edit#gid=333255779&range=A1', '', ''],
                'Flat Rob Berwick (Flats)': ['city_Melbourne', 'r1prdxwtr/14.999009', '1H0IvTf6fJGSfBY6q8YgRYxdRoRpacz07euV9MnVJWqA/edit#gid=1448661812&range=A1', '', ''],
                'Freddo Faces': ['city_Melbourne', 'r1prcsnq9/14.999', '1TvlpMX61-h_kzLwxOmDxg9rsck8LXuw1DiQqzCZ16Hw', '', ''],
                'Hampton Park Jelly Fish': ['city_Melbourne', 'r1pr9q51t/14.999', '1ry91Bx5Hq2ZFFe9Gwxbp48pgsRU3_41DsAeTg0hhyjw', '', ''],
                'Jubilee Butterfly': ['city_Melbourne', 'r1r2bfgd3/14.999', '', '', ''],
                'Kidney Awareness Ribbon': ['city_Melbourne', 'r1pr1vuwq/14.999', '', '', ''],
                'Melbourne Mystery Heart': ['city_Melbourne', 'r1r142pez/14.999', '1Rt3thckTanpKtvHL3GwM1FDgGYmTot1RR3LNObv-Kvw', '', ''],
                'Mulgrave Amethysts': ['city_Melbourne', 'r1r20nv7k/14.999', '1-bbl8B58Fwk6ZUZCjdlHwdrru-nMhXex2d2lNAzjHm4', '', ''],
                'Munzee Pin': ['city_Melbourne', 'r1r07ke9r/14.999', '1tEP0N1XGjntMrz2qQNQaaQ3OQd696LIm3evbB79IV1Y', '', ''],
                'Munzee`s 12 Birthday CupCakes': ['city_Melbourne', 'r1r1pu28q/14.999', '', '', ''],
                'Narre Warren Crossbow': ['city_Melbourne', 'r1prd1grh/14.999', '', '', ''],
                'Over the Rainbow': ['city_Melbourne', 'r1pr4h5du/14.999', '', '', ''],
                'Pirate Pete`s Parrot': ['city_Melbourne', 'r1prduegj/14.999', '', '2206', 'Australia_PiratePetesParrot'], // [*]
                'Queens Gambit - Horse': ['city_Melbourne', 'r1prds3cr/14.999', '1k1SRlj7s8EVc2h7UZqIxmwh0d_4DZnljIW5mLDbi-sk', '', ''],
                'Redbull Formula 1': ['city_Melbourne', 'r1r0duw94/14.999', '', '', ''],
                'Rivergum Creek Reserve Evolutions': ['city_Melbourne', 'r1pr9ezes/14.999', '1w4Dr3PcdZDya6poBr30pniEvWw1-z0Xp43IQjKJfPOs', '', ''],
                'Sapphire of Lynbrook': ['city_Melbourne', 'r1pr90vxq/14.999', '19y13jN0cvu5aq2vMzP9DZlpAKEmhOCP6vlE4K0neLcc', '', ''],
                'Scoresby Easter Egg': ['city_Melbourne', 'r1r22v2gv/14.999', '1mRrf6PhFYIWW_-sVaUKoCdSLuST4ARpWCwqer3r5aY4', '', ''],
                'Somerville Specials': ['city_Melbourne', 'r1pnx1x9p/14.999', '', '2009', 'Australia_SomervilleSpecials'],
                'Superstar`s Puppy': ['city_Melbourne', 'r1prepkf1/14.999', '', '', ''],
                'The Australian Santa Clause (St. Nick)': ['city_Melbourne', 'r1pr7p148/14.999', '19uTRzwZ8HVyBAQEbGlbFwUXnlrAA_qoJUNxZO6rDIJk', '', ''],
                'Time2Munzee - Lilydale': ['city_Melbourne', 'r1r35ck3u/14.999', '', '', ''],
                'Tulips!': ['city_Melbourne', 'r1pre7s7r/14.999', '', '', ''],
                'Vegemite': ['city_Melbourne', 'r1r07ufj4/14.999', '', '', ''],
                'We Love 10pmMeerkat': ['city_Melbourne', 'r1r0m6jks/14.999', '', '2307', 'Australia_WeLove10pmMeerkat'],
                'Winnie the Pooh Bear': ['city_Melbourne', 'r1r1ktq9x/14.999', '172li9iyt9NjJu7dIQ0tkZLBVkxpUI5nozBww92O0ugI', '', '']
            },
            'Sydney': {
                'AE2 Submarine': ['city_Sydney', 'r3grt6gby/14.999', '', '', ''],
                'AussiePossum': ['city_Sydney', 'r652njr19/14.999', '', '', ''], // [*]
                'Australian Flag': ['city_Sydney', 'r3gx2vp7r/14.999', '1seAyy_nkniGuKzGZxPG282hqyOKNPEX7kOXo_SP7dCc', '', ''],
                // 'Australia_EmeraldInSydney'
                'Sydney Swans FC Guernsey': ['city_Sydney', 'r3gx1q2y2/14.999', '1Je3g3HwzEdMElut80We8GUNcZH-inLREJjGdFRMjinM', '', '']
            }
        },
        'Canada': {
            'Ottawa': {
                'Banana Bread': ['city_Ottawa', 'f2469yxfs/14.999', '', '', ''], // completed
                'Bee Strong Jeffeth': ['city_Ottawa', 'f244q96q7/14.999', '', '', ''], // completed
                'Christmas in Ottawa': ['city_Ottawa', 'f2469dret/14.999', '', '2112', 'Canada_ChristmasInOttawa'], // GOTM
                'Elephriends': ['city_Ottawa', 'f246dr30m/14.999', '', '', ''], // completed
                'Fluttering by Orleans': ['city_Ottawa', 'f24699gjw/14.999', '', '', ''], // completed
                'Halloween in Ottawa': ['city_Ottawa', 'f246dqzzt/14.999', '', '2210', 'Canada_HalloweenInOttawa'], // GOTM
                'Hospital Love': ['city_Ottawa', 'f246f0k0b/14.999', '', '', ''], // completed
                'Jeff`s Farm': ['city_Ottawa', 'f246dz5s1/14.999', '', '', ''], // completed
                'Jimmy`s Dog': ['city_Ottawa', 'f241grtv1/14.999', '', '', ''], // completed
                'Lizzy`s Unicorn': ['city_Ottawa', 'f246dxcww/14.999', '', '', ''], // completed
                'Munzee Drum Set': ['city_Ottawa', 'f246d67y3/14.999', '', '', ''], // completed
                'Munzee Guitar': ['city_Ottawa', 'f246d1eun/14.999', '', '', ''], // completed
                'Munzee Love': ['city_Ottawa', 'f246uwk1x/14.999', '', '2202', 'Canada_MunzeeLove'], // GOTM
                'Munzee Snowglobe': ['city_Ottawa', 'f246gv5nv/14.999', '', '', ''], // completed
                'Munzee Trumpet': ['city_Ottawa', 'f246e5djy/14.999', '', '', ''], // completed
                'Munzee Violin': ['city_Ottawa', 'f246dgvh4/14.999', '', '', ''], // completed
                'Mystery Boat': ['city_Ottawa', 'f246dubv1/14.999', '', '', ''], // completed
                'Mystery Keyboard': ['city_Ottawa', 'f246ddyqk/14.999', '', '', ''], // completed
                'Ottawa Cancer Ribbon': ['city_Ottawa', 'f2469w9ut/14.999', '', '', ''], // completed
                'Ottawa Cross': ['city_Ottawa', 'f246dvryt/14.999', '', '', ''], // completed
                'Ottawa Fireworks': ['city_Ottawa', 'f246f3yj9/14.999', '', '', ''], // completed
                'Ottawa Goldfish': ['city_Ottawa', 'f2469ybkn/14.999', '', '', ''], // completed
                'Ottawa Leprechaun': ['city_Ottawa', 'f246fgx9e/14.999', '', '', ''], // completed
                'Ottawa New Years': ['city_Ottawa', 'f24697y7y/14.999', '', '', ''], // completed
                'Ottawa Tornado': ['city_Ottawa', 'f246gefs4/14.999', '', '', ''], // completed
                'Rainbow Star': ['city_Ottawa', 'f246un1w9/14.999', '', '', ''], // completed
                'Rumball Machine': ['city_Ottawa', 'f246ffb0f/14.999', '', '', ''], // completed
                'Sandcastle Fun': ['city_Ottawa', 'f246fhn3x/14.999', '', '', ''], // completed
                'Save the Monarchs': ['city_Ottawa', 'f246d5kdy/14.999', '', '', ''], // completed
                'Secret Lantern': ['city_Ottawa', 'f246dmm85/14.999', '', '', ''], // completed
                'Spring in Ottawa': ['city_Ottawa', 'f2469zt39/14.999', '', '', ''], // completed
                'Summer in Ottawa': ['city_Ottawa', 'f246ds0e9/14.999', '', '', ''] // completed
            },
            'Clarence-Rockland': {
                'Adventures in Rockland': ['city_ClarenceRockland', 'f247p1fwh/14.999', '', '', ''], // completed
                'Bread in Rockland': ['city_ClarenceRockland', 'f247pgbcs/14.999', '', '', ''], // completed
                'Claire`s Cake': ['city_ClarenceRockland', 'f247nuu26/14.999', '', '', ''], // completed
                'Claire`s Candy Canes': ['city_ClarenceRockland', 'f247ndq30/14.999', '', '2011', 'Canada_ClairesCandyCanes'], // GOTM
                'Jimmy`s Boat': ['city_ClarenceRockland', 'f247pv3tg/14.999', '', '', ''], // completed
                'Jimmy`s Rocket': ['city_ClarenceRockland', 'f247n7w4p/14.999', '', '', ''], // completed
                'Jimmy`s Tractor': ['city_ClarenceRockland', 'f246vxw9k/14.999', '', '', ''], // completed
                'Lizzy`s Elephant': ['city_ClarenceRockland', 'f247n6m7r/14.999', '', '', ''], // completed
                'Lizzy`s Goldfish': ['city_ClarenceRockland', 'f247n3hv1/14.999', '', '', ''], // completed
                'Lizzy`s Kitty': ['city_ClarenceRockland', 'f247pj9t1/14.999', '', '', ''], // completed
                'Marching Flats': ['city_ClarenceRockland', 'f247p7yfn/14.999', '', '', ''], // completed
                'Munzball Machine': ['city_ClarenceRockland', 'f247pwy98/14.999', '', '2107', 'Canada_MunzballMachine'], // GOTM
                'Rockland Easter Eggs': ['city_ClarenceRockland', 'f247nt1es/14.999', '', '', ''], // completed
                'Rockland Heart': ['city_ClarenceRockland', 'f247p5p08/14.999', '', '', ''], // completed
                'Rockland Tree': ['city_ClarenceRockland', 'f247nevxk/14.999', '', '', ''], // completed
                'Secret Love': ['city_ClarenceRockland', 'f247n9916/14.999', '', '', ''], // completed
                'Secret Valentine': ['city_ClarenceRockland', 'f247pk9h9/14.999', '', '2102', 'Canada_SecretValentine'], // GOTM
                'Stanley for Dad': ['city_ClarenceRockland', 'f247phkyn/14.999', '', '', ''], // completed
                'The Secret Egg': ['city_ClarenceRockland', 'f246vjvy0/14.999', '', '', ''] // completed
            },
            'Vancouver': {
                'Canada Celebrates 150+ Years!': ['city_Vancouver', 'c2b2q9w9t/14.999', '', '', ''],
                'Fabulous February Fete Heart': ['city_Vancouver', 'c2b2phnvx/14.999', '1CbvRTggg1yDZZJDyZatJJXEzGkJijqzL_4LvGvhnQGc', '', ''],
                'Fabulous February Fete (Flats)': ['city_Vancouver', 'c2b2phnvx/14.999009', '1CbvRTggg1yDZZJDyZatJJXEzGkJijqzL_4LvGvhnQGc', '', ''],
                'Feb 2023 Heart Garden': ['city_Vancouver', 'c2b82cefg/14.999', '1dSoK55XEka6eqa1bqi5p0hsszJJanugy-haDVuR3MG0', '', ''],
                'Jumping January Jamboree': ['city_Vancouver', 'c2b2pjdsr/14.999', '', '', ''],
                'Kits Beach Rubber Ball': ['city_Vancouver', 'c2b2md7xf/14.999', '1scgbKOetRFMELGRkfVxnjRDBY9sVXGc6UhZWUPcrRlo', '', ''],
                'Mad March Pi': ['city_Vancouver', 'c2b80njfe/14.999', '', '', ''] // [*]
            },
        },
        'Denmark': {
            'Aarhus': {
                'Aarhus Rose': ['city_Aarhus', 'u1zprxesu/14.999', '', '', ''],
                'Apple in Aarhus': ['city_Aarhus', 'u1zr85dyw/14.999', '', '', ''],
                'Garden of Jewels': ['city_Aarhus', 'u1zr85me8/14.999', '', '', ''],
                'Next stop Tilst': ['city_Aarhus', 'u1zptuunw/14.999', '', '', ''],
                'True Forest Fish': ['city_Aarhus', 'u1zptc9xn/14.999', '', '', ''], // [*]
                'True Forest Surprise': ['city_Aarhus', 'u1zpw1bck/14.999', '', '', '']
            },
            'Grenaa': {
                'Grenaa Amethyst': ['city_Grenaa', 'u4p8zxcm7/14.999', '', '', ''],
                'Grenaa Big Amethyst': ['city_Grenaa', 'u4p8znju6/14.999', '', '', ''],
                'Grenaa City`s Coat of Arms': ['city_Grenaa', 'u4p8zgw2n/14.999', '', '1906', 'Denmark_GrenaaCitysCoatOfArms'],
                'Grenaa Ferry': ['city_Grenaa', 'u4pbbt4gq/14.999', '', '', ''],
                'Grenaa Heart 2022': ['city_Grenaa', 'u4p8zkw70/14.999', '', '', ''],
                'Grenaa Sapphire and Amethyst': ['city_Grenaa', 'u4p8zwhpp/14.999', '', '', ''],
                'Nessie in Grenaa': ['city_Grenaa', 'u4pbbjhsw/14.999', '', '2203', 'Denmark_NessieInGrenaa']
            },
            'Hammel': {
                'Evolution 2019 Hammel': ['city_Hammel', 'u4p008csn/14.999', '1leD1dhMG_2z695GP0uY7TBx8DT4aAkMxBGObQrPW8uc', '', ''],
                'F-Bomb - Hammel': ['city_Hammel', 'u1zpbx5gt/14.999', '', '', ''],
                'Favrskov Coat of Arms': ['city_Hammel', 'u4p001y5y/14.999', '1w-93kKMC93WupJ8Mdv2OAYb_EwsuWig07KPPADvkVfg', '', ''],
                'Flat Hammel': ['city_Hammel', 'u4p003mrr/14.999', '', '', ''],
                'Heart of Valentine': ['city_Hammel', 'u1zpbx2nw/14.999', '', '', ''], // [*]
                'MiniPortal2': ['city_Hammel', 'u4p001h4e/14.999', '', '', ''],
                'Onyx Citrine Park in Hammel': ['city_Hammel', 'u4p002e26/14.999', '', '', '']
            },
            'Hillerød': {
                'Agriculture Field in Hillerød': ['city_Hilleroed', 'u3by0nen4/14.999', '1u09UO70S-1AcDivV95mBVlLIdSq1c2Q-y_iueM0Z2tU', '', ''],
                'Animal Farm - Hillerød': ['city_Hilleroed', 'u3by0wys4/14.999', '1NZiz-rgBN3FUepvTGyiNnNMpq2u5OmAnyN_kl5tKDjs', '', ''],
                'Christmastree in Hillerød': ['city_Hilleroed', 'u3bwpz4em/14.999', '', '', ''],
                'Emerald in Hilleroed': ['city_Hilleroed', 'u3by0p0uw/14.999', '', '', ''],
                'Flat Square': ['city_Hilleroed', 'u3by0rexn/14.999', '', '', ''],
                'Ghost in Hilleroed': ['city_Hilleroed', 'u3bwrbnce/14.999', '1ykKLVDJmjKtjT3xyhTm0iuu4Pbtw3QBzXJPZ6SUU4Qc', '', ''],
                'Isvaffel in Hilleroed': ['city_Hilleroed', 'u3bwpzm7s/14.999', '1n7ipZpm9CU4BTfyVtRfB5Ib2HmVCGRhU-npq0ZRld30', '', ''],
                'The Swan in Hillerød': ['city_Hilleroed', 'u3by0pf05/14.999', '1IQB1OpAltjJsAMlrdx3OjwcupfMADu1uGQLMj3a8zPo', '', ''],
                'Zeecret, Hillerød': ['city_Hilleroed', 'u3by0xm2f/14.999', '', '', '']
            },
            'Silkeborg': {
                'Silkeborg Coat of Arms': ['city_Silkeborg', 'u1yz935ce/14.999', '', '', ''], // [*]
                'Silkeborg Hexagon': ['city_Silkeborg', 'u1yz91p0q/14.999', '', '', ''],
                'Silkeborg Mario': ['city_Silkeborg', 'u1yz3x8z1/14.999', '', '', ''],
                'Silkeborg Night Owl': ['city_Silkeborg', 'u1yz90x8u/14.999', '', '', ''],
                'Silkeborg Owl': ['city_Silkeborg', 'u1yz929gr/14.999', '', '', ''],
                'Silkeborg Rainbow Unicorn': ['city_Silkeborg', 'u1yz90pxh/14.999', '', '', '']
            }
        },
        'Finland': {
            'Espoo': {
                'Color': ['city_Espoo', 'ud9wsdhe6/14.999', '18cdsLd2xHskqliDWERU_0MBdU5dF3gVr_uizhnapTdg', '', ''],
                'Espoon vaakuna Herald of Espoo': ['city_Espoo', 'ud9w7f5gq/14.999', '', '', ''],
                'Espoon vaakuna Herald of Espoo (Flats)': ['city_Espoo', 'ud9w7f5gq/14.999009', '1qs-96z6Pm46aOHJ8fAn3r_nzzJSJ76d-0lw-VsXtnPo/edit#gid=863805160&range=A1', '', ''],
                'Mermaid': ['city_Espoo', 'ud9wk45jn/14.999', '', '', ''], // [*]
                'Olari evo': ['city_Espoo', 'ud9w6gkqp/14.999', '1n8oUrfy2DqdMcH5ihJhC_NfTgj-S8CVTKhHd6kJS9Qo', '', ''],
                'Turvesuon Puisto': ['city_Espoo', 'ud9w7vj28/14.999', '1FFXXZPbhXSBezTaIKUfRQuyo6xaZnQlSzNMP8wDMhgU', '', '']
            },
            'Helsinki': {
                '7th Birthday': ['city_Helsinki', 'ud9y9snw2/14.999', '', '1907', 'Finland_7thBirthday'],
                'Drive': ['city_Helsinki', 'ud9wrfgwv/14.999', '', '', ''],
                'Easter Bunny': ['city_Helsinki', 'ud9wqgnsc/14.999', '', '', ''],
                'Evolution Field': ['city_Helsinki', 'ud9wrdhs8/14.999', '1WPgjj8Jir64XXPIDTKH8XDtpEvA3yPFzbjW_J80K2U8', '', ''],
                'Helsinki Colour': ['city_Helsinki', 'ud9y2q5jc/14.999', '', '2001', 'Finland_HelsinkiColour'], // [*]
                'Helsinki Surprise': ['city_Helsinki', 'ud9wrdrqb/14.999', '', '', ''],
                'mUnZee10 Birthday': ['city_Helsinki', 'ud9wz1kgz/14.999', '', '', ''],
                'Sapphire, Helsinki': ['city_Helsinki', 'ud9wrd2x7/14.999', '', '', ''],
                'Xmas Stocking': ['city_Helsinki', 'ud9y8yqyr/14.999', '', '', '']
            },
            'Hyvinkää': {
                'Hyvinkää': ['city_Hyvinkaa', 'udc8vwrpv/14.999', '15uMn7URcyjLdcJKTnkQKyCIAcZS8s8033KqARR3kBlQ', '', ''], // empty
                'Hyvinkään lumihiutale': ['city_Hyvinkaa', 'udc8uew15/14.999', '', '', ''],
                'Palmuranta': ['city_Hyvinkaa', 'udc8udkum/14.999', '', '2203', 'Finland_Palmuranta'] // GOTM
            },
            'Kokkola': {
                'Christmas Candle': ['city_Kokkola', 'ue27jfsgj/14.999', '', '', ''],
                'Flat Rob/Matt in Kokkola': ['city_Kokkola', 'ue27nhr6k/14.999', '', '', ''],
                'Halkokarin evovene': ['city_Kokkola', 'ue27q1nvm/14.999', '10_qtoRDi_kb-OJnqpbd07zPBW63oL83fsIzVDfKwDHY', '', ''],
                'Juna jyskyttää': ['city_Kokkola', 'ue27nsdt9/14.999', '', '', ''],
                'Kokkola': ['city_Kokkola', 'ue27jz0bs/14.999', '', '', ''],
                'Kokkola Clown': ['city_Kokkola', 'ue27n5x3j/14.999', '', '', ''],
                'Kokkola Surprise': ['city_Kokkola', 'ue27jvu38/14.999', '', '', ''],
                'Kokkola Virtual Sapphire': ['city_Kokkola', 'ue27njxxh/14.999', '', '', ''],
                'Kokkolan asepuisto': ['city_Kokkola', 'ue27ny4r1/14.999', '', '', ''],
                'Kokkolan kurpitsainen': ['city_Kokkola', 'ue27mb89n/14.999', '', '', ''],
                'Kokkolan Vaakuna': ['city_Kokkola', 'ue27pnc37/14.999', '', '', ''],
                'Snowman': ['city_Kokkola', 'ue27htg20/14.999', '', '', ''],
                'Suomi100': ['city_Kokkola', 'ue27r01dg/14.999', '', '', ''],
                'The Finnhorse': ['city_Kokkola', 'ue27q65pp/14.999', '168rVifRDgUzWfdkLqLJwfdhcQY3aP09xmRHQ0v_f4wo', '', ''],
                'Valentine Heart, Kokkola': ['city_Kokkola', 'ue27j4bks/14.999', '', '', '']
            },
            'Lahti': {
                'Google': ['city_Lahti', 'udf4xgjjf/14.999', '', '', ''],
                'Honor': ['city_Lahti', 'udf6btcu8/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=2001064450&range=A1:E3', '', ''],
                'Lahden Air Mystery Trail': ['city_Lahti', 'udf4zvjqb/14.999', '', '', ''],
                'Lahden Catapult': ['city_Lahti', 'udf4zuz9w/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1808201876&range=A1:E3', '', ''],
                'Lahden Crossbow': ['city_Lahti', 'udf4zujfm/14.999', '', '', ''],
                'Lahden Crossbow 2.0': ['city_Lahti', 'udf4zgxhk/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1192989064&range=A1:E7', '', ''],
                'Lahden Flat Lou': ['city_Lahti', 'udf4zvr1z/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1210090860&range=A1:E3', '', ''],
                'Lahden FlatRobe/Matt': ['city_Lahti', 'udf6bm1tf/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=906470508&range=A1:E3', '', ''],
                'Lahden Vaakuna': ['city_Lahti', 'udf4zsnx8/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=2051955715&range=A1:E3', '', ''], // [*]
                'Lahti Amethyst': ['city_Lahti', 'udf4xk2p7/14.999', '', '', ''],
                'Lahti Farm': ['city_Lahti', 'udf4zucyw/14.999', '', '', ''],
                'Lahti Farm 2': ['city_Lahti', 'udf6bvkhu/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=947054694&range=A1:E4', '', ''],
                'Lahti Flat Rob': ['city_Lahti', 'udf4xhu3x/14.999', '', '', ''],
                'Lahti Surprise': ['city_Lahti', 'udf4xhg1r/14.999', '', '', ''],
                'Lahti Virtual Specials': ['city_Lahti', 'udf6bjje1/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1089618765&range=A1:E3', '', ''],
                'Lahti Vm': ['city_Lahti', 'udf4xsdk1/14.999', '', '', ''],
                'Oneplus': ['city_Lahti', 'udf6bte57/14.999', '', '', ''],
                'Reksun Trail': ['city_Lahti', 'udf4xem0k/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1826328061&range=A1:E3', '', ''],
                'Reksun Vm': ['city_Lahti', 'udf4xs55s/14.999', '', '', ''],
                'Vaakuna Amethyst': ['city_Lahti', 'udf4zs141/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=2114411203&range=A1:D3', '', ''],
                'Virtual Magnet': ['city_Lahti', 'udf4xwrjr/14.999', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=2064545141&range=A1:E2', '', ''],
                'YinYang': ['city_Lahti', 'udf685chb/14.999', '', '', '']
            },
            'Tampere': {
                '102nd Independence Day': ['city_Tampere', 'udbvthz50/14.999', '', '', ''],
                'Hibiscus-flowers on highway': ['city_Tampere', 'udbvsuwsd/14.999', '1LtxjaPdYxKAw7_h6MOtAkESKg4nFoebLwyVjf4Up7RE', '', ''],
                'Huuhkaja': ['city_Tampere', 'udbvwptz7/14.999', '1opyEvj9vQbwXO87q6E0-TlicaLr-MDeenNcpOTjiXRQ', '', ''],
                'Kalevankankaan ankkuri': ['city_Tampere', 'udbvvd9u5/14.999', '', '', ''],
                'Kalevankankaan sydän': ['city_Tampere', 'udbvv69k1/14.999', '', '', ''],
                'Kukkapuisto': ['city_Tampere', 'udbvv7158/14.999', '1c3sjAVuZ1foqW-eDDp-7XJpFKit7z1pXhedmLeEsxQs', '', ''],
                'Tampere electric': ['city_Tampere', 'udbvv1pgw/14.999', '1gtbYindXub8zsIDet7PwqQbzp6fvun-7dsxdxLEwIdw', '', ''],
                'Tappara': ['city_Tampere', 'udbvvgyd8/14.999', '19XoMcx8DoNJzlWsRcxqdaWH1eZZITqrGkhcJQO6B278', '', ''] // [*]
            },
            'Turku': {
                'BioÖtökkä': ['city_Turku', 'u6xzu1e7e/14.999', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE', '', ''],
                'Easter egg of Turku': ['city_Turku', 'u6xzg3k3w/14.999', '1CcyugnXYcA28PbpC7xP6RK4Wn-N82F98FiZ8iqvuw9Q', '', ''],
                'Evopuisto': ['city_Turku', 'u6xzgfrs4/14.999', '', '', ''],
                'Itäharjun flättiparkki': ['city_Turku', 'u6xzgsx87/14.999', '18xH9nXVYaMD9MwagAaRQABiLiSQ2yK6K6P_pLVX6jBQ', '', ''],
                'Kärsämäen Klaanimiekka': ['city_Turku', 'u6zb54227/14.999', '1cWEdoEehihTMaMhvVmnmjD1oprtRRNKopedwcnDGkIA', '', ''],
                'Kehäkukka(nen)': ['city_Turku', 'u6zb5jhp8/14.999', '1vA0FbAFPNzRkdOwjxv6duE68NO0YJVVH', '', ''],
                'Koroisten kolmiot': ['city_Turku', 'u6zb52m80/14.999', '1618ksqdch_9thvjWbXgczj_BxiESB0me2zUuq1iLf34', '', ''],
                'Kupittaa`s football': ['city_Turku', 'u6xzg7szq/14.999', '', '', ''],
                'Kuralan Kylämäen Evolato': ['city_Turku', 'u6xzuqbsg/14.999', '1PycvsIGRJ_SkpzvmtCD9iTd7wmFJupojCnP8Zwx0UFg', '', ''],
                'Lifebuoy': ['city_Turku', 'u6xzcg30d/14.999', '18eZAN9ljk6PzINpcZr5RdfPCKtO5N0nxBHg2tMlR1dc', '', ''],
                'Malec`s Angelic Rainbow': ['city_Turku', 'u6zb5fdmy/14.999', '1d5y5cy_633EqYFF4DkJ5dDQOizgr2-2k', '', ''],
                'Sharpei': ['city_Turku', 'u6zb597d6/14.999', '1XhMBO2VOe1Y2X3uG2gpegvwy-7-JSevt', '', ''],
                'Smiley': ['city_Turku', 'u6xzfkb82/14.999', '14uzB9BF1k_3MF_L3aMuEWYxCpaifnfGSBcAfA5GB8cs', '', ''],
                'TPS Jaanilla - Hockey Team': ['city_Turku', 'u6xzumc3p/14.999', '', '', ''],
                'Turun Yliopisto': ['city_Turku', 'u6xzfvxuz/14.999', '', '', ''],
                'UUSI - Evopuisto': ['city_Turku', 'u6xzu0zh8/14.999', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE/edit#gid=627456412&range=A1:A2', '', ''] // [*]
            }
        },
        'Germany': {
            'Aachen': {
                'Euro MVM Flags - Austria': ['city_Aachen', 'u1h2dw99w/14.999', '16XHN5AxYt4WkkcyroSbC7S_mO2ZXb5ObQp3H1YDyONc/edit#gid=0&range=D446', '', ''],
                'Euro MVM Flags - Bosnia & Herzegovina': ['city_Aachen', 'u1h2f9dte/14.999', '', '', ''],
                'Euro MVM Flags - Bulgaria': ['city_Aachen', 'u1h2f91q8/14.999', '', '', ''],
                'Euro MVM Flags - Croatia': ['city_Aachen', 'u1h2f2rqk/14.999', '', '', ''],
                'Euro MVM Flags - Czech Republic': ['city_Aachen', 'u1h2dqv97/14.999', '', '', ''],
                'Euro MVM Flags - Denmark': ['city_Aachen', 'u1h2dpnm7/14.999', '', '', ''],
                'Euro MVM Flags - Estonia': ['city_Aachen', 'u1h2dxfsz/14.999', '', '', ''],
                'Euro MVM Flags - Europe': ['city_Aachen', 'u1h2dwn93/14.999', '', '', ''], // [*]
                'Euro MVM Flags - Finland': ['city_Aachen', 'u1h2dny3z/14.999', '', '', ''],
                'Euro MVM Flags - France': ['city_Aachen', 'u1h2dzm5t/14.999', '', '', ''],
                'Euro MVM Flags - Germany/Netherlands/Belgium': ['city_Aachen', 'u1h2dxb86/14.999', '16XHN5AxYt4WkkcyroSbC7S_mO2ZXb5ObQp3H1YDyONc/edit#gid=0&range=D9', '', ''],
                'Euro MVM Flags - Great Britain': ['city_Aachen', 'u1h2dn3gq/14.999', '', '', ''],
                'Euro MVM Flags - Greek': ['city_Aachen', 'u1h2drcjq/14.999', '', '', ''],
                'Euro MVM Flags - Hungary': ['city_Aachen', 'u1h2drpdv/14.999', '', '', ''],
                'Euro MVM Flags - Italy': ['city_Aachen', 'u1h2dnewx/14.999', '', '', ''],
                'Euro MVM Flags - Lithuania': ['city_Aachen', 'u1h2f8e8y/14.999', '', '', ''],
                'Euro MVM Flags - Norway': ['city_Aachen', 'u1h2dpx2y/14.999', '', '', ''],
                'Euro MVM Flags - Poland': ['city_Aachen', 'u1h2f81vz/14.999', '', '', ''],
                'Euro MVM Flags - Portugal': ['city_Aachen', 'u1h2f24je/14.999', '', '', ''],
                'Euro MVM Flags - Russia': ['city_Aachen', 'u1h29yp2g/14.999', '', '', ''],
                'Euro MVM Flags - Serbia': ['city_Aachen', 'u1h2f8b48/14.999', '', '', ''],
                'Euro MVM Flags - Spain': ['city_Aachen', 'u1h2f2hg6/14.999', '', '', ''],
                'Euro MVM Flags - Sweden': ['city_Aachen', 'u1h2dye8t/14.999', '', '', ''],
                'Euro MVM Flags - Switzerland': ['city_Aachen', 'u1h2dqf52/14.999', '', '', ''],
                'Euro MVM Flags - Ukraine': ['city_Aachen', 'u1h29ymk0/14.999', '', '', '']
            },
            'Berlin': {
                '9th Birthday in Berlin': ['city_Berlin', 'u336ykze2/14.999', '', '', ''],
                '10th Birthday, Berlin': ['city_Berlin', 'u336ymvtx/14.999', '1tVQsiqPiwc5cMzzfFJuqf8YCYoIr9RVl73HpGf0_0KM', '', ''],
                'Adventure Portal 2': ['city_Berlin', 'u336wpx05/14.999', '1ivw2wLAerMP12SUdmvBHu03atNBSZLE38TMv8YQpCa0', '', ''],
                'Berlin - BYOG 2020': ['city_Berlin', 'u337njw0q/14.999', '', '', ''],
                'Berlin - Capital of spies': ['city_Berlin', 'u33de1r9d/14.999', '', '2009', 'Germany_Berlin-CapitalOfSpies'],
                'Berlin - High Voltage': ['city_Berlin', 'u336ws3eq/14.999', '', '', ''],
                'Berlin Bat - Berliner Fledermaus': ['city_Berlin', 'u336vvjuz/14.999', '', '2010', 'Germany_BerlinBat-BerlinerFledermaus'],
                'Berlin Bear': ['city_Berlin', 'u336sed86/14.999', '1IEStyNlt7Yv3sJfQLIYap9kFyMNvA9VghZQxcWsEGYc', '', ''],
                'Berlin Cards Pin': ['city_Berlin', 'u336z2hgg/14.999', '', '', ''],
                'Berlin Evo Garden - Potsdamer Platz': ['city_Berlin', 'u33d8qm65/14.999', '', '', ''],
                'Berlin Munzee Pin': ['city_Berlin', 'u336wu8b1/14.999', '1iOg2UxMXGecfZXII9nsQE4Ou48JQNvvhJhIuM_khXF8', '', ''],
                'Berlin Void & Maple Chess': ['city_Berlin', 'u336tzs18/14.999', '1I7JZXb1MN4sA5S3JFYAxTWDxeVDMXSuyJ7GHWytYmp0', '', ''],
                'Bullseye': ['city_Berlin', 'u336wpc2q/14.999', '', '', ''],
                'Colours of Berlin': ['city_Berlin', 'u336z06cn/14.999', '', '', ''],
                'Crossbow Pin': ['city_Berlin', 'u336wt64s/14.999', '', '', ''],
                'Crossbow Shield': ['city_Berlin', 'u33dbv6xm/14.999', '', '', ''],
                'Diamant Berlin': ['city_Berlin', 'u33df7ttu/14.999', '1aZOLQqKAnsoDzT8ZuGcJGnUTLnSjMXv76NvVISz-k1M', '', ''],
                'Evo in Berlin Steglitz': ['city_Berlin', 'u336rn5c1/14.999', '', '', ''],
                'F-Bomb - Berlin': ['city_Berlin', 'u336wckkv/14.999', '', '', ''],
                'Flat Hammock Pin': ['city_Berlin', 'u336wv7qr/14.999', '', '', ''],
                'Flat Lou Pin': ['city_Berlin', 'u336wt0df/14.999', '', '', ''],
                'Flat Rob Pin': ['city_Berlin', 'u336wv919/14.999', '', '', ''],
                'German Heart': ['city_Berlin', 'u33dukpdk/14.999', '', '', ''],
                'Greenie Pin': ['city_Berlin', 'u336wmp7k/14.999', '', '', ''],
                'Hönow Wappen': ['city_Berlin', 'u33dys629/14.999', '1awzh00aGcbXrffVi_470G9rYoPf5tiiRilFGVcgrKGE', '', ''],
                'Marzahner Bockwindmühle': ['city_Berlin', 'u33dutke7/14.999', '', '', ''],
                'Matt Pin': ['city_Berlin', 'u336wmhfr/14.999', '', '', ''],
                'Mystery Pin': ['city_Berlin', 'u336wtw14/14.999', '', '', ''],
                'Pretzel': ['city_Berlin', 'u336we05x/14.999', '', '', ''],
                'Skylark/Feldlerche': ['city_Berlin', 'u33d8ch15/14.999', '', '1911', 'Germany_SkylarkFeldlerche'],
                'Stroopwafel invasion in Berlin': ['city_Berlin', 'u33e0rucx/14.999', '', '', ''],
                'Sweet Heart': ['city_Berlin', 'u336v9wb8/14.999', '', '', ''],
                'Wittenauer MischMasch': ['city_Berlin', 'u337pnnqb/14.999', '1TvCn4zYgpMXHKv4K0PBnjMa76NePegF4jjTB_cvGfwM', '', '']
            },
            'Bielefeld': {
                'Charles Darwin': ['city_Bielefeld', 'u1q0145hh/14.999', '', '2108', 'Germany_CharlesDarwin'],
                'Lou [and Rob]': ['city_Bielefeld', 'u1npe380n/14.999', '', '2103', 'Germany_Lou[andRob]'],
                'Sparrenburg in Bielefeld': ['city_Bielefeld', 'u1np9ww9g/14.999', '', '', ''],
                'Waffenkammer in Bielefeld': ['city_Bielefeld', 'u1np9gg86/14.999', '', '', '']
            },
            'Bonn': {
                'BTHVN 2020': ['city_Bonn', 'u1j06c9wg/14.999', '', '', ''], // completed
                'Colors @Bonn': ['city_Bonn', 'u1j02nz06/14.99', '', '', ''], // completed
                'Event Pin': ['city_Bonn', 'u1j09d1xz/14.999', '', '', ''],
                'Munzee Logo': ['city_Bonn', 'u1hbrymvt/14.999', '', '1907', 'Germany_MunzeeLogo'], // GOTM
                'QR Code': ['city_Bonn', 'u1j02rpfx/14.999', '', '1903', 'Germany_QRCode'] // GOTM
            },
            'Karlsruhe': {
                'Flat-O-Fant': ['city_Karlsruhe', 'u0wn8q7u2/14.999', '', '2008', 'Germany_Flat-O-Fant'], // GOTM
                'Karlsruhe - Stadt des Rechts': ['city_Karlsruhe', 'u0tyyfy7z/14.999', '1jewr3-fxxXn6HPgNi4zSOe8ydN_cORi7QmyZvnDd_vg', '', ''] // empty
            },
            'Reutlingen': {
                'Appenzeller Sennenhund RT': ['city_Reutlingen', 'u0wecspcn/14.999', '1-AvO8enz9WYlMpeekGWPkVxNvZ-f63S0L3yfu1YfDxw', '', ''],
                'Are you X-Zee-perienced': ['city_Reutlingen', 'u0weber3n/14.999', '102QHEKr1_eHzeED1o26_qgWUMfDFC7S_rwAYsQRQyA8', '', ''],
                'Flats @ Appenzeller RT': ['city_Reutlingen', 'u0wecspcn/14.999009', '1M-9WjrBwHgMI7UEQybxwY9m5QzD-xlodk_m6EeZiFSc', '', ''],
                'Mixed Garden RT': ['city_Reutlingen', 'u0weck999/14.999', '', '', ''],
                'Patchwork RT': ['city_Reutlingen', 'u0wec7dyv/14.999', '12xqliOfumxZbSSNi6p7r0pjr7-gbCzyhioJ-DykF2lA', '', ''],
                'Peace': ['city_Reutlingen', 'u0we8z9mh/14.999', '1kz_9X3qo6HXUuEyMn9ZP9m2dcWwOk5y0xV45GJo6dxQ', '', ''],
                'Smells like ZeeSpirit - Kurt Cobain': ['city_Reutlingen', 'u0ws1b5wm/14.999', '1CP8x9y0IyA_NYHi58nhQHU7reAYefkcq8AihMwt-ayg', '', ''], // [*]
                'Sportpark Evolutions RT 1': ['city_Reutlingen', 'u0wec15u9/14.999', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
                'Sportpark Evolutions RT 2': ['city_Reutlingen', 'u0wec1kg4/14.999', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
                'Wedding Day': ['city_Reutlingen', 'u0webcwke/14.999', '', '', '']
            },
            'Tübingen': {
                'George - the Fab 4/2': ['city_Tubingen', 'u0w7yp6un/14.999', '1whtNX40rfK72iTvKxaaEd5rZLpq6_iXZ5V6NSzJ4vZA', '', ''],
                'John - the Fab 4/1': ['city_Tubingen', 'u0w7vzm9n/14.999', '', '2211', 'Germany_JohnTheFab41'], // [*]
                'Paul - the Fab 4/3': ['city_Tubingen', 'u0w7yrd1n/14.999', '1wlcEVbnafMexotRJMsSHxFtWLaLl-hvg7gayoIOYBCs', '', ''],
                'Ringo - the Fab 4': ['city_Tubingen', 'u0w7yn1s8/14.999', '1iljO6wikjSvOBmfUp4Qt9bxKCe9wSDheoMkYEVfyUn0', '', '']
            }
        },
        'Hungary': {
            'Budapest': {
                '64color': ['city_Budapest', 'u2mw4qzsx/14.999', '', '', ''],
                'Black Cat': ['city_Budapest', 'u2mw19v40/14.999', '', '', ''],
                'Budapest Easter': ['city_Budapest', 'u2mw6bs9y/14.999', '13ujSRsUp1jBDOcZj41XOc8HDbwr7yuNoAmg6HxrDUpk', '', ''],
                'Chain Bridge': ['city_Budapest', 'u2mw1spfx/14.999', '', '', ''],
                'Christmas Tree in Budapest': ['city_Budapest', 'u2mw74ev2/14.999', '', '', ''],
                'Crossbow on Hármashatárhegy': ['city_Budapest', 'u2mqx8zje/14.999', '', '', ''],
                'Csepel Öböl': ['city_Budapest', 'u2mtfhmhq/14.999', '1oDPowweH8xpUpndJohFO2KS6CAlmSaVv2o9O8ArInjY', '', ''],
                'Csepel Vas és Fémművek Logó': ['city_Budapest', 'u2mtcd7c8/14.999', '1nRGY4F_IcGyf8IerM5L_OTTeczAYARho3I78Jp9HQyo', '', ''],
                'F-Bomb - Budapest': ['city_Budapest', 'u2mw4erzn/14.999', '', '', ''],
                'Farkas-erdő': ['city_Budapest', 'u2mwdz3qh/14.999', '1ILnAOLZb5gDoCOY6ujrRm7vdjB7mYDuI5VYiSaLLJjU', '', ''],
                'Flags in Budapest': ['city_Budapest', 'u2mw9m10r/14.999', '', '', ''],
                'Flat Matt in Budapest': ['city_Budapest', 'u2mw1keu9/14.999', '1pJ_dxZucfNRFVqDH1vY4Ot9HzrwgZco_7HpxwehOHIs', '', ''],
                'Grail': ['city_Budapest', 'u2mw30kw9/14.999', '', '', ''],
                'Húsvéti piros tojás': ['city_Budapest', 'u2mw6bsm1/14.999', '', '', ''],
                'Jewel & Color': ['city_Budapest', 'u2mw6egv5/14.999', '', '', ''],
                'Lovagok kertje': ['city_Budapest', 'u2mw68gkq/14.999', '', '', ''],
                'MH felirat': ['city_Budapest', 'u2mw4g06j/14.999', '', '', ''],
                'Munzee Logo': ['city_Budapest', 'u2mtbxcxh/14.999', '', '', ''],
                'Q94': ['city_Budapest', 'u2mw4g3wx/14.999', '', '', ''],
                'Rubik`s Cube': ['city_Budapest', 'u2mw353ed/14.999', '1HFM0MU5MWWUI3ysgdUh-yCu2mIB0p7qCIVQcmAtk7J8', '', ''],
                'RWG': ['city_Budapest', 'u2mw70355/14.999', '', '', ''],
                'Santa`s Sledge': ['city_Budapest', 'u2mw44m62/14.999', '', '', ''],
                'Shield Budapest': ['city_Budapest', 'u2mw3fteq/14.999', '', '', ''],
                'Snoopy in Budapest': ['city_Budapest', 'u2mtdj0e2/14.999', '', '', ''],
                'Steamship on Danube': ['city_Budapest', 'u2mw1t103/14.999', '', '', ''],
                'Surprise Airline': ['city_Budapest', 'u2mwhznbx/14.999', '1uwCGphmz2YC44lvl9CsMypbzMhHyjaEJY2Qnz2XYTlo', '', ''],
                'Surprise Car': ['city_Budapest', 'u2mw772ht/14.999', '', '', ''],
                'Surprise in Budapest': ['city_Budapest', 'u2mw18ymw/14.999', '', '', ''],
                'Swans by the Danube': ['city_Budapest', 'u2mtdufs5/14.999', '', '', ''],
                'Tank': ['city_Budapest', 'u2mqr80z7/14.999', '', '', '']
            },
            'Debrecen': {
                '60 Color': ['city_Debrecen', 'u2rqk5m6n/14.999', '', '', ''], // completed
                '60 Flat': ['city_Debrecen', 'u2rqk5m38/14.999', '', '', ''], // completed
                'Beagle': ['city_Debrecen', 'u2rqe9sxg/14.999', '', '', ''], // completed
                'Cata-Joy': ['city_Debrecen', 'u2rq7208j/14.999', '', '', ''], // completed
                'Cimbi': ['city_Debrecen', 'u2rq7vk57/14.999', '', '', ''], // completed
                'Colors': ['city_Debrecen', 'u2rqe2txv/14.999', '', '', ''], // completed
                'Debrecen': ['city_Debrecen', 'u2rqsnxbs/14.999', '', '', ''], // Debrecen
                'Debrecen 2202': ['city_Debrecen', 'u2rqk5cfd/14.999', '1PqIFXwIVCj2vF0Wn7lirVxmaxHGuw35RuwuPeX4RC6I', '', ''], // empty
                'Debreceni kereszt': ['city_Debrecen', 'u2rqk7rjj/14.999', '', '', ''], // completed
                'DeoCaching Clan': ['city_Debrecen', 'u2rqs7b4m/14.999', '', '', ''], // completed
                'Electric Debrecen': ['city_Debrecen', 'u2rq7fsvq/14.999', '1_f4qfJlP9VX9-uZrfOiyh88tswVDqqiZTcSUXHfIOnw', '', ''], // empty
                'Evolution': ['city_Debrecen', 'u2rqk5174/14.999', '', '', ''], // completed
                'Flat Debrecen': ['city_Debrecen', 'u2rqk56jy/14.999', '1AVig5lE1FL7Wa9g7V3QpIIqhr45MYpFuBwnvpqp_8XM', '', ''], // empty
                'Flower Carnival in Debrecen': ['city_Debrecen', 'u2rqs2c96/14.999', '', '', ''], // completed
                'Great Church': ['city_Debrecen', 'u2rqkszmr/14.999', '', '', ''], // completed
                'Honey': ['city_Debrecen', 'u2rqkq0ze/14.999', '', '', ''], // completed
                'Jewel Sandwich': ['city_Debrecen', 'u2rqk555v/14.999', '1bB12wFOBvHDW7caPKFjbdUEcgTmc6jCCuPzXMXH8uyg', '', ''], // empty
                'Picu': ['city_Debrecen', 'u2rqkn2gm/14.999', '', '', ''], // completed
                'QR': ['city_Debrecen', 'u2rqkgr9r/14.999', '', '', ''], // completed
                'Tócóskert`s Arrows': ['city_Debrecen', 'u2rq7shg2/14.9991', '', '', ''], // completed
                'Tócóskert`s Arrows 2': ['city_Debrecen', 'u2rq7shg2/14.9992', '', '', ''], // completed
                'Tócóskert`s Arrows 3': ['city_Debrecen', 'u2rq7shg2/14.9993', '1YNXFNfzN6kCH0Z10sonYsZb8qaDhzBGa5QvwtC8sARM', '', ''] // empty
            },
            'Kecskemét': {
                'Goat in Kecskemét': ['city_Kecskemet', 'u2mfzfbg7/14.999', '1gV4BtG930czWJFu2EqmlC7QnhB0M-ehCzv94rnMKZMc', '', ''], // empty
                'Kavicsbánya Kecskemét': ['city_Kecskemet', 'u2mfztk6u/14.999', '', '', ''], // completed
                'Kodály`s Violin': ['city_Kecskemet', 'u2q4b5j10/14.999', '', '', ''], // completed
                'Santa Claus`s sack Kecskemét': ['city_Kecskemet', 'u2q4bp67c/14.999', '', '', ''], // completed
                'Shield Kecskemét': ['city_Kecskemet', 'u2q4bk348/14.999', '1p8pP3IDh0Bvpqht38rQp5Xd6Nkjj-OpDtaVx7HkFEAo', '', ''], // empty
            },
            'Komárom': {
                'Brigetio': ['city_Komarom', 'u2kzt1v7q/14.999', '1lalErwcZmw8n-LJbHCjs0w_-VoR3g6nUkKICXTQ-Cyk', '', ''], // empty
                'Flower at Fort Monostor': ['city_Komarom', 'u2kzeueyv/14.999', '', '2005', 'Hungary_FlowerAtFortMonostor'] // GOTM
            },
            'Szeged': {
                '10th Birthday Cake': ['city_Szeged', 'u2nr4gcmd/14.999', '', '', ''],
                '64color, Szeged': ['city_Szeged', 'u2nr4gmsq/14.999', '', '', ''],
                'Crossbow in Szeged': ['city_Szeged', 'u2nr4hjvw/14.999', '1KVAR7uRR3DQhAvpNA034pFOwllbzRVTYw3aVpzY0S2s', '', ''],
                'Evolution': ['city_Szeged', 'u2nr562g8/14.999', '1pUHXEhV7x4A6N9E298d5ZwoERMkOZUCf-4tSb4jYNzQ', '', ''],
                'Goldfish': ['city_Szeged', 'u2nr55p9z/14.999', '', '2006', 'Hungary_Goldfish'],
                'Pegasus': ['city_Szeged', 'u2nr4fkzr/14.999', '', '1908', 'Hungary_Pegasus'],
                'Szeged a Napfény Városa': ['city_Szeged', 'u2nr4s236/14.999', '', '', ''],
                'Szeged felirat': ['city_Szeged', 'u2nr4dvn4/14.999', '', '', ''],
                'SZTE': ['city_Szeged', 'u2nr474hq/14.999', '1EGN8vHhCLjjeRImTOcc3F8rZziZUZsNlL_wCkdm2l-o', '', ''],
                'Tisza': ['city_Szeged', 'u2nr4eskk/14.999', '', '', ''],
                'Votive Church': ['city_Szeged', 'u2nr55dy9/14.999', '1IxdGbOYKkchcyuJ9l3h8a5veZEPAq-YlQEjkWaKYyjA', '', ''] // [*]
            },
            'Tatabánya': {
                'Alsógalla JoyPrize': ['city_Tatabanya', 'u2mne5ju5/14.999', '18yKphmI_Ds9ThkWVnU3F1D40U-BrpuGMhDx9-lnEmp8', '', ''], // empty
                'Crossbow in Tatabánya': ['city_Tatabanya', 'u2mne32nt/14.999', '1bZK5HinI4dsTlBpcMayie9BZTedIqqOtM0TCzmXx0UE', '', ''], // empty
                'MaXGarden': ['city_Tatabanya', 'u2mndcvk0/14.999', '', '', ''], // completed
                'Miner Symbol': ['city_Tatabanya', 'u2mndxhne/14.999', '1AgZ-dxeHxt-WRCGsHA5hlTkQ9UzuD5KAFNiq5VtZlpk', '', ''], // empty
                'Stroopwafel invasion in Felsőgalla': ['city_Tatabanya', 'u2mn7yzxz/14.999', '', '', ''], // empty
                'Tatabanya Blackhole': ['city_Tatabanya', 'u2mndeqbd/14.999', '14HW0wCb9TEP6ThgSLTSeLjNwAgwJhxUnQkXX0o_not4', '', ''] // empty
            }
        },
        'Lithuania': {
            'Kaišiadorys': {
                'Akmenynas': ['city_Kaisiadorys', 'u9c2h7epw/14.999', '', '', ''],
                'Baltic Way 30': ['city_Kaisiadorys', 'u9c2hu8uh/14.999', '', '', ''], // [*]
                'Kaišiadorys Crossbow': ['city_Kaisiadorys', 'u9c2huzrg/14.999', '', '', ''],
                'Kaišiadorys Hammer': ['city_Kaisiadorys', 'u9c25u5tp/14.999', '', '', ''],
                'Kaišiadorys Mini Electric': ['city_Kaisiadorys', 'u9c2hhy9b/14.999', '', '', ''],
                'Virus Bomb': ['city_Kaisiadorys', 'u9c2h7w98/14.999', '', '', '']
            },
            'Kaunas': {
                'February Event': ['city_Kaunas', 'u9c03tcwt/14.999', '1dAfI8coAEX87J3UEW2n-hcIAeYz4VdfbT0a9PtFIHeA', '', ''],
                'Kaunas Basketball': ['city_Kaunas', 'u9c020cgg/14.999', '1s70ce7vPCLgfIw8W_nheAe6rMB7P1t89RSSRaUY6_44', '', ''],
                'Kaunas Green Leaf': ['city_Kaunas', 'u9c03mku3/14.999', '', '', ''],
                'Kaunas Lightning': ['city_Kaunas', 'u9c03z4uv/14.999', '1BXiUc9pI1ZSIbVs4P2dqSqXHl91p0sWY7jkjdEmzW34', '', ''],
                'Kaunas Magnet': ['city_Kaunas', 'u9c03t0v3/14.999', '1reQrPZ1HfXBS35tAVPHAGVhJXHhKGW3hFzUq8fwbHx0', '', ''], // [*]
                'Kaunas Scatter 1': ['city_Kaunas', 'u9c06nf52/14.999', '', '', ''],
                'Kaunas Scatter 2': ['city_Kaunas', 'u9c03wx5s/14.999', '1ABpXI8_tjp5PxzTKDiHzWt2QB-EUSHYvM3mbMo2Va7I', '', ''],
                'Pistachio Ice Cream in Kaunas': ['city_Kaunas', 'u9c03q762/14.999', '', '', ''],
                'Rotuses Square Kaunas': ['city_Kaunas', 'u9bbr99v5/14.999', '', '', '']
            },
            'Vilnius': {
                'Lukiskes Square': ['city_Vilnius', 'u99zp5cqw/14.999', '', '', ''],
                'Ozo Park Flats': ['city_Vilnius', 'u99zr1nu7/14.999', '1Y0HmRjQhxLNTZ_XQttJLtiWUxC-T61s1GNL-K5Z1NWs', '', ''],
                'Ozo Parkas': ['city_Vilnius', 'u99zr35t2/14.999', '', '', ''],
                'Scared Kitty': ['city_Vilnius', 'u99zqup56/14.999', '', '2003', 'Lithuania_ScaredKitty'], // [*]
                'Šeškinės skulptūrų parkas': ['city_Vilnius', 'u99zq1jmb/14.999', '1LFMjat3E_5eUF1dMwy8L6sLidpWUomdWUPH7ztg6t5M', '', '']
            }
        },
        'Netherlands': {
            'Amsterdam': {
                'Anker / Anchor': ['city_Amsterdam', 'u173vy0ff/14.999', '', '', ''],
                'Evolution-1 Ruige Riet': ['city_Amsterdam', 'u173vmynm/14.999', '', '', ''],
                'Evolution-2 Ruige Riet': ['city_Amsterdam', 'u173vmw5w/14.999', '', '', ''],
                'Evolution-3 Ruige Riet': ['city_Amsterdam', 'u173vmmuc/14.999', '1d1WccASOINUviij2ISYr0Oy61S0KZcwVwSMXxVQ9qx4', '', ''],
                'Kruisboog / Crossbow': ['city_Amsterdam', 'u173vkvyt/14.999', '', '', ''],
                'Kruisboog / Crossbow2': ['city_Amsterdam', 'u173vszfq/14.999', '', '', ''],
                'Kruisboog / Crossbow4': ['city_Amsterdam', 'u173vsjv8/14.999', '', '', ''],
                'Pin-NL': ['city_Amsterdam', 'u173vdujq/14.999', '', '', ''],
                'Roodborstje / Robin': ['city_Amsterdam', 'u173vucc9/14.999', '', '', ''],
                'Slak / Snail': ['city_Amsterdam', 'u173vrytn/14.999', '', '', ''], // [*]
                'Surprise': ['city_Amsterdam', 'u173vt3u1/14.999', '', '', ''],
                'Uil / Owl': ['city_Amsterdam', 'u173vsbr2/14.999', '', '', '']
            },
            'Beeckestijn': {
                'Crossbows Beeckestijn': ['city_Beeckestijn', 'u1763sspe/14.999', '', '', ''], // completed
                'Evolution Beeckestijn': ['city_Beeckestijn', 'u1763u3rj/14.999', '1aPnw5C22EQXpXadkF_jg8B5wBPxeq_cgh3eQtEtYDZY', '', ''], // empty
                'Lucky Clover': ['city_Beeckestijn', 'u1763sv5g/14.999', '', '', ''] // completed
            },
            'Echt': {
                'Cittaslow - Echt': ['city_Echt', 'u1h4vc86y/14.999', '', '', ''],
                'Crossbow Garden Echt': ['city_Echt', 'u1h4tqutt/14.999', '', '', ''],
                'EvoApple Ech': ['city_Echt', 'u1h4tr7p2/14.999', '', '', ''],
                'Vlag Echt': ['city_Echt', 'u1h4vf56p/14.999', '', '', '']
            },
            'Heerenveen': {
                'Air Brush Palet': ['city_Heerenveen', 'u1kjmg4vf/14.999', '1m9wvpVxz1C65NZaIQTN3CAzz-ElYUSLBGvw-Ic5QMmw', '', ''],
                'EVO Keunst Tún': ['city_Heerenveen', 'u1kjq3cr1/14.999', '1OzvH9-QHKyj4KQOMv91leNZX3byA838i2nPgdCuoTHY', '', ''],
                'Jewel Face': ['city_Heerenveen', 'u1kjq1fks/14.999', '1ciDwGIghYKZibvp-9jg_xbEN7J1-rb6Y4sviwbbpIAQ', '', ''],
                'Krúsbôge Oertún': ['city_Heerenveen', 'u1kjpyfy1/14.999', '', '', ''],
                'Krúsbôgetún it Kanaal': ['city_Heerenveen', 'u1kjq5k8x/14.999', '', '', ''],
                'Museum Belvédère': ['city_Heerenveen', 'u1kjr9h36/14.999', '', '', ''], // [*]
                'The Flats': ['city_Heerenveen', 'u1kjr2qnz/14.999', '1_WtHLHF5OVLjYs56mZrvFJNKh6dbvgDo9sOc0fRqlF4', '', '']
            },
            'Lemmer': {
                'Groene Stroom': ['city_Lemmer', 'u1khdnhch/14.999', '', '', ''], // completed
                'Klomp': ['city_Lemmer', 'u1kh9ggr7/14.999', '', '', ''], // completed
                'Pompeblêd Palet': ['city_Lemmer', 'u1khd5y3q/14.999', '', '', ''], // completed
                'Tea at Grandma': ['city_Lemmer', 'u1kh9uc8m/14.999', '', '', ''],
                'The Wall': ['city_Lemmer', 'u1kh9upnp/14.999', '', '', '']
            },
            'Noordwijk': {
                'Boogie Woogie': ['city_Noordwijk', 'u171jxtkq/14.999', '', '1904', 'Netherlands_BoogieWoogie'],
                'Catch the black sheep!': ['city_Noordwijk', 'u171jw7ts/14.999', '', '', ''],
                'Cybertruck': ['city_Noordwijk', 'u171jq7yk/14.9999', '', '', ''],
                'Escher vs Mondriaan': ['city_Noordwijk', 'u171jx5qv/14.999', '', '', ''],
                'Go Green Noordwijk': ['city_Noordwijk', 'u171jr08j/14.999', '', '', ''],
                'Superman vs Batman': ['city_Noordwijk', 'u171jz6j8/14.999', '', '', ''] // [*]
            },
            'Schiedam': {
                'Cars Flat': ['city_Schiedam', 'u15p7thk4/14.999', '', '', ''],
                'Cars Schiedam': ['city_Schiedam', 'u15p7v3c1/14.999', '', '', ''],
                'Cars Virtual': ['city_Schiedam', 'u15p7thkj/14.999', '', '', ''],
                'Dark Side Of The Moon': ['city_Schiedam', 'u15p7whzh/14.999', '', '', ''],
                'Honey Bee': ['city_Schiedam', 'u15p7dytj/14.999', '', '2305', 'Netherlands_HoneyBee'], // [*]
                'Honeycombs Schiedam': ['city_Schiedam', 'u15p7fguu/14.999', '', '', ''],
                'Honeycombs-2 Schiedam': ['city_Schiedam', 'u15p7g567/14.999', '', '', ''],
                'Mario Kart': ['city_Schiedam', 'u15p7veys/14.999', '', '', ''],
                'Pac Man, Schiedam': ['city_Schiedam', 'u15p7t3y2/14.999', '1TWlIcAKYRzh_7T4ZNyI7PZO8ffUNZTI9EYrZLTBd4ys', '', ''],
                'Vlinderhoven Flat': ['city_Schiedam', 'u15p7xqxj/14.999', '1eL7lJ5MGhxQaDQo-_PhTLPnIr3t4ARicTsH-SYo2IeQ', '', ''],
                'Vlinderhoven Schiedam': ['city_Schiedam', 'u15p7xtxw/14.999', '1zrCfmFAlu1a5jgf3wDdCOBvUs_b2TRwIfTsvaSX1qlk', '', '']
            }
        },
        'New Zealand' : {
            'Auckland': {
                'Auckland Anzac Poppy': ['city_Auckland', 'rckq1twss/14.999', '1T8QE5HNxue9VmwCEAbTwLhke4U_p4NdAhOfq_M97vUA', '', ''],
                'Auckland Anzac Poppy Title': ['city_Auckland', 'rckq1wncw/14.999', '1qP452Ii_JIggfMDTg5TKaXTJ3iN10bOHlYQkPx1Yitw/edit#gid=274990366&range=A4', '', ''],
                'Auckland Pohutukawa Flower': ['city_Auckland', 'rckq9hfrc/14.999', '12OabYBKTWzlA1BNqIoNTA3hKZhLvBjeRZtHMFQwHSsI', '', ''], // [*]
                'Grafton Star': ['city_Auckland', 'rckq2cs4g/14.999', '', '', ''],
                'Grafton Star (Flats)': ['city_Auckland', 'rckq2cs4g/14.999009', '', '', ''],
                'Howick Beach Boat': ['city_Auckland', 'rckqhgfu4/14.999', '117tNzujMC6Rhnd88argwafssHWuo_jq3lYwAv1UVJ74', '', ''],
                'Howick Jewel Art #1': ['city_Auckland', 'rckqh6yb4/14.999', '', '', ''],
                'Howick Jewel Art #1 (Flats)': ['city_Auckland', 'rckqh6yb4/14.999009', '1lugsFfQJ09pV26JwYPeWQ0V3QUXQBc2rwh7EzND2R4s/edit#gid=1511359877&range=B1:K1', '', ''],
                'Howick Jewel Art #2': ['city_Auckland', 'rckqh6qzf/14.999', '', '', ''],
                'Howick Munzee Triangle': ['city_Auckland', 'rckqhu88r/14.999', '1OClN5OWqvsJssXZoqODDyWhP82roa4q38c4EvPfjCH4', '', ''],
                'Howick Night Vision Goggle Square': ['city_Auckland', 'rckqh4pxn/14.999', '', '', ''],
                'Howick Pine Tree': ['city_Auckland', 'rckqhd3yz/14.999', '1MUqJQFtsFUdwlhOV9hhbAs9shylMivReUGkBaGPItPw', '', ''],
                'Howick RUM Patch': ['city_Auckland', 'rckqhevs6/14.999', '1SATC7p0SEzwL-KsTW15Dub3YTUUSY3CMLGXnMj0N7eE', '', ''],
                'Lloyd Elsmore Evolutions': ['city_Auckland', 'rckq5cw4n/14.999', '17v6TlhvZaBt2O0bQ5jBcCapzUWf-K_0_fY81Vmdj2VM', '', ''],
                'Lloyd Elsmore Jewels': ['city_Auckland', 'rckq5fpze/14.999', '1yUdQbvXSFie3wK2eCobQcDWOWi34OTSWOTzOiY_ykxk', '', ''],
                'Musick Point Golf Tee': ['city_Auckland', 'rckq7fpwv/14.999', '12IhFKlHL0ato5b0L9k31E_HXXnb2mkMSylB5UHA-yTc', '', ''],
                'Newmarket Bowling': ['city_Auckland', 'rckq307y5/14.999', '1pA6MpRK-2E0uFY6EYbwAvugzh7To63QHHtXG7F5Y85k', '', ''],
                'Remuera / SH1 Munzee Art': ['city_Auckland', 'rckq1mp5r/14.999', '', '', ''],
                'Virtual Kiwi': ['city_Auckland', 'rckq3ry2v/14.999', '', '', ''],
                'Western Park Scatter': ['city_Auckland', 'rckq2ddet/14.999', '', '', '']
            }
        },
        'Poland': {
            'Legnica': {
                'Legnicki gołąbek': ['city_Legnica', 'u35e26neh/14.999', '1KvU887pfqyJMbAdj_Wr0VTLdxIX1_ZkHLQYRQ3d1dmM', '', ''],
                'Minecraft Sword': ['city_Legnica', 'u357rcyex/14.999', '', '', ''],
                'Muzyczne Nutki': ['city_Legnica', 'u357r4tw6/14.999', '', '', ''],
                'Piernikowa Chatka': ['city_Legnica', 'u357rg2hd/14.999', '', '', ''],
                'Pisanka Wielkanocna': ['city_Legnica', 'u35e21hpm/14.999', '', '', ''],
                'Wiosenna Pszczółka': ['city_Legnica', 'u35e2b83d/14.999', '1H2TW70BiI3qIiNzILwHbLOaCSoO8EH3mWtlKTaHN3Ec', '', ''],
                'Zamek Piastów': ['city_Legnica', 'u357rbhkt/14.999', '', '2209', 'Poland_ZamekPiastow'] // [*]
            },
            'Opole': {
                '2021 Tweedle-Dee': ['city_Opole', 'u3hb33uwv/14.999', '', '', ''],
                '2022 ForgetMeNot': ['city_Opole', 'u3hb2c6y3/14.999', '1WDACqgB5Dq0j5_mdZ20vXTqqgZODlu7gy9MUPzs7Ckw', '', ''],
                'Diamond in the Rough': ['city_Opole', 'u3hb2bdbc/14.999', '1C5C0CbNVuUS9GYYNP1cBp9_FY0ifbuWgrDq1cwJtT2k', '', ''],
                'Mickey': ['city_Opole', 'u3h8rbvr7/14.999', '1ogMoXJb_YHyjdBEaa4P4IXxLBomp37wZYu27iew1kNA', '', ''],
                'Opole Rocks!': ['city_Opole', 'u3h8px680/14.999', '1BhdCh0udXrBuboHdAk8okDuGehW7IAY1VrXKeaEbacY', '', ''] // [*]
            },
            'Wroclaw': {
                'Easter Egg': ['city_Wroclaw', 'u3h4efqv1/14.999', '', '', ''],
                'Electric': ['city_Wroclaw', 'u3h4e7pyw/14.999', '', '', ''],
                'Fala': ['city_Wroclaw', 'u3h4ezk0r/14.999', '', '', ''],
                'Jewel': ['city_Wroclaw', 'u3h4u8rfs/14.999', '', '', ''],
                'Krasnal wrocławski': ['city_Wroclaw', 'u3h4u9jw3/14.999', '1hqOMr6MnWbsAYV2OL-Q6d2P-lTTSmCpAwvoV37CU02s', '', ''],
                'My World': ['city_Wroclaw', 'u3h4g4ngg/14.999', '', '', ''],
                'No i Gitara!': ['city_Wroclaw', 'u3h4u34bc/14.999', '', '', ''],
                'PacMunzee': ['city_Wroclaw', 'u3h4uc3fn/14.999', '1Uv1kI2-qpMQ9jTCz3-NYgPrle2v--Brm07lEikFcW-o', '', ''],
                'Reksio': ['city_Wroclaw', 'u3h4fk4fw/14.999', '', '', ''],
                'Stay at Home': ['city_Wroclaw', 'u3h4ffh2k/14.999', '', '', ''],
                'W': ['city_Wroclaw', 'u3h4ezyqf/14.999', '', '', ''],
                'Welonka': ['city_Wroclaw', 'u3h4ese4q/14.999', '', '', ''],
                'Wro Tram': ['city_Wroclaw', 'u3h4fdu03/14.999', '', '', ''],
                'Wroclove': ['city_Wroclaw', 'u3h4epv9h/14.999', '15DQ_kqxP33dX29YI9nuESwgz0BALAQ0HwBKugPnQWgc', '', '']
            }
        },
        'Portugal': {
            'Funchal': {
                '1˚ Madeira Sapphires Twin': ['city_Funchal', 'etgcxrry9/14.999', '', '', ''],
                'High Voltage Madeira Island': ['city_Funchal', 'etgcz3tw7/14.999', '', '', ''], // [*]
                'Largo da Paz': ['city_Funchal', 'etgcwykmg/14.999', '', '', ''],
                'Madeira Monumental': ['city_Funchal', 'etgcwtt9u/14.999', '', '', '']
            }
        },
        'Slovakia': {
            'Bratislava': {
                '1st Day Evo': ['city_Bratislava', 'u2s1v068r/14.999', '', '', ''], // completed
                'Agent Sun': ['city_Bratislava', 'u2s1zptrk/14.999', '', '', ''], // completed
                'Alfred Wetzler Mini Flat': ['city_Bratislava', 'u2s1ywfxk/14.999', '', '', ''],
                'Alien': ['city_Bratislava', 'u2s1v1wd3/14.999', '', '', ''], // completed
                'Black Moth Squad': ['city_Bratislava', 'u2s1vx5xv/14.999', '', '2110', 'Slovakia_BlackMothSquad'], // GOTM
                'Bosnia Flag in Bratislava': ['city_Bratislava', 'u2s1yrt3z/14.999', '', '', ''], // completed
                'Bratislava': ['city_Bratislava', 'u2s1v79nt/14.999', '', '', ''], // completed
                'Candle Tombstone': ['city_Bratislava', 'u2s1zhnn4/14.999', '', '', ''], // completed
                'Charge Bratislava': ['city_Bratislava', 'u2s1vyxmx/14.999', '', '', ''], // completed
                'Chilli Killer': ['city_Bratislava', 'u2s1yptfq/14.999', '1zl82l1o9AL3OJQoczvnjO8XLxrMnmrPwaClohQUQQf8', '', ''], // empty
                'Christmas Stable': ['city_Bratislava', 'u2s1uyuvm/14.999', '', '', ''],
                'Devín Castle': ['city_Bratislava', 'u2s443y3v/14.999', '', '', ''], // completed
                'Electric (Letters)': ['city_Bratislava', 'u2s45fecu/14.999', '', '', ''], // completed
                'Evo Flower Bratislava': ['city_Bratislava', 'u2s1vsd96/14.999', '', '', ''], // completed
                'Folk CrossBow': ['city_Bratislava', 'u2s4jcj5k/14.999', '', '2102', 'Slovakia_FolkCrossBow'], // GOTM
                'Fortress Maze Party': ['city_Bratislava', 'u2s1vzfpn/14.999', '1uFeynxkjT8AuMv-jG68bQmBaLuoabEL5aBdJJXUNFCE', '', ''], // empty
                'Hungry Bat Terry': ['city_Bratislava', 'u2s1yt9t7/14.999', '', '2210', 'Slovakia_HungryBatTerry'], // GOTM
                'Icemen in love': ['city_Bratislava', 'u2s1yzv55/14.999', '', '2212', 'Slovakia_IcemenInLove'], // GOTM
                'Jewels Note': ['city_Bratislava', 'u2s1zefpc/14.999', '', '2010', 'Slovakia_JewelsNote'], // GOTM
                'Lake Lighthouse Painting': ['city_Bratislava', 'u2s1yq0c2/14.999', '1uPcuR_pfgSrZkRT_vobeQT5WyA9cA77whn_SjFSFfPM', '', ''], // empty
                'Le Petit Prince': ['city_Bratislava', 'u2s1yxmhk/14.999', '', '', ''],
                'Night Vision Agent': ['city_Bratislava', 'u2s1vv279/14.999', '', '2101', 'Slovakia_NightVisionAgent'], // GOTM
                'Shamrock Ihro': ['city_Bratislava', 'u2s1yz6kg/14.999', '1WPDM7GblL8P73VyCqD-zTahkWBatOxTEzAyct-PKP3s/edit#gid=1953223548&range=A8', '', ''],
                'Shamrock Ihro (Flats)': ['city_Bratislava', 'u2s1yz6kg/14.999009', '1WPDM7GblL8P73VyCqD-zTahkWBatOxTEzAyct-PKP3s/edit#gid=1143462191&range=A8', '', ''],
                'Shisha BazHookah': ['city_Bratislava', 'u2s1ykf3k/14.999', '', '', ''],
                'Virtual Joy': ['city_Bratislava', 'u2s45g9ze/14.999', '', '', ''] // completed
            },
            'Martin': {
                'Crazy Frog': ['city_Martin', 'u2trqbknm/14.999', '', '', ''],
                'Giraffe': ['city_Martin', 'u2trnx81p/14.999', '1tLsNoogFtgYss2zsf6TNts7mfL31RYNgt7xbseGEVjc', '', ''], // [*]
                'Srdce pre Moni': ['city_Martin', 'u2trn9u68/14.999', '', '', ''],
                'Train Martin': ['city_Martin', 'u2trn7vez/14.999', '', '', '']
            },
            'Vrútky': {
                'Bike Kolónka': ['city_Vrutky', 'u2trqke30/14.999', '', '', ''],
                'Chick, Vrútky': ['city_Vrutky', 'u2trqswgh/14.999', '', '', ''],
                'Edison Light Bulb': ['city_Vrutky', 'u2trqkz7x/14.999', '', '', ''], // [*]
                'Hexagons of Vrutky': ['city_Vrutky', 'u2trqsut8/14.999', '', '', ''],
                'Lucky Clover': ['city_Vrutky', 'u2trqgg7h/14.999', '1SAr3RxeVvd-wpEl_LPLoWwPwFgIpZ1vyxQNvihrkMfs', '', ''],
                'Trpaslík :: Gnomie Vrutky': ['city_Vrutky', 'u2trqesyc/14.999', '', '2107', 'Slovakia_TrpaslikGnomieVrutky'],
                'Void pin Vrútky': ['city_Vrutky', 'u2trqv03k/14.999', '1WBF6pKlaFkEvN5KboWCw7XN_vw1FnhFZbylaVMkkLPA', '', '']
            }
        },
        'UnitedKingdom': {
            'Bournemouth': {
                'BeachUmbrella': ['city_Bournemouth', 'gcn8sbhwp/14.999', '', '2205', 'UnitedKingdom_BeachUmbrella'], // [*]
                'Bournemouth Beach huts!': ['city_Bournemouth', 'gcn8w32ez/14.999', '', '', ''],
                'Dorset Flag': ['city_Bournemouth', 'gcn8tuz0f/14.999', '1nDx4cElvYmOGRL2wvZ1Xrp7iXxoqMbAuJXK9V1HLhKg', '', ''],
                'FlatsHideNSeek': ['city_Bournemouth', 'gcn8wmup6/14.999', '', '', ''],
                'Lost Jellyfish in Bournemouth': ['city_Bournemouth', 'gcn8w3x64/14.999', '', '', ''],
                'MiniPortal3': ['city_Bournemouth', 'gcn8t1y5g/14.999', '', '', ''],
                'More Beach Huts': ['city_Bournemouth', 'gcn8x8fw5/14.999', '', '', '']
            },
            'Cromer': {
                'Cromer England Snowman': ['city_Cromer', 'u12vjewup/14.999', '', '', ''],
                'Cromer Jewel Triangle': ['city_Cromer', 'u12vhczs4/14.999', '', '', ''],
                'Cromers Gingerbread Man': ['city_Cromer', 'u12vjk6d6/14.999', '', '', ''],
                'Horatio the Hermit Crab': ['city_Cromer', 'u12vje1zv/14.999', '', '2205', 'UnitedKingdom_HoratioTheHermitCrab'], // [*]
                'Percy the Penguin visits the Seaside': ['city_Cromer', 'u12vj96p3/14.999', '', '', ''],
                'Seaside Ices in Cromer': ['city_Cromer', 'u12vj9w2c/14.999', '1RLh4ISndbFYrGsLtvYkzCkUp-xM-o6RRpVWYI68LCqw', '', '']
            },
            'London': {
                'Addington Sunflower Garden': ['city_London', 'gcpupqjhp/14.999', '13giemkWpIS8chxoir_IfDptsI2AqJt0Of-WygIGebxU', '', ''],
                'Cherry Lane Cemetery - Cross Garden': ['city_London', 'gcpsvygmw/14.999', '', '', ''],
                'Evo Plus Garden': ['city_London', 'u10j3w0hv/14.999', '', '', ''],
                'Evolution Flower': ['city_London', 'gcptn1qdm/14.999', '', '', ''],
                'Evolution Rainbow': ['city_London', 'gcpsvzrbd/14.999', '', '', ''],
                'Evolution Strip': ['city_London', 'gcpsys5xc/14.999', '', '', ''],
                'Hayes Rainbow': ['city_London', 'gcpsyqekv/14.999', '', '', ''],
                'Heathrow Airport Kingfisher': ['city_London', 'gcpsydds3/14.999', '', '', ''],
                'Heathrow Crossbow Arrow': ['city_London', 'gcpsyt1y9/14.999', '', '', ''],
                'Heathrow Flat Squares': ['city_London', 'gcpsykxuu/14.999', '1I5mgm7XWvPd9ZX93ZEDP3aHkvCXhBHNBpZFJlXyhvN4', '', ''],
                'Hendon Circle': ['city_London', 'gcpv7n9j7/14.999', '', '', ''],
                'Just Smile London': ['city_London', 'gcpvn9cq4/14.999', '1wmOlz3SOWBySUsdwzMn7r3baxoXeeIp5Gsa0S04SZyE', '', ''],
                'London Underground': ['city_London', 'gcpvk3gxr/14.999', '1Q2se3clBxfaFPRG99sHxwTikCuBrXhplE_BuZkiyKRM', '', ''],
                'Nipper': ['city_London', 'gcptn245e/14.999', '', '', ''],
                'Northfields London Underground Station': ['city_London', 'gcpubz19c/14.999', '1y2ehQRDEpGwko_XWESY7hFvMD-DvPWihemuSoMmTUfc', '', ''],
                'Ohio Flag': ['city_London', 'gcpstztrd/14.999', '', '', ''],
                'Rule Britannia Arrow': ['city_London', 'gcpvhqm6w/14.999', '', '', ''],
                'Sailing Boat': ['city_London', 'u10j6x1kx/14.999', '', '', ''],
                'Shades Garden': ['city_London', 'gcpsvv5fn/14.999', '', '', ''],
                'The Bunny Fields': ['city_London', 'gcpsyn7wf/14.999', '', '', ''],
                'The London Donut Cat': ['city_London', 'gcpvr83c6/14.999', '1_cmHCdBfJC9ps3hxiPszz-8AVGHjEC0dEGGTgqaq82s', '', ''],
                'Union Jack': ['city_London', 'gcpsvs5k3/14.999', '', '', ''],
                'West London Jewel': ['city_London', 'gcpsywswp/14.999', '', '', ''],
                'Woodland Animals - Badger': ['city_London', 'gcpupxnwb/14.999', '1dIki24JeaqkH-PupNFBSKFMutF-DthT6wIzcHykbZVE', '', ''],
                'Woodland Animals - Fox': ['city_London', 'gcpupqxt9/14.999', '1dIki24JeaqkH-PupNFBSKFMutF-DthT6wIzcHykbZVE', '', '']
            },
            'Lowestoft': {
                'Every Colour': ['city_Lowestoft', 'u134rt8cr/14.999', '', '', ''], // [*]
                'Mad Hatter!': ['city_Lowestoft', 'u134xd12c/14.999', '1qCkcX7ZcKITBbsnprkOWqgHLsEzdOSxq2u2dFstvdWI', '', ''],
                'Naomi`s Sloth': ['city_Lowestoft', 'u134rjr6e/14.999', '', '', ''],
                'Not Rudolph': ['city_Lowestoft', 'u134x3bsx/14.999', '1SQxGdZvyziZMdvvEjRtwJm_Oh_iLJqbhvJbcKW93EyU', '', ''],
                'NVG': ['city_Lowestoft', 'u134rx46d/14.999', '', '', ''],
                'Virtual Jewels': ['city_Lowestoft', 'u134rkmgd/14.999', '1DckwKQHiVOHiSv15-NX7mzfzatXumsTYEDZ-9U1i6zA', '', '']
            },
            'Romsey': {
                'Romsey Rainbow': ['city_Romsey', 'gcnfn417u/14.999', '', '', ''], // completed
                'Romsey Rainbow Unicorn': ['city_Romsey', 'gcnfnmn82/14.999', '', '', ''] // completed
            },
            'Sheringham': {
                'Ice Cream Cone': ['city_Sheringham', 'u12v5t3b7/14.999', '18buO5-KO-MKNQLz2ceTLGauwRsvTcrG6B41RNNK0cvA', '', ''],
                'Robin Redbreast': ['city_Sheringham', 'u12v5jy51/14.999', '1FB-p_ck3B0EvkLVAeVOcTfpZ3QnIvWRhpN0xBI83vsI', '', ''],
                'Sandcastle in Sheringham': ['city_Sheringham', 'u12v5qq8k/14.999', '', '2106', 'UnitedKingdom_SandcastleInSheringham'],
                'Sheringham Jewel Square': ['city_Sheringham', 'u12v5m5ps/14.999', '17Bo4pFQuZgd4JfeoPkdrDoIZEEaw8iUNzJE0eQq26p4', '', ''],
                'The Yellow Submarine': ['city_Sheringham', 'u12v57yrs/14.999', '', '2211', 'UnitedKingdom_TheYellowSubmarine'], // [*]
                'Virtual Love': ['city_Sheringham', 'u12v5ubbu/14.999', '1ERVj0mTf1ASlIzK-H_GKqAlV9D6T-5mYRHRFC5EMv9s', '', '']
            }
        },
        'USA': {
            'Amesbury': {
                'Cherry Bomb': ['city_Amesbury', 'drte9zeq3/14.999', '', '', ''], // completed
                'Mario Fireball Void': ['city_Amesbury', 'drtedxmgm/14.999', '1AOUKyBI2GWTI8iMaUMRPM-TjSwlSEjCpu7LbHMup7co', '', ''], // empty
                'Spy Goggles': ['city_Amesbury', 'drtef1j4r/14.999', '1U-K5KqdO57azZKaBAvpWY3v0Jqv8OBBA8np9Y1lkicA', '', ''] // empty
            },
            'Anaheim': {
                'Munzee Logo': ['city_Anaheim', '9qh0kzrek/14.999', '1gJ-XzslXgPFfcYPtWQ1VgZ5c_a680S-_K2F-b5W5XBU', '', ''], // empty
                'Stormtrooper': ['city_Anaheim', '9qh0k2zvk/14.999', '', '', ''] // completed
            },
            'Apple Valley': {
                'Apple Valley - Evolutionary Flower': ['city_AppleValley', '9zvwqtjtx/14.999', '', '', ''],
                'Apple Valley Eagle': ['city_AppleValley', '9zvww81r8/14.999', '19ws6xk_eFxgtADPCZfxp_oouQdYvQKVPGfQsCVK9lLY', '', ''], // empty
                'Baby Yoda Loves Munzee Mania 2020': ['city_AppleValley', '9zvwm7nt6/14.999', '', '', ''], // completed
                'Christmas Wreath': ['city_AppleValley', '9zvwqwvbs/14.999', '', '', ''], // completed
                'Lightek`s Minnesota Wild': ['city_AppleValley', '9zvwrt9px/14.999', '1JcZulDF5GjpPuGL5l0xn45xI9SpmaWhpSLNL3w0d_es', '', ''], // empty
                'R2-D2': ['city_AppleValley', '9zvwqnkce/14.999', '', '', ''], // completed
                'The Apple Valley Apple': ['city_AppleValley', '9zvwrj4rs/14.999', '', '', ''], // completed
                'Twin Cities Snowman': ['city_AppleValley', '9zvww0pfz/14.999', '', '', ''], // completed
                'Winter Olympics 2018': ['city_AppleValley', '9zvwqqu74/14.999', '', '', ''] // completed
            },
            'Bloomington': {
                'Christmas Snowman': ['city_Bloomington', '9zvxjdffs/14.999', '', '', ''],
                'Dog days of summer!': ['city_Bloomington', '9zvx4cm5j/14.999', '', '2306', 'USA_DogDaysOfSummer'],
                'MOA Christmas Card': ['city_Bloomington', '9zvxjfwnt/14.999', '', '2212', 'USA_MOAChristmasCard'], // [*]
                'MOA Dwarf Leprechaun': ['city_Bloomington', '9zvxn73ke/14.999', '', '', ''],
                'MOA Electric Monster': ['city_Bloomington', '9zvxn51xy/14.999', '', '', ''],
                'MOA Flower': ['city_Bloomington', '9zvxjgnp0/14.999', '', '', ''],
                'MOA MN Crossbow': ['city_Bloomington', '9zvxn5bhq/14.999', '', '', ''],
                'MOA Nutcracker': ['city_Bloomington', '9zvxnhr2r/14.999', '', '', ''],
                'MOA Penguin': ['city_Bloomington', '9zvxn5vvf/14.999', '', '', ''],
                'MOA Unicorn': ['city_Bloomington', '9zvxn49zw/14.999', '', '2005', 'USA_MOAUnicorn'],
                'MOA Yeti': ['city_Bloomington', '9zvxjuwtm/14.999', '', '', '']
            },
            'Burlington': {
                'Burlington Flamingo': ['city_Burlington', 'dnrmnmz0r/14.999', '', '', ''], // completed
                'North Carolina Jester Hat': ['city_Burlington', 'dnrmpzbjf/14.999', '', '2104', 'USA_NorthCarolinaJesterHat'] // GOTM
            },
            'Cedar Rapids':{
                'Cedar Rapids Barnyard': ['city_CedarRapids', '9zqy6qe13/14.999', '', '', ''],
                'Cedar Rapids, IA Flag': ['city_CedarRapids', '9zqy9ykqt/14.999', '1AFYsCyZ2Q7zXRSy33503bpFcvUj0RqgeHYft-v6Uu6U', '', ''],
                'Cedar Rapids Pumpkin': ['city_CedarRapids', '9zqyb9s0m/14.999', '', '1910', 'USA_CedarRapidsPumpkin'],
                'Cherry Bomb': ['city_CedarRapids', '9zqyb0gm4/14.999', '', '', ''],
                'CR Air Mystery Trail': ['city_CedarRapids', '9zqz461u7/14.999', '', '', ''],
                'CR April': ['city_CedarRapids', '9zqy6tdmm/14.999', '', '', ''],
                'CR Egyptian Zodiac': ['city_CedarRapids', '9zqy9vbz4/14.999', '', '', ''],
                'CR Electric Mystery': ['city_CedarRapids', '9zqy9w1zy/14.999', '', '', ''],
                'CR Farmer`s Field': ['city_CedarRapids', '9zqy6mwek/14.999', '', '', ''],
                'CR Feather': ['city_CedarRapids', '9zqydmwhp/14.999', '', '', ''],
                'CR Flat Matt Loves Baseball': ['city_CedarRapids', '9zqyfm0r7/14.999', '', '', ''],
                'CR Frankenstein': ['city_CedarRapids', '9zqyb98mv/14.999', '1Xjchz0lat1rb44QSGVuOUCpJmYjko7mnehr9gI_KCRg', '', ''],
                'CR Holiday Pizza': ['city_CedarRapids', '9zqy8y2d6/14.999', '', '', ''],
                'CR Honor Cross': ['city_CedarRapids', '9zqy9whw6/14.999', '', '', ''],
                'CR Jones Park Birthday 7': ['city_CedarRapids', '9zqydku0v/14.999', '', '', ''],
                'CR Jones Park Birthday 7 (Flats)': ['city_CedarRapids', '9zqydku0v/14.999009', '', '', ''],
                'CR Munzee 6th Birthday': ['city_CedarRapids', '9zqyctfv9/14.999', '', '', ''],
                'CR MunzFit 2.0': ['city_CedarRapids', '9zqz1svxg/14.999', '', '', ''],
                'CR Muscle Car': ['city_CedarRapids', '9zqy6kzhw/14.999', '', '', ''],
                'CR Rose': ['city_CedarRapids', '9zqyc08tb/14.999', '', '', ''],
                'CR Safari': ['city_CedarRapids', '9zqy6tnvg/14.999', '', '', ''],
                'CR Submarine': ['city_CedarRapids', '9zqy6mkwx/14.999', '', '', ''],
                'CR Vegetable': ['city_CedarRapids', '9zqy6q5vz/14.999', '', '', ''],
                'Electric J-Hawk': ['city_CedarRapids', '9zqy9rtfs/14.999', '1vFTvCmsllsDlou539rujoNMaH-R81m4j7lRqlPrc3hs', '', ''],
                'F-Bomb - Cedar Rapids': ['city_CedarRapids', '9zqy9z1s5/14.999', '', '', ''],
                'Flat Rob Birthday': ['city_CedarRapids', '9zqyctk1k/14.999', '', '', ''],
                'Hayes Battlefield': ['city_CedarRapids', '9zqydntth/14.999', '', '', ''],
                'Hotel Evo': ['city_CedarRapids', '9zqy6k6uy/14.999', '', '', ''],
                'Iowa Goldfinch': ['city_CedarRapids', '9zqyb3kzv/14.999', '', '', ''],
                'Noelridge Mystery': ['city_CedarRapids', '9zqz432fm/14.999', '', '', ''],
                'Noelridge Mystery (Flats)': ['city_CedarRapids', '9zqz432fm/14.999009', '', '', ''],
                'Unofficial CR Evo': ['city_CedarRapids', '9zqyd8hgw/14.999', '1TnyQsvsR0ZBkJuuAFW03Pe4qzCrYJzNLwed838pIMrg', '', '']
            },
            'Columbia': {
                'Camo Heart': ['city_Columbia', '9yymdqj77/14.999', '1_t7cVP8kUHumt1yBeBPUgdzcQw8zCZLOo88_-XDKXhs', '', ''],
                'Columbia Flat Lou': ['city_Columbia', '9yymdc1x9/14.999', '1X02S79bhEfvNDvIo1DUc5NqvP4JiQdGY47PepOS-C6I/edit#gid=826230316&range=A1', '', ''],
                'Columbia Flat Lou (Pink)': ['city_Columbia', '9yymdc1x9/14.999009', '1X02S79bhEfvNDvIo1DUc5NqvP4JiQdGY47PepOS-C6I/edit#gid=1646850004&range=A1', '', ''],
                'May the 4th Be With You': ['city_Columbia', '9yymeuhrq/14.999', '', '', ''],
                'Mizzou Tiger': ['city_Columbia', '9yymdf9bz/14.999', '1km5kfHyZHz2-SpvRwITpTrXYV1Kh12JjL4UXbXT4vXQ', '', ''] // [*]
            },
            'Concord': {
                'Birdhouse': ['city_Concord', '9yzdzxgvz/14.999', '', '', ''],
                'Birdhouse`s Goldfinch': ['city_Concord', '9yzep3hy1/14.999', '', '', ''],
                'Bohrer Park': ['city_Concord', '9yzepurxg/14.999', '', '', ''],
                'Bubbles': ['city_Concord', 'dnq95mfwp/14.999', '1alJZ-mOETcHJLlNpGz2v_j-EHddc4SjNn9ZFUsoOBJ4', '', ''],
                'Chickadee': ['city_Concord', '9yzep8yfh/14.999', '', '', ''],
                'Concord Hearts': ['city_Concord', '9yzg0jgfv/14.999', '', '', ''],
                'St. Louis Robin': ['city_Concord', '9yzdzrdv0/14.999', '', '', ''],
                'Woodpecker': ['city_Concord', '9yzep995f/14.999', '1gWPfPPIW7hkUKfyVyAb7Vf2H79lVRAATnHAWGAjS-Jk', '', ''] // [*]
            },
            'Cottleville': {
                'Celtic Knot': ['city_Cottleville', '9yzs2r3b7/14.999', '1Ayk16teU9Un5ignws3sti5ObAW26QzKVAk5IsmitLMc', '', ''],
                'Cottleville Dragonfly': ['city_Cottleville', '9yzs2qnqb/14.999', '', '', ''], // [*]
                'Cottleville Post': ['city_Cottleville', '9yzs3jkzp/14.999', '', '', ''],
                'Frankie Martin`s Food Truck - Hot Dog': ['city_Cottleville', '9yzs3jum0/14.999', '', '', ''],
                'Frankie Martin`s Food Truck - Ice Cream': ['city_Cottleville', '9yzs3jg6s/14.999', '', '', ''],
                'Frankie Martin`s Food Truck - Mug': ['city_Cottleville', '9yzs3jsju/14.999', '', '', ''],
                'Frankie Martin`s Food Truck - Pizza': ['city_Cottleville', '9yzs3juf5/14.999', '', '', '']
            },
            'Decatur': {
                'Decatur Bait Patch': ['city_Decatur', 'dp0drxy9t/14.999', '', '', ''],
                'Decatur Cornucopia': ['city_Decatur', 'dp0drqzps/14.999', '', '', ''],
                'Decatur Farm': ['city_Decatur', 'dp0dx9q1p/14.999', '', '', ''],
                'Decatur Hearts': ['city_Decatur', 'dp0dxenc6/14.999', '', '', ''] // [*]
            },
            'Fort Worth': {
                'Bright Colored Horse': ['city_FortWorth', '9vfdprxcn/14.999', '1FVne3eZU0yA8ZnkDoYccQ_D_Yf7nnpHsH7zrFXuSK2Q', '', ''],
                'Bright Colored Horse (Flats)': ['city_FortWorth', '9vfdprxcn/14.999009', '1FVne3eZU0yA8ZnkDoYccQ_D_Yf7nnpHsH7zrFXuSK2Q', '', ''],
                'Cowtown': ['city_FortWorth', '9vff88tju/14.999', '', '', ''],
                'Elvis is Hot Mega': ['city_FortWorth', '9vf9zjr5y/14.999', '1vGrEfMAgrenALb4jFybDLJxzlwP96KCYfsshXuf7Beg', '', ''],
                'Evo Hedgehog': ['city_FortWorth', '9vffcpcfg/14.999', '', '', ''],
                'FlatDancing': ['city_FortWorth', '9vf9zm46j/14.999', '1CVyPfKnUQ8-pBfy-CEDybNQd7Q6EGAO5hfkQqXaVCFk', '', ''],
                'Fort Worth 2020 Dumpster Fire': ['city_FortWorth', '9vf9xtnkc/14.999', '1I8FNMAO2Rq_xxUR48zFk_1UDxnKSGTJEz_quTOijDbk', '', ''],
                'Fort Worth Longhorn': ['city_FortWorth', '9vf9znt4b/14.999', '', '1906', 'USA_FortWorthLonghorn'],
                'Fort Worth Rootin` Tootin` Munzee Cow': ['city_FortWorth', '9vff34f4q/14.999', '1RbaihJYzfxQsejWnvlfav36Rw8PTvu37dUB_gsUhBUA', '', ''],
                'Fort Worth Succulents': ['city_FortWorth', '9vff272ph/14.999', '', '', ''],
                'Fort Worth, TX Cowboy Boots': ['city_FortWorth', '9vff2xznz/14.999', '1UBt9WaCiisz6DH6uJCjr83IB5WI91TyGhu04CbIA2IE', '', ''],
                'Geowoodstock 2019': ['city_FortWorth', '9vff24s1z/14.999', '', '', ''],
                'Geowoodstock XVII Texas': ['city_FortWorth', '9vfcbxwtn/14.999', '1kHK_RqTkm9DPx1obT4BobMVEN8kExuXABAGola9CRZI', '', ''],
                'HGH2 Memorial': ['city_FortWorth', '9vffcyrdj/14.999', '1L4fdYDRPxZbdHM5ggDBtBaQYbl1sxmClwHYy1z2tkEQ', '', ''],
                'Mystery Machine': ['city_FortWorth', '9vfdpwx10/14.999', '1GBfeZaUSk70kY24P3Tl8w99wf0GziR4CjaxngJ5S2dU', '', ''],
                'Ruh-roh--RAGGY!!!': ['city_FortWorth', '9vfdpmzmh/14.999', '1tzaw2r72P5iGlAQFaeQGkCYGjQrB2OrJvG2Q89AdkXc', '', ''],
                'Scooby Doo Crossbow': ['city_FortWorth', '9vff0pt1t/14.999', '1gPr_DrteOSaQ93ZlcxzLAsP5sAnDO4QTx0k_hcmLTgQ', '', ''],
                'Shaggy': ['city_FortWorth', '9vfdpzmgu/14.999', '1WCFA-GKfaX15o3Q7IdHVUYMvCW7d_AeuSTZ5SolSXls', '', ''],
                'Sunset Cowboy': ['city_FortWorth', '9vff269xn/14.999', '', '1901', 'USA_SunsetCowboy'],
                'TCU Horned Frogs': ['city_FortWorth', '9vff0931z/14.999', '1ODvwsf455ozeqDfprLG7jlOP9ylhMIuxKOroJdlyFDI', '', ''],
                'Texas Golden Ticket': ['city_FortWorth', '9vfdhhkk9/14.999', '', '', ''],
                'Texas Golden Ticket (Flats)': ['city_FortWorth', '9vfdhhkk9/14.999009', '1fAwIoOdHKk7EH6cIL28nxUYBTBCdlvM_p0zMHf0EIGI', '', ''],
                'Tiger King': ['city_FortWorth', '9vfcfhj93/14.999', '10AYhujmVdmQJeag_7vltMnei94lP3y7c7TeWT0PmPsY', '', ''],
                'Velma Crossbow': ['city_FortWorth', '9vff0n39v/14.999', '1Ce1o-NLHT2aBBTFiVWIdOjDP5AofVXkg9d0vXZ3xbCM', '', '']
            },
            'Georgetown': {
                'G 62 West Evo': ['city_Georgetown', 'dngc4yqbr/14.999', '1YAa0cODBQ7IIUYG4Tm0SPsGTTxs6Vq1gX6OPEE1aHho', '', ''],
                'G Bypass Mixed': ['city_Georgetown', 'dngce1ppv/14.999', '', '', ''],
                'G Cardinal': ['city_Georgetown', 'dngcs0epy/14.999', '', '1905', 'USA_GCardinal'],
                'G Cardinal (Flats)': ['city_Georgetown', 'dngcs0epy/14.999009', '', '', ''],
                'G CHampion Way': ['city_Georgetown', 'dngcknw6w/14.999', '1sX9jw3-LoovXR6OqWNl03qCPV-YXZCtjHT8J7damks0', '', ''],
                'G Evo Belt': ['city_Georgetown', 'dngc72cf6/14.999', '1qkOia7uQqWG7eLc9h5aROIBiOb5mV7v7yqEkRSWv7o8', '', ''],
                'G Gaming Table': ['city_Georgetown', 'dngckw4bb/14.999', '1AllrdEEz2uks6Vnh7Q5tt0ZthrxNZi_iACo7EL7hrkA', '', ''],
                'G Harmony': ['city_Georgetown', 'dngc5yuwh/14.999', '', '', ''],
                'G Harmony (Flats)': ['city_Georgetown', 'dngc5yuwh/14.999009', '12sc9F3P2wWD_kOh_focOhL1nZJFKmYBPArI0RmCH-_g', '', ''],
                'G Jewel Belt': ['city_Georgetown', 'dngc74908/14.999', '', '', ''],
                'G Morning': ['city_Georgetown', 'dngckp9qj/14.999', '1mMbwafIGb8VcCoH-_fIPJkR7X79yYXsTdl8dB8OJ6gs', '', ''],
                'G Pumpkin': ['city_Georgetown', 'dngce8yzz/14.999', '', '', ''], // [*]
                'G Pumpkin (Flats)': ['city_Georgetown', 'dngce8yzz/14.999009', '1nmIfJmtDZ9eTvOrdvrG0gS1Wvmqbd9rox5iAc2BCRW0', '', ''],
                'G Shamrock': ['city_Georgetown', 'dngckpu1t/14.999', '', '', ''],
                'G Shamrock (Flats)': ['city_Georgetown', 'dngckpu1t/14.999009', '1kOHvBUG-odmV77-dldLVfSrm9fIIkjtw1GRq0k_XciE', '', ''],
                'G Shifty Jewels 62 West': ['city_Georgetown', 'dngc70vt6/14.999', '15y_jeT6br47df19ok2qiQtDYCnvE6i-Ou2qBQ7xc_P0', '', ''],
                'G Southland': ['city_Georgetown', 'dngck0p7f/14.999', '17Ku7M9_dyNMiLC-tnstUp4RLoU7EtVdIo4E_expVn14', '', ''],
                'G Toyota': ['city_Georgetown', 'dngcs2y4b/14.999', '', '', ''],
                'G Toyota Crossbows': ['city_Georgetown', 'dngck5pff/14.999', '1L8PFohApybBqAm1omOYQZgrNjm4fq-wZ8fQfLnbMq98', '', ''],
                'G Toyota Crossbows Biggy': ['city_Georgetown', 'dngck1ncz/14.999', '1W2V8pBW9EuqEZm-utGkxyF3vqhq2QonajD2-2ew7y6I', '', ''],
                'G Toyota (Flats)': ['city_Georgetown', 'dngcs2y4b/14.999009', '1ufiZlfwEG2MsWcBMBHVu6fI3Jc38ktxJ--3bWqMy7OY', '', ''],
                'MiniPortal4': ['city_Georgetown', 'dngc7gdxv/14.999', '', '', ''],
                'Pot of Gold': ['city_Georgetown', 'dngckkwpb/14.999', '1XVE-7bFFrNj_qv-gkIJsBKefEGGvPqQTHnmVY8VY4rM', '', ''],
                'Reindeer in Kentucky': ['city_Georgetown', 'dngckqfgd/14.999', '', '', ''],
                'Witch`s Hat': ['city_Georgetown', 'dngc7uuuy/14.999', '1wkbDDiCS_nNucyISYSX9A2FgZHc1-dNogxLH0wr-aCs', '', '']
            },
            'Greenville': {
                'Buckeye`s Grad Cap': ['city_Greenville', 'dp5u4kbq4/14.999', '1IlP89mLDHFYeq5imuVkNdwICLvhMekfph5WZjQaBkAM', '', ''],
                'Greenville Clover Leaf': ['city_Greenville', 'dp5u4gsgr/14.999', '', '', ''],
                'Greenville Evolution Square': ['city_Greenville', 'dp5u3bp1f/14.999', '1ENPBe2iWqUbIFBQaN-kaDEnQElUV7eMpYe9Jt56jCDQ', '', ''],
                'Greenville Flamingo Feather': ['city_Greenville', 'dp5u6cvzq/14.999', '', '', ''],
                'Greenville Flat Surprise': ['city_Greenville', 'dp5u4p5bc/14.999', '1xLM0yOuVYNWWw_ChP3oDnT8mf4XQjQxj_qgGeJiNCEg', '', ''],
                'Greenville Green Wave': ['city_Greenville', 'dp5u47vck/14.999', '', '', ''],
                'Greenville Ohio Lightbulb': ['city_Greenville', 'dp5u4jdkx/14.999', '1DZajKWnzX7Gubom5NLxwaHIrCgWoLo0JggTPNLICXJc', '', ''],
                'Greenville Ohio Spirit Trophy': ['city_Greenville', 'dp5u4pntu/14.999', '1OqNIPovIvBBlaS0KtZStTMkaesEEQCXnC69MfpMXoNQ', '', ''],
                'Greenville RUM Circle': ['city_Greenville', 'dp5u45yhh/14.999', '1SkQTcWzNLVGc0BGJaGbcQvn86l2E3Mkwcpjos0p139c', '', ''],
                'Greenville South Carolina': ['city_Greenville', 'dp5u60nmr/14.999', '1tBYYWU4hcmSCEo_jddPr85hmpjJrtvh9_nsKBmdJaG4', '', ''],
                'Greenville Zodiac Wheels': ['city_Greenville', 'dp5u4ruez/14.999', '', '', ''],
                'Greenville`s Amethyst Road': ['city_Greenville', 'dp5u4wnun/14.999', '', '', ''],
                'Jaysville Flat Circles': ['city_Greenville', 'dp5u6betv/14.999', '1OxMrmq1d-knvO0tdyGBpqsLDQr7PFcomG60mBH68Rjk', '', ''],
                'Rob Hearts Lou': ['city_Greenville', 'dp5u1zx1e/14.999', '', '2107', 'USA_RobHeartsLou'],
                'Saint Mary`s Heart': ['city_Greenville', 'dp5u68q9p/14.999', '', '', ''],
                'Taylor Swift - The Eras': ['city_Greenville', 'dp5gfxzt7/14.999', '1fX4tp1PjGgu5UZa10wn4cmPKX-WzhxbslerpBpGrJgU', '', '']
            },
            'Kansas City': {
                'Black Cat': ['city_KansasCity', '9yuwp8m1z/14.999', '', '', ''],
                'Jacob L Loose Park': ['city_KansasCity', '9yuwp3nk2/14.999', '', '', ''],
                'Kansas City Panda': ['city_KansasCity', '9yuvbucpq/14.999', '1cBRYXhTdBsqTB83TN6Vxfhm40pqkYUaabbjxGlEVJDo', '', ''],
                'Kauffman Legacy Park Quilt': ['city_KansasCity', '9yuwpfuxt/14.999', '', '', ''],
                'KC American Flag': ['city_KansasCity', '9yutzgzxn/14.999', '', '', ''],
                'KC Egyptian Zodiac (Expanded)': ['city_KansasCity', '9yuwpc9wb/14.999', '', '', ''],
                'KC Night Lights #1': ['city_KansasCity', '9yuwp35ek/14.999', '', '', ''],
                'KC Night Lights #3': ['city_KansasCity', '9yutzxumv/14.999', '', '', ''],
                'KC Night Lights #5': ['city_KansasCity', '9yuvbt02e/14.999', '', '', ''],
                'KC Shield': ['city_KansasCity', '9yuwr9rt5/14.999', '12Sg4ikZdcF0ej4u4MTnx_L496oyk9RG5qXl7OWFuRR8', '', ''],
                'Picasso Rob': ['city_KansasCity', '9yuwpepc9/14.999', '', '', ''], // [*]
                'Research Hospital': ['city_KansasCity', '9yuvbm846/14.999', '', '', '']
            },
            'Kirkwood': {
                'Kirkwood Anchor': ['city_Kirkwood', '9yzerj220/14.999', '', '', ''],
                'Kirkwood, Evolutions - 1': ['city_Kirkwood', '9yzeqxeqn/14.999', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=0&range=A1', '', ''], // [*]
                'Kirkwood, Evolutions - 2': ['city_Kirkwood', '9yzew8ewz/14.999', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=707330650&range=A1', '', ''],
                'Kirkwood, Evolutions - 3': ['city_Kirkwood', '9yzew83ct/14.999', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=276667766&range=A1', '', ''],
                'Kirkwood, Evolutions - 4': ['city_Kirkwood', '9yzew3ppm/14.999', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=842989634&range=A1', '', ''],
                'Kirkwood, Evolutions - 5': ['city_Kirkwood', '9yzewbe6d/14.999', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=1278849387&range=A1', '', ''],
                'Kirkwood, Evolutions - 6': ['city_Kirkwood', '9yzew8k2u/14.999', '', '', ''],
                'Kirkwood, Evolutions - 7': ['city_Kirkwood', '9yzew9k4j/14.999', '1XiDQnpDZ-sViUsMVnEb2cZj5sM9ySEdfogNlEYCjwlE/edit#gid=1456234098&range=A1', '', ''],
                'White Castle Valentine': ['city_Kirkwood', '9yzeqgbyc/14.999', '', '', '']
            },
            'Lakeland': {
                'Corgi': ['city_Lakeland', 'dhvxycns2/14.999', '', '2207', 'USA_Corgi'], // GOTM, Lakeland
                'Lakeland Candy Corn': ['city_Lakeland', 'dhvxyb7r1/14.999', '', '', ''], // completed
                'Lakeland, FL Honeycomb': ['city_Lakeland', 'dhvxrn9jn/14.999', '1U7B_lFvSelY8_10rthYewsiXHZS4MuZttq-M5GNQWtI', '', '']
            },
            'Marion': {
                '80`s Cube': ['city_Marion', '9zqz5kqsw/14.999', '', '', ''],
                'Marion': ['city_Marion', '9zqz5cxxw/14.999', '', '', ''],
                'Marion 4 Leaf Clover': ['city_Marion', '9zqz5c5fx/14.999', '', '', ''],
                'O` Christmas Tree': ['city_Marion', '9zqz5dsj1/14.999', '', '2112', 'USA_OChristmasTree'], // [*]
                'Popcorn': ['city_Marion', '9zqz553b0/14.999', '151TcN_THK90rRR_qCXBDDTIVRc_3wvJX95V3t4bdkXk', '', ''],
                'Thomas Park Flats': ['city_Marion', '9zqz57639/14.999', '', '', '']
            },
            'McKinney': {
                'F-Bomb - McKinney': ['city_McKinney', '9vghxt5yq/14.999', '', '', ''],
                'MHQ Bash4 Casino': ['city_McKinney', '9vgm17mhu/14.999', '', '', ''],
                'MHQ V4 Pin': ['city_McKinney', '9vgkbvept/14.999', '', '', ''],
                'Michael Myers Halloween': ['city_McKinney', '9vghzj03h/14.999', '1FxjwGUuKym6YcNTesdoRq1-Y-fbUQJpM9RGi9E-Q7XM', '', ''],
                'Munzee Logo History': ['city_McKinney', '9vgkbt4m4/14.999', '', '', ''],
                'Pirates Flag': ['city_McKinney', '9vgkbbfrx/14.999', '', '', ''],
                'Rover Pin': ['city_McKinney', '9vgk91cyc/14.999', '1osdfjUjcA7LaD6cVHs_qhQmQLqFCp6RpskyLIZxE32I', '', ''],
                'Teenage Mutant Ninja Turtles': ['city_McKinney', '9vghxwwmw/14.999', '1QU5oe70bZw-FomLhZsOrNHerQVlQYWwUm5Xrkho259o', '', ''], // [*]
                'Zee Knight': ['city_McKinney', '9vgk3n3mg/14.999', '1BfXO5xZ_peEyc9J-5LIzklvo3ox0EJXO9jepz4sTuI8', '', ''],
                'Zelda': ['city_McKinney', '9vgk9ry7y/14.999', '1emGCfTxs-08ejJDND2YtczK5DCjDr7EAUTiY8rtFl2I', '', '']
            },
            'Minneapolis': {
                'Eagles v. Patriots': ['city_Minneapolis', '9zvxy0jfp/14.999', '', '', ''],
                'Hiawatha Crossbows': ['city_Minneapolis', '9zvxwmgw4/14.999', '', '', ''],
                'Jack-O & ZEEacula': ['city_Minneapolis', '9zvxx1c0y/14.999', '', '', ''],
                'Lakewood Prizewheel': ['city_Minneapolis', '9zvxsgvmr/14.999', '17xRj9aYg5D6cKwyocOwZX09Z8CYP5jwXqgXvbbYoLXg', '', ''],
                'Minnesota': ['city_Minneapolis', '9zvxqwvpp/14.999', '', '', ''],
                'Minnesota Moose': ['city_Minneapolis', '9zvxqxry4/14.999', '', '', ''],
                'NE One Alien?': ['city_Minneapolis', 'cbj8nmyg8/14.999', '1g2bmVnx42Os9gct3dNZWWXFX1sD0LIDXS059WcE_B6c', '', ''],
                'St. Mary`s Battleground Weapon': ['city_Minneapolis', '9zvxtcg21/14.999', '', '', ''],
                'Super Bowl LII': ['city_Minneapolis', '9zvxy0n58/14.999', '', '', ''], // [*]
                'Witch Hat': ['city_Minneapolis', '9zvxyf7hg/14.999', '', '', '']
            },
            'Montgomery': {
                'Caretta Sea Turtle': ['city_Montgomery', 'djf8m22fr/14.999', '', '', ''],
                'Color the zoo': ['city_Montgomery', 'djf8kvc9m/14.999', '1_URJCQ6efxulNSwZiXHFVlPWZhMYgb9jl7q_EMSsNKc', '', ''],
                'Green SpyFrog': ['city_Montgomery', 'djf8je247/14.999', '', '', ''],
                'Hank`s Boots': ['city_Montgomery', 'djf8hr6up/14.999', '1zUG6-mHwovUCUDBKb4XlCzi_Rdscuu-z6gRjSaeCxkE', '', ''],
                'Mama T`s ladybug': ['city_Montgomery', 'djf8nx300/14.999', '', '', ''],
                'Montgomery baseball': ['city_Montgomery', 'djf8hp7k0/14.999', '', '', ''],
                'Montgomery baseball (Flats)': ['city_Montgomery', 'djf8hp7k0/14.999009', '1zWLEIVL9XaaMNzSyWlMErhCmldS5UN3kbWsSYqVWoYA/edit#gid=694393706&range=A1', '', ''],
                'Montgomery Chili Pepper': ['city_Montgomery', 'djf8jkbv0/14.999', '1-CT-Zi3_NXCUHSvnA2fUOBCcJqcDKSPcmrlqcYp204c', '', ''],
                'The Lucky Fungi': ['city_Montgomery', 'djf8kbee5/14.999', '', '', '']
            },
            'O`Fallon': {
                'Bowlero Laser Tag': ['city_OFallon', '9yzs8z8k3/14.999', '', '', ''],
                'Breakfast Time!': ['city_OFallon', '9yzs200er/14.999', '1tT0FZFseBSvSQhNPQHBTmB4TXqyXFiIXynDI2r1D6OA', '', ''],
                'Gentle Doctor Animals': ['city_OFallon', '9yzs2p2g6/14.999', '', '', ''],
                'O`Fallon Soccer': ['city_OFallon', '9yzs2hm65/14.999', '', '', ''],
                'Ring': ['city_OFallon', '9yzkxz5qh/14.999', '', '', ''],
                'St. Louis Cardinals O`Fallon': ['city_OFallon', '9yzs8x3g8/14.999', '', '', ''],
                'St. Peters Chess': ['city_OFallon', '9yzs9p60c/14.999', '', '', ''],
                'Thank you Truckers!': ['city_OFallon', '9yzkxr91v/14.999', '', '', ''],
                'Walkie Talkie Watch': ['city_OFallon', '9yzs8td5m/14.999', '', '', ''], // [*]
                'Z Briefcase': ['city_OFallon', '9yzs8jtyc/14.999', '', '', ''],
                'ZeeOps': ['city_OFallon', '9yzs8pe34/14.999', '', '', ''],
                'ZeeSpy Hat': ['city_OFallon', '9yzs8r9db/14.999', '', '', '']
            },
            'Orlando': {
                'Airport Lakes Park': ['city_Orlando', 'djn1vt5d5/14.999', '1AM3e8pQ-XPh_w7WqenZK9xIKsCSktFo3sKTZs1D9tYY', '', ''],
                'B52': ['city_Orlando', 'djn1vhq1m/14.999', '', '', ''],
                'Cresting Wave at Sunset': ['city_Orlando', 'djn1qk695/14.999', '', '', ''],
                'Crossbow, Orlando': ['city_Orlando', 'djn1vtf6d/14.999', '', '', ''],
                'Crossbow Shield': ['city_Orlando', 'djn4kj9j2/14.999', '', '', ''],
                'Crossbow Shield (Flats)': ['city_Orlando', 'djn4kj9j2/14.999009', '', '', ''],
                'Lake Nona Cowbell': ['city_Orlando', 'djn1rhdwf/14.999', '', '', ''],
                'Lake Nona Longhorn': ['city_Orlando', 'djn1qu4p9/14.999', '', '', ''], // [*]
                'Nona SirPrizewheel': ['city_Orlando', 'djn1qsg15/14.999', '', '', ''],
                'Pikachu Lake Eola': ['city_Orlando', 'djn4khqqz/14.999', '', '', ''],
                'Pokeball Lake Eola': ['city_Orlando', 'djn4khrxq/14.999', '', '', ''],
                'Stained Glass House': ['city_Orlando', 'djn1qvwhs/14.999', '1oYew6Zp0pxU2-oqB2N_iZYAZ7KniOOtwccXktkh_VSY', '', '']
            },
            'Owensboro': {
                'Crossed Arrows Owensboro': ['city_Owensboro', 'dndnc6w0p/14.999', '16TvtDToPVIkgs_UD7F1xk-PRwyPhkmE7m9y-Wcgrwz8', '', ''], // [*]
                'Owensboro Riverboat': ['city_Owensboro', 'dndncu1bx/14.999', '1rOi0cu_ORxL65jAbSmHI_1VVk_LY_S3AmvNjuOtFaSI', '', ''],
                'Owensboro Riverboat (Flats)': ['city_Owensboro', 'dndncu1bx/14.999009', '1O9KwjRx7Fp5yBAMzEXFVkgsxXsQe_jtA4zXwmHOnkXA', '', '']
            },
            'PlantCity': {
                'Gumball Machine': ['city_PlantCity', 'dhvx4dbwu/14.999', '', '', ''], // completed
                'Sprinkle Cupcake': ['city_PlantCity', 'dhvx46v6v/14.999', '', '', 'USA_SprinkleCupcake'] // completed
            },
            'Prattville': {
                'Prattville Pansy': ['city_Prattville', 'djf88xhm3/14.999', '15Tp1VCvE12hCnT0GEUIHj3njAyizKD47kWn5Ch7RU7A', '', ''], // empty
                'Prattville Trillium': ['city_Prattville', 'djf8bbhmk/14.999', '1tmd3qEP_424x_NqrkGLLYaSchvRYNTZcPh7voIf0ZSI', '', ''], // empty
            },
            'Saint Charles': {
                'Acorn Mini': ['city_SaintCharles', '9yzse6tf8/14.999', '', '', ''],
                'Apple Mini': ['city_SaintCharles', '9yzse4pep/14.999', '', '', ''],
                'Autumn Moon': ['city_SaintCharles', '9yzserg07/14.999', '', '', ''],
                'Autumn Tree': ['city_SaintCharles', '9yzse63z5/14.999', '', '', ''],
                'Christmas Sleigh': ['city_SaintCharles', '9yzss9srx/14.999', '', '', ''],
                'Chuck E Cheese Pizza': ['city_SaintCharles', '9yzss5rpx/14.999', '', '', ''],
                'Flat Dog Bone': ['city_SaintCharles', '9yzser03w/14.999', '', '', ''],
                'Flat Friends': ['city_SaintCharles', '9yzse5st1/14.999', '', '', ''],
                'Flat Object Annex': ['city_SaintCharles', '9yzse5epk/14.999', '143ygYtqFYivC4xewkqsiU5VEp5NX8BcQ7DQgMRDxuxI', '', ''],
                'Fox Hill Fit': ['city_SaintCharles', '9yzsuf5pu/14.999', '1W9i6GBq0KmDd--2rFH9o2r_uNoyCtMMg77tg7QyzkUQ', '', ''],
                'Gift of Life': ['city_SaintCharles', '9yzseje93/14.999', '', '', ''],
                'Halloween': ['city_SaintCharles', '9yzsg8k4g/14.999', '', '', ''],
                'Heart of St. Charles': ['city_SaintCharles', '9yzsscd8m/14.999', '', '', ''],
                'Log Cabin Quilt': ['city_SaintCharles', '9yzssgw8q/14.999', '', '', ''],
                'Mothers Day Flower Pot': ['city_SaintCharles', '9yzsetr9v/14.999', '', '', ''],
                'nyisutter bday': ['city_SaintCharles', '9yzsemrcz/14.999', '', '', ''],
                'Pi Day Pie': ['city_SaintCharles', '9yzssh333/14.999', '', '', ''],
                'Pirate Axe': ['city_SaintCharles', '9yzssnpud/14.999', '', '', ''],
                'Pirate Crossbow': ['city_SaintCharles', '9yzsu639f/14.999', '', '', ''],
                'Pirate Hammer': ['city_SaintCharles', '9yzseyjy6/14.999', '1bINIVmmlredD41Go-9tz4RkLoPbcOe191IxZcwPeuzI', '', ''],
                'Pirate Longsword': ['city_SaintCharles', '9yzsu2d5k/14.999', '', '', ''],
                'Pirate`s Cannon': ['city_SaintCharles', '9yzsu8ku4/14.999', '', '', ''],
                'Pirate`s Rum': ['city_SaintCharles', '9yzssr8dc/14.999', '', '', ''],
                'Rosesquirrel': ['city_SaintCharles', '9yzse7m02/14.999', '', '', ''],
                'Rosesquirrel`s Autism Puzzle Piece': ['city_SaintCharles', '9yzse5kyt/14.999', '', '', ''],
                'Rum Border': ['city_SaintCharles', '9yzssr8dc/14.9991', '1EHZt81jClIKFvM21IIey4TeD6t93MGBwu7mRkU1ye7s', '', ''],
                'Schaefer Park Bugs': ['city_SaintCharles', '9yzs7qfvt/14.999', '', '', ''],
                'St. Charles Anchor': ['city_SaintCharles', '9yzsss1ws/14.999', '', '', ''],
                'St. Louis Parrot': ['city_SaintCharles', '9yzssztbj/14.999', '', '', ''],
                'STL Pirate Ship': ['city_SaintCharles', '9yzssvpyq/14.999', '1YSzpO21Qd95-1ErmJ4zMiih_qQdwTcFsoAxN2_uyiws', '', ''], // [*]
                'Walpelhorst Horse': ['city_SaintCharles', '9yzse9910/14.999', '', '', ''],
                'Warrior Spear': ['city_SaintCharles', '9yzssp84g/14.999', '', '', '']
            },
            'Saint Louis': {
                'Bevo Mill': ['city_SaintLouis', '9yzg3zu2y/14.999', '', '', ''],
                'Blues Munzee': ['city_SaintLouis', '9yzgd9yne/14.999', '1CUmomkr2rPp3ZCij_Sup2fKbAAcZd5wlWf013qIvupM', '', ''], // [*]
                'Candy Cane Lane': ['city_SaintLouis', '9yzg90fud/14.999', '', '', ''],
                'Cardinals': ['city_SaintLouis', '9yzgewdcn/14.999', '', '', ''],
                'Cornucopia': ['city_SaintLouis', '9yzg9um8k/14.999', '', '', ''],
                'Get Well': ['city_SaintLouis', '9yzgf1b6z/14.999', '1wnKEAUFPm_xwiiy4zguvpTg8-ZLz4xdFc3jIf_dzSGA', '', ''],
                'Ikea chair': ['city_SaintLouis', '9yzgf3q0f/14.999', '', '', ''],
                'Munzee 11': ['city_SaintLouis', '9yzg8bwjs/14.999', '', '', ''],
                'Pieces Meeple': ['city_SaintLouis', '9yzgekym8/14.999', '', '', ''],
                'Pizza on the Hill': ['city_SaintLouis', '9yzg9wjq0/14.999', '', '', ''],
                'Shaw`s Garden Rose': ['city_SaintLouis', '9yzgdjbu1/14.999', '', '', ''],
                'St. Louis Cardinals Part 2': ['city_SaintLouis', '9yzgew5sq/14.999', '1-h2fgEIqwtsMEeAgJvv21idGfB4Wr9XR7jUfNfyGGk0', '', ''],
                'STLPokeball': ['city_SaintLouis', '9yzg3ukw5/14.999', '1Z5_NyDJk9nwrT-duWpS5AExm2xg49xfiD6zxKnHDq2Q', '', ''],
                'STLTardis': ['city_SaintLouis', '9yzg3wnjp/14.999', '1UD2jwq1xv8af0QOoBuxUjNv666tzUY9rVn7edZO20kY', '', ''],
                'Sybergs Shark': ['city_SaintLouis', '9yzg3hn9j/14.999', '', '', ''],
                'Tower Grove Park': ['city_SaintLouis', '9yzgd7v6g/14.999', '', '', ''],
                'Turtle Park': ['city_SaintLouis', '9yzgc2dz5/14.999', '', '', ''],
                'WYMM': ['city_SaintLouis', '9yzgdhpf0/14.999', '', '', '']
            },
            'Saint Paul': {
                'Birthday Clown': ['city_SaintPaul', '9zvz80ycg/14.999', '', '', ''], // [*]
                'Como Evo Flowers': ['city_SaintPaul', '9zvzb5fqd/14.999', '', '', ''],
                'Como Park Shamrock': ['city_SaintPaul', '9zvzb7crp/14.999', '1Cf-nXNodpSRRVbCSQFTjv4JDJAi3UDkw7De9aJtEZ-E', '', ''],
                'Heart Crossbows': ['city_SaintPaul', '9zvxxuuu3/14.999', '', '', ''],
                'LRT EVO Train': ['city_SaintPaul', '9zvz8rvx1/14.999', '', '', ''],
                'LRT Snowflake': ['city_SaintPaul', '9zvxz44h1/14.999', '', '', ''],
                'St. Paul Shamrock': ['city_SaintPaul', '9zvz9m4w8/14.999', '', '', ''],
                'XII Birthday Fish Garden Hedge': ['city_SaintPaul', '9zvxzc3wj/14.999', '', '', '']
            },
            'Saint Peters': {
                'Blossom Mini': ['city_SaintPeters', '9yzsdfxk2/14.999', '', '', ''],
                'Campfire': ['city_SaintPeters', '9yzsg564x/14.999', '', '', ''],
                'Camping at the Lake': ['city_SaintPeters', '9yzsfgngt/14.999', '', '', ''],
                'Cherry Mini': ['city_SaintPeters', '9yzse56kh/14.999', '', '', ''],
                'Color, St. Peters': ['city_SaintPeters', '9yzsd7947/14.999', '', '', ''],
                'Daisy Chain': ['city_SaintPeters', '9yzsdqwqc/14.999', '', '', ''],
                'Golden Carrot Rabbit': ['city_SaintPeters', '9yzse0729/14.999', '', '', ''],
                'Happy Kraut Memorial': ['city_SaintPeters', '9yzs3t7ge/14.999', '', '', ''],
                'Heavy Smoke BBQ': ['city_SaintPeters', '9yzsdz07k/14.999', '', '', ''],
                'Jimmy Beagle': ['city_SaintPeters', '9yzs9xw9j/14.999', '', '', ''],
                'March Mini': ['city_SaintPeters', '9yzse4fsu/14.999', '', '', ''],
                'Mini Snowflake 2': ['city_SaintPeters', '9yzsdf25h/14.999', '', '', ''],
                'Mother`s Day Basket': ['city_SaintPeters', '9yzsdnv17/14.999', '', '', ''], // [*]
                'Nob Hill Fish Tank': ['city_SaintPeters', '9yzsdg9sm/14.999', '', '', ''],
                'Pecan Mini': ['city_SaintPeters', '9yzsdfrjc/14.999', '', '', ''],
                'Pi Day 2023': ['city_SaintPeters', '9yzsdfu0q/14.999', '', '', ''],
                'Shamrock`s Mug': ['city_SaintPeters', '9yzs9t776/14.999', '', '', ''],
                'Snowflake': ['city_SaintPeters', '9yzsdf8e1/14.999', '', '', ''],
                'Snowman - Saint Peters': ['city_SaintPeters', '9yzsdcgz9/14.999', '', '', ''],
                'Spring Cherry Blossom': ['city_SaintPeters', '9yzse53wq/14.999', '', '', ''],
                'Spring Tree': ['city_SaintPeters', '9yzse4bfp/14.999', '', '', ''],
                'St. Louis Christmas Stocking': ['city_SaintPeters', '9yzs9zjbq/14.999', '', '', ''],
                'St. Peters NVG': ['city_SaintPeters', '9yzs8v6bn/14.999', '', '', ''],
                'StL Flat Rob': ['city_SaintPeters', '9yzsdvgr3/14.999', '1OinWpDJIDhBDBCD_0cE2C-4g3VjiTfl4scc6VFY6qaA/edit#gid=1191342418&range=A1', '', ''],
                'StL Flat Rob (Flats)': ['city_SaintPeters', '9yzsdvgr3/14.999009', '', '', ''],
                'Summer Sun': ['city_SaintPeters', '9yzsdcnv1/14.999', '', '', ''],
                'Summer Tree': ['city_SaintPeters', '9yzsdc5rv/14.999', '', '', ''],
                'Vanderbilt Puppy': ['city_SaintPeters', '9yzsdjm1y/14.999', '', '', ''],
                'Winter Cardinal Feather': ['city_SaintPeters', '9yzsdcxnq/14.999', '', '', ''],
                'Winter Dead Branch': ['city_SaintPeters', '9yzsdc906/14.999', '', '', ''],
                'Winter Tree': ['city_SaintPeters', '9yzsdf0b7/14.999', '', '', '']
            },
            'Savage': {
                'Burger': ['city_Savage', '9zvwdxwy6/14.999', '', '', ''],
                'Pizza': ['city_Savage', '9zvwf8p7n/14.999', '', '', ''],
                'Snoopy': ['city_Savage', '9zvwdyxm6/14.999', '', '', ''], // [*]
                'Stormtrooper, Savage': ['city_Savage', '9zvwdyw64/14.999', '', '', ''],
                'SuperChucker Shield': ['city_Savage', '9zvwdtx7f/14.999', '', '', '']
            },
            'Watertown': {
                'Bowling Bash': ['city_Watertown', '9zfzsg1dq/14.999', '', '', ''],
                'Catapult Pit': ['city_Watertown', '9zfzqxujb/14.999', '', '', ''],
                'Crossbow': ['city_Watertown', '9zfzt6nct/14.999', '1hcloNWsU1z-mb80ARbm4mq1i-vpDUL1MXzu8rgAcYrg', '', ''],
                'Watertown Shammy': ['city_Watertown', '9zfzw2yck/14.999', '', '', ''] // [*]
            },
            'Weatherford': {
                'Avocato': ['city_Weatherford', '9vf6qbc6f/14.999', '1ksqeWGKy4yylwzUEjErfq05dCbs-ghMaJ296eJrGtI4', '', ''],
                'Baby Groot!': ['city_Weatherford', '9vf6qxdkf/14.999', '', '', ''], // [*]
                'Bundtini Trail': ['city_Weatherford', '9vf6q2m4e/14.999', '', '', ''],
                'Dropping the f-bomb on this blasted virus': ['city_Weatherford', '9vf6nvgj6/14.999', '', '', ''],
                'Egyptian Cat': ['city_Weatherford', '9vf6qtn7g/14.999', '', '2204', 'USA_EgyptianCat'],
                'Ellis Creek Owl': ['city_Weatherford', '9vf6wcht4/14.999', '', '', ''],
                'Ellis Creek Owl (Flats)': ['city_Weatherford', '9vf6wcht4/14.999009', '1Vw34xTOP8v3fQuWM2NaXecX-7wEMcGUsfLqjatjDHnM', '', ''],
                'Garden Girl': ['city_Weatherford', '9vf6wcgyj/14.999', '', '', ''],
                'Hey Cup Cake!': ['city_Weatherford', '9vf6qdvv2/14.999', '', '', ''],
                'Jewel of a Heart': ['city_Weatherford', '9vf6q7snp/14.999', '', '', ''],
                'Lets Talk A-bundt Love': ['city_Weatherford', '9vf6q88ed/14.999', '', '', ''],
                'Marshall Mallard!': ['city_Weatherford', '9vf6qwe4e/14.999', '', '', ''],
                'Pumpkin Spice Owl': ['city_Weatherford', '9vf6ppgy2/14.999', '', '', ''],
                'Pumpkin Spice Owl (Flats)': ['city_Weatherford', '9vf6ppgy2/14.999009', '', '', ''],
                'Tied up in Knotz in Weatherford...Ireland?': ['city_Weatherford', '9vf6npmgv/14.999', '1zuJL1OfsnYgzGr8CS3Cck2SQDetTwnViCLcZP3kcpIs', '', ''],
                'Uncut Diamond': ['city_Weatherford', '9vf6wbvcj/14.999', '', '', ''],
                'Uncut Diamond (Flats)': ['city_Weatherford', '9vf6wbvcj/14.999009', '', '', ''],
                'Weatherford Emerald Square': ['city_Weatherford', '9vf6q4zrb/14.999', '', '', ''],
                'Weatherford St. Patrick`s Owl': ['city_Weatherford', '9vf6q0md5/14.999', '', '', ''],
                'Weatherford Xmas Owl': ['city_Weatherford', '9vf6qfj00/14.999', '', '', '']
            },
            'WebsterGroves': {
                'Frisco Train': ['city_WebsterGroves', '9yzerz82b/14.999', '', '', ''], // [*]
                'Pi Day 2022': ['city_WebsterGroves', '9yzerqq4b/14.999', '', '', ''],
                'Swon': ['city_WebsterGroves', '9yzexbq14/14.999', '', '', ''],
                'Webster Groves Statesmen': ['city_WebsterGroves', '9yzg80e80/14.999', '', '', '']
            }
        }
    },
    'by owner': { /* all 15.000x; other 15.001x */
        '123xilef': {
            'all': {
                'Berlin - Capital of spies': ['123xilef_all', 'u33de1r9d/15.000', '', '2009', 'Germany_Berlin-CapitalOfSpies'], // [*]
                'Berlin - High Voltage': ['123xilef_all', 'u336ws3eq/15.000', '', '', ''],
                'Berlin Bat - Berliner Fledermaus': ['123xilef_all', 'u336vvjuz/15.000', '', '2010', 'Germany_BerlinBat-BerlinerFledermaus'],
                'Berlin - BYOG 2020': ['123xilef_all', 'u337njw0q/15.000', '', '', ''],
                'Berlin Cards Pin': ['123xilef_all', 'u336z2hgg/15.000', '', '', ''],
                'Berlin Void & Maple Chess': ['123xilef_all', 'u336tzs18/15.000', '1I7JZXb1MN4sA5S3JFYAxTWDxeVDMXSuyJ7GHWytYmp0', '', ''],
                'Colours of Berlin': ['123xilef_all', 'u336z06cn/15.000', '', '', ''],
                'Wittenauer MischMasch': ['123xilef_all', 'u337pnnqb/15.000', '1TvCn4zYgpMXHKv4K0PBnjMa76NePegF4jjTB_cvGfwM', '', '']
            },
            'GOTM': {
                'Berlin - Capital of spies': ['123xilef_GOTM', 'u33de1r9d/15.001', '', '2009', 'Germany_Berlin-CapitalOfSpies'],
                'Berlin Bat - Berliner Fledermaus': ['123xilef_GOTM', 'u336vvjuz/15.001', '', '2010', 'Germany_BerlinBat-BerlinerFledermaus'] // [*]
            },
            'completed': {
                'Berlin - High Voltage': ['123xilef_completed', 'u336ws3eq/15.001', '', '', ''],
                'Berlin - BYOG 2020': ['123xilef_completed', 'u337njw0q/15.001', '', '', ''],
                'Berlin Cards Pin': ['123xilef_completed', 'u336z2hgg/15.001', '', '', ''],
                'Colours of Berlin': ['123xilef_completed', 'u336z06cn/15.001', '', '', ''] // [*]
            },
            'empty': {
                'Berlin Void & Maple Chess': ['123xilef_empty', 'u336tzs18/15.001', '1I7JZXb1MN4sA5S3JFYAxTWDxeVDMXSuyJ7GHWytYmp0', '', ''], // [*]
                'Wittenauer MischMasch': ['123xilef_empty', 'u337pnnqb/15.001', '1TvCn4zYgpMXHKv4K0PBnjMa76NePegF4jjTB_cvGfwM', '', '']
            }
        },
        '321Cap': {
            'all': {
                'Howick Beach Boat': ['321Cap_all', 'rckqhgfu4/15.000', '117tNzujMC6Rhnd88argwafssHWuo_jq3lYwAv1UVJ74', '', ''],
                'Howick Jewel Art #1': ['321Cap_all', 'rckqh6yb4/15.000', '', '', ''],
                'Howick Jewel Art #1 (Flats)': ['321Cap_all', 'rckqh6yb4/15.000009', '1lugsFfQJ09pV26JwYPeWQ0V3QUXQBc2rwh7EzND2R4s/edit#gid=1511359877&range=B1:K1', '', ''],
                'Howick Jewel Art #2': ['321Cap_all', 'rckqh6qzf/15.000', '', '', ''],
                'Howick Munzee Triangle': ['321Cap_all', 'rckqhu88r/15.000', '1OClN5OWqvsJssXZoqODDyWhP82roa4q38c4EvPfjCH4', '', ''],
                'Howick Night Vision Goggle Square': ['321Cap_all', 'rckqh4pxn/15.000', '', '', ''],
                'Howick Pine Tree': ['321Cap_all', 'rckqhd3yz/15.000', '1MUqJQFtsFUdwlhOV9hhbAs9shylMivReUGkBaGPItPw', '', ''],
                'Remuera / SH1 Munzee Art': ['321Cap_all', 'rckq1mp5r/15.000', '', '', ''],
                'Howick RUM Patch': ['321Cap_all', 'rckqhevs6/15.000', '1SATC7p0SEzwL-KsTW15Dub3YTUUSY3CMLGXnMj0N7eE', '', ''],
                'Lloyd Elsmore Evolutions': ['321Cap_all', 'rckq5cw4n/15.000', '17v6TlhvZaBt2O0bQ5jBcCapzUWf-K_0_fY81Vmdj2VM', '', ''],
                'Lloyd Elsmore Jewels': ['321Cap_all', 'rckq5fpze/15.000', '1yUdQbvXSFie3wK2eCobQcDWOWi34OTSWOTzOiY_ykxk', '', ''],
                'Musick Point Golf Tee': ['321Cap_all', 'rckq7fpwv/15.000', '12IhFKlHL0ato5b0L9k31E_HXXnb2mkMSylB5UHA-yTc', '', ''],
                'Newmarket Bowling': ['321Cap_all', 'rckq307y5/15.000', '1pA6MpRK-2E0uFY6EYbwAvugzh7To63QHHtXG7F5Y85k', '', ''] // [*]
            },
            'completed': {
                'Howick Jewel Art #1': ['321Cap_completed', 'rckqh6yb4/15.001', '', '', ''],
                'Howick Jewel Art #2': ['321Cap_completed', 'rckqh6qzf/15.001', '', '', ''],
                'Howick Night Vision Goggle Square': ['321Cap_completed', 'rckqh4pxn/15.001', '', '', ''],
                'Remuera / SH1 Munzee Art': ['321Cap_completed', 'rckq1mp5r/15.001', '', '', ''] // [*]
            },
            'empty': {
                'Howick Beach Boat': ['321Cap_empty', 'rckqhgfu4/15.001', '117tNzujMC6Rhnd88argwafssHWuo_jq3lYwAv1UVJ74', '', ''], // [*]
                'Howick Jewel Art #1 (Flats)': ['321Cap_empty', 'rckqh6yb4/15.001009', '1lugsFfQJ09pV26JwYPeWQ0V3QUXQBc2rwh7EzND2R4s/edit#gid=1511359877&range=B1:K1', '', ''],
                'Howick Munzee Triangle': ['321Cap_empty', 'rckqhu88r/15.001', '1OClN5OWqvsJssXZoqODDyWhP82roa4q38c4EvPfjCH4', '', ''],
                'Howick Pine Tree': ['321Cap_empty', 'rckqhd3yz/15.001', '1MUqJQFtsFUdwlhOV9hhbAs9shylMivReUGkBaGPItPw', '', ''],
                'Howick RUM Patch': ['321Cap_empty', 'rckqhevs6/15.001', '1SATC7p0SEzwL-KsTW15Dub3YTUUSY3CMLGXnMj0N7eE', '', ''],
                'Lloyd Elsmore Evolutions': ['321Cap_empty', 'rckq5cw4n/15.001', '17v6TlhvZaBt2O0bQ5jBcCapzUWf-K_0_fY81Vmdj2VM', '', ''],
                'Lloyd Elsmore Jewels': ['321Cap_empty', 'rckq5fpze/15.001', '1yUdQbvXSFie3wK2eCobQcDWOWi34OTSWOTzOiY_ykxk', '', ''],
                'Musick Point Golf Tee': ['321Cap_empty', 'rckq7fpwv/15.001', '12IhFKlHL0ato5b0L9k31E_HXXnb2mkMSylB5UHA-yTc', '', ''],
                'Newmarket Bowling': ['321Cap_empty', 'rckq307y5/15.001', '1pA6MpRK-2E0uFY6EYbwAvugzh7To63QHHtXG7F5Y85k', '', '']
            }
        },
        'Balazs80': {
            'completed': {
                'Audi': ['Balazs80_completed', 'u2kx32e7c/15.0011', '', '', ''],
                'MH felirat': ['Balazs80_completed', 'u2mw4g06j/15.0011', '', '', ''],
                'Mini': ['Balazs80_completed', 'u2jqxx3r0/15.0011', '', '', ''],
                'Rijeka Gift - 2023 Christmas': ['Balazs80_completed', 'u243bez8s/15.0011', '', '', ''] // [*]
            }
        },
        'Bambusznad': {
            'completed': {
                'Snoopy in Budapest': ['Bambusznad_completed', 'u2mtdj0e2/15.001', '', '', ''], // Hungary
                'Swans by the Danube': ['Bambusznad_completed', 'u2mtdufs5/15.001', '', '', ''] // Hungary
            }
        },
        'Belugue': {
            'all': {
                'Honey Bee': ['Belugue_all', 'u15p7dytj/15.000', '', '2305', 'Netherlands_HoneyBee'],
                'Honeycombs Schiedam': ['Belugue_all', 'u15p7fguu/15.000', '', '', ''],
                'Honeycombs-2 Schiedam': ['Belugue_all', 'u15p7g567/15.000', '', '', ''] // [*]
            },
            'GOTM': {
                'Honey Bee': ['Belugue_GOTM', 'u15p7dytj/15.001', '', '2305', 'Netherlands_HoneyBee'] // [*]
            },
            'completed': {
                'Honeycombs Schiedam': ['Belugue_completed', 'u15p7fguu/15.001', '', '', ''], // [*]
                'Honeycombs-2 Schiedam': ['Belugue_completed', 'u15p7g567/15.001', '', '', '']
            }
        },
        'BenandJules': {
            'all': {
                'EyUpMeDuck': ['BenandJules_all', 'gcrj5dn8x/15.000', '', '2109', 'UnitedKingdom_EyUpMeDuck'], // [*]
                'Pastebucket Memorial': ['BenandJules_all', 'gcrmvk8te/15.000', '', '', '']
            },
            'GOTM': {
                'EyUpMeDuck': ['BenandJules_GOTM', 'gcrj5dn8x/15.001', '', '2109', 'UnitedKingdom_EyUpMeDuck'] // [*]
            },
            'completed': {
                'Pastebucket Memorial': ['BenandJules_completed', 'gcrmvk8te/15.001', '', '', ''] // [*]
            }
        },
        'Bonn': {
            'all': {
                'Colors @Bonn': ['Bonn_all', 'u1j02nz06/15.000', '', '', ''], // [*]
                'Event Pin': ['Bonn_all', 'u1j09d1xz/15.000', '', '', ''],
                'Munzee Logo': ['Bonn_all', 'u1hbrymvt/15.000', '', '1907', 'Germany_MunzeeLogo']
            },
            'GOTM': {
                'Munzee Logo': ['Bonn_GOTM', 'u1hbrymvt/15.001', '', '1907', 'Germany_MunzeeLogo'] // [*]
            },
            'completed': {
                'Colors @Bonn': ['Bonn_completed', 'u1j02nz06/15.001', '', '', ''],
                'Event Pin': ['Bonn_completed', 'u1j09d1xz/15.001', '', '', ''] // [*]
            }
        },
        'BonnieB1': {
            'all': {
                'Adventure Portal 2': ['BonnieB1_all', 'u336wpx05/15.0001', '1ivw2wLAerMP12SUdmvBHu03atNBSZLE38TMv8YQpCa0', '', ''], // Germany
                'AE2 Submarine': ['BonnieB1_all', 'r3grt6gby/15.0001', '', '', ''],
                'Arizona Cactus': ['BonnieB1_all', '9w0223h6h/15.0001', '', '', ''],
                'AussiePossum': ['BonnieB1_all', 'r652njr19/15.0001', '', '', ''],
                'BeachUmbrella': ['BonnieB1_all', 'gcn8sbhwp/15.0001', '', '2205', 'UnitedKingdom_BeachUmbrella'], // United Kingdom
                'Bee Flats': ['BonnieB1_all', 'r7h6g02c3/15.0001', '', '', ''],
                'Bee Flowers': ['BonnieB1_all', 'r7h6erkpu/15.0001', '', '', ''], // Australia
                'Bee Lucky': ['BonnieB1_all', 'r7h6eqkm5/15.0001', '', '', ''],
                'Bee Queen': ['BonnieB1_all', 'r7h6g0w0p/15.0001', '', '', ''],
                'Bee Santa': ['BonnieB1_all', 'r7h6sj88v/15.0001', '', '', ''], // Australia
                'Bee Strong Jeffeth': ['BonnieB1_all', 'f244q96q7/15.0001', '', '', ''], // Canada
                'BeeJewelled!': ['BonnieB1_all', 'r7h6gk67j/15.0001', '', '', ''], // Australia
                'BeeTree': ['BonnieB1_all', 'r7h6dzurf/15.0001', '', '', ''],
                'Bournemouth Beach huts!': ['BonnieB1_all', 'gcn8w32ez/15.0001', '', '', ''],
                'BuzzzBee': ['BonnieB1_all', 'r7h6exz90/15.0001', '', '', ''], // Australia
                'CarsBoy`s first car': ['BonnieB1_all', 'r6ugfd6yw/15.0001', '', '', ''],
                'CelticSnake': ['BonnieB1_all', '9vk4uqw9m/15.0001', '16_IPkJ87HAsJ7ZKB0yAk1v2n1PCJ9BpJ0AoXGx_tX6I', '', ''],
                'Croc of Munzees': ['BonnieB1_all', 'rhzxv1907/15.0001', '', '', ''],
                'CuppaCazmo': ['BonnieB1_all', 'gcqp37e4w/15.0001', '', '', ''],
                'Egyptian Cat': ['BonnieB1_all', '9vf6qtn7g/15.0001', '', '2204', 'USA_EgyptianCat'], // USA
                'Egyptian Mask': ['BonnieB1_all', 'r7hu4xdc9/15.0001', '', '', ''],
                'Emu in Canberra': ['BonnieB1_all', 'r3dp4qcmk/15.0001', '', '', ''],
                'Fairy Wren': ['BonnieB1_all', 'r7hucu2rc/15.0001', '', '', ''], // Australia
                'FlatFlying': ['BonnieB1_all', 'gcp1856s3/15.0001', '', '', ''],
                'FlatDancing': ['BonnieB1_all', '9vf9zm46j/15.0001', '1CVyPfKnUQ8-pBfy-CEDybNQd7Q6EGAO5hfkQqXaVCFk', '', ''],
                'FlatsFlyAKite': ['BonnieB1_all', 'r7h6ts8z3/15.0001', '', '', ''],
                'FlatsHideNSeek': ['BonnieB1_all', 'gcn8wmup6/15.0001', '', '', ''],
                'FlatSledding!': ['BonnieB1_all', 'gcn8uzjcb/15.0001', '', '', ''],
                'FlatterBee': ['BonnieB1_all', 'r7h6g9pnh/15.0001', '', '', ''],
                'Gatton Arrows - Arrow1': ['BonnieB1_all', 'r7h71n6fd/15.0001', '', '', ''], // Australia
                'Gatton Arrows - Arrow2': ['BonnieB1_all', 'r7h71r6gq/15.0001', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=2054923152&range=A1:G1', '', ''], // Australia
                'Gatton Arrows - Arrow3': ['BonnieB1_all', 'r7h71q6jx/15.0001', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=560099315&range=A1:G1', '', ''], // Australia
                'Gatton Arrows - Arrow4': ['BonnieB1_all', 'r7h71k8tr/15.0001', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1844433261&range=A1:G1', '', ''], // Australia
                'Gatton Arrows - Arrow5': ['BonnieB1_all', 'r7h71k8m5/15.0001', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1661210718&range=A1:G1', '', ''], // Australia
                'Gold Coast 2018 Commonwealth Games': ['BonnieB1_all', 'r7j09vhbv/15.0001', '1EHMTPnWwFhLBue2Z3d4fQRnqFMXshs7jDyoeCCq5z0U', '', ''],
                'German Heart': ['BonnieB1_all', 'u33dukpdk/15.0001', '', '', ''],
                'HappyTenMunzee!': ['BonnieB1_all', 'r7hu2zgws/15.0001', '', '', ''], // Australia
                'Haunted House!': ['BonnieB1_all', 'r7j10yfh2/15.0001', '', '', ''],
                'Here bee Zodiacs!': ['BonnieB1_all', 'r7h6gff7q/15.0001', '', '', ''],
                'Honeycomb': ['BonnieB1_all', 'r7h6gc4z9/15.0001', '', '', ''],
                'HoneyDipper': ['BonnieB1_all', 'r7h6gbq0x/15.0001', '', '', ''],
                'Julbock': ['BonnieB1_all', '9v6tc48md/15.0001', '', '', ''],
                'Laidley Bee Love': ['BonnieB1_all', 'r7h6ewegy/15.0001', '', '2103', 'Australia_LaidleyBeeLove'], // Australia
                'Laidley BeeHive': ['BonnieB1_all', 'r7h6ewqcc/15.0001', '', '', ''], // Australia
                'Laidley Bees': ['BonnieB1_all', 'r7h6eys0v/15.0001', '', '', ''],
                'LismorePie': ['BonnieB1_all', 'r6uup96ut/15.0001', '', '', ''],
                'Lost Golden Jellyfish': ['BonnieB1_all', '9ymn9pbz6/15.0001', '', '', ''],
                'Lost Jellyfish in Bournemouth': ['BonnieB1_all', 'gcn8w3x64/15.0001', '', '', ''],
                'Lost PBJellyfish in Rogers': ['BonnieB1_all', '9ymnbbh19/15.0001', '', '', ''],
                'Lost Turtle in Ferndown': ['BonnieB1_all', 'gcn9j1kg4/15.0001', '', '', ''],
                'Maleny Trees': ['BonnieB1_all', 'r7hxy0v52/15.0001', '1OsjsaLbsUzhMr-LYGkwSkAonbqr8xZJd89ppLJjomDc', '', ''],
                'Mawson Lakes DHS tape': ['BonnieB1_all', 'r1f9fqktr/15.0001', '', '', ''],
                'MayPole': ['BonnieB1_all', 'r7hgckc49/15.0001', '', '', ''],
                'MiniPortal2': ['BonnieB1_all', 'u4p001h4e/15.0001', '', '', ''],
                'MiniPortal3': ['BonnieB1_all', 'gcn8t1y5g/15.0001', '', '', ''],
                'MiniPortal4': ['BonnieB1_all', 'dngc7gdxv/15.0001', '', '', ''],
                'More Beach Huts': ['BonnieB1_all', 'gcn8x8fw5/15.0001', '', '', ''],
                'Pompey': ['BonnieB1_all', 'gcp2bnhbz/15.0001', '', '', ''],
                'Pretzel': ['BonnieB1_all', 'u336we05x/15.0001', '', '', ''], // Germany
                'Pyramid O` Badges': ['BonnieB1_all', 'r7hu4rrrn/15.0001', '', '', ''], // Australia
                'QLD Perm-Temp': ['BonnieB1_all', 'r7hu62k18/15.0001', '1i5EvqfN3JXc-fe_ufgWJSt_0WXvgNZQOOeHILhl7I9o', '', ''], // Australia
                'QLD-Dingo': ['BonnieB1_all', 'r7hu60rxr/15.0001', '', '', ''], // Australia
                'QldJacaranda': ['BonnieB1_all', 'r7hucvdgx/15.0001', '', '', ''], // Australia
                'Queensland Koala': ['BonnieB1_all', 'r7hug0cqd/15.0001', '', '2012', 'Australia_QueenslandKoala'], // Australia
                'Reindeer in Kentucky': ['BonnieB1_all', 'dngckqfgd/15.0001', '', '', ''],
                'RockingHorse in Ohio': ['BonnieB1_all', 'dp5u4cvsd/15.0001', '', '', ''],
                'RUMble Bee!': ['BonnieB1_all', 'r7h6sugpe/15.0001', '', '', ''],
                'RUMportal': ['BonnieB1_all', 'r1pm0nwy0/15.0001', '', '', ''], // Australia
                'SA Party Hat': ['BonnieB1_all', 'r1fdh7cdx/15.0001', '', '', ''],
                'Snow bee Melting': ['BonnieB1_all', 'r7h6g4j12/15.0001', '', '', ''],
                'SoonBeeSpring!': ['BonnieB1_all', 'r7h6g4uvh/15.0001', '', '', ''], // BonnieB1
                'Southern Cross Kite': ['BonnieB1_all', 'r7h6tsg3e/15.0001', '', '', ''],
                'TicTacMunzee!': ['BonnieB1_all', 'r7hg9jecp/15.0001', '', '', ''], // Australia
                'Time2Munzee - Lilydale': ['BonnieB1_all', 'r1r35ck3u/15.0001', '', '', ''],
                'Toowoomba Rose': ['BonnieB1_all', 'r7h5324hk/15.0001', '1B2jF7OTxhp1yDCHcSdObhojuaUejO5GqVRW_7pC32xA', '', ''],
                'Trojan Kitty': ['BonnieB1_all', 'rk4pdkx91/15.0001', '', '', ''],
                'Tulips!': ['BonnieB1_all', 'r1pre7s7r/15.0001', '', '', ''],
                'TwoBeeOrKnot?': ['BonnieB1_all', 'r7h6gcrmm/15.0001', '1QeWV421cytXf8r6XdxlbS1e3RPpuramAhrUmm4jkcSk', '', ''],
                'Unicorn in The Park': ['BonnieB1_all', 'r7hugvyj7/15.0001', '', '', ''],
                'We Bee Pawns': ['BonnieB1_all', 'r7h6fcj3s/15.0001', '', '', ''],
                'WinterSolstice': ['BonnieB1_all', 'gcn9hbuf4/15.0001', '', '', '']
            },
            'GOTM': {
                'BeachUmbrella': ['BonnieB1_GOTM', 'gcn8sbhwp/15.0011', '', '2205', 'UnitedKingdom_BeachUmbrella'], // United Kingdom
                'Egyptian Cat': ['BonnieB1_GOTM', '9vf6qtn7g/15.0011', '', '2204', 'USA_EgyptianCat'], // USA
                'Laidley Bee Love': ['BonnieB1_GOTM', 'r7h6ewegy/15.0011', '', '2103', 'Australia_LaidleyBeeLove'], // Australia
                'Queensland Koala': ['BonnieB1_GOTM', 'r7hug0cqd/15.0011', '', '2012', 'Australia_QueenslandKoala'] // Australia
            },
            'completed': {
                'AE2 Submarine': ['BonnieB1_completed', 'r3grt6gby/15.0011', '', '', ''],
                'Arizona Cactus': ['BonnieB1_completed', '9w0223h6h/15.0011', '', '', ''],
                'AussiePossum': ['BonnieB1_completed', 'r652njr19/15.0011', '', '', ''],
                'Bee Flats': ['BonnieB1_completed', 'r7h6g02c3/15.0011', '', '', ''],
                'Bee Flowers': ['BonnieB1_completed', 'r7h6erkpu/15.0011', '', '', ''], // Australia
                'Bee Lucky': ['BonnieB1_completed', 'r7h6eqkm5/15.0011', '', '', ''],
                'Bee Queen': ['BonnieB1_completed', 'r7h6g0w0p/15.0011', '', '', ''],
                'Bee Santa': ['BonnieB1_completed', 'r7h6sj88v/15.0011', '', '', ''], // Australia
                'Bee Strong Jeffeth': ['BonnieB1_completed', 'f244q96q7/15.0011', '', '', ''], // Canada
                'BeeJewelled!': ['BonnieB1_completed', 'r7h6gk67j/15.0011', '', '', ''], // Australia
                'BeeTree': ['BonnieB1_completed', 'r7h6dzurf/15.0011', '', '', ''],
                'Bournemouth Beach huts!': ['BonnieB1_completed', 'gcn8w32ez/15.0011', '', '', ''],
                'BuzzzBee': ['BonnieB1_completed', 'r7h6exz90/15.0011', '', '', ''], // Australia
                'CarsBoy`s first car': ['BonnieB1_completed', 'r6ugfd6yw/15.0011', '', '', ''],
                'Croc of Munzees': ['BonnieB1_completed', 'rhzxv1907/15.0011', '', '', ''],
                'CuppaCazmo': ['BonnieB1_completed', 'gcqp37e4w/15.0011', '', '', ''],
                'Egyptian Mask': ['BonnieB1_completed', 'r7hu4xdc9/15.0011', '', '', ''],
                'Emu in Canberra': ['BonnieB1_completed', 'r3dp4qcmk/15.0011', '', '', ''],
                'Fairy Wren': ['BonnieB1_completed', 'r7hucu2rc/15.0011', '', '', ''], // Australia
                'FlatFlying': ['BonnieB1_completed', 'gcp1856s3/15.0011', '', '', ''],
                'FlatsFlyAKite': ['BonnieB1_completed', 'r7h6ts8z3/15.0011', '', '', ''],
                'FlatsHideNSeek': ['BonnieB1_completed', 'gcn8wmup6/15.0011', '', '', ''],
                'FlatSledding!': ['BonnieB1_completed', 'gcn8uzjcb/15.0011', '', '', ''],
                'FlatterBee': ['BonnieB1_completed', 'r7h6g9pnh/15.0011', '', '', ''],
                'Gatton Arrows - Arrow1': ['BonnieB1_completed', 'r7h71n6fd/15.0011', '', '', ''], // Australia
                'German Heart': ['BonnieB1_completed', 'u33dukpdk/15.0011', '', '', ''],
                'HappyTenMunzee!': ['BonnieB1_completed', 'r7hu2zgws/15.0011', '', '', ''], // Australia
                'Haunted House!': ['BonnieB1_completed', 'r7j10yfh2/15.0011', '', '', ''],
                'Here bee Zodiacs!': ['BonnieB1_completed', 'r7h6gff7q/15.0011', '', '', ''],
                'Honeycomb': ['BonnieB1_completed', 'r7h6gc4z9/15.0011', '', '', ''],
                'HoneyDipper': ['BonnieB1_completed', 'r7h6gbq0x/15.0011', '', '', ''],
                'Julbock': ['BonnieB1_completed', '9v6tc48md/15.0011', '', '', ''],
                'Laidley BeeHive': ['BonnieB1_completed', 'r7h6ewqcc/15.0011', '', '', ''], // Australia
                'Laidley Bees': ['BonnieB1_completed', 'r7h6eys0v/15.0011', '', '', ''],
                'Lost Golden Jellyfish': ['BonnieB1_completed', '9ymn9pbz6/15.0011', '', '', ''],
                'Lost Jellyfish in Bournemouth': ['BonnieB1_completed', 'gcn8w3x64/15.0011', '', '', ''],
                'Lost PBJellyfish in Rogers': ['BonnieB1_completed', '9ymnbbh19/15.0011', '', '', ''],
                'Lost Turtle in Ferndown': ['BonnieB1_completed', 'gcn9j1kg4/15.0011', '', '', ''],
                'LismorePie': ['BonnieB1_completed', 'r6uup96ut/15.0011', '', '', ''],
                'Mawson Lakes DHS tape': ['BonnieB1_completed', 'r1f9fqktr/15.0011', '', '', ''],
                'MayPole': ['BonnieB1_completed', 'r7hgckc49/15.0011', '', '', ''],
                'MiniPortal2': ['BonnieB1_completed', 'u4p001h4e/15.0011', '', '', ''],
                'MiniPortal3': ['BonnieB1_completed', 'gcn8t1y5g/15.0011', '', '', ''],
                'MiniPortal4': ['BonnieB1_completed', 'dngc7gdxv/15.0011', '', '', ''],
                'More Beach Huts': ['BonnieB1_completed', 'gcn8x8fw5/15.0011', '', '', ''],
                'Pompey': ['BonnieB1_completed', 'gcp2bnhbz/15.0011', '', '', ''],
                'Pretzel': ['BonnieB1_completed', 'u336we05x/15.0011', '', '', ''], // Germany
                'Pyramid O` Badges': ['BonnieB1_completed', 'r7hu4rrrn/15.0011', '', '', ''], // Australia
                'QLD-Dingo': ['BonnieB1_completed', 'r7hu60rxr/15.0011', '', '', ''], // Australia
                'QldJacaranda': ['BonnieB1_completed', 'r7hucvdgx/15.0011', '', '', ''], // Australia
                'Reindeer in Kentucky': ['BonnieB1_completed', 'dngckqfgd/15.0011', '', '', ''],
                'RockingHorse in Ohio': ['BonnieB1_completed', 'dp5u4cvsd/15.0011', '', '', ''],
                'RUMble Bee!': ['BonnieB1_completed', 'r7h6sugpe/15.0011', '', '', ''],
                'RUMportal': ['BonnieB1_completed', 'r1pm0nwy0/15.0011', '', '', ''], // Australia
                'SA Party Hat': ['BonnieB1_all', 'r1fdh7cdx/15.0001', '', '', ''],
                'Snow bee Melting': ['BonnieB1_completed', 'r7h6g4j12/15.0011', '', '', ''],
                'SoonBeeSpring!': ['BonnieB1_completed', 'r7h6g4uvh/15.0011', '', '', ''], // BonnieB1
                'Southern Cross Kite': ['BonnieB1_completed', 'r7h6tsg3e/15.0011', '', '', ''],
                'TicTacMunzee!': ['BonnieB1_completed', 'r7hg9jecp/15.0011', '', '', ''], // Australia
                'Time2Munzee - Lilydale': ['BonnieB1_completed', 'r1r35ck3u/15.0011', '', '', ''],
                'Trojan Kitty': ['BonnieB1_completed', 'rk4pdkx91/15.0011', '', '', ''],
                'Tulips!': ['BonnieB1_completed', 'r1pre7s7r/15.0011', '', '', ''],
                'Unicorn in The Park': ['BonnieB1_completed', 'r7hugvyj7/15.0011', '', '', ''],
                'We Bee Pawns': ['BonnieB1_completed', 'r7h6fcj3s/15.0011', '', '', ''],
                'WinterSolstice': ['BonnieB1_completed', 'gcn9hbuf4/15.0011', '', '', '']
            },
            'empty': {
                'Adventure Portal 2': ['BonnieB1_empty', 'u336wpx05/15.0011', '1ivw2wLAerMP12SUdmvBHu03atNBSZLE38TMv8YQpCa0', '', ''],
                'CelticSnake': ['BonnieB1_empty', '9vk4uqw9m/15.0011', '16_IPkJ87HAsJ7ZKB0yAk1v2n1PCJ9BpJ0AoXGx_tX6I', '', ''],
                'FlatDancing': ['BonnieB1_empty', '9vf9zm46j/15.0011', '1CVyPfKnUQ8-pBfy-CEDybNQd7Q6EGAO5hfkQqXaVCFk', '', ''],
                'Gatton Arrows - Arrow2': ['BonnieB1_empty', 'r7h71r6gq/15.0011', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=2054923152&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow3': ['BonnieB1_empty', 'r7h71q6jx/15.0011', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=560099315&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow4': ['BonnieB1_empty', 'r7h71k8tr/15.0011', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1844433261&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow5': ['BonnieB1_empty', 'r7h71k8m5/15.0011', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1661210718&range=A1:G1', '', ''],
                'Gold Coast 2018 Commonwealth Games': ['BonnieB1_all', 'r7j09vhbv/15.0011', '1EHMTPnWwFhLBue2Z3d4fQRnqFMXshs7jDyoeCCq5z0U', '', ''],
                'Maleny Trees': ['BonnieB1_empty', 'r7hxy0v52/15.0011', '1OsjsaLbsUzhMr-LYGkwSkAonbqr8xZJd89ppLJjomDc', '', ''],
                'QLD Perm-Temp': ['BonnieB1_empty', 'r7hu62k18/15.0011', '1i5EvqfN3JXc-fe_ufgWJSt_0WXvgNZQOOeHILhl7I9o', '', ''],
                'Toowoomba Rose': ['BonnieB1_empty', 'r7h5324hk/15.0011', '1B2jF7OTxhp1yDCHcSdObhojuaUejO5GqVRW_7pC32xA', '', ''],
                'TwoBeeOrKnot?': ['BonnieB1_empty', 'r7h6gcrmm/15.0011', '1QeWV421cytXf8r6XdxlbS1e3RPpuramAhrUmm4jkcSk', '', ''] // [*]
            }
        },
        'Brandikorte': {
            'all': {
                'Bobby the Zombie': ['Brandikorte_all', 'cbjb28d2h/15.000', '', '', ''],
                'Cowtown': ['Brandikorte_all', '9vff88tju/15.000', '', '', ''],
                'Sunset Cowboy': ['Brandikorte_all', '9vff269xn/15.000', '', '1901', 'USA_SunsetCowboy'], // [*]
                'The Saginaw Heart': ['Brandikorte_all', '9vfg0dzbq/15.000', '', '2002', 'USA_TheSaginawHeart'],
                'Weatherford Emerald Square': ['Brandikorte_all', '9vf6q4zrb/15.000', '', '', '']
            },
            'GOTM': {
                'Sunset Cowboy': ['Brandikorte_GOTM', '9vff269xn/15.001', '', '1901', 'USA_SunsetCowboy'],
                'The Saginaw Heart': ['Brandikorte_GOTM', '9vfg0dzbq/15.001', '', '2002', 'USA_TheSaginawHeart'] // [*]
            },
            'completed': {
                'Bobby the Zombie': ['Brandikorte_completed', 'cbjb28d2h/15.001', '', '', ''], // [*]
                'Cowtown': ['Brandikorte_completed', '9vff88tju/15.001', '', '', ''],
                'Weatherford Emerald Square': ['Brandikorte_completed', '9vf6q4zrb/15.001', '', '', '']
            }
//            'empty': {
//            }
        },
        'Chandabelle': {
            'all': {
                'Gatton Arrows - Arrow1': ['Chandabelle_all', 'r7h71n6fd/15.0002', '', '', ''],
                'Gatton Arrows - Arrow2': ['Chandabelle_all', 'r7h71r6gq/15.0002', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=2054923152&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow3': ['Chandabelle_all', 'r7h71q6jx/15.0002', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=560099315&range=A1:G1', '', ''], // [*]
                'Gatton Arrows - Arrow4': ['Chandabelle_all', 'r7h71k8tr/15.0002', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1844433261&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow5': ['Chandabelle_all', 'r7h71k8m5/15.0002', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1661210718&range=A1:G1', '', ''],
                'Abstatt Tomcat': ['Chandabelle_all', 'u0wx5evsq/15.0002', '', '1910', 'Germany_AbstattTomcat'],
                'Peace': ['Chandabelle_all', 'u0we8z9mh/15.0002', '1kz_9X3qo6HXUuEyMn9ZP9m2dcWwOk5y0xV45GJo6dxQ', '', '']
            },
            'GOTM': {
                'Abstatt Tomcat': ['Chandabelle_GOTM', 'u0wx5evsq/15.0012', '', '1910', 'Germany_AbstattTomcat'] // [*]
            },
            'completed': {
                'Gatton Arrows - Arrow1': ['Chandabelle_completed', 'r7h71n6fd/15.0012', '', '', ''] // [*]
            },
            'empty': {
                'Gatton Arrows - Arrow2': ['Chandabelle_empty', 'r7h71r6gq/15.0012', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=2054923152&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow3': ['Chandabelle_empty', 'r7h71q6jx/15.0012', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=560099315&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow4': ['Chandabelle_empty', 'r7h71k8tr/15.0012', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1844433261&range=A1:G1', '', ''],
                'Gatton Arrows - Arrow5': ['Chandabelle_empty', 'r7h71k8m5/15.0012', '1S1YYjUYHlv9X0rl0MCcq61jWlbe303--PRDvk_ME4BI/edit#gid=1661210718&range=A1:G1', '', ''],
                'Peace': ['Chandabelle_empty', 'u0we8z9mh/15.0012', '1kz_9X3qo6HXUuEyMn9ZP9m2dcWwOk5y0xV45GJo6dxQ', '', ''] // [*]
            }
        },
        'CoalCracker7': {
            'GOTM': {
                'Corgi': ['CoalCracker7_GOTM', 'dhvxycns2/15.001', '', '2207', 'USA_Corgi'], // Lakeland, USA
                'Teddy Bear': ['CoalCracker7_GOTM', 'dr14d6kgc/15.001', '', '2011', 'USA_TeddyBear'], // USA
                'Sprinkle Cupcake': ['CoalCracker7_GOTM', 'dhvx46v6v/15.001', '', '2208', 'USA_SprinkleCupcake'] // PlantCity, USA
            },
            'completed': {
                'Lakeland Candy Corn': ['CoalCracker7_completed', 'dhvxyb7r1/15.001', '', '', ''] // USA
            }
        },
        'delfin13': {
            'completed': {
                'Beagle': ['delfin13_completed', 'u2rqe9sxg/15.001', '', '', ''], // Hungary
                'Cimbi': ['delfin13_completed', 'u2rq7vk57/15.001', '', '', ''], // Hungary
                'Colors': ['delfin13_completed', 'u2rqe2txv/15.001', '', '', ''], // Hungary
                'Honey': ['delfin13_completed', 'u2rqkq0ze/15.001', '', '', ''], // Hungary
                'Picu': ['delfin13_completed', 'u2rqkn2gm/15.001', '', '', ''], // Hungary
                'QR': ['delfin13_completed', 'u2rqkgr9r/15.001', '', '', ''] // Hungary
            }
        },
        'denali0407': {
            'all': {
                'Avocato': ['denali0407_all', '9vf6qbc6f/15.0002', '1ksqeWGKy4yylwzUEjErfq05dCbs-ghMaJ296eJrGtI4', '', ''],
                'Baby Groot!': ['denali0407_all', '9vf6qxdkf/15.0002', '', '', ''],
                'Egyptian Cat': ['denali0407_all', '9vf6qtn7g/15.0002', '', '2204', 'USA_EgyptianCat'], // [*]
                'Ellis Creek Owl': ['denali0407_all', '9vf6wcht4/15.0002', '', '', ''],
                'Ellis Creek Owl (Flats)': ['denali0407_all', '9vf6wcht4/15.0002', '1Vw34xTOP8v3fQuWM2NaXecX-7wEMcGUsfLqjatjDHnM', '', ''],
                'Fort Worth Longhorn': ['denali0407_all', '9vf9znt4b/15.0002', '', '1906', 'USA_FortWorthLonghorn'],
                'Marshall Mallard!': ['denali0407_all', '9vf6qwe4e/15.0002', '', '', ''],
                'Pumpkin Spice Owl': ['denali0407_all', '9vf6ppgy2/15.0002', '', '', ''],
                'Pumpkin Spice Owl (Flats)': ['denali0407_all', '9vf6ppgy2/15.0002009', '', '', ''],
                'Texas Golden Ticket': ['denali0407_all', '9vfdhhkk9/15.0002', '', '', ''],
                'Texas Golden Ticket (Flats)': ['denali0407_all', '9vfdhhkk9/15.0002009', '1fAwIoOdHKk7EH6cIL28nxUYBTBCdlvM_p0zMHf0EIGI', '', ''],
                'Tied up in Knotz in Weatherford...Ireland?': ['denali0407_all', '9vf6npmgv/15.0002', '1zuJL1OfsnYgzGr8CS3Cck2SQDetTwnViCLcZP3kcpIs', '', ''],
                'Uncut Diamond': ['denali0407_all', '9vf6wbvcj/15.0002', '', '', ''],
                'Uncut Diamond (Flats)': ['denali0407_all', '9vf6wbvcj/15.0002009', '', '', ''],
                'Weatherford St. Patrick`s Owl': ['denali0407_all', '9vf6q0md5/15.0002', '', '', ''],
                'Weatherford Xmas Owl': ['denali0407_all', '9vf6qfj00/15.0002', '', '', '']
            },
            'GOTM': {
                'Egyptian Cat': ['denali0407_GOTM', '9vf6qtn7g/15.002', '', '2204', 'USA_EgyptianCat'],
                'Fort Worth Longhorn': ['denali0407_GOTM', '9vf9znt4b/15.002', '', '1906', 'USA_FortWorthLonghorn'] // [*]
            },
            'completed': {
                'Baby Groot!': ['denali0407_completed', '9vf6qxdkf/15.002', '', '', ''],
                'Ellis Creek Owl': ['denali0407_completed', '9vf6wcht4/15.002', '', '', ''], // [*]
                'Marshall Mallard!': ['denali0407_completed', '9vf6qwe4e/15.002', '', '', ''],
                'Pumpkin Spice Owl': ['denali0407_completed', '9vf6ppgy2/15.002', '', '', ''],
                'Pumpkin Spice Owl (Flats)': ['denali0407_completed', '9vf6ppgy2/15.002009', '', '', ''],
                'Texas Golden Ticket': ['denali0407_completed', '9vfdhhkk9/15.002', '', '', ''],
                'Uncut Diamond': ['denali0407_completed', '9vf6wbvcj/15.002', '', '', ''],
                'Uncut Diamond (Flats)': ['denali0407_completed', '9vf6wbvcj/15.002009', '', '', ''],
                'Weatherford St. Patrick`s Owl': ['denali0407_completed', '9vf6q0md5/15.002', '', '', ''],
                'Weatherford Xmas Owl': ['denali0407_completed', '9vf6qfj00/15.002', '', '', '']
            },
            'empty': {
                'Avocato': ['denali0407_empty', '9vf6qbc6f/15.002', '1ksqeWGKy4yylwzUEjErfq05dCbs-ghMaJ296eJrGtI4', '', ''],
                'Ellis Creek Owl (Flats)': ['denali0407_empty', '9vf6wcht4/15.002009', '1Vw34xTOP8v3fQuWM2NaXecX-7wEMcGUsfLqjatjDHnM', '', ''],
                'Texas Golden Ticket (Flats)': ['denali0407_empty', '9vfdhhkk9/15.002009', '1fAwIoOdHKk7EH6cIL28nxUYBTBCdlvM_p0zMHf0EIGI', '', ''],
                'Tied up in Knotz in Weatherford...Ireland?': ['denali0407_empty', '9vf6npmgv/15.002', '1zuJL1OfsnYgzGr8CS3Cck2SQDetTwnViCLcZP3kcpIs', '', ''] // [*]
            }
        },
        'destrandman': {
            'all': {
                'Boogie Woogie': ['destrandman_all', 'u171jxtkq/15.000', '', '1904', 'Netherlands_BoogieWoogie'],
                'Catch the black sheep!': ['destrandman_all', 'u171jw7ts/15.000', '', '', ''],
                'Cybertruck': ['destrandman_all', 'u171jq7yk/15.000', '', '', ''],
                'Escher vs Mondriaan': ['destrandman_all', 'u171jx5qv/15.000', '', '', ''], // [*]
                'Go Green Noordwijk': ['destrandman_all', 'u171jr08j/15.000', '', '', ''],
                'Superman vs Batman': ['destrandman_all', 'u171jz6j8/15.000', '', '', '']
            },
            'GOTM': {
                'Boogie Woogie': ['destrandman_GOTM', 'u171jxtkq/15.001', '', '1904', 'Netherlands_BoogieWoogie'] // [*g
            },
            'completed': {
                'Catch the black sheep!': ['destrandman_completed', 'u171jw7ts/15.001', '', '', ''],
                'Cybertruck': ['destrandman_completed', 'u171jq7yk/15.001', '', '', ''],
                'Escher vs Mondriaan': ['destrandman_completed', 'u171jx5qv/15.001', '', '', ''],
                'Go Green Noordwijk': ['destrandman_completed', 'u171jr08j/15.001', '', '', ''], // [*]
                'Superman vs Batman': ['destrandman_completed', 'u171jz6j8/15.001', '', '', '']
            }
        },
        'FRLK': {
            'all': {
                'Air Brush Palet': ['FRLK_all', 'u1kjmg4vf/15.000', '1m9wvpVxz1C65NZaIQTN3CAzz-ElYUSLBGvw-Ic5QMmw', '', ''],
                'EVO Keunst Tún': ['FRLK_all', 'u1kjq3cr1/15.000', '1OzvH9-QHKyj4KQOMv91leNZX3byA838i2nPgdCuoTHY', '', ''],
                'Jewel Face': ['FRLK_all', 'u1kjq1fks/15.000', '1ciDwGIghYKZibvp-9jg_xbEN7J1-rb6Y4sviwbbpIAQ', '', ''], // [*]
                'Krúsbôgetún it Kanaal': ['FRLK_all', 'u1kjq5k8x/15.000', '', '', ''],
                'Luxemburgse Flag': ['FRLK_all', 'u0u7swpme/15.000', '1fMpRjvmY1hiDdBB3EDBubklAlxzbwX4nRANX8U2Yz68', '', ''],
                'The Flats': ['FRLK_all', 'u1kjr2qnz/15.000', '1_WtHLHF5OVLjYs56mZrvFJNKh6dbvgDo9sOc0fRqlF4', '', '']
            },
            'completed': {
                'Krúsbôgetún it Kanaal': ['FRLK_completed', 'u1kjq5k8x/15.001', '', '', ''] // [*]
            },
            'empty': {
                'Air Brush Palet': ['FRLK_empty', 'u1kjmg4vf/15.001', '1m9wvpVxz1C65NZaIQTN3CAzz-ElYUSLBGvw-Ic5QMmw', '', ''],
                'EVO Keunst Tún': ['FRLK_empty', 'u1kjq3cr1/15.001', '1OzvH9-QHKyj4KQOMv91leNZX3byA838i2nPgdCuoTHY', '', ''], // [*]
                'Jewel Face': ['FRLK_empty', 'u1kjq1fks/15.001', '1ciDwGIghYKZibvp-9jg_xbEN7J1-rb6Y4sviwbbpIAQ', '', ''],
                'Luxemburgse Flag': ['FRLK_empty', 'u0u7swpme/15.001', '1fMpRjvmY1hiDdBB3EDBubklAlxzbwX4nRANX8U2Yz68', '', ''],
                'The Flats': ['FRLK_empty', 'u1kjr2qnz/15.001', '1_WtHLHF5OVLjYs56mZrvFJNKh6dbvgDo9sOc0fRqlF4', '', '']
            }
        },
        'geckofreund': {
            'all': {
                'Appenzeller Sennenhund RT': ['geckofreund_all', 'u0wecspcn/15.0001', '1-AvO8enz9WYlMpeekGWPkVxNvZ-f63S0L3yfu1YfDxw', '', ''],
                'Are you X-Zee-perienced': ['geckofreund_all', 'u0weber3n/15.0001', '102QHEKr1_eHzeED1o26_qgWUMfDFC7S_rwAYsQRQyA8', '', ''],
                'Flats @ Appenzeller RT': ['geckofreund_all', 'u0wecspcn/15.0001009', '1M-9WjrBwHgMI7UEQybxwY9m5QzD-xlodk_m6EeZiFSc', '', ''],
                'George - the Fab 4/2': ['geckofreund_all', 'u0w7yp6un/15.0001', '1whtNX40rfK72iTvKxaaEd5rZLpq6_iXZ5V6NSzJ4vZA', '', ''],
                'John - the Fab 4/1': ['geckofreund_all', 'u0w7vzm9n/15.0001', '', '2211', 'Germany_JohnTheFab41'],
                'Mixed Garden RT': ['geckofreund_all', 'u0weck999/15.0001', '', '', ''],
                'Patchwork RT': ['geckofreund_all', 'u0wec7dyv/15.0001', '12xqliOfumxZbSSNi6p7r0pjr7-gbCzyhioJ-DykF2lA', '', ''],
                'Paul - the Fab 4/3': ['geckofreund_all', 'u0w7yrd1n/15.0001', '1wlcEVbnafMexotRJMsSHxFtWLaLl-hvg7gayoIOYBCs', '', ''],
                'Ringo - the Fab 4': ['geckofreund_all', 'u0w7yn1s8/15.0001', '1iljO6wikjSvOBmfUp4Qt9bxKCe9wSDheoMkYEVfyUn0', '', ''], // [*]
                'Smells like ZeeSpirit - Kurt Cobain': ['geckofreund_all', 'u0ws1b5wm/15.0001', '1CP8x9y0IyA_NYHi58nhQHU7reAYefkcq8AihMwt-ayg', '', ''],
                'Sportpark Evolutions RT 1': ['geckofreund_all', 'u0wec15u9/15.0001', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
                'Sportpark Evolutions RT 2': ['geckofreund_all', 'u0wec1kg4/15.0001', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
                'Wedding Day': ['geckofreund_all', 'u0webcwke/15.0001', '', '', '']
            },
            'GOTM': {
                'John - the Fab 4/1': ['geckofreund_GOTM', 'u0w7vzm9n/15.0011', '', '2211', 'Germany_JohnTheFab41'] // [*]
            },
            'completed': {
                'Mixed Garden RT': ['geckofreund_completed', 'u0weck999/15.0011', '', '', ''], // [*]
                'Wedding Day': ['geckofreund_completed', 'u0webcwke/15.0011', '', '', '']
            },
            'empty': {
                'Appenzeller Sennenhund RT': ['geckofreund_empty', 'u0wecspcn/15.0011', '1-AvO8enz9WYlMpeekGWPkVxNvZ-f63S0L3yfu1YfDxw', '', ''],
                'Are you X-Zee-perienced': ['geckofreund_empty', 'u0weber3n/15.0011', '102QHEKr1_eHzeED1o26_qgWUMfDFC7S_rwAYsQRQyA8', '', ''],
                'Flats @ Appenzeller RT': ['geckofreund_empty', 'u0wecspcn/15.0011009', '1M-9WjrBwHgMI7UEQybxwY9m5QzD-xlodk_m6EeZiFSc', '', ''],
                'George - the Fab 4/2': ['geckofreund_empty', 'u0w7yp6un/15.0011', '1whtNX40rfK72iTvKxaaEd5rZLpq6_iXZ5V6NSzJ4vZA', '', ''], // [*]
                'Patchwork RT': ['geckofreund_empty', 'u0wec7dyv/15.0011', '12xqliOfumxZbSSNi6p7r0pjr7-gbCzyhioJ-DykF2lA', '', ''],
                'Paul - the Fab 4/3': ['geckofreund_empty', 'u0w7yrd1n/15.0011', '1wlcEVbnafMexotRJMsSHxFtWLaLl-hvg7gayoIOYBCs', '', ''],
                'Ringo - the Fab 4': ['geckofreund_empty', 'u0w7yn1s8/15.0011', '1iljO6wikjSvOBmfUp4Qt9bxKCe9wSDheoMkYEVfyUn0', '', ''],
                'Smells like ZeeSpirit - Kurt Cobain': ['geckofreund_empty', 'u0ws1b5wm/15.0011', '1CP8x9y0IyA_NYHi58nhQHU7reAYefkcq8AihMwt-ayg', '', ''],
                'Sportpark Evolutions RT 1': ['geckofreund_empty', 'u0wec15u9/15.0011', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
                'Sportpark Evolutions RT 2': ['geckofreund_empty', 'u0wec1kg4/15.0011', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', '']
            }
        },
        'geomatrix': {
            'all': {
                'April Showers': ['geomatrix_all', 'cbj83kzvd/15.000', '', '', ''],
                'Christmas Snowman': ['geomatrix_all', '9zvxjdffs/15.000', '', '', ''],
                'Como Evo Flowers': ['geomatrix_all', '9zvzb5fqd/15.000', '', '', ''],
                'Dog days of summer!': ['geomatrix_all', '9zvx4cm5j/15.000', '', '2306', 'USA_DogDaysOfSummer'],
                'Heart Crossbows': ['geomatrix_all', '9zvxxuuu3/15.000', '', '', ''],
                'Hiawatha Crossbows': ['geomatrix_all', '9zvxwmgw4/15.000', '', '', ''],
                'Jack-O & ZEEacula': ['geomatrix_all', '9zvxx1c0y/15.000', '', '', ''],
                'Long Lake Butterflies': ['geomatrix_all', 'cbj8rkf6w/15.000', '', '', ''],
                'LRT EVO Train': ['geomatrix_all', '9zvz8rvx1/15.000', '', '', ''],
                'LRT Snowflake': ['geomatrix_all', '9zvxz44h1/15.000', '', '', ''],
                'Minnesota Moose': ['geomatrix_all', '9zvxqxry4/15.000', '', '', ''],
                'MOA Christmas Card': ['geomatrix_all', '9zvxjfwnt/15.000', '', '2212', 'USA_MOAChristmasCard'],
                'MOA Dwarf Leprechaun': ['geomatrix_all', '9zvxn73ke/15.000', '', '', ''],
                'MOA Electric Monster': ['geomatrix_all', '9zvxn51xy/15.000', '', '', ''],
                'MOA Flower': ['geomatrix_all', '9zvxjgnp0/15.000', '', '', ''],
                'MOA Nutcracker': ['geomatrix_all', '9zvxnhr2r/15.000', '', '', ''],
                'MOA Penguin': ['geomatrix_all', '9zvxn5vvf/15.000', '', '', ''],
                'MOA Unicorn': ['geomatrix_all', '9zvxn49zw/15.000', '', '2005', 'USA_MOAUnicorn'],
                'MOA Yeti': ['geomatrix_all', '9zvxjuwtm/15.000', '', '', ''],
                'Munzee`s X birthday': ['geomatrix_all', 'cbjb40uyp/15.000', '', '', ''],
                'Pot o`Zees': ['geomatrix_all', 'cbj8qfh3r/15.000', '', '2303', 'USA_PotOZees'],
                'St. Paul Shamrock': ['geomatrix_all', '9zvz9m4w8/15.000', '', '', ''],
                'Super Bowl LII': ['geomatrix_all', '9zvxy0n58/15.000', '', '', ''],
                'XI Birthday Mad Hatter': ['geomatrix_all', '9zvxmdpr9/15.000', '', '2207', 'USA_XIBirthdayMadHatter'], // [*]
                'XII Birthday Fish Garden Hedge': ['geomatrix_all', '9zvxzc3wj/15.000', '', '', '']
            },
            'GOTM': {
                'Dog days of summer!': ['geomatrix_GOTM', '9zvx4cm5j/15.001', '', '2306', 'USA_DogDaysOfSummer'],
                'MOA Christmas Card': ['geomatrix_GOTM', '9zvxjfwnt/15.001', '', '2212', 'USA_MOAChristmasCard'], // [*]
                'MOA Unicorn': ['geomatrix_GOTM', '9zvxn49zw/15.001', '', '2005', 'USA_MOAUnicorn'],
                'Pot o`Zees': ['geomatrix_GOTM', 'cbj8qfh3r/15.001', '', '2303', 'USA_PotOZees'],
                'XI Birthday Mad Hatter': ['geomatrix_GOTM', '9zvxmdpr9/15.001', '', '2207', 'USA_XIBirthdayMadHatter']
            },
            'completed': {
                'April Showers': ['geomatrix_completed', 'cbj83kzvd/15.001', '', '', ''], // [*]
                'Christmas Snowman': ['geomatrix_completed', '9zvxjdffs/15.001', '', '', ''],
                'Como Evo Flowers': ['geomatrix_completed', '9zvzb5fqd/15.001', '', '', ''],
                'Heart Crossbows': ['geomatrix_completed', '9zvxxuuu3/15.001', '', '', ''],
                'Hiawatha Crossbows': ['geomatrix_completed', '9zvxwmgw4/15.001', '', '', ''],
                'Jack-O & ZEEacula': ['geomatrix_completed', '9zvxx1c0y/15.001', '', '', ''],
                'Long Lake Butterflies': ['geomatrix_completed', 'cbj8rkf6w/15.001', '', '', ''],
                'LRT EVO Train': ['geomatrix_completed', '9zvz8rvx1/15.001', '', '', ''],
                'LRT Snowflake': ['geomatrix_completed', '9zvxz44h1/15.001', '', '', ''],
                'Minnesota Moose': ['geomatrix_completed', '9zvxqxry4/15.001', '', '', ''],
                'MOA Dwarf Leprechaun': ['geomatrix_completed', '9zvxn73ke/15.001', '', '', ''],
                'MOA Electric Monster': ['geomatrix_completed', '9zvxn51xy/15.001', '', '', ''],
                'MOA Flower': ['geomatrix_completed', '9zvxjgnp0/15.001', '', '', ''],
                'MOA Nutcracker': ['geomatrix_completed', '9zvxnhr2r/15.001', '', '', ''],
                'MOA Penguin': ['geomatrix_completed', '9zvxn5vvf/15.001', '', '', ''],
                'MOA Yeti': ['geomatrix_completed', '9zvxjuwtm/15.001', '', '', ''],
                'Munzee`s X birthday': ['geomatrix_completed', 'cbjb40uyp/15.001', '', '', ''],
                'St. Paul Shamrock': ['geomatrix_completed', '9zvz9m4w8/15.001', '', '', ''],
                'Super Bowl LII': ['geomatrix_completed', '9zvxy0n58/15.001', '', '', ''], // [*]
                'XII Birthday Fish Garden Hedge': ['geomatrix_all', '9zvxzc3wj/15.000', '', '', '']
            }
//            'empty': {
//            }
        },
        'Grusierp': {
            'all': {
                'Legnicki gołąbek': ['Grusierp_all', 'u35e26neh/15.000', '1KvU887pfqyJMbAdj_Wr0VTLdxIX1_ZkHLQYRQ3d1dmM', '', ''],
                'Minecraft Sword': ['Grusierp_all', 'u357rcyex/15.000', '', '', ''],
                'Muzyczne Nutki': ['Grusierp_all', 'u357r4tw6/15.000', '', '', ''],
                'Piernikowa Chatka': ['Grusierp_all', 'u357rg2hd/15.000', '', '', ''], // [*]
                'Pisanka Wielkanocna': ['Grusierp_all', 'u35e21hpm/15.000', '', '', '']
            },
            'completed': {
                'Minecraft Sword': ['Grusierp_completed', 'u357rcyex/15.001', '', '', ''],
                'Muzyczne Nutki': ['Grusierp_completed', 'u357r4tw6/15.001', '', '', ''],
                'Piernikowa Chatka': ['Grusierp_completed', 'u357rg2hd/15.001', '', '', ''],
                'Pisanka Wielkanocna': ['Grusierp_completed', 'u35e21hpm/15.001', '', '', ''] // [*]
            },
            'empty': {
                'Legnicki gołąbek': ['Grusierp_empty', 'u35e26neh/15.001', '1KvU887pfqyJMbAdj_Wr0VTLdxIX1_ZkHLQYRQ3d1dmM', '', ''] // [*]
            }
        },
        'HiTechMD': {
            'all': {
                'October Pumpkin': ['HiTechMD_all', 'dqctwugjz/15.000', '', '', ''],
                'Rocket23': ['HiTechMD_all', 'dqf60rz1x/15.000', '1iPaL--7DiS4ToFEYgzYf8yJpcGnD613SrDnsk0JCrBA', '', ''],
                'Snowman - West Galloway': ['HiTechMD_all', 'dqcutr567/15.000', '', '', ''] // [*]
            },
            'completed': {
                'October Pumpkin': ['HiTechMD_completed', 'dqctwugjz/15.001', '', '', ''], // [*]
                'Snowman - West Galloway': ['HiTechMD_completed', 'dqcutr567/15.001', '', '', '']
            },
            'empty': {
                'Rocket23': ['HiTechMD_empty', 'dqf60rz1x/15.001', '1iPaL--7DiS4ToFEYgzYf8yJpcGnD613SrDnsk0JCrBA', '', ''] // [*]
            }
        },
        'jacobsedk': {
            'all': { // [*]
                'Randers Snowy': ['jacobsedk_all', 'u4p1j0qg2/15.000', '1oa0DPVju2G4_YkhAEpgozQQBcRpcTZeVaIUd1FYEtkA', '', ''],
                'Silkeborg Coat of Arms': ['jacobsedk_all', 'u1yz935ce/15.000', '', '', ''], // [*]
                'Silkeborg Hexagon': ['jacobsedk_all', 'u1yz91p0q/15.000', '', '', ''],
                'Silkeborg Mario': ['jacobsedk_all', 'u1yz3x8z1/15.000', '', '', ''],
                'Silkeborg Night Owl': ['jacobsedk_all', 'u1yz90x8u/15.000', '', '', ''],
                'Silkeborg Owl': ['jacobsedk_all', 'u1yz929gr/15.000', '', '', ''],
                'Silkeborg Rainbow Unicorn': ['jacobsedk_all', 'u1yz90pxh/15.000', '', '', '']
            },
            'completed': {
                'Silkeborg Coat of Arms': ['jacobsedk_completed', 'u1yz935ce/15.001', '', '', ''],
                'Silkeborg Hexagon': ['jacobsedk_completed', 'u1yz91p0q/15.001', '', '', ''],
                'Silkeborg Mario': ['jacobsedk_completed', 'u1yz3x8z1/15.001', '', '', ''], // [*]
                'Silkeborg Night Owl': ['jacobsedk_completed', 'u1yz90x8u/15.001', '', '', ''],
                'Silkeborg Owl': ['jacobsedk_completed', 'u1yz929gr/15.001', '', '', ''],
                'Silkeborg Rainbow Unicorn': ['jacobsedk_completed', 'u1yz90pxh/15.001', '', '', '']
            },
            'empty': {
                'Randers Snowy': ['jacobsedk_empty', 'u4p1j0qg2/15.001', '1oa0DPVju2G4_YkhAEpgozQQBcRpcTZeVaIUd1FYEtkA', '', ''] // [*]
            }
        },
        'Jeffeth': {
            'all': {
                'Adventures in Rockland': ['Jeffeth_all', 'f247p1fwh/15.000', '', '', ''], // Canada
                'Banana Bread': ['Jeffeth_all', 'f2469yxfs/15.000', '', '', ''], // Canada
                'Bread in Rockland': ['Jeffeth_all', 'f247pgbcs/15.000', '', '', ''], // Canada
                'Christmas in Ottawa': ['Jeffeth_all', 'f2469dret/15.000', '', '2112', 'Canada_ChristmasInOttawa'], // Canada
                'Claire`s Cake': ['Jeffeth_all', 'f247nuu26/15.000', '', '', ''], // Canada
                'Claire`s Candy Canes': ['Jeffeth_all', 'f247ndq30/15.000', '', '2011', 'Canada_ClairesCandyCanes'], // Canada
                'Elephriends': ['Jeffeth_all', 'f246dr30m/15.000', '', '', ''], // Canada
                'Halloween in Ottawa': ['Jeffeth_all', 'f246dqzzt/15.000', '', '2210', 'Canada_HalloweenInOttawa'], // Canada
                'Hospital Love': ['Jeffeth_all', 'f246f0k0b/15.000', '', '', ''], // Canada
                'Jeff`s Farm': ['Jeffeth_all', 'f246dz5s1/15.000', '', '', ''], // Canada
                'Jimmy`s Boat': ['Jeffeth_all', 'f247pv3tg/15.000', '', '', ''], // Canada
                'Jimmy`s Dog': ['Jeffeth_all', 'f241grtv1/15.000', '', '', ''], // Canada
                'Jimmy`s Rocket': ['Jeffeth_all', 'f247n7w4p/15.000', '', '', ''], // Canada
                'Jimmy`s Tractor': ['Jeffeth_all', 'f246vxw9k/15.000', '', '', ''], // Canada
                'Lizzy`s Elephant': ['Jeffeth_all', 'f247n6m7r/15.000', '', '', ''], // Canada
                'Lizzy`s Goldfish': ['Jeffeth_all', 'f247n3hv1/15.000', '', '', ''], // Canada
                'Lizzy`s Kitty': ['Jeffeth_all', 'f247pj9t1/15.000', '', '', ''], // Canada
                'Lizzy`s Unicorn': ['Jeffeth_all', 'f246dxcww/15.000', '', '', ''], // Canada
                'Marching Flats': ['Jeffeth_all', 'f247p7yfn/15.000', '', '', ''], // Canada
                'Munzball Machine': ['Jeffeth_all', 'f247pwy98/15.000', '', '2107', 'Canada_MunzballMachine'], // Canada
                'Munzee Drum Set': ['Jeffeth_all', 'f246d67y3/15.000', '', '', ''], // Canada
                'Munzee Guitar': ['Jeffeth_all', 'f246d1eun/15.000', '', '', ''], // Canada
                'Munzee Love': ['Jeffeth_all', 'f246uwk1x/15.000', '', '2202', 'Canada_MunzeeLove'], // Canada
                'Munzee Snowglobe': ['Jeffeth_all', 'f246gv5nv/15.000', '', '', ''], // Canada
                'Munzee Trumpet': ['Jeffeth_all', 'f246e5djy/15.000', '', '', ''], // Canada
                'Munzee Violin': ['Jeffeth_all', 'f246dgvh4/15.000', '', '', ''], // Canada
                'Mystery Boat': ['Jeffeth_all', 'f246dubv1/15.000', '', '', ''], // Canada
                'Mystery Keyboard': ['Jeffeth_all', 'f246ddyqk/15.000', '', '', ''], // Canada
                'Ottawa Cancer Ribbon': ['Jeffeth_all', 'f2469w9ut/15.000', '', '', ''], // Canada
                'Ottawa Cross': ['Jeffeth_all', 'f246dvryt/15.000', '', '', ''], // Canada
                'Ottawa Fireworks': ['Jeffeth_all', 'f246f3yj9/15.000', '', '', ''], // Canada
                'Ottawa Goldfish': ['Jeffeth_all', 'f2469ybkn/15.000', '', '', ''], // Canada
                'Ottawa Leprechaun': ['Jeffeth_all', 'f246fgx9e/15.000', '', '', ''], // Canada
                'Ottawa New Years': ['Jeffeth_all', 'f24697y7y/15.000', '', '', ''], // Canada
                'Ottawa Tornado': ['Jeffeth_all', 'f246gefs4/15.000', '', '', ''], // Canada
                'Rainbow Star': ['Jeffeth_all', 'f246un1w9/15.000', '', '', ''], // Canada
                'Rockland Easter Eggs': ['Jeffeth_all', 'f247nt1es/15.000', '', '', ''], // Canada
                'Rockland Tree': ['Jeffeth_all', 'f247nevxk/15.000', '', '', ''], // Canada
                'Rumball Machine': ['Jeffeth_all', 'f246ffb0f/15.000', '', '', ''], // Canada
                'Sandcastle Fun': ['Jeffeth_all', 'f246fhn3x/15.000', '', '', ''], // Canada
                'Save the Monarchs': ['Jeffeth_all', 'f246d5kdy/15.000', '', '', ''], // Canada
                'Secret Lantern': ['Jeffeth_all', 'f246dmm85/15.000', '', '', ''], // Canada
                'Secret Love': ['Jeffeth_all', 'f247n9916/15.000', '', '', ''], // Canada
                'Secret Valentine': ['Jeffeth_all', 'f247pk9h9/15.000', '', '2102', 'Canada_SecretValentine'], // Canada
                'Spring in Ottawa': ['Jeffeth_all', 'f2469zt39/15.000', '', '', ''], // Canada
                'Stanley for Dad': ['Jeffeth_all', 'f247phkyn/15.000', '', '', ''], // Canada
                'Summer in Ottawa': ['Jeffeth_all', 'f246ds0e9/15.000', '', '', ''], // Canada
                'The Secret Egg': ['Jeffeth_all', 'f246vjvy0/15.000', '', '', ''] // Canada
            },
            'GOTM': {
                'Christmas in Ottawa': ['Jeffeth_GOTM', 'f2469dret/15.001', '', '2112', 'Canada_ChristmasInOttawa'],
                'Claire`s Candy Canes': ['Jeffeth_GOTM', 'f247ndq30/15.001', '', '2011', 'Canada_ClairesCandyCanes'],
                'Halloween in Ottawa': ['Jeffeth_GOTM', 'f246dqzzt/15.001', '', '2210', 'Canada_HalloweenInOttawa'],
                'Munzball Machine': ['Jeffeth_GOTM', 'f247pwy98/15.001', '', '2107', 'Canada_MunzballMachine'],
                'Munzee Love': ['Jeffeth_GOTM', 'f246uwk1x/15.001', '', '2202', 'Canada_MunzeeLove'],
                'Save the Monarchs': ['Jeffeth_completed', 'f246d5kdy/15.001', '', '2305', 'Canada_SaveTheMonarchs'],
                'Secret Valentine': ['Jeffeth_GOTM', 'f247pk9h9/15.001', '', '2102', 'Canada_SecretValentine']
            },
            'completed': {
                'Adventures in Rockland': ['Jeffeth_completed', 'f247p1fwh/15.001', '', '', ''], // Canada
                'Banana Bread': ['Jeffeth_completed', 'f2469yxfs/15.001', '', '', ''], // Canada
                'Bread in Rockland': ['Jeffeth_completed', 'f247pgbcs/15.001', '', '', ''], // Canada
                'Claire`s Cake': ['Jeffeth_completed', 'f247nuu26/15.001', '', '', ''], // Canada
                'Elephriends': ['Jeffeth_completed', 'f246dr30m/15.001', '', '', ''], // Canada
                'Hospital Love': ['Jeffeth_completed', 'f246f0k0b/15.001', '', '', ''], // Canada
                'Jeff`s Farm': ['Jeffeth_completed', 'f246dz5s1/15.001', '', '', ''], // Canada
                'Jimmy`s Boat': ['Jeffeth_completed', 'f247pv3tg/15.001', '', '', ''], // Canada
                'Jimmy`s Dog': ['Jeffeth_completed', 'f241grtv1/15.001', '', '', ''], // Canada
                'Jimmy`s Rocket': ['Jeffeth_completed', 'f247n7w4p/15.001', '', '', ''], // Canada
                'Jimmy`s Tractor': ['Jeffeth_completed', 'f246vxw9k/15.001', '', '', ''], // Canada
                'Lizzy`s Elephant': ['Jeffeth_completed', 'f247n6m7r/15.001', '', '', ''], // Canada
                'Lizzy`s Goldfish': ['Jeffeth_completed', 'f247n3hv1/15.001', '', '', ''], // Canada
                'Lizzy`s Kitty': ['Jeffeth_completed', 'f247pj9t1/15.001', '', '', ''], // Canada
                'Lizzy`s Unicorn': ['Jeffeth_completed', 'f246dxcww/15.001', '', '', ''], // Canada
                'Marching Flats': ['Jeffeth_completed', 'f247p7yfn/15.001', '', '', ''], // Canada
                'Munzee Drum Set': ['Jeffeth_completed', 'f246d67y3/15.001', '', '', ''], // Canada
                'Munzee Guitar': ['Jeffeth_completed', 'f246d1eun/15.001', '', '', ''], // Canada
                'Munzee Snowglobe': ['Jeffeth_completed', 'f246gv5nv/15.001', '', '', ''], // Canada
                'Munzee Trumpet': ['Jeffeth_completed', 'f246e5djy/15.001', '', '', ''], // Canada
                'Munzee Violin': ['Jeffeth_completed', 'f246dgvh4/15.001', '', '', ''], // Canada
                'Mystery Boat': ['Jeffeth_completed', 'f246dubv1/15.001', '', '', ''], // Canada
                'Mystery Keyboard': ['Jeffeth_completed', 'f246ddyqk/15.001', '', '', ''], // Canada
                'Ottawa Cancer Ribbon': ['Jeffeth_completed', 'f2469w9ut/15.001', '', '', ''], // Canada
                'Ottawa Cross': ['Jeffeth_completed', 'f246dvryt/15.001', '', '', ''], // Canada
                'Ottawa Fireworks': ['Jeffeth_completed', 'f246f3yj9/15.001', '', '', ''], // Canada
                'Ottawa Goldfish': ['Jeffeth_completed', 'f2469ybkn/15.001', '', '', ''], // Canada
                'Ottawa Leprechaun': ['Jeffeth_completed', 'f246fgx9e/15.001', '', '', ''], // Canada
                'Ottawa New Years': ['Jeffeth_completed', 'f24697y7y/15.001', '', '', ''], // Canada
                'Ottawa Tornado': ['Jeffeth_completed', 'f246gefs4/15.001', '', '', ''], // Canada
                'Rainbow Star': ['Jeffeth_completed', 'f246un1w9/15.001', '', '', ''], // Canada
                'Rockland Easter Eggs': ['Jeffeth_completed', 'f247nt1es/15.001', '', '', ''], // Canada
                'Rockland Tree': ['Jeffeth_completed', 'f247nevxk/15.001', '', '', ''], // Canada
                'Rumball Machine': ['Jeffeth_completed', 'f246ffb0f/15.001', '', '', ''], // Canada
                'Sandcastle Fun': ['Jeffeth_completed', 'f246fhn3x/15.001', '', '', ''], // Canada
                'Secret Lantern': ['Jeffeth_completed', 'f246dmm85/15.001', '', '', ''], // Canada
                'Secret Love': ['Jeffeth_completed', 'f247n9916/15.001', '', '', ''], // Canada
                'Spring in Ottawa': ['Jeffeth_completed', 'f2469zt39/15.001', '', '', ''], // Canada
                'Stanley for Dad': ['Jeffeth_completed', 'f247phkyn/15.001', '', '', ''], // Canada
                'Summer in Ottawa': ['Jeffeth_completed', 'f246ds0e9/15.001', '', '', ''], // Canada
                'The Secret Egg': ['Jeffeth_completed', 'f246vjvy0/15.001', '', '', ''] // Canada
            }
        },
        'Jesnou': {
            'all': {
                '7th Birthday': ['Jesnou_all', 'ud9y9snw2/15.0001', '', '1907', 'Finland_7thBirthday'],
                'Crazy Ghost': ['Jesnou_all', 'udf3cy0um/15.0001', '', '', ''],
                'Easter Bunny': ['Jesnou_all', 'ud9wqgnsc/15.0001', '', '', ''],
                'Flag of Finland': ['Jesnou_all', 'ue5ttrjsm/15.0001', '', '', ''],
                'Helsinki Colour': ['Jesnou_all', 'ud9y2q5jc/15.0001', '', '2001', 'Finland_HelsinkiColour'], // [*]
                'Kuopio Surprise Trail': ['Jesnou_all', 'ue5tv9qhb/15.0001', '', '', ''],
                'Mermaid': ['Jesnou_all', 'ud9wk45jn/15.0001', '', '', ''],
                'mUnZee10 Birthday': ['Jesnou_all', 'ud9wz1kgz/15.0001', '', '', ''],
                'Reksun Trail': ['Jesnou_all', 'udf4xem0k/15.0001', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1826328061&range=A1:E3', '', ''],
                'Xmas Stocking': ['Jesnou_all', 'ud9y8yqyr/15.0001', '', '', '']
            },
            'GOTM': {
                '7th Birthday': ['Jesnou_GOTM', 'ud9y9snw2/15.0011', '', '1907', 'Finland_7thBirthday'], // [*]
                'Helsinki Colour': ['Jesnou_GOTM', 'ud9y2q5jc/15.0011', '', '2001', 'Finland_HelsinkiColour']
            },
            'completed': {
                'Crazy Ghost': ['Jesnou_completed', 'udf3cy0um/15.0011', '', '', ''],
                'Easter Bunny': ['Jesnou_completed', 'ud9wqgnsc/15.0011', '', '', ''], // [*]
                'Flag of Finland': ['Jesnou_completed', 'ue5ttrjsm/15.0011', '', '', ''],
                'Kuopio Surprise Trail': ['Jesnou_completed', 'ue5tv9qhb/15.0011', '', '', ''],
                'Mermaid': ['Jesnou_completed', 'ud9wk45jn/15.0011', '', '', ''],
                'mUnZee10 Birthday': ['Jesnou_completed', 'ud9wz1kgz/15.0011', '', '', ''],
                'Xmas Stocking': ['Jesnou_completed', 'ud9y8yqyr/15.0011', '', '', '']
            },
            'empty': {
                'Reksun Trail': ['Jesnou_empty', 'udf4xem0k/15.0011', '1LIUGVwaI4VvoUaCZ7Y9SFQurc7W_0LwHdmFbkzZIF6o/edit#gid=1826328061&range=A1:E3', '', ''] // [*]
            }
        },
        'katinka3': {
            'all': {
                'Christmas Candle': ['katinka3_all', 'ue27jfsgj/15.000', '', '', ''], // [*]
                'Hyvinkään lumihiutale': ['katinka3_all', 'udc8uew15/15.000', '', '', ''],
                'Juna jyskyttää': ['katinka3_all', 'ue27nsdt9/15.000', '', '', ''],
                'Kokkola': ['katinka3_all', 'ue27jz0bs/15.000', '', '', ''],
                'Kokkolan asepuisto': ['katinka3_all', 'ue27ny4r1/15.000', '', '', ''],
                'Kokkolan kurpitsainen': ['katinka3_all', 'ue27mb89n/15.000', '', '', ''],
                'Meritullin evopuisto': ['katinka3_all', 'ued1g7h9x/15.000', '1zuyTEdtun2JqhC7kxGRsS4fLzSU8-60j4LaUwOOXobk', '', ''],
                'Suomi100': ['katinka3_all', 'ue27r01dg/15.000', '', '', '']
            },
            'completed': {
                'Christmas Candle': ['katinka3_completed', 'ue27jfsgj/15.001', '', '', ''],
                'Hyvinkään lumihiutale': ['katinka3_completed', 'udc8uew15/15.001', '', '', ''],
                'Juna jyskyttää': ['katinka3_completed', 'ue27nsdt9/15.001', '', '', ''],
                'Kokkola': ['katinka3_completed', 'ue27jz0bs/15.001', '', '', ''],
                'Kokkolan asepuisto': ['katinka3_completed', 'ue27ny4r1/15.001', '', '', ''],
                'Kokkolan kurpitsainen': ['katinka3_completed', 'ue27mb89n/15.001', '', '', ''], // [*]
                'Suomi100': ['katinka3_completed', 'ue27r01dg/15.001', '', '', '']
            },
            'empty': {
                'Meritullin evopuisto': ['katinka3_empty', 'ued1g7h9x/15.001', '1zuyTEdtun2JqhC7kxGRsS4fLzSU8-60j4LaUwOOXobk', '', ''] // [*]
            }
        },
        'kepke3': {
            'all': {
                'BB Train': ['kepke3_all', 'u2ttk0jmm/15.0001', '', '', ''],
                'Bike Kolónka': ['kepke3_all', 'u2trqke30/15.0001', '', '', ''],
                'Crazy Frog': ['kepke3_all', 'u2trqbknm/15.0001', '', '', ''], // [*]
                'Flora Orientalis in Ždiar': ['kepke3_all', 'u2y2m191d/15.0001', '', '', ''],
                'Key to the Happiness': ['kepke3_all', 'u2tmv8cqk/15.0001', '1QDKLuJ7YS9i2ijH50CrZvoivZnDR5wVhOMbyk8oPxM4', '', ''],
                'Little Owl in Rožňava': ['kepke3_all', 'u2wsg4kkz/15.0001', '', '', ''],
                'Train Martin': ['kepke3_all', 'u2trn7vez/15.0001', '', '', ''],
                'Trpaslík :: Gnomie Vrútky': ['kepke3_all', 'u2trqesyc/15.0001', '', '2107', 'Slovakia_TrpaslikGnomieVrutky'],
                'Void pin Vrútky': ['kepke3_all', 'u2trqv03k/15.0001', '1WBF6pKlaFkEvN5KboWCw7XN_vw1FnhFZbylaVMkkLPA', '', '']
            },
            'GOTM': {
                'Trpaslík :: Gnomie Vrútky': ['kepke3_GOTM', 'u2trqesyc/15.0011', '', '2107', 'Slovakia_TrpaslikGnomieVrutky'] // [*]
            },
            'completed': {
                'BB Train': ['kepke3_completed', 'u2ttk0jmm/15.0011', '', '', ''],
                'Bike Kolónka': ['kepke3_completed', 'u2trqke30/15.0011', '', '', ''],
                'Crazy Frog': ['kepke3_completed', 'u2trqbknm/15.0011', '', '', ''],
                'Flora Orientalis in Ždiar': ['kepke3_completed', 'u2y2m191d/15.0011', '', '', ''], // [*]
                'Little Owl in Rožňava': ['kepke3_completed', 'u2wsg4kkz/15.0011', '', '', ''],
                'Train Martin': ['kepke3_completed', 'u2trn7vez/15.0011', '', '', '']
            },
            'empty': {
                'Key to the Happiness': ['kepke3_empty', 'u2tmv8cqk/15.0011', '1QDKLuJ7YS9i2ijH50CrZvoivZnDR5wVhOMbyk8oPxM4', '', ''],
                'Void pin Vrútky': ['kepke3_empty', 'u2trqv03k/15.0011', '1WBF6pKlaFkEvN5KboWCw7XN_vw1FnhFZbylaVMkkLPA', '', ''] // [*]
            }
        },
        'knotmunz': {
            'all': {
                'Bundtini Trail': ['knotmunz_all', '9vf6q2m4e/15.0003', '', '', ''],
                'Hey Cup Cake!': ['knotmunz_all', '9vf6qdvv2/15.0003', '', '', ''],
                'Jewel of a Heart': ['knotmunz_all', '9vf6q7snp/15.0003', '', '', ''], // [*]
                'Julbock': ['knotmunz_all', '9v6tc48md/15.0003', '', '', ''],
                'Lets Talk A-bundt Love': ['knotmunz_all', '9vf6q88ed/15.0003', '', '', ''],
                'Tied up in Knotz in Round Rock': ['knotmunz_all', '9v6tbuxnn/15.0003', '1zuJL1OfsnYgzGr8CS3Cck2SQDetTwnViCLcZP3kcpIs', '', '']
            },
            'completed': {
                'Bundtini Trail': ['knotmunz_completed', '9vf6q2m4e/15.0013', '', '', ''],
                'Hey Cup Cake!': ['knotmunz_completed', '9vf6qdvv2/15.0013', '', '', ''],
                'Jewel of a Heart': ['knotmunz_completed', '9vf6q7snp/15.0013', '', '', ''],
                'Julbock': ['knotmunz_completed', '9v6tc48md/15.0013', '', '', ''],
                'Lets Talk A-bundt Love': ['knotmunz_completed', '9vf6q88ed/15.0013', '', '', ''] // [*]
            },
            'empty': {
                'Tied up in Knotz in Round Rock': ['knotmunz_empty', '9v6tbuxnn/15.0013', '1zuJL1OfsnYgzGr8CS3Cck2SQDetTwnViCLcZP3kcpIs', '', ''] // [*]
            }
        },
        'Laczy76': {
            'all': {
                'Flower at Fort Monostor': ['Laczy76_all', 'u2kzeueyv/15.000', '', '2005', 'Hungary_FlowerAtFortMonostor'], // [*]
                'Ladybug': ['Laczy76_all', 'u2kzsw0xu/15.000', '', '2007', 'Slovakia_Ladybug'],
                'Surprise in Budapest': ['Laczy76_all', 'u2mw18ymw/15.000', '', '', '']
            },
            'GOTM': {
                'Flower at Fort Monostor': ['Laczy76_GOTM', 'u2kzeueyv/15.001', '', '2005', 'Hungary_FlowerAtFortMonostor'],
                'Ladybug': ['Laczy76_GOTM', 'u2kzsw0xu/15.001', '', '2007', 'Slovakia_Ladybug'] // [*]
            },
            'completed': {
                'Surprise in Budapest': ['Laczy76_completed', 'u2mw18ymw/15.001', '', '', ''] // [*]
            }
        },
        'Lissu': {
            'all': {
                'Ideapark and Realpark': ['Lissu_all', 'udbvje7hu/15.000', '1zkDItKXQMg1A56Itb888VH9ICUiFCkn3GnqdeOix3sQ', '', ''],
                'Kalevankankaan sydän': ['Lissu_all', 'udbvv69k1/15.000', '', '', ''],
                'Kukkapuisto': ['Lissu_all', 'udbvv7158/15.000', '1c3sjAVuZ1foqW-eDDp-7XJpFKit7z1pXhedmLeEsxQs', '', ''],
                'Tappara': ['Lissu_all', 'udbvvgyd8/15.000', '19XoMcx8DoNJzlWsRcxqdaWH1eZZITqrGkhcJQO6B278', '', ''] // [*]
            },
            'completed': {
                'Kalevankankaan sydän': ['Lissu_completed', 'udbvv69k1/15.001', '', '', ''] // [*]
            },
            'empty': {
                'Ideapark and Realpark': ['Lissu_empty', 'udbvje7hu/15.001', '1zkDItKXQMg1A56Itb888VH9ICUiFCkn3GnqdeOix3sQ', '', ''],
                'Kukkapuisto': ['Lissu_empty', 'udbvv7158/15.001', '1c3sjAVuZ1foqW-eDDp-7XJpFKit7z1pXhedmLeEsxQs', '', ''], // [*]
                'Tappara': ['Lissu_empty', 'udbvvgyd8/15.001', '19XoMcx8DoNJzlWsRcxqdaWH1eZZITqrGkhcJQO6B278', '', '']
            }
        },
        'llamah': {
            'empty': {
                'Altoona Evos': ['llamah_empty', '9zmsbkdmd/15.0011', '10Qe_IOxfh9SzZmqDBqWVTHNbfxPYuA-0i1tuykdOC2o', '', ''],
                'DSM Halloween Witch': ['llamah_empty', '9zmkmud77/15.0011', '1Z2gg91m-iCidadfBoLRvN7DpE16bpsQXwwkvU-_EB6I', '', ''],
                'West Des Moines Pac Man': ['llamah_empty', '9zmk6nyww/15.0011', '1MkElqI5MUYQvvXxhKV0f4aWdOMZc35EVOlFNDZ6avKk', '', ''], // [*]
                'West Des Moines Shark': ['llamah_empty', '9zmk6hw2m/15.0011', '1Wc-tWKKiNJbgcAtwyMZkoOgYTIjkcowb4QInou1E3NQ', '', ''],
                'West Des Moines Strawberry': ['llamah_empty', '9zmk65e9v/15.0011', '11ElTupqSSPj0pXyhWV26fuNlJmxR6o-Dsz-mFpUfRME', '', '']
            }
        },
        'Lumen': {
            'all': {
                'My World': ['Lumen_all', 'u3h4g4ngg/15.000', '', '', ''], // [*]
                'No i Gitara!': ['Lumen_all', 'u3h4u34bc/15.000', '', '', ''],
                'PacMunzee': ['Lumen_all', 'u3h4uc3fn/15.000', '1Uv1kI2-qpMQ9jTCz3-NYgPrle2v--Brm07lEikFcW-o', '', ''],
                'Welonka': ['Lumen_all', 'u3h4ese4q/15.000', '', '', ''],
                'Wro Tram': ['Lumen_all', 'u3h4fdu03/15.000', '', '', '']
            },
            'completed': {
                'My World': ['Lumen_completed', 'u3h4g4ngg/15.001', '', '', ''],
                'No i Gitara!': ['Lumen_completed', 'u3h4u34bc/15.001', '', '', ''],
                'Welonka': ['Lumen_completed', 'u3h4ese4q/15.001', '', '', ''], // [*]
                'Wro Tram': ['Lumen_completed', 'u3h4fdu03/15.001', '', '', '']
            },
            'empty': {
                'PacMunzee': ['Lumen_empty', 'u3h4uc3fn/15.001', '1Uv1kI2-qpMQ9jTCz3-NYgPrle2v--Brm07lEikFcW-o', '', ''] // [*]
            }
        },
        'Maattmoo': {
            'all': {
                'Faversham Crossbow': ['Maattmoo_all', 'u10eukvbt/15.000', '', '', ''],
                'Faversham Father Xmas': ['Maattmoo_all', 'u10eumg3f/15.000', '', '', ''],
                'Help for Hingham': ['Maattmoo_all', 'u12en7fnd/15.000', '1YEL4efPszEmguM3XORlhbS4cbwtzL-5pSPlRkECRNyU', '', ''],
                'Love Lane Patchwork': ['Maattmoo_all', 'u10eus8mg/15.000', '18tlb5bq13V3YcxaGaAyu1ZG9LG_4lCOlf7WOKOHUvPA', '', ''],
                'Maattmoo`s Moo': ['Maattmoo_all', 'u10s42d6w/15.000', '', '', ''], // [*]
                'Sunny Rainbow': ['Maattmoo_all', 'u10s19euj/15.000', '', '', ''],
                'Xmas Knole Deer': ['Maattmoo_all', 'u105sdvy2/15.000', '', '2012', 'UnitedKingdom_XmasKnoleDeer']
            },
            'GOTM': { // [*]
                'Xmas Knole Deer': ['Maattmoo_GOTM', 'u105sdvy2/15.001', '', '2012', 'UnitedKingdom_XmasKnoleDeer'] // [*]
            },
            'completed': {
                'Faversham Crossbow': ['Maattmoo_completed', 'u10eukvbt/15.001', '', '', ''],
                'Faversham Father Xmas': ['Maattmoo_completed', 'u10eumg3f/15.001', '', '', ''], // [*]
                'Maattmoo`s Moo': ['Maattmoo_completed', 'u10s42d6w/15.001', '', '', ''],
                'Sunny Rainbow': ['Maattmoo_completed', 'u10s19euj/15.001', '', '', '']
            },
            'empty': {
                'Help for Hingham': ['Maattmoo_empty', 'u12en7fnd/15.001', '1YEL4efPszEmguM3XORlhbS4cbwtzL-5pSPlRkECRNyU', '', ''],
                'Love Lane Patchwork': ['Maattmoo_empty', 'u10eus8mg/15.001', '18tlb5bq13V3YcxaGaAyu1ZG9LG_4lCOlf7WOKOHUvPA', '', ''] // [*]
            }
        },
        'malof': {
            'all': {
                'Flat Holm, Larsmo': ['malof_all', 'ue24tw51e/15.000', '1UOjaA5hS5qB8s5yQHb7Ah7aTDSkxCC0NcsWBtoAc2Dk', '', ''],
                'Jeppis': ['malof_all', 'ue24k0dbq/15.000', '151EoTkql5MBXsjI6Ret6DEMy1CCbNQQX3kmcEDplKo0', '', ''],
                'Solros Jakobstad': ['malof_all', 'ue24huudj/15.000', '1SGoymkmBRsPbYh_uGEXo4DTxyFs7zCLZVKSi6Zb4Alc', '', ''],
                'Kokkola Clown': ['malof_all', 'ue27n5x3j/15.000', '', '', ''],
                'Kokkola Surprise': ['malof_all', 'ue27jvu38/15.000', '', '', ''],
                'Kokkola Virtual Sapphire': ['malof_all', 'ue27njxxh/15.000', '', '', ''],
                'Kokkolan Vaakuna': ['malof_all', 'ue27pnc37/15.000', '', '', ''] // [*]
            },
            'completed': {
                'Kokkola Clown': ['malof_completed', 'ue27n5x3j/15.001', '', '', ''], // [*]
                'Kokkola Surprise': ['malof_completed', 'ue27jvu38/15.001', '', '', ''],
                'Kokkola Virtual Sapphire': ['malof_completed', 'ue27njxxh/15.001', '', '', ''],
                'Kokkolan Vaakuna': ['malof_completed', 'ue27pnc37/15.001', '', '', '']
            },
            'empty': {
                'Flat Holm, Larsmo': ['malof_empty', 'ue24tw51e/15.001', '1UOjaA5hS5qB8s5yQHb7Ah7aTDSkxCC0NcsWBtoAc2Dk', '', ''],
                'Jeppis': ['malof_empty', 'ue24k0dbq/15.001', '151EoTkql5MBXsjI6Ret6DEMy1CCbNQQX3kmcEDplKo0', '', ''], // [*]
                'Solros Jakobstad': ['malof_empty', 'ue24huudj/15.001', '1SGoymkmBRsPbYh_uGEXo4DTxyFs7zCLZVKSi6Zb4Alc', '', '']
            }
        },
        'mandello': {
            'all': {
                '7th Birthday': ['mandello_all', 'ud9y9snw2/15.0004', '', '1907', 'Finland_7thBirthday'],
                'Espoon vaakuna Herald of Espoo': ['mandello_all', 'ud9w7f5gq/15.0004', '', '', ''],
                'Espoon vaakuna Herald of Espoo (Flats)': ['mandello_all', 'ud9w7f5gq/15.0004009', '1qs-96z6Pm46aOHJ8fAn3r_nzzJSJ76d-0lw-VsXtnPo/edit#gid=863805160&range=A1', '', ''],
                'Helsinki Colour': ['mandello_all', 'ud9y2q5jc/15.0004', '', '2001', 'Finland_HelsinkiColour'], // [*]
                'Mermaid': ['mandello_all', 'ud9wk45jn/15.0004', '', '', ''],
                'mUnZee10 Birthday': ['mandello_all', 'ud9wz1kgz/15.0004', '', '', ''],
                'Olari evo': ['mandello_all', 'ud9w6gkqp/15.0004', '1n8oUrfy2DqdMcH5ihJhC_NfTgj-S8CVTKhHd6kJS9Qo', '', ''],
                'Turvesuon Puisto': ['mandello_all', 'ud9w7vj28/15.0004', '1FFXXZPbhXSBezTaIKUfRQuyo6xaZnQlSzNMP8wDMhgU', '', ''],
                'Xmas Stocking': ['mandello_all', 'ud9y8yqyr/15.0004', '', '', '']
            },
            'GOTM': {
                '7th Birthday': ['mandello_GOTM', 'ud9y9snw2/15.0014', '', '1907', 'Finland_7thBirthday'], // [*]
                'Helsinki Colour': ['mandello_GOTM', 'ud9y2q5jc/15.0014', '', '2001', 'Finland_HelsinkiColour']
            },
            'completed': {
                'Espoon vaakuna Herald of Espoo': ['mandello_completed', 'ud9w7f5gq/15.0014', '', '', ''], // [*]
                'Mermaid': ['mandello_completed', 'ud9wk45jn/15.0014', '', '', ''],
                'mUnZee10 Birthday': ['mandello_completed', 'ud9wz1kgz/15.0014', '', '', ''],
                'Xmas Stocking': ['mandello_completed', 'ud9y8yqyr/15.0014', '', '', '']
            },
            'empty': {
                'Espoon vaakuna Herald of Espoo (Flats)': ['mandello_empty', 'ud9w7f5gq/15.0014009', '1qs-96z6Pm46aOHJ8fAn3r_nzzJSJ76d-0lw-VsXtnPo/edit#gid=863805160&range=A1', '', ''], // [*]
                'Olari evo': ['mandello_empty', 'ud9w6gkqp/15.0014', '1n8oUrfy2DqdMcH5ihJhC_NfTgj-S8CVTKhHd6kJS9Qo', '', ''],
                'Turvesuon Puisto': ['mandello_empty', 'ud9w7vj28/15.0014', '1FFXXZPbhXSBezTaIKUfRQuyo6xaZnQlSzNMP8wDMhgU', '', '']
            }
        },
        'markayla': {
            'all': {
                'CF Pumpkin': ['markayla_all', '9zw3b0pd4/15.000', '1RWBmeFYaQOMbyiADiP1d7vAoXM1uQnmhC6UEOoR89hU', '', ''],
                'Marion': ['markayla_all', '9zqz5cxxw/15.000', '', '', ''],
                'Marion 4 Leaf Clover': ['markayla_all', '9zqz5c5fx/15.000', '', '', ''], // [*]
                'O` Christmas Tree': ['markayla_all', '9zqz5dsj1/15.000', '', '2112', 'USA_OChristmasTree'],
                'Popcorn': ['markayla_all', '9zqz553b0/15.000', '151TcN_THK90rRR_qCXBDDTIVRc_3wvJX95V3t4bdkXk', '', '']
            },
            'GOTM': {
                'O` Christmas Tree': ['markayla_GOTM', '9zqz5dsj1/15.001', '', '2112', 'USA_OChristmasTree'] // [*]
            },
            'completed': {
                'Marion': ['markayla_completed', '9zqz5cxxw/15.001', '', '', ''], // [*]
                'Marion 4 Leaf Clover': ['markayla_completed', '9zqz5c5fx/15.001', '', '', '']
            },
            'empty': {
                'CF Pumpkin': ['markayla_empty', '9zw3b0pd4/15.001', '1RWBmeFYaQOMbyiADiP1d7vAoXM1uQnmhC6UEOoR89hU', '', ''], // [*]
                'Popcorn': ['markayla_empty', '9zqz553b0/15.001', '151TcN_THK90rRR_qCXBDDTIVRc_3wvJX95V3t4bdkXk', '', '']
            }
        },
        'Marnic': {
            'all': {
                'Amsterdam Surprise2': ['Marnic_all', 'u173wm04m/15.000', '', '', ''],
                'Crossbows Beeckestijn': ['Marnic_all', 'u1763sspe/15.000', '', '', ''],
                'Evolution Beeckestijn': ['Marnic_all', 'u1763u3rj/15.000', '', '', ''],
                'Lucky Clover': ['Marnic_all', 'u1763sv5g/15.000', '', '', ''], // [*]
                'QR-Spaarnwoude': ['Marnic_all', 'u1766fj3h/15.000', '', '', ''],
                'Unicorn Hoorn': ['Marnic_all', 'u17e6nn5m/15.000', '1bVwmR6jk0aJXplng_fHQZx7gV7heITyWYkCSHDy67UQ', '', '']
            },
            'completed': {
                'Amsterdam Surprise2': ['Marnic_completed', 'u173wm04m/15.001', '', '', ''],
                'Crossbows Beeckestijn': ['Marnic_completed', 'u1763sspe/15.001', '', '', ''],
                'Evolution Beeckestijn': ['Marnic_completed', 'u1763u3rj/15.001', '', '', ''],
                'Lucky Clover': ['Marnic_completed', 'u1763sv5g/15.001', '', '', ''],
                'QR-Spaarnwoude': ['Marnic_completed', 'u1766fj3h/15.001', '', '', ''] // [*]
            },
            'empty': {
                'Unicorn Hoorn': ['Marnic_empty', 'u17e6nn5m/15.001', '1bVwmR6jk0aJXplng_fHQZx7gV7heITyWYkCSHDy67UQ', '', ''] // [*]
            }
        },
        'MetteS': {
            'all': {
                'Nessie in Grenaa': ['MetteS_all', 'u4pbbjhsw/15.0001', '', '2203', 'Denmark_NessieInGrenaa'],
                'Randers Regnskov': ['MetteS_all', 'u4p1hxjdu/15.0001', '1vsABF-BXl3GnpCfirs6VI0lN-sPt-Ijb7tTat_gXR7U', '', ''],
                'True Forest Fish': ['MetteS_all', 'u1zptc9xn/15.0001', '', '', ''], // [*]
                'True Forest Surprise': ['MetteS_all', 'u1zpw1bck/15.0001', '', '', '']
            },
            'GOTM': {
                'Nessie in Grenaa': ['MetteS_GOTM', 'u4pbbjhsw/15.0011', '', '2203', 'Denmark_NessieInGrenaa'] // [*]
            },
            'completed': {
                'True Forest Fish': ['MetteS_completed', 'u1zptc9xn/15.0011', '', '', ''],
                'True Forest Surprise': ['MetteS_completed', 'u1zpw1bck/15.0011', '', '', ''] // [*]
            },
            'empty': {
                'Randers Regnskov': ['MetteS_empty', 'u4p1hxjdu/15.0011', '1vsABF-BXl3GnpCfirs6VI0lN-sPt-Ijb7tTat_gXR7U', '', ''] // [*]
            }
        },
        'Mon4ikaCriss': {
            'all': {
                'Chick, Vrútky': ['Mon4ikaCriss_all', 'u2trqswgh/15.0002', '', '', ''], // [*]
                'Crazy Frog': ['Mon4ikaCriss_all', 'u2trqbknm/15.0002', '', '', ''],
                'Trpaslík :: Gnomie Vrútky': ['Mon4ikaCriss_all', 'u2trqesyc/15.0002', '', '2107', 'Slovakia_TrpaslikGnomieVrutky']
            },
            'GOTM': {
                'Trpaslík :: Gnomie Vrútky': ['Mon4ikaCriss_GOTM', 'u2trqesyc/15.0012', '', '2107', 'Slovakia_TrpaslikGnomieVrutky'] // [*]
            },
            'completed': {
                'Chick, Vrútky': ['Mon4ikaCriss_completed', 'u2trqswgh/15.0012', '', '', ''],
                'Crazy Frog': ['Mon4ikaCriss_completed', 'u2trqbknm/15.0012', '', '', ''] // [*]
            }
        },
        'Neesu': {
            'all': {
                '7th Birthday': ['Neesu_all', 'ud9y9snw2/15.0002', '', '1907', 'Finland_7thBirthday'], // [*]
                'Easter Bunny': ['Neesu_all', 'ud9wqgnsc/15.0002', '', '', ''],
                'Evolution Field': ['Neesu_all', 'ud9wrdhs8/15.0002', '1WPgjj8Jir64XXPIDTKH8XDtpEvA3yPFzbjW_J80K2U8', '', ''],
                'Helsinki Colour': ['Neesu_all', 'ud9y2q5jc/15.0002', '', '2001', 'Finland_HelsinkiColour'],
                'Mermaid': ['Neesu_all', 'ud9wk45jn/15.0002', '', '', ''],
                'mUnZee10 Birthday': ['Neesu_all', 'ud9wz1kgz/15.0002', '', '', ''],
                'Xmas Stocking': ['Neesu_all', 'ud9y8yqyr/15.0002', '', '', '']
            },
            'GOTM': {
                '7th Birthday': ['Neesu_GOTM', 'ud9y9snw2/15.0012', '', '1907', 'Finland_7thBirthday'],
                'Helsinki Colour': ['Neesu_GOTM', 'ud9y2q5jc/15.0012', '', '2001', 'Finland_HelsinkiColour'] // [*]
            },
            'completed': {
                'Easter Bunny': ['Neesu_completed', 'ud9wqgnsc/15.0012', '', '', ''],
                'Mermaid': ['Neesu_completed', 'ud9wk45jn/15.0012', '', '', ''], // [*]
                'mUnZee10 Birthday': ['Neesu_completed', 'ud9wz1kgz/15.0012', '', '', ''],
                'Xmas Stocking': ['Neesu_completed', 'ud9y8yqyr/15.0012', '', '', '']
            },
            'empty': {
                'Evolution Field': ['Neesu_empty', 'ud9wrdhs8/15.0012', '1WPgjj8Jir64XXPIDTKH8XDtpEvA3yPFzbjW_J80K2U8', '', ''] // [*]
            }
        },
        'Neloras': {
            'all': {
                '1st Day Evo': ['Neloras_all', 'u2s1v068r/15.0001', '', '', ''],
                'Alfred Wetzler Mini Flat': ['Neloras_all', 'u2s1ywfxk/15.0001', '', '', ''],
                'Bosnia Flag in Bratislava': ['Neloras_all', 'u2s1yrt3z/15.0001', '', '', ''],
                'Chilli Killer': ['Neloras_all', 'u2s1yptfq/15.0001', '1zl82l1o9AL3OJQoczvnjO8XLxrMnmrPwaClohQUQQf8', '', ''],
                'Folk CrossBow': ['Neloras_all', 'u2s4jcj5k/15.0001', '', '2102', 'Slovakia_FolkCrossBow'],
                'Fortress Maze Party': ['Neloras_all', 'u2s1vzfpn/15.0001', '1uFeynxkjT8AuMv-jG68bQmBaLuoabEL5aBdJJXUNFCE', '', ''],
                'Hungry Bat Terry': ['Neloras_all', 'u2s1yt9t7/15.0001', '', '2210', 'Slovakia_HungryBatTerry'],
                'Icemen in love': ['Neloras_all', 'u2s1yzv55/15.0001', '', '2212', 'Slovakia_IcemenInLove'],
                'Japanse Maple': ['Neloras_all', 'srxw6nrvg/15.0001', '', '', ''],
                'Jewels Note': ['Neloras_all', 'u2s1zefpc/15.0001', '', '2010', 'Slovakia_JewelsNote'],
                'Lake Lighthouse Painting': ['Neloras_all', 'u2s1yq0c2/15.0001', '1uPcuR_pfgSrZkRT_vobeQT5WyA9cA77whn_SjFSFfPM', '', ''],
                'Panonska Jezera Tuzla': ['Neloras_all', 'srvm35ezk/15.0001', '1sfoLteib7UBRWSjfHjg5SQNn-DCy8U7Df5SkjNhZn30', '', '']
            },
            'GOTM': {
                'Folk CrossBow': ['Neloras_GOTM', 'u2s4jcj5k/15.0011', '', '2102', 'Slovakia_FolkCrossBow'],
                'Hungry Bat Terry': ['Neloras_GOTM', 'u2s1yt9t7/15.0011', '', '2210', 'Slovakia_HungryBatTerry'],
                'Icemen in love': ['Neloras_GOTM', 'u2s1yzv55/15.0011', '', '2212', 'Slovakia_IcemenInLove'],
                'Jewels Note': ['Neloras_GOTM', 'u2s1zefpc/15.0011', '', '2010', 'Slovakia_JewelsNote'] // [*]
            },
            'completed': {
                '1st Day Evo': ['Neloras_completed', 'u2s1v068r/15.0011', '', '', ''], // [*]
                'Alfred Wetzler Mini Flat': ['Neloras_completed', 'u2s1ywfxk/15.0011', '', '', ''],
                'Bosnia Flag in Bratislava': ['Neloras_completed', 'u2s1yrt3z/15.0011', '', '', ''],
                'Japanse Maple': ['Neloras_completed', 'srxw6nrvg/15.0011', '', '', '']
            },
            'empty': {
                'Chilli Killer': ['Neloras_empty', 'u2s1yptfq/15.0011', '1zl82l1o9AL3OJQoczvnjO8XLxrMnmrPwaClohQUQQf8', '', ''],
                'Fortress Maze Party': ['Neloras_empty', 'u2s1vzfpn/15.0011', '1uFeynxkjT8AuMv-jG68bQmBaLuoabEL5aBdJJXUNFCE', '', ''], // [*]
                'Lake Lighthouse Painting': ['Neloras_empty', 'u2s1yq0c2/15.0011', '1uPcuR_pfgSrZkRT_vobeQT5WyA9cA77whn_SjFSFfPM', '', ''],
                'Panonska Jezera Tuzla': ['Neloras_empty', 'srvm35ezk/15.0011', '1sfoLteib7UBRWSjfHjg5SQNn-DCy8U7Df5SkjNhZn30', '', '']
            }
        },
        'NikitaStolk': {
            'completed': {
                'Groene Stroom': ['NikitaStolk_completed', 'u1khdnhch/15.0011', '', '', ''],
                'Klomp': ['NikitaStolk_completed', 'u1kh9ggr7/15.0011', '', '', ''],
                'Pompeblêd Palet': ['NikitaStolk_completed', 'u1khd5y3q/15.0011', '', '', ''], // [*]
                'Tea at Grandma': ['NikitaStolk_completed', 'u1kh9uc8m/15.0011', '', '', ''],
                'The Wall': ['NikitaStolk_completed', 'u1kh9upnp/15.0011', '', '', '']
            }
        },
        'NoahCache': {
            'all': {
                'Are you X-Zee-perienced': ['NoahCache_all', 'u0weber3n/15.0002', '102QHEKr1_eHzeED1o26_qgWUMfDFC7S_rwAYsQRQyA8', '', ''],
                'Flats @ Appenzeller RT': ['NoahCache_all', 'u0wecspcn/15.0002', '1M-9WjrBwHgMI7UEQybxwY9m5QzD-xlodk_m6EeZiFSc', '', ''],
                'Mixed Garden RT': ['NoahCache_all', 'u0weck999/15.0002', '', '', ''],
                'Ringo - the Fab 4': ['NoahCache_all', 'u0w7yn1s8/15.0002', '1iljO6wikjSvOBmfUp4Qt9bxKCe9wSDheoMkYEVfyUn0', '', ''],
                'Smells like ZeeSpirit - Kurt Cobain': ['NoahCache_all', 'u0ws1b5wm/15.0002', '1CP8x9y0IyA_NYHi58nhQHU7reAYefkcq8AihMwt-ayg', '', ''],
                'Sportpark Evolutions RT 1': ['NoahCache_all', 'u0wec15u9/15.0002', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
                'Sportpark Evolutions RT 2': ['NoahCache_all', 'u0wec1kg4/15.0002', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
                'Wedding Day': ['NoahCache_all', 'u0webcwke/15.0002', '', '', ''] // [*]
            },
            'completed': {
                'Mixed Garden RT': ['NoahCache_completed', 'u0weck999/15.0012', '', '', ''], // [*]
                'Wedding Day': ['NoahCache_completed', 'u0webcwke/15.0012', '', '', '']
            },
            'empty': {
                'Are you X-Zee-perienced': ['NoahCache_empty', 'u0weber3n/15.0012', '102QHEKr1_eHzeED1o26_qgWUMfDFC7S_rwAYsQRQyA8', '', ''], // [*]
                'Flats @ Appenzeller RT': ['NoahCache_empty', 'u0wecspcn/15.0012', '1M-9WjrBwHgMI7UEQybxwY9m5QzD-xlodk_m6EeZiFSc', '', ''],
                'Ringo - the Fab 4': ['NoahCache_empty', 'u0w7yn1s8/15.0012', '1iljO6wikjSvOBmfUp4Qt9bxKCe9wSDheoMkYEVfyUn0', '', ''],
                'Smells like ZeeSpirit - Kurt Cobain': ['NoahCache_empty', 'u0ws1b5wm/15.0012', '1CP8x9y0IyA_NYHi58nhQHU7reAYefkcq8AihMwt-ayg', '', ''],
                'Sportpark Evolutions RT 1': ['NoahCache_empty', 'u0wec15u9/15.0012', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
                'Sportpark Evolutions RT 2': ['NoahCache_empty', 'u0wec1kg4/15.0012', '17Ost9np4EzX6Ssw9I8B_lmhbehd0gOqmybJ1JbkdYV8', '', ''],
            }
        },
        'Norbee97': {
            'all': {
                '60 Color': ['Norbee97_all', 'u2rqk5m6n/15.000', '', '', ''],
                '60 Flat': ['Norbee97_all', 'u2rqk5m38/15.000', '', '', ''],
                'Alsógalla JoyPrize': ['Norbee97_all', 'u2mne5ju5/15.000', '18yKphmI_Ds9ThkWVnU3F1D40U-BrpuGMhDx9-lnEmp8', '', ''],
                'Brigetio': ['Norbee97_all', 'u2kzt1v7q/15.000', '1lalErwcZmw8n-LJbHCjs0w_-VoR3g6nUkKICXTQ-Cyk', '', ''],
                'Cata-Joy': ['Norbee97_all', 'u2rq7208j/15.000', '', '', ''],
                'Crossbow in Tatabánya': ['Norbee97_all', 'u2mne32nt/15.000', '1bZK5HinI4dsTlBpcMayie9BZTedIqqOtM0TCzmXx0UE', '', ''],
                'Debrecen 2202': ['Norbee97_all', 'u2rqk5cfd/15.000', '1PqIFXwIVCj2vF0Wn7lirVxmaxHGuw35RuwuPeX4RC6I', '', ''],
                'Debreceni kereszt': ['Norbee97_all', 'u2rqk7rjj/15.000', '', '', ''],
                'Electric Debrecen': ['Norbee97_all', 'u2rq7fsvq/15.000', '1_f4qfJlP9VX9-uZrfOiyh88tswVDqqiZTcSUXHfIOnw', '', ''],
                'Evolution': ['Norbee97_all', 'u2rqk5174/15.000', '', '', ''],
                'Flat Debrecen': ['Norbee97_all', 'u2rqk56jy/15.000', '1AVig5lE1FL7Wa9g7V3QpIIqhr45MYpFuBwnvpqp_8XM', '', ''],
                'Grail': ['Norbee97_all', 'u2mw30kw9/15.000', '', '', ''], // [*]
                'Jewel & Color': ['Norbee97_all', 'u2mw6egv5/15.000', '', '', ''],
                'Jewel Sandwich': ['Norbee97_all', 'u2rqk555v/15.000', '1bB12wFOBvHDW7caPKFjbdUEcgTmc6jCCuPzXMXH8uyg', '', ''],
                'Kodály`s Violin': ['Norbee97_all', 'u2q4b5j10/15.000', '', '', ''],
                'Tócóskert`s Arrows 2': ['Norbee97_all', 'u2rq7shg2/15.0002', '', '', ''],
                'Tócóskert`s Arrows 3': ['Norbee97_all', 'u2rq7shg2/15.0003', '1YNXFNfzN6kCH0Z10sonYsZb8qaDhzBGa5QvwtC8sARM', '', '']
            },
            'completed': {
                '60 Color': ['Norbee97_completed', 'u2rqk5m6n/15.001', '', '', ''],
                '60 Flat': ['Norbee97_completed', 'u2rqk5m38/15.001', '', '', ''],
                'Cata-Joy': ['Norbee97_completed', 'u2rq7208j/15.001', '', '', ''],
                'Debreceni kereszt': ['Norbee97_completed', 'u2rqk7rjj/15.001', '', '', ''], // [*]
                'Evolution': ['Norbee97_completed', 'u2rqk5174/15.001', '', '', ''],
                'Grail': ['Norbee97_completed', 'u2mw30kw9/15.001', '', '', ''],
                'Jewel & Color': ['Norbee97_completed', 'u2mw6egv5/15.001', '', '', ''],
                'Kodály`s Violin': ['Norbee97_completed', 'u2q4b5j10/15.001', '', '', ''],
                'Tócóskert`s Arrows 2': ['Norbee97_completed', 'u2rq7shg2/15.002', '', '', '']
            },
            'empty': {
                'Alsógalla JoyPrize': ['Norbee97_empty', 'u2mne5ju5/15.001', '18yKphmI_Ds9ThkWVnU3F1D40U-BrpuGMhDx9-lnEmp8', '', ''],
                'Brigetio': ['Norbee97_empty', 'u2kzt1v7q/15.001', '1lalErwcZmw8n-LJbHCjs0w_-VoR3g6nUkKICXTQ-Cyk', '', ''],
                'Crossbow in Tatabánya': ['Norbee97_empty', 'u2mne32nt/15.001', '1bZK5HinI4dsTlBpcMayie9BZTedIqqOtM0TCzmXx0UE', '', ''],
                'Debrecen 2202': ['Norbee97_empty', 'u2rqk5cfd/15.001', '1PqIFXwIVCj2vF0Wn7lirVxmaxHGuw35RuwuPeX4RC6I', '', ''],
                'Electric Debrecen': ['Norbee97_empty', 'u2rq7fsvq/15.001', '1_f4qfJlP9VX9-uZrfOiyh88tswVDqqiZTcSUXHfIOnw', '', ''], // [*]
                'Flat Debrecen': ['Norbee97_empty', 'u2rqk56jy/15.001', '1AVig5lE1FL7Wa9g7V3QpIIqhr45MYpFuBwnvpqp_8XM', '', ''],
                'Jewel Sandwich': ['Norbee97_empty', 'u2rqk555v/15.001', '1bB12wFOBvHDW7caPKFjbdUEcgTmc6jCCuPzXMXH8uyg', '', ''],
                'Tócóskert`s Arrows 3': ['Norbee97_empty', 'u2rq7shg2/15.003', '1YNXFNfzN6kCH0Z10sonYsZb8qaDhzBGa5QvwtC8sARM', '', '']
            }
        },
        'paupau': {
            'GOTM': {
                'Charles Darwin': ['paupau_GOTM', 'u1q0145hh/15.001', '', '2108', 'Germany_CharlesDarwin'], // [*]
                'Lou [and Rob]': ['paupau_GOTM', 'u1npe380n/15.001', '', '2103', 'Germany_Lou[andRob]']
            }
        },
        'PeachesnCream': {
            'empty': {
                'Altoona Evos': ['PeachesnCream_empty', '9zmsbkdmd/15.0012', '10Qe_IOxfh9SzZmqDBqWVTHNbfxPYuA-0i1tuykdOC2o', '', ''],
                'DSM Halloween Witch': ['PeachesnCream_empty', '9zmkmud77/15.0012', '1Z2gg91m-iCidadfBoLRvN7DpE16bpsQXwwkvU-_EB6I', '', ''],
                'West Des Moines Pac Man': ['PeachesnCream_empty', '9zmk6nyww/15.0012', '1MkElqI5MUYQvvXxhKV0f4aWdOMZc35EVOlFNDZ6avKk', '', ''],
                'West Des Moines Shark': ['PeachesnCream_empty', '9zmk6hw2m/15.0012', '1Wc-tWKKiNJbgcAtwyMZkoOgYTIjkcowb4QInou1E3NQ', '', ''], // [*]
                'West Des Moines Strawberry': ['PeachesnCream_empty', '9zmk65e9v/15.0012', '11ElTupqSSPj0pXyhWV26fuNlJmxR6o-Dsz-mFpUfRME', '', '']
            }
        },
        'Peter1980': {
            'all': {
                'Cherry Lane Cemetery - Cross Garden': ['Peter1980_all', 'gcpsvygmw/15.000', '', '', ''],
                'Evolution Strip': ['Peter1980_all', 'gcpsys5xc/15.000', '', '', ''],
                'Hayes Rainbow': ['Peter1980_all', 'gcpsyqekv/15.000', '', '', ''],
                'Heathrow Airport Kingfisher': ['Peter1980_all', 'gcpsydds3/15.000', '', '', ''],
                'Heathrow Crossbow Arrow': ['Peter1980_all', 'gcpsyt1y9/15.000', '', '', ''],
                'Heathrow Flat Squares': ['Peter1980_all', 'gcpsykxuu/15.000', '1I5mgm7XWvPd9ZX93ZEDP3aHkvCXhBHNBpZFJlXyhvN4', '', ''],
                'Nipper': ['Peter1980_all', 'gcptn245e/15.000', '', '', ''],
                'Palma de Mallorca - Official Flag': ['Peter1980_all', 'sp1ch758h/15.000', '1BtD1mbcL9cLCHKMEJ1GqJXbmRYkvNiQACS7sUid4SFA', '', ''],
                'The Bunny Fields': ['Peter1980_all', 'gcpsyn7wf/15.000', '', '', ''],
                'Union Jack': ['Peter1980_all', 'gcpsvs5k3/15.000', '', '', ''],
                'West London Jewel': ['Peter1980_all', 'gcpsywswp/15.000', '', '', ''] // [*]
            },
            'completed': {
                'Cherry Lane Cemetery - Cross Garden': ['Peter1980_completed', 'gcpsvygmw/15.001', '', '', ''],
                'Evolution Strip': ['Peter1980_completed', 'gcpsys5xc/15.001', '', '', ''],
                'Hayes Rainbow': ['Peter1980_completed', 'gcpsyqekv/15.001', '', '', ''],
                'Heathrow Airport Kingfisher': ['Peter1980_completed', 'gcpsydds3/15.001', '', '', ''],
                'Heathrow Crossbow Arrow': ['Peter1980_completed', 'gcpsyt1y9/15.001', '', '', ''], // [*]
                'Nipper': ['Peter1980_completed', 'gcptn245e/15.001', '', '', ''],
                'The Bunny Fields': ['Peter1980_completed', 'gcpsyn7wf/15.001', '', '', ''],
                'Union Jack': ['Peter1980_completed', 'gcpsvs5k3/15.001', '', '', ''],
                'West London Jewel': ['Peter1980_completed', 'gcpsywswp/15.001', '', '', '']
            },
            'empty': {
                'Heathrow Flat Squares': ['Peter1980_empty', 'gcpsykxuu/15.001', '1I5mgm7XWvPd9ZX93ZEDP3aHkvCXhBHNBpZFJlXyhvN4', '', ''], // [*]
                'Palma de Mallorca - Official Flag': ['Peter1980_empty', 'sp1ch758h/15.001', '1BtD1mbcL9cLCHKMEJ1GqJXbmRYkvNiQACS7sUid4SFA', '', '']
            }
        },
        'purplecourgette': {
            'GOTM': {
                'Aphrodite`s Cat': ['purplecourgette_GOTM', 'swpmm1cyu/15.000', '', '2204', 'Cyprus_AphroditesCat'],
                'Masquerade Hare': ['purplecourgette_GOTM', 'gcr8h8ghq/15.000', '', '2105', 'UnitedKingdom_MasqueradeHare'] // [*]
            }
        },
        'RePe': {
            'all': {
                'BioÖtökkä': ['RePe_all', 'u6xzu1e7e/15.0001', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE', '', ''],
                'Easter egg of Turku': ['RePe_all', 'u6xzg3k3w/15.0001', '1CcyugnXYcA28PbpC7xP6RK4Wn-N82F98FiZ8iqvuw9Q', '', ''],
                'Evopuisto': ['RePe_all', 'u6xzgfrs4/15.0001', '', '', ''],
                'Kameleontti': ['RePe_all', 'u6zb1ebg3/15.0001', '', '2104', 'Finland_Kameleontti'], // [*]
                'Kupittaa`s football': ['RePe_all', 'u6xzg7szq/15.0001', '', '', ''],
                'Lifebuoy': ['RePe_all', 'u6xzcg30d/15.0001', '18eZAN9ljk6PzINpcZr5RdfPCKtO5N0nxBHg2tMlR1dc', '', ''],
                'Smiley': ['RePe_all', 'u6xzfkb82/15.0001', '14uzB9BF1k_3MF_L3aMuEWYxCpaifnfGSBcAfA5GB8cs', '', ''],
                'UUSI - Evopuisto': ['RePe_all', 'u6xzu0zh8/15.0001', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE/edit#gid=627456412&range=A1:A2', '', '']
            },
            'GOTM': {
                'Kameleontti': ['RePe_GOTM', 'u6zb1ebg3/15.0011', '', '2104', 'Finland_Kameleontti'] // [*]
            },
            'completed': {
                'Evopuisto': ['RePe_completed', 'u6xzgfrs4/15.0011', '', '', ''],
                'Kupittaa`s football': ['RePe_completed', 'u6xzg7szq/15.0011', '', '', '']
            },
            'empty': {
                'BioÖtökkä': ['RePe_empty', 'u6xzu1e7e/15.0011', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE', '', ''], // [*]
                'Easter egg of Turku': ['RePe_empty', 'u6xzg3k3w/15.0011', '1CcyugnXYcA28PbpC7xP6RK4Wn-N82F98FiZ8iqvuw9Q', '', ''],
                'Lifebuoy': ['RePe_empty', 'u6xzcg30d/15.0011', '18eZAN9ljk6PzINpcZr5RdfPCKtO5N0nxBHg2tMlR1dc', '', ''],
                'Smiley': ['RePe_empty', 'u6xzfkb82/15.0011', '14uzB9BF1k_3MF_L3aMuEWYxCpaifnfGSBcAfA5GB8cs', '', ''],
                'UUSI - Evopuisto': ['RePe_empty', 'u6xzu0zh8/15.0011', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE/edit#gid=627456412&range=A1:A2', '', '']
            }
        },
        'Rikitan': {
            'all': {
                'Black Moth Squad': ['Rikitan_all', 'u2s1vx5xv/15.0002', '', '2110', 'Slovakia_BlackMothSquad'],
                'Bojnice Castle': ['Rikitan_all', 'u2tjwb13q/15.0002', '1_FGafoNwHBiDVjQ9ht74g17iysRrI89RHnClaiQ7hNg', '', ''],
                'Charge Bratislava': ['Rikitan_all', 'u2s1vyxmx/15.0002', '', '', ''],
                'Christmas Stable': ['Rikitan_all', 'u2s1uyuvm/15.0002', '', '', ''],
                'Hexagons of Vrutky': ['Rikitan_all', 'u2trqsut8/15.0002', '', '', ''],
                'Hungry Bat Terry': ['Rikitan_all', 'u2s1yt9t7/15.0002', '', '2210', 'Slovakia_HungryBatTerry'],
                'KUMA Bear Rača': ['Rikitan_all', 'u2s4q3jtk/15.0002', '1OsJhpQ0groKCQrGBhKmZjcTM1226-g9QxegeG5k5Fpk', '', ''],
                'Lake Lighthouse Painting': ['Rikitan_all', 'u2s1yq0c2/15.0002', '1uPcuR_pfgSrZkRT_vobeQT5WyA9cA77whn_SjFSFfPM', '', ''],
                'Le Petit Prince': ['Rikitan_all', 'u2s1yxmhk/15.0002', '', '', ''],
                'Night Vision Agent': ['Rikitan_all', 'u2s1vv279/15.0002', '', '2101', 'Slovakia_NightVisionAgent'], // [*]
                'Shamrock Ihro': ['Rikitan_all', 'u2s1yz6kg/15.0002', '1WPDM7GblL8P73VyCqD-zTahkWBatOxTEzAyct-PKP3s/edit#gid=1953223548&range=A8', '', ''],
                'Shamrock Ihro (Flats)': ['Rikitan_all', 'u2s1yz6kg/15.0002009', '1WPDM7GblL8P73VyCqD-zTahkWBatOxTEzAyct-PKP3s/edit#gid=1143462191&range=A8', '', ''],
                'Space Invader Prievidza': ['Rikitan_all', 'u2tjrpt60/15.0002', '', '', ''],
                'The Lighthouse of Chania': ['Rikitan_all', 'sw344d4gm/15.0002', '', '', ''],
                'Trenčín Castle': ['Rikitan_all', 'u2sy4ktgb/15.0002', '1EShM7fInXsbiHaGuYWNya_LhDxsFYeSVWR04UXkDNMA', '', '']
            },
            'GOTM': {
                'Black Moth Squad': ['Rikitan_GOTM', 'u2s1vx5xv/15.0012', '', '2110', 'Slovakia_BlackMothSquad'], // [*]
                'Hungry Bat Terry': ['Rikitan_GOTM', 'u2s1yt9t7/15.0012', '', '2210', 'Slovakia_HungryBatTerry'],
                'Night Vision Agent': ['Rikitan_GOTM', 'u2s1vv279/15.0012', '', '2101', 'Slovakia_NightVisionAgent']
            },
            'completed': {
                'Charge Bratislava': ['Rikitan_completed', 'u2s1vyxmx/15.0012', '', '', ''], // [*]
                'Christmas Stable': ['Rikitan_completed', 'u2s1uyuvm/15.0012', '', '', ''],
                'Hexagons of Vrutky': ['Rikitan_completed', 'u2trqsut8/15.0012', '', '', ''],
                'Le Petit Prince': ['Rikitan_empty', 'u2s1yxmhk/15.0012', '', '', ''],
                'Space Invader Prievidza': ['Rikitan_completed', 'u2tjrpt60/15.0012', '', '', ''],
                'The Lighthouse of Chania': ['Rikitan_completed', 'sw344d4gm/15.0012', '', '', '']
            },
            'empty': {
                'Bojnice Castle': ['Rikitan_empty', 'u2tjwb13q/15.0012', '1_FGafoNwHBiDVjQ9ht74g17iysRrI89RHnClaiQ7hNg', '', ''],
                'Lake Lighthouse Painting': ['Rikitan_empty', 'u2s1yq0c2/15.0012', '1uPcuR_pfgSrZkRT_vobeQT5WyA9cA77whn_SjFSFfPM', '', ''],
                'KUMA Bear Rača': ['Rikitan_empty', 'u2s4q3jtk/15.0012', '1OsJhpQ0groKCQrGBhKmZjcTM1226-g9QxegeG5k5Fpk', '', ''], // [*]
                'Shamrock Ihro': ['Rikitan_empty', 'u2s1yz6kg/15.0012', '1WPDM7GblL8P73VyCqD-zTahkWBatOxTEzAyct-PKP3s/edit#gid=1953223548&range=A8', '', ''],
                'Shamrock Ihro (Flats)': ['Rikitan_empty', 'u2s1yz6kg/15.0012009', '1WPDM7GblL8P73VyCqD-zTahkWBatOxTEzAyct-PKP3s/edit#gid=1143462191&range=A8', '', ''],
                'Trenčín Castle': ['Rikitan_empty', 'u2sy4ktgb/15.0012', '1EShM7fInXsbiHaGuYWNya_LhDxsFYeSVWR04UXkDNMA', '', '']
            }
        },
        'rodrico101': {
            'all': {
                '80`s Cube': ['rodrico101_all', '9zqz5kqsw/15.000', '', '', ''],
                'Cedar Rapids Barnyard': ['rodrico101_all', '9zqy6qe13/15.000', '', '', ''],
                'Cedar Rapids, IA Flag': ['rodrico101_all', '9zqy9ykqt/15.000', '1AFYsCyZ2Q7zXRSy33503bpFcvUj0RqgeHYft-v6Uu6U', '', ''],
                'Cedar Rapids Pumpkin': ['rodrico101_all', '9zqyb9s0m/15.000', '', '1910', 'USA_CedarRapidsPumpkin'],
                'Cherry Bomb': ['rodrico101_all', '9zqyb0gm4/15.000', '', '', ''],
                'CR Air Mystery Trail': ['rodrico101_all', '9zqz461u7/15.000', '', '', ''],
                'CR April': ['rodrico101_all', '9zqy6tdmm/15.000', '', '', ''],
                'CR Egyptian Zodiac': ['rodrico101_all', '9zqy9vbz4/15.000', '', '', ''],
                'CR Farmer`s Field': ['rodrico101_all', '9zqy6mwek/15.000', '', '', ''],
                'CR Feather': ['rodrico101_all', '9zqydmwhp/15.000', '', '', ''],
                'CR Flat Matt Loves Baseball': ['rodrico101_all', '9zqyfm0r7/15.000', '', '', ''],
                'CR Frankenstein': ['rodrico101_all', '9zqyb98mv/15.000', '1Xjchz0lat1rb44QSGVuOUCpJmYjko7mnehr9gI_KCRg', '', ''],
                'CR Holiday Pizza': ['rodrico101_all', '9zqy8y2d6/15.000', '', '', ''],
                'CR Honor Cross': ['rodrico101_all', '9zqy9whw6/15.000', '', '', ''],
                'CR Jones Park Birthday 7': ['rodrico101_all', '9zqydku0v/15.000', '', '', ''],
                'CR Jones Park Birthday 7 (Flats)': ['rodrico101_all', '9zqydku0v/15.000009', '', '', ''],
                'CR Munzee 6th Birthday': ['rodrico101_all', '9zqyctfv9/15.000', '', '', ''],
                'CR Muscle Car': ['rodrico101_all', '9zqy6kzhw/15.000', '', '', ''],
                'CR Rose': ['rodrico101_all', '9zqyc08tb/15.000', '', '', ''],
                'CR Safari': ['rodrico101_all', '9zqy6tnvg/15.000', '', '', ''],
                'CR Submarine': ['rodrico101_all', '9zqy6mkwx/15.000', '', '', ''],
                'CR Vegetable': ['rodrico101_all', '9zqy6q5vz/15.000', '', '', ''],
                'Flat Rob Birthday': ['rodrico101_all', '9zqyctk1k/15.000', '', '', ''],
                'Hotel Evo': ['rodrico101_all', '9zqy6k6uy/15.000', '', '', ''],
                'Iowa Goldfinch': ['rodrico101_all', '9zqyb3kzv/15.000', '', '', ''],
                'Noelridge Mystery': ['rodrico101_all', '9zqz432fm/15.000', '', '', ''],
                'Noelridge Mystery (Flats)': ['rodrico101_all', '9zqz432fm/15.000009', '', '', ''],
                'Thomas Park Flats': ['rodrico101_all', '9zqz57639/15.000', '', '', ''],
                'Unofficial CR Evo': ['rodrico101_all', '9zqyd8hgw/15.000', '1TnyQsvsR0ZBkJuuAFW03Pe4qzCrYJzNLwed838pIMrg', '', '']
            },
            'GOTM': {
                'Cedar Rapids Pumpkin': ['rodrico101_GOTM', '9zqyb9s0m/15.001', '', '1910', 'USA_CedarRapidsPumpkin'] // USA
            },
            'completed': {
                '80`s Cube': ['rodrico101_completed', '9zqz5kqsw/15.001', '', '', ''],
                'Cedar Rapids Barnyard': ['rodrico101_completed', '9zqy6qe13/15.001', '', '', ''],
                'Cherry Bomb': ['rodrico101_completed', '9zqyb0gm4/15.001', '', '', ''],
                'CR Air Mystery Trail': ['rodrico101_completed', '9zqz461u7/15.001', '', '', ''],
                'CR April': ['rodrico101_completed', '9zqy6tdmm/15.001', '', '', ''],
                'CR Egyptian Zodiac': ['rodrico101_completed', '9zqy9vbz4/15.001', '', '', ''],
                'CR Farmer`s Field': ['rodrico101_completed', '9zqy6mwek/15.001', '', '', ''],
                'CR Feather': ['rodrico101_completed', '9zqydmwhp/15.001', '', '', ''],
                'CR Flat Matt Loves Baseball': ['rodrico101_completed', '9zqyfm0r7/15.001', '', '', ''],
                'CR Holiday Pizza': ['rodrico101_completed', '9zqy8y2d6/15.001', '', '', ''],
                'CR Honor Cross': ['rodrico101_completed', '9zqy9whw6/15.001', '', '', ''],
                'CR Jones Park Birthday 7': ['rodrico101_completed', '9zqydku0v/15.001', '', '', ''],
                'CR Jones Park Birthday 7 (Flats)': ['rodrico101_completed', '9zqydku0v/15.001009', '', '', ''],
                'CR Munzee 6th Birthday': ['rodrico101_completed', '9zqyctfv9/15.001', '', '', ''],
                'CR Muscle Car': ['rodrico101_completed', '9zqy6kzhw/15.001', '', '', ''],
                'CR Rose': ['rodrico101_completed', '9zqyc08tb/15.001', '', '', ''],
                'CR Safari': ['rodrico101_completed', '9zqy6tnvg/15.001', '', '', ''],
                'CR Submarine': ['rodrico101_completed', '9zqy6mkwx/15.001', '', '', ''],
                'CR Vegetable': ['rodrico101_completed', '9zqy6q5vz/15.001', '', '', ''],
                'Flat Rob Birthday': ['rodrico101_completed', '9zqyctk1k/15.001', '', '', ''],
                'Hotel Evo': ['rodrico101_completed', '9zqy6k6uy/15.001', '', '', ''],
                'Iowa Goldfinch': ['rodrico101_completed', '9zqyb3kzv/15.001', '', '', ''],
                'Noelridge Mystery': ['rodrico101_completed', '9zqz432fm/15.001', '', '', ''],
                'Noelridge Mystery (Flats)': ['rodrico101_completed', '9zqz432fm/15.001009', '', '', ''],
                'Thomas Park Flats': ['rodrico101_completed', '9zqz57639/15.001', '', '', '']
            },
            'empty': {
                'Cedar Rapids, IA Flag': ['rodrico101_empty', '9zqy9ykqt/15.001', '1AFYsCyZ2Q7zXRSy33503bpFcvUj0RqgeHYft-v6Uu6U', '', ''],
                'CR Frankenstein': ['rodrico101_empty', '9zqyb98mv/15.001', '1Xjchz0lat1rb44QSGVuOUCpJmYjko7mnehr9gI_KCRg', '', ''],
                'Unofficial CR Evo': ['rodrico101_empty', '9zqyd8hgw/15.001', '1TnyQsvsR0ZBkJuuAFW03Pe4qzCrYJzNLwed838pIMrg', '', '']
            }
        },
        'Roger6102': {
            'completed': {
                'Cittaslow - Echt': ['Roger6102_completed', 'u1h4vc86y/15.001', '', '', ''],
                'Crossbow Garden Echt': ['Roger6102_completed', 'u1h4tqutt/15.001', '', '', ''],
                'EvoApple Ech': ['Roger6102_completed', 'u1h4tr7p2/15.001', '', '', ''], // [*]
                'Vlag Echt': ['Roger6102_completed', 'u1h4vf56p/15.001', '', '', '']
            }
        },
        'RUJA': {
            'all': {
                'Grenaa City`s Coat of Arms': ['RUJA_all', 'u4p8zgw2n/15.0001', '', '1906', 'Denmark_GrenaaCitysCoatOfArms'],
                'Grenaa Ferry': ['RUJA_all', 'u4pbbt4gq/15.0001', '', '', ''], // [*]
                'Grenaa Sapphire and Amethyst': ['RUJA_all', 'u4p8zwhpp/15.0001', '', '', ''],
                'Sonic Randers': ['RUJA_all', 'u4p1kkb66/15.0001', '1QisXL5LrGmGIu0eF-jYeIBahVTqFEPj3HAJJFBqGHR8', '', '']
            },
            'GOTM': {
                'Grenaa City`s Coat of Arms': ['RUJA_GOTM', 'u4p8zgw2n/15.0011', '', '1906', 'Denmark_GrenaaCitysCoatOfArms'] // [*]
            },
            'completed': {
                'Grenaa Ferry': ['RUJA_completed', 'u4pbbt4gq/15.0011', '', '', ''],
                'Grenaa Sapphire and Amethyst': ['RUJA_completed', 'u4p8zwhpp/15.0011', '', '', ''] // [*]
            },
            'empty': {
                'Sonic Randers': ['RUJA_empty', 'u4p1kkb66/15.0011', '1QisXL5LrGmGIu0eF-jYeIBahVTqFEPj3HAJJFBqGHR8', '', ''] // [*]
            }
        },
        'Sivontim': {
            'all': {
                '7th Birthday': ['Sivontim_all', 'ud9y9snw2/15.0003', '', '1907', 'Finland_7thBirthday'],
                'Crazy Ghost': ['Sivontim_all', 'udf3cy0um/15.0003', '', '', ''],
                'Drive': ['Sivontim_all', 'ud9wrfgwv/15.0003', '', '', ''], // [*]
                'Easter Bunny': ['Sivontim_all', 'ud9wqgnsc/15.0003', '', '', ''],
                'Evolution Field': ['Sivontim_all', 'ud9wrdhs8/15.0003', '1WPgjj8Jir64XXPIDTKH8XDtpEvA3yPFzbjW_J80K2U8', '', ''],
                'Helsinki Colour': ['Sivontim_all', 'ud9y2q5jc/15.0003', '', '2001', 'Finland_HelsinkiColour'],
                'Helsinki Surprise': ['Sivontim_all', 'ud9wrdrqb/15.0003', '', '', ''],
                'Mermaid': ['Sivontim_all', 'ud9wk45jn/15.0003', '', '', ''],
                'mUnZee10 Birthday': ['Sivontim_all', 'ud9wz1kgz/15.0003', '', '', ''],
                'Xmas Stocking': ['Sivontim_all', 'ud9y8yqyr/15.0003', '', '', '']
            },
            'GOTM': {
                '7th Birthday': ['Sivontim_GOTM', 'ud9y9snw2/15.0013', '', '1907', 'Finland_7thBirthday'], // [*]
                'Helsinki Colour': ['Sivontim_GOTM', 'ud9y2q5jc/15.0013', '', '2001', 'Finland_HelsinkiColour']
            },
            'completed': {
                'Crazy Ghost': ['Sivontim_completed', 'udf3cy0um/15.0013', '', '', ''], // [*]
                'Drive': ['Sivontim_completed', 'ud9wrfgwv/15.0013', '', '', ''],
                'Easter Bunny': ['Sivontim_completed', 'ud9wqgnsc/15.0013', '', '', ''],
                'Helsinki Surprise': ['Sivontim_completed', 'ud9wrdrqb/15.0013', '', '', ''],
                'Mermaid': ['Sivontim_completed', 'ud9wk45jn/15.0013', '', '', ''],
                'mUnZee10 Birthday': ['Sivontim_completed', 'ud9wz1kgz/15.0013', '', '', ''],
                'Xmas Stocking': ['Sivontim_completed', 'ud9y8yqyr/15.0013', '', '', '']
            },
            'empty': {
                'Evolution Field': ['Sivontim_empty', 'ud9wrdhs8/15.0013', '1WPgjj8Jir64XXPIDTKH8XDtpEvA3yPFzbjW_J80K2U8', '', ''] // [*]
            }
        },
        'squirreledaway': {
            'all': {
                'Apple Valley - Evolutionary Flower': ['squirreledaway_all', '9zvwqtjtx/15.000', '', '', ''],
                'Lakeville`s Sea Turtle': ['squirreledaway_all', '9zvwq5uf3/15.000', '', '', ''], // [*]
                'Lakeville`s Sea Turtle (Flats)': ['squirreledaway_all', '9zvwq5uf3/15.000009', '1BdmycjSniytBg9rbDo1ABVIyrNM7KkwZZSbADIp43vs/edit#gid=2044209526&range=A1:H1', '', ''],
                'Lightning Bolt in Sapphire': ['squirreledaway_all', '9zvwq4veb/15.000', '', '', ''],
                'The Apple Valley Apple': ['squirreledaway_all', '9zvwrj4rs/15.000', '', '', '']
            },
            'completed': {
                'Apple Valley - Evolutionary Flower': ['squirreledaway_empty', '9zvwqtjtx/15.001', '', '', ''],
                'Lakeville`s Sea Turtle': ['squirreledaway_completed', '9zvwq5uf3/15.001', '', '', ''],
                'Lightning Bolt in Sapphire': ['squirreledaway_completed', '9zvwq4veb/15.001', '', '', ''],
                'The Apple Valley Apple': ['squirreledaway_completed', '9zvwrj4rs/15.001', '', '', ''] // [*]
            },
            'empty': {
                'Lakeville`s Sea Turtle (Flats)': ['squirreledaway_empty', '9zvwq5uf3/15.001009', '1BdmycjSniytBg9rbDo1ABVIyrNM7KkwZZSbADIp43vs/edit#gid=2044209526&range=A1:H1', '', ''] // [*]
            }
        },
        'stineB': {
            'GOTM': {
                'Fasanerie Darmstadt': ['stineB_GOTM', 'u0y5vd7zs/15.001', '', '2105', 'Germany_FasanerieDarmstadt'], // Germany
                'Papagei Crumstadt': ['stineB_GOTM', 'u0y53se24/15.001', '', '2206', 'Germany_PapageiCrumstadt'] // Germany
            }
        },
        'taiska1255': {
            'all': {
                'Kärsämäen Klaanimiekka': ['taiska1255_all', 'u6zb54227/15.000', '1cWEdoEehihTMaMhvVmnmjD1oprtRRNKopedwcnDGkIA', '', ''],
                'Kehäkukka(nen)': ['taiska1255_all', 'u6zb5jhp8/15.000', '1vA0FbAFPNzRkdOwjxv6duE68NO0YJVVH', '', ''],
                'Koroisten kolmiot': ['taiska1255_all', 'u6zb52m80/15.000', '1618ksqdch_9thvjWbXgczj_BxiESB0me2zUuq1iLf34', '', ''],
                'Kuralan Kylämäen Evolato': ['taiska1255_all', 'u6xzuqbsg/15.000', '1PycvsIGRJ_SkpzvmtCD9iTd7wmFJupojCnP8Zwx0UFg', '', ''],
                'Malec`s Angelic Rainbow': ['taiska1255_all', 'u6zb5fdmy/15.000', '1d5y5cy_633EqYFF4DkJ5dDQOizgr2-2k', '', ''],
                'Sharpei': ['taiska1255_all', 'u6zb597d6/15.000', '1XhMBO2VOe1Y2X3uG2gpegvwy-7-JSevt', '', ''], // [*]
                'Turun Yliopisto': ['taiska1255_all', 'u6xzfvxuz/15.000', '', '', '']
            },
            'completed': {
                'Turun Yliopisto': ['taiska1255_completed', 'u6xzfvxuz/15.001', '', '', ''] // [*]
            },
            'empty': {
                'Kärsämäen Klaanimiekka': ['taiska1255_empty', 'u6zb54227/15.001', '1cWEdoEehihTMaMhvVmnmjD1oprtRRNKopedwcnDGkIA', '', ''],
                'Kehäkukka(nen)': ['taiska1255_empty', 'u6zb5jhp8/15.001', '1vA0FbAFPNzRkdOwjxv6duE68NO0YJVVH', '', ''],
                'Koroisten kolmiot': ['taiska1255_empty', 'u6zb52m80/15.001', '1618ksqdch_9thvjWbXgczj_BxiESB0me2zUuq1iLf34', '', ''],
                'Kuralan Kylämäen Evolato': ['taiska1255_empty', 'u6xzuqbsg/15.001', '1PycvsIGRJ_SkpzvmtCD9iTd7wmFJupojCnP8Zwx0UFg', '', ''], // [*]
                'Malec`s Angelic Rainbow': ['taiska1255_empty', 'u6zb5fdmy/15.001', '1d5y5cy_633EqYFF4DkJ5dDQOizgr2-2k', '', ''],
                'Sharpei': ['taiska1255_empty', 'u6zb597d6/15.001', '1XhMBO2VOe1Y2X3uG2gpegvwy-7-JSevt', '', '']
            }
        },
        'tartu61': {
            'all': {
                'Hyvinkää': ['tartu61_all', 'udc8vwrpv/15.0001', '15uMn7URcyjLdcJKTnkQKyCIAcZS8s8033KqARR3kBlQ', '', ''],
                'Palmuranta': ['tartu61_all', 'udc8udkum/15.0001', '', '2203', 'Finland_Palmuranta'] // [*]
            },
            'GOTM': {
                'Palmuranta': ['tartu61_GOTM', 'udc8udkum/15.0011', '', '2203', 'Finland_Palmuranta'] // [*]
            },
            'empty': {
                'Hyvinkää': ['tartu61_empty', 'udc8vwrpv/15.0011', '15uMn7URcyjLdcJKTnkQKyCIAcZS8s8033KqARR3kBlQ', '', ''] // [*]
            }
        },
        'tcguru': {
            'all': {
                'BioÖtökkä': ['tcguru_all', 'u6xzu1e7e/15.0002', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE', '', ''],
                'Evopuisto': ['tcguru_all', 'u6xzgfrs4/15.0002', '', '', ''],
                'Kameleontti': ['tcguru_all', 'u6zb1ebg3/15.0002', '', '2104', 'Finland_Kameleontti'], // [*]
                'UUSI - Evopuisto': ['tcguru_all', 'u6xzu0zh8/15.0002', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE/edit#gid=627456412&range=A1:A2', '', '']
            },
            'GOTM': {
                'Kameleontti': ['tcguru_GOTM', 'u6zb1ebg3/15.0012', '', '2104', 'Finland_Kameleontti'] // [*]
            },
            'completed': {
                'Evopuisto': ['tcguru_completed', 'u6xzgfrs4/15.0012', '', '', '']
            },
            'empty': {
                'BioÖtökkä': ['tcguru_empty', 'u6xzu1e7e/15.0012', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE', '', ''], // [*]
                'UUSI - Evopuisto': ['tcguru_empty', 'u6xzu0zh8/15.0012', '1IPTtpdqqPJI37u5yrOiLnGtbSOZeCBm3Y2NKU2hh8JE/edit#gid=627456412&range=A1:A2', '', '']
            }
        },
        'tlmeadowlark': {
            'all': {
                'Caretta Sea Turtle': ['tlmeadowlark_all', 'djf8m22fr/15.000', '', '2301', 'USA_CarettaSeaTurtle'],
                'Commerce Barnyard': ['tlmeadowlark_all', 'dnhdug6cs/15.000', '', '', ''],
                'Green SpyFrog': ['tlmeadowlark_all', 'djf8je247/15.000', '', '', ''],
                'Seahorse by the SeaShore': ['tlmeadowlark_all', 'dj3shdv4f/15.000', '', '', ''],
                'The Lucky Fungi': ['tlmeadowlark_all', 'djf8kbee5/15.000', '', '', ''] // [*]
            },
            'GOTM': {
                'Caretta Sea Turtle': ['tlmeadowlark_GOTM', 'djf8m22fr/15.001', '', '2301', 'USA_CarettaSeaTurtle'] // [*]
            },
            'completed': {
                'Commerce Barnyard': ['tlmeadowlark_completed', 'dnhdug6cs/15.001', '', '', ''], // [*]
                'Green SpyFrog': ['tlmeadowlark_completed', 'djf8je247/15.001', '', '', ''],
                'Seahorse by the SeaShore': ['tlmeadowlark_completed', 'dj3shdv4f/15.001', '', '', ''],
                'The Lucky Fungi': ['tlmeadowlark_completed', 'djf8kbee5/15.001', '', '', '']
            }
        },
        'volki2000': {
            'all': {
                'Flat-O-Fant': ['volki2000_all', 'u0wn8q7u2/15.000', '', '2008', 'Germany_Flat-O-Fant'], // [*]
                'Karlsruhe - Stadt des Rechts': ['volki2000_all', 'u0tyyfy7z/15.000', '1jewr3-fxxXn6HPgNi4zSOe8ydN_cORi7QmyZvnDd_vg', '', '']
            },
            'GOTM': {
                'Flat-O-Fant': ['volki2000_GOTM', 'u0wn8q7u2/15.001', '', '2008', 'Germany_Flat-O-Fant'] // [*]
            },
            'empty': {
                'Karlsruhe - Stadt des Rechts': ['volki2000_empty', 'u0tyyfy7z/15.001', '1jewr3-fxxXn6HPgNi4zSOe8ydN_cORi7QmyZvnDd_vg', '', ''] // [*]
            }
        },
        'WandelKuub': {
            'completed': {
                'Erensteiner Easter Eggs 2': ['WandelKuub_completed', 'u1h33v2d4/15.001', '', '', ''], // [*]
                'EVO1 Kerkrade': ['WandelKuub_completed', 'u1h365e4v/15.001', '', '', ''],
                'EVO2 Kerkrade': ['WandelKuub_completed', 'u1h36h5eg/15.001', '', '', ''],
                'Kerkrade Jewel': ['WandelKuub_completed', 'u1h36525q/15.001', '', '', ''],
                'Kerkrade Surprise': ['WandelKuub_completed', 'u1h365kun/15.001', '', '', ''],
                'Market MVM': ['WandelKuub_completed', 'u1h33gy9q/15.001', '', '', '']
            }
        },
        'Waves117': {
            'all': {
                'Cromers Gingerbread Man': ['Waves117_all', 'u12vjk6d6/15.0001', '', '', ''],
                'HeartBeatz': ['Waves117_all', 'u122rjm0e/15.0001', '', '2302', 'UnitedKingdom_HeartBeatz'], // [*]
                'Horatio the Hermit Crab': ['Waves117_all', 'u12vje1zv/15.0001', '', '2205', 'UnitedKingdom_HoratioTheHermitCrab'],
                'Sandcastle in Sheringham': ['Waves117_all', 'u12v5qq8k/15.0001', '', '2106', 'UnitedKingdom_SandcastleInSheringham'],
                'Shire Horse Sanctuary': ['Waves117_all', 'u12vhk7nm/15.0001', '', '2302', 'UnitedKingdom_ShireHorseSanctuary'],
                'The Yellow Submarine': ['Waves117_all', 'u12v57yrs/15.0001', '', '2211', 'UnitedKingdom_TheYellowSubmarine'],
                'Virtual Love': ['Waves117_all', 'u12v5ubbu/15.0001', '1ERVj0mTf1ASlIzK-H_GKqAlV9D6T-5mYRHRFC5EMv9s', '', '']
            },
            'GOTM': {
                'HeartBeatz': ['Waves117_GOTM', 'u122rjm0e/15.0011', '', '2302', 'UnitedKingdom_HeartBeatz'],
                'Horatio the Hermit Crab': ['Waves117_GOTM', 'u12vje1zv/15.0011', '', '2205', 'UnitedKingdom_HoratioTheHermitCrab'],
                'Sandcastle in Sheringham': ['Waves117_GOTM', 'u12v5qq8k/15.0011', '', '2106', 'UnitedKingdom_SandcastleInSheringham'],
                'Shire Horse Sanctuary': ['Waves117_GOTM', 'u12vhk7nm/15.0011', '', '2302', 'UnitedKingdom_ShireHorseSanctuary'], // [*]
                'The Yellow Submarine': ['Waves117_GOTM', 'u12v57yrs/15.0011', '', '2211', 'UnitedKingdom_TheYellowSubmarine']
            },
            'completed': {
                'Cromers Gingerbread Man': ['Waves117_completed', 'u12vjk6d6/15.0011', '', '', ''] // [*]
            },
            'empty': {
                'Virtual Love': ['Waves117_empty', 'u12v5ubbu/15.0011', '1ERVj0mTf1ASlIzK-H_GKqAlV9D6T-5mYRHRFC5EMv9s', '', ''] // [*]
            }
        },
        'zsomborpeto': {
            'all': {
                'Crossbow on Hármashatárhegy': ['zsomborpeto_all', 'u2mqx8zje/15.000', '', '', ''],
                'Pegasus': ['zsomborpeto_all', 'u2nr4fkzr/15.000', '', '1908', 'Hungary_Pegasus'] // [*]
            },
            'GOTM': {
                'Pegasus': ['zsomborpeto_GOTM', 'u2nr4fkzr/15.001', '', '1908', 'Hungary_Pegasus'] // [*]
            },
            'completed': {
                'Crossbow on Hármashatárhegy': ['zsomborpeto_completed', 'u2mqx8zje/15.001', '', '', ''] // [*]
            }
        }
    },
    'by topic': {
        'Buckeye`s European Invasion': {
            'Europa': {
                'France`s First Player-made - Dinan': ['topic_BuckeyesEuropeanInvasion', 'gbwe9p554/14.998', '', '', ''],
                'Netherlands Tulip - Amstelveen': ['topic_BuckeyesEuropeanInvasion', 'u173wggyh/14.998', '', '', ''],
                'Ohio Flag - London': ['topic_BuckeyesEuropeanInvasion', 'gcpstztrd/14.998', '', '', '']
            },
            'France': {
                'France`s First Player-made - Dinan': ['topic_BuckeyesEuropeanInvasion', 'gbwe9p554/14.9981', '', '', '']
            },
            'Netherlands': {
                'Netherlands Tulip - Amstelveen': ['topic_BuckeyesEuropeanInvasion', 'u173wggyh/14.9981', '', '', '']
            },
            'United Kingdom': {
                'Ohio Flag - London': ['topic_BuckeyesEuropeanInvasion', 'gcpstztrd/14.9981', '', '', '']
            }
        },
        'F-Bomb': {
            'World': {
                'F-Bomb - Berlin': ['topic_FBomb', 'u336wckkv/14.998', '', '', ''], // Germany
                'F-Bomb - Budapest': ['topic_FBomb', 'u2mw4erzn/14.998', '', '', ''], // Hungary
                'F-Bomb - Cedar Rapids': ['topic_FBomb', '9zqy9z1s5/14.998', '', '', ''], // USA
                'F-Bomb - Hammel': ['topic_FBomb', 'u1zpbx5gt/14.998', '', '', ''], // Denmark
                'F-Bomb - McKinney': ['topic_FBomb', '9vghxt5yq/14.998', '', '', ''], // USA
                'F-Bomb - Tampa': ['topic_FBomb', 'djj2j8ht8/14.998', '', '', ''] // USA
            },
            'Denmark': {
                'F-Bomb - Hammel': ['topic_FBomb', 'u1zpbx5gt/14.9981', '', '', '']
            },
            'Germany': {
                'F-Bomb - Berlin': ['topic_FBomb', 'u336wckkv/14.9981', '', '', ''],
            },
            'Hungary': {
                'F-Bomb - Budapest': ['topic_FBomb', 'u2mw4erzn/14.9981', '', '', '']
            },
            'USA': {
                'F-Bomb - Cedar Rapids': ['topic_FBomb', '9zqy9z1s5/14.9981', '', '', ''],
                'F-Bomb - McKinney': ['topic_FBomb', '9vghxt5yq/14.9981', '', '', ''],
                'F-Bomb - Tampa': ['topic_FBomb', 'djj2j8ht8/14.9981', '', '', '']
            }
        },
        'KC Night Lights': {
            'USA': {
                'KC Night Lights #1': ['topic_KCNightLights', '9yuwp35ek/14.998', '', '', ''],
                'KC Night Lights #2': ['topic_KCNightLights', '9yuttgdt6/14.998', '', '', ''],
                'KC Night Lights #3': ['topic_KCNightLights', '9yutzxumv/14.998', '', '', ''],
                'KC Night Lights #4': ['topic_KCNightLights', '9yutvf65z/14.998', '', '', ''],
                'KC Night Lights #5': ['topic_KCNightLights', '9yuvbt02e/14.998', '', '', ''],
            }
        },
        'memorial': {
            'World': {
                // topic (memorial)
                'Angel Memorial': ['topic_Memorial', 'gcrwd62un/14.998', '1NBjLA2odEERxgw8Ku8_NyhTh5h7u-6jUxO1qlRRyxGk', '', ''],
                'Frank Memorial 2017': ['topic_Memorial', 'rk4pdwyzn/14.998', '', '', ''],
                'Griff Memorial': ['topic_Memorial', 'gbyr8kfy6/14.998', '', '', ''],
                'HGH2 Memorial': ['topic_Memorial', '9vffcyrdj/14.998', '1L4fdYDRPxZbdHM5ggDBtBaQYbl1sxmClwHYy1z2tkEQ', '', ''],
                'Mr Nimby': ['topic_Memorial', 'gcwdmrzdv/14.998', '1hBrKYXgzdVYr_ndr4YaubPnQogYzRikQUGMjZBQHNN4', '', ''],
                'Norfolk12 Memorial': ['topic_Memorial', 'gcr2nzp5s/14.998', '10B-iuB6ERfSQMEJfJ-waT54QYhTQopEByvK4GY1b_OY', '', ''],
                'RIP Terry - Palmetto, FL': ['topic_Memorial', 'dhvhxu07j/14.998', '1stUC8wTQl2eGekLE6kJRx-DJsUVozZgCgin3HDeqLMU', '', ''],
                'Spongy Memorial': ['topic_Memorial', '9yzen3dve/14.998', '', '', '']
            }
//            'USA': {
//                'HGH2 Memorial': ['topic_Memorial', '9vffcyrdj/14.9981', '1L4fdYDRPxZbdHM5ggDBtBaQYbl1sxmClwHYy1z2tkEQ', '', '']
//            }
        },
        'official Emerald': {
            'World': {
                'Emerald in Anchorage': ['topic_Emerald', 'bdvkkc5wn/14.998', '', '', ''],
                'Emerald in Chesterfield': ['topic_Emerald', '9x0rse69p/14.998', '', '', ''],
                'Emerald in Greenwich': ['topic_Emerald', 'gcpuzgnxd/14.998', '', '', ''],
                'Emerald in McKinney': ['topic_Emerald', '9vgkbr252/14.998', '', '', ''],
                'Emerald in Melbourne': ['topic_Emerald', 'r1r1j7323/14.998', '', '', ''],
                'Emerald in Sydney': ['topic_Emerald', 'r3gx3wnyr/14.998', '', '', '']
            },
            'Australia': {
                'Emerald in Melbourne': ['topic_Emerald', 'r1r1j7323/14.9981', '', '', ''],
                'Emerald in Sydney': ['topic_Emerald', 'r3gx3wnyr/14.9981', '', '', '']
            },
            'United Kingdom': {
                'Emerald in Greenwich': ['topic_Emerald', 'gcpuzgnxd/14.9981', '', '', '']
            },
            'USA': {
                'Emerald in Anchorage': ['topic_Emerald', 'bdvkkc5wn/14.9981', '', '', ''],
                'Emerald in Chesterfield': ['topic_Emerald', '9x0rse69p/14.9981', '', '', ''],
                'Emerald in McKinney': ['topic_Emerald', '9vgkbr252/14.9981', '', '', '']
            }
        },
        'seasons, holidays': {
            'Canada': {
                'Spring in Ottawa': ['topic_InOttawa', 'f2469zt39/14.998', '', '', ''],
                'Summer in Ottawa': ['topic_InOttawa', 'f246ds0e9/14.998', '', '', ''],
                'Halloween in Ottawa': ['topic_InOttawa', 'f246dqzzt/14.998', '', '2210', 'Canada_HalloweenInOttawa'],
                'Christmas in Ottawa': ['topic_InOttawa', 'f2469dret/14.998', '', '2112', 'Canada_ChristmasInOttawa']
            },
            'USA': {
                'Spring Tree': ['topic_TreeInSeasons', '9yzse4bfp/14.998', '', '', ''],
                'Summer Tree': ['topic_TreeInSeasons', '9yzsdc5rv/14.998', '', '', ''],
                'Autumn Tree': ['topic_TreeInSeasons', '9yzse63z5/14.998', '', '', ''], // [*]
                'Winter Tree': ['topic_TreeInSeasons', '9yzsdf0b7/14.998', '', '', '']
            }
        },
        'Stroopwafel invasion': {
            'World': {
                'Stroopwafel invasion in Andover': ['topic_StroopwafelInvasion', 'gcngq3xm7/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // United Kingdom
                'Stroopwafel invasion in Arnhem': ['topic_StroopwafelInvasion', 'u1hpz6kq2/14.998', '', '', ''], // Netherlands
                'Stroopwafel invasion in Bedford': ['topic_StroopwafelInvasion', 'gcr8mrunx/14.998', '', '', ''], // United Kingdom
                'Stroopwafel invasion in Berlin': ['topic_StroopwafelInvasion', 'u33e0rucx/14.998', '', '', ''], // Germany
                'Stroopwafel invasion in Brossard': ['topic_StroopwafelInvasion', 'f25f8m2hv/14.998', '', '', ''], // Canada
                'Stroopwafel invasion in Browns Plains': ['topic_StroopwafelInvasion', 'r7hfdck60/14.998', '', '', ''], // Australia
                'Stroopwafel invasion in Chemnitz': ['topic_StroopwafelInvasion', 'u311ncc6x/14.998', '', '', ''], // Germany
                'Stroopwafel invasion in Dapto': ['topic_StroopwafelInvasion', 'r3g5z9k30/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // Australia
                'Stroopwafel invasion in Desert Lodge': ['topic_StroopwafelInvasion', '9mvkbt7mw/14.998', '', '', ''], // USA
                'Stroopwafel invasion in Escondido': ['topic_StroopwafelInvasion', '9musx254q/14.998', '', '', ''], // USA
                'Stroopwafel invasion in Falling Waters': ['topic_StroopwafelInvasion', 'dr095u8tn/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // USA
                'Stroopwafel invasion in Felsőgalla': ['topic_StroopwafelInvasion', 'u2mn7yzxz/14.998', '', '', ''], // Hungary
                'Stroopwafel invasion in Georgetown': ['topic_StroopwafelInvasion', 'dpz0jxyv6/14.998', '', '', ''], // Canada
                'Stroopwafel invasion in Glen Oaks': ['topic_StroopwafelInvasion', '9mufvb1e5/14.998', '', '', ''], // USA
                'Stroopwafel invasion in Gouda': ['topic_StroopwafelInvasion', 'u15rfnm03/14.998', '', '', ''], // Netherlands
                'Stroopwafel invasion in Götenborg': ['topic_StroopwafelInvasion', 'u60ryyzf8/14.998', '', '', ''], // Sweden
                'Stroopwafel invasion in Groningen': ['topic_StroopwafelInvasion', 'u1kwvu195/14.998', '', '', ''], // Netherlands
                'Stroopwafel invasion in Hagerstown': ['topic_StroopwafelInvasion', 'dr09wfndy/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // USA
                'Stroopwafel invasion in Hoofddorp': ['topic_StroopwafelInvasion', 'u173d4yds/14.998', '', '', ''], // Netherlands
                'Stroopwafel invasion in Kelmscott': ['topic_StroopwafelInvasion', 'qd63rd421/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // Australia
                'Stroopwafel invasion in Kingswood': ['topic_StroopwafelInvasion', 'gcnhxpp6s/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // United Kingdom
                'Stroopwafel invasion in Linköping': ['topic_StroopwafelInvasion', 'u67hj4225/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // Sweden
                'Stroopwafel invasion in Meitingen': ['topic_StroopwafelInvasion', 'u0xspjjng/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // Germany
                'Stroopwafel invasion in MHQ': ['topic_StroopwafelInvasion', '9vgkbm7fn/14.998', '', '', ''], // USA
                'Stroopwafel invasion in Morayfield': ['topic_StroopwafelInvasion', 'r7hv8p6d2/14.998', '', '', ''], // Australia
                'Stroopwafel invasion in New Westminster': ['topic_StroopwafelInvasion', 'c28xfy4xj/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // Canada
                'Stroopwafel invasion in Norlane': ['topic_StroopwafelInvasion', 'r1nxks295/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // Australia
                'Stroopwafel invasion in Onkaparinga Hills': ['topic_StroopwafelInvasion', 'r1f80ddey/14.998', '', '', ''], // Australia
                'Stroopwafel invasion in Ospel': ['topic_StroopwafelInvasion', 'u1h5gdgny/14.998', '', '', ''], // Netherlands
                'Stroopwafel invasion in Perth': ['topic_StroopwafelInvasion', 'qd66gpc0e/14.998', '', '', ''], // Australia
                'Stroopwafel invasion in Plympton': ['topic_StroopwafelInvasion', 'gbvnevyqm/14.998', '', '', ''], // United Kingdom
                'Stroopwafel invasion in Raleigh': ['topic_StroopwafelInvasion', 'dnrfx480t/14.998', '', '', ''], // USA
                'Stroopwafel invasion in Shepparton': ['topic_StroopwafelInvasion', 'r1x2uxm5r/14.998', '', '', ''], // Australia
                'Stroopwafel invasion in Thringstone': ['topic_StroopwafelInvasion', 'gcrh0updg/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''], // United Kingdom
                'Stroopwafel invasion in Vosselaar': ['topic_StroopwafelInvasion', 'u157znxun/14.998', '', '', ''], // Belgium
                'Stroopwafel invasion in Wonthaggi': ['topic_StroopwafelInvasion', 'r1ps2ge1w/14.998', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''] // Australia
            },
            'Australia': {
                'Stroopwafel invasion in Browns Plains': ['topic_StroopwafelInvasion', 'r7hfdck60/14.9981', '', '', ''],
                'Stroopwafel invasion in Dapto': ['topic_StroopwafelInvasion', 'r3g5z9k30/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''],
                'Stroopwafel invasion in Kelmscott': ['topic_StroopwafelInvasion', 'qd63rd421/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''],
                'Stroopwafel invasion in Morayfield': ['topic_StroopwafelInvasion', 'r7hv8p6d2/14.9981', '', '', ''],
                'Stroopwafel invasion in Norlane': ['topic_StroopwafelInvasion', 'r1nxks295/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''],
                'Stroopwafel invasion in Onkaparinga Hills': ['topic_StroopwafelInvasion', 'r1f80ddey/14.9981', '', '', ''],
                'Stroopwafel invasion in Perth': ['topic_StroopwafelInvasion', 'qd66gpc0e/14.9981', '', '', ''],
                'Stroopwafel invasion in Shepparton': ['topic_StroopwafelInvasion', 'r1x2uxm5r/14.9981', '', '', ''],
                'Stroopwafel invasion in Wonthaggi': ['topic_StroopwafelInvasion', 'r1ps2ge1w/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', '']
            },
            'Belgium': {
                'Stroopwafel invasion in Vosselaar': ['topic_StroopwafelInvasion', 'u157znxun/14.9981', '', '', '']
            },
            'Canada': {
                'Stroopwafel invasion in Brossard': ['topic_StroopwafelInvasion', 'f25f8m2hv/14.9981', '', '', ''],
                'Stroopwafel invasion in Georgetown': ['topic_StroopwafelInvasion', 'dpz0jxyv6/14.9981', '', '', ''],
                'Stroopwafel invasion in New Westminster': ['topic_StroopwafelInvasion', 'c28xfy4xj/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', '']
            },
            'Germany': {
                'Stroopwafel invasion in Berlin': ['topic_StroopwafelInvasion', 'u33e0rucx/14.9981', '', '', ''],
                'Stroopwafel invasion in Chemnitz': ['topic_StroopwafelInvasion', 'u311ncc6x/14.9981', '', '', ''],
                'Stroopwafel invasion in Meitingen': ['topic_StroopwafelInvasion', 'u0xspjjng/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', '']
            },
            'Hungary': {
                'Stroopwafel invasion in Felsőgalla': ['topic_StroopwafelInvasion', 'u2mn7yzxz/14.9981', '', '', '']
            },
            'Netherlands': {
                'Stroopwafel invasion in Arnhem': ['topic_StroopwafelInvasion', 'u1hpz6kq2/14.9981', '', '', ''],
                'Stroopwafel invasion in Gouda': ['topic_StroopwafelInvasion', 'u15rfnm03/14.9981', '', '', ''],
                'Stroopwafel invasion in Groningen': ['topic_StroopwafelInvasion', 'u1kwvu195/14.9981', '', '', ''],
                'Stroopwafel invasion in Hoofddorp': ['topic_StroopwafelInvasion', 'u173d4yds/14.9981', '', '', ''],
                'Stroopwafel invasion in Ospel': ['topic_StroopwafelInvasion', 'u1h5gdgny/14.9981', '', '', '']
            },
            'Sweden': {
                'Stroopwafel invasion in Götenborg': ['topic_StroopwafelInvasion', 'u60ryyzf8/14.9981', '', '', ''],
                'Stroopwafel invasion in Linköping': ['topic_StroopwafelInvasion', 'u67hj4225/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', '']
            },
            'UnitedKingdom': {
                'Stroopwafel invasion in Andover': ['topic_StroopwafelInvasion', 'gcngq3xm7/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''],
                'Stroopwafel invasion in Bedford': ['topic_StroopwafelInvasion', 'gcr8mrunx/14.9981', '', '', ''],
                'Stroopwafel invasion in Kingswood': ['topic_StroopwafelInvasion', 'gcnhxpp6s/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''],
                'Stroopwafel invasion in Plympton': ['topic_StroopwafelInvasion', 'gbvnevyqm/14.9981', '', '', ''],
                'Stroopwafel invasion in Thringstone': ['topic_StroopwafelInvasion', 'gcrh0updg/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', '']
            },
            'USA': {
                'Stroopwafel invasion in Desert Lodge': ['topic_StroopwafelInvasion', '9mvkbt7mw/14.9981', '', '', ''],
                'Stroopwafel invasion in Escondido': ['topic_StroopwafelInvasion', '9musx254q/14.9981', '', '', ''],
                'Stroopwafel invasion in Falling Waters': ['topic_StroopwafelInvasion', 'dr095u8tn/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''],
                'Stroopwafel invasion in Glen Oaks': ['topic_StroopwafelInvasion', '9mufvb1e5/14.9981', '', '', ''],
                'Stroopwafel invasion in Hagerstown': ['topic_StroopwafelInvasion', 'dr09wfndy/14.9981', '1UEf-b_7_VLaNJfRQeFck_uFJMJdnkaJO9g-7zJAn2lU', '', ''],
                'Stroopwafel invasion in MHQ': ['topic_StroopwafelInvasion', '9vgkbm7fn/14.9981', '', '', ''],
                'Stroopwafel invasion in Raleigh': ['topic_StroopwafelInvasion', 'dnrfx480t/14.9981', '', '', '']
            }
        },
        'The FAB': {
            'Germany': {
                'George - the Fab 4/2': ['topic_TheFABInTubingen', 'u0w7yp6un/14.998', '1whtNX40rfK72iTvKxaaEd5rZLpq6_iXZ5V6NSzJ4vZA', '', ''],
                'John - the Fab 4/1': ['topic_TheFABInTubingen', 'u0w7vzm9n/14.998', '', '2211', 'Germany_JohnTheFab41'],
                'Paul - the Fab 4/3': ['topic_TheFABInTubingen', 'u0w7yrd1n/14.998', '1wlcEVbnafMexotRJMsSHxFtWLaLl-hvg7gayoIOYBCs', '', ''],
                'Ringo - the Fab 4': ['topic_TheFABInTubingen', 'u0w7yn1s8/14.998', '1iljO6wikjSvOBmfUp4Qt9bxKCe9wSDheoMkYEVfyUn0', '', '']
            }
        },
        'Zeecret': {
            'Denmark': {
                'Zeecret, Appenæs': ['topic_Zeecret', 'u3b653rf2/14.998', '', '', ''],
                'Zeecret, Fensmark': ['topic_Zeecret', 'u3b6kqsbz/14.998', '', '', ''],
                'Zeecret, Frederiksberg': ['topic_Zeecret', 'u3b5nznf2/14.998', '', '', ''],
                'Zeecret, Hillerød': ['topic_Zeecret', 'u3by0xm2f/14.998', '', '', ''],
                'Zeecret, Sundby': ['topic_Zeecret', 'u38rt9mqj/14.998', '', '', ''],
                'Zeecret, Viby': ['topic_Zeecret', 'u3becrqvc/14.998', '', '', '']
            }
        }
    }
};

var gardensGroup2 = { // default gardens
    'by garden': {
        'GOTM': {
            'Australia': 'Laidley Bee Love',
            'Canada': 'Christmas in Ottawa',
            'Cyprus': 'Aphrodite`s Cat',
            'Denmark': 'Grenaa City`s Coat of Arms',
            'Finland': 'Kameleontti',
            'Germany': 'Charles Darwin',
            'Hungary': 'Goldfish',
            'Japan': 'Torii Gate',
            'Lithuania': 'Scared Kitty',
            'Netherlands': 'Flamingo @ Den Treek Leusden',
            'Poland': 'Zamek Piastów',
            'Slovakia': 'Trpaslík :: Gnomie Vrútky',
            'Spain': 'Wine O`Clock',
            'Switzerland': 'Owlgarden Zürich',
            'United Kingdom': 'EyUpMeDuck',
            'USA': 'O` Christmas Tree'
        },
        'Completed': {
            'Australia': 'Bee Flowers',
            'Belgium': 'Stroopwafel invasion in Vosselaar',
            'Canada': 'Skull',
            'China': 'Shenzhen M',
            'Croatia': 'Croatia Locket Heart',
            'Cyprus': 'Cyprus Piggy',
            'Denmark': 'F-Bomb - Hammel',
            'France': 'France`s First Player-made',
            'Finland': 'Kokkolan kurpitsainen',
            'Germany': 'Bullseye',
            'Greece': 'The Lighthouse of Chania',
            'Hungary': '10th Birthday Cake',
            'Japan': 'Osaka Octopus',
            'Jersey': 'St Ouen',
            'Lithuania': 'OZO Parkas',
            'Netherlands': 'Crossbows Beeckestijn',
            'New Zealand': 'Brooklyn Queen`s Gambit',
            'Norway': 'Kongsvinger Rainbow',
            'Poland': 'Jewel',
            'Portugal': 'Madeira Monumental',
            'Serbia': 'Japanse Maple',
            'Slovakia': 'Alien',
            'Sweden': 'Swedish Flag',
            'United Kingdom': 'Faversham Father Xmas',
            'USA': 'H Owl oween'
        },
        'empty spots': {
            'Australia': 'Queens Gambit - Horse',
            'Austria': 'Frauenkirchen Owl',
            'Belgium': 'Knokke-Heist',
            'Bosnia Herzegovina': 'Panonska Jezera Tuzla',
            'Canada': 'Gatineau FMG Garden',
            'Czechia': 'KM ZNAK',
            'Denmark': 'The Swan in Hillerød',
            'Finland': 'Nurmijärvi',
            'Germany': 'Tresor ICE Limburg',
            'Hungary': 'Miner Symbol',
            'Jersey': 'Jerzee Clan',
            'Latvia': 'Riga First',
            'Lithuania': 'Kaunas Basketball',
            'Luxembourg': 'Luxembourg Flag',
            'Netherlands': 'PacMunzee',
            'New Zealand': 'Auckland Pohutukawa Flower',
            'Norway': 'Ormen Lange',
            'Poland': 'Legnicki gołąbek',
            'Portugal': 'Porto Novo High Voltage',
            'Slovakia': 'Christmas Stable',
            'Spain': 'Palma de Mallorca - Official Flag',
            'Sweden': 'Stroopwafel invasion in Linköping',
            'Switzerland': 'Giddy Up Go',
            'United Kingdom': 'Canvey Island Crest',
            'USA': 'Munzee Logo'
        }
//         'emerald': { // https://www.munzeeblog.com/virtual-emerald-garden-locations/
//             'Australia': 'Sydney', // https://www.munzee.com/map/r3gx3wpsf/16
//             'Canada': 'Niagara Falls', // https://www.munzee.com/map/dpxv0emf5/16
//             'Czechia': 'Prague', // https://www.munzee.com/map/u2fhyu3k7/17
//             'Germany': 'Berlin', // https://www.munzee.com/map/u336zqeyb/16
//             'Hungary': 'Budapest', // https://www.munzee.com/map/u2mqrqbrr/17
//             'Netherlands': 'Amstelveen', // https://www.munzee.com/map/u173tupnx/16
//             'UK': 'Basingstoke', // https://www.munzee.com/map/gcp5xgg73/16
//             'USA': 'Fullerton', // https://www.munzee.com/map/9qh0gu3tt/16
//             'USA': 'Merritt Island', // https://www.munzee.com/map/djn97vzu8/15
//             'USA': 'St Mary’s', // https://www.munzee.com/map/dr25tj85z/16
//         }
    },
    'by city': {
        'Australia': {
            'Adelaide': 'Huntfield Heights Dog',
            'Brisbane': 'Queensland Koala', // [*]
            'Gatton': 'Gatton Arrows - Arrow1',
            'Laidley': 'Laidley Bees',
            'Laidley Heights': 'FlatterBee',
            'Melbourne': 'Pirate Pete`s Parrot',
            'Sydney': 'AussiePossum'
        },
        'Canada': {
            'Ottawa': 'Christmas in Ottawa', // [*]
            'Clarence-Rockland': 'Claire`s Candy Canes',
            'Vancouver': 'Mad March Pi'
        },
        'Denmark': {
            'Aarhus': 'True Forest Fish',
            'Grenaa': 'Nessie in Grenaa',
            'Hammel': 'Heart of Valentine',
            'Hillerød': 'Ghost in Hilleroed',
            'Silkeborg': 'Silkeborg Coat of Arms'
        },
        'Finland': {
            'Espoo': 'Mermaid',
            'Helsinki': 'Helsinki Colour',
            'Hyvinkää': 'Palmuranta',
            'Kokkola': 'Halkokarin evovene', // [*]
            'Lahti': 'Lahden Vaakuna',
            'Tampere': 'Tappara',
            'Turku': 'UUSI - Evopuisto'
        },
        'Germany': {
            'Aachen': 'Euro MVM Flags - Europe',
            'Berlin': 'Berlin Bat - Berliner Fledermaus',
            'Bielefeld': 'Charles Darwin', // [*]
            'Bonn': 'QR Code',
            'Karlsruhe': 'Flat-O-Fant',
            'Reutlingen': 'Smells like ZeeSpirit - Kurt Cobain',
            'Tübingen': 'John - the Fab 4/1'
        },
        'Hungary': {
            'Budapest': 'Flat Matt in Budapest',
            'Debrecen': 'Flower Carnival in Debrecen',
            'Kecskemét': 'Goat in Kecskemét',
            'Komárom': 'Flower at Fort Monostor',
            'Szeged': 'Votive Church',
            'Tatabánya': 'Miner Symbol'
        },
        'Lithuania': {
            'Kaišiadorys': 'Baltic Way 30',
            'Kaunas': 'Kaunas Magnet',
            'Vilnius': 'Scared Kitty'
        },
        'Netherlands': {
            'Amsterdam': 'Slak / Snail',
            'Beeckestijn': 'Lucky Clover',
            'Echt': 'EvoApple Ech',
            'Heerenveen': 'Museum Belvédère',
            'Lemmer': 'Groene Stroom', // [*]
            'Noordwijk': 'Superman vs Batman',
            'Schiedam': 'Honey Bee'
        },
        'New Zealand' : {
            'Auckland': 'Auckland Pohutukawa Flower' // [*]
        },
        'Poland': {
            'Legnica': 'Zamek Piastów',
            'Opole': 'Opole Rocks!',
            'Wroclaw': 'Reksio'
        },
        'Portugal': {
            'Funchal': 'High Voltage Madeira Island'
        },
        'Slovakia': {
            'Bratislava': 'Black Moth Squad',
            'Martin': 'Giraffe',
            'Vrútky': 'Edison Light Bulb'
        },
        'UnitedKingdom': {
            'Bournemouth': 'BeachUmbrella',
            'Cromer': 'Horatio the Hermit Crab',
            'London': 'Just Smile London',
            'Lowestoft': 'Every Colour',
            'Romsey': 'Romsey Rainbow Unicorn',
            'Sheringham': 'The Yellow Submarine'
        },
        'USA': {
            'Amesbury': 'Cherry Bomb',
            'Anaheim': 'Stormtrooper',
            'Apple Valley': 'The Apple Valley Apple',
            'Bloomington': 'MOA Christmas Card',
            'Burlington': 'North Carolina Jester Hat',
            'Cedar Rapids': 'Iowa Goldfinch',
            'Columbia': 'Mizzou Tiger',
            'Concord': 'Woodpecker',
            'Cottleville': 'Cottleville Dragonfly',
            'Decatur': 'Decatur Hearts',
            'Fort Worth': 'Fort Worth Longhorn',
            'Georgetown': 'G Pumpkin',
            'Greenville': 'Greenville Clover Leaf', // [*]
            'Kansas City': 'Picasso Rob',
            'Kirkwood': 'Kirkwood, Evolutions - 1',
            'Lakeland': 'Corgi',
            'Marion': 'O` Christmas Tree',
            'McKinney': 'Teenage Mutant Ninja Turtles',
            'Minneapolis': 'Super Bowl LII',
            'Montgomery': 'Caretta Sea Turtle',
            'O`Fallon': 'Walkie Talkie Watch',
            'Orlando': 'Lake Nona Longhorn',
            'Owensboro': 'Crossed Arrows Owensboro',
            'PlantCity': 'Sprinkle Cupcake',
            'Prattville': 'Prattville Pansy',
            'Saint Charles': 'STL Pirate Ship',
            'Saint Louis': 'Blues Munzee',
            'Saint Paul': 'Birthday Clown',
            'Saint Peters': 'Mother`s Day Basket',
            'Savage': 'Snoopy',
            'Watertown': 'Watertown Shammy',
            'Weatherford': 'Baby Groot!',
            'city_WebsterGroves': 'Frisco Train'
        }
    },
    'by owner': {
        '123xilef': {
            'all': 'Berlin - Capital of spies',
            'GOTM': 'Berlin Bat - Berliner Fledermaus',
            'completed': 'Colours of Berlin',
            'empty': 'Berlin Void & Maple Chess'
        },
        '321Cap': {
            'all': 'Newmarket Bowling', // [*]
            'completed': 'Remuera / SH1 Munzee Art',
            'empty': 'Howick Beach Boat'
        },
        'Balazs80': {
            'completed': 'Rijeka Gift - 2023 Christmas'
        },
        'Bambusznad': {
            'completed': 'Snoopy in Budapest'
        },
        'Belugue': {
            'all': 'Honeycombs-2 Schiedam',
            'GOTM': 'Honey Bee', // [*]
            'completed': 'Honeycombs Schiedam'
        },
        'BenandJules': {
            'all': 'EyUpMeDuck',
            'GOTM': 'EyUpMeDuck',
            'completed': 'Pastebucket Memorial'
        },
        'Bonn': {
            'all': 'Colors @Bonn',
            'GOTM': 'Munzee Logo',
            'completed': 'Event Pin'
        },
        'BonnieB1': {
            'all': 'Queensland Koala',
            'GOTM': 'Laidley Bee Love',
            'completed': 'TicTacMunzee!',
            'empty': 'TwoBeeOrKnot?'
        },
        'Brandikorte': {
            'all': 'Sunset Cowboy',
            'GOTM': 'The Saginaw Heart',
            'completed': 'Bobby the Zombie'
//            'empty': 'Weatherford Emerald Square'
        },
        'Chandabelle': {
            'all': 'Gatton Arrows - Arrow3',
            'GOTM': 'Abstatt Tomcat', // [*]
            'completed': 'Gatton Arrows - Arrow1',
            'empty': 'Peace'
        },
        'CoalCracker7': {
            'GOTM': 'Corgi',
            'completed': 'Lakeland Candy Corn'
        },
        'delfin13': {
            'completed': 'QR'
        },
        'denali0407': {
            'all': 'Egyptian Cat',
            'GOTM': 'Fort Worth Longhorn',
            'completed': 'Ellis Creek Owl',
            'empty': 'Tied up in Knotz in Weatherford...Ireland?'
        },
        'destrandman': {
            'all': 'Escher vs Mondriaan',
            'GOTM': 'Boogie Woogie', // [*]
            'completed': 'Go Green Noordwijk'
        },
        'FRLK': {
            'all': 'Jewel Face', // [*]
            'completed': 'Krúsbôgetún it Kanaal',
            'empty': 'EVO Keunst Tún'
        },
        'geckofreund': {
            'all': 'Ringo - the Fab 4',
            'GOTM': 'John - the Fab 4/1', // [*]
            'completed': 'Mixed Garden RT',
            'empty': 'George - the Fab 4/2'
        },
        'geomatrix': {
            'all': 'XI Birthday Mad Hatter',
            'GOTM': 'MOA Christmas Card',
            'completed': 'Super Bowl LII'
//            'empty': 'April Showers'
        },
        'Grusierp': {
            'all': 'Piernikowa Chatka', // [*]
            'completed': 'Pisanka Wielkanocna',
            'empty': 'Legnicki gołąbek'
        },
        'HiTechMD': {
            'all': 'Snowman - West Galloway',
            'completed': 'October Pumpkin',
            'empty': 'Rocket23'
        },
        'jacobsedk': {
            'all': 'Silkeborg Coat of Arms',
            'completed': 'Silkeborg Mario',
            'empty': 'Randers Snowy'
        },
        'Jeffeth': {
            'all': 'Halloween in Ottawa',
            'GOTM': 'Christmas in Ottawa',
            'completed': 'Spring in Ottawa'
        },
        'Jesnou': {
            'all': 'Helsinki Colour', // [*]
            'GOTM': '7th Birthday',
            'completed': 'Easter Bunny',
            'empty': 'Reksun Trail'
        },
        'katinka3': {
            'all': 'Christmas Candle', // [*]
            'completed': 'Kokkolan kurpitsainen',
            'empty': 'Meritullin evopuisto'
        },
        'kepke3': {
            'all': 'Crazy Frog',
            'GOTM': 'Trpaslík :: Gnomie Vrútky',
            'completed': 'Flora Orientalis in Ždiar',
            'empty': 'Void pin Vrútky'
            },
        'knotmunz': {
            'all': 'Jewel of a Heart',
            'completed': 'Lets Talk A-bundt Love',
            'empty': 'Tied up in Knotz in Round Rock'
        },
        'Laczy76': {
            'all': 'Flower at Fort Monostor',
            'GOTM': 'Ladybug',
            'completed': 'Surprise in Budapest'
        },
        'Lissu': {
            'all': 'Tappara', // [*]
            'completed': 'Kalevankankaan sydän',
            'empty': 'Kukkapuisto'
        },
        'llamah': {
            'empty': 'West Des Moines Pac Man'
        },
        'Lumen': {
            'all': 'My World', // [*]
            'completed': 'Welonka',
            'empty': 'PacMunzee'
        },
        'Maattmoo': {
            'all': 'Maattmoo`s Moo',
            'GOTM': 'Xmas Knole Deer',
            'completed': 'Faversham Father Xmas',
            'empty': 'Love Lane Patchwork'
        },
        'malof': {
            'all': 'Kokkolan Vaakuna', // [*]
            'completed': 'Kokkola Clown',
            'empty': 'Jeppis'
        },
        'mandello': {
            'all': 'Helsinki Colour',
            'GOTM': '7th Birthday',
            'completed': 'Espoon vaakuna Herald of Espoo', // [*]
            'empty': 'Espoon vaakuna Herald of Espoo (Flats)'
        },
        'markayla': {
            'all': 'Marion 4 Leaf Clover',
            'GOTM': 'O` Christmas Tree',
            'completed': 'Marion',
            'empty': 'CF Pumpkin'
        },
        'Marnic': {
            'all': 'Lucky Clover',
            'completed': 'QR-Spaarnwoude',
            'empty': 'Unicorn Hoorn'
        },
        'MetteS': {
            'all': 'True Forest Fish',
            'GOTM': 'Nessie in Grenaa',
            'completed': 'True Forest Surprise',
            'empty': 'Randers Regnskov'
        },
        'Mon4ikaCriss': {
            'all': 'Chick, Vrútky',
            'GOTM': 'Trpaslík :: Gnomie Vrútky',
            'completed': 'Crazy Frog'
        },
        'Neesu': {
            'all': '7th Birthday',
            'GOTM': 'Helsinki Colour', // [*]
            'completed': 'Mermaid',
            'empty': 'Evolution Field'
        },
        'Neloras': {
            'all': 'Hungry Bat Terry',
            'GOTM': 'Jewels Note',
            'completed': '1st Day Evo',
            'empty': 'Fortress Maze Party'
        },
        'NikitaStolk': {
            'completed': 'Pompeblêd Palet'
        },
        'NoahCache': {
            'all': 'Wedding Day', // [*]
            'completed': 'Mixed Garden RT',
            'empty': 'Are you X-Zee-perienced'
        },
        'Norbee97': {
            'all': 'Grail',
            'completed': 'Debreceni kereszt',
            'empty': 'Electric Debrecen'
        },
        'paupau': {
            'GOTM': 'Charles Darwin'
        },
        'PeachesnCream': {
            'empty': 'West Des Moines Shark'
        },
        'Peter1980': {
            'all': 'West London Jewel',
            'completed': 'Heathrow Crossbow Arrow',
            'empty': 'Heathrow Flat Squares'
        },
        'purplecourgette': {
            'GOTM': 'Masquerade Hare'
        },
        'RePe': {
            'all': 'Kameleontti',
            'GOTM': 'Kameleontti',
            'completed': 'Evopuisto',
            'empty': 'BioÖtökkä'
        },
        'Rikitan': {
            'all': 'Night Vision Agent',
            'GOTM': 'Black Moth Squad',
            'completed': 'Charge Bratislava',
            'empty': 'KUMA Bear Rača'
        },
        'rodrico101': {
            'all': '80`s Cube',
            'GOTM': 'Cedar Rapids Pumpkin',
            'completed': 'CR Jones Park Birthday 7',
            'empty': 'CR Frankenstein'
        },
        'Roger6102': {
            'completed': 'EvoApple Ech'
        },
        'RUJA': {
            'all': 'Grenaa Ferry',
            'GOTM': 'Grenaa City`s Coat of Arms',
            'completed': 'Grenaa Sapphire and Amethyst',
            'empty': 'Sonic Randers'
        },
        'Sivontim': {
            'all': 'Drive',
            'GOTM': '7th Birthday', // [*]
            'completed': 'Crazy Ghost',
            'empty': 'Evolution Field'
        },
        'squirreledaway': {
            'all': 'Lakeville`s Sea Turtle',
            'completed': 'The Apple Valley Apple',
            'empty': 'Lakeville`s Sea Turtle (Flats)'
        },
        'stineB': {
            'GOTM': 'Fasanerie Darmstadt'
        },
        'taiska1255': {
            'all': 'Sharpei', // [*]
            'completed': 'Turun Yliopisto',
            'empty': 'Kuralan Kylämäen Evolato'
        },
        'tartu61': {
            'all': 'Palmuranta',
            'GOTM': 'Palmuranta',
            'empty': 'Hyvinkää'
        },
        'tcguru': {
            'all': 'Kameleontti',
            'GOTM': 'Kameleontti',
            'completed': 'Evopuisto',
            'empty': 'BioÖtökkä'
        },
        'tlmeadowlark': {
            'all': 'The Lucky Fungi',
            'GOTM': 'Caretta Sea Turtle',
            'completed': 'Commerce Barnyard'
        },
        'volki2000': {
            'all': 'Flat-O-Fant',
            'GOTM': 'Flat-O-Fant',
            'empty': 'Karlsruhe - Stadt des Rechts'
        },
        'WandelKuub': {
            'completed': 'Erensteiner Easter Eggs 2'
        },
        'Waves117': {
            'all': 'HeartBeatz',
            'GOTM': 'Shire Horse Sanctuary',
            'completed': 'Cromers Gingerbread Man',
            'empty': 'Virtual Love'
        },
        'zsomborpeto': {
            'all': 'Pegasus',
            'GOTM': 'Pegasus',
            'completed': 'Crossbow on Hármashatárhegy'
        }
    },
    'by topic': {
        'Buckeye`s European Invasion': {
            'Europa': 'Ohio Flag - London',
            'France': 'France`s First Player-made - Dinan',
            'Netherlands': 'Netherlands Tulip - Amstelveen',
            'United Kingdom': 'Ohio Flag - London'
        },
        'F-Bomb': {
            'World': 'F-Bomb - Budapest',
            'Denmark': 'F-Bomb - Hammel',
            'Germany': 'F-Bomb - Berlin',
            'Hungary': 'F-Bomb - Budapest',
            'USA': 'F-Bomb - McKinney'
        },
        'KC Night Lights': {
            'USA': 'KC Night Lights #1'
        },
        'memorial': {
            'World': 'Griff Memorial'
//            'USA': 'HGH2 Memorial'
        },
        'official Emerald': {
            'World': 'Emerald in Chesterfield',
            'Australia': 'Emerald in Melbourne',
            'United Kingdom': 'Emerald in Greenwich',
            'USA': 'Emerald in Anchorage'
        },
        'seasons, holidays': {
            'Canada': 'Halloween in Ottawa',
            'USA': 'Autumn Tree'
        },
        'Stroopwafel invasion': {
            'World': 'Stroopwafel invasion in Felsőgalla',
            'Australia': 'Stroopwafel invasion in Wonthaggi',
            'Belgium': 'Stroopwafel invasion in Vosselaar',
            'Canada': 'Stroopwafel invasion in New Westminster',
            'Germany': 'Stroopwafel invasion in Berlin',
            'Hungary': 'Stroopwafel invasion in Felsőgalla',
            'Netherlands': 'Stroopwafel invasion in Gouda',
            'Sweden': 'Stroopwafel invasion in Götenborg',
            'UnitedKingdom': 'Stroopwafel invasion in Kingswood',
            'USA': 'Stroopwafel invasion in MHQ'
        },
        'The FAB': {
            'Germany': 'John - the Fab 4/1'
        },
        'Zeecret': {
            'Denmark': 'Zeecret, Hillerød'
        }
    }
};
var gardensGroup1 = { // default countries
    'by garden': {
        'GOTM': 'Canada',
        'Completed': 'USA',
        'empty spots': 'Hungary'
        // 'emerald': 'Hungary'
    },
    'by city': {
        'Australia': 'Brisbane',
        'Canada': 'Ottawa',
        'Denmark': 'Grenaa',
        'Finland': 'Kokkola',
        'Germany': 'Bielefeld',
        'Hungary': 'Szeged',
        'Lithuania': 'Vilnius',
        'Netherlands': 'Lemmer',
        'New Zealand' : 'Auckland',
        'Poland': 'Wroclaw',
        'Portugal': 'Funchal',
        'Slovakia': 'Bratislava',
        'UnitedKingdom': 'London',
        'USA': 'Greenville'
    },
    'by owner': {
        '123xilef': 'GOTM',
        '321Cap': 'all',
        'Balazs80': 'completed',
        'Bambusznad': 'completed',
        'Belugue': 'GOTM',
        'BenandJules': 'GOTM',
        'Bonn': 'GOTM',
        'BonnieB1': 'GOTM',
        'Brandikorte': 'GOTM',
        'Chandabelle': 'GOTM',
        'CoalCracker7': 'GOTM',
        'delfin13': 'completed',
        'denali0407': 'GOTM',
        'destrandman': 'GOTM',
        'FRLK': 'all',
        'geckofreund': 'GOTM',
        'geomatrix': 'GOTM',
        'Grusierp': 'all',
        'HiTechMD': 'completed',
        'jacobsedk': 'all',
        'Jeffeth': 'GOTM',
        'Jesnou': 'all',
        'katinka3': 'all',
        'kepke3': 'GOTM',
        'knotmunz': 'all',
        'Laczy76': 'GOTM',
        'Lissu': 'all',
        'llamah': 'empty',
        'Lumen': 'all',
        'Maattmoo': 'GOTM',
        'malof': 'all',
        'mandello': 'completed',
        'markayla': 'GOTM',
        'Marnic': 'completed',
        'MetteS': 'GOTM',
        'Mon4ikaCriss': 'GOTM',
        'Neesu': 'GOTM',
        'Neloras': 'GOTM',
        'NikitaStolk': 'completed',
        'NoahCache': 'all',
        'Norbee97': 'empty',
        'paupau': 'GOTM',
        'PeachesnCream': 'empty',
        'Peter1980': 'completed',
        'purplecourgette': 'GOTM',
        'RePe': 'GOTM',
        'Rikitan': 'GOTM',
        'rodrico101': 'GOTM',
        'Roger6102': 'completed',
        'RUJA': 'GOTM',
        'Sivontim': 'GOTM',
        'squirreledaway': 'all',
        'stineB': 'GOTM',
        'taiska1255': 'completed',
        'tartu61': 'GOTM',
        'tcguru': 'GOTM',
        'tlmeadowlark': 'GOTM',
        'volki2000': 'GOTM',
        'WandelKuub': 'completed',
        'Waves117': 'GOTM',
        'zsomborpeto': 'GOTM'
    },
    'by topic': {
        'Buckeye`s European Invasion': 'Europa',
        'F-Bomb': 'Hungary',
        'KC Night Lights': 'USA',
        'memorial': 'World',
        'official Emerald': 'World',
        'seasons, holidays': 'Canada',
        'Stroopwafel invasion': 'Hungary',
        'The FAB': 'Germany',
        'Zeecret': 'Denmark'
    }
};
var gardensGroup0 = { // selections and default selections
    'by garden': 'empty spots',
    'by city': 'Hungary',
    'by owner': 'Norbee97',
    'by topic': 'seasons, holidays'
};

var selection0Name = '';
var selection1Name = '';
var selection2Name = '';
var gardenName = '';
// var cityName = '';
var titleData = {};

function createfilter4Map() {
    var loadingProgressText = document.getElementById('loadingProgressText').innerHTML
    var temp = loadingProgressText.search('/');
    var currentProgress = loadingProgressText.substr(0, temp);
    var allProgress = loadingProgressText.substr(temp + 1);
    document.getElementById("patient").style.display = display;
    if(currentProgress == allProgress) { // load all
        var visible = '';
        iconCounter = {};
        filterIcons.empty();
        buttonbar.empty();
        newmenu.empty();

//        if(isEmpty(titleData)) {
//            fetch("https://hunzee.github.io/www/title.json")
//                .then(response => { return response.json(); })
//                .then(jsondata => {titleData = jsondata; })
//                .catch(error => {console.log(error); });
//            console.log(isEmpty(titleData));
//        }

        if(isEmpty(titleData)) {
            var jqxhr = $.ajax('https://hunzee.github.io/www/title.json')
            .done(function(data) {
                titleData = data;
            });
//            console.log(isEmpty(titleData));
        }

        //Collection
        for (var munzeeID in mapMarkers) {
            //img src
            imgSRC = mapMarkers[munzeeID]._element.style.backgroundImage.replace("url(\"","").replace("\")","");
            if (typeof iconCounter[imgSRC] == 'undefined') {
                iconCounter[imgSRC] = 1;
            } else {
                iconCounter[imgSRC]++;
            }
        }

        // Creation
        // new buttons
        var length = buttonsGroups.length - 1;
        var iPointer = 0;
        for (iLoop in buttonsGroups) {
            buttonbar.append('<label class="btn btn-success ' + iLoop + '" id="class_' + iLoop + '" style="display: inline-block"><input class="button" type="checkbox" id="check_' + iLoop + '">' + iLoop + '</label>');
            if(iPointer < length) {
                buttonbar.append('<br class="visible-xs">');
            }
            iPointer ++;
        }

        if(setGarden(window.location.href)) {
             // default
            selection0Name = 'by garden';
            selection1Name = 'empty spots';
            selection2Name = gardensGroup1[selection0Name][selection1Name];
            gardenName = gardensGroup2[selection0Name][selection1Name][selection2Name];
            visible = 'none';
        } else {
            buttons['gardens'] = true;
            visible = 'block';
//            gardenPoints = initCoordinates(selection2Name + '_' + gardenName);
            if(gardenPoints.length == 0) {
                if(selection0Name == 'by city') {
                    reLoad(selection1Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]);
                } else if(selection0Name == 'by owner') {
                    reLoad(gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]);
                } else {
                    reLoad(selection2Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]);
                }
            }
            if(0 < gardensData[selection0Name][selection1Name][selection2Name][gardenName][4].length) {
                document.getElementById("gotm").style.display = visible;
                document.getElementById("gotmlink").href = "https://www.munzeeblog.com/" + GOTMlinks[gardensData[selection0Name][selection1Name][selection2Name][gardenName][3]];
                document.getElementById("gotmpic").src = "https://hunzee.github.io/www/img/" + gardensData[selection0Name][selection1Name][selection2Name][gardenName][4] + ".png";
            }
//            else {
//                console.log(gardenPoints.length);
//            }
        }



        // Main Groups
        temp = '';
        for (iLoop in categories) {
//            temp += '<option value="' + gardensGroup1[iLoop] + '">' + gardensGroup1[iLoop] + '</option>';
            temp += '<option value="' + iLoop + '">' + iLoop + '</option>';
        }
        newmenu.append('<select id="selection0list" name="selection0list" style="margin-top: 10px; margin-right: 5px; width: 115px; display: ' + visible + ';">' + temp + '</select>');
        // Groups - GOTM/Completed/empty .or. Countries (by city)
        temp = '';
        for (iLoop in gardensGroup1[selection0Name]) {
//            temp += '<option value="' + gardensGroup1[iLoop] + '">' + gardensGroup1[iLoop] + '</option>';
            temp += '<option value="' + iLoop + '">' + iLoop + '</option>';
        }
        newmenu.append('<select id="selection1list" name="selection1list" style="margin-top: 10px; margin-right: 5px; width: 115px; display: ' + visible + ';">' + temp + '</select>');
        // Countries
        temp = '';
        for (iLoop in gardensGroup2[selection0Name][selection1Name]) {
            temp += '<option value="' + iLoop + '">' + iLoop + '</option>';
        }
        newmenu.append('<select id="selection2list" name="selection2list" style="margin-top: 10px; margin-right: 5px; width: 115px; display: ' + visible + ';">' + temp + '</select>');
        // Gardens
        temp = '';
//        for (iLoop in gardensData[selection1Name][selection2Name]) {
//            temp += '<option value="' + iLoop + '">' + gardensData[selection1Name][selection2Name][iLoop][0] + '</option>';
//            temp += '<option value="' + iLoop + '">' + gardensData[selection1Name][selection2Name][key] + '</option>';
//        }
//        $.each(gardensData[selection1Name][selection2Name], function(key, value) {
        $.each(gardensData[selection0Name][selection1Name][selection2Name], function(key) {
            temp += '<option value="' + key + '">' + key + '</option>';
        });

        // newmenu.append('<select id="gardenslist" name="gardenslist" style="margin-top: 10px; margin-right: 5px; width: 115px; display: ' + visible + ';">' + temp + '</select>');
        newmenu.append('<select id="gardenslist" name="gardenslist" title="' + title + '" style="margin-top: 10px; margin-right: 5px; width: 115px; display: ' + visible + ';"><option value="ertek">Érték</option></select>');
//        $('#gardenslist').replaceWith('<select id="gardenslist" name="gardenslist" title="' + title + '" style="margin-top: 10px; margin-right: 5px; width: 115px; display: ' + visible + ';">' + temp + '</select>');
        $('#gardenslist').replaceWith('<select id="gardenslist" name="gardenslist" title="' + '' + '" style="margin-top: 10px; margin-right: 5px; width: 115px; display: ' + visible + ';">' + temp + '</select>');

        document.getElementById("selection0list").value = selection0Name;
        document.getElementById("selection1list").value = selection1Name;
        document.getElementById("selection2list").value = selection2Name;
        document.getElementById("gardenslist").value = gardenName;

        var sheetUrl = gardensData[selection0Name][selection1Name][selection2Name][gardenName][2];
        if(0 < sheetUrl.length && buttons['gardens']) {
            visible = 'block';
        } else {
            visible = 'none';
        }
        newmenu.append('<div id="sheetButton" style="display: ' + visible + ';"><input id="sheet" style="margin-top: 10px; margin-right: 5px; width: 115px;" class="btn btn-success btn-medium-green btn-xs" type="button" value="Spreadsheet"></div>');

        if(changePng !== null) {
            visible = 'block';
        } else {
            visible = 'none';
        }
        newmenu.append('<div id="correctButton" style="display: ' + visible + ';"><input id="correct" style="margin-top: 10px; margin-right: 5px; width: 115px;" class="btn btn-success btn-medium-green btn-xs" type="button" value="Correctly"></div>');

        visible = 'none';
        newmenu.append('<div id="uncorrectButton" style="display: ' + visible + ';"><input id="correct" style="margin-top: 10px; margin-right: 5px; width: 115px;" class="btn btn-success btn-medium-green btn-xs" type="button" value="With errors"></div>');

        for (imgSRC in iconCounter) {
            //new element
            filterIcons.append (
'<div class="pull-left filter_icon">' +
'<div>' + iconCounter[imgSRC] + '</div>' + // counter
'<img class="haideris ' + (disabledIcons.indexOf(imgSRC) >= 0 ? 'ico_hide' : 'ico_show') + '" src=' + imgSRC + ' />' +
'</div>'
            );
        }
        filterIcons.append('<div style="clear:both;height: 1px; overflow: hidden"></div>');

        updateMapIcons();

        if(window.location.href == mapUrl + 'u2m7nwxzx/12.1') { //home
            changeButtons(true, playerButtons);
            buttons['player'] = true;
            changeGroups('hide', buttonsGroups['player']);
        }

        if(typeof gardenPush !== 'undefined') {
//            console.log(gardenPush);
            var pushName;
            for (pushName in gardenPush) {
                if(gardenPush[pushName] == 'bouncers') {
                    bouncers();
                } else if(gardenPush[pushName] == 'flats') {
                    flats();
                } else if(gardenPush[pushName] == 'colors') {
                    colors();
                } else if(gardenPush[pushName] == 'evolutions') {
                    evolutions();
                } else if(gardenPush[pushName] == 'zodiacs') {
                    zodiacs();
                } else if(gardenPush[pushName] == 'gaming') {
                    gaming();
                } else if(gardenPush[pushName] == 'jewels') {
                    jewels();
                } else if(gardenPush[pushName] == 'weapons') {
                    weapons();
                } else if(gardenPush[pushName] == 'mysteries') {
                    mysteries();
                } else if(gardenPush[pushName] == 'resellers') {
                    resellers();
                } else if(gardenPush[pushName] == 'other') {
                    other();
                } else { // nem csoport
                    var index = buttonsName.indexOf(gardenPush[pushName]);
                    if (index == -1) { // ha egyik sem, akkor egy icon neve
                        hideoneicon(gardenPush[pushName]);
                    }
                }
            }
        }
        // if(changePng !== null) {
        //     changeIcons();
        // }


updateButtons();
updateIconsRow();

        if(!isEmpty(titleData)) {
            var title = '';
            var selectionData = 'hülyeség';
            if(selection0Name == 'by city') {
                title = ((titleData[selection1Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]] === undefined) ? '' : titleData[selection1Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]]);
                selectionData = selection1Name + '_' + gardenName;
            } else if(selection0Name == 'by owner') {
                title = ((titleData[gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]] === undefined) ? '' : titleData[gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]]);
                selectionData = selection1Name + '_' + gardenName;
            } else {
                title = ((titleData[selection2Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]] === undefined) ? '' : titleData[selection2Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]]);
                selectionData = selection2Name + '_' + gardenName;
            }
            var element = document.getElementById("gardenslist");
            element.setAttribute("title", title);

            console.log(selectionData);
            gardenPush = PushData[selectionData];


//console.log('odaírtam');
        }

//        document.getElementById("patient").style.display = "none";
//        if(document.getElementById('check_gardens').checked) {
//            wait(4000);
//        } else {
//            wait(500);
//        }

        var munzeek = Object.keys(mapMarkers).length;
        console.log(munzeek);
        if (munzeek < 1000) {
            wait(munzeek - 100);
        } else if (munzeek < 2000) {
            wait(munzeek / 2 - 200);
        } else if (munzeek < 4000) {
            wait(munzeek / 3 - 400);
        } else if (munzeek < 8000) {
            wait(munzeek / 4 - 800);
        } else if (munzeek < 12000) {
            wait(munzeek / 5 - 1600);
        } else {
            wait(munzeek / 5);
        }

    }
}

function changeIcons() {
    for (var key in changePng) {
//        console.log(key);
        var curr = $("[data-index='" + key + "']" ).css('background-image');
//        console.log(curr);
        var oldname = urlClean(curr);
        var url = curr.replace("url(\"","").replace("\")","").replace("https://","").replace("/images/pins/","").replace(oldname,"").replace(".png","");
//        console.log(url);
//        console.log('------');
        $( "[data-index='" + key + "']" ).css('background-image', 'url(https://' + url + '/images/pins/' + changePng[key] + '.png)');
    }
}

function updateMapIcons() {
    for (var mID in mapMarkers) {
var t = mID;
//var t = mapMarkers[mID];
//        var curr = mapMarkers[mID]._element.style.backgroundImage.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
        var curr = urlClean(mapMarkers[mID]._element.style.backgroundImage);
        if ($.inArray(curr, disabledIcons) == -1) {
            $( "[data-index='" + mID + "']" ).css('display', 'block');
        } else {
            $( "[data-index='" + mID + "']" ).css('display', 'none');
        }
        if(buttons['gardens']) {
            var imgCoordinate = mapMarkers[mID]._lngLat.lat + '_' + mapMarkers[mID]._lngLat.lng;
            var index = gardenPoints.indexOf(imgCoordinate);
            if (index == -1) { // not found
                $( "[data-index='" + mID + "']" ).css('display', 'none');
            }
        }
    }
}

function updateIconsRow() {
    var icons = document.querySelectorAll(".haideris");
    for (var i in icons) {
        var elem = icons[i];
        if (typeof elem == 'object') {
//            elem = elem.src.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
            elem = urlClean(elem.src);
        }
        if ($.inArray(elem, disabledIcons) == -1) {
            icons[i].className = "haideris ico_show";
        } else {
            icons[i].className = "haideris ico_hide";
        }
    }
}

function updateButtons() {
    for (iLoop in buttonsGroups) {
        if(buttons[iLoop]) {
            document.getElementById('class_' + iLoop).classList.add('active');
            document.getElementById('check_' + iLoop).checked = true;
        }
        else{
            document.getElementById('class_' + iLoop).classList.remove('active');
            document.getElementById('check_' + iLoop).checked = false;
        }
    }
}

function urlClean(url) {
    return url.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
}

function hideoneicon(curr) {
    var icons = document.querySelectorAll(".haideris");
    var elem;
    for (var i in icons) {
        elem = icons[i];
        if (elem == curr) {
            icons[i].className = "haideris ico_hide";
        }
    }
    if (disabledIcons.indexOf(curr) == -1) { // még nincs rejtve
        disabledIcons.push(curr);
    }
    updateMapIcons();
}

// hide
$(document).on('click', '.ico_show.haideris', function (e) {
    console.log('hide');
//    var curr = $(this).attr('src');
//    var curr = $(this).attr('src').replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
    var curr = urlClean($(this).attr('src'));
    console.log(curr);
    var elem;

    if (e.ctrlKey) {
//        console.log(e.target.src.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.","").replace("https://munzee.freetls.",""));
//        console.log(e.target.src);

        var icons = document.querySelectorAll(".haideris");
        disabledIcons = [];
        for (var ic in iconCounter) {
//            console.log(ic); //munzee type
//            if (ic == curr) {
//            elem = ic.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
            elem = urlClean(ic);
            if (elem != curr) {
//                disabledIcons.push(ic);
                disabledIcons.push(elem);
            }
        }

        for (var i in icons) {
            elem = icons[i];
            if (typeof elem == 'object') {
//                elem = elem.src.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
                elem = urlClean(elem.src);
            }
//            if (icons[i].src != curr) {
            if (elem != curr) {
                icons[i].className = "haideris ico_hide";
            } else {
                icons[i].className = "haideris ico_show";
            }
        }
        changeButtons(false, buttonsName);
    } else { //nincs megnyomva a ctrl billentyű
        $(this).removeClass('ico_show').addClass('ico_hide');
        if (disabledIcons.indexOf(curr) == -1) {
            disabledIcons.push(curr);
        }
    }
    updateMapIcons();
});

// show
$(document).on('click', '.ico_hide.haideris', function (e) {
    console.log('show');
//    var curr = $(this).attr('src');
//    var curr = $(this).attr('src').replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
    var curr = urlClean($(this).attr('src'));
//    console.log(curr);
    var elem;

    if (e.ctrlKey) {
        var icons = document.querySelectorAll(".haideris");
        disabledIcons = [];
        for (var ic in iconCounter) {
//            if (ic == curr) {
//            elem = ic.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
            elem = urlClean(ic);
            if (elem == curr) {
//                disabledIcons.push(ic);
                disabledIcons.push(elem);
            }
        }

        for (var i in icons) {
            elem = icons[i];
            if (typeof elem == 'object') {
//                elem = elem.src.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace(".png","");
                elem = urlClean(elem.src);
            }
//            if (icons[i].src == curr) {
            if (elem == curr) {
                icons[i].className = "haideris ico_hide";
            } else {
                icons[i].className = "haideris ico_show";
            }
        }
        changeButtons(false, buttonsName);
    } else {
        $(this).removeClass('ico_hide').addClass('ico_show');
        var index = disabledIcons.indexOf(curr);
        if (index !== -1) {
            disabledIcons.splice(index, 1);
        }
    }
    updateMapIcons();
});

// player button
$(document).on('click', '.player.btn-success.btn', function (e) {
//document.getElementById("patient").style.display = "block";
    var curr = document.getElementById('check_player').checked;
    if(curr) {
        changeButtons(false, playerButtons);
        buttons['player'] = false;
        changeGroups('show', buttonsGroups['player']);
    }
    else {
        changeButtons(true, playerButtons);
        buttons['player'] = true;
        changeGroups('hide', buttonsGroups['player']);
    }
    updateIconsRow();
//document.getElementById("patient").style.display = "none";
});

// bouncers button
$(document).on('click', '.bouncers.btn-success.btn', function (e) {
    bouncers();
//    var curr = document.getElementById('check_bouncers').checked;
//    if(curr) {
//        buttons['bouncers'] = false;
//        changeGroups('show', buttonsGroups['bouncers']);
//    }
//    else {
//        buttons['bouncers'] = true;
//        changeGroups('hide', buttonsGroups['bouncers']);
//    }
//    updateIconsRow();
});

function bouncers() {
    var curr = document.getElementById('check_bouncers').checked;
    if(curr) {
        buttons['bouncers'] = false;
        changeGroups('show', buttonsGroups['bouncers']);
    }
    else {
        buttons['bouncers'] = true;
        changeGroups('hide', buttonsGroups['bouncers']);
    }
    updateIconsRow();
};

// weapons button
$(document).on('click', '.weapons.btn-success.btn', function (e) {
    weapons();
//    var curr = document.getElementById('check_weapons').checked;
//    if(curr) {
//        buttons['weapons'] = false;
//        changeGroups('show', buttonsGroups['weapons']);
//    }
//    else {
//        buttons['weapons'] = true;
//        changeGroups('hide', buttonsGroups['weapons']);
//    }
//    updateIconsRow();
});

function weapons(){
    var curr = document.getElementById('check_weapons').checked;
    if(curr) {
        buttons['weapons'] = false;
        changeGroups('show', buttonsGroups['weapons']);
    }
    else {
        buttons['weapons'] = true;
        changeGroups('hide', buttonsGroups['weapons']);
    }
    updateIconsRow();
};

// flats button
$(document).on('click', '.flats.btn-success.btn', function (e) {
    flats();
//    var curr = document.getElementById('check_flats').checked;
//    if(curr) {
//        buttons['flats'] = false;
//        changeGroups('show', buttonsGroups['flats']);
//    }
//    else {
//        buttons['flats'] = true;
//        changeGroups('hide', buttonsGroups['flats']);
//    }
//    updateIconsRow();
});

function flats() {
    var curr = document.getElementById('check_flats').checked;
    if(curr) {
        buttons['flats'] = false;
        changeGroups('show', buttonsGroups['flats']);
    }
    else {
        buttons['flats'] = true;
        changeGroups('hide', buttonsGroups['flats']);
    }
    updateIconsRow();
};

// colors button
$(document).on('click', '.colors.btn-success.btn', function (e) {
    colors();
//    var curr = document.getElementById('check_colors').checked;
//    if(curr) {
//        buttons['colors'] = false;
//        changeGroups('show', buttonsGroups['colors']);
//    }
//    else {
//        buttons['colors'] = true;
//        changeGroups('hide', buttonsGroups['colors']);
//    }
//    updateIconsRow();
});

function colors() {
    var curr = document.getElementById('check_colors').checked;
    if(curr) {
        buttons['colors'] = false;
        changeGroups('show', buttonsGroups['colors']);
    }
    else {
        buttons['colors'] = true;
        changeGroups('hide', buttonsGroups['colors']);
    }
    updateIconsRow();
};

// evolutions button
$(document).on('click', '.evolutions.btn-success.btn', function (e) {
    evolutions();
//    var curr = document.getElementById('check_evolutions').checked;
//    if(curr) {
//        buttons['evolutions'] = false;
//        changeGroups('show', buttonsGroups['evolutions']);
//    }
//    else {
//        buttons['evolutions'] = true;
//        changeGroups('hide', buttonsGroups['evolutions']);
//    }
//    updateIconsRow();
});

function evolutions() {
    var curr = document.getElementById('check_evolutions').checked;
    if(curr) {
        buttons['evolutions'] = false;
        changeGroups('show', buttonsGroups['evolutions']);
    }
    else {
        buttons['evolutions'] = true;
        changeGroups('hide', buttonsGroups['evolutions']);
    }
    updateIconsRow();
};

// zodiacs button
$(document).on('click', '.zodiacs.btn-success.btn', function (e) {
    zodiacs();
//    var curr = document.getElementById('check_zodiacs').checked;
//    if(curr) {
//        buttons['zodiacs'] = false;
//        changeGroups('show', buttonsGroups['zodiacs']);
//    }
//    else {
//        buttons['zodiacs'] = true;
//        changeGroups('hide', buttonsGroups['zodiacs']);
//    }
//    updateIconsRow();
});

function zodiacs() {
    var curr = document.getElementById('check_zodiacs').checked;
    if(curr) {
        buttons['zodiacs'] = false;
        changeGroups('show', buttonsGroups['zodiacs']);
    }
    else {
        buttons['zodiacs'] = true;
        changeGroups('hide', buttonsGroups['zodiacs']);
    }
    updateIconsRow();
};

// destination button
$(document).on('click', '.destinations.btn-success.btn', function (e) {
    var curr = document.getElementById('check_destinations').checked;
    if(curr) {
        buttons['destinations'] = false;
        changeGroups('show', buttonsGroups['destinations']);
    }
    else {
        buttons['destinations'] = true;
        changeGroups('hide', buttonsGroups['destinations']);
    }
    updateIconsRow();
});

// places button
$(document).on('click', '.places.btn-success.btn', function (e) {
    var curr = document.getElementById('check_places').checked;
    if(curr) {
        buttons['places'] = false;
        changeGroups('show', buttonsGroups['places']);
    }
    else {
        buttons['places'] = true;
        changeGroups('hide', buttonsGroups['places']);
    }
    updateIconsRow();
});

// gaming button
$(document).on('click', '.gaming.btn-success.btn', function (e) {
    gaming();
//    var curr = document.getElementById('check_gaming').checked;
//    if(curr) {
//        buttons['gaming'] = false;
//        changeGroups('show', buttonsGroups['gaming']);
//    }
//    else {
//        buttons['gaming'] = true;
//        changeGroups('hide', buttonsGroups['gaming']);
//    }
//    updateIconsRow();
});

function gaming() {
    var curr = document.getElementById('check_gaming').checked;
    if(curr) {
        buttons['gaming'] = false;
        changeGroups('show', buttonsGroups['gaming']);
    }
    else {
        buttons['gaming'] = true;
        changeGroups('hide', buttonsGroups['gaming']);
    }
    updateIconsRow();
};

// scatters button
$(document).on('click', '.scatters.btn-success.btn', function (e) {
    var curr = document.getElementById('check_scatters').checked;
    if(curr) {
        buttons['scatters'] = false;
        changeGroups('show', buttonsGroups['scatters']);
    }
    else {
        buttons['scatters'] = true;
        changeGroups('hide', buttonsGroups['scatters']);
    }
});

// mysteries button
$(document).on('click', '.mysteries.btn-success.btn', function (e) {
    mysteries();
//    var curr = document.getElementById('check_mysteries').checked;
//    if(curr) {
//        buttons['mysteries'] = false;
//        changeGroups('show', buttonsGroups['mysteries']);
//    }
//    else {
//        buttons['mysteries'] = true;
//        changeGroups('hide', buttonsGroups['mysteries']);
//    }
//    updateIconsRow();
});

function mysteries() {
    var curr = document.getElementById('check_mysteries').checked;
    if(curr) {
        buttons['mysteries'] = false;
        changeGroups('show', buttonsGroups['mysteries']);
    }
    else {
        buttons['mysteries'] = true;
        changeGroups('hide', buttonsGroups['mysteries']);
    }
    updateIconsRow();
};

// jewels button
$(document).on('click', '.jewels.btn-success.btn', function (e) {
    jewels();
//    var curr = document.getElementById('check_jewels').checked;
//    if(curr) {
//        buttons['jewels'] = false;
//        changeGroups('show', buttonsGroups['jewels']);
//    }
//    else {
//        buttons['jewels'] = true;
//        changeGroups('hide', buttonsGroups['jewels']);
//    }
//    updateIconsRow();
});

function jewels() {
    var curr = document.getElementById('check_jewels').checked;
    if(curr) {
        buttons['jewels'] = false;
        changeGroups('show', buttonsGroups['jewels']);
    }
    else {
        buttons['jewels'] = true;
        changeGroups('hide', buttonsGroups['jewels']);
    }
    updateIconsRow();
};

// resellers button
$(document).on('click', '.resellers.btn-success.btn', function (e) {
    resellers();
//    var curr = document.getElementById('check_resellers').checked;
//    if(curr) {
//        buttons['resellers'] = false;
//        changeGroups('show', buttonsGroups['resellers']);
//    }
//    else {
//        buttons['resellers'] = true;
//        changeGroups('hide', buttonsGroups['resellers']);
//    }
//    updateIconsRow();
});

function resellers() {
    var curr = document.getElementById('check_resellers').checked;
    if(curr) {
        buttons['resellers'] = false;
        changeGroups('show', buttonsGroups['resellers']);
    }
    else {
        buttons['resellers'] = true;
        changeGroups('hide', buttonsGroups['resellers']);
    }
    updateIconsRow();
};

// tourism button
$(document).on('click', '.tourism.btn-success.btn', function (e) {
    var curr = document.getElementById('check_tourism').checked;
    if(curr) {
        buttons['tourism'] = false;
        changeGroups('show', buttonsGroups['tourism']);
    }
    else {
        buttons['tourism'] = true;
        changeGroups('hide', buttonsGroups['tourism']);
    }
    updateIconsRow();
});

// temporarys button
$(document).on('click', '.temporarys.btn-success.btn', function (e) {
    var curr = document.getElementById('check_temporarys').checked;
    if(curr) {
        buttons['temporarys'] = false;
        changeGroups('show', buttonsGroups['temporarys']);
    }
    else {
        buttons['temporarys'] = true;
        changeGroups('hide', buttonsGroups['temporarys']);
    }
    updateIconsRow();
});

// other button
$(document).on('click', '.other.btn-success.btn', function (e) {
    other();
//    var curr = document.getElementById('check_other').checked;
//    if(curr) {
//        buttons['other'] = false;
//        changeGroups('show', buttonsGroups['other']);
//    }
//    else {
//        buttons['other'] = true;
//        changeGroups('hide', buttonsGroups['other']);
//    }
//    updateIconsRow();
});

function other() {
    var curr = document.getElementById('check_other').checked;
    if(curr) {
        buttons['other'] = false;
        changeGroups('show', buttonsGroups['other']);
    }
    else {
        buttons['other'] = true;
        changeGroups('hide', buttonsGroups['other']);
    }
    updateIconsRow();
};
// gardens button
$(document).on('click', '.gardens.btn-success.btn', function (e) {
    var curr = document.getElementById('check_gardens').checked;
    if(curr) {
        document.getElementById("selection0list").style.display = "none";
        document.getElementById("selection1list").style.display = "none";
        document.getElementById("selection2list").style.display = "none";
        document.getElementById("gardenslist").style.display = "none";
        document.getElementById('sheetButton').style.display = "none";
        document.getElementById("gotm").style.display = "none";
        for (iLoop in buttonsGroups) {
            buttons[iLoop] = false;
            buttonsName.push(iLoop);
            document.getElementById('class_' + iLoop).classList.remove('active');
            document.getElementById('check_' + iLoop).checked = false;
        }
        buttons['gardens'] = false;
        document.getElementById('class_gardens').classList.add('active');
        //        sheetButton = false;

        disabledIcons = [];
        updateMapIcons();
    }
    else {
        var url = window.location.href;
        if (url != mapUrl + gardensData[selection0Name][selection1Name][selection2Name][gardenName][1]) { // new garden
            window.open(mapUrl + gardensData[selection0Name][selection1Name][selection2Name][gardenName][1],"_self"); // reload
        }
        else {
            document.getElementById("selection0list").style.display = "block";
            document.getElementById("selection1list").style.display = "block";
            document.getElementById("selection2list").style.display = "block";
            document.getElementById("gardenslist").style.display = "block";
            changeButtons(false, buttonsName);
            buttons['gardens'] = true;
//            setGardensButton = false;

            if(0 < gardensData[selection0Name][selection1Name][selection2Name][gardenName][2].length) {
                document.getElementById('sheetButton').style.display = "block";
//                sheetButton = true;
            }
            if(0 < gardensData[selection0Name][selection1Name][selection2Name][gardenName][4].length) {
                document.getElementById("gotm").style.display = "block";
            }

            disabledIcons = [];
//            gardenPoints = initCoordinates(selection2Name + '_' + gardensData[selection1Name][selection2Name][gardenName][0]);



//            reLoad(selection2Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]);
            if(selection0Name == 'by city') {
                reLoad(selection1Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]);
            } else if(selection0Name == 'by owner') {
                reLoad(gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]);
            } else {
                reLoad(selection2Name.replace(' ', '') + '_' + gardensData[selection0Name][selection1Name][selection2Name][gardenName][0]);
            }



            var icons = document.querySelectorAll(".haideris");
            for (var i in icons) {
                icons[i].className = "haideris ico_show";
            }
            updateMapIcons();


        }
    }
//    updateMapIcons();
    updateIconsRow();
});

// sheet button
$(document).on('click', '#sheetButton', function (e) {
    var s0 = document.getElementById("selection0list").value
    var s1 = document.getElementById("selection1list").value
    var s2 = document.getElementById("selection2list").value
    var ga = document.getElementById("gardenslist").value
    var baseUrl;
    var sheetUrl = gardensData[s0][s1][s2][ga][2];
    if(0 < sheetUrl.search('&ithint=file')) {
        baseUrl = MSheetUrl;
    } else {
        baseUrl = GSheetUrl;
    }
    if(0 < sheetUrl.length) {
        window.open(baseUrl + sheetUrl,"_blank");
    }
});

$(document).on('click', '#correctButton', function (e) {
    $( "[id='correctButton']" ).css('display', 'none');
    $( "[id='uncorrectButton']" ).css('display', 'block');
    for (var key in changePng) {
        var curr = $("[data-index='" + key + "']" ).css('background-image');
        if(typeof curr !== 'undefined') {
            var oldname = urlClean(curr);
            var url = curr.replace("url(\"","").replace("\")","").replace("https://","").replace("/images/pins/","").replace(oldname,"").replace(".png","");
            $( "[data-index='" + key + "']" ).css('background-image', 'url(https://' + url + '/images/pins/' + changePng[key][0] + '.png)');
        }
    }
});

$(document).on('click', '#uncorrectButton', function (e) {
    $( "[id='correctButton']" ).css('display', 'block');
    $( "[id='uncorrectButton']" ).css('display', 'none');
    for (var key in changePng) {
        var curr = $("[data-index='" + key + "']" ).css('background-image');
        if(typeof curr !== 'undefined') {
            var oldname = urlClean(curr);
            var url = curr.replace("url(\"","").replace("\")","").replace("https://","").replace("/images/pins/","").replace(oldname,"").replace(".png","");
            $( "[data-index='" + key + "']" ).css('background-image', 'url(https://' + url + '/images/pins/' + changePng[key][1] + '.png)');
        }
    }
});

$(document).on('change', '#selection0list', function (e) {
    var temp = '';
    selection0Name = document.getElementById("selection0list").value;

    selection1Name = gardensGroup0[selection0Name]; //default group in categories
    for (iLoop in gardensGroup1[selection0Name]) {
        temp += '<option value="' + iLoop + '">' + iLoop + '</option>';
    }
    $('#selection1list').replaceWith('<select id="selection1list" name="selection1list" style="margin-top: 10px; margin-right: 5px; width: 115px; display: block;">' + temp + '</select>');
    document.getElementById("selection1list").value = selection1Name;

    selection2Name = gardensGroup1[selection0Name][selection1Name]; //default garden in group
    temp = '';
    for (iLoop in gardensGroup2[selection0Name][selection1Name]) {
        temp += '<option value="' + iLoop + '">' + iLoop + '</option>';
    }
    $('#selection2list').replaceWith('<select id="selection2list" name="selection2list" style="margin-top: 10px; margin-right: 5px; width: 115px; display: block;">' + temp + '</select>');
    document.getElementById("selection2list").value = selection2Name;

    gardenName = gardensGroup2[selection0Name][selection1Name][selection2Name]; //default garden in country
    temp = '';
    $.each(gardensData[selection0Name][selection1Name][selection2Name], function(key) {
        temp += '<option value="' + key + '">' + key + '</option>';
    });
    $('#gardenslist').replaceWith('<select id="gardenslist" name="gardenslist" style="margin-top: 10px; margin-right: 5px; width: 115px; display: block;">' + temp + '</select>');
    document.getElementById("gardenslist").value = gardenName;

    var s0 = document.getElementById("selection0list").value
    var s1 = document.getElementById("selection1list").value
    var s2 = document.getElementById("selection2list").value
    var ga = document.getElementById("gardenslist").value
    window.open(mapUrl + gardensData[s0][s1][s2][ga][1],"_self");
});

$(document).on('change', '#selection1list', function (e) {
    var temp = '';
    selection1Name = document.getElementById("selection1list").value;

    selection2Name = gardensGroup1[selection0Name][selection1Name]; //default garden in group
    for (iLoop in gardensGroup2[selection0Name][selection1Name]) {
        temp += '<option value="' + iLoop + '">' + iLoop + '</option>';
    }
    $('#selection2list').replaceWith('<select id="selection2list" name="selection2list" style="margin-top: 10px; margin-right: 5px; width: 115px; display: block;">' + temp + '</select>');
    document.getElementById("selection2list").value = selection2Name;

    gardenName = gardensGroup2[selection0Name][selection1Name][selection2Name]; //default garden in country
    temp = '';
//    for (iLoop in gardensData[selection1Name][selection2Name]) {
//        temp += '<option value="' + iLoop + '">' + gardensData[selection1Name][selection2Name][iLoop][0] + '</option>';
//    }
    $.each(gardensData[selection0Name][selection1Name][selection2Name], function(key) {
        temp += '<option value="' + key + '">' + key + '</option>';
    });

    $('#gardenslist').replaceWith('<select id="gardenslist" name="gardenslist" style="margin-top: 10px; margin-right: 5px; width: 115px; display: block;">' + temp + '</select>');
    document.getElementById("gardenslist").value = gardenName;

    var s0 = document.getElementById("selection0list").value
    var s1 = document.getElementById("selection1list").value
    var s2 = document.getElementById("selection2list").value
    var ga = document.getElementById("gardenslist").value
    window.open(mapUrl + gardensData[s0][s1][s2][ga][1],"_self");
});

$(document).on('change', '#selection2list', function (e) {
    var temp = '';
    selection1Name = document.getElementById("selection1list").value;
    selection2Name = document.getElementById("selection2list").value;
    gardenName = gardensGroup2[selection0Name][selection1Name][selection2Name]; //default garden in country
//    for (iLoop in gardensData[selection1Name][selection2Name]) {
//        temp += '<option value="' + iLoop + '">' + gardensData[selection1Name][selection2Name][iLoop][0] + '</option>';
//    }
    $.each(gardensData[selection0Name][selection1Name][selection2Name], function(key) {
        temp += '<option value="' + key + '">' + key + '</option>';
    });
    $('#gardenslist').replaceWith('<select id="gardenslist" name="gardenslist" style="margin-top: 10px; margin-right: 5px; width: 115px; display: block;">' + temp + '</select>');
    document.getElementById("gardenslist").value = gardenName;

    var s0 = document.getElementById("selection0list").value
    var s1 = document.getElementById("selection1list").value
    var s2 = document.getElementById("selection2list").value
    var ga = document.getElementById("gardenslist").value
    window.open(mapUrl + gardensData[s0][s1][s2][ga][1],"_self");
});

$(document).on('change', '#gardenslist', function (e) {
    var s0 = document.getElementById("selection0list").value
    var s1 = document.getElementById("selection1list").value
    var s2 = document.getElementById("selection2list").value
    var ga = document.getElementById("gardenslist").value
    //console.log(gardensData[c][g][1]);
    window.open(mapUrl + gardensData[s0][s1][s2][ga][1],"_self");
});


function setGarden(url) {
    if(setGardensButton) {
        setGardensButton = false;
        return false;
    } else {
        for (var mLoop in categories) {
            for (var gLoop in gardensData[mLoop]) {
                for (var cLoop in gardensData[mLoop][gLoop]) {
                    for (var jLoop in gardensData[mLoop][gLoop][cLoop]) {
                        if(mapUrl + gardensData[mLoop][gLoop][cLoop][jLoop][1] == url) {
                            selection0Name = mLoop;
                            selection1Name = gLoop;
                            selection2Name = cLoop;
                            gardenName = jLoop;
                            // gardenName = gardensData[iLoop][jLoop][0];
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

// function del_array(del_arr) {
//     var index;
//     var show = [];
//     for (var elem in del_arr) {
//         index = disabledIcons.indexOf(del_arr[elem]);
//         if (index != -1) { // found
//             disabledIcons.splice(index, 1);
//             show.push(del_arr[elem]);
//         }
//     }
//     return show;
// }

function icons_show(show_arr) {
    var icons = document.querySelectorAll(".haideris");
    var icons_src = [];
    var index;
    for (var i in icons) {
        icons_src.push(icons[i].src);
    }
    for (var item in show_arr) {
        index = icons_src.indexOf(show_arr[item]);
        if (index != -1) { // found
            icons[index].className = "haideris ico_show";
        }
    }
}

// function add_array(add_arr) {
//     var index;
//     var hide = [];
//     for (var elem in add_arr) {
//         index = disabledIcons.indexOf(add_arr[elem]);
//         if(index == -1) { // not found
//             disabledIcons.push(add_arr[elem]);
//             hide.push(add_arr[elem]);
//         }
//     }
//     return hide;
// }

function icons_hide(hide_arr) {
    var icons = document.querySelectorAll(".haideris");
    var icons_src = [];
    var index;
    for (var i in icons) {
        icons_src.push(icons[i].src);
    }
    for (var item in hide_arr) {
        index = icons_src.indexOf(hide_arr[item]);
        if (index != -1) { // found
            icons[index].className = "haideris ico_hide";
        }
    }
}

function changeButtons(value, button_arr) {
    for (iLoop in button_arr) {
        buttons[button_arr[iLoop]] = value;
    }
    updateButtons();
}

function changeGroups(value, groups_arr) {
    var elem;
    var index;
    var change = [];
    var classString = '';
    var icons = document.querySelectorAll(".haideris");
    var icons_src = [];
    for (iLoop in icons) {
        if (typeof icons[iLoop] == 'object') {
//            icons_src.push(icons[iLoop].src.replace("url(\"","").replace("\")","").replace("https://munzee.global.ssl.fastly.net/images/pins/","").replace("https://munzee.freetls.fastly.net/images/pins/","").replace("",".png"));
            icons_src.push(urlClean(icons[iLoop].src).replace("",".png"));
        }
    }

    if(value == 'show') {
        for (iLoop in groups_arr) {
            for (elem in munzeeGroups[groups_arr[iLoop]]) {
                index = disabledIcons.indexOf(munzeeGroups[groups_arr[iLoop]][elem]);
                if (index != -1) { // found
                    disabledIcons.splice(index, 1);
                    change.push(munzeeGroups[groups_arr[iLoop]][elem]);
                }
            }
        }
        classString = "haideris ico_show";
    }
    else { // hide
        for (iLoop in groups_arr) {
            for (elem in  munzeeGroups[groups_arr[iLoop]]) {
                index = disabledIcons.indexOf(munzeeGroups[groups_arr[iLoop]][elem]);
                if(index == -1) { // not found
                    disabledIcons.push( munzeeGroups[groups_arr[iLoop]][elem]);
                    change.push( munzeeGroups[groups_arr[iLoop]][elem]);
                }
            }
        }
        classString = "haideris ico_hide";
    }
    for (iLoop in change) {
        index = icons_src.indexOf(change[iLoop]);
        if (index != -1) { // found
            icons[index].className = classString;
        }
    }
    updateMapIcons();
}

function reLoad(country_garden) {
    $.ajax({url: 'https://hunzee.github.io/www/js/' + country_garden + '.json'})
        .done(function(data) {
        gardenPoints = data['latlon'];
//        console.log(gardenPoints);
    });
    if ($.inArray(country_garden, PngData) != -1) { // ha szerepel benne, akkor be kell tölteni
        console.log('correct betöltése');
        $.ajax({url: 'https://hunzee.github.io/www/js/' + country_garden + '_Correct.json'})
            .done(function(data) {
            changePng = data['correct'];
        });
    }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function wait(number) {
    setTimeout(
        function() {
            document.getElementById("patient").style.display = "none";
        }, number);
}

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}

$(document).ajaxSuccess(createfilter4Map);
