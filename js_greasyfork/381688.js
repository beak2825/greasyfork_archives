// ==UserScript==
// @name         Neopets: Auto-Buyer (Stamp)
// @namespace    https://greasyfork.org/en/users/248719-rotomdex
// @version      0.1
// @description  it clicks on the stamps u want to buy
// @author       twitter.com/RotomDex
// @match        http://www.neopets.com/objects.phtml?type=shop&obj_type=2*
// @match        http://www.neopets.com/objects.phtml?obj_type=2*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/381688/Neopets%3A%20Auto-Buyer%20%28Stamp%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381688/Neopets%3A%20Auto-Buyer%20%28Stamp%29.meta.js
// ==/UserScript==

// mirror of https://raw.githubusercontent.com/hectorvazc/jsfun/master/jsfun.min.js
// just slap this in @require up there https://raw.githubusercontent.com/nerkmid/neo/master/jsfun.js
function find_selector(e,t) {var n=void 0===t?document.querySelectorAll(e):t.querySelectorAll(e);return console.assert(n.length,["find_selector:",e,t,"is undefined"].join(" ")),0===n.length?void 0:1===n.length?n[0]:n}
function isNode(e){return e instanceof Node}
function isNodeList(e){return e instanceof NodeList}
function fn(e){void 0!==e&&function(){e()}(this)}
function foreach(e,t){return void 0!==e&&void $array(e).forEach(function(e,n,i){t(e,n,i)})}
function $array(e){if(void 0===e)return[];var t=[],n=/^\[object (string)\]$/gi.test({}.toString.call(e))||/^\[object (htmlselectelement)\]$/gi.test({}.toString.call(e));return void 0===e.length||n?t.push(e):t=Array.from(e),t}
function $detach(e){var t=e.parentNode;if(t)return t.removeChild(e),e}
function bind_event(e,t,n,i){var i=i||"events",o="",s=[],r=$data(e,i);if(void 0!==r&&(o=e.dataset[i]),empty(o))s=[];else var s=getJSON(o);s.length>0&&s.indexOf(t)!==-1||(s.push(t),e.dataset[i]=setJSON(s),e.addEventListener(t,n))}
function empty(e){return 0===e.length||!e.trim()}
function $data(e,t){return e.dataset[t]}
function newElement(e){return document.createElement(e)}
function key_code(e){return parseInt(e.keyCode||e.which)}
function setJSON(e){return JSON.stringify(e)}function getJSON(e){return JSON.parse(e)}
function parent(e,t){if(void 0===t)return e.parentNode;for(var n=0;n<Number(t);n++)e=e.parentNode;return e}
function ajax(e,t,n){return new Promise(function(i,o){var s;s=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),s.open(e,t,!0),s.onload=i,s.onerror=o,void 0!==n?s.send(n):s.send()})}
function getObjectSession(e,t){var n=sessionStorage.getItem(e);return null===n?(void 0!==t&&(console.log("Saving default value"),setObjectSession(e,t)),t):getJSON(n)}
function removeObjectSession(e){void 0!==getObjectSession(e)&&(sessionStorage.removeItem(e),void 0===getObjectSession(e)&&console.log("object removed"))}
function setObjectSession(e,t){sessionStorage.setItem(e,setJSON(t))}
function getObject(e,t){var n=localStorage.getItem(e);return null===n?(void 0!==t&&(console.log("Saving default value"),setObject(e,t)),t):getJSON(n)}
function removeObject(e){void 0!==getObject(e)&&(localStorage.removeItem(e),void 0===getObject(e)&&console.log("object removed"))}
function setObject(e,t){localStorage.setItem(e,setJSON(t))}
var debFlag=!0,log=function(e,t){(void 0===t||t)&&debFlag&&console.log(e)},
    js=function e(t){return this instanceof e?(void 0!==t&&(isNode(t)||(t=find_selector(t))),this.element=t,this.context=void 0,this):new e(t)};
    js.prototype.get=function(){return this.context=void 0,this.element},
    js.prototype.getNode=function(e){var t=find_selector(e,this.context);return this.context=void 0,t},
    js.prototype.find=function(e){return this.element=find_selector(e,this.context),this.context=void 0,this},
    js.prototype.here=function(e){if(isNode(e))this.context=e;else{var t=find_selector(e);void 0===t?this.context=void 0:isNodeList(t)?this.context=t[0]:this.context=t}return this},
    js.prototype.html=function(e){return void 0===e?this.element.innerHTML:(this.element.innerHTML=e,this)},
    js.prototype.empty=function(){return this.element.innerHTML="",this},
    js.prototype.append=function(e){return this.element.innerHTML=[this.element.innerHTML,e].join(" "),this},
    js.prototype.exist=function(e){return void 0!==this.element},
    js.prototype.val=function(e){if(void 0!==this.element)return void 0===e?this.element.value:(this.element.value=e,this)},
    js.prototype.clean=function(){this.element=void 0,this.context=void 0},
    js.prototype.first=function(){return this.element=$array(this.element)[0],this},
    js.prototype.setAttribute=function(e){return"object"==typeof e&&(void 0!==this.element?foreach(this.element,function(t){for(var n in e)t.setAttribute(n,e[n])}):log("this.element is undefined. setAttribute call."),this)},
    js.prototype.removeAttribute=function(e){return void 0!==this.element?foreach(this.element,function(t){foreach(e,function(e){t.removeAttribute(e)})}):log("this.element is undefined. removeAttribute call."),this},
    js.prototype.addStyle=function(e){return"object"==typeof e&&(void 0!==this.element?foreach(this.element,function(t){for(var n in e)t.style.setProperty(n,e[n])}):log("this.element is undefined. addStyle call."),this)},
    js.prototype.removeStyle=function(e){return void 0!==this.element?foreach(this.element,function(t){foreach(e,function(e){t.style.removeProperty(e)})}):log("this.element is undefined. removeStyle call."),this},
    js.prototype.addClass=function(e){return void 0!==this.element?foreach(this.element,function(t){foreach(e,function(e){t.classList.add(e)})}):log("this.element is undefined. addClass call."),this},
    js.prototype.removeClass=function(e){return void 0!==this.element?foreach(this.element,function(t){foreach(e,function(e){t.classList.contains(e)&&t.classList.remove(e)})}):log("this.element is undefined. removeClass call."),this},
    js.prototype.hide=function(){return void 0!==this.element?foreach(this.element,function(e){e.style.setProperty("display","none")}):log("this.element is undefined. hide call."),this},
    js.prototype.show=function(){return void 0!==this.element?foreach(this.element,function(e){e.style.removeProperty("display")}):log("this.element is undefined. show call."),this},
    js.prototype.resize=function(){if(void 0!==this.element)return this.element.style.height="1px",this.element.style.height=this.element.scrollHeight+"px",this},
    js.prototype.text=function(){return void 0===this.element?"":this.element.innerText||this.element.textContent},
    js.prototype.insertFirst=function(e){if(void 0!==this.element)return this.element.insertAdjacentElement("afterbegin",e),this},
    js.prototype.insertLast=function(e){if(void 0!==this.element)return this.element.insertAdjacentElement("beforeend",e),this},
    js.prototype.insertBefore=function(e){if(void 0!==this.element)return this.element.insertAdjacentElement("beforebegin",e),this},
    js.prototype.insertAfter=function(e){if(void 0!==this.element)return this.element.insertAdjacentElement("afterend",e),this},
    js.prototype.detach=function(){if(void 0!==this.element){var e=[];return foreach(this.element,function(t){e.push($detach(t))}),e}},
    js.prototype.visible=function(){if(void 0!==this.element)return"none"!==this.element.style.display},
    js.prototype.hidden=function(){if(void 0!==this.element)return!this.visible()},
    js.prototype.each=function(e){void 0!==this.element?(foreach(this.element,e),this.clean()):log("this.element is undefined. show call.")},
    js.prototype.event=function(e,t,n){return void 0===this.element?(log("this.element is undefined. event call."),this):(foreach(this.element,function(i){foreach(e,function(e){bind_event(i,e,t,n)})}),void this.clean())};
// end required shit

var ItemsToIgnore = [
"Moltara Town Hall Stamp", "Zombified Heroes Stamp", "Luperus Left Head Stamp", "Haunted Mansion Stamp", "Dark Qasala Stamp", "Darigan Citadel Stamp", "Luperus Centre Head Stamp", "Destruction of Faerieland Stamp", "Buried Treasure Stamp", "Altador Magic Stamp", "Dark Faerie Stamp", "Mr. Krawley Stamp", "Talinia Stamp", "Lost Desert Scroll Stamp", "Faerie Furniture Shopkeeper Stamp", "Kreai Stamp", "Bringer of Night Stamp", "Christmas Scene Stamp", "Hanso Stamp", "Caylis Stamp", "Super Bright Rainbow Pool Stamp", "Neopia Central Scene Stamp", "Eleus Stamp", "Magma Pool Guard Stamp", "Dubloon-O-Matic Stamp", "Bruno Stamp", "Evil Fuzzles Stamp", "Rainbow Pool Stamp", "Hannah Stamp", "Jelly World Stamp", "Lady Frostbite Stamp", "Sliding Darblat Stamp", "Spirit of Slumber Stamp", "Spyder Stamp", "Astronomy Club Stamp", "Petpet Cannonball Stamp", "Green Knight Stamp", "Mellow Marauders Plushie Stamp", "Ruler of the Five Seas Stamp", "Lupe Shopkeeper Stamp", "Hubrid Nox Commemorative Stamp", "Zurroball Stamp", "Tangor Stamp", "Zyrolon Stamp", "Fyora Faerie Doll Stamp", "Cogs Togs Stamp", "Sentient Headstones Stamp", "Dorak Stamp", "Shenkuu Mask Stamp", "Dr. Sloth Stamp", "Hot Dog Hero Stamp", "The Revenge Stamp", "Lava Monster Stamp", "Razul Stamp", "Finneus Stamp", "Negg Faerie Stamp", "Thoughtful Linae Stamp", "Orrin Stamp", "RIP Lucy Stamp", "Blumaroo Court Jester Stamp", "Gargarox Isafuhlarg Stamp", "Meridell Castle Stamp", "The Krawken Stamp", "Alien Aisha Myriad Stamp", "Delina Stamp", "Tylix Stamp", "Lisha vs Zombie Lisha Stamp", "Princess Sankara Stamp", "Tyrannian Blumaroo Stamp", "Velm Stamp", "Yiko Stamp", "Family Portrait Stamp", "Bug Eye McGee Stamp", "Hubrid Nox Stamp", "Mutant Techo Plushie Stamp", "105 Castle Secrets Stamp", "Crumpetmonger Stamp", "Ruins of Faerieland Stamp", "Krawk Island Governor Stamp", "Desert Paint Brush Stamp", "Sunblade Stamp", "Tyrannian Plateau Stamp", "Holographic Sakhmet City Stamp", "Tazzalor Stamp", "Trapped Tomos Stamp", "Snowager Stamp", "Jade Scorchstone Stamp", "Mokti and Rikti Stamp", "Kentari Spyglass Stamp", "Garin To The Rescue Stamp", "Boris Stamp", "Docked Ship Stamp", "Desert Arms Stamp", "King Skarl Plushie Stamp", "Qasalan Mummy Stamp", "Scorchio Mummy Stamp", "Florin Stamp", "Mystery Island Travel Stamp", "Exploding Acorns Stamp", "Fountain Faerie Stamp", "Castle Defender Stamp", "Battle Eyrie Stamp", "Bottled Faerie Stamp", "Illusen Stamp", "Flying Korbats Stamp", "Yes-Boy Ice Cream Stamp", "Smugglers Cove Stamp", "Mayor of Moltara Stamp", "Usul-in-waiting Stamp", "Plushie Slorg Stamp", "Hoban Stamp", "Edna the Zafara Stamp", "Gatekeeper Stamp", "Darigan Elemental Stamp", "Neopet Version 2 Stamp", "Scurvy Island Stamp", "Pomanna Stamp", "Illusens Staff Stamp", "Maraquan Charger Stamp", "NeoQuest II Logo Stamp", "Marak Stamp", "Mutant Grundo Stamp", "Neovia Stamp", "Splat-A-Sloth Stamp", "Chocolate Factory Stamp", "Glowing Brain Tree Stamp", "Igloo Garage Sale Stamp", "The Drenched Stamp", "Faerieland Petpet Shopkeeper Stamp", "SHFISS Stamp", "Meridell Shield Stamp", "Commemorative Defenders Stamp #3", "Hubrid Noxs Mountain Fortress Stamp", "Usukiland Stamp", "Senator Barca Stamp", "Blarthrox Stamp", "Celestial Talisman Stamp", "Jeran Stamp", "Kings Lens Stamp", "N4 Bot Stamp", "Shenkuu Bridge Stamp", "Shop Wizard Stamp", "Wand Of The Dark Faerie Stamp", "Jelly Pop Stamp", "Molten Morsels Stamp", "Coco Stamp", "Brain Tree Stamp", "Cliffhanger Stamp", "Deluxe Money Tree Stamp", "Darigan Shield Stamp", "Qasalan Coffee Set Stamp", "Jewelled Scarab Stamp", "Tyrannian Usul Stamp", "Underwater Chef Stamp", "Guard Zomutt Stamp", "Faerie Bubbles Stamp", "Neopian Hospital Stamp", "Charms Stamp", "Devilpuss Stamp", "Kauvara Stamp", "Carnival of Terror Stamp", "Tasu Stamp", "Qasalan Tablet Stamp", "Rock Stamp", "Stocking Stamp", "Alien Aisha Vending Stamp", "Fruit Machine Stamp", "Lord Darigan Stamp", "Monoceraptor Claw Stamp", "Pile of Dung Stamp", "Scarab Stamp", "Snowglobe Faerie Stamp", "Thyoras Tear Stamp", "Magma Pool Stamp", "Osiris Pottery Stamp", "Trestin Stamp", "Captain of Fyoras Guards Stamp", "Kolvars Stamp", "Librarian Stamp", "Perfectly Flat Rock Stamp", "Bonju Stamp", "Kelland Stamp", "Shield Of Pion Troect Stamp", "Alien Aisha Ray Gun Stamp", "Maraquan Blade Specialist Stamp", "Midnight Desert Lupe Stamp", "Pineapple Dessert Stamp", "Zombie Faleinn Stamp", "Rohanes Mother Stamp", "Tyrannian Grarrl Stamp", "Jhudoras Bewitched Ring Stamp", "Turmaculus Stamp", "Golden Orb Stamp", "Sakhmet Palace Stamp", "Chasm Beast Stamp", "Ski Lodge Stamp", "The Lighthouse Stamp", "Angry Janitor Stamp", "Meridell Gardens Stamp", "Plesio Stamp", "Ruins of Qasala Stamp", "Altador Food Stamp", "Faerie Foods Stamp", "Rusty Door Stamp", "Christmas Zafara Stamp", "Dark Graspberry Stamp", "Moonlit Werelupe Stamp", "Rod Of Dark Nova Stamp", "Scratchcard Kiosk Stamp", "Kou-Jong Tile Stamp", "Mutant Usul Stamp", "Peopatra Stamp", "Zygorax Stamp", "Leirobas Stamp", "Piraket Stamp", "Petty Crewmate Stamp", "Terror Mountain Scene Stamp", "Psellia Stamp", "Advert Attack Stamp", "Black Bearog Stamp", "Neolodge Stamp", "Nova Storm Stamp", "The Arcanium Stamp", "Tug Of War Stamp", "Skeith Bank Manager Stamp", "Two Rings Crusader Stamp", "Jerdana Stamp", "Faerie Slingshot Stamp", "Riches of Krawk Island Stamp", "Snow Faerie Stamp", "Darigan Eyrie Stamp", "King Skarl Stamp", "Altadorian Farmer Stamp", "Cyodrakes Gaze Logo Stamp", "Fruit Bomb Stamp", "Qasalan Delights Stamp", "Young Sophie Stamp", "Grundo Snow Throw Stamp", "Lost Desert Sphinx Stamp", "Faerie City Stamp", "Wintery Bruce Stamp", "Bone Chair Stamp", "Faerieland Justice Stamp", "Christmas Meerca Stamp", "Morax Dorangis Stamp", "Rohane Stamp", "Ancient Contract Stamp", "Attack of the Slorgs Stamp", "The Black Pawkeet Stamp", "Words of Antiquity Stamp", "Draik Guard Stamp", "Zafara Princess Stamp", "Library Faerie Stamp", "Eraser of the Dark Faerie Stamp", "Giant Leaf Curtains Stamp", "Gordos Stamp", "Grand Theft Ummagine Stamp", "Sword of the Air Faerie Stamp", "Quiggle Scout Stamp", "Rink Runner Stamp", "Exploding Space Bugs Stamp", "Geb Stamp", "Goregas Stamp", "Destruct-O-Match Stamp", "The Wave Stamp", "Entrance to Moltara Stamp", "Rainbow Slushie Stamp", "Drooling Quadrapus Stamp", "Grackle Bug Stamp", "Attack Pea Stamp", "Boraxis the Healer Stamp", "Robot Skeith Stamp", "Slorg Flakes Stamp", "Snow Wars Catapult Stamp", "Rotting Skeleton Stamp", "Slime Titan Stamp", "Sword of Skardsen Stamp", "Mystery Island Kougra Stamp", "Temple Of The Sky Stamp", "Christmas Kougra Stamp", "Shenkuu Draik Stamp", "Advisor Wessle Stamp", "Snowball Fight Stamp", "Two Rings Archmagus Stamp", "Veggie Pizza Stamp", "Golden Khamette Stamp", "Gormball Stamp", "Purple Grundo Stamp", "Tyrannian JubJub Stamp", "Rampaging Grundonoil Stamp", "Desert Petpet Stamp", "Hubrids Puzzle Box Stamp", "Tyrannian Korbat Stamp", "Chunk of Meat Stamp", "Gallion Stamp", "Grinning Sloth Stamp", "Maractite Dagger Stamp", "Mr Irgo Stamp", "Suteks Tomb Stamp", "Negg Noodles Stamp", "Tyrannian Kyrii Stamp", "Enchanted Pudao Stamp", "Senator Palpus Stamp", "Siyana Stamp", "New Maraqua Stamp", "Pirate Troops Stamp", "Seaweed Necklace Stamp", "Stone Armchair Stamp", "Commemorative Defenders Stamp #2", "Frosty Snowman Stamp", "Orange Skeith Stamp", "Commemorative Defenders Stamp #1", "Grimilix Stamp", "Linae Stamp", "Shenkuu City Stamp", "Fauna Stamp", "Maraquan Defenders Stamp", "Moonlit Esophagor Stamp", "Kentari Stamp", "Maraquan Troops Stamp", "Captain Tuan Stamp", "Gelert Prince Stamp", "Korbats Lab Stamp", "Pirate Attack Stamp", "Ryshu Stamp", "Shenkuu Lunar Temple Stamp", "Triangular Flotsam Stamp", "Anshu Stamp", "Mystery Island Heads Stamp", "Spooky Gravestone Stamp", "Jhuidah Stamp", "Everlasting Crystal Apple Stamp", "Haiku Stamp", "Island Mystic Stamp", "Island Native Stamp", "Orange Draik Stamp", "Roast Gargapple Stamp", "Halloween Ona Stamp", "Assorted Fruits Stamp", "Master Vex Stamp", "Kazeriu Stamp", "Mystery Island Hut Stamp", "Zeenana Stamp", "Second Edition Altador Petpet Stamp", "Halloween Aisha Stamp", "Esophagor Stamp", "Fetch! Stamp", "Faerie Techo Plushie Stamp", "Archmagus of Roo Stamp", "Christmas Uni Stamp", "Money Tree Stamp", "Petpet Growth Syrup Stamp", "Plains Aisha Stamp", "Pyramid Sun Rise Stamp", "Wishing Well Stamp", "Healing Springs Stamp", "Wintery Petpet Shop Stamp", "Book Shop Nimmo Stamp", "First Edition Altador Petpet Stamp", "Huberts Hot Dogs Stamp", "Lost Desert Grarrl Stamp", "Dice-A-Roo Stamp", "Mist Kougra Stamp"
];

var DelayMax = 2300;
var DelayMin = 1000;

var ignore = [];
for (var i = 0; i < ItemsToIgnore.length; i++)
{
    ignore.push(new RegExp(ItemsToIgnore[i].replace(/\x20+/g, "\\x20+"), "i"));
}

var shopContents = document.body.textContent || document.body.innerText;
var emptyshop = shopContents.indexOf("Sorry, we are sold out of everything!")!==-1;

if (!emptyshop)
{
    var content = js().getNode('table[align="center"][cellpadding="4"][border="0"]');
    js().here(content).find('tr').each(function(tr){
        js().here(tr).find('td').each(function(td){
            var a = js().here(td).find('a').detach()[0];
            js(a).removeAttribute('onclick');
            js(td).insertFirst(a);
        });
    });

    var items = $("a[href*='haggle']").toArray();

    for (var v = 0, j; v < items.length;)
    {
        for (j = 0; j < ignore.length; j++)
        {
            if (ignore[j].test($(items[v]).siblings("b:first").text()))
            {
                break;
            }
        }
        if (j == ignore.length)
        {
            v++;
        }
        else
        {
            items.splice(v, 1);
        }
    }
    if (items.length)
    {
        items[Math.round(Math.random() * (items.length - 1))].click();
    }
    else
    {
        setTimeout
        (
            function () { $("img[src*='shopkeepers']").parent()[0].click(); },
            (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
        );
    }
}
else
{
    setTimeout
    (
        function () { $("img[src*='shopkeepers']").parent()[0].click(); },
        (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
    );
}