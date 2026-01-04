// ==UserScript==
// @name         Rust Workshop Skin ID Collector wskin
// @namespace    https://greasyfork.org/en/scripts/404138-rust-workshop-skin-id-collector
// @icon         http://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/rust-icon.png
// @version      0.2.8
// @license      MIT
// @description  Get the Rust Skin ID for use in the skins uMod. To use, just visit the rust skin workshop page in yopur browser then press the NumLk plus key and the in game command to add the skin will magically be in the clipboard.
// @author       danerjones@gmail.com
// @copyright    2020, Dane Jones
// @supportURL   https://greasyfork.org/en/scripts/404138-rust-workshop-skin-id-collector/feedback
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=danerjones@gmail.com&item_name=Rust+Workshop+Skin+ID+Collector
// @contributionAmount $1
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/449181/Rust%20Workshop%20Skin%20ID%20Collector%20wskin.user.js
// @updateURL https://update.greasyfork.org/scripts/449181/Rust%20Workshop%20Skin%20ID%20Collector%20wskin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Short names table where the originating source fails to match.
    var custom_short_names = {
        'AK47': 'rifle.ak',
        'LR300': 'rifle.lr300',
        'Cap': 'hat.cap',
        'Mp5': 'smg.mp5',
        'Sword': 'longsword',
        'Python': 'pistol.python',
        'Work Boots': 'shoes.boots',
        'Pick Axe': 'pickaxe',
        'Bolt Rifle': 'rifle.bolt',
        'Roadsign Pants': 'roadsign.kilt',
        'Stone Pick Axe': 'stone.pickaxe',
        'Roadsign Pants': 'roadsign.kilt',
        'Roadsign Vest': 'roadsign.jacket'
    }

    // Get Settings
    var os_notifications_allowed = GM_getValue("enable_OS_notifications", false );

    // Add Ability to run from the Tampermonkey menu
    GM_registerMenuCommand ( 'Put Skin Command in Clipboard', parseSkinID, 'p' );

    // Add Snackbar style
    GM_addStyle(`
    /* The snackbar - position it at the bottom and in the middle of the screen */
    #snackbar {
      visibility: hidden; /* Hidden by default. Visible on click */
      min-width: 250px; /* Set a default minimum width */
      margin-left: -125px; /* Divide value of min-width by 2 */
      background-color: #333; /* Black background color */
      color: #fff; /* White text color */
      text-align: center; /* Centered text */
      border-radius: 2px; /* Rounded borders */
      padding: 16px; /* Padding */
      position: fixed; /* Sit on top of the screen */
      z-index: 1; /* Add a z-index if needed */
      left: 50%; /* Center the snackbar */
      bottom: 30px; /* 30px from the bottom */
    }

    /* Show the snackbar when clicking on a button (class added with JavaScript) */
    #snackbar.show {
      visibility: visible; /* Show the snackbar */
      /* Add animation: Take 0.5 seconds to fade in and out the snackbar. However, delay the fade out process for 2.5 seconds */
      -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
      animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }

    /* Animations to fade the snackbar in and out */
    @-webkit-keyframes fadein {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
    }

    @keyframes fadein {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
    }

    @-webkit-keyframes fadeout {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
    }

    @keyframes fadeout {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
    }
  `);

    // Add Snackbar popup to dom
    var elemDiv = document.createElement('div');
    elemDiv.id = 'snackbar';
    document.body.appendChild(elemDiv);

    // Add Keybinding to trigger on NumLk Plus key
    document.onkeyup = function (e) {
        e = e || window.event;
        var char_code = e.which || e.keyCode;
        if (char_code == 107) {
            parseSkinID();
        }
    } ;


    function parseSkinID() {
        // Determine Shortname of model from context of page.
        var short_name = getShortName();

        // Get model ID from page (Luckly the web devs added it as a variable for us to ge easily.)
        var model_ID = publishedfileid;

        // create command for the server console.
        var command = '/wskin ' + short_name + ' ' + model_ID;
        GM_setClipboard ( command );

        displayNotification();
    }

    function displayNotification() {
        var display_name = getDisplayName();

        // Display Snackbar Notification
        var snack_bar = document.getElementById("snackbar");
        snack_bar.innerHTML = display_name + ' COMANDO GENERADO CON EXITO!';
        snack_bar.className = "show";
        setTimeout(function(){ snack_bar.className = snack_bar.className.replace("show", ""); }, 5000);

        // Display OS level Notification
        if ( os_notifications_allowed ) {
            GM_notification ( {
                title: 'Rust Workshop Skin ID Collector',
                image: 'http://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/rust-icon.png',
                text:  display_name + ' skin import command added to clipboard.'}
                            );
        }
    }

    function getDisplayName() {
        return document.querySelector(".workshopItemTitle").innerText;
    }

    function getShortName() {
        var short_name = "";
        var long_name = "";
        var temp_name = "";
        var workshop_tags = document.querySelectorAll(".workshopTags > a");
        var name_lookup = {
            "12 Gauge Buckshot": "ammo.shotgun" ,
            "12 Gauge Incendiary Shell": "ammo.shotgun.fire" ,
            "12 Gauge Slug": "ammo.shotgun.slug" ,
            "16x Zoom Scope": "weapon.mod.8x.scope" ,
            "40mm HE Grenade": "ammo.grenadelauncher.he" ,
            "40mm Shotgun Round": "ammo.grenadelauncher.buckshot" ,
            "40mm Smoke Grenade": "ammo.grenadelauncher.smoke" ,
            "5.56 Rifle Ammo": "ammo.rifle" ,
            "8x Zoom Scope": "weapon.mod.small.scope" ,
            "A Barrel Costume": "barrelcostume" ,
            "Acoustic Guitar": "fun.guitar" ,
            "AND Switch": "electric.andswitch" ,
            "Animal Fat": "fat.animal" ,
            "Anti-Radiation Pills": "antiradpills" ,
            "Apple": "apple" ,
            "Armored Door": "door.hinged.toptier" ,
            "Armored Double Door": "door.double.hinged.toptier" ,
            "Assault Rifle": "rifle.ak" ,
            "Audio Alarm": "electric.audioalarm" ,
            "Auto Turret": "autoturret" ,
            "Bandage": "bandage" ,
            "Bandana Mask": "mask.bandana" ,
            "Barbed Wooden Barricade": "barricade.woodwire" ,
            "Barbeque": "bbq" ,
            "Baseball Cap": "hat.cap" ,
            "Basic Horse Shoes": "horse.shoes.basic" ,
            "Battery - Small": "battery.small" ,
            "Beancan Grenade": "grenade.beancan" ,
            "Bed": "bed" ,
            "Beenie Hat": "hat.beenie" ,
            "Binoculars": "tool.binoculars" ,
            "Birthday Cake": "cakefiveyear" ,
            "Black Raspberries": "black.raspberries" ,
            "Bleach": "bleach" ,
            "Blocker": "electric.blocker" ,
            "Blood": "blood" ,
            "Blue Boomer": "firework.boomer.blue" ,
            "Blue Keycard": "keycard_blue" ,
            "Blue Roman Candle": "firework.romancandle.blue" ,
            "Blueberries": "blueberries" ,
            "Blueprint": "blueprintbase" ,
            "Bolt Action Rifle": "rifle.bolt" ,
            "Bone Armor": "bone.armor.suit" ,
            "Bone Arrow": "arrow.bone" ,
            "Bone Club": "bone.club" ,
            "Bone Fragments": "bone.fragments" ,
            "Bone Helmet": "deer.skull.mask" ,
            "Bone Knife": "knife.bone" ,
            "Boonie Hat": "hat.boonie" ,
            "Boots": "shoes.boots" ,
            "Bota Bag": "botabag" ,
            "Bronze Egg": "easter.bronzeegg" ,
            "Bucket Helmet": "bucket.helmet" ,
            "Building Plan": "building.planner" ,
            "Bunny Ears": "attire.bunnyears" ,
            "Bunny Onesie": "attire.bunny.onesie" ,
            "Burlap Gloves": "burlap.gloves.new" ,
            "Burlap Headwrap": "burlap.headwrap" ,
            "Burlap Shirt": "burlap.shirt" ,
            "Burlap Shoes": "burlap.shoes" ,
            "Burlap Trousers": "burlap.trousers" ,
            "Burnt Bear Meat": "bearmeat.burned" ,
            "Burnt Chicken": "chicken.burned" ,
            "Burnt Deer Meat": "deermeat.burned" ,
            "Burnt Horse Meat": "horsemeat.burned" ,
            "Burnt Human Meat": "humanmeat.burned" ,
            "Burnt Pork": "meat.pork.burned" ,
            "Burnt Wolf Meat": "wolfmeat.burned" ,
            "Butcher Knife": "knife.butcher" ,
            "Cable Tunnel": "electric.cabletunnel" ,
            "Cactus Flesh": "cactusflesh" ,
            "Camera": "tool.camera" ,
            "Camp Fire": "campfire" ,
            "Can of Beans": "can.beans" ,
            "Can of Tuna": "can.tuna" ,
            "Canbourine": "fun.tambourine" ,
            "Candle Hat": "hat.candle" ,
            "Candy Cane": "candycane" ,
            "Candy Cane Club": "candycaneclub" ,
            "CCTV Camera": "cctv.camera" ,
            "Ceiling Light": "ceilinglight" ,
            "Chainlink Fence": "wall.frame.fence" ,
            "Chainlink Fence Gate": "wall.frame.fence.gate" ,
            "Chainsaw": "chainsaw" ,
            "Chair": "chair" ,
            "Champagne Boomer": "firework.boomer.champagne" ,
            "Charcoal": "charcoal" ,
            "Chinese Lantern": "chineselantern" ,
            "Chippy Arcade Game": "arcade.machine.chippy" ,
            "Chocolate Bar": "chocholate" ,
            "Christmas Door Wreath": "xmasdoorwreath" ,
            "Christmas Lights": "xmas.lightstring" ,
            "Christmas Tree": "xmas.tree" ,
            "Clatter Helmet": "clatter.helmet" ,
            "Cloth": "cloth" ,
            "Coal 🙁": "coal" ,
            "Code Lock": "lock.code" ,
            "Coffee Can Helmet": "coffeecan.helmet" ,
            "Coffin": "coffin.storage" ,
            "Combat Knife": "knife.combat" ,
            "Composter": "composter" ,
            "Compound Bow": "bow.compound" ,
            "Computer Station": "computerstation" ,
            "Concrete Barricade": "barricade.concrete" ,
            "Cooked Bear Meat": "bearmeat.cooked" ,
            "Cooked Chicken": "chicken.cooked" ,
            "Cooked Deer Meat": "deermeat.cooked" ,
            "Cooked Fish": "fish.cooked" ,
            "Cooked Horse Meat": "horsemeat.cooked" ,
            "Cooked Human Meat": "humanmeat.cooked" ,
            "Cooked Pork": "meat.pork.cooked" ,
            "Cooked Wolf Meat": "wolfmeat.cooked" ,
            "Corn": "corn" ,
            "Corn Clone": "clone.corn" ,
            "Corn Seed": "seed.corn" ,
            "Counter": "electric.counter" ,
            "Cowbell": "fun.cowbell" ,
            "Crate Costume": "cratecostume" ,
            "Crossbow": "crossbow" ,
            "Crude Oil": "crude.oil" ,
            "Cursed Cauldron": "cursedcauldron" ,
            "Custom SMG": "smg.2" ,
            "Decorative Baubels": "xmas.decoration.baubels" ,
            "Decorative Gingerbread Men": "xmas.decoration.gingerbreadmen" ,
            "Decorative Pinecones": "xmas.decoration.pinecone" ,
            "Decorative Plastic Candy Canes": "xmas.decoration.candycanes" ,
            "Decorative Tinsel": "xmas.decoration.tinsel" ,
            "Deluxe Christmas Lights": "xmas.lightstring.advanced" ,
            "Diesel Fuel": "diesel_barrel" ,
            "Diving Fins": "diving.fins" ,
            "Diving Mask": "diving.mask" ,
            "Diving Tank": "diving.tank" ,
            "Door Closer": "door.closer" ,
            "Door Controller": "electric.doorcontroller" ,
            "Door Key": "door.key" ,
            "Double Barrel Shotgun": "shotgun.double" ,
            "Double Sign Post": "sign.post.double" ,
            "Dragon Door Knocker": "dragondoorknocker" ,
            "Dragon Mask": "hat.dragonmask" ,
            "Drop Box": "dropbox" ,
            "Duct Tape": "ducttape" ,
            "Easter Door Wreath": "easterdoorwreath" ,
            "Egg Basket": "easterbasket" ,
            "Electric Fuse": "fuse" ,
            "Electric Heater": "electric.heater" ,
            "Electrical Branch": "electrical.branch" ,
            "Empty Can Of Beans": "can.beans.empty" ,
            "Empty Propane Tank": "propanetank" ,
            "Empty Tuna Can": "can.tuna.empty" ,
            "Eoka Pistol": "pistol.eoka" ,
            "Explosive 5.56 Rifle Ammo": "ammo.rifle.explosive" ,
            "Explosives": "explosives" ,
            "F1 Grenade": "grenade.f1" ,
            "Fertilizer": "fertilizer" ,
            "Festive Doorway Garland": "xmas.door.garland" ,
            "Festive Window Garland": "xmas.window.garland" ,
            "Fire Arrow": "arrow.fire" ,
            "Firecracker String": "lunar.firecrackers" ,
            "Flame Thrower": "flamethrower" ,
            "Flame Turret": "flameturret" ,
            "Flare": "flare" ,
            "Flasher Light": "electric.flasherlight" ,
            "Flashlight": "flashlight.held" ,
            "Floor grill": "floor.grill" ,
            "Fluid Combiner": "fluid.combiner" ,
            "Fluid Splitter": "fluid.splitter" ,
            "Fluid Switch & Pump": "fluid.switch" ,
            "Fogger-3000": "fogmachine" ,
            "Fridge": "fridge" ,
            "Frog Boots": "boots.frog" ,
            "Furnace": "furnace" ,
            "Garage Door": "wall.frame.garagedoor" ,
            "Garry's Mod Tool Gun": "toolgun" ,
            "Gears": "gears" ,
            "Geiger Counter": "geiger.counter" ,
            "Giant Candy Decor": "giantcandycanedecor" ,
            "Giant Lollipop Decor": "giantlollipops" ,
            "Glowing Eyes": "gloweyes" ,
            "Glue": "glue" ,
            "Gold Egg": "easter.goldegg" ,
            "Granola Bar": "granolabar" ,
            "Gravestone": "gravestone" ,
            "Graveyard Fence": "wall.graveyard.fence" ,
            "Green Boomer": "firework.boomer.green" ,
            "Green Keycard": "keycard_green" ,
            "Green Roman Candle": "firework.romancandle.green" ,
            "Gun Powder": "gunpowder" ,
            "Hab Repair": "habrepair" ,
            "Halloween Candy": "halloween.candy" ,
            "Hammer": "hammer" ,
            "Handmade Fishing Rod": "fishingrod.handmade" ,
            "Handmade Shell": "ammo.handmade.shell" ,
            "Hatchet": "hatchet" ,
            "Hazmat Suit": "hazmatsuit" ,
            "HBHF Sensor": "electric.hbhfsensor" ,
            "Heavy Plate Helmet": "heavy.plate.helmet" ,
            "Heavy Plate Jacket": "heavy.plate.jacket" ,
            "Heavy Plate Pants": "heavy.plate.pants" ,
            "Heavy Scientist Suit": "scientistsuit_heavy" ,
            "Hemp Clone": "clone.hemp" ,
            "Hemp Seed": "seed.hemp" ,
            "Hide Boots": "attire.hide.boots" ,
            "Hide Halterneck": "attire.hide.helterneck" ,
            "Hide Pants": "attire.hide.pants" ,
            "Hide Poncho": "attire.hide.poncho" ,
            "Hide Skirt": "attire.hide.skirt" ,
            "Hide Vest": "attire.hide.vest" ,
            "High External Stone Gate": "gates.external.high.stone" ,
            "High External Stone Wall": "wall.external.high.stone" ,
            "High External Wooden Gate": "gates.external.high.wood" ,
            "High External Wooden Wall": "wall.external.high" ,
            "High Quality Horse Shoes": "horse.shoes.advanced" ,
            "High Quality Metal": "metal.refined" ,
            "High Quality Metal Ore": "hq.metal.ore" ,
            "High Velocity Arrow": "arrow.hv" ,
            "High Velocity Rocket": "ammo.rocket.hv" ,
            "Hitch & Trough": "hitchtroughcombo" ,
            "Holosight": "weapon.mod.holosight" ,
            "Hoodie": "hoodie" ,
            "Horse Dung": "horsedung" ,
            "Hose Tool": "hosetool" ,
            "Huge Wooden Sign": "sign.wooden.huge" ,
            "Human Skull": "skull.human" ,
            "Hunting Bow": "bow.hunting" ,
            "HV 5.56 Rifle Ammo": "ammo.rifle.hv" ,
            "HV Pistol Ammo": "ammo.pistol.hv" ,
            "Igniter": "electric.igniter" ,
            "Improvised Balaclava": "mask.balaclava" ,
            "Incendiary 5.56 Rifle Ammo": "ammo.rifle.incendiary" ,
            "Incendiary Pistol Bullet": "ammo.pistol.fire" ,
            "Incendiary Rocket": "ammo.rocket.fire" ,
            "Jack O Lantern Angry": "jackolantern.angry" ,
            "Jack O Lantern Happy": "jackolantern.happy" ,
            "Jacket": "jacket" ,
            "Jackhammer": "jackhammer" ,
            "Jerry Can Guitar": "fun.jerrycanguitar" ,
            "Junkyard Drum Kit": "drumkit" ,
            "Key Lock": "lock.key" ,
            "L96 Rifle": "rifle.l96" ,
            "Ladder Hatch": "floor.ladder.hatch" ,
            "Land Mine": "trap.landmine" ,
            "Landscape Picture Frame": "sign.pictureframe.landscape" ,
            "Lantern": "lantern" ,
            "Large Banner Hanging": "sign.hanging.banner.large" ,
            "Large Banner on pole": "sign.pole.banner.large" ,
            "Large Candle Set": "largecandles" ,
            "Large Furnace": "furnace.large" ,
            "Large Loot Bag": "halloween.lootbag.large" ,
            "Large Medkit": "largemedkit" ,
            "Large Planter Box": "planter.large" ,
            "Large Present": "xmas.present.large" ,
            "Large Rechargable Battery": "electric.battery.rechargable.large" ,
            "Large Solar Panel": "electric.solarpanel.large" ,
            "Large Water Catcher": "water.catcher.large" ,
            "Large Wood Box": "box.wooden.large" ,
            "Large Wooden Sign": "sign.wooden.large" ,
            "Laser Detector": "electric.laserdetector" ,
            "Leather": "leather" ,
            "Leather Gloves": "burlap.gloves" ,
            "Locker": "locker" ,
            "Longsleeve T-Shirt": "tshirt.long" ,
            "Longsword": "longsword" ,
            "Low Grade Fuel": "lowgradefuel" ,
            "LR-300 Assault Rifle": "rifle.lr300" ,
            "M249": "lmg.m249" ,
            "M39 Rifle": "rifle.m39" ,
            "M92 Pistol": "pistol.m92" ,
            "Mace": "mace" ,
            "Machete": "machete" ,
            "Mail Box": "mailbox" ,
            "MC repair": "minihelicopter.repair" ,
            "Medical Syringe": "syringe.medical" ,
            "Medium Loot Bag": "halloween.lootbag.medium" ,
            "Medium Present": "xmas.present.medium" ,
            "Medium Rechargable Battery": "electric.battery.rechargable.medium" ,
            "Medium Wooden Sign": "sign.wooden.medium" ,
            "Memory Cell": "electrical.memorycell" ,
            "Metal Barricade": "barricade.metal" ,
            "Metal Blade": "metalblade" ,
            "Metal Chest Plate": "metal.plate.torso" ,
            "Metal Facemask": "metal.facemask" ,
            "Metal Fragments": "metal.fragments" ,
            "Metal horizontal embrasure": "shutter.metal.embrasure.a" ,
            "Metal Ore": "metal.ore" ,
            "Metal Pipe": "metalpipe" ,
            "Metal Shop Front": "wall.frame.shopfront.metal" ,
            "Metal Spring": "metalspring" ,
            "Metal Vertical embrasure": "shutter.metal.embrasure.b" ,
            "Metal Window Bars": "wall.window.bars.metal" ,
            "Miners Hat": "hat.miner" ,
            "Mining Quarry": "mining.quarry" ,
            "Minnows": "fish.minnows" ,
            "MP5A4": "smg.mp5" ,
            "Multiple Grenade Launcher": "multiplegrenadelauncher" ,
            "Mummy Suit": "halloween.mummysuit" ,
            "Mushroom": "mushroom" ,
            "Muzzle Boost": "weapon.mod.muzzleboost" ,
            "Muzzle Brake": "weapon.mod.muzzlebrake" ,
            "Nailgun": "pistol.nailgun" ,
            "Nailgun Nails": "ammo.nailgun.nails" ,
            "Nest Hat": "attire.nesthat" ,
            "Netting": "wall.frame.netting" ,
            "New Year Gong": "newyeargong" ,
            "Night Vision Goggles": "nightvisiongoggles" ,
            "Note": "note" ,
            "One Sided Town Sign Post": "sign.post.town" ,
            "OR Switch": "electric.orswitch" ,
            "Orange Boomer": "firework.boomer.orange" ,
            "Painted Egg": "easter.paintedeggs" ,
            "Pan Flute": "fun.flute" ,
            "Pants": "pants" ,
            "Paper": "paper" ,
            "Paper Map": "map" ,
            "Party Hat": "partyhat" ,
            "Pickaxe": "pickaxe" ,
            "Pickles": "jar.pickle" ,
            "Pistol Bullet": "ammo.pistol" ,
            "Pitchfork": "pitchfork" ,
            "Plant Fiber": "plantfiber" ,
            "Plumber's Trumpet": "fun.trumpet" ,
            "Pookie Bear": "pookie.bear" ,
            "Portrait Picture Frame": "sign.pictureframe.portrait" ,
            "Potato": "potato" ,
            "Potato Clone": "clone.potato" ,
            "Potato Seed": "seed.potato" ,
            "Powered Water Purifier": "powered.water.purifier" ,
            "Pressure Pad": "electric.pressurepad" ,
            "Prison Cell Gate": "wall.frame.cell.gate" ,
            "Prison Cell Wall": "wall.frame.cell" ,
            "Pump Jack": "mining.pumpjack" ,
            "Pump Shotgun": "shotgun.pump" ,
            "Pumpkin": "pumpkin" ,
            "Pumpkin Bucket": "pumpkinbasket" ,
            "Pumpkin Plant Clone": "clone.pumpkin" ,
            "Pumpkin Seed": "seed.pumpkin" ,
            "Python Revolver": "pistol.python" ,
            "RAND Switch": "electric.random.switch" ,
            "Rat Mask": "hat.ratmask" ,
            "Raw Bear Meat": "bearmeat" ,
            "Raw Chicken Breast": "chicken.raw" ,
            "Raw Deer Meat": "deermeat.raw" ,
            "Raw Fish": "fish.raw" ,
            "Raw Horse Meat": "horsemeat.raw" ,
            "Raw Human Meat": "humanmeat.raw" ,
            "Raw Pork": "meat.boar" ,
            "Raw Wolf Meat": "wolfmeat.raw" ,
            "Reactive Target": "target.reactive" ,
            "Red Boomer": "firework.boomer.red" ,
            "Red Keycard": "keycard_red" ,
            "Red Roman Candle": "firework.romancandle.red" ,
            "Red Volcano Firework": "firework.volcano.red" ,
            "Reindeer Antlers": "attire.reindeer.headband" ,
            "Reinforced Glass Window": "wall.window.glass.reinforced" ,
            "Reinforced Window Bars": "wall.window.bars.toptier" ,
            "Repair Bench": "box.repair.bench" ,
            "Research Paper": "researchpaper" ,
            "Research Table": "research.table" ,
            "Revolver": "pistol.revolver" ,
            "RF Broadcaster": "electric.rf.broadcaster" ,
            "RF Pager": "rf_pager" ,
            "RF Receiver": "electric.rf.receiver" ,
            "RF Transmitter": "rf.detonator" ,
            "Rifle Body": "riflebody" ,
            "Riot Helmet": "riot.helmet" ,
            "Road Sign Jacket": "roadsign.jacket" ,
            "Road Sign Kilt": "roadsign.kilt" ,
            "Road Signs": "roadsigns" ,
            "Roadsign Gloves": "roadsign.gloves" ,
            "Roadsign Horse Armor": "horse.armor.roadsign" ,
            "Rock": "rock" ,
            "Rocket": "ammo.rocket.basic" ,
            "Rocket Launcher": "rocket.launcher" ,
            "Root Combiner": "electrical.combiner" ,
            "Rope": "rope" ,
            "Rotten Apple": "apple.spoiled" ,
            "Rug": "rug" ,
            "Rug Bear Skin": "rug.bear" ,
            "Rustigé Egg - Blue": "rustige_egg_b" ,
            "Rustigé Egg - Ivory": "rustige_egg_d" ,
            "Rustigé Egg - Purple": "rustige_egg_c" ,
            "Rustigé Egg - Red": "rustige_egg_a" ,
            "Saddle bag": "horse.saddlebag" ,
            "Salt Water": "water.salt" ,
            "Salvaged Axe": "axe.salvaged" ,
            "Salvaged Cleaver": "salvaged.cleaver" ,
            "Salvaged Hammer": "hammer.salvaged" ,
            "Salvaged Icepick": "icepick.salvaged" ,
            "Salvaged Shelves": "shelves" ,
            "Salvaged Sword": "salvaged.sword" ,
            "SAM Ammo": "ammo.rocket.sam" ,
            "SAM Site": "samsite" ,
            "Sandbag Barricade": "barricade.sandbags" ,
            "Santa Beard": "santabeard" ,
            "Santa Hat": "santahat" ,
            "Satchel Charge": "explosive.satchel" ,
            "Scarecrow": "scarecrow" ,
            "Scarecrow Suit": "scarecrow.suit" ,
            "Scarecrow Wrap": "scarecrowhead" ,
            "Scientist Suit": "hazmatsuit_scientist" ,
            "Scientist Suit": "hazmatsuit_scientist_peacekeeper" ,
            "Scrap": "scrap" ,
            "ScrapTransportHeliRepair": "scraptransportheli.repair" ,
            "Search Light": "searchlight" ,
            "Semi Automatic Body": "semibody" ,
            "Semi-Automatic Pistol": "pistol.semiauto" ,
            "Semi-Automatic Rifle": "rifle.semiauto" ,
            "Sewing Kit": "sewingkit" ,
            "Sheet Metal": "sheetmetal" ,
            "Sheet Metal Door": "door.hinged.metal" ,
            "Sheet Metal Double Door": "door.double.hinged.metal" ,
            "Shirt": "shirt.collared" ,
            "Shop Front": "wall.frame.shopfront" ,
            "Shorts": "pants.shorts" ,
            "Shotgun Trap": "guntrap" ,
            "Shovel Bass": "fun.bass" ,
            "Sickle": "sickle" ,
            "Silencer": "weapon.mod.silencer" ,
            "Silver Egg": "easter.silveregg" ,
            "Simple Handmade Sight": "weapon.mod.simplesight" ,
            "Simple Light": "electric.simplelight" ,
            "Single Sign Post": "sign.post.single" ,
            "Siren Light": "electric.sirenlight" ,
            "Skull Door Knocker": "skulldoorknocker" ,
            "Skull Fire Pit": "skull_fire_pit" ,
            "Sleeping Bag": "sleepingbag" ,
            "Small Candle Set": "smallcandles" ,
            "Small Generator": "electric.fuelgenerator.small" ,
            "Small Loot Bag": "halloween.lootbag.small" ,
            "Small Oil Refinery": "small.oil.refinery" ,
            "Small Planter Box": "planter.small" ,
            "Small Present": "xmas.present.small" ,
            "Small Rechargable Battery": "electric.battery.rechargable.small" ,
            "Small Stash": "stash.small" ,
            "Small Stocking": "stocking.small" ,
            "Small Trout": "fish.troutsmall" ,
            "Small Water Bottle": "smallwaterbottle" ,
            "Small Water Catcher": "water.catcher.small" ,
            "Small Wooden Sign": "sign.wooden.small" ,
            "Smart Alarm": "smart.alarm" ,
            "Smart Switch": "smart.switch" ,
            "SMG Body": "smgbody" ,
            "Smoke Grenade": "grenade.smoke" ,
            "Smoke Rocket WIP!!!!": "ammo.rocket.smoke" ,
            "Snap Trap": "trap.bear" ,
            "Snow Jacket": "jacket.snow" ,
            "Snow Machine": "snowmachine" ,
            "Snowball": "snowball" ,
            "Snowman": "snowman" ,
            "Sousaphone": "fun.tuba" ,
            "Spas-12 Shotgun": "shotgun.spas12" ,
            "Spider Webs": "spiderweb" ,
            "Spinning wheel": "spinner.wheel" ,
            "Splitter": "electric.splitter" ,
            "Spoiled Chicken": "chicken.spoiled" ,
            "Spoiled Human Meat": "humanmeat.spoiled" ,
            "Spoiled Wolf Meat": "wolfmeat.spoiled" ,
            "Spooky Speaker": "spookyspeaker" ,
            "Sprinkler": "electric.sprinkler" ,
            "Star Tree Topper": "xmas.decoration.star" ,
            "Sticks": "sticks" ,
            "Stone Barricade": "barricade.stone" ,
            "Stone Fireplace": "fireplace.stone" ,
            "Stone Hatchet": "stonehatchet" ,
            "Stone Pickaxe": "stone.pickaxe" ,
            "Stone Spear": "spear.stone" ,
            "Stones": "stones" ,
            "Strobe Light": "strobelight" ,
            "Sulfur": "sulfur" ,
            "Sulfur Ore": "sulfur.ore" ,
            "SUPER Stocking": "stocking.large" ,
            "Supply Signal": "supply.signal" ,
            "Surgeon Scrubs": "halloween.surgeonsuit" ,
            "Survey Charge": "surveycharge" ,
            "Survival Fish Trap": "fishtrap.small" ,
            "Switch": "electric.switch" ,
            "T-Shirt": "tshirt" ,
            "Table": "table" ,
            "Tactical Gloves": "tactical.gloves" ,
            "Tall Picture Frame": "sign.pictureframe.tall" ,
            "Tank Top": "shirt.tanktop" ,
            "Targeting Computer": "targeting.computer" ,
            "Tarp": "tarp" ,
            "Tech Trash": "techparts" ,
            "Tesla Coil": "electric.teslacoil" ,
            "Test Generator": "electric.generator.small" ,
            "Thompson": "smg.thompson" ,
            "Timed Explosive Charge": "explosive.timed" ,
            "Timer": "electric.timer" ,
            "Tool Cupboard": "cupboard.tool" ,
            "Torch": "torch" ,
            "Tree Lights": "xmas.decoration.lights" ,
            "Tuna Can Lamp": "tunalight" ,
            "Two Sided Hanging Sign": "sign.hanging" ,
            "Two Sided Ornate Hanging Sign": "sign.hanging.ornate" ,
            "Two Sided Town Sign Post": "sign.post.town.roof" ,
            "Vending Machine": "vending.machine" ,
            "Violet Boomer": "firework.boomer.violet" ,
            "Violet Roman Candle": "firework.romancandle.violet" ,
            "Violet Volcano Firework": "firework.volcano.violet" ,
            "Watch Tower": "watchtower.wood" ,
            "Water": "water" ,
            "Water Barrel": "water.barrel" ,
            "Water Bucket": "bucket.water" ,
            "Water Jug": "waterjug" ,
            "Water Pump": "waterpump" ,
            "Water Purifier": "water.purifier" ,
            "Waterpipe Shotgun": "shotgun.waterpipe" ,
            "Weapon flashlight": "weapon.mod.flashlight" ,
            "Weapon Lasersight": "weapon.mod.lasersight" ,
            "Wetsuit": "diving.wetsuit" ,
            "Wheelbarrow Piano": "piano" ,
            "White Volcano Firework": "firework.volcano" ,
            "Wind Turbine": "generator.wind.scrap" ,
            "Wire Tool": "wiretool" ,
            "Wolf Headdress": "hat.wolf" ,
            "Wolf Skull": "skull.wolf" ,
            "Wood": "wood" ,
            "Wood Armor Helmet": "wood.armor.helmet" ,
            "Wood Armor Pants": "wood.armor.pants" ,
            "Wood Chestplate": "wood.armor.jacket" ,
            "Wood Double Door": "door.double.hinged.wood" ,
            "Wood Shutters": "shutter.wood.a" ,
            "Wood Storage Box": "box.wooden" ,
            "Wooden Arrow": "arrow.wooden" ,
            "Wooden Barricade": "barricade.wood" ,
            "Wooden Cross": "woodcross" ,
            "Wooden Door": "door.hinged.wood" ,
            "Wooden Floor Spikes": "spikes.floor" ,
            "Wooden Horse Armor": "horse.armor.wood" ,
            "Wooden Ladder": "ladder.wooden.wall" ,
            "Wooden Spear": "spear.wooden" ,
            "Wooden Window Bars": "wall.window.bars.wood" ,
            "Work Bench Level 1": "workbench1" ,
            "Work Bench Level 2": "workbench2" ,
            "Work Bench Level 3": "workbench3" ,
            "Wrapped Gift": "wrappedgift" ,
            "Wrapping Paper": "wrappingpaper" ,
            "XL Picture Frame": "sign.pictureframe.xl" ,
            "XOR Switch": "electric.xorswitch" ,
            "XXL Picture Frame": "sign.pictureframe.xxl" ,
            "Xylobone": "xylophone"
        };
        var short_names = Object.values(name_lookup);

        workshop_tags.forEach(element => {
            long_name = element.text;
            temp_name = long_name.toLowerCase().replace(/ /g,'.');

            // console.log("long_name = " + long_name);
            // console.log("temp_name = " + temp_name);

            if (long_name in name_lookup) {
                short_name = name_lookup[long_name];
            } else if (short_names.includes(temp_name)) {
                short_name = temp_name;
            } else if (long_name in custom_short_names) {
                short_name = custom_short_names[long_name];
            }

        });

        if (short_name == "") {
            throw 'Unable to lookup model Short Name from page tags.\nSRC: ' + window.location.href;
        }

        return short_name;
    }
})();
