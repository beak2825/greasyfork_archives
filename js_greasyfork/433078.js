// ==UserScript==
// @name         Munzee Map Filters
// @namespace    http://tampermonkey.net/
// @version      23.08.08.001
// @description  New way of catagorized filters
// @author       CzPeet
// @license      MIT
// @match        https://www.munzee.com/specials*
// @match        https://www.munzee.com/map*
// @icon         https://www.google.com/s2/favicons?domain=munzee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433078/Munzee%20Map%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/433078/Munzee%20Map%20Filters.meta.js
// ==/UserScript==

$('head').append($("<style> .filterimg{height: 32px; margin-left: 3px; margin-right: 3px;} .filterdisabled{filter: grayscale(100%); opacity: 0.7;}  </style>"));

var isSpecialMapSite = document.location.href.includes('specials');
var isMapLoading = false;
var imgPrefix = "https://munzee.global.ssl.fastly.net/images/pins/";
var filterImgsContainer = null;
var filterIMGS = [];
var rawFilterIMGS = [];

var categoryMainImages = ["frogcubimal","godzeelagardenhedge","gardenhedge","dinerjukebox","aceofhearts","aceofspades","aceofclubs","aceofdiamonds","sandstonepetrock","pizzabase","tophat","gardenflamingo","festivefeathers","megamouthful","otterpup", "s83Gnwh9i0Wyr4bFQh41z", "retiredunicorn", "icedragon", "poseidon", "treefolk", "flatrob", "beachflatrob", "phantomflatrob", "tuli", "zombietuli", "nomad", "sirprizewheel", "vikerkaar", "diamond", "spyderbot", "gardengnome", "gnomearcheryhood", "skyland10", "premiumskyland10", "boxjellyfish", "bones", "fire", "poivirtualgarden", "zodiac-sun", "chinese_zodiac", "egyptianzodiacsun", "celticzodiacfilter", "virtual_rainbow", "longsword", "mystery", "walkietalkiewatch", "qrewzee", "quizvirtual"];
var categorizedFilterOrder = ["Cubimals","GardenHedge","GardenHedgeScatter","JukeBox","CardsOfHeart","CardsOfSpades","CardsOfClubs","CardsOfDiamonds","StonePets","PizzaParts","Hats","Flamingos","Feathers","TongueTwisterDay","BabyAnimals", "Mythologicals", "RetiredMyths", "AlternaMyths", "ModernMyths", "StorylandMyth", "FlatFriends", "FancyFlats", "PhantomFlats", "PouchCreations", "ZombiePouchs", "Nomads", "Gaming", "FunfinityStones", "Jewels", "MechZBouncers", "GardenGnomes", "GardenGnomeHats", "Destinations", "PremiumDestinations", "EvoBouncers", "Evoluations", "Scatters", "Places", "WesternZodiacs", "ChineseZodiacs", "EgyptianZodiacs", "CelticZodiac", "ColouredVirtuals", "ClanWeapons", "Mysteries", "Zeecrets", "Misc", "UnCategorized"];

var categorizedFilterObject = {};
categorizedFilterObject.Cubimals=["rubecubimal","greeterbotcubimal","foxcubimal","ilmenskiejonescubimal","frogcubimal","rookcubimal","smugglercubimal","chickrcubimal","bureaucratcubimal","firebogcubimal","fireflycubimal","emo-bearcubimal","yeticubimal","maintenancebotcubimal","cactuscubimal","gnomecubimal","cactuscubimal","chickcubimal"];
categorizedFilterObject.GardenHedge=["gardenhedge","godzeelagardenhedge","rabbitgardenhedge","kangaroogardenhedge","dragongardenhedge","beargardenhedge","spacemanateegardenhedge","froggardenhedge","swangardenhedge","swanflower","fishgardenhedge","unicorngardenhedge","liongardenhedge"];
categorizedFilterObject.GardenHedgeScatter=["gardenhedge","firelily","bunnybloom","kangaroopaws","dragonlily","teddybearsunflower","alienflower","johnnyjumpupflower","waterlilyflower","hydrangeaflower","dandelionflower"];
categorizedFilterObject.Flamingos=["gardenflamingo","newyeargardenflamingo","astronautgardenflamingo","queen'sguardsmangardenflamingo","aussieexplorergardenflamingo","goldminergardenflamingo","valentinesgardenflamingo","luckygardenflamingo","foolishgardenflamingo","graduategardenflamingo","marchharegardenflamingo","birthdaygardenflamingo","alohagardenflamingo","motoristgardenflamingo","oktoberfestgardenflamingo","flaminghost","giftinggardenflamingo","gobblinggardenflamingo","flamingofloatie","unicornflamingofloatie"];
categorizedFilterObject.Feathers=["festivefeathers","spaceflightfeathers","bearskinfeathers","crikeyfeathers","flannelfeathers","lovelyfeathers","fortunefeathers","funnyfeathers","goldsealfeathers","madfeathers","confettifeathers","tropicalfeathers","fearlessfeathers","bavarianfeathers","spookyfeathers","holly-dayfeathers","paperfeathers","flocktail","frozenflocktail"];
categorizedFilterObject.GardenGnomes=["gardengnome","archerygardengnome","astronautgardengnome","aussieexplorergardengnome","awardshowgardengnome","baseballgardengnome","basketballgardengnome","cricketgardengnome","footballgardengnome","goldminergardengnome","icehockeygardengnome","queen'sguardsmangardengnome","runninggardengnome","skateboardinggardengnome","soccergardengnome","cyclinggardengnome","esportsgardengnome","skiinggardengnome","stonegardengnome","newyearsevegardengnome","madhattergardengnome"];
categorizedFilterObject.GardenGnomeHats=["gnomearcheryhood","gnomeastronauthelmet","gnomeexplorerhat","10thmunzeebirthdayhat","gnomecatcherscap","gnomenogginnet","gnomeclubcap","gnometouchdowntopper","gnomeminerhat","gnomehockeyhelmet","gnomebearskinhat","gnomeheadphones","gnomeheelfliphat","gnomeheaderhat","cyclingcasquette","gnomegamingheadset","gnometoquetopper","gnomecountdowncap","madhattergnomehat"];
categorizedFilterObject.Mythologicals=["s83Gnwh9i0Wyr4bFQh41z","theunicorn","hippocampunicorn","battleunicorn","candycornunicorn","skeleunicorn","skatingunicorn","k9G2vYr7tzE9jbF24p1es","leprechaun","dwarfleprechaun","goblinleprechaun","leprecorn","ladyleprechaun","u8bD2jH1vosFq9lmR3x82","dragon","chinesedragon","wyverndragon","midnightdragon","j2b8M9stR1zogH9w1Yve6","yeti","reptoidyeti","lycanthropeyeti","monsteryeti","joggingyeti","whiterabbit","l9fJ2nY74naE7hf1wZ9ju","faun","centaurfaun","krampusfaun","fardarrigfaun","kingofheartsfaun","fitnessfaun","n3bT8xUw29Lvrp4Nsw01nb","hydra","cerberushydra","cthulhuhydra","oillipheisthydra","skelehydra","n4K2c8hdP5qy3Fx8hfDw8","legacypegasus","pegasus","alicornpegasus","griffinpegasus","nightmarepegasus","q8xo3F1Md0F2s9wK8cTe1m","cyclops","balorcyclops","minotaurcyclops","recyclops","skelecyclops","h3sOn8cF1x9pG4buf18Seb","mermaid","hotspringmermaid","melusinemermaid","merrymermaid","skelemermaid","aquarobicsmermaid","d9H2nFq8p4Vyrh1Au7kxef","fairy","dryadfairy","wildfirefairy","sugarplumfairy","wF8b2z9fH3Qpr7nGd8kYw3","legacybanshee","banshee","harpybanshee","witchbanshee","queenofheartsbanshee","ghostofchristmasfuture","a8F3j91g0xQxrG2MsaC5pd","legacynymph","nymph","elfnymph","vampirenymph","snowqueen"];
categorizedFilterObject.RetiredMyths=["retiredunicorn","retiredleprechaun","retireddragon","retiredyeti","retiredfaun","retiredhydra","retiredpegasus","retiredcyclops","retiredmermaid","retiredfairy","retiredbanshee","retirednymph"];
categorizedFilterObject.AlternaMyths=["cherub","chimera","fairygodmother","firepegasus","gnomeleprechaun","gorgon","icedragon","motherearth","ogre","rainbowunicorn","sasquatchyeti","siren"];
categorizedFilterObject.ModernMyths=["aphrodite","glasses","shell-phone","poseidon","trident","lifebuoy","hades","bident","firestarter","zeus","multimeter","lightningbolt"];
categorizedFilterObject.StorylandMyth=["treefolk","jabberwock","owlbear","dodecahedron","deye"];
categorizedFilterObject.FlatFriends=["flatrob","flatmatt","flatlou","flathammock","flatdhs","flatdiscgolfbasket","flatflashlight","flattypewriter","flatmurray","flatrum","flatcats","backtozeefuturetape","flatfindertape","qretaceouscamptape","specterdirectortape","flatvan"];
categorizedFilterObject.FancyFlats=["robastzee","beachflatrob","coldflatrob","tuxflatrob","face-offflatmatt","footyflatmatt","matt'erupflatmatt","internationellesflatlou","polkadotflatlou","teamgbflatlou"];
categorizedFilterObject.PhantomFlats=["phantomflatrob","phantomflatmatt","phantomflatlou"];
categorizedFilterObject.PouchCreations=["tuli","tuliferno","tulimber","gleamingtuli","gleamingtuliferno","gleamingtulimber","vesi","vesial","vesisaur","gleamingvesi","gleamingvesial","gleamingvesisaur","muru","muruchi","murutain","gleamingmuru","gleamingmuruchi","gleamingmurutain","mitmegu","jootmegu","lokemegu","rohimegu","murinmegu","ohkmegu","urgasmegu","koobas","kartus","kabuhirm","pimedus","puffle","puflawn","pufrain","magnetus","elekjoud","elekter","elektrivool","hadavale","sparbee","sparfox"];
categorizedFilterObject.ZombiePouchs=["zombietuli","zombievesi","zombiemuru","zombiepimedus","zombiepuffle","zombiemagnetus","zombieelekter"];
categorizedFilterObject.Nomads=["nomad","nomadvirtual","nomadmystery","jewelthiefnomad","bellhopnomad","piratenomad","warriornomad","travelernomad","seasonalnomad","virtualflatnomad","coupechampionnomad","virtualzeecretagentnomad","zeecretagentnomad","virtualgamingnomad","gamingnomad","virtualjewelthiefnomad","virtualwarriornomad","virtualbellhopnomad","jason4zeesnomad","killermask"];
categorizedFilterObject.Gaming=["surprise","prizewheel","scatter","rockpaperscissors","bowlingball","urbanfit","joystickphysical","joystickvirtual","sirprizewheel","maplechessset","walnutchessset"];
categorizedFilterObject.FunfinityStones=["akvamariin","ametust","oniks","roosa","rubiin","safiir","smaragd","teemant","topaas","tsitriin","vikerkaar"];
categorizedFilterObject.Jewels=["diamond","ruby","virtualemerald","aquamarinemunzee","topaz","virtual_amethyst","pinkdiamond","virtualsapphire","virtualcitrine","virtualonyx"];
categorizedFilterObject.MechZBouncers=["spyderbot","tr33t0pp3r","abominablesn0wmachine","sn0wbomb","arcticlasershark","botwurst","carafeborg","cybersaurusrex","cyborgsanta","dronut","fr057y","geologgersrumbot","gingermechman","goldenlasershark","goldncoinsrumbot","gwrench","h3adl3ssh0rs3man","kingc0g","lasershark","loc04lmotive","mechanic4k3","monk3y","mumm33","negsrumbot","prim8","rud01ph","s4rc0ph4gus","sc4rab","scgsrumbot","steinbot","krampbot","31f","reindroid","breadbot","toast33","rougebot","heartthrobots","obot","xbot","eros404","l0v3bug","shamrocknrolla","blarneybeats","m0th3rb04rd","c00k13s","fathertim3","hourglass","bananaborg","p33l","p3n9u1n","m4ck3rel","emperorp3n9u1n","kingm4ck3rel","r3x-0-skeleton","f0ssil", "bl0ss0m", "sun", "7ul1p", "r053", "paintedr053", "m1lkman", "s33dl1n9", "spr0u7", "c4t3rp1ll4r", "butt3rfry", "cappi", "ch3shirecat", "robocado", "zee-3p0", "tintopper", "arf2d2","leashsaber","h0ta1rballoon","pyropellar","countcalcula","battery","chugboat","ancore","lanchop","turkey","turkeyring","y1n","y4ng","y1ny4ng","sc4l3","str1p3","b00mbox","t4p3","freddifr0g","bloterfly","t0t0","rubyscripter","wingedmonkey","twist3dsist3r","psyclone","d4rthvardeman","lasersaber","pr1nc3sslou-a","bikebuns","kitchens1nk","pl8","sugarsentry","pepperminuteman","screwge","candlestick","runedtable","runedstaff"];
categorizedFilterObject.Destinations=["vacationcondo","timesharemunzee","skyland","skyland1","skyland2","skyland3","skyland4","skyland5","skyland6","skyland7","skyland8","skyland9","skyland10","skyland11","skyland12","skyland13","skyland14","treehouse","treehouse1","treehouse2","treehouse3","treehouse4","treehouse5","treehouse6","treehouse7","treehouse8","treehouse9","treehouse10","treehouse11","treehouse12","treehouse13","treehouse14","scrapstar","scrapstar1","scrapstar2","scrapstar3","scrapstar4","scrapstar5","scrapstar6","scrapstar7","scrapstar8","scrapstar9","scrapstar10","scrapstar11","scrapstar12","scrapstar13","scrapstar14","3starresort","4starresort","5starresort","motel","1starmotel","2starmotel","3starmotel","hotel","2starhotel","3starhotel","4starhotel","tpobpub","tpobpub1","tpobpub2","tpobpub3","tpobpub4","tpobpub5","tpobpub6","tpobpub7","tpobpub8","tpobpub9","tpobpub10","tpobpub11","tpobpub12","teapob","teapob1","teapob2","teapob3","teapob4","teapob5","teapob6","teapob7","gingerbouncehouse","gingerbouncehouse1","gingerbouncehouse2","gingerbouncehouse3","gingerbouncehouse4","gingerbouncehouse5","gingerbouncehouse6","gingerbouncehouse7","gingerbouncehouse8","gingerbouncehouse9","gingerbouncehouse10","gingerbouncehouse11","gingerbouncehouse12","tunnelofhugz6","tunnelofhugz1","tunnelofhugz2","tunnelofhugz3","tunnelofhugz4","tunnelofhugz5","tunnelofhugz6","tunnelofhugz7","tunnelofhugz8","tunnelofhugz9","tunnelofhugz10","tunnelofhugz11","tunnelofhugz12"];
categorizedFilterObject.PremiumDestinations=["premiumskyland","premiumskyland1","premiumskyland2","premiumskyland3","premiumskyland4","premiumskyland5","premiumskyland6","premiumskyland7","premiumskyland8","premiumskyland9","premiumskyland10","premiumskyland11","premiumskyland12","premiumskyland13","premiumskyland14","premiumtreehouse","premiumtreehouse1","premiumtreehouse2","premiumtreehouse3","premiumtreehouse4","premiumtreehouse5","premiumtreehouse6","premiumtreehouse7","premiumtreehouse8","premiumtreehouse9","premiumtreehouse10","premiumtreehouse11","premiumtreehouse12","premiumtreehouse13","premiumtreehouse14"];
categorizedFilterObject.EvoBouncers=["boxjellyfish","goldenjellyfish","pb&jellyfish","limebutterfly","monarchbutterfly","morphobutterfly","poisondartfrog","tomatofrog","treefrog","seaturtle","snappingturtle","taekwondotortoise","honeybee","queenbee","wallabee"];
categorizedFilterObject.Evoluations=["tomatoseed","tomatoplant","tomato","cornseed","cornstalk","earofcorn","carrotseed","carrotplant","carrot","peasseed","peasplant","peas","goldencarrotseed","goldencarrotplant","goldencarrot","calf","cow","milk","piglet","pig","bacon","colt","racehorse","championshiphorse","chick","chicken","eggs","lean-toshed","gardenshed","barn","hoe","plow","tractor","farmer","farmerandwife","family","pottedplant","garden","field","seaweed","fish","shark","canoe","motorboat","submarine","egg","dinosaur","bones","firstwheel","penny-farthingbike","musclecar","lioncub","lion","kingofthejungle","safaritruck","safarivan","safaribus","coin","bagofcoins","treasurechest","planulalarva","polyp","polypwithbulbs","ephyralarva","butterflyegg","caterpillar","chrysalis","hatchedchrysalis","frogegg","tadpole","pollywog","froglet","turtleegg","turtlehatchling","juvenileturtle","adultturtle","beeeggs","beelarvae","beepupae","emptyhoneycomb","carnationseed","carnationgermination","carnationgrowth","carnationbud","pinkcarnationblossom","redcarnationblossom","violetcarnationblossom","whitecarnationblossom","yellowcarnationblossom","lilyseed","lilygermination","lilygrowth","lilybud","pinklilyblossom","violetlilyblossom","whitelilyblossom","tulipseed","tulipgermination","tulipgrowth","tulipbud","bluetulipblossom","pinktulipblossom","whitetulipblossom","roseseed","rosegermination","rosegrowth","rosebud","redroseblossom","violetroseblossom","whiteroseblossom","yellowroseblossom","ducknest","duckegg","duckling","mallard","swan","quack","telegram","creditcard","brickphone"];
categorizedFilterObject.Scatters=["fire","frozengreenie","waterdroplet","feather","goldenfeather","charge","tree","redapple","cherryblossom","peach","pear","pecan","acorn","deadbranch","cardinalfeather","blackhole","planet","spaceship","lostkey","lostsock","meteor","satellite","scattered","boulder","flamingarrow","sc4rab","ankhartifact","ouroborosartifact","djedartifact","scarabartifact","eyeofraartifact","shenartifact","canopicjarartifact","sesenartifact","wasscepterartifact","sistrumartifact","sistrumartifact","tyetartifact","eyeofhorusartifact","sweettreats","scgsresellerpackage","geologgersresellerpackage","gold'ncoinsresellerpackage","negsresellerpackage","cloverleaf","goldenclover","snowball","dossier","lasertrail1","lasertrail2","lasertrail3","pixelpresent","maplepawn","mapleknight","maplebishop","maplerook","maplequeen","mapleking","walnutpawn","walnutknight","walnutbishop","walnutrook","walnutqueen","walnutking","leapfrog","munch-man","runzeerob","goldcoin","fly","ghostzee","1stroll","bowling-1stroll","2ndroll","bowling-2ndroll","trickortreat","flamingpumpkin","n1nj4st4r","floatinghead","sm0kemessage","sm0kesong","s.p.i.l.t.milk","paintedpetal","trinityknot","celticcrossknot","loveknot","daraknot"];
categorizedFilterObject.Places=["poiairport","poisports","poiuniversity","poimuseum","poiwildlife","poihistoricalplace","poilibrary","poifirstresponders","poifaithplace","poihospital","poipostoffice","poicemetery","poiuniqueattraction","poivirtualgarden","poicinema","poitransportation","poiplaypark","poibank","poibeach","poicampground","poigolf","poidrinkdepot","poipet","poientertainment","poimemorial","poigym","poipharmacy"];
categorizedFilterObject.WesternZodiacs=["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
categorizedFilterObject.ChineseZodiacs=["ratchinesezodiac","oxchinesezodiac","tigerchinesezodiac","rabbitchinesezodiac","dragonchinesezodiac","snakechinesezodiac","horsechinesezodiac","goatchinesezodiac","monkeychinesezodiac","roosterchinesezodiac","dogchinesezodiac","pigchinesezodiac"];
categorizedFilterObject.EgyptianZodiacs=["nile","amon-ra","osiris","thoth","horus","seth","anubis","sekhmet","bastet","mut","geb","isis"];
categorizedFilterObject.CelticZodiac=["celticwolf","celticfalcon","celticstag","celticbull","celticfox","celticadder","celticcat"];
categorizedFilterObject.ColouredVirtuals=["virtual_rainbow","virtual","virtual_timberwolf","virtual_silver","virtual_gray","virtual_black","virtual_orchid","virtual_wisteria","virtual_purple_mountains_majesty","virtual_violet","virtual_plum","virtual_blue_violet","virtual_blue","virtual_cadet_blue","virtual_periwinkle","virtual_cornflower","virtual_blue_green","virtual_pacific_blue","virtual_cerulean","virtual_robin_egg_blue","virtual_indigo","virtual_turquoise_blue","virtual_sea_green","virtual_granny_smith_apple","virtual_green","virtual_forest_green","virtual_asparagus","virtual_olive_green","virtual_yellow_green","virtual_green_yellow","virtual_spring_green","virtual_gold","virtual_yellow","virtual_goldenrod","virtual_dandelion","virtual_orange","virtual_burnt_orange","virtual_melon","virtual_pink","virtual_carnation_pink","virtual_mauvelous","virtual_salmon","virtual_tickle_me_pink","virtual_magenta","virtual_wild_strawberry","virtual_violet_red","virtual_red_violet","virtual_apricot","virtual_peach","virtual_macaroni_and_cheese","virtual_tan","virtual_burnt_sienna","virtual_bittersweet","virtual_red_orange","virtual_scarlet","virtual_red","virtual_brick_red","virtual_mahogany","virtual_chestnut","virtual_tumbleweed","virtual_raw_sienna","virtual_brown"];
categorizedFilterObject.ClanWeapons=["mace","longsword","battleaxe","thehammer","crossbow","catapult","shield","trojanunicorn"];
categorizedFilterObject.Mysteries=["mystery","firemystery","icemystery","earthmystery","watermystery","airmystery","electricmystery","voidmystery"];
categorizedFilterObject.Zeecrets=["briefcase","nightvisiongoggles","walkietalkiewatch","laserpen","infraredvirtual","undercoveragent","liaisonagent","physicalmasterofdisguise","virtualmasterofdisguise"];
categorizedFilterObject.Misc=["munzee","owned","owned_virtual","captured","captured_virtual","maintenance","premium","trail","personal","eventindicator","virtual_trail","shamrock","event_trail","springseasonalmunzee","summerseasonalmunzee","fallseasonalmunzee","winterseasonalmunzee","temporaryvirtual","qrewzee","sleepzee","virtualshamrock","goldenticket","reseller","virtualreseller"];

categorizedFilterObject.JukeBox=["dinerjukebox","sodafountainjukebox","gnomedoubt","thepremiums-meetthepremiums","nullvana-mythslikezeespirit","queen(ofhearts)","zeetles-evosubmarine","u.t.l.-straightouttacapons","pinkfloymingo","munz&amp;roses-welcometozeejungle","momunzees,mocaproblems","bonjozee-wantedzedoralive","munz&amp;roses-welcometozeejungle","zeezeetop","n'zeenc","themunzees","thecapenters","zeezer-greeniealbum"];
categorizedFilterObject.CardsOfHeart=["aceofhearts","twoofhearts","threeofhearts","fourofhearts","fiveofhearts","sixofhearts","sevenofhearts","eightofhearts","nineofhearts","tenofhearts","knaveofhearts","queenofhearts","kingofhearts"];
categorizedFilterObject.CardsOfSpades=["aceofspades","twoofspades","threeofspades","fourofspades","fiveofspades","sixofspades","sevenofspades","eightofspades","nineofspades","tenofspades","jackofspades","queenofspades","kingofspades"];
categorizedFilterObject.CardsOfClubs=["aceofclubs","twoofclubs","threeofclubs","fourofclubs","fiveofclubs","sixofclubs","sevenofclubs","eightofclubs","nineofclubs","tenofclubs","jackofclubs","queenofclubs","kingofclubs"];
categorizedFilterObject.CardsOfDiamonds=["aceofdiamonds","twoofdiamonds","threeofdiamonds","fourofdiamonds","fiveofdiamonds","sixofdiamonds","sevenofdiamonds","eightofdiamonds","nineofdiamonds","tenofdiamonds","jackofdiamonds","queenofdiamonds","kingofdiamonds"];
categorizedFilterObject.StonePets=["sandstonepetrock","lightwoodpaintbrush","darkwoodpaintbrush","limestonepetrock","aquamarinepaintbucket","purplepaintbucket","orangepaintbucket","greenpaintbucket"];
categorizedFilterObject.PizzaParts=["pizzabase","tomatopaste","cutpeppers","pepperoni","spicybeef","gratedcheese","olives","jalapenos","ham","redonions","chickentopping","pineapplechunks","mushrooms"];
categorizedFilterObject.Hats=["tophat","chefhat","snowtrapperhat","cowboyhat","safarihat","beret","deerstalkerhat","pinwheelhat","raccoonskincap","beeantennae","truckercap","captainhat"];
categorizedFilterObject.TongueTwisterDay=["megamouthful","tonguetwister","sheshells","babybubbles","woodchuckwood","freshfish","irishwristwatch","botterbutter"];
categorizedFilterObject.BabyAnimals=["otterpup","giraffecalf","foal","babyraccoon","candycornpiglet"];

categorizedFilterObject.UnCategorized=[];
var disabledFilterImgs = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function restructureImages() {

    //Wait until the progressbar is hidden
    if (isSpecialMapSite && ($("#map-box-special-loading").is(':visible')) ||
        !isSpecialMapSite && ($("#map-box-loading").is(':visible')))
    {
        return;
    }

    //remove original filter_all button
    $('#filter_all').remove();

    if (!isSpecialMapSite)
    {
        var inputbar = $('#inputbar');
        var filterimgsDiv = $('<div id="filterimgs"></div>');
        inputbar.append(filterimgsDiv);
    }

    filterImgsContainer = $('#filterimgs');
    filterImgsContainer[0].addEventListener('mouseleave', deactivateFilterImages);

    //Filters label removed
    if (isSpecialMapSite){
        filterImgsContainer.prev().remove();
    }

    //Collect original filter images or create filter images from map
    filterIMGS = (isSpecialMapSite) ? filterImgsContainer[0].getElementsByClassName('filterimg') : createFilterImages(mapMarkers);

    //Sort into Categories
    var filterHelper = CreateCategories();

    //Reload the new layout
    filterImgsContainer.empty();
    filterImgsContainer.html(filterHelper);
    filterHelper = null;

    //mainImages update needed after map action
    Array.from(document.getElementsByClassName('categoryDIV')).forEach(function(categDIV){
        updateMainImage(categDIV);
    });

    //Add to all img the click eventListener
    Array.from(filterImgsContainer[0].getElementsByClassName('filterimg')).forEach(function(img) {
      img.addEventListener('click', FilterImgClick);
      img.setAttribute("style", "cursor:pointer");
      img.setAttribute("title", img.currentSrc.substring(img.currentSrc.lastIndexOf("/")+1,img.currentSrc.lastIndexOf(".")));
    });

    //all mainImages stuffs
    Array.from(filterImgsContainer[0].getElementsByClassName('mainImage')).forEach(function(mainIMG){
        if (isSpecialMapSite)
        {
            mainIMG.setAttribute("style", "border: solid grey 1px; width:63px; padding-right:3px; padding-top:3px; cursor:pointer");
        }
        else
        {
            mainIMG.setAttribute("style", "border: solid grey 1px; width:53px; padding-right:3px; padding-top:3px; cursor:pointer");
        }
        mainIMG.addEventListener('mouseover', activateFilterImages);
        mainIMG.addEventListener('click', mainImageClick);
    });

    //all categoryDIVs stuff
    Array.from(filterImgsContainer[0].getElementsByClassName('categoryDIV')).forEach(function(cDIV){
        cDIV.setAttribute("style", "display: none; border: solid grey 1px; padding-top: 5px; padding-bottom: 5px; width: 100%");
        cDIV.addEventListener('mouseleave', deactivateFilterImages);
    });

    //refresh
    refreshMap();
}

function CreateCategories()
{
    //Div
    var mainImageDIV = document.createElement('DIV');
    mainImageDIV.setAttribute("id", "mainImageDIV");

    var categName = "" ;
    var filterStructure = "";
    for (var o = 0; o<categorizedFilterOrder.length; o++)
    {
        categName = categorizedFilterOrder[o];
        var array = categorizedFilterObject[categName];

        //Div
        var categDIV = document.createElement('DIV');
        categDIV.setAttribute("id", categName+"_Category");
        categDIV.setAttribute("class", "categoryDIV");

        var addedAtLeatOne = false;

        if (array.length > 0)
        {
            for (let a = 0; a < array.length; a++)
            {
                for (let i = 0; i < filterIMGS.length; i++)
                {
                    if (filterIMGS[i].src == imgPrefix + array[a] + ".png")
                    {
                        categDIV.appendChild(filterIMGS[i]);
                        addedAtLeatOne = true;
                    }
                }
            }
        }
        else
        {
            for (let i = filterIMGS.length-1; i >= 0; i--)
            {
                categDIV.appendChild(filterIMGS[i]);
                addedAtLeatOne = true;
            }
        }

        if (addedAtLeatOne)
        {
            filterStructure += categDIV.outerHTML;

            //main image
            var categMainIMG = document.createElement('IMG');
            categMainIMG.setAttribute("id", categName+'_MainIMG');
            categMainIMG.setAttribute("title", categName);
            categMainIMG.setAttribute("class", "mainImage");
            categMainIMG.src = imgPrefix + categoryMainImages[o] + ".png";

            mainImageDIV.appendChild(categMainIMG);
        }
    }

    //Show/Hide all main image
    var allOrnothingIMG = document.createElement('IMG');
    allOrnothingIMG.setAttribute("id", 'ALL_MainIMG');
    allOrnothingIMG.setAttribute("title", 'Show/Hide All Category');
    allOrnothingIMG.setAttribute("class", "mainImage");
    allOrnothingIMG.src = imgPrefix + "business.png";
    mainImageDIV.appendChild(allOrnothingIMG);

    filterStructure = mainImageDIV.outerHTML + filterStructure;

    return filterStructure;
}

function createFilterImages(markers)
{
    rawFilterIMGS = [];
    let imgList = document.createDocumentFragment();
    for (var mID in markers)
    {
        let src = markers[mID]._element.outerHTML.split("&quot;")[1];
        if (!rawFilterIMGS.includes(src))
        {
            rawFilterIMGS.push(src);
            var img = document.createElement('IMG');
            img.setAttribute('class','filterimg');
            img.setAttribute('src',src);
            imgList.appendChild(img);
        }
    }

    return imgList.children;
}

function mainImageClick(sender)
{
    //find related filterimgs
    var categDIV = document.getElementById(sender.target.getAttribute("title")+"_Category");

    if (categDIV != null)
    {
        let imgs = categDIV.getElementsByTagName('img');

        if (sender.target.classList.contains("filterdisabled"))
        {
            //Set own state
            sender.target.classList.remove("filterdisabled");

            //Set the related filterimg states
            Array.from(imgs).forEach(function(img) {
                if (img.classList.contains("filterdisabled"))
                {
                    enableFilter(img);
                }
            });
        }
        else
        {
            //Set own state
            sender.target.classList.add("filterdisabled");

            //Set the related filterimg states
            Array.from(imgs).forEach(function(img) {
                if (!img.classList.contains("filterdisabled"))
                {
                    disableFilter(img);
                }
            });
        }
    }
    else
    {
        let mimgs = document.getElementsByClassName('mainImage');
        let imgs = document.getElementsByClassName('filterimg');
        //Clicked on ALL button
        if (sender.target.classList.contains("filterdisabled"))
        {
            //Set own state
            sender.target.classList.remove("filterdisabled");

            //Set all category states
            Array.from(mimgs).forEach(function(mimg) {
                mimg.classList.remove("filterdisabled");
            });

            //Set all filterimg states
            Array.from(imgs).forEach(function(img) {
                if (img.classList.contains("filterdisabled"))
                {
                    enableFilter(img);
                }
            });
        }
        else
        {
            //Set own state
            sender.target.classList.add("filterdisabled");

            //Set all category states
            Array.from(mimgs).forEach(function(mimg) {
                mimg.classList.add("filterdisabled");
            });

            //Set all filterimg states
            Array.from(imgs).forEach(function(img) {
                if (!img.classList.contains("filterdisabled"))
                {
                    disableFilter(img);
                }
            });
        }
    }

    refreshMap();
}

function activateFilterImages(sender)
{
    //1st - Hide all
    Array.from(filterImgsContainer[0].getElementsByClassName('categoryDIV')).forEach(function(cDIV){
        $(cDIV).hide();
    });

    //2nd - Show the related
    $(document.getElementById(sender.target.getAttribute("title")+"_Category")).show();
}

function deactivateFilterImages(sender)
{
    Array.from(filterImgsContainer[0].getElementsByClassName('categoryDIV')).forEach(function(cDIV){
        $(cDIV).hide();
    });
}

function FilterImgClick(sender)
{
    if (sender.target.classList.contains("filterdisabled"))
    {
        enableFilter(sender.target);
    }
    else
    {
        disableFilter(sender.target);
    }

    updateMainImage(sender.target.parentNode);

    refreshMap();
}

function updateMainImage(containerDIV)
{
    var hide = true;
    var relatedMainImage = $(document.getElementById(containerDIV.id.replace('Category', 'MainIMG')));
    Array.from(containerDIV.getElementsByClassName('filterimg')).forEach(function(img){
        hide &= img.classList.contains("filterdisabled");
    });

    if (hide)
    {
        relatedMainImage.addClass("filterdisabled");
    }
    else
    {
        relatedMainImage.removeClass("filterdisabled");
    }

    //ALL image handler
    hide = true;
     Array.from(containerDIV.parentNode.getElementsByClassName('mainImage')).forEach(function(mimg){
        hide &= mimg.classList.contains("filterdisabled");
    });

    if (hide)
    {
        $('#ALL_MainIMG').addClass("filterdisabled");
    }
    else
    {
        $('#ALL_MainIMG').removeClass("filterdisabled");
    }
}

//Enable 1 filterimg
function enableFilter(target)
{
    target.classList.remove("filterdisabled");

    var pos = disabledFilterImgs.indexOf(target.src);
    if (pos >= 0)
    {
        disabledFilterImgs.splice(pos, 1);
    }
}

//Disable 1 filterimg
function disableFilter(target)
{
    target.classList.add("filterdisabled");

    if (disabledFilterImgs.indexOf(target.src) < 0)
    {
        disabledFilterImgs.push(target.src);
    }
}

function refreshMap()
{
    if (isSpecialMapSite)
    {
        for (let mID in mapMarkers)
        {
            if (disabledFilterImgs.includes(mapMarkers[mID].munzee_logo))
            {
                $( "[data-index='" + mID + "']" ).hide();
            }
            else
            {
                $( "[data-index='" + mID + "']" ).show();
            }
        }
    }
    else
    {
        for (let mID in mapMarkers)
        {
            if (disabledFilterImgs.includes(mapMarkers[mID]._element.outerHTML.split("&quot;")[1]))
            {
                $( "[data-index='" + mID + "']" ).hide();
            }
            else
            {
                $( "[data-index='" + mID + "']" ).show();
            }
        }
    }
}

$(document).ajaxSuccess(restructureImages);