// ==UserScript==
// @name        FRPG - Quick Mail
// @namespace    duck.wowow
// @version      0.1
// @description  Adds a UI to the sidebar that creates quick mail buttons with a set quantity of a chosen item to a chosen NPC
// @author       Odung
// @match        https://farmrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527871/FRPG%20-%20Quick%20Mail.user.js
// @updateURL https://update.greasyfork.org/scripts/527871/FRPG%20-%20Quick%20Mail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NPCnames = {
        "267531": "Baba Gec",
        "22440": "Beatrix",
        "53900": "Borgen",
        "22447": "Buddy",
        "22442": "Cecil",
        "71760": "Charles",
        "16": "Cid",
        "71805": "Cpt Thomas",
        "84518": "frank",
        "38": "Gary Bearson V",
        "118065": "Geist",
        "22443": "George",
        "22439": "Holger",
        "22444": "Jill",
        "22446": "Lorn",
        "178572": "Mariya",
        "70604": "Mummy",
        "59421": "Ric Ryph",
        "71761": "ROOMBA",
        "22438": "Rosalie",
        "46158": "Star Meerif",
        "22441": "Thomas",
        "22445": "Vincent",
    };

    const NPCS = [
        ["267531", "Baba Gec"],
        ["22440", "Beatrix"],
        ["53900", "Borgen"],
        ["22447", "Buddy"],
        ["22442", "Cecil"],
        ["71760", "Charles"],
        ["16", "Cid"],
        ["71805", "Cpt Thomas"],
        ["84518", "frank"],
        ["38", "Gary Bearson V"],
        ["118065", "Geist"],
        ["22443", "George"],
        ["22439", "Holger"],
        ["22444", "Jill"],
        ["22446", "Lorn"],
        ["178572", "Mariya"],
        ["70604", "Mummy"],
        ["59421", "Ric Ryph"],
        ["71761", "ROOMBA"],
        ["22438", "Rosalie"],
        ["46158", "Star Meerif"],
        ["22441", "Thomas"],
        ["22445", "Vincent"],
    ];

    const ITEMS = {
        "10 Gold": {
            "511": "/img/items/10gold.png"
        },
        "100 Gold": {
            "454": "/img/items/goldpouch2.png"
        },
        "25 Gold": {
            "510": "/img/items/25gold.png"
        },
        "3-leaf Clover": {
            "187": "/img/items/8250.png"
        },
        "4-leaf Clover": {
            "188": "/img/items/fourleaf.png"
        },
        "5 Gold": {
            "512": "/img/items/5gold.png"
        },
        "50 Gold": {
            "509": "/img/items/goldpouch1.png"
        },
        "Acorn": {
            "91": "/img/items/5759.PNG"
        },
        "Amber": {
            "244": "/img/items/6675.png"
        },
        "Amethyst": {
            "54": "/img/items/amethyst.png"
        },
        "Amethyst Necklace": {
            "126": "/img/items/8016.png"
        },
        "Ancient Coin": {
            "123": "/img/items/6019.PNG"
        },
        "Anglerfish": {
            "569": "/img/items/pirates_76_t.png"
        },
        "Antler": {
            "170": "/img/items/5922.png"
        },
        "Apple": {
            "44": "/img/items/8297.png"
        },
        "Apple Cider": {
            "379": "/img/items/8984.png"
        },
        "Aquamarine": {
            "41": "/img/items/6146.PNG"
        },
        "Aquamarine Ring": {
            "125": "/img/items/aquaring.png"
        },
        "Arnold Palmer": {
            "508": "/img/items/ap.png"
        },
        "Arrowhead": {
            "108": "/img/items/5910.png"
        },
        "Ashes of Pentagorn": {
            "625": "/img/items/5848.png"
        },
        "Axe": {
            "237": "/img/items/5875.png?1"
        },
        "Backpack": {
            "610": "/img/items/BagsAndBoxes_64_t.png"
        },
        "Backstabbing Dagger": {
            "381": "/img/items/9078.png"
        },
        "Bacon": {
            "242": "/img/items/bacon.png"
        },
        "Bag of Presents 01": {
            "422": "/img/items/12_sm.png"
        },
        "Bag of Presents 02": {
            "698": "/img/items/12_sm.png"
        },
        "Bahltruvian Scales": {
            "514": "/img/items/2392.png"
        },
        "Bananas": {
            "714": "/img/items/8285.png"
        },
        "Barracuda": {
            "307": "/img/items/7486.png"
        },
        "Bat Wing": {
            "667": "/img/items/5990.png"
        },
        "Beet": {
            "450": "/img/items/2850.png"
        },
        "Beet Seeds": {
            "449": "/img/items/seeds_beet.png"
        },
        "Bell": {
            "471": "/img/items/bell.png"
        },
        "Belt Drive": {
            "677": "/img/items/9347.png"
        },
        "Bird Egg": {
            "111": "/img/items/6067.PNG"
        },
        "Birthday Present": {
            "547": "/img/items/present03.png"
        },
        "Black Powder": {
            "104": "/img/items/powder.png"
        },
        "Blitzen": {
            "447": "/img/items/blitzen.png"
        },
        "Blue Crab": {
            "57": "/img/items/7825.PNG"
        },
        "Blue Catfish": {
            "89": "/img/items/7842.PNG"
        },
        "Blue Dye": {
            "535": "/img/items/bluedye.png"
        },
        "Blue Feathers": {
            "171": "/img/items/5963.png"
        },
        "Blue Gel": {
            "314": "/img/items/ForestIcons_34_t.png"
        },
        "Blue Milk": {
            "546": "/img/items/bluemilk.png?2"
        },
        "Blue Ornament": {
            "406": "/img/items/cr_t_03_f.png"
        },
        "Blue Purse": {
            "540": "/img/items/bluepurse.png"
        },
        "Blue Sea Bass": {
            "133": "/img/items/7818.png"
        },
        "Blue Shell": {
            "90": "/img/items/7875.PNG"
        },
        "Blue Spritz": {
            "568": "/img/items/bluedrink.png"
        },
        "Blue Tiger Fish": {
            "200": "/img/items/5772.png"
        },
        "Bluegill": {
            "131": "/img/items/7722.PNG"
        },
        "Board": {
            "21": "/img/items/5885.png"
        },
        "Bone": {
            "113": "/img/items/6033.PNG"
        },
        "Bone Broth": {
            "641": "/img/items/bonebroth.png"
        },
        "Bone Fish": {
            "87": "/img/items/7741.PNG"
        },
        "Book of Clues": {
            "183": "/img/items/6979.png"
        },
        "Book of Fish": {
            "552": "/img/items/bookoffish.png"
        },
        "Book of Flora": {
            "182": "/img/items/7587.png"
        },
        "Book of Insects": {
            "210": "/img/items/7578.png"
        },
        "Book of Knots": {
            "181": "/img/items/5835.png"
        },
        "Book of Maps": {
            "184": "/img/items/7583.png"
        },
        "Book of Schemas": {
            "180": "/img/items/7922.png"
        },
        "Book of Skill": {
            "209": "/img/items/7792.png"
        },
        "Book of Time": {
            "208": "/img/items/7574.png"
        },
        "Bottle Rocket": {
            "105": "/img/items/6123.png"
        },
        "Bouquet of Roses": {
            "487": "/img/items/l_03_t.PNG"
        },
        "Box of Chocolate 01": {
            "483": "/img/items/l_06_t.png?1"
        },
        "Box of Chocolate 02": {
            "715": "/img/items/l_06_t.png?1"
        },
        "Breakfast Boost": {
            "661": "/img/items/eggsandwich.png"
        },
        "Broccoli": {
            "256": "/img/items/8757.png"
        },
        "Broccoli Seeds": {
            "257": "/img/items/seeds_broccoli.png"
        },
        "Broken Pipe": {
            "593": "/img/items/9389.PNG"
        },
        "Brooch of the Bahltruvian Elite": {
            "709": "/img/items/brooch.png?1"
        },
        "Broom": {
            "129": "/img/items/5717.PNG"
        },
        "Bucket": {
            "23": "/img/items/8263.PNG"
        },
        "Buddystone": {
            "298": "/img/items/buddystone.png"
        },
        "Bullfish": {
            "690": "/img/items/bullfish.png"
        },
        "Bunny Ears": {
            "520": "/img/items/ears.png"
        },
        "Butter": {
            "660": "/img/items/4431.png"
        },
        "Butter Churn": {
            "659": "/img/items/churn.png"
        },
        "Cabbage": {
            "67": "/img/items/8319-3.png?1"
        },
        "Cabbage Seeds": {
            "66": "/img/items/seeds_cabbage.png"
        },
        "Candy": {
            "358": "/img/items/candy_t_09.png"
        },
        "Candy Cane": {
            "401": "/img/items/cr_t_05.png"
        },
        "Candy Corn": {
            "361": "/img/items/candycorn.png"
        },
        "Candy Roll": {
            "426": "/img/items/14_sm.png"
        },
        "Canoe": {
            "615": "/img/items/554.png"
        },
        "Captains Log": {
            "247": "/img/items/4868.png"
        },
        "Carbon Sphere": {
            "144": "/img/items/carbonsphere.png"
        },
        "Carnevale": {
            "497": "/img/items/2749.png"
        },
        "Carp": {
            "132": "/img/items/7737.PNG"
        },
        "Carrot": {
            "19": "/img/items/8391.PNG"
        },
        "Carrot Seeds": {
            "20": "/img/items/seeds_carrots.png"
        },
        "Carved Bear": {
            "294": "/img/items/carvedbear.png"
        },
        "Carved Camel": {
            "291": "/img/items/carvedcamel.png"
        },
        "Carved Moose": {
            "295": "/img/items/carvedmoose.png"
        },
        "Carved Owl": {
            "288": "/img/items/carvedowl.png"
        },
        "Carved Rabbit": {
            "292": "/img/items/carvedrabbit.png"
        },
        "Carved Rhino": {
            "290": "/img/items/carvedrhino.png"
        },
        "Carved Squirrel": {
            "293": "/img/items/carvedsquirrel.png"
        },
        "Carved Warthog": {
            "296": "/img/items/carvedwh.png"
        },
        "Caterpillar": {
            "285": "/img/items/caterpillar.png"
        },
        "Catfish": {
            "107": "/img/items/redcatfish.png"
        },
        "Cat’s Meow": {
            "643": "/img/items/fishessensestew.png"
        },
        "Cecil’s Shrimp-a-Plenty": {
            "651": "/img/items/recipe.png"
        },
        "Cepathorf's Case": {
            "703": "/img/items/boxes_012.png"
        },
        "Charles’s Neigh": {
            "655": "/img/items/recipe.png"
        },
        "Chattering Teeth": {
            "356": "/img/items/jaw_t_01.png?1"
        },
        "Cheese": {
            "186": "/img/items/8279.png"
        },
        "Chocolate Bunny": {
            "541": "/img/items/chocobunny.png"
        },
        "Christmas Card": {
            "674": "/img/items/16_sm.png"
        },
        "Christmas Present 01": {
            "399": "/img/items/7468.png"
        },
        "Christmas Present 02": {
            "429": "/img/items/7468.png"
        },
        "Christmas Present 03": {
            "430": "/img/items/7468.png"
        },
        "Christmas Present 04": {
            "431": "/img/items/7468.png"
        },
        "Christmas Present 05": {
            "432": "/img/items/7468.png"
        },
        "Christmas Present 06": {
            "433": "/img/items/7468.png"
        },
        "Christmas Present 07": {
            "434": "/img/items/7468.png"
        },
        "Christmas Present 08": {
            "435": "/img/items/7468.png"
        },
        "Christmas Present 09": {
            "436": "/img/items/7468.png"
        },
        "Christmas Present 10": {
            "437": "/img/items/7468.png"
        },
        "Christmas Present 11": {
            "438": "/img/items/7468.png"
        },
        "Christmas Present 12": {
            "439": "/img/items/7468.png"
        },
        "Christmas Stocking": {
            "419": "/img/items/18_sm.png"
        },
        "Christmas Sweater": {
            "424": "/img/items/9_sm.png"
        },
        "Christmas Tree": {
            "408": "/img/items/cr_t_06_b.png?1"
        },
        "Chum": {
            "481": "/img/items/chumbucket.png"
        },
        "Cid's Stone Ale": {
            "400": "/img/items/ale.png"
        },
        "Clam Shell": {
            "97": "/img/items/7820.png"
        },
        "Clownfish": {
            "99": "/img/items/7832.PNG"
        },
        "Clubs": {
            "605": "/img/items/card_clubs.png"
        },
        "Coal": {
            "103": "/img/items/coal.png"
        },
        "Cogwheel": {
            "215": "/img/items/7211.png"
        },
        "Coin Purse": {
            "122": "/img/items/5945.PNG"
        },
        "Comet": {
            "444": "/img/items/comet.png"
        },
        "Compass": {
            "315": "/img/items/4919.png"
        },
        "Conch Shell": {
            "101": "/img/items/7904.png"
        },
        "Control Box": {
            "681": "/img/items/9306b32.png"
        },
        "Cooked Turkey": {
            "391": "/img/items/5742.png"
        },
        "Cooking Pot": {
            "637": "/img/items/2364.png?1"
        },
        "Copper Wire": {
            "591": "/img/items/9327.PNG"
        },
        "Corn": {
            "65": "/img/items/8288.png"
        },
        "Corn Kabob": {
            "567": "/img/items/cornkabob.png"
        },
        "Corn Oil": {
            "629": "/img/items/cornoil.png"
        },
        "Corn Prize Bag": {
            "602": "/img/items/bagofcorn.png"
        },
        "Corn Seeds": {
            "64": "/img/items/seeds_corn.png"
        },
        "Cornucopia": {
            "377": "/img/items/cornucopia.png"
        },
        "Cotton": {
            "254": "/img/items/8311.png"
        },
        "Cotton Seeds": {
            "255": "/img/items/seeds_cotton.png"
        },
        "Crab": {
            "574": "/img/items/3296.PNG"
        },
        "Crab Claw": {
            "475": "/img/items/crabclaw.png"
        },
        "Crappie": {
            "39": "/img/items/7735.PNG"
        },
        "Crossbow": {
            "585": "/img/items/8976.png"
        },
        "Crowfish": {
            "689": "/img/items/crowfish.png"
        },
        "Cucumber": {
            "29": "/img/items/5805.png"
        },
        "Cucumber Seeds": {
            "30": "/img/items/seeds_cucumber.png"
        },
        "Cupid": {
            "445": "/img/items/cupid.png"
        },
        "Cutlass": {
            "581": "/img/items/pirates_47_t.png"
        },
        "Cyclops Spider": {
            "383": "/img/items/4080.png"
        },
        "Dancer": {
            "441": "/img/items/dancer.png"
        },
        "Dasher": {
            "440": "/img/items/dasher.png"
        },
        "Diamond": {
            "175": "/img/items/7999.png"
        },
        "Diamonds": {
            "606": "/img/items/card_diamonds.png"
        },
        "Diary of O'Dynn": {
            "513": "/img/items/pt_t_18.png"
        },
        "Dice": {
            "212": "/img/items/4848.png"
        },
        "Diving Helmet": {
            "267": "/img/items/fishing_70_t.png"
        },
        "Donner": {
            "446": "/img/items/donner.png"
        },
        "Dragon Heart": {
            "626": "/img/items/3900.png"
        },
        "Dragon Skull": {
            "261": "/img/items/7212.png"
        },
        "Dragonfly": {
            "384": "/img/items/fishing_64_t.png"
        },
        "Drink Bundle": {
            "548": "/img/items/juices.png"
        },
        "Drum": {
            "17": "/img/items/7718.PNG"
        },
        "Egg 01": {
            "521": "/img/items/egg01.png"
        },
        "Egg 02": {
            "522": "/img/items/egg02.png"
        },
        "Egg 03": {
            "523": "/img/items/egg03.png"
        },
        "Egg 04": {
            "524": "/img/items/egg04.png"
        },
        "Egg 05": {
            "525": "/img/items/egg05.png"
        },
        "Egg 06": {
            "518": "/img/items/egg06.png"
        },
        "Egg 07": {
            "526": "/img/items/egg07.png"
        },
        "Egg 08": {
            "527": "/img/items/egg08.png"
        },
        "Egg 09": {
            "528": "/img/items/egg09.png"
        },
        "Egg 10": {
            "529": "/img/items/egg10.png"
        },
        "Egg 11": {
            "530": "/img/items/egg11.png"
        },
        "Egg 12": {
            "531": "/img/items/egg12.png"
        },
        "Eggplant": {
            "13": "/img/items/eggplant.png"
        },
        "Eggplant Seeds": {
            "14": "/img/items/seeds_eggplants.png"
        },
        "Eggs": {
            "26": "/img/items/5720.PNG"
        },
        "Egyptian Necklace": {
            "371": "/img/items/egyptian1.png"
        },
        "Emberstone": {
            "178": "/img/items/8166.png"
        },
        "Emerald": {
            "143": "/img/items/emerald.png"
        },
        "Emerald Ring": {
            "146": "/img/items/greenring.png"
        },
        "Energy Coil": {
            "680": "/img/items/9379b.png"
        },
        "Energy Core": {
            "353": "/img/items/parts_026.png"
        },
        "Engine": {
            "685": "/img/items/engine.png?1"
        },
        "Essence of Slime": {
            "492": "/img/items/essense.png"
        },
        "Explosive": {
            "106": "/img/items/6124.png"
        },
        "Eye Patch": {
            "245": "/img/items/4920.png"
        },
        "Fall Basket": {
            "636": "/img/items/fallbasket.png"
        },
        "Fancy Box": {
            "348": "/img/items/4238.png"
        },
        "Fancy Drum": {
            "474": "/img/items/drum.png"
        },
        "Fancy Guitar": {
            "393": "/img/items/3857.png?1"
        },
        "Fancy Pipe": {
            "301": "/img/items/7275.png?1"
        },
        "Fancy Shoe": {
            "669": "/img/items/bshoe2.png"
        },
        "Feathers": {
            "42": "/img/items/feathers.png"
        },
        "Feed": {
            "275": "/img/items/8299.png"
        },
        "Fern Leaf": {
            "52": "/img/items/fern.png"
        },
        "Fire Ant": {
            "286": "/img/items/fireant.png"
        },
        "Fireworks": {
            "452": "/img/items/petard.png"
        },
        "Fish Bones": {
            "45": "/img/items/7747.PNG"
        },
        "Fishing Net": {
            "194": "/img/items/7748.png"
        },
        "Flame Orb": {
            "343": "/img/items/7405.png"
        },
        "Flamejack": {
            "232": "/img/items/5162-2.png"
        },
        "Flarefin": {
            "234": "/img/items/5230-2.png"
        },
        "Flier": {
            "173": "/img/items/7843.png"
        },
        "Flour": {
            "276": "/img/items/5763.png"
        },
        "Fluorifish": {
            "201": "/img/items/5771.png"
        },
        "Flywheel": {
            "341": "/img/items/9387.png"
        },
        "Freaky Picture": {
            "259": "/img/items/5592.png"
        },
        "Friendship Bracelet": {
            "544": "/img/items/3788.png"
        },
        "Frog": {
            "479": "/img/items/frog.png"
        },
        "Frost Snapper Shell": {
            "697": "/img/items/iceshell.png"
        },
        "Frosteye": {
            "688": "/img/items/frosteye.png"
        },
        "Frozen Cabbage": {
            "707": "/img/items/frozencabbage.png"
        },
        "Frozen Peas": {
            "706": "/img/items/frozenpeas.png"
        },
        "Frozen Pine": {
            "708": "/img/items/frozenpine.png"
        },
        "Frozen Playground Key": {
            "704": "/img/items/frozenkey.png"
        },
        "Fruit Punch": {
            "653": "/img/items/fruitpunch.png"
        },
        "Garlic": {
            "665": "/img/items/garlic_t_02.png"
        },
        "Garnet": {
            "317": "/img/items/8008.png"
        },
        "Garnet Ring": {
            "316": "/img/items/garnetring.png"
        },
        "George's Onion Soup": {
            "639": "/img/items/recipe.png"
        },
        "Giant Centipede": {
            "287": "/img/items/giantcent.png"
        },
        "Giant Squid": {
            "140": "/img/items/7726.PNG"
        },
        "Gift Basket 01": {
            "329": "/img/items/giftbasket.png"
        },
        "Gift Basket 02": {
            "490": "/img/items/giftbasket.png"
        },
        "Gingerbread House": {
            "423": "/img/items/10_sm.png"
        },
        "Gingerbread Man": {
            "415": "/img/items/4_sm.png"
        },
        "Glacierstone": {
            "710": "/img/items/icestone.png"
        },
        "Glass Bottle": {
            "117": "/img/items/7727.PNG?1"
        },
        "Glass Eyes": {
            "664": "/img/items/eyes_t_01.png"
        },
        "Glass Orb": {
            "78": "/img/items/5708.PNG"
        },
        "Glassback": {
            "691": "/img/items/glassback.png"
        },
        "Globber": {
            "199": "/img/items/5766.png"
        },
        "Gold Boot": {
            "467": "/img/items/gboot.png?1"
        },
        "Gold Carrot": {
            "159": "/img/items/8391g.png"
        },
        "Gold Carrot Seeds": {
            "160": "/img/items/seeds_gcarrots.png"
        },
        "Gold Catfish": {
            "458": "/img/items/goldcatfish.png"
        },
        "Gold Coral": {
            "459": "/img/items/goldcoral.png"
        },
        "Gold Crab": {
            "270": "/img/items/fishing_102_t.png"
        },
        "Gold Cucumber": {
            "189": "/img/items/5805g.png?1"
        },
        "Gold Cucumber Seeds": {
            "190": "/img/items/seeds_gcucumber.png"
        },
        "Gold Drum": {
            "460": "/img/items/golddrum.png"
        },
        "Gold Egg": {
            "533": "/img/items/egg_gold.png"
        },
        "Gold Eggplant": {
            "262": "/img/items/geggplant.png?1"
        },
        "Gold Eggplant Seeds": {
            "352": "/img/items/seeds_geggplants.png"
        },
        "Gold Feather": {
            "172": "/img/items/5996.png"
        },
        "Gold Flier": {
            "462": "/img/items/goldflier.png"
        },
        "Gold Horseshoe": {
            "507": "/img/items/goldhs.png"
        },
        "Gold Jelly": {
            "580": "/img/items/goldjelly.png"
        },
        "Gold Leaf": {
            "281": "/img/items/8774.png"
        },
        "Gold Pea Seeds": {
            "162": "/img/items/seeds_gpeas.png"
        },
        "Gold Peas": {
            "161": "/img/items/8259g.png"
        },
        "Gold Pepper Seeds": {
            "158": "/img/items/seeds_gpeppers.png"
        },
        "Gold Peppers": {
            "157": "/img/items/8301g.png?1"
        },
        "Gold Potato": {
            "658": "/img/items/gp3.png"
        },
        "Gold Sea Bass": {
            "465": "/img/items/goldseabass.png"
        },
        "Gold Sea Crest": {
            "695": "/img/items/goldseacrest.png"
        },
        "Gold Shamrock": {
            "504": "/img/items/goldclover.png"
        },
        "Gold Trout": {
            "457": "/img/items/goldtrout.png?1"
        },
        "Goldfin": {
            "461": "/img/items/goldfin.png"
        },
        "Goldfish": {
            "271": "/img/items/fishing_118_t.png"
        },
        "Goldgill": {
            "463": "/img/items/goldgill.png"
        },
        "Goldjack": {
            "466": "/img/items/goldjack.png?1"
        },
        "Goldray": {
            "464": "/img/items/goldray.png"
        },
        "Gouda": {
            "351": "/img/items/4601.png"
        },
        "Grab Bag 01": {
            "330": "/img/items/4497.png"
        },
        "Grab Bag 02": {
            "334": "/img/items/4497.png"
        },
        "Grab Bag 03": {
            "396": "/img/items/4497.png"
        },
        "Grab Bag 04": {
            "397": "/img/items/4497.png"
        },
        "Grab Bag 05": {
            "398": "/img/items/4497.png"
        },
        "Grab Bag 06": {
            "453": "/img/items/4497.png"
        },
        "Grab Bag 07": {
            "491": "/img/items/4497.png"
        },
        "Grab Bag 08": {
            "583": "/img/items/4497.png"
        },
        "Grape Juice": {
            "112": "/img/items/grapejuice.png"
        },
        "Grapes": {
            "120": "/img/items/8272.PNG"
        },
        "Grasshopper": {
            "382": "/img/items/3315.png"
        },
        "Green Barracuda": {
            "575": "/img/items/3284.png"
        },
        "Green Chromis": {
            "56": "/img/items/7828.PNG"
        },
        "Green Cloak": {
            "350": "/img/items/ForestIcons_54_t.png"
        },
        "Green Diary": {
            "82": "/img/items/greenbook.png"
        },
        "Green Dye": {
            "203": "/img/items/greendye.png"
        },
        "Green Jellyfish": {
            "138": "/img/items/7787.png"
        },
        "Green Ornament": {
            "403": "/img/items/cr_t_03_c.png"
        },
        "Green Parchment": {
            "74": "/img/items/greenparchment.png"
        },
        "Green Scarf": {
            "414": "/img/items/scarf.png"
        },
        "Green Shield": {
            "204": "/img/items/greenshield.png"
        },
        "Green Top Hat": {
            "506": "/img/items/greenhat.png"
        },
        "Growth Medallion I": {
            "532": "/img/items/ForestIcons_32_t.png"
        },
        "Growth Medallion II": {
            "609": "/img/items/ForestIcons_32_t.png"
        },
        "Grubs": {
            "191": "/img/items/7745.png"
        },
        "Gummy Worms": {
            "277": "/img/items/gworm.png"
        },
        "Hammer": {
            "236": "/img/items/hammer.png?2"
        },
        "Happy Cookies": {
            "699": "/img/items/ccookies.png"
        },
        "Headdress of Luna": {
            "542": "/img/items/3911.png"
        },
        "Heart Container": {
            "671": "/img/items/heartcontainer.png?1"
        },
        "Heart Necklace": {
            "486": "/img/items/l_02_t_a.PNG"
        },
        "Heart Necklace Left Piece": {
            "484": "/img/items/l_02_t_b.PNG"
        },
        "Heart Necklace Right Piece": {
            "485": "/img/items/l_02_t_c.PNG"
        },
        "Hearts": {
            "607": "/img/items/card_hearts.png"
        },
        "Herbs": {
            "349": "/img/items/5686.png"
        },
        "Hide": {
            "109": "/img/items/5986.PNG"
        },
        "Hockey Mask": {
            "367": "/img/items/hockeymask.png"
        },
        "Holger's Mushroom Stew": {
            "638": "/img/items/recipe.png"
        },
        "Holiday Candles": {
            "451": "/img/items/11_sm.png"
        },
        "Holiday Wreath": {
            "687": "/img/items/wreath.png?2"
        },
        "Honey": {
            "250": "/img/items/6678.png"
        },
        "Hops": {
            "46": "/img/items/8248.PNG"
        },
        "Hops Seeds": {
            "47": "/img/items/seeds_hops.png"
        },
        "Horn": {
            "164": "/img/items/6111.PNG"
        },
        "Horn Canteen": {
            "165": "/img/items/5969.PNG"
        },
        "Horned Beetle": {
            "283": "/img/items/hbeetle.png"
        },
        "Horseshoe": {
            "217": "/img/items/6956.png"
        },
        "Hot Cocoa": {
            "425": "/img/items/5_sm.png"
        },
        "Hot Potato": {
            "565": "/img/items/hotpotato.png"
        },
        "Hourglass": {
            "388": "/img/items/4241.png"
        },
        "Ice Shark": {
            "696": "/img/items/iceshark.png"
        },
        "Iced Tea": {
            "185": "/img/items/tea.png"
        },
        "Inferno Sphere": {
            "169": "/img/items/6017.png"
        },
        "Iron": {
            "22": "/img/items/5779.PNG"
        },
        "Iron Cup": {
            "130": "/img/items/ironcup.png"
        },
        "Iron Ring": {
            "95": "/img/items/ironring.png"
        },
        "Jack-o-key": {
            "670": "/img/items/jkey.png"
        },
        "Jack-o-lantern": {
            "355": "/img/items/pumpkin_t_05.png"
        },
        "Jade": {
            "264": "/img/items/jade.png"
        },
        "Jade Charm": {
            "265": "/img/items/jadecharm.png"
        },
        "Jellyfish": {
            "119": "/img/items/7808.png"
        },
        "Jill’s Quandary Chowder": {
            "649": "/img/items/recipe.png"
        },
        "Jumbo Fish": {
            "577": "/img/items/3279.png"
        },
        "Keyglobe": {
            "686": "/img/items/keyglobe.png"
        },
        "Kill Switch": {
            "682": "/img/items/9311.png"
        },
        "Ladder": {
            "260": "/img/items/5629.png"
        },
        "Langstaff Crest": {
            "632": "/img/items/langstaff.png"
        },
        "Lantern": {
            "368": "/img/items/lantern.png?1"
        },
        "Large Chest 01": {
            "346": "/img/items/8572.png"
        },
        "Large Chest 02": {
            "363": "/img/items/8572.png"
        },
        "Large Chest 03": {
            "573": "/img/items/8572.png"
        },
        "Large Clam Shell": {
            "269": "/img/items/fishing_74_t.png"
        },
        "Large Net": {
            "500": "/img/items/lnet.png?3"
        },
        "Largemouth Bass": {
            "25": "/img/items/7736.PNG"
        },
        "Lava Sphere": {
            "220": "/img/items/5249.png"
        },
        "Leather": {
            "110": "/img/items/5987.PNG"
        },
        "Leather Bag": {
            "166": "/img/items/6175.PNG"
        },
        "Leather Diary": {
            "118": "/img/items/5754.PNG"
        },
        "Leather Waterskin": {
            "239": "/img/items/5563.png"
        },
        "Leek": {
            "50": "/img/items/8291.png"
        },
        "Leek Seeds": {
            "51": "/img/items/seeds_leek.png"
        },
        "Lemon": {
            "62": "/img/items/8251.PNG"
        },
        "Lemon Quartz": {
            "80": "/img/items/5798.png"
        },
        "Lemon Quartz Ring": {
            "124": "/img/items/lemonring.png"
        },
        "Lemonade": {
            "86": "/img/items/lemonade.png"
        },
        "Lima Bean": {
            "279": "/img/items/lima.png?1"
        },
        "Lollipop": {
            "359": "/img/items/candy_t_08.png"
        },
        "Looking Glass": {
            "79": "/img/items/5865.png"
        },
        "Lorn's Breakfast Boost": {
            "662": "/img/items/recipe.png"
        },
        "Lovely Cookies": {
            "716": "/img/items/lcookies.png"
        },
        "Lovely Present": {
            "673": "/img/items/lpres.png"
        },
        "Lucky Rabbit Foot": {
            "468": "/img/items/4289.png"
        },
        "MIAB": {
            "135": "/img/items/7756.png"
        },
        "Machine Part": {
            "598": "/img/items/9331.PNG"
        },
        "Machine Press": {
            "628": "/img/items/press.png"
        },
        "Mackerel": {
            "198": "/img/items/5768.png"
        },
        "Magic Conch Shell": {
            "211": "/img/items/mcs.png"
        },
        "Magic Mirror": {
            "627": "/img/items/2687.png"
        },
        "Magicite": {
            "176": "/img/items/7963.png"
        },
        "Magna Core": {
            "340": "/img/items/9376.png"
        },
        "Magna Quartz": {
            "338": "/img/items/magnaquartz.png"
        },
        "Magnifying Glass": {
            "216": "/img/items/7210.png"
        },
        "Mapping Compass": {
            "476": "/img/items/mappingcompass.png"
        },
        "Marlin": {
            "114": "/img/items/7816.png"
        },
        "Mealworms": {
            "498": "/img/items/mw.png"
        },
        "Medium Chest 01": {
            "336": "/img/items/8574.png"
        },
        "Medium Chest 02": {
            "337": "/img/items/8574.png"
        },
        "Meerif Crest": {
            "633": "/img/items/meerif.png"
        },
        "Mega Beet Seeds": {
            "588": "/img/items/seeds_mbeet.png"
        },
        "Mega Sunflower Seeds": {
            "589": "/img/items/seeds_msunflower.png"
        },
        "Metal Spool": {
            "678": "/img/items/9325.png"
        },
        "Milk": {
            "85": "/img/items/8382.PNG"
        },
        "Milk Carton": {
            "623": "/img/items/packaging_t_01.PNG"
        },
        "Milk and Cookies": {
            "418": "/img/items/25_sm.png"
        },
        "Minnows": {
            "192": "/img/items/7749.png"
        },
        "Mistletoe": {
            "417": "/img/items/28_sm.png"
        },
        "Mittens": {
            "421": "/img/items/15_sm.png"
        },
        "Model Ship": {
            "219": "/img/items/4925.png"
        },
        "Monster Skull": {
            "611": "/img/items/8617.png"
        },
        "Moonstone": {
            "177": "/img/items/8014.png"
        },
        "Mug of Beer": {
            "505": "/img/items/7264.png?1"
        },
        "Mulberry Snapper": {
            "576": "/img/items/3276.png"
        },
        "Mushroom": {
            "43": "/img/items/mushroom.png"
        },
        "Mushroom Paste": {
            "75": "/img/items/5691.png"
        },
        "Mushroom Spores": {
            "395": "/img/items/seeds_mushroom.png"
        },
        "Mushroom Stew": {
            "634": "/img/items/mushroomstew.png"
        },
        "Mussel": {
            "136": "/img/items/7785.png"
        },
        "Mystic Ring": {
            "195": "/img/items/8038.png"
        },
        "Mystical Chest 01": {
            "482": "/img/items/4456.png"
        },
        "Mystical Chest 02": {
            "572": "/img/items/4456.png"
        },
        "Mystical Staff": {
            "325": "/img/items/5273.png?1"
        },
        "Nails": {
            "38": "/img/items/5860.png"
        },
        "Neigh": {
            "654": "/img/items/vegsoup4.png"
        },
        "Notebook": {
            "618": "/img/items/pad_t_01.PNG"
        },
        "Oak": {
            "303": "/img/items/6695.png"
        },
        "Octopus": {
            "207": "/img/items/8802.png"
        },
        "Odthorin's Charm": {
            "515": "/img/items/8455.png"
        },
        "Official Share": {
            "493": "/img/items/7896.png"
        },
        "Old Boot": {
            "116": "/img/items/7848.PNG"
        },
        "Onion": {
            "33": "/img/items/8317.png"
        },
        "Onion Rings": {
            "566": "/img/items/onionrings.png"
        },
        "Onion Seeds": {
            "34": "/img/items/seeds_onions.png"
        },
        "Onion Soup": {
            "635": "/img/items/onionsoup.png"
        },
        "Onyx Scorpion": {
            "599": "/img/items/4514b.png"
        },
        "Opposition Hourglass": {
            "470": "/img/items/hourglass.png"
        },
        "Orange": {
            "61": "/img/items/orange.png"
        },
        "Orange Gecko": {
            "389": "/img/items/3493.png"
        },
        "Orange Juice": {
            "84": "/img/items/orangejuice.png"
        },
        "Orange Ornament": {
            "402": "/img/items/cr_t_03_d.png"
        },
        "Orcafish": {
            "579": "/img/items/3282.png"
        },
        "Over The Moon": {
            "647": "/img/items/leekmeatcorn.png"
        },
        "Pair of Boots": {
            "713": "/img/items/pboot2.png"
        },
        "Paper Receipt": {
            "385": "/img/items/7611.png"
        },
        "Pea Seeds": {
            "28": "/img/items/seeds_peas.png"
        },
        "Peach": {
            "586": "/img/items/peach.png"
        },
        "Peach Juice": {
            "587": "/img/items/peachjuice.png"
        },
        "Pear Grease": {
            "683": "/img/items/8957.png"
        },
        "Pearl": {
            "100": "/img/items/7876.PNG"
        },
        "Pearl Necklace": {
            "196": "/img/items/pearlnecklace.png"
        },
        "Peas": {
            "27": "/img/items/8259.PNG"
        },
        "Peculiar Gem": {
            "545": "/img/items/4255.png"
        },
        "Peg Leg": {
            "624": "/img/items/pegleg.png"
        },
        "Pencil": {
            "619": "/img/items/pencil_t_01.png"
        },
        "Pepper Seeds": {
            "12": "/img/items/seeds_peppers.png"
        },
        "Peppers": {
            "11": "/img/items/8301.png"
        },
        "Pie": {
            "495": "/img/items/5794.png"
        },
        "Piece of Heart": {
            "253": "/img/items/poh.png"
        },
        "Pine Cone": {
            "289": "/img/items/pinecone2.png"
        },
        "Pine Seeds": {
            "410": "/img/items/seeds_pine.png"
        },
        "Pine Tree": {
            "409": "/img/items/cr_t_06.png"
        },
        "Pink Ribbon": {
            "489": "/img/items/l_05_t.PNG"
        },
        "Pirate Bandana": {
            "258": "/img/items/4903.png"
        },
        "Pirate Flag": {
            "246": "/img/items/4924.png"
        },
        "Pirate Hook": {
            "571": "/img/items/pirates_38_t.png"
        },
        "Piñata": {
            "550": "/img/items/pinata.png"
        },
        "Plumbfish": {
            "309": "/img/items/7754.png"
        },
        "Pocket Watch": {
            "213": "/img/items/4887.png"
        },
        "Polished Boot": {
            "712": "/img/items/pboot.png"
        },
        "Popcorn": {
            "375": "/img/items/popcorn.png"
        },
        "Pot of Gold (Large)": {
            "501": "/img/items/potogold.png"
        },
        "Pot of Gold (Medium)": {
            "502": "/img/items/pog2.png"
        },
        "Pot of Gold (Small)": {
            "503": "/img/items/pog3.png"
        },
        "Potato": {
            "48": "/img/items/potato.png"
        },
        "Potato Seeds": {
            "49": "/img/items/seeds_potato.png"
        },
        "Power Monitor": {
            "684": "/img/items/9314.png"
        },
        "Prancer": {
            "442": "/img/items/prancer.png"
        },
        "Present 01": {
            "344": "/img/items/7447.png"
        },
        "Present 02": {
            "534": "/img/items/present02.png"
        },
        "Prickly Pear": {
            "596": "/img/items/pricklypear.png"
        },
        "Prism Shard": {
            "179": "/img/items/8072.png"
        },
        "Puffer": {
            "115": "/img/items/7723.PNG"
        },
        "Pulley": {
            "590": "/img/items/pulley.png"
        },
        "Pumpkin": {
            "69": "/img/items/8294.png"
        },
        "Pumpkin Pie": {
            "672": "/img/items/ppie.png"
        },
        "Pumpkin Seeds": {
            "68": "/img/items/seeds_pumpkin.png"
        },
        "Purple Bag": {
            "539": "/img/items/purplebag.png"
        },
        "Purple Butterfly Fish": {
            "570": "/img/items/pirates_77_t.png"
        },
        "Purple Diary": {
            "83": "/img/items/purplebook.png"
        },
        "Purple Dye": {
            "537": "/img/items/purpledye.png"
        },
        "Purple Flower": {
            "53": "/img/items/flower.png"
        },
        "Purple Ornament": {
            "407": "/img/items/cr_t_03_b.png"
        },
        "Purple Parchment": {
            "73": "/img/items/5755.PNG"
        },
        "Quandary Chowder": {
            "644": "/img/items/corngreens.png"
        },
        "R.O.A.S.": {
            "369": "/img/items/rat_t_01.png"
        },
        "Radish": {
            "31": "/img/items/radish.png?1"
        },
        "Radish Seeds": {
            "32": "/img/items/seeds_radish.png"
        },
        "Raptor Claw": {
            "323": "/img/items/raptor.png"
        },
        "Raptor Egg": {
            "394": "/img/items/raptoregg.png"
        },
        "Red Berries": {
            "319": "/img/items/ForestIcons_46_t.png"
        },
        "Red Dye": {
            "536": "/img/items/reddye.png"
        },
        "Red Ornament": {
            "404": "/img/items/cr_t_03.png"
        },
        "Red Shield": {
            "538": "/img/items/redshield.png"
        },
        "Red Starfish": {
            "205": "/img/items/8814.png?1"
        },
        "Redgill": {
            "233": "/img/items/5182-2.png"
        },
        "Rice": {
            "630": "/img/items/rice.png"
        },
        "Rice Seeds": {
            "631": "/img/items/seeds_rice.png"
        },
        "Ring of Renthisj": {
            "365": "/img/items/5466.png"
        },
        "Roomba’s Over The Moon": {
            "652": "/img/items/recipe.png"
        },
        "Rope": {
            "193": "/img/items/5624.png"
        },
        "Rosalie's Bone Broth": {
            "642": "/img/items/recipe.png"
        },
        "Rubber Duckie": {
            "380": "/img/items/ducky.png"
        },
        "Ruby": {
            "94": "/img/items/6071.PNG"
        },
        "Ruby Coral": {
            "312": "/img/items/coral.png"
        },
        "Ruby Fish": {
            "174": "/img/items/7838.png?1"
        },
        "Ruby Ring": {
            "96": "/img/items/rubyring.png"
        },
        "Ruby Scorpion": {
            "376": "/img/items/4514.png"
        },
        "Rudolph": {
            "448": "/img/items/rudolph.png"
        },
        "Runecorn": {
            "668": "/img/items/runecorn.png"
        },
        "Runecube": {
            "517": "/img/items/2099.png"
        },
        "Runestone 01": {
            "147": "/img/items/rs1.png"
        },
        "Runestone 02": {
            "148": "/img/items/rs2.png"
        },
        "Runestone 03": {
            "149": "/img/items/rs3.png"
        },
        "Runestone 04": {
            "150": "/img/items/rs4.png"
        },
        "Runestone 05": {
            "151": "/img/items/rs5.png"
        },
        "Runestone 06": {
            "152": "/img/items/rs6.png"
        },
        "Runestone 07": {
            "153": "/img/items/rs7.png"
        },
        "Runestone 08": {
            "154": "/img/items/rs8.png"
        },
        "Runestone 09": {
            "155": "/img/items/rs9.png"
        },
        "Runestone 10": {
            "156": "/img/items/rs10.png"
        },
        "Runestone 11": {
            "221": "/img/items/rs11.png?1"
        },
        "Runestone 12": {
            "222": "/img/items/rs12.png"
        },
        "Runestone 13": {
            "223": "/img/items/rs13.png"
        },
        "Runestone 14": {
            "224": "/img/items/rs14.png?1"
        },
        "Runestone 15": {
            "225": "/img/items/rs15.png"
        },
        "Runestone 16": {
            "226": "/img/items/rs16.png?1"
        },
        "Runestone 17": {
            "227": "/img/items/rs17.png"
        },
        "Runestone 18": {
            "228": "/img/items/rs18.png?1"
        },
        "Runestone 19": {
            "229": "/img/items/rs19.png?1"
        },
        "Runestone 20": {
            "230": "/img/items/rs20.png"
        },
        "Runestone 23": {
            "553": "/img/items/5658.png"
        },
        "Runestone Necklace": {
            "582": "/img/items/pirates_17_t.png"
        },
        "Safety Pin": {
            "620": "/img/items/pin_t_01.png"
        },
        "Salt": {
            "305": "/img/items/salt.png"
        },
        "Salt Rock": {
            "304": "/img/items/saltrock.png"
        },
        "Sand": {
            "387": "/img/items/am_t_01.png"
        },
        "Sand Dollar": {
            "604": "/img/items/sanddollar.png?1"
        },
        "Sandstone": {
            "202": "/img/items/5197.png"
        },
        "Santa Hat": {
            "413": "/img/items/cr_t_04.png"
        },
        "Schoolbook": {
            "617": "/img/items/book_t_01.PNG"
        },
        "Scissors": {
            "326": "/img/items/scissors.png"
        },
        "Scrap Metal": {
            "601": "/img/items/9383.PNG"
        },
        "Scrap Wire": {
            "600": "/img/items/9398.PNG"
        },
        "Sea Catfish": {
            "308": "/img/items/7477.png"
        },
        "Sea Crest": {
            "692": "/img/items/seacrest.png"
        },
        "Sea Dragon": {
            "478": "/img/items/seadragon.png"
        },
        "Sea Pincher Special": {
            "645": "/img/items/crabclawsoup.png"
        },
        "Seahorse": {
            "206": "/img/items/8819.png"
        },
        "Sealed Letter": {
            "274": "/img/items/7475.png?1"
        },
        "Seaweed": {
            "390": "/img/items/fishing_75_t.png"
        },
        "Seeing Stone": {
            "327": "/img/items/5557.png?4"
        },
        "Seeker": {
            "693": "/img/items/seeker.png"
        },
        "Serpent Eel": {
            "311": "/img/items/7817.png"
        },
        "Shark Tooth": {
            "241": "/img/items/sharktooth.png"
        },
        "Shimmer Quartz": {
            "102": "/img/items/5707.PNG"
        },
        "Shimmer Ring": {
            "249": "/img/items/shimmertopazring.png"
        },
        "Shimmer Stone": {
            "77": "/img/items/5711.PNG"
        },
        "Shimmer Topaz": {
            "248": "/img/items/8055.png"
        },
        "Shinefish": {
            "268": "/img/items/fishing_112_t.png"
        },
        "Shiny Beetle": {
            "282": "/img/items/beetle.png"
        },
        "Shovel": {
            "238": "/img/items/5853.png?1"
        },
        "Shrimp": {
            "141": "/img/items/7844.PNG"
        },
        "Shrimp-a-Plenty": {
            "646": "/img/items/shrimpgreensmix.png"
        },
        "Skeleton Key": {
            "366": "/img/items/skelkey.png"
        },
        "Skipjack": {
            "139": "/img/items/7790.png"
        },
        "Skull Coin": {
            "266": "/img/items/7286.png"
        },
        "Slimestone": {
            "302": "/img/items/5655.png"
        },
        "Small Bolt": {
            "595": "/img/items/9374.PNG"
        },
        "Small Chest 01": {
            "332": "/img/items/4493.png"
        },
        "Small Chest 02": {
            "333": "/img/items/4493.png"
        },
        "Small Flute": {
            "273": "/img/items/5255.png?1"
        },
        "Small Gear": {
            "342": "/img/items/9388.png"
        },
        "Small Key": {
            "331": "/img/items/basickey.png"
        },
        "Small Prawn": {
            "58": "/img/items/7826.PNG"
        },
        "Small Screw": {
            "339": "/img/items/9380.png"
        },
        "Small Spring": {
            "251": "/img/items/5633.png"
        },
        "Snail": {
            "284": "/img/items/snail.png"
        },
        "Snow Globe": {
            "428": "/img/items/21_sm.png"
        },
        "Snowball": {
            "412": "/img/items/cr_t_07.png"
        },
        "Snowman": {
            "411": "/img/items/cr_t_08.png"
        },
        "Soap": {
            "614": "/img/items/soap_r.png"
        },
        "Sombrero": {
            "551": "/img/items/sombrero.png"
        },
        "Sour Root": {
            "322": "/img/items/ForestIcons_11_t.png"
        },
        "Spades": {
            "608": "/img/items/card_spades.png"
        },
        "Speckled Grouper": {
            "578": "/img/items/3281.png"
        },
        "Spectacles": {
            "243": "/img/items/5392.png"
        },
        "Spider": {
            "362": "/img/items/spider_t_01.png"
        },
        "Spiked Shell": {
            "473": "/img/items/spikey.png"
        },
        "Spiral Shell": {
            "310": "/img/items/7878.png"
        },
        "Spooky Cookies": {
            "657": "/img/items/854.png"
        },
        "Spool of Copper": {
            "679": "/img/items/9324.png"
        },
        "Spoon": {
            "675": "/img/items/2473.png"
        },
        "Spring Basket": {
            "494": "/img/items/springbasket.png"
        },
        "Square Key": {
            "335": "/img/items/7179.png"
        },
        "Star": {
            "416": "/img/items/29_sm.png"
        },
        "Starfish": {
            "98": "/img/items/7821.png"
        },
        "Steak": {
            "137": "/img/items/5773.PNG"
        },
        "Steak Kabob": {
            "197": "/img/items/8898.png"
        },
        "Steel": {
            "145": "/img/items/6150.png"
        },
        "Steel Plate": {
            "592": "/img/items/9313.png"
        },
        "Steel Wire": {
            "392": "/img/items/wire.png"
        },
        "Stingray": {
            "134": "/img/items/7831.PNG"
        },
        "Stone": {
            "40": "/img/items/6174.PNG"
        },
        "Stone Jelly": {
            "694": "/img/items/stonejelly.png"
        },
        "Stones of Gallodor": {
            "516": "/img/items/2606.png"
        },
        "Strange Gem": {
            "345": "/img/items/5167.png"
        },
        "Strange Letter": {
            "168": "/img/items/7852.png"
        },
        "Strange Mushroom": {
            "496": "/img/items/smush.png"
        },
        "Strange Ring": {
            "235": "/img/items/onering.png"
        },
        "Straw": {
            "128": "/img/items/5908.png"
        },
        "Striped Feather": {
            "320": "/img/items/6005.png"
        },
        "Sturdy Bow": {
            "456": "/img/items/4765.png"
        },
        "Sturdy Box": {
            "55": "/img/items/5812.PNG"
        },
        "Sturdy Shield": {
            "167": "/img/items/5847.png"
        },
        "Sturdy Sword": {
            "300": "/img/items/8927.png?1"
        },
        "Summer Basket": {
            "603": "/img/items/basket.png"
        },
        "Sunfish": {
            "88": "/img/items/7802.png"
        },
        "Sunflower": {
            "373": "/img/items/sunflower.png"
        },
        "Sunflower Seeds": {
            "374": "/img/items/seeds_sunflower.png"
        },
        "Sweet Root": {
            "92": "/img/items/5685.png"
        },
        "Swordfish": {
            "306": "/img/items/4899.png"
        },
        "Tackle Box": {
            "584": "/img/items/7847.png"
        },
        "Taco": {
            "549": "/img/items/taco.png"
        },
        "Taffy": {
            "370": "/img/items/candy_t_11.png"
        },
        "Tea Leaves": {
            "499": "/img/items/5600.png"
        },
        "Teapot": {
            "280": "/img/items/teapot.png"
        },
        "Teddy Bear": {
            "420": "/img/items/17_sm.png"
        },
        "Thomas’s Cat’s Meow": {
            "648": "/img/items/recipe.png"
        },
        "Thorns": {
            "321": "/img/items/ForestIcons_15_t.png"
        },
        "Toilet Paper": {
            "616": "/img/items/bandages_t_01.png"
        },
        "Tomato": {
            "15": "/img/items/8290.png"
        },
        "Tomato Seeds": {
            "16": "/img/items/seeds_tomato.png"
        },
        "Torch Fish": {
            "231": "/img/items/5147-2.png"
        },
        "Tower Key": {
            "469": "/img/items/7140.png"
        },
        "Transistor": {
            "597": "/img/items/9319.png"
        },
        "Treasure Chest": {
            "252": "/img/items/4917.png"
        },
        "Treasure Key": {
            "347": "/img/items/7148.png"
        },
        "Treasure Map 01": {
            "472": "/img/items/treasuremap.png"
        },
        "Treat Bag 01": {
            "360": "/img/items/bag_t_03.png"
        },
        "Treat Bag 02": {
            "364": "/img/items/bag_t_03.png"
        },
        "Treat Bag 03": {
            "372": "/img/items/bag_t_03.png"
        },
        "Treat Bag 04": {
            "656": "/img/items/bag_t_03.png"
        },
        "Tribal Mask": {
            "313": "/img/items/ForestIcons_19_t.png"
        },
        "Tribal Staff": {
            "324": "/img/items/3972.png"
        },
        "Trident of Poseidon": {
            "386": "/img/items/trident.png"
        },
        "Trigon Knot": {
            "543": "/img/items/3179.png"
        },
        "Trout": {
            "63": "/img/items/trout.png"
        },
        "Twine": {
            "163": "/img/items/6172-1.png"
        },
        "Unpolished Emerald": {
            "142": "/img/items/uemerald.png"
        },
        "Unpolished Garnet": {
            "318": "/img/items/8030.png"
        },
        "Unpolished Jade": {
            "263": "/img/items/ujade.png"
        },
        "Unpolished Ruby": {
            "93": "/img/items/5992.png"
        },
        "Unpolished Shimmer Stone": {
            "76": "/img/items/5782.PNG"
        },
        "Valentines Card": {
            "488": "/img/items/l_07_t.PNG"
        },
        "Vincent’s Sea Pincher Special": {
            "650": "/img/items/recipe.png"
        },
        "Vixen": {
            "443": "/img/items/vixen.png"
        },
        "Wagon Wheel": {
            "328": "/img/items/wheel.png"
        },
        "Water Bottle": {
            "621": "/img/items/water_t_01.png"
        },
        "Water Lily": {
            "378": "/img/items/3258.png"
        },
        "Water Orb": {
            "701": "/img/items/2324.png?1"
        },
        "Watermelon": {
            "59": "/img/items/8293.png"
        },
        "Watermelon Seeds": {
            "60": "/img/items/seeds_watermelon.png"
        },
        "Wax Candle": {
            "354": "/img/items/candle.png"
        },
        "Wheat": {
            "71": "/img/items/8249.png"
        },
        "Wheat Seeds": {
            "70": "/img/items/seeds_wheet.png"
        },
        "Whistle": {
            "622": "/img/items/whistle_t_01.PNG"
        },
        "White Parchment": {
            "81": "/img/items/whiteparchment.png"
        },
        "Wine": {
            "121": "/img/items/wine.png"
        },
        "Winged Amulet": {
            "297": "/img/items/7422.png"
        },
        "Winter Basket": {
            "705": "/img/items/winterbasket.png?2"
        },
        "Wishbone Necklace": {
            "477": "/img/items/wishbone.png"
        },
        "Witch Hat": {
            "357": "/img/items/hat_t_02.png"
        },
        "Witch's Brew": {
            "666": "/img/items/pot_t_01.png"
        },
        "Witch's Broom": {
            "663": "/img/items/broom_t_01.png"
        },
        "Wizard Hat": {
            "240": "/img/items/4798.png"
        },
        "Wood": {
            "35": "/img/items/6143.PNG"
        },
        "Wood Plank": {
            "36": "/img/items/5733.PNG"
        },
        "Wooden Barrel": {
            "72": "/img/items/5829.PNG"
        },
        "Wooden Bow": {
            "455": "/img/items/4764.png"
        },
        "Wooden Box": {
            "37": "/img/items/5736.PNG"
        },
        "Wooden Mask": {
            "214": "/img/items/4880.png"
        },
        "Wooden Pipe": {
            "272": "/img/items/4910.png?1"
        },
        "Wooden Shield": {
            "127": "/img/items/5822.PNG"
        },
        "Wooden Sword": {
            "299": "/img/items/sword2.png"
        },
        "Worms": {
            "18": "/img/items/7758.png"
        },
        "Wrench": {
            "594": "/img/items/9310.png"
        },
        "Y73841 Blueprint": {
            "612": "/img/items/7793.png"
        },
        "Y73841 Detector": {
            "613": "/img/items/9304.png"
        },
        "Yarn": {
            "427": "/img/items/pt_t_07.png"
        },
        "Yellow Ornament": {
            "405": "/img/items/cr_t_03_e.png"
        },
        "Yellow Perch": {
            "24": "/img/items/yellowperch.png"
        },
        "Zho's Dagger": {
            "702": "/img/items/4773.png"
        },
        "frank's Basket": {
            "519": "/img/items/fbasket.png"
        }
    };


    function giveMailItem(itemId, npcId, quantity) {
        console.log(`Sending item ID: ${itemId}, to NPC: ${npcId}, quantity: ${quantity}`);
        fetch(`https://farmrpg.com/worker.php?go=givemailitem&id=${itemId}&to=${npcId}&qty=${quantity}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(response => response.text()).then(result => console.log(`Sent ${quantity}x ${itemId} to ${NPCS[npcId]}. Response:`, result))
            .catch(error => console.error('Error sending mail item:', error));
    }

    function createUI(element) {
        const container = document.createElement('div');
        container.style.cssText = 'background-color:#222;color:#fff;padding:10px;border:1px solid #444;font-family:sans-serif;display:flex;flex-direction:column;align-items:flex-start;';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search Item...';
        searchInput.style.cssText = 'margin:5px;padding:5px;background:#333;color:#fff;border:1px solid #555;width:100%';

        const resultsBox = document.createElement('div');
        resultsBox.style.cssText = 'max-height:150px;overflow-y:auto;background:#333;border:1px solid #555;width:200px;display:none;';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.placeholder = 'Quantity';
        quantityInput.style.cssText = 'margin:5px;padding:5px;background:#333;color:#fff;border:1px solid #555;width:100%;';

        const npcSelect = document.createElement('select');
        npcSelect.style.cssText = 'margin:5px;padding:5px;background:#333;color:#fff;border:1px solid #555;';
        NPCS.forEach(([id, name]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            npcSelect.appendChild(option);
        });

        const inputButtonContainer = document.createElement('div');
        inputButtonContainer.style.display = 'flex';

        const createButton = document.createElement('button');
        createButton.textContent = 'Create';
        createButton.style.cssText = 'margin:5px;padding:5px;background:#444;color:#fff;border:1px solid #666;cursor:pointer;';

        const showButtonsButton = document.createElement('button');
        showButtonsButton.textContent = 'Show Buttons';
        showButtonsButton.style.cssText = 'margin:5px;padding:5px;background:#444;color:#fff;border:1px solid #666;cursor:pointer;';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
    position: absolute;
    width: 800px;
    height: 200px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #555;
    z-index: 10000;
    resize: both;
    overflow: hidden;
    top: calc(100% - 150px);
    left: calc(100% - 800px);
    display: none;
    padding: 10px;
`;

        const containerHeader = document.createElement('div');
        containerHeader.style.cssText = `
    background:#444;
    padding:10px;
    color:#fff;
    cursor:move;
    height: 20px;
    display: block;
    width: 100%;
`;

        const buttonsContent = document.createElement('div');
        buttonsContent.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* space between buttons */
    padding: 10px;
`;
        buttonsContainer.appendChild(containerHeader);
        buttonsContainer.appendChild(buttonsContent);

        let selectedItem = null;

        function createItemButton(itemId, npcId, quantity, imageUrl) {
            const button = document.createElement('div');
            button.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #444;
            border-radius: 5px;
            padding: 10px;
            width: 80px;
            text-align: center;
            `;
            button.addEventListener("click", function (e) {
                giveMailItem(itemId, npcId, quantity);
            });
            button.className = `${itemId}${npcId}${quantity}`;

            const img = document.createElement('img');
            img.src = `https://farmrpg.com${imageUrl}`;
            img.style.cssText = 'width: 40px; height: 40px; object-fit: contain;';
            button.appendChild(img);

            const quantityDeleteContainer = document.createElement('div');
            quantityDeleteContainer.style.cssText = 'display: flex; justify-content: space-between; width: 100%; margin-top: 5px;';

            const qtySpan = document.createElement('span');
            qtySpan.textContent = quantity;
            qtySpan.style.cssText = 'color: #fff;';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.style.cssText = `
            background-color: red;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
        `;

            deleteBtn.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();

                button.remove();
                removeFromLocalStorage(itemId, npcId, quantity);
            };


            quantityDeleteContainer.appendChild(qtySpan);
            quantityDeleteContainer.appendChild(deleteBtn);
            button.appendChild(quantityDeleteContainer);

            const npcNameLabel = document.createElement('span');
            npcNameLabel.textContent = NPCnames[npcId];
            npcNameLabel.style.cssText = 'color: #fff; margin-top: 5px;';
            button.appendChild(npcNameLabel);

            button.setAttribute('data-item', itemId);
            button.setAttribute('data-npc', npcId);
            button.setAttribute('data-quantity', quantity);

            buttonsContent.appendChild(button);
            saveToLocalStorage(itemId, npcId, quantity);
        }

        function saveToLocalStorage(itemId, npcId, quantity) {
            let buttonsData = JSON.parse(localStorage.getItem('createdButtons')) || [];
            buttonsData.push({ itemId, npcId, quantity });
            localStorage.setItem('createdButtons', JSON.stringify(buttonsData));
        }

        function removeFromLocalStorage(itemId, npcId, quantity) {
            let buttonsData = JSON.parse(localStorage.getItem('createdButtons')) || [];
            buttonsData = buttonsData.filter(item => !(item.itemId === itemId && item.npcId === npcId && item.quantity === quantity));
            localStorage.setItem('createdButtons', JSON.stringify(buttonsData));
        }

        function loadButtonsFromLocalStorage() {
            const buttonsData = JSON.parse(localStorage.getItem('createdButtons')) || [];
            buttonsData.forEach(({ itemId, npcId, quantity }) => {
                const itemName = Object.keys(ITEMS).find(name => ITEMS[name][itemId]);
                const imageUrl = itemName ? ITEMS[itemName][itemId] : '/img/items/default.png';
                const buttonClass = `${itemId}${npcId}${quantity}`;

                if (!document.querySelector(`.${CSS.escape(buttonClass)}`)) {
                    createItemButton(itemId, npcId, quantity, imageUrl);
                }
            });
        }
        searchInput.addEventListener('input', () => {
            resultsBox.innerHTML = '';
            const query = searchInput.value.toLowerCase();
            if (!query) {
                resultsBox.style.display = 'none';
                return;
            }
            const matches = Object.entries(ITEMS).filter(([name]) => name.toLowerCase().includes(query));
            if (matches.length === 0) {
                resultsBox.style.display = 'none';
                return;
            }
            matches.forEach(([name, data]) => {
                const itemOption = document.createElement('div');
                itemOption.textContent = name;
                itemOption.style.cssText = 'padding:5px;cursor:pointer;background:#444;color:#fff;border-bottom:1px solid #555;';
                itemOption.addEventListener('click', () => {
                    selectedItem = { name, id: Object.keys(data)[0], image: data[Object.keys(data)[0]] };
                    searchInput.value = name;
                    resultsBox.style.display = 'none';
                });
                resultsBox.appendChild(itemOption);
            });
            resultsBox.style.display = 'block';
        });

        showButtonsButton.addEventListener('click', () => {
            const isVisible = buttonsContainer.style.display === 'block';
            buttonsContainer.style.display = isVisible ? 'none' : 'block';
            showButtonsButton.textContent = isVisible ? 'Show Buttons' : 'Hide Buttons';
        });

        createButton.addEventListener('click', () => {
            if (!selectedItem) return;
            const quantity = quantityInput.value || 1;
            const npcId = npcSelect.value;
            createItemButton(selectedItem.id, npcId, quantity, selectedItem.image);
            selectedItem = null; 
        });

        containerHeader.onmousedown = function(e) {
            e.preventDefault();
            let offsetX = e.clientX - buttonsContainer.offsetLeft;
            let offsetY = e.clientY - buttonsContainer.offsetTop;

            document.onmousemove = function(e) {
                buttonsContainer.style.left = e.clientX - offsetX + 'px';
                buttonsContainer.style.top = e.clientY - offsetY + 'px';
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        inputButtonContainer.appendChild(createButton);
        inputButtonContainer.appendChild(showButtonsButton);
        container.appendChild(searchInput);
        container.appendChild(resultsBox);
        container.appendChild(quantityInput);
        container.appendChild(npcSelect);
        container.appendChild(inputButtonContainer);
        element.appendChild(container);
        document.body.appendChild(buttonsContainer);

        loadButtonsFromLocalStorage();
    }


    let maxTries = 0;

    function init() {
        const targetElement = document.querySelector('.page > .page-content > .list-block');
        if (!targetElement) {
            if (maxTries < 25) {
                maxTries++;
                setTimeout(init, 500);
                return;
            }
        }
        else createUI(targetElement);
    }

    init();
})();
