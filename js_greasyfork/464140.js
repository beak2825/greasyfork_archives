// ==UserScript==
// @name         HenterVerse Market UI Enhancer
// @namespace    hvmui
// @version      0.1.2.7
// @description  Enhance HentaiVerse UI of The Market.
// @author       Retr#000
// @match        https://*hentaiverse.org/*?s=Bazaar&ss=mk*
// @icon         https://hentaiverse.org/y/scroll_up.png
// @grant        GM_setValue
// @grant        GM_getValue
// @license      CC BY-NC 3.0
// @downloadURL https://update.greasyfork.org/scripts/464140/HenterVerse%20Market%20UI%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/464140/HenterVerse%20Market%20UI%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //////// List ///////////

    const marketList = {
        /*
                function getList() { // Use this function to quickly get the list
                    const a = document.querySelectorAll('#market_itemlist > table > tbody > tr[onclick]');
                    const b = document.querySelectorAll('#market_itemlist > table > tbody > tr > td:nth-child(1)');
                    const c = document.querySelector('#filterbar > * > div[class="cfbs"]');
                    var d = {};
                    for (let i = 0; i < a.length; i++) {
                        d += [
                            `"${Number(String(a[i].onclick).match(/\d+/))}": {`,
                            `    "name": "${b[i].textContent}",`,
                            '    "desc": "",',
                            `    "type": "${c.textContent}"`,
                            '},',
                        ].join('');
                    }
                    console.log(d);
                }
                getList();
        */

        /////////////// Consumable ///////////////
        "11191": {
            "name": "Health Draught",
            "desc": "Provides a long-lasting health restoration effect.<br>(Restores 2% base health per turn for 50 turns.)",
            "type": "Consumable"
        },
        "11195": {
            "name": "Health Potion",
            "desc": "Instantly restores a large amount of health.<br>(Restores 100% of base health.)",
            "type": "Consumable"
        },
        "11199": {
            "name": "Health Elixir",
            "desc": "Fully restores health, and grants a long-lasting health restoration effect.<br>(Restores 100% health on use + 2% base health per turn for 100 turns.)",
            "type": "Consumable"
        },
        "11291": {
            "name": "Mana Draught",
            "desc": "Provides a long-lasting mana restoration effect.<br>(Restores 1% base mana per turn for 50 turns.)",
            "type": "Consumable"
        },
        "11295": {
            "name": "Mana Potion",
            "desc": "Instantly restores a moderate amount of mana.<br>(Restores 50% of base mana.)",
            "type": "Consumable"
        },
        "11299": {
            "name": "Mana Elixir",
            "desc": "Fully restores mana, and grants a long-lasting mana restoration effect.<br>(Restores 100% mana on use + 1% base mana per turn for 100 turns.)",
            "type": "Consumable"
        },
        "11391": {
            "name": "Spirit Draught",
            "desc": "Provides a long-lasting spirit restoration effect.<br>(Restores 1% base spirit per turn for 50 turns.)",
            "type": "Consumable"
        },
        "11395": {
            "name": "Spirit Potion",
            "desc": "Instantly restores a moderate amount of spirit.<br>(Restores 50% of base spirit.)",
            "type": "Consumable"
        },
        "11399": {
            "name": "Spirit Elixir",
            "desc": "Fully restores spirit, and grants a long-lasting spirit restoration effect.<br>(Restores 100% spirit on use + 1% base spirit per turn for 100 turns.)",
            "type": "Consumable"
        },
        "11401": {
            "name": "Energy Drink",
            "desc": "Restores 10 points of Stamina, up to the maximum of 99. When used in battle, also boosts Overcharge and Spirit by 10% for ten turns.",
            "type": "Consumable"
        },
        "11402": {
            "name": "Caffeinated Candy",
            "desc": "Restores 5 points of Stamina, up to the maximum of 99. When used in battle, also boosts Overcharge and Spirit by 10% for five turns.",
            "type": "Consumable"
        },
        "11501": {
            "name": "Last Elixir",
            "desc": "Fully restores all vitals, and grants long-lasting restoration effects.<br>(= Health Elixir + Mana Elixir + Spirit Elixir)",
            "type": "Consumable"
        },
        "12101": {
            "name": "Infusion of Flames",
            "desc": "You gain +25% resistance to Fire elemental attacks and do 25% more damage with Fire magicks. (50 turns)",
            "type": "Consumable"
        },
        "12201": {
            "name": "Infusion of Frost",
            "desc": "You gain +25% resistance to Cold elemental attacks and do 25% more damage with Cold magicks. (50 turns)",
            "type": "Consumable"
        },
        "12301": {
            "name": "Infusion of Lightning",
            "desc": "You gain +25% resistance to Elec elemental attacks and do 25% more damage with Elec magicks. (50 turns)",
            "type": "Consumable"
        },
        "12401": {
            "name": "Infusion of Storms",
            "desc": "You gain +25% resistance to Wind elemental attacks and do 25% more damage with Wind magicks. (50 turns)",
            "type": "Consumable"
        },
        "12501": {
            "name": "Infusion of Divinity",
            "desc": "You gain +25% resistance to Holy elemental attacks and do 25% more damage with Holy magicks. (50 turns)",
            "type": "Consumable"
        },
        "12601": {
            "name": "Infusion of Darkness",
            "desc": "You gain +25% resistance to Dark elemental attacks and do 25% more damage with Dark magicks. (50 turns)",
            "type": "Consumable"
        },
        "13101": {
            "name": "Scroll of Swiftness",
            "desc": "Grants the Haste effect.<br>(Increases Action Speed by 60% than ≤ 50% by spell for 100 turns.)",
            "type": "Consumable"
        },
        "13111": {
            "name": "Scroll of Protection",
            "desc": "Grants the Protection effect.<br>(Absorbs all damage taken by 50% than ≤ 30% by spell for 100 turns.)",
            "type": "Consumable"
        },
        "13199": {
            "name": "Scroll of the Avatar",
            "desc": "Grants the Haste and Protection effects with twice the normal duration.<br>(= Scroll of Swiftness + Protection for 200 turns)",
            "type": "Consumable"
        },
        "13201": {
            "name": "Scroll of Absorption",
            "desc": "Grants the Absorb effect.<br>(Absorption Chance is 100% than ≤ 90% by spell.)",
            "type": "Consumable"
        },
        "13211": {
            "name": "Scroll of Shadows",
            "desc": "Grants the Shadow Veil effect.<br>(Increases evasion by 30% than ≤ 25% by spell for 100 turns.)",
            "type": "Consumable"
        },
        "13221": {
            "name": "Scroll of Life",
            "desc": "Grants the Spark of Life effect.<br>(100 turns, alive HP is 50% than 2 by spell, consumes 25% base SP than 50% by spell.)",
            "type": "Consumable"
        },
        "13299": {
            "name": "Scroll of the Gods",
            "desc": "Grants the Absorb, Shadow Veil and Spark of Life effects with twice the normal duration.<br>(= Scroll of Absorb + Shadow Veil + Spark of Life for 200 turns)",
            "type": "Consumable"
        },
        "19111": {
            "name": "Flower Vase",
            "desc": "There are three flowers in a vase. The third flower is green.<br>(Sleeper Imprint: Your attack/magic damage, attack/magic hit/crit chance, and evade/resist chance increases significantly for a short time.)",
            "type": "Consumable"
        },
        "19131": {
            "name": "Bubble-Gum",
            "desc": "It is time to kick ass and chew bubble-gum... and here is some gum.<br>(Kicking Ass: Your attacks and spells deal twice as much damage for a short time, will always hit, and will always land critical hits.)",
            "type": "Consumable"
        },

        /////////////// Material ///////////////
        "60001": {
            "name": "Low-Grade Cloth",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade cloth armor.",
            "type": "Material"
        },
        "60002": {
            "name": "Mid-Grade Cloth",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade cloth armor.",
            "type": "Material"
        },
        "60003": {
            "name": "High-Grade Cloth",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade cloth armor.",
            "type": "Material"
        },
        "60004": {
            "name": "Low-Grade Leather",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade light armor.",
            "type": "Material"
        },
        "60005": {
            "name": "Mid-Grade Leather",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade light armor.",
            "type": "Material"
        },
        "60006": {
            "name": "High-Grade Leather",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade light armor.",
            "type": "Material"
        },
        "60007": {
            "name": "Low-Grade Metals",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade heavy armor and weapons.",
            "type": "Material"
        },
        "60008": {
            "name": "Mid-Grade Metals",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade heavy armor and weapons.",
            "type": "Material"
        },
        "60009": {
            "name": "High-Grade Metals",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade heavy armor and weapons.",
            "type": "Material"
        },
        "60010": {
            "name": "Low-Grade Wood",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade staffs and shields.",
            "type": "Material"
        },
        "60011": {
            "name": "Mid-Grade Wood",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade staffs and shields.",
            "type": "Material"
        },
        "60012": {
            "name": "High-Grade Wood",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade staffs and shields.",
            "type": "Material"
        },
        "60051": {
            "name": "Scrap Cloth",
            "desc": "Various bits and pieces of scrap cloth. These can be used to mend the condition of an equipment piece.",
            "type": "Material"
        },
        "60052": {
            "name": "Scrap Leather",
            "desc": "Various bits and pieces of scrap leather. These can be used to mend the condition of an equipment piece.",
            "type": "Material"
        },
        "60053": {
            "name": "Scrap Metal",
            "desc": "Various bits and pieces of scrap metal. These can be used to mend the condition of an equipment piece.",
            "type": "Material"
        },
        "60054": {
            "name": "Scrap Wood",
            "desc": "Various bits and pieces of scrap wood. These can be used to mend the condition of an equipment piece.",
            "type": "Material"
        },
        "60071": {
            "name": "Energy Cell",
            "desc": "A cylindrical object filled to the brim with arcano-technological energy.<br>Required to restore advanced armor and shields to full condition.",
            "type": "Material"
        },
        "60101": {
            "name": "Crystallized Phazon",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge Phase Armor.",
            "type": "Material"
        },
        "60102": {
            "name": "Shade Fragment",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge Shade Armor.",
            "type": "Material"
        },
        "60104": {
            "name": "Repurposed Actuator",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge Power Armor.",
            "type": "Material"
        },
        "60105": {
            "name": "Defense Matrix Modulator",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge Force Shields.",
            "type": "Material"
        },
        "60201": {
            "name": "Binding of Slaughter",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Physical Base Damage.",
            "type": "Material"
        },
        "60202": {
            "name": "Binding of Balance",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Physical Hit Chance.",
            "type": "Material"
        },
        "60203": {
            "name": "Binding of Destruction",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Magical Base Damage.",
            "type": "Material"
        },
        "60204": {
            "name": "Binding of Focus",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Magical Hit Chance.",
            "type": "Material"
        },
        "60205": {
            "name": "Binding of Protection",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Physical Defense.",
            "type": "Material"
        },
        "60206": {
            "name": "Binding of the Fleet",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Evade Chance.",
            "type": "Material"
        },
        "60207": {
            "name": "Binding of the Barrier",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Block Chance.",
            "type": "Material"
        },
        "60208": {
            "name": "Binding of the Nimble",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Parry Chance.",
            "type": "Material"
        },
        "60209": {
            "name": "Binding of the Elementalist",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Elemental Magic Proficiency.",
            "type": "Material"
        },
        "60210": {
            "name": "Binding of the Heaven-sent",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Divine Magic Proficiency.",
            "type": "Material"
        },
        "60211": {
            "name": "Binding of the Demon-fiend",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Forbidden Magic Proficiency.",
            "type": "Material"
        },
        "60212": {
            "name": "Binding of the Curse-weaver",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Depreciating Magic Proficiency.",
            "type": "Material"
        },
        "60213": {
            "name": "Binding of the Earth-walker",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Supportive Magic Proficiency.",
            "type": "Material"
        },
        "60215": {
            "name": "Binding of Surtr",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Fire Spell Damage.",
            "type": "Material"
        },
        "60216": {
            "name": "Binding of Niflheim",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Cold Spell Damage.",
            "type": "Material"
        },
        "60217": {
            "name": "Binding of Mjolnir",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Elec Spell Damage.",
            "type": "Material"
        },
        "60218": {
            "name": "Binding of Freyr",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Wind Spell Damage.",
            "type": "Material"
        },
        "60219": {
            "name": "Binding of Heimdall",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Holy Spell Damage.",
            "type": "Material"
        },
        "60220": {
            "name": "Binding of Fenrir",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Dark Spell Damage.",
            "type": "Material"
        },
        "60221": {
            "name": "Binding of Dampening",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Crushing Mitigation.",
            "type": "Material"
        },
        "60222": {
            "name": "Binding of Stoneskin",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Slashing Mitigation.",
            "type": "Material"
        },
        "60223": {
            "name": "Binding of Deflection",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Piercing Mitigation.",
            "type": "Material"
        },
        "60224": {
            "name": "Binding of the Fire-eater",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Fire Mitigation.",
            "type": "Material"
        },
        "60225": {
            "name": "Binding of the Frost-born",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Cold Mitigation.",
            "type": "Material"
        },
        "60226": {
            "name": "Binding of the Thunder-child",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Elec Mitigation.",
            "type": "Material"
        },
        "60227": {
            "name": "Binding of the Wind-waker",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Wind Mitigation.",
            "type": "Material"
        },
        "60228": {
            "name": "Binding of the Thrice-blessed",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Holy Mitigation.",
            "type": "Material"
        },
        "60229": {
            "name": "Binding of the Spirit-ward",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Dark Mitigation.",
            "type": "Material"
        },
        "60230": {
            "name": "Binding of the Ox",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Strength.",
            "type": "Material"
        },
        "60231": {
            "name": "Binding of the Raccoon",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Dexterity.",
            "type": "Material"
        },
        "60232": {
            "name": "Binding of the Cheetah",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Agility.",
            "type": "Material"
        },
        "60233": {
            "name": "Binding of the Turtle",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Endurance.",
            "type": "Material"
        },
        "60234": {
            "name": "Binding of the Fox",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Intelligence.",
            "type": "Material"
        },
        "60235": {
            "name": "Binding of the Owl",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Wisdom.",
            "type": "Material"
        },
        "60236": {
            "name": "Binding of Warding",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Magical Mitigation.",
            "type": "Material"
        },
        "60237": {
            "name": "Binding of Negation",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Resist Chance.",
            "type": "Material"
        },
        "60238": {
            "name": "Binding of Isaac",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Physical Crit Chance.",
            "type": "Material"
        },
        "60239": {
            "name": "Binding of Friendship",
            "desc": "Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Magical Crit Chance.",
            "type": "Material"
        },
        "60402": {
            "name": "Legendary Weapon Core",
            "desc": "The core of a legendary weapon. Contains the power to improve a weapon beyond its original potential.",
            "type": "Material"
        },
        "60412": {
            "name": "Legendary Staff Core",
            "desc": "The core of a legendary staff. Contains the power to improve a staff beyond its original potential.",
            "type": "Material"
        },
        "60422": {
            "name": "Legendary Armor Core",
            "desc": "The core of a legendary armor. Contains the power to improve an armor piece or shield beyond its original potential.",
            "type": "Material"
        },
        "61001": {
            "name": "Voidseeker Shard",
            "desc": "When used with an equipment piece, this shard will temporarily imbue it with the Voidseeker\'s Blessing enchantment. (Weapon\'s damage type is changed to void, and a +50% physical accuracy bonus. No stack for DW.)",
            "type": "Material"
        },
        "61101": {
            "name": "Aether Shard",
            "desc": "When used with an equipment piece, this shard will temporarily imbue it with the Suffused Aether enchantment. (Gives +10% mana conservation bonus and a +50% magic accuracy bonus. No stack for DW.)",
            "type": "Material"
        },
        "61501": {
            "name": "Featherweight Shard",
            "desc": "When used with an equipment piece, this shard will temporarily imbue it with the Featherweight Charm enchantment. (Burden and interference by 7 or 50%, whichever is higher.)",
            "type": "Material"
        },
        "65001": {
            "name": "Amnesia Shard",
            "desc": "Can be used to reset the unlocked potencies and experience of an equipment piece.",
            "type": "Material"
        },

        /////////////// Trophy ///////////////
        "30004": {
            "name": "Tenbora\'s Box",
            "desc": "This box is said to contain an item of immense power. You should get Snowflake to open it. [Tier 9]",
            "type": "Trophy"
        },
        "30016": {
            "name": "ManBearPig Tail",
            "desc": "No longer will MBP spread havoc, destruction, and melted polar ice caps. [Tier 2]",
            "type": "Trophy"
        },
        "30017": {
            "name": "Holy Hand Grenade of Antioch",
            "desc": "You found this item in the lair of a White Bunneh. It appears to be a dud. [Tier 2]",
            "type": "Trophy"
        },
        "30018": {
            "name": "Mithra\'s Flower",
            "desc": "A Lilac flower given to you by a Mithra when you defeated her. Apparently, this type was her favorite. [Tier 2]",
            "type": "Trophy"
        },
        "30019": {
            "name": "Dalek Voicebox",
            "desc": "Taken from the destroyed remains of a Dalek shell. [Tier 2]",
            "type": "Trophy"
        },
        "30020": {
            "name": "Lock of Blue Hair",
            "desc": "Given to you by Konata when you defeated her. It smells of Timotei. [Tier 2]",
            "type": "Trophy"
        },
        "30021": {
            "name": "Bunny-Girl Costume",
            "desc": "Given to you by Mikuru when you defeated her. If you wear it, keep it to yourself. [Tier 3]",
            "type": "Trophy"
        },
        "30022": {
            "name": "Hinamatsuri Doll",
            "desc": "Given to you by Ryouko when you defeated her. You decided to name it Achakura, for no particular reason. [Tier 3]",
            "type": "Trophy"
        },
        "30023": {
            "name": "Broken Glasses",
            "desc": "Given to you by Yuki when you defeated her. She looked better without them anyway. [Tier 3]",
            "type": "Trophy"
        },
        "30024": {
            "name": "Black T-Shirt",
            "desc": "A plain black 100% cotton T-Shirt. On the front, an inscription in white letters reads\: \"I defeated Real Life, and all I got was this lousy T-Shirt\" [Tier 4]",
            "type": "Trophy"
        },
        "30030": {
            "name": "Sapling",
            "desc": "A sapling from Yggdrasil, the World Tree. [Tier 4]",
            "type": "Trophy"
        },
        "30031": {
            "name": "Unicorn Horn",
            "desc": "An Invisible Pink Unicorn Horn taken from the Invisible Pink Unicorn. It doesn\'t weigh anything and has the consistency of air, but you\'re quite sure it\'s real. [Tier 5]",
            "type": "Trophy"
        },
        "30032": {
            "name": "Noodly Appendage",
            "desc": "A nutritious pasta-based appendage from the Flying Spaghetti Monster. [Tier 6]",
            "type": "Trophy"
        },
        "31001": {
            "name": "Platinum Coupon",
            "desc": "Retrieved as a Toplist Reward for active participation in the E-Hentai Galleries system. [Tier 8]",
            "type": "Trophy"
        },
        "31002": {
            "name": "Gold Coupon",
            "desc": "Retrieved as a Toplist Reward for active participation in the E-Hentai Galleries system. [Tier 7]",
            "type": "Trophy"
        },
        "31003": {
            "name": "Silver Coupon",
            "desc": "Retrieved as a Toplist Reward for active participation in the E-Hentai Galleries system. [Tier 5?]",
            "type": "Trophy"
        },
        "31004": {
            "name": "Bronze Coupon",
            "desc": "Retrieved as a Toplist Reward for active participation in the E-Hentai Galleries system. [Tier 3?]",
            "type": "Trophy"
        },
        "32025": {
            "name": "Museum Ticket",
            "desc": "A ticket to Snowflake&#039;s Search Engines Through The Ages Exhibition. A complimentary equipment piece will be handed out after the tour. [Easter 2023] [Tier 8]",
            "type": "Trophy"
        },
        "32203": {
            "name": "Star Compass",
            "desc": "An advanced technological artifact from an ancient and long-lost civilization. Handing these in at the Shrine of Snowflake will grant you a reward. [Tier 8]",
            "type": "Trophy"
        },

        /////////////// Artifact ///////////////
        "20001": {
            "name": "Precursor Artifact",
            "desc": "An advanced technological artifact from an ancient and long-lost civilization. Handing these in at the Shrine of Snowflake will grant you a reward.",
            "type": "Artifact"
        },

        /////////////// Figure ///////////////
        "70001": {
            "name": "Twilight Sparkle Figurine",
            "desc": "A 1/10th scale figurine of Twilight Sparkle, the cutest, smartest, all-around best pony. According to Pinkie Pie, anyway.",
            "type": "Figure"
        },
        "70002": {
            "name": "Rainbow Dash Figurine",
            "desc": "A 1/10th scale figurine of Rainbow Dash, flier extraordinaire. Owning this will make you about 20% cooler, but it probably took more than 10 seconds to get one.",
            "type": "Figure"
        },
        "70003": {
            "name": "Applejack Figurine",
            "desc": "A 1/10th scale figurine of Applejack, the loyalest of friends and most dependable of ponies. Equestria\'s best applebucker, and founder of Appleholics Anonymous.",
            "type": "Figure"
        },
        "70004": {
            "name": "Fluttershy Figurine",
            "desc": "A 1/10th scale figurine of Fluttershy, resident animal caretaker. You\'re going to love her. Likes baby dragons; Hates grown up could-eat-a-pony-in-one-bite dragons.",
            "type": "Figure"
        },
        "70005": {
            "name": "Pinkie Pie Figurine",
            "desc": "A 1/10th scale figurine of Pinkie Pie, a celebrated connoisseur of cupcakes and confectioneries. She just wants to keep smiling forever.",
            "type": "Figure"
        },
        "70006": {
            "name": "Rarity Figurine",
            "desc": "A 1/10th scale figurine of Rarity, the mistress of fashion and elegance. Even though she\'s prim and proper, she could make it in a pillow fight.",
            "type": "Figure"
        },
        "70007": {
            "name": "Trixie Figurine",
            "desc": "A 1/10th scale figurine of The Great and Powerful Trixie. After losing her wagon, she now secretly lives in the Ponyville library with her girlfriend, Twilight Sparkle.",
            "type": "Figure"
        },
        "70008": {
            "name": "Princess Celestia Figurine",
            "desc": "A 1/10th scale figurine of Princess Celestia, co-supreme ruler of Equestria. Bored of the daily squabble of the Royal Court, she has recently taken up sock swapping.",
            "type": "Figure"
        },
        "70009": {
            "name": "Princess Luna Figurine",
            "desc": "A 1/10th scale figurine of Princess Luna, aka Nightmare Moon. After escaping her 1000 year banishment to the moon, she was grounded for stealing Celestia\'s socks.",
            "type": "Figure"
        },
        "70010": {
            "name": "Apple Bloom Figurine",
            "desc": "A 1/10th scale figurine of Apple Bloom, Applejack\'s little sister. Comes complete with a \"Draw Your Own Cutie Mark\" colored pencil and permanent tattoo applicator set.",
            "type": "Figure"
        },
        "70011": {
            "name": "Scootaloo Figurine",
            "desc": "A 1/10th scale figurine of Scootaloo. Die-hard Dashie fanfilly, best pony of the Cutie Mark Crusaders, and inventor of the Wingboner Propulsion Drive. 1/64th chicken.",
            "type": "Figure"
        },
        "70012": {
            "name": "Sweetie Belle Figurine",
            "desc": "A 1/10th scale figurine of Sweetie Belle, Rarity\'s little sister. Comes complete with evening gown and cocktail dress accessories made of 100% Dumb Fabric.",
            "type": "Figure"
        },
        "70013": {
            "name": "Big Macintosh Figurine",
            "desc": "A 1/10th scale figurine of Big Macintosh, Applejack\'s older brother. Famed applebucker and draft pony, and an expert in applied mathematics.",
            "type": "Figure"
        },
        "70014": {
            "name": "Spitfire Figurine",
            "desc": "A 1/10th scale figurine of Spitfire, team leader of the Wonderbolts. Dashie\'s idol and occasional shipping partner. Doesn\'t actually spit fire.",
            "type": "Figure"
        },
        "70015": {
            "name": "Derpy Hooves Figurine",
            "desc": "A 1/10th scale figurine of Derpy Hooves, Ponyville\'s leading mailmare. Outspoken proponent of economic stimulus through excessive muffin consumption.",
            "type": "Figure"
        },
        "70016": {
            "name": "Lyra Heartstrings Figurine",
            "desc": "A 1/10th scale figurine of Lyra Heartstrings. Features twenty-six points of articulation, replaceable pegasus hoofs, and a detachable unicorn horn.",
            "type": "Figure"
        },
        "70017": {
            "name": "Octavia Figurine",
            "desc": "A 1/10th scale figurine of Octavia. Famous cello musician; believed to have created the Octatonic scale, the Octahedron, and the Octopus.",
            "type": "Figure"
        },
        "70018": {
            "name": "Zecora Figurine",
            "desc": "A 1/10th scale figurine of Zecora, a mysterious zebra from a distant land. She\'ll never hesitate to mix her brews or lend you a hand. Err, hoof.",
            "type": "Figure"
        },
        "70019": {
            "name": "Cheerilee Figurine",
            "desc": "A 1/10th scale figurine of Cheerilee, Ponyville\'s most beloved educational institution. Your teachers will never be as cool as Cheerilee.",
            "type": "Figure"
        },
        "70020": {
            "name": "Vinyl Scratch Figurine",
            "desc": "A 1/10th scale bobblehead figurine of Vinyl Scratch, the original DJ P0n-3. Octavia\'s musical rival and wub wub wub interest.",
            "type": "Figure"
        },
        "70021": {
            "name": "Daring Do Figurine",
            "desc": "A 1/10th scale figurine of Daring Do, the thrill-seeking, action-taking mare starring numerous best-selling books. Dashie\'s recolor and favorite literary character.",
            "type": "Figure"
        },
        "70022": {
            "name": "Doctor Whooves Figurine",
            "desc": "A 1/10th scale figurine of Doctor Whooves. Not a medical doctor. Once got into a hoof fight with Applejack over a derogatory remark about apples.",
            "type": "Figure"
        },
        "70023": {
            "name": "Berry Punch Figurine",
            "desc": "A 1/10th scale figurine of Berry Punch. Overly protective parent pony and Ponyville\'s resident lush. It smells faintly of fruit wine.",
            "type": "Figure"
        },
        "70024": {
            "name": "Bon-Bon Figurine",
            "desc": "A 1/10th scale figurine of Bon-Bon. Usually seen in the company of Lyra. Suffers from various throat ailments that make her sound different every time you see her.",
            "type": "Figure"
        },
        "70025": {
            "name": "Fluffle Puff Figurine",
            "desc": "A 1/10th scale fluffy figurine of Fluffle Puff. Best Bed Forever.",
            "type": "Figure"
        },
        "70101": {
            "name": "Angel Bunny Figurine",
            "desc": "A lifesize figurine of Angel Bunny, Fluttershy\'s faithful yet easily vexed pet and life partner. All-purpose assistant, time keeper, and personal attack alarm.",
            "type": "Figure"
        },
        "70102": {
            "name": "Gummy Figurine",
            "desc": "A lifesize figurine of Gummy, Pinkie Pie\'s faithful pet. Usually found lurking in your bathtub. While technically an alligator, he is still arguably the best pony.",
            "type": "Figure"
        },

        /////////////// Monster Item ///////////////
        "50001": {
            "name": "Crystal of Vigor",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Strength.",
            "type": "Monster Item"
        },
        "50002": {
            "name": "Crystal of Finesse",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Dexterity.",
            "type": "Monster Item"
        },
        "50003": {
            "name": "Crystal of Swiftness",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Agility.",
            "type": "Monster Item"
        },
        "50004": {
            "name": "Crystal of Fortitude",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Endurance.",
            "type": "Monster Item"
        },
        "50005": {
            "name": "Crystal of Cunning",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Intelligence.",
            "type": "Monster Item"
        },
        "50006": {
            "name": "Crystal of Knowledge",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Wisdom.",
            "type": "Monster Item"
        },
        "50011": {
            "name": "Crystal of Flames",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Fire Resistance.",
            "type": "Monster Item"
        },
        "50012": {
            "name": "Crystal of Frost",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Cold Resistance.",
            "type": "Monster Item"
        },
        "50013": {
            "name": "Crystal of Lightning",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Electrical Resistance.",
            "type": "Monster Item"
        },
        "50014": {
            "name": "Crystal of Tempest",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Wind Resistance.",
            "type": "Monster Item"
        },
        "50015": {
            "name": "Crystal of Devotion",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Holy Resistance.",
            "type": "Monster Item"
        },
        "50016": {
            "name": "Crystal of Corruption",
            "desc": "You can fuse this crystal with a monster in the monster tab to increase its Dark Resistance.",
            "type": "Monster Item"
        },
        "51001": {
            "name": "Monster Chow",
            "desc": "Non-discerning monsters like to munch on this chow.",
            "type": "Monster Item"
        },
        "51002": {
            "name": "Monster Edibles",
            "desc": "Mid-level monsters like to feed on something slightly more palatable, like these scrumptious edibles.",
            "type": "Monster Item"
        },
        "51003": {
            "name": "Monster Cuisine",
            "desc": "High-level monsters would very much prefer this highly refined level of dining if you wish to parlay their favor.",
            "type": "Monster Item"
        },
        "51011": {
            "name": "Happy Pills",
            "desc": "Tiny pills filled with delicious artificial happiness. Use on monsters to restore morale if you cannot keep them happy. It beats leaving them sad and miserable.",
            "type": "Monster Item"
        },
    };

    ///////// Code ///////////

    const hvgConfig_default = { // default config
        "Show popup description when hovering on the item": true,
        "Use orignal style HentaiVerse scrollbar": false
    };

    if (GM_getValue('Settings') == undefined) { // initialization
        GM_setValue('Settings', hvgConfig_default);
    }

    const hvgConfig = GM_getValue('Settings'); // get config

    const ifList = !Boolean(location.href.match(/itemid=[^0]\d+/)); // whether in list page

    function cE(name) { // document.createElement()
        return document.createElement(name);
    }

    function qS(name) { // document.querySelector()
        return document.querySelector(name);
    }

    function cB(ele) { // create box, for list page and single item page
        const id = Number(String((ifList ? ele.onclick : ele.href)).match(/\d+/g));
        if (marketList[id] == undefined) return; // to jump items not in the item list
        const foo = ifList ? ele.querySelector('td:nth-child(1)') : ele;
        foo.id = `item_${id}`;
        foo.setAttribute('onmouseover', `common.show_popup_box(10,-40,398,82,\'${ifList ? 'market_itemlist' : 'market_itemheader'}\',this,\'right\','${marketList[id].name.replace(/\'/g, '\\\'')}','${marketList[id].desc.replace(/\'/g, '\\\'')}','${marketList[id].type}')`);
        foo.setAttribute('onmouseout', 'common.hide_popup_box()');
    }

    async function popUpDesc() { // wait until the page finish
        await new Promise(resolve => window.addEventListener('load', resolve));
        if (hvgConfig["Show popup description when hovering on the item"]) { // config
            if (ifList) { // list page
                for (let i = 2; i <= document.querySelectorAll('#market_itemlist > table > tbody > tr').length; i++) { // child number begin with 2
                    const tr = qS(`#market_itemlist > table > tbody > tr:nth-child(${i})`);
                    cB(tr);
                }
            } else { // single item page
                const a = qS('#market_itemheader > div:nth-child(2) > a');
                cB(a);
            }
        }
    } popUpDesc();

  

    if (ifList && hvgConfig["Use orignal style HentaiVerse scrollbar"]) { //
        let upPos = qS('#market_itemlist');
        let downPos = qS('#form_market_itemfilter');
        const scrollUp = cE('div');
        scrollUp.setAttribute('onclick', 'common.scrollpane_up(\'market_itemlist\', 450)');
        scrollUp.setAttribute('class', 'csps');
        scrollUp.setAttribute('style', 'height: 0px; z-index: 1;');
        scrollUp.innerHTML = [
            `<img src="/y/scroll_up.png" alt="scroll_up.png">`,
            `<img src="/y/scroll_up.png" alt="scroll_up.png">`,
        ].join('');
        const scrollDown = cE('div');
        scrollDown.setAttribute('onclick', 'common.scrollpane_down(\'market_itemlist\', 450)');
        scrollDown.setAttribute('class', 'csps');
        scrollDown.setAttribute('style', 'height: 0px; z-index: 1;');
        scrollDown.innerHTML = [
            `<img src="/y/scroll_down.png" alt="scroll_down.png">`,
            `<img src="/y/scroll_down.png" alt="scroll_down.png">`,
        ].join('');
        const script = cE('script');
        script.type = 'text/javascript';
        script.innerHTML = [
            'function scrollpane_market_itemlist(event) {',
            '	event = event ? event : window.event;',
            '	var raw = event.detail ? event.detail : event.wheelDelta;',
            '	var normal = (event.detail ? event.detail * -1 : event.wheelDelta / 40) * 20;',
            '	if(normal > 0) {',
            '		common.scrollpane_up("market_itemlist", Math.abs(normal), 1);',
            '	} else if(normal < 0) {',
            '		common.scrollpane_down("market_itemlist", Math.abs(normal), 1);',
            '	}',
            '	common.cancelEvent(event);',
            '}',
            'common.hookEvent("market_itemlist", "mousewheel", scrollpane_market_itemlist);',
        ].join('');
        upPos.parentElement.insertBefore(scrollUp, upPos);
        downPos.parentElement.insertBefore(scrollDown, downPos);
        upPos.appendChild(script);
        upPos.setAttribute('class', 'csps');
        upPos.setAttribute('style', 'overflow:hidden');
    }

})();