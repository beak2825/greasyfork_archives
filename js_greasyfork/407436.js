// ==UserScript==
// @name         GGn Quick Crafter
// @namespace    http://tampermonkey.net/
// @version      2.2.2.k33
// @description  Craft multiple items easier
// @author       KingKrab23 with help from the community
// @match        https://gazellegames.net/user.php?action=crafting
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/407436/GGn%20Quick%20Crafter.user.js
// @updateURL https://update.greasyfork.org/scripts/407436/GGn%20Quick%20Crafter.meta.js
// ==/UserScript==


/* >>>BEGIN<<< User adjustable variables
 * ONLY ADJUST THESE IF YOU KNOW WHAT YOU'RE DOING
 * Too little of a delay will cause more bugs */

const BUTTON_LOCKOUT_DELAY = 1000;
const CRAFT_TIME = 1000;
const GRAB_TIME = 1;
const NEXT_CRAFT_TIME = 1;

/* >>>END<<< user adjustable variables */


var blankSlot = "EEEEE";
var slots = [];
slots[0] = blankSlot;
slots[1] = blankSlot;
slots[2] = blankSlot;
slots[3] = blankSlot;
slots[4] = blankSlot;
slots[5] = blankSlot;
slots[6] = blankSlot;
slots[7] = blankSlot;
slots[8] = blankSlot;


function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


function getSlots() {
    var combinedSlots = "";

    var i = 0;
    for (i = 0; i < slots.length; i++)
        combinedSlots += slots[i];

    return combinedSlots;
}


var authKey = getUrlVars(document.getElementsByTagName('link')[4].href).authkey;
var urlBase = "https://gazellegames.net/user.php?action=ajaxtakecraftingresult&recipe=CUSTOMRECIPE&auth=" + authKey;


/* Used for dynamic button lockouts (i.e.: multicraft) */
var next_button_lockout_delay = BUTTON_LOCKOUT_DELAY;


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.disabled { background-color: #333 !important; color: #666 !important; }';
document.getElementsByTagName('head')[0].appendChild(style);


function getElement(itemId) {
    return "#items-wrapper .item[data-item='" + itemId + "']";
}


function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}


var ingredients = {};
ingredients["glass shards"] = "01988";
ingredients["test tube"] = "00125";
ingredients["vial"] = "00124";
ingredients["bowl"] = "00126";
ingredients["pile of sand"] = "01987";
ingredients["black elder leaves"] = "00115";
ingredients["black elderberries"] = "00114";
ingredients["yellow hellebore flower"] = "00113";
ingredients["upload potion"] = "00099";
ingredients["purple angelica flowers"] = "00111";
ingredients["garlic tincture"] = "00127";
ingredients["download-reduction potion"] = "00106";
ingredients["head of garlic"] = "00112";
ingredients["bronze alloy mix"] = "02225";
ingredients["bronze bar"] = "02235";
ingredients["impure bronze bar"] = "02236";
ingredients["iron bar"] = "02237";
ingredients["steel bar"] = "02238";
ingredients["gold bar"] = "02239";
ingredients["mithril bar"] = "02240";
ingredients["adamantium bar"] = "02241";
ingredients["quartz bar"] = "02242";
ingredients["jade bar"] = "02243";
ingredients["amethyst bar"] = "02244";
ingredients["clay"] = "02234";
ingredients["iron ore"] = "02226";
ingredients["lump of coal"] = "02233";
ingredients["gold ore"] = "02227";
ingredients["adamantium ore"] = "02229";
ingredients["mithril ore"] = "02228";
ingredients["quartz dust"] = "02230";
ingredients["jade dust"] = "02231";
ingredients["amethyst dust"] = "02232";
ingredients["ruby-flecked wheat"] = "02579";
ingredients["emerald-flecked wheat"] = "02717";
ingredients["ruby-grained baguette"] = "02580";
ingredients["emerald-grained baguette"] = "02718";
ingredients["garlic ruby-baguette"] = "02581";
ingredients["garlic emerald-baguette"] = "02719";
ingredients["artisan emerald-baguette"] = "02720";
ingredients["emerald chip"] = "02551";
ingredients["ruby chip"] = "02550";
ingredients["sapphire chip"] = "02552";
ingredients["carbon-crystalline quartz"] = "02537";
ingredients["exquisite constellation of emeralds"] = "02565";
ingredients["exquisite constellation of sapphires"] = "02564";
ingredients["exquisite constellation of rubies"] = "02563";
ingredients["ruby"] = "02323";
ingredients["sapphire"] = "02549";
ingredients["emerald"] = "00116";
ingredients["dwarven gem"] = "02508";
ingredients["flux"] = "02653";
ingredients["tongs"] = "02627";

// Cards
ingredients["Bowser"] = "02395";
ingredients["Goomba"] = "02396";
ingredients["Koopa Troopa"] = "02397";
ingredients["Luigi"] = "02391";
ingredients["Mario"] = "02390";
ingredients["Princess Peach"] = "02392";
ingredients["Toad"] = "02393";
ingredients["Wario"] = "02398";
ingredients["Yoshi"] = "02394";
ingredients["Fire Flower"] = "02402";
ingredients["Penguin Suit"] = "02403";
ingredients["Super Mushroom"] = "02401";
ingredients["Goal Pole"] = "02404";
ingredients["A Scared Morty"] = "02377";
ingredients["Cake"] = "02373";
ingredients["Chimera Schematic"] = "02382";
ingredients["Companion Cube"] = "02375";
ingredients["Covetor Mining Ship"] = "02383";
ingredients["GLaDOS"] = "02374";
ingredients["Mr Poopy Butthole"] = "02379";
ingredients["Nyx class Supercarrier"] = "02381";
ingredients["Rick Sanchez"] = "02378";
ingredients["Portal Gun"] = "02376";
ingredients["Ricks Portal Gun"] = "02380";
ingredients["Space Wormhole"] = "02384";
ingredients["Interdimensional Portal"] = "02385";
ingredients["A Red Hot Flamed"] = "02359";
ingredients["A Wild Artifaxx"] = "02358";
ingredients["Alpaca Out of Nowhere!"] = "02361";
ingredients["lepik le prick"] = "02368";
ingredients["LinkinsRepeater Bone Hard Card"] = "02400";
ingredients["MuffledSilence's Headphones"] = "02388";
ingredients["Neos Ratio Cheats"] = "02366";
ingredients["Nikos Transformation"] = "02367";
ingredients["Stump's Banhammer"] = "02365";
ingredients["The Golden Daedy"] = "02357";
ingredients["thewhales Kiss"] = "02364";
ingredients["Ze do Caixao Coffin Joe Card"] = "02410";
ingredients["Random Staff Card"] = "02438";
ingredients["The Golden Throne"] = "02369";
ingredients["Staff Beauty Parlor"] = "02371";
ingredients["Biggest Banhammer"] = "02370";
ingredients["Realm of Staff"] = "02372";

// Adventure Club
ingredients["glowing leaves"] = "02844";
ingredients["glowing ash"] = "02892";
ingredients["condensed light"] = "02841";
ingredients["bottled ghost"] = "02842";
ingredients["hide"] = "02816";
ingredients["advanced hide"] = "02894";
ingredients["cloth"] = "02814";
ingredients["scrap"] = "02813";
ingredients["troll tooth"] = "02893";

// Xmas
ingredients["Cyberpunk 2077"] = "03105";
ingredients["Watch Dogs Legion"] = "03106";
ingredients["Dirt 5"] = "03107";
ingredients["Genshin Impact"] = "03108";
ingredients["Animal Crossing"] = "03109";
ingredients["Gazelle"] = "03110";
ingredients["Mafia"] = "03111";
ingredients["Red Crewmate Bauble"] = "03113";
ingredients["Green Crewmate Bauble"] = "03114";
ingredients["Cyan Crewmate Bauble"] = "03115";
ingredients["Broken Bauble Fragment"] = "03119";
ingredients["Wilted Four-Leaves Holly"] = "03120";
ingredients["pile of snow"] = "02295";
ingredients["snowball"] = "02296";
ingredients["large snowball"] = "02305";
ingredients["candy cane"] = "02297";
ingredients["hot chocolate"] = "02298";
ingredients["pile of charcoal"] = "02300";
ingredients["carrot"] = "02306";
ingredients["christmas spices"] = "02688";
ingredients["old scarf & hat"] = "02689";
ingredients["Perfect Snowball"] = "02698";
ingredients["Mistletoe"] = "02699";
ingredients["Santa Suit"] = "02700";
ingredients["Abominable Santa"] = "02701";
ingredients["Icy Kisses"] = "02702";
ingredients["Sexy Santa"] = "02703";
ingredients["Christmas Cheer"] = "02704";
ingredients["Gingerbread Kitana"] = "02969";
ingredients["Gingerbread Marston"] = "02970";
ingredients["Gingerbread Doomslayer"] = "02972";
ingredients["Millenium Falcon Gingerbread"] = "02973";
ingredients["Gingerbread AT Walker"] = "02974";
ingredients["Mario Christmas"] = "02975";
ingredients["Baby Yoda With Gingerbread"] = "02976";
ingredients["snowman cookie"] = "03313";
ingredients["snowflake"] = "03325";
ingredients["penguin snowglobe"] = "03326";
ingredients["owl snowglobe"] = "03327";
ingredients["Santa Claus Is Out There"] = "03328";
ingredients["Back to the Future"] = "03329";
ingredients["Big Lebowski"] = "03330";
ingredients["Picard"] = "03331";
ingredients["Braveheart"] = "03332";
ingredients["Indy"] = "03333";
ingredients["Gremlins"] = "03334";
ingredients["Die Hard"] = "03335";
ingredients["Jurassic Park"] = "03336";
ingredients["Mando"] = "03338";
ingredients["Doomguy"] = "03339";
ingredients["Grievous"] = "03340";
ingredients["Have a Breathtaking Christmas"] = "03341";


// Birthday
ingredients["lick badge bits"] = "02826";
ingredients["Ripped Gazelle"] = "02829";
ingredients["Fancy Gazelle"] = "02830";
ingredients["Gamer Gazelle"] = "02831";
ingredients["Future Gazelle"] = "02833";
ingredients["Alien Gazelle"] = "02834";
ingredients["Lucky Gazelle"] = "02835";
ingredients["Supreme Gazelle"] = "02836";
ingredients["Exodus Truce"] = "03023";
ingredients["Gazelle Breaking Bad"] = "03024";
ingredients["A Fair Fight"] = "03025";
ingredients["Home Sweet Home"] = "03026";
ingredients["Birthday Battle Kart"] = "03027";
ingredients["What an Adventure"] = "03028";
ingredients["After Party"] = "03029";
ingredients["birthday leaves"] = "03031";
ingredients["Bill Rizer"] = "03151";
ingredients["Donkey Kong"] = "03152";
ingredients["Duck Hunt Dog"] = "03153";
ingredients["Dr Mario"] = "03154";
ingredients["Pit"] = "03155";
ingredients["Little Mac"] = "03156";
ingredients["Mega Man"] = "03157";
ingredients["Link"] = "03158";
ingredients["Pac-Man"] = "03159";
ingredients["Samus Aran"] = "03160";
ingredients["Simon Belmont"] = "03161";
ingredients["Kirby"] = "03162";
ingredients["Black Mage"] = "03163";
ingredients["party pipe badge bit"] = "03166";
ingredients["slice of birthday cake"] = "03379";
ingredients["golden egg"] = "03384";

//Valentine
ingredients["Valentine sugar heart"] = "03000";
ingredients["Valentine chocolate heart"] = "03001";
ingredients["Sonic and Amy"] = "02986";
ingredients["Yoshi and Birdo"] = "02987";
ingredients["Kirlia and Meloetta"] = "02988";
ingredients["Aerith and Cloud"] = "02989";
ingredients["Master Chief and Cortana"] = "02990";
ingredients["Dom and Maria"] = "02991";
ingredients["Mr and Mrs Pac Man"] = "02992";
ingredients["Chainsaw Chess"] = "02993";
ingredients["Chainsaw Wizard"] = "02994";
ingredients["Angelise Reiter"] = "02995";
ingredients["Ivy Valentine"] = "02996";
ingredients["Jill Valentine"] = "02997";
ingredients["Sophitia"] = "02998";
ingredients["Yennefer"] = "02999";
ingredients["Valentine rose"] = "03002";
ingredients["Symbol of love"] = "03143";
ingredients["Old worn boots"] = "03144";
ingredients["Cupids magical feather"] = "03145";
ingredients["rose petals"] = "03359";

//Dwarven
ingredients["abandoned dwarven helmet"] = "03207";
ingredients["abandoned dwarven cuirass"] = "03208";
ingredients["abandoned dwarven gloves"] = "03209";
ingredients["abandoned dwarven boots"] = "03210";
ingredients["abandoned dwarven axe"] = "03211";
ingredients["milk"] = "03218";
ingredients["cherries"] = "03219";
ingredients["grapes"] = "03220";
ingredients["coconuts"] = "03221";
ingredients["marshmallows"] = "03222";
ingredients["cocoa beans"] = "03223";
ingredients["vanilla pods"] = "03224";
ingredients["strawberries"] = "03225";
ingredients["cinnamon"] = "03241";

//Halloween
ingredients["Ripe Pumpkin"] = "02589";
ingredients["Rotting Pumpkin"] = "02590";
ingredients["Carved Pumpkin"] = "02591";
ingredients["Stormrage Pumpkin"] = "02592";
ingredients["Russian Pumpkin"] = "02593";
ingredients["Green Mario Pumpkin"] = "02594";
ingredients["Lame Pumpkin Trio"] = "02595";
ingredients["pumpkin badge bits"] = "02600";
ingredients["Bloody Mario"] = "02945";
ingredients["Mommys Recipe"] = "02946";
ingredients["Memory Boost"] = "02947";
ingredients["Link Was Here"] = "02948";
ingredients["Gohma Sees You"] = "02949";
ingredients["Skultilla The Cake Guard"] = "02950";
ingredients["Who Eats Whom"] = "02951";
ingredients["cupcake crumbles"] = "02952";
ingredients["Blinky"] = "03263";
ingredients["Clyde"] = "03265";
ingredients["Pinky"] = "03266";
ingredients["Inky"] = "03267";
ingredients["Ghostbusters"] = "03268";
ingredients["Boo"] = "03269";
ingredients["King Boo"] = "03270";
ingredients["haunted tombstone shard"] = "03281";
ingredients["snowman"] = "02307";

//Bling
ingredients["green onyx gem"] = "00120";
ingredients["flawless amethyst"] = "00121";
ingredients["Farores flame"] = "02153";
ingredients["Nayrus flame"] = "02154";
ingredients["Dins flame"] = "02155";
ingredients["irc voice 2w"] = "00072";
ingredients["irc voice 2w - low cost"] = "00175";
ingredients["irc voice 8w"] = "02212";

var non_ingredients = {};
non_ingredients["2x glass shards"] = "2436";
non_ingredients["3x glass shards"] = "2437";
non_ingredients["upload potion sampler"] = "66";
non_ingredients["small upload potion"] = "98";
non_ingredients["large upload potion"] = "100";
non_ingredients["download-reduction potion sampler"] = "104";
non_ingredients["small download-reduction potion"] = "105";
non_ingredients["large download-reduction potion"] = "107";
non_ingredients["small luck potion"] = "2433";
non_ingredients["large luck potion"] = "2434";
non_ingredients["artisan ruby-baguette"] = "2582";
non_ingredients["gazellian emerald-baguette"] = "2721";
non_ingredients["2x bronze alloy mix"] = "2666";
non_ingredients["2x iron ore"] = "2668";
non_ingredients["2x gold ore"] = "2670";
non_ingredients["2x mithril ore"] = "2671";
non_ingredients["2x adamantium ore"] = "2672";
non_ingredients["2x quartz dust"] = "2673";
non_ingredients["2x jade dust"] = "2675";
non_ingredients["2x amethyst dust"] = "2676";
non_ingredients["random lvl2 staff card"] = "2438";
non_ingredients["Christmas Bauble Badge"] = "3112";
non_ingredients["Christmas Impostor Bauble"] = "3117";
non_ingredients["lucky four-leaves holly"] = "3121";
non_ingredients["peppermint hot chocolate"] = "2299";
non_ingredients["hyper realistic eggnog"] = "2303";
non_ingredients["cant believe this is cherry"] = "2822";
non_ingredients["grape milkshake"] = "3226";
non_ingredients["coco-cooler milkshake"] = "3227";
non_ingredients["cinnamon milkshake"] = "3228";
non_ingredients["rocky road milkshake"] = "3229";
non_ingredients["neapolitan milkshake"] = "3230";
non_ingredients["special box"] = "3004";
// non_ingredients[""] = "";




async function get_trade_inv() {
    return($.ajax({ url: 'https://gazellegames.net/user.php?action=trade&userid=0', success: function(data) { return(data); } }))
    };


function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function reset_slots() {
    slots[0] = blankSlot;
    slots[1] = blankSlot;
    slots[2] = blankSlot;
    slots[3] = blankSlot;
    slots[4] = blankSlot;
    slots[5] = blankSlot;
    slots[6] = blankSlot;
    slots[7] = blankSlot;
    slots[8] = blankSlot;
}


function take_craft(craft_name) {
    $.get(urlBase.replace("CUSTOMRECIPE", getSlots()), function( data ) {
        console.log(data);
        console.log(data.EquipID);

        if (data === "{}" || data.EquipId !== "") {
            noty({type:'success', text: craft_name + ' was crafted successfully.'});
        } else {
            noty({type:'error', text: craft_name + ' failed.'});
            alert('Crafting failed. Response from server: ', data)
        }
    });
}


function disable_quick_craft_buttons() {
    $("#crafting-submenu button").prop("disabled",true);
    $("#crafting-submenu button").addClass("disabled");
}


function enable_quick_craft_buttons() {
    setTimeout(function() {
        $("#crafting-submenu button").prop("disabled",false);
        $("#crafting-submenu button").removeClass("disabled");

        disable_craft_button = false;

        next_button_lockout_delay = BUTTON_LOCKOUT_DELAY;
    }, next_button_lockout_delay);
}


var disable_craft_button = false;

var ingredients_available = [];

function open_crafting_submenu(craft_name, recipe, result) {
    close_crafting_submenu();
    $("#current_craft_box").append('<div id="crafting-submenu" style="text-align:center"></div>');

    var currentCraft = {};
    currentCraft.available = 10000
    currentCraft.ingredients = [];
    if (result === undefined) {result = craft_name};
    if (ingredients_available[result] === undefined) {
        if (ingredients[result] != undefined) {
            var resavail = $("#items-wrapper .item[data-item=" + ingredients[result] + "] .item_count").text();
            if (resavail === "") { resavail = $("#items-wrapper .item[data-item=" + ingredients[result] + "]").length; }}
        else if (non_ingredients[result] != undefined) {
            resavail = occurrences(window.tradinv, "data-item='" + non_ingredients[result] + "'")}
            ingredients_available[result] = resavail
        };



    $("#crafting-submenu").append('<span>' + titleCase(result) + '</span>');
    if (ingredients_available[result] != undefined) {$("#crafting-submenu").append('<span> (' + ingredients_available[result] + ' in inventory)</span>')};
    $("#crafting-submenu").append('<br /><br />');

    for (var i = 0; i < recipe.length/2; i++) {
        var ingr = recipe[2*i];
        var qty = recipe[2*i+1].length;
        if (ingredients_available[ingr] != undefined) {var onhand = ingredients_available[ingr]}
        else {onhand = $("#items-wrapper .item[data-item=" + ingredients[ingr] + "] .item_count").text()};
        if (onhand === "") { onhand = $("#items-wrapper .item[data-item=" + ingredients[ingr] + "]").length; };
        ingredients_available[ingr] = onhand;
        var avail = Math.floor(onhand/qty);
        if (avail < currentCraft.available) {currentCraft.available = avail};
        currentCraft.ingredients[i]={ name: ingr, id: ingredients[ingr], qty: qty, "on hand": onhand }};
    currentCraft.icon = "http://test.test";

    $("#crafting-submenu").append('<p> Ingredients: </p>');


        class Shop_button {
        constructor(ingred) {
            $("#crafting-submenu").append('<button style="border-radius:50%;background-color:yellow;color:black;cursor:pointer" id="Sb_' + ingred + '" class="quick_craft_button">$</button>');
            $("#Sb_"+ ingred).click(() => {
                window.open("https://gazellegames.net/shop.php?ItemID="+ingred.replace(/^0+/g, ''), '_blank');
            });
        }
    }

    currentCraft.ingredients.map(ingredient => {
        new Shop_button(ingredients[ingredient.name]);
        if ($("#NHHN")[0].checked) {
            $("#crafting-submenu").append('<p style="display: inline">'
                                      + titleCase(ingredient.name) + ': ' + ingredient["on hand"] + '/' + ingredient.qty + '</p>');
        }
        else {

        $("#crafting-submenu").append('<p style="display: inline">'
                                      + titleCase(ingredient.name) + ': ' + ingredient.qty + '/' + ingredient["on hand"] + '</p>');
        }
        $("#crafting-submenu").append('<br />');
    });
    $("#crafting-submenu").append('<br /> Max possible craft(s): ' + currentCraft.available + '<br /><br />');

    if (currentCraft.available > 0) {
        $("#crafting-submenu").append('<select id="craft_number_select">');

        for (i = 1; i <= currentCraft.available; i++) {
            $("#craft_number_select").append("<option value='" + i + "'>" + i + "</option>");
        }

        $("#crafting-submenu").append('</select>');

        var craftButton = $("<button>");
        craftButton.on("click", async function() {
            var craftNumber = $("#craft_number_select").children("option:selected").val();

            disable_craft_button = true;

            next_button_lockout_delay = BUTTON_LOCKOUT_DELAY * Number(craftNumber);

            disable_quick_craft_buttons();
            enable_quick_craft_buttons();

            await (async function loop() {
                for (let i = 0; i < craftNumber; i++) {
                    await new Promise(resolve => setTimeout(function() {
                        reset_slots();
                        for (var j = 0; j < recipe.length/2; j++) {
                            var ingr = recipe[2*j];
                            for (var k = 0; k < recipe[2*j+1].length; k++) {
                                slots[recipe[2*j+1][k]] = ingredients[ingr];
                                ingredients_available[ingr]--;
                            }}
                        take_craft(craft_name);
                        if (ingredients_available[result] != undefined) {ingredients_available[result]++};
                        resolve();
                    }, CRAFT_TIME));
                }
            })();
            open_crafting_submenu(craft_name, recipe, result)
        });

        craftButton.html('Craft');
        craftButton.prop('style', 'margin-left: 5px');

        $("#crafting-submenu").append(craftButton);
        $("#crafting-submenu").append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        '&nbsp;'
        $("#crafting-submenu").append('<button style="margin-top:3px;margin-right:5px;background-color: orange;" id="craftmax_button" class="quick_craft_button">Craft maximum</button>');

        $("#craftmax_button").click(function() {
            if ($("#craftmax_button")[0].innerText === "Craft maximum") {
                $("#craft_number_select")[0].value = currentCraft.available
                $("#craftmax_button")[0].innerText = "** CONFIRM **"
                $("#craftmax_button")[0].style.backgroundColor = "red"}
            else {
                if ($("#craftmax_button")[0].innerText === "** CONFIRM **"){
                    $("#craftmax_button")[0].innerText = "-- crafting -"
                    craftButton.click()
                }
            }
        });


        $("#crafting-submenu").append('<br /><br />');

        if (disable_craft_button === true) {
            disable_quick_craft_buttons();
        }
    }
}


function close_crafting_submenu() {
    $("#crafting-submenu").remove();
}







(async function() {
    'use strict';

    window.tradinv = await get_trade_inv();


    $("#crafting_recipes").before(
        '<div id="quick-crafter" style="border: 1px solid #fff;margin-bottom: 17px;display: block;clear: both;position:relative;background-color:rgba(0,0,0,.7);padding:5px;"></div>');

    const button_opacity = [0.2,1];
    const button_display = ["none","inline"];

// Creates a "Recipe Book" on/off button; bgcolor and tcolor are the background and text colors of the associated Recipe (craft) buttons

    var BOOKS = [];
    class Book_button {
        constructor(book_name, bgcolor, tcolor) {
            BOOKS[BOOKS.length] = book_name;
            BOOKS[BOOKS.length] = 1;
            $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color:' + bgcolor +';color:' + tcolor + '" id="' + book_name + '" class="qcbutton_book">'+ book_name.replace(/_/g," ") +'</button>');
            document.getElementById(book_name).enabled = 1 ;
            document.getElementById(book_name).style.opacity=button_opacity[1];
            document.getElementById(book_name).bgcolor = bgcolor;
            document.getElementById(book_name).tcolor = tcolor;
            $("#"+ book_name).click(() => {
                document.getElementById(book_name).enabled = 1 - document.getElementById(book_name).enabled ;
                document.getElementById(book_name).style.opacity=button_opacity[document.getElementById(book_name).enabled];
                var buttons = document.getElementsByClassName("qcbutton_" + book_name);
                for (var i = 0; i < buttons.length; i++) {buttons[i].style.display = button_display[document.getElementById(book_name).enabled]};
            });
        }
    }





/* Creates a Recipe button.
     book_name is the name of the associated Recipe Book and Separator buttons (which impacts the colors and on/off ability)                Slots: 0 1 2
     recipe is, well, the recipe, the format being ["ingredient1", [slot1, slot2, ...], ... ]                                                      3 4 5
     result (optional) is the name of the item created by the recipe; used as title of the crafting box, and                                       6 7 8
                       in dynamic counting (only if it's an ingredient); not necessary if it's the same as the name
                       of the recipe, with "_" replaced with " ".
*/
        class Recipe_button {
        constructor(book_name, recipe_name, recipe, result) {
            this.recipe = recipe;
            this.result = result;
            $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px" id="' + recipe_name + '" class="rbfocus qcbutton_' + book_name + '">'+ titleCase(recipe_name.replace(/_/g," ")) +'</button>');
            document.getElementById(recipe_name).style.backgroundColor = document.getElementById(book_name).bgcolor;
            document.getElementById(recipe_name).style.color = document.getElementById(book_name).tcolor;
            document.getElementById(recipe_name).style.display = button_display[document.getElementById(book_name).enabled];
            $( "#" + recipe_name ).focus(function() {document.getElementById(recipe_name).style.border = "2px solid red";});
            $( "#" + recipe_name ).blur(function() {document.getElementById(recipe_name).style.border = "";});
            $("#"+ recipe_name).click(() => {
                open_crafting_submenu(recipe_name.replace(/_/g," "),this.recipe, this.result);
            });
        }
    }

/* Creates a line return, to better organize recipes within a book.
     the last separator for a book should have the number 0, because of oldbcguser :)
*/

            class Separator {
        constructor(book_name, number) {
            var seg = "<br />";
            if ($("#Segregate")[0].checked && number==0) {seg += "<br />"};
            $("#quick-crafter").append('<span id="Sep' + book_name + number + '" class="qcbutton_' + book_name + '">' + seg + '</span>');
            document.getElementById("Sep" + book_name + number).style.display = button_display[document.getElementById(book_name).enabled]}
            }




    $("#quick-crafter").append('<div id="current_craft_box"></div>');
    $("#quick-crafter").append('<p>Having trouble? Try refreshing if it seems stuck. Turn off this script before manual crafting for a better experience.');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: red;" id="clear_button" class="quick_craft_button">Clear</button>');
    $("#quick-crafter").append('<br /> <br />');

    $("#quick-crafter").append('<span>Click on the buttons below to show or hide crafting categories - </span>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: red;" id="Hide_All" class="quick_craft_button">Hide all</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: green;" id="Show_All" class="quick_craft_button">Show all</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: blue;" id="Save_Books" class="quick_craft_button">Save current config</button>');
    $("#quick-crafter").append('<input type="checkbox" id="Segregate" class="quick_craft_button">Blank line between books (needs refresh)</input>');
    $("#quick-crafter").append('<input type="checkbox" id="NHHN" class="quick_craft_button" title="Switches between needed/have and have/needed">NH switch</input>');
    $("#quick-crafter").append('<br />');

    $("#Segregate")[0].checked = GM_getValue("SEG", false)
    $("#NHHN")[0].checked = GM_getValue("NHswitch", false)

    new Book_button("Glass", "white", "black");
    new Book_button("Potions", "green", "white");
//    new Book_button("Luck", "blue", "white");
    new Book_button("Food", "wheat", "black");
    new Book_button("Dwarven", "brown", "beige");
    new Book_button("Material_Bars", "purple", "white");
    new Book_button("Armor", "darkblue", "white");
    new Book_button("Weapon", "darkred", "white");
    new Book_button("Recast", "gray", "white");
    new Book_button("Jewelry", "deeppink", "white");
    new Book_button("Bling", "gold", "silver");
    new Book_button("Trading_Decks", "#15273F", "white");
    new Book_button("Xmas_Crafting", "red", "lightgreen");
    new Book_button("Birthday", "dark", "gold");
    new Book_button("Valentine", "pink", "deeppink");
    new Book_button("AC", "yellow", "black");
    new Book_button("Halloween", "gray", "black");


    var TEMP_BOOKS = GM_getValue("BOOKS_SAVE", BOOKS);
    if (TEMP_BOOKS.length == BOOKS.length){BOOKS = TEMP_BOOKS};

    for (var i = 0; i < BOOKS.length/2; i++) {if (BOOKS[2*i+1] === 0) {$("#" + BOOKS[2*i]).click()}};

    $("#Hide_All").click(function() {
        for (var i = 0; i < BOOKS.length/2; i++) {if (document.getElementById(BOOKS[2*i]).enabled === 1) {$("#" + BOOKS[2*i]).click()}};
    });

    $("#Show_All").click(function() {
        for (var i = 0; i < BOOKS.length/2; i++) {if (document.getElementById(BOOKS[2*i]).enabled === 0) {$("#" + BOOKS[2*i]).click()}};
    });

    $("#Save_Books").click(function() {
        for (var i = 0; i < BOOKS.length/2; i++) {BOOKS[2*i+1] = document.getElementById(BOOKS[2*i]).enabled};
        GM_setValue("BOOKS_SAVE", BOOKS);
        alert("Config saved");
    });

    $("#Segregate").click(function() {
        GM_setValue("SEG", $("#Segregate")[0].checked);
    });

    $("#NHHN").click(function() {
        GM_setValue("NHswitch", $("#NHHN")[0].checked);
    });


    $("#quick-crafter").append('<br /> <br /> <br />');

    new Recipe_button("Glass", "glass_shards_from_sand", ["pile of sand", [4]], "glass shards");
    new Recipe_button("Glass", "glass_shards_from_test_tube",["test tube", [4]], "glass shards");
    new Recipe_button("Glass", "glass_shards_from_vial",["vial", [4]], "2x glass shards");
    new Recipe_button("Glass", "glass_shards_from_bowl",["bowl", [4]], "3x glass shards");
    new Separator("Glass", 1);
    new Recipe_button("Glass", "test_tube", ["glass shards", [1,4]]);
    new Recipe_button("Glass", "vial", ["glass shards", [1,3,4,6,7]]);
    new Recipe_button("Glass", "bowl", ["glass shards", [0,1,2,3,5,6,7,8]]);
    new Recipe_button("Glass", "dust_ore_vial", ["pile of sand", [4], "quartz dust", [7]], "vial");
    new Recipe_button("Glass", "dust_ore_bowl", ["pile of sand", [4], "jade dust", [7]], "bowl");
    new Separator("Glass", 0);

    new Recipe_button("Potions", "upload_potion_sampler", ["test tube", [4], "black elderberries", [5], "black elder leaves", [2]]);
    new Recipe_button("Potions", "small_upload_potion", ["vial", [4], "black elder leaves", [2,8], "black elderberries", [5]]);
    new Recipe_button("Potions", "upload_potion", ["vial", [4], "black elder leaves", [0,2,3,6,8], "black elderberries", [5]]);
    new Recipe_button("Potions", "large_upload_potion", ["bowl", [4], "upload potion", [3,5], "yellow hellebore flower", [1]]);
    new Separator("Potions", 1);
    new Recipe_button("Potions", "download-reduction_potion_sampler", ["test tube", [4], "garlic tincture", [5], "purple angelica flowers", [2]]);
    new Recipe_button("Potions", "small_download-reduction_potion", ["vial", [4], "purple angelica flowers", [2,8], "garlic tincture", [5]]);
    new Recipe_button("Potions", "download-reduction_potion", ["vial", [4], "purple angelica flowers", [0,2,3,6,8], "garlic tincture", [5]]);
    new Recipe_button("Potions", "large_download-reduction_potion", ["bowl", [4], "download-reduction potion", [3,5], "yellow hellebore flower", [1]]);
    new Recipe_button("Potions", "garlic_tincture", ["test tube", [4], "head of garlic", [5]]);
    new Separator("Potions", 2);
    new Recipe_button("Potions", "small_luck_potion", ["vial", [3], "black elderberries", [4,5]]);
    new Recipe_button("Potions", "large_luck_potion", ["bowl", [4], "black elderberries", [0,1,2,3,5], "yellow hellebore flower", [7]]);
    new Separator("Potions", 0);

    new Recipe_button("Food", "ruby-grained_baguette", ["ruby-flecked wheat", [4,5]]);
    new Recipe_button("Food", "garlic_ruby-baguette", ["ruby-grained baguette", [4], "head of garlic", [3,5]]);
    new Recipe_button("Food", "artisan_ruby-baguette", ["garlic ruby-baguette", [3], "yellow hellebore flower", [4,5]]);
    new Separator("Food", 1);
    new Recipe_button("Food", "emerald-grained_baguette", ["emerald-flecked wheat", [4,5]]);
    new Recipe_button("Food", "garlic_emerald-baguette", ["emerald-grained baguette", [4], "head of garlic", [5]]);
    new Recipe_button("Food", "artisan_emerald-baguette", ["garlic emerald-baguette", [3], "emerald chip", [4], "yellow hellebore flower", [5]]);
    new Recipe_button("Food", "gazellian_emerald-baguette", ["artisan emerald-baguette", [3], "emerald chip", [4,5]]);
    new Separator("Food", 0);

    new Recipe_button("Dwarven", "cant_believe_this_is_cherry", ["milk", [0], "pile of snow", [1], "cherries", [2], "glass shards", [6,7,8]]);
    new Recipe_button("Dwarven", "grape_milkshake", ["milk", [0], "pile of snow", [1], "grapes", [2], "glass shards", [6,7,8]]);
    new Recipe_button("Dwarven", "coco-cooler_milkshake", ["milk", [0], "pile of snow", [1], "coconuts", [2], "glass shards", [6,7,8]]);
    new Recipe_button("Dwarven", "cinnamon_milkshake", ["milk", [0], "pile of snow", [1], "cinnamon", [2], "glass shards", [6,7,8]]);
    new Recipe_button("Dwarven", "rocky_road_milkshake", ["milk", [0], "pile of snow", [1], "cocoa beans", [3], "marshmallows", [4], "glass shards", [6,7,8]]);
    new Recipe_button("Dwarven", "neapolitan_milkshake", ["milk", [0], "pile of snow", [1], "cocoa beans", [3], "vanilla pods", [4], "strawberries", [5], "glass shards", [6,7,8]]);
    new Separator("Dwarven", 0);

    new Recipe_button("Material_Bars", "impure_bronze_bar", ["bronze alloy mix", [0], "clay", [1]]);
    new Recipe_button("Material_Bars", "bronze_bar", ["bronze alloy mix", [0,1]]);
    new Recipe_button("Material_Bars", "iron_bar", ["iron ore", [0,1]], "iron bar");
    new Recipe_button("Material_Bars", "steel_bar", ["iron ore", [0,1], "lump of coal", [4]]);
    new Recipe_button("Material_Bars", "steel_bar_from_iron_bar", ["iron bar", [1], "lump of coal", [4]], "steel bar");
    new Recipe_button("Material_Bars", "gold_bar", ["gold ore", [0,1]]);
    new Recipe_button("Material_Bars", "mithril_bar", ["mithril ore", [0,1]]);
    new Recipe_button("Material_Bars", "adamantium_bar", ["adamantium ore", [0,1]]);
    new Recipe_button("Material_Bars", "quartz_bar", ["quartz dust", [0,1]]);
    new Recipe_button("Material_Bars", "jade_bar", ["jade dust", [0,1]]);
    new Recipe_button("Material_Bars", "amethyst_bar", ["amethyst dust", [0,1]]);
    new Separator("Material_Bars", 0);

    new Recipe_button("Armor", "impure_bronze_cuirass", ["impure bronze bar", [1,6]]);
    new Recipe_button("Armor", "bronze_cuirass", ["bronze bar", [1,6]]);
    new Recipe_button("Armor", "iron_cuirass", ["iron bar", [1,4,6,8]]);
    new Recipe_button("Armor", "steel_cuirass", ["steel bar", [1,4,6,8]]);
    new Recipe_button("Armor", "gold_cuirass", ["gold bar", [1,4,6,8]]);
    new Recipe_button("Armor", "mithril_cuirass", ["mithril bar", [1,4,6,7,8]]);
    new Recipe_button("Armor", "adamantium_cuirass", ["adamantium bar", [1,4,6,7,8]]);
    new Separator("Armor", 5);
    new Recipe_button("Armor", "quartz_chainmail", ["quartz bar", [1,6]]);
    new Recipe_button("Armor", "jade_chainmail", ["jade bar", [1,4,6,8]]);
    new Recipe_button("Armor", "amethyst_chainmail", ["amethyst bar", [1,4,6,7,8]]);
    new Separator("Armor", 4);
    new Recipe_button("Armor", "impure_bronze_segmentata", ["impure bronze bar", [1], "tongs", [7]]);
    new Recipe_button("Armor", "bronze_segmentata", ["bronze bar", [1], "tongs", [7]]);
    new Recipe_button("Armor", "iron_segmentata", ["iron bar", [1,4], "tongs", [7]]);
    new Recipe_button("Armor", "steel_segmentata", ["steel bar", [1,4], "tongs", [7]]);
    new Recipe_button("Armor", "gold_segmentata", ["gold bar", [1,4], "tongs", [7]]);
    new Recipe_button("Armor", "mithril_segmentata", ["mithril bar", [1,4], "tongs", [7]]);
    new Recipe_button("Armor", "adamantium_segmentata", ["adamantium bar", [1,4], "tongs", [7]]);
    new Separator("Armor", 3);
    new Recipe_button("Armor", "quartz_lamellar", ["quartz bar", [1], "tongs", [7]]);
    new Recipe_button("Armor", "jade_lamellar", ["jade bar", [1,4], "tongs", [7]]);
    new Recipe_button("Armor", "amethyst_lamellar", ["amethyst bar", [1,4], "tongs", [7]]);
    new Separator("Armor", 2);
    new Recipe_button("Armor", "impure_bronze_armguards", ["impure bronze bar", [1], "tongs", [6,8]]);
    new Recipe_button("Armor", "impure_bronze_power_gloves", ["impure bronze bar", [1], "tongs", [5], "ruby chip", [6]]);
    new Separator("Armor", 0);

    new Recipe_button("Weapon", "impure_bronze_claymore", ["impure bronze bar", [0,7]]);
    new Recipe_button("Weapon", "bronze_claymore", ["bronze bar", [0,7]]);
    new Recipe_button("Weapon", "iron_claymore", ["iron bar", [0,2,4,7]]);
    new Recipe_button("Weapon", "steel_claymore", ["steel bar", [0,2,4,7]]);
    new Recipe_button("Weapon", "gold_claymore", ["gold bar", [0,2,4,7]]);
    new Recipe_button("Weapon", "mithril_claymore", ["mithril bar", [0,1,2,4,7]]);
    new Recipe_button("Weapon", "adamantium_claymore", ["adamantium bar", [0,1,2,4,7]]);
    new Separator("Weapon", 2);
    new Recipe_button("Weapon", "quartz_khopesh", ["quartz bar", [0,7]]);
    new Recipe_button("Weapon", "jade_khopesh", ["jade bar", [0,2,4,7]]);
    new Recipe_button("Weapon", "amethyst_khopesh", ["amethyst bar", [0,1,2,4,7]]);
    new Separator("Weapon", 1);
    new Recipe_button("Weapon", "impure_bronze_billhook", ["tongs", [1], "impure bronze bar", [7]]);
    new Recipe_button("Weapon", "bronze_billhook", ["tongs", [1], "bronze bar", [7]]);
    new Recipe_button("Weapon", "iron_billhook", ["tongs", [1], "iron bar", [4,7]]);
    new Recipe_button("Weapon", "steel_billhook", ["tongs", [1], "steel bar", [4,7]]);
    new Recipe_button("Weapon", "gold_billhook", ["tongs", [1], "gold bar", [4,7]]);
    new Recipe_button("Weapon", "mithril_billhook", ["tongs", [1], "mithril bar", [4,7]]);
    new Recipe_button("Weapon", "adamantium_billhook", ["tongs", [1], "adamantium bar", [4,7]]);
    new Separator("Weapon", 3);
    new Recipe_button("Weapon", "quartz_guandao", ["tongs", [1], "quartz bar", [7]]);
    new Recipe_button("Weapon", "jade_guandao", ["tongs", [1], "jade bar", [4,7]]);
    new Recipe_button("Weapon", "amethyst_guandao", ["tongs", [1], "amethyst bar", [4,7]]);
    new Separator("Weapon", 0);

    new Recipe_button("Recast", "impure_bronze_bar_to_ore", ["impure bronze bar", [4], "flux", [3,5]], "bronze alloy mix");
    new Recipe_button("Recast", "bronze_bar_to_ore", ["bronze bar", [4], "flux", [3,5]], "2x bronze alloy mix");
    new Recipe_button("Recast", "iron_bar_to_ore", ["iron bar", [4], "flux", [3,5]], "2x iron ore");
    new Recipe_button("Recast", "steel_bar_to_ore", ["steel bar", [4], "flux", [3,5]], "2x iron ore");
    new Recipe_button("Recast", "gold_bar_to_ore", ["gold bar", [4], "flux", [3,5]], "2x gold ore");
    new Recipe_button("Recast", "mithril_bar_to_ore", ["mithril bar", [4], "flux", [3,5]], "2x mithril ore");
    new Recipe_button("Recast", "adamantium_bar_to_ore", ["adamantium bar", [4], "flux", [3,5]], "2x adamantium ore");
    new Separator("Recast", 1);
    new Recipe_button("Recast", "quartz_bar_to_dust", ["quartz bar", [4], "flux", [3,5]], "2x quartz dust");
    new Recipe_button("Recast", "jade_bar_to_dust", ["jade bar", [4], "flux", [3,5]], "2x jade dust");
    new Recipe_button("Recast", "amethyst_bar_to_dust", ["amethyst bar", [4], "flux", [3,5]], "2x amethyst dust");
    new Recipe_button("Recast", "downgrade_bronze_bar", ["bronze bar", [4], "flux", [7], "clay", [3,5]], "2x impure bronze bar");
    new Recipe_button("Recast", "downgrade_steel_bar", ["steel bar", [4], "flux", [7]], "iron bar");
    new Recipe_button("Recast", "melt_dwarven_gem", ["dwarven gem", [4], "flux", [7]], "pile of sand");
    new Separator("Recast", 0);

    new Recipe_button("Jewelry", "carbon-crystalline_quartz", ["quartz bar", [4], "lump of coal", [5]]);
    new Recipe_button("Jewelry", "carbon-crystalline_quartz_necklace", ["carbon-crystalline quartz", [4], "glass shards", [1]]);
    new Recipe_button("Jewelry", "exquisite_constellation_of_emeralds", ["emerald", [3,5,6,8], "amethyst bar", [4,7]]);
    new Recipe_button("Jewelry", "exquisite_constellation_of_sapphires", ["sapphire", [3,5,6,8], "amethyst bar", [4,7]]);
    new Recipe_button("Jewelry", "exquisite_constellation_of_rubies", ["ruby", [3,5,6,8], "amethyst bar", [4,7]]);
    new Separator("Jewelry", 0);

    new Recipe_button("Trading_Decks", "The_Golden_Throne", ["A Wild Artifaxx", [3], "A Red Hot Flamed", [4], "The Golden Daedy", [5]]);
    new Recipe_button("Trading_Decks", "Biggest_Banhammer", ["Stump's Banhammer", [3], "thewhales Kiss", [4], "Neos Ratio Cheats", [5]]);
    new Recipe_button("Trading_Decks", "Staff_Beauty_Parlor", ["Alpaca Out of Nowhere!", [3], "Nikos Transformation", [4], "lepik le prick", [5]]);
    new Recipe_button("Trading_Decks", "random_lvl2_staff_card", ["LinkinsRepeater Bone Hard Card", [3], "MuffledSilence's Headphones", [4], "Ze do Caixao Coffin Joe Card", [5]]);
    new Recipe_button("Trading_Decks", "Realm_of_Staff", ["The Golden Throne", [3], "Biggest Banhammer", [4], "Staff Beauty Parlor", [5]]);
    new Separator("Trading_Decks", 1);
    new Recipe_button("Trading_Decks", "Portal_Gun", ["Cake", [3], "GLaDOS", [4], "Companion Cube", [5]], "Portal Gun");
    new Recipe_button("Trading_Decks", "Space_Wormhole", ["Nyx class Supercarrier", [3], "Covetor Mining Ship", [4], "Chimera Schematic", [5]], "Space Wormhole");
    new Recipe_button("Trading_Decks", "Ricks_Portal_Gun", ["Rick Sanchez", [3], "A Scared Morty", [4], "Mr Poopy Butthole", [5]], "Ricks Portal Gun");
    new Recipe_button("Trading_Decks", "Interdimensional_Portal", ["Portal Gun", [3], "Space Wormhole", [4], "Ricks Portal Gun", [5]], "Interdimensional Portal");
    new Separator("Trading_Decks", 2);
    new Recipe_button("Trading_Decks", "Super_Mushroom", ["Mario", [3], "Princess Peach", [4], "Toad", [5]], "Super Mushroom");
    new Recipe_button("Trading_Decks", "Fire_Flower", ["Luigi", [3], "Koopa Troopa", [4], "Yoshi", [5]], "Fire Flower");
    new Recipe_button("Trading_Decks", "Penguin_Suit", ["Bowser", [3], "Goomba", [4], "Wario", [5]], "Penguin Suit");
    new Recipe_button("Trading_Decks", "Goal_Pole", ["Super Mushroom", [3], "Fire Flower", [4], "Penguin Suit", [5]], "Goal Pole");
    new Separator("Trading_Decks", 3);
    new Recipe_button("Trading_Decks", "Random_Lootbox", ["Realm of Staff", [0], "Goal Pole", [4], "Interdimensional Portal", [6]]);
    new Recipe_button("Trading_Decks", "Dins_Lootbox", ["Realm of Staff", [0,6], "Goal Pole", [4]]);
    new Recipe_button("Trading_Decks", "Farores_Lootbox", ["Goal Pole", [0,6], "Realm of Staff", [4]]);
    new Recipe_button("Trading_Decks", "Nayrus_Lootbox", ["Interdimensional Portal", [0,6], "Realm of Staff", [4]]);
    new Separator("Trading_Decks", 0);

    new Recipe_button("Xmas_Crafting", "Dirt_5", ["Cyberpunk 2077", [4],"Watch Dogs Legion", [5]]);
    new Recipe_button("Xmas_Crafting", "Gazelle", ["Genshin Impact", [4],"Animal Crossing", [5]]);
    new Recipe_button("Xmas_Crafting", "Mafia", ["Dirt 5", [4],"Gazelle", [5]]);
    new Recipe_button("Xmas_Crafting", "Christmas_Bauble_Badge", ["Broken Bauble Fragment", [1,2,4,5]]);
    new Recipe_button("Xmas_Crafting", "Christmas_Impostor_Bauble", ["Red Crewmate Bauble", [3],"Green Crewmate Bauble", [4],"Cyan Crewmate Bauble", [5]]);
    new Recipe_button("Xmas_Crafting", "lucky_four-leaves_holly", ["Wilted Four-Leaves Holly", [4],"black elderberries", [2,5,8]]);
    new Separator("Xmas_Crafting", 1);
    new Recipe_button("Xmas_Crafting", "snowball", ["pile of snow", [4,7]]);
    new Recipe_button("Xmas_Crafting", "large_snowball", ["pile of snow", [1,3,5,7], "snowball", [4]]);
    new Recipe_button("Xmas_Crafting", "hot_chocolate", ["christmas spices", [1], "snowball", [4], "bowl", [7]]);
    new Recipe_button("Xmas_Crafting", "peppermint_hot_chocolate", ["candy cane", [1], "hot chocolate", [4]]);
    new Recipe_button("Xmas_Crafting", "hyper_realistic_eggnog", ["christmas spices", [7], "snowball", [4], "bowl", [1]]);
    new Recipe_button("Xmas_Crafting", "pile_of_charcoal", ["lump of coal", [1,3,4,5]]);
    new Recipe_button("Xmas_Crafting", "snowman", ["carrot", [0],"old scarf & hat", [1],"clay", [2],"snowball", [3],"large snowball", [4,7],"pile of charcoal", [5,8],"bowl", [6]]);
    new Separator("Xmas_Crafting", 2);
    new Recipe_button("Xmas_Crafting", "Abominable_Santa", ["Perfect Snowball", [4],"Santa Suit", [5]]);
    new Recipe_button("Xmas_Crafting", "Icy_Kisses", ["Perfect Snowball", [4],"Mistletoe", [5]]);
    new Recipe_button("Xmas_Crafting", "Sexy_Santa", ["Santa Suit", [4],"Mistletoe", [5]]);
    new Recipe_button("Xmas_Crafting", "Christmas_Cheer", ["Abominable Santa", [3],"Icy Kisses", [4],"Sexy Santa", [5]]);
    new Recipe_button("Xmas_Crafting", "Gingerbread_Doomslayer", ["Gingerbread Kitana", [4],"Gingerbread Marston", [5]]);
    new Recipe_button("Xmas_Crafting", "Mario_Christmas", ["Millenium Falcon Gingerbread", [4],"Gingerbread AT Walker", [5]]);
    new Recipe_button("Xmas_Crafting", "Baby_Yoda_With_Gingerbread", ["Gingerbread Doomslayer", [4],"Mario Christmas", [5]]);
    new Separator("Xmas_Crafting", 3);
    new Recipe_button("Xmas_Crafting", "Grievous", ["Santa Claus Is Out There", [3],"Back to the Future", [4], "Gremlins", [5]]);
    new Recipe_button("Xmas_Crafting", "Mando", ["Picard", [0],"Braveheart", [1], "Indy", [2]]);
    new Recipe_button("Xmas_Crafting", "Doomguy", ["Big Lebowski", [6],"Die Hard", [7], "Jurassic Park", [8]]);
    new Recipe_button("Xmas_Crafting", "Have_a_Breathtaking_Christmas", ["Grievous", [1],"Mando", [4], "Doomguy", [7]]);
    new Recipe_button("Xmas_Crafting", "Young_Snowman", ["snowman", [4],"snowman cookie", [1,3,5,7]]);
    new Separator("Xmas_Crafting", 0);

    new Recipe_button("Birthday", "Future_Gazelle", ["Ripped Gazelle", [3],"Gamer Gazelle", [4]]);
    new Recipe_button("Birthday", "Alien_Gazelle", ["Ripped Gazelle", [3],"Fancy Gazelle", [4]]);
    new Recipe_button("Birthday", "Lucky_Gazelle", ["Fancy Gazelle", [4],"Gamer Gazelle", [5]]);
    new Recipe_button("Birthday", "Supreme_Gazelle", ["Future Gazelle", [3],"Alien Gazelle", [4],"Lucky Gazelle", [5]]);
    new Recipe_button("Birthday", "birthday_licks_badge_-_9th", ["lick badge bits", [3,4,5,6,7,8]]);
    new Separator("Birthday", 1);
    new Recipe_button("Birthday", "A_Fair_Fight", ["Exodus Truce", [4],"Gazelle Breaking Bad", [5]]);
    new Recipe_button("Birthday", "What_an_Adventure", ["Home Sweet Home", [4],"Birthday Battle Kart", [5]]);
    new Recipe_button("Birthday", "After_Party", ["A Fair Fight", [4],"What an Adventure", [5]]);
    new Recipe_button("Birthday", "birthday_gazelle_badge_-_10th", ["birthday leaves", [0,2,3,5,6,8]]);
    new Separator("Birthday", 2);
    new Recipe_button("Birthday", "Dr_Mario", ["Bill Rizer", [3],"Donkey Kong", [4],"Duck Hunt Dog", [5]]);
    new Recipe_button("Birthday", "Link", ["Pit", [3],"Little Mac", [4],"Mega Man", [5]]);
    new Recipe_button("Birthday", "Kirby", ["Pac-Man", [3],"Samus Aran", [4],"Simon Belmont", [5]]);
    new Recipe_button("Birthday", "Black_Mage", ["Dr Mario", [0],"Link", [4],"Kirby", [8]]);
    new Recipe_button("Birthday", "birthday_gazelle_badge_-_11th", ["party pipe badge bit", [0,4,5,8]]);
    new Separator("Birthday", 3);
    new Recipe_button("Birthday", "12th_birthday_badge", ["slice of birthday cake", [0,2,4,6,8]]);
    new Recipe_button("Birthday", "Red_Dragon", ["Dins flame",[4],"Who Eats Whom",[0],"Baby Yoda With Gingerbread",[1],"After Party",[2],"Lame Pumpkin Trio",[6],"Christmas Cheer",[7],"Supreme Gazelle",[8]]);
    new Recipe_button("Birthday", "Green_Dragon", ["Farores flame",[4],"Who Eats Whom",[0],"Baby Yoda With Gingerbread",[1],"After Party",[2],"Lame Pumpkin Trio",[6],"Christmas Cheer",[7],"Supreme Gazelle",[8]]);
    new Recipe_button("Birthday", "Blue_Dragon", ["Nayrus flame",[4],"Who Eats Whom",[0],"Baby Yoda With Gingerbread",[1],"After Party",[2],"Lame Pumpkin Trio",[6],"Christmas Cheer",[7],"Supreme Gazelle",[8]]);
    new Recipe_button("Birthday", "Gold_Dragon", ["golden egg",[4],"Who Eats Whom",[0],"Baby Yoda With Gingerbread",[1],"After Party",[2],"Lame Pumpkin Trio",[6],"Christmas Cheer",[7],"Supreme Gazelle",[8]]);
    new Separator("Birthday", 0);

    new Recipe_button("Valentine", "Kirlia_and_Meloetta", ["Sonic and Amy", [3],"Valentine sugar heart", [4],"Yoshi and Birdo", [5]]);
    new Recipe_button("Valentine", "Dom_and_Maria", ["Aerith and Cloud", [3],"Valentine sugar heart", [4],"Master Chief and Cortana", [5]]);
    new Recipe_button("Valentine", "Mr_and_Mrs_Pac_Man", ["Kirlia and Meloetta", [3],"Valentine sugar heart", [4],"Dom and Maria", [5]]);
    new Recipe_button("Valentine", "Angelise_Reiter", ["Chainsaw Chess", [3],"Valentine chocolate heart", [4],"Chainsaw Wizard", [5]]);
    new Recipe_button("Valentine", "Sophitia", ["Ivy Valentine", [3],"Valentine chocolate heart", [4],"Jill Valentine", [5]]);
    new Recipe_button("Valentine", "Yennefer", ["Angelise Reiter", [3],"Valentine chocolate heart", [4],"Sophitia", [5]]);
    new Separator("Valentine", 1);
    new Recipe_button("Valentine", "vegetal_symbol", ["Valentine rose", [1,3,5,7]], "Symbol of love");
    new Recipe_button("Valentine", "mineral_symbol", ["ruby", [0,2,6,8]], "Symbol of love");
    new Recipe_button("Valentine", "Cupids_magical_feather", ["quartz bar", [0,2], "jade bar", [1], "gold ore", [4], "amethyst dust", [7]]);
    new Recipe_button("Valentine", "Cupids_winged_boots", ["Symbol of love", [1], "Old worn boots", [4], "Cupids magical feather", [6,8]]);
    new Recipe_button("Valentine", "Valentine_2022_Badge", ["rose petals", [0,2,4,6,8]]);
    new Recipe_button("Valentine", "special_box", ["Mr and Mrs Pac Man", [0], "Black Mage", [2], "Yennefer", [6], "King Boo", [8]]);
    new Separator("Valentine", 0);

    new Recipe_button("Halloween", "Stormrage_Pumpkin", ["Rotting Pumpkin", [4],"Carved Pumpkin", [5]]);
    new Recipe_button("Halloween", "Russian_Pumpkin", ["Carved Pumpkin", [4],"Ripe Pumpkin", [5]]);
    new Recipe_button("Halloween", "Green_Mario_Pumpkin", ["Ripe Pumpkin", [4],"Rotting Pumpkin", [5]]);
    new Recipe_button("Halloween", "Lame_Pumpkin_Trio", ["Stormrage Pumpkin", [3],"Russian Pumpkin", [4],"Green Mario Pumpkin", [5]]);
    new Recipe_button("Halloween", "Halloween_Pumpkin_Badge", ["pumpkin badge bits", [3,4,5,6,7,8]]);
    new Separator("Halloween", 1);
    new Recipe_button("Halloween", "Memory_Boost", ["Bloody Mario", [4],"Mommys Recipe", [5]]);
    new Recipe_button("Halloween", "Skultilla_The_Cake_Guard", ["Link Was Here", [4],"Gohma Sees You", [5]]);
    new Recipe_button("Halloween", "Who_Eats_Whom", ["Memory Boost", [4],"Skultilla The Cake Guard", [5]]);
    new Recipe_button("Halloween", "Halloween_Cupcake_Badge", ["cupcake crumbles", [3,4,5,6,7,8]]);
    new Separator("Halloween", 2);
    new Recipe_button("Halloween", "Ghostbusters", ["Blinky", [3],"Clyde", [4]]);
    new Recipe_button("Halloween", "Boo", ["Pinky", [3],"Inky", [4]]);
    new Recipe_button("Halloween", "King_Boo", ["Ghostbusters", [3],"Boo", [4]]);
    new Recipe_button("Halloween", "Tombstone_Badge", ["haunted tombstone shard", [0,1,2,6,7,8]]);
    new Separator("Halloween", 0);

    new Recipe_button("AC", "regenerate", ["glowing leaves", [4]]);
    new Recipe_button("AC", "hypnosis", ["glowing leaves", [3,4,5]]);
    new Recipe_button("AC", "muddle", ["glowing leaves", [1,4,7]]);
    new Recipe_button("AC", "parasite", ["glowing leaves", [0,1,2,6,7,8]]);
    new Recipe_button("AC", "burst_of_light", ["condensed light", [4]]);
    new Recipe_button("AC", "dark_orb", ["bottled ghost", [4]]);
    new Recipe_button("AC", "burning_ash_cloud", ["glowing ash", [1,3,4,5,7]]);
    new Separator("AC", 1);
    new Recipe_button("AC", "3_backpack_slots", ["cloth", [4], "hide", [3,5]]);
    new Recipe_button("AC", "4_backpack_slots", ["cloth", [4], "hide", [1,3,5,7]]);
    new Recipe_button("AC", "6_backpack_slots", ["cloth", [0,2,6,8], "hide", [1,3,5,7], "advanced hide", [4]]);
    new Recipe_button("AC", "scrappy_gauntlets", ["scrap", [1,4,7]]);
    new Recipe_button("AC", "troll_tooth_necklace", ["scrap", [7], "hide", [1], "troll tooth", [3,4,5]]);
    new Separator("AC", 0);

    new Recipe_button("Bling", "Unity_Necklace", ["Dins flame", [0],"Farores flame", [1], "Nayrus flame", [2], "gold bar", [3], "flawless amethyst", [4], "jade bar", [5], "carbon-crystalline quartz",[6,7,8]]);
    new Recipe_button("Bling", "Flame_Badge", ["Dins flame", [0],"Farores flame", [7], "Nayrus flame", [2], "flawless amethyst", [4]]);
    new Recipe_button("Bling", "Nayrus_Username", ["Nayrus flame", [3], "green onyx gem", [4]]);
    new Recipe_button("Bling", "Farores_Username", ["Farores flame", [3], "green onyx gem", [4]]);
    new Recipe_button("Bling", "Dins_Username", ["Dins flame", [3], "green onyx gem", [4]]);
    new Recipe_button("Bling", "Dwarven_Discoball", ["dwarven gem", [0,1,2,3,4,5,6,7,8]]);
    new Recipe_button("Bling", "irc_voice_8w", ["irc voice 2w", [3,4,5]]);
    new Recipe_button("Bling", "irc_voice_8w_-_low_cost", ["irc voice 2w - low cost", [1,3,4,5]], "irc voice 8w");
    new Recipe_button("Bling", "irc_voice_1y", ["irc voice 8w", [0,1,2,3,4,5], "sapphire",[7]]);
    new Separator("Bling", 0);





    $("#quick-crafter").append('<br /><br />');
    $("#quick-crafter").append('<p style="float:right;margin-top:-20px;margin-right:5px;">Quick Crafter by <a href="/user.php?id=58819">KingKrab23</a> v<a href="https://github.com/KingKrab23/Quick_Craft/raw/master/GGn%20Quick%20Crafting.user.js">' + VERSION +'</a></p>');

    $("#clear_button").click(function() {
        close_crafting_submenu();
    });



})();