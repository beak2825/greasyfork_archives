// ==UserScript==
// @name         Ovipets Megabot - Last Stand
// @namespace    ovipets
// @version      3.5
// @license      MIT
// @description  Das Ende einer Ära
// @author       Mindconstructor
// @match        https://ovipets.com*
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @connect      *.ovipets.com
// @connect      ovipets.com
// @connect      im1.ovipets.com
// @connect      im2.ovipets.com
// @connect      im3.ovipets.com
// @connect      im4.ovipets.com
// @connect      im5.ovipets.com
// @connect      im6.ovipets.com
// @connect      im7.ovipets.com
// @connect      im8.ovipets.com
// @connect      im9.ovipets.com
// @connect      greasyfork.org
// @connect      fantasynamegen.com
// @connect      mailforspam.com
// @connect      cloudflare.com
// @downloadURL https://update.greasyfork.org/scripts/543209/Ovipets%20Megabot%20-%20Last%20Stand.user.js
// @updateURL https://update.greasyfork.org/scripts/543209/Ovipets%20Megabot%20-%20Last%20Stand.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  /* REGION "Panel- und Funktions-Einstellungen." */

  // Wenn "release" auf false steht, erscheinen die Panele nur, wenn der Debug-Modus aktiv ist.

  const definedOrder = [
          /* worker */           {active: true,disableable:false,type:`module`,release: true,value:`worker`,},
          /* Module */           {active:false,disableable: true,type:`text`,  release: true,value:``,},
          /* autorunner */       {active: true,disableable: true,type:`module`,release:false,value:`autorunner`,},
          /* breeder */          {active: true,disableable: true,type:`module`,release:false,value:`breeder`,},
          /* adopter */          {active: true,disableable: true,type:`module`,release:false,value:`adopter`,},
          /* jumboschreiner */   {active: true,disableable: true,type:`module`,release: true,value:`jumboschreiner`,},
          /* namer */            {active: true,disableable: true,type:`module`,release:false,value:`namer`,},
          /* sorter */           {active: true,disableable: true,type:`module`,release: true,value:`sorter`,},
          /* Crusher/Oviraptor */{active: true,disableable: true,type:`module`,release:false,value:`crusher`,},
          /* accountList */      {active: true,disableable: true,type:`module`,release:false,value:`accountList`,},
          /* stats */            {active: true,disableable: true,type:`module`,release:false,value:`stats`,},
      ];


      // Entferne die "// " vor einem eintrag, um die jeweiligen schnell-Buttons zu entsperren und anzuzeigen

      const __buttons = [
        // "unlocker",
        // "presentation",
        // "tradeaccept",
        // "breedtrade",
        // "blocklistc",
        // "blocklists",
        // "blocklistcp",
           "boxstyle",
           "autorunner",
      ];

  /* ENDREGION */

  /* REGION "Auslagerung (Nicht anfassen)" */

  const __officialColors = [
    [0,0,0,"Black"],[0,0,255,"Blue"],[205,127,50,"Bronze"],[100,50,0,"Brown"],[0,191,255,"Capri"],
    [220,20,60,"Crimson"],[0,255,255,"Cyan"],[255,20,147,"Deep Pink"],[21,96,189,"Denim"],
    [185,242,255,"Diamond"],[0,128,0,"Emerald"],[255,250,240,"Floral White"],[1,68,33,"Forest Green"],
    [255,215,0,"Gold"],[128,128,128,"Gray"],[0,255,0,"Green"],[75,0,130,"Indigo"],
    [10,10,10,"JetBlack"],[204,204,255,"Lavender"],[255,255,153,"Light Yellow"],[0,255,69,"Lime"],
    [255,0,255,"Magenta"],[128,0,0,"Maroon"],[152,255,152,"Mint Green"],[255,228,225,"Misty Rose"],
    [0,0,128,"Navy"],[128,128,0,"Olive"],[255,165,0,"Orange"],[171,205,239,"PCB"],
    [255,192,203,"Pink"],[128,0,128,"Purple"],[0,204,204,"REB"],[255,0,0,"Red"],[255,69,0,"Red-Orange"],
    [0,158,96,"Shamrock"],[192,192,192,"Silver"],[0,128,128,"Teal"],[127,0,255,"Violet"],
    [255,255,255,"White"],[255,255,0,"Yellow"]
  ];

  const __unofficialColors = [[236,28,36,"00VerizonRed"],[50,173,97,"02AsdaGreen"],[255,57,136,"04BarbiePink"],[252,65,154,"05BarbiePink"],[232,83,149,"59BarbiePink"],[202,115,9,"68AsdaOrange"],[211,65,157,"75BarbiePink"],[0,222,164,"85AsdaGreen"],[237,28,36,"87HuaweiRed"],[243,100,162,"90BarbiePink"],[128,193,151,"94AsdaGreen"],[102,201,146,"99AsdaGreen"],[247,35,138,"99BarbiePink"],[0,72,186,"AbsoluteZero"],[76,47,39,"Acajou"],[176,191,26,"AcidGreen"],[124,185,232,"Aero"],[201,255,229,"AeroBlue"],[178,132,190,"AfricanViolet"],[114,160,193,"AirSuperiorityBlue"],[175,0,42,"AlabamaCrimson"],[242,240,230,"Alabaster"],[240,248,255,"AliceBlue"],[227,38,54,"AlizarinCrimson"],[196,98,16,"AlloyOrange"],[239,222,205,"Almond"],[90,100,87,"AloeswoodBrown"],[106,67,45,"Aloewood"],[214,214,214,"Aluminum"],[210,217,219,"AluminumFoil"],[229,43,80,"Amaranth"],[159,43,104,"AmaranthDeepPurple"],[241,156,187,"AmaranthPink"],[171,39,79,"AmaranthPurple"],[211,33,45,"AmaranthRed"],[59,122,87,"Amazon"],[255,191,0,"Amber"],[59,59,109,"AmericanBlue"],[57,24,2,"AmericanBronze"],[128,64,64,"AmericanBrown"],[211,175,55,"AmericanGold"],[52,179,52,"AmericanGreen"],[255,139,0,"AmericanOrange"],[255,152,153,"AmericanPink"],[67,28,83,"AmericanPurple"],[179,33,52,"AmericanRed"],[255,3,62,"AmericanRose"],[207,207,207,"AmericanSilver"],[85,27,140,"AmericanViolet"],[242,180,0,"AmericanYellow"],[153,102,204,"Amethyst"],[243,193,58,"AmurCorkTree"],[242,243,244,"AntiflashWhite"],[205,149,117,"AntiqueBrass"],[102,93,30,"AntiqueBronze"],[145,92,131,"AntiqueFuchsia"],[132,27,45,"AntiqueRuby"],[250,235,215,"AntiqueWhite"],[102,180,71,"Apple"],[141,182,0,"AppleGreen"],[251,206,177,"Apricot"],[134,171,165,"AquaBlueColor"],[127,255,212,"Aquamarine"],[208,255,20,"ArcticLime"],[75,83,32,"ArmyGreen"],[143,151,121,"Artichoke"],[233,214,107,"ArylideYellow"],[125,194,66,"AsdaGreen"],[200,101,0,"AsdaOrange"],[178,190,181,"AshGray"],[135,169,107,"Asparagus"],[0,58,108,"AteneoBlue"],[255,153,102,"AtomicTangerine"],[165,42,42,"Auburn"],[253,238,0,"Aureolin"],[110,127,128,"AuroMetalSaurus"],[86,130,3,"Avocado"],[255,32,82,"Awesome"],[99,119,91,"Axolotl"],[0,127,255,"Azure"],[240,255,255,"AzureMist"],[219,233,244,"AzureishWhite"],[46,88,148,"B'dazzled blue"],[84,45,36,"BRBB"],[137,207,240,"BabyBlue"],[161,202,241,"BabyBlueEyes"],[244,194,194,"BabyPink"],[254,254,250,"BabyPowder"],[133,124,85,"BaikoBrown"],[255,145,175,"BakerMillerPink"],[33,171,205,"BallBlue"],[250,231,181,"BananaMania"],[255,225,53,"BananaYellow"],[0,106,78,"BangladeshGreen"],[224,33,138,"BarbiePink"],[233,65,150,"BarbiePink"],[124,10,2,"BarnRed"],[29,172,214,"BatteryChargedBlue"],[132,132,130,"BattleshipGrey"],[95,201,191,"Bayside"],[152,119,123,"Bazaar"],[188,212,230,"BeauBlue"],[159,129,112,"Beaver"],[242,142,28,"Beer"],[250,110,121,"Begonia"],[245,245,220,"Beige"],[93,63,106,"Bellflower"],[145,50,37,"BeniPlant"],[53,41,37,"BetelNut"],[156,37,66,"Big dip o’ruby"],[232,142,90,"BigFootFeet"],[177,74,48,"BirchBrown"],[255,228,196,"Bisque"],[61,43,31,"Bistre"],[150,113,23,"BistreBrown"],[202,224,13,"BitterLemon"],[191,255,0,"BitterLime"],[254,111,94,"Bittersweet"],[191,79,81,"BittersweetShimmer"],[61,12,2,"BlackBean"],[27,24,17,"BlackChocolate"],[59,47,47,"BlackCoffee"],[84,98,111,"BlackCoral"],[53,30,28,"BlackKite"],[37,53,41,"BlackLeatherJacket"],[59,60,54,"BlackOlive"],[191,175,178,"BlackShadows"],[255,235,205,"BlanchedAlmond"],[165,113,100,"BlastoffBronze"],[49,140,231,"BleuDeFrance"],[172,229,238,"BlizzardBlue"],[250,240,190,"Blond"],[138,3,3,"Blood"],[164,19,19,"BloodAnimal"],[209,0,28,"BloodOrange"],[99,15,15,"BloodOrgan"],[102,0,0,"BloodRed"],[243,83,54,"BloodRed"],[162,162,208,"BlueBell"],[82,89,59,"BlueBlackCrayfish"],[0,185,251,"BlueBolt"],[0,147,175,"BlueBunsell"],[0,136,220,"BlueCola"],[31,117,254,"BlueCrayola"],[6,78,64,"BlueGreenCW"],[58,105,96,"BlueGreenSei"],[93,173,236,"BlueJeans"],[76,183,165,"BlueLagoon"],[0,135,189,"BlueNCS"],[0,24,168,"BluePantone"],[51,51,153,"BluePigment"],[2,71,254,"BlueRYB"],[12,191,233,"BlueRaspberry"],[18,97,128,"BlueSapphire"],[43,32,40,"BlueViolet"],[77,26,127,"BlueVioletCW"],[115,102,189,"BlueVioletCray"],[80,114,167,"BlueYonder"],[79,134,247,"Blueberry"],[28,28,240,"Bluebonnet"],[102,153,204,"Bluegray"],[13,152,186,"Bluegreen"],[85,53,146,"BluemagentaViolet"],[138,43,226,"Blueviolet"],[222,93,131,"Blush"],[121,68,59,"Bole"],[0,149,182,"BondiBlue"],[227,218,201,"Bone"],[221,226,106,"BoredAccentGreen"],[14,156,165,"BoyRed"],[135,50,96,"Boysenberry"],[0,112,255,"BrandeisBlue"],[135,65,63,"Brandy"],[181,166,66,"Brass"],[255,99,28,"BraveOrange"],[230,131,100,"BrewedMustardBrown"],[203,65,84,"BrickRed"],[235,236,240,"BrightGray"],[102,255,0,"BrightGreen"],[191,148,228,"BrightLavender"],[216,145,239,"BrightLilac"],[195,33,72,"BrightMaroon"],[25,116,210,"BrightNavyBlue"],[255,0,127,"BrightPink"],[8,232,222,"BrightTurquoise"],[209,159,232,"BrightUbe"],[51,153,255,"BrilliantAzure"],[244,187,255,"BrilliantLavender"],[255,85,163,"BrilliantRose"],[251,96,127,"BrinkPink"],[0,66,37,"BritishRacingGreen"],[136,84,11,"Bronze"],[176,141,87,"BronzeMetallic"],[115,112,0,"BronzeYellow"],[153,51,0,"Brown"],[95,25,51,"BrownChocolate"],[74,44,42,"BrownCoffee"],[175,89,62,"BrownCrayola"],[75,60,57,"BrownRatGrey"],[175,110,77,"BrownSugar"],[150,75,0,"BrownTraditional"],[204,153,102,"BrownYellow"],[107,68,35,"Brownnose"],[27,77,62,"BrunswickGreen"],[140,89,57,"Brushwood"],[255,193,204,"BubbleGum"],[231,254,255,"Bubbles"],[123,182,97,"BudGreen"],[240,220,130,"Buff"],[72,6,7,"BulgarianRose"],[128,0,32,"Burgundy"],[222,184,135,"Burlywood"],[161,122,116,"BurnishedBrown"],[204,85,0,"BurntOrange"],[233,116,81,"BurntSienna"],[138,51,36,"BurntUmber"],[36,160,237,"ButtonBlue"],[189,51,164,"Byzantine"],[112,41,99,"Byzantium"],[82,75,42,"CFSC"],[0,122,165,"CGBlue"],[224,60,49,"CGRed"],[255,185,90,"CJOG"],[83,104,114,"Cadet"],[95,158,160,"CadetBlue"],[169,178,195,"CadetBlue"],[145,163,176,"CadetGrey"],[10,17,149,"CadmiumBlue"],[0,107,60,"CadmiumGreen"],[237,135,45,"CadmiumOrange"],[182,12,38,"CadmiumPurple"],[227,0,34,"CadmiumRed"],[127,62,152,"CadmiumViolet"],[255,246,0,"CadmiumYellow"],[166,123,91,"Café au lait"],[75,54,33,"Café noir"],[30,77,43,"CalPolyPomonaGreen"],[252,255,164,"Calamansi"],[163,193,173,"CambridgeBlue"],[193,154,107,"Camel"],[239,187,204,"CameoPink"],[120,134,107,"CamouflageGreen"],[255,239,0,"CanaryYellow"],[255,8,0,"CandyAppleRed"],[228,113,122,"CandyPink"],[89,39,32,"CaputMortuum"],[255,213,154,"Caramel"],[196,30,58,"Cardinal"],[26,193,221,"CaribbeanBlue"],[0,204,153,"CaribbeanGreen"],[150,0,24,"Carmine"],[215,0,64,"CarmineMP"],[235,76,66,"CarminePink"],[255,0,56,"CarmineRed"],[255,166,201,"CarnationPink"],[179,27,27,"Carnelian"],[86,160,211,"CarolinaBlue"],[237,145,33,"CarrotOrange"],[0,86,63,"CastletonGreen"],[6,42,120,"CatalinaBlue"],[112,54,66,"Catawba"],[182,73,37,"Cattail"],[201,90,73,"CedarChest"],[146,161,207,"Ceil"],[129,156,139,"Celadon"],[172,225,175,"Celadon"],[0,123,167,"CeladonBlue"],[47,132,124,"CeladonGreen"],[178,255,255,"Celeste"],[73,151,208,"CelestialBlue"],[36,107,206,"CelticBlue"],[222,49,99,"Cerise"],[236,59,131,"CerisePink"],[42,82,190,"CeruleanBlue"],[109,155,195,"CeruleanFrost"],[0,20,64,"CetaceanBlue"],[160,120,90,"Chamoisee"],[247,231,206,"Champagne"],[241,221,207,"ChampagnePink"],[54,69,79,"Charcoal"],[35,43,43,"CharlestonGreen"],[208,116,139,"Charm"],[230,143,172,"CharmPink"],[223,255,0,"ChartreuseTrd"],[255,166,0,"Cheese"],[252,201,185,"CherryBlossom"],[172,129,129,"CherryBlossomMouse"],[255,183,197,"CherryBlossomPink"],[149,69,53,"Chestnut"],[96,40,30,"ChestnutLeatherBrown"],[255,195,77,"Chickadee"],[222,111,161,"ChinaPink"],[168,81,110,"ChinaRose"],[20,20,20,"ChineseBlack"],[54,81,148,"ChineseBlue"],[205,128,50,"ChineseBronze"],[171,56,31,"ChineseBrown"],[204,153,0,"ChineseGold"],[208,219,97,"ChineseGreen"],[243,112,66,"ChineseOrange"],[222,112,161,"ChinesePink"],[114,11,152,"ChinesePurple"],[170,56,30,"ChineseRed"],[205,7,30,"ChineseRed"],[204,204,204,"ChineseSilver"],[133,96,136,"ChineseViolet"],[226,229,222,"ChineseWhite"],[255,178,0,"ChineseYellow"],[74,255,0,"ChlorophyllGreen"],[123,63,0,"ChocTrd"],[63,0,15,"ChocolateBrown"],[88,17,26,"ChocolateCosmos"],[60,20,33,"ChocolateKisses"],[168,169,173,"ChromeAluminum"],[255,167,0,"ChromeYellow"],[102,83,67,"CiaTeaGarden"],[152,129,123,"Cinereous"],[227,66,52,"Cinnabar"],[210,105,30,"Cinnamon"],[205,96,126,"CinnamonSatin"],[228,208,10,"Citrine"],[147,55,9,"CitrineBrown"],[159,169,31,"Citron"],[127,23,52,"Claret"],[251,204,231,"ClassicRose"],[169,98,50,"Clove"],[143,88,60,"CloveBrown"],[24,27,38,"CoarseWoolColor"],[0,71,171,"CobaltBlue"],[150,90,62,"Coconut"],[233,237,246,"CoconutWhite"],[111,78,55,"Coffee"],[81,65,0,"CoinDarkBronze"],[60,48,36,"Cola"],[196,216,226,"ColumbiaBlue"],[255,255,204,"Conditioner"],[248,131,121,"CongoPink"],[238,224,177,"CookiesAndCream"],[0,46,99,"CoolBlack"],[140,146,172,"CoolGrey"],[184,115,51,"Copper"],[173,111,105,"CopperPenny"],[203,109,81,"CopperRed"],[153,102,102,"CopperRose"],[255,56,0,"Coquelicot"],[248,103,79,"Coral"],[255,127,80,"Coral"],[255,64,64,"CoralRed"],[253,124,110,"CoralReef"],[137,63,69,"Cordovan"],[250,169,69,"Corn"],[251,236,93,"Corn"],[147,204,234,"Cornflower"],[100,149,237,"CornflowerBlue"],[255,248,220,"Cornsilk"],[46,45,136,"CosmicCobalt"],[255,248,231,"CosmicLatte"],[255,188,217,"CottonCandy"],[129,97,60,"CoyoteBrown"],[255,170,29,"CrayolaBrightYellow"],[218,138,103,"CrayolaCopper"],[0,255,205,"CrayolaSeaGreen"],[255,253,208,"Cream"],[190,0,50,"CrimsonGlory"],[153,0,0,"CrimsonRed"],[167,216,222,"Crystal"],[104,160,176,"CrystalBlue"],[245,245,245,"Cultured"],[0,183,235,"Cyan"],[78,130,180,"CyanAzure"],[40,88,156,"CyanCobaltBlue"],[24,139,194,"CyanCornflowerBlue"],[70,130,191,"CyanblueAzure"],[88,66,124,"CyberGrape"],[255,211,0,"CyberYellow"],[245,111,161,"Cyclamen"],[117,46,35,"CypressBarkColor"],[111,48,40,"CypressBarkRed"],[27,41,75,"DBLL"],[255,255,49,"Daffodil"],[240,225,48,"Dandelion"],[253,219,109,"Dandelion"],[0,0,139,"DarkBlue"],[102,102,153,"DarkBluegray"],[128,74,0,"DarkBronze"],[101,67,33,"DarkBrown"],[136,101,78,"DarkBrowntangelo"],[93,57,84,"DarkByzantium"],[164,0,0,"DarkCandyAppleRed"],[8,69,126,"DarkCerulean"],[51,51,51,"DarkCharcoal"],[152,105,96,"DarkChestnut"],[73,2,6,"DarkChocolate"],[205,91,69,"DarkCoral"],[38,66,139,"DarkCornflowerBlue"],[0,139,139,"DarkCyan"],[83,104,120,"DarkElectricBlue"],[170,108,57,"DarkGold"],[184,134,11,"DarkGoldenrod"],[1,50,32,"DarkGreen"],[31,38,42,"DarkGunmetal"],[0,20,126,"DarkImperialBlue"],[0,65,106,"DarkImperialBlue"],[97,78,110,"DarkIndigo"],[26,36,33,"DarkJungleGreen"],[189,183,107,"DarkKhaki"],[72,60,50,"DarkLava"],[115,79,150,"DarkLavender"],[139,190,27,"DarkLemonLime"],[83,75,79,"DarkLiver"],[84,61,55,"DarkLiver"],[139,0,139,"DarkMagenta"],[0,51,102,"DarkMidnightBlue"],[74,93,35,"DarkMossGreen"],[2,7,93,"DarkNavy"],[85,107,47,"DarkOliveGreen"],[255,140,0,"DarkOrange"],[153,50,204,"DarkOrchid"],[119,158,203,"DarkPastelBlue"],[3,192,60,"DarkPastelGreen"],[150,111,214,"DarkPastelPurple"],[194,59,34,"DarkPastelRed"],[231,84,128,"DarkPink"],[0,51,153,"DarkPowderBlue"],[79,58,60,"DarkPuce"],[48,25,52,"DarkPurple"],[135,38,87,"DarkRaspberry"],[35,25,30,"DarkRed"],[139,0,0,"DarkRed"],[233,150,122,"DarkSalmon"],[86,3,25,"DarkScarlet"],[143,188,143,"DarkSeaGreen"],[60,20,20,"DarkSienna"],[113,112,110,"DarkSilver"],[140,190,214,"DarkSkyBlue"],[72,61,139,"DarkSlateBlue"],[47,79,79,"DarkSlateGray"],[23,114,69,"DarkSpringGreen"],[145,129,81,"DarkTan"],[255,168,18,"DarkTangerine"],[204,78,92,"DarkTerraCotta"],[0,206,209,"DarkTurquoise"],[209,190,168,"DarkVanilla"],[148,0,211,"DarkViolet"],[155,135,12,"DarkYellow"],[0,112,60,"DartmouthGreen"],[85,85,85,"Davy's grey"],[250,123,98,"Dawncolor"],[255,137,54,"Daylilycolored"],[215,10,83,"DebianRed"],[213,120,53,"DecayingLeavesColor"],[156,138,164,"DeepAmethyst"],[64,130,109,"DeepAquamarine"],[169,32,62,"DeepCarmine"],[239,48,56,"DeepCarminePink"],[233,105,44,"DeepCarrotOrange"],[218,50,135,"DeepCerise"],[250,214,165,"DeepChampagne"],[185,78,72,"DeepChestnut"],[112,66,65,"DeepCoffee"],[155,53,27,"DeepDumpling"],[193,84,193,"DeepFuchsia"],[5,102,8,"DeepGreen"],[14,124,97,"DeepGreencyanTurquoise"],[0,75,73,"DeepJungleGreen"],[51,51,102,"DeepKoamaru"],[245,199,26,"DeepLemon"],[153,85,187,"DeepLilac"],[204,0,204,"DeepMagenta"],[130,0,0,"DeepMaroon"],[212,115,212,"DeepMauve"],[53,94,59,"DeepMossGreen"],[255,203,164,"DeepPeach"],[169,92,104,"DeepPuce"],[58,36,59,"DeepPurple"],[133,1,1,"DeepRed"],[132,63,91,"DeepRuby"],[255,153,51,"DeepSaffron"],[123,59,58,"DeepScarlet"],[74,100,108,"DeepSpaceSparkle"],[126,94,96,"DeepTaupe"],[102,66,77,"DeepTuscanRed"],[51,0,102,"DeepViolet"],[186,135,89,"Deer"],[106,178,202,"DelicateGirlBlue"],[34,67,182,"DenimBlue"],[102,153,153,"DesaturatedCyan"],[237,201,175,"DesertSand"],[234,60,83,"Desire"],[105,105,105,"DimGray"],[197,49,81,"DingyDungeon"],[155,118,83,"Dirt"],[181,101,30,"DirtyBrown"],[232,228,201,"DirtyWhite"],[63,49,58,"DisappearingPurple"],[30,144,255,"DodgerBlue"],[254,246,91,"DodieYellow"],[215,24,104,"DogwoodRose"],[133,187,101,"DollarBill"],[130,142,132,"DolphinGray"],[36,150,205,"DoubanBlue"],[46,150,61,"DoubanGreen"],[247,197,142,"DoubanLightYellow"],[117,93,91,"DoveFeatherGrey"],[0,0,156,"DukeBlue"],[79,73,68,"DullBlue"],[176,121,57,"Durian"],[230,208,171,"DurianWhite"],[225,189,39,"DurianYellow"],[229,204,201,"DustStorm"],[239,223,187,"DutchWhite"],[225,169,95,"EarthYellow"],[93,58,26,"Earthtone"],[94,40,36,"EbichaMaroon"],[85,93,80,"Ebony"],[194,178,128,"Ecru"],[27,27,27,"EerieBlack"],[255,166,49,"Egg"],[97,64,81,"Eggplant"],[240,234,214,"Eggshell"],[226,190,159,"EggshellPaper"],[16,52,166,"EgyptianBlue"],[23,24,43,"Elderberry"],[125,249,255,"ElectricBlue"],[181,98,87,"ElectricBrown"],[255,0,63,"ElectricCrimson"],[111,0,255,"ElectricIndigo"],[204,255,0,"ElectricLime"],[255,53,3,"ElectricOrange"],[246,38,129,"ElectricPink"],[191,0,255,"ElectricPurple"],[230,0,0,"ElectricRed"],[63,0,255,"ElectricUltramarine"],[143,0,255,"ElectricViolet"],[255,255,51,"ElectricYellow"],[80,200,120,"Emerald"],[4,99,7,"EmeraldGreen"],[108,48,130,"Eminence"],[180,131,149,"EnglishLavender"],[171,75,82,"EnglishRed"],[204,71,75,"EnglishVermillion"],[86,60,92,"EnglishViolet"],[150,200,162,"EtonBlue"],[68,215,168,"Eucalyptus"],[71,63,45,"FIT"],[1,11,19,"FOGRA29RichBlack"],[1,2,3,"FOGRA39RichBlack"],[57,86,156,"FacebookBlue"],[155,83,63,"FadedSpicyRedbrown"],[67,36,42,"FakePurple"],[128,24,24,"FaluRed"],[181,51,137,"Fandango"],[222,82,133,"FandangoPink"],[244,0,161,"FashionFuchsia"],[229,170,112,"Fawn"],[77,93,83,"Feldgrau"],[253,213,177,"Feldspar"],[79,121,66,"FernGreen"],[255,40,0,"FerrariRed"],[108,84,30,"FieldDrab"],[255,84,112,"FieryRose"],[149,123,56,"Finchbrown"],[206,32,41,"FireEngineRed"],[233,92,75,"FireOpal"],[178,34,34,"Firebrick"],[226,88,34,"Flame"],[252,142,172,"FlamingoPink"],[247,233,142,"Flavescent"],[238,220,130,"Flax"],[255,233,209,"Flesh"],[33,107,214,"FlickrBlue"],[251,0,129,"FlickrPink"],[162,0,109,"Flirt"],[255,185,78,"FloralLeaf"],[244,152,173,"FlowerGirl"],[21,244,238,"FluorescentBlue"],[255,0,79,"Folly"],[201,31,55,"ForeignCrimson"],[34,139,34,"ForestGreen"],[95,167,119,"ForestGreen"],[1,68,33,"ForestGreenTrd"],[152,86,41,"Fox"],[133,109,77,"FrenchBistre"],[0,114,187,"FrenchBlue"],[253,63,146,"FrenchFuchsia"],[134,96,142,"FrenchLilac"],[158,253,56,"FrenchLime"],[253,108,158,"FrenchPink"],[129,20,83,"FrenchPlum"],[78,22,9,"FrenchPuce"],[199,44,72,"FrenchRaspberry"],[246,74,138,"FrenchRose"],[119,181,254,"FrenchSkyBlue"],[136,6,206,"FrenchViolet"],[172,30,68,"FrenchWine"],[166,231,255,"FreshAir"],[91,137,48,"FreshOnion"],[233,54,167,"Frostbite"],[255,119,255,"FuchsiaPink"],[204,57,123,"FuchsiaPurple"],[199,67,117,"FuchsiaRose"],[228,132,0,"Fulvous"],[204,102,102,"FuzzyWuzzy"],[192,54,44,"GGBIntOrange"],[0,171,102,"GOGreen"],[220,220,220,"Gainsboro"],[228,155,15,"Gamboge"],[255,223,70,"GargoyleGas"],[115,54,53,"Garnet"],[0,127,102,"GenericViridian"],[248,248,255,"GhostWhite"],[176,92,82,"Giant's Club"],[254,90,29,"GiantsOrange"],[216,228,188,"Gin"],[188,45,41,"GinshuGreyedRed"],[96,130,182,"Glaucous"],[211,78,54,"GlazedPersimmon"],[171,146,179,"GlossyGrape"],[165,124,0,"Gold"],[203,126,31,"GoldBrown"],[230,190,138,"GoldCrayola"],[189,155,22,"GoldFoil"],[133,117,78,"GoldFusion"],[212,175,55,"GoldMetallic"],[153,101,21,"GoldenBrown"],[198,107,39,"GoldenBrown"],[226,156,69,"GoldenFallenLeaves"],[125,78,45,"GoldenGreyBamboo"],[187,129,65,"GoldenOak"],[252,194,0,"GoldenPoppy"],[255,223,0,"GoldenYellow"],[218,165,32,"Goldenrod"],[76,139,245,"GoogleChromeBlue"],[26,162,96,"GoogleChromeGreen"],[222,82,70,"GoogleChromeRed"],[255,206,68,"GoogleChromeYellow"],[32,56,56,"GoryeoStoreroom"],[103,103,103,"GraniteGray"],[168,228,160,"GrannySmithApple"],[111,45,168,"Grape"],[99,66,75,"GrapeMouse"],[70,89,69,"Grayasparagus"],[0,128,1,"Green"],[0,100,66,"GreenBamboo"],[40,135,200,"GreenBlueCrayola"],[76,114,29,"GreenCola"],[28,172,120,"GreenCrayola"],[167,244,50,"GreenLizard"],[42,96,59,"GreenMidori"],[0,168,119,"GreenMunsell"],[0,159,107,"GreenNCS"],[0,173,67,"GreenPantone"],[0,165,80,"GreenPigment"],[102,176,50,"GreenRYB"],[110,174,161,"GreenSheen"],[101,255,0,"GreenSlime"],[130,75,53,"GreenTea"],[240,232,145,"GreenYellowCrayola"],[17,100,180,"Greenblue"],[0,153,102,"Greencyan"],[189,169,40,"Greenfinch"],[173,255,47,"Greenyellow"],[101,98,85,"GreyishDarkGreen"],[169,154,134,"Grullo"],[42,52,57,"Gunmetal"],[0,255,127,"GuppieGreen"],[248,248,248,"Guyabano"],[102,56,84,"Halayà úbe"],[141,96,140,"HalfColor"],[235,97,35,"HalloweenOrange"],[68,108,207,"HanBlue"],[82,24,250,"HanPurple"],[117,125,117,"HarborRat"],[63,255,0,"Harlequin"],[70,203,24,"HarlequinGreen"],[242,156,183,"HarmoniousRose"],[218,145,0,"HarvestGold"],[0,195,227,"HawaiiBlue"],[255,122,0,"HeatWave"],[223,115,255,"Heliotrope"],[170,152,169,"HeliotropeGray"],[170,0,187,"HeliotropeMagenta"],[60,19,33,"HersheysDarkChoc"],[240,255,240,"Honeydew"],[0,109,176,"HonoluluBlue"],[73,121,107,"Hooker's green"],[61,93,66,"Horsetail"],[255,29,206,"HotMagenta"],[255,105,180,"HotPink"],[207,10,44,"HuaweiRed"],[46,55,46,"ICFSB"],[245,143,132,"IbisWing"],[113,166,210,"Iceberg"],[146,60,1,"IcedTea"],[252,247,94,"Icterine"],[113,188,120,"IguanaGreen"],[49,145,119,"IlluminatingEmerald"],[96,47,107,"Imperial"],[0,35,149,"ImperialBlue"],[102,2,60,"ImperialPurple"],[237,41,57,"ImperialRed"],[178,236,93,"Inchworm"],[76,81,109,"Independence"],[19,136,8,"IndiaGreen"],[205,92,92,"IndianRed"],[227,168,87,"IndianYellow"],[9,31,146,"IndigoDye"],[57,52,50,"IndigoInkBrown"],[35,48,103,"IndigoRainbow"],[235,246,247,"IndigoWhite"],[255,73,108,"InfraRed"],[39,34,31,"InkColor"],[45,68,54,"InsectScreen"],[198,194,182,"InsideBottle"],[255,79,0,"IntOrange"],[186,22,12,"IntOrangeEng"],[54,12,204,"InterdimensionalBlue"],[90,79,207,"Iris"],[118,53,104,"IrisColor"],[43,55,51,"Iron"],[161,157,148,"Iron"],[52,77,86,"IronHeadFlower"],[43,55,54,"IronStorage"],[179,68,108,"Irresistible"],[244,240,236,"Isabelline"],[0,144,0,"IslamicGreen"],[233,246,239,"ItalianIce"],[99,90,82,"ItalianLeather"],[144,102,82,"ItalianRoast"],[255,255,240,"Ivory"],[94,85,69,"IwaiBrown"],[127,93,59,"JISB"],[61,50,93,"Jacarta"],[65,54,40,"JackoBean"],[0,168,107,"Jade"],[226,177,60,"JapTriandraGrass"],[157,41,51,"JapaneseCarmine"],[38,67,72,"JapaneseIndigo"],[47,117,50,"JapaneseLaurel"],[91,50,86,"JapaneseViolet"],[248,222,126,"Jasmine"],[215,59,62,"Jasper"],[222,143,78,"JasperOrange"],[165,11,94,"JazzberryJam"],[218,97,78,"JellyBean"],[68,121,142,"JellyBeanBlue"],[52,52,52,"Jet"],[187,208,201,"JetStream"],[244,202,22,"Jonquil"],[138,185,241,"JordyBlue"],[189,218,87,"JuneBud"],[41,171,135,"JungleGreen"],[81,40,136,"KSUPurple"],[232,0,13,"KUCrimson"],[76,187,23,"KellyGreen"],[124,28,5,"KenyanCopper"],[58,176,158,"Keppel"],[232,244,140,"KeyLime"],[61,76,81,"KimonoStorage"],[142,229,63,"Kiwi"],[136,45,23,"Kobe"],[231,159,196,"Kobi"],[202,105,36,"KohaAmber"],[23,20,18,"KokuBlack"],[53,66,48,"KombuGreen"],[25,34,54,"KonDarkBlue"],[251,153,18,"Kumquat"],[214,202,221,"LanguidLavender"],[224,188,91,"Lanzones"],[31,71,136,"LapisLazuli"],[38,97,156,"LapisLazuli"],[255,255,102,"LaserLemon"],[169,186,157,"LaurelGreen"],[207,16,32,"Lava"],[255,240,245,"LavenderBlush"],[181,126,220,"LavenderFloral"],[196,195,208,"LavenderGray"],[148,87,235,"LavenderIndigo"],[238,130,238,"LavenderMagenta"],[230,230,250,"LavenderMist"],[251,174,210,"LavenderPink"],[150,123,182,"LavenderPurple"],[251,160,227,"LavenderRose"],[124,252,0,"LawnGreen"],[46,33,27,"LegalDye"],[255,247,0,"Lemon"],[255,250,205,"LemonChiffon"],[204,160,29,"LemonCurry"],[253,255,0,"LemonGlacier"],[189,48,0,"LemonIcedTea"],[92,255,103,"LemonLime"],[227,255,0,"LemonLime"],[246,234,190,"LemonMeringue"],[255,244,79,"LemonYellow"],[255,255,159,"LemonYellow"],[186,147,216,"Lenurple"],[84,90,167,"Liberty"],[26,17,16,"Licorice"],[72,146,155,"LightBlue"],[173,216,230,"LightBlue"],[29,105,124,"LightBlueFlower"],[4,79,103,"LightBlueSilk"],[181,101,29,"LightBrown"],[230,103,113,"LightCarminePink"],[85,31,47,"LightChocolateCosmos"],[136,172,224,"LightCobaltBlue"],[240,128,128,"LightCoral"],[245,105,145,"LightCrimson"],[224,255,255,"LightCyan"],[255,92,205,"LightDeepPink"],[200,173,127,"LightFrenchBeige"],[249,132,239,"LightFuchsiaPink"],[178,151,0,"LightGold"],[250,250,210,"LightGoldenrodYellow"],[211,211,211,"LightGray"],[204,153,204,"LightGrayishMagenta"],[144,238,144,"LightGreen"],[255,179,222,"LightHotPink"],[240,230,140,"LightKhaki"],[255,128,255,"LightMagenta"],[211,155,203,"LightMediumOrchid"],[173,223,173,"LightMossGreen"],[254,216,177,"LightOrange"],[230,168,215,"LightOrchid"],[177,156,217,"LightPastelPurple"],[197,203,225,"LightPeriwinkle"],[255,182,193,"LightPink"],[255,204,203,"LightRed"],[255,160,122,"LightSalmon"],[255,153,153,"LightSalmonPink"],[32,178,170,"LightSeaGreen"],[216,216,216,"LightSilver"],[135,206,250,"LightSkyBlue"],[119,136,153,"LightSlateGray"],[176,196,222,"LightSteelBlue"],[179,139,109,"LightTaupe"],[247,187,125,"LightYellow"],[255,255,224,"LightYellow"],[200,162,200,"Lilac"],[174,152,170,"LilacLuster"],[50,205,50,"LimeGreen"],[209,225,137,"LimePulp"],[157,194,9,"Limerick"],[25,89,5,"LincolnGreen"],[250,240,230,"Linen"],[0,114,177,"LinkedinBlue"],[108,160,220,"LittleBoyBlue"],[248,185,212,"LittleGirlPink"],[103,76,71,"Liver"],[152,116,86,"LiverChestnut"],[184,109,41,"LiverDogs"],[108,46,31,"LiverOrgan"],[185,87,84,"LongSpring"],[171,97,52,"LoquatBrown"],[254,253,250,"Lotion"],[21,242,253,"LotionBlue"],[236,207,207,"LotionPink"],[255,228,205,"Lumber"],[230,32,32,"Lust"],[220,83,73,"Lychee"],[127,107,93,"LyeColored"],[24,69,59,"MSUGreen"],[255,189,136,"MacaroniAndCheese"],[204,51,54,"MadderLake"],[202,31,123,"MagentaDye"],[159,69,118,"MagentaHaze"],[208,65,126,"MagentaPantone"],[255,0,144,"MagentaProcess"],[204,51,139,"Magentapink"],[170,240,209,"MagicMint"],[255,68,102,"MagicPotion"],[248,244,255,"Magnolia"],[192,64,0,"Mahogany"],[242,198,73,"MaizeCrayola"],[96,80,220,"MajorelleBlue"],[11,218,81,"Malachite"],[151,154,170,"Manatee"],[243,122,72,"Mandarin"],[253,190,2,"Mango"],[150,255,0,"MangoGreen"],[255,130,67,"MangoTango"],[231,201,169,"Manila"],[116,195,101,"Mantis"],[187,147,81,"MapleSyrup"],[136,0,133,"MardiGras"],[242,217,48,"Margarine"],[176,194,74,"Margarita"],[234,162,33,"Marigold"],[224,176,255,"Mauve"],[145,95,109,"MauveTaupe"],[239,152,170,"Mauvelous"],[71,171,204,"MaximumBlue"],[48,191,191,"MaximumBlueGreen"],[172,172,230,"MaximumBluePurple"],[94,140,49,"MaximumGreen"],[217,230,80,"MaximumGreenYellow"],[255,91,0,"MaximumOrange"],[115,51,128,"MaximumPurple"],[217,33,33,"MaximumRed"],[166,58,121,"MaximumRedPurple"],[250,250,55,"MaximumYellow"],[242,186,73,"MaximumYellowRed"],[76,145,65,"MayGreen"],[115,194,251,"MayaBlue"],[249,144,111,"Meat"],[229,183,59,"MeatBrown"],[102,221,170,"MediumAquamarine"],[0,0,205,"MediumBlue"],[226,6,44,"MediumCandyAppleRed"],[175,64,53,"MediumCarmine"],[243,229,171,"MediumChampagne"],[201,55,86,"MediumCrimson"],[3,80,150,"MediumElectricBlue"],[28,53,45,"MediumJungleGreen"],[221,160,221,"MediumLavenderMagenta"],[186,85,211,"MediumOrchid"],[0,103,165,"MediumPersianBlue"],[147,112,219,"MediumPurple"],[187,51,133,"MediumRedviolet"],[170,64,105,"MediumRuby"],[60,179,113,"MediumSeaGreen"],[128,218,235,"MediumSkyBlue"],[123,104,238,"MediumSlateBlue"],[201,220,135,"MediumSpringBud"],[0,250,154,"MediumSpringGreen"],[72,209,204,"MediumTurquoise"],[217,96,59,"MediumVermilion"],[199,21,133,"MediumVioletred"],[253,188,180,"Melancholy"],[248,184,120,"MellowApricot"],[254,186,173,"Melon"],[193,249,162,"Menthol"],[50,82,123,"MetallicBlue"],[169,113,66,"MetallicBronze"],[172,67,19,"MetallicBrown"],[41,110,1,"MetallicGreen"],[218,104,15,"MetallicOrange"],[237,166,196,"MetallicPink"],[166,44,43,"MetallicRed"],[10,126,140,"MetallicSeaweed"],[156,124,56,"MetallicSunburst"],[91,10,145,"MetallicViolet"],[253,204,13,"MetallicYellow"],[228,0,124,"MexicanPink"],[0,162,237,"MicrosoftBlue"],[0,120,215,"MicrosoftEdgeBlue"],[125,183,0,"MicrosoftGreen"],[240,78,31,"MicrosoftRed"],[253,185,0,"MicrosoftYellow"],[126,212,230,"MiddleBlue"],[141,217,204,"MiddleBlueGreen"],[139,114,190,"MiddleBluePurple"],[77,140,87,"MiddleGreen"],[172,191,96,"MiddleGreenYellow"],[139,134,128,"MiddleGrey"],[217,130,181,"MiddlePurple"],[229,142,115,"MiddleRed"],[165,83,83,"MiddleRedPurple"],[255,235,0,"MiddleYellow"],[236,177,118,"MiddleYellowRed"],[112,38,112,"Midnight"],[0,70,140,"MidnightBlue"],[25,25,112,"MidnightBlue"],[0,73,83,"MidnightGreen"],[255,196,12,"MikadoYellow"],[253,255,245,"Milk"],[132,86,60,"MilkChocolate"],[255,218,233,"MimiPink"],[227,249,136,"Mindaro"],[54,116,125,"Ming"],[245,224,80,"MinionYellow"],[62,180,137,"Mint"],[245,255,250,"MintCream"],[187,180,119,"MistyMoss"],[190,164,147,"Mocha"],[58,168,193,"Moonstone"],[115,169,194,"MoonstoneBlue"],[174,12,0,"MordantRed19"],[141,163,153,"MorningBlue"],[139,125,58,"MossColor"],[138,154,91,"MossGreen"],[48,186,143,"MountainMeadow"],[153,122,141,"MountbattenPink"],[92,84,78,"MousyIndigo"],[118,105,128,"MousyWisteria"],[112,84,62,"Mud"],[203,102,73,"MuddyBrown"],[48,96,48,"MughalGreen"],[197,75,140,"Mulberry"],[200,80,155,"Mulberry"],[89,41,44,"MulberryDye"],[197,127,46,"MulberryDyed"],[255,219,88,"Mustard"],[205,122,0,"MustardBrown"],[110,110,48,"MustardGreen"],[225,173,1,"MustardYellow"],[49,120,115,"MyrtleGreen"],[214,82,130,"Mystic"],[173,67,121,"MysticMaroon"],[255,85,0,"MysticRed"],[246,173,198,"NadeshikoPink"],[42,128,0,"NapierGreen"],[250,218,94,"NaplesYellow"],[255,222,173,"NavajoWhite"],[25,31,69,"NavyBlueBellflower"],[27,3,163,"NeonBlue"],[255,163,67,"NeonCarrot"],[254,65,100,"NeonFuchsia"],[57,255,20,"NeonGreen"],[0,108,127,"NewBridge"],[33,79,198,"NewCar"],[215,131,127,"NewYorkPink"],[114,116,114,"Nickel"],[92,72,39,"NightingaleBrown"],[228,0,15,"NintendoRed"],[164,221,237,"NonphotoBlue"],[5,144,51,"NorthTexasGreen"],[233,255,219,"Nyanza"],[132,22,23,"OUCrimsonRed"],[79,66,181,"OceanBlue"],[0,119,190,"OceanBoatBlue"],[72,191,145,"OceanGreen"],[190,127,81,"Ochre"],[204,119,34,"Ochre"],[255,78,32,"Ochre"],[253,82,64,"OgreOdor"],[94,100,79,"OldBamboo"],[67,48,46,"OldBurgundy"],[207,181,59,"OldGold"],[253,245,230,"OldLace"],[121,104,120,"OldLavender"],[103,49,71,"OldMauve"],[134,126,54,"OldMossGreen"],[192,128,129,"OldRose"],[107,142,35,"Olive Drab #3"],[60,52,31,"Olive Drab #7"],[181,179,92,"OliveGreen"],[154,185,115,"Olivine"],[54,65,65,"Onando"],[240,143,144,"OneKin"],[53,56,57,"Onyx"],[168,195,188,"Opal"],[183,132,167,"OperaMauve"],[255,27,45,"OperaRed"],[77,100,108,"OppositeFlower"],[255,102,0,"Orange"],[255,127,0,"OrangeCW"],[255,117,56,"OrangeCrayola"],[255,88,0,"OrangePantone"],[255,159,0,"OrangePeel"],[251,153,2,"OrangeRYB"],[235,89,61,"OrangeSoda"],[250,91,61,"OrangeSoda"],[248,213,104,"OrangeYellow"],[255,83,73,"Orangered"],[255,104,31,"Orangered"],[245,189,31,"Orangeyellow"],[218,112,214,"Orchid"],[226,156,210,"Orchid"],[242,189,205,"OrchidPink"],[251,79,20,"OriolesOrange"],[45,56,58,"OuterSpace"],[65,74,76,"OuterSpace"],[255,110,74,"OutrageousOrange"],[227,92,56,"OverdyedRedBrown"],[0,33,71,"OxfordBlue"],[109,154,121,"Oxley"],[28,169,201,"PacificBlue"],[107,73,71,"Painite"],[0,102,0,"PakistanGreen"],[39,59,226,"PalatinateBlue"],[104,40,96,"PalatinatePurple"],[175,238,238,"Pale Blue / Pale Turquoise"],[140,156,118,"PaleBlue"],[152,118,84,"PaleBrown"],[155,196,226,"PaleCerulean"],[221,173,175,"PaleChestnut"],[135,211,248,"PaleCyan"],[170,135,54,"PaleFallenLeaves"],[238,232,170,"PaleGoldenrod"],[152,251,152,"PaleGreen"],[116,159,141,"PaleGreenOnion"],[255,165,101,"PaleIncense"],[220,208,255,"PaleLavender"],[249,132,229,"PaleMagenta"],[255,153,204,"PaleMagentaPink"],[187,164,109,"PaleOak"],[252,164,116,"PalePersimmon"],[250,218,221,"PalePink"],[250,230,250,"PalePurple"],[219,112,147,"PaleRedviolet"],[150,222,209,"PaleRobinEggBlue"],[201,192,187,"PaleSilver"],[236,235,189,"PaleSpringBud"],[188,152,126,"PaleTaupe"],[204,153,255,"PaleViolet"],[141,178,85,"PaleYoungGreenOnion"],[111,153,64,"PalmLeaf"],[0,64,190,"PanasonicBlue"],[120,24,74,"PansyPurple"],[0,155,125,"PaoloVeroneseGreen"],[255,239,213,"PapayaWhip"],[230,62,98,"ParadisePink"],[126,182,255,"ParakeetBlue"],[217,152,160,"ParrotPink"],[174,198,207,"PastelBlue"],[131,105,83,"PastelBrown"],[207,207,196,"PastelGray"],[119,221,119,"PastelGreen"],[244,154,194,"PastelMagenta"],[255,179,71,"PastelOrange"],[222,165,164,"PastelPink"],[179,158,181,"PastelPurple"],[255,105,97,"PastelRed"],[203,153,201,"PastelViolet"],[253,253,150,"PastelYellow"],[64,122,82,"Patina"],[217,182,17,"PatriniaFlowers"],[255,229,180,"Peach"],[243,153,152,"PeachBurst"],[244,121,131,"PeachColored"],[255,218,185,"PeachPuff"],[255,204,153,"Peachorange"],[250,223,173,"Peachyellow"],[209,226,49,"Pear"],[234,224,200,"Pearl"],[136,216,192,"PearlAqua"],[183,104,162,"PearlyPurple"],[245,243,239,"PenguinWhite"],[230,226,0,"Peridot"],[195,205,230,"Periwinkle"],[225,44,44,"PermanentGeraniumLake"],[28,57,187,"PersianBlue"],[0,166,147,"PersianGreen"],[50,18,122,"PersianIndigo"],[217,144,88,"PersianOrange"],[247,127,190,"PersianPink"],[112,28,28,"PersianPlum"],[204,51,51,"PersianRed"],[254,40,162,"PersianRose"],[236,88,0,"Persimmon"],[147,67,55,"PersimmonJuice"],[205,133,63,"Peru"],[139,168,183,"PewterBlue"],[0,56,167,"PhilippineBlue"],[110,58,7,"PhilippineBronze"],[93,25,22,"PhilippineBrown"],[177,115,4,"PhilippineGold"],[140,140,140,"PhilippineGray"],[0,133,67,"PhilippineGreen"],[255,115,0,"PhilippineOrange"],[250,26,142,"PhilippinePink"],[206,17,39,"PhilippineRed"],[179,179,179,"PhilippineSilver"],[129,0,127,"PhilippineViolet"],[254,203,0,"PhilippineYellow"],[223,0,255,"Phlox"],[0,15,137,"PhthaloBlue"],[18,53,36,"PhthaloGreen"],[69,177,232,"PictonBlue"],[195,11,78,"PictorialCarmine"],[253,221,230,"PiggyPink"],[1,121,111,"PineGreen"],[69,77,50,"PineNeedle"],[42,47,35,"PineTree"],[86,60,13,"Pineapple"],[252,116,253,"PinkFlamingo"],[255,221,244,"PinkLace"],[216,178,209,"PinkLavender"],[215,72,148,"PinkPantone"],[231,172,207,"PinkPearl"],[152,0,54,"PinkRaspberry"],[247,143,167,"PinkSherbet"],[147,197,114,"Pistachio"],[57,18,133,"PixiePowder"],[110,95,87,"PlainMouse"],[229,228,226,"Platinum"],[142,69,133,"Plum"],[143,65,85,"PlumPurple"],[151,100,90,"PlumblossomMouse"],[250,146,88,"Plumdyed"],[89,70,178,"PlumpPurple"],[53,101,77,"PokerGreen"],[152,85,56,"PolishedBrown"],[93,164,147,"PolishedPine"],[102,12,33,"Pomegranate"],[150,165,60,"Pomelo"],[191,189,112,"PomeloOlive"],[249,255,227,"PomeloWhite"],[246,160,140,"PoppyPetal"],[190,79,98,"Popstar"],[147,105,0,"Porcupine"],[255,90,54,"PortlandOrange"],[176,224,230,"PowderBlue"],[255,133,207,"PrincessPerfume"],[245,128,37,"PrincetonOrange"],[0,49,83,"PrussianBlue"],[0,49,113,"PrussianBlue"],[204,136,153,"Puce"],[114,47,55,"PuceRed"],[59,51,28,"PullmanGreen"],[255,117,24,"Pumpkin"],[195,39,43,"PureCrimson"],[105,53,156,"PurpleHeart"],[81,44,49,"PurpleKite"],[150,120,182,"PurpleMountainMajesty"],[159,0,197,"PurpleMunsell"],[79,40,75,"PurpleMurasaki"],[78,81,128,"PurpleNavy"],[254,78,218,"PurplePizzazz"],[156,81,182,"PurplePlum"],[80,64,77,"PurpleTaupe"],[154,78,174,"Purpureus"],[81,72,79,"Quartz"],[67,107,149,"QueenBlue"],[232,204,215,"QueenPink"],[166,166,166,"QuickSilver"],[142,58,89,"QuinacridoneMagenta"],[106,84,69,"Quincy"],[93,138,168,"RAFBlue"],[73,30,60,"RabbitearIris"],[255,53,94,"RadicalRed"],[36,33,36,"RaisinBlack"],[251,171,96,"Rajah"],[199,18,50,"Rambutan"],[167,33,39,"RambutanRed"],[227,177,48,"RapeblossomBrown"],[161,121,23,"RapeseedOil"],[227,11,93,"Raspberry"],[226,80,152,"RaspberryPink"],[214,138,89,"RawSienna"],[130,102,68,"RawUmber"],[255,51,204,"RazzleDazzleRose"],[227,37,107,"Razzmatazz"],[141,78,133,"RazzmicBerry"],[102,51,153,"RebeccaPurple"],[103,36,34,"RedBean"],[157,43,34,"RedBirch"],[182,32,32,"RedCola"],[238,32,77,"RedCrayola"],[134,1,17,"RedDevil"],[240,127,94,"RedIncense"],[145,50,40,"RedKite"],[242,0,60,"RedMunsell"],[196,2,51,"RedNCS"],[159,82,51,"RedOchre"],[219,90,107,"RedPlum"],[254,39,18,"RedRYB"],[253,58,74,"RedSalsa"],[187,119,150,"RedWisteria"],[251,129,54,"RedbronzeBeniukon"],[161,61,45,"RedbrownEdocha"],[139,53,45,"RedbrownKiriume"],[220,48,35,"Redorange"],[228,0,120,"Redpurple"],[146,43,62,"RedvioletCW"],[192,68,143,"RedvioletCrayola)"],[164,90,82,"Redwood"],[82,45,128,"Regalia"],[0,35,135,"ResolutionBlue"],[119,118,150,"Rhythm"],[0,64,64,"RichBlack"],[241,167,254,"RichBrilliantLavender"],[8,146,208,"RichElectricBlue"],[245,127,79,"RichGardenia"],[167,107,207,"RichLavender"],[182,102,210,"RichLilac"],[68,76,56,"RifleGreen"],[83,74,50,"RikanBrown"],[176,146,122,"RikyusTea"],[255,121,82,"RinsedoutRed"],[255,195,36,"RipeMango"],[138,127,128,"RocketMetallic"],[131,137,150,"RomanSilver"],[41,14,5,"RootBeer"],[249,66,158,"RoseBonbon"],[158,94,111,"RoseDust"],[103,72,70,"RoseEbony"],[150,1,69,"RoseGarnet"],[183,110,121,"RoseGold"],[255,102,204,"RosePink"],[189,85,156,"RoseQuartzPink"],[194,30,86,"RoseRed"],[144,93,93,"RoseTaupe"],[171,78,82,"RoseVale"],[101,0,11,"Rosewood"],[212,0,0,"RossoCorsa"],[188,143,143,"RosyBrown"],[0,56,168,"RoyalAzure"],[82,59,53,"RoyalBrown"],[202,44,146,"RoyalFuchsia"],[19,98,7,"RoyalGreen"],[249,146,69,"RoyalOrange"],[231,56,149,"RoyalPink"],[120,81,169,"RoyalPurple"],[155,28,49,"RoyalRed"],[208,0,96,"RoyalRed"],[206,70,118,"Ruber"],[209,0,86,"RubineRed"],[224,17,95,"Ruby"],[155,17,30,"RubyRed"],[255,0,40,"Ruddy"],[187,101,40,"RuddyBrown"],[225,142,150,"RuddyPink"],[168,28,7,"Rufous"],[113,102,117,"Rum"],[128,70,27,"Russet"],[103,146,103,"RussianGreen"],[50,23,77,"RussianViolet"],[183,65,14,"Rust"],[106,127,122,"RustedLightblue"],[137,138,116,"RustyCeladon"],[218,44,67,"RustyRed"],[69,88,89,"RustyStorage"],[58,64,59,"RustyStoreroom"],[255,126,0,"SAEAmber"],[130,107,88,"SNRTea"],[4,57,39,"SacramentoStateGreen"],[139,69,19,"SaddleBrown"],[255,103,0,"SafetyOrange"],[255,120,0,"SafetyOrange"],[238,210,2,"SafetyYellow"],[90,79,116,"Safflower"],[244,196,48,"Saffron"],[188,184,138,"Sage"],[250,128,114,"Salmon"],[255,145,164,"SalmonPink"],[231,150,139,"SalmonRose"],[18,39,158,"SamsungBlue"],[236,213,64,"Sandstorm"],[244,164,96,"SandyBrown"],[253,217,181,"SandyTan"],[146,0,10,"Sangria"],[80,125,42,"SapGreen"],[126,38,57,"Sappanwood"],[162,79,70,"SappanwoodIncense"],[15,82,186,"Sapphire"],[255,70,129,"SasquatchSocks"],[203,161,53,"SatinSheenGold"],[236,149,108,"SawtoothOak"],[255,36,0,"Scarlet"],[207,58,36,"ScarletBlood"],[255,216,0,"SchoolBusYellow"],[53,31,25,"ScorchedBrown"],[102,255,102,"Screamin' Green"],[0,105,148,"SeaBlue"],[159,226,191,"SeaFoamGreen"],[46,139,87,"SeaGreen"],[75,199,207,"SeaSerpent"],[89,38,11,"SealBrown"],[255,245,238,"Seashell"],[255,186,0,"SelectiveYellow"],[112,66,20,"Sepia"],[0,168,112,"SesameStreetGreen"],[138,121,93,"Shadow"],[119,139,165,"ShadowBlue"],[255,207,241,"Shampoo"],[255,230,112,"Shandy"],[143,212,0,"SheenGreen"],[217,134,149,"ShimmeringBlush"],[95,167,120,"ShinyShamrock"],[252,15,192,"ShockingPink"],[255,111,255,"ShockingPink"],[53,78,75,"SilkCrepeBrown"],[172,172,172,"SilverChalice"],[175,177,174,"SilverFoil"],[93,137,186,"SilverLakeBlue"],[170,169,173,"SilverMetallic"],[196,174,173,"SilverPink"],[191,193,194,"SilverSand"],[151,134,124,"Silvergrey"],[76,61,48,"SimmeredSeaweed"],[203,65,11,"Sinopia"],[255,56,85,"SizzlingRed"],[255,219,0,"SizzlingSunrise"],[0,116,116,"Skobeloff"],[118,215,234,"SkyBlue"],[135,206,235,"SkyBlue"],[77,143,172,"SkyBlueColor"],[207,113,175,"SkyMagenta"],[106,90,205,"SlateBlue"],[112,128,144,"SlateGray"],[41,150,23,"SlimyGreen"],[255,109,58,"SmashedPumpkin"],[200,65,134,"Smitten"],[115,130,118,"Smoke"],[131,42,13,"SmokeyTopaz"],[16,12,8,"SmokyBlack"],[147,61,65,"SmokyTopaz"],[255,250,250,"Snow"],[206,200,239,"Soap"],[84,90,44,"SoldierGreen"],[137,56,67,"SolidPink"],[117,117,117,"SonicSilver"],[77,75,58,"SootyWillowBamboo"],[29,41,81,"SpaceCadet"],[128,117,50,"SpanishBistre"],[0,112,184,"SpanishBlue"],[209,0,71,"SpanishCarmine"],[229,26,76,"SpanishCrimson"],[152,152,152,"SpanishGray"],[0,145,80,"SpanishGreen"],[232,97,0,"SpanishOrange"],[247,191,190,"SpanishPink"],[102,3,60,"SpanishPurple"],[230,0,38,"SpanishRed"],[76,40,130,"SpanishViolet"],[0,127,92,"SpanishViridian"],[246,181,17,"SpanishYellow"],[140,71,54,"Sparrowbrown"],[158,19,22,"SpartanCrimson"],[139,95,77,"SpicyMix"],[179,92,68,"SpicyRedbrown"],[15,192,252,"SpiroDiscoBall"],[253,254,3,"Sponge"],[167,252,0,"SpringBud"],[135,255,42,"SpringFrost"],[236,33,49,"SprintRed"],[255,221,5,"SprintYellow"],[122,148,46,"SproutYellow"],[35,41,122,"St. Patrick's blue"],[120,119,155,"StainedRed"],[0,123,184,"StarCommandBlue"],[211,177,125,"SteamedChestnut"],[70,130,180,"SteelBlue"],[204,51,204,"SteelPink"],[95,138,139,"SteelTeal"],[160,148,132,"StoneTerrace"],[207,20,43,"StopRed"],[61,64,53,"StoreroomBrown"],[79,102,106,"Stormcloud"],[228,217,111,"Straw"],[252,90,141,"Strawberry"],[217,70,62,"StrawberryDaiquiri"],[139,23,26,"StrawberryJam"],[200,63,73,"StrawberryRed"],[233,57,158,"StrongBoyPink"],[255,162,107,"StylishPersimmon"],[145,78,117,"SugarPlum"],[89,43,31,"SumacDyed"],[224,138,30,"SumacDyed"],[255,64,76,"SunburntCyclops"],[255,204,51,"Sunglow"],[242,242,122,"Sunny"],[227,171,87,"Sunray"],[253,94,83,"SunsetOrange"],[255,201,34,"SunsetYellow"],[207,107,169,"SuperPink"],[168,55,49,"SweetBrown"],[242,158,171,"SweetSixteen"],[210,180,140,"Tan"],[217,154,108,"Tan"],[249,77,0,"Tangelo"],[242,133,0,"Tangerine"],[255,204,0,"TangerineYellow"],[255,66,0,"TaobaoOrange"],[0,59,111,"TardisBlue"],[251,77,70,"TartOrange"],[151,110,154,"TatarianAsterColor"],[139,133,137,"TaupeGray"],[208,240,192,"TeaGreen"],[54,117,136,"TealBlue"],[153,230,179,"TealDeer"],[0,130,127,"TealGreen"],[207,52,118,"Telemagenta"],[60,33,38,"Temptress"],[205,87,0,"Tenne"],[226,114,91,"TerraCotta"],[168,124,160,"ThinColor"],[216,191,216,"Thistle"],[235,176,215,"Thistle"],[49,117,137,"ThousandHerbColor"],[59,52,41,"ThousandYearOldBrown"],[55,66,49,"ThousandYearOldGreen"],[247,102,90,"ThricedyedCrimson"],[252,137,172,"TickleMePink"],[10,186,181,"TiffanyBlue"],[224,141,60,"Tiger's Eye"],[219,215,210,"Timberwolf"],[135,134,129,"Titanium"],[238,230,0,"TitaniumYellow"],[255,99,71,"Tomato"],[178,24,7,"TomatoSauce"],[116,108,192,"Toolbox"],[255,200,124,"Topaz"],[253,14,53,"TractorRed"],[164,52,93,"TreePeony"],[0,117,94,"TropicalRainForest"],[205,164,222,"TropicalViolet"],[0,115,207,"TrueBlue"],[45,104,196,"TrueBlue"],[143,29,33,"TrueRed"],[62,142,222,"TuftsBlue"],[255,135,141,"Tulip"],[222,170,136,"Tumbleweed"],[181,114,129,"TurkishRose"],[230,155,58,"TurmericColored"],[64,224,208,"Turquoise"],[0,255,239,"TurquoiseBlue"],[160,214,180,"TurquoiseGreen"],[0,197,205,"TurquoiseSurf"],[124,72,72,"TuscanRed"],[192,153,153,"Tuscany"],[138,73,107,"TwilightLavender"],[38,167,222,"TwitterBlue"],[0,51,170,"UABlue"],[217,0,76,"UARed"],[186,0,1,"UERed"],[60,208,112,"UFOGreen"],[188,181,140,"UOWL"],[123,17,19,"UPMaroon"],[100,65,23,"UPSBrown"],[0,79,152,"USAFABlue"],[0,48,143,"USAFBlue"],[136,120,195,"Ube"],[83,104,149,"UclaBlue"],[255,179,0,"UclaGold"],[252,108,133,"UltraRed"],[93,140,174,"Ultramarine"],[65,102,245,"UltramarineBlue"],[99,81,71,"Umber"],[255,221,202,"UnbleachedSilk"],[120,94,73,"UndriedWall"],[91,146,229,"UnitedNationsBlue"],[183,135,39,"UniversityOfCaliforniaGold"],[247,127,0,"UniversityOfTennesseeOrange"],[174,32,41,"UpsdellRed"],[225,173,33,"Urobilin"],[211,0,63,"UtahCrimson"],[246,164,148,"Valspar"],[8,8,8,"VampireBlack"],[102,66,40,"VanDykeBrown"],[243,143,169,"VanillaIce"],[197,179,88,"VegasGold"],[34,70,52,"Velvet"],[200,8,21,"VenetianRed"],[67,179,174,"Verdigris"],[205,4,11,"VerizonRed"],[217,56,30,"Vermilion"],[24,136,13,"VerseGreen"],[116,187,251,"VeryLightAzure"],[102,102,255,"VeryLightBlue"],[100,233,134,"VeryLightMalachiteGreen"],[255,176,119,"VeryLightTangelo"],[255,223,191,"VeryPaleOrange"],[255,255,191,"VeryPaleYellow"],[109,43,80,"VineGrape"],[56,163,42,"VineGreen"],[118,110,200,"VioletBlue"],[150,61,127,"VioletCrayola"],[134,1,175,"VioletRYB"],[50,74,178,"Violetblue"],[137,20,70,"Violetred"],[247,83,148,"Violetred"],[131,102,244,"VioletsAreBlue"],[103,68,3,"ViolinBrown"],[0,150,152,"ViridianGreen"],[124,158,217,"VistaBlue"],[239,57,57,"VivaldiRed"],[146,39,36,"VividAuburn"],[159,29,53,"VividBurgundy"],[218,29,129,"VividCerise"],[0,170,238,"VividCerulean"],[204,0,51,"VividCrimson"],[255,153,0,"VividGamboge"],[166,214,8,"VividLimeGreen"],[0,204,51,"VividMalachite"],[184,12,227,"VividMulberry"],[255,95,0,"VividOrange"],[255,160,0,"VividOrangePeel"],[204,0,255,"VividOrchid"],[255,0,108,"VividRaspberry"],[247,13,26,"VividRed"],[223,97,36,"VividRedtangelo"],[0,204,255,"VividSkyBlue"],[240,116,39,"VividTangelo"],[255,160,137,"VividTangerine"],[229,96,36,"VividVermilion"],[159,0,255,"VividViolet"],[255,227,2,"VividYellow"],[191,192,238,"Vodka"],[206,255,0,"Volt"],[52,178,51,"WageningenGreen"],[159,116,98,"WalnutDyed"],[0,66,66,"WarmBlack"],[255,179,167,"WashedoutCrimson"],[236,130,84,"WashedoutPersimmon"],[212,241,249,"Water"],[181,108,96,"WaterPersimmon"],[238,255,27,"WatermelonYellow"],[164,244,249,"Waterspout"],[89,58,39,"WeatheredBamboo"],[31,142,237,"WeeblyBlue"],[255,154,0,"WeeblyOrange"],[124,152,171,"WeldonBlue"],[100,84,82,"Wenge"],[245,222,179,"Wheat"],[237,230,214,"WhiteChocolate"],[230,224,212,"WhiteCoffee"],[185,161,147,"WhiteMouse"],[206,159,111,"WhiteOak"],[196,142,105,"WhiteTeacolored"],[165,186,147,"WhitishGreen"],[162,173,208,"WildBlueYonder"],[212,112,162,"WildOrchid"],[255,67,164,"WildStrawberry"],[140,158,94,"WillowDye"],[129,123,105,"WillowGrey"],[156,138,77,"WillowTea"],[253,88,0,"WillpowerOrange"],[171,76,61,"WiltedBrown"],[167,85,2,"WindsorTan"],[177,18,38,"WineRed"],[255,0,124,"WinterSky"],[160,230,255,"WinterWizard"],[86,136,125,"WintergreenDream"],[201,160,220,"Wisteria"],[77,59,60,"WisteriaAndBurntBamboo"],[137,114,158,"WisteriaColor"],[135,95,154,"WisteriaPurple"],[169,169,169,"X11DarkGray"],[0,100,0,"X11DarkGreen"],[190,190,190,"X11Gray"],[176,48,96,"X11Maroon"],[160,32,240,"X11Purple"],[115,134,120,"Xanadu"],[14,122,13,"XboxGreen"],[253,73,0,"XiaomiOrange"],[255,164,0,"YGY"],[46,80,144,"YInMnBlue"],[15,77,146,"YaleBlue"],[28,40,65,"YankeesBlue"],[252,232,131,"YellowCrayola"],[239,204,0,"YellowMunsell"],[255,174,66,"YellowOrange"],[255,149,5,"YellowOrangeCW"],[254,223,0,"YellowPantone"],[254,254,51,"YellowRYB"],[255,240,0,"YellowRose"],[137,108,57,"YellowSeaPinebrown"],[154,205,50,"Yellowgreen"],[48,178,26,"YellowgreenCW"],[197,227,132,"YellowgreenCrayola"],[178,7,29,"YoutubeRed"],[0,20,168,"Zaffre"],[235,194,175,"Zinnwaldite"],[44,22,8,"ZinnwalditeBrown"],[57,167,142,"Zomp"],[240,248,255,"aliceblue"],[255,182,30,"amboge"],[250,235,215,"antiquewhite"],[127,255,212,"aquamarine"],[240,255,255,"azure"],[245,245,220,"beige"],[255,228,196,"bisque"],[255,235,205,"blanchedalmond"],[37,35,33,"blkChestnutOak"],[138,43,226,"blueviolet"],[153,102,0,"brnGambogeOrange"],[165,42,42,"brown"],[222,184,135,"burlywood"],[95,158,160,"cadetblue"],[183,112,45,"chYellowTea"],[127,255,0,"chartreuse"],[210,105,30,"chocolate"],[255,127,80,"coral"],[100,149,237,"cornflowerblue"],[255,248,220,"cornsilk"],[0,35,102,"darkRoyalBlue"],[0,0,139,"darkblue"],[0,139,139,"darkcyan"],[184,134,11,"darkgoldenrod"],[169,169,169,"darkgray"],[189,183,107,"darkkhaki"],[139,0,139,"darkmagenta"],[85,107,47,"darkolivegreen"],[255,140,0,"darkorange"],[153,50,204,"darkorchid"],[139,0,0,"darkred"],[233,150,122,"darksalmon"],[143,188,143,"darkseagreen"],[72,61,139,"darkslateblue"],[47,79,79,"darkslategray"],[0,206,209,"darkturquoise"],[148,0,211,"darkviolet"],[105,105,105,"dimgray"],[178,34,34,"firebrick (Fire Brick)"],[34,139,34,"forestgreen"],[220,220,220,"gainsboro"],[248,248,255,"ghostwhite"],[218,165,32,"goldenrod"],[173,255,47,"greenyellow"],[240,255,240,"honeydew"],[255,105,180,"hotpink"],[205,92,92,"indianred"],[240,230,140,"khaki"],[230,230,250,"lavender"],[255,240,245,"lavenderblush"],[124,252,0,"lawngreen"],[255,250,205,"lemonchiffon"],[65,105,225,"lightRoyalBlue"],[173,216,230,"lightblue"],[240,128,128,"lightcoral"],[224,255,255,"lightcyan"],[250,250,210,"lightgoldenrodyellow"],[211,211,211,"lightgray"],[144,238,144,"lightgreen"],[255,182,193,"lightpink"],[255,160,122,"lightsalmon"],[32,178,170,"lightseagreen"],[135,206,250,"lightskyblue"],[119,136,153,"lightslategray"],[176,196,222,"lightsteelblue"],[50,205,50,"limegreen"],[250,240,230,"linen"],[102,205,170,"mediumaquamarine"],[186,85,211,"mediumorchid"],[147,112,219,"mediumpurple"],[60,179,113,"mediumseagreen"],[123,104,238,"mediumslateblue"],[0,250,154,"mediumspringgreen"],[72,209,204,"mediumturquoise"],[199,21,133,"mediumvioletred"],[25,25,112,"midnightblue"],[245,255,250,"mintcream"],[255,228,181,"moccasin"],[253,245,230,"oldlace"],[107,142,35,"olivedrab"],[218,112,214,"orchid"],[238,232,170,"palegoldenrod"],[152,251,152,"palegreen"],[175,238,238,"paleturquoise"],[219,112,147,"palevioletred"],[255,239,213,"papayawhip"],[255,218,185,"peachpuff"],[205,133,63,"peru"],[221,160,221,"plum"],[176,224,230,"powderblue"],[188,143,143,"rosybrown"],[65,105,225,"royalblue"],[139,69,19,"saddlebrown"],[250,128,114,"salmon"],[244,164,96,"sandybrown"],[46,139,87,"seagreen"],[255,245,238,"seashell"],[160,82,45,"sienna"],[135,206,235,"skyblue"],[106,90,205,"slateblue"],[112,128,144,"slategray"],[255,250,250,"snow"],[0,255,127,"springgreen"],[70,130,180,"steelblue"],[216,191,216,"thistle"],[255,99,71,"tomato"],[64,224,208,"turquoise"],[238,130,238,"violet"],[245,222,179,"wheat"],[245,245,245,"whitesmoke"],[154,205,50,"yellowgreen"]];

  const __imageData = {
    "act":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS" +
    "0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHht" +
    "bG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYmxlLWJhY2" +
    "tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0YWRhdGE+" +
    "DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTc4LDEyOGMzMS43LTIwLjEsNTMuMi01OC44LDUzLjItMTAzLjNjMC01LTAuMy05LjktMC44LTE0LjhIMjUuNmMtMC41LDQuOC0wLjgsOS44LTAuOCwxNC44Yz" +
    "AsNDQuNCwyMS41LDgzLjEsNTMuMiwxMDMuM2MtMzEuOCwyMC4xLTUzLjMsNTguOC01My4zLDEwMy4zYzAsNSwwLjMsOS45LDAuOCwxNC43aDIwNC45YzAuNS00LjgsMC44LTkuOCwwLjgtMTQuN0MyMzEuMiwxODYuOCwy" +
    "MDkuNywxNDguMSwxNzgsMTI4eiBNNDYuOSwyMzEuM2MwLTQzLjEsMTguNS03OS42LDUxLjYtOTEuNnYtMjMuMmwwLDBjLTMzLjItMTIuMS01MS42LTQ4LjYtNTEuNi05MS42bDAsMGgxNjIuMmwwLDBjMCw0My4xLTE4Lj" +
    "UsNzkuNi01MS42LDkxLjZ2MjMuMmMzMy4yLDEyLjEsNTEuNiw0OC42LDUxLjYsOTEuNkg0Ni45TDQ2LjksMjMxLjN6IE0xNTIuOCwxNjQuM2MtMTYuNS05LjQtMTcuNC0yMS41LTE3LjQtMjguOXYtMTQuOGMwLTcuNCww" +
    "LjktMTkuNiwxNy41LTI5YzguOS01LjIsMTYuNS0xMywyMi40LTIyLjdIODAuOGM1LjgsOS43LDEzLjUsMTcuNSwyMi40LDIyLjdjMTYuNSw5LjQsMTcuNCwyMS41LDE3LjQsMjguOXYxNC44YzAsNy40LTAuOSwxOS42LT" +
    "E3LjUsMjljLTE2LjcsOS43LTI5LjIsMjktMzMsNTIuMmgxMTUuNkMxODIsMTkzLjMsMTY5LjYsMTc0LjEsMTUyLjgsMTY0LjN6Ii8+PC9nPjwvZz4NCjwvc3ZnPg==",

    "fullprio":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzA" +
    "AAOxAAADsQBlSsOGwAAAAd0SU1FB+cLFAMwByxabUoAAAFsSURBVEjHzZS/S4JBHMY/5/uaKeSUJYJjNCQ0SNQS0drcFDRZg7OQSxAVhA01BFEOjdGWBP4BbU1B0ODwDg0NIfQDJIzA3rchzfd9u3t7NSqfW+6eu+e574/" +
    "joI00E/wIGxjMdCoStnmCA1JkOLdxSSYJYym0VS6Eg4pTdFgkOWaUuvLyCGXhIocokmK5aTHPPotUCEgN3siwqhMn5CAL7HHUjCJMnQq3ygIYaDplBh05mgwQo8Acj1iguP0DAdDZJPppIDDpY4kop9SaJbY8DCzQOXORO" +
    "UZYY5cGYKITcvXKLg+7t3Ry5NlmhwYAaUrccKcwgHFeNA85VDFIEFS28ZJ1O5HliTy65KBquLBAViLveQjP3SDDaBL+gefW1DvnKYpEvjwljUO2/EUQY5aQy0AAV1z/Y9V6Dp0X0amueRtMS9toN7jv7iG18fpXpfpFiK5" +
    "OWH4NxlihX2JZ4qS1+O4HMqVN9B2BjxTeAblBT+XteTe0AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTExLTIwVDAzOjQ4OjAwKzAwOjAwTZm/0wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0xMS0yMFQwMzo0ODowMCswM" +
    "DowMDzEB28AAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMTEtMjBUMDM6NDg6MDcrMDA6MDCudhg+AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==",

    "trashcan":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA1AAAANQBhp5IhgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlL" +
    "m9yZ5vuPBoAAAHnSURBVFiF7ZfLS1ZRFMV/y0ICo0RUPpGgh05EtMhJgzRnDSIaiaPAQRCN/QvEv0EQJwpR4xw2kQbiqIFCIDjxFWmUfSMJKbaDc5Tr8T7O93GjyV2wB3efxbprn8e9Z2NmxATQA8wCB4BlxDdgBqjF6sq" +
    "LF0LSMvAYeAd8z6DVgEngk5m9iBKOrP428BeYiuC+Av4AvTHaVzOqbQU6EqknQAuwK6lWUNNX4AowKmklkT8ys5PcGQBuAPPAEdnr3Gz8BOaAtrwZmAZeeuJWQaWNoh94g9vEM+fZYAb2gKXYHdxoAO+B3WSuJXD5BXgoq" +
    "bvk6vGaw8D6hXzyGEp6hjtm13D7oEx0AMfAhJl9TDXgTdwFPuPO+grlYNwbGDGznQsjGWu1DSyWuPaLwGbaWLgHciFpIHjuktSVxylCtAFJfcCGpPFEesHHGecpsC7pVqxu6pcwA9dxX7ibiVx7wGn3mm2xog0twb9AZaA" +
    "yUBmoDFQG/ruBRn5GP4A6sJ/IbQecPdxN6lfpBsxsX9IdM6sn0q8DzqqkewGnKQMHuAtkaKIePP8u4ng88JqXkLUH1oD7kh5ljEdD0hgw5DUvj6c1p5I6cVf0TuADsNHk+4eB57iueTB1dnIukr24RuKQ5tuxQ+AtOe36K" +
    "W1qBFIUrfaeAAAAAElFTkSuQmCC",

    "idleImage":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2lj" +
    "b24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLj" +
    "EiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYmxl" +
    "LWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0YW" +
    "RhdGE+DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTI4LDIzMS4zTDEyOCwyMzEuM2M1NywwLDEwMy4zLTQ2LjIsMTAzLjMtMTAzLjNDMjMxLjMsNzEsMTg1LDI0LjcsMTI4LDI0LjdTMjQuOCw3MSwyNC44" +
    "LDEyOEMyNC44LDE4NSw3MSwyMzEuMywxMjgsMjMxLjNMMTI4LDIzMS4zeiBNMTI4LDI0NkwxMjgsMjQ2Yy02NS4yLDAtMTE4LTUyLjgtMTE4LTExOEMxMCw2Mi44LDYyLjgsMTAsMTI4LDEwYzY1LjIsMCwxMTgsNTIuOC" +
    "wxMTgsMTE4QzI0NiwxOTMuMiwxOTMuMiwyNDYsMTI4LDI0NkwxMjgsMjQ2eiIvPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0xMzQuOSwxMjQuM1Y3Mi43YzAtNC0zLjMtNy4zLTcuNC03LjNjLTQuMSwwLTcuNCwzLjMt" +
    "Ny40LDcuM3Y1OS4xYzAsMiwwLjgsMy44LDIuMSw1LjJjMS4zLDEuNCwzLjIsMi4yLDUuMiwyLjJoNDQuM2M0LDAsNy4zLTMuMyw3LjMtNy40YzAtNC4xLTMuMy03LjQtNy4zLTcuNEwxMzQuOSwxMjQuM0wxMzQuOSwxMj" +
    "QuM3oiLz48L2c+PC9nPg0KPC9zdmc+",

    "configWheel":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2" +
    "ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIx" +
    "LjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYm" +
    "xlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0" +
    "YWRhdGE+DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTI4LDgwLjhjLTI2LDAtNDcuMiwyMS4yLTQ3LjIsNDcuMmMwLDI2LDIxLjIsNDcuMiw0Ny4yLDQ3LjJjMjYsMCw0Ny4yLTIxLjIsNDcuMi00Ny4yQz" +
    "E3NS4yLDEwMiwxNTQsODAuOCwxMjgsODAuOEwxMjgsODAuOHogTTEyOCwxNjMuNGMtMTkuNiwwLTM1LjQtMTUuOC0zNS40LTM1LjRjMC0xOS42LDE1LjgtMzUuNCwzNS40LTM1LjRjMTkuNiwwLDM1LjQsMTUuOCwzNS40" +
    "LDM1LjRDMTYzLjQsMTQ3LjYsMTQ3LjYsMTYzLjQsMTI4LDE2My40TDEyOCwxNjMuNHogTTI0NiwxNTEuNnYtNDcuMmwtMzQuMi01LjdjLTAuOS0zLjItMi4yLTYuNC0zLjktOS4zbDIwLjMtMjguMmwtMzMuNC0zMy40bC" +
    "0yOC4yLDIwLjNjLTMtMS43LTYuMS0yLjktOS4zLTMuOUwxNTEuNiwxMGgtNDcuMmwtNS43LDM0LjJjLTMuMywwLjktNi40LDIuNC05LjQsMy45bC0yOC0xOS45TDI3LjksNjEuNGwyMC4xLDI4Yy0xLjUsMy0yLjgsNi4x" +
    "LTMuOCw5LjNMMTAsMTA0LjR2NDcuMmwzNC4yLDUuN2MxLjEsMy4zLDIuNCw2LjYsNCw5LjdsLTIwLjEsMjhsMzMuNCwzMy40bDI4LjEtMjAuMmMzLDEuNCw1LjksMi43LDkuMSwzLjdsNS43LDM0LjJoNDcuMmw1LjctMz" +
    "QuMmMzLjMtMS4xLDYuNS0yLjQsOS42LTRsMjguMiwyMC4zbDMzLjQtMzMuNGwtMjAuMy0yOC4zYzEuNC0zLDIuNy01LjksMy43LTkuMUwyNDYsMTUxLjZMMjQ2LDE1MS42eiBNMjAwLjUsMTUzLjljLTAuOCwyLjYtMS45" +
    "LDUtMyw3LjNjLTEuOSwzLjktMS41LDguNSwxLjEsMTJsMTQuNSwyMC4ybC0xOS4yLDE5LjJsLTIwLjEtMTQuNGMtMi0xLjUtNC41LTIuMi02LjktMi4yYy0xLjksMC0zLjksMC41LTUuNiwxLjRjLTIuMywxLjItNC43LD" +
    "IuMy03LjYsMy4yYy00LjIsMS4zLTcuMyw0LjktOCw5LjNsLTQuMSwyNC4zaC0yNy4ybC00LTI0LjNjLTAuNy00LjUtNC04LjEtOC4zLTkuNGMtMi42LTAuNy01LTEuOS03LjMtM2MtMS42LTAuOC0zLjQtMS4yLTUuMS0x" +
    "LjJjLTIuNCwwLTQuOCwwLjctNi45LDIuMmwtMjAsMTQuM2wtMTkuMi0xOS4ybDE0LjItMTkuOGMyLjYtMy43LDIuOS04LjUsMC44LTEyLjVjLTEuMi0yLjItMi4yLTQuNy0zLjItNy43Yy0xLjMtNC4yLTQuOS03LjMtOS" +
    "4zLThsLTI0LjMtNHYtMjcuMmwyNC4zLTRjNC41LTAuNyw4LjEtNCw5LjQtOC4zYzAuNy0yLjQsMS43LTQuOSwyLjktNy4yYzItMy45LDEuNy04LjctMC45LTEyLjNMNDMuNCw2Mi43bDE5LjItMTkuMWwxOS44LDE0LjFj" +
    "MiwxLjQsNC40LDIuMiw2LjksMi4yYzEuOCwwLDMuNi0wLjQsNS4zLTEuM2MyLjQtMS4yLDQuOS0yLjQsNy40LTMuMWM0LjQtMS4zLDcuNi00LjksOC40LTkuNGw0LTI0LjNoMjcuMmw0LDI0LjNjMC43LDQuNSw0LDguMS" +
    "w4LjMsOS40YzIuNSwwLjcsNC44LDEuNyw2LjksMi45YzEuOCwxLDMuOCwxLjUsNS44LDEuNWMyLjQsMCw0LjgtMC43LDYuOS0yLjJsMjAuMS0xNC40bDE5LjIsMTkuMmwtMTQuNCwyMC4xYy0yLjcsMy43LTMsOC42LTAu" +
    "NywxMi43YzEuMiwyLDIuMSw0LjQsMi45LDYuOWMxLjMsNC4zLDQuOSw3LjUsOS40LDguM2wyNC4zLDR2MjcuMmwtMjQuMyw0QzIwNS40LDE0Ni40LDIwMS44LDE0OS42LDIwMC41LDE1My45TDIwMC41LDE1My45eiIvPj" +
    "wvZz48L2c+DQo8L3N2Zz4=",

    "failedImage":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2" +
    "ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIx" +
    "LjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYm" +
    "xlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0" +
    "YWRhdGE+DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTI4LDEwQzYyLjgsMTAsMTAsNjIuOCwxMCwxMjhjMCw2NS4yLDUyLjgsMTE4LDExOCwxMThjNjUuMiwwLDExOC01Mi44LDExOC0xMThDMjQ2LDYyLj" +
    "gsMTkzLjIsMTAsMTI4LDEweiBNMTI4LDQ0LjljOC4yLDAsMTQuOCw2LjYsMTQuOCwxNC44bC01LjMsOTguMmgtMC4xYy0wLjYsNC43LTQuNiw4LjQtOS40LDguNHMtOC45LTMuNy05LjQtOC40aDBsMC0wLjZjMC0wLjIs" +
    "MC0wLjQsMC0wLjZjMCwwLDAtMC4xLDAtMC4ybC01LjMtOTYuOUMxMTMuMiw1MS41LDExOS44LDQ0LjksMTI4LDQ0Ljl6IE0xMjgsMjExLjFjLTguMiwwLTE0LjktNi43LTE0LjktMTQuOXM2LjYtMTQuOSwxNC45LTE0Lj" +
    "ljOC4yLDAsMTQuOSw2LjcsMTQuOSwxNC45UzEzNi4yLDIxMS4xLDEyOCwyMTEuMXoiLz48L2c+PC9nPg0KPC9zdmc+",

    "ignoreHunger":"data:image/png;base64,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",

    "successImage":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2" +
    "ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxL" +
    "jEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYmxl" +
    "LWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0YWR" +
    "hdGE+DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMjE3LjcsMTE4Yy00LjYsMC04LjUsNC04LjUsOC41djEwMi40bDAsMEgyOS4zYy0wLjYsMC0xLjctMC42LTIuMy0xLjFWNDcuNGMwLjYtMC42LDEuNy0wLj" +
    "YsMi44LTAuNmg5OS42YzQuNiwwLDguNS00LDguNS04LjVjMC00LjYtNC04LjUtOC41LTguNUgyOS45Yy05LjcsMC0xOS45LDUuMS0xOS45LDE1LjN2MTgzLjhjMCw5LjcsMTAuOCwxNy4xLDE5LjMsMTcuMWgxODMuMmMzL" +
    "jQsMCwxMy43LTEuMSwxMy43LTE3LjFWMTI2LjVDMjI2LjIsMTIxLjksMjIyLjIsMTE4LDIxNy43LDExOHoiLz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMjQyLjcsMTEuNmMtNC0yLjgtOS4xLTEuNy0xMS45LDIuM0wx" +
    "MjguOSwxNTcuOGwtNDMuMi01Ni45Yy0yLjgtNC04LTQuNi0xMS45LTEuN2MtNCwyLjgtNC42LDgtMS43LDExLjlsNTAuNiw2NmwwLDBjMCwwLjYsMC42LDAuNiwwLjYsMS4xbDAuNiwwLjZsMCwwYzAsMCwwLDAsMC42LDB" +
    "jMC42LDAuNiwxLjEsMC42LDEuNywwLjZoMC42YzAuNiwwLDEuNywwLjYsMi4zLDAuNmwwLDBsMCwwbDAsMGwwLDBjMC42LDAsMS43LDAsMi4zLTAuNmgwLjZjMC42LDAsMS4xLTAuNiwxLjctMS4xYzAsMCwwLDAsMC42LD" +
    "BsMCwwbDAuNi0wLjZjMC42LDAsMC42LDAsMS4xLTAuNmwwLDBMMjQ0LjQsMjMuNUMyNDcuMiwxOS42LDI0Ni4xLDE0LjQsMjQyLjcsMTEuNnoiLz48L2c+PC9nPg0KPC9zdmc+",
  };

  /* ENDREGION */

  /* REGION "Prototypes" */
  Date.prototype.quickDate = function() {
    let day = this.getDate();
    let month = this.getMonth() + 1;
    return `${(day>9)?day:`0${day}`}.${(month>9)?month:`0${month}`}.${this.getFullYear()}`;
  };
  RegExp.prototype.execOnce = function (str) {
    const result = this.exec(str);
    this.lastIndex = 0;
    return result;
  };
  RegExp.prototype.reset = function () {
    this.lastIndex = 0;
  };
  HTMLElement.prototype.toTop = function () {
    var parent = this.parentNode;
    if (parent.firstChild !== this) {
      parent.insertBefore(this, parent.firstChild);
    }
  };
  HTMLElement.prototype.clear = function () {
    let child = this.lastElementChild;
    while (child) {
      this.removeChild(child);
      child = this.lastElementChild;
    }
  };
  HTMLElement.prototype.to = function (target) {
    target.appendChild(this);
    return this;
  };
  HTMLElement.prototype.in = function (target) {
    this.appendChild(target);
    return this;
  };
  HTMLElement.prototype.addCat = function (clickable = false, clickevent = null) {
    if(clickable === true) {
      let cat = main.tools.createElement(`div`, `catbox clickableStyled`);
      cat.addEventListener(`click`, clickevent, true);
      this.in(cat);
      return cat;
    } else {
      let cat = main.tools.createElement(`div`, `catbox ${clickable}`, clickevent);
      this.in(cat);
      return cat;
    }
  };
  HTMLElement.prototype.inner = function (v) {
    if(typeof v !== `undefined`) {
      this.childNodes[0].data = v;
    }
    return(this.childNodes[0].data);
  };
  HTMLElement.prototype.css = function (data) {
    for(let n in data) this.style[n] = data[n];
    return this;
  }
  String.prototype.conv = function() {
      return this;
  };
  String.prototype.toText = function() {
    return this.replace(/<[^>]*>/g, '');
  };
  String.prototype.toTimestamp = function() {
    const utcTimeString = this.replace('CET', '+01:00');
    const date = new Date(utcTimeString);
    return date.getTime();
  }
  String.prototype.cvr = function(pad = 3) {
    const hoch = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '=': '⁼' };
    const tief = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌' };
    const map = this.charAt(0) === '-' ? hoch : tief;
    let result = Array.from(this).map(char => map[char] || char).join('');
    if (this.charAt(0) !== '-') {
      result = '₊' + result;
    }
    let r_0 = result[0];
    let r_1 = result.substr(1);
    r_1 = r_1.padStart(pad, map[`0`]);
    return `${r_0}${r_1}`;
  };
  /* ENDREGION */
  /* REGION "Brain & Debug" */
  class ShorttimeCache {
    static cache = {};
    static validityDuration = 5000;
    static cleanup() {
      const now = Date.now();
      for (const url in ShorttimeCache.cache) {
        if (now - ShorttimeCache.cache[url].timestamp > ShorttimeCache.validityDuration) {
          delete ShorttimeCache.cache[url];
        }
      }
    }
    static check(url) {
      ShorttimeCache.cleanup();
      return url in ShorttimeCache.cache;
    }
    static write(url, content) {
      ShorttimeCache.cleanup();
      ShorttimeCache.cache[url] = { content: content, timestamp: Date.now() };
    }
    static read(url) {
      ShorttimeCache.cleanup();
      if (url in ShorttimeCache.cache) {
        return ShorttimeCache.cache[url].content;
      }
      return ''; // Rückgabe eines leeren Strings, falls der Eintrag nicht existiert oder abgelaufen ist
    }
  }
  class Brain {
    static read (name, defaultValue = ``) {
      return GM_getValue(name, defaultValue);
    }
    static write (name, value) {
      if(typeof value !== `undefined`) {
        GM_setValue(name, value);
      } else {
        GM_deleteValue(name);
      }
    }
  }
  const BetterBrain = new Proxy({},
    {
      get(target, property) {
        return GM_getValue(property, "");
      },
      set(target, property, value) {
        if (typeof value !== 'undefined') {
          GM_setValue(property, value);
        } else {
          GM_deleteValue(property);
        }
        return true;
      }
    }
  );
  const DEBUG = (BetterBrain.debugUserSetting?true:false) || false;
  var logging_LOG = (BetterBrain.loggingLOG || false);
  var logging_INF = (BetterBrain.loggingINF || false);
  var logging_DEB = (BetterBrain.loggingDEB || false);
  var logging_ERR = (BetterBrain.loggingERR || false);
  function logs() {
    if(logging_LOG) console.log(`OviBot v${GM_info.script.version} > LOG > `, ...arguments);
  };
  function infos() {
    if(logging_INF) console.info(`OviBot v${GM_info.script.version} > INF > `, ...arguments);
  }
  function debugs() {
    if(logging_DEB) console.debug(`OviBot v${GM_info.script.version} > DEB > `, ...arguments);
  }
  function errors() {
    if(logging_ERR) console.error(`OviBot v${GM_info.script.version} > BUG > `, ...arguments);
  }
  /* ENDREGION */
  /* REGION "Internal Classes" */
  class CustomFormData {
    constructor(data = {}) {
      this.data = data;
    }
    append(key, value) {
      if (!this.data[key]) {
        this.data[key] = [];
      }
      if (Array.isArray(value)) {
        this.data[key] = this.data[key].concat(value);
      } else {
        this.data[key].push(value);
      }
    }
    toString() {
      const encodedData = [];
      for (const key in this.data) {
        if (Object.prototype.hasOwnProperty.call(this.data, key)) {
          const value = this.data[key];
          if(value.length > 1) {
            value.forEach(item => {
              encodedData.push(`${encodeURIComponent(`${key}[]`)}=${encodeURIComponent(item)}`);
            });
          } else {
            encodedData.push(`${encodeURIComponent(key)}=${encodeURIComponent(value[0])}`);
          }
        }
      }
      return encodedData.join('&');
    }
  }
  class Clr {
    constructor(r, g, b, n = ``) {
      this.compare = this.__compare.bind(this);
      if(typeof r == `string` && typeof g == `undefined`) {
        let t = r.replace(/#/gi, ``);
        r = parseInt(t.substr(0, 2), 16);
        g = parseInt(t.substr(2, 2), 16);
        b = parseInt(t.substr(4, 2), 16);
      }
      this.r = parseInt(r);
      this.g = parseInt(g);
      this.b = parseInt(b);
      this.name = n;
      this.toHex = Clr.toHex.bind(this);
      this.distance = Clr.distance.bind(this);
      this.torgb = this.__torgb.bind(this);
      this.compare = this.__compare.bind(this);
      this.toHexString = this.__toHexString.bind(this);
      this.toFormattedString = this.__toFormattedString.bind(this);
    }
    static distance() {
      let initialColor = this;
      let targetColor = arguments[0];
      let delimiter = (typeof arguments[1] != `undefined`)?arguments[1]:`/`;
      if(!(this instanceof Clr)) {
        initialColor = arguments[0];
        targetColor = arguments[1];
        delimiter = (typeof arguments[2] != `undefined`)?arguments[2]:`/`;
      }
      if(!(targetColor instanceof Clr)) {
        targetColor = new Clr(targetColor);
      }
      if(!(initialColor instanceof Clr)) {
        initialColor = new Clr(initialColor);
      }
      let rd = targetColor.r - initialColor.r;
      let gd = targetColor.g - initialColor.g;
      let bd = targetColor.b - initialColor.b;
      let result = {
        offsets: {
          red: rd,
          green: gd,
          blue: bd
        },
        colors: {
          source: {
            red: initialColor.r,
            green: initialColor.g,
            blue: initialColor.b,
            hex: initialColor.toHexString()
          },
          target: {
            red: targetColor.r,
            green: targetColor.g,
            blue: targetColor.b,
            hex: targetColor.toHexString()
          }
        },
        offset: (Math.abs(rd) + Math.abs(gd) + Math.abs(bd)) / 3,
        str: ``
      };
      let rds = (rd==0)?`---`:((rd>0)?`+${Clr.toHex(Math.abs(rd))}`:`-${Clr.toHex(Math.abs(rd))}`);
      let gds = (gd==0)?`---`:((gd>0)?`+${Clr.toHex(Math.abs(gd))}`:`-${Clr.toHex(Math.abs(gd))}`);
      let bds = (bd==0)?`---`:((bd>0)?`+${Clr.toHex(Math.abs(bd))}`:`-${Clr.toHex(Math.abs(bd))}`);
      result.long = `${rds}${delimiter}${gds}${delimiter}${bds}`;
      rds = ``;gds = ``;bds = ``;
      const tt = (vl) => {
        let r_s = vl.toString();
        if(vl < 10 && vl > 0) {
          r_s = r_s.replace(`1`, `¹`);
          r_s = r_s.replace(`2`, `²`);
          r_s = r_s.replace(`3`, `³`);
          r_s = r_s.replace(`4`, `⁴`);
          r_s = r_s.replace(`5`, `⁵`);
          r_s = r_s.replace(`6`, `⁶`);
          r_s = r_s.replace(`7`, `⁷`);
          r_s = r_s.replace(`8`, `⁸`);
          r_s = r_s.replace(`9`, `⁹`);
        } else if(vl > -10 && vl < 0) {
          r_s = r_s.replace(`-1`, `₁`);
          r_s = r_s.replace(`-2`, `₂`);
          r_s = r_s.replace(`-3`, `₃`);
          r_s = r_s.replace(`-4`, `₄`);
          r_s = r_s.replace(`-5`, `₅`);
          r_s = r_s.replace(`-6`, `₆`);
          r_s = r_s.replace(`-7`, `₇`);
          r_s = r_s.replace(`-8`, `₈`);
          r_s = r_s.replace(`-9`, `₉`);
        } else if(vl != 0) {
          r_s = (vl>0)?`⁺`:`₋`;
        } else {
          r_s = `‧`;
        }
        return r_s;
      };
      rds = tt(rd);
      gds = tt(gd);
      bds = tt(bd);
      result.short = `${Clr.toHex(Math.abs(initialColor.r))}${rds}${delimiter}${Clr.toHex(Math.abs(initialColor.g))}${gds}${delimiter}${Clr.toHex(Math.abs(initialColor.b))}${bds}`;
      return result;
    }
    __torgb() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    __compare(color2) {
      let col2 = color2;
      if(col2 instanceof Array) {
        let result = [];
        let count = 0;
        for(let i = 0;i < col2.length;i++) {
          let curCol = col2[i];
          if(!(curCol instanceof Clr)) curCol = new Clr(curCol);
          let rsl = this.compare();
          count += (rsl)?1:0;
          result.push({
            color: curCol,
            result: rsl
          })
        }
        return {count: count, entries: result};
      }
      if(!(col2 instanceof Clr)) col2 = new Clr(col2);
      return (col2.toHexString() === this.toHexString());
    }
    static toHex(value) {
      const hex = parseInt(value).toString(16).toUpperCase();
      return (hex.toString().length === 1)?(`0`+hex.toString()):hex.toString();
    }
    __toHexString() {
      return `#${this.toHex(this.r)}${this.toHex(this.g)}${this.toHex(this.b)}`;
    }
    __toFormattedString(format) {
      format = format || Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
      let r = this.r;
      let g = this.g;
      let b = this.b;
      let RR = this.toHex(this.r);
      let GG = this.toHex(this.g);
      let BB = this.toHex(this.b);
      let Hex = this.toHexString();
      return eval(`\`${format}\``);
    }
  }
  class Clock {
    constructor () {
      this.callbacks = [];
      this.currentStamp = 0;
      this.iter = this.__iter.bind(this);
      this.add = this.__add.bind(this);
      window.requestAnimationFrame((timeStamp) => {this.iter(timeStamp);});
    }
    get timestamp() {
      return this.currentStamp;
    }
    __iter (timeStamp) {
      this.currentStamp = timeStamp;
      for (let i = this.callbacks.length - 1; i >= 0; i--) {
        const entry = this.callbacks[i];
        if (entry.timeout <= this.currentStamp) {
          entry.handle(...entry.loadout);
          this.callbacks.splice(i, 1);
        }
      }
      window.requestAnimationFrame(this.iter);
    }
    __remove (name) {
      this.callbacks = this.callbacks.filter(entry => entry.name !== name);
    }
    __add (name, callback, duration, loadout, context) {
      this.callbacks.push({
        name: name,
        handle: callback.bind(context || this),
        timeout: this.currentStamp + duration,
        loadout: loadout || []
      });
    }
  }
  class Connection {
    static async GET(targetUrl, skipCache = false) {
      if(!skipCache && ShorttimeCache.check(targetUrl)) {
        let response = ShorttimeCache.read(targetUrl);
        debugs(`[Connection.GET] > CACHED`, {
          result: true,
          url: targetUrl,
          method: `GET`,
          data: ``,
          answer: response,
          error: ``,
        });
        return response;
      }
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: targetUrl,
          method: `GET`,
          ignoreCache: true,
          onload: (response) => {
            debugs(`[Connection.GET] > LOADED`, {
              result: true,
              url: targetUrl,
              method: `GET`,
              data: ``,
              answer: response,
              error: ``,
            });
            ShorttimeCache.write(targetUrl, response);
            resolve(response);
          },
          onerror: (error) => {
            debugs(`[Connection.GET] > `, {
              result: false,
              url: targetUrl,
              method: `GET`,
              data: ``,
              answer: ``,
              error: error,
            });
            reject(error);
          }
        });
      });
    }
    static async GETbinary(targetUrl, skipCache = false) {
      if(!skipCache && ShorttimeCache.check(targetUrl)) {
        let response = ShorttimeCache.read(targetUrl);
        debugs(`[Connection.GET] > CACHED`, {
          result: true,
          url: targetUrl,
          method: `GET`,
          data: ``,
          answer: response,
          error: ``,
        });
        return response;
      }
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: targetUrl,
          method: `GET`,
          ignoreCache: true,
          responseType: 'arraybuffer',
          onload: (response) => {
            debugs(`[Connection.GET] > LOADED`, {
              result: true,
              url: targetUrl,
              method: `GET`,
              data: ``,
              answer: response,
              error: ``,
            });
            ShorttimeCache.write(targetUrl, response);
            resolve(response);
          },
          onerror: (error) => {
            debugs(`[Connection.GET] > `, {
              result: false,
              url: targetUrl,
              method: `GET`,
              data: ``,
              answer: ``,
              error: error,
            });
            reject(error);
          }
        });
      });
    }
    static async POST(postData) {
      return new Promise((resolve, reject) => {
        const formDataHolder = new CustomFormData();
        for(var postName in postData) {
          formDataHolder.append(postName, postData[postName]);
        }
        try {
          let targetUrl = `https://ovipets.com/cmd.php?${main.config.crack.substring(1)}`;
          GM_xmlhttpRequest({
            url: targetUrl,
            data: formDataHolder.toString(),
            method: `POST`,
            ignoreCache: true,
            headers: {
              "Content-Type": `application/x-www-form-urlencoded`
            },
            onload: (response) => {
              debugs(`[Connection.POST] > `, {
                result: true,
                url: `https://ovipets.com/cmd.php?${main.config.crack.substring(1)}`,
                method: `POST`,
                data: formDataHolder.toString(),
                answer: response,
                error: ``,
              });
              try {
                let rsp = response.responseText;
                try {
                  let rspDebug = rsp.substr(rsp.indexOf(`(`) + 1);
                  rspDebug = rspDebug.substr(0, rspDebug.length - 1);
                  if(rspDebug != ``) {
                    let result = JSON.parse(rspDebug);
                    if(result.status !== `success`) logs(`[Connection.POST] > `, `Failed because of: ${result.message}`);
                    resolve(result.status == `success`);
                  }
                } catch (exc) {
                }
                resolve(false);
              } catch (exc) {
                resolve(false);
              }
            },
            onerror: (error) => {
              debugs(`[Connection.POST] > `, {
                result: false,
                url: targetUrl,
                method: `GET`,
                data: ``,
                answer: ``,
                error: error,
              });
              reject(error);
            }
          });
        } catch(e) {
        }
      });
    }
    static async POSTArray(postDataArray) {
      let out = ``;
      for(var i = 0;i < postDataArray.length;i++) {
        let postEntry = postDataArray[i];
        out += `${(out!=``)?`&`:``}${postEntry.name}=${postEntry.value}`;
      }
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: `https://ovipets.com/cmd.php?${main.config.crack.substring(1)}`,
          data: out,
          method: `POST`,
          ignoreCache: true,
          headers: {
            "Content-Type": `application/x-www-form-urlencoded`
          },
          onload: (response) => {
            debugs(`[Connection.POSTArray] > `, {
              result: true,
              url: `https://ovipets.com/cmd.php?${main.config.crack.substring(1)}`,
              method: `POST`,
              data: out,
              answer: response,
              error: ``,
            });
            try {
              if (response.responseText.indexOf(`success`) > -1) {
                resolve(true);
              } else {
                resolve(false);
              }
            } catch {
              resolve(false);
            }
          },
          onerror: (error) => {
            debugs(`[Connection.POSTArray] > `, {
              result: false,
              url: targetUrl,
              method: `GET`,
              data: ``,
              answer: ``,
              error: error,
            });
            reject(error);
          }
        });
      });
    }
    static async POSTFile(base64Image, filename, filetype, postDataArray, uploadFileEntryName = "Image") {
      return new Promise((resolve, reject) => {
        const boundary = `---------------------------102710908511985237864005607052`;

        const base64ToBinary = (base64Data) => {
          const byteString = atob(base64Data.split(',')[1]);
          let binaryData = '';
          for (let i = 0; i < byteString.length; i++) {
            binaryData += String.fromCharCode(byteString.charCodeAt(i));
          }
          return binaryData;
        };
        const fileBinary = base64ToBinary(base64Image);

        let data = '';

        for(var i = 0;i < postDataArray.length;i++) {
          let postEntry = postDataArray[i];
          data += '--' + boundary + '\r\n';
          data += `Content-Disposition: form-data; name="${postEntry.name}"\r\n\r\n${postEntry.value}\r\n`;
        }
        data += '--' + boundary + '\r\n';
        data += `Content-Disposition: form-data; name="${uploadFileEntryName}"; filename="${filename}"\r\n`;
        data += `Content-Type: ${filetype}\r\n\r\n`;
        data += fileBinary + '\r\n';
        data += '--' + boundary + '--\r\n';

        GM_xmlhttpRequest({
          method: 'POST',
          url: `https://ovipets.com/cmd.php?${main.config.crack.substring(1)}`,
          ignoreCache: true,
          headers: {
            'Content-Type': 'multipart/form-data; boundary=' + boundary,
          },
          data: data,
          binary: true,
          onload: function(response) {
            resolve(response.responseText.indexOf(`status":"success`) > -1);
          },
          onerror: function(response) {
            resolve(false);
          }
        });
      });
    }
  }

  class BunchLoader {
    constructor(items, callbackItem, callbackDone, callbackProgress = ()=>{}) {
      this.items = items;
      this.iterator = callbackItem.bind(this);
      this.done = callbackDone.bind(this);
      this.progress = callbackProgress.bind(this);
      this.threads = Math.min(5, items.length);
      this.__currentTreads = 0;
      this.collect = this.__collect.bind(this);
      this.work = this.__work.bind(this);
      this.result = null;
      this.__doneSteps = 0;
      this.__maxSteps = items.length;

    }
    __collect() {
      while(this.__currentTreads < Math.max(Math.min(this.threads, this.items.length))) {
        this.__currentTreads++;
        let binded = this.work.bind(this);
        binded(this.__currentTreads);
      }
    }
    async __work (__thread_id__) {
      if(this.items.length > 0) {
        let binded = this.iterator.bind(this);
        await binded(this.items.pop());
        this.__doneSteps++;
        await this.progress(this.__doneSteps, this.__maxSteps);
        await this.work(__thread_id__);
      } else {
        this.__currentTreads -= 1;
        if(this.__currentTreads == 0) {
          this.done(this.result);
        }
      }
    }
  }
  class NamerCoder {
    static async Parse(pet, code, forceLoad = false) {
      code = code.toString().replace(/Augen\.1/gi,    `Augen[1]`   ).replace(/Augen\.2/gi,    `Augen[2]`   );
      code = code.toString().replace(/Körper\.1/gi,   `Körper[1]`  ).replace(/Körper\.2/gi,   `Körper[2]`  );
      code = code.toString().replace(/Extras\.1/gi,   `Extras[1]`  ).replace(/Extras\.2/gi,   `Extras[2]`  );
      code = code.toString().replace(/Federn\.1/gi,   `Federn[1]`  ).replace(/Federn\.2/gi,   `Federn[2]`  );
      code = code.toString().replace(/Schuppen\.1/gi, `Schuppen[1]`).replace(/Schuppen\.2/gi, `Schuppen[2]`);
      code = code.toString().replace(/Flossen\.1/gi,  `Flossen[1]` ).replace(/Flossen\.2/gi,  `Flossen[2]` );

      pet = (pet instanceof Pet)?pet:new Pet(pet.id);

      let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
      if(forceLoad) {
        await pet.load();
      }

      let ____cl = (typeof main.config.colorLinks[pet.species] != `undefined`)?main.config.colorLinks[pet.species]:main.config.defaults.colorLink;
      if(pet.debug) ____cl = {
          normal: (colors) => {
            let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
            return {
              "Augen": {"1": pet.colors[0].toFormattedString(colorRule), "2": pet.colors[1].toFormattedString(colorRule)},
              "Körper": {"1": pet.colors[2].toFormattedString(colorRule), "2": pet.colors[3].toFormattedString(colorRule)},
              "Extras": {"1": pet.colors[4].toFormattedString(colorRule), "2": pet.colors[5].toFormattedString(colorRule)},
              "Federn": {"1": pet.colors[6].toFormattedString(colorRule), "2": pet.colors[7].toFormattedString(colorRule)},
              "Schuppen": {"1": pet.colors[8].toFormattedString(colorRule), "2": pet.colors[9].toFormattedString(colorRule)},
              "Flossen": {"1": pet.colors[10].toFormattedString(colorRule), "2": pet.colors[11].toFormattedString(colorRule)},
            };
          },
          hex: (colors) => {
            return {
              "Augen": {"1": pet.colors[0].toHexString(), "2": pet.colors[1].toHexString()},
              "Körper": {"1": pet.colors[2].toHexString(), "2": pet.colors[3].toHexString()},
              "Extras": {"1": pet.colors[4].toHexString(), "2": pet.colors[5].toHexString()},
              "Federn": {"1": pet.colors[6].toHexString(), "2": pet.colors[7].toHexString()},
              "Schuppen": {"1": pet.colors[8].toHexString(), "2": pet.colors[9].toHexString()},
              "Flossen": {"1": pet.colors[10].toHexString(), "2": pet.colors[11].toHexString()},
            };
          }
        }

      // Random Name
      let Zufallsname = await main.tools.nameGenerator();

      // Species
      let Spezies = pet.species;

      // Cropped Species
      let SpeziesKurz = (Spezies.length > 3)?Spezies.substr(0,4):Spezies;

      // Gender
      let Geschlecht = (pet.gender==`M`)?`Male`:`Female`;

      // Gender Short
      let GeschlechtKurz = pet.gender;

      // Pure YES / NO
      let Pure = (pet.pure==true)?true:false;
      let PureOffiziell = (pet.opure==true)?true:false;
      let PureInoffiziell = (pet.upure==true)?true:false;

      // Pure Text
      let PureText = (pet.pure==true)?`PURE`:``;
      let PureOffiziellText = (pet.opure==true)?`OPURE`:``;
      let PureInoffiziellText = (pet.upure==true)?`UPURE`:``;

      // Gem YES / NO
      let Edelstein = (pet.gem != ``)?true:false;
      let EdelsteinNamen = pet.gems;
      let EdelsteinNamenText = pet.gems.join(`, `);

      // Hatch Time
      let Geschlüpft = pet.hatched;

      // Colors
      let Farben = ____cl.normal(pet.colors);
      let FarbenX = ____cl.hex(pet.colors);

      // Features
      let Abstand = Clr.distance;

      let Besitzt = (f) => {
        let c = new Clr(f);
        return (pet.colors.filter(d=>d.compare(c)).length > 0);
      };

      let result = eval(`\`${code}\``);

      return result;
    }
  }

  /* ENDREGION */
  /* REGION "Structure Classes" */
  class Pet {
    constructor (id, adoptable = false, owner = -1, egg = false, turnable = false) {
      this.id = id;
      this.owner = owner;
      this.__name = this.id;
      this.species = `Unbekannt`;
      this.gender = `M`;
      this.hatched = `0001-01-01`;
      this.feed = 0;
      this.colors = [];
      this.mutations = [];
      this.pure = false;
      this.pureName = ``;
      this.pureNames = [];
      this.opure = false;
      this.opureName = ``;
      this.opureNames = [];
      this.upure = false;
      this.upureName = ``;
      this.upureNames = [];
      this.parents = {father: -1,mother: -1};
      this.gem = ``;
      this.gems = [];
      this.currentGeneIDs = [];
      this.pureCount = 0;
      this.adoptable = adoptable;
      this.egg = egg;
      this.turnable = turnable;
      this.renameable = false;

      this.load = this.__load.bind(this);
      this.reset = this.__reset.bind(this);

      this.move = this.__move.bind(this);
      this.feedit = this.__feed.bind(this);
      this.setName = this.__setName.bind(this);

      this.adopt= this.__adopt.bind(this);
      this.adoptWithFilter = this.__adoptWithFilter.bind(this);

      this.getSpecies = this.__getSpecies.bind(this);

      this.getGeneID = this.__getGeneID.bind(this);
      this.getGeneIDs = this.__getGeneIDs.bind(this);

      this.currentFailedTimeout = null;
      this.carries = [];
      this.loaded = false;
      this.tempTattooData = [[{id: 1, name: "Body"}], 223, 178, 0, 0, 0];
    }
    get name () {
      return this.__name;
    }

    async gemCheck(toCheck, gemCollections) {
      let sets = [];
      for(let gemSetIndex in gemCollections) {
        let gemSet = gemCollections[gemSetIndex];
        let gemSetCols = gemSet.colors;
        let gemSetReq = gemSet.colors.length;
        let gemSetCnt = 0;
        let out = gemSetCols.map(g=>g.toHexString()).join(`, `);
        for(let colIndex in toCheck) {
          for(let gemsColIndex in gemSetCols) {
            if(gemSetCols[gemsColIndex].toHexString() == toCheck[colIndex].toHexString()) {
              gemSetCnt += 1;
            }
          }
        }
        if(gemSetCnt >= gemSet.colors.length) {
          sets.push(gemSet);
        }
      }
      return sets;
    }
    async getMates(targetTab = -1) {
      let enc = (targetTab<0)?``:`&enclosure=${targetTab}`;
      let url = `https://ovipets.com/?src=pets&sub=profile&sec=breeding&pet=${this.id}${enc}${main.config.crack}`;
      let result = await Connection.GET(url);
      let src = JSON.parse((/jQuery.*?(\{.*)\)/gmi).exec(result.responseText)[1]).output;
      let entry = null;
      let females = [];
      let mt = /pet=(\d+)&amp;modified=\d+&amp;size=100" title = "(.*?)"/gmi;
      while(entry = mt.exec(src)) {
        let pet = new Pet(entry[1], false, -1, false, false);
        pet.__name = entry[2];
        females.push(pet);
      };
      return females;
    }
    async getParents() {
      return new Promise(async (finished, failed) => {
        if(this.parents.father == -1 || this.parents.mother == -1) {
          let rxmother = /c0.*?usr=(\d+)&.*?pet=(\d+)".*?title = "(.*?)"/gmi;
          let rxfather = /c1.*?usr=(\d+)&.*?pet=(\d+)".*?title = "(.*?)"/gmi;
          let json = null;
          if(this.parents.father == -1) {
            await new Promise(async (resolve, reject) => {
              let rsl = await Connection.GET(`https://ovipets.com/?src=pets&sub=profile&sec=pedigree&pet=${this.id}${main.config.crack}`);
              let content = rsl.responseText;
              let rx = /jQuery.*?(\{.*)\)/gmi;
              json = JSON.parse(rx.exec(content)[1]).output.toString();
              let t = rxfather.exec(json);
              if(t !== null) {
                this.parents.father = new Pet(parseInt(t[2]), false, parseInt(t[1]));
                this.parents.father.__name = t[3];
              } else {
                this.parents.father = new Pet();
                this.parents.father.__name = ``;
              }
              resolve();
            })
          }
          if(this.parents.mother == -1) {
            await new Promise(async (resolve, reject) => {
              if(json == null) {
                let rsl = await Connection.GET(`https://ovipets.com/?src=pets&sub=profile&sec=pedigree&pet=${this.id}${main.config.crack}`);
                let content = rsl.responseText;
                let rx = /jQuery.*?(\{.*)\)/gmi;
                const json = JSON.parse(rx.exec(content)[1]).output;
              }
              let t = rxmother.execOnce(json);
              if(t !== null) {
                this.parents.mother = new Pet(parseInt(t[2]), false, parseInt(t[1]));
                this.parents.mother.__name = t[3];
              } else {
                this.parents.mother = new Pet();
                this.parents.mother.__name = ``;
              }
              resolve();
            })
          }
        }
        finished(this.parents);
      });
    }

    async __load (forced = false, fromHatchery = false, skipCache = false) {
      if(this.loaded) return this;
      this.loaded = true;
      let url = `https://ovipets.com/?src=pets&sub=profile&pet=${this.id}&?${main.config.crack}`;
      let result = await Connection.GET(url, skipCache);
      const currentContent = result.responseText;
      let rx = /jQuery.*?(\{.*)\)/gmi;
      const json = JSON.parse(rx.exec(currentContent)[1]).output;
      let regexresults = {
        owner: parseInt(main.config.regex.pet.owner.execOnce(json)[1]),
        adoptable: /\/\/icons\/house\.png/gi.test(json),
        name: main.config.regex.pet.name.execOnce(json)[1],
        gender: (main.config.regex.pet.gender.execOnce(json)===null)?``:main.config.regex.pet.gender.execOnce(json)[1],
        feed: (main.config.regex.pet.feed.execOnce(json)===null)?100:parseInt(main.config.regex.pet.feed.execOnce(json)[1]),
        species: (main.config.regex.pet.species.execOnce(json)===null)?`Egg`:main.config.regex.pet.species.execOnce(json)[1],
        hatched: (main.config.regex.pet.hatched.execOnce(json)===null)?new Date().quickDate():new Date(main.config.regex.pet.hatched.execOnce(json)[1]).quickDate(),
        turnable: json.indexOf(`pet_turn_egg`) > -1,
        colors: [],
        mutations: [],
        carries: [],
      };
      this.renameable = json.indexOf(`pet_rename`) > -1;

      let tempResult = null;
      main.config.regex.pet.colors.reset();

      while((tempResult = main.config.regex.pet.colors.exec(json))) regexresults.colors.push(new Clr(parseInt(tempResult[1]), parseInt(tempResult[2]), parseInt(tempResult[3])));

      main.config.regex.pet.colors.reset();
      main.config.regex.pet.mutations.reset();

      let muts = json.substr(json.indexOf(`mutations`));
      muts = muts.substr(0, muts.indexOf(`fieldset`));
      while((tempResult = main.config.regex.pet.mutations.exec(muts))) regexresults.mutations.push(parseInt(tempResult[2]));
      main.config.regex.pet.mutations.reset();

      let carr = json.substr(json.indexOf(`carries`));
      carr = carr.substr(0, carr.indexOf(`fieldset`));
      while((tempResult = main.config.regex.pet.mutations.exec(carr))) regexresults.carries.push(parseInt(tempResult[2]));
      main.config.regex.pet.mutations.reset();

      this.__name = regexresults.name;
      this.species = regexresults.species;
      this.gender = (regexresults.gender!==``)?regexresults.gender.toUpperCase()[0]:``;
      if(this.gender == `F`) this.gender = `W`;
      this.hatched = regexresults.hatched;
      this.feed = regexresults.feed;
      this.adoptable = regexresults.adoptable;
      this.owner = regexresults.owner;
      this.turnable = regexresults.turnable;
      this.mutations = regexresults.mutations;
      this.carries = regexresults.carries;
      let currentResult = ``;
      let opureList = [...main.config.pures.official];
      let upureList = [...main.config.pures.unofficial];
      let pureList = [...upureList, ...opureList];
      for(let colIndex in regexresults.colors) {
        const color = regexresults.colors[colIndex];
        pureList.forEach((pure, pIndex) => {
          if(color.toHexString() == pure.toHexString()) {
            this.pure = true;
            this.pureNames.push(pure.name);
            if(this.pureName == ``) this.pureName = pure.name;
          }
        });
        opureList.filter(pure => {
          if(color.compare(pure)) {
            this.opure = true;
            this.opureNames.push(pure.name);
            if(this.opureName == ``) this.opureName = pure.name;
            return true;
          }
          return false;
        });
        upureList.filter(pure => {
          if(color.compare(pure)) {
            this.upure = true;
            this.upureNames.push(pure.name);
            if(this.upureName == ``) this.upureName = pure.name;
            return true;
          }
          return false;
        });
        this.colors.push(color);
      }

      let gemsResult = await this.gemCheck(this.colors, main.config.pures.gems);
      if(gemsResult.length > 0) {
        this.gem = gemsResult[0].name;
        this.gems = gemsResult.map(g=>g.name);
      }
      if(BetterBrain.loadParents || true) {
        await this.getParents();
      } else {
        this.parents = {
          father: new Pet(),
          mother: new Pet()
        }
        this.parents.father.__name = ``;
        this.parents.mother.__name = ``;
      }
      return this;
    }
    async __reset() {
      this.mutations = [];
      this.carries = [];
      this.pureNames = [];
      this.opureNames = [];
      this.upureNames = [];
      this.gems = [];
    }

    async __move (targetEnclosure) {
      let result = await Connection.POST({'cmd': 'pets_enclosure', 'PetID': this.id, 'Enclosure': targetEnclosure});
      return result;
    }
    async __feed (filter) {
      let hasToFeed = true;
      let result = false;
      if(filter != ``) {hasToFeed = (await NamerCoder.Parse(this, filter, true)).toString() == `true`;}
      if(hasToFeed) {
        result = await Connection.POST({'cmd': 'pet_feed', 'PetID': this.id});
      }
      return result;
    }
    async __setName(value) {
      let comm = {cmd: 'pet_name', PetID: this.id, Name: value};
      if(this.renameable) comm = {cmd: 'pet_rename', PetID: this.id, Name: value, Enclosure: 0};
      let result = await Connection.POST(comm);
      if(result) this.__name = value;
      BetterBrain.amountRenames = (BetterBrain.amountRenames || 0) + 1;
      return result;
    }

    async __adopt () {
      let result = false;
      if(this.adoptable) {
        result = await Connection.POST({'cmd': 'pet_adopt', 'PetID': this.id, 'OwnerID': 0});
        if(result) {
          main.adoptTime = (new Date()).getTime();
          this.adoptable = false;
        }
      }
      return result;
    }
    async __adoptWithFilter (filter) {
      let result = false;
      if(this.adoptable) {
        let rsl = await NamerCoder.Parse(this, filter, true);
        let hasToAdopt = (rsl).toString() == `true`;
        logs(rsl.toString());
        logs(hasToAdopt);
        if(hasToAdopt) {
          result = await Connection.POST({'cmd': 'pet_adopt', 'PetID': this.id, 'OwnerID': 0});
          if(result) {
            main.adoptTime = (new Date()).getTime();
            this.adoptable = false;
          }
        }
      }
      return result;
    }

    async __getSpecies() {
      let url = `https://ovipets.com/?src=pets&sub=profile&pet=${this.id}&?${main.config.crack}`;
      let result = await Connection.GET(url);
      const currentContent = result.responseText;
      const json = JSON.parse((/jQuery.*?(\{.*)\)/gmi).exec(currentContent)[1]).output;
      let spc = main.config.regex.pet.species.execOnce(json);
      let ishatching = json.indexOf(`100%" class = "hatching`) > -1;
      return([spc[1], ishatching]);
    }
    async __getGeneIDs () {
      if(this.currentGeneIDs.length == 0) {
        let u55 = `https://ovipets.com/?src=pets&sub=profile&sec=tattoo&usr=${main.user.uid}&pet=${this.id}&=${main.config.crack}`;
        let rsl55 = await Connection.GET(u55);
        let content55 = rsl55.responseText;
        let rx55 = /jQuery.*?(\{.*)\)/gmi;
          const json55 = JSON.parse(rx55.exec(content55)[1]).output;

          // Regulären Ausdruck anwenden, um alle Gene-ID's zu finden
          let regexf = /value = "(\d+)".*?>(.*?)<\/ui:o>/gi;
          let idHits = [];
          let entry = null;

          while(entry = regexf.exec(json55)) {
            let t = document.createElement("span");
            t.innerHTML = entry[2];
            let data = {id: parseInt(entry[1]), name: t.textContent};
            idHits.push(data);
          }
          this.currentGeneIDs = idHits;
      }
      return this.currentGeneIDs;
    }
    async __getGeneID() {
      let rsl = await Connection.GET(`https://ovipets.com/?src=pets&sub=profile&sec=tattoo&usr=${this.owner}&pet=${this.id}${main.config.crack}`);
      let content = rsl.responseText;
      let rx = /jQuery.*?(\{.*)\)/gmi;
      const json = JSON.parse(rx.exec(content)[1]).output;
      const geneID = parseInt(((/GeneID=(\d+)/gi).exec(json))[1]);
      return geneID;
    }

    async __getNextPet() {
      let url = `https://ovipets.com/?src=pets&sub=profile&pet=${this.id}&next&?${main.config.crack}`;
      let httpresult = await Connection.GET(url);
      let regexresult = /(\d+)&amp;next/gi.exec(httpresult.responseText);
      return [new Pet(parseInt(regexresult[1])), httpresult];
    }
  }
  class User {
    constructor(uid) {
      this.uid = uid || -1;
      this.name = ``;
      this.credits = 0;
      if(this.uid == -1) {
        try {
          let userName = document.querySelector(`#self div.links a.user.name`).title;
          let userId = document.querySelector(`#self a.user.avatar img`);
          userId = (userId.src.indexOf(`usr=`) < 0) ? userId.parentNode.href : userId.src;
          userId = userId.substr(userId.indexOf(`usr=`) + 4);
          userId = parseInt((userId.indexOf(`modified`) > -1) ? userId.substr(0, userId.indexOf(`&modified`)) : userId);
          this.uid = userId;
          this.name = userName;
        } catch (ex) {
        }
      }
    }
    async getFriends (fav = false, optimized = false) {
      let targetUrl = `https://ovipets.com/?src=events&sub=feed&sec=friends&filter=${fav?`favourite`:`all`}&usr=${this.uid}&${main.config.crack}`;
      let result = await Connection.GET(targetUrl);
      const content = result.responseText;
      let line = ``;
      let friendList = [];
      const convertUnicodeEscapes = (str) => {
          return str.replace(/\\u[\dA-F]{4}/gi,
              (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
      }
      while((line = main.config.regex.friends.exec(content))) {
        if(line[3].indexOf(`vacation`) < 0) {
          let temp_1 = /usr=(\d{3,8})/.exec(line[0]);
          if(temp_1.length > 1) {
            if(optimized) {
              let name = line[3].substr(line[3].indexOf(` title = \\"`) + 11);
              name = name.substr(0, name.indexOf(`\\" width = \\"50`));
              name = convertUnicodeEscapes(name);
              friendList.push([parseInt(temp_1[1]), name]);
            } else {
              friendList.push(parseInt(temp_1[1]));
            }
          }
        }
      }
      logs(`[User.getFriends] > `, `Found ${friendList.length} friends.`);
      return friendList;
    }
    async getEggs () {
      let result = await Connection.GET(`https://ovipets.com/?src=pets&sub=hatchery&usr=${this.uid}&${main.config.crack}`);
      if(this.uid == main.user.uid) {

      }
      let content = result.responseText.substr(result.responseText.indexOf(`ui:list`));
      content = content.substr(0, content.indexOf(`/ui:list`));
      let line = ``;
      let eggsList = [];
      let eggsListAll = [];
      while((line = main.config.regex.eggs.exec(content))) {
        eggsList.push({id: parseInt(line[1]), owner: parseInt(line[2])});
      }
      main.config.regex.eggs.lastIndex = 0;

      while((line = main.config.regex.eggsall.exec(content))) {
        eggsListAll.push({id: parseInt(line[2]), owner: parseInt(line[1])});
      }
      main.config.regex.eggsall.lastIndex = 0;

      let uidf = this.uid.toString();
      while(uidf.length < 9) uidf = ` ${uidf}`;
      if(eggsList.length > 0) {
        let eggsListlength = eggsList.length.toString();
        while(eggsListlength.length < 5) eggsListlength = ` ${eggsListlength}`;
        let eggsListAlllength = eggsListAll.length.toString();
        while(eggsListAlllength.length < 5 + ((eggsList.length==1)?1:0)) eggsListAlllength = ` ${eggsListAlllength}`;
        logs(`[User.getEggs] > `, `User: ${uidf} - ${eggsListlength} egg${(eggsList.length==1)?``:`s`} out of ${eggsListAlllength} egg${(eggsListAll.length==1)?``:`s`}.${(eggsListAll.length == 1000)?` Possible hidden eggs available.`:``}`);
      }
      return {turnable: eggsList, all: eggsListAll};
    }
    async getUnnamed () {
      let result = await Connection.GET(`https://ovipets.com/?src=pets&sub=hatchery&usr=${this.uid}?${main.config.crack}`);
      const content = await result.responseText;
      let line = ``;
      let unnamedList = [];
      while((line = main.config.regex.unnamed.exec(content)))
      {
        unnamedList.push(new Pet(line[1], false, line[2]));
      }
      return unnamedList;
    }
    async getName() {
      let rx = /avatar\\\".*?href.*?title = \\\"(.*?)\\\" width = \\\"110/gi;
      let ur = `https://ovipets.com/?usr=${this.uid}&?${main.config.crack}`;
      let rs = await Connection.GET(ur);
      rs = rs.responseText;
      let sx = rx.exec(rs);
      let t = JSON.parse(`{"name": "${sx[1]}"}`);
      return t.name;
    }
  }
  class Enclosures {
    static async getEnclosures (userID) {
      const decodeHTMLChars = (input) => {
        var e = document.createElement('div');
        e.innerHTML = input;
        let t = e.childNodes[0].nodeValue;
        e = undefined;
        return t;
      }
      let targetUserID = userID || main.user.uid;
      let result = await Connection.GET(`https://ovipets.com/?src=pets&sub=overview&usr=${targetUserID}${main.config.crack}`);
      let regexresult = null;
      let resultList = [];
      while ((regexresult = main.config.regex.enclosures.exec(result.responseText))) {
        try {
          resultList.push({
            id : regexresult[1],
            name : JSON.parse(`["${decodeHTMLChars(regexresult[2])}"]`)[0],
            user : main.tools.urldecode(regexresult[3]),
            uid : targetUserID,
          });
        } catch (e) {
          resultList.push({
            id : regexresult[1],
            name : regexresult[2],
            user : regexresult[3],
            uid : targetUserID,
          });
        }
      }
      main.config.regex.enclosures.currentIndex = 0;
      if(targetUserID === main.user.uid) {
        this.activeEnclosureList = resultList;
      }
      return resultList;
    }
    static async addEnclosure (enclosureName) {
      return await Connection.POST({cmd: `enclosure_add`, Presentation: ``, Label: enclosureName});
    }
    static async hasEnclosure (userID, enclosureName) {
      return ((await Enclosures.getEnclosure(userID, enclosureName)).length > 0);
    }
    static async getEnclosure (userID, enclosureName) {
      return (await Enclosures.getEnclosures(userID)).filter(enclosure=>enclosure.name===enclosureName);
    }
    static async getPetsAll (enclosureId, userId, extraFilter = ``, ignoreCache = false) {
      if(typeof main.config.cachedPetList[enclosureId] == `undefined` || ignoreCache) {
        const targetUserId = userId || main.user.uid;
        let curUrl = `https://ovipets.com/?src=pets&sub=overview&sec=pets&enclosure=${enclosureId}&usr=${targetUserId}${main.config.crack}`;
        if(enclosureId < 0) {
          curUrl = `https://ovipets.com/?src=pets&sub=hatchery&usr=${targetUserId}${main.config.crack}`;
        }
        if(extraFilter !== ``) {
          curUrl = `https://ovipets.com/?src=pets&sub=overview&sec=pets&enclosure=${enclosureId}&${extraFilter}${main.config.crack}`;
        }
        let result = await Connection.GET(curUrl);
        const content = result.responseText;
        let regexresult = null;
        let resultList = [];
        main.config.regex.enclosurePet.currentIndex = 0;
        while ((regexresult = main.config.regex.enclosurePets.exec(content))) {
          resultList.push({
            id: parseInt(regexresult[2]),
            uid: parseInt(regexresult[1])
          });
        }
        main.config.cachedPetList[enclosureId] = resultList;
      }
      return main.config.cachedPetList[enclosureId];
    }
    static async getPetsOnly (enclosureId, userId) {
      const targetUserId = userId || main.user.uid;
      let curUrl = `https://ovipets.com/?src=pets&sub=overview&sec=pets&enclosure=${enclosureId}&usr=${targetUserId}${main.config.crack}`;
      if(enclosureId < 0) {
        curUrl = `https://ovipets.com/?src=pets&sub=hatchery&usr=${targetUserId}${main.config.crack}`;
      }
      let result = await Connection.GET(curUrl);
      const content = result.responseText;
      let regexresult = null;
      let resultList = [];
      main.config.regex.enclosurePetsOnly.currentIndex = 0;
      while ((regexresult = main.config.regex.enclosurePetsOnly.exec(content))) {
        resultList.push({
          id: parseInt(regexresult[2]),
          uid: parseInt(regexresult[1])
        });
      }
      return resultList;
    }
    static async getPets (enclosureId, userId) {
      const targetUserId = userId || main.user.uid;
      let curUrl = `https://ovipets.com/?src=pets&sub=overview&sec=pets&enclosure=${enclosureId}&usr=${targetUserId}${main.config.crack}`;
      if(enclosureId < 0) {
        curUrl = `https://ovipets.com/?src=pets&sub=hatchery&usr=${targetUserId}${main.config.crack}`;
      }
      let result = await Connection.GET(curUrl);
      const content = result.responseText;
      let regexresult = null;
      let resultList = [];
      main.config.regex.enclosurePet.currentIndex = 0;
      while ((regexresult = main.config.regex.enclosurePet.exec(content))) {
        resultList.push({
          id: parseInt(regexresult[2]),
          uid: parseInt(regexresult[1])
        });
      }
      return resultList;
    }
    static async setOrder (enclosureOrder) {
      let order = [];
      let ids = [];
      order.push({name: `cmd`, value: `enclosure_order`});
      for(var n = 0;n < enclosureOrder.length;n++) {
        order.push({name: `Enclosures[${n}]`, value: enclosureOrder[n].id});
      }
      let result = await Connection.POSTArray(order);
      return result;
    }
  }
  /* ENDREGION */
  /* REGION "UI Classes" */
  class TrackBar extends EventTarget {
    constructor(bar, cnt, val, max, steps = 10000) {
      super();
      this.steps = steps;
      this.box = bar;
      this.bar = cnt;
      this.bar.style.background = `red`;
      this.val = val;
      this.max = max;
      this.box.addEventListener('click', this.handleClick.bind(this));
    }
    handleClick(event) {
      const boxRect = this.box.getBoundingClientRect();
      const clientLeft = this.box.clientLeft;
      const offsetX = event.clientX - boxRect.left;
      if (offsetX >= clientLeft) {
        const innerWidth = this.box.clientWidth - clientLeft;
        const calcPercent = Math.round(((offsetX - 5) / innerWidth) * this.steps) / this.steps;
        if(calcPercent >= 0 && calcPercent <= 1) {
          const resultPercent = Math.min(1, Math.max(0, calcPercent));
          this.value = resultPercent;
        }
      }
    }
    get value() {
      return this.val;
    }
    set value(val) {
      this.val = val;
      let percent = Math.min(100, Math.max(0, (this.val / this.max) * 100));
      this.bar.style.width = `${percent}%`;
      this.dispatchEvent(new CustomEvent('clicked', [percent]));
    }
    get maximum() {
      return this.max;
    }
    set maximum(max) {
      this.max = max;
      let percent = Math.min(100, Math.max(0, (this.val / this.max) * 100));
      this.bar.style.width = `${percent}%`;
      this.dispatchEvent(new CustomEvent('clicked', [percent]));
    }
  }
  /* ENDREGION */
  /* REGION "Version-Check" */
  var lastCache = {};
  var lastFoundVersion = GM_info.script.version;
  async function checkForNewVersionStart() {
    let rsl = await Connection.GET(`https://greasyfork.org/de/scripts/443300-ovipets-megabot-version-3-beta`);
    return rsl;
  }
  async function checkForNewVersionBefore() {
    let rsl = /data-script-version=\"(.*?)\" data/gi.exec(lastCache.responseText);
    if(rsl == null) {
      lastCache = await checkForNewVersionStart();
      rsl = /data-script-version=\"(.*?)\" data/gi.exec(lastCache.responseText);
    }
    lastFoundVersion = rsl[1];
    let versionDifference = parseInt(lastFoundVersion.replace(/\./gi, ``)) - parseInt(GM_info.script.version.replace(/\./gi, ``));
    return versionDifference;
  }
  async function checkForNewVersion() {
    lastCache = await checkForNewVersionStart();
    let r = await checkForNewVersionBefore();
    let ignoredVersions = BetterBrain.ignoredVersions || [];
    if(ignoredVersions.indexOf(lastFoundVersion) > -1) return false;
    return (r >= 1);
  }
  /* ENDREGION */
  /* REGION "Default initialization" */
  if(Brain.read(`__GLOBAL__.creditStartTime`, -1) == -1) Brain.write(`__GLOBAL__.creditStartTime`, (new Date()).getTime().toString(36));
  var startTime = Brain.read(`__GLOBAL__.creditStartTime`, `0`);
  /* ENDREGION */
  /* REGION "Module Classes" */
  class Work {
    constructor(element, action, params, title) {
      this.o = element;
      this.c = action;
      this.d = params;
      this.t = title || `TASK`;
      this.skipOnFail = false;
    }
  }
  class WorkerElement {
    constructor (workerIndex) {
      this.workerIndex = workerIndex;
      this.active = false;
      this.works = [];
      this.amount = 0;
      this.cycleRunning = false;
      this.stop = this.__stop.bind(this);

      this.toggleState = this.__toggleState.bind(this);
      this.clearWorks = this.__clearWorks.bind(this);
      this.addWorks = this.__addWorks.bind(this);
      this.cycle = this.__cycle.bind(this);

      this.box = main.tools.createElement(`div`, `button`);

      this.box.style.height = `initial`;
      this.box.style.textAlign = `left`;
      this.box.style.cursor = `initial`;

      this.stateImage = new Image();

      this.stateImage.style.width = `64px`;
      this.stateImage.style.height = `64px`;
      this.stateImage.style.border = `0px`;
      this.stateImage.style.display = `block`;
      this.stateImage.style.float = `left`;

      this.stateImage.src = main.config.defaults.idleImage;

      this.stateProgress = main.tools.createProgressbar(0, 1);
      this.stateProgress.element.style.height = `20px`;

      this.stateText1 = main.tools.createElement(`div`, `center`, `Nichts zu tun`);
      this.stateText1.style.letterSpacing = `-0.75px`;
      this.stateText1.style.fontWeight = `normal`;
      this.stateText1.style.display = `inline-block`;
      this.stateText1.style.height = `32px`;
      this.stateText1.style.width = `CALC(100% - 117px)`;
      this.stateText1.style.boxSizing = `border-box`;
      this.stateText1.style.marginLeft = `0px`;
      this.stateText1.style.padding = `5px`;

      this.stateText2 = main.tools.createElement(`div`, `center`, `0`);
      this.stateText2.style.letterSpacing = `-0.75px`;
      this.stateText2.style.fontWeight = `normal`;
      this.stateText2.style.display = `inline-block`;
      this.stateText2.style.textAlign = `right`;
      this.stateText2.style.height = `32px`;
      this.stateText2.style.width = `48px`;
      this.stateText2.style.boxSizing = `border-box`;
      this.stateText2.style.marginLeft = `0px`;
      this.stateText2.style.padding = `5px`;

      this.buttonWrapper = main.tools.createElement(`div`);
      this.buttonWrapper.style.clear = `both`;

      this.speedselection = main.tools.createTrackbar(parseFloat(Brain.read(`Worker.currentSpeed${this.workerIndex}`, 0.25)), 40);
      this.speedselection.addEventListener(`clicked`, ()=>{Brain.write(`Worker.currentSpeed${this.workerIndex}`, this.speedselection.val);}, true);
      this.speedselection.box.style.display = `inline-block`;
      this.speedselection.box.style.width = `CALC(100% - 100px)`;
      this.buttonWrapper.in(this.speedselection.box);

      [this.button_pause, this.button_pause_label] = main.tools.createToggle(`worker_pause_${this.workerIndex}`, ``, () => {}, false);
      this.button_pause_label.style.display = `inline-block`;
      this.button_pause_label.style.width = `32px`;
      this.button_pause_label.style.backgroundSize = `contain`;
      this.button_pause_label.style.backgroundImage = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAADsAAAA7AF5KHG9AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAHxJREFUWIXtzj0Kg1AUROFD0kmyiLgiXVTAPfizKAvBXYjPPja3sohTKCLMaW4zvPeBczcpBxqgELYlUAOfIwEd8ANmYZti2yoPP0TAK+774K0MOC0DDDDAAAMMMMAAFbDETcI2be7fniKgBzKgAsad7RCff4FJfN+561oBA0kQ3as5QtoAAAAASUVORK5CYII=)`;

      this.buttonWrapper.in(this.button_pause);
      this.buttonWrapper.in(this.button_pause_label);

      this.button_clear = main.tools.createElement(`div`, `button center`, ``);
      this.button_clear.style.display = `inline-block`;
      this.button_clear.style.textAlign = `center`;
      this.button_clear.style.width = `32px`;
      this.button_clear.style.backgroundSize = `contain`;
      this.button_clear.style.backgroundImage = `url(${main.config.defaults.trashcan})`;
      this.button_clear.addEventListener(`click`, this.clearWorks, true);

      this.buttonWrapper.in(this.button_clear);

      this.box.in(this.stateImage);
      this.box.in(this.stateProgress.element);
      this.box.in(this.stateText1);
      this.box.in(this.stateText2);
      this.box.in(this.buttonWrapper);
    }
    async __toggleState() {
      if(!this.active) this.active = true;
      this.cycle();
    }
    async __stop() {
      this.active = false;
    }
    async __addWorks(workEntries, atStart) {
      if(atStart) {
        this.works = [].concat(workEntries, this.works);
      } else {
        this.works = this.works.concat(workEntries);
      }
      this.amount += workEntries.length;

      this.stateText2.innerHTML = this.works.length;
      this.stateProgress.element.setAttribute(`data-maximum`, this.amount);
      if(!this.active) this.toggleState();
    }
    async __cycle(bypass = false) {
      if(!this.cycleRunning || bypass) {
        this.cycleRunning = true;
        if(!this.button_pause.checked) {
          if(this.works.length > 0) {
            let item = this.works.shift();
            this.stateImage.src = main.config.defaults.act;
            this.stateText1.innerHTML = item.t;
            item.textSwitch = (t) => {
              this.stateText1.innerHTML = t;
            }
            let result = await item.o[item.c](...item.d, item);
            if(result instanceof Array) {
              item.skipOnFail = result[1];
              result = result[0];
            }
            if(result) {
              this.stateImage.src = main.config.defaults.successImage;
            } else {
              this.stateImage.src = main.config.defaults.failedImage;
            }
            this.stateText2.innerHTML = this.works.length;
            this.stateProgress.increase();
            main.worker.boxprogressUpdate();
            if(!result && item.skipOnFail) {
              await main.tools.sleep(20);
            } else {
              await main.tools.sleep(parseFloat(Brain.read(`__GLOBAL__.speedlimit`, 2.0)) * Math.max(0.01, this.speedselection.value) * 1 * 1000);
            }
          }
        } else {
          this.stateText1.innerHTML = `Angehalten`;
          await main.tools.sleep(100);
        }
        if(this.works.length > 0) {
          this.cycle(true);
        } else {
          this.stateProgress.setValue(0);
          this.stateProgress.element.setAttribute(`data-maximum`, 1);
          this.amount = 0;
          this.cycleRunning = false;
          this.stateImage.src = main.config.defaults.idleImage;
          this.stateText1.innerHTML = `Nichts zu tun`;
          this.stateText2.innerHTML = 0;
          this.active = false;
          main.worker.boxprogressUpdate();
          main.worker.initializeRestart();
        }
      }
    }
    async __clearWorks() {
      this.works = [];
      this.amount = 0;
      this.stateText2.innerHTML = 0;
      main.worker.boxprogressUpdate();
    }
  }

  class ConfigWindow {
    constructor () {
      this.box = main.tools.createElement(`div`, `ovipets_dialogue hidden`);
      this.box.css({
        height: `650px`,
        minWidth: `500px`,
        backdropFilter: `blur(15px) brightness(0.15)`,
      })
      this.content = main.tools.createElement(`div`, `catbox`).to(this.box);
      this.content.css({
        overflowY: `auto`,
      })

      this.buttons = {};
      this.textes = {};

      this.buttons.save = main.tools.createElement(`div`, `button okaybutton`, `Schließen`).to(this.box);

      this.save = this.__save.bind(this);
      this.buttons.save.addEventListener(`click`, this.save, true);

      this.buttons.src = main.tools.createElement(`div`, `button cancelbutton`, `Aktuellen Quelltext kopieren`).to(this.box);
      this.buttons.src.addEventListener(`click`, () => {
        navigator.clipboard.writeText(document.querySelector(`#src`).innerHTML);
      }, true)

      /* REGION " BOX ITSELF " */
      this.title = main.tools.createElement(`div`, `center`, `<b><u>Einstellungen</u></b>`);
      this.box.in(this.title);
      /* ENDREGION */

      /* REGION " PANEL WIDTH " */
      this.textes.panelwidth = main.tools.createElement(`div`, ``, `Breite des Bot-Panels:`);
      this.textes.panelwidth.style.display = `inline-block`;
      this.textes.panelwidth.style.marginLeft = `10px`;
      this.textes.panelwidth.style.width = `150px`;

      this.panelWidthConfigurator = main.tools.createTrackbar((Brain.read(`__GLOBAL__.panelwidth`, 450) - 250) / 600, 40);
      this.panelWidthConfigurator.addEventListener(`clicked`, v=>{
        let val = 250 + (v.target.val * 600);
        main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(
          `div.ovipet_mainbox.open {width:${main.config.panelwidth}px;`,
          `div.ovipet_mainbox.open {width:${val}px;`
        );
        main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(
          /max-width: \d+px\) \{\/\*FIXWS\*\//gi,
          `max-width: ${Math.floor(val*2)+730}px) {/*FIXWS*/`
        );
        main.config.panelwidth = val;
        Brain.write(`__GLOBAL__.panelwidth`, val);
      }, true);
      this.panelWidthConfigurator.box.style.display = `inline-block`;
      this.panelWidthConfigurator.box.style.width = `CALC(100% - 170px)`;
      this.panelWidthConfigurator.box.style.marginTop = `5px`;
      this.panelWidthConfigurator.box.style.marginBottom = `-5px`;
      /* ENDREGION */
      /* REGION " JUSTIFY TABS " */
      this.justifyTabsToggle = main.tools.createElement(`input`, `hidden`);
      this.justifyTabsToggle.setAttribute(`id`, `justifyTabs`);
      this.justifyTabsToggle.setAttribute(`type`, `checkbox`);
      this.justifyTabsToggle.checked = (Brain.read(`__GLOBAL__.justifyTabs`, 0)==1)?true:false;
      this.justifyTabsToggle.addEventListener(`change`, () => {
        main.config.justifyTabselement.innerHTML=(this.justifyTabsToggle.checked==true) ? main.config.justifyTabs:``;
        Brain.write(`__GLOBAL__.justifyTabs`, (this.justifyTabsToggle.checked==true)?1:0);
      }, true);
      this.justifyTabsToggle_label = main.tools.createElement(`label`, `button center`, `Blocksatz-Tabs`);
      this.justifyTabsToggle_label.setAttribute(`for`, `justifyTabs`);
      this.justifyTabsToggle_label.setAttribute(`title`, `Ist diese Option aktiviert, werden Tabs in den Tab-Listen gleichmäßig ausgerichtet.`);
      /* ENDREGION */
      /* REGION " DEBUG-MODE " */
      this.userDebugCheckbox = main.tools.createElement(`input`, `hidden`);
      this.userDebugCheckbox.setAttribute(`id`, `debugMode`);
      this.userDebugCheckbox.setAttribute(`type`, `checkbox`);
      this.userDebugCheckbox.checked = BetterBrain.debugUserSetting || false;
      this.userDebugCheckbox.addEventListener(`change`, () => {
        BetterBrain.debugUserSetting = this.userDebugCheckbox.checked;
      }, true);
      this.userDebugCheckbox_label = main.tools.createElement(`label`, `button center`, `DEBUG-MODUS`);
      this.userDebugCheckbox_label.setAttribute(`for`, `debugMode`);
      /* ENDREGION */
      /* REGION " PARENTS LOADER " */
      this.userLoadParents = main.tools.createElement(`input`, `hidden`);
      this.userLoadParents.setAttribute(`id`, `loadParentsToggle`);
      this.userLoadParents.setAttribute(`type`, `checkbox`);
      this.userLoadParents.checked = BetterBrain.loadParents || true;
      this.userLoadParents.addEventListener(`change`, () => {
        BetterBrain.loadParents = this.userLoadParents.checked;
      }, true);
      this.userLoadParents_label = main.tools.createElement(`label`, `button center`, `Eltern laden`);
      this.userLoadParents_label.setAttribute(`for`, `loadParentsToggle`);
      this.userLoadParents_label.setAttribute(`title`, `Verlangsamt den Namer und andere Pet-Bezogene Module etwas. Daher abschaltbar!`)
      /* ENDREGION */
      /* REGION " TAB STYLE SELECTOR " */
      this.tabstyleselect_label = main.tools.createElement(`div`, ``, `Tab Style:`);
      this.tabstyleselect_label.style.display = `inline-block`;
      this.tabstyleselect_label.style.width = `CALC(35% - 10px)`;
      this.tabstyleselect_label.style.boxSizing = `border-box`;
      this.tabstyleselect_label.style.padding = `10px`;

      this.tabstyleselect = main.tools.createElement(`select`, `button`);
      this.tabstyleselect.style.width = `CALC(65% - 10px)`;
      this.tabstyleselect.style.display = `inline-block`;
      this.tabstyleselect.addEventListener(`change`, () => {
        Brain.write(`__GLOBAL__.skullTabs`, this.tabstyleselect.selectedIndex);
        main.config.styledTabselement.innerHTML = main.config.tabStyles[Brain.read(`__GLOBAL__.skullTabs`, 0)].css;
      }, true);

      (async () => {
        let curConfig = Brain.read(`__GLOBAL__.skullTabs`, 0);
        for(let styleIndex in main.config.tabStyles) {
          let styleObject = main.config.tabStyles[styleIndex];
          let title = styleObject.name;
          let styleEntry = main.tools.createElement(`option`, ``, title).to(this.tabstyleselect);
          if(styleIndex == curConfig) styleEntry.setAttribute(`selected`, ``);
          styleEntry.style.textAlign = `left`;
        }
        main.config.styledTabselement.innerHTML = main.config.tabStyles[Brain.read(`__GLOBAL__.skullTabs`, 0)].css;
      })();
      /* ENDREGION */
      /* REGION " WIDESCREEN FIX " */
      this.widescreenfixtoggle = main.tools.createElement(`input`, `hidden`);
      this.widescreenfixtoggle.setAttribute(`id`, `config_wsft`);
      this.widescreenfixtoggle.setAttribute(`type`, `checkbox`);
      this.widescreenfixtoggle.checked = (Brain.read(`__GLOBAL__.widescreenFix`, 1)==1)?true:false;
      this.widescreenfixtoggle.addEventListener(`change`, () => {
        main.config.wsfixelement.innerHTML=(this.widescreenfixtoggle.checked==true) ? main.config.defaults.widescreenFix:``;
        if(this.wsmfixtoggle.checked) {
        } else {
          main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(main.config.defaults.widescreenModuleFix, `/*WSMFIX*/`);
        }
        if(this.widescreenfixtoggle.checked) {
          main.boxes.root.classList.add(`widescreen`);
          main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(main.config.defaults.petBackgroundFix, `/*PETBG*/`);
        } else {
          main.boxes.root.classList.remove(`widescreen`);
          main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(`/*PETBG*/`, main.config.defaults.petBackgroundFix);
        }
        Brain.write(`__GLOBAL__.widescreenFix`, (this.widescreenfixtoggle.checked==true)?1:0);
      }, true);
      this.widescreenfixtoggle_label = main.tools.createElement(`label`, `button center`, `Breitbild`);
      this.widescreenfixtoggle_label.setAttribute(`for`, `config_wsft`);
      this.widescreenfixtoggle_label.setAttribute(`title`, `Ist diese Option aktiviert, wird Ovipets auf einen Breitbild-Modus gewechselt.`);
      /* ENDREGION */
      /* REGION " BREED HACK " */
      this.breedhacktoggle = main.tools.createElement(`input`, `hidden`);
      this.breedhacktoggle.setAttribute(`id`, `breedhack`);
      this.breedhacktoggle.setAttribute(`type`, `checkbox`);
      this.breedhacktoggle.checked = (Brain.read(`__GLOBAL__.breedhack`, 1)==1)?true:false;
      this.breedhacktoggle.addEventListener(`change`, () => {Brain.write(`__GLOBAL__.breedhack`, (this.breedhacktoggle.checked==true)?1:0);}, true);
      this.breedhacktoggle_label = main.tools.createElement(`label`, `button center`, `Brut-Hack`);
      this.breedhacktoggle_label.setAttribute(`for`, `breedhack`);
      this.breedhacktoggle_label.setAttribute(`title`, `Ist diese Option aktiviert, wird die Zucht von Pets über das "Zucht"-Menü durch einen einfachen Klick ermöglicht.`);
      /* ENDREGION */
      /* REGION " ENCLOSURE ACTIONS TOP " */
      this.enclosureActionsToggl = main.tools.createElement(`input`, `hidden`);
      this.enclosureActionsToggl.setAttribute(`id`, `enclosureMover`);
      this.enclosureActionsToggl.setAttribute(`type`, `checkbox`);
      this.enclosureActionsToggl.checked = (Brain.read(`__GLOBAL__.enclosureMover`, 1)==1)?true:false;
      this.enclosureActionsToggl.addEventListener(`change`, () => {Brain.write(`__GLOBAL__.enclosureMover`, (this.enclosureActionsToggl.checked==true)?1:0);}, true);
      this.enclosureActionsToggl_label = main.tools.createElement(`label`, `button center`, `Tab-Aktionen oben`);
      this.enclosureActionsToggl_label.setAttribute(`for`, `enclosureMover`);
      this.enclosureActionsToggl_label.setAttribute(`title`, `Ist diese Option aktiviert, wird versucht, die Aktionen für ein Tab an der oberen Position anzuordnen. (Nicht 100% akkurat)`);
      /* ENDREGION */
      /* REGION " START URL " */
      this.urlPreventLoad = main.tools.createElement(`input`, `hidden`);
      this.urlPreventLoad.setAttribute(`id`, `urlPreventLoad`);
      this.urlPreventLoad.setAttribute(`type`, `checkbox`);
      this.urlPreventLoad.checked = (Brain.read(`__GLOBAL__.onlyStartHashtag`, `0`)==`1`)?true:false;
      this.urlPreventLoad.addEventListener(`change`, () => {Brain.write(`__GLOBAL__.onlyStartHashtag`, (this.urlPreventLoad.checked==true)?`1`:`0`);}, true);
      this.urlPreventLoad_label = main.tools.createElement(`label`, `button center`, `Start-URL`);
      this.urlPreventLoad_label.setAttribute(`for`, `urlPreventLoad`);
      this.urlPreventLoad_label.setAttribute(`title`, `Ist diese Option aktiviert, wird der Bot in weiteren Tabs außer dem Start-Tab deaktiviert.`);
      /* ENDREGION */
      /* REGION " MINITAB FIX " */
      this.wsmfixtoggle = main.tools.createElement(`input`, `hidden`);
      this.wsmfixtoggle.setAttribute(`id`, `wsmfixtoggle`);
      this.wsmfixtoggle.setAttribute(`type`, `checkbox`);
      this.wsmfixtoggle.checked = (Brain.read(`__GLOBAL__.WSMFIX`, `1`)==`1`)?true:false;
      this.wsmfixtoggle.addEventListener(`change`, () => {
        if(this.wsmfixtoggle.checked) {
          main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(`/*WSMFIX*/`, main.config.defaults.widescreenModuleFix);
        } else {
          main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(main.config.defaults.widescreenModuleFix, `/*WSMFIX*/`);
        }
        Brain.write(`__GLOBAL__.WSMFIX`, (this.wsmfixtoggle.checked)?`1`:`0`);
      }, true);
      this.wsmfixtoggle_label = main.tools.createElement(`label`, `button center`, `Minitab-Fix`);
      this.wsmfixtoggle_label.setAttribute(`for`, `wsmfixtoggle`);
      this.wsmfixtoggle_label.setAttribute(`title`, `Ist diese Option aktiviert, wird ein kleiner Fehler bei der Positionierung des Botfensters gefixed.`);
      /* ENDREGION */
      /* REGION " SCROLLABLE TABS " */
      this.scrollableTabsFixtoggle = main.tools.createElement(`input`, `hidden`);
      this.scrollableTabsFixtoggle.setAttribute(`id`, `scrollableTabsFix`);
      this.scrollableTabsFixtoggle.setAttribute(`type`, `checkbox`);
      this.scrollableTabsFixtoggle.checked = (Brain.read(`__GLOBAL__.scrollableTabsFix`, `0`)==`1`)?true:false;
      this.scrollableTabsFixtoggle.addEventListener(`change`, () => {
        if(this.scrollableTabsFixtoggle.checked) {
          main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(`/*scrollableTabsFix*/`, main.config.defaults.scrollableTabsFix);
        } else {
          main.config.maincss.innerHTML = main.config.maincss.innerHTML.replace(main.config.defaults.scrollableTabsFix, `/*scrollableTabsFix*/`);
        }
        Brain.write(`__GLOBAL__.scrollableTabsFix`, (this.scrollableTabsFixtoggle.checked)?`1`:`0`);
      }, true);
      this.scrollableTabsFixtoggle_label = main.tools.createElement(`label`, `button center`, `Scrollbare Tab-Anzeige`);
      this.scrollableTabsFixtoggle_label.setAttribute(`for`, `scrollableTabsFix`);
      this.scrollableTabsFixtoggle_label.setAttribute(`title`, `Ist diese Option aktiviert, werden die Tab-Listen verkleinert und Scrollbar gemacht.`);
      /* ENDREGION */
      /* REGION " COLOR FORMAT " */
      this.colorFormatSetting_label = main.tools.createElement(`div`, ``, `Farbcode-Format:`);
      this.colorFormatSetting_label.style.display = `inline-block`;
      this.colorFormatSetting_label.style.width = `CALC(35% - 10px)`;
      this.colorFormatSetting_label.style.boxSizing = `border-box`;
      this.colorFormatSetting_label.style.padding = `10px`;

      this.colorFormatSetting = main.tools.createElement(`select`, `button`);
      this.colorFormatSetting.style.display = `inline-block`;
      this.colorFormatSetting.style.width = `CALC(65% - 10px)`;
      this.colorFormatSetting.addEventListener(`change`, () => {
        Brain.write(`__GLOBAL__.colorFormat`, this.colorFormatSetting.value);
      }, true);

      (async () => {
        let availableSettings = [
          `$\{r}-$\{g}-$\{b}`,
          `$\{RR}-$\{GG}-$\{BB}`,
          `$\{Hex}`,
          `$\{RR}$\{GG}$\{BB}`,
          `$\{r}-$\{g}`,
          `$\{RR}-$\{GG}`,
          `$\{RR}$\{GG}`,
          `$\{r}-$\{b}`,
          `$\{RR}-$\{BB}`,
          `$\{RR}$\{BB}`,
          `$\{g}-$\{b}`,
          `$\{GG}-$\{BB}`,
          `$\{GG}$\{BB}`,
          `$\{r}`,
          `$\{RR}`,
          `$\{g}`,
          `$\{GG}`,
          `$\{b}`,
          `$\{BB}`,
        ];
        let curConfig = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
        for(let colorFormatIndex in availableSettings) {
          let colorFormatObject = availableSettings[colorFormatIndex];
          let title = `${colorFormatObject} (Beispiel: ${(new Clr(128, 255, 0)).toFormattedString(colorFormatObject)})`;
          let colorFormatEntry = main.tools.createElement(`option`, ``, title).to(this.colorFormatSetting);
          colorFormatEntry.setAttribute(`value`, colorFormatObject);
          if(colorFormatObject == curConfig) colorFormatEntry.setAttribute(`selected`, ``);
          colorFormatEntry.style.textAlign = `left`;
        }
      })();
      /* ENDREGION */
      /* REGION " WORKER NAME " */
      let currentWorkerName = Brain.read(`__GLOBAL__.workerName`, `Arbeiter`);
      this.workerNameSetting_label = main.tools.createElement(`div`, ``, `Arbeiter-Name:`);
      this.workerNameSetting_label.css({
        width: `CALC(35% - 10px)`,
        display: `inline-block`,
        boxSizing: `border-box`,
        padding: `10px`,
      })
      this.workerNameSetting = main.tools.createElement(`input`, `button`);
      this.workerNameSetting.style.width = `CALC(65% - 10px)`;
      this.workerNameSetting.style.display = `inline-block`;
      this.workerNameSetting.setAttribute(`type`, `text`);
      this.workerNameSetting.setAttribute(`value`, currentWorkerName);
      this.workerNameSetting.setAttribute(`placeholder`, `Arbeiter`);
      this.workerNameSetting.addEventListener(`blur`, () => {
        let val = this.workerNameSetting.value;
        val = (val==``)?`Arbeiter`:val;
        Brain.write(`__GLOBAL__.workerName`, val);
        main.worker.boxTitle.innerHTML = val;
      }, true);
      /* ENDREGION */
      /* REGION " NAME TYPE SELECTOR " */
      this.onNameSwitch = async () => {
        Brain.write(`__GLOBAL__.nameConfig`, this.nameTypeSelector.value);
        let curNameConfig = Brain.read(`__GLOBAL__.nameConfig`, `mixed/short/`);
        this.namePreview.innerHTML = `Lade beispiele ...`;
        await main.tools.nameGenerator();
        this.namePreview.innerHTML = main.config.leftNames[`${curNameConfig}`].slice(0, 8).join(`, `);
      }

      this.nameTypeSelector_label = main.tools.createElement(`div`, ``, `Zufallsnamen-Generator`);
      this.nameTypeSelector_label.style.display = `inline-block`;
      this.nameTypeSelector_label.style.width = `CALC(35% - 10px)`;
      this.nameTypeSelector_label.style.boxSizing = `border-box`;
      this.nameTypeSelector_label.style.padding = `10px`;

      this.nameTypeSelector = main.tools.createElement(`select`, `button`);
      this.nameTypeSelector.style.display = `inline-block`;
      this.nameTypeSelector.style.width = `CALC(65% - 10px)`;
      this.nameTypeSelector.addEventListener(`change`, this.onNameSwitch, true);

      let curNameConfig = Brain.read(`__GLOBAL__.nameConfig`, `mixed/short/`);

      main.config.defaults.nameGeneratorTypes.forEach((entry)=>{
        let element = main.tools.createElement(`option`, ``, entry.name);
        element.setAttribute(`value`, entry.value);
        if(curNameConfig == entry.value) {
          element.setAttribute(`selected`, `selected`);
        }
        this.nameTypeSelector.in(element);
      })

      this.namePreview = main.tools.createElement(`div`, `center`, ``);
      this.onNameSwitch();
      /* ENDREGION */
      /* REGION " AUTORUNNER DELAY " */
      this.autorunnerDelay_label = main.tools.createElement(`div`, ``, `Autorunner-Delay`);
      this.autorunnerDelay_label.style.display = `inline-block`;
      this.autorunnerDelay_label.style.width = `CALC(35% - 10px)`;
      this.autorunnerDelay_label.style.boxSizing = `border-box`;
      this.autorunnerDelay_label.style.padding = `10px`;

      this.autorunnerDelay = main.tools.createElement(`input`, `button`, ``);
      this.autorunnerDelay.style.display = `inline-block`;
      this.autorunnerDelay.style.width = `CALC(65% - 60px)`;
      this.autorunnerDelay.setAttribute(`type`, `number`);
      this.autorunnerDelay.setAttribute(`value`, Brain.read(`__GLOBAL__.reruntimer_save`, 900));
      this.autorunnerDelay.setAttribute(`min`, `15`);
      this.autorunnerDelay.setAttribute(`max`, `86400`);
      this.autorunnerDelay.addEventListener(`change`, ()=>{
        Brain.write(`__GLOBAL__.reruntimer_save`, Math.min(86400, Math.max(15, this.autorunnerDelay.value)));
      }, true);

      this.autorunnerDelay_label2 = main.tools.createElement(`div`, ``, `Sek.`);
      this.autorunnerDelay_label2.style.display = `inline-block`;
      this.autorunnerDelay_label2.style.width = `40px`;
      this.autorunnerDelay_label2.style.boxSizing = `border-box`;
      this.autorunnerDelay_label2.style.padding = `10px`;
      /* ENDREGION */
      /* REGION " DARK MODE SELECTION " */
      this.darkModeSetting_label = main.tools.createElement(`div`, ``, `Darkmode:`);
      this.darkModeSetting_label.css({
        display: `inline-block`,
        width: `CALC(35% - 10px)`,
        boxSizing: `border-box`,
        padding: `10px`,
      });

      this.darkModeSetting = main.tools.createElement(`select`, `button`);
      this.darkModeSetting.css({
        display: `inline-block`,
        width: `CALC(65% - 10px)`,
      });

      this.darkModeSetting.addEventListener(`change`, () => {
        BetterBrain.useDarkMode = this.darkModeSetting.selectedIndex - 0;
        let darkmode = false;
        document.querySelectorAll(`link`).forEach(n=>{
          if(n.href.indexOf(`darkmode.css`) > -1) {
            darkmode = true;
          }
        });
        if((darkmode || BetterBrain.useDarkMode == `1`) && BetterBrain.useDarkMode != 2) {
          main.config.darkModeStyle.innerHTML = main.config.defaults.darkModeStyle;
        } else {
          main.config.darkModeStyle.innerHTML = ``;
        }
      }, true);
      let darkModeSetting_default = main.tools.createElement(`option`, ``, `Standard`).to(this.darkModeSetting);
      if(BetterBrain.useDarkMode == 0) darkModeSetting_default.setAttribute(`selected`, ``);
      let darkModeSetting_dark = main.tools.createElement(`option`, ``, `Dark`).to(this.darkModeSetting);
      if(BetterBrain.useDarkMode == 1) darkModeSetting_dark.setAttribute(`selected`, ``);
      let darkModeSetting_bright = main.tools.createElement(`option`, ``, `Bright`).to(this.darkModeSetting);
      if(BetterBrain.useDarkMode == 2) darkModeSetting_bright.setAttribute(`selected`, ``);
      /* ENDREGION */
      /* REGION " RAPTOR SECURITY TIMEOUT SKIP " */
      this.raptorSkipSecurityTimeouts = main.tools.createElement(`input`, `hidden`);
      this.raptorSkipSecurityTimeouts.setAttribute(`id`, `raptorSkipST`);
      this.raptorSkipSecurityTimeouts.setAttribute(`type`, `checkbox`);
      this.raptorSkipSecurityTimeouts.checked = (BetterBrain.skipRaptorSecurityTimeouts || false);
      this.raptorSkipSecurityTimeouts.addEventListener(`change`, () => {
        BetterBrain.skipRaptorSecurityTimeouts = this.raptorSkipSecurityTimeouts.checked;
      }, true);
      this.raptorSkipSecurityTimeouts_label = main.tools.createElement(`label`, `button center`, `Raptor ohne Timeouts`);
      this.raptorSkipSecurityTimeouts_label.setAttribute(`for`, `raptorSkipST`);
      this.raptorSkipSecurityTimeouts_label.setAttribute(`title`, `Ist diese Option aktiviert, wird nicht mehr gewartet, bis die Buttons im Oviraptor freigeschaltet sind.`);
      /* ENDREGION */

      /* Tab-Aktionen */
      this.content.in(this.enclosureActionsToggl);
      this.content.in(this.enclosureActionsToggl_label);
      this.enclosureActionsToggl_label.style.width = `CALC(25% - 10px)`;
      this.enclosureActionsToggl_label.style.display = `inline-block`;

      /* Breed-Hack */
      this.content.in(this.breedhacktoggle);
      this.content.in(this.breedhacktoggle_label);
      this.breedhacktoggle_label.style.width = `CALC(25% - 10px)`;
      this.breedhacktoggle_label.style.display = `inline-block`;

      /* Start-URL */
      this.content.in(this.urlPreventLoad);
      this.content.in(this.urlPreventLoad_label);
      this.urlPreventLoad_label.style.width = `CALC(25% - 10px)`;
      this.urlPreventLoad_label.style.display = `inline-block`;

      /* Breitbild */
      this.content.in(this.widescreenfixtoggle);
      this.content.in(this.widescreenfixtoggle_label);
      this.widescreenfixtoggle_label.style.width = `CALC(25% - 10px)`;
      this.widescreenfixtoggle_label.style.display = `inline-block`;

      /* Minitab-Fix */
      this.content.in(this.wsmfixtoggle);
      this.content.in(this.wsmfixtoggle_label);
      this.wsmfixtoggle_label.style.width = `CALC(25% - 10px)`;
      this.wsmfixtoggle_label.style.display = `inline-block`;

      /* Scrollbare Tabs */
      this.content.in(this.scrollableTabsFixtoggle);
      this.content.in(this.scrollableTabsFixtoggle_label);
      this.scrollableTabsFixtoggle_label.style.width = `CALC(25% - 10px)`;
      this.scrollableTabsFixtoggle_label.style.display = `inline-block`;

      /* Tabs im Blocksatz */
      this.content.in(this.justifyTabsToggle);
      this.content.in(this.justifyTabsToggle_label);
      this.justifyTabsToggle_label.style.width = `CALC(25% - 10px)`;
      this.justifyTabsToggle_label.style.display = `inline-block`;

      /* Raptor ohne Timeouts */
      this.content.in(this.raptorSkipSecurityTimeouts);
      this.content.in(this.raptorSkipSecurityTimeouts_label);
      this.raptorSkipSecurityTimeouts_label.style.width = `CALC(25% - 10px)`;
      this.raptorSkipSecurityTimeouts_label.style.display = `inline-block`;

      /* Debug-Modus */
      this.content.in(this.userDebugCheckbox);
      this.content.in(this.userDebugCheckbox_label);
      this.userDebugCheckbox_label.style.width = `CALC(25% - 10px)`;
      this.userDebugCheckbox_label.style.display = `inline-block`;

      /* LoadParents */
      this.content.in(this.userLoadParents);
      this.content.in(this.userLoadParents_label);
      this.userLoadParents_label.style.width = `CALC(25% - 10px)`;
      this.userLoadParents_label.style.display = `inline-block`;

      let breaker = main.tools.createElement(`br`, ``);
      breaker.style.clear = `both`;
      this.content.in(breaker);

      this.content.in(this.textes.panelwidth);
      this.content.in(this.panelWidthConfigurator.box);

      breaker = main.tools.createElement(`br`, ``);
      breaker.style.clear = `both`;
      this.content.in(breaker);

      /* Style-Select */
      this.content.in(this.tabstyleselect_label);
      this.content.in(this.tabstyleselect);

      breaker = main.tools.createElement(`br`, ``);
      breaker.style.clear = `both`;
      this.content.in(breaker);

      this.content.in(this.darkModeSetting_label);
      this.content.in(this.darkModeSetting);

      this.content.in(this.autorunnerDelay_label);
      this.content.in(this.autorunnerDelay);
      this.content.in(this.autorunnerDelay_label2);

      this.content.in(this.colorFormatSetting_label);
      this.content.in(this.colorFormatSetting);

      this.content.in(this.workerNameSetting_label);
      this.content.in(this.workerNameSetting);

      this.content.in(this.nameTypeSelector_label);
      this.content.in(this.nameTypeSelector);

      document.body.in(this.box);
    }
    __save () {
      this.box.classList.remove(`visible`);
      this.box.classList.add(`hidden`);
    }
  }

  class VarsInputHelperWindow {
    constructor() {
      this.currentTarget = null;

      this.box = main.tools.createElement(`div`, `ovipets_dialogue hidden`);
      this.box.css({height:`475px`,minWidth:`500px`});

      this.buttons = {};
      this.buttons.save = main.tools.createElement(`div`, `button okaybutton`, `Schließen`).to(this.box);
      this.buttons.save.addEventListener(`click`, () => {
        this.box.classList.remove(`visible`);
        this.box.classList.add(`hidden`);
      }, true);

      this.content = main.tools.createElement(`div`, `catbox`).to(this.box);
      this.content.style.overflow = `scroll`;

      for(let presetIterator in main.config.namerVars) {
        let presetObject = main.config.namerVars[presetIterator];

        let b = main.tools.createElement(`div`);

        let t = main.tools.createElement(`div`, `button`, presetObject.desc);
        t.css({
          textAlign: `right`,
          width: `CALC(55% - 0px)`,
          height: `44px`,
          display: `inline-block`,
          boxShadow: `none`,
          border: `none`,
          padding: `10px`,
          marginRight: `0px`,
        });

        let o = main.tools.createElement(`pre`, `button`, presetObject.code);
        o.css({
          fontFamily: `Lucida Console, Courier New, monospace`,
          fontWeight: `normal`,
          textAlign: `center`,
          width: `CALC(45% - 20px)`,
          height: `44px`,
          paddingTop: `8px`,
          display: `inline-block`,
        });

        o.addEventListener(`click`, (e) => {
          if(this.currentTarget != null) {
            this.currentTarget.value = this.currentTarget.value + presetObject.code;
            this.currentTarget.focus();
            main.tools.createSelection(this.currentTarget, this.currentTarget.value.length, this.currentTarget.value.length);
          }
        }, true);

        this.content.in(b.in(t).in(o));
      }
      document.body.in(this.box);
    }
  }
  class ListsWindow {
    constructor() {
      this.box = main.tools.createElement(`div`, `ovipets_dialogue hidden`);
      this.box.style.height = `275px`;
      this.box.style.minWidth = `500px`;

      this.buttons = {};
      this.buttons.save = main.tools.createElement(`div`, `button okaybutton`, `Schließen`);
      this.buttons.save.addEventListener(`click`, () => {
        this.box.classList.remove(`visible`);
        this.box.classList.add(`hidden`);
      }, true);

      let eggBlacklistConfig = Brain.read(`Egger.blacklist`, ``).match(/\d+/g);
      if(eggBlacklistConfig == null) eggBlacklistConfig = ``;
      this.blacklist = main.tools.createElement(`textarea`, `button`, eggBlacklistConfig);
      this.blacklist.style.whiteSpace = `pre`;
      this.blacklist.style.boxSizing = `border-box`;
      this.blacklist.placeholder = `Die ID's der Nutzer, die vom Eier-Wender ignoriert werden sollen. Getrennt durch Komma.\nBeispiel: 12345, 678, 898765`;
      this.blacklist.style.width = `CALC(100% - 10px)`;
      this.blacklist.style.height = `CALC(100% - 10px)`;
      this.blacklist.style.resize = `none`;
      this.blacklist.style.whiteSpace = `normal`;
      this.blacklist.addEventListener(`change`, () => {
        let r = this.blacklist.value.match(/\d+/g);
        if(r == null) r = [];
        Brain.write(`Egger.blacklist`, r.join(`, `));
      }, true);

      this.content = main.tools.createElement(`div`, `catbox`);

      this.content.in(this.blacklist);

      this.box.in(this.buttons.save);
      this.box.in(this.content);

      document.body.in(this.box);
    }
  }

  class Worker {
    constructor () {
      this.boxprogressUpdate = this.__boxprogressUpdate.bind(this);
      this.addBunch = this.__addBunch.bind(this);
      this.add = this.__add.bind(this);
      this.initializeRestart = this.__initializeRestart.bind(this);
      this.cancelAllWorks = this.__cancelAllWorks.bind(this);

      main.tools.createBox(this, Brain.read(`__GLOBAL__.workerName`, `Arbeiter`), `Worker`);
      this.box.classList.add(`box_Worker`);

      this.targetWorker = 0;
      this.workerElements = [];
      for(let workerIndex = 0;workerIndex < 2;workerIndex++) {
        this.workerElements[workerIndex] = new WorkerElement(workerIndex);
      }

      this.box.in(this.boxTitle);
      this.box.in(this.boxprogress.element);
      for(let workerElementIndex in this.workerElements) {
        this.box.in(this.workerElements[workerElementIndex].box);
      }
    }
    async __initializeRestart() {
      if(this.state == 0) {
        main.autorunner.initializeRestart(false);
      }
    }
    get works() {
      let result = [];
      this.workerElements.forEach(workerElement=>{result=[...result, ...workerElement.works];});
      return(result);
    }
    get state() {
      let result = 0;
      let activeThreads = 0;
      this.workerElements.forEach(workerElement=>{if(workerElement.active) activeThreads++;});
      result = (activeThreads == this.workerElements.length)?2:((activeThreads==0)?0:1);
      return result;
    }
    async __addBunch (newworks, prior, targetWorker) {
      if(typeof targetWorker !== `undefined`) this.targetWorker = parseInt(targetWorker);
      this.workerElements[this.targetWorker].addWorks(newworks, prior || false);
      this.workerElements[this.targetWorker].toggleState();
      if(targetWorker === undefined) {
        this.targetWorker = (this.targetWorker + 1) % this.workerElements.length;
      }
    }
    async __add (work) {
      this.targetWorker = targetWorker || this.targetWorker;
      this.workerElements[this.targetWorker].addWorks([work], false);
      this.workerElements[this.targetWorker].toggleState();
      if(targetWorker === undefined) {
        this.targetWorker = (this.targetWorker + 1) % this.workerElements.length;
      }
    }
    async __boxprogressUpdate() {
      let fullAmount = 0;
      let currentAmount = 0;
      this.workerElements.forEach(wrk=>{
        fullAmount += wrk.amount;
        currentAmount += parseInt(wrk.stateProgress.element.getAttribute(`data-current`));
      });
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, Math.max(1, fullAmount));
      this.boxprogress.setValue(currentAmount);
    }
    __cancelAllWorks() {
      for(let worker_iterator in this.workerElements) {
        let worker = this.workerElements[worker_iterator];
        worker.stop();
      }
    }
  }
  class AutoRunner {
    constructor () {
      this.box = main.tools.createElement(`div`, `hidden`);
      this.restartTimer = null;

      this.initializeRestart = this.__initializeRestart.bind(this);
    }
    __initializeRestart(quick) {
      quick = quick || false;
      if(main.autorunner.restartTimer == null && main.boxes.autorunnerToggle.checked) {
        let tm = (quick==true)?2000:Brain.read(`__GLOBAL__.reruntimer_save`, 900) * 1000;
        logs(`[AutoRunner.__initializeRestart] > `, `Auto-runner fires in ${(tm / 1000)} Second${((tm / 1000)==1)?``:`s`} ...`);
        main.autorunner.restartTimer = setTimeout(() => {
          logs(`[AutoRunner.__initializeRestart] > `, `Auto-runner fires now`);
          main.autorunner.restartTimer = null;
          main.eggwalker.toggleState();
        }, tm);
      }
    }
  }

  class AutoAdopter {
    constructor () {
      this.progressbar = null;
      this.selectionbox = null;

      this.reset = this.__reset.bind(this);
      this.handleGrabbing = this.__handleGrabbing.bind(this);
      this.takeFriends = this.__takeFriends.bind(this);
      this.searchEverything = this.__searchEverything.bind(this);
      this.launchDefault = this.__handleInitialization.bind(this);

      main.tools.createBox(this, `Adopter`, `AutoAdopter`);
      this.box.classList.add(`box_AutoAdopter`);
      main.tools.createTargetSelectors(this, `adopter`);

      this.inputbox_filter = main.tools.createElement(`input`, `button`, ``);
      this.inputbox_filter.css({
        width: `CALC(100% - 65px)`,
        display: `inline-block`,
      })
      this.inputbox_filter.setAttribute(`type`, `text`);
      this.inputbox_filter.setAttribute(`placeholder`, `true`);
      this.inputbox_filter.setAttribute(`value`, Brain.read(`Adopter.filter`, ``))
      this.inputbox_filter.addEventListener(`change`, () => {
        Brain.write(`Adopter.filter`, this.inputbox_filter.value);
      }, true);

      [
        this.fullprio,
        this.fullprio_label
      ] = main.tools.createToggle(`Adopter_fullprio`, ``, () => {
        Brain.write(`Adopter.fullprio`, (this.fullprio.checked==true)?1:0);
      }, (Brain.read(`Adopter.fullprio`, 1)==1));
      this.fullprio_label.css({
        backgroundImage: `url(${main.config.defaults.fullprio})`,
        backgroundSize: `contain`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        display: `inline-block`,
        width: `45px`,
        marginBottom: `-10px`,
      })

      this.inputbox = main.tools.createElement(`input`, `button`);
      this.inputbox.css({width: `CALC(100% - 10px)`})
      this.inputbox.setAttribute(`type`, `number`);
      this.inputbox.setAttribute(`placeholder`, `UID`);

      this.initialize = main.tools.createElement(`div`, `button preventWrap`, `Starten`, null, this.launchDefault);
      this.initialize.css({
        display: `inline-block`,
        width: `CALC(100% - 10px)`,
      })
      this.takeall = main.tools.createElement(`div`, `button preventWrap`, `Alles finden`, null, this.searchEverything);
      this.takeall.css({
        display: `inline-block`,
        width: `CALC(100% - 10px)`,
      })

      this.box.in(this.boxTitle);
      this.box.in(this.workerTargetSelectors);
      this.box.in(this.boxprogress.element);
      this.box.in(this.inputbox);
      this.box.in(this.inputbox_filter);
      this.box.in(this.fullprio);
      this.box.in(this.fullprio_label);
      this.box.in(this.initialize);
      this.box.in(this.takeall);
    }
    async __takeFriends (limitLevel = 0, user = null, level = 0) {
      if(((new Date()).getTime() / 1000) - this.runTime > 15) {
        console.log("Time exeeded");
        return [];
      }
      if(user == null) user = main.user
      let friends = await user.getFriends();
      let blacklist = Brain.read(`Egger.blacklist`, ``).match(/\d+/g);
      if(blacklist != null) friends = friends.filter(friend=>!blacklist.contains(friend.toString()));
      if(level < limitLevel) {
        console.log(`Loading Sub-Friends inside Level ${level} of ${limitLevel}`)
        let friendLevelList = [];
        let friendsLevelEntries = friends.map((f) => {
          return new User(parseInt(f) || parseInt(f[0]));
        })
        if(blacklist != null) friendsLevelEntries = friendsLevelEntries.filter(friend=>!blacklist.contains(friend.toString()));
        for(let i = 0;i < friendsLevelEntries.length;i++) {
          console.log(`Loading Sub-Friends inside Level ${level} of ${limitLevel}`)
          friendLevelList = [...friendLevelList, ...(await this.takeFriends(limitLevel, friendsLevelEntries[i], level + 1))]
          await main.tools.sleep(5);
        }
        friends = [...friends, ...friendLevelList];
      }
      return Array.from(new Set(friends));
    }
    async __searchEverything () {
      let blacklist = Brain.read(`Egger.blacklist`, ``).match(/\d+/g);
      this.runTime = (new Date()).getTime() / 1000;
      let friends = await this.takeFriends(1);
      let adoptList = [`adopt`, `free`, `🆓`, `🏠`];
      this.progressbar = main.tools.createProgressbar(0, friends.length);
      this.progressbar.element.css({display: `inline-block`, width: `CALC(100% - 10px)`});
      this.progressbar.element.to(this.box);
      let tabs = await (new Promise((resolve, reject) => {
        let done = 0;
        let tabsInt = [];
        for(let indexFriend = 0;indexFriend < friends.length;indexFriend++) {
          let currentFriend = friends[indexFriend];
          Enclosures.getEnclosures(currentFriend).then((enclosures) => {
            enclosures.filter(encls => {if(adoptList.filter((entry) => {let result = false;if(encls.id.toString().toLowerCase() == entry.toString().toLowerCase()) {result = true;} else if(encls.name.toLowerCase().indexOf(entry.toString().toLowerCase()) > -1) {result = true;};return result;}).length > 0) return true; return false;})
            tabsInt = [...tabsInt, ...enclosures];
            done += 1;
            this.progressbar.setValue(done);
            console.log(tabsInt.length);
            if(done >= friends.length) resolve(tabsInt);
          })
        }
      }))
      this.progressbar.setValue(0);
      this.progressbar.element.setAttribute(`data-maximum`, tabs.length);
      let adoptablePets = await (new Promise((resolve, reject) => {
        let done = 0;
        let adoptablePetsInt = [];
        for(let indexTab = 0;indexTab < tabs.length;indexTab++) {
          let currentTab = tabs[indexTab];
          Enclosures.getPets(currentTab.id, currentTab.uid).then((extraPets) => {
            adoptablePetsInt = [
              ...adoptablePetsInt,
              ...extraPets
            ];
            done += 1;
            this.progressbar.setValue(done);
            console.log(done, tabs.length);
            if(done >= friends.length) resolve(adoptablePetsInt);
          });
        }
      }))
      console.log(adoptablePets);
      setTimeout(this.reset, 1500);
    }
    async __handleInitialization () {
      if(!this.initialize.classList.contains(`hidden`)) {
        if(this.progressbar !== null) {
          this.progressbar.element.remove();
          this.progressbar = null;
        }

        if((parseInt(this.inputbox.value) > 0) == false) {
          this.inputbox.focus();
          return;
        }

        this.initialize.classList.add(`hidden`);

        let uid = this.inputbox.value;

        this.selectionbox = await main.tools.createTabSelection(
          this.handleGrabbing,
          this.reset,
          uid,
          true,
          [
            `-1`,
            `Adopt`,
            `ADOPT`,
            `adopt`
          ]
        );

        this.box.in(this.selectionbox);
      }
    }
    async __handleGrabbing (entries) {
      if(entries.length > 0) {
        let adoptablePets = [];

        this.progressbar = main.tools.createProgressbar(0, entries.length);
        this.progressbar.element.css({
          display: `inline-block`,
          width: `CALC(100% - 10px)`
        });
        this.progressbar.element.to(this.box);

        for(let entryIndex = 0;entryIndex < entries.length;entryIndex++) {
          let entriesEntry = entries[entryIndex];
          let extraPets = await Enclosures.getPets(entriesEntry.id, entriesEntry.uid);
          this.progressbar.increase();
          adoptablePets = [
            ...adoptablePets,
            ...extraPets
          ];
        }
        if(adoptablePets.length > 0) {
          adoptablePets = adoptablePets.map(
            p => {
              let f = new Work(
                new Pet(p.id, true, p.uid),
                `adoptWithFilter`,
                [
                  (this.inputbox_filter.value!=``)?this.inputbox_filter.value:`true`
                ],
                `Adoptiere Pet ${p.id}`
              );
              f.skipOnFail=true;
              return f;
            }
          );

          let targetWorker = -1;

          this.workerTargetSelectorsCheckboxes.forEach(n=>{
            if(n.checkbox.checked) targetWorker = parseInt(n.checkbox.getAttribute(`value`));
          });

          if(targetWorker > -1) {
            main.worker.addBunch(adoptablePets, this.fullprio.checked, targetWorker);
          } else {
            main.worker.addBunch(adoptablePets, this.fullprio.checked);
          }
        }
        setTimeout(this.reset, 1500);
      }
    }
    async __reset () {
      try{this.selectionbox.remove();}catch(e){}
      try{this.progressbar.element.remove();}catch(e){}
      this.progressbar = null;
      this.selectionbox = null;
      this.initialize.classList.remove(`hidden`);
    }
  }
  class JumboSchreiner {
    constructor () {
      this.reset = this.__reset.bind(this);
      this.launch = this.__launch.bind(this);
      this.handleFeeding = this.__handleFeeding.bind(this);
      this.handToWorkers = this.__handToWorkers.bind(this);

      main.tools.createBox(this, `Kantine`, `JumboSchreiner`);
      this.box.classList.add(`box_JumboSchreiner`);
      main.tools.createTargetSelectors(this, `feeder`);

      this.inputbox_filter = main.tools.createElement(`input`, `button`, ``);
      this.inputbox_filter.css({
        width: `CALC(100% - 65px)`,
        display: `inline-block`,
      })
      this.inputbox_filter.setAttribute(`type`, `text`);
      this.inputbox_filter.setAttribute(`placeholder`, `true`);
      this.inputbox_filter.setAttribute(`value`, Brain.read(`Feeder.filter`, ``))
      this.inputbox_filter.addEventListener(`change`, () => {
        Brain.write(`Feeder.filter`, this.inputbox_filter.value);
      }, true);

      this.start = main.tools.createElement(`div`, `button preventWrap`, `Starten`, null, this.launch);
      this.start.style.display = `inline-block`;
      this.start.style.width = `CALC(100% - 10px)`;

      [this.fullprio, this.fullprio_label] = main.tools.createToggle(`Feeder_fullprio`, ``, () => {
        Brain.write(`Feeder.fullprio`, (this.fullprio.checked==true)?1:0);
      }, (Brain.read(`Feeder.fullprio`, 1)==1));
      this.fullprio_label.css({
        backgroundImage: `url(${main.config.defaults.fullprio})`,
        backgroundSize: `contain`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        display: `inline-block`,
        width: `45px`,
        marginBottom: `-10px`,
      })

      this.box.in(this.boxTitle);
      this.box.in(this.workerTargetSelectors);
      this.box.in(this.boxprogress.element);
      this.box.in(this.inputbox_filter);
      this.box.in(this.fullprio);
      this.box.in(this.fullprio_label);
      this.box.in(this.start);
    }
    async __reset() {
      this.start.classList.remove(`hidden`);
      try {this.selectionbox.remove();} catch(e) {}
      this.selectionbox = null;
      this.boxprogress.setValue(0);
    }
    async __launch() {
      this.start.classList.add(`hidden`);
      this.selectionbox = await main.tools.createTabSelection(
        this.handleFeeding,
        this.reset,
        -1,
        false,
        true
      );
      this.box.in(this.selectionbox);
    }
    async __handleFeeding(selectedEnclosures) {
      let collectedPets = [];
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, selectedEnclosures.length);
      for(let i = 0;i < selectedEnclosures.length;i++) {
        let pets = await Enclosures.getPetsAll(selectedEnclosures[i].id);
        collectedPets = [...collectedPets, ...pets];
        this.boxprogress.increase();
      }
      await this.handToWorkers(collectedPets);
      setTimeout(this.reset, 1500);
    }
    async __handToWorkers(pets) {
      let works = pets.map(pet=>new Work(new Pet(pet.id), `feedit`, [this.inputbox_filter.value], `Pet #${pet.id} füttern`));
      if(works.length > 0) {
        let targetWorker = -1;
        this.workerTargetSelectorsCheckboxes.forEach(n=>{
          if(n.checkbox.checked) targetWorker = parseInt(n.checkbox.getAttribute(`value`));
        });
        if(targetWorker > -1) {
          main.worker.addBunch(works, this.fullprio.checked, targetWorker);
        } else {
          main.worker.addBunch(works, this.fullprio.checked);
        }
      }
    }
  }
  class Namer {
    constructor() {
      /* REGION " BINDINGS " */
      this.toggleState = this.__toggleState.bind(this);
      this.basedOnRule = this.__basedOnRule.bind(this);
      this.internalNamer = this.__internalNamer.bind(this);
      this.initializeTestRule = this.__initializeTestRule.bind(this);
      this.getCurrentPID = this.__getCurrentPID.bind(this);
      this.handleNaming = this.__handleNaming.bind(this);
      this.lock = this.__lock.bind(this);
      this.clear = this.__clear.bind(this);
      this.reset = this.__reset.bind(this);
      this.filterPets = this.__filterPets.bind(this);
      this.handToWorkers = this.__handToWorkers.bind(this);
      this.openSpeciesSelector = this.__openSpeciesSelector.bind(this);
      /* ENDREGION */
      /* REGION " BOX " */
      main.tools.createBox(this, `Namer`, `Namer`);
      this.box.classList.add(`box_Namer`);
      main.tools.createTargetSelectors(this, `namer`);
      /* ENDREGION */
      /* REGION " START BUTTON " */
      this.start = main.tools.createElement(`div`, `button preventWrap`, `Starten`);
      this.start.addEventListener(`click`, this.toggleState, true);
      this.start.css({
        display: `inline-block`,
        width: `CALC(70% - 65px)`,
      });
      /* ENDREGION */
      /* REGION " TEST BUTTON " */
      this.testPet = main.tools.createElement(`div`, `button preventWrap`, `Testen ...`);
      this.testPet.addEventListener(`click`, this.initializeTestRule, true);
      this.testPet.css({
        display: `inline-block`,
        width: `CALC(30% - 10px)`,
      });
      /* ENDREGION */
      /* REGION " SPECIES SELECTOR BUTTON " */
      this.speciesSelectorWrapper = main.tools.createElement(`div`, ``, ``);
      this.speciesSelector = main.tools.createElement(`div`, `button preventWrap`, `Spezies-Filter einstellen`);
      this.speciesSelector.addEventListener(`click`, this.openSpeciesSelector, true);
      /* ENDREGION */
      /* REGION " RULE SELECTOR " */
      this.renameRuleSelectorText = main.tools.createElement(`div`, `slim`, `Maske:`);
      this.renameRuleSelectorText.css({
        display: `inline-block`,
        width: `60px`,
      });

      this.renameRuleSelector = main.tools.createElement(`select`, `button center`);
      this.renameRuleSelector.css({
        display: `inline-block`,
        width: `CALC(100% - 220px)`,
      });
      this.renameRuleSelector.addEventListener(`change`, () => {
        BetterBrain.namer_selectedRule = this.renameRuleSelector.selectedIndex;
        if(this.renameRuleSelector.selectedIndex == 0) {
          this.customNameInput.classList.remove(`hidden`);
        } else {
          this.customNameInput.classList.add(`hidden`);
        }
      }, true);
      /* ENDREGION */
      /* REGION " CUSTOM CODE INPUT " */
      let customNameSetting = BetterBrain.namer_selectedRuleCode || Brain.read(`Namer.customNamerName`, ``);

      this.customNameInput = main.tools.createElement(`textarea`, `button hidden`);
      this.customNameInput.css({
        whiteSpace: `pre`,
        display: `inline-block`,
        width: `CALC(100% - 10px)`,
        cursor: `inherit`,
        resize: `none`,
        height: `200px`,
        position: `relative`,
        boxSizing: `border-box`,
        overflow: `initial`,
        fontFamily: `Lucida Console, Courier New, mono-space`,
      })
      this.customNameInput.innerHTML = customNameSetting;
      this.customNameInput.setAttribute(`placeholder`, `Eigener Name`);
      this.customNameInput.setAttribute(`rows`, `20`);
      this.customNameInput.addEventListener(`change`, () => {
        BetterBrain.namer_selectedRuleCode = this.customNameInput.value;
      }, true);
      (async () => {
        let rng = await main.tools.nameGenerator();
        let curConfig = BetterBrain.namer_selectedRule || 0;
        for(let ruleIndex in main.config.renamerRules) {
          let rule = main.config.renamerRules[ruleIndex];
          if(rule == `$\{custom}`) {
            let ruleEntry = main.tools.createElement(`option`, ``, `Eingabe:`).to(this.renameRuleSelector);
            ruleEntry.setAttribute(`data-rule`, rule);
            if(ruleIndex == curConfig) ruleEntry.setAttribute(`selected`, ``);
          } else {
            let ruleEntry = main.tools.createElement(`option`, ``, rule).to(this.renameRuleSelector);
            ruleEntry.setAttribute(`data-rule`, rule);
            if(ruleIndex == curConfig) ruleEntry.setAttribute(`selected`, ``);
          }
        }
        if(curConfig == 0) {
          this.customNameInput.classList.remove(`hidden`);
        }
      })();
      /* ENDREGION */
      /* REGION " FULLPRIO " */
      [
        this.fullprio,
        this.fullprio_label
      ] = main.tools.createToggle(`namer_fullprio`, ``, () => {
        Brain.write(`Namer.fullprio`, (this.fullprio.checked==true)?1:0);
      }, (Brain.read(`Namer.fullprio`, 1)==1));
      this.fullprio_label.css({
        backgroundImage: `url(${main.config.defaults.fullprio})`,
        backgroundSize: `contain`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        display: `inline-block`,
        width: `45px`,
      });
      /* ENDREGION */
      /* REGION " FINISHING " */
      this.box.in(this.boxTitle);
      this.box.in(this.workerTargetSelectors);
      this.box.in(this.boxprogress.element);

      this.box.in(this.speciesSelectorWrapper);
      this.speciesSelectorWrapper.in(this.speciesSelector);

      this.box.in(this.renameRuleSelectorText);
      this.box.in(this.renameRuleSelector);

      this.box.in(this.customNameInput);

      this.box.in(this.start);
      this.box.in(this.testPet);

      this.box.in(this.fullprio);
      this.box.in(this.fullprio_label);
      /* ENDREGION */
    }

    async __lock() {
      this.speciesSelector.classList.add(`disabled`);
      this.start.classList.add(`disabled`);
      this.fullprio_label.classList.add(`disabled`);
      this.renameRuleSelector.classList.add(`disabled`);
      this.customNameInput.classList.add(`disabled`);
      this.testPet.classList.add(`disabled`);
      this.renameRuleSelectorText.classList.add(`disabled`);

      this.fullprio.setAttribute(`disabled`, `disabled`);
      this.renameRuleSelector.setAttribute(`disabled`, `disabled`);
      this.customNameInput.setAttribute(`disabled`, `disabled`);
      this.speciesSelector.setAttribute(`disabled`, `disabled`);
    }
    async __clear() {
      this.start.classList.remove(`disabled`);
      this.fullprio_label.classList.remove(`disabled`);
      this.renameRuleSelector.classList.remove(`disabled`);
      this.customNameInput.classList.remove(`disabled`);
      this.testPet.classList.remove(`disabled`);
      this.renameRuleSelectorText.classList.remove(`disabled`);
      this.speciesSelector.classList.remove(`disabled`);

      this.start.classList.add(`hidden`);
      this.fullprio_label.classList.add(`hidden`);
      this.renameRuleSelector.classList.add(`hidden`);
      this.customNameInput.classList.add(`hidden`);
      this.testPet.classList.add(`hidden`);
      this.renameRuleSelectorText.classList.add(`hidden`);
      this.speciesSelector.classList.add(`hidden`);

      this.fullprio.removeAttribute(`disabled`);
      this.renameRuleSelector.removeAttribute(`disabled`);
      this.customNameInput.removeAttribute(`disabled`);
      this.speciesSelector.removeAttribute(`disabled`);
    }
    async __reset() {
      this.start.classList.remove(`disabled`);
      this.fullprio_label.classList.remove(`disabled`);
      this.renameRuleSelector.classList.remove(`disabled`);
      this.customNameInput.classList.remove(`disabled`);
      this.testPet.classList.remove(`disabled`);
      this.renameRuleSelectorText.classList.remove(`disabled`);
      this.speciesSelector.classList.remove(`disabled`);

      this.start.classList.remove(`hidden`);
      this.fullprio_label.classList.remove(`hidden`);
      this.renameRuleSelector.classList.remove(`hidden`);
      this.customNameInput.classList.remove(`hidden`);
      this.testPet.classList.remove(`hidden`);
      this.renameRuleSelectorText.classList.remove(`hidden`);
      this.speciesSelector.classList.remove(`hidden`);

      this.fullprio.removeAttribute(`disabled`);
      this.renameRuleSelector.removeAttribute(`disabled`);
      this.customNameInput.removeAttribute(`disabled`);
      this.speciesSelector.removeAttribute(`disabled`);

      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, 1);
    }

    async __openSpeciesSelector () {
      this.speciesSelector.classList.add(`hidden`);
      let defaultSelection = true;
      if(BetterBrain.speciesSelector != "") defaultSelection = BetterBrain.speciesSelector;
      this.speciesSelectorList = await main.tools.createMultiSelection(main.config.defaults.speciesList, (elements) => {
        BetterBrain.speciesSelector = elements;
        this.speciesSelector.classList.remove(`hidden`);
      }, () => {}, defaultSelection, false);
      this.speciesSelectorWrapper.in(this.speciesSelectorList)
    }

    async __toggleState() {
      if(!this.start.classList.contains(`disabled`) && !this.start.classList.contains(`hidden`)) {
        this.lock();
        this.selectionbox = await main.tools.createTabSelection(
          this.handleNaming,
          this.reset,
          -1,
          true
        );
        this.clear();
        this.box.in(this.selectionbox);
      }
    }
    async __handleNaming(tabs) {
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, tabs.length);
      let tabLoader = new BunchLoader(
        tabs,
        async function (currentTab) {
          let petsInTab = await Enclosures.getPetsOnly(currentTab.id, currentTab.uid);
          this.result = [...this.result, ...petsInTab];
        },
        async (entries) => {await this.filterPets(entries, this.handToWorkers)},
        async (c,m)=>this.boxprogress.setValue(c)
      );
      tabLoader.result = [];
      tabLoader.collect();
    }
    async __filterPets (result, resultHandle, testphase = false) {
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, result.length);
      let petLoader = new BunchLoader(
        result,
        async function (entry) {
          if(this.test && this.result.length >= 40) return;
          let newPet = new Pet(entry.id, entry.uid);
          await newPet.load(true, false, true);
          let speciesFilterList = BetterBrain.speciesSelector;
          let handle = true;
          if(speciesFilterList != "") {
            let species = [newPet.species, false];
            if(species[0] == `Unbekannt`) species = await newPet.getSpecies();
            handle = speciesFilterList.includes(species[0]);
          }
          if(handle) {
            let targetName = await this.basedOnRule(newPet, this.code, false, true, `Namer`);
            let titleline = `Neuer Name für #${newPet.id}<br />${targetName}`;
            let entryWork = new Work(newPet, `setName`, [targetName], titleline);
            if(this.test || (newPet.__name != targetName && targetName != ``)) {
              this.result = [...this.result, entryWork];
            }
          }
        },
        resultHandle,
        (c,m)=>this.boxprogress.setValue(c)
      )
      petLoader.result = [];
      petLoader.basedOnRule = this.basedOnRule;
      petLoader.code = main.config.renamerRules[BetterBrain.selectedRule || 0];
      petLoader.test = testphase;
      if((BetterBrain.selectedRule || 0) == 0) petLoader.code = this.customNameInput.value;
      petLoader.collect();
    }
    async __handToWorkers (result) {
      this.boxprogress.setValue(0);
      let targetWorker = -1;
      this.workerTargetSelectorsCheckboxes.forEach(n=>{
        if(n.checkbox.checked) targetWorker = parseInt(n.checkbox.getAttribute(`value`));
      });
      if(targetWorker > -1) {
        main.worker.addBunch(result, this.fullprio.checked, targetWorker);
      } else {
        main.worker.addBunch(result, this.fullprio.checked);
      }
      this.reset();
    }
    async __basedOnRule(pet, rule, hasToLoad = true, loadRandomNames = true, module_name = `UNSET`) {
      if(hasToLoad) {
        return new Promise(async (resolve, revert) => {
          pet = (pet instanceof Pet)?pet:new Pet(pet.id);
          resolve(await this.internalNamer(pet, rule, hasToLoad, loadRandomNames, module_name));
        });
      } else {
        return await this.internalNamer(pet, rule, hasToLoad, loadRandomNames, module_name);
      }
    }
    async __internalNamer (pet, rule, hasToLoad, loadRandomNames, current_module) {
      pet = (pet instanceof Pet)?pet:new Pet(pet.id);
      let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);

      if((!pet.debug && pet.species == `Unbekannt`) || hasToLoad) await pet.load();

      let rng = (loadRandomNames)?(await main.tools.nameGenerator()):"UNNAMED";

      let species = pet.species;
      let gender = pet.gender;
      let genderFull = (pet.gender==`M`)?`Male`:`Female`;

      let isPure = (pet.pure==true)?`PURE`:``;
      let officialPure = (pet.opure==true)?`OPURE`:``;
      let inofficialPure = (pet.upure==true)?`UPURE`:``;

      let isGem = (pet.gem != ``)?`GEM`:``;

      let gemName = pet.gem;


      let gemNames = pet.gems.join(`, `);

      let hatched = pet.hatched;

      let colorLinking = (typeof main.config.colorLinks[species] != `undefined`)?main.config.colorLinks[species]:main.config.defaults.colorLink;
      let Farben = colorLinking.normal(pet.colors);
      let Color = colorLinking.hex(pet.colors);

      if(pet.debug) {
        let pc = pet.colors;
        Farben = {
          "Augen":    {"1": pc[ 0].toFormattedString(colorRule), "2": pc[ 1].toFormattedString(colorRule)},
          "Körper":   {"1": pc[ 2].toFormattedString(colorRule), "2": pc[ 3].toFormattedString(colorRule)},
          "Extras":   {"1": pc[ 4].toFormattedString(colorRule), "2": pc[ 5].toFormattedString(colorRule)},
          "Federn":   {"1": pc[ 6].toFormattedString(colorRule), "2": pc[ 7].toFormattedString(colorRule)},
          "Schuppen": {"1": pc[ 8].toFormattedString(colorRule), "2": pc[ 9].toFormattedString(colorRule)},
          "Flossen":  {"1": pc[10].toFormattedString(colorRule), "2": pc[11].toFormattedString(colorRule)},
        };
        Color = {
          "Augen":    {"1": pc[ 0].toHexString(), "2": pc[ 1].toHexString()},
          "Körper":   {"1": pc[ 2].toHexString(), "2": pc[ 3].toHexString()},
          "Extras":   {"1": pc[ 4].toHexString(), "2": pc[ 5].toHexString()},
          "Federn":   {"1": pc[ 6].toHexString(), "2": pc[ 7].toHexString()},
          "Schuppen": {"1": pc[ 8].toHexString(), "2": pc[ 9].toHexString()},
          "Flossen":  {"1": pc[10].toHexString(), "2": pc[11].toHexString()},
        };
      }

      rule = rule.toString().replace(/Augen\.1/gi,    `Augen[1]`   ).replace(/Augen\.2/gi,    `Augen[2]`   );
      rule = rule.toString().replace(/Körper\.1/gi,   `Körper[1]`  ).replace(/Körper\.2/gi,   `Körper[2]`  );
      rule = rule.toString().replace(/Extras\.1/gi,   `Extras[1]`  ).replace(/Extras\.2/gi,   `Extras[2]`  );
      rule = rule.toString().replace(/Federn\.1/gi,   `Federn[1]`  ).replace(/Federn\.2/gi,   `Federn[2]`  );
      rule = rule.toString().replace(/Schuppen\.1/gi, `Schuppen[1]`).replace(/Schuppen\.2/gi, `Schuppen[2]`);
      rule = rule.toString().replace(/Flossen\.1/gi,  `Flossen[1]` ).replace(/Flossen\.2/gi,  `Flossen[2]` );

      return eval(`\`${rule}\``);
    }
    async __initializeTestRule() {
      if(!this.testPet.classList.contains(`disabled`) && !this.testPet.classList.contains(`hidden`)) {
        this.boxprogress.setValue(0);
        this.lock();
        let pids = [];
        var rsl = [...document.querySelectorAll('div.ui-tabs div.ui-tabs-panel:not([aria-hidden="true"]) a.pet.name')];
        if(rsl.length > 0) {
          pids = rsl.map( (n) => { return {id: parseInt(n.href.substr(n.href.lastIndexOf(`=`) + 1)), uid: main.user.uid} } );
        }
        if(pids.length == 0) {
          let data = {id: await this.getCurrentPID(), uid: main.user.uid};
          if(data.id !== ``) {
            pids.push(data);
          }
        }
        let code = main.config.renamerRules[BetterBrain.selectedRule || 0];
        if((BetterBrain.selectedRule || 0) == 0) code = this.customNameInput.value;
        if(document.querySelector(`#unnamed ul.ui-sortable li`)) {
          pids = [...pids, ...[...document.querySelectorAll(`#unnamed ul.ui-sortable li`)].map(i=>{
            return {
              id: parseInt(i.id.substr(i.id.lastIndexOf(`_`) + 1)),
              uid: main.user.uid,
              owner: main.user.uid
            };
          })];
        }
        if(pids.length == 0) {
          let i = prompt(`Pet-ID`, ``);
          if(i !== null && i !== ``) pids.push({id: i, uid: main.user.uid});
        }
        if(pids.length > 0) {
          this.boxprogress.setValue(0);
          this.boxprogress.element.setAttribute(`data-maximum`, pids.length);
          await this.filterPets(pids, (rsl) => {
            this.boxprogress.setValue(0);
            alert(rsl.map(r=>r.t.replace(`<br />`, ` = `)).join(`\n`));
          }, true);
        }
        this.reset();
      }
    }
    async __getCurrentPID() {
      let pIMG = document.querySelector(`section#pet a img`);
      if(pIMG != null) {
        let url = pIMG.src;
        url = /\&pet=(\d+)\&mod/gi.exec(url);
        if(url != null) {
          return parseInt(url[1]);
        }
      }
      return ``;
    }
  }
  class Sorter {
    constructor () {
      this.handleSorting = this.__handleSorting.bind(this);
      this.toggleState = this.__toggleState.bind(this);
      this.presortPets = this.__presortPets.bind(this);
      this.calculateSorting = this.__calculateSorting.bind(this);
      this.handToWorkers = this.__handToWorkers.bind(this);
      this.reset = this.__reset.bind(this);
      this.previewWorks = this.__previewWorks.bind(this);

      main.tools.createBox(this, `Sorter`, `Sorter`);
      this.box.classList.add(`box_Sorter`);
      main.tools.createTargetSelectors(this, `sorter`);

      this.sorterRuleSelectorText = main.tools.createElement(`div`, `slim`, `Maske:`);
      this.sorterRuleSelectorText.css({
        display: `inline-block`,
        width: `60px`,
      });

      this.sorterRuleSelector = main.tools.createElement(`select`, `button center`);
      this.sorterRuleSelector.css({
        display: `inline-block`,
        width: `CALC(100% - 80px)`,
      })
      this.sorterRuleSelector.addEventListener(`change`, () => {
        Brain.write(`Sorter.selectedRule`, this.sorterRuleSelector.selectedIndex);
        if(this.sorterRuleSelector.selectedIndex == 0) {
          this.customSorterInput.classList.remove(`hidden`);
        } else {
          this.customSorterInput.classList.add(`hidden`);
        }
      }, true);

      this.customSorterInput = main.tools.createElement(`textarea`, `button hidden`, Brain.read(`Sorter.customSorterRule`, ``));
      this.customSorterInput.css({
        whiteSpace: `pre`,
        display: `inline-block`,
        width: `CALC(100% - 10px)`,
        cursor: `inherit`,
        resize: `none`,
        height: `200px`,
        position: `relative`,
        boxSizing: `border-box`,
        overflow: `initial`,
        fontFamily: `Lucida Console, Courier New, mono-space`,
      })
      this.customSorterInput.setAttribute(`placeholder`, `Eigene Sortier-Regelung`);
      this.customSorterInput.setAttribute(`rows`, `20`);
      this.customSorterInput.addEventListener(`change`, () => {
        Brain.write(`Sorter.customSorterRule`, this.customSorterInput.value);
      }, true);

      (async () => {
        let curConfig = Brain.read(`Sorter.selectedRule`, 0);
        for(let ruleIndex in main.config.renamerRules) {
          let rule = main.config.renamerRules[ruleIndex];
          if(rule == `$\{custom}`) {
            let ruleEntry = main.tools.createElement(`option`, ``, `Eingabe:`).to(this.sorterRuleSelector);
            ruleEntry.setAttribute(`data-rule`, rule);
            if(ruleIndex == curConfig) ruleEntry.setAttribute(`selected`, ``);
          } else {
            let ruleEntry = main.tools.createElement(`option`, ``, `${rule}`).to(this.sorterRuleSelector);
            ruleEntry.setAttribute(`data-rule`, rule);
            if(ruleIndex == curConfig) ruleEntry.setAttribute(`selected`, ``);
          }
          if(curConfig == 0) {
            this.customSorterInput.classList.remove(`hidden`);
          }
        }
      })();

      this.start = main.tools.createElement(`div`, `button preventWrap`, `Starten`);
      this.start.css({
        display: `inline-block`,
        width: `CALC(100% - 65px)`,
      })
      this.start.addEventListener(`click`, this.toggleState, true);

      [this.fullprio, this.fullprio_label] = main.tools.createToggle(`Sorter_fullprio`, ``, () => {
        Brain.write(`Sorter.fullprio`, (this.fullprio.checked==true)?1:0);
      }, (Brain.read(`Sorter.fullprio`, 1)==1));
      this.fullprio_label.css({
        backgroundImage: `url(${main.config.defaults.fullprio})`,
        backgroundSize: `contain`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        display: `inline-block`,
        width: `45px`,
      })

      this.box.in(this.boxTitle);
      this.box.in(this.workerTargetSelectors);
      this.box.in(this.boxprogress.element);

      this.box.in(this.sorterRuleSelectorText);
      this.box.in(this.sorterRuleSelector);

      this.box.in(this.customSorterInput);

      this.box.in(this.start);

      this.box.in(this.fullprio);
      this.box.in(this.fullprio_label);
    }
    async __reset() {
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, 1);

      this.sorterRuleSelector.classList.remove(`disabled`);
      this.customSorterInput.classList.remove(`disabled`);
      this.start.classList.remove(`disabled`);
      this.fullprio_label.classList.remove(`disabled`);

      this.sorterRuleSelector.removeAttribute(`disabled`);
      this.customSorterInput.removeAttribute(`disabled`);
      this.start.removeAttribute(`disabled`);
      this.fullprio.removeAttribute(`disabled`);

      this.sorterRuleSelectorText.classList.remove(`hidden`);
      this.sorterRuleSelector.classList.remove(`hidden`);
      this.customSorterInput.classList.remove(`hidden`);
      this.start.classList.remove(`hidden`);
      this.fullprio_label.classList.remove(`hidden`);
      try {if(this.place!=null)this.place.remove()} catch {};this.place=null;
    }
    async __toggleState () {
      this.sorterRuleSelector.classList.add(`disabled`);
      this.customSorterInput.classList.add(`disabled`);
      this.start.classList.add(`disabled`);
      this.fullprio_label.classList.add(`disabled`);

      this.sorterRuleSelector.setAttribute(`disabled`, `disabled`);
      this.customSorterInput.setAttribute(`disabled`, `disabled`);
      this.start.setAttribute(`disabled`, `disabled`);
      this.fullprio.setAttribute(`disabled`, `disabled`);

      this.selectionbox = await main.tools.createTabSelection(
        this.handleSorting,
        this.reset
        -1,
        true,
        false
      );
      this.box.in(this.selectionbox);

      this.sorterRuleSelector.classList.remove(`disabled`);
      this.customSorterInput.classList.remove(`disabled`);
      this.start.classList.remove(`disabled`);
      this.fullprio_label.classList.remove(`disabled`);

      this.sorterRuleSelector.removeAttribute(`disabled`);
      this.customSorterInput.removeAttribute(`disabled`);
      this.start.removeAttribute(`disabled`);
      this.fullprio.removeAttribute(`disabled`);

      this.sorterRuleSelectorText.classList.add(`hidden`);
      this.sorterRuleSelector.classList.add(`hidden`);
      this.customSorterInput.classList.add(`hidden`);
      this.start.classList.add(`hidden`);
      this.fullprio_label.classList.add(`hidden`);
    }
    async __handleSorting(tabs) {
      if(tabs.length == 0) {this.reset(); return;}
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, tabs.length);
      let asyncTabLoader = new BunchLoader(
        [...tabs],
        async function (item) {
          let targetPets = await Enclosures.getPetsAll(item.id, main.user.uid, ``, true);
          this.result = [...this.result, ...targetPets];
        },
        this.presortPets,
        c=>this.boxprogress.setValue(c)
      );
      asyncTabLoader.result = [];
      asyncTabLoader.collect();
    }
    async __presortPets (petList) {
      if(petList.length == 0) {this.reset(); return;}
      this.boxprogress.setValue(0);
      let existingEnclosures = await Enclosures.getEnclosures(main.user.uid);
      this.boxprogress.element.setAttribute(`data-maximum`, existingEnclosures.length);
      let maxNumber = -1;
      existingEnclosures.forEach((enc)=>{maxNumber = Math.max(maxNumber, parseInt(enc.id))});
      let asyncAllTabsLoader = new BunchLoader(existingEnclosures, async function (item) {
        this.result[item.name] = {
          id: item.id,
          name: item.name,
          pets_real: (await Enclosures.getPetsAll(item.id, item.user)).map(p=>{
            p.enc = item.id;
            return p;
          }),
          pets_simulated: [],
        }
      }, (enclosuresList) => {
        this.calculateSorting(
          enclosuresList,
          petList,
          maxNumber,
          (Brain.read(`Sorter.selectedRule`, 0)>0)?main.config.renamerRules[Brain.read(`Sorter.selectedRule`, 0)]:this.customSorterInput.value
        );
      }, c=>this.boxprogress.setValue(c));
      asyncAllTabsLoader.result = {}
      asyncAllTabsLoader.collect();
    }
    async __calculateSorting (enclosureList, petList, maxNumber, rule) {
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, petList.length);

      let tabCreateActions = [];
      let moveActions = {
        M: [],
        W: [],
      };

      let asyncAllPetsSorter = new BunchLoader(petList, async function (item) {
        let currentPet = new Pet(item.id, item.uid);

        let targetName = await main.namer.basedOnRule(currentPet, rule, true, true, `Sorter`);
        targetName = targetName.replace(`PURE Haliaeetus`, `PURE Hali`);
        if(targetName != ``) {

          let targetTab = -1;
          let offsNumber = 1;

          let offs = (offsNumber > 1)?` ${offsNumber}`:``;

          while(
            typeof enclosureList[`${targetName}${offs}`] != `undefined` &&
            (
              enclosureList[`${targetName}${offs}`].pets_real.length +
              enclosureList[`${targetName}${offs}`].pets_simulated.length
            ) == 1000
          ) {
            offsNumber++;
            offs = (offsNumber > 1)?` ${offsNumber}`:``;
          }

          if(typeof enclosureList[`${targetName}${offs}`] == `undefined`) {
            tabCreateActions.push({
              "cmd": `enclosure_add`,
              "Presentation": ``,
              "Label": `${targetName}${offs}`,
              "_title_": `"${targetName}${offs}"-Gehege erstellen`
            });
            this.currentHighestIndex++;
            enclosureList[`${targetName}${offs}`] = {
              id: this.currentHighestIndex.toString(),
              name: targetName + offs,
              pets_real: [],
              pets_simulated: [],
            }
            targetTab = this.currentHighestIndex;
          } else {
            if(parseInt(item.enc) != enclosureList[`${targetName}${offs}`].id) {
              targetTab = enclosureList[`${targetName}${offs}`].id;
            }
          }
          if(parseInt(item.enc) != targetTab) {
            enclosureList[`${targetName}${offs}`].pets_simulated.push(currentPet);
            if(moveActions[currentPet.gender].length > 0) {
              let lastResult = moveActions[currentPet.gender][moveActions[currentPet.gender].length - 1];
              if(typeof lastResult.Enclosure != `undefined` && lastResult.Enclosure == targetTab) {
                moveActions[currentPet.gender][moveActions[currentPet.gender].length - 1] = {
                  "cmd": `pets_enclosure`,
                  "PetID": [...lastResult.PetID, currentPet.id],
                  "Enclosure": targetTab,
                  "_title_": `Verschiebe ${lastResult.PetID.length + 1} Pets zu ${targetName}${offs}`
                }
              } else {
                moveActions[currentPet.gender].push({
                  "cmd": `pets_enclosure`,
                  "PetID": [currentPet.id],
                  "Enclosure": targetTab,
                  "_title_": `Verschiebe 1 Pet zu ${targetName}${offs}`
                });
              }
            } else {
              moveActions[currentPet.gender].push({
                "cmd": `pets_enclosure`,
                "PetID": [currentPet.id],
                "Enclosure": targetTab.toString(),
                "_title_": `Verschiebe 1 Pet zu ${targetName}${offs}`
              });
            }
          }
        }
        this.result = [...tabCreateActions, ...moveActions.M, ...moveActions.W];
      }, this.previewWorks, c=>this.boxprogress.setValue(c));
      asyncAllPetsSorter.result = []
      asyncAllPetsSorter.currentHighestIndex = maxNumber;
      asyncAllPetsSorter.collect();
    }
    async __previewWorks (works) {
      let llmg = 25;
      this.place = main.tools.createElement(`div`);
      this.box.in(this.place);

      let output = main.tools.createElement(`div`, ``, `Es sind insgesamt ${works.length} Verschieben-Aufträge<br /><br />` + works.slice(0, llmg).map(n=>n._title_).join(`\n<br>`) + `${(works.length - llmg > 0)?`<br />... ${works.length - llmg} weitere Aufträge ...`:``}`);
      this.place.in(output);

      let sendToWorker = main.tools.createElement(`div`, `button preventWrap`, `Aufträge starten`);
      sendToWorker.addEventListener(`click`, () => {
        this.handToWorkers(works);
      }, true);
      this.place.in(sendToWorker);

      let cancelWorks = main.tools.createElement(`div`, `button preventWrap`, `Abbrechen`);
      cancelWorks.addEventListener(`click`, this.reset, true);
      this.place.in(cancelWorks);
    }
    async __handToWorkers (works) {
      this.boxprogress.setValue(0);
      let workList = works.map(e=>{
        let title = e._title_;
        delete e._title_;
        let command = new Work({
          moveBunch: async (cmd) => {
            return await Connection.POST(cmd);
          }
        }, `moveBunch`, [e], title);
        return command;
      });
      let targetWorker = -1;
      this.workerTargetSelectorsCheckboxes.forEach(n=>{if(n.checkbox.checked) targetWorker = parseInt(n.checkbox.getAttribute(`value`));});
      if(targetWorker > -1) {
        main.worker.addBunch(workList, this.fullprio.checked, targetWorker);
      } else {
        main.worker.addBunch(workList, this.fullprio.checked);
      }
      setTimeout(this.reset, 500);
    }
    /* REGION "SortAction" */
    async __prepareForSorting(entries) {
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, entries.length);
      let sortedList = {};
      entries.forEach(entry=>{
        if(typeof sortedList[entry[1]] == `undefined`) {
          sortedList[entry[1]] = [];
        }
        sortedList[entry[1]].push(entry[0]);
      });
      let commands = [];
      let highestNumber = -1;
      for(let n in this.tempListOfEnclosures) {
        highestNumber = (parseInt(this.tempListOfEnclosures[n].id) > highestNumber)?parseInt(this.tempListOfEnclosures[n].id):highestNumber;
      }
      for(let enclosureName in sortedList) {
        let foundEnclosure = this.tempListOfEnclosures.filter(e=>e.name==enclosureName.replace(`PURE Haliaeetus`, `PURE Hali`));
        if(foundEnclosure.length == 0) {
          highestNumber += 1;
          commands.push({
            "cmd": `enclosure_add`,
            "Presentation": ``,
            "Label": enclosureName.replace(`PURE Haliaeetus`, `PURE Hali`),
            "_title_": `"${enclosureName}"-Gehege erstellen`
          });
          foundEnclosure = [{id: highestNumber, name: enclosureName}];
          this.tempListOfEnclosures.push(foundEnclosure[0]);
        }
        let enclosurePetList = sortedList[enclosureName];
        let enclosurePetListIndex = 0;
        let amt = 150;
        while (enclosurePetListIndex < enclosurePetList.length) {
          let slicedData = enclosurePetList.slice(enclosurePetListIndex, enclosurePetListIndex + amt);
          commands.push({
            "cmd": `pets_enclosure`,
            "PetID": slicedData,
            "Enclosure": foundEnclosure[0].id,
            "_title_": `Verschiebe ${slicedData.length} Pets zu ${foundEnclosure[0].name}`
          });
          logs(`[Sorter.__prepareForSorting] > `, `Moving ${slicedData.length} pet${slicedData.length==1?``:`s`} to ${foundEnclosure[0].id} - ${foundEnclosure[0].name}`);
          enclosurePetListIndex += amt;
        }
      }
      commands = commands.map(e=>{
        let title = e._title_;
        delete e._title_;
        let command = new Work({
          moveBunch: async (cmd) => {
            return await Connection.POST(cmd);
          }
        }, `moveBunch`, [e], title);
        return command;
      });
      let targetWorker = -1;
      this.workerTargetSelectorsCheckboxes.forEach(n=>{
        if(n.checkbox.checked) targetWorker = parseInt(n.checkbox.getAttribute(`value`));
      });
      logs(`[Sorter.__prepareForSorting] > `, `Adding ${commands.length} sorting${(commands.length==1)?``:`s`}`);
      if(targetWorker > -1) {
        main.worker.addBunch(commands, this.fullprio.checked, targetWorker);
      } else {
        main.worker.addBunch(commands, this.fullprio.checked);
      }
      this.buttons.execute.classList.add(`hidden`);
      this.buttons.start.classList.remove(`hidden`);
      this.sorterRuleSelector.removeAttribute(`disabled`, `disabled`);
      this.sorterRuleSelector.classList.remove(`disabled`);
      this.customSorterInput.removeAttribute(`disabled`, `disabled`);
      this.customSorterInput.classList.remove(`disabled`);
      this.buttons.helper.classList.remove(`disabled`);
      this.buttons.cancel.classList.add(`hidden`);
      this.enclosureSelectionBox.classList.add(`hidden`);
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, 1);
      this.state = 0;
    }
    async __beginSorting() {
      let enclosureList = this.boxes.filter(b=>b.checked);
      enclosureList = enclosureList.map(b=>parseInt(b.getAttribute(`data-id`)));
      this.buttons.execute.classList.add(`hidden`);
      this.enclosureSelectionBox.classList.add(`hidden`);
      this.state = 2;
      this.results = [];

      this.petsList = [];
      this.threads = 0;

      for(let enclosureIndex in enclosureList) {
        if(this.cancelState) break;
        let enclosureID = enclosureList[enclosureIndex];
        this.petsList = [...this.petsList, ...await Enclosures.getPetsAll(enclosureID)];
      }
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, this.petsList.length);
      for(let i = 0;i < Math.max(1, Math.min(7, this.petsList.length));i++) {
        this.threads++;
        this.__work();
      }
    }
    async __work() {
      if(this.petsList.length > 0 && !this.cancelState) {
        let petEntry = this.petsList.pop();
        let pet = new Pet(petEntry.id);
        let rule = this.customSorterInput.value;
        if(Brain.read(`Sorter.selectedRule`, 0) > 0) {
          rule = main.config.renamerRules[Brain.read(`Sorter.selectedRule`, 0)];
        }
        main.namer.basedOnRule(pet, rule, true, true, `Sorter`).then((result) => {
          this.results.push([pet.id, result]);
          this.boxprogress.increase();
          if(this.petsList.length > 0) {
            this.__work();
          } else {
            this.threads--;
            if(this.threads == 0) {
              this.__finished();
            }
          }
        });
      }
    }
    async __finished() {
      if(!this.cancelState) {
        this.prepareForSorting(this.results);
      } else {
        this.cancelState = false;
        this.state = 0;
        this.buttons.execute.classList.add(`hidden`);
        this.buttons.start.classList.remove(`hidden`);
        this.sorterRuleSelector.removeAttribute(`disabled`, `disabled`);
        this.sorterRuleSelector.classList.remove(`disabled`);
        this.customSorterInput.removeAttribute(`disabled`, `disabled`);
        this.customSorterInput.classList.remove(`disabled`);
        this.buttons.helper.classList.remove(`disabled`);
        this.buttons.cancel.classList.add(`hidden`);
        this.boxprogress.setValue(0);
        this.boxprogress.element.setAttribute(`data-maximum`, 1);
      }
    }
    /* ENDREGION */
    /* REGION "Systems" */
    async __start() {
      if(this.state == 0) {
        this.state = 1;

        this.buttons.start.classList.add(`hidden`);
        this.buttons.helper.classList.add(`disabled`);
        this.buttons.cancel.classList.remove(`hidden`);
        this.buttons.execute.classList.remove(`hidden`);

        this.sorterRuleSelector.setAttribute(`disabled`, `disabled`);
        this.sorterRuleSelector.classList.add(`disabled`);

        this.customSorterInput.setAttribute(`disabled`, `disabled`);
        this.customSorterInput.classList.add(`disabled`);

        this.loadEnclosures();
      } else if (this.state != -1) {
        this.state = -1;
      }
    }
    async __loadEnclosures() {
      this.enclosureSelectionBox.innerHTML = ``;
      this.enclosureSelectionBox.classList.remove(`hidden`);
      this.boxes = [];
      this.tempListOfEnclosures = await Enclosures.getEnclosures(main.user.uid);
      let list = this.tempListOfEnclosures.map(encl=>{if(encl.id == 0) encl.selected = true;return encl;});
      for(let tabIndex in list) {
        let enclosure = list[tabIndex];
        if(enclosure.name.trim() != ``) {
          let enclosureSelectionCheckbox = main.tools.createElement(`input`, `hidden`);
          enclosureSelectionCheckbox.setAttribute(`id`, `encl_${enclosure.id}`);
          enclosureSelectionCheckbox.setAttribute(`type`, `checkbox`);
          enclosureSelectionCheckbox.setAttribute(`data-id`, `${enclosure.id}`);
          enclosureSelectionCheckbox.checked = enclosure.selected;
          this.boxes.push(enclosureSelectionCheckbox);

          let enclosureSelectionLabel = main.tools.createElement(`label`, `button preventWrap`, enclosure.name);
          enclosureSelectionLabel.setAttribute(`for`, `encl_${enclosure.id}`);
          enclosureSelectionLabel.style.display = `inline-block`;
          enclosureSelectionLabel.style.width = `CALC(50% - 10px)`;
          this.enclosureSelectionBox.in(enclosureSelectionCheckbox).in(enclosureSelectionLabel);
        }
      }
    }
    /* ENDREGION */
  }

  class BreedStation {
    constructor() {
      /* REGION " Method binding "*/
      this.reset = this.__reset.bind(this);
      this.toggleState = this.__toggleState.bind(this);
      this.loadTabs = this.__loadTabs.bind(this);
      this.filterMales = this.__filterMales.bind(this);
      this.openFemaleTabSelector = this.__openFemaleTabSelector.bind(this);
      this.findMates = this.__findMates.bind(this);
      this.presetMates = this.__presetMates.bind(this);
      this.breedWithRules = this.__breedWithRules.bind(this);
      this.breedWithRulesPreview = this.__breedWithRulesPreview.bind(this);
      this.makePreviewElement = this.__makePreviewElement.bind(this);
      /* ENDREGION */
      /* REGION " Box " */
      main.tools.createBox(this, `Zuchtstation`, `BreedStation`);
      this.box.classList.add(`box_BreedStation`);
      main.tools.createTargetSelectors(this, `BreedStation`);
      /* ENDREGION */
      /* REGION " Standard Buttons " */
      this.start = main.tools.createElement(`div`, `button preventWrap`, `Starten`);
      this.start.addEventListener(`click`, this.toggleState, true);
      this.start.css({
        display: `inline-block`,
        width: (DEBUG)?`CALC(100% - 195px)`:`CALC(100% - 65px)`,
      })

      this.fullprio = null;this.fullprio_label = null;[this.fullprio, this.fullprio_label] = main.tools.createToggle(`BreedStation_fullprio`, ``, () => {Brain.write(`BreedStation_fullprio`, (this.fullprio.checked==true)?1:0);}, (Brain.read(`BreedStation_fullprio`, 1)==1));
      this.fullprio_label.css({
        backgroundImage: `url(${main.config.defaults.fullprio})`,
        backgroundSize: `contain`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        display: `inline-block`,
        width: `45px`,
      })
      /* ENDREGION */
      /* REGION " Individuals " */
      this.statustext = main.tools.createElement(`div`, `center`, ``);
      this.previewBox = main.tools.createElement(`div`, `center`, ``);

      this.customIDs = main.tools.createElement(`input`, `button`);
      this.customIDs.css({
        display: (DEBUG)?`inline-block`:`none`,
        width: `120px`,
        cursor: `inherit`,
        boxSizing: `border-box`,
      })
      this.customIDs.setAttribute(`type`, `number`);
      this.customIDs.setAttribute(`min`, `-1`);
      this.customIDs.setAttribute(`max`, `999999999`);
      this.customIDs.setAttribute(`value`, BetterBrain.DEBUG_CustomIDs || -1);
      this.customIDs.addEventListener(`change`, () => {
        BetterBrain.DEBUG_CustomIDs = this.customIDs.value;
      }, true);

      this.filter_input = null;
      this.startOrgy = null;
      this.testOrgy = null;
      this.cachedMates = {};
      /* ENDREGION */
      /* REGION " Exporting " */
      this.box.in(this.boxTitle);
      this.box.in(this.workerTargetSelectors);
      this.box.in(this.boxprogress.element);

      this.box.in(this.statustext);
      this.box.in(this.previewBox);

      this.box.in(this.customIDs);
      this.box.in(this.start);

      this.box.in(this.fullprio);
      this.box.in(this.fullprio_label);
      /* ENDREGION */
    }
    async __makePreviewElement(pet) {
      if(pet.species == `Unbekannt`) await pet.load();
      let tempPreviewElement = main.tools.createElement(`div`, ``, ``);
      tempPreviewElement.css({
        backgroundImage: `url(https://im2.ovipets.com/?img=pet&pet=${pet.id}&size=130&bg=transparent)`,
        width:`150px`,
        height:`170px`,
        display: `inline-flex`,
        border:`3px solid #6d90af`,
        backgroundColor: `#303030`,
        borderRadius:`3px`,
        flexDirection: `row`,
        flexWrap: `wrap`,
        alignContent: `flex-end`,
        justifyContent: `flex-end`,
        overflow:`hidden`,
        boxSizing:`border-box`,
        backgroundRepeat:`no-repeat`,
        backgroundPosition:`10px -10px`,
        color:`white`,
        fontWeight: `normal`,
        fontSize: `8px !important`,
        fontFamily: `Segoe UI !important`,
      });
      let colorLinking = (typeof main.config.colorLinks[pet.species] != `undefined`)?main.config.colorLinks[pet.species]:main.config.defaults.colorLink;
      let hexColors = colorLinking.hex(pet.colors);
      let tempPreviewElementPetName = main.tools.createElement(`div`, ``, `${pet.name}`);
      tempPreviewElementPetName.css({
        display: `block`,
        width: `CALC(100% - 2px)`,
        fontSize: `8px`,
        fontWeight: `normal !important`,
        height: `11px`,
        textAlign: `center`,
        background: `black`,
      });
      tempPreviewElement.in(tempPreviewElementPetName);
      for(let i in hexColors) {
        let currentCat = [];
        for(let j in hexColors[i]) {
          if((j == `1` || j == `2`) && hexColors[i][j] != ``) {
            currentCat.push(hexColors[i][j]);
          }
        }
        if(currentCat.length > 0) {
          for(let j = 0;j < currentCat.length; j++) {
            let tempPreviewElementColorBox = main.tools.createElement(`div`, ``, ``);
            tempPreviewElementColorBox.css({
              boxSizing: `border-box`,
              display: `flex`,
              clear: `both`,
              alignSelf: `flex-end`,
              width: `CALC(100% - 2px)`,
              border: `1px solid black`,
              backgroundColor: `rgba(255, 255, 255, 0.1)`,
              borderRadius: `2px`,
              margin: `1px`,
              paddingLeft: `4px`,
              fontSize: `8px !important`,
              fontFamily: `Segoe UI !important`,
              overflow: `hidden`,
            });

            let tempPreviewElementColorBoxText = main.tools.createElement(`div`, ``, `${i} ${j+1}`);
            tempPreviewElementColorBoxText.css({
              display: `flex`,
              flexDirection: `column`,
              flexWrap: `nowrap`,
              alignSelf: `flex-start`,
              justifySelf: `flex-start`,
              width: `CALC(100% - 18px)`,
              fontSize: `8px`,
              fontWeight: `normal !important`,
              textAlign: `left`,
              height: `11px`,
            });

            let tempPreviewElementColorBoxColor = main.tools.createElement(`div`, ``, `${currentCat[j]}`);
            tempPreviewElementColorBoxColor.css({
              backgroundColor: `${currentCat[j]}`,
              display: `flex`,
              flexDirection: `column`,
              flexWrap: `nowrap`,
              alignSelf: `flex-start`,
              justifySelf: `flex-start`,
              width: `50px`,
              height: `11px`,
              borderLeft: `1px solid black`,
              boxSizing: `border-box`,
              fontSize: `9px`,
              textAlign: `center`,
              color: `black`,
              textShadow: `0px 0px 1px white, 0px 0px 1px white, 0px 0px 1px white, 0px 0px 1px white, 0px 0px 1px white, 0px 0px 1px white, 0px 0px 1px white, 0px 0px 1px white`,
              paddingTop: `0px`,
            });

            tempPreviewElementColorBox.in(tempPreviewElementColorBoxText);
            tempPreviewElementColorBox.in(tempPreviewElementColorBoxColor);
            tempPreviewElement.in(tempPreviewElementColorBox);
          }
        }
      }
      return tempPreviewElement;
    }
    async __reset () {
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, 1);
      try {this.selectionbox.remove()} catch {};
      try {this.selectionTitle.remove()} catch {}
      try {this.filter_input.remove()} catch {}
      try {this.startOrgy.remove()} catch {}
      try {this.testOrgy.remove()} catch {}
      this.start.classList.remove(`hidden`);
      this.start.classList.remove(`disabled`);
      this.fullprio_label.classList.remove(`hidden`);
      this.fullprio_label.classList.remove(`disabled`);
      this.fullprio.removeAttribute(`disabled`);
      this.customIDs.classList.remove(`hidden`);
      this.customIDs.classList.remove(`disabled`);
      this.customIDs.removeAttribute(`disabled`);
      this.selectionbox = null;
      this.selectionTitle = null;
      this.filter_input = null;
      this.startOrgy = null;
      this.testOrgy = null;
      this.statustext.innerHTML = ``;
      this.previewBox.innerHTML = ``;
    }
    async __toggleState () {
      this.cachedMates = {};

      this.start.classList.add(`disabled`);
      this.fullprio_label.classList.add(`disabled`);
      this.fullprio.setAttribute(`disabled`, `disabled`);

      if(DEBUG) {
        this.customIDs.classList.add(`disabled`);
        this.customIDs.setAttribute(`disabled`, `disabled`);
      }

      let uid = main.user.uid;

      if(DEBUG && this.customIDs.value.trim() != -1) {
        try {
          uid = parseInt(this.customIDs.value.trim());
          uid = isNaN(uid)?main.user.uid:uid;
        } catch {
          uid = main.user.uid;
        }
      }
      this.selectionbox = await main.tools.createTabSelection(
        (r) => {this.loadTabs(r, uid)},
        this.reset,
        uid,
        false,
        false,
        false
      );
      this.selectionTitle = main.tools.createElement(`div`, `catbox center`, `Männchen-Auswahl`);
      this.selectionTitle.in(this.selectionbox);
      this.box.in(this.selectionTitle);

      this.start.classList.remove(`disabled`);
      this.fullprio_label.classList.remove(`disabled`);
      this.fullprio.removeAttribute(`disabled`);

      if(DEBUG) {
        this.customIDs.classList.remove(`disabled`);
        this.customIDs.removeAttribute(`disabled`);
      }

      this.start.classList.add(`hidden`);
      this.fullprio_label.classList.add(`hidden`);
      if(DEBUG) {
        this.customIDs.classList.add(`hidden`);
      }
    }
    async __loadTabs (selectedTabs, uid) {
      this.statustext.innerHTML = `Gestartet<br />Warte auf Auswahl<br />`;
      this.selectionTitle.remove();
      this.selectionTitle = null;
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, selectedTabs.length);
      let asyncTabLoader = new BunchLoader(selectedTabs, async function (item) {
        let targetPets = await Enclosures.getPetsAll(item.id, item.uid || main.user.uid, ``, true);
        this.result = [...this.result, ...targetPets];
      }, (r) => {this.filterMales(r, uid)}, c=>this.boxprogress.setValue(c));
      asyncTabLoader.result = [];
      asyncTabLoader.collect();
    }
    async __filterMales (results, uid) {
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, results.length);

      this.statustext.innerHTML = `Warte auf Auswahl<br />Sammle männliche Pets zusammen ...<br />`;
      let asyncTabLoader = new BunchLoader(results, async function (item) {
        let currentPet = null;
        if(this.result[1][item.id] != undefined) {
          currentPet = this.result[1][item.id];
        } else {
          currentPet = new Pet(item.id, uid);
          await currentPet.load(true, false, true);
          this.result[1][item.id] = currentPet;
        }
        if(currentPet.gender == "M") this.result[0] = [...this.result[0], currentPet];
      }, (r) => {this.cachedMates = r[1];this.openFemaleTabSelector(r[0], uid)}, c=>{
        this.statustext.innerHTML = `Sammle männliche Pets zusammen ...<br />${c} Pets geprüft<br />`;
        this.boxprogress.setValue(c)
      });
      asyncTabLoader.result = [[], this.cachedMates];
      asyncTabLoader.collect();
    }
    async __openFemaleTabSelector (malePetList, uid) {
      this.statustext.innerHTML = `${malePetList.length} männliche Pets gefunden<br />Warte auf Auswahl<br />`;
      this.boxprogress.setValue(0);
      this.selectionbox = await main.tools.createTabSelection(
        (result) => {this.findMates(result, malePetList, uid)},
        this.reset,
        uid,
        false,
        false,
        false
      );
      this.selectionTitle = main.tools.createElement(`div`, `catbox center`, `Weibchen-Auswahl`);
      this.selectionTitle.in(this.selectionbox);
      this.box.in(this.selectionTitle);
    }
    async __findMates (targetTabs, targetPets, uid) {
      this.statustext.innerHTML = `Warte auf Auswahl<br />${targetTabs.length} Tabs werden geprüft ...<br />`;
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, targetPets.length);

      this.selectionTitle.remove();
      this.selectionTitle = null;

      let result = {};
      let curCount = 0;

      let amount = 0;

      this.statustext.innerHTML = `${targetTabs.length} Tabs werden geprüft ...<br />Sammle für jedes männliche Pet die möglichen weiblichen Pets zusammen ...<br />`;
      for(let j = 0;j < targetPets.length;j++) {
        let item = targetPets[j];
        await item.load(true, false, true);
        for(let i = 0;i < targetTabs.length;i++) {
          let targetTab = targetTabs[i];
          this.statustext.innerHTML = `Sammle für jedes männliche Pet die möglichen weiblichen Pets zusammen ...<br />Lade Paarungs-Liste für ${item.id} ...<br />`;
          let females = [];
          if(DEBUG && uid > -1) {
            let tempfemales = await Enclosures.getPetsAll(targetTab.id, uid, ``, true);
            this.statustext.innerHTML = `Sammle für jedes männliche Pet die möglichen weiblichen Pets zusammen ...<br />Lade Paarungs-Liste für ${item.id} / ${targetTab.id} ...<br />`;
            for(let n = 0;n < tempfemales.length;n++) {
              this.statustext.innerHTML = `Sammle für jedes männliche Pet die möglichen weiblichen Pets zusammen ...<br />Lade Paarungs-Liste für ${item.id} / ${targetTab.id} / ${tempfemales[n].id} ...<br />`;
              let pInfo = null;
              if(this.cachedMates[tempfemales[n].id] != undefined) {
                pInfo = this.cachedMates[tempfemales[n].id];
              } else {
                pInfo = new Pet(tempfemales[n].id, uid);
                await pInfo.load(true, false, true);
                this.cachedMates[tempfemales[n].id] = pInfo;
              }
              if(pInfo.species == item.species && pInfo.gender != "M") females.push(tempfemales[n]);
            }
          } else {
            females = await item.getMates(targetTab.id);
          }
          this.statustext.innerHTML = `Sammle für jedes männliche Pet die möglichen weiblichen Pets zusammen ...<br />Konvertiere Paarungs-Liste für ${item.id} ...<br />`;
          for(let k = 0;k < females.length;k++) {
            let female = females[k];
            if(this.cachedMates[female.id] != undefined) {
              female = this.cachedMates[female.id];
            } else {
              female = new Pet(female.id, female.uid);
            }
            if(female.species == `Unbekannt`) await female.load(true);
            let dat = {males: [item], female: female};
            if(typeof result[female.id] !== `undefined`) {
              dat = result[female.id];
              dat.males.push(item);
            } else {
              amount++;
            }
            result[dat.female.id] = dat;
          }
        }
        this.boxprogress.increase();
      }
      result = {...result, amount: amount};
      this.presetMates(result);
    }
    async __presetMates (collection) {
      this.statustext.innerHTML = `${collection.amount} paarungsbereite Weibchen ...<br />Warte auf Auswahl<br />`;
      this.currentCollection = collection;
      this.filter_input = main.tools.createElement(`textarea`, `button`, `${BetterBrain.lastBreedFilter || ``}`);
      this.filter_input.addEventListener(`change`, () => {
        BetterBrain.breedStationCode = this.filter_input.value;
      }, true);
      this.filter_input.css({
        whiteSpace: `pre`,
        display: `inline-block`,
        width: `calc(100% - 10px)`,
        cursor: `inherit`,
        resize: `none`,
        height: `200px`,
        position: `relative`,
        boxSizing: `border-box`,
        overflow: `initial`,
        fontFamily: `Lucida Console, Courier New, mono-space`,
      })
      this.filter_input.setAttribute(`type`, `text`);
      this.filter_input.innerHTML = BetterBrain.breedStationCode || ``;
      this.box.in(this.filter_input);
      this.startOrgy = main.tools.createElement(`div`, `button`, `Zucht starten`);
      this.startOrgy.css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
      })
      this.startOrgy.addEventListener(`click`, this.breedWithRules, true)
      this.box.in(this.startOrgy);

      this.testOrgy = main.tools.createElement(`div`, `button`, `Vorschau erzeugen`);
      this.testOrgy.css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
      })
      this.testOrgy.addEventListener(`click`, this.breedWithRulesPreview, true)
      this.box.in(this.testOrgy);
    }
    async __breedWithRules () {
      if(!this.startOrgy.classList.contains(`disabled`)) {
        this.filter_input.setAttribute(`disabled`, `disabled`);
        this.filter_input.classList.add(`disabled`);
        this.startOrgy.setAttribute(`disabled`, `disabled`);
        this.startOrgy.classList.add(`disabled`);
        this.testOrgy.setAttribute(`disabled`, `disabled`);
        this.testOrgy.classList.add(`disabled`);

        let collection = this.currentCollection

        this.boxprogress.setValue(0);
        this.boxprogress.element.setAttribute(`data-maximum`, collection.amount);

        let filter = this.filter_input.value;

        let workList = [];
        let collectionList = [];
        for(let collectionIterator in collection) {
          if(collectionIterator !== "amount") {
            collectionList.push(collection[collectionIterator]);
          }
        }
        this.statustext.innerHTML = `Warte auf Auswahl<br />Erstelle Aufgabenliste für Arbeiter ...<br />`;

        let asyncWorker = new BunchLoader(collectionList, async function (entry) {
          let female = entry.female;
          if(female.species == `Unbekannt`) await female.load(true, false, true);
          let female_filter = "";
          if(filter !== "") {
            female_filter = await main.namer.basedOnRule(female, filter, (female.species == `Unbekannt`), false, `Breeding_F`);
          }
          let mate = null;
          for(let maleIndex = 0;maleIndex < entry.males.length;maleIndex++) {
            let male = entry.males[maleIndex];
            if(male.species == `Unbekannt`) await male.load(true, false, true);
            let male_filter = "";
            if(filter !== "") {
              male_filter = await main.namer.basedOnRule(male, filter, (male.species == `Unbekannt`), false, `Breeding_M`);
            }
            if(female_filter == male_filter) {
              mate = male;
              break;
            }
          }
          if(mate !== null) {
            let randomPhrases = [
              `${mate.name} (${mate.id}) und ${female.name} (${female.id}) haben Spaß`,
              `${mate.name} (${mate.id}) und ${female.name} (${female.id}) sind gerade mal weg`,
              `${mate.name} (${mate.id}) und ${female.name} (${female.id}) lieben sich`,
              `${mate.name} (${mate.id}) und ${female.name} (${female.id}) besteigen sich`,
              `${mate.name} (${mate.id}) schwängert ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) und ${female.name} (${female.id}) haben ein Schäferstündchen`,
              `${mate.name} (${mate.id}) spielt mit ${female.name} (${female.id}) 'Sven XXX'`,
              `${mate.name} (${mate.id}) besteigt ${female.name} (${female.id})`,
              `Netflix & Chill bei ${mate.name} (${mate.id}) und ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) und ${female.name} (${female.id}) machen WAS?`,
              `${mate.name} (${mate.id}) 👄 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) 💕 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) 💓 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) 💏🏻 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) 🐇 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) 🤱🏽 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) 👉🏼👌🏼 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) 🛌 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) 🍆 ${female.name} (${female.id})`,
              `${mate.name} (${mate.id}) vermehrt sich mit ${female.name} (${female.id})`,
            ];
            let randomPhrase = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
            let data = {cmd: `pet_breed`,FPetID: female.id.toString(),MPetID: mate.id.toString()};
            this.result = [...this.result, new Work({sex: async (cmd) => {let isBreeded = await Connection.POST(cmd);BetterBrain.amountBreed = (BetterBrain.amountBreed||0)+(isBreeded?1:0);return isBreeded}}, `sex`, [data], `${randomPhrase}`)];
          }
        }, (workList) => {
          let targetWorker = -1;
          for(let i = 0;i < this.workerTargetSelectorsCheckboxes.length;i++) {
            let n = this.workerTargetSelectorsCheckboxes[i];
            if(n.checkbox.checked) targetWorker = parseInt(n.checkbox.getAttribute(`value`));
          };
          this.statustext.innerHTML = `${collectionList.length} / ${collectionList.length}<br />Übergebe ${workList.length} Aufgaben an den Arbeiter ...<br />`;
          if(targetWorker > -1) {
            main.worker.addBunch(workList, this.fullprio.checked, targetWorker);
          } else {
            main.worker.addBunch(workList, this.fullprio.checked);
          }
          setTimeout(this.reset, 1500);
        }, c=>{
          this.statustext.innerHTML = `Erstelle Aufgabenliste für Arbeiter ...<br />${c} / ${this.currentCollection.amount}<br />`;
          this.boxprogress.setValue(c)
        });
        asyncWorker.result = [];
        asyncWorker.collect();
      }
    }
    async __breedWithRulesPreview () {
      if(!this.testOrgy.classList.contains(`disabled`)) {
        this.filter_input.setAttribute(`disabled`, `disabled`);
        this.filter_input.classList.add(`disabled`);
        this.startOrgy.setAttribute(`disabled`, `disabled`);
        this.startOrgy.classList.add(`disabled`);
        this.testOrgy.setAttribute(`disabled`, `disabled`);
        this.testOrgy.classList.add(`disabled`);

        let collection = this.currentCollection;

        this.boxprogress.setValue(0);
        this.boxprogress.element.setAttribute(`data-maximum`, collection.amount);

        let filter = this.filter_input.value;

        let workList = [];
        let collectionList = [];
        for(let collectionIterator in collection) {
          if(collectionIterator !== "amount") {
            collectionList.push(collection[collectionIterator]);
          }
        }
        this.statustext.innerHTML = `Warte auf Auswahl<br />Erstelle Vorschau der ersten 4 Paare ...<br />`;
        this.previewBox.innerHTML = ``;

        let asyncWorker = new BunchLoader(collectionList, async function (entry) {
          if(typeof this.result !== "string" && this.result.length < main.config.previewAmount) {
            try {
              let female = entry.female;
              if(this.result[1][entry.female.id] != undefined) female = this.result[1][entry.female.id];
              let female_filter = "";
              if(filter !== "") {
                female_filter = await main.namer.basedOnRule(female, filter, (female.species == `Unbekannt`), false, `BreedStation`);
              }
              let mate = null;
              for(let maleIndex = 0;maleIndex < entry.males.length;maleIndex++) {
                let male = entry.males[maleIndex];
                if(this.result[1][entry.males[maleIndex].id] != undefined) male = this.result[1][entry.males[maleIndex].id];
                let male_filter = "";
                if(filter !== "") {
                  male_filter = await main.namer.basedOnRule(male, filter, (male.species == `Unbekannt`), false, `BreedStation`);
                }
                if(female_filter == male_filter) {
                  mate = male;
                  break;
                }
              }
              if(mate !== null) {
                this.result[0] = [...this.result[0], [female, mate]];
              }
            } catch (fehler) {
              this.result[0] = `<pre>${fehler.toString()}</pre>\n${JSON.stringify(fehler.stack.toString().match(/:(\d+):(\d+)\n/))}`;
            }
          }
        }, async (resultList) => {
          this.cachedMates = resultList[1];
          let isFailure = null;
          const focusBox = (box, line, column) => {
              var textbox = box;
              var text = textbox.value;
              var lines = text.split("\n");
              if (line > lines.length || line < 1) {
                console.error("Zeilennummer außerhalb des Textbereichs");
                return;
              }
              var position = 0;
              for (var i = 0; i < line - 1; i++) {
                position += lines[i].length + 1;
              }
              position += column - 1; // Adjust column index
              if (position > text.length) {
                console.error("Spaltennummer außerhalb des Textbereichs");
                return;
              }
              textbox.focus();
              textbox.setSelectionRange(position - 1, position - 1);
            }
          if(typeof resultList[0] === "string") {
            let data = resultList[0].trim().split(`\n`);
            this.previewBox.innerHTML = data[0].trim();
            let positionData = JSON.parse(data[1].trim());
            isFailure = [parseInt(positionData[1]), parseInt(positionData[2])];
            this.statustext.innerHTML = `Es ist ein Fehler im Code erkannt worden<br />Warte auf Auswahl<br />`;
          } else {
            for(let i = 0;i < Math.min(main.config.previewAmount, resultList[0].length);i++) {
              let currentCouple = resultList[0][i];

              let currentMale = await this.makePreviewElement(currentCouple[1]);
              let currentFemale = await this.makePreviewElement(currentCouple[0]);

              let previewContainer = main.tools.createElement(`div`, `button`, ``);
              previewContainer.css({
                height: `auto`,
                margin: `5px`,
                width: `310px`,
                display: `inline-block`,
              })
              previewContainer.in(currentFemale);
              previewContainer.in(currentMale);
              this.previewBox.in(previewContainer);
            }
            this.statustext.innerHTML = `Erstelle Vorschau der ersten 4 Paare ...<br />Warte auf Auswahl<br />`;
          }
          this.filter_input.removeAttribute(`disabled`);
          this.filter_input.classList.remove(`disabled`);
          this.startOrgy.removeAttribute(`disabled`);
          this.startOrgy.classList.remove(`disabled`);
          this.testOrgy.removeAttribute(`disabled`);
          this.testOrgy.classList.remove(`disabled`);

          if(isFailure !== null) {
            focusBox(this.filter_input, ...isFailure);
          }
        }, c=>{
          this.boxprogress.setValue(c)
        });
        asyncWorker.result = [[], this.cachedMates];
        asyncWorker.collect();
      }
    }
  }
  class EggCrusher {
    constructor () {
      /* REGION " Method binding "*/
      this.reset = this.__reset.bind(this);
      this.toggleState = this.__toggleState.bind(this);
      this.previewJob = this.__previewJob.bind(this);
      this.finishJob = this.__finishJob.bind(this);
      /* ENDREGION */
      /* REGION " Box " */
      main.tools.createBox(this, `Oviraptor`, `EggCrusher`);
      this.box.classList.add(`box_EggCrusher`);
      main.tools.createTargetSelectors(this, `eggCrush`);
      /* ENDREGION */
      /* REGION " Individuals " */
      this.pendingWorks = [];
      this.sliceAmount = 20;
      this.code = main.tools.createElement(`textarea`, `button`);
      this.code.css({
        whiteSpace: `pre`,
        display: `inline-block`,
        width: `CALC(100% - 10px)`,
        cursor: `inherit`,
        resize: `none`,
        height: `200px`,
        position: `relative`,
        boxSizing: `border-box`,
        overflow: `initial`,
        fontFamily: `Lucida Console, Courier New, mono-space`,
      })
      this.code.innerHTML = BetterBrain.eggCrusherCode || ``;
      this.code.setAttribute(`placeholder`, `Beispiel: $\{(pet.species == \`Speziesname\`)?\`Löschen\`:\`\`}`);
      this.code.setAttribute(`rows`, `20`);
      this.code.addEventListener(`change`, () => {
        BetterBrain.eggCrusherCode = this.code.value;
      }, true);
      this.status = main.tools.createElement(`div`, `catbox center`, `Aktuell nichts zu tun`);
      this.status.css({
        height: `initial`,
        maxHeight: `300px`,
        overflowY: `auto`,
      })
      /* ENDREGION */
      /* REGION " Standard Buttons " */
      this.start = main.tools.createElement(`div`, `button preventWrap`, `Starten`);
      this.start.addEventListener(`click`, this.toggleState, true);

      this.continue = main.tools.createElement(`div`, `button preventWrap disabled hidden`, `ENTSORGEN`);
      this.continue.css({
        display: `inline-block`,
        width: `CALC(45% - 10px)`,
        float: `left`,
      })
      this.continue.addEventListener(`click`, this.finishJob, true);
      this.continue.setAttribute(`disabled`, `disabled`);

      this.cancel = main.tools.createElement(`div`, `button preventWrap disabled hidden`, `Abbrechen`);
      this.cancel.css({
        display: `inline-block`,
        width: `CALC(45% - 10px)`,
        float: `right`,
      })
      this.cancel.addEventListener(`click`, this.reset, true);
      this.cancel.setAttribute(`disabled`, `disabled`);
      /* ENDREGION */
      /* REGION " Exporting " */
      this.box.in(this.boxTitle);
      this.box.in(this.workerTargetSelectors);
      this.box.in(this.boxprogress.element);

      this.box.in(this.status);
      this.box.in(this.code);

      this.box.in(this.start);
      this.box.in(this.continue);
      this.box.in(this.cancel);

      let br = main.tools.createElement(`br`);
      br.css({
        clear: `both`,
        display: `block`,
        height: `0px`,
      });
      this.box.in(br);
      /* ENDREGION */
    }
    async __reset () {
      this.boxprogress.setValue(0);
      this.boxprogress.element.setAttribute(`data-maximum`, 1);

      this.code.classList.remove(`disabled`);
      this.code.classList.remove(`hidden`);
      this.code.removeAttribute(`disabled`);

      this.start.classList.remove(`hidden`);
      this.start.classList.remove(`disabled`);
      this.start.removeAttribute(`disabled`);
      this.start.innerHTML = "Starten";

      this.continue.classList.add(`hidden`);
      this.continue.classList.add(`disabled`);
      this.continue.setAttribute(`disabled`, `disabled`);

      this.cancel.classList.add(`hidden`);
      this.cancel.classList.add(`disabled`);
      this.cancel.setAttribute(`disabled`, `disabled`);

      this.status.innerHTML = `Aktuell nichts zu tun`;

      this.pendingWorks = [];
    }
    async __toggleState () {
      if(this.start.innerHTML == "Starten") {
        this.start.innerHTML = "ABBRECHEN";
        this.start.classList.add(`disabled`);
        this.start.setAttribute(`disabled`, `disabled`);
        if(BetterBrain.skipRaptorSecurityTimeouts) {
          this.start.classList.remove(`disabled`);
          this.start.removeAttribute(`disabled`);
        } else {
          setTimeout(() => {
            this.start.classList.remove(`disabled`);
            this.start.removeAttribute(`disabled`);
          }, 300);
        }

        this.boxprogress.setValue(0);

        this.code.classList.add(`disabled`);
        this.code.classList.add(`hidden`);
        this.code.setAttribute(`disabled`, `disabled`);

        let eggs = (await main.user.getEggs()).all;

        this.boxprogress.element.setAttribute(`data-maximum`, Math.max(1, eggs.length));
        this.bunchWorker = new BunchLoader([...eggs], async function (egg) {
          if(this.skip) {this.result = [];return;}
          let pet = new Pet(egg.id);
          let rsl = await main.namer.basedOnRule(pet, this.code, true, false, `Oviraptor`);
          if(rsl.length > 0) this.result.push(pet);
          await main.tools.sleep(1);
        }, async (works) => {
          await main.tools.sleep(1000);
          this.status.innerHTML = `Bereite Vorschau vor`;
          this.previewJob(works);
        }, c => {
          this.status.innerHTML = `${c} von ${eggs.length} Eiern am Prüfen ... (${this.bunchWorker.result.length} Treffer)`;
          this.boxprogress.setValue(c)
        });
        this.bunchWorker.result = [];
        this.bunchWorker.code = this.code.value;
        this.bunchWorker.skip = false;
        this.bunchWorker.threads = Math.min(2, eggs.length);
        this.bunchWorker.collect();
      } else if (this.start.innerHTML == "ABBRECHEN") {
        this.start.innerHTML == "Wird abgebrochen ..."
        this.start.setAttribute(`disabled`, `disabled`);
        this.start.classList.add(`disabled`);
        this.bunchWorker.skip = true;
      }
    }
    async __previewJob (result) {
      if(result.length == 0) {this.reset();return;}

      this.pendingWorks = result;

      this.start.classList.add(`disabled`);
      this.start.classList.add(`hidden`);

      this.cancel.classList.remove(`hidden`);
      this.continue.classList.remove(`hidden`);

      this.status.innerHTML = ``;

      let maxCount = this.pendingWorks.length;
      let decCount = maxCount;
      let partedData = main.tools.parting(this.pendingWorks, this.sliceAmount);
      let preview_works = [];
      for(let n = 0;n < partedData.length;n++) {
        let slicedPart = partedData[n];decCount -= slicedPart.length;
        preview_works.push(`Entsorge ${slicedPart.length} Ei${(slicedPart.length!=1)?`er`:``} von ${maxCount} Ei${(maxCount!=1)?`ern`:``} - Rest: ${decCount} Ei${(decCount!=1)?`er`:``}`);
      }

      for(let n = 0;n < this.pendingWorks.length;n++) {
        let pwo = this.pendingWorks[n];
        let elm = await main.breeder.makePreviewElement(pwo);
        this.status.in(elm);
        this.status.in(document.createTextNode(` `));
      }

      let previewWorkEntries = main.tools.createElement(`div`, `button`, `<u>Die Liste der Aufgaben würde so aussehen</u><br /><br />${preview_works.join(`<br />\n`)}`);
      previewWorkEntries.css({
        height: `initial`,
        cursor: `initial`,
        maxHeight: `150px`,
        overflowY: `auto`,
      })
      this.status.in(previewWorkEntries);

      if(BetterBrain.skipRaptorSecurityTimeouts) {
        this.cancel.classList.remove(`disabled`);
        this.cancel.removeAttribute(`disabled`);
        this.continue.classList.remove(`disabled`);
        this.continue.removeAttribute(`disabled`);
      } else {
        setTimeout(() => {
          this.cancel.classList.remove(`disabled`);
          this.cancel.removeAttribute(`disabled`);
        }, 1000);
        setTimeout(() => {
          this.continue.classList.remove(`disabled`);
          this.continue.removeAttribute(`disabled`);
        }, 2500);
      }
    }
    async __finishJob () {
      let result = this.pendingWorks;
      this.pendingWorks = [];
      if(result.length > 0) {
        this.status.innerHTML = `Erstelle Aufgabenliste für Arbeiter ...`;
        let maxCount = result.length;
        let decCount = maxCount;

        let partedData = main.tools.parting(result, this.sliceAmount);
        let works = [];

        for(let n = 0;n < partedData.length;n++) {
          let slicedPart = partedData[n];
          decCount -= slicedPart.length;
          let cmd = {
            cmd: `pets_discard`,
            PetID: slicedPart.map(p=>p.id),
          };
          let msg = `Entsorge ${cmd.PetID.length} Ei${(cmd.PetID.length!=1)?`er`:``} von ${maxCount} Ei${(maxCount!=1)?`ern`:``} - Rest: ${decCount} Ei${(decCount!=1)?`er`:``}`;
          works.push(new Work({
              discard: async (cmd) => {
                let isDiscarded = await Connection.POST(cmd);
                BetterBrain.amountEggkills = (BetterBrain.amountEggkills || 0) + (isDiscarded?cmd.PetID.length:0);
                return isDiscarded;
              }
            }, `discard`, [cmd], msg));
          logs(msg, cmd);
        }

        let targetWorker = -1;
        this.workerTargetSelectorsCheckboxes.forEach(n=>{
          if(n.checkbox.checked) targetWorker = parseInt(n.checkbox.getAttribute(`value`));
        });

        if(works.length > 0) {
          if(targetWorker > -1) {
            main.worker.addBunch(works, false, targetWorker);
          } else {
            main.worker.addBunch(works, false);
          }
        }
        this.reset();
      }
      this.reset();
    }
  }

  class Stats {
    constructor() {
      this.updateCreditIncome = this.__updateCreditIncome.bind(this);
      this.updateIncomeTime = this.__updateIncomeTime.bind(this);
      this.updateAverageIncome = this.__updateAverageIncome.bind(this);

      main.tools.createBox(this, `Statistiken`, `Stats`);
      this.box.classList.add(`box_Stats`);

      this.lines = [];

      let curIndex = -1;
      let curTag = ``;
      let curDataName = ``;
      let curTitle = ``;

      /* REGION " RUNTIME " */
      curIndex++;
      curTag = `currentIncomeTime`;
      curTitle = `Laufzeit:`;
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this[`${curTag}Title`] = main.tools.createElement(`div`, `center slim`, curTitle);
      this[`${curTag}Title`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        marginRight: `5px`,
        textAlign: `right`,
      })
      this[`${curTag}`] = main.tools.createElement(`div`, `center slim`, `${main.tools.creditTimeOffset()}`);
      this[`${curTag}`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        textAlign: `left`,
      })
      this.lines[curIndex].in(this[`${curTag}Title`]);
      this.lines[curIndex].in(this[`${curTag}`]);
      /* ENDREGION */
      /* REGION " TOTAL INCOME " */
      curIndex++;
      curTag = `currentIncomeValue`;
      curTitle = `Bot-Einnahmen:`;
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this[`${curTag}Title`] = main.tools.createElement(`div`, `center slim`, curTitle);
      this[`${curTag}Title`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        marginRight: `5px`,
        textAlign: `right`,
      })
      this[`${curTag}`] = main.tools.createElement(`div`, `center slim`, `${main.currentBotIncome.toLocaleString()} Credit${((main.currentBotIncome==1)?``:`s`)}`);
      this[`${curTag}`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        textAlign: `left`,
      })
      this.lines[curIndex].in(this[`${curTag}Title`]);
      this.lines[curIndex].in(this[`${curTag}`]);
      /* ENDREGION */
      /* REGION " AVERAGE INCOME " */
      curIndex++;
      curTag = `currentIncomeAverageValue`;
      curTitle = `Durchschnitt:`;
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this[`${curTag}Title`] = main.tools.createElement(`div`, `center slim`, curTitle);
      this[`${curTag}Title`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        marginRight: `5px`,
        textAlign: `right`,
      })
      this[`${curTag}`] = main.tools.createElement(`div`, `center slim`, `?`);
      this[`${curTag}`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        textAlign: `left`,
      })
      this.lines[curIndex].in(this[`${curTag}Title`]);
      this.lines[curIndex].in(this[`${curTag}`]);
      /* ENDREGION */
      /* REGION " TURNED EGGS " */
      curIndex++;
      curTag = `currentEggturningAmount`;
      curDataName = `turnedEggs`;
      curTitle = `Eier mit Bot gewendet:`;
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this[`${curTag}Title`] = main.tools.createElement(`div`, `center slim`, curTitle);
      this[`${curTag}Title`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        marginRight: `5px`,
        textAlign: `right`,
      })
      this[`${curTag}`] = main.tools.createElement(`div`, `center slim`, `${BetterBrain[`${curDataName}`] || 0}`);
      this[`${curTag}`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        textAlign: `left`,
      });
      this.lines[curIndex].in(this[`${curTag}Title`]);
      this.lines[curIndex].in(this[`${curTag}`]);
      /* ENDREGION */
      /* REGION " REMOVED EGGS " */
      curIndex++;
      curTag = `currentEggthrowingAmount`;
      curDataName = `amountEggkills`;
      curTitle = `Bot-Eier-Kills:`;
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this[`${curTag}Title`] = main.tools.createElement(`div`, `center slim`, curTitle);
      this[`${curTag}Title`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        marginRight: `5px`,
        textAlign: `right`,
      })
      this[`${curTag}`] = main.tools.createElement(`div`, `center slim`, `${BetterBrain[`${curDataName}`] || 0}`);
      this[`${curTag}`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        textAlign: `left`,
      });
      this.lines[curIndex].in(this[`${curTag}Title`]);
      this.lines[curIndex].in(this[`${curTag}`]);
      /* ENDREGION */
      /* REGION " ADOPTS " */
      curIndex++;
      curTag = `currentAdoptsAmount`;
      curDataName = `amountAdopts`;
      curTitle = `Bot-Adoptions:`;
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this[`${curTag}Title`] = main.tools.createElement(`div`, `center slim`, curTitle);
      this[`${curTag}Title`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        marginRight: `5px`,
        textAlign: `right`,
      })
      this[`${curTag}`] = main.tools.createElement(`div`, `center slim`, `${BetterBrain[`${curDataName}`] || 0}`);
      this[`${curTag}`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        textAlign: `left`,
      });
      this.lines[curIndex].in(this[`${curTag}Title`]);
      this.lines[curIndex].in(this[`${curTag}`]);
      /* ENDREGION */
      /* REGION " BOTBREEDS " */
      curIndex++;
      curTag = `currentBreedCount`;
      curDataName = `amountBreed`;
      curTitle = `Bot-Züchtungen:`;
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this[`${curTag}Title`] = main.tools.createElement(`div`, `center slim`, curTitle);
      this[`${curTag}Title`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        marginRight: `5px`,
        textAlign: `right`,
      })
      this[`${curTag}`] = main.tools.createElement(`div`, `center slim`, `${BetterBrain[`${curDataName}`] || 0}`);
      this[`${curTag}`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        textAlign: `left`,
      });
      this.lines[curIndex].in(this[`${curTag}Title`]);
      this.lines[curIndex].in(this[`${curTag}`]);
      /* ENDREGION */
      /* REGION " RENAMINGS " */
      curIndex++;
      curTag = `currentRenamingAmount`;
      curDataName = `amountRenames`;
      curTitle = `Bot-Umbenennungen:`;
      this.lines[curIndex] = main.tools.createElement(`div`, ``);
      this[`${curTag}Title`] = main.tools.createElement(`div`, `center slim`, curTitle);
      this[`${curTag}Title`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        marginRight: `5px`,
        textAlign: `right`,
      })
      this[`${curTag}`] = main.tools.createElement(`div`, `center slim`, `${BetterBrain[`${curDataName}`] || 0}`);
      this[`${curTag}`].css({
        display: `inline-block`,
        width: `CALC(50% - 10px)`,
        textAlign: `left`,
      });
      this.lines[curIndex].in(this[`${curTag}Title`]);
      this.lines[curIndex].in(this[`${curTag}`]);
      /* ENDREGION */

      this.btn_reset = main.tools.createElement(`div`, `button`, `Zurücksetzen`);
      this.btn_reset.css({
        width: `CALC(30% - 10px)`,
        display: `inline-block`,
      })
      this.btn_reset.addEventListener(`click`, () => {
        if(!this.btn_reset.classList.contains(`disabled`)) {
          if(confirm(`Bist du dir sicher, dass du deine Statistiken komplett zurücksetzen willst?`)) {
            startTime = (new Date()).getTime().toString(36);
            main.currentBotIncome = 0;
            BetterBrain.turnedEggs = 0;
            BetterBrain.amountBreed = 0;
            BetterBrain.amountRenames = 0;
            BetterBrain.amountEggkills = 0;
            BetterBrain.amountAdopts = 0;
            Brain.write(`__GLOBAL__.creditStartTime`, startTime);
            Brain.write(`__GLOBAL__.creditGains`, main.currentBotIncome);
            this.updateIncomeTime();
            this.updateCreditIncome();
          }
        }
      }, true);

      this.btn_png = main.tools.createElement(`div`, `button`, `Statistik-PNG erzeugen`);
      this.btn_png.css({
        width: `CALC(30% - 10px)`,
        display: `inline-block`,
      })
      this.btn_png.addEventListener(`click`, () => {
        if(!this.btn_png.classList.contains(`disabled`)) {
          this.btn_png.classList.add(`disabled`);

          // Image Export
        }
      }, true);

      this.box.in(this.boxTitle);
      this.box.in(this.boxprogress.element);
      this.lines.map(n=>{this.box.in(n);return n;});
      this.box.in(this.btn_reset);

      setInterval(this.updateIncomeTime, 100);
    }
    __updateIncomeTime() {
      this.currentIncomeTime.innerHTML = `${main.tools.creditTimeOffset()}`;
      this.currentEggturningAmount.innerHTML = BetterBrain.turnedEggs || 0;
      this.currentBreedCount.innerHTML = BetterBrain.amountBreed || 0;
      this.currentRenamingAmount.innerHTML = BetterBrain.amountRenames || 0;
      this.currentEggthrowingAmount.innerHTML = BetterBrain.amountEggkills || 0;
      this.currentAdoptsAmount.innerHTML = BetterBrain.amountAdopts || 0;
      this.updateAverageIncome();
    }
    __updateCreditIncome() {
      this.currentIncomeValue.innerHTML = `${main.currentBotIncome.toLocaleString()} Credit${((main.currentBotIncome==1)?``:`s`)}`;
      this.updateAverageIncome();
    }
    __updateAverageIncome() {
      let startTimeParsed = parseInt(startTime, 36);
      let startTimeDate = new Date();
      startTimeDate.setTime(startTimeParsed);
      let offset = ((((new Date()).getTime() / 3600000) - (startTimeDate / 3600000)));
      let val = (main.currentBotIncome / offset);
      let dot = (val - Math.floor(val)).toFixed(1).substr(2);
      this.currentIncomeAverageValue.innerHTML = `${Math.floor(val)},${dot} cr/h`;
    }
  }
  class AccountList {
    constructor() {
      this.buttons = [];
      this.box = main.tools.createElement(`div`, `catbox fat center block${(Brain.read(`AccountList.expanded`, 0)==1)?``:` hidecontents`}`);
      this.box.classList.add(`box_AccountList`);
      this.boxTitle = main.tools.createElement(`div`, ``, `Accounts`);
      this.boxTitle.addEventListener(`click`, ()=>{this.box.classList.toggle(`hidecontents`);Brain.write(`AccountList.expanded`, (!this.box.classList.contains(`hidecontents`))?1:0);}, true);
      this.boxTitle.style.cursor = `pointer`;

      this.boxprogress = main.tools.createProgressbar(0, 1);
      this.boxprogress.element.classList.add(`progress_slot`);

      this.buttonList = main.tools.createElement(`div`);

      let logins = Brain.read(`__GLOBAL__.generated_logins`, []);
      for(let login in logins) {
        let button = main.tools.createElement(`div`, `button preventWrap`, `${logins[login].name}`);
        button.addEventListener(`click`, this.generateAccount, true);
        button.style.display = `inline-block`;
        button.style.width = `CALC(25% - 10px)`;
        button.addEventListener(`click`, () => {
          for(let n = 0;n < this.buttons.length;n++) {
            if(this.buttons[n].classList.contains(`disabled`)) {
              return false;
            }
          }
          this.buttons[login].classList.add(`disabled`);
          main.tools.quickLogin(logins[login].username, logins[login].password);
        });
        this.buttons.push(button);
      }

      this.box.in(this.boxTitle);
      this.box.in(this.boxprogress.element);

      for(let buttonIndex = 0;buttonIndex < this.buttons.length;buttonIndex++) {
        this.buttonList.in(this.buttons[buttonIndex]);
      }

      this.box.in(this.buttonList);
    }
  }

  class BoxStyler {
    constructor() {
      this.default = { r:  59, g:  96, b: 128, }
      this.styleableElements = [
        {title: `Arbeiter`,          tag: `Worker`,           mainName: `worker`},
        {title: `Zuchtstation`,      tag: `BreedStation`,     mainName: `breeder`},
        {title: `Adopter`,           tag: `AutoAdopter`,      mainName: `adopter`},
        {title: `Kantine`,           tag: `JumboSchreiner`,   mainName: `jumboschreiner`},
        {title: `Namer`,             tag: `Namer`,            mainName: `namer`},
        {title: `Sorter`,            tag: `Sorter`,           mainName: `sorter`},
        {title: `TattooStudio`,      tag: `TattooStudio`,     mainName: `tattooer`},
        {title: `Oviraptor`,         tag: `EggCrusher`,       mainName: `crusher`},
        {title: `Stats`,             tag: `Stats`,            mainName: `stats`},
        {title: `Account-Generator`, tag: `AccountGenerator`, mainName: `accountGenerator`},
        {title: `Account-Liste`,     tag: `AccountList`,      mainName: `accountList`},
      ];
      this.save = this.__save.bind(this);
      this.show = this.__show.bind(this);
      this.updateColorView = this.__updateColorView.bind(this);

      this.box = main.tools.createElement(`div`, `ovipets_dialogue hidden`);
      this.box.style.height = `300px`;
      this.box.style.minWidth = `400px`;
      this.box.style.zIndex = `1220050`;
      this.content = main.tools.createElement(`div`, `catbox`).to(this.box);
      this.content.css({
        display: `flex`,
        justifyContent: `space-evenly`,
        flexFlow: `row wrap`,
        overflow: `auto`,
      })

      this.buttons = {};
      this.buttons.save = main.tools.createElement(`div`, `button okaybutton`, `OK`).to(this.box);
      this.buttons.save.addEventListener(`click`, this.save, true);

      this.title = main.tools.createElement(`div`, `center`, `Box-Farben`);
      this.box.in(this.title);

      document.body.in(this.box);

      this.lines = [];

      for(let i = 0;i < this.styleableElements.length;i++) {
        let curElement = this.styleableElements[i];
        let curLine = main.tools.createElement(`div`, `button`, ``);
        curLine.css({
          cursor: `initial`,
          boxSizing: `border-box`,
          display: `inline-flex`,
          flexFlow: `row nowrap`,
          justifyContent: `space-between`,
          alignItems: `stretch`,
          alignContent: `stretch`,
          marginBottom: `2px`,
          width: `CALC(100% - 10px)`,
          height: `40px`,
        });
        let title = main.tools.createElement(`div`, ``, curElement.title).to(curLine);
        title.css({
          display: `inline-flex`,
          flexFlow: `column nowrap`,
          boxSizing: `border-box`,
          width: `250px`
        })
        let loadedColor_R = BetterBrain[`col_${curElement.tag}_r`] || this.default.r;
        let loadedColor_G = BetterBrain[`col_${curElement.tag}_g`] || this.default.g;
        let loadedColor_B = BetterBrain[`col_${curElement.tag}_b`] || this.default.b;
        let col = new Clr(loadedColor_R, loadedColor_G, loadedColor_B);
        let c = col.toHexString();

        let colorPick = main.tools.createElement(`input`, ``, ``).to(curLine);
        colorPick.setAttribute(`type`, `color`);
        colorPick.setAttribute(`value`, `${c}`);
        colorPick.css({
          display: `none`,
        });
        colorPick.setAttribute(`id`, `picker_${i}`)
        colorPick.addEventListener(`change`, () => {
          let cpv = new Clr(colorPick.value);
          colorPreview.css({
            background: `rgba(CALC(${cpv.r} / 2), CALC(${cpv.g} / 2), CALC(${cpv.b} / 2), 1)`,
            border: `3px solid rgba(${cpv.r}, ${cpv.g}, ${cpv.b}, 1)`,
            boxShadow: `2px 2px 5px rgba(CALC(${cpv.r} / 4), CALC(${cpv.g} / 4), CALC(${cpv.b} / 4), 0.5)`,
          });
          BetterBrain[`col_${curElement.tag}_r`] = cpv.r;
          BetterBrain[`col_${curElement.tag}_g`] = cpv.g;
          BetterBrain[`col_${curElement.tag}_b`] = cpv.b;
          colorPreview.innerHTML = `${cpv.r}, ${cpv.g}, ${cpv.b}`;
          this.updateColorView();
        }, true);

        let colorPreview = main.tools.createElement(`label`, `center`, `${col.r}, ${col.g}, ${col.b}`).to(curLine);
        colorPreview.setAttribute(`for`, `picker_${i}`);
        colorPreview.setAttribute(`title`, `Wähle Farbgebung für ${curElement.title}`);
        colorPreview.css({
          display: `inline-flex`,
          flexFlow: `column nowrap`,
          alignItems: `stretch`,
          alignContent: `stretch`,
          textAlign: `center`,
          boxSizing: `border-box`,
          borderRadius: `7px`,
          width: `225px`,
          marginLeft: `5px`,
          marginRight: `5px`,
          cursor: `pointer`,
        });
        colorPreview.css({
          background: `rgba(CALC(${col.r} / 2), CALC(${col.g} / 2), CALC(${col.b} / 2), 1)`,
          border: `3px solid rgba(${col.r}, ${col.g}, ${col.b}, 1)`,
          boxShadow: `2px 2px 5px rgba(CALC(${col.r} / 4), CALC(${col.g} / 4), CALC(${col.b} / 4), 0.5)`,
        });

        let colorReset = main.tools.createElement(`div`, `button`, `X`).to(curLine);
        colorReset.setAttribute(`title`, `Setze Farbgebung für ${curElement.title} zurück`);
        colorReset.css({
          display: `inline-flex`,
          flexFlow: `column nowrap`,
          alignItems: `stretch`,
          alignContent: `stretch`,
          textAlign: `center`,
          boxSizing: `border-box`,
          borderRadius: `7px`,
          width: `45px`,
          height: `CALC(100% - 2px)`,
          marginTop: `0px`,
          paddingTop: `0px`,
          marginBottom: `0px`,
          marginLeft: `5px`,
          marginRight: `5px`,
        });
        colorReset.addEventListener(`click`, () => {
          let cpv = new Clr(this.default.r, this.default.g, this.default.b);
          colorPreview.css({
            background: `rgba(CALC(${cpv.r} / 2), CALC(${cpv.g} / 2), CALC(${cpv.b} / 2), 1)`,
            border: `3px solid rgba(${cpv.r}, ${cpv.g}, ${cpv.b}, 1)`,
            boxShadow: `2px 2px 5px rgba(CALC(${cpv.r} / 4), CALC(${cpv.g} / 4), CALC(${cpv.b} / 4), 0.5)`,
          });
          BetterBrain[`col_${curElement.tag}_r`] = cpv.r;
          BetterBrain[`col_${curElement.tag}_g`] = cpv.g;
          BetterBrain[`col_${curElement.tag}_b`] = cpv.b;
          colorPreview.innerHTML = `${cpv.r}, ${cpv.g}, ${cpv.b}`;
          this.updateColorView();
        }, true);

        this.lines[i] = curLine;
        this.content.in(this.lines[i]);
      }
    }
    async __save() {
      this.box.classList.remove(`visible`);
      this.box.classList.add(`hidden`);
    }
    async __show() {
      this.box.classList.remove(`hidden`);
      this.box.classList.add(`visible`);
    }
    async __updateColorView() {
      let configData = `:root {\n`;
      let entries = [];
      for(let i = 0;i < this.styleableElements.length;i++) {
        let curElement = this.styleableElements[i];

        entries.push(`
        /* ${curElement.title} */
        --col_${curElement.tag}_r: ${BetterBrain[`col_${curElement.tag}_r`] || this.default.r}  ;
        --col_${curElement.tag}_g: ${BetterBrain[`col_${curElement.tag}_g`] || this.default.g}  ;
        --col_${curElement.tag}_b: ${BetterBrain[`col_${curElement.tag}_b`] || this.default.b}  ;

        --col_${curElement.tag}_a:   1.0;

        --col_${curElement.tag}_p:   4  ;
        --col_${curElement.tag}_t:   2  ;

        `);
      }
      configData += entries.join(`\n`) + `\n}`;
      main.config.boxStyler.innerHTML = configData;
    }
  }
  /* ENDREGION */
  /* REGION "Main Data" */
  var main = {
    creditIncrease: (val) => {
      main.currentBotIncome = parseInt(Brain.read(`__GLOBAL__.creditGains`, `0`));
      Brain.write(`__GLOBAL__.creditGains`, (main.currentBotIncome + val));
      main.currentBotIncome = parseInt(Brain.read(`__GLOBAL__.creditGains`, `0`));
      main.stats.updateCreditIncome();
    },
    tools: {
      async sfx (sfx = null) {
        let selectedsound = Brain.read(`__GLOBAL__.notify.sound`, `-`);
        if(sfx !== null) selectedsound = sfx;
        if(typeof main.config.defaults.sounds[selectedsound] !== undefined) {
          let audio = new Audio(main.config.defaults.sounds[selectedsound]);
          audio.volume = 0.5;
          audio.play();
        }
      },

      async descriptionSetter (pet, desc) {
        let cmd = {
          cmd: `pet_presentation`,
          PetID: pet,
          Presentation: desc.conv()
        };
        let result = await Connection.POST(cmd);
        return result;
      },
      async nameGenerator() {
        let curNameConfig = Brain.read(`__GLOBAL__.nameConfig`, `mixed/short/`);

        main.config.leftNames = main.config.leftNames || {};
        main.config.leftNames[`${curNameConfig}`] = main.config.leftNames[`${curNameConfig}`] || [];

        let rx = /\<li\>(.{3,25}?)\<\/li\>/gi;

        let maxAmount = 15;

        let antiEndlessLoopCounter = Math.ceil(maxAmount / 20);

        if(main.config.leftNames[`${curNameConfig}`].length == 0) {
          while(main.config.leftNames[`${curNameConfig}`].length < maxAmount && antiEndlessLoopCounter > 0) {
            antiEndlessLoopCounter--;
            let rs = await Connection.GET(`https://www.fantasynamegen.com/${curNameConfig}`);
            let entry = null;
            while(entry = rx.exec(rs.responseText)) {
              main.config.leftNames[`${curNameConfig}`].push(entry[1].trim());
            }
          }
        }
        if(main.config.leftNames[`${curNameConfig}`].length == 0) {
          return `---`;
        }
        return main.config.leftNames[`${curNameConfig}`].shift();
      },
      async unlocker(pi, en) {
        let cmd = {
          cmd: `pet_lock`,
          PetID: pi,
          Remove: `1`
        };
        if(en > -1) cmd.Enclosure = en;
        let result = await Connection.POST(cmd);
        return result;
      },

      parting(array, size) {
        let result = [];
        let toSpliceElement = [...array]; // Erstellt eine Kopie des Arrays, um das Original nicht zu modifizieren
        while (toSpliceElement.length > 0) {
          result.push(toSpliceElement.splice(0, size));
        }
        return result;
      },

      modifyData(data) {
        return data;
      },
      modifyResponseData(responseData) {
        if(responseData.output !== null && typeof responseData.output !== `undefined`) {
          let rx = /(<ui:r id = "([0-9a-f]{24})">.*?<ui:d class = "actions">)/gmi;
          let rp = `$1<ui:input type="button" label="COPY URL" style = "font-size:14px;" action="navigator.clipboard.writeText('https://ovipets.com/#!/?event=$2');" icon = "ui-icon-link" />`;
          if(responseData.output instanceof Array) {
            try {
              responseData.output[0] = responseData.output[0].replace(rx, rp);
            } catch (e) {
            }
          } else {
            try {
              responseData.output = responseData.output.replace(rx, rp);
            } catch (e) {
            }
          }
        }
        let s = responseData.output;
        if(s !== null && s !== undefined && s.toString().indexOf(`id = 'notifications' last = '`) > -1) {

          let rx1 = /notifications' last = '(\d+)' notifyts/gi;
          let rx2 = /'(old|new)'.*?([a-f0-9]{24}).*?age' title = '(.*?)'.*?p>(.*?)\<\/p/gi;
          let rsl = [];
          let highestStamp = -1;
          let notify = false;
          while(rsl = rx2.exec(s.toString())) {
            if(rsl[1] == `new`) {
              let eventID = rsl[2];
              let stamp = rsl[3].toTimestamp();
              let lastKnownStamp = parseInt(Brain.read(`__GLOBAL__.laststamp`, -1));
              if(stamp > highestStamp) {
                highestStamp = stamp;
              }
              if(stamp > lastKnownStamp) {
                notify = true;
                break;
              }
            }
          }
          if(notify) {
            Brain.write(`__GLOBAL__.laststamp`, highestStamp);
            main.tools.sfx();
          }
        }
        if(Brain.read(`__GLOBAL__.breedhack`, 1)===1) {
          if(responseData.output !== null && typeof responseData.output !== `undefined`) {
            if(responseData.output.indexOf(`id = "breeding"`) > -1) {
              if(responseData.output.indexOf("ui_action_cmdExec('pet_breed'") > -1) {
                let g = /\"var self = this; ui_action_confirm\(ui\.dialog.+?function\(\)\{(ui_action_cmdExec\('pet_breed','FPetID=\d+&amp;MPetID=\d+',self.form,).*?\"/gi;
                responseData.output = responseData.output.replace(g, `"$1()=>{});document.querySelectorAll('.ui-tooltip').forEach(a=>a.parentNode.removeChild(a));this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);"`);
              }
            }
          }
        }
        if(Brain.read(`__GLOBALf/<__.enclosureMover`, 1)===1) {
          if(s !== null && typeof s !== `undefined`) {
            if(s.indexOf(`enclosure_update`) > -1) {
              responseData.output = responseData.output.replace(
                new RegExp(`(\<ui:input><\/ui:fieldset>)(.*)(<\/ui:list>)(<ui:fieldset.*<\/ui:fieldset>)`, `gis`),
                `$1$4$2$3`
              );
            }
          }
        }
        if(s !== null && typeof s !== `undefined`) {
          if(s.indexOf(`enclosure_update`) > -1 || s.indexOf(`hatchery_update`) > -1) {
            let replaceRegex = /(<ui:section title = \"Pets-\d+\" id = \"pets-\d+">|<ui:section title = ".*?" id = "hatchery">)(.*?)$/gis;
            let countRegex = /PetID\[\]' value = '\d+'/gi;
            let amount = (s.match(countRegex) || []).length;
            responseData.output = responseData.output.replace(replaceRegex, `$1
              <div style='box-sizing:border-box;background:rgba(170, 200, 190, 0.75);width:450px;position:relative;left:CALC(50% - 225px);border:2px solid black;border-radius:7px;overflow:hidden;'>
                <div style='overflow:show;width:${Math.floor(450*(amount/1000))}px;background:rgba(255, 220, 150, 1);'>
                  <div style='font-size:14px;text-align:center;overflow:show;width:450px;color:black;'>
                    Es befinde${(amount==1)?`t`:`n`} sich aktuell ${amount} Pet${(amount==1)?``:`s`} in ${(s.indexOf(`hatchery_update`) > -1)?`der Hatchery`:`diesem Stall`}${
                      (()=>{if(amount < 1000) {
                        return `<br />Es ist noch Platz für <span style='cursor:pointer;' onClick='navigator.clipboard.writeText(${1000-amount});'>${1000-amount}</span> Pet${(1000-amount==1)?``:`s`}`;
                      }return ``;})()
                    }
                  </div>
                </div>
              </div>
              $2`);
          }
        }
        return responseData;
      },

      uploadAvatar (base64Image) {
        return new Promise((resolve, reject) => {
          const boundary = `---------------------------102710908511985237864005607052`;
          const base64ToBinary = (base64Data) => {
            const byteString = atob(base64Data.split(',')[1]);
            let binaryData = '';
            for (let i = 0; i < byteString.length; i++) {
              binaryData += String.fromCharCode(byteString.charCodeAt(i));
            }
            return binaryData;
          };
          const fileBinary = base64ToBinary(base64Image);

          // Multipart-Body zusammenstellen
          let data = '';
          data += '--' + boundary + '\r\n';
          data += 'Content-Disposition: form-data; name="SizeX"\r\n\r\n200\r\n';
          data += '--' + boundary + '\r\n';
          data += 'Content-Disposition: form-data; name="SizeY"\r\n\r\n200\r\n';
          data += '--' + boundary + '\r\n';
          data += 'Content-Disposition: form-data; name="PosX"\r\n\r\n0\r\n';
          data += '--' + boundary + '\r\n';
          data += 'Content-Disposition: form-data; name="PosY"\r\n\r\n0\r\n';
          data += '--' + boundary + '\r\n';
          data += 'Content-Disposition: form-data; name="Upload"; filename="avatar.jpg"\r\n';
          data += 'Content-Type: image/jpeg\r\n\r\n';
          data += fileBinary + '\r\n';
          data += '--' + boundary + '\r\n';
          data += 'Content-Disposition: form-data; name="cmd"\r\n\r\navatar_upl\r\n';
          data += '--' + boundary + '\r\n';
          data += 'Content-Disposition: form-data; name=""\r\n\r\nundefined\r\n';
          data += '--' + boundary + '--\r\n';

          GM_xmlhttpRequest({
            method: 'POST',
            url: `https://ovipets.com/cmd.php?${main.config.crack.substring(1)}`,
            ignoreCache: true,
            headers: {
              'Content-Type': 'multipart/form-data; boundary=' + boundary,
            },
            data: data,
            binary: true,
            onload: function(response) {
              resolve(response.responseText.indexOf(`status":"success`) > -1);
            },
            onerror: function(response) {
              resolve(false);
            }
          });
        });
      },
      quickLogin (username, password, ignoreReload = false) {
        let data = {
          "cmd": `login`,
          "Action": `login`,
          "Email": `${username}`,
          "Password": `${password}`
        };
        const formDataHolder = new CustomFormData();
        for(var postName in data) {
          formDataHolder.append(postName, data[postName]);
        }
        let cmd = {
          url: `/cmd.php?!=${main.config.crack.substring(1)}`,
          data: formDataHolder.toString(),
          method: `POST`,
          ignoreCache: true,
          headers: {
            "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0`,
            "Referer": `https://ovipets.com/`,
            "Cache-Control": `no-cache`,
            "Pragma": `no-cache`,
            "Content-Type": `application/x-www-form-urlencoded`,
            "Cookie": ``
          },
          onload: (response) => {
            logs(`[main.tools.quickLogin] > `, response);
            if(!ignoreReload) {
              window.history.go(0);
            }
          }
        };
        GM_xmlhttpRequest(cmd);
      },

      createElement (type, className = ``, content = null, target = null, action = null) {
        let element = document.createElement(type);
        element.className = className;
        if(action !== null) element.addEventListener(`click`, action, true);
        if(content !== null) element.innerHTML = content;
        if(target !== null) element.to(target);
        return element;
      },
      createToggle (id, text, callback, state, target) {
        text = text || null;
        callback = callback || null;
        state = state || false;
        target = target || null;
        let inputHiddenElement = main.tools.createElement(`input`, `hidden`);
        inputHiddenElement.setAttribute(`id`, id);
        inputHiddenElement.setAttribute(`type`, `checkbox`);
        inputHiddenElement.checked = state;
        if(callback !== null) inputHiddenElement.addEventListener(`change`, callback, true);
        let inputLabelElement = main.tools.createElement(`label`, `button preventWrap`, (text!==null)?text:``);
        if(text === null) {
          inputLabelElement.innerHTML = `&nbsp;`;
        }
        inputLabelElement.setAttribute(`for`, id);
        if(target !== null) {
          target.in(inputHiddenElement);
          target.in(inputLabelElement);
        }
        return([inputHiddenElement, inputLabelElement]);
      },
      createSelection (field, start, end) {
        if( field.createTextRange ) {
          var selRange = field.createTextRange();
          selRange.collapse(true);
          selRange.moveStart('character', start);
          selRange.moveEnd('character', end);
          selRange.select();
          field.focus();
        } else if( field.setSelectionRange ) {
          field.focus();
          field.setSelectionRange(start, end);
        } else if( typeof field.selectionStart != 'undefined' ) {
          field.selectionStart = start;
          field.selectionEnd = end;
          field.focus();
        }
      },
      createProgressbar (currentValue, maximumValue) {
        let element = document.createElement(`div`);element.classList.add(`progressbar`);
        element.setAttribute(`data-current`, currentValue);
        element.setAttribute(`data-maximum`, maximumValue);
        let innerbar = document.createElement(`div`);innerbar.classList.add(`progress`);
        let percent = Math.min(100, Math.max(0, 100 * (currentValue / maximumValue)));
        innerbar.style.width = `${percent}%`;
        element.in(innerbar);
        return {
          setValue: (function(newValue) {
            let max = parseInt(this.getAttribute(`data-maximum`));
            this.setAttribute(`data-current`, newValue);
            let percent = Math.min(100, Math.max(0, 100 * (newValue / max)));
            innerbar.style.width = `${percent}%`;
          }).bind(element),
          increase: (function() {
            let max = parseInt(this.getAttribute(`data-maximum`));
            let cur = parseInt(this.getAttribute(`data-current`)) + 1;
            this.setAttribute(`data-current`, cur);
            let percent = Math.min(100, Math.max(0, 100 * (cur / max)));
            innerbar.style.width = `${percent}%`;
          }).bind(element),
          curValue: (function() {
            let cur = parseInt(this.getAttribute(`data-current`));
            return cur;
          }).bind(element),
          maxValue: (function() {
            let max = parseInt(this.getAttribute(`data-maximum`));
            return max;
          }).bind(element),
          element: element
        };
      },
      createTrackbar (currentValue, steps) {
        let element = document.createElement(`div`);element.classList.add(`trackbar`);
        element.setAttribute(`data-current`, currentValue);
        let innerbar = document.createElement(`div`);innerbar.classList.add(`progress`);
        let percent = Math.min(100, Math.max(0, currentValue * 100));
        innerbar.style.width = `${percent}%`;
        element.in(innerbar);
        return new TrackBar(element, innerbar, currentValue, 1, steps);
      },
      createBox(targetElement, title, tag, onToggle = () => {}) {
        targetElement.box = main.tools.createElement(`div`, `catbox fat center block${(Brain.read(`${tag}.expanded`, 0)==1)?``:` hidecontents`}`);
        targetElement.boxTitle = main.tools.createElement(`div`, ``, `${title}`);
        targetElement.boxTitle.addEventListener(`click`, ()=>{targetElement.box.classList.toggle(`hidecontents`);Brain.write(`${tag}.expanded`, (!targetElement.box.classList.contains(`hidecontents`))?1:0);}, true);
        targetElement.boxTitle.style.cursor = `pointer`;
        targetElement.boxprogress = main.tools.createProgressbar(0, 1);
        targetElement.boxprogress.element.classList.add(`progress_slot`);
        targetElement.box.in(targetElement.boxTitle);
        targetElement.box.in(targetElement.boxprogress.element);
        targetElement.tag = tag;
      },
      createTargetSelectors(targetElement, subclass = null) {
        if(subclass == null) subclass = `sys${(Math.random() * 9999999999).ToString(36)}`;
        targetElement.workerTargetSelectors = main.tools.createElement(`div`);
        targetElement.workerTargetSelectors.css({
          float: `right`,
          width: `96px`,
          height: `24px`,
          marginLeft: `-96px`,
          marginRight: `-3px`,
          position: `relative`,
          top: `-20px`,
          textAlign: `right`,
        })
        targetElement.workerTargetSelectorsCheckboxes = [];
        for(let i = 0;i < main.worker.workerElements.length;i++) {
          let t_checkbox = main.tools.createElement(`input`, `hidden`);
          t_checkbox.setAttribute(`type`, `checkbox`);
          t_checkbox.setAttribute(`name`, `worker_target_selector_${subclass}`);
          t_checkbox.setAttribute(`id`, `worker_target_selector_${subclass}_${i}`);
          t_checkbox.setAttribute(`value`, i);
          t_checkbox.addEventListener(`change`, () => {
            targetElement.workerTargetSelectorsCheckboxes.forEach(n=>{
              if(parseInt(n.checkbox.getAttribute(`value`)) != i) {
                n.checkbox.checked = false;
              }
            });
          }, true);
          let t_label = main.tools.createElement(`label`, `minibutton`, i+1);
          t_label.setAttribute(`for`, `worker_target_selector_${subclass}_${i}`);
          targetElement.workerTargetSelectorsCheckboxes[i] = {
            checkbox: t_checkbox,
            label: t_label
          };
          targetElement.workerTargetSelectors.in(targetElement.workerTargetSelectorsCheckboxes[i].checkbox);
          targetElement.workerTargetSelectors.in(targetElement.workerTargetSelectorsCheckboxes[i].label);
        }
      },

      async createTabSelection(responseTrigger, cancelTrigger = () => {}, user_id = -1, list_hatchery = false, initialChecked = [], single = false) {
        let encList = [];
        if(user_id > -1) {
          encList = await Enclosures.getEnclosures(user_id);
        } else {
          encList = await Enclosures.getEnclosures();
        }
        user_id = (user_id==-1)?main.user.uid:user_id;
        if(list_hatchery) encList.unshift({ id: `-1`, name: `​{ Brutplatz }`, user: `${user_id}` });

        let hash = (new Date()).getTime().toString(36).toLowerCase();
        let selectionList = [];
        let tabbList = [];

        let nothingFound = main.tools.createElement(`div`, `center hidden`, `Keine Tabs gefunden`);

        const filterEntries = () => {
          if(searchBar.value.length > 0) {
            let visible = 0;
            tabbList.forEach(t=>{
              if(t.innerHTML.indexOf(searchBar.value) > -1) {
                visible += 1;
                t.classList.remove(`hidden`);
              } else {
                t.classList.add(`hidden`);
              }
            });
            if(visible == 0) {
              nothingFound.classList.remove(`hidden`);
            } else {
              nothingFound.classList.add(`hidden`);
            }
          } else {
            tabbList.forEach(t=>t.classList.remove(`hidden`));
          }
        }

        let tabsOutputWrap = main.tools.createElement(`div`, `button`, ``);
        tabsOutputWrap.css({
          height: `initial`,
          cursor: `initial`,
          whiteSpace: `initial`,
          width: `CALC(100% - 10px)`,
        })

        let searchBar = main.tools.createElement(`input`, `button`, ``);
        searchBar.setAttribute(`type`, `text`);
        searchBar.setAttribute(`placeholder`, `Suche`);
        searchBar.setAttribute(`value`, ``);
        searchBar.css({
          width: `CALC(100% - 252px)`,
          cursor: `initial`,
          display: `inline-block`,
          whiteSpace: `initial`,
          padding: `3px`,
        });

        searchBar.addEventListener(`keyup`, filterEntries, true);
        searchBar.addEventListener(`keydown`, filterEntries, true);
        searchBar.addEventListener(`change`, filterEntries, true);

        let invertSelection = main.tools.createElement(`div`, `button`, `Auswahl umkehren`, null, () => {
          selectionList.forEach(l=>{l.checked=!l.checked});
        });
        invertSelection.css({
          width: `190px`,
          padding: `1px`,
          textAlign: `center`,
          display: `block`,
          float: `right`,
        });

        let clearSearch = main.tools.createElement(`div`, `button`, `X`, null, () => {
          searchBar.setAttribute(`value`, ``);
          searchBar.value = ``;
          filterEntries();
        });
        clearSearch.css({
          width: `32px`,
          padding: `3px`,
          textAlign: `center`,
          display: `block`,
          float: `left`,
        });
        clearSearch.setAttribute(`title`, `Suche/Filter löschen`);

        let tabsOutput = main.tools.createElement(`div`, `button`, ``);
        tabsOutput.css({
          height: `initial`,
          cursor: `initial`,
          whiteSpace: `initial`,
          width: `CALC(100% - 10px)`,
          maxHeight: `300px`,
          overflowY: `scroll`,
        });

        let tabActivityFunction = function(a, c) {};
        if(single) {
          tabActivityFunction = function(a, c) {
            let t = this;
            c.forEach(n=>n.checked=(n!==t)?0:n.checked);
            if(t.checked) {
              a.classList.remove(`disabled`);
            } else {
              a.classList.add(`disabled`);
            }
          };
        }

        for(let i = 0;i < encList.length;i++) {
          let chb = null, chl = null;
          let isChecked = false;
          if(initialChecked instanceof Array) {
            if(initialChecked.filter((entry) => {
              let result = false;
              if(encList[i].id.toString() == entry.toString()) {
                result = true;
              } else if(encList[i].name.indexOf(entry.toString()) > -1) {
                result = true;
              }
              return result;
            }).length > 0) isChecked = true;
          } else if (initialChecked == true) {
            isChecked = true;
          }
          [chb, chl] = main.tools.createToggle(`tab_select_${i}_entry_${hash}`, `${encList[i].name}`, () => {
            let c = tabActivityFunction.bind(chb);
            c(acceptButton, selectionList);
          }, isChecked, tabsOutput);
          chb.setAttribute(`value`, `${encList[i].id}`);
          chl.css({
            display: `inline-block`,
            textAlign: `center`,
            padding: `3px`,
          })
          chl.setAttribute(`title`, `Tab-ID: ${encList[i].id}\nTab-Position: ${parseInt(i) + 1}\nTab-Bezeichnung: '${encList[i].name}'`);
          selectionList.push(chb);
          tabbList.push(chl);
        }
        tabsOutput.in(nothingFound);

        let tabsButtons = main.tools.createElement(`div`, ``, ``);
        tabsButtons.css({
          display: `flex`,
          flexDirection: `row`,
          flexWrap: `nowrap`,
          justifyContent: `space-between`,
          alignContent: `space-between`,
          alignItems: `flex-start`,
        })

        let cancelButton = main.tools.createElement(`div`, `button`, `Abbrechen`, tabsButtons, () => {
          tabsOutputWrap.classList.add(`hidden`);
          try{
            tabsOutputWrap.remove();
          } catch(e) {}
          tabsOutputWrap = null;
          cancelTrigger();
        });
        cancelButton.css({
          textAlign: `center`,
          width: `15%`,
          padding: `3px`,
        })

        let spaceBetween = main.tools.createElement(`div`, ``, ``).to(tabsButtons);

        let acceptButton = main.tools.createElement(`div`, `button${(single)?` disabled`:``}`, `Annehmen`, tabsButtons, () => {
          if(!acceptButton.classList.contains(`disabled`) || !single) {
            let checkedBoxes = [...selectionList.filter(sel=>sel.checked).map(sel=>{return {id: sel.getAttribute(`value`), uid: user_id}})];
            tabsOutputWrap.classList.add(`hidden`);
            try{
              tabsOutputWrap.remove();
            } catch(e) {}
            tabsOutputWrap = null;
            responseTrigger(checkedBoxes);
          }
        });
        acceptButton.css({
          textAlign: `center`,
          width: `15%`,
          padding: `3px`,
        })

        tabsOutputWrap.in(searchBar);
        tabsOutputWrap.in(clearSearch);
        tabsOutputWrap.in(invertSelection);
        tabsOutputWrap.in(tabsOutput);
        tabsOutputWrap.in(tabsButtons);

        return tabsOutputWrap;
      },
      async createMultiSelection(data, responseTrigger, cancelTrigger = () => {}, initialChecked = [], single = false) {
        let hash = (new Date()).getTime().toString(36).toLowerCase();
        let selectionList = [];
        let tabbList = [];

        let nothingFound = main.tools.createElement(`div`, `center hidden`, `Keine Einträge gefunden`);

        const filterEntries = () => {
          if(searchBar.value.length > 0) {
            let visible = 0;
            tabbList.forEach(t=>{
              if(t.innerHTML.indexOf(searchBar.value) > -1) {
                visible += 1;
                t.classList.remove(`hidden`);
              } else {
                t.classList.add(`hidden`);
              }
            });
            if(visible == 0) {
              nothingFound.classList.remove(`hidden`);
            } else {
              nothingFound.classList.add(`hidden`);
            }
          } else {
            tabbList.forEach(t=>t.classList.remove(`hidden`));
          }
        }

        let tabsOutputWrap = main.tools.createElement(`div`, `button`, ``);
        tabsOutputWrap.css({
          height: `initial`,
          cursor: `initial`,
          whiteSpace: `initial`,
          width: `CALC(100% - 10px)`,
        })

        let searchBar = main.tools.createElement(`input`, `button`, ``);
        searchBar.setAttribute(`type`, `text`);
        searchBar.setAttribute(`placeholder`, `Suche`);
        searchBar.setAttribute(`value`, ``);
        searchBar.css({
          width: `CALC(100% - 252px)`,
          cursor: `initial`,
          display: `inline-block`,
          whiteSpace: `initial`,
          padding: `3px`,
        });

        searchBar.addEventListener(`keyup`, filterEntries, true);
        searchBar.addEventListener(`keydown`, filterEntries, true);
        searchBar.addEventListener(`change`, filterEntries, true);

        let invertSelection = main.tools.createElement(`div`, `button`, `Auswahl umkehren`, null, () => {
          selectionList.forEach(l=>{l.checked=!l.checked});
        });
        invertSelection.css({
          width: `190px`,
          padding: `1px`,
          textAlign: `center`,
          display: `block`,
          float: `right`,
        });

        let clearSearch = main.tools.createElement(`div`, `button`, `X`, null, () => {
          searchBar.setAttribute(`value`, ``);
          searchBar.value = ``;
          filterEntries();
        });
        clearSearch.css({
          width: `32px`,
          padding: `3px`,
          textAlign: `center`,
          display: `block`,
          float: `left`,
        });
        clearSearch.setAttribute(`title`, `Suche/Filter löschen`);

        let tabsOutput = main.tools.createElement(`div`, `button`, ``);
        tabsOutput.css({
          height: `initial`,
          cursor: `initial`,
          whiteSpace: `initial`,
          width: `CALC(100% - 10px)`,
          maxHeight: `300px`,
          overflowY: `scroll`,
        });

        let tabActivityFunction = function(a, c) {};
        if(single) {
          tabActivityFunction = function(a, c) {
            let t = this;
            c.forEach(n=>n.checked=(n!==t)?0:n.checked);
            if(t.checked) {
              a.classList.remove(`disabled`);
            } else {
              a.classList.add(`disabled`);
            }
          };
        }

        for(let i = 0;i < data.length;i++) {
          let chb = null, chl = null;
          let isChecked = false;
          if(initialChecked instanceof Array) {
            if(initialChecked.filter((entry) => {
              let result = false;
              if(data[i].indexOf(entry.toString()) > -1) {
                result = true;
              }
              return result;
            }).length > 0) isChecked = true;
          } else if (initialChecked == true) {
            isChecked = true;
          }
          [chb, chl] = main.tools.createToggle(`entry_select_${i}_entry_${hash}`, `${data[i]}`, () => {
            let c = tabActivityFunction.bind(chb);
            c(acceptButton, selectionList);
          }, isChecked, tabsOutput);
          chb.setAttribute(`value`, `${data[i]}`);
          chl.css({
            display: `inline-block`,
            textAlign: `center`,
            padding: `3px`,
          })
          selectionList.push(chb);
          tabbList.push(chl);
        }
        tabsOutput.in(nothingFound);

        let tabsButtons = main.tools.createElement(`div`, ``, ``);
        tabsButtons.css({
          display: `flex`,
          flexDirection: `row`,
          flexWrap: `nowrap`,
          justifyContent: `space-between`,
          alignContent: `space-between`,
          alignItems: `flex-start`,
        })

        let cancelButton = main.tools.createElement(`div`, `button`, `Abbrechen`, tabsButtons, () => {
          tabsOutputWrap.classList.add(`hidden`);
          try{
            tabsOutputWrap.remove();
          } catch(e) {}
          tabsOutputWrap = null;
          cancelTrigger();
        });
        cancelButton.css({
          textAlign: `center`,
          width: `15%`,
          padding: `3px`,
        })

        let spaceBetween = main.tools.createElement(`div`, ``, ``).to(tabsButtons);

        let acceptButton = main.tools.createElement(`div`, `button${(single)?` disabled`:``}`, `Annehmen`, tabsButtons, () => {
          if(!acceptButton.classList.contains(`disabled`) || !single) {
            let checkedBoxes = selectionList.filter(sel=>sel.checked).map(sel=>{return sel.getAttribute(`value`)});
            tabsOutputWrap.classList.add(`hidden`);
            try{
              tabsOutputWrap.remove();
            } catch(e) {}
            tabsOutputWrap = null;
            responseTrigger(checkedBoxes);
          }
        });
        acceptButton.css({
          textAlign: `center`,
          width: `15%`,
          padding: `3px`,
        })

        tabsOutputWrap.in(searchBar);
        tabsOutputWrap.in(clearSearch);
        tabsOutputWrap.in(invertSelection);
        tabsOutputWrap.in(tabsOutput);
        tabsOutputWrap.in(tabsButtons);

        return tabsOutputWrap;
      },

      rndInt(max) {
        return Math.floor(Math.random() * (max+1));
      },
      shuffle (arr, cyc) {
        cyc = cyc || 5;
        for (let cycles = 0;cycles < Math.max(1, cyc);cycles++) {
          for (let i = arr.length - 1; i > 0; i--) {
            const j = main.tools.rndInt(i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        }
        return arr;
      },
      urldecode (data) {
        return decodeURIComponent(data.replace(/\+/g,' '));
      },
      sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },
      secondConverter (seconds) {
        // Berechnen von Tagen, Stunden, Minuten und Sekunden
        let days = Math.floor(seconds / 86400);
        let hours = Math.floor((seconds % 86400) / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let remainingSeconds = seconds % 60;

        // Formatieren, um immer zwei Ziffern zu haben
        let formattedDays = days.toString().padStart(2, '0');
        let formattedHours = hours.toString().padStart(2, '0');
        let formattedMinutes = minutes.toString().padStart(2, '0');
        let formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        // Kombinieren der formatierten Werte
        let outp = `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        outp = outp.replace(/^00:/, ``).replace(/^00:/, ``);

        return `${outp}`;
      },

      creditTimeOffset () {
        let startTimeParsed = parseInt(startTime, 36);
        let startTimeDate = new Date();
        startTimeDate.setTime(startTimeParsed);
        let offset = Math.floor((((new Date()).getTime() / 3600000) - (startTimeDate / 3600000)) * 60 * 60);
        return main.tools.secondConverter(offset);
      },
    },
    user: new User(),
    adoptTime: -1,
    boxes: {},
    order: definedOrder,
    currentOpenPageUser: -1,
    config: {
      previewAmount: 4,
      defaults: {
        darkModeStyle: `
          div.ovipet_mainbox {
            background-color:#303030 !important;
            border-color: #3b6080 !important;
            color: #eee !important
          }
          .ovipets_dialogue, .catbox, .button, .progressbar, .trackbar {
            background-color:rgba(66, 66, 66, 0.45) !important;
            border-color: #3b6080 !important;
            backdrop-filter: blur(5px);
            border-width: 2px !important;
            padding:4px;
            color: #eee !important
          }
          .progressbar, .trackbar {
            border-radius:3px !important;
            padding:0px;
          }
          .trackbar .progress , .progressbar .progress {
            height:100% !important;
            box-shadow:none !important;
            border-top: 0px !important;
            border-radius:3px !important;
          }
          div.hidecontents > div:first-child {
            color: #eee !important
          }
          *::not(.noinv), .button, input[type="checkbox"] + label.button {
            color:rgba(30, 30, 30, 1) !important;
            background-color:rgba(220, 220, 220, 0.45) !important;
            border-color: rgba(196, 159, 127, 1) !important;
            box-shadow: 2px 2px 3px 0px rgba(255, 255, 255, 0.5);
            filter: invert(100%);
          }
          input[type="checkbox"]:checked + label.button , .checkedstyled {
            color:rgba(30, 30, 30, 1) !important;
            background-color:rgba(220, 180, 220, 0.45) !important;
            border-color: rgba(196, 159, 127, 1) !important;
            box-shadow: inset 16px 16px 25px -12px rgba(255, 255, 255, 0.3);
            filter: invert(100%);
          }
          .button.disabled, .disabled , .disabled * {
            border-color: rgba(125, 125, 125, 1) !important;
            color:rgba(125, 125, 125, 1) !important;
          }
          option {
            background:#303030 !important;
            color: white;
          }
        `,
        nameGeneratorTypes: [
          {name: `Gemischt (Kurz) [Standard]`, value: `mixed/short/`},
          {name: `Gemischt (Mittel)`, value: `mixed/medium/`},
          {name: `Menschen (Kurz)`, value: `human/short/`},
          {name: `Menschen (Mittel)`, value: `human/medium/`},
          {name: `Elfen (Kurz)`, value: `elf/short/`},
          {name: `Elfen (Mittel)`, value: `elf/medium/`},
          {name: `Zwerge (Kurz)`, value: `dwarf/short/`},
          {name: `Zwerge (Mittel)`, value: `dwarf/medium/`},
          {name: `Barbar (Kurz)`, value: `barbarian/short/`},
          {name: `Barbar (Mittel)`, value: `barbarian/medium/`},
          {name: `Ork (Kurz)`, value: `orc/short/`},
          {name: `Ork (Mittel)`, value: `orc/medium/`},
          {name: `Böse (Kurz)`, value: `evil/short/`},
          {name: `Böse (Mittel)`, value: `evil/medium/`},
          {name: `Asiatisch (Kurz)`, value: `asian/short/`},
          {name: `Asiatisch (Mittel)`, value: `asian/medium/`},
          {name: `Arabisch (Kurz)`, value: `arabic/short/`},
          {name: `Arabisch (Mittel)`, value: `arabic/medium/`},
          {name: `Surnames (Kurz)`, value: `surnames/short/`},
          {name: `Surnames (Mittel)`, value: `surnames/medium/`},
          {name: `Sience-Fiction (Kurz)`, value: `sf/short/`},
          {name: `Sience-Fiction (Mittel)`, value: `sf/medium/`},
          {name: `Reptilien (Kurz)`, value: `reptilian/short/`},
          {name: `Reptilien (Mittel)`, value: `reptilian/medium/`},
          {name: `Rattenmann (Kurz)`, value: `ratman/short/`},
          {name: `Rattenmann (Mittel)`, value: `ratman/medium/`},
          {name: `Dämonen (Kurz)`, value: `demon/short/`},
          {name: `Dämonen (Mittel)`, value: `demon/medium/`},
          {name: `Drachen (Kurz)`, value: `dragon/short/`},
          {name: `Drachen (Mittel)`, value: `dragon/medium/`},
          {name: `Hobbit`, value: `human/short/`},
          {name: `Baby-Namen`, value: `enames/short/`},
          {name: `Superhelden/Superbösewicht`, value: `super/short/`}
        ],
        sounds: [],
        soundnames: {
          "-": `Deaktiviert`,
          cry: `Pathetic Cry`,
          please: `Please don't hurt me`,
          mornin: `Good Morning. Nice day for fishing ain't it! Hu ha!`,
          icq: `ICQ-Benachrichtigungs-Sound`,
          uhoh: `Uh Oh - How unfortunate`,
        },
        blacklistEditor: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAd0SU1FB+cLFAMrGX9jm7MAAANZSURBVEjHjZVNaFxVFMd/577J2EnzVUvERkugxCYmUSFNUmxSVNSFKIJoLGrBgIJLo+BCFLStm1JRK9USJBBKSym4ELKpdFHQlRprRaURm6FENFINkzSZDE3m3b+Lec68ySQZz+Y9OPf+7vn433uMMnOAqG6GopWJtQ7qeFLbq1A8X/Fz4bcISLCFHEKtHGWKRaxim6IgjR7dwVsqB4CDnTTb3bppo8zgooiifUXeP7qmkyRLB0eZe5aSep9+sgR6Bx87WLH99frFniUseRMAj/IlzpGkmU/tHEGpIAhZI7CAYeR5goMqq1sC4AJuj96gli7G/Ey9gXhGpwAX+Jf1ArIzwVgYAn/hywuciKrTTR/jtBO4V5Yew2OnFjnMVf+4XrPjwOvhrCbAKkqbKIabtuPaj/ErjQi0bDcEg3zjT4Ldz6AmKhsT74KRwDDa6MdjLHLerjOth1wPpk772tYVxxohIaZtEslblhvWoHto02lgB/daIwvVAbBLvcjS7oSthB/Qa0NkgFs5okPPjZxVdUCaSdCf5MO9esRe1GSU4bzGz/bF9bE+wNjFHrBtJNRPSg8wEOVWQ6322u/Va5C274BZQpvSj+yP+S7bFeo3Bxjooi4CeA6eP3dBhjxmBVcY2tPVIvCuyb/NbQjOAJhdt6P8vfErUVmDVWZYLq435lgluj32PwAQ0EhTCaC8BYVHQIj4PdwIIMsrX2yXs9UCzGq021oZJGkJ+U0AJq1wM5bCKhJ0+DfVyxIBt/MRLfywIUBOTWwrAhLCzDo0TtqGuQq0McLDTILDVwAElrdZViLAgp1WhqQ/Yb/ZmLYqI4KtfAba7ZJagcJrVobQLbSrS13qUrc62ALq5j6OqYlRGwoOaFQNHKNDnesLST6jV2OyALiLOdKpn3ItfCjxXmoiV8e82rlcCXD0MWdBGTLPPkBZBRnVSDaflRP+v9jjgFW7pAfpr2hsigbuDFp1iHfNccTN8QfbbbqgTosUNsywGwKl1tFFSp9whQmaaj+H5SEyPMUOe165eBdydPov1urMorpqJwPm+Xg5afA9Ixqwl5SLDRwHzdpXmjYV5qm1A2plFmixaxzWt0lC8jFA1Zns6tSjdrApu+SzNYSbXLAKC/DFKVn4BuQj37/V7GC4GVmyZQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0xMS0yMFQwMzo0MzowNyswMDowMHDeeqoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMTEtMjBUMDM6NDM6MDcrMDA6MDABg8IWAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTExLTIwVDAzOjQzOjI1KzAwOjAwgyz1nQAAAABJRU5ErkJggg==`,
        hiddenEggCatcher: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TpaIVBzuISMlQneyiIo6likWwUNoKrTqYvPQPmjQkKS6OgmvBwZ/FqoOLs64OroIg+APi6uKk6CIl3pcUWsR44fE+zrvn8N59gNCsMtXsiQGqZhnpRFzM5VfFwCsGEIYPAsISM/VkZjELz/q6p06quyjP8u77swaVgskAn0gcY7phEW8Qz25aOud94hArSwrxOfGkQRckfuS67PIb55LDAs8MGdn0PHGIWCx1sdzFrGyoxDPEEUXVKF/Iuaxw3uKsVuusfU/+wmBBW8lwndYYElhCEimIkFFHBVVYiNKukWIiTedxD/+o40+RSyZXBYwcC6hBheT4wf/g92zN4vSUmxSMA70vtv0xDgR2gVbDtr+Pbbt1AvifgSut4681gblP0hsdLXIEDG0DF9cdTd4DLneAkSddMiRH8tMSikXg/Yy+KQ8M3wL9a+7c2uc4fQCyNKvlG+DgEJgoUfa6x7v7uuf2b097fj90a3KnqKs63AAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+cLHgEDN5LRDNwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAB70lEQVRYw8XXu2tUURAG8B++gquFkGggvuoFG2Njs7HcRGyMYCVioY3gq7EQrLRR/wBJG9EiGOyUNKJBVES2SBFECx+dpogQokKKtRnhsu4u97F796vunHNm5puZc+6cQ3aMJr6voIkPuJnDls0Z1o5jHpN4GGNr2Io/eIqP+oQaNrCC8ymCWsKlXpO4ipEU6ypYiNLMFHW6p4DuTJC4ldfANNZxpACJR0FiOqvijthgS5HSvKiEjTXsz6o8gWpGnW1xGmqJsSp+4YkSMIQv+N4S8e0oRS3tbi+S9sOxdxZaSrGCxTTnvRkkiuB62LmYGLuWJguzwX64B+V4HbZ2hzwc8mw3pTN5jkwHVCPi+4mxx0Fiu5LwIBz++4OeDFLHyyIwEQ6nQt4V8p12i+/hRh9IHGqRl/Gi3cKvmCshK3PhC2xKTBzAagkEVsPXfwQGgi2J7zoaJfndGGTQb/B+UCWoRK9otCNQw0+c6iOBqeiYzzq10lQdqwAWw8dQt1bcKNiOO+FEmk5b6VPko/iGT1l87OwRoUqk/jeOplUaS+yHvQWc7wsbTVzIqnwuWmneBnU67obrYSsXxnEwIR+L0nQr21m8jaiXw0ZPMBJGm3gXL5+xxPzLxPxnXM74+E2FOu7iFX60vBuex0WjnsXgX5rpacbjSjD+AAAAAElFTkSuQmCC`,
        loginDelayColors: [`#bbd5ea`, `#b8d3e8`, `#b2cee6`, `#accae4`, `#a3c5e1`, `#97bddb`, `#8eb6d8`],
        avatars: [],
        speciesList: ["Avi","Anura","Canis","Catus","Cebidae","Cetacea","Chiropy","Draconis","Equus","Ericius","Feline","Gallus","Gekko","Gryphus","Haliaeetus","Hyaena","Lepus","Loong","Lotor","Lupus","Macropus","Mantis","Mustela","Ovis","Pacos","Phanta","Piscium","Porcus","Psittaco","Rangifer","Raptor","Rattus","Serpentes","Slime","Struthio","Taurus","Testa","Ursa","Vulpes"],
        colorLink: {
          normal: (colors) => {
            let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
            return {
              "Augen":   {"1": colors[0].toFormattedString(colorRule), "2": ''},
              "Körper":  {"1": colors[1].toFormattedString(colorRule), "2": colors[2].toFormattedString(colorRule)},
              "Extras":  {"1": colors[3].toFormattedString(colorRule), "2": colors[4].toFormattedString(colorRule)},
              "Federn":  {"1": '', "2": ''},
              "Schuppen":{"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          },
          hex: (colors) => {
            return {
              "Augen":   {"1": colors[0].toHexString(), "2": ''},
              "Körper":  {"1": colors[1].toHexString(), "2": colors[2].toHexString()},
              "Extras":  {"1": colors[3].toHexString(), "2": colors[4].toHexString()},
              "Federn":  {"1": '', "2": ''},
              "Schuppen":{"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          }
        },
        widescreenFix: `
        body {
          margin: 25px;
          width: CALC(100% - 150px);
          margin-top: 75px;
          min-width:730px;
          margin-left: 50px;
        }
        #header {
          position:fixed !important;
          box-sizing: border-box;
          width: CALC(100% - 150px);
          min-width:730px;
          height:60px;
        }
        #src_pets #sub_profile #pet {
          text-align:center;
        }
        #src_pets #sub_profile #pet .pet {
          position:inherit;
        }
        #sub_calendar #calendar .calendar_box {
          margin: 0px;
          width: 96px;
          height: 96px;
        }
        #sub_calendar #calendar li {
          width: 100px;
          padding-bottom: 100px;
        }
        .cover {
          pointer-events: none;
          border:0px !important;
        }
        `,
        widescreenModuleFix: `div.ovipet_mainbox:not(.open) {top: 5px;height:60px !important;}`,
        petBackgroundFix: `#src_pets #sub_profile #pet .cover.large {height: 100%;top: 0px;}`,
        scrollableTabsFix: `.ui-tabs .ui-tabs-nav {max-height:150px !important;overflow-y: scroll !important;background-position:top;}`,
        ...__imageData
      },
      wsfixelement: null, styledTabselement: null, maincss: null, justifyTabselement: null,
      cachedPetList: {},
      justifyTabs: `
        .ui-tabs-nav {display: flex;justify-content: space-between;flex-wrap: wrap;}
        .ui-tabs ul.ui-tabs-nav.ui-helper-clearfix::before, .ui-tabs ul.ui-tabs-nav.ui-helper-clearfix::after {display: none !important;}
        .ui-dialog.ui-widget.ui-draggable.ui-resizable > .ui-dialog .ui-dialog-content {overflow: inherit;}
        .ui-dialog.ui-widget.ui-draggable.ui-resizable > div.ui-dialog-titlebar .ui-helper-clearfix::before, .ui-helper-clearfix::after {display: table !important;}
      `,
      tabStyles: [
        {
          name: "Standard",
          css: ``
        },
        {
          name: "Schädel-Style",
          css: `
          .ui-tabs .ui-tabs-active {
            padding-bottom: 0px !important;
            margin-bottom:-20px !important;
            position:relative !important;
            top:-13px !important;
            height:40.6px !important;
            background-color:red !important;
          }
          li.ui-tabs-tab {
            height: 27.6px !important;
            padding-bottom:0px !important;
            box-shadow: 0px 0px 6px black, 0px -5px 4px rgba(0, 0, 0, 0.6);
            background-image: url(data:image/png;base64,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) !important;
              background-position: right !important;
              margin-bottom:-7px !important;
            }
            li.ui-tabs-tab a span p {
              font-family: Segoe UI !important;
              color:black !important;
              text-shadow: 0px 0px 5px white, 0px 0px 5px white;
              font-size:12px !important;
              line-height: 0.6;
            }
            `
          },
        {
          name: "Einhorn-Style",
          css: `
          .ui-tabs .ui-tabs-active {
            background-color:purple !important;
            color:white !important;
            backdrop-filter: blur(2px) grayscale(70%) brightness(25%);
            transition:backdrop-filter 600ms;
          }
          li.ui-tabs-tab {
            height: 27.6px !important;
            padding-bottom:0px !important;
            box-shadow: 0px 0px 6px black, 0px -5px 4px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px) grayscale(0%) brightness(130%);
            transition:backdrop-filter 600ms;
          }

          li.ui-tabs-tab:nth-child(9n+1) { background: hsla(  0, 60%, 85%, 0.3) !important; } /* Pastellrot */
          li.ui-tabs-tab:nth-child(9n+2) { background: hsla( 40, 60%, 85%, 0.3) !important; } /* Pastellorange */
          li.ui-tabs-tab:nth-child(9n+3) { background: hsla( 80, 60%, 85%, 0.3) !important; } /* Pastellgelb */
          li.ui-tabs-tab:nth-child(9n+4) { background: hsla(120, 60%, 85%, 0.3) !important; } /* Pastellgrün */
          li.ui-tabs-tab:nth-child(9n+5) { background: hsla(160, 60%, 85%, 0.3) !important; } /* Pastelltürkis */
          li.ui-tabs-tab:nth-child(9n+6) { background: hsla(200, 60%, 85%, 0.3) !important; } /* Pastellhellblau */
          li.ui-tabs-tab:nth-child(9n+7) { background: hsla(240, 60%, 85%, 0.3) !important; } /* Pastellblau */
          li.ui-tabs-tab:nth-child(9n+8) { background: hsla(280, 60%, 85%, 0.3) !important; } /* Pastelllila */
          li.ui-tabs-tab:nth-child(9n+9) { background: hsla(320, 60%, 85%, 0.3) !important; } /* Pastellrosa */

          li.ui-tabs-tab a span p , li.ui-tabs-tab a span{
            font-family: Segoe UI !important;
            color:rgba(0, 0, 0, 0.6) !important;
            font-size:18px !important;
            line-height: 0.6;
            text-shadow: 0px 0px 5px white;
          }

          .ui-widget-header {
            background: #5c9ccc url("https://wallpapers.com/images/hd/unicorn-art-hk8vqjf1p62dje0j.jpg") 50% 50% no-repeat !important;
            background-size: cover !important;
          }

          .ui-section-title , .ui-progressbar-title , .ui-dialog-title {
            text-shadow: 0px 0px 3px black, 0px 0px 4px black, 0px 0px 5px black, 0px 0px 5px black, 0px 0px 5px black, 0px 0px 5px black;
            background-color: rgba(0, 0, 0, 0.3) !important;
            display:block;
            margin-left: 5%;
            margin-right:5%;
            border-radius: 10px;
            backdrop-filter: blur(4px) grayscale(0%) brightness(130%);
          }
          `
        },
        {
          name: "Einhorn-Style (Regenbogen)",
          css: `
          ul.ui-tabs-nav {
            text-align:center;
          }
          .ui-tabs .ui-tabs-active {
            background-color:purple !important;
            color:white !important;
            backdrop-filter: blur(2px) grayscale(70%) brightness(25%);
            transition:backdrop-filter 600ms;
          }
          li.ui-tabs-tab {
            height: 27.6px !important;
            padding-bottom:0px !important;
            box-shadow: 0px 0px 6px black, 0px -5px 4px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px) grayscale(0%) brightness(130%);
            transition:backdrop-filter 600ms;
            width: CALC(50% - 8px) !important;
            display:inline-block;
            float:none !important;
          }

          li.ui-tabs-tab:nth-child(9n+1) { background: hsla(  0, 60%, 65%, 0.8) !important; } /* Pastellrot */
          li.ui-tabs-tab:nth-child(9n+2) { background: hsla( 40, 60%, 65%, 0.8) !important; } /* Pastellorange */
          li.ui-tabs-tab:nth-child(9n+3) { background: hsla( 80, 60%, 65%, 0.8) !important; } /* Pastellgelb */
          li.ui-tabs-tab:nth-child(9n+4) { background: hsla(120, 60%, 65%, 0.8) !important; } /* Pastellgrün */
          li.ui-tabs-tab:nth-child(9n+5) { background: hsla(160, 60%, 65%, 0.8) !important; } /* Pastelltürkis */
          li.ui-tabs-tab:nth-child(9n+6) { background: hsla(200, 60%, 65%, 0.8) !important; } /* Pastellhellblau */
          li.ui-tabs-tab:nth-child(9n+7) { background: hsla(240, 60%, 65%, 0.8) !important; } /* Pastellblau */
          li.ui-tabs-tab:nth-child(9n+8) { background: hsla(280, 60%, 65%, 0.8) !important; } /* Pastelllila */
          li.ui-tabs-tab:nth-child(9n+9) { background: hsla(320, 60%, 65%, 0.8) !important; } /* Pastellrosa */

          li.ui-tabs-tab a span p {
            font-family: Segoe UI !important;
            color:rgba(0, 0, 0, 0.6) !important;
            font-size:18px !important;
            line-height: 0.6;
          }

          .ui-widget-header {
            background: #5c9ccc url("https://wallpapers.com/images/hd/unicorn-art-hk8vqjf1p62dje0j.jpg") 50% 50% no-repeat !important;
            background-size: cover !important;
          }
          `
        },
        {
          name: "Einhorn-Style (Bunt)",
          css: `
          ul.ui-tabs-nav {
          }
          .ui-tabs .ui-tabs-active {
            background-color:purple !important;
            color:white !important;
            backdrop-filter: blur(2px) grayscale(70%) brightness(25%);
            transition:backdrop-filter 600ms;
          }
          li.ui-tabs-tab {
            height: 27.6px !important;
            padding-bottom:0px !important;
            box-shadow: 0px 0px 6px black, 0px -5px 4px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px) grayscale(0%) brightness(130%);
            transition:backdrop-filter 600ms;
          }

          li.ui-tabs-tab:nth-child(9n+1) { background: hsla(  0, 60%, 65%, 0.8) !important; } /* Pastellrot */
          li.ui-tabs-tab:nth-child(9n+2) { background: hsla( 40, 60%, 65%, 0.8) !important; } /* Pastellorange */
          li.ui-tabs-tab:nth-child(9n+3) { background: hsla( 80, 60%, 65%, 0.8) !important; } /* Pastellgelb */
          li.ui-tabs-tab:nth-child(9n+4) { background: hsla(120, 60%, 65%, 0.8) !important; } /* Pastellgrün */
          li.ui-tabs-tab:nth-child(9n+5) { background: hsla(160, 60%, 65%, 0.8) !important; } /* Pastelltürkis */
          li.ui-tabs-tab:nth-child(9n+6) { background: hsla(200, 60%, 65%, 0.8) !important; } /* Pastellhellblau */
          li.ui-tabs-tab:nth-child(9n+7) { background: hsla(240, 60%, 65%, 0.8) !important; } /* Pastellblau */
          li.ui-tabs-tab:nth-child(9n+8) { background: hsla(280, 60%, 65%, 0.8) !important; } /* Pastelllila */
          li.ui-tabs-tab:nth-child(9n+9) { background: hsla(320, 60%, 65%, 0.8) !important; } /* Pastellrosa */

          li.ui-tabs-tab a span p {
            font-family: Segoe UI !important;
            color:rgba(0, 0, 0, 0.6) !important;
            font-size:18px !important;
            line-height: 0.6;
          }

          .ui-widget-header {
            background: #5c9ccc url("https://wallpapers.com/images/hd/unicorn-art-hk8vqjf1p62dje0j.jpg") 50% 50% no-repeat !important;
            background-size: cover !important;
          }
          `
        },
        {
          name: "Glas-Style",
          css: `
          .ui-tabs-nav {
            text-align:center;
          }
          .ui-tabs .ui-tabs-active {
            backdrop-filter: blur(2px) grayscale(70%) brightness(25%);
            transition:backdrop-filter 600ms;
          }
          li.ui-tabs-tab {
            height: 27.6px !important;
            padding-bottom:0px !important;
            background: hsla(240, 60%, 85%, 0.3) !important;
            box-shadow: 0px 0px 6px black, 0px -5px 4px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px) grayscale(0%) brightness(130%);
            transition:backdrop-filter 600ms;
            margin-left:5px !important;
            margin-right:5px !important;
            float:none !important;
            display:inline-block !important;
            border: 1px solid white !important;
            border-bottom:0px !important;
          }

          li.ui-tabs-tab a span p {
            font-family: Segoe UI !important;
            color:rgba(0, 0, 0, 0.6) !important;
            font-size:18px !important;
            line-height: 0.6;
          }

          .ui-widget-header {
            background: #5c9ccc url("https://moewalls.com/wp-content/uploads/2023/10/forest-pond-rainy-day-thumb.jpg") 50% 50% no-repeat !important;
            background-size: cover !important;
          }
          `
        },
      ],
      panelwidth: parseInt(Brain.read(`__GLOBAL__.panelwidth`, 450)),
      pures: {
        gems: [
          {colors: [new Clr(0x32, 0xCD, 0x32),new Clr(0xFF, 0xF7, 0x00)], name: "Peridot"},
          {colors: [new Clr(0xB5, 0x7E, 0xDC),new Clr(0x8F, 0x00, 0xFF)], name: "Amethyst"},
          {colors: [new Clr(0xFF, 0xFD, 0xD0),new Clr(0xF4, 0xC2, 0xC2)], name: "Pearl"},
          {colors: [new Clr(0xE5, 0xE4, 0xE2),new Clr(0xFF, 0xFA, 0xFA)], name: "Calcite"},
          {colors: [new Clr(0xE5, 0xE4, 0xE2),new Clr(0xC3, 0xCD, 0xE6)], name: "Angelite"},
          {colors: [new Clr(0x0F, 0x0F, 0x0F),new Clr(0x00, 0x00, 0xCF)], name: "Tanzanite"},
          {colors: [new Clr(0xA0, 0x00, 0x00),new Clr(0x00, 0x32, 0x20)], name: "Bloodstone"},
          {colors: [new Clr(0x08, 0x0C, 0x12),new Clr(0x1E, 0x27, 0x2C)], name: "Black Pearl"},

          // new
          {colors: [new Clr(0xAF, 0x81, 0xF0),new Clr(0xD2, 0xC3, 0xFF),new Clr(0x98, 0xDD, 0xFF)], name: "Grape Agate"},
          {colors: [new Clr(0xF8, 0xF8, 0xFF),new Clr(0xF0, 0xFF, 0xF0),new Clr(0x00, 0x32, 0x20)], name: "Moss Agate"},

          {colors: [new Clr(0xFF, 0x08, 0x00),new Clr(0x80, 0x00, 0x20),new Clr(0x96, 0x00, 0x18)], name: "Ruby"},
          {colors: [new Clr(0x00, 0x42, 0x25),new Clr(0x17, 0x72, 0x45),new Clr(0x32, 0xCD, 0x32)], name: "Jade"},
          {colors: [new Clr(0xD2, 0x69, 0x1E),new Clr(0xFF, 0xFD, 0xD0),new Clr(0x96, 0x4B, 0x00)], name: "Agate"},
          {colors: [new Clr(0x17, 0x72, 0x45),new Clr(0x00, 0xB7, 0xEB),new Clr(0x00, 0xCE, 0xD1)], name: "Aquamarine"},
          {colors: [new Clr(0x36, 0x45, 0x4F),new Clr(0x32, 0x14, 0x14),new Clr(0x0F, 0x0F, 0x0F)], name: "Onyx"},
          {colors: [new Clr(0xFF, 0xBF, 0x00),new Clr(0xFF, 0xF7, 0x00),new Clr(0xFF, 0x75, 0x18)], name: "Amber"},
          {colors: [new Clr(0x01, 0x79, 0x6F),new Clr(0xB5, 0x7E, 0xDC),new Clr(0xF6, 0x4A, 0x8A)], name: "Alexandrite"},
          {colors: [new Clr(0x00, 0xB7, 0xEB),new Clr(0x00, 0x00, 0x8B),new Clr(0x00, 0x70, 0xFF)], name: "Sapphire"},
          {colors: [new Clr(0x00, 0xCE, 0xD1),new Clr(0x00, 0xBF, 0xFF),new Clr(0x00, 0x70, 0xFF)], name: "Turquoise"},
          {colors: [new Clr(0x8B, 0x00, 0x00),new Clr(0xC7, 0x15, 0x85),new Clr(0xFF, 0x69, 0xB4)], name: "Spinel"},
          {colors: [new Clr(0x73, 0xC2, 0xFB),new Clr(0x9B, 0xDD, 0xFF),new Clr(0xE5, 0xE4, 0xE2)], name: "Moonstone"},
          {colors: [new Clr(0xFF, 0x43, 0xA4),new Clr(0xE5, 0xE4, 0xE2),new Clr(0x00, 0xAD, 0x4B)], name: "Tourmaline"},
          {colors: [new Clr(0x00, 0x32, 0x20),new Clr(0x71, 0xEE, 0xB8),new Clr(0x2E, 0x8B, 0x57)], name: "Malachite"},
          {colors: [new Clr(0xF8, 0x79, 0x7D),new Clr(0xFF, 0x7F, 0x50),new Clr(0xFC, 0x94, 0x83)], name: "Pink Coral"},
          {colors: [new Clr(0x58, 0x9D, 0xE6),new Clr(0xFF, 0xFF, 0xF0),new Clr(0xFA, 0xDF, 0xC8)], name: "Kyanite"},
          {colors: [new Clr(0x08, 0x0C, 0x12),new Clr(0xD2, 0x69, 0x1E),new Clr(0x58, 0x9D, 0xE6)], name: "Hawk's Eye"},
          {colors: [new Clr(0xAF, 0x81, 0xF0),new Clr(0xFF, 0x99, 0x12),new Clr(0xFF, 0xDA, 0x73)], name: "Ametrine"},
          {colors: [new Clr(0xDF, 0x73, 0xFF),new Clr(0x6E, 0x0D, 0xD0),new Clr(0xE3, 0xAA, 0xEE)], name: "Sugilite"},
          {colors: [new Clr(0x6E, 0x0D, 0xD0),new Clr(0xFA, 0xDF, 0xC8),new Clr(0x76, 0xDA, 0xFF)], name: "Imperial Jasper"},
          {colors: [new Clr(0xFF, 0xCD, 0x41),new Clr(0xFF, 0x99, 0x12),new Clr(0xFF, 0xFD, 0xD0)], name: "Citrine"},
          {colors: [new Clr(0xC4, 0xC3, 0xD0),new Clr(0x77, 0x88, 0x99),new Clr(0x36, 0x45, 0x4F),new Clr(0x0F, 0x0F, 0x0F)], name: "Hematite"},
          {colors: [new Clr(0xFF, 0xFD, 0xD0),new Clr(0xB5, 0x7E, 0xDC),new Clr(0xFF, 0xBF, 0x00),new Clr(0x00, 0xCE, 0xD1)], name: "Opal"},
          {colors: [new Clr(0xDA, 0xA5, 0x20),new Clr(0xD2, 0xB4, 0x8C),new Clr(0x0C, 0x09, 0x0A),new Clr(0x61, 0x6D, 0x7E)], name: "Sheen Obsidian"},
          {colors: [new Clr(0xFB, 0x60, 0x7F),new Clr(0xFF, 0xA6, 0xC9),new Clr(0xFF, 0xCD, 0xE8),new Clr(0xF4, 0xC2, 0xC2)], name: "Rose Quartz"},
          {colors: [new Clr(0x24, 0x12, 0x00),new Clr(0x50, 0x28, 0x00),new Clr(0xFF, 0xBF, 0x00),new Clr(0xFF, 0x99, 0x12)], name: "Tigers Eye"},
          {colors: [new Clr(0x8B, 0x00, 0x00),new Clr(0x80, 0x00, 0x20),new Clr(0x32, 0x14, 0x14),new Clr(0x0F, 0x0F, 0x0F)], name: "Garnet"},
          {colors: [new Clr(0xA0, 0xFF, 0xC3),new Clr(0x17, 0xBD, 0xE8),new Clr(0xC7, 0x15, 0x85),new Clr(0x5A, 0x00, 0x58)], name: "Fluorite"},
          {colors: [new Clr(0x02, 0x64, 0xDB),new Clr(0x1E, 0x27, 0x2C),new Clr(0x84, 0xEC, 0x9F),new Clr(0xFF, 0x99, 0x12)], name: "Labradorite"},
          {colors: [new Clr(0xFF, 0x08, 0x00),new Clr(0x0F, 0x0F, 0x0F),new Clr(0x00, 0x2F, 0xA7),new Clr(0x36, 0x45, 0x4F),new Clr(0x00, 0x7F, 0xFF)], name: "Fire Opal"},
          {colors: [new Clr(0x08, 0x45, 0x7E),new Clr(0x01, 0x98, 0xE1),new Clr(0xEE, 0xDD, 0x82),new Clr(0xFF, 0xBF, 0x00),new Clr(0xFF, 0x99, 0x12)], name: "Euclase"},
          {colors: [new Clr(0xFF, 0xF5, 0x5E),new Clr(0x63, 0xF6, 0xE2),new Clr(0x00, 0xFF, 0xAA),new Clr(0xFF, 0x58, 0xDC),new Clr(0xA3, 0x7D, 0xEE)], name: "Bismuth"}
        ],
        official: __officialColors.map(c=>new Clr(...c)),
        unofficial: __unofficialColors.map(c=>new Clr(...c))
      },
      debug: false,
      crack: `&!=jQuery360034440775647847677_1684229248524&_=${(new Date()).getTime()}`,
      regex: {
        pet: {
          owner: /profile&amp;usr=(\d+)&amp;pet=\d+" class = "pet/gi,
          name: /ui:section .*?title = "(.*?)" id = "profile"/gi,
          gender: /\/\/icons\/([fe]*male)\.png" title = "/gi,
          feed: /ui:progressbar value = "(\d+)" title/gi,
          colors: /rgb: \((\d*), (\d*), (\d*)\)/gi,
          mutations: /species=(\d+)\&amp;mutation=(\d+)|species=(\d+)\&mutation=(\d+)/gi,
          species: /<ui:i><div class = "attr"><p>Spe[c|z]ies<\/p><\/div><div class = "value"><p>(.*?)<\/p><\/div><\/ui:i>/gi, // /div class = "value"><p>(.*?)<\/p>.*?"attr.*?<div/gi,
          hatched: /(\d{4}-\d{2}-\d{2})/gi,
          adoptable: /\/\/icons\/house\.png/gi
        },
        mutations: /mutation=([\d]*)[^"]*" title[^"]*"([^\\]*)\\" width/g,
        colors: /RGB: \(([\d]{1,3}), ([\d]{1,3}), ([\d]{1,3})\)/g,
        friends: /<ui\:i><a href = \\".*?\/(.*?)\\.*?src = \\".*?\/\?(.*?)\\(.*?)i>/gi,
        eggs: /arrow_refresh.*?PetID\[\]\' value = \'(\d+)\' style.*?usr=(\d+)/gi,
        eggsall: /\?src=pets&amp;sub=profile&amp;usr=(\d+)&amp;pet=(\d+)\\\"/gi,
        unnamed: /img=pet&amp;pet=(\d*)&amp;modified=\d*&amp;size=120\\/gi,
        enclosures: /enclosure = &quot;(\d*)&quot;&gt;(.*?)&lt;.*?usr=(\d*)/gi,
        enclosurePet: /house.*?lazy.*?usr=(\d+)&amp;pet=(\d+)/gi,
        enclosurePets: /\?src=pets&amp;sub=profile&amp;usr=(\d+)&amp;pet=(\d+)\\" class/gi,
        enclosurePetsOnly: /usr=(\d+)&amp;pet=(\d+)[\\]*" class = [\\]*"pet[\\]*"><img src = [\\]*"[\\]*\/[\\]*\/im\d\.ovipets\.com[\\]*\/\?img=pet&amp;pet=\d+&amp;modified=\d+&amp;size=(120|150)/gi,
        ninjaPosts: /<ui:i>.*?img=user&amp;usr=(\d+).*?title = \\"(.*?)\\".*?age.*?title = '(.*?)'>.*?parsed_txt'>.*?<\\\/div><\\\/div><\\\/ui:i>/gi,
      },
      renamerRules: [
        '${custom}',
        '${isPure} ${species} ${gender}',
        '${isPure} ${species} ${genderFull}',
        '${rng}',
        '${Farben.Augen.1}',
        '${Farben.Augen.2}',
        '${Farben.Körper.1}',
        '${Farben.Körper.2}',
        '${Farben.Extras.1}',
        '${Farben.Extras.2}',
        '${Farben.Federn.1}',
        '${Farben.Federn.2}',
        '${Farben.Schuppen.1}',
        '${Farben.Schuppen.2}',
        '${Farben.Flossen.1}',
        '${Farben.Flossen.2}',
        '${pet.species} ${rng}',
      ],
      namerVars: [
        {code: `$\{rng}`, desc: `Zufälliger Name`},
        {code: `$\{species}`, desc: `Spezies`},
        {code: `$\{gender}`, desc: `Buchstabe für Geschlecht`},
        {code: `$\{genderFull}`, desc: `Geschlecht ausgeschrieben`},
        {code: `$\{isPure}`, desc: `"PURE", wenn es ein Pure ist`},
        {code: `$\{officialPure}`, desc: `Pure-Erkennung. Gibt "OPURE" zurück`},
        {code: `$\{inofficialPure}`, desc: `Inoffizielle Pure-Erkennung. Gibt "UPURE" zurück`},
        {code: `$\{isGem}`, desc: `"GEM", wenn ein Gem enthalten ist`},
        {code: `$\{gemName}`, desc: `Gibt den Namen des Gem-Sets zurück`},
        {code: `$\{gemName2}`, desc: `Gibt die Namen der erkannten Gem-Sets zurück`},
        {code: `$\{hat("11CCFF")?"JA":"NEIN"}`, desc: `Prüft, ob ein Farbwert vorhanden ist. (#11CCFF geht auch)`},
        {code: `$\{hatched}`, desc: `Schlüpf-Datum im Format YYYY-MM-DD`},
        {code: `$\{pet.id}`, desc: `Die ID des Pets`},
        {code: `$\{Farben.Augen.1}`, desc: `Erste Farbe der Augen`},
        {code: `$\{Farben.Augen.2}`, desc: `Zweite Farbe der Augen`},
        {code: `$\{Farben.Körper.1}`, desc: `Erste Farbe der Körper`},
        {code: `$\{Farben.Körper.2}`, desc: `Zweite Farbe der Körper`},
        {code: `$\{Farben.Extras.1}`, desc: `Erste Farbe der Extras`},
        {code: `$\{Farben.Extras.2}`, desc: `Zweite Farbe der Extras`},
        {code: `$\{Farben.Federn.1}`, desc: `Erste Farbe der Federn`},
        {code: `$\{Farben.Federn.2}`, desc: `Zweite Farbe der Federn`},
        {code: `$\{Farben.Schuppen.1}`, desc: `Erste Farbe der Schuppen`},
        {code: `$\{Farben.Schuppen.2}`, desc: `Zweite Farbe der Schuppen`},
        {code: `$\{Farben.Flossen.1}`, desc: `Erste Farbe der Flossen`},
        {code: `$\{Farben.Flossen.2}`, desc: `Zweite Farbe der Flossen`},
        {code: `$\{pet.name}`, desc: `Gibt den vorherigen Pet-Namen zurück`},
      ],
      colorLinks: {
        "Avi": {
          normal: (colors) => {
            let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
            return {
              "Augen": {"1": '', "2": ''},
              "Körper": {"1": colors[0].toFormattedString(colorRule), "2": colors[1].toFormattedString(colorRule)},
              "Extras": {"1": colors[4].toFormattedString(colorRule), "2": colors[5].toFormattedString(colorRule)},
              "Federn": {"1": colors[2].toFormattedString(colorRule), "2": colors[3].toFormattedString(colorRule)},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          },
          hex: (colors) => {
            return {
              "Augen": {"1": '', "2": ''},
              "Körper": {"1": colors[0].toHexString(), "2": colors[1].toHexString()},
              "Extras": {"1": colors[4].toHexString(), "2": colors[5].toHexString()},
              "Federn": {"1": colors[2].toHexString(), "2": colors[3].toHexString()},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          }
        },
        "Draconis": {
          normal: (colors) => {
            let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
            return {
              "Augen": {"1": '', "2": ''},
              "Körper": {"1": colors[0].toFormattedString(colorRule), "2": colors[1].toFormattedString(colorRule)},
              "Extras": {"1": colors[3].toFormattedString(colorRule), "2": colors[4].toFormattedString(colorRule)},
              "Federn": {"1": '', "2": ''},
              "Schuppen": {"1": colors[2].toFormattedString(colorRule), "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          },
          hex: (colors) => {
            return {
              "Augen": {"1": '', "2": ''},
              "Körper": {"1": colors[0].toHexString(), "2": colors[1].toHexString()},
              "Extras": {"1": colors[3].toHexString(), "2": colors[4].toHexString()},
              "Federn": {"1": '', "2": ''},
              "Schuppen": {"1": colors[2].toHexString(), "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          }
        },
        "Loong": {
          normal: (colors) => {
            let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
            return {
              "Augen": {"1": colors[0].toFormattedString(colorRule), "2": colors[1].toFormattedString(colorRule)},
              "Körper": {"1": colors[2].toFormattedString(colorRule), "2": colors[3].toFormattedString(colorRule)},
              "Extras": {"1": colors[4].toFormattedString(colorRule), "2": colors[5].toFormattedString(colorRule)},
              "Federn": {"1": '', "2": ''},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          },
          hex: (colors) => {
            return {
              "Augen": {"1": colors[0].toHexString(), "2": colors[1].toHexString()},
              "Körper": {"1": colors[2].toHexString(), "2": colors[3].toHexString()},
              "Extras": {"1": colors[4].toHexString(), "2": colors[5].toHexString()},
              "Federn": {"1": '', "2": ''},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          }
        },
        "Piscium": {
          normal: (colors) => {
            let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
            return {
              "Augen": {"1": colors[0].toFormattedString(colorRule), "2": ''},
              "Körper": {"1": colors[1].toFormattedString(colorRule), "2": colors[2].toFormattedString(colorRule)},
              "Extras": {"1": '', "2": ''},
              "Federn": {"1": '', "2": ''},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": colors[3].toFormattedString(colorRule), "2": colors[4].toFormattedString(colorRule)},
            };
          },
          hex: (colors) => {
            return {
              "Augen": {"1": colors[0].toHexString(), "2": ''},
              "Körper": {"1": colors[1].toHexString(), "2": colors[2].toHexString()},
              "Extras": {"1": '', "2": ''},
              "Federn": {"1": '', "2": ''},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": colors[3].toHexString(), "2": colors[4].toHexString()},
            };
          }
        },
        "Struthio": {
          normal: (colors) => {
            let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
            return {
              "Augen": {"1": colors[0].toFormattedString(colorRule), "2": ''},
              "Körper": {"1": colors[1].toFormattedString(colorRule), "2": colors[2].toFormattedString(colorRule)},
              "Extras": {"1": '', "2": ''},
              "Federn": {"1": colors[3].toFormattedString(colorRule), "2": colors[4].toFormattedString(colorRule)},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          },
          hex: (colors) => {
            return {
              "Augen": {"1": colors[0].toHexString(), "2": ''},
              "Körper": {"1": colors[1].toHexString(), "2": colors[2].toHexString()},
              "Extras": {"1": '', "2": ''},
              "Federn": {"1": colors[3].toHexString(), "2": colors[4].toHexString()},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          }
        },
        "Testa": {
          normal: (colors) => {
            let colorRule = Brain.read(`__GLOBAL__.colorFormat`, `$\{r}-$\{g}-$\{b}`);
            return {
              "Augen": {"1": colors[0].toFormattedString(colorRule), "2": colors[1].toFormattedString(colorRule)},
              "Körper": {"1": colors[2].toFormattedString(colorRule), "2": colors[3].toFormattedString(colorRule)},
              "Extras": {"1": colors[4].toFormattedString(colorRule), "2": colors[5].toFormattedString(colorRule)},
              "Federn": {"1": '', "2": ''},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          },
          hex: (colors) => {
            return {
              "Augen": {"1": colors[0].toHexString(), "2": colors[1].toHexString()},
              "Körper": {"1": colors[2].toHexString(), "2": colors[3].toHexString()},
              "Extras": {"1": colors[3].toHexString(), "2": colors[4].toHexString()},
              "Federn": {"1": '', "2": ''},
              "Schuppen": {"1": '', "2": ''},
              "Flossen": {"1": '', "2": ''},
            };
          }
        }
      }
    },
    testPet: (() => {
        let temp_testPet = new Pet(0);
        temp_testPet.__name = `Testpet`;
        temp_testPet.species = `Vulpes`;
        temp_testPet.gender = `M`;
        temp_testPet.hatched = `2023-06-07`;
        temp_testPet.colors.push(new Clr(0x00, 0xB7, 0xEB));
        temp_testPet.colors.push(new Clr(0x00, 0x00, 0x8B));
        temp_testPet.colors.push(new Clr(0x00, 0x70, 0xFF));
        temp_testPet.colors.push(new Clr(139, 229, 157));
        temp_testPet.colors.push(new Clr(106, 180, 241));
        temp_testPet.colors.push(new Clr(169, 131, 216));
        temp_testPet.colors.push(new Clr(255, 173, 133));
        temp_testPet.colors.push(new Clr(249, 241, 118));
        temp_testPet.colors.push(new Clr(139, 229, 157));
        temp_testPet.colors.push(new Clr(106, 180, 241));
        temp_testPet.colors.push(new Clr(169, 131, 216));
        temp_testPet.colors.push(new Clr(255, 173, 133));
        temp_testPet.colors.push(new Clr(249, 241, 118));
        temp_testPet.colors.push(new Clr(139, 229, 157));
        temp_testPet.colors.push(new Clr(106, 180, 241));
        temp_testPet.colors.push(new Clr(169, 131, 216));
        temp_testPet.mutations.push(1);
        temp_testPet.pure = true;
        temp_testPet.adoptable = true;
        temp_testPet.debug = true;
        return temp_testPet;
    })(),
    LOG: {
      activate: () => {
        logging_LOG = true;
        BetterBrain.loggingLOG = logging_LOG;
        unsafeWindow[`ovibot`].LOG.state = BetterBrain.loggingLOG;
        return `OviBot - Logging - LOG - ${logging_LOG?`ENABLED`:`DISABLED`}`;
      },
      deactivate: () => {
        logging_LOG = false;
        BetterBrain.loggingLOG = logging_LOG;
        unsafeWindow[`ovibot`].LOG.state = BetterBrain.loggingLOG;
        return `OviBot - Logging - LOG - ${logging_LOG?`ENABLED`:`DISABLED`}`;
      },
      toggle: () => {
        logging_LOG = !logging_LOG;
        BetterBrain.loggingLOG = logging_LOG;
        unsafeWindow[`ovibot`].LOG.state = BetterBrain.loggingLOG;
        return `OviBot - Logging - LOG - ${logging_LOG?`ENABLED`:`DISABLED`}`;
      },
      state: logging_LOG
    },
    DEB: {
      activate: () => {
        logging_DEB = true;
        BetterBrain.loggingDEB = logging_DEB;
        unsafeWindow[`ovibot`].DEB.state = BetterBrain.loggingDEB;
        return `OviBot - Logging - DEB - ${logging_DEB?`ENABLED`:`DISABLED`}`;
      },
      deactivate: () => {
        logging_DEB = false;
        BetterBrain.loggingDEB = logging_DEB;
        unsafeWindow[`ovibot`].DEB.state = BetterBrain.loggingDEB;
        return `OviBot - Logging - DEB - ${logging_DEB?`ENABLED`:`DISABLED`}`;
      },
      toggle: () => {
        logging_DEB = !logging_DEB;
        BetterBrain.loggingDEB = logging_DEB;
        unsafeWindow[`ovibot`].DEB.state = BetterBrain.loggingDEB;
        return `OviBot - Logging - DEB - ${logging_DEB?`ENABLED`:`DISABLED`}`;
      },
      state: logging_DEB
    },
    INF: {
      activate: () => {
        logging_INF = true;
        BetterBrain.loggingINF = logging_INF;
        unsafeWindow[`ovibot`].INF.state = BetterBrain.loggingINF;
        return `OviBot - Logging - INF - ${logging_INF?`ENABLED`:`DISABLED`}`;
      },
      deactivate: () => {
        logging_INF = false;
        BetterBrain.loggingINF = logging_INF;
        unsafeWindow[`ovibot`].INF.state = BetterBrain.loggingINF;
        return `OviBot - Logging - INF - ${logging_INF?`ENABLED`:`DISABLED`}`;
      },
      toggle: () => {
        logging_INF = !logging_INF;
        BetterBrain.loggingINF = logging_INF;
        unsafeWindow[`ovibot`].INF.state = BetterBrain.loggingINF;
        return `OviBot - Logging - INF - ${logging_INF?`ENABLED`:`DISABLED`}`;
      },
      state: BetterBrain.loggingINF
    },
    ERR: {
      activate: () => {
        logging_ERR = true;
        BetterBrain.loggingERR = logging_ERR;
        unsafeWindow[`ovibot`].ERR.state = BetterBrain.loggingERR;
        return `OviBot - Logging - ERR - ${logging_INF?`ENABLED`:`DISABLED`}`;
      },
      deactivate: () => {
        logging_ERR = false;
        BetterBrain.loggingERR = logging_ERR;
        unsafeWindow[`ovibot`].ERR.state = BetterBrain.loggingERR;
        return `OviBot - Logging - ERR - ${logging_ERR?`ENABLED`:`DISABLED`}`;
      },
      toggle: () => {
        logging_ERR = !logging_ERR;
        BetterBrain.loggingERR = logging_ERR;
        unsafeWindow[`ovibot`].ERR.state = BetterBrain.loggingERR;
        return `OviBot - Logging - ERR - ${logging_ERR?`ENABLED`:`DISABLED`}`;
      },
      state: BetterBrain.loggingERR
    },
  };
  unsafeWindow["ovibot"] = main;
  /* ENDREGION */
  if(main.user.uid > -1) {
    /* REGION "CSS" */
    main.config.justifyTabselement = GM_addStyle(`${(Brain.read(`__GLOBAL__.justifyTabs`, 1)===1)?main.config.justifyTabs:``}`);
    main.config.wsfixelement = GM_addStyle(`${(Brain.read(`__GLOBAL__.widescreenFix`, 1)===1)?main.config.defaults.widescreenFix:``}`);
    main.config.styledTabselement = GM_addStyle(`${main.config.tabStyles[Brain.read(`__GLOBAL__.skullTabs`, 0)].css}`);
    main.config.boxStyler = GM_addStyle(`
      :root {
         /* Arbeiter */
        --col_Worker_r: ${BetterBrain.col_Worker_r ||  59}  ;
        --col_Worker_g: ${BetterBrain.col_Worker_g ||  96}  ;
        --col_Worker_b: ${BetterBrain.col_Worker_b || 128}  ;

        --col_Worker_a:   1.0;

        --col_Worker_p:   4  ;
        --col_Worker_t:   2  ;


        /* Egger */

        /* Adopter */
        --col_AutoAdopter_r: ${BetterBrain.col_AutoAdopter_r ||  59}  ;
        --col_AutoAdopter_g: ${BetterBrain.col_AutoAdopter_g ||  96}  ;
        --col_AutoAdopter_b: ${BetterBrain.col_AutoAdopter_b || 128}  ;

        --col_AutoAdopter_a:   1.0;

        --col_AutoAdopter_p:   4  ;
        --col_AutoAdopter_t:   2  ;


        /* Kantine */
        --col_JumboSchreiner_r: ${BetterBrain.col_JumboSchreiner_r ||  59}  ;
        --col_JumboSchreiner_g: ${BetterBrain.col_JumboSchreiner_g ||  96}  ;
        --col_JumboSchreiner_b: ${BetterBrain.col_JumboSchreiner_b || 128}  ;

        --col_JumboSchreiner_a:   1.0;

        --col_JumboSchreiner_p:   4  ;
        --col_JumboSchreiner_t:   2  ;


        /* Namer */
        --col_Namer_r: ${BetterBrain.col_Namer_r ||  59}  ;
        --col_Namer_g: ${BetterBrain.col_Namer_g ||  96}  ;
        --col_Namer_b: ${BetterBrain.col_Namer_b || 128}  ;

        --col_Namer_a:   1.0;

        --col_Namer_p:   4  ;
        --col_Namer_t:   2  ;


        /* Sorter */
        --col_Sorter_r: ${BetterBrain.col_Sorter_r ||  59}  ;
        --col_Sorter_g: ${BetterBrain.col_Sorter_g ||  96}  ;
        --col_Sorter_b: ${BetterBrain.col_Sorter_b || 128}  ;

        --col_Sorter_a:   1.0;

        --col_Sorter_p:   4  ;
        --col_Sorter_t:   2  ;


        /* Zuchtstation */
        --col_BreedStation_r: ${BetterBrain.col_BreedStation_r ||  59}  ;
        --col_BreedStation_g: ${BetterBrain.col_BreedStation_g ||  96}  ;
        --col_BreedStation_b: ${BetterBrain.col_BreedStation_b || 128}  ;

        --col_BreedStation_a:   1.0;

        --col_BreedStation_p:   4  ;
        --col_BreedStation_t:   2  ;


        /* Oviraptor / Eier-Crusher */
        --col_EggCrusher_r: ${BetterBrain.col_EggCrusher_r ||  59}  ;
        --col_EggCrusher_g: ${BetterBrain.col_EggCrusher_g ||  96}  ;
        --col_EggCrusher_b: ${BetterBrain.col_EggCrusher_b || 128}  ;

        --col_EggCrusher_a:   1.0;

        --col_EggCrusher_p:   4  ;
        --col_EggCrusher_t:   2  ;


        /* Statistiken */
        --col_Stats_r: ${BetterBrain.col_Stats_r ||  59}  ;
        --col_Stats_g: ${BetterBrain.col_Stats_g ||  96}  ;
        --col_Stats_b: ${BetterBrain.col_Stats_b || 128}  ;

        --col_Stats_a:   1.0;

        --col_Stats_p:   4  ;
        --col_Stats_t:   2  ;


        /* Account-Generator */
        --col_AccountGenerator_r: ${BetterBrain.col_AccountGenerator_r ||  59}  ;
        --col_AccountGenerator_g: ${BetterBrain.col_AccountGenerator_g ||  96}  ;
        --col_AccountGenerator_b: ${BetterBrain.col_AccountGenerator_b || 128}  ;

        --col_AccountGenerator_a:   1.0;

        --col_AccountGenerator_p:   4  ;
        --col_AccountGenerator_t:   2  ;


        /* Tattoo-Studio */
        --col_TattooStudio_r: ${BetterBrain.col_TattooStudio_r ||  59}  ;
        --col_TattooStudio_g: ${BetterBrain.col_TattooStudio_g ||  96}  ;
        --col_TattooStudio_b: ${BetterBrain.col_TattooStudio_b || 128}  ;

        --col_TattooStudio_a:   1.0;

        --col_TattooStudio_p:   4  ;
        --col_TattooStudio_t:   2  ;


        /* Account-Liste */
        --col_AccountList_r: ${BetterBrain.col_AccountList_r ||  59}  ;
        --col_AccountList_g: ${BetterBrain.col_AccountList_g ||  96}  ;
        --col_AccountList_b: ${BetterBrain.col_AccountList_b || 128}  ;

        --col_AccountList_a:   1.0;

        --col_AccountList_p:   4  ;
        --col_AccountList_t:   2  ;
      }
    `);
    main.config.maincss = GM_addStyle(`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
      .cycleLetterSpacing {
        animation: oscillateLetterSpacing 1s infinite ease-in-out;
      }
      @keyframes oscillateLetterSpacing {
        0%, 100% {
          text-shadow: 0px 0px 0px rgba(255, 180, 0, 0.2), 0px 0px 0px rgba(255, 180, 0, 0.2), 0px 0px 0px rgba(255, 180, 0, 0.2), 0px 0px 0px rgba(255, 180, 0, 0.2), 0px 0px 0px rgba(255, 180, 0, 0.2);
          letter-spacing: 0px;
        }
        50% {
          text-shadow: 0px 0px 4px rgba(255, 180, 0, 0.2), 0px 0px 4px rgba(255, 180, 0, 0.2), 0px 0px 4px rgba(255, 180, 0, 0.2), 0px 0px 4px rgba(255, 180, 0, 0.2), 0px 0px 4px rgba(255, 180, 0, 0.2);
          letter-spacing: 0.5px;
        }
      }
      body {overflow-y:scroll;}
      div.ovipet_mainbox, div.ovipet_dialogue, div.ovipet_mainbox * {
        font-size:14px;
        font-family:'Noto Sans', sans-serif;
        vertical-align: middle !important;
      }
      div.ovipets_dialogue {
        font-size:14px;
        font-family:Segoe UI;
        position: fixed;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        margin: auto auto auto auto;
        width:40%;
        height:21%;
        max-width:1500px;
        max-height:1500px;
        min-width:200px;
        min-height:150px;
        box-sizing: border-box;
        border:5px solid #80b3d4;
        background:rgba(221, 236, 247, 0.95);
        background-image:url(https://cdn.ovipets.com/theme/bg-striped.png);
        background-size:50px 50px;
        border-radius:5px;
        z-index:110000;
        box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.8);
        display:none;
      }
      div.ovipets_dialogue div.button.okaybutton {
        position:absolute;
        bottom:5px;
        right:5px;
        width:20%;
        min-width: 120px;
        max-width: 250px;
        text-align:center;
      }
      div.ovipets_dialogue div.button.cancelbutton {
        position:absolute;
        bottom:5px;
        left:5px;
        width:20%;
        min-width: 120px;
        max-width: 250px;
        text-align:center;
      }
      div.ovipets_dialogue.visible {
        display:block;
      }
      div.ovipet_mainbox {
        position:fixed !important;
        top: 5px;
        box-sizing: border-box;
        border:5px solid #80b3d4;
        border-right:0px;
        background:rgba(221, 236, 247, 0.95);
        background-image:url(https://cdn.ovipets.com/theme/bg-striped.png);
        background-size:50px 50px;
        border-top-left-radius:15px;
        border-bottom-left-radius:15px;
        z-index:105050;
        transition: overflow-y 0ms, height 0ms, right 0ms;
        width: 450px;
        right: -385px;
        height:60px;
        overflow-y:hidden !important;
      }
      div.ovipet_mainbox.open {width:${main.config.panelwidth}px;}
      div.ovipet_mainbox.open {
        right: -0px;
        height:CALC(100% - 15px);
        overflow-y:scroll !important;
        box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.8);
      }
      div.ovipet_mainbox.open .titlebar {
        margin-right:-10px;
      }
      .configButton {
        border:0px !important;
        padding:0px !important;
        height:48px !important;
        width:48px !important;
        margin-left:0px;
        margin-bottom:-10px !important;
        margin-top:2px !important;
        margin-right:5px !important;
        border-radius: 0px !important;
        box-shadow:none !important;
        background-color:transparent !important;
        background-image:url(${main.config.defaults.configWheel}) !important;
        background-size:contain !important;
        background-repeat:no-repeat;
      }
      div.ovipet_mainbox:not(.open) .configButton {
        display:none !important;
      }
      div.ovipet_mainbox:not(.open) .titlebar {
        overflow:hidden !important;
        width:60px !important;
        border-radius:0px !important;
        box-shadow: none !important;
      }
      div.ovipet_mainbox:not(.open) .titlebar center {
        display:none !important;
      }
      div.ovipet_mainbox div.catbox , div.ovipets_dialogue div.catbox {
        box-sizing:border-box;
        margin:10px;
        background:rgba(221, 236, 247, 0.40);
        border:5px solid #80b3d4;
        border-radius:5px;
        box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
        padding-right:3px;
      }
      div.ovipets_dialogue div.catbox {
        position:absolute;
        top:15px;
        left:5px;
        right:5px;
        bottom:45px;
        box-shadow:none;
        background-color:rgba(249, 252, 254, 1);
      }
      div.catbox > div:first-child , div.ovipet_mainbox.open > div.catbox.clickableStyled.titlebar {
        white-space: nowrap;
        overflow:hidden;
      }
      div.ovipet_mainbox:not(.open) div.catbox:first-child {
        margin: 0px;
        height:60px;
        border:0px;
      }
      .clickableStyled {
        cursor:pointer;
      }
      .button , .button2 {
        box-sizing:border-box;
        border:5px solid #80b3d4;
        border-radius:5px;
        height:32px;
        cursor:pointer;
        background:rgba(221, 236, 247, 0.55);
        margin:5px;
        display:block;
        box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.5);
      }
      .button2 {
        overflow-y: auto !important;
      }
      .button {
        overflow:hidden;
        white-space: nowrap;
      }
      .button + select.button {
      }
      input.button {
        box-sizing:border-box;
        cursor:initial;
        width:150px;
      }
      input[type="checkbox"] + label.button {
        box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.5);
      }
      input[type="checkbox"]:checked + label.button , input[type="radio"]:checked + label.button , .checkedstyled {
        background:rgba(137, 196, 166, 0.55);
        border:5px solid rgb(77, 135, 105);
        position:relative;
        top:2px;
        left:2px;
        box-shadow: inset 13px 13px 5px -12px rgba(0, 0, 0, 0.3);
      }
      .petbox {
        box-sizing:border-box;
        margin:4px;
        background:rgba(221, 236, 247, 0.55);
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
        border:5px solid #80b3d4;
        border-radius:5px;
        display:inline-block;
        width:170px;
        height:118px;
        font-weight:normal;
      }
      .petbox .name {
        font-weight:bold;
      }
      .petbox .gender , .petbox .species {
        display:inline;
      }
      .petbox .gender {
        margin-right:4px;
      }
      .petbox .color {
        width: 24px;
        height:24px;
        border-radius:3px;
        margin:1px;
        box-sizing:border-box;
        overflow:hidden;
        display: inline-block;
      }
      .petbox .color.pure {
        border:1px dashed rgba(255, 255, 255, 0.9);
        outline:1px dashed rgba(0, 0,  0, 0.9) !important;
      }
      .petbox .button {
        display:inline-block;
        width:48px;
      }
      .button.disabled {
        border:5px solid #a6aeb3;
        color: #a6aeb3;
        background:rgba(221, 221, 221, 0.55);
      }
      .petbox .button.done {
        border:5px solid #a6aeb3;
        color: #a6aeb3;
        background:rgba(221, 221, 221, 0.55);
        animation:doneanimation 700ms linear;
      }
      div.progressbar , div.trackbar {
        box-sizing:border-box;
        height:18px;
        border:5px solid #80b3d4;
        border-radius:15px;
        background:#72a1c2;
        margin:5px;
        overflow:hidden;
      }
      div.worker_act {
        background-image:url(${main.config.defaults.act});
      }
      div.worker_ok {
        background-image:url(${main.config.defaults.successImage});
      }
      div.worker_no {
        background-image:url(${main.config.defaults.failedImage});
      }
      div.worker_act, div.worker_ok, div.worker_no {
        display:inline-block;
        float:left;
        margin-left:10px;
        margin-right:-40px;
        width:32px;
        height:32px;
        overflow:hidden;
        background-size:contain;
        background-repeat:no-repeat;
        background-position:center;
      }
      div.progressbar div.progress , div.trackbar div.progress {
        box-sizing:border-box;
        border-radius:15px;
        background: #b87a18;
        box-shadow: inset 0px 4px 0px -1px rgba(255, 255, 255, 0.3), inset 0px -8px 4px -7px rgba(0, 0, 0, 0.4);
        border-top: 1px solid rgba(255, 255, 255, 0.95);
        border-bottom: 1px solid rgba(0, 0, 0, 0.75);
        height:8px;
        transition:width 650ms cubic-bezier(0,.75,.25,1);
      }
      div.trackbar {
        cursor:text;
        height:23px;
      }
      div.trackbar div.progress {
        background-color:#4378e0 !important;
        height:13px;
      }
      div.notifybox {
        box-sizing: border-box;
        border:5px solid #80b3d4;
        background:rgba(221, 236, 247, 0.95);
        background-image:url(https://cdn.ovipets.com/theme/bg-striped.png);
        background-size:50px 50px;
        border-radius:5px;
        z-index:105080;
      }
      div.hidecontents {
        display:inline-block;
        box-sizing:border-box;
        width: CALC(20% - 15px);
        height:37px;
        padding:0px !important;
        margin:2px !important;
        margin-left:10px !important;
        padding-right:0px !important;
        box-shadow: 2px 2px 5px black !important;
        overflow:hidden;
      }
      div.catbox.box_Worker {
        border-color:rgba(var(--col_Worker_r), var(--col_Worker_g), var(--col_Worker_b), var(--col_Worker_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_Worker_r) / var(--col_Worker_p)), CALC(var(--col_Worker_g) / var(--col_Worker_p)), CALC(var(--col_Worker_b) / var(--col_Worker_p)), 1) !important;
      }
      div.catbox.box_Worker:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_Worker_r) / var(--col_Worker_t)), CALC(var(--col_Worker_g) / var(--col_Worker_t)), CALC(var(--col_Worker_b) / var(--col_Worker_t)), 1) !important;
        border-radius: 7px;
        margin-right: 3px;
      }
      div.catbox.box_AutoAdopter {
        border-color:rgba(var(--col_AutoAdopter_r), var(--col_AutoAdopter_g), var(--col_AutoAdopter_b), var(--col_AutoAdopter_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_AutoAdopter_r) / var(--col_AutoAdopter_p)), CALC(var(--col_AutoAdopter_g) / var(--col_AutoAdopter_p)), CALC(var(--col_AutoAdopter_b) / var(--col_AutoAdopter_p)), 1) !important;
      }
      div.catbox.box_AutoAdopter:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_AutoAdopter_r) / var(--col_AutoAdopter_t)), CALC(var(--col_AutoAdopter_g) / var(--col_AutoAdopter_t)), CALC(var(--col_AutoAdopter_b) / var(--col_AutoAdopter_t)), 1) !important;
        border-radius: 7px;
        margin-right:58px;
      }
      div.catbox.box_JumboSchreiner {
        border-color:rgba(var(--col_JumboSchreiner_r), var(--col_JumboSchreiner_g), var(--col_JumboSchreiner_b), var(--col_JumboSchreiner_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_JumboSchreiner_r) / var(--col_JumboSchreiner_p)), CALC(var(--col_JumboSchreiner_g) / var(--col_JumboSchreiner_p)), CALC(var(--col_JumboSchreiner_b) / var(--col_JumboSchreiner_p)), 1) !important;
      }
      div.catbox.box_JumboSchreiner:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_JumboSchreiner_r) / var(--col_JumboSchreiner_t)), CALC(var(--col_JumboSchreiner_g) / var(--col_JumboSchreiner_t)), CALC(var(--col_JumboSchreiner_b) / var(--col_JumboSchreiner_t)), 1) !important;
        border-radius: 7px;
        margin-right:58px;
      }
      div.catbox.box_Namer {
        border-color:rgba(var(--col_Namer_r), var(--col_Namer_g), var(--col_Namer_b), var(--col_Namer_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_Namer_r) / var(--col_Namer_p)), CALC(var(--col_Namer_g) / var(--col_Namer_p)), CALC(var(--col_Namer_b) / var(--col_Namer_p)), 1) !important;
      }
      div.catbox.box_Namer:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_Namer_r) / var(--col_Namer_t)), CALC(var(--col_Namer_g) / var(--col_Namer_t)), CALC(var(--col_Namer_b) / var(--col_Namer_t)), 1) !important;
        border-radius: 7px;
        margin-right:58px;
      }
      div.catbox.box_Sorter {
        border-color:rgba(var(--col_Sorter_r), var(--col_Sorter_g), var(--col_Sorter_b), var(--col_Sorter_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_Sorter_r) / var(--col_Sorter_p)), CALC(var(--col_Sorter_g) / var(--col_Sorter_p)), CALC(var(--col_Sorter_b) / var(--col_Sorter_p)), 1) !important;
      }
      div.catbox.box_Sorter:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_Sorter_r) / var(--col_Sorter_t)), CALC(var(--col_Sorter_g) / var(--col_Sorter_t)), CALC(var(--col_Sorter_b) / var(--col_Sorter_t)), 1) !important;
        border-radius: 7px;
        margin-right:58px;
      }
      div.catbox.box_BreedStation {
        border-color:rgba(var(--col_BreedStation_r), var(--col_BreedStation_g), var(--col_BreedStation_b), var(--col_BreedStation_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_BreedStation_r) / var(--col_BreedStation_p)), CALC(var(--col_BreedStation_g) / var(--col_BreedStation_p)), CALC(var(--col_BreedStation_b) / var(--col_BreedStation_p)), 1) !important;
      }
      div.catbox.box_BreedStation:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_BreedStation_r) / var(--col_BreedStation_t)), CALC(var(--col_BreedStation_g) / var(--col_BreedStation_t)), CALC(var(--col_BreedStation_b) / var(--col_BreedStation_t)), 1) !important;
        border-radius: 7px;
        margin-right:58px;
      }
      div.catbox.box_EggCrusher {
        border-color:rgba(var(--col_EggCrusher_r), var(--col_EggCrusher_g), var(--col_EggCrusher_b), var(--col_EggCrusher_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_EggCrusher_r) / var(--col_EggCrusher_p)), CALC(var(--col_EggCrusher_g) / var(--col_EggCrusher_p)), CALC(var(--col_EggCrusher_b) / var(--col_EggCrusher_p)), 1) !important;
      }
      div.catbox.box_EggCrusher:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_EggCrusher_r) / var(--col_EggCrusher_t)), CALC(var(--col_EggCrusher_g) / var(--col_EggCrusher_t)), CALC(var(--col_EggCrusher_b) / var(--col_EggCrusher_t)), 1) !important;
        border-radius: 7px;
        margin-right: 3px;
      }
      div.catbox.box_Stats {
        border-color:rgba(var(--col_Stats_r), var(--col_Stats_g), var(--col_Stats_b), var(--col_Stats_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_Stats_r) / var(--col_Stats_p)), CALC(var(--col_Stats_g) / var(--col_Stats_p)), CALC(var(--col_Stats_b) / var(--col_Stats_p)), 1) !important;
      }
      div.catbox.box_Stats:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_Stats_r) / var(--col_Stats_t)), CALC(var(--col_Stats_g) / var(--col_Stats_t)), CALC(var(--col_Stats_b) / var(--col_Stats_t)), 1) !important;
        border-radius: 7px;
        margin-right: 3px;
      }
      div.catbox.box_AccountGenerator {
        border-color:rgba(var(--col_AccountGenerator_r), var(--col_AccountGenerator_g), var(--col_AccountGenerator_b), var(--col_AccountGenerator_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_AccountGenerator_r) / var(--col_AccountGenerator_p)), CALC(var(--col_AccountGenerator_g) / var(--col_AccountGenerator_p)), CALC(var(--col_AccountGenerator_b) / var(--col_AccountGenerator_p)), 1) !important;
      }
      div.catbox.box_AccountGenerator:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_AccountGenerator_r) / var(--col_AccountGenerator_t)), CALC(var(--col_AccountGenerator_g) / var(--col_AccountGenerator_t)), CALC(var(--col_AccountGenerator_b) / var(--col_AccountGenerator_t)), 1) !important;
        border-radius: 7px;
        margin-right: 3px;
      }
      div.catbox.box_AccountList {
        border-color:rgba(var(--col_AccountList_r), var(--col_AccountList_g), var(--col_AccountList_b), var(--col_AccountList_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_AccountList_r) / var(--col_AccountList_p)), CALC(var(--col_AccountList_g) / var(--col_AccountList_p)), CALC(var(--col_AccountList_b) / var(--col_AccountList_p)), 1) !important;
      }
      div.catbox.box_TattooStudio {
        border-color:rgba(var(--col_TattooStudio_r), var(--col_TattooStudio_g), var(--col_TattooStudio_b), var(--col_TattooStudio_a)) !important;
        box-shadow: 2px 2px 5px rgba(CALC(var(--col_TattooStudio_r) / var(--col_TattooStudio_p)), CALC(var(--col_TattooStudio_g) / var(--col_TattooStudio_p)), CALC(var(--col_TattooStudio_b) / var(--col_TattooStudio_p)), 1) !important;
      }
      div.catbox.box_AccountList:not(.hidecontents) > div:nth-child(1) {
        background:rgba(CALC(var(--col_AccountList_r) / var(--col_AccountList_t)), CALC(var(--col_AccountList_g) / var(--col_AccountList_t)), CALC(var(--col_AccountList_b) / var(--col_AccountList_t)), 1) !important;
        border-radius: 7px;
        margin-right: 3px;
      }
      div:not(.hidecontents) > div.first-child {
        background-image:none !important;
      }
      div.hidecontents > div:first-child {
        width:100%;
        height:14px;
        font-size:10px;
        box-sizing:border-box;
        padding-left:3px;
        color:rgba(0, 0, 0, 0.50);
      }
      div.hidecontents > *:not(:first-child) {
        display:none !important;
      }
      div:not(.hidecontents) > .progress_slot {

      }
      div.hidecontents > input:checked + .progress_slot {
        border-left:0px;
        border-right:0px;
        border-bottom:0px;
      }
      div.hidecontents > .progress_slot > div.progress {
        border-radius:0px !important;
      }
      div.hidecontents > .progress_slot {
        display:block !important;
        width:100% !important;
        font-size:6px;
        font-weight:normal;
        padding:0px;
        box-sizing:border-box !important;
        height:14px;
        box-shadow: 0px 0px 0px transparent !important;
        border-left:0px;
        border-right:0px;
        border-bottom:0px;
        position:initial !Important;
        margin:0px;
        overflow:hidden;
        border-radius:0px !important;
        color:rgba(0, 0, 0, 0.65);
      }
      .fat {
        font-weight:bold;
      }
      .slim {
        font-weight:normal;
      }
      .center {
        text-align:center;
      }
      .block {
        display:block;
        clear:both;
      }
      .hidden {
        display:none !important;
      }
      .maxheight {
        max-height: 246px;
        padding-bottom:15px;
        overflow-y:scroll;
      }
      .hascursor {
        cursor:pointer;
      }
      div.ovipet_mainbox.widescreen {
        top: 125px;
        height:CALC(100% - 135px);
      }
      div.ovipet_mainbox {
        transition: right 100ms ease-out, width 100ms ease-in, top 300ms ease-in, height 300ms ease-out;
      }
      @media only screen and (max-width: ${Math.floor(main.config.panelwidth*2)+730}px) {/*FIXWS*/
        div.ovipet_mainbox:not(.widescreen) {
          top: 125px;
          height:CALC(100% - 135px) !important;
        }
        ${(Brain.read(`__GLOBAL__.WSMFIX`, `1`)==`1`)?main.config.defaults.widescreenModuleFix:`/*WSMFIX*/`}
      }
      div.ovipet_mainbox.widescreen:not(.open) {
        top: 5px;
        height:60px !important;
      }
      .minibutton {
        border: 1px solid black;
        background:rgba(80, 80, 80, 0.2);
        border-radius:5px;
        margin-right:2px;
        box-sizing: border-box;
        width:24px;
        height:24px;
        display:inline-block;
        text-align:center;
      }
      input[type="checkbox"]:checked + .minibutton {
        background:rgba(0, 220, 0, 0.7);
      }
      ${(Brain.read(`__GLOBAL__.widescreenFix`, `0`)==`1`)?`/*PETBG*/`:main.config.defaults.petBackgroundFix}
      ${(Brain.read(`__GLOBAL__.scrollableTabsFix`, `0`)==`1`)?main.config.defaults.scrollableTabsFix:`/*scrollableTabsFix*/`}
    `);
    main.config.darkModeStyle = GM_addStyle(``);
    main.config.tabSideBarCSS = GM_addStyle(``);

    let darkmode = false;
    document.querySelectorAll(`link`).forEach(n=>{
      if(n.href.indexOf(`darkmode.css`) > -1) {
        darkmode = true;
      }
    });
    if((darkmode || BetterBrain.useDarkMode == `1`) && BetterBrain.useDarkMode != 2) main.config.darkModeStyle.innerHTML = main.config.defaults.darkModeStyle;

    /* ENDREGION */
    /* REGION "Hash-Load-System" */
    let isLoading = true;
    if(window.location.href.substr(window.location.href.length - 2, 2).toLowerCase() != "#b" && Brain.read("__GLOBAL__.onlyStartHashtag", "0") == "1") {
      isLoading = false;
    } else
    if(window.location.href.substr(window.location.href.length - 2, 2).toLowerCase() == "#b" && Brain.read("__GLOBAL__.onlyStartHashtag", "0") == "1") {
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.href.substr(0, window.location.href.length - 2));
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }, 500);
      isLoading = true;
    }
    /* ENDREGION */
    /* REGION "Bot-Root-System anlegen" */
    main.boxes.root = main.tools.createElement(`div`, `ovipet_mainbox${(Brain.read(`__GLOBAL__.expanded`, 1)==1 && isLoading)?` open`:``}`);
    main.boxes.titlebar = main.boxes.root.addCat(true, () => {
      main.boxes.root.classList.toggle(`open`);
      Brain.write(`__GLOBAL__.expanded`, (main.boxes.root.classList.contains(`open`))?1:0);
    });
    main.boxes.titlebar.style.width = `CALC(100% - 74px)`;
    main.boxes.titlebar.style.display = `inline-block`;
    main.boxes.titlebar.style.backgroundImage = `url(https://images.emojiterra.com/twitter/v14.0/512px/1fae1.png)`;
    main.boxes.titlebar.style.backgroundRepeat = `no-repeat`;
    main.boxes.titlebar.style.backgroundSize = `16px 16px`;
    main.boxes.titlebar.style.backgroundPosition = `6px 7px`;

    main.boxes.titlebar.classList.add(`titlebar`);
    main.boxes.titlebar.in(main.tools.createElement(`center`, ``, `Ovibot Last Stand`));

    if(Brain.read(`__GLOBAL__.widescreenFix`, `0`)==`1`) {
      main.boxes.root.classList.add("widescreen");
    } else {
      main.boxes.root.classList.remove("widescreen");
    }
    main.currentBotIncome = parseInt(Brain.read(`__GLOBAL__.creditGains`, `0`));
    main.boxes.titlebar.style.width = isLoading?main.boxes.titlebar.style.width:`CALC(100% - 30px)`;
    /* ENDREGION */
    /* REGION "SETUP" */
    if(isLoading) {
      main.boxes.settingsButton = main.boxes.root.addCat(true, () => {
        if(!main.configWindowHolder.box.classList.contains(`hidden`)) {
          main.configWindowHolder.box.classList.add(`hidden`);
          main.configWindowHolder.box.classList.remove(`visible`);
        } else {
          main.configWindowHolder.box.classList.remove(`hidden`);
          main.configWindowHolder.box.classList.add(`visible`);
        }
      });
      main.boxes.settingsButton.style.width = `CALC(32px)`;
      main.boxes.settingsButton.style.display = `inline-block`;
      main.boxes.settingsButton.style.float = `right`;
      main.boxes.settingsButton.classList.add(`configButton`);

      main.boxes.root.in(main.boxes.settingsButton);

      main.worker = new Worker();
      main.adopter = new AutoAdopter();
      main.configWindowHolder = new ConfigWindow();
      main.jumboschreiner = new JumboSchreiner();
      main.namer = new Namer();
      main.sorter = new Sorter();
      main.autorunner = new AutoRunner();
      main.accountList = new AccountList();
      main.popupInputHelper = new VarsInputHelperWindow();
      main.listsWindowHandler = new ListsWindow();
      main.stats = new Stats();
      main.boxStyler = new BoxStyler();

      setTimeout(() => {
        if(Brain.read(`__GLOBAL__.autoRunnerActive`,0)==1) {
          main.autorunner.initializeRestart(true);
        }
      }, 500);
    } else {
      main.worker = {
        box: (() => {
          let br = () => {
            main.tools.createElement(`br`).to(b);
          }
          let b = main.tools.createElement(`div`, `center`, `Der Bot ist in diesem Tab nicht aktiv! Du hast die "Start-URL" in den Einstellungen aktiviert. Damit der Bot startet, muss ovipets so aufgerufen werden, dass am Ende der URL ein "#b" steht.`);
          br();
          br();

          let l = main.tools.createElement(`a`, ``, `Dieses Tab mit Bot neu laden.`).to(b);
          l.setAttribute(`target`, `_top`);
          l.addEventListener(`click`, () => {
            window.location.href = `${window.location.href}#b`;
            window.history.go(0);
          }, true)
          br();
          br();

          let d = main.tools.createElement(`div`, `button`, `Die Option "Start-URL" deaktivieren und seite neu laden`).to(b);
          d.addEventListener("click", () => {
            let c = confirm("Möchtest du die Einstellung \"Start-URL\" wirklich ausschalten und die Seite neu laden?");
            if(c == true) {
              Brain.write("__GLOBAL__.onlyStartHashtag", "0");
              location.reload();
            }
          }, true);
          br();
          br();
          return b;
        })()
      };
    }
    /* ENDREGION */
    /* REGION "Update Visualize" */
    main.updateNotification = main.tools.createElement(`div`, `button center hidden cycleLetterSpacing`);
    main.updateNotification.css({
      borderColor: `orange`,
      background: `ivory`,
      width: `CALC(100% - 66px)`,
      display: `inline-block`,
    })
    main.updateNotification.addEventListener(`click`, () => {
      GM_openInTab(`https://greasyfork.org/de/scripts/443300-ovipets-megabot-version-3-beta`, { active: true, insert: false });
    }, true)
    main.updateLink = main.tools.createElement(`div`, ``, `Neues Update! Klicke hier.`);
    main.updateLink.css({
      color: `indianred`,
    })
    main.updateNotification.in(main.updateLink);
    main.boxes.root.in(main.updateNotification);
    main.ignoreNewVersion = main.tools.createElement(`div`, `button center hidden`, `X`);
    main.ignoreNewVersion.setAttribute(`title`, `Ignoriere diese Version\n\nEntfernt diese Benachrichtigung und verhindert, dass sie erneut auftaucht. Erscheint bei einem Update zu einer neueren Version dann wieder.`);
    main.ignoreNewVersion.css({
      display: `inline-block`,
      width: `32px`,
    });
    main.ignoreNewVersion.addEventListener(`click`, () => {
      let iv = (BetterBrain.ignoredVersions || []);
      iv.push(lastFoundVersion);
      BetterBrain.ignoredVersions = iv;
      main.updateNotification.classList.add(`hidden`);
      main.ignoreNewVersion.classList.add(`hidden`);
    }, true);
    main.boxes.root.in(main.ignoreNewVersion);
    /* ENDREGION */



    main.boxes.quickButtonList = main.tools.createElement(`div`, ``, ``).to(main.boxes.root);
    main.boxes.quickButtonList.style.margin = "0px 10px 40px 10px";

    if(__buttons.indexOf("unlocker") > -1) {
    /* REGION "Unlocker-Button hinzufügen" */
    main.boxes.quickToggleLockButton = main.tools.createElement(`div`, `button center noinv`, `🔑`);
    main.boxes.quickToggleLockButton.setAttribute(`title`, `Sperre / Entsperre Pets`);
    main.boxes.quickToggleLockButton.style.width = `30px`;
    main.boxes.quickToggleLockButton.style.margin = `0px`;
    main.boxes.quickToggleLockButton.style.display = `inline-block`;
    main.boxes.quickToggleLockButton.style.marginRight = `10px`;
    main.boxes.quickToggleLockButton.addEventListener(`click`, async () => {
      var rsl = [...document.querySelectorAll('div.ui-tabs div.ui-tabs-panel:not([aria-hidden="true"]) a.pet.name')].map(a=>{
        let url = a.href;
        let petID = parseInt(url.substr(url.lastIndexOf("=") + 1));
        let encID = -1;
        try {
          encID = parseInt(document.querySelector("li.ui-tabs-tab.ui-tabs-active.ui-state-active").getAttribute("enclosure").split("_")[1]);
        } catch {}
        return new Work(
          main.tools,
          `unlocker`,
          [petID, encID],
          `Entsperre Pet ${petID}`
        );
      });
      if(rsl.length > 0) {
        let t = `Möchtest du diese ${rsl.length} Pet${(rsl.length!=1)?``:`s`} wirklich Sperren/Entsperren lassen?`;
        if(confirm(t)) {
          let w = prompt(`Welchen Arbeiter möchtest du für die Aufgaben nutzen?\nGibst du "1" ein, wird der erste Arbeiter genutzt.\nWenn du "2" eingibst, wird der 2te Arbeiter genutzt.\nAlles andere benutzt den Standard-Arbeiter.`, ``);
          w = (w=="1")?0:(w=="2")?1:-1;
          if(w == -1) {
            main.worker.addBunch(rsl, false);
          } else {
            main.worker.addBunch(rsl, false, w);
          }
        }
      }
    }, true);
    main.boxes.quickButtonList.in(main.boxes.quickToggleLockButton);
    /* ENDREGION */
    }
    if(__buttons.indexOf("presentation") > -1) {
    /* REGION "Presentation-Button hinzufügen" */
    main.boxes.quickSetDescription = main.tools.createElement(`div`, `button center noinv`, `📝`);
    main.boxes.quickSetDescription.setAttribute(`title`, `Setze Beschreibungs-Text von Pets`);
    main.boxes.quickSetDescription.css({
      width: `30px`,
      margin: `0px`,
      marginRight: `10px`,
      display: `inline-block`,
    })
    main.boxes.quickSetDescription.addEventListener(`click`, async () => {
      var rsl = [...document.querySelectorAll('div.ui-tabs div.ui-tabs-panel:not([aria-hidden="true"]) a.pet.name')];

      if(rsl.length > 0) {
        let currentDesc = Brain.read(`__GLOBAL__.autodescription`, ``);
        let targetDesc = prompt(`Gib hier den Text ein, welcher für die Tiere eingesetzt werden soll.`, currentDesc);
        Brain.write(`__GLOBAL__.autodescription`, currentDesc);

        rsl = rsl.map(a=>{
          let url = a.href;
          let petID = parseInt(url.substr(url.lastIndexOf("=") + 1));
          return new Work(
            main.tools,
            `descriptionSetter`,
            [petID, targetDesc],
            `Setze Text für Pet ${petID}`
          );
        });
        let t = `Bist du sicher, dass du den Beschreibungs-Text von ${rsl.length} Pet${(rsl.length!=1)?``:`s`} ändern willst? (Insofern möglich)`;
        if(confirm(t)) {
          let w = prompt(`Welchen Arbeiter möchtest du für die Aufgaben nutzen?\nGibst du "1" ein, wird der erste Arbeiter genutzt.\nWenn du "2" eingibst, wird der 2te Arbeiter genutzt.\nAlles andere benutzt den Standard-Arbeiter.`, ``);
          w = (w=="1")?0:(w=="2")?1:-1;
          if(w == -1) {
            main.worker.addBunch(rsl, false);
          } else {
            main.worker.addBunch(rsl, false, w);
          }
        }
      }
    }, true);
    main.boxes.quickButtonList.in(main.boxes.quickSetDescription);
    /* ENDREGION */
    }
    if(__buttons.indexOf("tradeaccept") > -1) {
    /* REGION "Speed Trade Accepter  hinzufügen" */
    main.boxes.quickTransferTradeNow = main.tools.createElement(`div`, `button center noinv`, `🫴🏽`);
    main.boxes.quickTransferTradeNow.setAttribute(`title`, `Schnell-Handels-Übertragungs-Tool`);
    main.boxes.quickTransferTradeNow.style.width = `30px`;
    main.boxes.quickTransferTradeNow.style.margin = `0px`;
    main.boxes.quickTransferTradeNow.style.marginRight = `10px`;
    main.boxes.quickTransferTradeNow.style.display = `inline-block`;
    main.boxes.quickTransferTradeNow.addEventListener(`click`, async () => {
      let target = document.querySelector(`fieldset.send div ul`);
      target.parentNode.style.maxHeight = `400px`;
      target.parentNode.style.overflowY = `scroll`;
      let r = document.querySelector(`.ui-tabs div.ui-tabs-panel:not([style="display: none;"]) section div form ul`);
      let maxAdd = Math.max(0, Math.min(r.childNodes.length, 1000 - target.childNodes.length));
      if(maxAdd < r.childNodes.length) {
        if(confirm(`Möchtest du mehr als 1000 Einträge zur Handelsanfrage hinzufügen?\n\nDrücke auf OKAndernfalls werden nur so viele Einträge hinzugefügt,\ndass maximal 1000 Einträge dem Handel insgesamt hinzugefügt werden.`)) {
          maxAdd = r.childNodes.length;
        }
      }
      r.childNodes.forEach(i=>{
        if(i.style.display != `none` && maxAdd > 0) {
          maxAdd--;
          let clonedNode = i.cloneNode(true);
          target.appendChild(clonedNode);
          i.style.display = `none`;
        }
      });
      if(target.childNodes.length > 0) {
        document.querySelector(`.drag_drop`).style.display = `none`;
      } else {
        document.querySelector(`.drag_drop`).style = ``;
      }
    }, true);
    main.boxes.quickButtonList.in(main.boxes.quickTransferTradeNow);
    /*
    #breeding > div:nth-child(2) > form:nth-child(1) > ul:nth-child(4)
    #breeding > div:nth-child(2) > form:nth-child(1) > ul:nth-child(4) li
    .send > div:nth-child(2) > ul:nth-child(3)
    */
    /* ENDREGION */
    }
    if(__buttons.indexOf("breedtrade") > -1) {
    /* REGION "BreedTradeGenerator-Button hinzufügen" */
    if(DEBUG) {
      main.boxes.quickBreedTrade = main.tools.createElement(`div`, `button center noinv`, `🥚`);
      main.boxes.quickBreedTrade.setAttribute(`title`, `Erzeugt einen Breed-Trade zu einem der erzeugten Accounts.\nFunktioniert nur, wenn ein eigenes männliches Pet gerade geöffnet ist.`);
      main.boxes.quickBreedTrade.style.width = `30px`;
      main.boxes.quickBreedTrade.style.margin = `0px`;
      main.boxes.quickBreedTrade.style.marginRight = `10px`;
      main.boxes.quickBreedTrade.style.display = `inline-block`;
      main.boxes.quickBreedTrade.addEventListener(`click`, async () => {
        if(!main.boxes.quickBreedTrade.classList.contains(`disabled`)) {
          main.boxes.quickBreedTrade.classList.add(`disabled`);
          var rsl = document.querySelector('.overview > div:nth-child(2) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(2) > p:nth-child(1)');
          if(rsl !== null) {
            if(rsl.innerHTML.substr(0, 1).toLowerCase() == "m") {
              var rsl2 = document.querySelector(`.pet`);
              let rx = new RegExp(`${main.user.uid}&pet=(.*)`, `gi`);
              let rr = rx.exec(rsl2.href.toString());
              if(rr !== null) {
                let petMale = rr[1];

                let encList = await Enclosures.getEnclosures();
                main.boxes.enclosureWindowSelectedEnclosures = [];
                let crStep = 0;

                let selectedFriends = [];
                let breedCommands = [];

                let enclDone = async () => {
                  if(crStep == 0) {
                    crStep = 1;
                    breedCommands = [];
                    selectedFriends = [];
                    let selectedEnclosures = main.boxes.enclosureWindowSelectedEnclosures.filter(entry=>{return entry.checked});
                    let selectedEnclosuresNames = selectedEnclosures.map(ec=>`"${ec.getAttribute(`encName`)}" (${ec.value})`);
                    main.boxes.enclosureWindowcontent.innerHTML = "";
                    if(selectedEnclosures.length > 0) {
                      let consoleOut = main.tools.createElement(`div`, `center`, ``);
                      main.boxes.enclosureWindowcontent.in(consoleOut);
                      for(let i in selectedEnclosures) {
                        let a = selectedEnclosures[i];
                        consoleOut.innerHTML = `Durchgang für Enclosure "${a.getAttribute(`encName`)}" (${a.value})`;
                        await main.tools.sleep(50);
                        let cnt = await Connection.GET(`https://ovipets.com/?src=pets&sub=profile&sec=breeding&pet=${petMale}&enclosure=${a.value}${main.config.crack}`);
                        let rxx = /FPetID=(\d+)&amp;/gi;
                        let rrr = null;

                        let whores = [];

                        while(rrr = rxx.exec(cnt.responseText)) {
                          try {
                            whores.push(parseInt(rrr[1]));
                          } catch (ex) {
                          }
                        }

                        cnt = whores;

                        consoleOut.innerHTML = `Pets in Enclosure "${a.getAttribute(`encName`)}" (${a.value}): ${cnt.length}`;
                        await main.tools.sleep(1);

                        if(cnt.length > 0) {
                          consoleOut.innerHTML = `Enclosure "${a.getAttribute(`encName`)}" (${a.value}) füge ${cnt.length} paare hinzu ...`;
                          await main.tools.sleep(1);
                          for(let n in cnt) {
                            breedCommands.push([petMale, cnt[n]]);
                          }

                        } else {
                          consoleOut.innerHTML = `Enclosure "${a.getAttribute(`encName`)}" (${a.value}) wird ignroiert.`;
                          await main.tools.sleep(1);
                        }
                      }
                      consoleOut.innerHTML = `Es wurden ${breedCommands.length} paar${breedCommands.length==1?``:`e`} gefunden.\r\n`;
                      let friendsfav = await main.user.getFriends(true, true);
                      let friends = await main.user.getFriends(false, true);
                      consoleOut.innerHTML += `An wen sollen die Paare gesendet werden?\r\n`;

                      let btn1000 = null;
                      let btn1000Lbl = null;

                      [btn1000, btn1000Lbl] = main.tools.createToggle(`btn1000`, `1000 pro Nutzer, wenn möglich`, () => {
                        if(btn1000.checked) {
                          let fullcnt = Math.floor(breedCommands.length / 1000);
                          let leftover = breedCommands.length - (fullcnt * 1000);
                          curState.innerHTML = `Für die ersten ${fullcnt} Nutzer würden je 1000 Paare gezüchtet werden.<br />`;
                          curState.innerHTML+= `Für den ${fullcnt + 1}ten Nutzer würden ${leftover} Paare gezüchtet werden.`;
                        } else {
                          let amt = Math.max(1, selectedFriends.filter(e=>e.checked).length);
                          let cnt = Math.min(1000, Math.ceil(breedCommands.length / amt));
                          curState.innerHTML = `Pro Nutzer würden maximal ${cnt} Paare gezüchtet werden.`;
                        }
                      }, false);
                      btn1000Lbl.style.display = `inline-block`;
                      main.boxes.enclosureWindowcontent.in(btn1000);
                      main.boxes.enclosureWindowcontent.in(btn1000Lbl);

                      let curState = main.tools.createElement(`div`, `center`, `Pro Nutzer würden maximal ${Math.min(1000, breedCommands.length)} Paare gezüchtet werden.`);

                      let logins = Brain.read(`__GLOBAL__.generated_logins`, []).map(t=>{return t.name;});
                      let favs = friendsfav.map(a=>a[1]);
                      friends.sort((a, b) => {
                        return (a[1] > b[1])?1:-1;
                      })
                      friends = friends.map(a=>{
                        let isLog1 = logins.includes(a[1]);
                        let isFav1 = favs.includes(a[1]);
                        a[2] = isLog1?2:(isFav1?1:0);
                        return a;
                      }).sort((a, b) => {
                        return b[2] - a[2];
                      });

                      let c = [
                        "#C0FFC0",
                        "#C0C0FF",
                        "#FFC0C0"
                      ]

                      main.boxes.enclosureWindowcontent.in(curState);
                      friends.forEach((freundElement) => {
                        let btnChB = null;
                        let btnLbl = null;

                        [btnChB, btnLbl] = main.tools.createToggle(`friend_receiver_${freundElement[0]}`, `${freundElement[1]}<br />(${freundElement[0]})`, () => {
                          if(btn1000.checked) {
                            let fullcnt = Math.floor(breedCommands.length / 1000);
                            let leftover = breedCommands.length - (fullcnt * 1000);
                            curState.innerHTML = `Für die ersten ${fullcnt} Nutzer würden je 1000 Paare gezüchtet werden.<br />`;
                            curState.innerHTML+= `Für den ${fullcnt + 1}ten Nutzer würden ${leftover} Paare gezüchtet werden.`;
                          } else {
                            let amt = Math.max(1, selectedFriends.filter(e=>e.checked).length);
                            let cnt = Math.min(1000, Math.ceil(breedCommands.length / amt));
                            curState.innerHTML = `Pro Nutzer würden maximal ${cnt} Paare gezüchtet werden.`;
                          }
                        }, false);
                        btnChB.setAttribute(`value`, `${freundElement[0]}`);
                        btnChB.setAttribute(`data-name`, `${freundElement[1]}`);

                        selectedFriends.push(btnChB);

                        btnLbl.style.fontFamily = `Lucida Grande, Lucida Sans, Arial, sans-serif`;
                        btnLbl.style.textAlign = `center`;
                        btnLbl.style.backgroundColor = `${c[freundElement[2]]}`;
                        btnLbl.style.display = `inline-block`;
                        btnLbl.style.padding = `10px`;
                        btnLbl.style.paddingTop = `4px`;
                        btnLbl.style.paddingBottom = `4px`;
                        btnLbl.style.minWidth = `80px`;
                        btnLbl.style.height = `52px`;
                        btnLbl.style.lineHeight = `1.15`;

                        main.boxes.enclosureWindowcontent.in(btnChB);
                        main.boxes.enclosureWindowcontent.in(btnLbl);
                      });
                    }
                  } else if (crStep == 1) {
                    crStep = 2;
                    selectedFriends = selectedFriends.filter(e=>e.checked);
                    let slicedElements = Math.min(1000, Math.ceil(breedCommands.length / selectedFriends.length));
                    let currentOffset = 0;
                    selectedFriends = selectedFriends.map(e=>{
                      let cnt = Math.min(breedCommands.length, slicedElements);
                      if(btn1000.checked) {
                        cnt = Math.min(1000, breedCommands.length);
                      }
                      if(cnt > 0) {
                        let element = {
                          name: e.getAttribute(`data-name`),
                          id: e.getAttribute(`value`),
                          works: breedCommands.splice(0, cnt)
                        }
                        currentOffset++;
                        return element;
                      } else {
                        return null;
                      }
                    });
                    selectedFriends = selectedFriends.filter(n=>n!==null);

                    main.boxes.enclosureWindowcontent.innerHTML = "Trades werden gesendet ...<br /><br />";
                    let alreadySaid = false;

                    for(var i = 0;i < selectedFriends.length;i++) {
                      main.boxes.enclosureWindowcontent.innerHTML += `(${selectedFriends[i].id}) ${selectedFriends[i].name} Erstelle Trade mit ${selectedFriends[i].works.length} Züchtungen ... `;
                      let postData = [];
                      postData.push({name: `Send[Credits]`, value: `0`, title: `Command`});
                      for(var j = 0;j < selectedFriends[i].works.length;j++) {
                        postData.push({name: `Send[Breedings][${selectedFriends[i].works[j][1]}]`, value: `${selectedFriends[i].works[j][0]}`, title: `Command`});
                      }
                      let createTrade = [...postData];
                      createTrade.unshift({name: `UserID`, value: `${selectedFriends[i].id}`, title: `Command`});
                      createTrade.unshift({name: `cmd`, value: `trade_create`, title: `Command`});

                      let rsl = await Connection.POSTArray(createTrade);
                      if(rsl) {
                        main.boxes.enclosureWindowcontent.innerHTML += `Erfolg<br />`;
                        main.boxes.enclosureWindowcontent.innerHTML += `(${selectedFriends[i].id}) ${selectedFriends[i].name} Trade wird gesucht ... `;

                        let targetUrl = `https://ovipets.com/?src=trading&sub=request&sec=request&trade=last&usr=${selectedFriends[i].id}&prio=1${main.config.crack}`;
                        let data = await Connection.GET(targetUrl);

                        let r = /trade=([a-f0-9]+)/gi;

                        try {
                          let trade_id = r.exec(data.responseText)[1];
                          main.boxes.enclosureWindowcontent.innerHTML += `Gefunden<br />`;
                          main.boxes.enclosureWindowcontent.innerHTML += `(${selectedFriends[i].id}) ${selectedFriends[i].name} Trade wird akzeptiert ... `;

                          let createTrade = [...postData];
                          createTrade.unshift({name: `TradeID`, value: `${trade_id}`, title: `Command`});
                          createTrade.unshift({name: `cmd`, value: `trade_accept`, title: `Command`});

                          let rsl = await Connection.POSTArray(createTrade);

                          if(rsl) {
                            main.boxes.enclosureWindowcontent.innerHTML += `Erfolg<br />`;
                          } else {
                            main.boxes.enclosureWindowcontent.innerHTML += `Fehlschlag<br />`;
                          }

                          let logins_lis = Brain.read(`__GLOBAL__.generated_logins`, []);
                          let logins = logins_lis.filter(l=>l.name==selectedFriends[i].name);
                          let rootLogin = logins_lis.filter(l=>l.name==main.user.name);
                          if(rootLogin.length > 0 && logins.length > 0) {
                            main.boxes.enclosureWindowcontent.innerHTML += `Handel wird automatisch akzeptiert ... `;

                            try {
                              await main.tools.quickLogin(logins[0].username, logins[0].password, true);
                              await main.tools.sleep(1500);

                              let tradeAcceptResult = await Connection.POSTArray([
                                {name: `TradeID`, value: `${trade_id}`, title: `Command`},
                                {name: `cmd`, value: `trade_accept`, title: `Command`},
                                {name: `Send[Credits]`, value: `0`, title: `Command`}
                              ]);

                              logs(`[quickBreed] > `, tradeAcceptResult);

                              main.boxes.enclosureWindowcontent.innerHTML += `Erledigt<br />`;

                              main.boxes.enclosureWindowcontent.innerHTML += `Zurück zum Haupt-Account ... `;

                              await main.tools.quickLogin(rootLogin[0].username, rootLogin[0].password, true);
                              await main.tools.sleep(1500);
                              main.boxes.enclosureWindowcontent.innerHTML += `Erledigt<br />`;
                            } catch (e) {
                              errors (e);
                            }
                          } else {
                            if(!alreadySaid) {
                              alreadySaid = true;
                              main.boxes.enclosureWindowcontent.innerHTML += `Handel wird nicht automatisch akzeptiert, da der Haupt-Account, mit dem du gerade eingeloggt bist, nicht gespeichert ist. Wende dich diesbezüglich an Mindconstructor.`;
                            }
                          }
                        } catch (e) {
                          errors(e);
                          main.boxes.enclosureWindowcontent.innerHTML += `Fehlschlag<br />`;
                        }
                      } else {
                        main.boxes.enclosureWindowcontent.innerHTML += `Fehlschlag<br />`;
                      }
                    }
                  } else if (crStep == 2) {
                    crStep = 3;
                  }
                }
                // https://ovipets.com/?src=pets&sub=profile&sec=breeding&pet=429115177&enclosure=278&!=jQuery36008868265368988099_1701614518168&_=1701614518175

                if(main.boxes.enclosureWindow == undefined) {
                  main.boxes.enclosureWindow = main.tools.createElement(`div`, `ovipets_dialogue visible`);
                  main.boxes.enclosureWindow.style.maxHeight = "675px";
                  main.boxes.enclosureWindow.style.height = "100%";
                  main.boxes.enclosureWindow.style.width = "790px";

                  main.boxes.enclosureWindowsave = main.tools.createElement(`div`, `button okaybutton`, `Übernehmen`);
                  main.boxes.enclosureWindowsave.addEventListener(`click`, enclDone, true);
                  main.boxes.enclosureWindow.in(main.boxes.enclosureWindowsave);

                  main.boxes.enclosureWindowcancel = main.tools.createElement(`div`, `button cancelbutton`, `Abbrechen`);
                  main.boxes.enclosureWindowcancel.addEventListener(`click`, () => {
                    main.boxes.enclosureWindow.classList.remove(`visible`);
                    main.boxes.enclosureWindow.classList.add(`hidden`);
                  }, true);
                  main.boxes.enclosureWindow.in(main.boxes.enclosureWindowcancel);

                  main.boxes.enclosureWindowcontent = main.tools.createElement(`div`, `catbox`);
                  main.boxes.enclosureWindowcontent.style.overflowY = `scroll`;
                  main.boxes.enclosureWindow.in(main.boxes.enclosureWindowcontent);
                  document.body.in(main.boxes.enclosureWindow);
                }

                main.boxes.enclosureWindowcontent.innerHTML = ``;

                encList.map(async (enc) => {
                  let chkEnc = null;
                  let chkEncLabel = null;

                  [chkEnc, chkEncLabel] = main.tools.createToggle(`enclosure_selector_${enc.id}`, `${enc.name}`, () => {}, false);
                  chkEnc.setAttribute(`value`, enc.id);
                  chkEnc.setAttribute(`encName`, `${enc.name}`);
                  chkEncLabel.style.textAlign = `center`;
                  chkEncLabel.style.display = `inline-block`;
                  chkEncLabel.style.minWidth = `10px`;
                  chkEncLabel.style.paddingLeft = `5px`;
                  chkEncLabel.style.paddingRight = `5px`;

                  main.boxes.enclosureWindowSelectedEnclosures.push(chkEnc);
                  main.boxes.enclosureWindowcontent.in(chkEnc);
                  main.boxes.enclosureWindowcontent.in(chkEncLabel);
                });
              }
            }
          }
        }
      }, true);
      main.boxes.quickButtonList.in(main.boxes.quickBreedTrade);
    }
    /* ENDREGION */
    }
    if(__buttons.indexOf("tattoo") > -1) {
    /* REGION "Tattoo-Slammer-Button hinzufügen" */
    if(DEBUG) {
      main.boxes.tattooslammer = main.tools.createElement(`div`, `button center noinv`, `🥚`);
      main.boxes.tattooslammer.setAttribute(`title`, `Packt ein Tattoo auf die Pets im aktuell aktiven Tab`);
      main.boxes.tattooslammer.style.width = `30px`;
      main.boxes.tattooslammer.style.margin = `0px`;
      main.boxes.tattooslammer.style.marginRight = `10px`;
      main.boxes.tattooslammer.style.display = `inline-block`;
      main.boxes.tattooslammer.addEventListener(`click`, async () => {
        if(main.boxes.tattooslammerBox != null) {
          main.boxes.tattooslammer.classList.remove(`disabled`);
          document.body.removeChild(main.boxes.tattooslammerBox);
          main.boxes.tattooslammer = null;
        } else if(!main.boxes.tattooslammer.classList.contains(`disabled`)) {
          let selectedPets = document.querySelectorAll('section#enclosures div.ui-tabs-panel section ul.ui-sortable li');
          if(selectedPets.length > 0) {
            main.boxes.tattooslammer.classList.add(`disabled`);

            main.boxes.tattooslammerBox = main.tools.createElement(`div`, `ovipets_dialogue visible`).to(document.body);
            main.boxes.tattooslammerBox.css({
              height: `350px`,
              minWidth: `500px`,
              backdropFilter: `blur(15px) brightness(0.15)`,
            })
            main.boxes.tattooslammerBoxcontent = main.tools.createElement(`div`, `catbox`).to(main.boxes.tattooslammerBox);
            main.boxes.tattooslammerBoxcontent.css({
              overflowY: `auto`,
            })

            main.boxes.tattooslammerBoxsave = main.tools.createElement(`div`, `button okaybutton`, `Tattoos anwenden`).to(main.boxes.tattooslammerBox);
            main.boxes.tattooslammerBoxsave.addEventListener(`click`, () => {

            }, true);

            main.boxes.tattooslammerBoxcontent_filefield = main.tools.createElement(`input`, ``).to(main.boxes.tattooslammerBoxcontent);
            main.boxes.tattooslammerBoxcontent_filefield.setAttribute(`type`, `file`);
            main.boxes.tattooslammerBoxcontent_filefield.addEventListener('change', function(event) {
              const file = event.target.files[0];
              if (file) {
                let n = file.name;
                let t = file.type;
                const reader = new FileReader();
                reader.addEventListener(`load`, async (fileLoadEvent) => {
                  const base64String = fileLoadEvent.target.result;
                  await Connection.POSTFile(
                    [base64String, n, t, [
                      {
                      name: "geneID",
                      value: "1"
                    },
                      {
                      name: "PetID",
                      value: `${pid}`
                    },
                      {
                      name: "cmd",
                      value: "tattoo_upl"
                    }
                    ]]
                  );
                }, true);
                reader.readAsDataURL(file);
              }
            }, true)

            main.boxes.tattooslammerBoxcancel = main.tools.createElement(`div`, `button cancelbutton`, `Abbrechen`).to(main.boxes.tattooslammerBox);
            main.boxes.tattooslammerBoxcancel.addEventListener(`click`, () => {
              main.boxes.tattooslammer.classList.remove(`disabled`);
              document.body.removeChild(main.boxes.tattooslammerBox);
              main.boxes.tattooslammer = null;
            }, true)

            main.boxes.tattooslammer.classList.remove(`disabled`);
          }
        }
      }, true);
      main.boxes.quickButtonList.in(main.boxes.tattooslammer);
    }
    /* ENDREGION */
    }
    if(__buttons.indexOf("blocklistc") > -1) {
    /* REGION "Blocklist Copy Button" */
    main.boxes.blocklistCopier = main.tools.createElement(`div`, `button center noinv`, `🛡`);
    main.boxes.blocklistCopier.setAttribute(`title`, `Blockliste kopieren/einfügen. (Wenn Blockliste leer ist, wird eine gemerkte Blockliste in diese kopiert)`);
    main.boxes.blocklistCopier.style.width = `30px`;
    main.boxes.blocklistCopier.style.margin = `0px`;
    main.boxes.blocklistCopier.style.marginRight = `10px`;
    main.boxes.blocklistCopier.style.display = `inline-block`;

    main.blocklistCopierLock = false;
    main.boxes.blocklistCopier.addEventListener(`click`, async () => {
      if(main.blocklistCopierLock === true) return;
      main.blocklistCopierLock = true;

      let url = `https://ovipets.com/?src=events&sub=feed&sec=friends&usr=${main.user.uid}&filter=blocked&Filter=blocked${main.config.crack}`;
      let result = await Connection.GET(url, true);
      let tx = result.responseText;
      tx = tx.substr(tx.indexOf(`(`) + 1)
      tx = tx.substr(0, tx.length - 1);
      tx = JSON.parse(tx).output;

      let rs = null;
      let rx = /href = "(.*?)" class = "user avatar.*?"><img src = "/gi;
      let ls = [];
      while(rs = rx.exec(tx)) {
        ls.push(rs[1]);
      }

      let temp_o = [];
      for(let i in ls) {
        let item = ls[i];
        let m = (/usr=(\d+)$/).exec(item);
        if(m == null) {
          let name = item.substr(item.lastIndexOf("/") + 1);
          let temp_u = `https://ovipets.com/?res=${name}&?${main.config.crack}`;
          let temp_src = await Connection.GET(temp_u);
          temp_src = temp_src.response;
          temp_src = temp_src.substr(temp_src.indexOf(`(`) + 1)
          temp_src = temp_src.substr(0, temp_src.length - 1);
          temp_src = JSON.parse(temp_src).output;
          let temp_rg = (/= '(\d+)/).exec(temp_src);
          m = temp_rg
        }
        temp_o.push(parseInt(m[1]));
      }
      ls = temp_o;
      main.blocklistCopierLock = false;

      let store = false;
      let tempLS = BetterBrain.savedBanList;
      if(tempLS == ``) tempLS = [];
      if(ls.length > 0) {
        if(tempLS.length > 0) {
          let t = `Möchtest du die aktuelle Liste speichern (OK) oder die gespeicherte Liste in die aktuelle Bannliste einpflegen (Abbrechen)?\n\nAktuell gespeicherte Liste:\n${tempLS.join(`, `)}\n\nVorhandene Liste:\n${ls.join(`, `)}`;
          store = confirm(t);
        } else {
          store = true;
        }
      }
      if(store) {
        BetterBrain.savedBanList = ls;
        let t = `Folgende Einträge aus deiner Bann-Liste wurden gespeichert:\n\n${ls.join(`, `)}\n\nDiese Liste bleibt gespeichert, bis du eine neue liste kopierst (z. b. aktualisierst).`;
        alert(t);
      } else {
        ls = BetterBrain.savedBanList;
        if(ls !== "") {
          let t = `Möchtest du diese Nutzer in die Bannliste einfügen?\n\n${ls.join(`, `)}`;
          if(confirm(t)) {
            let workEntries = [];
            for(let i = 0;i < ls.length;i++) {
              let work = new Work(
                {
                  banUser: async (uid) => {
                    let comm = {cmd: 'friend_block', UserID: uid};
                    let result = await Connection.POST(comm);
                    return result;
                  }
                },
                `banUser`,
                [ls[i]],
                `Setze Nutzer ${ls[i]} auf die Bannliste`
              );
              workEntries.push(work);
            }
            main.worker.addBunch(workEntries);
          }
        }
      }
    }, true);
    main.boxes.quickButtonList.in(main.boxes.blocklistCopier);
    /* ENDREGION */
    }
    if(__buttons.indexOf("blocklists") > -1) {
    /* REGION "Blocklist Switch Button" */
    main.boxes.blocklistSwitcher = main.tools.createElement(`div`, `button center noinv`, `🔄`);
    main.boxes.blocklistSwitcher.setAttribute(`title`, `Blockliste und Projekt-Blockliste austauschen`);
    main.boxes.blocklistSwitcher.style.width = `30px`;
    main.boxes.blocklistSwitcher.style.margin = `0px`;
    main.boxes.blocklistSwitcher.style.marginRight = `10px`;
    main.boxes.blocklistSwitcher.style.display = `inline-block`;
    main.boxes.blocklistSwitcher.addEventListener(`click`, async () => {
      let t = BetterBrain.savedProjectBanList;
      if(t == ``) t = [];
      let v = BetterBrain.savedBanList;
      if(v == ``) v = [];
      BetterBrain.savedProjectBanList = v;
      BetterBrain.savedBanList = t;
      alert(`Benutzer-Bannliste:\n\n${BetterBrain.savedBanList.join(`, `)}\n\nProjekt-Bannliste:\n\n${BetterBrain.savedProjectBanList.join(`, `)}`)
    }, true);
    main.boxes.quickButtonList.in(main.boxes.blocklistSwitcher);
    /* ENDREGION */
    }
    if(__buttons.indexOf("blocklistcp") > -1) {
    /* REGION "Blocklist Project Copy Button" */
    main.boxes.projectBlocklistCopier = main.tools.createElement(`div`, `button center noinv`, `⛓️`);
    main.boxes.projectBlocklistCopier.setAttribute(`title`, `Projekt-Blockliste kopieren/einfügen. (Wenn Blockliste leer ist, wird eine gemerkte Blockliste in diese kopiert)`);
    main.boxes.projectBlocklistCopier.style.width = `30px`;
    main.boxes.projectBlocklistCopier.style.margin = `0px`;
    main.boxes.projectBlocklistCopier.style.marginRight = `10px`;
    main.boxes.projectBlocklistCopier.style.display = `inline-block`;
    main.projectBlocklistCopierLock = false;
    main.boxes.projectBlocklistCopier.addEventListener(`click`, async () => {
      if(main.projectBlocklistCopierLock === true) return;
      main.projectBlocklistCopierLock = true;
      let projectID = -1;
      try {
        projectID = (/prj=(\d+)/gi).exec(document.querySelector(`.are > textarea:nth-child(1)`).onchange.toString())[1]-0;
      } catch (e) {
      }
      if(projectID == -1) {
        try {
          projectID = (/prj=(\d+)/gi).exec(document.querySelector(`fieldset.blocked + fieldset div div button`).onclick.toString())[1]-0;
        } catch (e) {
        }
      }
      if(projectID == -1) return;

      let url = `https://ovipets.com/?src=projects&sub=project&sec=blocked&prj=${projectID}${main.config.crack}`;
      let result = await Connection.GET(url, true);

      let tx = result.responseText;
      tx = tx.substr(tx.indexOf(`(`) + 1)
      tx = tx.substr(0, tx.length - 1);
      tx = JSON.parse(tx).output;

      let rs = null;
      let rx = /remove','ProjectID=\d+&amp;UserID=(\d+)/gi;
      let ls = [];
      while(rs = rx.exec(tx)) {
        ls.push(rs[1]);
      }
      main.projectBlocklistCopierLock = false;


      let store = false;
      let tempLS = BetterBrain.savedProjectBanList;
      if(tempLS == ``) tempLS = [];
      if(ls.length > 0) {
        if(tempLS.length > 0) {
          let t = `Möchtest du für dieses Projekt die aktuelle Liste speichern (OK) oder die gespeicherte Liste in die aktuelle Projekt-Bannliste einpflegen (Abbrechen)?\n\nAktuell gespeicherte Liste:\n${tempLS.join(`, `)}\n\nVorhandene Liste:\n${ls.join(`, `)}`;
          store = confirm(t);
        } else {
          store = true;
        }
      }
      if(store) {
        BetterBrain.savedProjectBanList = ls;
        alert(`Die Bann-Liste für dieses Projekt wurde gespeichert.`);
      } else {
        ls = BetterBrain.savedProjectBanList
        if(ls !== "") {
          let t = `Möchtest du diese Nutzer in die Projekt-Bannliste einfügen?\n\n${ls.join(`, `)}`;
          if(confirm(t)) {
            let workEntries = [];
            for(let i = 0;i < ls.length;i++) {
              let work = new Work(
                {
                  banProjectUser: async (pid, uid) => {
                    let comm = {cmd: 'project_block_add', ProjectID: pid, UserID: uid};
                    let result = await Connection.POST(comm);
                    return result;
                  }
                },
                `banProjectUser`,
                [projectID, ls[i]],
                `Setze Nutzer ${ls[i]} auf die Projekt-Bannliste`
              );
              workEntries.push(work);
            }
            main.worker.addBunch(workEntries);
          }
        }
      }
    }, true);
    main.boxes.quickButtonList.in(main.boxes.projectBlocklistCopier);
    /* ENDREGION */
    }
    if(__buttons.indexOf("boxstyle") > -1) {
    /* REGION "Box-Style Button" */
    main.boxes.boxStyler = main.tools.createElement(`div`, `button center noinv`, `🖌️`);
    main.boxes.boxStyler.css({
      width: `30px`,
      margin: `0px`,
      marginRight: `10px`,
      display: `inline-block`,
      float: `right`,
    })
    main.boxes.boxStyler.addEventListener(`click`, async () => {
      main.boxStyler.show();
    }, true);
    main.boxes.quickButtonList.in(main.boxes.boxStyler);
    /* ENDREGION */
    }
    if(__buttons.indexOf("autorunner") > -1) {
    /* REGION "Autorunner Hinzufügen" */
    [main.boxes.autorunnerToggle, main.boxes.autorunnerToggle_label] = main.tools.createToggle(`autorunner_toggle_minibutton`, `↺`, () => {}, (Brain.read(`__GLOBAL__.autoRunnerActive`, 0)==1)?true:false);
    main.boxes.autorunnerToggle_label.classList.add(`center`);
    main.boxes.autorunnerToggle_label.setAttribute(`title`, `Auto-Runner`);
    main.boxes.autorunnerToggle_label.style.width = `30px`;
    main.boxes.autorunnerToggle_label.style.margin = `0px`;
    main.boxes.autorunnerToggle_label.style.marginRight = `10px`;
    main.boxes.autorunnerToggle_label.style.float = `right`;
    main.boxes.autorunnerToggle_label.style.display = `inline-block`;
    main.boxes.quickButtonList.in(main.boxes.autorunnerToggle);
    main.boxes.quickButtonList.in(main.boxes.autorunnerToggle_label);
    main.boxes.autorunnerToggle.addEventListener(`change`, () => {
      try {
        Brain.write(`__GLOBAL__.autoRunnerActive`, main.boxes.autorunnerToggle.checked?1:0);
        if(main.boxes.autorunnerToggle.checked){
          logs(`[AutoRunner.Toggle] > `, `Auto-runner activated`);
          if(main.worker.works.length == 0 && main.eggwalker.state == 0) {
            logs(`[AutoRunner.Toggle] > `, `Auto-runner starts now`);
            main.eggwalker.toggleState();
          }
        }else{
          if(main.autorunner.restartTimer != null) {
            logs(`[AutoRunner.Toggle] > `, `Auto-runner canceled.`);
            clearTimeout(main.autorunner.restartTimer);
            main.autorunner.restartTimer = null;
          }
        }
      } catch {
        Brain.write(`__GLOBAL__.autoRunnerActive`, 0);
      }
    }, true);
    /* ENDREGION */
    }
    /* REGION "Aufbau des Bots und Einbindung auf Seite" */
    let n = 1;
    for(var i in main.order) {
      if(main.order[i].type == `text`) {
        main.boxes.root.in(main.tools.createElement(`div`, `center`, main.order[i].value));
      } else if(typeof main[main.order[i].value] != "undefined") {
        main[main.order[i].value].box.classList.add(`iter_${n}`)
        main.boxes.root.in(main[main.order[i].value].box);
      }
      n = (n==1)?2:1;
      try {
        if(!main.order[i].active || (!DEBUG && !main.order[i].release && main.order[i].type !== `text`)) main[main.order[i].value].box.classList.add(`hidden`);
      }catch{}
    }
    document.body.in(main.boxes.root);
    /* ENDREGION */

    /* REGION "Breed-hack und modifikations-hack" */
    class FindNonSiblings {
      constructor () {
        this.reset = this.__reset.bind(this);
        this.lock = this.__lock.bind(this);
        this.unlock = this.__unlock.bind(this);
        this.close = this.__close.bind(this);
        this.show = this.__show.bind(this);
        this.init = this.__init.bind(this);
        this.search = this.__search.bind(this);

        this.box = main.tools.createElement(`div`, `ovipets_dialogue hidden`);
        this.box.style.height = `500px`;
        this.box.style.minWidth = `800px`;

        this.content = main.tools.createElement(`div`, `catbox`).to(this.box);

        this.buttons = {};
        this.buttons.closeWindow = main.tools.createElement(`div`, `button okaybutton`, `Schließen`).to(this.box);
        this.buttons.closeWindow.addEventListener(`click`, this.close, true);

        document.body.in(this.box);

        this.selectionbox = null;
      }
      async __reset() {
        this.content.innerHTML = ``;
      }
      async __lock() {
        this.buttons.closeWindow.setAttribute(`disabled`, `disabled`);
        this.buttons.closeWindow.classList.add(`disabled`);
      }
      async __unlock() {
        this.buttons.closeWindow.removeAttribute(`disabled`);
        this.buttons.closeWindow.classList.remove(`disabled`);
      }
      async __close() {
        this.unlock();
        this.box.classList.remove(`visible`);
        this.box.classList.add(`hidden`);
      }
      async __show() {
        this.box.classList.remove(`hidden`);
        this.box.classList.add(`visible`);
      }
      async __init(petID, parents, sourceTab = []) {
        this.reset();
        this.show();
        this.selectionbox = await main.tools.createTabSelection(
          this.search,
          this.close,
          main.user.uid,
          false,
          sourceTab
        );
        this.content.in(this.selectionbox);
      }
      async __search(selection) {
        this.selectionbox.remove();
        this.selectionbox = null;

        let asyncTabLoader = new BunchLoader(
          selection,
          async function (item) {
            asyncTabLoader.outputPrint.in(main.tools.createElement(`div`, ``, `Tab #${item.id} wird geprüft ...`));
            let targetPets = await Enclosures.getPetsAll(item, main.user.uid, ``, true);
            asyncTabLoader.outputPrint.in(main.tools.createElement(`div`, ``, `${targetPets.length} Pets im Tab #${item.id} gefunden ...`));
            this.result = [...this.result, ...targetPets];
          },
          (r) => {
            this.logOutput.in(main.tools.createElement(`div`, ``, `Insgesamt ${r.length} Pets zur Prüfung gefunden ...`));
          }
        );
        this.logOutput = main.tools.createElement(`div`, ``, ``).to(this.content);
        asyncTabLoader.outputPrint = this.logOutput;
        asyncTabLoader.result = [];
        asyncTabLoader.collect();
      }
    }
    let fns = new FindNonSiblings();

    unsafeWindow.$(document).ajaxSuccess(
      (event, xhr, settings) => {
        if(typeof xhr.responseJSON.output !== "undefined") {
          if(xhr.responseJSON.output.indexOf(`' usr = '`) > -1) {
            try {
              main.currentOpenPageUser = parseInt(xhr.responseJSON.output.substr(xhr.responseJSON.output.indexOf(`' usr = '`) + 9));
            } catch {
              main.currentOpenPageUser = -1;
            }
          }
          let anc = document.querySelector(`fieldset.ancestors`);
          if(DEBUG && anc) {
            let btn = main.tools.createElement(`div`, `button center`, `Paare finden ...`);
            btn.css({fontWeight: `bold`});
            btn.addEventListener(`click`, () => {
              let pid_s = document.querySelector(`#pet div form a`).href;
              pid_s = pid_s.substr(pid_s.lastIndexOf(`=`)+1);
              let pid = parseInt(pid_s);

              let parents = [...document.querySelectorAll(`.ancestors img`)].map(n=>{
                let t = n.src.substr(n.src.indexOf(`pet=`)+4);
                t = t.substr(0, t.indexOf(`&`));
                return parseInt(t);
              });

              let sourceTab = [parseInt(document.querySelector(`.enclosure > div:nth-child(2) > div:nth-child(1) > select:nth-child(1)`).childNodes[document.querySelector(`.enclosure > div:nth-child(2) > div:nth-child(1) > select:nth-child(1)`).selectedIndex].value)];

              fns.init(pid, parents, sourceTab);
            }, true)
            let anc_parent = anc.parentNode;
            let anc_first = anc_parent.childNodes[0];
            anc.parentNode.insertBefore(btn, anc_first);
          }
          [...document.querySelectorAll(`fieldset.colors .ui-fieldset-body span`)].forEach((n)=>{
            n.style.cursor = `crosshair`;
            n.style.position = `relative`;
            n.parentNode.parentNode.style.borderRadius = `13px`;
            n.addEventListener(`click`, () => {
              let colorcode = n.childNodes[0].style.backgroundColor;
              colorcode = colorcode.substr(4, colorcode.length - 5);
              colorcode = colorcode.split(`,`).map(s=>parseInt(s));
              let c = new Clr(...colorcode);
              navigator.clipboard.writeText([c.r, c.g, c.b].join(`, `));
              n.style.transform = `scale(0.8)`;
              n.style.transition = `transform 0ms`;
              setTimeout(() => {
                n.style.transition = `transform 500ms`;
                n.style.transform = `scale(1)`;
              }, 150);
            }, true);
          })
        }
      }
    );
    unsafeWindow.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      let url = options.url;
      let method = options.method;
      if (options.data) {
        let newData = main.tools.modifyData(options.data); // Hier kannst du deine eigenen Änderungen an den Daten vornehmen
        options.data = newData;
      }
      let originalSuccess = options.success;
      options.success = function(data, textStatus, jqXHR) {
        let modifiedData = main.tools.modifyResponseData(data); // Hier kannst du deine eigenen Änderungen an den empfangenen Daten vornehmen
        if (originalSuccess) {
          originalSuccess(modifiedData, textStatus, jqXHR);
        }
      };
    });
    /* ENDREGION */
  } else {
    /* REGION "Offline State" */
    main.root_login_wrapper = main.tools.createElement(`div`);
    main.root_login_wrapper.css({
      position: `absolute`,
      top: `4em`,
      right: `0em`,
      overflowY: `scroll`,
      maxHeight: `CALC(100% - 12em)`,
      padding: `0.3em`,
      boxShadow: `0px 0px 13px black`,
      border: `5px solid #80b3d4`,
      borderRadius: `11px`,
      background: `rgba(230, 230, 255, 0.6)`,
      borderRight: `0px`,
      borderTopRightRadius: `0px`,
      borderBottomRightRadius: `0px`,
      zIndex: `10000`,
      cursor: `pointer`,
    })

    let login_wrapper = main.tools.createElement(`div`);
    login_wrapper.css({display:`none`});

    let login_text = main.tools.createElement(`div`, ``, `Logins`);
    login_text.css({
      display: `block`,
      fontSize: `1.5em`,
    })

    main.root_login_wrapper.in(login_wrapper);
    main.root_login_wrapper.in(login_text);
    main.root_login_wrapper.addEventListener(`click`, () => {
      if(login_wrapper.style.display == `none`) {
        login_wrapper.style.display = `block`;
        login_text.style.display = `none`;
        main.root_login_wrapper.style.cursor = `default`;
        main.root_login_wrapper.style.padding = `2.0em`;
      }
    }, true);

    let logins = Brain.read(`__GLOBAL__.generated_logins`, []);

    if(logins.length > 0) {
      let step = 0;
      let boxes = [];

      logins.map(loginentry => {
        loginentry.lastUsed = loginentry.lastUsed || 0;
      });

      logins.sort((a, b) => {
        if(a.lastUsed == 0 && b.lastUsed == 0) {
          return b.name < a.name;
        }
        return b.lastUsed - a.lastUsed;
      });

      for(let login in logins) {
        let loginStamp = logins[login].lastUsed;
        let dayOffset = Math.floor((loginStamp - new Date().setHours(0,0,0,0)) / 86400000);
        dayOffset = Math.max(0, Math.min(6, Math.abs(dayOffset)));
        let bgColor = main.config.defaults.loginDelayColors[dayOffset];
        let box = main.tools.createElement(`div`, ``, `${logins[login].name}`);
        boxes.push(box);
        box.addEventListener(`click`, () => {
          if(box.style.filter == ``) {
            for(let b in boxes) {
              if(boxes[b] !== box) {
                boxes[b].css({
                  filter: `saturate(0) contrast(0.5) brightness(1.5)`,
                  right: `-10px`,
                  boxShadow: `none`,
                });
              }
              boxes[b].style.cursor = `default`;
            }
            box.style.filter = `saturate(1.2) contrast(1.1) brightness(1.2)`;
            logins[login].lastUsed = (new Date()).getTime();
            Brain.write(`__GLOBAL__.generated_logins`, logins);
            main.tools.quickLogin(logins[login].username, logins[login].password);
          }
        });

        box.css({
          boxShadow: `0px 0px 13px black`,
          border: `5px solid #80b3d4`,
          borderRadius: `11px`,
          background: `${bgColor}`,
          color: `#643D13`,
          fontSize: `1.5em`,
          height: `2.1em`,
          boxSizing: `border-box`,
          cursor: `pointer`,
          minWidth: `15em`,
          textAlign: `center`,
          marginBottom: `0.5em`,
        })

        login_wrapper.in(box);

        step++;
      }

      document.body.in(main.root_login_wrapper);
    }
    /* ENDREGION */
  }
})();
