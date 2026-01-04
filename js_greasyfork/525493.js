// ==UserScript==
// @name         Junon official C.H tool 2
// @namespace    http://yourwebsite.com
// @version      1.0
// @description  A simple way to exploit vulnerabilities in the client of junon, designed for C.H. members.
// @match        https://junon.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525493/Junon%20official%20CH%20tool%202.user.js
// @updateURL https://update.greasyfork.org/scripts/525493/Junon%20official%20CH%20tool%202.meta.js
// ==/UserScript==

(function() {

    const entities=[{Core:{id:2,category:"Buildings"},MissileTurret:{id:6,category:"Buildings"},Wall:{id:9,category:"Buildings"},Lattice:{id:16,category:"Buildings"},SealedDoor:{id:17,category:"Buildings"},Airlock:{id:18,category:"Buildings"},SolarPanel:{id:19,category:"Buildings"},OxygenTank:{id:20,category:"Buildings"},Wire:{id:22,category:"Buildings"},Soil:{id:23,category:"Buildings"},WheatSeed:{id:24,category:"Buildings"},Fridge:{id:25,category:"Buildings"},WoodFloor:{id:26,category:"Buildings"},CarpetFloor:{id:27,category:"Buildings"},TiledFloor:{id:28,category:"Buildings"},Bed:{id:29,category:"Buildings"},WaterPump:{id:30,category:"Buildings"},Ventilator:{id:31,category:"Buildings"},Stove:{id:37,category:"Buildings"},SteelCrate:{id:38,category:"Buildings"},Terminal:{id:43,category:"Buildings"},Cage:{id:44,category:"Buildings"},Beaker:{id:46,category:"Buildings"},AmmoPrinter:{id:56,category:"Buildings"},MiniTurret:{id:57,category:"Buildings"},Table:{id:58,category:"Buildings"},Chair:{id:59,category:"Buildings"},SteelFloor:{id:60,category:"Buildings"},ResearchTable:{id:61,category:"Buildings"},FlameThrower:{id:62,category:"Buildings"},PurpleFloor:{id:63,category:"Buildings"},PlatedFloor:{id:64,category:"Buildings"},StripePlatedFloor:{id:65,category:"Buildings"},GreenFloor:{id:66,category:"Buildings"},Television:{id:67,category:"Buildings"},Pot:{id:68,category:"Buildings"},RedCarpet:{id:69,category:"Buildings"},AirAlarm:{id:71,category:"Buildings"},GasPipe:{id:72,category:"Buildings"},ManualAirlock:{id:73,category:"Buildings"},SmallOxygenTank:{id:74,category:"Buildings"},Lamp:{id:76,category:"Buildings"},Furnace:{id:78,category:"Buildings"},Refinery:{id:83,category:"Buildings"},LiquidPipe:{id:86,category:"Buildings"},LiquidTank:{id:87,category:"Buildings"},CottonSeed:{id:90,category:"Buildings"},SuitStation:{id:93,category:"Buildings"},Shower:{id:94,category:"Buildings"},OxygenGenerator:{id:95,category:"Buildings"},CryoTube:{id:97,category:"Buildings"},FiberSeed:{id:98,category:"Buildings"},EscapePod:{id:103,category:"Buildings"},Brewery:{id:113,category:"Buildings"},OilRefinery:{id:114,category:"Buildings"},FuelTank:{id:115,category:"Buildings"},PowerGenerator:{id:116,category:"Buildings"},FuelPipe:{id:117,category:"Buildings"},MiningDrill:{id:107,category:"Buildings"},ChemistryStation:{id:108,category:"Buildings"},PotatoSeed:{id:119,category:"Buildings"},SpikeTrap:{id:121,category:"Buildings"},TradingTable:{id:123,category:"Buildings"},Beacon:{id:124,category:"Buildings"},ButcherTable:{id:125,category:"Buildings"},RailTrack:{id:139,category:"Buildings"},RailTram:{id:140,category:"Buildings"},RailStop:{id:141,category:"Buildings"},Sign:{id:142,category:"Buildings"},WebTrap:{id:144,category:"Buildings"},LargeTable:{id:149,category:"Buildings"},FoodVendingMachine:{id:150,category:"Buildings"},DrinksVendingMachine:{id:151,category:"Buildings"},Atm:{id:152,category:"Buildings"},CoffeeSeed:{id:153,category:"Buildings"},YellowFloor:{id:156,category:"Buildings"},BronzeFloor:{id:157,category:"Buildings"},LightBlueFloor:{id:158,category:"Buildings"},BlueFloor:{id:159,category:"Buildings"},GrayFloor:{id:160,category:"Buildings"},GrassFloor:{id:161,category:"Buildings"},PinkFloor:{id:162,category:"Buildings"},BlueWall:{id:163,category:"Buildings"},GreenWall:{id:164,category:"Buildings"},IvoryWall:{id:165,category:"Buildings"},SunflowerSeed:{id:166,category:"Buildings"},BlueSeed:{id:168,category:"Buildings"},PoppySeed:{id:170,category:"Buildings"},FarmController:{id:172,category:"Buildings"},SlaversTable:{id:174,category:"Buildings"},FlamethrowerTurret:{id:176,category:"Buildings"},Fence:{id:178,category:"Buildings"},DeepDrill:{id:179,category:"Buildings"},Forge:{id:188,category:"Buildings"},Floor:{id:190,category:"Buildings"},WoodTable:{id:216,category:"Buildings"},WoodChair:{id:217,category:"Buildings"},EmergencyButton:{id:219,category:"Buildings"},SecurityCamera:{id:220,category:"Buildings"},SecurityMonitor:{id:221,category:"Buildings"},TimerBomb:{id:222,category:"Buildings"},PowerSwitch:{id:223,category:"Buildings"},UndergroundVent:{id:224,category:"Buildings"},WallLamp:{id:225,category:"Buildings"},RedPresent:{id:227,category:"Buildings"},BluePresent:{id:228,category:"Buildings"},GreenPresent:{id:229,category:"Buildings"},ChristmasTree:{id:230,category:"Buildings"},BomberTurret:{id:256,category:"Buildings"},SurvivalTool:{id:32,category:"Equipements"},Pistol:{id:34,category:"Equipements"},LeadPipe:{id:40,category:"Equipements"},SpaceSuit:{id:41,category:"Equipements"},FireExtinguisher:{id:42,category:"Equipements"},Syringe:{id:45,category:"Equipements"},Mop:{id:75,category:"Equipements"},Bottle:{id:77,category:"Equipements"},Shotgun:{id:92,category:"Equipements"},Lighter:{id:96,category:"Equipements"},StunBaton:{id:118,category:"Equipements"},Drill:{id:122,category:"Equipements"},Katana:{id:129,category:"Equipements"},MolotovCocktail:{id:133,category:"Equipements"},Grenade:{id:134,category:"Equipements"},PoisonGrenade:{id:135,category:"Equipements"},CombatArmor:{id:148,category:"Equipements"},WaterBottle:{id:173,category:"Equipements"},NameTag:{id:177,category:"Equipements"},BlueEnergySword:{id:185,category:"Equipements"},GreenEnergySword:{id:186,category:"Equipements"},RedEnergySword:{id:187,category:"Equipements"},Disinfectant:{id:189,category:"Equipements"},Wrench:{id:191,category:"Equipements"},Radio:{id:215,category:"Equipements"},AssassinsKnife:{id:218,category:"Equipements"},SantaHat:{id:226,category:"Equipements"},PocketTrader:{id:231,category:"Equipements"},HazmatSuit:{id:234,category:"Equipements"},PrisonerSuit:{id:236,category:"Equipements"},PoliceSuit:{id:237,category:"Equipements"},LabCoat:{id:238,category:"Equipements"},CultistSuit:{id:240,category:"Equipements"},PlasmaGun:{id:241,category:"Equipements"},SquidStaff:{id:244,category:"Equipements"},RocketLauncher:{id:248,category:"Equipements"},Scar17:{id:249,category:"Equipements"},Bowl:{id:250,category:"Equipements"},BloodBottle:{id:136,category:"Equipements"},IceOre:{id:33,category:"Ores"},CopperOre:{id:52,category:"Ores"},NitroPowder:{id:54,category:"Ores"},SteelOre:{id:70,category:"Ores"},Glass:{id:81,category:"Bars"},Sand:{id:82,category:"Ores"},Gold:{id:84,category:"Ores"},Wood:{id:89,category:"Ores"},Cloth:{id:91,category:"Ores"},PlantFiber:{id:99,category:"Ores"},Poison:{id:101,category:"Ores"},IronOre:{id:105,category:"Ores"},Web:{id:143,category:"Ores"},CoffeeBean:{id:154,category:"Ores"},Sunflower:{id:167,category:"Ores"},BlueLotus:{id:169,category:"Ores"},Poppy:{id:171,category:"Ores"},SulfurOre:{id:180,category:"Ores"},Explosives:{id:181,category:"Ores"},Meteorite:{id:184,category:"Ores"},SquidLordHeart:{id:243,category:"Ores"},CopperBar:{id:79,category:"Bars"},CircuitBoard:{id:88,category:"Bars"},IronBar:{id:106,category:"Bars"},AlienMeat:{id:35,category:"Foods"},Steak:{id:36,category:"Foods"},Wheat:{id:55,category:"Foods"},Antidote:{id:100,category:"Foods"},FirstAidKit:{id:104,category:"Foods"},Gel:{id:109,category:"Foods"},Gelatin:{id:110,category:"Foods"},Potato:{id:120,category:"Foods"},HumanMeat:{id:126,category:"Foods"},AnimalMeat:{id:127,category:"Foods"},HotDog:{id:128,category:"Foods"},VeganPizza:{id:130,category:"Foods"},SlimyMeatPizza:{id:131,category:"Foods"},LectersDinner:{id:132,category:"Foods"},Egg:{id:235,category:"Foods"},Omelette:{id:239,category:"Foods"},Fries:{id:247,category:"Foods"},PotatoSoup:{id:251,category:"Foods"},SlimeBroth:{id:252,category:"Foods"},MisoSoup:{id:253,category:"Foods"},BloodPack:{id:137,category:"Foods"},Stimpack:{id:138,category:"Foods"},Beer:{id:111,category:"Drinks"},Cola:{id:112,category:"Drinks"},Coffee:{id:155,category:"Drinks"},Vodka:{id:183,category:"Drinks"},EnergyDrink:{id:245,category:"Drinks"},AlienJuice:{id:246,category:"Drinks"},BulletAmmo:{id:39,category:"Ammos"},AssaultRifle:{id:145,category:"Ammos"},RifleAmmo:{id:146,category:"Ammos"},ShotgunShell:{id:147,category:"Ammos"},Missile:{id:182,category:"Ammos"},PlasmaCell:{id:242,category:"Ammos"},None:{id:0,category:"Useless"},Turret:{id:1,category:"Useless"},Cannon:{id:3,category:"Useless"},Reactor:{id:4,category:"Useless"},VoidRay:{id:5,category:"Useless"},ShieldGenerator:{id:7,category:"Useless"},MineralMiner:{id:8,category:"Useless"},IonCannon:{id:10,category:"Useless"},Fighter:{id:11,category:"Useless"},Thruster:{id:12,category:"Useless"},DockingBay:{id:13,category:"Useless"},Bridge:{id:14,category:"Useless"},MineralStorage:{id:15,category:"Useless"},Conveyor:{id:21,category:"Useless"},ShipyardConstructor:{id:47,category:"Useless"},HangarCornerBlock:{id:48,category:"Useless"},HangarController:{id:49,category:"Useless"},Hangar:{id:50,category:"Useless"},Dismantler:{id:51,category:"Useless"},BaseStarter:{id:102,category:"Useless"},Workshop:{id:85,category:"Useless"},NitroSeed:{id:53,category:"Useless"},Oil:{id:201,category:"Useless"},Rock:{id:202,category:"Useless"},LavaRock:{id:203,category:"Useless"},Lava:{id:204,category:"Useless"},Water:{id:205,category:"Useless"},Ice:{id:206,category:"Useless"},Asteroid:{id:207,category:"Useless"},IceAsteroid:{id:208,category:"Useless"},CopperAsteroid:{id:209,category:"Useless"},SteelAsteroid:{id:210,category:"Useless"},IronAsteroid:{id:211,category:"Useless"},Vine:{id:212,category:"Useless"},Sky:{id:213,category:"Useless"},MeteoriteAsteroid:{id:214,category:"Useless"},Carrot:{id:254,category:"Useless"},Landmine:{id:255,category:"Useless"},SteelBar:{id:80,category:"Useless"},Drone:{id:0,category:"Mobs"},Catapult:{id:1,category:"Mobs"},Reaver:{id:2,category:"Mobs"},Slime:{id:3,category:"Mobs"},Transporter:{id:4,category:"Mobs"},Spider:{id:5,category:"Mobs"},Human:{id:6,category:"Mobs"},Cat:{id:7,category:"Mobs"},Pirate:{id:8,category:"Mobs"},Mutant:{id:9,category:"Mobs"},Trader:{id:10,category:"Mobs"},Monkey:{id:11,category:"Mobs"},FirstBot:{id:12,category:"Mobs"},CleanBot:{id:13,category:"Mobs"},GuardBot:{id:14,category:"Mobs"},Ghost:{id:15,category:"Mobs"},PoisonSpider:{id:16,category:"Mobs"},BioRaptor:{id:17,category:"Mobs"},Brood:{id:18,category:"Mobs"},Guard:{id:19,category:"Mobs"},Trooper:{id:20,category:"Mobs"},Chicken:{id:21,category:"Mobs"},Chemist:{id:22,category:"Mobs"},Messenger:{id:23,category:"Mobs"},SlaveTrader:{id:25,category:"Mobs"},NuuSlave:{id:26,category:"Mobs"},PixiSlave:{id:27,category:"Mobs"},GaramSlave:{id:28,category:"Mobs"},DummyPlayer:{id:29,category:"Mobs"},Golem:{id:30,category:"Mobs"},Mantis:{id:31,category:"Mobs"},Prisoner:{id:32,category:"Mobs"},SquidLord:{id:33,category:"Mobs"},Firebat:{id:34,category:"Mobs"},Car:{id:35,category:"Mobs"}}];

    "use strict";

    document.getElementById("game_caption").innerHTML = "[hacked] junon.io"

    document.getElementById("game_caption").style.color = "#FF3631";

    setInterval(() => {

        try {

            player.game.creatorUid = player.uid

            // craft handlers

            if (game.blueprintMenu.el.children[3].children.length == 6) {

                let parent = game.blueprintMenu.el.children[3]

                let child = document.createElement("input")

                child.type = "text"

                child.value = game.blueprintMenu.craftType

                parent.appendChild(child)

                child.style.color = "#ffffff"

                child.style.backgroundColor = "#000000"

                child.style.width = "50px"

                child.id = "craftTypeInput"

                child.addEventListener("blur", (e) => {

                    if(isNaN(child.value)) {

                        game.blueprintMenu.craftType = entities[0][child.value].id

                    } else {

                        game.blueprintMenu.craftType = child.value;

                    }

                })

                // vending machine handlers

                let vendingChild = document.createElement("input")

                vendingChild.type = "text"

                vendingChild.style.color = "#ffffff"

                vendingChild.style.width = "70px";

                vendingChild.style.backgroundColor = "#000000"

                vendingChild.id = "vendingChild";

                game.vendingMachineMenu.el.children[3].appendChild(vendingChild)

                vendingChild.addEventListener("blur", () => {

                    let value = vendingChild.value

                    if(value != "") {

                        // try to search entities for a vending machine item

                        game.vendingMachineMenu.el.children[3].children[1].children[0].setAttribute("data-type", entities[0][vendingChild.value].id)

                        game.vendingMachineMenu.el.children[3].children[1].children[0].setAttribute("data-group", entities[0][vendingChild.value].category)

                    }

                })

                // slave trade menu handlers
            const slavesEl = game.slaveTradeMenu.el

            let slaveChild = document.createElement("input")

            slaveChild.type = "text"

            slaveChild.style.color = "#ffffff"

            slaveChild.style.width = "70px"

            slaveChild.style.backgroundColor = "#000000"

            slaveChild.id = "slaveChild"

            slaveChild.addEventListener("blur", () => {
                let value = slaveChild.value

                if(value != "") {
                    // value has been entered, element needs to be created.
                    let data = value.split(" ")
                    slavesEl.querySelector(".sell_trade_content").innerHTML = "<div class='trade_item_row' data-id='"+data[0]+"' data-group='Mobs' data-type='33' data-count='1' >" +
                    "<img class='trade_item_image' src='./assets/images/gild.png'>" +
                    "<div class='trade_item_name'>sus item</div>" +
                    "<div class='trade_item_count'>0</div>" +
                    "<div class='trade_item_cost'>? G</div>" +
                "</div>"


                }
            })


            document.getElementsByClassName("team_chat_tab")[0].style.display = "block"
                document.getElementById("slave_trade_menu").appendChild(slaveChild)



            }

            } catch (e) {}

    }, 1000)

    document.addEventListener("keypress", (e) => {

        if (document.getElementById("chat_input") != document.activeElement && document.getElementById("vendingChild") != document.activeElement && document.getElementById("craftTypeInput") != document.activeElement && document.getElementById("slaveChild") != document.activeElement) {

            if (e.key == "h") {

                if (game.vendingMachineMenu.el.style.display == "block") {

                    game.vendingMachineMenu.el.style.display = "none";

                } else {

                    game.vendingMachineMenu.el.style.display = "block"

                }

            } if (e.key == "t") {

                if(game.tradeMenu.el.style.display == "none") {

                    game.tradeMenu.open()

                } else {

                    game.tradeMenu.close()

                }

            } if (e.key == "n") {

                if(game.atmMenu.el.style.display == "none") {

                    game.atmMenu.open()

                } else {

                    game.atmMenu.close()

                }

            } if (e.key == "y") {

                game.showRegions(true)

            } if (e.key == "u") {

                game.showRegions(false)

            } if(e.key == "l") {
                if(game.slaveTradeMenu.el.style.display == "none") {
                    game.slaveTradeMenu.open()
                } else {
                    game.slaveTradeMenu.close()
                }
            }

        }

    })

})();

